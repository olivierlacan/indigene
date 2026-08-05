# Hero photos

Every plant page used to open with a to-scale drawing chosen by the plant's
*type* — a generic shrub, a generic tree. It's honest about size and useless for
recognition: two dogwoods and a viburnum get the same picture. Every animal's
page opened with an emoji, which is the same problem with fewer pixels. The goal
here is real, well-chosen photographs, cached in the repo, shown instead.

The catch is that "well-chosen" is a judgement no script can make. So the
pipeline does the fetching, the filtering and the ranking, and stops: a person
picks the actual photo from a shortlist. It's three commands and one sitting per
region, not an afternoon per subject.

```
  iNaturalist ──▶ harvest ──▶ score ──▶ sort ──▶ shortlist ──▶ YOU ──▶ committed
                (CC only)   (pixels)  (angle)   (top 10 ea.)   (pick)    JSON
```

## What gets chosen

| Slot | Where it shows | File |
|---|---|---|
| **hero** (plant) | the profile, every list, the region cards | `app/src/data/hero-photos.json` |
| **habit / leaf / flower / fruit** | `…/plants/<slug>/photos` | `app/src/data/plant-photos.json` |
| **hero** (animal) | the animal's page, the wildlife index | `app/src/data/wildlife-photos.json` |

The four angles exist because one photograph answers one question. "Roughly,
what is this?" is what a hero is for. Standing in front of a shrub with a leaf in
your hand, the questions are *is this the right leaf, the right flower, the right
fruit* — three more, each needing its own picture. See `app/src/lib/plant-photos.ts`
for why the angles are a separate file from the heroes (they are fetched only by
the page that shows them).

Bark is the obvious fifth angle and is deliberately absent: better to add it when
somebody is ready to review it than to ask for it and leave it empty everywhere.

## Stage 1 — harvest

`app/scripts/harvest-hero-photos.mjs`, run as `npm run hero:harvest`.

One request per subject per region it belongs to, bounded by that region's
coverage box:

| Filter | Value | Why |
|---|---|---|
| `taxon_id` | the subject's iNaturalist id | descendants included — a subspecies is the same plant |
| `quality_grade` | `research` | the community confirmed the identification |
| `photo_license` | `cc0, cc-by, cc-by-sa, cc-by-nc, cc-by-nc-sa` | **we must be able to republish it with credit** |
| `order_by` | `votes` desc | iNaturalist's own favourites are a strong free prior |
| bounds | the region's box | a red maple in Florida ≠ a red maple in Maryland |

A photo we can't republish is excluded *at the query*. It is never downloaded,
never scored, and never shown to a reviewer, so there is no path by which an
all-rights-reserved photo ends up in the app by accident.

Each subject gets its own shortlist **per region**, because the right photograph
of a species at one end of its range is often the wrong one at the other.

### Two more asks per plant, for the pictures nobody scrolls far enough to find

iNaturalist's pool for any given plant is overwhelmingly leaves. Rank it on
photographic quality and you get ten excellent photographs of foliage; the
flowering shot is on page four and the fruiting shot might be on page nine. So a
plant is asked for three times over:

| Ask | Filter | What it's for |
|---|---|---|
| favourites | `order_by=votes` | the hero, and the whole-plant and leaf shots |
| flowering | `term_id=12&term_value_id=13` | the flower slot |
| fruiting | `term_id=12&term_value_id=14` | the fruit slot |

Term 12 is iNaturalist's **Plant Phenology** annotation — a person, usually
several, saying what an observation shows. That is a far better signal than
anything we could measure, and it is what files a candidate under "flower" or
"fruit" on human authority rather than on our guessing. (`--no-angles` skips
both asks; the caveat is that an annotation describes the *observation*, and a
fruiting observation often carries a habit shot alongside the berries.)

### Animals

`--kind wildlife` harvests the animal catalog on the same terms, minus the
phenology asks (they mean nothing for a butterfly) and with one extra step: the
wildlife catalog stores a scientific name rather than a numeric id, so the name
is resolved through `pickTaxon` — **the app's own function, imported**, not a
second copy of the rules. A harvest that resolved a name differently from the app
would shortlist photographs of a different animal than the one the page looks up.

An informal group ("Jays, turkeys & woodpeckers") maps to no single taxon, so
there is nothing to photograph it *as*. It is skipped, the same way it gets no
species-record link and no "see it near you" lookup.

## Stage 2 — score

`app/scripts/_photo-quality.mjs`. Decoding is done by Chromium — Playwright is
already a dev dependency, a headless page decodes anything the browser can, and
the repo stays at zero runtime dependencies. Node fetches the bytes; the browser
only looks at them.

### Why the obvious metric is wrong

The textbook sharpness measure is variance of the Laplacian over the frame.
Measured on real iNaturalist photos, it ranks this pair **backwards**:

| Photo | Laplacian variance | Actually |
|---|---|---|
| A close-up of a single mushroom, soft background | **361** | the good one |
| A scrubby hillside with the plant somewhere in it | **5731** | the bad one |

