// Compile the repo's CHANGELOG.md into the public "What's new" page — a
// single, static, dependency-free HTML file styled like the app.
//
//   npm run release-notes            (writes dist/release-notes/index.html)
//   node scripts/build-release-notes.mjs --out <path>
//
// The changelog is the single source of truth. This script publishes the
// Added / Changed / Fixed / Removed / Deprecated / Security bullets of every
// *released* version verbatim, so those bullets must already read well for a
// general audience (that's the deal documented at the top of CHANGELOG.md).
// The `Unreleased` section and bullets starting with "Internal:" (developer
// housekeeping, recorded in the changelog but irrelevant to readers of the
// page) never leave the repo.
//
// It fails loudly on anything it can't parse — a malformed heading or an
// unknown section name breaks the Pages deploy rather than publishing a
// half-rendered page.
import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { foldFragments, readFragments, reportFragmentError } from "./_changelog.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");
const CHANGELOG = resolve(REPO, "CHANGELOG.md");
const outFlag = process.argv.indexOf("--out");
const OUT =
  outFlag !== -1
    ? resolve(process.cwd(), process.argv[outFlag + 1])
    : resolve(HERE, "../dist/release-notes/index.html");

// Keep a Changelog change types, published under their own names — KAC's
// vocabulary is already plain words, and inventing friendlier synonyms
// ("Improved") is exactly the drift KAC exists to prevent.
const SECTIONS = ["Added", "Changed", "Fixed", "Removed", "Deprecated", "Security"];

// A bullet in any section can be marked as developer housekeeping; it stays
// in the changelog and is cleaned out when compiling the public page. The
// bold form is accepted because four bullets were written `**Internal:**` and
// published to everyone — the mark is a promise, so it can't hinge on
// asterisks.
const INTERNAL = /^\*{0,2}Internal:\*{0,2}\s/;

// A published bullet is one change, said once. The ceiling is enforced because
// the alternative — a rule in CLAUDE.md and nothing checking it — is how these
// notes drifted to a 65-word median and a 273-word worst case in the first
// place. Aim for ~35; 50 is the wall, not the target. Link addresses don't
// count (they aren't read), and `Internal:` bullets are exempt: nobody outside
// the repo reads them, and their reasoning is the point.
const MAX_WORDS = 50;
const countWords = (bullet) => bullet.replace(/\]\([^)]*\)/g, "]").split(/\s+/).filter(Boolean).length;

// Repo-relative links/images (e.g. docs/screenshots/pr-36/thumb.png) resolve
// against raw.githubusercontent so committed screenshots can be shown and
// linked directly — GitHub serves them CDN-cached with correct content types.
const RAW_BASE = "https://raw.githubusercontent.com/olivierlacan/indigene/main/";

// Where the compiled notes live once deployed. Every release also gets a page
// of its own at <version>/ — a stable, shareable address for one release
// ("what shipped in 0.12") instead of an anchor partway down a growing list.
// Both the index and each release page declare a canonical URL built from
// this, so search engines and link previews credit one address per release
// rather than treating the index and its anchors as duplicates.
const SITE = "https://indigene.app/release-notes/";
const resolveUrl = (url) =>
  /^(https?:|mailto:|#|\/|\.\.?\/)/.test(url) ? url : RAW_BASE + url;

// One optional thumbnail per release — a linked image on its own line in the
// release's header zone: [![alt](thumb-path)](full-path)
const THUMB = /^\[!\[(?<alt>[^\]]*)\]\((?<thumb>[^)\s]+)\)\]\((?<full>[^)\s]+)\)$/;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fail(msg) {
  console.error(`build-release-notes: ${msg}`);
  process.exit(1);
}

// ---------- what's new to *you* ----------
//
// The page marks the releases that have landed since a reader last read it, and
// the app puts a green dot on its menu while any are unmarked. Both sides read
// one localStorage record; `src/lib/visits.ts` is where it's defined and
// explained, and the script below is the mirror it warns about. Keep the key
// and the field names identical — they are the entire contract between a
// bundled TypeScript module and a static file with no bundle behind it.
const VISITS_KEY = "indigene.visits";

/**
 * The reader-facing script, injected into every page this builds.
 *
 * Deliberately at the end of `<body>`: by then every `<article>` is parsed, so
 * the marks are applied in the same frame the page first paints rather than
 * flickering on afterwards. It reads before it writes, because writing first
 * would mark everything seen and leave nothing to highlight.
 *
 * No template literals in here — this string is itself inside one.
 */
