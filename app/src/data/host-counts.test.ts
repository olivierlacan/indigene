// Every *counted* caterpillar figure is the figure its dataset gives.
//
// `hostCountFrom: "counted"` is the strongest thing a row can say about its
// host count: somebody counted rows in a named, citable table, and the
// confidence rule rates the row high on the strength of it. Three tables
// exist, each reduced to a committed snapshot by a script that deliberately
// does *not* rewrite the region files — the number is typed into the row by
// hand, beside a `basis` sentence written for the page:
//
//   Gaytán et al. 2026   `data/sources/eu-lep-plant-matrix/host-counts.json`
//                        per genus, per European zone; the four French regions
//                        and Ireland (`npm run host-counts`)
//   Plant-SyNZ           `data/sources/plant-synz/host-counts.json`
//                        per shipped plant; Auckland (`npm run host-counts:nz`)
//   HOSTS (NHM)          `data/sources/hosts/genus-counts.json`
//                        per genus, per area; the Kantō Plain counts Japan's
//                        field records only (`npm run hosts:fetch`)
//
// A typed number can drift from the table it cites — a re-run that moves a
// count, a genus matched to the wrong zone, a transcription slip — and the
// confidence test cannot see it: it checks that the `basis` *names* a dataset,
// not that the figure *is* the dataset's. This does the second half, offline,
// on every pull request. As of writing all 339 counted rows agree.
//
// Rows marked `published`, `estimated`, `rough` or `none` are not here: the US
// figures come from Tallamy / NWF, whose table is not ours to re-read, which
// is exactly why those rows rate medium at best (`lib/confidence.ts`).
import { describe, it, expect } from "vitest";
import { REGIONS } from "./regions";

const TABLES = import.meta.glob(
  [
    "../../../data/sources/eu-lep-plant-matrix/host-counts.json",
    "../../../data/sources/plant-synz/host-counts.json",
    "../../../data/sources/hosts/genus-counts.json",
  ],
  { import: "default", eager: true },
) as Record<string, unknown>;
const table = (name: string) => TABLES[Object.keys(TABLES).find((k) => k.endsWith(name))!];

const GAYTAN = table("eu-lep-plant-matrix/host-counts.json") as {
  genera: Record<string, { zones: Record<string, { count: number }> }>;
};
const SYNZ = table("plant-synz/host-counts.json") as { plants: Record<string, { genus: number }> };
const HOSTS = table("hosts/genus-counts.json") as {
  areas: Record<string, { genera: Record<string, number>; labOnly: Record<string, number> }>;
};

/** Which European zone each Gaytán-counted region reads from — the same join
 *  `scripts/build-host-counts.mjs` makes, and Ireland's choice is in its own
 *  header: the Oceanic temperate zone, the one Brittany shares. */
const GAYTAN_ZONE: Record<string, string> = {
  "france-atlantic": "Oceanic temperate",
  "france-continental": "Continental temperate",
  "france-alpine": "Mountain",
  "france-mediterranean": "Mediterranean",
  ireland: "Oceanic temperate",
  "scotland-lowlands": "Oceanic temperate",
};

const genusOf = (latin: string) => latin.split(/\s+/)[0];

/** The dataset's figure for a counted row, or why there isn't one. */
function datasetCount(regionId: string, plant: { id: string; latin: string }): number | string {
  const zone = GAYTAN_ZONE[regionId];
  if (zone) {
    // The matrix covers every European genus, so a genus with no entry — or
    // none in this zone — is a counted zero, not an unknown: nothing recorded
    // feeds on it. Ireland's royal fern says exactly that in its `basis`.
    return GAYTAN.genera[genusOf(plant.latin)]?.zones[zone]?.count ?? 0;
  }
  if (regionId === "nz-auckland") {
    const row = SYNZ.plants[plant.id];
    return row ? row.genus : `no Plant-SyNZ row for ${plant.id}`;
  }
  if (regionId === "kanto") {
    const japan = HOSTS.areas.japan;
    const all = japan.genera[genusOf(plant.latin)];
    if (all == null) return `no Japanese HOSTS record for ${genusOf(plant.latin)}`;
    return all - (japan.labOnly[genusOf(plant.latin)] ?? 0);
  }
  return `no dataset counts for ${regionId} — a "counted" row here cites a table that does not exist`;
}

describe("every counted caterpillar figure matches its dataset", async () => {
  const lists = await Promise.all(REGIONS.map(async (r) => ({ id: r.meta.id, rows: await r.load() })));

  for (const { id, rows } of lists) {
    const counted = rows.filter((p) => p.hostCountFrom === "counted");
    if (!counted.length) continue;

    it(`${id}: ${counted.length} counted rows read what the table says`, () => {
      const wrong = counted
        .map((p) => ({ id: p.id, shipped: p.hostLepCount, dataset: datasetCount(id, p) }))
        .filter((r) => r.shipped !== r.dataset);
      expect(wrong).toEqual([]);
    });
  }
});
