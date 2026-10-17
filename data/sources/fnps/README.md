# Florida Native Plant Society — Plant Database

**Upstream:** <https://www.fnps.org/plant>
**Retrieve:** `cd app && npm run harvest:fnps` (≈40 min, resumable)
**Reduce:** `cd app && npm run harvest:fnps -- --report florida-central`
**Consumed by:** nothing in the app. A shortlist and a cross-check.

## What it is admitted for

A page per plant with what a gardener needs: which kinds of nursery sell it,
light, moisture range, salt tolerance, soil, pH and USDA zones. It answers the
one question no checklist can — *can anybody buy this?* — and fills the site
half of a row.

## What it is not

**Not a native-status source.** A native plant society writing a plant up, or
native nurseries selling it, does not settle that it is native to North &
Central Florida. Native status stays with Kew (`native:check`) and the
[Atlas of Florida Plants](../atlas-florida/). The report asks Kew about every
row it prints and says what Kew answered.

## Being a good guest

FNPS is volunteer-run. The harvester names itself in its user-agent, reads
`robots.txt` every run and stops if it shuts us out, asks for one page every
three seconds, and never asks for a page twice. It keeps facts, never prose or
photos, and leaves the county map alone: that is fed by a keyed private
endpoint. Their `robots.txt` allows it (`Content-Signal: search=yes,
ai-input=yes`); the pages are "All Rights Reserved", so `raw/` is git-ignored
and only counts are committed here.
