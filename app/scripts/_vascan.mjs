// Reading VASCAN — the Database of Vascular Plants of Canada — from the archive.
//
// Two scripts need it: `probe-vascan.mjs`, which asked whether a Canadian
// region was possible at all, and `check-vascan.mjs`, which now verifies a
// shipped list against a province. They were resolving names separately, and
// they disagreed — one of them said Sitka spruce is not native to British
// Columbia, which is roughly like saying there are no vineyards in Burgundy.
// So: one module, and the rule below is stated once.
//
// ## Why the archive and not the search API
//
// **VASCAN records distribution on the taxon that has it.** A species with
// named varieties carries an *empty* distribution, and the varieties carry the
// real one. So `?q=Pseudotsuga menziesii` returns an accepted species with no
// provinces at all, and a naive reading concludes Douglas-fir is not native to
// British Columbia. It reported exactly that before this was caught.
//
// The fix is to roll a species up over everything filed beneath it — its
// subspecies and varieties — **and over its synonyms**, which carry their own
// distribution rows. It is also one download instead of several hundred
// requests.
//
// (The API has a second trap worth knowing: repeated `q=` parameters are joined
// into one comma-separated search term rather than treated as a batch, so a
// "batched" call quietly returns one result for a nonsense name.)
//
// Licence: VASCAN is CC BY 4.0 (Canadensys). Attribution lives in
// `DATA_SOURCES.md`; the archive itself is git-ignored and fetched by the probe.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const ARCHIVE_DIR = join(REPO_ROOT, "data", "sources", "vascan", "dwca");

/** Province and territory codes, as `locality` spells them. */
export const PROVINCE_NAMES = {
  BC: "British Columbia", QC: "Quebec", ON: "Ontario", NB: "New Brunswick",
  NS: "Nova Scotia", PE: "Prince Edward Island", AB: "Alberta",
  MB: "Manitoba", SK: "Saskatchewan", NL: "Newfoundland", YT: "Yukon",
  NT: "Northwest Territories", NU: "Nunavut",
};

/** A Darwin Core star-file: tab-separated, one header row, no quoting. */
function readDwc(file) {
  const path = join(ARCHIVE_DIR, file);
  if (!existsSync(path)) {
    throw new Error(
      `No VASCAN archive at ${ARCHIVE_DIR}. Run \`npm run probe:vascan\` once to fetch it.`,
    );
  }
  const lines = readFileSync(path, "utf8").split("\n");
  const cols = lines[0].split("\t");
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const parts = lines[i].split("\t");
    const row = {};
    for (let c = 0; c < cols.length; c++) row[cols[c]] = parts[c] ?? "";
    rows.push(row);
  }
  return rows;
}

/**
 * Open the archive and return one question-answering function.
 *
 * `status(latin, "BC")` → `"native"` · `"introduced"` · `"absent"` · `null`
 *   where `null` means VASCAN has no entry for the name at all — a plant
 *   outside the Canadian flora, which is not the same answer as "not native
 *   here" and must not be reported as one.
 */
export function openVascan() {
  const taxa = readDwc("taxon.txt");
  const byId = new Map(taxa.map((t) => [t.taxonID, t]));

  // Binomial → accepted taxon id, following synonymy. Keyed on genus + specific
  // epithet so an authorship string can't miss a match.
  const binomial = (t) => [t.genus, t.specificEpithet].filter(Boolean).join(" ");
  const acceptedFor = new Map();
  for (const t of taxa) {
    if (t.infraspecificEpithet) continue; // species-rank key only
    const name = binomial(t);
    if (!name) continue;
    const id = t.taxonomicStatus === "accepted" ? t.taxonID : t.acceptedNameUsageID || t.taxonID;
    if (!acceptedFor.has(name) || t.taxonomicStatus === "accepted") acceptedFor.set(name, id);
  }

  // Descendants, indexed once. The probe walked `taxa` inside its own recursion
  // to find synonyms, making the rollup quadratic over a 100 MB archive; these
  // two maps do the same work once.
  const childrenOf = new Map();
  const synonymsOf = new Map();
  for (const t of taxa) {
    if (t.parentNameUsageID) {
      if (!childrenOf.has(t.parentNameUsageID)) childrenOf.set(t.parentNameUsageID, []);
      childrenOf.get(t.parentNameUsageID).push(t.taxonID);
    }
    if (t.acceptedNameUsageID && t.acceptedNameUsageID !== t.taxonID) {
      if (!synonymsOf.has(t.acceptedNameUsageID)) synonymsOf.set(t.acceptedNameUsageID, []);
      synonymsOf.get(t.acceptedNameUsageID).push(t.taxonID);
    }
  }
  /** Everything that rolls up into one taxon: itself, its infraspecifics, its synonyms. */
  function family(id) {
    const out = new Set();
    const stack = [id];
    while (stack.length) {
      const cur = stack.pop();
      if (out.has(cur)) continue;
      out.add(cur);
      for (const c of childrenOf.get(cur) ?? []) stack.push(c);
      for (const sid of synonymsOf.get(cur) ?? []) stack.push(sid);
    }
    return [...out];
  }

  const distByTaxon = new Map();
  for (const d of readDwc("distribution.txt")) {
    if (!distByTaxon.has(d.id)) distByTaxon.set(d.id, []);
    distByTaxon.get(d.id).push(d);
  }

  const cache = new Map();
  /** Every province VASCAN records for a binomial, with its establishment means. */
  function provinces(latin) {
    if (cache.has(latin)) return cache.get(latin);
    const id = acceptedFor.get(latin.trim());
    let out = null;
    if (id && byId.has(id)) {
      out = new Map();
      for (const tid of family(id)) {
        for (const d of distByTaxon.get(tid) ?? []) {
          if (d.countryCode !== "CA") continue;
          // Native anywhere in the rollup wins: a species native in BC whose
          // one variety is introduced in Newfoundland is native in BC.
          const was = out.get(d.locality);
          if (was !== "native") out.set(d.locality, d.establishmentMeans || "native");
        }
      }
    }
    cache.set(latin, out);
    return out;
  }

  return {
    /**
     * The taxon ids a binomial rolls up over — itself, its infraspecifics, its
     * synonyms — or `null` for a name VASCAN doesn't have. The probe needs these
     * to find a French vernacular name, which VASCAN may record on the variety
     * rather than the species, exactly as it does distribution.
     */
    taxonIdsFor(latin) {
      const id = acceptedFor.get(latin.trim());
      return id && byId.has(id) ? family(id) : null;
    },
    provinces,
    status(latin, code) {
      const provs = provinces(latin);
      if (!provs) return null;
      return provs.get(PROVINCE_NAMES[code] ?? code) ?? "absent";
    },
  };
}
