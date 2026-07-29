// Build European Lepidoptera host counts from the Gaytán et al. 2026 matrix.
//
// `hostLepCount` — how many butterfly and moth species raise their caterpillars
// on a plant — is the strongest signal in the ranking. The US regions take it
// from Tallamy / NWF. This script is the European equivalent: it reads the
// species-level interaction matrix, aggregates it to plant *genus* (the scale
// the US figures use, so the two stay comparable), and reports what each
// European region's rows should say.
//
//   node scripts/build-host-counts.mjs                     # write the lookup
//   node scripts/build-host-counts.mjs --region france-atlantic   # + a report
//
// Writes data/sources/eu-lep-plant-matrix/host-counts.json — committed, so
// every number that reaches the app shows up in a diff even though the 34 MB
// matrix it came from is git-ignored. The region files are NOT rewritten: each
// row's `basis` prose and `confidence` are editorial judgments, and those files
// exist to be auditable by a non-programmer. The report tells you what to change.
//
// `hostLepCount` stays the RAW count — `lib/plants.ts` log-normalizes it against
// the shared HOST_ANCHOR, so never pre-scale it here.
//
// An earlier draft of this script (written before the data was in hand) carried a
// GENUS_ALIASES map folding Frangula into Rhamnus and Mahonia into Berberis, on
// the guess that our names and the matrix's would disagree. Checked against the
// real file, they don't: the matrix keeps all four as distinct genera (Frangula
// 53 Lepidoptera over 1 member, Rhamnus 50 over 7), so aliasing would have merged
// unrelated counts. The concern behind it was sound, though — a genus we ship
// that the matrix files differently would be invisible — so instead of a guess
// list this script errors on any shipped plant whose genus it can't place. A loud
// failure beats a silent alias.
//
// See docs/host-counts-plan.md for the decisions behind the counting rule.
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";

const SRC = fileURLToPath(new URL("../../data/sources/eu-lep-plant-matrix/", import.meta.url));
const MATRIX = "Lepidoptera–Plant Associations in Europe.csv";
const ECOSYSTEMS = "Ecosystems.csv";
const TAXONOMY = "Taxonomy.xlsx";
const OUT = `${SRC}host-counts.json`;

// The matrix is a European dataset with European ecosystem zones; our regions
// are EEA biogeographical regions. This is the join between them.
const ZONE_FOR_EEA_REGION = {
  atlantic: "Oceanic temperate",
  continental: "Continental temperate",
  alpine: "Mountain",
  mediterranean: "Mediterranean",
};

const die = (msg) => {
  console.error(`\nbuild-host-counts: ${msg}\n`);
  process.exit(1);
};

function read(name) {
  try {
    return readFileSync(SRC + name);
  } catch {
    die(
      `missing source file "${name}".\n\n` +
        `  The raw dataset is git-ignored (it's 34 MB) and fetched by hand.\n` +
        `  Download instructions: data/sources/eu-lep-plant-matrix/README.md\n` +
        `  Expected in: ${SRC}`,
    );
  }
}

// ---------------------------------------------------------------- xlsx ----
// A .xlsx is a zip of XML. We need three columns of one sheet, so rather than
// take on a dependency we unzip with Node's own zlib and read the XML with
// regexes. Deliberately minimal: it understands exactly the files Excel and R
// write here, and throws rather than guessing on anything else.

/** Extract one file from a zip buffer by name, inflating if deflated. */
function unzip(buf, wanted) {
  // Walk the central directory (its entries hold the real compressed sizes;
  // local headers may defer them to a data descriptor).
  let end = buf.length - 22;
  while (end >= 0 && buf.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error("not a zip file (no end-of-central-directory record)");
  let pos = buf.readUInt32LE(end + 16);
  const count = buf.readUInt16LE(end + 10);

  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) throw new Error("corrupt zip central directory");
    const method = buf.readUInt16LE(pos + 10);
    const compressedSize = buf.readUInt32LE(pos + 20);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localPos = buf.readUInt32LE(pos + 42);
    const name = buf.toString("utf8", pos + 46, pos + 46 + nameLen);

    if (name === wanted) {
      // The local header repeats the name/extra with its own lengths.
      const lNameLen = buf.readUInt16LE(localPos + 26);
      const lExtraLen = buf.readUInt16LE(localPos + 28);
      const start = localPos + 30 + lNameLen + lExtraLen;
      const data = buf.subarray(start, start + compressedSize);
      if (method === 0) return data;
      if (method === 8) return inflateRawSync(data);
      throw new Error(`unsupported zip compression method ${method} for ${name}`);
    }
    pos += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error(`${wanted} not found in workbook`);
}

