// Build the native-plant registry from the catalog. The registry is a projection
// of the regional plant lists onto identity fields (names, aliases, external
// keys), deduplicated so each taxon is one entry keyed by accepted scientific
// name. It stays in the repo as a generated, reviewable artifact; curated
// identifiers are merged in from data/registry.overrides.json.
//
//   node --experimental-strip-types scripts/build-registry.ts
//
// Writes:
//   src/data/registry.ts                        (bundled, type-checked)
//   public/registry/native-plant-registry.json  (static, hostable, reusable)
//
// Imports the region data files directly (they carry only `import type`, erased
// by type-stripping) rather than regions.ts, whose value imports are extension-
// less and wouldn't resolve under Node.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { REGION as MID_ATLANTIC, SEED_RAW as MID_ATLANTIC_SEED } from "../src/data/plants.mid-atlantic.ts";
import { REGION as PNW, SEED_RAW as PNW_SEED } from "../src/data/plants.pnw.ts";
import { REGION as FLORIDA, SEED_RAW as FLORIDA_SEED } from "../src/data/plants.florida.ts";
import { REGION as FLORIDA_SOUTH, SEED_RAW as FLORIDA_SOUTH_SEED } from "../src/data/plants.florida-south.ts";
import type { RegistryEntry } from "../src/types.ts";
import type { RawPlant } from "../src/data/region.ts";
import type { RegionMeta } from "../src/data/region.ts";

const REGIONS: { meta: RegionMeta; seed: RawPlant[] }[] = [
  { meta: MID_ATLANTIC, seed: MID_ATLANTIC_SEED },
  { meta: PNW, seed: PNW_SEED },
  { meta: FLORIDA, seed: FLORIDA_SEED },
  { meta: FLORIDA_SOUTH, seed: FLORIDA_SOUTH_SEED },
];
const REGION_ORDER = REGIONS.map((r) => r.meta.id);

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** "Oregon White Oak (Garry Oak)" → ["Oregon White Oak", "Garry Oak"]; also
 *  splits "A / B" forms. Display order preserved, primary first. */
function commonNames(common: string): string[] {
  const parens = [...common.matchAll(/\(([^)]+)\)/g)].map((m) => m[1].trim());
  const primary = common.replace(/\([^)]*\)/g, "").trim();
  const names = [...primary.split(/\s*\/\s*/), ...parens].map((s) => s.trim()).filter(Boolean);
  return [...new Set(names)];
}

type OverrideRow = {
  usdaSymbol?: string | null;
  gbifKey?: number | null;
  extraAliases?: string[];
  cultivarOf?: string | null;
};
const overridesPath = fileURLToPath(new URL("../src/data/registry.overrides.json", import.meta.url));
const overridesRaw = JSON.parse(readFileSync(overridesPath, "utf8")) as Record<string, OverrideRow>;
const overrides: Record<string, OverrideRow> = {};
for (const [k, v] of Object.entries(overridesRaw)) if (!k.startsWith("$")) overrides[k] = v;

// Merge every plant into a by-scientific-name map.
const bySci = new Map<string, RegistryEntry & { _aliasSet: Set<string> }>();
const warnings: string[] = [];

for (const { meta, seed } of REGIONS) {
  for (const p of seed as RawPlant[]) {
    const key = norm(p.latin);
    let e = bySci.get(key);
    if (!e) {
      e = {
        id: p.id,
        scientificName: p.latin.trim(),
        family: p.family,
        form: p.form,
        rank: /\s/.test(p.latin.trim()) ? "species" : "genus",
        commonNames: commonNames(p.common),
        aliases: [],
        usdaSymbol: null,
        gbifKey: null,
        cultivarOf: null,
        regions: [],
        _aliasSet: new Set<string>(),
      };
      bySci.set(key, e);
    } else {
      if (e.id !== p.id) warnings.push(`id conflict for ${p.latin}: ${e.id} vs ${p.id} (kept ${e.id})`);
      for (const cn of commonNames(p.common)) if (!e.commonNames.includes(cn)) e.commonNames.push(cn);
    }
    if (!e.regions.includes(meta.id)) e.regions.push(meta.id);
    for (const cn of e.commonNames) e._aliasSet.add(norm(cn));
    e._aliasSet.add(norm(p.latin));
  }
}

// Apply curated overrides, then finalize aliases/regions ordering.
for (const e of bySci.values()) {
  const ov = overrides[e.scientificName];
  if (ov) {
    if (ov.usdaSymbol !== undefined) e.usdaSymbol = ov.usdaSymbol;
    if (ov.gbifKey !== undefined) e.gbifKey = ov.gbifKey;
    if (ov.cultivarOf !== undefined) e.cultivarOf = ov.cultivarOf;
    for (const a of ov.extraAliases ?? []) e._aliasSet.add(norm(a));
  }
  e.aliases = [...e._aliasSet].sort();
  e.regions.sort((a, b) => REGION_ORDER.indexOf(a) - REGION_ORDER.indexOf(b));
}

const entries: RegistryEntry[] = [...bySci.values()]
  .map(({ _aliasSet, ...e }) => e)
  .sort((a, b) => a.scientificName.localeCompare(b.scientificName));

// Report ambiguous aliases (an alias shared by two taxa) so the author sees them.
const aliasCount = new Map<string, string[]>();
for (const e of entries)
  for (const a of e.aliases) aliasCount.set(a, [...(aliasCount.get(a) ?? []), e.id]);
const ambiguous = [...aliasCount].filter(([, ids]) => ids.length > 1);

const tsPath = fileURLToPath(new URL("../src/data/registry.ts", import.meta.url));
const header = `// GENERATED by scripts/build-registry.ts — do not edit by hand.
// Source: the regional plant lists (data/plants.*.ts), merged and keyed by
// accepted scientific name, plus curated data/registry.overrides.json.
// Regenerate: node --experimental-strip-types scripts/build-registry.ts
// Verify:     node --experimental-strip-types scripts/check-registry.ts
import type { RegistryEntry } from "../types";

export const REGISTRY: RegistryEntry[] = ${JSON.stringify(entries, null, 2)};
`;
writeFileSync(tsPath, header);

const jsonDir = fileURLToPath(new URL("../public/registry/", import.meta.url));
mkdirSync(jsonDir, { recursive: true });
const artifact = {
  schema: "native-plant-registry/0.1",
  identity: {
    localKey: "id (scientific-name slug, == catalog plant id)",
    anchor: "scientificName (accepted binomial)",
    external: ["usdaSymbol (USDA PLANTS)", "gbifKey (GBIF backbone usageKey)"],
    note: "External keys are null until reconciled; see registry.overrides.json.",
  },
  count: entries.length,
  entries,
};
writeFileSync(`${jsonDir}native-plant-registry.json`, JSON.stringify(artifact, null, 2) + "\n");

console.log(`Wrote ${entries.length} entries across ${REGION_ORDER.length} regions.`);
if (warnings.length) console.log("Warnings:\n  " + warnings.join("\n  "));
console.log(
  ambiguous.length
    ? `Ambiguous aliases (resolver returns 'ambiguous' for these): ${ambiguous.map(([a]) => a).join(", ")}`
    : "No ambiguous aliases.",
);
