import { defineConfig, type Plugin } from "vite";
import { withCsp } from "./src/lib/csp";
import { appTitle } from "./src/lib/brand";
import { readGrowth } from "./scripts/_growth.mjs";

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

/** `virtual:growth` — each region's plant and animal counts after every merge
 *  that moved them, worked out from git and the plant files on every build
 *  (`scripts/_growth.mjs`). Computed, never stored, so it can't drift from the
 *  lists. A shallow clone has no history and gets `null`: no chart. */
function growth(): Plugin {
  const ID = "virtual:growth";
  let cached: string | undefined;
  return {
    name: "indigene-growth",
    resolveId: (id) => (id === ID ? `\0${ID}` : undefined),
    load(id) {
      if (id !== `\0${ID}`) return undefined;
      if (cached === undefined) {
        const g = readGrowth(new URL("..", import.meta.url).pathname);
        if (!g) this.warn("no git history (shallow clone?) — the growth charts are left out");
        cached = `export default ${JSON.stringify(g && { regions: g.regions, all: g.all })};`;
      }
      return cached;
    },
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
  plugins: [brand(), growth(), csp()],
  build: {
    target: "es2022",
    sourcemap: true,
  },
  server: {
    host: true,
    // A self-signed cert is needed for DeviceOrientation/camera on real phones.
    // Run `npm run dev -- --https` behind a tunnel, or serve the build over TLS.
  },
});
