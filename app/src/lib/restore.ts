// Coming back to a tab that has been away.
//
// A phone with a lot of tabs open eventually needs the memory one of them is
// sitting on, so Safari puts the page down and picks it back up when you
// return. Most of the time you can't tell. Sometimes you can: the markup comes
// back, the stylesheet comes back, and the custom properties declared on
// `:root` — the whole palette — do not.
//
// What that looks like is worth spelling out, because it doesn't look like a
// missing stylesheet. Every length in styles.css is written literally, so the
// page keeps its layout, its type, its spacing and its rounded corners exactly
// as they were. Every colour goes through `var(--…)`, and an undefined custom
// property makes the declaration invalid: the header's green falls back to
// nothing and shows the browser's canvas, the primary button loses its fill,
// the notes lose their wash, the links lose their blue. The page looks like
// itself with the colour poured out of it — and pulling to reload brings it
// all back, because a reload builds the style tree again from scratch.
//
// Nothing in the app writes those properties. They are declared once, at the
// top of the stylesheet, and read everywhere; there is no state here to get
// wrong. So this file doesn't fix a bug of ours — it notices the damage on the
// way back in and undoes it, doing for the reader what they'd otherwise have
// to work out for themselves.

/** Any custom property `:root` declares would do; this is the one whose
 *  absence is most obvious on screen. */
const SENTINEL = "--brand";

/** Set for the rest of the session once a rebuild wasn't enough and the page
 *  was reloaded. A page that comes back broken from *that* is beyond us, and
 *  reloading it again would be a loop the reader can't get out of. */
const RELOADED_KEY = "indigene:palette-reload";

/**
 * Is the stylesheet applied, but its palette gone?
 *
 * Both halves matter. An empty palette on its own also describes a page whose
 * CSS simply never arrived — a different failure, with a different shape on
 * screen (no layout at all), and one that rebuilding the style tree can't mend.
 * The sticky header is the proof that the sheet is here: it's in the shell
 * markup on every page, and nothing but styles.css makes it stick.
 */
function paletteLost(): boolean {
  const root = document.documentElement;
  if (getComputedStyle(root).getPropertyValue(SENTINEL).trim() !== "") return false;
  const header = document.querySelector(".app-header");
  return !!header && getComputedStyle(header).position === "sticky";
}

/**
 * Rebuild the style tree from the sheets already on the page: swap each linked
 * stylesheet for a fresh copy of itself.
 *
 * A new `<link>` to the same address is a new sheet to parse, which is the part
 * that's missing — the file itself comes from the browser's own cache, so this
 * costs no network and works offline. Nothing flashes: a pending stylesheet
 * holds the paint until it's ready.
 */
function rebuildStyles(): void {
  document
    .querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
    .forEach((link) => link.replaceWith(link.cloneNode() as HTMLLinkElement));
}

function reloadedAlready(): boolean {
  try {
    return sessionStorage.getItem(RELOADED_KEY) !== null;
  } catch {
    // Storage blocked (a locked-down browser, private mode in some versions).
    // Treat that as "already reloaded": one repair attempt, no loop.
    return true;
  }
}

function markReloaded(): void {
  try {
    sessionStorage.setItem(RELOADED_KEY, "1");
  } catch {
    /* nothing to remember with — see reloadedAlready() */
  }
}

function forgetReload(): void {
  try {
    sessionStorage.removeItem(RELOADED_KEY);
  } catch {
    /* nothing to forget */
  }
}

let repairing = false;

function check(): void {
  if (repairing) return;
  if (!paletteLost()) {
    // Healthy: whatever went wrong earlier in this tab is behind us, so the
    // next time it happens gets a full repair of its own.
    forgetReload();
    return;
  }
  repairing = true;
  rebuildStyles();
  // Let the new sheets land, then look again. Still gone means the style tree
  // can't be rescued from here and only a fresh document will do.
  window.setTimeout(() => {
    repairing = false;
    if (!paletteLost()) return;
    if (reloadedAlready()) return;
    markReloaded();
    location.reload();
  }, 500);
}

/** Look once the browser has settled, rather than in the middle of restoring. */
function checkSoon(): void {
  requestAnimationFrame(() => check());
}

/**
 * Watch for a restored page that came back without its colours, and put them
 * back.
 *
 * Two events, because they cover different ways of returning. `pageshow` fires
 * when a page is served from the back/forward cache — a tab that was kept whole
 * and handed back. A tab the browser had actually put down fires nothing but a
 * visibility change when you switch to it.
 */
export function watchRestore(): void {
  window.addEventListener("pageshow", checkSoon);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkSoon();
  });
}
