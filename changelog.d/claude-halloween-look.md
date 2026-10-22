### Added

- A spooky theme: pumpkin orange on near-black, with more contrast than the usual dark mode, a ghost in the logo and a wilted rose. It's on from October 17 to 31; any other time, switch it on in [Settings](https://indigene.app/#/settings/spooky).
- Posts: [Your lawn is already a zombie](https://indigene.app/posts/halloween-2026) has a small drawing beside each section: a zombie hand, a ghost on a timer, a buried lawn.
- Internal: `lib/halloween.ts` and a head script in `index.html` stamp `data-halloween` + `data-theme="dark"` when `indigene:halloween` is `on`, or with no entry from 17 to 31 October (local). `?spooky=on|off` (or `?halloween=`) saves the choice. Forced-dark copies of the dark token block and loader colours; `squareArtSvg()` in `page-art-svg.mjs`; `favicon-halloween.svg`.
