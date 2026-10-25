### Fixed

- Regions: the plant list on each region's page squashed every card to a thin sliver, hiding names and pictures. Each card is its full height again.
- Internal: `plantRow` kept an inline `margin:0;height:100%` that #302's masonry missed; inline styles beat `.is-masonry > *`, so each card filled its own span and the 1px-row measure collapsed it.
