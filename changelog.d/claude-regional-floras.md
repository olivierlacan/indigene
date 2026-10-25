### Added

- Chicago, the Mid-Atlantic, Northern Michigan, Ireland and Auckland now check every plant against [lists kept by their own botanists](https://indigene.app/sources), not just Kew's. Each plant page says who lists it as native, and where they disagree.
- Internal: `npm run floras` reads eight scriptable checklists (universalFQA, PNHP, BSBI's Zenodo statuses, the NZ Checklist, Auckland TR2025/6) into `data/sources/regional-floras/`; `native-evidence` and `cross-checks.ts` pick them up. Runs quarterly in `native.yml`.
