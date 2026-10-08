// A saved spot's wildlife: who its plants can feed, and who has been seen
// around it.
//
// Two cards on the spot's page (`steps/spot.ts`):
//
//   - **Wildlife in the neighborhood.** Every animal the logged plants are documented to feed, as a
//     grid of tiles — the animal, and the plant of yours it eats. A tile is a
//     link to the animal's page, where the depth lives. A big garden's grid
//     stops at nine and the last tile opens the whole list on a page of its own
//     (`#/saved/<id>/wildlife`) rather than folding the rest away. (It was "on
//     the menu" for a day, which read as if we meant to eat them.)
//   - **Spotted around here.** Real iNaturalist sightings of those same animals
//     near the spot (`lib/spot-sightings.ts`): a "seen nearby" badge lights up
//     on each tile that has any, and the newest photos since the first planting
//     fill a gallery. It asks first, and remembers the yes for this spot.
//   - **Your wildlife sightings here**, with a linked iNaturalist account: the
//     gardener's own photos of those animals within a kilometre, each beside
//     the plant of theirs that hosts, feeds or shelters it — the one place the
//     page lets itself say a plant *might* be why something came. Featured
//     first, because it's theirs.
//
// The sightings card never says the plants brought anything in. It says what it
// knows — these were seen near here — and lets the reader enjoy it.
import { el, clear } from "../ui";
import type { SavedSpot, Planting, PlantedDate } from "../types";
import type { TieSummary } from "../lib/wildlife";
import type { SpotValue } from "../lib/spot-value";
import { commonName } from "../lib/names";
import { supportLabel } from "../lib/plain";
import { supportIcon } from "./support-icon";
import { wildlifeThumb, wildlifeSilhouette } from "./wildlife-thumb";
import { glyphKeyFor } from "./wildlife-glyphs";
import { photoTile, freshnessLine } from "./observation-ui";
import { openObservationLightbox } from "./lightbox";
import { plantedLabel, plantedRange } from "../lib/garden";
import { distance } from "../lib/units";
import { t, tn, fmtNumber, monthName } from "../lib/i18n";
import { isBusy, whereWhen } from "../lib/inaturalist";
import { plantsHelping, type PlantHelp } from "../lib/spot-value";
import { linkedLogin } from "../lib/inat-account";
import {
  allowLookup,
  lookupAllowed,
  spotSightings,
  ownSpotSightings,
  ownLookupAllowed,
  allowOwnLookup,
  taxonFor,
  SPOT_RADIUS_KM,
  OWN_RADIUS_KM,
  type SpotSighting,
  type SpotSightings,
} from "../lib/spot-sightings";

/** Tiles before the grid hands over to the full list: three rows of three. */
const MENU_TILES = 9;

/** The newest sightings shown; the lightbox pages through all of them. */
const GALLERY = 9;

const UPLOAD = "https://www.inaturalist.org/observations/upload";

type PlantName = (plantId: string) => string | undefined;

/** One animal's tile, with an empty slot the sightings fill in later. */
function menuTile(tie: TieSummary, plantName: PlantName, regionId?: string): { tile: HTMLElement; badge: HTMLElement } {
  const name = commonName(tie.wildlife);
  const plant = tie.plantIds.map(plantName).find(Boolean);
  const how = supportLabel(tie.support);
  const badge = el("span", { class: "menu-seen", hidden: true });
  const tile = el("a", {
    class: "menu-tile",
    href: `#/wildlife/${encodeURIComponent(tie.wildlife.id)}`,
    title: tie.sole ? t("plant.soleTie", { name }) : `${how.term} — ${how.plain}`,
  }, [
    el("span", { class: "menu-face" }, [
      wildlifeThumb(tie.wildlife.id, glyphKeyFor(tie.wildlife.kind, tie.wildlife.inat?.iconic), { px: 64, regionId }),
      tie.sole ? el("span", { class: "menu-star", "aria-hidden": "true" }, "⭐") : null,
      badge,
    ]),
    el("span", { class: "menu-name" }, name),
    plant
      ? el("span", { class: "menu-plant" }, [
          el("span", { "aria-hidden": "true", class: "menu-how" }, [supportIcon(tie.support, 12)]),
          plant,
        ])
      : null,
  ]);
  return { tile, badge };
}

export interface Menu {
  card: HTMLElement;
  /** Light up the tiles of animals seen nearby. */
  showSeen(counts: Record<string, number>): void;
}

/**
 * The grid. `all` draws every animal (the full-list page); otherwise it stops at
 * `MENU_TILES`, the last tile linking to that page.
 */
