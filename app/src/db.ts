// Minimal IndexedDB wrapper — no dependency. Local-first: saved spots live here
// and never leave the device. One store keyed by id, a tiny key/value store for
// app preferences (weights, last spot), and a cache of trimmed iNaturalist
// observations so the "growing near you" layer hits the network at most once
// per area (see `lib/nearby.ts`).
import type { Planting, SavedSpot } from "./types";
import type { ObservationSummary } from "./lib/inaturalist";

const DB_NAME = "indigene";
const DB_VERSION = 3;
const SPOTS = "spots";
const KV = "kv";
const OBS = "observations";
const PLANTINGS = "plantings";

let dbp: Promise<IDBDatabase> | null = null;

/**
 * How long an open() may sit with no event before we give up on it. Safari
 * can leave a first indexedDB.open() hanging with NO event at all — not
 * success, not error, not even blocked (e.g. when a suspended tab from
 * before a schema bump still holds an old connection). Nothing that awaits
 * such an open would ever settle, so every open gets a watchdog.
 */
const OPEN_TIMEOUT_MS = 2000;

function open(): Promise<IDBDatabase> {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    let settled = false;
    const watchdog = setTimeout(() => {
      settled = true;
      reject(new Error("IndexedDB open timed out"));
    }, OPEN_TIMEOUT_MS);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(SPOTS)) {
        db.createObjectStore(SPOTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(KV)) {
        db.createObjectStore(KV);
      }
      if (!db.objectStoreNames.contains(OBS)) {
        db.createObjectStore(OBS, { keyPath: "key" });
      }
      // What the gardener has actually planted, keyed by its own id and
      // carrying the spot's id as a field. No index: a person's log is tens of
      // rows, not thousands, so reading the store and filtering in JS is both
      // faster to write and one less thing to migrate.
      if (!db.objectStoreNames.contains(PLANTINGS)) {
        db.createObjectStore(PLANTINGS, { keyPath: "id" });
      }
    };
    req.onsuccess = () => {
      clearTimeout(watchdog);
      const db = req.result;
      // Success arriving after the watchdog fired: nobody is waiting on this
      // connection anymore — close it so it can't block a future upgrade.
      if (settled) return db.close();
      // If another tab later opens the database at a newer version, release
      // our connection so its upgrade can proceed instead of blocking forever.
      db.onversionchange = () => db.close();
      resolve(db);
    };
    req.onerror = () => {
      clearTimeout(watchdog);
      reject(req.error);
    };
    // A tab still holding an older-version connection (e.g. left open from
    // before a schema bump) would otherwise stall this open() until that tab
    // goes away — the whole app used to hang on that. Fail fast instead:
    // every caller already degrades gracefully.
    req.onblocked = () => {
      clearTimeout(watchdog);
      reject(new Error("IndexedDB upgrade blocked by another open tab"));
    };
  });
  // Don't cache a failure — once the blocking tab is closed (or a transient
  // error clears), the next call should get a fresh attempt.
  dbp.catch(() => {
    dbp = null;
  });
  return dbp;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

export async function saveSpot(spot: SavedSpot): Promise<void> {
  await tx(SPOTS, "readwrite", (s) => s.put(spot));
}

/**
 * Delete a spot **and everything logged against it**.
 *
 * The planting log is keyed by spot id, so a spot deleted on its own would
 * leave rows describing a garden that no longer exists — invisible, undeletable
 * and counted in nothing. Deleting both here means there is no code path that
 * can create an orphan, rather than a rule every caller has to remember.
 */
export async function deleteSpot(id: string): Promise<void> {
  await tx(SPOTS, "readwrite", (s) => s.delete(id));
  const mine = await plantingsForSpot(id).catch(() => [] as Planting[]);
  await Promise.all(mine.map((p) => deletePlanting(p.id))).catch(() => {});
}

export async function listSpots(): Promise<SavedSpot[]> {
  const all = await tx<SavedSpot[]>(SPOTS, "readonly", (s) => s.getAll());
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSpot(id: string): Promise<SavedSpot | undefined> {
  return tx(SPOTS, "readonly", (s) => s.get(id));
}

// --- The planting log ------------------------------------------------------
// What went into the ground, per spot. Same local-first contract as the spots
// themselves: it lives here and nowhere else.

export async function savePlanting(p: Planting): Promise<void> {
  await tx(PLANTINGS, "readwrite", (s) => s.put(p));
}

export async function deletePlanting(id: string): Promise<void> {
  await tx(PLANTINGS, "readwrite", (s) => s.delete(id));
}

/** Every planting on this device, newest first. */
export async function listPlantings(): Promise<Planting[]> {
  const all = await tx<Planting[]>(PLANTINGS, "readonly", (s) => s.getAll());
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

/** One spot's log, oldest planting first — a garden reads as a chronicle. */
export async function plantingsForSpot(spotId: string): Promise<Planting[]> {
  const all = await listPlantings();
  return all.filter((p) => p.spotId === spotId).reverse();
}

export async function kvGet<T>(key: string): Promise<T | undefined> {
  return tx(KV, "readonly", (s) => s.get(key));
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  await tx(KV, "readwrite", (s) => s.put(value, key));
}

// --- iNaturalist observation cache ---------------------------------------
// One record per lookup area (see `lib/nearby.ts` for how the key is formed):
// a geographic cell for a "near me" lookup, or a region id for an "in this
// region" lookup. We store only the trimmed observation summaries — never the
// raw iNaturalist payload — plus the point we measured from and when, so a read
// can decide whether the cache is still fresh.
export interface CachedObservations {
  /** Cache key: cell+radius for a spot lookup, or `region:<id>` for a region. */
  key: string;
  /** When the list was captured (epoch ms), for staleness checks. */
  capturedAt: number;
  /** The point distances were measured from (the spot; a region's box center).
   *  Absent for a record that answers no "what's near me" question at all — one
   *  observation the gardener linked to a planting by hand. */
  from?: { lat: number; lon: number };
  /** Search radius (spot lookups only). */
  radiusKm?: number;
  /** The region id this list covers (region lookups only). */
  regionId?: string;
  observations: ObservationSummary[];
}

export async function getCachedObservations(
  key: string,
): Promise<CachedObservations | undefined> {
  return tx(OBS, "readonly", (s) => s.get(key));
}

export async function putCachedObservations(
  record: CachedObservations,
): Promise<void> {
  await tx(OBS, "readwrite", (s) => s.put(record));
}
