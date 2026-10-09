// A French plant paragraph shows only on the row it was translated from.
//
// The catalog's prose files are each written from one region's English, and a
// plain `"Salix caprea"` key once answered for every region's row of that
// taxon: a reader in Ireland, Michigan or the St. Lawrence was handed
// paragraphs written for another list — about 145 rows per field, "native
// here" notes and propagation how-tos included. `index.ts` now files every key
// under its region; these tests hold that line.
import { describe, expect, it } from "vitest";
import { REGIONS, loadPlants } from "../../lib/plants";
import { PROSE_FR } from "./index";

/** The fields that describe a plant row, as opposed to a look-alike's blurb. */
const PLANT_FIELDS = ["nativeNote", "careNote", "givesNote", "propagationNote", "supportNotes", "lookalikeNotes"] as const;

describe("French plant paragraphs", () => {
  it("are never filed under a key that answers for every region", () => {
    const shared = Object.entries(PROSE_FR)
      .filter(([key, prose]) => !key.includes("@") && PLANT_FIELDS.some((f) => prose[f] !== undefined))
      .map(([key]) => key);
    expect(shared).toEqual([]);
  });

  it("leave a taxon's look-alike and invasive text on the key that answers everywhere", () => {
    // Region files carry these too (ivy's removal steps, Douglas-fir's
    // look-alike blurb); filing whole entries under a region once hid them.
    expect(PROSE_FR["Hedera helix"]?.blurb).toBeDefined();
    expect(PROSE_FR["Pseudotsuga menziesii"]?.blurb).toBeDefined();
    expect(PROSE_FR["Hedera helix"]?.nativeNote).toBeUndefined();
  });

  it("are filed under a region that lists the plant", async () => {
    const listed = new Set<string>();
    for (const region of REGIONS) {
      for (const p of await loadPlants(region)) listed.add(`${p.latin}@${region.meta.id}`);
    }
    const strays = Object.keys(PROSE_FR).filter((key) => key.includes("@") && !listed.has(key));
    expect(strays).toEqual([]);
  });
});