Busy wins. Gravel, twigs and distant foliage are high-frequency detail
*everywhere*, and a photograph that isolates its subject is deliberately smooth
over most of its area.

So the discriminating measure isn't how much detail there is, but **where**: a
specimen photo is sharp in the middle and calm at the edges. That ratio does the
work; the rest are mostly disqualifiers.

| Component | Weight | What it catches |
|---|---|---|
| `isolation` | 0.42 | centre detail ÷ edge detail — the specimen-photo signature |
| `detail` | 0.22 | the subject is genuinely in focus, not just isolated |
| `exposure` | 0.16 | blown-out skies, near-black silhouettes |
| `contrast` | 0.12 | flat haze at one end, hard-flash crush at the other |
| `colour` | 0.08 | living things have colour; a grey smear is a mistake |

Weights live in `WEIGHTS` and the shaping in `combine()`, which is deliberately
separate from the pixel pass — you can re-tune the ranking over a stored
candidates file without re-downloading a thing.

### What it cannot do

It does not know what a plant looks like. It cannot tell a fine photograph of a
leaf from a fine photograph of the whole shrub, and a lovely low-detail macro
lands mid-table because there isn't much detail anywhere in it. **This is a
shortlister, not a chooser.** It turns a hundred candidates into ten worth a
glance.

## Stage 2½ — guess what it's a picture *of*

`app/scripts/_photo-angle.mjs`.

Ten excellent photographs of leaves is still the wrong shortlist when what you
need is the whole shrub. So the same pixel pass also measures a few things that
hint at the subject — sky in the top third, greenness in the middle, a saturated
non-green blob in the centre — and this file turns them into a fit score per
angle.

| Angle | What it looks for |
|---|---|
| habit | sky above, foliage across the frame rather than only in the middle, detail everywhere (a scene, not a specimen), portrait aspect |
| leaf | green in the middle, subject clear of its background, no sky |
| flower | the **flowering** annotation, sharpened by how much of the centre isn't a leaf |
| fruit | the **fruiting** annotation, the same way |

**Only the annotations are trustworthy.** The habit/leaf split is colour
statistics and a threshold; it has been sanity-checked against synthetic images
that isolate each signal, and never against a labelled set of real photographs,
because there isn't one. It is exactly as crude as it sounds.

Which is why it decides nothing. The guess re-orders the strip and puts a small
tag on a tile; every candidate is still assignable to every slot. A wrong guess
costs one scroll. That is the most a signal this weak has earned.

## Stage 3 — pick

`npm run hero:review` writes a single self-contained HTML file to
`app/dist/hero-review/index.html`. Open it from disk — no server, no build.

Each subject shows its **slots** as chips — Hero, Whole plant, Leaves, Flowers,
Fruit for a plant; Hero alone for an animal — and a strip of candidates:

- Click the slot you're filling, then click a photograph. The page moves on to
  the next empty slot by itself, so filling a plant's five is five clicks.
- The strip **re-sorts to the slot you're on**, best guess first. *Only likely
  ones* hides the rest, for when a pool is ninety leaves and you want the berry.
- Click the current pick again to unpick it — undo without a second control.
- A photograph already used for another slot stays marked, so you can see the
  set you're building without leaving the strip.
- **It opens knowing what's already committed.** The picks in `src/data/` are
  baked into the page, so a re-review starts from today's answers and a download
  after changing one plant gives back a *complete* file, not a file with one
  plant in it. Colours already computed ride along too, so re-picking the same
  photograph doesn't send `hero:colors` back for a value it has.
- Picks are written to `localStorage` as you go — but only the *difference* from
  what's committed, so "clear all picks" means "back to what's in the repo".

Each tile shows its score, its isolation ratio and its iNaturalist favourites,
so you can see why the ranking put it there and overrule it freely — the numbers
are advice. A green tag is the community's annotation; a grey one with a question
mark is our guess.

The three **Download** buttons write the three files. The page cannot write to
the repo, and shouldn't: downloading and committing is what puts a human
signature on the data.

```sh
cd app
npm run hero:harvest -- --region pnw   # needs network; see below
npm run hero:review
# open app/dist/hero-review/index.html, pick, download
mv ~/Downloads/hero-photos.json src/data/hero-photos.json
mv ~/Downloads/plant-photos.json src/data/plant-photos.json
mv ~/Downloads/wildlife-photos.json src/data/wildlife-photos.json
npm run hero:colors                    # needs network; see below
```

## Stage 3½ — every pick gets a colour

`npm run hero:colors` fills in a `color` field on any pick that lacks one — in
all three files, and for every angle — the photograph's average colour, as
`#rrggbb`, about eight bytes each. The page paints the slot that colour while the
photograph is still downloading, so the picture fades up out of its own mossy
green or winter grey instead of appearing in an empty rectangle.

It downloads only the 75 px `square` rendition (7–8 KB a pick) and averages it
in Chromium, the same borrowed-decoder trick `_photo-quality.mjs` uses — the
repo has no runtime dependencies and Playwright is already a dev one. Run it
after every review round; it skips picks that already have a colour, so it is
cheap to re-run, and `--force` redoes them all.

