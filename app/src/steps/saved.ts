import { el, clear, toast } from "../ui";
import { navigate, openSavedSpot } from "../state";
import { listSpots, deleteSpot, listPlantings } from "../db";
import type { Planting } from "../types";
import { latPlain, lonPlain, sunPlain } from "../lib/plain";
import { tally } from "../lib/garden";
import { spotWildlifeCount } from "../lib/spot-value";
import { regionForSpot } from "../lib/plants";
import { privacyNote } from "../components/privacy-link";
import { cardStats } from "../components/card-stats";
import { spotMap } from "../components/spot-map";
import { townFor, townsReady } from "../lib/places";
import { t, tn, fmtNumber } from "../lib/i18n";

// Saved spots — local-first, no account. Open one to reload its readings and
// jump back to the plant list, or delete it.
export async function renderSaved(main: HTMLElement): Promise<void> {
  // The town names are read from the device in the background at boot; wait for
  // that read so a list doesn't draw once without them and again with.
  await townsReady();
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
    const mine = plantings.filter((p) => p.spotId === s.id);
    const counts = tally(mine);
    // Counted off the tie table and the registry, both already here — so a row
    // can say what a garden feeds without downloading a single plant list, and
    // says the same number the spot's own page does.
    const wildlife = spotWildlifeCount(
      mine.map((p) => p.plantId),
      regionForSpot(s)?.meta.id ?? null
    );
    const item = el("li", { class: "saved-item" }, [
      // Beside the name, because the name is the only other thing telling one
      // saved spot from another — and one you gave a corner of a garden last
      // spring doesn't always come back on its own.
      spotMap(s.lat, s.lon, { label: t("map.spotLabelNamed", { label: s.label }) }),
      // Beside the map: what names this spot. The sun reading follows on its
      // own line below, because it's a sentence — squeezed into the column left
      // over beside a picture it wraps six times and reads like a receipt.
      el("div", { class: "saved-item-body" }, [
        el("div", { style: "font-weight:700" }, s.label),
        // The town, when this device was told one while the spot was being
        // found — read from storage, never looked up here, because these spots
        // are promised not to leave the device.
        townFor(s.lat, s.lon)
          ? el("div", { class: "spot-town" }, t("coord.near", { place: townFor(s.lat, s.lon)! }))
          : null,
        el("div", { class: "coords" }, [
          el("div", {}, latPlain(s.lat)),
          el("div", {}, lonPlain(s.lon)),
        ]),
        // What's actually in the ground here, when anything is — as figures
        // rather than a sentence about them, the same row a region's card
        // carries. "9 plants in the ground, 3 kinds" was a paragraph doing a
        // tile's job: slower to read, wider than a phone at two spots, and a
        // translation besides. The full sentence is still there, in the
        // tooltip and as the accessible name.
        //
        // A spot with an empty log shows nothing rather than a row of zeroes:
        // the log is an offer, not a chore somebody is behind on.
        counts.plants
          ? cardStats([
              {
                icon: "🌱",
                value: fmtNumber(counts.plants),
                label: tn("saved.statPlants", counts.plants, { count: fmtNumber(counts.plants) }),
              },
              {
                icon: "🎨",
                value: fmtNumber(counts.kinds),
                label: tn("saved.statKinds", counts.kinds, { count: fmtNumber(counts.kinds) }),
              },
              wildlife
                ? {
                    icon: "🦋",
                    value: fmtNumber(wildlife),
                    label: tn("saved.statWildlife", wildlife, { count: fmtNumber(wildlife) }),
                  }
                : null,
            ])
          : null,
      ]),
      el("div", { class: "saved-item-sun" },
        s.sun ? sunPlain(s.sun.hours) : t("saved.sunUnknown")),
      el("div", { class: "saved-item-actions" }, [
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
