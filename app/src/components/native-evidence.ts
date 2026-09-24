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
    t("native.checklist"),
  );

  if (!ev.unconfirmed) {
    return el("p", { class: "note native-evidence" }, [
      // "Native in Michigan — Kew's World Checklist agrees, checked September 2026."
      t("native.confirmedBefore", { area: ev.area }),
      kew,
      t("native.confirmedAfter", { when: monthYear(ev.checked) }),
      // Said only where the area checked is wider than the region, because then
      // the check is a floor and not a verdict about this ground.
      ...(ev.coarse ? [" ", t("native.coarse", { area: ev.area })] : []),
    ]);
  }

  return el("p", { class: "note native-evidence native-evidence-open" }, [
    kew,
    t(`native.unconfirmed.${ev.unconfirmed}` as const, { area: ev.area }),
    " ",
    t("native.stands"),
  ]);
}
