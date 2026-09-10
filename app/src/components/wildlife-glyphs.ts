// The drawn silhouettes of the wildlife kinds, so an animal means something
// offline with no photo — the counterpart to `plant-glyphs.ts`, and drawn to the
// same rules so the two sets look like one hand: a single optical box, filled
// masses with any stem stroked at one weight, roughly equal ink, brand green.
//
// Why drawn, not emoji: the OS butterfly emoji is a pinned specimen — wings
// spread flat the way they only ever are in a museum drawer. A living butterfly
// holds its forewings swept up. Every animal here is drawn in a pose it holds
// while alive, and a moth is a moth rather than the moon the app used to borrow
// for "night".
//
// A kind, not a species: all 47 butterflies share one butterfly the way every
// perennial shares one perennial glyph — the drawing is honest about the kind
// and leaves recognition to the name and the photograph, which is exactly what
// the plant forms do. The one animal whose kind lies is the gopher tortoise: it
// browses under "Mammals & others" but is a reptile, so it's resolved by its
// iconic taxon to its own shell (`glyphKeyFor`).
//
// Like `plant-glyphs.ts`, nothing here touches `document`: the table and the
// string builder are importable by the Node card generator
// (`scripts/gen-wildlife-cards.mjs`), and the browser's DOM copy lives in
// `wildlife-thumb.ts`.
import type { IconicTaxon, WildlifeKind } from "../types";
import type { Mark } from "./plant-glyphs";

const F = (d: string): Mark => ({ d });
const S = (d: string): Mark => ({ d, stem: true });

/** A circle as two explicit arcs — starts at the left edge and returns, so the
 *  shape sits centred on (cx, cy) rather than half a radius off. */
const circle = (cx: number, cy: number, r: number): string =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

/** The glyph keys — the five kinds plus the tortoise the reptile borrows. */
export type WildlifeGlyphKey = WildlifeKind | "tortoise";

