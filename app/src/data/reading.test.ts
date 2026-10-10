// The further-reading picks keep the two promises the page makes about them.
//
// The page says every pick has somebody behind it and readers who rely on it.
// Nothing in the build checks that a row carries evidence for the second half —
// an entry with no recommendation, no audience and no award renders perfectly
// well, as a link we are asking the reader to take on our word. So this does.
import { describe, it, expect } from "vitest";
import { READING, WORLD_READING } from "./reading";
import { en } from "../locales/en";
import { fr } from "../locales/fr";
import { REGIONS } from "./regions";

const regionIds = new Set(REGIONS.map((r) => r.meta.id));
const entries = [
  ...Object.entries(READING).flatMap(([region, rows]) => rows.map((r) => ({ region, r }))),
  ...WORLD_READING.map((r) => ({ region: "worldwide", r })),
];

describe("further reading", () => {
  it("is keyed by regions that exist", () => {
    for (const region of Object.keys(READING)) expect(regionIds, region).toContain(region);
  });

  it("stays a short list, not a directory", () => {
    for (const [region, rows] of Object.entries(READING)) expect(rows.length, region).toBeLessThanOrEqual(8);
  });

  it("gives every pick evidence that people rely on it", () => {
    for (const { region, r } of entries) {
      const proven = (r.vouched?.length ?? 0) > 0 || !!r.audience || !!r.award || (r.editions ?? 0) > 1;
      expect(proven, `${region}: “${r.title}” has no recommendation, award, editions or audience`).toBe(true);
    }
  });

  it("links every pick and every recommendation over https", () => {
    for (const { region, r } of entries) {
      expect(r.url, `${region}: ${r.title}`).toMatch(/^https:\/\//);
      for (const v of r.vouched ?? []) expect(v.url, `${region}: ${r.title} ← ${v.name}`).toMatch(/^https:\/\//);
    }
  });

  it("dates every audience count, and counts subscribers only on channels", () => {
    for (const { region, r } of entries) {
      if (!r.audience) continue;
      expect(r.audience.asOf, `${region}: ${r.title}`).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
      expect(r.audience.count).toBeGreaterThan(0);
      if (r.audience.unit === "subscribers" || r.audience.unit === "followers") {
        expect(["video", "social"], `${region}: ${r.title}`).toContain(r.kind);
      }
    }
  });

  it("says what each worldwide pick gives the reader, in both languages", () => {
    for (const r of WORLD_READING) {
      expect(r.why, `worldwide: “${r.title}” has no line saying why`).toBeTruthy();
      const key = `reading.why.${r.why}`;
      expect(en, key).toHaveProperty([key]);
      expect(fr, key).toHaveProperty([key]);
    }
  });

  it("lists a pick once per region", () => {
    for (const [region, rows] of Object.entries(READING)) {
      const urls = rows.map((r) => r.url);
      expect(new Set(urls).size, region).toBe(urls.length);
    }
  });
});
