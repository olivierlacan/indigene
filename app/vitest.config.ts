import { defineConfig } from "vitest/config";

// Unit tests for the logic that has no network, no DOM and no data source —
// the parsers, the predicates, the pure selection rules.
//
// **What belongs here, and what doesn't.** This repo's main defence is a set of
// check scripts (`registry:check`, `native:check`, `selection:check`, and the
// rest) that ask the real services real questions, because most of what can go
// wrong here is a *fact* going stale: a plant's native status changing, an
// ecoregion service renaming a field, a name no source backs any more. No unit
// test can catch that, and mocking those services would only assert that our
// mock still matches our code.
//
// What a unit test *does* catch is the other half: logic that is wrong on
// inputs nobody happened to try. `regionForSite` returned the right region for
// Vancouver by the wrong route for months — the code ran, the build passed, and
// only standing in Vancouver revealed it. The tests here pin the rules that
// decision rests on, so the next edit to them fails loudly and offline.
//
// So: no network, no snapshots, no mocking of our own modules. A test here
// either feeds a pure function a literal and checks the answer, or it feeds the
// real bundled region data a coordinate and checks which list comes back.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    // The code under test is deliberately DOM-free; anything that needs a
    // document belongs in a check script or a Playwright run, not here.
    environment: "node",
    // `types: []` in tsconfig means no ambient globals, which suits us: every
    // test imports `describe`/`it`/`expect` from vitest explicitly.
    globals: false,
  },
});
