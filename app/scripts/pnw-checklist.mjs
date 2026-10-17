// `npm run pnw:checklist` — the Pacific Northwest's academic plant list, native
// and introduced, joined to where herbaria have found each plant west of the
// Cascade crest.
//
// ## Two sources, one job each
//
// - **Native status: the Flora of the Pacific Northwest Checklist** (Giblin &
//   Legler, University of Washington Herbarium, Burke Museum). The checklist of
//   *Flora of the Pacific Northwest*, 2nd ed. (2018), kept current. Every taxon
//   is called native or introduced by the people who wrote the flora. It offers
//   a tab-delimited ZIP "for ingestion by databases … or other programs", and
//   the site has no robots.txt, so a script may fetch it.
// - **Where it grows: the Consortium of Pacific Northwest Herbaria county list**
//   for the 37 Washington and Oregon counties west of the crest. Built from
//   specimens, so a plant missing from a county may just be uncollected; its
//   own "Origin" column comes from specimen labels and disagrees with itself,
//   so it is not read. robots.txt allows the county list.
//
// - **Oregon, again: OregonFlora's checklist** (Oregon State University),
//   version 2.4 of May 2026 — newer than the Burke download, and the only one
//   of the three that covers **southern Oregon**, the Klamath country the
//   flora leaves out. Its robots.txt shuts out every agent but the big search
//   engines, so a person downloads it from
//   https://oregonflora.org/pages/taxonomic-checklist.php into
//   `raw/oregonflora/`. Statewide, so it says native *in Oregon*, east side
//   included.
//
// The flora's region is wider than ours: it reaches east to western Montana and
// north to 51° N in British Columbia. So a native there means native somewhere
// in the flora's region; the county count says whether that includes our side
// of the mountains.
//
// ## Usage
//
//   npm run pnw:checklist              rebuild the CSVs from raw/ if it's there,
//                                      then check our rows → pnw.json
//   npm run pnw:checklist -- --fetch   download the Burke and herbaria files again
//                                      (OregonFlora's is always by hand)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireProxyAwareFetch } from "./_net.mjs";
import {
  checklistRows,
  floraVerdicts,
  lookup,
  OREGONFLORA_COLUMNS,
  oregonfloraRows,
  readCommitted,
  readCsv,
  readTsv,
  toCsv,
} from "./_pnwflora.mjs";

const DIR = fileURLToPath(new URL("../../data/sources/pnw-flora/", import.meta.url));
const RAW = `${DIR}raw/`;
const ZIP_URL = "https://burkeherbarium.org/pnwflora/data/PNWFloraChecklist.zip";
const COUNTY_URL = "https://www.pnwherbaria.org/data/countylist.php";
const UA = "Indigene native-plant app (+https://indigene.app; https://github.com/olivierlacan/indigene)";

// West of the Cascade crest: the counties of EPA ecoregions 1, 2, 3, 4 and 78
// on the American side. Counties that reach the crest from the west (King,
// Lane, Douglas) are in; those mostly east of it (Hood River, Klickitat,
// Chelan) are out.
export const WEST_COUNTIES = {
  WA: [
    "Clallam", "Clark", "Cowlitz", "Grays Harbor", "Island", "Jefferson", "King", "Kitsap", "Lewis",
    "Mason", "Pacific", "Pierce", "San Juan", "Skagit", "Skamania", "Snohomish", "Thurston",
    "Wahkiakum", "Whatcom",
  ],
  OR: [
    "Benton", "Clackamas", "Clatsop", "Columbia", "Coos", "Curry", "Douglas", "Jackson", "Josephine",
    "Lane", "Lincoln", "Linn", "Marion", "Multnomah", "Polk", "Tillamook", "Washington", "Yamhill",
  ],
};

async function download(url, file) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

async function fetchSources(force) {
  mkdirSync(RAW, { recursive: true });
  if (force || !existsSync(`${RAW}pnwflora.txt`)) {
    console.log(`Fetching ${ZIP_URL} …`);
    await download(ZIP_URL, `${RAW}PNWFloraChecklist.zip`);
    execFileSync("unzip", ["-o", "-q", `${RAW}PNWFloraChecklist.zip`, "-d", RAW]);
  }
  if (force || !existsSync(`${RAW}cpnwh-west.txt`)) {
    // One request for all 37 counties; the "counties" column says which.
    const q = new URLSearchParams({ format: "text", vp: "Y", counties: "Y", year: "Y", excludecultivated: "Y" });
    for (const [st, names] of Object.entries(WEST_COUNTIES)) {
      for (const n of names) q.set(`${st}_${n.replace(/ /g, "_")}`, "Y");
    }
    console.log("Fetching the herbaria's county list (west of the crest) …");
    await download(`${COUNTY_URL}?${q}`, `${RAW}cpnwh-west.txt`);
  }
}

