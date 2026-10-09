// The spots file is the only copy of a garden that leaves the browser, so the
// two things that can lose work are pinned here: a field that doesn't survive
// the round trip, and an import that drops or overwrites what's already here.
import { describe, expect, it } from "vitest";
import { SPOTS_FORMAT, SPOTS_VERSION, parseSpotsFile, planImport } from "./backup";
import type { Preferences, SavedSighting, SpotsFile } from "./backup";
import type { Planting, SavedSpot } from "../types";

// `Required<>` on purpose: a field added to `SavedSpot` or `Planting` stops
// this file compiling until the fixture carries it — and then the round trip
// below fails until `backup.ts` reads it back.
const spot: Required<SavedSpot> = {
  id: "s1",
  createdAt: 1_700_000_000_000,
  label: "Back fence",
  lat: 45.52,
  lon: -122.68,
  site: {
    lat: 45.52,
    lon: -122.68,
    elevationFt: 150,
    slopeDeg: 3,
    zone: "8b",
    zoneMinTempF: 15,
    annualRainIn: 42,
    soil: { texture: "silt loam", drainage: "well", phEstimate: 6.2, source: "SSURGO", confidence: "mapped" },
    ecoregion: "Willamette Valley",
    ecoregionInfo: {
      provider: "epa-omernik",
      code: "3",
      name: "Willamette Valley",
      hierarchy: ["7", "7.1"],
      detail: { code: "3a", name: "Portland/Vancouver Basin" },
    },
    fromCache: true,
  },
  sun: { hours: 6, low: 5, high: 7, label: "Part sun", deciduousAdjusted: true, source: "scan" },
  horizon: { angles: Array.from({ length: 72 }, (_, i) => i % 30), source: "scan" },
  soilOverride: { texture: "clay", moisture: "wet" },
  deciduousOverhead: true,
  regionOverride: "pnw",
  weights: { host: 3, pollinator: 2, bird: 1, stormwater: 0, erosion: 0, carbon: 1, establishment: 2 },
  invasives: [{ invasiveId: "english-ivy", observations: ["111"], addedAt: 1_700_000_100_000 }],
};

const planting: Required<Planting> = {
  id: "p1",
  spotId: "s1",
  plantId: "red-flowering-currant",
  count: 3,
  planted: { year: 2025, month: 4, day: 12 },
  observations: ["222", "0d6a1f0e-0000-4000-8000-000000000000"],
  note: "From the plant sale",
  createdAt: 1_700_000_200_000,
};

// Same `Required<>` trick for everything else a backup carries.
const sighting: Required<SavedSighting> = {
  ref: "222",
  capturedAt: 1_700_000_300_000,
  observation: {
    id: 222,
    taxonId: 54813,
    taxonName: "Ribes sanguineum",
    observer: "a-gardener",
    place: "Portland, OR",
    lat: 45.52,
    lon: -122.68,
    distanceKm: null,
    observedOn: "2025-04-12",
    photos: [
      {
        id: 9,
        thumbUrl: "https://static.inaturalist.org/photos/9/square.jpg",
        mediumUrl: "https://static.inaturalist.org/photos/9/medium.jpg",
        largeUrl: "https://static.inaturalist.org/photos/9/large.jpg",
        license: "cc-by",
        attribution: "(c) a-gardener, some rights reserved (CC BY)",
      },
    ],
    taxonPhoto: true,
  },
};

const preferences: Required<Preferences> = {
  inatLogin: "a-gardener",
  weights: spot.weights,
  filters: {
    requireDeerResistant: true,
    excludeThorny: false,
    excludePetToxic: true,
    excludeAggressive: false,
    requireNoWater: false,
    maxHeightFt: 6,
    maxSpreadFt: null,
  },
  sticky: {
    spot: {
      lat: 45.52,
      lon: -122.68,
      regionId: null,
      sun: spot.sun,
      horizon: spot.horizon,
      deciduousOverhead: true,
      moisture: "mesic",
      savedAt: 1_700_000_400_000,
    },
    defaultRegion: "pnw",
  },
  units: "imperial",
  lang: "fr",
  counting: false,
};

function file(spots: SavedSpot[], plantings: Planting[]): SpotsFile {
  return {
    format: SPOTS_FORMAT,
    version: SPOTS_VERSION,
    exportedAt: "",
    spots,
    plantings,
    lookups: [],
    sightings: [],
    preferences: {},
  };
}

