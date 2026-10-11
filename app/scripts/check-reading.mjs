// `npm run reading:check` — do the further-reading links still open?
//
// Every pick in `src/data/reading.ts` links somewhere off the site, and so does
// every recommendation behind it. Those are facts that go stale on their own: a
// publisher reshuffles its catalogue, a society moves its reading list, a county
// retires an old `.aspx` address. So this asks each address, once, and reports
// the ones that answer with an error — or don't answer at all.
//
// A host that refuses robots (403/406/429 — Calscape does) is reported apart from
// a dead page, because it usually opens fine in a browser: a person should look
// before anything is removed.
//
//   npm run reading:check
//
// Needs the open internet; it proves nothing from a network that blocks the
// hosts, and says so rather than reporting every link dead.
import { openLoader } from "./_load-ts.mjs";

const TIMEOUT_MS = 20_000;
const BLOCKED = new Set([401, 403, 406, 429]);

const { load, close } = await openLoader();
let READING;
try {
  ({ READING } = await load("/src/data/reading.ts"));
} finally {
  await close();
}

/** Every address once, with the places it is used. */
const uses = new Map();
for (const [region, rows] of Object.entries(READING)) {
  for (const r of rows) {
    const add = (url, what) => {
      if (!uses.has(url)) uses.set(url, new Set());
      uses.get(url).add(`${region}: ${what}`);
    };
    add(r.url, r.title);
    for (const v of r.vouched ?? []) add(v.url, `${r.title} ← ${v.name}`);
  }
}

async function ask(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "Mozilla/5.0 (compatible; indigene-reading-check)" },
    });
    return res.status;
  } catch (err) {
    // A string, never a number: an error code can be numeric (0), and a bare
    // 0 once sorted as "open" — 70 of 73 links "opened" from a network that
    // had reached 15.
    return `no answer (${err?.cause?.code ?? err?.name ?? "error"})`;
  }
}

const results = await Promise.all([...uses.keys()].map(async (url) => [url, await ask(url)]));
const opened = (s) => typeof s === "number" && s >= 200 && s < 400;
const ok = results.filter(([, s]) => opened(s));
const blocked = results.filter(([, s]) => BLOCKED.has(s));
const dead = results.filter(([, s]) => !opened(s) && !BLOCKED.has(s));

const show = ([url, status]) => {
  console.log(`  ${status}  ${url}`);
  for (const u of uses.get(url)) console.log(`         ${u}`);
};

console.log(`${results.length} addresses: ${ok.length} open, ${blocked.length} refuse robots, ${dead.length} failed.`);
if (blocked.length) {
  console.log("\nRefused a script (check in a browser):");
  blocked.forEach(show);
}
if (dead.length) {
  console.log("\nFailed:");
  dead.forEach(show);
}
if (!ok.length) {
  console.error("\nNothing opened at all — this network is probably blocking the hosts, not the links.");
  process.exit(2);
}
process.exit(dead.length ? 1 : 0);
