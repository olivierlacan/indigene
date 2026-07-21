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
import { relianceLabels, supportLabels, wildlifeKindLabels, DATA_SOURCES_URL } from "../lib/plain";
import { speciesRecordUrl } from "../data/sources";
import { citation } from "../components/citation";
import { termTag } from "../components/term-dialog";
import { silhouetteFor } from "../components/plant-card";
import { keystoneIcon } from "../components/keystone-icon";
import type { SupportLink } from "../types";

// Shared honesty note: this is the notable, mapped wildlife — never a claim to
// be the whole food web. Shown on both the index and every animal's page.
const COVERAGE_NOTE =
  "These are the notable, well-documented wildlife ties we've mapped so far — not every insect a plant supports. A single oak is a caterpillar host to hundreds of moth species; here we name the ones worth choosing a plant for. Every tie shows its source, and the list grows as carefully as the plant lists do.";

// ---- #/wildlife — the index ----
export function renderWildlifeIndex(main: HTMLElement): void {
  clear(main);
  document.title = "Browse native plants by the wildlife they support — Indigene";

  const rows = wildlifeIndex();
  const total = mappedWildlifeCount();

  main.append(
    el("h2", { class: "step-title" }, "Browse by wildlife"),
    el("p", { class: "step-lede" }, [
      `Pick the insect or animal you want in your yard, and see which native plants support it — and how. ${total} creatures mapped so far, from monarchs to the gopher tortoise.`,
    ]),
    el("p", { class: "note info", style: "margin-top:0" }, [
      el("strong", {}, "🌿 Every animal here is itself native. "),
      "The whole point is a native plant feeding native wildlife — so the introduced honey bee, for one, is left out. Each creature's page cites where it's native, and every plant tie cites its source.",
    ]),
  );

  for (const kind of KIND_ORDER) {
    const inKind = rows.filter((r) => r.wildlife.kind === kind);
    if (!inKind.length) continue;
    const label = wildlifeKindLabels[kind];
    main.append(
      el("section", {}, [
        el("h3", { style: "margin:1.2rem 0 0.2rem" }, [
          el("span", { "aria-hidden": "true" }, `${label.icon} `),
          label.title,
        ]),
        el("p", { style: "margin:0 0 0.6rem;font-size:0.9rem;color:var(--ink-soft)" }, label.blurb),
        ...inKind.map((row) => wildlifeCard(row.wildlife.id, row.plantCount, row.regionIds.length)),
      ]),
    );
  }

  main.append(
    el("p", { class: "note", style: "margin-top:1.25rem" }, COVERAGE_NOTE),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, "← Browse plants instead"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Start from a spot"),
    ]),
  );
}

function wildlifeCard(id: string, plantCount: number, regionCount: number): HTMLElement {
  const w = getWildlife(id);
  if (!w) return el("span", {});
  const reach =
    `🌱 ${plantCount} ${plantCount === 1 ? "plant" : "plants"}` +
    (regionCount > 1 ? ` · 📍 ${regionCount} regions` : "") +
    " · 🌿 native";
  return el("a", {
    href: `#/wildlife/${w.id}`,
    class: "card",
    style: "display:flex;gap:0.7rem;align-items:flex-start;text-decoration:none;color:inherit;padding:0.7rem 0.85rem;margin-bottom:0.5rem",
  }, [
    el("div", { "aria-hidden": "true", style: "font-size:1.6rem;line-height:1;flex:0 0 auto" }, w.icon),
    el("div", { style: "min-width:0" }, [
      el("div", { style: "font-weight:700" }, [
        w.common,
        w.latin ? el("span", { class: "plant-latin", style: "font-weight:400;font-size:0.82rem" }, ` · ${w.latin}`) : null,
      ]),
      el("div", { style: "font-size:0.85rem;color:var(--ink-soft);margin:0.15rem 0 0.3rem" }, w.blurb),
      el("div", { style: "font-size:0.82rem;font-weight:650;color:var(--brand, #175e33)" }, reach),
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
  document.title = `Native plants that support the ${w.common} — Indigene`;

  const supports = plantsForWildlife(w.id);
  const label = wildlifeKindLabels[w.kind];

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
        el("a", { href: "#/wildlife" }, `← All wildlife`),
        `  ·  ${label.icon} ${label.title}`,
      ]),
      el("div", { class: "plant-head" }, [
        el("div", { "aria-hidden": "true", style: "font-size:2.4rem;line-height:1;flex:0 0 auto" }, w.icon),
        el("div", {}, [
          el("h2", { class: "plant-name", style: "margin:0" }, w.common),
          w.latin ? el("div", { class: "plant-latin" }, w.latin) : null,
          el("span", { class: "badge nowater", title: w.nativeBasis }, "🌿 Native animal"),
        ]),
      ]),
      el("p", { style: "margin-top:0.75rem" }, w.blurb),
      // The native-status guarantee, sourced (authority names linked) — a native
      // plant should be feeding a native animal, and we say where that comes from.
      el("p", { class: "confidence", style: "margin-top:0.4rem" }, [
        el("span", { "aria-hidden": "true" }, "🌿 "),
        el("strong", {}, "A native animal. "),
        ...citation(w.nativeBasis),
      ]),
      speciesLink(w),
      el("p", { style: "margin:0.4rem 0 0;font-weight:650" }, [
        `${plantCount} native ${plantCount === 1 ? "plant" : "plants"} in Indigene support the ${w.common.toLowerCase()}`,
        hosts ? `, ${hosts} of them as a caterpillar host — the strongest tie.` : ".",
      ]),
      soleCount
        ? el("p", { class: "note info", style: "margin:0.5rem 0 0" }, [
            el("strong", {}, `⭐ It can't live without ${soleCount === 1 ? "this plant" : "these plants"}. `),
            `${soleCount === 1 ? "This is" : `${soleCount} of these are`} its only option — remove ${soleCount === 1 ? "it" : "them"} and the ${w.common.toLowerCase()} has nowhere to go.`,
          ])
        : null,
    ]),
  );

  for (const group of byRegion) {
    main.append(
      el("section", {}, [
        el("h3", { style: "margin:1.1rem 0 0.5rem" }, [
          "📍 ",
          el("a", { href: `#/regions/${group.region.meta.id}`, style: "color:inherit" }, group.region.meta.name),
        ]),
        ...group.items
          .slice()
          .sort(sortByStrength)
          .map((s) => supportRow(s)),
      ]),
    );
  }

  main.append(
    el("p", { class: "note", style: "margin-top:1.25rem" }, COVERAGE_NOTE),
    el("p", { class: "confidence", style: "margin-top:0.5rem" }, [
      el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "All sources & licensing →"),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("wildlife") }, "← All wildlife"),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Rank these for my spot"),
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
  return a.plant.common.localeCompare(b.plant.common);
}

