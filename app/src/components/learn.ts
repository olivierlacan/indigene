// Just-in-time education. Each flow step keeps its question short and focused;
// the "why this matters" lives in one of these visible asides — a plain
// question answered in two or three sentences, never a lecture, and never
// hidden behind a tap.
import { el } from "../ui";

export function whyThis(
  question: string,
  answer: (string | HTMLElement)[] | string
): HTMLElement {
  return el("aside", { class: "learn" }, [
    el("p", { class: "learn-q" }, question),
    el("p", {}, answer),
  ]);
}
