import { el, clear } from "../ui";
import { navigate, store, rememberDraftSpot } from "../state";
import { manualSunEstimate } from "../lib/solar";
import { sunPlain } from "../lib/plain";
import { sunIcon } from "../components/sun-icon";
import { whyThis } from "../components/learn";
import { t, fmtNumber } from "../lib/i18n";

// Step 2: sun. The manual path is FIRST and fully sufficient — some users will
// never grant camera access. The camera scan is offered as an optional upgrade.
export function renderSun(main: HTMLElement): void {
  clear(main);
  // A hand-picked region is as good a ticket in as a coordinate — the manual
  // sun picker needs neither. Only the sky scan needs a real location.
  const hasCoords = store.draft.lat != null;
  if (!hasCoords && !store.draft.regionOverride) return void navigate("location");

  const buckets: { key: "full" | "half" | "shade"; title: string; sub: string }[] = [
    { key: "full", title: t("sun.full"), sub: t("sun.fullSub") },
    { key: "half", title: t("sun.half"), sub: t("sun.halfSub") },
    { key: "shade", title: t("sun.shade"), sub: t("sun.shadeSub") },
  ];

  const result = el("div", { "aria-live": "polite" });

  function renderResult(): void {
    clear(result);
    const s = store.draft.sun;
    if (!s) return;
    result.append(
      el("div", { class: "note info" }, [
        el("strong", {}, t("sun.thisSpotGets")),
        `${sunPlain(s.hours)}. `,
        el("span", {}, t("sun.bestGuess", {
          hours: fmtNumber(s.hours),
          low: fmtNumber(s.low),
          high: fmtNumber(s.high),
        })),
        s.source === "scan"
          ? el("div", { style: "margin-top:0.4rem" }, t("sun.fromScan"))
          : el("div", { style: "margin-top:0.4rem" }, hasCoords ? t("sun.fromPickWithScan") : t("sun.fromPick")),
        // Recall is never silent. One line, and only while it's true: the
        // buttons that change it are directly above.
        ...(store.draft.recalled.sun
          ? [el("div", { class: "memory-note", style: "margin-top:0.4rem" }, t("sun.remembered"))]
          : []),
      ]),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("confirm") }, t("sun.next"))
    );
  }

  const choiceButtons = buckets.map((b) =>
    el("button", {
      class: "choice choice-with-glyph",
      "aria-pressed": store.draft.sun?.source !== "scan" && isSelected(b.key) ? "true" : "false",
      onClick: () => {
        store.draft.sun = manualSunEstimate(b.key);
        store.draft.horizon = { angles: new Array(72).fill(b.key === "full" ? 0 : b.key === "half" ? 25 : 45), source: "manual" };
        // Answered for themselves — whatever we recalled is no longer what's
        // on screen, so the note that said so goes with it.
        store.draft.recalled.sun = false;
        choiceButtons.forEach((btn, i) => btn.setAttribute("aria-pressed", buckets[i].key === b.key ? "true" : "false"));
        rememberDraftSpot();
        renderResult();
      },
    }, [
      el("span", { class: "choice-glyph", "aria-hidden": "true" }, [sunIcon(b.key)]),
      el("span", {}, [
        el("span", { class: "choice-title" }, b.title),
        el("span", { class: "choice-sub" }, b.sub),
      ]),
    ])
  );

  // Matched on the estimate's *hours*, not on its label: the label is a
  // sentence in whatever language was active when the estimate was made (it
  // rides along in saved spots), so comparing labels would quietly forget the
  // user's pick the moment they switched languages.
  function isSelected(key: string): boolean {
    const s = store.draft.sun;
    if (!s || s.source === "scan") return false;
    return s.hours === manualSunEstimate(key as "full" | "half" | "shade").hours;
  }

  const deciduousToggle = el("input", {
    type: "checkbox",
    id: "decid",
    checked: store.draft.deciduousOverhead,
    onChange: (e) => {
      store.draft.deciduousOverhead = (e.target as HTMLInputElement).checked;
      rememberDraftSpot();
    },
  }) as HTMLInputElement;

  main.append(
    el("h2", { class: "step-title" }, t("sun.title")),
    el("p", { class: "step-lede" }, hasCoords ? t("sun.ledeWithScan") : t("sun.lede")),
    whyThis(t("sun.whyTitle"), t("sun.why")),

    ...choiceButtons,

    el("div", { class: "card" }, [
      el("label", { for: "decid", style: "display:flex;gap:0.6rem;align-items:flex-start;font-weight:600" }, [
        deciduousToggle,
        el("span", {}, [
          t("sun.deciduous"),
          el("span", { style: "display:block;font-weight:400;color:var(--ink-soft);font-size:0.9rem;margin-top:0.2rem" }, t("sun.deciduousSub")),
        ]),
      ]),
    ]),

    // The scan computes sun angles for a specific point on Earth, so it only
    // exists when we have one. On the pick-your-region path there's no
    // coordinate — the quick pick above is the whole story.
    ...(hasCoords
      ? [el("div", { class: "card" }, [
          el("h3", {}, t("sun.scanTitle")),
          el("p", {}, t("sun.scanLede")),
          el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("scan") }, t("sun.scanStart")),
        ])]
      : []),

    result,

    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("location") }, t("sun.back")),
    ])
  );

  renderResult();
}
