// "What AI cost to build Indigene" (route `#/ai`) — the bill for building the
// app with Claude, and how the app is designed to pay it back.
//
// The figures come from `lib/ai-bill.ts`, which keeps measured and estimated
// apart: sessions, tokens and price are each session's own record
// (`docs/ai-bill/sessions.csv`); electricity and carbon are those tokens times
// published estimates. The page says which is which, the way `#/sources` does
// for plant data, and lists what it doesn't count.
//
// Reached from About, beside the stance it backs up.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { t, fmtNumber, fmtDate } from "../lib/i18n";
import { statTiles, type Stat } from "../components/stat-card";
import { SNAPSHOT, bill, round2 } from "../lib/ai-bill";
import type { TKey } from "../locales/en";

const SESSIONS_URL = "https://github.com/olivierlacan/indigene/blob/main/docs/ai-bill/sessions.csv";

/** The evidence, in reading order. Names and URLs stay untranslated. */
const SOURCES: { name: string; url: string; what: TKey }[] = [
  { name: "Indigene's session records", url: SESSIONS_URL, what: "ai.src.sessions" },
  { name: "Couch 2026 — Electricity use of AI coding agents", url: "https://simonpcouch.com/blog/2026-01-20-cc-impact/", what: "ai.src.couch" },
  { name: "Hausfather 2026 — The real energy use of agentic AI", url: "https://www.theclimatebrink.com/p/the-real-energy-use-of-agentic-ai", what: "ai.src.hausfather" },
  { name: "Google 2025 — Measuring the environmental impact of AI inference", url: "https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference", what: "ai.src.google" },
  { name: "U.S. EIA — CO₂ per kilowatt-hour", url: "https://www.eia.gov/tools/faqs/faq.php?id=74", what: "ai.src.eiaCo2" },
  { name: "U.S. EIA — How much electricity does an American home use?", url: "https://www.eia.gov/tools/faqs/faq.php?id=97", what: "ai.src.eiaHome" },
];

const p = (key: TKey, params?: Record<string, string>): HTMLElement => el("p", {}, t(key, params));
const n = (x: number): string => fmtNumber(round2(x));

function tiles(): Stat[] {
  const b = bill();
  const usd = fmtNumber(Math.round(SNAPSHOT.costUsd));
  return [
    {
      icon: "🗂️",
      label: t("ai.tile.sessions.label"),
      value: fmtNumber(SNAPSHOT.sessions),
      sub: t("ai.tile.sessions.sub"),
      explain: t("ai.tile.sessions.explain"),
    },
    {
      icon: "🔤",
      label: t("ai.tile.tokens.label"),
      value: t("ai.tile.tokens.value", { n: fmtNumber(b.tokens / 1e9, 1) }),
      sub: t("ai.tile.tokens.sub"),
      explain: t("ai.tile.tokens.explain", { share: fmtNumber(b.cacheReadShare * 100) }),
    },
    {
      icon: "⚡",
      label: t("ai.tile.power.label"),
      value: t("ai.tile.power.value", { n: n(b.kWh.mid) }),
      sub: t("ai.tile.range", { low: n(b.kWh.low), high: n(b.kWh.high) }),
      explain: t("ai.tile.power.explain", { days: fmtNumber(b.homeDays) }),
      source: "Couch 2026; U.S. EIA",
    },
    {
      icon: "🌫️",
      label: t("ai.tile.co2.label"),
      value: t("ai.tile.co2.value", { n: n(b.co2Kg.mid) }),
      sub: t("ai.tile.range", { low: n(b.co2Kg.low), high: n(b.co2Kg.high) }),
      explain: t("ai.tile.co2.explain"),
      source: "U.S. EIA, 2023",
    },
    {
      icon: "💵",
      label: t("ai.tile.price.label"),
      value: t("ai.tile.price.value", { n: usd }),
      sub: t("ai.tile.price.sub"),
      explain: t("ai.tile.price.explain"),
    },
  ];
}

export function renderAi(main: HTMLElement): void {
  clear(main);
  document.title = t("ai.docTitle");
  const b = bill();

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("ai.title")),
      el("p", { class: "step-lede" }, t("ai.lede")),

      statTiles(tiles(), t("ai.tilesLabel")),
      el("p", { class: "sureness-from" }, t("ai.asOf", { date: fmtDate(Date.parse(`${SNAPSHOT.date}T12:00:00Z`)) })),

      el("h3", {}, t("ai.sureTitle")),
      p("ai.sure1"),
      p("ai.sure2"),

      el("h3", {}, t("ai.designTitle")),
      p("ai.designLede"),
      el("ul", {}, (["ai.design1", "ai.design2", "ai.design3", "ai.design4", "ai.design5"] as TKey[])
        .map((k) => el("li", {}, t(k)))),

      el("h3", {}, t("ai.evenTitle")),
      p("ai.even1", { n: n(b.chatbotAnswers) }),
      p("ai.even2"),

      el("h3", {}, t("ai.notTitle")),
      el("ul", {}, (["ai.not1", "ai.not2", "ai.not3"] as TKey[]).map((k) => el("li", {}, t(k)))),

      el("h3", {}, t("ai.sourcesTitle")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("about") }, t("ai.backToAbout")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
