// A registry-backed, plant-first search: type any name — common or scientific —
// and open that plant's page. It searches the native-plant registry (the
// identity layer), so a name resolves here the same way it does everywhere in
// the app: over the same common names, scientific names, and aliases. The query
// is reflected into the URL (#/search/<query>) so a search is shareable.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGISTRY } from "../lib/registry";
import { REGIONS } from "../lib/plants";
import { silhouetteFor } from "../components/plant-card";
import type { PlantForm } from "../types";
import { t, fmtNumber, getLang } from "../lib/i18n";
import { regionName, searchAliases, localName } from "../lib/names";

const regionLabel = (id: string): string => {
  const r = REGIONS.find((x) => x.meta.id === id);
  return r ? regionName(r.meta) : id;
};
const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");

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

// Wrap every occurrence of the (already-normalized) query in <mark>, so a
// result shows *why* it matched. Case-insensitive; display names are
// single-spaced, so lowercased indices line up with the original string.
function highlight(text: string, nq: string): (string | Node)[] {
  if (!nq) return [text];
  const lower = text.toLowerCase();
  const out: (string | Node)[] = [];
  let i = 0;
  for (let hit = lower.indexOf(nq); hit !== -1; hit = lower.indexOf(nq, i)) {
    if (hit > i) out.push(text.slice(i, hit));
    out.push(el("mark", {}, text.slice(hit, hit + nq.length)));
    i = hit + nq.length;
  }
  if (i < text.length) out.push(text.slice(i));
  return out;
}

export function renderSearch(main: HTMLElement, param?: string): void {
  clear(main);
  const ROWS = buildRows();

  const input = el("input", {
    type: "search",
    id: "plant-q",
    autocomplete: "off",
    autocapitalize: "none",
    spellcheck: false,
    placeholder: t("search.placeholder"),
    style: "width:100%",
  }) as HTMLInputElement;
  const count = el("p", { id: "search-count", class: "coords", style: "margin:0.5rem 0 0.8rem" }, "");
  const results = el("div", { "aria-live": "polite" });

  function rank(r: Row, nq: string): number {
    if (!nq) return 0;
    return norm(r.common).startsWith(nq) || norm(r.latin).startsWith(nq) ? 0 : 1;
  }

  function row(r: Row, nq: string): HTMLElement {
    // When neither displayed name contains the query, the match came from a
    // hidden name (a second common name, an alias) — show that name, so the
    // result doesn't look like a false positive.
    const alt = nq && !norm(r.common).includes(nq) && !norm(r.latin).includes(nq)
      ? r.alts.find((a) => norm(a).includes(nq))
      : undefined;
    return el("li", {}, [
      el("a", {
        href: `#/plants/${r.slug}`,
        class: "card search-result",
        style: "display:flex;gap:0.7rem;align-items:center;text-decoration:none;color:inherit;margin-bottom:0.5rem",
      }, [
        el("span", { class: "plant-photo", "aria-hidden": "true", style: "flex:none" }, [silhouetteFor(r.form)]),
        el("span", { style: "min-width:0" }, [
          el("span", { class: "plant-name", style: "display:block;font-weight:700" }, highlight(r.common, nq)),
          el("span", { class: "plant-latin", style: "display:block" }, highlight(r.latin, nq)),
          alt && el("span", { style: "display:block;font-size:0.8rem;color:var(--ink-soft)" },
            [t("search.alsoCalled"), ...highlight(alt, nq), t("search.alsoCalledEnd")]),
          el("span", { style: "display:block;font-size:0.8rem;color:var(--ink-soft)" },
            r.regions.map(regionLabel).join(" · ")),
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
      ? t("search.matchCount", { n: fmtNumber(matches.length), total: fmtNumber(ROWS.length), q: q.trim() })
      : t("search.idle", { total: fmtNumber(ROWS.length), regions: fmtNumber(REGIONS.length) });
    clear(results);
    if (!matches.length) {
      results.append(
        el("div", { class: "note warn" }, [
          t("search.noneLead", { q: q.trim() }),
          el("a", { href: "#/plants" }, t("search.noneLink")),
          t("search.noneEnd"),
        ]),
      );
      return;
    }
    results.append(el("ul", { style: "list-style:none;margin:0;padding:0" }, matches.map((r) => row(r, nq))));
  }

  input.addEventListener("input", () => {
    const q = input.value;
    run(q);
    // Reflect the query into the URL for sharing, without triggering a re-route.
    history.replaceState(null, "", q.trim() ? `#/search/${encodeURIComponent(q.trim())}` : "#/search");
  });

  main.append(
    el("h2", { class: "step-title" }, t("search.title")),
    el("p", { class: "step-lede" }, t("search.lede")),
    el("div", { class: "field" }, [el("label", { for: "plant-q" }, t("search.label")), input]),
    count,
    results,
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("search.browseInstead")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ]),
  );

  const initial = param ?? ""; // the router already URL-decoded the param
  if (initial) input.value = initial;
  run(initial);
  queueMicrotask(() => input.focus());
}
