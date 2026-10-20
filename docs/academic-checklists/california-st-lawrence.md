# Native-status checklists: Southern California, Central Coast, St Lawrence Lowlands

Researched 2026-10-17. Each source below was checked with a handful of requests at most. Where a site blocks bots
(robots.txt, Cloudflare Turnstile, Anubis), I did **not** fetch the blocked paths. Instead I wrote out what a person
would do in a browser, the way `atlas-florida/README.md` and OregonFlora are handled now. Blocked sources are
ranked on quality, not on how easy they are to fetch.

The files the counts were checked against were not committed; each source's own download is named below.

---

## 1 & 2. California (Southern California coast, Central Coast)

### Jepson eFlora — University and Jepson Herbaria, UC Berkeley

- **What:** *Jepson eFlora* (the online second edition of *The Jepson Manual*, revisions 1–14, 2013–2026). Its own
  description says it is "the foremost authority on the native and naturalized vascular plants of California". It
  covers about 7,600 taxa (TJM2).
- **Grain:** Jepson **bioregions**, the best sub-state grain in California, and the only one that is ecological rather than
  political. Every taxon is called **NATIVE or NATURALIZED** (statewide).
  - Southern California: **SCo** (South Coast). Optionally add **PR** (Peninsular Ranges), **WTR / SnGb / SnBr**
    (Transverse Ranges) and **ChI** (Channel Islands) for the foothills.
  - Central Coast: **CCo** (Central Coast), **SCoRO** (outer South Coast Ranges, e.g. the Santa Lucia Range),
    **SCoRI**, and **SnFrB** (San Francisco Bay Area).
- **Official tools (verified on the Tools page, https://ucjeps.berkeley.edu/eflora/tools/):**
  1. *"Generate a list of taxa by bioregion (e.g., all species inferred from the eFlora to be present in the White and
     Inyo mountains)"*. This is a form (`/eflora/region_list.php?region=…`) with a drop-down of every bioregion code,
     SCo, CCo, SnFrB, SCoRO and so on.
  2. *"Retrieve names from eFlora"*. This is a POST to `/cgi-bin/eflora/get_JM_name_data`. It has a field picker that
     includes **Nativity**, Family, Name with or without authors, Synonyms and Common names, and a radio button for
     *Native taxa only / Naturalized taxa only / All taxa*. This is the statewide name list with nativity, in bulk.
  3. "Summary statistics" (`IJM_stats.php`) is where Jepson publishes its totals. I could not read it from here, so
     **no counts are quoted**.
- **Bot access:** ucjeps.berkeley.edu has no robots.txt (404), and its main page and Tools page load. However, the
  tools themselves live on `herbariadb.berkeley.edu`, and every path there redirects to a **Cloudflare Turnstile**
  "Please verify" page. That includes `robots.txt`, `region_list.php` and `IJM_stats.php`. So: **by hand**.
- **By hand (about 5–9 page saves):**
  1. Open https://ucjeps.berkeley.edu/eflora/tools/ in a browser and pass the "verify you are human" check once.
  2. Under *Generate a list of taxa by bioregion*, pick **SCo** and click *Submit bioregion*. Save the result page
     (File → Save as, HTML or text). Repeat for each bioregion you want: SCo (plus PR, WTR, ChI if wanted) for the
     south, and CCo, SCoRO, SnFrB for the Central Coast. That is 3–7 saves.
  3. Under *Retrieve names from eFlora*, select fields *Nativity*, *Name without authors*, *Family* and *Synonyms*
     (Ctrl/Cmd-click). Choose **All taxa** and click *Retrieve names*, then save the page. That is 1 save, and it is the
     join that turns each bioregion list into native vs naturalized.
  4. Optionally, open *Summary statistics* and save it for the totals.
  5. Put the files in `data/sources/jepson/raw/`. The commented-out "Natives only" checkbox on the region form suggests
     the region list carries no nativity of its own, so the join in step 3 is needed.
- **Terms:** The footer says "© UC Regents · All rights reserved". I found no clause that bans reusing the data itself.
  Nativity and bioregion presence are facts, so keep those and nothing Jepson wrote. Cite as: Jepson Flora Project
  (eds.) 2026, *Jepson eFlora*, https://ucjeps.berkeley.edu/eflora/.
- **Pitfalls:**
  - Nativity is **statewide**. A plant native to the Sierra but escaped in San Diego shows as "native" in an SCo list.
    San Diego has 20 such taxa (see the next source).
  - Bioregion presence is *"inferred from the eFlora"*, meaning from the treatments' distribution statements, not from
    specimens.
  - Bioregion edges don't match counties. Santa Barbara's coastal plain is in SCo, the Santa Ynez Mountains are in WTR,
    and northern Santa Barbara County is in SCoRO/CCo.
  - Waifs and the roughly 240 not-fully-naturalized aliens are not in the eFlora.
