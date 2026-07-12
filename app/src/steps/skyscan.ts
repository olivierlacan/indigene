import { el, clear, toast } from "../ui";
import { navigate, store } from "../state";
import {
  OrientationSensor,
  requestOrientationPermission,
} from "../lib/orientation";
import { HorizonRecorder } from "../lib/horizon";
import { estimateSunHours } from "../lib/solar";

// Step 2b (optional): the AR-ish sky scan. Built on getUserMedia +
// DeviceOrientationEvent (NOT WebXR, which Safari/iOS lacks). Degrades to the
// manual picker whenever the camera or motion sensors are missing or denied.
export function renderScan(main: HTMLElement): () => void {
  clear(main);
  if (store.draft.lat == null) {
    navigate("location");
    return () => {};
  }

  const recorder = new HorizonRecorder();
  const sensor = new OrientationSensor();
  let stream: MediaStream | null = null;
  let raf = 0;
  let unsub: (() => void) | null = null;
  let last = { bearing: 0, elevation: 0, ok: false, trueCompass: false };
  let haveMotion = false;

  const video = el("video", { playsinline: "", muted: "", autoplay: "" }) as HTMLVideoElement;
  video.muted = true;
  const overlay = el("canvas") as HTMLCanvasElement;
  const hud = el("div", { class: "scan-hud" }, "Point at the skyline and turn slowly…");
  const progressBar = el("span", { style: "width:0%" });
  const scanner = el("div", { class: "scanner" }, [
    video,
    overlay,
    el("div", { class: "scan-hud" }, [hud, el("div", { class: "scan-progress" }, [progressBar])]),
  ]);

  const useBtn = el("button", { class: "btn btn-primary btn-block", disabled: true, onClick: finish }, "Turn all the way around first…");

  const intro = el("div", {}, [
    el("h2", { class: "step-title" }, "Scan your sky"),
    el("p", { class: "step-lede" }, "Hold your phone up and aim the crosshair at the top of the trees, roofs, or fences around you. Slowly spin a full circle, keeping the crosshair on the skyline. We'll work out how much sun this spot really gets."),
    el("div", { class: "note info" }, "Needs camera and motion access. It all stays on your phone — no video is saved or sent anywhere."),
    el("button", { class: "btn btn-primary btn-block", onClick: begin }, "Enable camera & motion"),
    el("button", { class: "btn btn-ghost btn-block", onClick: () => navigate("sun") }, "Skip — I'll use the quick pick"),
  ]);
  main.append(intro);

  async function begin(): Promise<void> {
    // Orientation permission must be requested from a user gesture (iOS).
    const perm = await requestOrientationPermission();
    if (perm === "granted") {
      haveMotion = sensor.start();
      unsub = sensor.onReading((h) => {
        last = { bearing: h.bearing, elevation: h.elevation, ok: true, trueCompass: h.trueCompass };
        recorder.sample(h.bearing, h.elevation);
      });
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play().catch(() => {});
    } catch {
      teardownSensors();
      showCameraFallback();
      return;
    }

    if (!haveMotion) {
      // Camera works but no compass — a scan can't be trusted. Be honest.
      stopStream();
      showMotionFallback();
      return;
    }

    clear(main);
    main.append(
      scanner,
      el("p", { class: "coords", id: "scan-read", "aria-live": "off", style: "margin:0.6rem 0" }, ""),
      last.trueCompass ? el("div") : el("div", { class: "note warn" }, "Heads up: this phone's compass is derived from motion sensors and can drift. If the sun estimate looks wrong, use the quick pick instead."),
      useBtn,
      el("button", { class: "btn btn-ghost btn-block", onClick: () => navigate("sun") }, "Cancel scan")
    );
    loop();
  }

  function loop(): void {
    drawOverlay();
    const cov = recorder.coverage();
    progressBar.style.width = `${Math.round(cov * 100)}%`;
    const read = document.getElementById("scan-read");
    if (read) read.textContent = `Facing ${compassName(last.bearing)} (${Math.round(last.bearing)}°) · skyline ${Math.round(Math.max(0, last.elevation))}° up · ${Math.round(cov * 100)}% of the circle scanned`;
    if (cov >= 0.75) {
      (useBtn as HTMLButtonElement).disabled = false;
      useBtn.textContent = "Use this scan →";
    } else {
      useBtn.textContent = `Keep turning… ${Math.round(cov * 100)}%`;
    }
    raf = requestAnimationFrame(loop);
  }

  function drawOverlay(): void {
    const rect = scanner.getBoundingClientRect();
    if (overlay.width !== rect.width) {
      overlay.width = rect.width;
      overlay.height = rect.height;
    }
    const ctx = overlay.getContext("2d")!;
    const w = overlay.width, h = overlay.height;
    ctx.clearRect(0, 0, w, h);
    // Crosshair to aim at the skyline.
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 18, h / 2); ctx.lineTo(w / 2 + 18, h / 2);
    ctx.moveTo(w / 2, h / 2 - 18); ctx.lineTo(w / 2, h / 2 + 18);
    ctx.stroke();
    // Compass ring showing which bearings are covered.
    const cx = w / 2, cy = h - 34, r = 22;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#7ec894";
    const angles = (recorder as unknown as { count: Uint16Array }).count;
    for (let i = 0; i < angles.length; i++) {
      if (angles[i] > 0) {
        const a = (i / angles.length) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Heading needle.
    const a = (last.bearing * Math.PI) / 180 - Math.PI / 2;
    ctx.strokeStyle = "#fff";
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
  }

  function finish(): void {
    const mask = recorder.build();
    store.draft.horizon = mask;
    store.draft.sun = estimateSunHours({
      lat: store.draft.lat!,
      lon: store.draft.lon!,
      mask,
      deciduousOverhead: store.draft.deciduousOverhead,
      source: "scan",
    });
    cleanup();
    toast("Sun estimate updated from your scan.");
    navigate("sun");
  }

  function showCameraFallback(): void {
    clear(main);
    main.append(
      el("h2", { class: "step-title" }, "Camera isn't available"),
      el("div", { class: "note warn" }, "We couldn't open the camera — it may be blocked, or this browser doesn't allow it. That's completely fine; the quick pick works just as well for most spots."),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("sun") }, "Use the quick sun pick instead")
    );
  }

  function showMotionFallback(): void {
    clear(main);
    main.append(
      el("h2", { class: "step-title" }, "Motion sensors aren't available"),
      el("div", { class: "note warn" }, "Your camera works, but this phone won't share its compass/motion, so we can't measure sun angles reliably. Rather than guess, use the quick pick — you know this spot better than a shaky sensor does."),
      el("button", { class: "btn btn-primary btn-block", onClick: () => navigate("sun") }, "Use the quick sun pick instead")
    );
  }

  function stopStream(): void {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  function teardownSensors(): void {
    unsub?.();
    sensor.stop();
  }
  function cleanup(): void {
    cancelAnimationFrame(raf);
    teardownSensors();
    stopStream();
  }

  return cleanup;
}

function compassName(deg: number): string {
  const names = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return names[Math.round(deg / 45) % 8];
}
