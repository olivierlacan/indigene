// HOSTS — the Natural History Museum's database of the world's Lepidoptera
// host plants — fetched whole and counted per region.
//
//   npm run hosts:fetch              # download once (140k records), then count
//   npm run hosts:fetch -- --refresh # download again
//
// HOSTS (Robinson et al.; NHM Data Portal, doi:10.5519/havt50xw, **CC0**) is the
// one global list of which caterpillars eat which plants. Each record is a moth
// or butterfly, a host plant and a *location* — a country or a broad region
// ("Australia", "Southern Africa", "Neotropical"), never finer. It is the
// candidate host source for the southern regions that have nothing better; New
// Zealand has Plant-SyNZ, which is far richer (see `nz-host-counts.mjs`).
//
// Writes:
//   data/sources/hosts/hosts-raw.json          every record, 48 MB — git-ignored
//   data/sources/hosts/records/<area>.csv      committed — the full HOSTS records
//                                              for each candidate area, so the
//                                              evidence behind a count survives
//                                              upstream changes and can be read
//                                              without re-downloading 48 MB
//   data/sources/hosts/genus-counts.json       committed — for each area,
//                                              distinct Lepidoptera species per
//                                              host genus
//
// The Data Portal serves at most 1,000 records a request and refuses deep
// offsets, so this walks its `after` cursor — 141 polite requests.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("hosts:fetch");

const RESOURCE = "877f387a-36a3-486c-a0c1-b8d5fb69f85a";
const API = "https://data.nhm.ac.uk/api/3/action/datastore_search";
const UA = "IndigeneHosts/0.1 (https://github.com/olivierlacan/indigene)";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data", "sources", "hosts");
const RAW = join(DIR, "hosts-raw.json");
const OUT = join(DIR, "genus-counts.json");
const RECORDS_DIR = join(DIR, "records");

/** The columns kept in the archived CSVs, in HOSTS' own names and order. */
const COLUMNS = [
  "HOSTS ID", "Insect Family", "Insect Genus", "Insect Species", "Insect Subspecies", "Insect Author",
  "Hostplant Family", "Hostplant Genus", "Hostplant Species", "Hostplant Subspecies/var",
  "Location", "Damage", "Lab Rearing",
];
const csvCell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * HOSTS locations that stand for each southern area. Only the country (or the
 * sub-continental region that contains it) — "Neotropical" or "Indo-Australian"
 * would pull in records from the Amazon or Borneo.
 */
const AREAS = {
  australia: ["Australia", "Australia (prov)"],
  "southern-africa": ["South Africa", "Southern Africa", "South Africa (prov)"],
  "rio-de-la-plata": ["Argentina", "Argentina (prov)", "Uruguay"],
  "new-zealand": ["New Zealand"],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download() {
  const rows = [];
  let after = null;
  for (;;) {
    const q = new URLSearchParams({ resource_id: RESOURCE, limit: "1000" });
    if (after !== null) q.set("after", JSON.stringify(after));
    const res = await fetch(`${API}?${q}`, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status} from the NHM Data Portal`);
    const { success, result, error } = await res.json();
    if (!success) throw new Error(`Data Portal: ${JSON.stringify(error)}`);
    rows.push(...result.records);
    after = result.after ?? null;
    if (rows.length % 20000 < 1000) console.log(`  ${rows.length.toLocaleString()} / ${result.total.toLocaleString()}`);
    if (!result.records.length || after === null || rows.length >= result.total) break;
    await sleep(200);
  }
  return rows;
}

mkdirSync(DIR, { recursive: true });
let rows;
if (existsSync(RAW) && !process.argv.includes("--refresh")) {
  rows = JSON.parse(readFileSync(RAW, "utf8"));
  console.log(`using ${RAW} (${rows.length.toLocaleString()} records)`);
} else {
  console.log("downloading HOSTS from the NHM Data Portal …");
  rows = await download();
  writeFileSync(RAW, JSON.stringify(rows));
}

const out = {};
mkdirSync(RECORDS_DIR, { recursive: true });
for (const [area, locations] of Object.entries(AREAS)) {
  const want = new Set(locations);
  // Every record for the area, sorted by host plant then moth so a re-fetch
  // diffs line by line.
  const mine = rows
    .filter((r) => want.has(r.Location))
    .sort((a, b) =>
      `${a["Hostplant Genus"]} ${a["Hostplant Species"]} ${a["Insect Genus"]} ${a["Insect Species"]} ${a["HOSTS ID"]}`
        .localeCompare(`${b["Hostplant Genus"]} ${b["Hostplant Species"]} ${b["Insect Genus"]} ${b["Insect Species"]} ${b["HOSTS ID"]}`));
  writeFileSync(
    join(RECORDS_DIR, `${area}.csv`),
    [COLUMNS.join(","), ...mine.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n",
  );
  const byGenus = new Map();
  let records = 0;
  for (const r of rows) {
    if (!want.has(r.Location) || !r["Hostplant Genus"] || !r["Insect Species"]) continue;
    records++;
    const g = r["Hostplant Genus"];
    if (!byGenus.has(g)) byGenus.set(g, new Set());
    byGenus.get(g).add(`${r["Insect Genus"]} ${r["Insect Species"]}`);
  }
  out[area] = {
    locations,
    records,
    genera: Object.fromEntries([...byGenus].sort((a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0])).map(([g, s]) => [g, s.size])),
  };
  console.log(`${area.padEnd(16)} ${records.toLocaleString().padStart(6)} records, ${byGenus.size} host genera`);
}

writeFileSync(
  OUT,
  JSON.stringify({
    source: "HOSTS — a Database of the World's Lepidopteran Hostplants, Natural History Museum (doi:10.5519/havt50xw), CC0",
    rule: "distinct Lepidoptera species (insect genus + species) recorded on each host-plant genus, in the listed HOSTS locations",
    retrieved: new Date().toISOString().slice(0, 10),
    areas: out,
  }, null, 1) + "\n",
);
console.log(`wrote ${OUT}`);
