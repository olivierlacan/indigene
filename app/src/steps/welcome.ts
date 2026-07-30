import { el, clear } from "../ui";
import { navigate, resetDraft } from "../state";
import { listSpots } from "../db";
import { t, tn, tx } from "../lib/i18n";
import { prefsSummary } from "../components/chrome";

export function renderWelcome(main: HTMLElement): void {
  clear(main);

  // Filled in below once IndexedDB answers — the page must never wait on it
  // (a stalled database used to leave the whole home screen blank).
  const savedSection = el("div", { style: "display:none" });

  main.append(
    el("h2", { class: "step-title" }, t("welcome.title")),
    el("p", { class: "step-lede" }, t("welcome.lede1")),
    el("p", { class: "step-lede" }, t("welcome.lede2")),
    el("div", { class: "note info" }, [
      el("strong", {}, t("welcome.noAccount")),
      t("welcome.noAccountRest"),
    ]),
    el("button", {
      class: "btn btn-primary btn-block",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, t("welcome.start")),
    // The escape hatch for people who'd rather not use their location: the
    // regions and featured-plants cards live on the browse page instead.
    el("p", { style: "margin-top:0.6rem;font-size:0.85rem;color:var(--ink-soft);text-align:center" },
      tx("welcome.ratherNot", {
        link: el("a", { href: "#/browse" }, t("welcome.ratherNotLink")),
      })
    ),
    // Language & units, met on first contact rather than hunted for. The
    // footer carries the same link on every page, but this is where a reader
    // who needs it actually arrives — a French speaker shouldn't have to read
    // an English page to the bottom to find the switch that makes it French.
    el("p", { class: "prefs-inline" }, [
      el("span", { "aria-hidden": "true" }, "🌐 "),
      el("a", { href: "#/settings" }, `${prefsSummary()} — ${t("welcome.changePrefs")}`),
    ]),

    // The pitch for anyone not yet convinced — in plain sight, not a drawer.
    el("h3", { style: "margin-top:1.8rem" }, t("welcome.whyTitle")),
    el("p", {}, t("welcome.why1")),
    el("p", {}, t("welcome.why2")),

    savedSection
  );

  listSpots()
    .then((spots) => {
      if (!spots.length || !savedSection.isConnected) return;
      savedSection.style.display = "";
      savedSection.style.marginTop = "1.5rem";
      savedSection.append(
        el("h3", {}, t("welcome.savedTitle")),
        el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("saved") },
          tn("welcome.openSaved", spots.length))
      );
    })
    .catch(() => {});
}
