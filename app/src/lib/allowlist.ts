// The network allowlist a Claude session needs, read from its annotated source
// (`.claude/network/allowed-domains.txt`). `scripts/allowlist.mjs` writes the
// two copies the tools read from what this returns.

export interface AllowlistEntry {
  host: string;
  /** The `## ` heading it sits under. */
  group: string;
  line: number;
}

/** One host per line; `#` starts a comment, `## ` a group. Throws on a line
 *  that isn't a host, so a typo can't ship as a rule that matches nothing. */
export function parseAllowlist(text: string): AllowlistEntry[] {
  const entries: AllowlistEntry[] = [];
  let group = "";
  text.split("\n").forEach((raw, i) => {
    const heading = raw.match(/^##\s+(.*)$/);
    if (heading) {
      group = heading[1].trim();
      return;
    }
    const host = raw.replace(/#.*$/, "").trim().toLowerCase();
    if (!host) return;
    if (!/^(\*\.)?([a-z0-9-]+\.)+[a-z]{2,}$/.test(host)) {
      throw new Error(`line ${i + 1}: "${host}" is not a host name`);
    }
    entries.push({ host, group, line: i + 1 });
  });
  return entries;
}

/** Whether `rule` lets `host` through. `*.example.org` matches every subdomain
 *  of example.org, not example.org itself — the cloud environment's reading. */
export function allows(rule: string, host: string): boolean {
  if (rule.startsWith("*.")) return host.endsWith(rule.slice(1));
  return rule === host;
}

/** Entries no other entry needs: repeats, and hosts a wildcard already covers. */
export function redundant(entries: AllowlistEntry[]): { entry: AllowlistEntry; by: AllowlistEntry }[] {
  const out: { entry: AllowlistEntry; by: AllowlistEntry }[] = [];
  entries.forEach((entry, i) => {
    const by = entries.find((other, j) => j !== i && (
      other.host === entry.host ? j < i : allows(other.host, entry.host)
    ));
    if (by) out.push({ entry, by });
  });
  return out;
}

/** The paste-ready list: hosts only, sorted, one per line. */
export function pasteList(entries: AllowlistEntry[]): string {
  return [...new Set(entries.map((e) => e.host))].sort().join("\n") + "\n";
}
