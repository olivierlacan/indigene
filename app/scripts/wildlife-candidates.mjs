// `npm run wildlife -- --region <id>` — propose animals for the wildlife layer,
// with the evidence for each, for a human to accept or reject.
//
// `npm run coverage` has been saying the same thing about every region for a
// while: a third to a half of the plants we ship name **no animal at all**.
// Continental France names ties for 10 of its 22 plants, Mediterranean France
// for 11 of 21. The layer that answers "will it bring monarchs?" answers
// "we don't know" for most of the list, and the reason was never disagreement
// about what belongs there — it was that finding the ties meant reading a
// species page per plant, by hand, forever.
//
// This script is the mechanical half of that job. Same contract as
// `candidates.mjs`, which does it for plants:
//
// ## What it is not
//
// **It does not write wildlife rows, and it must not.** A catalog entry carries
// a common name, a blurb in plain words a child could read, an icon, a native
// status with a citable basis; a tie carries a support kind, a reliance, and a
// plant-specific note. Those are editorial. This produces a *shortlist with
// evidence* — the animal, what GloBI says it does to the plant, how many records
// say so, which studies they come from, and whether the animal is actually
// present and native in the region. Somebody still reads it, throws most of it
// out, and writes the rows.
//
// ## Where the evidence comes from, and how far each piece can be trusted
//
//   1. **Who interacts with this plant** — GloBI, the aggregate of published
//      plant↔animal interaction records. Strongest term and entirely mechanical.
//      It is also *worldwide*: GloBI knowing that a moth eats birch says nothing
//      about whether that moth lives here, which is what term 3 is for.
//   2. **What kind of tie** — GloBI's own interaction type (`eatenBy`,
//      `flowersVisitedBy`, `hasDispersalVector`…), mapped to a suggested
//      `support` kind. A suggestion: `eatenBy` covers a caterpillar stripping a
//      leaf and a deer browsing a twig, and only a human can tell which story
//      the plant should tell.
//   3. **Does the animal live here, and is it native?** iNaturalist — how many
//      research-grade observations fall inside the region's own coverage box,
//      and what establishment means the region's places record. This is the term
//      that turns a worldwide interaction list into a regional one, and it has
//      to do that work alone: GloBI's records are not georeferenced (2 in 500
//      carry a coordinate — `data/sources/globi/probe.json`, Q5), so its own
//      bbox filter cannot be used for this.
//   4. **Can we cite it?** For every proposed tie, the studies GloBI names as
//      the source of those records. A tie we cannot cite is a tie we do not
//      ship, so this is a filter and not a decoration.
//
// ## The two tracks, and why the cheap one runs first
//
//   - **Ties for animals we already have.** The catalog holds animals that some
//     region ties to a plant and another region doesn't, though it ships the
//     same plant or a close relative. Those cost one query each and need no new
//     catalog entry. `npm run coverage` already lists a few by hand; this finds
//     them all.
//   - **Animals we don't have yet.** Ranked by how many of the region's plants
//     they touch, because an animal tied to five of our rows earns its blurb and
//     one tied to a single row usually doesn't.
//
// ## How it queries GloBI, and why it looks roundabout
//
// GloBI answers `/interaction` in two modes, and the difference is a trap the
// first probe fell into (see `probe-globi.mjs`'s header). The default collapses
// records into distinct interactions and blanks every per-observation column —
// citations included. `includeObservations=true` fills them in, but the citation
// join is expensive: ask it for every animal on an oak at once and GloBI times
// out inside itself and answers 500.
//
// So: the cheap aggregated `/taxon/<plant>/<type>` endpoints produce the partner
// lists (one request per plant per interaction type, ~1 s even for oak), the
// shortlist is cut down from those, and citations are fetched **one animal–plant
// pair at a time** — small queries that come back in under a second. Nothing is
// proposed without one.
//
// ## Usage
//
//   npm run wildlife -- --region france-continental
//   npm run wildlife -- --region pnw --top 40
//   npm run wildlife -- --all                 # every region, writing each report
//   npm run wildlife -- --region pnw --write  # write docs/candidates/wildlife-pnw.md
//
// Needs open internet (GloBI + iNaturalist). Behind a proxy this only works as
// `npm run wildlife`, which sets NODE_USE_ENV_PROXY=1 — see `_net.mjs`.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";
import { withSeeds } from "./_regions.mjs";

requireProxyAwareFetch("wildlife");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "docs", "candidates");
const SNAPSHOT = join(REPO_ROOT, "data", "sources", "globi", "wildlife-ties.json");
const CACHE_FILE = join(REPO_ROOT, "app", "node_modules", ".cache", "wildlife-candidates.json");

