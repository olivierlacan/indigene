### Added

- Internal: the `Find wildlife candidates` workflow runs `npm run wildlife` on GitHub's runners, one region per job (two at a time, an hour each), and opens a PR with the `docs/candidates/` shortlists. Long runs no longer depend on a session's machine staying up.
