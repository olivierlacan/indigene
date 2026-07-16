// The "player card" stat block: a plant's key characteristics as a grid of
// icon + label + value tiles, for people who scan rather than read. Every
// number here also exists in prose elsewhere on the card — this is a second
// way to read the same facts, never the only one. Emoji are the icon set (the
// app's existing idiom, and zero dependencies); each is aria-hidden so screen
// readers get the text label alone.
//
// Every tile is a button: tapping it opens a small dialog that explains what
// the metric means and why it matters for native plants — just-in-time
// education, one metric at a time.
import type { Plant } from "../types";
import { el } from "../ui";
import { sunLabel, growthPlain } from "../lib/plain";

const monthShort = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Stat {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  /** What the metric means and why it matters for natives (the tap-to-open dialog). */
  explain: string;
}

export function statGrid(p: Plant): HTMLElement {
  const stats = statsFor(p);
  const dialog = el("dialog", { class: "stat-dialog" }) as HTMLDialogElement;
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close(); // tap the backdrop to dismiss
  });

  const open = (s: Stat): void => {
    dialog.replaceChildren(
      el("h3", { style: "margin:0 0 0.2rem" }, [el("span", { "aria-hidden": "true" }, `${s.icon} `), s.label]),
      el("p", { class: "stat-dialog-value" }, `${s.value}${s.sub ? ` — ${s.sub}` : ""}`),
      el("p", { style: "margin:0.5rem 0 0.9rem" }, s.explain),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => dialog.close() }, "Got it")
    );
    dialog.showModal();
  };

  return el("div", { class: "stat-grid", "aria-label": `${p.common} at a glance` }, [
    ...stats.map((s) =>
      el("button", {
        class: "stat-tile",
        type: "button",
        "aria-haspopup": "dialog",
        "aria-label": `${s.label}: ${s.value}${s.sub ? `, ${s.sub}` : ""}. Tap to learn what this means.`,
        onClick: () => open(s),
      }, [
        el("span", { class: "stat-k", "aria-hidden": "true" }, [`${s.icon} ${s.label}`]),
        el("span", { class: "stat-v", "aria-hidden": "true" }, [
          s.value,
          s.sub ? el("span", { class: "stat-sub" }, s.sub) : null,
        ]),
      ])
    ),
    dialog, // closed <dialog> renders as display:none, so it's an inert grid child
  ]);
}

function statsFor(p: Plant): Stat[] {
  const grown = p.size[p.size.length - 1]; // last snapshot, typically year 10
  return [
    {
      icon: "☀️",
      label: "Sun",
      value: `${p.sun.minHours}–${p.sun.maxHours} h/day`,
      sub: sunRange(p.sun.minHours, p.sun.maxHours),
      explain: `The band of direct-sun hours per day this plant accepts. Sun is the single biggest factor in whether a plant thrives — and there's a native for every light level, so the goal is matching the hours your spot really gets, not fighting them.`,
    },
    {
      icon: "💧",
      label: "Moisture",
      value: p.moisture.map(moistureWord).join(" · "),
      sub: "soil it accepts",
      explain: `How wet the soil stays after rain — not how often you water. Natives specialize: a dry-slope plant rots in a wet hollow, and a swamp-edge plant crisps on sand. Match the moisture your spot already has and you replace a watering schedule with nothing.`,
    },
    {
      icon: "❄️",
      label: "Hardy zones",
      value: p.zones.min === p.zones.max ? `${p.zones.min}` : `${p.zones.min}–${p.zones.max}`,
      sub: "USDA winter cold",
      explain: `USDA zones measure winter's coldest night in 10°F steps. If your zone falls inside this plant's range, normal winters won't kill it — and a plant native to your area is almost always comfortably inside its home zone. No blankets, no burlap.`,
    },
    {
      icon: "🧪",
      label: "Soil pH",
      value: `${p.ph.min}–${p.ph.max}`,
      sub: phWord(p.ph.min, p.ph.max),
      explain: `How acidic or alkaline the soil is — 7 is neutral, lower is acidic, higher is alkaline. Natives evolved with the local bedrock and leaf litter, so a plant native nearby rarely quarrels with your soil's pH. Pick to fit and you never buy amendments.`,
    },
    {
      icon: "📏",
      label: "Full size",
      value: `${ft(p.matureHeightFt)} × ${ft(p.matureSpreadFt)}`,
      sub: "height × spread, eventually",
      explain: `The honest eventual size from our cited records — often far bigger than a nursery tag admits. Give a native room for its mature self from day one and it will never need shearing into submission; the drawing below shows the pace year by year.`,
    },
    {
      icon: "🌱",
      label: `Year ${grown.year}`,
      value: `${ft(grown.heightFt)} tall`,
      sub: paceWord(grown.heightFt, p.matureHeightFt),
      explain: `${growthPlain(p)} The pace comes from typical field growth at years 1, 3, 5, and 10 in this plant's cited records — not nursery-tag optimism. Site, water, and luck all shift it.`,
    },
    {
      icon: "🐛",
      label: "Caterpillar hosts",
      value: `${p.hostLepCount} species`,
      sub: p.keystone ? "keystone plant" : "food-web value",
      explain: `How many butterfly and moth species can raise their caterpillars on this plant. Caterpillars are what nearly all baby songbirds are fed, so this is the best single measure of how much life a plant supports — and it's exactly where non-native plants score near zero.${p.keystone ? " This one is a keystone: it hosts far more species than most, and local food webs lean on it." : ""}`,
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
          explain: `When it flowers. Native bloom windows are timed to local pollinators — some bees emerge for exactly these weeks. Plant a few natives with staggered bloom times and something is serving nectar from early spring to frost.`,
        }
      : {
          icon: "🌿",
          label: "Bloom",
          value: "Foliage",
          sub: "grown for leaves, not flowers",
          explain: `This one is grown for foliage and structure rather than flowers — and that's still wildlife value. Leaves feed caterpillars, stems shelter overwintering insects, and cover matters year-round in ways nectar alone can't.`,
        },
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
