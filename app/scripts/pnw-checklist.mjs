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
//   npm run pnw:checklist              build the CSV and check our rows
//   npm run pnw:checklist -- --fetch   download the Burke and herbaria files again
//                                      (OregonFlora's is always by hand)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireProxyAwareFetch } from "./_net.mjs";
import { checklistRows, lookup, OREGONFLORA_COLUMNS, oregonfloraRows, readCsv, readTsv, toCsv } from "./_pnwflora.mjs";

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

const find = (rows, latin) => lookup(rows, latin) ?? lookup(rows, latin.split(" ").slice(0, 2).join(" "));

/** What both checklists say about every plant the region ships. */
function checkOurs(burke, oregon) {
  const src = readFileSync(fileURLToPath(new URL("../src/data/plants.pnw.ts", import.meta.url)), "utf8");
  const ours = [...src.matchAll(/latin: "([^"]+)"/g)].map((m) => m[1]);
  const verdicts = ours.map((latin) => {
    const b = find(burke, latin);
    const o = oregon && find(oregon.rows, latin);
    return {
      latin,
      burke: b ? { name: b.name, origin: b.origin, westCounties: b.westCounties } : null,
      oregonflora: oregon ? (o ? { name: o.name, origin: o.origin } : null) : undefined,
    };
  });
  // Clean: native in both, under our own name, with a specimen west of the crest.
  const clean = (v) =>
    v.burke?.origin === "native" &&
    v.burke.name === v.latin &&
    v.burke.westCounties > 0 &&
    (v.oregonflora === undefined || (v.oregonflora?.origin === "native" && v.oregonflora.name === v.latin));
  const say = (x, w) => (!x ? "not listed" : `${x.origin || "no origin"}${x.name !== w ? ` as ${x.name}` : ""}`);
  const flagged = verdicts.filter((v) => !clean(v));
  console.log(`\nOur ${ours.length} PNW rows: ${ours.length - flagged.length} native in both, under our name, with west-side specimens.`);
  for (const v of flagged) {
    const west = v.burke && !v.burke.westCounties ? " · no west-side specimen" : "";
    const of = v.oregonflora === undefined ? "" : ` · OregonFlora: ${say(v.oregonflora, v.latin)}`;
    console.log(`  ${v.latin.padEnd(32)} Burke: ${say(v.burke, v.latin)}${west}${of}`);
  }
  writeFileSync(
    `${DIR}ours.json`,
    `${JSON.stringify({ sources: ["Flora of the Pacific Northwest Checklist (Burke Museum, UW)", oregon?.version].filter(Boolean), flagged }, null, 2)}\n`,
  );
  console.log("→ data/sources/pnw-flora/ours.json");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  requireProxyAwareFetch("pnw:checklist");
  await fetchSources(process.argv.includes("--fetch"));
  checkOurs(build(), buildOregonFlora());
}
