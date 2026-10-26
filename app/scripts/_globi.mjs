// The studies GloBI relays, told apart in two places: in the citation strings
// GloBI returns, and in the short names our ties' `basis` lines use for them.
//
// `wildlife-candidates.mjs` turns a citation into the short name a basis is
// written with (its `SOURCE_NAMES`); this table goes the other way for
// `check-wildlife-ties.mjs`, reading which studies a basis cites so GloBI can
// be asked whether those studies still record the pair. A study added there
// needs a line here, or its ties check as "cites nothing GloBI relays".
//
// Each entry: a label for reports, how a basis names the study, and how
// GloBI's citation names it.
export const STUDIES = [
  ["HOSTS (Robinson et al., NHM)", /HOSTS/, /Robinson.*Ackery.*Kitching|HOSTS/i],
  ["trophiCH (Reji Chacko et al. 2024)", /trophiCH/, /trophiCH/i],
  ["EuPPollNet (Lanuza et al. 2025)", /EuPPollNet|Lanuza/, /EuPPollNet|Lanuza/i],
  ["DoPI (Balfour et al. 2022)", /DoPI|Balfour/, /DoPI: The Database of Pollinator Interactions|Balfour/i],
  ["Fricke & Svenning 2020", /Fricke/, /Fricke/i],
  ["Avian Diet Database (Hurlbert et al. 2021)", /Avian Diet|Hurlbert/, /Avian Diet Database|Hurlbert/i],
  ["Robertson 1929", /Robertson 1929/, /Robertson, C\./i],
  ["Ferrer-Paris et al. 2013", /Ferrer-Paris/, /Ferrer-Paris/i],
  ["Hale et al. 2024", /Hale et al/, /Hale_?,? ?2024|Hale, Kayla/i],
  ["Groom et al. 2020", /Groom/, /Groom, Q\.J\./i],
  ["Thessen 2014 (Encyclopedia of Life)", /Thessen|Encyclopedia of Life/, /A\. Thessen/i],
  ["Redhead et al. 2018", /Redhead/, /Redhead/i],
  ["Snow Entomological Museum", /Snow Entomological/, /Snow Entomological Museum|University of Kansas Natural History/i],
  ["SCAN", /SCAN|Symbiota/, /Symbiota Collections of Arthropods|SCAN/i],
  ["Web of Life", /Web of Life/, /Web of Life/i],
  ["NHM Interactions Bank", /NHM Interactions Bank/, /NHM Interactions Bank/i],
  ["Muñoz et al. 2018", /Muñoz/, /Muñoz|Munoz/i],
  ["LIFE 4 Pollinators (Barberis et al. 2025)", /LIFE 4 Pollinators|Barberis/, /LIFE 4 Pollinators|Barberis/i],
  ["National Database of Plant Pollinators", /National Database of Plant Pollinators/, /Center for Plant Conservation|Plant Pollinators/i],
  ["GBIF-US bee occurrences", /GBIF-US/, /GBIF-US|USGS.*bee|bee occurrence/i],
  // A bare iNaturalist observation is a photograph somebody identified, not a
  // study. Named as what it is so nobody mistakes it for a published record.
  ["iNaturalist observations", /iNaturalist/, /iNaturalist\.org is a place|inaturalist/i],
];

/** The studies a tie's basis cites, by label, in the order the table lists them. */
export function studiesCitedBy(basis) {
  const relayed = String(basis).split(";")[0];
  return STUDIES.filter(([, inBasis]) => inBasis.test(relayed)).map(([label]) => label);
}

/** The label for one of GloBI's citation strings, or null for a study we don't name. */
export function studyOfCitation(citation) {
  const text = String(citation).replace(/\s+/g, " ");
  return STUDIES.find(([, , inCitation]) => inCitation.test(text))?.[0] ?? null;
}
