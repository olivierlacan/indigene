// `npm run wildlife:native -- --region ireland` — ask the fauna authorities
// whether every animal a region ties to its plants is native there. `--all`
// does every region; `--evidence` only rebuilds the table the animal pages read,
// offline, from the committed snapshots.
//
// The catalog's `native: true` has been a promise with one sentence behind it
// (`nativeBasis`), written once for the animal and shared by every region it
// appears in. So a butterfly tied to Irish plants was "native across Europe,
// including all of metropolitan France", and nobody had asked anyone about
// Ireland. This is the animal half of `native:check`: same snapshots, same exit
// code, same rule that a disagreement is recorded rather than smoothed.
//
// ## Who is asked
//
// `_fauna.mjs` says which authority speaks for each region and why. In short:
// NatureServe for US states and Canadian provinces, the UK Species Inventory
// (NBN Atlas) plus GBIF records for Ireland and Scotland, TAXREF for France,
// iNaturalist's checklist for New Zealand — and GRIIS, the global register of
// introductions, everywhere.
//
// ## Reading the answer
//
//   NATIVE       the regional authority says native, and GRIIS doesn't list it
//                as introduced at the same grain
//   INTRODUCED   the authority says introduced, or it says nothing and GRIIS
//                lists it → **the tie should not ship**
//   DISPUTED     the authority says native and GRIIS lists it as introduced
//                for the same country — two authorities, two answers
//   ABSENT       the authority doesn't record it here, or no GBIF record puts
//                it in the country
//   UNKNOWN      the authority has it with no status for here, or (NatureServe)
//                leaves the state off but GBIF has records of it there
//   NO-MATCH     no authority knows the name → check the spelling
//   (groups)     a group's verdict comes from its `members`: NATIVE when at
//                least one member is, INTRODUCED only when every member found
//                is; members that come back introduced are kept in the snapshot
//                and printed, not hidden
//
// Exit code: as `native:check` — fails on a NEW flag, a CHANGED verdict or a
// network error, not on a disagreement already on record.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";
import { openLoader } from "./_load-ts.mjs";
import { snapshotJson } from "./_snapshot-json.mjs";
import { FAUNA_AREA, askedNames, natureServe, nbn, taxref, inatPlace, griis, presence, TAXREF_VERSION } from "./_fauna.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "wildlife-native");
const EVIDENCE = join(REPO_ROOT, "app", "src", "data", "wildlife-evidence.json");

const args = process.argv.slice(2);
const regionArg = args.includes("--region") ? args[args.indexOf("--region") + 1] : null;
const all = args.includes("--all");
const evidenceOnly = args.includes("--evidence");
if (!evidenceOnly && !all && !regionArg) {
  console.error("usage: npm run wildlife:native -- --region <id>   (or --all, or --evidence)");
  console.error(`regions: ${Object.keys(FAUNA_AREA).join(", ")}`);
  process.exit(2);
}
if (regionArg && !FAUNA_AREA[regionArg]) {
  console.error(`${regionArg}: no fauna authority is configured for this region (see _fauna.mjs).`);
  process.exit(2);
}

/** Who answered, by name, for the snapshot and the page. */
function authoritiesFor(cfg) {
  return [
    cfg.natureserve && "NatureServe",
    cfg.nbn && "NBN Atlas (UK Species Inventory)",
    cfg.presence && "GBIF",
    cfg.taxref && `TAXREF v${TAXREF_VERSION}`,
    cfg.inat && "iNaturalist",
    "GRIIS",
  ].filter(Boolean);
}

