# Indigene (PWA)

A mobile-first, offline-first Progressive Web App. Stand in a spot, and it finds
native plants that will actually thrive there — ranked by what they do for the
local ecosystem, with honest mature-size-over-time drawings.

**No framework.** Built on the DOM and real web APIs, TypeScript compiled by
Vite. Zero runtime dependencies. ~29 KB gzipped.

## Run it

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/ (static, deployable anywhere)
npm run preview    # serve the production build (service worker active)
npm run typecheck
```

Camera + compass features need **HTTPS** and a **real device** (iOS gates the
motion sensor behind `DeviceOrientationEvent.requestPermission()`). Everything
else — including the whole flow via the manual sun picker — works on desktop and
over plain `localhost`.

## The flow

1. **Location** — high-accuracy geolocation with a nudgeable pin (drag, tap,
   or arrow keys). No GPS? Search your town or ZIP (Open-Meteo geocoding, no
   key) — or skip the map entirely and pick your region by hand, plainly
   marked as your choice. Nobody is ever asked to type coordinates.
2. **Sun** — the **manual picker leads** (three plain choices); an optional
   camera sky-scan refines it. The app is fully usable with camera/compass
   denied.
3. **Confirm** — soil/climate/zone in plain language, framed as "the map says…",
   with a 60-second ribbon test to override it and a moisture correction.
4. **Results** — plants ranked by a transparent eco-score × site-fit, each with
   a to-scale size drawing, a broken-out score, honesty flags, and confidence.
   Re-weightable sliders + presets; guerrilla-mode filters. Save to IndexedDB.

## Architecture

```
src/
  main.ts              Hash router, step rail, SW registration, offline badge
  state.ts             In-memory draft + persisted prefs (IndexedDB)
  db.ts                Tiny IndexedDB wrapper (no dependency)
  types.ts             Shared domain types
  ui.ts                DOM helpers (el/clear/toast)
  styles.css           Accessibility-first design tokens (AAA contrast, dark mode)
  lib/
    solar.ts           Local NOAA solar position + sun-hours vs. horizon mask
    orientation.ts     iOS/Android compass + pitch behind one interface
    horizon.ts         Horizon-mask recorder (bin, smooth, interpolate)
    site.ts            Soil/elevation/climate fetch with graceful fallback
    ranking.ts         Transparent, re-weightable eco-score × site-fit
    plants.ts          Loader; derives host score from raw Lepidoptera counts
    plain.ts           Jargon → plain-language layer
  data/
    plants.mid-atlantic.ts   36-species seed dataset (see DATA_SOURCES.md)
  components/
    size-viz.ts        To-scale Canvas 2D size-over-time drawing
    plant-card.ts      One ranked plant, fully explained
  steps/               One module per screen
public/
  manifest.webmanifest, sw.js (hand-written), icons/
scripts/
  inject-sw-precache.mjs   Post-build: embeds the deploy's file list in sw.js
```

## Design decisions

- **No framework, no runtime deps** — the DOM is enough, and it keeps the bundle
  tiny and legible. The service worker is hand-written, not generated; a small
  post-build script only injects the deploy's file list so the whole shell
  (including hashed CSS/JS) precaches atomically per deploy.
- **Offline-first** — the seed catalog is bundled; sun is computed locally
  (NOAA algorithm, no API); looked-up site data is cached so a spot works
  forever once loaded.
- **Accessibility is structural** — 18px base, AAA-leaning contrast, ≥48px tap
  targets, full keyboard/labels, dark mode, reduced-motion, sunlight-legible
  palette.
- **Honesty over false precision** — sun shows a range; soil is "the map
  says…"; every plant shows confidence and its basis. See the root
  `DATA_SOURCES.md` and `PROJECT_BRIEF.md`.

## Not in Phase 1 (by design)

Accounts, sync, a national catalog, plant ID from photos, nurseries, a bed
designer. Real plant photos are also deferred — cards currently draw a botanical
silhouette by growth form so they're meaningful offline.
