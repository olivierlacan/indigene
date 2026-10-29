// How a `changelog.d/` entry is read and folded into Unreleased
// (`scripts/_changelog.mjs`). Every pull request's entry goes through these two
// on every build, so a wrong rule here is a red check on somebody else's PR.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { foldFragments, parseFragment } from "../../scripts/_changelog.mjs";

const fragment = (text: string) => ({ name: "x.md", sections: parseFragment(text, "x.md") });

describe("parseFragment", () => {
  it("keeps a wrapped bullet's continuation verbatim", () => {
    expect(parseFragment("### Fixed\n\n- One thing\n  wrapped.\n- Two\n", "x.md")).toEqual([
      { title: "Fixed", lines: ["- One thing", "  wrapped.", "- Two"] },
    ]);
  });
  it("merges a section that appears twice", () => {
    const [s] = parseFragment("### Added\n- a\n### Added\n- b\n", "x.md");
    expect(s.lines).toEqual(["- a", "- b"]);
  });
  it("refuses a section Keep a Changelog doesn't have", () => {
    expect(() => parseFragment("### Notes\n- a\n", "x.md")).toThrow(/unknown section/);
  });
  it("refuses a version heading", () => {
    expect(() => parseFragment("## [0.9]\n### Added\n- a\n", "x.md")).toThrow(/not a version/);
  });
  it("refuses a bullet before any section", () => {
    expect(() => parseFragment("- a\n", "x.md")).toThrow(/before any section/);
  });
  it("refuses prose, and a continuation with nothing to continue", () => {
    expect(() => parseFragment("### Added\nJust words.\n", "x.md")).toThrow(/neither a bullet/);
    expect(() => parseFragment("### Added\n  dangling\n", "x.md")).toThrow(/neither a bullet/);
  });
  it("refuses an empty file", () => {
    expect(() => parseFragment("\n\n", "x.md")).toThrow(/no entries/);
  });
});

describe("foldFragments", () => {
  const released = "## [1.0] - 2026-10-01\n**A name**\n\n### Added\n\n- Old.\n";
  const changelog = `# Changelog\n\n## [Unreleased]\n\n### Added\n\n- Existing.\n\n${released}`;

  it("adds to a section that's already there", () => {
    const out = foldFragments(changelog, [fragment("### Added\n- New.\n")]);
    expect(out).toContain("### Added\n\n- Existing.\n- New.\n");
  });
  it("puts a new section in Keep a Changelog's order", () => {
    const out = foldFragments(changelog, [fragment("### Fixed\n- F.\n"), fragment("### Changed\n- C.\n")]);
    const order = ["### Added", "### Changed", "### Fixed"].map((h) => out.indexOf(h));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });
  it("leaves released versions and the header untouched", () => {
    const out = foldFragments(changelog, [fragment("### Fixed\n- F.\n")]);
    expect(out.startsWith("# Changelog\n\n## [Unreleased]\n")).toBe(true);
    expect(out.endsWith(released)).toBe(true);
  });
  it("is the identity with nothing to fold", () => {
    expect(foldFragments(changelog, [])).toBe(changelog);
  });
  it("refuses prose under Unreleased rather than reformat it", () => {
    const prose = changelog.replace("### Added\n\n- Existing.", "Some words.\n\n### Added\n\n- Existing.");
    expect(() => foldFragments(prose, [fragment("### Added\n- a\n")])).toThrow(/isn't a bullet/);
  });
  it("refuses a changelog with no Unreleased", () => {
    expect(() => foldFragments(released, [fragment("### Added\n- a\n")])).toThrow(/Unreleased/);
  });
});
