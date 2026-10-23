### Fixed

- **Card lists pack together on a wide screen.** On [Plants](https://indigene.app/plants), [Wildlife](https://indigene.app/wildlife) and the regions, each card is now as tall as what it says, and the next one tucks in under it — no more gaps or padded cards.
- Internal: `.card-grid` is a JS masonry (`lib/masonry.ts`): 1px grid rows, each card spanning its measured height plus the gap, kept current by a ResizeObserver. The equal-height `height: 100%` on wildlife, plant and region cards is gone.
- **Filters keep your place.** On a region's plant list and on [Wildlife](https://indigene.app/wildlife), tapping Group, a filter or a size limit no longer jumps the page — sometimes right back to the top. The control you tapped stays under your finger.
- Internal: `restorePlace` found the tapped control again by its `href`, but a toggle's `href` flips when tapped and two links can share one. View-panel controls now carry a `data-keep` name (`lib/kept-place.ts`), and `npm run scroll:check` (new "Scroll position" workflow) uses every control at 390 and 1100 px and fails on any jump.
