// The AI bill's two promises: the snapshot is the session records summed, and
// the electricity is those tokens times the stated rates — nothing else.
import { describe, it, expect } from "vitest";
import { SNAPSHOT, RATES, energyWh, billKWh, bill, round2 } from "./ai-bill";

// The session records, as text — the same `?raw` glob emoji.test.ts reads the
// app's sources with.
const CSV = Object.values(import.meta.glob("../../../docs/ai-bill/sessions.csv", {
  query: "?raw", import: "default", eager: true,
}) as Record<string, string>)[0];

/** Minimal CSV: the titles are the only quoted field, and none holds a quote. */
function rows(): Record<string, string>[] {
  const [head, ...lines] = CSV.trim().split("\n");
  const cols = head.split(",");
  return lines.map((line: string) => {
    const cells = line.match(/("[^"]*"|[^,]*)(,|$)/g)!.map((c: string) => c.replace(/,$/, "").replace(/^"|"$/g, ""));
    return Object.fromEntries(cols.map((c: string, i: number) => [c, cells[i]]));
  });
}

describe("SNAPSHOT", () => {
  const data = rows();
  const sum = (col: string): number => data.reduce((n, r) => n + (r[col] ? Number(r[col]) : 0), 0);

  it("is the session records summed", () => {
    expect(data.length).toBe(SNAPSHOT.sessions);
    expect(sum("input")).toBe(SNAPSHOT.tokens.input);
    expect(sum("output")).toBe(SNAPSHOT.tokens.output);
    expect(sum("cache_read")).toBe(SNAPSHOT.tokens.cacheRead);
    expect(sum("cache_write")).toBe(SNAPSHOT.tokens.cacheWrite);
    expect(sum("cost_usd")).toBeCloseTo(SNAPSHOT.costUsd, 2);
  });

  it("knows which sessions carry tokens and which only a price", () => {
    expect(data.filter((r) => r.output !== "").length).toBe(SNAPSHOT.sessionsWithTokens);
    const priceOnly = data.filter((r) => r.output === "" && r.cost_usd !== "");
    expect(priceOnly.reduce((n, r) => n + Number(r.cost_usd), 0)).toBeCloseTo(SNAPSHOT.costWithoutTokensUsd, 2);
  });
});

describe("energy", () => {
  it("is tokens times rates, per million", () => {
    expect(energyWh({ input: 1e6, output: 0, cacheRead: 0, cacheWrite: 0 }, RATES.mid)).toBe(390);
    expect(energyWh({ input: 0, output: 2e6, cacheRead: 0, cacheWrite: 0 }, RATES.mid)).toBe(3900);
    expect(energyWh({ input: 0, output: 0, cacheRead: 1e6, cacheWrite: 1e6 }, RATES.mid)).toBeCloseTo(39 + 487.5);
  });

  it("scales up for the sessions that recorded only a price", () => {
    const s = { ...SNAPSHOT, costUsd: 200, costWithoutTokensUsd: 100 };
    expect(billKWh(RATES.mid, s)).toBeCloseTo((energyWh(s.tokens, RATES.mid) / 1000) * 2);
  });

  it("keeps low below mid below high", () => {
    const b = bill();
    expect(b.kWh.low).toBeLessThan(b.kWh.mid);
    expect(b.kWh.mid).toBeLessThan(b.kWh.high);
  });

  it("matches the hand sum the page was written from", () => {
    // 4.50M × 390 + 17.40M × 1,950 + 6,539M × 39 + 121.4M × 487.5 ≈ 349.9 kWh,
    // × 4516.70 / 4431.99 for the price-only sessions ≈ 356.6 kWh.
    expect(bill().kWh.mid).toBeCloseTo(356.6, 0);
  });
});

describe("round2", () => {
  it("keeps two significant figures", () => {
    expect(round2(356.6)).toBe(360);
    expect(round2(74.3)).toBe(74);
    expect(round2(1_486_000)).toBe(1_500_000);
    expect(round2(0)).toBe(0);
  });
});
