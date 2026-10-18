// What a reader can type to find a region on the regions page: its name, its
// reference place, its country, or one of the states and provinces it covers
// (`RegionMeta.areas`). English and the reader's own language both count, so
// "California" and "Californie" find the same card in French.
//
// Accents fold away ("quebec" finds Québec, "ile-de-france" finds
// Île-de-France). Folding keeps an NFC string's length, so a hit's index in
// the folded text is its index in the original, which is what lets
// `markFolded` underline the original letters.
import type { RegionMeta } from "../data/region";
import { regionAreas, regionName, regionReference, regionShort } from "./names";
import { langTag } from "./i18n";

/** Lowercased, single-spaced, accents dropped. */
export const fold = (s: string): string =>
  s.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC").trim().toLowerCase().replace(/\s+/g, " ");

/** What people call these countries for short, which `Intl` doesn't give. */
const ALIASES: Record<string, string[]> = { US: ["USA"], GB: ["UK"] };

/** The country names for a region's codes, in English and in `tag`'s
 *  language. "GB-SCT" counts as the United Kingdom; Scotland itself is one of
 *  that region's areas. */
export function countryNames(codes: string[], tag: string): string[] {
  const out = new Set<string>();
  for (const code of codes) {
    const country = code.split("-")[0];
    for (const lang of new Set(["en", tag])) {
      const name = new Intl.DisplayNames([lang], { type: "region" }).of(country);
      if (name && name !== country) out.add(name);
    }
    for (const a of ALIASES[country] ?? []) out.add(a);
  }
  return [...out];
}

export interface RegionSearch {
  /** Everything a query can hit, folded. */
  hay: string;
  /** The areas the card would name if one matched: [shown, ...also matches]. */
  areas: { shown: string; hay: string }[];
}

export function regionSearch(meta: RegionMeta, tag = langTag()): RegionSearch {
  const local = regionAreas(meta);
  const areas = meta.areas.map((en, i) => {
    const shown = local[i] ?? en;
    return { shown, hay: fold(`${shown} | ${en}`) };
  });
  const words = [
    regionName(meta), regionShort(meta), regionReference(meta),
    meta.name, meta.reference,
    ...countryNames(meta.countries, tag),
    ...areas.map((a) => a.hay),
  ];
  return { hay: fold(words.join(" | ")), areas };
}

/**
 * The areas worth naming on the card for this query: only when the card shows
 * nothing it hit. "france" is underlined in "Atlantic France" already, so
 * listing Île-de-France beneath it would explain a match nobody asked about.
 */
export function areasMatching(s: RegionSearch, fq: string, visible: string): string[] {
  if (!fq || fold(visible).includes(fq)) return [];
  return s.areas.filter((a) => a.hay.includes(fq)).map((a) => a.shown);
}

/** Split `text` around every folded hit of `fq`, for a caller to wrap the hits. */
export function markFolded(text: string, fq: string): { text: string; hit: boolean }[] {
  if (!fq) return [{ text, hit: false }];
  const hay = fold(text);
  // `fold` trims and squeezes spaces; a display name is already single-spaced,
  // so a length change is rare, and means the indices can't be trusted: leave
  // the text unmarked rather than underline the wrong letters.
  if (hay.length !== text.length) return [{ text, hit: false }];
  const out: { text: string; hit: boolean }[] = [];
  let i = 0;
  for (let at = hay.indexOf(fq); at !== -1; at = hay.indexOf(fq, i)) {
    if (at > i) out.push({ text: text.slice(i, at), hit: false });
    out.push({ text: text.slice(at, at + fq.length), hit: true });
    i = at + fq.length;
  }
  if (i < text.length) out.push({ text: text.slice(i), hit: false });
  return out;
}
