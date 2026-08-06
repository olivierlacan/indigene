// Probe GloBI (Global Biotic Interactions) to find out whether it can give the
// United States what the Gaytán matrix gave Europe: a citable, machine-readable
// count of the Lepidoptera species that raise their caterpillars on a plant.
//
//   node app/scripts/probe-globi.mjs            # everything
//   node app/scripts/probe-globi.mjs --quick    # skip the calibration pass
//
// **Why a probe and not a builder.** `docs/coverage-gap-pnw-france-atlantic.md`
// §5 named the one structural hole the coverage audit exposed: we can rank
// Europe's next twenty plants mechanically and we cannot do the same for the
// US, so every American candidate is judgment. GloBI is the most promising
// replacement — CC-BY, one machine-readable interaction dump, far broader than
// Lepidoptera. But `docs/host-counts-plan.md` §4.3 set a rule when the European
// counts landed, and it is the right rule: **verify the source records the
// claim you intend to make, before designing anything around it.** For
// `hostLepCount` that claim is "caterpillars eat this leaf", which is much
// stronger than "an adult was seen on this flower".
//
// So this script answers five questions and writes down what it found. It
// builds nothing and changes no shipped number.
//
//   Q1  Is GloBI reachable, and what does it call its interaction types?
//   Q2  **Can a larval host be told apart from an adult nectaring?** This is
//       the gate. If the answer is no, GloBI cannot source `hostLepCount` and
//       the honest outcome is to say so and go back to the Tallamy primary
//       literature. Everything else is moot.
//   Q3  What fields does a record actually carry — life stage, locality,
//       citation? (Asked by *sampling*, never assumed: this script cannot be
//       run in the build sandbox, so it must not hard-code a field name it
//       has not seen.)
//   Q4  Calibration. For genera where we already know the answer — Gaytán's
//       European counts, which are committed — does the same counting method
//       land in the same neighbourhood? A method that says Quercus hosts nine
//       species is broken, and better to learn that here than in a data file.
//   Q5  Can records be filtered to a region, so a Pacific Northwest count
//       means the Pacific Northwest rather than all of North America?
//
// **It needs open internet, which the build sandbox does not have** — the agent
// egress answers 403 to api.globalbioticinteractions.org. Same arrangement as
// `check-vernacular.mjs`, `check-lookalikes.mjs` and `reconcile.mjs`: run it
// locally, or let `.github/workflows/us-host-counts.yml` run it on a GitHub
// runner. The snapshot it writes to `data/sources/globi/probe.json` is
// committed, so what GloBI said on the day is reviewable in a diff.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("probe:globi");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "globi");
const OUT_FILE = join(OUT_DIR, "probe.json");
const EU_COUNTS = join(REPO_ROOT, "data", "sources", "eu-lep-plant-matrix", "host-counts.json");

const BASE = "https://api.globalbioticinteractions.org";
const UA = "Mozilla/5.0 (indigene host-count probe; +https://github.com/olivierlacan/indigene)";
const QUICK = process.argv.includes("--quick");

// Genera to calibrate on. The European column of the answer is already on disk
// (Gaytán, committed), so these double as a sanity check on the method: if
// GloBI's ranking of these disagrees wildly with a peer-reviewed matrix's, the
// query is wrong, not the matrix.
const CALIBRATION = ["Quercus", "Salix", "Populus", "Prunus", "Betula", "Vaccinium", "Rubus", "Acer"];

