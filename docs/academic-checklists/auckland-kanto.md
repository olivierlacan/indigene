# Native-status sources: Auckland & Northland, and the Kantō Plain

Researched 2026-10-17. Every count below was checked against a downloaded file
or a printed source, as noted. robots.txt was fetched for each site and nothing
was fetched from a path it disallows. Ranked by quality first. Where a source
blocks scripts or exists only as a PDF or a book, the "by hand" steps are given.

---

## 1. Auckland & Northland, New Zealand

### 1a. Checklist of the New Zealand Flora (Ngā Tipu o Aotearoa), Allan Herbarium, Manaaki Whenua – Landcare Research (now the NZ Institute for Bioeconomy Science)

- **What it is:** the national names and status checklist. It is the source
  behind NZPCN, NZTCS and the Biota of NZ portal. It comes out once a year in
  two parts, seed plants and ferns & lycophytes.
- **URL:** <https://datastore.landcareresearch.co.nz/dataset/checklist-of-the-new-zealand-flora-seed-plants-2026>
  (DOI 10.26065/n4hv-c103) and
  <https://datastore.landcareresearch.co.nz/dataset/checklist-of-the-new-zealand-flora-ferns-and-lycophytes-2026>.
  Both have a PDF and a TSV, May 2026 editions.
  - Seed-plant TSV: `.../dataset/242c2105-09a7-4cfa-999b-3a7e031aaafb/resource/d64275d4-bdab-4fcc-bef4-1e7031bb2157/download/checklist-of-the-new-zealand-flora-seed-plants-may-2026.tsv`
  - Fern TSV: `.../dataset/22151919-0136-453f-a6f1-6ba034340647/resource/005947b8-dacd-4bad-b982-92fbfeb117db/download/checklist-of-the-new-zealand-flora-ferns-and-lycophytes-may-2026.tsv`
- **Grain:** national only. There is no regional or ecological-district column.
- **How a taxon is classed:** two columns.
  - `Origin`: `Endemic`, `Non-endemic` (both native), `Exotic` or `Uncertain`.
  - `Occurrence`: `Wild` (for an exotic this means naturalised), `Sometimes present` (casual), `Extinct` or `Cultivated`.
  - `IsCurrent` separates accepted names from synonyms.
- **Counts, from the TSVs (current names, species rank only):**

  | | Native (endemic + non-endemic, wild) | Naturalised (exotic, wild) | Casual (exotic, sometimes present) |
  |---|---|---|---|
  | Seed plants | 2,165 (1,812 + 353) | 1,794 | 1,091 |
  | Ferns & lycophytes | 207 (92 + 115) | 29 | 36 |
  | **Total** | **2,372** | **1,823** | **1,127** |

  Seed plants also have 5 extinct endemics and 2 of uncertain origin. The TSV
  is UTF-16 and has 14,074 rows: 7,442 current names, 5,067 of them species.
- **How to get it:** a direct TSV download, CC BY 4.0. One file per part per
  year, so 2 requests.
- **robots.txt (datastore):** `User-agent: *`, `Crawl-Delay: 10`. It disallows
  `/api/` and the faceted searches. Dataset pages and `/download/` are allowed,
  and no AI agent is named. **A script can fetch it.**
- **Licence:** CC BY 4.0, printed on the dataset page.
- **Verdict: yes.** It is the authority, and machine-readable. It holds
  native, naturalised and casual for every taxon. Its limit is grain: it
  cannot say "in Auckland". Use it for the status and a regional list
  (1b/1c) for the place.

### 1b. Conservation status of vascular plant species in Tāmaki Makaurau / Auckland, revised March 2025, Auckland Council (TR2025/6)

- **Authors:** Simpkins, Woolly, de Lange, Kilgour, Cameron & Melzer. It
  replaces TR2022/19.
- **URLs:**
  - Page: <https://www.knowledgeauckland.org.nz/publications/conservation-status-of-vascular-plant-species-in-tamaki-makaurau-auckland-revised-march-2025/>
  - Species list (xlsx, April 2025): <https://www.knowledgeauckland.org.nz/media/ekun5pvp/tr2025-06-conservation-status-vascular-plant-species-in-auckland-revised-march-2025-species-list-april-2025.xlsx>
  - Report PDF: `/media/s1jhlvey/tr2025-06-...pdf`
