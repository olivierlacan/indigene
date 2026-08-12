// One saved spot, and what has actually gone into it — `#/saved/<id>`.
//
// The rest of the app plans a garden. This page is the garden: a dated list of
// what was planted, how long it has been in, and what it should be doing by now
// (see `lib/garden.ts` for the arithmetic and the honesty rules around it).
//
// It has no address anybody can share, on purpose. `canonicalPath` returns null
// for it, so no file is written and nothing is prerendered — a page listing
// where somebody's garden is and what's in it should not have a link that works
// for a stranger. It lives behind the Saved list, on this device, like the spot
// it belongs to.
import { el, clear, toast } from "../ui";
import { navigate, openSavedSpot } from "../state";
import { getSpot, plantingsForSpot, savePlanting, deletePlanting } from "../db";
import type { Planting, PlantedDate, SavedSpot } from "../types";
import type { Plant } from "../types";
import { REGIONS, loadPlants, regionForSpot } from "../lib/plants";
import { findPlant } from "../lib/explore";
import type { RegionDef } from "../lib/plants";
import {
  growthNote,
  plantedLabel,
  plantingId,
  tally,
  timeInGround,
  today,
} from "../lib/garden";
import { spotValue, type SpotValue } from "../lib/spot-value";
import { scoreList } from "../components/score-list";
import { wildlifeChips } from "../components/wildlife-chips";
import { isUuid, linkedObservation, observationUrl, parseObservationRef } from "../lib/observation-link";
import { observationList } from "../components/observation-ui";
import { statTiles, type Stat } from "../components/stat-card";
import { privacyNote } from "../components/privacy-link";
import { sunPlain } from "../lib/plain";
import { commonName, searchAliases, regionName } from "../lib/names";
import { hashParam } from "../lib/plant-view";
import { t, fmtNumber, monthName } from "../lib/i18n";

/** Rows shown in the plant picker before it stops listing. A search that still
 *  matches forty things hasn't been narrowed yet, and forty tap targets is a
 *  scroll, not a choice. */
const MAX_MATCHES = 8;

export async function renderSpot(main: HTMLElement, param?: string): Promise<void> {
  clear(main);
  const id = param ?? "";
  const spot = await getSpot(id).catch(() => undefined);
  if (!spot) {
    main.append(
      el("h2", { class: "step-title" }, t("spot.notFound")),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("saved") }, t("spot.backToSaved"))
    );
    return;
  }

  document.title = t("spot.docTitle", { label: spot.label });
  const plantings = await plantingsForSpot(spot.id).catch(() => [] as Planting[]);
  const region = regionForSpot(spot);
  const roster = await rosterFor(region);
  const byId = new Map(roster.map((p) => [p.id, p]));
  // A plant logged from another region's list — a spot near a boundary, or a
  // list the reader browsed to — still has to render its own name and size
  // table. Those are looked up by id before anything is drawn, which fetches
  // only the region each one actually belongs to (see `findPlant`), so the rest
  // of the page can stay a plain synchronous lookup.
  const strays = [...new Set(plantings.map((pl) => pl.plantId))].filter((id) => !byId.has(id));
  for (const entries of await Promise.all(strays.map((id) => findPlant(id)))) {
    const first = entries[0];
    if (first) byId.set(first.plant.id, first.plant);
  }
  const plantOf = (plantId: string): Plant | undefined => byId.get(plantId);
  const value = spotValue(plantings, plantOf, region?.meta.id ?? null);

  const redraw = (): void => void renderSpot(main, param);

  main.append(
    el("h2", { class: "step-title" }, spot.label),
    el("p", { class: "step-lede" }, [
      spot.sun ? sunPlain(spot.sun.hours) : t("saved.sunUnknown"),
      region ? ` · ${regionName(region.meta)}` : "",
    ]),
    countsCard(plantings, value),
    ...(value ? [valueCard(value)] : []),
    logCard(plantings, plantOf, redraw),
    addCard(spot, roster, redraw),
    el("button", {
      class: "btn btn-secondary btn-block",
      style: "margin-top:1rem",
      onClick: () => openSavedSpot(spot),
    }, t("spot.seePlants")),
    privacyNote(t("spot.privacy"), undefined, "log")
  );
}

