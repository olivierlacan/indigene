# Indigene

**Stand in a spot, and find native plants that will actually thrive right
there** — ranked by what they do for the local ecosystem, with honest
mature-size-over-time drawings.

> An *indigene* is a native of a place. This app measures the sun where you're
> standing, pulls the soil and climate for your exact coordinates, and returns
> the plants that belong there — with plain language the whole way, because it's
> for people who've never heard "part shade" or "keystone species."

A mobile-first, **offline-first Progressive Web App**. No account, no App Store.
Built on the DOM and real web APIs — no framework.

See **[`PROJECT_BRIEF.md`](PROJECT_BRIEF.md)** for the vision and decisions, and
**[`DATA_SOURCES.md`](DATA_SOURCES.md)** for the data-licensing audit.

## Layout

| Path | What it is |
|---|---|
| [`app/`](app/) | The PWA — vanilla TypeScript on the DOM, no framework, zero runtime deps, ~28 KB gzipped. This is the product. Offline-first, installable. |
| [`server/`](server/) | A thin **Hanami 2** JSON API. Its job: fetch site data (soil/elevation/climate) server-side to dodge browser CORS and keep future API keys off the client. The PWA works without it. |

## Quick start

```bash
# The app
cd app && npm install && npm run dev        # http://localhost:5173

# The API (optional)
cd server && bundle install && bundle exec puma -p 2300 config.ru
```

Camera + compass features need HTTPS and a real phone; everything else — the
whole flow via the manual sun picker — works on desktop over plain `localhost`.

## What it does

1. **Location** — high-accuracy geolocation with a draggable pin.
2. **Sun** — a plain three-way picker (leads), with an optional camera sky-scan
   (`getUserMedia` + `DeviceOrientation`, never WebXR) that measures the skyline
   and computes real sun-hours locally.
3. **Confirm** — soil/climate/zone in plain words, framed as "the map says…",
   with a 60-second ribbon test to correct it.
4. **Results** — plants ranked by a transparent eco-score × site-fit, each with
   a to-scale size drawing beside a human silhouette, a broken-out score,
   honesty flags, and confidence. Re-weightable sliders + guerrilla-mode
   filters. Saved to IndexedDB, local-first.

Plant recommendations are **tuned region by region**, and the app picks the
right list from where you're standing. Two regions ship today:

- **Mid-Atlantic / Northeast Piedmont** (36 species, Pennsylvania reference)
- **Pacific Northwest, west of the Cascades** (24 species, Portland–Seattle reference)

Outside a covered region the sun/soil/climate readings still work; the app says
plainly when it has no plant list for your spot yet. Adding a region is a data
file plus two lines in `app/src/data/regions.ts` — see `DATA_SOURCES.md` for the
taxonomy and distribution backbones we'll build the national and global catalog
on.

## License

[MIT](LICENSE). All the data underneath is public; this is too.

---

<sub>Indigene began as a pivot from the [Planter](https://github.com/olivierlacan/planter)
repository and is now its own project.</sub>
