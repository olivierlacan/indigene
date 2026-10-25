// The animal authorities: who can be asked whether an animal is native, where.
//
// Plants have Kew's World Checklist, one source at one grain for the whole
// world. Animals have nothing like it, so each part of the map is asked of the
// body that keeps its fauna, and every region is also put to the same global
// register of introductions:
//
//   NatureServe Explorer   US states and Canadian provinces — `native` and
//                          `exotic` per subnation. The finest grain we have.
//   NBN Atlas (UKSI)       the UK Species Inventory's establishment means.
//                          One answer for the whole UK, so for Ireland and
//                          Scotland it is a floor; GBIF records say whether the
//                          animal is actually found there.
//   TAXREF (INPN / MNHN)   status in metropolitan France, read offline from
//                          `data/sources/taxref/extract.json`.
//   iNaturalist            New Zealand's and Japan's establishment means — its NZ checklist
//                          is curated, unlike its French one (see
//                          `wildlife-candidates.mjs`). The NZ Organisms Register
//                          was tried first: its biostatus is empty for animals
//                          as plain as the red admiral.
//   GRIIS (via GBIF)       the Global Register of Introduced and Invasive
//                          Species, one list per country. Every region is
//                          checked against it, so an introduction the regional
//                          authority missed still shows.
//
// Each function answers one of: native · introduced · absent · unknown ·
// no-match, plus what was asked and any note. `check-wildlife-native.mjs`
// combines them.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const UA = "IndigeneWildlifeNative/0.1 (https://github.com/olivierlacan/indigene)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, { method = "GET", body, politeMs = 250 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers: { "User-Agent": UA, Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(30000),
      });
      await sleep(politeMs);
      if (res.status === 404) return null;
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (e) {
      if (attempt >= 2) throw e;
      await sleep(2000 * (attempt + 1));
    }
  }
}

/**
 * Which authorities speak for each region, and the place the answer is about.
 * `area` ships to the page in both languages, like the plant evidence's; it is
 * `coarse` where that place is wider than the region.
 */
export const FAUNA_AREA = {
  "mid-atlantic": {
    natureserve: { US: ["PA", "NJ", "DE", "MD", "VA", "NY", "CT", "RI", "MA", "WV"] },
    griis: ["US"],
    area: { en: "the Mid-Atlantic states", fr: "les États du Mid-Atlantic" },
  },
  "north-michigan": { natureserve: { US: ["MI"] }, griis: ["US"], area: { en: "Michigan", fr: "le Michigan" } },
  pnw: {
    natureserve: { US: ["WA", "OR"], CA: ["BC"] },
    griis: ["US", "CA"],
    area: { en: "Washington, Oregon & British Columbia", fr: "l’État de Washington, l’Oregon et la Colombie-Britannique" },
  },
  "ca-central-coast": { natureserve: { US: ["CA"] }, griis: ["US"], area: { en: "California", fr: "la Californie" }, coarse: true },
  "ca-south-coast": { natureserve: { US: ["CA"] }, griis: ["US"], area: { en: "California", fr: "la Californie" }, coarse: true },
  "florida-central": { natureserve: { US: ["FL"] }, griis: ["US"], area: { en: "Florida", fr: "la Floride" }, coarse: true },
  "florida-south": { natureserve: { US: ["FL"] }, griis: ["US"], area: { en: "Florida", fr: "la Floride" }, coarse: true },
  chicago: { natureserve: { US: ["IL"] }, griis: ["US"], area: { en: "Illinois", fr: "l’Illinois" } },
  "central-texas": { natureserve: { US: ["TX"] }, griis: ["US"], area: { en: "Texas", fr: "le Texas" }, coarse: true },
  "st-lawrence": {
    natureserve: { CA: ["QC", "ON"], US: ["NY", "VT"] },
    griis: ["CA", "US"],
    area: { en: "Québec, Ontario, New York & Vermont", fr: "le Québec, l’Ontario, l’État de New York et le Vermont" },
  },
  ireland: { nbn: true, presence: "IE", griis: ["IE"], area: { en: "Ireland", fr: "l’Irlande" } },
  "scotland-lowlands": {
    nbn: true,
    presence: "GB",
    griis: ["GB"],
    area: { en: "Great Britain", fr: "la Grande-Bretagne" },
    coarse: true,
  },
  ...Object.fromEntries(
    ["france-atlantic", "france-continental", "france-mediterranean", "france-alpine"].map((id) => [
      id,
      { taxref: true, griis: ["FR"], area: { en: "metropolitan France", fr: "la France métropolitaine" }, coarse: true },
    ]),
  ),
  "nz-auckland": { inat: 6803, griis: ["NZ"], area: { en: "New Zealand", fr: "la Nouvelle-Zélande" }, coarse: true },
  // No open source we could find gives Japanese animals a per-species native
  // status: GBIF has no distributions for them, and iNaturalist's Japan
  // checklist leaves most unmarked. So Kantō animals mostly come back UNKNOWN
  // (recorded, unranked) — honestly — with GRIIS Japan catching introductions.
  kanto: { inat: 6737, griis: ["JP"], area: { en: "Japan", fr: "le Japon" }, coarse: true },
};

