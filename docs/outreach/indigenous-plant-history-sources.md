# Indigenous plant history: sources for the North American regions

Research for two things: **Further reading** picks (`app/src/data/reading.ts`)
and a later PR that adds a short history of each plant among the peoples who
used and tended it.

**Researched 2026-10-12**, first from a blocked sandbox, then re-checked once
most hosts were allowed. Claims marked *(snippet)* come from search-result
text, not a page we read; *(unverified)* means nothing backed it. A few hosts
still refuse scripts; they are listed at the end.

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
| *Kumeyaay Ethnobotany*, Michael Wilken-Robertson (Sunbelt, 2017) | Southern California | IBPA Benjamin Franklin Award, 2019 program. **Medal unclear**: the publisher says Gold (Regional), IBPA's page *(snippet)* says Silver, Regional. CNPS San Diego book event: cnpssd.org/events/2017/11/14/kumeyaay-ethnobotany-shared-heritage-of-the-californias *(blocked)* | **Ready once someone reads IBPA's page by hand**; claim the medal IBPA names |

These pass another way and need a decision:

| Pick | Region | Test 2 via | Catch |
|---|---|---|---|
| *Food Plants of Coastal First Peoples*, Nancy J. Turner (Royal BC Museum, 1995) | PNW | On the WNPS Ethnobotany page, wnps.org/ethnobotany *(snippet; blocked)*. Also: 1975 and 1995 editions, reprinted to 2013; Turner is a Member of the Order of Canada (2009) | Food only, the best fit. **Likely ready** once the WNPS page is read |
| *Chumash Ethnobotany*, Jan Timbrook (SB Museum of Natural History, 2nd ed. 2024) | Southern California | `editions: 2`. No society recommends the book; UC ANR cites her 1990 article | No `museum` backer key |
| *Cedar*, Hilary Stewart (Douglas & McIntyre, 1984) | PNW | Burke Museum's "Native Peoples & the Environment of Washington" box lists it *(snippet; blocked)*; 1985 BC Book Prize *(snippet)* | Dated subtitle ("Indians") |
| *Cooking the Native Way*, Chia Café Collective (Heyday, 2018) | Southern California | Named in a CNPS *Flora* profile, cnps.org/flora-magazine/bringing-native-foods-home-with-abe-sanchez/ (read) | A mention, not a recommendation. Indigenous-led (Tongva, Cahuilla) |
| *Feeding the People, Feeding the Spirit*, Krohn & Segrest (Muckleshoot) (Northwest Indian College, 2010) | PNW | 3,500+ copies to tribal communities, per *Ethnobiology Letters* (undated figure) | Out of print; some medicine |
| *Saging the World* (film), Rose Ramirez (Chumash descent), Deborah Small, with CNPS, 2022 | Southern California | CNPS chapters screened it (South Coast, San Gabriel Mountains) | **No award found** despite "award-winning": IMDb shows one nomination. cnps.org/sagingtheworld is a 404 |
| *Florida Ethnobotany*, Daniel F. Austin (CRC, 2004) | Both Florida regions | 2005 Klinger Book Award, Society for Economic Botany (publisher and retailers agree; the society's list was blocked). FNPS cites it on its saw palmetto page and runs a Dan Austin Grant for Ethnobotany | Medicinal entries need filtering |
| Jardin des Premières-Nations, Espace pour la vie (Montréal) | St Lawrence | Designed with First Nations representatives (25th-anniversary release) | No voucher at FloraQuebeca or Fleurbec. 2026 copy calls it "Jardin des Nations-Autochtones": check the name |

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
| **USDA NRCS Plant Guides** (`plants.usda.gov/DocumentLibrary/plantguide/pdf/pg_<symbol>.pdf`, `cs_<symbol>.pdf`) | The best reusable per-plant source. Many California guides are by M. Kat Anderson. Coverage of our plants: see [USDA guide coverage](#usda-guide-coverage). | "Not copyrighted and free for any use. Please cite the PLANTS Database" (PLANTS Help Document 2022). Guides contributed by others (e.g. Santa Barbara Botanic Garden) may not be. Medicinal paragraphs and old names need a person's edit. |
| **Public-domain ethnographies** (US): Densmore 1928 (Ojibwe, Smithsonian); Waugh 1916, *Iroquois Foods*; Parker 1910, *Iroquois Uses of Maize*; Smith 1932, Ojibwe (archive.org: not in copyright); Gunther 1945, W. Washington (HathiTrust: public domain in the US; the 1973 revision isn't). Smith 1933, Potawatomi: rights unverified | Food, fibre, maple sugar, birchbark | Quotable, but paraphrase anyway: past tense, "primitive", medicine-society material |
| **Native American Ethnobotany DB** (Moerman, BRIT) | A finder: look a plant up, read the source it cites, cite that | No license found; naeb.brit.org doesn't answer. Moerman died in January 2026, so ask BRIT. Half medicinal. Not the authority for any nation. Never "NAEB says". |
| **Native Land Digital** | A link on region pages: "Whose land is this?" | API needs a key since late 2024. Its Data Sovereignty Treaty forbids storing or redistributing API data without permission and requires crediting communities as stewards; an older disclaimer page still says CC0. The stricter one wins: link, don't embed. Maps "do not represent… official or legal boundaries". |
| **Language resources**: Ojibwe People's Dictionary; Lenape Talking Dictionary; Chinuk Wawa dictionary (Grand Ronde); Lushootseed Plant List (UW) | Plant names in the people's language | Ojibwe People's Dictionary: CC BY-NC-SA 3.0 on its terms page, CC BY-NC-ND 4.0 in its footer; credit and link required. Ask each project before showing names at scale |

**Skip:** Plants For A Future, Dr. Duke's databases (medicinal, no nation),
Margolin's *The Ohlone Way* (Ohlone criticism of its "vanished people"
framing), Sturtevant, Herrick, Tantaquidgeon (medicinal by design).

## USDA guide coverage

Of our 291 North American plants, **128 have a USDA plant guide and 109 of
those say something about Indigenous use**. Each plant's best guide is in
[`usda-plant-guides.tsv`](usda-plant-guides.tsv), with rough counts of food,
fibre and medicinal words in that passage and the peoples it names. The counts
are a triage aid from a keyword scan, not a judgement: a person reads every
passage before anything is written from it.

| Region | Plants | With a guide | Guide mentions Indigenous use |
|---|---|---|---|
| Mid-Atlantic | 44 | 30 | 25 |
| North Michigan | 46 | 28 | 21 |
| St Lawrence | 55 | 32 | 26 |
| Pacific Northwest | 106 | 45 | 39 |
| Central Coast | 64 | 27 | 25 |
| Southern California | 64 | 21 | 20 |
| Florida, north & central | 39 | 25 | 22 |
| Florida, south | 21 | 6 | 6 |

What the scan shows:

- **Many passages name no people.** Sugar maple's guide has no ethnobotany at
  all; red oak, Garry oak and western red cedar say "Native Americans". Those
  need a second source that names the nation.
- **Some are mostly medicine.** California sagebrush, California fuchsia,
  mugwort, yarrow, goldenrods, asters: little or no history note.
- **Old names throughout.** "Diegueño", "Luiseño", "Gabrielino", "Costanoan",
  "Chippewa", "Thompson" (Nlaka'pamux) need the nation's own name beside or
  instead.
- **Guides hide under old names and subspecies.** Camas is filed under
  *C. quamash* ssp. *quamash* and *breviflora*, chaparral yucca under *Yucca
  whipplei*, coontie under *Z. pumila*, blue elderberry under *S. nigra* ssp.
  *cerulea*.
- **South Florida is thin**: 6 of 21. Austin's *Florida Ethnobotany* is the
  fallback.

## Per region

### Pacific Northwest

Peoples: Coast Salish (incl. W̱SÁNEĆ, Muckleshoot), Kalapuya and Chinookan
(Confederated Tribes of Grand Ronde), Kwakwaka'wakw.

| Plant | History | Source |
|---|---|---|
| Common camas | Bulbs a staple; prairies tended with fire. Chinuk Wawa *lakamas* | Deur & Turner, *Keeping It Living* (2005); Turner, *Saanich Ethnobotany*; NRCS; *lakamas* from Oregon Dept. of Education's Chinuk Wawa handout |
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
| Toyon | Fruit. The name probably comes from an Ohlone word, through California Spanish *tollon* | NRCS HEAR5; Merriam-Webster etymology (Mutsun *tyoty·oni*, Rumsen *toč·on*) |
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
California and northern Baja, and most sage sold is poached. CNPS's 2022
Native Plant Week centred on *Saging the World*, which "examines the cultural
appropriation and poaching of white sage"
(cnps.org/news/in-2022-california-native-plant-week-focuses-on-the-plant-people-connection/).
CNPS's own white-sage page, with the grow-your-own advice, is gone: the old
URL redirects elsewhere. Tongva, Chumash and Cahuilla voices call the poaching harm to
their relatives *(press, snippet)*. The page should lead with the ecology,
name the peoples, say a ceremonial use exists without describing it, and link
*Saging the World*. No tribal-government resolution was found.

### Mid-Atlantic, North Michigan, St Lawrence

Peoples: Lenape (Delaware Tribe; Lenape Nation of Pennsylvania), Haudenosaunee
(incl. Kanien'kehá:ka), Anishinaabe (Ojibwe, Odawa, Potawatomi), W8banaki,
Wendat, Algonquin. Name each body as it names itself.

| Plant | Regions | History | Source |
|---|---|---|---|
| Sugar maple | NM, SL | Spring sugar camps. Ojibwe *ininaatig* (confirmed). The Haudenosaunee maple ceremony needs a source: Espace pour la vie mentions only sap collection | Densmore 1928; Ojibwe People's Dictionary |
| Paper birch | NM, SL | Bark (*wiigwaas*) for canoes, containers, lodge covers | Densmore; Smith 1932; Ojibwe People's Dictionary |
| White pine | all three | Tree of Peace in the Haudenosaunee Great Law; Kondiaronk and the Great Peace of 1701 | Espace pour la vie (25th-anniversary release); Parker |
| Wild strawberry | all three | Ojibwe *ode'imin*, from *ode'-* "heart" + *-min* "berry" (confirmed). A strawberry ceremony needs a Haudenosaunee source: Espace pour la vie doesn't have one | Ojibwe People's Dictionary; Waugh |
| Basswood | all three | Inner-bark fibre (*wiigob*) for cord and bags | Densmore; Waugh; Ojibwe People's Dictionary |
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
| Coontie | Root flour, "in the past" in the tribe's words; over-harvest made it rare | Seminole Tribe, semtribe.com/culture/seminole-food *(snippet; blocked)*; NRCS ZAPU. **Calusa use is contested**: no *Zamia* pollen at Calusa sites (Widmer 1988, via Wikipedia; not a Florida Museum page) |
| Cabbage palm | Swamp cabbage (the heart). Frond thatch per the tribe's tourism site; the tribe's chickee page says *palmetto* thatch. Calusa "palm-fibre" net at Pineland: the museum doesn't name the palm | Seminole Tribe; floridaseminoletourism.com/seminole-spaces-chickees/; Florida Museum RRC blog |
| Bald cypress | Chickee frames ("palmetto thatch over a cypress log frame"), dugout canoes | semtribe.com/culture/chickee *(snippet)* |
| Saw palmetto | Berries eaten. The supplement trade is the harvest risk | NRCS |
| Yaupon | The "white drink" of the Apalachee, Creek, Seminole and Muskogee; "cassina" borrowed from Timucua. Ceremonial: name it, don't detail it | Florida Dept. of State (read) |
| Persimmon, maypop | Fruit, at the Hontoon Island and Groves' Orange Midden sites near Lake Monroe | Florida Museum (read) |

Nothing found yet for sea grape, Spanish stopper, firebush, coral bean or gumbo
limbo: Austin's *Florida Ethnobotany* is the likely source. No
Miccosukee-authored source was reachable.

## Still to read by hand

These pages hold the remaining evidence and refuse scripts (403s from bot
protection) or don't resolve. A browser should open them:

- IBPA's 2019 Benjamin Franklin Awards page: Gold or Silver for *Kumeyaay Ethnobotany*
- wnps.org/ethnobotany: does it list Turner's *Food Plants*?
- burkemuseum.org's Native Peoples box: *Cedar*
- semtribe.com culture pages; espacepourlavie.ca; gg.ca
- naeb.brit.org (doesn't resolve) and BRIT, for the database's terms
