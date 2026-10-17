// Every Pacific Northwest plant has the region's own floras' verdict on record:
// the Burke Museum's checklist and OregonFlora's, put to each row by
// `npm run pnw:checklist` and reduced by `npm run native-evidence` to the
// table the plant page reads. The same four promises `native-check.test.ts`
// keeps for Kew, so a plant added after the check can't borrow a "both floras
// agree" it never got.
import { describe, it, expect } from "vitest";
import { REGIONS } from "./regions";
import EVIDENCE from "./native-evidence.json";
import PNW from "../../../data/sources/pnw-flora/pnw.json";

interface Row {
  id: string;
  latin: string;
  burke: { verdict: string };
  oregonflora: { verdict: string };
}
const SNAPSHOTS: Record<string, { ranAt: string; rows: Row[] }> = { pnw: PNW };
const FLORAS = (EVIDENCE as { floras: Record<string, { checked: string; rows: number; disagree: Record<string, Record<string, string>> }> }).floras;

describe("every regional-flora claim is on record", async () => {
  for (const [id, snapshot] of Object.entries(SNAPSHOTS)) {
    const region = REGIONS.find((r) => r.meta.id === id)!;
    const rows = await region.load();
    const checked = new Map(snapshot.rows.map((r) => [r.id, r]));

    it(`${id}: every shipped row was checked, under the name it ships with`, () => {
      const unchecked = rows.filter((p) => !checked.has(p.id)).map((p) => p.id);
      expect(unchecked, "added since the last check — re-run `npm run pnw:checklist`").toEqual([]);
      const renamed = rows
        .filter((p) => checked.has(p.id) && checked.get(p.id)!.latin !== p.latin)
        .map((p) => `${p.id}: shipped as ${p.latin}, checked as ${checked.get(p.id)!.latin}`);
      expect(renamed).toEqual([]);
    });

    it(`${id}: the snapshot holds no row the region no longer ships`, () => {
      const shipped = new Set(rows.map((p) => p.id));
      expect(snapshot.rows.filter((r) => !shipped.has(r.id)).map((r) => r.id)).toEqual([]);
    });

    it(`${id}: the evidence table is what the snapshot reduces to`, () => {
      const disagree: Record<string, Record<string, string>> = {};
      for (const r of snapshot.rows) {
        const said = { burke: r.burke.verdict, oregonflora: r.oregonflora.verdict };
        if (Object.values(said).some((v) => v !== "native")) disagree[r.id] = said;
      }
      expect(FLORAS[id], "run `npm run native-evidence`").toEqual({
        ...FLORAS[id],
        checked: snapshot.ranAt,
        rows: snapshot.rows.length,
        disagree,
      });
    });
  }
});
