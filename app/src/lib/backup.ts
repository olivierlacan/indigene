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
//  2. **Reading never destroys.** An import adds what's missing and never
//     removes or overwrites what's here — a spot both copies have only gains
//     the sightings linked elsewhere (`planImport`). The worst a wrong file
//     can do is nothing.
//  3. **Everything the person made travels.** Spots, plantings, invasives, the
//     per-spot "yes, look up sightings", what each linked sighting looked like
//     (so its photo shows offline), the linked iNaturalist account, and the
//     settings they chose. A backup that left any of it behind couldn't put a
//     garden back. Only things fetched again for free — nearby sightings,
//     town names — stay out.
//  4. **A spot's log travels with it.** Deleting a spot deletes its plantings
//     (`db.ts`), so the two belong to each other; a file of spots with no
//     plantings would be a garden with its history quietly dropped.
//
// Everything read out of a file is rebuilt field by field rather than trusted
// as-is. A file that has been hand-edited, half-saved, or written by something
// else entirely is an ordinary thing to meet, and the answer to it is a row
// left out and counted — never a broken screen.
import {
  getCachedObservations,
  kvGet,
  kvSet,
  listPlantings,
  listSpots,
  putCachedObservations,
  savePlanting,
  saveSpot,
} from "../db";
import { ECOREGION_PROVIDERS } from "../types";
import type {
  EcoregionInfo,
  HorizonMask,
  MoistureBand,
  PlantedDate,
  Planting,
  SavedSpot,
  SpotInvasive,
  SiteData,
  SunEstimate,
  Weights,
} from "../types";
import { DEFAULT_WEIGHTS, NO_FILTERS } from "./ranking";
import type { ActiveFilters } from "./ranking";
import type { ObservationPhoto, ObservationSummary } from "./inaturalist";
import { isValidLogin, linkedLogin, setLinkedLogin } from "./inat-account";
import { allowLookup, allowOwnLookup, lookupAllowed, ownLookupAllowed } from "./spot-sightings";
import { loadSticky } from "./sticky";
import type { Sticky, StickySpot } from "./sticky";
import { loadPrefs } from "../state";
import { STORAGE_KEY as UNITS_KEY, setUnitPref } from "./units";
import type { UnitPref } from "./units";
import { isLang, langChosen, setLang } from "./i18n";
import type { Lang } from "./i18n";
import { STORAGE_KEY as COUNTING_KEY, setAnalyticsEnabled } from "./analytics";

/** What the file says it is. Checked on read so an unrelated JSON file gets a
 *  plain "that isn't one of ours" rather than a puzzling empty import. */
export const SPOTS_FORMAT = "indigene.spots";

/** The shape's version. Bumped only if a future field can't be read by the
 *  rules below; a file from the future is refused rather than half-read. */
//  Version 2 added `lookups`, `sightings` and `preferences`. A version-1 file
//  still reads (those come back empty); a version-1 app refuses a version-2
//  file rather than restoring half of it.
export const SPOTS_VERSION = 2;

/** The yeses a spot's page asked for before looking anything up. */
export interface SpotLookups {
  spotId: string;
  /** Neighbourhood sightings of the spot's wildlife. */
  nearby: boolean;
  /** The linked account's own sightings at the spot. */
  own: boolean;
}

/** What a linked sighting looked like when last fetched — so a restored log
 *  shows its photos before (or without) asking iNaturalist again. */
export interface SavedSighting {
  /** The reference as kept on the planting or invasive. */
  ref: string;
  capturedAt: number;
  /** Null when iNaturalist had nothing to show for it. */
  observation: ObservationSummary | null;
}

/** The person's own choices. Each is absent when it was never made. */
export interface Preferences {
  inatLogin?: string;
  weights?: Weights;
  filters?: ActiveFilters;
  sticky?: Sticky;
  units?: UnitPref;
  lang?: Lang;
  /** Present only as `false`: they asked not to be counted. */
  counting?: false;
}

export interface SpotsFile {
  format: string;
  version: number;
  /** When it was written (ISO 8601) — for the person reading the file. */
  exportedAt: string;
  spots: SavedSpot[];
  plantings: Planting[];
  lookups: SpotLookups[];
  sightings: SavedSighting[];
  preferences: Preferences;
}

/** Every sighting reference a spot or planting holds, once each. */
function linkedRefs(spots: readonly SavedSpot[], plantings: readonly Planting[]): Set<string> {
  const refs = new Set<string>();
  for (const p of plantings) for (const r of p.observations) refs.add(r);
  for (const s of spots) for (const i of s.invasives ?? []) for (const r of i.observations) refs.add(r);
  return refs;
}

