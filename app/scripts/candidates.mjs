// `npm run candidates -- --region <id>` — propose the next plants for a region,
// with the reason for each, for a human to accept or reject.
//
// This is `docs/coverage-plan.md` §4 step 2, which that document asked for and
// left unbuilt: *"a script that proposes the next N species for a region by
// joining ecoregion occurrences to host counts, for a human to accept or
// reject. This is what makes list growth repeatable instead of heroic."*
//
// ## What it is not
//
// **It does not write plant rows, and it must not.** A row carries a
// size-over-time curve, seven eco-scores, care and gives notes, a propagation
// method and a citable basis — `coverage-plan.md` §3 lists the fields that stay
// editorial and why. This script produces a *shortlist with evidence*. Somebody
// still reads it, throws half of it out, and writes the rows.
//
// ## The four terms, and how honest each one is
//
//   1. **Does it actually grow here, and commonly?** GBIF occurrence density
//      inside the region's own coverage box. This is the strongest term and the
//      most mechanical: a species with three records in the box is a flora entry,
//      not a garden plant.
//   2. **Is it native here, or naturalised?** iNaturalist's establishment means
//      for the place the region's box falls in. Without this the ranking is just
//      "commonest plants", which in California means fennel and mustard.
//   3. **Does it bring a genus the region's list doesn't have?** Straight from
//      our own committed rows. This is what stops the ranking returning a fourth
//      willow: the second species of a genus adds far less than the first.
//   4. **How much food web does that genus carry?** Our own `hostLepCount`, and
//      in the American regions **that number is a genus-level estimate**, not a
//      computed count — `docs/us-host-counts-plan.md` §2 records why (GloBI's
//      gate failed). The column is labelled every time it is printed. In the
//      French regions the same field is computed from the Gaytán matrix, so the
//      term is stronger there.
//
// Deliberately *not* scored, because no open source gives it: whether a nursery
// in the region actually sells the thing. Occurrence density is a poor proxy for
// it and is not presented as one. That check stays with the human, and
// `coverage-plan.md` §2 step 5 says so.
//
// ## The blind spot, which is worth knowing before you trust a ranking
//
// Term 1 rewards **abundance**, and ecological value is not abundance. The first
// run against the Pacific Northwest did not surface *Ceanothus* anywhere in its
// top fifteen — and Ceanothus is the one keystone genus `coverage-plan.md`
// already names as missing from that list. It is simply less recorded than
// bracken. So this ranking is a good way to find what a region is missing *among
// the plants people see a lot of*, and a bad way to find the scarce, high-value
// one that a person who knows the flora would name first. Read it alongside
// `npm run coverage`, which answers the complementary question — which forms,
// site types, bloom months and keystone genera the list has holes in — and never
// as a replacement for it.
//
// ## Usage
//
//   npm run candidates -- --region ca-south-coast
//   npm run candidates -- --region pnw --top 40
//   npm run candidates -- --region ca-south-coast --pool 500   # deeper GBIF pool
//   npm run candidates -- --region ca-south-coast --write      # write the .md
//
// Writes `docs/candidates/<region>.md` with `--write`, so a shortlist is
// reviewable in a diff the way `data/sources/globi/probe.json` is.
//
// Needs open internet (GBIF + iNaturalist). Behind a proxy this only works as
// `npm run candidates`, which sets NODE_USE_ENV_PROXY=1 — see `_net.mjs`.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("candidates");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const UA = "indigene-candidates/0.1 (+https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";
const GBIF = "https://api.gbif.org/v1";
const INAT = "https://api.inaturalist.org/v1";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

const REGION_ID = opt("region");
const TOP = Number(opt("top", 25));
const POOL = Number(opt("pool", 300));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 45000);
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (e) {
      if (attempt >= tries) throw e;
      await sleep(500 * attempt);
    }
  }
}

// ---------------------------------------------------------------- the region
const loader = await openLoader();
const { REGIONS } = await loader.load("/src/data/regions.ts");
await loader.close();

