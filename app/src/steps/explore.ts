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
import { t, tn, fmtNumber } from "../lib/i18n";
import { nameLines, regionName, regionReference } from "../lib/names";

export function renderExplore(main: HTMLElement): void {
  clear(main);
  document.title = t("explore.docTitle");

  const totalPlants = REGIONS.reduce((n, r) => n + loadPlants(r).length, 0);

  main.append(
    el("h2", { class: "step-title" }, t("explore.title")),
    el("p", { class: "step-lede" },
      t("explore.lede", { plants: fmtNumber(totalPlants), regions: fmtNumber(REGIONS.length) })),
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
        el("span", { style: "font-weight:700" }, t("explore.byWildlife")),
        el("span", { style: "color:var(--ink-soft)" }, t("explore.byWildlifeSub")),
      ]),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("browse.startFromSpot")),
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
  const name = regionName(region.meta);
  const count = plants.length;
  const keystones = plants.filter((k) => k.keystone).length;
  const creatures = wildlifeCountForRegion(region.meta.id);
  const star = nameLines(p);

  return el("article", { class: "region-card" }, [
    el("h3", { class: "region-card-name" }, [
      el("span", { "aria-hidden": "true" }, "📍 "),
      el("a", { href: `#/regions/${region.meta.id}` }, name),
    ]),
    // Just the place. The hardiness chip that used to sit here was a
    // gardening-catalogue term of art on a page whose whole job is "pick where
    // you are" — eight badges down the grid, none of them the thing being
    // chosen. It still rides along on the region page, where a reader who's
    // already picked their place is asking what grows there.
    el("p", { class: "region-card-ref" }, regionReference(region.meta)),
    el("a", { class: "region-card-star", href: `#/plants/${p.id}` }, [
      el("span", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
      el("span", { class: "region-card-star-text" }, [
        el("span", { class: "region-card-kicker" }, t("explore.starring")),
        el("span", { class: "region-card-plant" }, [
          star.title,
          p.keystone
            ? el("span", {
                title: t("explore.keystoneTitle"),
                role: "img",
                "aria-label": t("explore.keystoneLabel"),
                style: "margin-left:0.3rem;color:var(--brand)",
              }, [keystoneIcon(13)])
            : null,
        ]),
        el("span", { class: "plant-latin" }, star.sub),
        el("span", { class: "region-card-host" }, [
          el("span", { "aria-hidden": "true" }, "🐛 "),
          t("explore.caterpillarSpecies", { n: fmtNumber(p.hostLepCount) }),
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
        value: fmtNumber(count),
        label: t("explore.statPlants", { n: fmtNumber(count), region: name }),
      },
      keystones
        ? {
            icon: () => el("span", { class: "card-stat-arch" }, [keystoneIcon(13)]),
            value: fmtNumber(keystones),
            label: tn("explore.statKeystone", keystones, { n: fmtNumber(keystones) }),
          }
        : null,
      creatures
        ? {
            icon: "🦋",
            value: fmtNumber(creatures),
            label: t("explore.statWildlife", { n: fmtNumber(creatures) }),
          }
        : null,
    ]),
  ]);
}
