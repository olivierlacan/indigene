# Hero photos

Every plant page opens with a to-scale drawing chosen by the plant's *type* — a
generic shrub, a generic tree. It's honest about size and useless for
recognition: two dogwoods and a viburnum get the same picture. The goal here is
one real, well-chosen photograph per plant, cached in the repo, shown instead.

The catch is that "well-chosen" is a judgement no script can make. So the
pipeline does the fetching, the filtering and the ranking, and stops: a person
picks the actual photo from a shortlist of ten. It's three commands and one
sitting per region, not an afternoon per plant.

```
  iNaturalist ──▶ harvest ──▶ score ──▶ shortlist ──▶ YOU ──▶ hero-photos.json
                (CC only)   (pixels)    (top 10)     (pick)      (committed)
```

## Stage 1 — harvest

`app/scripts/harvest-hero-photos.mjs`, run as `npm run hero:harvest`.

One request per plant per region it's native to, bounded by that region's
coverage box:

| Filter | Value | Why |
|---|---|---|
| `taxon_id` | the plant's iNaturalist id | descendants included — a subspecies is the same plant |
| `quality_grade` | `research` | the community confirmed the identification |
| `photo_license` | `cc0, cc-by, cc-by-sa, cc-by-nc, cc-by-nc-sa` | **we must be able to republish it with credit** |
| `order_by` | `votes` desc | iNaturalist's own favourites are a strong free prior |
| bounds | the region's box | a red maple in Florida ≠ a red maple in Maryland |

A photo we can't republish is excluded *at the query*. It is never downloaded,
never scored, and never shown to a reviewer, so there is no path by which an
all-rights-reserved photo ends up in the app by accident.

Each plant gets its own shortlist **per region**, because the right photograph
of a species at one end of its range is often the wrong one at the other.

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

## Stage 3 — pick

`npm run hero:review` writes a single self-contained HTML file to
`app/dist/hero-review/index.html`. Open it from disk — no server, no build.

- Click a photo to pick it; click it again to unpick.
- Picks are written to `localStorage` as you go, so a long review can span
  several sittings or tabs without losing anything.
- **Download picks** saves `hero-photos.json`.

Each tile shows its score, its isolation ratio and its iNaturalist favourites,
so you can see why the ranking put it there and overrule it freely — the numbers
are advice.

The page cannot write to the repo, and shouldn't: downloading the file and
committing it is what puts a human signature on the data.

```sh
cd app
npm run hero:harvest -- --region pnw   # needs network; see below
npm run hero:review
# open app/dist/hero-review/index.html, pick, download
mv ~/Downloads/hero-photos.json src/data/hero-photos.json
npm run hero:colors                    # needs network; see below
```

## Stage 3½ — every pick gets a colour

`npm run hero:colors` fills in a `color` field on any pick that lacks one: the
photograph's average colour, as `#rrggbb`, about eight bytes each. The plant
page paints its hero slot that colour while the photograph is still downloading,
so the picture fades up out of its own mossy green or winter grey instead of
appearing in an empty rectangle.

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
`app/src/lib/hero-photo.ts`. It ships as `{}` — every plant keeps its form
drawing until someone picks a photo. The region asked for is the *active* one
(see `activeEntry` in `steps/plant.ts`), so a multi-region plant's photograph
follows the same region as its figures.

A plant with a pick shows it **in place of the drawing** (the two are never
shown together) — a thumbnail the text wraps around, never wider than a third
of the viewport, with the observer credited on one line beneath it. Tapping it opens the same lightbox as any other iNaturalist photo in
the app: `asObservation()` reshapes a pick into the `ObservationSummary` the
lightbox already speaks, so the credit, the licence label and the "view original
sighting" link come from exactly one implementation. There is no second way of
crediting a photo in this codebase, on purpose.

**The lists show the picks too** — the plants index, a region's roster, and the
starring plant on each region card. There the drawing is *not* replaced: the
photograph fades in over it, so a plant nobody has reviewed looks exactly as it
always did and the row never has an empty box. See
`app/src/components/plant-thumb.ts`, and `app/src/lib/photo.ts` for which
rendition gets asked for and when.

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
