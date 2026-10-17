// `npm run bsbi:check -- --region scotland-lowlands` — ask the BSBI's Plant
// Atlas 2020 whether every plant a British region ships is recorded as *native*
// inside that region, square by square.
//
// Kew's WCVP (`native:check`) answers for Great Britain as one TDWG area, so it
// cannot tell a plant native to Kent from one native to Fife. The Botanical
// Society of Britain and Ireland can: its atlas records, for every species and
// every 10 km square (hectad), whether the plant there is native ("n") or
// introduced ("a"), and in which date classes it was seen. That is the grain a
// Scottish list needs, and it is the authority British botanists themselves
// cite.
//
// The atlas has no documented API. Its own pages fetch two kinds of CSV, and
// this script reads the same two:
//
//   bsbi/taxon_list.csv                 name → BSBI database id
//   bsbi/maps/hectads/<id>.csv          one row per hectad: date classes + status
//
// ## Reading the answer
//
//   NATIVE    recorded as native, 2000–2019, in at least MIN_NATIVE hectads
//             inside the region's box
//   SCARCE    native there, but in fewer hectads — not wrong, worth a look
//   PRESENT   a species so widely planted that the atlas maps it without a
//             native/introduced split ("present only": rowan, holly, ivy, the
//             oaks). Recorded in at least MIN_NATIVE hectads in the box, but the
//             native claim has to rest on WCVP and the row's own `basis`; a
//             tree that is planted everywhere and native nowhere here (beech,
//             sycamore) would read the same, so this is reported, not passed
//             silently
//   ALIEN     recorded in the box, but only as introduced → **should not ship**
//   ABSENT    not recorded in the box since 2000 → likewise
//   no-match  the atlas has no taxon by this name → check the accepted name
//
// Only hectad *centres* are tested against the box, which is plenty at 10 km
// and needs no polygon. Grid references are converted from the Ordnance Survey
// grid with the Airy ellipsoid and no datum shift — about 100 m out, which
// moves no hectad across any line we draw.
//
// What we keep is a count of squares per plant, not BSBI's records; the counts
// go into a committed snapshot so the next run shows what changed upstream.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("bsbi:check");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA_DIR = join(REPO_ROOT, "app", "src", "data");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "bsbi-plant-atlas");
const ATLAS = "https://plantatlas2020.org/sites/default/files/bsbi_data/bsbi";

/** Below this many recent native hectads in the box, a row is flagged SCARCE.
 *  The lowland box holds about 420 hectads; ten keeps a plant that is native
 *  only at the box's Highland edge (Scots pine: 7) from passing as lowland. */
const MIN_NATIVE = 10;

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const regionArg = opt("--region");
// `--names "Pinus sylvestris, Juniperus communis"` screens candidates that have
// no row yet, against the same region's box. Nothing is written.
const namesArg = opt("--names");
if (!regionArg) {
  console.error('usage: npm run bsbi:check -- --region <id> [--names "Genus species, …"]');
  process.exit(2);
}

const metaSrc = readFileSync(join(DATA_DIR, `region.${regionArg}.ts`), "utf8");
const b = metaSrc.match(
  /bounds:\s*\{\s*minLat:\s*([-\d.]+),\s*maxLat:\s*([-\d.]+),\s*minLon:\s*([-\d.]+),\s*maxLon:\s*([-\d.]+)\s*\}/,
);
if (!b) {
  console.error(`region.${regionArg}.ts: no bounds found`);
  process.exit(2);
}
const box = { minLat: +b[1], maxLat: +b[2], minLon: +b[3], maxLon: +b[4] };

// ---------------------------------------------------------------------------
// Ordnance Survey grid → latitude/longitude

/** "NT27" → the hectad's centre as OSGB easting/northing in metres. */
function hectadCentre(ref) {
  const m = /^([HNOST])([A-HJ-Z])(\d)(\d)$/.exec(ref);
  if (!m) return null; // Irish grid (one letter), Channel Islands, tetrads…
  const idx = (c) => {
    const i = c.charCodeAt(0) - 65;
    return i > 7 ? i - 1 : i; // the grid skips I
  };
  const l1 = idx(m[1]);
  const l2 = idx(m[2]);
  const e100 = ((l1 - 2) % 5) * 5 + (l2 % 5);
  const n100 = 19 - Math.floor(l1 / 5) * 5 - Math.floor(l2 / 5);
  return { e: e100 * 1e5 + +m[3] * 1e4 + 5000, n: n100 * 1e5 + +m[4] * 1e4 + 5000 };
}

