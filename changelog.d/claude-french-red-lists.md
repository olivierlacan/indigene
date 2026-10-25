### Added

- [Atlantic France](https://indigene.app/regions/france-atlantic), Continental France and the French Alps now check every plant against France's regional red lists, not just Kew's. Each plant page says whether they list it as native.
- Internal: `npm run floras` reads the LRR rows of INPN's BDC-Statuts (`redListRows` in `_floras.mjs`) for three French regions. Mediterranean France is left out: PACA's list is threatened plants only and Languedoc has none.
