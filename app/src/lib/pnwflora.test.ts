// The Flora of the PNW Checklist join. The fixture copies the shape of the
// checklist's tables and the herbaria's county list, with the cases that broke
// a first reading: a printed name that is formally a synonym, a herbarium name
// newer than the checklist, and a county list with counties east of the crest.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { checklistRows, floraVerdicts, lookup, oregonfloraRows, readCsv, readTsv, toCsv } from "../../scripts/_pnwflora.mjs";

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

// OregonFlora's export: quoted cells with commas in them, a version note in a
// header column of its own, and a species named only through its subspecies.
const oregonflora = oregonfloraRows(
  readCsv(
    [
      'Group,Family,Scientific_name,Name_Status,Accepted_Name,Taxonomic_Note,Origin,FloraPage,"OregonFlora Checklist version 2.4, May 26, 2026"',
      'Dicotyledons,Rhamnaceae,Rhamnus purshiana,Accepted,Rhamnus purshiana,,native,"vol2, pg72",',
      "Dicotyledons,Rhamnaceae,Frangula purshiana ssp. purshiana,Synonym,Rhamnus purshiana,,,,",
      "Dicotyledons,Rhamnaceae,Rhamnus alnifolia,Misapplied,Rhamnus purshiana,,,,",
      "Dicotyledons,Cornaceae,Cornus occidentalis,Accepted,Cornus occidentalis,,native,,",
      "Dicotyledons,Cornaceae,Cornus sericea ssp. occidentalis,Synonym,Cornus occidentalis,,,,",
      "Dicotyledons,Cornaceae,Cornus stolonifera,Accepted,Cornus stolonifera,,native,,",
      "Dicotyledons,Cornaceae,Cornus sericea ssp. stolonifera,Synonym,Cornus stolonifera,,,,",
      'Monocotyledons,Poaceae,Bromus tectorum,Accepted,Bromus tectorum,,"exotic, naturalized",,',
    ].join("\r\n"),
  ),
);

describe("oregonfloraRows", () => {
  it("reads a quoted origin with a comma in it", () => {
    expect(lookup(oregonflora, "Bromus tectorum").origin).toBe("exotic, naturalized");
  });

  it("finds a species through its subspecies' synonym", () => {
    expect(lookup(oregonflora, "Frangula purshiana")?.name).toBe("Rhamnus purshiana");
  });

  it("won't guess when the subspecies point two ways", () => {
    expect(lookup(oregonflora, "Cornus sericea")).toBeNull();
  });

  it("leaves a misapplied name out", () => {
    expect(lookup(oregonflora, "Rhamnus alnifolia")).toBeNull();
  });
});

describe("floraVerdicts", () => {
  const floras = { burke: rows, oregonflora };

  it("words each checklist's origin as one of five verdicts", () => {
    expect(floraVerdicts("Hedera helix", floras).burke.verdict).toBe("introduced");
    expect(floraVerdicts("Achillea millefolium", floras).burke.verdict).toBe("both");
    expect(floraVerdicts("Bromus tectorum", floras).oregonflora.verdict).toBe("introduced");
  });

  it("calls a plant a checklist doesn't list absent, not introduced", () => {
    expect(floraVerdicts("Hedera helix", floras).oregonflora).toEqual({ as: null, verdict: "absent" });
  });

  it("looks a reviewed name up under the checklist's own", () => {
    const v = floraVerdicts("Cornus sericea", floras, { oregonflora: "Cornus stolonifera" });
    expect(v.oregonflora).toEqual({ as: "Cornus stolonifera", verdict: "native" });
  });
});
