// The drawn silhouettes of the wildlife kinds, so an animal means something
// offline with no photo — the counterpart to `plant-glyphs.ts`, and drawn to the
// same rules so the two sets look like one hand: a single optical box, filled
// masses with any stem stroked at one weight, roughly equal ink, brand green.
//
// Why drawn, not emoji: the OS butterfly emoji is a pinned specimen, stiff and
// symmetrical the way they only ever are in a museum drawer. Every animal here
// is drawn in a pose it holds while alive (the butterfly basking, wings open
// and forewings swept forward), and a moth is a moth rather than the moon the
// app used to borrow for "night".
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
  // Seen from above, wings open as it basks or feeds: forewings wider than tall
  // and swept out to a point, rounded hindwings tucked close beneath them, a
  // slim body between, and thin antennae standing clear with clubbed tips. The
  // old drawing's wings were too round and its antennae knotted into them.
  butterfly: [
    F("M23 17.5C18 12.5 10.5 8.5 6.6 9.2C4.6 9.6 4.4 12.5 5.8 16.5C7.4 21 9.6 25 12.5 26.4C16.2 27.8 20.2 26.8 23 25Z"),
    F("M25 17.5C30 12.5 37.5 8.5 41.4 9.2C43.4 9.6 43.6 12.5 42.2 16.5C40.6 21 38.4 25 35.5 26.4C31.8 27.8 27.8 26.8 25 25Z"),
    F("M23 25.6C19 26 13.6 27.6 11 31C9 33.8 10.2 38.6 14.2 38.2C18.2 37.8 21.6 34 23 29.5Z"),
    F("M25 25.6C29 26 34.4 27.6 37 31C39 33.8 37.8 38.6 33.8 38.2C29.8 37.8 26.4 34 25 29.5Z"),
    F("M24 15.5C25.1 15.5 25.7 17.3 25.7 20V33C25.7 35.8 25 37.5 24 37.5C23 37.5 22.3 35.8 22.3 33V20C22.3 17.3 22.9 15.5 24 15.5Z"),
    F("M21.8 13.6a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0Z"),
    S("M23 12C21.8 9 20.2 7.2 18 6.2"),
    S("M25 12C26.2 9 27.8 7.2 30 6.2"),
    F("M16 6a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0Z"),
    F("M28.8 6a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0Z"),
  ],
  // At rest, from above: the forewings fold back into a broad triangle with its
  // point at the head, the shape that tells a moth from a butterfly at a glance.
  // The antennae are feathered wedges, not thin clubbed threads.
  moth: [
    F("M23.4 13.5C20 17 12.5 25.5 6.5 34C5.4 35.6 6 37.6 8.2 38C12.5 38.6 18.5 38 23.4 36Z"),
    F("M24.6 13.5C28 17 35.5 25.5 41.5 34C42.6 35.6 42 37.6 39.8 38C35.5 38.6 29.5 38 24.6 36Z"),
    F("M21.2 11.2a2.8 2.8 0 1 0 5.6 0a2.8 2.8 0 1 0 -5.6 0Z"),
    F("M22.6 9.6C22.7 6.7 19.3 3 17.1 2.5C17 4.8 19.7 9 22.6 9.6Z"),
    F("M25.4 9.6C28.3 9 31 4.8 30.9 2.5C28.7 3 25.3 6.7 25.4 9.6Z"),
  ],
  // A bumble bee in profile, flying left: head, a round furry thorax, and a
  // banded abdomen whose stripes are the gaps between its segments. The wings
  // are outlines, clear rather than solid, swept up and back; two bent legs hang
  // below. The old solid wing and stiff legs read as a small four-legged animal.
  bee: [
    F("M6.5 24a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z"),
    F("M12.6 23a6.4 6.4 0 1 0 12.8 0a6.4 6.4 0 1 0 -12.8 0Z"),
    F("M24.6 21.7A9.5 7.6 0 0 1 29 19.3L29 33.7A9.5 7.6 0 0 1 24.6 31.3Z"),
    F("M30.4 19A9.5 7.6 0 0 1 34.6 19.2L34.6 33.8A9.5 7.6 0 0 1 30.4 34Z"),
    F("M36 19.6A9.5 7.6 0 0 1 41.5 26.5L41.5 26.5A9.5 7.6 0 0 1 36 33.4Z"),
    S("M20.5 17.5C25.9 18.1 33.4 12.5 34.9 8.5C30.7 8.1 22.3 12.4 20.5 17.5Z"),
    S("M21.5 18C25.2 20.2 32.1 18.3 34.3 15.7C31.4 14.1 24.2 14.7 21.5 18Z"),
    S("M8.5 20.5L7.6 16.2L4.4 14.6"),
    S("M16 29L14.4 33.4L11.8 34.6"),
    S("M24.6 28.6L26.2 33.4L25 35.8"),
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
  // A squirrel sitting up in profile, facing left: head, ear and body drawn as
  // one overlapping mass, a forepaw at the chest, and the big tail pressed up its
  // back and curling over the top. The old drawing's parts floated apart.
  mammal: [
    F("M12.3 31a8.2 9.2 0 1 0 16.4 0a8.2 9.2 0 1 0 -16.4 0Z"),
    F("M10 19.2a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z"),
    F("M11 16.8L7.4 20.4C6.8 21 7.1 22 8 22.1L12.4 23.4Z"),
    F("M13.6 15C13.4 11.8 14.6 9.4 16.4 9.2C17.6 9.4 18.4 11.6 19 14.4Z"),
    F("M10.6 28.6a2.8 2.3 0 1 0 5.6 0a2.8 2.3 0 1 0 -5.6 0Z"),
    F("M11.6 39.6a5.4 1.8 0 1 0 10.8 0a5.4 1.8 0 1 0 -10.8 0Z"),
    F("M25 39C33 41 41.5 35.5 42 25C42.5 15 37.5 7.2 30.5 7.2C26.5 7.2 23.8 9.6 24.2 12.6C27.6 10.6 32.4 12.4 33.8 17.5C35.4 23.4 33 29 26.6 32.6Z"),
  ],
  // A gopher tortoise in profile, facing left: a high domed shell, a head held
  // low and forward on a stout neck, thick elephant legs and a stub of tail.
  tortoise: [
    F("M9.2 32.2C9.2 19.5 16 13 24.6 13C33.2 13 40 19.5 40 32.2Z"),
    F("M8.6 31.5H40.6C40.9 33.2 40.1 34.5 38.6 34.5H10.6C9.1 34.5 8.3 33.2 8.6 31.5Z"),
    F("M11 31.6C8.6 29.6 5.4 29.2 3.4 30.6C1.6 31.9 2.2 34.8 4.8 35C7.4 35.2 10 34.6 12.4 34.4Z"),
    F("M11 34H18V38.8C18 39.7 17.3 40.3 16.4 40.3H12C11.1 40.3 10.4 39.6 10.6 38.7Z"),
    F("M30.6 34H37.6L38 38.7C38.1 39.6 37.5 40.3 36.6 40.3H32.2C31.3 40.3 30.6 39.7 30.6 38.8Z"),
    F("M40 32.4L43 33.8L40 34.4Z"),
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
