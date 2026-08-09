// Harvest candidate photographs for every plant *and every animal* in the
// catalog, rank them, guess what each one is a picture of, and write the
// shortlist a human reviews. Stages one to two-and-a-half of the pipeline in
// docs/hero-photos.md; `build-hero-review.mjs` is stage three.
//
//   npm run hero:harvest                      # everything, everywhere
//   npm run hero:harvest -- --region pnw      # one region
//   npm run hero:harvest -- --plant acer-circinatum
//   npm run hero:harvest -- --kind wildlife   # only the animals
//   npm run hero:harvest -- --limit 5         # a quick sanity run
//   npm run hero:harvest -- --keep 12         # shortlist size (default 10)
//   npm run hero:harvest -- --no-angles       # skip the phenology queries
//   npm run hero:harvest -- --dry-run         # print the plan, ask nothing
//
// Needs open internet (iNaturalist), which the build sandbox blocks — run it
// locally or via .github/workflows/hero-photos.yml, which opens a PR with the
// refreshed shortlist. Same arrangement as `reconcile.mjs`, for the same reason.
//
// **What it asks for.** One request per subject per region it belongs to,
// bounded by that region's coverage box, research grade, photographed, and — the
// part that matters legally — `photo_license` restricted to the reusable
// Creative Commons codes. A photo we can't republish with its credit is not a
// candidate, so it is never downloaded, never scored, and never shown to a
// reviewer.
//
// **Plus two more asks per plant, for the pictures nobody scrolls far enough to
// find.** iNaturalist's pool for any given plant is overwhelmingly leaves, so a
// flowering shot and a fruiting shot can sit a hundred photographs deep. Those
// get queries of their own, filtered on the community's own Plant Phenology
// annotation (`_photo-angle.mjs`) — which is also what files them under "flower"
// and "fruit" on human authority rather than on our guessing.
//
// **Animals are harvested the same way**, minus the phenology asks (they mean
// nothing for a butterfly) and with one extra step: the wildlife catalog stores
// a scientific name rather than a numeric id, so the name is resolved through
// the same `pickTaxon` rules the app uses before anything is asked for.
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
import { fit, suggest, PHENOLOGY, PHENOLOGY_LABEL } from "./_photo-angle.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";
import { withSeeds } from "./_regions.mjs";

requireProxyAwareFetch("hero:harvest");

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

/** How many of iNaturalist's top-voted observations to consider per subject. */
const CONSIDER = 24;
/** …and how many from each of the two phenology asks. Smaller because those
 *  queries are already narrow: everything they return is on-topic, so the top
 *  handful is enough, and every extra one is another image to download. */
const CONSIDER_ANGLE = 10;
/** How many survive scoring and reach the reviewer, per query. */
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
const onlyKind = flag("--kind", "both"); // plants | wildlife | both
const limit = flag("--limit") ? Number(flag("--limit")) : undefined;
const dryRun = args.includes("--dry-run");
const withAngles = !args.includes("--no-angles");
const keep = Number(flag("--keep", String(DEFAULT_KEEP)));

if (!["plants", "wildlife", "both"].includes(onlyKind)) {
  console.error(`--kind must be plants, wildlife or both (got "${onlyKind}").`);
  process.exit(1);
}

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
const { REGIONS: REGIONS_RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(REGIONS_RAW);
const { WILDLIFE } = await loader.load("/src/data/wildlife.ts");
const { regionsForWildlife } = await loader.load("/src/lib/wildlife.ts");
// The app's own "which taxon does this name mean" rules, imported rather than
// re-stated: a harvest that resolved a name differently from the app would
// shortlist photographs of a different animal than the one the page looks up.
const { buildTaxaUrl, pickTaxon } = await loader.load("/src/lib/inaturalist.ts");
await loader.close();

const regionById = new Map(REGIONS.map((r) => [r.meta.id, r.meta]));

// One job per (subject, region) pair: a plant native to three regions gets three
// shortlists, because the right photo of a red maple in Florida is not
// necessarily the right one in the Mid-Atlantic. Animals work the same way.
const jobs = [];
if (onlyKind !== "wildlife") {
  for (const entry of REGISTRY) {
    const inat = entry.identifiers?.inat;
    const plantId = entry.identifiers?.indigene;
    if (!inat || !plantId) continue;
    if (onlyPlant && plantId !== onlyPlant) continue;
    for (const regionId of entry.regions ?? []) {
      if (onlyRegion && regionId !== onlyRegion) continue;
      if (regionById.has(regionId)) {
        jobs.push({ subject: "plant", id: plantId, inat, regionId, name: entry.scientificName });
      }
    }
  }
}
if (onlyKind !== "plants" && !onlyPlant) {
  for (const w of WILDLIFE) {
    // An informal group ("Jays, turkeys & woodpeckers") maps to no single taxon,
    // so there is nothing to photograph it *as* — the same reason it gets no
    // species-record link and no "see it near you" lookup.
    if (!w.inat) continue;
    for (const region of regionsForWildlife(w.id)) {
      if (onlyRegion && region.meta.id !== onlyRegion) continue;
      jobs.push({
        subject: "wildlife",
        id: w.id,
        scope: w.inat,
        regionId: region.meta.id,
        name: w.inat.name,
      });
    }
  }
}
const todo = limit ? jobs.slice(0, limit) : jobs;

if (!todo.length) {
  console.error("Nothing to harvest — check --region / --plant / --kind.");
  process.exit(1);
}
const plantJobs = todo.filter((j) => j.subject === "plant").length;
console.log(
  `harvesting ${todo.length} shortlist(s) — ${plantJobs} plant×region, ` +
    `${todo.length - plantJobs} animal×region — keeping the top ${keep} of each\n`,
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function askJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`iNaturalist ${res.status} — ${url}`);
  return res.json();
}

