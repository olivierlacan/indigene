// The Halloween window, and the head script in index.html that decides it
// before the app loads: the two must agree on the dates and the key.
import { describe, expect, it } from "vitest";
import { HALLOWEEN_FROM, HALLOWEEN_KEY, HALLOWEEN_MONTH, inSeason, wanted } from "./halloween";
import html from "../../index.html?raw";

describe("Halloween window", () => {
  it("is on by default from 17 October to the end of the 31st", () => {
    expect(inSeason(new Date(2026, 9, 16, 23, 59))).toBe(false);
    expect(inSeason(new Date(2026, 9, 17, 0, 0))).toBe(true);
    expect(inSeason(new Date(2026, 9, 31, 23, 59))).toBe(true);
    expect(inSeason(new Date(2026, 10, 1, 0, 0))).toBe(false);
    expect(inSeason(new Date(2027, 9, 20))).toBe(true);
  });

  it("lets a saved choice beat the calendar either way", () => {
    const june = new Date(2026, 5, 1);
    const oct20 = new Date(2026, 9, 20);
    expect(wanted(june, null)).toBe(false);
    expect(wanted(june, "on")).toBe(true);
    expect(wanted(oct20, null)).toBe(true);
    expect(wanted(oct20, "off")).toBe(false);
  });

  it("matches the head script's copy", () => {
    const script = html.match(/<!-- halloween:[\s\S]*?<script>([\s\S]*?)<\/script>/)?.[1] ?? "";
    expect(script).toContain(`var season = d.getMonth() === ${HALLOWEEN_MONTH} && d.getDate() >= ${HALLOWEEN_FROM};`);
    expect(script).toContain(`localStorage.getItem("${HALLOWEEN_KEY}")`);
    expect(script).toContain(`localStorage.setItem("${HALLOWEEN_KEY}", pick)`);
    expect(script).toContain('if (!(pick ? pick === "on" : season)) return;');
  });
});
