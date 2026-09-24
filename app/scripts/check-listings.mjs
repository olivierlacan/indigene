// Check every `listing` in `app/src/data/lookalikes.ts` and
// `app/src/data/invasives.ts` against the body that issued it.
//
//   node app/scripts/check-listings.mjs          # check every listing
//   node app/scripts/check-listings.mjs --json   # machine-readable
//
// **Why this exists.** A `listing` is the one place the look-alike layer repeats
// somebody else's verdict rather than writing its own. "Cal-IPC rates it High",
// "Category I", "Class C noxious weed" — a reader who follows the link has to
// find the word we printed. Two things rot that: the body re-scores a species
// (Cal-IPC revises its inventory, FISC republishes every two years, Washington
// added English holly in 2025), and a transcription error that nobody notices
// because the claim looks plausible.
//
// So this asks each authority for its own list and compares, species by species.
//
// **Three outcomes, and two of them fail.**
//
//   ✓ agrees      — the authority still says what we print.
//   ✗ disagrees   — it says something else. Fix the row, or the reading.
//   ✗ silent      — the authority answered nothing: unreachable, or the species
//                   is no longer on its list. This fails too, on the rule
//                   `check-vernacular.mjs` set: a check that can only report
//                   agreement isn't a check. An authority gone quiet behind a
//                   changed URL would otherwise read as "everything is fine".
//
// **Network.** Several of these hosts are refused by the agent egress proxy in a
// cloud session (dcr.virginia.gov and floridainvasives.org among them), so those
// rows report `silent` there and the script says so plainly rather than passing.
// Run it on a laptop or a runner with open internet. Same arrangement as
// `lookalikes:check` and `names:check`.
import { inflateSync } from "node:zlib";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("listings:check");

const UA =
  "IndigeneListingCheck/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

const json = process.argv.includes("--json");

async function getText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

/** Tags out, entities in, whitespace collapsed — enough to find a word in a
 *  table cell without pulling in a parser for four pages. */
function plain(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/\s+/g, " ");
}

// ---------------------------------------------------------------------------
// One reader per authority. Each returns the authority's own word for a
// scientific name, or null when it has nothing to say about it.
// ---------------------------------------------------------------------------

/** Cal-IPC publishes the whole inventory as one HTML table: name, common names,
 *  rating. Fetched once and indexed by scientific name. */
async function calipc() {
  const rows = new Map();
  const html = await getText("https://www.cal-ipc.org/plants/inventory/");
  for (const tr of html.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
    const cells = [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => plain(m[1]).trim());
    if (cells.length >= 3 && cells[0] && cells[2]) rows.set(cells[0], cells[2]);
  }
  if (rows.size < 50) throw new Error(`inventory parsed to ${rows.size} rows — the table shape changed`);
  return (latin) => rows.get(latin) ?? null;
}

/** Washington's weed pages carry "Weed class: A" in the body. One fetch per
 *  species, because the printable list is a PDF and this is three species. */
function nwcb() {
  return async (_latin, url) => {
    const text = plain(await getText(url));
    const m = text.match(/Weed class:\s*([ABC])\b/i);
    return m ? `Class ${m[1].toUpperCase()} noxious weed` : null;
  };
}

/**
 * INVMED holds the Mediterranean conservatories' lists — PACA, Occitanie, Corse —
 * and serves the rows from a small endpoint the page itself calls, one card per
 * taxon with « Catégorie PACA : Majeure » in it. Asked per species, with `zone=P`
 * for Provence-Alpes-Côte d'Azur.
 */
function invmed() {
  return async (latin) => {
    const text = plain(
      await getText(
        `https://invmed.fr/src/listes/evee-liste.php?zone=P&taxon=${encodeURIComponent(latin)}`
      )
    );
    if (!text.includes(latin)) return null;
    const m = text.match(/Cat[ée]gorie PACA\s*:\s*([A-Za-zÀ-ÿ]+)/);
    return m ? m[1] : null;
  };
}

/**
 * The French regional lists are categorised PDFs: the category is a heading, and
 * the species that hold it follow underneath.
 *
 * A PDF's text lives in compressed streams, so a byte search of the file finds
 * nothing and would report every row `silent` — a check that always fails is as
 * useless as one that always passes. `zlib` is in Node, so the streams inflate
 * without a dependency, and the species and its category can both be found.
 *
 * The headings are read in order and the last one before the species wins, which
 * is exactly how the document reads on the page.
 */