- **Verdict: YES, by hand.** It is the first source for both California regions.

### San Diego County checklist — San Diego Natural History Museum and SDSU

- **What:** Rebman, J.P., J. Gregory & M.G. Simpson. 2025. *Checklist of the Vascular Plants of San Diego County,
  California*, 6th ed. San Diego Natural History Museum (ISBN 978-0-918-96909-5).
  - PDF: https://sdplantatlas.org/pdffiles/Rebman_etal2025-ChecklistSDCo.pdf (3.7 MB, downloaded).
  - An online per-family version is at https://sdplantatlas.org/checklist/checklist_sd.aspx (still labelled as based
    on the 5th edition).
- **Grain:** **County**, with nativity **to the county**. Non-native, naturalized taxa are marked with a leading `*`,
  and hybrids with `†`. Almost every taxon (>98%) is backed by a voucher number.
- **Counts, as printed in the introduction (PDF text lines 223–235):**
  - 2,879 total taxa (2,652 species). **Native: 1,945 (67.5%). Non-native, naturalized: 934 (32.5%).**
  - It also says: "Of the taxa we list as non-native to San Diego County, 20 are native to the [rest] of the state."
    This is exactly the case Jepson's statewide nativity misses.
- **How to obtain:** One PDF. `pdftotext -layout` gives clean rows, e.g. `*Erodium cicutarium (L.) Aiton …` and
  `Salvia apiana Jeps. {Gander 1325, …} White Sage`.
- **robots.txt:** sdplantatlas.org has none (404). sdnhm.org's only blocks CMS folders. **A script may fetch it** once,
  naming Indigene in its user agent.
- **Terms:** "© 2025 … This material may not be reproduced or resold." That covers the publication. Native status per
  taxon is fact, so keep the facts only, as with Burke.
- **Pitfalls:**
  - It covers one county (San Diego) out of the six in the region.
  - It includes some taxa backed only by iNaturalist observations (Appendix 3).
- **Verdict: YES, scriptable.** It is the second source for Southern California and the best county-grain source in the
  state.

### Santa Cruz County checklist — CNPS Santa Cruz County Chapter, vouchers at UCSC

- **What:** Neubauer, D. 2013. *Annotated Checklist of the Vascular Plants of Santa Cruz County, California*, 2nd ed.
  CNPS Santa Cruz County Chapter. It was summarized in *Madroño* 61(2):244 (2014).
  - PDF (4.2 MB, downloaded):
    https://www.santacruzmuseum.org/wp-content/uploads/2021/07/Annotated-Checklist-of-the-Vascular-Plants-of-Santa-Cruz-County-California_Dylan-Neubauer_2013.pdf
  - It adds about 4,000 vouchers to the UCSC Herbarium. A 3rd edition is reportedly expected in 2027.
- **Grain:** **County**, with county-level nativity. `*` marks naturalized taxa, and `{*}` marks taxa *native to
  California but not to the county*. Nativity follows TJM2. `W` marks 25 waifs.
- **Counts, as printed (line 1478):** "1594 vascular plant taxa (**1038 native and 556 non-native**, naturalized)…
  taxa native to CA but not to County are treated as non-natives."
- **How to obtain:** One PDF. `pdftotext -layout` gives rows like `* Foeniculum vulgare L  fennel` and
  `Quercus agrifolia var. a. +  coast live oak`.
- **robots.txt:** santacruzmuseum.org returned no rules, so the fetch is allowed. The UCSC arboretum copy of the
  Madroño paper is now a 404.
- **Terms:** "© 2013 by Dylan Neubauer. All rights reserved. No part … may be reproduced." Use the facts only.
- **Pitfalls:**
  - It covers one county of about seven.
  - It dates from 2013 (TJM2 names), so join through synonyms.
- **Verdict: YES, scriptable.** It is the second source for the Central Coast, its county anchor.

### CCH2 — Consortium of California Herbaria (Symbiota)

- **What:** https://www.cch2.org/portal/. Specimens from all the California herbaria, plus Symbiota **checklists**.
  - According to search results drawn from a Symbiota dev mirror of the index (I did not open the production pages),
    the checklists include **county floras** for **San Luis Obispo, Santa Cruz, Ventura** (2,514 taxa), Kings and
    Mendocino, and statewide *Native Plants of California* and *Naturalized Plants of California* lists.
  - There are also many reserve and park lists using the categories NATIVE / NATURALIZED / PERSISTING FROM CULTIVATION
    / WAIF, such as Orange County's Caspers Wilderness Park and Laguna Coast, and UC reserves.
