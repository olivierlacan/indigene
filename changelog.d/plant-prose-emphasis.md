### Fixed

- Words a page stresses now show in **bold** or *italic*, not between stray
  asterisks — on plant pages, look-alikes, native swaps and planting guides.
  The brimstone line on
  [alder buckthorn](https://indigene.app/plants/frangula-alnus) is one.
- Internal: `lib/inline-markdown.ts` reads `**strong**` and `*em*` (nothing
  else) and `components/rich-text.ts` renders it wherever authored prose is
  printed; link previews strip the marks. A test fails on any unclosed mark in
  the data or either locale (#186).
