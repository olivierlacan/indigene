// Which addresses are pages, and what each one's canonical URL is.
//
// This is the one list, and it has three readers who used to keep their own:
//
//   - `main.ts` routes on it and puts the canonical form in the address bar;
//   - `scripts/prerender.mjs` writes a real file for every page in it;
//   - `scripts/check-routes.mjs` fails CI when those two disagree.
//
// They have to agree, because disagreeing breaks a link in a way nobody sees
// until a stranger clicks one. If the app canonicalizes `…/wildlife/monarch`
// into the address bar and no file was written there, the reader who copies it
// out sends a link that answers 404 and previews as the generic site card —
// which is the whole problem the prerenderer exists to solve. And if a file is
// written for a page the app never canonicalizes to, the file is dead weight:
// nothing hands that address out, so nothing ever fetches it.
//
// Nothing here touches the DOM, so a Node script can import it. That's the
// point: the check reads the same function the browser does, rather than a
// second copy of the rules that can quietly fall behind.
import { REGIONS, loadPlants } from "./plants";
import { getWildlife, wildlifeKindRoute, KIND_ORDER, KIND_SLUGS } from "./wildlife";
import { getLookalike, lookalikeIndex } from "./lookalikes";
import { WILDLIFE } from "../data/wildlife";

/**
 * Every step the router knows, in no particular order.
 *
 * `main.ts` types its `STEPS` table as a `Record` over this union, so a step
 * added there without being added here doesn't compile — which is what makes
 * this list safe for `check-routes.mjs` to compare against `public/404.html`'s
 * own `ROUTES`. That file has to bounce any path it doesn't have a file for
 * into the equivalent hash route, and a step missing from *its* list is served
 * "we couldn't find that page" instead. It had drifted four steps behind.
 */
export const APP_STEPS = [
  "",
  "location",
  "sun",
  "scan",
  "confirm",
  "priorities",
  "results",
  "saved",
  "browse",
  "plants",
  "regions",
  "wildlife",
  "lookalikes",
  "privacy",
  "sources",
  "settings",
  "about",
] as const;

export type AppStep = (typeof APP_STEPS)[number];

/** Steps that take a `<step>/<param>` second segment. */
export const PARAM_STEPS = new Set<string>([
  "plants",
  "regions",
  "wildlife",
  "lookalikes",
  "settings",
  "privacy",
]);

/** The index pages that are shareable in their own right. `settings` is absent
 *  on purpose — it's the one screen with no address worth sending. */
export const SHAREABLE_INDEXES: readonly string[] = [
  "plants",
  "regions",
  "browse",
  "wildlife",
  "lookalikes",
  "privacy",
  "sources",
  "about",
];

const STEP_SET = new Set<string>(APP_STEPS);

/** Is this one of the router's steps? */
export function isAppStep(s: string): s is AppStep {
  return STEP_SET.has(s);
}

/**
 * Split an address into the step and its param.
 *
 * Takes the route with no leading `#/` or base, so it reads the two forms
 * identically: `plants/quercus-alba` off the path, and the same string off the
 * hash. Anything the router doesn't know falls back to the welcome step, which
 * is why a mistyped hash shows the home page rather than an error.
 *
 * Shared with `scripts/check-routes.mjs`, which round-trips every prerendered
 * address back through this and `canonicalPath` to prove the app would hand out
 * exactly the address a file was written for.
 */
export function parseRoute(raw: string): { step: AppStep; param?: string } {
  const [head, ...rest] = raw.split("/");
  if (isAppStep(head) && PARAM_STEPS.has(head) && rest.length) {
    return { step: head, param: decodeURIComponent(rest.join("/")) };
  }
  return { step: isAppStep(head) ? head : "" };
}

/**
 * The canonical address of a route, when it has one: the real path that
 * `scripts/prerender.mjs` writes a file for, or null.
 *
 * Only those pages can be previewed. An unfurler — Slack, iMessage, Facebook —
 * is a plain HTTP fetch, and a `#…` fragment is *never sent to a server*: ask
 * for `…/#/plants/asclepias-tuberosa` and the server is asked for `/`, so the
 * card that comes back describes the site, whatever the link led to. The path
 * form is a real document with the plant's own title and words in its head.
 *
 * Everything else returns null deliberately. The flow steps have no file (they
 * mean nothing without the draft held in memory), and neither do the
 * sub-routes — `#/wildlife/in/<region>`, `#/settings/units`,
 * `#/privacy/lookups` — which are a filter or a scroll position on a page
 * rather than a page. Null leaves those in the hash form, which is right: it's
 * the only address that reloads them.
 *
 * The identifier is checked against the real catalog every time rather than
 * assumed, so a mistyped or retired slug can never be canonicalized into an
 * address with nothing behind it.
 */
