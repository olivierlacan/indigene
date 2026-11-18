// One how-to guide's page: `#/planting/pots`, `#/planting/roots`,
// `#/removing/disposal`, `#/volunteer/kit` (`lib/howto.ts` holds what each
// says and what backs each part). Written for a phone in a wet glove: short
// sections, a drawing where the hands matter, sources at the foot.
//
// Each guide is reached from the page it lives under, which renders it by
// calling `renderGuide`; the volunteer page links all four.
import { el, clear } from "../ui";
import { knownRegion } from "../state";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { squareArt, figureArt } from "../components/page-art";
import { richText } from "../components/rich-text";
import { mostWanted } from "../lib/invasives";
import { GUIDES, guideHref, guideSources, type Guide, type GuideBlock } from "../lib/howto";

const k = (key: string): TKey => key as TKey;

/** The region's own most-wanted list when we know the region, else all. */
export function invasivesHref(): string {
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
        : richText(t(k(b.key))));
    case "ol":
    case "ul":
      return el(b.kind, {}, b.keys.map((key) => el("li", {}, richText(t(k(key))))));
    case "note":
      return el("p", { class: `note ${b.tone}` }, [el("strong", {}, t(k(b.title))), " ", t(k(b.key))]);
    case "figure":
      return figureArt(b.name, t(k(b.caption)));
  }
}

/** A guide as a row: its square drawing, its name, one line. The row is the
 *  link, the way a plant's row is. */
export function guideRow(guide: Guide): HTMLElement {
  return el("a", { class: "card guide-row", href: guideHref(guide) }, [
    squareArt(guide.square),
    el("span", { class: "guide-row-text" }, [
      el("strong", {}, t(k(`howto.${guide.slug}.title`))),
      el("span", {}, t(k(`howto.${guide.slug}.line`))),
    ]),
  ]);
}

export function renderGuide(main: HTMLElement, guide: Guide): void {
  clear(main);
  const name = t(k(`howto.${guide.slug}.title`));
  document.title = t("howto.docTitle", { name });
  // The way on: the other guide under the same page, when there is one.
  const sibling = GUIDES.find((g) => g.home === guide.home && g !== guide);

  main.append(
    el("article", { class: "privacy-page" }, [
      el("p", { class: "back-trail" }, [el("a", { href: `#/${guide.home}` }, t(k(`howto.back.${guide.home}`)))]),
      el("h2", { class: "step-title" }, name),
      el("p", { class: "step-lede" }, t(k(`howto.${guide.slug}.lede`))),

      ...guide.sections.flatMap((section) => [
        el("h3", { id: section.id }, t(k(`howto.${guide.slug}.${section.id}.title`))),
        ...section.blocks.map(block),
      ]),

      // The volunteer page gathers all four; its own guide needn't say so.
      guide.home === "volunteer" ? null : el("p", { class: "more-link" }, tx("howto.groupWayOn", {
        link: el("a", { href: "#/volunteer" }, t("volunteer.title")),
      })),

      el("h3", {}, t("howto.sourcesTitle")),
      el("p", { class: "confidence" }, t("howto.sourcesLede")),
      el("ul", { class: "who-list" }, guideSources(guide).map((src) =>
        el("li", {}, [
          el("a", { href: src.url, target: "_blank", rel: "noopener" }, el("strong", {}, src.name)),
          el("span", { class: "sureness-from" }, ` — ${t(k(`howto.src.${src.id}`))}`),
        ]))),

      sibling
        ? el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
            el("a", { class: "btn btn-primary", href: guideHref(sibling) }, t(k(`howto.${sibling.slug}.title`))),
          ])
        : null,
    ]),
  );
}
