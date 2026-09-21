// `npm run native:check -- --region ireland` — re-ask the source whether every
// plant a region ships is actually native there.
//
// Every region asserts "native *here*" on every row, and until now that claim
// was checkable only by hand, against whichever national flora the region's
// `basis` lines cite. Ireland is the first region whose native status comes from
// a single machine-readable source — Kew's **World Checklist of Vascular
// Plants** (CC BY 4.0), which records native and introduced range by TDWG
// botanical area — so for the first time the claim can simply be re-asked.
//
// WCVP is reached through the GBIF API rather than a bulk download: GBIF hosts
// the checklist as a dataset, and one call per taxon returns its distribution.
// That makes this the same kind of tool as `names:check` — network, run in CI,
// reports rather than rewrites.
//
// ## Reading the answer
//
//   NATIVE       the area is listed with no establishment means → native there
//   INTRODUCED   the area is listed as introduced → **the row should not ship**
//   ABSENT       the area is not in the distribution at all → likewise
//   no-match     WCVP has no accepted taxon under this name → check the spelling
//                against the accepted name, or the row's `basis`
//
// How to ask WCVP without the question quietly failing — and it has a real trap
// in it — lives in `_wcvp.mjs`, which `candidates.mjs` shares.
//
// ## Where it disagrees with a national flora
//
// It will, and that is worth knowing rather than smoothing over. WCVP records
// Ireland's Lusitanian element — the Killarney strawberry tree, Mackay's heath,
// St Dabeoc's heath — as introduced, where Irish floras treat them as native
// relics. This script reports what WCVP says. The decision about what to do with
// a disagreement is editorial and belongs in the region file, not here; see
// `data/sources/wcvp/README.md`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";
import { wcvpAccepted, wcvpDistributions, wcvpStatus, WCVP_DATASET } from "./_wcvp.mjs";

requireProxyAwareFetch("native:check");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA_DIR = join(REPO_ROOT, "app", "src", "data");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "wcvp");


/**
 * Which TDWG level-3 botanical areas each region's native claim is about.
 *
 * Ireland was the first region here because its status came from WCVP to begin
 * with. The US regions were added later for a different reason: the society
 * lists we measure against (`npm run societies`) can show a gap but only one of
 * them has a flora tier, and that one's western coverage is too thin to settle
 * a native claim — its flora for Portland has no Douglas-fir. WCVP is a
 * botanical authority rather than a recommendation list, it is CC BY, and it
 * covers the whole world at the same grain, so it answers in the West exactly
 * as well as in the East.
 *
 * **A region takes several areas, and one native area is enough.** TDWG's
 * level-3 areas are states over the US, and every US region we ship spans
 * more than one: a plant native in Virginia is native to a Mid-Atlantic region
 * that includes Virginia, whatever Pennsylvania says. The per-area breakdown is
 * printed and stored so an editor can see which states carried the verdict.
 *
 * The areas listed are the ones a region's coverage box actually falls in, not
 * every state it clips.
 */
