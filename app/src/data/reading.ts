// Further reading: the books, websites and channels to turn to after the list.
//
// The societies (`data/societies.ts`) are who to *meet*; these are what to
// *read and watch* — the field guide a local botanist wrote, the nursery's
// planting videos, the state database a reader will use for years. Every pick
// passed the same two tests, and the evidence for both sits on the entry so a
// reviewer can check it without re-doing the search:
//
//   1. **Who stands behind it** (`backer`) — a working botanist or ecologist, a
//      society, a university or extension service, an agency, a botanic garden,
//      a native-plant nursery, a designer who plants natives for a living.
//   2. **Who already relies on it** (`vouched`, `audience`, `award`) — the
//      strongest is a recommendation from one of the region's own authorities,
//      which is the cross-reference: a book the Native Plant Society of Oregon
//      puts on its own reading list. Audience counts and awards come next.
//
// Never a person without a public body of work, never a page that frames
// plants from elsewhere — or people — as invaders (CLAUDE.md, "Native plants,
// not nativism"). Kept short for the same reason the societies are: a page of
// sixty links is a directory, and the reader came here to avoid one.
//
// The research behind each pick, with the pages it was checked against, is in
// `docs/outreach/further-reading.md`. Audience counts are a snapshot (`asOf`)
// and drift; they are shown rounded and dated, never as live figures.

export type ReadingKind = "book" | "site" | "video" | "social";

/** Who stands behind a pick. Translated via `reading.backer.<key>`. */
export type Backer =
  | "botanist"
  | "ecologist"
  | "society"
  | "university"
  | "agency"
  | "garden"
  | "nursery"
  | "designer"
  | "naturalist";

export interface Voucher {
  /** As the organization writes it. A proper name, not translated. */
  name: string;
  /** The page on which they recommend it — the evidence, not their home page. */
  url: string;
}

export interface Reading {
  kind: ReadingKind;
  /** As published. A proper name, not translated. */
  title: string;
  /** Author(s) or organization, as published. */
  by: string;
  /** Books: the latest edition's year. */
  year?: number;
  url: string;
  /** The language it is written or spoken in (BCP 47), shown when it differs
   *  from the reader's. */
  lang: string;
  backer: Backer;
  /** Regional authorities that recommend it, each with the page that does. */
  vouched?: Voucher[];
  /** Followers or subscribers on its platform, as of a date. */
  audience?: { count: number; asOf: string };
  /** An award it won, as the award is named. */
  award?: string;
}

export const READING: Record<string, Reading[]> = {};

/** A region's picks, or an empty list where none are researched yet — which is
 *  a missing section, never a heading over nothing. */
export function readingFor(regionId: string): Reading[] {
  return READING[regionId] ?? [];
}

/** The regions that have a list, in the order they were written. */
export function readingRegionIds(): string[] {
  return Object.keys(READING).filter((id) => READING[id].length > 0);
}
