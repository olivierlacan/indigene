// Localized names for the living things — the part of localization you cannot
// do by translating.
//
// "White oak" is not a phrase to be rendered into French; *Quercus robur* has a
// name in French, given to it by the people who live with it, and recorded in a
// national reference list. So this layer is a **lookup against those lists**,
// never a translation:
//
//   - **TAXREF** (INPN / Muséum national d'Histoire naturelle) — the French
//     national taxonomic reference for the flora *and* fauna of France and its
//     overseas territories, carrying the official French vernacular names.
//     Licence Ouverte / Etalab. This is the authority for anything native to
//     France, plants and animals alike.
//   - **Tela Botanica — BDTFX** — the flora of metropolitan France, with the
//     vernacular names French botanists actually use. CC BY-SA.
//   - **VASCAN** (Database of Vascular Plants of Canada, Université de
//     Montréal) — the standard French names for *North American* plants, which
//     is the gap TAXREF cannot fill: a Pacific Northwest native has no entry in
//     the French flora, but Québec has named it. CC BY.
//   - **Wikidata** — `P1843` (taxon common name, `fr`) and the `fr` label, used
//     as the crosswalk of last resort. CC0, and the hub `scripts/reconcile.mjs`
//     already resolves every taxon through, so the join is free.
//
// **When there is no name, we say the Latin.** Plenty of North American natives
// have never been named in French, and inventing a plausible-sounding one would
// be exactly the kind of confident fabrication the rest of this app refuses to
// do with a host count. A taxon with no entry here displays its scientific name
// — which is, after all, the name a French botanist would use for it too — with
// the English common name labelled as English underneath.
//
// The table is keyed on the **scientific name**, not our slug: that is the key
// the reference lists themselves use, it dedupes a species that appears in two
// regions, and it makes every row checkable against the source by hand.
import { getLang, t } from "./i18n";
import { TAXA_FR } from "../locales/taxa.fr";
import { REGIONS_FR } from "../locales/regions.fr";
import type { RegionText } from "../locales/regions.fr";
import type { RegionMeta } from "../data/region";

/** Which reference list a name is asserted from. Shown on the Sources page and
 *  used by `scripts/check-vernacular.mjs` to know what to verify against. */
export type NameSource = "taxref" | "bdtfx" | "vascan" | "wikidata" | "catalog";

export interface LocalName {
  /** The vernacular name in this language, as the source list spells it. */
  name: string;
  /** The authority it comes from. */
  src: NameSource;
}

export type NameTable = Record<string, LocalName>;

/** Where the Sources page explains all of this. */
export const NAME_SOURCES_ROUTE = "#/sources";

export const NAME_SOURCE_INFO: Record<NameSource, { label: string; url: string }> = {
  taxref: { label: "TAXREF (INPN — Muséum national d'Histoire naturelle)", url: "https://inpn.mnhn.fr/programme/referentiel-taxonomique-taxref" },
  bdtfx: { label: "Tela Botanica — BDTFX", url: "https://www.tela-botanica.org/bdtfx/" },
  vascan: { label: "VASCAN — Database of Vascular Plants of Canada", url: "https://data.canadensys.net/vascan/" },
  wikidata: { label: "Wikidata", url: "https://www.wikidata.org/" },
  catalog: { label: "Indigene catalog (see the row's own source)", url: "https://github.com/olivierlacan/indigene/blob/main/DATA_SOURCES.md" },
};

/** One table per language. English needs none — the catalog is written in it. */
const TABLES: Record<string, NameTable | undefined> = { fr: TAXA_FR };

function table(): NameTable | undefined {
  return TABLES[getLang()];
}

/** Anything with a name: a plant row, a wildlife row, a registry entry. */
export interface Nameable {
  /** The English common name, as authored in the catalog. */
  common: string;
  /** The scientific name. Absent on the handful of informal wildlife groups
   *  ("Jays, turkeys & woodpeckers"), which key on their slug instead. */
  latin?: string;
  /** Fallback key for those informal groups. */
  id?: string;
}