const unescapeXml = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, "&");

/** Column letters to a 0-based index: A→0, Z→25, AA→26. */
function colIndex(ref) {
  let n = 0;
  for (const ch of ref.replace(/\d+/g, "")) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

/** Read one worksheet as an array of row arrays of strings. */
function readSheet(zip, sheetPath) {
  // Shared strings: one <si> may hold several <t> runs; concatenate them.
  const sharedXml = unzip(zip, "xl/sharedStrings.xml").toString("utf8");
  const shared = [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    unescapeXml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("")),
  );

  const xml = unzip(zip, sheetPath).toString("utf8");
  return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
    const row = [];
    for (const c of rowMatch[1].matchAll(
      /<c r="([A-Z]+)\d+"[^>]*?(?: t="(\w+)")?[^>]*>(?:<v>([\s\S]*?)<\/v>|<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/is>)?<\/c>/g,
    )) {
      const [, ref, type, v, inline] = c;
      const value =
        inline !== undefined ? unescapeXml(inline)
        : v === undefined ? ""
        : type === "s" ? shared[+v]
        : unescapeXml(v);
      row[colIndex(ref)] = value;
    }
    // Fill holes left by skipped empty cells so column positions stay true.
    for (let i = 0; i < row.length; i++) if (row[i] === undefined) row[i] = "";
    return row;
  });
}

// ------------------------------------------------------------- reading ----

const matrixBuf = read(MATRIX);
const ecoBuf = read(ECOSYSTEMS);
const taxBuf = read(TAXONOMY);

// Taxonomy sheet 2 is the plants: SPECIES, GENUS, FAMILY, LINKS, ...
const taxRows = readSheet(taxBuf, "xl/worksheets/sheet2.xml");
const taxHeader = taxRows[0].map((h) => h.toUpperCase());
const [tSpecies, tGenus] = [taxHeader.indexOf("SPECIES"), taxHeader.indexOf("GENUS")];
if (tSpecies < 0 || tGenus < 0) die(`${TAXONOMY} sheet 2 has no SPECIES/GENUS columns`);
const genusOf = new Map();
for (const row of taxRows.slice(1)) {
  if (row[tSpecies]) genusOf.set(row[tSpecies].trim(), row[tGenus].trim());
}

// Ecosystems: SPECIES, then one column per zone, ending with Non-native.
const ecoLines = ecoBuf.toString("utf8").split(/\r?\n/).filter(Boolean);
const ecoHeader = ecoLines[0].split(";").map((s) => s.trim());
const NON_NATIVE = ecoHeader.indexOf("Non-native");
if (NON_NATIVE < 0) die(`${ECOSYSTEMS} has no "Non-native" column`);
const ZONES = ecoHeader.slice(1, NON_NATIVE);
const ecoOf = new Map();
for (const line of ecoLines.slice(1)) {
  const cells = line.split(";");
  ecoOf.set(cells[0].trim(), cells);
}

// Matrix: first column is the Lepidoptera species, the rest are plant species.
const matrixLines = matrixBuf.toString("utf8").split(/\r?\n/).filter(Boolean);
const plantCols = matrixLines[0].split(";").slice(1).map((s) => s.trim());
const lepCount = matrixLines.length - 1;

// The taxonomy is the authority on genus (a whitespace split mis-reads hybrid
// formulas like "x Pyraria irregularis"). If a refresh ever breaks that
// coverage, stop rather than silently fall back to guessing.
const untyped = plantCols.filter((p) => !genusOf.has(p));
if (untyped.length) {
  die(
    `${untyped.length} matrix plant column(s) are absent from ${TAXONOMY}, so their genus is unknown:\n` +
      untyped.slice(0, 10).map((p) => `    ${p}`).join("\n") +
      `\n  Genus must come from the taxonomy, not from splitting the name.`,
  );
}

// A plant with no ecosystem row counts as present in no zone: conservative,
// so it can only ever understate a count, never inflate one. Recorded below
// rather than silently dropped.
const missingEcosystem = plantCols.filter((p) => !ecoOf.has(p));

