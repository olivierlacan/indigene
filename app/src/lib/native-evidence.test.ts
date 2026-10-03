// The table behind "who checked that this is native here, and when".
//
// Two things make this worth testing rather than eyeballing.
//
// First, **the table stores only the disagreements** — 12 rows of 592 — and a
// plant is "confirmed" by being *absent* from it. That is a deliberate size
// trade (a verdict per plant would be ~18 KB of one repeated value), and it
// means a lookup bug reads as a clean bill of health rather than as an error.
// The case that must never regress is the third one below: an unchecked region
// answers `null`, not "confirmed".
//
// Second, a wrong answer here is printed on a plant page as a claim about
// provenance, which is the one thing this app is asking to be trusted on.
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("./i18n", () => ({ getLang: () => mockLang }));
let mockLang = "en";

vi.mock("../data/native-evidence.json", () => ({
  default: {
    source: "World Checklist of Vascular Plants (WCVP), Royal Botanic Gardens Kew",
    url: "https://powo.science.kew.org/",
    regions: {
      "mid-atlantic": {
        area: { en: "Pennsylvania and the nine states around it", fr: "la Pennsylvanie et les neuf États voisins" },
        coarse: false,
        checked: "2026-09-21",
        rows: 44,
        unconfirmed: { "penstemon-digitalis": "introduced", "andropogon-gerardii": "unmatched" },
      },
      "ca-south-coast": {
        area: { en: "California", fr: "la Californie" },
        coarse: true,
        checked: "2026-09-21",
        rows: 64,
        unconfirmed: {},
      },
    },
  },
}));

const { nativeEvidence } = await import("./native-evidence");

afterEach(() => {
  mockLang = "en";
});

describe("nativeEvidence", () => {
  it("confirms a row the checklist did not flag", () => {
    const ev = nativeEvidence("quercus-alba", "mid-atlantic");
    expect(ev?.unconfirmed).toBeNull();
    expect(ev?.checked).toBe("2026-09-21");
  });

  it("reports why a flagged row was not confirmed", () => {
    expect(nativeEvidence("penstemon-digitalis", "mid-atlantic")?.unconfirmed).toBe("introduced");
    expect(nativeEvidence("andropogon-gerardii", "mid-atlantic")?.unconfirmed).toBe("unmatched");
  });

  // The one that matters most. "Not checked" and "checked and confirmed" are
  // different claims, and only the second may appear on a page.
  it("answers null for a region nobody has checked, never 'confirmed'", () => {
    expect(nativeEvidence("quercus-alba", "north-michigan")).toBeNull();
    expect(nativeEvidence("quercus-alba", undefined)).toBeNull();
  });

  it("marks an area wider than the region as coarse", () => {
    expect(nativeEvidence("salvia-clevelandii", "ca-south-coast")?.coarse).toBe(true);
    expect(nativeEvidence("quercus-alba", "mid-atlantic")?.coarse).toBe(false);
  });

  it("gives the area in the reader's language", () => {
    expect(nativeEvidence("quercus-alba", "mid-atlantic")?.area).toBe(
      "Pennsylvania and the nine states around it",
    );
    mockLang = "fr";
    expect(nativeEvidence("quercus-alba", "mid-atlantic")?.area).toBe(
      "la Pennsylvanie et les neuf États voisins",
    );
  });

  it("falls back to English for a language the table has no wording for", () => {
    mockLang = "de";
    expect(nativeEvidence("quercus-alba", "mid-atlantic")?.area).toBe(
      "Pennsylvania and the nine states around it",
    );
  });
});