const CLIENT_SCRIPT = `
(function () {
  var KEY = ${JSON.stringify(VISITS_KEY)};
  function cmp(a, b) {
    var pa = String(a).split("."), pb = String(b).split(".");
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
      var x = Number(pa[i] || 0), y = Number(pb[i] || 0);
      if (isNaN(x) || isNaN(y)) return 0;
      if (x !== y) return x < y ? -1 : 1;
    }
    return 0;
  }
  var store = {};
  try {
    var raw = localStorage.getItem(KEY);
    var parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") store = parsed;
  } catch (e) {
    // Private browsing or a blocked store. Nothing is marked, nothing breaks —
    // the page is a list of releases either way.
    return;
  }
  var seen = store.seenVersion;
  var articles = [].slice.call(document.querySelectorAll("article.release[data-version]"));
  if (!articles.length) return;

  // A first-ever reader has no "since last time", so nothing is marked: the
  // whole page is new to them and saying so about all nineteen releases would
  // teach them the mark means nothing. This matches the app, which starts a
  // first visit level with today's release (see lib/visits.ts).
  var fresh = seen ? articles.filter(function (a) { return cmp(a.dataset.version, seen) > 0; }) : [];

  for (var i = 0; i < fresh.length; i++) {
    fresh[i].classList.add("is-new");
    var flag = document.createElement("p");
    flag.className = "new-flag";
    flag.textContent = "New since your last visit";
    var header = fresh[i].querySelector("header");
    if (header) header.appendChild(flag);
  }

  // One line, always. A sentence plus a pill button cannot share a row at
  // 360px — measured, not guessed — and a notice that wraps to three lines to
  // announce two releases is louder than what it's announcing. So the whole
  // notice IS the control: a single line saying how many are waiting, and
  // pressing it starts you at the oldest of them.
  //
  // Except when only one is waiting, where there is nowhere to jump: the one
  // unread release is already the next thing on the page. Then it's a plain
  // line that says so, with nothing to press.
  var bar = document.getElementById("since-last-visit");
  if (bar && fresh.length) {
    var count = fresh.length;
    var oldest = fresh[fresh.length - 1];
    var words =
      count === 1
        ? "1 release since your last visit"
        : count + " releases since your last visit";
    if (count === 1) {
      var line = document.createElement("p");
      line.className = "since-line";
      line.textContent = words;
      bar.appendChild(line);
    } else {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "since-jump";
      // The visible label is the count and nothing else, so it holds one line
      // on the narrowest phone whatever the number grows to; the accessible
      // name is where "and pressing it takes you there" gets said.
      btn.textContent = words;
      btn.setAttribute(
        "aria-label",
        count + " releases since your last visit — go to the oldest one you haven't read",
      );
      btn.addEventListener("click", function () {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        oldest.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        // Focus follows the scroll, so a keyboard or screen-reader user arrives
        // where a sighted one is looking rather than at the top of the page.
        oldest.setAttribute("tabindex", "-1");
        oldest.focus({ preventScroll: true });
      });
      bar.appendChild(btn);
    }
    bar.hidden = false;
  }

  // Reading the page is what marks it read. The newest version *on this page*
  // is the high-water mark, so a release's own page counts for that release —
  // and an old release's page can never drag the mark backwards.
  var newest = articles.map(function (a) { return a.dataset.version; })
    .reduce(function (best, v) { return cmp(v, best) > 0 ? v : best; });
  if (!seen || cmp(newest, seen) > 0) {
    store.seenVersion = newest;
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  }
})();
`;

/**
 * The picture viewer, injected into every page this builds.
 *
 * The app opens a photograph in place rather than throwing the reader out to
 * the file (`components/lightbox.ts`); a release's Before/After links used to
 * do the opposite — navigate away to a bare PNG on raw.githubusercontent, with
 * the browser's back button as the only way home. This is that lightbox, cut
 * down to what a static page needs: the ‹ › buttons, the ← → keys and a swipe,
 * all paging the same reel, with Escape / ✕ / the backdrop / a swipe down to
 * dismiss.
 *
 * A "reel" is one release's pictures. It's read off the markup — every anchor
 * with `data-lb` naming its release, `data-lb-i` its place in the reel — so
 * there is no second copy of the list to drift out of step, and every anchor
 * keeps working (as a plain link to the image) when this script doesn't run.
 *
 * No template literals in here — this string is itself inside one.
 */
