// "How sure we are" (route `#/confidence`) — what the confidence meter on every
// plant page means.
//
// The meter is three bars and a word. This page is the sentence behind each
// level, written once, plus the two things a reader asks next: why plants are
// rated one by one, and what the rating doesn't cover. The fuller accounting —
// which figures are counted and which are our judgment — stays on `#/sources`.
import { el, clear } from "../ui";
import { t } from "../lib/i18n";
import { SOURCES_ROUTE } from "../lib/plain";
import { confidenceMeter } from "../components/confidence-meter";
import type { Confidence } from "../components/confidence-meter";

const LEVELS: Confidence[] = ["high", "medium", "low"];

export function renderConfidence(main: HTMLElement): void {
  clear(main);
  document.title = t("confidence.docTitle");

  main.append(
    el("article", { class: "privacy-page confidence-page" }, [
      el("h2", { class: "step-title" }, t("confidence.title")),
      el("p", { class: "step-lede" }, t("confidence.lede")),

      el("dl", { class: "card confidence-levels" }, LEVELS.flatMap((level) => [
        el("dt", { id: `confidence-${level}` }, confidenceMeter(level)),
        el("dd", {}, t(`confidence.${level}` as const)),
      ])),

      el("h3", {}, t("confidence.whyTitle")),
      el("p", {}, t("confidence.why")),

      el("h3", {}, t("confidence.notTitle")),
      el("p", {}, t("confidence.not")),
      el("p", {}, t("confidence.scores")),
      el("p", {}, el("a", { href: SOURCES_ROUTE }, t("confidence.sourcesLink"))),
    ]),
  );
}
