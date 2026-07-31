// The language layer. Hand-rolled, ~2 KB, no dependency — the same instinct as
// the rest of the app (vanilla TS, real DOM, nothing you can't read in one
// sitting).
//
// Three rules shape it:
//
//  1. **English is the key set.** `locales/en.ts` is the source of truth; every
//     other locale is typed against it (`Dict`), so a missing or misspelt key
//     is a compile error, not a blank on someone's screen. There is no runtime
//     "key not found" path to discover in production.
//  2. **The choice is the user's, the guess is only a default.** We read
//     `navigator.language` once, and from the moment someone picks a language
//     by hand that pick wins forever — over the browser's guess and over a
//     `?lang=` in a link someone sent them (see `langFromUrl()`). Same instinct
//     as the sun picker: the sensor is a suggestion, the human is the answer.
//  3. **Language and units are separate settings.** A French speaker in Ohio
//     wants French and feet; an American in Paris wants English and metres.
//     Nothing here reaches into `units.ts`, and `units.ts` only reads the
//     language to format numbers (1,000.5 vs 1 000,5) — never to pick a system.
import { en } from "../locales/en";
import { fr } from "../locales/fr";
import type { Dict, TKey } from "../locales/en";

export type Lang = "en" | "fr";

/** Every language the app ships, with the name each calls itself. A language
 *  picker that says "French" to a French speaker is a picker they can't read. */
export const LANGUAGES: { code: Lang; endonym: string }[] = [
  { code: "en", endonym: "English" },
  { code: "fr", endonym: "Français" },
];

const DICTS: Record<Lang, Dict> = { en, fr };

const STORAGE_KEY = "indigene:lang";

/** The query parameter that pins a link to one language: `?lang=fr`. */
const URL_PARAM = "lang";

function isLang(v: string | null | undefined): v is Lang {
  return v === "en" || v === "fr";
}

/** Reduce anything BCP 47-shaped to a language we ship: "fr-CA" → "fr". */
function toLang(tag: string | null | undefined): Lang | undefined {
  const base = String(tag ?? "").toLowerCase().split("-")[0];
  return isLang(base) ? base : undefined;
}

/**
 * A language pinned by the URL — the shareable-link case.
 *
 *   https://indigene.app/?lang=fr#/plants/quercus-alba
 *   https://indigene.app/#/plants/quercus-alba?lang=fr
 *
 * Both forms work, because both are things a person plausibly types. The app
 * routes on the hash but the canonical plant URLs are real paths, so a link can
 * arrive with its query on either side of the `#` and neither reading is wrong.
 *
 * It does *not* beat a choice the reader has already made. A link is a guess
 * about someone by whoever sent it; a pick in the settings screen is that
 * person speaking for themselves, and a stranger's link doesn't get to talk
 * over it. So the parameter sits exactly where the browser's own preference
 * used to: it decides for a first-time visitor — which is the whole point of
 * sending one — and is ignored by anyone who has set their language by hand.
 */
function langFromUrl(): Lang | undefined {
  try {
    const q = location.hash.indexOf("?");
    const inHash = q >= 0 ? new URLSearchParams(location.hash.slice(q + 1)) : null;
    return (
      toLang(new URLSearchParams(location.search).get(URL_PARAM)) ??
      toLang(inHash?.get(URL_PARAM))
    );
  } catch {
    // A malformed URL is not worth a blank app.
    return undefined;
  }
}

function remember(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Private-mode Safari throws on localStorage. A language pick that doesn't
    // persist is a small loss; a blank app is a total one.
  }
}

/**
 * The starting language, in order of who is doing the asking:
 *
 *  1. **What this reader chose**, in the settings screen, at any point in the
 *     past. Nothing outranks it.
 *  2. **A `?lang=` in the link they followed** — someone else's guess about
 *     them, which is worth acting on only because nobody better has spoken.
 *  3. **The browser's own preference list**, the device's guess.
 *  4. English.
 *
 * `navigator.languages` is ordered by how much the person wants each one, so we
 * walk it in order and take the first we actually speak — "fr-CA" and "fr" both
 * mean French to us.
 */
