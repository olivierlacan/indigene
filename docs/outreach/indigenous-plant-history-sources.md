# Indigenous plant history: sources for the North American regions

Research for two things: **Further reading** picks (`app/src/data/reading.ts`)
and a later PR that adds a short history of each plant among the peoples who
used and tended it.

**Researched 2026-10-12, from a sandbox that blocked most of these sites.**
Claims marked *(snippet)* come from search-result text, not a page we read;
*(unverified)* means nothing backed it. Re-check both from an open network
before anything ships. Blocked hosts are listed at the end.

## The rules this research followed

- **Name the nation.** Kumeyaay, not "Diegueño"; Tongva alongside
  "Gabrielino"; Ohlone alongside "Costanoan"; Payómkawichum alongside
  "Luiseño". Old sources' "Indians" stays only inside a title.
- **Food, fibre, building, tools, fire and tending.** Medicinal and ceremonial
  uses are named as existing, never described: they send people out to dig.
- **Indigenous-led first.** As with Te Haumanu Taiao (Auckland), say whether a
  source is *by* a nation or *about* one.
- **Present tense.** These peoples are here. Where a nation was destroyed by
  colonization (Calusa, Tequesta, Timucua, Apalachee), say so in one line: the
  record is archaeology and Spanish mission accounts, not their own voice.

## What it means for Further reading

**Almost nothing passes test 2 yet.** No North American native plant society
page we could open recommends an Indigenous plant title, except two:

| Pick | Region | Evidence | Status |
|---|---|---|---|
| *Tending the Wild*, M. Kat Anderson (UC Press, 2005) | Central Coast | Listed by CNPS Santa Clara Valley, cnps-scv.org/education/books (read) | **Ready** |
| *Kumeyaay Ethnobotany*, Michael Wilken-Robertson (Sunbelt, 2017) | Southern California | IBPA Benjamin Franklin Award, gold, Regional *(snippet)*; CNPS San Diego book event, cnpssd.org/events/2017/11/14/… | **Ready once the award is confirmed** |

These pass another way and need a decision:

| Pick | Region | Test 2 via | Catch |
|---|---|---|---|
| *Food Plants of Coastal First Peoples*, Nancy J. Turner (Royal BC Museum, 1995) | PNW | Reprinted to 2013; Turner holds the Order of Canada (`award`, `toAuthor`) | Food only, the best fit |
| *Chumash Ethnobotany*, Jan Timbrook (SB Museum of Natural History, 2nd ed. 2024) | Southern California | `editions: 2` | No `museum` backer key |
| *Feeding the People, Feeding the Spirit*, Krohn & Segrest (Muckleshoot) (Northwest Indian College, 2010) | PNW | 3,500+ copies to tribal communities, per *Ethnobiology Letters* (undated figure) | Out of print; some medicine |
| *Saging the World* (film), Rose Ramirez (Chumash descent), Deborah Small, CNPS, 2022 | Southern California | CNPS calls it award-winning; chapters screened it | Award not named |
| *Florida Ethnobotany*, Daniel F. Austin (CRC, 2004) | Both Florida regions | Society for Economic Botany's Klinger Book Award *(snippet)* | Medicinal entries need filtering |
| Jardin des Premières-Nations, Espace pour la vie (Montréal) | St Lawrence | Co-designed with a First Nations committee | Needs a voucher (FloraQuebeca?) |

Watch: *Plants of the Pacific Coast* (2026), co-written by Leigh Joseph
(Styawat, Squamish Nation). Too new for evidence; its predecessor had three
editions.

### A gap in the two tests

The strongest sources are nations speaking for themselves: the Seminole Tribe's
food pages, Ah-Tah-Thi-Ki Museum, the Chia Café Collective's *Cooking the Native
Way* (Tongva and Cahuilla authors), the Amah Mutsun Land Trust, GLIFWC, the
Delaware Tribe's Lenape Talking Dictionary. `Backer` has no key for them, and
test 2 asks a nation to prove that people rely on its own account of itself.
**Proposal:** add a `nation` backer whose own voice passes test 2 on its own.
That is a policy change to `reading.test.ts`; decide it before adding picks.

## What the plant-history PR can gather

