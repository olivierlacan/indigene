// The one-minute film on the home page — what Indigene is and who it's for,
// hand-drawn in `film/` and hosted on Bunny Stream, one cut per language.
//
// Click to play, on purpose. Bunny's player, once loaded, talks to its video
// CDN and to Bunny's own playback-measurement servers — even muted, even if
// nobody watches. So the home page shows a still from the film, served from
// indigene.app like any other image, and only a press of the button puts the
// player on the page. Until then no request leaves for Bunny at all; the
// Privacy page says so in its "film" section, and `lib/csp.ts` allows this
// one frame host and no other.
import { el } from "../ui";
import { t, getLang } from "../lib/i18n";
import { privacyRoute } from "./privacy-link";

/** Bunny Stream library and video ids, per language cut. */
const LIBRARY = "761918";
const VIDEOS: Record<"en" | "fr", string> = {
  en: "7f131466-6a92-4fc5-9814-4acfdd392814",
  fr: "b7a57b9c-f08a-49c7-878a-d440093072a4",
};

/** The only origin the page may frame (mirrored in `lib/csp.ts`). */
export const FILM_FRAME_ORIGIN = "https://player.mediadelivery.net";

export function filmEmbed(): HTMLElement {
  const lang = getLang() === "fr" ? "fr" : "en";
  const box = el("figure", { class: "film" });

  const start = (): void => {
    // Sound on: the viewer asked for the film, so they get the narration.
    const src =
      `${FILM_FRAME_ORIGIN}/embed/${LIBRARY}/${VIDEOS[lang]}` +
      "?autoplay=true&loop=false&muted=false&preload=true&responsive=true";
    const frame = el("iframe", {
      src,
      title: t("film.title"),
      class: "film-frame",
      allow: "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen",
      allowfullscreen: true,
    });
    play.replaceWith(frame);
    frame.focus();
  };

  const play = el("button", { type: "button", class: "film-play", onClick: start }, [
    el("img", {
      src: `/film/poster-${lang}.webp`,
      alt: "",
      width: "1280",
      height: "720",
      decoding: "async",
      class: "film-poster",
    }),
    el("span", { class: "film-play-label" }, [
      el("span", { class: "film-play-icon", "aria-hidden": "true" }),
      t("film.play"),
    ]),
  ]);

  box.append(
    play,
    el("figcaption", { class: "privacy-note" }, [
      el("span", { "aria-hidden": "true" }, "🔒 "),
      `${t("film.note")} `,
      el("a", { href: privacyRoute("film") }, t("privacy.howHandled")),
      ".",
    ]),
  );
  return box;
}
