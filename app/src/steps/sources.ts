// The "Where our numbers come from" page (route `#/sources`). The companion to
// Privacy & safety: that page says how we treat *you*, this one says how much to
// trust the *numbers*.
//
// Its job is not to reassure. Indigene puts confident-looking figures in front of
// people — "391 caterpillar species", "80 ft tall", a 0–100 score — and some of
// those are counted from open datasets while others are our own judgment. A
// reader deserves to know which is which, and where we're most likely wrong. So
// this page ends by naming the weakest numbers in the app and asking to be
// corrected, rather than waiting to be caught.
//
// Written for the same audience as the rest of the app — including kids and
// grandparents — so: plain words, no jargon left unexplained, and the honest
// caveat stated rather than buried.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { DATA_SOURCES_URL, ISSUES_URL } from "../lib/plain";

const REPO_URL = "https://github.com/olivierlacan/indigene";
const MATRIX_DOI = "https://doi.org/10.1002/ece3.73004";

type Sureness = "counted" | "calculated" | "estimated";

/**
 * One "where this number comes from" row: what the number is, and who it came
 * from. How sure we are isn't repeated per row — it's the heading the row sits
 * under, so the reader learns each meaning once instead of decoding a badge
 * eleven times.
 */
function figure(name: string, ...from: (string | Node)[]): HTMLElement {
  return el("li", {}, [
    el("strong", {}, name),
    el("span", { class: "sureness-from" }, [" ", ...from]),
  ]);
}

/**
 * A group of figures that are all sure in the same way. The heading carries the
 * kind, the line under it says what the kind means in plain words, and the
 * groups run firmest first — counted, then calculated, then estimated — so the
 * order itself is the ranking.
 */
function surenessGroup(kind: Sureness, heading: string, meaning: string, rows: HTMLElement[]): HTMLElement {
  return el("section", { class: `sureness-group sureness-${kind}` }, [
    el("h4", {}, heading),
    el("p", { class: "sureness-meaning" }, meaning),
    el("ul", { class: "who-list" }, rows),
  ]);
}

