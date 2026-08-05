// The "we haven't finished translating this page" banner.
//
// The app's writing is translated as an overlay (see `lib/prose.ts`): a locale
// supplies the paragraphs it has and the rest falls back to the English they
// were authored in. That's what lets a French edition ship before ~33,000 words
// of botanical prose are translated — but it means a page can honestly be
// half in one language and half in another, and the one thing we won't do is
// let that happen quietly.
//
// It used to be said as a small green note somewhere in the middle of the page,
// which is exactly where a reader who is confused by the language switch has
// already stopped looking. Now it's one banner, in hazard stripes, at the top of
// the page under the header — the visual grammar of roadworks, because that's
// what this is: a thing being built, still usable, worth walking past carefully.
//
// **One banner per page, mounted centrally.** A step doesn't render it; it
// *reports* its gap while rendering (`reportUntranslated`) and `main.ts` mounts
// the result once the route is done. Two reasons: a step can't accidentally put
// it in the middle of its own layout, and a page assembled from several
// renderers (the roster's category pages, the wildlife index's groups) can't end
// up wearing three of them.
import { el } from "../ui";
import { t, tn, fmtNumber } from "../lib/i18n";
import { proseCoverage } from "../lib/prose";
import type { Plant } from "../types";

/** What the current route has reported, if anything. Cleared at the start of
 *  every route (`resetUntranslated`), so it can never leak across a navigation. */
let pending: string | null = null;

/**
 * Declare that some of what this page is showing is still in English.
 *
 * `detail` is the already-translated sentence saying *what* is untranslated —
 * "part of this plant's description", "all 40 of these" — because only the step
 * knows which of those it is. Called more than once in a render (a page that
 * lists both plants and animals), the first report wins: the banner is a flag,
 * not an inventory, and the first one is the one nearest the top of the page.
 */
export function reportUntranslated(detail: string): void {
  if (pending === null) pending = detail;
}

/**
 * The report for any page that prints a *list* of plants and their paragraphs —
 * a region roster, one of its category pages, the ranked results. Lives here
 * rather than in one of those steps so the other two don't have to import it
 * from a sibling screen.
 */
export function reportRosterUntranslated(plants: Plant[], regionId?: string): void {
  const { translated, total } = proseCoverage(plants, regionId);
  if (translated === total) return;
  const missing = total - translated;
  // "40 of these 40" is a sentence nobody writes. When none of the roster is
  // translated — the usual case for a region we haven't reached — say that.
  reportUntranslated(
    translated === 0
      ? tn("wip.rosterAll", missing, { n: fmtNumber(missing) })
      : t("wip.roster", { n: fmtNumber(missing), total: fmtNumber(total) })
  );
}

/** Called before a route renders. */
export function resetUntranslated(): void {
  pending = null;
}

/** Called after a route renders: puts the banner at the top of the page, under
 *  the header, or does nothing when the page had nothing to admit to. */
export function mountUntranslatedBanner(main: HTMLElement): void {
  if (pending === null) return;
  main.prepend(
    el("div", { class: "wip-banner", role: "note" }, [
      el("div", { class: "wip-hazard", "aria-hidden": "true" }),
      el("div", { class: "wip-banner-body" }, [
        el("span", { class: "wip-banner-icon", "aria-hidden": "true" }, "🚧"),
        el("p", { class: "wip-banner-text" }, [
          el("strong", { class: "wip-banner-title" }, t("wip.title")),
          pending,
        ]),
      ]),
      el("div", { class: "wip-hazard", "aria-hidden": "true" }),
    ])
  );
}
