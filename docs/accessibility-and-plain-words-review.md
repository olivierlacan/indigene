# Accessibility & plain-words review (September 2026)

A pass over every string a reader sees (`locales/en.ts`, the plant, wildlife,
look-alike, swap and invasive prose in `data/`) and over the rendered markup,
asking four questions: can a newcomer follow it, does the app say one thing one
way, is it straight, and is every claim true and sourced?

The first PR fixed what was plainly wrong. This file is the rest: diagnosed,
not yet done, roughly in the order it's worth doing.

## Structure (accessibility)

- **Every page's `<h1>` is "Indigene".** The brand is the h1 in `index.html`;
  page titles are h2 `.step-title`, and several pages then jump to h4 (wildlife
  group page, look-alikes index, swaps index, one region's invasives). Make the
  brand a `<p>`, page titles h1, card names the next level down.
- **Route changes don't announce the page.** Nine steps (`confirm`,
  `location`, `priorities`, `results`, `saved`, `settings`, `skyscan`, `sun`,
  `welcome`) never set a `docTitle`, and focus lands on a nameless `<main>`.
  Give each a title and focus the page heading (`tabindex=-1`).
- **Focus is dropped when a picker redraws.** The region list and the
  gps/zip/region switch in `steps/location.ts`, and `memory-controls.ts`,
  rebuild the pressed button, so focus falls to `<body>`.
- **The photo viewer is a hand-rolled modal.** It now closes on navigation and
  won't return focus to a detached node, but Tab still leaves it and the page
  behind stays readable. Rebuild it on `<dialog>` + `showModal()`, as the term
  dialog already is.
- **English fallback prose isn't marked `lang="en"`** on French pages, so a
  French voice reads it.
- **Live regions toggled with `hidden`** (toast, offline badge) often go
  unannounced; the offline badge is also a `<button>` that does nothing.
- **Tap targets under the app's own 48 px** `--tap`: tags, anchor links, back
  trail, wildlife chips, the lightbox close button, the gear icon at ≤365 px.

## Folding boxes still in the app (house rule)

`CLAUDE.md` forbids them; five remain:

- `<details>`: Filters (`steps/results.ts`), "Fine-tune each one"
  (`steps/priorities.ts`), the scale legend (`steps/lookalikes.ts`).
- The hover/focus accordion on the plant page (`steps/plant.ts`, with a
  `<div>` inside a `<button>`, and `aria-expanded` that never changes).
- Wildlife pills that open panels in place (`components/wildlife-chips.ts`),
  and the "Show all regions" toggles.

Each needs a design decision (inline, or its own page), which is why none was
rushed here.

## Interface consistency

- **Back links look three ways** (`.back-trail`, `.region-tag` with an inline
  style above or below the title, a bare `<p><a>`). One `backLink()`.
- **61 buttons that navigate** should be links; "← All wildlife" is an `<a>`
  on one page and a `<button>` on another.
- **One destination, six labels** for going to the location step: "Start from
  a spot", "Start from a spot instead", "Find a spot", "Find my spot", "Find
  plants for my spot", "Rank these for my spot".
- **Arrows** are typed (→ ← ›) in some strings and drawn in CSS elsewhere; the
  flow's Back buttons have none.
- **Card headings** are h3 on some indexes and h4 on others; only the ranked
  plant card rings the whole card on focus.

## Words

- **Caterpillar-plant vocabulary**: "caterpillar host", "larval host", "host
  plant", "caterpillar plant". Settle on "caterpillar host" in reader text.
- **Unexplained terms still in prose**: keystone (≈20 notes), specialist bees,
  cultivar, mast, drupe, umbel, sallow, garrigue/maquis, machair, cismontane,
  hell strip, nurse crop, "sweet soil" for lime-rich, OE (the monarch
  parasite). Gloss once in place or cut.
- **Untranslated listing labels**: "Listed Plante Exotique Envahissante
  implantée here", "Listed Majeure here". Give an English gloss with the
  original in parentheses.
- **"This list" in plant notes.** About 60 notes still describe our dataset
  ("on this list") rather than the reader's garden.
- **Overlong notes** (130–180 words): several PNW notes (the clematis and
  blackberry keys belong on look-alike pages), wych elm, the violet tie note.

## Claims that need a source or a softer word

- **Genus-level host counts written as local species facts.** Ireland and
  France-Mediterranean notes quote Gaytán figures (e.g. "227") as if counted on
  the island; mid-atlantic and north-michigan asters say "hosts 100+". Move the
  number to the tile, or say "in Atlantic Europe, counting relatives".
- **Competing superlatives** — several plants per file are "first to flower",
  "last to flower", "easiest", "the answer to dry shade", "toughest". Say the
  month or the condition instead.
- **Unsourced numbers**: elderberry feeds "forty other species", needlegrass
  roots "twelve feet or more" and it "lives for a century", western monarchs
  "fallen by well over ninety percent" (cite the Xerces count), "the Alps have
  more kinds of blue butterfly than anywhere in Europe".
- **Card mix-ups in `wildlife.ts`**: notes filed under a card for a different
  animal (rock-rose under common blue, creepers under jays, leafcutter and ivy
  bees under mason bees, the waved sphinx under cecropia). Bumble bees are
  tagged `reliance: "narrow"` ("Specialist") in nine ties.
- **"Not from here" status** sits on plants the same entries say are spreading
  (pyracantha, Mexican fan palm in Florida, tropical milkweed, butterfly bush).
- **Filter flags that disagree for one species across regions**: pet toxicity
  (red elderberry, red maple, yarrow, California poppy, bird cherry, male fern,
  cow parsnip) and deer resistance (salal, toyon, Pacific aster, heather).
  Reconcile against one source per flag.
- **Species links** send every butterfly to BAMONA and every bird to All About
  Birds, including European and New Zealand species that have no page there.
