// A plant's own page, at a stable, shareable URL (#/plants/<id>, canonically
// …/plants/<id>). This is the reverse of the main flow: the plant is fixed and
// the question is whether a spot deserves it. The verdict has exactly three
// honest levels — ideal, decent, unsuitable — and is computed with the same
// fit math and hard gates as the ranked list.
import { el, clear, toast } from "../ui";
import { navigate, store, resetDraft } from "../state";
import { fetchSite } from "../lib/site";
import { searchPlaces, placeLabel, nearestPlaceName } from "../lib/geocode";
import { manualSunEstimate } from "../lib/solar";
import { findPlant, assessSpot, plantShareUrl } from "../lib/explore";
import type { PlantEntry, Suitability } from "../lib/explore";
import { wildlifeForPlant, relianceOf } from "../lib/wildlife";
import { supportLabel } from "../lib/plain";
import { supportIcon } from "../components/support-icon";
import { SCORE_KEYS, scoreLabel, bloomColorWord, confidencePlain, growthPlain, moistureWord, propagationMethod, PROPAGATION_SOURCE_URL, SOURCES_ROUTE } from "../lib/plain";
import { citation } from "../components/citation";
import { silhouetteFor } from "../components/plant-card";
import { keystoneIcon } from "../components/keystone-icon";
import { statGrid } from "../components/stat-card";
import { drawSizeViz } from "../components/size-viz";
import { entryForPlant, deepLinks } from "../lib/registry";
import { nearbyObservationsSection } from "../components/nearby-observations";
import { privacyNote } from "../components/privacy-link";
import type { Plant, SiteData, SunEstimate, SupportKind } from "../types";
import { t, fmtNumber, fmtList, monthName } from "../lib/i18n";
import { length, humanHeightLabel } from "../lib/units";
import { commonName, nameLines, regionName } from "../lib/names";
import { prose, propagationNote, isUntranslated } from "../lib/prose";

// The anchorable sections below the profile share one deep-link scheme:
// #/plants/<slug>/<section>. A link straight to a section scrolls it into
// view; every section is always open.
const SECTIONS = ["ecosystem", "propagation", "references", "spot"] as const;
type Section = (typeof SECTIONS)[number];
const sectionDomId = (s: Section): string => `sec-${s}`;

export function renderPlant(main: HTMLElement, param?: string): void {
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

  // Default to the first region's row for display; the suitability check picks
  // the row matching the reader's actual location.
  const { plant, region } = entries[0];
  document.title = t("plant.docTitle", { name: commonName(plant), latin: plant.latin });

  main.append(
    profile(plant, entries),
    ecosystemSection(plant, entries),
    nearbyObservationsSection(plant),
    propagationSection(plant),
    referencesSection(plant),
    suitabilityChecker(entries),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("plant.more")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ])
  );

  if (section) revealSection(section);

  function profile(p: Plant, all: PlantEntry[]): HTMLElement {
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

    const bloom = p.bloom
      ? t("card.bloomRange", {
          from: monthName(p.bloom.startMonth, "short"),
          to: monthName(p.bloom.endMonth, "short"),
          color: bloomColorWord(p.bloom.color),
        })
      : t("card.foliage");

    const shareBtn = el("button", { class: "btn btn-secondary", onClick: () => share(p) }, t("plant.share"));
    const names = nameLines(p);

    return el("article", { class: "plant" }, [
      el("p", { class: "region-tag", style: "margin:0 0 0.4rem;font-size:0.9rem;color:var(--ink-soft)" }, [
        t("plant.nativeTo"),
        ...all.flatMap((e, i) => [
          i > 0 ? " · " : null,
          el("a", { href: `#/regions/${e.region.meta.id}` }, regionName(e.region.meta)),
        ]),
      ]),
      el("div", { class: "plant-head" }, [
        el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
        el("div", {}, [
          el("h2", { class: "plant-name", style: "margin:0" }, names.title),
          el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" }, names.sub),
          badges,
        ]),
      ]),
      el("p", { class: "kv", style: "margin-top:0.75rem" }, [el("span", { class: "k" }, t("plant.whyBelongs")), prose(p, "nativeNote")]),
      // Said once, at the top, rather than on every paragraph: some of the
      // catalog's writing is still in English (see lib/prose).
      isUntranslated(p) ? el("p", { class: "note info", style: "margin:0.5rem 0" }, t("names.untranslated")) : null,
      statGrid(p),
      canvas,
      el("div", { class: "size-caption" }, [
        `${t("card.sizeCaption", {
          human: humanHeightLabel(),
          height: length(p.matureHeightFt),
          spread: length(p.matureSpreadFt),
        })} ${growthPlain(p)}`,
      ]),
      el("div", { class: "plant-body" }, [
        el("p", { class: "kv" }, [el("span", { class: "k" }, t("card.gives")), prose(p, "givesNote")]),
        el("p", { class: "kv" }, [el("span", { class: "k" }, t("card.needs")), prose(p, "careNote")]),
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
        shareBtn,
      ]),
    ]);
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

    return el("section", { class: "card", id: sectionDomId("spot"), style: "margin-top:1rem" }, [
      // No plant name in the heading: it changes width per plant and would
      // wrap the card title on a phone. The page is already about this plant.
      el("h3", { style: "margin-top:0" }, t("plant.checkSpotTitle")),
      el("p", { style: "margin:0.3rem 0 0.6rem" },
        t("plant.checkSpotLede", { region: regionName(region.meta) })),
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
            el("div", { style: "display:flex;gap:0.5rem" }, [searchInput, searchBtn]),
          ]),
        ]),
        searchOut,
      ]),
      verdictEl,
    ]);
  }
}

