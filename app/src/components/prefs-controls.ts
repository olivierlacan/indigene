// The language and units pickers, as two standalone cards.
//
// They live in a component rather than inside a screen because **where** they
// belong is still moving: right now `steps/settings.ts` is a thin shell around
// them, and a fuller settings screen is in flight separately. Whoever ends up
// owning that screen imports `languageCard()` and `unitsCard()` and drops them
// in; nothing about the controls themselves has to move with them.
//
// The one design decision baked in here is that these are **two cards, not
// one**. The pairing people assume — "French means metric" — is wrong often
// enough to matter: a French speaker gardening in Ohio buys plants tagged in
// feet, and an American in Bordeaux is handed metres by every nursery in town.
// Presenting them as a single "locale" control would quietly take that choice
// away from both of them.
import { el } from "../ui";
import { LANGUAGES, getLang, setLang, t } from "../lib/i18n";
import { getUnitPref, getUnits, setUnitPref } from "../lib/units";
import type { UnitPref } from "../lib/units";
import { NAME_SOURCES_ROUTE } from "../lib/names";

/** Pick the language the app is read in. Changing it re-renders in place. */
export function languageCard(): HTMLElement {
  const current = getLang();
  return el("div", { class: "card" }, [
    el("h3", {}, t("settings.language")),
    el("p", {}, t("settings.languageHelp")),
    ...LANGUAGES.map((l) =>
      el("button", {
        class: "choice",
        "aria-pressed": l.code === current ? "true" : "false",
        onClick: () => setLang(l.code),
      }, [
        // The endonym alone: a picker that says "French" to a French speaker is
        // a picker they can't read, and "Français (French)" is a parenthesis
        // nobody needed.
        el("span", { class: "choice-title" }, l.endonym),
      ])
    ),
    el("p", { style: "margin:0.6rem 0 0;font-size:0.9rem" }, namesNoteParts()),
  ]);
}

/**
 * Pick the units measurements are shown in — independently of the language.
 *
 * "Match my device" is the default and resolves from the device's *region*, so
 * an `en-US` phone gets feet and an `fr-CA` phone gets metres without anyone
 * touching anything. An explicit pick is remembered in `localStorage` and wins
 * from then on, including across reloads and language switches.
 */
export function unitsCard(): HTMLElement {
  const pref = getUnitPref();
  const options: { value: UnitPref; label: string; sub: string }[] = [
    {
      value: "auto",
      label: t("settings.units.auto"),
      // Say what "auto" resolves to right now, so the choice isn't a mystery
      // box — the same honesty rule the sun estimate follows.
      sub: t("settings.units.autoSub", {
        resolved: t(getUnits() === "metric" ? "settings.units.metric" : "settings.units.imperial"),
      }),
    },
    { value: "metric", label: t("settings.units.metric"), sub: t("settings.units.metricSub") },
    { value: "imperial", label: t("settings.units.imperial"), sub: t("settings.units.imperialSub") },
  ];

  return el("div", { class: "card" }, [
    el("h3", {}, t("settings.units")),
    el("p", {}, t("settings.unitsHelp")),
    ...options.map((o) =>
      el("button", {
        class: "choice",
        "aria-pressed": o.value === pref ? "true" : "false",
        onClick: () => setUnitPref(o.value),
      }, [
        el("span", { class: "choice-title" }, o.label),
        el("span", { class: "choice-sub" }, o.sub),
      ])
    ),
  ]);
}

/** The "where the names come from" line, with its link to the Sources page.
 *  Split on the placeholder rather than concatenated, so the translation can
 *  put the link wherever the sentence wants it. */
function namesNoteParts(): (Node | string)[] {
  const [before, after] = t("settings.namesNote").split("{link}");
  return [before ?? "", el("a", { href: NAME_SOURCES_ROUTE }, t("settings.namesNoteLink")), after ?? ""];
}
