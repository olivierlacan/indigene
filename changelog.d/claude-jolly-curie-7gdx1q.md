### Fixed

- A US ZIP code no longer lands in Spain. Postal codes repeat across countries — 33812 is Lakeland, Florida and a village in Asturias — so search now lists each country once, yours first. Thanks to Rikki Ocampos (@rikkibelle) for reporting it.
- Internal: postal-code-shaped searches go to Nominatim's `postalcode=` search (one result per country; Open-Meteo's GeoNames index lacks many US ZIPs), falling back to Open-Meteo. `rankPlaces` orders by the browser-language region, then time-zone longitude. Privacy page's OpenStreetMap row updated. Fixes #219.
