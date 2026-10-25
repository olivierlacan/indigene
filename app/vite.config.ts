import { defineConfig, type Plugin } from "vite";
import { withCsp } from "./src/lib/csp";
import { appTitle } from "./src/lib/brand";

// The config runs under Node, but the project compiles with `types: []` and
// no @types/node — declare the one global it reads instead of adding a dep.
declare const process: { env: Record<string, string | undefined> };

/** Stamp the Content-Security-Policy into the built page (`src/lib/csp.ts`).
 *  Last, so it hashes the inline scripts exactly as they ship. Build only: the
 *  dev server injects scripts of its own, and no reader ever sees it. */
function csp(): Plugin {
  return {
    name: "indigene-csp",
    apply: "build",
    transformIndexHtml: { order: "post", handler: withCsp },
  };
}

/** Fill `%APP_TITLE%` in index.html from `data/brand.json`, in dev and build,
 *  so the page title and share tags can't drift from the app's own copy.
 *  `public/404.html` and the manifest are copied verbatim, so
 *  `scripts/prerender.mjs` fills theirs. */
function brand(): Plugin {
  return {
    name: "indigene-brand",
    transformIndexHtml: { order: "pre", handler: (html) => html.replaceAll("%APP_TITLE%", appTitle("en")) },
  };
}

// No framework plugins on purpose: this app is built on the DOM and real web
// APIs. The service worker (public/sw.js) is hand-written and copied verbatim
// so its behaviour is legible and debuggable, rather than generated.
export default defineConfig({
  root: ".",
  // GitHub Pages serves project sites under /<repo>/ — the deploy workflow
  // sets BASE_PATH so built asset URLs resolve there. Defaults to "/" locally.
  base: process.env.BASE_PATH || "/",
  plugins: [brand(), csp()],
  build: {
    target: "es2022",
    sourcemap: true,
    // `scripts/stamp-sw.mjs` reads this to tell the service worker which files
    // this release is made of, then deletes it from dist/.
    manifest: true,
    rollupOptions: {
      output: {
        // Stable names for the French chunks, so the service worker can tell a
        // device that reads French (it has a `lang-fr-*` file cached) and fetch
        // the new release's French before the old one is pruned.
        // Only the *names* change: `manualChunks` would also pull shared
        // modules (the brand strings) in with the French and make the entry
        // import them back from it, loading French for everyone.
        chunkFileNames(chunk) {
          const id = chunk.facadeModuleId ?? "";
          if (id.endsWith("/src/locales/fr.ts")) return "assets/lang-fr-[hash].js";
          if (id.endsWith("/src/locales/prose.fr/index.ts")) return "assets/prose-fr-[hash].js";
          return "assets/[name]-[hash].js";
        },
      },
    },
  },
  server: {
    host: true,
    // A self-signed cert is needed for DeviceOrientation/camera on real phones.
    // Run `npm run dev -- --https` behind a tunnel, or serve the build over TLS.
  },
});
