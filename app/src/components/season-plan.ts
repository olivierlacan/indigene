// A spot's season plan: what to propagate from it now, and what to add next.
//
// Three places show it, one depth each:
//
//   - **A card on the spot's page** — the top three things to grow more of
//     this season, and a link to the rest. The card shows the opening of the
//     plan, never a second copy of it.
//   - **The plan itself**, `#/saved/<id>/season`: every plant in its window
//     now, what's coming next season, and natives to add for the animals
//     photographed near the spot in these months (`lib/season-sightings.ts`).
//   - **A card on the Saved list**, across every spot: the three most useful
//     things to do this season, wherever they are.
//
// The rules — old enough, in its window, most use to wildlife first — live in
// `lib/grow-now.ts`. Each row links to the plant and to the technique page,
// where the how-to is; nothing here repeats it.
import { el, clear } from "../ui";
import type { Plant, Planting, PropagationMethod, SavedSpot } from "../types";
import type { RegionDef } from "../lib/plants";
import { compareTasks, growPlan, type GrowPlan, type GrowTask, type GrowWhy } from "../lib/grow-now";
import { currentSeason, seasonOfMonth, techniqueFor, techniqueHref, type Season } from "../lib/planting";
import { hemisphereOf } from "../lib/hemisphere";
import { plantThumb } from "./plant-thumb";
import { commonName } from "../lib/names";
import { getWildlife } from "../lib/wildlife";
import { t, tn, fmtNumber } from "../lib/i18n";
import { distance } from "../lib/units";
import { isBusy } from "../lib/inaturalist";
import { SPOT_RADIUS_KM } from "../lib/spot-sightings";
import {
  cachedSeasonSightings,
  plantsToAdd,
  regionAnimals,
  seasonMonths,
  seasonSightings,
  type SeasonSightings,
} from "../lib/season-sightings";
import { freshnessLine } from "./observation-ui";

/** Rows on a card before it hands over to the plan's own page. */
const CARD_ROWS = 3;
/** Natives suggested on the plan: enough to choose from, few enough to scan. */
const ADD_ROWS = 6;

type PlantOf = (id: string) => Plant | undefined;

export const seasonHref = (spotId: string): string => `#/saved/${encodeURIComponent(spotId)}/season`;

function spotSeason(spot: Pick<SavedSpot, "lat">, now = new Date()): Season {
  return currentSeason(hemisphereOf(spot.lat), now);
}

/** The plan for one spot, read off its log. */
export function planFor(spot: SavedSpot, plantings: Planting[], plantOf: PlantOf, region: RegionDef | null): GrowPlan {
  return growPlan(plantings, plantOf, region?.meta.id ?? null, hemisphereOf(spot.lat));
}

function actionKey(m: PropagationMethod, plant: Plant): Parameters<typeof t>[0] {
  if (m.startsWith("seed-")) return plant.form === "tree" ? "grow.do.seedTree" : "grow.do.seed";
  return `grow.do.${m as Exclude<PropagationMethod, `seed-${string}`>}` as const;
}

function whyLabel(why: GrowWhy): string {
  if (why.kind === "sole") {
    const animal = getWildlife(why.wildlifeId);
    return t("grow.why.sole", { name: animal ? commonName(animal) : why.wildlifeId });
  }
  return t(`grow.why.${why.kind}` as const);
}

/** One plant, what to do with it, and why it's worth it. */
function growRow(task: GrowTask, plant: Plant, opts: { regionId?: string; first?: boolean; spot?: SavedSpot }): HTMLElement {
  return el("li", { class: "log-item" }, [
    el("div", { class: "log-head" }, [
      plantThumb(plant.id, plant.form, { regionId: opts.regionId }),
      el("div", { class: "log-text" }, [
        opts.first ? el("span", { class: "badge keystone grow-first" }, t("grow.first")) : null,
        el("a", { class: "log-name", href: `#/plants/${encodeURIComponent(plant.id)}` }, commonName(plant)),
        el("div", { class: "grow-do" }, [
          el("a", { href: techniqueHref(techniqueFor(task.method)) }, t(actionKey(task.method, plant))),
          " · ",
          el("span", { class: task.window === "month" ? "grow-ripe" : "" }, t(`grow.window.${task.window}` as const)),
        ]),
        el("span", { class: "badge neutral" }, whyLabel(task.why)),
        opts.spot
          ? el("div", { class: "coords" }, el("a", { href: seasonHref(opts.spot.id) }, t("grow.atSpot", { spot: opts.spot.label })))
          : null,
      ]),
    ]),
  ]);
}

