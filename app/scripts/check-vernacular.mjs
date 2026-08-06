// Verify (and gap-fill) the localized vernacular names in
// `app/src/locales/taxa.<lang>.ts` against the reference lists they claim to
// come from.
//
//   node app/scripts/check-vernacular.mjs                 # verify everything
//   node app/scripts/check-vernacular.mjs --lang fr       # one language
//   node app/scripts/check-vernacular.mjs --missing       # only report gaps
//   node app/scripts/check-vernacular.mjs --name "Quercus robur"
//   node app/scripts/check-vernacular.mjs --json          # machine-readable
//
// **Why this exists.** A plant's name in another language is not a translation —
// it's a lookup in that country's own reference list. The table is hand-seeded
// from those lists (they're the sort of reference a botanist reads, not an API
// you can page through cheaply), and this script is what keeps the claim
// honest: it re-asks each authority and reports every row the source doesn't
// confirm, plus every taxon that has a name upstream but no row here.
//
// **A list belongs to a country, so this checks against a *locale*, not a
// language.** The French edition is `fr-FR` (see `LOCALE` in `lib/i18n.ts`), so
// the lists below are France's. VASCAN, the Canadian one, used to be in here
// and no longer is: its noms français normalisés are Québec's — "gadellier
// sanguin" where a French nursery says "groseillier sanguin" — and checking an
// fr-FR table against them reported our correct names as errors while blessing
// the Québécois ones. It is the right authority for an fr-CA edition and the
// wrong one for this edition, and half-trusting it was worse than either.
//
// **It needs open internet, which the build sandbox does not have** — TAXREF,
// Tela Botanica and Wikidata all refuse the agent egress. Same situation as
// `reconcile.mjs`: run it locally, or let `.github/workflows/vernacular.yml`
// run it on a GitHub runner and open a PR with the result. The snapshot it
// writes to `data/sources/vernacular-names/` is committed, so upstream drift
// shows up in a diff instead of going unnoticed.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("names:check");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "vernacular-names");

const UA =
  "IndigeneVernacularCheck/0.2 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

const TAXREF_SEARCH = "https://taxref.mnhn.fr/api/taxa/search";
const TAXREF_TAXON = "https://taxref.mnhn.fr/api/taxa";
const TELA_EFLORE = "https://api.tela-botanica.org/service:eflore:0.1";
const WIKIDATA_SPARQL = "https://query.wikidata.org/sparql";

/** Politeness between taxa. Three national services, a few hundred taxa, four
 *  times a year: there is no reason to hit them as fast as the socket allows,
 *  and a burst is the likeliest explanation for a service going quiet mid-run. */
const PAUSE_MS = 120;

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const lang = flag("--lang") ?? "fr";
const onlyName = flag("--name");
const missingOnly = args.includes("--missing");
const asJson = args.includes("--json");

const loader = await openLoader();

/** The table under test, plus every taxon the app can display. */
const table = (await loader.load(`/src/locales/taxa.${lang}.ts`))[`TAXA_${lang.toUpperCase()}`];
const { REGIONS } = await loader.load("/src/data/regions.ts");
const { WILDLIFE } = await loader.load("/src/data/wildlife.ts");
const { LOOKALIKES } = await loader.load("/src/data/lookalikes.ts");

/** Every scientific name the app shows, deduped — plants, animals, impostors.
 *  The look-alikes count: they are named on a plant's page exactly as the plant
 *  is, so a French reader is owed the same "looked up, never invented" name. */
