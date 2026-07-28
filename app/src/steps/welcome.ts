import { el, clear } from "../ui";
import { navigate, resetDraft } from "../state";
import { listSpots } from "../db";

export function renderWelcome(main: HTMLElement): void {
  clear(main);

  // Filled in below once IndexedDB answers — the page must never wait on it
  // (a stalled database used to leave the whole home screen blank).
  const savedSection = el("div", { style: "display:none" });

  main.append(
    el("h2", { class: "step-title" }, "Bring back birds & butterflies, here & now."),
    el("p", { class: "step-lede" }, [
      "Most yards are green but lifeless: lawns, shrubs, and flowers that local wildlife can't survive on yet require constant watering, pesticides, and fertilizers.",
    ]),
    el("p", { class: "step-lede" }, [
      "Native plants evolved to feed and nurture birds, bees, and butterflies. Indigene helps you bring back the ecosystem they desperately need to survive & thrive.",
    ]),
    el("div", { class: "note info" }, [
      el("strong", {}, "No account, no tracking. "),
      "Everything stays in your browser and works offline.",
    ]),
    el("button", {
      class: "btn btn-primary btn-block",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, "Start where you're standing"),
    // The escape hatch for people who'd rather not use their location: the
    // regions and featured-plants cards live on the browse page instead.
    el("p", { style: "margin-top:0.6rem;font-size:0.85rem;color:var(--ink-soft);text-align:center" }, [
      "Rather not use your location? ",
      el("a", { href: "#/browse" }, "Browse regions & native plants"),
      " instead.",
    ]),

    // The pitch for anyone not yet convinced — in plain sight, not a drawer.
    el("h3", { style: "margin-top:1.8rem" }, "Why native plants?"),
    el("p", {}, "Most caterpillars can only eat the plants they evolved with, and nearly every backyard bird raises its chicks on caterpillars. No natives, no caterpillars, no baby birds."),
    el("p", {}, "Plant a native, and the food web is back in business that same season."),

    savedSection
  );

  listSpots()
    .then((spots) => {
      if (!spots.length || !savedSection.isConnected) return;
      savedSection.style.display = "";
      savedSection.style.marginTop = "1.5rem";
      savedSection.append(
        el("h3", {}, "Your saved spots"),
        el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("saved") }, `Open saved spots (${spots.length})`)
      );
    })
    .catch(() => {});
}
