// The data audits, run where a failure can stop a merge.
//
// Four layers carry claims a person wrote by hand — which animal a plant
// feeds, which impostor it gets mistaken for, which invasive to pull first,
// which native stands in for an ornamental — and each has an audit beside it
// (`auditSupport`, `auditLookalikes`, `auditInvasives`, `auditAlternatives`)
// that refuses a tie with no source, a one-sided tell, a plant the region
// doesn't ship, an animal the catalog doesn't know.
//
// Until now those audits ran only in the dev server, and only as a
// `console.warn`. `DATA_SOURCES.md` says "the dev-time audits refuse a claim
// without one", and nothing refused anything: a tie with an empty `basis`
// built, deployed and shipped, with a warning in a console nobody had open.
// Running them here makes the sentence true. The audits are unchanged; this
// is only the place where their verdict counts.
import { describe, it, expect } from "vitest";
import { auditSupport } from "../lib/wildlife";
import { auditLookalikes } from "../lib/lookalikes";
import { auditInvasives } from "../lib/invasives";
import { auditAlternatives } from "../lib/alternatives";

describe("every hand-written tie is sourced and points at something that exists", () => {
  it("wildlife: every plant↔animal tie cites a source and names a shipped plant", async () => {
    expect(await auditSupport()).toEqual([]);
  });

  it("look-alikes: every tie cites a source and every tell has both sides", async () => {
    expect(await auditLookalikes()).toEqual([]);
  });

  it("invasives: every most-wanted row cites a source and has its sighting count", () => {
    expect(auditInvasives()).toEqual([]);
  });

  it("native swaps: every swap cites a source and every edge has both sides", async () => {
    expect(await auditAlternatives()).toEqual([]);
  });
});
