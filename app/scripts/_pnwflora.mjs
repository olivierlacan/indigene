// Reading the Flora of the Pacific Northwest Checklist (Burke Museum, UW), the
// Consortium of Pacific Northwest Herbaria's county list and OregonFlora's
// checklist (Oregon State University): pure, no network, so
// `src/lib/pnwflora.test.ts` can pin it. `pnw-checklist.mjs` does the asking.

/** A tab-delimited file with one header row and no quoting, as both sources write. */
export function readTsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const cols = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const parts = line.split("\t");
    return Object.fromEntries(cols.map((c, i) => [c, (parts[i] ?? "").trim()]));
  });
}

/**
 * A comma-separated file with a header row, quoting as RFC 4180 does: a quoted
 * cell may hold commas, newlines and doubled quotes. OregonFlora's checklist is
 * one ("vol2, pg72").
 */
export function readCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^\ufeff/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') (cell += '"'), i++;
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") row.push(cell), (cell = "");
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell), rows.push(row), (row = []), (cell = "");
    } else cell += ch;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  const [head, ...body] = rows.filter((r) => r.some((c) => c.trim()));
  return body.map((r) => Object.fromEntries(head.map((c, i) => [c.trim(), (r[i] ?? "").trim()])));
}

/**
 * OregonFlora's checklist, one row per accepted taxon: its origin as the
 * checklist words it (`native`, `exotic, naturalized`, `exotic, not
 * naturalized`, `native and exotic`, `uncertain`) and the names it lists as
 * synonyms. A misapplied name is left out: it was someone else's plant.
 */
export function oregonfloraRows(checklist) {
  const synonyms = new Map();
  for (const r of checklist) {
    if (r.Name_Status !== "Synonym") continue;
    if (!synonyms.has(r.Accepted_Name)) synonyms.set(r.Accepted_Name, new Set());
    synonyms.get(r.Accepted_Name).add(r.Scientific_name);
  }
  return checklist
    .filter((r) => r.Name_Status === "Accepted")
    .map((r) => ({
      name: r.Scientific_name,
      family: r.Family,
      origin: r.Origin,
      note: r.Taxonomic_Note,
      synonyms: [...(synonyms.get(r.Scientific_name) ?? [])].sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
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

/**
 * The row a name lands on: itself, the accepted name it is a synonym of, or —
 * for a species — the one row its subspecies are synonyms of. OregonFlora lists
 * *Frangula purshiana* ssp. *purshiana* under *Rhamnus purshiana*, but never
 * the bare species name.
 */
export function lookup(rows, name) {
  const want = name.replace(/\bsubsp\./, "ssp.");
  const exact = rows.find((r) => r.name === want) ?? rows.find((r) => r.synonyms.includes(want));
  if (exact || want.split(" ").length !== 2) return exact ?? null;
  // Only when the subspecies all point one way: *Cornus sericea*'s are split
  // between *C. occidentalis* and *C. stolonifera*, and picking one would be a guess.
  const via = rows.filter((r) => r.synonyms.some((s) => s.startsWith(`${want} `)));
  return via.length === 1 ? via[0] : null;
}

const cell = (v) => {
  const s = Array.isArray(v) ? v.join("; ") : typeof v === "boolean" ? (v ? "Y" : "") : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const OREGONFLORA_COLUMNS = ["name", "family", "origin", "note", "synonyms"];

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

/** A committed file: one header, one row per taxon. */
export function toCsv(rows, columns = CSV_COLUMNS) {
  return `${[columns.join(","), ...rows.map((r) => columns.map((c) => cell(r[c])).join(","))].join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Verdicts: what each checklist says about one plant, in the five words the
// plant page has sentences for. Name differences are not verdicts — a row the
// checklist files under another name is still `native` there.

/** `native`, `introduced`, `both`, `uncertain` or `absent`, from the Burke checklist. */
export function burkeVerdict(row) {
  if (!row || row.excluded) return "absent";
  if (row.origin === "native") return "native";
  if (row.origin === "introduced") return "introduced";
  if (row.origin === "both") return "both";
  return "uncertain";
}

/** The same five, from OregonFlora's wording ("exotic, naturalized" is introduced). */
export function oregonfloraVerdict(row) {
  if (!row) return "absent";
  if (row.origin === "native") return "native";
  if (row.origin === "native and exotic") return "both";
  if (row.origin.startsWith("exotic")) return "introduced";
  return "uncertain";
}

/**
 * Both checklists' verdicts on one name. `reviewed` is the hand-kept table of
 * names a checklist draws differently ({ burke: "Rubus nutkanus" }): the row is
 * looked up under that name instead, and the caller checks it still exists.
 */
export function floraVerdicts(latin, { burke, oregonflora }, reviewed = {}) {
  const find = (rows, name) => lookup(rows, name) ?? lookup(rows, name.split(" ").slice(0, 2).join(" "));
  const b = reviewed.burke ? lookup(burke, reviewed.burke) : find(burke, latin);
  const o = reviewed.oregonflora ? lookup(oregonflora, reviewed.oregonflora) : find(oregonflora, latin);
  return {
    burke: { as: b?.name ?? null, verdict: burkeVerdict(b), westCounties: b?.westCounties ?? 0 },
    oregonflora: { as: o?.name ?? null, verdict: oregonfloraVerdict(o) },
  };
}

/** Read one of the committed CSVs back into rows `lookup` understands. */
export function readCommitted(text) {
  return readCsv(text).map((r) => ({
    ...r,
    synonyms: r.synonyms ? r.synonyms.split("; ") : [],
    westCounties: Number(r.westCounties ?? 0),
    excluded: r.excluded === "Y",
  }));
}