/** Inverse transverse Mercator on the Airy 1830 ellipsoid (OSGB36). */
function osgbToLatLon(E, N) {
  const a = 6377563.396, bb = 6356256.909, F0 = 0.9996012717;
  const lat0 = (49 * Math.PI) / 180, lon0 = (-2 * Math.PI) / 180;
  const N0 = -100000, E0 = 400000;
  const e2 = 1 - (bb * bb) / (a * a), n = (a - bb) / (a + bb);
  const M = (lat) => {
    const d = lat - lat0, s = lat + lat0;
    return bb * F0 * (
      (1 + n + (5 / 4) * n ** 2 + (5 / 4) * n ** 3) * d -
      (3 * n + 3 * n ** 2 + (21 / 8) * n ** 3) * Math.sin(d) * Math.cos(s) +
      ((15 / 8) * n ** 2 + (15 / 8) * n ** 3) * Math.sin(2 * d) * Math.cos(2 * s) -
      (35 / 24) * n ** 3 * Math.sin(3 * d) * Math.cos(3 * s)
    );
  };
  let lat = lat0, m = 0;
  do {
    lat = (N - N0 - m) / (a * F0) + lat;
    m = M(lat);
  } while (Math.abs(N - N0 - m) >= 0.00001);
  const sin = Math.sin(lat), cos = Math.cos(lat), tan = Math.tan(lat);
  const nu = (a * F0) / Math.sqrt(1 - e2 * sin * sin);
  const rho = (a * F0 * (1 - e2)) / (1 - e2 * sin * sin) ** 1.5;
  const eta2 = nu / rho - 1;
  const VII = tan / (2 * rho * nu);
  const VIII = (tan / (24 * rho * nu ** 3)) * (5 + 3 * tan ** 2 + eta2 - 9 * tan ** 2 * eta2);
  const IX = (tan / (720 * rho * nu ** 5)) * (61 + 90 * tan ** 2 + 45 * tan ** 4);
  const X = 1 / (cos * nu);
  const XI = (1 / (cos * 6 * nu ** 3)) * (nu / rho + 2 * tan ** 2);
  const XII = (1 / (cos * 120 * nu ** 5)) * (5 + 28 * tan ** 2 + 24 * tan ** 4);
  const XIIA = (1 / (cos * 5040 * nu ** 7)) * (61 + 662 * tan ** 2 + 1320 * tan ** 4 + 720 * tan ** 6);
  const dE = E - E0;
  return {
    lat: ((lat - VII * dE ** 2 + VIII * dE ** 4 - IX * dE ** 6) * 180) / Math.PI,
    lon: ((lon0 + X * dE - XI * dE ** 3 + XII * dE ** 5 - XIIA * dE ** 7) * 180) / Math.PI,
  };
}

const inBox = (ref) => {
  const c = hectadCentre(ref);
  if (!c) return false;
  const { lat, lon } = osgbToLatLon(c.e, c.n);
  return lat >= box.minLat && lat <= box.maxLat && lon >= box.minLon && lon <= box.maxLon;
};

// ---------------------------------------------------------------------------
// The atlas

