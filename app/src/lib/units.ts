// The units layer.
//
// **Units are a setting of their own, not a consequence of your language.** A
// French speaker gardening in Ohio buys plants labelled in feet; an American in
// Bordeaux is handed metres by every nursery in town. Tying the two together
// would be wrong for both of them, so the language picker and the units picker
// are two independent switches (see `i18n.ts`) — the only thing units borrows
// from language is *number formatting*, because "1 070 mm" and "1,070 mm" are
// the same measurement written for two different readers.
//
// **The data stays in one canonical unit and converts at the edge.** Every
// `heightFt`, `spreadFt`, `zoneMinTempF` and `annualRainIn` in the catalog and
// in the site lookups stays exactly as sourced — the US datasets are imperial,
// so imperial is the storage unit and there is no lossy round-trip through the
// files. Conversion happens here, once, at the moment a number becomes text.
// That means a units switch can never corrupt stored data, and re-sourcing a
// number later doesn't have to be a units migration.
//
// **Rounding is honest.** These figures are already approximations — a mature
// height is "about this tall", not a measurement — so converting 40 ft to
// "12.192 m" would invent five digits of precision nobody has. Metric lengths
// round the way a person would say them out loud.
import { fmtNumber, getLang, t } from "./i18n";

export type UnitSystem = "imperial" | "metric";
/** What the user actually chose. "auto" means "follow my language", and it's
 *  the default — but an explicit pick is remembered and always wins. */
export type UnitPref = UnitSystem | "auto";

const STORAGE_KEY = "indigene:units";

const FT_PER_M = 3.280839895;
const MM_PER_IN = 25.4;

/**
 * The three countries that still use feet and Fahrenheit day-to-day. Everywhere
 * else "auto" means metric — including the UK, which is genuinely mixed but
 * measures a garden in metres.
 *
 * Note this reads the *region* of the browser's locale, not our UI language:
 * someone running the app in French on a `fr-CA` device gets metric, and an
 * `en-US` device gets imperial, which is what each of them expects before they
 * touch a setting.
 */
const IMPERIAL_REGIONS = new Set(["US", "LR", "MM"]);

function isPref(v: string | null | undefined): v is UnitPref {
  return v === "auto" || v === "metric" || v === "imperial";
}

function readPref(): UnitPref {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isPref(saved)) return saved;
  } catch {
    // Private-mode Safari throws. Fall through to auto.
  }
  return "auto";
}

let pref: UnitPref = readPref();
const listeners = new Set<() => void>();

/** What "auto" resolves to right now, from the device's region. */
function autoSystem(): UnitSystem {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    // Intl.Locale gives us the region even when the tag doesn't spell it out
    // ("en" → "US"), which is exactly the inference we want here.
    try {
      const region = new Intl.Locale(tag).maximize().region;
      if (region) return IMPERIAL_REGIONS.has(region) ? "imperial" : "metric";
    } catch {
      // Malformed tag — try the next one.
    }
  }
  return "imperial";
}

export function getUnitPref(): UnitPref {
  return pref;
}

/** The system in force — what every formatter below actually renders in. */
export function getUnits(): UnitSystem {
  return pref === "auto" ? autoSystem() : pref;
}

export function setUnitPref(next: UnitPref): void {
  if (next === pref) return;
  pref = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Best-effort, same as the language pick.
  }
  listeners.forEach((fn) => fn());
}

export function onUnitsChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------------------------------------------------------------------------
// Length. Input is always feet — the unit the catalog is stored in.
// ---------------------------------------------------------------------------

/** Metres, rounded the way someone would say it: a hair over a metre is
 *  "1.1 m", a big tree is "24 m", never "24.384 m". */
function roundMetres(m: number): { value: number; digits: number } {
  if (m >= 20) return { value: Math.round(m), digits: 0 };
  if (m >= 10) return { value: Math.round(m * 2) / 2, digits: 1 };
  return { value: Math.round(m * 10) / 10, digits: 1 };
}

/** Centimetres for the knee-high things, to the nearest 5 — "45 cm", not
 *  "46 cm", because the source number wasn't that precise either. */
function roundCm(cm: number): number {
  return cm < 10 ? Math.round(cm) : Math.round(cm / 5) * 5;
}

/**
 * A length in words: "18 inches" / "12 ft" in imperial, "45 cm" / "3.7 m" in
 * metric. This is the everyday form — the one that appears in a sentence.
 */
export function length(ft: number): string {
  if (getUnits() === "metric") {
    const m = ft / FT_PER_M;
    if (m < 1) return `${fmtNumber(roundCm(m * 100))} ${t("units.cm")}`;
    const { value, digits } = roundMetres(m);
    return `${fmtNumber(value, digits)} ${t("units.m")}`;
  }
  if (ft < 1) return `${fmtNumber(Math.round(ft * 12))} ${t("units.inches")}`;
  return `${fmtNumber(ft, ft % 1 === 0 ? 0 : 1)} ${t("units.ft")}`;
}

/**
 * The tight form for a chart axis or a chip, where every pixel counts: the
 * prime/double-prime marks in imperial (12′, 8″), the ordinary symbols in
 * metric. Never used inside a sentence — `length()` is for that.
 */
