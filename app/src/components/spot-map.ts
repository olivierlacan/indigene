// Where a spot is, as a picture.
//
// A coordinate names a spot to a machine, not to a person: "47.6827, -122.3519"
// and "47.6104, -122.3324" are the same run of digits to anyone standing in a
// garden, and neither one says *alley behind the house*. So every page that
// lists a spot without being the map — Settings' last spot, the saved list —
// shows the streets around the pin above the numbers. That's what tells two
// spots apart at a glance.
//
// It borrows the location step's tiles wholesale (`lib/tiles.ts`): same
// OpenStreetMap raster tiles, same fixed zoom, same session cache — a spot
// you've just been standing on redraws from tiles already in memory. Two
// differences from the map on the location step, both deliberate:
//
//   - **Nothing to interact with.** No drag, no tap, no zoom. It answers
//     "where was this?" and stops; moving a pin is the location step's job.
//   - **Nothing is fetched until it's on screen.** A list of a dozen spots
//     would otherwise ask for a dozen maps nobody scrolled to, which is both
//     rude to a free tile server and slow on a phone.
import { el } from "../ui";
import { TILE_SIZE, getTile, tileCoords } from "../lib/tiles";
import { t } from "../lib/i18n";

// The same district scale the location step picks its pin at, and for the same
// reason: wide enough for the landmarks people actually recognize — a park, a
// highway, water — and no closer, because nothing downstream knows a spot to
// better than a neighbourhood anyway.
const SPOT_ZOOM = 14;

export interface SpotMapOptions {
  /** What a screen reader says this picture is. Defaults to a generic line. */
  label?: string;
}

/** A small, static OpenStreetMap picture centred on one spot. */
export function spotMap(lat: number, lon: number, opts: SpotMapOptions = {}): HTMLElement {
  const canvas = el("canvas", {
    role: "img",
    "aria-label": opts.label ?? t("map.spotLabel"),
  });
  // Required OSM attribution, abbreviated to fit a picture this small — the
  // full credit is the link's own title and its destination. Hidden until
  // tiles are actually on screen, so an offline card never credits a map it
  // never drew.
  const credit = el("a", {
    class: "map-attrib map-attrib-compact",
    href: "https://www.openstreetmap.org/copyright",
    target: "_blank",
    rel: "noopener",
    title: t("location.osmAttribution"),
    hidden: true,
  }, t("map.osmShort"));
  const wrap = el("div", { class: "spot-map" }, [
    canvas,
    el("div", { class: "pin", "aria-hidden": "true" }, "📍"),
    credit,
  ]);

  // Flipped by the intersection observer below: until the picture has been
  // near the viewport, it draws the fallback grid and asks for nothing.
  let onScreen = false;

  // Redraws arrive in bursts — four tiles landing at once, a resize mid-scroll
  // — so they're coalesced into one frame, as the location step does.
  let raf = 0;
  function schedule(): void {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      draw();
    });
  }

  function draw(): void {
    const rect = wrap.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (!w || !h) return; // not laid out yet; the resize observer will call back
    // Draw in CSS pixels, at up to 2× backing resolution. Beyond 2× the tiles
    // are being upscaled anyway, so the extra pixels cost memory and buy
    // nothing.
    const scale = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(w * scale) || canvas.height !== Math.round(h * scale)) {
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const root = getComputedStyle(document.documentElement);
    ctx.fillStyle = root.getPropertyValue("--surface-2").trim() || "#eee";
    ctx.fillRect(0, 0, w, h);
    // The same schematic grid the location step falls back to: what's on screen
    // while tiles are in flight, and the whole picture when they never come.
    ctx.strokeStyle = root.getPropertyValue("--line").trim() || "#ccc";
    ctx.lineWidth = 1;
    const cell = 24;
    for (let x = (w / 2) % cell; x < w; x += cell) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = (h / 2) % cell; y < h; y += cell) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    let drew = false;
    if (onScreen && navigator.onLine) {
      const c = tileCoords(lat, lon, SPOT_ZOOM);
      const cx = c.x * TILE_SIZE;
      const cy = c.y * TILE_SIZE; // the spot, in world pixels
      // One shared rounded origin so adjacent tiles never show a seam.
      const ox = Math.round(w / 2 - cx);
      const oy = Math.round(h / 2 - cy);
      const x0 = Math.floor((cx - w / 2) / TILE_SIZE);
      const x1 = Math.floor((cx + w / 2) / TILE_SIZE);
      const y0 = Math.floor((cy - h / 2) / TILE_SIZE);
      const y1 = Math.floor((cy + h / 2) / TILE_SIZE);
      for (let tx = x0; tx <= x1; tx++) {
        for (let ty = y0; ty <= y1; ty++) {
          const img = getTile(SPOT_ZOOM, tx, ty, schedule);
          if (!img) continue;
          ctx.drawImage(img, tx * TILE_SIZE + ox, ty * TILE_SIZE + oy);
          drew = true;
        }
      }
    }
    credit.hidden = !drew;
  }

  // Width follows the card it sits in, which isn't known until layout — and
  // changes on rotation. The first callback is the first draw.
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(schedule).observe(wrap);
  } else {
    schedule();
  }
  if (typeof IntersectionObserver === "function") {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      onScreen = true;
      schedule();
    }, { rootMargin: "200px" }); // start fetching just before it scrolls in
    io.observe(wrap);
  } else {
    onScreen = true;
    schedule();
  }
  return wrap;
}
