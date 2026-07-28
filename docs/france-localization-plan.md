# Plan: a French edition of Indigene (localiser Indigene)

**Status:** the **region + ecoregion foundation has shipped** (Track 3's first
region and the ecoregion plumbing); **language/units localization is next**
(Tracks 1–2, not yet built). The question that gated this — *"can we find
ecoregion data for France?"* — had a clear **yes** (see §1), and the app now:
generalizes ecoregions across providers (US EPA Omernik + EEA Biogeographical
Regions of Europe, picked by coordinates); reads elevation from a global source
outside the US; and ships a first European region, **Atlantic France**
(`app/src/data/plants.france-atlantic.ts`, 23 plants), selected via the EEA
`atlantic` region code. The **UI is still English** and units are still
imperial — that's the explicit next step. The remaining honest gap is the one
below in §4.3: the French host counts are genuine genus-level *estimates* pending
a real European host-count source, and **must not be silently inflated** into
false precision — every number in Indigene is meant to be citable. This doc
records what's done, what's feasible next, and the decisions that need a human.

## TL;DR

- **Ecoregion data for France: yes, and it fits our existing pattern.** The EEA
  *Biogeographical Regions of Europe* dataset is CC-BY 4.0, public, and served
  from an **ArcGIS REST MapServer** we can query point-in-polygon exactly the way
  `fetchEcoregion` already queries EPA. France resolves to one of **Atlantic,
  Continental, Alpine, Mediterranean**.
- **The UI is deeply English and deeply American.** ~2,300 user-facing string
  literals across ~50 files, **no i18n layer at all**, plus ~300 spots baking in
  US units and framing (°F, feet/inches, USDA hardiness zones, the USDA soil
  triangle, a USDA propagation database). A French edition is translation *and*
  de-Americanization.
- **The plant list is the binding constraint.** A region is "a data file plus one
  line in `regions.ts`" — but the data file is 20–40 plants with honest
  size-over-time, eco-scores, hardiness, and **Lepidoptera host counts**, each
  with a citable basis. The French host-count source is the genuine gap and needs
  a sourcing decision (§4.3). This is the part we cannot auto-generate.
- **Recommended first PR:** the ecoregion + i18n *foundation* (provider-agnostic
  ecoregions, EEA lookup, a `t()` layer with `fr`/`en` dictionaries, a language
  toggle), shipped with **one** French biogeographic region wired end-to-end but
  its plant list explicitly marked provisional/seeded-small — so the machinery is
  reviewable before the multi-week botanical work lands in follow-ups.

---

## 1. The gate: ecoregion data for France

### What exists, and its license

- **EEA Biogeographical Regions of Europe (2016, v1)** — the official delineation
  used for the EU Habitats Directive (92/43/EEC) and the Bern Convention EMERALD
  network. **License: CC-BY 4.0** (attribution to the European Environment
  Agency; administrative boundaries © EuroGeographics). Compatible with our MIT +
  public/open-data footing — the same footing as EPA Omernik (public domain) and
  the WCVP/GBIF backbones already named in `DATA_SOURCES.md`.
- **Coverage of France:** metropolitan France spans four biogeographical regions —
  **Atlantic** (the west and north), **Continental** (the centre and east),
  **Alpine** (the Alps and Pyrenees), and **Mediterranean** (the south coast and
  Corsica). That's a coarser, cleaner partition than Omernik Level III (4 regions,
  not dozens), which actually suits "which seed list applies" well.
- **Finer alternative if we ever need it:** RESOLVE/WWF terrestrial ecoregions
  (CC BY) split France further — Atlantic mixed forests, Western European
  broadleaf forests, Alps conifer and mixed forests, Northeastern Spain and
  Southern France Mediterranean forests. `DATA_SOURCES.md` already flags WWF/CEC
  as the global path. Start with EEA; keep WWF in reserve.

### Why it slots into the current code with minimal shape change

