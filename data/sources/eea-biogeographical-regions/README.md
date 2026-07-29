# EEA Biogeographical Regions of Europe

- **Upstream:** EEA Biogeographical Regions of Europe (2016), ArcGIS MapServer —
  `https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/BiogeographicalRegions_WM/MapServer`
- **Licence:** CC-BY 4.0 — attribution: "EEA Biogeographical Regions of Europe
  (CC BY 4.0)". Admin boundaries © EuroGeographics.
- **Consumed by:** the app queries this service **live in the browser** at runtime
  (`app/src/lib/site.ts` → `fetchEcoregionEEA` / `parseEcoregionEEA`). Nothing
  here is bundled — this folder is verification/provenance only.

## `probe.json`

Output of `node app/scripts/probe-eea.mjs`, run from an unblocked machine (the
build sandbox `403`s this host). It records, for the moment it ran:

- the service's **layer list** (to confirm the polygon layer id), and
- a **point query in each French biogeographical region** (Atlantic, Continental,
  Alpine, Mediterranean), with the auto-detected **field name** that holds the
  region — the two facts the parser needs pinned.

Re-run any time to confirm the service hasn't moved/renamed fields; the committed
snapshot makes such a change show up in a diff.
