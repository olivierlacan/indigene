### Added

- **[Kill your lawn](https://indigene.app/kill-your-lawn)**: how to bury a lawn under cardboard, swap it a bed at a time, and which easy natives to plant instead, region by region: ground cover, wildflowers, shrubs, trees and evergreens.
- Posts: a Halloween post, [Your lawn is already a zombie](https://indigene.app/posts/halloween-2026). Keep the decorations, put the lights on a timer for birds migrating at night, and bury the lawn this fall.
- Internal: `steps/lawn.ts` at `kill-your-lawn` and `kill-your-lawn/<region>` (prerendered, in 404.html, own share card); picks from `lib/lawn.ts` (establishment score, then caterpillar count; no thorny plants; spreaders only on the ground) with `data/evergreen.ts` for the winter row. Each post now has its own share card (`post-<slug>`). `gen-story.mjs` draws page drawings and a 1080×1350 feed post (`--feed`).
