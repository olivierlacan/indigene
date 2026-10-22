// The Halloween window, and the head script in index.html that decides it
// before the app loads: the two must agree on the dates and the key.
import { describe, expect, it } from "vitest";
import { HALLOWEEN_FROM, HALLOWEEN_KEY, HALLOWEEN_MONTH, inSeason } from "./halloween";
import html from "../../index.html?raw";

describe("Halloween window", () => {
  it("runs from 15 October to the end of the 31st", () => {
    expect(inSeason(new Date(2026, 9, 14, 23, 59))).toBe(false);
    expect(inSeason(new Date(2026, 9, 15, 0, 0))).toBe(true);
    expect(inSeason(new Date(2026, 9, 31, 23, 59))).toBe(true);
    expect(inSeason(new Date(2026, 10, 1, 0, 0))).toBe(false);
    expect(inSeason(new Date(2027, 9, 20))).toBe(true);
  });

  it("matches the head script's copy", () => {
    const script = html.match(/<!-- halloween:[\s\S]*?<script>([\s\S]*?)<\/script>/)?.[1] ?? "";
    expect(script).toContain(`var on = d.getMonth() === ${HALLOWEEN_MONTH} && d.getDate() >= ${HALLOWEEN_FROM};`);
    expect(script).toContain(`localStorage.getItem("${HALLOWEEN_KEY}") !== "off"`);
  });
});
