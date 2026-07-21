// The plant-first entrance: one showcase native per covered region. Where the
// main flow says "stand in a spot, get plants", this page says "here's a plant
// worth knowing — now find out if your spot deserves it". Each card links to
// the plant's own shareable page.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS, loadPlants } from "../lib/plants";
import { featuredPlant } from "../lib/explore";
import { silhouetteFor } from "../components/plant-card";
import { keystoneIcon } from "../components/keystone-icon";

export function renderExplore(main: HTMLElement): void {
  clear(main);

  main.append(
    el("h2", { class: "step-title" }, "Meet the natives"),
    el("p", { class: "step-lede" }, [
      "One standout plant from each region Indigene covers. Open one to see what it does for wildlife, how big it honestly gets, and whether the spot you have in mind would suit it.",
    ]),
    el("a", {
      href: "#/wildlife",
      class: "card",
      style: "display:flex;gap:0.6rem;align-items:center;text-decoration:none;color:inherit;margin-bottom:0.9rem",
    }, [
      el("span", { "aria-hidden": "true", style: "font-size:1.5rem;line-height:1" }, "🦋"),
      el("span", {}, [
        el("span", { style: "font-weight:700" }, "Or browse by wildlife → "),
        el("span", { style: "color:var(--ink-soft)" }, "start from the monarch, hummingbird, or gopher tortoise you want, and find the plants that support it."),
      ]),
    ]),
    ...REGIONS.map((region) => {
      const p = featuredPlant(region);
      const count = loadPlants(region).length;
      // One link per destination, each kept short: the region tag doubles as
      // the "browse the whole roster" link (its text is unique per card, with
      // the roster size shown as 🌿 + count rather than words), and the plant
      // card's call to action is just "Full profile" — the lede above already
      // explains what a profile gives you.
      return el("div", { class: "card", style: "margin-bottom:0.8rem" }, [
        el("p", { class: "region-tag", style: "margin:0 0 0.4rem;font-size:0.85rem;color:var(--ink-soft)" }, [
          "📍 ",
          el("a", {
            href: `#/regions/${region.meta.id}`,
            style: "color:inherit;font-weight:650",
            "aria-label": `${region.meta.name} — all ${count} natives`,
          }, region.meta.name),
          ` · 🌿 ${count}`,
        ]),
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
                ? el("span", { class: "badge keystone" }, [keystoneIcon(), " Keystone plant"])
                : null,
            ]),
          ]),
          el("p", { style: "margin:0.5rem 0 0.3rem" }, p.givesNote),
          el("p", { style: "margin:0;font-weight:650;color:var(--brand, #175e33)" }, "Full profile"),
        ]),
      ]);
    }),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Start from a spot instead"),
    ])
  );
}