function growList(tasks: GrowTask[], plantOf: PlantOf, regionId?: string, highlight = true): HTMLElement {
  return el("ul", { class: "log-list" }, tasks.flatMap((task, i) => {
    const plant = plantOf(task.plantId);
    return plant ? [growRow(task, plant, { regionId, first: highlight && i === 0 })] : [];
  }));
}

/** The young and undated plants, a line each — the honest remainder. */
function leftOut(plan: GrowPlan): HTMLElement[] {
  const out: HTMLElement[] = [];
  if (plan.young.length) {
    out.push(el("p", { class: "hint" }, tn("grow.young", plan.young.length, { count: fmtNumber(plan.young.length) })));
  }
  if (plan.undated.length) {
    out.push(el("p", { class: "hint" }, tn("grow.undated", plan.undated.length, { count: fmtNumber(plan.undated.length) })));
  }
  return out;
}

/**
 * The card on a spot's page: the top of the plan and the way to the rest.
 * Null for an empty log — the log is an offer, not a chore.
 */
export function seasonCard(spot: SavedSpot, plan: GrowPlan, plantOf: PlantOf, plantings: Planting[], regionId?: string): HTMLElement | null {
  if (!plantings.length) return null;
  const season = spotSeason(spot);
  return el("section", { class: "card" }, [
    el("h3", { style: "margin:0 0 0.3rem" }, t(`grow.title.${season}` as const)),
    plan.now.length
      ? el("p", { class: "note", style: "margin:0 0 0.4rem;padding:0" }, t("grow.lede"))
      : el("p", { class: "note", style: "margin:0;padding:0" }, t("grow.none")),
    plan.now.length ? growList(plan.now.slice(0, CARD_ROWS), plantOf, regionId) : null,
    el("p", { class: "more-link", style: "margin:0.6rem 0 0" }, el("a", { href: seasonHref(spot.id) }, t("grow.more"))),
  ]);
}

/** `#/saved/<id>/season` — the whole plan. */
export function renderSeasonPlan(
  main: HTMLElement,
  spot: SavedSpot,
  plantings: Planting[],
  plantOf: PlantOf,
  region: RegionDef | null,
  roster: Plant[]
): void {
  const hemisphere = hemisphereOf(spot.lat);
  const season = spotSeason(spot);
  const nextSeason = seasonOfMonth((new Date().getMonth() + 3) % 12, hemisphere);
  const plan = planFor(spot, plantings, plantOf, region);
  const regionId = region?.meta.id;
  document.title = t("grow.docTitle", { label: spot.label });

  main.append(
    el("h2", { class: "step-title" }, t(`grow.page.${season}` as const)),
    el("p", { class: "step-lede" }, el("a", { href: `#/saved/${encodeURIComponent(spot.id)}` }, spot.label)),
    el("section", { class: "card" }, [
      el("h3", { style: "margin:0 0 0.3rem" }, t(`grow.title.${season}` as const)),
      plan.now.length
        ? el("p", { class: "note", style: "margin:0 0 0.4rem;padding:0" }, t("grow.lede"))
        : el("p", { class: "note", style: "margin:0;padding:0" }, t("grow.none")),
      plan.now.length ? growList(plan.now, plantOf, regionId) : null,
      ...leftOut(plan),
      el("p", { class: "hint" }, t("grow.agesNote")),
    ]),
    plan.next.length
      ? el("section", { class: "card" }, [
          el("h3", { style: "margin:0 0 0.5rem" }, t(`grow.next.${nextSeason}` as const)),
          growList(plan.next, plantOf, regionId, false),
        ])
      : "",
    addCard(spot, plantings, region, roster, season),
    el("p", { class: "more-link" }, el("a", { href: "#/planting" }, t("planting.title"))),
  );
}

/**
 * Natives to add for the animals photographed near the spot in this season's
 * months. An answer already on the device shows straight away; otherwise
 * nothing goes to iNaturalist until the person taps the button.
 */
