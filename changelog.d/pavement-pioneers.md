### Added

- Regions: **Pavement pioneers** — the natives that grow where the ground is
  packed hard, rubbly, salted or baking. Eight per region, each with the real
  place it does that and who documented it, as on
  [the Mid-Atlantic's list](https://indigene.app/regions/mid-atlantic).
- A plant that takes that punishment now says so under its name, with a tag per
  kind — packed ground, cracks, road salt — that explains itself when you tap
  it. Shown only on the regions where it's documented.
- Internal: `data/pioneers.ts` is a region → plant id side table beside the
  wildlife and look-alike ones; 127 rows across all 15 regions. The page closes
  with a nod to Joey Santore's Crime Pays But Botany Doesn't — our name, not
  his phrase. Nine authorities added to `data/sources.ts`, led by the USFS Fire
  Effects Information System and the MNHN's Sauvages de ma rue.
- Internal: `lib/traits.ts`'s `traitsFor()` takes an optional region, because
  the pioneer label is a claim about one region's conditions; a caller without
  one never gets it. `check-prose.mjs` counts `pioneerNote`, so a region can no
  longer report 100% French while its pioneers page is in English.
- Internal: the bundle figure in the four docs that quote it is re-measured at
  ~525 KB gzipped (was ~480 KB, which had drifted ~33 KB before this branch;
  this layer adds ~13 KB).
