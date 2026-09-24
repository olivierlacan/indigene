// The most-wanted invasives, as pages.
//
//   #/invasives        → every region's list, one after the other.
//   #/invasives/<id>   → one plant: how to know it, where it's most wanted and
//                        who says so, what to grow instead, and real
//                        photographs from a region where it's wanted.
//
// A region page lists its five as rows that link here. The depth lives on the
// plant's page rather than in a box that folds open on the list — see
// "No folding boxes" in CLAUDE.md.
import { el, clear } from "../ui";
import { REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import {
  getInvasive,
  mostWanted,
  regionIsRated,
  sightingsAsOf,
  wantedRowsFor,
} from "../lib/invasives";
import { getOrnamentalByLatin, mappedOrnamentalIds } from "../lib/alternatives";
import { getLookalikeByLatin, mappedLookalikeIds, inatTaxonUrl } from "../lib/lookalikes";
import { invasivePhotoFor, inatTaxonIdFor } from "../lib/hero-photo";
import { fetchRegionObservations, isBusy, resolveTaxon, boundsCenter, type Bounds } from "../lib/inaturalist";
import { loadSightings, regionCacheKey } from "../lib/nearby";
import { invasiveMarks, invasiveRemoval, invasivesUntranslated } from "../lib/prose";
import { commonName, nameLines, regionName, regionShort } from "../lib/names";
import { t, fmtNumber, fmtDate } from "../lib/i18n";
import { wantedList } from "../components/most-wanted";
import { heroFigure } from "../components/hero-figure";
import { silhouetteFor } from "../components/plant-card";
import { sectionHeading, sectionTitle } from "../components/section-link";
import { citation } from "../components/citation";
import { cardStats } from "../components/card-stats";
import { observationList, freshnessLine } from "../components/observation-ui";
import { reportUntranslated } from "../components/wip-banner";
import { pressureBadge, listingLine } from "./lookalikes";
import type { Invasive } from "../types";

/** Every region's list, in the app's region order. */
export function renderInvasiveIndex(main: HTMLElement): void {
  clear(main);
  document.title = t("wanted.indexDocTitle");
  const sections = REGIONS.flatMap((region) => {
    const rows = mostWanted(region.meta.id);
    if (!rows.length) return [];
    return [el("section", { style: "margin-top:1.25rem" }, [
      sectionHeading(`#/regions/${region.meta.id}`, "📍", regionName(region.meta)),
      regionIsRated(region.meta.id)
        ? null
        : el("p", { class: "confidence", style: "margin:0 0 0.4rem" }, t("wanted.unratedShort")),
      wantedList(rows),
    ])];
  });
  main.append(
    el("h2", { class: "step-title" }, t("wanted.title")),
    el("p", { class: "step-lede" }, t("wanted.indexLede")),
    ...sections,
    el("p", { class: "confidence", style: "margin-top:1rem" },
      t("wanted.countsNote", { date: fmtDate(Date.parse(sightingsAsOf)) })),
  );
}

/** One invasive's page. */
export function renderInvasive(main: HTMLElement, param?: string): void {
  clear(main);
  const inv = param ? getInvasive(param) : undefined;
  const places = inv ? wantedRowsFor(inv.id) : [];
  if (!inv || !places.length) {
    main.append(
      el("h2", { class: "step-title" }, t("region.nothingHere")),
      el("p", {}, el("a", { href: "#/invasives" }, t("wanted.backToIndex"))),
    );
    return;
  }
  const names = nameLines(inv);
  const portrait = invasivePhotoFor(inv.id);
  document.title = t("wanted.docTitle", { name: names.title });
  if (invasivesUntranslated([inv])) reportUntranslated(t("wip.invasives"));

  main.append(
    el("p", { class: "back-trail" }, [el("a", { href: "#/invasives" }, t("wanted.backToIndex"))]),
    el("article", { class: "plant lookalike-profile" }, [
      el("div", { class: "plant-head" }, [
        portrait
          ? heroFigure(portrait, commonName(inv), inv.latin)
          : el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(inv.form)]),
        el("div", {}, [
          el("h2", { class: "plant-name", style: "margin:0" }, names.title),
          el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" }, names.sub),
        ]),
      ]),
      el("h3", { style: "margin:1rem 0 0" }, t("wanted.howToSpot")),
      el("dl", { class: "wanted-marks" }, invasiveMarks(inv).flatMap((m) => [
        el("dt", {}, m.feature),
        el("dd", {}, m.text),
      ])),
      removalSection(inv),
      ...swapLinks(inv, places.map((p) => p.regionId)),
      el("p", { class: "confidence" }, [
        el("a", {
          href: inatTaxonUrl(inv.latin, inatTaxonIdFor("invasive", inv.id)),
          target: "_blank",
          rel: "noopener",
        }, t("alternative.seeOnInat")),
      ]),
    ]),
    el("section", { style: "margin-top:1rem" }, [
      sectionTitle("🚩", t("wanted.whereWanted"), fmtNumber(places.length)),
      ...places.map(({ regionId, row }) => {
        const region = REGIONS.find((r) => r.meta.id === regionId);
        return region ? placeCard(region, row) : null;
      }).filter((n): n is HTMLElement => n !== null),
      el("p", { class: "confidence", style: "margin:0.4rem 0 0" },
        t("wanted.countsNote", { date: fmtDate(Date.parse(sightingsAsOf)) })),
    ]),
    photosSection(inv, places.map((p) => p.regionId)),
  );
}

