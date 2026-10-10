// Further reading, as pages.
//
//   #/reading          → every region's list, one after the other.
//   #/reading/<region> → one region's list alone — the page a region page's
//                        "Further reading" heading opens, and the one to send
//                        somebody who asks "what should I read about plants here?".
//
// The picks and the two tests they passed are in `data/reading.ts`.
import { el, clear } from "../ui";
import { REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { readingFor, readingRegionIds } from "../data/reading";
import { readingList } from "../components/reading-list";
import { sectionHeading } from "../components/section-link";
import { regionName, regionShort } from "../lib/names";
import { t } from "../lib/i18n";

/** The line every list ends on: how the picks were chosen, so a count of
 *  followers reads as evidence rather than as an advertisement. */
function howChosen(): HTMLElement {
  return el("p", { class: "confidence", style: "margin-top:1rem" }, t("reading.howChosen"));
}

function regionsWithReading(): RegionDef[] {
  const ids = new Set(readingRegionIds());
  return REGIONS.filter((r) => ids.has(r.meta.id));
}

export function renderReadingIndex(main: HTMLElement): void {
  clear(main);
  document.title = t("reading.docTitle");
  main.append(
    el("h2", { class: "step-title" }, t("reading.title")),
    el("p", { class: "step-lede" }, t("reading.lede")),
    ...regionsWithReading().map((region) =>
      el("section", { style: "margin-top:1.25rem" }, [
        sectionHeading(`#/reading/${region.meta.id}`, "📍", regionName(region.meta)),
        readingList(readingFor(region.meta.id)),
      ])),
    howChosen(),
  );
}

export function renderReading(main: HTMLElement, param?: string): void {
  clear(main);
  const region = REGIONS.find((r) => r.meta.id === param);
  const rows = region ? readingFor(region.meta.id) : [];
  if (!region || !rows.length) {
    main.append(
      el("h2", { class: "step-title" }, t("region.nothingHere")),
      el("p", {}, el("a", { href: "#/reading" }, t("reading.backToIndex"))),
    );
    return;
  }
  document.title = t("reading.regionDocTitle", { region: regionName(region.meta) });
  const others = regionsWithReading().filter((r) => r.meta.id !== region.meta.id);
  main.append(
    el("p", { class: "back-trail" }, [el("a", { href: "#/reading" }, t("reading.backToIndex"))]),
    el("h2", { class: "step-title" }, t("reading.title")),
    el("p", { class: "region-tag", style: "margin:0 0 0.3rem;font-size:0.95rem" }, [
      "📍 ",
      el("a", { href: `#/regions/${region.meta.id}` }, regionName(region.meta)),
    ]),
    el("p", { class: "step-lede" }, t("reading.regionLede")),
    readingList(rows),
    howChosen(),
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("p", { style: "margin:0 0 0.4rem;font-weight:650" }, t("reading.otherRegions")),
      el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem" }, others.map((r) =>
        el("a", {
          class: "btn btn-secondary btn-compact",
          style: "flex:0 1 auto;text-decoration:none",
          href: `#/reading/${r.meta.id}`,
        }, regionShort(r.meta)))),
    ]),
  );
}
