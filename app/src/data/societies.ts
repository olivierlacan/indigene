// Who to ask, once the list has answered what to plant.
//
// The app is good at "what belongs in this corner" and has nothing to say about
// the rung after it: somebody plants six natives, likes it, and has nowhere
// obvious to go. Every one of these organizations is that next step — plant
// sales, walks, and people who know a region's flora better than any list can.
//
// **Chosen for the region, not the country.** A reader in Petoskey is not
// served by a national directory, so each region names the groups whose ground
// it actually is. Where a region spans several states or countries, each one's
// society is listed; where one body coordinates everything (Ireland), that is
// the one link.
//
// **Roles and organizations only, never a person.** These are the addresses
// each group publishes about itself. Officers turn over annually — the research
// behind this list is in `docs/outreach/native-plant-societies.md`, which says
// why naming a current chair here would be wrong within a year.
//
// **Kept to five at most**, and usually three. A page of links is a directory,
// and a directory is the thing a reader came here to avoid.
export interface Society {
  /** As the organization writes it. Not translated — a proper name. */
  name: string;
  url: string;
  /** What they do, in a handful of words. Translated via `society.what.<key>`. */
  what: SocietyWhat;
}

/** The short "what they do" phrases, so four societies doing the same thing
 *  share one string to write and one to translate. */
export type SocietyWhat =
  | "chapters"
  | "walks"
  | "sales"
  | "advice"
  | "certify"
  | "records"
  | "woodland"
  | "provenance"
  | "pollinators";

export const SOCIETIES: Record<string, Society[]> = {
  "mid-atlantic": [
    { name: "Pennsylvania Native Plant Society", url: "https://www.panativeplantsociety.org/", what: "chapters" },
    { name: "Native Plant Society of New Jersey", url: "https://npsnj.org/", what: "chapters" },
    { name: "Maryland Native Plant Society", url: "https://mdflora.org/", what: "walks" },
    { name: "Virginia Native Plant Society", url: "https://vnps.org/", what: "sales" },
    { name: "Native Plant Trust", url: "https://nativeplanttrust.org/", what: "advice" },
  ],
  "north-michigan": [
    { name: "Michigan Botanical Society", url: "https://michiganbotanicalsociety.org/", what: "walks" },
    { name: "Wildflower Association of Michigan", url: "https://wildflowersmich.org/", what: "advice" },
    { name: "Wild Ones", url: "https://wildones.org/chapters/", what: "chapters" },
  ],
  pnw: [
    { name: "Washington Native Plant Society", url: "https://www.wnps.org/", what: "chapters" },
    { name: "Native Plant Society of Oregon", url: "https://www.npsoregon.org/", what: "chapters" },
    // British Columbia's own society is deliberately absent. It exists, but
    // every address for it we could reach — npsbc.ca, a vcn.bc.ca path, a
    // WordPress mirror — disagreed with the others, and none could be loaded
    // to settle it. A live page is the minimum bar for a link we put in front
    // of a reader; `docs/outreach/native-plant-societies.md` records the check
    // it still needs.
    { name: "Backyard Habitat Certification Program", url: "https://backyardhabitats.org/", what: "certify" },
  ],
  "ca-south-coast": [
    { name: "California Native Plant Society", url: "https://www.cnps.org/chapters", what: "chapters" },
    { name: "Theodore Payne Foundation", url: "https://theodorepayne.org/", what: "sales" },
  ],
  "ca-central-coast": [
    { name: "California Native Plant Society", url: "https://www.cnps.org/chapters", what: "chapters" },
  ],
  "florida-central": [
    { name: "Florida Native Plant Society", url: "https://www.fnps.org/chapters", what: "chapters" },
    { name: "Florida Wildflower Foundation", url: "https://www.flawildflowers.org/", what: "advice" },
  ],
  "florida-south": [
    { name: "Florida Native Plant Society", url: "https://www.fnps.org/chapters", what: "chapters" },
    { name: "Institute for Regional Conservation", url: "https://regionalconservation.org/", what: "records" },
  ],
  // France has no native plant society in the American sense, so these are the
  // bodies that between them do the job: the botanical network, the garden
  // network, the nurseries that sell local-provenance stock, and the regional
  // conservatory that decides what counts as native here.
  // `docs/outreach/native-plant-societies.md` sets out the split.
  "france-atlantic": FRANCE(),
  "france-continental": FRANCE(),
  "france-mediterranean": FRANCE(),
  "france-alpine": FRANCE(),
  ireland: [
    { name: "All-Ireland Pollinator Plan", url: "https://pollinators.ie/", what: "pollinators" },
    { name: "Irish Wildlife Trust", url: "https://iwt.ie/", what: "walks" },
    { name: "Native Woodland Trust", url: "https://www.nativewoodlandtrust.ie/", what: "woodland" },
    { name: "BSBI Ireland", url: "https://bsbi.org/ireland", what: "records" },
  ],
  "nz-auckland": [
    { name: "New Zealand Plant Conservation Network", url: "https://www.nzpcn.org.nz/", what: "records" },
    { name: "Auckland Botanical Society", url: "https://www.nzpcn.org.nz/conservation/botanic-societies/", what: "walks" },
    // Forest & Bird belongs here and is held back for the same reason: we
    // could not load it from this network to confirm the address.
  ],
};

/** The same four bodies for all four French regions — written once, because
 *  they are national and a reader in Nantes and one in Nice want the same
 *  doors. The conservatory link is the network's own directory, which sends
 *  each reader to the one that covers them. */
function FRANCE(): Society[] {
  return [
    { name: "Tela Botanica", url: "https://www.tela-botanica.org/", what: "records" },
    { name: "Refuges LPO", url: "https://www.lpo.fr/s-engager-a-nos-cotes/creer-un-refuge-lpo", what: "certify" },
    { name: "Végétal local", url: "https://www.ofb.gouv.fr/vegetal-local", what: "provenance" },
    { name: "Conservatoires botaniques nationaux", url: "https://www.fcbn.fr/annuaire", what: "advice" },
  ];
}

/** The groups for a region, or an empty list where we haven't researched any —
 *  which is a missing section, never a heading over nothing. */
export function societiesFor(regionId: string): Society[] {
  return SOCIETIES[regionId] ?? [];
}