export function menuGrid(
  spot: SavedSpot,
  value: SpotValue,
  plantName: PlantName,
  regionId: string | undefined,
  all = false
): { grid: HTMLElement; showSeen: Menu["showSeen"] } {
  const ties = value.wildlife;
  const overflow = !all && ties.length > MENU_TILES;
  const shown = overflow ? ties.slice(0, MENU_TILES - 1) : ties;
  const badges = new Map<string, HTMLElement>();
  const tiles = shown.map((tie) => {
    const { tile, badge } = menuTile(tie, plantName, regionId);
    badges.set(tie.wildlife.id, badge);
    return tile;
  });
  if (overflow) {
    const rest = ties.length - shown.length;
    tiles.push(el("a", {
      class: "menu-tile menu-more",
      href: `#/saved/${encodeURIComponent(spot.id)}/wildlife`,
    }, [
      el("span", { class: "menu-face menu-more-face", "aria-hidden": "true" }, `+${fmtNumber(rest)}`),
      el("span", { class: "menu-name" }, t("spot.menuMore")),
    ]));
  }
  return {
    grid: el("div", { class: "menu-grid" }, tiles),
    showSeen(counts) {
      for (const [id, badge] of badges) {
        const n = counts[id] ?? 0;
        badge.hidden = n === 0;
        if (!n) continue;
        const label = tn("spot.seenBadge", n, { n: fmtNumber(n), distance: distance(SPOT_RADIUS_KM) });
        badge.textContent = `👀 ${fmtNumber(n)}`;
        badge.title = label;
        badge.setAttribute("aria-label", label);
        badge.setAttribute("role", "img");
      }
    },
  };
}

/** "Wildlife in the neighborhood" — the card on a spot's page. */
export function menuCard(
  spot: SavedSpot,
  value: SpotValue,
  plantName: PlantName,
  regionId?: string
): Menu {
  const { grid, showSeen } = menuGrid(spot, value, plantName, regionId);
  const card = el("section", { class: "card menu-card" }, [
    el("h3", { style: "margin:0 0 0.3rem" }, t("spot.neighborsTitle")),
    el("p", { class: "note" }, t("spot.menuNote")),
    grid,
  ]);
  return { card, showSeen };
}

/** The first day anything in this spot went in, as iNaturalist's "YYYY-MM-DD" —
 *  or undefined when no planting carries a date. */
export function firstPlanted(plantings: Planting[], now: number = Date.now()): { since: string; label: string } | undefined {
  let first: { start: number; date: PlantedDate } | undefined;
  for (const p of plantings) {
    if (!p.planted) continue;
    const start = plantedRange(p.planted).start;
    if (!first || start < first.start) first = { start, date: p.planted };
  }
  if (!first || first.start > now) return undefined;
  const d = new Date(first.start);
  const pad = (n: number): string => String(n).padStart(2, "0");
  // Said to the precision it was logged with: "2024", not "January 1, 2024".
  return { since: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, label: plantedLabel(first.date) };
}

/** About a year ago, the window when nothing logged carries a date — the first
 *  of the month a year back, so the answer's cache key holds for a month
 *  rather than changing every day. */
