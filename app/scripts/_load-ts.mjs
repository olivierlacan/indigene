// Load the app's TypeScript modules from a plain Node script, using the Vite
// (esbuild) that's already a dependency — so these scripts run on any Node
// version without relying on Node's own TS support or an extra tool. Root is
// derived from this file's location (app/), so cwd doesn't matter.
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));

export async function openLoader() {
  const vite = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
    optimizeDeps: { noDiscovery: true },
  });
  return {
    /** Load a module by app-root-relative id, e.g. "/src/data/registry.ts". */
    load: (id) => vite.ssrLoadModule(id),
    close: () => vite.close(),
  };
}
