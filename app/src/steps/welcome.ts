import { el, clear } from "../ui";
import { navigate, resetDraft } from "../state";
import { listSpots } from "../db";
import { REGIONS } from "../lib/plants";
import { featuredPlant } from "../lib/explore";
import { whyThis } from "../components/learn";
import { DATA_SOURCES_URL, ISSUES_URL } from "../lib/plain";

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
    el("div", { class: "card" }, [
      el("h3", {}, REGIONS.length > 1 ? "Regions covered so far" : "Right now this covers one region"),
      el("p", {}, "Plant recommendations are tuned region by region — the app picks the right list based on where you're standing:"),
      el("ul", { style: "margin:0.4rem 0 0.6rem;padding-left:1.2rem" },
        REGIONS.map((r) => el("li", { style: "margin-bottom:0.3rem" }, [
          el("a", { href: `#/regions/${r.meta.id}`, style: "font-weight:650" }, r.meta.name),
          ` — ${r.meta.reference}`,
        ]))
      ),
      el("p", { style: "margin:0" }, [
        "Outside these areas, sun and soil readings still work — just no plant list yet. Want yours next? ",
        el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, "Suggest your area on GitHub"),
        ".",
      ]),
    ]),
    el("button", {
      class: "btn btn-primary btn-block",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, "Start here — where are you standing?"),

    // The plant-first path: start from a plant instead of a spot. One showcase
    // native per region; each opens a shareable page with a spot checker.
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("h3", {}, "Or start from a plant"),
      el("p", {}, "Meet one standout native from each region, then see if it would thrive in your spot:"),
      el("ul", { style: "margin:0.4rem 0 0.6rem;padding-left:1.2rem" },
        REGIONS.map((r) => {
          const p = featuredPlant(r);
          return el("li", { style: "margin-bottom:0.35rem" }, [
            el("a", { href: `#/plants/${p.id}`, style: "font-weight:650" }, p.common),
            " — ",
            el("a", { href: `#/regions/${r.meta.id}` }, r.meta.name),
          ]);
        })
      ),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("plants") }, "🌿 Explore the natives"),
    ]),

    el("div", { style: spots.length ? "margin-top:1.5rem" : "display:none" }, [
      el("h3", {}, "Your saved spots"),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("saved") }, `Open saved spots (${spots.length})`),
    ]),

    el("p", { style: "margin-top:2rem;font-size:0.85rem" }, [
      "Open-source (MIT). Data from USDA, USGS, EPA ecoregions, ISRIC SoilGrids, Open-Meteo, and Tallamy/NWF host-plant research — ",
      el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "full source list & licensing"),
      ". It gives its best honest estimate and always tells you how sure it is.",
    ])
  );
}
