### Fixed

- **Card lists pack together on a wide screen.** On [Plants](https://indigene.app/plants), [Wildlife](https://indigene.app/wildlife) and the regions, each card is now as tall as what it says, and the next one tucks in under it — no more gaps or padded cards.
- Internal: `.card-grid` is a JS masonry (`lib/masonry.ts`): 1px grid rows, each card spanning its measured height plus the gap, kept current by a ResizeObserver. The equal-height `height: 100%` on wildlife, plant and region cards is gone.
