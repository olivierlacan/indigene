// "Yes, that did something."
//
// The ranking is recomputed on every change — a slider, a filter, a different
// goal — but recomputing is invisible when the answer comes out the same, and
// an app that looks inert is an app you stop trusting. Worse, silence is
// ambiguous in exactly the wrong direction: did nothing happen, or did nothing
// change? Those are different sentences and this component says which.
//
// So every recompute reports, out loud and in the same place: what moved, what
// didn't, and how many plants are in the running now. It flashes even when the
// words repeat, because "nothing moved" twice in a row is two answers, not one.
import { el } from "../ui";
import { t, tn, fmtNumber } from "../lib/i18n";

/** One plant in the window being compared — its id, and the name to say if it
 *  takes the lead. */
export interface Pick {
  id: string;
  name: string;
}

interface Snapshot {
  /** Which spot and list this ranking was of; a different one isn't a change,
   *  it's a different question, and gets no "12 plants moved". */
  context: string;
  ids: string[];
  total: number;
}

/**
 * The last ranking each page reported, kept module-level so it outlives the
 * page's own render.
 *
 * Per page, not shared: the goals step reports on every slider move, while the
 * plant list should compare against the list *you last saw*. Share one memory
 * and the list has nothing left to say when you arrive — the preview already
 * consumed the change. Keep them apart and landing on the list after changing a
 * goal says "switchgrass now leads", which is the moment the answer matters.
 */
const lastRanking: Record<string, Snapshot | undefined> = {};

export interface Recompute {
  node: HTMLElement;
  /**
   * Compare this ranking against the last one reported and say what changed.
   * The first sight of a given spot only remembers — there's nothing to have
   * changed from yet.
   *
   * @param context Identifies the spot/list being ranked (see `Snapshot`).
   * @param picks The ranking window being compared, best first.
   * @param total How many plants are in the running at all.
   * @param quiet Say nothing if nothing changed. For a page's first paint:
   *   arriving somewhere is not a recompute, and "the order didn't change"
   *   is only worth saying to someone who just tried to change it.
   */
  report(context: string, picks: Pick[], total: number, quiet?: boolean): void;
}

/**
 * @param memory Which page's memory to compare against — see `lastRanking`.
 */
export function recompute(memory: "goals" | "list"): Recompute {
  const node = el("p", { class: "recompute", role: "status", "aria-live": "polite" });

  function say(message: string): void {
    node.textContent = message;
    node.classList.remove("is-fresh");
    void node.offsetWidth; // restart the flash — a repeated answer is still an answer
    node.classList.add("is-fresh");
  }

  return {
    node,
    report(context, picks, total, quiet = false) {
      const ids = picks.map((p) => p.id);
      const prev = lastRanking[memory];
      lastRanking[memory] = { context, ids, total };
      if (!prev || prev.context !== context) {
        node.textContent = "";
        node.classList.remove("is-fresh");
        return;
      }
      if (prev.total !== total) {
        return say(tn("rerank.set", total, { n: fmtNumber(total) }));
      }
      const moved = ids.reduce((n, id, i) => (prev.ids[i] === id ? n : n + 1), 0);
      if (!moved) return quiet ? undefined : say(t("rerank.same"));
      if (picks.length && prev.ids[0] !== ids[0]) {
        return say(t("rerank.lead", { name: picks[0].name }));
      }
      say(tn("rerank.moved", moved, { n: fmtNumber(moved) }));
    },
  };
}
