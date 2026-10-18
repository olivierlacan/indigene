// `parseBasis` splits a plant's hand-written source line at its labels, so the
// Sources card can put each claim beside what backs it. The cases that matter
// are the ones where a colon is not a label, and text with no label at all.
import { describe, it, expect } from "vitest";
import { parseBasis } from "./basis";

describe("parseBasis", () => {
  it("splits labelled claims in order", () => {
    expect(
      parseBasis(
        "Native status/range: USDA PLANTS, OregonFlora. Host count: oak genus, western estimate (Tallamy/NWF). Size: USFS Silvics / FEIS.",
      ),
    ).toEqual([
      { kind: "native", label: "Native status/range", text: "USDA PLANTS, OregonFlora." },
      { kind: "hosts", label: "Host count", text: "oak genus, western estimate (Tallamy/NWF)." },
      { kind: "size", label: "Size", text: "USFS Silvics / FEIS." },
    ]);
  });

  it("keeps a basis with no labels as one general line", () => {
    expect(parseBasis("Wildflower Center; Carex hosts numerous skippers.")).toEqual([
      { kind: "general", label: null, text: "Wildflower Center; Carex hosts numerous skippers." },
    ]);
  });

  it("keeps unlabelled text before the first label", () => {
    const parts = parseBasis("Kew WCVP. Host count: 12 Lepidoptera.");
    expect(parts[0]).toEqual({ kind: "general", label: null, text: "Kew WCVP." });
    expect(parts[1].kind).toBe("hosts");
  });

  it("does not read a colon inside a code or parenthesis as a label", () => {
    const parts = parseBasis(
      "Native status: Kew WCVP (TDWG:ILL); Illinois Wildflowers. Host count: **not counted** — no figure.",
    );
    expect(parts.map((p) => p.label)).toEqual(["Native status", "Host count"]);
    expect(parts[0].text).toBe("Kew WCVP (TDWG:ILL); Illinois Wildflowers.");
    // An open parenthesis with its colon inside is prose, not a heading.
    expect(parseBasis("Native to Britain per Kew WCVP (TDWG: GRB). Size: RHS.")[0].kind).toBe("general");
  });

  it("reads an abbreviation inside a label as part of it", () => {
    const parts = parseBasis("Native status/range (var. patens): Atlas of Florida Plants (USF). Host count: 9.");
    expect(parts.map((p) => [p.kind, p.label])).toEqual([
      ["native", "Native status/range (var. patens)"],
      ["hosts", "Host count"],
    ]);
  });

  it("files labels it doesn't know as other, keeping the words", () => {
    const parts = parseBasis(
      "Native status/range: Jepson eFlora. Winter browse value: USFS FEIS. Confidence low: no record on this plant.",
    );
    expect(parts.map((p) => [p.kind, p.label])).toEqual([
      ["native", "Native status/range"],
      ["other", "Winter browse value"],
      ["confidence", "Confidence low"],
    ]);
  });
});