function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Everything on this device, ready to be written out. */
export async function collectSpots(now: number = Date.now()): Promise<SpotsFile> {
  const [spots, plantings] = await Promise.all([listSpots(), listPlantings()]);

  const lookups: SpotLookups[] = [];
  for (const s of spots) {
    const [nearby, own] = await Promise.all([lookupAllowed(s.id), ownLookupAllowed(s.id)]);
    if (nearby || own) lookups.push({ spotId: s.id, nearby, own });
  }

  const sightings: SavedSighting[] = [];
  for (const ref of linkedRefs(spots, plantings)) {
    const hit = await getCachedObservations(`obs:${ref}`).catch(() => undefined);
    if (hit) sightings.push({ ref, capturedAt: hit.capturedAt, observation: hit.observations[0] ?? null });
  }

  return {
    format: SPOTS_FORMAT,
    version: SPOTS_VERSION,
    exportedAt: new Date(now).toISOString(),
    spots,
    plantings,
    lookups,
    sightings,
    preferences: await collectPreferences(),
  };
}

async function collectPreferences(): Promise<Preferences> {
  const [weights, filters, sticky] = await Promise.all([
    kvGet<Weights>("weights").catch(() => undefined),
    kvGet<ActiveFilters>("filters").catch(() => undefined),
    kvGet<Sticky>("sticky").catch(() => undefined),
  ]);
  const prefs: Preferences = {};
  const login = linkedLogin();
  if (login) prefs.inatLogin = login;
  if (weights) prefs.weights = weights;
  if (filters) prefs.filters = filters;
  if (sticky && (sticky.spot || sticky.defaultRegion)) prefs.sticky = sticky;
  const units = toUnitPref(readLocal(UNITS_KEY));
  if (units) prefs.units = units;
  const lang = readLocal("indigene:lang");
  if (isLang(lang)) prefs.lang = lang;
  if (readLocal(COUNTING_KEY) === "off") prefs.counting = false;
  return prefs;
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

/** Where the date of the last copy written from this browser is kept. */
const LAST_COPY_KEY = "backup-saved-at";

/** When this browser last wrote a copy out, or undefined if it never has. */
export async function lastCopyAt(): Promise<number | undefined> {
  const v = await kvGet<number>(LAST_COPY_KEY).catch(() => undefined);
  return typeof v === "number" ? v : undefined;
}

export async function rememberCopy(now: number = Date.now()): Promise<void> {
  await kvSet(LAST_COPY_KEY, now).catch(() => {});
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

  const lookups: SpotLookups[] = [];
  for (const row of asArray(r.lookups)) {
    const l = toLookups(row);
    if (l) lookups.push(l);
    else skipped++;
  }
  const sightings: SavedSighting[] = [];
  for (const row of asArray(r.sightings)) {
    const sg = toSavedSighting(row);
    if (sg) sightings.push(sg);
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
      lookups,
      sightings,
      preferences: toPreferences(r.preferences),
    },
  };
}

/** What one import did, in the numbers the card reports back. */
export interface ImportTally {
  spotsAdded: number;
  /** Spots in the file this device already had, with nothing new to add. */
  spotsKnown: number;
  /** Spots already here that the file added to — an invasive found, or a
   *  sighting linked to one, on the other device. */
  spotsUpdated: number;
  plantingsAdded: number;
  plantingsKnown: number;
  /** Plantings already here that gained a linked sighting or a note. */
  plantingsUpdated: number;
  /** Per-spot "look up sightings" yeses brought back. */
  lookupsAdded: number;
  /** Linked sightings whose saved details came in. */
  sightingsAdded: number;
  /** Settings brought back — each one only where this browser had none. */
  settingsRestored: number;
  /** Rows left out: unreadable ones, plus any planting whose spot is neither
   *  in the file nor already here — a log entry with no garden to belong to. */
  skipped: number;
}

/** The rows an import would write, and what they add up to. */
export interface ImportPlan {
  spots: SavedSpot[];
  plantings: Planting[];
  tally: ImportTally;
}

