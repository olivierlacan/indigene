// Reading the Atlas of Florida Plants exports in `data/sources/atlas-florida/`:
// pure, no network, so `src/lib/atlas.test.ts` can pin it. `atlas-florida.mjs`
// does the checking and the shortlist.
//
// ## One verdict per name
//
// The Atlas names a plant at the rank it treats it — *Muhlenbergia capillaris*
// appears only as its three varieties — and we write most rows as a binomial.
// So a binomial is answered by the species row when there is one, and
// otherwise by its varieties and subspecies together:
//
//   | the Atlas has…                         | verdict    |
//   |----------------------------------------|------------|
//   | the exact name                         | its native |
//   | infraspecific rows only, all native    | NATIVE     |
//   | infraspecific rows only, all not       | NOT_NATIVE |
//   | infraspecific rows, some each way      | MIXED      |
//   | nothing in the region's counties       | ABSENT     |
//
// A row whose own name carries a variety (*Sophora tomentosa* var.
// *truncata*) is only ever answered by that variety: its sibling var.
// *occidentalis* is not native, and must not speak for it.

/** Rows of a CSV with a header line, as objects. Handles quoted fields. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') field += c, i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") row.push(field), (field = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field), rows.push(row), (row = []), (field = "");
    } else field += c;
  }
  if (field || row.length) row.push(field), rows.push(row);
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0]);
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
const binomial = (s) => norm(s).split(" ").slice(0, 2).join(" ");
const status = (native) => (native === "Y" ? "NATIVE" : native === "N" ? "NOT_NATIVE" : "UNKNOWN");

/** An index over one export: exact names, and every row under its binomial. */
export function indexAtlas(rows) {
  const exact = new Map();
  const byBinomial = new Map();
  for (const r of rows) {
    exact.set(norm(r.scientific_name), r);
    const b = binomial(r.scientific_name);
    if (!byBinomial.has(b)) byBinomial.set(b, []);
    byBinomial.get(b).push(r);
  }
  return { exact, byBinomial };
}

/**
 * What the Atlas says about one of our names.
 * @returns {{ verdict: string, rows: object[] }}
 */
export function atlasVerdict(index, latin) {
  const hit = index.exact.get(norm(latin));
  if (hit) return { verdict: status(hit.native), rows: [hit] };
  if (norm(latin).split(" ").length > 2) return { verdict: "ABSENT", rows: [] };
  const rows = index.byBinomial.get(binomial(latin)) ?? [];
  if (!rows.length) return { verdict: "ABSENT", rows };
  const seen = new Set(rows.map((r) => status(r.native)));
  return { verdict: seen.size === 1 ? [...seen][0] : "MIXED", rows };
}
