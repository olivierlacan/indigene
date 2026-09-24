// "Where this region reaches" — the panel that answers the question a plant
// list can't, with a picture rather than a paragraph.
//
// Someone landing on a roster wants to know one thing before they trust it:
// *does this include me?* The app knew the answer in three forms it never
// showed — a lat/lon box, a set of ecoregion codes, and a caveat sentence about
// the flora next door — and a reader on a phone could read the whole page
// without learning how far north the region goes. That was the complaint, and
// no amount of describing a boundary in words is as good as drawing it.
//
// So the panel *is* the map (`public/maps/<id>.svg`, drawn at build time by
// `scripts/build-region-maps.mjs` from the same EPA and EEA services the app
// queries live, with a few cities on it so a reader can find themselves), and
// the words shrink to the two things a picture can't say: which mapped
// ecoregions the shaded shape is, and where to see the authority's own atlas.
// The sentence describing the edges in landmarks is still written, per region,
// but it lives in the image's `alt` now — see `regionMap` below.
//
// The map is a plain <img>: no map library, no tile requests, no third party at
// page-view time, and the service worker keeps it like any other same-origin
// asset. Its own stylesheet carries a `prefers-color-scheme` query, which an
// <img> still honors — and since the app themes off that same query, the map
// follows the page into dark mode.
import type { RegionMeta } from "../data/region";
import type { EcoregionProvider } from "../types";
import { el } from "../ui";
import { REGION_MAP_SIZES } from "../data/region-maps";
import {
  CEC_ECOREGION_MAP_URL,
  EEA_BIOREGION_MAP_URL,
  EPA_ECOREGION_MAP_URL,
  RESOLVE_ECOREGION_MAP_URL,
} from "../lib/plain";
import { t } from "../lib/i18n";
import { regionExtent } from "../lib/names";
import { regionHemisphere } from "../lib/hemisphere";

export function regionBoundaryCard(meta: RegionMeta): HTMLElement {
  const eco = meta.ecoregion?.length ? meta.ecoregion : null;
  const link = MAP_LINKS[providerFor(meta)];
  return el("section", { class: "card region-where" }, [
    el("h3", { style: "margin:0 0 0.5rem;font-size:1.05rem" }, t("regionWhere.title")),
    regionMap(meta),
    // No caption when the shape is real. It used to name the mapped ecoregions
    // — "the Northeastern Highlands, Ridge and Valley, Western Allegheny
    // Plateau, Central Appalachians, and 11 more" — which is jargon a gardener
    // has no use for, in a sentence longer than the picture it described. The
    // same argument that removed the internal boundaries removes their names:
    // the shape is the answer, and the link below credits whose lines they are.
    //
    // The one caption worth keeping is the opposite case: a region with no
    // ecoregion codes is drawn as its coverage *box*, dashed, and a dashed
    // rectangle over a coastline needs to say it is a rectangle rather than a
    // boundary. Every shipped region traces real lines today; this is for the
    // next one that doesn't.
    ...(eco ? [] : [el("p", { class: "region-map-legend" }, t("regionWhere.shadedBox"))]),
    el("p", { style: "margin:0" }, [
      el("a", {
        href: link.href,
        target: "_blank",
        rel: "noopener",
        style: "font-weight:650",
      }, `${t(link.label)} ↗`),
    ]),
  ]);
}

/** Where each classification's own map lives, and what the link says. */
const MAP_LINKS = {
  "epa-omernik": { href: EPA_ECOREGION_MAP_URL, label: "regionWhere.linkEpa" },
  "eea-biogeo": { href: EEA_BIOREGION_MAP_URL, label: "regionWhere.linkEea" },
  "resolve-2017": { href: RESOLVE_ECOREGION_MAP_URL, label: "regionWhere.linkResolve" },
  "cec-na": { href: CEC_ECOREGION_MAP_URL, label: "regionWhere.linkCec" },
} as const satisfies Record<EcoregionProvider, { href: string; label: string }>;

/** The drawn boundary. The extent sentence is its `alt`, not a caption under
 *  it: the map now *shows* the coast, the state lines and the cities, so
 *  printing "north to the Canadian border, south to the Oregon–California line"
 *  underneath was telling a sighted reader what they were already looking at.
 *  As alt text it still does its real job — for a screen reader, for images-off,
 *  and for the day the file 404s.
 *
 *  `width`/`height` come from the generated sizes table so the browser reserves
 *  the right box before the file arrives — without them a lazy image is
 *  zero-tall and the whole roster jumps when it loads. */
function regionMap(meta: RegionMeta): HTMLElement {
  const size = REGION_MAP_SIZES[meta.id];
  return el("img", {
    class: "region-map",
    src: `${import.meta.env.BASE_URL}maps/${meta.id}.svg`,
    alt: regionExtent(meta),
    loading: "lazy",
    decoding: "async",
    width: size ? String(size.w) : undefined,
    height: size ? String(size.h) : undefined,
  });
}

/** Which authority's map to send this region's reader to. Normally the region
 *  says so itself; a region that hasn't declared its ecoregions yet (the
 *  Mid-Atlantic, box-only) is placed by where its box sits, which is the one
 *  thing a coverage box always knows: south of the equator is RESOLVE's, and
 *  north of it the Atlantic splits the EPA's from the EEA's. */
function providerFor(meta: RegionMeta): EcoregionProvider {
  // **Whose lines is the reader looking at?** A region may declare more than one
  // classification, and this names the authority that *drew* the shape above —
  // not whichever happens to be listed first. `scripts/build-region-maps.mjs`
  // chooses the same way and for the same reason: a region declaring the CEC
  // declared it because it crosses a border the others stop at. Sending a reader
  // in Vancouver to the EPA's atlas to find a shape the EPA's map does not
  // contain is the failure this avoids.
  const eco = meta.ecoregion ?? [];
  const declared = (p: EcoregionProvider) => eco.find((e) => e.provider === p)?.provider;
  const drawn = declared("cec-na") ?? declared("resolve-2017") ?? declared("eea-biogeo") ?? declared("epa-omernik");
  if (drawn) return drawn;
  if (regionHemisphere(meta) === "south") return "resolve-2017";
  return meta.bounds.maxLon < -30 ? "epa-omernik" : "eea-biogeo";
}