const TDWG_AREA = {
  ireland: { codes: ["IRE"], label: "Ireland (TDWG:IRE — the whole island)" },
  // The Piedmont/Northeast box: Virginia up through southern New England.
  "mid-atlantic": {
    codes: ["PEN", "NWJ", "DEL", "MRY", "VRG", "NWY", "CNT", "RHO", "MAS", "WVA"],
    label: "Mid-Atlantic & Northeast (PA NJ DE MD VA NY CT RI MA WV)",
  },
  "north-michigan": { codes: ["MIC"], label: "Michigan (TDWG:MIC)" },
  pnw: { codes: ["WAS", "ORE"], label: "Washington & Oregon (TDWG:WAS, ORE)" },
  // TDWG has one area for the whole state, so it cannot separate cismontane
  // southern California from the deserts, or the Bay Area from the Sierra.
  // A NATIVE here means "native somewhere in California" — weaker than the
  // region's own claim, and the report says so rather than implying otherwise.
  "ca-south-coast": { codes: ["CAL"], label: "California (TDWG:CAL — whole state)" },
  "ca-central-coast": { codes: ["CAL"], label: "California (TDWG:CAL — whole state)" },
  "florida-central": { codes: ["FLA"], label: "Florida (TDWG:FLA — whole state)" },
  "florida-south": { codes: ["FLA"], label: "Florida (TDWG:FLA — whole state)" },
  // France's four regions are biogeographical, and TDWG has one area for the
  // whole country — so this is a floor check, not a verdict on the region: it
  // can catch a plant that is not French at all, and it cannot tell Provence
  // from Picardy. The rows' own `basis` lines cite the CBN network and INPN for
  // the finer claim, which no API of ours can re-ask.
  "france-atlantic": { codes: ["FRA"], label: "France (TDWG:FRA — whole country; floor check only)" },
  "france-continental": { codes: ["FRA"], label: "France (TDWG:FRA — whole country; floor check only)" },
  "france-alpine": { codes: ["FRA"], label: "France (TDWG:FRA — whole country; floor check only)" },
  // Corsica is its own TDWG area and this region includes it.
  "france-mediterranean": {
    codes: ["FRA", "COR"],
    label: "Mediterranean France & Corsica (TDWG:FRA, COR; floor check only)",
  },
  // Added on main while this branch was open. The North Island is its own
  // TDWG area, so this one is as fine as the region.
  "nz-auckland": { codes: ["NZN"], label: "New Zealand North (TDWG:NZN — the North Island)" },
};