function build() {
  const read = (f) => readTsv(readFileSync(`${RAW}${f}`, "utf8"));
  const pnwflora = read("pnwflora.txt");
  const rows = checklistRows({
    pnwflora,
    synonymy: read("synonymy.txt"),
    counties: read("cpnwh-west.txt"),
    westCounties: Object.values(WEST_COUNTIES).flat(),
  });
  writeFileSync(`${DIR}pnw-checklist.csv`, toCsv(rows));
  const listed = rows.filter((r) => !r.excluded);
  const count = (o) => listed.filter((r) => r.origin === o).length;
  const west = listed.filter((r) => r.westCounties > 0);
  const updated = pnwflora.map((r) => r.ModifiedOn).sort().at(-1)?.slice(0, 10);
  console.log(`\nFlora of the PNW Checklist, last edited ${updated}: ${rows.length} taxa, ${listed.length} not excluded`);
  console.log(`  native ${count("native")} · introduced ${count("introduced")} · both ${count("both")}`);
  console.log(`  with a specimen west of the crest: ${west.length} (native ${west.filter((r) => r.origin === "native").length}, introduced ${west.filter((r) => r.origin === "introduced").length})`);
  console.log("→ data/sources/pnw-flora/pnw-checklist.csv");
  return rows;
}

const OREGONFLORA = `${RAW}oregonflora/Checklist_ForWeb.csv`;

