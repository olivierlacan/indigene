import { el, clear, toast } from "../ui";
import { navigate, store, setSitePromise } from "../state";
import { fetchSite } from "../lib/site";
import { searchPlaces, placeLabel } from "../lib/geocode";
import { REGIONS } from "../lib/plants";
import { regionForCoords } from "../data/regions";
import { zoneChip } from "../components/zone-chip";
import { ISSUES_URL } from "../lib/plain";
import { TILE_SIZE, getTile, metersPerPixel, tileCoords } from "../lib/tiles";
import { whyThis } from "../components/learn";
import { privacyNote } from "../components/privacy-link";
import { t, tx, fmtNumber } from "../lib/i18n";
import { regionName, regionReference } from "../lib/names";

// The out-of-coverage message, shown the moment a person selects a location
// (GPS fix or search pick) outside every covered region — not sprung on them
// four screens later. A dead end always comes with doors: browse the covered
// regions' catalogs as examples, or ask on GitHub for this area (or add it —
// a region is one data file plus two registry lines).
function coverageWarning(lead: string): HTMLElement {
  return el("div", { class: "note warn" }, [
    el("strong", {}, lead + " "),
    t("location.coverage"),
    el("ul", { style: "margin:0.4rem 0 0;padding-left:1.2rem" }, [
      el("li", {}, [el("a", { href: "#/plants" }, t("location.coverageBrowse")), t("location.coverageBrowseRest")]),
      el("li", {}, [el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("location.coverageAsk")), t("location.coverageAskRest")]),
    ]),
  ]);
}

// District scale (~4 km across the canvas). Wide enough to catch landmarks
// people actually recognize — parks, highways, water — and deliberately no
// closer: ecoregions, soil grids, and climate normals are all far coarser
// than a house lot, so house-level zoom would promise precision the data
// doesn't have.
const MAP_ZOOM = 14;