// --- the tally -------------------------------------------------------------

/**
 * How the spot is doing, as four numbers rather than a sentence about them.
 *
 * The last two are the ones that aren't bookkeeping: how many of the kinds
 * planted here raise caterpillars — the food-web measure the whole app ranks on
 * — and how many named animals the planting is documented to support. A garden
 * can hold twenty plants and feed nothing much; these say whether yours does.
 */
function countsCard(plantings: Planting[], value: SpotValue | null): HTMLElement {
  const counts = tally(plantings);
  const stats: Stat[] = [
    {
      icon: "🌱",
      label: t("spot.tilePlants"),
      value: fmtNumber(counts.plants),
      explain: t("spot.tilePlantsExplain"),
    },
    {
      icon: "🎨",
      label: t("spot.tileKinds"),
      value: fmtNumber(counts.kinds),
      explain: t("spot.tileKindsExplain"),
    },
    {
      icon: "🐛",
      label: t("spot.tileHosts"),
      value: fmtNumber(value?.hostKinds ?? 0),
      explain: t("spot.tileHostsExplain"),
    },
  ];
  if (value?.wildlife.length) {
    stats.push({
      icon: "🦋",
      label: t("spot.tileWildlife"),
      value: fmtNumber(value.wildlife.length),
      explain: t("spot.tileWildlifeExplain"),
    });
  }
  return el("section", { class: "card" }, [statTiles(stats, t("spot.tilesLabel"))]);
}

// --- what it gives back ----------------------------------------------------

/** Animals shown before the row folds. A long log can document forty, and forty
 *  chips is a scroll rather than a picture. */
const WILDLIFE_SHOWN = 12;

/**
 * The service this planting provides, as far as the catalog can say: the seven
 * ecosystem benefits averaged across what's in the ground, and the animals
 * those plants are documented to support.
 *
 * The bars are ordered by this spot's own values rather than the app's usual
 * fixed order, so the top row answers "what is this corner *for*" without a
 * sentence saying it. That's the one place the order differs from a plant's
 * page, and it's deliberate: a plant's rows are read against other plants, a
 * garden's are read against each other.
 *
 * The caveat under the heading is not boilerplate. These are the plants'
 * measured values somewhere else, averaged — not a reading of this garden — and
 * a documented tie means an animal *can* use the plant, not that it has found
 * yours. Saying so once, plainly, is what earns the rest of the card.
 */
function valueCard(value: SpotValue): HTMLElement {
  const rows = [...value.services].sort((a, b) => b.value - a.value);
  const body: (HTMLElement | string)[] = [
    el("h3", { style: "margin:0 0 0.3rem" }, t("spot.valueTitle")),
    el("p", { class: "note" }, t("spot.valueNote")),
    scoreList(rows, "spot-score"),
  ];
  if (value.wildlife.length) {
    body.push(
      el("p", { class: "kv", style: "margin:0.9rem 0 0.4rem" }, [
        el("span", { class: "k" }, t("spot.valueFeeds")),
      ])
    );
    const shown = value.wildlife.slice(0, WILDLIFE_SHOWN);
    const rest = value.wildlife.slice(WILDLIFE_SHOWN);
    const chips = wildlifeChips(shown);
    body.push(chips);
    if (rest.length) {
      const more = el("button", {
        class: "btn btn-ghost btn-compact",
        onClick: () => {
          chips.append(...Array.from(wildlifeChips(rest).children));
          more.remove();
        },
      }, t("spot.valueMore", { n: fmtNumber(rest.length) }));
      body.push(more);
    }
  }
  return el("section", { class: "card" }, body);
}

// --- the log ---------------------------------------------------------------

function logCard(
  plantings: Planting[],
  plantOf: (id: string) => Plant | undefined,
  redraw: () => void
): HTMLElement {
  const body: (HTMLElement | string)[] = [el("h3", { style: "margin:0 0 0.5rem" }, t("spot.logTitle"))];
  if (!plantings.length) {
    body.push(el("p", { class: "note" }, t("spot.logEmpty")));
  } else {
    body.push(el("ul", { class: "log-list" }, plantings.map((p) => logRow(p, plantOf(p.plantId), redraw))));
  }
  return el("section", { class: "card" }, body);
}

