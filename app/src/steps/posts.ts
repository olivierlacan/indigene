// Posts (route `#/posts`, `#/posts/<slug>`): writing tied to a date.
//
// The index is a list of rows, each a link to the post's own page (CLAUDE.md,
// "No folding boxes"). A post reads like the Native page: a title, a dated
// lede, short sections, and a way on at the end.
//
// The one post so far names five plants. Each name links to the plant's page
// and is drawn through `commonName`, so a French reader sees the name the plant
// page uses, or the scientific name when no reference list gives one, never a
// name we made up for the occasion.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { t, tx, getLang } from "../lib/i18n";
import { commonName } from "../lib/names";
import { entryForPlant } from "../lib/registry";
import { POSTS, postBySlug } from "../data/posts";
import { heroPhotoFor } from "../lib/hero-photo";
import { budget } from "../lib/photo";
import { heroFigure } from "../components/hero-figure";
import type { TKey } from "../locales/en";

/** Where people without a GitHub account can write. */
export const CONTACT = "hi@constantvariable.net";

/** `posts.<key>.<field>`, typed loosely: the keys are checked by the locale
 *  tables themselves, which must carry every one in both languages. */
const pk = (key: string, field: string): TKey => `posts.${key}.${field}` as TKey;

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  // A no-break space between the day and the month, so "12 octobre" never
  // splits across lines.
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(getLang(), {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  }).replace(/(\d) (\p{L})/u, "$1\u00a0$2");
}

/** The line under a post's title: its occasion and its date, the date written
 *  from `data/posts.ts` in the reader's language ("October 12, 2026",
 *  "12 octobre 2026"), so a post's date is typed in one place. */
export function postWhen(post: { key: string; date: string }): string {
  return `${t(pk(post.key, "occasion"))} · ${formatDate(post.date)}`;
}

/** The same line for the post's own page: the occasion and the date styled
 *  apart (`.post-when` in styles.css), the date in a `<time>`. */
function postWhenLine(post: { key: string; date: string }): HTMLElement {
  return el("p", { class: "region-tag post-when" }, [
    el("span", { class: "post-occasion" }, t(pk(post.key, "occasion"))),
    el("span", { "aria-hidden": "true" }, " · "),
    el("time", { class: "post-date", datetime: post.date }, formatDate(post.date)),
  ]);
}

/** A plant's name as its own page shows it, linked to that page. */
function plantLink(id: string): HTMLElement {
  const entry = entryForPlant(id);
  const name = entry ? commonName({ common: entry.commonNames[0], latin: entry.scientificName }) : id;
  return el("a", { href: `#/plants/${id}` }, el("strong", {}, name));
}

/** Where a people named in a post tells its own story: the nation's own site,
 *  or, where a people is many nations, a public list of them that the nations
 *  report themselves (California's Tribal Atlas) or that links to each. The
 *  post's text marks the name as `[Kalapuya](kalapuya)`, so each language puts
 *  the link on its own words. One link per people per page: a later mention
 *  stays plain. */
const PEOPLES: Record<string, string> = {
  kalapuya: "https://www.grandronde.org/culture-history/",
  salish: "https://www.burkemuseum.org/collections-and-research/culture/contemporary-culture/coast-salish-art/coast-salish-people",
  maori: "https://teara.govt.nz/en/te-ngahere-forest-lore/page-6",
  weaving: "https://teara.govt.nz/en/maori-weaving-and-tukutuku-te-raranga-me-te-whatu",
  ojibwe: "https://glifwc.org/",
  cahuilla: "https://nahc.ca.gov/cp/p04cahuilla/",
  kumeyaay: "https://nahc.ca.gov/cp/p22kumeyaay",
};

/** Turns each `[words](people)` in a translated run into a link to that
 *  people's own source. Nodes (the italic word) pass through untouched. */