// Step 1: "Where are you standing?" High-accuracy geolocation leads; the
// fallbacks — a town/ZIP search (no permissions needed) and, for people who
// already know their region, picking the plant list directly — sit behind a
// plain-words switch link so only one picker shows at a time. Nothing here
// asks anyone to know coordinates. The pin is adjusted by dragging, tapping,
// or arrow keys — three ways to the same nudge.
export function renderLocation(main: HTMLElement): void | (() => void) {
  clear(main);

  let lat = store.draft.lat ?? 40.4406; // Pittsburgh, PA as a regional default
  let lon = store.draft.lon ?? -79.9959;
  let accuracy: number | null = null;
  // Offset (metres) applied by nudging the pin, relative to the fix.
  let offN = 0;
  let offE = 0;

  const status = el("p", { class: "coords", role: "status", "aria-live": "polite" }, t("location.none"));
  // Coverage feedback for a GPS fix; search picks show theirs by the search box.
  const coverageOut = el("div", { "aria-live": "polite" });
  const canvas = el("canvas", { width: 600, height: 320, "aria-hidden": "true" });
  // Required OSM attribution; only shown while tiles are actually on screen.
  const attrib = el("a", {
    class: "map-attrib",
    href: "https://www.openstreetmap.org/copyright",
    target: "_blank",
    rel: "noopener",
    hidden: true,
  }, t("location.osmAttribution"));
  const mapWrap = el("div", {
    class: "map",
    tabindex: 0,
    role: "application",
    "aria-label": t("location.mapLabel"),
  }, [canvas, el("div", { class: "pin", "aria-hidden": "true" }, "📍"), attrib]);
  // Whether the last draw managed to show tiles; the drag scale follows the
  // layer the user is actually looking at (map tiles vs. the 5 m grid).
  let tilesShown = false;

  function effLat(): number {
    return lat + offN / 111320;
  }
  function effLon(): number {
    return lon + offE / (111320 * Math.cos((lat * Math.PI) / 180));
  }

  function updateStatus(): void {
    const off = Math.hypot(offN, offE);
    const acc = accuracy != null ? t("location.accuracy", { m: fmtNumber(Math.round(accuracy)) }) : "";
    const moved = off > 1 ? t("location.nudged", { m: fmtNumber(Math.round(off)) }) : "";
    status.textContent = `${effLat().toFixed(5)}, ${effLon().toFixed(5)}${acc}${moved}`;
    drawMap();
  }

  // Coalesce the redraws triggered by tiles arriving mid-drag.
  let raf = 0;
  function scheduleRedraw(): void {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; drawMap(); });
  }

  function drawMap(): void {
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width, h = canvas.height;
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--surface-2").trim() || "#eee";
    const line = getComputedStyle(document.documentElement).getPropertyValue("--line").trim() || "#ccc";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    // The schematic fallback: a metric grid (each cell = 5 m) that shows until
    // tiles arrive, and is the whole map when offline or tiles won't load.
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    const cell = 30;
    const gx = w / 2 - (offE / 5) * cell;
    const gy = h / 2 + (offN / 5) * cell;
    for (let x = gx % cell; x < w; x += cell) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = gy % cell; y < h; y += cell) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // OpenStreetMap tiles at one fixed neighborhood zoom, centred on the pin.
    let drewTiles = false;
    if (navigator.onLine) {
      const c = tileCoords(effLat(), effLon(), MAP_ZOOM);
      const cx = c.x * TILE_SIZE, cy = c.y * TILE_SIZE; // centre in world px
      // One shared rounded origin so adjacent tiles never show seams.
      const ox = Math.round(w / 2 - cx);
      const oy = Math.round(h / 2 - cy);
      const x0 = Math.floor((cx - w / 2) / TILE_SIZE), x1 = Math.floor((cx + w / 2) / TILE_SIZE);
      const y0 = Math.floor((cy - h / 2) / TILE_SIZE), y1 = Math.floor((cy + h / 2) / TILE_SIZE);
      for (let tx = x0; tx <= x1; tx++) {
        for (let ty = y0; ty <= y1; ty++) {
          const img = getTile(MAP_ZOOM, tx, ty, scheduleRedraw);
          if (img) {
            ctx.drawImage(img, tx * TILE_SIZE + ox, ty * TILE_SIZE + oy);
            drewTiles = true;
          }
        }
      }
    }
    tilesShown = drewTiles;
    attrib.hidden = !drewTiles;

    // Fix marker (where GPS put you) vs the nudged pin (screen centre), placed
    // at the scale of whichever layer is showing.
    const px = drewTiles ? metersPerPixel(effLat(), MAP_ZOOM) : 5 / cell;
    const fx = w / 2 - offE / px;
    const fy = h / 2 + offN / px;
    ctx.font = "13px system-ui";
    if (drewTiles) {
      // A halo keeps the marker readable over map imagery.
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.strokeText(t("location.gpsFix"), fx + 9, fy + 4);
    }
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--focus").trim() || "#1a53c4";
    ctx.globalAlpha = drewTiles ? 0.9 : 0.6;
    ctx.beginPath();
    ctx.arc(fx, fy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillText(t("location.gpsFix"), fx + 9, fy + 4);
  }

  // Metres per CSS pixel at the scale of whichever map layer is showing.
  function metersPerCssPx(): number {
    const rect = canvas.getBoundingClientRect();
    const perCanvasPx = tilesShown ? metersPerPixel(effLat(), MAP_ZOOM) : 5 / 30;
    return (canvas.width / rect.width) * perCanvasPx;
  }

  // Drag to nudge the pin (the pin stays centred; the world moves under it).
  // A press that never really moves is a tap instead: the tapped point slides
  // under the pin. Tapping is the single-pointer, no-drag way to the same nudge.
  let dragging = false;
  let lastX = 0, lastY = 0;
  let downX = 0, downY = 0;
  let movedPx = 0;
  const onDown = (e: PointerEvent) => {
    if ((e.target as Element).closest?.("a")) return; // attribution link stays clickable
    dragging = true;
    lastX = downX = e.clientX;
    lastY = downY = e.clientY;
    movedPx = 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const scale = metersPerCssPx();
    // Dragging moves the world under the pin: drag right → pin lands further
    // west, drag down → further north.
    offE -= (e.clientX - lastX) * scale;
    offN += (e.clientY - lastY) * scale;
    lastX = e.clientX; lastY = e.clientY;
    movedPx = Math.max(movedPx, Math.hypot(e.clientX - downX, e.clientY - downY));
    updateStatus();
  };
  const onUp = (e: PointerEvent) => {
    if (dragging && movedPx < 8) {
      // A tap: bring the tapped point to the centre pin.
      const rect = canvas.getBoundingClientRect();
      const scale = metersPerCssPx();
      offE += (e.clientX - rect.left - rect.width / 2) * scale;
      offN -= (e.clientY - rect.top - rect.height / 2) * scale;
      updateStatus();
    }
    dragging = false;
  };
  mapWrap.addEventListener("pointerdown", onDown);
  mapWrap.addEventListener("pointermove", onMove);
  mapWrap.addEventListener("pointerup", onUp);
  mapWrap.addEventListener("pointercancel", () => { dragging = false; });

  // Arrow keys nudge the pin — the keyboard path to what dragging does.
  mapWrap.addEventListener("keydown", (e: KeyboardEvent) => {
    const step = e.shiftKey ? 25 : 5; // metres
    switch (e.key) {
      case "ArrowUp": offN += step; break;
      case "ArrowDown": offN -= step; break;
      case "ArrowRight": offE += step; break;
      case "ArrowLeft": offE -= step; break;
      default: return;
    }
    e.preventDefault();
    updateStatus();
  });

  const locateBtn = el("button", { class: "btn btn-primary btn-block", onClick: locate }, t("location.use"));

  function locate(): void {
    if (!("geolocation" in navigator)) {
      toast(t("location.noGeolocation"));
      setMode("zip");
      return;
    }
    locateBtn.textContent = t("location.locating");
    (locateBtn as HTMLButtonElement).disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        accuracy = pos.coords.accuracy;
        offN = 0; offE = 0;
        locateBtn.textContent = t("location.update");
        (locateBtn as HTMLButtonElement).disabled = false;
        clear(coverageOut);
        if (!regionForCoords(lat, lon)) {
          coverageOut.append(coverageWarning(t("location.noListHere")));
        }
        updateStatus();
      },
      (err) => {
        locateBtn.textContent = t("location.use");
        (locateBtn as HTMLButtonElement).disabled = false;
        toast(err.code === err.PERMISSION_DENIED ? t("location.denied") : t("location.noFix"));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  // --- Town / ZIP search: the manual fallback. No permissions, no jargon. ---
  const searchInput = el("input", {
    type: "search",
    id: "place-q",
    autocomplete: "off",
    placeholder: t("location.searchPlaceholder"),
    // Shares a row with the button: shrinkable, takes the leftover width.
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
              lat = p.lat; lon = p.lon;
              offN = 0; offE = 0; accuracy = null;
              clear(searchOut);
              clear(coverageOut); // a search pick supersedes any GPS-fix warning
              searchOut.append(
                regionForCoords(p.lat, p.lon)
                  ? el("div", { class: "note info" }, [
                      el("strong", {}, t("location.pinSet", { place: p.name })),
                      // Say only what the pin's precision actually buys: the
                      // soil/slope lookups (a ~250 m grid). Sun never comes
                      // from the map, and climate/region are far coarser.
                      t("location.pinSetRest"),
                    ])
                  : coverageWarning(t("location.pinSetUncovered", { place: p.name }))
              );
              updateStatus();
              mapWrap.scrollIntoView({ block: "nearest" });
            },
          }, [
            el("span", { class: "choice-title" }, placeLabel(p)),
            el("span", { class: "choice-sub" }, `${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`),
          ])
        )
      );
    } catch {
      clear(searchOut);
      searchOut.append(el("div", { class: "note warn" }, t("location.searchOffline")));
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = t("location.search");
    }
  }

  const searchCard = el("div", { class: "card" }, [
    el("h3", {}, t("location.searchTitle")),
    el("form", {
      onSubmit: (e: Event) => { e.preventDefault(); void doSearch(); },
    }, [
      el("div", { class: "field", style: "margin-bottom:0.6rem" }, [
        el("label", { for: "place-q" }, t("location.searchLabel")),
        el("div", { style: "display:flex;gap:0.5rem" }, [searchInput, searchBtn]),
      ]),
    ]),
    searchOut,
  ]);

  // --- The escape hatch: pick a region by hand, no map point at all. ---
  // Picking is a two-step: tap a region, the list collapses to just that
  // choice (so the Next button is right there), and Next confirms it.
  let selectedRegion: string | null = store.draft.regionOverride;
  const regionList = el("div", {});

  function renderRegionList(expanded: boolean): void {
    clear(regionList);
    const shown = expanded ? REGIONS : REGIONS.filter((r) => r.meta.id === selectedRegion);
    regionList.append(
      ...shown.map((r) =>
        el("button", {
          class: "choice",
          "aria-pressed": r.meta.id === selectedRegion ? "true" : "false",
          onClick: () => {
            selectedRegion = r.meta.id;
            renderRegionList(false);
          },
        }, [
          el("span", { class: "choice-title" }, regionName(r.meta)),
          el("span", { class: "choice-sub" }, [regionReference(r.meta), " ", zoneChip(r.meta)]),
        ])
      )
    );
    if (!expanded) {
      regionList.append(
        el("button", { class: "linklike", onClick: () => renderRegionList(true) }, t("location.regionShowAll"))
      );
    }
  }
  renderRegionList(selectedRegion == null);

  const regionCard = el("div", { class: "card" }, [
    el("h3", {}, t("location.regionTitle")),
    el("p", {}, t("location.regionLede")),
    regionList,
  ]);

  // --- One way in at a time. GPS leads; the town search and the region list
  // stay tucked behind a plain-words link so the screen holds a single task
  // and the Next button stays close. The link always offers the way back.
  type Mode = "gps" | "zip" | "region";
  let mode: Mode = store.draft.regionOverride ? "region" : "gps";

  const mapBlock = el("div", {}, [
    el("div", { style: "margin:0.9rem 0" }, [mapWrap]),
    status,
    coverageOut,
  ]);
  const switcher = el("p", { class: "picker-switch" });

  function renderSwitcher(): void {
    clear(switcher);
    // `data-mode` is for the screenshot script, which has to find "pick a
    // region" in whatever language it's shooting in (see scripts/shoot.mjs).
    const link = (label: string, m: Mode) =>
      el("button", { class: "linklike", "data-mode": m, onClick: () => setMode(m) }, label);
    // `tx` rather than three concatenated fragments: the two links have to be
    // able to move inside the sentence, and English word order is not French's.
    if (mode === "gps") {
      switcher.append(...tx("location.switchFromGps", {
        a: link(t("location.switchZip"), "zip"),
        b: link(t("location.switchRegion"), "region"),
      }));
    } else if (mode === "zip") {
      switcher.append(...tx("location.switchFromOther", {
        a: link(t("location.switchGps"), "gps"),
        b: link(t("location.switchRegion"), "region"),
      }));
    } else {
      switcher.append(...tx("location.switchFromOther", {
        a: link(t("location.switchGps"), "gps"),
        b: link(t("location.switchZip"), "zip"),
      }));
    }
  }

  function setMode(m: Mode): void {
    mode = m;
    locateBtn.hidden = m !== "gps";
    searchCard.hidden = m !== "zip";
    mapBlock.hidden = m === "region";
    regionCard.hidden = m !== "region";
    renderSwitcher();
  }

  main.append(
    el("h2", { class: "step-title" }, t("location.title")),
    el("p", { class: "step-lede" }, t("location.lede")),
    whyThis(t("location.whyTitle"), t("location.why")),
    locateBtn,
    privacyNote(t("location.privacy")),
    searchCard,
    mapBlock,
    regionCard,
    switcher,
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("location.back")),
      el("button", {
        class: "btn btn-primary",
        onClick: () => {
          if (mode === "region") {
            const r = REGIONS.find((x) => x.meta.id === selectedRegion);
            if (!r) {
              toast(t("location.pickFirst"));
              return;
            }
            store.draft.lat = null;
            store.draft.lon = null;
            store.draft.site = null;
            store.draft.regionOverride = r.meta.id;
            setSitePromise(null);
            toast(t("location.usingList", { region: regionName(r.meta) }));
            navigate("sun");
            return;
          }
          const fLat = effLat(), fLon = effLon();
          store.draft.lat = fLat;
          store.draft.lon = fLon;
          // A confirmed map point puts region selection back on automatic.
          store.draft.regionOverride = null;
          // Start fetching soil/climate/elevation now, in parallel with the sun step.
          setSitePromise(
            fetchSite(fLat, fLon).then((s) => {
              store.draft.site = s;
              return s;
            })
          );
          navigate("sun");
        },
      }, t("location.next")),
    ])
  );

  setMode(mode);

  updateStatus();

  // Coming back online mid-visit: fetch tiles for the current view.
  window.addEventListener("online", scheduleRedraw);
  return () => {
    window.removeEventListener("online", scheduleRedraw);
    if (raf) cancelAnimationFrame(raf);
  };
}
