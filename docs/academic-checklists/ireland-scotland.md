# Native-status sources: Ireland and the Scottish Lowlands

Researched 2026-10-17. Every count marked *computed* was worked out here from
files I downloaded. Every count marked *printed* is quoted from the page named.

## Headline

**The best source for both regions is the Plant Atlas 2020 open data on Zenodo,
not the atlas website.** BSBI and UKCEH published all the data behind the atlas as
ten CC BY 4.0 datasets on Zenodo in April–May 2024. Two of them do the whole job:

- **Native status per taxon** for Britain, Ireland and the Channel Islands
  (`status.csv`: `statusGB`, `statusIE`, `statusCI`). That is (a) for Ireland.
- **Every hectad with its native/alien flag**, one CSV per taxon. That is (a) for
  the Lowlands, and (b) for both regions.

The two downloads total about 10.6 MB. `check-bsbi.mjs` currently makes one
request per plant to `plantatlas2020.org/.../bsbi/maps/hectads/<id>.csv`. That is
the same data, and plantatlas2020.org's robots.txt allows it, but it has no
version and no stated licence. The Zenodo copy has both.

The atlas is one lineage (BSBI DDb → Plant Atlas, PLANTATT, Stace), so it needs an
independent second source:

- **Ireland:** the National Botanic Gardens, Glasnevin checklist (Jebb 2014). It
  is independent of BSBI and gives the island the same native, archaeophyte and
  neophyte split. It sits behind a Cloudflare challenge, so a person downloads it.
  For a third, use GRIIS Ireland, the NBDC's catalogue of non-native species
  (CC BY, bulk download). The Irish Red List 2016 covers the native side.
- **Scottish Lowlands:** the BSBI Vice-county Census Catalogue (Stace et al. 2003).
  It is the only source that gives status per vice-county, and that is the
  region's own grain. It is a PDF from bsbi.org, which blocks ClaudeBot, so a
  person downloads it once. It dates from 2003, so treat it as a cross-check. The
  county floras (Berwickshire, the Lothians, Dumfries & Galloway) are a by-hand
  third source.

---

## 1. BSBI Plant Atlas 2020 — open data on Zenodo  ★ both regions

- **Institution:** Botanical Society of Britain and Ireland (BSBI) with UK Centre
  for Ecology & Hydrology (UKCEH). The data behind Stroh et al. (2023), *Plant
  Atlas 2020* (Princeton UP / BSBI).
- **Datasets (all `cc-by-4.0`, from Zenodo record metadata):**
  - *Plant Atlas 2020 — Plant native statuses for Britain, Ireland and the Channel
    Islands*: <https://zenodo.org/records/11097371>. File `PA2020_NativeStatusData.zip`
    (155 KB): `status.csv`, `nameLookup.csv` and a metadata .docx.
  - *Plant Atlas 2020 — British and Irish vascular plant and charophyte 10 x 10 km
    grid square locations, subdivided by survey period*:
    <https://zenodo.org/records/10998003>. File `PA2020_10by10kmSquareData.zip`
    (10.4 MB), which holds `hectadDistributions.zip` with 3,497 per-taxon CSVs.
  - Others, not needed here: 2 km tetrads (10998189), conservation statuses incl.
    the Irish Red List and NI/IE protection (11093342), long-term hectad trends,
    phenology, apparency, altitude by latitude.
- **Grain:**
  - Native status per *country*: `statusGB`, `statusIE` (the whole island of
    Ireland) and `statusCI`. Values: `native`, `archaeophyte`, `neophyte`,
    `native or alien`, `absent`, and six hybrid classes such as
    `spontaneous hybrid (native × alien)`.
  - Per *hectad*: the column `hectadstatus` takes `n` = native, `a` = alien
    (archaeophytes are `a` too: *Euphorbia helioscopia* is `a` in all 2,973 of its
    hectads), or `y` = unassigned. The columns `to 1929`, `1930 - 1969`,
    `1970 - 1986`, `1987 - 1999`, `2000 - 2009` and `2010 - 2019` each take 0 or 1.
    Irish hectads use Irish-grid refs (one letter, e.g. `C41`) and British hectads
    use OS refs (`NT27`), all in the same files.
