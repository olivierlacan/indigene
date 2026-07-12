// One interface over two very different compass implementations:
//   iOS Safari : event.webkitCompassHeading (0=N, clockwise, degrees)
//   Everyone   : derive heading from `alpha` + the screen's own rotation
// Plus a "pitch" (how far above/below the horizon the back camera is aimed),
// derived from `beta`. Sensors are noisy and sometimes lie, so callers must
// always keep the manual fallback available — see the brief.

export type PermissionState = "granted" | "denied" | "unsupported";

export interface Heading {
  /** Compass bearing the back camera faces, 0-360 clockwise from north. */
  bearing: number;
  /** Elevation the back camera is aimed at, degrees (+up, 0=horizon). */
  elevation: number;
  /** true only on iOS where webkitCompassHeading is a real magnetometer read. */
  trueCompass: boolean;
}

type Listener = (h: Heading) => void;

function hasOrientation(): boolean {
  return typeof window !== "undefined" && "DeviceOrientationEvent" in window;
}

// iOS 13+ gates the sensor behind a user-gesture-triggered permission prompt.
function needsPermission(): boolean {
  return (
    hasOrientation() &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown })
      .requestPermission === "function"
  );
}

export async function requestOrientationPermission(): Promise<PermissionState> {
  if (!hasOrientation()) return "unsupported";
  if (!needsPermission()) return "granted"; // Android/desktop: no prompt
  try {
    const fn = (
      DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<"granted" | "denied">;
      }
    ).requestPermission;
    const res = await fn();
    return res === "granted" ? "granted" : "denied";
  } catch {
    return "denied";
  }
}

export class OrientationSensor {
  private listeners = new Set<Listener>();
  private handler = (e: DeviceOrientationEvent) => this.onEvent(e);
  private running = false;
  private screenAngle = 0;

  start(): boolean {
    if (!hasOrientation() || this.running) return this.running;
    this.updateScreenAngle();
    window.addEventListener("orientationchange", this.updateScreenAngleBound);
    // `deviceorientationabsolute` is more reliable on Android when present.
    window.addEventListener("deviceorientationabsolute", this.handler as EventListener);
    window.addEventListener("deviceorientation", this.handler);
    this.running = true;
    return true;
  }

  stop(): void {
    window.removeEventListener("deviceorientationabsolute", this.handler as EventListener);
    window.removeEventListener("deviceorientation", this.handler);
    window.removeEventListener("orientationchange", this.updateScreenAngleBound);
    this.running = false;
  }

  onReading(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private updateScreenAngleBound = () => this.updateScreenAngle();
  private updateScreenAngle() {
    const so = (screen as Screen & { orientation?: { angle: number } }).orientation;
    this.screenAngle = so?.angle ?? (window.orientation as number | undefined) ?? 0;
  }

  private onEvent(e: DeviceOrientationEvent) {
    const webkitHeading = (e as unknown as { webkitCompassHeading?: number })
      .webkitCompassHeading;
    let bearing: number;
    let trueCompass = false;

    if (typeof webkitHeading === "number" && !Number.isNaN(webkitHeading)) {
      bearing = webkitHeading; // already 0=N clockwise
      trueCompass = true;
    } else if (e.alpha != null) {
      // alpha is counter-clockwise from north; convert and correct for the
      // screen's own rotation so "up the screen" always means the same bearing.
      bearing = mod(360 - e.alpha + this.screenAngle, 360);
    } else {
      return; // nothing usable this event
    }

    // Elevation the back camera points at. Held upright (beta≈90) the camera
    // looks at the horizon; tilting the top away (beta>90) looks upward.
    const beta = e.beta ?? 90;
    const elevation = clamp(beta - 90, -90, 90);

    const reading: Heading = { bearing: mod(bearing, 360), elevation, trueCompass };
    this.listeners.forEach((l) => l(reading));
  }
}

function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}
function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}
