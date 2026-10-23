/**
 * Which link on a redrawn page is the one the reader just tapped.
 *
 * A tap that redraws the page it's on (a sort, a filter, a region chip) keeps
 * the tapped control under the reader's finger — `restorePlace` in main.ts.
 * That needs the control found again on the new page, and its address alone
 * can't do it:
 *
 * - Two links can share an address. The wildlife index has the "Animal type"
 *   segment and another link to the same grouped view higher up; picking the
 *   first put that one under the finger, and the page landed at the top.
 * - A toggle's address changes when it's tapped. Off, the "Pet-safe" filter
 *   links to "pet-safe on"; on, it links to "pet-safe off" — and now the A–Z
 *   segment links to "pet-safe on". Every filter on a region page put the sort
 *   control under the finger instead, hundreds of pixels away.
 *
 * So a control that knows it's a control says which one it is (`data-keep`,
 * set by the view panel), and that wins. Anything else is matched by address,
 * and of several matches the one nearest where the tapped link sat.
 */

export interface PlaceMark {
  /** The control's own name (`data-keep`), when it has one. */
  keep?: string;
  href: string;
  /** Its top edge in document coordinates (viewport top + scrollY). */
  y: number;
}

/** The index in `candidates` of the tapped link, or -1 if it's gone. */
export function findKept(candidates: readonly PlaceMark[], tapped: PlaceMark): number {
  if (tapped.keep) return candidates.findIndex((c) => c.keep === tapped.keep);
  let best = -1;
  for (const [i, c] of candidates.entries()) {
    if (c.href !== tapped.href) continue;
    if (best < 0 || Math.abs(c.y - tapped.y) < Math.abs(candidates[best].y - tapped.y)) best = i;
  }
  return best;
}
