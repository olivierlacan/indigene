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

const regionName = new Map(REGIONS.map((r) => [r.meta.id, r.meta.name] as const));
const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");

type Row = { slug: string; common: string; latin: string; form: PlantForm; regions: string[]; hay: string };

// Built once from the registry: one searchable row per taxon. `hay` is every
// name (common, scientific, alias) normalized, so a substring match finds a
// plant by any of the ways someone might type it.
const ROWS: Row[] = REGISTRY.map((e) => ({
  slug: e.identifiers.indigene ?? "",
  common: e.commonNames[0] ?? e.scientificName,
  latin: e.scientificName,
  form: e.form,
  regions: e.regions,
  hay: norm([...e.commonNames, e.scientificName, ...e.aliases].join(" ")),
}))
  .filter((r) => r.slug)
  .sort((a, b) => a.common.localeCompare(b.common));

export function renderSearch(main: HTMLElement, param?: string): void {
  clear(main);

  const input = el("input", {
    type: "search",
    id: "plant-q",
    autocomplete: "off",
    autocapitalize: "none",
    spellcheck: false,
    placeholder: "e.g. milkweed, oak, or Asclepias",
    style: "width:100%",
  }) as HTMLInputElement;
  const count = el("p", { id: "search-count", class: "coords", style: "margin:0.5rem 0 0.8rem" }, "");
  const results = el("div", { "aria-live": "polite" });

  function rank(r: Row, nq: string): number {
    if (!nq) return 0;
    return norm(r.common).startsWith(nq) || norm(r.latin).startsWith(nq) ? 0 : 1;
  }

  function row(r: Row): HTMLElement {
    return el("li", {}, [
      el("a", {
        href: `#/plants/${r.slug}`,
        class: "card search-result",
        style: "display:flex;gap:0.7rem;align-items:center;text-decoration:none;color:inherit;margin-bottom:0.5rem",
      }, [
        el("span", { class: "plant-photo", "aria-hidden": "true", style: "flex:none" }, [silhouetteFor(r.form)]),
        el("span", { style: "min-width:0" }, [
          el("span", { class: "plant-name", style: "display:block;font-weight:700" }, r.common),
          el("span", { class: "plant-latin", style: "display:block" }, r.latin),
          el("span", { style: "display:block;font-size:0.8rem;color:var(--ink-soft)" },
            r.regions.map((id) => regionName.get(id) ?? id).join(" · ")),
        ]),
      ]),
    ]);
  }

  function run(q: string): void {
    const nq = norm(q);
    const matches = (nq ? ROWS.filter((r) => r.hay.includes(nq)) : ROWS)
      .slice()
      .sort((a, b) => rank(a, nq) - rank(b, nq) || a.common.localeCompare(b.common));
    count.textContent = nq
      ? `${matches.length} of ${ROWS.length} native plants match “${q.trim()}”.`
      : `Search ${ROWS.length} native plants across ${REGIONS.length} regions.`;
    clear(results);
    if (!matches.length) {
      results.append(
        el("div", { class: "note warn" }, [
          `No plant in Indigene's lists matches “${q.trim()}”. The lists are curated per region, so they grow carefully — `,
          el("a", { href: "#/plants" }, "browse the natives we know"),
          ".",
        ]),
      );
      return;
    }
    results.append(el("ul", { style: "list-style:none;margin:0;padding:0" }, matches.map(row)));
  }

  input.addEventListener("input", () => {
    const q = input.value;
    run(q);
    // Reflect the query into the URL for sharing, without triggering a re-route.
    history.replaceState(null, "", q.trim() ? `#/search/${encodeURIComponent(q.trim())}` : "#/search");
  });

  main.append(
    el("h2", { class: "step-title" }, "Search native plants"),
    el("p", { class: "step-lede" },
      "Type a plant's name — common or scientific — and open its page. It searches Indigene's native-plant registry, so a name resolves the same way here as everywhere in the app."),
    el("div", { class: "field" }, [el("label", { for: "plant-q" }, "Plant name"), input]),
    count,
    results,
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, "Browse instead"),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
    ]),
  );

  const initial = param ?? ""; // the router already URL-decoded the param
  if (initial) input.value = initial;
  run(initial);
  queueMicrotask(() => input.focus());
}
