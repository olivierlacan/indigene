// docs/hero-photos/candidates.json is committed, so its shape is a promise:
// hero candidates only by default, and a format that parses back exactly.
import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs helper shared with the scripts, no types
import { heroFinalists, serialize, slimCandidate, sizedUrl } from "../../scripts/_hero-candidates.mjs";

const cand = (photoId: number, score: number, phenology: string | null = null) => ({
  photoId,
  phenology,
  mediumUrl: `https://x/photos/${photoId}/medium.jpg`,
  thumbUrl: `https://x/photos/${photoId}/square.jpg`,
  largeUrl: `https://x/photos/${photoId}/large.jpg`,
  quality: { score, centreDetail: 10, edgeDetail: 2, sky: 0.4, brightness: 120 },
  angleFit: { habit: 0.5 },
  angle: "habit",
});

describe("heroFinalists", () => {
  it("keeps the best few by score, from the general query only", () => {
    const out = heroFinalists([cand(1, 50), cand(2, 90, "flowering"), cand(3, 70), cand(4, 60)], 2);
    expect(out.map((c: { photoId: number }) => c.photoId)).toEqual([3, 4]);
  });

  it("drops what only the angle slots use", () => {
    const [c] = heroFinalists([cand(1, 50)], 1);
    expect(c).not.toHaveProperty("angleFit");
    expect(c).not.toHaveProperty("thumbUrl");
    expect(Object.keys(c.quality).sort()).toEqual(["centreDetail", "edgeDetail", "score"]);
  });
});

describe("slimCandidate with angles", () => {
  it("keeps the angle guess the angle slots sort by", () => {
    expect(slimCandidate(cand(1, 50), true)).toHaveProperty("angleFit");
  });
});

describe("serialize", () => {
  it("parses back to the same data", () => {
    const data = {
      keep: 10,
      angles: false,
      problems: [{ id: "x", error: "partial" }],
      shortlists: [
        { subject: "plant", id: "a", regionId: "r", name: "A \"quoted\"", candidates: heroFinalists([cand(1, 5), cand(2, 6)], 10) },
        { subject: "plant", id: "b", regionId: "r", name: "B", candidates: [] },
      ],
    };
    expect(JSON.parse(serialize(data))).toEqual(data);
  });

  it("puts one candidate per line", () => {
    const text: string = serialize({ keep: 1, shortlists: [{ id: "a", candidates: [{ photoId: 1 }, { photoId: 2 }] }] });
    expect(text.split("\n").filter((l: string) => l.includes("photoId"))).toHaveLength(2);
  });
});

describe("sizedUrl", () => {
  it("rebuilds the other renditions from the medium one", () => {
    expect(sizedUrl("https://x/photos/1/medium.jpeg", "large")).toBe("https://x/photos/1/large.jpeg");
  });
});
