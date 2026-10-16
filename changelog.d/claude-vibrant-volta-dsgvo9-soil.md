### Added

- Planting: when the soil map guesses wrong, say what your soil really is (sandy, loamy or clay) on the [soil and climate step](https://indigene.app/#/confirm). Clay leans your list toward plants that like it wet, sand toward dry. Your own wetness answer still wins.
- Internal: `lib/soil-answer.ts` adds `SoilFeel`, `feelOf()`, `isSoilFeel()` and `moistureForFeel()` (sand → dry, loam → evenly moist, clay → wet). The draft carries `textureOverride` and `moistureGuessed`; a soil answer moves the wetness only while it is still a guess. The answer is saved in `soilOverride.texture`.
