// Export and import end to end: the app's own save, the exact text the
// download writes, and the app's own restore — against a real IndexedDB, on
// more than one "device".
//
// `backup.test.ts` pins the rules on plain arrays. This file pins what those
// rules can't see: that everything a person made actually reaches the file
// from the stores it lives in, comes back into them, and survives being carried
// back and forth between devices that kept working in between.
//
// A device here is its own IndexedDB (fake-indexeddb, a complete in-memory
// implementation), its own localStorage, and its own fresh copy of the app's
// modules — so one device's open connection or cached setting can't leak into
// another's. Calls are awaited one at a time, which is what makes swapping the
// globals between devices safe.
import { beforeAll, describe, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import type { Planting, SavedSpot } from "../types";

class MemoryStorage {
  private map = new Map<string, string>();
  get length(): number {
    return this.map.size;
  }
  key(i: number): string | null {
    return [...this.map.keys()][i] ?? null;
  }
  getItem(k: string): string | null {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.map.set(k, String(v));
  }
  removeItem(k: string): void {
    this.map.delete(k);
  }
  clear(): void {
    this.map.clear();
  }
}

async function load() {
  return {
    backup: await import("./backup"),
    db: await import("../db"),
    account: await import("./inat-account"),
    sightings: await import("./spot-sightings"),
    units: await import("./units"),
    i18n: await import("./i18n"),
    analytics: await import("./analytics"),
  };
}
type App = Awaited<ReturnType<typeof load>>;

interface Device {
  idb: IDBFactory;
  ls: MemoryStorage;
  app: App;
}

const g = globalThis as unknown as Record<string, unknown>;

function use(d: Pick<Device, "idb" | "ls">): void {
  g.indexedDB = d.idb;
  g.localStorage = d.ls;
}

/** A browser that has never seen Indigene. */
async function device(): Promise<Device> {
  const base = { idb: new IDBFactory(), ls: new MemoryStorage() };
  use(base);
  vi.resetModules();
  return { ...base, app: await load() };
}

/** Run something on one device. */
async function on<T>(d: Device, fn: (app: App) => Promise<T> | T): Promise<T> {
  use(d);
  return fn(d.app);
}

/** "Save a copy": the same text `downloadSpotsFile` writes. */
async function saveCopy(d: Device): Promise<string> {
  return on(d, async ({ backup }) => `${JSON.stringify(await backup.collectSpots(), null, 2)}\n`);
}

/** "Bring a copy in", answering any look-alike question with `combine`. */
async function bringIn(d: Device, text: string, combine: Record<string, string> = {}) {
  return on(d, async ({ backup }) => {
    const read = backup.parseSpotsFile(text);
    if (!read.ok) throw new Error(`file refused: ${read.why}`);
    const restore = await backup.applySpotsFile(read.file, read.skipped, combine);
    restore.finish();
    return restore.tally;
  });
}

/** Everything a person made, read back through the app's own stores. */
async function snapshot(d: Device) {
  return on(d, async ({ db, account, sightings, backup }) => {
    const spots = await db.listSpots();
    const plantings = await db.listPlantings();
    const refs = [
      ...plantings.flatMap((p) => p.observations),
      ...spots.flatMap((s) => (s.invasives ?? []).flatMap((i) => i.observations)),
    ].sort();
    const obs: Record<string, unknown> = {};
    for (const r of refs) obs[r] = (await db.getCachedObservations(`obs:${r}`)) ?? null;
    const lookups: Record<string, [boolean, boolean]> = {};
    for (const s of spots) {
      lookups[s.id] = [await sightings.lookupAllowed(s.id), await sightings.ownLookupAllowed(s.id)];
    }
    return {
      spots,
      plantings,
      obs,
      lookups,
      login: account.linkedLogin(),
      weights: await db.kvGet("weights"),
      filters: await db.kvGet("filters"),
      sticky: await db.kvGet("sticky"),
      units: d.ls.getItem("indigene:units"),
      lang: d.ls.getItem("indigene:lang"),
      counting: d.ls.getItem("indigene.analytics"),
      aliases: await backup.spotAliases(),
    };
  });
}

// --- fixtures ------------------------------------------------------------

const weights = { host: 3, pollinator: 1, bird: 2, stormwater: 0, erosion: 0, carbon: 1, establishment: 2 };

function spot(id: string, over: Partial<SavedSpot> = {}): SavedSpot {
  return {
    id,
    createdAt: 1_700_000_000_000,
    label: "Back fence",
    lat: 45.52,
    lon: -122.68,
    site: null,
    sun: { hours: 6, low: 5, high: 7, label: "Part sun", deciduousAdjusted: false, source: "manual" },
    horizon: null,
    soilOverride: null,
    deciduousOverhead: false,
    regionOverride: null,
    weights,
    ...over,
  };
}

function planting(id: string, spotId: string, over: Partial<Planting> = {}): Planting {
  return {
    id,
    spotId,
    plantId: "red-flowering-currant",
    count: 1,
    planted: { year: 2025, month: 4 },
    observations: [],
    createdAt: 1_700_000_100_000,
    ...over,
  };
}

function sightingRecord(ref: string, capturedAt: number) {
  return {
    key: `obs:${ref}`,
    capturedAt,
    observations: [
      {
        id: Number(ref),
        taxonId: 54813,
        taxonName: "Ribes sanguineum",
        observer: "a-gardener",
        place: null,
        lat: null,
        lon: null,
        distanceKm: null,
        observedOn: "2025-04-12",
        photos: [
          {
            id: 9,
            thumbUrl: `https://static.inaturalist.org/photos/${ref}/square.jpg`,
            mediumUrl: `https://static.inaturalist.org/photos/${ref}/medium.jpg`,
            largeUrl: `https://static.inaturalist.org/photos/${ref}/large.jpg`,
            license: "cc-by",
            attribution: "(c) a-gardener",
          },
        ],
      },
    ],
  };
}

/** A garden with one of everything, put there the way the app puts it. */
async function seedGarden(d: Device): Promise<void> {
  await on(d, async ({ db, account, sightings, units, i18n, analytics }) => {
    await db.saveSpot(
      spot("s1", { invasives: [{ invasiveId: "english-ivy", observations: ["111"], addedAt: 2 }] })
    );
    await db.savePlanting(planting("p1", "s1", { observations: ["222"], note: "From the plant sale" }));
    await db.savePlanting(planting("p2", "s1", { plantId: "sword-fern", planted: null }));
    await db.putCachedObservations(sightingRecord("222", 5));
    await db.putCachedObservations({ key: "obs:111", capturedAt: 6, observations: [] });
    await sightings.allowLookup("s1");
    await sightings.allowOwnLookup("s1");
    await db.kvSet("weights", weights);
    await db.kvSet("filters", {
      requireDeerResistant: true,
      excludeThorny: false,
      excludePetToxic: false,
      excludeAggressive: false,
      requireNoWater: false,
      maxHeightFt: 6,
      maxSpreadFt: null,
    });
    await db.kvSet("sticky", { defaultRegion: "pnw" });
    account.setLinkedLogin("a-gardener");
    units.setUnitPref("imperial");
    i18n.setLang("fr");
    analytics.setAnalyticsEnabled(false);
  });
}

/** Rows compared as sets: devices that merged in different orders hold the
 *  same things, not necessarily in the same order. */
function sorted<T extends { id: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.id.localeCompare(b.id));
}

