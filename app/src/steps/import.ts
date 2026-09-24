// The import page (route `#/import`, optionally `?spot=<id>`): the linked
// iNaturalist account's recent plant sightings, sorted against one saved spot's
// region, for the gardener to tick into that spot.
//
// Rules the page keeps (the reasoning is in `lib/inat-import.ts`):
//
//   - Nothing is added until it's ticked, and nothing starts ticked.
//   - Natives are offered at any quality grade; invasives only when other
//     people have confirmed them and they're growing wild. Unconfirmed
//     invasives are listed with a link, never a checkbox.
//   - The spot rides in the hash's query, never its path, so the page count
//     (which drops queries — `lib/analytics.ts`) only ever hears `#/import`.
//
// The sightings themselves are held in memory for this visit and nowhere
// else. Only what the gardener ticks is saved, as the observation's number on
// the row it made.
import { el, clear, toast } from "../ui";
import { navigate } from "../state";
import { listSpots, plantingsForSpot, savePlanting, saveSpot } from "../db";
import { linkedLogin } from "../lib/inat-account";
import {
  fetchOwnSightings,
  plantedBy,
  sortSightings,
  type InvasiveMatch,
  type NativeMatch,
  type OwnSightings,
} from "../lib/inat-import";
import { isBusy } from "../lib/inaturalist";
import { observationUrl } from "../lib/observation-link";
import { loadPlants, regionForSpot } from "../lib/plants";
import { plantingId } from "../lib/garden";
import { hashParam } from "../lib/plant-view";
import { commonName, regionName } from "../lib/names";
import { plantThumb, invasiveThumb } from "../components/plant-thumb";
import { privacyNote } from "../components/privacy-link";
import { t, tn, tx, fmtDate } from "../lib/i18n";
import type { SavedSpot } from "../types";

/** This visit's answer, per username, so choosing another spot doesn't ask
 *  iNaturalist again. Gone on reload; never written anywhere. */
const fetched = new Map<string, OwnSightings>();

export async function renderImport(main: HTMLElement): Promise<void> {
  clear(main);
  document.title = t("import.docTitle");
  main.append(
    el("h2", { class: "step-title" }, t("import.title")),
    el("p", { class: "step-lede" }, t("import.lede")),
  );

  const login = linkedLogin();
  if (!login) {
    main.append(
      el("p", { class: "note info" }, t("import.notLinked")),
      el("a", { class: "btn btn-primary btn-block", href: "#/settings/inat" }, t("import.linkButton")),
    );
    return;
  }

  const spots = await listSpots().catch(() => [] as SavedSpot[]);
  if (!spots.length) {
    main.append(
      el("p", { class: "note info" }, t("import.noSpots")),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("location") }, t("import.findSpot")),
    );
    return;
  }

  const body = el("div");
  main.append(body, privacyNote(t("import.privacy", { login }), undefined, "inat"));

  const wanted = hashParam("spot");
  const start = spots.find((s) => s.id === wanted) ?? (spots.length === 1 ? spots[0] : null);
  if (start) void showSpot(start);
  else pickSpot();

  function pickSpot(): void {
    clear(body);
    body.append(
      el("h3", {}, t("import.whichSpot")),
      el("div", {}, spots.map((s) =>
        el("button", { class: "choice", onClick: () => void showSpot(s) }, [
          el("span", { class: "choice-title" }, s.label),
          el("span", { class: "choice-sub" }, (() => {
            const r = regionForSpot(s);
            return r ? regionName(r.meta) : t("import.noRegion");
          })()),
        ])
      )),
    );
  }

  async function showSpot(spot: SavedSpot): Promise<void> {
    clear(body);
    const head = el("p", { class: "import-spot" }, [
      el("strong", {}, spot.label),
      spots.length > 1
        ? [" · ", el("button", { class: "linklike", onClick: pickSpot }, t("import.changeSpot"))]
        : [],
    ].flat());
    body.append(head);

    const region = regionForSpot(spot);
    if (!region) {
      body.append(el("p", { class: "note info" }, t("import.outsideRegions")));
      return;
    }

    const status = el("p", { class: "note", "aria-live": "polite" }, t("import.asking", { login: login! }));
    body.append(status);
    let result: OwnSightings;
    try {
      result = fetched.get(login!) ?? (await fetchOwnSightings(login!));
      fetched.set(login!, result);
    } catch (err) {
      status.className = "note warn";
      status.textContent = t(isBusy(err) ? "nearby.busy" : "nearby.unreachable");
      return;
    }
    const [roster, plantings] = await Promise.all([
      loadPlants(region),
      plantingsForSpot(spot.id).catch(() => []),
    ]);
    const sorted = sortSightings(result.sightings, region, roster, spot, plantings);
    status.remove();

    const picks = { natives: new Set<NativeMatch>(), invasives: new Set<InvasiveMatch>() };
    const save = el("button", { class: "btn btn-primary btn-block", disabled: true }) as HTMLButtonElement;
    const refresh = (): void => {
      const n = picks.natives.size + picks.invasives.size;
      save.disabled = n === 0;
      save.textContent = n ? tn("import.add", n) : t("import.addNone");
    };
    refresh();

    const total = sorted.natives.length + sorted.invasives.length + sorted.unconfirmed.length;
    if (!total) {
      body.append(el("p", { class: "note" }, t("import.nothing", { region: regionName(region.meta) })));
      return;
    }

    if (sorted.natives.length) {
      body.append(section(t("import.nativesTitle"), t("import.nativesLede"),
        sorted.natives.map((m) => nativeRow(m, region.meta.id, picks.natives, refresh))));
    }
    if (sorted.invasives.length) {
      body.append(section(t("import.invasivesTitle"), t("import.invasivesLede"),
        sorted.invasives.map((m) => invasiveRow(m, picks.invasives, refresh))));
    }
    if (sorted.unconfirmed.length) {
      body.append(section(t("import.waitingTitle"), t("import.waitingLede"),
        sorted.unconfirmed.map((m) => invasiveRow(m, null, refresh))));
    }
    if (result.truncated) body.append(el("p", { class: "note" }, t("import.truncated")));

    save.addEventListener("click", async () => {
      save.disabled = true;
      const now = Date.now();
      for (const m of picks.natives) {
        await savePlanting({
          id: plantingId(),
          spotId: spot.id,
          plantId: m.plant.id,
          count: 1,
          planted: plantedBy(m.sighting),
          observations: [String(m.sighting.id)],
          createdAt: now,
        });
      }
      if (picks.invasives.size) {
        const list = [...(spot.invasives ?? [])];
        for (const m of picks.invasives) {
          list.push({ invasiveId: m.invasive.id, observations: [String(m.sighting.id)], addedAt: now });
        }
        await saveSpot({ ...spot, invasives: list });
      }
      toast(tn("import.added", picks.natives.size + picks.invasives.size));
      location.hash = `#/saved/${encodeURIComponent(spot.id)}`;
    });
    body.append(el("div", { class: "import-save" }, [save]));
  }
}

