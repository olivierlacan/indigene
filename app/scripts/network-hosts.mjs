// The hosts our scripts and screenshots request, each with the request that
// stands for it. `check-network.mjs` asks them; `allowlist.mjs --check`
// confirms the allowlist covers them.

/** Every host a script or a screenshot fetches from, with the request that
 *  stands for it. Links the app only prints (POWO, IPNI, USDA profiles) are
 *  not here: nothing of ours requests them. */
export const HOSTS = [
  // iNaturalist
  { host: "api.inaturalist.org", what: "Taxa, observations, counts", by: "`hero:inat`, `hero:harvest`, `region-counts`, `candidates`, `reconcile`, the app",
    url: "https://api.inaturalist.org/v1/taxa/52543" },
  { host: "inaturalist-open-data.s3.amazonaws.com", what: "Photographs", by: "`hero:colors`, `hero:harvest`, screenshots",
    url: "https://inaturalist-open-data.s3.amazonaws.com/photos/230661769/square.jpeg" },
  // Names and taxonomy
  { host: "api.gbif.org", what: "WCVP nativity, occurrence counts", by: "`native:check`, `candidates`, `reconcile`",
    url: "https://api.gbif.org/v1/species/match?name=Quercus%20robur" },
  { host: "query.wikidata.org", what: "Identifiers, common names", by: "`reconcile`, `vernacular:check`",
    url: "https://query.wikidata.org/sparql?query=ASK%7B%7D&format=json" },
  { host: "taxref.mnhn.fr", what: "French names (TAXREF)", by: "`vernacular:check`",
    url: "https://taxref.mnhn.fr/api/taxa/search?scientificNames=Quercus%20robur" },
  { host: "api.tela-botanica.org", what: "French names (eFlore)", by: "`vernacular:check`",
    url: "https://api.tela-botanica.org/service:eflore:0.1/bdtfx/noms?masque=Quercus%20robur" },
  { host: "data.canadensys.net", what: "VASCAN (Canadian flora)", by: "`vascan:check`",
    url: "https://data.canadensys.net/vascan/api/0.1/search.json?q=Quercus%20rubra" },
  { host: "plantsservices.sc.egov.usda.gov", what: "USDA PLANTS", by: "`candidates`",
    url: "https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=QURU" },
  // Host plants
  { host: "data.nhm.ac.uk", what: "HOSTS caterpillar host plants", by: "`fetch-hosts`",
    url: "https://data.nhm.ac.uk/api/3/action/datastore_search?resource_id=877f387a-36a3-486c-a0c1-b8d5fb69f85a&limit=1" },
  { host: "api.globalbioticinteractions.org", what: "GloBI interactions", by: "`wildlife-candidates`, US host counts",
    url: "https://api.globalbioticinteractions.org/interaction?sourceTaxon=Quercus&limit=1" },
  { host: "plant-synz.landcareresearch.co.nz", what: "NZ plant–insect records", by: "NZ host counts",
    url: "https://plant-synz.landcareresearch.co.nz/" },
  // Maps and ecoregions
  { host: "gispub.epa.gov", what: "EPA ecoregions", by: "`build-region-maps`, the app",
    url: "https://gispub.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer?f=json" },
  { host: "bio.discomap.eea.europa.eu", what: "EU biogeographical regions", by: "`build-region-maps`, the app",
    url: "https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/BiogeographicalRegions_WM/MapServer/0?f=json" },
  { host: "services.arcgis.com", what: "RESOLVE ecoregions", by: "the app's region lookup",
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Resolve_Ecoregions/FeatureServer/0?f=json" },
  { host: "services7.arcgis.com", what: "Region outlines", by: "`build-region-maps`, the app",
    url: "https://services7.arcgis.com/oF9CDB4lUYF7Um9q/arcgis/rest/services?f=json" },
  { host: "storage.googleapis.com", what: "RESOLVE ecoregions download", by: "`fetch-resolve`",
    url: "https://storage.googleapis.com/teow2016/Ecoregions2017.zip", method: "HEAD" },
  { host: "gis.cec.org", what: "CEC North American ecoregions", by: "`probe-cec`",
    url: "https://gis.cec.org/arcgis/rest/services?f=json" },
  { host: "maps-cartes.services.geo.ca", what: "Canadian ecozones", by: "`probe-cec`",
    url: "https://maps-cartes.services.geo.ca/server_serveur/rest/services?f=json" },
  { host: "www.arcgis.com", what: "Layer search", by: "`probe-cec`",
    url: "https://www.arcgis.com/sharing/rest/search?f=json&num=1&q=ecoregions" },
  { host: "tile.openstreetmap.org", what: "Map tiles", by: "screenshots",
    url: "https://tile.openstreetmap.org/0/0/0.png" },
  // The app's own lookups, which a screenshot of a spot page makes
  { host: "api.open-meteo.com", what: "Frost dates", by: "the app",
    url: "https://api.open-meteo.com/v1/forecast?latitude=48&longitude=2&daily=temperature_2m_min" },
  { host: "archive-api.open-meteo.com", what: "Climate history", by: "the app",
    url: "https://archive-api.open-meteo.com/v1/archive?latitude=48&longitude=2&start_date=2024-01-01&end_date=2024-01-02&daily=temperature_2m_min" },
  { host: "geocoding-api.open-meteo.com", what: "Place search", by: "the app",
    url: "https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=1" },
  { host: "nominatim.openstreetmap.org", what: "Place names", by: "the app",
    url: "https://nominatim.openstreetmap.org/reverse?lat=48&lon=2&format=json" },
  { host: "rest.isric.org", what: "Soil pH", by: "the app",
    url: "https://rest.isric.org/soilgrids/v2.0/properties/query?lat=48&lon=2&property=phh2o&depth=0-5cm&value=mean" },
  { host: "epqs.nationalmap.gov", what: "Elevation", by: "the app",
    url: "https://epqs.nationalmap.gov/v1/json?x=-77&y=38&units=Feet&wkid=4326&includeDate=false" },
  // Invasive lists
  { host: "invmed.fr", what: "French invasive list", by: "`listings:check`", url: "https://invmed.fr/" },
  { host: "www.cal-ipc.org", what: "California invasive list", by: "`listings:check`", url: "https://www.cal-ipc.org/" },
  { host: "www.dcr.virginia.gov", what: "Virginia invasive list", by: "`listings:check`",
    url: "https://www.dcr.virginia.gov/natural-heritage/document/nh-invasive-plant-list-2024.pdf", method: "HEAD" },
  { host: "www.nwcb.wa.gov", what: "Washington noxious weed list", by: "`listings:check`",
    url: "https://www.nwcb.wa.gov/weeds/english-holly" },
  { host: "especes-exotiques-envahissantes.fr", what: "Grand Est invasive list (PDF)", by: "`listings:check`",
    url: "https://especes-exotiques-envahissantes.fr/", method: "HEAD" },
  { host: "www.floridainvasives.org", what: "Florida invasive list", by: "`listings:check`",
    url: "https://www.floridainvasives.org/plant-list/2023-invasive-plant-species/" },
  // Repo
  { host: "raw.githubusercontent.com", what: "Committed files, screenshots", by: "`release-notes`, `build-region-maps`",
    url: "https://raw.githubusercontent.com/olivierlacan/indigene/main/README.md", method: "HEAD" },
];
