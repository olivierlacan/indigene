# Florida Native Plant Society — Plant Database

**Upstream:** <https://www.fnps.org/plant>
**Retrieve:** `cd app && npm run harvest:fnps` (≈40 min, resumable)
**Reduce:** `cd app && npm run harvest:fnps -- --report florida-central`
**Consumed by:** nothing in the app. A shortlist and a cross-check.

## What it is admitted for

A native-status claim, and a page per plant with what a gardener needs: which kinds of nursery sell it,
light, moisture range, salt tolerance, soil, pH and USDA zones. It answers the
one question no checklist can — *can anybody buy this?* — and fills the site
half of a row.

## Native status: a claim that needs corroboration

FNPS writes up Florida natives, so its page is a **native-status claim** from
a society that knows the state's flora. A row ships when the
[Atlas of Florida Plants](../atlas-florida/) (USF) agrees and Kew passes
`native:check`. **Nursery availability is never evidence of native status.**
The report asks Kew about every row it prints; the Atlas column is filled in
by a person.

## Being a good guest

FNPS is volunteer-run. The harvester names itself in its user-agent, reads
`robots.txt` every run and stops if it shuts us out, asks for one page at a
time with a random 0.1–5 s wait between them, and never asks for a page twice. It keeps facts, never prose or
photos, and leaves the county map alone: that is fed by a keyed private
endpoint. Their `robots.txt` allows it (`Content-Signal: search=yes,
ai-input=yes`); the pages are "All Rights Reserved", so `raw/` is git-ignored
and only counts are committed here.
