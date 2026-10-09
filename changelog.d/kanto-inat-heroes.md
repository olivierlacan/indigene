### Fixed

- Every plant on the [Kantō Plain](https://indigene.app/regions/kanto) now
  shows a real photograph from iNaturalist instead of the placeholder drawing.
- Internal: `npm run hero:inat` had never been run after Kantō landed, so
  `inat-heroes.json` held none of its 59 plants. Re-ran it (plus
  `hero:colors`); three non-Kantō gaps filled on the way.
- Internal: new `inat-heroes.yml` workflow runs `hero:inat` and `hero:colors`
  on any PR that changes the plant, wildlife, look-alike, ornamental or
  invasive lists, and commits the photos to that PR. Weekly, it opens a PR for
  any gaps left on `main`.
- Internal: `npm run network:check` asks every host our scripts call and says
  whether a Claude session can reach it; `docs/network.md` holds the annotated
  table.
- Internal: the network allowlist lives in `.claude/network/`. One annotated
  source generates a paste-ready list for cloud environments and the local
  sandbox's `allowedDomains`; `npm test` fails if they drift.
