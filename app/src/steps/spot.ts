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
import { getSpot, plantingsForSpot, savePlanting, saveSpot, deletePlanting } from "../db";
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
import { wildlifeGroups } from "../components/wildlife-chips";
import { isUuid, linkedObservation, observationUrl, parseObservationRef } from "../lib/observation-link";
import { observationList, photoTile } from "../components/observation-ui";
import { ownSightings, sightingsOfPlant, type OwnSighting } from "../lib/inat-import";
import { isBusy } from "../lib/inaturalist";
import { plantThumb, invasiveThumb } from "../components/plant-thumb";
import { statTiles, type Stat } from "../components/stat-card";
import { privacyNote } from "../components/privacy-link";
import { sunPlain } from "../lib/plain";
import { commonName, searchAliases, regionName } from "../lib/names";
import { hashParam } from "../lib/plant-view";
import { t, fmtDate, fmtNumber, monthName } from "../lib/i18n";
import { linkedLogin } from "../lib/inat-account";
import { getInvasive } from "../lib/invasives";

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
    // Fixing the spot itself: a better name, or a pin that landed next door.
    el("p", { class: "spot-edit" }, [
      el("button", {
        class: "linklike",
        onClick: async () => {
          const label = prompt(t("spot.renamePrompt"), spot.label)?.trim();
          if (!label || label === spot.label) return;
          await saveSpot({ ...spot, label });
          toast(t("spot.renamed"));
          redraw();
        },
      }, `✏️ ${t("spot.rename")}`),
      " · ",
      el("a", { href: `#/location?move=${encodeURIComponent(spot.id)}` }, `📍 ${t("spot.move")}`),
    ]),
    countsCard(plantings, value),
    ...(value?.wildlife.length ? [feedsCard(value)] : []),
    logCard(plantings, plantOf, redraw, region?.meta.id),
    ...(spot.invasives?.length ? [invasivesCard(spot, redraw)] : []),
    addCard(spot, roster, redraw),
    // Only once an account is linked: without one the page it opens can only
    // send you to Settings, and Settings is where linking is offered.
    ...(linkedLogin()
      ? [el("a", {
          class: "btn btn-secondary btn-block",
          style: "margin-top:1rem",
          // The spot goes in the query, which the page count drops.
          href: `#/import?spot=${encodeURIComponent(spot.id)}`,
        }, t("spot.importLink"))]
      : []),
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
  // `figures`: every value here is a bare count, so the count is what should
  // carry the tile (see `TileOptions`).
  return el("section", { class: "card" }, [
    statTiles(stats, t("spot.tilesLabel"), { figures: true }),
  ]);
}

// --- who it can feed -------------------------------------------------------

/**
 * The named animals this planting can feed — the one thing a garden's plants
 * add up to that we can say without inventing a figure.
 *
 * Deliberately not a score. Each plant carries seven eco-values, and averaging
 * them across a log would produce a confident-looking number built out of
 * estimates that were never meant to be added together — a garden's "77 for
 * pollinators" reads as a measurement of the garden, which is not something we
 * have. A list of ties is what the data actually holds: this plant, this
 * animal, one cited source each.
 *
 * Shown by group rather than as one long column of names, because a dozen
 * plants can document forty animals and forty names is a wall (see
 * `wildlifeGroups`). The line under the heading keeps the whole thing honest:
 * a documented tie means the animal *can* use the plant, not that it has found
 * yours.
 */
function feedsCard(value: SpotValue): HTMLElement {
  return el("section", { class: "card" }, [
    el("h3", { style: "margin:0 0 0.3rem" }, t("spot.feedsTitle")),
    el("p", { class: "note" }, t("spot.feedsNote")),
    wildlifeGroups(value.wildlife, "spot-feeds"),
  ]);
}

// --- the log ---------------------------------------------------------------

function logCard(
  plantings: Planting[],
  plantOf: (id: string) => Plant | undefined,
  redraw: () => void,
  regionId?: string
): HTMLElement {
  const body: (HTMLElement | string)[] = [el("h3", { style: "margin:0 0 0.5rem" }, t("spot.logTitle"))];
  if (!plantings.length) {
    body.push(el("p", { class: "note" }, t("spot.logEmpty")));
  } else {
    body.push(el("ul", { class: "log-list" }, plantings.map((p) => logRow(p, plantOf(p.plantId), redraw, regionId))));
  }
  return el("section", { class: "card" }, body);
}

