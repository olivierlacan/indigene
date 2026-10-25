### Added

- Internal: `app/src/data/added.json` records when each plant and each animal first reached each region (the merge into main, to the minute, rebuilt from git history back to July). `npm run added` keeps it current, and the deploy runs it, so a "new since your last visit" view or sorting by date can read it. Nothing in the app reads it yet.
