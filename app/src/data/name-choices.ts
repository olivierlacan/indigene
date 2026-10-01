// Common names we use in place of a better-known one, and why.
//
// Some plants' most familiar English name insults people: a colonial slur, or
// an old label for an ethnic group. Where an equally common name exists, we use
// it, and the plant's page says why in one line — so a reader who knows the
// other name isn't left wondering whether this is the same plant, and nobody
// has to read the insult to find out. Where the offensive name is the only one
// people know, it stays (a plant nobody can find helps no one); this table is
// only for the choices we could make.
//
// Scientific names never change here: they're fixed by the naming codes.
// French names aren't in this table because none of these carry over — a French
// reader sees *griffe de sorcière*, which insults no one — so the French
// strings for these reasons are empty and the note doesn't show.
//
// See "Native plants, not nativism" in CLAUDE.md.
export type NameReason = "slur" | "oriental";

export interface NameChoice {
  reason: NameReason;
  /** Another name the reader may know it by, one we're happy to print. */
  also: string;
}

export const NAME_CHOICES: Record<string, NameChoice> = {
  // Its best-known English name is a Dutch colonial slur for the Khoikhoi
  // people of the Cape, where the plant comes from. At home it's the sour fig
  // (Afrikaans *suurvy*); in California, where it smothers dunes, it's ice plant.
  "Carpobrotus edulis": { reason: "slur", also: "sour fig" },
  // "Oriental" as a word for Asian people is one they didn't choose and the US
  // struck from federal law in 2016. "Asian bittersweet" is in common use by
  // state invasive-plant councils and extension services.
  "Celastrus orbiculatus": { reason: "oriental", also: "Oriental bittersweet" },
};