/**
 * The observations query for one subject in one region — the whole filter in one
 * place, so `--dry-run` prints exactly what a real run would send. `annotation`
 * is `{ term, value }` for the phenology asks and absent for the general one.
 */
function queryUrl(job, taxonId, annotation) {
  const b = regionById.get(job.regionId).bounds;
  const params = new URLSearchParams({
    taxon_id: String(taxonId),
    quality_grade: "research",
    photos: "true",
    photo_license: LICENCES.join(","),
    swlat: String(b.minLat), swlng: String(b.minLon),
    nelat: String(b.maxLat), nelng: String(b.maxLon),
    order_by: "votes",
    order: "desc",
    per_page: String(annotation ? CONSIDER_ANGLE : CONSIDER),
  });
  if (annotation) {
    params.set("term_id", String(annotation.term));
    params.set("term_value_id", String(annotation.value));
  }
  return `${API}?${params}`;
}

/** The queries one job makes: the general ask, plus — for plants, unless
 *  `--no-angles` — one for flowering observations and one for fruiting ones. */
function asksFor(job) {
  const asks = [{ phenology: null, annotation: null, consider: CONSIDER }];
  if (job.subject !== "plant" || !withAngles) return asks;
  for (const value of [PHENOLOGY.flowering, PHENOLOGY.fruiting]) {
    asks.push({
      phenology: PHENOLOGY_LABEL[value],
      annotation: { term: PHENOLOGY.term, value },
      consider: CONSIDER_ANGLE,
    });
  }
  return asks;
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
    console.log(`  ${String(n).padStart(3)} subjects  ${regionId}`);
  }
  const requests = todo.reduce((n, j) => n + asksFor(j).length, 0) +
    (onlyKind === "plants" ? 0 : new Set(todo.filter((j) => j.subject === "wildlife").map((j) => j.id)).size);
  const photos = todo.reduce((n, j) => n + asksFor(j).reduce((m, a) => m + a.consider, 0), 0);
  // Shown for a plant where the run has one: an animal's taxon id isn't known
  // until its name has been resolved, which is a request this mode won't spend.
  const sample = todo.find((j) => j.subject === "plant") ?? todo[0];
  console.log(`\nfirst query would be:\n  ${queryUrl(sample, sample.inat ?? 0, null)}\n`);
  console.log(
    `${requests} requests at ${PACE_MS} ms apart — ~${Math.ceil((requests * PACE_MS) / 60000)} min of pacing, ` +
      `plus up to ${photos} image downloads.`,
  );
  process.exit(0);
}

/** Name → taxon id, resolved once per animal however many regions it's in. */
const taxonCache = new Map();
async function taxonFor(job) {
  if (job.subject === "plant") return Number(job.inat);
  const key = `${job.scope.name}|${job.scope.iconic}`;
  if (!taxonCache.has(key)) {
    const data = await askJson(buildTaxaUrl(job.scope.name, job.scope.iconic));
    taxonCache.set(key, pickTaxon(data?.results, job.scope.name));
    await sleep(PACE_MS);
  }
  return taxonCache.get(key);
}

const shortlists = [];
const problems = [];

