# Native-status sources for Indigene's four French regions

Researched 2026-10-17. Each source was fetched where its robots.txt allowed it. Sites
behind a bot challenge were not fetched; the steps a person would take are given
instead. The counts below were computed from those downloads (not committed) unless a quotation says otherwise.

## The short answer

In France the regional authority on whether a plant is native is the
**Conservatoires botaniques nationaux (CBN)**, one per territory, all
government-approved (agréés). Each one publishes a catalogue: every taxon
recorded in its territory, with an *indigénat* status per region and usually per
département. The national layer, TAXREF (MNHN/PatriNat), says native or
introduced only for **metropolitan France as a whole**. It has no regional
column, and Corsica is included in `FR`.

The only machine-readable source that covers every old region in one
open file is **INPN's BDC-Statuts** (Base de connaissance des statuts, Licence
Ouverte, a plain download from `assets.patrinat.fr`). It holds the **regional
red lists (LRR)**. Under IUCN rules a regional red list scores every *native*
taxon (LC…RE, DD) and puts every non-native one in **NA** ("non applicable",
i.e. exotic). So an LRR row is a native-status verdict at regional grain. It
comes from the same CBN, but as a separate, peer-reviewed act: validated by the
regional scientific council (CSRPN), approved by the French IUCN committee, and
published by the MNHN.

**The independence caveat:** a CBN catalogue and the red list from the same
CBN are two documents written by one institution. Genuinely independent
regional-grain sources are rare in France. The ones that exist are named per
region below: Flora Corsica (Geneva), Tela Botanica's département
chorology (presence only), and the printed regional floras. Kew WCVP and TAXREF
remain the independent national-level floor.

## EEA regions vs. administrative regions and CBN territories

The EEA biogeographical boundaries follow climate, not regions or
départements. Every French region in our app spans several CBNs, and several
CBNs span two EEA regions. The app's own boxes
(`app/src/data/region.france-*.ts`) put Paris in Atlantic (the Continental box
starts at 3° E).

