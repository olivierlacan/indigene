### Added

- **Every animal is now checked, region by region.** Each [animal's page](https://indigene.app/wildlife) says who confirmed it's native where it's listed — NatureServe in North America, the UK Species Inventory, France's national list — and flags anywhere they didn't.
- Internal: `npm run wildlife:native` asks NatureServe, the NBN Atlas (UKSI) with GBIF records, TAXREF's `FR` column, iNaturalist's NZ checklist and GRIIS about every tied animal, snapshots to `data/sources/wildlife-native/`, and builds `wildlife-evidence.json`. Groups gain `members`, asked one species at a time. `wildlife-native.test.ts` gates it; `native.yml` re-asks quarterly.
- Internal: `npm run wildlife:ties` re-asks GloBI whether the studies a tie's basis names still record the pair, and DBIF (Biological Records Centre) about every caterpillar-host tie in Ireland and Scotland. Snapshots in `data/sources/wildlife-ties/`.
- Internal: `taxref:extract` keeps TAXREF's status in metropolitan France and the group members' names.
