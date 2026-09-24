// The labels a plant wears under its name — "No watering", "Thorny" — and the
// one page that says what each of them means (`#/traits`, steps/traits.ts).
//
// A label is a word or two on purpose: it has to sit beside a hero photo on a
// phone, and a sentence there ("Survives with no watering") pushed itself below
// the picture. The full meaning lives on the traits page, one tap away, so the
// label can afford to be terse.
//
// Grouped because some of them are rungs of one ladder: "No watering" and
// "Water at first" are two answers to the same question, and reading them side
// by side is what makes either one mean anything.
import type { Plant } from "../types";
import type { TKey } from "../locales/en";

export type TraitId = "keystone" | "no-water" | "water-first" | "toxic" | "thorny" | "spreads" | "deer";

export interface Trait {
  id: TraitId;
  /** The `.badge` colour: brand green, amber, red, or quiet grey. */
  tone: "keystone" | "nowater" | "caution" | "neutral";
  label: TKey;
  meaning: TKey;
}

export const TRAIT_GROUPS: { title: TKey; traits: Trait[] }[] = [
  {
    title: "traits.group.water",
    traits: [
      { id: "no-water", tone: "nowater", label: "badge.noWater", meaning: "traits.noWater" },
      { id: "water-first", tone: "caution", label: "badge.needsWater", meaning: "traits.needsWater" },
    ],
  },
  {
    title: "traits.group.wildlife",
    traits: [
      { id: "keystone", tone: "keystone", label: "badge.keystone", meaning: "traits.keystone" },
      { id: "deer", tone: "neutral", label: "badge.deerResistant", meaning: "traits.deer" },
    ],
  },
  {
    title: "traits.group.handling",
    traits: [
      { id: "toxic", tone: "caution", label: "badge.petToxic", meaning: "traits.toxic" },
      { id: "thorny", tone: "caution", label: "badge.thorny", meaning: "traits.thorny" },
      { id: "spreads", tone: "caution", label: "badge.aggressive", meaning: "traits.spreads" },
    ],
  },
];

const BY_ID = new Map(TRAIT_GROUPS.flatMap((g) => g.traits).map((tr) => [tr.id, tr]));

export function traitById(id: string): Trait | undefined {
  return BY_ID.get(id as TraitId);
}

/** The labels this plant wears, in the order they're shown under its name. */
export function traitsFor(p: Plant): Trait[] {
  const ids: TraitId[] = [];
  if (p.keystone) ids.push("keystone");
  ids.push(p.noWaterEstablish ? "no-water" : "water-first");
  if (p.filters.petToxic) ids.push("toxic");
  if (p.filters.thorny) ids.push("thorny");
  if (p.filters.aggressive) ids.push("spreads");
  if (p.filters.deerResistant) ids.push("deer");
  return ids.map((id) => BY_ID.get(id)!);
}

export const traitHref = (id: TraitId): string => `#/traits/${id}`;