- **Printed totals** (plantatlas2020.org, "Plant Atlas surveys", node/3): 3,495
  taxa recorded 2000–2019 in Britain and Ireland, of which 1,599 are native, 1,648
  non-native (161 of them archaeophytes) and 248 hybrids.
- **Computed, Ireland** (species rank only, `statusIE`): 970 native, 115
  archaeophyte, 1,028 neophyte, 6 "native or alien" and 943 absent. Of those
  recorded in an Irish hectad in 2000–2019: **947 native, 102 archaeophyte, 884
  neophyte**. 1,011 Irish hectads in all.
- **Computed, Scottish Lowlands** (the region's box 54.6–56.6° N, 5.2–2.0° W,
  which holds 420 hectads; records 2000–2019; species rank):
  - **987 species** native in at least one hectad in the box.
  - **1,080 species** recorded only as alien.
  - 31 recorded with no status assigned (the "present only" trees).
  - At subspecies rank: 68 native, 27 alien only.
  - The native count depends on a threshold. `check-bsbi.mjs` uses 10 hectads to
    call a plant native in the region.
- **Candidates for (b):** native species not yet in our lists. Ireland has 682
  with 20 or more native hectads; we ship 67 rows. The Lowlands have 737 with 10
  or more native hectads; we ship 59. The top of both lists is ordinary grassland
  plants (*Holcus lanatus*, *Ranunculus repens*, *Bellis perennis*), so a garden
  filter is needed.
- **How to obtain:** two plain file downloads. Zenodo's robots.txt says
  `Disallow: /api` but `Allow: /api/records/*/files`, with `Crawl-delay: 10`.
  `https://zenodo.org/records/<id>/files/<name>?download=1` is not disallowed.
  (I made one `/api/records?q=` search call before reading that; the next fetch
  should not use it.)
- **The website:** plantatlas2020.org's robots.txt is a stock Drupal file. It
  names no AI agents and does not disallow `/sites/default/files/bsbi_data/`. The
  per-taxon `bsbi/captions2/<id>.csv` file carries `statusGB`/`statusIE` and the
  Red List columns, but Zenodo makes per-taxon fetching unnecessary.
- **Licence:** CC BY 4.0. Cite BSBI/UKCEH and the dataset DOI.
- **Verdict: yes, first source for both regions.** It is scriptable, versioned,
  openly licensed, and the authority British and Irish botanists cite. One caveat:
  for the Lowlands it is our box of hectad centres, not vice-county boundaries.

## 2. National Botanic Gardens, Glasnevin — Irish vascular plant checklist (Jebb 2014)  ★ Ireland

- **Institution:** National Botanic Gardens of Ireland (OPW), National Herbarium
  (DBN). Compiled by Matthew Jebb.
- **URL:** <http://www.botanicgardens.ie/herb/census/lists.htm>, the "Census
  lists". The file is <http://www.botanicgardens.ie/herb/census/syno.xls>, cited
  that way by the Irish Red List 2016, p. 8: "A checklist of native, archaeophyte,
  neophyte, uncertain status and hybrid vascular plant taxa recorded from Ireland
  was compiled by Matthew Jebb … (Jebb 2014)".
- **Grain:** the island of Ireland. Status classes: native, archaeophyte,
  neophyte, uncertain, hybrid.
- **Printed totals** (NBDC, <https://biodiversityireland.ie/taxonomic-groups/vascular-plants/>,
  "Irish checklist: Checklist developed by the National Botanic Gardens"):
  - 2,328 vascular plant species
  - 980 natives, plus 273 apomictic natives
  - 111 archaeophytes
  - 964 neophytes
  These sit close to the atlas figures (970 / 115 / 1,028), which is what a second
  source should do.
- **Access:** **by hand.** The site answers every request, robots.txt included,
  with a Cloudflare "Just a moment…" managed challenge (HTTP 403).
- **What a person does:** open <http://www.botanicgardens.ie/herb/census/lists.htm>
  in a browser and pass the check. Download the vascular-plant checklist
  spreadsheet (`syno.xls`, or whatever the page now links to). That is **one
  download**. If the page also lists the 40 Irish vice-county census lists, those
  are optional. Put the files in `data/sources/<new>/raw/`.
- **Licence:** none found. The data is facts from a state institution, but write
  to the National Herbarium before committing a derived CSV.