- **Grain:** the Auckland Council region. The 2022 assessment covered "all
  known indigenous vascular plant taxa in Tāmaki Makaurau / Auckland".
- **How a taxon is classed:** every row is indigenous and present in the
  region, or extinct there. There are no naturalised plants in it. The
  columns are regional and national NZTCS status, national stronghold,
  population state and type locality.
- **Counts:** the report says "a total of 792 vascular plant species were
  identified as present ... 205 Threatened, 152 At Risk, four Non-resident
  Native and 88 Data Deficient ... An additional 27 species ... extinct".
  The xlsx has 792 rows: 316 Not Threatened, 205 Threatened, 152 At Risk,
  88 Data Deficient, 27 Extinct and 4 Non-resident Native. That makes 765
  present plus 27 extinct. **The 792 in the report seems to include the 27
  extinct; worth noting when quoting it.**
- **How to get it:** one xlsx download, about 150 KB.
- **robots.txt:** knowledgeauckland.org.nz returns 404, so there are no rules.
  **A script can fetch it.**
- **Licence:** the report PDF says "This document is licensed for re-use under
  the Creative Commons Attribution 4.0 International licence." The web page
  says only "© Auckland Council".
- **Verdict: yes.** It is the regional native list Auckland needs, at the
  council grain, from the people who wrote the national lists. Combined with
  1a it answers which natives grow in Auckland that the app doesn't propose.
  It has no naturalised side.

### 1c. Conservation Status of Indigenous Vascular Plants in Taitokerau / Northland, 2026, Northland Regional Council

- **Citation:** Ford, Cameron, Champion, de Lange, Townsend & Forester (2026),
  ISBN 978-0-473-78807-0 (eBook).
- **URL:** Research Bank (Unitec) item
  <https://www.researchbank.ac.nz/items/c65d7a4e-0d9d-4aa5-aac1-acce6b27e824>.
  PDF bitstream: `https://www.researchbank.ac.nz/server/api/core/bitstreams/60f5a818-fb6f-4d53-ac27-1482ee188bf3/content`
  (3.3 MB, published June 2026).
- **Grain:** the Northland Regional Council region.
- **How a taxon is classed:** indigenous taxa only, set out in Tables 2–6
  (Extirpated, Data Deficient, Threatened, At Risk, Not Threatened). Each
  entry has a regional status, a national status, qualifiers and a wetland
  indicator.
- **Counts:** "The conservation status of 878 vascular plant taxa in
  Taitokerau / Northland was assessed". 128 are Regionally Threatened (77
  Critical, 29 Endangered, 22 Vulnerable), 292 At Risk, 341 Not Threatened
  and 83 Data Deficient, plus 34 extirpated. These figures were confirmed in
  the PDF's executive summary.
- **How to get it:** PDF only. Its tables run from p. 13 to p. 75; I checked
  that `pdftotext -layout` extracts them.
- **robots.txt:** DSpace defaults with `Crawl-delay: 10`. `/items/*` is
  allowed and `/items/*/full` and `/search` are disallowed. WebFetch got a 403
  on the item page; one curl of the bitstream worked. No AI agent is named.
- **By hand:** open the item page and download the one PDF. Copy Tables 2–6
  (name, regional status) into a CSV, about 63 pages. pdftotext does most of
  it; check the wrapped names.
- **Licence:** **none stated** in the PDF. It has no CC line and no
  copyright line. A name list with a status is factual, but ask Northland
  Regional Council (or cite it and link to it) before republishing the
  tables verbatim.
- **Verdict: yes, by hand.** It is Northland's counterpart to 1b, from the
  same people (de Lange, Cameron), and together the two cover the whole
  region. The licence is the open question.

### 1d. NZ naturalised flora distribution 2020 (Etherington & Brandt, Manaaki Whenua)

- **URL:** <https://datastore.landcareresearch.co.nz/dataset/nz-naturalised-flora-distribution-2020>
  (DOI 10.7931/nt3a-b734). The CSV used is
  `nz-naturalised-flora-gbif-region-occurrences-3aug2020.csv`.
- **Grain:** the 16 mainland political regions, including Auckland and
  Northland.
