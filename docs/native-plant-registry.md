# The native-plant registry

A small, **entirely client-side** identity layer for the plants Indigene covers.
The plant lists answer *what should I plant here*; the registry answers the
narrower question everything downstream leans on — **"is this the same plant?"** —
across our own regions, across a nursery's messy product names, and across other
apps. One entry per taxon, anchored on a stable, globally-recognized identifier,
so a lookup resolves to exactly one thing (or says, honestly, that it's ambiguous).

## Why client-side / static

A registry is *reference data*, and reference data ships as a file, not a
service — the way `tzdata`, the GBIF backbone dump, and USDA PLANTS all do. It
changes slowly, so a versioned static artifact is the right shape, it keeps
Indigene's offline-first / zero-backend properties intact, and a file other apps
bundle or fetch has no rate limits, keys, or uptime to depend on. It's more
reusable than an endpoint, not less.

## The identifier model

The anchor is an **external, globally-recognized identifier**, not a local slug —
because a name-derived slug shifts when taxonomy renames a plant, and a key that
shifts isn't a key. We use the **IPNI ID** (International Plant Names Index, what
POWO/WCVP is built on — see `DATA_SOURCES.md`), carried as a **CURIE** in
`primaryId` (`ipni:77123-1`) so the value names its own authority and is
resolvable (identifiers.org). Alongside it, an `identifiers` bag holds
cross-reference ids so any system's key can find our entry:

| scheme | unlocks |
|---|---|
| `ipni` | nomenclature; the anchor (POWO links derive from it) |
| `wfo` | World Flora Online — alternate persistent anchor |
| `gbif` | occurrences & range maps (verified against GBIF; can drift, so xref only) |
| `usda` | US native status / distribution |
| `itis` | North-American taxonomy (public domain) |
| `inat` | iNaturalist — a **direct** link to the species page (photos, nearby sightings) |
| `wikidata` | the crosswalk hub used to populate the rest; Wikipedia, images |
| `indigene` | our own catalog id — namespaced like the rest (the registry↔catalog join) |

No taxonomic identifier is immutable — species get split and renamed — so the
honest guarantee is a *persistent, never-reused* id whose mapping to the current
accepted name can be updated, not a string that pretends never to move.

## What's here

| File | Role |
|---|---|
| `app/src/data/registry.ts` | **Generated.** `REGISTRY: RegistryEntry[]`, bundled + type-checked. Don't hand-edit. |
| `app/src/data/registry.overrides.json` | **Curated.** The git write-path for reconciled identifiers, extra aliases, and cultivar links, keyed by scientific name. |
| `app/public/registry/native-plant-registry.json` | **Static artifact.** Same data as JSON, served by the PWA at a stable URL for any other app to consume. |
| `app/src/lib/registry-core.ts` | Pure logic (index, `resolveName`, `deepLinks`, `auditRegistry`) — data-free, runs in browser and Node. |
| `app/src/lib/registry.ts` | The core bound to the bundled data (`resolve()`, `entryForPlant()`), plus a DEV audit. Import this in the app. |
| `app/scripts/build-registry.mjs` | Generator: catalog → `registry.ts` + the JSON. |
| `app/scripts/check-registry.mjs` | Runnable audit (no test runner, like `check-availability.mjs`). |
| `app/scripts/reconcile.mjs` | Resolve external ids (Wikidata + GBIF) → `registry.overrides.json`. Needs network. |
| `.github/workflows/reconcile.yml` | Runs the reconcile in CI (open internet) and opens a PR with the result. |

## The entry

```jsonc
{
  "primaryId": "ipni:296012-1",        // CURIE anchor — self-describing, resolvable; null until reconciled
  "scientificName": "Quercus garryana",// accepted name (display; may be re-interpreted)
  "family": "Fagaceae",
  "form": "tree",
  "rank": "species",                   // species | genus (so "a milkweed" is askable)
  "identifiers": {
    "ipni": "296012-1",
    "gbif": "2880539",
    "usda": "QUGA4",
    "itis": "19334",
    "wikidata": "Q591759",
    "indigene": "quercus-garryana"     // our catalog id — namespaced like the rest
  },
  "commonNames": ["Oregon White Oak", "Garry Oak"],
  "aliases": ["garry oak", "oregon white oak", "quercus garryana"],  // normalized
  "cultivarOf": null,                  // a cultivar node points at its straight species' indigene id
  "regions": ["pnw"]                   // a taxon native to two regions is one entry
}
```

Until reconciliation runs, entries carry only `identifiers.indigene` + the
accepted name, and `primaryId` is `null` — never a local slug masquerading as the
identity. The audit reports the unreconciled count; the build sandbox can't reach
Wikidata/GBIF/POWO, so the ids are filled in CI or locally (below).

## Working with it

```sh
cd app
npm run registry:build   # regenerate registry.ts + the JSON from the catalog
npm run registry:check   # audit: coverage, uniqueness, lookups, ambiguity, unreconciled count
```

**Filling in the external identifiers (reconciliation).** One script resolves the
whole identifier bag — a single Wikidata lookup per taxon yields IPNI/WFO/GBIF/
USDA/ITIS, and the GBIF key is re-verified against GBIF's own match API:

```sh
npm run reconcile                       # all taxa → registry.overrides.json
npm run reconcile -- --dry-run          # print, don't write
npm run reconcile -- --name "Quercus garryana"   # one taxon, to sanity-check
npm run registry:build && npm run registry:check # bake in + verify
```

It needs open internet, which the build sandbox blocks — so run it locally, or
just trigger **`.github/workflows/reconcile.yml`** from the Actions tab (GitHub
runners have network) and it opens a PR with the reconciled ids for you to review
and merge. Nothing here runs at app runtime or per-user; the ids are baked into
the committed registry and shipped static.

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
