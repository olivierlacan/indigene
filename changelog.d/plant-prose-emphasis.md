### Fixed

- Plants: words a plant's page stresses now show in **bold** or *italic*,
  not between stray asterisks — like the brimstone line on
  [alder buckthorn](https://indigene.app/plants/frangula-alnus).
- Internal: `lib/inline-markdown.ts` reads `**strong**` and `*em*` in plant
  prose (care, gives, native and propagation notes, and the source line) and
  `components/rich-text.ts` renders it; link previews strip the marks. A test
  fails on any unclosed mark, in English or French (#186).