// Boxes to test Q5 with. Deliberately the two US regions we ship, so a positive
// answer is immediately usable.
const BOXES = [
  { id: "pnw", label: "Pacific NW (west of the Cascades)", minLat: 42.0, maxLat: 49.0, minLon: -124.9, maxLon: -120.5 },
  { id: "mid-atlantic", label: "Mid-Atlantic / Northeast Piedmont", minLat: 38.0, maxLat: 42.0, minLon: -80.5, maxLon: -74.0 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const findings = { probedFrom: BASE, questions: {} };

async function get(path, { asText = false } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch(`${BASE}${path}`, { headers: { "User-Agent": UA }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    return asText ? await res.text() : await res.json();
  } finally {
    clearTimeout(t);
  }
}

// GloBI's /interaction endpoint answers with { columns: [...], data: [[...]] }.
// Turn that into objects without assuming which columns came back — the whole
// point of Q3 is that we do not know yet.
const rows = (payload) => {
  const cols = payload?.columns ?? [];
  return (payload?.data ?? []).map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
};

const heading = (q, text) => console.log(`\n${"─".repeat(70)}\n${q}. ${text}\n`);

// ---- Q1: reachable, and what are the interaction types called? -------------
heading("Q1", "Is GloBI reachable, and what are its interaction types?");
let types = [];
try {
  const payload = await get("/interactionTypes");
  // The shape here has moved between GloBI versions, so read it defensively:
  // either a bare list of names or an object keyed by name.
  types = Array.isArray(payload) ? payload : Object.keys(payload ?? {});
  findings.questions.q1 = { reachable: true, interactionTypeCount: types.length, interactionTypes: types };
  console.log(`  reachable — ${types.length} interaction types`);
  // The ones that could plausibly carry "this caterpillar eats this leaf".
  const relevant = types.filter((t) => /eat|host|herbivor|pollinat|visit|interactsWith/i.test(String(t)));
  console.log(`  candidates for a larval-host claim: ${relevant.join(", ") || "(none matched)"}`);
  findings.questions.q1.candidateTypes = relevant;
} catch (e) {
  findings.questions.q1 = { reachable: false, error: String(e) };
  console.error(`  UNREACHABLE — ${e}`);
  console.error("  Everything below depends on this. Stopping.");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(findings, null, 2) + "\n");
  process.exit(1);
}

// ---- Q3 before Q2, because Q2 needs to know the field names ----------------
heading("Q3", "What does a record actually carry? (sampled, not assumed)");
let columns = [];
let sample = [];
try {
  // No `fields` parameter on purpose: ask GloBI for its own default columns
  // rather than naming ones this script has never seen answered.
  const payload = await get(
    "/interaction?sourceTaxon=Lepidoptera&targetTaxon=Plantae&interactionType=eats&type=json&limit=25",
  );
  columns = payload?.columns ?? [];
  sample = rows(payload);
  console.log(`  columns (${columns.length}): ${columns.join(", ")}`);
  console.log(`  sample rows: ${sample.length}`);
  if (sample[0]) console.log(`  first row: ${JSON.stringify(sample[0])}`);
  findings.questions.q3 = { columns, sampleRow: sample[0] ?? null, sampleSize: sample.length };
} catch (e) {
  findings.questions.q3 = { error: String(e) };
  console.error(`  failed — ${e}`);
}

// A life-stage column is the difference between a usable source and an
// unusable one, so find it by pattern rather than by guessing its exact name.
const lifeStageCols = columns.filter((c) => /life_?stage/i.test(String(c)));
const localityCols = columns.filter((c) => /lat|lon|locality|country/i.test(String(c)));
const citationCols = columns.filter((c) => /citation|study|source_?doi/i.test(String(c)));

// ---- Q2: THE GATE ----------------------------------------------------------
heading("Q2", "Can a larval host be told apart from an adult nectaring? (the gate)");
const q2 = { lifeStageColumns: lifeStageCols, verdict: "unknown" };
if (!lifeStageCols.length) {
  console.log("  No life-stage column in the default response.");
  console.log("  Retrying with life-stage fields requested explicitly …");
  try {
    // GloBI accepts repeated `field` parameters; ask for the documented
    // life-stage fields and see whether they come back populated.
    const payload = await get(
      "/interaction?sourceTaxon=Lepidoptera&targetTaxon=Plantae&interactionType=eats&type=json&limit=200" +
        "&field=source_taxon_name&field=interaction_type&field=target_taxon_name" +
        "&field=source_specimen_life_stage&field=target_specimen_life_stage&field=study_citation",
    );
    const r = rows(payload);
    const withStage = r.filter((x) =>
      Object.entries(x).some(([k, v]) => /life_?stage/i.test(k) && v && String(v).trim()),
    );
    q2.explicitFieldsAccepted = (payload?.columns ?? []).some((c) => /life_?stage/i.test(String(c)));
    q2.sampled = r.length;
    q2.withLifeStage = withStage.length;
    q2.exampleStages = [
      ...new Set(
        r.flatMap((x) =>
          Object.entries(x)
            .filter(([k, v]) => /life_?stage/i.test(k) && v)
            .map(([, v]) => String(v)),
        ),
      ),
    ].slice(0, 20);
    console.log(`  explicit life-stage fields accepted: ${q2.explicitFieldsAccepted}`);
    console.log(`  ${withStage.length} of ${r.length} sampled records carry a life stage`);
    console.log(`  stages seen: ${q2.exampleStages.join(", ") || "(none)"}`);
    // A source that labels the life stage on a small minority of records cannot
    // support a count that claims "caterpillars". Better to fail this loudly.
    q2.verdict =
      withStage.length / Math.max(1, r.length) >= 0.5
        ? "usable — most records say which life stage"
        : "NOT usable as-is — life stage is missing from most records";
  } catch (e) {
    q2.error = String(e);
    console.error(`  failed — ${e}`);
  }
} else {
  console.log(`  life-stage columns present by default: ${lifeStageCols.join(", ")}`);
  const withStage = sample.filter((x) => lifeStageCols.some((c) => x[c] && String(x[c]).trim()));
  q2.sampled = sample.length;
  q2.withLifeStage = withStage.length;
  q2.verdict = withStage.length ? "present — measure coverage at scale next" : "column exists but is empty in the sample";
  console.log(`  ${withStage.length} of ${sample.length} sampled records carry one`);
}
console.log(`\n  VERDICT: ${q2.verdict}`);
console.log("  If this reads NOT usable, GloBI cannot source hostLepCount on its own.");
console.log("  The fallback named in the gap doc is the Tallamy primary literature.");
findings.questions.q2 = q2;

// ---- Q4: calibration against the counts we already trust -------------------
if (!QUICK) {
  heading("Q4", "Does the counting method reproduce numbers we already trust?");
  let eu = null;
  try {
    eu = JSON.parse(readFileSync(EU_COUNTS, "utf8"));
  } catch {
    console.log("  (European counts not readable — showing GloBI's figures alone)");
  }
  const calib = [];
  console.log(`  ${"genus".padEnd(12)}${"GloBI".padStart(8)}${"Gaytán/oceanic".padStart(16)}`);
  for (const genus of CALIBRATION) {
    try {
      // Count *distinct* Lepidoptera species recorded eating the genus — the
      // same definition build-host-counts.mjs uses, so the two are comparable.
      const payload = await get(
        `/interaction?sourceTaxon=Lepidoptera&targetTaxon=${encodeURIComponent(genus)}` +
          "&interactionType=eats&type=json&limit=10000&field=source_taxon_name",
      );
      const names = new Set(
        rows(payload)
          .map((r) => Object.values(r)[0])
          .filter(Boolean)
          .map((n) => String(n).trim())
          // Species only: a record identified to genus or family is not a species.
          .filter((n) => /\s/.test(n)),
      );
      const gaytan = eu?.genera?.[genus]?.zones?.["Oceanic temperate"]?.count ?? null;
      calib.push({ genus, globi: names.size, gaytanOceanic: gaytan });
      console.log(
        `  ${genus.padEnd(12)}${String(names.size).padStart(8)}${String(gaytan ?? "—").padStart(16)}`,
      );
      await sleep(1000); // be a good citizen; GloBI is a volunteer-run service
    } catch (e) {
      calib.push({ genus, error: String(e) });
      console.error(`  ${genus.padEnd(12)}  failed — ${e}`);
    }
  }
  findings.questions.q4 = { method: "distinct binomial Lepidoptera source taxa, interactionType=eats", calibration: calib };
  console.log("\n  Read the two columns as neighbours, not equals: GloBI is worldwide and");
  console.log("  Gaytán's column is one European zone, so GloBI should be the larger of");
  console.log("  the two. An order of magnitude either way means the query is wrong.");
}

// ---- Q5: can it be cut to a region? ----------------------------------------
heading("Q5", "Can records be filtered to a region?");
const q5 = { localityColumns: localityCols, citationColumns: citationCols, boxes: [] };
for (const box of BOXES) {
  try {
    const payload = await get(
      "/interaction?sourceTaxon=Lepidoptera&targetTaxon=Quercus&interactionType=eats&type=json&limit=5000" +
        `&field=source_taxon_name&field=target_taxon_name` +
        `&lat=${(box.minLat + box.maxLat) / 2}&lng=${(box.minLon + box.maxLon) / 2}`,
    );
    const n = rows(payload).length;
    q5.boxes.push({ ...box, records: n });
    console.log(`  ${box.label.padEnd(38)} ${n} Quercus records near centre`);
    await sleep(1000);
  } catch (e) {
    q5.boxes.push({ ...box, error: String(e) });
    console.error(`  ${box.label.padEnd(38)} failed — ${e}`);
  }
}
console.log(`\n  locality columns available: ${localityCols.join(", ") || "(none seen)"}`);
console.log(`  citation columns available: ${citationCols.join(", ") || "(none seen)"}`);
console.log("  A count with no locality is a continental count. The gap doc's honesty");
console.log("  stance means a PNW figure has to mean the PNW, or say that it doesn't.");
findings.questions.q5 = q5;

// ---- Write the snapshot ----------------------------------------------------
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(findings, null, 2) + "\n");
console.log(`\n${"─".repeat(70)}`);
console.log(`Snapshot written to data/sources/globi/probe.json — commit it.`);
console.log(`Then update docs/us-host-counts-plan.md §2 with the verdict, and only`);
console.log(`design the builder if Q2 passed.\n`);
