// The two marks the plant prose uses for emphasis — `**strong**` and `*em*` —
// read as spans, so a page can print them as bold and italic instead of as
// asterisks (issue #186). Nothing else is Markdown here: a link, a heading or a
// list in the prose would be a writing mistake, not a feature to render.
//
// A mark only counts when it hugs a word on both sides, the way a writer types
// it: "*when* it flowers" is emphasis, "5 * 3" and a lone "*" stay as written.

export interface Span {
  text: string;
  strong?: boolean;
  em?: boolean;
}

const MARK = /\*\*(?=\S)(.+?)(?<=\S)\*\*|\*(?=[^\s*])([^*]+?)(?<=\S)\*/g;

/** Splits prose into plain, strong and emphasised runs. */
export function inlineSpans(text: string, strong = false): Span[] {
  const out: Span[] = [];
  const push = (s: Span): void => {
    if (s.text) out.push(s);
  };
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const start = m.index ?? 0;
    push(plain(text.slice(last, start), strong));
    if (m[1] !== undefined && !strong) out.push(...inlineSpans(m[1], true));
    else if (m[1] !== undefined) push(plain(m[1], strong));
    else push({ ...plain(m[2], strong), em: true });
    last = start + m[0].length;
  }
  push(plain(text.slice(last), strong));
  return out;
}

function plain(text: string, strong: boolean): Span {
  return strong ? { text, strong } : { text };
}

/** The prose with its marks taken off — for a page's meta description. */
export function plainText(text: string): string {
  return inlineSpans(text).map((s) => s.text).join("");
}
