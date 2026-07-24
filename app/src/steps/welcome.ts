import { el, clear } from "../ui";
import { navigate, resetDraft } from "../state";
import { listSpots } from "../db";
import { whyThis } from "../components/learn";
import { DATA_SOURCES_URL } from "../lib/plain";

export async function renderWelcome(main: HTMLElement): Promise<void> {
  clear(main);
  const spots = await listSpots().catch(() => []);

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
    whyThis("Why native plants?", [
      "Most caterpillars can only eat the plants they evolved with, and nearly every backyard bird raises its chicks on caterpillars. No natives, no caterpillars, no baby birds. ",
      "Plant a native, and the food web is back in business that same season.",
    ]),
    el("button", {
      class: "btn btn-primary btn-block",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, "Start here — where are you standing?"),
    // The escape hatch for people who'd rather not use their location: the
    // regions and featured-plants cards live on the browse page instead.
    el("p", { style: "margin-top:0.6rem;font-size:0.85rem;color:var(--ink-soft);text-align:center" }, [
      "Rather not use your location? ",
      el("a", { href: "#/browse" }, "Browse regions & native plants"),
      " instead.",
    ]),

    el("div", { style: spots.length ? "margin-top:1.5rem" : "display:none" }, [
      el("h3", {}, "Your saved spots"),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("saved") }, `Open saved spots (${spots.length})`),
    ]),

    el("p", { style: "margin-top:2rem;font-size:0.85rem" }, [
      "Open-source (MIT), built on public scientific data — ",
      el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "full source list & licensing"),
      ". Every estimate comes with an honest confidence level.",
    ])
  );
}
