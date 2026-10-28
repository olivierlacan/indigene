// Pretend-offline must cut the live lookups and nothing else: a cross-origin
// request fails as it would with no signal, while the app's own files keep
// loading (offline, the service worker serves those from its cache).
import { describe, expect, it } from "vitest";
import { OFFLINE_KEY, blockedWhileForced } from "./connection";
import html from "../../index.html?raw";

const ORIGIN = "https://indigene.app";

describe("blockedWhileForced", () => {
  it("blocks other services", () => {
    expect(blockedWhileForced("https://api.inaturalist.org/v1/taxa", ORIGIN)).toBe(true);
    expect(blockedWhileForced("https://nominatim.openstreetmap.org/search?q=x", ORIGIN)).toBe(true);
  });

  it("lets the app's own files through", () => {
    expect(blockedWhileForced("/prose/en/plants.json", ORIGIN)).toBe(false);
    expect(blockedWhileForced("https://indigene.app/sw.js", ORIGIN)).toBe(false);
    expect(blockedWhileForced("data/regions.json", ORIGIN)).toBe(false);
  });

  it("treats another port as another origin", () => {
    expect(blockedWhileForced("https://indigene.app:8443/x", ORIGIN)).toBe(true);
  });
});

describe("the head script in index.html", () => {
  it("reads the same key, so the first paint agrees with the switch", () => {
    expect(html).toContain(`localStorage.getItem("${OFFLINE_KEY}")`);
  });
});
