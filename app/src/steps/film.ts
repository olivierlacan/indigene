// The film on a page of its own: `/film`, and `/film/fr` for the French cut.
//
// The home page already plays it; these pages exist for the link. Sent on its
// own, `https://indigene.app/` previews as the site, and the film is something
// the reader has to scroll to. Both addresses are prerendered with video tags
// in their head (`scripts/prerender.mjs`) — `/film/fr` in French — so Discord,
// Slack, iMessage and the rest can show, and where they're able play, the film
// in the preview itself.
//
// `/film` plays the cut in the reader's language; `/film/fr` always plays the
// French one, because that's what whoever sent it meant. The words around the
// player follow the reader's language either way, like every other page.
//
// The player is the same click-to-play one as the home page, so opening either
// link sends nothing to the video host until the reader presses play.
import { el, clear, toast } from "../ui";
import { navigate, resetDraft } from "../state";
import { t } from "../lib/i18n";
import { filmRoute, type FilmLang } from "../lib/film";
import { filmEmbed, filmLang } from "../components/film";

export function renderFilm(main: HTMLElement, param?: string): void {
  clear(main);
  document.title = t("film.title");
  const cut: FilmLang = param === "fr" ? "fr" : filmLang();

  main.append(
    el("h2", { class: "step-title" }, t("film.title")),
    el("p", { class: "step-lede" }, t("film.lede")),
    filmEmbed(cut),
    el("button", {
      class: "btn btn-primary btn-block",
      style: "margin-top:1.4rem",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, t("welcome.start")),
    el("button", {
      type: "button",
      class: "btn btn-secondary btn-block",
      style: "margin-top:0.6rem",
      onClick: () => void share(cut),
    }, t("film.share")),
  );
}

/** Shares the page of the cut on screen, so the preview matches it. */
async function share(cut: FilmLang): Promise<void> {
  const url = `${location.origin}${import.meta.env.BASE_URL}${filmRoute(cut)}`;
  const data = { title: t("film.title"), text: t("film.shareText"), url };
  if (navigator.share) {
    await navigator.share(data).catch(() => {});
    return;
  }
  await navigator.clipboard?.writeText(url).catch(() => {});
  toast(t("plant.linkCopied"));
}
