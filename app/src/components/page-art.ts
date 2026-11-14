// A page's drawing, as an element for the app's pages. The drawings themselves
// are in `page-art-svg.mjs`, shared with the two pages built outside the app.
import { pageArtSvg, squareArtSvg, figureArtSvg, type PageArtName, type SquareName, type FigureName } from "./page-art-svg.mjs";

export type { SquareName, FigureName };

export function pageArt(name: PageArtName): Element {
  const holder = document.createElement("div");
  // Static markup from our own module: nothing a reader typed reaches it.
  holder.innerHTML = pageArtSvg(name);
  return holder.firstElementChild!;
}

/** A small square drawing for beside a section. */
export function squareArt(name: SquareName): Element {
  const holder = document.createElement("div");
  holder.innerHTML = squareArtSvg(name);
  return holder.firstElementChild!;
}

/** A how-to figure with its caption under it. The caption is the image's
 *  label too, so the drawing is never a picture nobody described. */
export function figureArt(name: FigureName, caption: string): HTMLElement {
  const fig = document.createElement("figure");
  fig.className = "guide-figure";
  fig.innerHTML = figureArtSvg(name, caption);
  // Said once: the caption is on the page, so the label needn't be read twice.
  const cap = document.createElement("figcaption");
  cap.setAttribute("aria-hidden", "true");
  cap.textContent = caption;
  fig.append(cap);
  return fig;
}
