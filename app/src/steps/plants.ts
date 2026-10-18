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
//
// The list sorts, groups and filters the way a region's roster does, with the
// same panel (`components/roster-controls.ts`), and those choices ride in the
// same query string: `/plants?q=oak&sort=caterpillars`.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGISTRY } from "../lib/registry";
import { REGIONS } from "../lib/plants";
// The same matching and the same underlining the in-page filters use, so a
// name matches — and *looks* matched — identically wherever you type it.
import { highlight, norm } from "../components/filter-field";
import { plantThumb } from "../components/plant-thumb";
import { door } from "../components/plant-door";
import { lookalikeIcon, alternativeIcon, invasiveIcon, cropsIcon, propagateIcon } from "../components/door-icons";
import { keystoneIcon } from "../components/keystone-icon";
import { silhouetteFor } from "../components/plant-card";
import { sectionTitle } from "../components/section-link";
import { rosterControls, caterpillarLede, countTag } from "../components/roster-controls";
import { rosterQuery, rosterView, byCaterpillars } from "../lib/roster-sort";
import type { RosterView } from "../lib/roster-sort";
import { FORM_ORDER } from "../lib/forms";
import { PIONEERS } from "../data/pioneers";
import type { PlantForm } from "../types";
import { t, fmtNumber, getLang } from "../lib/i18n";
import { INVASIVES } from "../data/invasives";
import { LOOKALIKES } from "../data/lookalikes";
import { ORNAMENTALS } from "../data/alternatives";
import { mappedInvasiveIds } from "../lib/invasives";
import { mappedLookalikeIds } from "../lib/lookalikes";
import { mappedOrnamentalIds } from "../lib/alternatives";
import { regionName, regionShort, searchAliases, localName, commonName } from "../lib/names";

const regionMetaOf = (id: string) => REGIONS.find((x) => x.meta.id === id)?.meta;

