// Step 4: what do you want this spot to *do*?
//
// This question used to be answered for you and hidden behind a panel on the
// plant list — seven sliders, pre-set to values nobody chose, tucked inside a
// closed `<details>` labelled "What matters most?". The ranking was honest and
// the reasoning was published, but the *asking* never happened: people met a
// sorted list and had no idea why oaks were at the top, or that they could say
// otherwise.
//
// So it's a step now, before the list rather than beside it, and it answers
// three things at once:
//
//   - **Why is it ranked this way?** Because you picked a goal, and each goal
//     says in one line what it favours. The default is a named goal too, not an
//     unlabelled starting position.
//   - **What does this slider actually do?** Every slider carries the plain
//     meaning of the thing it weighs and says its value in words ("counts a
//     lot"), not just a number on an unlabelled scale.
//   - **Did that change anything?** The preview underneath re-ranks the whole
//     region as you move, names who's leading, and says out loud when the order
//     didn't budge — because "nothing happened" and "nothing changed" look
//     identical otherwise.
//
// Filters stay where they were, on the list itself: they *narrow* results
// rather than rank them, and that's a question you ask once you've seen what
// came back.
import { el, clear } from "../ui";
import { navigate, store, persistPrefs, resultsTrail, keepTrail } from "../state";
import { draftRegion, draftPlants, rankDraft, draftContext } from "../lib/draft";
import { PRESETS, matchingPreset, weightWord } from "../lib/priorities";
import { SCORE_KEYS, scoreLabel } from "../lib/plain";
import { whyThis } from "../components/learn";
import { recompute } from "../components/recompute";
import { silhouetteFor } from "../components/plant-card";
import { commonName, regionName } from "../lib/names";
import { t, fmtNumber } from "../lib/i18n";
import type { Weights } from "../types";

/** How deep a slice of the ranking the preview compares. Three names are shown
 *  — but a change that only reshuffles ranks 4 to 25 is still a change, and
 *  reporting on the top three alone would call it "nothing moved". */
const PREVIEW_DEPTH = 25;