for (const [i, job] of todo.entries()) {
  const meta = regionById.get(job.regionId);
  const label = `${job.id} · ${job.regionId}`;
  process.stdout.write(`[${i + 1}/${todo.length}] ${label} … `);

  let taxonId;
  try {
    taxonId = await taxonFor(job);
  } catch (err) {
    console.log(`failed (${err.message})`);
    problems.push({ ...job, error: err.message });
    await sleep(PACE_MS);
    continue;
  }
  if (taxonId == null) {
    // A name iNaturalist doesn't know is a data problem worth seeing in the PR,
    // not a crash: every other subject in the run still gets its shortlist.
    console.log("no taxon matched");
    problems.push({ ...job, error: `no iNaturalist taxon for "${job.name}"` });
    await sleep(PACE_MS);
    continue;
  }

  // Flatten to one candidate per photo, carrying the credit we'd have to show
  // and which ask it came back from.
  const candidates = [];
  const seen = new Set();
  let failedAsk = null;
  for (const ask of asksFor(job)) {
    let page;
    try {
      page = await askJson(queryUrl(job, taxonId, ask.annotation));
    } catch (err) {
      failedAsk = err.message;
      await sleep(PACE_MS);
      continue;
    }
    let taken = 0;
    for (const obs of page.results ?? []) {
      for (const p of obs.photos ?? []) {
        if (!p.url || !p.license_code || !LICENCES.includes(p.license_code)) continue;
        // The same photograph can come back from two asks — a flowering
        // observation is also one of the most-favourited ones. Keep the first,
        // which is whichever ask is more specific about it.
        if (seen.has(p.id)) continue;
        // Past this ask's budget, and the cap is checked *before* marking the
        // photo seen: one the general query didn't have room for must still be
        // reachable by the flowering query, which is the whole point of asking
        // twice.
        if (taken >= ask.consider) break;
        seen.add(p.id);
        taken++;
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
          // What the community said this observation shows, when we asked for
          // it specifically. Null for the general query.
          phenology: ask.phenology,
          thumbUrl: sized(p.url, "square"),
          mediumUrl: sized(p.url, "medium"),
          largeUrl: sized(p.url, "large"),
        });
      }
      if (taken >= ask.consider) break;
    }
    await sleep(PACE_MS);
  }
  if (failedAsk && !candidates.length) {
    console.log(`failed (${failedAsk})`);
    problems.push({ ...job, error: failedAsk });
    continue;
  }
  if (failedAsk) problems.push({ ...job, error: `partial: ${failedAsk}` });

  if (!candidates.length) {
    console.log("no reusable photos");
    shortlists.push(emptyShortlist(job, meta));
    continue;
  }

  // Score on the medium rendition — big enough to judge focus, small enough that
  // a few hundred of them don't take all afternoon.
  const bytes = [];
  for (const c of candidates) {
    try {
      const res = await fetch(c.mediumUrl, { headers: { "User-Agent": UA } });
      if (res.ok) bytes.push({ key: String(c.photoId), bytes: Buffer.from(await res.arrayBuffer()) });
    } catch {
      /* a photo that won't download simply isn't a candidate */
    }
  }
  const scored = new Map((await scoreImages(bytes)).map((m) => [m.key, m]));

  const ranked = candidates
    .map((c) => {
      const quality = scored.get(String(c.photoId)) ?? null;
      if (!quality || quality.error) return null;
      const angleFit = fit(quality, c.phenology);
      return { ...c, quality, angleFit, angle: suggest(angleFit) };
    })
    .filter(Boolean)
    .sort((a, b) => b.quality.score - a.quality.score);

  // `keep` is per angle rather than per shortlist, so a plant whose pool is
  // ninety leaves and four berries doesn't hand the reviewer ten leaves and
  // nothing else. Every angle gets its own best few, and the general top of the
  // list is kept whole on top of that.
  const kept = new Map();
  for (const c of ranked.slice(0, keep)) kept.set(c.photoId, c);
  for (const angle of ["habit", "leaf", "flower", "fruit"]) {
    const forAngle = ranked
      .filter((c) => c.angle === angle)
      .sort((a, b) => b.angleFit[angle] - a.angleFit[angle] || b.quality.score - a.quality.score)
      .slice(0, keep);
    for (const c of forAngle) kept.set(c.photoId, c);
  }
  const finalists = ranked.filter((c) => kept.has(c.photoId));

  const tally = finalists.reduce((acc, c) => {
    if (c.angle) acc[c.angle] = (acc[c.angle] ?? 0) + 1;
    return acc;
  }, {});
  const tallyText = Object.entries(tally).map(([a, n]) => `${a} ${n}`).join(", ") || "unsorted";
  console.log(`${finalists.length} of ${candidates.length} (best ${finalists[0]?.quality.score ?? "—"} · ${tallyText})`);
  shortlists.push({ ...emptyShortlist(job, meta), candidates: finalists });
}

/** The shortlist row for a job, with no candidates in it yet. The wildlife
 *  `scope` is dropped — it's a lookup detail, and this file is read by a browser
 *  page that only needs to know what to call the subject. */
function emptyShortlist(job, meta) {
  return {
    subject: job.subject,
    id: job.id,
    inat: job.subject === "plant" ? job.inat : undefined,
    regionId: job.regionId,
    regionName: meta.name,
    name: job.name,
    candidates: [],
  };
}

mkdirSync(dirname(OUT), { recursive: true });
// `generatedAt` is deliberately absent: a timestamp would make every run a diff
// even when the shortlists are identical, which is noise in a PR whose whole
// job is "did the candidates change?".
writeFileSync(
  OUT,
  JSON.stringify(
    { keep, consider: CONSIDER, considerAngle: CONSIDER_ANGLE, angles: withAngles, licences: LICENCES, shortlists, problems },
    null,
    2,
  ) + "\n",
);

const withNone = shortlists.filter((s) => !s.candidates.length);
console.log(`\nwrote ${OUT.replace(resolve(HERE, "../.."), ".")}`);
console.log(`  ${shortlists.length} shortlists · ${withNone.length} with no reusable photo · ${problems.length} failed`);
if (withNone.length) console.log(`  none: ${withNone.map((s) => `${s.id}/${s.regionId}`).join(", ")}`);
console.log(`\nNext: npm run hero:review — then pick, and commit the picks.`);