function logRow(
  planting: Planting,
  plant: Plant | undefined,
  redraw: () => void,
  regionId?: string
): HTMLElement {
  const name = plant ? commonName(plant) : planting.plantId;
  const growth = plant ? growthNote(plant.size, planting.planted) : null;

  const when = planting.planted
    ? `${plantedLabel(planting.planted)} · ${timeInGround(planting.planted)}`
    : t("spot.whenUnknown");

  // The plant's own picture, as every other list of plants in the app shows it
  // — the photograph over its drawing, the drawing alone until somebody has
  // chosen one. A log read standing in the garden is matching rows to things
  // growing in front of you, which is the one job a name in a list can't do.
  //
  // The size line joins the name beside it rather than starting a row of its
  // own under the picture: those three lines are one description of one plant.
  // The sightings below stay full width, because their thumbnails need it.
  const head = el("div", { class: "log-head" }, [
    plant ? plantThumb(plant.id, plant.form, { regionId }) : null,
    el("div", { class: "log-text" }, [
      plant
        ? el("a", { class: "log-name", href: `#/plants/${encodeURIComponent(plant.id)}` }, name)
        : el("span", { class: "log-name" }, name),
      planting.count > 1 ? el("span", { class: "log-count" }, `×${fmtNumber(planting.count)}`) : null,
      el("div", { class: "coords" }, when),
      growth ? el("p", { class: "log-growth" }, growth) : null,
    ]),
    el("div", { class: "log-actions" }, [
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
      el("button", {
        class: "btn btn-ghost log-remove",
        "aria-label": t("spot.editLabel", { name }),
        "aria-expanded": "false",
        onClick: (e: Event) => {
          edit.hidden = !edit.hidden;
          (e.currentTarget as HTMLElement).setAttribute("aria-expanded", String(!edit.hidden));
        },
      }, "✏️"),
    ]),
  ]);

  // Fixing a wrong date or count in place, rather than deleting the row and
  // losing the sightings linked to it.
  const fields = plantingFields(`log-${planting.id}`, planting.planted, planting.count);
  const edit = el("form", {
    class: "log-edit",
    hidden: true,
    onSubmit: async (e: Event) => {
      e.preventDefault();
      await savePlanting({ ...planting, planted: fields.planted(), count: fields.count() });
      toast(t("spot.edited"));
      redraw();
    },
  }, [
    ...fields.nodes,
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", type: "submit" }, t("spot.editSave")),
      el("button", { class: "btn btn-ghost", type: "button", onClick: () => { edit.hidden = true; } }, t("spot.editCancel")),
    ]),
  ]) as HTMLFormElement;

  const row = el("li", { class: "log-item" }, [head, edit]);
  row.append(sightingsBlock(planting, name, redraw));
  return row;
}

// --- invasives to deal with -------------------------------------------------

/**
 * The invasives the gardener found here, from their own confirmed sightings
 * (`steps/import.ts`). Each row opens the invasive's own page, which says how
 * to remove it — the depth lives there, not in this card.
 */
