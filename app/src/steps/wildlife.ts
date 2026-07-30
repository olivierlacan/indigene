// Browse-by-wildlife: the food-web read on the catalog. The rest of the app
// starts from a plant or a spot; this starts from the animal you're hoping to
// bring in — "show me the natives that raise monarchs / feed hummingbirds /
// bring back the atala" — and lists the plants that support it, region by
// region, saying honestly how each one helps (raises its young vs. feeds it).
//
// Two routes, both hash-based:
//   #/wildlife            → the index, grouped into butterflies / moths / bees /
//                           birds / mammals, each animal a card.
//   #/wildlife/<id>       → one animal: what it is, then the plants that support
//                           it grouped by region, each linking to its profile.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS } from "../lib/plants";
import {
  KIND_ORDER,
  getWildlife,
  plantsForWildlife,
  relianceOf,
  wildlifeIndex,
  mappedWildlifeCount,
} from "../lib/wildlife";
import type { PlantSupport } from "../lib/wildlife";
import { relianceLabel, supportLabel, wildlifeKindLabel, DATA_SOURCES_URL } from "../lib/plain";
import { speciesRecordUrl } from "../data/sources";
import { citation } from "../components/citation";
import { termTag } from "../components/term-dialog";
import { supportIcon, relianceIcon } from "../components/support-icon";
import { silhouetteFor } from "../components/plant-card";
import { keystoneIcon } from "../components/keystone-icon";
import { wildlifeNearbySection } from "../components/wildlife-nearby";
import { cardStats } from "../components/card-stats";
import type { SupportLink } from "../types";
import { t, tn, fmtNumber, getLang } from "../lib/i18n";
import { commonName, nameLines, regionName } from "../lib/names";
import { wildlifeBlurb, supportNote } from "../lib/prose";

// Shared honesty note: this is the notable, mapped wildlife — never a claim to
// be the whole food web. Shown on both the index and every animal's page. A
// function, not a constant: a constant would be frozen in whatever language
// was active when this module first loaded.
const coverageNote = (): string => t("wildlife.coverageNote");

// ---- #/wildlife — the index ----
export function renderWildlifeIndex(main: HTMLElement): void {
  clear(main);
  document.title = t("wildlife.indexDocTitle");

  const rows = wildlifeIndex();
  const total = mappedWildlifeCount();

  main.append(
    el("h2", { class: "step-title" }, t("wildlife.indexTitle")),
    el("p", { class: "step-lede" }, t("wildlife.indexLede", { n: fmtNumber(total) })),
    el("p", { class: "note info", style: "margin-top:0" }, [
      el("strong", {}, t("wildlife.allNative")),
      t("wildlife.allNativeRest"),
    ]),
  );

  for (const kind of KIND_ORDER) {
    const inKind = rows.filter((r) => r.wildlife.kind === kind);
    if (!inKind.length) continue;
    const label = wildlifeKindLabel(kind);
    main.append(
      el("section", {}, [
        el("h3", { style: "margin:1.2rem 0 0.2rem" }, [
          el("span", { "aria-hidden": "true" }, `${label.icon} `),
          label.title,
        ]),
        el("p", { style: "margin:0 0 0.6rem;font-size:0.9rem;color:var(--ink-soft)" }, label.blurb),
        // One column on a phone, columns on anything wider — the creature
        // cards are self-contained, so a laptop should show a group at a
        // glance rather than one card per screenful.
        el("div", { class: "card-grid" },
          inKind.map((row) => wildlifeCard(row.wildlife.id, row.plantCount, row.regionIds.length))),
      ]),
    );
  }

  main.append(
    el("p", { class: "note", style: "margin-top:1.25rem" }, coverageNote()),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("wildlife.browsePlants")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.startFromSpot")),
    ]),
  );
}

// A creature's card on the index. The blurbs are different lengths, so the
// reach figures are pinned to the bottom of the card (`.card-stats`) rather
// than left to flow after the text — in a grid that means every card's numbers
// sit on the same line, and the eye reads down a column instead of hunting.
function wildlifeCard(id: string, plantCount: number, regionCount: number): HTMLElement {
  const w = getWildlife(id);
  if (!w) return el("span", {});
  const names = nameLines(w);
  return el("a", { href: `#/wildlife/${w.id}`, class: "card wildlife-card" }, [
    el("span", { class: "wildlife-card-icon", "aria-hidden": "true" }, w.icon),
    el("span", { class: "wildlife-card-text" }, [
      el("span", { style: "font-weight:700" }, [
        names.title,
        names.sub ? el("span", { class: "plant-latin", style: "font-weight:400;font-size:0.82rem" }, ` · ${names.sub}`) : null,
      ]),
      el("span", { style: "font-size:0.85rem;color:var(--ink-soft);margin:0.15rem 0 0.3rem" }, wildlifeBlurb(w)),
      cardStats([
        {
          icon: "🌱",
          value: fmtNumber(plantCount),
          label: tn("wildlife.supportedBy", plantCount, { n: fmtNumber(plantCount), animal: names.title }),
        },
        regionCount > 1
          ? {
              icon: "📍",
              value: fmtNumber(regionCount),
              label: t("wildlife.onRegionLists", { n: fmtNumber(regionCount) }),
            }
          : null,
        {
          icon: "🌿",
          value: t("wildlife.nativeShort"),
          label: t("wildlife.isNative", { animal: names.title, basis: w.nativeBasis }),
        },
      ]),
    ]),
  ]);
}