- **How a taxon is classed:** every naturalised species on the 2020 Ngā Tipu
  checklist, with a count of GBIF georeferenced records per region.
- **Counts, from the CSV:** 1,730 naturalised species. 1,298 have at least one
  record in Auckland, 936 in Northland, and 1,353 in either.
- **How to get it:** CSV, CC BY 4.0, directly downloadable.
- **Verdict: supporting only.** It is the one regional naturalised count I
  found, and it comes from the Landcare authors. But it is GBIF records from
  2020, not a regional flora, so call it "naturalised species recorded in the
  region".

### 1e. NZ Plant Conservation Network (NZPCN) flora database

- **URL:** <https://www.nzpcn.org.nz/flora/species/> (e.g. `/flora/species/metrosideros-excelsa/`).
- **Grain:** national biostatus ("Native – Endemic taxon", or "Introduced and
  Naturalised" through the conservation-status filter). Distribution is free
  text, e.g. "North Island from North Cape to about Pukearuhe". It has no
  region filter: the search form offers category, native, family, genus,
  conservation status, structural class and flower colour.
- **How to get it:** one page per taxon. I found no bulk export.
- **robots.txt:** 404, so there are no rules.
- **Licence:** not stated on the species page.
- **Verdict: no, as one of the two.** Its status comes from 1a and NZTCS, so
  it isn't independent. It is useful for linking a plant and for its
  distribution prose.

### 1f. Others checked

- **NZ Threat Classification System (nztcs.org.nz):** an Angular app
  returns its shell for every path, including robots.txt. It covers national
  natives only, and the national lists are in 1a. **No** (redundant).
- **Auckland Museum herbarium (AK):** robots.txt blocks GPTBot, CCBot,
  PerplexityBot and others, but not ClaudeBot. It also disallows `/api/`.
  These are specimens, not a checklist. **No.**
- **Auckland Botanical Society Journal checklists:** these cover single sites
  (e.g. Motuihe: 493 taxa, 182 naturalised). There is no regional total.
  **No.**
- **iNaturalist NZ:** skipped as instructed.

### Recommendation for Auckland & Northland

1. **Checklist of the NZ Flora 2026 (1a)** for status and national totals:
   2,372 native, 1,823 naturalised and 1,127 casual species. Scripted, CC BY.
2. **Auckland Council TR2025/6 (1b)** plus **Northland RC 2026 (1c)** for the
   regional native list. 1b is xlsx and CC BY; 1c is PDF, by hand, with no
   licence stated.
3. For the regional naturalised figure, **1d**, labelled as record-based.
   No published Auckland or Northland naturalised checklist turned up.

---

## 2. The Kantō Plain, Japan

### 2a. Flora of Kanagawa 2018 (神奈川県植物誌2018 電子版), Flora-Kanagawa Association (神奈川県植物誌調査会) with the Kanagawa Prefectural Museum of Natural History

- **URLs:**
  - Download page: <http://flora-kanagawa2.sakura.ne.jp/efloraofkanagawa.html>
  - PDF: `http://flora-kanagawa2.sakura.ne.jp/attach/eFloraofKanagawa2018v1.pdf`
    (120 MB, 1,803 pp., published 2018-11-07), with errata v1.1–1.3 (2022–2024).
- **Grain:** the prefecture, mapped by 111 survey districts. It rests on about
  500,000 vouchered specimens from more than 10 museums.
- **How a taxon is classed:** each heading is called native (在来) or
  naturalised (帰化).
- **Counts:** Tanaka (2026), *Bull. Kanagawa Pref. Mus. (Nat. Sci.)* 55:
  9–22, gives "在来植物 2,199 分類群、帰化植物 1,036 分類群、計 3,235 分類群"
  (variety rank and above, hybrids and reference taxa excluded). That is
  2,199 native and 1,036 naturalised taxa, 3,235 in all. I read this in the
  downloaded paper:
  <https://nh.kanagawa-museum.jp/uploads/Bull55_9-22_Tanaka.pdf>.
- **How to get it:** the one PDF. There is no list download.
- **robots.txt:** the host has none (it returns a 302); nh.kanagawa-museum.jp
  returns 404. The PDF was not fetched (120 MB).
- **Licence / terms:** "著作権は神奈川県植物誌調査会が有します。著作権法に定める
  例外を除き、複製・改変・転載・再配布を禁じます。" That means no copying,
  altering, reprinting or redistributing the *e-book*. The terms cover the
  publication. They don't address extracting facts (a name and its
  native/naturalised status). Committing the PDF or its text is out. A
  derived CSV of name and status is probably fine as facts, but
  **ask the association** (contact via the site) before committing it.
