// `npm run native-evidence` — reduce the committed WCVP checks into the small
// file the plant page reads, so every plant can show what backs "native here".
//
// ## Why the page needs this at all
//
// A plant page has always carried `basis` — the authority a row was written
// from. That is a citation, and it is the right one, but it is a *sentence
// somebody typed*. It cannot go stale visibly, and a reader has no way to tell
// whether anyone has checked it since.
//
// `npm run native:check` re-asks Kew's World Checklist about every row in a
// region and commits the answer with a date (`data/sources/wcvp/`). This turns
// that into evidence the reader can see: checked against a named authority, on
// a date, with the disagreements shown rather than hidden.
//
// ## Why it stores the disagreements and not the agreements
//
// 578 rows, 11 of which WCVP does not confirm. Shipping a verdict per plant
// would be ~18 KB for a file that is 98% the same value, on an app whose whole
// download is measured in tens of kilobytes.
//
// So a region records the date it was checked, how many rows were checked, and
// **only the rows that did not come back NATIVE**. A plant in a checked region
// that is not in that list is confirmed — which is the same information, at a
// twentieth of the size.
//
// ## What it does not do
//
// It does not decide anything. A row WCVP won't confirm still ships: a
// disagreement between a world checklist and a regional flora is editorial (see
// `data/sources/wcvp/README.md`), and the page says both rather than picking.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../../data/sources/wcvp/", import.meta.url));
const OUT = fileURLToPath(new URL("../src/data/native-evidence.json", import.meta.url));

// The area each region was checked against, in words a reader can place —
// `TDWG:PEN` means nothing to anybody outside a herbarium. Where the area is
// coarser than the region, the words say so, because that is the honest
// strength of the check and hiding it would make a weak check read as a strong
// one. These are English; `locales/fr.ts` carries the French.
// The area each region was checked against, in words a reader can place —
// `TDWG:PEN` means nothing to anybody outside a herbarium. Both languages live
// here rather than in `locales/`, because these are a property of the check
// (which places were asked about), not interface copy.
//
// Where the area is coarser than the region the words still name it plainly;
// the page adds the caveat, so a weak check never reads as a strong one.
const AREA_WORDS = {
  "mid-atlantic": { en: "Pennsylvania and the nine states around it", fr: "la Pennsylvanie et les neuf États voisins" },
  "north-michigan": { en: "Michigan", fr: "le Michigan" },
  pnw: { en: "Washington and Oregon", fr: "Washington et l'Oregon" },
  "ca-south-coast": { en: "California", fr: "la Californie" },
  "ca-central-coast": { en: "California", fr: "la Californie" },
  "florida-central": { en: "Florida", fr: "la Floride" },
  "florida-south": { en: "Florida", fr: "la Floride" },
  ireland: { en: "the island of Ireland", fr: "l'île d'Irlande" },
  "france-atlantic": { en: "France", fr: "France" },
  "france-continental": { en: "France", fr: "France" },
  "france-mediterranean": { en: "France and Corsica", fr: "France et Corse" },
  "france-alpine": { en: "France", fr: "France" },
};

// Whether the area is the region itself or something wider. A reader deserves
// to know that "native in California" is a weaker statement about a Los Angeles
// garden than "native in Michigan" is about a Petoskey one.
const COARSE = new Set([
  "ca-south-coast",
  "ca-central-coast",
  "florida-central",
  "florida-south",
  "france-atlantic",
  "france-continental",
  "france-mediterranean",
  "france-alpine",
]);

/** WCVP's verdict, reduced to the four cases the page has words for. */
function reason(verdict) {
  const v = verdict.toUpperCase();
  if (v === "INTRODUCED") return "introduced";
  if (v === "ABSENT") return "absent";
  if (v === "NO-MATCH") return "unmatched";
  return "inconclusive";
}

const regions = {};
if (!existsSync(SRC)) {
  console.error("no WCVP checks yet — run `npm run native:check -- --region <id>` first");
  process.exit(1);
}
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".json")).sort()) {
  const doc = JSON.parse(readFileSync(SRC + file, "utf8"));
  const id = doc.region ?? file.slice(0, -5);
  const unconfirmed = {};
  for (const row of doc.rows ?? []) {
    if (String(row.verdict).toUpperCase() !== "NATIVE") unconfirmed[row.id] = reason(row.verdict);
  }
  regions[id] = {
    area: AREA_WORDS[id] ?? { en: id, fr: id },
    coarse: COARSE.has(id),
    checked: String(doc.ranAt).slice(0, 10),
    rows: (doc.rows ?? []).length,
    unconfirmed,
  };
}

const out = {
  source: "World Checklist of Vascular Plants (WCVP), Royal Botanic Gardens Kew",
  license: "CC BY 4.0",
  url: "https://powo.science.kew.org/",
  note:
    "Only the rows WCVP did not confirm are listed. A plant in a checked region that is absent from `unconfirmed` came back native.",
  regions,
};
writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);

const total = Object.values(regions).reduce((n, r) => n + r.rows, 0);
const flagged = Object.values(regions).reduce((n, r) => n + Object.keys(r.unconfirmed).length, 0);
console.log(
  `native evidence: ${Object.keys(regions).length} regions, ${total} rows checked, ${flagged} not confirmed → src/data/native-evidence.json`,
);
