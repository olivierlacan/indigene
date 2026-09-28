// What an emoji *means here*, said to a screen reader.
//
// Left alone, a screen reader reads an emoji by its Unicode name: "🚫 No
// thorns" is "prohibited, No thorns", "✋ No aggressive spreaders" is "raised
// hand, …", and a wildlife group headed 🌙 is "crescent moon". The picture
// carries a meaning for a sighted reader, and the name carries a different one
// — or none — for everyone else.
//
// So every emoji the app shows has a meaning in the locale files
// (`emoji.<name>` in `en.ts`), and `labelEmoji()` wraps each one it finds in a
// `role="img"` span that says it. It runs on everything the app puts on the
// page (see `watchEmoji()`), which is what lets the emoji keep living inside
// sentences in the locale files instead of being threaded through sixty call
// sites.
//
// Three things it deliberately leaves alone:
//
//  - **Anything already `aria-hidden`.** Those are icons set beside words that
//    say the same thing (the menu's 📖 beside "Guide"); a label there would
//    just be said twice.
//  - **Anything already labelled** (`role="img"`, or inside an element with its
//    own `aria-label`, where the label is what's read anyway).
//  - **Places a span can't go**: `<option>`, `<title>`, form fields, SVG.
//
// Arrows aren't emoji, but a screen reader reads them the same way ("rightwards
// arrow"). ← and → only point where the words already say to go, so they're
// hidden; ↗ means "this opens another site", which the words don't say, so it
// gets a label like any emoji.
//
// When one emoji means something else in one place — ✋ is "no aggressive
// spreaders" as a filter but "pull by hand" as a removal step — that call site
// builds its own span with `emojiSpan(icon, key)`, and this pass skips it.
import { t } from "./i18n";
import type { TKey } from "../locales/en";

/** Each emoji's default meaning in this app. Keyed without the variation
 *  selector (U+FE0F), which pages carry inconsistently. */
const MEANING: Record<string, TKey> = {
  "🦋": "emoji.wildlife",
  "🐦": "emoji.birds",
  "🕊": "emoji.birds",
  "🌙": "emoji.moths",
  "🐝": "emoji.bees",
  "🐛": "emoji.caterpillars",
  "🐞": "emoji.pestEaters",
  "🕷": "emoji.ticks",
  "🐿": "emoji.mammals",
  "🐢": "emoji.turtles",
  "🦌": "emoji.deer",
  "🐕": "emoji.pets",
  "🌱": "emoji.plant",
  "🌿": "emoji.natives",
  "🪴": "emoji.propagation",
  "🌳": "emoji.shade",
  "🌸": "emoji.flowers",
  "🌼": "emoji.nectar",
  "🍃": "emoji.leaves",
  "🍂": "emoji.deciduous",
  "🫐": "emoji.berries",
  "🌰": "emoji.seeds",
  "🥕": "emoji.roots",
  "🎋": "emoji.stems",
  "🌵": "emoji.thorns",
  "🍓": "emoji.runners",
  "🪵": "emoji.wood",
  "🌾": "emoji.dryGround",
  "🏠": "emoji.shelter",
  "⭐": "emoji.vital",
  "🎯": "emoji.specialist",
  "🚩": "emoji.invasive",
  "📍": "emoji.place",
  "🗺": "emoji.map",
  "☀": "emoji.sun",
  "⛅": "emoji.partSun",
  "🌤": "emoji.fairFit",
  "🌧": "emoji.rain",
  "💧": "emoji.water",
  "❄": "emoji.cold",
  "🌡": "emoji.warmth",
  "⛰": "emoji.erosion",
  "🧪": "emoji.soil",
  "🤲": "emoji.byHand",
  "📏": "emoji.size",
  "↔": "emoji.spread",
  "🎨": "emoji.colors",
  "📷": "emoji.photo",
  "🖼": "emoji.photo",
  "🔎": "emoji.search",
  "🔍": "emoji.search",
  "⚖": "emoji.adjust",
  "💾": "emoji.save",
  "🗑": "emoji.delete",
  "🔗": "emoji.link",
  "🔒": "emoji.private",
  "⚙": "emoji.gear",
  "📖": "emoji.guide",
  "✨": "emoji.new",
  "🔖": "emoji.saved",
  "🔄": "emoji.reload",
  "🌐": "emoji.language",
  "🚧": "emoji.unfinished",
  "🕵": "emoji.lookalike",
  "🚫": "emoji.no",
  "🛑": "emoji.poorFit",
  "✋": "emoji.stop",
  "⛏": "emoji.dig",
  "✂": "emoji.cut",
  "🪓": "emoji.girdle",
  "📦": "emoji.cover",
  "🛍": "emoji.bag",
  "🔁": "emoji.repeat",
  "📅": "emoji.timing",
  "🧤": "emoji.gloves",
  "👷": "emoji.professional",
  "👃": "emoji.smell",
  "🔪": "emoji.divide",
  "🪒": "emoji.scratch",
  "⏳": "emoji.wait",
  "🪢": "emoji.layering",
  "💨": "emoji.spores",
  "✓": "emoji.yes",
  "✗": "emoji.no",
  "✕": "emoji.close",
  "↗": "emoji.external",
};

