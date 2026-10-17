// The robots.txt reader the Atlas of Florida Plants harvester stops at. The
// fixture is the shape of the Atlas's own file: named AI agents shut out
// entirely, everyone else kept off exports and the search results.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { allowed, robotsFor } from "../../scripts/_robots.mjs";

const body = `
# Individual Disallow Requests
User-agent: +Bytespider
Disallow: /
User-agent: ClaudeBot
Disallow: /

User-agent: *
Disallow: /admin/*
Disallow: /*export*
Disallow: /plant/results?*
Crawl-delay: 5
`;

describe("robotsFor", () => {
  const us = robotsFor(body, "Indigene native-plant app");

  it("keeps a named agent out everywhere", () => {
    expect(allowed(robotsFor(body, "ClaudeBot/1.0"), "/plant/species/1")).toBe(false);
    expect(allowed(robotsFor(body, "Bytespider"), "/")).toBe(false);
  });

  it("lets everyone else read the plant pages", () => {
    expect(allowed(us, "/plant/species/2104")).toBe(true);
    expect(allowed(us, "/browse/scientific")).toBe(true);
  });

  it("keeps everyone off the search results and exports", () => {
    expect(allowed(us, "/plant/results?CountiesInclude=Orange")).toBe(false);
    expect(allowed(us, "/specimen/export/7")).toBe(false);
  });

  it("reads the crawl delay", () => {
    expect(us.delay).toBe(5);
  });

  it("lets the longer rule win, Allow on a tie", () => {
    const r = robotsFor("User-agent: *\nDisallow: /plant/\nAllow: /plant/species/", "x");
    expect(allowed(r, "/plant/species/1")).toBe(true);
    expect(allowed(r, "/plant/results")).toBe(false);
  });
});
