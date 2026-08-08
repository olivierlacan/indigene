// `npm run blurbs:check` — are the animals' descriptions still the length a
// card and a page can carry?
//
// Two rules, in every language we publish:
//
//   1. **The opening is the card.** The wildlife index shows the beginning of
//      the blurb its page carries (`lead()` in `lib/prose.ts`) rather than a
//      second, shorter description written by hand — a card that repeats the
//      page is a paragraph somebody translates and maintains forever. So the
//      first sentence has to stand on its own and stay card-sized.
//   2. **The blurb is a paragraph, not an essay.** The detail page keeps the
//      story; it just stops. The median was 51 words and the worst was 101.
//
// A blurb that opens with a three-word fragment ("The acorn eaters.") fails
// too: `lead()` will happily show it, and a card of three words says nothing.
//
// French is checked too, with room to breathe: the same sentence takes about a
// fifth more words in French than in English ("il lui faut" for "it needs"),
// and holding a translation to the English count would make the French edition
// say less rather than say it shorter. The allowance is a ratio, not a licence
// — a French blurb still has to be the same paragraph.
import { openLoader } from "./_load-ts.mjs";

const MAX_LEAD = 28; // words a card's opening may run to
const MIN_LEAD = 8; // …and below which it isn't a card at all
const MAX_BLURB = 55; // words the whole description may run to

/** How much longer the same sentence runs in each language. English is the
 *  measure; French expands by about a fifth, which is the usual figure for
 *  en→fr and matches what the hand-written translations actually do. */
const EXPANSION = { en: 1, fr: 1.2 };
const capFor = (lang, base) => Math.round(base * EXPANSION[lang]);

const { load, close } = await openLoader();
let failed = false;

try {
  const { WILDLIFE } = await load("/src/data/wildlife.ts");
  const { lead } = await load("/src/lib/prose.ts");
  const { WILDLIFE_FR } = await load("/src/locales/prose.fr/wildlife.ts");

  const words = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);

  const check = (langLabel, id, blurb) => {
    const problems = [];
    const opening = lead(blurb);
    const maxLead = capFor(langLabel, MAX_LEAD);
    const maxBlurb = capFor(langLabel, MAX_BLURB);
    if (words(opening) > maxLead) {
      problems.push(`opening runs ${words(opening)} words (max ${maxLead}) — it is the card`);
    }
    if (words(opening) < MIN_LEAD) {
      problems.push(`opening is only ${words(opening)} words — too short to be a card on its own`);
    }
    if (words(blurb) > maxBlurb) {
      problems.push(`blurb runs ${words(blurb)} words (max ${maxBlurb})`);
    }
    for (const p of problems) {
      console.error(`  ${langLabel} ${id}: ${p}`);
      failed = true;
    }
    return problems.length === 0;
  };

  let checked = 0;
  for (const w of WILDLIFE) {
    if (check("en", w.id, w.blurb)) checked++;
    const fr = WILDLIFE_FR[w.latin ?? `#${w.id}`]?.blurb;
    if (fr && check("fr", w.id, fr)) checked++;
  }
  console.log(
    failed
      ? `\nblurbs: some descriptions are too long for the card that opens them.`
      : `blurbs: ${checked} descriptions, every opening ${MIN_LEAD}–${MAX_LEAD} words and every blurb within ${MAX_BLURB} (French +20%).`,
  );
} finally {
  await close();
}

process.exit(failed ? 1 : 0);
