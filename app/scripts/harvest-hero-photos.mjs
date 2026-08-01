// Harvest candidate hero photos for every plant in the catalog, rank them, and
// write the shortlist a human reviews. Stage one and two of the pipeline in
// docs/hero-photos.md; `build-hero-review.mjs` is stage three.
//
//   npm run hero:harvest                      # every plant, every region
//   npm run hero:harvest -- --region pnw      # one region
//   npm run hero:harvest -- --plant acer-circinatum
//   npm run hero:harvest -- --limit 5         # a quick sanity run
//   npm run hero:harvest -- --keep 12         # shortlist size (default 10)
//   npm run hero:harvest -- --dry-run         # print the plan, ask nothing
//
// Needs open internet (iNaturalist), which the build sandbox blocks — run it
// locally or via .github/workflows/hero-photos.yml, which opens a PR with the
// refreshed shortlist. Same arrangement as `reconcile.mjs`, for the same reason.
//
// **What it asks for.** One request per plant per region it's native to, bounded
// by that region's coverage box, research grade, photographed, and — the part
// that matters legally — `photo_license` restricted to the reusable Creative
// Commons codes. A photo we can't republish with its credit is not a candidate,
// so it is never downloaded, never scored, and never shown to a reviewer.
//
// **Two rankings, deliberately.** iNaturalist is asked for its own favourites
// first (`order_by=votes`) — community faves are a strong, free prior for "this
// is a good photograph of the thing". Then `_photo-quality.mjs` re-ranks those
// candidates on the pixels. Neither signal knows what a plant should look like,
// which is exactly why the output is a shortlist and not a decision.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { scoreImages } from "./_photo-quality.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../../docs/hero-photos/candidates.json");
const API = "https://api.inaturalist.org/v1/observations";

// Node lets us send a real User-Agent (a browser wouldn't), and iNaturalist asks
// API users to identify themselves. Same form as the reconcile script's.
const UA =
  "IndigeneHeroPhotos/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

/** Licences we may republish with attribution. Anything else — "all rights
 *  reserved" above all — is excluded at the query, not filtered afterwards. */
const LICENCES = ["cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"];

/** How many of iNaturalist's top-voted observations to consider per plant. */
const CONSIDER = 24;
/** How many survive scoring and reach the reviewer. */
const DEFAULT_KEEP = 10;
/** iNaturalist asks for under 60 requests a minute; this is comfortably under. */
const PACE_MS = 1200;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const onlyRegion = flag("--region");
const onlyPlant = flag("--plant");
const limit = flag("--limit") ? Number(flag("--limit")) : undefined;
const dryRun = args.includes("--dry-run");
const keep = Number(flag("--keep", String(DEFAULT_KEEP)));

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
const { REGIONS } = await loader.load("/src/data/regions.ts");
await loader.close();

const regionById = new Map(REGIONS.map((r) => [r.meta.id, r.meta]));

// One job per (plant, region) pair: a plant native to three regions gets three
// shortlists, because the right photo of a red maple in Florida is not
// necessarily the right one in the Mid-Atlantic.
const jobs = [];
for (const entry of REGISTRY) {
  const inat = entry.identifiers?.inat;
  const plantId = entry.identifiers?.indigene;
  if (!inat || !plantId) continue;
  if (onlyPlant && plantId !== onlyPlant) continue;
  for (const regionId of entry.regions ?? []) {
    if (onlyRegion && regionId !== onlyRegion) continue;
    if (regionById.has(regionId)) jobs.push({ plantId, inat, regionId, name: entry.scientificName });
  }
}
const todo = limit ? jobs.slice(0, limit) : jobs;

if (!todo.length) {
  console.error("Nothing to harvest — check --region / --plant.");
  process.exit(1);
}
console.log(`harvesting ${todo.length} plant×region shortlist(s), keeping the top ${keep} of each\n`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function askJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`iNaturalist ${res.status} — ${url}`);
  return res.json();
}

/** The observations query for one plant in one region — the whole filter in one
 *  place, so `--dry-run` prints exactly what a real run would send. */
function queryUrl(job) {
  const b = regionById.get(job.regionId).bounds;
  const params = new URLSearchParams({
    taxon_id: job.inat,
    quality_grade: "research",
    photos: "true",
    photo_license: LICENCES.join(","),
    swlat: String(b.minLat), swlng: String(b.minLon),
    nelat: String(b.maxLat), nelng: String(b.maxLon),
    order_by: "votes",
    order: "desc",
    per_page: String(CONSIDER),
  });
  return `${API}?${params}`;
}

