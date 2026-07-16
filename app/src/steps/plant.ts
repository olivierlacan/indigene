// A plant's own page, at a stable, shareable URL (#/plants/<id>, canonically
// …/plants/<id>). This is the reverse of the main flow: the plant is fixed and
// the question is whether a spot deserves it. The verdict has exactly three
// honest levels — ideal, decent, unsuitable — and is computed with the same
// fit math and hard gates as the ranked list.
import { el, clear, toast } from "../ui";
import { navigate, store, resetDraft } from "../state";
import { fetchSite } from "../lib/site";
import { manualSunEstimate } from "../lib/solar";
import { findPlant, assessSpot, plantShareUrl } from "../lib/explore";
import type { PlantEntry, Suitability } from "../lib/explore";
import { scoreLabels, confidencePlain, growthPlain, DATA_SOURCES_URL } from "../lib/plain";
import { silhouetteFor } from "../components/plant-card";
import { keystoneIcon } from "../components/keystone-icon";
import { statGrid } from "../components/stat-card";
import { drawSizeViz } from "../components/size-viz";
import type { Plant, SiteData, SunEstimate } from "../types";

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function renderPlant(main: HTMLElement, slug?: string): void {
  clear(main);
  const entries = findPlant(slug ?? "");
  if (!entries.length) {
    renderNotFound(main, slug ?? "");
    return;
  }

  // Default to the first region's row for display; the suitability check picks
  // the row matching the reader's actual location.
  const { plant, region } = entries[0];
  document.title = `${plant.common} (${plant.latin}) — Indigene`;

  main.append(
    profile(plant, entries),
    suitabilityChecker(entries),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, "← More natives"),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
    ])
  );

  function profile(p: Plant, all: PlantEntry[]): HTMLElement {
    const badges = el("div", {}, [
      p.keystone
        ? el("span", { class: "badge keystone", title: "A keystone plant supports far more wildlife than most — losing it would unravel the local food web." }, [keystoneIcon(), " Keystone plant"])
        : null,
      p.noWaterEstablish
        ? el("span", { class: "badge nowater" }, "Survives with no watering")
        : el("span", { class: "badge caution" }, "Needs water to establish"),
      p.filters.petToxic ? el("span", { class: "badge caution" }, "Toxic if eaten") : null,
      p.filters.thorny ? el("span", { class: "badge caution" }, "Thorny") : null,
      p.filters.aggressive ? el("span", { class: "badge caution" }, "Spreads — give it room") : null,
      p.filters.deerResistant ? el("span", { class: "badge neutral" }, "Deer tend to leave it alone") : null,
    ]);

    const canvas = el("canvas", { class: "size-viz", role: "img", "aria-label": `Size of ${p.common} over time` });
    queueMicrotask(() => drawSizeViz(canvas, p));

    const bloom = p.bloom
      ? `Blooms ${monthNames[p.bloom.startMonth]}–${monthNames[p.bloom.endMonth]} (${p.bloom.color}).`
      : "Grown for foliage, not flowers.";

    const scoreParts = (Object.keys(scoreLabels) as (keyof typeof scoreLabels)[]).map((key) => {
      const val = (p.scores as unknown as Record<string, number>)[key];
      const label = scoreLabels[key];
      return el("li", { class: "score-item" }, [
        el("div", { class: "score-head" }, [
          el("span", {}, label.name),
          el("span", {}, `${val}${key === "host" ? ` · ${p.hostLepCount} species` : ""}`),
        ]),
        el("div", { class: "score-bar" }, [el("span", { style: `width:${val}%` })]),
        el("p", { class: "score-why" }, label.plain),
      ]);
    });

    const shareBtn = el("button", { class: "btn btn-secondary", onClick: () => share(p) }, "🔗 Share this plant");

    return el("article", { class: "plant" }, [
      el("p", { class: "region-tag", style: "margin:0 0 0.4rem;font-size:0.9rem;color:var(--ink-soft)" }, [
        "📍 Native to: ",
        ...all.flatMap((e, i) => [
          i > 0 ? " · " : null,
          el("a", { href: `#/regions/${e.region.meta.id}` }, e.region.meta.name),
        ]),
      ]),
      el("div", { class: "plant-head" }, [
        el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
        el("div", {}, [
          el("h2", { class: "plant-name", style: "margin:0" }, p.common),
          el("div", { class: "plant-latin" }, p.latin),
          badges,
        ]),
      ]),
      el("p", { class: "kv", style: "margin-top:0.75rem" }, [el("span", { class: "k" }, "Why it belongs here: "), p.nativeNote]),
      statGrid(p),
      canvas,
      el("div", { class: "size-caption" }, [
        `Drawn to scale beside a 5′6″ person. Eventually reaches about ${fmtSize(p.matureHeightFt)} tall and ${fmtSize(p.matureSpreadFt)} wide. ${growthPlain(p)}`,
      ]),
      el("div", { class: "plant-body" }, [
        el("p", { class: "kv" }, [el("span", { class: "k" }, "What it does for you & wildlife: "), p.givesNote]),
        el("p", { class: "kv" }, [el("span", { class: "k" }, "What it needs from you: "), p.careNote]),
        el("p", { class: "kv" }, [el("span", { class: "k" }, "Bloom & moisture: "), `${bloom} Prefers soil that's ${p.moisture.map(moistureShort).join(" or ")}.`]),
        el("details", {}, [
          el("summary", { style: "cursor:pointer;font-weight:700;min-height:3rem;display:flex;align-items:center;" }, "What it does for the ecosystem (tap to open)"),
          el("ul", { class: "score-list" }, scoreParts),
        ]),
        el("p", { class: "confidence" }, [
          el("strong", {}, `Confidence: ${p.confidence}. `),
          confidencePlain(p.confidence),
          " ",
          el("span", { style: "opacity:0.8" }, [
            `Source: ${p.basis} `,
            el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "All sources & licensing →"),
          ]),
        ]),
        shareBtn,
      ]),
    ]);
  }

  async function share(p: Plant): Promise<void> {
    const url = plantShareUrl(p.id);
    const data = { title: `${p.common} — Indigene`, text: `${p.common} (${p.latin}) — a native plant worth knowing. Check if your spot suits it:`, url };
    if (navigator.share) {
      await navigator.share(data).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => {});
    toast("Link copied — paste it anywhere.");
  }

  // ---- "Will it work where you want to plant it?" ----
  function suitabilityChecker(all: PlantEntry[]): HTMLElement {
    let lat: number | null = null;
    let lon: number | null = null;
    let site: SiteData | null = null;
    let sun: SunEstimate | null = null;
    let lastVerdict: Suitability | null = null;

    const verdictEl = el("div", { "aria-live": "polite" });
    const status = el("p", { class: "coords", role: "status", "aria-live": "polite" }, "No spot chosen yet.");

    const sunButtons: { key: "full" | "half" | "shade" | null; label: string }[] = [
      { key: null, label: "Not sure" },
      { key: "full", label: "☀️ Sunny most of the day" },
      { key: "half", label: "⛅ Sun about half the day" },
      { key: "shade", label: "🌳 Mostly shade" },
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

    const locateBtn = el("button", { class: "btn btn-primary btn-block", onClick: locate }, "📍 Check my location for this plant") as HTMLButtonElement;

    const latInput = el("input", { type: "number", step: "0.00001", "aria-label": "Latitude", id: "plant-lat" }) as HTMLInputElement;
    const lonInput = el("input", { type: "number", step: "0.00001", "aria-label": "Longitude", id: "plant-lon" }) as HTMLInputElement;

    function locate(): void {
      if (!("geolocation" in navigator)) {
        toast("This device can't share location — type coordinates below.");
        return;
      }
      locateBtn.textContent = "Locating…";
      locateBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locateBtn.disabled = false;
          locateBtn.textContent = "📍 Update my location";
          setSpot(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          locateBtn.disabled = false;
          locateBtn.textContent = "📍 Check my location for this plant";
          toast(err.code === err.PERMISSION_DENIED ? "Location denied — type coordinates below instead." : "Couldn't get a fix — try again or type coordinates.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }

    function setSpot(la: number, lo: number): void {
      lat = la;
      lon = lo;
      site = null;
      status.textContent = `${la.toFixed(5)}, ${lo.toFixed(5)} — looking up soil & climate…`;
      clear(verdictEl);
      fetchSite(la, lo)
        .then((s) => { site = s; })
        .catch(() => { site = null; })
        .finally(() => {
          status.textContent = `${la.toFixed(5)}, ${lo.toFixed(5)}`;
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
            }, "See everything that thrives at this spot →")
        );
      }
    }

    return el("section", { class: "card", style: "margin-top:1rem" }, [
      el("h3", { style: "margin-top:0" }, `Want to plant a ${plant.common.toLowerCase()}? Check your spot`),
      el("p", { style: "margin:0.3rem 0 0.6rem" }, [
        `Stand where you'd plant it (or type the coordinates) and Indigene checks the soil, climate and region against what this plant needs — native to ${region.meta.name} and beyond, it still has to like your exact spot.`,
      ]),
      locateBtn,
      status,
      el("p", { style: "margin:0.6rem 0 0;font-weight:650" }, "How much sun does that spot get?"),
      sunRow,
      el("details", { style: "margin-top:0.4rem" }, [
        el("summary", { style: "min-height:2.6rem;display:flex;align-items:center;font-weight:650" }, "Type coordinates instead"),
        el("div", { class: "field", style: "margin-top:0.5rem" }, [el("label", { for: "plant-lat" }, "Latitude"), latInput]),
        el("div", { class: "field" }, [el("label", { for: "plant-lon" }, "Longitude"), lonInput]),
        el("button", {
          class: "btn btn-secondary",
          onClick: () => {
            const la = parseFloat(latInput.value), lo = parseFloat(lonInput.value);
            if (Number.isFinite(la) && Number.isFinite(lo)) setSpot(la, lo);
            else toast("Enter both numbers first.");
          },
        }, "Check these coordinates"),
      ]),
      verdictEl,
    ]);
  }
}

function moistureShort(b: string): string {
  return b === "dry" ? "dry" : b === "wet" ? "wet" : "evenly moist";
}

function fmtSize(ft: number): string {
  if (ft < 1) return `${Math.round(ft * 12)} inches`;
  return `${ft % 1 === 0 ? ft : ft.toFixed(1)} ft`;
}

function renderNotFound(main: HTMLElement, slug: string): void {
  main.append(
    el("h2", { class: "step-title" }, "We don't know that plant yet"),
    el("p", { class: "step-lede" }, [
      `Nothing in Indigene's regional lists matches “${slug}”. The lists are deliberately curated — every entry is checked for native status and honest numbers — so they grow carefully.`,
    ]),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("plants") }, "Browse the natives we do know"),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
    ])
  );
}
