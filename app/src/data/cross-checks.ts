// Which regions have native status cross-checked: every shipped plant put, by
// script, to a second checklist beside Kew's, one kept by botanists working in
// that place. Kew's World Checklist checks every region already
// (`native-evidence.json`); this table is the second opinion, and a region
// absent from it shows a warning on its page (`steps/region.ts`).
//
// A region earns its row by having a committed check that covers every plant it
// ships — `cross-checks.test.ts` holds each one to that, so a row here can't be
// a sentence somebody typed.
export interface SecondCheck {
  /** The checklist, as a reader would cite it, in each language. */
  name: { en: string; fr: string };
  url: string;
}

export const SECOND_CHECKS: Record<string, SecondCheck[]> = {
  // `npm run pnw:checklist` → data/sources/pnw-flora/pnw.json
  pnw: [
    { name: { en: "the Burke Museum's Flora of the Pacific Northwest", fr: "la flore du Nord-Ouest Pacifique du Burke Museum" }, url: "https://burkeherbarium.org/pnwflora/" },
    { name: { en: "OregonFlora", fr: "OregonFlora" }, url: "https://oregonflora.org/" },
  ],
  // `npm run atlas` against data/sources/atlas-florida/<region>.csv
  "florida-central": [
    { name: { en: "the Atlas of Florida Plants", fr: "l'Atlas des plantes de Floride" }, url: "https://florida.plantatlas.usf.edu/" },
  ],
  "florida-south": [
    { name: { en: "the Atlas of Florida Plants", fr: "l'Atlas des plantes de Floride" }, url: "https://florida.plantatlas.usf.edu/" },
  ],
  // `npm run bsbi:check` → data/sources/bsbi-plant-atlas/scotland-lowlands.json
  "scotland-lowlands": [
    { name: { en: "the BSBI Plant Atlas 2020", fr: "l'atlas des plantes 2020 de la BSBI" }, url: "https://plantatlas2020.org/" },
  ],
  // `npm run vascan:check`, quarterly in native.yml, for Québec
  "st-lawrence": [
    { name: { en: "VASCAN, the Database of Vascular Plants of Canada", fr: "VASCAN, la base de données des plantes vasculaires du Canada" }, url: "https://data.canadensys.net/vascan/" },
  ],
};

export const isCrossChecked = (regionId: string): boolean => (SECOND_CHECKS[regionId]?.length ?? 0) > 0;
