### Fixed

- Every plant page that says "Kew confirms it" now has a check behind it. Fifteen
  Florida and twenty-one Pacific Northwest plants had been added after their
  region was checked; all have now been re-asked, and came back native.
- [St Lawrence](https://indigene.app/regions/st-lawrence) plants are now checked
  against Kew's world checklist too, as every other region is. Three of its
  plants Kew records under another name, and their pages say so.
- Plants: the Kantō [Aristolochia](https://indigene.app/plants/aristolochia-debilis)
  page said 4 moths feed on it from field records; the field-only figure is 3,
  and the page now says both.
- Internal: `native-check.test.ts`, `host-counts.test.ts` and `audits.test.ts`
  gate every PR on a WCVP verdict per row, counted host figures matching their
  dataset, and the four data audits that previously only warned in dev.
- Internal: every workflow step piping a check through `tee` sets `shell: bash`,
  so pipefail is on; the vernacular run of 2026-10-15 reported TAXREF dark and
  one disagreement and still passed.
