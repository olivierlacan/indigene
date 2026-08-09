// How often each native plant has been recorded *in its own ecoregion*, taken
// once and shipped with the app.
//
//   npm run region-counts        # refresh src/data/region-counts.ts
//   npm run region-counts -- --dry-run
//
// ## Why this exists, and what it is not
//
// The app's usual reading is taken in a 50 km circle around the reader's spot
// (`lib/rarity.ts`), which is the right circle: it answers "is this plant short
// around *my* garden?". But not every reader has given a spot. Somebody who
// picked their region from a list has no coordinates at all, and the "Where
// it's native" lookup deliberately isn't anywhere in particular — for both, the
// app could say nothing about how common a plant is.
//
// So this bakes the same arithmetic at region scale: for every region, the
// research-grade record count of each of its native taxa inside its coverage
// box, plus the count of *all* plant records in that box as the yardstick.
//
// **It is a coarser answer to a different question, and the copy says so.** The
// Mid-Atlantic box runs from Virginia to Vermont; measured against a 50 km
// circle around Philadelphia, 13 of that region's 40 natives land in a
// different band. Witch hazel is merely "recorded here and there" around one
// city and "one of the plants people record most" across nine degrees of
// latitude — both true, of different places. This never stands in for the spot
// reading; it fills in where there is no spot.
//
// ## All time, on purpose
//
// No date window. The reading is a *ratio* — this plant's share of everything
// anyone recorded here — so a window mostly cancels out of it: restricting to
// the last year moves 2 of those same 40 verdicts. What it does do is thin the
// counts until the arithmetic is noise, which is exactly what the small-count
// floor in `rarityLevel` exists to refuse.
//
// ## Why a separate job, not part of the deploy
//
// Same reasoning as `reconcile.mjs`: the Pages build stays hermetic. This runs
// on its own schedule, produces a reviewable data change, and the ordinary
// build ships whatever a human merged. Counts move slowly — a region gains a
// percent or two of records a month — so a monthly refresh is ahead of the
// data, and the app prints the date it was taken.
//
// No API key: iNaturalist's v1 endpoints answer anonymous GETs. What it does
// ask for is a real User-Agent and a request rate well under a hundred a
// minute, which this comfortably is — two requests per region.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("region-counts");

const UA = "Indigene/1.0 (+https://indigene.app; native plant recommendations)";
const API = "https://api.inaturalist.org/v1/observations";
const DRY = process.argv.includes("--dry-run");

/** Taxa per request — the same cap the app's runtime batch uses. */
const MAX_TAXA = 100;
/** Courtesy pause between requests. iNaturalist asks for well under 100/min. */
const PAUSE_MS = 1200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    // 429 and the 5xx family are "come back later", and this job has all the
    // time in the world; anything else is a real error worth stopping on.
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= 4) {
      throw new Error(`iNaturalist ${res.status} for ${url}`);
    }
    await sleep(PAUSE_MS * 2 ** attempt);
  }
}

/** The filters every request here shares — the same ones the app uses, so the
 *  baked number and a live one are the same measurement. */
function boxParams({ minLat, maxLat, minLon, maxLon }) {
  return new URLSearchParams({
    swlat: String(minLat),
    swlng: String(minLon),
    nelat: String(maxLat),
    nelng: String(maxLon),
    iconic_taxa: "Plantae",
    quality_grade: "research",
  });
}

/**
 * Add each returned row into every taxon we asked about that contains it —
 * itself or an ancestor. Mirrors `tallyByTaxon` in `lib/prominence.ts`, and for
 * the same reason: `species_counts` reports a variety under its own row, while
 * a single `taxon_id` count would have included it.
 */
function tally(results, wanted) {
  const out = new Map(wanted.map((id) => [id, 0]));
  for (const row of results ?? []) {
    if (typeof row?.count !== "number") continue;
    const taxon = row.taxon ?? {};
    const hits = new Set();
    for (const id of [taxon.id, ...(taxon.ancestor_ids ?? [])]) {
      const key = typeof id === "number" ? String(id) : null;
      if (key != null && out.has(key)) hits.add(key);
    }
    for (const key of hits) out.set(key, out.get(key) + row.count);
  }
  return out;
}

const chunk = (items, size) => {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

const loader = await openLoader();
const { REGIONS } = await loader.load("/src/data/regions.ts");
const { REGISTRY } = await loader.load("/src/data/registry.ts");
await loader.close();

const rows = [];
for (const { meta } of REGIONS) {
  const ids = REGISTRY.filter((e) => e.regions?.includes(meta.id))
    .map((e) => e.identifiers?.inat)
    .filter(Boolean);
  if (!ids.length) {
    console.log(`${meta.id}: no taxa carry an iNaturalist id yet — skipped`);
    continue;
  }

  const base = boxParams(meta.bounds);
  const totalUrl = `${API}?${base}&per_page=0`;
  const total = (await getJson(totalUrl)).total_results ?? 0;
  await sleep(PAUSE_MS);

  const counts = new Map();
  for (const part of chunk(ids, MAX_TAXA)) {
    const url = `${API}/species_counts?${base}&per_page=500&taxon_id=${part.join(",")}`;
    const data = await getJson(url);
    for (const [id, n] of tally(data.results, part)) counts.set(id, n);
    await sleep(PAUSE_MS);
  }

  const recorded = [...counts.values()].filter((n) => n > 0).length;
  console.log(
    `${meta.id}: ${recorded}/${ids.length} taxa recorded, yardstick ${total.toLocaleString("en-US")}`
  );
  rows.push({
    regionId: meta.id,
    total,
    // Sorted by taxon id so a refresh diffs as changed numbers, not a reshuffle.
    counts: Object.fromEntries([...counts].sort(([a], [b]) => Number(a) - Number(b))),
  });
}

// Day precision: the app prints the month, and a timestamp would make every
// refresh a diff even when no count moved.
const capturedAt = new Date().toISOString().slice(0, 10);
const file = `// GENERATED by scripts/build-region-counts.mjs — do not edit by hand.
// Research-grade iNaturalist record counts for each region's native taxa inside
// that region's coverage box, plus the box's all-plants yardstick. All time, no
// date window (see the script for why). Refresh: npm run region-counts
import type { RegionCounts } from "../types";

export const REGION_COUNTS: RegionCounts[] = ${JSON.stringify(
  rows.map((r) => ({ ...r, capturedAt })),
  null,
  2
)};
`;

const outPath = fileURLToPath(new URL("../src/data/region-counts.ts", import.meta.url));
if (DRY) {
  console.log(`\n--dry-run: would write ${rows.length} regions to ${outPath}`);
} else {
  writeFileSync(outPath, file);
  console.log(`\nWrote ${rows.length} regions to src/data/region-counts.ts (captured ${capturedAt}).`);
}
