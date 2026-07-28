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
import { el, clear } from "../ui";
import { searchPlaces, placeLabel } from "../lib/geocode";
import { privacyNote } from "./privacy-link";

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
    class: "btn btn-primary btn-block",
    onClick: useGps,
  }, `📍 ${gpsLabel}`) as HTMLButtonElement;

  function resetGps(): void {
    gpsBtn.disabled = false;
    gpsBtn.textContent = `📍 ${gpsLabel}`;
  }

  function useGps(): void {
    clear(msg);
    if (!("geolocation" in navigator)) {
      note("This device can't share a location — enter a ZIP code or town below instead.");
      return;
    }
    gpsBtn.disabled = true;
    gpsBtn.textContent = "Getting your location…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resetGps();
        onResolve(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        resetGps();
        note(
          err.code === err.PERMISSION_DENIED
            ? "Location denied — that's fine; enter a ZIP code or town below instead."
            : "Couldn't get your location. Try again, or enter a ZIP code or town below.",
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
    placeholder: "e.g. 16801, or State College",
    style: "flex:1 1 auto;min-width:0",
  }) as HTMLInputElement;
  const searchBtn = el("button", {
    type: "submit",
    class: "btn btn-secondary",
    style: "flex:none",
  }, "Search") as HTMLButtonElement;
  const results = el("div", { "aria-live": "polite" });

  async function doSearch(): Promise<void> {
    const q = input.value.trim();
    if (!q) return;
    clear(msg);
    clear(results);
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching…";
    try {
      const places = await searchPlaces(q);
      clear(results);
      if (!places.length) {
        note("Couldn't find that ZIP code or place. Try a nearby town with its state — like “State College Pennsylvania” — or a 5-digit ZIP.");
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
      note("The place search needs a signal and we couldn't reach it. If your device has GPS, use the location button above.");
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    }
  }

  return el("div", {}, [
    gpsBtn,
    el("p", { class: "or-sep", "aria-hidden": "true" }, "or"),
    el("form", {
      onSubmit: (e: Event) => { e.preventDefault(); void doSearch(); },
    }, [
      el("div", { class: "field" }, [
        el("label", { for: `${idBase}-place` }, "Enter a ZIP code or town"),
        el("div", { style: "display:flex;gap:0.5rem" }, [input, searchBtn]),
      ]),
    ]),
    results,
    msg,
    privacyNote("Whichever you choose, it's used only for this lookup and never leaves your device except as an anonymous request to iNaturalist"),
  ]);
}
