// The plant-first entrance: one showcase native per covered region. Where the
// main flow says "stand in a spot, get plants", this page says "here's a plant
// worth knowing — now find out if your spot deserves it". Each card links to
// the plant's own shareable page.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS, loadPlants } from "../lib/plants";
import { featuredPlant } from "../lib/explore";
import { silhouetteFor } from "../components/plant-card";

export function renderExplore(main: HTMLElement): void {
  clear(main);

  main.append(
    el("h2", { class: "step-title" }, "Meet the natives"),
    el("p", { class: "step-lede" }, [
      "One standout plant from each region Indigene covers. Open one to see what it does for wildlife, how big it honestly gets, and whether the spot you have in mind would suit it.",
    ]),
    ...REGIONS.map((region) => {
      const p = featuredPlant(region);
      const count = loadPlants(region).length;
      return el("div", { class: "card", style: "margin-bottom:0.8rem" }, [
        el("p", { class: "region-tag", style: "margin:0 0 0.4rem;font-size:0.85rem;color:var(--ink-soft)" }, `📍 ${region.meta.name}`),
        el("a", {
          class: "explore-card",
          href: `#/plants/${p.id}`,
          style: "display:block;text-decoration:none;color:inherit",
        }, [
          el("div", { class: "plant-head" }, [
            el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
            el("div", {}, [
              el("h3", { class: "plant-name", style: "margin:0" }, p.common),
              el("div", { class: "plant-latin" }, p.latin),
              p.keystone
                ? el("span", { class: "badge keystone" }, "★ Keystone plant")
                : null,
            ]),
          ]),
          el("p", { style: "margin:0.5rem 0 0.3rem" }, p.givesNote),
          el("p", { style: "margin:0;font-weight:650;color:var(--brand, #175e33)" }, "See the full profile & check your spot →"),
        ]),
        el("a", {
          href: `#/regions/${region.meta.id}`,
          style: "display:block;margin-top:0.5rem;font-weight:650",
        }, `Browse all ${count} natives of this region →`),
      ]);
    }),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Start from a spot instead"),
    ])
  );
}
