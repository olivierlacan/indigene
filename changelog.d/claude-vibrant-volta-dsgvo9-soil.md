### Added

- Planting: when the soil map guesses wrong, you can now say what your soil really is (sandy, loamy or clay) on the [soil and climate step](https://indigene.app/#/confirm). Saved spots keep your answer.
- Internal: `lib/soil-answer.ts` adds `SoilFeel`, `feelOf()` and `isSoilFeel()`. The draft carries `textureOverride`, saved in `soilOverride.texture` and restored only when it is a reader's answer, never a map class.