// A standalone card — the same shape the "Want to plant?" tool uses — that a
// deep link scrolls into view. Always open: these used to collapse, but
// content shouldn't hide behind a tap.
function sectionCard(section: Section, heading: string, body: HTMLElement[]): HTMLElement {
  return el("section", { class: "card plant-section", id: sectionDomId(section) }, [
    el("h3", {}, heading),
    ...body,
  ]);
}

// The seven ecosystem-benefit scores, each with its fixed icon and plain-words
// gloss. Its own card now, so it can be linked to and opened directly. When the
// plant has named wildlife ties, they lead the card — the specific creatures a
// person can go looking for, above the abstract scores.
function ecosystemSection(p: Plant, entries: PlantEntry[]): HTMLElement {
  const scoreParts = SCORE_KEYS.map((key) => {
    const val = (p.scores as unknown as Record<string, number>)[key];
    const label = scoreLabel(key);
    return el("li", { class: "score-item" }, [
      el("div", { class: "score-head" }, [
        el("span", {}, [el("span", { "aria-hidden": "true" }, `${label.icon} `), label.name]),
        el("span", {}, `${fmtNumber(val)}${key === "host" ? ` · ${t("card.hostSpecies", { n: fmtNumber(p.hostLepCount) })}` : ""}`),
      ]),
      el("div", { class: "score-bar" }, [el("span", { style: `width:${val}%` })]),
      el("p", { class: "score-why" }, label.plain),
    ]);
  });
  const feeds = whoItFeeds(entries);
  return sectionCard("ecosystem", t("plant.ecosystemTitle"), [
    ...(feeds ? [feeds] : []),
    el("ul", { class: "score-list" }, scoreParts),
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

// "Already have one? Here's how to make more." Every method the plant lists is
// spelled out in plain words (from the shared glossary), so a term like
// "stratification" never appears without the what-you-actually-do beside it.
function propagationSection(p: Plant): HTMLElement {
  const { methods, basis } = p.propagation;
  const methodItems = methods.map((m) => {
    const g = propagationMethod(m);
    return el("li", { class: "score-item" }, [
      el("div", { class: "score-head" }, [el("span", {}, g.name)]),
      el("p", { class: "score-why" }, g.plain),
    ]);
  });
  return sectionCard("propagation", t("plant.propagationTitle"), [
    el("p", { class: "kv", style: "margin-top:0.5rem" }, [
      el("span", { class: "k" }, t("plant.forThisPlant")),
      propagationNote(p),
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
  return sectionCard("references", t("ref.title"), body);
}

// Bring the deep-linked section into view. Runs after the router's own
// scroll-to-top on the next frame, so it wins.
function revealSection(section: Section): void {
  requestAnimationFrame(() => {
    const target = document.getElementById(sectionDomId(section));
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
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
