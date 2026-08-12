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
import type { MoistureBand, Plant } from "../types";
import { el } from "../ui";
import { sunLabel, growthPlain, bloomColorWord, DATA_SOURCES_URL, ZONE_INFO_URL, MOISTURE_INFO_URL } from "../lib/plain";
import { t, fmtNumber, monthName } from "../lib/i18n";
import { lengthTick, temperatureSpan } from "../lib/units";
import { commonName } from "../lib/names";

export interface Stat {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  /** What the metric means and why it matters for natives (the tap-to-open dialog). */
  explain: string;
  /** Citation for the figure, shown in the dialog (e.g. the host count's basis). */
  source?: string;
  /** Optional "learn more" link for the term itself (e.g. the USDA zone map). */
  moreUrl?: string;
  moreLabel?: string;
}

export function statGrid(p: Plant): HTMLElement {
  return statTiles(statsFor(p), t("stat.glance", { name: commonName(p) }));
}

export interface TileOptions {
  /**
   * Draw the grid as a row of **figures**: a one-word label in small caps over
   * a number twice the usual size.
   *
   * For grids where every value really is a bare count — a spot's tally. It is
   * not the default because most tiles hold a phrase rather than a number
   * ("5–12 h/day", "height × spread, eventually"), and a phrase set at figure
   * size wraps into a mess in a tile 8 rem wide. The trade is deliberate:
   * where the value *is* a number, the number should be the thing you see.
   */
  figures?: boolean;
}

/**
 * The grid itself, for any page with numbers worth scanning — a plant's
 * characteristics, an animal's reach. An animal's page used to say the same
 * figures in a sentence ("3 native plants in Indigene support Hazel dormouse,
 * 1 of them as a caterpillar host"), which is a paragraph doing a tile's job:
 * longer to read, longer to translate, and impossible to compare at a glance
 * against the plant pages that had tiles all along.
 */
