// Is the app running from a Home Screen icon rather than inside a browser?
//
// It matters because of what a Home Screen app doesn't have: an address bar, a
// toolbar, and therefore a reload button. In Safari a stuck or stale page is one
// tap from being fixed; installed, the only way out is the app switcher. That's
// the gap `components/pull-to-reload.ts` fills, and this is how it knows to.
//
// The question is *answered* in a script tag at the top of `index.html`, not
// here. It has to be: WebKit decides the colour behind an over-pull, and which
// touches it can handle without waking us, while it sets the page up — before a
// module has run a line. Answering it from the app meant the gesture did
// nothing on a freshly opened page and only came to life a couple of links
// later, once some unrelated re-render had refreshed WebKit's copy. So the head
// stamps `data-home-screen` on `<html>` and everything reads it from there:
// the canvas colour (`styles.css`), the gesture, and the menu's Reload row all
// get the same answer at the same moment.

/**
 * True when this is an iOS Home Screen app — installed, no browser chrome, no
 * way to reload.
 *
 * Sniffing the user agent is the wrong tool for almost everything, and it is
 * the right one here: what we're asking is not "can this browser do X" but
 * "does this platform already give the reader a reload gesture". Android's
 * installed apps do — Chrome's own pull-to-refresh comes with them — and a
 * second one layered on top would be ours replacing something that already
 * works. iOS is the platform with the hole, so iOS is where we fill it. The
 * test itself is in `index.html`; this reads its verdict.
 */
export function isHomeScreenApp(): boolean {
  return document.documentElement.hasAttribute("data-home-screen");
}
