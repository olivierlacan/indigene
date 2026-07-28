import { el, clear, toast } from "../ui";
import { store, persistPrefs } from "../state";
import { REGIONS } from "../lib/plants";
import { DEFAULT_WEIGHTS, NO_FILTERS } from "../lib/ranking";
import { moistureWord } from "../lib/plain";
import { sticky, stickyReady, forgetSticky, forgetAllSticky, SUN_BUCKET_WORDS } from "../lib/sticky";

// The Preferences page: everything Indigene remembers between visits, in one
// place. Each remembered answer is shown in plain words with a Forget button;
// the page also owns resetting the ranking sliders and filters (which persist
// silently as you drag them on the plant list). The steps that recall these
// values disclose it in place (components/remembered.ts) and link here.
export async function renderPreferences(main: HTMLElement): Promise<void> {
  await stickyReady(); // show what's actually stored, not a race with the load
  clear(main);

  const s = sticky();

  // One card per remembered thing: what it is, its current value in plain
  // words (or how it gets remembered, when nothing is stored), and Forget.
  function prefCard(
    title: string,
    value: (string | HTMLElement)[] | null,
    emptyHint: string,
    onForget: () => void
  ): HTMLElement {
    return el("div", { class: "card" }, [
      el("h3", {}, title),
      value
        ? el("p", {}, value)
        : el("p", {}, ["Nothing remembered yet. ", emptyHint]),
      ...(value
        ? [el("button", {
            class: "btn btn-secondary",
            onClick: () => { onForget(); renderPreferences(main); toast("Forgotten."); },
          }, "Forget this")]
        : []),
    ]);
  }

  // --- Your spot ---
  const loc = s.location;
  let locValue: (string | HTMLElement)[] | null = null;
  if (loc?.mode === "region" && loc.regionId) {
    const name = REGIONS.find((r) => r.meta.id === loc.regionId)?.meta.name ?? loc.regionId;
    locValue = [`You picked the ${name} plant list by hand, so the location step starts on that choice.`];
  } else if (loc && loc.lat != null && loc.lon != null) {
    locValue = [
      `The map starts at your last confirmed spot (${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)})`,
      loc.mode === "zip" ? ", found through the town search." : ".",
    ];
  }

  // --- Sun ---
  const sun = s.sun;
  const sunValue: (string | HTMLElement)[] | null = sun
    ? [
        `You said your spot is ${SUN_BUCKET_WORDS[sun.bucket]}`,
        sun.deciduous ? ", with trees overhead that go bare in winter." : ".",
        " The sun step starts with that answer picked.",
      ]
    : null;

  // --- Moisture ---
  const moist = s.moisture;
  const moistValue: (string | HTMLElement)[] | null = moist
    ? [`You said your spot stays ${moistureWord(moist.band)}. The soil step starts with that answer picked.`]
    : null;

  // --- Ranking sliders & filters (persisted silently as they change) ---
  const weightsCustom = (Object.keys(DEFAULT_WEIGHTS) as (keyof typeof DEFAULT_WEIGHTS)[])
    .some((k) => store.weights[k] !== DEFAULT_WEIGHTS[k]);
  const f = store.filters;
  const filtersActive = f.requireNoWater || f.requireDeerResistant || f.excludeThorny
    || f.excludePetToxic || f.excludeAggressive || f.maxHeightFt != null || f.maxSpreadFt != null;

  const anythingStored = Boolean(locValue || sunValue || moistValue || weightsCustom || filtersActive);

  main.append(
    el("h2", { class: "step-title" }, "Preferences"),
    el("p", { class: "step-lede" }, [
      "Little things Indigene remembers so you don't have to answer the same question twice. ",
      "Everything on this page is saved in your browser, on this device only — nothing is ever sent anywhere. ",
      "Whenever a remembered answer is used, the page using it says so and links back here.",
    ]),

    prefCard(
      "📍 Your spot",
      locValue,
      "Press Next on the “Where are you standing?” step and your confirmed spot — or hand-picked region — is remembered here.",
      () => forgetSticky("location")
    ),
    prefCard(
      "☀️ Sun",
      sunValue,
      "Answer the “How much sun does this spot get?” quick pick and it's remembered here. (Sky scans measure one exact spot, so they're never reused.)",
      () => forgetSticky("sun")
    ),
    prefCard(
      "💧 Moisture",
      moistValue,
      "Answer “How wet does this spot stay?” on the soil step and it's remembered here.",
      () => forgetSticky("moisture")
    ),

    el("div", { class: "card" }, [
      el("h3", {}, "⚖️ Plant ranking"),
      el("p", {},
        weightsCustom || filtersActive
          ? "Your “What matters most?” sliders and filters on the plant list are saved as you change them — the list is currently sorted and filtered the way you left it."
          : "Your “What matters most?” sliders and filters on the plant list are saved as you change them. Right now everything is at the defaults."),
      ...(weightsCustom || filtersActive
        ? [el("button", {
            class: "btn btn-secondary",
            onClick: () => {
              store.weights = { ...DEFAULT_WEIGHTS };
              store.filters = { ...NO_FILTERS };
              void persistPrefs();
              renderPreferences(main);
              toast("Sliders and filters reset.");
            },
          }, "Reset to the defaults")]
        : []),
    ]),

    el("p", {}, [
      "Looking for the spots you saved by name? Those live under ",
      el("a", { href: "#/saved" }, "Saved"),
      " — this page only covers the small answers Indigene remembers on its own.",
    ]),

    ...(anythingStored
      ? [el("button", {
          class: "btn btn-secondary",
          onClick: () => {
            forgetAllSticky();
            store.weights = { ...DEFAULT_WEIGHTS };
            store.filters = { ...NO_FILTERS };
            void persistPrefs();
            renderPreferences(main);
            toast("All preferences forgotten.");
          },
        }, "Forget everything on this page")]
      : []),
  );
}
