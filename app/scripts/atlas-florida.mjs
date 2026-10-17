// `npm run atlas` — what the Atlas of Florida Plants (USF) says about both
// Florida regions, read from the exports in `data/sources/atlas-florida/`.
// The exports are made by a person (the Atlas keeps scripts off); the only
// thing fetched is Kew, for the shortlist, and `--no-kew` skips even that.
//
// Two jobs:
//
//   npm run atlas                                     check every Florida row
//   npm run atlas -- --candidates florida-central     what to add next
//   npm run atlas -- --candidates florida-central --form fern
//   npm run atlas -- --candidates florida-south --fnps <plants.json>
//   npm run atlas -- --candidates florida-central --no-kew
//
// ## The check
//
// Native status for a Florida row is a claim (FNPS, or our own reading)
// corroborated by the Atlas, so every row we ship must be NATIVE in its
// region's export. NOT_NATIVE is the Atlas contradicting us; ABSENT means it
// has no record of the plant in the region's counties; MIXED means a binomial
// whose varieties disagree, so the row should name the native one. Any of
// those fails the run.
//
// ## The shortlist
//
// Atlas natives the region doesn't carry, joined with the FNPS harvest
// (`npm run harvest:fnps`, git-ignored, local) for what the Atlas doesn't
// record: form, zones, light, and whether anyone sells it. Only plants FNPS
// writes up, that grow in the region's zones and can be bought, are listed,
// grouped by form with the forms the region has least of first.
//
// Kew comes last, so it is asked only about what survives the rest: six at a
// time, with every answer kept in the git-ignored `wcvp/cache/kew-florida.json`.
// Both regions ask the same question (is it native in Florida, TDWG:FLA), so
// the second region and every rerun read the cache. `npm run native:check`
// still asks Kew again of every row a PR adds.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { atlasVerdict, indexAtlas, parseCsv } from "./_atlas.mjs";
import { REGION_FILE, REGION_ZONES, key, sells } from "./_fnps-parse.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";
import { wcvpAccepted, wcvpDistributions, wcvpStatus } from "./_wcvp.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const ATLAS = (region) => here(`../../data/sources/atlas-florida/${region}.csv`);
const FNPS_RAW = here("../../data/sources/fnps/raw/plants.json");
const KEW_CACHE = here("../../data/sources/wcvp/cache/kew-florida.json");
const KEW_WORKERS = 6;

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

/** The rows a region ships: id, latin, form. */
function ourRows(region) {
  const src = readFileSync(here(`../src/data/${REGION_FILE[region]}`), "utf8");
  const col = (field) => [...src.matchAll(new RegExp(`^    ${field}: "([^"]+)"`, "gm"))].map((m) => m[1]);
  const [ids, latins, forms] = [col("id"), col("latin"), col("form")];
  if (ids.length !== latins.length || ids.length !== forms.length) {
    throw new Error(`${REGION_FILE[region]}: ${ids.length} ids, ${latins.length} names, ${forms.length} forms — the file's shape changed`);
  }
  return ids.map((id, i) => ({ id, latin: latins[i], form: forms[i] }));
}

/**
 * Kew's verdict for Florida on each name, asked a few at a time and cached.
 * @returns {Promise<Map<string, {kew: string, accepted: string|null}>>}
 */
async function askKew(latins) {
  const cache = existsSync(KEW_CACHE) ? JSON.parse(readFileSync(KEW_CACHE, "utf8")) : {};
  const queue = latins.filter((l) => !(l in cache));
  const total = queue.length;
  let done = 0;
  const save = () => {
    mkdirSync(here("../../data/sources/wcvp/cache/"), { recursive: true });
    writeFileSync(KEW_CACHE, `${JSON.stringify(cache, null, 1)}\n`);
  };
  const worker = async () => {
    for (let latin = queue.shift(); latin; latin = queue.shift()) {
      const usage = await wcvpAccepted(latin);
      const kew = usage ? wcvpStatus(await wcvpDistributions(usage.key), (r) => r.locationId === "TDWG:FLA") : "NO MATCH";
      cache[latin] = { kew, accepted: usage?.name ?? null, asked: new Date().toISOString().slice(0, 10) };
      process.stdout.write(`\r  asked Kew about ${++done}/${total}`);
      if (done % 25 === 0) save();
    }
  };
  if (total) {
    await Promise.all(Array.from({ length: KEW_WORKERS }, worker));
    save();
    process.stdout.write("\n");
  }
  console.log(`Kew: ${latins.length - total} answered from the cache, ${total} asked.`);
  return new Map(latins.map((l) => [l, cache[l]]));
}

const loadAtlas = (region) => indexAtlas(parseCsv(readFileSync(ATLAS(region), "utf8")));

function check() {
  let failures = 0;
  for (const region of Object.keys(REGION_FILE)) {
    const atlas = loadAtlas(region);
    const rows = ourRows(region);
    const bad = rows
      .map((r) => ({ ...r, ...atlasVerdict(atlas, r.latin) }))
      .filter((r) => r.verdict !== "NATIVE");
    console.log(`${region}: ${rows.length - bad.length} of ${rows.length} rows native per the Atlas`);
    for (const r of bad) {
      const detail = r.rows.map((a) => `${a.scientific_name}: ${a.native || "blank"}`).join("; ");
      console.log(`  ✗ ${r.latin.padEnd(34)} ${r.verdict}${detail ? ` (${detail})` : ""}`);
    }
    failures += bad.length;
  }
  if (failures) {
    console.log(`\n${failures} row(s) the Atlas does not corroborate. Fix the row, or take it off the list.`);
    process.exitCode = 1;
  }
}

