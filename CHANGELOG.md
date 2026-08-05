# Changelog

All notable changes to Indigene are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
with two house rules:

- **Versions are feature releases, not schedules.** A version is cut when a
  coherent piece of the product lands — then it gets a number, a name, and a
  date (the way [Maison](https://github.com/olivierlacan/maison) does it).
  There is no fixed cadence and no conventional-commit machinery; just add
  plain bullets to **Unreleased** as you go, and promote them to a numbered
  release at a natural boundary.
- **The public "What's new" page is compiled from this file.** Bullets are
  published verbatim for a general audience — including kids and
  grandparents — so write them in plain, warm words. Developer-facing
  housekeeping belongs here too: start such a bullet with `Internal:` and the
  compiler cleans it out of the page. Reviewing a changelog entry in a PR
  *is* reviewing the release notes.

The bold line under each version heading is the release's name; it becomes the
subtitle on the What's new page.

## [Unreleased]

### Added

- **The French edition is finished.** Until now, choosing French translated the
  buttons and the headings, and then handed you paragraphs of English as soon as
  you opened a plant — with a small honest notice at the top of the page saying
  so. Every one of those paragraphs is now in French: why each plant belongs
  where it grows, what it gives you and the wildlife, what it asks of you, and
  how to grow more of it. All 229 plants across the eight regions, from
  [Atlantic France](https://indigene.app/regions/france-atlantic) to
  [south Florida and the Keys](https://indigene.app/regions/florida-south),
  plus the 65 [animals](https://indigene.app/wildlife) and the 27
  [look-alikes](https://indigene.app/lookalikes) and every "how to tell them
  apart" table. The notice is gone because there is nothing left for it to
  admit to.
- **Plants that grow in two regions now say the right thing in each.** Twenty-two
  plants are on more than one of our lists, and their descriptions were always
  written separately — hornbeam is a garden hedge in the west of France and the
  great oak-and-hornbeam forest of Lorraine in the east. The French now follows
  the same split, so the page you are reading describes the region you are
  reading about.
- **You can send someone straight to one part of a plant's page.** A plant's page
  is long, and until now the only thing you could share was the whole of it —
  followed by "scroll down a bit". Every heading below the plant's photograph now
  carries a small `#`: tap it and the link to *that* section is copied, ready to
  paste. Follow one and the page opens with that card gently lit in green for a
  moment, so you can see which part you were sent to even when it was already on
  screen. There are five of them —
  [what it does for the ecosystem](https://indigene.app/#/plants/lupinus-polyphyllus/ecosystem),
  [seeing it growing near you](https://indigene.app/#/plants/lupinus-polyphyllus/nearby),
  [how to grow more](https://indigene.app/#/plants/lupinus-polyphyllus/propagation),
  [checking your own spot](https://indigene.app/#/plants/lupinus-polyphyllus/spot),
  and [looking it up elsewhere](https://indigene.app/#/plants/lupinus-polyphyllus/references).

### Fixed

- **Three groups of animals had French names that never appeared.** "Osmies et
  andrènes", "Abeilles spécialistes des astéracées" and "Colibri d'Anna et
  colibri roux" had all been written down, but a mismatch in how they were
  filed meant a French reader saw the scientific name instead. They show up
  properly now.

### Changed

- **"What it does for the ecosystem" is a third shorter, and easier to read at a
  glance.** The card lists seven things a plant does — feeding caterpillars,
  feeding bees, soaking up rain, and so on — and each one used to be followed by
  a sentence explaining it, seven sentences deep with nothing between them. The
  numbers were buried in the middle of a wall of words. Now the seven sit as a
  neat list you can read down in one look, and the explanation appears when you
  ask for it: hover a line on a computer, or tap it on a phone. Nothing has been
  taken away — and if you follow a link straight to
  [this section](https://indigene.app/#/plants/lupinus-polyphyllus/ecosystem),
  every explanation is already open, because asking for that section is asking
  for the detail in it.
- **Internal:** the translated catalog prose is fetched as its own file rather
  than built into the app, so an English reader downloads none of it. The app
  stays at ~320 KB gzipped; French adds ~122 KB, once, and only in French. If
  that file can't be fetched the pages fall back to English exactly as an
  untranslated row always did.
- **Internal:** `locales/prose.fr.ts` is now `locales/prose.fr/`, one file per
  region plus one each for the animals and the look-alikes, and a key may be
  qualified with a region (`"Carpinus betulus@france-continental"`) so one taxon
  can carry a different translation per list. New `npm run prose:check` reports
  per-region coverage, names every field still falling back to English, and
  fails on two files claiming the same key — which is how the Douglas-fir /
  holly / ivy collision was caught.

## [0.23] - 2026-08-04

**Photographs on every list, arriving gently**

[![The plants list, every row opening with a photograph of the species](docs/screenshots/pr-92/thumb.png)](docs/screenshots/pr-92/plants-after-dark.png)
[Before](docs/screenshots/pr-92/plants-before-dark.png) · [After](docs/screenshots/pr-92/plants-after-dark.png)

### Added

- **You can now see what a plant looks like without opening it.** The photographs
  people picked for the plant pages have moved out onto the lists as well:
  [every native Indigene knows](https://indigene.app/plants), every region's
  roster, and the plant starring on the front of each region card. Where nobody
  has chosen a photograph yet the little drawing stays exactly as it was, so no
  row is ever left with an empty square.

### Changed

- **Pictures arrive gently instead of appearing in pieces.** Every photograph in
  the app is now fetched quietly in the background and only shown once it is
  complete, fading in over whatever was already there — the plant's drawing on a
  list, or the photograph's own colours on a plant page. No more watching a
  picture paint itself from the top down, and nothing on the page shifts when
  one lands.
- **Photographs are asked for at the size they're actually shown.** A picture
  drawn the size of a postage stamp used to be downloaded at the size of a
  postcard. Now the app asks for the small one for a small space and the larger
  one only where it will really be seen, which on an ordinary laptop is about a
  third of what a plant page used to cost. On a phone the difference is bigger
  still, because a whole list of plants is now a whole list of small pictures
  rather than large ones.
- **A long list only loads the pictures you can see.** Scrolling the plants
  page no longer sets 190 photographs downloading at once; each one is fetched
  just before it reaches the screen, a few at a time, so the rest of the app
  stays quick while they arrive. If your connection is slow, or your phone is
  set to save data, the lists keep their drawings and don't fetch photographs at
  all. Anything you have already seen is kept on your device and comes back
  instantly, offline included.
- Internal: `lib/photo.ts` is now the only place that decides how an
  iNaturalist photo is asked for and shown — `renditionFor` picks the smallest
  of iNaturalist's five fixed renditions that covers a slot at the device's
  pixel ratio (measured: square 7.6 KB, small 38 KB, medium 126 KB, large
  438 KB, original 1.7 MB; `original` is asked for nowhere), a shared
  `IntersectionObserver` holds a thumbnail's job until it is within 400 px of
  the viewport, a four-deep queue caps concurrency with the plant hero
  jumping it, and every image is `decode()`d before the `.photo-fade` class is
  lifted. A job that hasn't decoded in 8 s releases its slot and finishes on
  its own, so one stalled request can't starve a list. The observer's targets
  are swept for disconnected nodes past 300 entries — an
  `IntersectionObserver` holds targets strongly, and the plants index rebuilds
  ~190 cards per keystroke.
- Internal: **no worker resizes anything, deliberately.** Shrinking an image
  locally requires downloading every byte first, so it cannot shorten the wait
  it appears to address, and iNaturalist already publishes five sizes on a CDN
  — asking for `small` costs 38 KB where fetching `medium` to shrink costs 126.
  The reasoning is written down at the top of `lib/photo.ts` so the idea isn't
  re-proposed.
- Internal: `npm run hero:colors` (`scripts/hero-colors.mjs`) averages each
  pick's `square` rendition into a `color` on `hero-photos.json` — decoded by
  Chromium, the same borrowed-decoder arrangement `_photo-quality.mjs` uses, so
  the repo keeps zero runtime dependencies. ~1.6 KB for all 204 picks. The
  field is optional; without it the hero falls back to `--brand-bg`. Documented
  as stage 3½ in `docs/hero-photos.md`.
- Internal: the plant hero's `aspect-ratio` moved from the `<img>` to the
  `.plant-hero-shot` button. An `<img>` with no `src` yet is not a replaced
  element — it lays out as its alt text — so the ratio on the image reserved a
  text-high strip and the waiting colour showed as a bar.
- Internal: `PHOTO_CACHE_LIMIT` 240 → 600. The mix shifted from lightbox-sized
  photos to 8–38 KB thumbnails, so the entry count can rise while the bytes
  stay around 30 MB.
- Internal: `scripts/shoot.mjs --photos DIR` serves the iNaturalist photo hosts
  from a local mirror laid out like their URLs. The list pages now load
  photographs, which made screenshots depend on the network and race whichever
  tiles had landed; the mirror holds the real bytes, so a capture is both
  truthful and repeatable.

## [0.22] - 2026-08-04

**More to plant, and who it feeds**

[![Browse by wildlife: 28 creatures the Atlantic France plants support](docs/screenshots/pr-91/thumb.png)](docs/screenshots/pr-91/wildlife-after-dark.png)
[Before](docs/screenshots/pr-91/wildlife-before-dark.png) · [After](docs/screenshots/pr-91/wildlife-after-dark.png)

### Added

- **A lot more to plant in the Pacific Northwest.** The list grew from 44 plants
  to 58, and the new ones are deliberately not more trees. There are now sedges
  and a rush for wet ground, two more ferns, stonecrop and buckwheat for a dry
  sunny edge, and trailing blackberry — the native everyone mistakes for the
  Himalayan bramble. Three trees did go in, each for a reason: black hawthorn,
  paper birch and Pacific crabapple all feed large numbers of caterpillars and
  none of them was on the list at all. Indian plum is the one to notice — it is
  the first thing in flower west of the Cascades, often in February, which is
  exactly when a queen bumblebee wakes up hungry and finds nothing open.
- **Early blue violet, and why it matters.** Also new to the Northwest, and the
  only thing a fritillary caterpillar will eat. The way it works is worth
  knowing before you plant it: the butterfly lays her eggs in late summer beside
  violets that have already died back for the year, the caterpillar hatches,
  eats nothing at all, sleeps through the winter in the leaf litter, and goes
  looking for violet leaves the following April. So the patch has to still be
  there next spring, in the same spot. The plant's page says so.
- **Atlantic France doubled, from 23 plants to 46.** Heather, broom, dyer's
  greenweed, bramble, lady's bedstraw, mugwort, knapweed, bird's-foot trefoil,
  sorrel, red clover, ribwort plantain, two grasses, two more ferns, hop, aspen,
  bilberry, small-leaved lime, wych elm, wild pear, field rose and beech. Most of
  them were chosen because they feed the most caterpillars of anything that grows
  there — and several also flower in August, September and October, which is when
  the old list ran out of flowers and a bee colony runs out of food.
- **The app now says who eats what, all over Europe.** Atlantic France used to
  name an animal for five of its plants and never once said that a caterpillar
  ate anything. It now names animals for 43 of its 46 plants, and 24 of those are
  a caterpillar's actual food. The one to look at is
  [alder buckthorn](https://indigene.app/plants/frangula-alnus): a brimstone
  caterpillar can eat buckthorn and nothing else, so one shrub in a hedge really
  can put the first butterfly of spring in your garden. Oak gets the purple
  hairstreak and the jay, goat willow the purple emperor, hazel the dormouse,
  cowslip the Duke of Burgundy, wild cherry the hawfinch — the one bird that
  cracks the stone instead of eating the flesh.
- **And in the Northwest too.** Douglas-fir, western hemlock and western redcedar
  now name the crossbills and siskins that live off their cones, and the region
  went from 59 named relationships to 91. Twenty-two new animals joined
  [the wildlife pages](https://indigene.app/wildlife) in all.
- Internal: `npm run coverage` prints what each region's plant list is missing —
  forms below three, moisture × sun cells with nothing in them, months with
  nothing in flower, the wildlife ties that aren't written, and (for the four
  French regions) the food-web genera we don't ship, joined live against the
  committed Gaytán host counts. This is `docs/coverage-plan.md` §4 step 1, which
  that document asked for and left unbuilt. `--region <id>` for one region,
  `--top N` for how far down the genus ranking to look.
- Internal: `docs/coverage-gap-pnw-france-atlantic.md` is what the script found
  and what was done about it. Atlantic France went from 9 of the top 30
  Oceanic-temperate host genera to **29 of 30** — 41% of the caterpillar records
  to 97% — and both regions now clear every form floor and every site cell.
  Deliberately still open: the Northwest's October bloom month and *Ceanothus*;
  Atlantic France's November and December; and dandelion, the only top-30 genus
  left out, on plantability grounds.
- Internal: `app/scripts/probe-globi.mjs` and the *US host counts* workflow ask
  GloBI whether America can have computed host counts the way Europe does. It
  ships nothing on purpose — the gate is whether the source can tell a
  caterpillar eating a leaf from an adult sipping at a flower, and
  `docs/us-host-counts-plan.md` commits to abandoning the approach if it can't.
  This is the structural gap the audit exposed: European lists can be grown from
  a ranking and American ones can't.

## [0.21] - 2026-08-03

**Real photographs, and a thumb to page them**

[![A plant's page opening with a photograph of the species instead of a drawing](docs/screenshots/pr-85/thumb.png)](docs/screenshots/pr-85/after-dark.png)
[Before](docs/screenshots/pr-85/before-dark.png) · [After](docs/screenshots/pr-85/after-dark.png)

### Added

- **Real photographs on plant pages.** Where we've been able to choose a good,
  freely-licensed picture, a plant's profile now opens with an actual
  photograph of the species instead of the drawing — 188 plants so far, each
  photo credited to the naturalist who took it and tappable to see it full-size
  with its licence and a link back to the original sighting. Plants we haven't
  chosen a photo for yet keep their drawing, so nothing looks unfinished.
- **Swipe through the photos.** When you tap a photo of a plant or animal
  [someone spotted near you](https://indigene.app/wildlife) and it opens large,
  you can now slide it aside with your thumb to see the next one — the picture
  follows your finger, and a flick is enough. It does exactly what the small ‹ ›
  buttons at the edges do, so you no longer have to aim for them on a phone:
  drag left for the next photo, right for the one before, right round the set
  and back to the start. A photo with nothing to page to stays put.
- **Swipe down to put a photo away.** Drag the big photo downwards and the whole
  viewer falls with your thumb, letting the page show through behind it — let go
  and it's closed, as if you'd tapped the ✕. Change your mind halfway and it
  springs back to where it was. Handy when the ✕ is up in the far corner and your
  thumb is not.
- Internal: both gestures live in `attachSwipe` in `components/lightbox.ts`,
  which picks an axis in the first 8 px of travel and holds it: sideways routes
  into the same `step()` the buttons and the ← → keys call, downwards into the
  same `close()` as ✕ / Escape / the backdrop, so no path can drift apart from
  the others. Touch and pen only — a mouse drag on a picture already means
  something else. The falling panel fades `.lb-overlay`'s *background*, not its
  opacity (fading the overlay makes the photo itself see-through), and
  `close()` undoes a drag in flight so the reused overlay never greets the next
  photo tilted. `npm run swipe:check` drives real Chromium touch input at a
  built, served `dist/` and asserts all 17 outcomes (drags, flicks, twitches,
  wrap-around, dismissal both ways, and a clean reopen).

## [0.20] - 2026-08-01

**What's new, and where it would go**

[![The gear menu opening with "See what's new" and a green dot beside it](docs/screenshots/pr-88/thumb.png)](docs/screenshots/pr-88/menu-after-dark.png)
[Before](docs/screenshots/pr-88/menu-before-dark.png) · [After](docs/screenshots/pr-88/menu-after-dark.png)

### Added

- **A plant's page tells you when you've already got somewhere to put it.** If
  you've saved a spot, reading about
  [a plant](https://indigene.app/plants/quercus-alba) now says whether it would
  suit that ground — by name, under *Want to plant it?* — instead of asking you
  to describe the garden all over again to find out. Tap the spot to see
  everything else that thrives there. It only ever names the spots a plant
  *would* suit: a page you're browsing shouldn't volunteer bad news about four
  gardens, and the check underneath still gives an honest verdict, good or bad,
  for anywhere you point it. Nothing is asked and nothing is sent — it's the
  same arithmetic your plant lists already do, run on spots this device had
  saved.
- Internal: `lib/saved-fit.ts` runs every saved spot through `assessSpot`, the
  same function the manual checker calls, so a plant can never look better here
  than it would in the ranked list for that same spot; ideal ahead of decent,
  then by fit. `assessSpot` gains an optional region override, honoured the way
  `activeEntry` and the ranked flow already honour it, so a spot the reader
  hand-placed just over a boundary is judged against the region they said it's
  in. The row's sub-line shows the spot's own sun answer rather than the
  verdict's first reason — the reasons are ordered for reading in full, so the
  first is the hardiness line, and on a spot whose site lookup never landed
  that's "couldn't confirm how cold winters get here", which reads as a warning
  under a green verdict. It's derived from the stored hours, not the stored
  label, which was written in whatever language the spot was saved in.
- **A green dot when something's new, and nothing when it isn't.** Indigene now
  keeps a small mark beside *What's new* — in the ⚙️ menu, and at the foot of
  every page — from the moment something is added until you've looked at it.
  Follow it and
  the [What's new page](https://indigene.app/release-notes/) opens with the
  releases you haven't read marked down the side and one line at the top —
  *2 releases since your last visit* — which you can press to start at the oldest of
  them and read forward, instead of piecing it together backwards. Reading them
  is what turns the dot off; nothing else does, so it can't quietly clear itself
  and leave you wondering what you missed.
- **Someone arriving for the first time gets no dot at all.** "New since your
  last visit" means nothing to a person who has never visited, and greeting them
  with nineteen highlighted releases would teach them, in one screen, that the
  mark isn't worth looking at. They start level with today, and get a dot the
  next time something genuinely lands.
- **What that costs you, in full: a version number and two dates.** To know
  what's new to *you*, Indigene has to remember the release you'd read up to and
  when you were last here. That's the entire list — no account, no counter of
  how often you come, no record of what you looked at, and nothing that could
  tell you from anyone else. It stays in your browser, and there's no server to
  send it to. [Privacy & safety](https://indigene.app/privacy) now says so in
  its own section, and
  [Settings](https://indigene.app/settings) shows you both values with a button
  that throws them away.

### Changed

- **The ⚙️ menu opens with what's new, and saved spots are one row away.**
  What's new sits at the top, where the dot on the gear points. Underneath it,
  **Saved spots** is now a single row through to
  [the Saved page](https://indigene.app/#/saved) rather than a list of your
  spots inside the menu. The list looked like a shortcut and behaved like a
  wait: opening the menu had to open the database first, so it could show
  "Loading…", or an error with a *Try again*, before it showed you anything.
  The row is simply there, the moment you press the gear, and the Saved page —
  which is where opening, renaming and deleting a spot already lived — does the
  rest in one place instead of two.
- Internal: `lib/visits.ts` owns the record — `indigene.visits` in
  localStorage, holding `seenVersion`, `lastVisitAt` and `visitAt`. localStorage
  rather than the IndexedDB kv store every other memory uses, because this is
  the one thing read by two documents: the app, and the standalone page
  `build-release-notes.mjs` compiles, which has no bundle behind it and has to
  decide what to mark before it paints. The compiled page therefore carries a
  mirror of the read/write/compare logic; both sides are commented as such.
  `compareVersions` compares part-by-part as numbers, because string order puts
  `0.9` after `0.19` and that comparison is the whole feature. A visit that
  resumes within 30 minutes is the same visit, so a reload — or a trip to the
  notes and back — can't redefine "since your last visit" as "since you
  clicked".
- Internal: `build-release-notes.mjs` fails the build when `app/package.json`'s
  version and the newest changelog heading disagree. The app reads the former to
  decide whether to show the dot and the page publishes the latter, so drift
  between them is a wrong badge for everyone, silently; CLAUDE.md already says
  to bump both when cutting a release, and this makes forgetting a build error.
- Internal: the "since your last visit" notice is one line because a sentence
  and a pill button measurably cannot share a row at 360px — so the notice *is*
  the control: the whole box is a button, and the visible label is the count
  and nothing else, so it holds that line whatever the number grows to; its
  accessible name is where "and pressing it takes you there" gets said. With exactly one release
  waiting there is nowhere to jump, so it degrades to a plain line. There is
  deliberately no badge on the gear itself: on a header filled with brand green
  a mark on a 16–18px emoji reads as a smudge on the header rather than a badge
  on a control, in a corner or centred on the hub alike. The trade is real —
  nothing signals a new release until the menu is opened or the footer reached
  — and a badge nobody can parse is noise on every screen, not a signal.
- Internal: `app-menu.ts` is synchronous now — no `listSpots`, no loading,
  error/retry or empty states, and the panel is drawn on open rather than
  populated in two passes. The seven `savedMenu.*` strings it needed go with
  it, from both locales. The two settings rows take their accessible name from
  the `footer.languageIs` / `footer.unitsIs` phrases instead of gluing a colon
  on in code, which had been quietly imposing English spacing on French.
- Internal: bundle re-measured — 273 KB → 275 KB gzipped, and the four docs
  quoting the figure updated (they had drifted to ~268 KB before this change).
  Dropping the menu's database path gave ~0.4 KB of that back.

## [0.19] - 2026-08-01

**A spot it remembers, and links that travel**

[![Settings listing everything the app remembers, each with a button to forget it](docs/screenshots/pr-81/thumb.png)](docs/screenshots/pr-81/settings-after-dark.png)
[Before](docs/screenshots/pr-81/settings-before-dark.png) · [After](docs/screenshots/pr-81/settings-after-dark.png)

### Added

- **Indigene remembers the spot you were last standing in.** Come back
  tomorrow and it opens where you left off instead of a blank map — the same
  place, and the sun and soil answers you gave for it, so you're at your plant
  list in a couple of taps. Those answers belong to that patch of ground and
  nowhere else: move somewhere new and Indigene asks again, because how sunny a
  spot is and how wet it stays really are different one garden over.

- **A starting region, if you'd rather skip the map for good.** If you already
  know your area, choose it once under **Starting region** in
  [Settings](https://indigene.app/#/settings) and every visit begins there. The
  spot step then says so in a single line, with the link to change it, instead
  of explaining itself all over again.

- **Settings now lists everything this device remembers about you**, in plain
  words, each with a button that throws it away: your last spot (with its sun
  and soil), your starting region, and the goal your plant lists are ranked by.
  All of it stays in your browser — it has never gone anywhere else.

- **The goal you last chose sticks, and now says so.** Ask for a list that
  favours birds and it stays favouring birds on your next visit. That was
  already true, quietly; the trouble was that nothing ever told you, so a list
  ordered by last month's decision looked like Indigene's own opinion. It's
  named on the Settings page now, with one button back to the usual goal.
- **A real photograph where a plant's page had a drawing.** That little picture
  beside a plant's name was chosen by its *type* — the same shrub shape for
  every shrub, the same tree for every tree. It can now be an actual photo of
  that species instead, in the same spot and never wider than a third of your
  screen, with the photographer named just below. Tap it to see it large, with
  the licence and a link to the original sighting, exactly like the other photos
  in the app. Plants nobody has chosen a picture for yet keep the drawing, so
  nothing looks half-finished.

- Internal: the hero-photo pipeline — `npm run hero:harvest` (iNaturalist's
  most-favourited research-grade observations per plant per region, restricted
  at the query to republishable CC licences), `_photo-quality.mjs` (Chromium
  decodes, Node fetches — no new dependency), and `npm run hero:review` (a
  self-contained page for picking, with `localStorage` persistence and a JSON
  download). `.github/workflows/hero-photos.yml` runs the harvest quarterly and
  opens a PR with the shortlists. Scoring leans on **subject isolation**, not
  global sharpness: measured on real photos, Laplacian variance ranked a
  cluttered hillside (5731) far above a clean close-up (361), because busy
  frames are high-frequency everywhere. Nothing here changes a photo the app
  shows until a pick is committed; `lib/hero-photo.ts` reads them, preferring
  the displayed region and falling back to any reviewed one, and reshapes a pick
  into an `ObservationSummary` so the lightbox credits it through the existing
  path rather than a second implementation. See `docs/hero-photos.md`.

- **Every plant now has its own picture on a shared link.** Send someone
  [white oak](https://indigene.app/plants/quercus-alba) and the preview no
  longer shows the same green Indigene picture every other link showed: it
  shows a card made for that plant. Its name, large; the scientific name under
  it; the little drawing of its shape — the same one you see beside it in the
  app, a tree for a tree, a fan of blades for a grass; and four things worth
  knowing at a glance, each as a small picture and a number rather than a
  sentence: how many kinds of caterpillar it feeds, how many creatures we can
  name that depend on it, the months it flowers, and how tall it grows in both
  feet and metres. A plant that holds up more of the food web than most also
  wears a *Keystone* badge. All 198 of them.

### Changed

- Internal: every CI job has a name that says what it does, so a check reads
  `Registry / Rebuild, audit & taxon-id coverage` rather than `Registry /
  check`. Job ids are untouched (`needs:` still resolves), and `main` has no
  required status checks to re-point.

- **Every screen that reuses an answer you already gave says so, in one line.**
  A sentence and a link to where it's kept — not a box of small print between
  you and the question. What's remembered is explained once, in Settings, which
  is where you go to change or forget it.

- **Indigene's French is now, plainly, the French of France.** The same plant
  can go by one name in Paris and another in Québec — a *bleuet* is a blueberry
  in Montréal and a cornflower in France — and until now Indigene had been
  taking names from both countries' reference lists at once. It follows
  France's lists only from here on, and [where the names come
  from](https://indigene.app/#/sources) says which French it means and why.
  Anyone whose phone is set to Canadian French still gets this edition: reading
  France's French beats reading English, and we'd rather say which one it is
  than pretend it's both.

- **Several dozen North American plants keep their French name, with an honest
  label on it.** Those names came from the Canadian list, so the app can no
  longer say that's where they're from. Nearly all of them are what a French
  gardener would say anyway, so they stay on screen while each is traced back
  to a French list — and the ones no French list has ever named will go back to
  showing the scientific name, which is nobody's dialect.

- Internal: the locale is declared once, as `LOCALE` in `lib/i18n.ts` (`fr` →
  `fr-FR`), and stamped on `<html lang>` and every `Intl` formatter. Name
  sources are locale-scoped in `lib/names.ts`: `TAXA_FR` is a
  `NameTable<FrenchSource>`, so VASCAN — kept in `NameSource` as the fr-CA
  authority it is — is a compile error in the French table rather than
  something a reviewer has to catch. The 87 rows it had supplied now carry
  `src: "pending"`.

### Fixed

- **The link you copy is now the link that shows the plant.** Every plant,
  region and creature already had its own preview — the little card with a
  title and a picture that Messages, WhatsApp, Slack or Facebook show when you
  paste a link. It only ever worked for addresses like
  [indigene.app/plants/asclepias-tuberosa](https://indigene.app/plants/asclepias-tuberosa),
  and the address bar never showed you one of those: it showed
  `indigene.app/#/plants/asclepias-tuberosa`, with a `#` in the middle.
  Everything after a `#` stays on your own device and is never sent to the
  website, so a link copied from the address bar arrived with no way of knowing
  which page you meant, and the card fell back to the plain "Indigene" one.
  Opening a good link was enough to spoil it — the app swapped the address for
  the `#` version the moment the page finished loading. Now it keeps the
  sendable address, so copying from the address bar, using your phone's share
  button, and tapping Indigene's own 🔗 all send the same working link.

- **A few saved links no longer land on "we couldn't find that page."** Opening
  [Language](https://indigene.app/settings/language) or
  [Units](https://indigene.app/settings/units) from a bookmark showed the
  not-found page instead of the setting, and so did a link to the
  [look-alikes](https://indigene.app/lookalikes) of one particular region.

- Internal: the seven form glyphs move from `components/plant-card.ts` to
  `components/plant-glyphs.ts` — same geometry, no DOM — so `silhouetteFor`
  (browser) and `glyphMarkup` (headless) draw one set from one table.
  `scripts/gen-plant-cards.mjs` renders the 1200×630 cards; they're committed
  under `public/og/plants/` and `prerender.mjs` only points at them, so a build
  never runs Playwright. `--check` reports a plant with no card. The four fact
  icons are drawn to the glyph set's rules rather than set as emoji: at
  thumbnail size, four full-colour emoji on one flat green-on-dark card read as
  clutter. They're JPEG at quality 90 (~48 KB each, 9.7 MB for the catalog):
  the brand wash is a smooth gradient, which puts the same card at 224 KB as a
  PNG — 47 MB across the catalog — and at 1:1 the JPEG is indistinguishable
  from lossless. Nothing but a link unfurler ever fetches them, so the weight
  is a repository cost, not a page-load one. `check-routes.mjs` now also
  verifies every page's `og:image` resolves to a file that was actually built.

- Internal: share cards carry the plant's **illustration, never its hero
  photograph**, written down in `docs/hero-photos.md` and in the generator's own
  header because that's where someone would be tempted. Four of the five
  licences the harvest accepts require attribution and a share card can't carry
  any — it lands in a chat as a bare image with nowhere to put the credit, which
  is the one rule that pipeline doesn't break. Compositing would also make the
  card a derivative work (two of those licences are ShareAlike), and committing
  it would republish someone's photo permanently, where the in-app hot-link
  honours a deletion or a licence change at once.

- Internal: the card generator measures each card in the browser before
  capturing it and refuses to write one that doesn't fit — a fact label wrapping
  onto two lines, the name and the drawing colliding, a row overflowing. That's
  CLAUDE.md's don't-let-a-label-wrap rule applied to a surface nobody re-opens
  once it's committed, and it makes the largest icon size the fact row can carry
  a measured number rather than a guess. The fact icons were redrawn: circles
  are now written as two explicit arcs, because the shorthand
  `M cx cy a r r 0 1 0 0 -.01` starts at the circle's *edge*, not its centre —
  every shape sat half a radius right of where it was placed, which ran the
  caterpillar's head past its viewBox and let the edge slice it flat.

- **Nothing can quietly ship a plant whose link doesn't work.** Every plant,
  animal and region has a page at its own address, and that address is what
  gets sent when you share one. Adding a new plant used to be able to skip
  building that page: the plant looked perfect inside the app, and only the
  person who received the link found out — they'd get "we couldn't find that
  page" and a preview of nothing in particular. A check now runs on every
  proposed change and refuses it if a single one is missing.

- Internal: `src/lib/routes.ts` is the one list of what counts as a page —
  `APP_STEPS`, `PARAM_STEPS`, `SHAREABLE_INDEXES`, `parseRoute`,
  `canonicalPath`, `shareablePaths` — imported by `main.ts` (which types its
  `STEPS` table as `Record<AppStep, …>`, so the two can't drift without a
  compile error), by `prerender.mjs` (which now throws if its page list and
  `shareablePaths()` disagree, before writing a file) and by the new
  `scripts/check-routes.mjs` / `npm run routes:check`. That check runs in a
  `Routes` workflow after a build and verifies five things: every shareable
  address has a file in `dist/`; no prerendered file exists for an address the
  app never hands out; each file's canonical link, `og:url` and title name
  itself rather than the shell's; every address round-trips through
  `parseRoute` → `canonicalPath` back to itself; and `public/404.html`'s
  hand-kept `ROUTES` covers every step in `APP_STEPS`. All six failure modes
  were verified by breaking them one at a time.

- Internal: `main.ts` reads the path as a route alongside the hash and keeps the
  canonical one in the address bar (`pathRoute`, `canonicalPath`,
  `syncAddressBar`) instead of folding every path into the hash form on boot
  (`normalizePathRoute`, removed). Canonicalization is limited to routes
  `scripts/prerender.mjs` actually wrote a file for, so flow steps and
  sub-routes (`#/wildlife/in/<region>`, `#/settings/units`) keep the hash — the
  only address that reloads them. A `popstate` listener joins `hashchange`,
  because a back step between two path addresses changes no hash and used to
  move the address bar while leaving the old page on screen; `routedHref` keeps
  a hash traversal, which fires both, from rendering twice. The plants index's
  `?q=` moved to the search string and is dropped on a route change rather than
  trailing onto the page it opened. `public/404.html`'s `ROUTES` had drifted
  from `STEPS` — `priorities`, `lookalikes`, `settings` and `about` were
  missing.

- **The quarterly check that keeps those names honest had stopped checking.**
  Four times a year Indigene re-asks each national reference list whether the
  names it shows are the names that list gives. France's national list had been
  answering nothing at all — every question, the whole run — and the check read
  that silence as "no French name exists for any of these 258 plants and
  animals", then took the Canadian answers as the truth. It asks properly
  again, and from now on a list that answers nothing fails the check loudly
  instead of passing as a clean result.

- Internal: `check-vernacular.mjs` is locale-driven (`LOCALES` maps `fr` →
  fr-FR + its authorities). TAXREF is asked for `application/hal+json`, which
  is what it serves — the plain-JSON `Accept` was returning 406 for every
  lookup — and falls back to `/taxa/{id}` when the search projection carries no
  vernacular name. Tela Botanica (BDTFX → NVJFL) is wired up at last as the
  second French opinion. A Wikidata `fr` label equal to the binomial is
  discarded rather than reported as a disagreement. Every request's status is
  recorded per source in the snapshot's new `health` block, requests are paced
  and retried on 429/5xx, and `pending` rows are reported with the source to
  promote each to.

## [0.18] - 2026-07-31

**Room to read, and the look-alikes named**

[![A plant's page using the whole of a laptop screen](docs/screenshots/pr-78/thumb.png)](docs/screenshots/pr-78/plant-after-dark.png)
[Before](docs/screenshots/pr-78/plant-before-dark.png) · [After](docs/screenshots/pr-78/plant-after-dark.png)

### Added

- **A new section of the app for the plants that get mistaken for natives.**
  [Look-alikes](https://indigene.app/#/lookalikes) is a list of the impostors —
  the Callery pear sold beside the serviceberry, the cherry laurel hedge that
  reads as holly, the sago palm that isn't a coontie — and each one has a page
  showing, side by side, the differences you can actually check while standing
  in front of them: a smell, a thorn, a hollow twig, a leaf stalk that bleeds
  milky white. Every page links straight to photographs of the impostor on
  iNaturalist, says where it's really from and what it does here, and cites who
  says so. Start with the
  [Callery pear](https://indigene.app/#/lookalikes/pyrus-calleryana), or with
  [meadow death camas](https://indigene.app/#/lookalikes/toxicoscordion-venenosum),
  where the look-alike is a bulb that can kill you.

- **Every plant page says what it gets confused with, in one line.** Under
  "Why it belongs here" you'll now find *Don't confuse it with* and the names,
  each a link to the full comparison. One line, so the plant's own story keeps
  the page.

- **The label says which kind of impostor it is.** Some of these spread into
  wild places and cost us something; some are ordinary garden plants that
  simply aren't from here and do no harm; one or two grow here wild, just like
  the plant they're confused with. Calling them all bad would be false, so each
  is marked *Invasive here*, *Not from here* or *Native here too* — for the
  region you're looking at. The same plant can be both: common ivy is invasive
  in North America and an ordinary native climber in Atlantic France, where we
  recommend it, and the page says so and links to it.

- Internal: new `data/lookalikes.ts` (27 impostors, 36 region-keyed ties) with
  `lib/lookalikes.ts` as its query layer and a dev audit — every tie must cite
  a source, name at least one tell, fill in both sides of every tell, and may
  not call a plant introduced in a region whose own roster lists it as native.
  Status lives on the tie, never the catalog, for exactly that reason.
  `steps/lookalikes.ts` serves `#/lookalikes`, `#/lookalikes/in/<region>` and
  `#/lookalikes/<id>`, all three prerendered with their own share cards.

- Internal: `scripts/check-lookalikes.mjs` (`npm run lookalikes:check`)
  corroborates each tie against iNaturalist's `identifications/similar_species`
  counts — the community's own record of which plants people really do
  misidentify — and with `--suggest` reports frequent confusions the catalog
  says nothing about. It never gates the build: an unbacked tie is usually a
  garden plant nobody photographs in the wild, not a false claim. Provenance
  for the whole layer is written up in `DATA_SOURCES.md`.

- Internal: French vernacular names for twelve of the impostors (TAXREF, plus
  VASCAN for Callery pear), and `check-vernacular.mjs` now verifies look-alike
  names alongside plants and animals. The three Atlantic-France ties are
  translated in full — that region's pages are otherwise entirely in French —
  and `lookalikesUntranslated()` makes the "still in English" notice cover this
  writing too, so a page can't quietly grow an English block.

- Internal: bundle re-measured after the new data — ~250 KB → ~268 KB gzipped;
  the figure updated in `README.md`, `PROJECT_BRIEF.md`, `app/README.md` and
  `docs/ecoregion-plan.md`.

- **Reading about a plant that grows in more than one region? You can switch.**
  Those plants now have a row of buttons under their name — *Figures for:
  Mid-Atlantic · North & Central Florida* — so you can see how the same plant
  behaves somewhere else, and link straight to that version. Plants native to
  only one region look exactly as they did.

### Changed

- **The little plant drawings are clearer.** Every plant that has no photo yet
  is drawn as a small green shape, and the same drawing labels each category on
  a region's page — trees, shrubs, wildflowers, grasses, climbers, ground
  covers, ferns. They were a mismatched bunch: some were solid blobs, others
  thin outlines you could barely see, and they came in all sizes, so a row of
  them looked like seven different sets. They're one family now — same size,
  same weight of line, all standing on the same ground — and each one is drawn
  to say what it is at a glance: a tree is a leafy crown on a bare trunk, a
  shrub the same foliage sitting on the ground, a ground cover a low fan
  spreading sideways, a climber a shoot with the curled tendril it grabs on
  with. The little pictures beside a region's category headings are bigger too,
  so they read next to the words instead of hiding beside them. See them on
  [any region's page](https://indigene.app/regions/france-atlantic).

- Internal: `silhouetteFor` in `components/plant-card.ts` now renders a table of
  parts (filled masses, stems stroked at one weight) rather than a single path
  per form with a per-form fill/stroke switch, and the stem weight scales below
  ~20 px so a 17 px chip glyph keeps 1.4 px of ink. The geometry is generated by
  `scripts/gen-form-glyphs.mjs` — edit there and paste its output back over
  `FORM_GLYPHS`. `steps/region.ts` takes a size for `formIcon`, and passes 24
  for section headings against 17 for chips.

- **A plant's page fits a computer screen now.** Open
  [a plant](https://indigene.app/#/plants/quercus-alba) on a laptop and it used
  to be a narrow phone-shaped strip down the middle of the window, with empty
  space either side and five screens of scrolling to get to the end. It now
  uses the room it has. At the top, the plant's name, badges and the numbers
  at-a-glance sit on the left, with the to-scale drawing of how big it gets and
  the paragraphs about it on the right. Below that, the sections — what it does
  for the ecosystem, photos of it growing near you, how to grow more, *Want to
  plant it? Check your spot*, and where to look it up — run in two columns
  instead of one long queue. The whole page is a little over half as tall as it
  was, and the "check your spot" tool is now on screen early rather than at the
  very bottom. Reading down the left column and then the right gives you exactly
  the same order a phone gives you, and no sentence is set any wider than it is
  on a phone.

- **An animal's page got the same treatment.** On
  [an animal](https://indigene.app/#/wildlife/monarch), its name and what it is
  now sit beside where it lives and what we can vouch for, and the plants that
  keep it going are laid out several across instead of one long stack of
  full-width rows. It's about a third shorter on a laptop.

- **The "ZIP or town" box is the size of a ZIP or a town again.** It used to
  stretch to fill whatever space was left on the line, which was fine on a
  phone and silly on a wide screen — on an animal's page it became a box half a
  window wide waiting for five characters. It now stops at a comfortable width,
  and so does the list of places that appears when you search. Unchanged on a
  phone, where "fill the line" was always the right answer.

- **The *Figures for* buttons line up with the rest of the page.** On a plant
  that grows in more than one region, the row of region buttons under the name
  was sitting a little further left than everything around it. It doesn't any
  more.

- **Where to look a plant up has moved to the very bottom of its page.** The
  list of botanical databases is where you go once this page has run out of
  answers, so it now comes after *Want to plant it? Check your spot* rather
  than in front of it — on every screen. Nothing else about either section
  changed.

- Internal: `#/plants/<slug>` and `#/wildlife/<id>` share a new layout mode
  (`body[data-layout="profile"]`), which raises `--maxw` to the same 62rem the
  browse indexes use — but only inside `@media (min-width: 64rem)`, so the
  narrow measure holds everywhere below the laptop breakpoint. Each profile's
  pieces are wrapped in `.plant-cols` / `.plant-sections` column containers that
  are `display: contents` until that breakpoint, so the phone DOM flows exactly
  as before; every split is contiguous, so visual order never diverges from DOM
  order. An animal's supporting plants become a `.wildlife-supports` grid
  (`auto-fill`, 24rem floor, so a lone card doesn't stretch across the window),
  and `supportRow` trades its inline styles for `.support-row`. The location
  prompt's `flex: 1 1 7rem` field gains a 14rem cap and the block around it a
  32rem one (`.spot-prompt`), with the plant page's own town search capped to
  match (`.town-search-row`); the GPS button keeps `flex: 0 0 auto` so it can't
  wrap at 360px. Wrapping the profile's pieces moves its paragraphs out of reach
  of `.plant > .kv`, so `.plant-why` and `.lookalike-line` carry the gutter by
  class while the `>` rule stays for the impostor pages, whose card keeps its
  paragraphs as direct children; `.region-switch` joins them and gains the
  gutter it never had. An impostor's own page (`#/lookalikes/<id>`) is a short
  comparison and stays at the reading measure. Verified by pixel-comparing 390px
  full-page captures against `main` in both schemes — identical on every animal
  page, both look-alike pages and seven other routes, and identical in height on
  plant pages (single- and multi-region, with and without a look-alike line),
  where only the last two sections swap — and by checking 360–1920px for
  horizontal overflow (none).

### Fixed

- **A plant that grows in two regions was telling some readers the wrong
  thing.** Indigene keeps separate notes for a plant in each region it's native
  to, because the same species really does behave differently — butterfly weed
  survives winters down to zone 3 in the Mid-Atlantic but only to zone 8 in
  Florida, and goat willow is a different height, and has a different French
  name, in the Alps than on the Atlantic coast. The plant's page was always
  showing whichever region came first in our internal list, so someone in
  Florida looking up butterfly weed from their own Florida list was reading the
  Mid-Atlantic's numbers. It now shows the notes for **your** region. Seventeen
  plants were affected.

- Internal: `steps/plant.ts` resolves the displayed row via `activeEntry()`
  (`?region=` → `draft.regionOverride` → `regionForSite(draft)` → first) instead
  of `entries[0]`, which was REGIONS-array order. The suitability checker's
  region lede follows it, so page and verdict can't disagree about "here".
  Region is carried as a hash query, not a new route: it's page state, and one
  plant keeps one address and one share link. `shoot.mjs` gains `--then <hash>`
  for photographing a page that depends on the reader's region.

## [0.17] - 2026-07-31

**Real pages, and photos that stay**

[![The tidied “See it growing near you” section on a plant's page](docs/screenshots/pr-74/thumb.png)](docs/screenshots/pr-74/after-dark.png)
[Before](docs/screenshots/pr-74/before-dark.png) · [After](docs/screenshots/pr-74/after-dark.png)

### Added

- **The preview now describes the page you actually sent.** Until now, every
  Indigene link showed the same card, whatever it led to. Share
  [butterfly weed](https://indigene.app/plants/asclepias-tuberosa) and the card
  says "Butterfly Weed (Asclepias tuberosa)" and what it does for monarchs;
  share [the Pacific Northwest](https://indigene.app/regions/pnw) or
  [the monarch](https://indigene.app/wildlife/monarch) and you get that page's
  own words. Every plant, every region and every creature has its own now — 261
  pages in all. Only the picture is still the same on every link; a picture of
  the plant itself is the next step.

- **Found photos are a gallery now.** They used to arrive as a stack of boxes,
  one per sighting, each with a line of small grey type under it — so four
  photos filled the screen and three of them were words. Now every photo the
  lookup found sits in one grid of thumbnails you can take in at a glance. Tap
  any of them and the big view tells you who took it, the licence they share it
  under, where and when they saw it, and links to their original record — the
  credit moved to where you're actually looking at the picture. On a computer,
  hovering a thumbnail shows how far away and how recent it is.

- **Fewer words, fewer boxes, above those photos.** The paragraph explaining
  the lookup is now one line. *My location* and the postal-code box share a
  single row instead of taking three. The promise about your location is a
  link — [How your location is used](https://indigene.app/#/privacy) — which
  opens the privacy page at the section that answers it, rather than a
  paragraph repeated on every plant page. And the button for looking a plant up
  elsewhere just says *Where it's native* when there's only one region to
  choose.

- **Photos you've already seen don't download again.** Once a plant's sightings
  have loaded, the pictures are kept on your device — so coming back to that
  plant is instant, and works with no signal at all, the same way a spot you've
  already looked up does. Indigene keeps the most recent few hundred photos and
  quietly lets the oldest go, so it never grows without limit.

- **Opening one photo gets the rest ready.** The moment you tap a picture,
  Indigene starts fetching the full-size version of every other photo in that
  set, one at a time and gently in the background. Swiping on to the next one
  is then immediate instead of a wait — you're walking a gallery, not loading a
  page each time.

- Internal: the service worker gains a bounded, cache-first `PHOTO_CACHE` for
  `inaturalist-open-data.s3.amazonaws.com` and `static.inaturalist.org`. It
  re-issues each `<img>`'s no-cors request in **cors** mode before storing:
  opaque responses are quota-padded (~7 MB each in Chromium), which silently
  exhausted the origin quota at ~132 entries and made every later `put()`
  throw. `store()` now catches a quota rejection, drops the oldest quarter and
  retries once. Verified with Playwright: one network fetch per URL, the 240
  cap holding at 300 distinct photos with the newest kept, and photos still
  rendering after `setOffline(true)`.

- Internal: `lightbox.ts` warms the reel on open — every other frame's
  `largeUrl` fetched serially at `fetchPriority = "low"`, guarded by a
  `reelToken` that goes stale on close. Verified: 6 of 6 larges pulled after
  open, nothing pulled after Escape.

### Fixed

- **A plant's own address used to answer "page not found".** Not to you — the
  app opened fine — but to the machines that build the little preview boxes in
  Messages, Slack and WhatsApp. So a link to a plant either previewed as the
  app in general or, in some apps, showed nothing but the bare address. Every
  page Indigene invites you to share is now a real page at its own address, and
  answers as one.

- **"See it growing near you" was coming up empty for plants that are all over
  the place.** Ask about a common oak or a maple in a town where thousands of
  people have photographed one, and Indigene would answer that nobody had.
  It was our fault, not iNaturalist's: instead of asking about the plant you
  were looking at, we asked for the hundred most recent photos of *every*
  native in your whole region and then hunted for yours among them. In a busy
  area those hundred photos cover about a week, so any plant nobody happened to
  photograph that week looked, to us, like a plant nobody had ever
  photographed. Indigene now asks about one plant — the one whose page you're
  on — and gets a real answer. Photos of a subspecies or a variety count now,
  too; they were being thrown away, even though they're the same plant.

- **When iNaturalist is simply busy, Indigene says so.** Every hitch used to
  read "we couldn't reach iNaturalist", which sounds like something is broken.
  Being asked to slow down for a minute now says that instead, so you know to
  just try again.

- **The little captions on the photo thumbnails are gone.** They tried to fit
  "under 1 km away · seen June 2023" into a 90-pixel square, so they cut off
  mid-word and spilled over the edge of the picture — and on a phone, which has
  no hover, you could never see them at all. Tap a photo and the big view tells
  you all of it, in a size you can actually read.

- Internal: `lib/nearby.ts` now queries iNaturalist per taxon
  (`taxon_id=<this plant>`) and caches under `plant:<inatId>:<area>`, replacing
  the region-wide fetch-once-and-index-by-taxon shape. That shape shared a
  100-row page across a region's ~40 natives ordered by `observed_on desc`, so
  coverage collapsed to the last few days in any well-observed area, and
  descendant-rank observations were dropped by the exact-id join. `nativesOnly`
  and `indexByTaxon` are gone — a single-taxon query makes both guarantees hold
  by construction — and `wildlife-sightings.ts` now shares `loadSightings`
  rather than keeping its own copy. HTTP failures throw a typed `InatError`
  carrying the status, so 429/5xx reads as "busy" rather than "unreachable".

- Internal: `scripts/prerender.mjs` runs after `vite build` and writes
  `dist/<route>/index.html` for all 261 shareable routes — the built shell with
  its head metadata swapped for that page's. Titles and descriptions come from
  the app's own English dictionary (`locales/en.ts`) so a card can't drift from
  the page it opens; the plant descriptions are each row's `nativeNote` plus
  `givesNote`. Each copy also gets `hreflang` alternates naming *itself*, which
  is what `index.html`'s comment said needed per-page files. The script fails
  the build if `index.html` grows or loses a share tag it doesn't re-emit.
  `404.html` keeps its bounce for deep links (`/plants/<slug>/ecosystem`),
  flow steps, and the retired `/search` address, and
  `renderExplore`/`renderBrowse`/`renderPlants` now set a `document.title`
  so the app and the prerendered file agree.

## [0.16] - 2026-07-30

**Say what the spot is for**

[![The new Goals step: pick what the spot should do](docs/screenshots/pr-72/thumb.png)](docs/screenshots/pr-72/goals-after-dark.png)
[Before](docs/screenshots/pr-72/goals-before-dark.png) · [After](docs/screenshots/pr-72/goals-after-dark.png)

### Added

- **Indigene asks what you want the spot to do, before it shows you plants.**
  There's a new step in the walk — **Goals** — between the soil question and
  your plant list. Pick one: *feed the most wildlife*, *butterflies & moths*,
  *birds*, *stop erosion*, *soak up rain*, *easiest to grow*, or *a bit of
  everything*. Each one says in a line what it favours, so the order of your
  list is something you chose rather than something that happened to you. The
  setting Indigene starts with is one of those goals too, named and explained
  — it isn't a hidden default any more.
- **You can see what a slider does while you move it.** Open *Fine-tune each
  one* on the Goals step and the seven things a plant can do — feeding
  caterpillars, feeding bees, soaking up rain — each have a slider that says
  its setting in words ("counts a lot", "ignore it") rather than a bare number,
  with a line underneath explaining what the thing actually means. Above them,
  a panel that follows you down the page names the three plants leading right
  now, and reshuffles as you slide.
- **Indigene says out loud when it has recalculated — even when nothing
  moved.** Change a goal, move a slider, tick a filter, and a line reports what
  happened: *"Recomputed — Black Cherry now leads"*, *"Recomputed — 21 plants
  changed places"*, or plainly *"Recomputed — the order didn't change"*. Silence
  used to be ambiguous: you couldn't tell whether nothing had happened or
  nothing had changed.
- **Tap any plant in your list to open its full page — and get back to your
  list where you left it.** Every card in the ranked list is now a door to that
  plant's own page, with everything it has ever known about it: the stat tiles,
  the to-scale drawing, the seven scores explained, how to grow more of it, and
  which creatures depend on it. At the top of that page is *"← Back to your
  plant list"*, and taking it puts you back at the plant you tapped, not at the
  top of the list.
- **A bee has moved into the logo.** Point at the Indigene name at the top of
  any page — or reach it with the Tab key — and a bee buzzes in, crosses the
  name to the little seedling looking for pollen, casts about, finds nothing
  but leaves, and trudges home. The moment its back is turned the seedling
  opens into a flower, so it races the whole way back and settles in to feed.
  It is there to be enjoyed and nothing else: the name still takes you
  [home](https://indigene.app/#/) in one tap, screen readers don't announce
  any of it, and if you've asked your phone or computer to keep animations to
  a minimum, the bee simply appears beside the name without flying anywhere.

### Changed

- **The cards in your plant list are much shorter.** Each one now carries what
  you need in order to decide whether to open it: the name, whether it suits
  your spot and why, how big it gets, what it does for you and for wildlife,
  and the two things your goals weighted most heavily — *"Counts most here:
  🐛 Feeds baby butterflies & moths and 🐦 Feeds & shelters birds"*. Everything
  that used to be repeated on all twenty-five cards is one tap away on the
  plant's own page. A single card used to run more than two phone screens tall;
  it's now about two thirds of one.
- **The plant list is a list again, not a control panel.** The ⚖️ sliders panel
  that sat above it has gone to the Goals step; in its place a line says what
  the list was ranked for — *"⚖️ Ranked for: Feed the most wildlife"* — with a
  **Change** button beside it. Filters stay where they were: they narrow what
  came back rather than reorder it, which is a question you ask after seeing the
  list, not before.
- **A heading that leads somewhere now looks like it.** On a region's page, the
  headings that group its plants — Trees, Shrubs, Grasses & sedges — each open
  a page of their own, and so do the group headings on the
  [Wildlife](https://indigene.app/#/wildlife) page and the place names on an
  animal's page. They used to be marked with a plain underline, which ran under
  the little picture in front and the count in brackets behind, so the line
  started before the words and stopped after a bracket. Now each one ends in a
  small green arrow pointing the way the tap goes, and the count sits beside it
  as a quiet round badge instead of "(14)". The region cards on
  [Regions](https://indigene.app/#/regions) lost their underline too: the whole
  card was always the link, so underlining one word was telling you the wrong
  thing.
- **The plants list has a simpler address and a proper wide layout.** It now
  lives at **[indigene.app/#/plants](https://indigene.app/#/plants)** — the
  page the **Plants** menu leads to — and a search you've typed is shareable as
  `#/plants?q=oak`. Old `#/search` links still work; they land on the same page
  with whatever you searched for already filled in. On a laptop the list now
  spreads into three columns of cards instead of one phone-width ribbon down
  the middle of the screen, the way the Regions and Wildlife pages already did,
  and each card shows the regions that plant grows in.
- **The little mark in your tab is a seedling now.** Two pointed leaves rising
  from a bent stem, where it used to be two matching ovals on a straight bar —
  which, shrunk to the size of a browser tab, read as a diagram of something
  rather than a plant. It changes on your home screen too, if you've installed
  Indigene there.
- Internal: the app mark is redrawn as a seedling — two pointed, curved leaves
  meeting a bent stem at different heights — replacing the two symmetrical
  ellipses on a straight bar, which read as anatomy rather than botany at icon
  sizes. `scripts/gen-icons.mjs` is now the only place the geometry lives: it
  rasterises the PNG icons *and* writes the vector copies (`public/favicon.svg`
  and the block between the `mark:` markers in `public/404.html`) from the same
  numbers, so the three can no longer drift apart. A leaf is the lens between
  two circular arcs and the stem is a stroked Bézier — evaluated by signed
  distance in the rasteriser, emitted as arc and curve commands in the SVG.

## [0.15] - 2026-07-30

**Indigene speaks French**

[![The home page, in French, on a phone](docs/screenshots/pr-66/thumb.png)](docs/screenshots/pr-66/home-after-fr-dark.png)
[Before](docs/screenshots/pr-66/home-before-fr-dark.png) · [After](docs/screenshots/pr-66/home-after-fr-dark.png)

### Added

- **Indigene speaks French.** Every word of the app — the screens, the buttons,
  the plain-language explanations, the privacy and sources pages — is now
  available in French as well as English. It picks your language from your
  phone or browser the first time, and you can change it whenever you like from
  **Réglages / Settings**, reachable from the bottom of every page.
- **You choose your own units, whatever language you read in.** Heights,
  rainfall and winter cold can be shown in metres and °C, or in feet and °F,
  and the choice is completely separate from the language. A French speaker
  gardening in Ohio can read in French and measure in feet; an American in
  Bordeaux can read in English and measure in metres. Left alone, it simply
  follows whatever your phone's region uses. See
  [Settings](https://indigene.app/#/settings).
- **Plants and animals are called by their French names.** *Quercus robur* is
  "Chêne pédonculé", not a translation of "Pedunculate Oak" — because that's
  the name recorded for it in France's own national reference list. The names
  come from TAXREF (the Muséum national d'Histoire naturelle), Tela Botanica,
  and — for North American plants that France has never needed to name — the
  Canadian VASCAN list. Where nobody has given a plant a French name, we show
  its scientific name rather than inventing one, and the page says so. Where
  each name comes from is set out on the
  [Where our numbers come from](https://indigene.app/#/sources) page.
- **Send someone a link that opens in French.** Put `?lang=fr` on the end of any
  Indigene address — [indigene.app/?lang=fr](https://indigene.app/?lang=fr), or
  `indigene.app/plants/quercus-alba?lang=fr` for a particular plant — and it
  opens in French for whoever you sent it to, no matter what language their
  phone or computer is set to. `?lang=en` does the same for English. Indigene
  remembers the language from then on, so the rest of their visit stays in it.
  One thing a link will never do is overrule someone: if they have already
  chosen a language in Indigene themselves, that choice stands and the link
  quietly leaves it alone.
- The size drawing, the plant cards and the "no taller than…" filters all read
  in your units: a tree is "24 m × 21 m" or "80 ft × 70 ft", and the ruler up
  the side of the drawing is marked in whole metres or whole feet — never in
  the awkward converted numbers you'd get from just swapping the label.
- Search engines are now told that Indigene exists in both languages, so a
  French-speaking searcher can be offered the French page instead of one
  language being listed and the other hidden.
- **An [About page](https://indigene.app/#/about)**, linked from the bottom of
  every page. It says why Indigene exists — most gardens are green and nearly
  lifeless, and one native plant restarts the food web the same season — who
  it's for, and the five things it refuses to do: never use a word it hasn't
  explained, always show its error bars, never state a number it can't trace to
  somebody else, never ask anything of you, and keep working where the signal
  doesn't.
- [Browse by wildlife](https://indigene.app/#/wildlife) now has a **"Filter by
  name…" box** at the top, the same one the plant lists have. Type "swallow"
  and the page keeps only the swallowtails; type "hummingbird" and you get the
  bird and the moth named after it.
- Each group of creatures also has **its own page** now — just the
  [butterflies](https://indigene.app/#/wildlife/butterflies), just the
  [moths](https://indigene.app/#/wildlife/moths), just the
  [bees](https://indigene.app/#/wildlife/bees),
  [birds](https://indigene.app/#/wildlife/birds), or
  [mammals & others](https://indigene.app/#/wildlife/mammals). A row of buttons
  hops between them, so "show me only the moths" is one tap and a link you can
  send to someone.
- **Pick a region on the wildlife page and see only the creatures that live
  there.** [Browse by wildlife](https://indigene.app/#/wildlife) now has a
  "Show the wildlife of" picker at the top. Choose the Pacific Northwest and
  the list narrows to the 15 creatures its native plants support — and the
  plant count on each card counts only that region's plants, so nothing on the
  page is claiming more than it should. It works together with the group
  buttons, so ["the butterflies of the French
  Alps"](https://indigene.app/#/wildlife/in/france-alpine/butterflies) is a
  page, and every combination has its own web address you can bookmark or send
  to someone.
- **Your plant list for a spot has the same "Filter by name…" box.** After
  Indigene ranks the natives for where you're standing, you can type a name to
  pull one out of the list — "oak", "milkweed", "fern" — and the part you typed
  is underlined in green on each card that matches. It searches the *whole*
  ranked list, not just the twenty-five cards on screen, so a plant sitting at
  number thirty still turns up.

### Changed

- **The menu at the top of every page now says what each page holds.**
  "Explore" is now **[Regions](https://indigene.app/#/regions)** — the places
  Indigene knows, from Florida to the Piedmont — and "Search" is now
  **[Plants](https://indigene.app/#/plants)**, which lists every plant on
  Indigene's list and lets you type a name to narrow it down.
  **[Wildlife](https://indigene.app/#/wildlife)** keeps its name. In French the
  three read **Régions**, **Plantes** and **Faune**.
- **The bookmark button at the top of every page is now a ⚙️ menu**, and it
  holds your language and your units as well as your saved spots. It used to
  lead only to saved places, which meant the one setting a reader might
  urgently need — the one that puts the whole app in their language — was
  reachable only by scrolling to the bottom of a page they may not be able to
  read. Now it's a tap away from the top of every screen.
- **Language and units are two separate lines, in the menu and in the footer.**
  A globe 🌐 for the language you read in, a ruler 📏 for the units you measure
  in, each opening the settings page at the choice it names. Written together
  as one "English · Imperial" line they looked like a single setting, and they
  have never been one — you can read in French and measure in feet. At the
  bottom of the page each one says what it is as well as what it's set to —
  **Language: English**, **Units: Imperial** — in whichever language you're
  reading ("Langue : Français", "Unités : Métrique").
- **The home page no longer stops to ask about language and units** halfway
  down. That belonged in the menu and the footer, not in the middle of the
  page you came to read.
- **Sharing a plant is a small link button at the top of its page**, beside
  where it says which regions the plant is native to, instead of a full-width
  button right at the bottom. Point at it (or tap it on a phone) and it says
  "Share". It's in reach the moment you recognise a plant, and it no longer
  spends a whole row of a phone screen.
- **Every creature now says where it lives, instead of wearing a "native"
  badge.** Every animal on the wildlife pages is native — that's the whole
  point of the page — so a "native" tag on all of them told you nothing. In
  its place, a creature found in more than one of our regions shows a map pin
  and a number: 📍 3 for the monarch. Hover it on a computer to read the region
  names, or tap it on a phone to open them as links — each one goes straight to
  the rest of the wildlife those regions' plants support. A creature we've
  mapped in a single region shows nothing at all, because "1" is the same
  non-fact the old badge was. Its own page still names its regions in full,
  with the sourced sentence about where it's native right below.
- When you filter a region's plant list — say you type "oak" on
  [Florida (north & central)](https://indigene.app/#/regions/florida-central) —
  the part of each name you typed is now **underlined in green**, exactly the
  way it already was on the [search page](https://indigene.app/#/search). The
  little line under the list says the same thing in both places too ("1 of 23
  plants match “oak”."), so the two ways of looking for a plant no longer
  behave like two different features.
- **Your plants come sooner on the page.** The explanation of how the ranking
  works used to sit open above the list, so every visit began with five lines
  about method. It now lives inside **What matters most?** — the panel where
  you'd go to change the ranking anyway — and opens when you ask for it. The
  first plant is about a phone-screen higher up the page than it was.
- **The buttons on your plant list moved below the plants.** "Back" and "Save
  this spot" used to sit above the list, so the first thing you met on the page
  that finally shows your plants was a way to leave it — and an offer to save a
  spot whose plants you hadn't seen yet. They now come after the list, where
  every other step in Indigene keeps its buttons.
- The French plant descriptions for **Atlantic France** — Paris, Nantes and
  Bordeaux — are written in French. The other regions' descriptions are still
  in English while we work through them, and any page showing English text says
  so plainly rather than leaving you to notice.
- Internal: the filter box, its counting line, and the match underlining now
  come from one shared component (`components/filter-field.ts`) used by the
  region rosters, the wildlife index, and — for the highlighting — the search
  page, instead of three near-copies. It holds no words of its own: every
  sentence is passed in already translated, because a count line doesn't
  survive being assembled from a noun slot in French.
- Internal: `filter-field.ts` splits into two shapes over one field —
  `filterField` hides rows already on the page, `filterBox` hands the query to
  the caller for the ranked list, which has to re-rank rather than hide.
- Internal: a hand-rolled `lib/i18n.ts` (~2 KB, no dependency) over typed
  dictionaries in `app/src/locales/`. English is the key set and every other
  locale is typed against it, so a missing or misspelt key is a compile error,
  not a blank on someone's phone. `lib/units.ts` converts at the display edge —
  the catalog keeps storing feet and °F exactly as sourced, so a units switch
  can never corrupt data.
- Internal: `app/scripts/check-vernacular.mjs` re-asks TAXREF, VASCAN and
  Wikidata whether the names we display are the names they give, and
  `.github/workflows/vernacular.yml` runs it quarterly (the build sandbox's
  egress blocks all three hosts). A name its own source doesn't back fails the
  job; a gap does not.
- Internal: `scripts/shoot.mjs` takes `--locale`, so screenshots can be captured
  as a phone in that region would render them — language *and* default units.
- Internal: the bundle is now ~240 KB gzipped (was ~179 KB) — two full
  dictionaries, the name tables and the French prose overlay. Re-measured and
  updated in `README.md`, `PROJECT_BRIEF.md`, `app/README.md` and
  `docs/ecoregion-plan.md`.
- Internal: the language and units pickers live in
  `components/prefs-controls.ts` rather than inside a screen, so the fuller
  settings screen being built separately can import them and delete the thin
  `steps/settings.ts` shell in one line.
- Internal: `scripts/shoot.mjs` takes a `--fill` flag, so a screenshot can be
  taken of a page whose interesting state only exists once something has been
  typed into it, a `--picks REGION` flag that walks the flow to the ranked
  plant list — the one page no URL can reach, because it needs a spot — and an
  `--open SEL` flag for the panels whose content only exists once opened.

### Fixed

- **Reading in French, being answered in English.** Several of the sentences
  Indigene writes for you personally were still coming out in English however
  the app was set. The one under every plant in a ranked list — "Sun is a good
  match (full sun)", "Handles the moisture here" — and the whole verdict when
  you check a spot on a plant's own page ("Ideal planting spot", "Winters here
  are too cold for it") are now written in the language you're reading, and the
  winter temperature inside them is shown in your own units. Try it on
  [white oak](https://indigene.app/#/plants/quercus-alba).
- **"Fleurit de avril"** — the flowering line on every plant said *de avril*,
  *de août*, *de octobre*, which is not how anyone writes French. It now reads
  *Fleurit d'avril à mai*, and it spells the months out in full rather than
  abbreviating them mid-sentence.
- The little line under each nearby sighting — how far away it was and when
  someone saw it — was English-only, and always in kilometres. It now follows
  both your settings: "à ~3 km · vue en juin 2023", or miles if that's what you
  measure in. The photo descriptions read out by screen readers were English-
  only too, and now aren't.
- **A page full of English no longer keeps quiet about it.** A plant's own page
  has always said when its description hasn't been translated yet — but only in
  a small note partway down, and a region's list of forty plants, the ranked
  results, and the whole [wildlife section](https://indigene.app/#/wildlife)
  said nothing at all. Every page that still has English on it now carries a
  **roadworks banner across the top**, in yellow-and-black hazard stripes:
  "Traduction en cours — ces 40 descriptions sont encore en anglais". You see it
  before you meet the English, not after you've wondered about it, and it reads
  as what it is: something still being built, and worth using meanwhile.
- Internal: `lib/ranking.ts` and `lib/explore.ts` were building their reason
  strings by hand; both now go through the dictionaries (`fit.*`, `verdict.*`),
  and `ranking.ts`'s private English `sunLabelShort` is gone in favour of
  `plain.ts`'s `sunLabel`. `whereWhen()` in `lib/inaturalist.ts` uses `t()` plus
  new `units.ts` distance formatters. The bloom sentence moved into
  `plain.ts` as `bloomSentence()`, which picks between `card.bloomRange` and
  `card.bloomRangeVowel` so the elision is a translator's choice, not a regex.
  `proseCoverage()` had never been called by anything; it and a new
  `wildlifeUntranslated()` now feed `components/wip-banner.ts`. A step
  *reports* its translation gap while rendering and `main.ts` mounts one
  banner at the top of `main` afterwards, so a page assembled from several
  renderers can't wear three of them and a step can't bury one mid-layout.
- Internal: `scripts/shoot.mjs` takes repeatable `--click` selectors and a
  `--geo lat,lon`, so a screenshot can be taken of a state that only exists
  after a tap — the spot verdict, for one. Its `--picks` walk now finds the
  region link by `data-mode` rather than by its English label, so it works
  under `--locale` too.

## [0.14] - 2026-07-29

**Its own address**

[![The new “We couldn't find that page” page, on a phone](docs/screenshots/pr-62/thumb.png)](docs/screenshots/pr-62/404-after-dark.png)
[Before](docs/screenshots/pr-62/404-before-dark.png) · [After](docs/screenshots/pr-62/404-after-dark.png)

### Added

- Indigene has a proper little sprout icon in your browser tab now, instead of
  the blank page symbol every site gets when it hasn't been given one.
- Posting an Indigene link somewhere — a message to a friend, a group chat, a
  social post — now shows a proper preview card with the name, a line about
  what the app does, and the sprout, rather than a bare address or nothing at
  all. For now every link shows the same card; showing the particular plant
  you shared is coming.
- Internal: the identifier reconcile job can now ask iNaturalist directly for
  the taxon ids Wikidata's hand-contributed property doesn't carry. Those ids
  are what join a plant's page to the real sightings shown on it, so a missing
  one means "See it growing near you" quietly has nothing to show. Run it from
  Actions → "Reconcile registry identifiers" with scope `missing-inat` (or
  `npm run reconcile -- --missing inat`) and it opens a PR with the result; a
  monthly schedule now runs the same gap-fill on its own, so a newly added
  region doesn't wait on the quarterly full pass.
- Internal: a `Registry` check on pull requests that touch plant data. It
  rebuilds the registry to catch a committed copy drifting from the catalog,
  and annotates the PR with per-region iNaturalist coverage — the gap that let
  21 of the Pacific Northwest's 44 natives, and every French region, ship with
  no taxon ids and nothing to say so. `npm run registry:check` prints the same
  table locally.

### Changed

- Indigene has its own address now: **[indigene.app](https://indigene.app/)**.
  Older links to `olivierlacan.github.io/indigene` still work — they forward to
  the new one — and everything you saved stays where it is on your device.
- The region cards on [Meet the natives](https://indigene.app/#/plants) no
  longer carry a little "USDA 6b–7a" badge. Those numbers are a gardener's
  shorthand for how cold a place gets in winter, and on a page whose only job
  is "pick where you live" they were an answer to a question nobody had asked
  yet. Each card now simply names its place. The badge is still on every
  region's own page — right where you've settled on a region and started
  asking what grows there.
- Mistyping an Indigene address used to quietly drop you on the front page, as
  though that's where you'd meant to go. Now there's a real
  **"We couldn't find that page"** page that says what happened and offers
  three ways back in — [the regions and their plants](https://indigene.app/#/plants),
  [search](https://indigene.app/#/search), and
  [browse by wildlife](https://indigene.app/#/wildlife). Links to real pages
  still go straight through, exactly as before.
- The app's icon had square corners with a faint ghost of a curve near them —
  a rounding that was drawn but never actually cut out. The corners are round
  now, on the tab icon and the one you get when you install Indigene to your
  home screen.

### Fixed

- The first pages published at [indigene.app](https://indigene.app/) arrived as
  a bare list of blue links, with no colours, pictures, or layout. The page was
  still asking for its styles and code at the old address, which lived one
  folder deeper; on the new site those files sit at the top, so nothing
  answered. They're asked for in the right place now, and the app looks and
  works the way it always has.
- Sharing a plant's own web address (like
  [indigene.app/plants/quercus-alba](https://indigene.app/plants/quercus-alba))
  works again on the new domain. Those addresses are handed back to the app on
  arrival, and the hand-off was still assuming the old, one-folder-deeper site.
- Internal: the deploy builds with `BASE_PATH: /` rather than reading
  `configure-pages`' `base_path`, which reports `/indigene` for a project Pages
  site and produced the 404ing `/indigene/assets/…` URLs. `app/public/CNAME`
  now ships the custom domain in the artifact, `404.html` folds the whole path
  into the hash route, and the release-notes pages declare their canonical URLs
  under `indigene.app`.
- Internal: reconcile no longer discards every identifier it found for a taxon
  just because neither IPNI nor World Flora Online had an entry to anchor it
  to. The anchor decides `primaryId`, not whether the rest of the bag is worth
  keeping — a plant iNaturalist knows and IPNI doesn't still deserves its
  sightings link.
- Internal: `app/package-lock.json` caught up with the 0.13 version bump.

## [0.13] - 2026-07-29

**More places, and a better way in**

[![The Explore page: one card per region, each with a starring native](docs/screenshots/pr-56/thumb.png)](docs/screenshots/pr-56/explore-after-dark.png)
[Before](docs/screenshots/pr-56/explore-before-dark.png) · [After](docs/screenshots/pr-56/explore-after-dark.png)

### Added

- **All of France is covered now, not just the rainy west.** Three more parts
  of the country have their own plant lists, each a genuinely different set of
  plants rather than the same list shuffled:
  [the Mediterranean south](https://indigene.app/#/regions/france-mediterranean)
  (Provence, the Languedoc coast and Corsica — holm oak, strawberry tree,
  mastic, cistus, thyme and lavender, where the hard part of the year is the
  dry summer, not the winter),
  [the continental east](https://indigene.app/#/regions/france-continental)
  (Burgundy, Lorraine, Alsace and the Rhône — oak, beech, hornbeam, lime,
  hawthorn and the chalk-meadow flowers that most French butterflies grow up
  on), and
  [the Alps](https://indigene.app/#/regions/france-alpine)
  (spruce, larch, arolla pine, bilberry, alpenrose and gentian, for gardens
  high enough to have real snow). Stand anywhere in mainland France and the
  app will now know which of the four lists is yours. The Pyrenees are
  deliberately left out for now: they're a different set of plants again, and
  we'd rather say "not yet" than guess.
- **A lot more to plant in the Pacific Northwest.** The
  [west-of-the-Cascades list](https://indigene.app/#/regions/pnw)
  grows from 24 plants to 44 — red alder, bitter cherry, vine maple, western
  hemlock, Oregon ash and Pacific dogwood among the trees; salmonberry, red
  elderberry, evergreen huckleberry, ninebark, twinberry and hazelnut among
  the shrubs; and, for the first time in this region, a milkweed — showy
  milkweed, the only thing a monarch caterpillar can eat, and the western
  monarch badly needs more of it.
- **Twenty new creatures on the
  [wildlife pages](https://indigene.app/#/wildlife)**, most
  of them European, so browsing by animal now works for France too. Some of
  the best stories in the whole app are in here: the
  [large blue](https://indigene.app/#/wildlife/large-blue),
  whose caterpillar eats wild thyme for a few weeks and then gets carried into
  an ants' nest, where it spends ten months eating the ants' own young; the
  [spotted nutcracker](https://indigene.app/#/wildlife/spotted-nutcracker),
  which buries tens of thousands of pine seeds each autumn and plants the next
  Alpine forest with the ones it forgets; and the
  [two-tailed pasha](https://indigene.app/#/wildlife/two-tailed-pasha),
  Europe's biggest butterfly, which can raise its young on one plant only.
- **Every release now has a page of its own.** The
  [What's new page](https://indigene.app/release-notes/)
  is one long list, which made "look at what just shipped" impossible to
  share — you could only send someone the whole page and tell them where to
  scroll. Now each release also lives at its own address, like
  [Version 0.12](https://indigene.app/release-notes/0.12/):
  tap a release's title to open it on its own, with a link back to all
  releases and links on to the ones either side of it. The address stays put
  as new releases pile up on top.
- Indigene now reaches its first place outside the United States: the mild,
  rainy Atlantic west and north of **France** — Paris, Nantes, Bordeaux, Rennes,
  Lille and the countryside between. Stand in a spot there and you'll get
  [native French plants](https://indigene.app/#/regions/france-atlantic) —
  oak and hawthorn, blackthorn and hazel, woodland bluebells, honeysuckle and
  foxgloves — ranked for your exact spot, each with what it does for local birds,
  bees and butterflies. It's a carefully chosen starter list that will grow —
  and the Mediterranean south, the Alps and eastern France have since landed
  alongside it (see above), so the whole of mainland France is covered. (The
  app itself still speaks English for now — French wording is the next step.)
- The app now understands Europe's natural regions, not only North America's.
  Online, it checks the official European map of
  [biogeographical regions](https://www.eea.europa.eu/en/datahub/eea-data-policy)
  — Atlantic, Continental, Alpine, Mediterranean — to tell whether a French spot
  is in the Atlantic zone this first list is really for, and says so plainly when
  it isn't yet.
- Elevation and slope now work anywhere in the world, not just the US: outside
  the United States the app reads the land's height from a global source, so the
  new French spots get the same "how high, how steep" reading.
- Internal: the ecoregion layer is now provider-agnostic — a spot resolves to a
  real ecoregion via US EPA (Omernik) in the conterminous US or the EEA
  Biogeographical Regions service in Europe, chosen by coordinates, both falling
  back to the coarse box offline. `EcoregionInfo` carries a `provider` + `code` +
  `name`, and a region declares the codes it covers under `meta.ecoregion`.
  See `docs/france-localization-plan.md`.
- **A page that shows our working.**
  [Where our numbers come from](https://indigene.app/#/sources)
  lays out, in plain words, where every figure in Indigene actually comes
  from — and marks each one as counted from real data, worked out by the app,
  or our own estimate. It also says what we're assuming, and names the numbers
  we think are most likely to be wrong, starting with the 0–100 scores, which
  are judgments we made rather than anything anyone measured. If you spot a
  mistake, the page tells you how to tell us. We'd rather be corrected than
  believed.
- Internal: the European Lepidoptera host-count source is identified, open, and
  now **integrated** — the Gaytán et al. 2026 species-level European
  Lepidoptera–plant interaction matrix (CC-BY 4.0, `doi:10.1002/ece3.73004`),
  which the dataset's own README confirms records *larval* hosts. A new
  `scripts/build-host-counts.mjs` (`npm run host-counts`) reduces it to a
  committed `data/sources/eu-lep-plant-matrix/host-counts.json` — 973 genera ×
  8 European zones — and reports a region's rows without rewriting them. Counted
  at genus level, filtered to members that grow in the region's zone and are
  native to Europe; the unfiltered figure is kept wherever it differs. The
  shared `HOST_ANCHOR` stays 520 and **no US score moved**. DBIF (CEH/BRC, OGL)
  remains an unrun cross-check. See `docs/host-counts-plan.md`.

### Changed

- **[Explore](https://indigene.app/#/plants) now leads with
  places, not paragraphs.** It used to open with five plant descriptions, which
  meant reading a lot before you got to the one thing you actually have to
  choose: where you are. Each card is now a region — its name, the part of the
  country it's tuned to, one native starring on the front of it, and three
  small figures for what the list adds up to. The whole card takes you to that
  region's plants. The full description of the starring plant lives on the
  plant's own page, one tap away, which is where it belonged.
- "Or browse by wildlife" has moved **below** the list of regions. It's a good
  way in, but it was being offered before anyone had a chance to look at what
  was behind the first door.
- **Explore, the wildlife list and each region's plant list now use a big
  screen properly.** On a laptop they were a phone-shaped ribbon down the
  middle with empty space either side; now the cards spread into columns, so
  you see a whole group at a glance instead of scrolling past one card at a
  time. Sentences keep their comfortable reading width — it's the cards that
  wanted the room.
- **The USDA hardiness zone is its own little badge now**, instead of trailing
  along in brackets after the place. "Pennsylvania (USDA zones 6b–7a)" is now
  "Pennsylvania" with a small `USDA 6b–7a` tag beside it — shorter, and the
  number is easy to spot because it's the one thing on the line that looks
  like a label. Hover or tap-and-hold it and it explains what the zone means;
  on the French regions it also says that American zones are a translation
  there rather than the local way of talking about winter cold. The reference
  places got shorter too, so they all read as a couple of city names rather
  than a paragraph — and on a big screen, where the region cards sit side by
  side, the tags line up in a neat column down the right of each card instead
  of landing in a different spot on every one.
- **The little counts on each card sit at the bottom now, always in the same
  place.** They used to follow the text, so they landed at a different height
  on every card and you had to hunt for them. They're also shorter — an icon
  and a number rather than a spelled-out label, which stops them wrapping onto
  two lines on a phone. Hover or tap-and-hold any of them to read what it
  means.

- **The French caterpillar counts are now counted, not estimated.** Every
  [Atlantic France plant](https://indigene.app/#/regions/france-atlantic)
  shipped with an honest guess at how many kinds of caterpillar it feeds,
  because no European tally was available to us. One is now — an open dataset
  covering 5,152 European butterflies and moths — so the guesses are gone and
  every plant carries a real figure, with the source named on its page. Almost
  all of them went up: the guesses had been cautious. Blackthorn and wild
  cherry turned out to feed 318 kinds of caterpillar rather than the 100 and
  120 we'd estimated, and cowslip 35 rather than 6. A few went the other way —
  holly feeds 7, not the 12 we'd guessed. Because these numbers help decide
  which plants we recommend first, some French results are now in a different
  order, and we think a fairer one.
- **"Where our numbers come from" is easier to read, and says "calculated"
  instead of "worked out".** The
  [page that tells you how sure we are](https://indigene.app/#/sources)
  used to be one long list where every line ended in a little capsule —
  COUNTED, WORKED OUT, OUR ESTIMATE — so you had to read eleven capsules to
  work out which numbers were solid. Now the numbers are sorted into three
  groups under plain headings — **Counted**, **Calculated**, **Estimated** —
  firmest first, with one sentence under each heading saying what it means.
  You can see at a glance that most of what the app tells you was counted by
  somebody, and that the 0–100 scores are our own judgment. "Worked out" is
  gone: the honest word is **calculated**, meaning the app does the sum itself
  from measured numbers, using a method someone else published, so you could
  redo it on paper and get what we got.
- Internal: `make-thumb.mjs` takes `--top <px>`, starting the square that many
  source pixels down instead of at the very top of the capture. A release
  whose feature sits below the fold of a full-page screenshot (0.12's "See it
  near you" section) can now show the feature rather than the page header.
- Internal: `build-release-notes.mjs` writes `release-notes/<version>/` for
  every release alongside the index, and both declare a `<link rel=canonical>`
  built from a new `SITE` constant — so a release has one address rather than
  competing with an anchor on the index. The release card renderer is shared:
  on the index its heading links to the release's page, on that page it is the
  `h1`. Thumbnails are copied once into the notes folder and reached from a
  release page one directory up. The whole `dist/` is already uploaded by the
  Pages deploy, so the subdirectories ship with no workflow change.

### Fixed

- **The menu at the top of the app no longer spills onto a second line.** On
  many phones the row of links — Explore, Search, Wildlife, and the bookmark —
  had grown just wide enough to drop below the Indigene name, making the green
  bar taller than it needed to be. The links now sit tidily on one line again,
  from small phones up.
- **Tapping "Explore" or "Wildlife" at the top of the screen now always takes
  you to the top of that page.** Two things were wrong: the page could end up
  nudged down by about the height of the green bar, and tapping the name of the
  section you were already in did nothing at all — so if you were halfway down
  the wildlife list and tapped "Wildlife" hoping to get back to the top, you
  stayed put.
- Internal: `main.focus()` scrolls `#main` into view, and `#main` starts below
  the sticky header — measurably parking the document 61px down. The
  `scrollTo(0, 0)` on the next line masked it wherever focus scrolling is
  synchronous; now the scroll happens first and the focus call passes
  `preventScroll`. A delegated handler on `.site-nav` catches same-hash clicks,
  which fire no `hashchange` and so never reached the router.
- Internal: the registry builder and its audit each kept a hardcoded list of
  regions, and both had silently fallen behind — Atlantic France shipped
  without ever reaching the registry. Both now read `data/regions.ts`. The
  registry goes from 116 to 198 taxa.
- Internal: region coverage boxes may now overlap. France's four
  biogeographical zones interlock and no set of rectangles separates them, so
  `regionsForCoords` returns every candidate box and the live ecoregion code
  picks between them; offline, the tightest box wins. Verified against 17
  French cities in both modes, and Bend, Oregon still correctly falls through
  to no list east of the Cascade crest.
- Internal: `docs/coverage-plan.md` records how to decide which natives a
  region needs next, and which open datasets (GBIF occurrences, USDA PLANTS
  county data, WCVP, DBIF, GloBI, iNaturalist phenology) can carry which
  field. The bundle figure quoted across the docs is re-measured: ~125 KB →
  ~179 KB gzipped.

## [0.12] - 2026-07-28

**See it near you**

[![A wildlife page's "See it near you" section, on a phone](docs/screenshots/pr-46/thumb.png)](docs/screenshots/pr-46/after-dark.png)
[Before](docs/screenshots/pr-46/before-dark.png) · [After](docs/screenshots/pr-46/after-dark.png)

### Added

- **See the wildlife near you.** Every creature in the
  [wildlife browser](https://indigene.app/#/wildlife) — the
  monarch, the luna moth, the gopher tortoise — now has a "See it near you"
  section. Share your location *or* just type a ZIP code, and Indigene pulls
  real, community-verified photos of that animal spotted near there, or you can
  look it up in a region where it's found without being there. The photos come
  live from iNaturalist, called by your own browser, and each one is credited
  to the person who took it — the same way the plant pages already show a plant
  growing near you. (Some entries are broad groups, like "Jays, turkeys &
  woodpeckers," that don't point at a single species; those don't offer the
  lookup.)
- **Don't want to share your exact location? Type a ZIP code instead.** Both
  "See it near you" (on wildlife pages) and "See it growing near you" (on plant
  pages) now offer sharing your location and entering a ZIP code (or town) as
  two equal choices — so you can see what's growing and flying near a place
  without handing over precise location, and it works the same on a desktop
  with no GPS.
- Internal: the wildlife layer identifies each animal to iNaturalist by its
  scientific name (already curated in the catalog), resolving it to a taxon id
  at request time via iNaturalist's taxa endpoint — synonym-tolerant, and it
  fails safe (an unresolvable name shows nothing rather than the wrong
  creature). Sightings are cached per animal + area in IndexedDB for 7 days,
  reusing the plant layer's cache machinery (`lib/inaturalist.ts`,
  `lib/wildlife-sightings.ts`). The shared photo-card and credit rendering now
  lives in `components/observation-ui.ts`, used by both the plant and wildlife
  "near you" sections; the ZIP/location choice is a shared
  `components/location-prompt.ts` used by both, feeding the existing Open-Meteo
  geocoder.
- **A Privacy & safety page**, in plain words for everyone — including kids and
  the grown-ups looking out for them. It lays out the whole story: no account,
  no tracking, no ads; your saved spots stay on your device; your location is
  used only when you tap, and you can always type a ZIP code instead of sharing
  it; and exactly which public science services your browser talks to, and what
  each is told. Reach it from the footer on any page, and from a short "🔒 …"
  note right where the app asks for your location or saves a spot. See it at
  [Privacy & safety](https://indigene.app/#/privacy).
- Internal: the Privacy & safety page and its contextual links go through a
  shared `components/privacy-link.ts`. Combined with the wildlife-sightings
  work above, the bundle is now ~111 KB gzipped.
- Every [region's page](https://indigene.app/#/regions/mid-atlantic)
  now opens with the same kind of at-a-glance number tiles a plant's page has:
  how many native plants are on the list, how many kinds of caterpillars its
  best plant can feed (up to 511 species on white oak alone in the
  Mid-Atlantic), how many kinds of wildlife we can tie to the list by name,
  and how many keystone plants it holds. Tap any tile for a plain-words
  explanation of what the number means and where it comes from.
- A filter box on region pages: start typing a name — common or scientific —
  and the plant list narrows as you type, no more hunting through 40 rows or
  bouncing out to the search page.
- The category buttons on region pages (Trees, Shrubs, Ferns…) now each carry
  their little plant silhouette, matching the drawings on the plant rows below.

### Changed

- **One tap now takes you through every sighting's photos, not just one
  person's.** When a plant or animal page finds several sightings near you, the
  photo viewer used to stop at the edge of the sighting you tapped — to see the
  next person's pictures you had to close it and start again. Now the arrows
  (and the ← → keys) carry straight on into the next sighting, all the way
  through everything on the page. It always tells you where you are — "9 / 11 ·
  sighting 3 of 4" — and as you cross from one sighting to the next, the credit
  underneath changes with it: the new photographer's name, their licence, where
  and when they saw it, and a link to that sighting on iNaturalist.
- **Bigger, tidier photo thumbnails.** A sighting's little square photos now sit
  three to a row and fill the width of the card, instead of being a fixed small
  size that left a lonely fourth picture stranded on a second row. When a
  sighting has more pictures than fit, the last one wears a small "+2" badge —
  tap it and the viewer will page through all of them.
- Internal: `observation-ui.ts` now exports `observationList()` rather than a
  per-card builder, which is what lets a thumbnail hand the lightbox the whole
  set of sightings on screen; the lightbox holds a flattened reel of
  `{photo, observation}` frames and rebuilds its credit block per frame.
  `whereWhen()` moved to `lib/inaturalist.ts` (both the card and the lightbox
  print it now, and components → lib keeps the imports one-way). New
  `app/scripts/shoot-sightings.mjs` screenshots the "near you" sections with
  iNaturalist's API and photos stubbed, for containers with no route to it.
- Opening a sighting photo is smoother now. The photo viewer that pops up when
  you tap an iNaturalist picture (on a plant's or an animal's page) used to
  open small, then jump taller and draw the photo in stuttery strips as it
  arrived. Now the viewer opens at its full size right away, shows a small
  spinning circle while the photo travels, and the finished picture fades in
  gently. The link back to the original sighting on iNaturalist is now a quiet
  underlined link under the photographer's credit instead of a big button.
- Region pages now lead with just the region's name — "Mid-Atlantic /
  Northeast Piedmont" instead of "Every native we know for Mid-Atlantic /
  Northeast Piedmont" — and say the rest in one short line underneath.
- The showcase cards on [Meet the natives](https://indigene.app/#/plants)
  are more compact: the keystone mark now sits beside the plant's name as a
  small arch, and "Full profile →" tucks in at the end of the description
  instead of taking a line of its own.
- The fine print about what "native" means on a region's page is shorter and
  plainer: native here means native to this region specifically — outside it,
  treat the picks as untested.
- The [Where are you standing?](https://indigene.app/#/location)
  step now shows one way of setting your spot at a time. Using your device's
  location leads, and a small link — "Don't want to use your location? Use a
  ZIP code or pick a region instead." — swaps in the town search or the region
  list when you ask for it, with a matching link to switch back. Less to
  scroll past, and the Next button is always close by.
- Picking your region by hand is now two taps: choose a region and the list
  folds down to just your choice (a "Show all regions" link brings the rest
  back), then press Next when you're sure — instead of being whisked to the
  next step the moment you tap.

## [0.11] - 2026-07-28

**Never a blank page**

[![The What's new page, on a phone](docs/screenshots/pr-40/thumb.png)](docs/screenshots/pr-40/notes-fixed-dark.png)

### Added

- A public [What's new page](https://indigene.app/release-notes/):
  every release of Indigene described in plain words, newest first. Nothing to
  install, no account — it's just a web page you can share.
- A "See what's new" link in the app's footer, so the notes are one tap away.
- Each release on the What's new page can now show a small picture of what
  changed, taken when the change was made. Tap it to see the full-size
  screenshot; Before and After links sit underneath when both exist.

### Changed

- The footer — the fine print about open source and data sources, plus the
  "See what's new" link — now appears at the bottom of every page, not just
  the home screen.
- The little person standing beside each plant in the growth chart now looks
  like a person — head, shoulders, arms and legs — instead of a featureless
  post, at every size from towering oak to knee-high wildflower.
- The growth chart's labels are a touch bigger and drawn in the page's
  strongest text color, so the feet markings and year captions are easy to
  read in both light and dark mode — even in bright sun.
- When you [search for a plant](https://indigene.app/#/search),
  each result now underlines the part of its name that matches what you typed,
  so you can see at a glance why it showed up. And when a plant matched through
  a name it's less commonly known by — like "Maypop" for Purple
  Passionflower — the result now says so with an "Also called" line.
- The What's new page now uses the changelog's own headings — Added, Changed,
  Fixed — instead of renaming them.
- Release notes now link to the things they describe — like the
  [wildlife browser](https://indigene.app/#/wildlife) — so
  you can go straight from reading about a feature to trying it.
- Internal: this `CHANGELOG.md` is the single source of the What's new page.
  `app/scripts/build-release-notes.mjs` compiles it to a static, app-styled
  HTML page; the Pages deploy workflow runs it on every push to `main`, and a
  `Changelog entry` PR check reminds authors to update this file (apply the
  `skip-changelog` label when nothing notable changed). `app/package.json`'s
  `version` tracks the latest cut release.
- Internal: one thumbnail per release, enforced by the compiler — a square
  480px crop made with `node scripts/make-thumb.mjs <screenshot.png>`,
  committed next to its source under `docs/screenshots/pr-<n>/`, referenced
  as `[![alt](thumb)](full-screenshot)` under the release name. Thumbnails
  are copied into the built page; full-size screenshots and other
  repo-relative links are served straight from `raw.githubusercontent.com`.
- Internal: there is no custom `Internal` changelog section — the sections
  are exactly Keep a Changelog's. A bullet prefixed `Internal:` (like this
  one) stays in the changelog and is cleaned out of the compiled page.

### Fixed

- The home page could come up completely blank — most often in Safari, and
  especially with an older Indigene tab still open in another window. The
  app was waiting forever for its on-device storage to answer before showing
  anything. It now draws the page right away and fills in your saved spots
  once storage responds.
- The page now appears instantly on every load — the brief pause some
  browsers still showed is gone, because nothing waits on on-device storage
  before drawing anymore.
- The Saved menu no longer sticks on "Loading…" when on-device storage won't
  answer (Safari sometimes leaves it hanging). After a couple of seconds it
  says it couldn't open your saved spots, suggests closing other Indigene
  tabs, and offers a Try again button.
- "See it growing near you" could get stuck at "Asking iNaturalist…" for the
  same reason — the app checks its on-device photo cache before asking, and
  that check could hang forever. It now gives the cache a couple of seconds,
  then asks iNaturalist directly.
- The bottom row of the growth chart's labels — like "(5′6″)" under the
  little person — was getting cut off by the caption below. The chart now
  leaves proper room for both label rows.
- The growth chart could be drawn with the wrong colors — pale, hard-to-read
  labels on a light page — if your device switched between light and dark
  looks after the page loaded. The chart now redraws itself when that
  happens, and also when the screen size changes.
- The app's top menu now wraps onto a second line when it truly runs out of
  room — like with very large text settings — instead of quietly spilling off
  the edge of the screen, where the Saved button could end up out of reach.
- Internal: the page can no longer scroll sideways (`overflow-x: clip` on
  `body`). The overflowing header was silently widening the document, which
  is what put a dark right-edge gutter and a floating 🔖 in every full-page
  screenshot: the capture honors the document width while the sticky header
  only spans the viewport. A fresh capture's width must now equal the
  viewport width. The four release thumbnails that had the gutter baked in
  (0.7–0.10) were regenerated with `make-thumb.mjs --crop`, which trims
  legacy captures to their true viewport width.
- Internal: screenshots now render with real phone font metrics. The capture
  container has none of the app's named fonts, so text fell through to DejaVu
  Sans (~10% wider than a phone renders — which is what made the header
  overflow, then wrap, in captures). A SessionStart hook
  (`.claude/hooks/session-start.sh`) installs Roboto and points `system-ui`
  at it, so headless Chromium lays out like an Android phone; the nav also
  sits a touch tighter at phone widths, so it fits Roboto with room to spare
  instead of by one pixel. Screenshots are also hi-DPI now: a new
  `scripts/shoot.mjs` (playwright joins the dev dependencies) captures at a
  real phone's 3× pixel ratio, so embedded shots render crisp on retina
  displays — with `--dpr 1` kept for very long full-page records.

## [0.10] - 2026-07-27

**Everything in plain sight**

[![The home page: the pitch, the Start button, and everything in plain view](docs/screenshots/pr-36/thumb.png)](docs/screenshots/pr-36/home-after-dark.png)
[Before](docs/screenshots/pr-36/home-before-dark.png) · [After](docs/screenshots/pr-36/home-after-dark.png)

### Added

- A [Browse page](https://indigene.app/#/browse) of its
  own: the regions we cover and "start from a plant" now live one tap from
  the home page — for anyone who'd rather look around
  without sharing their location.

### Changed

- Almost nothing hides behind a tap anymore. A plant's ecosystem, propagation,
  and reference sections, the 60-second soil check, the sky-scan explanation,
  and each result's score breakdown are now simply visible on the page. The
  only fold-away panels left are the two big ones on results — "What matters
  most?" and "Filters" — and those now have clear Open/Close buttons.
- The home page gets to the point: the pitch, why native plants matter (in
  plain view, no tap needed), the Start button, and a quiet link to browsing.
- Words got shorter and warmer across the home page, including the promise
  that matters most: "No account, no tracking. Everything stays in your
  browser and works offline."

### Fixed

- Buttons on phones now keep their labels on one line — like "See it growing
  near me" and "Check my location" — so they never break in half or shift
  while you're reaching for them.

## [0.9] - 2026-07-27

**See them growing for real**

[![A plant page, ready to show real photos taken nearby](docs/screenshots/pr-32/thumb.png)](docs/screenshots/pr-32/after-dark.png)
[Before](docs/screenshots/pr-32/before-dark.png) · [After](docs/screenshots/pr-32/after-dark.png)

### Added

- Real photos of recommended plants growing near you, taken by people in your
  area and shared on [iNaturalist](https://www.inaturalist.org). Open a
  plant's page and tap "See it growing near you" — nothing loads until you ask.
- Not standing there right now? Tap "Look it up where it's native" and pick a
  region instead: you'll see photos of the plant from anywhere it naturally
  grows, no location sharing needed.
- Photos open in a full-screen viewer inside the app, so you can look closely
  and then get right back to where you were.

### Changed

- Nearby photo results only show plants that are truly native around that
  spot, so a garden escapee never sneaks into your recommendations.
- Every photo credits the person who took it and links back to their original
  sighting, and only photos their takers chose to share openly are shown.

## [0.8] - 2026-07-22

**One plant, one name**

[![The search page finding a plant by any of its names](docs/screenshots/pr-25/thumb.png)](docs/screenshots/pr-25/search-after-dark.png)
[Before](docs/screenshots/pr-25/plant-refs-before-dark.png) · [After](docs/screenshots/pr-25/plant-refs-after-dark.png)

### Added

- A built-in plant name book (a *registry*): every plant Indigene knows has
  exactly one entry tying together its scientific name, its common names, and
  its identity in the world's big plant databases.
- A [search page](https://indigene.app/#/search): type any
  name — common or scientific — and Indigene finds the
  plant, or says honestly when a name could mean more than one plant.
- Plant pages now show **references**: links to the very same plant at USDA,
  GBIF, and other authorities, so you can double-check anything we say.
- iNaturalist links now land directly on that exact species' page.
- Internal: the registry is generated from the catalog (`npm run
  registry:build`) and audited (`npm run registry:check`); it also ships as a
  hostable static JSON artifact under `app/public/registry/`. External
  identifiers (Wikidata + GBIF) are reconciled by a scheduled workflow that
  writes to `registry.overrides.json` via PRs; the workflow was hardened to
  not red-fail when PR creation is blocked, and `registry:check` now survives
  reconciliation.

### Fixed

- Internal: corrected the long-stale bundle-size figure across the docs
  (~28 → ~96 KB gzip) and documented keeping it honest in `CLAUDE.md`.

## [0.7] - 2026-07-21

**Meet the wildlife**

[![The wildlife index: butterflies, moths, bees, birds, and mammals](docs/screenshots/pr-18/thumb.png)](docs/screenshots/pr-18/wildlife-index-dark.png)
[Before](docs/screenshots/pr-18/plant-milkweed-before-dark.png) · [After](docs/screenshots/pr-18/plant-milkweed-after-dark.png)

### Added

- [Browse by wildlife](https://indigene.app/#/wildlife):
  start from a butterfly, moth, bee, bird, or mammal and
  see which native plants support it — because "which plants bring monarchs?"
  is often the real question.
- Every plant–animal tie says *how* the plant helps (caterpillar food, nectar,
  berries, seeds, or shelter) and how much the animal depends on it — from
  "this is its only host plant" to "one of many it can use".
- Every wildlife relationship names its source, with links straight to the
  species record where the source has one.
- Plant pages show the wildlife each plant brings in, with links both ways.

### Changed

- You can now cap results by mature height and spread — handy for planting
  under a window or a power line.
- The header now fits every phone: "Saved" moved into a compact menu, and the
  app's name is never cut off.
- Relationship tags are one short word each; tap one to read the full meaning.

### Fixed

- Wildlife pages got the same comfortable margins as the rest of the app.

## [0.6] - 2026-07-19

**Readable by everyone**

[![The home page leading with why native plants matter](docs/screenshots/pr-17/thumb.png)](docs/screenshots/pr-17/welcome-after-dark.png)
[Before](docs/screenshots/pr-17/welcome-before-dark.png) · [After](docs/screenshots/pr-17/welcome-after-dark.png)

### Changed

- The home page now leads with why native plants matter — what's at stake for
  birds, butterflies, and clean water — before it explains what the app does,
  and shows how to ask for your area if it isn't covered yet.
- Every color in the app, in light mode and dark mode, now meets the strictest
  readability standard there is (WCAG AAA contrast) — so text stays clear in
  bright sunlight, and for readers whose eyes need more contrast.

## [0.5] - 2026-07-18

**Make more of them**

### Added

- Every plant now has "how to make more of it": plain-words tips for growing
  new plants from seed, cuttings, or division — free plants for you, your
  neighbors, and the birds.

### Changed

- Every expandable section in the app now looks and works the same way — once
  you've opened one, you know how to open them all.
- Section titles are shorter and clearer, and the first step is now simply
  called "Spot".
- You can share a link that opens a specific section of a plant's page, like
  its propagation tips.

## [0.4] - 2026-07-17

**No GPS required**

### Added

- Type your town or ZIP code instead of sharing your location — or just pick
  your region from a list. Nobody is ever asked for coordinates.
- If Indigene doesn't have a plant list for a spot yet, it says so the moment
  you pick it — and shows you what it does cover, plus where to request your
  area.

### Changed

- Place lookups now come from OpenStreetMap, and the app always shows town
  names, never raw numbers.
- Garden jargon never stands alone: terms like "zone 8b" always come with a
  plain-words translation and a link to learn more.

### Fixed

- The place-search button now sits right beside the search box, at a matching
  size.
- The map no longer promises that fine-tuning the pin sharpens the sun
  estimate (it doesn't).

## [0.3] - 2026-07-16

**Explore and share**

### Added

- [Explore pages](https://indigene.app/#/explore): browse
  every plant Indigene knows without sharing your
  location — and every plant, region, and category has its own address you can
  share with anyone.
- Full plant lists for each region at shareable addresses, with a switcher to
  hop between regions.
- A stat grid on every plant, like a trading card. Tap any stat to read what
  it means in plain words.
- The location map now draws real streets from OpenStreetMap (with a simple
  grid when you're offline).
- Short explanations appear right where a new idea first shows up, so you
  learn as you go — and growth expectations now come from the data, not
  guesses.

### Changed

- Getting around got easier: section navigation, a way back home from every
  page, and region links right on the home page.
- The re-sort panel can be closed, the growth chart is right-sized, keystone
  species wear a little arch icon, and species counts show their sources.
- The GPS map starts one zoom level farther out, so the neighborhood you see
  is one you recognize.

## [0.2] - 2026-07-15

**More places, real boundaries**

### Added

- Three new regional plant lists: the Pacific Northwest west of the Cascades,
  north & central Florida, and south Florida & the Keys — and the app picks
  the right list from where you're standing.
- Regions now follow real ecological boundaries (EPA ecoregions), not straight
  lines on a map — so a spot just east of the Cascade crest no longer gets the
  west-side list, and Florida splits where the subtropics truly begin. The
  confirm screen names the actual ecoregion you're standing in.
- Every plant's naming and classification is backed by named, linkable
  taxonomy sources.
- Indigene went live on the public web — free to visit in any browser, nothing
  to install (though you can add it to your home screen).
- Internal: deploys to GitHub Pages via Actions on every push to `main`; the
  optional Ruby API is not part of the deploy.

## [0.1] - 2026-07-12

**Stand in a spot**

### Added

- The first version of Indigene. Stand somewhere, share your location, and get
  native plants that will truly thrive right there — ranked by what they do
  for birds, butterflies, bees, soil, and water.
- Sun, measured honestly: answer one simple question about your spot's sun, or
  point your camera at the sky and let the app measure sun-hours itself. The
  simple question always works; the camera is optional.
- The ground gets checked, not assumed: the app says "the soil map says clay —
  here's a 60-second hand test to see if that's true where you're standing."
- Every plant shows how big it will really get in 1, 3, 5, and 10 years, drawn
  to scale beside a person — no surprises a decade later.
- The ranking is transparent and yours to adjust, with filters for deer
  resistance, thorns, pet safety, and plants that survive with zero watering.
- Saved spots stay on your phone. The whole app works offline, installs to
  your home screen, and never asks for an account.
- A starting list of 40 Mid-Atlantic / Northeast Piedmont natives with real
  size-over-time and ecosystem numbers.
- Internal: vanilla TypeScript on the DOM — no framework, zero runtime
  dependencies — bundled by Vite. A thin, optional Hanami 2 API (`server/`)
  proxies site data; the PWA works without it.

[Unreleased]: https://github.com/olivierlacan/indigene/compare/e8860f8...HEAD
[0.23]: https://github.com/olivierlacan/indigene/compare/221a9ee...e8860f8
[0.22]: https://github.com/olivierlacan/indigene/compare/9f09ba2...221a9ee
[0.21]: https://github.com/olivierlacan/indigene/compare/1774027...9f09ba2
[0.20]: https://github.com/olivierlacan/indigene/compare/ccf78ee...1774027
[0.19]: https://github.com/olivierlacan/indigene/compare/9cc18dd...ccf78ee
[0.18]: https://github.com/olivierlacan/indigene/compare/ccd214c...9cc18dd
[0.17]: https://github.com/olivierlacan/indigene/compare/5200de0...ccd214c
[0.16]: https://github.com/olivierlacan/indigene/compare/aaa7781...5200de0
[0.15]: https://github.com/olivierlacan/indigene/compare/318f221...aaa7781
[0.14]: https://github.com/olivierlacan/indigene/compare/d81160b...318f221
[0.13]: https://github.com/olivierlacan/indigene/compare/fa0dd4c...d81160b
[0.12]: https://github.com/olivierlacan/indigene/compare/2aec57f...fa0dd4c
[0.11]: https://github.com/olivierlacan/indigene/compare/f84450c...2aec57f
[0.10]: https://github.com/olivierlacan/indigene/compare/9453251...f84450c
[0.9]: https://github.com/olivierlacan/indigene/compare/6e72889...9453251
[0.8]: https://github.com/olivierlacan/indigene/compare/d45eda0...6e72889
[0.7]: https://github.com/olivierlacan/indigene/compare/6affce6...d45eda0
[0.6]: https://github.com/olivierlacan/indigene/compare/c8a56bc...6affce6
[0.5]: https://github.com/olivierlacan/indigene/compare/a54ef90...c8a56bc
[0.4]: https://github.com/olivierlacan/indigene/compare/253bede...a54ef90
[0.3]: https://github.com/olivierlacan/indigene/compare/c0e70f6...253bede
[0.2]: https://github.com/olivierlacan/indigene/compare/ac8be53...c0e70f6
[0.1]: https://github.com/olivierlacan/indigene/commits/ac8be53
