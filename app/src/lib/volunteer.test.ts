// The planting-day guides: every section is backed twice, every word it asks
// for exists, and every guide has an address the app will hand out.
import { describe, it, expect } from "vitest";
import { GUIDES, SOURCES, guideBySlug, guideKeys, guideSources } from "./volunteer";
import { canonicalPath, shareablePaths } from "./routes";
import { en } from "../locales/en";
import { FIGURE_NAMES, SQUARE_NAMES } from "../components/page-art-svg.mjs";

const byId = new Map(SOURCES.map((s) => [s.id, s]));
/** The publisher, near enough: the site, less any `www.` or CDN prefix. */
const publisher = (url: string): string => new URL(url).hostname.split(".").slice(-2).join(".");

describe("planting-day guides", () => {
  it("backs every section with two publishers", () => {
    for (const guide of GUIDES) {
      for (const section of guide.sections) {
        const where = `${guide.slug}/${section.id}`;
        for (const id of section.sources) expect(byId.has(id), `${where}: ${id}`).toBe(true);
        const publishers = new Set(section.sources.map((id) => publisher(byId.get(id)!.url)));
        expect(publishers.size, where).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("lists no source twice and none that nothing cites", () => {
    expect(new Set(SOURCES.map((s) => s.id)).size).toBe(SOURCES.length);
    expect(new Set(SOURCES.map((s) => s.url)).size).toBe(SOURCES.length);
    const cited = new Set(GUIDES.flatMap((g) => guideSources(g).map((s) => s.id)));
    for (const s of SOURCES) expect(cited.has(s.id), s.id).toBe(true);
  });

  it("has words for everything a guide shows", () => {
    for (const guide of GUIDES) {
      for (const key of guideKeys(guide)) expect(en, key).toHaveProperty([key]);
    }
  });

  it("draws only figures that exist", () => {
    for (const guide of GUIDES) {
      expect(SQUARE_NAMES).toContain(guide.square);
      for (const b of guide.sections.flatMap((s) => s.blocks)) {
        if (b.kind === "figure") expect(FIGURE_NAMES).toContain(b.name);
      }
    }
  });

  it("gives each guide a shareable address, and a typo none", () => {
    expect(canonicalPath("volunteer")).toBe("volunteer");
    for (const guide of GUIDES) {
      expect(guideBySlug(guide.slug)).toBe(guide);
      expect(canonicalPath("volunteer", guide.slug)).toBe(`volunteer/${guide.slug}`);
      expect(shareablePaths()).toContain(`volunteer/${guide.slug}`);
    }
    expect(canonicalPath("volunteer", "nope")).toBeNull();
  });
});
