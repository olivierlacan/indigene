// Registry logic, with no data import of its own — pure functions over a
// RegistryEntry[]. Kept data-free on purpose so it runs anywhere: the browser
// (via `lib/registry.ts`, which binds it to the bundled REGISTRY) and Node (the
// generator and `scripts/check-registry.mjs`, which pass the generated array in).
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
  /** our catalog id (identifiers.indigene) → entry — the registry↔catalog join. */
  byIndigene: Map<string, RegistryEntry>;
  /** primaryId CURIE → entry (only for reconciled entries). */
  byPrimary: Map<string, RegistryEntry>;
  /** normalized scientific name → entry (the exact, unambiguous name anchor). */
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
  const byIndigene = new Map<string, RegistryEntry>();
  const byPrimary = new Map<string, RegistryEntry>();
  const bySci = new Map<string, RegistryEntry>();
  const byAlias = new Map<string, RegistryEntry[]>();
  for (const e of entries) {
    const local = e.identifiers.indigene;
    if (local) byIndigene.set(local, e);
    if (e.primaryId) byPrimary.set(e.primaryId, e);
    bySci.set(normalizeName(e.scientificName), e);
    for (const a of e.aliases) {
      const list = byAlias.get(a) ?? [];
      if (!list.includes(e)) list.push(e);
      byAlias.set(a, list);
    }
  }
  return { entries, byIndigene, byPrimary, bySci, byAlias };
}

/** Get the registry entry for a catalog plant (by its `indigene` id / slug). */
export function entryForPlant(index: RegistryIndex, plantId: string): RegistryEntry | undefined {
  return index.byIndigene.get(plantId);
}

/** Get an entry by its `primaryId` CURIE (e.g. "ipni:77123-1"). */
export function entryByPrimaryId(index: RegistryIndex, curie: string): RegistryEntry | undefined {
  return index.byPrimary.get(curie);
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

/** Authoritative external links for an entry, from its identifier bag. A record
 *  link when the id is present; a name search as a graceful fallback so the link
 *  works before reconciliation. `powo` is derived from the IPNI id. */
export function deepLinks(entry: RegistryEntry): Record<string, string | null> {
  const ids = entry.identifiers;
  const sci = encodeURIComponent(entry.scientificName);
  return {
    ipni: ids.ipni ? `https://www.ipni.org/n/${ids.ipni}` : null,
    powo: ids.ipni ? `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${ids.ipni}` : null,
    wfo: ids.wfo ? `https://www.worldfloraonline.org/taxon/${ids.wfo}` : null,
    gbif: ids.gbif ? `https://www.gbif.org/species/${ids.gbif}` : `https://www.gbif.org/species/search?q=${sci}`,
    usda: ids.usda ? `https://plants.usda.gov/plant-profile/${ids.usda}` : null,
    itis: ids.itis
      ? `https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=${ids.itis}`
      : null,
    wikidata: ids.wikidata ? `https://www.wikidata.org/wiki/${ids.wikidata}` : null,
    inaturalist: `https://www.inaturalist.org/taxa/search?q=${sci}`,
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
  /** `indigene` ids whose external anchor isn't reconciled yet (primaryId null).
   *  Informational — the legitimate interim state before `npm run reconcile`. */
  unreconciled: string[];
}

/**
 * Integrity audit — the registry's equivalent of the wildlife dev-audit.
 * Verifies self-consistency (unique local ids, unique anchors, well-formed
 * CURIEs, resolvable cultivar links) and, given the catalog's coverage, that
 * every listed plant maps to exactly one entry in the regions that list it.
 * Ambiguous aliases and unreconciled anchors are surfaced separately.
 */
export function auditRegistry(entries: RegistryEntry[], coverage: CoverageItem[]): AuditResult {
  const issues: string[] = [];
  const index = buildIndex(entries);

  const seenLocal = new Set<string>();
  const seenPrimary = new Set<string>();
  const seenSci = new Set<string>();
  const unreconciled: string[] = [];

  for (const e of entries) {
    const local = e.identifiers.indigene;
    if (!local) {
      issues.push(`entry ${e.scientificName} has no indigene id`);
    } else {
      if (seenLocal.has(local)) issues.push(`duplicate indigene id: ${local}`);
      seenLocal.add(local);
    }
    if (e.primaryId) {
      if (!/^[a-z]+:.+/.test(e.primaryId)) issues.push(`primaryId not a CURIE: ${e.primaryId}`);
      if (seenPrimary.has(e.primaryId)) issues.push(`duplicate primaryId: ${e.primaryId}`);
      seenPrimary.add(e.primaryId);
    } else {
      unreconciled.push(local ?? e.scientificName);
    }
    const sci = normalizeName(e.scientificName);
    if (seenSci.has(sci)) issues.push(`duplicate scientific name: ${e.scientificName}`);
    seenSci.add(sci);
    if (e.cultivarOf && !index.byIndigene.has(e.cultivarOf))
      issues.push(`${local}: cultivarOf "${e.cultivarOf}" is not a registry indigene id`);
    if (!e.aliases.includes(sci)) issues.push(`${local}: aliases missing its own scientific name`);
  }

  for (const c of coverage) {
    const e = index.bySci.get(normalizeName(c.scientificName));
    if (!e) {
      issues.push(`plant ${c.regionId}/${c.plantId} (${c.scientificName}) has no registry entry`);
      continue;
    }
    if (e.identifiers.indigene !== c.plantId)
      issues.push(`plant ${c.plantId} maps to indigene id ${e.identifiers.indigene} (${c.scientificName})`);
    if (!e.regions.includes(c.regionId))
      issues.push(`${e.identifiers.indigene}: region ${c.regionId} lists it but entry.regions omits it`);
  }

  const ambiguousAliases: { alias: string; ids: string[] }[] = [];
  for (const [alias, hits] of index.byAlias)
    if (hits.length > 1)
      ambiguousAliases.push({ alias, ids: hits.map((e) => e.identifiers.indigene ?? e.scientificName) });

  return { issues, ambiguousAliases, unreconciled };
}