function logRow(
  planting: Planting,
  plant: Plant | undefined,
  redraw: () => void
): HTMLElement {
  const name = plant ? commonName(plant) : planting.plantId;
  const growth = plant ? growthNote(plant.size, planting.planted) : null;

  const when = planting.planted
    ? `${plantedLabel(planting.planted)} · ${timeInGround(planting.planted)}`
    : t("spot.whenUnknown");

  const head = el("div", { class: "log-head" }, [
    el("div", {}, [
      plant
        ? el("a", { class: "log-name", href: `#/plants/${encodeURIComponent(plant.id)}` }, name)
        : el("span", { class: "log-name" }, name),
      planting.count > 1 ? el("span", { class: "log-count" }, `×${fmtNumber(planting.count)}`) : null,
      el("div", { class: "coords" }, when),
    ]),
    el("button", {
      class: "btn btn-ghost log-remove",
      "aria-label": t("spot.removeLabel", { name }),
      onClick: async () => {
        if (!confirm(t("spot.confirmRemove", { name }))) return;
        await deletePlanting(planting.id);
        toast(t("spot.removed"));
        redraw();
      },
    }, "🗑"),
  ]);

  const row = el("li", { class: "log-item" }, [head]);
  if (growth) row.append(el("p", { class: "log-growth" }, growth));
  row.append(sightingsBlock(planting, name, redraw));
  return row;
}

// --- linked sightings ------------------------------------------------------

/**
 * The photos, and the field that adds one.
 *
 * Each linked observation is fetched and drawn with the same gallery, lightbox
 * and credit every other iNaturalist photo in the app gets — the gardener's own
 * sighting is somebody's licensed work too, even when that somebody is them.
 */
function sightingsBlock(planting: Planting, name: string, redraw: () => void): HTMLElement {
  const block = el("div", { class: "log-sightings" });
  const gallery = el("div", { "aria-live": "polite" });
  block.append(gallery);

  // The numbers of the sightings that came back, so a second link to one the
  // gardener already has — pasted the other way round, a UUID where a number
  // went in — is recognised as the same sighting rather than added twice.
  const resolved = new Set<string>();

  if (planting.observations.length) {
    // Kept as pairs: a reference resolves to a summary or to nothing, and the
    // ones that resolved to nothing still need their own reference to link out.
    void Promise.all(
      planting.observations.map((ref) =>
        linkedObservation(ref)
          .catch(() => null)
          .then((observation) => ({ ref, observation }))
      )
    ).then((rows) => {
      const shown = rows.map((r) => r.observation).filter((o): o is NonNullable<typeof o> => Boolean(o));
      shown.forEach((o) => resolved.add(String(o.id)));
      clear(gallery);
      if (shown.length) gallery.append(observationList(shown, name));
      // A reference that answered with nothing showable still keeps its link:
      // the observation may be photo-less, licensed all-rights-reserved, or
      // just unreachable right now, and dropping the gardener's own record of
      // it would be worse than a plain link out.
      const missing = rows.filter((r) => !r.observation).map((r) => r.ref);
      if (missing.length) {
        gallery.append(
          el("p", { class: "coords" }, [
            t("spot.obsPlainLink"),
            " ",
            ...missing.map((ref) =>
              el(
                "a",
                { href: observationUrl(ref), target: "_blank", rel: "noopener" },
                // A UUID is 36 characters of hex nobody reads; its first block
                // is enough to tell two of them apart in a list of links.
                `${isUuid(ref) ? ref.slice(0, 8) : `#${ref}`} `
              )
            ),
          ])
        );
      }
    });
  }

  // Text, not `type="url"`: two of the three things this accepts — a bare
  // number, a bare UUID — are not URLs, and a `url` field refuses to submit a
  // value the browser doesn't consider one. The field would simply have sat
  // there doing nothing for anyone who used the copy button.
  const input = el("input", {
    type: "text",
    class: "log-obs-input",
    inputmode: "url",
    autocomplete: "off",
    autocapitalize: "off",
    spellcheck: "false",
    placeholder: t("spot.obsPlaceholder"),
    "aria-label": t("spot.obsLabel"),
  }) as HTMLInputElement;

  const form = el("form", {
    class: "log-obs-form",
    hidden: true,
    onSubmit: async (e: Event) => {
      e.preventDefault();
      const ref = parseObservationRef(input.value);
      if (!ref) {
        toast(t("spot.obsBad"));
        return;
      }
      if (planting.observations.includes(ref) || resolved.has(ref)) {
        toast(t("spot.obsAlready"));
        return;
      }
      await savePlanting({ ...planting, observations: [...planting.observations, ref] });
      toast(t("spot.obsAdded"));
      redraw();
    },
  }, [
    el("div", { class: "log-obs-row" }, [
      input,
      el("button", { class: "btn btn-secondary btn-compact", type: "submit" }, t("spot.obsAdd")),
    ]),
    el("p", { class: "hint" }, t("spot.obsHelp")),
  ]) as HTMLFormElement;

  const toggle = el("button", {
    class: "btn btn-ghost btn-compact log-obs-toggle",
    onClick: () => {
      form.hidden = !form.hidden;
      if (!form.hidden) input.focus();
    },
  }, t("spot.obsLink"));

  block.append(toggle, form);
  return block;
}

