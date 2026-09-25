# Indigene — the film

A 60-second, hand-drawn explainer: what Indigene is, and who it's for, in
English and in French. It is drawn by a small pure-JavaScript canvas engine
(no animation library, no framework, no video editor) in the app's own
palette and type. The finished cuts are hosted on Bunny Stream and play on the
home page (`app/src/components/film.ts`).

Nothing rendered is kept in git. The only committed media are the inputs that
can't be regenerated identically — the narration takes and the score — and
everything else is rebuilt from code by one command.

## Watch it, live

```sh
npx http-server film -p 8080
# http://127.0.0.1:8080/            English
# http://127.0.0.1:8080/?lang=fr    French
```

The page renders every frame in real time, in sync with the soundtrack, and you
can scrub anywhere. It needs `assets/soundtrack*.m4a`, which `build.sh` makes
(the picture works without it; you just won't hear anything).

## Build a cut

Needs Node 20+, ffmpeg, and the app's Playwright (`cd app && npm install`).

```sh
film/build.sh        # → film/out/indigene-film.mp4
film/build.sh fr     # → film/out/indigene-film.fr.mp4
```

About five minutes each; the two can run at the same time. What it does:

1. **Picture** — `render.mjs` opens `index.html?capture=1&lang=…` in headless
   Chromium, renders each of the 1,800 frames and pipes them to ffmpeg
   (x264, CRF 14, 30 fps). Rendering is deterministic: every random value is
   seeded, so the same code gives the same frames. It also writes
   `out/ink.json`, how much ink each frame laid down.
2. **Foley** — `audio/sfx.mjs` synthesizes every effect from that, in plain
   JavaScript: pencil scratch that follows the actual drawing, a distant mower
   that dies on "quiet", paper slides under camera moves, the bird's song
   (chickadee *fee-bee* / great tit *ti-tu*), begging chicks, bees, rain, a
   watering can, wooden tocks, a small bell on the mark.
3. **Mix** — `audio/mix.sh`: voice cleaned (breath tamed, de-muddied,
   de-essed, compressed) and placed at 1.8 s; score EQ'd and ducked under the
   voice; foley with a touch of room; loudness normalized to −16 LUFS, −1.5 dB
   true peak.
4. **Mux** — picture plus sound into `out/indigene-film*.mp4`, and the
   `assets/soundtrack*.m4a` the live page plays.

For a quick look instead of a full render:

```sh
node film/render.mjs stills 12.5 30              # English frames → film/out/still-*.png
FILM_LANG=fr node film/render.mjs stills 47.9    # French
```

## How it's put together

| File | What it holds |
|---|---|
| `js/engine.js` | The hand-drawn look. Ink strokes are filled polygons with a pressure taper, slow wobble and an 8 fps "line boil"; corners break into separate strokes that overshoot. Watercolor washes are painted once into their own bitmap from ~24 translucent deformed layers, pigment pooling at the edges, then granulated, and bloom in through a wet, noisy disc. Paper grain, handwriting that writes itself on, camera. |
| `js/figures.js` | The cast: posable people, the bird, caterpillars, butterflies (monarch, brimstone, common blue), bees, and every plant (`FLORA`), each drawing itself on at progress `p`. |
| `js/sceneA.js` … `sceneG.js` | One notebook page each: A the yard (fig. 1, and fig. 6 when it comes back to life), B who eats what, C reading a spot, D ranked & to scale, E who it's for, G the mark. |
| `js/timeline.js` | The camera path and the notebook layout; turns the cues into film time. |
| `js/i18n.js` | **Everything that differs by language**: cue times, every on-screen word, the plants and numbers on the phone, the scale-drawing units and plant, the bird's colors, and the flora and fauna drawn in each scene. |
| `audio/sfx.mjs`, `audio/mix.sh` | Foley synthesis and the mix. |
| `assets/voice*.flac`, `assets/music.mp3` | The committed sources (see below). |
| `tools/` | Regenerating the voice and score, aligning a take, and AI review. |

Every number on screen comes from the app: host counts and sizes from
`app/src/data/plants.*.ts`, wording from `app/src/locales/*.ts`, plant names
from `locales/taxa.fr.ts`, animal–plant pairings from `data/wildlife.ts`.
The two figures that aren't the app's are cited: Doug Tallamy's chickadee
count (6,000–9,000 caterpillars per clutch) and the LPO's great-tit figure (up
to 500 caterpillars a day for a nest).

## Change something

Every change is: edit, look at a still, rebuild the cut.

