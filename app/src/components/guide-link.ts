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

export function guideLink(id: GuideId, label: string, anchor?: string, style?: string): HTMLElement {
  return el("p", { class: "more-link", style }, el("a", { href: guideHref(id, anchor) }, label));
}
