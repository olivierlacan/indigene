// A plant's own page, at a stable, shareable URL (#/plants/<id>, canonically
// …/plants/<id>). This is the reverse of the main flow: the plant is fixed and
// the question is whether a spot deserves it. The verdict has exactly three
// honest levels — ideal, decent, unsuitable — and is computed with the same
// fit math and hard gates as the ranked list.
import { el, clear, toast } from "../ui";
import { navigate, store, resetDraft, resultsTrail, keepTrail, openSavedSpot } from "../state";
import { fetchSite } from "../lib/site";
import { searchPlaces, placeLabel, nearestPlaceName } from "../lib/geocode";
import { manualSunEstimate } from "../lib/solar";
import { findPlant, assessSpot, plantShareUrl } from "../lib/explore";
import { savedSpotsThatSuit } from "../lib/saved-fit";
import { regionForSite } from "../lib/plants";
import type { PlantEntry, Suitability } from "../lib/explore";
import { wildlifeForPlant, relianceOf } from "../lib/wildlife";
import { lookalikesForPlant } from "../lib/lookalikes";
import { supportLabel } from "../lib/plain";
import { supportIcon } from "../components/support-icon";
import { SCORE_KEYS, scoreLabel, bloomSentence, confidencePlain, growthPlain, moistureWord, propagationMethod, sunLabel, PROPAGATION_SOURCE_URL, SOURCES_ROUTE } from "../lib/plain";
import { citation } from "../components/citation";
import { silhouetteFor } from "../components/plant-card";
import { heroPhotoFor, asObservation } from "../lib/hero-photo";
import { loadPhoto } from "../lib/photo";
import { openObservationLightbox, licenseLabel } from "../components/lightbox";
import { keystoneIcon } from "../components/keystone-icon";
import { statGrid } from "../components/stat-card";
import { drawSizeViz } from "../components/size-viz";
import { entryForPlant, deepLinks } from "../lib/registry";
import { nearbyObservationsSection } from "../components/nearby-observations";
import { anchoredHeading } from "../components/anchor-head";
import { plantSectionHref } from "../lib/routes";
import { privacyNote } from "../components/privacy-link";
import type { Plant, SiteData, SunEstimate, SupportKind } from "../types";
import { t, tn, fmtNumber, fmtList } from "../lib/i18n";
import { length, humanHeightLabel } from "../lib/units";
import { commonName, nameLines, regionName, regionShort } from "../lib/names";
import { prose, propagationNote, isUntranslated, lookalikesUntranslated } from "../lib/prose";
import { reportUntranslated } from "../components/wip-banner";

// The anchorable sections below the profile share one deep-link scheme:
// #/plants/<slug>/<section>. Every heading now shows that address (the `#`
// mark — see `components/anchor-head.ts`), and following one opens the page at
// that card. Listed in the order they appear in the phone stack.
const SECTIONS = ["ecosystem", "nearby", "propagation", "spot", "references"] as const;

/** The hero's widest drawn size, matching `.plant-hero` in the stylesheet
 *  (`min(33vw, 9.5rem)`). The loader turns it, plus the screen's pixel density,
 *  into which of iNaturalist's five renditions to ask for. */
const HERO_PX = 152;
type Section = (typeof SECTIONS)[number];
const sectionDomId = (s: Section): string => `sec-${s}`;

/**
 * Which of a plant's regional rows this page is showing.
 *
 * A plant native to more than one region has a *different row per region* — and
 * they differ in load-bearing ways, not decoration: butterfly weed is hardy in
 * zones 3–9 in the Mid-Atlantic and 8–10 in Florida, goat willow's mature height
 * and even its French common name change between the Atlantic coast and the
 * Alps. Every one of the catalog's multi-region plants differs somewhere.
 *
 * This used to be `entries[0]`, which is whichever region happens to sit
 * earliest in the REGIONS array — so a Floridian who tapped butterfly weed in
 * their own Florida results list was shown the Mid-Atlantic's hardiness and the
 * Mid-Atlantic's description of it. In order of trust:
 *
 *   1. `?region=` in the address — a link that deliberately pinned one.
 *   2. The reader's own region: the one they picked by hand, or the one their
 *      spot resolves to (the same call the suitability check makes, so the page
 *      and the verdict on it can never disagree about where "here" is).
 *   3. The first row, which is all we can honestly do knowing nothing.
 */
function activeEntry(entries: PlantEntry[]): PlantEntry {
  const pinned = hashParam("region");
  const byPin = pinned && entries.find((e) => e.region.meta.id === pinned);
  if (byPin) return byPin;

  const { regionOverride, lat, lon, site } = store.draft;
  if (regionOverride) {
    const chosen = entries.find((e) => e.region.meta.id === regionOverride);
    if (chosen) return chosen;
  }
  if (lat != null && lon != null) {
    const here = regionForSite(lat, lon, site);
    const mine = here && entries.find((e) => e.region.meta.id === here.meta.id);
    if (mine) return mine;
  }
  return entries[0];
}

/** One value out of the hash's query string (`#/plants/x?region=pnw`). The hash
 *  query is the page's *state*, not its identity — the router strips it before
 *  matching a route, so a page that wants it reads it here. */
function hashParam(name: string): string | null {
  const at = location.hash.indexOf("?");
  if (at < 0) return null;
  return new URLSearchParams(location.hash.slice(at + 1)).get(name);
}