// A plant row on an animal's page. The card is a plain div (not a link) so the
// tie chips can be real buttons; the plant name is the link to its profile.
function supportRow(s: PlantSupport): HTMLElement {
  const p = s.plant;
  return el("div", {
    class: "card",
    style: "display:flex;gap:0.7rem;align-items:flex-start;padding:0.6rem 0.8rem;margin-bottom:0.5rem",
  }, [
    el("a", {
      href: `#/plants/${p.id}`,
      class: "plant-photo",
      "aria-label": `${p.common} — full profile`,
      style: "flex:0 0 auto",
    }, [silhouetteFor(p.form)]),
    el("div", { style: "min-width:0" }, [
      el("div", { style: "font-weight:700" }, [
        el("a", { href: `#/plants/${p.id}`, style: "color:inherit" }, p.common),
        p.keystone
          ? el("span", {
              title: "Keystone plant — supports far more wildlife than most",
              role: "img",
              "aria-label": "Keystone plant",
              style: "margin-left:0.3rem;color:var(--brand)",
            }, [keystoneIcon(13)])
          : null,
      ]),
      el("div", { class: "plant-latin", style: "font-size:0.85rem" }, p.latin),
      el("div", { style: "display:flex;flex-wrap:wrap;gap:0.3rem;margin-top:0.35rem" }, tieTags(s.link)),
      el("div", { style: "font-size:0.85rem;color:var(--ink-soft);margin-top:0.3rem" }, s.link.note),
      // Every relationship shows its source, with authority names linked out.
      el("div", { style: "font-size:0.75rem;color:var(--ink-soft);opacity:0.85;margin-top:0.2rem" }, [
        el("span", { "aria-hidden": "true" }, "🔎 "),
        "Source: ",
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
    "See the species record: ",
    el("a", { href: rec.url, target: "_blank", rel: "noopener", class: "src-link" }, `${rec.name} →`),
  ]);
}

// The tie as one-word, tap-to-explain chips: the role ("Host", "Nectar") always,
// then a strength chip only when it's notable — "Essential" (make-or-break) or
// "Specialist". A generalist tie shows no strength chip, so an unmarked plant
// reads as "one of many" without a word of clutter.
function tieTags(link: SupportLink): HTMLElement[] {
  const role = supportLabels[link.support];
  const tags = [termTag(role, link.support === "host" ? "host" : "")];
  const r = relianceOf(link);
  if (r !== "broad") {
    tags.push(termTag(relianceLabels[r], r === "sole" ? "sole" : ""));
  }
  return tags;
}

function renderNotFound(main: HTMLElement, id: string): void {
  main.append(
    el("h2", { class: "step-title" }, "We don't track that creature yet"),
    el("p", { class: "step-lede" }, [
      `Nothing in Indigene's wildlife list matches “${id}”. The list is curated — every tie is checked and sourced — so it grows carefully.`,
    ]),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("wildlife") }, "Browse the wildlife we do track"),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, "Browse plants"),
    ]),
  );
}