// FNPS's forms, in our vocabulary (`PlantForm` in src/types.ts). Palms go with
// trees, as cabbage palm does; sedges with grasses; aquatics with perennials.
// FNPS has no groundcover form, so those are picked from the perennials by a
// person. A herb FNPS calls annual is an annual.
const FORM = { tree: "tree", palm: "tree", shrub: "shrub", herb: "perennial", aquatic: "perennial", grass: "grass", sedge: "grass", fern: "fern", vine: "vine" };
const formOf = (p) => {
  const theirs = (p.form[0] ?? "").toLowerCase();
  if (theirs === "herb" && p.lifeSpan === "annual") return "annual";
  return FORM[theirs] ?? theirs ?? "?";
};

async function candidates(region) {
  if (!REGION_FILE[region]) throw new Error(`unknown Florida region "${region}" — florida-central or florida-south`);
  const atlas = loadAtlas(region);
  const ours = ourRows(region);
  const shipped = new Set(ours.map((r) => key(r.latin)));
  const natives = [...atlas.exact.values()].filter((r) => r.native === "Y" && !shipped.has(key(r.scientific_name)));
  console.log(`${region}: the Atlas records ${natives.length} natives in its counties that we don't carry.`);

  const fnpsPath = flag("--fnps") ?? FNPS_RAW;
  if (!existsSync(fnpsPath)) {
    console.log("No FNPS harvest here, so no forms, zones or availability to sort them by.");
    console.log("Run `npm run harvest:fnps` first.");
    return;
  }
  const fnps = Object.values(JSON.parse(readFileSync(fnpsPath, "utf8")).plants).filter(Boolean);
  const fnpsByKey = new Map(fnps.map((p) => [key(p.latin), p]));
  const zones = REGION_ZONES[region];
  const onlyForm = flag("--form");

  const picks = [];
  const tally = { notWrittenUp: 0, outOfZone: 0, notSold: 0 };
  for (const k of new Set(natives.map((r) => key(r.scientific_name)))) {
    const p = fnpsByKey.get(k);
    if (!p) { tally.notWrittenUp++; continue; }
    if (!p.zones.some((z) => zones.includes(z))) { tally.outOfZone++; continue; }
    if (!sells(p)) { tally.notSold++; continue; }
    const form = formOf(p);
    if (onlyForm && form !== onlyForm) continue;
    const a = atlas.byBinomial.get(k)[0];
    picks.push({ form, latin: p.latin, common: p.common, p, a });
  }
  console.log(
    `FNPS read: ${fnps.length} plants. Of the Atlas natives above, ${tally.notWrittenUp} have no FNPS page, ` +
      `${tally.outOfZone} grow outside zones ${zones.join("/")}, ${tally.notSold} can't be bought.`,
  );

  let kew = null;
  if (!args.includes("--no-kew")) {
    requireProxyAwareFetch("atlas");
    kew = await askKew(picks.map((x) => x.latin));
  }

  const have = {};
  for (const r of ours) have[r.form] = (have[r.form] ?? 0) + 1;
  const groups = new Map();
  for (const x of picks) groups.set(x.form, [...(groups.get(x.form) ?? []), x]);
  const order = [...groups.keys()].sort((a, b) => (have[a] ?? 0) - (have[b] ?? 0) || a.localeCompare(b));

  for (const form of order) {
    const rows = groups.get(form).sort((a, b) => a.latin.localeCompare(b.latin));
    console.log(`\n${form} — ${rows.length} to consider (we carry ${have[form] ?? 0})`);
    for (const { latin, common, p, a } of rows) {
      const k = kew?.get(latin);
      const theirs = (p.form[0] ?? "").toLowerCase();
      const flags = [
        theirs !== form && theirs !== "herb" && `FNPS: ${theirs}`,
        k && k.kew !== "NATIVE" && `Kew: ${k.kew}`,
        k?.accepted && key(k.accepted) !== key(latin) && `Kew: ${k.accepted}`,
        a.endemic === "Y" && "endemic",
        a.status_state && a.status_state.replace("-State", " (FL)"),
        a.status_us && a.status_us.replace("-US", " (US)"),
      ].filter(Boolean);
      console.log(
        `  ${latin.padEnd(34)} ${(common ?? "").split(",")[0].slice(0, 24).padEnd(24)} ` +
          `${p.light.join("/").padEnd(28)} ${p.availability.join(", ")}${flags.length ? `  [${flags.join(", ")}]` : ""}`,
      );
    }
  }
  console.log(
    kew
      ? "\nA shortlist, not a decision: Kew agrees unless a row says otherwise, and each still needs a person."
      : "\nA shortlist, not a decision: Kew wasn't asked (--no-kew), and each still needs a person.",
  );
}

const region = flag("--candidates");
region ? await candidates(region) : check();
