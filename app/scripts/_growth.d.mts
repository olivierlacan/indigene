// Types for `_growth.mjs`, which `vite.config.ts` imports.
/** `[when (ISO, UTC minute), plants, animals]` */
export type GrowthPoint = [string, number, number];
/** The same, plus how many regions there were. */
export type TotalPoint = [string, number, number, number];
export interface Growth {
  regions: Record<string, GrowthPoint[]>;
  all: TotalPoint[];
  added: { plants: Record<string, Record<string, string>>; wildlife: Record<string, Record<string, string>> };
}
export function readGrowth(root: string): Growth | null;
