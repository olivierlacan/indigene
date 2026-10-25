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
  // `npm run floras` → data/sources/regional-floras/<region>.json
  "north-michigan": [
    { name: { en: "the University of Michigan Herbarium's Michigan Flora", fr: "la flore du Michigan de l'herbier de l'université du Michigan" }, url: "https://michiganflora.net/" },
  ],
  chicago: [
    { name: { en: "the Flora of the Chicago Region", fr: "la Flore de la région de Chicago" }, url: "https://universalfqa.org/" },
    { name: { en: "Illinois's 1997 checklist", fr: "la liste de l'Illinois de 1997" }, url: "https://universalfqa.org/" },
  ],
  "mid-atlantic": [
    { name: { en: "the Pennsylvania Natural Heritage Program", fr: "le programme du patrimoine naturel de Pennsylvanie" }, url: "https://naturalheritage.dcnr.pa.gov/PlantChecklist.html" },
    { name: { en: "New Jersey's environment agency", fr: "l'agence de l'environnement du New Jersey" }, url: "https://universalfqa.org/" },
  ],
  ireland: [
    { name: { en: "the BSBI Plant Atlas 2020", fr: "l'atlas des plantes 2020 de la BSBI" }, url: "https://plantatlas2020.org/" },
  ],
  "nz-auckland": [
    { name: { en: "the Checklist of the New Zealand Flora", fr: "la liste de la flore de Nouvelle-Zélande" }, url: "https://datastore.landcareresearch.co.nz/dataset/checklist-of-the-new-zealand-flora-seed-plants-2026" },
    { name: { en: "Auckland Council", fr: "le conseil d'Auckland" }, url: "https://www.knowledgeauckland.org.nz/publications/conservation-status-of-vascular-plant-species-in-tamaki-makaurau-auckland-revised-march-2025/" },
  ],
  // `npm run floras` → the regional red lists in INPN's BDC-Statuts
  "france-atlantic": [
    { name: { en: "France's regional red lists", fr: "les listes rouges régionales françaises" }, url: "https://inpn.mnhn.fr/programme/base-de-connaissance-statuts/presentation" },
  ],
  "france-continental": [
    { name: { en: "France's regional red lists", fr: "les listes rouges régionales françaises" }, url: "https://inpn.mnhn.fr/programme/base-de-connaissance-statuts/presentation" },
  ],
  "france-alpine": [
    { name: { en: "France's regional red lists", fr: "les listes rouges régionales françaises" }, url: "https://inpn.mnhn.fr/programme/base-de-connaissance-statuts/presentation" },
  ],
  // `npm run vascan:check`, quarterly in native.yml, for Québec
  "st-lawrence": [
    { name: { en: "VASCAN, the Database of Vascular Plants of Canada", fr: "VASCAN, la base de données des plantes vasculaires du Canada" }, url: "https://data.canadensys.net/vascan/" },
  ],
};

export const isCrossChecked = (regionId: string): boolean => (SECOND_CHECKS[regionId]?.length ?? 0) > 0;
