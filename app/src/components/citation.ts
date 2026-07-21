// Renders a citation string ("NWF Native Plant Finder; LBJ Wildflower Center.")
// into a mix of plain text and links: any authority name known to SOURCE_LINKS
// becomes an anchor to that authority's page, everything else stays as written.
//
// No fragile parsing of the prose — we only linkify exact authority names from
// the registry, longest first so "Cornell Lab of Ornithology" wins over the
// bare "Cornell Lab" prefix. Unknown names (a person like "Tallamy", a niche
// program) are left as text rather than guessed at.
import { el } from "../ui";
import { SOURCE_LINKS } from "../data/sources";

// Longest names first: at a given position the longer authority name should
// match before its own shorter prefix.
const ordered = [...SOURCE_LINKS].sort((a, b) => b.name.length - a.name.length);
const urlByName = new Map(SOURCE_LINKS.map((s) => [s.name, s.url]));

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const matcher = new RegExp("(" + ordered.map((s) => escapeRe(s.name)).join("|") + ")", "g");

/** Citation text as DOM children: authority names linked, the rest plain text. */
export function citation(text: string): (Node | string)[] {
  const out: (Node | string)[] = [];
  let last = 0;
  for (const m of text.matchAll(matcher)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const name = m[0];
    const url = urlByName.get(name);
    out.push(
      url
        ? el("a", { href: url, target: "_blank", rel: "noopener", class: "src-link" }, name)
        : name
    );
    last = start + name.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
