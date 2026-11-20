// The drawn silhouettes of the seven plant forms, so a plant means something
// offline with no photo. Shared by the ranked cards, the explore and plant
// pages, the region page's category chips and headings — and, off the browser
// entirely, by `scripts/gen-plant-cards.mjs`, which draws the same glyph at
// 300 px on every plant's share card. One species, one drawing, everywhere it
// appears.
//
// The table lives in its own module for that last reader: a Node script can
// import the geometry without pulling in the DOM. Nothing here touches
// `document` — `silhouetteFor` in `plant-card.ts` builds the browser's SVG,
// `glyphMarkup` below builds the string a headless render needs.
//
// It is a set, and the rules that keep it looking like one — a single ground
// line, one optical box, filled masses with stroked stems at one weight — live
// in `scripts/gen-form-glyphs.mjs`, which draws these paths. Edit the geometry
// there and paste its output back over the table below; the numbers here are
// generated, so hand-editing them is how a set stops being a set.

/** One part of a glyph: a filled mass, or a stem stroked at the stem weight. */
export type Mark = { d: string; stem?: true };
const F = (d: string): Mark => ({ d });
const S = (d: string): Mark => ({ d, stem: true });

export const FORM_GLYPHS: Record<string, Mark[]> = {
  tree: [
    F("M20.1 10.1Q24 3.9 27.9 10.1Q34.9 8.5 33.3 15.5Q39.5 19.4 33.3 23.3Q34.9 30.3 27.9 28.7Q24 34.9 20.1 28.7Q13.1 30.3 14.7 23.3Q8.5 19.4 14.7 15.5Q13.1 8.5 20.1 10.1Z"),
    S("M24 30.5v9.5"),
  ],
  shrub: [
    F("M7.5 27a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z"),
    F("M13.1 21.5a7.4 7.4 0 1 0 14.8 0a7.4 7.4 0 1 0 -14.8 0Z"),
    F("M21.7 21a7.8 7.8 0 1 0 15.6 0a7.8 7.8 0 1 0 -15.6 0Z"),
    F("M29.5 27.5a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z"),
    F("M10.5 29.5a13.5 6 0 1 0 27 0a13.5 6 0 1 0 -27 0Z"),
    F("M7.2 34.2a6.4 5.8 0 1 0 12.8 0a6.4 5.8 0 1 0 -12.8 0Z"),
    F("M28 34.2a6.4 5.8 0 1 0 12.8 0a6.4 5.8 0 1 0 -12.8 0Z"),
    S("M22 34.5L21.6 40"),
    S("M26 34.5L26.4 40"),
  ],
  perennial: [
    S("M24 40V20"),
    F("M24 11.1C26.5 9.5 25.9 5.8 24 4.5C22.1 5.8 21.5 9.5 24 11.1Z"),
    F("M26.9 12C29.9 12.2 31.5 8.9 30.8 6.7C28.5 6.7 25.8 9.2 26.9 12Z"),
    F("M28.7 14.5C31 16.4 34.3 14.6 34.9 12.4C33.1 11.1 29.5 11.6 28.7 14.5Z"),
    F("M28.7 17.5C29.5 20.4 33.1 20.9 34.9 19.6C34.3 17.4 31 15.6 28.7 17.5Z"),
    F("M26.9 20C25.8 22.8 28.5 25.3 30.8 25.3C31.5 23.1 29.9 19.8 26.9 20Z"),
    F("M24 20.9C21.5 22.5 22.1 26.2 24 27.5C25.9 26.2 26.5 22.5 24 20.9Z"),
    F("M21.1 20C18.1 19.8 16.5 23.1 17.2 25.3C19.5 25.3 22.2 22.8 21.1 20Z"),
    F("M19.3 17.5C17 15.6 13.7 17.4 13.1 19.6C14.9 20.9 18.5 20.4 19.3 17.5Z"),
    F("M19.3 14.5C18.5 11.6 14.9 11.1 13.1 12.4C13.7 14.6 17 16.4 19.3 14.5Z"),
    F("M21.1 12C22.2 9.2 19.5 6.7 17.2 6.7C16.5 8.9 18.1 12.2 21.1 12Z"),
    F("M20.3 16a3.7 3.7 0 1 0 7.4 0a3.7 3.7 0 1 0 -7.4 0Z"),
    F("M24 40C23.1 35.3 16.7 32.7 13.2 33.8C14 37.3 19.5 41.6 24 40Z"),
    F("M24 40C28.5 41.6 34 37.3 34.8 33.8C31.3 32.7 24.9 35.3 24 40Z"),
    F("M24 31C27.5 31.7 30.9 28 30.9 25.2C28.2 24.8 23.9 27.4 24 31Z"),
  ],
  grass: [
    F("M21.5 40Q19.8 24.5 21 9Q26 24.5 26.5 40Z"),
    F("M21.7 40Q28.4 26.5 32 13Q34.1 26.5 26.3 40Z"),
    F("M17.9 40Q11 29 9 18Q16.3 29 22.1 40Z"),
    F("M25.9 40Q34 28.5 39 17Q39.3 28.5 30.1 40Z"),
  ],
  vine: [
    S("M24 40V16.5c0-3.8 3.6-5.9 6-3.8 2.4 2 .8 5.6-2 4.4"),
    F("M24 35C23.2 29.4 16 26.5 11.9 28C12.7 32.3 18.8 37.1 24 35Z"),
    F("M24 26C29.2 28.1 35.3 23.3 36.1 19C32 17.5 24.8 20.4 24 26Z"),
  ],
  groundcover: [
    F("M24 38C21.2 32.7 11.9 31 7.7 33C10.1 37 18.7 40.8 24 38Z"),
    F("M24 38C29.3 40.8 37.9 37 40.3 33C36.1 31 26.8 32.7 24 38Z"),
    F("M24 38C25.4 33 20.5 27.8 16.5 27.4C15.6 31.2 18.9 37.6 24 38Z"),
    F("M24 38C29.1 37.6 32.4 31.2 31.5 27.4C27.5 27.8 22.6 33 24 38Z"),
  ],
  fern: [
    S("M24 40V11"),
    F("M24 34C21.9 29.5 14.8 28.4 11.5 30.4C13.2 33.9 19.8 36.8 24 34Z"),
    F("M24 34C28.2 36.8 34.8 33.9 36.5 30.4C33.2 28.4 26.1 29.5 24 34Z"),
    F("M24 26C22.5 21.9 16.5 20.7 13.6 22.4C14.8 25.5 20.3 28.3 24 26Z"),
    F("M24 26C27.7 28.3 33.2 25.5 34.4 22.4C31.5 20.7 25.5 21.9 24 26Z"),
    F("M24 19C23.2 15.4 18.5 14.4 16.1 15.8C16.9 18.5 20.9 21 24 19Z"),
    F("M24 19C27.1 21 31.1 18.5 31.9 15.8C29.5 14.4 24.8 15.4 24 19Z"),
    F("M24 13C23.7 10.2 20.4 9.3 18.6 10.5C18.9 12.6 21.6 14.5 24 13Z"),
    F("M24 13C26.4 14.5 29.1 12.6 29.4 10.5C27.6 9.3 24.3 10.2 24 13Z"),
  ],
};

/** Stems are drawn as strokes, so their weight is set here rather than in the
 *  path. 3.4 units of the 48-unit box is 2.8 px on the 40 px thumbnails; held
 *  at that ratio a 17 px chip icon would draw its stem barely over a pixel and
 *  read as grey, so below ~20 px the stem thickens to keep 1.4 px of ink. */
export function stemWidth(size: number): number {
  return Math.max(3.4, (48 * 1.4) / size);
}

/** The glyph as an SVG string, for a renderer with no DOM (the share-card
 *  generator). Same marks, same stem rule as `silhouetteFor`. */
export function glyphMarkup(form: string, size: number, color: string): string {
  const w = Math.round(stemWidth(size) * 100) / 100;
  const parts = (FORM_GLYPHS[form] ?? FORM_GLYPHS.perennial).map((m) =>
    m.stem
      ? `<path d="${m.d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="${m.d}" fill="${color}"/>`
  );
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${parts.join("")}</svg>`;
}
