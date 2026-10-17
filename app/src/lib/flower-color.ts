// Flower colour as a colour.
//
// Every plant row names its bloom colour in words — "white", "pink-white",
// "sulphur-yellow", 93 spellings across the catalog — and until now the page
// printed the word and nothing else. A swatch beside the word is the one fact
// on a plant tile a reader takes in without reading, and Calscape, whose plant
// overview this borrows from, prints the words alone (#270).
//
// Two rules keep it honest:
//
//   1. **The word stays.** The swatch carries the meaning a second time, never
//      the first: a colour-blind reader and a screen reader lose nothing.
//   2. **Sixteen hues, not ninety-three.** Each hue is one token the theme
//      defines in light and in dark (`--flower-<hue>` in `styles.css`, in
//      `oklch()` with a hex fallback). The spellings in the data map onto them
//      here, by a table a person wrote, and a two-word colour ("pink-white") is
//      two hues shown as a split swatch, not a blend. A spelling this table
//      doesn't know gives no swatch and fails `flower-color.test.ts`, which
//      walks every shipped row — so a new spelling is a deliberate act, and the
//      long-run fix is a `FlowerColor` union on the row itself.
//
// The swatch's job is recognition on a card, not a paint chip: the test of a
// hue is whether a gardener who knows the plant nods.

export const FLOWER_HUES = [
  "white",
  "cream",
  "yellow",
  "orange",
  "red",
  "maroon",
  "pink",
  "magenta",
  "purple",
  "lavender",
  "blue",
  "violet",
  "green",
  "brown",
  "tan",
  "silver",
] as const;
export type FlowerHue = (typeof FLOWER_HUES)[number];

type Hues = readonly [FlowerHue] | readonly [FlowerHue, FlowerHue];

/** Every spelling the rows use today, and the hue or two it stands for. */
const SPELLINGS: Record<string, Hues> = {
  // whites and creams
  white: ["white"],
  cream: ["cream"],
  "creamy-white": ["cream"],
  "greenish-white": ["green", "white"],
  "white-pink": ["white", "pink"],
  "white to yellow": ["white", "yellow"],
  // greens — the dull green of a sedge or an oak catkin, not a leaf
  green: ["green"],
  greenish: ["green"],
  "pale green": ["green"],
  "gray-green": ["green"],
  "green-catkin": ["green"],
  "yellow-green": ["yellow", "green"],
  "green-yellow": ["green", "yellow"],
  "greenish-yellow": ["green", "yellow"],
  "pale yellow-green": ["yellow", "green"],
  "green-cream": ["green", "cream"],
  "green-purple": ["green", "purple"],
  "purple-green": ["purple", "green"],
  "green-brown": ["green", "brown"],
  "brown-green": ["brown", "green"],
  "greenish-pink": ["green", "pink"],
  "red-green": ["red", "green"],
  "silver-green": ["silver", "green"],
  // yellows and golds
  yellow: ["yellow"],
  "pale yellow": ["yellow"],
  "sulphur-yellow": ["yellow"],
  gold: ["yellow"],
  "yellow-catkin": ["yellow"],
  "yellow-orange": ["yellow", "orange"],
  "yellow-brown": ["yellow", "brown"],
  "red-yellow": ["red", "yellow"],
  "pink-yellow": ["pink", "yellow"],
  "silver-gold": ["silver", "yellow"],
  "copper-gold": ["orange", "yellow"],
  // oranges
  orange: ["orange"],
  apricot: ["orange"],
  "apricot-orange": ["orange"],
  "orange-tan": ["orange", "tan"],
  "orange-red": ["orange", "red"],
  "red-orange": ["red", "orange"],
  // reds
  red: ["red"],
  scarlet: ["red"],
  crimson: ["red"],
  "coral-red": ["red"],
  "dark red": ["red"],
  "rust-red": ["red"],
  "red-catkin": ["red"],
  "red-pink": ["red", "pink"],
  "pink-red": ["pink", "red"],
  "red-purple": ["red", "purple"],
  "dull red-brown": ["red", "brown"],
  maroon: ["maroon"],
  // pinks
  pink: ["pink"],
  "pale pink": ["pink"],
  "deep pink": ["pink"],
  "pink-white": ["pink", "white"],
  "cream-pink": ["cream", "pink"],
  "pink-purple": ["pink", "purple"],
  "purple-pink": ["purple", "pink"],
  "pink-lilac": ["pink", "lavender"],
  "pink-lavender": ["pink", "lavender"],
  magenta: ["magenta"],
  // purples, lavenders, violets, blues
  purple: ["purple"],
  "deep purple": ["purple"],
  "purple-tan": ["purple", "tan"],
  "purple-brown": ["purple", "brown"],
  "purple-gray": ["purple", "silver"],
  "gray-purple": ["silver", "purple"],
  lavender: ["lavender"],
  lilac: ["lavender"],
  "pale lilac": ["lavender"],
  "pale lavender": ["lavender"],
  mauve: ["lavender"],
  "pale violet": ["lavender"],
  violet: ["violet"],
  "blue-purple": ["violet"],
  "blue-violet": ["violet"],
  "violet-blue": ["violet"],
  blue: ["blue"],
  "pale blue": ["blue"],
  "blue-gray": ["blue", "silver"],
  "blue to pink": ["blue", "pink"],
  // browns, tans, silvers (mostly catkins and grasses)
  brown: ["brown"],
  "brown-catkin": ["brown"],
  "brown-cream": ["brown", "cream"],
  "brown-and-cream": ["brown", "cream"],
  tan: ["tan"],
  silver: ["silver"],
  silvery: ["silver"],
  "silver-grey": ["silver"],
  "gray-catkin": ["silver"],
};

/** The hue or two a row's colour word stands for, or null for a word this
 *  table doesn't know and for "none" (a plant whose bloom is nothing to see). */
export function flowerHues(color: string | null | undefined): Hues | null {
  if (!color) return null;
  const key = color.trim().toLowerCase();
  if (key === "none") return null;
  return SPELLINGS[key] ?? null;
}