const LIGHTBOX_SCRIPT = `
(function () {
  var links = [].slice.call(document.querySelectorAll("a[data-lb]"));
  if (!links.length) return;

  // group -> [{src, label}], in reel order, from the anchors themselves.
  var reels = {};
  links.forEach(function (a) {
    var g = a.getAttribute("data-lb");
    var i = Number(a.getAttribute("data-lb-i"));
    if (isNaN(i)) return;
    (reels[g] = reels[g] || [])[i] = {
      src: a.getAttribute("href"),
      label: a.getAttribute("data-lb-label") || "",
    };
  });

  var overlay = null, parts = null, frames = [], index = 0, returnFocus = null;
  var resetDrag = null, paintToken = 0;

  function build() {
    function make(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text) e.textContent = text;
      return e;
    }
    var img = make("img", "lb-img");
    img.alt = "";
    var caption = make("p", "lb-caption");
    var counter = make("span", "lb-counter");
    var prev = make("button", "lb-nav lb-prev", "\\u2039");
    var next = make("button", "lb-nav lb-next", "\\u203a");
    var closeBtn = make("button", "lb-close", "\\u2715");
    prev.setAttribute("aria-label", "Previous picture");
    next.setAttribute("aria-label", "Next picture");
    closeBtn.setAttribute("aria-label", "Close");
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    closeBtn.addEventListener("click", close);

    var stage = make("div", "lb-stage");
    stage.append(prev, img, next);
    var foot = make("div", "lb-foot");
    foot.append(caption, counter);
    var panel = make("div", "lb-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Picture viewer");
    panel.addEventListener("click", function (e) { e.stopPropagation(); });
    panel.append(closeBtn, stage, foot);
    var root = make("div", "lb-overlay");
    root.addEventListener("click", close);
    root.append(panel);
    parts = { img: img, caption: caption, counter: counter, prev: prev, next: next, stage: stage, panel: panel, root: root };
    swipe(stage, img, panel, root);
    return root;
  }

  function open(group, i, from) {
    var reel = reels[group];
    if (!reel || !reel.length) return;
    frames = reel;
    index = i;
    returnFocus = from || null;
    if (!overlay) overlay = build();
    document.body.append(overlay);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    paint();
    parts.closeFocus = true;
    overlay.querySelector(".lb-close").focus();
  }

  function close() {
    if (!overlay) return;
    if (resetDrag) resetDrag();
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
    overlay.remove();
    if (returnFocus && returnFocus.focus) returnFocus.focus();
    returnFocus = null;
  }

  function step(delta) {
    if (!frames.length) return;
    index = (index + delta + frames.length) % frames.length;
    paint();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  }

  function paint() {
    var frame = frames[index];
    var token = ++paintToken;
    var img = parts.img;
    img.classList.remove("lb-img-ready");
    parts.stage.classList.add("lb-loading");
    img.src = frame.src;
    img.alt = frame.label;
    var done = function () {
      if (token !== paintToken) return;
      parts.stage.classList.remove("lb-loading");
      img.classList.add("lb-img-ready");
    };
    if (img.complete && img.naturalWidth) done();
    else img.onload = done;
    img.onerror = done;
    parts.caption.textContent = frame.label;
    parts.counter.textContent = frames.length > 1 ? index + 1 + " / " + frames.length : "";
    var solo = frames.length < 2;
    parts.prev.hidden = solo;
    parts.next.hidden = solo;
  }

  // Sideways pages the reel, downwards puts the viewer away — the same two
  // gestures, thresholds and behaviour as the app's lightbox. Touch and pen
  // only: a mouse drag on a picture already means something else.
  function swipe(stage, img, panel, root) {
    var SWIPE_MIN = 48, FLICK_MIN = 20, FLICK_MS = 300, DISMISS_MIN = 110,
        DISMISS_FLICK = 45, INTENT_MIN = 8, FOLLOW = 0.35, UP_FOLLOW = 0.2,
        FADE_OVER = 420, BACKDROP = 0.86, BACKDROP_MIN = 0.3;
    var startX = 0, startY = 0, startedAt = 0, tracking = false, axis = "";
    var reset = function () {
      tracking = false;
      axis = "";
      img.classList.remove("lb-img-dragging");
      panel.classList.remove("lb-panel-dragging");
      img.style.transform = "";
      panel.style.transform = "";
      root.style.backgroundColor = "";
    };
    resetDrag = reset;
    stage.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" || !e.isPrimary) return;
      tracking = true;
      axis = "";
      startX = e.clientX;
      startY = e.clientY;
      startedAt = e.timeStamp;
    });
    stage.addEventListener("pointermove", function (e) {
      if (!tracking) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (!axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < INTENT_MIN) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (frames.length < 2) { reset(); return; }
          axis = "x";
          img.classList.add("lb-img-dragging");
        } else {
          axis = "y";
          panel.classList.add("lb-panel-dragging");
        }
        if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
      }
      if (axis === "x") {
        img.style.transform = "translateX(" + dx * FOLLOW + "px)";
      } else {
        var travel = dy > 0 ? dy : dy * UP_FOLLOW;
        panel.style.transform = "translateY(" + travel + "px)";
        var shade = BACKDROP - (BACKDROP - BACKDROP_MIN) * Math.min(Math.max(travel, 0) / FADE_OVER, 1);
        root.style.backgroundColor = "rgba(0, 0, 0, " + shade.toFixed(3) + ")";
      }
    });
    stage.addEventListener("pointerup", function (e) {
      if (!tracking) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      var quick = e.timeStamp - startedAt < FLICK_MS;
      var was = axis;
      reset();
      if (was === "x") {
        if (Math.abs(dx) >= SWIPE_MIN || (quick && Math.abs(dx) >= FLICK_MIN)) step(dx < 0 ? 1 : -1);
      } else if (was === "y") {
        if (dy >= DISMISS_MIN || (quick && dy >= DISMISS_FLICK)) close();
      }
    });
    stage.addEventListener("pointercancel", reset);
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      // Leave the modified clicks alone: opening the raw picture in a new tab
      // is a reasonable thing to want, and the href is still the picture.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      open(a.getAttribute("data-lb"), Number(a.getAttribute("data-lb-i")), a);
    });
  });
})();
`;

