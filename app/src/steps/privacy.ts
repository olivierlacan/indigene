// The Privacy & safety page (route `#/privacy`). One plain-language place that
// says, honestly and in full, how Indigene treats the people who use it —
// written to be reassuring and legible to everyone, including kids and the
// grandparents who might be looking over their shoulder.
//
// It documents real behavior, not aspiration: no account, no tracking, saved
// spots that never leave the device, location used only on an explicit tap, and
// the exact list of public science services the browser talks to directly. The
// app links here from every point that might give a thoughtful person pause
// (see `components/privacy-link.ts`).
import { el, clear } from "../ui";
import { navigate } from "../state";
import { DATA_SOURCES_URL, ISSUES_URL } from "../lib/plain";

const REPO_URL = "https://github.com/olivierlacan/indigene";

/** One "who your browser talks to" row: the service, what it's for, what's sent. */
function service(name: string, forWhat: string, sent: string): HTMLElement {
  return el("li", {}, [
    el("strong", {}, name),
    ` — ${forWhat} `,
    el("span", { style: "color:var(--ink-soft)" }, `(it's sent ${sent}).`),
  ]);
}

export function renderPrivacy(main: HTMLElement): void {
  clear(main);
  document.title = "Privacy & safety — Indigene";

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, "Privacy & safety"),
      el("p", { class: "step-lede" },
        "Indigene is built to be safe and respectful for everyone who uses it — including children. Here's the whole story in plain words: what we ask for, what we never do, and where anything you share actually goes."),

      // The short version, up top, for anyone who won't read the rest.
      el("div", { class: "note info lede-note" }, [
        el("strong", {}, "The short version. "),
        el("ul", {}, [
          el("li", {}, "No account, no sign-up, no password — nothing that identifies you."),
          el("li", {}, "No ads. No tracking. No analytics watching what you tap. Nothing about you is sold or shared."),
          el("li", {}, "Your saved spots stay on your device. There's no Indigene server for them to go to."),
          el("li", {}, "You never have to share your exact location — a ZIP code or town works everywhere it's used."),
          el("li", {}, "It's open source: anyone can read exactly what it does."),
        ]),
      ]),

      el("h3", {}, "Your location: only when you ask"),
      el("p", {},
        "Indigene asks for your location only when you tap a button for it — to work out which region you're in, look up your soil, climate, and sun, and find real plant and wildlife sightings nearby. It never reads your location in the background, and never when the app is closed."),
      el("p", {}, [
        "And you're never required to share it. Everywhere the app can use a location, you can instead type a ",
        el("strong", {}, "ZIP code or town"),
        ", or just pick your region from a list. Sharing precise location is always your choice, never the price of using Indigene.",
      ]),
      el("p", {},
        "When you do share a spot, your device sends that coordinate straight to the specific public-science services that answer each question — and nowhere else. There's no Indigene server in the middle keeping a log of where you've been, because there's no Indigene server at all. The whole app runs in your browser."),

      el("h3", {}, "Where your location goes, and what for"),
      el("p", {},
        "So you can see exactly what happens: when a lookup needs your spot, your browser talks directly to these public services. Each sees only that one lookup, gets no name or account (there isn't one), and has its own privacy policy for that request."),
      el("ul", { class: "who-list" }, [
        service("iNaturalist", "photos of plants and animals seen near there", "a coordinate or a map area, plus the species being looked up"),
        service("Open-Meteo", "your climate — rainfall and how cold winters get; and turning a ZIP/town into a point on the map", "a coordinate, or the place name you typed"),
        service("OpenStreetMap", "the name of the nearest town (shown instead of raw numbers), and the map picture", "a coordinate"),
        service("SoilGrids (ISRIC)", "your soil type and acidity", "a coordinate"),
        service("USGS", "your elevation and slope", "a coordinate"),
        service("US EPA", "the name of your ecoregion", "a coordinate"),
      ]),
      el("p", {}, [
        "These are reputable public institutions — universities, government agencies, and a nonprofit naturalist community — not advertisers. On purpose, none of these lookups need your street address: a town, ZIP, or a coarse grid is all the science uses. The full technical list, with links and licences, is in ",
        el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, "our public data-sources document"),
        ".",
      ]),

      el("h3", {}, "Saved locations stay on your device"),
      el("p", {}, [
        "When you tap ",
        el("strong", {}, "Save this spot"),
        ", it's kept in your browser's own storage, on that device only. It never leaves your device, never reaches a server (there is none), and we can never see it. It's yours: open or delete a saved spot anytime from the Saved menu, and clearing your browser's data for this site erases them for good.",
      ]),

      el("h3", {}, "No account, no tracking, no ads"),
      el("ul", {}, [
        el("li", {}, "No sign-up, email, or password — we never ask who you are."),
        el("li", {}, "No advertising, and nothing sold or shared. We hold no data about you to sell in the first place."),
        el("li", {}, "No analytics and no tracking cookies following what you do. The only things stored are your saved spots and a few settings — on your device, for you."),
      ]),

      el("h3", {}, "Made for everyone, including children"),
      el("ul", {}, [
        el("li", {}, "Plain language throughout — every gardening or science term is explained in words anyone can act on."),
        el("li", {}, "Nothing to buy. There are no purchases or in-app payments of any kind."),
        el("li", {}, "No chat, comments, messaging, or social features — so there's no way for a stranger to contact anyone through Indigene."),
        el("li", {}, "We collect no personal information from anyone, of any age."),
        el("li", {}, "The photos are research-grade community records from iNaturalist — verified pictures of plants and wildlife — always shown with credit to the person who took them. Links out go to trusted science and nature organizations."),
      ]),

      el("h3", {}, "You don't have to take our word for it"),
      el("p", {}, [
        "Indigene is open source under the MIT licence. The entire app — every line, and every network request it can make — is public. If you want to verify anything on this page, you can read the code yourself: ",
        el("a", { href: REPO_URL, target: "_blank", rel: "noopener" }, "Indigene on GitHub"),
        ".",
      ]),

      el("h3", {}, "Questions or concerns"),
      el("p", {}, [
        "If anything here is unclear, or you think we can do better for safety or privacy, please tell us — ",
        el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, "open an issue on GitHub"),
        ". Because the app is open source, the code is always the final, honest word on what it does.",
      ]),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "← Home"),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, "Find plants for my spot"),
      ]),
    ]),
  );
}
