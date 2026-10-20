// Who's pulling them near you — the people to join once a region's list has
// said what to pull.
//
// The removal advice says the same thing everywhere: on ground that isn't
// yours, join the people who look after it. This is where that sentence gets an
// address. In the US those people are mostly a Cooperative Invasive Species
// Management Area (CISMA) or Weed Management Area: a partnership of agencies,
// landowners and volunteers for a few counties, with workdays, advice and
// someone to report to. Florida's, coordinated by the Florida Invasive Species
// Council, were the suggestion that started this list (Rikki Ocampos).
//
// **A finder beats a single group.** Where a state or council keeps a list of
// its local partnerships, that list is the link, so a reader in any county
// finds theirs and the link outlives any one group's website.
//
// **The same bar as the removal page.** Every row was fetched and the quote
// beside it found in the page's own text (20 October 2026). Groups whose own
// pages call plants "invaders" were left out, however good their work (CLAUDE.md,
// "Native plants, not nativism"): the Everglades CISMA, Metro Vancouver's
// council, and Texas's "Invaders" programme among them. So was the Florida Keys
// task force, whose page title says "exotics" — FISC's own list covers the Keys.
//
// Kept to three at most per region, like the societies.

/** What a group does for a member of the public. Translated via
 *  `groups.what.<key>`. */
export type GroupWhat = "finder" | "workdays" | "training" | "report" | "boards";

export interface InvasiveGroup {
  /** As the organization writes it. A proper name, not translated. */
  name: string;
  url: string;
  what: GroupWhat;
}

// Florida: the council's list of CISMAs covers all 67 counties — "2016- Big
// Scrub CISMA forms, resulting in full statewide coverage of CISMAs" (About).
// "Scroll down for links to each CISMA website and contact information";
// lists "Central Florida CISMA" and "Everglades CISMA" among them.
const FISC_CISMAS: InvasiveGroup = { name: "Florida Invasive Species Council — CISMAs", url: "https://www.floridainvasives.org/cismas/", what: "finder" };

// "Weed Management Areas (WMAs) have formed in every part of the state";
// the list names Los Angeles, San Diego, Monterey and Santa Barbara WMAs.
const CAL_IPC_WMAS: InvasiveGroup = { name: "Cal-IPC — Weed Management Areas", url: "https://www.cal-ipc.org/solutions/wmas/", what: "finder" };

// Regional contacts across France: "identifier rapidement les interlocuteurs à
// contacter sur leur territoire". Run by the IUCN French committee and the OFB.
const EEE_CONTACTS: InvasiveGroup = { name: "Centre de ressources EEE — Organisations territoriales", url: "https://especes-exotiques-envahissantes.fr/strategies-et-organisations-territoriales-entree-geographique/", what: "finder" };

export const INVASIVE_GROUPS: Record<string, InvasiveGroup[]> = {
  "florida-central": [
    FISC_CISMAS,
    // "Volunteers will be hand pulling and bagging seeds of Caesarweed and
    // Coral Ardisia along the property's trail system."
    { name: "Florida Weed Wrangle", url: "https://www.floridainvasives.org/weedwrangle/", what: "workdays" },
  ],
  "florida-south": [FISC_CISMAS],
  "mid-atlantic": [
    // "provide training and volunteer opportunities"; members from "Delaware,
    // Maryland, New Jersey, Pennsylvania, Virginia, West Virginia and the
    // District of Columbia."
    { name: "Mid-Atlantic Invasive Plant Council", url: "https://maipc.org/about/", what: "training" },
    // "No experience needed — choose an event, learn what to look for and
    // help free the trees."
    { name: "Fairfax County Park Authority — Invasive Management Area", url: "https://www.fairfaxcounty.gov/parks/invasive-management-area", what: "workdays" },
  ],
  chicago: [
    // "CWMA / CISMA Directory"; lists "Lake County CISMA" (Indiana).
    { name: "Midwest Invasive Plant Network — CWMA / CISMA Directory", url: "https://mipn.org/cwma/", what: "finder" },
    // "Lake County CISMA … Please contact the CISMA with this email address".
    { name: "State of Indiana Cooperative Invasives Management — CISMAs", url: "https://sicim.info/cismas", what: "finder" },
  ],
  "north-michigan": [
    // "CAKE CISMA - serving Antrim, Charlevoix, Emmet and Kalkaska counties."
    { name: "Michigan Invasive Species Program — CISMA locations", url: "https://www.michigan.gov/invasives/take-action/local-resources/view-cisma-locations-as-a-list", what: "finder" },
    // "A Cooperative Invasive Species Management Area (CISMA) serving Benzie,
    // Grand Traverse, Leelanau & Manistee counties".
    { name: "Northwest Michigan Invasive Species Network", url: "https://www.habitatmatters.org/", what: "workdays" },
  ],
  "central-texas": [
    // "Keep Austin Beautiful leads community programs to … remove invasive
    // plants, and more."
    { name: "Austin Parks and Recreation — Parkland Stewardship", url: "https://www.austintexas.gov/parks/programs/parkland-stewardship", what: "workdays" },
  ],
  pnw: [
    // "Have a question about how to control a noxious weed on your property?
    // Find your county noxious weed control board".
    { name: "Washington State Noxious Weed Control Board — county weed boards", url: "https://www.nwcb.wa.gov/contact-your-county-weed-boards", what: "boards" },
    // "a partnership of agencies and organizations dedicated to managing
    // invasive weeds across the Portland metropolitan region."
    { name: "4-County Cooperative Weed Management Area", url: "https://www.4countycwma.org/", what: "workdays" },
    // "Use this interactive map to find your regional contacts."
    { name: "Invasive Species Council of BC — regional contacts", url: "https://bcinvasives.ca/invasive-species-contacts-in-british-columbia/", what: "finder" },
  ],
  "ca-south-coast": [CAL_IPC_WMAS],
  "ca-central-coast": [CAL_IPC_WMAS],
  "france-atlantic": [EEE_CONTACTS],
  "france-continental": [EEE_CONTACTS],
  "france-mediterranean": [EEE_CONTACTS],
  "france-alpine": [EEE_CONTACTS],
  ireland: [
    // "You can report any non-native species using the online invasive
    // species recording form".
    { name: "National Biodiversity Data Centre — Report Sightings", url: "https://invasives.ie/reportsightings/", what: "report" },
    // "Send in records of your invasive species sightings"; run by the
    // Northern Ireland Environment Agency.
    { name: "Invasive Species Northern Ireland", url: "https://invasivespeciesni.co.uk/about-isni-2/", what: "report" },
  ],
};

/** A region's groups, or none where we have verified none. */
export function invasiveGroupsFor(regionId: string): InvasiveGroup[] {
  return INVASIVE_GROUPS[regionId] ?? [];
}
