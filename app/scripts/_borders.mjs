// Which land inside a region's box is not the region's — shared by the region
// maps (`build-region-maps.mjs`, which trims it off the shading) and the
// matching data (`build-region-borders.mjs`, which keeps a spot on it from
// getting the region's plants). One rule, so a map and a match can't disagree.
//
// A region's box and its ecoregion code don't know about borders. Atlantic
// France's box has to reach 51.2°N for Dunkirk, and Brighton is at 50.8°N; the
// EEA calls southern England "Atlantic" too. Country outlines are what can tell
// them apart: Natural Earth, public domain (1:50m for the maps, 1:10m for the
// match — see build-region-borders.mjs).
import polygonClipping from "polygon-clipping";

/** Land a region may cover beyond its own `countries`, which name its flags,
 *  not its edges. Ireland is the island: Belfast and Derry are on its map. */
export const ALSO_IN = { ireland: ["GB"] };

/** The country codes whose land counts as the region's own. */
export function homeCodes(meta) {
  return [...(meta.countries ?? []), ...(ALSO_IN[meta.id] ?? [])];
}

/** A Natural Earth feature's polygons, as polygon-clipping wants them. */
export const polygonsOf = (f) =>
  f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;

/** The box as one polygon, grown by `pad` degrees on every side. */
export function boxPolygon(b, pad = 0) {
  return [[
    [b.minLon - pad, b.minLat - pad], [b.maxLon + pad, b.minLat - pad],
    [b.maxLon + pad, b.maxLat + pad], [b.minLon - pad, b.maxLat + pad],
    [b.minLon - pad, b.minLat - pad],
  ]];
}

/**
 * The region's own land and everyone else's, each clipped to its box (plus a
 * margin, so a spot just inside the box still has a coast nearby to measure
 * to). Returned as polygon-clipping MultiPolygons.
 */
export function landIn(meta, features, pad = 0.3) {
  const codes = homeCodes(meta);
  const box = boxPolygon(meta.bounds, pad);
  const own = [];
  const foreign = [];
  for (const f of features) {
    const code = f.properties.ISO_A2_EH;
    const clipped = polygonClipping.intersection(polygonsOf(f), box);
    if (!clipped.length) continue;
    (codes.includes(code) ? own : foreign).push(...clipped);
  }
  return { own, foreign };
}