// ------------------------------------------------------------ counting ----
// For a genus G and zone Z: the number of distinct Lepidoptera recorded on ANY
// plant of genus G that grows in Z and is native to Europe. We also keep the
// zone-only count (non-natives included) and the all-Europe total, so the
// effect of each filter stays visible instead of baked in.

const genera = [...new Set(plantCols.map((p) => genusOf.get(p)))].sort();
const genusIdx = new Map(genera.map((g, i) => [g, i]));
const zeros = () => new Uint32Array(genera.length * ZONES.length);
const [native, zoneOnly] = [zeros(), zeros()];
const [membersNative, membersZoneOnly] = [zeros(), zeros()];
const europe = new Uint32Array(genera.length);

// Per column: which genus it belongs to, and a bitmask of the zones it counts
// for under each filter. Masks make the inner loop a couple of OR operations.
const colGenus = new Int32Array(plantCols.length);
const colNativeMask = new Uint16Array(plantCols.length);
const colZoneMask = new Uint16Array(plantCols.length);
plantCols.forEach((plant, i) => {
  const g = genusIdx.get(genusOf.get(plant));
  colGenus[i] = g;
  const eco = ecoOf.get(plant);
  if (!eco) return;
  const isNonNative = eco[NON_NATIVE] === "1";
  ZONES.forEach((_, z) => {
    if (eco[z + 1] !== "1") return;
    colZoneMask[i] |= 1 << z;
    membersZoneOnly[g * ZONES.length + z]++;
    if (!isNonNative) {
      colNativeMask[i] |= 1 << z;
      membersNative[g * ZONES.length + z]++;
    }
  });
});

// One pass over the matrix. Per row we accumulate, per genus, the union of
// zones this Lepidopteran counts for — then fold that into the totals, which
// is what makes the count "distinct Lepidoptera" rather than "records".
const rowNative = new Uint16Array(genera.length);
const rowZone = new Uint16Array(genera.length);
const rowEurope = new Uint8Array(genera.length);
for (let r = 1; r < matrixLines.length; r++) {
  const cells = matrixLines[r].split(";");
  const touched = [];
  for (let i = 0; i < plantCols.length; i++) {
    if (cells[i + 1] !== "1") continue;
    const g = colGenus[i];
    if (!rowEurope[g]) {
      rowEurope[g] = 1;
      touched.push(g);
    }
    rowNative[g] |= colNativeMask[i];
    rowZone[g] |= colZoneMask[i];
  }
  for (const g of touched) {
    europe[g]++;
    for (let z = 0; z < ZONES.length; z++) {
      if (rowNative[g] & (1 << z)) native[g * ZONES.length + z]++;
      if (rowZone[g] & (1 << z)) zoneOnly[g * ZONES.length + z]++;
    }
    rowNative[g] = rowZone[g] = rowEurope[g] = 0;
  }
}

// -------------------------------------------------------------- output ----

const fingerprint = (name) => {
  const { size } = statSync(SRC + name);
  return { file: name, bytes: size };
};

const out = {
  $comment:
    "Generated by app/scripts/build-host-counts.mjs from the git-ignored Gaytán matrix. " +
    "Committed so every host count that reaches the app is reviewable in a diff without " +
    "the 34 MB source. There is deliberately no generated-at timestamp: re-running on " +
    "unchanged inputs should produce an identical file, so a diff always means the data moved.",
  source: {
    title: "European Lepidoptera–Plant Associations: A Species-Level Interaction Matrix",
    authors: "Gaytán et al. 2026",
    journal: "Ecology & Evolution",
    doi: "10.1002/ece3.73004",
    license: "CC-BY 4.0",
    association: "larval host (herbivory), not adult nectar — per the dataset's own README",
    files: [MATRIX, ECOSYSTEMS, TAXONOMY].map(fingerprint),
    lepidopteraSpecies: lepCount,
    plantSpecies: plantCols.length,
  },
  method: {
    count:
      "distinct Lepidoptera species recorded on any plant of the genus — aggregated to genus " +
      "because the US regions carry genus-level Tallamy figures, so the two stay on one scale",
    native:
      "the shipped figure: members present in the zone AND not flagged Non-native, so a native " +
      "plant is not credited with caterpillars recorded only on introduced ornamental relatives",
    zoneOnly:
      "the same count with non-native members left in. Present only where it differs from " +
      "`count` — so a zone carrying this key is one where the native filter changed the answer",
    europe: "every European member of the genus, unfiltered",
    genusSource: `the GENUS column of ${TAXONOMY}, not a split of the binomial`,
    plantsWithNoEcosystemRow:
      "counted as present in no zone — conservative, can only understate a count",
    zoneForEeaRegion: ZONE_FOR_EEA_REGION,
  },
  zones: ZONES,
  plantsMissingFromEcosystems: missingEcosystem,
  genera: {},
};