export function statTiles(stats: Stat[], ariaLabel: string, opts: TileOptions = {}): HTMLElement {
  const dialog = el("dialog", { class: "stat-dialog" }) as HTMLDialogElement;
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close(); // tap the backdrop to dismiss
  });

  const open = (s: Stat): void => {
    const parts: HTMLElement[] = [
      el("h3", { style: "margin:0 0 0.2rem" }, [el("span", { "aria-hidden": "true" }, `${s.icon} `), s.label]),
      el("p", { class: "stat-dialog-value" }, `${s.value}${s.sub ? ` — ${s.sub}` : ""}`),
      el("p", { style: "margin:0.5rem 0 0.9rem" }, s.explain),
    ];
    if (s.source) {
      parts.push(el("p", { class: "stat-dialog-source" }, [el("strong", {}, t("stat.dialogSource")), s.source]));
    }
    if (s.moreUrl && s.moreLabel) {
      parts.push(el("p", { class: "stat-dialog-source" }, [
        el("a", { href: s.moreUrl, target: "_blank", rel: "noopener" }, s.moreLabel),
      ]));
    }
    parts.push(
      el("p", { class: "stat-dialog-source" }, [
        el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, t("stat.howSourced")),
      ]),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => dialog.close() }, t("stat.gotIt"))
    );
    dialog.replaceChildren(...parts);
    dialog.showModal();
  };

  return el("div", {
    class: `stat-grid${opts.figures ? " stat-grid-figures" : ""}`,
    "aria-label": ariaLabel,
  }, [
    ...stats.map((s) =>
      el("button", {
        class: "stat-tile",
        type: "button",
        "aria-haspopup": "dialog",
        "aria-label": t("stat.tileAria", {
          label: s.label,
          value: s.value,
          sub: s.sub ? `, ${s.sub}` : "",
        }),
        onClick: () => open(s),
      }, [
        // Icon and label are separate elements rather than one string, so the
        // figures variant can grow the one and shrink the other.
        el("span", { class: "stat-k", "aria-hidden": "true" }, [
          el("span", { class: "stat-name" }, [
            el("span", { class: "stat-icon" }, s.icon),
            el("span", { class: "stat-label" }, s.label),
          ]),
        ]),
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
      label: t("stat.sun.label"),
      value: t("stat.sun.value", { min: fmtNumber(p.sun.minHours), max: fmtNumber(p.sun.maxHours) }),
      sub: sunRange(p.sun.minHours, p.sun.maxHours),
      explain: t("stat.sun.explain"),
    },
    {
      icon: "💧",
      label: t("stat.moisture.label"),
      value: p.moisture.map(moistureShort).join(" · "),
      sub: t("stat.moisture.sub"),
      explain: t("stat.moisture.explain"),
      moreUrl: MOISTURE_INFO_URL,
      moreLabel: t("stat.moisture.more"),
    },
    {
      icon: "❄️",
      label: t("stat.zones.label"),
      value: p.zones.min === p.zones.max
        ? fmtNumber(p.zones.min)
        : `${fmtNumber(p.zones.min)}–${fmtNumber(p.zones.max)}`,
      sub: t("stat.zones.sub"),
      // A hardiness zone is one tenth of a Fahrenheit… which is 5.6 °C. The
      // step converts like any other temperature *difference*, so a metric
      // reader is told the real width of a zone rather than a number that
      // only means anything on the American scale.
      explain: t("stat.zones.explain", { step: temperatureSpan(10) }),
      moreUrl: ZONE_INFO_URL,
      moreLabel: t("stat.zones.more"),
    },
    {
      icon: "🧪",
      label: t("stat.ph.label"),
      value: `${fmtNumber(p.ph.min, 1)}–${fmtNumber(p.ph.max, 1)}`,
      sub: phWord(p.ph.min, p.ph.max),
      explain: t("stat.ph.explain"),
    },
    {
      icon: "📏",
      label: t("stat.size.label"),
      value: `${lengthTick(p.matureHeightFt)} × ${lengthTick(p.matureSpreadFt)}`,
      sub: t("stat.size.sub"),
      explain: t("stat.size.explain"),
    },
    {
      icon: "🌱",
      label: t("stat.year.label", { n: grown.year }),
      value: t("stat.year.value", { height: lengthTick(grown.heightFt) }),
      sub: paceWord(grown.heightFt, p.matureHeightFt),
      explain: `${growthPlain(p)} ${t("stat.year.explain")}`,
    },
    {
      icon: "🐛",
      label: t("stat.host.label"),
      value: t("stat.host.value", { n: fmtNumber(p.hostLepCount) }),
      sub: p.keystone ? t("stat.host.subKeystone") : t("stat.host.subValue"),
      explain: t("stat.host.explain") + (p.keystone ? ` ${t("stat.host.explainKeystone")}` : ""),
      source: p.basis,
    },
    p.bloom
      ? {
          icon: "🌸",
          label: t("stat.bloom.label"),
          value:
            p.bloom.startMonth === p.bloom.endMonth
              ? monthName(p.bloom.startMonth, "short")
              : `${monthName(p.bloom.startMonth, "short")}–${monthName(p.bloom.endMonth, "short")}`,
          sub: bloomColorWord(p.bloom.color),
          explain: t("stat.bloom.explain"),
        }
      : {
          icon: "🌿",
          label: t("stat.bloom.label"),
          value: t("stat.foliage.value"),
          sub: t("stat.foliage.sub"),
          explain: t("stat.foliage.explain"),
        },
  ];
}

function sunRange(min: number, max: number): string {
  const lo = sunLabel(min);
  const hi = sunLabel(max);
  return lo === hi ? lo : t("stat.sun.range", { lo, hi });
}

/** The tile's compact moisture word — capitalized, one word, distinct from the
 *  sentence-form `moistureWord()` in `plain.ts`. */
function moistureShort(b: MoistureBand): string {
  return t(`stat.moistureWord.${b}` as const);
}

function phWord(min: number, max: number): string {
  if (max < 6.5) return t("ph.word.acidic");
  if (min > 7) return t("ph.word.alkaline");
  if (min < 6 && max > 7) return t("ph.word.acidicToAlkaline");
  return t("ph.word.neutral");
}

// A plain word for how much of its eventual self it reaches in the snapshot
// window — honest pacing without pretending to a growth-rate dataset.
function paceWord(at10: number, mature: number): string {
  const share = mature > 0 ? at10 / mature : 1;
  if (share >= 0.8) return t("pace.quick");
  if (share >= 0.4) return t("pace.steady");
  return t("pace.slow");
}
