// Build the native-plant registry from the catalog. The registry is a projection
// of the regional plant lists onto identity fields (names, aliases, external
// identifiers), deduplicated so each taxon is one entry. The identity anchor is
// an external, globally-recognized id (IPNI, via reconciliation) carried as a
// CURIE in `primaryId`; our own catalog id lives in `identifiers.indigene`. It
// stays in the repo as a generated, reviewable artifact; curated external ids
// are merged in from data/registry.overrides.json (written by reconcile.mjs).
//
//   npm run registry:build
//
// Writes:
//   src/data/registry.ts                        (bundled, type-checked)
//   public/registry/native-plant-registry.json  (static, hostable, reusable)
//
// Plain JS + Vite's ssrLoadModule (via _load-ts.mjs) so it runs on any Node
// version without native TypeScript support.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";

// Identifier order in the output (stable diffs). indigene is always present;
// external schemes appear only when reconciled. ipni/wfo can anchor primaryId.
const SCHEME_ORDER = ["ipni", "wfo", "gbif", "usda", "itis", "wikidata", "indigene"];
const ANCHOR_ORDER = ["ipni", "wfo"];

const loader = await openLoader();
const REGIONS = [];
for (const id of ["mid-atlantic", "pnw", "florida", "florida-south"]) {
  const mod = await loader.load(`/src/data/plants.${id}.ts`);
  REGIONS.push({ meta: mod.REGION, seed: mod.SEED_RAW });
}
await loader.close();

const REGION_ORDER = REGIONS.map((r) => r.meta.id);
const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** "Oregon White Oak (Garry Oak)" → ["Oregon White Oak", "Garry Oak"]; also
 *  splits "A / B" forms. Display order preserved, primary first. */
function commonNames(common) {
  const parens = [...common.matchAll(/\(([^)]+)\)/g)].map((m) => m[1].trim());
  const primary = common.replace(/\([^)]*\)/g, "").trim();
  const names = [...primary.split(/\s*\/\s*/), ...parens].map((s) => s.trim()).filter(Boolean);
  return [...new Set(names)];
}

const overridesPath = fileURLToPath(new URL("../src/data/registry.overrides.json", import.meta.url));
const overridesRaw = JSON.parse(readFileSync(overridesPath, "utf8"));
const overrides = {};
for (const [k, v] of Object.entries(overridesRaw)) if (!k.startsWith("$")) overrides[k] = v;

// Merge every plant into a by-scientific-name map.
const bySci = new Map();
const warnings = [];

for (const { meta, seed } of REGIONS) {
  for (const p of seed) {
    const key = norm(p.latin);
    let e = bySci.get(key);
    if (!e) {
      e = {
        _id: p.id, // our catalog id → identifiers.indigene
        scientificName: p.latin.trim(),
        family: p.family,
        form: p.form,
        rank: /\s/.test(p.latin.trim()) ? "species" : "genus",
        commonNames: commonNames(p.common),
        cultivarOf: null,
        regions: [],
        _ext: {}, // external ids from overrides (ipni, wfo, gbif, usda, itis, wikidata)
        _aliasSet: new Set(),
      };
      bySci.set(key, e);
    } else {
      if (e._id !== p.id) warnings.push(`id conflict for ${p.latin}: ${e._id} vs ${p.id} (kept ${e._id})`);
      for (const cn of commonNames(p.common)) if (!e.commonNames.includes(cn)) e.commonNames.push(cn);
    }
    if (!e.regions.includes(meta.id)) e.regions.push(meta.id);
    for (const cn of e.commonNames) e._aliasSet.add(norm(cn));
    e._aliasSet.add(norm(p.latin));
  }
}

// Apply curated overrides (external identifiers, extra aliases, cultivar links).
for (const e of bySci.values()) {
  const ov = overrides[e.scientificName];
  if (ov) {
    for (const [scheme, val] of Object.entries(ov.identifiers ?? {}))
      if (val != null && val !== "" && scheme !== "indigene") e._ext[scheme] = String(val);
    if (ov.cultivarOf !== undefined) e.cultivarOf = ov.cultivarOf;
    for (const a of ov.extraAliases ?? []) e._aliasSet.add(norm(a));
  }
}

/** Assemble the final entry: order the identifier bag, derive the CURIE anchor. */
function finalize(e) {
  const bag = { ...e._ext, indigene: e._id };
  const identifiers = {};
  for (const s of SCHEME_ORDER) if (bag[s] != null && bag[s] !== "") identifiers[s] = String(bag[s]);
  const anchor = ANCHOR_ORDER.find((s) => identifiers[s]);
  return {
    primaryId: anchor ? `${anchor}:${identifiers[anchor]}` : null,
    scientificName: e.scientificName,
    family: e.family,
    form: e.form,
    rank: e.rank,
    identifiers,
    commonNames: e.commonNames,
    aliases: [...e._aliasSet].sort(),
    cultivarOf: e.cultivarOf,
    regions: [...e.regions].sort((a, b) => REGION_ORDER.indexOf(a) - REGION_ORDER.indexOf(b)),
  };
}

const entries = [...bySci.values()]
  .map(finalize)
  .sort((a, b) => a.scientificName.localeCompare(b.scientificName));

// Report ambiguous aliases (an alias shared by two taxa) so the author sees them.
const aliasCount = new Map();
for (const e of entries)
  for (const a of e.aliases) aliasCount.set(a, [...(aliasCount.get(a) ?? []), e.identifiers.indigene]);
const ambiguous = [...aliasCount].filter(([, ids]) => ids.length > 1);
const unreconciled = entries.filter((e) => !e.primaryId).length;

const tsPath = fileURLToPath(new URL("../src/data/registry.ts", import.meta.url));
const header = `// GENERATED by scripts/build-registry.mjs — do not edit by hand.
// Source: the regional plant lists (data/plants.*.ts), merged and keyed by
// accepted scientific name, plus curated data/registry.overrides.json.
// Regenerate: npm run registry:build   Verify: npm run registry:check   Fill ids: npm run reconcile
import type { RegistryEntry } from "../types";

export const REGISTRY: RegistryEntry[] = ${JSON.stringify(entries, null, 2)};
`;
writeFileSync(tsPath, header);

const jsonDir = fileURLToPath(new URL("../public/registry/", import.meta.url));
mkdirSync(jsonDir, { recursive: true });
const artifact = {
  schema: "native-plant-registry/0.2",
  identity: {
    primaryId: "CURIE anchor (scheme:accession), e.g. ipni:77123-1 — null until reconciled",
    anchorSchemes: ANCHOR_ORDER,
    identifiers: SCHEME_ORDER,
    note: "External identifiers are filled by scripts/reconcile.mjs; 'indigene' is our catalog id.",
  },
  count: entries.length,
  unreconciled,
  entries,
};
writeFileSync(`${jsonDir}native-plant-registry.json`, JSON.stringify(artifact, null, 2) + "\n");

console.log(`Wrote ${entries.length} entries across ${REGION_ORDER.length} regions (${unreconciled} unreconciled).`);
if (warnings.length) console.log("Warnings:\n  " + warnings.join("\n  "));
console.log(
  ambiguous.length
    ? `Ambiguous aliases (resolver returns 'ambiguous' for these): ${ambiguous.map(([a]) => a).join(", ")}`
    : "No ambiguous aliases.",
);