| Source | Use | License |
|---|---|---|
| **USDA NRCS Plant Guides** (`plants.usda.gov/DocumentLibrary/plantguide/pdf/pg_<symbol>.pdf`, `cs_<symbol>.pdf`) | The best reusable per-plant source. Many California guides are by M. Kat Anderson. A script can probe which of our species have one. | US federal work, public domain (guides contributed by others, e.g. Santa Barbara Botanic Garden, may not be). Medicinal paragraphs and old names need a person's edit. |
| **Public-domain ethnographies**: Densmore 1928 (Ojibwe, Smithsonian); Waugh 1916, *Iroquois Foods*; Parker 1910, *Iroquois Uses of Maize*; Smith 1932/1933 (Ojibwe, Potawatomi) *(renewal unverified)*; Gunther 1945 (W. Washington) *(renewal unverified)* | Food, fibre, maple sugar, birchbark | Quotable, but paraphrase anyway: past tense, "primitive", medicine-society material |
| **Native American Ethnobotany DB** (Moerman, BRIT) | A finder: look a plant up, read the source it cites, cite that | No license found. Half medicinal. Not the authority for any nation. Never "NAEB says". |
| **Native Land Digital** | A link on region pages: "Whose land is this?" | API needs a key and their Data Sovereignty Treaty (OCAP). They say themselves the maps aren't legal boundaries. Link, don't embed. |
| **Language resources**: Ojibwe People's Dictionary; Lenape Talking Dictionary; Chinuk Wawa dictionary (Grand Ronde); Lushootseed Plant List (UW) | Plant names in the people's language | Ask each project before showing names at scale |

**Skip:** Plants For A Future, Dr. Duke's databases (medicinal, no nation),
Margolin's *The Ohlone Way* (Ohlone criticism of its "vanished people"
framing), Sturtevant, Herrick, Tantaquidgeon (medicinal by design).

## Per region

### Pacific Northwest

Peoples: Coast Salish (incl. W̱SÁNEĆ, Muckleshoot), Kalapuya and Chinookan
(Confederated Tribes of Grand Ronde), Kwakwaka'wakw.

| Plant | History | Source |
|---|---|---|
| Common camas | Bulbs a staple; prairies tended with fire. Chinuk Wawa *lakamas* | Deur & Turner, *Keeping It Living* (2005); Turner, *Saanich Ethnobotany*; NRCS |
| Western red cedar | Planks, canoes, bark clothing and baskets | Stewart, *Cedar* (1984); Turner, *Plant Technology* |
| Garry oak | Acorns; prairie burning | Deur & Turner; Turner, *Saanich* |
| Salmonberry, huckleberries, salal, trailing blackberry | Fruit. *samən-ulali*, *shat-ulali* | Turner, *Food Plants*; Grand Ronde foods slideshow (Oregon Dept. of Education) |
| Pacific crabapple | Fruit; family-owned trees | Turner, *Food Plants*; Deur & Turner |
| Oceanspray, bitter cherry, red alder, nettle | Tools, basketry bark, dye, fibre | Turner, *Plant Technology* |
| White fawn lily, skunk cabbage | Bulbs; leaves lining pit ovens | Turner, *Saanich*; Gunther |

### California Central Coast

Peoples: Ohlone (Mutsun, Rumsen, Chochenyo, Ramaytush), Esselen, Salinan,
Chumash to the south.

| Plant | History | Source |
|---|---|---|
| Coast live oak, valley oak | Acorns, the staple | Anderson; NRCS QUAG, QULO |
| California buckeye | Nuts leached as a lean-year food; fire drills | NRCS AECA (read) |
| California bay | Nuts | NRCS UMCA (read) |
| Toyon | Fruit. The name may come from an Ohlone word *(unverified)* | NRCS HEAR5 |
| Blue elderberry | Fruit; flutes, clapper sticks | NRCS SANIC5 |
| Douglas iris | Fine cordage for nets | NRCS IRDO (Ohlone use unverified) |
| Purple needlegrass, blue wildrye | Seed from grasslands kept open by fire | Anderson; NRCS ELGL |

### Southern California coast

Peoples: Tongva, Acjachemen, Payómkawichum, Kumeyaay, Chumash; Cahuilla
inland.

