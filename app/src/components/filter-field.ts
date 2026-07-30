// Type-to-narrow filtering, shared by every list long enough to hunt through:
// a region's roster and its category pages, and the wildlife index. It filters
// the rows already on the page (no routing, no registry lookup) so nobody has
// to reach for Ctrl+F or bounce out to the search page just to find one entry
// in a 40-row list.
//
// The matching rules — and, more visibly, the way a match is *shown* — are the
// same ones the search page uses: every occurrence of what you typed is
// underlined in the brand color, so a row says why it's still on screen. That
// consistency is the reason this lives in one place; `highlight` and `norm` are
// exported for the search page to share rather than reimplement.
//
// It holds no words of its own. Every sentence it can say is passed in already
// translated (`opts.count`, `opts.fallback`), because a count line reads
// differently per language and per list — "3 of 23 plants match" and "3 of 43
// creatures match" are not one sentence with a noun slot in French.
import { el, clear } from "../ui";

/** Names are compared single-spaced, trimmed, and case-folded. */
export const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Wrap every occurrence of the (already-normalized) query in `<mark>`, so a
 * result shows *why* it matched. Case-insensitive; display names are
 * single-spaced, so lowercased indices line up with the original string.
 */
export function highlight(text: string, nq: string): (string | Node)[] {
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

/** One filterable card on the page. */
export interface FilterRow {
  /** Everything a match can hit — every name the row can be found by, normalized. */
  hay: string;
  node: HTMLElement;
  /** Re-draw the row's names with the query underlined ("" clears it). */
  mark(nq: string): void;
}

/** A group heading + its rows — hidden whole when no row in it matches. */
export interface FilterSection {
  node: HTMLElement;
  rows: FilterRow[];
}

export interface FilterOptions {
  /** The field's accessible name, translated. */
  label: string;
  /** Placeholder text, translated. */
  placeholder: string;
  /** The count line: "3 of 23 plants match “oak”." */
  count(shown: number, total: number, query: string): string;
  /** What to say — and where to send someone — when nothing here matches. */
  fallback(query: string): (string | Node)[];
}

export function filterField(
  rows: FilterRow[],
  sections: FilterSection[],
  opts: FilterOptions
): HTMLElement {
  const input = el("input", {
    type: "search",
    "aria-label": opts.label,
    placeholder: opts.placeholder,
    autocomplete: "off",
    autocapitalize: "none",
    spellcheck: false,
    // Full width on a phone, but a text field the width of a laptop is a
    // target with nothing in it — cap it once the page goes wide.
    style: "width:100%;max-width:24rem",
  }) as HTMLInputElement;
  const status = el("p", { role: "status", class: "coords", style: "margin:0.35rem 0 0" });

  // Rows carry their own inline display (the plant rows are flex, the wildlife
  // cards take it from a class), so remember each one rather than assuming a
  // value to restore them to.
  const display = rows.map((r) => r.node.style.display);

  const apply = (): void => {
    const nq = norm(input.value);
    let shown = 0;
    rows.forEach((r, i) => {
      const hit = !nq || r.hay.includes(nq);
      r.node.style.display = hit ? display[i] : "none";
      r.mark(hit ? nq : "");
      if (hit) shown++;
    });
    for (const s of sections) {
      s.node.style.display = s.rows.some((r) => r.node.style.display !== "none") ? "" : "none";
    }
    clear(status);
    if (!nq) return;
    const q = input.value.trim();
    if (shown) status.append(opts.count(shown, rows.length, q));
    else status.append(...opts.fallback(q));
  };
  input.addEventListener("input", apply);

  return el("div", { style: "margin:0 0 0.6rem" }, [input, status]);
}