| EEA region (our app) | Administrative regions involved (approx.) | CBN(s) |
|---|---|---|
| **Atlantic** | Bretagne, Pays de la Loire, Normandie, Hauts-de-France, Île-de-France, west/centre Centre-Val de Loire, Nouvelle-Aquitaine (Poitou-Charentes, Aquitaine lowlands, Limousin), Occitanie west (Toulouse plain, Gers) | **CBN Brest** (Bretagne, PdL, Calvados/Manche/Orne); **CBN Hauts-de-France** (ex-Bailleul: HdF + Eure, Seine-Maritime); **CBN Bassin parisien** (MNHN: IdF, Centre-VdL); **CBN Sud-Atlantique** (Aquitaine, Poitou-Charentes); **CBN Massif central** (Limousin); **CBN Pyrénées & Midi-Pyrénées** (Midi-Pyrénées) |
| **Continental** | Grand Est (Alsace, Lorraine, Champagne-Ardenne), Bourgogne-Franche-Comté, east Centre-VdL, Auvergne, Rhône–Saône lowlands (Lyon, Ain plain) | **CBN Franche-Comté–ORI** (now "CBN de Bourgogne-Franche-Comté–ORI", cbnbfc-ori.fr); **CBN Nord-Est** (Lorraine pole + Conservatoire botanique d'Alsace); **CBN Bassin parisien** (Bourgogne, Champagne-Ardenne); **CBN Massif central** (Auvergne); **CBN alpin** (Ain, Isère lowlands) |
| **Mediterranean** | PACA lowlands (13, 83, 84, coastal 06), Languedoc (11, 30, 34, 66, south 48), south Drôme/Ardèche, Corsica | **CBN méditerranéen de Porquerolles** (PACA west/south + ex-Languedoc-Roussillon); **CBN alpin** (04, 05, upper 06, Drôme); **CBN Corse** (OEC); CBN Massif central (Ardèche) |
| **Alpine** (Alps only; the app leaves out the Pyrenees) | AURA (73, 74, 38, 26 partly), PACA (04, 05, 06) | **CBN alpin** (Gap-Charance); CBN méditerranéen (06) |

The boundaries in the second column are from the EEA map as I know it, not
re-measured. Before using the table to file départements, a person should
overlay the EEA shapefile.

**Consequence:** a region's native list has to be stitched from several CBN
files and filtered by département. Then, for any département split by an EEA
line, the app's box has to decide. Most CBN files give status **per
département** (Brest, Hauts-de-France, Sud-Atlantique, Occitanie), so that works.
Some give it only per old region (Franche-Comté, Lorraine, Rhône-Alpes, the
red lists).

---

## Candidate sources

### 1. TAXREF v18 (MNHN / PatriNat / OFB)

- **URL:** zip at <https://assets.patrinat.fr/files/referentiel/TAXREF_v18_2025.zip>,
  listed on PatriNat's [temporary download page](https://www.patrinat.fr/fr/page-temporaire-de-telechargement-des-referentiels-de-donnees-lies-linpn-7353).
  Already fetched by `npm run taxref:extract -- --fetch`.
- **Grain:** territory. The columns are `FR, GF, MAR, GUA, SM, SB, SPM, MAY,
  EPA, REU, SA, TA, TAAF, PF, NC, WF, CLI`. **`FR` = "la France hexagonale et
  la Corse"** (TAXREFv18.pdf), so mainland France and Corsica are one column.
  **No per-region and no per-département status, and no Corsica column.**
- **Codes** (`statuts_note.csv`): P présent (indigène ou indéterminé), E
  endémique, S subendémique, C cryptogène, I introduit (naturalisé), J
  introduit envahissant, M introduit non établi (subspontané/occasionnel/cultivé),
  B occasionnel, D douteux, Q mentionné par erreur, A absent, W disparu, X/Z/Y
  extinct.
- **Counts, from the file** (Plantae, vascular, accepted names, `CD_NOM = CD_REF`):

  | Rank | P | E | S | C | I | J | M | D | Q | A | blank |
  |---|---|---|---|---|---|---|---|---|---|---|---|
  | species | 6,539 | 239 | 76 | 12 | 830 | 49 | 2,218 | 1,307 | 474 | 4,907 | 10,242 |
  | subspecies | 1,278 | 43 | 16 | 2 | 112 | 3 | 148 | 67 | 90 | 170 | 391 |

  So at species rank there are **6,854 native taxa** (P+E+S) and **879
  established introductions** (I+J), plus 2,218 casuals. For comparison, the
  national red list assessed 4,982 native species (cited in the Occitanie CSRPN
  opinion, 2026).
- **Access:** bulk zip, fetched by a script. The INPN website and API sit behind
  a Cloudflare challenge (robots.txt itself returns the challenge), so they are
  not usable.
- **Licence:** Licence Ouverte / Etalab ("TAXREF, INPN / MNHN"), per the repo's
  `data/sources/taxref/README.md`.
- **Verdict:** **yes, as the national floor**, but it **cannot place a plant
  in a region**. It settles "native to France" and nothing finer. Useful
  against the CBN files because they carry TAXREF `CD_REF` codes, so the join is
  exact.

### 2. INPN BDC-Statuts v18: the regional red lists (machine-readable, all of France)

- **URL:** <https://assets.patrinat.fr/files/referentiel/BDC.zip> (33 MB). Inside,
  `BDC_18/bdc_18_01.csv` (329 MB), one row per taxon × status × territory.
- **Grain:** old (pre-2016) administrative region. Filter on
  `CD_TYPE_STATUT = LRR`, `LB_ADM_TR` = region.
- **How native vs non-native shows up:** an IUCN regional red list scores only
  native taxa (archaeophytes included). Exotics are **NA**. A taxon with
  LC/NT/VU/EN/CR/CR*/RE/DD is native in that region. NA means non-native, or
  unstable. **Caveat:** many lists were loaded with only the evaluated (native)
  rows and no NA rows, so a missing row means nothing.
- **Counts, from the file** (vascular plants, all ranks):

  | Region (old) | EEA | Native (evaluated) | NA rows | Source cited in BDC |
  |---|---|---|---|---|
  | Bretagne | ATL | 1,275 | — | Quéré, Magnanon & Brindejonc 2015 (CBN Brest) |
  | Pays-de-la-Loire | ATL | 1,561 | — | Dortel et al. 2015 (CBN Brest) |
  | Basse-Normandie | ATL | 1,338 | — | Bousquet et al. 2015 (CBN Brest) |
  | Haute-Normandie | ATL | 1,443 | 614 | Buchet et al. 2015 (CBN Bailleul) |
  | Hauts-de-France | ATL | **0** | 1,414 | Hauguel & Toussaint 2019. Only the NA rows were loaded |
  | Île-de-France | ATL | 1,336 | — | Auvert et al. 2011 (CBNBP) |
  | Centre | ATL/CON | 1,894 | 852 | CBNBP 2013 |
  | Poitou-Charentes | ATL | 2,141 | 514 | CBN Sud-Atlantique 2018 |
  | Aquitaine | ATL | 2,820 | — | CBN Sud-Atlantique 2018 |
  | Limousin | ATL | 1,410 | — | CBN Massif central 2013 |
  | Midi-Pyrénées | ATL/ALP | 2,842 | 604 | Corriol 2013 (CBNPMP) |
  | Alsace | CON | 1,524 | 776 | Vangendt et al. 2014 |
  | Lorraine | CON | 1,562 | 522 | Bonassi 2015 (CBN Nord-Est pole) |
  | Champagne-Ardenne | CON | 1,454 | — | 2019 |
  | Bourgogne | CON | 2,079 | 869 | CBNBP 2015 |
  | Franche-Comté | CON | 1,687 | — | Ferrez 2014 |
  | Auvergne | CON | 1,817 | — | Antonetti & Nicolas 2012 (CBNMC) |
  | Rhône-Alpes | ALP/CON/MED | 2,980 | — | Guillerme et al. 2015 (CBNA + CBNMC) |
  | PACA | MED/ALP | **408** | — | Noble et al. 2016. **Threatened taxa only**, LC not loaded |
  | Corse | MED | 1,934 | — | Delage & Hugot 2015 (CBN Corse) |
  | Languedoc-Roussillon | MED | — | — | **none: its red list was never finished** |

- **robots.txt:** `assets.patrinat.fr` has none (404). `www.patrinat.fr` is a
  Drupal default with no agent bans.
- **Licence:** INPN reference data are Licence Ouverte. The BDC page itself is
  on inpn.mnhn.fr (challenge-blocked), so a person should confirm the wording
  there once.
- **Verdict:** **yes**, the best open machine source at regional grain for 18
  old regions. Weak where the upload was partial (Hauts-de-France, PACA) and
  missing for Languedoc. It shares authorship with the CBN catalogues, so it
  corroborates their status at a different date and through a different review.
  It is not an independent institution.

### 3. CBN de Brest: Catalogue de la flore et des lichens de l'ouest de la France

- **Institution:** Conservatoire botanique national de Brest. Territory:
  Bretagne, Pays de la Loire, Calvados, Manche, Orne. **Atlantic.**
- **URL:** [Catalogues floristiques](https://www.cbnbrest.fr/observatoire-plantes/boite-a-outils/liste-de-plantes/catalogues-floristiques)
  (published 4 June 2025). Column dictionary:
  [`metadonnees_catalogue_cbnb_2025.xlsx`](https://www.cbnbrest.fr/site/pdf/catalogues/metadonnees_catalogue_cbnb_2025.xlsx)
  (downloaded). The lists themselves come from **eCalluna**, a JS application at
  `https://www.cbnbrest.fr/portail/home/?apps=tool_ecalluna` (iframe on
  [the eCalluna page](https://www.cbnbrest.fr/observatoire-plantes/cartes-et-donnees/ecalluna)).
- **Grain:** **per département**. Three sheets: BZH (22, 29, 35, 56), PDL
  (44, 49, 53, 72, 85), BN (14, 50, 61). Columns `pres_<dep>`, `indig_<dep>`,
  plus `indig_bzh` / `indig_pdl` / `indig_bn` and `indig_tag` for the whole
  territory. Names carry the TAXREF v18 name.
- **Codes** (Geslin, Magnanon & Lacroix 2011, *La question de l'indigénat…*):
  `i` indigène, `ai` assimilée indigène (archaeophyte), `iv` indigénat
  variable, `néi` néo-indigène, `néip` néo-indigène potentielle, `ani`
  assimilée non indigène, `ni` non indigène, `ii` indigénat inconnu/incertain,
  `_` not yet filled in. Presence is coded `pres`, `prb`, `n-revu`, `dt`,
  `dt-anc`, `abs`, `info?`, `pb idt?`.
- **Counts:** none printed on the page. The red lists give 1,275 natives
  (Bretagne), 1,561 (PdL) and 1,338 (Basse-Normandie).
- **robots.txt:** none (it redirects to the homepage), so no restriction.
- **Licence:** the CBN's data-access guide (2024, eCalluna sheet) says
  "**Utilisation libre (open data) sous réserve de mentionner la source des
  données**". Citation: "Application eCalluna, CBN de Brest – [date
  d'extraction]".
- **By hand:** open eCalluna, choose **Listes**, choose territory = *Bretagne*
  (then *Pays de la Loire*, then each Basse-Normandie département, or the
  whole agrément territory), plant group = trachéophytes, and export to the
  spreadsheet (format "tableur excel"). That is **about 3 downloads** (one per
  region sheet), or one for the whole territory if the app offers it. The guide
  warns that the exported descriptors were out of date in v1 and says to ask the
  CBN if needed. Contact: Christophe Bougault, head of the GIS service.
- **Verdict:** **yes (by hand)**. The best source for Brittany, PdL and western
  Normandy, by département.

### 4. CBN des Hauts-de-France (ex-Bailleul): DIGITALE referential v4.0

- **URL:** [Référentiels taxonomiques et des statuts régionaux et départementaux de la flore vasculaire](https://www.cbnhdf.fr/referentiels-taxonomiques-et-statuts-regionaux-et-departementaux-flore-vasculaire),
  direct file <https://www.cbnhdf.fr/system/files/2026-05/DIGITALE_BS-BIF-FVF_PV_4.0_20260331.xlsx>
  (7.6 MB, **downloaded by script**). Version 4.0 is dated 31 March 2026 and
  mapped to TAXREF v18.
- **Grain:** region (HDF, Haute-Normandie) **and per département** (02, 59,
  60, 62, 80, 27, 76). **Atlantic.**
- **Codes** (`STATUIND`): I indigène (archaeophytes and néo-indigènes
  included), X néo-indigène potentiel, Z eurynaturalisé, N sténonaturalisé, A
  accidentel, S subspontané, C cultivé, and `?` versions of each. Mixed
  statuses are joined with `;` (e.g. `I;Z`). The département sheet adds a
  simplified field: I / T (naturalisé) / O (occasionnel) / C. It also has three
  columns from the **"catalogue de la flore vasculaire de France
  métropolitaine"** (presence, indigénat, naturalisation per the CBN network's
  standard, downloaded 23/10/2025). These show a **national CBN catalogue by
  département is being built**. I found no public release of it.
- **Counts, from the file** (Hauts-de-France, present, species and lower
  ranks): I 1,826, I? 22, Z 90, N 95 (+17 N?), A 336, S 9, C 810, plus
  ~200 mixed. By département, species rank, simplified status I: 02 1,345 ·
  59 1,169 · 60 1,264 · 62 1,177 · 80 1,177 · 27 1,263 · 76 1,245.
- **robots.txt:** `User-agent: * Crawl-delay: 10`. Everything allowed.
- **Licence:** none stated in the file. Its required citation is "Conservatoire
  botanique national des Hauts-de-France 2026 – Liste des plantes vasculaires
  … Version 4.0. DIGITALE …". It is offered under "Je télécharge" with no
  restriction.
- **Verdict:** **yes, scriptable**. The best-structured file of any CBN.

### 5. CBN Sud-Atlantique / OBV Nouvelle-Aquitaine

- **URL:** <https://obv-na.fr/ressources>. Spreadsheets downloaded:
  [`CBNSA_2018-Liste_Rouge_flore_vasculaire_Aquitaine_v1.0.xlsx`](https://obv-na.fr/ofsa/ressources/4_ref_bioeval/CBNSA_2018-Liste_Rouge_flore_vasculaire_Aquitaine_v1.0.xlsx)
  and [`…Poitou-Charentes_v1.3.xlsx`](https://obv-na.fr/ofsa/ressources/4_ref_bioeval/CBNSA_2018-Liste_Rouge_flore_vasculaire_Poitou-Charentes_v1.3.xlsx).
- **Grain:** the Aquitaine workbook's sheet **"Fichier de travail source"** is
  the full regional catalogue: presence **per département** (24, 33, 40, 47,
  64), plus "Indigénat Aquitaine" and "Retenu catalogue Aquitaine". The
  Poitou-Charentes workbook gives region-level status only: evaluated natives,
  and an "Autres catégories" sheet with NAa naturalised, NAb occasional,
  cultivated. **Atlantic.**
- **Counts, from the files.** *Aquitaine*, present and retained: **I 3,293**
  (+ Ia 21, In 13, I? 22), **E (exogène) 690**, Q 136, occasionnel 78. Another
  263 I and 53 E have presence still to confirm. *Poitou-Charentes*: 2,195
  evaluated natives; NAa 356, NAb 152, cultivated 83.
- **New:** a Nouvelle-Aquitaine red list was validated by the CSRPN in March
  2026 and awaits IUCN labelling (DREAL NA, `2026_08lrr_florevasc_vf.pdf`).
  When published it will replace both of the above for the whole region.
- **robots.txt:** `User-Agent: *` allowed. ClaudeBot and other AI agents are
  **disallowed only on `/fiche-espece/`**. `/ofsa/ressources/` is allowed.
- **Licence / terms** ([mentions légales](https://obv-na.fr/mentions-legales)):
  the database claims sui generis rights. Downloadable documents may be used
  "sous réserve que soient citées les sources et la date de production", and
  must not be altered or misrepresented. That allows reuse with citation.
- **Bonus:** [`/vegetalisation/choix_especes`](https://obv-na.fr/vegetalisation/choix_especes)
  is a "Module d'aide au choix d'espèces végétales indigènes à implanter": a
  CBN-made **planting recommendation** tool for native species. That is the
  "society/recommendation" kind the source ledger says France lacks. It is
  worth a separate look.
- **Verdict:** **yes, scriptable**. A strong source for the Atlantic south-west.

### 6. CBN du Bassin parisien (MNHN): Île-de-France, Centre-VdL, Bourgogne, Champagne-Ardenne

- **URL:** cbnbp.mnhn.fr. **Cloudflare challenge** (403 even on robots.txt), so
  it was **not fetched**.
- **What exists:** *Catalogue de la flore vasculaire d'Île-de-France (rareté,
  protections, menaces et statuts)*, v1a, April 2011 (Filoche coord.). The PDF
  was read via a mirror ([osny.fr](https://osny.fr/sites/osny/files/document/catalogue-flore-ile-de-france.pdf),
  173 pp). Codes: **Ind.** indigène, **Nat. (E.)** eurynaturalisé, **Nat. (S.)**
  sténonaturalisé, **Subsp.** subspontané, **Acc.** accidentel, **Cult.**
  cultivé, after Toussaint et al. 2005. A rough parse of the PDF finds about
  2,041 Ind., 359 Nat., 144 Subsp. and 344 Acc. rows (all ranks). The Paris
  city document cites ~1,620 wild species in IdF (CBNBP data, 2016).
  Equivalent catalogues exist for Centre, Bourgogne, Champagne-Ardenne and
  Sarthe. BDC carries the red lists for IdF, Centre, Bourgogne and
  Champagne-Ardenne (table above).
- **By hand:** in a browser, open cbnbp.mnhn.fr → *Ressources / Catalogues de
  la flore* (or the "Flora" online database). For each of IdF, Centre-VdL,
  Bourgogne and Champagne-Ardenne, download the current catalogue (xls if
  offered, else PDF). That is **4 downloads**. If only PDFs are offered, the
  table parses cleanly with `pdftotext -layout`, as the 2011 IdF one did.
- **Licence:** not seen (site blocked). MNHN publications are usually reusable
  with citation, but someone should check the terms by hand.
- **Verdict:** **by hand**. Needed for Île-de-France (Atlantic) and
  Bourgogne/Champagne (Continental).

### 7. CBN de Franche-Comté–ORI (cbnbfc-ori.fr; the old cbnfc-ori.org redirects)

- **Documents downloaded:**
  - [Ferrez (coord.) 2013, *Inventaire de la flore vasculaire de Franche-Comté. Indigénats, raretés, menaces, protections*](https://cbnfc-ori.org/sites/default/files/NAFJ11_inventaire-flore-vasculaire-Franche-Comte.pdf),
    *Nouvelles Archives de la Flore jurassienne* 11 (SBFC/CBNFC-ORI), 46 pp. Codes:
    **I** indigène (presumed indigenous, archaeophytes and néo-indigènes
    included), **N** naturalisé, **O** occasionnel. Cultivated taxa are left out.
    Parsed from the table: **I ≈ 2,081, N ≈ 242, O ≈ 186**. It is a
    region-level column, with TAXREF 7 codes.
  - [*Inventaire de la flore vasculaire de Lorraine*](https://cbnfc-ori.org/sites/default/files/documentaton/files/nafj2013_inventaire_flore_vasculaire_lorraine.pdf)
    (NAFJ 13, 2015/16, Lorraine pole of the CBN Nord-Est). Codes: **I**
    indigène s.l., **I?**, **E** exogène, **E?**. Parsed: **I ≈ 1,709 (+47 I?),
    E ≈ 514 (+53 E?)**. TAXREF 7 codes.
- **robots.txt:** allows everyone except GPTBot and Bytespider, which are
  banned site-wide. ClaudeBot is not named.
- **Licence:** none stated. It is a journal article, so facts only.
- **Verdict:** **yes, scriptable from the PDFs**. Status is per old region and
  dated (2013, 2015), and the nomenclature needs a TAXREF 7 → 18 join through
  `CD_NOM`.

### 8. Grand Est: CBN Nord-Est and the Conservatoire botanique d'Alsace

- cbnne.fr: the proxy answered **502**, so the site could not be reached from
  here (`www.cbn-corse.fr`, `www.calluna.fr` and `ecalluna.fr` did the same).
- Usable now: the Lorraine inventory (above). BDC red lists for Alsace (1,524
  natives, 776 NA), Lorraine and Champagne-Ardenne. A single harmonised Grand
  Est ZNIEFF list (2024) and invasives list (2020) exist; neither gives native
  status.
- **By hand:** check cbnne.fr in a browser for a Grand Est *référentiel* or
  *catalogue*. Its absence from search results suggests none has been
  published yet.
- **Verdict:** **Lorraine yes (PDF), Alsace and Champagne via BDC.** No
  unified Grand Est catalogue found.

### 9. CBN méditerranéen de Porquerolles, SILENE (PACA) and Occitanie

- `cbnmed.fr`: no robots.txt (404). The site is a small portal linking to
  [SILENE](https://silene.eu/) (PACA's SINP platform; no robots.txt),
  `flore.silene.eu` (**connection reset** from here), INVMED and RESEDA-Flore.
  `www.cbnmed.fr` has a broken TLS certificate.
- **PACA catalogue:** *Catalogue des plantes vasculaires de la région PACA*
  (Noble et al. 2015, CBNMed + CBNA). It is the base of the PACA red list.
  Figures from the [DREAL PACA red-list brochure](https://www.dre.paca.developpement-durable.gouv.fr/IMG/pdf/ListeRougeFLORE_VF.pdf):
  "Sur les 4 313 espèces recensées en PACA, 3 397 espèces ont été passées au
  crible … 916 espèces ont donc été classées dans la catégorie « Non
  applicable » (NA). Il s'agit d'espèces exogènes". The 2021 update proposal adds
  704 native infraspecific taxa and 86 exotic ones. **PACA: 3,397 native
  species, 916 non-native species.**
- **By hand (PACA):** open flore.silene.eu in a browser and look for the
  *Catalogue / Index de la flore de PACA*. Or ask the CBNMed/CBNA for the
  red-list workbook, which holds all 4,313 species with LC…NA; BDC only loaded
  the 408 threatened ones. One download, either way.
- **Occitanie (Languedoc side):**
  - [*Catalogue de la flore vasculaire exogène de la région Occitanie*](https://doctech.cbnpmp.fr/pee-occitanie/catalogue_flore-vasculaire-exogene_2021.pdf)
    (v1.2, 31 Dec 2020; CBNMed + CBNPMP; PDF downloaded). It lists every
    **non-native** taxon with presence **per département** (11, 30, 34, 48, 66,
    09, 12, 31, 32, 46, 65, 81, 82). Codes: indigénat E exogène / Arch
    archéophyte; naturalisation Pl planté / Accid / Subsp / Nat. Parsed:
    ≈ 457 Nat, 250 Subsp, 95 Pl, 45 Accid (exogenous rows; approximate).
  - **Occitanie red list, 2026:** the CSRPN's favourable opinion n° 2026-05
    ([PDF](https://www.occitanie.developpement-durable.gouv.fr/IMG/pdf/2026-05_avis_lrr_flore_vasc_signe.pdf))
    says "**5941 [taxons] évalués pour le statut d'indigénat, dont 3472 taxons
    évalués pour la liste rouge**" and "**Des catalogues départementaux ont été
    réalisés et sont mis à disposition**". These are the first native-status
    lists for Languedoc since its red list was abandoned in 2015. I found no
    download link yet.
  - **By hand:** look on cbnpmp.fr and the SINP Occitanie portal for the 2026
    *catalogues départementaux* (one file per département: **4 downloads** for
    11, 30, 34 and 66, plus 48 if Lozère's south is wanted).
- **Academic flora:** Tison, Jauzein & Michaud 2014, *Flore de la France
  méditerranéenne continentale* (Naturalia). It is exhaustive for
  Languedoc-Roussillon and PACA and gives status per taxon, but it is a printed
  book: **reference only**.
- **Verdict:** PACA **by hand**. Languedoc: exotic catalogue **yes (PDF)**, and
  the 2026 départemental catalogues **by hand once released**.

### 10. CBN de Corse (Office de l'Environnement de la Corse)

- `cbnc.oec.fr`: robots.txt allows everything except system folders and
  `/catalog_repository/`. The site has no downloadable checklist. Its
  homepage currently carries **injected spam links**. It is not unsafe to read,
  but it suggests the site is barely maintained. `www.cbn-corse.fr` returns 502.
- **Red list:** Delage & Hugot 2015, *Liste rouge régionale de la flore
  vasculaire de Corse*. BDC has **1,934 evaluated native taxa** (no NA rows). A
  CBNC presentation cites "≈ 3 000 espèces en Corse … indigène/autochtone 1 987
  espèces" (via search; not re-fetched).
- **Academic source, independent of the CBN:** Jeanmonod & Gamisans,
  *Flora Corsica* (2007; 2nd ed. 2013, Bull. Soc. Bot. Centre-Ouest no. spéc.
  39), from the **Conservatoire et Jardin botaniques de Genève**. It is the
  standard flora, with status per taxon. Jeanmonod, Schlüssel & Gamisans 2011,
  "Status and trends in the alien flora of Corsica", *EPPO Bulletin* 41
  (open at [archive-ouverte.unige.ch](https://archive-ouverte.unige.ch/unige:17328)),
  gives **aliens ≈ 16.5 % of the flora, 37.5 % of them naturalised**.
  Book: reference and by hand.
- **Also:** Tela BDTFX has a separate `presence_Co` field (below), and Kew
  WCVP has TDWG area **COR**, which `check-native.mjs` already uses for the
  Mediterranean region.
- **Verdict:** red list via **BDC: yes**. WCVP `COR`: **yes, already wired**.
  Flora Corsica: **by hand** (the academic one).

### 11. CBN alpin (Gap-Charance)

- **Note:** the CBN alpin's site is **cbn-alpin.fr**. `cbna.fr` is an unrelated
  site (medical lab and pharmacy spam) and must not be cited. cbn-alpin.fr has
  no robots.txt and lists no catalogue online. Documents live at
  `cbn-alpin-biblio.fr`.
- **Catalogue:** [*Catalogue de la flore vasculaire de la région Rhône-Alpes*](https://sbocc.fr/wp-content/uploads/2020/06/Catalogue-plantes-vasculaires-en-Rhône-Alpes.pdf)
  (CBNA + CBNMC, May 2011, 196 pp; PDF read). Quote: "Le nombre total de
  taxons cités en région Rhône-Alpes est de 5490. Parmi ceux-ci, **4497 sont
  indigènes au sens large** (indigènes au sens strict, néoindigènes, assimilés
  indigènes), **895 sont exogènes** (cultivés, accidentels, établis,
  sténonaturalisés, eurynaturalisés) et **98 ont un indigénat à confirmer**."
  Codes: I / I? / E. The rows carry TAXREF codes and parse cleanly with
  `pdftotext -layout`.
- **Red list:** Rhône-Alpes 2015, 2,980 evaluated natives in BDC. PACA (for 04,
  05, 06): see §9.
- **The grain problem:** status is per **old region**, and Rhône-Alpes
  includes the Lyon plain and the Rhône valley. To narrow the list to the Alps,
  join with occurrence by département (73, 74, 38, 05, 04, 06) or by massif.
  Use Tela chorodep (§12) or OpenObs (§13, by hand).
- **Verdict:** **yes (PDF)** for status. Narrowing to the Alpine zone needs a
  second, presence-only layer.

### 12. Tela Botanica: BDTFX and the département chorology (eFlore)

- **API:** `https://api.tela-botanica.org/service:eflore:0.1/…`. Its robots.txt
  disallows `/services/`, `/scripts/` and others, with `Crawl-delay: 5`.
  **`/service:eflore…` is not disallowed** (and the repo already uses it).
  The main site **www.tela-botanica.org disallows ClaudeBot, anthropic.ai and
  Claude-Web outright**, so downloads from there are by hand.
- **BDTFX** (`bdtfx/noms/<id>`): `presence_Ga` (mainland France) and
  `presence_Co` (**Corsica**, separately), plus a single `statut_origine`
  (Natif / introduit…) and `statut_introduction`. Example: *Quercus robur* is
  Ga = Présent and **Co = Présence douteuse**. It also carries `flore_fg_num`,
  the *Flora Gallica* number. National grain, plus Corsica.
- **chorodep** (`chorodep/observations`): **presence per département**
  (e.g. "Abies alba, Allier, présence"). It records presence, not native
  status. I confirmed only code 1 = "présence"; the other codes need a person
  to read the eFlore legend.
- **Bulk:** BDTFX is offered as a download on the Tela site (BDTFX project
  page). By hand, because of robots.txt: **1 download**.
- **Licence:** Tela data are CC BY-SA (from memory; confirm on the project page).
- **Verdict:** **yes** as the independent, non-CBN national layer: BDTFX for
  native vs introduced, with a Corsica split. chorodep for département
  presence, used to narrow a CBN status to the box. It cannot say "introduced in
  this département".

### 13. OpenObs / INPN regional lists, SI Flore

- **OpenObs** (openobs.mnhn.fr) and **INPN**: **Cloudflare challenge**, not
  fetched. They give occurrence lists per département, with TAXREF's
  **national** status attached. That is presence, not regional native status.
  **By hand:** OpenObs → search → filter *Règne Plantae / Trachéophytes*,
  *Département = X* → *Télécharger* (CSV). **One export per département** (~10
  for the Alps, more for the others). Use it only to narrow.
- **SI Flore** (siflore.fcbn.fr, the old FCBN national atlas): returns "**Site
  indisponible**". Dead.
- **Verdict:** **by hand, presence layer only**. SI Flore: **no** (offline).

### 14. Flora Gallica (Tison & de Foucault 2014, SBF / Biotope)

- A national flora of about 1,400 pages. It states each taxon's status, with
  regional remarks in the text ("naturalisé çà et là…"). The CBNs use it as
  their taxonomic reference (CBN HdF says so), and BDTFX links to it.
- **Verdict:** **no** as a separate machine source. It is the reference that
  TAXREF and the CBN files already follow. Cite it; don't ingest it.

### 15. Others checked

- **Euro+Med PlantBase** (BGBM Berlin): areas `Ga` (France) and `Co`
  (Corsica), no finer than WCVP. europlusmed.org answered **403** to us.
- **Article 17 / DHFF reporting 2019 & 2025** (on assets.patrinat.fr): reported
  **by EEA biogeographical region** (ATL, CON, MED, ALP), but only for the
  Habitats Directive species, a few hundred. Not a flora.
- **Université de Montpellier herbarium (MPU):** a specimen collection with no
  checklist or status data. Not a source for this.

---

## robots.txt and access, at a glance

| Host | robots.txt | Bot challenge | Our verdict |
|---|---|---|---|
| assets.patrinat.fr (TAXREF, BDC) | none | no | script |
| inpn.mnhn.fr, openobs.mnhn.fr, cbnbp.mnhn.fr | Cloudflare challenge (403) | **yes** | by hand |
| www.cbnbrest.fr | none | no; eCalluna is a JS app | by hand (export) |
| www.cbnhdf.fr | `*` allowed, Crawl-delay 10 | no | script |
| obv-na.fr | AI bots disallowed on `/fiche-espece/` only | no | script (`/ofsa/ressources/`) |
| cbnbfc-ori.fr | GPTBot and Bytespider banned; others allowed | no | script |
| cbn-alpin.fr, silene.eu | none (404) | no | — (nothing to fetch) |
| flore.silene.eu | connection reset | — | by hand |
| cbnmed.fr | none (404) | no | — |
| cbnc.oec.fr | system folders only | no | — (nothing to fetch) |
| cbnpmp.fr / doctech | Drupal default | no | script (PDF) |
| cbnne.fr, cbn-corse.fr, ecalluna.fr | proxy 502 | — | by hand |
| www.tela-botanica.org | **ClaudeBot, anthropic.ai, Claude-Web: Disallow /** | no | by hand |
| api.tela-botanica.org | `/services/` etc. disallowed, Crawl-delay 5; `/service:eflore` allowed | no | script (slow) |
| siflore.fcbn.fr | — | "Site indisponible" | dead |

No source's terms forbid reusing the data itself. OBV-NA asks for citation and
no alteration. CBN Brest is open data with attribution. The others state no
licence or are Licence Ouverte.

---

## Recommendations per region

### Atlantic France

1. **The CBN catalogues, by département** (status source):
   CBN Hauts-de-France v4.0 (**script**; HdF + 27/76), CBN Brest catalogue
   (**by hand**, ~3 eCalluna exports; Bretagne, PdL, 14/50/61), and the CBN
   Sud-Atlantique Aquitaine working file (**script**; 24/33/40/47/64) plus the
   Poitou-Charentes list (**script**). Île-de-France and Centre come from the
   CBNBP catalogue (**by hand**, 2 downloads).
2. **The regional red lists in INPN BDC** (**script**, Licence Ouverte):
   Bretagne, PdL, both Normandies, IdF, Centre, Poitou-Charentes, Aquitaine,
   Limousin. They serve as a second, separately reviewed verdict (native =
   evaluated, NA = exotic).
3. **Independent floor:** TAXREF `FR` + Kew WCVP `FRA` (both already wired) +
   Tela BDTFX.

### Continental France

1. **BDC red lists** (**script**): Alsace, Lorraine, Champagne-Ardenne,
   Bourgogne, Franche-Comté, Auvergne. This covers the whole region from one file.
2. **CBN inventories:** Franche-Comté 2013 and Lorraine 2015 (**script**, PDF
   tables with TAXREF codes). CBNBP Bourgogne and Champagne-Ardenne catalogues
   (**by hand**, 2 downloads).
3. Floor: TAXREF / WCVP / BDTFX.

### Mediterranean France

1. **Mainland:** the CBNMed + CBNA PACA catalogue / red-list workbook
   (**by hand**, 1 download or a request). For Languedoc, the 2026 Occitanie
   département catalogues (**by hand**, 4–5 downloads), and meanwhile the
   2021 Occitanie exotic catalogue (**script**, PDF, per département).
2. **Corsica:** the BDC Corsica red list (**script**, 1,934 natives) plus **Flora
   Corsica** (CJBG Geneva, the academic, independent one; **by hand**),
   with **WCVP `COR`** and **BDTFX `presence_Co`** as scriptable cross-checks.
3. Weakest spot in all four regions: **Languedoc**. It has no finished red
   list and no released catalogue yet. Say so on the page until the 2026 files
   are out.

### The French Alps

1. **CBNA + CBNMC Rhône-Alpes catalogue 2011** (**script**, PDF: 4,497 native,
   895 exogenous, 98 uncertain), with the PACA catalogue for 04/05/06
   (**by hand**, the same download as Mediterranean).
2. **BDC red lists** for Rhône-Alpes (2,980) and PACA (partial) (**script**).
3. **Narrowing to the mountains:** Tela chorodep by département (**script**,
   slow) or OpenObs exports (**by hand**, one per département), since the
   status sources are regional and Rhône-Alpes includes lowland Lyon.

### Things worth doing beyond the four regions

- **Ask PatriNat/OFB** when the CBN network's *catalogue de la flore
  vasculaire de France métropolitaine* (by département, indigénat +
  naturalisation; its fields already appear in CBN HdF's v4.0 file) will be
  published. It would replace every by-hand step above with one national file.
- Look at **OBV-NA's "aide au choix d'espèces végétales indigènes"**. It is a
  CBN planting-recommendation tool, which is the source kind the ledger says
  France doesn't have.
