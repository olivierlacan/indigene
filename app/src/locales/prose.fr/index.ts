// French translations of the catalog's prose, keyed on scientific name.
//
// This is an **overlay** (see `lib/prose.ts`): anything absent falls back to the
// English the row was authored in, and the app says so on the page rather than
// mixing two languages silently. That's what made it safe to fill in over time
// instead of blocking a French edition on ~48,000 words of botanical writing.
//
// **One file per region, and a taxon lives in exactly one of them.** The table
// is keyed on scientific name alone, so a plant that appears in two regions —
// hornbeam is on both the Atlantic and Continental lists — is written once, in
// the file for the region it first appeared in, and carries *all* its wildlife
// and look-alike ties there. `npm run prose:check` enforces that: two files
// claiming the same taxon is an error, not a silent last-one-wins.
//
// The animals and the impostors get their own two files, because neither
// belongs to a region (and the ornamentals and most-wanted invasives likewise): `data/wildlife.ts` is one pool the whole catalog draws
// from, and a look-alike is cited by whichever region confuses it.
//
// Translation, not paraphrase, with three deliberate exceptions:
//
//  - **Measurements go metric in the words too.** Where a paragraph names a
//    distance or a depth, it names it the way a French gardener would. (Many
//    were already rewritten upstream as body-scale comparisons — "a hand's
//    length" — and those need no converting.)
//  - **Species names use their TAXREF name**, the same one `taxa.fr.ts` shows,
//    so a paragraph and the heading above it never call the same plant two
//    different things. Where a taxon has no established French name — most of
//    the Florida subtropicals — the paragraph uses the scientific name rather
//    than inventing one, exactly as `nameLines()` does.
//  - **Two shared taxa are written to serve both their regions.** Heather and
//    bird's-foot trefoil are on the Atlantic *and* Alpine lists, and their
//    English paragraphs were authored separately for each. One key can only
//    hold one translation, so theirs name both habitats instead of one — see
//    the note beside each.
import type { ProseTable, TaxonProse } from "../../lib/prose";
import { FLORIDA } from "./florida";
import { FRANCE_ALPINE } from "./france-alpine";
import { FRANCE_ATLANTIC } from "./france-atlantic";
import { FRANCE_CONTINENTAL } from "./france-continental";
import { FRANCE_MEDITERRANEAN } from "./france-mediterranean";
import { ALTERNATIVES_FR } from "./alternatives";
import { INVASIVES_FR } from "./invasives";
import { LOOKALIKES_FR } from "./lookalikes";
import { MID_ATLANTIC } from "./mid-atlantic";
import { PNW } from "./pnw";
import { WILDLIFE_FR } from "./wildlife";

/**
 * A region's plant paragraphs, filed under that region alone.
 *
 * Each file is written from one region's English. A plain `"Salix caprea"` key
 * used to answer for every region's row of that taxon, so a French reader in
 * Ireland or Michigan was handed paragraphs written for another list — about
 * 145 rows per field, "native here" notes included. Qualifying every key with
 * its file's region means a paragraph only ever shows on the row it was
 * translated from; any other row shows its own English, and the page says so.
 */
function inRegion(regionId: string, table: ProseTable): ProseTable {
  const out: ProseTable = {};
  for (const [key, prose] of Object.entries(table)) {
    if (key.includes("@")) {
      out[key] = prose;
      continue;
    }
    // Only the row's own paragraphs move. A region file also carries a
    // taxon's look-alike or invasive text (ivy's removal steps), which isn't
    // a region row and stays on the plain key that answers everywhere.
    const row: TaxonProse = {};
    const rest: TaxonProse = {};
    for (const [field, value] of Object.entries(prose)) {
      ((ROW_FIELDS as readonly string[]).includes(field) ? row : rest)[field as keyof TaxonProse] = value;
    }
    if (Object.keys(row).length) out[`${key}@${regionId}`] = row;
    if (Object.keys(rest).length) out[key] = rest;
  }
  return out;
}

/** The paragraphs that describe one region's row of a plant. */
const ROW_FIELDS = ["nativeNote", "careNote", "givesNote", "propagationNote", "supportNotes", "lookalikeNotes"] as const;

export const PROSE_FR: ProseTable = {
  ...inRegion("france-atlantic", FRANCE_ATLANTIC),
  ...inRegion("france-continental", FRANCE_CONTINENTAL),
  ...inRegion("france-mediterranean", FRANCE_MEDITERRANEAN),
  ...inRegion("france-alpine", FRANCE_ALPINE),
  ...inRegion("mid-atlantic", MID_ATLANTIC),
  ...inRegion("pnw", PNW),
  ...inRegion("florida-central", FLORIDA),
  ...WILDLIFE_FR,
  ...LOOKALIKES_FR,
  ...ALTERNATIVES_FR,
  ...INVASIVES_FR,
};