function invasivesCard(spot: SavedSpot, redraw: () => void): HTMLElement {
  const rows = (spot.invasives ?? []).flatMap((entry) => {
    const inv = getInvasive(entry.invasiveId);
    if (!inv) return [];
    const name = commonName(inv);
    const ref = entry.observations[0];
    return [el("li", { class: "log-item" }, [
      el("div", { class: "log-head" }, [
        invasiveThumb(inv.id, inv.form),
        el("div", { class: "log-text" }, [
          el("a", { class: "log-name", href: `#/invasives/${encodeURIComponent(inv.id)}` }, name),
          ref
            ? el("div", { class: "coords" }, [
                el("a", { href: observationUrl(ref), target: "_blank", rel: "noopener" }, t("import.onInat")),
              ])
            : null,
        ]),
        el("button", {
          class: "btn btn-ghost log-remove",
          "aria-label": t("spot.invasiveRemoveLabel", { name }),
          onClick: async () => {
            if (!confirm(t("spot.confirmInvasiveRemove", { name }))) return;
            const invasives = (spot.invasives ?? []).filter((i) => i !== entry);
            await saveSpot({ ...spot, invasives });
            toast(t("spot.invasiveRemoved"));
            redraw();
          },
        }, "🗑"),
      ]),
    ])];
  });
  return el("section", { class: "card" }, [
    el("h3", { style: "margin:0 0 0.5rem" }, t("spot.invasivesTitle")),
    el("ul", { class: "log-list" }, rows),
  ]);
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
      //
      // It says "Sighting" rather than "#373658728", because the number is the
      // one thing about it nobody reads — and a row that has one should be
      // legible as *having a sighting* at a glance, next to rows that don't.
      // The reference itself stays in the link's title, for anyone who wants it.
      const missing = rows.filter((r) => !r.observation).map((r) => r.ref);
      if (missing.length) {
        gallery.append(
          el("p", { class: "log-obs-refs" }, missing.map((ref) =>
            el("a", {
              class: "log-obs-ref",
              href: observationUrl(ref),
              target: "_blank",
              rel: "noopener",
              // A UUID is 36 characters of hex; its first block is enough to
              // tell two of them apart.
              title: isUuid(ref) ? ref.slice(0, 8) : `#${ref}`,
            }, [
              el("span", { "aria-hidden": "true" }, "🖼️"),
              t("spot.obsSighting"),
            ])
          ))
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

  const link = async (ref: string): Promise<void> => {
    if (planting.observations.includes(ref) || resolved.has(ref)) {
      toast(t("spot.obsAlready"));
      return;
    }
    await savePlanting({ ...planting, observations: [...planting.observations, ref] });
    toast(t("spot.obsAdded"));
    redraw();
  };

  // The linked account's own sightings of this plant, to tap rather than
  // paste — asked for once, the first time the form opens.
  const picker = el("div", { class: "log-obs-picker", "aria-live": "polite" });
  let asked = false;

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
      await link(ref);
    },
  }, [
    picker,
    el("div", { class: "log-obs-row" }, [
      input,
      el("button", { class: "btn btn-secondary btn-compact", type: "submit" }, t("spot.obsAdd")),
    ]),
    el("p", { class: "hint" }, t("spot.obsHelp")),
  ]) as HTMLFormElement;

  // "Add sighting" once there is one, because the long form is an explanation
  // — what a sighting is here, and that it lives on iNaturalist — and somebody
  // who has already linked one has had that explained.
  const toggle = el("button", {
    class: "btn btn-ghost btn-compact log-obs-toggle",
    onClick: () => {
      form.hidden = !form.hidden;
      if (form.hidden) return;
      if (!asked) {
        asked = true;
        void fillPicker(picker, planting, name, link);
      }
      // With a linked account the picker is the way in; the field is the
      // fallback, and a keyboard popping up over the photos would hide them.
      if (!linkedLogin()) input.focus();
    },
  }, t(planting.observations.length ? "spot.obsLinkMore" : "spot.obsLink"));

  block.append(toggle, form);
  return block;
}

/** Tiles offered before the picker stops: four rows on a phone. The newest
 *  come first, and anything older can still be pasted. */
const MAX_PICKS = 12;

/** The linked account's sightings of this planting's plant, each a tile that
 *  links it on tap — or, with no account linked, the way to link one. */
async function fillPicker(
  picker: HTMLElement,
  planting: Planting,
  name: string,
  link: (ref: string) => Promise<void>
): Promise<void> {
  const login = linkedLogin();
  if (!login) {
    picker.append(el("p", { class: "hint" }, [
      el("a", { href: "#/settings/inat" }, t("spot.obsPickSetup")),
    ]));
    return;
  }
  const status = el("p", { class: "hint" }, t("import.asking", { login }));
  picker.append(status);
  let picks: OwnSighting[];
  try {
    const { sightings } = await ownSightings(login);
    picks = sightingsOfPlant(sightings, planting.plantId, planting.observations);
  } catch (err) {
    status.textContent = t(isBusy(err) ? "nearby.busy" : "nearby.unreachable");
    return;
  }
  clear(picker);
  if (!picks.length) {
    picker.append(el("p", { class: "hint" }, t("spot.obsPickNone")));
    return;
  }
  picker.append(
    el("p", { class: "log-obs-pick-title" }, t("spot.obsPickTitle")),
    el("div", { class: "obs-gallery" }, picks.slice(0, MAX_PICKS).map((s) => {
      const date = s.observedOn ? fmtDate(Date.parse(`${s.observedOn}T12:00:00`)) : t("import.seenUndated");
      return el("button", {
        type: "button",
        class: "log-obs-pick",
        "aria-label": t("spot.obsPickLabel", { date }),
        onClick: (e: Event) => {
          (e.currentTarget as HTMLButtonElement).disabled = true;
          void link(String(s.id));
        },
      }, [
        el("span", { class: "obs-tile" }, [
          s.photo
            ? photoTile(s.photo.thumbUrl, t("obs.photoAlt", { name, observer: login }))
            : el("span", { class: "log-obs-pick-blank", "aria-hidden": "true" }, "🖼️"),
        ]),
        el("span", { class: "log-obs-pick-date", "aria-hidden": "true" }, date),
      ]);
    })),
    el("p", { class: "hint" }, t("spot.obsPickOr")),
  );
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

  const fields = plantingFields("log", { year: today().year, month: today().month, day: today().day }, 1);
  form.append(
    ...fields.nodes,
    el("button", { class: "btn btn-primary btn-block", type: "submit" }, t("spot.addButton"))
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pick = chosen;
    if (!pick) return;
    await savePlanting({
      id: plantingId(),
      spotId: spot.id,
      plantId: pick.id,
      count: fields.count(),
      planted: fields.planted(),
      observations: [],
      createdAt: Date.now(),
    });
    toast(t("spot.added", { name: commonName(pick) }));
    // The query that pre-chose a plant has been acted on; leaving it in the
    // address would re-choose it every time this page is redrawn.
    if (hashParam("add")) location.hash = `#/saved/${encodeURIComponent(spot.id)}`;
    else redraw();
  });

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

