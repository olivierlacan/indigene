# Indigene API (Hanami 2)

A deliberately thin JSON API. Its one job in Phase 1 is to fetch **site data**
(soil, elevation, climate) server-side, so the PWA doesn't depend on the
upstream services being CORS-friendly and so any future API keys stay off the
client. The **plant catalog stays bundled in the offline PWA** — this server
does not duplicate it.

Built on the newest Hanami (2.3), Ruby 3.3.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/up` | Health check → `{"status":"ok"}` |
| `GET` | `/` | API description |
| `GET` | `/api/site?lat=..&lon=..` | Aggregated soil + elevation/slope + climate/zone for a point |
| `OPTIONS` | `/api/site` | CORS preflight |

`/api/site` returns the same shape as the PWA's client-side fetcher
(`app/src/lib/site.ts`), so the front end can switch between calling public
APIs directly and routing through this server with no other changes. Each
upstream source is best-effort: a failure degrades to `null` rather than failing
the whole response, and soil is always labelled `"coarse"` — never presented as
measured fact.

## Run it

```bash
cd server
bundle install
bundle exec puma -p 2300 config.ru      # → http://localhost:2300
curl "http://localhost:2300/api/site?lat=40.44&lon=-79.99"
```

If the `puma` binstub isn't on your PATH, boot it via Ruby:

```bash
bundle exec ruby -e 'require "puma/cli"; Puma::CLI.new(["-p","2300","config.ru"]).run'
```

## Where the database comes in (Phase 2)

There is intentionally **no database yet** — nothing in Phase 1 needs one. The
natural first use is:

- **Saved-spots sync** across a person's devices (opt-in; the PWA is local-first
  by default and works with no account).
- A **national plant catalog** too large to bundle, served with the same
  transparent scoring, filtered to the user's county/ecoregion.

The clean insertion point is a `plants` repository behind
`app/site_fetcher.rb`'s sibling — add `rom-sql` + `sqlite3` (or Postgres) to the
`Gemfile`, a `config/providers/persistence.rb`, and a `plants` relation. The
scoring logic and data schema already live in `app/src/lib` and
`app/src/data`, ready to port.

## Structure

```
config/app.rb        Hanami app definition
config/routes.rb     Routes
app/action.rb        Base action (adds CORS)
app/actions/         Home + Site actions
app/site_fetcher.rb  Server-side port of the site data fetcher
```