/**
 * The species a catalog row is checked as: its members, if it is a group, or
 * its own binomial. Anything else ("Argynnis spp." with no members) is
 * nothing a checklist can answer, and `wildlife-native.test.ts` refuses it.
 */
export function askedNames(w) {
  if (w.members?.length) return w.members;
  if (w.latin && /^[A-Z][a-z]+ [a-z-]+$/.test(w.latin)) return [w.latin];
  return [];
}

// ---------------------------------------------------------------- GBIF

const matchCache = new Map();
/** The GBIF backbone usage for a name, or null. Exact or fuzzy matches only —
 *  a "higherrank" match would quietly turn a species question into a genus one. */
export async function gbifMatch(latin) {
  if (matchCache.has(latin)) return matchCache.get(latin);
  const m = await getJson(`https://api.gbif.org/v1/species/match?kingdom=Animalia&name=${encodeURIComponent(latin)}`, { politeMs: 80 });
  const ok = m && m.usageKey && m.matchType !== "HIGHERRANK" && m.matchType !== "NONE" ? m : null;
  const out = ok ? { key: ok.usageKey, accepted: ok.acceptedUsageKey ?? ok.usageKey, name: ok.canonicalName ?? latin } : null;
  matchCache.set(latin, out);
  return out;
}

/** Every name the GBIF backbone gives a species: accepted, ours, and synonyms.
 *  For a database on an older taxonomy — DBIF still files the purple
 *  hairstreak under Neozephyrus, and the peacock under Inachis. */
export async function gbifNames(latin) {
  const m = await gbifMatch(latin);
  const names = new Set([latin]);
  if (!m) return names;
  const acc = await getJson(`https://api.gbif.org/v1/species/${m.accepted}`, { politeMs: 80 });
  if (acc?.canonicalName) names.add(acc.canonicalName);
  const syn = await getJson(`https://api.gbif.org/v1/species/${m.accepted}/synonyms?limit=100`, { politeMs: 80 });
  for (const r of syn?.results ?? []) if (r.canonicalName && /^\S+ \S+$/.test(r.canonicalName)) names.add(r.canonicalName);
  return names;
}

/** GRIIS's per-country checklists on GBIF. The US one is the contiguous states. */
const GRIIS = {
  US: "32ad19ed-6b89-447a-9242-795c0897f345",
  CA: "b95e74e0-b772-430c-a729-9d56ce0182e2",
  GB: "1288ee7d-d67c-4e23-8d95-409973067383",
  IE: "278c9199-be97-4fd0-9c6c-6c46c4e2369e",
  FR: "692a0aec-70e2-4038-ac9c-9a1d7acc025f",
  NZ: "b286f8ee-1e29-4f8a-a041-9106bb1796f3",
  JP: "5c5a6e45-d510-45ed-b7bf-6d0624fac056",
};
const griisLists = new Map();

/** Every animal in a country's GRIIS list, by backbone key and by name. */
async function griisList(iso2) {
  if (griisLists.has(iso2)) return griisLists.get(iso2);
  const keys = new Set();
  const names = new Set();
  for (let offset = 0; ; offset += 1000) {
    const page = await getJson(
      `https://api.gbif.org/v1/species/search?datasetKey=${GRIIS[iso2]}&limit=1000&offset=${offset}`,
      { politeMs: 100 },
    );
    for (const r of page?.results ?? []) {
      if (r.kingdom && r.kingdom !== "Animalia") continue;
      if (r.nubKey) keys.add(r.nubKey);
      if (r.canonicalName) names.add(r.canonicalName);
    }
    if (!page || page.endOfRecords) break;
  }
  const list = { keys, names, size: names.size };
  griisLists.set(iso2, list);
  return list;
}

