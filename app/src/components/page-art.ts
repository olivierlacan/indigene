// A page's drawing, as an element for the app's pages. The drawings themselves
// are in `page-art-svg.mjs`, shared with the two pages built outside the app.
import { pageArtSvg, type PageArtName } from "./page-art-svg.mjs";

export function pageArt(name: PageArtName): Element {
  const holder = document.createElement("div");
  // Static markup from our own module: nothing a reader typed reaches it.
  holder.innerHTML = pageArtSvg(name);
  return holder.firstElementChild!;
}
