// Tell the service worker which release it belongs to, and what that release is
// made of. Runs after `vite build` (see `npm run build`).
//
// `public/sw.js` is hand-written and copied into dist/ verbatim, so it can't
// know the hashed file names Vite just chose. This fills in four placeholders
// in dist/sw.js from Vite's build manifest:
//
//   BUILD    a short hash of every file this release writes. Any change at
//            all — a chunk, a map, the registry JSON — changes the worker's
//            bytes, which is what makes browsers install it and drop the last
//            release's copies of the unhashed files.
//   CORE     what the page needs to open: the entry chunk and its CSS. Fetched
//            when the worker installs, so the app opens offline straight after.
//   ASSETS   every hashed file this release ships. The worker keeps exactly
//            these and drops the rest, so old releases never pile up.
//   FRENCH   the French chunks, which load only for French readers. The worker
//            refreshes them on install for a device that already had French.
//
// Then it deletes the manifest: it is a build input, not something to deploy.
//
// Safe to run again, and the deploy does (`npm run sw:stamp`, after the release
// notes and the guide are written into dist/): without a manifest it keeps the
// file lists already stamped and recomputes only BUILD, so those pages count.
import { existsSync, readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const MANIFEST = join(DIST, ".vite", "manifest.json");
const swPath = join(DIST, "sw.js");
let sw = readFileSync(swPath, "utf8");
const line = (name) => new RegExp(`^const ${name} = (.*); // stamped$`, "m");
const fill = (name, value) => {
  if (!line(name).test(sw)) throw new Error(`stamp-sw: no "const ${name} = …; // stamped" line in sw.js`);
  sw = sw.replace(line(name), `const ${name} = ${JSON.stringify(value)}; // stamped`);
};

if (existsSync(MANIFEST)) fillLists(JSON.parse(readFileSync(MANIFEST, "utf8")));
else if (JSON.parse(sw.match(line("ASSETS"))?.[1] ?? "[]").length === 0) {
  throw new Error("stamp-sw: no build manifest and no stamped file lists — run `npm run build` first");
}

function fillLists(manifest) {
  const entries = Object.values(manifest);
  const all = new Set();
  for (const e of entries) {
    all.add(e.file);
    for (const c of e.css ?? []) all.add(c);
    for (const a of e.assets ?? []) all.add(a);
  }
  const assets = [...all].sort();

  const entry = entries.find((e) => e.isEntry);
  if (!entry) throw new Error("stamp-sw: no entry chunk in the build manifest");
  const core = new Set();
  const visit = (key) => {
    const e = manifest[key];
    if (!e || core.has(e.file)) return;
    core.add(e.file);
    for (const c of e.css ?? []) core.add(c);
    for (const i of e.imports ?? []) visit(i);
  };
  visit(Object.keys(manifest).find((k) => manifest[k] === entry));

  const french = assets.filter((f) => /^assets\/(lang|prose)-fr-/.test(f));
  if (french.length !== 2) throw new Error(`stamp-sw: expected the two French chunks, found ${french.join(", ") || "none"}`);
  if ([...core].some((f) => french.includes(f))) throw new Error("stamp-sw: French is in the core chunks — it would load for every reader");
  fill("CORE", [...core].sort());
  fill("ASSETS", assets);
  fill("FRENCH", french);
  console.log(`sw: ${assets.length} files, ${core.size} to open offline, French in ${french.length}`);
}

// Every file the build wrote, in a fixed order, except the worker itself and
// the manifest about to be deleted.
const hash = createHash("sha256");
const files = readdirSync(DIST, { recursive: true, withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => join(d.parentPath ?? d.path, d.name).slice(DIST.length + 1))
  .filter((f) => f !== "sw.js" && !f.startsWith(".vite"))
  .sort();
for (const f of files) hash.update(f).update("\0").update(readFileSync(join(DIST, f)));
const build = hash.digest("hex").slice(0, 12);

fill("BUILD", build);
writeFileSync(swPath, sw);
rmSync(join(DIST, ".vite"), { recursive: true, force: true });
console.log(`sw: release ${build}, hashed over ${files.length} files`);
