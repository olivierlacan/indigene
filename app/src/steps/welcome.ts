import { el, clear } from "../ui";
import { navigate, resetDraft } from "../state";
import { listSpots } from "../db";
import { t, tn, tx } from "../lib/i18n";
import { filmEmbed, filmLang } from "../components/film";
import { filmRoute } from "../lib/film";
import { REGIONS } from "../lib/plants";
import { wildlifeThumb } from "../components/wildlife-thumb";
import { plantThumb, invasiveThumb, lookalikeThumb } from "../components/plant-thumb";

export function renderWelcome(main: HTMLElement): void {
  clear(main);

  // Filled in below once IndexedDB answers — the page must never wait on it
  // (a stalled database used to leave the whole home screen blank).
  const savedSection = el("div", { style: "display:none" });

  // The pitch and the film are one hero: stacked on a phone, side by side on a
  // laptop, where a single 34rem column left most of the window empty.
  const pitch = el("div", { class: "welcome-pitch" }, [
    el("h2", { class: "step-title" }, t("welcome.title")),
    el("p", { class: "step-lede" }, t("welcome.lede1")),
    el("p", { class: "step-lede" }, t("welcome.lede2")),
    el("div", { class: "note info" }, [
      // The claim links the page that backs it up.
      el("a", { href: "#/privacy" }, el("strong", {}, t("welcome.noAccount").trimEnd())), " ",
      t("welcome.noAccountRest"),
    ]),
    el("button", {
      class: "btn btn-primary btn-block",
      onClick: () => {
        resetDraft();
        navigate("location");
      },
    }, t("welcome.start")),
    // The escape hatch for people who'd rather not use their location: the
    // regions and featured-plants cards live on the browse page instead. One
    // line at 360 px — the link says what it does, and the page it opens says
    // the rest.
    el("p", { style: "margin-top:0.6rem;font-size:0.85rem;color:var(--ink-soft);text-align:center" },
      tx("welcome.ratherNot", {
        link: el("a", { href: "#/browse" }, t("welcome.ratherNotLink")),
      })
    ),
    // A returning visitor's real starting point, so it sits under the start
    // button rather than below the whole pitch.
    savedSection,
  ]);

  main.append(
    el("div", { class: "welcome-hero" }, [
      pitch,
      el("div", { class: "welcome-film" }, [
        // The one-minute film: the whole pitch, drawn. Click to play, so the
        // home page makes no request to the video host until someone asks.
        filmEmbed(),
        // Its own page is the address worth sending: it previews as the film.
        el("p", { style: "margin-top:0.4rem;font-size:0.85rem;text-align:center" },
          el("a", { href: `#/${filmRoute(filmLang())}` }, t("film.share"))
        ),
      ]),
    ]),
    // No language & units line here. It used to sit between the start button
    // and the pitch, on the reasoning that a French speaker shouldn't have to
    // read an English page to the bottom to find the switch — but a settings
    // control dropped into the middle of a page reads as part of the page, and
    // it interrupted the one thing this screen is for. The switch is now in
    // the header's menu, which is above the fold on every page including this
    // one, and still in the footer.

    // The pitch for anyone not yet convinced — in plain sight, not a drawer.
    el("section", { class: "welcome-why" }, [
      el("h3", { style: "margin-top:1.8rem" }, t("welcome.whyTitle")),
      el("p", {}, t("welcome.why1")),
      el("p", {}, t("welcome.why2")),
      // The word this whole app leans on sits next door to nativism, so the
      // pitch for native plants ends by saying what "native" never means — the
      // same stance the About page carries, in the same words, linking to the
      // page that makes the case (#/native).
      // Its own look rather than a `.note`: the welcome page already has one
      // tinted note (no account, no tracking), and this is a stance, not a
      // footnote — so it gets a card with a brand rule, a title of its own and
      // a real button into the page.
      el("aside", { class: "native-callout", "aria-labelledby": "native-callout-title" }, [
        el("p", { class: "native-callout-title", id: "native-callout-title" }, t("about.stance.native")),
        // The stance's body sentence, minus its inline link: here the link is
        // the button below, not a word in the sentence.
        el("p", { class: "native-callout-body" }, tx("about.stance.nativeBody", { link: "" })),
        // No arrow: the outline already says "button", and the French label
        // ("Plantes indigènes, pas nativisme") needs the room at 360 px.
        el("a", { class: "native-callout-link", href: "#/native" }, t("about.stance.nativeLink")),
      ]),
    ]),

    moreToExplore()
  );

  listSpots()
    .then((spots) => {
      if (!spots.length || !savedSection.isConnected) return;
      savedSection.style.display = "";
      savedSection.style.marginTop = "1rem";
      savedSection.append(
        el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("saved") },
          tn("welcome.openSaved", spots.length))
      );
    })
    .catch(() => {});
}

/**
 * The rest of the app, one row each: a picture, a name, one line. Below the
 * pitch so the start button stays the only call to action above the fold; each
 * row is a link to the page that has the depth.
 */
function moreToExplore(): HTMLElement {
  const way = (href: string, thumb: HTMLElement, title: string, line: string) =>
    el("a", { class: "card welcome-way", href }, [
      thumb,
      el("span", { class: "welcome-way-text" }, [
        el("strong", {}, title),
        el("span", {}, line),
      ]),
    ]);
  const thumbAttrs = { attrs: { class: "plant-photo welcome-way-thumb" } };
  const map = el("span", { class: "plant-photo welcome-way-thumb welcome-way-map", "aria-hidden": "true" }, [
    el("img", { src: `${import.meta.env.BASE_URL}maps/pnw.svg`, alt: "", loading: "lazy" }),
  ]);
  return el("section", { class: "welcome-more" }, [
    el("h3", {}, t("welcome.moreTitle")),
    el("div", { class: "welcome-ways" }, [
      way("#/wildlife", wildlifeThumb("monarch", "butterfly", { px: 56, attrs: { class: "wildlife-photo welcome-way-thumb" } }),
        t("welcome.way.wildlife"), t("welcome.way.wildlifeLine")),
      way("#/invasives", invasiveThumb("buddleja-davidii", "shrub", thumbAttrs),
        t("welcome.way.invasives"), t("welcome.way.invasivesLine")),
      way("#/lookalikes", lookalikeThumb("pyrus-calleryana", "tree", thumbAttrs),
        t("welcome.way.lookalikes"), t("welcome.way.lookalikesLine")),
      way("#/planting", plantThumb("quercus-alba", "tree", thumbAttrs),
        t("welcome.way.planting"), t("welcome.way.plantingLine")),
      way("#/regions", map,
        tn("welcome.way.regions", REGIONS.length), t("welcome.way.regionsLine")),
    ]),
  ]);
}