// --- adding ----------------------------------------------------------------

/**
 * "I planted one of these." A plant, a date to whatever precision is honest,
 * and how many.
 *
 * The picker searches the spot's own region roster, because that is the list
 * this spot's plants come from — and `?add=<slug>` opens it with the plant
 * already chosen, which is how the button on a plant's page hands over (see
 * `components/planted-control.ts`).
 */
function addCard(spot: SavedSpot, roster: Plant[], redraw: () => void): HTMLElement {
  let chosen: Plant | undefined = roster.find((p) => p.id === hashParam("add"));

  const picked = el("div", { class: "log-picked" });
  const results = el("div", { "aria-live": "polite" });
  const form = el("form", { hidden: true });

  const search = el("input", {
    type: "search",
    id: "log-plant-q",
    autocomplete: "off",
    placeholder: t("spot.searchPlaceholder"),
    onInput: () => showMatches(),
  }) as HTMLInputElement;

  function showMatches(): void {
    clear(results);
    const q = norm(search.value);
    if (q.length < 2) return;
    const matches = roster
      .filter((p) => searchAliases(p).some((a) => norm(a).includes(q)))
      .slice(0, MAX_MATCHES);
    if (!matches.length) {
      results.append(el("p", { class: "note warn" }, t("spot.searchNone")));
      return;
    }
    results.append(
      ...matches.map((p) =>
        el("button", {
          type: "button",
          class: "choice",
          onClick: () => choose(p),
        }, [
          el("span", { class: "choice-title" }, commonName(p)),
          el("span", { class: "choice-sub" }, p.latin),
        ])
      )
    );
  }

  function choose(p: Plant): void {
    chosen = p;
    search.value = "";
    clear(results);
    clear(picked);
    picked.append(
      el("p", { class: "log-picked-name" }, [
        el("strong", {}, commonName(p)),
        " ",
        el("button", {
          type: "button",
          class: "btn btn-ghost btn-compact",
          onClick: () => {
            chosen = undefined;
            clear(picked);
            form.hidden = true;
            search.focus();
          },
        }, t("spot.changePlant")),
      ])
    );
    form.hidden = false;
  }

  // The date, given to whatever precision the person actually has. Month and day
  // both offer "not sure" and the year stands alone, because most people know
  // the season they planted something and not the date — and a date field that
  // demands a day gets a made-up day (see `PlantedDate` in `types.ts`).
  const now = today();
  const year = el("input", {
    type: "number",
    id: "log-year",
    class: "log-year",
    inputmode: "numeric",
    min: "1900",
    max: String(now.year + 1),
    value: String(now.year),
  }) as HTMLInputElement;

  const month = el("select", { id: "log-month", onChange: () => syncDays() }, [
    el("option", { value: "" }, t("spot.notSure")),
    ...Array.from({ length: 12 }, (_, i) =>
      el("option", { value: String(i + 1), selected: i + 1 === now.month }, monthName(i + 1))
    ),
  ]) as HTMLSelectElement;

  const day = el("select", { id: "log-day" }, [
    el("option", { value: "" }, t("spot.notSure")),
    ...Array.from({ length: 31 }, (_, i) =>
      el("option", { value: String(i + 1), selected: i + 1 === now.day }, fmtNumber(i + 1))
    ),
  ]) as HTMLSelectElement;

  /** A day with no month is a date nobody can read, so the day field follows
   *  the month's lead rather than offering an answer that means nothing. */
  function syncDays(): void {
    day.disabled = !month.value;
    if (!month.value) day.value = "";
  }

  const count = el("input", {
    type: "number",
    id: "log-count",
    class: "log-count-input",
    inputmode: "numeric",
    min: "1",
    max: "999",
    value: "1",
  }) as HTMLInputElement;

  form.append(
    el("div", { class: "field" }, [
      el("label", { for: "log-year" }, t("spot.whenLabel")),
      el("div", { class: "log-date-row" }, [
        el("span", { class: "log-date-field" }, [el("span", { class: "hint" }, t("spot.year")), year]),
        el("span", { class: "log-date-field" }, [el("span", { class: "hint" }, t("spot.month")), month]),
        el("span", { class: "log-date-field" }, [el("span", { class: "hint" }, t("spot.day")), day]),
      ]),
    ]),
    el("div", { class: "field field-inline" }, [
      el("label", { for: "log-count" }, t("spot.howMany")),
      count,
    ]),
    el("button", { class: "btn btn-primary btn-block", type: "submit" }, t("spot.addButton"))
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pick = chosen;
    if (!pick) return;
    const y = Number(year.value);
    const planted: PlantedDate | null = Number.isFinite(y) && y > 1000
      ? {
          year: y,
          ...(month.value ? { month: Number(month.value) } : {}),
          ...(month.value && day.value ? { day: Number(day.value) } : {}),
        }
      : null;
    await savePlanting({
      id: plantingId(),
      spotId: spot.id,
      plantId: pick.id,
      count: Math.max(1, Math.min(999, Number(count.value) || 1)),
      planted,
      observations: [],
      createdAt: Date.now(),
    });
    toast(t("spot.added", { name: commonName(pick) }));
    // The query that pre-chose a plant has been acted on; leaving it in the
    // address would re-choose it every time this page is redrawn.
    if (hashParam("add")) location.hash = `#/saved/${encodeURIComponent(spot.id)}`;
    else redraw();
  });

  syncDays();
  if (chosen) choose(chosen);

  return el("section", { class: "card" }, [
    el("h3", { style: "margin:0 0 0.5rem" }, t("spot.addTitle")),
    el("div", { class: "field" }, [
      el("label", { for: "log-plant-q" }, t("spot.searchLabel")),
      search,
    ]),
    results,
    picked,
    form,
  ]);
}

// --- plumbing --------------------------------------------------------------

/** Fold case and strip accents, so "cerisier tardif" finds "Cerisier tardif"
 *  and an unaccented typing of it finds it too. */
function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

async function rosterFor(region: RegionDef | null): Promise<Plant[]> {
  if (region) return loadPlants(region);
  return [...(await everyPlant()).values()];
}

// The fallback for a spot with no region of its own, and for a planting logged
// from a list the reader browsed to. It wants every region — rare, and only on
// a page about a garden somebody has already described.
let _all: Promise<Map<string, Plant>> | null = null;
function everyPlant(): Promise<Map<string, Plant>> {
  _all ??= Promise.all(REGIONS.map((r) => loadPlants(r))).then((lists) => {
    const all = new Map<string, Plant>();
    for (const list of lists) for (const p of list) all.set(p.id, p);
    return all;
  });
  return _all;
}