beforeAll(() => {
  // Restoring a language sets <html lang>; this is the only page the app touches.
  g.document = { documentElement: {} };
});

// --- tests ----------------------------------------------------------------

describe("save a copy, bring it in", () => {
  it("puts every part of a garden back on a new device", async () => {
    const phone = await device();
    await seedGarden(phone);
    const laptop = await device();

    const tally = await bringIn(laptop, await saveCopy(phone));

    const { aliases: _a, ...before } = await snapshot(phone);
    const { aliases: _b, ...after } = await snapshot(laptop);
    expect(after).toEqual(before);
    expect(tally).toMatchObject({ spotsAdded: 1, plantingsAdded: 2, sightingsAdded: 2, skipped: 0 });
  });

  it("changes nothing the second time", async () => {
    const phone = await device();
    await seedGarden(phone);
    const laptop = await device();
    const file = await saveCopy(phone);
    await bringIn(laptop, file);
    const once = await snapshot(laptop);

    const again = await bringIn(laptop, file);

    expect(await snapshot(laptop)).toEqual(once);
    expect(again).toMatchObject({
      spotsAdded: 0,
      spotsUpdated: 0,
      plantingsAdded: 0,
      plantingsUpdated: 0,
      sightingsAdded: 0,
      settingsRestored: 0,
    });
  });

  it("can restore a copy of a copy", async () => {
    const phone = await device();
    await seedGarden(phone);
    const laptop = await device();
    await bringIn(laptop, await saveCopy(phone));
    const tablet = await device();

    await bringIn(tablet, await saveCopy(laptop));

    const { aliases: _a, ...a } = await snapshot(phone);
    const { aliases: _c, ...c } = await snapshot(tablet);
    expect(c).toEqual(a);
  });
});

