// `npm run prose:check` — is every translated paragraph the app can ask for
// actually there, and does any of it collide?
//
// The catalog's prose overlay (`locales/prose.<lang>/`) is deliberately partial:
// `lib/prose.ts` falls back to the authored English for anything missing, and the
// page says so. That is what makes it safe to fill in over time. But it also
// means a gap is *silent by design* — nothing fails, a French reader just gets an
// English paragraph. This script is how you see the gaps on purpose.
//
// It reports three things, and only the third is an error by default:
//
//   1. Coverage — how much of each region, the animals and the impostors exist
//      in the language, counted the way the app looks them up: per *region row*,
//      preferring the region-qualified key (`"Latin@region"`), because a taxon on
//      two lists has two rows and two translations.
//   2. Gaps — every field the app would fall back to English on, named.
//   3. Collisions — two part files claiming one key, where the plain spread in
//      `index.ts` makes one silently win. That is never intentional and always a
//      bug, so it exits non-zero.
//
// A taxon that is a native plant *and* an impostor elsewhere (Douglas-fir, holly,
// common ivy) legitimately holds both kinds of writing under one key — that is
// one entry, not a collision, and this script knows the difference.
//
// Usage:
//   npm run prose:check                    coverage + gaps, exit 0 unless a collision
//   npm run prose:check -- --lang fr       one language (default: all with a table)
//   npm run prose:check -- --strict        exit non-zero on any gap too
//   npm run prose:check -- --quiet         totals only, no per-field list
import { openLoader } from "./_load-ts.mjs";
import { withSeeds } from "./_regions.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const { load, close } = await openLoader();
try {
  const { REGIONS: REGIONS_RAW } = await load("/src/data/regions.ts");
  const REGIONS = await withSeeds(REGIONS_RAW);
  const { WILDLIFE, SUPPORT } = await load("/src/data/wildlife.ts");
  const { LOOKALIKES, CONFUSIONS } = await load("/src/data/lookalikes.ts");

  // The part files each locale is assembled from, so a collision can name the
  // two files that disagree rather than just the key.
  const PARTS = {
    fr: [
      ["alternatives", "ALTERNATIVES_FR"],
      ["florida", "FLORIDA"],
      ["france-alpine", "FRANCE_ALPINE"],
      ["france-atlantic", "FRANCE_ATLANTIC"],
      ["france-continental", "FRANCE_CONTINENTAL"],
      ["france-mediterranean", "FRANCE_MEDITERRANEAN"],
      ["lookalikes", "LOOKALIKES_FR"],
      ["mid-atlantic", "MID_ATLANTIC"],
      ["pnw", "PNW"],
      ["wildlife", "WILDLIFE_FR"],
    ],
  };

  const langs = opt("lang") ? [opt("lang")] : Object.keys(PARTS);
  let failed = false;

  for (const lang of langs) {
    const parts = PARTS[lang];
    if (!parts) {
      console.error(`No part list for "${lang}" — add it to scripts/check-prose.mjs.`);
      failed = true;
      continue;
    }
    console.log(`\n=== ${lang} ===`);

    // ---- 3. Collisions, first: they change what everything else means. ----
    const owner = new Map(); // key -> file that claimed it
    const collisions = [];
    for (const [file, exportName] of parts) {
      const mod = await load(`/src/locales/prose.${lang}/${file}.ts`);
      const table = mod[exportName];
      if (!table) {
        console.error(`  ${file}.ts does not export ${exportName}`);
        failed = true;
        continue;
      }
      for (const key of Object.keys(table)) {
        if (owner.has(key)) collisions.push({ key, first: owner.get(key), second: file });
        else owner.set(key, file);
      }
    }
    if (collisions.length) {
      console.log(`\n  ❌ ${collisions.length} key collision(s) — one entry silently overwrites the other:`);
      for (const c of collisions) console.log(`     "${c.key}" in both ${c.first}.ts and ${c.second}.ts`);
      failed = true;
    }

    const { PROSE_FR } = await load(`/src/locales/prose.${lang}/index.ts`);
    const table = PROSE_FR;
    // The app's own lookup: region-qualified key wins, plain key is the fallback.
    const pick = (latin, regionId) => table[`${latin}@${regionId}`] ?? table[latin];

    const gaps = [];
    let want = 0;
    const need = (present, what) => {
      want++;
      if (!present) gaps.push(what);
    };

    // ---- 1 & 2. Plant prose, per region row. ----
    const perRegion = [];
    for (const r of REGIONS) {
      const rid = r.meta.id;
      const before = gaps.length;
      const wantBefore = want;
      for (const p of r.seed) {
        const e = pick(p.latin, rid);
        for (const f of ["nativeNote", "careNote", "givesNote"]) {
          need(e?.[f] !== undefined, `${rid}/${p.latin}.${f}`);
        }
        if (p.propagation?.note) {
          need(e?.propagationNote !== undefined, `${rid}/${p.latin}.propagationNote`);
        }
        for (const l of SUPPORT[rid]?.[p.id] ?? []) {
          need(e?.supportNotes?.[l.wildlifeId] !== undefined, `${rid}/${p.latin} support:${l.wildlifeId}`);
        }
        for (const l of CONFUSIONS[rid]?.[p.id] ?? []) {
          const tie = e?.lookalikeNotes?.[l.lookalikeId];
          need(tie?.why !== undefined, `${rid}/${p.latin} lookalike-why:${l.lookalikeId}`);
          // All the tells or none: a half-translated table is worse to read
          // than plain English, which is why `lookalikeTells()` rejects one.
          need(tie?.tells?.length === l.tells.length, `${rid}/${p.latin} lookalike-tells:${l.lookalikeId}`);
        }
      }
      perRegion.push({
        region: rid,
        rows: r.seed.length,
        fields: want - wantBefore,
        missing: gaps.length - before,
      });
    }

    // ---- The animals and the impostors. ----
    const wlBefore = gaps.length;
    for (const w of WILDLIFE) {
      need(table[w.latin ?? `#${w.id}`]?.blurb !== undefined, `wildlife ${w.latin ?? `#${w.id}`}.blurb`);
    }
    const laBefore = gaps.length;
    for (const l of LOOKALIKES) {
      need(table[l.latin]?.blurb !== undefined, `lookalike ${l.latin}.blurb`);
      need(table[l.latin]?.origin !== undefined, `lookalike ${l.latin}.origin`);
    }

    const pct = (n, total) => (total === 0 ? "100%" : `${Math.round(((total - n) / total) * 100)}%`);
    console.log("\n  Coverage, counted per region row:");
    for (const row of perRegion) {
      console.log(
        `    ${row.region.padEnd(22)} ${String(row.rows).padStart(3)} rows  ` +
          `${String(row.fields - row.missing).padStart(4)}/${String(row.fields).padEnd(4)} fields  ${pct(row.missing, row.fields)}`
      );
    }
    console.log(`    ${"animals".padEnd(22)} ${String(WILDLIFE.length).padStart(3)} rows  ` +
      `${String(WILDLIFE.length - (laBefore - wlBefore)).padStart(4)}/${String(WILDLIFE.length).padEnd(4)} fields  ${pct(laBefore - wlBefore, WILDLIFE.length)}`);
    console.log(`    ${"impostors".padEnd(22)} ${String(LOOKALIKES.length).padStart(3)} rows  ` +
      `${String(LOOKALIKES.length * 2 - (gaps.length - laBefore)).padStart(4)}/${String(LOOKALIKES.length * 2).padEnd(4)} fields  ${pct(gaps.length - laBefore, LOOKALIKES.length * 2)}`);

    if (gaps.length === 0) {
      console.log(`\n  ✅ complete: all ${want} fields the app can ask for are translated`);
    } else {
      console.log(`\n  ${want - gaps.length}/${want} fields translated — ${gaps.length} still show English:`);
      if (!flag("quiet")) for (const g of gaps) console.log(`     ${g}`);
      if (flag("strict")) failed = true;
    }
  }

  if (failed) {
    console.log("\nFailed. A collision is always a bug; a gap is one only under --strict.");
    process.exitCode = 1;
  }
} finally {
  await close();
}
