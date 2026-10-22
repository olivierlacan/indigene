import { describe, expect, it } from "vitest";
import { recentPost, type Post } from "./posts";

const POSTS: Post[] = [
  { slug: "b", key: "b", date: "2026-10-31" },
  { slug: "a", key: "a", date: "2026-10-12" },
];

describe("recentPost", () => {
  it("mentions a post from its own day", () => {
    expect(recentPost("2026-10-12", POSTS)?.slug).toBe("a");
  });
  it("keeps mentioning it for fourteen days, then stops", () => {
    expect(recentPost("2026-10-26", POSTS)?.slug).toBe("a");
    expect(recentPost("2026-10-27", POSTS)).toBeUndefined();
  });
  it("never announces a post dated ahead", () => {
    expect(recentPost("2026-10-30", POSTS)).toBeUndefined();
  });
  it("prefers the newest when two are recent", () => {
    expect(recentPost("2026-11-01", [...POSTS, { slug: "c", key: "c", date: "2026-10-20" }])?.slug).toBe("b");
  });
  it("counts across a month and a year boundary", () => {
    expect(recentPost("2027-01-05", [{ slug: "y", key: "y", date: "2026-12-25" }])?.slug).toBe("y");
  });
});