// ---------- parse ----------

/** @returns {{version: string, date: string, name: string|null,
 *             sections: {title: string, items: string[]}[]}[]} */
function parseChangelog(text) {
  const releases = [];
  let release = null; // current release (null while in the preamble/Unreleased)
  let section = null; // current {title, items} within `release`
  let expectName = false; // next paragraph may be the release's bold name

  // Unreleased is never published, but its bullets are still collected — the
  // length check has to bite in the PR that writes the entry, not months later
  // when the version is cut.
  const unreleased = { version: "Unreleased", sections: [] };
  let inUnreleased = false;

  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");

    const h2 = line.match(/^## (.*)$/);
    if (h2) {
      section = null;
      if (h2[1] === "[Unreleased]") {
        release = null; // parsed but never published
        inUnreleased = true;
        continue;
      }
      inUnreleased = false;
      const m = h2[1].match(/^\[(\d+\.\d+(?:\.\d+)?)\] - (\d{4})-(\d{2})-(\d{2})$/);
      if (!m) fail(`unrecognized release heading: "${line}"`);
      const [, version, y, mo, d] = m;
      release = {
        version,
        date: `${MONTHS[Number(mo) - 1]} ${Number(d)}, ${y}`,
        name: null,
        thumb: null,
        shotLinks: null,
        sections: [],
      };
      releases.push(release);
      expectName = true;
      continue;
    }

    const h3 = line.match(/^### (.*)$/);
    if (h3) {
      expectName = false;
      if (!SECTIONS.includes(h3[1])) {
        fail(
          `unknown section "### ${h3[1]}" under ${release?.version ?? "Unreleased"} — ` +
            `expected one of: ${SECTIONS.join(", ")}`,
        );
      }
      if (release === null) {
        // Unreleased content: validated, never published.
        section = null;
        if (inUnreleased) {
          section = { title: h3[1], items: [] };
          unreleased.sections.push(section);
        }
        continue;
      }
      section = { title: h3[1], items: [] };
      release.sections.push(section);
      continue;
    }

    if (release && expectName) {
      const name = line.match(/^\*\*(.+)\*\*$/);
      if (name) {
        release.name = name[1];
        expectName = false;
        continue;
      }
      if (line !== "") expectName = false;
    }

    // Header zone (between the version heading and its first `###`): may hold
    // the thumbnail and, right after it, a line of screenshot text links
    // (e.g. "[Before](…) · [After](…)"). At most ONE image per release — the
    // don't-overcrowd rule, enforced.
    if (release && section === null && release.sections.length === 0) {
      const img = line.match(THUMB);
      if (img) {
        if (release.thumb) {
          fail(
            `release ${release.version} has more than one image — ` +
              `the What's new page allows one thumbnail per release`,
          );
        }
        release.thumb = { alt: img.groups.alt, thumb: img.groups.thumb, full: img.groups.full };
        continue;
      }
      if (/^!\[/.test(line)) {
        fail(
          `release ${release.version}: bare image "${line}" — write it as a ` +
            `linked thumbnail: [![alt](thumb.png)](full.png)`,
        );
      }
      if (release.thumb && !release.shotLinks && /^\[/.test(line)) {
        release.shotLinks = line;
        continue;
      }
    }

    if (section) {
      if (/^- /.test(line)) section.items.push(line.slice(2));
      else if (/^\s+\S/.test(line) && section.items.length > 0) {
        // continuation of a wrapped bullet
        section.items[section.items.length - 1] += " " + line.trim();
      }
    }
  }

  if (releases.length === 0) fail("no released versions found in CHANGELOG.md");

  // Length, before anything is filtered — a bullet nobody can read to the end
  // of is a bug in the release notes the same way a broken heading is.
  const tooLong = [];
  for (const r of [unreleased, ...releases]) {
    for (const s of r.sections) {
      for (const item of s.items) {
        if (INTERNAL.test(item)) continue;
        const n = countWords(item);
        if (n > MAX_WORDS) tooLong.push({ version: r.version, n, item });
      }
    }
  }
  if (tooLong.length) {
    for (const { version, n, item } of tooLong) {
      const opening = item.replace(/\s+/g, " ").slice(0, 72);
      console.error(`  ${version}: ${n} words — "${opening}…"`);
    }
    fail(
      `${tooLong.length} published bullet(s) over ${MAX_WORDS} words. These are ` +
        `read by everyone, and translated word for word — say the change, say ` +
        `who it's for, stop. Detail belongs on the page it describes, and ` +
        `developer reasoning belongs in an "Internal:" bullet.`,
    );
  }

  for (const r of releases) {
    // Clean developer housekeeping out of the public page. Filtering happens
    // after parsing so a marked bullet's wrapped continuation lines stay
    // attached to it, not to the previous bullet.
    for (const s of r.sections) s.items = s.items.filter((i) => !INTERNAL.test(i));
    if (r.sections.every((s) => s.items.length === 0)) {
      fail(`release ${r.version} has no publishable bullets`);
    }
  }
  return releases;
}

// ---------- render ----------

const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** Minimal inline markdown: links, bold, italic, code. Applied post-escape. */
function inline(md) {
  return escapeHtml(md)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => `<a href="${resolveUrl(url)}">${text}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

const anchor = (version) => "v" + version.replaceAll(".", "-");

// Thumbnails ship inside the notes folder (they're small and the page should
// render before raw.githubusercontent has the file); the full-size screenshots
// stay direct-linked from the repo. Copied once, shared by the index and the
// release's own page — which reaches it one directory up.
function copyThumb(r) {
  const source = resolve(REPO, r.thumb.thumb);
  if (!existsSync(source)) {
    fail(`release ${r.version}: thumbnail not found at ${r.thumb.thumb}`);
  }
  const local = `${anchor(r.version)}-thumb.png`;
  mkdirSync(dirname(OUT), { recursive: true });
  copyFileSync(source, resolve(dirname(OUT), local));
  return local;
}

/**
 * One release's card. On the index (`standalone: false`) its heading links to
 * the release's own page; on that page the heading is the page's `h1` and
 * links nowhere. `assets` prefixes the copied thumbnail so a release page one
 * directory down still finds it.
 */
function renderRelease(r, { standalone = false, assets = "" } = {}) {
  const parts = [];
  const tag = standalone ? "h1" : "h2";
  // `data-version` is what the reader-facing script compares against what this
  // browser last saw — the number, not the rendered heading, so the comparison
  // never depends on how the title happens to be worded.
  parts.push(
    `<article class="release" id="${anchor(r.version)}" data-version="${escapeHtml(r.version)}">`,
  );
  parts.push(`<header>`);
  const title = `Version ${escapeHtml(r.version)}`;
  parts.push(
    standalone
      ? `<${tag}>${title}</${tag}>`
      : `<${tag}><a class="permalink" href="${encodeURIComponent(r.version)}/">${title}</a></${tag}>`,
  );
  if (r.name) parts.push(`<p class="release-name">${inline(r.name)}</p>`);
  parts.push(`<p class="release-date">${escapeHtml(r.date)}</p>`);
  parts.push(`</header>`);
  if (r.thumb) {
    // The release's pictures are one reel: whatever the Before/After line
    // links to, in the order it names them, plus the thumbnail's own full-size
    // shot. Every anchor keeps its href — without JavaScript each one still
    // opens the image — and carries where it sits in the reel, so the viewer
    // can be built from the markup with no data blob to keep in step.
    const frames = [];
    const at = (url, label) => {
      const src = resolveUrl(url);
      const seen = frames.findIndex((f) => f.src === src);
      if (seen !== -1) return seen;
      frames.push({ src, label });
      return frames.length - 1;
    };
    const group = anchor(r.version);
    const lb = (i, label) =>
      ` data-lb="${group}" data-lb-i="${i}" data-lb-label="${escapeHtml(label)}"`;

    let shots = null;
    if (r.shotLinks) {
      shots = escapeHtml(r.shotLinks).replace(
        /\[([^\]]+)\]\(([^)\s]+)\)/g,
        (_, text, url) => `<a${lb(at(url, text), text)} href="${resolveUrl(url)}">${text}</a>`,
      );
    }
    // Added last: on a release whose thumbnail *is* the "after" shot, that's
    // one picture, not two — the thumbnail then opens the reel at it.
    const thumbAt = at(r.thumb.full, r.thumb.alt);
    parts.push(
      `<a class="thumb"${lb(thumbAt, frames[thumbAt].label)} href="${resolveUrl(r.thumb.full)}">` +
        `<img src="${assets}${r.thumb.local}" alt="${escapeHtml(r.thumb.alt)}"` +
        ` width="240" height="240" loading="lazy"></a>`,
    );
    if (shots) parts.push(`<p class="shots">${shots}</p>`);
  }
  for (const s of r.sections) {
    if (s.items.length === 0) continue;
    parts.push(`<h3>${escapeHtml(s.title)}</h3>`);
    parts.push(`<ul>`);
    for (const item of s.items) parts.push(`<li>${inline(item)}</li>`);
    parts.push(`</ul>`);
  }
  parts.push(`</article>`);
  return parts.join("\n");
}

// `root` is the way back to the app from this page's own directory — one level
// up from the index, two from a release's page. The footer's privacy link is
// the only thing that needs it, and it needs it right: a link into the app's
// privacy section that resolves inside /release-notes/ is a 404 on the one
// sentence promising the reader we're being straight with them.
function shell({ title, description, canonical, body, root = "../" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<style>
/* Tokens mirrored from app/src/styles.css so the page feels like the app. */
:root {
  --bg: #f7f5ef; --surface: #ffffff; --ink: #14140f; --ink-soft: #3d3d34;
  --line: #cfcabb; --brand: #175e33; --brand-ink: #0d3d20; --brand-bg: #e2efe4;
  --focus: #1747b3; --radius: 14px; --maxw: 34rem;
  color-scheme: light dark; font-size: 112.5%;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14160f; --surface: #1e2118; --ink: #f2f1e8; --ink-soft: #cdcdbd;
    --line: #3c4232; --brand: #7ec894; --brand-ink: #b9e6c6; --brand-bg: #1f3326;
    --focus: #8fb3ff;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}
main { max-width: var(--maxw); margin: 0 auto; padding: 1.5rem 1rem 3rem; }
h1 { line-height: 1.2; margin: 0.5rem 0; }
.lede { color: var(--ink-soft); margin: 0 0 0.75rem; }
.back { display: inline-block; margin: 0.25rem 0 1rem; color: var(--focus); }
a { color: var(--focus); }
a:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.release {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 1rem 1.25rem; margin: 1.25rem 0;
}
.release h1, .release h2 { margin: 0; font-size: 1.3rem; }
.release h2 .permalink { color: var(--brand-ink); text-decoration: none; }
.release h2 .permalink:hover, .release h2 .permalink:focus-visible {
  text-decoration: underline;
}
/* Older/newer release links at the foot of a single release's page. */
.pager {
  display: flex; flex-wrap: wrap; gap: 0.5rem 1rem;
  justify-content: space-between; margin: 1.25rem 0 0; font-size: 0.95rem;
}
.pager .newer { margin-left: auto; }
.release-name { margin: 0.15rem 0 0; font-weight: 700; color: var(--ink); }
.release-date { margin: 0.1rem 0 0; color: var(--ink-soft); font-size: 0.9rem; }
.thumb { display: block; width: fit-content; margin: 0.85rem auto 0; }
.thumb img {
  display: block; max-width: 100%; height: auto; border-radius: 10px;
  border: 1px solid var(--line);
}
.shots {
  margin: 0.35rem 0 0; text-align: center; color: var(--ink-soft);
  font-size: 0.85rem;
}
.shots a { color: var(--focus); }
/* --- The picture viewer (see LIGHTBOX_SCRIPT) ---------------------------
   Mirrored from the app's lightbox in app/src/styles.css, trimmed to the parts
   a release's Before/After reel uses. Always dark, in both colour schemes: it
   fills the screen with a picture, and a picture is best on black. --- */
.lb-overlay {
  position: fixed; inset: 0; z-index: 1000; background: rgba(0, 0, 0, 0.86);
  display: flex; align-items: center; justify-content: center;
  padding: max(0.75rem, env(safe-area-inset-top)) 0.75rem max(0.75rem, env(safe-area-inset-bottom));
  animation: lb-fade-in 0.18s ease-out;
  /* The background, not the overlay's opacity — fading the whole overlay makes
     the picture itself see-through, which reads as broken. Keep this alpha and
     BACKDROP in LIGHTBOX_SCRIPT in step. */
  transition: background-color 0.2s ease;
}
@keyframes lb-fade-in { from { opacity: 0; } }
@keyframes lb-spin { to { transform: rotate(360deg); } }
.lb-panel {
  position: relative; display: flex; flex-direction: column;
  max-width: 900px; height: 100%; width: 100%; gap: 0.6rem;
  transition: transform 0.2s ease;
}
/* While the finger is down, panel and backdrop track it exactly — the easing
   is for the snap back, not for the drag. */
.lb-panel.lb-panel-dragging, .lb-overlay:has(.lb-panel-dragging) { transition: none; }
.lb-close {
  position: absolute; top: -0.25rem; right: 0; z-index: 2;
  width: 2.4rem; height: 2.4rem; border: 0; border-radius: 999px;
  background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 1.1rem; cursor: pointer;
}
.lb-stage {
  position: relative; display: flex; align-items: center; justify-content: center;
  min-height: 0; flex: 1 1 auto;
  /* Every drag on the picture is ours; there's nothing to scroll behind it. */
  touch-action: none; overflow: hidden;
}
/* A quiet spinner while the picture arrives — these are full-size screenshots
   fetched from GitHub. The delay means a cached one never flashes it. */
.lb-stage::after {
  content: ""; position: absolute; width: 2rem; height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.25); border-top-color: rgba(255, 255, 255, 0.85);
  border-radius: 999px; opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
}
.lb-stage.lb-loading::after {
  opacity: 1; transition-delay: 0.25s; animation: lb-spin 0.8s linear infinite;
}
.lb-img {
  max-width: 100%; max-height: 72vh; object-fit: contain; border-radius: 8px;
  background: #111; opacity: 0;
  transition: opacity 0.3s ease, transform 0.2s ease;
  -webkit-user-drag: none; user-select: none;
}
.lb-img.lb-img-ready { opacity: 1; }
.lb-img.lb-img-dragging { transition: opacity 0.3s ease; }
.lb-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 2.6rem; height: 2.6rem; border: 0; border-radius: 999px;
  background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 1.6rem; line-height: 1;
  cursor: pointer;
}
.lb-nav[hidden] { display: none; }
.lb-prev { left: 0.3rem; }
.lb-next { right: 0.3rem; }
.lb-nav:focus-visible, .lb-close:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.lb-foot {
  flex: none; color: #f2f1e8; display: flex; flex-direction: column;
  gap: 0.4rem; text-align: center;
}
.lb-caption { margin: 0; font-size: 0.95rem; }
.lb-counter { font-size: 0.8rem; color: #b7b7a8; }
.release h3 {
  display: inline-block; margin: 1rem 0 0.25rem; padding: 0.1rem 0.6rem;
  background: var(--brand-bg); color: var(--brand-ink);
  border-radius: 999px; font-size: 0.85rem; letter-spacing: 0.02em;
}
.release ul { margin: 0.35rem 0 0.5rem; padding-left: 1.2rem; }
.release li { margin: 0.45rem 0; color: var(--ink-soft); }
.release li strong, .release li em { color: var(--ink); }
code {
  background: var(--brand-bg); color: var(--brand-ink);
  padding: 0.05rem 0.3rem; border-radius: 6px; font-size: 0.9em;
}
footer { color: var(--ink-soft); margin-top: 2rem; font-size: 0.9rem; }
/* --- What's new to *you* (see CLIENT_SCRIPT). Everything below is applied by
   that script; none of it exists for a reader who has never been here, or for
   one whose browser won't store anything. --- */
.since {
  background: var(--brand-bg); color: var(--brand-ink);
  border: 1px solid var(--brand); border-radius: var(--radius);
  margin: 1.25rem 0;
}
.since[hidden] { display: none; }
/* The whole box is the control when there's somewhere to jump to, so the
   padding belongs to the button rather than the box — otherwise the tap target
   is a ring of dead space around a line of text. */
.since-jump {
  display: block; width: 100%; text-align: left; cursor: pointer;
  font: inherit; font-weight: 650; font-size: 0.95rem;
  background: transparent; color: inherit; border: 0;
  border-radius: inherit; padding: 0.85rem 1rem; min-height: 3rem;
  /* One line is the whole point; the ellipsis is the belt-and-braces for a
     font or language that measures wider than the ones checked. */
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.since-jump:hover { background: rgba(127, 127, 127, 0.12); }
.since-jump:focus-visible { outline: 3px solid var(--focus); outline-offset: -3px; }
.since-line {
  margin: 0; padding: 0.85rem 1rem; font-weight: 650; font-size: 0.95rem;
}
/* The mark itself: a green edge down the release and a small line in its
   header. Subtle on purpose — it's an aid to finding your place, not an
   announcement, and it has to still read as the same page it was before. */
.release.is-new { border-left: 4px solid var(--brand); }
.release.is-new:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.new-flag {
  margin: 0.4rem 0 0; font-size: 0.8rem; font-weight: 650;
  color: var(--brand-ink); text-transform: none;
}
.new-flag::before { content: "● "; color: var(--brand); }
.privacy-line { margin-top: 0.6rem; }
</style>
</head>
<body>
<main>
${body}
<footer>
<p>Indigene is free, open source, and built on public data.
<a href="https://github.com/olivierlacan/indigene">See how it&rsquo;s made on GitHub</a>.</p>
<p class="privacy-line">The only thing this page remembers is which release you
had read, kept in this browser so it can mark what&rsquo;s new next time. No
account, no visit counter, nothing sent anywhere &mdash;
<a href="${root}#/privacy/whatsnew">how that works, in full</a>.</p>
</footer>
</main>
<script>${CLIENT_SCRIPT}</script>
<script>${LIGHTBOX_SCRIPT}</script>
</body>
</html>
`;
}

function renderIndex(releases) {
  return shell({
    title: "What's new — Indigene",
    description:
      "Everything new in Indigene, the free native-plant finder, described in plain words.",
    canonical: SITE,
    body: `<h1>What&rsquo;s new in Indigene</h1>
<p class="lede">Indigene is a free app that finds the plants that naturally
belong where you live. This page lists everything new in the app, newest
first, in plain words. The app updates itself, so whatever you read here is
already yours.</p>
<a class="back" href="../">&larr; Open Indigene</a>
<div class="since" id="since-last-visit" hidden></div>
${releases.map((r) => renderRelease(r)).join("\n")}`,
  });
}

// `releases` is newest-first, so the previous entry is the newer release.
function renderReleasePage(r, newer, older) {
  const pager = [];
  if (older) {
    pager.push(
      `<a class="older" href="../${encodeURIComponent(older.version)}/">&larr; Version ${escapeHtml(older.version)}</a>`,
    );
  }
  if (newer) {
    pager.push(
      `<a class="newer" href="../${encodeURIComponent(newer.version)}/">Version ${escapeHtml(newer.version)} &rarr;</a>`,
    );
  }
  return shell({
    root: "../../",
    title: `Version ${r.version}${r.name ? `: ${r.name}` : ""} — What's new in Indigene`,
    description: r.name
      ? `${r.name} — what changed in Indigene ${r.version}, released ${r.date}, in plain words.`
      : `What changed in Indigene ${r.version}, released ${r.date}, in plain words.`,
    canonical: `${SITE}${encodeURIComponent(r.version)}/`,
    body: `<a class="back" href="../">&larr; All releases</a>
${renderRelease(r, { standalone: true, assets: "../" })}
${pager.length ? `<nav class="pager">\n${pager.join("\n")}\n</nav>` : ""}`,
  });
}

// The changelog, plus every entry still sitting loose in `changelog.d/` (see
// _changelog.mjs for why they're loose). Folded in here rather than on disk, so
// a fragment is checked — its sections, its shape, its length — in the pull
// request that writes it. None of it reaches the page: Unreleased never does.
let releases;
try {
  releases = parseChangelog(foldFragments(readFileSync(CHANGELOG, "utf8"), readFragments(REPO)));
} catch (err) {
  reportFragmentError(err, "build-release-notes");
}

// The app decides whether to show its "something's new" dot by comparing the
// version it was built with (`package.json`, imported by `src/lib/visits.ts`)
// against what the reader last saw here. If that number and the newest release
// in the changelog ever disagree, the dot is wrong in one direction or the
// other — silently, and for everyone. CLAUDE.md already says to bump both when
// cutting a release; this is what makes forgetting a build failure instead of a
// bug nobody notices for a week.
{
  const pkg = JSON.parse(readFileSync(resolve(HERE, "../package.json"), "utf8"));
  const declared = pkg.version.replace(/\.0$/, "");
  if (declared !== releases[0].version) {
    fail(
      `app/package.json says version ${pkg.version} but the newest release in ` +
        `CHANGELOG.md is ${releases[0].version}. Bump package.json to match the ` +
        `release you just cut — the app reads it to know what's new.`,
    );
  }
}

mkdirSync(dirname(OUT), { recursive: true });
for (const r of releases) if (r.thumb) r.thumb.local = copyThumb(r);
writeFileSync(OUT, renderIndex(releases));
for (const [i, r] of releases.entries()) {
  const dir = resolve(dirname(OUT), r.version);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    resolve(dir, "index.html"),
    renderReleasePage(r, releases[i - 1], releases[i + 1]),
  );
}
console.log(
  `release notes: ${releases.length} versions (${releases[0].version} → ${releases[releases.length - 1].version}) → ${OUT}`,
);
console.log(
  `release pages: ${releases.map((r) => r.version + "/").join(" ")}`,
);