const UA = "indigene-wildlife/0.1 (+https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";
const GLOBI = "https://api.globalbioticinteractions.org";
const INAT = "https://api.inaturalist.org/v1";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

const REGION_ID = opt("region");
const ALL = flag("all");
const TOP = Number(opt("top", 30));
const WRITE = flag("write") || ALL;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- the cache
//
// A full run is a few thousand HTTP requests against two volunteer-run services,
// and a report is rarely right the first time — the ranking wants tuning, the
// filters want arguing with. Caching every upstream answer on disk makes the
// second run of the day nearly free and keeps the load on GloBI and iNaturalist
// proportionate to what actually changed. It lives under `node_modules/.cache`,
// which is already ignored: this is a speed aid, never a source of truth. The
// committed snapshot is what a reviewer reads.
const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};
let cacheDirty = false;
let cacheHits = 0;
let fetches = 0;

function saveCache() {
  if (!cacheDirty) return;
  mkdirSync(dirname(CACHE_FILE), { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache));
  cacheDirty = false;
}

/**
 * Fetch JSON, remembering the answer. `null` is a legitimate cached value —
 * "this query failed, don't ask again this run" — so misses are told apart by
 * key presence, not by falsiness.
 */
async function getJson(url, { tries = 3, timeoutMs = 45000, politeMs = 0 } = {}) {
  if (url in cache) {
    cacheHits++;
    return cache[url];
  }
  let out = null;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal });
      clearTimeout(t);
      fetches++;
      // A 500 from GloBI is usually its own read timeout on a heavy join, and
      // retrying the identical query just spends another minute reaching it.
      if (res.status === 500) break;
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      out = await res.json();
      break;
    } catch {
      if (attempt >= tries) break;
      await sleep(600 * attempt);
    }
  }
  cache[url] = out;
  cacheDirty = true;
  if (politeMs) await sleep(politeMs);
  return out;
}

// ------------------------------------------------------- GloBI, the partners
//
// Which of GloBI's 49 interaction types can say "this animal depends on this
// plant", and what each one suggests the tie is. The mapping is a *suggestion*
// printed beside the evidence, never a decision: `eatenBy` alone spans a
// caterpillar eating a leaf, a finch eating a seed and a bear eating a berry.
const INTERACTIONS = [
  { type: "eatenBy", support: "eats it" },
  { type: "flowersVisitedBy", support: "visits the flowers" },
  { type: "pollinatedBy", support: "pollinates it" },
  { type: "hasDispersalVector", support: "carries the seed" },
  { type: "createsHabitatFor", support: "shelters in it" },
  { type: "hostOf", support: "hosted by it" },
];

/** Every animal GloBI records on one plant, by interaction type. */
async function partnersFor(latin) {
  const byName = new Map();
  for (const { type } of INTERACTIONS) {
    const payload = await getJson(
      `${GLOBI}/taxon/${encodeURIComponent(latin)}/${type}?type=json`,
      { politeMs: 120 },
    );
    // Shape: columns [source_taxon_name, interaction_type, target_taxon_name],
    // where the source is the plant (possibly a subspecies or a messy label
    // like "rear Quercus alba") and the target is an *array* of partners.
    for (const row of payload?.data ?? []) {
      const partners = Array.isArray(row?.[2]) ? row[2] : [row?.[2]].filter(Boolean);
      for (const raw of partners) {
        const name = String(raw ?? "").trim();
        if (!name) continue;
        const entry = byName.get(name) ?? { name, types: new Set() };
        entry.types.add(type);
        byName.set(name, entry);
      }
    }
  }
  return byName;
}

// A partner name has to be a plain binomial to be worth proposing. GloBI passes
// through whatever its contributors wrote, so this pool also contains genera
// ("Bombus"), families, subspecies trinomials, and free text ("rear Quercus
// alba"). Genus-level names are dropped rather than guessed at: the catalog does
// hold a few deliberate genus entries (bumble bees are "Bombus"), but that is an
// editorial choice about a familiar group, not something to infer from a record
// that simply wasn't identified further.
const BINOMIAL = /^[A-Z][a-z-]+ [a-z][a-z-]+$/;