/** Split one CSV line, honouring quotes. The atlas files are small and regular. */
function splitCsv(line) {
  const out = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

async function getText(url) {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status}`);
      return (await r.text()).replace(/^﻿/, "");
    } catch (e) {
      if (attempt >= 2) throw e;
      await new Promise((res) => setTimeout(res, 2000 * (attempt + 1)));
    }
  }
}

// Where the atlas files a plant under another name than our row's accepted one.
const ATLAS_NAME = {
  "Thymus praecox": "Thymus drucei",
  "Struthiopteris spicant": "Blechnum spicant",
};

const taxa = new Map();
for (const line of (await getText(`${ATLAS}/taxon_list.csv`)).split(/\r?\n/).slice(1)) {
  if (!line) continue;
  const [id, name, , , , , , noStatus] = splitCsv(line);
  if (!taxa.has(name)) taxa.set(name, { id, presentOnly: noStatus === "present only" });
}

const RECENT = ["2000 - 2009", "2010 - 2019"];

async function statusFor(latin) {
  const query = ATLAS_NAME[latin] ?? latin.replace(/\s+agg\.$/, "").trim();
  const taxon = taxa.get(query) ?? taxa.get(query.replace(/\s+(subsp|var)\.\s+\S+$/, ""));
  if (!taxon) return { verdict: "no-match" };
  const { id, presentOnly } = taxon;
  const lines = (await getText(`${ATLAS}/maps/hectads/${id.replace(/\./g, "_")}.csv`))
    .split(/\r?\n/)
    .filter(Boolean);
  const head = splitCsv(lines[0]);
  const col = (k) => head.indexOf(k);
  let native = 0, alien = 0, present = 0, older = 0;
  for (const line of lines.slice(1)) {
    const r = splitCsv(line);
    const hectad = r[col("hectad")];
    if (!inBox(hectad)) continue;
    const recent = RECENT.some((k) => +r[col(k)] > 0);
    if (!recent) { older++; continue; }
    const status = r[col("hectadstatus")];
    if (status === "n") native++;
    else if (status === "a") alien++;
    else present++; // "y": recorded, status not mapped
  }
  // Trust the squares over the flag: dog rose is listed "present only" and
  // still carries native/introduced statuses square by square.
  if (presentOnly && present > native + alien) {
    const verdict = present + native >= MIN_NATIVE ? "PRESENT" : "ABSENT";
    return { verdict, bsbiId: id, statusMapped: false, presentHectads: present + native, alienHectads: alien, olderOnly: older };
  }
  const verdict = native >= MIN_NATIVE ? "NATIVE"
    : native > 0 ? "SCARCE"
    : alien > 0 ? "ALIEN"
    : "ABSENT";
  return { verdict, bsbiId: id, nativeHectads: native, alienHectads: alien, olderOnly: older };
}

// ---------------------------------------------------------------------------

let rows;
if (namesArg) {
  rows = namesArg.split(",").map((s) => s.trim()).filter(Boolean).map((latin) => ({ id: null, latin }));
} else {
  const src = readFileSync(join(DATA_DIR, `plants.${regionArg}.ts`), "utf8");
  rows = [...src.matchAll(/^\s+id: "([^"]+)",\n\s+common: "([^"]+)",\n\s+latin: "([^"]+)"/gm)]
    .map((m) => ({ id: m[1], latin: m[3] }));
}

console.log(`${regionArg}: asking the BSBI Plant Atlas 2020 about ${rows.length} plants.`);
console.log(`Box: ${box.minLat}–${box.maxLat}° N, ${box.minLon}–${box.maxLon}° E; native in ≥ ${MIN_NATIVE} hectads since 2000.\n`);

const snapshot = [];
const problems = [];
for (const row of rows) {
  let out;
  try {
    out = await statusFor(row.latin);
  } catch (e) {
    out = { verdict: `error ${e.message}` };
  }
  const ok = out.verdict === "NATIVE";
  if (!ok && out.verdict !== "PRESENT") problems.push({ ...row, ...out });
  snapshot.push({ id: row.id, latin: row.latin, ...out });
  const counts = !out.bsbiId
    ? ""
    : out.statusMapped === false
      ? `present ${String(out.presentHectads).padStart(3)} (status not mapped)`
      : `native ${String(out.nativeHectads).padStart(3)} · introduced ${String(out.alienHectads).padStart(3)}`;
  console.log(`  ${ok ? "ok  " : out.verdict === "PRESENT" ? "note" : "FAIL"}  ${out.verdict.padEnd(8)} ${row.latin.padEnd(34)} ${counts}`);
  await new Promise((r) => setTimeout(r, 100));
}

if (!namesArg) {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, `${regionArg}.json`),
    JSON.stringify(
      {
        source: "BSBI Plant Atlas 2020 (Botanical Society of Britain and Ireland)",
        url: "https://plantatlas2020.org/",
        what: "Count of 10 km squares inside the region's box where the plant was recorded 2000–2019, split by BSBI's native/introduced status. Counts only; no records are copied.",
        box,
        minNative: MIN_NATIVE,
        region: regionArg,
        ranAt: new Date().toISOString(),
        rows: snapshot,
      },
      null,
      2,
    ) + "\n",
  );
}

const presentOnly = snapshot.filter((r) => r.verdict === "PRESENT").length;
console.log(
  `\n${rows.length - problems.length - presentOnly}/${rows.length} native in the box` +
    (presentOnly ? `; ${presentOnly} present, status not mapped (native claim rests on WCVP and the row's basis).` : "."),
);
if (problems.length) {
  for (const p of problems) console.log(`  ${p.verdict.padEnd(8)} ${p.latin}`);
  process.exitCode = 1;
}
