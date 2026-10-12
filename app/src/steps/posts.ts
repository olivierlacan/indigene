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
import type { TKey } from "../locales/en";

/** `posts.<key>.<field>`, typed loosely: the keys are checked by the locale
 *  tables themselves, which must carry every one in both languages. */
const pk = (key: string, field: string): TKey => `posts.${key}.${field}` as TKey;

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(getLang(), {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

/** A plant's name as its own page shows it, linked to that page. */
function plantLink(id: string): HTMLElement {
  const entry = entryForPlant(id);
  const name = entry ? commonName({ common: entry.commonNames[0], latin: entry.scientificName }) : id;
  return el("a", { href: `#/plants/${id}` }, el("strong", {}, name));
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
    el("li", {}, [
      plantLink(id),
      el("span", { class: "sureness-from" }, ` · ${t(pk(key, `${part}.where`))}`),
      el("p", {}, word ? tx(pk(key, part), { word: el("em", { lang: word[1] }, word[0]) }) : t(pk(key, part))),
    ])
  );
  return [
    el("h3", {}, t(pk(key, "plantsTitle"))),
    el("ul", { class: "who-list" }, plants),
    el("h3", {}, t(pk(key, "landTitle"))),
    el("p", {}, t(pk(key, "land"))),
    el("p", { class: "more-link" }, el("a", { href: "#/native" }, t(pk(key, "nativeLink")))),
    el("h3", {}, t(pk(key, "nextTitle"))),
    el("p", {}, tx(pk(key, "next"), {
      tell: el("a", { href: "https://github.com/olivierlacan/indigene/issues", target: "_blank", rel: "noopener" }, t(pk(key, "tell"))),
    })),
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
      el("p", { class: "region-tag" }, el("time", { datetime: post.date }, t(pk(post.key, "when")))),
      el("p", { class: "step-lede" }, t(pk(post.key, "lede"))),
      ...(BODIES[post.key]?.(post.key) ?? []),
      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("posts") }, t("posts.allPosts")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