type Row = {
  slug: string;
  common: string;
  latin: string;
  form: PlantForm;
  keystone: boolean;
  hostLepCount: number | null;
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
      keystone: e.keystone,
      hostLepCount: e.hostLepCount,
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
function paramsFromUrl(): URLSearchParams {
  const at = location.hash.indexOf("?");
  return at >= 0
    ? new URLSearchParams(location.hash.slice(at + 1))
    : new URLSearchParams(location.search);
}

/** The page's address for a query and a view: the canonical path form, not the
 *  hash, because this page has a prerendered file, so `/plants?q=oak` is a real
 *  address that previews. The query leads, then the view's own parameters. */
function plantsHref(q: string, view: RosterView): string {
  const base = `${import.meta.env.BASE_URL}plants`;
  const all = new URLSearchParams(q.trim() ? { q: q.trim() } : {});
  for (const [k, v] of new URLSearchParams(rosterQuery(view))) all.set(k, v);
  const str = all.toString();
  return str ? `${base}?${str}` : base;
}

/** Every plant that is a pioneer in at least one region. The catalog has no
 *  region to ask, so a plant counts if any region's table names it. */
function pioneerIds(): Set<string> {
  return new Set(Object.values(PIONEERS).flatMap((table) => Object.keys(table)));
}

/** A plant type's silhouette at heading size, the same drawing as the cards. */
function formIcon(f: PlantForm): SVGSVGElement {
  const svg = silhouetteFor(f, 24);
  svg.setAttribute("aria-hidden", "true");
  svg.style.verticalAlign = "-0.18em";
  return svg;
}

export function renderPlants(main: HTMLElement): void {
  clear(main);
  document.title = t("plants.docTitle");
  const ROWS = buildRows();
  const PIONEER_IDS = pioneerIds();
  const pioneerCount = ROWS.filter((r) => PIONEER_IDS.has(r.slug)).length;
  let view = rosterView(paramsFromUrl());

  const input = el("input", {
    type: "search",
    id: "plant-q",
    autocomplete: "off",
    autocapitalize: "none",
    spellcheck: false,
    placeholder: t("plants.placeholder"),
    style: "width:100%",
  }) as HTMLInputElement;
  // The count is what a screen reader hears as you type ("12 plants"); the
  // cards themselves are not live — rebuilt on every keystroke, up to ~460 of
  // them, they would read the whole catalogue aloud.
  const count = el("p", { id: "search-count", class: "coords", role: "status", style: "margin:0.5rem 0 0.8rem" }, "");
  const results = el("div");
  const controls = el("div");

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
  // over it — and this list is ~460 plants long, so the photographs are fetched
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
          el("span", { class: "plant-name", style: "display:block;font-weight:700" }, [
            ...highlight(r.common, nq),
            // A word joiner keeps the star from wrapping onto a line alone.
            r.keystone ? "\u2060" : null,
            r.keystone
              ? el("span", {
                  title: t("explore.keystoneTitle"),
                  role: "img",
                  "aria-label": t("explore.keystoneLabel"),
                  class: "name-mark",
                }, [keystoneIcon(13)])
              : null,
          ]),
          el("span", { class: "plant-latin", style: "display:block" }, highlight(r.latin, nq)),
          alt && el("span", { class: "plant-index-alt" },
            [t("plants.alsoCalled"), ...highlight(alt, nq), t("plants.alsoCalledEnd")]),
          el("span", { class: "region-pills" }, r.regions.map((id) => {
            const meta = regionMetaOf(id);
            return el("span", { class: "region-pill", title: meta ? regionName(meta) : id },
              meta ? regionShort(meta) : id);
          })),
        ]),
        // Sorted by caterpillars, the count the list is ordered by. Absent for
        // a plant no region has counted yet.
        view.sort === "caterpillars" && r.hostLepCount !== null ? countTag(r.hostLepCount) : null,
      ]),
    ]);
  }

  // Redraw in place for a new view, and keep the address in step with it.
  function pick(to: RosterView): void {
    view = to;
    history.replaceState(null, "", plantsHref(input.value, view));
    run(input.value);
  }

  function run(q: string): void {
    const nq = norm(q);
    const pool = view.pioneers ? ROWS.filter((r) => PIONEER_IDS.has(r.slug)) : ROWS;
    const hits = nq ? pool.filter((r) => r.hay.includes(nq)) : pool;
    const matches = view.sort === "caterpillars"
      ? byCaterpillars(hits, (r) => r.common, getLang())
      : hits.slice().sort((a, b) => rank(a, nq) - rank(b, nq) || a.common.localeCompare(b.common, getLang()));
    count.textContent = nq
      ? t("plants.matchCount", { n: fmtNumber(matches.length), total: fmtNumber(pool.length), q: q.trim() })
      : t("plants.idle", { total: fmtNumber(pool.length), regions: fmtNumber(REGIONS.length) });
    // The panel's links carry the typed query too, so it's redrawn with it.
    controls.replaceChildren(rosterControls(view, (to) => plantsHref(q, to), pioneerCount, pick));
    clear(results);
    if (!matches.length) {
      const pages = nq ? otherPages(nq) : [];
      if (pages.length) {
        results.append(el("div", { class: "note info" }, [
          el("p", { style: "margin:0 0 0.3rem" }, t("plants.otherPages")),
          el("ul", { style: "margin:0;padding-left:1.2rem" }, pages.map((pg) =>
            el("li", {}, [el("a", { href: pg.href }, pg.name), ` · ${pg.kind}`]))),
        ]));
        return;
      }
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
    const grid = (rows: Row[]): HTMLElement =>
      el("ul", { class: "card-grid", style: "list-style:none;margin:0;padding:0" }, rows.map((r) => card(r, nq)));
    if (view.sort === "caterpillars") results.append(caterpillarLede());
    if (!view.grouped) {
      results.append(grid(matches));
      return;
    }
    for (const f of FORM_ORDER) {
      const inForm = matches.filter((r) => r.form === f);
      if (!inForm.length) continue;
      results.append(el("section", {}, [
        sectionTitle(formIcon(f), t(`form.${f}` as const), fmtNumber(inForm.length)),
        grid(inForm),
      ]));
    }
  }

  input.addEventListener("input", () => {
    const q = input.value;
    run(q);
    // Reflect the query into the URL for sharing, without triggering a re-route.
    // The path form (see `plantsHref`): writing the hash form here would leave
    // `…/plants/#/plants?q=oak` on a page that was itself opened by its path.
    history.replaceState(null, "", plantsHref(q, view));
  });

  main.append(
    el("h2", { class: "step-title" }, t("plants.title")),
    el("p", { class: "step-lede" }, t("plants.lede")),
    // Five ways in, as compact rows rather than paragraphs: the search below is
    // the page's job, so the side-doors name themselves and get out of the way.
    // They run in the order the questions arise — what am I holding, what do I
    // grow instead, what do I pull, will it cost me the vegetables, how do I
    // make more. The header has no room for them (see components/app-menu.ts).
    el("div", { class: "plant-doors" }, [
      door("#/lookalikes", lookalikeIcon(24), t("plants.door.lookalikes"), t("plants.door.lookalikesHint")),
      door("#/alternatives", alternativeIcon(24), t("plants.door.alternatives"), t("plants.door.alternativesHint")),
      door("#/invasives", invasiveIcon(24), t("plants.door.invasives"), t("plants.door.invasivesHint")),
      door("#/crops", cropsIcon(24), t("plants.door.crops"), t("plants.door.cropsHint")),
      door("#/planting", propagateIcon(24), t("plants.door.planting"), t("plants.door.plantingHint")),
    ]),
    el("div", { class: "field" }, [el("label", { for: "plant-q" }, t("plants.label")), input]),
    controls,
    count,
    results,
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("regions") }, t("plants.browseRegions")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.rankForSpot")),
    ]),
  );

  const initial = paramsFromUrl().get("q") ?? "";
  if (initial) input.value = initial;
  run(initial);
  queueMicrotask(() => input.focus());
}

/**
 * The plants with a page that isn't a native's — an invasive, an impostor, an
 * ornamental to swap — matching a search the native catalog came up empty on.
 * "Kudzu" or "butterfly bush" finds no native, but the app has the page that
 * answers it, and "nothing found" would hide it.
 */
function otherPages(nq: string): { name: string; href: string; kind: string }[] {
  const hit = (x: { common: string; latin: string }): boolean =>
    [x.common, x.latin, commonName(x)].some((n) => norm(n).includes(nq));
  const invasives = mappedInvasiveIds();
  const lookalikes = mappedLookalikeIds();
  const ornamentals = mappedOrnamentalIds();
  return [
    ...INVASIVES.filter((x) => invasives.has(x.id) && hit(x))
      .map((x) => ({ name: commonName(x), href: `#/invasives/${x.id}`, kind: t("plants.door.invasives") })),
    ...LOOKALIKES.filter((x) => lookalikes.has(x.id) && hit(x))
      .map((x) => ({ name: commonName(x), href: `#/lookalikes/${x.id}`, kind: t("plants.door.lookalikes") })),
    ...ORNAMENTALS.filter((x) => ornamentals.has(x.id) && hit(x))
      .map((x) => ({ name: commonName(x), href: `#/alternatives/${x.id}`, kind: t("plants.door.alternatives") })),
  ].slice(0, 6);
}
