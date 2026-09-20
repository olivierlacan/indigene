// `npm run societies` — hold each region's list up against a native plant
// society's own list for the same ground, and print where they disagree.
//
// ## Why this is a different question from `npm run coverage`
//
// `coverage` and `candidates` measure us against *occurrence data* — what GBIF
// records growing inside a region's box. That answers "does it grow here",
// which has no opinion about whether anyone should plant it.
//
// This measures us against a list somebody curated for gardeners. That makes
// two comparisons possible that occurrence data cannot support:
//
//   1. **Do they list something we don't?** A real gap, and a ranked one: a
//      plant that brings a genus our region has never carried is worth more
//      than a fourth aster.
//   2. **Do we list something they don't have at all?** Far more interesting.
//      Audubon's full tier is BONAP's county-level native flora, so a plant of
//      ours missing from it is either a native-status claim worth re-checking
//      or a name our normaliser got wrong. Either way somebody should look.
//
// ## The trap this script exists to avoid
//
// The two tiers in the harvested file are not the same kind of list and the
// script never pools them:
//
//   - **curated** — Audubon's own picks for the ZIP. Dozens. Garden intent, the
//     same artifact as ours, and the only fair "are we missing things" set.
//   - **full** — every species BONAP records as native to the ZIP's county.
//     Hundreds, including apomictic microspecies nobody sells. Diffing our 46
//     against their 434 would print a "gap" of 390 that means nothing at all.
//
// So: `full` is used only to check native status, never to count a gap.
//
// ## Usage
//
//   npm run societies                      every region with a harvested list
//   npm run societies -- --region pnw      one region
//   npm run societies -- --missing 25      how many of their picks to name
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { withSeeds } from "./_regions.mjs";

const OUT_DIR = fileURLToPath(
  new URL("../../data/sources/audubon-plants-for-birds/", import.meta.url),
);
// The raw harvest is git-ignored (see harvest-audubon.mjs for why); the
// snapshot this script writes beside it is what the repo keeps.
const SRC_DIR = `${OUT_DIR}raw/`;

const args = process.argv.slice(2);
const only = flag("--region");
const showMissing = Number(flag("--missing") ?? 20);