/**
 * Work out what a file adds to what's here — without touching the database, so
 * the rules can be tested on plain arrays.
 *
 * **Nothing is removed and nothing is overwritten.** A row only this device
 * has stays. A row only the file has comes in. A row both have keeps this
 * device's version of every field, and gains only what is plainly additive:
 * linked sightings and invasives it doesn't have yet, and a note where this
 * copy has none. So importing the same file twice is a no-op, an older copy
 * can't undo newer work, and the sightings linked on a phone survive being
 * brought to a laptop that already had the spot. A rename made elsewhere still
 * doesn't travel — two labels can't be merged, and the one here is the one
 * the gardener was looking at.
 */
export function planImport(
  hereSpots: readonly SavedSpot[],
  herePlantings: readonly Planting[],
  file: SpotsFile,
  skippedOnRead = 0
): ImportPlan {
  const spotsById = new Map(hereSpots.map((s) => [s.id, s]));
  const plantingsById = new Map(herePlantings.map((p) => [p.id, p]));
  const plan: ImportPlan = {
    spots: [],
    plantings: [],
    tally: {
      spotsAdded: 0,
      spotsKnown: 0,
      spotsUpdated: 0,
      plantingsAdded: 0,
      plantingsKnown: 0,
      plantingsUpdated: 0,
      lookupsAdded: 0,
      sightingsAdded: 0,
      settingsRestored: 0,
      skipped: skippedOnRead,
    },
  };
  const { tally } = plan;

  for (const spot of file.spots) {
    const here = spotsById.get(spot.id);
    if (!here) {
      plan.spots.push(spot);
      spotsById.set(spot.id, spot);
      tally.spotsAdded++;
      continue;
    }
    const merged = mergeInvasives(here.invasives, spot.invasives);
    if (!merged) {
      tally.spotsKnown++;
      continue;
    }
    const next = { ...here, invasives: merged };
    plan.spots.push(next);
    spotsById.set(spot.id, next);
    tally.spotsUpdated++;
  }

  for (const planting of file.plantings) {
    const here = plantingsById.get(planting.id);
    if (here) {
      const observations = union(here.observations, planting.observations);
      const note = here.note ?? planting.note;
      if (!observations && note === here.note) {
        tally.plantingsKnown++;
        continue;
      }
      const next: Planting = { ...here, observations: observations ?? here.observations };
      if (note) next.note = note;
      plan.plantings.push(next);
      plantingsById.set(next.id, next);
      tally.plantingsUpdated++;
      continue;
    }
    // Its spot has to exist, here or in this same file — the store is keyed by
    // the planting's own id, so an orphan would be invisible and undeletable.
    if (!spotsById.has(planting.spotId)) {
      tally.skipped++;
      continue;
    }
    plan.plantings.push(planting);
    plantingsById.set(planting.id, planting);
    tally.plantingsAdded++;
  }

  return plan;
}

/** `here` plus whatever `there` has that it doesn't, in order — or null when
 *  `there` adds nothing, so the caller can tell "unchanged" without comparing. */
function union(here: readonly string[], there: readonly string[]): string[] | null {
  const seen = new Set(here);
  const added = there.filter((x) => !seen.has(x) && (seen.add(x), true));
  return added.length ? [...here, ...added] : null;
}

/** A spot's invasives with the file's folded in: new invasives appended, and
 *  new sightings added to the ones both copies have. Null when nothing changes. */
function mergeInvasives(
  here: readonly SpotInvasive[] | undefined,
  there: readonly SpotInvasive[] | undefined
): SpotInvasive[] | null {
  if (!there?.length) return null;
  const out = (here ?? []).map((i) => ({ ...i }));
  const byId = new Map(out.map((i) => [i.invasiveId, i]));
  let changed = false;
  for (const inv of there) {
    const mine = byId.get(inv.invasiveId);
    if (!mine) {
      const copy = { ...inv, observations: [...inv.observations] };
      out.push(copy);
      byId.set(inv.invasiveId, copy);
      changed = true;
      continue;
    }
    const observations = union(mine.observations, inv.observations);
    if (observations) {
      mine.observations = observations;
      changed = true;
    }
  }
  return changed ? out : null;
}

/** What an import did, and the settings it left for last. */
export interface Restore {
  tally: ImportTally;
  /**
   * Apply the restored units, language and counting choice. Each of these
   * redraws the page, so the caller runs it once it has kept the figures
   * somewhere a redraw won't wipe. True when anything changed.
   */
  finish: () => boolean;
}

