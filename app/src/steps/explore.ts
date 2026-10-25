// The region-first entrance. Where the main flow says "stand in a spot, get
// plants", this page says "here are the places Indigene knows — pick yours".
//
// It used to lead with a plant per region and a paragraph about it, which put
// the reader in front of five blurbs before they'd seen the one thing they
// actually have to choose: where they are. Now each card *is* a region — its
// name, what its roster adds up to, and one native starring on the front of it,
// named but not explained. The explaining is the plant page's job, and it's one
// tap away.
import { el, clear } from "../ui";
import { navigate, resetDraft, store } from "../state";
import { REGIONS } from "../lib/plants";
import { regionsForCoords } from "../data/regions";
import type { RegionDef } from "../lib/plants";
import { featuredSummary } from "../lib/explore";
import { keystoneCountForRegion, plantCountForRegion, totalPlantRows } from "../lib/registry";
import { wildlifeCountForRegion } from "../lib/wildlife";
import { plantThumb } from "../components/plant-thumb";
import { keystoneIcon } from "../components/keystone-icon";
import { cardStats } from "../components/card-stats";
import { t, tn, tx, fmtNumber } from "../lib/i18n";
import { ISSUES_URL } from "../lib/plain";
import { nameLines, regionName, regionReference } from "../lib/names";
import { flagRow } from "../components/flags";
import { allGrowth } from "../components/growth-chart";
import { gpsButton } from "../components/location-prompt";
import { privacyRoute } from "../components/privacy-link";
import { searchPlaces, placeLabel } from "../lib/geocode";
import { areasMatching, fold, markFolded, regionSearch } from "../lib/region-search";

export function renderExplore(main: HTMLElement): void {
  clear(main);
  document.title = t("explore.docTitle");

  const totalPlants = totalPlantRows();
  const cards = REGIONS.map(regionCard);

  main.append(
    el("h2", { class: "step-title" }, t("explore.title")),
    el("p", { class: "step-lede" }, [
      t("explore.lede", { plants: fmtNumber(totalPlants), regions: fmtNumber(REGIONS.length) }),
      " ",
      // The finder below can send a place name or a GPS fix out, so the
      // promise about what that means sits on the same line as everywhere else.
      el("a", { class: "lede-privacy", href: privacyRoute("lookups") }, [
        el("span", { "aria-hidden": "true" }, "🔒 "),
        t("prompt.privacyLink"),
      ]),
    ]),
    regionFinder(cards),
    el("div", { class: "card-grid" }, cards.map((c) => c.node)),
    // Where they all are lives on its own page; this one is the list.
    el("p", { class: "more-link", style: "margin:0.8rem 0 0" }, [
      el("a", { href: "#/map" }, t("explore.onMap")),
    ]),
    // The map grows one region at a time, by request.
    el("p", { class: "more-link", style: "margin:0.4rem 0 0" }, tx("explore.missing", {
      link: el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("location.coverageAsk")),
    })),
    // Deliberately *after* the regions: browsing by animal is a fine way in,
    // but it's the second question. Offering it first asked the reader to
    // choose between two doors before they'd seen what was behind either.
    el("a", {
      href: "#/wildlife",
      class: "card",
      style: "display:flex;gap:0.6rem;align-items:center;text-decoration:none;color:inherit;margin:1.1rem 0 0",
    }, [
      el("span", { "aria-hidden": "true", style: "font-size:1.5rem;line-height:1" }, "🦋"),
      el("span", {}, [
        el("span", { style: "font-weight:700" }, t("explore.byWildlife")),
        el("span", { style: "color:var(--ink-soft)" }, t("explore.byWildlifeSub")),
      ]),
    ]),
    // How the map filled in, one merge at a time.
    ...allGrowth(),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("browse.startFromSpot")),
    ])
  );
}

interface RegionCard {
  region: RegionDef;
  node: HTMLElement;
  hay: string;
  /** Underline what `fq` (folded) hits, and name any state it hit that the card
   *  doesn't show ("" clears both). */
  mark(fq: string): void;
}

/**
 * One field and one button above the grid, for the three ways a reader knows
 * where they are. A **name** (Illinois, France, Grenoble) narrows the grid as
 * they type. A **postal code or town** the cards don't name is looked up on
 * Enter, and **My location** asks the device; either one narrows the grid to
 * the regions that place falls in, and offers the spot walk from that point,
 * since a spot answers better than any region can.
 */
