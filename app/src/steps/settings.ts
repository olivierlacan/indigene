// Language & units.
//
// **This screen is deliberately a shell.** A fuller settings screen is being
// built separately; the two controls it hosts live in
// `components/prefs-controls.ts` so that screen can import them and this file
// can be deleted in one line. What must not disappear with it is the *pair* —
// language and units are two independent choices (see the note in
// `prefs-controls.ts` for why), and they need to stay reachable.
import { el, clear } from "../ui";
import { t } from "../lib/i18n";
import { languageCard, unitsCard } from "../components/prefs-controls";

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