if (!REGION_ID) {
  console.error("Which region? e.g. --region ca-south-coast\n");
  console.error("  " + REGIONS.map((r) => r.meta.id).join("\n  "));
  process.exit(1);
}
const region = REGIONS.find((r) => r.meta.id === REGION_ID);
if (!region) {
  console.error(`No region "${REGION_ID}". Known: ${REGIONS.map((r) => r.meta.id).join(", ")}`);
  process.exit(1);
}
const { bounds: box, name: regionName } = region.meta;

// What the region already ships, which is terms 3 and 4.
const have = new Set(region.seed.map((p) => p.latin.toLowerCase()));
const haveGenus = new Set(region.seed.map((p) => p.latin.split(/\s+/)[0]));
// Host estimate per genus, taken across every region so a genus we have only in
// the Mid-Atlantic still scores when it turns up as a western candidate. Same
// caveat every time it is printed: in the US regions this is an estimate.
const hostByGenus = new Map();
const keystoneGenus = new Set();
for (const r of REGIONS) {
  for (const p of r.seed) {
    const g = p.latin.split(/\s+/)[0];
    hostByGenus.set(g, Math.max(hostByGenus.get(g) ?? 0, p.hostLepCount ?? 0));
    if (p.keystone) keystoneGenus.add(g);
  }
}

console.log(`\n${regionName} — ${region.seed.length} plants on the list today`);
console.log(`  box: ${box.minLat},${box.minLon} → ${box.maxLat},${box.maxLon}\n`);

// ------------------------------------------------- term 2's place, derived
// The region's box decides which place iNaturalist should be asked about, so no
// place id is hard-coded and a new region needs no new table entry. Prefer a
// state/province (admin level 10); fall back to the country.
const nearby = await getJson(
  `${INAT}/places/nearby?nelat=${box.maxLat}&nelng=${box.maxLon}&swlat=${box.minLat}&swlng=${box.minLon}&per_page=20`,
);
const standard = nearby?.results?.standard ?? [];
// *Every* state/province the box touches, not the first one returned. The
// Pacific Northwest box spans Oregon, Washington and British Columbia, and the
// first level-10 result is British Columbia — reading native status for a box
// that is mostly Oregon off the wrong side of an international border.
const places = standard.filter((p) => p.admin_level === 10);
if (!places.length) places.push(...standard.filter((p) => p.admin_level === 0));
if (!places.length) {
  console.error("iNaturalist has no standard place for this box, so native status can't be checked.");
  process.exit(1);
}
const placeIds = new Set(places.map((p) => p.id));
console.log(
  `native status will be read for: ${places.map((p) => p.display_name ?? p.name).join(", ")}\n`,
);

// ------------------------------------------------------- term 1: occurrences
process.stdout.write(`asking GBIF which plants are recorded in the box … `);
const facet = await getJson(
  `${GBIF}/occurrence/search?taxonKey=6&hasCoordinate=true` +
    `&decimalLatitude=${box.minLat},${box.maxLat}&decimalLongitude=${box.minLon},${box.maxLon}` +
    `&facet=speciesKey&facetLimit=${POOL}&limit=0`,
);
const counts = facet?.facets?.[0]?.counts ?? [];
console.log(`${facet.count.toLocaleString()} plant records, ${counts.length} species in the pool\n`);

// Resolve keys → names, politely and in small batches.
const pool = [];
for (let i = 0; i < counts.length; i += 8) {
  const slice = counts.slice(i, i + 8);
  const resolved = await Promise.all(
    slice.map(async (c) => {
      try {
        const sp = await getJson(`${GBIF}/species/${c.name}`);
        return { key: c.name, records: c.count, latin: sp.canonicalName ?? sp.scientificName, family: sp.family, rank: sp.rank };
      } catch {
        return null;
      }
    }),
  );
  pool.push(...resolved.filter(Boolean));
  process.stdout.write(`\r  named ${pool.length}/${counts.length}`);
  await sleep(120);
}
console.log("");

