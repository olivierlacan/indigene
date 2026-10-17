// `npm run harvest:fnps` — read the Florida Native Plant Society's plant
// database, one page per plant, as a shortlist and a cross-check for both
// Florida regions.
//
// ## What it is admitted for
//
// FNPS writes up Florida natives, so a page here is a **native-status claim**,
// from a society that knows the state's flora. A claim, not the last word: a
// row also needs the Atlas of Florida Plants (USF) to agree, and Kew to pass
// `native:check`. Nursery availability is never evidence of native status —
// plenty of what native nurseries sell is sold because it's popular.
//
// It also writes a page per plant that a gardener can act on: what nurseries sell
// it, how much sun and water it takes, what soil, which USDA zones. That is the
// half of a row we otherwise piece together from three places, and the
// availability line answers the one question no checklist can — *can anybody
// actually buy this?*
//
// The report asks Kew about every row it prints. The Atlas is read by a person
// (`data/sources/atlas-florida/`), so its column is filled in by hand.
//
// ## Being a good guest
//
// FNPS is a volunteer-run society, and its site is how it raises money and
// members. So this script:
//
//   - says who it is: the user-agent names Indigene and links to the project,
//     where the other harvesters borrow a browser's;
//   - reads their robots.txt first, every run, and stops if it shuts us out;
//   - asks one page at a time, waiting a random 0.1–5 s between them (longer
//     if robots.txt sets a Crawl-delay) — and never
//     asks twice: each page is reduced to its facts and cached, and a rerun
//     only fetches pages it hasn't read;
//   - reads only the public plant pages. The county map on each page is fed by
//     a keyed private endpoint; that is theirs, and this does not touch it;
//   - keeps facts, not prose. Which nurseries carry a plant, its zones, its
//     light and moisture — no descriptions, no photos. Their robots.txt allows
//     it (`Content-Signal: search=yes, ai-input=yes`); the pages are "All Rights
//     Reserved", which is why the raw harvest stays git-ignored and only counts
//     and our own rows' verdicts are committed.
//
// ## Usage
//
//   npm run harvest:fnps                              read every page (≈40 min)
//   npm run harvest:fnps -- --limit 20                the first 20 not yet read
//   npm run harvest:fnps -- --report florida-central  shortlist, no fetching
//                                                     except Kew
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireProxyAwareFetch } from "./_net.mjs";
import { wcvpAccepted, wcvpDistributions, wcvpStatus } from "./_wcvp.mjs";
import { REGION_FILE, REGION_ZONES, key, parseIndex, parsePlant, sells } from "./_fnps-parse.mjs";
import { allowed, robotsFor } from "./_robots.mjs";

requireProxyAwareFetch("harvest:fnps");

const DIR = fileURLToPath(new URL("../../data/sources/fnps/", import.meta.url));
const RAW = `${DIR}raw/plants.json`;
const BASE = "https://www.fnps.org";
const UA = "Indigene native-plant app (+https://indigene.app; https://github.com/olivierlacan/indigene)";
// A random wait between pages, 0.1–5 s (≈2.5 s on average). Never shorter
// than a Crawl-delay their robots.txt sets.
const PAUSE_MIN_MS = 100;
const PAUSE_MAX_MS = 5000;
const RETRY_MS = 3000;

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getHtml(url, attempt = 0) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    if (attempt >= 2) throw err;
    await sleep(RETRY_MS * 2 ** (attempt + 1));
    return getHtml(url, attempt + 1);
  }
}

function loadRaw() {
  return existsSync(RAW) ? JSON.parse(readFileSync(RAW, "utf8")) : { harvested: null, plants: {} };
}

async function harvest() {
  const limit = Number(flag("--limit") ?? Infinity);
  const raw = loadRaw();
  // Their robots.txt is the line; checked every run, not remembered from today.
  const robots = robotsFor((await getHtml(`${BASE}/robots.txt`)) ?? "", UA);
  const floor = (robots.delay ?? 0) * 1000;
  const pause = () => Math.max(floor, PAUSE_MIN_MS + Math.random() * (PAUSE_MAX_MS - PAUSE_MIN_MS));
  if (!allowed(robots, "/plant") || !allowed(robots, "/plant/acer-rubrum")) {
    throw new Error("FNPS's robots.txt now asks scripts to stay off the plant pages — stopping");
  }
  const index = await getHtml(`${BASE}/plant`);
  const slugs = parseIndex(index);
  if (slugs.length < 500) throw new Error(`index listed ${slugs.length} plants — expected ~700; the page changed`);
  const unread = slugs.filter((s) => !(s in raw.plants));
  const todo = unread.slice(0, limit);
  console.log(`FNPS lists ${slugs.length} plants; ${slugs.length - unread.length} already read; reading ${todo.length}.`);
  mkdirSync(`${DIR}raw`, { recursive: true });
  let n = 0;
  for (const slug of todo) {
    await sleep(pause());
    const html = await getHtml(`${BASE}/plant/${slug}`);
    raw.plants[slug] = html ? parsePlant(html) : null;
    n++;
    process.stdout.write(`\r  ${n}/${todo.length} ${slug.padEnd(40)}`);
    // Save as we go, so an interrupted run never asks for a page twice.
    if (n % 10 === 0 || n === todo.length) {
      raw.harvested = new Date().toISOString().slice(0, 10);
      raw.indexed = slugs.length;
      writeFileSync(RAW, `${JSON.stringify(raw, null, 1)}\n`);
    }
  }
  const unreadable = Object.entries(raw.plants).filter(([, p]) => !p).map(([s]) => s);
  console.log(`\nRead ${Object.keys(raw.plants).length} pages; ${unreadable.length} carried no plant: ${unreadable.join(", ") || "none"}`);
}

