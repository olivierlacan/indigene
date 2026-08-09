// Ways to grow more: the index at `#/planting` and a page per technique at
// `#/planting/<slug>`.
//
// ## Why these left the plant page
//
// A plant's "How to grow more" card lists the methods that work for it, each
// glossed in plain words. That gloss says *what you do* and stops there — and
// the question it provokes is **when**. "Nick the seed coat, then sow" and "sow
// the seed as-is" read like two things you could do on the same afternoon; in
// fact one is the last step before whatever sowing you had planned, and the
// other is a thing you do in October because October is when the seed falls.
// Answering that on every plant page would print the same three paragraphs
// about scarification on the forty pages that mention it, and bury the plant's
// own story underneath. So the timing lives here, once, at an address of its
// own, and the plant page carries a one-line window and a link — the same shape
// the look-alikes took for the same reason.
//
// ## Seasons, not dates
//
// Every window is a season and a cue — pods turning dark, a shoot that snaps
// instead of bending — never a date. Indigene covers ground from the Florida
// Keys to the Alps, where February and April swap places; a date would be wrong
// somewhere, while "when the frond backs turn brown" is true everywhere. The
// index says this out loud rather than hoping it's understood, and says the
// other half too: in a place that never freezes, the fridge isn't a shortcut,
// it's the only version of cold stratification there is.
//
// ## The reading list
//
// The index's second half names the resources the how-to comes from, with links
// out. Every propagation note in the catalog cites one or more of them, but a
// citation under a plant is a footnote; someone who wants to *learn to
// propagate* is better served by being handed the libraries themselves — all
// free, most of them public institutions.
import { el, clear } from "../ui";
import { navigate } from "../state";
import {
  PLANTING_SOURCES,
  SEASONS,
  TECHNIQUES,
  currentSeason,
  plantsUsing,
  techniqueBySlug,
  techniqueHref,
  techniquesInSeason,
} from "../lib/planting";
import type { PlantingSource, Season, Technique, TechniqueFrom } from "../lib/planting";
import { propagationMethod, SOURCES_ROUTE } from "../lib/plain";
import { t, tn, tx, fmtNumber } from "../lib/i18n";
import { commonName } from "../lib/names";

/** The index's address. One place knows the URL shape. */
const INDEX_HREF = "#/planting";

/** How many plants a technique page names before it says "and N more" — enough
 *  to show the technique isn't theoretical, few enough that the list doesn't
 *  push the sources off the bottom of a phone. */
const PLANTS_SHOWN = 12;

const seasonName = (s: Season): string => t(`planting.season.${s}` as const);
/** The same word mid-sentence ("open in autumn"), which French capitalizes
 *  differently from a heading and English doesn't capitalize at all. */
const seasonInline = (s: Season): string => t(`planting.seasonIn.${s}` as const);

/**
 * The year as four cells, with this technique's window lit up and today's
 * season ringed.
 *
 * Decorative on purpose: `aria-hidden`, because the `when` line right beside it
 * says the same thing in words, and a screen reader that read out
 * "Spring Summer Autumn Winter" with no way to convey which are shaded would be
 * giving out noise rather than the answer.
 */
function seasonStrip(tech: Technique): HTMLElement {
  const now = currentSeason();
  return el("ol", { class: "season-strip", "aria-hidden": "true" },
    SEASONS.map((s) => {
      const on = tech.anyTime || tech.seasons.includes(s);
      return el("li", {
        class: `season-cell${on ? " is-on" : ""}${s === now ? " is-now" : ""}`,
      }, seasonName(s));
    })
  );
}

/** The window and the wait, as two labelled chips — the two facts someone
 *  scanning for "can I do this today, and what am I signing up for" wants. */
function timingChips(tech: Technique): HTMLElement {
  const g = propagationMethod(tech.method);
  return el("dl", { class: "timing-chips" }, [
    el("dt", {}, t("planting.whenLabel")),
    el("dd", {}, g.when),
    el("dt", {}, t("planting.waitLabel")),
    el("dd", {}, g.wait),
  ]);
}

// ---------------------------------------------------------------------------
// #/planting — the index
// ---------------------------------------------------------------------------

/** One technique as a card: what it's called, when its window is, and the year
 *  drawn beside it so a page of them can be scanned by season alone. */
function techniqueCard(tech: Technique): HTMLElement {
  const g = propagationMethod(tech.method);
  return el("article", { class: "technique-card" }, [
    el("h4", { class: "technique-name" }, [
      el("span", { class: "technique-icon", "aria-hidden": "true" }, tech.icon),
      el("a", { href: techniqueHref(tech) }, g.name),
    ]),
    el("p", { class: "technique-when" }, g.when),
    seasonStrip(tech),
  ]);
}

