// What a pull request's Claude sessions cost, read from its description.
//
// Every PR carries a `## Session cost` section (CLAUDE.md, "Every PR shows what
// its sessions cost"): a row per session, then a `Total: $…` line. The
// Session cost check (`.github/workflows/session-cost.yml`) reads it with this
// module and warns when the total passes the baseline below.
//
// No imports, on purpose: CI runs it straight from Node, which strips the types,
// without installing the app.

/** Above this a PR gets a warning. The median of the first 110 sessions was
 *  $11 and three in four came in under $26 (`docs/ai-bill/sessions.csv`), so
 *  this is roughly three typical sessions. */
export const WARN_USD = 30;
/** Above this the warning says so louder: only 9 of those 110 sessions cost
 *  more, and those 9 were over half of the whole bill. */
export const HIGH_USD = 100;

export type SessionCost =
  | { kind: "cost"; totalUsd: number }
  | { kind: "none" } // a PR no Claude session worked on
  | { kind: "missing"; why: string };

/** The `## Session cost` section's text, or null. A heading of level 2 or 3
 *  opens it; the next heading at that level or above closes it. */
function section(body: string): string | null {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => /^#{2,3}\s+session cost\b/i.test(l.trim()));
  if (start === -1) return null;
  const level = lines[start].trim().match(/^#+/)![0].length;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => {
    const m = l.trim().match(/^(#+)\s/);
    return !!m && m[1].length <= level;
  });
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

export function readSessionCost(body: string | null | undefined): SessionCost {
  const text = section(body ?? "");
  if (text === null) return { kind: "missing", why: "no `## Session cost` section" };
  if (/no claude session/i.test(text)) return { kind: "none" };
  const m = text.match(/total[^$\n]*\$\s*([\d,]+(?:\.\d+)?)/i);
  if (!m) return { kind: "missing", why: "the section has no `Total: $…` line" };
  return { kind: "cost", totalUsd: Number(m[1].replace(/,/g, "")) };
}

export type Level = "ok" | "warn" | "high" | "missing";

export function verdict(c: SessionCost): { level: Level; message: string } {
  if (c.kind === "missing") {
    return { level: "missing", message: `This PR doesn't show what its Claude sessions cost: ${c.why}. Add the section CLAUDE.md describes, or write "No Claude session" under the heading.` };
  }
  if (c.kind === "none") return { level: "ok", message: "No Claude session worked on this PR." };
  const usd = `$${c.totalUsd.toFixed(2)}`;
  if (c.totalUsd > HIGH_USD) {
    return { level: "high", message: `Sessions on this PR cost ${usd}, over the $${HIGH_USD} mark only 9 of the first 110 sessions passed. Say in the description why, and split the next task like it into shorter sessions.` };
  }
  if (c.totalUsd > WARN_USD) {
    return { level: "warn", message: `Sessions on this PR cost ${usd}, above the $${WARN_USD} baseline (the median session is about $11). Say in the description why it ran long.` };
  }
  return { level: "ok", message: `Sessions on this PR cost ${usd}, within the $${WARN_USD} baseline.` };
}
