// The PR comment `inat-heroes.yml` pins: it must name exactly what the PR adds
// to the photo review queue, and nothing from an API may break its Markdown.
import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs script, no types
import { report } from "../../scripts/needs-review-report.mjs";

const q = (subject: string, id: string, name = id) => ({ subject, id, name, reason: "chosen photo 1 is all rights reserved", gallery: null });

describe("needs-review report", () => {
  it("names only what the PR adds", () => {
    const { body, added } = report([q("plant", "a")], [q("plant", "a"), q("plant", "b")]);
    expect(added).toBe(1);
    expect(body).toContain("`b`");
    expect(body).not.toContain("`a`");
  });

  it("says so when nothing is added", () => {
    expect(report([q("plant", "a")], [q("plant", "a")]).added).toBe(0);
  });

  it("keeps a name out of the table's syntax", () => {
    const { body } = report([], [q("plant", "x", "Evil | name <b>")]);
    expect(body).toContain("Evil \\| name \\<b\\>");
  });

  it("doesn't promise the review page for kinds it can't fill", () => {
    expect(report([], [q("lookalike", "ivy")]).body).toMatch(/no review tier yet/);
    expect(report([], [q("plant", "oak")]).body).not.toMatch(/no review tier yet/);
  });
});
