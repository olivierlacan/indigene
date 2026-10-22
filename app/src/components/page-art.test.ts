// The drawings' colours live twice: in styles.css for the app, and in
// PAGE_ART_CSS for What's new and the Guide. This holds the two alike.
import { describe, it, expect } from "vitest";
import { PAGE_ART_NAMES, PAGE_ART_RULES, PAGE_ART_LIGHT, PAGE_ART_DARK, SQUARE_NAMES, pageArtSvg, squareArtSvg } from "./page-art-svg.mjs";

const ALL = [...PAGE_ART_NAMES.map((n) => [n, pageArtSvg(n)]), ...SQUARE_NAMES.map((n) => [n, squareArtSvg(n)])];

// Through the `?raw` glob brand.test.ts uses: a plain CSS import comes back
// empty under the test runner.
const STYLES = Object.values(
  import.meta.glob("../styles.css", { query: "?raw", import: "default", eager: true }) as Record<string, string>
)[0];

describe("page drawings", () => {
  it("styles every rule the static pages carry", () => {
    const rules = PAGE_ART_RULES.trim().split("\n");
    expect(rules.length).toBeGreaterThan(20);
    for (const rule of rules) expect(STYLES, rule).toContain(rule);
    const decls = [...PAGE_ART_LIGHT.split(";"), ...PAGE_ART_DARK.split(";")].map((d) => d.trim()).filter(Boolean);
    for (const decl of decls) expect(STYLES, decl).toContain(decl);
  });

  it("gives every class a drawing uses a rule", () => {
    for (const [name, svg] of ALL) {
      const classes = new Set([...svg.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(" ")));
      classes.delete("page-art");
      classes.delete("square-art");
      for (const c of classes) expect(PAGE_ART_RULES, `${name}: .${c}`).toMatch(new RegExp(`\\.${c}[ ,]`));
    }
  });

  it("hides every drawing from screen readers", () => {
    for (const [, svg] of ALL) expect(svg).toContain('aria-hidden="true"');
  });
});
