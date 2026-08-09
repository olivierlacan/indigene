// Taking your spots with you — the Settings card over `lib/backup.ts`.
//
// Everything else on this page is about one remembered value and the button
// that throws it away. This card is about the opposite move: the saved spots
// and their planting logs live in this browser and nowhere else, which is the
// promise the app is built on and also the reason a phone and a laptop can't
// see each other. So the card offers the two halves of doing it by hand —
// write a copy out, read a copy in — and says plainly what each one did.
//
// Three things it is careful about:
//
//  - The buttons are **stacked, full width**. A row of two would put a phone's
//    narrowest column under a translated label and wrap it.
//  - An import **reports back in figures, not a sentence** — what arrived, what
//    was already here, what was left out. That's a table's job, and a table
//    survives translation intact.
//  - The card **re-reads itself** after an import. It opens with a count of
//    what's here and a Save button that's greyed out when there's nothing to
//    save; leaving those alone would have the card saying "nothing saved yet"
//    directly above a note reporting the spots it had just taken in.
import { el, toast } from "../ui";
import { cardStats } from "./card-stats";
import { privacyNote } from "./privacy-link";
import { applySpotsFile, collectSpots, downloadSpotsFile, parseSpotsFile } from "../lib/backup";
import type { ImportTally, ReadFailure } from "../lib/backup";
import { listPlantings, listSpots } from "../db";
import { t, tn, fmtNumber } from "../lib/i18n";

/** Which message a failed read gets. The union lives with the parser. */
const FAILURE_TEXT: Record<ReadFailure, "backup.errUnreadable" | "backup.errNotOurs" | "backup.errTooNew"> = {
  unreadable: "backup.errUnreadable",
  notOurs: "backup.errNotOurs",
  tooNew: "backup.errTooNew",
};

/**
 * The card. Async because it opens with a count of what's actually here, and a
 * card that said "nothing saved yet" for a frame before correcting itself would
 * be wrong about the one thing the reader would most mind.
 */
export async function spotsFileCard(): Promise<HTMLElement> {
  /** The count row, or the "nothing here yet" note — refilled after an import. */
  const head = el("div", {});
  const result = el("div", { role: "status", "aria-live": "polite" });
  const picker = el("input", {
    type: "file",
    accept: "application/json,.json",
    hidden: true,
  });
  const saveBtn = el("button", {
    class: "btn btn-secondary btn-block",
    onClick: () => void save(),
  }, t("backup.save"));

  await refreshHead();
  picker.addEventListener("change", () => void read());

  return el("div", { class: "card" }, [
    el("h3", {}, t("backup.title")),
    el("p", {}, t("backup.lede")),
    head,
    // Stacked, not side by side: see the note at the top of the file.
    el("div", { style: "display:grid;gap:0.6rem;margin-top:1rem" }, [saveBtn,
      el("button", {
        class: "btn btn-secondary btn-block",
        onClick: () => picker.click(),
      }, t("backup.open")),
    ]),
    picker,
    result,
    privacyNote(t("backup.privacy"), undefined, "saved"),
  ]);

  /** What's on the device right now, in figures — and whether there's anything
   *  to write out at all. Nothing saved leaves the Save button in place but
   *  greyed, so the card still shows both halves of what it's for. */
  async function refreshHead(): Promise<void> {
    const [spots, plantings] = await Promise.all([
      listSpots().catch(() => []),
      listPlantings().catch(() => []),
    ]);
    saveBtn.disabled = spots.length === 0;
    head.replaceChildren(
      spots.length
        ? cardStats([
            {
              icon: "📍",
              value: fmtNumber(spots.length),
              label: tn("backup.statSpots", spots.length, { count: fmtNumber(spots.length) }),
            },
            plantings.length
              ? {
                  icon: "🌱",
                  value: fmtNumber(plantings.length),
                  label: tn("backup.statPlantings", plantings.length, {
                    count: fmtNumber(plantings.length),
                  }),
                }
              : null,
          ])
        : el("p", { class: "note info", style: "margin-bottom:0" }, t("backup.empty"))
    );
  }

  async function save(): Promise<void> {
    try {
      downloadSpotsFile(await collectSpots());
      toast(t("backup.saved"));
    } catch {
      say("warn", t("backup.errStore"));
    }
  }

  async function read(): Promise<void> {
    const file = picker.files?.[0];
    // Choosing the same file twice has to work — without this the second pick
    // fires no event at all, and the card looks broken.
    picker.value = "";
    if (!file) return;

    let text: string;
    try {
      text = await file.text();
    } catch {
      return say("warn", t("backup.errUnreadable"));
    }

    const parsed = parseSpotsFile(text);
    if (!parsed.ok) return say("warn", t(FAILURE_TEXT[parsed.why]));
    if (!parsed.file.spots.length) return say("warn", t("backup.errEmpty"));

    let tally: ImportTally;
    try {
      tally = await applySpotsFile(parsed.file, parsed.skipped);
    } catch {
      return say("warn", t("backup.errStore"));
    }
    report(tally);
    await refreshHead();
  }

  /** One plain message, replacing whatever the last action said. */
  function say(kind: "info" | "warn", message: string): void {
    result.replaceChildren(
      el("p", { class: `note ${kind}`, style: "margin:1rem 0 0" }, message)
    );
  }

  /** What the import did, as figures. */
  function report(tally: ImportTally): void {
    if (!tally.spotsAdded && !tally.plantingsAdded && !tally.skipped) {
      return say("info", t("backup.nothingNew"));
    }
    result.replaceChildren(
      el("div", { class: "note info", style: "margin:1rem 0 0" }, [
        el("strong", {}, t("backup.readTitle")),
        el("dl", { class: "memory-list" }, [
          ...row(t("backup.rowSpots"), tally.spotsAdded),
          ...(tally.plantingsAdded ? row(t("backup.rowPlantings"), tally.plantingsAdded) : []),
          ...(tally.spotsKnown ? row(t("backup.rowSpotsKnown"), tally.spotsKnown) : []),
          ...(tally.skipped ? row(t("backup.rowSkipped"), tally.skipped) : []),
        ]),
      ])
    );
    if (tally.spotsAdded) {
      result.append(
        el("p", { style: "margin:0.6rem 0 0" }, [
          el("a", { href: "#/saved" }, t("backup.seeSaved")),
        ])
      );
    }
  }
}

function row(label: string, value: number): HTMLElement[] {
  return [el("dt", {}, label), el("dd", {}, fmtNumber(value))];
}
