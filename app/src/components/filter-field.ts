// Type-to-narrow filtering, shared by every list long enough to hunt through:
// a region's roster and its category pages, the wildlife index, and the ranked
// picks for a spot. Nobody should have to reach for Ctrl+F or bounce out to the
// search page just to find one entry in a 40-row list.
//
// Two shapes, one field. `filterField` hides rows already on the page — right
// when the page holds every candidate. `filterBox` hands the query back to the
// caller instead, for the ranked list, which has to re-rank rather than hide.
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

export interface FilterBoxOptions {
  /** The field's accessible name, translated. */
  label: string;
  /** Placeholder text, translated. */
  placeholder: string;
  /**
   * Runs on every keystroke, with the query both normalized (for matching) and
   * trimmed as typed (for quoting back). Filter, redraw, then `say()` what the
   * line under the field should read.
   */
  onInput(nq: string, typed: string): void;
}

export interface FilterBox {
  node: HTMLElement;
  /**
   * Set the line under the field — call it after *any* redraw, not only after
   * a keystroke. On the ranked list a slider can change what a standing query
   * matches, and a count line that only updates when you type would sit there
   * claiming the old number.
   */
  say(parts: (string | Node)[]): void;
}

/**
 * The field and the line under it, with the *caller* doing the filtering.
 *
 * `filterField` below hides rows already on the page, which is right when the
 * page holds every candidate. The ranked list doesn't work that way: it ranks,
 * then shows the top 25, so a query has to reach the ranking — narrowing only
 * what's on screen would quietly hide the oak sitting at rank 30. Both share
 * this box, so the field, its spacing, and the sentence's place stay identical
 * wherever you meet them.
 */
export function filterBox(opts: FilterBoxOptions): FilterBox {
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

  const say = (parts: (string | Node)[]): void => {
    clear(status);
    if (parts.length) status.append(...parts);
  };
  input.addEventListener("input", () => opts.onInput(norm(input.value), input.value.trim()));

  return { node: el("div", { style: "margin:0 0 0.6rem" }, [input, status]), say };
}

export function filterField(
  rows: FilterRow[],
  sections: FilterSection[],
  opts: FilterOptions
): HTMLElement {
  // Rows carry their own inline display (the plant rows are flex, the wildlife
  // cards take it from a class), so remember each one rather than assuming a
  // value to restore them to.
  const display = rows.map((r) => r.node.style.display);

  const box = filterBox({
    label: opts.label,
    placeholder: opts.placeholder,
    onInput(nq, typed) {
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
      // Nothing typed, nothing to say: the list is all there, unmarked.
      if (!nq) return box.say([]);
      box.say(shown ? [opts.count(shown, rows.length, typed)] : opts.fallback(typed));
    },
  });
  return box.node;
}