function lastYear(now: number = Date.now()): string {
  const d = new Date(now);
  return `${d.getFullYear() - 1}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

/** What the lookup asks about, worked out the same way wherever it's asked, so
 *  the full-list page reads the spot page's cached answer instead of asking again. */
export function lookupArgs(plantings: Planting[], value: Pick<SpotValue, "wildlife">): {
  ids: string[];
  since: string;
  first: { since: string; label: string } | undefined;
} {
  const ids = value.wildlife.map((tie) => tie.wildlife.id).filter((id) => taxonFor(id) != null);
  const first = firstPlanted(plantings);
  return { ids, since: first?.since ?? lastYear(), first };
}

/** Sightings as tappable photos, each captioned with the animal and the month. */
function sightingGallery(sightings: SpotSighting[], value: SpotValue): HTMLElement {
  const animals = new Map(value.wildlife.map((tie) => [tie.wildlife.id, tie.wildlife]));
  // The lightbox pages through the photos of the sightings it's handed; one
  // photo each keeps the paging in step with the tiles.
  const list = sightings.map((s) => ({ ...s, photos: s.photos.slice(0, 1) }));
  const shown = list.slice(0, GALLERY);
  return el("div", { class: "obs-gallery" }, shown.map((s, i) => {
    const animal = animals.get(s.wildlifeId);
    const name = animal ? commonName(animal) : s.taxonName ?? "";
    const when = s.observedOn ? seenMonth(s.observedOn) : "";
    const btn = el("button", {
      type: "button",
      class: "log-obs-pick",
      "aria-label": t("obs.enlarge", { i: fmtNumber(i + 1), name, observer: s.observer }),
      title: t("obs.tapToEnlarge", { attribution: s.photos[0].attribution }),
      onClick: () => openObservationLightbox(list, { observation: i, photo: 0 }, name, btn),
    }, [
      el("span", { class: "obs-tile obs-tile-drawn" }, [
        wildlifeSilhouette(animal ? glyphKeyFor(animal.kind, animal.inat?.iconic) : "butterfly", 34),
        photoTile(s.photos[0].thumbUrl, t("obs.photoAlt", { name, observer: s.observer })),
      ]),
      el("span", { class: "log-obs-pick-name", "aria-hidden": "true" }, name),
      when ? el("span", { class: "log-obs-pick-date", "aria-hidden": "true" }, when) : null,
    ]) as HTMLButtonElement;
    return btn;
  }));
}

function seenMonth(iso: string): string {
  const [y, m] = iso.split("-");
  const mm = Number(m);
  return mm >= 1 && mm <= 12 ? `${monthName(mm, "short")} ${y}` : y;
}

/**
 * "Spotted around here" — asks iNaturalist about the menu's animals near this
 * spot, once the reader says yes. `onCounts` lights up the menu's tiles.
 */
export function sightingsCard(
  spot: SavedSpot,
  plantings: Planting[],
  value: SpotValue,
  onCounts: (counts: Record<string, number>) => void
): HTMLElement | null {
  const { ids, since, first } = lookupArgs(plantings, value);
  if (!ids.length) return null;
  const within = distance(SPOT_RADIUS_KM);

  const out = el("div", { "aria-live": "polite" });
  const ask = el("button", {
    type: "button",
    class: "btn btn-primary btn-block",
    onClick: () => {
      void allowLookup(spot.id);
      void load();
    },
  }, t("spot.spottedAsk"));
  const intro = el("div", {}, [
    el("p", { class: "note" }, t("spot.spottedLede", { distance: within })),
    ask,
    el("p", { class: "hint", style: "margin:0.5rem 0 0" }, t("spot.spottedPrivacy")),
  ]);

  async function load(): Promise<void> {
    const started = Date.now();
    clear(out);
    intro.hidden = true;
    out.append(el("p", { class: "note" }, t("nearby.asking")));
    let result: SpotSightings;
    try {
      result = await spotSightings(spot, ids, since);
    } catch (err) {
      clear(out);
      out.append(el("p", { class: "note warn" }, t(isBusy(err) ? "nearby.busy" : "nearby.unreachable")));
      intro.hidden = false;
      return;
    }
    clear(out);
    onCounts(result.counts);
    const when = first
      ? t("spot.sincePlanted", { date: first.label })
      : t("spot.pastYear");

    out.append(el("h4", { class: "spotted-sub" }, when));
    if (result.recent.length) {
      out.append(
        sightingGallery(result.recent, value),
        el("p", { class: "note" }, t("spot.spottedHonest")),
      );
    } else {
      out.append(el("p", { class: "note" }, t("spot.spottedNone", { distance: within })));
    }
    out.append(
      el("p", { style: "margin:0.6rem 0 0" }, [
        el("a", { href: UPLOAD, target: "_blank", rel: "noopener" }, t("spot.spottedAdd")),
      ]),
      freshnessLine(result.capturedAt < started),
    );
  }

  // Without a linked account, the one way to see your own here.
  const linkHint = linkedLogin()
    ? null
    : el("p", { class: "hint", style: "margin:0.6rem 0 0" }, [
        el("a", { href: "#/settings/inat" }, t("spot.ownLinkHint")),
      ]);

  // Said yes before: fill in straight away (from the week's cache, usually).
  void lookupAllowed(spot.id).then((ok) => {
    if (ok) void load();
  });

  return el("section", { class: "card" }, [
    el("h3", { style: "margin:0 0 0.3rem" }, t("spot.spottedTitle")),
    intro,
    out,
    linkHint,
  ]);
}

/** "Caterpillars can grow up on your butterfly weed" — how one plant helps. */
function helpLine(help: PlantHelp, plant: string): HTMLElement {
  return el("p", { class: "own-help" }, [
    el("span", { class: "menu-how", "aria-hidden": "true" }, [supportIcon(help.support, 13)]),
    help.sole ? "⭐ " : "",
    t(`spot.ownHelp.${help.support}` as const, { plant }),
  ]);
}

/**
 * "Your wildlife sightings here" — only with a linked iNaturalist account. The
 * gardener's own sightings of the animals their plants can feed, within a
 * kilometre of the spot, each with the plants that might have drawn it in.
 * Asks once (by username only — no place leaves the device) and remembers.
 */
export function ownCard(
  spot: SavedSpot,
  plantings: Planting[],
  value: SpotValue,
  plantName: PlantName,
  regionId?: string
): HTMLElement | null {
  const login = linkedLogin();
  if (!login) return null;
  const { ids, since, first } = lookupArgs(plantings, value);
  if (!ids.length) return null;
  const animals = new Map(value.wildlife.map((tie) => [tie.wildlife.id, tie.wildlife]));
  const plantIds = plantings.map((p) => p.plantId);
  const within = distance(OWN_RADIUS_KM);
  const when = first ? t("spot.sincePlanted", { date: first.label }) : t("spot.pastYear");

  const out = el("div", { "aria-live": "polite" });
  const intro = el("div", {}, [
    el("p", { class: "note" }, t("spot.ownLede", { distance: within })),
    el("button", {
      type: "button",
      class: "btn btn-primary btn-block",
      onClick: () => {
        void allowOwnLookup(spot.id);
        void load();
      },
    }, t("spot.ownAsk")),
    el("p", { class: "hint", style: "margin:0.5rem 0 0" }, t("spot.ownPrivacy")),
  ]);

  async function load(): Promise<void> {
    intro.hidden = true;
    clear(out);
    out.append(el("p", { class: "note" }, t("import.asking", { login: login! })));
    let sightings: SpotSighting[];
    try {
      ({ sightings } = await ownSpotSightings(spot, ids, since, login!));
    } catch (err) {
      clear(out);
      out.append(el("p", { class: "note warn" }, t(isBusy(err) ? "nearby.busy" : "nearby.unreachable")));
      intro.hidden = false;
      return;
    }
    clear(out);
    out.append(el("h4", { class: "spotted-sub" }, when));
    if (!sightings.length) {
      out.append(el("p", { class: "note" }, t("spot.ownNone", { distance: within })));
      return;
    }
    // One photo per sighting, so the lightbox pages in step with the rows.
    const list = sightings.map((o) => ({ ...o, photos: o.photos.slice(0, 1) }));
    out.append(
      el("ul", { class: "own-list" }, list.map((o, i) => {
        const animal = animals.get(o.wildlifeId);
        const name = animal ? commonName(animal) : o.taxonName ?? "";
        const helps = plantsHelping(o.wildlifeId, plantIds, regionId ?? null).slice(0, 2);
        const tile = el("button", {
          type: "button",
          class: "obs-tile obs-tile-drawn own-photo",
          "aria-label": t("obs.enlarge", { i: fmtNumber(i + 1), name, observer: o.observer }),
          title: t("obs.tapToEnlarge", { attribution: o.photos[0].attribution }),
          onClick: () => openObservationLightbox(list, { observation: i, photo: 0 }, name, tile),
        }, [
          wildlifeSilhouette(animal ? glyphKeyFor(animal.kind, animal.inat?.iconic) : "butterfly", 30),
          photoTile(o.photos[0].thumbUrl, t("obs.photoAlt", { name, observer: o.observer })),
        ]) as HTMLButtonElement;
        return el("li", { class: "own-item" }, [
          tile,
          el("div", { class: "own-text" }, [
            el("a", { class: "own-name", href: `#/wildlife/${encodeURIComponent(o.wildlifeId)}` }, name),
            el("div", { class: "coords" }, whereWhen(o)),
            ...helps.flatMap((h) => {
              const plant = plantName(h.plantId);
              return plant ? [helpLine(h, plant)] : [];
            }),
          ]),
        ]);
      })),
      el("p", { class: "note" }, t("spot.ownHonest")),
    );
  }

  void ownLookupAllowed(spot.id).then((ok) => {
    if (ok) void load();
  });

  return el("section", { class: "card own-card" }, [
    el("h3", { style: "margin:0 0 0.3rem" }, t("spot.ownTitle")),
    intro,
    out,
  ]);
}

