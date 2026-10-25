import { describe, expect, it } from "vitest";
import { PACE, estimateBytes, keepable, nextStep } from "./offline-photos";

const bucket = (id: number) => `https://inaturalist-open-data.s3.amazonaws.com/photos/${id}/small.jpg`;

describe("keepable", () => {
  it("keeps the five CC licences from the open-data bucket", () => {
    const photos = ["cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"].map((license, i) => ({ url: bucket(i), license }));
    expect(keepable(photos)).toEqual({ keep: photos, skipped: 0 });
  });

  it("skips and counts any other licence, or none", () => {
    const { keep, skipped } = keepable([
      { url: bucket(1), license: "cc-by-nd" },
      { url: bucket(2), license: "all rights reserved" },
      { url: bucket(3), license: null },
      { url: bucket(4), license: "" },
      { url: bucket(5), license: "cc-by" },
    ]);
    expect(keep.map((p) => p.url)).toEqual([bucket(5)]);
    expect(skipped).toBe(4);
  });

  it("skips photos outside the open-data bucket, whatever they claim", () => {
    const { keep, skipped } = keepable([
      { url: "https://static.inaturalist.org/photos/1/small.jpg", license: "cc-by" },
      { url: "https://example.com/inaturalist-open-data.s3.amazonaws.com/2.jpg", license: "cc0" },
      { url: "not a url", license: "cc0" },
    ]);
    expect(keep).toEqual([]);
    expect(skipped).toBe(3);
  });

  it("keeps a shared photo once", () => {
    const { keep } = keepable([{ url: bucket(1), license: "cc0" }, { url: bucket(1), license: "cc0" }]);
    expect(keep).toHaveLength(1);
  });
});

describe("nextStep", () => {
  const now = 1_000_000;

  it("waits a second after a success and clears the failure count", () => {
    expect(nextStep(2, { kind: "ok" }, now)).toEqual({ action: "next", waitMs: 1000, failures: 0 });
  });

  it.each([429, 403, 500, 503])("stops at the first %i and holds for a day", (status) => {
    expect(nextStep(0, { kind: "status", status }, now)).toEqual({
      action: "stop",
      reason: "refused",
      resumeAt: now + PACE.holdMs,
    });
  });

  it("honours a Retry-After longer than a day", () => {
    const step = nextStep(0, { kind: "status", status: 429, retryAfterS: 3 * 86_400 }, now);
    expect(step).toMatchObject({ action: "stop", resumeAt: now + 3 * 86_400_000 });
  });

  it("never holds for less than a day, whatever Retry-After says", () => {
    const step = nextStep(0, { kind: "status", status: 429, retryAfterS: 5 }, now);
    expect(step).toMatchObject({ resumeAt: now + PACE.holdMs });
  });

  it("goes on past one or two failures, and stops at the third in a row", () => {
    let failures = 0;
    for (const outcome of [{ kind: "status", status: 404 }, { kind: "network" }] as const) {
      const step = nextStep(failures, outcome, now);
      expect(step.action).toBe("next");
      failures = step.action === "next" ? step.failures : failures;
    }
    expect(nextStep(failures, { kind: "network" }, now)).toEqual({
      action: "stop",
      reason: "failing",
      resumeAt: now + PACE.holdMs,
    });
  });
});

describe("estimateBytes", () => {
  it("adds typical sizes per rendition", () => {
    expect(estimateBytes([bucket(1), bucket(2).replace("small", "square")])).toBe(38_000 + 7_600);
  });
});
