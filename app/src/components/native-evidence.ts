// One line under "why it belongs here": who checked that claim, and when.
//
// The page already cites the authority a row was written from. This says
// something the citation cannot — that somebody re-asked, on a date, and what
// the answer was. Where the answer was "no", it says that too: a page that only
// ever showed agreement would be advertising the check rather than reporting it.
//
// Deliberately a sentence and not a badge, for the same reason the conservation
// note is. A green tick reading VERIFIED invites a reader to stop reading; the
// interesting cases here are the twelve rows where a world checklist and a
// regional flora disagree, and a tick cannot say that.
import { el } from "../ui";
import { nativeEvidence, NATIVE_EVIDENCE_URL } from "../lib/native-evidence";
import { t } from "../lib/i18n";
import { langTag } from "../lib/i18n";
import { guideHref } from "./guide-link";

/** "Sep 26", "sept. 26": the check's date, small. */
const shortMonthYear = (iso: string): string =>
  new Intl.DateTimeFormat(langTag(), { month: "short", year: "2-digit", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const monthYear = (iso: string): string =>
  new Intl.DateTimeFormat(langTag(), { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

/**
 * The line for a plant in a region, or null where that region has never been
 * re-asked — which is the honest answer, and why every caller can append this
 * result blindly.
 */
export function nativeEvidenceLine(plantId: string, regionId?: string): HTMLElement | null {
  const ev = nativeEvidence(plantId, regionId);
  if (!ev) return null;

  const kew = el(
    "a",
    { href: NATIVE_EVIDENCE_URL, target: "_blank", rel: "noopener", class: "src-link" },
    t("evidence.checklist"),
  );

  // A check when Kew agrees, a caution mark when it doesn't: the verdict at a
  // glance, the sentence for the detail, and the guide for what the check is.
  // When it was checked, as a small clock tag at the end of the sentence. It
  // opens the guide's explanation of the check; the words say both in full.
  const meta = el("a", {
    class: "native-evidence-meta",
    href: guideHref("sources", "kew"),
    "aria-label": t("evidence.checkedAria", { when: monthYear(ev.checked) }),
    title: t("evidence.checkedAria", { when: monthYear(ev.checked) }),
  }, [clockIcon(), shortMonthYear(ev.checked)]);

  if (!ev.unconfirmed) {
    return el("div", { class: "native-evidence" }, [
      mark("ok"),
      el("p", {}, [
        kew,
        t("evidence.confirmedAfter", { area: ev.area }),
        // Said only where the area checked is wider than the region, because then
        // the check is a floor and not a verdict about this ground.
        ...(ev.coarse ? [" ", t("evidence.coarse", { area: ev.area })] : []),
        " ", meta,
      ]),
    ]);
  }

  return el("div", { class: "native-evidence native-evidence-open" }, [
    mark("warn"),
    el("p", {}, [
      kew,
      t(`evidence.unconfirmed.${ev.unconfirmed}` as const, { area: ev.area }),
      " ",
      t("evidence.stands"),
      " ", meta,
    ]),
  ]);
}

const NS = "http://www.w3.org/2000/svg";
/** A circled check (Kew agrees) or a caution triangle (it doesn't). */
function mark(kind: "ok" | "warn"): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({
    viewBox: "0 0 20 20", "aria-hidden": "true", class: `evidence-mark evidence-${kind}`,
    fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round",
  })) svg.setAttribute(k, v);
  const add = (tag: string, a: Record<string, string>): void => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(a)) n.setAttribute(k, v);
    svg.append(n);
  };
  if (kind === "ok") {
    add("circle", { cx: "10", cy: "10", r: "8.2" });
    add("path", { d: "M6.3 10.3l2.5 2.5 5-5.3" });
  } else {
    add("path", { d: "M10 2.8 18 16.6H2z" });
    add("line", { x1: "10", y1: "8", x2: "10", y2: "11.6" });
    add("circle", { cx: "10", cy: "14.1", r: "0.9", fill: "currentColor", stroke: "none" });
  }
  return svg;
}

/** A small clock: "when this was checked". */
function clockIcon(): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({
    viewBox: "0 0 20 20", "aria-hidden": "true", class: "evidence-clock",
    fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round",
  })) svg.setAttribute(k, v);
  for (const [tag, a] of [["circle", { cx: "10", cy: "10", r: "7.6" }], ["path", { d: "M10 5.8V10l2.8 1.8" }]] as const) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(a)) n.setAttribute(k, v);
    svg.append(n);
  }
  return svg;
}