function detect(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // See remember(): storage can throw. Fall through to the guesses — and note
    // this is also the browser where a `?lang=` link *does* win every time,
    // because there is no stored choice for it to talk over.
  }

  const pinned = langFromUrl();
  if (pinned) {
    // Persist it, because the parameter is stripped from the address bar a
    // moment later (see `consumeLangParam`) and the choice has to outlive it —
    // through the next tap, the next page, and the next visit. From here on
    // it's this reader's choice, and the next link can't overrule it either.
    remember(pinned);
    return pinned;
  }

  const wanted = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of wanted) {
    const base = toLang(tag);
    if (base) return base;
  }
  return "en";
}

let current: Lang = detect();
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return current;
}

/** The BCP 47 tag to hand `Intl` and to stamp on `<html lang>`. */
export function langTag(): string {
  return current;
}

export function setLang(next: Lang): void {
  if (next === current) return;
  current = next;
  remember(next);
  applyDocumentLang();
  listeners.forEach((fn) => fn());
}

/**
 * Take `?lang=` back out of the address bar, once it has been read.
 *
 * The parameter is an *instruction*, not part of the page's identity: the same
 * plant profile in French and in English is one page, and the language is now a
 * setting like any other. Leaving the parameter behind would make the address
 * bar disagree with the app the moment someone used the picker — a URL claiming
 * `?lang=fr` on a screen full of English, ready to be copied and passed on. So
 * we act on it and clear it, and the URL you'd share from here is the clean one.
 *
 * It also keeps the router honest: `#/plants/quercus-alba?lang=fr` has to lose
 * its query before `currentRoute()` reads that slug.
 *
 * Must run before the first route() — call it from boot().
 */
export function consumeLangParam(): void {
  const url = new URL(location.href);
  let changed = url.searchParams.has(URL_PARAM);
  url.searchParams.delete(URL_PARAM);

  const q = url.hash.indexOf("?");
  if (q >= 0) {
    const params = new URLSearchParams(url.hash.slice(q + 1));
    if (params.has(URL_PARAM)) {
      params.delete(URL_PARAM);
      const rest = params.toString();
      url.hash = url.hash.slice(0, q) + (rest ? `?${rest}` : "");
      changed = true;
    }
  }
  if (!changed) return;
  history.replaceState(history.state, "", url.pathname + url.search + url.hash);
}

/** Keep `<html lang>` honest — it's what screen readers pick a voice from and
 *  what the browser hyphenates by, so it has to track the actual UI language. */
export function applyDocumentLang(): void {
  document.documentElement.lang = current;
}

/** Re-render hook. `main.ts` subscribes and re-runs the current route, which
 *  redraws every screen in the new language without losing the in-memory draft
 *  a page reload would throw away. */
export function onLangChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export type Params = Record<string, string | number>;

/**
 * The keys `tn()` accepts: the *stem* of a plural pair, derived from the
 * dictionary rather than listed by hand. `"welcome.openSaved.one"` in `en.ts`
 * is what makes `tn("welcome.openSaved", n)` type-check — so a plural stem
 * with only one of its two halves written is a compile error at the call site.
 */
type PluralBase<K> = K extends `${infer Base}.one` ? Base : never;
export type TPluralKey = PluralBase<TKey>;

/** Substitute `{name}` placeholders. Unknown placeholders are left alone rather
 *  than blanked, so a typo shows up as `{oops}` in review instead of vanishing. */
function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole
  );
}

/** Look a key up in the active language, falling back to English. The fallback
 *  can't fire today (the types guarantee coverage) but it means a locale file
 *  half-written on a branch degrades to English rather than to blank. */
export function t(key: TKey, params?: Params): string {
  const dict = DICTS[current];
  return interpolate(dict[key] ?? en[key], params);
}

/**
 * Look up a key that isn't in the type — for values that come from *data*
 * rather than from code, where a new one can land in a catalog file without a
 * matching dictionary entry (bloom colours are the case that needs this).
 *
 * Returns `undefined` rather than a blank so the caller can fall back to the
 * raw data value: an untranslated "greenish-yellow" is a small wart, an empty
 * space where a flower colour should be is a bug.
 */
