import { describe, expect, it } from "vitest";
import { KNOWN_EMOJI, DECORATIVE_GLYPHS } from "./emoji";

// Every emoji the app can put in front of a reader needs a meaning, or a
// screen reader falls back to its Unicode name ("prohibited", "raised hand").
// `labelEmoji()` leaves an unknown glyph untouched rather than guess, so the
// only place a missing meaning shows up is here.

// The app's own sources, as text. French is left out: it carries the same
// emoji as the English it translates.
const FILES = import.meta.glob(
  ["../**/*.ts", "!../**/*.test.ts", "!../locales/fr.ts", "!../locales/*.fr.ts", "!../locales/prose.fr/**", "../../index.html"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

/** Symbols that match the pattern but read fine as they are. */
const READS_FINE = new Set(["©", "®", "™", "°", "·", "…", "–", "—"]);

/** String literals only: an arrow in a comment ("native→impostor") isn't shown. */
function literals(source: string): string[] {
  const text = source
    .split("\n")
    .filter((l: string) => !/^\s*(\/\/|\*|\/\*)/.test(l))
    .join("\n");
  return [...text.matchAll(/"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)].map((m) => m[1] ?? m[2] ?? "");
}

const GLYPH = /\p{Extended_Pictographic}|[✓✗✕↗←→↔⇒]/gu;

describe("emoji meanings", () => {
  it("covers every emoji the app shows", () => {
    const known = new Set([...KNOWN_EMOJI, ...DECORATIVE_GLYPHS]);
    const missing = new Map<string, string>();
    expect(Object.keys(FILES).length).toBeGreaterThan(100); // the glob found the app
    for (const [file, source] of Object.entries(FILES)) {
      const chunks = file.endsWith(".html") ? [source] : literals(source);
      for (const chunk of chunks) {
        for (const [g] of chunk.matchAll(GLYPH)) {
          if (!known.has(g) && !READS_FINE.has(g) && !missing.has(g)) {
            missing.set(g, file);
          }
        }
      }
    }
    expect(Object.fromEntries(missing)).toEqual({});
  });
});