// ---- #/wildlife/<id> — one animal ----
export function renderWildlife(main: HTMLElement, param?: string): void {
  clear(main);
  const id = (param ?? "").split("/")[0];
  const w = getWildlife(id);
  if (!w) {
    renderNotFound(main, id);
    return;
  }
  document.title = t("wildlife.docTitle", { animal: commonName(w) });

  const supports = plantsForWildlife(w.id);
  const label = wildlifeKindLabel(w.kind);
  const names = nameLines(w);

  // Group the supporting plants by region, in the app's usual region order.
  const byRegion = REGIONS.map((r) => ({
    region: r,
    items: supports.filter((s) => s.region.meta.id === r.meta.id),
  })).filter((g) => g.items.length);

  const plantCount = supports.length;
  const hosts = supports.filter((s) => s.link.support === "host").length;
  const soleCount = supports.filter((s) => relianceOf(s.link) === "sole").length;

  main.append(
    el("article", { class: "plant" }, [
      el("p", { class: "region-tag", style: "margin:0 0 0.4rem;font-size:0.9rem;color:var(--ink-soft)" }, [
        el("a", { href: "#/wildlife" }, t("wildlife.allWildlife")),
        `  ·  ${label.icon} ${label.title}`,
      ]),
      el("div", { class: "plant-head" }, [
        el("div", { "aria-hidden": "true", style: "font-size:2.4rem;line-height:1;flex:0 0 auto" }, w.icon),
        el("div", {}, [
          el("h2", { class: "plant-name", style: "margin:0" }, names.title),
          names.sub ? el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" }, names.sub) : null,
          el("span", { class: "badge nowater", title: w.nativeBasis }, t("wildlife.nativeBadge")),
        ]),
      ]),
      // The .plant card has no padding of its own (media can run full-bleed),
      // so all the loose text lives in a .plant-body to get the usual gutters.
      el("div", { class: "plant-body" }, [
        el("p", { style: "margin:0" }, wildlifeBlurb(w)),
        // The native-status guarantee, sourced (authority names linked) — a native
        // plant should be feeding a native animal, and we say where that comes from.
        el("p", { class: "confidence", style: "margin:0.4rem 0 0" }, [
          el("span", { "aria-hidden": "true" }, "🌿 "),
          el("strong", {}, t("wildlife.aNativeAnimal")),
          ...citation(w.nativeBasis),
        ]),
        speciesLink(w),
        el("p", { style: "margin:0.4rem 0 0;font-weight:650" }, [
          tn("wildlife.supportedBy", plantCount, { n: fmtNumber(plantCount), animal: names.title }),
          hosts ? tn("wildlife.ofThemHosts", hosts, { n: fmtNumber(hosts) }) : ".",
        ]),
        soleCount
          ? el("p", { class: "note info", style: "margin:0.5rem 0 0" }, [
              el("strong", {}, tn("wildlife.cantLiveWithout", soleCount)),
              tn("wildlife.onlyOption", soleCount, { n: fmtNumber(soleCount), animal: names.title }),
            ])
          : null,
      ]),
    ]),
  );

  // "See it near you" — real iNaturalist sightings of this animal near the user
  // (or in a region it's found in). Null for informal groups with no single taxon.
  const nearby = wildlifeNearbySection(w);
  if (nearby) main.append(nearby);

  for (const group of byRegion) {
    main.append(
      el("section", {}, [
        el("h3", { style: "margin:1.1rem 0 0.5rem" }, [
          "📍 ",
          el("a", { href: `#/regions/${group.region.meta.id}`, style: "color:inherit" }, regionName(group.region.meta)),
        ]),
        ...group.items
          .slice()
          .sort(sortByStrength)
          .map((s) => supportRow(s)),
      ]),
    );
  }

  main.append(
    el("p", { class: "note", style: "margin-top:1.25rem" }, coverageNote()),
    el("p", { class: "confidence", style: "margin-top:0.5rem" }, [
      el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, t("wildlife.allSources")),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("wildlife") }, t("wildlife.allWildlife")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.rankForSpot")),
    ]),
  );
}

