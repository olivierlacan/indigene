import { defineConfig } from "vite";

// No framework plugins on purpose: this app is built on the DOM and real web
// APIs. The service worker (public/sw.js) is hand-written and copied verbatim
// so its behaviour is legible and debuggable, rather than generated.
export default defineConfig({
  root: ".",
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
