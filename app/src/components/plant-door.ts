// A side-door: a compact row naming a page and the question it answers, with
// a chevron. The plants index opens with five; a region page ends with the
// ones about the plants that aren't its natives.
import { el } from "../ui";

export function door(href: string, icon: SVGElement, name: string, hint: string): HTMLElement {
  return el("a", { href, class: "card plant-door" }, [
    el("span", { class: "plant-door-icon", "aria-hidden": "true" }, [icon]),
    el("span", { class: "plant-door-text" }, [
      el("span", { class: "plant-door-name" }, name),
      el("span", { class: "plant-door-hint" }, hint),
    ]),
    el("span", { class: "plant-door-chevron", "aria-hidden": "true" }, "›"),
  ]);
}
