// The nearest town, remembered — so a spot can say "near Radnor" instead of
// only "40.0379° N, 75.3557° W".
//
// The constraint that shapes this whole module: **the Saved list and the
// Settings card must not go to the network.** Both carry a promise that those
// spots never leave the device, and looking a name up while drawing them would
// quietly break it — the coordinate would go out every time somebody opened a
// list they were told was private.
//
// So the name is learned *during the flow*, at the one moment a person has
// deliberately said "this is my spot" — the same tap that already sends the
// coordinate off for soil, climate and elevation, on a page that says so — and
// kept here. Afterwards the pages that show it are reading a string off this
// device, forever, offline included.
//
// Two more things keep it cheap:
//
//   - **A town is a fact about an area, not a point.** Names are stored per
//     ~5 km cell, so a whole garden, a street, a neighbourhood — and every
//     spot you save in it — share one lookup.
//   - **Sometimes it costs nothing at all.** Somebody who found their spot by
//     searching for their town already told us the name; that path stores it
//     without a request (`noteTown`).
//
// Storage is the same on-device key/value store as the rest (`lib/sticky.ts`
// explains the pattern): read into memory in the background at boot, so the
// pages that print a name never have to wait for a database.
import { kvGet, kvSet } from "../db";
import { nearestPlaceName } from "./geocode";

/**
 * How coarse a cell one name covers, in degrees — about 5.5 km north-to-south.
 *
 * A town name is true of an area, and this is roughly the area it's true of.
 * Finer would ask the same question again for the next street; coarser would
 * start naming the town over the hill.
 */
const CELL = 0.05;

/** How many names to keep. Far more spots than anyone has, small enough that
 *  the record stays a few kilobytes. Oldest learned goes first. */
const MAX = 200;

const KEY = "towns";

let cache: Record<string, string> = {};
let ready: Promise<void> | null = null;

/** Which cell a coordinate falls in. */
function cellKey(lat: number, lon: number): string {
  const q = (v: number) => (Math.round(v / CELL) * CELL).toFixed(2);
  return `${q(lat)},${q(lon)}`;
}

export function loadTowns(): Promise<void> {
  ready = kvGet<Record<string, string>>(KEY)
    .then((v) => {
      if (v && typeof v === "object") cache = v;
    })
    .catch(() => {});
  return ready;
}

/** Settles once the background read has (and never rejects), like `stickyReady`. */
export function townsReady(): Promise<void> {
  return ready ?? Promise.resolve();
}

/**
 * The town for this spot, if this device has been told one — never a lookup.
 *
 * Synchronous on purpose: this is what the Saved list and the Settings card
 * call, and neither may reach the network. No name yet simply means the
 * coordinates speak for themselves, which they were doing anyway.
 */
export function townFor(lat: number, lon: number): string | null {
  return cache[cellKey(lat, lon)] ?? null;
}

/** Keep a name we already have — the free path, when somebody searched for
 *  their town and we were handed it. */
export function noteTown(lat: number, lon: number, name: string): void {
  const key = cellKey(lat, lon);
  if (!name || cache[key]) return;
  cache = { ...cache, [key]: name };
  const keys = Object.keys(cache);
  if (keys.length > MAX) {
    for (const old of keys.slice(0, keys.length - MAX)) delete cache[old];
  }
  void kvSet(KEY, cache).catch(() => {});
}

// One lookup at a time, spaced out: OSM's Nominatim asks for at most one
// request a second, and nothing here is in a hurry — the name is for the next
// time this spot is read, not for this frame.
const GAP_MS = 1100;
let queue: Promise<void> = Promise.resolve();
const inFlight = new Set<string>();

/**
 * Learn the town for a spot the reader has just confirmed, in the background.
 *
 * Called from the flow, never from a page that only displays spots. Silent
 * about everything: already known, offline, no answer, a refused request — all
 * of them just leave the coordinates standing on their own.
 */
export function learnTown(lat: number, lon: number): void {
  const key = cellKey(lat, lon);
  if (cache[key] || inFlight.has(key) || !navigator.onLine) return;
  inFlight.add(key);
  queue = queue
    .then(() => nearestPlaceName(lat, lon))
    .then((name) => {
      if (name) noteTown(lat, lon, name);
    })
    .catch(() => {})
    .then(() => new Promise<void>((r) => setTimeout(r, GAP_MS)))
    .then(() => {
      inFlight.delete(key);
    });
}
