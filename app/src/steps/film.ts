// The film on a page of its own (route `/film`).
//
// The home page already plays it; this page exists for the link. Sent on its
// own, `https://indigene.app/` previews as the site, and the film is something
// the reader has to scroll to. `/film` is prerendered with video tags in its
// head (`scripts/prerender.mjs`), so Discord, Slack, iMessage and the rest can
// show — and where they're able, play — the film in the preview itself.
//
// The page is the same click-to-play player as the home page, so opening the
// link sends nothing to the video host until the reader presses play.
import { el, clear, toast } from "../ui";
import { navigate, resetDraft } from "../state";
import { t } from "../lib/i18n";
import { filmEmbed } from "../components/film";

export function renderFilm(main: HTMLElement): void {
  clear(main);
  document.title = t("film.title");

  main.append(
    el("h2", { class: "step-title" }, t("film.title")),
    el("p", { class: "step-lede" }, t("film.lede")),
    filmEmbed(),
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
      onClick: () => void share(),
    }, t("film.share")),
  );
}

async function share(): Promise<void> {
  const url = `${location.origin}${import.meta.env.BASE_URL}film`;
  const data = { title: t("film.title"), text: t("film.shareText"), url };
  if (navigator.share) {
    await navigator.share(data).catch(() => {});
    return;
  }
  await navigator.clipboard?.writeText(url).catch(() => {});
  toast(t("plant.linkCopied"));
}