export function tOptional(key: string): string | undefined {
  const dict = DICTS[current] as Record<string, string | undefined>;
  return dict[key] ?? (en as Record<string, string | undefined>)[key];
}

/**
 * Plural-aware lookup: `key` names a pair of entries, `<key>.one` and
 * `<key>.other`, and `{n}` is filled in for you.
 *
 * The two languages disagree about zero — English says "0 plants", French says
 * "0 plante" — so the rule is per-language rather than a shared `n === 1`.
 * That's the whole of CLDR's rules for en and fr; anything more elaborate is a
 * library we don't need.
 */
export function tn(key: TPluralKey, n: number, params?: Params): string {
  const one = current === "fr" ? Math.abs(n) < 2 : n === 1;
  const full = `${key}.${one ? "one" : "other"}` as TKey;
  return t(full, { n, ...params });
}

/**
 * The rich-text form: a translated template that has real DOM in the middle of
 * it — a link, a `<strong>`, a button. Returns the pieces in order, ready to
 * hand straight to `el(...)` or `append(...)`.
 *
 *   tx("confirm.zone", { link: el("a", { href }, "USDA zone 7a") })
 *   // "Winters here get down to about −12 °C ({link})." →
 *   // ["Winters here get down to about −12 °C (", <a>, ")."]
 *
 * This exists so a translator can move the link to wherever the sentence wants
 * it. Splitting a sentence into "before" and "after" halves in the code hard-
 * codes English word order, and French almost never agrees with it.
 */
export function tx(key: TKey, nodes: Record<string, Node | string>, params?: Params): (Node | string)[] {
  const template = interpolate(DICTS[current][key] ?? en[key], params);
  const out: (Node | string)[] = [];
  let last = 0;
  const re = /\{(\w+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template))) {
    const node = nodes[m[1]];
    if (node === undefined) continue; // not a slot we were given — leave the text
    if (m.index > last) out.push(template.slice(last, m.index));
    out.push(node);
    last = m.index + m[0].length;
  }
  if (last < template.length) out.push(template.slice(last));
  return out;
}

// ---------------------------------------------------------------------------
// Locale-aware formatting. These follow the *language*, not the unit system:
// "1,070 mm" in English and "1 070 mm" in French are the same measurement
// written the way each reader expects to see a number.
// ---------------------------------------------------------------------------

const numberCache = new Map<string, Intl.NumberFormat>();

export function fmtNumber(value: number, maxFractionDigits = 0): string {
  const cacheKey = `${current}:${maxFractionDigits}`;
  let f = numberCache.get(cacheKey);
  if (!f) {
    f = new Intl.NumberFormat(current, { maximumFractionDigits: maxFractionDigits });
    numberCache.set(cacheKey, f);
  }
  return f.format(value);
}

/** "oak, willow and cherry" / "chêne, saule et cerisier". */
export function fmtList(items: string[]): string {
  return new Intl.ListFormat(current, { style: "long", type: "conjunction" }).format(items);
}

/** The same list, but as alternatives: "dry or damp" / "sec ou frais". A hand-
 *  joined `" or "` reads as English in every other language. */
export function fmtOrList(items: string[]): string {
  return new Intl.ListFormat(current, { style: "long", type: "disjunction" }).format(items);
}

/** A date in the reader's own convention — "3 Feb 2026" / "3 févr. 2026". */
export function fmtDate(ms: number): string {
  return new Intl.DateTimeFormat(current, { dateStyle: "medium" }).format(new Date(ms));
}

/** Month names for the bloom-period line, in the reader's language. */
export function monthName(month1to12: number, style: "long" | "short" = "long"): string {
  const d = new Date(Date.UTC(2001, Math.max(0, Math.min(11, month1to12 - 1)), 1));
  return new Intl.DateTimeFormat(current, { month: style, timeZone: "UTC" }).format(d);
}
