// Reading the regional checklists `npm run floras` puts our rows to: pure, no
// network, so `src/lib/floras.test.ts` can pin it. `check-floras.mjs` does the
// asking. Each reader turns one source's download into the same small rows —
// `{ name, origin, synonyms }`, with `origin` in the source's own words — and
// each source's `verdict` reduces those words to the five the plant page has
// sentences for: native, introduced, both, uncertain, absent.

/**
 * A Floristic Quality Assessment database from universalFQA.org, as its
 * `/get/database/<id>` JSON: a few header rows (title, year, citation, totals),
 * then a column row starting "Scientific Name", then one row per taxon.
 */
export function fqaRows(doc) {
  const data = doc.data ?? [];
  const head = data.findIndex((r) => r[0] === "Scientific Name");
  if (head < 0) throw new Error("universalFQA: no 'Scientific Name' header row");
  const col = data[head].indexOf("Native?");
  return data
    .slice(head + 1)
    .filter((r) => r[0] && r[0].includes(" "))
    .map((r) => {
      const [name, ...others] = clean(r[0]).split(/\s*;\s*/);
      return { name, origin: String(r[col]).trim(), synonyms: others.map((o) => fqaSynonym(name, o)) };
    });
}

/**
 * The older names an FQA list prints after its own, lowercase and with the
 * shared parts cut to an initial: "Eutrochium maculatum; eupatorium m." is
 * *Eupatorium maculatum*, "Cornus sericea; c. stolonifera" *Cornus stolonifera*.
 */
