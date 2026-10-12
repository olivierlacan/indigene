// Which iNaturalist photograph a subject's hero is, if any. Split out of
// `inat-heroes.mjs` so the rule can be tested without the network.
//
// ## Only the one they chose
//
// A taxon page opens with a photograph its curators picked to stand for the
// species. That one, and only that one, is what this tier stores. If it is
// all-rights-reserved we can't show it, and the subject keeps its drawing.
//
// This used to walk down the gallery to the first photograph we were allowed
// to republish. That reads like a kindness and isn't one: nobody chose the
// third photo in a gallery to represent anything. Common persimmon's chosen
// photo is all-rights-reserved, so are the next one, and the third is a close-up
// of two seeds — which then sat at the top of the plant's page, reading as
// bread. A drawing promises nothing; a wrong photograph tells the reader
// something false. 107 of 455 subjects had been filled that way.
//
// The gallery is still the right place to look for a better picture — by a
// person, through the reviewed pipeline (`harvest-hero-photos.mjs`), not here.

/** Licences we may republish with attribution — the harvester's five, plus the
 *  two public-domain codes iNaturalist uses for photographs nobody holds rights
 *  over (`pd` is how a Wikimedia scan of a 1904 plate comes back). Anything
 *  else, "all rights reserved" above all, is refused. */
export const LICENCES = ["cc0", "pd", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"];

/** iNaturalist photo URLs carry the size as the last path segment; everything
 *  downstream derives `medium` and `large` from this one the same way. */
export const squareUrl = (url) =>
  url.replace(/\/(square|small|medium|large|original)\.(\w+)/, "/square.$2");

/**
 * The taxon's own chosen photograph as a stored record, or `{ refused }` saying
 * why there is none. Never a photograph from further down the gallery.
 */
export function choose(taxon) {
  const photo = taxon?.default_photo;
  if (!photo?.id || !photo.url) return { refused: "no chosen photo" };
  if (!LICENCES.includes(photo.license_code)) {
    return { refused: `chosen photo ${photo.id} is ${photo.license_code ?? "all rights reserved"}` };
  }
  return {
    taxonId: taxon.id,
    photoId: photo.id,
    url: squareUrl(photo.url),
    // The name to *print*, which iNaturalist gives separately from the login
    // precisely because the two differ: a photo's rights can belong to
    // someone who never had an account here.
    observer: photo.attribution_name ?? null,
    license: photo.license_code,
    // Verbatim, always. Nothing in this repo separates a photograph from the
    // credit iNaturalist states for it.
    attribution: photo.attribution ?? null,
  };
}
