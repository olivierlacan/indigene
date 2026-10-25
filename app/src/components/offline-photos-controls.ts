// The Settings card for keeping a region's plant thumbnails on the device: how
// many and roughly how big before the tap, progress during, and the button that
// removes them again. The rules it follows are in `lib/offline-photos.ts`.
import { el, clear, toast } from "../ui";
import { quietLink } from "./guide-link";
import { privacyRoute } from "./privacy-link";
import { regionName } from "../lib/names";
import { fmtDate, fmtNumber, t, tn } from "../lib/i18n";
import {
  forgetPhotos,
  holdUntil,
  keepPhotos,
  ownRegion,
  planKeep,
  type KeepPlan,
  type KeepResult,
} from "../lib/offline-save";

/** The run in progress, if any. Module-level so leaving Settings and coming
 *  back shows the same run rather than offering to start a second one. */
let running: {
  done: number;
  total: number;
  stop: AbortController;
  /** The card on screen now: its progress line, and its redraw when done. */
  redraw?: () => void;
  refill?: (note?: string) => void;
} | null = null;

export function offlinePhotosCard(): HTMLElement {
  const card = el("div", { class: "card" });
  void fill();
  return card;

  async function fill(note?: string): Promise<void> {
    // A stop that holds (a refusal, repeated failures) says so through
    // `blocker()` below; nothing else needs a note.
    clear(card);
    card.append(el("h3", {}, t("offline.title")));
    if (running) return showRun();

    const region = await ownRegion();
    if (!region) {
      card.append(el("p", {}, t("offline.noRegion")));
      return;
    }
    card.append(el("p", {}, t("offline.lede", { region: regionName(region.meta) })));
    const status = el("p", { "aria-live": "polite" }, t("offline.counting"));
    card.append(status);
    let plan: KeepPlan;
    try {
      plan = await planKeep(region);
    } catch {
      status.textContent = t("offline.offline");
      return;
    }
    clear(status);

    const kept = plan.urls.length - plan.missing.length;
    const lines = [
      plan.missing.length
        ? tn("offline.size", plan.missing.length, { size: fmtNumber(plan.bytes / 1e6, 1) })
        : null,
      kept ? tn("offline.kept", kept) : null,
      plan.skipped ? tn("offline.skipped", plan.skipped) : null,
      note ?? null,
    ].filter((s): s is string => !!s);
    status.append(lines.join(" "));

    const blocked = blocker();
    if (blocked) card.append(el("p", { class: "note" }, blocked));

    const buttons: HTMLElement[] = [];
    if (plan.missing.length) {
      buttons.push(el("button", {
        class: "btn btn-secondary",
        disabled: !!blocked,
        onClick: () => start(plan),
      }, t("offline.keep")));
    }
    if (kept) {
      buttons.push(el("button", {
        class: "btn btn-ghost",
        onClick: async () => {
          await forgetPhotos();
          toast(t("offline.removed"));
          void fill();
        },
      }, t("offline.remove")));
    }
    if (buttons.length) card.append(el("div", { class: "btn-row", style: "margin-top:0.8rem" }, buttons));
    card.append(el("div", { class: "card-links" }, [
      quietLink("lock", privacyRoute("photos"), t("offline.privacyLink")),
    ]));
  }

  function start(plan: KeepPlan): void {
    const stop = new AbortController();
    running = { done: plan.urls.length - plan.missing.length, total: plan.urls.length, stop };
    void fill();
    void keepPhotos(plan, (done, total) => {
      if (!running) return;
      running.done = done;
      running.total = total;
      running.redraw?.();
    }, stop.signal).then(finish, () => finish("failing"));
  }

  function finish(result: KeepResult): void {
    // Whichever card is on screen now: the reader may have left Settings and
    // come back to a new one.
    const refill = running?.refill;
    running = null;
    if (result === "done") toast(t("offline.done"));
    refill?.(result === "full" ? t("offline.full") : undefined);
  }

  function showRun(): void {
    const run = running!;
    const label = el("p", { "aria-live": "polite" });
    const bar = el("span", {});
    const draw = () => {
      label.textContent = t("offline.progress", { done: run.done, total: run.total });
      bar.style.width = `${run.total ? (100 * run.done) / run.total : 0}%`;
    };
    run.redraw = draw;
    run.refill = (note) => { if (card.isConnected) void fill(note); };
    draw();
    card.append(
      label,
      el("div", { class: "keep-progress", role: "presentation" }, [bar]),
      el("div", { class: "btn-row", style: "margin-top:0.8rem" }, [
        el("button", { class: "btn btn-ghost", onClick: () => run.stop.abort() }, t("offline.stop")),
      ]),
    );
  }
}

/** Why the button can't be tapped now, if it can't. */
function blocker(): string | null {
  const until = holdUntil();
  if (until) return t("offline.held", { date: fmtDate(until) });
  if ((navigator as any).connection?.saveData) return t("offline.saveData");
  if (!navigator.onLine) return t("offline.offline");
  return null;
}
