// "On this page" — a list of a long page's own headings, beside its prose.
//
// About, Privacy & safety and Where our numbers come from are each a dozen
// sections of plain prose. On a laptop they were a 34rem ribbon down the middle
// of the window, and the only way to find "Children" was to scroll for it. The
// spare width now holds the page's contents: every section heading, one tap
// from its section, with the one being read marked as you go.
//
// Laptop only. The stylesheet hides the list below the breakpoint, so a phone
// keeps the page exactly as it was — a list of twelve links above the prose
// would just be twelve more rows to scroll past.
import { el } from "../ui";
import { t } from "../lib/i18n";

/**
 * Wrap an article's children in a body column and put its contents beside it.
 * Headings without an id get one, so every entry has somewhere to go.
 */
export function withContents(article: HTMLElement, prefix: string): HTMLElement {
  const body = el("div", { class: "doc-body" }, [...article.childNodes]);
  const headings = [...body.querySelectorAll<HTMLElement>(":scope > h3")];
  headings.forEach((h, i) => {
    if (!h.id) h.id = `${prefix}-${i + 1}`;
  });

  const links = headings.map((h) =>
    el("a", {
      href: `#${h.id}`,
      // The app routes on the hash, so a bare `#id` would be read as a page
      // address. Scroll there ourselves instead, and move focus with the eye.
      onClick: (e: Event) => {
        e.preventDefault();
        h.scrollIntoView({ block: "start" });
        h.setAttribute("tabindex", "-1");
        h.focus({ preventScroll: true });
      },
    }, h.textContent ?? "")
  );

  const nav = el("nav", { class: "doc-contents", "aria-label": t("doc.contents") }, [
    el("p", { class: "doc-contents-title" }, t("doc.contents")),
    el("ul", {}, links.map((a) => el("li", {}, a))),
  ]);

  // Mark the section being read: the last heading that has passed under the
  // header. Recomputed on scroll, which is cheap — a dozen rectangles.
  const mark = (): void => {
    if (!nav.isConnected) {
      window.removeEventListener("scroll", mark);
      return;
    }
    let current = -1;
    headings.forEach((h, i) => {
      if (h.getBoundingClientRect().top < 120) current = i;
    });
    links.forEach((a, i) => {
      if (i === current) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", mark, { passive: true });
  requestAnimationFrame(mark);

  article.classList.add("has-contents");
  article.append(nav, body);
  return article;
}