export function renderSources(main: HTMLElement): void {
  clear(main);
  document.title = "Where our numbers come from — Indigene";

  main.append(
    el("article", { class: "privacy-page sources-page" }, [
      el("h2", { class: "step-title" }, "Where our numbers come from"),
      el("p", { class: "step-lede" },
        "Indigene shows you numbers — how many caterpillars a tree feeds, how tall it gets, how well it holds a bank together. Some of those are counted from open science data. Others are our best judgment. This page tells you which is which, and where we'd bet we're wrong."),

      el("div", { class: "note info lede-note" }, [
        el("strong", {}, "The short version. "),
        el("ul", {}, [
          el("li", {}, "Nothing here is invented. Every number has a source, and every plant shows its own sources on its page."),
          el("li", {}, "Some numbers are counted from real datasets. Others are careful estimates — we label those honestly."),
          el("li", {}, "Our plant lists are starter lists, not the complete flora of anywhere."),
          el("li", {}, "We'd genuinely rather be corrected than believed. If a number looks wrong to you, it might be."),
        ]),
      ]),

      el("h3", {}, "Every number, and how sure we are"),
      el("p", {},
        "Every figure in the app comes to us in one of three ways, and they're not equally firm. Here they are grouped by which, firmest first."),

      surenessGroup("counted", "Counted",
        "Somebody tallied it in a published dataset, and we read it off. The firmest kind of number here.", [
        figure("Caterpillar host count",
          "— in Europe, from the Gaytán 2026 Lepidoptera–plant matrix; in the US, from the Tallamy / National Wildlife Federation figures."),
        figure("Native or not",
          "— from the national botanical records: USDA PLANTS in the US, Tela Botanica and the INPN in France, plus regional floras."),
        figure("Your ecoregion",
          "— the US EPA's ecoregion map, or the European Environment Agency's, asked about your exact point."),
        figure("Your soil and its acidity",
          "— from SoilGrids, a global soil map. Coarse: it describes a 250-metre square, not your flower bed."),
        figure("Rain and winter cold", "— from Open-Meteo's weather records for your area."),
        figure("Elevation and slope", "— from national elevation data for your point."),
        figure("Which wildlife a plant feeds",
          "— each plant-and-animal pairing cites a source, and the app refuses to show one that doesn't. How ",
          el("em", {}, "much"),
          " an animal depends on that plant is our reading of those sources."),
      ]),

      surenessGroup("calculated", "Calculated",
        "Nobody published this figure for your spot, so the app works it out from measured numbers using a method someone else published. Same arithmetic every time — you could do it on paper and get what we got.", [
        figure("Hours of sun",
          "— your device calculates where the sun goes over your spot across the year, using the standard NOAA method. No lookup, no network."),
        figure("Hardiness zone",
          "— from your recorded winter lows, using the published USDA zone definition, rather than reading an official map."),
      ]),

      surenessGroup("estimated", "Estimated",
        "A person on our side weighed the evidence and picked a number. Useful, and the softest kind here — these are the ones to doubt first.", [
        figure("How big it gets, and how fast",
          "— typical growth on an average site, from floras and forestry references. Real plants vary enormously."),
        figure("The six 0–100 scores",
          "— pollinators, birds, soaking up rain, holding soil, storing carbon, ease of establishing. Informed by the sources on each plant's page, but these are judgments we made, on a scale we invented."),
      ]),

      el("h3", {}, "The assumptions behind them"),
      el("p", {},
        "Every number above rests on something we decided. These are the decisions that would move the most if we got them wrong:"),
      el("ul", {}, [
        el("li", {}, [
          el("strong", {}, "We count caterpillars by plant family group, not by exact species. "),
          "The host count on an English oak is really the count for oaks in general. We do it because the American and European datasets are only comparable at that level — but it means a species that hosts fewer insects than its relatives looks better than it is.",
        ]),
        el("li", {}, [
          el("strong", {}, "For European counts, we only count relatives that grow wild in your zone. "),
          "So native honeysuckle is credited with 57 moth and butterfly species, not the 111 you'd get by including introduced garden honeysuckles. Each plant's page says so where the two figures differ.",
        ]),
        el("li", {}, [
          el("strong", {}, "European counts are European, not French. "),
          "The dataset records which insects use a plant somewhere in Europe. An insect counted for your garden might not actually live near you.",
        ]),
        el("li", {}, [
          el("strong", {}, "Your region is bigger than your garden. "),
          "A region here can cover a third of a country. It's the right size for choosing a plant list, and far too coarse to describe your particular slope, shade and drainage — which is why the app asks you about those directly.",
        ]),
        el("li", {}, [
          el("strong", {}, "Our plant lists are starter lists. "),
          "Twenty to forty plants chosen to be reliable, available and genuinely useful to wildlife — never every native plant of a region. A plant missing from a list is not a plant we're advising against.",
        ]),
      ]),

      el("h3", {}, "What we'd challenge first"),
      el("p", {},
        "If you wanted to find a mistake here, this is where we'd tell you to look — roughly in order of how likely we are to be wrong:"),
      el("ol", {}, [
        el("li", {}, [
          el("strong", {}, "The six 0–100 scores. "),
          "The softest numbers in the app by a distance. There's no dataset that says a shrub scores 78 for erosion control; that came from us reading sources and judging. If you know a plant well and a score looks off, you're probably right.",
        ]),
        el("li", {}, [
          el("strong", {}, "Counting by family group instead of species. "),
          "Defensible, and we'd defend it — but it is a real approximation, and it flatters the weaker members of a strong group.",
        ]),
        el("li", {}, [
          el("strong", {}, "The regions aren't equally well sourced. "),
          "Some plant lists rest on decades of regional botanical work; the newest ones are thinner. The confidence note on each plant is our honest read of that, plant by plant.",
        ]),
        el("li", {}, [
          el("strong", {}, "The US caterpillar counts sit on shakier ground than the European ones. "),
          "The European figures come from an openly licensed dataset we can point you at and recompute from scratch. The US figures come from published research whose database has no open licence — so they're harder for you to check than we'd like.",
        ]),
        el("li", {}, [
          el("strong", {}, "Site data is coarser than it looks. "),
          "Soil from a 250-metre grid square, and a hardiness zone we calculate rather than look up, both read as precise on screen. Trust your own eyes and hands over either.",
        ]),
      ]),

      el("h3", {}, "How to tell us we're wrong"),
      el("p", {}, [
        "Please do. The whole app is open source, so nothing here has to be taken on trust — you can read the data files, the counting script, and every line that turns a number into a recommendation: ",
        el("a", { href: REPO_URL, target: "_blank", rel: "noopener" }, "Indigene on GitHub"),
        ". If something looks wrong, ",
        el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, "open an issue"),
        " — a correction with a source behind it is the most useful thing anyone can send us.",
      ]),
      el("p", {}, [
        "For the full technical list of every dataset, who publishes it, and what its licence allows, see ",
        el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "our data-sources document"),
        ". The European caterpillar counts come from ",
        el("a", { href: MATRIX_DOI, target: "_blank", rel: "noopener" }, "Gaytán et al. 2026"),
        ", published open-access under CC-BY 4.0 — you can download the same data we did and check our arithmetic.",
      ]),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "← Home"),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Find plants for my spot"),
      ]),
    ]),
  );
}