/** Its rank, rating and sightings in one region, and who says so. */
function placeCard(region: RegionDef, row: ReturnType<typeof wantedRowsFor>[number]["row"]): HTMLElement {
  return el("div", { class: "card", style: "margin:0.6rem 0 0" }, [
    el("div", { class: "wanted-meta", style: "margin:0" }, [
      el("span", { class: "wanted-rank" }, fmtNumber(row.rank)),
      el("a", { href: `#/regions/${region.meta.id}`, style: "font-weight:700" }, regionName(region.meta)),
    ]),
    el("div", { class: "wanted-meta" }, [
      row.level ? pressureBadge(row.level, row.link.listing) : null,
      row.sightings != null
        ? cardStats([{
            icon: "📷",
            value: fmtNumber(row.sightings),
            label: t("wanted.sightings", { n: fmtNumber(row.sightings) }),
          }])
        : null,
    ]),
    // Who rated it, or — where nobody did — who calls it invasive here.
    listingLine(row.link) ??
      el("p", { class: "confidence", style: "margin:0.4rem 0 0" }, [
        t("lookalike.unassessed"), " ", t("alternatives.originSource"), ...citation(row.link.basis),
      ]),
  ]);
}

/** How to get rid of it so it stays gone: the steps in order, what to do with
 *  what you pulled, and whose method it is. */
function removalSection(inv: Invasive): HTMLElement {
  const { steps, dispose } = invasiveRemoval(inv);
  return el("div", {}, [
    el("h3", { style: "margin:1rem 0 0.3rem" }, t("wanted.howToRemove")),
    el("ol", { class: "wanted-steps" }, steps.map((step) => el("li", {}, step))),
    el("p", { class: "kv", style: "margin:0.5rem 0 0" }, [
      el("span", { class: "k" }, t("wanted.afterwards")),
      dispose,
    ]),
    el("p", { class: "confidence", style: "margin:0.4rem 0 0.6rem" },
      [t("alternatives.originSource"), ...citation(inv.removal.basis)]),
  ]);
}

/** The swap and look-alike pages, where we've written one that answers for a
 *  region it's wanted in. */
function swapLinks(inv: Invasive, regionIds: string[]): HTMLElement[] {
  const links: HTMLElement[] = [];
  const orn = getOrnamentalByLatin(inv.latin);
  if (orn && regionIds.some((r) => mappedOrnamentalIds(r).has(orn.id))) {
    links.push(el("a", { href: `#/alternatives/${orn.id}` }, t("wanted.growInstead")));
  }
  const look = getLookalikeByLatin(inv.latin);
  if (look && mappedLookalikeIds().has(look.id)) {
    links.push(el("a", { href: `#/lookalikes/${look.id}` }, t("wanted.tellApart")));
  }
  return links.length
    ? [el("p", { class: "wanted-links" }, links.flatMap((a, i) => (i ? [" · ", a] : [a])))]
    : [];
}

/** Real photographs from a region where it's wanted: one chip per region,
 *  nothing fetched until one is tapped, then straight to iNaturalist. */
function photosSection(inv: Invasive, regionIds: string[]): HTMLElement {
  const out = el("div", { "aria-live": "polite" });
  const regions = regionIds
    .map((id) => REGIONS.find((r) => r.meta.id === id))
    .filter((r): r is RegionDef => !!r);

  async function load(region: RegionDef, btn: HTMLButtonElement): Promise<void> {
    const label = btn.textContent ?? "";
    btn.disabled = true;
    btn.textContent = t("nearby.asking");
    const b = region.meta.bounds;
    const bounds: Bounds = { swLat: b.minLat, swLon: b.minLon, neLat: b.maxLat, neLon: b.maxLon };
    try {
      const result = await loadSightings(
        `invasive:${inv.id}:${regionCacheKey(region.meta.id)}`,
        boundsCenter(bounds),
        async () => {
          const id = inatTaxonIdFor("invasive", inv.id) ?? (await resolveTaxon(inv.latin, "Plantae"));
          return id == null ? [] : fetchRegionObservations({ bounds, taxonIds: [String(id)], perPage: 30 });
        },
        Date.now(),
      );
      clear(out);
      out.append(
        result.observations.length
          ? observationList(result.observations.slice(0, 8), commonName(inv))
          : el("p", { class: "note" }, t("wanted.noPhotos")),
        freshnessLine(result.fromCache),
      );
    } catch (err) {
      clear(out);
      out.append(el("p", { class: "note warn" }, t(isBusy(err) ? "nearby.busy" : "nearby.unreachable")));
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  return el("section", { class: "card", style: "margin-top:1rem" }, [
    el("h3", { style: "margin-top:0" }, t("wanted.photosTitle")),
    el("p", { class: "obs-section-lede" }, t("wanted.photosLede")),
    el("div", { class: "obs-elsewhere-row" }, regions.map((r) => {
      const btn = el("button", {
        type: "button",
        class: "btn btn-secondary btn-compact",
        onClick: () => void load(r, btn),
      }, regionShort(r.meta)) as HTMLButtonElement;
      return btn;
    })),
    out,
  ]);
}
