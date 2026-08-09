// Your spots, as a file you keep.
//
// Saved spots live in this browser's own database and nowhere else. That's the
// promise the whole app rests on — and it's also why a phone and a laptop know
// nothing about each other, and why clearing a browser's data takes a garden's
// record with it. This module is the seam that lets a person carry their own
// data across that gap by hand: write everything to one JSON file, read it
// back somewhere else.
//
// Three rules shape the format and the reading of it.
//
//  1. **Plain, readable JSON.** Someone who opens the file in a text editor
//     should recognise their own garden in it. No compression, no wrapping,
//     nothing that needs this app to make sense of.
//  2. **Reading never destroys.** An import adds what's missing and leaves what
//     is already here exactly as it is — a spot whose id we already have is
//     kept, not overwritten. The worst a wrong file can do is nothing.
//  3. **A spot's log travels with it.** Deleting a spot deletes its plantings
//     (`db.ts`), so the two belong to each other; a file of spots with no
//     plantings would be a garden with its history quietly dropped.
//
// Everything read out of a file is rebuilt field by field rather than trusted
// as-is. A file that has been hand-edited, half-saved, or written by something
// else entirely is an ordinary thing to meet, and the answer to it is a row
// left out and counted — never a broken screen.
import { listPlantings, listSpots, savePlanting, saveSpot } from "../db";
import type {
  EcoregionInfo,
  HorizonMask,
  PlantedDate,
  Planting,
  SavedSpot,
  SiteData,
  SunEstimate,
  Weights,
} from "../types";
import { DEFAULT_WEIGHTS } from "./ranking";

/** What the file says it is. Checked on read so an unrelated JSON file gets a
 *  plain "that isn't one of ours" rather than a puzzling empty import. */
export const SPOTS_FORMAT = "indigene.spots";

/** The shape's version. Bumped only if a future field can't be read by the
 *  rules below; a file from the future is refused rather than half-read. */
export const SPOTS_VERSION = 1;

export interface SpotsFile {
  format: string;
  version: number;
  /** When it was written (ISO 8601) — for the person reading the file. */
  exportedAt: string;
  spots: SavedSpot[];
  plantings: Planting[];
}

/** Everything on this device, ready to be written out. */
export async function collectSpots(now: number = Date.now()): Promise<SpotsFile> {
  const [spots, plantings] = await Promise.all([listSpots(), listPlantings()]);
  return {
    format: SPOTS_FORMAT,
    version: SPOTS_VERSION,
    exportedAt: new Date(now).toISOString(),
    spots,
    plantings,
  };
}

/** `indigene-spots-2026-08-09.json` — dated, so a folder of them sorts itself,
 *  and named so the app can tell a reader what to look for. */
function spotsFileName(now: number): string {
  return `indigene-spots-${new Date(now).toISOString().slice(0, 10)}.json`;
}

/**
 * Hand the file to the browser's own download machinery.
 *
 * A blob URL and a synthetic click is the whole trick — no server, no upload,
 * nothing that leaves the device. Indented JSON, because someone will open it.
 * The URL is released a beat later rather than immediately: the anchor's
 * navigation has to have started before the blob goes away, or Safari saves
 * nothing at all.
 */