export function fqaSynonym(name, short) {
  const ours = name.split(" ");
  const words = short.split(" ").map((w, i) => (/^[a-z]\.$/.test(w) && ours[i]?.toLowerCase().startsWith(w[0]) ? ours[i] : w));
  return words.map((w, i) => (i ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join(" ");
}

/** The citation an FQA database prints in its third header row. */
export const fqaCitation = (doc) => String(doc.data?.[2]?.[0] ?? "").trim();

export const fqaVerdict = (row) => (!row ? "absent" : row.origin === "native" ? "native" : row.origin === "non-native" ? "introduced" : "uncertain");

/**
 * The Pennsylvania Natural Heritage Program's vascular plant list, as the JSON
 * its page loads (`{ data: [{ Sciname, ConceptAlt, Nativity, … }] }`).
 * `ConceptAlt` maps each name to Rhoads & Block's *Plants of Pennsylvania*;
 * where the two are the same plant (`= Name`) the older name is kept as a
 * synonym, so a row filed under it still joins.
 */
export function paRows(doc) {
  return doc.data.map((r) => {
    const alt = String(r.ConceptAlt ?? "").trim().match(/^=\s*(.+)$/)?.[1];
    const name = clean(r.Sciname);
    return { name, origin: r.Nativity.trim(), synonyms: alt && clean(alt) !== name ? [clean(alt)] : [] };
  });
}

// An asterisk marks a case the list explains on its page ("Native*"); the
// status itself stands.
export const paVerdict = (row) => {
  if (!row) return "absent";
  const o = row.origin.replace(/\*$/, "");
  return o === "Native" ? "native" : o === "Introduced" ? "introduced" : "uncertain";
};

/**
 * The BSBI's Plant Atlas 2020 native statuses (Zenodo 11097371): `status.csv`
 * keyed by database id, `nameLookup.csv` giving each id its name. `column` is
 * the country: `statusIE` for the island of Ireland, `statusGB` for Britain.
 */
export function bsbiRows(statusRows, nameRows, column) {
  const status = new Map(statusRows.map((r) => [r.ddbid, r[column]]));
  return nameRows
    .filter((r) => status.has(r.ddbidOrig))
    .map((r) => {
      const name = clean(r.canonical || r.taxonName);
      const printed = clean(r.taxonName);
      return { name, origin: status.get(r.ddbidOrig), synonyms: printed !== name && !printed.includes("=") ? [printed] : [] };
    });
}

// Archaeophytes came with farming, neophytes after 1500: both introduced.
export const bsbiVerdict = (row) => {
  if (!row || row.origin === "absent") return "absent";
  if (row.origin === "native") return "native";
  if (row.origin === "archaeophyte" || row.origin === "neophyte" || row.origin === "alien") return "introduced";
  if (row.origin === "native or alien") return "uncertain";
  return /native × native/.test(row.origin) ? "native" : "uncertain";
};

/**
 * The Checklist of the New Zealand Flora (Allan Herbarium), one of its
 * tab-separated parts. Every name is a row; the current ones carry `Origin`
 * (Endemic, Non-endemic, Exotic, Uncertain) and `Occurrence` (Wild, Sometimes
 * present, Extinct, Cultivated), and the rest point at theirs through
 * `CurrentNameId` — which is where the synonyms come from.
 */
export function nzRows(tsv) {
  const current = new Map();
  const synonyms = new Map();
  for (const r of tsv) {
    if (!["species", "subsp.", "var.", "f."].includes(r.TaxonRank)) continue;
    if (r.IsCurrent === "true") current.set(r.NameId, r);
    else {
      if (!synonyms.has(r.CurrentNameId)) synonyms.set(r.CurrentNameId, new Set());
      synonyms.get(r.CurrentNameId).add(clean(r.NamePart));
    }
  }
  return [...current.values()]
    .filter((r) => r.Origin)
    .map((r) => {
      const name = clean(r.NamePart);
      const syn = [...(synonyms.get(r.NameId) ?? [])].filter((s) => s !== name).sort();
      return { name, origin: [r.Origin, r.Occurrence].filter(Boolean).join(", "), synonyms: syn };
    });
}

export const nzVerdict = (row) => {
  if (!row) return "absent";
  const [origin, occurrence] = row.origin.split(", ");
  if (occurrence === "Extinct") return "absent";
  if (origin === "Endemic" || origin === "Non-endemic") return "native";
  if (origin === "Exotic") return "introduced";
  return "uncertain";
};

/**
 * Auckland Council's conservation status list (TR2025/6), the "Species list"
 * sheet as `[column letter, value]` rows. Every taxon in it is indigenous to
 * the region; `Umbrella Category` says how it is doing, and "Extinct" means
 * gone from Auckland.
 */
export function aucklandRows(sheet) {
  const [head, ...body] = sheet;
  const at = (name) => head.find(([, v]) => v === name)?.[0];
  const [nameCol, catCol] = [at("Scientific Name"), at("Umbrella Category")];
  if (!nameCol || !catCol) throw new Error("Auckland list: no 'Scientific Name' / 'Umbrella Category' columns");
  return body
    .map((r) => Object.fromEntries(r))
    .filter((r) => r[nameCol])
    .map((r) => ({ name: clean(r[nameCol]), origin: String(r[catCol] ?? "").trim(), synonyms: [] }));
}

export const aucklandVerdict = (row) => (!row || row.origin === "Extinct" ? "absent" : "native");

// ---------------------------------------------------------------------------

/** A name as printed, with the spacing and entities a download carries. */
export function clean(name) {
  return String(name)
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** The form two names are compared in: lowercase, one spelling of each rank. */
export function norm(name) {
  return clean(name)
    .toLowerCase()
    .replace(/\bssp\./g, "subsp.")
    .replace(/\bsubsp\b(?!\.)/g, "subsp.")
    .replace(/\bvar\b(?!\.)/g, "var.")
    .replace(/×\s*/g, "x ")
    .replace(/\s+/g, " ");
}

/** Every name a source's rows answer to, accepted and synonym, as one map. */
export function indexRows(rows) {
  const byName = new Map();
  const bySynonym = new Map();
  for (const r of rows) {
    if (!byName.has(norm(r.name))) byName.set(norm(r.name), r);
    for (const s of r.synonyms) if (!bySynonym.has(norm(s))) bySynonym.set(norm(s), r);
  }
  return { rows, byName, bySynonym };
}

/**
 * The row a name lands on, or null. In order: the name itself; the name as a
 * synonym; for an infraspecies, its species (and an autonym, *X y* subsp. *y*,
 * is *X y*); for a species, its infraspecies — but only when they all say the
 * same thing, because picking one of two that disagree would be a guess.
 */
export function lookup(index, name, verdict) {
  const want = norm(name);
  const hit = index.byName.get(want) ?? index.bySynonym.get(want);
  if (hit) return hit;
  const parts = want.split(" ");
  if (parts.length > 2) return lookup(index, parts.slice(0, 2).join(" "), verdict);
  const infra = index.rows.filter((r) => norm(r.name).startsWith(`${want} `));
  if (!infra.length) return null;
  return new Set(infra.map(verdict)).size === 1 ? infra[0] : null;
}