`fetchEcoregion` in `app/src/lib/site.ts` already does an ArcGIS
`.../MapServer/<layer>/query?geometry=<lon>,<lat>&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=…&f=json`
against EPA. The EEA service answers the **same** query grammar:

```
https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/BiogeographicalRegions_WM/MapServer/<layer>/query
  ?geometry=<lon>,<lat>&geometryType=esriGeometryPoint&inSR=4326
  &spatialRel=esriSpatialRelIntersects
  &outFields=code,name&returnGeometry=false&f=json
```

The layer id and field names are now **confirmed against the live service**
(the EEA host 403s the CI/agent egress, so this was done from an unblocked
machine — the same situation `gispub.epa.gov` was in during the EPA work). Layer
**0** ("Biogeographical regions", polygons); the region slug is the **`short_name`**
field (`atlantic`, `continental`, `alpine`, `mediterranean`), with `code`/`name`
as prettier duplicates. The parser reads `short_name` and keeps a scan of the
other returned fields as a rename fallback. **To re-confirm any time (or from
CI), run `node app/scripts/probe-eea.mjs`** — it lists the layers, probes a point
in each French biogeographical region, and writes the snapshot to
`data/sources/eea-biogeographical-regions/probe.json` (committed as provenance;
see `data/sources/README.md` for the convention and where a CI refresh would
write).

**Caveat to carry, not hide:** EEA biogeographical regions are *coarse* (4 zones
for a whole country). That's fine for picking a seed list, but the confirm screen
should label them honestly — "Atlantic region (EEA biogeographical region)" — and
not overclaim the local precision Omernik Level IV gives in the US.

---

## 2. What "localize" actually means here — three tracks

Localizing Indigene is not "translate the strings." Measured in the current code:

| Track | Surface | Nature of the work |
|---|---|---|
| **1. Language (i18n)** | ~2,300 string literals, ~50 files, **no i18n layer** | Engineering + careful plain-language French |
| **2. De-Americanize** | ~300 hits of °F / ft / inches / USDA zone / soil triangle across 17 files | Engineering (units) + framing choices |
| **3. French plant data** | ≥1 new `plants.<id>.ts` (20–40 rows) + wildlife ties | Botanical sourcing — **cannot be invented** |

Track 3 is the product. Tracks 1–2 are the substrate that lets a French speaker
in France actually use it. All three are needed for a real edition; the first two
can ship as a reviewable foundation while the third is sourced.

---

## 3. Track 1 & 2 — the substrate (engineering)

### 3.1 An i18n layer (there is none today)

Every visible string is inlined in `steps/*.ts`, `components/*.ts`, and
especially `lib/plain.ts` (400 lines of idiomatic plain-language prose — the
`scoreLabels`, `supportLabels`, `propagationMethods`, `sunPlain`, `moisturePlain`,
etc.). Proposed approach, in keeping with "vanilla TS, zero runtime deps,
~105 KB":

- A tiny hand-rolled `lib/i18n.ts`: a `Lang = "en" | "fr"`, a `t(key, params?)`
  lookup over per-language dictionaries, a `formatList`/plural helper, and a
  `lang` signal persisted to `localStorage` (mirrors how `weights`/saved spots
  already persist). **No framework, no ICU library** — a few KB of dictionary,
  not a dependency.
- Move the copy out of `plain.ts` into `locales/en.ts` + `locales/fr.ts`,
  leaving `plain.ts` as the logic that *chooses* which string (the thresholds in
  `sunLabel`, `growthPlain`, etc. stay; only the words move). This is the bulk of
  the mechanical work and where a partial job would show as a half-French UI — so
  it's done per-screen, screen-complete, not string-by-string.
