// Every plant that names no animal is a decision on record, not an accident.
//
// The plant lists grew from about 400 rows to 1,425 while the wildlife layer
// stood still, and four in ten plants ended up naming no animal at all. No
// test noticed, because none asked. This one does, offline and on every pull
// request:
//
//   1. every shipped plant with no tie is listed in `wildlife-gaps.json`, with a
//      reason (`unresearched` until somebody looks, `none-found` after);
//   2. nothing listed there has a tie now, or has stopped shipping.
//
// Fix either with `npm run wildlife:gaps`. The point is the diff: a pull
// request that adds plants without ties shows them, by name, as unresearched.
import { describe, it, expect } from "vitest";
import { REGIONS } from "./regions";
import { SUPPORT } from "./wildlife";
import GAPS from "./wildlife-gaps.json";

// Stored as region → reason → plant ids; read here as region → plant → reason.
const LEDGER = Object.fromEntries(
  Object.entries(GAPS.regions as Record<string, Record<string, string[]>>).map(([id, byReason]) => [
    id,
    Object.fromEntries(Object.entries(byReason).flatMap(([why, plants]) => plants.map((p) => [p, why]))),
  ]),
);
const REASONS = new Set(["unresearched", "none-found"]);

describe("every plant that names no animal is on record", async () => {
  const lists = await Promise.all(REGIONS.map(async (r) => ({ id: r.meta.id, rows: await r.load() })));
  for (const { id, rows } of lists) {
    const ties = SUPPORT[id] ?? {};
    const untied = rows.filter((p) => !(ties[p.id] ?? []).length).map((p) => p.id);
    const listed = LEDGER[id] ?? {};

    it(`${id}: the ledger lists exactly the plants with no tie`, () => {
      expect(untied.filter((p) => !(p in listed)), "untied and unlisted — run `npm run wildlife:gaps`").toEqual([]);
      expect(Object.keys(listed).filter((p) => !untied.includes(p)), "listed but tied or gone — run `npm run wildlife:gaps`").toEqual([]);
    });

    it(`${id}: every gap says why`, () => {
      expect(Object.entries(listed).filter(([, why]) => !REASONS.has(why))).toEqual([]);
    });
  }
});
