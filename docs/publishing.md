# Publishing when the usual deploy can't

The normal path is `.github/workflows/deploy.yml`: push to `main`, and about
fifty seconds later indigene.app is the new build. This document is for the days
that doesn't happen.

It is worth being precise about what *can* break, because the answers are
different:

| What broke | What still works |
|---|---|
| The deploy job never gets a runner (this happened on 2026-08-06) | Branch-based Pages — a different GitHub subsystem. Cloudflare. |
| Actions is down entirely | Branch-based Pages, once the branch is pushed from a laptop. Cloudflare. |
| GitHub Pages itself is down | Cloudflare only. |
| GitHub is down | Cloudflare only. |

Which is the whole argument for keeping a mirror somewhere that isn't GitHub.

## What the site actually needs from a host

Almost nothing, and then one thing that matters.

The build is ~855 static files, ~25 MB, and every URL in it is root-absolute
(`vite.config.ts` sets `base` from `BASE_PATH`, defaulting to `/`). There is no
server, no API the site can't live without, and no build step on the host's
side. It will run anywhere that serves files.

The one thing: **`404.html` must be served for paths that don't exist.**
`app/public/404.html` is not an error page, it's a router. Every deep link below
a page (`/plants/quercus-alba/ecosystem`, `/wildlife/in/pnw`) and every flow
step (`/results`) has no file of its own, and this is what bounces them into the
equivalent hash route. A host that answers those with its own branded 404 breaks
every one of them, and breaks them quietly — the links still resolve, they just
stop going anywhere. Check this before adding a host to the list below. GitHub
Pages, Cloudflare Pages, Netlify and Vercel all do the right thing.

Two files in `dist/` are load-bearing for the same reason and are checked by
`scripts/publish.mjs` before it will publish anything: `CNAME` (the custom
domain; without it a branch-mode deploy answers on `<user>.github.io` and drops
indigene.app in a way that looks like a DNS fault and isn't) and `404.html`.

## Cloudflare Pages — the mirror

This is the one that removes GitHub from the path.

```sh
cd app && npm run publish:cloudflare
```

It builds exactly what the workflow builds, then hands `dist/` to
`wrangler pages deploy` as a direct upload — no repository integration, nothing
to keep in sync, no build on their side. Authentication is wrangler's: it uses
`CLOUDFLARE_API_TOKEN` if it's set and opens a browser if it isn't.

The useful part is that this leaves a permanent `indigene.pages.dev` serving the
current build. During an outage that is a working URL you can hand out
immediately, with no DNS change and no waiting.

**One-time setup:** create a Pages project named `indigene` in the Cloudflare
dashboard (Workers & Pages → Create → Pages → Direct Upload). If you name it
something else, change `CF_PROJECT` in `scripts/publish.mjs`.

## gh-pages — the same-host escape hatch

```sh
cd app && npm run publish:gh-pages
```

This builds, then force-pushes `dist/` to the `gh-pages` branch as a single
commit. Nothing touches your working tree — it stages into a temp directory with
its own throwaway git repository.

**It is not live until you flip a switch.** GitHub Pages serves *either* a
branch *or* an Actions artifact, never both, and the choice is in
**Settings → Pages → Build and deployment → Source**:

- To fail over: set Source to **Deploy from a branch**, branch `gh-pages`, folder
  `/ (root)`.
- To go back once Actions is healthy: set Source to **GitHub Actions**, then
  re-run the latest `Deploy to GitHub Pages` workflow.

While you are in branch mode, any run of `deploy.yml` will fail at its
`deploy-pages` step. That is intended, and it is why `enablement: true` was
removed from the `Configure Pages` step: with that input, the *build* job — which
succeeds even on days the deploy job can't get a runner — would set the site
back to Actions mode and then fail to deploy anything, taking down the failover
you had just set up. Failing loudly and leaving the branch serving is the safe
direction to be wrong in.

## Failover is DNS, so prepare the DNS

`indigene.app` is an apex domain, so it is on A/AAAA records pointed at GitHub's
Pages addresses. Pointing it somewhere else is how a real failover happens, and
a failover plan is worth nothing if it's stuck behind a TTL you set months ago
and forgot.

Two things worth doing before you need them:

1. **Lower the TTL** on the apex records to 300s. It costs nothing and turns a
   day-long cutover into a five-minute one.
2. **Better: put the zone behind Cloudflare** with the records proxied. Then
   switching origin is a dashboard change that takes effect immediately, and
   public DNS never enters into it.

Neither is done yet. Until one of them is, treat `indigene.pages.dev` as the
fallback you actually hand out during an incident, rather than assuming the
apex can be moved quickly.

## Before a launch

Don't post the site anywhere that will send it real traffic while the only
origin is a subsystem you currently cannot deploy to. Run
`npm run publish:cloudflare` first so the mirror is warm and current, then post.
