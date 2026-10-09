// Which of the services our scripts call can a Claude session actually reach?
//
//   npm run network:check            # ask each one, print the table
//   npm run network:check -- --write # and rewrite the table in docs/network.md
//
// A cloud session's outbound traffic goes through the environment's allowlist,
// and for a long time the scripts' comments said "the build sandbox blocks
// iNaturalist" after it no longer did. This replaces the folklore with one
// real request per host, the kind the script that uses it would send.
//
// Three different things can stop a request, and they need different fixes:
//  - **blocked**: the request never got out — the allowlist (or the network).
//    Fixed in the environment's settings, by adding the host.
//  - **challenge**: the host's bot wall (Cloudflare's "Just a moment…") turned
//    us away. No allowlist fixes that; run it on a GitHub runner or locally.
//  - **refused**: the host answered with an error for some other reason.
//  - **timed out** / **unreachable**: the tunnel opened but nothing usable came
//    back — a slow or down host, not the allowlist. Run it again.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC = resolve(HERE, "../../docs/network.md");
const UA = "IndigeneNetworkCheck/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

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
  { host: "www.floridainvasives.org", what: "Florida invasive list", by: "`listings:check`",
    url: "https://www.floridainvasives.org/plant-list/2023-invasive-plant-species/" },
  // Repo
  { host: "raw.githubusercontent.com", what: "Committed files, screenshots", by: "`release-notes`, `build-region-maps`",
    url: "https://raw.githubusercontent.com/olivierlacan/indigene/main/README.md", method: "HEAD" },
];

/** One request, sorted into the ways it can fail. curl rather than fetch,
 *  because only curl reports the proxy's answer to CONNECT separately from the
 *  host's: a 403 there is the allowlist, a 403 after it is the host. */
function probe({ url, method = "GET" }) {
  const args = ["-s", "-o", "/dev/null", "-D", "-", "-L", "-m", "60", "-A", UA,
    "-w", "\n%{http_connect} %{http_code} %{exitcode}"];
  if (method === "HEAD") args.push("-I");
  let out;
  try {
    out = execFileSync("curl", [...args, url], { encoding: "utf8" });
  } catch (err) {
    out = err.stdout ?? "";
  }
  const [connect, code, exit] = out.trim().split("\n").pop().split(" ").map(Number);
  // A proxy that refuses the tunnel answers CONNECT itself (403/407).
  if (connect === 403 || connect === 407) return { verdict: "blocked", status: `proxy ${connect}` };
  if (exit === 28) return { verdict: "slow", status: "timeout" };
  if (!code) return { verdict: "unreachable", status: `curl exit ${exit}` };
  if (/^cf-mitigated:\s*challenge/im.test(out)) return { verdict: "challenge", status: code };
  return { verdict: code < 400 ? "ok" : "refused", status: code };
}

const LABEL = {
  ok: "✅ reachable",
  challenge: "🧱 bot challenge",
  refused: "⚠️ refused",
  slow: "🐢 timed out",
  unreachable: "❓ unreachable",
  blocked: "⛔ blocked",
};

const rows = [];
// A busy shared service (Open-Meteo answers 429 now and then) gets one more
// try before it's reported; the allowlist and a bot wall answer the same twice.
const flaky = (r) => ["slow", "unreachable"].includes(r.verdict) || r.status === 429;
for (const h of HOSTS) {
  let r = probe(h);
  if (flaky(r)) {
    execFileSync("sleep", ["3"]);
    r = probe(h);
  }
  rows.push({ ...h, ...r });
  console.log(`${LABEL[r.verdict].padEnd(18)} ${String(r.status).padEnd(6)} ${h.host}`);
}

const tally = Object.fromEntries(Object.keys(LABEL).map((k) => [k, rows.filter((r) => r.verdict === k).length]));
console.log(`\n${rows.length} hosts · ${Object.entries(tally).map(([k, n]) => `${n} ${k}`).join(" · ")}`);

if (process.argv.includes("--write")) {
  const date = new Date().toISOString().slice(0, 10);
  const table = [
    `Checked ${date} from a Claude session.`,
    "",
    "| Host | What we ask it | Used by | From a session |",
    "|---|---|---|---|",
    ...rows.map((r) => `| \`${r.host}\` | ${r.what} | ${r.by} | ${LABEL[r.verdict]}${r.verdict === "ok" ? "" : ` (${r.status})`} |`),
  ].join("\n");
  const doc = readFileSync(DOC, "utf8");
  const start = "<!-- network:check -->";
  const end = "<!-- /network:check -->";
  const a = doc.indexOf(start);
  const b = doc.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`docs/network.md needs ${start} … ${end} markers`);
  writeFileSync(DOC, `${doc.slice(0, a + start.length)}\n${table}\n${doc.slice(b)}`);
  console.log("wrote docs/network.md");
}