- **Verdict: by hand, and the best second source for Ireland.** It is independent
  of BSBI, made at the same island grain by the national herbarium, and it is the
  checklist the national Red List and the NBDC both follow.

## 3. GRIIS Ireland, the NBDC's Catalogue of Ireland's Non-native Species  ★ Ireland, non-native side

- **Institution:** National Biodiversity Data Centre (Waterford), published
  through IUCN ISSG's Global Register of Introduced and Invasive Species.
- **URL:** <https://www.gbif.org/dataset/278c9199-be97-4fd0-9c6c-6c46c4e2369e>.
  The archive is at <https://cloud.gbif.org/griis/archive.do?r=ireland-griis-gbif>
  (DwC-A: taxon, distribution, speciesprofile). The source pages are
  <https://invasives.ie/?p=1137>.
- **Grain:** the island of Ireland (`locationID IRELAND`, RoI and NI). It lists
  non-natives only. `establishmentMeans` is `introduced` (1,306 rows, all taxa)
  or `cryptogenic|uncertain` (47).
- **Computed:** 843 Plantae, of which **815 Tracheophyta**. The archive was
  modified 2026-08-23. Plant rows cite Reynolds (2002), *A catalogue of alien
  plants in Ireland*.
- **Access:** scripted is fine. The GBIF API's robots.txt only blocks unsigned
  images. Fetching it took one request.
- **Licence:** CC BY 4.0.
- **Verdict: yes, as a cross-check on the non-native side.** It cannot count
  natives. It can catch a row we ship that the national catalogue calls
  non-native.

## 4. Ireland Red List No. 10: Vascular Plants (Wyse Jackson et al. 2016, NPWS)  ★ Ireland, native side

- **Institution:** National Parks and Wildlife Service, with NBG Glasnevin, the
  NBDC, CEDaR/National Museums NI, NIEA and BSBI.
- **URL:** <https://www.npws.ie/sites/default/files/publications/pdf/RL10%20VascularPlants.pdf>
  (141 pp.). npws.ie's robots.txt allows `*` with `Crawl-delay: 10`. I made one
  fetch.
- **Grain:** the whole island. It assesses natives and archaeophytes and leaves
  neophytes out.
- **Printed:** "a total of 1211 taxa, comprising 1047 species, 4 species
  aggregates, 157 subspecies and 3 interspecific hybrids, considered to be native,
  archaeophyte or of uncertain native/alien status in Ireland are assessed"
  (Executive Summary).
- **Access:** a PDF table, so it needs table extraction. The Red List category
  already comes, per taxon, in the Zenodo conservation-status dataset
  (`csRedListIreland`, record 11093342, CC BY).
- **Licence:** a government publication, with no open licence stated.
- **Verdict: usable as a cross-check that a plant counts as native or
  archaeophyte in Ireland.** It is weaker than NBG because it does not separate
  native from archaeophyte in its total, and because it rests on Jebb (2014).

## 5. Census Catalogue of the Flora of Ireland (Scannell & Synnott 1987) and Reynolds (2002)

- **Institution:** NBG Glasnevin. The Census Catalogue was published by the
  Stationery Office, Dublin, 2nd ed. 1987. Reynolds, S.C.P. (2002), *A catalogue
  of alien plants in Ireland*, NBG Occasional Papers 14: about 920 alien taxa,
  with establishment status and vice-county distribution.
- **Grain:** Ireland's 40 vice-counties. They name natives and established
  aliens per vice-county.
- **Access:** both are print books. The NBG "Census lists" page (above) is where
  any digitised version would be, so a person checks it while fetching `syno.xls`.
- **Verdict: no, as a machine source.** It dates from 1987 and is superseded by
  Jebb (2014). Reynolds already feeds GRIIS.

## 6. Flora of Northern Ireland, CEDaR / National Museums NI (habitas.org.uk/flora)

- **URL:** <https://www.habitas.org.uk/flora/>. Its robots.txt returns 404, so
  nothing is disallowed.
- **Finding:** the home page loads, but `splist.asp` (the species list) returns
  HTTP 500, and its footer reads "2010–2023". The images are "strictly
  prohibited" for reuse. The text has no licence.