// ---------------------------------------------------------------------------
// The report: what FNPS writes up that a region doesn't carry.

async function report(region) {
  const zones = REGION_ZONES[region];
  if (!zones) throw new Error(`no FNPS mapping for region "${region}" — only the two Florida regions`);
  const raw = loadRaw();
  const plants = Object.entries(raw.plants).filter(([, p]) => p);
  if (!plants.length) throw new Error("nothing harvested yet — run `npm run harvest:fnps` first");
  const src = readFileSync(fileURLToPath(new URL(`../src/data/${REGION_FILE[region]}`, import.meta.url)), "utf8");
  const ours = new Set([...src.matchAll(/latin: "([^"]+)"/g)].map((m) => key(m[1])));

  const inZone = plants.filter(([, p]) => p.zones.some((z) => zones.includes(z)));
  const oursListed = [...ours].filter((k) => plants.some(([, p]) => key(p.latin) === k));
  const oursSold = [...ours].filter((k) => plants.some(([, p]) => key(p.latin) === k && sells(p)));
  const gaps = inZone.filter(([, p]) => !ours.has(key(p.latin)) && sells(p));

  console.log(`\nFNPS plant database — ${region}`);
  console.log(`  ${plants.length} plants read; ${inZone.length} grow in zones ${zones.join("/")}`);
  console.log(`  ours: ${ours.size} · written up by FNPS: ${oursListed.length} · buyable per FNPS: ${oursSold.length}`);
  console.log(`  in zone, buyable, not on our list: ${gaps.length}`);

  // FNPS's page is one source for native status; Kew is asked here so the
  // shortlist shows where the two already agree, and the Atlas is the third.
  const byForm = new Map();
  const onlyForm = flag("--form");
  let asked = 0;
  for (const [slug, p] of gaps) {
    const form = (p.form[0] ?? "?").toLowerCase();
    if (onlyForm && !form.includes(onlyForm)) continue;
    const usage = await wcvpAccepted(p.latin);
    const kew = usage ? wcvpStatus(await wcvpDistributions(usage.key), (r) => r.locationId === "TDWG:FLA") : "NO MATCH";
    process.stdout.write(`\r  asked Kew about ${++asked}`);
    if (!byForm.has(form)) byForm.set(form, []);
    byForm.get(form).push({ slug, ...p, kew, accepted: usage?.name });
  }
  console.log("");
  for (const [form, rows] of [...byForm].sort((a, b) => a[1].length - b[1].length)) {
    console.log(`\n  ${form} — ${rows.length}`);
    for (const r of rows.sort((a, b) => a.latin.localeCompare(b.latin))) {
      const kew = r.kew === "NATIVE" ? "Kew: native in FL" : `Kew: ${r.kew}`;
      const renamed = r.accepted && key(r.accepted) !== key(r.latin) ? ` (Kew: ${r.accepted})` : "";
      console.log(`    ${r.latin.padEnd(34)} ${(r.common ?? "").slice(0, 26).padEnd(26)} ${kew}${renamed} · ${r.availability.join(", ")}`);
    }
  }

  const snapshot = {
    source: "Florida Native Plant Society — Plant Database",
    url: `${BASE}/plant`,
    note:
      "A society's native-status claim plus gardening facts. Corroborated by the Atlas of Florida Plants (USF) and Kew; nursery availability is never evidence of native status. Facts only; the raw harvest is git-ignored.",
    region,
    zones,
    harvested: raw.harvested,
    counts: {
      read: plants.length,
      inZone: inZone.length,
      ours: ours.size,
      oursWrittenUp: oursListed.length,
      oursBuyable: oursSold.length,
      inZoneBuyableNotOurs: gaps.length,
    },
    oursNotWrittenUp: [...ours].filter((k) => !oursListed.includes(k)).sort(),
  };
  writeFileSync(`${DIR}${region}.json`, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`\n→ data/sources/fnps/${region}.json`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const region = flag("--report");
  await (region ? report(region) : harvest());
}