const args = process.argv.slice(2);
const regionArg = args[args.indexOf("--region") + 1];
if (!args.includes("--region") || !regionArg) {
  console.error("usage: npm run native:check -- --region <id>");
  console.error(`WCVP-backed regions: ${Object.keys(TDWG_AREA).join(", ")}`);
  process.exit(2);
}
const area = TDWG_AREA[regionArg];
if (!area) {
  console.error(`${regionArg}: this region's native status doesn't come from WCVP.`);
  console.error("Its rows cite a national flora instead — see their `basis` lines.");
  console.error(`WCVP-backed regions: ${Object.keys(TDWG_AREA).join(", ")}`);
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * WCVP's verdict for one binomial over a region's areas.
 *
 * One NATIVE anywhere in the region wins, because the region is the union of
 * its areas. Otherwise the least-bad answer is reported (an INTRODUCED
 * somewhere beats ABSENT everywhere), and the per-area detail is kept either
 * way so a mixed answer is visible rather than flattened.
 */
async function statusFor(latin, codes) {
  const usage = await wcvpAccepted(latin);
  if (!usage) return { verdict: "no-match", areas: {} };
  const rows = await wcvpDistributions(usage.key);
  const areas = {};
  for (const code of codes) {
    areas[code] = wcvpStatus(rows, (d) => d.locationId === `TDWG:${code}`);
  }
  const values = Object.values(areas);
  const verdict = values.includes("NATIVE")
    ? "NATIVE"
    : (values.find((v) => v !== "ABSENT") ?? "ABSENT");
  return { verdict, areas, via: usage.viaSynonym };
}

// The file a region's rows live in. `florida-central` is the odd one: its list
// predates the south-Florida split and still sits in `plants.florida.ts`.
const PLANTS_FILE = { "florida-central": "plants.florida.ts" };
const src = readFileSync(
  join(DATA_DIR, PLANTS_FILE[regionArg] ?? `plants.${regionArg}.ts`),
  "utf8",
);
const rows = [...src.matchAll(/^\s+id: "([^"]+)",\n\s+common: "([^"]+)",\n\s+latin: "([^"]+)"/gm)]
  .map((m) => ({ id: m[1], common: m[2], latin: m[3] }));

console.log(`${regionArg}: re-asking Kew's WCVP about ${rows.length} rows.`);
console.log(`Area: ${area.label}\n`);

const problems = [];
const unchecked = [];
const snapshot = [];
for (const row of rows) {
  // Ask about the binomial.
  //
  // An aggregate ("Rubus fruticosus agg.") has no single accepted taxon. An
  // infraspecific name is a subtler version of the same problem: WCVP has
  // `Sambucus nigra` but our row says `Sambucus nigra subsp. caerulea`, and
  // asking for the whole string returns no-match — which reads as "Kew has
  // never heard of this plant" when Kew simply answers at species rank here.
  // Four of our rows hit this. The trailing rank is dropped and the report says
  // what was actually asked.
  const query = row.latin.replace(/\s+agg\.$/, "").trim();
  const binomial = query.replace(/\s+(subsp|ssp|var|f)\.?\s+\S+.*$/i, "").trim();
  let out;
  try {
    out = await statusFor(query, area.codes);
    // Falling back to the binomial asks about a *different taxon*, and it can
    // be a different plant: our `Sambucus nigra subsp. caerulea` is the blue
    // elder of the American west, while `Sambucus nigra` is the European elder,
    // which is not native to California at all. WCVP's accepted name for ours
    // is `Sambucus cerulea`. So a species-rank answer that isn't NATIVE is
    // reported as inconclusive rather than as a verdict on the row.
    if (out.verdict === "no-match" && binomial !== query) {
      const fallback = await statusFor(binomial, area.codes);
      out =
        fallback.verdict === "NATIVE"
          ? { ...fallback, askedAt: "species" }
          : { verdict: "INCONCLUSIVE", areas: fallback.areas, askedAt: "species" };
    }
  } catch (e) {
    // One more go before calling it. A checklist run is hundreds of sequential
    // calls and the odd connection dies mid-exchange; an `error` line in the
    // middle of a clean region reads like a finding about that plant and is
    // nothing of the kind.
    await sleep(2000);
    try {
      out = await statusFor(query, area.codes);
    } catch (again) {
      out = { verdict: `error ${again.message}` };
    }
  }
  const flag = out.verdict === "NATIVE" ? "ok  " : "FAIL";
  if (out.verdict !== "NATIVE") {
    (out.verdict === "no-match" ? unchecked : problems).push({ ...row, ...out });
  }
  snapshot.push({ id: row.id, latin: row.latin, asked: out.askedAt === "species" ? binomial : query, verdict: out.verdict, areas: out.areas ?? {}, viaSynonym: out.via ?? null });
  const via = out.via ? `  (via synonym → ${out.via})` : "";
  const agg =
    out.askedAt === "species"
      ? `  (Kew has no ${row.latin}; asked about ${binomial})`
      : query !== row.latin
        ? `  (asked about ${query})`
        : "";
  // Which states carried it, when the region has more than one and they differ.
  const mixed =
    area.codes.length > 1 && out.areas
      ? `  [${Object.entries(out.areas)
          .filter(([, v]) => v !== "ABSENT")
          .map(([c, v]) => (v === "NATIVE" ? c : `${c}:${v.toLowerCase()}`))
          .join(" ") || "nowhere"}]`
      : "";
  console.log(`  ${flag}  ${out.verdict.padEnd(11)} ${row.latin}${agg}${via}${mixed}`);
  await sleep(150);
}

// A committed snapshot, the same arrangement `names:check` uses for the French
// names: upstream drift then shows up in a diff rather than in a surprise.
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, `${regionArg}.json`),
  JSON.stringify(
    {
      source: "World Checklist of Vascular Plants (WCVP), Royal Botanic Gardens Kew",
      license: "CC BY 4.0",
      via: `GBIF checklist dataset ${WCVP_DATASET}`,
      area: area.label,
      region: regionArg,
      ranAt: new Date().toISOString(),
      rows: snapshot,
    },
    null,
    2,
  ) + "\n",
);

console.log("");
if (problems.length) {
  console.log(`${problems.length} row(s) WCVP does NOT record as native here:`);
  for (const p of problems) console.log(`  ${p.verdict.padEnd(11)} ${p.latin} — ${p.common}`);
}
if (unchecked.length) {
  console.log(`\n${unchecked.length} row(s) WCVP has no accepted taxon for (check the name, not the claim):`);
  for (const u of unchecked) console.log(`  ${u.latin} — ${u.common}`);
}
if (!problems.length && !unchecked.length) {
  console.log(`All ${rows.length} rows: WCVP records them as native in ${area.label}.`);
}
console.log(`\nWrote ${join(OUT_DIR, `${regionArg}.json`)} — commit it.`);
process.exit(problems.length ? 1 : 0);
