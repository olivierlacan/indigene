// Regions with their plant lists already in hand, for the scripts.
//
// In the app a region's plant list is a separate download, fetched only for the
// region a reader is actually gardening in (`data/regions.ts`), so `RegionDef`
// carries a `load()` rather than a `seed` array. That is exactly the wrong shape
// for these scripts: every one of them wants all nine lists at once, on a
// machine where "fetching" is reading a file.
//
// So this waits for all of them and hands back the shape the scripts were
// written against — `{ meta, seed }` — with `load` still on it for anything that
// wants it. One await at the top of a script, and the rest reads as it did.
export async function withSeeds(regions) {
  return Promise.all(
    regions.map(async (region) => ({ ...region, seed: await region.load() })),
  );
}