/** One species, one region: every configured authority, combined. */
async function verdictFor(latin, cfg) {
  const said = {};
  let main;
  if (cfg.natureserve) main = said.natureserve = await natureServe(latin, cfg.natureserve);
  else if (cfg.nbn) main = said.nbn = await nbn(latin);
  else if (cfg.taxref) main = said.taxref = taxref(latin);
  else if (cfg.inat) main = said.inat = await inatPlace(latin, cfg.inat);
  said.griis = await griis(latin, cfg.griis);
  if (cfg.presence) said.presence = await presence(latin, cfg.presence);

  // NatureServe answers state by state, GRIIS for the whole country, so a
  // native state outranks a national listing: the eastern bumble bee is native
  // in Québec and introduced in British Columbia, and both are true. Where the
  // two speak for the same ground, they are two answers and the snapshot says so.
  const finer = Boolean(cfg.natureserve);
  let verdict;
  if (main.verdict === "introduced") verdict = "INTRODUCED";
  else if (main.verdict === "native") verdict = said.griis.listed && !finer ? "DISPUTED" : "NATIVE";
  else if (said.griis.listed) verdict = "INTRODUCED";
  else if (main.verdict === "absent") verdict = "ABSENT";
  else if (main.verdict === "no-match") verdict = "NO-MATCH";
  else verdict = "UNKNOWN";
  // Native to the UK is not found in Ireland. A species nobody has recorded in
  // the country is absent from it, whatever its status next door.
  if (verdict === "NATIVE" && said.presence && !said.presence.records) verdict = "ABSENT";
  return { verdict, said };
}

/** The ids of every animal a region ties to a plant, with its catalog row. */
async function loadCatalog() {
  const loader = await openLoader();
  const { WILDLIFE, SUPPORT } = await loader.load("/src/data/wildlife.ts");
  await loader.close();
  const byId = new Map(WILDLIFE.map((w) => [w.id, w]));
  const tied = {};
  for (const [region, plants] of Object.entries(SUPPORT)) {
    const ids = new Set();
    for (const links of Object.values(plants)) for (const l of links) ids.add(l.wildlifeId);
    tied[region] = [...ids].sort().map((id) => byId.get(id));
  }
  return tied;
}

async function checkRegion(regionId, animals) {
  const cfg = FAUNA_AREA[regionId];
  const outFile = join(OUT_DIR, `${regionId}.json`);
  const previous = new Map();
  if (existsSync(outFile)) for (const r of JSON.parse(readFileSync(outFile, "utf8")).rows ?? []) previous.set(r.id, r.verdict);

  console.log(`${regionId}: asking ${authoritiesFor(cfg).join(", ")} about ${animals.length} animals.`);
  console.log(`Area: ${cfg.area.en}\n`);

  const rows = [];
  const fresh = [];
  const changed = [];
  const errors = [];
  const recorded = [];
  for (const w of animals) {
    const names = askedNames(w);
    let row;
    try {
      if (!names.length) {
        row = { id: w.id, verdict: "UNCHECKABLE", asked: [] };
      } else if (w.members?.length) {
        const members = [];
        for (const name of names) members.push({ name, ...(await verdictFor(name, cfg)) });
        const v = members.map((m) => m.verdict);
        // A group is as native as its most native member. A member that is
        // introduced here says nothing about the others — the European small
        // skipper is no evidence about the American ones — so the group is
        // INTRODUCED only when every member that was found is.
        const found = v.filter((x) => x !== "ABSENT" && x !== "NO-MATCH");
        const verdict = v.includes("NATIVE")
          ? "NATIVE"
          : v.includes("UNKNOWN")
            ? "UNKNOWN"
            : v.includes("DISPUTED")
              ? "DISPUTED"
              : found.length && found.every((x) => x === "INTRODUCED")
                ? "INTRODUCED"
                : v.includes("ABSENT")
                  ? "ABSENT"
                  : "NO-MATCH";
        row = { id: w.id, verdict, group: true, members };
      } else {
        row = { id: w.id, asked: names[0], ...(await verdictFor(names[0], cfg)) };
      }
    } catch (e) {
      row = { id: w.id, verdict: `error ${e.message}` };
    }
    rows.push(row);

    const prev = previous.get(w.id);
    let mark;
    if (row.verdict.startsWith("error")) (mark = "ERR "), errors.push(row);
    else if (prev !== undefined && prev !== row.verdict) (mark = "CHG "), changed.push({ ...row, was: prev });
    else if (row.verdict === "NATIVE") mark = "ok  ";
    else if (prev === undefined) (mark = "NEW "), fresh.push(row);
    else (mark = "rec "), recorded.push(row);
    const flagged = row.members?.filter((m) => m.verdict === "INTRODUCED" || m.verdict === "DISPUTED") ?? [];
    const note = flagged.length ? `  (member ${flagged.map((m) => `${m.name}: ${m.verdict.toLowerCase()}`).join(", ")})` : "";
    console.log(`  ${mark}  ${row.verdict.padEnd(11)} ${w.id}${row.group ? " [group]" : ""}${note}`);
  }

  if (!errors.length) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(
      outFile,
      snapshotJson(
        { region: regionId, area: cfg.area.en, authorities: authoritiesFor(cfg), ranAt: new Date().toISOString(), rows },
        "rows",
      ),
    );
  }
  const list = (title, xs) => {
    if (!xs.length) return;
    console.log(`\n${title}`);
    for (const r of xs) console.log(`  ${(r.was ? `${r.was} → ` : "") + r.verdict}  ${r.id}`);
  };
  list("Already on record, unchanged:", recorded);
  list("NEW — not native by these authorities, not yet reviewed:", fresh);
  list("CHANGED since the committed snapshot:", changed);
  list("The service did not answer — snapshot NOT written:", errors);
  return { regionId, rows: rows.length, fresh, changed, errors, recorded };
}

