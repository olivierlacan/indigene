// `npm run floras` — put every plant a region ships to its own botanists'
// checklists, beside Kew's: the second opinion `docs/academic-checklists/`
// planned for each region that had only one.
//
// `pnw:checklist` does this for the Pacific Northwest and `atlas` for Florida,
// each with a script of its own because each source has quirks of its own.
// These have few: every one is a single file a program may fetch (robots.txt
// and terms read on 2026-10-17, in the reports), with one name and one status
// per row. So one script reads them all, and adding a region is a line in
// `REGIONS` below.
//
//   north-michigan  Michigan FQA (U-M Herbarium & MNFI, 2014)
//   chicago         Flora of the Chicago Region (Wilhelm & Rericha 2017) · Illinois FQA
//   mid-atlantic    Pennsylvania Natural Heritage Program · New Jersey FQA (NJDEP 2019)
//   ireland         BSBI Plant Atlas 2020 native statuses, for Ireland
//   nz-auckland     Checklist of the New Zealand Flora 2026 · Auckland Council TR2025/6
//   france-atlantic, france-continental, france-alpine
//                   the regional red lists inside each, from INPN's BDC-Statuts
//
// ## Usage
//
//   npm run floras                       download what raw/ is missing, then check
//                                        every region → <region>.json
//   npm run floras -- --fetch            download every source again
//   npm run floras -- --region chicago   one region
//
// ## Reading the answer
//
// Each source says native, introduced, both, uncertain, or absent (not in the
// list). The exit code is about change, like `native:check`'s:
//
//   recorded   a disagreement the committed snapshot already carries: printed, not a failure
//   NEW        a row with no previous verdict that isn't native in every source: fails
//   CHANGED    a verdict that differs from the committed one: fails
//   STALE      a REVIEWED name the source no longer has: fails
//
// A disagreement is editorial, never smoothed over: the row still ships and
// the plant page says who said what.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireProxyAwareFetch } from "./_net.mjs";
import { readCsv, readTsv } from "./_pnwflora.mjs";
import {
  aucklandRows,
  aucklandVerdict,
  bsbiRows,
  bsbiVerdict,
  fqaCitation,
  fqaRows,
  fqaVerdict,
  indexRows,
  lookup,
  nzRows,
  nzVerdict,
  paRows,
  paVerdict,
  redListRows,
  redListVerdict,
} from "./_floras.mjs";

const DIR = fileURLToPath(new URL("../../data/sources/regional-floras/", import.meta.url));
const RAW = `${DIR}raw/`;
const DATA = fileURLToPath(new URL("../src/data/", import.meta.url));
const UA = "Indigene native-plant app (+https://indigene.app; https://github.com/olivierlacan/indigene)";

const fqa = (id) => ({
  files: { [`fqa-${id}.json`]: `https://universalfqa.org/get/database/${id}` },
  read: () => {
    const doc = JSON.parse(readFileSync(`${RAW}fqa-${id}.json`, "utf8"));
    return { rows: fqaRows(doc), note: fqaCitation(doc) };
  },
  verdict: fqaVerdict,
});

