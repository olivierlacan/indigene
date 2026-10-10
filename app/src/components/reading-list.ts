// A region's further reading as rows, and the short version of it that sits on
// the region page.
//
// Each row is a link off the site — somebody else's book or channel — so, like
// the societies, it opens in a new tab and carries no chevron. What a scan needs
// is in the row: the title, who made it, and the one or two facts that say why
// it was picked (who recommends it, how many people follow it). The depth is on
// the far side of the link, where it belongs.
import { el } from "../ui";
import { sectionHeading } from "./section-link";
import { readingFor, type Reading } from "../data/reading";
import { t, tn, fmtList, fmtNumber, getLang, langTag } from "../lib/i18n";

const KIND_ICON: Record<Reading["kind"], string> = {
  book: "📖",
  site: "🌐",
  video: "▶️",
  social: "📷",
};

/** How many picks the region page shows before the heading's link takes over. */
const ON_REGION_PAGE = 3;

/** "212K" in English, "212 k" in French — an audience is a magnitude, and its
 *  last three digits were out of date the day after we read them. */
function compact(n: number): string {
  return new Intl.NumberFormat(langTag(), { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** "in French", only when the pick isn't in the reader's language. */
function languageNote(lang: string): string | null {
  const base = lang.split("-")[0];
  if (base === getLang()) return null;
  const name = new Intl.DisplayNames([langTag()], { type: "language" }).of(base);
  return name ? t("reading.inLang", { lang: name }) : null;
}

function row(r: Reading): HTMLElement {
  const who = [t("reading.by", { who: r.by }), r.year ? String(r.year) : null, languageNote(r.lang)]
    .filter(Boolean)
    .join(" · ");
  const proof: string[] = [];
  if (r.vouched?.length) proof.push(t("reading.vouched", { names: fmtList(r.vouched.map((v) => v.name)) }));
  if (r.audience) {
    proof.push(tn(r.kind === "video" ? "reading.subscribers" : "reading.followers", r.audience.count, {
      n: compact(r.audience.count),
    }));
  }
  if (r.award) proof.push(r.award);
  return el("li", { class: "reading-row" }, [
    el("span", { class: "reading-kind", title: t(`reading.kind.${r.kind}` as const) }, KIND_ICON[r.kind]),
    el("div", { class: "reading-body" }, [
      el("a", { href: r.url, target: "_blank", rel: "noopener", class: "reading-title", lang: r.lang }, r.title),
      el("span", { class: "reading-by" }, `${who} — ${t(`reading.backer.${r.backer}` as const)}`),
      proof.length ? el("span", { class: "reading-proof" }, proof.join(" · ")) : null,
    ]),
  ]);
}

export function readingList(rows: Reading[]): HTMLElement {
  return el("ul", { class: "reading-list" }, rows.map(row));
}

/** The region page's version: the first few picks, under a heading that opens
 *  the region's whole list. Nothing at all where none are researched. */
export function readingSection(regionId: string): HTMLElement[] {
  const rows = readingFor(regionId);
  if (!rows.length) return [];
  return [
    el("section", { class: "reading", style: "margin-top:1.5rem" }, [
      sectionHeading(`#/reading/${regionId}`, "📚", t("reading.title"), fmtNumber(rows.length)),
      readingList(rows.slice(0, ON_REGION_PAGE)),
    ]),
  ];
}
