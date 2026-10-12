### Changed

- The page on [what building Indigene cost](https://indigene.app/llm) now counts text read and text written separately, and includes every session up to October 12: 8.5 billion tokens read, 23 million written.
- Internal: `bill()` returns `readTokens` (input + cache reads + cache writes) and `writtenTokens` (output); ✍️ gets a screen-reader meaning. `sessions.csv` and `floor.csv` gain 29 sessions (2026-10-07 to 10-12) from the session list's usage records; three earlier rows refreshed.
