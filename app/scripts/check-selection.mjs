// `npm run selection:check` — stand at a known place and ask the app which
// region's plant list it would hand you.
//
// This exists because of a bug that typechecked, built, and was wrong.
//
// `fetchEcoregion` routes a point to one of three ecoregion services, and the
// router used `inConus()` — a crude rectangle around the conterminous US whose
// top-left corner takes in **southern British Columbia**. Vancouver, Victoria
// and Nanaimo all sit inside it. So they were sent to the EPA, which has no
// polygon north of the border, got null, and fell through to the coverage box.
// Nothing failed. The region was still returned, because the box alone is a
// legitimate answer offline — the app simply stopped refining, silently, for
// exactly the readers the Pacific Northwest region had just been extended to
// reach.
//
// No amount of typechecking catches that. What catches it is standing in
// Vancouver and asking. So: a table of real places, the real services, and the
// app's own `regionForSite`.
//
// It needs the network, so it runs like `names:check` and `lookalikes:check` —
// by hand or in CI, not in the build.
//
// ## What each row asserts
//
//   region    the id `regionForSite` should return, or null for "no list here"
//   via       how it should have decided:
//               "epa-omernik" / "cec-na" / "eea-biogeo" — a live code matched
//               "box" — the lookup gave nothing and the coverage box decided
//             A row that lands in the right region for the *wrong reason* fails.
//             That is the whole point: Vancouver via "box" is the bug.
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("selection:check");

/** Known ground. Each one is a place a person could be standing. */
const PLACES = [
  // --- Pacific Northwest, the American half (EPA answers) ---
  { name: "Portland, OR", lat: 45.5152, lon: -122.6784, region: "pnw", via: "epa-omernik" },
  { name: "Seattle, WA", lat: 47.6062, lon: -122.3321, region: "pnw", via: "epa-omernik" },
  { name: "Eugene, OR", lat: 44.0521, lon: -123.0868, region: "pnw", via: "epa-omernik" },

  // --- Pacific Northwest, the Canadian half (only the CEC answers) ---
  // These are the rows the routing bug broke: right region, wrong reason.
  { name: "Vancouver, BC", lat: 49.267, lon: -123.165, region: "pnw", via: "cec-na" },
  { name: "Victoria, BC", lat: 48.4284, lon: -123.3656, region: "pnw", via: "cec-na" },
  { name: "Surrey, BC", lat: 49.19, lon: -122.849, region: "pnw", via: "cec-na" },
  { name: "Campbell River, BC", lat: 50.02, lon: -125.24, region: "pnw", via: "cec-na" },
  { name: "Squamish, BC", lat: 49.7016, lon: -123.1558, region: "pnw", via: "cec-na" },

  // --- the refusals, which matter as much as the matches ---
  { name: "Bend, OR (east of the crest)", lat: 44.0582, lon: -121.3153, region: null },
  { name: "Merritt, BC (dry interior)", lat: 50.1113, lon: -120.7862, region: null },
  { name: "Prince Rupert, BC (north coast)", lat: 54.3150, lon: -130.3208, region: null },

  // --- the other regions, so this doesn't only guard the PNW ---
  { name: "Philadelphia, PA", lat: 39.9526, lon: -75.1652, region: "mid-atlantic", via: "epa-omernik" },
  { name: "Miami, FL", lat: 25.7617, lon: -80.1918, region: "florida-south", via: "epa-omernik" },
  { name: "Traverse City, MI", lat: 44.7631, lon: -85.6206, region: "north-michigan", via: "epa-omernik" },
  { name: "San Francisco, CA", lat: 37.7749, lon: -122.4194, region: "ca-central-coast", via: "epa-omernik" },
  { name: "Marseille", lat: 43.2965, lon: 5.3698, region: "france-mediterranean", via: "eea-biogeo" },
  { name: "Paris", lat: 48.8566, lon: 2.3522, region: "france-atlantic", via: "eea-biogeo" },
  { name: "Dublin", lat: 53.3498, lon: -6.2603, region: "ireland", via: "eea-biogeo" },
];

const loader = await openLoader();
let failed = 0;

try {
  const { fetchSite } = await loader.load("/src/lib/site.ts");
  const { regionForSite } = await loader.load("/src/lib/plants.ts");

  console.log(`Standing in ${PLACES.length} places and asking which list the app hands over.\n`);

  for (const p of PLACES) {
    let site = null;
    try {
      site = await fetchSite(p.lat, p.lon);
    } catch {
      /* a failed lookup is itself an answer: the box should carry it */
    }
    const info = site?.ecoregionInfo ?? null;
    const got = regionForSite(p.lat, p.lon, site);
    const gotId = got?.meta.id ?? null;
    const gotVia = info ? info.provider : "box";

    const regionOk = gotId === p.region;
    // `via` is only asserted where the row states one — a refusal has no "via".
    const viaOk = p.via === undefined || gotVia === p.via;
    const ok = regionOk && viaOk;
    if (!ok) failed++;

    const want = p.region ?? "no list";
    const have = gotId ?? "no list";
    const detail = info ? `${info.provider} ${info.code} — ${info.name}` : "no live code, box decided";
    console.log(
      `  ${ok ? "ok  " : "FAIL"}  ${p.name.padEnd(32)} ${have.padEnd(22)} ${detail}` +
        (ok ? "" : `\n        expected ${want}${p.via ? ` via ${p.via}` : ""}, got ${have} via ${gotVia}`)
    );
  }
} finally {
  await loader.close();
}

console.log("");
if (failed) {
  console.log(`selection: ${failed} of ${PLACES.length} places got the wrong answer.`);
  process.exit(1);
}
console.log(`selection: all ${PLACES.length} places get the region they should, for the reason they should.`);