- **Grain:** County or site, per checklist. Nativity is carried in the checklist's notes or by the native/naturalized
  split lists. It varies by author.
- **robots.txt:** It allows Googlebot, Bingbot, Slurp and DuckDuckBot only. **`User-agent: * Disallow: /`**. So: **by
  hand**.
- **By hand (1 download per county list, 2 for the statewide pair):**
  1. Open https://www.cch2.org/portal/checklists/index.php.
  2. Open a county flora (e.g. "San Luis Obispo County", "Ventura County Vascular Plants").
  3. Use the checklist's download icon (Symbiota "Download list" gives a CSV). Turn on *display notes / synonyms*
     first so the nativity notes come along.
  4. Repeat for *Native Plants of California* and *Naturalized Plants of California*.
- **Terms:** Checklists belong to their authors. Specimen data are licensed per collection (mostly CC BY / CC BY-NC).
- **Verdict: BY HAND, third source.** The SLO county list is likely David Keil's (Cal Poly's Hoover Herbarium), which
  is genuinely academic. Check each list's author and date before trusting it.

### Calflora — non-profit, Berkeley

- **What:** County plant lists (*County Level Floras*, generated by *What Grows Here?*, last updated 2022-01-14).
  - A plant is included if there are **≥3 observation records in the county**, native and non-native both.
  - The Advanced Search for Plants has a County filter and a *Native Status* filter, plus *TOOLS / DOWNLOAD RESULTS*.
- **Grain:** County presence. **Nativity is statewide** ("native to California").
- **robots.txt:** It disallows `/app/wgh` (What Grows Here), `/county/`, `/entry/wsearch.html`, `/app/json` and more.
  It allows `/app/ipl`. So: **by hand**.
- **By hand (1 download per county, about 10 in all):**
  1. On https://www.calflora.org, open *Advanced Search for Plants*.
  2. Set County = Los Angeles. Set "Minimum records" to 3 or more. Category = vascular. No native-status filter.
  3. In *Choose Columns*, add *Native Status*. Then use *TOOLS → DOWNLOAD RESULTS* (CSV).
  4. Repeat for Orange, Ventura, Riverside, San Bernardino (whole county, so filter later), Santa Barbara, San Luis
     Obispo, Monterey, Santa Cruz and San Mateo.
