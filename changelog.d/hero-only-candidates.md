### Changed

- Internal: `hero:harvest` gathers hero candidates only by default (top 10 by
  score from the general query); the four angle slots are opt-in with
  `--angles`. Candidates are stored slim and one per line, and the committed
  `candidates.json` is trimmed to match: 7.2 MB / 148k lines → 1.6 MB / 7k
  lines. The review page shows only the hero slot when a file has no angles.
  A partial harvest keeps the other subjects' problems instead of wiping them.
