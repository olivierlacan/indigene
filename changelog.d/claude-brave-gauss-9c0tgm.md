### Changed

- The page on [what building Indigene cost](https://indigene.app/llm) now counts text read and text written separately: 6.7 billion tokens read, 17 million written.
- Internal: `bill()` returns `readTokens` (input + cache reads + cache writes) and `writtenTokens` (output); ✍️ gets a screen-reader meaning.
