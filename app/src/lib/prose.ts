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
import type { Plant, SupportLink, Wildlife } from "../types";
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
