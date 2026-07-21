// The header's Saved-locations menu. Saved spots used to be a third top-level
// nav tab; on a phone that pushed the header past its width. Now it's a compact
// button ("🔖 Saved") that drops down the actual saved locations — a quick jump
// back to a spot without leaving for the full Saved page (which stays, for
// managing and deleting).
//
// A plain button + panel (not <details>) so there's no UA disclosure marker to
// fight and we control open/close: refresh on open, close on outside-click, on
// Escape, on selection, and on navigation (the router calls closeSavedMenu).
import { el } from "../ui";
import { listSpots } from "../db";
import { openSavedSpot } from "../state";

const MAX_IN_MENU = 6;

let btn: HTMLButtonElement | null = null;
let panel: HTMLElement | null = null;

export function initSavedMenu(): void {
  btn = document.querySelector<HTMLButtonElement>("#saved-menu .nav-menu-btn");
  panel = document.getElementById("saved-menu-panel");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    isOpen() ? closeSavedMenu() : openMenu();
  });

  // Click outside the menu closes it.
  document.addEventListener("click", (e) => {
    const menu = document.getElementById("saved-menu");
    if (isOpen() && menu && !menu.contains(e.target as Node)) closeSavedMenu();
  });

  // Escape closes and returns focus to the button.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      closeSavedMenu();
      btn?.focus();
    }
  });
}

function isOpen(): boolean {
  return btn?.getAttribute("aria-expanded") === "true";
}

function openMenu(): void {
  if (!btn || !panel) return;
  btn.setAttribute("aria-expanded", "true");
  panel.hidden = false;
  void populate(panel);
}

/** Close the menu if it's open — also called by the router on every navigation. */
export function closeSavedMenu(): void {
  if (!btn || !panel) return;
  btn.setAttribute("aria-expanded", "false");
  panel.hidden = true;
}

async function populate(target: HTMLElement): Promise<void> {
  target.replaceChildren(el("p", { class: "nav-menu-status" }, "Loading…"));
  const spots = await listSpots().catch(() => null);
  if (target.hidden) return; // closed again before the load finished

  if (spots === null) {
    target.replaceChildren(el("p", { class: "nav-menu-status" }, "Couldn't load saved spots."));
    return;
  }
  if (!spots.length) {
    target.replaceChildren(
      el("p", { class: "nav-menu-status" }, "No saved spots yet."),
      el("a", { href: "#/location", role: "menuitem", class: "nav-menu-all" }, "📍 Find a spot to save"),
    );
    return;
  }

  const items = spots.slice(0, MAX_IN_MENU).map((s) =>
    el("button", {
      type: "button",
      role: "menuitem",
      class: "nav-menu-item",
      onClick: () => {
        closeSavedMenu();
        openSavedSpot(s);
      },
    }, [
      el("span", { class: "nav-menu-item-label" }, s.label),
      el("span", { class: "nav-menu-item-sub" }, `${s.lat.toFixed(3)}, ${s.lon.toFixed(3)}`),
    ])
  );

  target.replaceChildren(
    ...items,
    el("a", { href: "#/saved", role: "menuitem", class: "nav-menu-all" },
      spots.length > MAX_IN_MENU ? `See all ${spots.length} saved →` : "Manage saved →"),
  );
}
