// Registry logic, with no data import of its own — pure functions over a
// RegistryEntry[]. Kept data-free on purpose so it runs anywhere: the browser
// (via `lib/registry.ts`, which binds it to the bundled REGISTRY) and Node (the
// generator and `scripts/check-registry.ts`, which pass the generated array in).
// This is what makes plant-first lookups reliable: one entry per taxon, and
// ambiguity surfaced rather than guessed.

import type { RegistryEntry } from "../types";

/** Lowercase, trim, collapse whitespace — the one normalization every name
 *  (query or stored alias) passes through, so matching is consistent. */
export function normalizeName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Cultivar/hybrid giveaways — a query carrying these is refused a straight-
 *  species match, the same guard the availability adapter uses. */
const CULTIVAR_MARKERS = /\bdwarf\b|'[^']+'|\bhybrid\b|\bcompacta\b|\bnana\b|\bvariegat/i;

export interface RegistryIndex {
  entries: RegistryEntry[];
  byId: Map<string, RegistryEntry>;
  /** normalized scientific name → entry (the exact, unambiguous anchor). */
  bySci: Map<string, RegistryEntry>;
  /** normalized alias → entries (>1 means the alias is ambiguous). */
  byAlias: Map<string, RegistryEntry[]>;
}

export type ResolveResult =
  | { kind: "match"; entry: RegistryEntry }
  | { kind: "ambiguous"; entries: RegistryEntry[] }
  | { kind: "cultivar" }
  | { kind: "none" };

export function buildIndex(entries: RegistryEntry[]): RegistryIndex {
  const byId = new Map<string, RegistryEntry>();
  const bySci = new Map<string, RegistryEntry>();
  const byAlias = new Map<string, RegistryEntry[]>();
  for (const e of entries) {
    byId.set(e.id, e);
    bySci.set(normalizeName(e.scientificName), e);
    for (const a of e.aliases) {
      const list = byAlias.get(a) ?? [];
      if (!list.includes(e)) list.push(e);
      byAlias.set(a, list);
    }
  }
  return { entries, byId, bySci, byAlias };
}

export function entryById(index: RegistryIndex, id: string): RegistryEntry | undefined {
  return index.byId.get(id);
}

/**
 * Resolve a free-text name (common or scientific) to a single entry — the
 * plant-first primitive. Exact scientific name wins; then a unique alias; an
 * alias shared by two taxa returns `ambiguous` (never a silent pick); a
 * cultivar-marked query is refused; no hit returns `none`.
 */
export function resolveName(index: RegistryIndex, name: string): ResolveResult {
  if (CULTIVAR_MARKERS.test(name)) return { kind: "cultivar" };
  const q = normalizeName(name);
  const sci = index.bySci.get(q);
  if (sci) return { kind: "match", entry: sci };
  const hits = index.byAlias.get(q);
  if (!hits || hits.length === 0) return { kind: "none" };
  if (hits.length === 1) return { kind: "match", entry: hits[0] };
  return { kind: "ambiguous", entries: hits };
}

/** Authoritative external links for an entry — usable today. When a numeric key
 *  is present it deep-links the record; otherwise it links a name search, so the
 *  link works before reconciliation. */
export function deepLinks(entry: RegistryEntry): {
  usdaPlants: string | null;
  gbif: string;
  powo: string;
} {
  const sci = encodeURIComponent(entry.scientificName);
  return {
    usdaPlants: entry.usdaSymbol
      ? `https://plants.usda.gov/plant-profile/${entry.usdaSymbol}`
      : null,
    gbif: entry.gbifKey
      ? `https://www.gbif.org/species/${entry.gbifKey}`
      : `https://www.gbif.org/species/search?q=${sci}`,
    powo: `https://powo.science.kew.org/results?q=${sci}`,
  };
}

/** One item of catalog coverage to check the registry against. */
export interface CoverageItem {
  regionId: string;
  plantId: string;
  scientificName: string;
}

export interface AuditResult {
  issues: string[];
  /** Aliases that resolve to more than one taxon — reported, not an error:
   *  the resolver returns `ambiguous` for these, which is correct behavior. */
  ambiguousAliases: { alias: string; ids: string[] }[];
}

/**
 * Integrity audit — the registry's equivalent of the wildlife dev-audit.
 * Verifies self-consistency (unique ids, resolvable cultivar links) and, given
 * the catalog's coverage, that every listed plant has exactly one matching
 * entry in the regions that list it. Ambiguous aliases are surfaced separately.
 */
export function auditRegistry(entries: RegistryEntry[], coverage: CoverageItem[]): AuditResult {
  const issues: string[] = [];
  const index = buildIndex(entries);

  const seenId = new Set<string>();
  const seenSci = new Set<string>();
  for (const e of entries) {
    if (seenId.has(e.id)) issues.push(`duplicate id: ${e.id}`);
    seenId.add(e.id);
    const sci = normalizeName(e.scientificName);
    if (seenSci.has(sci)) issues.push(`duplicate scientific name: ${e.scientificName}`);
    seenSci.add(sci);
    if (e.cultivarOf && !index.byId.has(e.cultivarOf))
      issues.push(`${e.id}: cultivarOf "${e.cultivarOf}" is not a registry id`);
    if (!e.aliases.includes(normalizeName(e.scientificName)))
      issues.push(`${e.id}: aliases missing its own scientific name`);
  }

  for (const c of coverage) {
    const e = index.bySci.get(normalizeName(c.scientificName));
    if (!e) {
      issues.push(`plant ${c.regionId}/${c.plantId} (${c.scientificName}) has no registry entry`);
      continue;
    }
    if (e.id !== c.plantId)
      issues.push(`plant ${c.plantId} maps to registry id ${e.id} (${c.scientificName})`);
    if (!e.regions.includes(c.regionId))
      issues.push(`${e.id}: region ${c.regionId} lists it but entry.regions omits it`);
  }

  const ambiguousAliases: { alias: string; ids: string[] }[] = [];
  for (const [alias, hits] of index.byAlias)
    if (hits.length > 1) ambiguousAliases.push({ alias, ids: hits.map((e) => e.id) });

  return { issues, ambiguousAliases };
}