/** Glyphs that only repeat what the words beside them say. */
const DECORATIVE = new Set(["←", "→", "⇒"]);

/** For tests: glyphs that are hidden rather than labelled. */
export const DECORATIVE_GLYPHS = [...DECORATIVE];

// One emoji: a pictograph (with an optional variation selector and skin-tone
// or ZWJ sequence), or one of the symbols above.
const GLYPH =
  /(?:\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})?(?:‍\p{Extended_Pictographic}️?)*|[✓✗✕↗←→↔⇒])/gu;

/** Non-global twin of GLYPH for a yes/no (a global regex's `test()` carries
 *  `lastIndex` from one call to the next). */
const ANY = new RegExp(GLYPH.source, "u");

const bare = (e: string): string => e.replace(/️/g, "");

/** The label for an emoji, in the current language; undefined if it has none. */
export function emojiLabel(e: string): string | undefined {
  const key = MEANING[bare(e)];
  return key ? t(key) : undefined;
}

/** An emoji with a meaning chosen at the call site — for the places where the
 *  default in `MEANING` would say the wrong thing. */
export function emojiSpan(e: string, key: TKey): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = "emoji";
  span.setAttribute("role", "img");
  span.setAttribute("aria-label", t(key));
  span.dataset.emojiKey = key;
  span.textContent = e;
  return span;
}

const SKIP = new Set(["OPTION", "TITLE", "TEXTAREA", "SCRIPT", "STYLE", "INPUT", "SELECT"]);

function shouldSkip(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent || SKIP.has(parent.tagName)) return true;
  // A button or link with its own label is read by that label, not its text.
  // (A labelled *group* still reads its children, so that isn't a reason.)
  if (parent.closest("svg, [aria-hidden='true'], [role='img'], button[aria-label], a[aria-label], [role='button'][aria-label]")) return true;
  return false;
}

function wrapText(node: Text): void {
  const text = node.data;
  const parts: (string | HTMLSpanElement)[] = [];
  let last = 0;
  let changed = false;
  for (const m of text.matchAll(GLYPH)) {
    const e = m[0];
    const at = m.index ?? 0;
    const key = MEANING[bare(e)];
    // Not one of ours (©, ™ and friends match the pattern too): leave it in the
    // surrounding text exactly as it was. `emoji.test.ts` catches an emoji of
    // ours that arrives in the sources without a meaning.
    if (!key && !DECORATIVE.has(e)) continue;
    if (at > last) parts.push(text.slice(last, at));
    const span = document.createElement("span");
    span.className = "emoji";
    span.textContent = e;
    if (key) {
      span.setAttribute("role", "img");
      span.setAttribute("aria-label", t(key));
      span.dataset.emojiKey = key;
    } else {
      span.setAttribute("aria-hidden", "true");
    }
    parts.push(span);
    last = at + e.length;
    changed = true;
  }
  // Nothing of ours in it: don't touch the node. Replacing it anyway would
  // hand the observer a "new" text node, which it would hand straight back.
  if (!changed) return;
  if (last < text.length) parts.push(text.slice(last));
  node.replaceWith(...parts);
}

/** Label every exposed emoji under `root`. Safe to run twice: a wrapped emoji
 *  sits inside a `role="img"` or `aria-hidden` span and is skipped. */
export function labelEmoji(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    if (!shouldSkip(root as Text)) wrapText(root as Text);
    return;
  }
  if (!(root instanceof Element) && !(root instanceof DocumentFragment)) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const found: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const tn = n as Text;
    if (ANY.test(tn.data) && !shouldSkip(tn)) found.push(tn);
  }
  for (const tn of found) wrapText(tn);
}

/** Re-say every label in the current language. Content the router redraws is
 *  relabelled as it arrives; this covers what stays put (header, footer). */
function relabel(): void {
  for (const span of document.querySelectorAll<HTMLElement>("span[data-emoji-key]")) {
    span.setAttribute("aria-label", t(span.dataset.emojiKey as TKey));
  }
}

/** Label what's on the page now, and everything added to it from here on. */
export function watchEmoji(onLangChange: (fn: () => void) => void): void {
  labelEmoji(document.body);
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === "characterData") labelEmoji(r.target);
      else for (const n of r.addedNodes) labelEmoji(n);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  onLangChange(relabel);
}

/** For tests: the emoji this module has a meaning for. */
export const KNOWN_EMOJI = Object.keys(MEANING);