function addCard(spot: SavedSpot, plantings: Planting[], region: RegionDef | null, roster: Plant[], season: Season): HTMLElement {
  const card = el("section", { class: "card" }, [el("h3", { style: "margin:0 0 0.3rem" }, t("grow.addTitle"))]);
  if (!region) {
    card.append(el("p", { class: "note", style: "margin:0;padding:0" }, t("grow.addNoRegion")));
    return card;
  }
  const regionId = region.meta.id;
  const within = distance(SPOT_RADIUS_KM);
  const months = seasonMonths(season, hemisphereOf(spot.lat));
  const planted = new Set(plantings.map((p) => p.plantId));
  const out = el("div", { "aria-live": "polite" });
  const intro = el("div", {}, [
    el("button", {
      type: "button",
      class: "btn btn-primary btn-block",
      onClick: () => void load(),
    }, t("spot.spottedAsk")),
    el("p", { class: "hint", style: "margin:0.5rem 0 0" }, t("spot.spottedPrivacy")),
  ]);

  async function load(): Promise<void> {
    const started = Date.now();
    intro.hidden = true;
    clear(out);
    out.append(el("p", { class: "note" }, t("nearby.asking")));
    let answer: SeasonSightings;
    try {
      answer = await seasonSightings(spot, regionAnimals(regionId), months);
    } catch (err) {
      clear(out);
      out.append(el("p", { class: "note warn" }, t(isBusy(err) ? "nearby.busy" : "nearby.unreachable")));
      intro.hidden = false;
      return;
    }
    show(answer, answer.capturedAt < started);
  }

  function show({ counts }: SeasonSightings, fromDevice: boolean): void {
    intro.hidden = true;
    clear(out);
    const picks = plantsToAdd(roster, regionId, planted, counts, spot.sun?.hours ?? null).slice(0, ADD_ROWS);
    if (!picks.length) {
      out.append(el("p", { class: "note" }, t("grow.addNone", { distance: within })));
    } else {
      out.append(
        el("ul", { class: "log-list" }, picks.map((pick) => {
          const names = pick.animals
            .slice(0, 2)
            .map((id) => getWildlife(id))
            .filter((w) => w != null)
            .map((w) => commonName(w!));
          const rest = pick.animals.length - names.length;
          return el("li", { class: "log-item" }, [
            el("div", { class: "log-head" }, [
              plantThumb(pick.plant.id, pick.plant.form, { regionId }),
              el("div", { class: "log-text" }, [
                el("a", { class: "log-name", href: `#/plants/${encodeURIComponent(pick.plant.id)}` }, commonName(pick.plant)),
                el("div", { class: "grow-do" }, [
                  pick.sole ? "⭐ " : "",
                  t("grow.addFor", { names: names.join(", ") + (rest > 0 ? ` +${fmtNumber(rest)}` : "") }),
                ]),
              ]),
            ]),
          ]);
        })),
        el("p", { class: "hint" }, t("grow.addHonest")),
      );
    }
    out.append(freshnessLine(fromDevice));
  }

  card.append(el("p", { class: "note", style: "margin:0 0 0.5rem;padding:0" }, t("grow.addLede", { distance: within })), intro, out);
  // Already looked this month: show it, read from the device alone.
  void cachedSeasonSightings(spot, regionAnimals(regionId), months).then((hit) => {
    if (hit) show(hit, true);
  });
  return card;
}

/**
 * The card on the Saved list: the most useful things to do this season across
 * every spot. Filled in once the plants are read, so the list draws first.
 */
export function acrossSpotsCard(
  entries: { spot: SavedSpot; plan: GrowPlan; regionId?: string; plantOf: PlantOf }[]
): HTMLElement | null {
  const tasks = entries
    .flatMap(({ spot, plan, regionId, plantOf }) => plan.now.map((task) => ({ task, spot, regionId, plantOf })))
    .sort((a, b) => compareTasks(a.task, b.task));
  if (!tasks.length) return null;
  // The reader's season: every saved spot is usually on one side of the equator.
  const season = spotSeason(entries[0].spot);
  const shown = tasks.slice(0, CARD_ROWS);
  return el("section", { class: "card" }, [
    el("h3", { style: "margin:0 0 0.3rem" }, t(`grow.title.${season}` as const)),
    el("p", { class: "note", style: "margin:0 0 0.4rem;padding:0" }, t("grow.allLede")),
    el("ul", { class: "log-list" }, shown.flatMap(({ task, spot, regionId, plantOf }, i) => {
      const plant = plantOf(task.plantId);
      return plant ? [growRow(task, plant, { regionId, first: i === 0, spot })] : [];
    })),
  ]);
}
