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
import { pageArt, squareArt, type SquareName } from "../components/page-art";
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

/** The evidence behind the Halloween post's figures. Names are the pages' own
 *  titles and stay untranslated. The guide it sends people to, `#/kill-your-lawn`,
 *  carries the rest. */
//
// Checked 21 October 2026: each page was opened and the words quoted beside
// its row found in it. No source we could find measures fake cobwebs shedding
// microplastics, so the post says only what these do.
const HALLOWEEN_SOURCES: { name: string; url: string; what: TKey }[] = [
  // Turf covers "three times larger than any irrigated crop" in the US.
  { name: "Milesi et al. 2005 — Environmental Management", url: "https://doi.org/10.1007/s00267-004-0316-2", what: "lawn.src.milesi" },
  // "The average U.S. household uses more water outdoors than for showering
  // and washing clothes combined."
  { name: "U.S. EPA WaterSense — Outdoor water use", url: "https://www.epa.gov/watersense/outdoor", what: "lawn.src.watersense" },
  // Overwatering "carries away fertilizers".
  { name: "U.S. EPA — Nutrient pollution: what you can do in your yard", url: "https://www.epa.gov/nutrientpollution/what-you-can-do-your-yard", what: "lawn.src.epa" },
  // "Birds can get entangled in the fake webs, and so can any small animals
  // that are not strong enough to break free."
  { name: "Forest Preserve District of Will County — Fake spider webs are nightmares for wildlife", url: "https://reconnectwithnature.org/News-Events/The-Buzz/Fake-Spider-Webs-Are-Nightmares-For-Wildlife", what: "posts.halloween2026.src.webs" },
  // "Many of these webs you'll find are made out of a polyester-like
  // material, which is a petroleum-based product."
  { name: "City of Hayward — Eco-Friendly Halloween", url: "https://hayward-ca.gov/discover/news/sep24/eco-friendly-halloween", what: "posts.halloween2026.src.hayward" },
  // An Adelaide resident "has gathered over a dozen nests" fallen from trees
  // with fake Halloween cobweb in them, "generally made of polyester".
  { name: "ABC News (Australia) — Fake Halloween cobwebs and plastic appearing in birds' nests", url: "https://www.abc.net.au/news/2019-11-08/fake-halloween-cobwebs-appearing-in-birds-nests-but-is-it-bad/11679248", what: "posts.halloween2026.src.nests" },
  // "These and other birds migrate mostly at night, using the moon and stars
  // to navigate"; "artificial lights at night can disorient and distract
  // birds"; "Turn off exterior decorative lighting from 11pm to 6am now
  // through November 30."
  { name: "Audubon North Carolina — Turn off lights at night to reduce risk for migrating birds", url: "https://www.audubon.org/north-carolina/press-room/turn-lights-night-reduce-risk-migrating-birds", what: "posts.halloween2026.src.audubon" },
];

/** Halloween: the lawn as a zombie, the decorations kept with their lights on
 *  a timer, and a way on to the guide that outlasts the holiday. Each section
 *  carries a small square drawing of what its heading says. */
function halloween2026Body(key: string): HTMLElement[] {
  const section = (art: SquareName, title: string, body: HTMLElement[]) =>
    el("section", { class: "post-section" }, [squareArt(art), el("h3", {}, title), ...body]);
  return [
    section("zombie", t(pk(key, "zombieTitle")), [
      el("p", {}, t(pk(key, "zombie1"))),
      el("p", {}, t(pk(key, "zombie2"))),
      el("p", {}, tx(pk(key, "zombie3"), {
        homegrown: el("a", { href: "#/homegrown" }, t(pk(key, "zombie3Link"))),
      })),
    ]),
    section("lights", t(pk(key, "lightsTitle")), [el("p", {}, t(pk(key, "lights")))]),
    section("bury", t(pk(key, "buryTitle")), [
      el("p", {}, tx(pk(key, "bury"), {
        guide: el("a", { href: "#/kill-your-lawn" }, t(pk(key, "buryLink"))),
      })),
    ]),
    section("sources", t("lawn.sourcesTitle"), [
      el("ul", { class: "who-list" }, HALLOWEEN_SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),
    ]),
  ];
}

const BODIES: Record<string, (key: string) => HTMLElement[]> = {
  ipd2026: ipd2026Body,
  halloween2026: halloween2026Body,
};

/** A post's drawing, for the ones that have one. */
const ART: Record<string, Parameters<typeof pageArt>[0]> = {
  halloween2026: "halloween",
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
      ART[post.key] ? pageArt(ART[post.key]) : null,
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
