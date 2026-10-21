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
  /** A post with a page of its own at the top level (`kill-your-lawn`), not
   *  under `posts/`: one that is also a guide people will come back to. The
   *  index links there, and `posts/<slug>` isn't a page. */
  route?: string;
}

/** Newest first. */
export const POSTS: readonly Post[] = [
  { slug: "kill-your-lawn", key: "halloween2026", date: "2026-10-31", route: "kill-your-lawn" },
  { slug: "indigenous-peoples-day-2026", key: "ipd2026", date: "2026-10-12" },
];

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug && !p.route);
}

/** The posts that live at `posts/<slug>`. */
export function postSlugs(): string[] {
  return POSTS.filter((p) => !p.route).map((p) => p.slug);
}