describe("successive imports between devices that kept working", () => {
  async function twoDevices() {
    const phone = await device();
    await seedGarden(phone);
    const laptop = await device();
    await bringIn(laptop, await saveCopy(phone));
    return { phone, laptop };
  }

  it("brings both sides' work together, in either order", async () => {
    const { phone, laptop } = await twoDevices();
    // The phone links a sighting and finds an invasive…
    await on(phone, async ({ db }) => {
      const [p1] = (await db.plantingsForSpot("s1")).filter((p) => p.id === "p1");
      await db.savePlanting({ ...p1, observations: [...p1.observations, "333"] });
      const s1 = (await db.getSpot("s1"))!;
      await db.saveSpot({
        ...s1,
        invasives: [...(s1.invasives ?? []), { invasiveId: "himalayan-blackberry", observations: ["444"], addedAt: 7 }],
      });
      await db.putCachedObservations(sightingRecord("333", 8));
    });
    // …while the laptop renames the spot and logs a new planting with its own sighting.
    await on(laptop, async ({ db }) => {
      const s1 = (await db.getSpot("s1"))!;
      await db.saveSpot({ ...s1, label: "Fence by the alley" });
      await db.savePlanting(planting("p3", "s1", { plantId: "oregon-grape", observations: ["555"] }));
    });

    await bringIn(laptop, await saveCopy(phone));
    await bringIn(phone, await saveCopy(laptop));

    const p = await snapshot(phone);
    const l = await snapshot(laptop);
    // Same plantings and sightings on both…
    expect(sorted(l.plantings)).toEqual(sorted(p.plantings));
    expect(l.plantings.map((x) => x.id).sort()).toEqual(["p1", "p2", "p3"]);
    expect(l.plantings.find((x) => x.id === "p1")!.observations).toEqual(["222", "333"]);
    expect(l.spots[0].invasives).toEqual(p.spots[0].invasives);
    expect(l.spots[0].invasives!.map((i) => i.invasiveId)).toEqual(["english-ivy", "himalayan-blackberry"]);
    expect(l.obs["333"]).toEqual(p.obs["333"]);
    // …and each kept its own name for the spot: two names can't be merged.
    expect(p.spots[0].label).toBe("Back fence");
    expect(l.spots[0].label).toBe("Fence by the alley");
  });

  it("an older copy can't undo newer work", async () => {
    const phone = await device();
    await seedGarden(phone);
    const old = await saveCopy(phone);
    await on(phone, async ({ db }) => {
      await db.savePlanting(planting("p9", "s1", { plantId: "vine-maple", count: 3 }));
      const [p1] = (await db.listPlantings()).filter((p) => p.id === "p1");
      await db.savePlanting({ ...p1, observations: ["222", "999"], count: 4 });
    });
    const newer = await snapshot(phone);

    const tally = await bringIn(phone, old);

    expect(await snapshot(phone)).toEqual(newer);
    expect(tally).toMatchObject({ spotsAdded: 0, plantingsAdded: 0, plantingsUpdated: 0 });
  });

  it("brings back a spot deleted since the copy was made", async () => {
    const { phone, laptop } = await twoDevices();
    await on(laptop, ({ db }) => db.deleteSpot("s1"));
    expect((await snapshot(laptop)).plantings).toEqual([]);

    await bringIn(laptop, await saveCopy(phone));

    const l = await snapshot(laptop);
    expect(l.spots.map((s) => s.id)).toEqual(["s1"]);
    expect(l.plantings.map((p) => p.id).sort()).toEqual(["p1", "p2"]);
  });

  it("keeps a newer saved sighting, and replaces an older one", async () => {
    const { phone, laptop } = await twoDevices();
    await on(laptop, ({ db }) => db.putCachedObservations(sightingRecord("222", 50)));
    await on(phone, async ({ db }) => {
      await db.putCachedObservations({ ...sightingRecord("222", 10), observations: [] });
      await db.putCachedObservations({ ...sightingRecord("111", 60) });
    });

    await bringIn(laptop, await saveCopy(phone));

    const l = await snapshot(laptop);
    expect(l.obs["222"]).toMatchObject({ capturedAt: 50 });
    expect(l.obs["111"]).toMatchObject({ capturedAt: 60 });
  });

  it("leaves a setting already chosen here alone, and fills the ones that aren't", async () => {
    const phone = await device();
    await seedGarden(phone);
    const laptop = await device();
    await on(laptop, async ({ units, account }) => {
      units.setUnitPref("metric");
      account.setLinkedLogin("someone-else");
    });

    await bringIn(laptop, await saveCopy(phone));

    const l = await snapshot(laptop);
    expect(l.units).toBe("metric");
    expect(l.login).toBe("someone-else");
    expect(l.lang).toBe("fr");
    expect(l.counting).toBe("off");
    expect(l.weights).toEqual(weights);
  });
});

