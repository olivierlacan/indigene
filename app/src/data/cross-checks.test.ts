// A region in `SECOND_CHECKS` says its plants have been put to a second
// checklist. These hold it to that: each claimed region has a committed check
// that covers every plant it ships, and a region with no way to show it fails.
//
// Florida's check also pins what the Atlas disagrees about, so a new
// disagreement — a plant added that the Atlas doesn't call native — fails here
// instead of waiting for someone to run `npm run atlas`.
import { describe, it, expect } from "vitest";
import { REGIONS } from "./regions";
import { SECOND_CHECKS } from "./cross-checks";
import PNW from "../../../data/sources/pnw-flora/pnw.json";
import BSBI from "../../../data/sources/bsbi-plant-atlas/scotland-lowlands.json";
import MI_FLORAS from "../../../data/sources/regional-floras/north-michigan.json";
import CHICAGO_FLORAS from "../../../data/sources/regional-floras/chicago.json";
import MIDATL_FLORAS from "../../../data/sources/regional-floras/mid-atlantic.json";
import IRELAND_FLORAS from "../../../data/sources/regional-floras/ireland.json";
import AUCKLAND_FLORAS from "../../../data/sources/regional-floras/nz-auckland.json";
import ATLANTIC_FLORAS from "../../../data/sources/regional-floras/france-atlantic.json";
import CONTINENTAL_FLORAS from "../../../data/sources/regional-floras/france-continental.json";
import ALPINE_FLORAS from "../../../data/sources/regional-floras/france-alpine.json";
import ATLAS_CENTRAL from "../../../data/sources/atlas-florida/florida-central.csv?raw";
import ATLAS_SOUTH from "../../../data/sources/atlas-florida/florida-south.csv?raw";
import VASCAN_CHECK from "../../scripts/check-vascan.mjs?raw";
import NATIVE_WORKFLOW from "../../../.github/workflows/native.yml?raw";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { atlasVerdict, indexAtlas, parseCsv } from "../../scripts/_atlas.mjs";

const shippedIds = async (id: string) => {
  const region = REGIONS.find((r) => r.meta.id === id)!;
  return (await region.load()).map((p) => ({ id: p.id, latin: p.latin }));
};

/** The rows a snapshot is missing, from the plants a region ships. */
const uncovered = async (id: string, checked: { id: string }[]) => {
  const have = new Set(checked.map((r) => r.id));
  return (await shippedIds(id)).filter((p) => !have.has(p.id)).map((p) => p.id);
};

// What the Atlas of Florida Plants does not corroborate, on record. A change
// here is an editorial call about the row, not a test to update quietly.
const ATLAS_DISAGREES: Record<string, Record<string, string>> = {
  "florida-central": { "Sambucus canadensis": "ABSENT", "Salvia coccinea": "NOT_NATIVE" },
  "florida-south": { "Salvia coccinea": "NOT_NATIVE" },
};

const atlasCheck = (csv: string) => async (id: string) => {
  const index = indexAtlas(parseCsv(csv));
  const disagree: Record<string, string> = {};
  for (const p of await shippedIds(id)) {
    const { verdict } = atlasVerdict(index, p.latin);
    if (verdict !== "NATIVE") disagree[p.latin] = verdict;
  }
  expect(disagree, "a row the Atlas doesn't call native — run `npm run atlas`").toEqual(ATLAS_DISAGREES[id]);
};

/** How each claimed region shows its check covers what it ships. */
const CHECKERS: Record<string, (id: string) => Promise<void>> = {
  pnw: async (id) => expect(await uncovered(id, PNW.rows), "re-run `npm run pnw:checklist`").toEqual([]),
  "scotland-lowlands": async (id) =>
    expect(await uncovered(id, BSBI.rows), "re-run `npm run bsbi:check -- --region scotland-lowlands`").toEqual([]),
  ...Object.fromEntries(
    Object.entries({
      "north-michigan": MI_FLORAS,
      chicago: CHICAGO_FLORAS,
      "mid-atlantic": MIDATL_FLORAS,
      ireland: IRELAND_FLORAS,
      "nz-auckland": AUCKLAND_FLORAS,
      "france-atlantic": ATLANTIC_FLORAS,
      "france-continental": CONTINENTAL_FLORAS,
      "france-alpine": ALPINE_FLORAS,
    }).map(([region, doc]) => [region, async (id: string) => expect(await uncovered(id, doc.rows), `re-run \`npm run floras -- --region ${region}\``).toEqual([])]),
  ),
  "florida-central": atlasCheck(ATLAS_CENTRAL),
  "florida-south": atlasCheck(ATLAS_SOUTH),
  // VASCAN's archive is too big to commit, so the check runs in CI each
  // quarter against a fresh download. What can be held here is that it still
  // asks about this region, and that the workflow still runs it.
  "st-lawrence": async (id) => {
    expect(VASCAN_CHECK).toContain(`region: "${id}"`);
    expect(NATIVE_WORKFLOW).toContain("npm run vascan:check");
  },
};

describe("cross-checked regions", () => {
  it("name only regions that exist", () => {
    const known = new Set(REGIONS.map((r) => r.meta.id));
    expect(Object.keys(SECOND_CHECKS).filter((id) => !known.has(id))).toEqual([]);
  });

  for (const id of Object.keys(SECOND_CHECKS)) {
    it(`${id}: has a committed check covering every plant it ships`, async () => {
      const check = CHECKERS[id];
      expect(check, `${id} claims a second check but nothing here can show it`).toBeTypeOf("function");
      await check(id);
    });
  }
});
