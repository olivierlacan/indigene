// New Zealand caterpillar-host counts, from Plant-SyNZ.
//
//   npm run host-counts:nz                         # every genus the NZ region ships
//   npm run host-counts:nz -- --refresh            # ignore the cache, ask again
//
// `hostLepCount` is how many butterfly and moth species raise their
// caterpillars on a plant. The US figures come from Tallamy / NWF and Europe's
// from the Gaytán matrix (`build-host-counts.mjs`); neither covers New Zealand.
// Plant-SyNZ does: Manaaki Whenua – Landcare Research's database of
// invertebrate herbivores on New Zealand's native plants (Martin et al.,
// https://plant-synz.landcareresearch.co.nz). Every record names the herbivore,
// its order and family, whether it is native or introduced, and a 0–10
// *reliability score* for how good the evidence is that it breeds on the plant.
//
// ## The counting rule
//
// A plant's figure is the number of distinct species that are all of:
//
//   - **Lepidoptera** (moths and butterflies) — the same group every other
//     region counts;
//   - **native to New Zealand** (Plant-SyNZ biostatus `endemic` or `native`) —
//     an introduced moth on a native plant is not what the number is for;
//   - recorded with **reliability ≥ 7**, the cut-off Plant-SyNZ itself offers
//     for good evidence of a breeding association (its scale: 10 = reared on the
//     plant; low scores = an adult seen resting on it).
//
// Counted at **genus** level, across every New Zealand native species of the
// genus, like the US and European figures, so the numbers mean the same thing
// everywhere: "caterpillars that use this kind of plant here". Each row's own
// species count is recorded beside it for the audit.
//
// ## What it writes
//
//   data/sources/plant-synz/host-counts.json   committed — every genus's count,
//                                              and the moths behind it by name
//   data/sources/plant-synz/cache/*.html       git-ignored — the raw reports
//
// It does not rewrite `plants.nz-auckland.ts`: like `build-host-counts.mjs`, it
// reports, and each row's `hostLepCount` and `basis` are edited by hand.
//
// A polite client: one request at a time, a pause between them, and a cache so
// a re-run asks for nothing it already has.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";
import { openLoader } from "./_load-ts.mjs";
import { wcvpAccepted, wcvpDistributions } from "./_wcvp.mjs";

requireProxyAwareFetch("host-counts:nz");

const BASE = "https://plant-synz.landcareresearch.co.nz";
const REGION = "nz-auckland";
const MIN_SCORE = 7;
const NATIVE = new Set(["endemic", "native"]);

/**
 * Older genus names Plant-SyNZ still files New Zealand plants under (its
 * names are from about 2011). Searched alongside the current name so, say,
 * koromiko's records under *Hebe* count for *Veronica*. Only names whose NZ
 * members moved wholesale; the biostatus filter below keeps an alias's
 * overseas members (pampas grass under *Cortaderia*) out.
 */
const OLDER_NAMES = {
  Apodasmia: ["Leptocarpus"],
  Austroderia: ["Cortaderia"],
  Lobelia: ["Pratia"],
  Passiflora: ["Tetrapathaea"],
  Piper: ["Macropiper"],
  Veronica: ["Hebe"],
};

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR = join(REPO_ROOT, "data", "sources", "plant-synz");
const CACHE = join(DIR, "cache");
const OUT = join(DIR, "host-counts.json");
const REFRESH = process.argv.includes("--refresh");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

async function get(url, init = {}) {
  await sleep(400);
  const res = await fetch(url, { redirect: "manual", ...init });
  return res;
}

/** Search Plant-SyNZ for host plants whose name starts with `text`. */
async function searchHosts(text) {
  const cacheFile = join(CACHE, `search-${text}.html`);
  if (!REFRESH && existsSync(cacheFile)) return readFileSync(cacheFile, "utf8");
  // ASP.NET WebForms: read the form's hidden state, post it back, follow the
  // redirect to the results page with the session cookie it set.
  const form = await get(`${BASE}/SearchForm.aspx`);
  const cookie = (form.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  const html = await form.text();
  const hidden = (name) => html.match(new RegExp(`id="${name}" value="([^"]*)"`))?.[1] ?? "";
  const body = new URLSearchParams({
    __VIEWSTATE: hidden("__VIEWSTATE"),
    __VIEWSTATEGENERATOR: hidden("__VIEWSTATEGENERATOR"),
    __EVENTVALIDATION: hidden("__EVENTVALIDATION"),
    SearchType: "HostRadioButton",
    SearchText: text,
    ScientificSearchButton: "Search",
    Language: "AllLangsRadio",
  });
  const post = await get(`${BASE}/SearchForm.aspx`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", cookie },
    body,
  });
  const next = post.headers.get("location");
  const allCookies = [cookie, ...(post.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0])].filter(Boolean).join("; ");
  const results = next ? await get(new URL(next, BASE).href, { headers: { cookie: allCookies } }) : post;
  const out = await results.text();
  if (!/Search Results/.test(out)) throw new Error(`Plant-SyNZ search for "${text}" returned no results page`);
  writeFileSync(cacheFile, out);
  return out;
}

/** Host-plant rows from a results page: record id, full name, biostatus. */
function parseSearch(html) {
  const rows = [];
  // Cells can carry markup (a citation with an italic genus name), so each is
  // matched lazily to its closing tag and stripped, not assumed to be plain.
  const re = /DetailsForm\.aspx\?Type=P&RecordId=(\d+)[^>]*>([^<]+)<\/a><\/td><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td>/g;
  const text = (s) => decode(s.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " "));
  for (const m of html.matchAll(re)) rows.push({ id: Number(m[1]), name: decode(m[2]), biostatus: text(m[4]) });
  return rows;
}

