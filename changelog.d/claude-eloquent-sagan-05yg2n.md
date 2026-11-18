### Added

- **[Planting](https://indigene.app/planting) now runs in the order the work does: clear the ground, get a plant in, grow more.** Two new illustrated guides cover planting from a pot and digging among tree roots. Every older link still works.
- **[Your first planting day](https://indigene.app/volunteer): a page to read before a volunteer planting.** It gathers the planting guides with what to bring and what to do with invasives you pull. Organizers get a button to share it.
- Invasives: [Before you pull a plant](https://indigene.app/removing/disposal) gains a guide to what happens after: which pieces go in a bag, which dry on a pile, and why knotweed roots never go in compost.
- Plants: every plant's page and [Kill your lawn](https://indigene.app/kill-your-lawn) now link to the guide on planting from a pot.
- Internal: `lib/howto.ts` holds the guides' sections and sources, each guide living under `planting`, `removing` or `volunteer`; `howto.test.ts` fails a section cited by fewer than two publishers. Figures are a third family in `page-art-svg.mjs`, labelled rather than hidden.
