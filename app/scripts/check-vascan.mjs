// `npm run vascan:check` — verify a cross-border region's list against Canada's
// own flora.
//
// The Pacific Northwest region crosses into British Columbia, which means it
// hands a reader in Vancouver a list assembled from Oregon and Washington
// sources. That is a claim about British Columbia, and it should be checked
// against a Canadian authority rather than assumed from latitude.
//
// So: every row of the list, against VASCAN — the Database of Vascular Plants
// of Canada — for the province the region reaches. Four answers:
//
//   native      VASCAN records it native there. Nothing to do.
//   introduced  VASCAN records it, but as an introduction. **Reported**, because
//               a native-plant app recommending an introduced plant is the one
//               mistake it cannot make.
//   absent      VASCAN has the plant but no record of it in that province — it
//               is the southern end of the list, which is expected and fine, but
//               the row should say so rather than imply the whole region.
//   —           VASCAN has no entry at all: not Canadian flora. Same as absent
//               for our purposes, and distinguished so it can't be misread as a
//               judgement about nativeness.
//
// This runs offline: the archive is already in data/sources/vascan/dwca/ (the
// probe fetches it). No network, so it can be part of an ordinary check run.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openVascan, PROVINCE_NAMES } from "./_vascan.mjs";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data");

// **Rows where VASCAN and the American floras draw the taxon differently.**
// Not a way to wave a failure through: each one names the VASCAN taxon the row
// actually is, and the check *verifies that taxon is native there*. If VASCAN
// ever revises one, the entry stops matching and this fails again.
const REVIEWED = {
  "Achillea millefolium": {
    province: "BC",
    as: "Achillea borealis",
    why:
      "VASCAN keeps `A. millefolium` for the European yarrow — introduced right " +
      "across Canada — and files the native North American plant as `A. borealis` " +
      "(native in every province). Western US floras treat both as one species. " +
      "The plant is native; the name is the disagreement. Worth knowing when " +
      "buying seed, and the row says so.",
  },
  "Grindelia integrifolia": {
    province: "BC",
    as: "Grindelia stricta",
    why:
      "The Puget Sound gumweed of the Salish Sea shore is `G. stricta` to VASCAN " +
      "and `G. integrifolia` to the Pacific Northwest floras. Same plant, same " +
      "beaches, both sides of the border.",
  },
};

/** Which shipped lists make a claim about Canadian ground, and where. */
const CROSS_BORDER = [
  { region: "pnw", province: "BC", why: "reaches Vancouver, the Fraser Valley and east Vancouver Island" },
];

const rows = (region) => {
  const src = readFileSync(join(DATA_DIR, `plants.${region}.ts`), "utf8");
  return [...src.matchAll(/id:\s*"([^"]+)",\s*\n\s*common:\s*"([^"]+)",\s*\n\s*latin:\s*"([^"]+)"/g)]
    .map((m) => ({ id: m[1], common: m[2], latin: m[3] }));
};

const vascan = openVascan();
let introduced = 0;

for (const { region, province, why } of CROSS_BORDER) {
  const list = rows(region);
  const seen = { native: [], reviewed: [], introduced: [], absent: [], unknown: [] };
  for (const r of list) {
    const reviewed = REVIEWED[r.latin];
    if (reviewed && reviewed.province === province) {
      // The exception has to earn itself: the taxon it names must be native here.
      const actual = vascan.status(reviewed.as, province);
      if (actual !== "native") {
        console.log(
          `\n  STALE     ${r.common}: reviewed as "${reviewed.as}", but VASCAN now ` +
            `says ${actual ?? "it has no entry"} for that name in ${PROVINCE_NAMES[province]}.`,
        );
        introduced++;
        continue;
      }
      seen.reviewed.push({ ...r, as: reviewed.as, why: reviewed.why });
      continue;
    }
    const status = vascan.status(r.latin, province);
    (seen[status === null ? "unknown" : status] ?? seen.absent).push(r);
  }

  console.log(`${region} — ${list.length} rows against VASCAN for ${PROVINCE_NAMES[province]}`);
  console.log(`  (the region ${why})\n`);
  console.log(`  native      ${String(seen.native.length).padStart(3)}`);
  console.log(`  native*     ${String(seen.reviewed.length).padStart(3)}   (under a name VASCAN draws differently)`);
  console.log(`  introduced  ${String(seen.introduced.length).padStart(3)}`);
  console.log(`  absent      ${String(seen.absent.length).padStart(3)}   (the list's southern end)`);
  console.log(`  no entry    ${String(seen.unknown.length).padStart(3)}   (not in the Canadian flora)`);

  for (const r of seen.introduced) {
    console.log(`\n  INTRODUCED  ${r.common} (${r.latin})`);
    console.log(`              VASCAN records this in ${PROVINCE_NAMES[province]} as an introduction.`);
    introduced++;
  }
  for (const r of seen.reviewed) {
    console.log(`\n  ${r.common} — VASCAN files this as ${r.as}.`);
    console.log(`    ${r.why}`);
  }

  const short = [...seen.absent, ...seen.unknown];
  if (short.length) {
    console.log(`\n  Rows that do not reach ${PROVINCE_NAMES[province]} — each should say so in \`nativeNote\`:`);
    for (const r of short) console.log(`    ${r.common} (${r.latin})`);
  }
}

console.log("");
if (introduced) {
  console.log(`vascan: ${introduced} row(s) VASCAN calls introduced. A native-plant list cannot ship those.`);
  process.exit(1);
}
console.log("vascan: no row is an introduction north of the border.");
