// A one-line offer to read the app in French, for a browser that lists French
// but landed on English — French second in the browser's list, say.
//
// Only for a reader who has never chosen a language. Someone who picked English
// in Settings said what they want; someone who picked French doesn't need it.
//
// It speaks French because that's who it's for. Dismissed once, it stays gone
// for good on this device; taken, the language switch removes it, and the
// stored pick (`setLang`) means it never has a reason to come back.
import { el } from "../ui";
import { getLang, langChosen, onLangChange, setLang } from "../lib/i18n";
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

/** Puts the offer just above `main`, once, if this reader is one it's for. */
export function mountLangOffer(main: HTMLElement): void {
  if (getLang() !== "en" || langChosen() || !browserSpeaksFrench() || dismissed()) return;

  const flag = flagRow(["FR"]);
  flag?.setAttribute("aria-hidden", "true");
  flag?.removeAttribute("role");

  const bar = el("aside", { class: "lang-offer", lang: "fr-FR", "aria-label": "Langue" }, [
    el("button", { type: "button", class: "lang-offer-take", onclick: () => setLang("fr") }, [
      flag,
      "Lire en français",
    ]),
    el(
      "button",
      {
        type: "button",
        class: "lang-offer-close",
        "aria-label": "Non merci",
        title: "Non merci",
        onclick: () => {
          try {
            localStorage.setItem(STORAGE_KEY, "dismissed");
          } catch {
            // Gone for this visit, at least.
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
