### Added

- On the [wildlife](https://indigene.app/wildlife) list, animals at risk now show it along the bottom of their card: a five-step scale and the official rank, like "Critically endangered (CR) worldwide" for the gopher tortoise.
- The [gopher tortoise](https://indigene.app/wildlife/gopher-tortoise) now leads to 17 Florida plants, up from 4 — wiregrass, sunshine mimosa, partridge pea, pawpaw and muscadine among them.
- Wildlife: a new "Grazing" tie for plants an animal eats the leaves, shoots or buds of, like a tortoise on wiregrass. Shelter now means only cover: somewhere to nest, roost or wait out winter.
- Internal: `conservationFooter()` (`components/conservation-note.ts`) draws the strip from `conservation.json`, worse of global and local rank; `rankSeverity()` has unit tests. New `graze` `SupportKind`, ranked after `seeds`; 11 ties moved off `shelter`. `scripts/shoot.mjs --no-halloween` takes screenshots without the late-October theme.