/** Add what the file brings (see `planImport`) to this device's database. */
export async function applySpotsFile(file: SpotsFile, skippedOnRead = 0): Promise<Restore> {
  const [here, hereLog] = await Promise.all([listSpots(), listPlantings()]);
  const plan = planImport(here, hereLog, file, skippedOnRead);
  // Spots first: a planting written before its spot would, for a moment, be
  // exactly the orphan `planImport` refuses to create.
  for (const spot of plan.spots) await saveSpot(spot);
  for (const planting of plan.plantings) await savePlanting(planting);
  const { tally } = plan;

  const spotIds = new Set([...here, ...file.spots].map((s) => s.id));
  for (const l of file.lookups) {
    if (!spotIds.has(l.spotId)) continue;
    if (l.nearby && !(await lookupAllowed(l.spotId))) {
      await allowLookup(l.spotId);
      tally.lookupsAdded++;
    }
    if (l.own && !(await ownLookupAllowed(l.spotId))) {
      await allowOwnLookup(l.spotId);
      tally.lookupsAdded++;
    }
  }

  // Only sightings something in the file points at; a newer copy here stays.
  const refs = linkedRefs(file.spots, file.plantings);
  for (const sg of file.sightings) {
    if (!refs.has(sg.ref)) continue;
    const key = `obs:${sg.ref}`;
    const mine = await getCachedObservations(key).catch(() => undefined);
    if (mine && mine.capturedAt >= sg.capturedAt) continue;
    await putCachedObservations({
      key,
      capturedAt: sg.capturedAt,
      observations: sg.observation ? [sg.observation] : [],
    });
    tally.sightingsAdded++;
  }

  const later = displayPreferences(file.preferences);
  tally.settingsRestored = (await restorePreferences(file.preferences)) + later.length;
  return {
    tally,
    finish: () => {
      later.forEach((apply) => apply());
      return later.length > 0;
    },
  };
}

/** The restored settings that redraw the page, each only where this browser
 *  hasn't chosen yet — returned unapplied (see `Restore.finish`). */
function displayPreferences(p: Preferences): (() => void)[] {
  const out: (() => void)[] = [];
  const units = p.units;
  if (units && readLocal(UNITS_KEY) == null) out.push(() => setUnitPref(units));
  if (p.counting === false && readLocal(COUNTING_KEY) == null) {
    out.push(() => setAnalyticsEnabled(false));
  }
  const lang = p.lang;
  if (lang && !langChosen()) out.push(() => setLang(lang));
  return out;
}

/**
 * Bring back each stored setting this browser hasn't been given yet. One
 * already chosen here stays: it's the one the person was just using.
 */
async function restorePreferences(p: Preferences): Promise<number> {
  let n = 0;
  if (p.inatLogin && !linkedLogin()) {
    setLinkedLogin(p.inatLogin);
    n++;
  }
  let prefs = false;
  if (p.weights && (await kvGet("weights").catch(() => undefined)) === undefined) {
    await kvSet("weights", p.weights);
    prefs = true;
    n++;
  }
  if (p.filters && (await kvGet("filters").catch(() => undefined)) === undefined) {
    await kvSet("filters", p.filters);
    prefs = true;
    n++;
  }
  if (prefs) await loadPrefs();
  if (p.sticky) {
    const mine = (await kvGet<Sticky>("sticky").catch(() => undefined)) ?? {};
    const next: Sticky = { ...mine };
    if (p.sticky.spot && !mine.spot) next.spot = p.sticky.spot;
    if (p.sticky.defaultRegion && !mine.defaultRegion) next.defaultRegion = p.sticky.defaultRegion;
    const added = Number(next.spot !== mine.spot) + Number(next.defaultRegion !== mine.defaultRegion);
    if (added) {
      await kvSet("sticky", next);
      await loadSticky();
      n += added;
    }
  }
  return n;
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
    invasives: toSpotInvasives(r.invasives),
  };
}

/** A spot's invasives list, rebuilt row by row like a planting. A row without
 *  an invasive id names nothing and is dropped. */