/**
 * The date and count fields, shared by the add form and a row's edit form.
 * `prefix` keeps the ids unique when several are on the page.
 *
 * The date is given to whatever precision the person actually has. Month and
 * day both offer "not sure" and the year stands alone, because most people know
 * the season they planted something and not the date — and a date field that
 * demands a day gets a made-up day (see `PlantedDate` in `types.ts`).
 */
function plantingFields(
  prefix: string,
  initial: PlantedDate | null,
  initialCount: number
): { nodes: HTMLElement[]; planted: () => PlantedDate | null; count: () => number } {
  const now = today();
  const year = el("input", {
    type: "number",
    id: `${prefix}-year`,
    class: "log-year",
    inputmode: "numeric",
    min: "1900",
    max: String(now.year + 1),
    value: initial ? String(initial.year) : "",
  }) as HTMLInputElement;

  const month = el("select", { id: `${prefix}-month`, onChange: () => syncDays() }, [
    el("option", { value: "" }, t("spot.notSure")),
    ...Array.from({ length: 12 }, (_, i) =>
      el("option", { value: String(i + 1), selected: i + 1 === initial?.month }, monthName(i + 1))
    ),
  ]) as HTMLSelectElement;

  const day = el("select", { id: `${prefix}-day` }, [
    el("option", { value: "" }, t("spot.notSure")),
    ...Array.from({ length: 31 }, (_, i) =>
      el("option", { value: String(i + 1), selected: i + 1 === initial?.day }, fmtNumber(i + 1))
    ),
  ]) as HTMLSelectElement;

  /** A day with no month is a date nobody can read, so the day field follows
   *  the month's lead rather than offering an answer that means nothing. */
  function syncDays(): void {
    day.disabled = !month.value;
    if (!month.value) day.value = "";
  }
  syncDays();

  const count = el("input", {
    type: "number",
    id: `${prefix}-count`,
    class: "log-count-input",
    inputmode: "numeric",
    min: "1",
    max: "999",
    value: String(initialCount),
  }) as HTMLInputElement;

  return {
    nodes: [
      el("div", { class: "field" }, [
        el("label", { for: `${prefix}-year` }, t("spot.whenLabel")),
        el("div", { class: "log-date-row" }, [
          el("span", { class: "log-date-field" }, [el("span", { class: "hint" }, t("spot.year")), year]),
          el("span", { class: "log-date-field" }, [el("span", { class: "hint" }, t("spot.month")), month]),
          el("span", { class: "log-date-field" }, [el("span", { class: "hint" }, t("spot.day")), day]),
        ]),
      ]),
      el("div", { class: "field field-inline" }, [
        el("label", { for: `${prefix}-count` }, t("spot.howMany")),
        count,
      ]),
    ],
    planted: () => {
      const y = Number(year.value);
      return Number.isFinite(y) && y > 1000
        ? {
            year: y,
            ...(month.value ? { month: Number(month.value) } : {}),
            ...(month.value && day.value ? { day: Number(day.value) } : {}),
          }
        : null;
    },
    count: () => Math.max(1, Math.min(999, Number(count.value) || 1)),
  };
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
