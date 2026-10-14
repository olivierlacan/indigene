// The tagline has one home, data/brand.json. It drifted when it had six, so
// this fails on any copy typed out anywhere else, and on any of the
// placeholders the build fills going missing. Files are read as text through
// the same `?raw` glob emoji.test.ts and llm-bill.test.ts use.
import { describe, it, expect } from "vitest";
import BRAND from "../data/brand.json";
import { appTitle, taglineSentence } from "./brand";
import { en } from "../locales/en";
import { fr } from "../locales/fr";

const SHELL = import.meta.glob(["../../index.html", "../../public/404.html", "../../public/manifest.webmanifest"], { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const CODE = import.meta.glob(["../**/*.ts", "../../scripts/*.mjs", "!./brand.test.ts"], { query: "?raw", import: "default", eager: true }) as Record<string, string>;

describe("brand", () => {
  it("builds the title from the tagline", () => {
    expect(appTitle("en")).toBe(`${BRAND.name} · ${BRAND.tagline.en}`);
    expect(taglineSentence("en").toLowerCase()).toBe(BRAND.tagline.en);
    expect(en["app.title"]).toBe(appTitle("en"));
    expect(fr["app.title"]).toBe(appTitle("fr"));
  });

  it("keeps the placeholders the build fills", () => {
    expect(Object.keys(SHELL)).toHaveLength(3);
    for (const [path, text] of Object.entries(SHELL)) expect(text, path).toContain("%APP_TITLE%");
  });

  it("is typed out nowhere but data/brand.json", () => {
    const copies = [...Object.values(BRAND.tagline), "for exactly where you stand"].map((c) => c.toLowerCase());
    const found = Object.entries({ ...SHELL, ...CODE })
      .filter(([, text]) => copies.some((c) => text.toLowerCase().includes(c)))
      .map(([path]) => path);
    expect(Object.keys(CODE).length).toBeGreaterThan(50);
    expect(found).toEqual([]);
  });
});