function toSpotInvasives(v: unknown): SpotInvasive[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: SpotInvasive[] = [];
  for (const row of v) {
    const r = asRecord(row);
    const invasiveId = r && str(r.invasiveId);
    if (!r || !invasiveId) continue;
    out.push({
      invasiveId,
      observations: Array.isArray(r.observations) ? r.observations.filter((o): o is string => typeof o === "string") : [],
      addedAt: num(r.addedAt) ?? Date.now(),
    });
  }
  return out;
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
  const provider = ECOREGION_PROVIDERS.find((p) => p === r.provider);
  const code = str(r.code);
  const name = str(r.name);
  if (!provider || !code || !name) return null;
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

// --- The rest of what a backup carries -------------------------------------

function toLookups(row: unknown): SpotLookups | null {
  const r = asRecord(row);
  const spotId = r && str(r.spotId);
  if (!r || !spotId) return null;
  return { spotId, nearby: r.nearby === true, own: r.own === true };
}

function toSavedSighting(row: unknown): SavedSighting | null {
  const r = asRecord(row);
  const ref = r && str(r.ref);
  const capturedAt = r && num(r.capturedAt);
  if (!r || !ref || capturedAt == null) return null;
  if (r.observation === null) return { ref, capturedAt, observation: null };
  const observation = toObservation(r.observation);
  return observation ? { ref, capturedAt, observation } : null;
}

function toObservation(v: unknown): ObservationSummary | null {
  const r = asRecord(v);
  if (!r) return null;
  const id = num(r.id);
  const taxonId = num(r.taxonId);
  const observer = str(r.observer);
  if (id == null || taxonId == null || observer == null) return null;
  const out: ObservationSummary = {
    id,
    taxonId,
    taxonName: str(r.taxonName),
    observer,
    place: str(r.place),
    lat: num(r.lat),
    lon: num(r.lon),
    distanceKm: num(r.distanceKm),
    observedOn: str(r.observedOn),
    photos: asArray(r.photos).map(toPhoto).filter((p): p is ObservationPhoto => p != null),
  };
  if (r.taxonPhoto === true) out.taxonPhoto = true;
  return out;
}

/** Only https addresses: a picture from a hand-edited file is still loaded by
 *  the page, and the page's own rules decide which hosts may answer. */
function toPhoto(v: unknown): ObservationPhoto | null {
  const r = asRecord(v);
  if (!r) return null;
  const id = num(r.id);
  const urls = [r.thumbUrl, r.mediumUrl, r.largeUrl].map(str);
  if (id == null || urls.some((u) => !u || !u.startsWith("https://"))) return null;
  const [thumbUrl, mediumUrl, largeUrl] = urls as string[];
  return {
    id,
    thumbUrl,
    mediumUrl,
    largeUrl,
    license: str(r.license) ?? "",
    attribution: str(r.attribution) ?? "",
  };
}

function toUnitPref(v: unknown): UnitPref | null {
  return v === "imperial" || v === "metric" || v === "auto" ? v : null;
}

function toMoisture(v: unknown): MoistureBand | null {
  return v === "dry" || v === "mesic" || v === "wet" ? v : null;
}

function toFilters(v: unknown): ActiveFilters | undefined {
  const r = asRecord(v);
  if (!r) return undefined;
  const out = { ...NO_FILTERS };
  for (const k of Object.keys(NO_FILTERS) as (keyof ActiveFilters)[]) {
    const val = r[k];
    if (k === "maxHeightFt" || k === "maxSpreadFt") out[k] = num(val);
    else if (typeof val === "boolean") out[k] = val;
  }
  return out;
}

function toStickySpot(v: unknown): StickySpot | undefined {
  const r = asRecord(v);
  if (!r) return undefined;
  const lat = num(r.lat);
  const lon = num(r.lon);
  const regionId = str(r.regionId);
  if ((lat == null || lon == null) && !regionId) return undefined;
  return {
    lat,
    lon,
    regionId,
    sun: toSun(r.sun),
    horizon: toHorizon(r.horizon),
    deciduousOverhead: r.deciduousOverhead === true,
    moisture: toMoisture(r.moisture),
    savedAt: num(r.savedAt) ?? Date.now(),
  };
}

function toPreferences(v: unknown): Preferences {
  const r = asRecord(v);
  const out: Preferences = {};
  if (!r) return out;
  const login = str(r.inatLogin);
  if (login && isValidLogin(login)) out.inatLogin = login;
  if (asRecord(r.weights)) out.weights = toWeights(r.weights);
  const filters = toFilters(r.filters);
  if (filters) out.filters = filters;
  const sticky = asRecord(r.sticky);
  if (sticky) {
    const spot = toStickySpot(sticky.spot);
    const defaultRegion = str(sticky.defaultRegion);
    if (spot || defaultRegion) {
      out.sticky = {};
      if (spot) out.sticky.spot = spot;
      if (defaultRegion) out.sticky.defaultRegion = defaultRegion;
    }
  }
  const units = toUnitPref(r.units);
  if (units) out.units = units;
  const lang = str(r.lang);
  if (isLang(lang)) out.lang = lang;
  if (r.counting === false) out.counting = false;
  return out;
}
