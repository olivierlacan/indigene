// Pin every animal in the wildlife catalog to its iNaturalist taxon id.
//
//   npm run wildlife:taxa            # resolve, write src/data/wildlife-taxa.json
//   npm run wildlife:taxa -- --check # resolve, and fail if the file disagrees
//
// The catalog stores scientific names, not ids (see `InatScope` in types.ts),
// and an animal's own page resolves its name at request time — one taxa call,
// then one sightings call. That is fine for one animal. A saved spot asks about
// every animal its plants feed at once, and a dozen name lookups before the one
// question that matters is a dozen requests iNaturalist didn't need to answer.
// So the names are resolved here, once, by the same `pickTaxon` the app uses,
// and the spot page sends a single `taxon_id=…` list.
//
// A name can be renamed out from under us (iNaturalist follows synonymy, we
// follow it later), which is why `--check` exists: run it and the diff says
// which ids moved.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";
import { openLoader } from "./_load-ts.mjs";

requireProxyAwareFetch("wildlife:taxa");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../src/data/wildlife-taxa.json");
/** iNaturalist asks for under 60 requests a minute; one a second is polite. */
const PACE_MS = 1100;
const check = process.argv.includes("--check");

const loader = await openLoader();
const { WILDLIFE } = await loader.load("/src/data/wildlife.ts");
const { buildTaxaUrl, pickTaxon } = await loader.load("/src/lib/inaturalist.ts");
await loader.close();

/** One taxa search, retried a few times: a long run of requests through a proxy
 *  drops the odd socket, and one dropped socket shouldn't cost the whole run. */
async function ask(url, tries = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`iNaturalist ${res.status} — ${url}`);
      return (await res.json())?.results;
    } catch (err) {
      if (i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * i));
    }
  }
}

const out = {};
const unresolved = [];
for (const w of WILDLIFE) {
  if (!w.inat) continue;
  const id = pickTaxon(await ask(buildTaxaUrl(w.inat.name, w.inat.iconic)), w.inat.name);
  if (id == null) unresolved.push(`${w.id} (${w.inat.name})`);
  else out[w.id] = id;
  await new Promise((r) => setTimeout(r, PACE_MS));
}

const json = `${JSON.stringify(out, null, 2)}\n`;
if (unresolved.length) console.warn(`Unresolved, left out: ${unresolved.join(", ")}`);

if (check) {
  const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  const changed = [...new Set([...Object.keys(prev), ...Object.keys(out)])].filter((k) => prev[k] !== out[k]);
  if (changed.length) {
    for (const k of changed) console.error(`${k}: ${prev[k] ?? "—"} → ${out[k] ?? "—"}`);
    process.exit(1);
  }
  console.log(`All ${Object.keys(out).length} taxon ids still match.`);
} else {
  writeFileSync(OUT, json);
  console.log(`Wrote ${Object.keys(out).length} taxon ids to src/data/wildlife-taxa.json`);
}
