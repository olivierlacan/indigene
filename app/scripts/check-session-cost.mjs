// The Session cost check: read the PR description from PR_BODY, report what
// its Claude sessions cost, and warn past the baseline. Fails only when the
// section is missing; a high cost is a warning for the reviewer, not a block.
//
// The logic is `src/lib/session-cost.ts`, unit-tested there. Node runs it
// directly, types stripped, so CI needs no install.
import { appendFileSync } from "node:fs";
import { readSessionCost, verdict } from "../src/lib/session-cost.ts";

const { level, message } = verdict(readSessionCost(process.env.PR_BODY));

const annotation = { ok: "notice", warn: "warning", high: "warning", missing: "error" }[level];
console.log(`::${annotation} title=Session cost::${message}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const icon = { ok: "✅", warn: "⚠️", high: "🛑", missing: "❌" }[level];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### ${icon} Session cost\n\n${message}\n`);
}

if (level === "missing") process.exit(1);
