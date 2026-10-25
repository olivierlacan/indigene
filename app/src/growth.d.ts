// The build's `virtual:growth` module (`indigene-growth` in vite.config.ts).
declare module "virtual:growth" {
  /** `[when (ISO, UTC minute), plants, animals]` — a point each time a count moved. */
  type GrowthPoint = [string, number, number];
  /** The same across every region, plus how many regions there were. */
  type TotalPoint = [string, number, number, number];
  const growth: { regions: Record<string, GrowthPoint[]>; all: TotalPoint[] } | null;
  export default growth;
}
