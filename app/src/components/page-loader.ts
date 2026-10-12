// What a page shows while it waits for its data.
//
// A plant's page empties `main` and then fetches its region's plant list; on a
// slow connection that left a blank page that looked broken (issue #187). The
// router now puts this in the gap, and takes it out the moment the page draws.
//
// The picture is a seedling growing: a stem rises out of the soil, two leaves
// unfurl, a coneflower opens, and it folds back down to start again. All of it
// is CSS (`.grow-*` in styles.css). The boot screen in `index.html` draws the
// same plant, so the first load and every load after it look alike — keep the
// two copies of `SEEDLING` in step.
import { el } from "../ui";
import { t } from "../lib/i18n";

/** The growing seedling, drawn on a 64×64 grid. Static markup, no input. */
export const SEEDLING = `<svg class="grow" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <path class="grow-soil" d="M14 57c5-4 31-4 36 0z"/>
  <g class="grow-plant">
    <path class="grow-stem" pathLength="1" d="M32 56c1-9-2-17 0-29"/>
    <path class="grow-leaf grow-leaf-l" d="M31.5 44c-4-6-11-7-15-4 4 5 11 6 15 4z"/>
    <path class="grow-leaf grow-leaf-r" d="M32 37c3-6 10-8 15-5-4 5-11 7-15 5z"/>
    <g class="grow-bloom">
      <ellipse cx="32" cy="17" rx="2.6" ry="6"/>
      <ellipse cx="32" cy="17" rx="2.6" ry="6" transform="rotate(60 32 23)"/>
      <ellipse cx="32" cy="17" rx="2.6" ry="6" transform="rotate(120 32 23)"/>
      <ellipse cx="32" cy="17" rx="2.6" ry="6" transform="rotate(180 32 23)"/>
      <ellipse cx="32" cy="17" rx="2.6" ry="6" transform="rotate(240 32 23)"/>
      <ellipse cx="32" cy="17" rx="2.6" ry="6" transform="rotate(300 32 23)"/>
      <circle class="grow-heart" cx="32" cy="23" r="3.6"/>
    </g>
  </g>
</svg>`;

function loader(): HTMLElement {
  const art = el("div", { class: "boot-sprout" });
  art.innerHTML = SEEDLING;
  return el("div", { class: "boot-loader page-loader", role: "status" }, [
    art,
    el("p", { class: "boot-line" }, t("loader.loading")),
    el("p", { class: "boot-line boot-late" }, t("loader.late")),
    el("p", { class: "boot-line boot-later" }, t("loader.later")),
  ]);
}

/**
 * Show the seedling in `main` for as long as it's empty, and no longer.
 *
 * Called once a page's render has started and handed back a promise. A page
 * that drew before its first await has children already and gets nothing.
 * Otherwise the loader goes in — it fades in late enough that a fast load never
 * shows it — and the first thing the page adds takes it out again. Returns the
 * cleanup for when the render settles, drawn or not.
 */
export function holdWithLoader(main: HTMLElement): () => void {
  if (main.childElementCount > 0) return () => {};
  const node = loader();
  main.append(node);
  const watch = new MutationObserver((records) => {
    if (records.some((r) => [...r.addedNodes].some((n) => n !== node))) done();
  });
  watch.observe(main, { childList: true });
  function done(): void {
    watch.disconnect();
    node.remove();
  }
  return done;
}