function regionFinder(cards: RegionCard[]): HTMLElement {
  const input = el("input", {
    type: "search",
    id: "region-find",
    autocomplete: "off",
    autocapitalize: "none",
    spellcheck: false,
    placeholder: t("explore.findPlaceholder"),
    style: "flex:1 1 auto;min-width:0",
  }) as HTMLInputElement;
  const status = el("div", { role: "status" });
  const picks = el("div", { class: "spot-picks" });

  const say = (...parts: (string | Node | null)[]): void => {
    clear(status);
    const shown = parts.filter((p): p is string | Node => p !== null);
    if (shown.length) status.append(el("p", { class: "coords", style: "margin:0.35rem 0 0" }, shown));
  };
  const warn = (text: string): void => {
    clear(status);
    status.append(el("p", { class: "note warn", style: "margin:0.5rem 0 0" }, text));
  };

  /** Show the cards `keep` allows, and say nothing: callers say what fits. */
  function show(keep: (c: RegionCard) => boolean, fq = ""): number {
    let shown = 0;
    for (const c of cards) {
      const hit = keep(c);
      c.node.style.display = hit ? "" : "none";
      c.mark(hit ? fq : "");
      if (hit) shown++;
    }
    return shown;
  }

  function onType(): void {
    clear(picks);
    const fq = fold(input.value);
    const typed = input.value.trim();
    const shown = show((c) => !fq || c.hay.includes(fq), fq);
    if (!fq) return say();
    if (shown) return say(tn("explore.count", shown, { shown: fmtNumber(shown), total: fmtNumber(cards.length), query: typed }));
    say(
      t("explore.noMatch", { query: typed }), " ",
      el("button", { type: "button", class: "linklike", onClick: () => void lookUp() }, t("explore.lookUp")),
    );
  }

  async function lookUp(): Promise<void> {
    const q = input.value.trim();
    if (!q) return;
    clear(picks);
    say(t("location.searching"));
    input.disabled = true;
    try {
      const places = await searchPlaces(q);
      if (!places.length) return warn(t("prompt.notFound"));
      // One answer needs no choosing. Several ("Portland") get the same
      // one-line choices the other place fields offer.
      if (places.length === 1) return found(places[0].lat, places[0].lon, placeLabel(places[0]));
      say();
      picks.append(...places.map((p) =>
        el("button", {
          type: "button",
          class: "choice",
          onClick: () => { clear(picks); found(p.lat, p.lon, placeLabel(p)); },
        }, [
          el("span", { class: "choice-title" }, placeLabel(p)),
          el("span", { class: "choice-sub" }, `${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`),
        ])));
    } catch {
      warn(t("prompt.offline"));
    } finally {
      input.disabled = false;
    }
  }

  /** A place is known: narrow the grid to the regions whose boxes hold it. */
  function found(lat: number, lon: number, label?: string): void {
    const ids = new Set(regionsForCoords(lat, lon).map((r) => r.meta.id));
    const n = show((c) => ids.has(c.region.meta.id));
    const place = label ?? t("explore.yourLocation");
    const showAll = el("button", {
      type: "button",
      class: "linklike",
      onClick: () => { input.value = ""; onType(); input.focus(); },
    }, t("explore.showAll"));
    if (!n) {
      show(() => true);
      return say(
        t("explore.foundNone", { place }), " ",
        el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("location.coverageAsk")),
      );
    }
    const only = cards.find((c) => ids.has(c.region.meta.id))!;
    say(
      n === 1
        ? t("explore.foundOne", { place, region: regionName(only.region.meta) })
        : t("explore.foundMany", { place, n: fmtNumber(n) }),
      " ", showAll,
    );
    // The spot walk is the easier answer: it starts on this point, and the map
    // there lets the reader nudge the pin before anything is fetched for it.
    picks.append(el("button", {
      type: "button",
      class: "btn btn-primary",
      style: "margin-top:0.5rem",
      onClick: () => {
        resetDraft();
        store.draft.lat = lat;
        store.draft.lon = lon;
        navigate("location");
      },
    }, t("explore.planSpot")));
  }

  input.addEventListener("input", onType);

  return el("div", { class: "region-finder", style: "margin:0 0 0.8rem" }, [
    el("div", { class: "spot-row" }, [
      gpsButton(t("nearby.useMyLocation"), (lat, lon) => {
        input.value = "";
        clear(picks);
        found(lat, lon);
      }, warn, () => say()),
      el("form", {
        class: "spot-search",
        onSubmit: (e: Event) => {
          e.preventDefault();
          // A name the cards already answer needs no lookup; anything else
          // (a postal code, a town no card names) does.
          const fq = fold(input.value);
          if (fq && !cards.some((c) => c.hay.includes(fq))) void lookUp();
          else input.blur();
        },
      }, [
        el("label", { for: "region-find", class: "sr-only" }, t("explore.findLabel")),
        input,
      ]),
    ]),
    status,
    picks,
  ]);
}

