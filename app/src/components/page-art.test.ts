// The drawings' colours live twice: in styles.css for the app, and in
// PAGE_ART_CSS for What's new and the Guide. This holds the two alike.
import { describe, it, expect } from "vitest";
import { PAGE_ART_NAMES, PAGE_ART_RULES, PAGE_ART_LIGHT, PAGE_ART_DARK, pageArtSvg } from "./page-art-svg.mjs";

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
    for (const name of PAGE_ART_NAMES) {
      const classes = new Set([...pageArtSvg(name).matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(" ")));
      classes.delete("page-art");
      for (const c of classes) expect(PAGE_ART_RULES, `${name}: .${c}`).toMatch(new RegExp(`\\.${c}[ ,]`));
    }
  });

  it("hides every drawing from screen readers", () => {
    for (const name of PAGE_ART_NAMES) expect(pageArtSvg(name)).toContain('aria-hidden="true"');
  });
});
