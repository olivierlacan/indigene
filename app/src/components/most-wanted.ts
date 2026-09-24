// "Most-wanted invasives" — the section on a region's page that names the
// invasive plants worth pulling first there, and teaches the reader to know
// each one.
//
// A ranked list, five long, folded shut: the closed row is enough to scan
// (where it ranks, what it looks like, how hard it pushes, how often it's been
// seen) and opening one is the "how do I know it?" answer — three marks you can
// check standing in front of it, who rated it, the swap and look-alike pages
// where we have them, and real photographs from this region on request.
//
// The photographs wait for a tap, like every iNaturalist lookup in the app:
// nothing leaves the reader's browser until they ask, and then it goes straight
// to iNaturalist, never through us.
import { el, clear } from "../ui";
import type { RegionDef } from "../lib/plants";
import { mostWanted, regionIsRated, sightingsAsOf, type WantedRow } from "../lib/invasives";
import { getOrnamentalByLatin, mappedOrnamentalIds } from "../lib/alternatives";
import { getLookalikeByLatin, mappedLookalikeIds } from "../lib/lookalikes";
import { inatTaxonIdFor } from "../lib/hero-photo";
import { fetchRegionObservations, isBusy, resolveTaxon, boundsCenter, type Bounds } from "../lib/inaturalist";
import { loadSightings, regionCacheKey } from "../lib/nearby";
import { invasiveMarks } from "../lib/prose";
import { commonName, nameLines } from "../lib/names";
import { t, fmtNumber, fmtDate } from "../lib/i18n";
import { invasiveThumb } from "./plant-thumb";
import { cardStats } from "./card-stats";
import { sectionTitle } from "./section-link";
import { observationList, freshnessLine } from "./observation-ui";
import { pressureBadge, listingLine } from "../steps/lookalikes";

/** The section, or nothing for a region with no list yet. */
export function mostWantedSection(region: RegionDef): HTMLElement[] {
  const rows = mostWanted(region.meta.id);
  if (!rows.length) return [];
  return [
    el("section", { id: "most-wanted", style: "margin-top:1.5rem" }, [
      sectionTitle("🚩", t("wanted.title"), fmtNumber(rows.length)),
      el("p", { class: "obs-section-lede" },
        t(regionIsRated(region.meta.id) ? "wanted.lede" : "wanted.ledeUnrated")),
      el("ol", { class: "wanted-list" }, rows.map((r) => el("li", {}, [wantedCard(r, region)]))),
      el("p", { class: "confidence", style: "margin:0.6rem 0 0" },
        t("wanted.countsNote", { date: fmtDate(Date.parse(sightingsAsOf)) })),
    ]),
  ];
}

function wantedCard(row: WantedRow, region: RegionDef): HTMLElement {
  const { invasive: inv, link } = row;
  const names = nameLines(inv);
  const body = el("div", { class: "wanted-body" });
  const details = el("details", { class: "card wanted-card" }, [
    el("summary", { class: "wanted-summary" }, [
      el("span", { class: "wanted-rank", "aria-label": t("wanted.rankAria", { n: fmtNumber(row.rank) }) },
        fmtNumber(row.rank)),
      invasiveThumb(inv.id, inv.form, { attrs: { style: "flex:0 0 auto" } }),
      el("div", { class: "wanted-names" }, [
        el("div", { class: "wanted-name" }, names.title),
        names.sub
          ? el("div", { class: names.subIsLatin ? "plant-latin wanted-sub" : "wanted-sub" }, names.sub)
          : null,
        el("div", { class: "wanted-meta" }, [
          // The badge answers for itself when tapped, and stops the tap from
          // also folding the card open — see `pressureBadge`.
          row.level ? pressureBadge(row.level, link.listing) : null,
          row.sightings != null
            ? cardStats([{
                icon: "📷",
                value: fmtNumber(row.sightings),
                label: t("wanted.sightings", { n: fmtNumber(row.sightings) }),
              }])
            : null,
        ]),
      ]),
    ]),
    body,
  ]) as HTMLDetailsElement;

  // Built on first open, so a closed list of five costs five rows.
  details.addEventListener("toggle", () => {
    if (details.open && !body.childElementCount) body.append(...cardBody(row, region));
  });
  return details;
}

function cardBody(row: WantedRow, region: RegionDef): HTMLElement[] {
  const { invasive: inv, link } = row;
  const marks = invasiveMarks(inv);
  const out: HTMLElement[] = [
    el("dl", { class: "wanted-marks" }, marks.flatMap((m) => [
      el("dt", {}, m.feature),
      el("dd", {}, m.text),
    ])),
  ];
  const listed = listingLine(link);
  if (listed) out.push(listed);

  // The swap and look-alike pages, where we've written one. The swap is only
  // offered if it answers for *this* region: a native we suggest in Oregon is
  // no help to somebody pulling the same plant in Burgundy.
  const links: HTMLElement[] = [];
  const orn = getOrnamentalByLatin(inv.latin);
  if (orn && mappedOrnamentalIds(region.meta.id).has(orn.id)) {
    links.push(el("a", { href: `#/alternatives/${orn.id}` }, t("wanted.growInstead")));
  }
  const look = getLookalikeByLatin(inv.latin);
  if (look && mappedLookalikeIds().has(look.id)) {
    links.push(el("a", { href: `#/lookalikes/${look.id}` }, t("wanted.tellApart")));
  }
  if (links.length) {
    out.push(el("p", { class: "wanted-links" }, links.flatMap((a, i) => (i ? [" · ", a] : [a]))));
  }

  out.push(sightingsBlock(row, region));
  return out;
}

/** "Photos from here": this plant's recent verified sightings in the region's
 *  box, fetched on the tap and cached for a week like every other lookup. */
function sightingsBlock(row: WantedRow, region: RegionDef): HTMLElement {
  const inv = row.invasive;
  const out = el("div", { "aria-live": "polite" });
  const btn = el("button", {
    type: "button",
    class: "btn btn-secondary btn-compact",
    onClick: () => void load(),
  }, t("wanted.photosHere")) as HTMLButtonElement;

  const b = region.meta.bounds;
  const bounds: Bounds = { swLat: b.minLat, swLon: b.minLon, neLat: b.maxLat, neLon: b.maxLon };

  async function load(): Promise<void> {
    btn.disabled = true;
    btn.textContent = t("nearby.asking");
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
      const name = commonName(inv);
      out.append(
        result.observations.length
          ? observationList(result.observations.slice(0, 8), name)
          : el("p", { class: "note" }, t("wanted.noPhotos")),
        freshnessLine(result.fromCache),
      );
    } catch (err) {
      btn.disabled = false;
      btn.textContent = t("wanted.photosHere");
      out.append(el("p", { class: "note warn" }, t(isBusy(err) ? "nearby.busy" : "nearby.unreachable")));
    }
  }

  out.append(btn);
  return out;
}
