// The boot screen in index.html draws the seedling before any script runs, so
// it carries its own copy of `SEEDLING`. This keeps the two the same plant —
// one copy once shipped as the stray word "main" instead.
import { describe, expect, it } from "vitest";
import { SEEDLING } from "./page-loader";
import html from "../../index.html?raw";

const squash = (s: string) => s.replace(/\s+/g, " ").replace(/> </g, "><").trim();

describe("boot screen seedling", () => {
  it("matches SEEDLING in page-loader.ts", () => {
    const sprout = html.match(/<div class="boot-sprout">([\s\S]*?)<\/div>/);
    expect(sprout).not.toBeNull();
    expect(squash(sprout![1])).toBe(squash(SEEDLING));
  });
});