function allTaxa() {
  const seen = new Map();
  for (const r of REGIONS) {
    for (const p of r.seed) {
      if (!seen.has(p.latin)) seen.set(p.latin, { latin: p.latin, kind: "plant", common: p.common });
    }
  }
  for (const w of WILDLIFE ?? []) {
    const key = w.latin ?? `#${w.id}`;
    if (!seen.has(key)) seen.set(key, { latin: key, kind: "animal", common: w.common });
  }
  for (const l of LOOKALIKES ?? []) {
    if (!seen.has(l.latin)) seen.set(l.latin, { latin: l.latin, kind: "lookalike", common: l.common });
  }
  return [...seen.values()].filter((t) => !onlyName || t.latin === onlyName);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Every HTTP round-trip a source made, so a list that has gone quiet says so
 *  out loud. The previous version of this script couldn't tell "the référentiel
 *  has no name for this" from "the référentiel refused all 258 requests", and
 *  reported a whole silent authority as 106 taxa nobody had named. */
const health = {};
function noteStatus(src, status) {
  const h = (health[src] ??= { requests: 0, answered: 0, empty: 0, statuses: {} });
  h.requests++;
  const key = status === 0 ? "network-error" : String(status);
  h.statuses[key] = (h.statuses[key] ?? 0) + 1;
}

/** Fetch JSON, reporting the status rather than swallowing it. Retries once on
 *  the two failures that are about *us* rather than the data: a rate limit and
 *  a server hiccup. */
async function getJson(src, url, headers = {}, attempt = 0) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, ...headers },
      signal: ctrl.signal,
    });
    noteStatus(src, res.status);
    if (res.status === 429 || res.status >= 500) {
      if (attempt < 2) {
        clearTimeout(timer);
        await sleep(1000 * (attempt + 1));
        return getJson(src, url, headers, attempt + 1);
      }
    }
    if (!res.ok) return null;
    return await res.json();
  } catch {
    noteStatus(src, 0);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * TAXREF: the French national reference, and the authority for anything that
 * grows or flies in France or its overseas territories.
 *
 * It is a Spring HATEOAS service and answers in `application/hal+json` — asking
 * for plain `application/json` is how you get a wall of 406s that look exactly
 * like "no name for this taxon" (which is what happened: one whole quarterly
 * run, 258 lookups, not a single answer). Ask for what it serves.
 */
async function fromTaxref(latin) {
  const accept = { Accept: "application/hal+json, application/json;q=0.9, */*;q=0.8" };
  const url = `${TAXREF_SEARCH}?scientificNames=${encodeURIComponent(latin)}&page=1&size=1`;
  const data = await getJson("taxref", url, accept);
  const hit = data?._embedded?.taxa?.[0];
  if (!hit) return null;

  // The search projection doesn't always carry the vernacular names; the taxon
  // record does. One extra request, only for the taxa that need it.
  let name = hit.frenchVernacularName;
  if (!name && hit.id != null) {
    const full = await getJson("taxref", `${TAXREF_TAXON}/${encodeURIComponent(hit.id)}`, accept);
    name = full?.frenchVernacularName;
  }
  // TAXREF returns several names separated by commas; the first is the one the
  // référentiel leads with, which is what a field guide prints.
  return name ? String(name).split(",")[0].trim() : null;
}

/**
 * Tela Botanica — BDTFX plus the *noms vernaculaires* project (NVJFL): the
 * names French botanists actually use, for the flora of metropolitan France.
 * Declared as our cross-check since the beginning and never actually wired up;
 * with VASCAN gone it is the second French opinion TAXREF deserves.
 *
 * Two steps, because the name index is keyed on the taxonomic number rather
 * than on the scientific name: BDTFX resolves the name to a `num_taxonomique`,
 * NVJFL turns that into vernacular names. `num_statut` 1 is the retained name.
 */
async function fromBdtfx(latin) {
  const accept = { Accept: "application/json" };
  const nameUrl =
    `${TELA_EFLORE}/bdtfx/noms?masque.nom_sci=${encodeURIComponent(latin)}` +
    `&recherche=stricte&retour.champs=num_taxonomique&navigation.limite=5`;
  const found = await getJson("bdtfx", nameUrl, accept);
  const nt = Object.values(found?.resultat ?? {})
    .map((r) => r?.num_taxonomique ?? r?.["num_taxonomique"])
    .find(Boolean);
  if (!nt) return null;

  const vernUrl =
    `${TELA_EFLORE}/nvjfl/noms-vernaculaires?masque.nt=${encodeURIComponent(nt)}` +
    `&retour.champs=num_statut,conseil_emploi&navigation.limite=30`;
  const verns = await getJson("bdtfx", vernUrl, accept);
  const rows = Object.values(verns?.resultat ?? {}).filter(Boolean);
  const pick =
    rows.find((r) => String(r.num_statut ?? "") === "1" && r.nom_vernaculaire) ??
    rows.find((r) => r.nom_vernaculaire);
  return pick?.nom_vernaculaire ? String(pick.nom_vernaculaire).trim() : null;
}

/** Wikidata: the `fr` label and P1843 (taxon common name), as a last resort. */
async function fromWikidata(latin) {
  const query = `
    SELECT ?label ?common WHERE {
      ?item wdt:P225 "${latin.replace(/"/g, "")}" .
      OPTIONAL { ?item rdfs:label ?label . FILTER(LANG(?label) = "fr") }
      OPTIONAL { ?item wdt:P1843 ?common . FILTER(LANG(?common) = "fr") }
    } LIMIT 1`;
  const url = `${WIKIDATA_SPARQL}?format=json&query=${encodeURIComponent(query)}`;
  const data = await getJson("wikidata", url, { Accept: "application/sparql-results+json" });
  const row = data?.results?.bindings?.[0];
  const hit = row?.common?.value ?? row?.label?.value ?? null;
  // A `fr` label that *is* the binomial is Wikidata saying "nobody has named
  // this in French", not a French name. Taking it at face value turned five
  // perfectly good Antillean names into "disagreements" last run.
  return hit && !same(hit, latin) ? hit : null;
}

/**
 * The lists a locale may be checked against, in the order a name is trusted.
 * This is the locale rule in one place: to add fr-CA one day is to add a row
 * here whose lookups are VASCAN's, not to loosen this one.
 */
const LOCALES = {
  fr: {
    tag: "fr-FR",
    lookups: { taxref: fromTaxref, bdtfx: fromBdtfx, wikidata: fromWikidata },
  },
};

const locale = LOCALES[lang];
if (!locale) {
  console.error(
    `No reference lists are declared for "${lang}". A locale is a list of ` +
    `authorities, not a language code — see LOCALES in this file.`
  );
  await loader.close();
  process.exit(2);
}
const LOOKUPS = locale.lookups;
/** The first authority is the national one; the rest are corroboration. Silence
 *  from the first is a broken check, silence from the others is a warning. */
const PRIMARY = Object.keys(LOOKUPS)[0];
for (const src of Object.keys(LOOKUPS)) {
  health[src] ??= { requests: 0, answered: 0, empty: 0, statuses: {} };
}

/** Loose comparison: accents, case, hyphens and articles shouldn't count as a
 *  mismatch — "Chêne pédonculé" and "chene pedoncule" are the same name. */
function same(a, b) {
  const norm = (s) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[-'’]/g, " ").replace(/\s+/g, " ").trim();
  return norm(a) === norm(b);
}

const report = {
  lang,
  locale: locale.tag,
  authorities: Object.keys(LOOKUPS),
  checked: 0,
  confirmed: [],
  mismatched: [],
  unconfirmed: [],
  pending: [],
  missing: [],
  health,
  warnings: [],
};

for (const taxon of allTaxa()) {
  // Informal groups (`#slug`) are Indigene's own labels, not taxa — nobody
  // upstream has a name for "Jays, turkeys & woodpeckers", and that's fine.
  if (taxon.latin.startsWith("#")) continue;
  const row = table[taxon.latin];
  report.checked++;

  // Ask every authority, not just the one the row claims: a row sourced from
  // Wikidata that TAXREF also knows should be *promoted* to TAXREF, and a gap
  // is only a real gap when nobody has a name.
  const found = {};
  for (const [src, fn] of Object.entries(LOOKUPS)) {
    const hit = await fn(taxon.latin);
    if (hit) {
      found[src] = hit;
      health[src].answered++;
    } else if (health[src]) {
      health[src].empty++;
    }
  }
  await sleep(PAUSE_MS);

  if (!row) {
    if (Object.keys(found).length) {
      report.missing.push({ latin: taxon.latin, suggested: found, english: taxon.common });
    }
    continue;
  }
  if (missingOnly) continue;

  // A row that cites no list yet: displayed while we find it one. What it needs
  // is not a verdict but an answer — which of this locale's lists will have it.
  if (row.src === "pending") {
    const backs = Object.entries(found).find(([, name]) => same(name, row.name));
    report.pending.push({
      latin: taxon.latin,
      ours: row.name,
      promoteTo: backs?.[0] ?? null,
      elsewhere: found,
    });
    continue;
  }

  // `catalog` rows are our own labels — there is no upstream to ask.
  if (row.src === "catalog") continue;

  const upstream = found[row.src];
  if (upstream && same(upstream, row.name)) {
    report.confirmed.push({ latin: taxon.latin, name: row.name, src: row.src });
  } else if (upstream) {
    report.mismatched.push({ latin: taxon.latin, ours: row.name, theirs: upstream, src: row.src });
  } else {
    // The claimed source has nothing. Say whether anyone else does — that's the
    // difference between "wrong source tag" and "we may have made this up".
    report.unconfirmed.push({ latin: taxon.latin, ours: row.name, src: row.src, elsewhere: found });
  }
}

const totalAnswers = Object.values(health).reduce((n, h) => n + h.answered, 0);

// A run where *nothing* answered is a blocked network, not a verdict — and
// writing "0 confirmed, 0 disagreements" would look exactly like a clean bill
// of health in the committed snapshot. Refuse to write one, and say why.
if (report.checked > 0 && totalAnswers === 0) {
  console.error(
    "No reference list answered a single lookup — this is a blocked or offline network,\n" +
    "not a result. Either TAXREF, Tela Botanica and Wikidata are outside this machine's\n" +
    "egress policy, or the requests never reached the proxy (see scripts/_net.mjs). Run it\n" +
    "as `npm run names:check`, or via .github/workflows/vernacular.yml. Nothing was written.\n" +
    `HTTP: ${JSON.stringify(Object.fromEntries(Object.entries(health).map(([s, h]) => [s, h.statuses])))}`
  );
  await loader.close();
  process.exit(2);
}

// One list going quiet while the others answer is the failure this check was
// blindest to: every row that cited it becomes "source had nothing to say", and
// the locale's own national reference can drop out of a run without a word.
const dark = report.authorities.filter((s) => (health[s]?.requests ?? 0) > 0 && health[s].answered === 0);
for (const src of dark) {
  report.warnings.push(
    `${src} answered none of its ${health[src].requests} lookups (HTTP ${JSON.stringify(health[src].statuses)}).`
  );
}

mkdirSync(OUT_DIR, { recursive: true });
const outFile = join(OUT_DIR, `${lang}.json`);
writeFileSync(outFile, JSON.stringify(report, null, 2) + "\n");

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Checked ${report.checked} taxa for "${report.locale}".`);
  console.log(`  Asked: ${report.authorities.join(", ")} — VASCAN is fr-CA and no longer consulted.`);
  console.log(`  ✓ confirmed by their own source: ${report.confirmed.length}`);
  console.log(`  ≠ disagree with their source:    ${report.mismatched.length}`);
  console.log(`  ? source had nothing to say:     ${report.unconfirmed.length}`);
  console.log(`  … shown, awaiting an fr-FR source: ${report.pending.length}`);
  console.log(`  + upstream has a name we lack:   ${report.missing.length}`);
  for (const m of report.mismatched) {
    console.log(`    ≠ ${m.latin}: ours "${m.ours}" vs ${m.src} "${m.theirs}"`);
  }
  for (const u of report.unconfirmed) {
    const other = Object.keys(u.elsewhere).join(", ") || "nobody";
    console.log(`    ? ${u.latin}: "${u.ours}" tagged ${u.src}; found by: ${other}`);
  }

  // The pending rows, sorted by what to *do* with each: promote it, reconsider
  // it, or delete it. That order is the order a reviewer can act in.
  const promote = report.pending.filter((p) => p.promoteTo);
  const differ = report.pending.filter((p) => !p.promoteTo && Object.keys(p.elsewhere).length);
  const orphan = report.pending.filter((p) => !p.promoteTo && !Object.keys(p.elsewhere).length);
  if (promote.length) console.log(`\n  Pending rows a French list confirms — retag these (${promote.length}):`);
  for (const p of promote) console.log(`    → ${p.latin}: "${p.ours}" — src: "${p.promoteTo}"`);
  if (differ.length) console.log(`\n  Pending rows a French list names differently (${differ.length}):`);
  for (const p of differ) console.log(`    ! ${p.latin}: ours "${p.ours}" vs ${JSON.stringify(p.elsewhere)}`);
  if (orphan.length) console.log(`\n  Pending rows no French list has named — candidates for deletion (${orphan.length}):`);
  for (const p of orphan) console.log(`    − ${p.latin}: "${p.ours}"`);

  if (report.missing.length) console.log(`\n  Upstream names we don't show (first 40):`);
  for (const g of report.missing.slice(0, 40)) {
    console.log(`    + ${g.latin} (${g.english}) → ${JSON.stringify(g.suggested)}`);
  }
  for (const w of report.warnings) console.log(`\n  !! ${w}`);
  console.log(`\nSnapshot written to ${outFile}`);
}

await loader.close();

// A disagreement is a real problem — the app is asserting a name the authority
// doesn't back. So is the locale's national reference answering nothing at all,
// which is a check that has stopped checking. Gaps are neither: plenty of taxa
// have no French name, and we show the scientific name for those on purpose.
process.exit(report.mismatched.length || dark.includes(PRIMARY) ? 1 : 0);
