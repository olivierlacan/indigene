// The one-row-per-line writer behind the committed wildlife snapshots
// (`scripts/_snapshot-json.mjs`). Whatever it writes has to read back as the
// document it was given, and the committed files have to come out unchanged.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { snapshotJson } from "../../scripts/_snapshot-json.mjs";

describe("snapshotJson", () => {
  it("reads back as the document it was given", () => {
    const doc = { region: "pnw", ranAt: "2026-10-01T00:00:00Z", ties: [{ a: 1 }, { b: [2, 3] }] };
    expect(JSON.parse(snapshotJson(doc, "ties"))).toEqual(doc);
  });
  it("writes one row per line", () => {
    const out = snapshotJson({ region: "pnw", ties: [{ a: 1 }, { b: 2 }] }, "ties");
    expect(out).toContain('\n    {"a":1},\n    {"b":2}\n');
  });
  it("still parses when the rows are all there is", () => {
    expect(JSON.parse(snapshotJson({ rows: [{ x: 1 }] }, "rows"))).toEqual({ rows: [{ x: 1 }] });
  });
  it("writes an empty list as an empty list", () => {
    expect(JSON.parse(snapshotJson({ region: "pnw" }, "ties"))).toEqual({ region: "pnw", ties: [] });
  });
  it("reproduces a committed snapshot byte for byte", () => {
    const text = readFileSync(new URL("../../../data/sources/wildlife-ties/pnw.json", import.meta.url), "utf8");
    expect(snapshotJson(JSON.parse(text), "ties")).toBe(text);
  });
});
