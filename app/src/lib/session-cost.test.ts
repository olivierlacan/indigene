// The Session cost check's reading of a PR description: find the section, take
// its total, and say when it passes the baseline.
import { describe, it, expect } from "vitest";
import { readSessionCost, verdict, WARN_USD, HIGH_USD } from "./session-cost";

const pr = (section: string): string => `Intro.\n\n## What changed\n- a thing\n\n${section}\n\n## Verified\nTests pass. Total: $999 elsewhere.`;

describe("readSessionCost", () => {
  it("reads the total from the section", () => {
    const body = pr("## Session cost\n| Session | Price |\n|---|---|\n| abc | $12.34 |\n\n**Total: $12.34**");
    expect(readSessionCost(body)).toEqual({ kind: "cost", totalUsd: 12.34 });
  });

  it("ignores a total outside the section", () => {
    expect(readSessionCost(pr("## Session cost\n| abc | $3 |")).kind).toBe("missing");
  });

  it("takes thousands separators and a level-3 heading", () => {
    expect(readSessionCost("### Session cost\nTotal (2 sessions): $1,008.91")).toEqual({ kind: "cost", totalUsd: 1008.91 });
  });

  it("accepts a PR no session worked on", () => {
    expect(readSessionCost(pr("## Session cost\nNo Claude session."))).toEqual({ kind: "none" });
  });

  it("calls a missing section missing, including an empty body", () => {
    expect(readSessionCost(pr("")).kind).toBe("missing");
    expect(readSessionCost(null).kind).toBe("missing");
  });
});

describe("verdict", () => {
  it("passes within the baseline and warns above it", () => {
    expect(verdict({ kind: "cost", totalUsd: WARN_USD }).level).toBe("ok");
    expect(verdict({ kind: "cost", totalUsd: WARN_USD + 0.01 }).level).toBe("warn");
    expect(verdict({ kind: "cost", totalUsd: HIGH_USD + 0.01 }).level).toBe("high");
    expect(verdict({ kind: "none" }).level).toBe("ok");
    expect(verdict({ kind: "missing", why: "x" }).level).toBe("missing");
  });
});
