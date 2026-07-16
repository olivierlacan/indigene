// A region's full roster, at its own shareable URL (#/regions/<id>). The
// explore page leads with one showcase plant per region; this is the "show me
// everything" answer behind it — every native in the region's seed list,
// grouped by what kind of plant it is, each row linking to the plant's page.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS, loadPlants } from "../lib/plants";
import { silhouetteFor } from "../components/plant-card";
import type { Plant, PlantForm } from "../types";

const FORM_ORDER: PlantForm[] = ["tree", "shrub", "perennial", "grass", "vine", "groundcover", "fern"];
const FORM_LABELS: Record<PlantForm, string> = {
  tree: "Trees",
  shrub: "Shrubs",
  perennial: "Perennials & wildflowers",
  grass: "Grasses & sedges",
  vine: "Vines",
  groundcover: "Groundcovers",
  fern: "Ferns",
};

export function renderRegion(main: HTMLElement, id?: string): void {
  clear(main);
  const region = REGIONS.find((r) => r.meta.id === id);
  if (!region) {
    main.append(
      el("h2", { class: "step-title" }, "No such region"),
      el("p", { class: "step-lede" }, "That link doesn't match any region Indigene covers."),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn btn-primary", onClick: () => navigate("plants") }, "Browse the natives"),
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
      ])
    );
    return;
  }

  const plants = loadPlants(region);
  document.title = `Natives of ${region.meta.name} — Indigene`;

  const groups = FORM_ORDER.map((form) => {
    const inForm = plants
      .filter((p) => p.form === form)
      .sort((a, b) => a.common.localeCompare(b.common));
    if (!inForm.length) return null;
    return el("section", {}, [
      el("h3", { style: "margin:1.1rem 0 0.4rem" }, `${FORM_LABELS[form]} (${inForm.length})`),
      ...inForm.map(plantRow),
    ]);
  }).filter((g): g is HTMLElement => g !== null);

  main.append(
    el("h2", { class: "step-title" }, `Every native we know for ${region.meta.name}`),
    el("p", { class: "step-lede" }, [
      `${plants.length} plants, all vetted as native to this region — ${region.meta.reference}. `,
      "Open any of them to see the full profile and check whether your spot suits it.",
    ]),
    el("p", { style: "font-size:0.9rem;color:var(--ink-soft)" }, region.meta.note),
    ...groups,
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, "← Featured natives"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Rank these for my spot"),
    ])
  );
}

// A compact, scannable row: enough to recognize the plant and want to tap it,
// with the full story living on the plant's own page.
function plantRow(p: Plant): HTMLElement {
  return el("a", {
    href: `#/plants/${p.id}`,
    class: "card",
    style: "display:flex;gap:0.7rem;align-items:center;text-decoration:none;color:inherit;padding:0.6rem 0.8rem;margin-bottom:0.5rem",
  }, [
    el("div", { class: "plant-photo", "aria-hidden": "true", style: "flex:0 0 auto" }, [silhouetteFor(p.form)]),
    el("div", { style: "min-width:0" }, [
      el("div", { style: "font-weight:700" }, [
        p.common,
        p.keystone ? el("span", { title: "Keystone plant — supports far more wildlife than most" }, " ★") : null,
      ]),
      el("div", { class: "plant-latin", style: "font-size:0.85rem" }, p.latin),
      el("div", {
        style: "font-size:0.85rem;color:var(--ink-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis",
      }, p.givesNote),
    ]),
  ]);
}
