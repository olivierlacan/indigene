# Plant-SyNZ — New Zealand's plant–herbivore database

**Status: admitted as the caterpillar-host source for New Zealand regions.**

- Upstream: <https://plant-synz.landcareresearch.co.nz> — Plant-SyNZ™, an
  invertebrate herbivore biodiversity tool built by Crop & Food Research and
  Landcare Research (1996–2009), now kept by Manaaki Whenua – Landcare Research.
- Terms: © Landcare Research. The site gives no open licence. We keep only
  **derived counts and the species names behind them**, with attribution: facts
  about which moth feeds on which plant, not the site's text or photographs.
  Worth confirming with Manaaki Whenua before anything more than that is reused.
- Refresh: `cd app && npm run host-counts:nz` → `host-counts.json`

## What it is admitted for

**One claim: how many native moth and butterfly species raise caterpillars on
this kind of plant in New Zealand?** It is the job the Tallamy / NWF figures do
in the US and the Gaytán matrix does in Europe.

Every Plant-SyNZ record names the herbivore, its order and family, its
biostatus, and a **reliability score from 0 to 10** for the evidence that it
breeds on the plant: 10 means reared on it, a low score means an adult was seen
resting on it. The site suggests "7 and above" as a filter for good evidence.

## The counting rule

Distinct species that are all of:

| Test | Why |
|---|---|
| Order Lepidoptera | Moths and butterflies, like every other region's count |
| Biostatus endemic or native | An introduced moth on a native plant isn't what the number measures |
| Reliability ≥ 7 | Plant-SyNZ's own threshold for good evidence of breeding |

…counted across **every New Zealand native species of the genus**, the scale the
US and European figures use. `host-counts.json` also records each shipped
plant's own species count, and lists the moths behind every genus by name.

## What the numbers are, and aren't

They are smaller than US and European counts, and that is mostly real: New
Zealand has about 1,800 described moths and butterflies, and the US and Europe
each have several times that. It is also partly unevenness in how well each plant has been
surveyed, which Plant-SyNZ does not hide and neither do we. A genus with no
qualifying record gets 0 and says so; it isn't borrowed from a relative.

The ranking log-scales every count against the same anchor, so a New Zealand
plant's host score is modest next to an American oak's. Within the region, the
order is what matters: pōhuehue (32), mānuka (29), the Coprosmas (27) and
māhoe (22) feed the most.
