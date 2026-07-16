// Slippy-map tile math and a tiny tile loader for the location map.
//
// The map uses OpenStreetMap's standard raster tiles, drawn straight onto the
// existing canvas — no map library. Usage stays well inside the OSMF tile
// policy (https://operations.osmfoundation.org/policies/tiles/): one fixed
// zoom, only the handful of tiles the viewport needs, attribution on the map,
// and no prefetching or offline caching (offline, the schematic grid takes
// over). The browser's Referer header identifies the app.

export const TILE_SIZE = 256;
const TILE_HOST = "https://tile.openstreetmap.org";
const EARTH_CIRCUMFERENCE = 40075016.686; // metres at the equator

/** Ground resolution of one tile pixel at this latitude and zoom. */
export function metersPerPixel(lat: number, zoom: number): number {
  return (
    (EARTH_CIRCUMFERENCE * Math.cos((lat * Math.PI) / 180)) /
    (TILE_SIZE * 2 ** zoom)
  );
}

/** Fractional tile coordinates of a point at a zoom (Web Mercator). */
export function tileCoords(
  lat: number,
  lon: number,
  zoom: number
): { x: number; y: number } {
  const n = 2 ** zoom;
  const rad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n,
  };
}

interface TileState {
  img: HTMLImageElement;
  ready: boolean;
  onReady: () => void;
}

// Session-scoped cache: a tile is requested once, then drawn from memory on
// every redraw while the user drags. Failed tiles stay absent (the grid shows
// through) and are not retried until the next app load.
const tiles = new Map<string, TileState>();

/**
 * The tile image if it's already loaded, else null — kicking off the fetch
 * the first time a tile is asked for. `onReady` is called when a fetch lands
 * so the caller can redraw (only the most recent callback is kept).
 */
export function getTile(
  zoom: number,
  x: number,
  y: number,
  onReady: () => void
): HTMLImageElement | null {
  const n = 2 ** zoom;
  const wx = ((x % n) + n) % n; // longitude wraps around the antimeridian
  if (y < 0 || y >= n) return null; // nothing above/below the Mercator square
  const key = `${zoom}/${wx}/${y}`;
  let t = tiles.get(key);
  if (!t) {
    const img = new Image();
    const state: TileState = { img, ready: false, onReady };
    tiles.set(key, state);
    img.onload = () => {
      state.ready = true;
      state.onReady();
    };
    img.src = `${TILE_HOST}/${key}.png`;
    t = state;
  }
  t.onReady = onReady;
  return t.ready ? t.img : null;
}