export function downloadSpotsFile(file: SpotsFile, now: number = Date.now()): void {
  const blob = new Blob([`${JSON.stringify(file, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = spotsFileName(now);
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// --- Reading one back ------------------------------------------------------

/** Why a file couldn't be read, in the four ways it actually happens. */
export type ReadFailure = "unreadable" | "notOurs" | "tooNew";

export type ReadResult =
  | { ok: true; file: SpotsFile; skipped: number }
  | { ok: false; why: ReadFailure };

export function parseSpotsFile(text: string): ReadResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, why: "unreadable" };
  }
  const r = asRecord(raw);
  if (!r || r.format !== SPOTS_FORMAT) return { ok: false, why: "notOurs" };
  if (typeof r.version === "number" && r.version > SPOTS_VERSION) {
    return { ok: false, why: "tooNew" };
  }

  let skipped = 0;
  const spots: SavedSpot[] = [];
  for (const row of asArray(r.spots)) {
    const spot = toSpot(row);
    if (spot) spots.push(spot);
    else skipped++;
  }
  const plantings: Planting[] = [];
  for (const row of asArray(r.plantings)) {
    const planting = toPlanting(row);
    if (planting) plantings.push(planting);
    else skipped++;
  }

  return {
    ok: true,
    skipped,
    file: {
      format: SPOTS_FORMAT,
      version: typeof r.version === "number" ? r.version : SPOTS_VERSION,
      exportedAt: typeof r.exportedAt === "string" ? r.exportedAt : "",
      spots,
      plantings,
    },
  };
}

/** What one import did, in the numbers the card reports back. */
export interface ImportTally {
  spotsAdded: number;
  /** Spots in the file this device already had — kept as they were. */
  spotsKnown: number;
  plantingsAdded: number;
  plantingsKnown: number;
  /** Rows left out: unreadable ones, plus any planting whose spot is neither
   *  in the file nor already here — a log entry with no garden to belong to. */
  skipped: number;
}

/**
 * Add everything in the file that this device is missing.
 *
 * Nothing is replaced and nothing is deleted, so importing the same file twice
 * is a no-op and importing an older copy can't undo newer work. The cost is
 * that an edit made elsewhere — a spot renamed on the laptop — doesn't travel;
 * that's a trade this first step accepts, because the alternative is a file
 * silently overwriting the copy you were actually using.
 */
export async function applySpotsFile(
  file: SpotsFile,
  skippedOnRead = 0
): Promise<ImportTally> {
  const [here, hereLog] = await Promise.all([listSpots(), listPlantings()]);
  const knownSpots = new Set(here.map((s) => s.id));
  const knownPlantings = new Set(hereLog.map((p) => p.id));
  const tally: ImportTally = {
    spotsAdded: 0,
    spotsKnown: 0,
    plantingsAdded: 0,
    plantingsKnown: 0,
    skipped: skippedOnRead,
  };

  for (const spot of file.spots) {
    if (knownSpots.has(spot.id)) {
      tally.spotsKnown++;
      continue;
    }
    await saveSpot(spot);
    knownSpots.add(spot.id);
    tally.spotsAdded++;
  }

  for (const planting of file.plantings) {
    if (knownPlantings.has(planting.id)) {
      tally.plantingsKnown++;
      continue;
    }
    // Its spot has to exist, here or in this same file — the store is keyed by
    // the planting's own id, so an orphan would be invisible and undeletable.
    if (!knownSpots.has(planting.spotId)) {
      tally.skipped++;
      continue;
    }
    await savePlanting(planting);
    knownPlantings.add(planting.id);
    tally.plantingsAdded++;
  }

  return tally;
}

// --- Rebuilding a row from whatever the file actually held -----------------

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function str(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function toSpot(row: unknown): SavedSpot | null {
  const r = asRecord(row);
  if (!r) return null;
  const id = str(r.id);
  const lat = num(r.lat);
  const lon = num(r.lon);
  // Without these three there is no spot: nothing to key it by, nowhere on
  // earth to put it.
  if (!id || lat == null || lon == null) return null;
  const label = str(r.label)?.trim();
  return {
    id,
    createdAt: num(r.createdAt) ?? Date.now(),
    // A spot with no name still has a place — the same coordinates the saved
    // list prints under every label.
    label: label || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    lat,
    lon,
    site: toSite(r.site),
    sun: toSun(r.sun),
    horizon: toHorizon(r.horizon),
    soilOverride: toSoilOverride(r.soilOverride),
    deciduousOverhead: typeof r.deciduousOverhead === "boolean" ? r.deciduousOverhead : undefined,
    regionOverride: str(r.regionOverride),
    weights: toWeights(r.weights),
  };
}

const WEIGHT_KEYS: (keyof Weights)[] = [
  "host",
  "pollinator",
  "bird",
  "stormwater",
  "erosion",
  "carbon",
  "establishment",
];

/** The spot's ranking goal, or the app's usual one. A missing weight is filled
 *  from the default rather than left undefined — a NaN in the ranking would
 *  reorder a whole plant list without saying anything. */
function toWeights(v: unknown): Weights {
  const r = asRecord(v);
  const out = { ...DEFAULT_WEIGHTS };
  if (!r) return out;
  for (const k of WEIGHT_KEYS) {
    const n = num(r[k]);
    if (n != null) out[k] = n;
  }
  return out;
}

function toSun(v: unknown): SunEstimate | null {
  const r = asRecord(v);
  if (!r) return null;
  const hours = num(r.hours);
  if (hours == null) return null; // the one field every reader of it uses
  const source = r.source;
  return {
    hours,
    low: num(r.low) ?? hours,
    high: num(r.high) ?? hours,
    label: str(r.label) ?? "",
    deciduousAdjusted: r.deciduousAdjusted === true,
    source: source === "scan" || source === "manual" || source === "override" ? source : "manual",
  };
}

/** 72 samples, one per 5° of compass bearing. Anything else isn't a mask we
 *  can draw or shade with, so it's dropped rather than half-read. */
function toHorizon(v: unknown): HorizonMask | null {
  const r = asRecord(v);
  if (!r) return null;
  const raw = asArray(r.angles);
  if (raw.length !== 72) return null;
  const angles: number[] = [];
  for (const a of raw) {
    const n = num(a);
    if (n == null) return null;
    angles.push(n);
  }
  const source = r.source;
  return {
    angles,
    source: source === "scan" || source === "manual" || source === "none" ? source : "manual",
  };
}

function toSoilOverride(v: unknown): SavedSpot["soilOverride"] {
  const r = asRecord(v);
  if (!r) return null;
  const texture = str(r.texture);
  const m = r.moisture;
  if (!texture || (m !== "dry" && m !== "mesic" && m !== "wet")) return null;
  return { texture, moisture: m };
}

function toSite(v: unknown): SiteData | null {
  const r = asRecord(v);
  if (!r) return null;
  const lat = num(r.lat);
  const lon = num(r.lon);
  if (lat == null || lon == null) return null;
  const soil = asRecord(r.soil) ?? {};
  const confidence = soil.confidence;
  const site: SiteData = {
    lat,
    lon,
    elevationFt: num(r.elevationFt),
    slopeDeg: num(r.slopeDeg),
    zone: str(r.zone),
    zoneMinTempF: num(r.zoneMinTempF),
    annualRainIn: num(r.annualRainIn),
    soil: {
      texture: str(soil.texture),
      drainage: str(soil.drainage),
      phEstimate: num(soil.phEstimate),
      source: str(soil.source) ?? "",
      confidence:
        confidence === "mapped" || confidence === "coarse" ? confidence : "unknown",
    },
    ecoregion: str(r.ecoregion),
    // Read back from a file, never from a live lookup — which is exactly what
    // this flag has always meant.
    fromCache: true,
  };
  const info = toEcoregionInfo(r.ecoregionInfo);
  if (info) site.ecoregionInfo = info;
  return site;
}

/** The structured ecoregion, which decides which plant list a spot gets — so
 *  every field that feeds that decision is checked, and a half-formed one is
 *  dropped rather than allowed to pick a region on wrong evidence. */
function toEcoregionInfo(v: unknown): EcoregionInfo | null {
  const r = asRecord(v);
  if (!r) return null;
  const provider = r.provider;
  const code = str(r.code);
  const name = str(r.name);
  if ((provider !== "epa-omernik" && provider !== "eea-biogeo") || !code || !name) return null;
  const detail = asRecord(r.detail);
  const detailCode = detail ? str(detail.code) : null;
  const detailName = detail ? str(detail.name) : null;
  return {
    provider,
    code,
    name,
    hierarchy: asArray(r.hierarchy).filter((h): h is string => typeof h === "string"),
    detail: detailCode && detailName ? { code: detailCode, name: detailName } : null,
  };
}

function toPlanting(row: unknown): Planting | null {
  const r = asRecord(row);
  if (!r) return null;
  const id = str(r.id);
  const spotId = str(r.spotId);
  const plantId = str(r.plantId);
  if (!id || !spotId || !plantId) return null;
  const count = num(r.count);
  const note = str(r.note)?.trim();
  return {
    id,
    spotId,
    plantId,
    count: count != null && count >= 1 ? Math.round(count) : 1,
    planted: toPlantedDate(r.planted),
    observations: asArray(r.observations).filter((o): o is string => typeof o === "string"),
    ...(note ? { note } : {}),
    createdAt: num(r.createdAt) ?? Date.now(),
  };
}

/** Year, and month and day only when they're there — the log's whole point is
 *  that a date can be as vague as the gardener actually is. */
function toPlantedDate(v: unknown): PlantedDate | null {
  const r = asRecord(v);
  if (!r) return null;
  const year = num(r.year);
  if (year == null) return null;
  const month = num(r.month);
  if (month == null || month < 1 || month > 12) return { year: Math.round(year) };
  const day = num(r.day);
  const date: PlantedDate = { year: Math.round(year), month: Math.round(month) };
  if (day != null && day >= 1 && day <= 31) date.day = Math.round(day);
  return date;
}
