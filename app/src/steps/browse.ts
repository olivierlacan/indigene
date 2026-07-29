// The no-location entrance: the regions and featured-plants cards that used to
// live on the homepage, for people who'd rather browse than share where they
// are. The automatic flow stays one tap away at the bottom.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS } from "../lib/plants";
import { featuredPlant } from "../lib/explore";
import { zoneChip } from "../components/zone-chip";
import { ISSUES_URL } from "../lib/plain";

export function renderBrowse(main: HTMLElement): void {
  clear(main);

  main.append(
    el("h2", { class: "step-title" }, "Browse regions & native plants"),
    el("p", { class: "step-lede" }, [
      "No location needed — start from a region or a standout plant instead.",
    ]),
    el("div", { class: "card" }, [
      el("h3", {}, REGIONS.length > 1 ? "Regions covered so far" : "Right now this covers one region"),
      el("p", {}, "Plant recommendations are tuned region by region — pick the one that matches where you'll plant:"),
      el("ul", { style: "margin:0.4rem 0 0.6rem;padding-left:1.2rem" },
        REGIONS.map((r) => el("li", { style: "margin-bottom:0.3rem" }, [
          el("a", { href: `#/regions/${r.meta.id}`, style: "font-weight:650" }, r.meta.name),
          ` — ${r.meta.reference} `,
          zoneChip(r.meta),
        ]))
      ),
      el("p", { style: "margin:0" }, [
        "Outside these areas, sun and soil readings still work — just no plant list yet. Want yours next? ",
        el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, "Suggest your area on GitHub"),
        ".",
      ]),
    ]),
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
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Start from a spot instead"),
    ])
  );
}
