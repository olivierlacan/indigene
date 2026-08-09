// Is the app running from a Home Screen icon rather than inside a browser?
//
// It matters because of what a Home Screen app doesn't have: an address bar, a
// toolbar, and therefore a reload button. In Safari a stuck or stale page is one
// tap from being fixed; installed, the only way out is the app switcher. That's
// the gap `components/pull-to-reload.ts` fills, and this is how it knows to.

/** iOS and iPadOS, including an iPad that reports itself as a Mac.
 *
 *  Sniffing the user agent is the wrong tool for almost everything, and it is
 *  the right one here: what we're asking is not "can this browser do X" but
 *  "does this platform already give the reader a reload gesture". Android's
 *  installed apps do — Chrome's own pull-to-refresh comes with them — and a
 *  second one layered on top would be ours replacing something that already
 *  works. iOS is the platform with the hole, so iOS is where we fill it. */
function isIos(): boolean {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return true;
  // iPadOS 13+ sends a desktop Safari user agent. A Mac with a touchscreen is
  // the false positive this admits, and Apple doesn't sell one.
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

/**
 * True when this is an iOS Home Screen app — installed, no browser chrome, no
 * way to reload.
 *
 * Both signals, because they cover different vintages: `navigator.standalone`
 * is Safari's own long-standing flag, and the `display-mode` media query is the
 * standard one it grew later. Either is enough.
 */
export function isHomeScreenApp(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  const installed =
    nav.standalone === true ||
    window.matchMedia?.("(display-mode: standalone)").matches === true;
  return installed && isIos();
}
