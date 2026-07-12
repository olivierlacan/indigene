import { el, clear } from "../ui";
import { navigate, resetDraft } from "../state";
import { listSpots } from "../db";
import { REGIONS } from "../lib/plants";

export async function renderWelcome(main: HTMLElement): Promise<void> {
  clear(main);
  const spots = await listSpots().catch(() => []);

  main.append(
    el("h2", { class: "step-title" }, "Find the right native plants for exactly where you're standing"),
    el("p", { class: "step-lede" }, [
      "Stand in the spot you want to plant. This app measures how much sun it gets, looks up the soil and climate, and shows you native plants that will actually thrive there — ranked by how much they help local wildlife.",
    ]),
    el("div", { class: "note info" }, [
      el("strong", {}, "No account, nothing to sign up for. "),
      "Everything stays on your phone, and it keeps working with no signal once you've loaded a spot.",
    ]),
    el("div", { class: "card" }, [
      el("h3", {}, REGIONS.length > 1 ? "Regions covered so far" : "Right now this covers one region"),
      el("p", {}, "Plant recommendations are tuned region by region. The app picks the right list from where you're standing:"),
      el("ul", { style: "margin:0.4rem 0 0.6rem;padding-left:1.2rem" },
        REGIONS.map((r) => el("li", { style: "margin-bottom:0.3rem" }, `${r.meta.name} — ${r.meta.reference}`))
      ),
      el("p", { style: "margin:0" }, "Outside these areas the sun and soil readings still work, and the app tells you plainly when it has no plant list for your spot yet."),
    ]),
    el("button", {
      class: "btn btn-primary btn-block",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, "Start — where are you standing?"),

    el("div", { style: spots.length ? "margin-top:1.5rem" : "display:none" }, [
      el("h3", {}, "Your saved spots"),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("saved") }, `Open saved spots (${spots.length})`),
    ]),

    el("p", { style: "margin-top:2rem;font-size:0.85rem;opacity:0.75" }, [
      "Open-source (MIT). Data from USDA, USGS, ISRIC SoilGrids, Open-Meteo, and Tallamy/NWF host-plant research. ",
      "It gives its best honest estimate and always tells you how sure it is.",
    ])
  );
}
