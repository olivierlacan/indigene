import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { sitemapXml } from "../../scripts/_sitemap.mjs";

describe("sitemapXml", () => {
  const xml: string = sitemapXml("https://indigene.app", ["", "posts", "guide/", "posts"]);

  it("lists each address once, home first", () => {
    expect([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])).toEqual([
      "https://indigene.app/",
      "https://indigene.app/posts",
      "https://indigene.app/guide/",
    ]);
  });

  it("escapes what XML can't carry raw", () => {
    expect(sitemapXml("https://x.test", ["a&b"])).toContain("<loc>https://x.test/a&amp;b</loc>");
  });
});
