// Tiny DOM helpers. No framework — just enough sugar to build elements
// declaratively while keeping full control of the real DOM.
//
// Text is only ever text: a string child becomes a text node, never markup.
// There is deliberately no way to pass HTML through `el()` — a name, a note or
// an API response can't turn into a script by being displayed.

type Attrs = Record<string, string | number | boolean | EventListener | undefined>;
type Child = Node | string | null | undefined | false;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: Child[] | Child = []
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (k === "class") {
      node.className = String(v);
    } else if (v === true) {
      node.setAttribute(k, "");
    } else {
      node.setAttribute(k, String(v));
    }
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c == null || c === false) continue;
    node.append(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

export function clear(node: HTMLElement): void {
  node.replaceChildren();
}

let toastTimer: number | undefined;
/**
 * A passing message, shown for `ms` then slid away. It enters by toggling
 * `.is-in` a frame after it's unhidden (so the slide runs), and leaves the same
 * way before going back to `hidden`, so the screen reader's live region and the
 * page's layout both see it come and go. Tapping it dismisses it early.
 */
export function toast(msg: string, ms = 3200): void {
  const t = document.getElementById("toast");
  if (!t) return;
  if (!t.dataset.wired) {
    t.dataset.wired = "1";
    t.addEventListener("click", () => hideToast(t));
  }
  t.textContent = msg;
  t.hidden = false;
  window.clearTimeout(toastTimer);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("is-in")));
  toastTimer = window.setTimeout(() => hideToast(t), ms);
}

function hideToast(t: HTMLElement): void {
  window.clearTimeout(toastTimer);
  t.classList.remove("is-in");
  // Hide once the slide-out has run; the timer covers a transition that never
  // fires (reduced motion, a background tab).
  toastTimer = window.setTimeout(() => {
    if (!t.classList.contains("is-in")) t.hidden = true;
  }, 300);
}
