// "What building Indigene with an LLM cost" (route `#/llm`) — the bill for building the
// app with Claude, and how the app is designed to pay it back.
//
// The figures come from `lib/llm-bill.ts`, which keeps measured and estimated
// apart: sessions, tokens and price are each session's own record
// (`docs/llm-bill/sessions.csv`); electricity and carbon are those tokens times
// published estimates. The page says which is which, the way `#/sources` does
// for plant data, and lists what it doesn't count.
//
// Reached from About, beside the stance it backs up.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { t, tx, fmtNumber, fmtDate } from "../lib/i18n";
import { statTiles, type Stat } from "../components/stat-card";
import { SNAPSHOT, BY_LENGTH, bill, perRequestRatio, round2 } from "../lib/llm-bill";
import type { TKey } from "../locales/en";

const SESSIONS_URL = "https://github.com/olivierlacan/indigene/blob/main/docs/llm-bill/sessions.csv";

/** The evidence, in reading order. Names and URLs stay untranslated. */
const SOURCES: { name: string; url: string; what: TKey }[] = [
  { name: "Indigene's session records", url: SESSIONS_URL, what: "llm.src.sessions" },
  { name: "Couch 2026 — Electricity use of AI coding agents", url: "https://simonpcouch.com/blog/2026-01-20-cc-impact/", what: "llm.src.couch" },
  { name: "Hausfather 2026 — The real energy use of agentic AI", url: "https://www.theclimatebrink.com/p/the-real-energy-use-of-agentic-ai", what: "llm.src.hausfather" },
  { name: "Google 2025 — Measuring the environmental impact of AI inference", url: "https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference", what: "llm.src.google" },
  { name: "U.S. EIA — CO₂ per kilowatt-hour", url: "https://www.eia.gov/tools/faqs/faq.php?id=74", what: "llm.src.eiaCo2" },
  { name: "U.S. EIA — How much electricity does an American home use?", url: "https://www.eia.gov/tools/faqs/faq.php?id=97", what: "llm.src.eiaHome" },
];

const REPO = "https://github.com/olivierlacan/indigene/blob/main";

/** The written rules that already keep sessions small, each linked to where
 *  it is written. Paths stay untranslated, like the sources below. */
const RULES: { lead: TKey; body: TKey; url: string }[] = [
  { lead: "llm.rule.scripts", body: "llm.rule.scriptsBody", url: `${REPO}/docs/coverage-plan.md#1-what-enough-looks-like-for-a-region` },
  { lead: "llm.rule.checklist", body: "llm.rule.checklistBody", url: `${REPO}/docs/adding-a-region.md` },
  { lead: "llm.rule.saved", body: "llm.rule.savedBody", url: `${REPO}/data/sources/README.md` },
  { lead: "llm.rule.crops", body: "llm.rule.cropsBody", url: `${REPO}/CLAUDE.md#include-beforeafter-screenshots-for-anything-visible` },
];

const p = (key: TKey, params?: Record<string, string>): HTMLElement => el("p", {}, t(key, params));
const n = (x: number): string => fmtNumber(round2(x));

function tiles(): Stat[] {
  const b = bill();
  const usd = fmtNumber(Math.round(SNAPSHOT.costUsd));
  return [
    {
      icon: "🗂️",
      label: t("llm.tile.sessions.label"),
      value: fmtNumber(SNAPSHOT.sessions),
      sub: t("llm.tile.sessions.sub"),
      explain: t("llm.tile.sessions.explain"),
    },
    {
      icon: "🔤",
      label: t("llm.tile.tokens.label"),
      value: t("llm.tile.tokens.value", { n: fmtNumber(b.tokens / 1e9, 1) }),
      sub: t("llm.tile.tokens.sub"),
      explain: t("llm.tile.tokens.explain", { share: fmtNumber(b.cacheReadShare * 100) }),
    },
    {
      icon: "⚡",
      label: t("llm.tile.power.label"),
      value: t("llm.tile.power.value", { n: n(b.kWh.mid) }),
      sub: t("llm.tile.range", { low: n(b.kWh.low), high: n(b.kWh.high) }),
      explain: t("llm.tile.power.explain", { days: fmtNumber(b.homeDays) }),
      source: "Couch 2026; U.S. EIA",
    },
    {
      icon: "🌫️",
      label: t("llm.tile.co2.label"),
      value: t("llm.tile.co2.value", { n: n(b.co2Kg.mid) }),
      sub: t("llm.tile.range", { low: n(b.co2Kg.low), high: n(b.co2Kg.high) }),
      explain: t("llm.tile.co2.explain"),
      source: "U.S. EIA, 2023",
    },
    {
      icon: "💵",
      label: t("llm.tile.price.label"),
      value: t("llm.tile.price.value", { n: usd }),
      sub: t("llm.tile.price.sub"),
      explain: t("llm.tile.price.explain"),
    },
  ];
}

/** Where the tokens went: session length, not output, sets the bill. */
function fewerTiles(): Stat[] {
  const { long, short } = BY_LENGTH;
  const millions = (g: typeof long): string => fmtNumber(Math.round(g.tokens / g.requests / 1e6));
  return [
    {
      icon: "📏",
      label: t("llm.tile.long.label"),
      value: t("llm.tile.long.value", { n: fmtNumber(long.sessions), total: fmtNumber(long.sessions + short.sessions) }),
      sub: t("llm.tile.long.sub", { share: fmtNumber(Math.round((100 * long.tokens) / (long.tokens + short.tokens))) }),
      explain: t("llm.tile.long.explain"),
    },
    {
      icon: "🔁",
      label: t("llm.tile.perAsk.label"),
      value: t("llm.tile.perAsk.value", { n: fmtNumber(Math.round(perRequestRatio())) }),
      sub: t("llm.tile.perAsk.sub"),
      explain: t("llm.tile.perAsk.explain", { long: millions(long), short: millions(short) }),
    },
  ];
}

export function renderLlm(main: HTMLElement): void {
  clear(main);
  document.title = t("llm.docTitle");
  const b = bill();

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("llm.title")),
      el("p", { class: "step-lede" }, t("llm.lede")),

      statTiles(tiles(), t("llm.tilesLabel")),
      el("p", { class: "sureness-from" }, t("llm.asOf", { date: fmtDate(Date.parse(`${SNAPSHOT.date}T12:00:00Z`)) })),

      el("h3", {}, t("llm.sureTitle")),
      p("llm.sure1"),
      p("llm.sure2"),

      el("h3", {}, t("llm.designTitle")),
      p("llm.designLede"),
      el("ul", {}, (["llm.design1", "llm.design2", "llm.design3", "llm.design4", "llm.design5"] as TKey[])
        .map((k) => el("li", {}, t(k)))),

      el("h3", {}, t("llm.evenTitle")),
      p("llm.even1", { n: n(b.chatbotAnswers) }),
      p("llm.even2"),

      el("h3", {}, t("llm.fewerTitle")),
      p("llm.fewerLede"),
      statTiles(fewerTiles(), t("llm.fewerTilesLabel")),
      p("llm.rulesLede"),
      el("ul", {}, RULES.map(({ lead, body, url }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, t(lead))),
          ` ${t(body)}`,
        ])
      )),
      p("llm.next"),

      el("h3", {}, t("llm.notTitle")),
      el("ul", {}, [
        el("li", {}, t("llm.not1")),
        el("li", {}, tx("llm.not2", { link: el("a", { href: "#/film" }, t("llm.not2Link")) })),
        el("li", {}, t("llm.not3")),
      ]),

      el("h3", {}, t("llm.sourcesTitle")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("about") }, t("llm.backToAbout")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