| Plant | History | Source |
|---|---|---|
| Hollyleaf cherry (islay) | Kernels and fruit. "Islay" from Salinan *slay* | NRCS PRIL (read) |
| Chaparral yucca | Shoots, stalks, flowers; still gathered | NRCS YUWH (Anderson, read); *Cooking the Native Way* |
| Deergrass | Coiled-basket foundations; tended by fire | NRCS MURI2 (read); California Indian Basketweavers Association |
| Blue dicks | Corms, a starch staple from tended plots | NRCS DICA14 (read) |
| Coast live oak, toyon, elderberry | As above | Timbrook; Wilken-Robertson |
| Lemonade berry, walnut, giant wild rye | Drink, nuts, arrow shafts | Timbrook, Wilken-Robertson *(unverified per plant)* |

**White sage needs its own page treatment.** It grows wild only in southern
California and northern Baja, and most sage sold is poached; CNPS asks people
to grow it and refuse wild-harvested bundles (cnps.org/conservation/white-sage,
*snippet*). Tongva, Chumash and Cahuilla voices call the poaching harm to
their relatives *(press, snippet)*. The page should lead with the ecology,
name the peoples, say a ceremonial use exists without describing it, and link
*Saging the World*. No tribal-government resolution was found.

### Mid-Atlantic, North Michigan, St Lawrence

Peoples: Lenape (Delaware Tribe; Lenape Nation of Pennsylvania), Haudenosaunee
(incl. Kanien'kehá:ka), Anishinaabe (Ojibwe, Odawa, Potawatomi), W8banaki,
Wendat, Algonquin. Name each body as it names itself.

| Plant | Regions | History | Source |
|---|---|---|---|
| Sugar maple | NM, SL | Spring sugar camps; Kanien'kehá:ka Maple Thanksgiving. Ojibwe *ininaatig* | Densmore 1928; Ojibwe People's Dictionary; Espace pour la vie |
| Paper birch | NM, SL | Bark for canoes, containers, lodge covers | Densmore; Smith 1932 |
| White pine | all three | Tree of Peace in the Haudenosaunee Great Law | Parker; Espace pour la vie |
| Wild strawberry | all three | Strawberry thanksgiving; Ojibwe *ode'imin*, "heart berry" | Waugh; Espace pour la vie |
| Basswood | all three | Inner-bark fibre for cord and bags | Densmore; Waugh |
| Eastern white cedar | NM, SL | Canoe ribs, mats | Densmore |
| Blueberries | all three | Dried for winter, traded | Densmore; GLIFWC (Meeker et al. 1993) |
| Serviceberry, hazel, beech, oaks, black cherry, riverbank grape | varies | Fruit and nuts; acorns leached | Waugh; Parker; Smith |

Mid-Atlantic is thinnest: Lenape sources lean medicinal, and nothing turned up
from the Susquehannock or the Nanticoke Lenni-Lenape. Wendat and Algonquin
plant sources weren't found.

### Florida, north & central, and south

Peoples: Seminole Tribe of Florida, Miccosukee Tribe; the destroyed Calusa,
Tequesta, Timucua, Apalachee.

| Plant | History | Source |
|---|---|---|
| Coontie | Starch flour for bread and sofkee; over-harvest made it rare | Seminole Tribe (semtribe.com); NRCS. **Calusa use is contested**: the Florida Museum finds no *Zamia* pollen at Calusa sites |
| Cabbage palm | Chickee thatch; swamp cabbage; Calusa net fibre | Seminole Tribe; Randell Research Center (Florida Museum) |
| Bald cypress | Chickee frames, dugout canoes | Seminole sources *(snippet)* |
| Saw palmetto | Berries eaten. The supplement trade is the harvest risk | NRCS |
| Yaupon | The Apalachee "white drink"; "cassina" from Timucua. Ceremonial: name it, don't detail it | Florida Dept. of State *(snippet)* |
| Persimmon, maypop | Fruit, found at sites near Lake Monroe | Florida Museum (read) |

Nothing found yet for sea grape, Spanish stopper, firebush, coral bean or gumbo
limbo: Austin's *Florida Ethnobotany* is the likely source. No
Miccosukee-authored source was reachable.

## Blocked hosts to re-check

naeb.brit.org, plants.usda.gov, native-land.ca, archive.org, gutenberg.org,
hathitrust.org, biodiversitylibrary.org, canadiana.ca, semtribe.com,
ahtahthiki.com, miccosukee.com, glifwc.org, ojibwe.lib.umn.edu,
delawaretribe.org, lenape-nation.org, coquilletribe.org, amahmutsun.org,
sbnature.org, santacruzmuseum.org, arboretum.ucsc.edu, calscape.org,
npsoregon.org, espacepourlavie.ca, dos.fl.gov, nps.gov.
