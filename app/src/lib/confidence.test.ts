// The confidence rule, pinned — and every shipped row held to it.
//
// The first half is the rule on rows nobody wrote: each source kind lands on
// its level, and the two caps only ever lower it. The second half walks every
// region's real list, because the rule is only half the promise: a row that
// says "rough" in its citation and records `counted` would pass the rule and
// still lie, and only the data can show that.
import { describe, it, expect } from "vitest";
import { confidenceFor, citesNativeStatus, LOWERED_REASON } from "./confidence";
import { REGIONS } from "../data/regions";
import type { HostCountFrom } from "../types";

const NATIVE = "Native status: Kew WCVP.";

describe("confidenceFor", () => {
  const cases: [HostCountFrom, string][] = [
    ["counted", "high"],
    ["published", "medium"],
    ["estimated", "medium"],
    ["rough", "low"],
    ["none", "low"],
  ];
  for (const [from, level] of cases) {
    it(`rates a ${from} count ${level}`, () => {
      expect(confidenceFor({ hostCountFrom: from, basis: NATIVE })).toBe(level);
    });
  }

  it("rates a row low when it cites nobody for native status", () => {
    expect(confidenceFor({ hostCountFrom: "counted", basis: "Host count: 40 — Gaytán et al." })).toBe("low");
  });

  it("lowers a row that asks to be lowered", () => {
    expect(confidenceFor({ hostCountFrom: "counted", basis: NATIVE, confidenceLowered: "medium" })).toBe("medium");
  });

  it("never raises a row that asks to be 'lowered' above its evidence", () => {
    expect(confidenceFor({ hostCountFrom: "rough", basis: NATIVE, confidenceLowered: "medium" })).toBe("low");
  });
});

describe("citesNativeStatus", () => {
  it("knows a flora when it sees one", () => {
    expect(citesNativeStatus("Native status/range: Jepson eFlora, Calflora.")).toBe(true);
    expect(citesNativeStatus("Wildflower Center; host count Cornus, NWF.")).toBe(true);
  });
  it("is not fooled by a host-count citation alone", () => {
    expect(citesNativeStatus("Host count: oak genus, NWF/Tallamy.")).toBe(false);
  });
});

describe("every shipped plant", async () => {
  const lists = await Promise.all(REGIONS.map(async (r) => ({ id: r.meta.id, rows: await r.load() })));

  for (const { id, rows } of lists) {
    it(`${id}: a lowered row says why, in the row`, () => {
      const silent = rows.filter((p) => p.confidenceLowered && !LOWERED_REASON.test(p.basis)).map((p) => p.id);
      expect(silent).toEqual([]);
    });

    it(`${id}: a row with no count claims no source for it`, () => {
      const claimed = rows.filter((p) => p.hostLepCount === null && p.hostCountFrom !== "none").map((p) => p.id);
      expect(claimed).toEqual([]);
    });

    it(`${id}: a row that calls its count rough doesn't record it as firmer`, () => {
      const firmer = rows
        .filter((p) => /\bHost count:[^.]*\brough\b/i.test(p.basis) && p.hostCountFrom !== "rough")
        .map((p) => p.id);
      expect(firmer).toEqual([]);
    });

    it(`${id}: only a count from a dataset is recorded as counted`, () => {
      const unbacked = rows
        .filter((p) => p.hostCountFrom === "counted" && !/Gaytán|Plant-SyNZ/.test(p.basis))
        .map((p) => p.id);
      expect(unbacked).toEqual([]);
    });
  }
});
