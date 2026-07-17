import { el, clear } from "../ui";
import { navigate, store } from "../state";
import { manualSunEstimate } from "../lib/solar";
import { sunPlain } from "../lib/plain";
import { sunIcon } from "../components/sun-icon";
import { whyThis } from "../components/learn";

// Step 2: sun. The manual path is FIRST and fully sufficient — some users will
// never grant camera access. The camera scan is offered as an optional upgrade.
export function renderSun(main: HTMLElement): void {
  clear(main);
  // A hand-picked region is as good a ticket in as a coordinate — the manual
  // sun picker needs neither. Only the sky scan needs a real location.
  const hasCoords = store.draft.lat != null;
  if (!hasCoords && !store.draft.regionOverride) return void navigate("location");

  const buckets: { key: "full" | "half" | "shade"; title: string; sub: string }[] = [
    { key: "full", title: "Sunny most of the day", sub: "Direct sun for 6+ hours — open lawn, south side, no big trees close by." },
    { key: "half", title: "Sun for about half the day", sub: "A few hours of direct sun, shade the rest — near a building or scattered trees." },
    { key: "shade", title: "Mostly shady", sub: "Little direct sun — under trees, north side, or hemmed in by walls." },
  ];

  const result = el("div", { "aria-live": "polite" });

  function renderResult(): void {
    clear(result);
    const s = store.draft.sun;
    if (!s) return;
    result.append(
      el("div", { class: "note info" }, [
        el("strong", {}, "This spot gets "),
        `${sunPlain(s.hours)}. `,
        el("span", {}, `Best guess ${s.hours} hours, likely somewhere between ${s.low} and ${s.high}.`),
        s.source === "scan"
          ? el("div", { style: "margin-top:0.4rem" }, "Measured from your sky scan.")
          : el("div", { style: "margin-top:0.4rem" }, hasCoords ? "From your quick pick — scan the sky below for a sharper estimate." : "From your quick pick."),
      ]),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("confirm") }, "Next: check the soil & climate →")
    );
  }

  const choiceButtons = buckets.map((b) =>
    el("button", {
      class: "choice choice-with-glyph",
      "aria-pressed": store.draft.sun?.source !== "scan" && isSelected(b.key) ? "true" : "false",
      onClick: () => {
        store.draft.sun = manualSunEstimate(b.key);
        store.draft.horizon = { angles: new Array(72).fill(b.key === "full" ? 0 : b.key === "half" ? 25 : 45), source: "manual" };
        choiceButtons.forEach((btn, i) => btn.setAttribute("aria-pressed", buckets[i].key === b.key ? "true" : "false"));
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

  function isSelected(key: string): boolean {
    const s = store.draft.sun;
    if (!s || s.source === "scan") return false;
    return s.label === manualSunEstimate(key as "full" | "half" | "shade").label;
  }

  const deciduousToggle = el("input", {
    type: "checkbox",
    id: "decid",
    checked: store.draft.deciduousOverhead,
    onChange: (e) => { store.draft.deciduousOverhead = (e.target as HTMLInputElement).checked; },
  }) as HTMLInputElement;

  main.append(
    el("h2", { class: "step-title" }, "How much sun does this spot get?"),
    el("p", { class: "step-lede" }, hasCoords ? "Pick the closest match — the sky scan below can sharpen it." : "Pick the closest match."),
    whyThis("Why do we ask about sun first?", [
      "Hours of direct sun decide more about what will thrive than anything else you can measure. ",
      "And shade isn't a flaw — there's a native for every light level, from prairie flowers to forest-floor ferns. The light just decides which ones.",
    ]),

    ...choiceButtons,

    el("div", { class: "card" }, [
      el("label", { for: "decid", style: "display:flex;gap:0.6rem;align-items:flex-start;font-weight:600" }, [
        deciduousToggle,
        el("span", {}, [
          "🍂 Trees overhead that go bare in winter?",
          el("span", { style: "display:block;font-weight:400;color:var(--ink-soft);font-size:0.9rem;margin-top:0.2rem" }, "Bare branches make spring and fall much sunnier — we'll account for it."),
        ]),
      ]),
    ]),

    // The scan computes sun angles for a specific point on Earth, so it only
    // exists when we have one. On the pick-your-region path there's no
    // coordinate — the quick pick above is the whole story.
    ...(hasCoords
      ? [el("details", { class: "card" }, [
          el("summary", { style: "min-height:3rem;display:flex;align-items:center;font-weight:700;cursor:pointer" }, "📷 Scan the sky for a sharper estimate (optional)"),
          el("p", {}, "Point your phone at the skyline and slowly turn all the way around. We'll trace how high the trees and rooftops rise and calculate the real sun hours for this exact spot. Needs camera and motion access — you can skip it entirely."),
          el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("scan") }, "Start sky scan"),
        ])]
      : []),

    result,

    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("location") }, "Back"),
    ])
  );

  renderResult();
}
