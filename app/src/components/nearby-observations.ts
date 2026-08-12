// "See it growing near you" — a section on a plant's page that shows real,
// research-grade iNaturalist photos of that species observed close to the user,
// so the to-scale drawing is backed by "here's an actual mature one three miles
// from here, go look at it."
//
// **Photographs are what needs asking for.** They're the expensive half: a
// hundred sightings' worth of JSON so a dozen tiles can be laid out, ~190 KB of
// it, and it doesn't move until the person taps. How *often* the plant has been
// recorded around here is the cheap half — a number, no photo attached — and
// that half is already in hand for anyone who has set a spot, because the whole
// roster's counts arrive in one request and keep for a week
// (`lib/prominence.ts`). So the section opens with the count and waits to be
// asked for the pictures.
//
// The rest of the exchange is explicit and credited:
//   - The photographs load only when the person asks and gives a spot — by
//     sharing their location or typing a ZIP code / town (see
//     `location-prompt.ts`); the two are equally weighted, so declining precise
//     location isn't a dead end.
//   - A standing note says their *browser* is the one calling iNaturalist —
//     we don't proxy it — so it's clear whose request this is.
//   - iNaturalist is credited on the section, and every photo carries its own
//     observer + licence credit straight from the API.
import { el, clear } from "../ui";
import { entryForPlant, inatIdsForRegions } from "../lib/registry";
import { regionForSite, REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { plantSightingsNear, plantSightingsInRegion } from "../lib/nearby";
import type { SightingResult } from "../lib/nearby";
import { isBusy, DEFAULT_RADIUS_KM } from "../lib/inaturalist";
import type { Bounds } from "../lib/inaturalist";
import { rarityCached, rarityInRegion, rarityNear, type Rarity } from "../lib/rarity";
import { warmProminence } from "../lib/prominence";
import { knownRegion, knownSpot } from "../state";
import { stickyReady } from "../lib/sticky";
import { getSpot } from "../db";
import { rarityLine, regionRarityLine } from "./rarity-line";
import { observationList, freshnessLine } from "./observation-ui";
import { locationPrompt } from "./location-prompt";
import { anchoredHeading } from "./anchor-head";
import { plantSectionHref } from "../lib/routes";
import { t, tn, fmtNumber } from "../lib/i18n";
import { commonName, regionName, regionShort } from "../lib/names";
import { fmtList } from "../lib/i18n";
import type { Plant } from "../types";

/** "Where are we looking?" — near a chosen spot, or inside a named region's box. */
type Mode = "near" | "region";

/**
 * Build the section. It's self-contained: give it the plant and it wires up its
 * own location prompt, fetch/cache call, and rendering. Returns an element you
 * can append to the plant page.
 */
export function nearbyObservationsSection(plant: Plant): HTMLElement {
  const entry = entryForPlant(plant.id);
  const inatId = entry?.identifiers.inat;
  // The regions our own data says this plant is native to.
  const nativeRegionIds = entry?.regions ?? [];

  const out = el("div", { "aria-live": "polite" });
  // How often it's been recorded around the reader's spot. Sits above the
  // prompt because it's the part that doesn't need asking for.
  const prominence = el("div", { "aria-live": "polite" });
  /** Bumped per prominence lookup, so a stale answer can tell it's stale. */
  let prominenceAsk = 0;
  /** True once a spot's own circle has answered, which the region's bundled
   *  numbers must never paint over (see `showForRegion`). */
  let hasSpotReading = false;

  const prompt = locationPrompt({
    idBase: `plant-${plant.id}`,
    gpsLabel: t("nearby.useMyLocation"),
    onResolve: (lat, lon, label) => void load(lat, lon, label),
  });

  function showNote(msg: string): void {
    clear(out);
    out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, msg));
  }
  function showBusy(): void {
    clear(out);
    out.append(el("p", { class: "note", style: "margin-top:0.6rem" }, t("nearby.asking")));
  }

  async function load(lat: number, lon: number, label?: string): Promise<void> {
    // Only showcase where our own data vouches for the plant. Resolve the spot
    // to an Indigene region (the same coordinate box the app uses, refined by
    // EPA ecoregion when a site reading is available). Two honest gates:
    //   1. Outside every region we cover → we have no native list, so we don't
    //      present anything as a "local native".
    //   2. Inside a region, but our data doesn't list this plant as native there
    //      → we won't showcase it near there, even if iNaturalist has a (likely
    //      planted or escaped) sighting. That would contradict the whole point.
    const region = regionForSite(lat, lon);
    if (!region) {
      showNote(label ? t("nearby.outsidePlace", { place: label }) : t("nearby.outsideYou"));
      return;
    }
    if (!inatId) {
      showNote(t("nearby.noTaxonId", { name: commonName(plant) }));
      return;
    }
    if (!nativeRegionIds.includes(region.meta.id)) {
      showNote(nativeElsewhereNote(region));
      return;
    }

    showBusy();
    try {
      // One question, one taxon: "is *this* plant growing near here?" Everything
      // that comes back is this plant or a subspecies of it, which is what makes
      // the native-only promise hold without a filter — and the two gates above
      // already refused to look anywhere our data doesn't vouch for it.
      const result = await plantSightingsNear(inatId, lat, lon);
      renderResults(result, region, "near", label);
      // The spot the reader just picked may not be the one the line above was
      // counted around, so re-read it for this one — from cache when we've been
      // here before, which is the common case.
      void showProminence(region, lat, lon, label);
    } catch (err) {
      showNote(t(isBusy(err) ? "nearby.busy" : "nearby.unreachable"));
    }
  }

  /**
   * Print how often this plant is recorded around a spot.
   *
   * Cache first, and usually cache only: the counts for a region's whole roster
   * are fetched together, so the answer for one plant is normally already on
   * the device. When it isn't, one batched request gets it *and* every other
   * plant on the same list, and `rarityNear` falls back to a single count if
   * that batch couldn't be had. No photographs are touched on this path.
   *
   * Silent on failure, on purpose: this is a helpful aside on a page that has
   * already done its job, and "we couldn't work out how common it is" is a
   * sentence nobody needs. The photographs below report their own trouble.
   */
  async function showProminence(
    region: RegionDef,
    lat: number,
    lon: number,
    place?: string,
  ): Promise<void> {
    if (!inatId) return;
    // Which spot this line is about, as a number. The reader can pick a spot
    // while the one the app already knew is still being counted, and the slower
    // answer must not land on top of the one they asked for.
    const mine = ++prominenceAsk;
    const paint = (r: Rarity): void => {
      if (mine !== prominenceAsk) return;
      hasSpotReading = true;
      clear(prominence);
      prominence.append(rarityLine(r, place));
    };
    const cached = await rarityCached(inatId, lat, lon, DEFAULT_RADIUS_KM).catch(() => null);
    if (cached) return paint(cached);
    await warmProminence(
      inatIdsForRegions([region.meta.id]),
      lat,
      lon,
      DEFAULT_RADIUS_KM,
    ).catch(() => {});
    const fresh = await rarityNear(inatId, lat, lon, DEFAULT_RADIUS_KM).catch(() => null);
    // Offline, or iNaturalist unreachable: the region's own bundled numbers are
    // a coarser answer to a nearby question, which beats no answer — and the
    // line it prints names the region, so nobody is told it means their street.
    if (fresh) paint(fresh);
    else if (mine === prominenceAsk) showForRegion(region);
  }

  /**
   * The bundled region reading — no spot, no network, nothing sent anywhere.
   *
   * Never over a spot reading: the circle around somebody's garden is the
   * better answer to the question this section asks, and swapping a sentence
   * the reader has already read for a coarser one would be a downgrade
   * disguised as an update.
   */
  function showForRegion(region: RegionDef): void {
    if (!inatId || hasSpotReading) return;
    const r = rarityInRegion(inatId, region.meta.id);
    if (!r) return;
    clear(prominence);
    prominence.append(regionRarityLine(r, regionShort(region.meta)));
  }

  /**
   * The same line, for the spot the app already holds — no tap needed.
   *
   * Runs on the same two gates the photo lookup uses: outside every region we
   * cover, or in one our data doesn't call this plant native to, it prints
   * nothing. Silence rather than the "it's native elsewhere" note, because that
   * note answers a question somebody asked, and nobody asked this one.
   */
  async function showForKnownSpot(): Promise<void> {
    if (!inatId) return;
    // Landing straight on a plant page — a reload, a shared link — draws it
    // before the background read of what this device remembers has landed.
    // Without this wait the section would decide there was no spot and say
    // nothing, which is precisely the case this exists for.
    await stickyReady();
    const spot = knownSpot();
    if (!spot) return showForPickedRegion();
    const region = regionForSite(spot.lat, spot.lon);
    if (!region || !nativeRegionIds.includes(region.meta.id)) return;
    // A saved spot has a name the reader gave it, which is a better answer to
    // "around where?" than "your spot".
    const saved = spot.spotId ? await getSpot(spot.spotId).catch(() => undefined) : undefined;
    await showProminence(region, spot.lat, spot.lon, saved?.label);
  }

  /**
   * No coordinates, but a region picked by hand — say what we can about that.
   *
   * This is the reader who declined to give a point and chose their region from
   * a list, which the whole app treats as an equally good way to say where you
   * garden. Before, this section had nothing at all for them; the bundled
   * numbers cost nothing and are true of the region they named.
   */
  function showForPickedRegion(): void {
    const id = knownRegion();
    if (!id || !nativeRegionIds.includes(id)) return;
    const region = REGIONS.find((r) => r.meta.id === id);
    if (region) showForRegion(region);
  }

  // "Look it up in a region it's native to" — no spot needed. Query iNaturalist
  // inside that region's coverage box, scoped to its native taxa.
  async function loadRegion(region: RegionDef, btn: HTMLButtonElement): Promise<void> {
    if (!inatId) {
      showNote(t("nearby.noTaxonId", { name: commonName(plant) }));
      return;
    }
    const label = btn.textContent ?? "";
    btn.disabled = true;
    btn.textContent = t("nearby.asking");
    showBusy();
    try {
      const result = await plantSightingsInRegion(inatId, region.meta.id, toBounds(region));
      renderResults(result, region, "region");
      // What the photos don't say: whether the region has many of these or
      // hardly any. Free, and skipped when a spot has already answered better.
      showForRegion(region);
    } catch (err) {
      showNote(t(isBusy(err) ? "nearby.busy" : "nearby.unreachable"));
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function renderResults(result: SightingResult, region: RegionDef, mode: Mode, label?: string): void {
    clear(out);
    const mine = result.observations;
    const where = label ? t("nearby.nearPlace", { place: label }) : t("nearby.closeToYou");
    const name = commonName(plant);
    if (!mine.length) {
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" },
        mode === "near"
          ? t("nearby.noneNear", { name, region: regionName(region.meta), where })
          : t("nearby.noneInRegion", { name, region: regionName(region.meta) })));
      out.append(freshnessLine(result.fromCache));
      return;
    }

    // Eight sightings' worth of photos feed the gallery, which caps itself at a
    // dozen tiles — enough variety that the grid isn't four shots of one bush.
    const shown = mine.slice(0, 8);
    out.append(
      el("p", { style: "margin:0.6rem 0 0.4rem" },
        mode === "near"
          ? [el("strong", {}, t("nearby.foundNear", { n: fmtNumber(mine.length) })),
             tn("nearby.foundNearRest", mine.length, { name, region: regionName(region.meta), where })]
          : [el("strong", {}, t("nearby.found", { n: fmtNumber(mine.length) })),
             tn("nearby.foundRest", mine.length, { name, region: regionName(region.meta) })],
      ),
    );
    out.append(observationList(shown, name));
    out.append(freshnessLine(result.fromCache));
  }

  // The plant's native regions, as tappable "look it up there" buttons. Empty
  // when the plant has no iNaturalist id (nothing to match) — the spot path
  // reports that case on lookup.
  function regionButtons(): HTMLElement | null {
    if (!inatId) return null;
    const regions = nativeRegionIds
      .map((id) => REGIONS.find((r) => r.meta.id === id))
      .filter((r): r is RegionDef => Boolean(r));
    if (!regions.length) return null;
    // A chip is a place and nothing else — the question above it supplies the
    // verb, so neither the map emoji nor "Where it's native" has to be repeated
    // per button. The short form keeps the parenthetical qualifier out of it
    // ("Pacific Northwest", not "Pacific Northwest (west of the Cascades)");
    // the row itself scrolls rather than stacks (see `.obs-elsewhere-row`).
    return el("div", { class: "obs-elsewhere" }, [
      el("p", { class: "obs-elsewhere-lede" }, t("nearby.notThereNative")),
      el("div", { class: "obs-elsewhere-row" },
        regions.map((r) => {
          const btn = el("button", {
            type: "button",
            class: "btn btn-secondary btn-compact",
            onClick: () => void loadRegion(r, btn),
          }, regionShort(r.meta)) as HTMLButtonElement;
          return btn;
        }),
      ),
    ]);
  }

  // "Our data lists this as native to Florida, not the Pacific Northwest…"
  function nativeElsewhereNote(region: RegionDef): string {
    const names = nativeRegionIds
      .map((id) => REGIONS.find((r) => r.meta.id === id))
      .filter((r): r is RegionDef => Boolean(r))
      .map((r) => regionName(r.meta));
    const belongs = names.length
      ? t("nearby.nativeToList", { list: fmtList(names) })
      : t("nearby.nativeToOther");
    return t("nearby.nativeElsewhere", {
      name: commonName(plant),
      belongs,
      region: regionName(region.meta),
    });
  }

  // The one thing this section does without being asked, and only because the
  // answer is usually already here (see `showForKnownSpot`).
  void showForKnownSpot();

  // No top margin of its own: the card above already carries a bottom one, and
  // in the plant page's laptop columns (where margins don't collapse) a second
  // one would open a gap twice the size of every other.
  // `sec-nearby` and the heading's `#` mark: this card is one of the plant
  // page's linkable sections like any other (see `steps/plant.ts`), so someone
  // can send "here's what it looks like where you live" straight to it.
  return el("section", { class: "card plant-section", id: "sec-nearby" }, [
    // No plant name in the heading — the page is already about this plant, and
    // interpolating one would change the heading's width per species.
    anchoredHeading(
      t("nearby.seeItGrowing"),
      plantSectionHref("nearby"),
      t("plant.sectionLink")
    ),
    el("p", { class: "obs-section-lede" }, t("nearby.seeItGrowingLede", { name: commonName(plant) })),
    prominence,
    prompt,
    regionButtons(),
    out,
  ]);
}

/** A region's coverage box → the iNaturalist bounding-box shape. */
function toBounds(region: RegionDef): Bounds {
  const b = region.meta.bounds;
  return { swLat: b.minLat, swLon: b.minLon, neLat: b.maxLat, neLon: b.maxLon };
}
