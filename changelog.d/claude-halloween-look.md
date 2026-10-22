### Added

- Until October 31, Indigene dresses up: pumpkin orange on near-black, with stronger contrast than the usual dark mode, a ghost in the logo and a wilted rose. Prefer the usual look? Turn it off in [Settings](https://indigene.app/#/settings/halloween).
- Posts: [Your lawn is already a zombie](https://indigene.app/posts/halloween-2026) has a small drawing beside each section: a zombie hand, a ghost on a timer, a buried lawn.
- Internal: `lib/halloween.ts` and a head script in `index.html` stamp `data-halloween` + `data-theme="dark"` from 15 to 31 October (local), unless `indigene:halloween` is `off`; `?halloween=on|off` forces it for one load. Forced-dark copies of the dark token block and loader colours; `squareArtSvg()` in `page-art-svg.mjs`; `favicon-halloween.svg`.
