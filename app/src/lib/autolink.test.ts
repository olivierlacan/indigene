// The release notes and the guide link a URL a changelog bullet types out,
// rather than printing it dead (`autolink()` in scripts/_changelog.mjs).
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { autolink } from "../../scripts/_changelog.mjs";

describe("autolink", () => {
  it("links a bare address and leaves trailing punctuation outside", () => {
    expect(autolink("see https://indigene.app/crops. Then")).toBe(
      'see <a href="https://indigene.app/crops">https://indigene.app/crops</a>. Then',
    );
  });

  it("links Markdown's angle-bracket autolink, as escaped HTML", () => {
    expect(autolink("at &lt;https://indigene.app/#/saved&gt;")).toBe(
      'at <a href="https://indigene.app/#/saved">https://indigene.app/#/saved</a>',
    );
  });

  it("leaves an already-drawn link alone, href and text", () => {
    const html = '<a href="https://indigene.app/">https://indigene.app/</a>';
    expect(autolink(html)).toBe(html);
  });

  it("keeps a trailing slash inside and a closing paren outside", () => {
    expect(autolink("(https://indigene.app/release-notes/)")).toBe(
      '(<a href="https://indigene.app/release-notes/">https://indigene.app/release-notes/</a>)',
    );
  });
});