function section(title: string, lede: string, rows: HTMLElement[]): HTMLElement {
  return el("section", { class: "card" }, [
    el("h3", { style: "margin:0 0 0.3rem" }, title),
    el("p", { class: "obs-section-lede" }, lede),
    el("ul", { class: "log-list" }, rows),
  ]);
}

/** The line under a name: when it was seen, and the sighting itself. */
function seenLine(m: NativeMatch | InvasiveMatch): HTMLElement {
  const s = m.sighting;
  return el("div", { class: "coords" }, [
    s.observedOn ? t("import.seen", { date: fmtDate(Date.parse(`${s.observedOn}T12:00:00`)) }) : t("import.seenUndated"),
    " · ",
    el("a", { href: observationUrl(s.id), target: "_blank", rel: "noopener" }, t("import.onInat")),
  ]);
}

/** A row that can be ticked — or, when `picks` is null or it's already in,
 *  one that just says so. The whole row is the label, so the tap target is
 *  the row, not a 20-pixel box. */
function tickRow<T>(
  thumb: HTMLElement,
  name: string,
  lines: HTMLElement[],
  item: T,
  picks: Set<T> | null,
  already: string | null,
  refresh: () => void,
): HTMLElement {
  const text = el("div", { class: "log-text" }, [el("span", { class: "log-name" }, name), ...lines]);
  if (!picks || already) {
    if (already) text.append(el("div", { class: "coords" }, already));
    return el("li", { class: "log-item" }, [el("div", { class: "log-head" }, [thumb, text])]);
  }
  const box = el("input", {
    type: "checkbox",
    onChange: (e: Event) => {
      if ((e.target as HTMLInputElement).checked) picks.add(item);
      else picks.delete(item);
      refresh();
    },
  });
  return el("li", { class: "log-item" }, [el("label", { class: "log-head import-row" }, [box, thumb, text])]);
}

function nativeRow(m: NativeMatch, regionId: string, picks: Set<NativeMatch>, refresh: () => void): HTMLElement {
  const lines = [seenLine(m)];
  for (const { lookalike } of m.lookalikes) {
    lines.push(el("p", { class: "note warn import-lookalike" }, tx("import.lookalike", {
      name: el("a", { href: `#/lookalikes/${encodeURIComponent(lookalike.id)}` }, commonName(lookalike)),
    })));
  }
  return tickRow(
    plantThumb(m.plant.id, m.plant.form, { regionId }),
    commonName(m.plant),
    lines,
    m,
    picks,
    m.inLog ? t("import.inLog") : null,
    refresh,
  );
}

function invasiveRow(m: InvasiveMatch, picks: Set<InvasiveMatch> | null, refresh: () => void): HTMLElement {
  return tickRow(
    invasiveThumb(m.invasive.id, m.invasive.form),
    commonName(m.invasive),
    [seenLine(m)],
    m,
    picks,
    m.onList ? t("import.onList") : null,
    refresh,
  );
}
