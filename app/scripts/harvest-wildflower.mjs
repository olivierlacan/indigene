// `npm run harvest:wildflower` — pull the Lady Bird Johnson Wildflower Center's
// "Recommended Species" list for each US region, as a second society benchmark.
//
// ## Why a second one
//
// The first (`harvest-audubon.mjs`) turned out to be trustworthy in the East and
// unusable in the West: Audubon's flora for Portland has no Douglas-fir, and 38
// to 43 of our western rows are absent from it. A comparison that can't be run
// where our lists are longest isn't much of a comparison.
//
// The Wildflower Center's per-state Recommended Species lists cover the West
// properly — 226 species for Washington — and, usefully, they already split the
// two states where a state is plainly too coarse: California into Northern and
// Southern, Florida into North, Central and South. That is close enough to our
// own carve to be worth asking.
//
// ## What it is, and the two things it is not
//
// It is a **recommendation** list: species the Center puts forward for gardens
// and landscapes in a state. There is no flora tier here, so absence from it
// means "they didn't recommend it", never "it isn't native" — the native-status
// check in `npm run societies` leans on Audubon's flora tier for that, and says
// so.
//
// And it is **not fully independent of us.** DATA_SOURCES.md already lists the
// Wildflower Center as a reference for size, bloom and culture notes in our seed
// data. What is independent is the *selection*: nobody consulted their state
// list when deciding which species a region of ours carries. So a gap here is
// evidence; an agreement on a plant's bloom month would not be.
//
// ## Granularity, stated once
//
// A state is bigger than any region we ship. Washington and Oregon both run
// east of the Cascades into country our PNW list deliberately excludes, and
// Michigan's list spans a boreal north and a temperate south we treat as three
// different floras. So "their picks we lack" is an over-count here in a way it
// is not for a ZIP-scoped source, and the report says which source a number
// came from.
//
// ## Usage
//
//   npm run harvest:wildflower                  every region
//   npm run harvest:wildflower -- --region pnw  one region
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("harvest:wildflower");

const OUT_DIR = fileURLToPath(
  new URL("../../data/sources/wildflower-center/raw/", import.meta.url),
);

const BASE = "https://www.wildflower.org/collections/collection.php";
const PER_PAGE = 100; // the largest the page offers

// Region → the Center's own collection codes. Chosen to sit as close to each
// region's coverage box as their codes allow; where a code is plainly wider
// than us, the note says so and the report leans on it less.
const COLLECTIONS = {
  // The Piedmont core the list is tuned to. NY and New England are inside our
  // box but left out here on purpose: adding nine states' recommendations
  // inflates "we lack" with coastal-plain and New England specialties this
  // Pennsylvania-referenced list never claimed.
  "mid-atlantic": ["PA", "NJ", "MD", "DE", "VA"],
  "north-michigan": ["MI"], // whole state, incl. the warmer south we exclude
  pnw: ["WA", "OR"], // both run east of the Cascade crest; we do not
  "ca-south-coast": ["CA_south"],
  "ca-central-coast": ["CA_north"],
  "florida-central": ["FL_central", "FL_north"],
  "florida-south": ["FL_south"],
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

const args = process.argv.slice(2);
const only = args[args.indexOf("--region") + 1];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getHtml(url, attempt = 0) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    if (attempt >= 3) throw err;
    await sleep(1000 * 2 ** attempt);
    return getHtml(url, attempt + 1);
  }
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Rows on one page.
 *
 * Each plant is linked twice (thumbnail and name), so this splits on the link,
 * takes the botanical name from the first italics in each chunk, and dedupes by
 * the plant id. An earlier version matched link and name in one regex and
 * silently dropped every row whose markup differed slightly — 25 of Washington's
 * 226. Hence `harvest()` below insisting the count comes out exactly right.
 */
function parseRows(html) {
  const byId = new Map();
  for (const chunk of html.split("id_plant=").slice(1)) {
    const id = chunk.match(/^([A-Z0-9]+)/)?.[1];
    const latin = chunk.match(/<i>([^<]+)<\/i>/)?.[1];
    if (!id || !latin) continue;
    if (byId.has(id)) continue;
    const common = chunk.match(/<\/i>\s*<\/a>\s*(?:<[^>]*>\s*)*([^<\n]{2,80})/)?.[1];
    byId.set(id, { id, latin: decode(latin), common: common ? decode(common) : null });
  }
  return [...byId.values()];
}

const totalOf = (html) => {
  const m = html.match(/([\d,]+)\s+Results/i);
  return m ? Number(m[1].replace(/,/g, "")) : null;
};

async function harvest(code) {
  const url = (start) => `${BASE}?start=${start}&collection=${code}&pagecount=${PER_PAGE}`;
  const first = await getHtml(url(0));
  const total = totalOf(first);
  if (total === null) {
    // Their CA and a few other codes answer 200 with an empty shell. That is a
    // broken collection, not an empty one, and it must not read as "no plants".
    throw new Error(`${code}: page carried no result count — collection looks broken upstream`);
  }
  const rows = parseRows(first);
  for (let start = PER_PAGE; start < total; start += PER_PAGE) {
    await sleep(400);
    rows.push(...parseRows(await getHtml(url(start))));
  }
  // Tight, because a near-miss here is a parser quietly dropping rows and a
  // short list reads downstream as a coverage gap that isn't there. An earlier
  // version matched the link and the name in one regex, lost 25 of Washington's
  // 226, and passed a page-sized tolerance without a murmur.
  //
  // Two is allowed because upstream is itself off by one: Washington's page
  // claims 226 results and serves 225, the first page carrying 99 rows rather
  // than 100. Worth a line on the console, not a failure.
  const unique = new Set(rows.map((r) => r.id)).size;
  const short = total - unique;
  if (Math.abs(short) > 2) {
    throw new Error(`${code}: page said ${total} results, harvested ${unique} — parser or paging is dropping rows`);
  }
  if (short !== 0) console.log(`    (${code}: upstream says ${total}, serves ${unique})`);
  return { total, rows };
}

const regions = only ? [only] : Object.keys(COLLECTIONS);
mkdirSync(OUT_DIR, { recursive: true });

for (const region of regions) {
  const codes = COLLECTIONS[region];
  if (!codes) {
    console.error(`no collections configured for region "${region}"`);
    process.exitCode = 1;
    continue;
  }
  const byLatin = new Map();
  const totals = {};
  for (const code of codes) {
    const { total, rows } = await harvest(code);
    totals[code] = total;
    for (const r of rows) {
      const prev = byLatin.get(r.latin);
      if (prev) prev.collections.push(code);
      else byLatin.set(r.latin, { ...r, collections: [code] });
    }
    console.log(`  ${region} ${code}: ${rows.length} rows (site said ${total})`);
    await sleep(400);
  }
  const curated = [...byLatin.values()].sort((a, b) => a.latin.localeCompare(b.latin));
  writeFileSync(
    `${OUT_DIR}${region}.json`,
    `${JSON.stringify(
      {
        source: "Lady Bird Johnson Wildflower Center — Recommended Species",
        url: "https://www.wildflower.org/collections/",
        note:
          "A recommendation list, not a flora: absence means they did not recommend it, never that it is not native. State-scoped, so wider than any region we ship.",
        hasFloraTier: false,
        region,
        collections: codes,
        siteReportedTotals: totals,
        harvested: new Date().toISOString().slice(0, 10),
        curated,
        full: [],
      },
      null,
      2,
    )}\n`,
  );
  console.log(`${region}: ${curated.length} recommended → data/sources/wildflower-center/raw/${region}.json`);
}
