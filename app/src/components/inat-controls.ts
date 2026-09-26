// The Settings card for a linked iNaturalist account: link one, see which one,
// remove it. What linking means for privacy is on the Privacy page
// (`#/privacy/inat`), and the card's lock line goes straight there.
import { el, clear, toast } from "../ui";
import { privacyNote } from "./privacy-link";
import { linkedLogin, parseLogin, setLinkedLogin, unlinkLogin } from "../lib/inat-account";
import { forgetImport, loginExists } from "../lib/inat-import";
import { isBusy } from "../lib/inaturalist";
import { t } from "../lib/i18n";

export function inatCard(): HTMLElement {
  const card = el("div", { class: "card" });
  fill();
  return card;

  function fill(message?: HTMLElement): void {
    clear(card);
    card.append(el("h3", {}, t("inat.cardTitle")));
    const login = linkedLogin();
    if (login) {
      card.append(
        el("p", {}, t("inat.linkedAs", { login })),
        el("div", { class: "btn-row", style: "margin-top:0.8rem" }, [
          el("a", { class: "btn btn-secondary", href: "#/import" }, t("inat.importButton")),
          el("button", {
            class: "btn btn-ghost",
            onClick: () => {
              unlinkLogin();
              forgetImport();
              toast(t("inat.removed"));
              fill();
            },
          }, t("inat.remove")),
        ]),
      );
    } else {
      card.append(el("p", {}, t("inat.lede")), linkForm(message));
    }
    card.append(privacyNote(t("inat.privacy"), undefined, "inat"));
  }

  function linkForm(message?: HTMLElement): HTMLElement {
    const input = el("input", {
      type: "text",
      id: "inat-login",
      autocomplete: "username",
      autocapitalize: "none",
      spellcheck: "false",
      placeholder: t("inat.placeholder"),
      style: "flex:1 1 auto;min-width:0",
    }) as HTMLInputElement;
    const button = el("button", { class: "btn btn-secondary", style: "flex:none" }, t("inat.link")) as HTMLButtonElement;
    const out = el("div", { "aria-live": "polite" }, message ?? []);

    async function link(): Promise<void> {
      const login = parseLogin(input.value);
      clear(out);
      if (!login) {
        out.append(el("p", { class: "note warn" }, t("inat.invalid")));
        return;
      }
      button.disabled = true;
      button.textContent = t("inat.checking");
      try {
        if (!(await loginExists(login))) {
          out.append(el("p", { class: "note warn" }, t("inat.unknown")));
          return;
        }
        setLinkedLogin(login);
        if (linkedLogin() !== login) {
          // The browser wouldn't keep it (private browsing, storage blocked).
          out.append(el("p", { class: "note warn" }, t("inat.notKept")));
          return;
        }
        toast(t("inat.linked"));
        fill();
      } catch (err) {
        out.append(el("p", { class: "note warn" }, t(isBusy(err) ? "nearby.busy" : "nearby.unreachable")));
      } finally {
        button.disabled = false;
        button.textContent = t("inat.link");
      }
    }

    return el("form", { onSubmit: (e: Event) => { e.preventDefault(); void link(); } }, [
      el("div", { class: "field", style: "margin-bottom:0.6rem" }, [
        el("label", { for: "inat-login" }, t("inat.label")),
        el("div", { style: "display:flex;gap:0.5rem" }, [input, button]),
      ]),
      out,
    ]);
  }
}
