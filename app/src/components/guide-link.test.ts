// Every guide the app links to must be a page the guide actually builds.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { SECTIONS, guideProblems } from "../../scripts/guide-catalog.mjs";
import { LINKED_GUIDES } from "./guide-link";

type Section = { id: string; published: boolean; related?: { id: string; why: string }[] };

describe("guide links", () => {
  it("point only at published guides", () => {
    const published = new Set((SECTIONS as Section[]).filter((s) => s.published).map((s) => s.id));
    for (const id of LINKED_GUIDES) expect(published, id).toContain(id);
  });

  it("the catalog's own cross-links all resolve", () => {
    expect(guideProblems()).toEqual([]);
  });

  it("catches a cross-link to a guide that isn't published", () => {
    const sections = [
      { id: "a", published: true, lede: "x", related: [{ id: "b", why: "y" }], parts: [] },
      { id: "b", published: false, lede: "" },
    ];
    expect(guideProblems(sections)).toEqual([
      `section "a" relates to "b", which isn't a published guide`,
    ]);
  });

  it("catches a guide link in the words that goes nowhere", () => {
    const sections = [
      { id: "a", published: true, lede: "See https://indigene.app/guide/nope/ for more." },
    ];
    expect(guideProblems(sections)).toEqual([
      `section "a" links to /guide/nope/, which isn't a published guide`,
    ]);
  });
});