// ---------------------------------------------------------- iNat, the region
//
// GloBI is worldwide. Everything that makes a candidate *this region's* candidate
// comes from here: is the animal seen inside the box, and do the region's own
// places call it native.
async function inatTaxon(name) {
  const res = await getJson(
    `${INAT}/taxa?q=${encodeURIComponent(name)}&per_page=5`,
    { politeMs: 700 },
  );
  // Exact scientific name only. A fuzzy match happily returns a different
  // animal, and inheriting its observation count would be a fabricated answer
  // about a creature nobody asked about.
  return (res?.results ?? []).find((t) => t.name?.toLowerCase() === name.toLowerCase()) ?? null;
}

async function inatPresence(taxonId, box) {
  const res = await getJson(
    `${INAT}/observations?taxon_id=${taxonId}&quality_grade=research&per_page=0` +
      `&nelat=${box.maxLat}&nelng=${box.maxLon}&swlat=${box.minLat}&swlng=${box.minLon}`,
    { politeMs: 700 },
  );
  return res?.total_results ?? 0;
}

/** What the region's own places say about the animal's establishment means. */
function establishment(taxon, placeIds) {
  const listed = (taxon?.listed_taxa ?? []).filter((l) => placeIds.has(l?.place?.id));
  const values = [...new Set(listed.map((l) => l.establishment_means).filter(Boolean))];
  if (!values.length) return "unknown";
  return values.length === 1 ? values[0] : values.join("/");
}

// ------------------------------------------------- GBIF, the second opinion
//
// iNaturalist's establishment data is *empty* for the French regions — every
// candidate there comes back "unknown", which is not a licence to assume
// native. The first run of this script duly proposed *Harmonia axyridis*, the
// Asian lady beetle, for Continental France: one of the best-known invasives in
// Europe, and exactly the kind of thing the catalog's `native: true` invariant
// exists to keep out.
//
// So native status is asked of GBIF as well, whose checklists carry country
// establishment means, and the two are combined as a **veto**: either source
// saying "introduced" drops the candidate, and neither saying anything leaves
// it flagged `unknown` for a human rather than quietly counted as native.
const gbifCountryTitles = new Map();
async function loadCountryCodes() {
  const list = await getJson("https://api.gbif.org/v1/enumeration/country");
  for (const c of list ?? []) if (c.iso2 && c.title) gbifCountryTitles.set(c.iso2, c.title);
}

/** Normalise a country name enough to match iNaturalist's spelling to GBIF's. */
const normCountry = (s) =>
  String(s ?? "").toLowerCase().replace(/^the /, "").replace(/ of america$/, "").trim();

/** ISO2 codes for the country names iNaturalist gave for this region's box. */
function isoCodesFor(countryNames) {
  const wanted = countryNames.map(normCountry);
  const codes = new Set();
  for (const [iso2, title] of gbifCountryTitles) {
    const t = normCountry(title);
    if (wanted.some((w) => w === t || t.startsWith(w))) codes.add(iso2);
  }
  return codes;
}

async function gbifEstablishment(latin, isoCodes, countryNames) {
  const match = await getJson(
    `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(latin)}`,
    { politeMs: 100 },
  );
  if (!match?.usageKey) return { verdict: "unknown", note: "no GBIF match" };
  const dist = await getJson(
    `https://api.gbif.org/v1/species/${match.usageKey}/distributions?limit=300`,
    { politeMs: 100 },
  );
  const names = countryNames.map(normCountry);
  const here = (dist?.results ?? []).filter((r) => {
    if (r.country && isoCodes.has(r.country)) return true;
    const where = normCountry(r.locality ?? r.country ?? "");
    return where && names.some((n) => where === n || where.startsWith(n));
  });
  const means = here.map((r) => String(r.establishmentMeans ?? "").toUpperCase()).filter(Boolean);
  const introduced = means.filter((m) => /INTRODUCED|INVASIVE|NATURALIS|NATURALIZ|ALIEN/.test(m)).length;
  const native = means.filter((m) => m === "NATIVE").length;
  // Weight of evidence, not any-hit. GBIF aggregates checklists of very
  // different quality, and a *single* stray "INTRODUCED" row is common on
  // species that are plainly native: the Alpine chough and the white-winged
  // snowfinch each carry exactly one for France, and an any-hit veto threw both
  // out of the Alps. So an unambiguous introduction — at least two such records
  // and not one calling it native — is a veto; anything thinner is "unclear",
  // which is a flag on the report and a job for the reader, not a silent drop.
  if (native) return { verdict: "native", introduced, native };
  if (introduced >= 2) return { verdict: "introduced", introduced, native };
  if (introduced) return { verdict: "unclear", introduced, native, note: "a single introduced record, no native one" };
  return { verdict: "unknown", note: here.length ? "no establishment means recorded" : "no distribution here" };
}

