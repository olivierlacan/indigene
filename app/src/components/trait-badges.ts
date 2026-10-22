// The row of labels under a plant's name. On the plant's own page each one is a
// link to what it means (`#/traits/<id>`); on a card in the ranked list the
// whole card is already one link, so there they stay plain.
import { el } from "../ui";
import { t } from "../lib/i18n";
import { keystoneIcon } from "./keystone-icon";
import { withTip } from "./badge-tip";
import { traitHref, traitsFor, type Trait, type TraitId } from "../lib/traits";
import type { Plant } from "../types";

export function traitBadge(tr: Trait, link: boolean): HTMLElement {
  const body = tr.id === "essential" ? [keystoneIcon(), " " + t(tr.label)] : [t(tr.label)];
  return link
    ? el("a", { class: `badge badge-link ${tr.tone}`, href: traitHref(tr.id) }, body)
    // On a card the whole card is a link, so the label explains itself in a
    // small note instead (hover, or a tap), with the full meaning one tap on.
    : withTip(el("button", { type: "button", class: `badge badge-tip-btn ${tr.tone}` }, body),
        t(tr.meaning), { href: traitHref(tr.id), label: t("traits.moreLink") });
}

/** `regionId` adds the labels that are a claim about one region's conditions —
 *  today just "Pavement pioneer". Omitted, they're left off. `except` drops
 *  labels the page says elsewhere (the plant page's garden checks). */
export function traitBadges(p: Plant, link: boolean, regionId?: string, except?: ReadonlySet<TraitId>): HTMLElement {
  return el("div", { class: "plant-badges" }, traitsFor(p, regionId)
    .filter((tr) => !except?.has(tr.id))
    .map((tr) => traitBadge(tr, link)));
}
