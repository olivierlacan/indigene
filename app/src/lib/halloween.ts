// The Halloween look: a dark, orange theme with a ghost in the logo, from
// mid-October until the end of the 31st, on the reader's own clock.
//
// The question is *answered* in a script tag at the top of `index.html`, like
// the Home Screen one (`lib/standalone.ts`): the colours have to be right on
// the first paint, before a module has run, or every page would flash green
// and then turn orange. That script is a trimmed copy of `inSeason()` and
// `optedOut()` below and stamps `data-halloween` (and `data-theme="dark"`, so
// every dark-only rule follows) on `<html>`. Everything else reads it back from
// there. `halloween.test.ts` holds the two copies to the same dates and key.
//
// It turns itself off on 1 November with nothing to undo. The one thing kept
// is a reader's "no thanks" (Settings → Halloween), in localStorage because
// the head script must read it synchronously. It only ever holds "off".

export const HALLOWEEN_KEY = "indigene:halloween";
/** October, as `Date.getMonth()` counts it. */
export const HALLOWEEN_MONTH = 9;
/** The first day of the look. It runs to the end of the month. */
export const HALLOWEEN_FROM = 15;

/** Is `now` inside the window, on the reader's own calendar? */
export function inSeason(now: Date = new Date()): boolean {
  return now.getMonth() === HALLOWEEN_MONTH && now.getDate() >= HALLOWEEN_FROM;
}

/** Has the reader turned the look off? */
export function optedOut(): boolean {
  try {
    return localStorage.getItem(HALLOWEEN_KEY) === "off";
  } catch {
    return false;
  }
}

/** Is the look on, on this page, right now? */
export function halloweenOn(): boolean {
  return document.documentElement.hasAttribute("data-halloween");
}

/** The header's colour, per look, for the strip iOS paints above an installed
 *  app. Keep in step with `--brand` in styles.css and the head script. */
const THEME_COLOR = "#ff8a1f";

/** Turn the look on or off, remember the choice, and repaint at once. */
export function setHalloween(on: boolean): void {
  try {
    if (on) localStorage.removeItem(HALLOWEEN_KEY);
    else localStorage.setItem(HALLOWEEN_KEY, "off");
  } catch {
    /* a browser that refuses storage just keeps the choice for this page */
  }
  const root = document.documentElement;
  if (on && inSeason()) {
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
