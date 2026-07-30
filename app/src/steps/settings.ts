// Language & units — two switches, deliberately separate.
//
// The pairing people assume ("French means metric") is wrong often enough to
// matter: a French speaker gardening in Ohio buys plants tagged in feet, and an
// American in Bordeaux is handed metres by every nursery in town. So neither
// setting reads the other. Units default to the *device's region* rather than
// to the UI language, which gets both of those people right before they ever
// open this page.
import { el, clear } from "../ui";
import { LANGUAGES, getLang, setLang, t } from "../lib/i18n";
import { getUnitPref, getUnits, setUnitPref } from "../lib/units";
import type { UnitPref } from "../lib/units";
import { NAME_SOURCES_ROUTE } from "../lib/names";

export function renderSettings(main: HTMLElement): void {
  clear(main);

  main.append(
    el("h2", { class: "step-title" }, t("settings.title")),
    el("p", { class: "step-lede" }, t("settings.lede")),
    languageCard(),
    unitsCard(),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el(
        "button",
        { class: "btn btn-primary btn-block", onClick: () => history.back() },
        t("settings.done")
      ),
    ])
  );
}

function languageCard(): HTMLElement {
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

/** The "where the names come from" line, with its link to the Sources page.
 *  Split on the placeholder rather than concatenated, so the translation can
 *  put the link wherever the sentence wants it. */
function namesNoteParts(): (Node | string)[] {
  const [before, after] = t("settings.namesNote").split("{link}");
  return [before ?? "", el("a", { href: NAME_SOURCES_ROUTE }, t("settings.namesNoteLink")), after ?? ""];
}

function unitsCard(): HTMLElement {
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
