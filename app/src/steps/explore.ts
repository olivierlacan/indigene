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
      // card's call to action is "Full profile →", inlined at the end of the
      // blurb rather than on a line of its own — the lede above already
      // explains what a profile gives you. Keystone status is the small arch
      // glyph beside the name (same idiom as the region roster rows), so the
      // card stays three text lines tall.
      return el("div", { class: "card", style: "margin-bottom:0.6rem;padding:0.8rem 1rem" }, [
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
          el("div", { class: "plant-head", style: "padding:0;gap:0.7rem" }, [
            el("div", { class: "plant-photo", "aria-hidden": "true", style: "width:3.4rem;height:3.4rem" }, [silhouetteFor(p.form)]),
            el("div", {}, [
              el("h3", { class: "plant-name", style: "margin:0" }, [
                p.common,
                p.keystone
                  ? el("span", {
                      title: "Keystone plant — supports far more wildlife than most",
                      role: "img",
                      "aria-label": "Keystone plant",
                      style: "margin-left:0.35rem;color:var(--brand)",
                    }, [keystoneIcon(14)])
                  : null,
              ]),
              el("div", { class: "plant-latin" }, p.latin),
            ]),
          ]),
          el("p", { style: "margin:0.45rem 0 0" }, [
            p.givesNote,
            " ",
            el("span", { style: "font-weight:650;color:var(--brand, #175e33);white-space:nowrap" }, "Full profile →"),
          ]),
        ]),
      ]);
    }),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Start from a spot instead"),
    ])
  );
}
