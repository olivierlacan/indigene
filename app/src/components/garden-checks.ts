// A plant page's answers to the list filters, as a short spec sheet: one row
// per filter, each answered yes or no (`gardenChecks` in lib/traits.ts). Each
// row links to what its label means on the traits page.
import { el } from "../ui";
import { t } from "../lib/i18n";
import { gardenChecks, traitHref } from "../lib/traits";
import type { Plant } from "../types";

export function gardenChecksList(p: Plant): HTMLElement {
  return el("section", { class: "garden-checks", "aria-labelledby": "garden-checks-title" }, [
    el("h3", { id: "garden-checks-title", class: "garden-checks-title" }, t("check.title")),
    el("ul", {}, gardenChecks(p).map((c) =>
      el("li", {}, [
        el("a", { class: "garden-check", href: traitHref(c.trait) }, [
          el("span", { class: "garden-check-k" }, [el("span", { "aria-hidden": "true" }, `${c.icon} `), t(c.label)]),
          el("span", { class: c.caution ? "garden-check-v is-caution" : "garden-check-v" }, t(c.value)),
        ]),
      ]))),
  ]);
}
