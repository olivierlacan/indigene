// "Where this region reaches" — the card that answers the question a plant list
// can't.
//
// Someone landing on a roster wants to know one thing before they trust it:
// *does this include me?* The app knew the answer in three forms it never
// showed — a lat/lon box, a set of ecoregion codes, and a caveat sentence about
// the flora next door — and a reader on a phone could read the whole page
// without learning how far north the region goes. That was the complaint, and
// it was fair.
//
// So this card says it three ways, shortest first:
//
//   1. The edges in landmarks ("north to the Canadian border, … east only as
//      far as the crest of the Cascades") — `RegionMeta.extent`.
//   2. Which mapped ecoregions those edges actually are, by name. This is not
//      decoration: the polygons *are* the rule. A point resolving to Willamette
//      Valley gets this list; the same point a ridge east, in Eastern Cascades
//      Slopes, does not.
//   3. A link to the authority's own map — the EPA's Level III/IV atlas in the
//      US, the EEA's biogeographical regions in Europe — so anyone who wants
//      the boundary itself can have it rather than our paraphrase.
//
// A real map drawn in the app (the ecoregion polygon over OpenStreetMap tiles)
// is the better answer and is a separate piece of work; the polygons are megabytes
// next to a bundle measured in tens of kilobytes, so it needs a plan of its own.
// Until then, linking the map beats describing it.
import type { RegionMeta } from "../data/region";
import type { EcoregionProvider } from "../types";
import { el } from "../ui";
import { EPA_L3_NAMES } from "../data/ecoregions";
import { EEA_BIOREGION_MAP_URL, EPA_ECOREGION_MAP_URL } from "../lib/plain";
import { fmtList, t, tn, tOptional } from "../lib/i18n";
import { regionExtent } from "../lib/names";

export function regionBoundaryCard(meta: RegionMeta): HTMLElement {
  const eco = meta.ecoregion;
  const eea = providerFor(meta) === "eea-biogeo";
  return el("section", { class: "card region-where" }, [
    el("h3", { style: "margin:0 0 0.4rem;font-size:1.05rem" }, t("regionWhere.title")),
    el("p", { style: "margin:0 0 0.5rem" }, regionExtent(meta)),
    el("p", { style: "margin:0 0 0.6rem;color:var(--ink-soft);font-size:0.92rem" },
      // Plural-aware: a region can be one mapped area or five, and the
      // sentence has to agree with it in both languages.
      eco
        ? tn(eea ? "regionWhere.followsEea" : "regionWhere.followsEpa", eco.codes.length, {
            list: fmtList(eco.codes.map((c) => ecoregionName(eco.provider, c))),
          })
        : t("regionWhere.broad")),
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
