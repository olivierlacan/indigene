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
import {
  applySpotsFile,
  collectSpots,
  downloadSpotsFile,
  lastCopyAt,
  likelySameSpots,
  parseSpotsFile,
  rememberCopy,
  spotAliases,
} from "../lib/backup";
import type { ImportTally, LikelySame, ReadFailure, Restore, SpotsFile } from "../lib/backup";
import type { Planting } from "../types";
import { length } from "../lib/units";
import { listPlantings, listSpots, storageKept } from "../db";
import { t, tn, fmtDate, fmtNumber } from "../lib/i18n";

/**
 * Safari on an iPhone or iPad, outside the Home Screen app. That's where a
 * site's storage is cleared after about a week of Safari use without a visit;
 * the Home Screen app keeps its own — and starts empty. (iPadOS reports itself
 * as a Mac, so a touch screen gives it away.)
 */
function inIosSafari(): boolean {
  const ios =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const homeScreen =
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    matchMedia("(display-mode: standalone)").matches;
  return ios && !homeScreen;
}

/** Which message a failed read gets. The union lives with the parser. */
const FAILURE_TEXT: Record<ReadFailure, "backup.errUnreadable" | "backup.errNotOurs" | "backup.errTooNew"> = {
  unreadable: "backup.errUnreadable",
  notOurs: "backup.errNotOurs",
  tooNew: "backup.errTooNew",
};

/**
 * The last import's figures, kept outside the card. Restoring units or a
 * language redraws the whole Settings page, so the card that ran the import is
 * gone by the time it would report; the new one picks the figures up here.
 */
