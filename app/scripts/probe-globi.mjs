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
// So this script answers six questions and writes down what it found. It
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
//   Q6  **Does a record name the study it came from?** A tie in the wildlife
//       layer is a named animal and a citation; without the citation there is
//       no tie worth shipping. Asked separately from Q2 because the two have
//       different answers, and because the first run of this probe got Q6
//       wrong — see the mode trap below.
//
// **The mode trap, and the correction it forced.** `/interaction` answers in
// two modes. Its default collapses records into distinct interactions and
// **drops every per-observation column on the way** — life stage, coordinates,
// study citation all come back `null`, not because GloBI lacks them but because
// that shape has nowhere to put them. `includeObservations=true` returns the
// observations themselves, with those columns filled in. The 2026-08-06 run
// sampled only the default mode and concluded GloBI "carries no citations and
// no life stage". That was a statement about the query, not about the data, and
// it is corrected here: every question that reads a per-observation column now
// asks in **both** modes and records both numbers, so the difference is on the
// record instead of being a trap the next reader falls into too.
//
// **It needs open internet.** Run it as `npm run probe:globi`, which is the only
// form that works behind a proxy (Node's fetch ignores HTTPS_PROXY without
// NODE_USE_ENV_PROXY=1 — see `_net.mjs`), or let
// `.github/workflows/us-host-counts.yml` run it on a GitHub runner. The snapshot
// it writes to `data/sources/globi/probe.json` is committed, so what GloBI said
// on the day is reviewable in a diff.
//
// **It has been run twice.** Q2 failed both times, and the gate's verdict is
// unchanged: only about an eighth of observation records say which life stage
// was seen, so a count built on them would blend caterpillars stripping a leaf
// with adults resting on one, and `hostLepCount` stays a Tallamy-anchored
// estimate in the American regions. What the second run *did* overturn is Q6:
// in observation mode **every** record names its source study. That is the
// whole deliverable for the wildlife-ties layer — a named animal and a citation
// — so GloBI now feeds `app/scripts/wildlife-candidates.mjs`. The verdicts are
// written up in `docs/us-host-counts-plan.md` §2 and
// `data/sources/globi/README.md` §2.
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

