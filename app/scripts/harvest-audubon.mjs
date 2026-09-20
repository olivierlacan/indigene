// `npm run harvest:audubon` — pull the National Audubon Society's Plants for
// Birds list for each US region, and commit it as a source we can diff against.
//
// ## Why this source, and what it actually is
//
// Every gap report we ship so far measures our lists against *occurrence data*
// — `npm run candidates` ranks GBIF records inside a region's box. That answers
// "does it grow here", which is a different question from "would anybody
// recommend planting it". Occurrence data has no opinion.
//
// Audubon's database has an opinion, and it is the same *kind* of artifact as
// ours: a native plant list, published by a conservation society, addressed to
// somebody deciding what to put in their yard. That makes it the first outside
// list we can hold our own beside without comparing apples to a flora.
//
// **It has two tiers, and only one of them is a recommendation.**
//
//   - The landing results are Audubon's *curated* picks for a ZIP: a few dozen
//     plants they actually push, with bird groups attached.
//   - `full-results` is everything native to that ZIP's county, derived from
//     BONAP's North American Plant Atlas. Several hundred species. That is a
//     flora with a postcode, not a garden list.
//
// We harvest both and keep them apart, because conflating them would produce a
// "gap" of two hundred species that means nothing. See `npm run societies` for
// what each tier is legitimately evidence of.
//
// ## Provenance
//
// Plant data in Audubon's database comes from BONAP's North American Plant
// Atlas; the bird associations and the curation are Audubon's own. We store the
// names and the bird groups, not their descriptive text. See DATA_SOURCES.md.
//
// ## Usage
//
//   npm run harvest:audubon                 every region
//   npm run harvest:audubon -- --region pnw one region
//   npm run harvest:audubon -- --tier best  curated tier only (fast)
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("harvest:audubon");

// The raw harvest is **git-ignored**, deliberately.
//
// Audubon's plant data comes from BONAP's North American Plant Atlas, and
// DATA_SOURCES.md carries a standing ⛔ on BONAP: *"Do not scrape or embed —
// BONAP maps have restrictive reuse terms."* Mirroring several thousand of
// their county distribution rows into this repo would walk straight into that,
// whichever site we read them through.
//
// So this writes to `raw/`, which git ignores, and the committed artifact is
// the reduced one `npm run societies` writes next to it: the verdict on *our
// own rows*, the way `wcvp/<region>.json` records what Kew said about them.
// That is a provenance snapshot about our data, not a copy of theirs.
const OUT_DIR = fileURLToPath(
  new URL("../../data/sources/audubon-plants-for-birds/raw/", import.meta.url),
);

// One or more ZIP codes per region, chosen at the places each region's own
// `reference` field names — so the sample is where the list claims to be tuned,
// not at some centroid in a field. A region gets several because Audubon
// resolves a ZIP to one county, and our regions are much bigger than counties.
const ZIPS = {
  "mid-atlantic": ["19104", "17601", "20910"], // Philadelphia, Lancaster, Silver Spring
  "north-michigan": ["49770", "49684"], // Petoskey, Traverse City
  pnw: ["97212", "98103"], // Portland, Seattle
  "ca-south-coast": ["90042", "92103"], // Los Angeles, San Diego
  "ca-central-coast": ["94608", "93940"], // Oakland, Monterey
  "florida-central": ["32801", "32216"], // Orlando, Jacksonville
  "florida-south": ["33133", "33040"], // Miami, Key West
};

const BASE = "https://www.audubon.org/native-plants";
const PER_PAGE = 12; // fixed by the site

// Drupal numbers the pagers on a page and wants the one it means in that slot
// of a comma-separated `page` parameter — `page=,4` for the second pager,
// `page=,,4` for the third. A plain `page=4` is silently ignored and serves
// page 0 again, which is how a harvest can look like it worked and quietly be
// one page repeated forty times. The two tiers sit at different slots
// (best-results 1, full-results 2), so read it off the page rather than
// hardcoding either.
const pageParam = (n, element) => `page=${",".repeat(element)}${n}`;

/** Which pager slot this view's own settings say it uses. */
function pagerElement(html) {
  const m = html.match(/"pager_element":\s*(\d+)/);
  return m ? Number(m[1]) : 0;
}

const args = process.argv.slice(2);
const only = valueOf("--region");
const tier = valueOf("--tier") ?? "both";

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getHtml(url, attempt = 0) {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "indigene-harvest (https://indigene.app)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    if (attempt >= 3) throw err;
    await sleep(1000 * 2 ** attempt);
    return getHtml(url, attempt + 1);
  }
}

