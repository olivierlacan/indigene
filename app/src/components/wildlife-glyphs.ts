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

/** The glyph keys — the five kinds plus the tortoise the reptile borrows. */
export type WildlifeGlyphKey = WildlifeKind | "tortoise";

export const WILDLIFE_GLYPHS: Record<WildlifeGlyphKey, Mark[]> = {
  // Dorsal, forewings swept up toward the top corners — the flying pose, not the
  // pinned one. The body is a slender spindle; the antennae clear the wings and
  // club at the ends, or the whole thing reads as a leaf.
  butterfly: [
    F("M23 18C21.3 11 14.5 5.5 8.5 6.6C3.2 7.6 3.4 15.8 8.4 20.4C12.4 24.1 18.4 25.3 23 25Z"),
    F("M25 18C26.7 11 33.5 5.5 39.5 6.6C44.8 7.6 44.6 15.8 39.6 20.4C35.6 24.1 29.6 25.3 25 25Z"),
    F("M23 27C20 29.6 13.3 31.1 10.7 34.7C8 38.5 12.3 43.6 17 42C21 40.6 23.2 34.8 23 27Z"),
    F("M25 27C28 29.6 34.7 31.1 37.3 34.7C40 38.5 35.7 43.6 31 42C27 40.6 24.8 34.8 25 27Z"),
    F("M24 13.5C25.5 13.5 26.3 15.1 26.3 17.7V34.3C26.3 37.4 25.4 39.4 24 39.4C22.6 39.4 21.7 37.4 21.7 34.3V17.7C21.7 15.1 22.5 13.5 24 13.5Z"),
    F("M24 8.5a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 1 0 0-5.4Z"),
    S("M23 10C21 6.5 18.5 5 16 4.6"),
    S("M25 10C27 6.5 29.5 5 32 4.6"),
    F("M15.6 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 1 0 0-3.8Z"),
    F("M32.4 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 1 0 0-3.8Z"),
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
  // Top-down bee: a fat, rounded body and a round head, two pairs of wings held
  // up and out. Single colour loses the stripes, so the heft of the body carries
  // it — rounder and stouter than the moth.
  bee: [
    F("M24 15.5C28.4 15.5 31 20 31 27C31 34.5 28 40.5 24 40.5C20 40.5 17 34.5 17 27C17 20 19.6 15.5 24 15.5Z"),
    F("M24 9.5a4 4 0 1 0 0 8 4 4 0 1 0 0-8Z"),
    F("M20.5 20C15.5 16.5 8.5 16.5 5.2 21C3.2 24 6 27.5 11 27.5C15.5 27.5 19.5 24 20.5 20Z"),
    F("M27.5 20C32.5 16.5 39.5 16.5 42.8 21C44.8 24 42 27.5 37 27.5C32.5 27.5 28.5 24 27.5 20Z"),
    S("M22.5 8C20.5 5.5 18 4.5 15.5 5"),
    S("M25.5 8C27.5 5.5 30 4.5 32.5 5"),
  ],
  // A songbird perched in profile, facing left — a plump breast, a round head
  // set off by a short beak, a long tail cocked to the right, two legs. The most
  // recognizable single-colour bird there is.
  bird: [
    F("M14 32C13 25 19 19.5 26 20.5C31 21.2 33.5 25 33 29.5C32.5 34 29 36.8 23.5 37C17.5 37.2 15 36 14 32Z"),
    F("M15.5 22.5a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 1 0 0-11.2Z"),
    F("M10.5 26.5L4 28.5L10.5 30.5Z"),
    F("M31.5 30C36.5 30.3 41.5 32.5 44.5 35.2C45 36.7 43.5 37.4 41.5 36.6L30.5 33.5Z"),
    S("M20 36.5L20 41.5"),
    S("M24.5 36.5L24.5 41.5"),
  ],
  // A small mammal sitting in profile, facing left — a dormouse or squirrel: a
  // round head with a cocked ear, a plump sitting body, and the big curled tail
  // sweeping up behind. The tail is the tell.
  mammal: [
    F("M28 40C34 40 39 34 39.5 26C40 19 36.5 13.5 31 13.5C33.5 16.5 34.5 20.5 33 25C31.5 29.5 28 33 24.5 34.5C22.5 35.5 24.5 40 28 40Z"),
    F("M13 33C12.5 27 16 22.5 21 22.5C26 22.5 30 27 30 33C30 38.5 26 42 20.5 42C15 42 13.5 37.5 13 33Z"),
    F("M14 18.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 1 0 0-11Z"),
    F("M10 19C8.5 16 9.5 13 12 12.5C13.5 14 13.5 17 12 19.5Z"),
    F("M9 22.5L4.5 24.5L9 26.5Z"),
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
