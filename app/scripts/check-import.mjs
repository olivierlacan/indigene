// Check how the iNaturalist import sorts a gardener's sightings
// (src/lib/inat-import.ts), against a fixed set of sightings in a real region.
//
// The sorting is the part of the import that can hurt someone: a native filed
// as an invasive gets a healthy plant pulled out. So each rule gets a case
// here — a planted native offered at "casual" grade, an invasive held back
// until others confirm it, a planted invasive held back even when confirmed,
// an invasive look-alike flagged — and the request itself is checked for what
// it must never ask for: a location.
//
//   npm run import:check
import { openLoader } from "./_load-ts.mjs";

const loader = await openLoader();
let failures = 0;
const expect = (ok, what) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  if (!ok) failures++;
};

try {
  const imp = await loader.load("/src/lib/inat-import.ts");
  const account = await loader.load("/src/lib/inat-account.ts");
  const { REGIONS, loadPlants } = await loader.load("/src/lib/plants.ts");

  // --- usernames -------------------------------------------------------------
  expect(account.parseLogin("kueda") === "kueda", "a bare username");
  expect(account.parseLogin(" @kueda ") === "kueda", "an @username");
  expect(account.parseLogin("https://www.inaturalist.org/people/kueda") === "kueda", "a profile link");
  expect(account.parseLogin("https://www.inaturalist.org/fr/people/kueda?tab=x") === "kueda", "a localized profile link");
  expect(account.parseLogin("someone@example.com") === null, "an email address is refused");
  expect(account.parseLogin("<script>") === null, "markup is refused");
  expect(account.parseLogin("a/b") === null, "a path is refused");

  // --- the request -------------------------------------------------------------
  const url = new URL(imp.buildOwnSightingsUrl("kueda", 1, Date.UTC(2026, 8, 24)));
  expect(url.origin === "https://api.inaturalist.org", "asks iNaturalist, nowhere else");
  expect(url.searchParams.get("user_login") === "kueda", "names the user");
  expect(url.searchParams.get("d1") === "2025-09-24", "reaches back a year");
  const fields = url.searchParams.get("fields") ?? "";
  expect(!/location|geojson|place|latitude|longitude|geoprivacy/.test(fields), `asks for no location (fields: ${fields})`);
  let threw = false;
  try { imp.buildOwnSightingsUrl("bad name&x=1", 1); } catch { threw = true; }
  expect(threw, "won't build a request from an invalid username");

  // --- pacing: one page at a time, a second apart ------------------------------
  const pace = async (total) => {
    const log = [];
    const net = {
      fetch: async (url) => {
        const page = Number(new URL(url).searchParams.get("page"));
        log.push(`fetch ${page}`);
        const left = Math.max(0, Math.min(200, total - (page - 1) * 200));
        const results = Array.from({ length: left }, (_, i) => ({ id: page * 1000 + i + 1, taxon: { id: 1, name: "Acer rubrum" } }));
        return new Response(JSON.stringify({ total_results: total, results }));
      },
      wait: async (ms) => { log.push(`wait ${ms}`); },
    };
    const out = await imp.fetchOwnSightings("kueda", undefined, net);
    return { log: log.join(", "), out };
  };
  const one = await pace(120);
  expect(one.log === "fetch 1", `a one-page account is one request (${one.log})`);
  const three = await pace(450);
  expect(three.log === "fetch 1, wait 1000, fetch 2, wait 1000, fetch 3", `pages go a second apart (${three.log})`);
  expect(three.out.sightings.length === 450 && !three.out.truncated, "every page is read");
  const many = await pace(5000);
  expect(many.log.split("fetch").length - 1 === 3 && many.out.truncated, "stops at three pages and says so");

  // --- sorting, in the Mid-Atlantic ------------------------------------------------
  const region = REGIONS.find((r) => r.meta.id === "mid-atlantic");
  const roster = await loadPlants(region);
  const raw = (id, taxonId, name, grade, captive, date = "2026-05-01") => ({
    id, uuid: null, observed_on: date, quality_grade: grade, captive,
    taxon: { id: taxonId, name, rank: "species" }, photos: [],
  });
  const sightings = imp.trimOwnSightings([
    raw(1, 48502, "Cercis canadensis", "casual", true, "2026-06-01"), // planted native, casual
    raw(2, 48502, "Cercis canadensis", "casual", true, "2026-04-01"), // same species again
    raw(3, 47912, "Asclepias tuberosa", "research", false), // native, already in the log
    raw(4, 133382, "Amelanchier canadensis", "casual", true), // native with an invasive look-alike
    raw(5, 56061, "Alliaria petiolata", "research", false), // confirmed, wild invasive
    raw(6, 64540, "Celastrus orbiculatus", "needs_id", false), // unconfirmed invasive
    raw(7, 61321, "Lythrum salicaria", "research", true), // confirmed but planted
    raw(8, 999999999, "Plantus imaginarius", "research", false), // on no list
    { id: 9, taxon: null }, // unidentified
  ]);
  expect(sightings.length === 8, "drops a sighting with no identification");

  const spot = { id: "s", invasives: [] };
  const plantings = [{ id: "p", spotId: "s", plantId: "asclepias-tuberosa", count: 1, planted: null, observations: ["3"], createdAt: 0 }];
  const sorted = imp.sortSightings(sightings, region, roster, spot, plantings);
  const nat = (id) => sorted.natives.find((m) => m.plant.id === id);

  expect(nat("cercis-canadensis")?.sighting.id === 1, "a planted native at casual grade is offered, newest sighting only");
  expect(sorted.natives.filter((m) => m.plant.id === "cercis-canadensis").length === 1, "a species is offered once");
  expect(nat("asclepias-tuberosa")?.inLog === true, "a sighting already in the log says so");
  expect(nat("amelanchier-canadensis")?.lookalikes.some((l) => l.lookalike.id === "pyrus-calleryana"), "a native with an invasive look-alike is flagged");
  expect(sorted.invasives.map((m) => m.invasive.id).join() === "alliaria-petiolata", "only the confirmed, wild invasive can be added");
  expect(sorted.unconfirmed.map((m) => m.invasive.id).sort().join() === "celastrus-orbiculatus,lythrum-salicaria", "unconfirmed and planted invasives wait");
  const everything = [...sorted.natives, ...sorted.invasives, ...sorted.unconfirmed].map((m) => m.sighting.id);
  expect(!everything.includes(8), "a plant on no list is left out");

  // --- the picker on one planting ------------------------------------------------
  // Every sighting of the plant, newest first — not just the newest, since a
  // later photo is the point — minus what's linked, under either name.
  const redbuds = imp.trimOwnSightings([
    raw(20, 48502, "Cercis canadensis", "casual", true, "2026-08-01"),
    { ...raw(21, 48502, "Cercis canadensis", "casual", true, "2026-07-01"), uuid: "776ee855-bf3d-4030-8c45-4c8424b03a56" },
    raw(22, 0, "Cercis canadensis", "needs_id", true, "2026-06-01"), // matched by name alone
    raw(23, 47912, "Asclepias tuberosa", "research", false),
  ]);
  const picks = imp.sightingsOfPlant(redbuds, "cercis-canadensis", ["20"]);
  expect(picks.map((s) => s.id).join() === "21,22", `offers every unlinked sighting of the plant (${picks.map((s) => s.id)})`);
  const byUuid = imp.sightingsOfPlant(redbuds, "cercis-canadensis", ["776ee855-bf3d-4030-8c45-4c8424b03a56"]);
  expect(!byUuid.some((s) => s.id === 21), "a sighting linked by its UUID isn't offered again");

  // --- a native is never an invasive where it's native ---------------------------
  // English ivy is on the Pacific Northwest's list and native in Atlantic France.
  const france = REGIONS.find((r) => r.meta.id === "france-atlantic");
  const frRoster = await loadPlants(france);
  if (frRoster.some((p) => p.id === "hedera-helix")) {
    const ivy = imp.trimOwnSightings([raw(10, 53186, "Hedera helix", "research", false)]);
    const fr = imp.sortSightings(ivy, france, frRoster, spot, []);
    expect(fr.natives.some((m) => m.plant.id === "hedera-helix") && !fr.invasives.length, "ivy is a native in Atlantic France, not an invasive");
  }

  expect(JSON.stringify(imp.plantedBy(sightings[0])) === JSON.stringify({ year: 2026, month: 6, day: 1 }), "the photo's date becomes the planting date");
} finally {
  await loader.close();
}

if (failures) {
  console.error(`\nimport: ${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nimport: sorting and request checks pass.");
