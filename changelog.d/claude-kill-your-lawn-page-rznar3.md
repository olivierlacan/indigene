### Added

- **A Halloween post: [Kill your lawn](https://indigene.app/kill-your-lawn).** How to bury a lawn under cardboard and which easy natives to plant instead, region by region: ground cover, wildflowers, shrubs, trees and evergreens. Plus a timer for Halloween lights, for birds migrating at night.
- Internal: `steps/lawn.ts` at `kill-your-lawn` and `kill-your-lawn/<region>` (prerendered, in 404.html, own share card); picks from `lib/lawn.ts` (establishment score, then caterpillar count; no thorny plants; spreaders only on the ground) with `data/evergreen.ts` for the winter row. `Post.route` lets a post live at the top level. `gen-story.mjs` draws page drawings and a 1080×1350 feed post (`--feed`).