function techniqueGroup(from: TechniqueFrom): HTMLElement {
  const titleKey = from === "seed" ? "planting.fromSeedTitle" : "planting.fromPlantTitle";
  const ledeKey = from === "seed" ? "planting.fromSeedLede" : "planting.fromPlantLede";
  return el("section", { class: "technique-group" }, [
    el("h3", {}, t(titleKey)),
    el("p", { class: "technique-group-lede" }, t(ledeKey)),
    el("div", { class: "technique-list" },
      TECHNIQUES.filter((tech) => tech.from === from).map(techniqueCard)),
  ]);
}

/**
 * The "right now" card: the techniques whose window is open this season.
 *
 * This is the answer to the question the whole page exists for — someone
 * standing in their garden in October wants to know what October is *for*, not
 * to read fifteen entries and work it out. The season comes from the device
 * clock and the northern hemisphere, which is every region Indigene covers; the
 * note under it says so rather than leaving a southern reader to discover it.
 */
function thisSeasonCard(): HTMLElement {
  const season = currentSeason();
  const open = techniquesInSeason(season);
  return el("section", { class: "card season-now" }, [
    el("h3", {}, t("planting.nowTitle", { season: seasonName(season) })),
    el("p", { class: "season-now-lede" }, t("planting.nowLede", { season: seasonInline(season) })),
    open.length
      ? el("ul", { class: "season-now-list" }, open.map((tech) => {
          const g = propagationMethod(tech.method);
          return el("li", {}, [
            el("span", { class: "technique-icon", "aria-hidden": "true" }, tech.icon),
            el("a", { href: techniqueHref(tech) }, g.name),
            el("span", { class: "season-now-when" }, g.when),
          ]);
        }))
      : el("p", {}, t("planting.nowEmpty")),
  ]);
}

/** The reading list: the resources every propagation note in the app is written
 *  from, each with what it's actually good for and where its coverage is real. */
function sourcesSection(): HTMLElement {
  const row = (src: PlantingSource): HTMLElement =>
    el("li", { class: "score-item" }, [
      el("div", { class: "score-head" }, [
        el("a", { href: src.url, target: "_blank", rel: "noopener" }, `${src.name} ↗`),
        el("span", { class: "badge neutral" }, t(`planting.scope.${src.scope}` as const)),
      ]),
      el("p", { class: "score-why" }, t(`planting.src.${src.key}` as const)),
    ]);

  return el("section", { class: "card planting-sources", id: "sources" }, [
    el("h3", {}, t("planting.sourcesTitle")),
    el("p", {}, t("planting.sourcesLede")),
    el("ul", { class: "score-list" }, PLANTING_SOURCES.map(row)),
    el("p", { class: "confidence", style: "margin-top:0.6rem" },
      tx("planting.sourcesAfter", {
        sources: el("a", { href: SOURCES_ROUTE }, t("planting.sourcesLink")),
      })),
  ]);
}

export function renderPlantingIndex(main: HTMLElement): void {
  clear(main);
  document.title = t("planting.docTitle");

  main.append(
    el("h2", { class: "step-title" }, t("planting.title")),
    el("p", { class: "step-lede" }, t("planting.lede")),
    // What this season is for, and the two things to know before believing any
    // window on the page. One stack on a phone; on a laptop the card takes the
    // left column and the two caveats stand beside it (see `.planting-top` —
    // the wrapper is `display: contents` until then, so this *is* the stack).
    el("div", { class: "planting-top" }, [
      thisSeasonCard(),
      el("div", { class: "planting-caveats" }, [
        el("p", { class: "note info" }, [
          el("strong", {}, t("planting.seasonNoteTitle")),
          t("planting.seasonNote"),
        ]),
        el("p", { class: "note info" }, [
          el("strong", {}, t("planting.frostFreeTitle")),
          t("planting.frostFree"),
        ]),
      ]),
    ]),
    techniqueGroup("seed"),
    techniqueGroup("plant"),
    sourcesSection(),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("planting.browsePlants")),
    ])
  );
}

// ---------------------------------------------------------------------------
// #/planting/<slug> — one technique
// ---------------------------------------------------------------------------

/** The plants in the catalog raised this way — the way back out of a how-to and
 *  into something you could actually go and plant. Capped, with the count told
 *  honestly rather than the list quietly truncated. */
