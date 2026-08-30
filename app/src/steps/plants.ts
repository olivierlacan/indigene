// The plants index (#/plants): every native Indigene knows, with a box that
// narrows the list as you type. It reads the native-plant registry (the
// identity layer), so a name resolves here the same way it does everywhere in
// the app: over the same common names, scientific names, and aliases.
//
// The typed query is reflected into the URL as `#/plants?q=<query>` so a
// narrowed list is shareable. A query string rather than a path segment,
// because `#/plants/<slug>` is already one plant's profile — "oak" is a search,
// not a slug, and the two can't share a shape. `#/search` and `#/search/<q>`
// were the old addresses; main.ts folds them into these.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGISTRY } from "../lib/registry";
import { REGIONS } from "../lib/plants";
// The same matching and the same underlining the in-page filters use, so a
// name matches — and *looks* matched — identically wherever you type it.
import { highlight, norm } from "../components/filter-field";
import { plantThumb } from "../components/plant-thumb";
import { lookalikeIcon, propagateIcon } from "../components/door-icons";
import type { PlantForm } from "../types";
import { t, tx, fmtNumber, getLang } from "../lib/i18n";
import { regionName, regionShort, searchAliases, localName } from "../lib/names";

const regionMetaOf = (id: string) => REGIONS.find((x) => x.meta.id === id)?.meta;

// One "way in" callout: the whole card links to `href`, with a drawn icon in a
// tinted slot, the sentence (its action phrase already picked out by the caller
// as a `.plant-door-cta` span), and a chevron. `body` is the `tx(...)` node list.
function door(href: string, icon: SVGElement, body: (string | Node)[]): HTMLElement {
  return el("a", { href, class: "card plant-door" }, [
    el("span", { class: "plant-door-icon", "aria-hidden": "true" }, [icon]),
    el("span", { class: "plant-door-text" }, body),
    el("span", { class: "plant-door-chevron", "aria-hidden": "true" }, "›"),
  ]);
}

type Row = {
  slug: string;
  common: string;
  latin: string;
  form: PlantForm;
  regions: string[];
  hay: string;
  alts: string[];
};

// Built once from the registry: one searchable row per taxon. `hay` is every
// name (common, scientific, alias) normalized, so a substring match finds a
// plant by any of the ways someone might type it. `alts` keeps the names that
// can match but aren't displayed (second common names, aliases), so a result
// can show which hidden name it matched on.
//
// Rebuilt whenever the language changes, because the *displayed* name and the
// sort order both follow it. The haystack does not: it always contains every
// language's name plus the scientific one, so switching to French never makes a
// plant you could find in English un-findable.
function buildRows(): Row[] {
  return REGISTRY.map((e) => {
    const taxon = { common: e.commonNames[0] ?? e.scientificName, latin: e.scientificName };
    const common = localName(taxon)?.name ?? taxon.common;
    const shown = new Set([norm(common), norm(e.scientificName)]);
    const alts: string[] = [];
    for (const name of [...e.commonNames, ...e.aliases, ...searchAliases(taxon)]) {
      const n = norm(name);
      if (shown.has(n)) continue;
      shown.add(n);
      alts.push(name);
    }
    return {
      slug: e.identifiers.indigene ?? "",
      common,
      latin: e.scientificName,
      form: e.form,
      regions: e.regions,
      hay: norm([common, ...e.commonNames, e.scientificName, ...e.aliases, ...searchAliases(taxon)].join(" ")),
      alts,
    };
  })
    .filter((r) => r.slug)
    .sort((a, b) => a.common.localeCompare(b.common, getLang()));
}

/** The typed query, read straight off the address bar (`/plants?q=oak`).
 *  The router hands a param to `#/<step>/<param>` pages; this page's state is a
 *  query string instead, so it reads its own.
 *
 *  Both sides of the `#` are read. This page has a real file of its own, so its
 *  canonical address is the path form and that's what the router leaves in the
 *  address bar (`syncAddressBar` in main.ts) — but the hash form is still what
 *  an old link, a bookmark or the retired `#/search/<query>` address arrives
 *  as, and either is a fine thing to be handed. */
function queryFromUrl(): string {
  const at = location.hash.indexOf("?");
  const params =
    at >= 0
      ? new URLSearchParams(location.hash.slice(at + 1))
      : new URLSearchParams(location.search);
  return params.get("q") ?? "";
}

