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
  const searchBtn = el("button", {
    type: "submit",
    class: "btn btn-secondary",
    style: "flex:none",
  }, t("location.search")) as HTMLButtonElement;
  const results = el("div", { "aria-live": "polite" });

  async function doSearch(): Promise<void> {
    const q = input.value.trim();
    if (!q) return;
    clear(msg);
    clear(results);
    searchBtn.disabled = true;
    searchBtn.textContent = t("location.searching");
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
      searchBtn.disabled = false;
      searchBtn.textContent = t("location.search");
    }
  }

  return el("div", {}, [
    gpsBtn,
    el("p", { class: "or-sep", "aria-hidden": "true" }, t("prompt.or")),
    el("form", {
      onSubmit: (e: Event) => { e.preventDefault(); void doSearch(); },
    }, [
      el("div", { class: "field" }, [
        el("label", { for: `${idBase}-place` }, t("prompt.label")),
        el("div", { style: "display:flex;gap:0.5rem" }, [input, searchBtn]),
      ]),
    ]),
    results,
    msg,
    privacyNote(t("prompt.privacy")),
  ]);
}
