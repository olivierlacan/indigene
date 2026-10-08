// What building Indigene with an LLM used, and the sums that turn it into
// electricity — the figures behind `#/llm`.
//
// Two kinds of number live here, and the page keeps them apart:
//
//   - **Measured.** Sessions, tokens and list price come from each Claude Code
//     session's own usage record, one row per session in
//     `docs/llm-bill/sessions.csv`. `SNAPSHOT` is those rows summed;
//     `llm-bill.test.ts` re-sums the file so the two can't drift.
//   - **Estimated.** Anthropic publishes no energy figures, so electricity is
//     tokens × an independent per-token estimate (Couch, 2026: Epoch AI's
//     per-token energy, split across token kinds by Anthropic's price ratios).
//     Cache writes are priced at 1.25× input, so they get 1.25× its energy.
//     The range is Couch's own: a cache read costs 1–25% of a fresh input
//     token, 10% in the middle. Re-reads are 98% of the tokens here, so that
//     one uncertainty is most of the range.
//
// Nine early sessions recorded a price but no tokens. Their electricity is
// scaled from that price at the rate the counted sessions show, rather than
// left out (it would understate) or guessed per token (it would invent).

export interface Tokens {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export interface Snapshot {
  date: string;
  sessions: number;
  sessionsWithTokens: number;
  tokens: Tokens;
  costUsd: number;
  costWithoutTokensUsd: number;
}

/** The sum of `docs/llm-bill/sessions.csv`, as of `date`. */
export const SNAPSHOT: Snapshot = {
  date: "2026-10-07",
  sessions: 110,
  /** Sessions whose record carries token counts; the rest have a price only, or nothing. */
  sessionsWithTokens: 100,
  tokens: { input: 4_496_334, output: 17_398_515, cacheRead: 6_539_076_307, cacheWrite: 121_361_548 },
  /** At Anthropic's API list prices, all 110 sessions. */
  costUsd: 4516.7,
  /** The part of `costUsd` from sessions with no token counts. */
  costWithoutTokensUsd: 84.71,
};

/** Sessions with token counts, split at more than ten requests (the
 *  `human_prompts` column of `docs/llm-bill/floor.csv`). Every request re-reads
 *  the session so far, so tokens per request is what a long session costs. */
export interface SessionGroup {
  sessions: number;
  tokens: number;
  requests: number;
}

export const LONG_AFTER_REQUESTS = 10;

export const BY_LENGTH: { long: SessionGroup; short: SessionGroup } = {
  long: { sessions: 17, tokens: 4_402_764_186, requests: 270 },
  short: { sessions: 83, tokens: 2_279_568_518, requests: 294 },
};

/** How many times the tokens a request costs in a long session. */
export const perRequestRatio = (g = BY_LENGTH): number =>
  (g.long.tokens / g.long.requests) / (g.short.tokens / g.short.requests);

/** Watt-hours per million tokens, by kind. */
export type Rates = Tokens;

const BASE_IN = 390;
const BASE_OUT = 1950;

const rates = (cacheReadShare: number): Rates =>
  ({ input: BASE_IN, output: BASE_OUT, cacheRead: BASE_IN * cacheReadShare, cacheWrite: BASE_IN * 1.25 });

export const RATES: { low: Rates; mid: Rates; high: Rates } = {
  low: rates(0.01),
  mid: rates(0.1),
  high: rates(0.25),
};

/** US grid average, 2023: 0.81 lb CO₂ per kWh (EIA). */
export const CO2_G_PER_KWH = 367;
/** Average US home, 2023: 855 kWh a month (EIA). */
export const HOME_KWH_PER_DAY = (855 * 12) / 365;
/** Google's measured median Gemini text prompt, 2025. */
export const CHATBOT_WH_PER_ANSWER = 0.24;

export const totalTokens = (t: Tokens): number => t.input + t.output + t.cacheRead + t.cacheWrite;

/** Watt-hours for these tokens at these rates. */
export function energyWh(t: Tokens, r: Rates): number {
  return (t.input * r.input + t.output * r.output + t.cacheRead * r.cacheRead + t.cacheWrite * r.cacheWrite) / 1e6;
}

/** Kilowatt-hours for the whole bill at one end of the range, counting the
 *  price-only sessions at the counted sessions' kWh per dollar. */
export function billKWh(r: Rates, s: Snapshot = SNAPSHOT): number {
  const counted = energyWh(s.tokens, r) / 1000;
  return counted * (s.costUsd / (s.costUsd - s.costWithoutTokensUsd));
}

/** Two significant figures: a range this wide has no business showing three. */
export function round2(n: number): number {
  if (n === 0) return 0;
  const p = 10 ** (Math.floor(Math.log10(Math.abs(n))) - 1);
  return Math.round(n / p) * p;
}

export interface Bill {
  kWh: { low: number; mid: number; high: number };
  co2Kg: { low: number; mid: number; high: number };
  homeDays: number;
  chatbotAnswers: number;
  tokens: number;
  cacheReadShare: number;
}

/** Every figure the page shows, unrounded. */
export function bill(s: Snapshot = SNAPSHOT): Bill {
  const kWh = { low: billKWh(RATES.low, s), mid: billKWh(RATES.mid, s), high: billKWh(RATES.high, s) };
  const co2 = (k: number): number => (k * CO2_G_PER_KWH) / 1000;
  return {
    kWh,
    co2Kg: { low: co2(kWh.low), mid: co2(kWh.mid), high: co2(kWh.high) },
    homeDays: kWh.mid / HOME_KWH_PER_DAY,
    chatbotAnswers: (kWh.mid * 1000) / CHATBOT_WH_PER_ANSWER,
    tokens: totalTokens(s.tokens),
    cacheReadShare: s.tokens.cacheRead / totalTokens(s.tokens),
  };
}
