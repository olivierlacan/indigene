// Settings → Spooky theme: the one switch for the Halloween theme
// (`lib/halloween.ts`). On by default from 17 to 31 October, opt-in the rest
// of the year.
import { el, clear, toast } from "../ui";
import { t } from "../lib/i18n";
import { halloweenOn, setHalloween } from "../lib/halloween";

export function halloweenCard(): HTMLElement {
  const card = el("div", { class: "card" });
  fill();
  return card;

  function fill(): void {
    clear(card);
    const on = halloweenOn();
    const choice = (value: boolean, title: string, sub: string) =>
      el("button", {
        class: "choice",
        "aria-pressed": on === value ? "true" : "false",
        onClick: () => choose(value),
      }, [
        el("span", { class: "choice-title" }, title),
        el("span", { class: "choice-sub" }, sub),
      ]);
    card.append(
      el("h3", {}, t("halloween.title")),
      el("p", {}, t("halloween.lede")),
      el("div", {}, [
        choice(true, t("halloween.on"), t("halloween.onSub")),
        choice(false, t("halloween.off"), t("halloween.offSub")),
      ])
    );
  }

  function choose(on: boolean): void {
    setHalloween(on);
    fill();
    toast(on ? t("halloween.nowOn") : t("halloween.nowOff"));
  }
}
