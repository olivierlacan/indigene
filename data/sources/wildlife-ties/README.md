# Do the sources still record this tie? — one snapshot per region

`npm run wildlife:ties -- --region <id>` (or `--all`) re-asks two kinds of tie:

- **Ties relayed by GloBI** (`basis` opens "GloBI —"): GloBI is asked for the
  animal on the plant, and the studies that answer are compared with the ones
  the basis names (the table is `app/scripts/_globi.mjs`).
- **Caterpillar-host ties in Ireland and Scotland**: the Biological Records
  Centre's Database of Insects and their Food Plants (DBIF) is asked whether it
  lists the insect on the plant — on the species, or failing that the genus
  (`atGenus: true`).

`CONFIRMED` means a cited study (or DBIF) records the pair. `OTHER` means GloBI
records it from studies the basis doesn't name — re-cite it. `NOT-FOUND` means
nothing asked records it — read the basis again. A flag is a report, not a
removal. `app/src/data/wildlife-native.test.ts` requires every GloBI-relayed tie
to have a row here.