// ------------------------------------------------------- GloBI, the citation
//
// One pair at a time, because the same join asked plant-wide returns a 500.
// Also reads the life stage, which GloBI carries on about an eighth of its
// observation records — too sparse to count with (that is why `hostLepCount`
// is not sourced here) and exactly right for corroborating a single tie: a
// record that says "larva" turns "eats it" into "raises its young on it".
async function citationsFor(animal, plant) {
  const payload = await getJson(
    `${GLOBI}/interaction?sourceTaxon=${encodeURIComponent(animal)}` +
      `&targetTaxon=${encodeURIComponent(plant)}&type=json&limit=200&includeObservations=true` +
      "&field=source_taxon_name&field=interaction_type&field=target_taxon_name" +
      "&field=source_specimen_life_stage&field=study_citation&field=study_source_citation",
    // One try, 45 s. These are thousands of small queries, and the ones that
    // are slow are slow because GloBI is grinding a heavy join server-side —
    // re-asking the identical question just spends another 45 s arriving at the
    // same timeout. A pair that won't answer is a pair we can't cite, and an
    // uncited tie is dropped anyway.
    { timeoutMs: 45000, tries: 1, politeMs: 150 },
  );
  const cols = payload?.columns ?? [];
  const at = (name) => cols.indexOf(name);
  const rows = payload?.data ?? [];
  const studies = new Map();
  const stages = new Set();
  for (const row of rows) {
    const study = row[at("study_source_citation")] ?? row[at("study_citation")];
    if (study) studies.set(String(study), (studies.get(String(study)) ?? 0) + 1);
    const stage = row[at("source_specimen_life_stage")];
    if (stage) stages.add(String(stage).toLowerCase());
  }
  return {
    records: rows.length,
    studies: [...studies.entries()].sort((a, b) => b[1] - a[1]).map(([citation, n]) => ({ citation, records: n })),
    lifeStages: [...stages],
    // Only stages that actually mean "immature, eating this plant". `young` and
    // `juvenile` are excluded on purpose: on a bird record they mean a nestling
    // being *fed*, and reading them as larval evidence had the first run of this
    // script announcing that jays raise their young on oak leaves.
    larval: [...stages].some((s) => /larva|caterpillar|cater|nymph/.test(s)),
  };
}

// ---------------------------------------------------------- the citations
//
// GloBI's citation strings are whole reference lists — one runs to twenty
// authors before it says what the dataset is. A tie's `basis` has to be
// readable in a phone-width table, so the recurring contributors get a compact
// name here. This is presentation only: the full string is what goes into the
// committed snapshot, so nothing is lost and the mapping can be argued with.
const SOURCE_NAMES = [
  [/trophiCH/i, "Reji Chacko et al. 2024, trophiCH — a food web for Switzerland"],
  [/DoPI: The Database of Pollinator Interactions|Balfour/i, "Balfour et al. 2022, DoPI — Database of Pollinator Interactions"],
  [/EuPPollNet|Lanuza/i, "Lanuza et al. 2025, EuPPollNet — European plant–pollinator networks"],
  [/Avian Diet Database|Hurlbert/i, "Hurlbert et al. 2021, Avian Diet Database"],
  [/NHM Interactions Bank/i, "NHM Interactions Bank, Natural History Museum"],
  [/EDWIP/i, "EDWIP — Ecological Database of the World's Insect Pathogens"],
  [/Fricke/i, "Fricke & Svenning 2020, global plant–frugivore meta-network (Nature)"],
  [/LIFE 4 Pollinators/i, "LIFE 4 Pollinators, Mediterranean insect–flower citizen-science dataset"],
  [/Ferrer-Paris/i, "Ferrer-Paris et al. 2013, butterfly–host plant associations"],
  [/Hale_?,? ?2024|Hale, Kayla/i, "Hale et al. 2024, terrestrial herbivory food web (Phil. Trans. R. Soc. B)"],
  [/Symbiota Collections of Arthropods|SCAN/i, "Symbiota Collections of Arthropods Network (SCAN)"],
  [/Snow Entomological Museum|University of Kansas Natural History/i, "Snow Entomological Museum, University of Kansas"],
  [/University of Michigan Museum of Zoology/i, "University of Michigan Museum of Zoology, Insect Division"],
  [/Web of Life/i, "Web of Life network database"],
  [/Robertson, C\./i, "Robertson 1929, flower visitors of Carlinville (via Miller)"],
  [/Rubinigg/i, "Rubinigg 2023, pollination dependence dataset"],
  [/Barberis/i, "Barberis et al. 2025, Mediterranean insect–flower dataset (LIFE 4 Pollinators)"],
  [/Robinson.*Ackery.*Kitching|HOSTS/i, "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM)"],
  [/Menares/i, "Menares 2025, grassland plant–Lepidoptera interaction database"],
  [/Redhead/i, "Redhead et al. 2018, plant–pollinator interactions (CEH)"],
  [/Russo, Laura/i, "Russo et al. 2022, plant–flower visitor interactions, Ireland"],
  [/Schwarz, Benjamin/i, "Schwarz et al. 2021, plant–pollinator networks"],
  [/Groom, Q\.J\./i, "Groom et al. 2020, interactions extracted from literature"],
  [/Barcode of Life|iBOL/i, "International Barcode of Life (iBOL)"],
  [/Frost Entomological Museum/i, "Frost Entomological Museum, Penn State"],
  [/ecdysis/i, "Ecdysis arthropod occurrence portal"],
  [/A\. Thessen/i, "Thessen 2014, associations text-mined from the Encyclopedia of Life"],
  [/WorldFAIR/i, "WorldFAIR pilot visitation data (Carvalheiro)"],
  // A bare iNaturalist observation is a photograph somebody identified, not a
  // study. Named as what it is so nobody mistakes it for a published record.
  [/iNaturalist\.org is a place/i, "iNaturalist observations"],
];

