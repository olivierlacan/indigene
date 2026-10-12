// Plant prose as DOM: `**strong**` and `*em*` become <strong> and <em>, the
// rest stays text (`lib/inline-markdown.ts`). `inner` renders each run's text,
// so a source line can still link its authorities through `citation()`.
import { el } from "../ui";
import { inlineSpans } from "../lib/inline-markdown";

export function richText(
  text: string,
  inner: (s: string) => (Node | string)[] = (s) => [s]
): (Node | string)[] {
  return inlineSpans(text).flatMap((s) => {
    let parts = inner(s.text);
    if (s.em) parts = [el("em", {}, parts)];
    if (s.strong) parts = [el("strong", {}, parts)];
    return parts;
  });
}
