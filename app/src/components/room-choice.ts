// "How big is this spot?": three buttons an order of magnitude apart, each
// with its rough area under the word, so a reader can tell a bed from a
// backyard without a tape measure. Shared by the plant list's "Plant these
// first" section and a saved spot's page (`lib/first-picks.ts` has the sizes).
import { el } from "../ui";
import { t, tn, fmtNumber } from "../lib/i18n";
import { getUnits, length } from "../lib/units";
import { ROOMS, ROOM_AREA, howMany, type Room } from "../lib/first-picks";
import type { Plant } from "../types";

/** "Plant 4, 3 ft apart": how many of a plant to put in a spot of this size,
 *  sharing it with `kinds` suggestions. The gap is the plant's mature spread. */
export function countLine(p: Plant, room: Room, kinds: number): string {
  const n = howMany(p.matureSpreadFt, room, kinds);
  return tn("first.count", n, { n: fmtNumber(n), gap: length(Math.max(1, p.matureSpreadFt)) });
}

/** "~100 ft²" or "~10 m²", in the reader's own units. */
export function roomArea(room: Room): string {
  const a = ROOM_AREA[room];
  return getUnits() === "metric" ? `~${fmtNumber(a.sqm)} m²` : `~${fmtNumber(a.sqft)} ft²`;
}

export function roomChoice(label: string, selected: Room | null, onPick: (r: Room) => void): HTMLElement {
  return el("div", { class: "first-picks-room" }, [
    el("span", { class: "roster-control-label" }, label),
    el("div", { class: "segmented", role: "group", "aria-label": label },
      ROOMS.map((r) => el("button", {
        class: "segment",
        type: "button",
        "aria-pressed": r === selected ? "true" : "false",
        onClick: () => onPick(r),
      }, [
        el("span", {}, t(`first.room.${r}` as const)),
        el("span", { class: "segment-sub" }, roomArea(r)),
      ]))),
  ]);
}