/** iNaturalist photo URLs carry the size as the last path segment. */
const sized = (url, size) => url.replace(/\/(square|small|medium|large|original)\.(\w+)/, `/${size}.$2`);

// A dry run is how you check the plan — and the exact query — without spending
// a single request. It's also the only part of this script the build sandbox
// can run, since everything past here needs the network.
if (dryRun) {
  const byRegion = new Map();
  for (const j of todo) byRegion.set(j.regionId, (byRegion.get(j.regionId) ?? 0) + 1);
  for (const [regionId, n] of [...byRegion].sort()) {
    console.log(`  ${String(n).padStart(3)} plants  ${regionId}`);
  }
  console.log(`\nfirst query would be:\n  ${queryUrl(todo[0])}\n`);
  console.log(
    `${todo.length} requests at ${PACE_MS} ms apart — ~${Math.ceil((todo.length * PACE_MS) / 60000)} min of pacing, ` +
    `plus up to ${todo.length * CONSIDER} image downloads.`,
  );
  process.exit(0);
}

const shortlists = [];
const problems = [];

for (const [i, job] of todo.entries()) {
  const meta = regionById.get(job.regionId);
  const label = `${job.plantId} · ${job.regionId}`;
  process.stdout.write(`[${i + 1}/${todo.length}] ${label} … `);

  let page;
  try {
    page = await askJson(queryUrl(job));
  } catch (err) {
    console.log(`failed (${err.message})`);
    problems.push({ ...job, error: err.message });
    await sleep(PACE_MS);
    continue;
  }

  // Flatten to one candidate per photo, carrying the credit we'd have to show.
  const candidates = [];
  for (const obs of page.results ?? []) {
    for (const p of obs.photos ?? []) {
      if (!p.url || !p.license_code || !LICENCES.includes(p.license_code)) continue;
      candidates.push({
        photoId: p.id,
        observationId: obs.id,
        observer: obs.user?.login ?? null,
        observedOn: obs.observed_on ?? null,
        place: obs.place_guess ?? null,
        taxonName: obs.taxon?.name ?? null,
        license: p.license_code,
        attribution: p.attribution ?? null,
        faves: obs.faves_count ?? 0,
        thumbUrl: sized(p.url, "square"),
        mediumUrl: sized(p.url, "medium"),
        largeUrl: sized(p.url, "large"),
      });
    }
  }

  if (!candidates.length) {
    console.log("no reusable photos");
    shortlists.push({ ...job, regionName: meta.name, candidates: [] });
    await sleep(PACE_MS);
    continue;
  }

  // Score on the medium rendition — big enough to judge focus, small enough that
  // a few hundred of them don't take all afternoon.
  const bytes = [];
  for (const c of candidates.slice(0, CONSIDER)) {
    try {
      const res = await fetch(c.mediumUrl, { headers: { "User-Agent": UA } });
      if (res.ok) bytes.push({ key: String(c.photoId), bytes: Buffer.from(await res.arrayBuffer()) });
    } catch {
      /* a photo that won't download simply isn't a candidate */
    }
  }
  const scored = new Map((await scoreImages(bytes)).map((m) => [m.key, m]));

  const ranked = candidates
    .map((c) => ({ ...c, quality: scored.get(String(c.photoId)) ?? null }))
    .filter((c) => c.quality && !c.quality.error)
    .sort((a, b) => b.quality.score - a.quality.score)
    .slice(0, keep);

  console.log(`${ranked.length} of ${candidates.length} (best ${ranked[0]?.quality.score ?? "—"})`);
  shortlists.push({ ...job, regionName: meta.name, candidates: ranked });
  await sleep(PACE_MS);
}

mkdirSync(dirname(OUT), { recursive: true });
// `generatedAt` is deliberately absent: a timestamp would make every run a diff
// even when the shortlists are identical, which is noise in a PR whose whole
// job is "did the candidates change?".
writeFileSync(
  OUT,
  JSON.stringify({ keep, consider: CONSIDER, licences: LICENCES, shortlists, problems }, null, 2) + "\n",
);

const withNone = shortlists.filter((s) => !s.candidates.length);
console.log(`\nwrote ${OUT.replace(resolve(HERE, "../.."), ".")}`);
console.log(`  ${shortlists.length} shortlists · ${withNone.length} with no reusable photo · ${problems.length} failed`);
if (withNone.length) console.log(`  none: ${withNone.map((s) => `${s.plantId}/${s.regionId}`).join(", ")}`);
console.log(`\nNext: npm run hero:review — then pick, and commit the picks.`);
