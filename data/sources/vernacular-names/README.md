# Vernacular names — provenance

What lives here: the snapshot `app/scripts/check-vernacular.mjs` writes when it
re-asks each national reference list whether the French names Indigene shows are
the names that list actually gives.

| File | What it is |
|---|---|
| `fr.json` | Per-taxon verification result: confirmed / disagrees / source-silent / upstream-has-one-we-lack. Committed, so upstream drift shows up in a diff. |

## Why a check and not a build step

A plant's name in French is **looked up, not translated** — see
[`app/src/lib/names.ts`](../../../app/src/lib/names.ts). The table in
`app/src/locales/taxa.fr.ts` is hand-seeded from the reference lists below
(they're references a botanist reads, not APIs you page through cheaply), and
this script is what keeps the claim honest afterwards: it re-asks each authority
and reports every row the source doesn't back.

Nothing in the app depends on running it. A name that turns out to be wrong is a
data fix in `taxa.fr.ts`, reviewed like any other.

## The authorities, in the order a name is trusted

| Source | Covers | Licence |
|---|---|---|
| [TAXREF](https://inpn.mnhn.fr/programme/referentiel-taxonomique-taxref) (INPN / MNHN) | the flora **and fauna** of France — the authority for anything that grows or flies here | Licence Ouverte / Etalab |
| [Tela Botanica — BDTFX](https://www.tela-botanica.org/bdtfx/) | flora of metropolitan France; the vernacular names French botanists use | CC BY-SA |
| [VASCAN](https://data.canadensys.net/vascan/) (Canadensys, Université de Montréal) | standard French names for **North American** plants — the gap TAXREF cannot fill | CC BY |
| [Wikidata](https://www.wikidata.org/) | `P1843` (taxon common name, `fr`) and the `fr` label — the crosswalk of last resort | CC0 |

## Refreshing it

```sh
node app/scripts/check-vernacular.mjs            # verify + write fr.json
node app/scripts/check-vernacular.mjs --missing  # only "upstream has a name we don't"
```

**It needs open internet, which the build sandbox does not have** — TAXREF,
VASCAN and Wikidata all refuse the agent egress (the same situation
`reconcile.mjs` and the EEA probe are in; see [`../README.md`](../README.md)).
Run it locally, or let
[`.github/workflows/vernacular.yml`](../../../.github/workflows/vernacular.yml)
run it on a GitHub runner — it opens a PR when the snapshot changes.

The script exits non-zero only on a **disagreement** (we assert a name its own
source doesn't back). A gap is not a failure: plenty of North American natives
have never been named in French, and the app shows the scientific name for those
on purpose rather than inventing one.
