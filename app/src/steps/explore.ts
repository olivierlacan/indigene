// The region-first entrance. Where the main flow says "stand in a spot, get
// plants", this page says "here are the places Indigene knows — pick yours".
//
// It used to lead with a plant per region and a paragraph about it, which put
// the reader in front of five blurbs before they'd seen the one thing they
// actually have to choose: where they are. Now each card *is* a region — its
// name, what its roster adds up to, and one native starring on the front of it,
// named but not explained. The explaining is the plant page's job, and it's one
// tap away.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS, loadPlants } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { featuredPlant } from "../lib/explore";
import { wildlifeCountForRegion } from "../lib/wildlife";
import { silhouetteFor } from "../components/plant-card";
import { keystoneIcon } from "../components/keystone-icon";
import { cardStats } from "../components/card-stats";

export function renderExplore(main: HTMLElement): void {
  clear(main);

  const totalPlants = REGIONS.reduce((n, r) => n + loadPlants(r).length, 0);

  main.append(
    el("h2", { class: "step-title" }, "Meet the natives"),
    el("p", { class: "step-lede" }, [
      `${totalPlants} native plants across the ${REGIONS.length} regions Indigene covers so far. Open the one you live in to see its whole roster — or tap the plant on the front of a card to meet it.`,
    ]),
    el("div", { class: "card-grid" }, REGIONS.map(regionCard)),
    // Deliberately *after* the regions: browsing by animal is a fine way in,
    // but it's the second question. Offering it first asked the reader to
    // choose between two doors before they'd seen what was behind either.
    el("a", {
      href: "#/wildlife",
      class: "card",
      style: "display:flex;gap:0.6rem;align-items:center;text-decoration:none;color:inherit;margin:1.1rem 0 0",
    }, [
      el("span", { "aria-hidden": "true", style: "font-size:1.5rem;line-height:1" }, "🦋"),
      el("span", {}, [
        el("span", { style: "font-weight:700" }, "Or browse by wildlife → "),
        el("span", { style: "color:var(--ink-soft)" }, "start from the monarch, hummingbird, or gopher tortoise you want, and find the plants that support it."),
      ]),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Start from a spot instead"),
    ])
  );
}

/**
 * One region as a card. The **whole card** is the way into the region's roster
 * — the heading's link is stretched over it (see `.region-card-name a::after`)
 * — so there's nothing to aim at and no footer link repeating what the heading
 * already says. The starring plant sits above that overlay and keeps its own
 * link to its profile; those two are the card's only destinations.
 */
function regionCard(region: RegionDef): HTMLElement {
  const plants = loadPlants(region);
  const p = featuredPlant(region);
  const count = plants.length;
  const keystones = plants.filter((k) => k.keystone).length;
  const creatures = wildlifeCountForRegion(region.meta.id);

  return el("article", { class: "region-card" }, [
    el("h3", { class: "region-card-name" }, [
      el("span", { "aria-hidden": "true" }, "📍 "),
      el("a", { href: `#/regions/${region.meta.id}` }, region.meta.name),
    ]),
    el("p", { class: "region-card-ref" }, region.meta.reference),
    el("a", { class: "region-card-star", href: `#/plants/${p.id}` }, [
      el("span", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
      el("span", { class: "region-card-star-text" }, [
        el("span", { class: "region-card-kicker" }, "Starring"),
        el("span", { class: "region-card-plant" }, [
          p.common,
          p.keystone
            ? el("span", {
                title: "Keystone plant — supports far more wildlife than most",
                role: "img",
                "aria-label": "Keystone plant",
                style: "margin-left:0.3rem;color:var(--brand)",
              }, [keystoneIcon(13)])
            : null,
        ]),
        el("span", { class: "plant-latin" }, p.latin),
        el("span", { class: "region-card-host" }, [
          el("span", { "aria-hidden": "true" }, "🐛 "),
          `${p.hostLepCount} caterpillar species`,
        ]),
      ]),
    ]),
    // What the roster adds up to, as figures rather than adjectives — and the
    // plant count among them, which is why the card needs no "all N natives"
    // link. Nothing here is a new claim: it's the same data the region page's
    // stat tiles explain in full.
    cardStats([
      {
        icon: "🌿",
        value: String(count),
        label: `${count} native plants on Indigene's list for ${region.meta.name}`,
      },
      keystones
        ? {
            icon: () => el("span", { class: "card-stat-arch" }, [keystoneIcon(13)]),
            value: String(keystones),
            label: `${keystones} keystone plant${keystones === 1 ? "" : "s"} — the ones local food webs lean on hardest`,
          }
        : null,
      creatures
        ? {
            icon: "🦋",
            value: String(creatures),
            label: `${creatures} kinds of wildlife with a documented tie to these plants`,
          }
        : null,
    ]),
  ]);
}
