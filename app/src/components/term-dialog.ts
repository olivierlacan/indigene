// A tappable term chip + the small dialog it opens — the same just-in-time
// education idiom the stat grid uses, so a one-word tag ("Host", "Essential")
// can stay short while its meaning is one tap away. One shared <dialog> lives on
// <body> and is reused for every chip on the page (a closed <dialog> is inert).
//
// Chips are real <button>s, so they must NOT be nested inside an <a>. Callers
// that used to wrap a whole card in a link expose a plain link (e.g. the plant
// name) instead, leaving these chips free to be buttons.
import { el } from "../ui";

export interface TermInfo {
  /** Emoji fallback, used when no `glyph` is supplied. */
  icon: string;
  /** A monochrome SVG glyph (preferred over `icon` — the tag/dialog style). */
  glyph?: () => SVGElement;
  /** The short chip text and the dialog title. */
  term: string;
  /** Plain-language meaning, shown in the dialog. */
  plain: string;
  /** Optional extra dialog nodes (a source line, a "learn more" link). */
  extra?: (Node | string)[];
}

// The icon as DOM: the SVG glyph when given, else the emoji as text.
function iconNode(info: TermInfo, trailingSpace: boolean): Node {
  if (info.glyph) return info.glyph();
  return document.createTextNode(`${info.icon}${trailingSpace ? " " : ""}`);
}

let shared: HTMLDialogElement | null = null;

function dialog(): HTMLDialogElement {
  if (shared && document.body.contains(shared)) return shared;
  shared = el("dialog", { class: "stat-dialog term-dialog" }) as HTMLDialogElement;
  shared.addEventListener("click", (e) => {
    if (e.target === shared) shared!.close(); // tap the backdrop to dismiss
  });
  document.body.append(shared);
  return shared;
}

export function openTermDialog(info: TermInfo): void {
  const d = dialog();
  d.replaceChildren(
    el("h3", { class: "term-dialog-title", style: "margin:0 0 0.5rem" }, [
      el("span", { class: "term-dialog-glyph", "aria-hidden": "true" }, [iconNode(info, true)]),
      info.term,
    ]),
    el("p", { style: "margin:0 0 0.9rem" }, info.plain),
    ...(info.extra ?? []),
    el("button", { class: "btn btn-secondary btn-block", onClick: () => d.close() }, "Got it")
  );
  d.showModal();
}

/**
 * A chip that explains itself on tap. `variant` picks the color: "host" (green),
 * "sole" (gold, make-or-break), or "" (neutral). Screen readers get the term
 * plus a hint that it's tappable.
 */
export function termTag(info: TermInfo, variant = ""): HTMLButtonElement {
  return el("button", {
    type: "button",
    class: `tag${variant ? ` tag-${variant}` : ""}`,
    "aria-haspopup": "dialog",
    "aria-label": `${info.term}. Tap to learn what this means.`,
    onClick: (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      openTermDialog(info);
    },
  }, [
    el("span", { class: "tag-glyph", "aria-hidden": "true" }, [iconNode(info, false)]),
    el("span", { class: "tag-label" }, info.term),
  ]) as HTMLButtonElement;
}