/** A page of its own for a big garden's whole menu: `#/saved/<id>/wildlife`. */
export function fullMenu(
  main: HTMLElement,
  spot: SavedSpot,
  plantings: Planting[],
  value: SpotValue | null,
  plantName: PlantName,
  regionId?: string
): void {
  main.append(
    el("p", { class: "spot-edit", style: "margin:0 0 0.4rem" }, [
      el("a", { href: `#/saved/${encodeURIComponent(spot.id)}` }, `← ${spot.label}`),
    ]),
    el("h2", { class: "step-title" }, t("spot.neighborsTitle")),
  );
  if (!value?.wildlife.length) {
    main.append(el("p", { class: "step-lede" }, t("spot.menuEmpty")));
    return;
  }
  const { grid, showSeen } = menuGrid(spot, value, plantName, regionId, true);
  main.append(el("p", { class: "step-lede" }, t("spot.menuNote")), el("section", { class: "card menu-card" }, [grid]));
  // Badges too, once the reader has said yes for this spot — usually the spot
  // page's answer, from the cache.
  void lookupAllowed(spot.id).then(async (ok) => {
    if (!ok) return;
    const { ids, since } = lookupArgs(plantings, value);
    if (!ids.length) return;
    try {
      const r = await spotSightings(spot, ids, since);
      showSeen(r.counts);
    } catch {
      /* the grid stands on its own */
    }
  });
}