export function lengthTick(ft: number): string {
  if (getUnits() === "metric") {
    // Metric has no prime-mark shorthand — "3.7 m" *is* the short form, and
    // the space before the symbol is not optional in SI.
    const m = ft / FT_PER_M;
    if (m < 1) return `${fmtNumber(roundCm(m * 100))} ${t("units.cm")}`;
    const { value, digits } = roundMetres(m);
    return `${fmtNumber(value, digits)} ${t("units.m")}`;
  }
  return ft < 1 ? `${Math.round(ft * 12)}″` : `${ft % 1 === 0 ? ft : ft.toFixed(1)}′`;
}

/** Elevation above sea level: whole feet or whole metres, never a decimal. */
export function elevation(ft: number): string {
  if (getUnits() === "metric") {
    return `${fmtNumber(Math.round(ft / FT_PER_M))} ${t("units.m")}`;
  }
  return `${fmtNumber(Math.round(ft))} ${t("units.ft")}`;
}

// ---------------------------------------------------------------------------
// Temperature. Input is always °F — the unit USDA hardiness is defined in.
// ---------------------------------------------------------------------------

/** French (and the SI) put a space before the degree symbol; English usage
 *  closes it up. It's a typography rule, so it follows the *language*. */
function degreeGap(): string {
  return getLang() === "fr" ? " " : "";
}

/**
 * A temperature. Celsius rounds to whole degrees — the input is a zone
 * boundary ("about 0°F"), so a converted "−17.8 °C" would be false precision
 * dressed up as a measurement.
 */
export function temperature(f: number): string {
  if (getUnits() === "metric") {
    const c = Math.round(((f - 32) * 5) / 9);
    return `${fmtNumber(c)}${degreeGap()}°C`;
  }
  return `${fmtNumber(Math.round(f))}${degreeGap()}°F`;
}

/** A temperature *difference* (a zone is 10°F wide), which converts by ratio
 *  rather than by the freezing-point offset. */
export function temperatureSpan(deltaF: number): string {
  if (getUnits() === "metric") {
    const c = Math.round((deltaF * 5) / 9);
    return `${fmtNumber(c)}${degreeGap()}°C`;
  }
  return `${fmtNumber(deltaF)}${degreeGap()}°F`;
}

// ---------------------------------------------------------------------------
// Distance. Input is always kilometres — what iNaturalist's geography is in,
// and what our own great-circle maths produces.
// ---------------------------------------------------------------------------

const KM_PER_MILE = 1.609344;

/** How far away a sighting is, rounded the way someone would say it out loud:
 *  "3 km", "2 miles". Never a decimal — the point is "that's the next street"
 *  versus "that's the next town", and the observation's own coordinates are
 *  fuzzy anyway. */
export function distance(km: number): string {
  if (getUnits() === "metric") return `${fmtNumber(Math.round(km))} ${t("units.km")}`;
  return `${fmtNumber(Math.round(km / KM_PER_MILE))} ${t("units.miles")}`;
}

/** The distance below which we say "under one X away" rather than round to a
 *  meaningless zero. One kilometre, or one mile — the unit's own floor, so the
 *  sentence reads honestly in either system. */
export function distanceFloorKm(): number {
  return getUnits() === "metric" ? 1 : KM_PER_MILE;
}

/** That floor as words: "1 km" / "1 mile". */
export function distanceFloor(): string {
  return getUnits() === "metric"
    ? `${fmtNumber(1)} ${t("units.km")}`
    : `${fmtNumber(1)} ${t("units.mile")}`;
}

// ---------------------------------------------------------------------------
// Rainfall. Input is always inches — what Open-Meteo is asked for.
// ---------------------------------------------------------------------------

export function rainfall(inches: number): string {
  if (getUnits() === "metric") {
    const mm = Math.round((inches * MM_PER_IN) / 10) * 10; // nearest cm of rain
    return `${fmtNumber(mm)} ${t("units.mm")}`;
  }
  return `${fmtNumber(Math.round(inches))} ${t("units.inches")}`;
}

// ---------------------------------------------------------------------------
// The size ladders used by the "how tall can it get" filter.
// ---------------------------------------------------------------------------

/**
 * The heights offered in the "no taller than…" filter.
 *
 * The stored value stays in feet (canonical, so a saved preference survives a
 * units switch), but each system gets its own ladder of *round numbers in its
 * own units* — 2 m, not "6.6 ft converted to 2.0 m", and 6 ft, not "2 m shown
 * as 6.6 ft". A filter labelled with an awkward number reads as a bug.
 */
export function maxHeightChoices(): { ft: number; label: string }[] {
  const metres = [1, 2, 3, 5, 8, 12, 20];
  const feet = [3, 6, 10, 15, 25, 40, 60];
  return getUnits() === "metric"
    ? metres.map((m) => ({ ft: m * FT_PER_M, label: `${fmtNumber(m)} ${t("units.m")}` }))
    : feet.map((ft) => ({ ft, label: `${fmtNumber(ft)} ${t("units.ft")}` }));
}

/** Same idea for the "no wider than…" filter. */
export function maxSpreadChoices(): { ft: number; label: string }[] {
  return maxHeightChoices();
}

/** The reference human in the size drawing: 5′6″, or the same person in metres. */
export const HUMAN_FT = 5.5;

export function humanHeightLabel(): string {
  // 5′06″ is 1.676 m — "1.68 m" is the same person read honestly, and the
  // decimal separator follows the reader's language.
  return getUnits() === "metric" ? `${fmtNumber(1.68, 2)} ${t("units.m")}` : "5′6″";
}
