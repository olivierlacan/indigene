// The one line a plant's page shows when we've chosen its name on purpose.
// The table and the reasoning live in `data/name-choices.ts`.
import { NAME_CHOICES } from "../data/name-choices";
import { el } from "../ui";
import { t } from "./i18n";

/** A short note saying why this plant goes by the name it does here, or null
 *  when there's nothing to say (no choice made, or none in this language). */
export function nameChoiceNote(latin: string): HTMLElement | null {
  const choice = NAME_CHOICES[latin];
  if (!choice) return null;
  const text = t(`names.choice.${choice.reason}` as const, { also: choice.also });
  return text ? el("p", { class: "coords name-note" }, text) : null;
}
