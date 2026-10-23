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

function measure(item: HTMLElement): string {
  const h = item.getBoundingClientRect().height;
  const gap = parseFloat(getComputedStyle(item).marginBottom) || 0;
  return `span ${Math.max(1, Math.ceil(h + gap))}`;
}

function span(item: HTMLElement): void {
  item.style.gridRowEnd = measure(item);
}

const sizes = new ResizeObserver((entries) => {
  for (const e of entries) span(e.target as HTMLElement);
});

function scan(): void {
  const fresh: HTMLElement[] = [];
  for (const grid of document.querySelectorAll<HTMLElement>(".card-grid")) {
    grid.classList.add("is-masonry");
    for (const item of grid.children) {
      if (seen.has(item)) continue;
      seen.add(item);
      fresh.push(item as HTMLElement);
    }
  }
  // Spanned here, before the first paint, rather than left to the observer's
  // first report: a rebuilt list must never show a frame of cards piled up in
  // 1px rows. All the reads, then all the writes, so it's one layout.
  const spans = fresh.map(measure);
  fresh.forEach((item, i) => {
    item.style.gridRowEnd = spans[i];
    sizes.observe(item);
  });
}

export function startMasonry(root: Node = document.body): void {
  if (typeof ResizeObserver === "undefined") return;
  // Scanned straight away, not on the next frame: a sort, a filter or a search
  // keystroke rebuilds the whole list, and waiting a frame painted it as plain
  // rows first, then jumped. Observed now, a card is spanned before any paint.
  new MutationObserver(scan).observe(root, { childList: true, subtree: true });
  scan();
}
