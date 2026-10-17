// The Atlas of Florida Plants reader (`scripts/_atlas.mjs`). The fixture uses
// the real cases that shaped the rules: a species the Atlas names only by its
// varieties, a variety whose sibling is not native, and tropical sage.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { atlasVerdict, indexAtlas, parseCsv } from "../../scripts/_atlas.mjs";

const csv = `plant_id,scientific_name,common_name,native
1,Quercus virginiana,"VIRGINIA LIVE OAK, LIVE OAK",Y
2,Muhlenbergia capillaris var. capillaris,HAIRAWNMUHLY,Y
3,Muhlenbergia capillaris var. filipes,PURPLE MUHLY,Y
4,Sophora tomentosa var. occidentalis,YELLOW NECKLACEPOD,N
5,Sophora tomentosa var. truncata,YELLOW NECKLACEPOD,Y
6,Salvia coccinea,TROPICAL SAGE,N
7,Lantana camara,LANTANA,N
8,Lantana involucrata,BUTTONSAGE,Y
9,Iris hexagona,"DIXIE IRIS ""PRAIRIE"" IRIS",
`;
const index = indexAtlas(parseCsv(csv));
const v = (latin: string) => atlasVerdict(index, latin).verdict;

describe("parseCsv", () => {
  it("keeps commas and doubled quotes inside quoted fields", () => {
    const rows = parseCsv(csv);
    expect(rows[0].common_name).toBe("VIRGINIA LIVE OAK, LIVE OAK");
    expect(rows[8].common_name).toBe('DIXIE IRIS "PRAIRIE" IRIS');
    expect(rows).toHaveLength(9);
  });
});

describe("atlasVerdict", () => {
  it("answers an exact name", () => {
    expect(v("Quercus virginiana")).toBe("NATIVE");
    expect(v("Salvia coccinea")).toBe("NOT_NATIVE");
  });

  it("answers a binomial from its varieties when that is all there is", () => {
    expect(v("Muhlenbergia capillaris")).toBe("NATIVE");
  });

  it("calls a binomial MIXED when its varieties disagree", () => {
    expect(v("Sophora tomentosa")).toBe("MIXED");
  });

  it("never lets a sibling variety speak for ours", () => {
    expect(v("Sophora tomentosa var. truncata")).toBe("NATIVE");
    expect(v("Muhlenbergia capillaris var. sericea")).toBe("ABSENT");
  });

  it("does not let one species answer for its genus", () => {
    expect(v("Lantana depressa")).toBe("ABSENT");
  });

  it("says UNKNOWN when the Atlas leaves the status blank", () => {
    expect(v("Iris hexagona")).toBe("UNKNOWN");
  });
});