export function canonicalPath(step: string, param?: string): string | null {
  if (!param) return SHAREABLE_INDEXES.includes(step) ? step : null;
  const at = (id: string): string => `${step}/${encodeURIComponent(id)}`;
  switch (step) {
    case "plants":
      return plantIds().has(param) ? at(param) : null;
    case "regions":
      return REGIONS.some((r) => r.meta.id === param) ? at(param) : null;
    // Both an animal (`…/wildlife/monarch`) and a group (`…/wildlife/bees`).
    case "wildlife":
      return getWildlife(param) || wildlifeKindRoute(param) ? at(param) : null;
    case "lookalikes":
      return getLookalike(param) ? at(param) : null;
    default:
      return null;
  }
}

/**
 * Is this hash the app's *route*, or a fragment naming a place on the page
 * already being shown?
 *
 * Every route this app has begins `#/` — that is what `main.ts` writes, what
 * `public/404.html` bounces to, and what every link in the app carries. So a
 * hash without the slash is not a route at all: `…/plants/quercus-alba#spot` is
 * the oak's page, opened at the spot checker, and reading `spot` as a step name
 * would land the reader on the welcome screen instead.
 *
 * `#` alone is the empty fragment, which is likewise not a route — a URL that
 * merely ends in a `#` still means the page its path names.
 */
export function isHashRoute(hash: string): boolean {
  return hash.startsWith("#/");
}

/**
 * The address of one section of a plant's page: a fragment on the plant's own
 * canonical path — `/plants/lupinus-polyphyllus#nearby`.
 *
 * This was `#/plants/<slug>/nearby` — a *route* — and that was wrong for the
 * one thing these links exist to do, which is be sent to somebody. An
 * unfurler (Slack, iMessage, Facebook) is a plain HTTP fetch, and a fragment is
 * never sent to a server. Ask for `…/#/plants/<slug>/nearby` and the server is
 * asked for `/`, so the card that comes back describes the site, whatever the
 * link led to — the exact failure `canonicalPath` above exists to prevent. Ask
 * for `…/plants/<slug>#nearby` and the server is asked for `/plants/<slug>`,
 * which `scripts/prerender.mjs` wrote a real file for: the plant's own title,
 * words and picture. The fragment rides along to the browser untouched, and the
 * card the reader gets is the plant's.
 *
 * So the two halves of the address now each do what they're for. The path is
 * the page, and it previews. The fragment is the place on it, and it is
 * deliberately *not* a route — `isHashRoute` above is how `main.ts` tells them
 * apart, and `canonicalPath` still returns null for a section because a section
 * is not a page and never gets a file of its own.
 *
 * Lives here rather than in `steps/plant.ts` so that the components drawing
 * these links — one of which the plant page itself imports — don't have to
 * import the page back.
 */
export function plantSectionHref(section: string): string {
  return `#${section}`;
}

/**
 * Every plant slug in the catalog.
 *
 * A species native to more than one covered region (live oak spans both Florida
 * lists) has one slug and one page, so this is a set rather than a count. Built
 * once on first use: `loadPlants` walks every region's roster, and the router
 * asks this question on every navigation.
 */
let _plantIds: Set<string> | null = null;
function plantIds(): Set<string> {
  if (!_plantIds) {
    _plantIds = new Set<string>();
    for (const region of REGIONS) for (const p of loadPlants(region)) _plantIds.add(p.id);
  }
  return _plantIds;
}

/**
 * Every canonical path, in the order the prerenderer writes them.
 *
 * This is the list `scripts/prerender.mjs` must produce a file for and
 * `scripts/check-routes.mjs` verifies it did. It is deliberately generated from
 * the catalogs rather than written out, so adding a region — or one plant to
 * one region — extends the shareable set with no second place to remember.
 */
export function shareablePaths(): string[] {
  const paths = [...SHAREABLE_INDEXES];
  for (const region of REGIONS) paths.push(`regions/${region.meta.id}`);
  for (const id of plantIds()) paths.push(`plants/${id}`);
  for (const w of WILDLIFE) paths.push(`wildlife/${w.id}`);
  for (const kind of KIND_ORDER) paths.push(`wildlife/${KIND_SLUGS[kind]}`);
  for (const row of lookalikeIndex()) paths.push(`lookalikes/${row.lookalike.id}`);
  return paths;
}