describe("the same garden saved separately on two devices", () => {
  async function separately() {
    const phone = await device();
    await on(phone, async ({ db }) => {
      await db.saveSpot(spot("phone-1", { label: "Front bed" }));
      await db.savePlanting(planting("a1", "phone-1", { observations: ["222"] }));
      await db.savePlanting(planting("a2", "phone-1", { plantId: "sword-fern" }));
    });
    const laptop = await device();
    await on(laptop, async ({ db }) => {
      // ~40 m away, same name, one planting matching the phone's (same plant, same date).
      await db.saveSpot(spot("laptop-1", { label: "front bed", lat: 45.52036 }));
      await db.savePlanting(planting("b1", "laptop-1", { observations: ["333"], note: "Bare root" }));
      await db.savePlanting(planting("b2", "laptop-1", { plantId: "vine-maple" }));
    });
    return { phone, laptop };
  }

  it("asks, then combines into one spot without doubling a planting", async () => {
    const { phone, laptop } = await separately();
    const file = await saveCopy(phone);

    const pairs = await on(laptop, async ({ backup, db }) => {
      const read = backup.parseSpotsFile(file);
      if (!read.ok) throw new Error(read.why);
      return backup.likelySameSpots(await db.listSpots(), read.file, await backup.spotAliases());
    });
    expect(pairs).toHaveLength(1);
    expect(pairs[0]).toMatchObject({ suggest: "combine", here: { id: "laptop-1" }, there: { id: "phone-1" } });

    const tally = await bringIn(laptop, file, { "phone-1": "laptop-1" });

    const l = await snapshot(laptop);
    expect(l.spots.map((s) => s.id)).toEqual(["laptop-1"]);
    expect(l.spots[0].label).toBe("front bed");
    expect(sorted(l.plantings).map((p) => [p.id, p.spotId, p.observations])).toEqual([
      ["a2", "laptop-1", []],
      ["b1", "laptop-1", ["333", "222"]],
      ["b2", "laptop-1", []],
    ]);
    expect(l.plantings.find((p) => p.id === "b1")!.note).toBe("Bare root");
    expect(tally).toMatchObject({ spotsCombined: 1, plantingsAdded: 1, plantingsUpdated: 1 });
  });

  it("folds a later copy into the same spot without asking again", async () => {
    const { phone, laptop } = await separately();
    await bringIn(laptop, await saveCopy(phone), { "phone-1": "laptop-1" });
    await on(phone, ({ db }) =>
      db.savePlanting(planting("a3", "phone-1", { plantId: "oregon-grape", observations: ["777"] }))
    );
    const later = await saveCopy(phone);

    const pairs = await on(laptop, async ({ backup, db }) => {
      const read = backup.parseSpotsFile(later);
      return read.ok ? backup.likelySameSpots(await db.listSpots(), read.file, await backup.spotAliases()) : null;
    });
    expect(pairs).toEqual([]);

    await bringIn(laptop, later);

    const l = await snapshot(laptop);
    expect(l.spots.map((s) => s.id)).toEqual(["laptop-1"]);
    expect(l.plantings.find((p) => p.id === "a3")).toMatchObject({ spotId: "laptop-1", observations: ["777"] });
  });

  it("keeps both when asked to, and doesn't ask or duplicate next time", async () => {
    const { phone, laptop } = await separately();
    const file = await saveCopy(phone);

    await bringIn(laptop, file, {});
    await bringIn(laptop, file, {});

    const l = await snapshot(laptop);
    expect(l.spots.map((s) => s.id).sort()).toEqual(["laptop-1", "phone-1"]);
    expect(l.plantings).toHaveLength(4);
    const pairs = await on(laptop, async ({ backup, db }) => {
      const read = backup.parseSpotsFile(file);
      return read.ok ? backup.likelySameSpots(await db.listSpots(), read.file) : null;
    });
    expect(pairs).toEqual([]);
  });

  it("combining back the other way converges too", async () => {
    const { phone, laptop } = await separately();
    await bringIn(laptop, await saveCopy(phone), { "phone-1": "laptop-1" });

    // The phone now gets the laptop's copy, which holds only "laptop-1" — a
    // spot the phone doesn't have by id. It's the phone's turn to combine.
    await bringIn(phone, await saveCopy(laptop), { "laptop-1": "phone-1" });

    const p = await snapshot(phone);
    const l = await snapshot(laptop);
    expect(p.spots.map((s) => s.id)).toEqual(["phone-1"]);
    const plants = (x: typeof p) =>
      x.plantings.map((r) => `${r.plantId}:${[...r.observations].sort().join(",")}`).sort();
    expect(plants(p)).toEqual(plants(l));
  });
});

