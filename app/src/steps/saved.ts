import { el, clear, toast } from "../ui";
import { navigate, store } from "../state";
import { listSpots, deleteSpot } from "../db";
import { sunPlain } from "../lib/plain";

// Saved spots — local-first, no account. Open one to reload its readings and
// jump back to the plant list, or delete it.
export async function renderSaved(main: HTMLElement): Promise<void> {
  clear(main);
  main.append(el("h2", { class: "step-title" }, "Your saved spots"));

  const spots = await listSpots().catch(() => []);
  if (!spots.length) {
    main.append(
      el("p", { class: "step-lede" }, "Nothing saved yet. Find a spot and tap “Save this spot” to keep it here on your phone."),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("location") }, "Find a spot")
    );
    return;
  }

  const list = el("ul", { class: "saved-list" });
  for (const s of spots) {
    const item = el("li", { class: "saved-item" }, [
      el("div", {}, [
        el("div", { style: "font-weight:700" }, s.label),
        el("div", { class: "coords" }, `${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}`),
        el("div", { style: "font-size:0.9rem;color:var(--ink-soft)" }, s.sun ? sunPlain(s.sun.hours) : "Sun not recorded"),
      ]),
      el("div", { style: "display:flex;gap:0.4rem;flex:none" }, [
        el("button", {
          class: "btn btn-secondary", style: "min-height:2.6rem;padding:0.4rem 0.7rem",
          onClick: () => {
            store.draft = {
              lat: s.lat, lon: s.lon, site: s.site, sun: s.sun, horizon: s.horizon,
              deciduousOverhead: s.deciduousOverhead ?? false,
              moistureOverride: s.soilOverride?.moisture ?? null,
              editingId: s.id,
            };
            store.weights = { ...s.weights };
            navigate("results");
          },
        }, "Open"),
        el("button", {
          class: "btn btn-ghost", style: "min-height:2.6rem;padding:0.4rem 0.5rem", "aria-label": `Delete ${s.label}`,
          onClick: async () => {
            if (confirm(`Delete “${s.label}”? This can't be undone.`)) {
              await deleteSpot(s.id);
              item.remove();
              toast("Deleted.");
              if (!list.children.length) renderSaved(main);
            }
          },
        }, "🗑"),
      ]),
    ]);
    list.append(item);
  }

  main.append(
    list,
    el("button", { class: "btn btn-primary btn-block", style: "margin-top:1rem", onClick: () => navigate("location") }, "Find another spot")
  );
}
