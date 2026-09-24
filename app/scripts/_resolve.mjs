// The local copy of RESOLVE Ecoregions 2017, for build scripts.
//
// `npm run resolve:fetch` writes the simplified shapes to
// data/sources/resolve-ecoregions/ecoregions-2017.geojson (git-ignored). This
// module reads them and answers the two questions the build asks: which
// ecoregion is this point in, and what do these ecoregions look like.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FILE = join(
  dirname(fileURLToPath(import.meta.url)), "..", "..",
  "data", "sources", "resolve-ecoregions", "ecoregions-2017.geojson",
);

let cache = null;

/** Every ecoregion as a GeoJSON feature. Throws with the fix if the file is missing. */
export function resolveFeatures() {
  if (cache) return cache;
  if (!existsSync(FILE)) {
    throw new Error(`${FILE} is missing — run \`cd app && npm run resolve:fetch\` first (downloads 149 MB once).`);
  }
  cache = JSON.parse(readFileSync(FILE, "utf8")).features;
  return cache;
}

/** Even-odd point-in-polygon over every ring of a MultiPolygon. */
function contains(geometry, lon, lat) {
  let inside = false;
  for (const poly of geometry.coordinates) {
    for (const ring of poly) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
      }
    }
  }
  return inside;
}

/** The ecoregion at a point, or null (sea, or a coastline the simplification moved). */
export function ecoregionAt(lat, lon) {
  const hit = resolveFeatures().find((f) => contains(f.geometry, lon, lat));
  return hit ? hit.properties : null;
}

/** The features for a set of ECO_IDs. */
export function ecoregionFeatures(ids) {
  const want = new Set(ids.map(Number));
  return resolveFeatures().filter((f) => want.has(Number(f.properties.ECO_ID)));
}
