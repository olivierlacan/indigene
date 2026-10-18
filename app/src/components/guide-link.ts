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
export const LINKED_GUIDES = ["ranking", "spots", "inaturalist", "find", "regions", "sources"] as const;
export type GuideId = (typeof LINKED_GUIDES)[number];

/** A real path (like the footer's Guide link), so the base Vite resolved is honoured. */
export const guideHref = (id: GuideId, anchor?: string): string =>
  `${import.meta.env.BASE_URL}guide/${id}/${anchor ? `#${anchor}` : ""}`;

const NS = "http://www.w3.org/2000/svg";

function mark(draw: (add: (tag: string, a: Record<string, string>) => void) => void): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({
    viewBox: "0 0 20 20", width: "16", height: "16", "aria-hidden": "true",
    class: "guide-link-icon", fill: "none", stroke: "currentColor", "stroke-width": "1.6",
    "stroke-linecap": "round", "stroke-linejoin": "round",
  })) svg.setAttribute(k, v);
  draw((tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
  });
  return svg;
}

/** A circled "i": how this part works (the guide). */
export const infoIcon = (): SVGSVGElement =>
  mark((add) => {
    add("circle", { cx: "10", cy: "10", r: "8.2" });
    add("line", { x1: "10", y1: "9", x2: "10", y2: "14.2" });
    add("circle", { cx: "10", cy: "6.1", r: "1.05", fill: "currentColor", stroke: "none" });
  });

/** A padlock: where your data goes (the Privacy page). */
const lockIcon = (): SVGSVGElement =>
  mark((add) => {
    add("rect", { x: "4", y: "9", width: "12", height: "8.5", rx: "1.8" });
    add("path", { d: "M6.8 9V6.6a3.2 3.2 0 0 1 6.4 0V9" });
  });

/**
 * A side note, not a call to action: small, in the soft ink, with its mark in
 * front. It takes the link colour only under a pointer or focus. `info` opens
 * the guide; `lock` opens the Privacy page — same look, so a card that carries
 * both shows them as one quiet pair.
 */
export function quietLink(kind: "info" | "lock", href: string, label: string, style?: string): HTMLElement {
  return el("p", { class: "guide-link", style },
    el("a", { href }, [kind === "info" ? infoIcon() : lockIcon(), el("span", {}, label)]));
}

export function guideLink(id: GuideId, label: string, anchor?: string, style?: string): HTMLElement {
  return quietLink("info", guideHref(id, anchor), label, style);
}
