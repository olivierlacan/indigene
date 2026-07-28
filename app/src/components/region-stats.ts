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
        el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "How every number is sourced →"),
      ]),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => dialog.close() }, "Got it")
    );
    dialog.showModal();
  };

  return el("div", { class: "stat-grid", "aria-label": `${region.meta.name} at a glance` }, [
    ...stats.map((s) =>
      el("button", {
        class: "stat-tile",
        type: "button",
        "aria-haspopup": "dialog",
        "aria-label": `${s.label}: ${s.value}${s.sub ? `, ${s.sub}` : ""}. Tap to learn what this means.`,
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
      label: "Native plants",
      value: String(plants.length),
      sub: "curated for this region",
      explain:
        "The plants on this region's hand-built list, each checked as native to it against the sources cited on its profile. It's a curated starting lineup that grows carefully — not a census of everything that grows here.",
    },
    {
      icon: "🐛",
      label: "Caterpillar hosts",
      value: `up to ${topHost.hostLepCount}`,
      sub: `species on ${topHost.common.toLowerCase()} alone`,
      explain:
        `How many butterfly and moth species can raise their caterpillars on a single plant — ${topHost.common.toLowerCase()} tops this list at ${topHost.hostLepCount}. Caterpillars are what nearly all baby songbirds are fed, so this is the best single measure of how much life a planting supports. (Counts overlap between plants, so we don't add them up.)`,
    },
  ];
  if (wildlife > 0) {
    stats.push({
      icon: "🦋",
      label: "Wildlife ties",
      value: `${wildlife} animals`,
      sub: "documented, by name",
      explain:
        `${wildlife} butterflies, moths, bees, birds, and mammals with a documented, citable tie to at least one plant on this list. These are the notable, nameable relationships — the real total is far larger; a single oak feeds more species than anyone could list.`,
      moreHref: "#/wildlife",
      moreLabel: "Browse plants by the wildlife they support →",
    });
  }
  if (keystones.length > 0) {
    stats.push({
      icon: () => el("span", { style: "display:inline-flex;color:var(--brand)" }, [keystoneIcon(13)]),
      label: "Keystone plants",
      value: String(keystones.length),
      sub: "food webs lean on these",
      explain:
        `${keystones.length} of this region's plants are keystones — like the wedge at the crown of a stone arch, each supports far more wildlife than most, and losing one would unravel a food web far bigger than itself.`,
    });
  }
  return stats;
}
