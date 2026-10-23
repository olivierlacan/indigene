/**
 * Masonry for `.card-grid`: each card takes only its own height, and the next
 * card in its column tucks up under it.
 *
 * A plain grid sizes a row to its tallest card, so a three-line blurb beside
 * two one-liners left a hole under each short card (or, where cards stretched
 * to fill the row, padded them with empty space). CSS masonry isn't shipped
 * everywhere yet, so this does it the long-standing way: the grid's rows are
 * 1px tall (`.is-masonry` in styles.css) and each card spans as many as its
 * height plus the gap below it. Order still runs left to right, row by row.
 *
 * One observer per concern: a MutationObserver finds grids and cards as pages
 * render, and a ResizeObserver re-spans a card whenever its height changes — a
 * photo loading, the window narrowing, a font arriving.
 */
const seen = new WeakSet<Element>();

function span(item: HTMLElement): void {
  const h = item.getBoundingClientRect().height;
  const gap = parseFloat(getComputedStyle(item).marginBottom) || 0;
  item.style.gridRowEnd = `span ${Math.max(1, Math.ceil(h + gap))}`;
}

const sizes = new ResizeObserver((entries) => {
  for (const e of entries) span(e.target as HTMLElement);
});

function scan(): void {
  for (const grid of document.querySelectorAll<HTMLElement>(".card-grid")) {
    grid.classList.add("is-masonry");
    for (const item of grid.children) {
      if (seen.has(item)) continue;
      seen.add(item);
      sizes.observe(item);
    }
  }
}

export function startMasonry(root: Node = document.body): void {
  if (typeof ResizeObserver === "undefined") return;
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scan(); });
  }).observe(root, { childList: true, subtree: true });
  scan();
}
