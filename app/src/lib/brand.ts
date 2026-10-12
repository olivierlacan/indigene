// The app's name and tagline, from one file (`data/brand.json`).
//
// The tagline appears in the page title, the share tags, the 404 page, the
// install name, the share cards and the film's share text. Each used to carry
// its own copy, and they drifted: five said one thing, the sixth another. Now
// `index.html` takes it
// through `vite.config.ts`, `404.html` and the manifest through
// `scripts/prerender.mjs`, the cards through their generators, and the
// locale files through this module. `brand.test.ts` fails on any copy typed
// out anywhere else.
import BRAND from "../data/brand.json";

export type BrandLang = keyof typeof BRAND.tagline;

export const APP_NAME = BRAND.name;

/** The app's name, a dash, and the tagline. */
export function appTitle(lang: BrandLang = "en"): string {
  return `${BRAND.name} — ${BRAND.tagline[lang]}`;
}

/** The tagline as the start of a sentence, capitalized. */
export function taglineSentence(lang: BrandLang = "en"): string {
  const t = BRAND.tagline[lang];
  return t.charAt(0).toUpperCase() + t.slice(1);
}
