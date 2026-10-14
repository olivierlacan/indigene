// One quiet line that opens the guide page for the part of the app you're on.
//
// The guide (/guide/, built by scripts/build-guide.mjs from
// scripts/guide-catalog.mjs) explains how a part works and why; the app's own
// pages stay short. This is the bridge between the two: a page that does more
// than its controls can say links the guide once, as a `.more-link` paragraph,
// rather than growing an explainer of its own.
//
// The guide is written in English only, so the French labels say so.
import { el } from "../ui";

/** The guide pages the app links to. `guide-link.test.ts` holds each one to a
 *  published section of the catalog, so a renamed guide can't leave a dead link. */
export const LINKED_GUIDES = ["ranking", "spots", "inaturalist"] as const;
export type GuideId = (typeof LINKED_GUIDES)[number];

/** A real path (like the footer's Guide link), so the base Vite resolved is honoured. */
export const guideHref = (id: GuideId, anchor?: string): string =>
  `${import.meta.env.BASE_URL}guide/${id}/${anchor ? `#${anchor}` : ""}`;

const NS = "http://www.w3.org/2000/svg";

/** The info mark — a circled "i", drawn in `currentColor` so it follows the
 *  link's quiet-then-bright colour. Decorative: the words carry the meaning. */
function infoIcon(): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({
    viewBox: "0 0 20 20", width: "16", height: "16", "aria-hidden": "true",
    class: "guide-link-icon", fill: "none", stroke: "currentColor", "stroke-width": "1.6",
  })) svg.setAttribute(k, v);
  const add = (tag: string, attrs: Record<string, string>): void => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
  };
  add("circle", { cx: "10", cy: "10", r: "8.2" });
  add("line", { x1: "10", y1: "9", x2: "10", y2: "14.2", "stroke-linecap": "round" });
  add("circle", { cx: "10", cy: "6.1", r: "1.05", fill: "currentColor", stroke: "none" });
  return svg;
}

/** A side note, not a call to action: small, in the soft ink, with the info
 *  mark in front. It takes the link colour only under a pointer or focus. */
export function guideLink(id: GuideId, label: string, anchor?: string, style?: string): HTMLElement {
  return el("p", { class: "guide-link", style },
    el("a", { href: guideHref(id, anchor) }, [infoIcon(), el("span", {}, label)]));
}
