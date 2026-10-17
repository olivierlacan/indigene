// Reading the Florida Native Plant Society's plant pages: pure, no network, so
// `src/lib/fnps-parse.test.ts` can pin it. `harvest-fnps.mjs` does the asking.

const decode = (s) =>
  s
    .replace(/&ndash;|&mdash;/g, "–")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&")
    .replace(/&apos;|&rsquo;/g, "'")
    .replace(/&nbsp;|\ufeff/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Every plant slug the database index links to, once each. */
export function parseIndex(html) {
  return [...new Set([...html.matchAll(/href="\/plant\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
}

// The labels a plant page carries, in the order the page prints them. A value is
// every text line between its label and the next one.
const LABELS = {
  "Common Name": "common",
  "Synonym(s)": "synonyms",
  "Genus species": "latin",
  Family: "family",
  Form: "form",
  Size: "size",
  "Life Span": "lifeSpan",
  "Flower Color": "flowerColor",
  "Fruit Color": "fruitColor",
  Phenology: "phenology",
  "Noted For": "notedFor",
  "Recommended Uses": null, // their prose: not kept
  Considerations: null, // their prose: not kept
  Availability: "availability",
  Propagation: "propagation",
  Light: "light",
  "Moisture Tolerance": "moisture",
  "Salt Water Flooding Tolerance": "saltFlooding",
  "Salt Spray/Salty Soil Tolerance": "saltSpray",
  "Soil or Other Substrate": "soil",
  "Soil pH": "ph",
  "Suitable to Grow In": "zones",
  "Vouchered In": null, // the map that follows is theirs, see above
};
// Section headings between the fields; a value never runs across one.
const SECTIONS = new Set(["Nomenclature", "Plant Specifics", "Landscaping"]);
const LIST_FIELDS = new Set(["form", "availability", "light", "soil", "notedFor", "flowerColor"]);

/**
 * One plant page reduced to its facts, or `null` when it carries no botanical
 * name (a page that isn't a plant).
 */
export function parsePlant(html) {
  const lines = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map(decode)
    .filter(Boolean);
  const start = lines.indexOf("Nomenclature");
  if (start < 0) return null;
  // "Salt Water Flooding" and "Tolerance:" land on two lines; join them back.
  const joined = [];
  for (const line of lines.slice(start)) {
    const prev = joined.at(-1);
    if (line === "Tolerance:" && prev === "Salt Water Flooding") joined[joined.length - 1] = "Salt Water Flooding Tolerance:";
    else joined.push(line);
  }
  const out = {};
  let field;
  for (const line of joined) {
    const label = line.endsWith(":") ? line.slice(0, -1) : null;
    if (label && label in LABELS) {
      field = LABELS[label];
      if (field) out[field] = [];
      continue;
    }
    if (SECTIONS.has(line)) {
      field = null;
      continue;
    }
    if (line.startsWith("USDA zones are based")) break;
    if (field) out[field].push(line);
  }
  if (!out.latin?.length) return null;
  const one = (k) => (out[k]?.length ? out[k].join(" ") : null);
  const list = (k) =>
    (out[k] ?? [])
      .join(",")
      .split(/\s*,\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
  const moisture = (out.moisture ?? []).filter((s) => s !== "-to-");
  const plant = {
    latin: one("latin"),
    common: one("common"),
    synonyms: one("synonyms"),
    family: one("family"),
    lifeSpan: one("lifeSpan"),
    size: one("size"),
    phenology: one("phenology"),
    propagation: one("propagation"),
    moisture: moisture.length ? { wettest: moisture[0], driest: moisture.at(-1) } : null,
    saltFlooding: one("saltFlooding"),
    saltSpray: one("saltSpray"),
    ph: one("ph"),
    zones: list("zones").map((z) => z.toUpperCase()),
  };
  for (const k of LIST_FIELDS) plant[k] = list(k);
  return plant;
}

// FNPS's zones are USDA half-zones, except that zone 11 is written whole; a
// region is in if any of its zones are.
export const REGION_ZONES = {
  "florida-central": ["8B", "9A", "9B"],
  "florida-south": ["10A", "10B", "11", "11A", "11B"],
};
// Where each Florida region's rows live.
export const REGION_FILE = { "florida-central": "plants.florida.ts", "florida-south": "plants.florida-south.ts" };
/** Genus + epithet, lowercased: what two lists can be compared on. */
export const key = (latin) => latin.toLowerCase().split(/\s+/).slice(0, 2).join(" ");
// Something a person can buy: a nursery, a store, an FNPS plant sale, a
// specialty grower or seed. "Friends" is a pass-along, not a sale.
export const sells = (p) => p.availability.some((a) => a !== "Friends");
