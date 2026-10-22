// The spooky theme: a dark, orange theme with a ghost in the logo. On by
// default for the two weeks before Halloween (17 to 31 October, on the
// reader's own clock); opt-in the rest of the year.
//
// The question is *answered* in a script tag at the top of `index.html`, like
// the Home Screen one (`lib/standalone.ts`): the colours have to be right on
// the first paint, before a module has run, or every page would flash green
// and then turn orange. That script is a trimmed copy of `wanted()` below and
// stamps `data-halloween` (and `data-theme="dark"`, so every dark-only rule
// follows) on `<html>`. Everything else reads it back from there.
// `halloween.test.ts` holds the two copies to the same dates and key.
//
// The reader's choice (Settings → Spooky theme, or `?spooky=on|off` in the
// address) is kept in localStorage, because the head script must read it
// synchronously. "on" keeps the theme all year, "off" skips the season, and
// no entry follows the calendar.

export const HALLOWEEN_KEY = "indigene:halloween";
/** October, as `Date.getMonth()` counts it. */
export const HALLOWEEN_MONTH = 9;
/** The first day it's on by default: two weeks before the 31st. */
export const HALLOWEEN_FROM = 17;

/** Is `now` inside the default-on window, on the reader's own calendar? */
export function inSeason(now: Date = new Date()): boolean {
  return now.getMonth() === HALLOWEEN_MONTH && now.getDate() >= HALLOWEEN_FROM;
}

/** The reader's saved choice, if any. */
function choice(): "on" | "off" | null {
  try {
    const v = localStorage.getItem(HALLOWEEN_KEY);
    return v === "on" || v === "off" ? v : null;
  } catch {
    return null;
  }
}

/** Should the theme be on: the reader's choice, else the calendar. */
export function wanted(now: Date = new Date(), pick = choice()): boolean {
  return pick ? pick === "on" : inSeason(now);
}

/** Is the look on, on this page, right now? */
export function halloweenOn(): boolean {
  return document.documentElement.hasAttribute("data-halloween");
}

/** The header's colour, per look, for the strip iOS paints above an installed
 *  app. Keep in step with `--brand` in styles.css and the head script. */
const THEME_COLOR = "#ff8a1f";

/** Turn the theme on or off, remember the choice (past the season too), and
 *  repaint at once. */
export function setHalloween(on: boolean): void {
  try {
    localStorage.setItem(HALLOWEEN_KEY, on ? "on" : "off");
  } catch {
    /* a browser that refuses storage just keeps the choice for this page */
  }
  const root = document.documentElement;
  if (on) {
    root.dataset.halloween = "";
    root.dataset.theme = "dark";
  } else {
    delete root.dataset.halloween;
    if (root.dataset.theme === "dark") delete root.dataset.theme;
  }
  paintHalloween();
}

/** Bring the parts the stylesheet can't reach in line with the look: the
 *  browser's theme colour and the favicon. Run on boot and on every change. */
export function paintHalloween(): void {
  const on = halloweenOn();
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.dataset.usual ??= meta.content;
    meta.content = on ? THEME_COLOR : meta.dataset.usual;
  }
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
  if (icon) {
    icon.dataset.usual ??= icon.getAttribute("href") ?? "";
    icon.setAttribute("href", on ? icon.dataset.usual.replace(/favicon\.svg$/, "favicon-halloween.svg") : icon.dataset.usual);
  }
}
