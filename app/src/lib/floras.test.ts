// The regional checklists `npm run floras` reads. Each fixture copies the shape
// of one download, with the cases that broke a first reading: an FQA name with
// its older names after a semicolon, a Pennsylvania status with an asterisk,
// the BSBI's archaeophytes, a New Zealand synonym, Auckland's extinct taxa, and
// a species whose varieties disagree.
import { describe, expect, it } from "vitest";
import {
  aucklandRows,
  aucklandVerdict,
  bsbiRows,
  bsbiVerdict,
  fqaRows,
  fqaSynonym,
  fqaVerdict,
  indexRows,
  lookup,
  norm,
  nzRows,
  nzVerdict,
  paRows,
  paVerdict,
  // @ts-expect-error — a plain .mjs build script, no type declarations.
} from "../../scripts/_floras.mjs";

type Row = { name: string; origin: string; synonyms: string[] };

describe("fqaRows", () => {
  const doc = {
    data: [
      ["Michigan"],
      ["2014"],
      ["Reznicek et al. 2014."],
      [],
      ["Total Species:", 3],
      ["Scientific Name", "Family", "Acronym", "Native?", "C"],
      ["Eutrochium maculatum; eupatorium m.", "Asteraceae", "EUTMAC", "native", "4"],
      ["Cornus sericea; c. stolonifera", "Cornaceae", "CORSER", "native", "2"],
      ["Alliaria petiolata", "Brassicaceae", "ALLPET", "non-native", "0"],
      ["Carex", "Cyperaceae", "CAREX", "native", "0"],
    ],
  };
  const rows: Row[] = fqaRows(doc);

  it("reads the rows under the header, species only", () => {
    expect(rows.map((r) => r.name)).toEqual(["Eutrochium maculatum", "Cornus sericea", "Alliaria petiolata"]);
  });

  it("spells out the older names after the semicolon", () => {
    expect(rows[0].synonyms).toEqual(["Eupatorium maculatum"]);
    expect(rows[1].synonyms).toEqual(["Cornus stolonifera"]);
    expect(fqaSynonym("Packera aurea", "senecio aureus")).toBe("Senecio aureus");
  });

  it("calls non-native introduced, and a missing row absent", () => {
    expect(rows.map(fqaVerdict)).toEqual(["native", "native", "introduced"]);
    expect(fqaVerdict(null)).toBe("absent");
  });
});

describe("paRows", () => {
  const rows: Row[] = paRows({
    data: [
      { Sciname: "Aesculus flava", ConceptAlt: " = Aesculus octandra", Nativity: "Native*" },
      { Sciname: "Aesculus glabra var. glabra", ConceptAlt: " < included in Aesculus glabra", Nativity: "Native" },
      { Sciname: "Echinacea purpurea", ConceptAlt: " = Echinacea purpurea", Nativity: "Introduced" },
      { Sciname: "Hypothetica dubia", ConceptAlt: "", Nativity: "Uncertain" },
    ],
  });

  it("keeps an older name only where it is the same plant", () => {
    expect(rows.map((r) => r.synonyms)).toEqual([["Aesculus octandra"], [], [], []]);
  });

  it("reads past the asterisk", () => {
    expect(rows.map(paVerdict)).toEqual(["native", "native", "introduced", "uncertain"]);
  });
});

describe("bsbiRows", () => {
  const status = [
    { ddbid: "a.1", statusIE: "native" },
    { ddbid: "a.2", statusIE: "archaeophyte" },
    { ddbid: "a.3", statusIE: "absent" },
    { ddbid: "a.4", statusIE: "native or alien" },
  ];
  const names = [
    { ddbidOrig: "a.1", taxonName: "Euonymus europaeus", canonical: "Euonymus europaeus" },
    { ddbidOrig: "a.2", taxonName: "Euphorbia helioscopia", canonical: "Euphorbia helioscopia" },
    { ddbidOrig: "a.3", taxonName: "Thymus serpyllum", canonical: "Thymus serpyllum" },
    { ddbidOrig: "a.4", taxonName: "Mentha × piperita", canonical: "Mentha x piperita" },
  ];

  it("reads one country's column, and an archaeophyte is introduced", () => {
    expect(bsbiRows(status, names, "statusIE").map(bsbiVerdict)).toEqual(["native", "introduced", "absent", "uncertain"]);
  });
});