The field is optional everywhere it's read. A picks file that has never been
through this script works exactly as before — the slot falls back to the app's
placeholder green.

## Stage 4 — the app reads it

`app/src/data/hero-photos.json`, keyed `plantId → regionId → pick`, read by
`app/src/lib/hero-photo.ts` — which also reads `wildlife-photos.json` on exactly
the same terms, through the same fallback rule, so there is one answer to "which
photograph, for which region?" and not two. The angles live in
`plant-photos.json` behind `app/src/lib/plant-photos.ts`, which imports it
*dynamically*: it is fetched the first time someone opens a photo page and never
otherwise, because four angles per plant per region has no business in the
bundle every reader downloads. Each file ships as `{}` — every subject keeps its
drawing or its emoji until someone picks a photo. The region asked for is the *active* one
(see `activeEntry` in `steps/plant.ts`), so a multi-region plant's photograph
follows the same region as its figures.

A plant with a pick shows it **in place of the drawing** (the two are never
shown together) — a thumbnail the text wraps around, never wider than a third
of the viewport, with the observer credited on one line beneath it. Tapping it opens the same lightbox as any other iNaturalist photo in
the app: `asObservation()` reshapes a pick into the `ObservationSummary` the
lightbox already speaks, so the credit, the licence label and the "view original
sighting" link come from exactly one implementation. There is no second way of
crediting a photo in this codebase, on purpose.

**The lists show the picks too** — the plants index, a region's roster, the
starring plant on each region card, and the wildlife index. There the drawing (or
the emoji) is *not* replaced: the photograph fades in over it, so a subject
nobody has reviewed looks exactly as it always did and the row never has an empty
box. See `app/src/components/plant-thumb.ts` and `wildlife-thumb.ts`, and
`app/src/lib/photo.ts` for which rendition gets asked for and when.

**The angles get a page of their own**, `#/plants/<slug>/photos`
(`app/src/steps/plant-photos.ts`) — a real, prerendered, shareable address like
every other page. It shows the chosen photographs above the live "see it growing
near you" lookup, which is the deliberate pairing: few, labelled and stable above
many, current and local. A plant nobody has picked close-ups for still has a
working page, because the live half works for every plant with a taxon id.

**Picks fall back across regions.** Reviewing 200 plants × their regions before
anything appears would be a bad trade, so a plant with a pick for *any* region
gets a photo everywhere, and a region-specific pick overrides it where one
exists. Reviewing can start with one photo per plant and improve over time
rather than being all-or-nothing.

## Running it

The harvest needs open internet, which the build sandbox blocks. Two ways:

- **CI** — `.github/workflows/hero-photos.yml`, from the Actions tab or on its
  quarterly schedule. It harvests, scores, and opens a PR with the refreshed
  `docs/hero-photos/candidates.json`. This is the normal path.
- **Locally** — `npm run hero:harvest`, with `--region` / `--plant` / `--limit`
  to keep a trial small.

`npm run hero:colors` needs network too, for the same reason and on the same
terms — but it only fetches the 75 px renditions of picks already committed, so
it is a much smaller errand than a harvest.

It paces itself at roughly one request a second, well under iNaturalist's
published limits, and sends a `User-Agent` identifying the project — Node can,
where a browser can't.

The candidates file carries **no timestamp**, on purpose: a generated-at field
would make every run a diff even when nothing changed, and the only question a
reviewer has about that PR is "did the candidates change?".

## Attribution

Every candidate carries `observer`, `license` and iNaturalist's own
`attribution` string from the moment it's harvested, and those ride through the
shortlist into the committed pick. Nothing in this pipeline ever separates a
photograph from its credit — the same rule the "See it growing near you" layer
follows.

### Which is why hero photos never go on a share card

A plant's Open Graph card (`app/scripts/gen-plant-cards.mjs`) draws the plant's
**illustration**, never its photograph, and that is a licensing decision rather
than a design one.

Four of the five licences we accept — everything but `cc0` — require
attribution, and a share card is the one surface that cannot carry any. It
arrives in iMessage, Slack or WhatsApp as a bare image with no caption, no alt
text a reader will see, and nowhere to put "© the observer, CC BY-NC". Putting a
photograph there would separate it from its credit, which is the rule above.

Three more reasons the same way:

- **A card is a derivative work.** The photo would be cropped and composited
  into our layout. `cc-by-sa` and `cc-by-nc-sa` are ShareAlike, so the resulting
  card would arguably have to be licensed under the same terms.
- **Caching it means republishing it, permanently.** These images are committed,
  and git history is forever. In-app we point at iNaturalist's own URLs, so an
  observer who deletes a photo or tightens its licence is honoured immediately.
  A copy in our repo can't be recalled.
- **`cc-by-nc` on a promotional image is at best unsettled.** A share card is
  the most marketing-shaped surface the project has.

The illustrations have none of these problems: we drew them, so they can be
cached, cropped and composited freely, and they cost about 48 KB apiece.
