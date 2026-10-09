// Regenerate the network allowlist's two copies from its annotated source.
//
//   npm run allowlist          # write .claude/network/paste.txt and settings.json
//   npm run allowlist -- --check  # also confirm network:check's hosts are allowed
//
// The source is `.claude/network/allowed-domains.txt`; the README beside it
// says how to apply the result. `src/lib/allowlist.test.ts` fails when the
// copies drift, so CI catches an edit that skipped this step.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const SOURCE = resolve(ROOT, ".claude/network/allowed-domains.txt");
const PASTE = resolve(ROOT, ".claude/network/paste.txt");
const SETTINGS = resolve(ROOT, ".claude/settings.json");

const loader = await openLoader();
const { parseAllowlist, pasteList, redundant, allows } = await loader.load("/src/lib/allowlist.ts");
await loader.close();

const entries = parseAllowlist(readFileSync(SOURCE, "utf8"));
const extra = redundant(entries);
if (extra.length) {
  for (const { entry, by } of extra) {
    console.error(`line ${entry.line}: ${entry.host} is already allowed by ${by.host} (line ${by.line})`);
  }
  process.exit(1);
}

const paste = pasteList(entries);
writeFileSync(PASTE, paste);

// settings.json carries hooks too: replace only the allowlist.
const settings = JSON.parse(readFileSync(SETTINGS, "utf8"));
settings.sandbox = {
  ...settings.sandbox,
  network: { ...settings.sandbox?.network, allowedDomains: paste.trim().split("\n") },
};
writeFileSync(SETTINGS, JSON.stringify(settings, null, 2) + "\n");

const groups = new Set(entries.map((e) => e.group)).size;
console.log(`${entries.length} hosts in ${groups} groups → .claude/network/paste.txt, .claude/settings.json`);

if (process.argv.includes("--check")) {
  const { HOSTS } = await import("./network-hosts.mjs");
  const missing = HOSTS.map((h) => h.host).filter((host) => !entries.some((e) => allows(e.host, host)));
  if (missing.length) {
    console.error(`network:check asks hosts the allowlist doesn't cover:\n  ${missing.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`every host network:check asks is allowed (${HOSTS.length})`);
}