- A language toggle in the header / welcome screen, defaulting from
  `navigator.language` but always user-overridable (same "sensors/guesses lie,
  the manual pick is primary" instinct the sun picker follows).
- **Bundle-size rule applies** (`CLAUDE.md`): a second full dictionary is a few KB
  — re-measure and update the ~105 KB figure everywhere it's quoted, in the same
  PR that adds it.

### 3.2 De-Americanization (units and framing)

A French edition can't speak Fahrenheit and feet. ~300 occurrences across 17
files, concentrated in `lib/plain.ts`, `lib/site.ts`, `components/size-viz.ts`,
`components/plant-card.ts`, `steps/confirm.ts`, `steps/results.ts`, and the four
`data/plants.*.ts` files. Decisions this forces:

- **Temperature → °C, length → metres/cm.** A units module (`lib/units.ts`) keyed
  off `lang` (or an explicit unit pref), so `zoneMinTempF`, `matureHeightFt`,
  `SizeSnapshot.heightFt/spreadFt`, and the human-silhouette scale all render
  metric. The stored data can stay in one canonical unit and convert at the edge;
  cleaner is to store SI and convert for the US regions instead. Either way this
  is a **data-model touch**, not just display, so it's worth doing deliberately.
- **Hardiness framing.** USDA zones are defined for Europe too (France ≈ zones
  7–9), but they are not the everyday idiom there. Options: (a) keep USDA zones as
  the shared spine and lead with "survives winters down to about −12 °C" in
  French plain words (least data churn, mirrors the existing "common parlance
  first, zone in parentheses" rule in `zonePlain`); (b) add a France-appropriate
  climate descriptor. Recommend (a) first — the zone number is a decent
  cross-border spine and the plain-language lead already does the real work.
- **Soil.** The USDA soil texture triangle (`textureClass` in `site.ts`) and
  SoilGrids both work globally — SoilGrids is already worldwide — so soil needs
  translation, not re-sourcing. Good.
- **Solar / climate sources are global.** Open-Meteo (climate) and SoilGrids
  (soil) already cover France. USGS 3DEP elevation is **US-only** — for France,
  swap in a global DEM (Open-Meteo's elevation API, or Copernicus GLO-30) behind
  the same best-effort `fetchElevationSlope` seam.

---

## 4. Track 3 — the French plant list (the real work, no shortcuts)

Adding a region is mechanically trivial (`regions.ts`: one import + one array
entry, plus a `RegionMeta` box and, now, an EEA biogeographical-region tag in
place of `ecoregionsL3`). The *content* is not. Each row in a `plants.fr-*.ts`
file needs, honestly sourced:

### 4.1 Names & native status
- **Tela Botanica BDTFX** (Base de Données des Trachéophytes de France
  métropolitaine) — the authoritative taxonomy/nomenclature for metropolitan
  France, with French vernacular names. Open, and now versed into INPN.
- **INPN (MNHN)** — national inventory: distribution, protection status,
  indigénat (native vs. introduced/invasive) per taxon. This is how we say
  "native *here*", the same bar the US lists hold themselves to.
- Cross-reference to the existing registry spine (WCVP/POWO → IPNI, GBIF) still
  works — these are global — so a French taxon joins `registry.ts` the same way.

### 4.2 Growth, conditions, propagation
- Size-over-time, sun/moisture/pH tolerances: sourced from French/European
  horticultural and ecological references (e.g. *Flora Gallica*, INPN ecology
  fields, national botanical conservatory — CBN — data).
- Propagation: the current `basis` leans on the **USDA Forest Service Native Plant
  Network**, which is US-specific. The French analog is CBN / conservatoire
  propagation guidance. The `PropagationMethod` vocabulary itself is universal and
  needs only translation.

### 4.3 Lepidoptera host counts — the source is found, the recompute is pending
The host score — the single strongest signal in the ranking — is derived in
`lib/plants.ts` from a **raw Lepidoptera host-species count** per plant. In the US
that count comes from the Tallamy / NWF native-plant-finder dataset. The France
rows shipped with **honest genus-level estimates** as a stopgap; the earlier
worry that *no European equivalent existed* turned out to be wrong. It does, and
it's openly licensed (better than the US source, whose reuse terms `DATA_SOURCES.md`
flags as uncertain).

**Canonical source — Gaytán et al. 2026, *European Lepidoptera–Plant
Associations: A Species-Level Interaction Matrix*** (Ecology & Evolution,
[doi:10.1002/ece3.73004](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12906973/)).
**5,152 Lepidoptera × 3,275 vascular-plant species, all of Europe (France
included), species-level, machine-readable, CC-BY 4.0.** This is the direct
Tallamy analogue: aggregate the matrix to plant genus and count distinct
Lepidoptera to get a `hostLepCount` on the **same scale** the US regions use.

**Cross-check — DBIF v2** (CEH/BRC *Database of Insects and their Food Plants*,
[catalogue](https://catalogue.ceh.ac.uk/id/33a825f3-27cb-4b39-b59c-0f8182e8e2e4)):
~47k herbivore–plant interactions for Great Britain, shipping a ready-made
"insect species richness for each plant species" file. **Open Government Licence**
(attribution: "Contains data supplied by NERC"), CSV. Britain-only, but the
Atlantic-France flora overlaps almost entirely — a clean sanity check.

**Backups / reconciliation:** **GloBI** (Global Biotic Interactions — CC-BY, REST
API + full dumps, already ingests HOSTS and DBIF); **HOSTS** (NHM London, global);
and *A checklist of European butterfly larval foodplants*
([PMC10771928](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10771928/), Dryad
[doi:10.5061/dryad.1vhhmgr12](https://datadryad.org/dataset/doi:10.5061/dryad.1vhhmgr12))
— explicitly *larval*, butterflies — useful for the specialist/"sole/narrow/broad"
reliance tags in `data/wildlife.ts`.

**Integration plan (pending the data file):**
- Add `scripts/build-host-counts.mjs` (mirroring `build-registry.mjs`): read the
  matrix CSV → resolve plant names to our registry genera → count distinct
  Lepidoptera per genus → emit `hostLepCount` per plant for every European region.
- **Keep the shared `HOST_ANCHOR` (520)** in `lib/plants.ts` so cross-region
  comparability holds and **US scores don't move** — European oak/willow land near
  that anchor anyway, so no re-anchoring is needed.
- Then swap each France row's `basis` from "genus-level estimate" to the real
  citation and raise `confidence` where the count is now data-backed.

**Verify before trusting:** confirm the matrix records *larval host* (herbivory)
associations, not adult nectar — the paper frames it around host specialization,
so it's larval host, but `hostLepCount` claims "caterpillars that eat this leaf,"
which is a stronger claim than "any association." Until the recompute lands, the
France rows keep their flagged estimates and honest `basis`.

---

## 5. Concrete code changes (so the shape is clear)

1. **Generalize the ecoregion abstraction.** `EcoregionInfo` in `types.ts` is
   EPA-specific (`l3Code`, `US_L*`). Introduce a provider-tagged shape:
   ```ts
   type EcoregionProvider = "epa-omernik" | "eea-biogeo";
   interface EcoregionInfo {
     provider: EcoregionProvider;
     code: string;            // Omernik L3 code, or EEA region code
     name: string;            // display name
     hierarchy?: string[];    // roll-ups (Omernik L1/L2; EEA has none)
     detail?: { code: string; name: string } | null; // Omernik L4; null for EEA
   }
   ```
   Keep the EPA path producing the same values; add `fetchEcoregionEEA`. Choose
   the service by coordinates (CONUS box → EPA; European bbox → EEA), so
   `fetchSite` stays best-effort and offline-safe.
2. **Region selection generalizes from `ecoregionsL3` to a provider-aware tag.**
   `RegionMeta` gains something like `ecoregion?: { provider; codes: string[] }`;
   `regionForSite` keeps its "box gates, code refines" rule (from
   `ecoregion-plan.md` §2) unchanged in spirit — the French region declares its
   EEA region code(s) instead of Omernik L3 codes.
3. **Server mirror.** `server/app/site_fetcher.rb` mirrors `fetchEcoregion`; it
   gets the same EEA branch so the optional proxy path stays in parity.
4. **i18n + units modules** as in §3. `plain.ts` copy moves to `locales/*`.
5. **Elevation source** swap for non-US coordinates (§3.2).
6. **Docs & changelog.** Update `README.md` region list, `DATA_SOURCES.md` (add
   EEA biogeographical regions + French plant sources with licenses), and add a
   warm, plain-language `CHANGELOG.md` entry per `CLAUDE.md` — in French *and*
   English if the release-notes page is to be bilingual (a decision in §6).

---

## 6. Staging, and the decisions a human should make first

**Recommended first PR (foundation, reviewable without the botany):**
provider-agnostic ecoregions + EEA lookup (unit-tested, browser-smoke-tested) +
the i18n layer with `en`/`fr` dictionaries for the core flow + a language toggle +
metric units, shipped with **one** French biogeographic region (proposal:
**Atlantic**, the Paris/Nantes/Bordeaux-facing zone) wired end-to-end but its
plant list **explicitly provisional** — small, `confidence: "low"`, and labelled
in-app as a work-in-progress seed. Follow-ups grow the plant list to full size and
add the other three regions.

Open decisions (these change what gets built, so they're worth confirming up
front rather than guessing):

1. **Scope of a first edition** — the full app in French, or the core spot→results
   flow first? (Recommend: core flow screen-complete, so there's no half-French
   screen.)
2. **Which French region to seed first**, and its reference locale for the numbers
   (proposal: Atlantic / Île-de-France–Atlantic façade).
3. **Host-count source (§4.3)** — *resolved:* the Gaytán 2026 European matrix
   (CC-BY) is the canonical source, DBIF the cross-check. What remains is
   mechanical: retrieve the file, run `build-host-counts.mjs`, replace the
   flagged estimates. No de-weighting needed — the counts will be real.
4. **Bilingual release notes / changelog?** The `/release-notes/` compiler is
   English-only today; a French edition may want a `fr` page.
5. **Units** — metric for the French edition only, or a user unit toggle
   everywhere (US regions included)?

None of these block confirming the headline: **the ecoregion data for France
exists, it's openly licensed, and it fits the architecture.** The work after that
is a real project — mostly honest data-sourcing, not a translation pass.

## Sources
- EEA Biogeographical Regions of Europe (2016), CC-BY 4.0 —
  https://www.eea.europa.eu/en/datahub/datahubitem-view/11db8d14-f167-4cd5-9205-95638dfd9618
  and the ArcGIS service under
  `https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/`.
- EEA data policy (open, CC-BY unless noted) —
  https://www.eea.europa.eu/en/datahub/eea-data-policy
- Tela Botanica — BDTFX (metropolitan France flora) —
  https://www.tela-botanica.org/
- INPN, Muséum national d'Histoire naturelle — https://inpn.mnhn.fr/
- **Host counts (the Tallamy/NWF equivalent for Europe):**
  - Gaytán et al. 2026, *European Lepidoptera–Plant Associations: A Species-Level
    Interaction Matrix*, Ecology & Evolution, CC-BY 4.0 —
    https://doi.org/10.1002/ece3.73004 — **the canonical source.**
  - DBIF v2 (CEH/BRC), Open Government Licence —
    https://catalogue.ceh.ac.uk/id/33a825f3-27cb-4b39-b59c-0f8182e8e2e4 — GB cross-check.
  - GloBI (Global Biotic Interactions), CC-BY — https://www.globalbioticinteractions.org/
  - NHM HOSTS — world Lepidoptera hostplants — https://www.nhm.ac.uk/our-science/data/hostplants/
  - *A checklist of European butterfly larval foodplants* (Dryad, CC0/CC-BY) —
    https://doi.org/10.5061/dryad.1vhhmgr12
- RESOLVE/WWF terrestrial ecoregions (finer, CC BY) — see `DATA_SOURCES.md`.
