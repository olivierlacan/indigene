# Which region next, and why that one

A ranked queue for the regions after the eleven we ship, decided on two things
and not on enthusiasm:

1. **How much of the list is already written.** A region whose flora our catalog
   mostly already carries inherits finished rows — size curves, seven scores,
   care and propagation notes, wildlife ties, photographs, French names — and
   costs a fraction of a region built from nothing.
2. **Whether the sources are actually in place.** Every shipped region resolves
   a spot to a real ecoregion, asserts native status from a national authority,
   and carries a host count it can cite. A region that can't do all three is a
   step down from the product, not an addition to it.

Everything below was measured, not estimated. The numbers come from
`npm run coverage`, `npm run probe:vascan`
([`data/sources/vascan/`](../data/sources/vascan/)), and live point queries
against the EPA and EEA services; the runs are dated 2026-09-19.

---

## The headline

**Three of the four regions on the table are not the thing they sound like.**

| What it sounded like | What it actually is |
|---|---|
| "Cover the Northeast" | Boston, Providence, Hartford, Albany and Concord **already get a list**. Portland (Maine) does not — and it is in the *same ecoregion as Boston*. This is a box that stops in the wrong place, not a missing region. |
| "Cover Provence and Languedoc" | **Already shipped.** Marseille, Nice, Aix, Avignon, Montpellier, Narbonne and Perpignan all resolve to Mediterranean France today. It is our **thinnest-sourced region** — 47% of its zone's caterpillar records against Atlantic France's 97%. |
| "Cover Quebec" and "cover British Columbia" | Two genuinely new regions, most of whose plants **we have already written**, both blocked on **one** missing piece: nothing can tell us what ecoregion a Canadian point is in. |

So the order is: do the two things that need no new source at all, answer the
one Canadian question, then take British Columbia and Québec in that order.

---

## Now — needs nothing we don't have

### 1. Mediterranean France: depth, not breadth

Provence and Languedoc are covered and the coverage is thin. Verified against
the live EEA service: Marseille, Nice, Aix-en-Provence, Avignon, Montpellier,
Narbonne and Perpignan every one resolves to `mediterranean`, inside the shipped
box. (Toulouse resolves to `atlantic`, correctly, and gets the Atlantic list.)

What the region is short of is food web:

| French region | Plants | Top-30 host genera shipped | Share of the zone's caterpillar records |
|---|---|---|---|
| Atlantic | 46 | 29 of 30 | **97%** |
| Continental | 38 | 19 of 30 | 68% |
| Alpine | 41 | 16 of 30 | 56% |
| **Mediterranean** | 39 | **11 of 30** | **47%** |

`npm run coverage -- --region france-mediterranean` already prints the nineteen
missing genera in order, each with the number of Lepidoptera behind it —
*Betula* 306, *Crataegus* 203, *Rumex* 199, *Festuca* 190, *Artemisia* 143. This
is the only place in the product where the next twenty plants are **named for
us** by a peer-reviewed source and nobody has worked down the list.

No new source, no new engineering, no ecoregion question. Just rows.

### 2. The Mid-Atlantic box stops 60 km west of Portland, Maine

The region's east edge is `maxLon: -71.0`. That line has no ecological meaning,
and here is what it does (EPA Level III, live query):

| Place | Ecoregion | Today |
|---|---|---|
| Boston, MA | 59 Northeastern Coastal Zone | Mid-Atlantic list |
| Providence, RI · Hartford, CT · Concord, NH | 59 Northeastern Coastal Zone | Mid-Atlantic list |
| Albany, NY | 59 Northeastern Coastal Zone | Mid-Atlantic list |
| Lake Placid, NY | 58 Northeastern Highlands | Mid-Atlantic list |
| **Portsmouth, NH** | **59 Northeastern Coastal Zone** | **no list** |
| **Portland, ME** | **59 Northeastern Coastal Zone** | **no list** |
| **Cape Cod, MA** | **84 Atlantic Coastal Pine Barrens** | **no list** |
| Bangor & Augusta, ME | 82 Acadian Plains and Hills | no list |

Portland is in the same ecoregion as Boston, and Cape Cod is in 84, which the
region explicitly claims. They get nothing because of a rectangle.

Move the east edge to **`-69.5`**. That takes in Portland, Augusta, Portsmouth
and Cape Cod, and asserts nothing we are not already asserting for Boston — the
L3 codes still gate it, so Bangor (ecoregion 82, which the list does **not**
claim) keeps its honest "no list yet".

**Not further than that.** `-66.9` would cover all of Maine, but it would also
put a strip of southwestern New Brunswick inside the box — and since the EPA
answers nothing in Canada, `regionForSite` would fall through to the box and
hand a New Brunswick reader the Pennsylvania list. That is the Belgium problem
the region maps exposed for Atlantic France, in miniature, and it is avoidable
here by stopping at `-69.5`: New Brunswick's western edge is about `-69.05`.
Eastern Maine waits for item 5, which is the region that should have it.

