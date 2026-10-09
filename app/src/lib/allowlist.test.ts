import { describe, expect, it } from "vitest";
import { allows, parseAllowlist, pasteList, redundant } from "./allowlist";

describe("parseAllowlist", () => {
  it("reads hosts, groups and trailing comments", () => {
    const entries = parseAllowlist("# intro\n## Maps\ngis.cec.org  # CEC\n\n*.arcgis.com\n");
    expect(entries).toEqual([
      { host: "gis.cec.org", group: "Maps", line: 3 },
      { host: "*.arcgis.com", group: "Maps", line: 5 },
    ]);
  });

  it("refuses a line that isn't a host", () => {
    expect(() => parseAllowlist("https://gis.cec.org/")).toThrow(/line 1/);
    expect(() => parseAllowlist("gis.cec.org/arcgis")).toThrow();
  });
});

describe("allows", () => {
  it("matches a subdomain under a wildcard, not the bare domain", () => {
    expect(allows("*.arcgis.com", "services7.arcgis.com")).toBe(true);
    expect(allows("*.arcgis.com", "arcgis.com")).toBe(false);
    expect(allows("*.arcgis.com", "notarcgis.com")).toBe(false);
    expect(allows("gis.cec.org", "gis.cec.org")).toBe(true);
  });
});

describe("redundant", () => {
  it("flags repeats and hosts a wildcard covers", () => {
    const found = redundant(parseAllowlist("a.org\na.org\n*.b.org\nx.b.org\nb.org\n"));
    expect(found.map((r) => r.entry.line)).toEqual([2, 4]);
  });
});

describe("the committed allowlist", () => {
  // The same `?raw` glob emoji.test.ts reads the app's sources with.
  const FILES = import.meta.glob(
    ["../../../.claude/network/*.txt", "../../../.claude/settings.json"],
    { query: "?raw", import: "default", eager: true },
  ) as Record<string, string>;
  const file = (name: string) => FILES[`../../../.claude/${name}`];
  const entries = parseAllowlist(file("network/allowed-domains.txt"));

  it("has no redundant line", () => {
    expect(redundant(entries).map((r) => `${r.entry.host} (covered by ${r.by.host})`)).toEqual([]);
  });

  it("matches its generated copies (run `npm run allowlist`)", () => {
    expect(file("network/paste.txt")).toBe(pasteList(entries));
    const settings = JSON.parse(file("settings.json"));
    expect(settings.sandbox.network.allowedDomains).toEqual(pasteList(entries).trim().split("\n"));
  });
});
