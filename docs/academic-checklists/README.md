# Two academic checklists for every region

For the [Pacific Northwest](../../data/sources/pnw-flora/README.md) and
[Florida](../../data/sources/atlas-florida/README.md) we can count every native
and non-native plant a region has, and list the natives we don't propose yet.
That works because each has a regional checklist that calls every taxon
native or not. This folder finds the same for the other fifteen regions: at
least two such sources each, so one can check the other.

Researched 2026-10-17. The detail — URLs, file formats, field names,
robots.txt rules, licences, and the exact steps for each by-hand download — is
in the five reports beside this page:

- [Mid-Atlantic, Northern Michigan, Chicago, Central Texas](us-east-midwest-texas.md)
- [Both Californias, St Lawrence Lowlands](california-st-lawrence.md)
- [The four French regions](france.md)
- [Ireland, Scottish Lowlands](ireland-scotland.md)
- [Auckland & Northland, the Kantō Plain](auckland-kanto.md)

## The rule

Quality first. A source that shuts out scripts (robots.txt, a browser
challenge, a JavaScript-only site) is fetched **by hand** by a person, the way
the Florida Atlas and OregonFlora already are. A source is turned down only
when its terms forbid reusing the data itself. Native status and distribution
are facts; we commit those, never a source's prose.

**Script** below means its robots.txt and terms allow a program to fetch it.
**Hand** means a person downloads it in a browser.

## Region by region

Counts are native / non-native taxa as the source prints or as computed from
its file. "State", "province" and "national" mean the source can't see inside
that unit; the region's box does the narrowing.

| Region | Source 1 | Source 2 | Grain | Native / non-native |
|---|---|---|---|---|
| Mid-Atlantic | PA Natural Heritage Program list (script) | Digital Atlas of the Virginia Flora (script, one CSV per county) · New York Flora Atlas (hand, one export) | state · county | PA 2,113 / 1,429 |
| Northern Michigan | Michigan Flora Online, U-M Herbarium (script) | Michigan FQA 2014 (script; same authors, so Kew stays the independent check) | county · state | 1,815 / 1,119 |
| Chicago & the Corn Belt | Illinois Plants, INHS (script, paged) | Flora of the Chicago Region, Wilhelm & Rericha (script) · Indiana Plant Atlas (hand) | county · 22 counties | IL 2,107 / 850; Chicago 1,876 / 1,273 |
| Central Texas | BONAP (hand, two queries; ask about reuse) | Flora of North Central Texas, BRIT (script; covers DFW, not Austin) | county · region | NCT 2,223 species, 394 introduced |
| Southern California | Jepson eFlora, SCo bioregion (hand, ~4 saves) | San Diego County checklist 2025, SDNHM (script) | bioregion · county | SD 1,945 / 934 |
| Central Coast | Jepson eFlora, CCo + SCoRO + SnFrB (hand) | Santa Cruz County checklist 2013 (script) · CCH2 county lists (hand) | bioregion · county | SC 1,038 / 556 |
| St Lawrence Lowlands | VASCAN (have) | Ontario NHIC species list (script) · New York Flora Atlas (hand, 4 counties) | province · county | ON 2,684 / 1,303 |
| Atlantic France | CBN catalogues by département: Hauts-de-France, Sud-Atlantique (script); Brest, Bassin parisien (hand) | INPN regional red lists, BDC-Statuts (script) | département · old region | see [france.md](france.md) |
| Continental France | INPN regional red lists (script) | Franche-Comté and Lorraine inventories (script, PDF); Bourgogne, Champagne (hand) | old region | see [france.md](france.md) |
| Mediterranean France | CBN méditerranéen + alpin PACA workbook (hand) | Corsica red list (script) + Flora Corsica, Geneva (hand) | old region | PACA 3,397 / 916 |
| French Alps | CBN alpin + Massif central Rhône-Alpes catalogue 2011 (script, PDF) | INPN Rhône-Alpes red list (script) | old region | 4,497 / 895 |
| Ireland | BSBI Plant Atlas 2020 open data, Zenodo (script) | National Botanic Gardens Glasnevin checklist 2014 (hand, one file) | island | 947 / 986 |
| Scottish Lowlands | BSBI Plant Atlas 2020, 420 hectads in our box (script) | BSBI Vice-county Census Catalogue 2003 (hand, one PDF) | hectad · vice-county | 987 / 1,080 |
| Auckland & Northland | Checklist of the NZ Flora 2026, Allan Herbarium (script) | Auckland Council TR2025/6 (script) · Northland RC 2026 (hand, PDF tables) | national · region | NZ 2,372 / 1,823 + 1,127 casual; Auckland 765 natives |
| Kantō Plain | YList (script; ask about reuse) | Flora of Kanagawa 2018 (hand; ask first) | national · prefecture | Kanagawa 2,199 / 1,036 |

## Where two sources still isn't two institutions

- **Northern Michigan:** both lists come from the U-M Herbarium.
- **France:** a CBN's catalogue and its region's red list are two reviews by
  one conservatoire. Kew and TAXREF stay the independent national floor.
- **Scottish Lowlands:** both are BSBI. County floras are the third opinion.
- **Québec:** VASCAN is the only full source. Lavoie et al. 2012 lists 899
  naturalized exotics, so it can overrule a "native" but never confirm one.
- **Central Texas:** nothing academic online gives per-taxon status at county
  grain around Austin and San Antonio. Turner et al. 2003 does, in print.
- **Languedoc:** no regional red list, and the 2026 Occitanie catalogues are
  announced but not linked anywhere yet.

## Downloads that need a person

One line each; the matching report has the exact steps.

- [ ] Jepson eFlora — bioregion lists for SCo, CCo, SCoRO, SnFrB, plus the name list with Nativity (~8 saves)
- [ ] New York Flora Atlas — one export for the Mid-Atlantic counties, one for St. Lawrence, Franklin, Clinton, Jefferson
- [ ] Indiana Plant Atlas — the region's Indiana counties
- [ ] CCH2 — San Luis Obispo and Ventura county checklists
- [ ] BONAP — Texas natives, then Texas exotics
- [ ] Glasnevin — `syno.xls` from botanicgardens.ie
- [ ] BSBI — Vice-county Census Catalogue PDF
- [ ] CBN de Brest (eCalluna, ~3 exports), CBN Bassin parisien (2), PACA workbook, Flora Corsica
- [ ] Northland RC 2026 — Tables 2–6 copied to a CSV
- [ ] Lavoie et al. 2012 — one PDF from Érudit
- [ ] Flora of Kanagawa 2018 — about 3,235 entries, after the association agrees

## Permission to ask

The data are facts, but these state no licence or restrict their files, so
write before committing anything derived:

- National Botanic Gardens, Glasnevin (the checklist)
- BSBI (the census catalogue PDF)
- BONAP / North Carolina Botanical Garden
- YList's authors (Yonekura & Kajita)
- The Flora-Kanagawa Association
- Northland Regional Council
- PatriNat / OFB — whether the CBN network's national catalogue by
  département, already present as columns in the Hauts-de-France file, will be
  published. It would replace every French by-hand step.

## Next

One source folder per region, modelled on `data/sources/pnw-flora/`: a script
that rebuilds a committed CSV from `raw/`, a check of every row we ship, and a
`--candidates` shortlist. Start with the regions whose two sources are both
scriptable — Northern Michigan, Chicago, Ireland, Auckland — then the ones that
wait on a download. The BSBI open data also lets `bsbi:check` read two zips
instead of one request per plant.
