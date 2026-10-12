import { describe, expect, it } from "vitest";
import { isPostalQuery, parsePostalResults, rankPlaces, readerCountry, type GeoPlace } from "./geocode";

// Nominatim's answer for ?postalcode=33812, trimmed: Spain first, Florida second.
const NOMINATIM_33812 = [
  {
    lat: "42.9555113", lon: "-6.5917757", name: "33812",
    address: { postcode: "33812", village: "Degaña", state: "Asturias", country: "Spain", country_code: "es" },
  },
  {
    lat: "27.9718474", lon: "-81.8903589", name: "33812",
    address: { postcode: "33812", county: "Polk County", state: "Florida", country: "United States", country_code: "us" },
  },
];

const place = (countryCode: string, lon: number): GeoPlace =>
  ({ name: countryCode, admin1: null, country: null, countryCode, lat: 0, lon });

describe("isPostalQuery", () => {
  it.each(["33812", "SW1A 1AA", "H2X 1Y4", "75-011", "1010"])("%s is a postal code", (q) => {
    expect(isPostalQuery(q)).toBe(true);
  });
  it.each(["Lakeland", "State College", "St. Louis, MO", "12", "33812 Lakeland Florida"])(
    "%s is not", (q) => expect(isPostalQuery(q)).toBe(false),
  );
});

describe("readerCountry", () => {
  it("reads the region from the first tag that has one", () => {
    expect(readerCountry(["en", "en-US"])).toBe("US");
    expect(readerCountry(["zh-Hans-TW"])).toBe("TW");
  });
  it("is null without a region", () => {
    expect(readerCountry(["en", "es-419"])).toBeNull();
  });
});

describe("parsePostalResults", () => {
  it("names a place by its town, else its county", () => {
    const [es, us] = parsePostalResults(NOMINATIM_33812);
    expect(es).toMatchObject({ name: "Degaña", admin1: "Asturias", countryCode: "ES" });
    expect(us).toMatchObject({ name: "Polk County", admin1: "Florida", countryCode: "US", lat: 27.9718474 });
  });
  it("skips rows without coordinates", () => {
    expect(parsePostalResults([{ lat: "x" }, null])).toEqual([]);
    expect(parsePostalResults({ error: "nope" })).toEqual([]);
  });
});

describe("rankPlaces", () => {
  // The reported case (issue #219): a Florida ZIP typed on an en-US phone in
  // Eastern time came back as Spain.
  it("puts Florida first for 33812 in the US", () => {
    const ranked = rankPlaces(parsePostalResults(NOMINATIM_33812), "US", -240);
    expect(ranked[0].countryCode).toBe("US");
  });
  it("falls back to the time zone when the language names no country", () => {
    const ranked = rankPlaces(parsePostalResults(NOMINATIM_33812), null, -240);
    expect(ranked[0].countryCode).toBe("US");
    expect(rankPlaces(parsePostalResults(NOMINATIM_33812), null, 120)[0].countryCode).toBe("ES");
  });
  it("wraps around the date line", () => {
    // UTC+12 is ~180°; a place at -175° is 5° away, not 355°.
    const ranked = rankPlaces([place("FR", 2), place("WS", -175)], null, 720);
    expect(ranked[0].countryCode).toBe("WS");
  });
  it("keeps the service's order between equals", () => {
    const ranked = rankPlaces([place("A", 10), place("B", 10)], null, 0);
    expect(ranked.map((p) => p.countryCode)).toEqual(["A", "B"]);
  });
});
