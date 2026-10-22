// Posts: pieces of writing tied to a date, at `posts/<slug>`.
//
// Most of Indigene is reference — a plant, a region, a word explained — and
// stays true until the facts change. A post is the exception: it was written
// for a day, says so, and keeps its date. The words live in the locale files
// like every other page's (`posts.<key>.*`), so French is written by hand
// beside the English; this module only says which posts exist and in what
// order, so the router, the prerenderer and the index read one list.

export interface Post {
  /** The address: `posts/<slug>`. English in every language, like every
   *  address in the app, and never changed once published. */
  slug: string;
  /** The locale prefix: `posts.<key>.title`, `posts.<key>.lede`, … */
  key: string;
  /** Publication date, `YYYY-MM-DD`. */
  date: string;
}

/** Newest first. */
export const POSTS: readonly Post[] = [
  { slug: "halloween-2026", key: "halloween2026", date: "2026-10-31" },
  { slug: "indigenous-peoples-day-2026", key: "ipd2026", date: "2026-10-12" },
];

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function postSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

/** How long the home page mentions a new post, in days after its date. */
export const RECENT_DAYS = 14;

/** The newest post published in the last `RECENT_DAYS` days as of `today`
 *  (`YYYY-MM-DD`, the reader's own calendar day), or none. A post dated ahead
 *  waits for its day: the home page never announces writing for a date that
 *  hasn't come. */
export function recentPost(today: string, posts: readonly Post[] = POSTS): Post | undefined {
  const day = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86_400_000;
  const now = day(today);
  return posts.find((p) => {
    const age = now - day(p.date);
    return age >= 0 && age <= RECENT_DAYS;
  });
}
