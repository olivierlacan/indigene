# The native-plant registry

A small, **entirely client-side** identity layer for the plants Indigene covers.
The plant lists answer *what should I plant here*; the registry answers the
narrower question everything downstream leans on — **"is this the same plant?"** —
across our own regions, across a nursery's messy product names, and across other
apps. One entry per taxon, keyed on a stable id, so a lookup resolves to exactly
one thing (or says, honestly, that it's ambiguous).

## Why client-side / static

A registry is *reference data*, and reference data ships as a file, not a
service — the way `tzdata`, the GBIF backbone dump, and USDA PLANTS all do. It
changes slowly, so a versioned static artifact is the right shape, it keeps
Indigene's offline-first / zero-backend properties intact, and a file other apps
bundle or fetch has no rate limits, keys, or uptime to depend on. It's more
reusable than an endpoint, not less.

## What's here

| File | Role |
|---|---|
| `app/src/data/registry.ts` | **Generated.** `REGISTRY: RegistryEntry[]`, bundled + type-checked. Don't hand-edit. |
| `app/src/data/registry.overrides.json` | **Curated.** The git write-path for reconciled `usdaSymbol`/`gbifKey`, extra aliases, and cultivar links, keyed by scientific name. |
| `app/public/registry/native-plant-registry.json` | **Static artifact.** The same data as JSON, served by the PWA at a stable URL for any other app to consume. |
| `app/src/lib/registry-core.ts` | Pure logic (index, `resolveName`, `deepLinks`, `auditRegistry`) — data-free, runs in browser and Node. |
| `app/src/lib/registry.ts` | The core bound to the bundled data (`resolve()`, `lookupId()`), plus a DEV audit. Import this in the app. |
| `app/scripts/build-registry.ts` | Generator: catalog → `registry.ts` + the JSON. |
| `app/scripts/check-registry.ts` | Runnable audit (no test runner, like `check-availability.ts`). |

## The entry

```jsonc
{
  "id": "quercus-garryana",          // stable local key == the catalog's plant id
  "scientificName": "Quercus garryana",
  "family": "Fagaceae",
  "form": "tree",
  "rank": "species",                 // species | genus (so "a milkweed" is askable)
  "commonNames": ["Oregon White Oak", "Garry Oak"],
  "aliases": ["garry oak", "oregon white oak", "quercus garryana"],  // normalized
  "usdaSymbol": null,                // USDA PLANTS key — reconciled via overrides
  "gbifKey": null,                   // GBIF backbone usageKey — reconciled via overrides
  "cultivarOf": null,                // a cultivar node points at its straight species
  "regions": ["pnw"]                 // a taxon native to two regions is one entry
}
```

The accepted **scientific name** is the anchor and the `id` is its slug (already
Indigene's convention), so registry↔catalog is the same string today. The
durable external keys (USDA `Symbol`, GBIF `usageKey`) are the goal — see
`DATA_SOURCES.md` — and are filled in via `registry.overrides.json` as they're
reconciled. They're `null` until then rather than guessed; the sandbox that built
this couldn't reach GBIF/USDA, and a wrong id is worse than an honest gap.

## Working with it

```sh
cd app
npm run registry:build   # regenerate registry.ts + the JSON from the catalog
npm run registry:check   # audit: coverage, uniqueness, lookups, ambiguity
```

**To reconcile an identifier:** add a row to `registry.overrides.json` keyed by
scientific name (`{"usdaSymbol": "QUGA4", "gbifKey": 2880539}`), re-run
`registry:build`, and commit the regenerated files.

**Resolving a name** (the plant-first primitive):

```ts
import { resolve } from "./lib/registry";
resolve("Garry Oak");        // → { kind: "match", entry: {…} }
resolve("Quercus garryana"); // → { kind: "match", entry: {…} }
resolve("Dwarf Firebush");   // → { kind: "cultivar" }  (refused, not guessed)
resolve("ironwood");         // → { kind: "ambiguous", entries: [...] }  when shared
```

Ambiguity is surfaced, never silently resolved — the property that makes
plant-first lookups trustworthy. The registry is the foundation the availability
and discoverability work (see `docs/nursery-availability-protocol.md`) builds on.