- **Terms:** I found no public terms that ban data reuse. Calflora asks to be cited ("Calflora: Information on
  California plants…", Berkeley). Its `/policy/` page is robots-disallowed, so a person should read it before
  committing anything.
- **Pitfalls:**
  - Not academic.
  - Counties come from observations (including iNaturalist), so a plant can be counted in a county from three escaped
    garden records.
  - Statewide nativity has the same problem as Jepson's.
  - The ledger already found its taxon pages "no finer than Kew".
- **Verdict: BY HAND, cross-check only.** It is useful for the counties that have no academic list (LA, Orange,
  Riverside, Monterey).

### Others checked

| Source | Finding | Verdict |
|---|---|---|
| **CNPS Calscape** | Bare 403 / Cloudflare "Just a moment…". It lists natives only, so it can't give a non-native count | no (natives-only; Jepson covers it) |
| **Cal-IPC Inventory** | https://www.cal-ipc.org/plants/inventory/ has a **"Download the Inventory (CSV)"** link. robots allows it. It covers invasive non-natives only, statewide | supplementary for the invasives column, not a checklist |
| **Santa Barbara**: C. Smith 1998, *A Flora of the Santa Barbara Region* (SBBG/Capra) | Print only. SBBG's herbarium is on CCH2 | by hand from the book; prefer a CCH2 list if SBBG posted one |
| **Monterey**: Matthews & Mitchell 2015, *The Plants of Monterey County* (CNPS) | Print book, "over 2300 taxa". No split found | print only |
| **San Luis Obispo**: Hoover & Keil 2023, *Vascular Plants of SLO County*, 2nd ed. | Print, more than 2,000 species. Keil's site lists use `n` / `n1` / `i` codes | print; use the CCH2 county list instead |
| **Los Angeles County** | No current academic county checklist found. There are local floras (Verdugo Mts, Soza et al. 2013: 423 native / 164 non-native) | none at county scale |
| **Ventura**: D. Magney, venturaflora.com | Consultant's flora, 2,749 taxa, PDFs. No robots.txt. Not academic | cross-check only |
| **Tom Chester's S. Cal. master checklist** | Personal list, last updated in 2012, covers SW plus the deserts | no |

### California recommendation

- **Southern California coast:**
  1. **Jepson eFlora, SCo** (+PR/WTR) bioregion list joined to the nativity name list (by hand, about 4 saves).
  2. **San Diego County checklist, 6th ed. 2025** (SDNHM; scriptable; county-level nativity; 1,945 native / 934
     naturalized).
  3. Optionally, Calflora county downloads for LA, Orange, Ventura and western Riverside/San Bernardino as a
     non-academic cross-check.
- **Central Coast:**
  1. **Jepson eFlora, CCo + SCoRO + SnFrB** (by hand).
  2. **Santa Cruz County checklist, Neubauer 2013** (scriptable; county-level nativity; 1,038 native / 556 non-native).
  3. **CCH2 county floras** for San Luis Obispo (Keil) and Ventura (by hand). Calflora for Monterey, Santa Barbara and
     San Mateo.
- **Main pitfall:** Jepson and Calflora give **statewide** nativity. Use the county checklists (SD, Santa Cruz) to catch
  "native to California, not here" plants. Neither county list covers the whole region, so for most of it "native here"
  will rest on Jepson alone plus Kew.

---

## 3. St Lawrence Lowlands

### VASCAN — Université de Montréal (already used)

Province-level native/introduced status for Québec and Ontario. It is the baseline.

### Ontario Species List — Natural Heritage Information Centre (NHIC), Ontario Ministry of Natural Resources

- **What:** The NHIC's *all species lists* workbook, linked from https://www.ontario.ca/page/get-natural-heritage-information.
  - File: https://www.publicdocs.mnr.gov.on.ca/srb/Ontario_Species_list.xlsx (8.2 MB, downloaded; "This list was
    created on Jun 18 2026").
  - It is the provincial list that Oldham & Brinker's *Database of Vascular Plants of Ontario* became.
  - Each row carries authority, synonyms, English **and French** common names, S-rank, G-rank, `EXOTIC_STATUS`,
    coefficient of conservatism and wetness, and a distribution note citing the literature.
- **Grain:** **Province** (Ontario). Each taxon is called native or exotic: `S_RANK = SNA` plus `EXOTIC_STATUS` SE1–SE5
  or SEH means exotic, and S1–S5, SU, SH or SX means native.
- **Counts (my tally of the *Vascular Plants* tab):**
  - **4,220 rows** (species plus infraspecies).
  - **1,303 exotic** (EXOTIC_STATUS set).
  - **2,684 native-ranked** (S1–S5, SU, SH, SX).
  - **233** are SNA with no exotic code (hybrids, accidentals and similar; treat as "not assessed").
  - The species/infraspecies overlap means these are row counts, not species counts.
- **How to obtain:** **Direct XLSX download.** ontario.ca's robots.txt allows `/page/` (it blocks only admin, node and
  search paths, with crawl-delay 1). The publicdocs host has no robots.txt. **A script may fetch it**, once.
- **Terms:** No licence is printed on the page or in the workbook. It is an Ontario government publication offered for
  download ("contact nhicrequests@ontario.ca"). Keep facts only.
- **Pitfalls:**
  - Province-wide: "native in Ontario" includes the Hudson Bay Lowland. Eastern Ontario is a small corner of it.
  - The distribution notes often name counties ("rare escape in southern Ontario"), but not as structured data.
- **Verdict: YES, scriptable.** It is the second source for the region, and it is VASCAN's equal for Ontario. The French
  common names are a bonus for `taxa.fr.ts` review (as a cross-check, not an authority).

### New York Flora Atlas — New York Flora Association, with USF Water Institute and the NY State Museum

- **What:** https://newyork.plantatlas.usf.edu/. It is built from the NY State Museum card files and herbarium
  vouchers. Its native status follows Werier 2017, *Catalogue of the Vascular Plants of New York State*, Memoirs of the
  Torrey Botanical Society 27 (3,524 species + 134 infraspecific taxa + 264 hybrids = 3,922 taxa). I found no
  native/non-native split published.
- **Grain:** **County** presence (vouchered), with **native/non-native per taxon** statewide. The northern counties in
  the region are St. Lawrence, Franklin, Clinton and Jefferson.
- **robots.txt:** It names GPTBot, ChatGPT-User, Bytespider and others (not ClaudeBot). For `*` it disallows
  `/export*`, `/*export*`, `/Results.aspx`, `/ViewAllPlants.aspx` and `/SpecimenResults.aspx`. That covers every
  result page and export. So: **by hand**.
