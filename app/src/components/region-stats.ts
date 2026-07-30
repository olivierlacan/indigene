// The region's "player card": what this roster adds up to for wildlife, as the
// same icon + label + value tiles a plant page uses. The numbers all come from
// data the app already carries — the roster itself, each plant's cited
// caterpillar-host count, and the documented plant↔animal ties — so the tiles
// are a summary, never a new claim. Like the plant stat grid, every tile is a
// button that opens a small dialog explaining what the figure means and where
// it comes from.
import type { Plant } from "../types";
import type { RegionDef } from "../data/region";
import { el } from "../ui";
import { wildlifeCountForRegion } from "../lib/wildlife";
import { keystoneIcon } from "./keystone-icon";
import { DATA_SOURCES_URL } from "../lib/plain";
import { t, fmtNumber } from "../lib/i18n";
import { commonName, regionName } from "../lib/names";

interface RegionStat {
  /** Emoji icon, or a factory for an inline SVG (the keystone arch). */
  icon: string | (() => Node);
  label: string;
  value: string;
  sub?: string;
  /** What the figure means and where it comes from (the tap-to-open dialog). */
  explain: string;
  /** Optional in-app link shown in the dialog. */
  moreHref?: string;
  moreLabel?: string;
}

export function regionStatGrid(region: RegionDef, plants: Plant[]): HTMLElement {
  const stats = statsFor(region, plants);
  const dialog = el("dialog", { class: "stat-dialog" }) as HTMLDialogElement;
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close(); // tap the backdrop to dismiss
  });

  const iconNode = (s: RegionStat): Node =>
    typeof s.icon === "string" ? document.createTextNode(s.icon) : s.icon();

  const open = (s: RegionStat): void => {
    dialog.replaceChildren(
      el("h3", { style: "margin:0 0 0.2rem" }, [
        el("span", { "aria-hidden": "true", style: "margin-right:0.35rem" }, [iconNode(s)]),
        s.label,
      ]),
      el("p", { class: "stat-dialog-value" }, `${s.value}${s.sub ? ` — ${s.sub}` : ""}`),
      el("p", { style: "margin:0.5rem 0 0.9rem" }, s.explain),
      ...(s.moreHref && s.moreLabel
        ? [el("p", { class: "stat-dialog-source" }, [
            el("a", { href: s.moreHref, onClick: () => dialog.close() }, s.moreLabel),
          ])]
        : []),
      el("p", { class: "stat-dialog-source" }, [
        el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, t("stat.howSourced")),
      ]),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => dialog.close() }, t("stat.gotIt"))
    );
    dialog.showModal();
  };

  return el("div", { class: "stat-grid", "aria-label": t("stat.glance", { name: regionName(region.meta) }) }, [
    ...stats.map((s) =>
      el("button", {
        class: "stat-tile",
        type: "button",
        "aria-haspopup": "dialog",
        "aria-label": t("stat.tileAria", { label: s.label, value: s.value, sub: s.sub ? `, ${s.sub}` : "" }),
        onClick: () => open(s),
      }, [
        el("span", { class: "stat-k", "aria-hidden": "true" }, [
          el("span", { style: "display:inline-flex;align-items:center;gap:0.3rem" }, [iconNode(s), s.label]),
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

function statsFor(region: RegionDef, plants: Plant[]): RegionStat[] {
  const wildlife = wildlifeCountForRegion(region.meta.id);
  const keystones = plants.filter((p) => p.keystone);
  // Host counts are per-plant tallies of overlapping species, so summing them
  // would double-count — the honest roster-level figure is the single best
  // plant's count, said as "up to N on one plant".
  const topHost = plants.reduce((best, p) => (p.hostLepCount > best.hostLepCount ? p : best), plants[0]);
  const stats: RegionStat[] = [
    {
      icon: "🌿",
      label: t("regionStat.plants.label"),
      value: fmtNumber(plants.length),
      sub: t("regionStat.plants.sub"),
      explain: t("regionStat.plants.explain"),
    },
    {
      icon: "🐛",
      label: t("regionStat.hosts.label"),
      value: t("regionStat.hosts.value", { n: fmtNumber(topHost.hostLepCount) }),
      sub: t("regionStat.hosts.sub", { plant: commonName(topHost) }),
      explain: t("regionStat.hosts.explain", {
        plant: commonName(topHost),
        n: fmtNumber(topHost.hostLepCount),
      }),
    },
  ];
  if (wildlife > 0) {
    stats.push({
      icon: "🦋",
      label: t("regionStat.wildlife.label"),
      // "Kinds", not "animals": each catalog entry counts once, and some
      // entries are a single species (the monarch) while others are a
      // recognizable group (jays, turkeys & woodpeckers) — so a plain animal
      // count would be both an under- and an over-statement at once.
      value: fmtNumber(wildlife),
      sub: t("regionStat.wildlife.sub"),
      explain: t("regionStat.wildlife.explain", { n: fmtNumber(wildlife) }),
      moreHref: "#/wildlife",
      moreLabel: t("regionStat.wildlife.more"),
    });
  }
  if (keystones.length > 0) {
    stats.push({
      icon: () => el("span", { style: "display:inline-flex;color:var(--brand)" }, [keystoneIcon(13)]),
      label: t("regionStat.keystone.label"),
      value: fmtNumber(keystones.length),
      sub: t("regionStat.keystone.sub"),
      explain: t("regionStat.keystone.explain", { n: fmtNumber(keystones.length) }),
    });
  }
  return stats;
}
