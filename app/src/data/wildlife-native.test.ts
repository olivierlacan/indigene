// Every animal a region ties to its plants has the fauna authorities' verdict
// on record — and the tie checks cover every tie GloBI relayed.
//
// The animal half of `native-check.test.ts`, and it guards against the same
// failure: a catalog that grows after its check, so the page says "checked"
// about animals nobody asked about. Offline, on every pull request:
//
//   1. every region with ties has a snapshot in data/sources/wildlife-native/;
//   2. every animal tied there is in it, asked under the names it ships with
//      (its binomial, or its group's `members`), and nothing else is;
//   3. every animal with ties can be asked at all — a group has members;
//   4. the evidence table the animal page reads is exactly what the snapshots
//      reduce to;
//   5. every tie whose basis opens "GloBI —" has a row in
//      data/sources/wildlife-ties/, so its studies were re-asked.
//
// None of this asks anybody anything. Run `npm run wildlife:native -- --region
// <id>` and `npm run wildlife:ties -- --region <id>`, and commit what they write.
import { describe, it, expect } from "vitest";
import { WILDLIFE, SUPPORT } from "./wildlife";
import EVIDENCE from "./wildlife-evidence.json";
import type { Wildlife } from "../types";

interface NativeRow {
  id: string;
  verdict: string;
  asked?: string;
  members?: { name: string }[];
}
interface NativeSnapshot {
  region: string;
  ranAt: string;
  rows: NativeRow[];
}
interface TieSnapshot {
  region: string;
  ties: { plant: string; animal: string; support: string; globi?: unknown }[];
}

const byFile = <T>(docs: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(docs).map(([path, doc]) => [path.replace(/^.*\//, "").replace(/\.json$/, ""), doc]));
const NATIVE = byFile(
  import.meta.glob("../../../data/sources/wildlife-native/*.json", { import: "default", eager: true }) as Record<string, NativeSnapshot>,
);
const TIES = byFile(
  import.meta.glob("../../../data/sources/wildlife-ties/*.json", { import: "default", eager: true }) as Record<string, TieSnapshot>,
);

/** The names an animal is asked under — the same rule as `askedNames` in
 *  `scripts/_fauna.mjs`, which a test can't import. */
function askedNames(w: Wildlife): string[] {
  if (w.members?.length) return w.members;
  if (w.latin && /^[A-Z][a-z]+ [a-z-]+$/.test(w.latin)) return [w.latin];
  return [];
}

const animals = new Map(WILDLIFE.map((w) => [w.id, w]));
const EVIDENCE_REGIONS = EVIDENCE.regions as Record<string, { checked: string; animals: number; unconfirmed: Record<string, string> }>;

describe("every animal we call native has a verdict on record", () => {
  for (const [regionId, plants] of Object.entries(SUPPORT)) {
    const tied = [...new Set(Object.values(plants).flatMap((links) => links.map((l) => l.wildlifeId)))].sort();
    const snap = NATIVE[regionId];

    it(`${regionId}: has been put to the fauna authorities`, () => {
      expect(snap, `no data/sources/wildlife-native/${regionId}.json — run \`npm run wildlife:native -- --region ${regionId}\``).toBeDefined();
    });
    if (!snap) continue;

    it(`${regionId}: every tied animal has a verdict, under the names it ships with`, () => {
      const rows = new Map(snap.rows.map((r) => [r.id, r]));
      const stale = tied.filter((id) => {
        const row = rows.get(id);
        if (!row) return true;
        const asked = row.members ? row.members.map((m) => m.name) : row.asked ? [row.asked] : [];
        return asked.join("|") !== askedNames(animals.get(id)!).join("|");
      });
      expect(stale, "added or renamed since the last check — re-run wildlife:native").toEqual([]);
      expect(snap.rows.map((r) => r.id).filter((id) => !tied.includes(id)), "no longer tied here").toEqual([]);
    });

    it(`${regionId}: the evidence table matches the snapshot`, () => {
      const ev = EVIDENCE_REGIONS[regionId];
      expect(ev, "run `npm run wildlife:native -- --evidence`").toBeDefined();
      const unconfirmed = Object.fromEntries(snap.rows.filter((r) => r.verdict !== "NATIVE").map((r) => [r.id, r.verdict.toLowerCase()]));
      expect({ checked: ev.checked, animals: ev.animals, unconfirmed: ev.unconfirmed }).toEqual({
        checked: snap.ranAt.slice(0, 10),
        animals: snap.rows.length,
        unconfirmed,
      });
    });
  }

  it("every animal with ties can be asked about: a binomial, or a group with members", () => {
    const tiedIds = new Set(Object.values(SUPPORT).flatMap((p) => Object.values(p).flatMap((ls) => ls.map((l) => l.wildlifeId))));
    expect(WILDLIFE.filter((w) => tiedIds.has(w.id) && !askedNames(w).length).map((w) => w.id)).toEqual([]);
  });
});

describe("every tie GloBI relayed has been re-asked", () => {
  for (const [regionId, plants] of Object.entries(SUPPORT)) {
    const relayed = Object.entries(plants).flatMap(([plant, links]) =>
      links.filter((l) => /^GloBI\b/.test(l.basis)).map((l) => `${plant}→${l.wildlifeId}→${l.support}`),
    );
    if (!relayed.length) continue;
    it(`${regionId}: ${relayed.length} GloBI ties have a check on record`, () => {
      const snap = TIES[regionId];
      expect(snap, `no data/sources/wildlife-ties/${regionId}.json — run \`npm run wildlife:ties -- --region ${regionId}\``).toBeDefined();
      const checked = new Set((snap?.ties ?? []).filter((t) => t.globi).map((t) => `${t.plant}→${t.animal}→${t.support}`));
      expect(relayed.filter((k) => !checked.has(k))).toEqual([]);
    });
  }
});
