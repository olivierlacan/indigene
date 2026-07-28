// The size-over-time drawing. This is the feature the brief cares about most:
// not "3–5 ft" but an honest, to-scale picture of how big this plant actually
// gets at years 1, 3, 5, and 10 — with a 5'6" human silhouette for reference,
// drawn at the SAME feet-per-pixel scale so the comparison is truthful.
import type { Plant } from "../types";

const HUMAN_FT = 5.5;

const bloomColors: Record<string, string> = {
  red: "#c62828",
  "red-yellow": "#d84315",
  "coral-red": "#e5533d",
  orange: "#ef6c00",
  yellow: "#f9a825",
  gold: "#f9a825",
  white: "#e8e8e0",
  pink: "#d81b8c",
  purple: "#7b3fa0",
  lavender: "#9575cd",
  mauve: "#a1567e",
  blue: "#3f51b5",
  green: "#6d8f4e",
  tan: "#b39b6e",
  "purple-tan": "#8d7ba0",
  brown: "#8d6e63",
};

// The canvas rasterizes the theme's colors once, so unlike the surrounding CSS
// it goes stale when the device flips light/dark (iOS auto-appearance) or the
// layout width changes (rotation). Track each canvas's plant and re-render on
// those signals; listeners detach themselves once the canvas leaves the DOM.
const drawn = new WeakMap<HTMLCanvasElement, Plant>();

export function drawSizeViz(canvas: HTMLCanvasElement, plant: Plant): void {
  const alreadyWatched = drawn.has(canvas);
  drawn.set(canvas, plant);
  render(canvas, plant);
  if (!alreadyWatched) watchForRedraw(canvas);
}

function watchForRedraw(canvas: HTMLCanvasElement): void {
  const scheme = window.matchMedia("(prefers-color-scheme: dark)");
  let lastW = canvas.clientWidth;
  const stop = () => {
    scheme.removeEventListener("change", onScheme);
    ro.disconnect();
  };
  const onScheme = () => {
    if (!canvas.isConnected) return stop();
    render(canvas, drawn.get(canvas)!);
  };
  const ro = new ResizeObserver(() => {
    if (!canvas.isConnected) return stop();
    if (canvas.clientWidth === lastW) return; // height follows from our own render
    lastW = canvas.clientWidth;
    render(canvas, drawn.get(canvas)!);
  });
  scheme.addEventListener("change", onScheme);
  ro.observe(canvas);
}

function render(canvas: HTMLCanvasElement, plant: Plant): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cssW = canvas.clientWidth || 340;

  const padL = 36; // room for the feet axis
  const padR = 8;
  const padTop = 10;
  const padBottom = 38; // two full label rows below the ground line

  const cols = 5; // "You" + 4 ages
  const colW = (cssW - padL - padR) / cols;

  const last = plant.size[plant.size.length - 1];
  const maxHeightFt = Math.max(last.heightFt, HUMAN_FT, 6);
  const maxSpreadFt = Math.max(...plant.size.map((s) => s.spreadFt), 2);

  // One scale for both axes so the picture is honest. For plants wider than
  // tall the column width is the binding constraint — in that case a fixed
  // canvas height would leave a band of dead air above the drawing, so the
  // canvas shrinks to what the drawing actually needs. The widest snapshot may
  // use almost the whole column (adjacent years can very nearly touch) so the
  // shared scale stays as large as possible on narrow screens.
  const hScale = (colW * 0.94) / maxSpreadFt;
  const vScaleAt = (h: number) => (h - padTop - padBottom) / (maxHeightFt * 1.12);
  let cssH = 222;
  const pxPerFt = Math.min(vScaleAt(cssH), hScale);
  cssH = Math.max(
    132, // keep the axis and labels legible even for squat groundcovers
    Math.min(cssH, Math.ceil(maxHeightFt * 1.12 * pxPerFt + padTop + padBottom))
  );

  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.height = cssH + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  // Full-strength ink for every label: the legend has to stay readable in
  // bright sun, in both themes. --ink-soft was too faint for 12px canvas text.
  const ink = cssVar("--ink", "#14140f");
  const line = cssVar("--line", "#cfcabb");
  const brand = cssVar("--brand", "#175e33");

  const groundY = cssH - padBottom;

  // Feet gridlines + labels.
  ctx.strokeStyle = line;
  ctx.fillStyle = ink;
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const gridStep = niceStep(maxHeightFt);
  for (let ft = 0; ft <= maxHeightFt; ft += gridStep) {
    const y = groundY - ft * pxPerFt;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(cssW - padR, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillText(ft === 0 ? "0" : `${ft}′`, padL - 5, y);
  }

  // Ground line.
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(padL, groundY);
  ctx.lineTo(cssW - padR, groundY);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";

  // Column 0: the human reference, in ink so it adapts to the theme.
  const col0x = padL + colW * 0.5;
  drawHuman(ctx, col0x, groundY, HUMAN_FT * pxPerFt, ink);
  ctx.fillStyle = ink;
  ctx.textBaseline = "top";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText("You", col0x, groundY + 5);
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("(5′6″)", col0x, groundY + 20);

  // Columns 1..4: the plant at each age.
  const tint = plant.bloom ? bloomColors[plant.bloom.color] ?? brand : brand;
  plant.size.forEach((snap, i) => {
    const cx = padL + colW * (1.5 + i);
    drawPlant(ctx, plant.form, cx, groundY, snap.heightFt * pxPerFt, snap.spreadFt * pxPerFt, brand, tint);
    ctx.fillStyle = ink;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(`Yr ${snap.year}`, cx, groundY + 5);
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(fmtFt(snap.heightFt), cx, groundY + 20);
  });
}

