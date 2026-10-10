// What a pull request adds to the photo review queue, as the Markdown the
// `inat-heroes.yml` workflow pins to the PR.
//
//   node scripts/needs-review-report.mjs <base-queue.json> <head-queue.json>
//
// Prints the comment body to stdout and writes `added=<n>` to $GITHUB_OUTPUT
// when it's set. Every subject the PR's lists bring in whose iNaturalist pick
// can't be republished is named, because the app will show its drawing until a
// person chooses a photo — and that should never be news after a merge.
import { readFileSync, existsSync, appendFileSync } from "node:fs";

export const MARKER = "<!-- needs-review -->";
/** The kinds the review page can fill (hero-photos.json, wildlife-photos.json). */
const REVIEWABLE = new Set(["plant", "wildlife"]);

const read = (path) => {
  if (!path || !existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf8")).subjects ?? [];
  } catch {
    return [];
  }
};
const key = (q) => `${q.subject}|${q.id}`;
// Names came back from an external API: keep them out of Markdown syntax.
const md = (v) => String(v ?? "").replace(/[\\`*_[\]<>|]/g, (c) => `\\${c}`);

export function report(base, head) {
  const had = new Set(base.map(key));
  const added = head.filter((q) => !had.has(key(q)));
  const lines = [MARKER, "### 📷 Photos nobody chose"];
  if (!added.length) {
    lines.push("", `This PR adds nothing to the photo review queue (${head.length} waiting on \`main\`'s lists).`);
    return { body: lines.join("\n"), added: 0 };
  }
  lines.push(
    "",
    `**${added.length} subject${added.length === 1 ? "" : "s"} this PR brings in will show a drawing, not a photo.** ` +
      "iNaturalist's own pick for each can't be republished, and the app no longer reaches further down " +
      "the gallery on its own. Choose one on the review page before or after merging:",
    "",
    "```sh",
    "cd app && npm run hero:harvest -- --queue && npm run hero:review",
    "```",
    "",
    "| Subject | Kind | Why | Gallery |",
    "|---|---|---|---|",
    ...added.map((q) =>
      `| ${md(q.name)} (\`${md(q.id)}\`) | ${md(q.subject)} | ${md(q.reason)} | ${q.gallery ? `[iNaturalist](${q.gallery})` : "—"} |`),
  );
  const noTier = added.filter((q) => !REVIEWABLE.has(q.subject)).length;
  if (noTier) {
    lines.push(
      "",
      `${noTier} of them ${noTier === 1 ? "is a look-alike, ornamental or invasive" : "are look-alikes, ornamentals or invasives"}, ` +
        "which have no review tier yet: they stay drawings until iNaturalist's pick becomes republishable.",
    );
  }
  lines.push("", `${head.length} waiting in all (\`docs/hero-photos/needs-review.json\`).`);
  return { body: lines.join("\n"), added: added.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { body, added } = report(read(process.argv[2]), read(process.argv[3]));
  process.stdout.write(body + "\n");
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `added=${added}\n`);
}
