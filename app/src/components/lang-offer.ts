// A one-line offer to read the app in the other language, in two cases:
//
//  - A `?lang=` link opened the app in a language that isn't the reader's own
//    (`homeLang`: their Settings pick, else their browser). It offers theirs
//    back. Kept, it's remembered as their pick.
//  - A browser that lists French but landed on English — French second in the
//    browser's list, say — and a reader who has never chosen. Dismissed once,
//    this one stays gone for good on this device.
//
// It speaks the language it offers, because that's who it's for. Taken, the
// language switch removes it, and the stored pick (`setLang`) means it never
// has a reason to come back.
import { el } from "../ui";
import { LOCALE, getLang, homeLang, langChosen, onLangChange, setLang, type Lang } from "../lib/i18n";
import { flagRow } from "./flags";

const STORAGE_KEY = "indigene:lang-offer";

function dismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dismissed";
  } catch {
    // No storage, no memory of a dismissal: offering every visit would nag, so
    // don't offer at all.
    return true;
  }
}

function browserSpeaksFrench(): boolean {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  return tags.some((tag) => String(tag ?? "").toLowerCase().split("-")[0] === "fr");
}

/** The offer's words, in the language it offers. */
const WORDS: Record<Lang, { take: string; close: string; label: string }> = {
  en: { take: "Read in English", close: "No thanks", label: "Language" },
  fr: { take: "Lire en français", close: "Non merci", label: "Langue" },
};

/** Puts the offer just above `main`, once, if this reader is one it's for. */
export function mountLangOffer(main: HTMLElement): void {
  const shown = getLang();
  const home = homeLang();
  const fromLink = shown !== home;
  const frenchHint = shown === "en" && !langChosen() && browserSpeaksFrench() && !dismissed();
  if (!fromLink && !frenchHint) return;

  const offer: Lang = fromLink ? home : "fr";
  const words = WORDS[offer];
  const flag = offer === "fr" ? flagRow(["FR"]) : null;
  flag?.setAttribute("aria-hidden", "true");
  flag?.removeAttribute("role");

  const bar = el("aside", { class: "lang-offer", lang: LOCALE[offer], "aria-label": words.label }, [
    el("button", { type: "button", class: "lang-offer-take", onclick: () => setLang(offer) }, [flag, words.take]),
    el(
      "button",
      {
        type: "button",
        class: "lang-offer-close",
        "aria-label": words.close,
        title: words.close,
        onclick: () => {
          if (fromLink) {
            // Staying in the link's language is a choice too.
            setLang(shown);
          } else {
            try {
              localStorage.setItem(STORAGE_KEY, "dismissed");
            } catch {
              // Gone for this visit, at least.
            }
          }
          bar.remove();
        },
      },
      "×"
    ),
  ]);

  const off = onLangChange(() => {
    bar.remove();
    off();
  });
  main.before(bar);
}
