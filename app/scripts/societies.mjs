// `npm run societies` — hold each region's list up against native plant
// societies' own lists for the same ground, and print where they disagree.
//
// ## Why this is a different question from `npm run coverage`
//
// `coverage` and `candidates` measure us against *occurrence data* — what GBIF
// records growing inside a region's box. That answers "does it grow here",
// which has no opinion about whether anyone should plant it.
//
// These measure us against lists somebody curated for gardeners, which makes
// two comparisons possible that occurrence data cannot support:
//
//   1. **Do they list something we don't?** A real gap, and a ranked one: a
//      plant bringing a genus our region has never carried is worth more than a
//      fourth aster.
//   2. **Do we list something they've never heard of?** Against a source with a
//      flora tier, a plant of ours missing from it is a native claim worth
//      re-checking, or a name our normaliser got wrong.
//
// ## Two sources, because one wasn't enough
//
//   - **Audubon — Plants for Birds.** ZIP-scoped, so it lands close to our
//     regions, and it has a **flora tier**, which is what makes the
//     native-status check possible at all. But its western coverage is thin
//     enough to be useless there: its flora for Portland has no Douglas-fir.
//   - **Lady Bird Johnson Wildflower Center — Recommended Species.** Covers the
//     West properly and already splits California and Florida. But it is
//     **state-scoped** (wider than any region we ship) and has **no flora
//     tier**, so absence means "not recommended", never "not native".
//
// Neither is authoritative and the report never averages them. Each block says
// which source it came from and what that source can and cannot be evidence of.
//
// ## The trap this script exists to avoid
//
// A source's tiers are not the same kind of list and are never pooled:
// Audubon's curated picks are dozens, its county flora is hundreds, including
// apomictic microspecies nobody sells. Diffing our 44 rows against a
// 652-species flora would print a "gap" of 600 that means nothing.
//
// ## Usage
//
//   npm run societies                        every region, every source
//   npm run societies -- --region pnw        one region
//   npm run societies -- --source wildflower-center
//   npm run societies -- --missing 25        how many of their picks to name
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { openLoader } from "./_load-ts.mjs";
import { withSeeds } from "./_regions.mjs";

const SOURCES = [
  {
    dir: "audubon-plants-for-birds",
    label: "Audubon — Plants for Birds",
    scope: "ZIP-scoped; has a flora tier",
    floraTier: true,
  },
  {
    dir: "wildflower-center",
    label: "Wildflower Center — Recommended Species",
    scope: "state-scoped, wider than the region; no flora tier",
    floraTier: false,
  },
];

const dataDir = (dir) => fileURLToPath(new URL(`../../data/sources/${dir}/`, import.meta.url));

const args = process.argv.slice(2);
const only = flag("--region");
const onlySource = flag("--source");
const showMissing = Number(flag("--missing") ?? 20);

