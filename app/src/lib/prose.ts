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
// Priority is by *reader*, not by alphabet: the four French regions are
// translated first, because those are the plants a French speaker standing in
// France will actually be handed.
import type { Lookalike, LookalikeLink, Plant, SupportLink, TellApart, Wildlife } from "../types";
import { getLang } from "./i18n";
import { PROSE_FR } from "../locales/prose.fr";

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

const TABLES: Record<string, ProseTable | undefined> = { fr: PROSE_FR };

function table(): ProseTable | undefined {
  return TABLES[getLang()];
}

function entry(latin: string | undefined): TaxonProse | undefined {
  return latin ? table()?.[latin] : undefined;
}

/** A plant's prose in the reader's language, or the authored English. */
export function prose(p: Plant, field: ProseField): string {
  return entry(p.latin)?.[field] ?? p[field];
}

export function propagationNote(p: Plant): string {
  return entry(p.latin)?.propagationNote ?? p.propagation.note;
}

export function wildlifeBlurb(w: Wildlife): string {
  return entry(w.latin ?? `#${w.id}`)?.blurb ?? w.blurb;
}

/** The plant-specific "why this animal cares about this plant" line. */
export function supportNote(plantLatin: string, link: SupportLink): string {
  return entry(plantLatin)?.supportNotes?.[link.wildlifeId] ?? link.note;
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

export function lookalikeWhy(plantLatin: string, link: LookalikeLink): string {
  return entry(plantLatin)?.lookalikeNotes?.[link.lookalikeId]?.why ?? link.why;
}

/** The tells in the reader's language — all of them or none, never a table
 *  half in each language, which would be harder to read than plain English. */
export function lookalikeTells(plantLatin: string, link: LookalikeLink): TellApart[] {
  const translated = entry(plantLatin)?.lookalikeNotes?.[link.lookalikeId]?.tells;
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
): boolean {
  if (getLang() === "en" || !items.length) return false;
  const notes = entry(plantLatin)?.lookalikeNotes;
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
export function proseCoverage(plants: Plant[]): { translated: number; total: number } {
  if (getLang() === "en") return { translated: plants.length, total: plants.length };
  const tbl = table();
  return {
    translated: plants.filter((p) => tbl?.[p.latin]?.givesNote !== undefined).length,
    total: plants.length,
  };
}

/** True when this one plant's paragraphs are still showing in English. */
export function isUntranslated(p: Plant): boolean {
  return getLang() !== "en" && entry(p.latin)?.givesNote === undefined;
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