let pendingReport: ImportTally | null = null;

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
  if (pendingReport) {
    report(pendingReport);
    pendingReport = null;
  }

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
    inIosSafari()
      ? el("p", { class: "note warn", style: "margin:1rem 0 0" }, [
          t("backup.iosSafari"),
          " ",
          el("a", { href: "/guide/backup/" }, t("backup.iosGuide")),
        ])
      : null,
    privacyNote(t("backup.privacy"), undefined, "saved"),
  ]);

  /** What's on the device right now, in figures — and whether there's anything
   *  to write out at all. Nothing saved leaves the Save button in place but
   *  greyed, so the card still shows both halves of what it's for. */
  async function refreshHead(): Promise<void> {
    const [spots, plantings, lastCopy, kept] = await Promise.all([
      listSpots().catch(() => []),
      listPlantings().catch(() => []),
      lastCopyAt(),
      storageKept(),
    ]);
    saveBtn.disabled = spots.length === 0;
    // How safe the spots are right now: when a copy last left this browser,
    // and whether the browser has agreed not to clear them (`db.ts`).
    const safety = [
      lastCopy ? t("backup.lastCopy", { date: fmtDate(lastCopy) }) : t("backup.noCopy"),
      kept === true ? t("backup.kept") : kept === false ? t("backup.notKept") : "",
    ].filter(Boolean).join(" ");
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
        : el("p", { class: "note info", style: "margin-bottom:0" }, t("backup.empty")),
      ...(spots.length ? [el("p", { class: "hint", style: "margin:0.6rem 0 0" }, safety)] : [])
    );
  }

  async function save(): Promise<void> {
    try {
      downloadSpotsFile(await collectSpots());
      toast(t("backup.saved"));
      await rememberCopy();
      await refreshHead();
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

    let pairs: LikelySame[];
    let hereLog: Planting[];
    try {
      const [here, log, aliases] = await Promise.all([listSpots(), listPlantings(), spotAliases()]);
      pairs = likelySameSpots(here, parsed.file, aliases);
      hereLog = log;
    } catch {
      return say("warn", t("backup.errStore"));
    }
    // Nothing is written until the person has answered: leaving now leaves
    // this browser exactly as it was, and the file can be brought in again.
    if (pairs.length) return ask(parsed.file, parsed.skipped, pairs, hereLog);
    await bringIn(parsed.file, parsed.skipped, {});
  }

  /**
   * One choice per spot in the file that looks like one already here, then a
   * single button that brings the whole file in.
   */
  function ask(file: SpotsFile, skipped: number, pairs: LikelySame[], hereLog: Planting[]): void {
    const combine = new Map(pairs.map((p) => [p.there.id, p.suggest === "combine"]));
    const plantingsIn = (log: readonly Planting[], spotId: string): number =>
      log.filter((p) => p.spotId === spotId).length;

    const rows = pairs.map((pair) => {
      const choice = (value: boolean, title: string, sub: string): HTMLButtonElement => {
        const btn = el("button", {
          class: "choice",
          "aria-pressed": String(combine.get(pair.there.id) === value),
          onClick: () => {
            combine.set(pair.there.id, value);
            for (const b of [yes, no]) b.setAttribute("aria-pressed", String(b === btn));
          },
        }, [el("span", { class: "choice-title" }, title), el("span", { class: "choice-sub" }, sub)]);
        return btn;
      };
      const yes = choice(true, t("backup.combine"), t("backup.combineSub", { here: pair.here.label }));
      const no = choice(false, t("backup.keepBoth"), t("backup.keepBothSub"));
      const inFile = plantingsIn(file.plantings, pair.there.id);
      const inHere = plantingsIn(hereLog, pair.here.id);
      return el("div", { style: "margin-top:1rem" }, [
        el("strong", {}, pair.sameName
          ? pair.there.label
          : t("backup.pairNames", { there: pair.there.label, here: pair.here.label })),
        cardStats([
          {
            icon: "📍",
            value: length(pair.metres * 3.28084),
            label: t("backup.pairApart", { distance: length(pair.metres * 3.28084) }),
          },
          {
            icon: "💾",
            value: fmtNumber(inFile),
            label: tn("backup.pairInFile", inFile, { count: fmtNumber(inFile) }),
          },
          {
            icon: "🌱",
            value: fmtNumber(inHere),
            label: tn("backup.pairHere", inHere, { count: fmtNumber(inHere) }),
          },
        ]),
        yes,
        no,
      ]);
    });

    result.replaceChildren(
      el("div", { class: "note info", style: "margin:1rem 0 0" }, [
        el("strong", {}, t("backup.askTitle")),
        el("p", { style: "margin:0.4rem 0 0" }, t("backup.askLede")),
        ...rows,
        el("div", { style: "display:grid;gap:0.6rem;margin-top:1rem" }, [
          el("button", {
            class: "btn btn-primary btn-block",
            onClick: () => {
              const chosen: Record<string, string> = {};
              for (const p of pairs) if (combine.get(p.there.id)) chosen[p.there.id] = p.here.id;
              void bringIn(file, skipped, chosen);
            },
          }, t("backup.bringIn")),
          el("button", {
            class: "btn btn-secondary btn-block",
            onClick: () => result.replaceChildren(),
          }, t("backup.cancel")),
        ]),
      ])
    );
  }

  async function bringIn(file: SpotsFile, skipped: number, combine: Record<string, string>): Promise<void> {
    let restore: Restore;
    try {
      restore = await applySpotsFile(file, skipped, combine);
    } catch {
      return say("warn", t("backup.errStore"));
    }
    // Kept first, then the settings that redraw the page; the redrawn card
    // reports it. With nothing redrawn, this card reports it itself.
    pendingReport = restore.tally;
    if (restore.finish()) return;
    pendingReport = null;
    report(restore.tally);
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
    if (
      !tally.spotsAdded &&
      !tally.spotsUpdated &&
      !tally.spotsCombined &&
      !tally.plantingsAdded &&
      !tally.plantingsUpdated &&
      !tally.lookupsAdded &&
      !tally.sightingsAdded &&
      !tally.settingsRestored &&
      !tally.skipped
    ) {
      return say("info", t("backup.nothingNew"));
    }
    result.replaceChildren(
      el("div", { class: "note info", style: "margin:1rem 0 0" }, [
        el("strong", {}, t("backup.readTitle")),
        el("dl", { class: "memory-list" }, [
          ...row(t("backup.rowSpots"), tally.spotsAdded),
          ...(tally.plantingsAdded ? row(t("backup.rowPlantings"), tally.plantingsAdded) : []),
          ...(tally.spotsCombined ? row(t("backup.rowSpotsCombined"), tally.spotsCombined) : []),
          ...(tally.spotsUpdated ? row(t("backup.rowSpotsUpdated"), tally.spotsUpdated) : []),
          ...(tally.plantingsUpdated
            ? row(t("backup.rowPlantingsUpdated"), tally.plantingsUpdated)
            : []),
          ...(tally.sightingsAdded ? row(t("backup.rowSightings"), tally.sightingsAdded) : []),
          ...(tally.settingsRestored ? row(t("backup.rowSettings"), tally.settingsRestored) : []),
          ...(tally.spotsKnown ? row(t("backup.rowSpotsKnown"), tally.spotsKnown) : []),
          ...(tally.skipped ? row(t("backup.rowSkipped"), tally.skipped) : []),
        ]),
      ])
    );
    if (tally.spotsAdded || tally.spotsUpdated || tally.spotsCombined || tally.plantingsUpdated) {
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
