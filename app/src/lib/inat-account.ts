// The iNaturalist account a gardener links in Settings — a username, and
// nothing else.
//
// Linking is what lets the import page (`steps/import.ts`) ask iNaturalist for
// "my recent plant sightings" without the gardener pasting them one by one.
// Everything iNaturalist can tell us about a username is already public on its
// site, so no sign-in is needed and none is asked for: no password, no token,
// nothing that could act as the gardener.
//
// Three rules, and the Privacy page says each in plain words (`privacy.inat*`):
//
//   - **It stays on this device.** Kept in this browser like the other small
//     settings, and never in a backup file — a file gets passed around, and a
//     username in it would name the garden's owner.
//   - **It goes only to iNaturalist, only when asked.** Once when linking, to
//     check the account exists, and once per import. Never in an address, so
//     never in the page count (`lib/analytics.ts` counts addresses).
//   - **It's removable.** Remove in Settings forgets it and every sighting that
//     was fetched with it.

/** Where the username is kept. Same browser, same rules as `lib/visits.ts`. */
export const STORAGE_KEY = "indigene.inat";

/**
 * Is this a username iNaturalist could have issued?
 *
 * Its logins start with a letter and run to letters, digits, `_` and `-`,
 * 3–40 of them. Checked before anything is sent, so a stray paste — a URL, a
 * sentence, someone's email address — is refused here instead of being sent
 * to iNaturalist as a question.
 */
export function isValidLogin(login: string): boolean {
  return /^[A-Za-z][A-Za-z0-9_-]{2,39}$/.test(login);
}

/**
 * Take what the gardener typed and find the username in it.
 *
 * People paste their profile address as often as their name, so both are
 * accepted: `@kueda`, `kueda`, and `https://www.inaturalist.org/people/kueda`
 * (any locale prefix, trailing slash or query). Returns null when there's no
 * username to be had, and the field says so.
 */
export function parseLogin(input: string): string | null {
  let raw = input.trim();
  const fromUrl = /inaturalist\.org\/(?:[a-z-]+\/)?(?:people|observations)\/([^/?#\s]+)/i.exec(raw);
  if (fromUrl) raw = fromUrl[1];
  raw = raw.replace(/^@/, "");
  return isValidLogin(raw) ? raw : null;
}

/** The linked username, or null. */
export function linkedLogin(): string | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && isValidLogin(v) ? v : null;
  } catch {
    return null;
  }
}

/** Keep a username. Only ever a valid one: this is read back into a request. */
export function setLinkedLogin(login: string): void {
  if (!isValidLogin(login)) throw new Error("not an iNaturalist username");
  try {
    localStorage.setItem(STORAGE_KEY, login);
  } catch {
    /* private browsing: linked for this visit only, which the card can't promise
       — so it reads back what was actually kept, and shows nothing linked */
  }
}

/** Forget the username. The import's own cache goes with it (`forgetImport`). */
export function unlinkLogin(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}
