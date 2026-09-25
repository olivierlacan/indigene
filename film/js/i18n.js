// One film, two languages. Everything the reader sees or hears that changes
// between them lives here: on-screen words, the plants and their numbers, the
// units of the scale drawing, the bird, and the cue times measured from each
// narration (word-level alignment of the final voice take).
//
// Pick with ?lang=fr in the browser, FILM_LANG=fr in Node.

const fromUrl = typeof location !== "undefined" ? new URLSearchParams(location.search).get("lang") : null;
const fromEnv = typeof process !== "undefined" ? process.env.FILM_LANG : null;
const wanted = fromUrl || fromEnv || "en";

const EN = {
  // voice-over phrase starts, seconds into the voice take
  cues: {
    green: 0.32, quiet: 2.41, because: 4.84, cats: 5.76, bird: 9.82, chicks: 11.67,
    name: 15.29, standing: 16.12, sun: 18.38, soil: 20.68, climate: 22.6,
    shows: 24.87, belong: 26.19, ranked: 27.76, scale: 29.35, howbig: 31.01,
    first: 33.97, grand: 35.81, anyone: 37.41, plain: 39.97, account: 41.2,
    plant: 43.47, foodweb: 45.04, logo: 48.01, tagline: 49.39, voEnd: 52.1,
  },
  s: {
    fig1: "fig. 1 — a typical yard", lawnRoots: "lawn roots: about 2 inches", birdsong: "birdsong",
    nothing: "…nothing.", fig6: "fig. 6 — the same yard, next summer", deepRoots: "native roots run deep",
    singing: "…singing again.",
    fig2: "fig. 2 — who eats what", oak: "native white oak", oakFeeds: "feeds 511 kinds of caterpillars",
    imported: "imported ornamental", importedNote: "almost nothing here can eat it", bird: "a chickadee",
    nest1: "one nest of chicks eats", nest2: "6,000–9,000 caterpillars",
    fig3: "fig. 3 — reading a spot", here: "you are here", am: "6 am", pm: "6 pm", shade: "shade",
    sunHours: "sun: 5–7 hours a day", topsoil: "topsoil", subsoil: "clay subsoil", rock: "rock & gravel",
    soil1: "soil: silty clay loam", soil2: "pH 6.4 · drains slowly", climate1: "climate: zone 7a",
    climate2: "45 in. of rain a year",
    fig4: "fig. 4 — ranked & drawn to scale", best: "Best for this spot", bestSub: "ranked by caterpillar species fed",
    feedsEach: "caterpillar species each one feeds", chartTitle: "Serviceberry, drawn to scale",
    you: "You", youH: "5′6″", year: (n) => `Year ${n}`, taller: "taller than you by year 5",
    fig5: "fig. 5 — who it's for", firstTime: "first-time gardeners", grandparents: "grandparents",
    anyone: "anyone with a little patch of dirt", jargon: "part shade", plain: "⛅ Sun about half the day",
    plainNote: "in plain words", signUp: "sign up", password: "password",
    noAccount1: "No account, no sign-up.", noAccount2: "Nothing that identifies you.",
    tagline: ["Native", "plants", "for", "exactly", "where", "you", "stand"], taglineAccent: ["exactly"],
    taglineT: [0, 0.32, 0.62, 0.82, 1.35, 1.6, 1.85], perks: "free · works offline · no account",
  },
  rows: [
    { name: "White Oak", latin: "Quercus alba", n: 511, form: "tree" },
    { name: "Black Cherry", latin: "Prunus serotina", n: 340, form: "tree" },
    { name: "Serviceberry", latin: "Amelanchier canadensis", n: 119, form: "tree" },
    { name: "Wrinkleleaf Goldenrod", latin: "Solidago rugosa", n: 115, form: "perennial" },
  ],
  maxN: 511,
  // Serviceberry, feet — app/src/data/plants.mid-atlantic.ts
  chart: {
    unit: "ft", px: 32, grid: [5, 10, 15], human: 5.5, fmt: (v) => `${v} ft`,
    sizes: [{ y: 1, h: 2, s: 1 }, { y: 3, h: 5, s: 3 }, { y: 5, h: 9, s: 6 }, { y: 10, h: 15, s: 12 }],
    tallerCol: 3, tallerAt: [900, 520], tallerArrow: [1150, 540, 1250, 610],
  },
  birdColors: { body: "#b9b6ac", flank: "#e2b98a", wing: "#6f7470", belly: null },
  // What grows in the drawings: the showiest natives of the Mid-Atlantic list
  // (app/src/data/plants.mid-atlantic.ts), and the animals the app pairs with them.
  flora: {
    yard: [["grass", 600, 120, 0.0], ["cone", 660, 150, 0.15], ["gold", 735, 190, 0.3], ["aster", 820, 130, 0.1],
      ["weed", 1150, 110, 0.25], ["cardinal", 1225, 170, 0.5], ["grass", 1290, 110, 0.35], ["bergamot", 1360, 160, 0.2],
      ["susan", 1545, 130, 0.45], ["cone", 1610, 160, 0.3], ["grass", 1680, 120, 0.55], ["cardinal", 1750, 180, 0.4],
      ["aster", 1820, 120, 0.6], ["susan", 1100, 110, 0.55]],
    host: { x: 1150, h: 110, cat: { stripes: true, color: "#f4f1e6", head: "#1b1b1b" } }, // monarch caterpillar on butterfly weed
    tree: { leaf: "#79ad5a" },                                  // serviceberry
    flyers: ["monarch", "monarch", "monarch"],
    grand: "cone",
    windowBox: ["aster", "susan", "grass"],
    border: ["cone", "grass", "weed", "gold", "bergamot", "grass", "susan", "cardinal", "grass", "aster", "cone", "susan"],
  },
};

