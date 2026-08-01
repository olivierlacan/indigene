// What this device remembers, as cards you can read and undo.
//
// The flow's job is to be quick; this page's job is to be legible. So every
// recall the flow performs in one terse line is spelled out in full here —
// what's stored, in plain words, and the button that throws it away. That
// division is what lets the location step say "your default region — change it
// in Settings" instead of re-explaining itself on every visit.
//
// Three cards, matching the three things kept (see `lib/sticky.ts` for why the
// list is exactly this long):
//
//   - **Your last spot** — where you were, with the sun and soil answers that
//     belong to *that ground*. Never applied anywhere else.
//   - **Starting region** — a setting, not a memory: the plant list the app
//     opens with when you'd rather not use the map at all.
//   - **Ranking goal** — the goal every new plant list is sorted by, which
//     already persisted silently and now says so.
import { el, clear, toast } from "../ui";
import { store, persistPrefs, navigate, resetDraft } from "../state";
import { defaultRegion, forgetSpot, setDefaultRegion, sticky } from "../lib/sticky";
import type { StickySpot } from "../lib/sticky";
import { REGIONS } from "../lib/plants";
import { regionName, regionReference } from "../lib/names";
import { zoneChip } from "./zone-chip";
import { moisturePlain, sunPlain } from "../lib/plain";
import { DEFAULT_WEIGHTS } from "../lib/ranking";
import { matchingPreset, priorityName } from "../lib/priorities";
import { privacyNote } from "./privacy-link";
import { t, fmtNumber } from "../lib/i18n";

/**
 * The last spot, in full: where it is and what's remembered about it.
 *
 * Re-renders itself in place when the spot is forgotten, so the card that said
 * "here's what we know" becomes the card that says "nothing yet" without a
 * navigation — the reader stays where they were and can see that the button
 * did what it said.
 */
export function lastSpotCard(): HTMLElement {
  const card = el("div", { class: "card" });
  fill();
  return card;

  function fill(): void {
    clear(card);
    const spot = sticky().spot;
    card.append(el("h3", {}, t("memory.spotTitle")));
    if (!spot) {
      card.append(el("p", {}, t("memory.spotEmpty")));
      return;
    }
    card.append(
      el("p", {}, t("memory.spotLede")),
      el("dl", { class: "memory-list" }, [
        ...row(t("memory.spotWhere"), whereWords(spot)),
        ...row(t("memory.spotSun"), spot.sun ? sunPlain(spot.sun.hours) : t("memory.unanswered")),
        ...row(t("memory.spotSoil"), spot.moisture ? moisturePlain(spot.moisture) : t("memory.unanswered")),
      ]),
      privacyNote(t("memory.spotPrivacy")),
      el("div", { class: "btn-row", style: "margin-top:0.8rem" }, [
        el("button", {
          class: "btn btn-secondary",
          onClick: () => {
            // A clean draft, so the location step opens on the remembered spot
            // rather than on whatever half-finished one is in memory.
            resetDraft();
            navigate("location");
          },
        }, t("memory.spotUse")),
        el("button", {
          class: "btn btn-ghost",
          onClick: () => {
            forgetSpot();
            toast(t("memory.forgotten"));
            fill();
          },
        }, t("memory.forget")),
      ])
    );
  }
}

/** Where the remembered spot is, said the way it was chosen. */
function whereWords(spot: StickySpot): string {
  if (spot.regionId) {
    const region = REGIONS.find((r) => r.meta.id === spot.regionId);
    return region ? t("memory.spotWhereRegion", { region: regionName(region.meta) }) : t("memory.unanswered");
  }
  if (spot.lat == null || spot.lon == null) return t("memory.unanswered");
  return t("memory.spotWhereCoords", {
    lat: fmtNumber(Number(spot.lat.toFixed(4))),
    lon: fmtNumber(Number(spot.lon.toFixed(4))),
  });
}

/**
 * The region the app opens with — the "I already know my area, stop asking me
 * for the map" setting.
 *
 * Always opens collapsed to whichever option is in force — the region, or
 * "work it out from where I am" — exactly as the location step's own picker
 * does. Eight full-height rows is more than half a phone screen of settings
 * page spent on a list nobody is reading yet, and it pushed everything below
 * it out of reach; "Show all regions" is one tap and the heading and lede
 * above already say what the card is for.
 */
export function startingRegionCard(): HTMLElement {
  const card = el("div", { class: "card" });
  const list = el("div", {});
  let expanded = false;

  card.append(
    el("h3", {}, t("memory.regionTitle")),
    el("p", {}, t("memory.regionLede")),
    list
  );
  renderList();
  return card;

  function choose(id: string | null): void {
    setDefaultRegion(id);
    expanded = false;
    renderList();
    toast(id ? t("memory.regionSet") : t("memory.regionCleared"));
  }

  function renderList(): void {
    clear(list);
    const current = defaultRegion();
    // "Work it out from where I am" is a real option, listed like the rest —
    // the way back off this setting has to be as visible as the way onto it,
    // which is why it's also what the collapsed card shows when it's in force.
    if (expanded || current == null) {
      list.append(
        el("button", {
          class: "choice",
          "aria-pressed": current == null ? "true" : "false",
          onClick: () => choose(null),
        }, [
          el("span", { class: "choice-title" }, t("memory.regionAuto")),
          el("span", { class: "choice-sub" }, t("memory.regionAutoSub")),
        ])
      );
    }
    const shown = expanded ? REGIONS : REGIONS.filter((r) => r.meta.id === current);
    list.append(
      ...shown.map((r) =>
        el("button", {
          class: "choice",
          "aria-pressed": r.meta.id === current ? "true" : "false",
          onClick: () => choose(r.meta.id),
        }, [
          el("span", { class: "choice-title" }, regionName(r.meta)),
          el("span", { class: "choice-sub" }, [regionReference(r.meta), " ", zoneChip(r.meta)]),
        ])
      )
    );
    if (!expanded) {
      list.append(
        el("button", {
          class: "linklike",
          onClick: () => { expanded = true; renderList(); },
        }, t("memory.regionShowAll"))
      );
    }
  }
}

/**
 * The goal every new plant list is ranked by.
 *
 * This one was already remembered — the weights have persisted since long
 * before this page existed — it just never said so anywhere, which made a list
 * ordered by last month's decision look like the app's own opinion. Naming it
 * here is the whole fix. Changing it stays where it belongs, on the goals step
 * with the live preview of what the change does; all that's offered here is
 * the way back to the default.
 */
export function rankingGoalCard(): HTMLElement {
  const card = el("div", { class: "card" });
  fill();
  return card;

  function fill(): void {
    clear(card);
    // The app's default ranking is a named goal like any other (`PRESETS[0]`),
    // so "is this the default?" is just asking which goal matches.
    const isDefault = matchingPreset(store.weights)?.key === "preset.default";
    card.append(
      el("h3", {}, t("memory.goalTitle")),
      el("p", { class: "memory-value" }, priorityName(store.weights)),
      el("p", {}, t("memory.goalLede")),
      ...(isDefault ? [] : [
        el("div", { class: "btn-row", style: "margin-top:0.8rem" }, [
          el("button", {
            class: "btn btn-secondary",
            onClick: () => {
              store.weights = { ...DEFAULT_WEIGHTS };
              void persistPrefs();
              toast(t("memory.goalReset"));
              fill();
            },
          }, t("memory.goalResetBtn")),
        ]),
      ])
    );
  }
}

/** One labelled line of the "here's what's stored" list. */
function row(k: string, v: string): HTMLElement[] {
  return [el("dt", {}, k), el("dd", {}, v)];
}