function withPeoples(parts: (Node | string)[]): (Node | string)[] {
  const out: (Node | string)[] = [];
  for (const part of parts) {
    if (typeof part !== "string") { out.push(part); continue; }
    let last = 0;
    for (const m of part.matchAll(/\[([^\]]+)\]\((\w+)\)/g)) {
      const at = m.index ?? 0;
      if (at > last) out.push(part.slice(last, at));
      const url = PEOPLES[m[2]];
      out.push(url ? el("a", { href: url, target: "_blank", rel: "noopener" }, m[1]) : m[1]);
      last = at + m[0].length;
    }
    if (last < part.length) out.push(part.slice(last));
  }
  return out;
}

/** The plant's chosen photograph, with its credit, floated beside its name —
 *  the head of a plant page in miniature. Nothing on a metered connection. */
function postPhoto(id: string): HTMLElement | null {
  const entry = entryForPlant(id);
  const pick = budget() === "essential" ? undefined : heroPhotoFor(id);
  if (!entry || !pick) return null;
  return heroFigure(pick, commonName({ common: entry.commonNames[0], latin: entry.scientificName }), entry.scientificName);
}

/** The five plants of the Indigenous Peoples' Day post, with the one word in
 *  each that is set in italics because it is another language's. */
const IPD_PLANTS: { id: string; part: string; word?: [string, string] }[] = [
  { id: "camassia-quamash", part: "camas", word: ["lakamas", "chn"] },
  { id: "corynocarpus-laevigatus", part: "karaka" },
  { id: "phormium-tenax", part: "harakeke" },
  { id: "tilia-americana", part: "basswood", word: ["wiigob", "oj"] },
  { id: "prunus-ilicifolia", part: "hollyleaf", word: ["islay", "es"] },
];

function ipd2026Body(key: string): HTMLElement[] {
  const plants = IPD_PLANTS.map(({ id, part, word }) =>
    el("li", { class: "post-plant" }, [
      postPhoto(id),
      plantLink(id),
      el("span", { class: "sureness-from" }, ` · ${t(pk(key, `${part}.where`))}`),
      el("p", {}, withPeoples(word ? tx(pk(key, part), { word: el("em", { lang: word[1] }, word[0]) }) : [t(pk(key, part))])),
    ])
  );
  return [
    el("h3", {}, t(pk(key, "plantsTitle"))),
    el("ul", { class: "post-plants" }, plants),
    el("h3", {}, t(pk(key, "landTitle"))),
    el("p", {}, t(pk(key, "land"))),
    el("p", { class: "more-link" }, el("a", { href: "#/native" }, t(pk(key, "nativeLink")))),
    el("h3", {}, t(pk(key, "nextTitle"))),
    el("p", {}, tx(pk(key, "next"), {
      email: el("a", { href: `mailto:${CONTACT}` }, CONTACT),
      tell: el("a", { href: "https://github.com/olivierlacan/indigene/issues", target: "_blank", rel: "noopener" }, t(pk(key, "tell"))),
    })),
    el("p", { class: "more-link" }, el("a", { href: "#/people" }, t(pk(key, "peopleLink")))),
  ];
}

const BODIES: Record<string, (key: string) => HTMLElement[]> = {
  ipd2026: ipd2026Body,
};

export function renderPostsIndex(main: HTMLElement): void {
  clear(main);
  document.title = t("posts.docTitle");
  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("posts.title")),
      el("p", { class: "step-lede" }, t("posts.lede")),
      el("ul", { class: "who-list" }, POSTS.map((p) =>
        el("li", {}, [
          el("a", { href: `#/posts/${p.slug}` }, el("strong", {}, t(pk(p.key, "title")))),
          el("span", { class: "sureness-from" }, ` · ${formatDate(p.date)}`),
          el("p", {}, t(pk(p.key, "lede"))),
        ])
      )),
    ]),
  );
}

export function renderPost(main: HTMLElement, slug?: string): void {
  const post = slug ? postBySlug(slug) : undefined;
  if (!post) return renderPostsIndex(main);
  clear(main);
  document.title = t(pk(post.key, "docTitle"));
  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t(pk(post.key, "title"))),
      postWhenLine(post),
      el("p", { class: "step-lede" }, t(pk(post.key, "lede"))),
      ...(BODIES[post.key]?.(post.key) ?? []),
      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("posts") }, t("posts.allPosts")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