- **Grain:** Northern Ireland only (6 of the island's 40 vice-counties).
- **Verdict: no.** It covers only part of the island and appears broken.

## 7. BSBI Vice-county Census Catalogue (Stace, Ellis, Kent & McCosh 2003)  ★ Scottish Lowlands

- **Institution:** BSBI. About 380 pp. and 4,880 taxa. It covers Great Britain,
  the Isle of Man and the Channel Islands, but not Ireland.
- **URL:** listed as a download on
  <https://bsbi.org/learn/publications/historical-works/census-catalogues/vice-county-census-catalogue-of-the-vascular-plants-of-great-britain>.
  The old online VCCC (botanicalkeys.co.uk/flora/vccc, linked from RBGE's
  websites.rbge.org.uk/BSBI) returns 502, which looks dead.
- **Grain:** **per vice-county.** Each record is coded by typeface as native,
  archaeophyte, neophyte or casual. Records are split into "since 1970, believed
  present" and "not since 1970 / extinct" (Wikipedia summary of the book). The
  region is VCs 72 Dumfriesshire, 73 Kirkcudbrightshire, 74 Wigtownshire, 75
  Ayrshire, 76 Renfrewshire, 77 Lanarkshire, 78 Peeblesshire, 79 Selkirkshire, 80
  Roxburghshire, 81 Berwickshire, 82 East Lothian, 83 Midlothian, 84 West Lothian,
  85 Fife & Kinross, 86 Stirlingshire and 99 Dunbartonshire.
- **Totals:** none printed per region. They have to be counted from the file.
- **Access:** **by hand.** bsbi.org's robots.txt names `anthropic-ai`,
  `Claude-Web` and `ClaudeBot` with `Disallow: /`. I did not fetch bsbi.org pages.
- **What a person does:** open the page above, press its Download button, and
  save the PDF. That is **one download**. Then check how the typeface coding
  survives extraction (`pdftotext` loses fonts; a font-aware extractor such as
  pdfplumber keeps them). Errata for 29 taxa are in BSBI News 97.
- **Licence:** BSBI copyright, with no open licence found. It is free to download
  and its facts can be cited, but ask BSBI before committing a derived per-VC CSV.
- **Verdict: by hand, the best second source for the Lowlands.** It is the only
  source at vice-county grain, and that is how Scottish botanists draw the
  region. Its weakness is age: 2003, against an atlas that runs to 2019.
- **Caveat:** it shares the atlas's lineage (BSBI vice-county recorders), but it
  is a separate compilation with different boundaries, so it is still a cross-check.

## 8. BSBI county floras and checklists for the Lowland vice-counties  ★ Lowlands, third source

- **Examples found:**
  - M. Braithwaite, *Short Flora of Berwickshire* (2014, VC81), PDF on bsbi.org.
  - Braithwaite & Long, *The Botanist in Berwickshire* (1990).
  - Milne-Redhead, *Checklist … Dumfries, Kirkcudbright and Wigtown* (1972, VCs
    72–74), download on bsbi.org.
  - Smith, Dixon & Cochrane, *Plant Life of Edinburgh and the Lothians* (2002,
    VCs 82–84), a book.
  - Silverside & Jackson, East Lothian checklist (1988), and Muscott, West
    Lothian checklist (1989).
  - Rare Plant Registers for most of these vice-counties: rarities only.
- **Grain:** vice-county. Most use native, archaeophyte, neophyte and casual.
- **Access:** **by hand** (bsbi.org blocks ClaudeBot). A person opens each
  county's page, `https://bsbi.org/in-your-area/local-botany/<county>/publications`,
  and downloads the checklist PDF. That is **about 6–8 PDFs** for the 16
  vice-counties, because several are joint. Some are books with no PDF.
- **Verdict: by hand, an uneven third source.** Coverage and dates vary by
  county. Use them to settle a disagreement, not to count.

## 9. BSBI Distribution Database (DDb), database.bsbi.org

- **robots.txt:** `*` is kept off `/reports`, `/record`, `/object.php`,
  `/gridref.php` and others. ClaudeBot is not named. `checklists.php` is open.
  It lists a "Native status" checklist, "Stace ed. 3", PLANTATT attributes,
  "Alienatt" and "NNSS Aliens".
- **Access:** searching and exporting records needs a login (register or BSBI
  membership). The June 2024 BSBI Recorder eNewsletter describes a
  single-search vice-county checklist.
- **Verdict: by hand, and not needed.** The Zenodo data is the public output of
  this database. A DDb vice-county checklist would be the most current
  per-vice-county status, if BSBI grants access. Ask the Scotland Officer.

## 10. PLANTATT (Hill, Preston & Roy 2004, updated 19 Nov 2008; CEH)

- **URL:** <https://www.brc.ac.uk/sites/default/files/biblio/PLANTATT_19_Nov_08.zip>
  (downloaded: `.xls` and `plantatt.pdf`). brc.ac.uk's robots.txt is stock
  Drupal and allows it.
- **Grain:** the British Isles as a whole. There is a single "Native status" (NS)
  column, codes N, NE, NH, AR, AN, AC and "native or alien", taken from the New
  Atlas (2002). It has hectad counts for GB and IR but no status per country.
- **Licence:** "© NERC Copyright 2004", with no open licence.
- **"PLANTATT 2":** I found no such release. The successor data is the Plant
  Atlas 2020 Zenodo set.
- **Verdict: no.** It is coarser than the atlas, older, the same lineage, and not
  openly licensed.

## 11. Stace, *New Flora of the British Isles*, ed. 4 (2019)

- It is a book, so there is no download. Its nativity per taxon
  (`StaceIV_nativity`: N, Neo-natd, Arch-colonist and so on), next to the
  PLANTATT/ALIENATT status and Stace & Crawley (2015), is in Henniges et al.
  (2022), *Scientific Data*: the BI flora data resource, EIDC DOI
  10.5285/9f097d82-7560-4ed2-af13-604a9110cf6d, 3,227 taxa (R package
  BIFloraExplorer).
- **Grain:** the British Isles. It does not separate GB from Ireland.
- **Verdict: no for either region.** It is too coarse, and Kew WCVP already fills
  the global-checklist slot.

## 12. GB Non-native Species Secretariat (NNSS) Information Portal

- **URL:** <https://www.nonnativespecies.org/non-native-species/information-portal/>.
  robots.txt allows `*` with `Crawl-delay: 10`, but the page answers with a
  Cloudflare challenge (403).
- **Grain:** Great Britain, with establishment status per country (England,
  Scotland, Wales). It lists non-natives only.
- **Alternative:** GRIIS United Kingdom on GBIF (`1288ee7d-d67c-4e23-8d95-409973067383`,
  CC BY 4.0). It is UK-wide and scriptable.
- **What a person does:** open the portal, filter Group = vascular plants, and
  export the register. That is **one export**, if the portal offers one. Otherwise
  use GRIIS UK.
- **Verdict: no as a second source.** It is coarser than the region and covers
  only one side.

## 13. NatureScot and RBGE

- I found no Scotland-wide native/alien checklist from either. The nearest is
  Welch et al. (2001), *An audit of alien species in Scotland* (SNH Review 139),
  which is Scotland-wide and 25 years old. RBGE's website robots.txt blocks only
  GPTBot.
- **Verdict: no.**

---

## Recommendation

| Region | 1st | 2nd | 3rd |
|---|---|---|---|
| **Ireland (whole island)** | Plant Atlas 2020, Zenodo: `statusIE` plus Irish hectads. CC BY, scripted | **NBG Glasnevin checklist (Jebb 2014)**: island grain, native/archaeophyte/neophyte. By hand, 1 download | GRIIS Ireland / NBDC, non-natives (CC BY, scripted). Irish Red List 2016 for the native side |
| **Scottish Lowlands** | Plant Atlas 2020, Zenodo: hectad `n`/`a` in the region (420 hectads). CC BY, scripted | **BSBI Vice-county Census Catalogue 2003**: status per VC for VCs 72–86 and 99. By hand, 1 PDF | County floras and checklists (Berwickshire 2014, Lothians 2002, D&G 1972). By hand, about 6–8 PDFs |

**Also worth doing:**
- Move `check-bsbi.mjs` from about 3,500 possible per-taxon fetches to the two
  Zenodo zips.
- Commit the record DOI and version in the snapshot.

**Still open:**
- Licence terms for NBG's checklist and the BSBI census catalogue (write to both).
- Whether the census catalogue PDF keeps its status typefaces when extracted.
