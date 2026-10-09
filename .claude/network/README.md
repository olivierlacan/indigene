# Network allowlist

The hosts a Claude session working on Indigene needs to reach, kept in the repo
so anyone can set up the same access.

| File | What it is |
|---|---|
| `allowed-domains.txt` | **The source.** Grouped by why we need each host, with a note where the name doesn't say. Edit this one. |
| `paste.txt` | Generated. Hosts only, sorted. Paste it into a cloud environment. |
| `../settings.json` | Generated `sandbox.network.allowedDomains`, for Claude Code on your own machine. |

## Use it on claude.ai/code (cloud sessions)

There's no import for a cloud environment's allowlist, so it's a paste:

1. Open the environment's settings (the environment menu in a session's title
   bar, then **Edit**).
2. Under **Network access**, choose **Custom**.
3. Paste all of [`paste.txt`](paste.txt) into **Allowed domains**.
4. Leave **Also include default list of common package managers** ticked.
   npm installs need it.

Each environment keeps its own list. An organization owner can make one shared
environment with this list, so members don't each paste it.

## Use it locally

Nothing to do. `.claude/settings.json` carries the list, and Claude Code's Bash
sandbox reads it when the sandbox is on (`/sandbox`). The WebFetch tool has its
own permission rules and ignores this list.

## Add a host

1. Add it to `allowed-domains.txt` under the heading that says why. Add a
   comment if the host name doesn't explain itself.
2. `cd app && npm run allowlist -- --check`.
3. Commit all three files. `npm test` fails if the copies don't match the
   source.
4. Paste `paste.txt` into your cloud environment again.

If a script calls the new host, add it to `app/scripts/network-hosts.mjs` too,
so `npm run network:check` asks it. `--check` fails if an asked host isn't
allowed.

`*.example.org` allows every subdomain of example.org but not example.org
itself; list the bare domain too when you need both. The generator refuses a
line a wildcard already covers, and a repeated line.
