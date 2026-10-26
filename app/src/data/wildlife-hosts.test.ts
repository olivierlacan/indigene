// A tie that cites a host database we hold must be in that database.
//
// GloBI-relayed ties are re-asked online (`npm run wildlife:ties`). Two host
// sources are committed to the repo, so their ties can be re-read offline, on
// every pull request:
//
//   - **HOSTS** (Robinson et al., NHM), the Japan records in
//     data/sources/hosts/records/japan.csv — every Kantō tie whose basis opens
//     "HOSTS" must have a record of the animal (or a group member) on the
//     plant's own species;
//   - **Plant-SyNZ** (Manaaki Whenua – Landcare Research), the moth lists in
//     data/sources/plant-synz/host-counts.json — every Auckland tie whose basis
//     opens "Plant-SyNZ" must name a moth that list holds for the plant's genus,
//     which is the grain Plant-SyNZ was counted at, and the basis says so.
import { describe, it, expect } from "vitest";
import JAPAN from "../../../data/sources/hosts/records/japan.csv?raw";
import SYNZ from "../../../data/sources/plant-synz/host-counts.json";
import { WILDLIFE, SUPPORT } from "./wildlife";
import { REGIONS } from "./regions";

/** HOSTS still files a few species under an older genus. Each alias is ours → HOSTS'. */
const HOSTS_ALIAS: Record<string, string> = { "Byasa alcinous": "Atrophaneura alcinous" };

const animals = new Map(WILDLIFE.map((w) => [w.id, w]));
const names = (id: string): string[] => {
  const w = animals.get(id)!;
  const own = w.members?.length ? w.members : w.latin ? [w.latin] : [];
  return own.map((n) => HOSTS_ALIAS[n] ?? n);
};

/** "Genus species" pairs from HOSTS' Japan records: insect → set of host binomials. */
function hostsPairs(): Set<string> {
  const pairs = new Set<string>();
  const [header, ...rows] = JAPAN.trim().split("\n");
  const col = header.split(",");
  const at = (n: string): number => col.indexOf(n);
  for (const row of rows) {
    const c = row.split(",");
    pairs.add(`${c[at("Insect Genus")]} ${c[at("Insect Species")]}|${c[at("Hostplant Genus")]} ${c[at("Hostplant Species")]}`);
  }
  return pairs;
}

const plantsOf = async (regionId: string): Promise<Map<string, string>> => {
  const region = REGIONS.find((r) => r.meta.id === regionId)!;
  return new Map((await region.load()).map((p) => [p.id, p.latin]));
};

describe("ties that cite a host database we hold are in it", () => {
  it("Kantō: every HOSTS tie has a HOSTS record on the plant", async () => {
    const pairs = hostsPairs();
    const plants = await plantsOf("kanto");
    const missing = Object.entries(SUPPORT.kanto ?? {}).flatMap(([plantId, links]) =>
      links
        .filter((l) => /^HOSTS\b/.test(l.basis))
        .filter((l) => !names(l.wildlifeId).some((n) => pairs.has(`${n}|${plants.get(plantId)}`)))
        .map((l) => `${plantId} → ${l.wildlifeId}`),
    );
    expect(missing).toEqual([]);
  });

  it("Auckland: every Plant-SyNZ tie names a moth on the plant's genus", async () => {
    const genera = SYNZ.genera as Record<string, { moths: string[] }>;
    const plants = await plantsOf("nz-auckland");
    const missing = Object.entries(SUPPORT["nz-auckland"] ?? {}).flatMap(([plantId, links]) =>
      links
        .filter((l) => /^Plant-SyNZ\b/.test(l.basis))
        .filter((l) => {
          const moths = genera[plants.get(plantId)!.split(" ")[0]]?.moths ?? [];
          return !names(l.wildlifeId).some((n) => moths.some((m) => m.startsWith(`${n} `)));
        })
        .map((l) => `${plantId} → ${l.wildlifeId}`),
    );
    expect(missing).toEqual([]);
  });
});