export function renderPlants(main: HTMLElement): void {
  clear(main);
  document.title = t("plants.docTitle");
  const ROWS = buildRows();

  const input = el("input", {
    type: "search",
    id: "plant-q",
    autocomplete: "off",
    autocapitalize: "none",
    spellcheck: false,
    placeholder: t("plants.placeholder"),
    style: "width:100%",
  }) as HTMLInputElement;
  const count = el("p", { id: "search-count", class: "coords", style: "margin:0.5rem 0 0.8rem" }, "");
  const results = el("div", { "aria-live": "polite" });

  function rank(r: Row, nq: string): number {
    if (!nq) return 0;
    return norm(r.common).startsWith(nq) || norm(r.latin).startsWith(nq) ? 0 : 1;
  }

  // One plant as a card in the grid: its picture, the two name lines, and the
  // regions it's native to as pills — the same pills an animal's page uses, so
  // "where does this grow" looks the same wherever it's answered. The whole card
  // is the link; there is nothing else on it to aim at.
  //
  // The picture is the form drawing until the plant's chosen photograph arrives
  // over it — and this list is ~190 plants long, so the photographs are fetched
  // a screenful at a time as you scroll rather than all at once. See
  // `components/plant-thumb.ts`.
  function card(r: Row, nq: string): HTMLElement {
    // When neither displayed name contains the query, the match came from a
    // hidden name (a second common name, an alias) — show that name, so the
    // result doesn't look like a false positive.
    const alt = nq && !norm(r.common).includes(nq) && !norm(r.latin).includes(nq)
      ? r.alts.find((a) => norm(a).includes(nq))
      : undefined;
    return el("li", {}, [
      el("a", { href: `#/plants/${r.slug}`, class: "card plant-index-card" }, [
        plantThumb(r.slug, r.form, { attrs: { style: "flex:none" } }),
        el("span", { class: "plant-index-text" }, [
          el("span", { class: "plant-name", style: "display:block;font-weight:700" }, highlight(r.common, nq)),
          el("span", { class: "plant-latin", style: "display:block" }, highlight(r.latin, nq)),
          alt && el("span", { class: "plant-index-alt" },
            [t("plants.alsoCalled"), ...highlight(alt, nq), t("plants.alsoCalledEnd")]),
          el("span", { class: "region-pills" }, r.regions.map((id) => {
            const meta = regionMetaOf(id);
            return el("span", { class: "region-pill", title: meta ? regionName(meta) : id },
              meta ? regionShort(meta) : id);
          })),
        ]),
      ]),
    ]);
  }

  function run(q: string): void {
    const nq = norm(q);
    const matches = (nq ? ROWS.filter((r) => r.hay.includes(nq)) : ROWS)
      .slice()
      .sort((a, b) => rank(a, nq) - rank(b, nq) || a.common.localeCompare(b.common, getLang()));
    count.textContent = nq
      ? t("plants.matchCount", { n: fmtNumber(matches.length), total: fmtNumber(ROWS.length), q: q.trim() })
      : t("plants.idle", { total: fmtNumber(ROWS.length), regions: fmtNumber(REGIONS.length) });
    clear(results);
    if (!matches.length) {
      results.append(
        el("div", { class: "note warn" }, [
          t("plants.noneLead", { q: q.trim() }),
          el("a", { href: "#/regions" }, t("plants.noneLink")),
          t("plants.noneEnd"),
        ]),
      );
      return;
    }
    // A grid, not a stack: the cards are self-contained, so a laptop shows
    // three across instead of one phone-wide ribbon down the middle of the
    // screen (see `.card-grid`, and `WIDE_STEPS` in main.ts).
    results.append(
      el("ul", { class: "card-grid", style: "list-style:none;margin:0;padding:0" },
        matches.map((r) => card(r, nq)))
    );
  }

  input.addEventListener("input", () => {
    const q = input.value;
    run(q);
    // Reflect the query into the URL for sharing, without triggering a re-route.
    // The canonical path form, not the hash: this page has a prerendered file,
    // so `/plants?q=oak` is a real address that previews — and writing the hash
    // form here would leave `…/plants/#/plants?q=oak` on a page that was itself
    // opened by its path.
    const base = `${import.meta.env.BASE_URL}plants`;
    history.replaceState(null, "", q.trim() ? `${base}?q=${encodeURIComponent(q.trim())}` : base);
  });

  main.append(
    el("h2", { class: "step-title" }, t("plants.title")),
    el("p", { class: "step-lede" }, t("plants.lede")),
    // Two ways in, as a pair of callout cards rather than running prose — each is
    // a distinct side-door, so it reads as one, set apart from the search that is
    // the section's actual job. The whole card is the link (like the plant cards
    // below), with a drawn icon, the sentence, and its action phrase picked out;
    // they sit two-up on a laptop and stack on a phone.
    //
    // Look-alikes first: it sits here, on the catalog, because that's where the
    // question arises — you look a plant up because you're not sure what you're
    // holding — and because the header has no room for a fifth nav item (see
    // components/app-menu.ts on how tightly it's measured). Then the how-tos, for
    // the same reason and place: once you own one, the next question is how to
    // make more of it, and when in the year that's done.
    el("div", { class: "plant-doors" }, [
      door("#/lookalikes", lookalikeIcon(), tx("plants.lookalikesLink", {
        link: el("span", { class: "plant-door-cta" }, t("plants.lookalikesLinkText")),
      })),
      door("#/planting", propagateIcon(), tx("plants.plantingLink", {
        link: el("span", { class: "plant-door-cta" }, t("plants.plantingLinkText")),
      })),
    ]),
    el("div", { class: "field" }, [el("label", { for: "plant-q" }, t("plants.label")), input]),
    count,
    results,
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("regions") }, t("plants.browseRegions")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.rankForSpot")),
    ]),
  );

  const initial = queryFromUrl();
  if (initial) input.value = initial;
  run(initial);
  queueMicrotask(() => input.focus());
}
