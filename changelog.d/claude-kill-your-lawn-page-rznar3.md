### Added

- **A Halloween post: [Kill your lawn](https://indigene.app/kill-your-lawn).** How to bury a lawn under cardboard, swap it a bed at a time, and which easy natives to plant in its place, for each region: ground cover, wildflowers, shrubs, trees and evergreens.
- Internal: `steps/lawn.ts` at `kill-your-lawn` and `kill-your-lawn/<region>` (prerendered, in 404.html, own share card); picks from `lib/lawn.ts` (establishment score, then caterpillar count; no thorny plants; spreaders only on the ground) with `data/evergreen.ts` for the winter row. `Post.route` lets a post live at the top level. `gen-story.mjs` draws page drawings and a 1080×1350 feed post (`--feed`).
