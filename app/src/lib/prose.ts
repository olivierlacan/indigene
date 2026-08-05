// Translated prose for the catalog.
//
// A plant row carries four paragraphs of hand-written prose — what it gives you,
// what it needs from you, what "native here" means for it, and how to make more
// of it — and a wildlife row carries a blurb plus a note per tie. That's ~33,000
// words across the catalog, all of it authored, none of it lookup-able.
//
// So this is an **overlay, not a requirement**: a locale supplies the paragraphs
// it has, keyed on the taxon's scientific name, and anything missing falls back
// to the English the row was written in. Two consequences, both deliberate:
//
//  - **Adding a plant never breaks a language.** The build doesn't demand a
//    translation the moment a row lands, the way `Dict` does for UI strings.
//    UI strings are a closed set a person can finish; catalog prose grows with
//    every region and would make "add a plant" mean "write it in every
//    language" forever.
//  - **The gap is stated, not hidden.** `proseCoverage()` counts what's missing
//    for a page, and the plant and region screens say plainly when some
//    paragraphs are still showing in English. Silently mixing two languages
//    without saying so is the kind of quiet dishonesty this app avoids
//    everywhere else.
//
// Priority is by *reader*, not by alphabet: the four French regions were
// translated first, because those are the plants a French speaker standing in
// France will actually be handed.
//
// ## One taxon, two regions, two paragraphs
//
// A plant native to more than one region has **a different row per region** —
// hornbeam is "the classic clipped hedge of French gardens" on the Atlantic list
// and "the chêne-charme forest of Lorraine" on the Continental one, and the
// plant page already picks the row for the region you're reading (`activeEntry`
// in `steps/plant.ts`). Twenty-two of the catalog's taxa are like that, and all
// twenty-two differ in their prose.
//
// A table keyed on scientific name alone can only hold one translation for
// those, which would mean picking one region's paragraph and showing it on the
// other region's page. So a key may optionally be **qualified with a region**:
//
//     "Carpinus betulus"                    → the Atlantic paragraphs
//     "Carpinus betulus@france-continental" → the Continental ones
//
// The qualified key wins when the caller says which region it is showing;
// everything else falls through to the plain key, which is why 207 of the 229
// taxa need only one entry. A qualified entry is **complete for its region** —
// its own four paragraphs and its own wildlife and look-alike ties — rather than
// a patch over the plain one, so there is never a half-and-half row to reason
// about.
//
// Callers that don't know their region (there are none today) simply get the
// plain key, which is a real translation of a real row — not a blank.
import type { Lookalike, LookalikeLink, Plant, SupportLink, TellApart, Wildlife } from "../types";
import { getLang } from "./i18n";

/** The prose fields on a plant row that a locale may override. */
export type ProseField = "nativeNote" | "careNote" | "givesNote";

export interface TaxonProse {
  nativeNote?: string;
  careNote?: string;
  givesNote?: string;
  /** The plant-specific propagation how-to (`propagation.note`). */
  propagationNote?: string;
  /** Wildlife only: the "what it is and why it matters" paragraph. */
  blurb?: string;
  /** Wildlife ties, keyed by the *other* end of the tie — a plant's entry keys
   *  its notes by `wildlifeId`, so one plant's ties live together. */
  supportNotes?: Record<string, string>;
  /** Look-alikes only: where the impostor is really from (`Lookalike.origin`).
   *  Keyed, like `blurb`, under the impostor's own scientific name — an
   *  impostor is a taxon like any other, and one that happens to be native
   *  somewhere we cover (common ivy, holly, Douglas-fir) simply has both kinds
   *  of writing under the one key. Nothing collides: a plant row never uses
   *  `blurb` or `origin`, and a look-alike never uses `givesNote`. */
  origin?: string;
  /** Look-alike ties, keyed by the *other* end of the tie — the impostor's id —
   *  exactly as `supportNotes` is, so one plant's mix-ups live together. */
  lookalikeNotes?: Record<string, { why?: string; tells?: TellApart[] }>;
}

export type ProseTable = Record<string, TaxonProse>;

// ---- Loading ----
// The overlay is **fetched, not bundled**. It is ~450 KB of French — about
// 130 KB gzipped, against an app that is ~330 KB gzipped in total — and an
// English reader must not pay for a language they will never see. So each
// locale is a dynamic `import()`, which Vite emits as its own chunk and only
// ever downloads for the reader who needs it.
//
// The getters below stay **synchronous**, which is what keeps this from leaking
// into every call site. That works because there is exactly one moment a page
// can appear — `route()` in `main.ts` — and it already `await`s. It awaits
// `loadProse()` before rendering, so by the time any getter runs the table for
// the reader's language is in memory. Boot and the language switcher both go
// through `route()`, so there is no second path to keep in sync.
//
// If a fetch fails (offline, first visit, a chunk that 404s after a deploy),
// the table stays absent and every getter falls back to the authored English —
// the same honest degradation as an untranslated row, and the page still says
// so. A missing translation is never a blank.
const LOADERS: Record<string, (() => Promise<{ default: ProseTable }>) | undefined> = {
  fr: () => import("../locales/prose.fr").then((m) => ({ default: m.PROSE_FR })),
};

