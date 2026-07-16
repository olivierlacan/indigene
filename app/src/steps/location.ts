import { el, clear, toast } from "../ui";
import { navigate, store, setSitePromise } from "../state";
import { fetchSite } from "../lib/site";
import { TILE_SIZE, getTile, metersPerPixel, tileCoords } from "../lib/tiles";

// Neighborhood scale (~2 km across the canvas). Enough to see you're in the
// right place, deliberately no closer: ecoregions, soil grids, and climate
// normals are all far coarser than a house lot, so house-level zoom would
// promise precision the data doesn't have.
const MAP_ZOOM = 15;

// Step 1: "Where are you standing?" High-accuracy geolocation, with a draggable
// pin to nudge the exact point and a manual lat/lon entry when location is
// denied. Nothing downstream works without a coordinate, so this is a gate.
export function renderLocation(main: HTMLElement): void | (() => void) {
  clear(main);

  let lat = store.draft.lat ?? 40.4406; // Pittsburgh, PA as a regional default
  let lon = store.draft.lon ?? -79.9959;
  let accuracy: number | null = null;
  // Offset (metres) applied by dragging the pin, relative to the fix.
  let offN = 0;
  let offE = 0;

  const status = el("p", { class: "coords", role: "status", "aria-live": "polite" }, "No location yet.");
  const canvas = el("canvas", { width: 600, height: 320, "aria-hidden": "true" });
  // Required OSM attribution; only shown while tiles are actually on screen.
  const attrib = el("a", {
    class: "map-attrib",
    href: "https://www.openstreetmap.org/copyright",
    target: "_blank",
    rel: "noopener",
    hidden: true,
  }, "© OpenStreetMap contributors");
  const mapWrap = el("div", { class: "map" }, [canvas, el("div", { class: "pin", "aria-hidden": "true" }, "📍"), attrib]);
  // Whether the last draw managed to show tiles; the drag scale follows the
  // layer the user is actually looking at (map tiles vs. the 5 m grid).
  let tilesShown = false;

  const latInput = el("input", { type: "number", step: "0.00001", value: String(lat), "aria-label": "Latitude" }) as HTMLInputElement;
  const lonInput = el("input", { type: "number", step: "0.00001", value: String(lon), "aria-label": "Longitude" }) as HTMLInputElement;

  function effLat(): number {
    return lat + offN / 111320;
  }
  function effLon(): number {
    return lon + offE / (111320 * Math.cos((lat * Math.PI) / 180));
  }

  function updateStatus(): void {
    const off = Math.hypot(offN, offE);
    const acc = accuracy != null ? ` · GPS accuracy ±${Math.round(accuracy)} m` : "";
    const moved = off > 1 ? ` · nudged ${Math.round(off)} m` : "";
    status.textContent = `${effLat().toFixed(5)}, ${effLon().toFixed(5)}${acc}${moved}`;
    latInput.value = effLat().toFixed(5);
    lonInput.value = effLon().toFixed(5);
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
      ctx.strokeText("GPS fix", fx + 9, fy + 4);
    }
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--focus").trim() || "#1a53c4";
    ctx.globalAlpha = drewTiles ? 0.9 : 0.6;
    ctx.beginPath();
    ctx.arc(fx, fy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillText("GPS fix", fx + 9, fy + 4);
  }

  // Drag to nudge the pin (the pin stays centred; the world moves under it).
  let dragging = false;
  let lastX = 0, lastY = 0;
  const gridMeters = 5 / 30; // metres per canvas pixel on the fallback grid
  const onDown = (e: PointerEvent) => {
    if ((e.target as Element).closest?.("a")) return; // attribution link stays clickable
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const perPx = tilesShown ? metersPerPixel(effLat(), MAP_ZOOM) : gridMeters;
    const scale = (canvas.width / rect.width) * perPx;
    // Dragging moves the world under the pin: drag right → pin lands further
    // west, drag down → further north.
    offE -= (e.clientX - lastX) * scale;
    offN += (e.clientY - lastY) * scale;
    lastX = e.clientX; lastY = e.clientY;
    updateStatus();
  };
  const onUp = () => { dragging = false; };
  mapWrap.addEventListener("pointerdown", onDown);
  mapWrap.addEventListener("pointermove", onMove);
  mapWrap.addEventListener("pointerup", onUp);
  mapWrap.addEventListener("pointercancel", onUp);

  const locateBtn = el("button", { class: "btn btn-primary btn-block", onClick: locate }, "📍 Use my location");

  function locate(): void {
    if (!("geolocation" in navigator)) {
      toast("This device can't share location — type it in below.");
      return;
    }
    locateBtn.textContent = "Locating…";
    (locateBtn as HTMLButtonElement).disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        accuracy = pos.coords.accuracy;
        offN = 0; offE = 0;
        locateBtn.textContent = "📍 Update my location";
        (locateBtn as HTMLButtonElement).disabled = false;
        updateStatus();
      },
      (err) => {
        locateBtn.textContent = "📍 Use my location";
        (locateBtn as HTMLButtonElement).disabled = false;
        toast(err.code === err.PERMISSION_DENIED ? "Location denied — type your spot in below instead." : "Couldn't get a fix — try again or type it in.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  main.append(
    el("h2", { class: "step-title" }, "Where are you standing?"),
    el("p", { class: "step-lede" }, "Get your location, then check the map — if the pin isn't where you're really standing, drag to nudge it, or type exact coordinates below."),
    locateBtn,
    el("div", { style: "margin:0.9rem 0" }, [mapWrap]),
    status,
    el("details", { style: "margin-top:0.75rem" }, [
      el("summary", { style: "min-height:3rem;display:flex;align-items:center;font-weight:650" }, "Type coordinates instead"),
      el("div", { class: "field", style: "margin-top:0.5rem" }, [
        el("label", { for: "lat" }, "Latitude"),
        Object.assign(latInput, { id: "lat" }),
      ]),
      el("div", { class: "field" }, [
        el("label", { for: "lon" }, "Longitude"),
        Object.assign(lonInput, { id: "lon" }),
      ]),
      el("button", {
        class: "btn btn-secondary",
        onClick: () => {
          const la = parseFloat(latInput.value), lo = parseFloat(lonInput.value);
          if (Number.isFinite(la) && Number.isFinite(lo)) {
            lat = la; lon = lo; offN = 0; offE = 0; accuracy = null; updateStatus();
            toast("Coordinates set.");
          }
        },
      }, "Use these coordinates"),
    ]),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Back"),
      el("button", {
        class: "btn btn-primary",
        onClick: () => {
          const fLat = effLat(), fLon = effLon();
          store.draft.lat = fLat;
          store.draft.lon = fLon;
          // Start fetching soil/climate/elevation now, in parallel with the sun step.
          setSitePromise(
            fetchSite(fLat, fLon).then((s) => {
              store.draft.site = s;
              return s;
            })
          );
          navigate("sun");
        },
      }, "Next: measure the sun →"),
    ])
  );

  updateStatus();

  // Coming back online mid-visit: fetch tiles for the current view.
  window.addEventListener("online", scheduleRedraw);
  return () => {
    window.removeEventListener("online", scheduleRedraw);
    if (raf) cancelAnimationFrame(raf);
  };
}
