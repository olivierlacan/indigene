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


/** Which TDWG level-3 botanical area each region's native claim is about.
 *  Only regions whose status comes from WCVP appear here; the others cite a
 *  national flora this script can't query and are skipped with a note. */
const TDWG_AREA = {
  ireland: { code: "IRE", label: "Ireland (TDWG:IRE — the whole island)" },
  "nz-auckland": { code: "NZN", label: "New Zealand North (TDWG:NZN — the North Island)" },
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

/** WCVP's verdict for one binomial in one TDWG area. */
async function statusFor(latin, tdwg) {
  const usage = await wcvpAccepted(latin);
  if (!usage) return { verdict: "no-match" };
  const rows = await wcvpDistributions(usage.key);
  return {
    verdict: wcvpStatus(rows, (d) => d.locationId === `TDWG:${tdwg}`),
    via: usage.viaSynonym,
  };
}

const src = readFileSync(join(DATA_DIR, `plants.${regionArg === "ireland" ? "ireland" : regionArg}.ts`), "utf8");
const rows = [...src.matchAll(/^\s+id: "([^"]+)",\n\s+common: "([^"]+)",\n\s+latin: "([^"]+)"/gm)]
  .map((m) => ({ id: m[1], common: m[2], latin: m[3] }));

console.log(`${regionArg}: re-asking Kew's WCVP about ${rows.length} rows.`);
console.log(`Area: ${area.label}\n`);

const problems = [];
const unchecked = [];
const snapshot = [];
for (const row of rows) {
  // An aggregate ("Rubus fruticosus agg.") has no single accepted taxon; ask
  // about the binomial inside it and say that is what was asked.
  const query = row.latin.replace(/\s+agg\.$/, "");
  let out;
  try {
    out = await statusFor(query, area.code);
  } catch (e) {
    out = { verdict: `error ${e.message}` };
  }
  const flag = out.verdict === "NATIVE" ? "ok  " : "FAIL";
  if (out.verdict !== "NATIVE") {
    (out.verdict === "no-match" ? unchecked : problems).push({ ...row, ...out });
  }
  snapshot.push({ id: row.id, latin: row.latin, asked: query, verdict: out.verdict, viaSynonym: out.via ?? null });
  const via = out.via ? `  (via synonym → ${out.via})` : "";
  const agg = query !== row.latin ? `  (asked about ${query})` : "";
  console.log(`  ${flag}  ${out.verdict.padEnd(11)} ${row.latin}${agg}${via}`);
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
