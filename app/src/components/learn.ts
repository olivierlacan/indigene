// Just-in-time education. Each flow step keeps its question short and focused;
// the "why this matters" lives in one of these collapsed asides — a plain
// question that opens into two or three sentences, never a lecture. One per
// step, always optional, always skippable.
import { el } from "../ui";

export function whyThis(
  question: string,
  answer: (string | HTMLElement)[] | string
): HTMLElement {
  return el("details", { class: "learn" }, [
    el("summary", {}, question),
    el("p", {}, answer),
  ]);
}
