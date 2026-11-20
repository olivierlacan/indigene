// Lint for the scripts. `src/` is TypeScript and already answers to
// `npm run typecheck` (strict, no unused locals); the scripts are plain .mjs and
// had nothing, so dead imports and stale variables piled up unseen.
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["scripts/**/*.mjs", "*.config.{js,mjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      // Browser globals too: the Playwright scripts hand functions to
      // `page.evaluate`, which run in the page, where `document` exists.
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      ...js.configs.recommended.rules,
      // `catch {}` is how these scripts say "a failed probe costs nothing".
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }],
    },
  },
];
