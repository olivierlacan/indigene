// Every plant we call native has a verdict on record from Kew — and the
// page's "checked on <date>" means what it says.
//
// `npm run native:check -- --region <id>` re-asks the World Checklist of
// Vascular Plants about every row a region ships and commits the answer to
// `data/sources/wcvp/<region>.json`; `npm run native-evidence` reduces those
// to the table the plant page reads. The table stores only the disagreements,
// so a plant is "confirmed" by being *absent* from it (`lib/native-evidence.ts`).
//
// That design has one failure mode, and this test exists because it happened:
// a region grows after its check. Fifteen Florida plants and twenty-one in the
// Pacific Northwest were added after the snapshot was taken, and because they
// were not in the disagreement list, every one of their pages said "Kew
// confirms it, checked 21 September" — a claim nobody had made. (Re-asked,
// they all came back native. The test is not about whether they were; it is
// about whether we knew.)
//
// So, offline and on every pull request:
//
//   1. every region has a snapshot — a region with none is standing on
//      sources nobody can re-ask (`docs/source-ledger.md`);
//   2. every shipped row is in its region's snapshot, under the same latin
//      name it ships with, so a plant added or renamed since the last check
//      fails here until someone re-runs the check and commits the answer;
//   3. the snapshot has no rows the region no longer ships, so the "N rows
//      checked" the page prints is the region's real count;
//   4. the evidence table is exactly what the snapshots reduce to — the date,
//      the row count and the disagreement list — so the two cannot drift.
//
// None of this asks Kew anything. It only insists that somebody did, for
// every row the page vouches for.
import { describe, it, expect } from "vitest";
import { REGIONS } from "./regions";
import EVIDENCE from "./native-evidence.json";

// One committed snapshot per region, keyed by region id.
const SNAPSHOTS = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../data/sources/wcvp/*.json", { import: "default", eager: true }) as Record<string, Snapshot>,
  ).map(([path, doc]) => [path.replace(/^.*\//, "").replace(/\.json$/, ""), doc]),
);

interface SnapshotRow {
  id: string;
  latin: string;
  verdict: string;
}
interface Snapshot {
  region: string;
  ranAt: string;
  rows: SnapshotRow[];
}

/** The same reduction `scripts/build-native-evidence.mjs` applies. */
function reason(verdict: string): string {
  const v = verdict.toUpperCase();
  if (v === "INTRODUCED") return "introduced";
  if (v === "ABSENT") return "absent";
  if (v === "NO-MATCH") return "unmatched";
  return "inconclusive";
}

const EVIDENCE_REGIONS = EVIDENCE.regions as Record<
  string,
  { checked: string; rows: number; unconfirmed: Record<string, string> }
>;

describe("every native claim has Kew's verdict on record", async () => {
  const lists = await Promise.all(REGIONS.map(async (r) => ({ id: r.meta.id, rows: await r.load() })));

  for (const { id, rows } of lists) {
    const snapshot = SNAPSHOTS[id];

    it(`${id}: has been put to the checklist at all`, () => {
      expect(snapshot, `no data/sources/wcvp/${id}.json — run \`npm run native:check -- --region ${id}\``).toBeDefined();
    });

    if (!snapshot) continue;
    const checked = new Map(snapshot.rows.map((r) => [r.id, r]));

    it(`${id}: every shipped row was checked, under the name it ships with`, () => {
      const unchecked = rows.filter((p) => !checked.has(p.id)).map((p) => p.id);
      expect(unchecked, `added since the last check — re-run \`npm run native:check -- --region ${id}\``).toEqual([]);
      const renamed = rows
        .filter((p) => checked.has(p.id) && checked.get(p.id)!.latin !== p.latin)
        .map((p) => `${p.id}: shipped as ${p.latin}, checked as ${checked.get(p.id)!.latin}`);
      expect(renamed).toEqual([]);
    });

    it(`${id}: the snapshot holds no row the region no longer ships`, () => {
      const shipped = new Set(rows.map((p) => p.id));
      const stale = snapshot.rows.filter((r) => !shipped.has(r.id)).map((r) => r.id);
      expect(stale, `removed since the last check — re-run the check so the row count on the page is right`).toEqual([]);
    });

    it(`${id}: the evidence table is what the snapshot reduces to`, () => {
      const unconfirmed: Record<string, string> = {};
      for (const r of snapshot.rows) if (r.verdict.toUpperCase() !== "NATIVE") unconfirmed[r.id] = reason(r.verdict);
      expect(EVIDENCE_REGIONS[id], `run \`npm run native-evidence\``).toEqual({
        ...EVIDENCE_REGIONS[id],
        checked: snapshot.ranAt.slice(0, 10),
        rows: snapshot.rows.length,
        unconfirmed,
      });
    });
  }

  it("the evidence table names no region the app doesn't ship", () => {
    const shipped = new Set(REGIONS.map((r) => r.meta.id));
    expect(Object.keys(EVIDENCE_REGIONS).filter((id) => !shipped.has(id))).toEqual([]);
  });
});
