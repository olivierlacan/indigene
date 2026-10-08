### Changed

- Links in [What's new](https://indigene.app/release-notes/) are words you can tap, like a region's name or "a new page", instead of a web address printed after the sentence.
- Pages now point to each other where it helps. A region opens its [look-alikes](https://indigene.app/lookalikes) and native swaps, a list of invasives ends with what to grow instead, and About links the settings it mentions.
- A plant search that finds no native now offers the invasive, look-alike or swap page for that name, so "butterfly bush" lands on the page that answers it.
- The [guide](https://indigene.app/guide/) has a page on the worst invasives: what makes a plant one, and how to use the lists to remove it.
- Links inside sentences are quieter: they keep the text's color with a soft underline, so a paragraph with links stays easy to read.
- Internal: every typed-out URL in CHANGELOG.md became a linked phrase, and both compilers now autolink a bare or `<…>` URL (`autolink()` in `scripts/_changelog.mjs`, `autolink.test.ts`), so one can't render dead again.
- Internal: an entry's section prefix (`Regions:`, `Plants & Wildlife:`) links that part of the app on What's new when the entry carries no link of its own (`linkPrefix()` and a section's optional `home` in `guide-catalog.mjs`, `changelog-prefix.test.ts`).
- Internal: `npm run release-notes` warns when a published bullet types out a URL instead of linking a word; CLAUDE.md and CHANGELOG.md's house rules now say to link the name.
- Internal: the "Among the worst in" line on swap and look-alike pages linked each region's native roster; it now links that region's invasives list, plus the plant's own removal page. Figure dialogs' "How every number is sourced" opens `#/sources` instead of DATA_SOURCES.md on GitHub.
- Internal: body-copy links in `.privacy-page`, `.note`, `.kv`, `.step-lede` and `.region-tag` take the quiet `.src-link`-style look; `.more-link` keeps a paragraph that is only a way on bright.
- Internal: results link the filter labels' meanings and the region's wildlife and invasives; Homegrown links essential plants, Sources and its three regions; Regions asks for a missing region on GitHub. Look-alike, swap, planting and animal pages drop the bottom button that repeated their back-trail.
