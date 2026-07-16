import { defineConfig } from "vite";

// The config runs under Node, but the project compiles with `types: []` and
// no @types/node — declare the one global it reads instead of adding a dep.
declare const process: { env: Record<string, string | undefined> };

// No framework plugins on purpose: this app is built on the DOM and real web
// APIs. The service worker (public/sw.js) is hand-written and copied verbatim
// so its behaviour is legible and debuggable, rather than generated.
export default defineConfig({
  root: ".",
  // GitHub Pages serves project sites under /<repo>/ — the deploy workflow
  // sets BASE_PATH so built asset URLs resolve there. Defaults to "/" locally.
  base: process.env.BASE_PATH || "/",
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