function keyFor(x: Nameable): string {
  return x.latin || (x.id ? `#${x.id}` : x.common);
}

/** The entry for this taxon in the active language, if a source list has one. */
export function localName(x: Nameable): LocalName | undefined {
  return table()?.[keyFor(x)];
}

/** True when the reader's language actually has a name for this taxon. */
export function hasLocalName(x: Nameable): boolean {
  return getLang() === "en" || localName(x) !== undefined;
}

/**
 * The name to call this thing by — the reader's own, when a reference list
 * gives us one, and the scientific name when it doesn't. Never a guess.
 */
export function commonName(x: Nameable): string {
  if (getLang() === "en") return x.common;
  const local = localName(x);
  if (local) return local.name;
  return x.latin || x.common;
}

/**
 * The two lines a card or a page heading shows: what to call it, and what sits
 * underneath in the small italic line.
 *
 * In English that's always "common name / scientific name". In another language
 * it's the same when we have the name — and, when we don't, the scientific name
 * is promoted to the heading and the English name goes underneath *labelled as
 * English*, so nobody mistakes it for their own language's name.
 */
export function nameLines(x: Nameable): { title: string; sub: string; subIsLatin: boolean } {
  if (getLang() === "en" || localName(x)) {
    return { title: commonName(x), sub: x.latin ?? "", subIsLatin: true };
  }
  return x.latin
    ? { title: x.latin, sub: t("names.englishName", { name: x.common }), subIsLatin: false }
    : { title: x.common, sub: "", subIsLatin: false };
}

/**
 * Every string that should find this taxon in search — the catalog's English
 * name, the scientific name, and the reader's own name for it. A French speaker
 * typing "chêne pédonculé" has to land on the same page as "Quercus robur".
 */
export function searchAliases(x: Nameable): string[] {
  const out = [x.common, x.latin ?? ""];
  // Every language's name, not only the active one: switching language should
  // never make a bookmarked search stop working.
  for (const tbl of Object.values(TABLES)) {
    const hit = tbl?.[keyFor(x)];
    if (hit) out.push(hit.name);
  }
  return out.filter(Boolean);
}

// ---------------------------------------------------------------------------
// Region text. A region's name, reference place and native-status caveat are
// authored in English beside its data; the translations live in
// `locales/regions.<lang>.ts` and are optional, so adding a region never breaks
// a language that hasn't caught up yet — it falls back to the English, which is
// legible (a place name is a place name) rather than blank.
// ---------------------------------------------------------------------------

const REGION_TABLES: Record<string, Record<string, RegionText> | undefined> = { fr: REGIONS_FR };

function regionText(meta: RegionMeta): RegionText | undefined {
  return REGION_TABLES[getLang()]?.[meta.id];
}

export function regionName(meta: RegionMeta): string {
  return regionText(meta)?.name ?? meta.name;
}

/** The short form, for a pill or a picker option where the full name's
 *  qualifier would wrap. Falls back to the region's own English short, and
 *  then — for a locale table that has neither — to the full name, which is
 *  long but never wrong. */
export function regionShort(meta: RegionMeta): string {
  return regionText(meta)?.short ?? meta.short;
}

export function regionReference(meta: RegionMeta): string {
  return regionText(meta)?.reference ?? meta.reference;
}

export function regionNote(meta: RegionMeta): string {
  return regionText(meta)?.note ?? meta.note;
}

/** How many of a list of taxa we can name in the reader's language — used to
 *  tell them honestly when a region's roster is only partly named. */
export function localNameCoverage(items: Nameable[]): { named: number; total: number } {
  if (getLang() === "en") return { named: items.length, total: items.length };
  return {
    named: items.filter((x) => localName(x) !== undefined).length,
    total: items.length,
  };
}