const FR = {
  // "Sulafat" take (ending re-voiced and spliced at 41.4 s), faster-whisper word timings
  cues: {
    green: 0.29, quiet: 2.58, because: 5.04, cats: 6.4, bird: 9.44, chicks: 11.24,
    name: 14.74, standing: 15.62, sun: 17.82, soil: 20.6, climate: 22.16,
    shows: 24.0, belong: 25.82, ranked: 26.88, scale: 28.88, howbig: 30.5,
    first: 33.28, grand: 35.42, anyone: 36.58, plain: 38.76, account: 39.66,
    plant: 41.44, foodweb: 43.56, logo: 47.14, tagline: 48.16, voEnd: 50.6,
  },
  s: {
    fig1: "fig. 1 — un jardin ordinaire", lawnRoots: "racines du gazon : 5 cm à peine", birdsong: "chants d'oiseaux",
    nothing: "…rien.", fig6: "fig. 6 — le même jardin, l'été suivant", deepRoots: "les racines indigènes plongent loin",
    singing: "…ça chante à nouveau.",
    fig2: "fig. 2 — qui mange quoi", oak: "chêne pédonculé, indigène", oakFeeds: "nourrit 391 espèces de chenilles",
    imported: "plante ornementale importée", importedNote: "presque rien ici ne s'en nourrit", bird: "une mésange charbonnière",
    nest1: "une nichée de mésanges :", nest2: "jusqu'à 500 chenilles par jour",
    fig3: "fig. 3 — lire un lieu", here: "vous êtes ici", am: "6 h", pm: "18 h", shade: "ombre",
    sunHours: "soleil : 5 à 7 h par jour", topsoil: "terre végétale", subsoil: "sous-sol argileux", rock: "roche et graviers",
    soil1: "sol : limon argileux", soil2: "pH 6,4 · drainage lent", climate1: "climat : zone 8b",
    climate2: "800 mm de pluie par an",
    fig4: "fig. 4 — classées, et à l'échelle", best: "Les plantes pour ce lieu", bestSub: "classées par espèces de chenilles nourries",
    feedsEach: "espèces de chenilles nourries par chacune", chartTitle: "Le merisier, à l'échelle",
    you: "Vous", youH: "1,68 m", year: (n) => (n === 1 ? "1 an" : `${n} ans`), taller: "plus grand que vous dès 3 ans",
    fig5: "fig. 5 — pour qui ?", firstTime: "jardiniers débutants", grandparents: "grands-parents",
    anyone: "tous ceux qui ont un bout de terre", jargon: "mi-ombre", plain: "⛅ Du soleil la moitié du jour",
    plainNote: "avec des mots simples", signUp: "inscription", password: "mot de passe",
    noAccount1: "Pas de compte, pas d'inscription.", noAccount2: "Rien qui vous identifie.",
    tagline: ["Des", "plantes", "indigènes", "faites", "pour", "ici"], taglineAccent: ["pour", "ici"],
    taglineT: [0, 0.3, 0.7, 1.34, 1.8, 2.16], perks: "gratuit · hors ligne · sans compte",
  },
  // Atlantic France, from app/src/data/plants.france-atlantic.ts (host counts
  // computed from the Gaytán 2026 matrix); names from locales/taxa.fr.ts
  rows: [
    { name: "Chêne pédonculé", latin: "Quercus robur", n: 391, form: "tree" },
    { name: "Saule marsault", latin: "Salix caprea", n: 377, form: "tree" },
    { name: "Merisier", latin: "Prunus avium", n: 318, form: "tree" },
    { name: "Prunellier", latin: "Prunus spinosa", n: 318, form: "shrub" },
  ],
  maxN: 391,
  // Merisier (Prunus avium), metres converted from the catalog's feet
  chart: {
    unit: "m", px: 80, grid: [2, 4, 6], human: 1.68, fmt: (v) => `${String(v).replace(".", ",")} m`,
    sizes: [{ y: 1, h: 0.6, s: 0.46 }, { y: 3, h: 1.8, s: 1.2 }, { y: 5, h: 3.7, s: 2.1 }, { y: 10, h: 7.3, s: 4.3 }],
    tallerCol: 2, tallerAt: [860, 560], tallerArrow: [1030, 580, 1085, 690],
  },
  // a great tit: olive back, yellow underparts, black stripe down the belly
  birdColors: { body: "#9fa77a", flank: "#e9cf45", wing: "#6d8491", belly: "#1c1c1a" },
  // Showy natives of the Atlantic France list: digitale pourpre, centaurée
  // noire, lotier corniculé, trèfle des prés, succise des prés, canche
  // cespiteuse; the hawthorn (aubépine) is the region's featured plant. The
  // brimstone's host (bourdaine) and the common blue's (lotier) are both on it.
  flora: {
    yard: [["hair", 600, 120, 0.0], ["fox", 665, 230, 0.15], ["knap", 745, 150, 0.3], ["clover", 820, 90, 0.1],
      ["trefoil", 1150, 70, 0.25], ["scab", 1225, 150, 0.5], ["hair", 1290, 110, 0.35], ["fox", 1370, 250, 0.2],
      ["knap", 1545, 140, 0.45], ["clover", 1610, 90, 0.3], ["hair", 1680, 120, 0.55], ["fox", 1750, 210, 0.4],
      ["scab", 1820, 140, 0.6], ["trefoil", 1090, 60, 0.55]],
    host: { x: 1150, h: 70, cat: { color: "#8fbf52", head: "#6d9a3a", segments: 7 } }, // common blue caterpillar on trefoil
    tree: { leaf: "#6f9f55" },                                  // hawthorn in flower
    flyers: ["brimstone", "blue", "brimstone"],
    grand: "fox",
    windowBox: ["scab", "knap", "hair"],
    border: ["fox", "hair", "knap", "trefoil", "clover", "hair", "scab", "knap", "hair", "fox", "clover", "scab"],
  },
};

// Add a language: write its object above (copy FR, the fuller example), list it
// here, and follow "Add a language" in film/README.md.
const LOCALES = { en: EN, fr: FR };
export const LANG = wanted in LOCALES ? wanted : "en";
export const I = LOCALES[LANG];
export const S = I.s;
