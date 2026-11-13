// "Your first planting day" (route `#/volunteer`, `#/volunteer/<guide>`) — what
// a volunteer needs to know before a native planting, so an organizer with
// forty people and four shovels can send one link instead of giving the talk.
//
// The landing page is the short version and four rows; each row is a guide
// with its own page (`lib/volunteer.ts` holds what they say and what backs
// each part). The pages are written for a phone in a wet glove: short
// sections, a drawing where the hands matter, sources at the foot.
//
// Two things the guides refuse to do. Overrule the organizer: site rules win,
// and the pages say so. And pass on a tip unchecked: every section cites two
// publishers, and where the common advice turned out wrong (willows have no
// nitrogen nodules; that's alder) the page gives the checked version.
import { el, clear } from "../ui";
import { knownRegion, navigate } from "../state";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { pageArt, squareArt, figureArt } from "../components/page-art";
import { mostWanted } from "../lib/invasives";
import {
  GUIDES,
  VOLUNTEER_HREF,
  guideBySlug,
  guideHref,
  guideSources,
  type Guide,
  type GuideBlock,
} from "../lib/volunteer";

const k = (key: string): TKey => key as TKey;

/** The region's own most-wanted list when we know the region, else all. */
function invasivesHref(): string {
  const region = knownRegion();
  return region && mostWanted(region).length ? `#/invasives/in/${region}` : "#/invasives";
}

/** A link target a guide names: `invasives` follows the reader's region. */
const resolveHref = (href: string): string => (href === "#/invasives" ? invasivesHref() : href);

function block(b: GuideBlock): HTMLElement {
  switch (b.kind) {
    case "p":
      return el("p", {}, b.links
        ? tx(k(b.key), Object.fromEntries(Object.entries(b.links).map(([slot, link]) =>
            [slot, el("a", { href: resolveHref(link.href) }, t(k(link.key)))])))
        : t(k(b.key)));
    case "ol":
    case "ul":
      return el(b.kind, {}, b.keys.map((key) => el("li", {}, t(k(key)))));
    case "note":
      return el("p", { class: `note ${b.tone}` }, [el("strong", {}, t(k(b.title))), " ", t(k(b.key))]);
    case "figure":
      return figureArt(b.name, t(k(b.caption)));
  }
}

function sourcesList(guide: Guide): HTMLElement {
  return el("ul", { class: "who-list" }, guideSources(guide).map((src) =>
    el("li", {}, [
      el("a", { href: src.url, target: "_blank", rel: "noopener" }, el("strong", {}, src.name)),
      el("span", { class: "sureness-from" }, ` — ${t(k(`volunteer.src.${src.id}`))}`),
    ])));
}

function renderGuide(main: HTMLElement, guide: Guide): void {
  clear(main);
  const name = t(k(`volunteer.${guide.slug}.title`));
  document.title = t("volunteer.guideDocTitle", { name });
  const at = GUIDES.indexOf(guide);
  const next = GUIDES[at + 1];

  main.append(
    el("article", { class: "privacy-page" }, [
      el("p", { class: "back-trail" }, [el("a", { href: VOLUNTEER_HREF }, t("volunteer.back"))]),
      el("h2", { class: "step-title" }, name),
      el("p", { class: "step-lede" }, t(k(`volunteer.${guide.slug}.lede`))),

      ...guide.sections.flatMap((section) => [
        el("h3", { id: section.id }, t(k(`volunteer.${guide.slug}.${section.id}.title`))),
        ...section.blocks.map(block),
      ]),

      el("h3", {}, t("volunteer.sourcesTitle")),
      el("p", { class: "confidence" }, t("volunteer.sourcesLede")),
      sourcesList(guide),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        next
          ? el("a", { class: "btn btn-primary", href: guideHref(next) }, t(k(`volunteer.${next.slug}.next`)))
          : el("a", { class: "btn btn-primary", href: VOLUNTEER_HREF }, t("volunteer.allGuides")),
      ]),
    ]),
  );
}

function renderIndex(main: HTMLElement): void {
  clear(main);
  document.title = t("volunteer.docTitle");
  const short: TKey[] = ["volunteer.short1", "volunteer.short2", "volunteer.short3", "volunteer.short4", "volunteer.short5"];

  main.append(
    el("article", { class: "privacy-page" }, [
      pageArt("volunteer"),
      el("h2", { class: "step-title" }, t("volunteer.title")),
      el("p", { class: "step-lede" }, t("volunteer.lede")),

      el("div", { class: "note info lede-note" }, [
        el("strong", {}, t("privacy.shortVersion")),
        el("ul", {}, short.map((key) => el("li", {}, t(key)))),
      ]),

      el("h3", {}, t("volunteer.guidesTitle")),
      el("div", { class: "guide-rows" }, GUIDES.map((guide) =>
        el("a", { class: "card guide-row", href: guideHref(guide) }, [
          squareArt(guide.square),
          el("span", { class: "guide-row-text" }, [
            el("strong", {}, t(k(`volunteer.${guide.slug}.title`))),
            el("span", {}, t(k(`volunteer.${guide.slug}.line`))),
          ]),
        ]))),

      el("h3", {}, t("volunteer.whyTitle")),
      el("p", {}, tx("volunteer.why1", {
        invasives: el("a", { href: invasivesHref() }, t("volunteer.why1Link")),
      })),
      el("p", {}, tx("volunteer.why2", {
        regions: el("a", { href: "#/regions" }, t("volunteer.why2Link")),
      })),

      el("h3", { id: "organizers" }, t("volunteer.orgTitle")),
      el("p", {}, t("volunteer.org1")),
      el("p", {}, tx("volunteer.org2", {
        removing: el("a", { href: "#/removing" }, t("volunteer.org2Link")),
      })),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("a", { class: "btn btn-primary", href: guideHref(GUIDES[0]) }, t(k(`volunteer.${GUIDES[0].slug}.next`))),
      ]),
    ]),
  );
}

function renderNotFound(main: HTMLElement, slug: string): void {
  clear(main);
  document.title = t("volunteer.notFoundTitle");
  main.append(
    el("h2", { class: "step-title" }, t("volunteer.notFoundTitle")),
    el("p", { class: "step-lede" }, t("volunteer.notFoundLede", { slug })),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("volunteer") }, t("volunteer.allGuides")),
    ]),
  );
}

export function renderVolunteer(main: HTMLElement, param?: string): void {
  if (!param) return renderIndex(main);
  const guide = guideBySlug(param);
  return guide ? renderGuide(main, guide) : renderNotFound(main, param);
}