describe("a damaged or old file", () => {
  it("brings in what it can read and counts the rest", async () => {
    const phone = await device();
    await seedGarden(phone);
    const file = JSON.parse(await saveCopy(phone));
    file.spots.push({ id: "no-coordinates" }, "nonsense");
    file.plantings.push(planting("orphan", "nowhere"), { id: "no-plant" });
    file.sightings.push({ ref: "222" });
    const laptop = await device();

    const tally = await bringIn(laptop, JSON.stringify(file));

    expect(tally).toMatchObject({ spotsAdded: 1, plantingsAdded: 2 });
    expect(tally.skipped).toBe(5);
    expect((await snapshot(laptop)).spots.map((s) => s.id)).toEqual(["s1"]);
  });

  it("restores a version-1 file, which held only spots and plantings", async () => {
    const phone = await device();
    await seedGarden(phone);
    const { lookups: _l, sightings: _s, preferences: _p, ...v1 } = JSON.parse(await saveCopy(phone));
    const laptop = await device();

    await bringIn(laptop, JSON.stringify({ ...v1, version: 1 }));

    const [p, l] = [await snapshot(phone), await snapshot(laptop)];
    expect(l.spots).toEqual(p.spots);
    expect(l.plantings).toEqual(p.plantings);
    expect(l.login).toBeNull();
  });
});
