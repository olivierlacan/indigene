# Further reading, region by region

The research behind `app/src/data/reading.ts`: the books, websites and
channels on each region's **Further reading** list (`#/reading`), why each one
is there, and what was turned away.

**Researched 2026-10-10.**

## The two tests

A pick ships only if it passes both. The second is enforced by
`reading.test.ts`.

1. **Somebody stands behind it.** A working botanist or ecologist, a native
   plant society, a university or extension service, a public agency, a botanic
   garden, a native-plant nursery, or a designer who plants natives for a
   living.
2. **People already rely on it.** The strongest evidence is a **recommendation
   from a regional authority**, linked to the page that makes it. A book on the
   Native Plant Society of Oregon's own reading list counts. A book a shop
   happens to stock does not. After that come an award (marked *author's award*
   when it honoured the author rather than the title), several editions, and a
   dated audience count.

Authority without proof is not enough, and some good free guides were cut for
it: Oregon State's EC 1577, the Auckland Botanic Gardens leaflets and Espace
pour la vie's garden pages all lack an outside recommendation. If one turns up,
they can come back.

## Links

From the research sandbox, 15 of the 73 addresses (picks plus the pages that
recommend them) could be opened. The rest were blocked by the network, not
found dead. `npm run reading:check` asks every one, and the **Reading links**
workflow runs it on every change to the list and monthly. Its first run from
CI found four recommendation pages gone (404): Penn State's York County list,
two Wild Ones River City posts and Laois County Council's page. They were
removed; every pick they backed kept other evidence except *Gardening for
Biodiversity*, which was dropped. Calscape, Theodore
Payne and the Virginia Native Plant Society refuse scripts but open in a
browser.

## What each region has, and its gaps

| Region | Picks | Gap |
|---|---|---|
| Mid-Atlantic | 6 | No video channel with a public audience figure |
| North Michigan | 4 | *The Midwestern Native Garden* dropped: its publisher URL could not be confirmed |
| St Lawrence | 5 | Espace pour la vie lacks an outside recommendation |
| Pacific Northwest | 4 | *PNW Native Plant Primer* (2023) has no society recommendation yet |
| Southern California | 4 | *Southern California Native Flower Garden* (Van Atta): no publisher page, one recommendation |
| Central Coast | 6 | — |
| North & Central Florida | 3 | Stibolt & Shropshire: only a publisher blurb |
| South Florida | 4 | Osorio, *A Gardener's Guide to Florida's Native Plants*: no recommendation found |
| Kantō | 2 | Japanese native-garden books are few; Takada's 『雑木の庭』 is not native-only |
| Atlantic France | 1 | Nothing garden-specific for Brittany beyond the conservatory's maps |
| Continental France | 3 | — |
| Mediterranean France | 3 | Filippi's dry-garden books mix in plants from other Mediterranean climates |
| French Alps | 3 | — |
| Ireland | 3 | *Gardening for Biodiversity* (Heritage Officers, 2020) dropped: the one page recommending it, Laois County Council's, now answers 404 |
| Auckland & Northland | 3 | *Let's Go Native* (Hessell, 2026) is too new for any recommendation |

## Notes a reviewer should see

- **Miyawaki, 『鎮守の森』 (Kantō).** Miyawaki writes of "real" and "fake"
  forests. He means native potential vegetation against conifer plantations,
  not people, and the book is the founding text of the planting method used
  across Kantō. Kept on that reading; flag it if it reads otherwise in Japanese.
- **Hammer, *Attracting Hummingbirds and Butterflies in Tropical Florida*.**
  Includes a few non-native plants the publisher calls safe in Florida. Kept
  for the author's standing: he ran Miami-Dade's Castellow Hammock nature
  centre for 30 years and won the FNPS Green Palmetto Award.
- **Te Haumanu Taiao (Auckland)** was written by Auckland Council with the 19
  mana whenua iwi of Tāmaki Makaurau. It is a Māori-led source, not a source
  about Māori.
- **Réabhlóid ar Chúl an Tí (Ireland)** is an Irish-language TG4 series. The
  Irish Wildlife Trust recommends it, and it is the list's only video pick.
- **Video and Instagram are nearly absent.** Native-plant channels with an
  audience figure we could cite were rare, and an unverifiable follower count
  would break the second test. Theodore Payne and Wild Ones run channels; add
  them when their counts are confirmed.

## Worldwide: the ideas behind Indigene

`WORLD_READING` opens `#/reading`. It is for casual reading. The studies stay
on the pages that cite them (Native, Homegrown, Sources), and the list links
there. Each pick carries one line, in both languages, on what it gives an
Indigene reader. The test refuses a pick without one.

| Pick | Evidence |
|---|---|
| Tallamy, *Nature's Best Hope* | Wild Ones Western PA reading list; AHS B.Y. Morrison Award (author) |
| Homegrown National Park | Garden Club of America; 52,000 registered gardens (Sept 2026) |
| Kimmerer, *Braiding Sweetgrass* | Wild Ones Front Range; MacArthur Fellowship (author); 2M+ copies, 20 languages |
| Goulson, *The Garden Jungle* | Clarivate Award for Communicating Zoology 2020 |
| Rainer & West, *Planting in a Post-Wild World* | AHS Book Award 2016; Wild Ones Western PA |
| Thompson, *Where Do Camels Belong?* | RHS Veitch Medal (author). The skeptic's side, on purpose |
| iNaturalist | 4.48M observers (its own API, 2026-10-10) |

Turned away for the worldwide list: *Wilding* (shortlisted, not awarded; the
children's edition won), Tassin's *La grande invasion* (its only evidence is a
critical review, and the Native page already cites it), GBIF (a data portal
rather than reading, and on the Sources page), Kew's Plants of the World Online
(no evidence of use found), Tallamy's *The Nature of Oaks* and Xerces'
*Attracting Native Pollinators* (North America only), and Pollan's "Against
Nativism" (it treats native gardening itself as suspect). There is no French
pick yet. Videos are missing for want of a view count we could verify.

## Turned away

| Candidate | Reason |
|---|---|
| Clément, *Le Jardin en mouvement* | About spontaneous plants, not native ones |
| Vialard, *Le jardin spontané* | Mixes cultivated plants in |
| *Garden Plants of Japan* (Timber Press) | Not about native plants |
| Mary Reynolds, *The Garden Awakening* | Spiritual design book, not native planting |
| Ngā Rauropi Whakaoranga; Te Ara forest lore | About plant uses and lore, not gardening |
| Foraging titles and channels (all regions) | Out of scope |