// Only species, nothing we already ship, no hybrids (a hybrid is a garden plant
// question, not a native-status one).
const fresh = pool.filter(
  (c) =>
    c.rank === "SPECIES" &&
    c.latin &&
    !c.latin.includes("×") &&
    c.latin.split(/\s+/).length === 2 &&
    !have.has(c.latin.toLowerCase()),
);
console.log(`  ${pool.length - fresh.length} dropped as already-shipped, hybrid or not-a-species`);
console.log(`  ${fresh.length} to check for native status\n`);

// ------------------------------------------------------ term 2: native status
// Ask about the best-scoring candidates first, so a small --top doesn't spend
// the whole run on the long tail.
const provisional = fresh
  .map((c) => ({ ...c, genus: c.latin.split(/\s+/)[0] }))
  .sort((a, b) => b.records - a.records);

const checkCount = Math.min(provisional.length, Math.max(TOP * 4, 60));
const shortlist = provisional.slice(0, checkCount);

// Two steps, because the obvious one-step version is wrong. The search endpoint
// carries an `establishment` field that is populated for some places (California)
// and empty for others (Oregon, Washington, and the United States as a whole),
// which reads as "no plant in Oregon has a known native status". The *detail*
// endpoint carries `listed_taxa`, which had 52 places for the first species
// tried, Oregon and Washington among them. So: resolve the name, then read the
// detail — and batch the details, which iNaturalist allows comma-separated.
const byId = new Map();
for (const c of shortlist) {
  try {
    const res = await getJson(`${INAT}/taxa?q=${encodeURIComponent(c.latin)}&rank=species&per_page=5`);
    // Exact name only. A fuzzy search for "Brassica nigra" happily returns
    // Hirschfeldia incana, and inheriting that record's status would be a
    // fabricated answer about a plant nobody asked about.
    const hit = (res?.results ?? []).find((t) => t.name?.toLowerCase() === c.latin.toLowerCase());
    if (hit) {
      c.inat = hit.id;
      byId.set(hit.id, c);
    } else {
      c.status = "no-inat-match";
    }
  } catch {
    c.status = "lookup-failed";
  }
  process.stdout.write(`\r  named ${shortlist.filter((x) => x.inat || x.status).length}/${checkCount}`);
  await sleep(650); // iNaturalist asks for ~1 request/second
}
console.log("");

const ids = [...byId.keys()];
for (let i = 0; i < ids.length; i += 25) {
  const batch = ids.slice(i, i + 25);
  try {
    const res = await getJson(`${INAT}/taxa/${batch.join(",")}`);
    for (const t of res?.results ?? []) {
      const c = byId.get(t.id);
      if (!c) continue;
      const listed = (t.listed_taxa ?? []).filter((l) => placeIds.has(l?.place?.id));
      // "Native somewhere in this region's own states" is the claim. If the
      // states disagree — native in Oregon, introduced in British Columbia —
      // say so rather than picking the flattering one.
      const values = [...new Set(listed.map((l) => l.establishment_means).filter(Boolean))];
      c.status = values.length === 0 ? "unknown" : values.length === 1 ? values[0] : values.join("/");
      c.statusPlaces = listed
        .map((l) => `${l.place.display_name ?? l.place.name}: ${l.establishment_means}`)
        .join(", ");
    }
  } catch {
    for (const id of batch) byId.get(id).status ??= "lookup-failed";
  }
  process.stdout.write(`\r  status for ${Math.min(i + 25, ids.length)}/${ids.length}`);
  await sleep(650);
}
for (const c of shortlist) c.status ??= "unknown";
const checked = shortlist;
console.log("\n");

// A status of "native/introduced" means the region's own states disagree about
// this plant. That is a real answer and a human should see it, so it goes to the
// unsure pile rather than being counted either way.
const natives = checked.filter((c) => c.status === "native" || c.status === "endemic");
const rejected = checked.filter((c) => c.status === "introduced");
const unsure = checked.filter((c) => !["native", "endemic", "introduced"].includes(c.status));

