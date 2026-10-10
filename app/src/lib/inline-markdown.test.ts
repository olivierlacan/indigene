import { describe, expect, it } from "vitest";
import { inlineSpans, plainText } from "./inline-markdown";

describe("inlineSpans", () => {
  it("reads **strong** and *em*", () => {
    expect(inlineSpans("Easy. **Madrone hates water.** Plant it *in* autumn.")).toEqual([
      { text: "Easy. " },
      { text: "Madrone hates water.", strong: true },
      { text: " Plant it " },
      { text: "in", em: true },
      { text: " autumn." },
    ]);
  });

  it("reads emphasis inside strong", () => {
    expect(inlineSpans("**not *this* one**")).toEqual([
      { text: "not ", strong: true },
      { text: "this", strong: true, em: true },
      { text: " one", strong: true },
    ]);
  });

  it("leaves asterisks that are not marks", () => {
    expect(inlineSpans("5 * 3 * 2, a lone * and ** spaced **")).toEqual([
      { text: "5 * 3 * 2, a lone * and ** spaced **" },
    ]);
  });

  it("passes plain prose through", () => {
    expect(inlineSpans("Nothing to see.")).toEqual([{ text: "Nothing to see." }]);
    expect(inlineSpans("")).toEqual([]);
  });
});

describe("plainText", () => {
  it("drops the marks", () => {
    expect(plainText("Its value is *when* it **flowers**.")).toBe("Its value is when it flowers.");
  });
});

// Every mark in the plant prose has to close, or the reader gets a stray
// asterisk — the bug this file exists to fix, in English and in French.
describe("plant prose", () => {
  it("leaves no asterisk once the marks are read", async () => {
    const { REGIONS, loadPlants } = await import("./plants");
    const { PROSE_FR } = await import("../locales/prose.fr/index");
    const texts: [string, string][] = [];
    for (const region of REGIONS) {
      for (const p of await loadPlants(region)) {
        for (const f of ["nativeNote", "careNote", "givesNote", "basis"] as const) texts.push([`${p.id} ${f}`, p[f]]);
        texts.push([`${p.id} propagation`, p.propagation.note]);
      }
    }
    for (const [key, prose] of Object.entries(PROSE_FR)) {
      for (const f of ["nativeNote", "careNote", "givesNote", "propagationNote"] as const) {
        const s = prose[f];
        if (typeof s === "string") texts.push([`fr ${key} ${f}`, s]);
      }
    }
    // Look-alike, swap and invasive rows, and the interface's own strings.
    const leaves = (where: string, v: unknown): void => {
      if (typeof v === "string") texts.push([where, v]);
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) leaves(`${where}.${k}`, x);
    };
    const [{ LOOKALIKES }, { ORNAMENTALS, ALTERNATIVES }, { INVASIVES }, { en }, { fr }] = await Promise.all([
      import("../data/lookalikes"), import("../data/alternatives"), import("../data/invasives"),
      import("../locales/en"), import("../locales/fr"),
    ]);
    leaves("lookalikes", LOOKALIKES);
    leaves("ornamentals", ORNAMENTALS);
    leaves("alternatives", ALTERNATIVES);
    leaves("invasives", INVASIVES);
    leaves("en", en);
    leaves("fr", fr);
    leaves("prose.fr", PROSE_FR);
    const stray = texts.filter(([, s]) => plainText(s).includes("*")).map(([where]) => where);
    expect(stray).toEqual([]);
  });
});
