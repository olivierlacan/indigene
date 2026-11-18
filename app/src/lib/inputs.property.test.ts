// Property tests for what the app's text, number and file fields accept.
//
// The example tests beside each module pin the cases somebody thought of. These
// ask fast-check for a few hundred values per field instead — empty strings,
// emoji, stray whitespace, "1e3", "-0", 10 MB of JSON nesting — and check the
// rules that must hold for every one of them. When one breaks, fast-check
// shrinks it to the smallest failing value and prints it, so the failure reads
// like an example test that nobody had written yet.
//
// Each property says what the field promises, not how the code gets there.
import { describe, expect, it } from "vitest";
import fc from "fast-check";
// `npm run fuzz` sets FC_RUNS for a deeper sweep than the 100 a normal run tries.
fc.configureGlobal({ numRuns: Number(import.meta.env.FC_RUNS) || 100 });
import { isUuid, parseObservationRef } from "./observation-link";
import { isPostalQuery } from "./geocode";
import { fold, markFolded } from "./region-search";
import { parseSpotsFile, SPOTS_FORMAT } from "./backup";
import { readCount, readPlanted } from "./planting-input";

// What a number field holds: a mobile keypad still lets through a decimal
// point, a minus sign and an exponent, and `min`/`max` are only hints.
const numeric = fc.oneof(
  fc.integer({ min: -5000, max: 5000 }).map(String),
  fc.integer({ min: -50000, max: 50000 }).map((n) => (n / 10).toString()),
  fc.double({ noNaN: true }).map(String),
);

// Anything a keyboard, a paste or an autofill can put in a text field.
const typed = fc.oneof(
  numeric,
  fc.string(),
  fc.string({ unit: "grapheme" }),
  fc.string({ unit: "binary" }),
  fc.constantFrom("", " ", "\t\n", "0", "-0", "1e3", "NaN", "Infinity", "0x10", "١٢٣", "İstanbul", "ß", "ﬁ"),
);

describe("the iNaturalist observation field", () => {
  it("never throws, and returns a UUID, a positive whole number, or nothing", () => {
    fc.assert(fc.property(typed, (s) => {
      const ref = parseObservationRef(s);
      if (ref === null) return;
      expect(isUuid(ref) || /^[1-9]\d*$/.test(ref)).toBe(true);
      if (!isUuid(ref)) expect(Number.isSafeInteger(Number(ref))).toBe(true);
    }));
  });

  it("reads its own answer back unchanged", () => {
    fc.assert(fc.property(typed, (s) => {
      const ref = parseObservationRef(s);
      if (ref !== null) expect(parseObservationRef(ref)).toBe(ref);
    }));
  });

  it("finds the id in any link that carries one", () => {
    const link = fc.tuple(
      fc.integer({ min: 1, max: Number.MAX_SAFE_INTEGER }),
      fc.constantFrom("", "es/", "fr-CA/"),
      fc.constantFrom("", "/", "?tab=ids", "#activity", "  "),
    );
    fc.assert(fc.property(link, ([id, locale, tail]) => {
      expect(parseObservationRef(`https://www.inaturalist.org/${locale}observations/${id}${tail}`)).toBe(String(id));
    }));
  });

  it("finds a UUID in any case, anywhere in what was pasted", () => {
    fc.assert(fc.property(fc.uuid(), fc.string(), (u, around) => {
      const ref = parseObservationRef(`${around} ${u.toUpperCase()} ${around}`);
      // `around` may itself hold a UUID-shaped run; then the first one wins.
      expect(ref === null ? false : isUuid(ref)).toBe(true);
    }));
  });
});

describe("the place search field's postcode guess", () => {
  it("never throws, and only says yes to something short with a digit", () => {
    fc.assert(fc.property(typed, (s) => {
      if (!isPostalQuery(s)) return;
      const t = s.trim();
      expect(t.length).toBeGreaterThanOrEqual(3);
      expect(t.length).toBeLessThanOrEqual(10);
      expect(/\d/.test(t)).toBe(true);
    }));
  });
});

describe("the region filter", () => {
  it("folds to a fixed point: folding twice changes nothing", () => {
    fc.assert(fc.property(typed, (s) => {
      expect(fold(fold(s))).toBe(fold(s));
    }));
  });

  it("splits a name into pieces that put it back together exactly", () => {
    fc.assert(fc.property(typed, typed, (text, q) => {
      const parts = markFolded(text, fold(q));
      expect(parts.map((p) => p.text).join("")).toBe(text);
    }));
  });

  it("underlines only letters that match the query", () => {
    fc.assert(fc.property(typed, fc.string({ minLength: 1 }), (text, q) => {
      const fq = fold(q);
      for (const p of markFolded(text, fq)) if (p.hit) expect(fold(p.text)).toBe(fq);
    }));
  });
});

describe("the backup file picker", () => {
  it("never throws on any file, and refuses with a reason it can show", () => {
    const anyText = fc.oneof(typed, fc.json(), fc.jsonValue().map((v) => JSON.stringify(v)));
    fc.assert(fc.property(anyText, (text) => {
      const r = parseSpotsFile(text);
      if (!r.ok) expect(["unreadable", "notOurs", "tooNew"]).toContain(r.why);
    }));
  });

  it("never throws on a file that claims to be ours but holds anything at all", () => {
    const ours = fc.record({
      format: fc.constant(SPOTS_FORMAT),
      version: fc.oneof(fc.constant(1), fc.constant(2), fc.anything()),
      spots: fc.oneof(fc.array(fc.anything()), fc.anything()),
      plantings: fc.oneof(fc.array(fc.anything()), fc.anything()),
      lookups: fc.anything(),
      sightings: fc.anything(),
      preferences: fc.anything(),
    }, { requiredKeys: ["format"] });
    fc.assert(fc.property(ours, (file) => {
      let text: string;
      try { text = JSON.stringify(file); } catch { return; } // BigInt and friends
      const r = parseSpotsFile(text);
      if (r.ok) {
        expect(Array.isArray(r.file.spots)).toBe(true);
        expect(r.skipped).toBeGreaterThanOrEqual(0);
      }
    }));
  });
});

describe("the planting form's date and count", () => {
  const MAX = 2027;

  it("gives a real calendar date, or a year alone, or nothing", () => {
    fc.assert(fc.property(typed, typed, typed, (y, m, d) => {
      const p = readPlanted(y, m, d, MAX);
      if (!p) return;
      expect(Number.isInteger(p.year) && p.year >= 1900 && p.year <= MAX).toBe(true);
      if (p.day !== undefined) expect(p.month).toBeDefined();
      if (p.month !== undefined) {
        expect(Number.isInteger(p.month) && p.month >= 1 && p.month <= 12).toBe(true);
      }
      if (p.day !== undefined) {
        const date = new Date(Date.UTC(p.year, p.month! - 1, p.day));
        expect(date.getUTCDate()).toBe(p.day); // no 31 February
      }
    }));
  });

  it("keeps every year, month and day the selects can offer when the date exists", () => {
    fc.assert(fc.property(fc.date({ min: new Date("1900-01-01"), max: new Date("2027-12-31"), noInvalidDate: true }), (date) => {
      const [y, m, d] = [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
      expect(readPlanted(String(y), String(m), String(d), MAX)).toEqual({ year: y, month: m, day: d });
    }));
  });

  it("counts a whole number from 1 to 999 whatever is typed", () => {
    fc.assert(fc.property(typed, (s) => {
      const n = readCount(s);
      expect(Number.isInteger(n) && n >= 1 && n <= 999).toBe(true);
    }));
  });
});
