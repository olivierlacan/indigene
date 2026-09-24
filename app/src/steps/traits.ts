// "Plant traits" (route `#/traits`) — what the labels and figures on a plant's
// page mean, all on one page.
//
// The labels under a plant's name are a word or two ("No watering", "Thorny"),
// short enough to sit beside its photograph on a phone. Each one links here,
// to `#/traits/<id>`, which opens this page at that label's definition — the
// same param-as-scroll-position idea as `#/privacy/<section>`.
//
// The figures section reuses the sentences the stat tiles' dialogs already
// carry, so there is one explanation per figure to write and translate, not two.
import { el, clear } from "../ui";
import { t } from "../lib/i18n";
import { temperatureSpan } from "../lib/units";
import { TRAIT_GROUPS, traitById } from "../lib/traits";
import { traitBadge } from "../components/trait-badges";
import type { TKey } from "../locales/en";

const FIGURES: { id: string; icon: string; label: TKey; explain: () => string }[] = [
  { id: "sun", icon: "☀️", label: "stat.sun.label", explain: () => t("stat.sun.explain") },
  { id: "moisture", icon: "💧", label: "stat.moisture.label", explain: () => t("stat.moisture.explain") },
  { id: "zones", icon: "❄️", label: "stat.zones.label", explain: () => t("stat.zones.explain", { step: temperatureSpan(10) }) },
  { id: "ph", icon: "🧪", label: "stat.ph.label", explain: () => t("stat.ph.explain") },
  { id: "size", icon: "📏", label: "stat.size.label", explain: () => t("stat.size.explain") },
  { id: "hosts", icon: "🐛", label: "stat.host.label", explain: () => t("stat.host.explain") },
  { id: "bloom", icon: "🌸", label: "stat.bloom.label", explain: () => t("stat.bloom.explain") },
];

const domId = (id: string): string => `trait-${id}`;

export function renderTraits(main: HTMLElement, param?: string): void {
  clear(main);
  document.title = t("traits.docTitle");

  main.append(
    el("article", { class: "traits-page" }, [
      el("h2", { class: "step-title" }, t("traits.title")),
      el("p", { class: "step-lede" }, t("traits.lede")),
      ...TRAIT_GROUPS.map((g) =>
        el("section", { class: "card traits-group" }, [
          el("h3", {}, t(g.title)),
          el("dl", { class: "traits-list" }, g.traits.flatMap((tr) => [
            el("dt", { id: domId(tr.id) }, [traitBadge(tr, false)]),
            el("dd", {}, t(tr.meaning)),
          ])),
        ])
      ),
      el("section", { class: "card traits-group" }, [
        el("h3", {}, t("traits.group.figures")),
        el("dl", { class: "traits-list" }, FIGURES.flatMap((f) => [
          el("dt", { id: domId(f.id), class: "traits-figure" }, [
            el("span", { "aria-hidden": "true" }, `${f.icon} `),
            t(f.label),
          ]),
          el("dd", {}, f.explain()),
        ])),
      ]),
    ])
  );

  revealTrait(param);
}

/**
 * Open the page at the definition a label linked to. Scrolls only when it
 * isn't already on screen, then moves focus there — the same reveal
 * `#/privacy/<section>` uses. An unknown id is still this page, from the top.
 */
function revealTrait(param?: string): void {
  if (!param || !(traitById(param) || FIGURES.some((f) => f.id === param))) return;
  requestAnimationFrame(() => {
    const target = document.getElementById(domId(param));
    if (!target) return;
    const header = document.querySelector(".app-header")?.getBoundingClientRect().height ?? 0;
    const box = target.getBoundingClientRect();
    if (box.top < header || box.bottom > window.innerHeight) target.scrollIntoView({ block: "center" });
    target.classList.add("is-linked");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
}