// A standing figure with head, neck, shoulders, arms and legs — recognizably
// a person both at the ~20px it gets next to a mature tree and at the ~90px it
// gets beside a knee-high perennial.
function drawHuman(ctx: CanvasRenderingContext2D, x: number, groundY: number, h: number, color: string): void {
  const headR = Math.max(2.2, h * 0.075);
  const top = groundY - h;
  const shoulderY = top + headR * 2.4;
  const hipY = groundY - h * 0.47;
  const shoulderHalf = headR * 1.05;
  const hipHalf = headR * 0.62;
  const limbW = Math.max(1.4, headR * 0.62);

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // head
  ctx.beginPath();
  ctx.arc(x, top + headR, headR, 0, Math.PI * 2);
  ctx.fill();

  // neck
  ctx.lineWidth = Math.max(1.2, headR * 0.65);
  ctx.beginPath();
  ctx.moveTo(x, top + headR * 1.7);
  ctx.lineTo(x, shoulderY + 1);
  ctx.stroke();

  // torso: shoulders tapering to the hips (stroked thinly to round the corners)
  ctx.lineWidth = Math.max(1, headR * 0.4);
  ctx.beginPath();
  ctx.moveTo(x - shoulderHalf, shoulderY);
  ctx.lineTo(x + shoulderHalf, shoulderY);
  ctx.lineTo(x + hipHalf, hipY);
  ctx.lineTo(x - hipHalf, hipY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // arms, hanging from the shoulders with a slight outward angle
  ctx.lineWidth = limbW;
  ctx.beginPath();
  ctx.moveTo(x - shoulderHalf * 0.8, shoulderY + limbW * 0.4);
  ctx.lineTo(x - headR * 1.75, hipY + h * 0.01);
  ctx.moveTo(x + shoulderHalf * 0.8, shoulderY + limbW * 0.4);
  ctx.lineTo(x + headR * 1.75, hipY + h * 0.01);
  ctx.stroke();

  // legs, a slight A-stance
  ctx.lineWidth = limbW * 1.25;
  ctx.beginPath();
  ctx.moveTo(x - hipHalf * 0.5, hipY);
  ctx.lineTo(x - headR * 0.8, groundY);
  ctx.moveTo(x + hipHalf * 0.5, hipY);
  ctx.lineTo(x + headR * 0.8, groundY);
  ctx.stroke();

  ctx.restore();
}

function drawPlant(
  ctx: CanvasRenderingContext2D,
  form: Plant["form"],
  x: number,
  groundY: number,
  hPx: number,
  wPx: number,
  green: string,
  tint: string
): void {
  const halfW = Math.max(2, wPx / 2);
  ctx.save();
  ctx.fillStyle = green;
  ctx.strokeStyle = green;

  switch (form) {
    case "tree": {
      const trunkH = hPx * 0.34;
      const canopyH = hPx - trunkH;
      const cy = groundY - trunkH - canopyH / 2;
      // trunk
      ctx.fillStyle = "#7a5a3a";
      ctx.fillRect(x - Math.max(1.5, wPx * 0.04), groundY - trunkH, Math.max(3, wPx * 0.08), trunkH);
      // canopy
      ctx.fillStyle = green;
      ctx.beginPath();
      ctx.ellipse(x, cy, halfW, canopyH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "shrub": {
      ctx.beginPath();
      ctx.ellipse(x, groundY - hPx / 2, halfW, hPx / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "vine": {
      // a narrow support with foliage climbing it
      ctx.strokeStyle = "#8a8a72";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x, groundY - hPx);
      ctx.stroke();
      ctx.fillStyle = green;
      const leaves = Math.max(3, Math.round(hPx / 14));
      for (let i = 0; i < leaves; i++) {
        const ly = groundY - (hPx * (i + 0.5)) / leaves;
        const side = i % 2 === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.ellipse(x + side * halfW * 0.5, ly, halfW * 0.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "groundcover":
    case "fern": {
      ctx.beginPath();
      ctx.ellipse(x, groundY - hPx / 2, halfW, Math.max(2.5, hPx / 2), 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "grass": {
      const blades = Math.max(5, Math.round(wPx / 4));
      ctx.strokeStyle = green;
      ctx.lineWidth = 1.4;
      for (let i = 0; i < blades; i++) {
        const bx = x - halfW + (i / (blades - 1)) * wPx;
        const lean = (bx - x) * 0.15;
        ctx.beginPath();
        ctx.moveTo(bx, groundY);
        ctx.quadraticCurveTo(bx + lean, groundY - hPx * 0.6, bx + lean * 1.8, groundY - hPx);
        ctx.stroke();
      }
      break;
    }
    default: {
      // perennial: a leafy clump topped with a hint of bloom colour
      ctx.beginPath();
      ctx.ellipse(x, groundY - hPx * 0.4, halfW, Math.max(3, hPx * 0.4), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tint;
      const tips = Math.max(3, Math.round(wPx / 6));
      for (let i = 0; i < tips; i++) {
        const tx = x - halfW * 0.7 + (i / Math.max(1, tips - 1)) * wPx * 0.7;
        ctx.beginPath();
        ctx.arc(tx, groundY - hPx * 0.85, Math.max(1.6, wPx * 0.05), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

function niceStep(maxFt: number): number {
  if (maxFt <= 3) return 1;
  if (maxFt <= 8) return 2;
  if (maxFt <= 20) return 5;
  if (maxFt <= 45) return 10;
  return 20;
}

function fmtFt(ft: number): string {
  return ft < 1 ? `${Math.round(ft * 12)}″` : `${ft % 1 === 0 ? ft : ft.toFixed(1)}′`;
}

function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