function flag(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

/**
 * A botanical name reduced to the thing two lists can actually be compared on.
 *
 * Authors, ranks and hybrid markers are noise here: BONAP writes
 * `Symphyotrichum novae-angliae`, a nursery writes `Aster novae-angliae`, and a
 * flora writes `Quercus garryana var. garryana`. We compare genus + specific
 * epithet, lowercased, and nothing else — deliberately coarse, because a false
 * *difference* between the lists is the expensive kind of error here.
 */
function key(latin) {
  const cleaned = latin
    .replace(/\s*×\s*/g, " ")
    .replace(/\bx\s+/gi, "")
    .replace(/\b(var|subsp|ssp|f|cv)\.?\s+\S+/gi, "")
    .replace(/['"]/g, "")
    .trim();
  const [genus, species] = cleaned.split(/\s+/);
  if (!genus) return null;
  return species ? `${genus.toLowerCase()} ${species.toLowerCase()}` : genus.toLowerCase();
}

const genusOf = (k) => (k ? k.split(" ")[0] : null);
const epithetOf = (k) => (k ? k.split(" ")[1] ?? null : null);

/**
 * Genus pairs that are the same plant under a different name.
 *
 * Two lists written a decade apart disagree about generic limits, and the
 * disagreement is not noise — it lands on the plants a region is *about*. We
 * write `Berberis aquifolium`, Audubon writes `Mahonia aquifolium`; untreated,
 * Oregon grape is scored twice, once as a gap in our list and once as a plant
 * whose native status we should go and re-check. Both wrong, and about the
 * most recognisable shrub west of the Cascades.
 *
 * Kept small, explicit and one-directional-free: each pair is written once and
 * matched both ways. Anything not in here that looks like the same case is
 * caught by the epithet collision check below and reported for a human, rather
 * than quietly merged — `Cornus canadensis` and `Sanguisorba canadensis` share
 * an epithet and are not the same plant, so epithet equality alone can never be
 * allowed to decide this.
 */
const GENUS_SYNONYMS = [
  ["berberis", "mahonia"], // Oregon grape: sunk into Berberis, still sold as Mahonia
  ["aster", "symphyotrichum"], // the New World asters, split out in the 1990s
  ["aster", "eurybia"],
  ["chamerion", "chamaenerion"], // fireweed, two spellings of the same segregate
  ["chamerion", "epilobium"], // …and its older home
  ["chamaenerion", "epilobium"],
  ["vaccinium", "oxycoccus"], // cranberries
  ["dichanthelium", "panicum"], // rosette grasses
  ["sorbus", "aucuparia"], // guards against a mis-parse, harmless if unused
];

const synonymGenera = new Map();
for (const [a, b] of GENUS_SYNONYMS) {
  if (!synonymGenera.has(a)) synonymGenera.set(a, new Set([a]));
  if (!synonymGenera.has(b)) synonymGenera.set(b, new Set([b]));
  synonymGenera.get(a).add(b);
  synonymGenera.get(b).add(a);
}

/** Every spelling of a name we are willing to treat as the same plant. */
function keysFor(k) {
  const g = genusOf(k);
  const e = epithetOf(k);
  const alts = synonymGenera.get(g);
  if (!alts || !e) return [k];
  return [...alts].map((a) => `${a} ${e}`);
}

/** Does either list contain any accepted spelling of this name? */
const hasAny = (set, k) => keysFor(k).some((x) => set.has(x));

const loader = await openLoader();
const { REGIONS: RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(RAW);
await loader.close();

const harvested = existsSync(SRC_DIR)
  ? new Set(readdirSync(SRC_DIR).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)))
  : new Set();

if (harvested.size === 0) {
  console.error(
    "\nsocieties: nothing harvested yet. Run `npm run harvest:audubon` first.\n",
  );
  process.exit(1);
}

const regions = REGIONS.filter((r) => (!only || r.meta.id === only));
const pct = (a, b) => (b === 0 ? "—" : `${Math.round((a / b) * 100)}%`);

let anyPrinted = false;
const summary = [];

for (const region of regions) {
  const id = region.meta.id;
  if (!harvested.has(id)) {
    if (only) console.error(`\nsocieties: no harvested list for "${id}".\n`);
    continue;
  }
  anyPrinted = true;
  const doc = JSON.parse(readFileSync(`${SRC_DIR}${id}.json`, "utf8"));

  const ours = new Map();
  for (const p of region.seed) {
    const k = key(p.latin);
    if (k) ours.set(k, p);
  }
  const ourGenera = new Set([...ours.keys()].map(genusOf));

  const curated = new Map();
  for (const p of doc.curated) {
    const k = key(p.latin);
    if (k) curated.set(k, p);
  }
  const full = new Set(doc.full.map((p) => key(p.latin)).filter(Boolean));
  const fullGenera = new Set([...full].map(genusOf));

  // 1. Ours that their flora tier has never heard of.
  const unknownToThem = [...ours.entries()].filter(([k]) => !hasAny(full, k));
  const genusUnknown = unknownToThem.filter(
    ([k]) => ![...(synonymGenera.get(genusOf(k)) ?? [genusOf(k)])].some((g) => fullGenera.has(g)),
  );

  // 2. Their curated picks we don't carry, new genera first.
  const oursKeys = new Set(ours.keys());
  const theirsMissing = [...curated.entries()]
    .filter(([k]) => !hasAny(oursKeys, k))
    .map(([k, p]) => ({ k, p, newGenus: !ourGenera.has(genusOf(k)) }))
    // New genera first, then alphabetical. Deliberately *not* by bird count:
    // the cards cap that list at five, so every plant reports five and the
    // number sorts nothing.
    .sort((a, b) => Number(b.newGenus) - Number(a.newGenus) || a.k.localeCompare(b.k));

  const sharedCurated = [...ours.keys()].filter((k) => hasAny(new Set(curated.keys()), k)).length;
  const curatedGenera = new Set([...curated.keys()].map(genusOf));
  const generaShared = [...curatedGenera].filter((g) => ourGenera.has(g)).length;

  console.log(`\n\x1b[1m${region.meta.name}\x1b[0m  (${id})`);
  console.log(
    `  ${doc.source}, ZIPs ${doc.zips.join(", ")}, harvested ${doc.harvested}`,
  );
  console.log(
    `  us ${ours.size} · their curated picks ${curated.size} · their county flora ${full.size}`,
  );
  console.log(
    `  overlap: ${sharedCurated} of our ${ours.size} are among their picks (${pct(sharedCurated, ours.size)}); ` +
      `genera ${generaShared}/${curatedGenera.size} (${pct(generaShared, curatedGenera.size)})`,
  );

  console.log(
    `\n  \x1b[1mOurs their flora doesn't list\x1b[0m — ${unknownToThem.length} of ${ours.size}` +
      (genusUnknown.length ? `, ${genusUnknown.length} where even the genus is absent` : ""),
  );
  if (unknownToThem.length === 0) {
    console.log("    none — every plant we list is in their native flora for this ground.");
  } else {
    for (const [k, p] of unknownToThem.slice(0, showMissing)) {
      const mark = fullGenera.has(genusOf(k)) ? " " : "!";
      console.log(`    ${mark} ${p.latin.padEnd(34)} ${p.common ?? ""}`);
    }
    if (unknownToThem.length > showMissing) {
      console.log(`    … ${unknownToThem.length - showMissing} more`);
    }
    console.log(
      "    ! = genus absent from their flora too. Check the native claim or the spelling;\n" +
        "      a bird-focused list legitimately skips herbaceous plants, but not whole genera.",
    );
  }

  // Anything the synonym table above doesn't know about, offered to a human
  // rather than merged. Sharing an epithet is weak evidence on its own —
  // plenty of unrelated plants are `canadensis` — so this only ever prints.
  const theirByEpithet = new Map();
  for (const k of [...full, ...curated.keys()]) {
    const e = epithetOf(k);
    if (!e) continue;
    if (!theirByEpithet.has(e)) theirByEpithet.set(e, new Set());
    theirByEpithet.get(e).add(genusOf(k));
  }
  const maybeSynonyms = unknownToThem
    .map(([k, p]) => {
      const others = [...(theirByEpithet.get(epithetOf(k)) ?? [])].filter(
        (g) => g !== genusOf(k) && !(synonymGenera.get(genusOf(k)) ?? new Set()).has(g),
      );
      return others.length ? { p, others } : null;
    })
    .filter(Boolean);

  if (maybeSynonyms.length) {
    console.log(
      `\n  \x1b[1mPossibly the same plant under another genus\x1b[0m — ${maybeSynonyms.length}, not merged`,
    );
    for (const { p, others } of maybeSynonyms.slice(0, showMissing)) {
      console.log(`    ? ${p.latin.padEnd(34)} they also list ${others.join(", ")} + that epithet`);
    }
    console.log(
      "    Same epithet, different genus. Sometimes one plant renamed, sometimes two\n" +
        "      unrelated ones. Confirm, then add the pair to GENUS_SYNONYMS in this script.",
    );
  }

  console.log(
    `\n  \x1b[1mTheir picks we don't carry\x1b[0m — ${theirsMissing.length} of ${curated.size}, new genera first`,
  );
  for (const { k, p, newGenus } of theirsMissing.slice(0, showMissing)) {
    console.log(
      `    ${newGenus ? "+" : " "} ${p.latin.padEnd(34)} ${(p.common ?? "").padEnd(30)} ${p.group ?? ""}`,
    );
  }
  if (theirsMissing.length > showMissing) {
    console.log(`    … ${theirsMissing.length - showMissing} more`);
  }
  console.log("    + = a genus this region's list has never carried.");

  // The committed snapshot. Counts, the verdict on each of *our* rows, and the
  // genera we lack — not their species list. The species shortlist is printed
  // and not stored, the same call `npm run candidates` makes: a shortlist is
  // working output for a human, and storing theirs would edge back toward
  // mirroring the list the raw/ note exists to keep out of the repo.
  const missingGenera = [
    ...new Set(theirsMissing.filter((m) => m.newGenus).map((m) => genusOf(m.k))),
  ].sort();
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    `${OUT_DIR}${id}.json`,
    `${JSON.stringify(
      {
        source: doc.source,
        url: doc.url,
        note:
          "What a society's own list says about the rows we ship. Their plant data is BONAP-derived, so their list itself is not stored here — see this folder's README.",
        region: id,
        zips: doc.zips,
        harvested: doc.harvested,
        counts: {
          ours: ours.size,
          theirCuratedPicks: curated.size,
          theirCountyFlora: full.size,
          oursAmongTheirPicks: sharedCurated,
          theirPicksWeLack: theirsMissing.length,
          generaNewToUs: missingGenera.length,
        },
        // One line per plant we ship: did their curation pick it, and does
        // their flora list it as native here at all? The second is the useful
        // one — a `false` is a native claim of ours worth re-checking.
        ourRows: [...ours.entries()]
          .map(([k, p]) => ({
            latin: p.latin,
            common: p.common,
            amongTheirPicks: hasAny(new Set(curated.keys()), k),
            inTheirFlora: hasAny(full, k),
          }))
          .sort((a, b) => a.latin.localeCompare(b.latin)),
        // Genera their curation carries and this region never has. The thin
        // derivative that actually drives list growth.
        generaNewToUs: missingGenera,
      },
      null,
      2,
    )}\n`,
  );

  summary.push({
    id,
    name: region.meta.name,
    ours: ours.size,
    curated: curated.size,
    full: full.size,
    shared: sharedCurated,
    unknown: unknownToThem.length,
    genusUnknown: genusUnknown.length,
    missing: theirsMissing.length,
    newGenera: theirsMissing.filter((m) => m.newGenus).length,
  });
}

if (!anyPrinted) process.exit(0);

console.log(`\n\x1b[1mAcross the regions with a society list\x1b[0m`);
console.log(
  `  ${"region".padEnd(26)} ${"ours".padStart(5)} ${"picks".padStart(6)} ${"shared".padStart(7)} ${"we lack".padStart(8)} ${"new gen".padStart(8)} ${"unlisted".padStart(9)}`,
);
for (const s of summary) {
  console.log(
    `  ${s.name.slice(0, 26).padEnd(26)} ${String(s.ours).padStart(5)} ${String(s.curated).padStart(6)} ` +
      `${String(s.shared).padStart(7)} ${String(s.missing).padStart(8)} ${String(s.newGenera).padStart(8)} ${String(s.unknown).padStart(9)}`,
  );
}
console.log(
  "\n  shared   = ours that are also among their curated picks\n" +
    "  we lack  = their picks we don't carry · new gen = of those, genera new to us\n" +
    "  unlisted = ours missing from their county flora — the native-status check, not a gap\n",
);
