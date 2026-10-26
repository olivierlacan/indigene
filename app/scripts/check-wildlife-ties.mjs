// `npm run wildlife:ties -- --region ireland` — re-ask the sources a tie
// cites whether they still record it. `--all` does every region.
//
// A tie's `basis` has been a sentence somebody typed, and `auditSupport` only
// checks the sentence is there. For two kinds of tie there is something to ask:
//
//   1. **Ties relayed by GloBI** — a basis opening "GloBI — …" names the studies
//      GloBI drew the pair from (HOSTS, trophiCH, Robertson 1929…). GloBI is
//      asked for the animal on the plant, and the studies that answer are
//      compared with the studies the basis names.
//   2. **Caterpillar-host ties in Ireland and Scotland** — the Biological
//      Records Centre's Database of Insects and their Food Plants (DBIF) lists,
//      for each host plant, the British invertebrates recorded feeding on it and
//      how many sources say so. It is the British food-plant record those two
//      regions never had; it is asked about every `host` tie there, whatever
//      the basis cites, under every name GBIF knows the insect by.
//
// ## Reading the answer
//
//   CONFIRMED    a study the basis cites (or DBIF) records the pair
//   OTHER        GloBI records the pair, but not from a study the basis names —
//                the basis should be re-cited
//   NOT-FOUND    nothing records the pair → read the basis again
//   UNCITED      the basis cites no study GloBI relays (`_globi.mjs` needs a line)
//
// A group is asked as its members (`askedNames`), and confirmed by any of them.
// Same exit code as the native checks: a NEW flag, a CHANGED verdict or an
// error fails; a NOT-FOUND already on record is printed and does not.
//
// DBIF is an old ASP.NET site with no API. Its robots.txt sets no rule for
// collection; this asks for one host search and one host page per plant, a
// second apart, and caches both for the run.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";
import { openLoader } from "./_load-ts.mjs";
import { snapshotJson } from "./_snapshot-json.mjs";
import { withSeeds } from "./_regions.mjs";
import { askedNames, gbifNames } from "./_fauna.mjs";
import { studiesCitedBy, studyOfCitation } from "./_globi.mjs";

requireProxyAwareFetch("wildlife:ties");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "wildlife-ties");
const UA = "IndigeneWildlifeTies/0.1 (https://github.com/olivierlacan/indigene)";
const GLOBI = "https://api.globalbioticinteractions.org";
const DBIF = "https://dbif.brc.ac.uk";
/** The regions DBIF speaks for: it is a British record. */
const DBIF_REGIONS = new Set(["ireland", "scotland-lowlands"]);
const INVERTEBRATE = new Set(["butterfly", "moth", "bee"]);

const args = process.argv.slice(2);
const regionArg = args.includes("--region") ? args[args.indexOf("--region") + 1] : null;
const all = args.includes("--all");
if (!all && !regionArg) {
  console.error("usage: npm run wildlife:ties -- --region <id>   (or --all)");
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, { json = true, init = {}, politeMs = 300, timeoutMs = 45000 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { ...init, headers: { "User-Agent": UA, ...(init.headers ?? {}) }, signal: AbortSignal.timeout(timeoutMs) });
      await sleep(politeMs);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return json ? await res.json() : await res.text();
    } catch (e) {
      if (attempt >= 1) throw e;
      await sleep(3000);
    }
  }
}

// ------------------------------------------------------------------ GloBI

/** Which of our studies GloBI says record this animal on this plant. */
async function globiStudies(animal, plant) {
  const payload = await get(
    `${GLOBI}/interaction?sourceTaxon=${encodeURIComponent(animal)}&targetTaxon=${encodeURIComponent(plant)}` +
      "&type=json&limit=200&includeObservations=true&field=study_citation&field=study_source_citation",
    { politeMs: 150 },
  );
  const cols = payload?.columns ?? [];
  const rows = payload?.data ?? [];
  const studies = new Set();
  for (const row of rows) {
    for (const name of ["study_source_citation", "study_citation"]) {
      const label = studyOfCitation(row[cols.indexOf(name)] ?? "");
      if (label) studies.add(label);
    }
  }
  return { records: rows.length, studies: [...studies] };
}

// ------------------------------------------------------------------- DBIF

const hostPages = new Map();
const hostForms = { fields: null };