Cheap, visible, and it makes the region's own name true.

One caveat worth stating in the same PR: "Mid-Atlantic / Northeast Piedmont"
with `reference: "Pennsylvania"` is now serving New England. Either the
reference line changes, or northern New England becomes its own region — which
is item 5 below, and the sibling of Québec.

---

## The gate — one question, two regions

**Nothing in Canada can be resolved to an ecoregion.** Measured: the EPA service
returns no polygon for Vancouver, Victoria, Montréal, Québec City, Sherbrooke or
Halifax. `fetchEcoregion` asks the EPA inside the conterminous US and the EEA
inside Europe; a Canadian point gets neither, and `regionForSite` falls through
to `candidates[0]` — the bounding box alone.

That has a visible consequence today. **Victoria, BC already gets the Pacific
Northwest list**, because it sits inside the PNW box (which ends at exactly
49.0° N) and no ecoregion lookup can contradict it. Vancouver, 30 km north of
that line, gets nothing. Neither answer was designed.

So before either Canadian region: **`npm run probe:cec`** — is there a live
point-in-polygon service covering Canada, does it allow CORS, what are its terms?
The candidate is the CEC North American Terrestrial Ecoregions, the same Omernik
lineage the EPA layers come from, extended across all three countries. The full
question and the fallback are in
[`data/sources/cec-ecoregions/README.md`](../data/sources/cec-ecoregions/README.md).

**It has since been answered: yes.** With the hosts allowlisted, `probe:cec`
resolved Victoria, Seattle, Montréal, Québec City and Portland. The service is
CC BY 4.0, allows CORS, and carries its names in French as well as English. Two
findings changed the plan below: `gis.cec.org` itself returns 403 — the atlas
lives on the CEC's ArcGIS Online account instead — and **Victoria and Seattle
come back as one ecoregion, 7.1.7 "Strait of Georgia/Puget Lowland"**, which is
the cross-border claim this document made from the flora and could not check.
The full measurement is in
[`data/sources/cec-ecoregions/README.md`](../data/sources/cec-ecoregions/README.md).

**The fallback is no longer needed.** It was to bundle simplified polygons for
the two Canadian boxes and do point-in-polygon on-device — the scoped version of
what `ecoregion-plan.md` §3 deferred. Keep it in mind only if the ArcGIS Online
copy ever goes away.

**What we must not do** is ship a box-only Canadian region. Every region we have
stopped doing that when Phase B landed.

---

## Then — in this order

### 3. British Columbia, south coast — the cheapest region we will ever add

Vancouver, Victoria, the Sunshine Coast and the Fraser Valley. This is the
Puget Lowland and the Coast Range continuing north across a line the plants do
not observe.

**73 of the Pacific Northwest's 77 rows are recorded native in British Columbia
by VASCAN**, and 108 plants across the whole catalog are. Those rows are
finished: Douglas-fir, western redcedar, red-flowering currant, salal, vine
maple, sword fern, camas, Garry oak — written, scored, tied to wildlife,
photographed, and already named in French.

Read that 73 as a ceiling, not a list. It is *provincial* status, and British
Columbia spans the Pacific coast, a dry interior and the boreal north, so "native
in BC" is a much weaker claim there than in a small province. Only four rows
fall out, and they are instructive: three are the Willamette Valley and Oregon
end of the list (*Sidalcea campestris*, *Juncus patens*, *Grindelia
integrifolia*), and the fourth is *Achillea millefolium*, which VASCAN treats as
introduced at the species rank and native only as a variety. The real south-coast
list will lose more than four once an ecoregion decides instead of a province.

Everything else is in place:

| What a region needs | British Columbia |
|---|---|
| Native status | **VASCAN**, CC BY 4.0, `establishmentMeans` per province — the Canadian USDA PLANTS, at the same coarse resolution |
| Ecoregion | **the gate above** |
| Host counts | genus-level estimates, same basis and same honesty as every US region |
| Occurrence density | 1.27 M plant records in the box (GBIF) — half what the whole PNW box holds, in a quarter the area |
| Candidate generator | works: its two mechanical terms are GBIF and iNaturalist, both global |
| Wildlife ties | mostly reuse — the PNW's 29 animals are largely the same animals |
| Language | English |

What it is **not**: a copy of the PNW list with a new name on it. Garry oak and
arbutus hang on in the Gulf Islands and around Victoria and belong; the Klamath
and Willamette species do not. The judgement of which is which is exactly the
work, and it is the kind we already know how to do.

### 4. Québec — the only place our French and our plants meet

The St Lawrence lowlands and the southern Appalachians: Montréal, Québec City,
Sherbrooke, the Eastern Townships.

**71 catalog plants are VASCAN-native in Québec** — 40 of Northern Lower
Michigan's 46 rows, 33 of the Mid-Atlantic's 44, 50 distinct across the two.
Sugar maple, white pine, paper birch, serviceberry, bunchberry, the
northern-hardwood set: already written. What falls out is the southern half of
the Mid-Atlantic list — redbud, flowering dogwood, river birch, purple
coneflower, big bluestem.

