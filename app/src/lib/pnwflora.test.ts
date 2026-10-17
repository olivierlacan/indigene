// The Flora of the PNW Checklist join. The fixture copies the shape of the
// checklist's tables and the herbaria's county list, with the cases that broke
// a first reading: a printed name that is formally a synonym, a herbarium name
// newer than the checklist, and a county list with counties east of the crest.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { checklistRows, lookup, readTsv, toCsv } from "../../scripts/_pnwflora.mjs";

const tsv = (rows: string[][]) => rows.map((r) => r.join("\t")).join("\n");

const pnwflora = readTsv(
  tsv([
    ["NameRank", "Family", "ScientificName", "NameStatus", "TaxonName", "Origin", "Endemic", "Extirpated", "WaifOccasional", "Peripheral", "Excluded"],
    ["genus", "Berberidaceae", "Mahonia", "", "Mahonia", "N", "N", "N", "N", "N", "N"],
    ["species", "Berberidaceae", "Berberis aquifolium", "synonym", "Mahonia aquifolium", "N", "N", "N", "N", "N", "N"],
    ["infraspecies", "Urticaceae", "Urtica dioica ssp. gracilis", "", "Urtica dioica ssp. gracilis", "N", "N", "N", "N", "N", "N"],
    ["species", "Araliaceae", "Hedera helix", "", "Hedera helix", "I", "N", "N", "N", "N", "N"],
    ["species", "Asteraceae", "Achillea millefolium", "", "Achillea millefolium", "B", "N", "N", "N", "N", "N"],
  ]),
);
const synonymy = readTsv(
  tsv([
    ["ScientificName", "Accepted", "NameStatus", "TaxonName"],
    ["Berberis aquifolium", "N", "synonym", "Mahonia aquifolium"],
    ["Urtica gracilis", "N", "synonym", "Urtica dioica ssp. gracilis"],
    ["Hedera canariensis", "N", "misapplied", "Hedera helix"],
  ]),
);
const counties = readTsv(
  tsv([
    ["Scientific Name", "Counties"],
    ["Berberis aquifolium", "King, Lane, Spokane"],
    ["Urtica gracilis", "Whatcom"],
    ["Hedera helix", "Multnomah, King"],
    ["Hedera helix ssp. helix", "Pierce"],
  ]),
);
const rows = checklistRows({ pnwflora, synonymy, counties, westCounties: ["King", "Lane", "Whatcom", "Multnomah", "Pierce"] });

describe("checklistRows", () => {
  it("keeps species and infraspecies, not genera", () => {
    expect(rows.map((r: { name: string }) => r.name)).toEqual([
      "Achillea millefolium",
      "Berberis aquifolium",
      "Hedera helix",
      "Urtica dioica ssp. gracilis",
    ]);
  });

  it("spells out the origin codes", () => {
    expect(lookup(rows, "Hedera helix").origin).toBe("introduced");
    expect(lookup(rows, "Achillea millefolium").origin).toBe("both");
  });

  it("counts only counties west of the crest", () => {
    expect(lookup(rows, "Berberis aquifolium").westCounties).toBe(2);
  });

  it("puts a newer herbarium name through the synonym table", () => {
    expect(lookup(rows, "Urtica dioica ssp. gracilis").westCounties).toBe(1);
  });

  it("rolls an infraspecies' counties up to its species", () => {
    expect(lookup(rows, "Hedera helix").westCounties).toBe(3);
  });

  it("finds a row by its database key or a synonym", () => {
    expect(lookup(rows, "Mahonia aquifolium")?.name).toBe("Berberis aquifolium");
    expect(lookup(rows, "Urtica gracilis")?.name).toBe("Urtica dioica ssp. gracilis");
  });

  it("doesn't follow a misapplied name", () => {
    expect(lookup(rows, "Hedera canariensis")).toBeNull();
  });
});

describe("toCsv", () => {
  it("quotes a cell with a comma and joins lists", () => {
    const csv = toCsv([{ ...lookup(rows, "Hedera helix"), family: "Araliaceae, ivy" }]);
    expect(csv.split("\n")[1]).toBe('Hedera helix,"Araliaceae, ivy",introduced,,,,,,3,');
  });
});
