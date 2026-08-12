// Take iNaturalist's own photograph for every plant and animal nobody has
// reviewed yet — the picture their taxon page opens with.
//
//   npm run hero:inat                    # fill every gap
//   npm run hero:inat -- --kind wildlife # only the animals
//   npm run hero:inat -- --only monarch  # one subject
//   npm run hero:inat -- --force         # refetch the ones already stored
//   npm run hero:inat -- --dry-run       # print the plan, ask nothing
//
// ## Why this exists beside `harvest-hero-photos.mjs`
//
// The review pipeline is the good one: a shortlist of ranked candidates, per
// region, and a person choosing. It is also the slow one — 298 plants and 82
// animals is a lot of sittings, and until somebody sits down the plant keeps its
// generic drawing and the animal keeps its emoji.
//
// iNaturalist has already done a version of this work. Every taxon page opens
// with a photograph its curators chose to represent the species, with a gallery
// of runners-up behind it in their order. It is not region-aware and nobody
// picked it for *us*, but it is a real photograph of the right species, chosen
// by people who know the group. As a floor under the gaps, that beats a drawing
// of a generic shrub.
//
// So this script asks one question per subject — "which photo do you show?" —
// and stores the answer in `src/data/inat-heroes.json`, a tier below the
// reviewed picks: `hero-photo.ts` reaches for it only when `hero-photos.json`
// and `wildlife-photos.json` have nothing. A subject that goes through review
// later simply stops reading from here.
//
// ## What it asks for, and what it refuses
//
// One request per 30 subjects (`/v1/taxa/<id>,<id>,…` batches, which is why a
// gap of 180 costs six requests and no image downloads at all). Animals need one
// extra request each first, because the wildlife catalog stores a scientific
// name rather than a number — resolved through `pickTaxon`, **the app's own
// function, imported**, so this script and the page can't disagree about which
// animal is meant.
//
// The licence check is ours, not theirs: iNaturalist happily shows an
// all-rights-reserved photo on a taxon page, and we can't. So the candidates are
// walked in iNaturalist's own order — the default photo, then the gallery — and
// the first one we may republish with its credit wins. A taxon whose whole
// gallery is all-rights-reserved gets nothing and keeps its drawing.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("hero:inat");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../src/data/inat-heroes.json");
const REVIEWED = {
  plant: resolve(HERE, "../src/data/hero-photos.json"),
  wildlife: resolve(HERE, "../src/data/wildlife-photos.json"),
};
const API = "https://api.inaturalist.org/v1/taxa";

const UA =
  "IndigeneHeroPhotos/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

/** Licences we may republish with attribution — the harvester's five, plus the
 *  two public-domain codes iNaturalist uses for photographs nobody holds rights
 *  over (`pd` is how a Wikimedia scan of a 1904 plate comes back). Anything
 *  else, "all rights reserved" above all, is skipped. */
const LICENCES = ["cc0", "pd", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"];

/** iNaturalist's taxa endpoint takes a comma-separated list; 30 is its page
 *  size, so a bigger batch would be silently truncated. */
const BATCH = 30;
/** Comfortably under iNaturalist's published 60 requests a minute. */
const PACE_MS = 1200;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const onlyKind = flag("--kind", "both");
const only = flag("--only");
const limit = flag("--limit") ? Number(flag("--limit")) : undefined;
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");

if (!["plants", "wildlife", "both"].includes(onlyKind)) {
  console.error(`--kind must be plants, wildlife or both (got "${onlyKind}").`);
  process.exit(1);
}

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
const { WILDLIFE } = await loader.load("/src/data/wildlife.ts");
const { buildTaxaUrl, pickTaxon } = await loader.load("/src/lib/inaturalist.ts");
await loader.close();

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
};
const reviewed = {
  plant: readJson(REVIEWED.plant),
  wildlife: readJson(REVIEWED.wildlife),
};
const stored = existsSync(OUT) ? readJson(OUT) : {};

// One job per subject — not per subject *and region*, which is the whole
// difference from the harvester. iNaturalist shows one photograph per taxon
// wherever you are, so there is one answer to store.
const jobs = [];
if (onlyKind !== "wildlife") {
  for (const entry of REGISTRY) {
    const id = entry.identifiers?.indigene;
    const taxonId = Number(entry.identifiers?.inat);
    if (!id || !taxonId) continue;
    jobs.push({ subject: "plant", id, taxonId, name: entry.scientificName });
  }
}
if (onlyKind !== "plants") {
  for (const w of WILDLIFE) {
    // An informal group ("Jays, turkeys & woodpeckers") maps to no single taxon,
    // so there is nothing to photograph it *as* — the same reason it gets no
    // species-record link and no "see it near you" lookup.
    if (!w.inat) continue;
    jobs.push({ subject: "wildlife", id: w.id, scope: w.inat, name: w.inat.name });
  }
}

const skipped = { reviewed: 0, stored: 0 };
const wanted = [];
for (const job of jobs) {
  if (only) {
    if (job.id === only) wanted.push(job);
    continue;
  }
  // A reviewed pick wins wherever it exists, so storing iNaturalist's answer
  // beside it would be bytes in everyone's download that nothing ever reads.
  if (reviewed[job.subject][job.id]) skipped.reviewed++;
  else if (stored[job.id] && !force) skipped.stored++;
  else wanted.push(job);
}
const todo = limit ? wanted.slice(0, limit) : wanted;

console.log(
  `${jobs.length} subjects · ${skipped.reviewed} already reviewed · ` +
    `${skipped.stored} already stored · ${todo.length} to ask about`,
);
if (!todo.length) {
  console.log("Nothing to do (--force to refetch what's stored).");
  process.exit(0);
}

