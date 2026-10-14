// A short explanation for a label on a plant card ("Essential", "Water at
// first"), shown beside it: on hover with a mouse, on a tap on a phone.
//
// One floating note for the whole page, moved to whichever label asked. It
// closes on a tap anywhere else, on Esc, or when the pointer leaves; it scrolls
// with the page, so a scroll leaves it where it belongs.
// It ends with a link to the full meaning, for whoever wants more. Not a
// folding box: the label stays where it is and the page doesn't reflow.
import { el } from "../ui";

let tip: HTMLElement | null = null;
let owner: HTMLElement | null = null;
// How the open note was asked for. A click right after a hover is the same
// request, so it keeps the note open; only a second tap closes it.
let openedBy: "hover" | "tap" | null = null;

function ensureTip(): HTMLElement {
  if (tip) return tip;
  tip = el("div", { class: "badge-tip", role: "tooltip", id: "badge-tip", hidden: true });
  document.body.append(tip);
  const close = (): void => hideTip();
  document.addEventListener("pointerdown", (e) => {
    if (!tip || tip.hidden) return;
    const target = e.target as Node;
    if (tip.contains(target) || owner?.contains(target)) return;
    close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  window.addEventListener("hashchange", close);
  return tip;
}

export function hideTip(): void {
  if (!tip || tip.hidden) return;
  tip.hidden = true;
  owner?.setAttribute("aria-expanded", "false");
  owner = null;
  openedBy = null;
}

function showTip(badge: HTMLElement, text: string, more: { href: string; label: string }): void {
  const t = ensureTip();
  owner?.setAttribute("aria-expanded", "false");
  owner = badge;
  badge.setAttribute("aria-expanded", "true");
  t.replaceChildren(el("p", {}, text), el("a", { href: more.href }, more.label));
  t.hidden = false;
  // Under the label, kept inside the screen's edges.
  const r = badge.getBoundingClientRect();
  const w = Math.min(t.offsetWidth, window.innerWidth - 16);
  const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
  t.style.left = `${left + window.scrollX}px`;
  t.style.top = `${r.bottom + window.scrollY + 6}px`;
}

/** Make `badge` (a <button>) explain itself with `text`. */
export function withTip(badge: HTMLElement, text: string, more: { href: string; label: string }): HTMLElement {
  badge.setAttribute("aria-expanded", "false");
  badge.setAttribute("aria-controls", "badge-tip");
  badge.addEventListener("click", (e) => {
    // The card around it is one big link; this tap is for the label.
    e.preventDefault();
    e.stopPropagation();
    if (owner === badge && openedBy === "tap") hideTip();
    else { showTip(badge, text, more); openedBy = "tap"; }
  });
  badge.addEventListener("pointerenter", (e) => {
    if ((e as PointerEvent).pointerType === "mouse" && owner !== badge) {
      showTip(badge, text, more);
      openedBy = "hover";
    }
  });
  badge.addEventListener("pointerleave", (e) => {
    if ((e as PointerEvent).pointerType !== "mouse") return;
    // Leave time to move onto the note itself (to reach its link).
    window.setTimeout(() => {
      if (owner === badge && openedBy === "hover" && !badge.matches(":hover") && !tip?.matches(":hover")) hideTip();
    }, 250);
  });
  return badge;
}