// ------------------------------------------------------------------ scoring
// Deliberately simple and printed in full, so a reader can disagree with the
// weights rather than with a black box. Occurrence is logged because the
// difference between 300 and 3,000 records matters more than 30,000 vs 33,000.
const score = (c) => {
  const commonness = Math.log10(1 + c.records) * 10;
  const newGenus = haveGenus.has(c.genus) ? 0 : 25;
  const host = Math.log10(1 + (hostByGenus.get(c.genus) ?? 0)) * 12;
  const keystone = keystoneGenus.has(c.genus) ? 10 : 0;
  return { total: commonness + newGenus + host + keystone, commonness, newGenus, host, keystone };
};
const ranked = natives
  .map((c) => ({ ...c, ...score(c) }))
  .sort((a, b) => b.total - a.total)
  .slice(0, TOP);

const why = (c) => {
  const bits = [];
  bits.push(`${c.records.toLocaleString()} records in the box`);
  if (!haveGenus.has(c.genus)) bits.push(`**new genus** for this list`);
  else bits.push(`genus already on the list`);
  const h = hostByGenus.get(c.genus);
  if (h) bits.push(`${c.genus} ≈ ${h} caterpillar spp. (estimate)`);
  if (keystoneGenus.has(c.genus)) bits.push("keystone genus");
  return bits.join("; ");
};

// ------------------------------------------------------------------- output
const lines = [];
lines.push(`# Candidate plants — ${regionName}`);
lines.push("");
lines.push(
  `Generated by \`npm run candidates -- --region ${REGION_ID}\`. **A shortlist, not a decision** — ` +
    `every row here still needs a human to check that a nursery sells it, and then to write the ` +
    `size curve, the care and gives notes and the basis by hand. See \`docs/coverage-plan.md\` §2–3.`,
);
lines.push("");
lines.push(
  `**Known blind spot:** this ranks by how often a plant is *recorded*, and ecological value is ` +
    `not abundance. The first Pacific Northwest run missed _Ceanothus_ entirely — the one keystone ` +
    `genus \`docs/coverage-plan.md\` already names as absent from that list — because it is less ` +
    `recorded than bracken. Read this next to \`npm run coverage\`, never instead of it.`,
);
lines.push("");
lines.push(
  `Pool: the ${counts.length} most-recorded plant species inside the region's coverage box, ` +
    `out of ${facet.count.toLocaleString()} georeferenced plant records (GBIF). ` +
    `Native status from iNaturalist's per-place listings for ${places.map((p) => p.display_name ?? p.name).join(", ")}. ` +
    `Caterpillar figures are **our own genus-level estimates**, not computed counts — ` +
    `\`docs/us-host-counts-plan.md\` §2.`,
);
lines.push("");
lines.push(`| # | Species | Family | Why it's here |`);
lines.push(`|---|---|---|---|`);
ranked.forEach((c, i) => {
  lines.push(`| ${i + 1} | **${c.latin}** | ${c.family ?? "—"} | ${why(c)} |`);
});
lines.push("");
lines.push(`## Ruled out as introduced (${rejected.length})`);
lines.push("");
lines.push(
  rejected.length
    ? rejected.map((c) => `${c.latin} (${c.records.toLocaleString()})`).join(" · ")
    : "_none in this pool_",
);
lines.push("");
lines.push(`## No answer on native status (${unsure.length})`);
lines.push("");
lines.push(
  "Not silently dropped: iNaturalist had no exact name match, or no establishment record for this place. " +
    "Any of these could be a fine candidate — somebody has to check by hand.",
);
lines.push("");
lines.push(
  unsure.length
    ? unsure.map((c) => `${c.latin} (${c.status})`).join(" · ")
    : "_none_",
);
lines.push("");

const md = lines.join("\n");
console.log(`top ${ranked.length} candidates:\n`);
ranked.forEach((c, i) => {
  console.log(`  ${String(i + 1).padStart(2)}. ${c.latin.padEnd(30)} ${why(c)}`);
});
console.log(`\n  ruled out as introduced: ${rejected.length}`);
console.log(`  no answer on native status: ${unsure.length}`);

if (flag("write")) {
  const dir = join(REPO_ROOT, "docs", "candidates");
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `${REGION_ID}.md`);
  writeFileSync(out, md);
  console.log(`\nwrote ${out}`);
} else {
  console.log(`\n(--write to save docs/candidates/${REGION_ID}.md)`);
}