/**
 * One region as a card. The **whole card** is the way into the region's roster
 * — the heading's link is stretched over it (see `.region-card-name a::after`)
 * — so there's nothing to aim at and no footer link repeating what the heading
 * already says. The starring plant sits above that overlay and keeps its own
 * link to its profile; those two are the card's only destinations.
 */
function regionCard(region: RegionDef): RegionCard {
  // Every figure here comes from the registry rather than the region's plant
  // list, so a grid of nine cards costs no downloads (see `lib/registry.ts`).
  const p = featuredSummary(region);
  const name = regionName(region.meta);
  const count = plantCountForRegion(region.meta.id);
  const keystones = keystoneCountForRegion(region.meta.id);
  const creatures = wildlifeCountForRegion(region.meta.id);
  const star = p ? nameLines(p) : null;
  const reference = regionReference(region.meta);
  const search = regionSearch(region.meta);

  const nameLink = el("a", { href: `#/regions/${region.meta.id}` }, name);
  const refLine = el("p", { class: "region-card-ref" }, reference);
  // Only there while a search hits a state the card doesn't otherwise name.
  const areaLine = el("p", { class: "region-card-ref", style: "display:none" });
  const marked = (text: string, fq: string): (string | Node)[] =>
    markFolded(text, fq).map((part) => (part.hit ? el("mark", {}, part.text) : part.text));

  const node = el("article", { class: "region-card" }, [
    el("h3", { class: "region-card-name" }, [
      // The country's flag where the pin used to be: a grid of thirteen
      // regions scans by country first, and the pin said nothing a heading
      // doesn't.
      flagRow(region.meta.countries),
      nameLink,
    ]),
    // Just the place. The hardiness chip that used to sit here was a
    // gardening-catalogue term of art on a page whose whole job is "pick where
    // you are" — eight badges down the grid, none of them the thing being
    // chosen. It still rides along on the region page, where a reader who's
    // already picked their place is asking what grows there.
    refLine,
    areaLine,
    // No star if the registry doesn't know the pick — the rest of the card
    // is still true, and `npm run registry:check` fails on that case anyway.
    p && star
      ? el("a", { class: "region-card-star", href: `#/plants/${p.id}` }, [
          plantThumb(p.id, p.form, { regionId: region.meta.id }),
          el("span", { class: "region-card-star-text" }, [
            el("span", { class: "region-card-kicker" }, t("explore.starring")),
            el("span", { class: "region-card-plant" }, [
              star.title,
              // A word joiner keeps the star from wrapping onto a line alone.
              p.keystone ? "\u2060" : null,
              p.keystone
                ? el("span", {
                    title: t("explore.keystoneTitle"),
                    role: "img",
                    "aria-label": t("explore.keystoneLabel"),
                    class: "name-mark",
                  }, [keystoneIcon(13)])
                : null,
            ]),
            el("span", { class: "plant-latin" }, star.sub),
            region.meta.featuredHostLepCount === null
              ? null
              : el("span", { class: "region-card-host" }, [
                  el("span", { "aria-hidden": "true" }, "🐛 "),
                  t("explore.caterpillarSpecies", { n: fmtNumber(region.meta.featuredHostLepCount) }),
                ]),
          ]),
        ])
      : null,
    // What the roster adds up to, as figures rather than adjectives — and the
    // plant count among them, which is why the card needs no "all N natives"
    // link. Nothing here is a new claim: it's the same data the region page's
    // stat tiles explain in full.
    cardStats([
      {
        icon: "🌿",
        value: fmtNumber(count),
        label: t("explore.statPlants", { n: fmtNumber(count), region: name }),
      },
      keystones
        ? {
            icon: () => el("span", { class: "card-stat-arch" }, [keystoneIcon(13)]),
            value: fmtNumber(keystones),
            label: tn("explore.statKeystone", keystones, { n: fmtNumber(keystones) }),
          }
        : null,
      creatures
        ? {
            icon: "🦋",
            value: fmtNumber(creatures),
            label: t("explore.statWildlife", { n: fmtNumber(creatures) }),
          }
        : null,
    ]),
  ]);

  return {
    region,
    node,
    hay: search.hay,
    mark(fq) {
      clear(nameLink);
      nameLink.append(...marked(name, fq));
      clear(refLine);
      refLine.append(...marked(reference, fq));
      const areas = areasMatching(search, fq, `${name} ${reference}`);
      clear(areaLine);
      areaLine.style.display = areas.length ? "" : "none";
      if (areas.length) {
        areaLine.append(...tx("explore.includes", {
          areas: el("span", {}, areas.flatMap((a, i) => [i ? ", " : "", el("mark", {}, a)])),
        }));
      }
    },
  };
}
