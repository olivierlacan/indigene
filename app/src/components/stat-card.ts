// The "player card" stat block: a plant's key characteristics as a grid of
// icon + label + value tiles, for people who scan rather than read. Every
// number here also exists in prose elsewhere on the card — this is a second
// way to read the same facts, never the only one. Emoji are the icon set (the
// app's existing idiom, and zero dependencies); each is aria-hidden so screen
// readers get the text label alone.
import type { Plant } from "../types";
import { el } from "../ui";
import { sunLabel } from "../lib/plain";

const monthShort = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Stat {
  icon: string;
  label: string;
  value: string;
  sub?: string;
}

export function statGrid(p: Plant): HTMLElement {
  const stats = statsFor(p);
  return el("dl", { class: "stat-grid", "aria-label": `${p.common} at a glance` },
    stats.map((s) =>
      el("div", { class: "stat-tile" }, [
        el("dt", {}, [el("span", { "aria-hidden": "true" }, `${s.icon} `), s.label]),
        el("dd", {}, [s.value, s.sub ? el("span", { class: "stat-sub" }, s.sub) : null]),
      ])
    )
  );
}

function statsFor(p: Plant): Stat[] {
  const grown = p.size[p.size.length - 1]; // last snapshot, typically year 10
  return [
    {
      icon: "☀️",
      label: "Sun",
      value: `${p.sun.minHours}–${p.sun.maxHours} h/day`,
      sub: sunRange(p.sun.minHours, p.sun.maxHours),
    },
    {
      icon: "💧",
      label: "Moisture",
      value: p.moisture.map(moistureWord).join(" · "),
      sub: "soil it accepts",
    },
    {
      icon: "❄️",
      label: "Hardy zones",
      value: p.zones.min === p.zones.max ? `${p.zones.min}` : `${p.zones.min}–${p.zones.max}`,
      sub: "USDA winter cold",
    },
    {
      icon: "🧪",
      label: "Soil pH",
      value: `${p.ph.min}–${p.ph.max}`,
      sub: phWord(p.ph.min, p.ph.max),
    },
    {
      icon: "📏",
      label: "Full size",
      value: `${ft(p.matureHeightFt)} × ${ft(p.matureSpreadFt)}`,
      sub: "height × spread, eventually",
    },
    {
      icon: "🌱",
      label: `Year ${grown.year}`,
      value: `${ft(grown.heightFt)} tall`,
      sub: paceWord(grown.heightFt, p.matureHeightFt),
    },
    {
      icon: "🐛",
      label: "Caterpillar hosts",
      value: `${p.hostLepCount} species`,
      sub: p.keystone ? "keystone plant" : "food-web value",
    },
    p.bloom
      ? {
          icon: "🌸",
          label: "Bloom",
          value:
            p.bloom.startMonth === p.bloom.endMonth
              ? monthShort[p.bloom.startMonth]
              : `${monthShort[p.bloom.startMonth]}–${monthShort[p.bloom.endMonth]}`,
          sub: p.bloom.color,
        }
      : { icon: "🌿", label: "Bloom", value: "Foliage", sub: "grown for leaves, not flowers" },
  ];
}

function sunRange(min: number, max: number): string {
  const lo = sunLabel(min);
  const hi = sunLabel(max);
  return lo === hi ? lo : `${lo} to ${hi}`;
}

function moistureWord(b: string): string {
  return b === "dry" ? "Dry" : b === "wet" ? "Wet" : "Moist";
}

function phWord(min: number, max: number): string {
  if (max < 6.5) return "acidic";
  if (min > 7) return "alkaline";
  if (min < 6 && max > 7) return "acidic to alkaline";
  return "around neutral";
}

// A plain word for how much of its eventual self it reaches in the snapshot
// window — honest pacing without pretending to a growth-rate dataset.
function paceWord(at10: number, mature: number): string {
  const share = mature > 0 ? at10 / mature : 1;
  if (share >= 0.8) return "quick to full size";
  if (share >= 0.4) return "steady grower";
  return "slow and long-lived";
}

function ft(v: number): string {
  if (v < 1) return `${Math.round(v * 12)}″`;
  return `${v % 1 === 0 ? v : v.toFixed(1)}′`;
}