const names = todo.filter((j) => j.subject === "wildlife").length;
const batches = Math.ceil(todo.length / BATCH);
if (dryRun) {
  console.log(`\n  ${names} name lookups + ${batches} taxon batches of up to ${BATCH}`);
  console.log(`  first batch: ${API}/${todo.slice(0, BATCH).map((j) => j.taxonId ?? "?").join(",")}`);
  console.log(`\n~${Math.ceil(((names + batches) * PACE_MS) / 60000)} min of pacing, no image downloads.`);
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function askJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`iNaturalist ${res.status} — ${url}`);
  return res.json();
}

const problems = [];

// Stage one: give every animal a taxon id, the same way the page does.
for (const job of todo.filter((j) => j.subject === "wildlife")) {
  try {
    const data = await askJson(buildTaxaUrl(job.scope.name, job.scope.iconic));
    job.taxonId = pickTaxon(data?.results, job.scope.name) ?? undefined;
    if (!job.taxonId) problems.push({ id: job.id, error: `no iNaturalist taxon for "${job.name}"` });
  } catch (err) {
    problems.push({ id: job.id, error: err.message });
  }
  await sleep(PACE_MS);
}

/** iNaturalist photo URLs carry the size as the last path segment; everything
 *  downstream derives `medium` and `large` from this one the same way. */
const squareUrl = (url) =>
  url.replace(/\/(square|small|medium|large|original)\.(\w+)/, "/square.$2");

/** iNaturalist's own order of preference: the photograph the taxon page opens
 *  with, then the gallery behind it. The first one we may republish wins — so a
 *  species whose chosen photo is all-rights-reserved still gets the best picture
 *  of it we're allowed to show, rather than nothing. */
function choose(taxon) {
  const seen = new Set();
  const gallery = [taxon.default_photo, ...(taxon.taxon_photos ?? []).map((tp) => tp.photo)];
  for (const photo of gallery) {
    if (!photo?.id || !photo.url || seen.has(photo.id)) continue;
    seen.add(photo.id);
    if (!LICENCES.includes(photo.license_code)) continue;
    return {
      taxonId: taxon.id,
      photoId: photo.id,
      url: squareUrl(photo.url),
      // The name to *print*, which iNaturalist gives separately from the login
      // precisely because the two differ: a photo's rights can belong to
      // someone who never had an account here.
      observer: photo.attribution_name ?? null,
      license: photo.license_code,
      // Verbatim, always. Nothing in this repo separates a photograph from the
      // credit iNaturalist states for it.
      attribution: photo.attribution ?? null,
      // Which rung of their gallery we landed on — 0 is the photo they show.
      // Kept out of the committed file; it's a number for this run's report.
      rank: gallery.indexOf(photo),
    };
  }
  return null;
}

// Stage two: ask for the taxa themselves, thirty at a time.
const ready = todo.filter((j) => j.taxonId);
const byTaxon = new Map();
for (const j of ready) byTaxon.set(j.taxonId, [...(byTaxon.get(j.taxonId) ?? []), j]);
const ids = [...byTaxon.keys()];

const chosen = new Map();
for (let i = 0; i < ids.length; i += BATCH) {
  const slice = ids.slice(i, i + BATCH);
  process.stdout.write(`taxa ${i + 1}–${i + slice.length} of ${ids.length} … `);
  try {
    const data = await askJson(`${API}/${slice.join(",")}`);
    for (const taxon of data?.results ?? []) chosen.set(taxon.id, choose(taxon));
    console.log(`${data?.results?.length ?? 0} back`);
  } catch (err) {
    console.log(`failed (${err.message})`);
    for (const id of slice) {
      for (const job of byTaxon.get(id) ?? []) problems.push({ id: job.id, error: err.message });
    }
  }
  await sleep(PACE_MS);
}

const picks = { ...stored };
const report = { taken: 0, past: 0, none: 0 };
for (const [taxonId, jobsForTaxon] of byTaxon) {
  const pick = chosen.get(taxonId);
  for (const job of jobsForTaxon) {
    if (!pick) {
      // Either the taxon didn't come back, or nothing in its gallery is
      // republishable. Both mean the same thing to the app: keep the drawing.
      if (chosen.has(taxonId)) report.none++;
      problems.push({ id: job.id, error: `no reusable photo for taxon ${taxonId}` });
      continue;
    }
    const { rank, ...record } = pick;
    report.taken++;
    if (rank > 0) report.past++;
    // A colour already computed for this exact photograph is still true.
    const before = stored[job.id];
    if (before?.color && before.photoId === record.photoId) record.color = before.color;
    picks[job.id] = record;
  }
}

// Sorted by subject id: the file is read by people in diffs, and insertion
// order would reshuffle it every time the catalog grows.
const sorted = Object.fromEntries(Object.keys(picks).sort().map((k) => [k, picks[k]]));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");

console.log(`\nwrote ${OUT.replace(resolve(HERE, "../.."), ".")}`);
console.log(
  `  ${report.taken} photographs · ${report.past} from past their first choice · ` +
    `${report.none} with nothing republishable · ${Object.keys(sorted).length} in the file`,
);
if (problems.length) {
  console.log(`\n${problems.length} without a photograph:`);
  for (const p of problems.slice(0, 20)) console.log(`  ${p.id} — ${p.error}`);
  if (problems.length > 20) console.log(`  …and ${problems.length - 20} more`);
}
console.log(`\nNext: npm run hero:colors — then commit.`);
