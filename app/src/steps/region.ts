// A region's full roster (#/regions/<id>) and its per-category pages
// (#/regions/<id>/trees, …/shrubs, …). The explore page leads with one
// showcase plant per region; these are the "show me everything" answers
// behind it — every native in the region's seed list, each row linking to
// the plant's page. Category pages are shareable straight-to-the-point URLs
// ("the trees of the PNW") and let you jump to the same category in another
// region without going back through the roster.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS, loadPlants } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
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
/** URL slug for each form — plural, human, stable ("…/regions/pnw/trees"). */
const FORM_SLUGS: Record<PlantForm, string> = {
  tree: "trees",
  shrub: "shrubs",
  perennial: "perennials",
  grass: "grasses",
  vine: "vines",
  groundcover: "groundcovers",
  fern: "ferns",
};
const SLUG_TO_FORM = new Map<string, PlantForm>(
  FORM_ORDER.map((f) => [FORM_SLUGS[f], f])
);

export function renderRegion(main: HTMLElement, param?: string): void {
  clear(main);
  const [id, catSlug] = (param ?? "").split("/");
  const region = REGIONS.find((r) => r.meta.id === id);
  if (!region) {
    renderNotFound(main, "That link doesn't match any region Indigene covers.");
    return;
  }
  const form = catSlug ? SLUG_TO_FORM.get(catSlug) : undefined;
  if (catSlug && !form) {
    renderNotFound(main, `“${catSlug}” isn't a plant category we know — try one of the groups below.`, region);
    return;
  }

  const plants = loadPlants(region);

  if (form) {
    renderCategory(main, region, plants, form);
    return;
  }

  document.title = `Natives of ${region.meta.name} — Indigene`;

  const groups = FORM_ORDER.map((f) => {
    const inForm = sortedByCommon(plants, f);
    if (!inForm.length) return null;
    return el("section", {}, [
      el("h3", { style: "margin:1.1rem 0 0.4rem" }, [
        el("a", { href: categoryHref(region, f), style: "color:inherit" }, `${FORM_LABELS[f]} (${inForm.length})`),
      ]),
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
    categoryChips(region, plants, null),
    ...groups,
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, "← Featured natives"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Rank these for my spot"),
    ])
  );
}

// One category of one region — a straight-to-the-point shareable page, with a
// switcher to the same category in every other region that has one.
function renderCategory(
  main: HTMLElement,
  region: RegionDef,
  plants: Plant[],
  form: PlantForm
): void {
  const inForm = sortedByCommon(plants, form);
  const label = FORM_LABELS[form];
  document.title = `${label} native to ${region.meta.name} — Indigene`;

  // The same category elsewhere — only regions that actually have one.
  const elsewhere = REGIONS.filter(
    (r) => r.meta.id !== region.meta.id && loadPlants(r).some((p) => p.form === form)
  );
  const switcher = elsewhere.length
    ? el("div", { class: "card", style: "margin-top:1rem" }, [
        el("p", { style: "margin:0 0 0.4rem;font-weight:650" }, `${label} in another region:`),
        el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem" },
          elsewhere.map((r) =>
            el("a", {
              class: "btn btn-secondary",
              style: "flex:0 1 auto;min-height:2.4rem;padding:0.4rem 0.7rem;font-size:0.9rem;text-decoration:none",
              href: categoryHref(r, form),
            }, `${r.meta.name} (${loadPlants(r).filter((p) => p.form === form).length})`)
          )
        ),
      ])
    : null;

  main.append(
    el("p", { class: "region-tag", style: "margin:0 0 0.3rem;font-size:0.9rem;color:var(--ink-soft)" }, [
      "📍 ",
      el("a", { href: `#/regions/${region.meta.id}` }, region.meta.name),
    ]),
    el("h2", { class: "step-title" }, `${label} native to this region`),
    inForm.length
      ? el("p", { class: "step-lede" },
          `${inForm.length} ${inForm.length === 1 ? "plant" : "plants"}, all vetted as native — ${region.meta.reference}. Open any of them to see the full profile and check whether your spot suits it.`)
      : el("p", { class: "step-lede" },
          `Our ${region.meta.name} list has no ${label.toLowerCase()} yet — the seed lists are curated and grow carefully. Try another category, or the same category in a region below.`),
    categoryChips(region, plants, form),
    ...inForm.map(plantRow),
    ...(switcher ? [switcher] : []),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate(`regions/${region.meta.id}`) }, "← All natives of this region"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Rank these for my spot"),
    ])
  );
}

/** Chip nav across a region's categories; `current` marks the active one. */
function categoryChips(region: RegionDef, plants: Plant[], current: PlantForm | null): HTMLElement {
  const chips: HTMLElement[] = [];
  if (current) {
    chips.push(el("a", {
      class: "btn btn-secondary",
      style: chipStyle,
      href: `#/regions/${region.meta.id}`,
    }, `All (${plants.length})`));
  }
  for (const f of FORM_ORDER) {
    const count = plants.filter((p) => p.form === f).length;
    if (!count) continue;
    chips.push(el("a", {
      class: "btn btn-secondary",
      style: chipStyle,
      href: categoryHref(region, f),
      "aria-pressed": f === current ? "true" : "false",
      "aria-current": f === current ? "page" : undefined,
    }, `${FORM_LABELS[f]} (${count})`));
  }
  return el("nav", { "aria-label": "Plant categories", style: "display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.6rem 0 0.8rem" }, chips);
}

const chipStyle = "flex:0 1 auto;min-height:2.4rem;padding:0.4rem 0.7rem;font-size:0.9rem;text-decoration:none";

function categoryHref(region: RegionDef, form: PlantForm): string {
  return `#/regions/${region.meta.id}/${FORM_SLUGS[form]}`;
}

function sortedByCommon(plants: Plant[], form: PlantForm): Plant[] {
  return plants
    .filter((p) => p.form === form)
    .sort((a, b) => a.common.localeCompare(b.common));
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

function renderNotFound(main: HTMLElement, why: string, region?: RegionDef): void {
  main.append(
    el("h2", { class: "step-title" }, "Nothing at this address"),
    el("p", { class: "step-lede" }, why),
    ...(region ? [categoryChips(region, loadPlants(region), null)] : []),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("plants") }, "Browse the natives"),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
    ])
  );
}
