// A small robots.txt reader, for harvesters that should stop at a site's own
// line rather than at ours. Pure, so `src/lib/robots.test.ts` can pin it.
//
// Only what a polite single-agent script needs: the group that names us (or
// `*` when none does), its Disallow/Allow rules with `*` and `$`, and its
// Crawl-delay. The longest matching rule wins, Allow on a tie — the reading
// Google and RFC 9309 agree on.

/** Rules for `agent` out of a robots.txt body. */
export function robotsFor(body, agent) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === "user-agent") {
      if (!lastWasAgent) groups.push((current = { agents: [], rules: [], delay: null }));
      current.agents.push(value.toLowerCase().replace(/^\+/, ""));
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (field === "disallow" || field === "allow") {
      if (value) current.rules.push({ allow: field === "allow", path: value });
    } else if (field === "crawl-delay") {
      current.delay = Number(value) || null;
    }
  }
  const want = agent.toLowerCase();
  const named = groups.filter((g) => g.agents.some((a) => a !== "*" && want.includes(a)));
  const chosen = named.length ? named : groups.filter((g) => g.agents.includes("*"));
  return {
    rules: chosen.flatMap((g) => g.rules),
    delay: chosen.map((g) => g.delay).find((d) => d) ?? null,
  };
}

const toRegex = (path) =>
  new RegExp(
    `^${path
      .replace(/[.+?^{}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\\\$$|\$$/, "$")}`,
  );

/** May `agent` fetch `pathAndQuery` (e.g. `/plant/species/123`)? */
export function allowed({ rules }, pathAndQuery) {
  let best = null;
  for (const r of rules) {
    if (!toRegex(r.path).test(pathAndQuery)) continue;
    const len = r.path.length;
    if (!best || len > best.len || (len === best.len && r.allow)) best = { len, allow: r.allow };
  }
  return best ? best.allow : true;
}
