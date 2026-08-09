// What this device remembers, as cards you can read and undo.
//
// The flow's job is to be quick; this page's job is to be legible. So every
// recall the flow performs in one terse line is spelled out in full here —
// what's stored, in plain words, and the button that throws it away. That
// division is what lets the location step say "your default region — change it
// in Settings" instead of re-explaining itself on every visit.
//
// Four cards, matching the four things kept (see `lib/sticky.ts` for why that
// list is exactly this long, and `lib/visits.ts` for the fourth, which is kept
// elsewhere because two documents read it) — and a fifth that isn't a memory at
// all but belongs to the same promise: whether this browser is counted in the
// site's visit total (`visitCountCard`, and `lib/analytics.ts`):
//
//   - **Your last spot** — where you were, with the sun and soil answers that
//     belong to *that ground*. Never applied anywhere else.
//   - **Starting region** — a setting, not a memory: the plant list the app
//     opens with when you'd rather not use the map at all.
//   - **Ranking goal** — the goal every new plant list is sorted by, which
//     already persisted silently and now says so.
//   - **What's new** — when you last visited and the release you'd read up to,
//     which is what the green dot on the gear is reading.
import { el, clear, toast } from "../ui";
import { store, persistPrefs, navigate, resetDraft } from "../state";
import { defaultRegion, forgetSpot, setDefaultRegion, sticky } from "../lib/sticky";
import type { StickySpot } from "../lib/sticky";
import { REGIONS } from "../lib/plants";
import { regionName, regionReference } from "../lib/names";
import { zoneChip } from "./zone-chip";
import { spotMap } from "./spot-map";
import { moisturePlain, sunPlain } from "../lib/plain";
import { DEFAULT_WEIGHTS } from "../lib/ranking";
import { matchingPreset, priorityName } from "../lib/priorities";
import { privacyNote } from "./privacy-link";
import { forgetVisits, visits } from "../lib/visits";
import { countingChosen, refusedByBrowser, setAnalyticsEnabled } from "../lib/analytics";
import { t, fmtDate } from "../lib/i18n";

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
        // The picture is part of the answer to "where", so it sits in that
        // row's value beside the numbers rather than floating above the list:
        // "40.0379, -75.3557" is a spot only a machine can place.
        el("dt", {}, t("memory.spotWhere")),
        el("dd", { class: "memory-where" }, [
          ...(spot.lat != null && spot.lon != null ? [spotMap(spot.lat, spot.lon)] : []),
          el("span", {}, whereWords(spot)),
        ]),
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
  // Four decimals, and not through the number formatter: it rounds to whole
  // degrees by default, which had this card reporting a spot in Pennsylvania
  // as "40, -75" — a point a hundred kilometres wide. Coordinates also keep
  // the decimal *point* in every language, as the Saved list writes them: a
  // French "40,038, -75,356" is four numbers separated by commas.
  return t("memory.spotWhereCoords", {
    lat: spot.lat.toFixed(4),
    lon: spot.lon.toFixed(4),
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

/**
 * When you last looked, and what you'd seen by then.
 *
 * The fourth card, and the one that most needs to exist: a green dot appearing
 * on the gear is the app volunteering that it knows something about your
 * history, so the page that accounts for what's stored has to account for this
 * too. It says both values in words a reader can check against their own
 * memory — the date they were last here, and the release they'd read up to —
 * and throws them away on one press.
 *
 * Forgetting is honest about what happens next: the next visit is a first
 * visit, which starts you level with today's release rather than resurrecting
 * every release you've already read as unread.
 */
export function whatsNewCard(): HTMLElement {
  const card = el("div", { class: "card" });
  fill();
  return card;

  function fill(): void {
    clear(card);
    const v = visits();
    card.append(el("h3", {}, t("memory.visitTitle")));
    if (!v.seenVersion) {
      card.append(el("p", {}, t("memory.visitEmpty")));
      return;
    }
    card.append(
      el("p", {}, t("memory.visitLede")),
      el("dl", { class: "memory-list" }, [
        ...row(t("memory.visitSeen"), t("memory.visitSeenValue", { version: v.seenVersion })),
        ...row(
          t("memory.visitWhen"),
          v.lastVisitAt ? fmtDate(v.lastVisitAt) : t("memory.unanswered")
        ),
      ]),
      privacyNote(t("memory.visitPrivacy")),
      el("div", { class: "btn-row", style: "margin-top:0.8rem" }, [
        el("button", {
          class: "btn btn-ghost",
          onClick: () => {
            forgetVisits();
            toast(t("memory.forgotten"));
            fill();
          },
        }, t("memory.forget")),
      ])
    );
  }
}

/**
 * Whether this browser is counted in the visit total.
 *
 * Not a memory like the four above — nothing here is *about* you — but it earns
 * a place on this page for the same reason they do: the app does something with
 * the outside world that a reader might not expect, so the page that accounts
 * for everything says it and offers the way out. Off means the counting script
 * is never fetched at all (`lib/analytics.ts`), which is why the card can
 * promise silence rather than promising that someone else ignores you.
 *
 * When the browser is already refusing — Do Not Track, or Global Privacy
 * Control — that's said plainly above the choice rather than the switch quietly
 * moving itself. The reader's own setting is theirs, and it stays where they
 * put it for the day they turn the browser signal off.
 */
export function visitCountCard(): HTMLElement {
  const card = el("div", { class: "card" });
  fill();
  return card;

  function fill(): void {
    clear(card);
    const chosen = countingChosen();
    card.append(
      el("h3", {}, t("memory.countTitle")),
      el("p", {}, t("memory.countLede"))
    );
    if (refusedByBrowser()) {
      card.append(el("p", { class: "note info" }, t("memory.countBrowserOff")));
    }
    card.append(
      el("div", {}, [
        el("button", {
          class: "choice",
          "aria-pressed": chosen ? "true" : "false",
          onClick: () => choose(true),
        }, [
          el("span", { class: "choice-title" }, t("memory.countOn")),
          el("span", { class: "choice-sub" }, t("memory.countOnSub")),
        ]),
        el("button", {
          class: "choice",
          "aria-pressed": chosen ? "false" : "true",
          onClick: () => choose(false),
        }, [
          el("span", { class: "choice-title" }, t("memory.countOff")),
          el("span", { class: "choice-sub" }, t("memory.countOffSub")),
        ]),
      ]),
      privacyNote(t("memory.countPrivacy"))
    );
  }

  function choose(on: boolean): void {
    setAnalyticsEnabled(on);
    fill();
    // Honest about the seam: a script already fetched stays fetched, so turning
    // it off finishes taking effect on the next load rather than mid-page.
    toast(on ? t("memory.countNowOn") : t("memory.countNowOff"));
  }
}

/** One labelled line of the "here's what's stored" list. */
function row(k: string, v: string): HTMLElement[] {
  return [el("dt", {}, k), el("dd", {}, v)];
}