async function report(recordId) {
  const cacheFile = join(CACHE, `host-${recordId}.html`);
  if (!REFRESH && existsSync(cacheFile)) return readFileSync(cacheFile, "utf8");
  const res = await get(`${BASE}/ReportForm.aspx?Type=P&SortBy=Higher&RecordId=${recordId}`);
  const html = await res.text();
  if (!/Herbivores associated with a host plant/.test(html)) throw new Error(`no report for host record ${recordId}`);
  writeFileSync(cacheFile, html);
  return html;
}

/** Every herbivore record on a host report. */
function parseReport(html) {
  const out = [];
  const re =
    /<b>(\d+)<\/b>\s*<i><a href='DetailsForm\.aspx\?Type=H&RecordId=(\d+)[^']*'>([^<]+)<\/a><\/i>\s*\(<font size=-1>([^:]+):\s*([^)]+)\)[^<]*<br>(.*?)<\/font>\.\s*Biostatus:\s*([^<]+)<br>/g;
  for (const m of html.matchAll(re)) {
    out.push({
      score: Number(m[1]),
      id: Number(m[2]),
      name: decode(m[3]),
      order: decode(m[4]),
      family: decode(m[5]),
      note: decode(m[6]),
      biostatus: decode(m[7]).toLowerCase(),
    });
  }
  return out;
}

/**
 * Is this Plant-SyNZ host a New Zealand native? Its own biostatus decides when
 * it has one ("Endemic", or "Non-endemic": indigenous here and elsewhere too).
 * Newer names often have a blank biostatus (kānuka is filed as *Kunzea
 * ericoides* s.l. and *K. robusta*), so a blank is put to Kew's WCVP: native
 * on either main island counts. Unnamed "sp." rows are skipped — they can be
 * an overseas plant as easily as a native one.
 */
const wcvpCache = new Map();
async function nativeHere(row) {
  if (/^(Endemic|Non-endemic)\b/.test(row.biostatus)) return true;
  if (row.biostatus) return false; // Exotic, adventive, naturalised…
  const [g, sp] = row.name.split(/\s+/);
  if (!sp || sp === "sp." || sp === "aff." || sp.startsWith("×") || sp === "x") return false;
  const binomial = `${g} ${sp}`;
  if (!wcvpCache.has(binomial)) {
    let native = false;
    try {
      const acc = await wcvpAccepted(binomial);
      if (acc) {
        const dist = await wcvpDistributions(acc.key);
        native = dist.some((d) => /TDWG:NZ[NS]/.test(d.locationId ?? "") && !d.establishmentMeans);
      }
    } catch { /* unknown to WCVP → not counted */ }
    wcvpCache.set(binomial, native);
  }
  return wcvpCache.get(binomial);
}

const counts = (h) => h.order === "Lepidoptera" && NATIVE.has(h.biostatus) && h.score >= MIN_SCORE;

// ---------------------------------------------------------------- main ----

mkdirSync(CACHE, { recursive: true });
const loader = await openLoader();
const { SEED_RAW } = await loader.load(`/src/data/plants.${REGION}.ts`);
await loader.close();

const genera = [...new Set(SEED_RAW.map((p) => p.latin.split(/\s+/)[0]))].sort();
const result = {};
const plants = {};
for (const genus of genera) {
  const hosts = [];
  for (const name of [genus, ...(OLDER_NAMES[genus] ?? [])]) {
    for (const r of parseSearch(await searchHosts(name))) {
      if (r.name.split(/\s+/)[0] === name && (await nativeHere(r))) hosts.push(r);
    }
  }
  const moths = new Map();
  const bySpecies = {};
  for (const host of hosts) {
    const recs = parseReport(await report(host.id)).filter(counts);
    bySpecies[host.name] = recs.length;
    for (const r of recs) if (!moths.has(r.id)) moths.set(r.id, { name: r.name, family: r.family });
  }
  result[genus] = {
    count: moths.size,
    speciesSearched: hosts.length,
    moths: [...moths.values()].sort((a, b) => a.name.localeCompare(b.name)).map((m) => `${m.name} (${m.family})`),
  };
  for (const p of SEED_RAW.filter((p) => p.latin.split(/\s+/)[0] === genus)) {
    const epithet = p.latin.split(/\s+/)[1];
    const own = Object.entries(bySpecies).find(([n]) => n.startsWith(`${p.latin} `) || n === p.latin ||
      (OLDER_NAMES[genus] ?? []).some((old) => n.startsWith(`${old} ${epithet} `)));
    plants[p.id] = { latin: p.latin, genus: moths.size, species: own ? own[1] : null };
  }
  console.log(`${genus.padEnd(16)} ${String(moths.size).padStart(4)}  (${hosts.length} NZ species searched)`);
}

writeFileSync(
  OUT,
  JSON.stringify({
    source: "Plant-SyNZ, Manaaki Whenua – Landcare Research (https://plant-synz.landcareresearch.co.nz)",
    rule: `native (endemic or native) Lepidoptera, reliability score ≥ ${MIN_SCORE}, distinct species across every NZ native species of the genus`,
    retrieved: new Date().toISOString().slice(0, 10),
    plants,
    genera: result,
  }, null, 2) + "\n",
);
console.log(`\nwrote ${OUT}`);