async function usedBySection(tech: Technique): Promise<HTMLElement | null> {
  const rows = await plantsUsing(tech.method);
  if (!rows.length) return null;
  const shown = rows.slice(0, PLANTS_SHOWN);
  const rest = rows.length - shown.length;
  return el("section", { class: "card" }, [
    el("h3", {}, t("planting.usedByTitle")),
    el("p", {}, tn("planting.usedByLede", rows.length, { n: fmtNumber(rows.length) })),
    el("p", { class: "technique-plants" },
      shown.flatMap((row, i) => [
        i > 0 ? " · " : null,
        el("a", { href: `#/plants/${row.plant.id}` }, commonName(row.plant)),
      ]).concat(rest > 0 ? [" · ", t("planting.usedByMore", { n: fmtNumber(rest) })] : [])),
  ]);
}

/** The other techniques whose window is open right now — the same nudge the
 *  index leads with, offered to someone who arrived on one page from a plant. */
function alsoOpenSection(tech: Technique): HTMLElement | null {
  const season = currentSeason();
  const others = techniquesInSeason(season).filter((o) => o.slug !== tech.slug);
  if (!others.length) return null;
  return el("section", { class: "card" }, [
    el("h3", {}, t("planting.otherInSeason", { season: seasonInline(season) })),
    el("ul", { class: "season-now-list" }, others.map((o) => {
      const g = propagationMethod(o.method);
      return el("li", {}, [
        el("span", { class: "technique-icon", "aria-hidden": "true" }, o.icon),
        el("a", { href: techniqueHref(o) }, g.name),
        el("span", { class: "season-now-when" }, g.when),
      ]);
    })),
  ]);
}

async function renderTechnique(main: HTMLElement, tech: Technique): Promise<void> {
  clear(main);
  const g = propagationMethod(tech.method);
  document.title = t("planting.techniqueDocTitle", { name: g.name });

  main.append(
    el("p", { class: "back-trail" }, [el("a", { href: INDEX_HREF }, t("planting.backToIndex"))]),
    el("h2", { class: "step-title" }, [
      el("span", { "aria-hidden": "true" }, `${tech.icon} `),
      g.name,
    ]),
    el("section", { class: "card technique-timing" }, [
      // The strip and its footnote travel together: on a laptop they take the
      // left of the card and the two chips sit beside them. `.technique-season`
      // is `display: contents` below that width, so on a phone this is exactly
      // the stack it always was.
      el("div", { class: "technique-season" }, [
        seasonStrip(tech),
        tech.anyTime ? el("p", { class: "technique-anyseason" }, t("planting.anySeason")) : null,
      ]),
      timingChips(tech),
    ]),
    // Two columns on a laptop, one stack below it — same wrapper trick, and the
    // same rule as a plant's page: read down the left and then the right and you
    // get the phone's order, unchanged. The split falls where the subject
    // changes: the left column is the technique itself — what you do, when, and
    // where it goes wrong — and the right is where to go next with it.
    el("div", { class: "planting-cols" }, [
      el("div", { class: "planting-col" }, [
        el("section", { class: "card" }, [
          el("h3", {}, t("planting.howTitle")),
          el("p", {}, g.plain),
        ]),
        el("section", { class: "card" }, [
          el("h3", {}, t("planting.timingTitle")),
          el("p", {}, g.timing),
          // The one technique the app's warmest region cannot do outdoors at all.
          tech.method === "seed-cold-moist"
            ? el("p", { class: "note info", style: "margin-bottom:0" }, [
                el("strong", {}, t("planting.frostFreeTitle")),
                t("planting.frostFree"),
              ])
            : null,
        ]),
        el("section", { class: "card" }, [
          el("h3", {}, t("planting.mistakeTitle")),
          el("p", { class: "note warn", style: "margin-bottom:0" }, g.mistake),
        ]),
      ]),
      el("div", { class: "planting-col" }, [
        await usedBySection(tech),
        alsoOpenSection(tech),
      ]),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("planting") }, t("planting.allTechniques")),
    ])
  );
}

function renderNotFound(main: HTMLElement, slug: string): void {
  clear(main);
  document.title = t("planting.notFoundTitle");
  main.append(
    el("h2", { class: "step-title" }, t("planting.notFoundTitle")),
    el("p", { class: "step-lede" }, t("planting.notFoundLede", { slug })),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("planting") }, t("planting.allTechniques")),
    ])
  );
}

/** The `#/planting/<slug>` route. A param that isn't a technique says so
 *  plainly rather than falling back to the index, which would leave a stale or
 *  mistyped link looking like it worked. */
export async function renderPlanting(main: HTMLElement, param?: string): Promise<void> {
  if (!param) return renderPlantingIndex(main);
  const tech = techniqueBySlug(param);
  return tech ? renderTechnique(main, tech) : renderNotFound(main, param);
}
