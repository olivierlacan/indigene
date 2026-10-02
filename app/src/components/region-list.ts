// Two ways a page names several regions, one for each job.
//
// `regionLinks` is information: "📍 Native to: A · B". Two names read in a
// glance; four wrap a phone's top row into three lines of underlines before
// the plant's own name. So past two the list becomes a count — "4 regions ▾" —
// and the names open in a small popover beside it: on hover with a mouse, on
// tap with a finger. Every name is still a link, one tap further away.
//
// `scrollFade` is for actions: the region switches stay one tap each, on one
// line that scrolls sideways, and the edge that hides a chip fades so the row
// says there's more of it.
import { el } from "../ui";
import { tn } from "../lib/i18n";

export interface RegionLink {
  name: string;
  href: string;
  title?: string;
}

/** How many names a line holds before it turns into a count. */
const INLINE_MAX = 2;

const hoverable = (): boolean =>
  typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches;

const canPopover = (): boolean =>
  typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;

let seq = 0;

/**
 * "Native to: A · B", or "Native to: 4 regions ▾" with the names a tap away.
 * `linkClass` lets a caller keep its own look for the inline names (the
 * wildlife page's pills).
 */
export function regionLinks(label: Node | string, links: RegionLink[], linkClass?: string): HTMLElement {
  const link = (l: RegionLink, cls?: string): HTMLElement =>
    el("a", { class: cls, href: l.href, title: l.title }, l.name);

  if (links.length <= INLINE_MAX || !canPopover()) {
    return el("span", { class: "region-links" }, [
      label,
      ...links.flatMap((l, i) => [i > 0 && !linkClass ? " · " : null, link(l, linkClass)]),
    ]);
  }

  const id = `region-pop-${++seq}`;
  const pop = el("div", { id, class: "region-pop", popover: "auto", role: "menu" }, [
    el("ul", {}, links.map((l) => el("li", { role: "none" }, [
      Object.assign(link(l), { role: "menuitem" }),
    ]))),
  ]);
  const trigger = el("button", {
    type: "button",
    class: "region-more",
    popovertarget: id,
    "aria-haspopup": "menu",
    "aria-expanded": "false",
  }, [tn("region.count", links.length), el("span", { "aria-hidden": "true" }, " ▾")]) as HTMLButtonElement;

  // Pinned under the trigger, inside the page's 16px gutter. The popover sits
  // in the top layer, so it's placed against the viewport, not the card.
  const place = (): void => {
    const r = trigger.getBoundingClientRect();
    const gutter = 16;
    const w = pop.offsetWidth;
    const left = Math.max(gutter, Math.min(r.left, innerWidth - w - gutter));
    pop.style.left = `${left}px`;
    pop.style.top = `${r.bottom + 6}px`;
  };
  pop.addEventListener("toggle", (e) => {
    const open = (e as ToggleEvent).newState === "open";
    trigger.setAttribute("aria-expanded", String(open));
    if (open) {
      place();
      addEventListener("scroll", place, { passive: true });
      addEventListener("resize", place);
    } else {
      removeEventListener("scroll", place);
      removeEventListener("resize", place);
    }
  });

  // With a mouse, hovering opens it and leaving closes it — after a beat, so
  // the pointer can cross the gap from the trigger to the list.
  if (hoverable()) {
    let timer = 0;
    const open = (): void => {
      clearTimeout(timer);
      if (!pop.matches(":popover-open")) pop.showPopover();
    };
    const close = (): void => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (pop.matches(":popover-open")) pop.hidePopover();
      }, 200);
    };
    for (const node of [trigger, pop]) {
      node.addEventListener("mouseenter", open);
      node.addEventListener("mouseleave", close);
    }
  }

  return el("span", { class: "region-links" }, [label, trigger, pop]);
}

/**
 * Fades whichever edge of a sideways-scrolling row has chips hidden past it,
 * and brings the current chip (`[aria-current]`) into view.
 */
export function scrollFade(row: HTMLElement): HTMLElement {
  row.classList.add("scroll-fade");
  const update = (): void => {
    const max = row.scrollWidth - row.clientWidth;
    row.classList.toggle("fade-start", row.scrollLeft > 2);
    row.classList.toggle("fade-end", row.scrollLeft < max - 2);
  };
  row.addEventListener("scroll", update, { passive: true });
  if (typeof ResizeObserver === "function") new ResizeObserver(update).observe(row);
  requestAnimationFrame(() => {
    const current = row.querySelector<HTMLElement>("[aria-current]");
    if (current && current.offsetLeft + current.offsetWidth > row.clientWidth) {
      row.scrollLeft = current.offsetLeft - 8; // the row is `position: relative`
    }
    update();
  });
  return row;
}