- **By hand (about 4 exports, one per county, or 1 if the form accepts several counties):**
  1. Open https://newyork.plantatlas.usf.edu/, then *Advanced Search*.
  2. Set County = St. Lawrence (then Franklin, Clinton, Jefferson). No nativity filter. Accepted names.
  3. Run the search and use the results page's export (the robots rules name `export`, so the button exists). Save as
     CSV or Excel.
  4. This is the same USF platform as the Florida Atlas, so it is the same routine as `atlas-florida/README.md`.
- **Terms:** None found that ban data reuse. Use facts only.
- **Pitfalls:**
  - County presence comes from vouchers, so a gap can mean nobody collected there.
  - Native status is statewide.
- **Verdict: YES, by hand.** It is the third source, giving county grain for the American side.

### Québec: a second academic source beside VASCAN

| Source | Finding | Verdict |
|---|---|---|
| **Lavoie, Saint-Louis, Guay & Groeneveld 2012**, "Les plantes vasculaires exotiques naturalisées : une nouvelle liste pour le Québec", *Le Naturaliste canadien* 136(3):6–32, doi:10.7202/1009237ar (Université Laval) | Lists **899 naturalized exotic taxa** (880 species + 18 hybrids). Exotics are an estimated 26–28% of the flora. Érudit's robots.txt allows agents, but the PDF sits behind an **Anubis** bot challenge, so I did not fetch it | **by hand**: open the DOI in a browser and save the PDF (1 download). It is an independent academic check of VASCAN's "introduced" calls in Québec, but it covers exotics only |
| **CDPNQ** (Québec government) | Cited as "≈1,180 exotic vascular species (CDPNQ, 2024)". No public full-flora file found on Données Québec | no (not published) |
| **Flore laurentienne / Brouillet et al.** | No downloadable checklist found. *Flore vasculaire du Québec méridional* could not be confirmed as a published dataset | no |
| **Canadensys (MT, QFA herbaria)** | Specimens only, no native status. robots disallows `/explorer/` | no |
| **FloraQuebeca** | A society, not a checklist publisher | no |

### Vermont

- Vermont Fish & Wildlife (Natural Heritage Inventory) prints only totals: "1,585 species of native vascular plants —
  including about 137 that are adventive". It publishes rare-plant PDFs, not a full list.
- The full flora is Gilman 2015, *New Flora of Vermont* (Memoirs NYBG 110), plus Gilman 2016 additions in
  *Phytoneuron*. It is print only.
- Go Botany (Native Plant Trust) gives state-level status, but it was unreachable here (proxy 502), and its maps are
  BONAP-based.
- **Verdict:** Northern Vermont has no obtainable second source. It is a small part of the region, so VASCAN, NHIC and
  NY cover the bulk.

### St Lawrence recommendation

1. **VASCAN** (have; province-level, Québec and Ontario).
2. **NHIC Ontario Species List** (scriptable XLSX; province; native vs exotic; 2,684 native / 1,303 exotic rows).
3. **New York Flora Atlas** (by hand; county; for St. Lawrence, Franklin, Clinton and Jefferson).
4. For Québec specifically, **Lavoie et al. 2012** (by hand, 1 PDF) is the only independent academic second opinion
   found, and it covers exotics only.

**Pitfalls:**
- Québec, the heart of the region, still has **one** full academic source (VASCAN). Lavoie 2012 can only veto a
  "native" call, never confirm one.
- Every source except NY's is province- or state-wide.

---

## robots.txt summary

| Host | Rule for us | Consequence |
|---|---|---|
| ucjeps.berkeley.edu | no robots.txt; tools moved to herbariadb.berkeley.edu, behind Turnstile | by hand |
| www.cch2.org | `User-agent: *  Disallow: /` (search engines only) | by hand |
| www.calflora.org | `/app/wgh`, `/county/`, `/entry/wsearch.html`, `/app/json` disallowed | by hand |
| calscape.org | 403 Cloudflare | by hand (not needed) |
| sdplantatlas.org | no robots.txt | script OK |
| santacruzmuseum.org | no rules | script OK |
| www.cal-ipc.org | only `/wp-admin/` | script OK |
| www.ontario.ca / publicdocs.mnr.gov.on.ca | `/page/` allowed / no robots.txt | script OK |
| newyork.plantatlas.usf.edu | `*`: exports and Results pages disallowed | by hand |
| www.erudit.org | allowed, but Anubis challenge | by hand |
| vtfishandwildlife.com | allowed (but has no full list) | — |