const strip = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Every plant card on one results page. */
function parseCards(html) {
  const chunks = html.split(/<article class="node[^"]*node--type-native-plant/).slice(1);
  const out = [];
  for (const c of chunks) {
    const latin = c.match(/class="scientific-title[^"]*">([^<]+)</);
    if (!latin) continue;
    const common = c.match(/class="custom-h3 common-name">([^<]+)</);
    const group = c.match(/class="np-family-name">([^<]+)</);
    const birds = [...c.matchAll(/class="bird-card-caption">\s*<h5[^>]*>([^<]+)</g)].map((m) =>
      strip(m[1]),
    );
    const provides = [...c.matchAll(/class="native-plants-attribute">([^<]+)</g)].map((m) =>
      strip(m[1]),
    );
    out.push({
      latin: strip(latin[1]),
      common: common ? strip(common[1]) : null,
      group: group ? strip(group[1]) : null,
      provides: [...new Set(provides)],
      // The card shows at most five bird groups, so this is a sample, never a
      // count. Anything that sorts or scores on its length is measuring the
      // cap. Kept because *which* groups they are is still information.
      birds: [...new Set(birds)],
    });
  }
  return out;
}

function totalResults(html) {
  const m = html.match(/Showing\s+([\d,]+)\s+results/i);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

/**
 * One tier for one ZIP, all pages.
 *
 * Throws if the site's own total and what we parsed disagree by more than a
 * page: a silent short harvest would show up later as a fake coverage gap, and
 * a wrong number is worse here than no number.
 */
async function harvestTier(zip, path) {
  const url = (extra = "") => `${BASE}/${path}?zipcode=${zip}${extra}`;
  const first = await getHtml(url());
  const total = totalResults(first);
  const element = pagerElement(first);
  const plants = parseCards(first);
  if (total && total > PER_PAGE) {
    const pages = Math.ceil(total / PER_PAGE);
    for (let p = 1; p < pages; p++) {
      await sleep(400);
      plants.push(...parseCards(await getHtml(url(`&${pageParam(p, element)}`))));
    }
  }
  const unique = new Set(plants.map((p) => p.latin)).size;
  if (total && Math.abs(unique - total) > PER_PAGE) {
    throw new Error(
      `${path} ${zip}: site said ${total} results, harvested ${unique} unique — pagination is not advancing`,
    );
  }
  return { total, plants };
}

/** Merge per-ZIP harvests, remembering which ZIPs each plant came back for. */
function merge(perZip) {
  const byLatin = new Map();
  for (const [zip, plants] of Object.entries(perZip)) {
    for (const p of plants) {
      const prev = byLatin.get(p.latin);
      if (prev) {
        prev.zips.push(zip);
        prev.birds = [...new Set([...prev.birds, ...p.birds])];
        prev.provides = [...new Set([...prev.provides, ...p.provides])];
      } else {
        byLatin.set(p.latin, { ...p, zips: [zip] });
      }
    }
  }
  return [...byLatin.values()].sort((a, b) => a.latin.localeCompare(b.latin));
}

const regions = only ? [only] : Object.keys(ZIPS);
mkdirSync(OUT_DIR, { recursive: true });

for (const region of regions) {
  const zips = ZIPS[region];
  if (!zips) {
    console.error(`no ZIPs configured for region "${region}"`);
    process.exitCode = 1;
    continue;
  }
  const best = {};
  const full = {};
  const totals = {};
  for (const zip of zips) {
    if (tier !== "full") {
      const r = await harvestTier(zip, "best-results");
      best[zip] = r.plants;
    }
    if (tier !== "best") {
      const r = await harvestTier(zip, "full-results");
      full[zip] = r.plants;
      totals[zip] = r.total;
    }
    const b = best[zip]?.length ?? 0;
    const f = full[zip]?.length ?? 0;
    console.log(`  ${region} ${zip}: curated ${b}, full ${f}${totals[zip] ? ` (site said ${totals[zip]})` : ""}`);
    await sleep(400);
  }
  const doc = {
    source: "National Audubon Society — Plants for Birds",
    url: `${BASE}`,
    note:
      "curated = Audubon's own picks for the ZIP; full = every species BONAP records as native to that ZIP's county. The two are different kinds of list and must not be pooled.",
    plantDataFrom: "BONAP North American Plant Atlas; bird associations and curation by Audubon",
    harvested: new Date().toISOString().slice(0, 10),
    region,
    zips,
    siteReportedFullTotals: totals,
    curated: merge(best),
    full: merge(full),
  };
  writeFileSync(`${OUT_DIR}${region}.json`, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(
    `${region}: curated ${doc.curated.length}, full ${doc.full.length} → data/sources/audubon-plants-for-birds/raw/${region}.json`,
  );
}
