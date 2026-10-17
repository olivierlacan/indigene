// Reading the Flora of the Pacific Northwest Checklist (Burke Museum, UW) and
// the Consortium of Pacific Northwest Herbaria's county list: pure, no network,
// so `src/lib/pnwflora.test.ts` can pin it. `pnw-checklist.mjs` does the asking.

/** A tab-delimited file with one header row and no quoting, as both sources write. */
export function readTsv(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const cols = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const parts = line.split("\t");
    return Object.fromEntries(cols.map((c, i) => [c, (parts[i] ?? "").trim()]));
  });
}

// The checklist's own codes, spelled out. `B` is a taxon with native and
// introduced populations both (yarrow); a `?` is the checklist unsure.
const ORIGIN = { N: "native", I: "introduced", B: "both", "N?": "native?", "I?": "introduced?" };
const yes = (v) => v === "Y";

/**
 * One row per species or infraspecies, facts only: its origin, the checklist's
 * flags, how many of `westCounties` have a specimen of it, and the names it has
 * also gone by (so a row filed under an older name still joins).
 *
 * A row's `name` is the one the checklist prints. Its database keys the taxon
 * by another (`TaxonName`) when the printed one is formally a synonym —
 * *Berberis aquifolium* is printed, *Mahonia aquifolium* is the key — so both
 * are kept, and the synonym table hangs off the key.
 *
 * The herbaria's names are newer than the checklist download, so each is put
 * through the synonym table before it is counted (*Urtica gracilis* is the
 * checklist's *U. dioica* ssp. *gracilis*). A species row counts the counties
 * of its infraspecies too.
 */
export function checklistRows({ pnwflora, synonymy, counties, westCounties }) {
  const west = new Set(westCounties);
  const synonyms = new Map();
  const acceptedOf = new Map();
  for (const s of synonymy) {
    if (s.Accepted === "Y" || s.ScientificName === s.TaxonName) continue;
    // A misapplied or ambiguous name is someone else's plant too; don't follow it.
    if (!/^(synonym|orthographic variant)$/.test(s.NameStatus)) continue;
    if (!synonyms.has(s.TaxonName)) synonyms.set(s.TaxonName, new Set());
    synonyms.get(s.TaxonName).add(s.ScientificName);
    acceptedOf.set(s.ScientificName, s.TaxonName);
  }
  const binomial = (n) => n.split(" ").slice(0, 2).join(" ");
  const seen = new Map();
  for (const r of counties) {
    const raw = r["Scientific Name"];
    const here = (r.Counties ?? "").split(/\s*,\s*/).filter((c) => west.has(c));
    const name = acceptedOf.get(raw) ?? raw;
    for (const key of new Set([name, binomial(name), binomial(raw)])) {
      if (!seen.has(key)) seen.set(key, new Set());
      for (const c of here) seen.get(key).add(c);
    }
  }
  const byTaxon = new Map();
  for (const r of pnwflora) {
    if (r.NameRank !== "species" && r.NameRank !== "infraspecies") continue;
    if (r.NameStatus && !/^(synonym|orthographic variant)$/.test(r.NameStatus)) continue;
    const prev = byTaxon.get(r.TaxonName);
    if (!prev || (prev.NameStatus && !r.NameStatus)) byTaxon.set(r.TaxonName, r);
  }
  return [...byTaxon.values()]
    .map((r) => {
      const aliases = new Set([...(synonyms.get(r.TaxonName) ?? []), r.TaxonName]);
      aliases.delete(r.ScientificName);
      const counted = new Set([...(seen.get(r.TaxonName) ?? []), ...(seen.get(r.ScientificName) ?? [])]);
      return {
        name: r.ScientificName,
        family: r.Family,
        origin: ORIGIN[r.Origin] ?? "",
        endemic: yes(r.Endemic),
        extirpated: yes(r.Extirpated),
        waif: yes(r.WaifOccasional),
        peripheral: yes(r.Peripheral),
        excluded: yes(r.Excluded),
        westCounties: counted.size,
        synonyms: [...aliases].sort(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The row a name lands on: itself, or the accepted name it is a synonym of. */
export function lookup(rows, name) {
  const want = name.replace(/\bsubsp\./, "ssp.");
  return (
    rows.find((r) => r.name === want) ??
    rows.find((r) => r.synonyms.includes(want)) ??
    null
  );
}

const cell = (v) => {
  const s = Array.isArray(v) ? v.join("; ") : typeof v === "boolean" ? (v ? "Y" : "") : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const CSV_COLUMNS = [
  "name",
  "family",
  "origin",
  "endemic",
  "extirpated",
  "waif",
  "peripheral",
  "excluded",
  "westCounties",
  "synonyms",
];

/** The committed file: one header, one row per taxon. */
export function toCsv(rows) {
  return `${[CSV_COLUMNS.join(","), ...rows.map((r) => CSV_COLUMNS.map((c) => cell(r[c])).join(","))].join("\n")}\n`;
}