/** A citation a person can read in a table cell, without losing what it is. */
function shortCitation(c) {
  const text = String(c).replace(/\s+/g, " ").trim();
  for (const [pattern, name] of SOURCE_NAMES) if (pattern.test(text)) return name;
  // Unknown contributor: keep the front of it, but drop a BibTeX wrapper and
  // stop at the first sentence boundary rather than mid-author-list.
  const cleaned = text.replace(/^@\w+\{[^,]*,\s*/, "").replace(/^title=\{([^}]*)\}.*/, "$1");
  return cleaned.length > 120 ? cleaned.slice(0, 117).trimEnd() + "…" : cleaned;
}

// --------------------------------------------------------------- the regions
const loader = await openLoader();
const { REGIONS: REGIONS_RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(REGIONS_RAW);
const { WILDLIFE, SUPPORT } = await loader.load("/src/data/wildlife.ts");
await loader.close();

if (!REGION_ID && !ALL) {
  console.error("Which region? e.g. --region france-continental (or --all)\n");
  console.error("  " + REGIONS.map((r) => r.meta.id).join("\n  "));
  process.exit(1);
}
const targets = ALL ? REGIONS : REGIONS.filter((r) => r.meta.id === REGION_ID);
if (!targets.length) {
  console.error(`No region "${REGION_ID}". Known: ${REGIONS.map((r) => r.meta.id).join(", ")}`);
  process.exit(1);
}

// The catalog, indexed by the scientific name GloBI would use. Entries without a
// binomial (the informal groups — "Jays, turkeys & woodpeckers") can't be
// matched mechanically and are simply not part of track one.
const catalogByLatin = new Map();
for (const w of WILDLIFE) {
  const latin = w.latin ?? w.inat?.name;
  if (latin && BINOMIAL.test(latin)) catalogByLatin.set(latin.toLowerCase(), w);
}

const snapshot = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, "utf8")) : { regions: {} };
snapshot.source = "https://api.globalbioticinteractions.org";
snapshot.method =
  "Partners per plant from the aggregated /taxon/<plant>/<type> endpoints; citations and life " +
  "stage per animal-plant pair from /interaction with includeObservations=true. Regional presence " +
  "and native status from iNaturalist, because GloBI's records are not georeferenced.";
snapshot.regions ??= {};

await loadCountryCodes();

