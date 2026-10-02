// Several regions in one line, whatever the count.
//
// Up to two names fit a phone's line, so they show as they always did. Past
// two, the line keeps its one button and the names open in a small menu under
// it — the same menu for every job:
//
// - `regionLinks`, information: "📍 Native to: 4 regions ▾", each name a link.
//   A mouse opens it on hover; a finger on tap.
// - `regionSwitch`, which region's figures you're reading: the current one is
//   the button ("Atlantic France ▾"), the others are one tap inside it.
// - `regionPicker`, where to look for photos: "or a region ▾".
//
// Never a row that wraps into a second line, never one that scrolls sideways
// and hides what's past its edge.
import { el } from "../ui";
import { t, tn } from "../lib/i18n";

export interface RegionLink {
  name: string;
  href: string;
  title?: string;
}

/** How many names a line holds before it turns into a menu. */
export const INLINE_MAX = 2;

const hoverable = (): boolean =>
  typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Without the popover API (older browsers) every caller falls back to its
 *  inline form: longer, but nothing is out of reach. */
export const canPopover = (): boolean =>
  typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;

let seq = 0;

const caret = (): HTMLElement => el("span", { class: "region-caret", "aria-hidden": "true" }, "▾");

/**
 * A button and the menu it opens, as one node. The menu sits in the top layer
 * (light-dismiss and Escape come with `popover="auto"`), pinned to the
 * button and kept inside the page's 16px gutter.
 */
function menu(trigger: HTMLButtonElement, items: HTMLElement[], opts: { hover?: boolean } = {}): HTMLElement {
  const id = `region-pop-${++seq}`;
  const pop = el("div", { id, class: "region-pop", popover: "auto", role: "menu" }, [
    el("ul", {}, items.map((item) => {
      item.setAttribute("role", "menuitem");
      return el("li", { role: "none" }, [item]);
    })),
  ]);
  trigger.setAttribute("popovertarget", id);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");

  const place = (): void => {
    const r = trigger.getBoundingClientRect();
    const gutter = 16;
    const left = Math.max(gutter, Math.min(r.left, innerWidth - pop.offsetWidth - gutter));
    pop.style.left = `${left}px`;
    // Under the button when it fits, else above it; when neither side holds
    // the whole list, the roomier side does and the list scrolls inside
    // itself. Never over the button it came from.
    pop.style.maxHeight = "";
    const h = pop.offsetHeight;
    const roomBelow = innerHeight - 8 - (r.bottom + 6);
    const roomAbove = r.top - 6 - 8;
    if (h <= roomBelow || roomBelow >= roomAbove) {
      pop.style.top = `${r.bottom + 6}px`;
      if (h > roomBelow) pop.style.maxHeight = `${roomBelow}px`;
    } else {
      const shown = Math.min(h, roomAbove);
      pop.style.top = `${r.top - 6 - shown}px`;
      if (h > roomAbove) pop.style.maxHeight = `${roomAbove}px`;
    }
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
  // the pointer can cross the gap from the button to the list.
  if (opts.hover && hoverable()) {
    let timer = 0;
    const show = (): void => {
      clearTimeout(timer);
      if (!pop.matches(":popover-open")) pop.showPopover();
    };
    const hide = (): void => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (pop.matches(":popover-open")) pop.hidePopover();
      }, 200);
    };
    for (const node of [trigger, pop]) {
      node.addEventListener("mouseenter", show);
      node.addEventListener("mouseleave", hide);
    }
  }

  return el("span", { class: "region-menu" }, [trigger, pop]);
}

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

  const trigger = el("button", { type: "button", class: "region-more" }, [
    tn("region.count", links.length),
    " ",
    caret(),
  ]) as HTMLButtonElement;
  return el("span", { class: "region-links" }, [label, menu(trigger, links.map((l) => link(l)), { hover: true })]);
}

export interface RegionOption {
  name: string;
  href: string;
  current: boolean;
}

/**
 * Which region's figures you're reading. Two regions are two chips, side by
 * side, one tap to switch. Three or more: the current region is the button,
 * and the menu under it lists every region with the current one ticked.
 */
export function regionSwitch(lede: string, options: RegionOption[]): HTMLElement {
  const chip = (o: RegionOption): HTMLElement =>
    el("a", {
      class: o.current ? "region-chip region-chip-on" : "region-chip",
      href: o.href,
      ...(o.current ? { "aria-current": "true" } : {}),
    }, o.name);

  if (options.length <= INLINE_MAX || !canPopover()) {
    return el("div", { class: "region-switch" }, [
      el("span", { class: "region-switch-lede" }, lede),
      ...options.map(chip),
    ]);
  }

  const current = options.find((o) => o.current) ?? options[0];
  const trigger = el("button", { type: "button", class: "region-chip region-chip-on region-chip-menu" }, [
    current.name,
    " ",
    caret(),
  ]) as HTMLButtonElement;
  const items = options.map((o) =>
    el("a", { href: o.href, ...(o.current ? { "aria-current": "true", class: "region-pop-current" } : {}) }, o.name)
  );
  return el("div", { class: "region-switch region-switch-inline" }, [
    el("span", { class: "region-switch-lede" }, lede),
    menu(trigger, items),
  ]);
}

export interface RegionPlace {
  label: string;
  onPick: (btn: HTMLButtonElement) => void;
}

/**
 * "or <region>" beside the location controls. One region is its own button.
 * Two or more: "a region ▾", whose menu runs the lookup — and the button
 * itself carries the "Asking iNaturalist…" while it does.
 */
export function regionPicker(places: RegionPlace[], btnClass: string): HTMLElement[] {
  if (places.length < 2 || !canPopover()) {
    return places.map(({ label, onPick }) => {
      const btn = el("button", { type: "button", class: btnClass, onClick: () => onPick(btn) }, label) as HTMLButtonElement;
      return btn;
    });
  }
  const trigger = el("button", { type: "button", class: btnClass }, [
    t("nearby.aRegion"),
    " ",
    caret(),
  ]) as HTMLButtonElement;
  let pop: HTMLElement | null = null;
  const items = places.map(({ label, onPick }) =>
    el("button", {
      type: "button",
      onClick: () => {
        pop?.hidePopover();
        onPick(trigger);
      },
    }, label)
  );
  const node = menu(trigger, items);
  pop = node.querySelector(".region-pop");
  return [node];
}
