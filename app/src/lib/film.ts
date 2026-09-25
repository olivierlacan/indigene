// Where the film lives: its Bunny Stream ids and the addresses built from them.
//
// Kept apart from `components/film.ts`, which draws the player, because
// `scripts/prerender.mjs` reads these too — to write the video tags into
// `/film`'s head, so a shared link previews as the film itself — and a Node
// script can't import a module that touches the DOM.

export type FilmLang = "en" | "fr";

/** Bunny Stream library and video ids, per language cut. */
export const FILM_LIBRARY = "761918";
export const FILM_VIDEOS: Record<FilmLang, string> = {
  en: "7f131466-6a92-4fc5-9814-4acfdd392814",
  fr: "b7a57b9c-f08a-49c7-878a-d440093072a4",
};

/** The only origin the page may frame (mirrored in `lib/csp.ts`). */
export const FILM_FRAME_ORIGIN = "https://player.mediadelivery.net";

/**
 * The library's pull zone, for the plain MP4 copies Bunny writes with the
 * library's "MP4 fallback" on (`https://<zone>/<id>/play_720p.mp4`).
 *
 * A link preview can only play a file it can fetch whole — the player page
 * and its HLS stream are no use to Discord, Slack or iMessage. Set to null and
 * `/film` previews through the player alone (`twitter:player`, and `og:video`
 * as an embed), which the apps that honour those tags still play.
 */
export const FILM_MP4_HOST: string | null = "indigene.b-cdn.net";

/** The route of one cut's page: `film`, or `film/fr` for the French cut —
 *  its own address, so a shared link previews in French too. */
export function filmRoute(lang: FilmLang): string {
  return lang === "fr" ? "film/fr" : "film";
}

/** The player page for one cut. */
export function filmEmbedUrl(lang: FilmLang): string {
  return `${FILM_FRAME_ORIGIN}/embed/${FILM_LIBRARY}/${FILM_VIDEOS[lang]}`;
}

/** The plain MP4 of one cut, when the library serves one. */
export function filmMp4Url(lang: FilmLang): string | null {
  return FILM_MP4_HOST ? `https://${FILM_MP4_HOST}/${FILM_VIDEOS[lang]}/play_720p.mp4` : null;
}
