// Which of the services our scripts call can a Claude session actually reach?
//
//   npm run network:check            # ask each one, print the table
//   npm run network:check -- --write # and rewrite the table in docs/network.md
//
// A cloud session's outbound traffic goes through the environment's allowlist,
// and for a long time the scripts' comments said "the build sandbox blocks
// iNaturalist" after it no longer did. This replaces the folklore with one
// real request per host, the kind the script that uses it would send.
//
// Three different things can stop a request, and they need different fixes:
//  - **blocked**: the request never got out — the allowlist (or the network).
//    Fixed in the environment's settings, by adding the host.
//  - **challenge**: the host's bot wall (Cloudflare's "Just a moment…") turned
//    us away. No allowlist fixes that; run it on a GitHub runner or locally.
//  - **refused**: the host answered with an error for some other reason.
//  - **timed out** / **unreachable**: the tunnel opened but nothing usable came
//    back — a slow or down host, not the allowlist. Run it again.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { HOSTS } from "./network-hosts.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC = resolve(HERE, "../../docs/network.md");
const UA = "IndigeneNetworkCheck/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";


/** One request, sorted into the ways it can fail. curl rather than fetch,
 *  because only curl reports the proxy's answer to CONNECT separately from the
 *  host's: a 403 there is the allowlist, a 403 after it is the host. */
function probe({ url, method = "GET" }) {
  const args = ["-s", "-o", "/dev/null", "-D", "-", "-L", "-m", "60", "-A", UA,
    "-w", "\n%{http_connect} %{http_code} %{exitcode}"];
  if (method === "HEAD") args.push("-I");
  let out;
  try {
    out = execFileSync("curl", [...args, url], { encoding: "utf8" });
  } catch (err) {
    out = err.stdout ?? "";
  }
  const [connect, code, exit] = out.trim().split("\n").pop().split(" ").map(Number);
  // A proxy that refuses the tunnel answers CONNECT itself (403/407).
  if (connect === 403 || connect === 407) return { verdict: "blocked", status: `proxy ${connect}` };
  if (exit === 28) return { verdict: "slow", status: "timeout" };
  if (!code) return { verdict: "unreachable", status: `curl exit ${exit}` };
  if (/^cf-mitigated:\s*challenge/im.test(out)) return { verdict: "challenge", status: code };
  return { verdict: code < 400 ? "ok" : "refused", status: code };
}

const LABEL = {
  ok: "✅ reachable",
  challenge: "🧱 bot challenge",
  refused: "⚠️ refused",
  slow: "🐢 timed out",
  unreachable: "❓ unreachable",
  blocked: "⛔ blocked",
};

const rows = [];
// A busy shared service (Open-Meteo answers 429 now and then) gets one more
// try before it's reported; the allowlist and a bot wall answer the same twice.
const flaky = (r) => ["slow", "unreachable"].includes(r.verdict) || r.status === 429;
for (const h of HOSTS) {
  let r = probe(h);
  if (flaky(r)) {
    execFileSync("sleep", ["3"]);
    r = probe(h);
  }
  rows.push({ ...h, ...r });
  console.log(`${LABEL[r.verdict].padEnd(18)} ${String(r.status).padEnd(6)} ${h.host}`);
}

const tally = Object.fromEntries(Object.keys(LABEL).map((k) => [k, rows.filter((r) => r.verdict === k).length]));
console.log(`\n${rows.length} hosts · ${Object.entries(tally).map(([k, n]) => `${n} ${k}`).join(" · ")}`);

if (process.argv.includes("--write")) {
  const date = new Date().toISOString().slice(0, 10);
  const table = [
    `Checked ${date} from a Claude session.`,
    "",
    "| Host | What we ask it | Used by | From a session |",
    "|---|---|---|---|",
    ...rows.map((r) => `| \`${r.host}\` | ${r.what} | ${r.by} | ${LABEL[r.verdict]}${r.verdict === "ok" ? "" : ` (${r.status})`} |`),
  ].join("\n");
  const doc = readFileSync(DOC, "utf8");
  const start = "<!-- network:check -->";
  const end = "<!-- /network:check -->";
  const a = doc.indexOf(start);
  const b = doc.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`docs/network.md needs ${start} … ${end} markers`);
  writeFileSync(DOC, `${doc.slice(0, a + start.length)}\n${table}\n${doc.slice(b)}`);
  console.log("wrote docs/network.md");
}