- **By hand:** download the PDF once. For each family chapter, record the
  heading's scientific name and whether it is marked naturalised: about
  3,235 headings over roughly 1,700 pages. Or write to the association and
  ask for the checklist table.
- **Verdict: yes, by hand.** It is the best regional flora on the Kantō Plain
  and has both counts. Ask permission before committing a derived list.

### 2b. YList (植物和名-学名インデックス YList), Yonekura & Kajita, maintained at the University of the Ryukyus

- **URLs:** <http://ylist.info/> (HTTP only; the HTTPS certificate doesn't
  match). Bulk files are linked from the home page "for those who asked":
  `http://ylist.info/20210514YList_download_tab.txt` (10.7 MB, cp932 tab
  text) and `20210514YList_download.xlsx`.
- **Grain:** national.
- **How a taxon is classed:** the `生態` column. Blank means wild in Japan,
  `帰` naturalised, `栽` cultivated, `外` foreign (not in Japan). The
  `ステータス` column marks 標準 (accepted) against synonym.
- **Counts, from the file (accepted names, every rank):** 21,186 accepted.
  11,676 have no flag (wild), 1,649 are 帰, 3,203 栽 and 4,603 外. Example:
  *Robinia pseudoacacia* ハリエンジュ is 帰.
- **How to get it:** one file. The snapshot is dated 2021-05-14, offered as a
  "暫定公開" (provisional release).
- **robots.txt:** 404, so there are no rules. **A script can fetch it.**
- **Licence:** **none stated**. The site asks to be cited as 米倉浩司・梶田忠
  (2003-) 「BG Plants 和名－学名インデックス」（YList）, http://ylist.info.
  Contact addresses are on the page.
- **Verdict: yes, national.** It is the only scientific source here that
  flags naturalised plants per taxon across all of Japan. Pair it with a
  regional flora for place. Ask the authors before redistributing the file.

### 2c. GreenList ver. 2.02rc, National Museum of Nature and Science (Kahaku); Ito & Yahara

- **URLs:** DwC-A at <https://ipt.kahaku.go.jp/archive.do?r=greenlist_v_2_02_rc>,
  and on GBIF as dataset `6daed11f-1ee1-43f2-884f-c5f7b91dbc1f`. Source:
  <https://github.com/itomotomi/GreenList>.
- **Grain:** national (`countryCode` JPN only).
- **How a taxon is classed:** it is a checklist of *wild* flowering plants.
  In `distribution.txt`, 8,507 taxa are `native`, 1 is
  `introduced/established`, 3 are `cultivated` and 193 are blank. It has
  in effect no naturalised plants, so black locust is simply absent.
- **Counts:** 8,705 rows. GBIF lists 8,944 accepted taxa: 4,306 species,
  2,187 varieties, 1,569 forms and 336 subspecies.
- **How to get it:** a zip of about 350 KB, CC BY 4.0. The IPT has no
  robots.txt.
- **Verdict: yes (native side only).** It is already the app's second
  opinion for Japan. It can count natives nationally but has no naturalised
  list and no prefecture.

### 2d. Tokyo Wildlife Inventory: Plants (デジタル版東京都野生生物目録「植物」暫定版), Tokyo Metropolitan Government Environment Bureau, compiled at the Makino Herbarium (Tokyo Metropolitan University)

- **URLs:** <https://www.inventory.ikimono.metro.tokyo.lg.jp/inventories>, CSV
  `https://www.inventory.ikimono.metro.tokyo.lg.jp/csv/plantae-1_0_0.csv`
  (v1.0.0, 2025-12-16).
- **Grain:** Tokyo Metropolis. Records carry a municipality, so mainland
  Tokyo can be told apart from Izu and Ogasawara through the record search.