export function renderPlant(main: HTMLElement, param?: string): (() => void) | void {
  clear(main);
  // The route param is the slug, optionally followed by /<section>.
  const raw = param ?? "";
  const slash = raw.indexOf("/");
  const slug = slash >= 0 ? raw.slice(0, slash) : raw;
  const wanted = slash >= 0 ? raw.slice(slash + 1) : "";
  const section = (SECTIONS as readonly string[]).includes(wanted) ? (wanted as Section) : null;

  const entries = findPlant(slug);
  if (!entries.length) {
    renderNotFound(main, slug);
    return;
  }

  // Which region's row to show. Not `entries[0]`: that is whichever region sits
  // earliest in the REGIONS array, which is nobody's region in particular.
  const active = activeEntry(entries);
  // `region` feeds the "check your spot" lede, which names the region whose
  // figures are on screen — so it has to follow the active row too, or the
  // checker offers to test a spot against a region the page isn't showing.
  const { plant, region } = active;
  document.title = t("plant.docTitle", { name: commonName(plant), latin: plant.latin });

  // Some of the catalog's writing is still in English (see lib/prose). Reported,
  // not rendered — main.ts puts the banner at the top of the page.
  // The look-alike writing is part of the same promise: a page that is otherwise
  // fully in the reader's language mustn't quietly grow an English section.
  const allLookalikes = entries.flatMap((e) => lookalikesForPlant(e.region.meta.id, e.plant.id));
  if (
    isUntranslated(plant, region.meta.id) ||
    lookalikesUntranslated(plant.latin, allLookalikes, region.meta.id)
  ) {
    reportUntranslated(t("wip.plant"));
  }

  // Arrived by tapping a card in the ranked list for a spot? Then this page is
  // a detour, and a detour needs a way back — at the top, before the reading,
  // where an escape hatch belongs, and again at the bottom in place of the
  // browse-everything button, which is the wrong "more plants" for someone who
  // has a list of their own waiting.
  const fromList = resultsTrail.open;

  main.append(
    ...(fromList ? [el("p", { class: "back-trail" }, [
      el("a", { href: "#/results" }, t("plant.backToList")),
    ])] : []),
    profile(plant, entries),
    // The sections below the profile, in two columns on a laptop and one on a
    // phone. The split is by position, not by shuffling: reading down the left
    // column and then the right gives exactly the order a phone stacks them in,
    // so nothing has a different place in the page depending on the screen.
    // (`.plant-sections` and its columns are `display: contents` until the
    // laptop breakpoint, so on a phone these wrappers don't exist at all.)
    //
    // "Check your spot" heads the second column and the databases close the
    // page: one is what a reader came here to do, the other is where they go
    // when this page has run out of answers. Reference material belongs after
    // the thing it backs up, not in front of it.
    el("div", { class: "plant-sections" }, [
      el("div", { class: "plant-sections-col" }, [
        // A link straight to the ecosystem card is a request for the detail in
        // it, so it arrives with every "what does this mean?" already open —
        // see `ecosystemSection`.
        ecosystemSection(plant, entries, section === "ecosystem"),
        nearbyObservationsSection(plant),
        propagationSection(plant, region.meta.id),
      ]),
      el("div", { class: "plant-sections-col" }, [
        suitabilityChecker(entries),
        referencesSection(plant),
      ]),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      fromList
        ? el("button", { class: "btn btn-primary", onClick: () => navigate("results") }, t("plant.backToListShort"))
        : el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("plant.more")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ])
  );

  if (section) revealSection(section);

  main.addEventListener("click", onAnchorClick);

  // The way back to the list is kept only for as long as it leads anywhere: go
  // somewhere else from here and the offer is swept, rather than reappearing
  // pages later as a guess about what "back" means.
  const cleanup = (): void => {
    main.removeEventListener("click", onAnchorClick);
    keepTrail(location.hash);
  };

  /**
   * A tap on a heading's `#` mark — answered here rather than by the router.
   *
   * Letting it navigate would work and would be wasteful: the address differs
   * from the one on screen only in which card you want to be looking at, and a
   * re-render for that throws away the hero photograph, every observation
   * thumbnail already fetched, and whatever spot the reader had typed into the
   * checker. So the page moves itself instead, and `replaceState` puts the
   * section's address in the bar without stacking a history entry per tap —
   * back still means "the page I came from", not "the same page, one card up".
   *
   * Only a plain left click is taken: a modified click is someone deliberately
   * opening the section in a new tab, and the `<a>` is real, so it just works.
   *
   * The link is copied too, because "give me the link to this bit" is the whole
   * reason the mark is there, and a reader on a phone has no address bar worth
   * the name to copy it out of.
   */
  function onAnchorClick(e: MouseEvent): void {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest("a.anchor-link");
    if (!link || !main.contains(link)) return;
    const href = link.getAttribute("href") ?? "";
    const wantedSection = href.slice(href.lastIndexOf("/") + 1);
    if (!(SECTIONS as readonly string[]).includes(wantedSection)) return;
    e.preventDefault();
    // The address the router itself would settle on for this route (see
    // `syncAddressBar`): base, then the hash form. A section has no file of its
    // own, so the hash is the only address that reloads it.
    const address = `${import.meta.env.BASE_URL}${href}`;
    history.replaceState(history.state, "", address);
    revealSection(wantedSection as Section);
    void copyLink(`${location.origin}${address}`);
  }

  /**
   * For a plant native to more than one region: which region's figures you are
   * reading, and a tap to read another's.
   *
   * It exists because those figures genuinely differ. Every multi-region plant
   * in the catalog has a different row per region — hardiness zones, mature
   * size, soil pH, the wildlife scores, all of the prose, and for three French
   * trees even the common name. Showing one silently, with a "Native to: A · B"
   * line above implying both, told some readers the wrong thing with a straight
   * face.
   *
   * Single-region plants — 181 of the 198 — get nothing here. There is no
   * choice to offer, and a control with one option is furniture.
   */
  function regionSwitch(p: Plant, all: PlantEntry[], current: PlantEntry): HTMLElement | null {
    if (all.length < 2) return null;
    return el("div", { class: "region-switch" }, [
      el("span", { class: "region-switch-lede" }, t("plant.figuresFor")),
      ...all.map((e) => {
        const here = e.region.meta.id === current.region.meta.id;
        return el("a", {
          class: here ? "region-chip region-chip-on" : "region-chip",
          // A hash query, so the plant keeps one address and one share link:
          // which region you are reading is the page's state, not its identity.
          href: `#/plants/${encodeURIComponent(p.id)}?region=${encodeURIComponent(e.region.meta.id)}`,
          ...(here ? { "aria-current": "true" } : {}),
        }, regionShort(e.region.meta));
      }),
    ]);
  }

  /**
   * The chosen photograph, in the slot the form drawing occupies — or null when
   * nobody has picked one for this plant, in which case the drawing stays.
   *
   * A *thumbnail that the text wraps around*, not a column. As a flex column it
   * left a block of dead space to its right — a name and a latin binomial are
   * two short lines, the photo is five tall — while pushing the badges and the
   * credit onto rows of their own below. Floating it lets the name, the binomial
   * and the badges sit beside it and then carry on underneath when they run past
   * it, which is what fills that space.
   *
   * The credit travels *with* the photo, inside the float, at the size a credit
   * deserves: the observer's name, one line, truncated rather than wrapped. The
   * licence, the date and the link to the original record are a tap away in the
   * lightbox — the same lightbox, the same wording, and the same single
   * implementation every other iNaturalist photo in the app uses. Spending a
   * full-width row on all of it above the plant's own badges had the priorities
   * backwards.
   *
   * `regionId` is the *active* region, not the first one: a plant native to
   * several regions shows that region's figures (see `activeEntry`), so it has
   * to show that region's photograph too, or the page would picture a Florida
   * live oak beside Maryland's numbers.
   */
  function heroImage(p: Plant, regionId?: string): HTMLElement | null {
    const pick = heroPhotoFor(p.id, regionId);
    if (!pick) return null;
    const name = commonName(p);
    const observation = asObservation(pick, p.latin);
    const btn = el("button", {
      type: "button",
      class: "plant-hero-shot",
      // The photograph's own average colour, so the slot is never a green
      // rectangle waiting to be filled — the picture fades up out of its own
      // mossy green, or winter grey, or goldenrod yellow. Picks harvested
      // before `hero:colors` existed have none, and keep the stylesheet's.
      ...(pick.color ? { style: `background:${pick.color}` } : {}),
      "aria-label": t("hero.enlarge", { name }),
      onClick: () => openObservationLightbox([observation], { observation: 0, photo: 0 }, name, btn),
    }, [
      el("img", {
        // No `src`: `loadPhoto` sets it, having chosen the rendition that
        // actually covers this slot on this screen. A 3× phone still gets the
        // 500 px file; a laptop gets the 240 px one, which is a third of the
        // bytes for a picture nobody could tell apart. The large rendition is
        // for the lightbox, and `original` is for nowhere.
        class: "photo-fade",
        alt: t("obs.photoAlt", { name: p.latin, observer: pick.observer ?? "an iNaturalist observer" }),
        // Square, and said up front, so the head row doesn't reflow when it lands.
        width: 180,
        height: 180,
      }),
    ]) as HTMLButtonElement;
    // Urgent: this is the picture the page is about, at the top of it, so it
    // skips the wait-until-nearly-visible step every other photo goes through
    // and goes to the front of the queue.
    loadPhoto(btn.querySelector("img")!, pick.mediumUrl, HERO_PX, true);

    // One line, the observer's name, ellipsised if it's long — with the full
    // credit on the element itself for a pointer, and stated in full in the
    // lightbox for everyone.
    const credit = el("figcaption", {
      class: "plant-hero-credit",
      title: pick.attribution ?? `© ${pick.observer} · ${licenseLabel(pick.license)} · iNaturalist`,
    }, [
      el("a", {
        href: `https://www.inaturalist.org/observations/${pick.observationId}`,
        target: "_blank",
        rel: "noopener",
      }, `© ${pick.observer ?? "iNaturalist"}`),
    ]);

    return el("figure", { class: "plant-hero" }, [btn, credit]);
  }

  function profile(p: Plant, all: PlantEntry[]): HTMLElement {
    const hero = heroImage(p, active.region.meta.id);
    const badges = el("div", {}, [
      p.keystone
        ? el("span", { class: "badge keystone", title: t("badge.keystoneTitle") }, [keystoneIcon(), " " + t("badge.keystone")])
        : null,
      p.noWaterEstablish
        ? el("span", { class: "badge nowater" }, t("badge.noWater"))
        : el("span", { class: "badge caution" }, t("badge.needsWater")),
      p.filters.petToxic ? el("span", { class: "badge caution" }, t("badge.petToxic")) : null,
      p.filters.thorny ? el("span", { class: "badge caution" }, t("badge.thorny")) : null,
      p.filters.aggressive ? el("span", { class: "badge caution" }, t("badge.aggressive")) : null,
      p.filters.deerResistant ? el("span", { class: "badge neutral" }, t("badge.deerResistant")) : null,
    ]);

    const canvas = el("canvas", { class: "size-viz", role: "img", "aria-label": t("plant.sizeAria", { name: commonName(p) }) });
    queueMicrotask(() => drawSizeViz(canvas, p));

    const bloom = bloomSentence(p.bloom);

    const names = nameLines(p);

    return el("article", { class: "plant" }, [
      // The "native to" line and the share control share the top row. The
      // button used to be a full-width secondary at the very bottom of the
      // page, which made sharing look like the last step of reading the plant
      // rather than something you can do the moment you recognise it — and
      // spent a whole row of a phone screen on it. Up here there is slack to
      // the right of a short region name, and none of the reading is displaced.
      el("div", { class: "plant-top" }, [
        el("p", { class: "region-tag", style: "margin:0;font-size:0.9rem;color:var(--ink-soft)" }, [
          t("plant.nativeTo"),
          ...all.flatMap((e, i) => [
            i > 0 ? " · " : null,
            el("a", { href: `#/regions/${e.region.meta.id}` }, regionName(e.region.meta)),
          ]),
        ]),
        shareButton(p),
      ]),
      // Which region's figures these are stays above the columns, spanning the
      // card: it governs everything below it, in both columns.
      regionSwitch(p, all, active),
      // Two columns on a laptop, one stack on a phone — and the same order
      // either way, read down the left column and then the right: who this
      // plant is and its numbers, then how big it gets and what it asks of you.
      // The wrappers are `display: contents` below the breakpoint, so on a
      // phone the pieces sit in the card exactly as they always have.
      el("div", { class: "plant-cols" }, [
        el("div", { class: "plant-col" }, [
          // Two layouts, one row of content. The drawing is a flex column beside
          // the text, as it always was. The photograph is a *float*, so the text
          // runs beside it and then under it — a photo is taller than a name and
          // a latin binomial, and a flex column would leave that difference blank.
          el("div", { class: hero ? "plant-head plant-head-photo" : "plant-head" }, [
            hero ?? el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
            el("div", {}, [
              el("h2", { class: "plant-name", style: "margin:0" }, names.title),
              el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" }, names.sub),
              badges,
            ]),
          ]),
          el("p", { class: "kv plant-why" }, [el("span", { class: "k" }, t("plant.whyBelongs")), prose(p, "nativeNote", region.meta.id)]),
          // The impostor warning belongs with the plant's identity, so it stays
          // in this column: you read the name, then who gets mistaken for it.
          lookalikeLine(all),
          statGrid(p),
        ]),
        el("div", { class: "plant-col" }, [
          canvas,
          el("div", { class: "size-caption" }, [
            `${t("card.sizeCaption", {
              human: humanHeightLabel(),
              height: length(p.matureHeightFt),
              spread: length(p.matureSpreadFt),
            })} ${growthPlain(p)}`,
          ]),
          el("div", { class: "plant-body" }, [
            el("p", { class: "kv" }, [el("span", { class: "k" }, t("card.gives")), prose(p, "givesNote", region.meta.id)]),
            el("p", { class: "kv" }, [el("span", { class: "k" }, t("card.needs")), prose(p, "careNote", region.meta.id)]),
            el("p", { class: "kv" }, [
              el("span", { class: "k" }, t("card.bloomMoisture")),
              `${bloom} ${t("card.prefersSoil", { bands: fmtList(p.moisture.map(moistureWord)) })}`,
            ]),
            el("p", { class: "confidence" }, [
              el("strong", {}, t("card.confidence", { level: t(`confidence.word.${p.confidence}` as const) })),
              confidencePlain(p.confidence),
              " ",
              el("span", {}, [
                t("card.source"),
                ...citation(p.basis),
                " ",
                el("a", { href: SOURCES_ROUTE }, t("card.howSure")),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]);
  }

  /**
   * The share control: an icon that grows a label rather than a labelled
   * button that never shrinks.
   *
   * A bare icon is a guessing game and a labelled button is a whole row, so it
   * is both, at different moments. With a pointer, hovering widens it to
   * "🔗 Share" before you commit. With a finger there is no hover to give, so
   * the tap does it: `pressed` holds the label open for a beat as the share
   * sheet comes up, which answers "what did I just press?" at the only moment
   * the question gets asked. Either way the accessible name is the full
   * sentence, so nothing depends on the label being visible.
   */
  function shareButton(p: Plant): HTMLElement {
    const btn = el("button", {
      type: "button",
      class: "share-btn",
      "aria-label": t("plant.share"),
      onClick: () => {
        btn.classList.add("is-pressed");
        // Long enough to read, short enough that it isn't still open when you
        // come back from the share sheet and wonder why.
        setTimeout(() => btn.classList.remove("is-pressed"), 1600);
        void share(p);
      },
    }, [
      el("span", { class: "share-btn-icon", "aria-hidden": "true" }, "🔗"),
      el("span", { class: "share-btn-label", "aria-hidden": "true" }, t("plant.shareShort")),
    ]);
    return btn;
  }

  async function share(p: Plant): Promise<void> {
    const url = plantShareUrl(p.id);
    const data = {
      title: t("plant.shareTitle", { name: commonName(p) }),
      text: t("plant.shareText", { name: commonName(p), latin: p.latin }),
      url,
    };
    if (navigator.share) {
      await navigator.share(data).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => {});
    toast(t("plant.linkCopied"));
  }

  // ---- "Will it work where you want to plant it?" ----
  function suitabilityChecker(all: PlantEntry[]): HTMLElement {
    let lat: number | null = null;
    let lon: number | null = null;
    let site: SiteData | null = null;
    let sun: SunEstimate | null = null;
    let lastVerdict: Suitability | null = null;
    // The town shown for the chosen spot — from the search pick, or reverse-
    // geocoded from a GPS fix. Display only; coordinates are the fallback.
    let spotName: string | null = null;
    let lookingUp = false;

    const verdictEl = el("div", { "aria-live": "polite" });
    const status = el("p", { class: "coords", role: "status", "aria-live": "polite" }, t("plant.noSpot"));

    function renderStatus(): void {
      if (lat == null || lon == null) return;
      const where = spotName ?? `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      status.textContent = lookingUp ? t("plant.checkingSpot", { where }) : where;
    }

    const sunButtons: { key: "full" | "half" | "shade" | null; label: string }[] = [
      { key: null, label: t("plant.sunUnsure") },
      { key: "full", label: t("plant.sunFull") },
      { key: "half", label: t("plant.sunHalf") },
      { key: "shade", label: t("plant.sunShade") },
    ];
    const sunRow = el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.5rem 0" },
      sunButtons.map((b) =>
        el("button", {
          class: "btn btn-secondary",
          style: "flex:1 1 auto;min-height:2.6rem;padding:0.4rem 0.6rem;font-size:0.9rem",
          "aria-pressed": b.key === null ? "true" : "false",
          onClick: (e) => {
            sun = b.key ? manualSunEstimate(b.key) : null;
            sunRow.querySelectorAll("button").forEach((btn) => btn.setAttribute("aria-pressed", "false"));
            (e.currentTarget as HTMLElement).setAttribute("aria-pressed", "true");
            if (lastVerdict) evaluate(); // sharpen an existing verdict live
          },
        }, b.label)
      )
    );

    const locateBtn = el("button", { class: "btn btn-primary btn-block", onClick: locate }, t("plant.checkLocation")) as HTMLButtonElement;

    /**
     * The saved spots this plant already suits, when there are any.
     *
     * Filled in after the database answers, above the manual check — because a
     * reader who has already described a garden shouldn't be asked to describe
     * it again to learn whether this plant belongs in it. Empty until then, and
     * empty forever if nothing suits: the section reads exactly as it did
     * before, and the manual check underneath still gives an honest verdict for
     * any spot, saved or not (see `lib/saved-fit.ts` for why nothing negative
     * is volunteered here).
     */
    const savedFit = el("div", {});
    void savedSpotsThatSuit(all).then((matches) => {
      if (!matches.length) return;
      savedFit.append(
        el("p", { class: "saved-fit-lede" }, tn("plant.savedFit", matches.length)),
        ...matches.map(({ spot, verdict }) =>
          el("button", {
            class: "choice",
            onClick: () => openSavedSpot(spot),
          }, [
            el("span", { class: "choice-title" }, spot.label),
            el("span", { class: "choice-sub" }, [
              el("span", { class: "saved-fit-level" },
                `${verdict.level === "ideal" ? "🌱" : "🌤"} ${verdict.headline}`),
              // What that spot is *like*, not the first line of the verdict's
              // reasoning. The reasons are ordered for reading in full, so the
              // first is the hardiness line — which on a spot whose site lookup
              // never landed is "couldn't confirm how cold winters get here",
              // and leading a positive answer with a caveat reads as a warning.
              // The sun answer is the reader's own words about that ground and
              // says why it came out ideal or merely decent. Derived from the
              // hours rather than read off `sun.label`, which was written in
              // whatever language the spot was saved in and would otherwise
              // stay English on a page that had switched to French.
              ...(spot.sun ? [" — ", sunLabel(spot.sun.hours)] : []),
            ]),
          ])
        )
      );
    });

    // The no-GPS fallback: the same town/ZIP search as the main flow — nobody
    // is asked to know coordinates. A pick names the spot directly (its
    // centroid is plenty for a region/climate/soil-grid check).
    const searchInput = el("input", {
      type: "search",
      id: "plant-place-q",
      autocomplete: "off",
      placeholder: t("location.searchPlaceholder"),
      style: "flex:1 1 auto;min-width:0",
    }) as HTMLInputElement;
    const searchBtn = el("button", { class: "btn btn-secondary", style: "flex:none" }, t("location.search")) as HTMLButtonElement;
    const searchOut = el("div", { "aria-live": "polite" });

    async function doSearch(): Promise<void> {
      const q = searchInput.value.trim();
      if (!q) return;
      clear(searchOut);
      searchBtn.disabled = true;
      searchBtn.textContent = t("location.searching");
      try {
        const places = await searchPlaces(q);
        clear(searchOut);
        if (!places.length) {
          searchOut.append(el("div", { class: "note warn" }, t("location.searchNoResults")));
          return;
        }
        searchOut.append(
          ...places.map((p) =>
            el("button", {
              class: "choice",
              onClick: () => {
                clear(searchOut);
                setSpot(p.lat, p.lon, placeLabel(p));
              },
            }, [
              el("span", { class: "choice-title" }, placeLabel(p)),
              el("span", { class: "choice-sub" }, `${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`),
            ])
          )
        );
      } catch {
        clear(searchOut);
        searchOut.append(el("div", { class: "note warn" }, t("plant.searchOffline")));
      } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = t("location.search");
      }
    }

    function locate(): void {
      if (!("geolocation" in navigator)) {
        toast(t("plant.noGeolocation"));
        return;
      }
      locateBtn.textContent = t("location.locating");
      locateBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locateBtn.disabled = false;
          locateBtn.textContent = t("location.update");
          setSpot(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          locateBtn.disabled = false;
          locateBtn.textContent = t("plant.checkLocation");
          toast(err.code === err.PERMISSION_DENIED ? t("plant.denied") : t("plant.noFix"));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }

    function setSpot(la: number, lo: number, knownName?: string): void {
      lat = la;
      lon = lo;
      site = null;
      spotName = knownName ?? null;
      lookingUp = true;
      renderStatus();
      clear(verdictEl);
      if (!knownName) {
        // GPS gave us numbers; put a town name on them (display-only nicety —
        // coordinates remain the fallback, and the verdict never depends on it).
        nearestPlaceName(la, lo).then((n) => {
          if (n && lat === la && lon === lo) {
            spotName = t("plant.near", { place: n });
            renderStatus();
          }
        });
      }
      fetchSite(la, lo)
        .then((s) => { site = s; })
        .catch(() => { site = null; })
        .finally(() => {
          if (lat !== la || lon !== lo) return; // a newer spot superseded this one
          lookingUp = false;
          renderStatus();
          evaluate();
        });
    }

    function evaluate(): void {
      if (lat == null || lon == null) return;
      const v = assessSpot(all, site, lat, lon, sun);
      lastVerdict = v;
      const cls = v.level === "ideal" ? "info" : v.level === "decent" ? "warn" : "danger";
      const emoji = v.level === "ideal" ? "🌱" : v.level === "decent" ? "🌤" : "🛑";
      clear(verdictEl);
      verdictEl.append(
        el("div", { class: `note ${cls}`, style: "margin-top:0.75rem" }, [
          el("strong", {}, `${emoji} ${v.headline}`),
          el("ul", { style: "margin:0.4rem 0 0;padding-left:1.1rem" }, v.reasons.map((r) => el("li", {}, r))),
        ])
      );
      if (v.entry) {
        verdictEl.append(
          el("button", {
              class: "btn btn-secondary btn-block",
              style: "margin-top:0.6rem",
              onClick: () => {
                // Hand the checked spot to the main flow so "what else would
                // thrive here?" is one tap, not a restart.
                resetDraft();
                store.draft.lat = lat;
                store.draft.lon = lon;
                store.draft.site = site;
                store.draft.sun = sun;
                navigate("results");
              },
            }, t("plant.seeEverything"))
        );
      }
    }

    // The gap to the section above comes from that section's own bottom margin
    // (they collapse into one on a phone, and the laptop columns space their
    // cards the same way) — an extra top margin here would double it in a
    // column, where margins no longer collapse.
    return el("section", { class: "card plant-section", id: sectionDomId("spot") }, [
      // No plant name in the heading: it changes width per plant and would
      // wrap the card title on a phone. The page is already about this plant.
      anchoredHeading(t("plant.checkSpotTitle"), plantSectionHref(plant.id, "spot"), t("plant.sectionLink")),
      el("p", { style: "margin:0.3rem 0 0.6rem" },
        t("plant.checkSpotLede", { region: regionName(region.meta) })),
      savedFit,
      locateBtn,
      privacyNote(t("plant.checkPrivacy")),
      status,
      el("p", { style: "margin:0.6rem 0 0;font-weight:650" }, t("plant.sunQuestion")),
      sunRow,
      el("div", { style: "margin-top:0.4rem" }, [
        el("p", { style: "font-weight:650;margin:0.6rem 0 0" }, t("plant.noGpsSearch")),
        el("form", {
          onSubmit: (e: Event) => { e.preventDefault(); void doSearch(); },
        }, [
          el("div", { class: "field", style: "margin-top:0.5rem" }, [
            el("label", { for: "plant-place-q" }, t("location.searchLabel")),
            // Capped for the same reason the nearby-photos prompt is (see
            // `.spot-prompt`): a town name doesn't need half a laptop screen,
            // and the two fields on this page shouldn't disagree about that.
            el("div", { class: "town-search-row" }, [searchInput, searchBtn]),
          ]),
        ]),
        searchOut,
      ]),
      verdictEl,
    ]);
  }

  return cleanup;
}

// A standalone card — the same shape the "Want to plant?" tool uses — that a
// deep link scrolls into view. Always open: these used to collapse, but
// content shouldn't hide behind a tap.
//
// The heading carries the card's own address (`components/anchor-head.ts`), so
// every one of these is a place you can send somebody to rather than a place
// you have to describe.
function sectionCard(slug: string, section: Section, heading: string, body: HTMLElement[]): HTMLElement {
  return el("section", { class: "card plant-section", id: sectionDomId(section) }, [
    anchoredHeading(heading, plantSectionHref(slug, section), t("plant.sectionLink")),
    ...body,
  ]);
}

/** Put a section's address on the clipboard. Best-effort: a browser that
 *  refuses (no permission, insecure origin) still moved the page and still put
 *  the address in the bar, so there is nothing to apologise for. */
async function copyLink(url: string): Promise<void> {
  if (!navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(url);
    toast(t("plant.linkCopied"));
  } catch {
    /* the address bar has it either way */
  }
}

/**
 * The seven ecosystem-benefit scores, each with its fixed icon, its bar, and a
 * plain-words gloss that is now folded away until asked for.
 *
 * All seven glosses open at once made the tallest card on the page: seven
 * headings, seven bars and roughly twenty lines of explanation, with no space
 * between any two of them, so the numbers — the part you came for — had to be
 * hunted out of a wall of prose. Folded, the card is a scannable table of seven
 * rows, and the sentence is one hover or one tap away.
 *
 * The glosses are the one thing on this page that can honestly be folded. They
 * explain the *label*, not the plant: "Soaks up rain" already says what
 * "Deep roots that let rainwater sink in instead of running off" says, at
 * greater length. Nothing about this plant in particular hides here — which is
 * the bar the rest of the page is deliberately held to (see `sectionCard`).
 *
 * Three ways in, because a screen is one of three things:
 *   - a pointer: hovering a row opens its gloss, no click needed (CSS only);
 *   - a finger: the row is a real button, and a tap opens it — the chevron is
 *     drawn at rest so there is something to aim at;
 *   - a keyboard: focus opens it, and Enter latches it open.
 *
 * @param expanded Start with every gloss open — what a link straight to this
 *   card means, since asking for the ecosystem section is asking for the
 *   detail in it.
 */
function ecosystemSection(p: Plant, entries: PlantEntry[], expanded: boolean): HTMLElement {
  const scoreParts = SCORE_KEYS.map((key) => {
    const val = (p.scores as unknown as Record<string, number>)[key];
    const label = scoreLabel(key);
    const whyId = `score-why-${key}`;
    const toggle = el("button", {
      type: "button",
      class: "score-toggle",
      "aria-expanded": expanded ? "true" : "false",
      "aria-controls": whyId,
      onClick: () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
      },
    }, [
      el("div", { class: "score-head" }, [
        el("span", { class: "score-name" }, [el("span", { "aria-hidden": "true" }, `${label.icon} `), label.name]),
        el("span", { class: "score-value" }, `${fmtNumber(val)}${key === "host" ? ` · ${t("card.hostSpecies", { n: fmtNumber(p.hostLepCount) })}` : ""}`),
        el("span", { class: "score-chevron", "aria-hidden": "true" }, "›"),
      ]),
      el("div", { class: "score-bar" }, [el("span", { style: `width:${val}%` })]),
    ]);
    return el("li", { class: "score-item" }, [
      toggle,
      el("div", { class: "score-why", id: whyId }, [el("p", { class: "score-why-text" }, label.plain)]),
    ]);
  });
  const feeds = whoItFeeds(entries);
  return sectionCard(p.id, "ecosystem", t("plant.ecosystemTitle"), [
    ...(feeds ? [feeds] : []),
    el("ul", { class: "score-list score-list-folding" }, scoreParts),
  ]);
}

// The named insects and animals this plant supports — the concrete answer to
// "will it bring monarchs?", drawn from the wildlife map. Each links to that
// creature's page, where you can see every other native that supports it. A
// plant native to more than one region shows the union of its ties, deduped by
// creature (the strongest tie — a larval host — wins the label).
function whoItFeeds(entries: PlantEntry[]): HTMLElement | null {
  const supportRank: Record<string, number> = { host: 0, nectar: 1, berries: 2, seeds: 3, shelter: 4 };
  // A star marks a plant this animal can't live without — the make-or-break tie.
  const best = new Map<string, { name: string; icon: string; support: string; id: string; sole: boolean }>();
  for (const e of entries) {
    for (const { wildlife, link } of wildlifeForPlant(e.region.meta.id, e.plant.id)) {
      const prev = best.get(wildlife.id);
      const sole = (prev?.sole ?? false) || relianceOf(link) === "sole";
      if (!prev || supportRank[link.support] < supportRank[prev.support]) {
        best.set(wildlife.id, { name: commonName(wildlife), icon: wildlife.icon, support: link.support, id: wildlife.id, sole });
      } else {
        prev.sole = sole; // keep the star even if a weaker-labeled tie sorted first
      }
    }
  }
  if (!best.size) return null;
  // Make-or-break ties first, then by support strength.
  const items = [...best.values()].sort(
    (a, b) => Number(b.sole) - Number(a.sole) || supportRank[a.support] - supportRank[b.support]
  );
  return el("div", { style: "margin:0 0 0.8rem" }, [
    el("p", { class: "kv", style: "margin:0 0 0.4rem" }, [el("span", { class: "k" }, t("plant.wildlifeItBrings"))]),
    el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem" },
      items.map((w) =>
        el("a", {
          href: `#/wildlife/${w.id}`,
          class: "btn btn-secondary",
          style: "flex:0 1 auto;min-height:2.4rem;padding:0.35rem 0.65rem;font-size:0.9rem;text-decoration:none",
          title: w.sole
            ? t("plant.soleTie", { name: w.name })
            : `${supportLabel(w.support as SupportKind).term} — ${supportLabel(w.support as SupportKind).plain}`,
        }, [
          w.sole ? el("span", { "aria-hidden": "true" }, "⭐ ") : null,
          el("span", { "aria-hidden": "true" }, `${w.icon} `),
          w.name,
          el("span", { "aria-hidden": "true", style: "opacity:0.7;margin-left:0.3rem;display:inline-flex" }, [
            supportIcon(w.support as SupportKind, 13),
          ]),
        ])
      )
    ),
  ]);
}

/**
 * "Don't confuse it with" — one line, high on the page, and nothing more.
 *
 * The comparison itself lives on the impostor's own page (`steps/lookalikes.ts`):
 * an impostor is shared across plants and regions, so spelling out every tell
 * here would repeat the same shrub on a dozen plant pages and push this plant's
 * own story below the fold. What belongs *here* is the warning and the way
 * through — the names, so a reader recognises the one they're holding, and a
 * link to how to tell them apart.
 *
 * A plant native to two regions shows the union of its impostors, deduped: a
 * mix-up doesn't stop being true one state over.
 */
function lookalikeLine(all: PlantEntry[]): HTMLElement | null {
  const seen = new Map<string, string>(); // id → name to show
  for (const e of all) {
    for (const { lookalike } of lookalikesForPlant(e.region.meta.id, e.plant.id)) {
      if (!seen.has(lookalike.id)) seen.set(lookalike.id, commonName(lookalike));
    }
  }
  if (!seen.size) return null;
  return el("p", { class: "kv lookalike-line" }, [
    el("span", { class: "k" }, [
      el("span", { "aria-hidden": "true" }, "🕵️ "),
      t("plant.lookalikesTitle"),
    ]),
    ...[...seen].flatMap(([id, name], i) => [
      i > 0 ? " · " : null,
      el("a", { href: `#/lookalikes/${id}` }, name),
    ]),
  ]);
}

// "Already have one? Here's how to make more." Every method the plant lists is
// spelled out in plain words (from the shared glossary), so a term like
// "stratification" never appears without the what-you-actually-do beside it.
function propagationSection(p: Plant, regionId: string): HTMLElement {
  const { methods, basis } = p.propagation;
  const methodItems = methods.map((m) => {
    const g = propagationMethod(m);
    return el("li", { class: "score-item" }, [
      el("div", { class: "score-head" }, [el("span", {}, g.name)]),
      el("p", { class: "score-why" }, g.plain),
    ]);
  });
  return sectionCard(p.id, "propagation", t("plant.propagationTitle"), [
    el("p", { class: "kv", style: "margin-top:0.5rem" }, [
      el("span", { class: "k" }, t("plant.forThisPlant")),
      propagationNote(p, regionId),
    ]),
    el("ul", { class: "score-list" }, methodItems),
    el("p", { class: "confidence", style: "margin-top:0.4rem" }, [
      el("span", {}, [
        t("plant.howToSource"),
        ...citation(basis),
        " ",
        el("a", { href: PROPAGATION_SOURCE_URL, target: "_blank", rel: "noopener" }, t("plant.usfsLink")),
      ]),
    ]),
  ]);
}

// Look this plant up in the authoritative botanical & observation databases.
// The links come from the native-plant registry's identifier bag (lib/registry):
// a stable record link where an id is reconciled, and a name search as a graceful
// fallback where it isn't yet — so the section is useful today and gets richer as
// identifiers are filled in. This is the registry's first user-facing use.
function referencesSection(p: Plant): HTMLElement {
  const entry = entryForPlant(p.id);
  const links = entry ? deepLinks(entry) : null;
  // The database *names* are proper nouns and stay as they are; only the
  // one-line description of what each is good for gets translated.
  const SOURCES: { key: string; label: string; sub: string }[] = [
    { key: "powo", label: "Plants of the World Online", sub: t("ref.powo") },
    { key: "ipni", label: "International Plant Names Index", sub: t("ref.ipni") },
    { key: "wfo", label: "World Flora Online", sub: t("ref.wfo") },
    { key: "gbif", label: "GBIF", sub: t("ref.gbif") },
    { key: "usda", label: "USDA PLANTS", sub: t("ref.usda") },
    { key: "itis", label: "ITIS", sub: t("ref.itis") },
    { key: "inaturalist", label: "iNaturalist", sub: t("ref.inaturalist") },
    { key: "wikidata", label: "Wikidata", sub: t("ref.wikidata") },
  ];
  const items = SOURCES.filter((s) => links?.[s.key]).map((s) =>
    el("li", { class: "score-item" }, [
      el("div", { class: "score-head" }, [
        el("a", { href: links![s.key] as string, target: "_blank", rel: "noopener" }, `${s.label} ↗`),
      ]),
      el("p", { class: "score-why" }, s.sub),
    ]),
  );
  const body: HTMLElement[] = [
    el("p", { style: "margin:0.5rem 0 0.3rem" }, t("ref.lede", { name: commonName(p) })),
    el("ul", { class: "score-list" }, items),
  ];
  if (entry?.primaryId) {
    body.push(
      el("p", { class: "confidence", style: "margin-top:0.4rem" }, [
        el("strong", {}, t("ref.identity")),
        el("code", {}, entry.primaryId),
        t("ref.identityRest"),
      ]),
    );
  }
  return sectionCard(p.id, "references", t("ref.title"), body);
}

/**
 * Point at the section a link asked for. Runs after the router's own
 * scroll-to-top on the next frame, so it wins.
 *
 * Scrolling is not the answer on its own, and on a laptop it's often not the
 * answer at all: the page lays its cards out in two columns past 1024px, so the
 * card being linked to is frequently already on screen — and scrolling to
 * something the reader can see just moves the page for no reason, then leaves
 * them hunting for what changed. So there are two halves here, and they cover
 * for each other:
 *
 *   - **Move only if it isn't all there.** The same test `#/settings/<card>`
 *     and `#/privacy/<section>` use. `scroll-margin-top` on `.plant-section`
 *     keeps the heading clear of the sticky header.
 *   - **Flash it either way.** A brief brand-green ring and wash (`.is-linked`
 *     in styles.css) says *this one* whether the page moved or not. It fades on
 *     its own; nothing is left highlighted for the reader to dismiss.
 *
 * Focus follows, so a keyboard or screen-reader user arrives where a sighted
 * one is looking and the next Tab lands inside the card.
 */
function revealSection(section: Section): void {
  requestAnimationFrame(() => {
    const target = document.getElementById(sectionDomId(section));
    if (!target) return;
    const box = target.getBoundingClientRect();
    // "Already there" has to mean *visible*, not merely above the fold: the
    // header is sticky, so a card whose top sits at y=30 is thirty pixels of
    // card and the rest under the green bar. Measured rather than assumed —
    // the header wraps to two rows at large text sizes.
    const header = document.querySelector(".app-header")?.getBoundingClientRect().height ?? 0;
    if (box.top < header || box.bottom > window.innerHeight) {
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    }
    // Restart the animation when the same heading is tapped twice: a class the
    // element already carries is not a change, and nothing would flash.
    target.classList.remove("is-linked");
    void target.offsetWidth;
    target.classList.add("is-linked");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
}

function renderNotFound(main: HTMLElement, slug: string): void {
  main.append(
    el("h2", { class: "step-title" }, t("plant.notFoundTitle")),
    el("p", { class: "step-lede" }, t("plant.notFoundLede", { slug })),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("plants") }, t("plant.notFoundBrowse")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ])
  );
}
