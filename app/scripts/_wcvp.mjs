// One way to ask Kew's World Checklist of Vascular Plants a question.
//
// Two scripts need WCVP and they need different things from it:
//
//   - `candidates.mjs` asks *before* a row exists — "is this species native in
//     Oregon, and what is its accepted name?" — to rank a shortlist.
//   - `check-native.mjs` asks *after* — "is every row this region already ships
//     still native in Ireland?" — to verify what's committed.
//
// They arrived independently and for a while each carried its own copy of the
// lookup. One copy resolved names through the ranked search endpoint, the other
// through the exact-name filter; both were correct, which is exactly the kind of
// duplication that stays correct right up until one of them is fixed and the
// other isn't. So: one module, one set of rules, both scripts import it.
//
// ## The trap, which is worth stating once
//
// **Pin the rank, or pin the name.** A plain `search?q=Crataegus+monogyna`
// returns twenty results *without the species among them* — infraspecific taxa
// crowd it out — so a common binomial reads as absent. Hawthorn, foxglove,
// bramble, ribwort plantain and red clover all behave that way. This module
// asks by exact name first and falls back to the ranked endpoint with
// `rank=SPECIES`, so neither spelling of the mistake is reachable from here.
//
// ## Reading a distribution
//
// WCVP marks an *introduction* and leaves a native range blank, so:
//
//   | the area is…                        | means        |
//   |-------------------------------------|--------------|
//   | listed, `establishmentMeans` empty  | **native**   |
//   | listed, `establishmentMeans` set    | that value   |
//   | not listed at all                   | **absent**   |
//
// An absence is not an answer about nativeness — it is the source saying it has
// no record of the plant there, which both callers treat as "don't ship it".
//
// Licence: WCVP is CC BY 4.0 (Royal Botanic Gardens, Kew), read through the copy
// GBIF hosts. Attribution lives in `DATA_SOURCES.md` and in each row's `basis`.

/** WCVP as GBIF hosts it. */
export const WCVP_DATASET = "f382f0ce-323a-4091-bb9f-add557f3a9a2";

const GBIF_SPECIES = "https://api.gbif.org/v1/species";

/**
 * One GBIF call, retried on a transient failure.
 *
 * A checklist run is hundreds of sequential calls, so a single dropped
 * connection used to surface as a row that "failed" — `error fetch failed
 * Quercus alba` in the middle of an otherwise clean Mid-Atlantic run, which
 * reads like a finding about white oak and is nothing of the kind. Four of
 * those appeared in one pass over the US regions.
 */
async function getJson(url, attempt = 0) {
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    // 5xx and 429 are worth another go; a 404 is an answer.
    if (!res.ok) {
      if ((res.status >= 500 || res.status === 429) && attempt < 3) throw new Error(`HTTP ${res.status}`);
      throw Object.assign(new Error(`HTTP ${res.status}`), { final: true });
    }
    return res.json();
  } catch (err) {
    if (err.final || attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    return getJson(url, attempt + 1);
  }
}

/**
 * The accepted WCVP usage for a binomial, following synonymy once.
 *
 * @returns {Promise<{key:number,name:string|null,viaSynonym:string|null}|null>}
 *   `null` when WCVP has no row we may act on — which includes the case that
 *   matters: two synonyms pointing at two different accepted plants. *Rubus
 *   parviflorus* is also, under another author, a synonym of a Cretan bramble,
 *   and picking one of those for the caller would be a fabricated answer.
 */
export async function wcvpAccepted(latin) {
  const want = latin.trim().toLowerCase();

  // 1. Exact canonical-name filter. Cheap, precise, no rank to pin.
  let rows = (await getJson(
    `${GBIF_SPECIES}?datasetKey=${WCVP_DATASET}&name=${encodeURIComponent(latin)}&limit=50`,
  )).results ?? [];

  // 2. Ranked search as a fallback, for a spelling `name=` won't match.
  //
  // The rank filter follows the question. Pinning `rank=SPECIES` is right for a
  // binomial, and wrong for an infraspecific name: WCVP carries `Solidago
  // velutina subsp. californica` as an accepted SUBSPECIES, and filtering to
  // SPECIES threw it away and reported no-match — which reads as "Kew has never
  // heard of this plant" about a plant Kew accepts.
  const infraspecific = want.split(/\s+/).length > 2;
  if (!rows.length) {
    const rank = infraspecific ? "" : "&rank=SPECIES";
    const res = await getJson(
      `${GBIF_SPECIES}/search?datasetKey=${WCVP_DATASET}&q=${encodeURIComponent(latin)}${rank}&limit=8`,
    );
    rows = (res?.results ?? []).filter((r) => {
      const canon = (r.canonicalName ?? "").toLowerCase();
      // For a binomial keep the old, stricter test; for an infraspecific name
      // the canonical form drops the rank marker, so compare without it.
      return infraspecific
        ? canon === want.replace(/\s+(subsp|ssp|var|f)\.?\s+/i, " ")
        : (r.species ?? r.canonicalName ?? "").toLowerCase() === want;
    });
  }
  if (!rows.length) return null;

  const accepted = rows.find((r) => r.taxonomicStatus === "ACCEPTED");
  if (accepted) {
    return {
      key: accepted.key,
      name: accepted.species ?? accepted.canonicalName ?? null,
      viaSynonym: null,
    };
  }

  const synonyms = rows.filter((r) => r.acceptedKey);
  if (!synonyms.length) return null;
  const keys = new Set(synonyms.map((r) => r.acceptedKey));
  if (keys.size !== 1) return null; // ambiguous — a question for a person
  const to = synonyms[0];
  return {
    key: to.acceptedKey,
    name: (to.accepted ?? "").split(/\s+/).slice(0, 2).join(" ") || null,
    viaSynonym: to.accepted ?? to.scientificName ?? null,
  };
}

/** Every distribution row WCVP holds for an accepted usage. */
export async function wcvpDistributions(key) {
  return (await getJson(`${GBIF_SPECIES}/${key}/distributions?limit=500`)).results ?? [];
}

/**
 * What WCVP says about one taxon in one place.
 *
 * @param rows  from `wcvpDistributions`
 * @param match a predicate over a distribution row — callers match on
 *   `locationId` (`TDWG:IRE`) or on `locality` (a state or province name),
 *   because the two callers are asking at different grains.
 * @returns "NATIVE" · "ABSENT" · whatever `establishmentMeans` holds, upper-cased
 */
export function wcvpStatus(rows, match) {
  const here = rows.find(match);
  if (!here) return "ABSENT";
  return (here.establishmentMeans ?? "NATIVE").toUpperCase();
}
