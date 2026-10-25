// The French dictionary is a chunk of its own, fetched on demand (`lib/i18n.ts`).
// These pin the two halves of that promise: nothing French is in memory until
// `loadLanguage()` resolves, and a failed fetch degrades to English, never blank.
import { describe, expect, it, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  // `setLang` stamps `<html lang>`; the tests run without a DOM.
  vi.stubGlobal("document", { documentElement: {} });
  vi.doUnmock("../locales/fr");
});

describe("loadLanguage", () => {
  it("shows English until the French dictionary has loaded, then French", async () => {
    const i18n = await import("./i18n");
    i18n.setLang("fr");
    expect(i18n.t("app.skipToContent")).toBe("Skip to main content");
    await i18n.loadLanguage();
    expect(i18n.t("app.skipToContent")).toBe("Aller au contenu principal");
  });

  it("is a no-op for English", async () => {
    const i18n = await import("./i18n");
    i18n.setLang("en");
    await i18n.loadLanguage();
    expect(i18n.t("app.skipToContent")).toBe("Skip to main content");
  });

  it("falls back to English when the chunk can't be fetched", async () => {
    vi.doMock("../locales/fr", () => {
      throw new Error("offline");
    });
    const i18n = await import("./i18n");
    i18n.setLang("fr");
    await i18n.loadLanguage();
    expect(i18n.t("app.skipToContent")).toBe("Skip to main content");
    expect(i18n.tOptional("app.skipToContent")).toBe("Skip to main content");
  });
});
