// A page's drawing, as an element for the app's pages. The drawings themselves
// are in `page-art-svg.mjs`, shared with the two pages built outside the app.
import { pageArtSvg, squareArtSvg, type PageArtName, type SquareName } from "./page-art-svg.mjs";

export type { SquareName };

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
