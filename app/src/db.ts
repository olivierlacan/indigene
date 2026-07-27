// Minimal IndexedDB wrapper — no dependency. Local-first: saved spots live here
// and never leave the device. One store keyed by id, a tiny key/value store for
// app preferences (weights, last spot), and a cache of trimmed iNaturalist
// observations so the "growing near you" layer hits the network at most once
// per area (see `lib/nearby.ts`).
import type { SavedSpot } from "./types";
import type { ObservationSummary } from "./lib/inaturalist";

const DB_NAME = "indigene";
const DB_VERSION = 2;
const SPOTS = "spots";
const KV = "kv";
const OBS = "observations";

let dbp: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
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
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
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

export async function deleteSpot(id: string): Promise<void> {
  await tx(SPOTS, "readwrite", (s) => s.delete(id));
}

export async function listSpots(): Promise<SavedSpot[]> {
  const all = await tx<SavedSpot[]>(SPOTS, "readonly", (s) => s.getAll());
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSpot(id: string): Promise<SavedSpot | undefined> {
  return tx(SPOTS, "readonly", (s) => s.get(id));
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
  /** The point distances were measured from (the spot; a region's box center). */
  from: { lat: number; lon: number };
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
