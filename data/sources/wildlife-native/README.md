# Is this animal native here? — one snapshot per region

**Status: every region with ties is checked.** `npm run wildlife:native --
--region <id>` asks each region's fauna authority about every animal tied to
its plants, and writes `<region>.json` here. `--all` does every region;
`--evidence` rebuilds `app/src/data/wildlife-evidence.json`, the table the
animal page reads. `app/src/data/wildlife-native.test.ts` fails a PR that ships
a tied animal with no verdict here.

| Regions | Asked | Grain |
|---|---|---|
| US & Canadian regions | NatureServe, then GBIF records where NatureServe leaves a state off | state or province |
| Ireland, Scotland | UK Species Inventory (NBN Atlas), GBIF records for the country | UK, then the country |
| The four French regions | TAXREF's `FR` column, offline | metropolitan France |
| Auckland | iNaturalist's New Zealand checklist | New Zealand |
| every region | GRIIS, the global register of introductions | country |

A group ("Bumble bees") is asked as its `members`, one species at a time; it is
native where at least one member is. Each row keeps what every authority said,
so a verdict can be traced.

The verdicts (`NATIVE`, `INTRODUCED`, `DISPUTED`, `ABSENT`, `UNKNOWN`,
`NO-MATCH`) are defined at the top of `app/scripts/check-wildlife-native.mjs`.
A verdict other than `NATIVE` is a flag for a person, not a correction: the
decision about a tie belongs in `app/src/data/wildlife.ts`, and the page says
which authorities didn't confirm the animal rather than hiding it.
