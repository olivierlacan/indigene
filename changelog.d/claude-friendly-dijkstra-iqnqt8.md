### Fixed

- Plants: the Soil pH tile now calls a range like 4.5–6.5 "acidic" instead of "around neutral", and 7.0–8.5 "alkaline". [Eastern hemlock](https://indigene.app/plants/tsuga-canadensis) is one of the plants that now read right.
- Internal: `phWord()` treats a range touching the 6.5–7 neutral band only at its edge as the side it spans (`max <= 6.5`, `min >= 7`), with a unit test beside it. 56 of 919 rows change label.
