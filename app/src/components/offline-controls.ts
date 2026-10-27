// Settings → Offline mode: try the app with no signal, without hunting for
// airplane mode (`lib/connection.ts`). Live lookups fail as they would in the
// field, and the header greys over to say so.
import { el, clear, toast } from "../ui";
import { t } from "../lib/i18n";
import { forcedOffline, onConnectionChange, setForcedOffline } from "../lib/connection";

export function offlineCard(): HTMLElement {
  const card = el("div", { class: "card" });
  fill();
  // The device can drop or regain its signal while the page is open.
  const stop = onConnectionChange(() => {
    if (card.isConnected) fill();
    else stop();
  });
  return card;

  function fill(): void {
    clear(card);
    const on = forcedOffline();
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
      el("h3", {}, t("offline.title")),
      el("p", {}, t("offline.lede")),
      el("div", {}, [
        choice(true, t("offline.on"), t("offline.onSub")),
        choice(false, t("offline.off"), t("offline.offSub")),
      ]),
      ...(navigator.onLine ? [] : [el("p", { class: "note" }, t("offline.deviceOffline"))])
    );
  }

  function choose(on: boolean): void {
    setForcedOffline(on);
    toast(on ? t("offline.nowOn") : t("offline.nowOff"));
  }
}
