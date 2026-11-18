### Added

- **[Planting](https://indigene.app/planting) now starts with getting a plant in the ground.** Two short illustrated guides, planting from a pot and digging among tree roots, sit above the ways to grow more.
- **[Your first planting day](https://indigene.app/volunteer): a page to read before a volunteer planting.** It gathers the planting guides with what to bring and what to do with invasives you pull. Organizers can send the link ahead.
- Invasives: [Before you pull a plant](https://indigene.app/removing/disposal) gains a guide to what happens after: which pieces go in a bag, which dry on a pile, and why knotweed roots never go in compost.
- Internal: `lib/howto.ts` holds the guides' sections and sources, each guide living under `planting`, `removing` or `volunteer`; `howto.test.ts` fails a section cited by fewer than two publishers. Figures are a third family in `page-art-svg.mjs`, labelled rather than hidden.