for (const region of targets) {
  const { id, name, bounds: box } = region.meta;
  console.log(`\n${"─".repeat(72)}\n${name} — ${region.seed.length} plants`);

  const already = SUPPORT[id] ?? {};
  const tiedIds = new Set(Object.values(already).flat().map((l) => l.wildlifeId));

  // ---- the region's places, for native status ----
  const nearby = await getJson(
    `${INAT}/places/nearby?nelat=${box.maxLat}&nelng=${box.maxLon}&swlat=${box.minLat}&swlng=${box.minLon}&per_page=20`,
    { politeMs: 700 },
  );
  const standard = nearby?.results?.standard ?? [];
  // Every state/province the box touches, not the first returned — the same
  // trap `candidates.mjs` documents: the Pacific Northwest box's first level-10
  // result is British Columbia, and reading native status for a mostly-Oregon
  // box off the wrong side of a border is a wrong answer that looks right.
  let places = standard.filter((p) => p.admin_level === 10);
  if (!places.length) places = standard.filter((p) => p.admin_level === 0);
  const placeIds = new Set(places.map((p) => p.id));
  const countryNames = standard.filter((p) => p.admin_level === 0).map((p) => p.name);
  const isoCodes = isoCodesFor(countryNames);
  console.log(`  native status read for: ${places.map((p) => p.name).join(", ") || "(no place)"}`);
  console.log(`  GBIF countries: ${[...isoCodes].join(", ") || "(none matched — the veto can't fire)"}`);

  // ---- GloBI: who interacts with each plant on the list ----
  const plants = region.seed.map((p) => ({ id: p.id, latin: p.latin, common: p.common }));
  const byAnimal = new Map();
  for (const [i, plant] of plants.entries()) {
    process.stdout.write(`\r  GloBI: ${i + 1}/${plants.length} plants …    `);
    const partners = await partnersFor(plant.latin);
    for (const entry of partners.values()) {
      if (!BINOMIAL.test(entry.name)) continue;
      // A plant is not wildlife. GloBI's `eatenBy` on a plant is animals, but
      // `hostOf` and `createsHabitatFor` bring back fungi, mistletoes and
      // lichens too, and a mildew is not what this layer is for. Kingdom is
      // settled later from iNaturalist's own classification, which is
      // authoritative; this only skips the plant's own binomial.
      if (entry.name.toLowerCase() === plant.latin.toLowerCase()) continue;
      const a = byAnimal.get(entry.name) ?? { name: entry.name, plants: [] };
      a.plants.push({ ...plant, types: [...entry.types] });
      byAnimal.set(entry.name, a);
    }
  }
  console.log(`\r  GloBI: ${plants.length} plants → ${byAnimal.size} animals named on them        `);

  // ---- rank, so the expensive checks are spent on the best candidates ----
  //
  // Two things earn a place in the shortlist, and they are different questions:
  // an animal already in the catalog needs no blurb and no icon, so one plant is
  // enough to be worth checking; a new animal has to earn a whole catalog entry,
  // so it is ranked by how much of the region's list it touches.
  const scored = [...byAnimal.values()].map((a) => {
    const known = catalogByLatin.get(a.name.toLowerCase());
    return {
      ...a,
      known,
      // A catalog animal already tied to this region is not news; a catalog
      // animal this region has never used is the cheapest win on the board.
      newToRegion: known ? !tiedIds.has(known.id) : true,
      reach: a.plants.length,
    };
  });
  const shortlist = [
    ...scored.filter((a) => a.known && a.newToRegion).sort((x, y) => y.reach - x.reach),
    ...scored.filter((a) => !a.known).sort((x, y) => y.reach - x.reach).slice(0, TOP * 3),
  ];
  console.log(
    `  shortlist: ${shortlist.filter((a) => a.known).length} already in the catalog, ` +
      `${shortlist.filter((a) => !a.known).length} new to check`,
  );

  // ---- iNaturalist: does it live here, and is it native? ----
  const checked = [];
  for (const [i, cand] of shortlist.entries()) {
    process.stdout.write(`\r  iNaturalist: ${i + 1}/${shortlist.length} …    `);
    const taxon = await inatTaxon(cand.name);
    if (!taxon) {
      checked.push({ ...cand, status: "no-inat-match", observations: 0 });
      continue;
    }
    const observations = await inatPresence(taxon.id, box);
    // Only ask GBIF about animals we might actually keep. The veto is two more
    // requests per candidate and there is no point spending them on a moth that
    // has never been seen inside the box.
    const gbif =
      observations > 0 ? await gbifEstablishment(cand.name, isoCodes, countryNames) : { verdict: "not asked" };
    const inat = establishment(taxon, placeIds);
    checked.push({
      ...cand,
      inatId: taxon.id,
      commonName: taxon.preferred_common_name ?? null,
      iconic: taxon.iconic_taxon_name ?? null,
      rank: taxon.rank,
      observations,
      inatStatus: inat,
      gbifStatus: gbif.verdict,
      // The combined answer, and it fails closed: either source calling this
      // introduced is enough to drop it, and "unknown" stays unknown rather
      // than being rounded up to native.
      status:
        inat === "introduced" || gbif.verdict === "introduced"
          ? "introduced"
          : inat === "native" || inat === "endemic" || gbif.verdict === "native"
            ? "native"
            : gbif.verdict === "unclear" || inat.includes("/")
              ? "unclear"
              : "unknown",
    });
    saveCache();
  }
  console.log(`\r  iNaturalist: ${shortlist.length} checked                    `);

  // Only animals, only ones actually seen in the box, never anything a place in
  // the region calls introduced — the catalog's `native: true` is a hard
  // invariant and the shortlist has no business proposing a candidate that
  // would break it.
  const ANIMAL_ICONIC = new Set(["Insecta", "Aves", "Mammalia", "Reptilia", "Amphibia", "Arachnida", "Mollusca"]);
  const present = checked.filter(
    (c) => ANIMAL_ICONIC.has(c.iconic) && c.observations > 0 && c.status !== "introduced",
  );
  const dropped = {
    notAnimal: checked.filter((c) => c.inatId && !ANIMAL_ICONIC.has(c.iconic)).length,
    unmatched: checked.filter((c) => c.status === "no-inat-match").length,
    absent: checked.filter((c) => ANIMAL_ICONIC.has(c.iconic) && c.observations === 0).length,
    introduced: checked.filter((c) => c.status === "introduced").map((c) => c.name),
  };
  console.log(
    `  dropped: ${dropped.notAnimal} not animals, ${dropped.unmatched} no iNat match, ` +
      `${dropped.absent} never seen in the box, ${dropped.introduced.length} introduced here`,
  );
  // Name them. A silent filter is indistinguishable from a filter that isn't
  // running, and this one is the guard on a hard invariant.
  for (const name of dropped.introduced) console.log(`    ✗ ${name}`);

  // ---- GloBI again: cite the ties we're actually going to propose ----
  const ranked = [
    ...present.filter((c) => c.known).sort((x, y) => y.reach - x.reach),
    ...present.filter((c) => !c.known).sort((x, y) => y.observations - x.observations).slice(0, TOP),
  ];
  let cited = 0;
  for (const [i, cand] of ranked.entries()) {
    process.stdout.write(`\r  citations: ${i + 1}/${ranked.length} animals …    `);
    // Cite the plants it touches, and stop at four — a proposal needs enough
    // evidence to judge, not every record GloBI holds. Uncited ties are dropped
    // here rather than carried forward: `basis` has nothing to say about them.
    cand.plants = cand.plants.slice(0, 4);
    for (const plant of cand.plants) {
      plant.evidence = await citationsFor(cand.name, plant.latin);
      if (plant.evidence?.studies?.length) cited++;
    }
    saveCache();
  }
  console.log(`\r  citations: ${ranked.length} animals, ${cited} cited plant ties        `);

  // A candidate whose every tie came back uncited is not shippable — there is
  // nothing to put in `basis`. Say how many fell out that way rather than
  // quietly shrinking the list.
  const shippable = ranked.filter((c) => c.plants.some((p) => p.evidence?.studies?.length));
  if (shippable.length < ranked.length) {
    console.log(`  ${ranked.length - shippable.length} dropped: GloBI names no study for any of their ties`);
  }

  snapshot.regions[id] = {
    region: name,
    plantsAsked: plants.length,
    animalsNamed: byAnimal.size,
    dropped,
    candidates: shippable.map((c) => ({
      latin: c.name,
      common: c.commonName,
      iconic: c.iconic,
      inatId: c.inatId,
      inCatalogAs: c.known?.id ?? null,
      observationsInBox: c.observations,
      establishment: c.status,
      establishmentPerSource: { inaturalist: c.inatStatus, gbif: c.gbifStatus },
      ties: c.plants
        .filter((p) => p.evidence?.studies?.length)
        .map((p) => ({
          plantId: p.id,
          plant: p.latin,
          interactionTypes: p.types,
          records: p.evidence.records,
          larvalEvidence: p.evidence.larval,
          lifeStages: p.evidence.lifeStages,
          // Both forms: the short name is what a report and a `basis` line use,
          // the full string is the provenance and must survive in the snapshot.
          studies: p.evidence.studies.slice(0, 3).map((s) => ({
            name: shortCitation(s.citation),
            records: s.records,
            citation: String(s.citation).replace(/\s+/g, " ").trim(),
          })),
        })),
    })),
  };

  if (WRITE) writeReport(region, shippable, dropped, byAnimal.size);
  console.log(`  → ${shippable.length} candidates (${shippable.filter((c) => c.known).length} need no new catalog entry)`);
  saveCache();
}

