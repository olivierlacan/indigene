// A location prompt that offers two equally-weighted ways to say where "near
// you" is: share the device's GPS location, or type a ZIP code (or town). Both
// resolve to the same thing — a coordinate — and hand it back through one
// callback, so a feature that wants "sightings near a spot" doesn't care which
// route the person took. The ZIP path exists because sharing precise location is
// a big ask (and often declined or unavailable on desktop), while a ZIP is
// low-stakes and gets us the same ~town-level precision every other lookup in
// the app works at (soil, climate, ecoregion are all coarser than a street).
//
// The ZIP/town → coordinate step is the app's existing geocoder (`lib/geocode`,
// Open-Meteo, no key, town/postal-code granularity), the same one the plant
// suitability checker uses — no new provider, no new trust decision.
//
// **Both routes share one row.** They used to stack: a full-width primary button,
// an "or" rule, a field label, and the input with its own Search button — five
// controls' worth of chrome to ask one short question, above the fold of a
// section whose actual content is photographs. Now the button sits beside the
// field, and the privacy promise is a one-line link into the page that spells it
// out rather than a paragraph restated in place.
//
// The Search button went with it. The field is a `type="search"` inside a
// `<form>`, so Enter submits it and every mobile keyboard offers a Search key —
// the button was spending the width the field needed at a 360 px phone on an
// action the field already offers. Progress is reported where the answer will
// appear, which is where someone is looking anyway.
import { el, clear } from "../ui";
import { searchPlaces, placeLabel } from "../lib/geocode";
import { privacyLink } from "./privacy-link";
import { t } from "../lib/i18n";

export interface LocationPromptConfig {
  /** Unique base for the input's id/label pair, so two prompts can coexist. */
  idBase: string;
  /** Verb-first label for the GPS button (kept short — it must stay one line). */
  gpsLabel: string;
  /** Called once a spot is chosen — by GPS (no `label`) or a resolved place pick
   *  (`label` is the place's display name, e.g. "State College, Pennsylvania"). */
  onResolve: (lat: number, lon: number, label?: string) => void;
}

/**
 * Build the prompt element. Self-contained: it owns its GPS acquisition and its
 * place search (including their busy/error states); the caller only reacts to
 * `onResolve`. Safe to reuse — nothing here is singleton.
 */
export function locationPrompt(config: LocationPromptConfig): HTMLElement {
  const { idBase, gpsLabel, onResolve } = config;

  // A shared spot for GPS/search errors, so a failure on either route explains
  // itself and points at the other route as the way forward.
  const msg = el("div", { "aria-live": "polite" });
  function note(text: string): void {
    clear(msg);
    msg.append(el("p", { class: "note warn", style: "margin:0.5rem 0 0" }, text));
  }

  // ---- Route 1: the device's location ----
  const gpsBtn = el("button", {
    type: "button",
    class: "btn btn-primary spot-gps",
    onClick: useGps,
  }, `📍 ${gpsLabel}`) as HTMLButtonElement;

  function resetGps(): void {
    gpsBtn.disabled = false;
    gpsBtn.textContent = `📍 ${gpsLabel}`;
  }

  function useGps(): void {
    clear(msg);
    if (!("geolocation" in navigator)) {
      note(t("prompt.noGeolocation"));
      return;
    }
    gpsBtn.disabled = true;
    gpsBtn.textContent = t("prompt.getting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resetGps();
        onResolve(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        resetGps();
        note(
          err.code === err.PERMISSION_DENIED
            ? t("prompt.denied")
            : t("prompt.noFix"),
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    );
  }

  // ---- Route 2: a ZIP code or town ----
  const input = el("input", {
    type: "search",
    id: `${idBase}-place`,
    autocomplete: "off",
    placeholder: t("prompt.placeholder"),
    style: "flex:1 1 auto;min-width:0",
  }) as HTMLInputElement;
  const results = el("div", { "aria-live": "polite" });

  async function doSearch(): Promise<void> {
    const q = input.value.trim();
    if (!q) return;
    clear(msg);
    clear(results);
    input.disabled = true;
    // The progress line stands where the results will, so the eye doesn't have
    // to move when they arrive.
    results.append(el("p", { class: "note", style: "margin:0.5rem 0 0" }, t("location.searching")));
    try {
      const places = await searchPlaces(q);
      clear(results);
      if (!places.length) {
        note(t("prompt.notFound"));
        return;
      }
      results.append(
        ...places.map((p) =>
          el("button", {
            type: "button",
            class: "choice",
            onClick: () => {
              clear(results);
              clear(msg);
              onResolve(p.lat, p.lon, placeLabel(p));
            },
          }, [
            el("span", { class: "choice-title" }, placeLabel(p)),
            el("span", { class: "choice-sub" }, `${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`),
          ]),
        ),
      );
    } catch {
      note(t("prompt.offline"));
    } finally {
      input.disabled = false;
    }
  }

  // One row: the GPS button, then the place field. The label is visually hidden
  // rather than dropped — the placeholder is an example, not a name for the
  // field, and a screen reader still needs the name.
  //
  // The whole block is width-capped (`.spot-prompt`), not just the row: the
  // place picks that land under it are a list of one-line choices, and they
  // sprawl on a wide page for the same reason the field did.
  return el("div", { class: "spot-prompt" }, [
    el("div", { class: "spot-row" }, [
      gpsBtn,
      el("form", {
        class: "spot-search",
        onSubmit: (e: Event) => { e.preventDefault(); void doSearch(); },
      }, [
        el("label", { for: `${idBase}-place`, class: "sr-only" }, t("prompt.label")),
        input,
      ]),
    ]),
    results,
    msg,
    privacyLink(t("prompt.privacyLink"), "lookups"),
  ]);
}