The argument for Québec over Ontario (which is better covered still, at 81) is
the one thing no other region on earth offers us: **the French edition already
exists**. Four French regions bought a fully translated UI, a French prose
overlay and a naming discipline. Québec reuses all of it.

With one deliberate seam. `taxa.fr.ts` is French **of France**, and the type
system enforces it — `FrenchSource` does not include VASCAN, because its
*noms français normalisés* are Canadian. That refusal was right and it stands.
What Québec needs is the second table `lib/names.ts` already reserved
(`QuebecSource = "vascan"`), and the evidence says it is worth having: of the 87
rows fr-FR currently shows as `pending`, **VASCAN names 74 — agreeing on 56 and
differing on 18**. "cornouiller hart-rouge" against our "cornouiller
stolonifère"; "belle asclépiade" against "asclépiade voyante". Eighteen
divergences is the fr-FR/fr-CA split appearing as data, which is the case for
the second table rather than a reason to doubt either list.

Two things to size honestly before starting: VASCAN is **vascular plants only**,
so the animals on a Québec wildlife page need their own fr-CA authority; and the
prose overlay (`prose.fr/`) is written for a French reader, not a Québécois one.

### 5. Northern New England & the Acadian forest — Québec's US sibling

Maine, New Hampshire and Vermont above the Mid-Atlantic list's honest reach:
ecoregion **82 (Acadian Plains and Hills)**, which nothing claims, with 58
(Northeastern Highlands) and the northern end of 59.

This belongs **after** Québec and not before it, because it is the same forest:
the Québec list and this one share most of their rows, and building Québec first
means this region inherits them rather than the other way round. Item 2's box
change is the interim answer for the coastal half; this is the real one.

### 6. Ontario — everything Québec needs, minus the reason to care

81 catalog plants are native there, more than Québec. Southern Ontario is the
obvious fourth Canadian region and it brings nothing new to solve — which is
precisely why it goes after Québec, which pays for the fr-CA table and the
Canadian ecoregion provider that Ontario then rides for free.

---

## Beyond North America and France

The queue above is the next year. The question of *which ecoregions around the
world* is decided by the same two tests, and on the sources the answer is not
close.

**Britain & Ireland is the cheapest region outside North America, by a distance.**
Verified against the live EEA service: London, Edinburgh and Dublin all resolve
to `atlantic` — **the exact code `france-atlantic` already claims**. The Gaytán
matrix's Oceanic-temperate zone is the same zone Atlantic France is computed
from, and that list already ships 29 of its top 30 host genera, so the food-web
ranking transfers genus for genus. DBIF v2 (Open Government Licence) is a GB
insect-richness table we have already assessed and never run — an independent
cross-check on our European counts that only Britain makes available. And it
needs **no translation at all**.

Today a London reader gets nothing: the Atlantic France box tops out at 51.2° N,
about 30 km south of the city.

The one piece to confirm is a native-status authority — BSBI's *Online Atlas*,
or WCVP native ranges at TDWG level 3, which `DATA_SOURCES.md` already names as
the global backbone and which nothing here has yet verified.

After that, in descending order of how much is already true:

| Candidate | Ecoregion lookup | Host counts | Native status | Translation |
|---|---|---|---|---|
| **Britain & Ireland** | EEA ✅ (`atlantic`, already claimed) | Gaytán Oceanic temperate ✅ | BSBI / WCVP — **to confirm** | none |
| Spain, Italy, Portugal | EEA ✅ (`mediterranean`) | Gaytán Mediterranean ✅ | national floras — to confirm | full |
| Germany, Poland, Benelux | EEA ✅ (`continental`) | Gaytán Continental ✅ | national floras — to confirm | full |
| Nordics | EEA ✅ (`boreal`) | Gaytán Boreal ✅ | national floras — to confirm | full |
| Rest of the US | EPA ✅ | genus estimates, as now | USDA PLANTS ✅ | none |
| Everywhere else | **RESOLVE/WWF only — a shapefile, not a service** | **nothing** | WCVP | varies |

The cliff at the bottom row is the real answer to "around the world". Outside
Europe and North America there is no openly-licensed Lepidoptera host table and
no ecoregion service we can point-query — the ecological claim that is the whole
argument of this app would be an estimate with nothing behind it. That is a
research project, not a region, and it should be named as one before anybody
plans an Australian list.

---

## What this does not answer

- **Whether CEC works.** Gate 1. Nothing Canadian moves until it is run from an
  unblocked network.
- **Nursery availability**, in Canada or anywhere — `coverage-plan.md` §2 step 5
  puts that with the human, and no source has changed that.
- **Whether a Québec list should be authored in French first.** Everything we
  have is written in English and translated. A region whose readers are mostly
  francophone is the first real test of that order, and it is a question for
  whoever writes it.
