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

The one honest unknown from a sandbox: the **exact layer id and field names**
(`code`/`name` vs `short_name`/`PreString`…) must be confirmed against the live
layer from a browser — the EEA host 403s automated fetchers and is blocked from
the CI/agent egress, the same way `gispub.epa.gov` was during the EPA work (see
`docs/ecoregion-plan.md`, Phase A note). So the parser lands unit-tested against a
captured sample response, with a real-browser smoke test as the acceptance step —
identical to how the EPA path shipped.

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

### 4.3 The genuine gap: Lepidoptera host counts
The host score — the single strongest signal in the ranking — is derived in
`lib/plants.ts` from a **raw Lepidoptera host-species count** per plant. In the US
that count comes from the Tallamy / NWF native-plant-finder dataset. **There is no
drop-in French equivalent of that count**, and this is the one number we cannot
approximate without either mis-sourcing it or inventing it — both of which the
app's ethos forbids.

Candidate French/European sources to evaluate (a real task, flagged not assumed):
- **INPN "relations trophiques" / plant–host associations** where present.
- **Lepi'Net** and the **Papillons de France** literature for larval host plants
  (hostplant→butterfly, which must be inverted and counted).
- The **HOSTS database** (NHM London, world Lepidoptera hostplants) — global,
  citable, invertible to a per-plant count.
- European butterfly atlases (e.g. the *Distribution Atlas of European
  Butterflies*) for the specialist/"sole/narrow/broad" reliance tags in
  `data/wildlife.ts`.

**Decision needed:** which source becomes the canonical French host count, and at
what confidence. Until that's settled, French rows should carry `confidence:
"low"` and an honest `basis`, or the host component should be de-weighted for the
French region — not silently filled with a US-shaped guess.

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
3. **Host-count source (§4.3)** — the one true blocker for honest ranking. Which
   dataset, and do we de-weight host for France until it's solid?
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
- NHM HOSTS — world Lepidoptera hostplants (for host counts) —
  https://www.nhm.ac.uk/our-science/data/hostplants/
- RESOLVE/WWF terrestrial ecoregions (finer, CC BY) — see `DATA_SOURCES.md`.
