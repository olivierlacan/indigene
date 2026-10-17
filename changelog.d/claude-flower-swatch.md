### Added

- Plants: the Bloom tile on every plant page now shows the flower's colour as
  a small dot beside the word, two halves for a two-tone flower. The drawing of
  the plant growing uses the same colour.
- Internal: `lib/flower-color.ts` maps the rows' 93 colour words onto sixteen
  `--flower-*` tokens in `oklch()`; `flower-color.test.ts` fails on a word the
  table doesn't know (#270).
