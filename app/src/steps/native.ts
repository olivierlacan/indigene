// "Native plants, not nativism" (route `#/native`) — what the word "native"
// means in this app, and what it never means.
//
// Every page here says "native", and the word sits next door to nativism: the
// idea that people born in a place matter more than people who came later.
// Ecology lends that idea nothing, and this page says so in the app's own
// voice, with the app's own data as the evidence — the Irish list that crosses
// a national border, the beech that never reached Ireland, the meadows that
// Indigenous burning kept open. The writing rules it puts in front of readers
// are the ones `CLAUDE.md` holds the copy to ("Native plants, not nativism").
//
// Like `#/crops`, it names its sources and argues the other side: Davis and
// others (2011) say judge a species by what it does, not where it's from;
// Simberloff (2003) answers that measured harm isn't xenophobia. The page
// agrees with both, and says how.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { t } from "../lib/i18n";
import type { TKey } from "../locales/en";

/** The evidence, in reading order. Names and URLs are proper nouns and stay
 *  untranslated, as on `#/crops`; `what` is the dictionary key. A paper whose
 *  authors we haven't confirmed is listed by its title. */
const SOURCES: { name: string; url: string; what: TKey }[] = [
  { name: "Forister et al. 2015 — PNAS", url: "https://doi.org/10.1073/pnas.1423042112", what: "native.src.forister" },
  { name: "Garry oak ecosystem stand history in southwest British Columbia — Biodiversity and Conservation, 2021", url: "https://doi.org/10.1007/s10531-021-02162-2", what: "native.src.garryOak" },
  { name: "Williamson & Fitter 1996 — Ecology", url: "https://doi.org/10.2307/2265769", what: "native.src.tens" },
  { name: "Davis et al. 2011 — Nature", url: "https://doi.org/10.1038/474153a", what: "native.src.davis" },
  { name: "Simberloff 2003 — Biological Invasions", url: "https://doi.org/10.1023/A:1026164419010", what: "native.src.simberloff" },
  { name: "Gröning & Wolschke-Bulmahn 1992 — Landscape Journal", url: "https://doi.org/10.3368/lj.11.2.116", what: "native.src.groening" },
];

const p = (key: TKey): HTMLElement => el("p", {}, t(key));

export function renderNative(main: HTMLElement): void {
  clear(main);
  document.title = t("native.docTitle");

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("native.title")),
      el("p", { class: "step-lede" }, t("native.lede")),

      el("div", { class: "note info lede-note" }, [
        el("strong", {}, t("privacy.shortVersion")),
        el("ul", {}, (["native.short1", "native.short2", "native.short3", "native.short4"] as TKey[])
          .map((k) => el("li", {}, t(k)))),
      ]),

      el("h3", {}, t("native.speciesTitle")),
      p("native.species1"),
      p("native.species2"),

      el("h3", {}, t("native.historyTitle")),
      p("native.history1"),
      p("native.history2"),

      el("h3", {}, t("native.behaviorTitle")),
      p("native.behavior1"),
      p("native.behavior2"),

      el("h3", {}, t("native.whyTitle")),
      p("native.why1"),
      p("native.why2"),

      el("h3", {}, t("native.sourcesTitle")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("privacy.home")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
