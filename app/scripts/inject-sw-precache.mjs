// Post-build step: embed this deploy's exact file list into the service
// worker, so the shell (index.html AND its hashed CSS/JS) is precached
// atomically per deploy. Without this, a backgrounded tab that re-fetches its
// stylesheet after a newer deploy has purged the old hash gets an unstyled
// page. The worker stays hand-written — this script only fills two
// placeholders: the precache list and a build id that versions the cache.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const dist = fileURLToPath(new URL("../dist", import.meta.url));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(dist)
  .map((f) => relative(dist, f).split(sep).join("/"))
  .filter((p) => p !== "sw.js" && !p.endsWith(".map"))
  .sort();

// Build id = hash of every precached file's path and content, so any change
// produces a new shell cache and an unchanged build reuses the old one.
const h = createHash("sha256");
for (const p of files) {
  h.update(p);
  h.update(readFileSync(join(dist, p)));
}
const buildId = h.digest("hex").slice(0, 12);

const swPath = join(dist, "sw.js");
const sw = readFileSync(swPath, "utf8");
if (!sw.includes('"%BUILD_ID%"') || !sw.includes('"%PRECACHE%"')) {
  throw new Error("sw.js is missing the %BUILD_ID% / %PRECACHE% placeholders");
}
writeFileSync(
  swPath,
  sw
    .replace('"%BUILD_ID%"', JSON.stringify(buildId))
    .replace('"%PRECACHE%"', JSON.stringify(files))
);
console.log(`sw.js: precaching ${files.length} files, build ${buildId}`);