/** OregonFlora's checklist, when a person has put it in `raw/`. */
function buildOregonFlora() {
  if (!existsSync(OREGONFLORA)) {
    console.log(`\nNo OregonFlora checklist in raw/oregonflora/ — see the README to download it.`);
    return null;
  }
  // Their export is Windows-1252, not UTF-8 ("Sesleria caerulea", "×").
  const text = new TextDecoder("windows-1252").decode(readFileSync(OREGONFLORA));
  const rows = oregonfloraRows(readCsv(text));
  const version = text.match(/OregonFlora Checklist version [^"\n]+/)?.[0] ?? "OregonFlora Checklist";
  writeFileSync(`${DIR}oregonflora.csv`, toCsv(rows, OREGONFLORA_COLUMNS));
  const count = (o) => rows.filter((r) => r.origin === o).length;
  console.log(`\n${version}: ${rows.length} accepted taxa`);
  console.log(`  native ${count("native")} · exotic, naturalized ${count("exotic, naturalized")} · exotic, not naturalized ${count("exotic, not naturalized")} · native and exotic ${count("native and exotic")} · uncertain ${count("uncertain")}`);
  console.log("→ data/sources/pnw-flora/oregonflora.csv");
  return { version, rows };
}

// Names a checklist draws differently from our row, looked up under the
// checklist's name instead — the way `check-vascan.mjs` keeps its REVIEWED
// table. Each is re-checked every run: if the checklist drops the name, the
// entry is STALE and the run fails.
export const REVIEWED = {
  "Rubus parviflorus": {
    burke: "Rubus nutkanus",
    why: "The Burke checklist splits western thimbleberry off as R. nutkanus and keeps R. parviflorus for the plant east of the Rockies.",
  },
  "Athyrium cyclosorum": {
    burke: "Athyrium filix-femina ssp. cyclosorum",
    oregonflora: "Athyrium filix-femina var. cyclosorum",
    why: "Kew keeps the western lady fern as its own species; both floras keep it inside A. filix-femina, as a subspecies (Burke) and a variety (OregonFlora).",
  },
  "Cornus sericea": {
    burke: "Cornus stolonifera",
    why: "The Burke checklist calls C. sericea ambiguous; red-osier dogwood, the plant our row is, is its C. stolonifera.",
  },
};

/**
 * Put every row the region ships to both checklists, write the snapshot, and
 * say what moved — the same rules `check-native.mjs` keeps for Kew:
 *
 *   recorded   a disagreement the committed snapshot already carries: printed, not a failure
 *   NEW        a row with no previous verdict that isn't native in both: fails
 *   CHANGED    a verdict that differs from the committed one: fails
 *   STALE      a REVIEWED name the checklist no longer has: fails
 *
 * A first run has no snapshot, so every disagreement is NEW.
 */
function checkOurs() {
  const burke = readCommitted(readFileSync(`${DIR}pnw-checklist.csv`, "utf8"));
  const oregonflora = existsSync(`${DIR}oregonflora.csv`) ? readCommitted(readFileSync(`${DIR}oregonflora.csv`, "utf8")) : [];
  const outFile = `${DIR}pnw.json`;
  const previous = new Map();
  if (existsSync(outFile)) for (const r of JSON.parse(readFileSync(outFile, "utf8")).rows) previous.set(r.id, r);

  const src = readFileSync(fileURLToPath(new URL("../src/data/plants.pnw.ts", import.meta.url)), "utf8");
  const ours = [...src.matchAll(/^\s+id: "([^"]+)",\n\s+common: "([^"]+)",\n\s+latin: "([^"]+)"/gm)].map((m) => ({
    id: m[1],
    latin: m[3],
  }));

  const problems = [];
  for (const [latin, r] of Object.entries(REVIEWED)) {
    if (r.burke && !lookup(burke, r.burke)) problems.push(`STALE ${latin}: the Burke checklist no longer has ${r.burke}`);
    if (r.oregonflora && !lookup(oregonflora, r.oregonflora)) problems.push(`STALE ${latin}: OregonFlora no longer has ${r.oregonflora}`);
  }
  const rows = ours.map(({ id, latin }) => ({ id, latin, ...floraVerdicts(latin, { burke, oregonflora }, REVIEWED[latin]) }));
  const agrees = (r) => r.burke.verdict === "native" && r.oregonflora.verdict === "native";
  const say = (r) => `Burke: ${r.burke.verdict}${r.burke.as && r.burke.as !== r.latin ? ` (as ${r.burke.as})` : ""} · OregonFlora: ${r.oregonflora.verdict}${r.oregonflora.as && r.oregonflora.as !== r.latin ? ` (as ${r.oregonflora.as})` : ""}`;

  console.log(`\nOur ${rows.length} PNW rows, put to both checklists:`);
  for (const r of rows) {
    const prev = previous.get(r.id);
    const was = prev && `${prev.burke.verdict}/${prev.oregonflora.verdict}`;
    const now = `${r.burke.verdict}/${r.oregonflora.verdict}`;
    if (prev && was !== now) problems.push(`CHANGED ${r.latin}: was ${was}, now ${now}`);
    else if (!agrees(r) && !prev) problems.push(`NEW ${r.latin}: ${say(r)}`);
    else if (!agrees(r)) console.log(`  rec  ${r.latin.padEnd(32)} ${say(r)}`);
    if (agrees(r) && !r.burke.westCounties) console.log(`  note ${r.latin.padEnd(32)} native in both; no herbarium specimen west of the crest under this name`);
  }
  console.log(`  ${rows.filter(agrees).length} of ${rows.length} native in both.`);

  writeFileSync(
    outFile,
    `${JSON.stringify(
      {
        region: "pnw",
        ranAt: new Date().toISOString().slice(0, 10),
        sources: {
          burke: "Flora of the Pacific Northwest Checklist (Burke Museum, UW)",
          oregonflora: oregonflora.length ? "OregonFlora Checklist (Oregon State University)" : null,
        },
        rows,
      },
      null,
      2,
    )}\n`,
  );
  console.log("→ data/sources/pnw-flora/pnw.json — then `npm run native-evidence`");
  if (problems.length) {
    console.log(`\n${problems.length} to review (the snapshot is written; re-run once reviewed):`);
    for (const p of problems) console.log(`  ${p}`);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // The committed CSVs are enough to re-check our rows; the raw downloads are
  // only needed to rebuild them.
  if (process.argv.includes("--fetch") || !existsSync(`${DIR}pnw-checklist.csv`)) {
    requireProxyAwareFetch("pnw:checklist");
    await fetchSources(true);
  }
  if (existsSync(`${RAW}pnwflora.txt`) && existsSync(`${RAW}cpnwh-west.txt`)) build();
  buildOregonFlora();
  checkOurs();
}