for (const [g, gi] of genusIdx) {
  const entry = { europe: europe[gi], zones: {} };
  ZONES.forEach((zone, z) => {
    const k = gi * ZONES.length + z;
    if (!membersZoneOnly[k]) return; // genus absent from this zone entirely
    // The zone-only figures appear only where they differ from the shipped
    // ones — so a `zoneOnly` key is exactly the signal that dropping
    // non-native relatives changed the answer, and it's worth a look.
    entry.zones[zone] = { count: native[k], members: membersNative[k] };
    if (zoneOnly[k] !== native[k]) entry.zones[zone].zoneOnly = zoneOnly[k];
    if (membersZoneOnly[k] !== membersNative[k]) {
      entry.zones[zone].membersZoneOnly = membersZoneOnly[k];
    }
  });
  out.genera[g] = entry;
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(
  `host-counts.json: ${genera.length} genera × ${ZONES.length} zones ` +
    `from ${lepCount} Lepidoptera × ${plantCols.length} plants` +
    (missingEcosystem.length ? ` (${missingEcosystem.length} plants have no ecosystem row)` : ""),
);

// -------------------------------------------------------------- report ----

const regionArg = process.argv.indexOf("--region");
if (regionArg < 0) process.exit(0);
const regionId = process.argv[regionArg + 1];
if (!regionId) die("--region needs a region id, e.g. --region france-atlantic");

const loader = await openLoader();
const mod = await loader.load(`/src/data/plants.${regionId}.ts`);
await loader.close();

const codes = mod.REGION.ecoregion?.codes ?? [];
const zone = codes.map((c) => ZONE_FOR_EEA_REGION[c]).find(Boolean);
if (!zone) {
  die(
    `region "${regionId}" declares no EEA biogeographical region we can map to a zone ` +
      `(codes: ${codes.join(", ") || "none"}).\n  Known: ${Object.keys(ZONE_FOR_EEA_REGION).join(", ")}`,
  );
}

console.log(`\n${mod.REGION.name} — ${zone}\n`);
const rows = [];
for (const plant of mod.SEED_RAW) {
  const g = genusOf.get(plant.latin) ?? plant.latin.split(/\s+/)[0];
  const gi = genusIdx.get(g);
  const k = gi === undefined ? -1 : gi * ZONES.length + ZONES.indexOf(zone);
  // A genus with no member in this zone would score 0 and sink the plant. For
  // something we actually ship that means the zone mapping or the name is
  // wrong, so stop rather than publish a silent zero.
  if (k < 0 || !membersNative[k]) {
    die(
      `"${plant.latin}" (genus ${g}) has no native member in "${zone}".\n` +
        `  A shipped plant must not take a silent 0 — check the name against the matrix\n` +
        `  or the zone mapping for region "${regionId}".`,
    );
  }
  rows.push({
    latin: plant.latin,
    now: plant.hostLepCount,
    next: native[k],
    zoneOnly: zoneOnly[k],
    members: membersNative[k],
  });
}

const w = Math.max(...rows.map((r) => r.latin.length));
console.log(`${"plant".padEnd(w)}   now   next   zone-only  members`);
for (const r of rows) {
  const arrow = r.next > r.now ? "↑" : r.next < r.now ? "↓" : "=";
  const differs = r.zoneOnly === r.next ? "" : "  <- filters disagree";
  console.log(
    `${r.latin.padEnd(w)} ${String(r.now).padStart(5)} ${String(r.next).padStart(6)} ${arrow}` +
      `${String(r.zoneOnly).padStart(10)} ${String(r.members).padStart(8)}${differs}`,
  );
}
const moved = rows.filter((r) => r.next !== r.now).length;
console.log(`\n${moved} of ${rows.length} rows would change. Nothing was written to the region file.`);
