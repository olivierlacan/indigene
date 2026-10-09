# Network access

Claude sessions on the web reach the internet through the environment's
**allowlist** (the cloud environment's settings → Network access → Allowed
domains). This page lists every host our scripts and screenshots request and
whether a session can reach it, so nobody has to guess, and nobody writes
"the sandbox blocks it" into a comment after the allowlist changed.

`npm run network:check` sends one real request per host. Add `-- --write` to
rewrite the table below. When you add a script that calls a new host, add the
host to `HOSTS` in `app/scripts/check-network.mjs`.

## Reading the table

- **✅ reachable**: works from a session.
- **⛔ blocked**: the network proxy refused to connect. That's the allowlist: add
  the host in the environment's settings.
- **🧱 bot challenge**: the host's own bot wall (Cloudflare's "Just a
  moment…") turned the request away. The allowlist let it through and can't
  fix this. Run that script locally or in its GitHub workflow.
- **⚠️ refused**: the host answered with an error for another reason. Read
  the status.
- **🐢 timed out** / **❓ unreachable**: the allowlist let the request out,
  but the host was slow or down. Run it again.

Hosts the app only links to (POWO, IPNI, USDA plant profiles, GBIF species
pages) aren't here: nothing of ours requests them. Fathom analytics isn't
either: `csp:check` serves a stand-in for its script.

<!-- network:check -->
Checked 2026-10-09 from a Claude session.

| Host | What we ask it | Used by | From a session |
|---|---|---|---|
| `api.inaturalist.org` | Taxa, observations, counts | `hero:inat`, `hero:harvest`, `region-counts`, `candidates`, `reconcile`, the app | ✅ reachable |
| `inaturalist-open-data.s3.amazonaws.com` | Photographs | `hero:colors`, `hero:harvest`, screenshots | ✅ reachable |
| `api.gbif.org` | WCVP nativity, occurrence counts | `native:check`, `candidates`, `reconcile` | ✅ reachable |
| `query.wikidata.org` | Identifiers, common names | `reconcile`, `vernacular:check` | ✅ reachable |
| `taxref.mnhn.fr` | French names (TAXREF) | `vernacular:check` | 🧱 bot challenge (403) |
| `api.tela-botanica.org` | French names (eFlore) | `vernacular:check` | ✅ reachable |
| `data.canadensys.net` | VASCAN (Canadian flora) | `vascan:check` | ✅ reachable |
| `plantsservices.sc.egov.usda.gov` | USDA PLANTS | `candidates` | ✅ reachable |
| `data.nhm.ac.uk` | HOSTS caterpillar host plants | `fetch-hosts` | ✅ reachable |
| `api.globalbioticinteractions.org` | GloBI interactions | `wildlife-candidates`, US host counts | ✅ reachable |
| `plant-synz.landcareresearch.co.nz` | NZ plant–insect records | NZ host counts | ✅ reachable |
| `gispub.epa.gov` | EPA ecoregions | `build-region-maps`, the app | ✅ reachable |
| `bio.discomap.eea.europa.eu` | EU biogeographical regions | `build-region-maps`, the app | ✅ reachable |
| `services.arcgis.com` | RESOLVE ecoregions | the app's region lookup | ✅ reachable |
| `services7.arcgis.com` | Region outlines | `build-region-maps`, the app | ✅ reachable |
| `storage.googleapis.com` | RESOLVE ecoregions download | `fetch-resolve` | ✅ reachable |
| `gis.cec.org` | CEC North American ecoregions | `probe-cec` | ⚠️ refused (403) |
| `maps-cartes.services.geo.ca` | Canadian ecozones | `probe-cec` | ✅ reachable |
| `www.arcgis.com` | Layer search | `probe-cec` | ✅ reachable |
| `tile.openstreetmap.org` | Map tiles | screenshots | ✅ reachable |
| `api.open-meteo.com` | Frost dates | the app | ❓ unreachable (curl exit 35) |
| `archive-api.open-meteo.com` | Climate history | the app | ❓ unreachable (curl exit 35) |
| `geocoding-api.open-meteo.com` | Place search | the app | ✅ reachable |
| `nominatim.openstreetmap.org` | Place names | the app | ✅ reachable |
| `rest.isric.org` | Soil pH | the app | ✅ reachable |
| `epqs.nationalmap.gov` | Elevation | the app | ✅ reachable |
| `invmed.fr` | French invasive list | `listings:check` | ✅ reachable |
| `www.cal-ipc.org` | California invasive list | `listings:check` | ✅ reachable |
| `www.dcr.virginia.gov` | Virginia invasive list | `listings:check` | ✅ reachable |
| `www.floridainvasives.org` | Florida invasive list | `listings:check` | ✅ reachable |
| `raw.githubusercontent.com` | Committed files, screenshots | `release-notes`, `build-region-maps` | ✅ reachable |
<!-- /network:check -->

## Notes on the exceptions

- **`taxref.mnhn.fr`**: Cloudflare challenges our requests, so
  `vernacular:check` gets no TAXREF answers in a session. Run it in its GitHub
  workflow (`vernacular.yml`).
- **`gis.cec.org`**: answers 403 to every request we've sent, from sessions and
  in its own probe script. Not an allowlist problem.
- **Open-Meteo**: intermittent. On 2026-10-09 the same request succeeded, then
  failed the TLS handshake (curl exit 35) or got a 429, from one minute to the
  next. Every try passed the proxy.
