// Minimal IndexedDB wrapper — no dependency. Local-first: saved spots live here
// and never leave the device. One store keyed by id, plus a tiny key/value
// store for app preferences (weights, last spot).
import type { SavedSpot } from "./types";

const DB_NAME = "indigene";
const DB_VERSION = 1;
const SPOTS = "spots";
const KV = "kv";

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