- **How a taxon is classed:** **no native or naturalised column.** The
  columns are names, synonyms and an empty 留意点 (notes) field. *Robinia
  pseudoacacia* and *Solidago altissima* are listed like any native. It is a
  list of what was collected.
- **Counts:** 4,179 species from 115,840 specimen records. The page labels
  it "暫定版（標本情報の一部）", provisional and drawn from part of the
  specimen data. The final 東京都植物目録 is planned by FY2028.
- **robots.txt:** `User-agent: * Allow: /`.
- **Licence:** the terms of use ask for attribution ("データは○年○月○日に
  東京いきもの台帳より取得した"). Each record's IP status is given in the
  record. The site design is copyright. Reuse with a citation looks allowed.
- **Verdict: supporting only.** It shows where a plant has been recorded in
  Tokyo, not whether it is native there. Join it with YList or GreenList.
  Revisit when the final inventory, which should add per-area checklists,
  ships around 2028.

### 2e. Chiba: 千葉県植物誌 (2003, *千葉県の自然誌 別編4*, 1,177 pp.) and the Chiba Red Data Book 2023

- **Institution:** Natural History Museum and Institute, Chiba (CBM) and the
  Chiba Prefecture Foundation for Historical Materials.
- **Counts:** the 2003 flora treats "千葉県に自生する維管束植物2786種類". The
  2023 RDB (`https://www.pref.chiba.lg.jp/shizen/seibutsu/kishoushu/documents/1-2-rdb-p-2023-syushi1.pdf`,
  checked) puts the native seed plants assessed at "1565 種、8 亜種、185 変種、
  215 品種、65 雑種". The fern volume gives 311 taxa. Chiba's naturalisation
  rate of 31.9% (2003) is quoted second-hand in a Kanagawa museum article.
- **How to get it:** the flora is a printed book. The RDB PDFs list only
  threatened taxa.
- **robots.txt:** pref.chiba.lg.jp has no robots.txt (an HTML page comes
  back); chiba-muse.or.jp allows everything but wp-admin.
- **Verdict: by hand, low priority.** The book is the authority but it is
  print only and 23 years old. Use the RDB totals as a printed figure.

### 2f. Saitama: Saitama Red Data Book / Red List 2024

- **Counts:** the RDB 2011 commentary
  (`https://www.pref.saitama.lg.jp/documents/4820/495220.pdf`, checked) gives
  "維管束植物 2,300 種" native, archaeophytes included. The Red List 2024
  (`/documents/262563/rist2024.pdf`) lists 826 vascular taxa, threatened
  only. A search also reported 602 alien species in 105 families (latest
  prefectural survey); I didn't confirm that in the PDF.
- **robots.txt:** blocks only Ahrefs and Semrush bots.
- **Verdict: no (totals only).** It has no full checklist online.

### 2g. Others checked

- **NIES Invasive Species of Japan** (<https://www.nies.go.jp/biodiversity/invasive/DB/toc8_plants.html>):
  149 vascular-plant entries, invasives only, national. robots.txt allows
  everything. **No** as a checklist; fine for invasive notes.
- **Shimizu, *Naturalized Plants of Japan*:** print book. **No.**
- **Ibaraki, Tochigi and Gunma floras:** I found no current online checklist.
  The prefectural museums publish municipal survey reports (e.g. the Ibaraki
  Nature Museum). **No** for now.
- **"Atlas of Japanese Flora" / prefecture distribution maps at Kahaku:** not
  found online. Unverified, so not counted.
- **GRIIS Japan (GBIF):** GBIF's API kept resetting, so not checked. Worth a
  second look as a national naturalised list.

### Recommendation for the Kantō Plain

1. **YList (2b)** for per-taxon native, naturalised and cultivated status
   nationally. Scripted; no licence stated, so ask before redistributing.
2. **Flora of Kanagawa 2018 (2a)** as the regional academic flora, with
   counts: 2,199 native and 1,036 naturalised taxa. By hand; its terms forbid
   redistributing the e-book, so ask before committing a derived list.
3. **GreenList (2c)** stays as the CC BY native cross-check.
   **Tokyo's inventory (2d)** answers "recorded in Tokyo".

No source gives native status for the Kantō Plain as a whole. Kanagawa is
the one prefecture with a modern, complete, status-flagged flora.