// Strongest dependence first: sole > narrow > broad, then host over other
// support kinds, then alphabetical — so the make-or-break plants lead.
const RELIANCE_RANK = { sole: 0, narrow: 1, broad: 2 } as const;
function sortByStrength(a: PlantSupport, b: PlantSupport): number {
  const ar = RELIANCE_RANK[relianceOf(a.link)];
  const br = RELIANCE_RANK[relianceOf(b.link)];
  if (ar !== br) return ar - br;
  const ah = a.link.support === "host" ? 0 : 1;
  const bh = b.link.support === "host" ? 0 : 1;
  if (ah !== bh) return ah - bh;
  // Sorted by the name the reader actually sees, in their own collation —
  // "Épicéa" files under E in French, not after Z.
  return commonName(a.plant).localeCompare(commonName(b.plant), getLang());
}

// A plant row on an animal's page. The card is a plain div (not a link) so the
// tie chips can be real buttons; the plant name is the link to its profile.
function supportRow(s: PlantSupport): HTMLElement {
  const p = s.plant;
  const names = nameLines(p);
  return el("div", {
    class: "card",
    style: "display:flex;gap:0.7rem;align-items:flex-start;padding:0.6rem 0.8rem;margin-bottom:0.5rem",
  }, [
    el("a", {
      href: `#/plants/${p.id}`,
      class: "plant-photo",
      "aria-label": t("wildlife.fullProfile", { name: names.title }),
      style: "flex:0 0 auto",
    }, [silhouetteFor(p.form)]),
    el("div", { style: "min-width:0" }, [
      el("div", { style: "font-weight:700" }, [
        el("a", { href: `#/plants/${p.id}`, style: "color:inherit" }, names.title),
        p.keystone
          ? el("span", {
              title: t("explore.keystoneTitle"),
              role: "img",
              "aria-label": t("explore.keystoneLabel"),
              style: "margin-left:0.3rem;color:var(--brand)",
            }, [keystoneIcon(13)])
          : null,
      ]),
      el("div", { class: "plant-latin", style: "font-size:0.85rem" }, names.sub),
      el("div", { style: "display:flex;flex-wrap:wrap;gap:0.3rem;margin-top:0.35rem" }, tieTags(s.link)),
      el("div", { style: "font-size:0.85rem;color:var(--ink-soft);margin-top:0.3rem" }, supportNote(p.latin, s.link)),
      // Every relationship shows its source, with authority names linked out.
      el("div", { style: "font-size:0.75rem;color:var(--ink-soft);opacity:0.85;margin-top:0.2rem" }, [
        el("span", { "aria-hidden": "true" }, "🔎 "),
        t("card.source"),
        ...citation(s.link.basis),
      ]),
    ]),
  ]);
}

// A deep link to the animal's own record where a stable scheme exists (BAMONA
// for insects, All About Birds for single birds). Null for groups/multi-species.
function speciesLink(w: Parameters<typeof speciesRecordUrl>[0]): HTMLElement | null {
  const rec = speciesRecordUrl(w);
  if (!rec) return null;
  return el("p", { style: "margin:0.3rem 0 0;font-size:0.9rem" }, [
    el("span", { "aria-hidden": "true" }, "🔗 "),
    t("wildlife.speciesRecord"),
    el("a", { href: rec.url, target: "_blank", rel: "noopener", class: "src-link" }, `${rec.name} →`),
  ]);
}

// The tie as one-word, tap-to-explain chips with monochrome glyphs: the role
// ("Host", "Nectar") always, then a strength chip only when it's notable —
// "Essential" (make-or-break) or "Specialist". A generalist tie shows no
// strength chip, so an unmarked plant reads as "one of many" without clutter.
// Each chip carries its own pill color (see the `.tag-*` rules).
function tieTags(link: SupportLink): HTMLElement[] {
  const kind = link.support;
  const role = { ...supportLabel(kind), glyph: () => supportIcon(kind) };
  const tags = [termTag(role, kind)];
  const r = relianceOf(link);
  if (r !== "broad") {
    const strength = { ...relianceLabel(r), glyph: () => relianceIcon(r) as SVGElement };
    tags.push(termTag(strength, r));
  }
  return tags;
}

function renderNotFound(main: HTMLElement, id: string): void {
  main.append(
    el("h2", { class: "step-title" }, t("wildlife.notFoundTitle")),
    el("p", { class: "step-lede" }, t("wildlife.notFoundLede", { id })),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("wildlife") }, t("wildlife.notFoundBrowse")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("wildlife.browsePlantsShort")),
    ]),
  );
}
