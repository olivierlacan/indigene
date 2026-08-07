// One shared answer to a failure that cost a whole session to diagnose.
//
// Several scripts here fetch from the open internet — the registry reconciler,
// the vernacular and look-alike audits, the photo harvester, the probes. When
// they run somewhere that reaches the internet through an HTTP proxy (a Claude
// Code cloud session, most corporate networks, some CI), there is a trap:
//
//   **Node's built-in `fetch` ignores `HTTPS_PROXY`.**
//
// It has since fetch arrived, and it is still true on Node 22. So every request
// leaves the machine directly, the network refuses it, and the script reports
// whatever the refusing hop said — usually `403`. That is indistinguishable, from
// the inside, from "the proxy's policy denies this host", which is what these
// scripts (and their operators) have concluded more than once. Widening a proxy
// allowlist does not fix it, because the requests were never going through the
// proxy to begin with.
//
// Node ≥ 22.21 has the fix, but it is opt-in: `NODE_USE_ENV_PROXY=1`, read once
// at startup, which installs undici's `EnvHttpProxyAgent` as the global
// dispatcher. Too late to set from inside a module — by the time this file runs,
// bootstrap is over. So the npm scripts set it (see `package.json`), and this
// guard catches the case where someone runs `node scripts/reconcile.mjs`
// directly, as you would while debugging, and turns a silent 403 into a sentence
// that names the actual problem.
//
// When no proxy is configured — a laptop, a GitHub runner — this is a no-op, and
// the variable is harmless if set anyway.

/** True when the environment says "reach the internet through this proxy". */
export function proxyConfigured() {
  return Boolean(
    process.env.HTTPS_PROXY ||
      process.env.https_proxy ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy
  );
}

/** True when Node's fetch was actually told to honour that proxy. */
export function proxyHonoured() {
  const v = process.env.NODE_USE_ENV_PROXY;
  return v !== undefined && v !== "" && v !== "0";
}

/**
 * Call at the top of any script that fetches. If a proxy is configured but Node
 * won't use it, every request is going to fail in a way that looks like someone
 * else's fault — so stop here and say so instead.
 *
 * @param {string} npmScript the `npm run …` name that sets the variable for you
 */
export function requireProxyAwareFetch(npmScript) {
  if (!proxyConfigured() || proxyHonoured()) return;
  console.error(
    "This machine reaches the internet through a proxy (HTTPS_PROXY is set), but\n" +
      "Node's built-in fetch ignores it unless NODE_USE_ENV_PROXY=1 — so every request\n" +
      "would leave directly and come back 403, which reads exactly like a blocked host.\n" +
      "\n" +
      `Run it as \`npm run ${npmScript}\`, which sets the variable, or prefix it yourself:\n` +
      `  NODE_USE_ENV_PROXY=1 node ${process.argv[1] ?? "scripts/<script>.mjs"}\n` +
      "\n" +
      "(Needs Node 22.21 or newer. Nothing was written.)"
  );
  process.exit(1);
}
