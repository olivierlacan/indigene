// Plain-language layer. The rule from the brief: never surface a term without
// explaining it inline, in words a 70-year-old who has never heard "keystone
// species" can act on. Everything jargon-y funnels through here.
import type { MoistureBand, SizeSnapshot } from "../types";

/** The full audit of every dataset behind the numbers — linked wherever we
 * cite a figure (host counts especially) so claims stay checkable. */
export const DATA_SOURCES_URL =
  "https://github.com/olivierlacan/indigene/blob/main/DATA_SOURCES.md";

export function sunLabel(hours: number): string {
  if (hours >= 6) return "full sun";
  if (hours >= 4) return "part sun";
  if (hours >= 2) return "part shade";
  return "full shade";
}

export function sunPlain(hours: number): string {
  const label = sunLabel(hours);
  const rounded = Math.round(hours);
  const hrs = `${rounded} hour${rounded === 1 ? "" : "s"}`;
  const gloss: Record<string, string> = {
    "full sun": "direct sun most of the day",
    "part sun": "sun for a good chunk of the day, shade the rest",
    "part shade": "a few hours of direct sun, shade the rest",
    "full shade": "little or no direct sun",
  };
  return `about ${hrs} of direct sun a day — that's ${label} (${gloss[label]})`;
}

export function moisturePlain(band: MoistureBand): string {
  switch (band) {
    case "dry":
      return "dry — drains fast and stays on the dry side, like a sandy slope or a spot under a roof overhang";
    case "mesic":
      return "evenly moist — damp after rain but never soggy; the middle-of-the-road condition most yards have";
    case "wet":
      return "wet — stays damp, puddles after rain, or sits low where water collects";
  }
}

export function zonePlain(zone: string | null, minTempF: number | null): string {
  if (!zone) return "We couldn't pin down your winter-cold zone.";
  const t =
    minTempF != null
      ? `your coldest winter nights get down to about ${minTempF}°F`
      : "this is your winter-cold zone";
  return `Zone ${zone} — ${t}. A plant is "hardy" here if it survives that cold.`;
}

export function phPlain(ph: number | null): string {
  if (ph == null) return "Soil acidity unknown.";
  if (ph < 5.6) return `pH ${ph.toFixed(1)} — acidic soil (think blueberries, pine woods)`;
  if (ph <= 7.3) return `pH ${ph.toFixed(1)} — close to neutral, which most plants are happy with`;
  return `pH ${ph.toFixed(1)} — alkaline/limey soil`;
}

export function texturePlain(texture: string | null): string {
  if (!texture) return "Soil texture unknown.";
  const t = texture.toLowerCase();
  if (t.includes("sand"))
    return `${texture} — gritty, drains fast, dries out quickly`;
  if (t.includes("clay"))
    return `${texture} — heavy and sticky when wet, holds water, can stay soggy`;
  if (t.includes("loam"))
    return `${texture} — the "just right" mix of sand, silt, and clay that most plants love`;
  if (t.includes("silt"))
    return `${texture} — smooth and floury when dry, holds moisture well`;
  return texture;
}

export function slopePlain(deg: number | null): string {
  if (deg == null) return "";
  if (deg < 3) return "basically flat";
  if (deg < 8) return "a gentle slope";
  if (deg < 15) return "a noticeable slope — erosion can be a concern here";
  return "a steep slope — holding the soil in place matters a lot here";
}

export const scoreLabels: Record<string, { name: string; plain: string }> = {
  host: {
    name: "Feeds baby butterflies & moths",
    plain:
      "How many kinds of caterpillars can eat this plant. Caterpillars are the food that baby birds are raised on, so this is the single biggest measure of how much life a plant supports.",
  },
  pollinator: {
    name: "Feeds bees & butterflies",
    plain: "Nectar and pollen for adult bees and butterflies, and how long it blooms.",
  },
  bird: {
    name: "Feeds & shelters birds",
    plain: "Berries, seeds, and places to nest — plus the caterpillars it raises.",
  },
  stormwater: {
    name: "Soaks up rain",
    plain: "Deep roots that let rainwater sink in instead of running off.",
  },
  erosion: {
    name: "Holds soil in place",
    plain: "Roots that grip a slope and stop it washing away.",
  },
  carbon: {
    name: "Stores carbon",
    plain:
      "Carbon pulled out of the air into wood and roots. Honestly small for one yard — included, but don't expect miracles.",
  },
  establishment: {
    name: "Survives on its own",
    plain: "How likely it is to make it with no watering or fuss after you plant it.",
  },
};

/**
 * Growth expectations derived from the plant's own size records (typical
 * field growth at years 1/3/5/10, from the sources cited in its `basis`) —
 * so "fast" and "slow" are claims the data can back, not nursery-tag optimism.
 */
export function growthPlain(p: {
  size: SizeSnapshot[];
  matureHeightFt: number;
}): string {
  const last = p.size[p.size.length - 1];
  if (!last || !p.matureHeightFt) return "";
  const y3 = p.size.find((s) => s.year === 3);
  const at3 = y3 ? y3.heightFt / p.matureHeightFt : 0;
  const atLast = last.heightFt / p.matureHeightFt;
  if (at3 >= 0.85) {
    return "Quick to settle in: expect close to this full size within about three years.";
  }
  if (atLast >= 0.85) {
    return `A steady grower: close to full size by year ${last.year}.`;
  }
  if (atLast >= 0.45) {
    return `In no hurry: about ${fracWord(atLast)} of its final height by year ${last.year}, still filling in for years after.`;
  }
  return `Slow and long-lived: roughly ${ftWord(last.heightFt)} by year ${last.year} on its way to ${ftWord(p.matureHeightFt)} — planted as much for the next generation as for you.`;
}

function fracWord(f: number): string {
  if (f >= 0.7) return "three-quarters";
  if (f >= 0.55) return "two-thirds";
  return "half";
}

function ftWord(v: number): string {
  if (v < 1) return `${Math.round(v * 12)} inches`;
  return `${v % 1 === 0 ? v : v.toFixed(1)} ft`;
}

export function confidencePlain(c: "high" | "medium" | "low"): string {
  switch (c) {
    case "high":
      return "We're fairly sure about this one — the numbers come from well-established data.";
    case "medium":
      return "Reasonably confident, but some numbers are estimated from close relatives.";
    case "low":
      return "Rougher estimate — treat as a starting point, not gospel.";
  }
}
