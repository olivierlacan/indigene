// The policy and the code that has to live under it.
//
// `lib/csp.ts` lists every host the app may contact; the browser refuses the
// rest. **When those two lists disagree the failure is silent** — the lookup
// returns nothing, selection falls back to the coverage box, and that is a
// legitimate answer offline, so nothing looks broken. It just quietly stops
// working, for whoever happens to live where that service answers.
//
// It happened: `services7.arcgis.com` is not `services.arcgis.com` — the first
// is the CEC's, the second RESOLVE's, and CSP matches hosts exactly — so the
// CEC's was missing while every page still looked fine.
//
// `npm run csp:check` walks the built app in a real browser and is the stronger
// check, but it can only catch a missing host on a page it actually visits, at
// a cost of minutes per route. This catches the same class in a millisecond,
// from the lists themselves, and it caught nothing the browser walk could have
// caught without a spot in Canada.
import { describe, it, expect } from "vitest";
import { CONNECT_HOSTS } from "./csp";
import { ECOREGION_QUERY_URLS } from "./site";
import { ECOREGION_PROVIDERS } from "../types";

describe("the policy covers what the app calls", () => {
  it("lists a host for every ecoregion service", () => {
    for (const [provider, url] of Object.entries(ECOREGION_QUERY_URLS)) {
      const origin = new URL(url).origin;
      expect(
        CONNECT_HOSTS,
        `${provider} is asked at ${origin}, which connect-src does not allow — ` +
          `the browser would refuse it and the region would fall back to its box`,
      ).toContain(origin);
    }
  });

  it("has a service for every provider the app can return", () => {
    // The record is typed `Record<EcoregionProvider, string>`, so this is the
    // compiler's job — but the type only binds what is written down, and a
    // provider added to the union with an empty entry would slip past. Cheap
    // enough to state outright.
    for (const provider of ECOREGION_PROVIDERS) {
      expect(ECOREGION_QUERY_URLS[provider], `no service URL for ${provider}`).toBeTruthy();
    }
  });

  it("names hosts, not paths or wildcards", () => {
    // `connect-src` entries are matched as origins. A trailing path is silently
    // ignored by some browsers and honoured by others, and a bare wildcard
    // would defeat the point of having the list.
    for (const host of CONNECT_HOSTS) {
      expect(host, `${host} should be a bare https origin`).toMatch(
        /^https:\/\/[a-z0-9.-]+$/,
      );
    }
  });
});