/** The cells of one sheet of an .xlsx, as `[column letter, value]` rows. */
function readSheet(file, sheet) {
  const part = (p) => execFileSync("unzip", ["-p", file, p], { maxBuffer: 1e8 }).toString();
  const shared = [...part("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    [...m[1].matchAll(/<t[^>]*>([^<]*)<\/t>/g)].map((t) => t[1]).join(""),
  );
  return [...part(`xl/worksheets/${sheet}.xml`).matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((r) =>
    [...r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map((c) => {
      const v = c[3]?.match(/<v>([^<]*)<\/v>/)?.[1];
      return [c[1], /t="s"/.test(c[2]) ? shared[Number(v)] : (v ?? c[3]?.match(/<t[^>]*>([^<]*)/)?.[1])];
    }),
  );
}

const LANDCARE = "https://datastore.landcareresearch.co.nz/dataset";

// INPN's BDC-Statuts: every protection and red-list status in France, 329 MB
// unpacked. Only the regional red-list rows are read, filtered before parsing,
// and read once for all three regions.
let bdc;
const bdcRows = () =>
  (bdc ??= readCsv(
    execFileSync("sh", ["-c", `unzip -p "$0" BDC_18/bdc_18_01.csv | awk 'NR == 1 || /^[0-9]*,[0-9]*,[0-9]*,"LRR",/'`, `${RAW}bdc.zip`], {
      maxBuffer: 1e9,
    }).toString(),
  ));

const redList = (lists, area) => ({
  files: { "bdc.zip": "https://assets.patrinat.fr/files/referentiel/BDC.zip" },
  read: () => ({ rows: redListRows(bdcRows(), lists) }),
  verdict: redListVerdict,
  lists,
  name: { en: "France's national nature inventory", fr: "L'Inventaire national du patrimoine naturel" },
  cite: "PatriNat (OFB-MNHN-CNRS-IRD). 2025. BDC-Statuts v18, base de connaissance des statuts des espèces. INPN. Licence Ouverte / Etalab. Regional red lists of the vascular flora: " + lists.join(", ") + ".",
  url: "https://inpn.mnhn.fr/programme/base-de-connaissance-statuts/presentation",
  area,
});

// Every source: what it is, where it comes from, how its file becomes rows,
// and what its words mean. `area` is the phrase the plant page puts after
// "doesn't record it".
export const SOURCES = {
  "mi-fqa": {
    ...fqa(50),
    name: { en: "The University of Michigan Herbarium", fr: "L'herbier de l'université du Michigan" },
    cite: "Reznicek, Penskar, Walters & Slaughter. 2014. Michigan Floristic Quality Assessment Database. University of Michigan Herbarium & MNFI.",
    url: "https://michiganflora.net/",
    area: { en: "in Michigan", fr: "au Michigan" },
  },
  "chicago-fqa": {
    ...fqa(80),
    name: { en: "The Flora of the Chicago Region", fr: "La Flore de la région de Chicago" },
    cite: "Wilhelm & Rericha. 2017. Flora of the Chicago Region. Indiana Academy of Science; as its universalFQA database (Johnson 2018).",
    url: "https://universalfqa.org/",
    area: { en: "in the Chicago Region", fr: "dans la région de Chicago" },
  },
  "il-fqa": {
    ...fqa(162),
    name: { en: "Illinois's 1997 checklist", fr: "La liste de l'Illinois de 1997" },
    cite: "Taft, Wilhelm, Ladd & Masters. 1997. Floristic Quality Assessment for Vegetation in Illinois; with families, Benda 2020.",
    url: "https://universalfqa.org/",
    area: { en: "in Illinois", fr: "en Illinois" },
  },
  "nj-fqa": {
    ...fqa(157),
    name: { en: "New Jersey's environment agency", fr: "L'agence de l'environnement du New Jersey" },
    cite: "Walz et al. 2018, updated 2019. Universal Floristic Quality Assessment Index for Vascular Plants and Mosses of New Jersey. NJDEP.",
    url: "https://universalfqa.org/",
    area: { en: "in New Jersey", fr: "au New Jersey" },
  },
  pa: {
    files: { "pa-plant-checklist.json": "https://naturalheritage.dcnr.pa.gov/docs/PlantChecklist.txt" },
    read: () => ({ rows: paRows(JSON.parse(readFileSync(`${RAW}pa-plant-checklist.json`, "utf8").replace(/^﻿/, ""))) }),
    verdict: paVerdict,
    name: { en: "The Pennsylvania Natural Heritage Program", fr: "Le programme du patrimoine naturel de Pennsylvanie" },
    cite: "Pennsylvania Natural Heritage Program. Pennsylvania Vascular Plant List. DCNR / Western Pennsylvania Conservancy.",
    url: "https://naturalheritage.dcnr.pa.gov/PlantChecklist.html",
    area: { en: "in Pennsylvania", fr: "en Pennsylvanie" },
  },
  "bsbi-ie": {
    files: { "bsbi-status.zip": "https://zenodo.org/records/11097371/files/PA2020_NativeStatusData.zip?download=1" },
    read: () => {
      const part = (f) => readCsv(execFileSync("unzip", ["-p", `${RAW}bsbi-status.zip`, `PA2020_NativeStatusData/${f}`]).toString());
      return { rows: bsbiRows(part("status.csv"), part("nameLookup.csv"), "statusIE") };
    },
    verdict: bsbiVerdict,
    name: { en: "The BSBI Plant Atlas 2020", fr: "L'atlas des plantes 2020 de la BSBI" },
    cite: "BSBI & UKCEH. 2024. Plant Atlas 2020 — Plant native statuses for Britain, Ireland and the Channel Islands. Zenodo, doi:10.5281/zenodo.11097371. CC BY 4.0.",
    url: "https://plantatlas2020.org/",
    area: { en: "in Ireland", fr: "en Irlande" },
  },
  "nz-checklist": {
    files: {
      "nz-seed-plants.tsv": `${LANDCARE}/242c2105-09a7-4cfa-999b-3a7e031aaafb/resource/d64275d4-bdab-4fcc-bef4-1e7031bb2157/download/checklist-of-the-new-zealand-flora-seed-plants-may-2026.tsv`,
      "nz-ferns.tsv": `${LANDCARE}/22151919-0136-453f-a6f1-6ba034340647/resource/005947b8-dacd-4bad-b982-92fbfeb117db/download/checklist-of-the-new-zealand-flora-ferns-and-lycophytes-may-2026.tsv`,
    },
    // Both parts are UTF-16.
    read: () => ({
      rows: ["nz-seed-plants.tsv", "nz-ferns.tsv"].flatMap((f) => nzRows(readTsv(new TextDecoder("utf-16le").decode(readFileSync(`${RAW}${f}`))))),
    }),
    verdict: nzVerdict,
    name: { en: "The Checklist of the New Zealand Flora", fr: "La liste de la flore de Nouvelle-Zélande" },
    cite: "Allan Herbarium. 2026. Checklist of the New Zealand Flora — Seed Plants; Ferns and Lycophytes. Manaaki Whenua – Landcare Research. CC BY 4.0.",
    url: "https://datastore.landcareresearch.co.nz/dataset/checklist-of-the-new-zealand-flora-seed-plants-2026",
    area: { en: "in New Zealand", fr: "en Nouvelle-Zélande" },
  },
  auckland: {
    files: {
      "auckland-tr2025-6.xlsx":
        "https://www.knowledgeauckland.org.nz/media/ekun5pvp/tr2025-06-conservation-status-vascular-plant-species-in-auckland-revised-march-2025-species-list-april-2025.xlsx",
    },
    // Sheet 1 is the report's front page; the list is sheet 2.
    read: () => ({ rows: aucklandRows(readSheet(`${RAW}auckland-tr2025-6.xlsx`, "sheet2")) }),
    verdict: aucklandVerdict,
    name: { en: "Auckland Council", fr: "Le conseil d'Auckland" },
    cite: "Simpkins, Woolly, de Lange, Kilgour, Cameron & Melzer. 2025. Conservation status of vascular plant species in Tāmaki Makaurau / Auckland, revised March 2025. Auckland Council TR2025/6. CC BY 4.0.",
    url: "https://www.knowledgeauckland.org.nz/publications/conservation-status-of-vascular-plant-species-in-tamaki-makaurau-auckland-revised-march-2025/",
    area: { en: "in Auckland", fr: "à Auckland" },
  },
  // The old (pre-2016) regions whose red lists fall inside ours. Hauts-de-France
  // loaded only its NA rows, so it can say introduced and never native. Provence's
  // list is threatened plants only and Languedoc never finished one, which is
  // why Mediterranean France isn't here: most of its rows would read "absent".
  "lrr-atlantic": redList(
    ["Bretagne", "Basse-Normandie", "Haute-Normandie", "Hauts-de-France", "Ile-de-France", "Pays-de-la-Loire", "Centre", "Poitou-Charentes", "Aquitaine", "Limousin"],
    { en: "in the west's regional red lists", fr: "dans les listes rouges régionales de l'Ouest" },
  ),
  "lrr-continental": redList(["Alsace", "Lorraine", "Champagne-Ardenne", "Bourgogne", "Franche-Comté"], {
    en: "in the east's regional red lists",
    fr: "dans les listes rouges régionales de l'Est",
  }),
  "lrr-alpine": redList(["Rhône-Alpes", "Provence-Alpes-Côte-d'Azur"], {
    en: "in the Alps' regional red lists",
    fr: "dans les listes rouges régionales des Alpes",
  }),
};

/** Which sources each region is put to, in the order the page names them. */
export const REGIONS = {
  "north-michigan": ["mi-fqa"],
  chicago: ["chicago-fqa", "il-fqa"],
  "mid-atlantic": ["pa", "nj-fqa"],
  ireland: ["bsbi-ie"],
  "nz-auckland": ["nz-checklist", "auckland"],
  "france-atlantic": ["lrr-atlantic"],
  "france-continental": ["lrr-continental"],
  "france-alpine": ["lrr-alpine"],
};

// Names a source draws differently from our row, looked up under the
// source's name instead. Each is re-checked every run: if the source drops
// the name, the entry is STALE and the run fails.
export const REVIEWED = {
  chicago: {
    "Solidago rigida": { "chicago-fqa": "Oligoneuron rigidum", why: "Wilhelm & Rericha keep stiff goldenrod in Oligoneuron." },
    "Primula meadia": {
      "chicago-fqa": "Dodecatheon meadia",
      "il-fqa": "Dodecatheon meadia",
      why: "Shooting star moved into Primula in 2007; both lists keep the older Dodecatheon.",
    },
    "Symphyotrichum novae-angliae": { "il-fqa": "Aster novae-angliae", why: "The 1997 Illinois list predates the split of the American asters out of Aster." },
    "Symphyotrichum laeve": { "il-fqa": "Aster laevis", why: "The 1997 Illinois list predates the split of the American asters out of Aster." },
    "Eutrochium maculatum": { "il-fqa": "Eupatorium maculatum", why: "The 1997 Illinois list keeps Joe-Pye weeds in Eupatorium." },
    "Packera aurea": { "il-fqa": "Senecio aureus", why: "The 1997 Illinois list keeps golden ragwort in Senecio." },
  },
  "mid-atlantic": {
    "Schizachyrium scoparium": {
      pa: "Schizachyrium scoparium var. scoparium",
      why: "Pennsylvania lists little bluestem by variety: var. scoparium is native, the coastal var. divergens introduced.",
    },
    "Andropogon gerardii": { pa: "Andropogon gerardi", why: "One letter: Pennsylvania keeps Vitman's spelling, as VASCAN does." },
  },
  ireland: {
    "Taraxacum officinale": {
      "bsbi-ie": "Taraxacum",
      why: "The atlas maps dandelions as one aggregate, Taraxacum, and gives that its native status in Ireland.",
    },
    "Thymus praecox": { "bsbi-ie": "Thymus drucei", why: "British and Irish floras call wild thyme T. drucei; Kew folds it into T. praecox." },
    "Struthiopteris spicant": { "bsbi-ie": "Blechnum spicant", why: "Hard fern: the atlas keeps the older genus, Blechnum." },
  },
  "france-atlantic": {
    "Pyrus pyraster": { "lrr-atlantic": "Pyrus communis subsp. pyraster", why: "TAXREF keeps the wild pear as a subspecies of the cultivated one." },
  },
};

async function fetchSources(ids) {
  mkdirSync(RAW, { recursive: true });
  // The three French sources share one download.
  for (const [file, url] of new Map(ids.flatMap((id) => Object.entries(SOURCES[id].files)))) {
    console.log(`Fetching ${url} …`);
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    writeFileSync(`${RAW}${file}`, Buffer.from(await res.arrayBuffer()));
  }
}

/** One source's rows, read from its downloads in raw/. */
function load(id) {
  const src = SOURCES[id];
  const { rows } = src.read();
  const tally = {};
  for (const r of rows) tally[src.verdict(r)] = (tally[src.verdict(r)] ?? 0) + 1;
  console.log(`${id}: ${rows.length} taxa — ${Object.entries(tally).map(([k, n]) => `${k} ${n}`).join(" · ")}`);
  return rows;
}

/** Our rows for a region, from its plant file. */
function ours(region) {
  const src = readFileSync(`${DATA}plants.${region}.ts`, "utf8");
  return [...src.matchAll(/^\s+id: "([^"]+)",\n\s+common: "([^"]+)",\n\s+latin: "([^"]+)"/gm)].map((m) => ({ id: m[1], latin: m[3] }));
}

function checkRegion(region, sources) {
  const ids = REGIONS[region];
  const index = Object.fromEntries(ids.map((id) => [id, indexRows(sources[id])]));
  const outFile = `${DIR}${region}.json`;
  const previous = new Map();
  if (existsSync(outFile)) for (const r of JSON.parse(readFileSync(outFile, "utf8")).rows) previous.set(r.id, r);

  const problems = [];
  const reviewed = REVIEWED[region] ?? {};
  for (const [latin, r] of Object.entries(reviewed)) {
    for (const id of ids) if (r[id] && !lookup(index[id], r[id], SOURCES[id].verdict)) problems.push(`STALE ${latin}: ${id} no longer has ${r[id]}`);
  }

  const rows = ours(region).map(({ id, latin }) => {
    const row = { id, latin };
    const hits = Object.fromEntries(ids.map((s) => [s, lookup(index[s], reviewed[latin]?.[s] ?? latin, SOURCES[s].verdict)]));
    // A source that missed the name may know the one another source filed it
    // under (the NZ checklist's *Didymocheton spectabilis* is Auckland's too).
    for (const s of ids) {
      if (hits[s] || reviewed[latin]?.[s]) continue;
      const others = ids.filter((o) => o !== s && hits[o]).flatMap((o) => [hits[o].name, ...hits[o].synonyms]);
      for (const name of others) if ((hits[s] = lookup(index[s], name, SOURCES[s].verdict))) break;
    }
    for (const s of ids) row[s] = { as: hits[s]?.name ?? null, verdict: SOURCES[s].verdict(hits[s]) };
    return row;
  });
  const said = (r) => ids.map((s) => `${s}: ${r[s].verdict}${r[s].as && r[s].as !== r.latin ? ` (as ${r[s].as})` : ""}`).join(" · ");
  const agrees = (r) => ids.every((s) => r[s].verdict === "native");
  const key = (r) => ids.map((s) => r[s]?.verdict).join("/");

  console.log(`\n${region}: our ${rows.length} rows, put to ${ids.join(" and ")}`);
  for (const r of rows) {
    const prev = previous.get(r.id);
    if (prev && key(prev) !== key(r)) problems.push(`CHANGED ${r.latin}: was ${key(prev)}, now ${key(r)}`);
    else if (!agrees(r) && !prev) problems.push(`NEW ${r.latin}: ${said(r)}`);
    else if (!agrees(r)) console.log(`  rec  ${r.latin.padEnd(34)} ${said(r)}`);
  }
  console.log(`  ${rows.filter(agrees).length} of ${rows.length} native in ${ids.length > 1 ? "every source" : "it"}.`);

  // One row per line: a verdict that moves is a one-line diff.
  const head = JSON.stringify(
    { region, ranAt: new Date().toISOString().slice(0, 10), sources: Object.fromEntries(ids.map((id) => [id, SOURCES[id].cite])) },
    null,
    2,
  );
  writeFileSync(outFile, `${head.slice(0, -2)},\n  "rows": [\n${rows.map((r) => `    ${JSON.stringify(r)}`).join(",\n")}\n  ]\n}\n`);
  console.log(`→ data/sources/regional-floras/${region}.json`);
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const only = args.includes("--region") ? args[args.indexOf("--region") + 1] : null;
  if (only && !REGIONS[only]) throw new Error(`no sources for ${only}; regions: ${Object.keys(REGIONS).join(", ")}`);
  const regions = only ? [only] : Object.keys(REGIONS);
  const ids = [...new Set(regions.flatMap((r) => REGIONS[r]))];
  // The downloads stay out of git; a source raw/ doesn't have is fetched.
  const missing = ids.filter((id) => !Object.keys(SOURCES[id].files).every((f) => existsSync(`${RAW}${f}`)));
  if (args.includes("--fetch") || missing.length) {
    requireProxyAwareFetch("floras");
    await fetchSources(args.includes("--fetch") ? ids : missing);
  }
  const sources = Object.fromEntries(ids.map((id) => [id, load(id)]));
  const problems = regions.flatMap((r) => checkRegion(r, sources));
  if (problems.length) {
    console.log(`\n${problems.length} to review (the snapshots are written; re-run once reviewed):`);
    for (const p of problems) console.log(`  ${p}`);
    process.exitCode = 1;
  } else console.log("\nNext: `npm run native-evidence` to refresh what the plant pages show.");
}
