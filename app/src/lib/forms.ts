// Every plant form, in the order a list of them is shown: big to small, then
// the ones that cover ground. The region roster's sections and the plant
// list's type chips both read it, so the two never disagree on order.
import type { PlantForm } from "../types";

export const FORM_ORDER: readonly PlantForm[] = ["tree", "shrub", "perennial", "annual", "grass", "vine", "groundcover", "fern"];

export function isPlantForm(v: unknown): v is PlantForm {
  return typeof v === "string" && (FORM_ORDER as readonly string[]).includes(v);
}