function frenchList() {
  const cache = new Map();
  return async (latin, url) => {
    if (!cache.has(url)) {
      const res = await fetch(url, { headers: { "user-agent": UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      cache.set(url, pdfText(Buffer.from(await res.arrayBuffer())));
    }
    const text = cache.get(url);
    // The species' own row, not a mention of it: the introduction names
    // Japanese knotweed and ragweed in passing, in parentheses, long before the
    // table does. A row carries the author and year straight after the name.
    const row = new RegExp(`${latin.replace(/ /g, "\\s+")}\\s+[A-Z(][^,\\n]{0,40},\\s*\\d{4}`).exec(text);
    if (!row) return null;
    // The category headings the table uses, and only those — the introduction
    // defines each one in a sentence that starts the same way.
    const headings = [
      ...text
        .slice(0, row.index)
        .matchAll(/Plante Exotique (?:Envahissante (?:implant|[ée]mergente)\S*|potentiellement invasive|[àa] pr[ée]occupation mineure)/g),
    ];
    return headings.length ? headings[headings.length - 1][0].trim() : null;
  };
}

/** Every text-showing operator in a PDF's inflated content streams, in order.
 *  Crude — it keeps the strings and drops the positioning — which is all a
 *  "is this name under that heading" question needs. */
function pdfText(buf) {
  const out = [];
  let at = 0;
  for (;;) {
    const start = buf.indexOf("stream", at);
    if (start < 0) break;
    let from = start + 6;
    if (buf[from] === 0x0d) from++;
    if (buf[from] === 0x0a) from++;
    const end = buf.indexOf("endstream", from);
    if (end < 0) break;
    at = end + 9;
    let body;
    try {
      body = inflateSync(buf.subarray(from, end));
    } catch {
      continue; // not a Flate stream (an image, a font) — skip it
    }
    const s = body.toString("latin1");
    // Only the streams that actually draw text. A tagged PDF also carries a
    // structure tree full of strings like "R17C1_Ficaria_", and those come
    // *before* the page content — searching them finds the species in a cell
    // label with no rank next to it, and the check reports silence on a list
    // that is perfectly intact.
    if (!/\)\s*T[jJ]|\]\s*TJ/.test(s)) continue;
    for (const m of s.matchAll(/\((?:\\.|[^\\()])*\)/g)) out.push(unescapePdf(m[0].slice(1, -1)));
    out.push("\n");
  }
  // The bytes are whatever the document's font encoding chose. Try UTF-8 first;
  // when that produces replacement characters the file is single-byte WinAnsi,
  // which is what both of these lists are, and the characters only survive if
  // it's read one byte at a time. Guessing wrong loses the é in « implantée »,
  // which is the one character that comparison turns on.
  const raw = Buffer.from(out.join(""), "latin1");
  const utf8 = raw.toString("utf8");
  const text = utf8.includes("\ufffd") ? winAnsi(raw) : utf8;
  return text.replace(/[ \t]+/g, " ");
}

/**
 * WinAnsi, not Latin-1 — they agree everywhere except 0x80–0x9F, and that range
 * is where the punctuation lives.
 *
 * It is not a pedantic difference. Virginia writes the dot in each physiographic
 * province column as `\225`, which is WinAnsi 0x95, **•**. Read as Latin-1 it
 * becomes U+0095, an invisible control character, and the check concludes the
 * species has been dropped from every province in the state.
 */
function winAnsi(buf) {
  // cp1252 0x80–0x9F, in order. Written as escapes because two of them are the
  // curly double quotes, which a source file cannot hold literally here.
  const high = "\u20ac\u0081\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u008d\u017d\u008f\u0090\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\u009d\u017e\u0178";
  let out = "";
  for (const b of buf) out += b >= 0x80 && b <= 0x9f ? high[b - 0x80] : String.fromCharCode(b);
  return out;
}

/** A PDF string literal's escapes. The octal ones matter here: Virginia's
 *  province columns are bullets, written `\\225`, and without this they arrive
 *  as a literal backslash-two-two-five in the middle of every row. */
function unescapePdf(s) {
  return s
    .replace(/\\([0-7]{1,3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\([()\\])/g, "$1");
}

/**
 * Does the authority still say what we print?
 *
 * Folded on case and accents, because one side of the comparison comes out of a
 * PDF: text there is drawn through a font's own encoding, and « implantée » can
 * arrive with its é mangled however the document's encoding chose to store it.
 * Failing a row over that would be crying wolf about a byte, and the real thing
 * this guards — *implantée* quietly becoming *émergente* — survives the fold.
 */
function same(found, claimed) {
  const fold = (x) =>
    x.normalize("NFD").replace(/[\u0300-\u036f\ufffd]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  return fold(found) === fold(claimed);
}

/**
 * Virginia publishes its list as one PDF, a row per species: scientific name,
 * common name, the invasiveness rank, then a dot in each physiographic province
 * the plant is established in — Mountain, Piedmont, Coastal Plain.
 *
 * The rank is what we print, and it is what this compares. The province columns
 * are why Virginia is the right authority for our Mid-Atlantic region at all —
 * every species we cite carries the Piedmont dot — but flattening the PDF loses
 * which column a dot sat in, so all this can add is that the species is still
 * established somewhere in the state. Which province is a human reading.
 *
 * The URL is the PDF rather than the landing page the data links to, because the
 * landing page is for a reader and this is for a parser.
 */
function virginia() {
  let text = null;
  return async (latin) => {
    if (text === null) {
      const res = await fetch(
        "https://www.dcr.virginia.gov/natural-heritage/document/nh-invasive-plant-list-2024.pdf",
        { headers: { "user-agent": UA } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = pdfText(Buffer.from(await res.arrayBuffer()));
    }
    const i = text.indexOf(latin);
    if (i < 0) return null;
    const row = text.slice(i, i + 160);
    const rank = row.match(/\b(High|Medium|Low)\b/);
    if (!rank) return null;
    const provinces = (row.slice(rank.index).match(/[\u2022\u00b7]/g) ?? []).length;
    return provinces ? rank[1] : null;
  };
}

/** FISC publishes the list as an HTML table: scientific name, common name, the
 *  zones it's in (N/C/S), and the category. */
async function fisc() {
  const rows = new Map();
  const html = await getText("https://www.floridainvasives.org/plant-list/2023-invasive-plant-species/");
  for (const tr of html.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
    const cells = [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => plain(m[1]).trim());
    if (cells.length >= 4 && /^I{1,2}$/.test(cells[3])) rows.set(cells[0], `Category ${cells[3]}`);
  }
  if (rows.size < 50) throw new Error(`FISC list parsed to ${rows.size} rows — the table shape changed`);
  return (latin) => rows.get(latin) ?? null;
}

const READERS = {
  "the California Invasive Plant Council": { build: calipc },
  "the Washington State Noxious Weed Control Board": { build: async () => nwcb() },
  "the Mediterranean botanical conservatories": { build: async () => invmed() },
  "the Grand Est botanical conservatories": { build: async () => frenchList() },
  "Virginia Natural Heritage": { build: async () => virginia() },
  "the Florida Invasive Species Council": { build: fisc },
};

// ---------------------------------------------------------------------------

const loader = await openLoader();
let results;
try {
  const { CONFUSIONS, LOOKALIKES } = await loader.load("/src/data/lookalikes.ts");
  const { INVASIVES, MOST_WANTED } = await loader.load("/src/data/invasives.ts");
  const latinOf = new Map(LOOKALIKES.map((l) => [l.id, l.latin]));
  const invasiveLatin = new Map(INVASIVES.map((i) => [i.id, i.latin]));

  /** Every listing we print, flattened: region, impostor, and what we claim. */
  const claims = [];
  for (const [regionId, byPlant] of Object.entries(CONFUSIONS)) {
    for (const [plantId, links] of Object.entries(byPlant)) {
      for (const link of links) {
        if (!link.listing) continue;
        claims.push({
          regionId,
          plantId,
          id: link.lookalikeId,
          latin: latinOf.get(link.lookalikeId) ?? link.lookalikeId,
          ...link.listing,
        });
      }
    }
  }

  // The most-wanted lists repeat an authority's verdict the same way, so they
  // are checked the same way. `plantId` names the list rather than a plant.
  for (const [regionId, links] of Object.entries(MOST_WANTED)) {
    for (const link of links) {
      if (!link.listing) continue;
      claims.push({
        regionId,
        plantId: "most-wanted",
        id: link.invasiveId,
        latin: invasiveLatin.get(link.invasiveId) ?? link.invasiveId,
        ...link.listing,
      });
    }
  }

  // One reader per authority, built once — Cal-IPC's is a whole table.
  const readers = new Map();
  for (const by of new Set(claims.map((c) => c.by))) {
    const spec = READERS[by];
    if (!spec) {
      readers.set(by, { error: "no reader written for this authority" });
      continue;
    }
    try {
      readers.set(by, { read: await spec.build() });
    } catch (err) {
      readers.set(by, { error: err.message });
    }
  }

  results = [];
  for (const c of claims) {
    const reader = readers.get(c.by);
    if (reader.error) {
      results.push({ ...c, verdict: "silent", found: null, note: reader.error });
      continue;
    }
    let found = null;
    let note = null;
    try {
      found = await reader.read(c.latin, c.url);
    } catch (err) {
      note = err.message;
    }
    const verdict = found === null ? "silent" : same(found, c.as) ? "agrees" : "disagrees";
    results.push({ ...c, verdict, found, note });
  }
} finally {
  await loader.close();
}

if (json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const mark = { agrees: "✓", disagrees: "✗", silent: "✗" };
  for (const r of results) {
    const said = r.verdict === "agrees" ? "" : `  (they say: ${r.found ?? r.note ?? "nothing"})`;
    console.log(`${mark[r.verdict]} ${r.regionId.padEnd(20)} ${r.latin.padEnd(28)} ${r.as}${said}`);
  }
  const bad = results.filter((r) => r.verdict !== "agrees");
  console.log(`\n${results.length - bad.length}/${results.length} listings still say what we print.`);
  if (bad.length) {
    const silent = bad.filter((r) => r.verdict === "silent").length;
    console.log(
      `${bad.length} to look at — ${silent} where the authority answered nothing ` +
        `(unreachable, moved, or dropped from the list) and ${bad.length - silent} that disagree.`
    );
  }
}

process.exit(results.some((r) => r.verdict !== "agrees") ? 1 : 0);
