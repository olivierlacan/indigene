import { el, clear, toast } from "../ui";
import { navigate, openSavedSpot } from "../state";
import { listSpots, deleteSpot, listPlantings } from "../db";
import type { Planting } from "../types";
import { sunPlain } from "../lib/plain";
import { tally } from "../lib/garden";
import { privacyNote } from "../components/privacy-link";
import { t, tn, fmtNumber } from "../lib/i18n";

// Saved spots — local-first, no account. Open one to reload its readings and
// jump back to the plant list, or delete it.
export async function renderSaved(main: HTMLElement): Promise<void> {
  clear(main);
  main.append(el("h2", { class: "step-title" }, t("saved.title")));

  const spots = await listSpots().catch(() => []);
  if (!spots.length) {
    main.append(
      el("p", { class: "step-lede" }, t("saved.empty")),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("location") }, t("saved.find"))
    );
    return;
  }

  // One read for every spot's log, rather than one per row: the whole store is
  // a person's own garden, tens of rows at most.
  const plantings = await listPlantings().catch(() => [] as Planting[]);

  const list = el("ul", { class: "saved-list" });
  for (const s of spots) {
    const counts = tally(plantings.filter((p) => p.spotId === s.id));
    const item = el("li", { class: "saved-item" }, [
      el("div", {}, [
        el("div", { style: "font-weight:700" }, s.label),
        el("div", { class: "coords" }, `${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}`),
        el("div", { style: "font-size:0.9rem;color:var(--ink-soft)" },
          s.sun ? sunPlain(s.sun.hours) : t("saved.sunUnknown")),
        // What's actually in the ground here, when anything is. A spot with an
        // empty log says nothing rather than "0 plants": the log is an offer,
        // not a chore somebody is behind on.
        counts.plants
          ? el("div", { class: "saved-tally" },
              tn("saved.tally", counts.plants, {
                count: fmtNumber(counts.plants),
                kinds: fmtNumber(counts.kinds),
              }))
          : null,
      ]),
      el("div", { style: "display:flex;gap:0.4rem;flex:none" }, [
        el("button", {
          class: "btn btn-secondary", style: "min-height:2.6rem;padding:0.4rem 0.7rem",
          onClick: () => openSavedSpot(s),
        }, t("saved.open")),
        el("button", {
          class: "btn btn-ghost", style: "min-height:2.6rem;padding:0.4rem 0.5rem",
          "aria-label": t("saved.deleteLabel", { label: s.label }),
          onClick: async () => {
            if (confirm(t("saved.confirmDelete", { label: s.label }))) {
              await deleteSpot(s.id);
              item.remove();
              toast(t("saved.deleted"));
              if (!list.children.length) renderSaved(main);
            }
          },
        }, "🗑"),
      ]),
      // Full width under the row: the way into this spot's own page, where the
      // planting log lives. A third button beside the other two would have made
      // three tap targets share a phone's width.
      el("a", {
        class: "saved-log-link",
        href: `#/saved/${encodeURIComponent(s.id)}`,
      }, counts.plants ? t("saved.openLog") : t("saved.startLog")),
    ]);
    list.append(item);
  }

  main.append(
    list,
    privacyNote(t("saved.privacy")),
    el("button", { class: "btn btn-primary btn-block", style: "margin-top:1rem", onClick: () => navigate("location") }, t("saved.findAnother"))
  );
}
