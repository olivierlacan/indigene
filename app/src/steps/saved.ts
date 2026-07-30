import { el, clear, toast } from "../ui";
import { navigate, openSavedSpot } from "../state";
import { listSpots, deleteSpot } from "../db";
import { sunPlain } from "../lib/plain";
import { privacyNote } from "../components/privacy-link";
import { t } from "../lib/i18n";

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

  const list = el("ul", { class: "saved-list" });
  for (const s of spots) {
    const item = el("li", { class: "saved-item" }, [
      el("div", {}, [
        el("div", { style: "font-weight:700" }, s.label),
        el("div", { class: "coords" }, `${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}`),
        el("div", { style: "font-size:0.9rem;color:var(--ink-soft)" },
          s.sun ? sunPlain(s.sun.hours) : t("saved.sunUnknown")),
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
    ]);
    list.append(item);
  }

  main.append(
    list,
    privacyNote(t("saved.privacy")),
    el("button", { class: "btn btn-primary btn-block", style: "margin-top:1rem", onClick: () => navigate("location") }, t("saved.findAnother"))
  );
}