export async function renderPriorities(main: HTMLElement): Promise<(() => void) | void> {
  clear(main);
  const { region, hasCoords } = draftRegion();
  if (!hasCoords && !store.draft.regionOverride) return void navigate("location");
  // No roster for this spot: the plant list owns that dead end (and says so
  // plainly, with a way out) — there's nothing to prioritise here.
  if (!region) return void navigate("results");

  const plants = await draftPlants(region);
  const context = draftContext(region);
  const rc = recompute("goals");

  // --- The live preview -----------------------------------------------------
  const leaders = el("ol", { class: "preview-list" });
  const previewCount = el("p", { class: "preview-count" });
  const zeroNote = el("p", { class: "note warn", style: "display:none;margin:0.5rem 0 0" }, t("priorities.allZero"));

  // Arriving is not a recompute — see the same flag on the plant list.
  let firstPaint = true;

  function refresh(): void {
    const ranked = rankDraft(plants);
    const window_ = ranked.slice(0, PREVIEW_DEPTH);
    const good = ranked.filter((r) => r.match !== "poor").length;

    leaders.replaceChildren(...window_.slice(0, 3).map((r) =>
      el("li", {}, [
        el("span", { class: "preview-glyph", "aria-hidden": "true" }, [silhouetteFor(r.plant.form, 20)]),
        commonName(r.plant),
      ])
    ));
    previewCount.textContent = t("priorities.previewCount", {
      good: fmtNumber(good),
      n: fmtNumber(ranked.length),
    });
    zeroNote.style.display = SCORE_KEYS.every((k) => store.weights[k] === 0) ? "" : "none";
    rc.report(context, window_.map((r) => ({ id: r.plant.id, name: commonName(r.plant) })),
      ranked.length, firstPaint);
    firstPaint = false;
  }

  const preview = el("section", { class: "preview", "aria-label": t("priorities.previewTitle") }, [
    el("p", { class: "preview-k" }, t("priorities.previewTitle")),
    leaders,
    previewCount,
    rc.node,
  ]);

  // --- The goals ------------------------------------------------------------
  // Each one says what it favours, so choosing is an informed act rather than a
  // guess between six nouns.
  const goalButtons = PRESETS.map((p) => {
    const btn = el("button", {
      class: "choice",
      "aria-pressed": "false",
      onClick: () => applyWeights(p.weights),
    }, [
      el("span", { class: "choice-title" }, t(p.key)),
      el("span", { class: "choice-sub" }, t(p.subKey)),
    ]) as HTMLButtonElement;
    return { btn, weights: p.weights };
  });

  function markGoal(): void {
    const active = matchingPreset(store.weights);
    goalButtons.forEach((g) =>
      g.btn.setAttribute("aria-pressed", active && active.weights === g.weights ? "true" : "false"));
  }

  // --- The sliders ----------------------------------------------------------
  // Same seven components the score breakdown shows, in the same order and with
  // the same icons — and each with the one-line explanation of what it means,
  // the sentence that used to live only on a plant's own page.
  const sliderRows = SCORE_KEYS.map((key) => {
    const label = scoreLabel(key);
    const word = el("span", { class: "weight-word" }, weightWord(store.weights[key]));
    const input = el("input", {
      type: "range", min: "0", max: "5", step: "1", value: String(store.weights[key]),
      "aria-label": t("priorities.sliderAria", { name: label.name }),
      "aria-valuetext": weightWord(store.weights[key]),
      onInput: (e) => {
        store.weights[key] = Number((e.target as HTMLInputElement).value);
        setWord(key, word, input);
        markGoal();
        persistPrefs();
        refresh();
      },
    }) as HTMLInputElement;
    return {
      key,
      input,
      word,
      row: el("div", { class: "weight-row" }, [
        el("div", { class: "weight-head" }, [
          el("span", {}, [el("span", { "aria-hidden": "true" }, `${label.icon} `), label.name]),
          word,
        ]),
        input,
        el("p", { class: "weight-why" }, label.plain),
      ]),
    };
  });

  function setWord(key: keyof Weights, word: HTMLElement, input: HTMLInputElement): void {
    const said = weightWord(store.weights[key]);
    word.textContent = said;
    input.setAttribute("aria-valuetext", said);
  }

  function applyWeights(w: Weights): void {
    store.weights = { ...w };
    sliderRows.forEach((s) => {
      s.input.value = String(w[s.key]);
      setWord(s.key, s.word, s.input);
    });
    markGoal();
    persistPrefs();
    refresh();
  }

  const tuning = el("details", { class: "weights", style: "margin-top:0.75rem" }, [
    el("summary", {}, t("priorities.tuneSummary")),
    el("p", { class: "step-lede", style: "margin:0.5rem 0 0.25rem" }, t("priorities.tuneLede")),
    ...sliderRows.map((s) => s.row),
  ]);

  // Arriving from the plant list (its "Change" button) means there's a list
  // standing behind this page; the way back says so instead of walking the
  // reader backwards through the flow they already finished.
  const backToList = resultsTrail.open;

  main.append(
    el("p", { class: "region-tag", style: "margin:0 0 0.5rem;font-size:0.9rem;color:var(--ink-soft)" },
      t("results.regionTag", { region: regionName(region.meta) })),
    el("h2", { class: "step-title" }, t("priorities.title")),
    el("p", { class: "step-lede" }, t("priorities.lede")),
    whyThis(t("priorities.whyTitle"), t("priorities.why")),
    el("h3", { style: "margin:1rem 0 0.4rem" }, t("priorities.pickTitle")),
    ...goalButtons.map((g) => g.btn),
    zeroNote,
    preview,
    tuning,
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", {
        class: "btn btn-secondary",
        onClick: () => navigate(backToList ? "results" : "confirm"),
      }, t(backToList ? "priorities.backToList" : "priorities.back")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("results") }, t("priorities.next")),
    ])
  );

  markGoal();
  refresh();

  // The offer of a way back to the list survives only if it's taken from here.
  return () => keepTrail(location.hash);
}
