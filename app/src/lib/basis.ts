// A plant's `basis` is labelled prose — "Native status/range: USDA PLANTS,
// OregonFlora. Host count: oak genus, western estimate (Tallamy/NWF)." — one
// string per plant, written by hand. The Sources card on a plant page shows each
// claim beside what backs it, so this splits the string at its labels.
//
// A label is a short phrase that opens a sentence and ends in ": ". Anything
// before the first label (or a basis with none at all) is kept as a general
// line rather than dropped: a source nobody labelled is still a source.

export type BasisKind = "native" | "hosts" | "size" | "confidence" | "other" | "general";

export interface BasisPart {
  kind: BasisKind;
  /** The label as written, or null for unlabelled text. */
  label: string | null;
  text: string;
}

// A capitalised phrase at the start of the string or of a sentence, up to its
// colon. No colons or semicolons inside, so "(TDWG:ILL)" is never read as one;
// a full stop only inside an abbreviation ("var. patens"), never at a sentence
// break; and short enough to be a heading rather than a sentence.
const LABEL = /(?:^|(?<=[.!?]["”)]?\s))([A-Z](?:[^.:;!?]|\.(?! [A-Z]))*?):\s+/g;
const MAX_LABEL = 80;

const balanced = (s: string): boolean => (s.match(/\(/g)?.length ?? 0) === (s.match(/\)/g)?.length ?? 0);

function kindOf(label: string): BasisKind {
  if (/^native status/i.test(label)) return "native";
  if (/^host count/i.test(label)) return "hosts";
  if (/^size\b/i.test(label)) return "size";
  if (/^confidence (medium|low)$/i.test(label)) return "confidence";
  return "other";
}

/** Split a labelled basis into its claims, in the order written. */
export function parseBasis(basis: string): BasisPart[] {
  const text = basis.trim();
  const labels = [...text.matchAll(LABEL)].filter((m) => m[1].length <= MAX_LABEL && balanced(m[1]));
  const parts: BasisPart[] = [];
  const head = text.slice(0, labels[0]?.index ?? text.length).trim();
  if (head) parts.push({ kind: "general", label: null, text: head });
  labels.forEach((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = labels[i + 1]?.index ?? text.length;
    const body = text.slice(start, end).trim();
    if (body) parts.push({ kind: kindOf(m[1]), label: m[1].trim(), text: body });
  });
  return parts;
}