export const WILDLIFE_GLYPHS: Record<WildlifeGlyphKey, Mark[]> = {
  // Wings up in a heart, not spread flat on a board — the difference between a
  // butterfly fluttering and one pinned in a drawer. The forewings sweep up and
  // nearly meet at the top; the hindwings round out below; the body is a short
  // spindle tucked within them so nothing pokes out like a stinger; the antennae
  // clear the wings and club at the ends.
  butterfly: [
    F("M22.6 20C20.2 11.5 15 4.5 10 4.8C6.4 5 5.5 10 7.6 16.2C9.7 22.4 15 27 22 28C23.1 24 23.1 22.2 22.6 20Z"),
    F("M25.4 20C27.8 11.5 33 4.5 38 4.8C41.6 5 42.5 10 40.4 16.2C38.3 22.4 33 27 26 28C24.9 24 24.9 22.2 25.4 20Z"),
    F("M22.5 28C19.5 29.5 13.5 30.5 10.5 34.5C8.2 37.5 10.3 42 14.8 40.6C19 39.3 22.7 34.5 23 29Z"),
    F("M25.5 28C28.5 29.5 34.5 30.5 37.5 34.5C39.8 37.5 37.7 42 33.2 40.6C29 39.3 25.3 34.5 25 29Z"),
    F("M24 16C25.3 16 26 17.6 26 20V34C26 37 25.1 38.8 24 38.8C22.9 38.8 22 37 22 34V20C22 17.6 22.7 16 24 16Z"),
    F(circle(24, 14.5, 2.6)),
    S("M23 12C21.3 8.5 19 7 16.5 7"),
    S("M25 12C26.7 8.5 29 7 31.5 7"),
    F(circle(16, 6.6, 1.8)),
    F(circle(32, 6.6, 1.8)),
  ],
  // A moth at rest: broad forewings swept back into a delta over a stout, furry
  // body, with feathered antennae combed back. The triangle is what tells it
  // from a butterfly at a glance.
  moth: [
    F("M23 18C16.5 16 8 20.5 4.2 31C3.2 33.8 5.2 36.2 8.6 35.4C15 33.8 20.5 28.5 23.2 20.5Z"),
    F("M25 18C31.5 16 40 20.5 43.8 31C44.8 33.8 42.8 36.2 39.4 35.4C33 33.8 27.5 28.5 24.8 20.5Z"),
    F("M23 25C18.5 25.5 12.5 29 10 35.5C9 38.2 11 40 14 39C18.5 37.5 22 32 23.4 26Z"),
    F("M25 25C29.5 25.5 35.5 29 38 35.5C39 38.2 37 40 34 39C29.5 37.5 26 32 24.6 26Z"),
    F("M24 12C26.4 12 27.8 14.4 27.8 18V38C27.8 41.3 26.2 43.5 24 43.5C21.8 43.5 20.2 41.3 20.2 38V18C20.2 14.4 21.6 12 24 12Z"),
    F("M24 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6Z"),
    S("M22.5 9.5C19 6.5 14 5.5 10 7"),
    S("M25.5 9.5C29 6.5 34 5.5 38 7"),
  ],
  // A bee in profile, flying left — the view that tells it from a bird. A fat
  // body tapering to a stinger at the back, a round head with two antennae, two
  // wings held up and back, and three legs dangling. Single colour loses the
  // stripes, so the tapered body and the hanging legs carry it.
  bee: [
    F("M10 25C10 19.5 15.5 16 24 16C33 16 39.5 19.5 40.5 24.5C41 27 39 29.5 34 30.5C24 32.5 10 30.5 10 25Z"),
    F("M39.5 22.5L44.5 25L39.5 27.5Z"),
    F(circle(8.5, 24, 3.8)),
    S("M6.5 20.5C5 18 3.5 17 2 17"),
    S("M8 20C7.2 17.2 6.2 16.2 4.8 15.8"),
    F("M20 16C18 8.5 22.5 3.5 28.5 4C33.5 4.4 34 9.5 30 13C27 15.5 23 16.5 20 16Z"),
    F("M26 16.5C25 9.5 29.5 5 35 6C39 6.7 39 11.5 35 14.5C32 16.7 28 16.8 26 16.5Z"),
    S("M15 30L13.5 35"),
    S("M21 31L20.5 36"),
    S("M27 30.5L27.5 35.5"),
  ],
  // A songbird perched in profile, facing left — a plump breast, a round head
  // set off by a short beak, a folded wing on the flank, a tail behind, two
  // legs. The folded wing and the short beak are what keep it a bird and not a
  // blob.
  bird: [
    F("M12 31C11.5 24.5 15.5 20 22 20C30 20 34.5 24 34.5 29C34.5 33.5 30.5 36.8 24 37.2C17 37.6 12.5 35 12 31Z"),
    F(circle(15, 19.5, 5.4)),
    F("M10.2 18.5L5 20L10.2 21.6Z"),
    F("M32.5 27.5C37 27.5 41.5 29.5 44 32.5C44.6 33.6 43.4 34.6 41.8 34L31 31Z"),
    F("M22 27C26.5 26 31 27.5 32.5 31C29.5 33 24 33 22 30.5Z"),
    S("M20 37L19.5 41.5"),
    S("M24.5 37L25 41.5"),
  ],
  // A squirrel sitting in profile, facing left — a round head with a pointed
  // snout and a cocked ear, a plump upright body with a paw at the chest, and the
  // big bushy tail arcing up behind. The ear and the fat tail are what keep it a
  // mammal and not a bird.
  mammal: [
    F("M27 40C35 39.5 41 32.5 41 22.5C41 14.5 36 9 28.5 9.5C33 12.5 34.5 17.5 33 22.5C31.4 28 27.5 31.5 23.5 33.5C21.3 34.6 23.5 40.4 27 40Z"),
    F("M11 34.5C10.5 28 14 23.5 19.5 23.5C24.5 23.5 28.5 27 29 32C29.5 37.5 25 41.5 19 41.5C13.5 41.5 11.5 39 11 34.5Z"),
    F(circle(15, 18.5, 5.2)),
    F("M9.5 18.5L5 20.2L9.8 21.8Z"),
    F("M12 13.5C10.7 9 12.6 6.3 15.2 6.9C16.3 9 15.8 12.2 14.2 13.9Z"),
    F("M11 31.5C8.8 31 7.6 32.6 8.2 34.2C9.8 34.7 11.5 33.6 12 32Z"),
  ],
  // A tortoise in profile — a high domed shell over a flat plastron line, a head
  // reaching forward and two stumped legs. Slow, and unmistakably not a mammal.
  tortoise: [
    F("M8 33C8 22.5 15.5 17 24 17C32.5 17 40 22.5 40 33C40 34 39 34.5 38 34.5L10 34.5C9 34.5 8 34 8 33Z"),
    F("M9 30C5.5 28.5 2.5 29 2 31.5C1.5 34 4 35.5 8 35C10 34.7 10 31 9 30Z"),
    F("M13 34.5C11.5 34.5 11 37 11.5 39C12 40.5 14.5 40.5 15.5 39L16.5 34.5Z"),
    F("M35 34.5C36.5 34.5 37 37 36.5 39C36 40.5 33.5 40.5 32.5 39L31.5 34.5Z"),
    F("M40 27C42.5 26 44.5 27 44.5 29C44 30.5 41.5 31 40 30Z"),
  ],
};

/** The glyph an animal should wear. Almost always its kind, but the gopher
 *  tortoise's kind is "mammal" (it browses there) while it is a reptile, so the
 *  iconic taxon overrides — the one place a kind can lie about the drawing. */
export function glyphKeyFor(kind: WildlifeKind, iconic?: IconicTaxon): WildlifeGlyphKey {
  if (iconic === "Reptilia") return "tortoise";
  return kind;
}

/** Stems (antennae, legs) are strokes, so their weight is set here, not in the
 *  path — the same rule and ratio as the plant glyphs, so a thumbnail and a
 *  chip-sized glyph both keep about 1.4 px of ink in the thinnest line. */
export function stemWidth(size: number): number {
  return Math.max(2.6, (48 * 1.3) / size);
}

/** The glyph as an SVG string, for a renderer with no DOM (the card generator).
 *  Same marks and stem rule as the browser's `wildlifeSilhouette`. */
export function wildlifeGlyphMarkup(key: WildlifeGlyphKey, size: number, color: string): string {
  const w = Math.round(stemWidth(size) * 100) / 100;
  const parts = (WILDLIFE_GLYPHS[key] ?? WILDLIFE_GLYPHS.butterfly).map((m) =>
    m.stem
      ? `<path d="${m.d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="${m.d}" fill="${color}"/>`
  );
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${parts.join("")}</svg>`;
}