/** "listed" when a country's GRIIS register names the animal as introduced. */
export async function griis(latin, countries) {
  const m = await gbifMatch(latin);
  const listedIn = [];
  for (const c of countries) {
    const list = await griisList(c);
    if (list.names.has(latin) || (m && (list.keys.has(m.key) || list.keys.has(m.accepted)))) listedIn.push(c);
  }
  return { listed: listedIn.length > 0, listedIn };
}

/** How many GBIF occurrence records place the animal in a country. */
export async function presence(latin, iso2) {
  const m = await gbifMatch(latin);
  if (!m) return { verdict: "no-match" };
  const r = await getJson(`https://api.gbif.org/v1/occurrence/search?taxonKey=${m.accepted}&country=${iso2}&limit=0`, { politeMs: 80 });
  return { records: r?.count ?? 0 };
}

/** GBIF's spelling of the states and provinces NatureServe names by code. */
const STATE_NAMES = {
  "US-PA": "Pennsylvania", "US-NJ": "New Jersey", "US-DE": "Delaware", "US-MD": "Maryland", "US-VA": "Virginia",
  "US-NY": "New York", "US-CT": "Connecticut", "US-RI": "Rhode Island", "US-MA": "Massachusetts",
  "US-WV": "West Virginia", "US-MI": "Michigan", "US-WA": "Washington", "US-OR": "Oregon", "US-CA": "California",
  "US-FL": "Florida", "US-IL": "Illinois", "US-TX": "Texas", "US-VT": "Vermont",
  "CA-BC": "British Columbia", "CA-QC": "Québec", "CA-ON": "Ontario",
};

/** GBIF occurrence records of a species in one US state or Canadian province. */
async function stateRecords(latin, nation, code) {
  const m = await gbifMatch(latin);
  if (!m) return 0;
  const r = await getJson(
    `https://api.gbif.org/v1/occurrence/search?taxonKey=${m.accepted}&country=${nation}&stateProvince=${encodeURIComponent(STATE_NAMES[`${nation}-${code}`])}&limit=0`,
    { politeMs: 80 },
  );
  return r?.count ?? 0;
}

// --------------------------------------------------------- NatureServe

const nsCache = new Map();
/** NatureServe's global record for a species, matched on its name. */
async function natureServeRecord(latin) {
  if (nsCache.has(latin)) return nsCache.get(latin);
  const r = await getJson("https://explorer.natureserve.org/api/data/speciesSearch", {
    method: "POST",
    body: {
      criteriaType: "species",
      textCriteria: [{ paramType: "quickSearch", searchToken: latin }],
      pagingOptions: { page: 0, recordsPerPage: 20 },
    },
    politeMs: 300,
  });
  const results = (r?.results ?? []).filter((x) => x.recordType === "SPECIES" && x.nations);
  let hit = results.find((x) => x.scientificName === latin);
  let via = null;
  // NatureServe follows its own taxonomy: Argynnis cybele is still Speyeria
  // cybele there. Same epithet, a search that found it under our name: the
  // same animal, recorded as asked via a synonym.
  if (!hit) {
    const epithet = latin.split(" ")[1];
    const same = results.filter((x) => /^\S+ \S+$/.test(x.scientificName) && x.scientificName.split(" ")[1] === epithet);
    if (same.length === 1) {
      hit = same[0];
      via = hit.scientificName;
    }
  }
  const out = hit ? { record: hit, via } : null;
  nsCache.set(latin, out);
  return out;
}

/**
 * NatureServe's answer over a region's states and provinces. One native
 * subnation is enough, as with the plants: the region is their union.
 */
export async function natureServe(latin, subnations) {
  const found = await natureServeRecord(latin);
  if (!found) return { verdict: "no-match" };
  const areas = {};
  for (const [nation, codes] of Object.entries(subnations)) {
    const n = found.record.nations.find((x) => x.nationCode === nation);
    for (const code of codes) {
      const s = n?.subnations?.find((x) => x.subnationCode === code);
      areas[`${nation}-${code}`] = !s ? "absent" : s.native && !s.exotic ? "native" : s.exotic ? "introduced" : "unknown";
    }
  }
  const values = Object.values(areas);
  let verdict = values.includes("native")
    ? "native"
    : values.includes("introduced")
      ? "introduced"
      : values.includes("unknown")
        ? "unknown"
        : "absent";
  // NatureServe leaves a state off a species' record when nobody has ranked it
  // there, which is not the same as the animal being missing: its luna moth
  // has no Florida. So an "absent" is put to GBIF's records for those states,
  // and an animal recorded there is unknown — unranked — rather than absent.
  let recorded;
  if (verdict === "absent") {
    recorded = 0;
    for (const [nation, codes] of Object.entries(subnations)) {
      for (const code of codes) recorded += await stateRecords(latin, nation, code);
    }
    if (recorded) verdict = "unknown";
  }
  return { verdict, areas, via: found.via, uid: found.record.uniqueId, ...(recorded !== undefined ? { recordsInStates: recorded } : {}) };
}

