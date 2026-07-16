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

export function drawSizeViz(canvas: HTMLCanvasElement, plant: Plant): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 340;

  const padL = 34; // room for the feet axis
  const padR = 8;
  const padTop = 10;
  const padBottom = 26; // ground labels

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
  let cssH = 210;
  const pxPerFt = Math.min(vScaleAt(cssH), hScale);
  cssH = Math.max(
    120, // keep the axis and labels legible even for squat groundcovers
    Math.min(cssH, Math.ceil(maxHeightFt * 1.12 * pxPerFt + padTop + padBottom))
  );

  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.height = cssH + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  const ink = cssVar("--ink-soft", "#3d3d34");
  const line = cssVar("--line", "#cfcabb");
  const brand = cssVar("--brand", "#175e33");

  const groundY = cssH - padBottom;

  // Feet gridlines + labels.
  ctx.strokeStyle = line;
  ctx.fillStyle = ink;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const gridStep = niceStep(maxHeightFt);
  for (let ft = 0; ft <= maxHeightFt; ft += gridStep) {
    const y = groundY - ft * pxPerFt;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(cssW - padR, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillText(ft === 0 ? "0" : `${ft}′`, padL - 4, y);
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

  // Column 0: the human reference.
  const col0x = padL + colW * 0.5;
  drawHuman(ctx, col0x, groundY, HUMAN_FT * pxPerFt);
  ctx.fillStyle = ink;
  ctx.textBaseline = "top";
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("You", col0x, groundY + 4);
  ctx.fillText("(5′6″)", col0x, groundY + 16);

  // Columns 1..4: the plant at each age.
  const tint = plant.bloom ? bloomColors[plant.bloom.color] ?? brand : brand;
  plant.size.forEach((snap, i) => {
    const cx = padL + colW * (1.5 + i);
    drawPlant(ctx, plant.form, cx, groundY, snap.heightFt * pxPerFt, snap.spreadFt * pxPerFt, brand, tint);
    ctx.fillStyle = ink;
    ctx.font = "600 11px system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(`Yr ${snap.year}`, cx, groundY + 4);
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(fmtFt(snap.heightFt), cx, groundY + 16);
  });
}

function drawHuman(ctx: CanvasRenderingContext2D, x: number, groundY: number, h: number): void {
  const headR = Math.max(2.5, h * 0.09);
  const bodyTop = groundY - h;
  ctx.fillStyle = "rgba(90,90,80,0.85)";
  // head
  ctx.beginPath();
  ctx.arc(x, bodyTop + headR, headR, 0, Math.PI * 2);
  ctx.fill();
  // body (simple tapered torso + legs)
  const shoulder = bodyTop + headR * 2;
  const hip = groundY - h * 0.42;
  ctx.beginPath();
  ctx.moveTo(x - headR * 0.9, shoulder);
  ctx.lineTo(x + headR * 0.9, shoulder);
  ctx.lineTo(x + headR * 0.6, hip);
  ctx.lineTo(x - headR * 0.6, hip);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = Math.max(1.5, headR * 0.5);
  ctx.strokeStyle = "rgba(90,90,80,0.85)";
  ctx.beginPath();
  ctx.moveTo(x - headR * 0.4, hip);
  ctx.lineTo(x - headR * 0.4, groundY);
  ctx.moveTo(x + headR * 0.4, hip);
  ctx.lineTo(x + headR * 0.4, groundY);
  ctx.stroke();
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
