// "Says who, and where?" — the check behind an animal's `native: true`.
//
// The catalog carries one `nativeBasis` sentence per animal, shared by every
// region it appears in. `npm run wildlife:native` asks each region's fauna
// authority about every animal tied there and commits the answer with a date
// (`data/sources/wildlife-native/`); the same script reduces those snapshots to
// the table imported here, which — like the plant table — lists only the
// animals that did *not* come back native. An animal in a checked region that
// is absent from `unconfirmed` came back native.
import TABLE from "../data/wildlife-evidence.json";
import { getLang } from "./i18n";

/** Why a region's authorities didn't confirm an animal. */
export type FaunaUnconfirmed = "introduced" | "disputed" | "absent" | "unknown" | "no-match";

interface Region {
  area: Record<string, string>;
  coarse: boolean;
  authorities: string[];
  checked: string;
  animals: number;
  unconfirmed: Record<string, string>;
}
const REGIONS = TABLE.regions as Record<string, Region>;

export interface FaunaEvidence {
  regionId: string;
  /** The place asked about, in the reader's language ("Florida", "la Floride"). */
  area: string;
  /** Who was asked, by name. */
  authorities: string[];
  /** ISO date the region was last checked. */
  checked: string;
  /** Null when every authority agreed it's native here. */
  unconfirmed: FaunaUnconfirmed | null;
}

/**
 * What the authorities said about one animal in each of the given regions.
 * Regions never checked are left out — not counted as confirmed.
 */
export function faunaEvidence(animalId: string, regionIds: string[]): FaunaEvidence[] {
  return regionIds.flatMap((regionId) => {
    const r = REGIONS[regionId];
    if (!r) return [];
    return [{
      regionId,
      area: r.area[getLang()] ?? r.area.en,
      authorities: r.authorities,
      checked: r.checked,
      unconfirmed: (r.unconfirmed[animalId] as FaunaUnconfirmed | undefined) ?? null,
    }];
  });
}