const TABLES: Record<string, ProseTable | undefined> = {};
/** In-flight loads, so two routes in the same tick share one fetch. */
const PENDING = new Map<string, Promise<void>>();

/**
 * Make sure the reader's language has its prose in memory. Awaited once per
 * route; a no-op for English, and a no-op after the first successful load.
 */
export function loadProse(): Promise<void> {
  const lang = getLang();
  if (TABLES[lang]) return Promise.resolve();
  const load = LOADERS[lang];
  if (!load) return Promise.resolve();
  const pending = PENDING.get(lang);
  if (pending) return pending;
  const p = load()
    .then((m) => {
      TABLES[lang] = m.default;
    })
    .catch(() => {
      // Leave the table absent: every getter falls back to English, and the
      // page's own banner already tells the reader when that is happening.
    })
    .finally(() => {
      PENDING.delete(lang);
    });
  PENDING.set(lang, p);
  return p;
}

function table(): ProseTable | undefined {
  return TABLES[getLang()];
}

/**
 * The entry for one taxon, preferring the region-qualified key when the caller
 * knows which region's row it is rendering (see the note at the top of the file).
 */
function entry(latin: string | undefined, regionId?: string): TaxonProse | undefined {
  if (!latin) return undefined;
  const tbl = table();
  if (!tbl) return undefined;
  return (regionId ? tbl[`${latin}@${regionId}`] : undefined) ?? tbl[latin];
}

/** A plant's prose in the reader's language, or the authored English. */
export function prose(p: Plant, field: ProseField, regionId?: string): string {
  return entry(p.latin, regionId)?.[field] ?? p[field];
}

export function propagationNote(p: Plant, regionId?: string): string {
  return entry(p.latin, regionId)?.propagationNote ?? p.propagation.note;
}

export function wildlifeBlurb(w: Wildlife): string {
  return entry(w.latin ?? `#${w.id}`)?.blurb ?? w.blurb;
}

/** The plant-specific "why this animal cares about this plant" line. */
export function supportNote(plantLatin: string, link: SupportLink, regionId?: string): string {
  return entry(plantLatin, regionId)?.supportNotes?.[link.wildlifeId] ?? link.note;
}

// ---- Look-alikes ----
// The impostor's own two paragraphs are keyed under its scientific name; the
// tie's writing (why they're mixed up, and the tells) is keyed under the native
// plant, because that's the page it appears on and the direction it was written
// in. A locale that translates one and not the other is fine — every getter
// falls back to the authored English on its own.

export function lookalikeBlurb(l: Lookalike): string {
  return entry(l.latin)?.blurb ?? l.blurb;
}

export function lookalikeOrigin(l: Lookalike): string {
  return entry(l.latin)?.origin ?? l.origin;
}

export function lookalikeWhy(plantLatin: string, link: LookalikeLink, regionId?: string): string {
  return entry(plantLatin, regionId)?.lookalikeNotes?.[link.lookalikeId]?.why ?? link.why;
}

/** The tells in the reader's language — all of them or none, never a table
 *  half in each language, which would be harder to read than plain English. */
export function lookalikeTells(plantLatin: string, link: LookalikeLink, regionId?: string): TellApart[] {
  const translated = entry(plantLatin, regionId)?.lookalikeNotes?.[link.lookalikeId]?.tells;
  return translated?.length === link.tells.length ? translated : link.tells;
}

/**
 * Is any of the look-alike writing on this page still in the English it was
 * authored in? Asked of the whole section at once, the way `wildlifeUntranslated`
 * is: the reader needs to know the page mixes languages, not which paragraph.
 */
export function lookalikesUntranslated(
  plantLatin: string,
  items: { lookalike: Lookalike; link: LookalikeLink }[],
  regionId?: string,
): boolean {
  if (getLang() === "en" || !items.length) return false;
  const notes = entry(plantLatin, regionId)?.lookalikeNotes;
  return items.some(({ lookalike, link }) => {
    const tie = notes?.[link.lookalikeId];
    return (
      entry(lookalike.latin)?.blurb === undefined ||
      tie?.why === undefined ||
      tie?.tells?.length !== link.tells.length
    );
  });
}

/**
 * How much of a set of plants' prose exists in the reader's language. Used to
 * tell them, once per page rather than once per paragraph, that some of what
 * they're reading is still in English.
 */
export function proseCoverage(plants: Plant[], regionId?: string): { translated: number; total: number } {
  if (getLang() === "en") return { translated: plants.length, total: plants.length };
  return {
    translated: plants.filter((p) => entry(p.latin, regionId)?.givesNote !== undefined).length,
    total: plants.length,
  };
}

/** True when this one plant's paragraphs are still showing in English. */
export function isUntranslated(p: Plant, regionId?: string): boolean {
  return getLang() !== "en" && entry(p.latin, regionId)?.givesNote === undefined;
}

/**
 * The same question for the wildlife layer, asked of a whole page at once: is
 * any of this animal writing still in the English it was authored in? The
 * wildlife blurbs are one pool rather than one per region, so a page is either
 * telling the reader something they can read or it isn't — a count would be
 * precision nobody needs.
 */
export function wildlifeUntranslated(items: Wildlife[]): boolean {
  if (getLang() === "en") return false;
  const tbl = table();
  return items.some((w) => tbl?.[w.latin ?? `#${w.id}`]?.blurb === undefined);
}
