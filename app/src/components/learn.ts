// Just-in-time education. Each flow step keeps its question short and focused;
// the "why this matters" lives in one of these visible asides — a plain
// question answered in two or three sentences, never a lecture, and never
// hidden behind a tap.
//
// One exception, on the results page: an aside is *just in time* only where
// the reader is still deciding. That page is the answer, and the aside there
// explains the ranking — so it sits inside the panel where the ranking is
// tuned rather than standing between the reader and the plants on every
// visit. Every other use stays out in the open.
import { el } from "../ui";

export function whyThis(
  question: string,
  answer: (string | Node)[] | string
): HTMLElement {
  return el("aside", { class: "learn" }, [
    el("p", { class: "learn-q" }, question),
    el("p", {}, answer),
  ]);
}