/** DBIF's host search: every host id whose name is one of `wanted`. */
async function dbifHostIds(query, wanted) {
  if (!hostForms.fields) {
    const form = await get(`${DBIF}/hosts.aspx`, { json: false, politeMs: 1000 });
    hostForms.fields = Object.fromEntries([...form.matchAll(/name="(__[A-Z]+)"[^>]*value="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  }
  const body = new URLSearchParams({ ...hostForms.fields, "ctl00$cphBody$txtSrchHost": query, "ctl00$cphBody$btnSearchHost": "Search" });
  const results = await get(`${DBIF}/hosts.aspx`, {
    json: false,
    politeMs: 1000,
    init: { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  });
  return [...results.matchAll(/hostsresults\.aspx\?hostid=(\d+)>([^<]+)</g)]
    .filter((m) => wanted.includes(m[2].trim()))
    .map((m) => Number(m[1]));
}

/** The invertebrates on one DBIF host page, as binomials → source count. */
async function dbifPage(hostId) {
  const page = await get(`${DBIF}/hostsresults.aspx?hostid=${hostId}`, { json: false, politeMs: 1000 });
  const listed = new Map();
  for (const row of page.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs)) {
    const cells = [...row[1].matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map((c) => c[1].replace(/<[^>]+>/g, "").trim());
    if (cells.length < 5) continue;
    // "Euphydryas (Eurodryas) aurinia (Rottemburg)": drop the subgenus.
    const binomial = cells[3].replace(/\s+\([A-Z][a-z]+\)/, "").split(/\s+/).slice(0, 2).join(" ");
    if (/^[A-Z][a-z]+ [a-z-]+$/.test(binomial)) listed.set(binomial, (listed.get(binomial) ?? 0) + (Number(cells[4]) || 0));
  }
  return listed;
}

/**
 * What DBIF lists on a plant: the species page (and its "agg." page, for a
 * bramble), and separately the genus page — many old food-plant records say
 * only "Betula", and a record on the genus is weaker than one on the species,
 * so the snapshot says which it was.
 */
async function dbifHost(latin) {
  if (hostPages.has(latin)) return hostPages.get(latin);
  const species = latin.replace(/\s+agg\.$/, "");
  const genus = species.split(" ")[0];
  const speciesIds = await dbifHostIds(species, [species, `${species} agg.`]);
  const genusIds = await dbifHostIds(genus, [genus]);
  const out = speciesIds.length || genusIds.length ? { hostIds: speciesIds, onSpecies: new Map(), onGenus: new Map() } : null;
  if (out) {
    for (const id of speciesIds) for (const [k, v] of await dbifPage(id)) out.onSpecies.set(k, (out.onSpecies.get(k) ?? 0) + v);
    for (const id of genusIds) for (const [k, v] of await dbifPage(id)) out.onGenus.set(k, v);
  }
  hostPages.set(latin, out);
  return out;
}

// ------------------------------------------------------------------ check

async function checkTie(regionId, plant, link, w) {
  const names = askedNames(w);
  const cited = studiesCitedBy(link.basis);
  const out = { plant: plant.id, animal: w.id, support: link.support };
  const viaGlobi = /^GloBI\b/.test(link.basis);
  if (viaGlobi) {
    if (!cited.length) out.globi = { verdict: "UNCITED" };
    else {
      const found = new Set();
      let records = 0;
      for (const name of names) {
        const r = await globiStudies(name, plant.latin);
        records += r.records;
        for (const s of r.studies) found.add(s);
        if (cited.some((c) => found.has(c))) break;
      }
      const confirmedBy = cited.filter((c) => found.has(c));
      out.globi = {
        verdict: confirmedBy.length ? "CONFIRMED" : records ? "OTHER" : "NOT-FOUND",
        cited,
        confirmedBy,
        ...(confirmedBy.length ? {} : { found: [...found] }),
        records,
      };
    }
  }
  // DBIF records what an insect *eats* — a caterpillar's leaf, a beetle's
  // wood — not what an adult drinks from. So it is asked about host ties only;
  // a bee on a bramble flower is not a thing it would ever say.
  if (DBIF_REGIONS.has(regionId) && INVERTEBRATE.has(w.kind) && link.support === "host") {
    const host = await dbifHost(plant.latin);
    if (!host) out.dbif = { verdict: "NO-HOST" };
    else {
      let hit = null;
      let atGenus = false;
      for (const name of names) {
        const aliases = await gbifNames(name);
        hit = [...aliases].find((a) => host.onSpecies.has(a)) ?? null;
        if (!hit) {
          hit = [...aliases].find((a) => host.onGenus.has(a)) ?? null;
          atGenus = Boolean(hit);
        }
        if (hit) break;
      }
      out.dbif = hit
        ? { verdict: "CONFIRMED", as: hit, sources: (atGenus ? host.onGenus : host.onSpecies).get(hit), ...(atGenus ? { atGenus: true } : {}) }
        : { verdict: "NOT-FOUND", hostIds: host.hostIds };
    }
  }
  return out.globi || out.dbif ? out : null;
}

/** One verdict for a tie: confirmed by anything that was asked, else the worst. */
function overall(row) {
  const v = [row.globi?.verdict, row.dbif?.verdict].filter(Boolean);
  if (v.includes("CONFIRMED")) return "CONFIRMED";
  for (const x of ["NOT-FOUND", "OTHER", "UNCITED", "NO-HOST"]) if (v.includes(x)) return x;
  return v[0];
}

const loader = await openLoader();
const { WILDLIFE, SUPPORT } = await loader.load("/src/data/wildlife.ts");
const { REGIONS: RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(RAW);
await loader.close();
const animals = new Map(WILDLIFE.map((w) => [w.id, w]));
// The support map keys Central Florida as `florida-central`, which is the
// region's id too; every region's plants are looked up by id.
const plantsOf = new Map(REGIONS.map((r) => [r.meta.id, new Map(r.seed.map((p) => [p.id, p]))]));

const regions = all ? Object.keys(SUPPORT) : [regionArg];
let failing = false;
for (const regionId of regions) {
  const plants = plantsOf.get(regionId);
  const outFile = join(OUT_DIR, `${regionId}.json`);
  const previous = new Map();
  if (existsSync(outFile)) for (const r of JSON.parse(readFileSync(outFile, "utf8")).ties) previous.set(`${r.plant}→${r.animal}→${r.support}`, r.verdict);

  const ties = [];
  const errors = [];
  const flags = { NEW: [], CHANGED: [], recorded: [] };
  console.log(`${regionId}:`);
  for (const [plantId, links] of Object.entries(SUPPORT[regionId] ?? {})) {
    const plant = plants?.get(plantId);
    if (!plant) continue;
    for (const link of links) {
      let row;
      try {
        row = await checkTie(regionId, plant, link, animals.get(link.wildlifeId));
      } catch (e) {
        errors.push(`${plantId} → ${link.wildlifeId}: ${e.message}`);
        console.log(`  ERR   ${plantId} → ${link.wildlifeId}: ${e.message}`);
        continue;
      }
      if (!row) continue;
      row.verdict = overall(row);
      ties.push(row);
      const key = `${row.plant}→${row.animal}→${row.support}`;
      const prev = previous.get(key);
      let mark = "ok  ";
      if (prev !== undefined && prev !== row.verdict) (mark = "CHG "), flags.CHANGED.push(`${prev} → ${row.verdict}  ${key}`);
      else if (row.verdict !== "CONFIRMED") {
        if (prev === undefined) (mark = "NEW "), flags.NEW.push(`${row.verdict}  ${key}`);
        else (mark = "rec "), flags.recorded.push(`${row.verdict}  ${key}`);
      }
      const how = [row.globi && `GloBI ${row.globi.verdict.toLowerCase()}`, row.dbif && `DBIF ${row.dbif.verdict.toLowerCase()}`].filter(Boolean).join(", ");
      console.log(`  ${mark}  ${row.verdict.padEnd(10)} ${plantId} → ${link.wildlifeId}  (${how})`);
    }
  }
  if (!errors.length) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(outFile, snapshotJson({ region: regionId, ranAt: new Date().toISOString(), ties }, "ties"));
  }
  for (const [title, xs] of Object.entries(flags)) if (xs.length) console.log(`\n${title}:\n  ${xs.join("\n  ")}`);
  if (errors.length) console.log(`\n${errors.length} error(s) — snapshot NOT written.`);
  console.log(`\n${ties.length} ties checked; ${ties.filter((t) => t.verdict === "CONFIRMED").length} confirmed.\n`);
  if (flags.NEW.length || flags.CHANGED.length || errors.length) failing = true;
}
process.exit(failing ? 1 : 0);