- **Words on screen** — `js/i18n.js`, in each language's `s` block. French
  text is written as French, not translated word for word (see the notes in
  that file's history: "plante ornementale importée", "drainage lent").
- **When something appears** — a scene draws each element with
  `span(t, start, duration)`; starts are written as cues (`T.sun + 0.9`), so
  moving a cue moves everything hung on it.
- **What a plant or animal looks like** — `js/figures.js`. To use a different
  species in one language, change that language's `flora` in `i18n.js`
  (`yard`, `host`, `tree`, `flyers`, `grand`, `windowBox`, `border`); add a
  drawing to `FLORA`/`FLYERS` if it's new. Keep to plants on that region's
  list in the app.
- **The camera** — `CAM` in `js/timeline.js`: `{ t, x, y, z }` keys, eased
  between.
- **Sound** — levels and effects in `audio/sfx.mjs` (each effect is a function
  called with a cue); the balance of voice, music and foley in `audio/mix.sh`
  (`MUSIC_DB=-9` by default).
- **The narration** — changes the timing of everything after it; see
  "Re-record the voice" below.

## Add a language

1. **Write the narration** in `tools/narration.<code>.txt`. Write it in the
   language, not from the English: same seven beats, similar length (the
   voice has to end by ~53 s so the mark can breathe). If the app has a
   tagline in that language, use it for the last line.
2. **Record it** (below). Pick a native voice; check the name *Indigène* is
   said the way you want, and respell it in a `-tts` copy of the script if not
   (English needed `Ahn-dee-ZHENNE`).
3. **Align it**: `tools/align.py assets/voice.<code>.flac <code>` prints each
   word's start. Copy an existing language object in `js/i18n.js` (FR is the
   fuller example), fill in `cues` from the alignment, then translate `s`.
4. **Localize the content**, not just the words: take `rows`, `maxN` and the
   `chart` plant from the region's list in `app/src/data/plants.<region>.ts`
   (names from the app's locale), set `chart.unit`/`fmt` for local units, and
   choose `flora` and `flyers` from the same list and `data/wildlife.ts`.
   Change the bird if another species is the garden bird there
   (`birdColors`, and its song in `audio/sfx.mjs`).
5. **Register it**: add it to `LOCALES` at the bottom of `i18n.js`. If the take
   has a loud breath, add its window to the `case` in `audio/mix.sh`.
6. **Look, then build**: `FILM_LANG=<code> node render.mjs stills …` at a
   frame per scene (text that's longer in the new language can crowd — the
   bottom row of fig. 5 measures itself, most labels don't), then
   `film/build.sh <code>`.
7. **Have it read** by a native speaker, or at least `tools/review.mjs`
   with a prompt in that language — it caught two calques from English in the
   French.

## Re-record the voice or the score

These call paid models through OpenRouter; set `OPENROUTER_API_KEY`.

```sh
# voice — Gemini TTS; English used "Algieba", French "Sulafat"
node film/tools/tts.mjs google/gemini-3.8-flash-tts Sulafat film/assets/voice.fr \
  "<style direction>" film/tools/narration.fr.txt
ffmpeg -f s16le -ar 24000 -ac 1 -i film/assets/voice.fr.pcm -c:a flac film/assets/voice.fr.flac

# score — Lyria 3 (about $0.08 a track); the prompt shapes the arc to the film
node film/tools/lyria.mjs film/assets/music.mp3 film/tools/music-prompt.txt
```

Every call gives a different take, so generate several and choose.
`tools/judge-audio.mjs take.flac` asks an audio model for accent,
pronunciation, errors and glitches; it's a good filter, and a poor final
judge, so listen before you commit. A single line can be re-voiced and spliced
in at a pause (the French sign-off was): match the level, keep the cut in
silence, and have `judge-audio.mjs` listen for the seam. After any new take,
re-align (`tools/align.py`) and update that language's `cues`.

`tools/review.mjs out/review.mp4 [model] [prompt-file]` sends a small copy of
a cut to a video model for a production critique. It is reliable on sound
levels and sync and unreliable on "clipped text": handwriting writes itself
on left to right, and a sampled frame of a word mid-stroke looks clipped.

## Publish a new cut

The site plays the Bunny Stream copies. Upload `out/indigene-film*.mp4` to the
Bunny library, then put the new video ids in `FILM_VIDEOS` in
`app/src/lib/film.ts`, and refresh the posters the home page shows
before anyone presses play:

```sh
node film/render.mjs stills 48.6 && FILM_LANG=fr node film/render.mjs stills 47.9
ffmpeg -i film/out/still-48.60.png -vf scale=1280:-1 -c:v libwebp -quality 78 app/public/film/poster-en.webp
ffmpeg -i film/out/still-fr-47.90.png -vf scale=1280:-1 -c:v libwebp -quality 78 app/public/film/poster-fr.webp
(cd app && node scripts/gen-film-card.mjs)   # the /film link-preview card
```

`https://indigene.app/film` (and `/film/fr` for the French cut) is the
address to share: its head carries video tags, so a link preview shows the film and, in most chat apps, plays it. That
needs a plain MP4, which Bunny only writes with the library's **MP4 fallback**
on (Stream → library → Encoding). Put the library's pull-zone host
(`vz-….b-cdn.net`) in `FILM_MP4_HOST` in `app/src/lib/film.ts`; until then the
preview offers Bunny's player page alone.

## Credits

Narration: Google Gemini 3.8 Flash TTS (voices *Algieba* and *Sulafat*). Score:
Google Lyria 3. Both generated through OpenRouter. Type: Roboto and Caveat,
from Google Fonts (open licenses). Everything else — drawings, animation, foley, mix —
is the code in this folder.
