// What a card shows.
//
// CLAUDE.md states the invariant this function exists to keep: *"a card shows
// the opening of the page, never a second copy of it"* — the wildlife index
// prints `lead()` of the blurb the animal's page carries, so there is one
// paragraph to write, one to translate, and nothing that can drift.
//
// That makes `lead()` load-bearing for text in two languages. The interesting
// cases are the ones where "first sentence" is not obvious: a Latin
// abbreviation, an initial, a quotation mark after the full stop, and an
// opening line too short to stand alone on a card.
import { describe, it, expect } from "vitest";
import { lead } from "./prose";

describe("lead", () => {
  it("takes the first sentence when it can carry a card by itself", () => {
    const text =
      "The marsh fritillary is Ireland's only protected insect, and it lays on " +
      "one plant and nothing else. Devil's-bit scabious, in damp unimproved " +
      "grassland, is the whole of its world.";
    expect(lead(text)).toBe(
      "The marsh fritillary is Ireland's only protected insect, and it lays on " +
        "one plant and nothing else.",
    );
  });

  it("adds the second sentence when the first is too short to stand alone", () => {
    // A three-word opener on a card reads as a fragment, so it borrows the
    // next sentence — provided the pair still fits.
    const text = "It is tiny. Barely a centimetre across, and it hunts aphids all summer long.";
    expect(lead(text)).toBe(text);
  });

  it("does not borrow a second sentence that would overflow the card", () => {
    const short = "It is tiny.";
    const huge = ` ${"word ".repeat(40).trim()}.`;
    expect(lead(short + huge)).toBe(short);
  });

  it("is not fooled by a Latin abbreviation mid-sentence", () => {
    // `Viola spp.` is the case that made this guard necessary — cutting there
    // leaves a card ending on an abbreviation.
    //
    // The abbreviation sits late on purpose. Put it early and the fragment
    // before it is short enough that `lead` glues the next piece back on,
    // reproducing the right answer by luck — which is how the first version of
    // this test passed with the guard switched off.
    const text =
      "Its caterpillars feed only on the violets of damp meadows, chiefly Viola spp. " +
      "and nothing else will do. The adults nectar widely.";
    expect(lead(text)).toBe(
      "Its caterpillars feed only on the violets of damp meadows, chiefly Viola spp. " +
        "and nothing else will do.",
    );
  });

  it("is not fooled by an initial", () => {
    // Same shape, same reason: the initial is far enough in that a wrong cut
    // cannot be papered over by re-joining.
    const text =
      "The species was first described from a Swedish garden near Uppsala by C. Linnaeus " +
      "and has kept that name ever since. It grows across the whole island.";
    expect(lead(text)).toBe(
      "The species was first described from a Swedish garden near Uppsala by C. Linnaeus " +
        "and has kept that name ever since.",
    );
  });

  it("keeps a closing quotation mark with the sentence it closes", () => {
    const text =
      'Gardeners here still call it "the bee tree," and the name is earned well enough. ' +
      "It flowers late, when little else does.";
    expect(lead(text)).toContain("bee tree");
    expect(lead(text).endsWith("enough.")).toBe(true);
  });

  it("returns a single-sentence paragraph unchanged", () => {
    const one = "Rowan grows where almost nothing else will.";
    expect(lead(one)).toBe(one);
    expect(lead(`  ${one}  `)).toBe(one);
  });

  it("handles an empty paragraph without throwing", () => {
    expect(lead("")).toBe("");
  });
});
