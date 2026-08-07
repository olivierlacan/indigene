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
// So the panel leads with the map (`public/maps/<id>.svg`, drawn at build time
// by `scripts/build-region-maps.mjs` from the same EPA and EEA services the app
// queries live), and the words shrink to what a picture can't say: the caption
// naming the landmarks at its edges, which mapped ecoregions the shaded shape
// *is*, and a link to the authority's own atlas for anyone who wants the source.
//
// The map is a plain <img>: no map library, no tile requests, no third party at
// page-view time, and the service worker keeps it like any other same-origin
// asset. Its own stylesheet carries a `prefers-color-scheme` query, which an
// <img> still honors — and since the app themes off that same query, the map
// follows the page into dark mode. The caption does the describing, so the
// image itself is `alt=""`: a screen reader that read both would say it twice.
import type { RegionMeta } from "../data/region";
import type { EcoregionProvider } from "../types";
import { el } from "../ui";
import { EPA_L3_NAMES } from "../data/ecoregions";
import { REGION_MAP_SIZES } from "../data/region-maps";
import { EEA_BIOREGION_MAP_URL, EPA_ECOREGION_MAP_URL } from "../lib/plain";
import { fmtList, t, tn, tOptional } from "../lib/i18n";
import { regionExtent } from "../lib/names";

export function regionBoundaryCard(meta: RegionMeta): HTMLElement {
  const eco = meta.ecoregion;
  const eea = providerFor(meta) === "eea-biogeo";
  return el("section", { class: "card region-where" }, [
    el("h3", { style: "margin:0 0 0.5rem;font-size:1.05rem" }, t("regionWhere.title")),
    el("figure", { class: "region-map-figure" }, [
      regionMap(meta),
      el("figcaption", {}, regionExtent(meta)),
    ]),
    el("p", { class: "region-map-legend" },
      // Plural-aware: a region is one mapped area or five, and the sentence has
      // to agree with it in both languages.
      eco
        ? tn(eea ? "regionWhere.shadedEea" : "regionWhere.shadedEpa", eco.codes.length, {
            list: fmtList(eco.codes.map((c) => ecoregionName(eco.provider, c))),
          })
        : t("regionWhere.shadedBox")),
    el("p", { style: "margin:0" }, [
      el("a", {
        href: eea ? EEA_BIOREGION_MAP_URL : EPA_ECOREGION_MAP_URL,
        target: "_blank",
        rel: "noopener",
        style: "font-weight:650",
      }, `${t(eea ? "regionWhere.linkEea" : "regionWhere.linkEpa")} ↗`),
    ]),
  ]);
}

/** The drawn boundary. `width`/`height` come from the generated sizes table so
 *  the browser reserves the right box before the file arrives — without them a
 *  lazy image is zero-tall and the whole roster jumps when it loads. */
function regionMap(meta: RegionMeta): HTMLElement {
  const size = REGION_MAP_SIZES[meta.id];
  return el("img", {
    class: "region-map",
    src: `${import.meta.env.BASE_URL}maps/${meta.id}.svg`,
    alt: "",
    loading: "lazy",
    decoding: "async",
    width: size ? String(size.w) : undefined,
    height: size ? String(size.h) : undefined,
  });
}

/** Which authority's map to send this region's reader to. Normally the region
 *  says so itself; a region that hasn't declared its ecoregions yet (the
 *  Mid-Atlantic, box-only) is placed by longitude, which is the one thing a
 *  coverage box always knows. */
function providerFor(meta: RegionMeta): EcoregionProvider {
  if (meta.ecoregion) return meta.ecoregion.provider;
  return meta.bounds.maxLon < -30 ? "epa-omernik" : "eea-biogeo";
}

/** A code as a reader can find it on the atlas. EPA Level III names are
 *  American place names and stay in English (same rule as `ecoregionLabel`);
 *  the EEA's eleven regions have a settled name in each language. An
 *  unrecognized code shows as itself — still findable, never blank. */
function ecoregionName(provider: EcoregionProvider, code: string): string {
  if (provider === "eea-biogeo") return tOptional(`ecoregion.eea.${code}`) ?? code;
  return EPA_L3_NAMES[code] ?? code;
}