// --------------------------------------------------------------- NBN Atlas

/** The UK Species Inventory's establishment means, through the NBN Atlas. */
export async function nbn(latin) {
  const g = await getJson(`https://species-ws.nbnatlas.org/guid/${encodeURIComponent(latin)}`, { politeMs: 150 });
  // The lookup can answer twice for one name, once with the author appended
  // to the accepted name; the accepted identifier is what both agree on.
  const ids = [...new Set((Array.isArray(g) ? g : []).map((x) => x.acceptedIdentifier).filter(Boolean))];
  if (ids.length !== 1) return { verdict: "no-match", note: ids.length ? "ambiguous name" : undefined };
  const r = await getJson(
    `https://species-ws.nbnatlas.org/search?q=*&fq=idxtype:TAXON&fq=guid:${encodeURIComponent(`"${ids[0]}"`)}&pageSize=1`,
    { politeMs: 150 },
  );
  const row = r?.searchResults?.results?.[0];
  if (!row) return { verdict: "no-match" };
  const means = String(row.establishmentMeans ?? "");
  const verdict = /^(native|reintroduced)$/i.test(means) ? "native" : /non-native|introduced/i.test(means) ? "introduced" : "unknown";
  return { verdict, means: means || null, via: row.scientificName !== latin ? row.scientificName : null, guid: row.guid };
}

// ------------------------------------------------------------------ TAXREF

const TAXREF = JSON.parse(
  readFileSync(fileURLToPath(new URL("../../data/sources/taxref/extract.json", import.meta.url)), "utf8"),
);
export const TAXREF_VERSION = TAXREF.version;

/** TAXREF's FR column, in our words. Its codes are listed in `taxref-extract.mjs`. */
const TAXREF_FR = {
  P: "native", E: "native", S: "native",
  I: "introduced", J: "introduced", M: "introduced", Y: "introduced",
  A: "absent", Q: "absent", W: "absent", X: "absent",
  B: "unknown", C: "unknown", D: "unknown",
};

/** Offline: what the committed TAXREF extract says about metropolitan France. */
export function taxref(latin) {
  const row = TAXREF.taxa[latin];
  if (!row) return { verdict: "no-match" };
  if (!row.fr) return { verdict: "unknown", code: null };
  return { verdict: TAXREF_FR[row.fr] ?? "unknown", code: row.fr, via: row.accepted !== latin ? row.accepted : null };
}

// ------------------------------------------------------------- iNaturalist

/**
 * A place's establishment means for a species, from iNaturalist's checklist.
 *
 * Asked through the observation filters (`native=true`, `introduced=true`),
 * which read the place's checklist. The taxon record's own `listed_taxa` looks
 * like the direct route and isn't: it carries a handful of places, and New
 * Zealand is missing from the tauhou's.
 */
export async function inatPlace(latin, placeId) {
  const s = await getJson(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(latin)}&is_active=true&per_page=10`, { politeMs: 1100 });
  const hit = (s?.results ?? []).find((t) => t.name === latin && t.rank_level <= 10);
  if (!hit) return { verdict: "no-match" };
  const count = async (flag) => {
    const r = await getJson(
      `https://api.inaturalist.org/v1/observations?taxon_id=${hit.id}&place_id=${placeId}${flag ? `&${flag}=true` : ""}&verifiable=true&per_page=0`,
      { politeMs: 1100 },
    );
    return r?.total_results ?? 0;
  };
  const [native, introduced] = [await count("native"), await count("introduced")];
  if (native) return { verdict: "native", records: native, taxonId: hit.id };
  if (introduced) return { verdict: "introduced", records: introduced, taxonId: hit.id };
  const any = await count(null);
  return { verdict: any ? "unknown" : "absent", records: any, taxonId: hit.id };
}