describe("nzRows", () => {
  const row = (o: Record<string, string>) => ({ TaxonRank: "species", IsCurrent: "true", Origin: "", Occurrence: "", CurrentNameId: "", ...o });
  const rows: Row[] = nzRows([
    row({ NameId: "1", NamePart: "Didymocheton spectabilis", Origin: "Endemic", Occurrence: "Wild" }),
    row({ NameId: "2", NamePart: "Dysoxylum spectabile", IsCurrent: "false", CurrentNameId: "1" }),
    row({ NameId: "3", NamePart: "Ulex europaeus", Origin: "Exotic", Occurrence: "Wild" }),
    row({ NameId: "4", NamePart: "Lost endemica", Origin: "Endemic", Occurrence: "Extinct" }),
    row({ NameId: "5", NamePart: "Dysoxylum", TaxonRank: "genus", Origin: "Endemic" }),
  ]);

  it("hangs each old name off the current one", () => {
    expect(rows[0]).toEqual({ name: "Didymocheton spectabilis", origin: "Endemic, Wild", synonyms: ["Dysoxylum spectabile"] });
    expect(rows).toHaveLength(3);
  });

  it("calls an extinct endemic absent", () => {
    expect(rows.map(nzVerdict)).toEqual(["native", "introduced", "absent"]);
  });
});

describe("aucklandRows", () => {
  const sheet = [
    [["A", "Short ID"], ["D", "Scientific Name"], ["H", "Umbrella Category"]],
    [["A", "CST1"], ["D", "Acaena anserinifolia "], ["H", "Not Threatened"]],
    [["D", "Abrodictyum caudatum"], ["H", "Threatened"]],
    [["A", "CST2"], ["D", "Gone forevera"], ["H", "Extinct"]],
  ];

  it("finds its columns by name, and gone from Auckland is absent", () => {
    const rows: Row[] = aucklandRows(sheet);
    expect(rows.map((r) => r.name)).toEqual(["Acaena anserinifolia", "Abrodictyum caudatum", "Gone forevera"]);
    expect(rows.map(aucklandVerdict)).toEqual(["native", "native", "absent"]);
  });
});

describe("lookup", () => {
  const index = indexRows([
    { name: "Schizachyrium scoparium var. divergens", origin: "Introduced", synonyms: [] },
    { name: "Schizachyrium scoparium var. scoparium", origin: "Native", synonyms: [] },
    { name: "Alectryon excelsus subsp. excelsus", origin: "Native", synonyms: [] },
    { name: "Alectryon excelsus subsp. grandis", origin: "Native", synonyms: [] },
    { name: "Cornus sericea", origin: "Native", synonyms: ["Cornus stolonifera"] },
    { name: "Sambucus nigra", origin: "Native", synonyms: [] },
  ]);

  it("finds a name, its synonym, and either spelling of subspecies", () => {
    expect(lookup(index, "Cornus stolonifera", paVerdict)?.name).toBe("Cornus sericea");
    expect(lookup(index, "Alectryon excelsus ssp. grandis", paVerdict)?.name).toBe("Alectryon excelsus subsp. grandis");
    expect(norm("Mentha × piperita")).toBe(norm("Mentha x piperita"));
  });

  it("falls back from a subspecies to its species", () => {
    expect(lookup(index, "Sambucus nigra subsp. canadensis", paVerdict)?.name).toBe("Sambucus nigra");
  });

  it("takes a species' varieties only when they agree", () => {
    expect(lookup(index, "Alectryon excelsus", paVerdict)).not.toBeNull();
    expect(lookup(index, "Schizachyrium scoparium", paVerdict)).toBeNull();
  });
});
