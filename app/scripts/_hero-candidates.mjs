// The shape of docs/hero-photos/candidates.json, shared by the harvester and
// anything that rewrites the file.
//
// ## Heroes by default
//
// The review that actually happens is one photograph per plant: the one that
// shows it best in a single shot. So a default harvest keeps the top `keep`
// hero candidates and nothing else. The four angles (whole plant, leaves,
// flowers, fruit) are opt-in with `--angles`; they roughly tripled the file,
// to 7.2 MB, for slots nobody had time to fill.
//
// ## Small on purpose
//
// This file is committed, so every byte is in every clone forever. A candidate
// keeps what the review page shows or copies into a pick, and the three image
// statistics behind its score — not the sixteen the scorer measures. And it is
// written one candidate per line: a re-harvest diffs as photos in and out, not
// as forty lines of numbers per photo.

/** The image statistics the review page reads: the score it sorts by, and the
 *  two it divides into the "iso" figure (subject sharp, background calm). */
const QUALITY_KEPT = ["score", "centreDetail", "edgeDetail"];

/** One candidate, trimmed. `withAngles` keeps the angle guess and phenology the
 *  angle slots sort by; a hero-only harvest has no use for them. */
export function slimCandidate(c, withAngles) {
  const quality = c.quality
    ? Object.fromEntries(QUALITY_KEPT.filter((k) => k in c.quality).map((k) => [k, c.quality[k]]))
    : null;
  const out = { ...c, quality };
  // The square and large renditions are the medium URL with one word changed;
  // `sizedUrl` rebuilds them wherever they're needed.
  delete out.thumbUrl;
  delete out.largeUrl;
  if (!withAngles) {
    delete out.angleFit;
    delete out.angle;
    delete out.phenology;
  }
  return out;
}

/** A hero shortlist from any candidate pool: what the general query returned
 *  (never the flowering/fruiting asks), best score first, `keep` of them. */
export function heroFinalists(ranked, keep) {
  return ranked
    .filter((c) => !c.phenology)
    .sort((a, b) => (b.quality?.score ?? 0) - (a.quality?.score ?? 0))
    .slice(0, keep)
    .map((c) => slimCandidate(c, false));
}

/** iNaturalist photo URLs carry the size as the last path segment. */
export const sizedUrl = (url, size) =>
  url ? url.replace(/\/(square|small|medium|large|original)\.(\w+)/, `/${size}.$2`) : url;

/** Pretty at the top, one line per candidate below. */
export function serialize(data) {
  const { shortlists = [], ...head } = data;
  const top = JSON.stringify(head, null, 2).slice(0, -2); // drop the closing "\n}"
  const lists = shortlists.map((s) => {
    const { candidates = [], ...rest } = s;
    const fields = Object.entries(rest)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `      ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
    const cands = candidates.length
      ? `[\n${candidates.map((c) => `        ${JSON.stringify(c)}`).join(",\n")}\n      ]`
      : "[]";
    return `    {\n${[...fields, `      "candidates": ${cands}`].join(",\n")}\n    }`;
  });
  return `${top},\n  "shortlists": [\n${lists.join(",\n")}\n  ]\n}\n`;
}