function flag(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

/**
 * A botanical name reduced to the thing two lists can actually be compared on.
 *
 * Authors, ranks and hybrid markers are noise here. We compare genus + specific
 * epithet, lowercased, and nothing else — deliberately coarse, because a false
 * *difference* between the lists is the expensive kind of error.
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
const epithetOf = (k) => (k ? (k.split(" ")[1] ?? null) : null);

/**
 * Genus pairs that are the same plant under a different name.
 *
 * Two lists written a decade apart disagree about generic limits, and the
 * disagreement lands on the plants a region is *about*. We write `Berberis
 * aquifolium`, Audubon writes `Mahonia aquifolium`; untreated, Oregon grape is
 * scored twice — once as a gap in our list and once as a native claim to go and
 * re-check. Both wrong, about the most recognisable shrub west of the Cascades.
 *
 * Anything not in here that looks like the same case is reported for a human by
 * the epithet check below, never merged: `Cornus canadensis` and `Sanguisorba
 * canadensis` share an epithet and are not the same plant.
 */
const GENUS_SYNONYMS = [
  ["berberis", "mahonia"], // Oregon grape: sunk into Berberis, still sold as Mahonia
  ["aster", "symphyotrichum"], // the New World asters, split out in the 1990s
  ["aster", "eurybia"],
  ["chamerion", "chamaenerion"], // fireweed, two spellings of one segregate
  ["chamerion", "epilobium"], // …and its older home
  ["chamaenerion", "epilobium"],
  ["vaccinium", "oxycoccus"], // cranberries
  ["dichanthelium", "panicum"], // rosette grasses
  ["hesperocyparis", "cupressus"], // the New World cypresses
  ["neltuma", "prosopis"], // mesquites, split 2024
  ["diplacus", "mimulus"], // the shrubby monkeyflowers, split out 2012
  ["stipa", "nassella"], // needlegrasses
  ["struthiopteris", "blechnum"], // deer fern
];

/**
 * Whole-name pairs, for when the epithet moved too.
 *
 * The genus table above swaps the genus and keeps the epithet, which covers
 * most renames. It does not cover a plant that changed both — deerweed went
 * from `Lotus scoparius` to `Acmispon glaber`, and no amount of genus
 * substitution gets you from one to the other.
 */
const SPECIES_SYNONYMS = [
  ["acmispon glaber", "lotus scoparius"], // deerweed
];

const speciesSynonyms = new Map();
for (const [a, b] of SPECIES_SYNONYMS) {
  if (!speciesSynonyms.has(a)) speciesSynonyms.set(a, new Set([a]));
  if (!speciesSynonyms.has(b)) speciesSynonyms.set(b, new Set([b]));
  speciesSynonyms.get(a).add(b);
  speciesSynonyms.get(b).add(a);
}

const synonymGenera = new Map();
for (const [a, b] of GENUS_SYNONYMS) {
  if (!synonymGenera.has(a)) synonymGenera.set(a, new Set([a]));
  if (!synonymGenera.has(b)) synonymGenera.set(b, new Set([b]));
  synonymGenera.get(a).add(b);
  synonymGenera.get(b).add(a);
}

const generaFor = (g) => synonymGenera.get(g) ?? new Set([g]);
const keysFor = (k) => {
  const e = epithetOf(k);
  const named = [...(speciesSynonyms.get(k) ?? [k])];
  if (!e) return named;
  const out = new Set(named);
  for (const n of named) {
    const ne = epithetOf(n);
    for (const g of generaFor(genusOf(n))) out.add(`${g} ${ne}`);
  }
  return [...out];
};
const hasAny = (set, k) => keysFor(k).some((x) => set.has(x));

const loader = await openLoader();
const { REGIONS: RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(RAW);
await loader.close();

const sources = SOURCES.filter((s) => !onlySource || s.dir === onlySource);
const regions = REGIONS.filter((r) => !only || r.meta.id === only);
const pct = (a, b) => (b === 0 ? "—" : `${Math.round((a / b) * 100)}%`);
const summary = [];
let printedAnything = false;

for (const region of regions) {
  const id = region.meta.id;

  const ours = new Map();
  for (const p of region.seed) {
    const k = key(p.latin);
    if (k) ours.set(k, p);
  }
  const ourGenera = new Set([...ours.keys()].map(genusOf));
  const ourKeys = new Set(ours.keys());

  const available = sources.filter((s) => existsSync(`${dataDir(s.dir)}raw/${id}.json`));
  if (available.length === 0) continue;
  printedAnything = true;

  console.log(`\n\x1b[1m${region.meta.name}\x1b[0m  (${id}) — we ship ${ours.size}`);

  // Tracked across sources so the combined verdict can be stricter than any
  // one of them: a plant no consulted list carries is the one worth a look.
  const vouchedSomewhere = new Set();

  for (const src of available) {
    const doc = JSON.parse(readFileSync(`${dataDir(src.dir)}raw/${id}.json`, "utf8"));
    const curated = new Map();
    for (const p of doc.curated) {
      const k = key(p.latin);
      if (k) curated.set(k, p);
    }
    const curatedKeys = new Set(curated.keys());
    const full = new Set((doc.full ?? []).map((p) => key(p.latin)).filter(Boolean));
    const fullGenera = new Set([...full].map(genusOf));

    // What this source can vouch for: its flora if it has one, else its picks.
    const vouches = src.floraTier ? full : curatedKeys;
    for (const k of ours.keys()) if (hasAny(vouches, k)) vouchedSomewhere.add(k);

    const absent = [...ours.entries()].filter(([k]) => !hasAny(vouches, k));
    const genusAbsent = absent.filter(
      ([k]) => ![...generaFor(genusOf(k))].some((g) => (src.floraTier ? fullGenera : new Set([...curatedKeys].map(genusOf))).has(g)),
    );
    const theirsMissing = [...curated.entries()]
      .filter(([k]) => !hasAny(ourKeys, k))
      .map(([k, p]) => ({ k, p, newGenus: !ourGenera.has(genusOf(k)) }))
      // New genera first, then alphabetical. Deliberately not by bird count:
      // Audubon's cards cap that list at five, so every plant reports five.
      .sort((a, b) => Number(b.newGenus) - Number(a.newGenus) || a.k.localeCompare(b.k));
    const shared = [...ours.keys()].filter((k) => hasAny(curatedKeys, k)).length;
    const curatedGenera = new Set([...curatedKeys].map(genusOf));
    const generaShared = [...curatedGenera].filter((g) => ourGenera.has(g)).length;
    const missingGenera = [
      ...new Set(theirsMissing.filter((m) => m.newGenus).map((m) => genusOf(m.k))),
    ].sort();

    console.log(`\n  \x1b[1m${src.label}\x1b[0m — ${src.scope}`);
    console.log(
      `    ${doc.collections?.join(", ") ?? doc.zips?.join(", ") ?? ""}, harvested ${doc.harvested}`,
    );
    console.log(
      `    their picks ${curated.size}${src.floraTier ? ` · their flora ${full.size}` : ""} · ` +
        `ours among their picks ${shared} (${pct(shared, ours.size)}) · genera ${generaShared}/${curatedGenera.size}`,
    );

    // A flora that cannot place a quarter of the plants a region ships is not
    // describing the same ground we are, and must not be read as a verdict on
    // our native claims. Audubon's western coverage fails exactly here — its
    // Portland flora has no Douglas-fir — so the check says so rather than
    // reporting 38 native-status findings that are really one coverage problem.
    const floraUnfit = src.floraTier && absent.length > ours.size * 0.25;

    const absentLabel = src.floraTier
      ? "Ours their flora doesn't list"
      : "Ours they don't recommend";
    console.log(
      `\n    \x1b[1m${absentLabel}\x1b[0m — ${absent.length} of ${ours.size}` +
        (genusAbsent.length ? `, ${genusAbsent.length} where even the genus is absent` : ""),
    );
    if (absent.length === 0) console.log("      none.");
    for (const [k, p] of absent.slice(0, showMissing)) {
      console.log(`      ${genusAbsent.some(([gk]) => gk === k) ? "!" : " "} ${p.latin.padEnd(32)} ${p.common ?? ""}`);
    }
    if (absent.length > showMissing) console.log(`      … ${absent.length - showMissing} more`);
    if (!src.floraTier && absent.length) {
      console.log("      Not a native-status finding — this source has no flora tier.");
    }
    if (floraUnfit) {
      console.log(
        `      \x1b[1mNot usable as a native-status check here.\x1b[0m ${absent.length} of our ${ours.size}\n` +
          "      is too many: the shortfall is this source's coverage of the region, not\n" +
          "      our claims. Treat the gap column as the only figure this block supports.",
      );
    }

    console.log(
      `\n    \x1b[1mTheir picks we don't carry\x1b[0m — ${theirsMissing.length} of ${curated.size}, new genera first`,
    );
    for (const { p, newGenus } of theirsMissing.slice(0, showMissing)) {
      console.log(`      ${newGenus ? "+" : " "} ${p.latin.padEnd(32)} ${p.common ?? ""}`);
    }
    if (theirsMissing.length > showMissing) {
      console.log(`      … ${theirsMissing.length - showMissing} more`);
    }

    // The committed snapshot: counts, the verdict on *our* rows, and the genera
    // we lack. Not their species list — that is printed and not stored, the
    // same call `candidates.mjs` makes, and for Audubon it is BONAP-derived
    // besides (see that folder's README).
    mkdirSync(dataDir(src.dir), { recursive: true });
    writeFileSync(
      `${dataDir(src.dir)}${id}.json`,
      `${JSON.stringify(
        {
          source: doc.source,
          url: doc.url,
          note: doc.note,
          hasFloraTier: Boolean(src.floraTier),
          region: id,
          scope: doc.collections ?? doc.zips,
          harvested: doc.harvested,
          counts: {
            ours: ours.size,
            theirPicks: curated.size,
            theirFlora: src.floraTier ? full.size : null,
            oursAmongTheirPicks: shared,
            theirPicksWeLack: theirsMissing.length,
            generaNewToUs: missingGenera.length,
          },
          ourRows: [...ours.entries()]
            .map(([k, p]) => ({
              latin: p.latin,
              common: p.common,
              amongTheirPicks: hasAny(curatedKeys, k),
              ...(src.floraTier ? { inTheirFlora: hasAny(full, k) } : {}),
            }))
            .sort((a, b) => a.latin.localeCompare(b.latin)),
          generaNewToUs: missingGenera,
        },
        null,
        2,
      )}\n`,
    );

    summary.push({
      region: region.meta.name,
      source: src.label,
      ours: ours.size,
      picks: curated.size,
      shared,
      lack: theirsMissing.length,
      newGenera: missingGenera.length,
      absent: absent.length,
    });
  }

  if (available.length > 1) {
    const nowhere = [...ours.entries()].filter(([k]) => !vouchedSomewhere.has(k));
    console.log(
      `\n  \x1b[1mVouched by no source consulted\x1b[0m — ${nowhere.length} of ${ours.size}`,
    );
    if (nowhere.length === 0) {
      console.log("    none — every row we ship appears on at least one society's list for this ground.");
    }
    for (const [, p] of nowhere.slice(0, showMissing)) {
      console.log(`    ? ${p.latin.padEnd(32)} ${p.common ?? ""}`);
    }
    if (nowhere.length > showMissing) console.log(`    … ${nowhere.length - showMissing} more`);
    console.log(
      "    Worth a human only where a source's flora covers the region properly —\n" +
        "    see any 'not usable as a native-status check' note above.",
    );
  }
}

if (!printedAnything) {
  console.error("\nsocieties: nothing harvested yet. Run `npm run harvest:audubon` and `npm run harvest:wildflower`.\n");
  process.exit(1);
}

console.log(`\n\x1b[1mSummary\x1b[0m`);
console.log(
  `  ${"region".padEnd(24)} ${"source".padEnd(20)} ${"ours".padStart(5)} ${"picks".padStart(6)} ${"shared".padStart(7)} ${"we lack".padStart(8)} ${"new gen".padStart(8)} ${"absent".padStart(7)}`,
);
for (const s of summary) {
  console.log(
    `  ${s.region.slice(0, 24).padEnd(24)} ${s.source.split("—")[0].trim().slice(0, 20).padEnd(20)} ` +
      `${String(s.ours).padStart(5)} ${String(s.picks).padStart(6)} ${String(s.shared).padStart(7)} ` +
      `${String(s.lack).padStart(8)} ${String(s.newGenera).padStart(8)} ${String(s.absent).padStart(7)}`,
  );
}
console.log(
  "\n  shared  = ours that are also among their curated picks\n" +
    "  we lack = their picks we don't carry · new gen = of those, genera new to us\n" +
    "  absent  = ours missing from what that source can vouch for — a flora for\n" +
    "            Audubon (a native-status check), only a recommendation list for\n" +
    "            the Wildflower Center (not a native-status check)\n",
);