/**
 * The table the animal page reads: per region, the place, who was asked, when,
 * and only the animals that did not come back native — same shape and same
 * reasoning as `native-evidence.json`.
 */
export function reduceEvidence() {
  const regions = {};
  for (const f of readdirSync(OUT_DIR).filter((f) => f.endsWith(".json")).sort()) {
    const snap = JSON.parse(readFileSync(join(OUT_DIR, f), "utf8"));
    const cfg = FAUNA_AREA[snap.region];
    if (!cfg) continue;
    const unconfirmed = {};
    for (const r of snap.rows) if (r.verdict !== "NATIVE") unconfirmed[r.id] = r.verdict.toLowerCase();
    regions[snap.region] = {
      area: cfg.area,
      coarse: Boolean(cfg.coarse),
      // The names a reader sees, without the versions and parentheticals.
      authorities: snap.authorities.map((a) => a.replace(/\s*\(.*\)$/, "").replace(/ v[\d.]+$/, "")),
      checked: snap.ranAt.slice(0, 10),
      animals: snap.rows.length,
      unconfirmed,
    };
  }
  writeFileSync(
    EVIDENCE,
    JSON.stringify(
      {
        note: "Only the animals that did not come back native are listed. Built by `npm run wildlife:native -- --evidence` from data/sources/wildlife-native/.",
        regions,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Wrote ${EVIDENCE}`);
}

if (evidenceOnly) {
  reduceEvidence();
  process.exit(0);
}

requireProxyAwareFetch("wildlife:native");
const tied = await loadCatalog();
const ids = all ? Object.keys(tied).filter((r) => FAUNA_AREA[r]) : [regionArg];
const results = [];
for (const id of ids) {
  results.push(await checkRegion(id, tied[id] ?? []));
  if (all) console.log("\n" + "─".repeat(72) + "\n");
}
if (all) {
  console.log("Summary:");
  for (const r of results) {
    const bits = [`${r.rows} animals`, r.recorded.length && `${r.recorded.length} on record`, r.fresh.length && `${r.fresh.length} NEW`, r.changed.length && `${r.changed.length} CHANGED`, r.errors.length && `${r.errors.length} errors`].filter(Boolean);
    console.log(`  ${r.regionId.padEnd(22)} ${bits.join(", ")}`);
  }
}
reduceEvidence();
process.exit(results.some((r) => r.fresh.length || r.changed.length || r.errors.length) ? 1 : 0);
