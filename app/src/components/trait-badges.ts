// The row of labels under a plant's name. On the plant's own page each one is a
// link to what it means (`#/traits/<id>`); on a card in the ranked list the
// whole card is already one link, so there they stay plain.
import { el } from "../ui";
import { t } from "../lib/i18n";
import { keystoneIcon } from "./keystone-icon";
import { traitHref, traitsFor, type Trait } from "../lib/traits";
import type { Plant } from "../types";

export function traitBadge(tr: Trait, link: boolean): HTMLElement {
  const body = tr.id === "essential" ? [keystoneIcon(), " " + t(tr.label)] : [t(tr.label)];
  return link
    ? el("a", { class: `badge badge-link ${tr.tone}`, href: traitHref(tr.id) }, body)
    : el("span", { class: `badge ${tr.tone}`, title: t(tr.meaning) }, body);
}

export function traitBadges(p: Plant, link: boolean): HTMLElement {
  return el("div", { class: "plant-badges" }, traitsFor(p).map((tr) => traitBadge(tr, link)));
}