describe("parseSpotsFile", () => {
  it("reads back every field it wrote", () => {
    const text = JSON.stringify(file([spot], [planting]));
    const read = parseSpotsFile(text);
    expect(read.ok).toBe(true);
    if (!read.ok) return;
    expect(read.skipped).toBe(0);
    expect(read.file.spots).toEqual([spot]);
    expect(read.file.plantings).toEqual([planting]);
  });

  it("reads back lookups, sightings and settings", () => {
    const lookups = [{ spotId: "s1", nearby: true, own: false }];
    const text = JSON.stringify({ ...file([spot], [planting]), lookups, sightings: [sighting], preferences });
    const read = parseSpotsFile(text);
    expect(read.ok).toBe(true);
    if (!read.ok) return;
    expect(read.skipped).toBe(0);
    expect(read.file.lookups).toEqual(lookups);
    expect(read.file.sightings).toEqual([sighting]);
    expect(read.file.preferences).toEqual(preferences);
  });

  it("still reads a version-1 file, with nothing extra", () => {
    const { lookups: _l, sightings: _s, preferences: _p, ...v1 } = { ...file([spot], [planting]), version: 1 };
    const read = parseSpotsFile(JSON.stringify(v1));
    expect(read.ok && read.file).toMatchObject({ spots: [spot], lookups: [], sightings: [], preferences: {} });
  });

  it("drops a photo that isn't served over https", () => {
    const obs = sighting.observation!;
    const bad = { ...sighting, observation: { ...obs, photos: [{ ...obs.photos[0], thumbUrl: "http://x.test/a.gif" }] } };
    const read = parseSpotsFile(JSON.stringify({ ...file([], []), sightings: [bad] }));
    expect(read.ok && read.file.sightings[0].observation?.photos).toEqual([]);
  });

  it("refuses what isn't ours, and what's too new, without throwing", () => {
    expect(parseSpotsFile("{")).toEqual({ ok: false, why: "unreadable" });
    expect(parseSpotsFile('{"spots":[]}')).toEqual({ ok: false, why: "notOurs" });
    expect(parseSpotsFile(JSON.stringify({ format: SPOTS_FORMAT, version: SPOTS_VERSION + 1 }))).toEqual({
      ok: false,
      why: "tooNew",
    });
  });

  it("leaves out and counts rows it can't place", () => {
    const text = JSON.stringify({
      ...file([spot], [planting]),
      spots: [spot, { id: "no-place" }, 7],
      plantings: [planting, { id: "p9" }],
    });
    const read = parseSpotsFile(text);
    expect(read.ok && read.skipped).toBe(3);
  });
});

describe("planImport", () => {
  it("brings in spots and plantings this device is missing", () => {
    const plan = planImport([], [], file([spot], [planting]));
    expect(plan.spots).toEqual([spot]);
    expect(plan.plantings).toEqual([planting]);
    expect(plan.tally).toMatchObject({ spotsAdded: 1, plantingsAdded: 1, skipped: 0 });
  });

  it("writes nothing when everything is already here", () => {
    const plan = planImport([spot], [planting], file([spot], [planting]));
    expect(plan.spots).toEqual([]);
    expect(plan.plantings).toEqual([]);
    expect(plan.tally).toMatchObject({ spotsKnown: 1, plantingsKnown: 1 });
  });

  it("adds sightings linked elsewhere to a planting both copies have", () => {
    const there = { ...planting, observations: ["222", "333"], note: "Elsewhere" };
    const plan = planImport([spot], [planting], file([spot], [there]));
    expect(plan.plantings).toEqual([
      { ...planting, observations: ["222", "0d6a1f0e-0000-4000-8000-000000000000", "333"] },
    ]);
    expect(plan.tally.plantingsUpdated).toBe(1);
  });

  it("fills a missing note but never replaces one", () => {
    const { note: _, ...bare } = planting;
    const plan = planImport([spot], [bare], file([spot], [planting]));
    expect(plan.plantings[0].note).toBe("From the plant sale");
  });

  it("adds invasives and their sightings, and keeps this copy's other fields", () => {
    const there: SavedSpot = {
      ...spot,
      label: "Renamed elsewhere",
      invasives: [
        { invasiveId: "english-ivy", observations: ["111", "444"], addedAt: 1 },
        { invasiveId: "himalayan-blackberry", observations: ["555"], addedAt: 2 },
      ],
    };
    const plan = planImport([spot], [], file([there], []));
    expect(plan.spots).toHaveLength(1);
    expect(plan.spots[0].label).toBe("Back fence");
    expect(plan.spots[0].invasives).toEqual([
      { ...spot.invasives[0], observations: ["111", "444"] },
      { invasiveId: "himalayan-blackberry", observations: ["555"], addedAt: 2 },
    ]);
    expect(plan.tally.spotsUpdated).toBe(1);
  });

  it("skips a planting whose spot is nowhere", () => {
    const plan = planImport([], [], file([], [planting]));
    expect(plan.plantings).toEqual([]);
    expect(plan.tally.skipped).toBe(1);
  });

  it("is a no-op the second time", () => {
    const there = { ...planting, observations: ["999"] };
    const first = planImport([spot], [planting], file([spot], [there]));
    const second = planImport([spot], first.plantings, file([spot], [there]));
    expect(second.plantings).toEqual([]);
  });
});
