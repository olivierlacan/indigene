# CEC North American Terrestrial Ecoregions

**Status: the open question, and the gate on both Canadian regions.**

`fetchEcoregion` in `app/src/lib/site.ts` asks the EPA for a point in the
conterminous US and the EEA for a point in Europe. A point in Vancouver or
Montréal gets neither — the EPA service returns **no polygon anywhere in
Canada** (measured 2026-09-19 for Vancouver, Victoria, Montréal, Québec City,
Sherbrooke and Halifax; all six came back empty).

So a Canadian region would select on its bounding box alone. Every region we
ship stopped doing that when `docs/ecoregion-plan.md` Phase B landed, and going
back on it for two new regions is the kind of quiet regression this folder
exists to prevent.

- Candidate upstream: <https://www.cec.org/north-american-environmental-atlas/>
- Publisher: Commission for Environmental Cooperation (Canada · US · Mexico)
- Licence: to confirm as part of the probe — CEC Atlas layers are generally
  open with attribution, and this has **not** been verified.
- Refresh: `cd app && npm run probe:cec` → `probe.json`

## Why this one

Two of the four candidate regions straddle the 49th parallel ecologically and
not politically. Victoria and Seattle are the same lowland; the Québec
Appalachians and northern New England are the same forest. A classification that
stops at the border cannot say that, and CEC — the same Omernik lineage the EPA
layers come from, extended across all three countries — can.

## What the probe has to answer

1. **Is there a live point-in-polygon service at all?** Discovery-first: the
   script walks candidate roots, looks for a layer with an ecoregion-shaped
   field, and queries six known points either side of the border. It assumes no
   host, layer id or field name, because none is confirmed.
2. **Does it allow CORS?** The app calls it from the browser. The existing
   Hanami proxy (`server/app/site_fetcher.rb`) is the fallback, as it is for the
   EPA call.
3. **What are its terms?**

## The current answer

**Unanswered.** The run in `probe.json` reached none of the candidate hosts —
this repo's sandbox refuses the connection before it leaves the machine, so
nothing was learned about the service. `probe-eea.mjs` was written from exactly
this position and the EEA service turned out to be fine. Re-run from an
unblocked network.

## The fallback, if the answer is no

Bundle simplified CEC Level II/III polygons **for the two Canadian coverage
boxes only** and do point-in-polygon on-device. This is the scoped version of
the offline work `docs/ecoregion-plan.md` §3 deferred, and the size objection
that killed it is much weaker for two boxes than for all 84 US ecoregions —
`scripts/build-region-maps.mjs` already clips and simplifies polygons to a
region's box and gets 8–27 KB of drawing out of it.

## A note on codes

CEC Level III is numbered `5.2.1`-style (`NA_L3CODE`), not the US `1`–`84`
(`US_L3CODE`) that `RegionMeta.ecoregion` carries. A Canadian region means a
**third `EcoregionProvider` with its own code space**, not new codes in the EPA
one. Helpfully, the EPA layer we already query returns `NA_L1NAME`/`NA_L2NAME`,
so the two sides can be lined up by hand while that is designed.