// GloBI is a volunteer-run service and some of these queries are heavy — the
// citation joins in particular. 45 s is plenty for the taxonomy questions and
// not nearly enough for those, so the timeout is per call rather than global.
async function get(path, { asText = false, timeoutMs = 45000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
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
//
// Sampled in *both* modes. The default collapses records to distinct
// interactions and blanks every per-observation column on the way; only
// `includeObservations=true` returns the observations themselves. Measuring one
// and reporting it as "what a record carries" is the mistake the header
// describes, so the probe no longer offers itself the chance to make it.
heading("Q3", "What does a record actually carry? (sampled in both modes)");

const SAMPLE_QUERY =
  "/interaction?sourceTaxon=Lepidoptera&targetTaxon=Plantae&interactionType=eats&type=json&limit=200";

/** Share of sampled rows whose column matching `pattern` is non-empty. */
const filled = (sampleRows, pattern) =>
  sampleRows.filter((x) =>
    Object.entries(x).some(([k, v]) => pattern.test(k) && v !== null && String(v).trim() !== ""),
  ).length;

// The default response's only study column is `study_title`, and it is always
// null; the citation lives in columns GloBI serves on request. So the citation
// question needs its own, explicitly-fielded request — which is itself part of
// the answer, since in aggregated mode that request does not come back at all.
const CITATION_FIELDS =
  "&field=source_taxon_name&field=interaction_type&field=study_citation&field=study_source_citation";

/** Sample one mode and measure how full its interesting columns come back. */
async function sampleMode(observations) {
  const suffix = observations ? "&includeObservations=true" : "";
  const payload = await get(SAMPLE_QUERY + suffix);
  const cols = payload?.columns ?? [];
  const r = rows(payload);
  const out = {
    mode: observations ? "includeObservations=true" : "default (aggregated)",
    columns: cols,
    sampled: r.length,
    withLifeStage: filled(r, /life_?stage/i),
    withCoordinates: filled(r, /^latitude$/i),
    rows: r,
  };
  try {
    const cited = rows(await get(SAMPLE_QUERY + suffix + CITATION_FIELDS, { timeoutMs: 120000 }));
    out.citationSampled = cited.length;
    out.withCitation = filled(cited, /citation/i);
  } catch (e) {
    // Not a fluke and worth recording: asked for citations in aggregated mode,
    // GloBI's own query times out server-side (HTTP 500, read timed out). The
    // column it would fill has no row to belong to.
    out.citationError = String(e);
  }
  return out;
}

const modes = [];
for (const observations of [false, true]) {
  try {
    const m = await sampleMode(observations);
    modes.push(m);
    console.log(`  ${m.mode}`);
    console.log(`    columns: ${m.columns.length}`);
    console.log(`    life stage:  ${m.withLifeStage}/${m.sampled}`);
    console.log(`    coordinates: ${m.withCoordinates}/${m.sampled}`);
    console.log(
      `    citation:    ${
        m.citationError ? `unanswerable — ${m.citationError}` : `${m.withCitation}/${m.citationSampled}`
      }`,
    );
    await sleep(1000);
  } catch (e) {
    modes.push({ mode: observations ? "includeObservations=true" : "default (aggregated)", error: String(e) });
    console.error(`  failed — ${e}`);
  }
}
// Everything downstream reads the observation mode, because it is the only one
// that answers the question. The aggregated numbers stay in the snapshot as the
// evidence for why the earlier verdict said what it said.
const obs = modes.find((m) => m.mode.startsWith("includeObservations")) ?? modes[0] ?? {};
const columns = obs.columns ?? [];
const sample = obs.rows ?? [];
findings.questions.q3 = {
  note:
    "Sampled in both modes. The default response blanks every per-observation column; " +
    "includeObservations=true fills them in. The 2026-08-06 run measured only the default " +
    "and mistook its blanks for missing data.",
  modes: modes.map(({ rows: _rows, ...rest }) => rest),
  sampleRow: sample[0] ?? null,
};

// A life-stage column is the difference between a usable source and an
// unusable one, so find it by pattern rather than by guessing its exact name.
const lifeStageCols = columns.filter((c) => /life_?stage/i.test(String(c)));
const localityCols = columns.filter((c) => /lat|lon|locality|country/i.test(String(c)));
const citationCols = columns.filter((c) => /citation|study|source_?doi/i.test(String(c)));

// ---- Q2: THE GATE ----------------------------------------------------------
heading("Q2", "Can a larval host be told apart from an adult nectaring? (the gate)");
const q2 = { lifeStageColumns: lifeStageCols, mode: obs.mode ?? "unknown", verdict: "unknown" };
if (!sample.length) {
  q2.verdict = "unknown — no sample came back";
  console.error("  no sample to measure");
} else {
  const withStage = sample.filter((x) =>
    Object.entries(x).some(([k, v]) => /life_?stage/i.test(k) && v && String(v).trim()),
  );
  q2.sampled = sample.length;
  q2.withLifeStage = withStage.length;
  q2.exampleStages = [
    ...new Set(
      sample.flatMap((x) =>
        Object.entries(x)
          .filter(([k, v]) => /life_?stage/i.test(k) && v)
          .map(([, v]) => String(v)),
      ),
    ),
  ].slice(0, 20);
  console.log(`  measured in ${q2.mode} — the only mode that carries the column`);
  console.log(`  ${withStage.length} of ${sample.length} sampled records carry a life stage`);
  console.log(`  stages seen: ${q2.exampleStages.join(", ") || "(none)"}`);
  // A source that labels the life stage on a small minority of records cannot
  // support a count that claims "caterpillars". Better to fail this loudly.
  q2.verdict =
    withStage.length / Math.max(1, sample.length) >= 0.5
      ? "usable — most records say which life stage"
      : "NOT usable as-is — life stage is missing from most records";
}
console.log(`\n  VERDICT: ${q2.verdict}`);
console.log("  If this reads NOT usable, GloBI cannot source hostLepCount on its own.");
console.log("  The fallback named in the gap doc is the Tallamy primary literature.");
console.log("  Note this is a narrower failure than the first run reported: the stages");
console.log("  are there, on a minority of records. Too few to count with, and enough");
console.log("  to *corroborate* a named tie, which is what Q6 is about.");
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
    // `bbox=minLon,minLat,maxLon,maxLat` is the filter GloBI supports. The
    // first version of this probe sent `lat`/`lng`, which is not a filter at
    // all: the API answers 200 with an empty body, and the run reported that as
    // "SyntaxError: Unexpected end of JSON input" — an API shape mistake
    // wearing an outage's clothes.
    const payload = await get(
      "/interaction?sourceTaxon=Lepidoptera&targetTaxon=Quercus&interactionType=eats&type=json&limit=5000" +
        `&field=source_taxon_name&field=target_taxon_name&field=latitude` +
        `&bbox=${box.minLon},${box.minLat},${box.maxLon},${box.maxLat}`,
    );
    const inBox = rows(payload).length;
    // The count above can only be as good as the coordinates behind it, so ask
    // separately what share of unfiltered records carry any at all. If that is
    // zero, an empty box is not "no oak-feeders in Oregon" — it is "GloBI does
    // not know where any of these records happened", which is a different and
    // much more important answer.
    // In observation mode, for the same reason Q2 and Q6 are: the aggregated
    // response has no row to hang a coordinate on, so asking it would measure
    // the response shape rather than GloBI's georeferencing.
    const anywhere = rows(
      await get(
        "/interaction?sourceTaxon=Lepidoptera&targetTaxon=Quercus&interactionType=eats&type=json&limit=500" +
          "&includeObservations=true&field=source_taxon_name&field=latitude",
      ),
    );
    // `rows()` returns objects keyed by column name, not positional arrays —
    // reading `r[1]` here counted every row as geolocated and made the first
    // fixed version of this probe report 500/500 for a field that is empty.
    const geolocated = anywhere.filter(
      (r) => r.latitude !== null && r.latitude !== undefined && r.latitude !== "",
    ).length;
    q5.boxes.push({ ...box, records: inBox, sampled: anywhere.length, geolocated });
    console.log(
      `  ${box.label.padEnd(38)} ${inBox} records in box` +
        ` — ${geolocated}/${anywhere.length} of an unfiltered sample carry coordinates`,
    );
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
console.log("  Read the two numbers together: bbox does filter (the boxes differ), but");
console.log("  what survives it is a sliver, and no surviving record will tell you where");
console.log("  it was. A regional count from that measures study bookkeeping, not oaks.");
findings.questions.q5 = q5;

// ---- Q6: does a record name the study it came from? ------------------------
//
// The wildlife-ties layer asks less of a source than `hostLepCount` does. It
// wants no number at all: a named animal, a named plant, and a citation a
// reader can follow. Q2 can fail and this can still pass, and that is exactly
// what happened — so ask it separately, on a plant we actually ship, and look
// at the citations rather than only counting them.
heading("Q6", "Does a record name the study it came from? (the wildlife-ties gate)");
const q6 = { verdict: "unknown", plantsProbed: [] };
{
  for (const plant of ["Asclepias tuberosa", "Quercus alba", "Salix caprea"]) {
    // One plant failing must not take the question with it. A citation join
    // over a genus as heavily recorded as oak times out *inside GloBI* and
    // comes back 500 — a real constraint on how a builder may query, and the
    // reason `wildlife-candidates.mjs` reads the cheap aggregated list first
    // and only asks for citations one animal–plant pair at a time.
    let r;
    try {
      r = rows(
        await get(
          `/interaction?targetTaxon=${encodeURIComponent(plant)}&sourceTaxon=Animalia` +
            "&interactionType=eats&type=json&limit=100&includeObservations=true" +
            "&field=source_taxon_name&field=interaction_type&field=study_citation&field=study_source_citation",
          { timeoutMs: 120000 },
        ),
      );
    } catch (e) {
      q6.plantsProbed.push({ plant, error: String(e) });
      console.log(`  ${plant.padEnd(20)} query failed — ${String(e).slice(0, 60)}…`);
      await sleep(1000);
      continue;
    }
    const cited = r.filter((x) => x.study_citation && String(x.study_citation).trim());
    const sourceCited = r.filter((x) => x.study_source_citation && String(x.study_source_citation).trim());
    const distinct = [...new Set(sourceCited.map((x) => String(x.study_source_citation)))];
    q6.plantsProbed.push({
      plant,
      sampled: r.length,
      withStudyCitation: cited.length,
      withSourceCitation: sourceCited.length,
      distinctSources: distinct.length,
      exampleSources: distinct.slice(0, 5).map((s) => s.slice(0, 160)),
    });
    console.log(
      `  ${plant.padEnd(20)} ${cited.length}/${r.length} cited` +
        ` — ${distinct.length} distinct source datasets`,
    );
    await sleep(1000);
  }
  const sampled = q6.plantsProbed.reduce((n, p) => n + (p.sampled ?? 0), 0);
  const cited = q6.plantsProbed.reduce((n, p) => n + (p.withStudyCitation ?? 0), 0);
  // A tie we cannot cite is a tie we cannot ship, so the bar here is high: a
  // clear majority of records must name their study, or the layer goes back to
  // being hand-authored from the primary literature.
  const answered = q6.plantsProbed.filter((p) => !p.error);
  q6.sampled = sampled;
  q6.cited = cited;
  q6.plantsAnswering = `${answered.length}/${q6.plantsProbed.length}`;
  // Say what the verdict rests on. "Every record names its study" reads very
  // differently when it is one plant's records than when it is three, and the
  // plants that time out are exactly the heavily-recorded ones.
  const breadth = ` (over ${q6.plantsAnswering} plants asked; the rest timed out server-side)`;
  q6.verdict = !sampled
    ? "unknown — no plant's citation query came back"
    : cited / sampled >= 0.9
      ? `PASSES — effectively every record names its source study${breadth}`
      : cited / sampled >= 0.5
        ? `partial — most records are citable, some are not${breadth}`
        : `fails — too few records name a source to ship a cited tie${breadth}`;
  console.log(`\n  VERDICT: ${q6.verdict}`);
  console.log("  This is the question the 2026-08-06 run answered wrongly, by asking it");
  console.log("  in the aggregated mode where the column cannot be populated. Passing it");
  console.log("  is what lets `wildlife-candidates.mjs` propose a tie with a citation.");
  const failed = q6.plantsProbed.filter((p) => p.error);
  if (failed.length) {
    console.log(
      `  ${failed.length} of ${q6.plantsProbed.length} plants could not be asked at all —` +
        " the citation join times out on heavily-recorded genera. A builder has to",
    );
    console.log("  read the cheap aggregated list first and cite one pair at a time.");
  }
}
findings.questions.q6 = q6;

// ---- Write the snapshot ----------------------------------------------------
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(findings, null, 2) + "\n");
console.log(`\n${"─".repeat(70)}`);
console.log(`Snapshot written to data/sources/globi/probe.json — commit it.`);
console.log(`Then update docs/us-host-counts-plan.md §2 with the verdict. Q2 gates the`);
console.log(`host-count builder; Q6 gates the wildlife-ties finder, and they can differ.\n`);
