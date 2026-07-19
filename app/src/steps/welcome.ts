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
    el("h2", { class: "step-title" }, "Bring the birds and butterflies back — starting exactly where you're standing"),
    el("p", { class: "step-lede" }, [
      "Most yards are green but empty: lawns and imported ornamentals that local wildlife can't eat. Native plants are what your birds, bees, and butterflies actually live on. Stand in the spot you want to plant, and this app measures the sun, looks up the soil and climate, and shows you the natives that will thrive there — ranked by how much life they feed.",
    ]),
    el("div", { class: "note info" }, [
      el("strong", {}, "No account, nothing to sign up for. "),
      "Everything stays on your phone, and it keeps working with no signal once you've loaded a spot.",
    ]),
    whyThis("Why native plants?", [
      "Most caterpillars can only eat the plants they evolved alongside, and nearly every backyard bird raises its chicks on caterpillars. No natives means no caterpillars, and no caterpillars means no baby birds. ",
      "A native plant is the bottom of the local food web — and it's back in business the season you plant it.",
    ]),
    el("div", { class: "card" }, [
      el("h3", {}, REGIONS.length > 1 ? "Regions covered so far" : "Right now this covers one region"),
      el("p", {}, "Plant recommendations are tuned region by region. The app picks the right list from where you're standing:"),
      el("ul", { style: "margin:0.4rem 0 0.6rem;padding-left:1.2rem" },
        REGIONS.map((r) => el("li", { style: "margin-bottom:0.3rem" }, [
          el("a", { href: `#/regions/${r.meta.id}`, style: "font-weight:650" }, r.meta.name),
          ` — ${r.meta.reference}`,
        ]))
      ),
      el("p", { style: "margin:0" }, [
        "Outside these areas the sun and soil readings still work, and the app tells you plainly when it has no plant list for your spot yet. Want your area next? ",
        el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, "Suggest it on GitHub"),
        " — open an issue with your ZIP or town so we know where to grow next.",
      ]),
    ]),
    el("button", {
      class: "btn btn-primary btn-block",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, "Start — where are you standing?"),

    // The plant-first path: start from a plant instead of a spot. One showcase
    // native per region; each opens a shareable page with a spot checker.
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("h3", {}, "Or start from a plant"),
      el("p", {}, "Meet one standout native from each region, then check whether the spot you have in mind would suit it:"),
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

    el("p", { style: "margin-top:2rem;font-size:0.85rem;opacity:0.75" }, [
      "Open-source (MIT). Data from USDA, USGS, EPA ecoregions, ISRIC SoilGrids, Open-Meteo, and Tallamy/NWF host-plant research — ",
      el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "full source list & licensing"),
      ". It gives its best honest estimate and always tells you how sure it is.",
    ])
  );
}