mkdirSync(dirname(SNAPSHOT), { recursive: true });
writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 2) + "\n");
saveCache();
console.log(`\n${"─".repeat(72)}`);
console.log(`Snapshot: data/sources/globi/wildlife-ties.json — commit it.`);
console.log(`${fetches} requests made, ${cacheHits} served from cache.\n`);

// ------------------------------------------------------------------- report
function writeReport(region, candidates, dropped, animalsNamed) {
  const { id, name } = region.meta;
  const supportFor = (types) =>
    INTERACTIONS.filter((i) => types.includes(i.type)).map((i) => i.support).join(", ") || types.join(", ");

  const lines = [];
  lines.push(`# Candidate wildlife — ${name}`);
  lines.push("");
  lines.push(
    `Generated by \`npm run wildlife -- --region ${id}\`. **A shortlist, not a decision** — every ` +
      `row here still needs a human to write the blurb, choose the icon, decide whether the tie is ` +
      `a larval host or a nectar stop, and judge the reliance. See \`app/src/data/wildlife.ts\`.`,
  );
  lines.push("");
  lines.push(
    `GloBI named **${animalsNamed.toLocaleString()}** animals on this region's ${region.seed.length} ` +
      `plants. Dropped: ${dropped.notAnimal} not animals, ${dropped.unmatched} with no iNaturalist ` +
      `match, ${dropped.absent} never recorded inside the region's box, ` +
      `${dropped.introduced.length} introduced here. What's left is below.`,
  );
  lines.push("");
  if (dropped.introduced.length) {
    lines.push(
      `Dropped as introduced, by name, so the guard on \`native: true\` is visible rather than ` +
        `assumed: ` + dropped.introduced.map((n) => `_${n}_`).join(", ") + ".",
    );
    lines.push("");
  }
  lines.push(
    `**A native status of \`unclear\` or \`unknown\` is not a green light.** iNaturalist records no ` +
      `establishment means at all for the French places, and GBIF's checklists carry stray single ` +
      `"introduced" rows for species that are plainly native — so the veto only fires on ` +
      `unambiguous evidence, and everything short of that is left here for a person to settle.`,
  );
  lines.push("");
  lines.push(
    `**Read the interaction type sceptically.** GloBI's \`eatenBy\` covers a caterpillar stripping a ` +
      `leaf, a finch taking a seed and a deer browsing a twig. Where a record carried a life stage ` +
      `saying "larva" it is called out as **larval evidence**; where it didn't, the tie is "eats it" ` +
      `and the kind of eating is a human's call.`,
  );
  lines.push("");

  const known = candidates.filter((c) => c.known);
  const fresh = candidates.filter((c) => !c.known);

  if (known.length) {
    lines.push(`## Already in the catalog — ${known.length} ties this region isn't using`);
    lines.push("");
    lines.push(`These need **no new catalog entry**: the animal is already described, iconed and sourced.`);
    lines.push("");
    for (const c of known) lines.push(...entry(c, supportFor));
  }

  if (fresh.length) {
    lines.push(`## New to the catalog — ${fresh.length} candidates`);
    lines.push("");
    lines.push(
      `Each of these would need a catalog entry written for it. Ranked by how often the animal is ` +
        `recorded inside the region's box, so the top of the list is what a gardener there might ` +
        `plausibly see.`,
    );
    lines.push("");
    for (const c of fresh) lines.push(...entry(c, supportFor));
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, `wildlife-${id}.md`), lines.join("\n") + "\n");
}

function entry(c, supportFor) {
  const out = [];
  const title = c.commonName ? `${c.commonName} (_${c.name}_)` : `_${c.name}_`;
  out.push(`### ${title}`);
  out.push("");
  const bits = [
    c.known ? `already in the catalog as \`${c.known.id}\`` : `**new** — ${c.iconic}`,
    `${c.observations.toLocaleString()} research-grade observations in the region's box`,
    `native status: **${c.status}** (iNaturalist: ${c.inatStatus}; GBIF: ${c.gbifStatus})`,
  ];
  out.push(bits.join(" · "));
  out.push("");
  out.push(`| Plant | What GloBI records | Records | Larval? | Source study |`);
  out.push(`|---|---|---|---|---|`);
  for (const p of c.plants.filter((p) => p.evidence?.studies?.length)) {
    out.push(
      `| \`${p.id}\` _${p.latin}_ | ${supportFor(p.types)} | ${p.evidence.records} | ` +
        `${p.evidence.larval ? "**yes**" : p.evidence.lifeStages.length ? p.evidence.lifeStages.join(", ") : "—"} | ` +
        `${shortCitation(p.evidence.studies[0].citation)} |`,
    );
  }
  out.push("");
  return out;
}
