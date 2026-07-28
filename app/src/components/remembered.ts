import { el } from "../ui";

// The recall-disclosure note. Whenever a screen pre-answers a question from a
// sticky preference, this note says so in place: what was remembered, that it
// only lives on this device, and where to manage it (the Preferences page).
// An optional inline action offers the direct switch — "use the map's guess",
// "start fresh" — when that's easier than a round-trip through Preferences.
export function rememberedNote(
  what: (string | HTMLElement)[],
  action?: { label: string; onClick: () => void }
): HTMLElement {
  return el("div", { class: "note info" }, [
    el("strong", {}, "Remembered from your last visit: "),
    ...what,
    el("div", { style: "margin-top:0.4rem" }, [
      "Saved on this device only — ",
      el("a", { href: "#/preferences" }, "manage what Indigene remembers"),
      ...(action
        ? [" — or ", el("button", { class: "linklike", onClick: action.onClick }, action.label), "."]
        : ["."]),
    ]),
  ]);
}
