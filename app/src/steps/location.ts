import { el, clear, toast } from "../ui";
import { navigate, store, setSitePromise } from "../state";
import { fetchSite } from "../lib/site";

// Step 1: "Where are you standing?" High-accuracy geolocation, with a draggable
// pin to nudge the exact point and a manual lat/lon entry when location is
// denied. Nothing downstream works without a coordinate, so this is a gate.
export function renderLocation(main: HTMLElement): void {
  clear(main);

  let lat = store.draft.lat ?? 40.4406; // Pittsburgh, PA as a regional default
  let lon = store.draft.lon ?? -79.9959;
  let accuracy: number | null = null;
  // Offset (metres) applied by dragging the pin, relative to the fix.
  let offN = 0;
  let offE = 0;

  const status = el("p", { class: "coords", role: "status", "aria-live": "polite" }, "No location yet.");
  const canvas = el("canvas", { width: 600, height: 320, "aria-hidden": "true" });
  const mapWrap = el("div", { class: "map" }, [canvas, el("div", { class: "pin", "aria-hidden": "true" }, "📍")]);

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

  function drawMap(): void {
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width, h = canvas.height;
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--surface-2").trim() || "#eee";
    const line = getComputedStyle(document.documentElement).getPropertyValue("--line").trim() || "#ccc";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    // A simple metric grid: each cell = 5 m, so drag distance reads as real.
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    const cell = 30;
    const cxp = w / 2 - (offE / 5) * cell;
    const cyp = h / 2 + (offN / 5) * cell;
    for (let x = cxp % cell; x < w; x += cell) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = cyp % cell; y < h; y += cell) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    // Fix marker (where GPS put you) vs the nudged pin (screen centre).
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--focus").trim() || "#1a53c4";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(cxp, cyp, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.font = "13px system-ui";
    ctx.fillText("GPS fix", cxp + 9, cyp + 4);
  }

  // Drag to nudge the pin (the pin stays centred; the world moves under it).
  let dragging = false;
  let lastX = 0, lastY = 0;
  const cellMeters = 5 / 30; // metres per screen pixel at this zoom
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const scale = (canvas.width / rect.width) * cellMeters;
    offE += (e.clientX - lastX) * scale;
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
    el("p", { class: "step-lede" }, "Get your location, then drag the pin if you want to fine-tune the exact spot — the driveway strip and the lawn ten feet away can be very different."),
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
}
