// How every iNaturalist photograph in the app is asked for, waited for, and
// shown. One module, because "which size, in what order, and how does it
// appear" is a single decision and it was previously made three times over —
// once per call site, each with a different answer.
//
// ## We were never downloading the full image, but we were downloading too much
//
// iNaturalist stores five renditions of every photo at fixed addresses
// (`…/photos/<id>/<size>.jpg`). Measured on a real pick:
//
//   square    75 px    7.6 KB
//   small    240 px     38 KB
//   medium   500 px    126 KB
//   large   1024 px    438 KB
//   original  full     1.7 MB
//
// `original` has never been requested anywhere in the app, and won't be. But
// the plant page's hero asked for `medium` unconditionally — 126 KB for a box
// drawn at most 152 CSS px wide. Right on a 3× phone, three times too much on a
// laptop, and far too much for the 72 px thumbnails the list pages now show.
// `renditionFor` picks the smallest rendition that still covers the slot at the
// screen's real pixel density, which is where nearly all of the saving is.
//
// ## Why there is no worker resizing images
//
// The tempting idea is to fetch a photo once and have a worker shrink it into a
// cached thumbnail. It cannot help: to shrink an image you must first download
// every byte of it, so the wait you are trying to avoid has already happened.
// It would also be strictly worse than what iNaturalist already offers — five
// pre-made sizes on a CDN, and asking for the small one costs 38 KB where
// downloading `medium` to shrink it costs 126 KB.
//
// So the browser does no image processing. It asks for the right size, the
// service worker keeps it forever (photo URLs are immutable), and the only
// local work is deciding *when* to ask.
//
// ## Keeping it snappy: three budgets
//
//   1. **Viewport.** A thumbnail is not requested until it is within
//      `NEAR_VIEWPORT` of the screen. The plants index lists ~190 plants; only
//      the handful you can nearly see ever costs anything.
//   2. **Concurrency.** At most `MAX_IN_FLIGHT` photo requests are open at
//      once, so a fast scroll can't queue a hundred JPEGs ahead of the soil and
//      climate lookups the app actually needs to answer with.
//   3. **The connection.** On a metered or slow connection the decorative
//      thumbnails don't load at all — the drawing stays, which was the whole
//      page a week ago — and the plant page's own hero steps down a size.
//
// ## And they fade
//
// Nothing is shown half-painted. Each image is decoded off-screen first
// (`decode()`), and only then faded up over its slot — which is already filled,
// either by the plant's drawing or by the photograph's own average colour
// (`color` on the pick, computed by `scripts/hero-colors.mjs`). So a slot never
// flashes empty, never jumps, and never shows a JPEG assembling itself.

/** The widths iNaturalist serves, smallest first. `original` is deliberately
 *  absent: it is megabytes, and nothing in the app is drawn big enough to need
 *  it. */
const RENDITIONS: Array<{ name: string; px: number }> = [
  { name: "square", px: 75 },
  { name: "small", px: 240 },
  { name: "medium", px: 500 },
  { name: "large", px: 1024 },
];

/** The size token is the last path segment of a photo URL. */
const SIZE_TOKEN = /\/(square|small|medium|large|original)\.(\w+)(\?.*)?$/;

/** How many photo requests may be open at once. Four is enough to keep a
 *  scrolling grid ahead of the reader on a phone, and few enough that a site
 *  lookup queued behind them still starts promptly. */
const MAX_IN_FLIGHT = 4;

/** How far outside the viewport a thumbnail starts loading — about half a phone
 *  screen, so it has landed by the time it scrolls into view without loading
 *  pages you never reach. */
const NEAR_VIEWPORT = "400px 0px";

/** How long one photo may hold a slot before the queue moves on without it.
 *  Long enough that a slow-but-working connection is never cut short, short
 *  enough that a genuinely stuck request costs the rest of the page a few
 *  seconds rather than everything. */
const SLOW = 8000;

/**
 * What the connection can afford.
 *
 * `full` — ask for the right size for the screen.
 * `thrifty` — a slow connection: step every photo down one rendition.
 * `essential` — Save-Data is on, or the connection is 2G: decorative
 *   thumbnails are skipped entirely and the drawings stay. The plant page's own
 *   hero still loads, at the smallest size that isn't a lie — it is the subject
 *   of the page, not decoration.
 *
 * Read fresh each time rather than cached: a phone moves between wifi and a
 * tunnel inside one session, and this is cheap.
 */
export type Budget = "full" | "thrifty" | "essential";

export function budget(): Budget {
  const c = (navigator as any).connection;
  if (!c) return "full";
  if (c.saveData) return "essential";
  const kind: string | undefined = c.effectiveType;
  if (kind === "slow-2g" || kind === "2g") return "essential";
  if (kind === "3g") return "thrifty";
  return "full";
}

/**
 * The URL of the smallest rendition that still covers a slot `slotPx` CSS pixels
 * wide on this screen. `step` shifts the answer down the ladder (a slow
 * connection asking for one size less than ideal).
 *
 * Device pixel ratio is honoured rather than capped: a 3× phone showing a 152 px
 * hero genuinely wants the 500 px file, and giving it the 240 px one is visibly
 * soft on exactly the devices this app is built for. The saving comes from the
 * slots that *don't* need it — a 72 px thumbnail wants `small` at 3×, and
 * `square` on a laptop.
 */
export function renditionFor(url: string, slotPx: number, step = 0): string {
  const want = slotPx * (window.devicePixelRatio || 1);
  let i = RENDITIONS.findIndex((r) => r.px >= want);
  if (i < 0) i = RENDITIONS.length - 1;
  i = Math.min(Math.max(i + step, 0), RENDITIONS.length - 1);
  return url.replace(SIZE_TOKEN, `/${RENDITIONS[i].name}.$2$3`);
}

interface Job {
  img: HTMLImageElement;
  url: string;
  /** The hero of a plant page goes before the thumbnails of a list. */
  urgent: boolean;
  /** Whether this job was queued by the observer, and so is known to have been
   *  on screen. See `pump` — it is what makes cancellation safe. */
  wasVisible: boolean;
}

let inFlight = 0;
const queued: Job[] = [];

/**
 * Start whatever the budget allows, urgent jobs first.
 *
 * A gated job whose image has since left the document — the reader scrolled
 * past and then routed away — is dropped without a request, the cheapest
 * cancellation there is. That test is deliberately *not* applied to urgent
 * jobs: `loadPhoto` is called while a page is still being assembled, so the
 * plant page's hero is legitimately not yet in the document when its job is
 * queued, and dropping it there would mean the hero never loaded at all.
 */
function pump(): void {
  while (inFlight < MAX_IN_FLIGHT && queued.length) {
    let at = queued.findIndex((j) => j.urgent);
    if (at < 0) at = 0;
    const job = queued.splice(at, 1)[0];
    if (job.wasVisible && !job.img.isConnected) continue;
    void run(job);
  }
}

async function run(job: Job): Promise<void> {
  inFlight++;
  const { img, url } = job;
  img.fetchPriority = job.urgent ? "high" : "low";
  img.src = url;

  // Decode before it is visible, so the fade reveals a finished picture rather
  // than a JPEG painting itself in bands. A failure is not ours to handle: the
  // image stays transparent, its alt text is already in the document, and the
  // drawing underneath it is still the answer.
  const decoded = img.decode().then(
    () => true,
    () => false, // broken URL, offline, or removed mid-flight
  );

  // …but never wait forever. One request that hangs — a phone drifting out of
  // signal mid-scroll — must not hold its slot and starve every photo behind
  // it; that is how a list ends up with four pictures and a hundred blanks.
  // Past `SLOW`, the slot goes back to the queue and this image simply finishes
  // in its own time, fading in whenever it lands. Giving up on the *photo* is
  // never what's wanted here, only on making the rest of the page wait for it.
  const inTime = await Promise.race([decoded, after(SLOW).then(() => null)]);
  if (inTime === true) reveal(img);
  else if (inTime === null) void decoded.then((ok) => ok && reveal(img));

  inFlight--;
  pump();
}

/** Two frames, so the opacity transition actually runs: the class has to land
 *  on an element whose starting opacity the browser has already computed. */
function reveal(img: HTMLImageElement): void {
  requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add("is-ready")));
}

const after = (ms: number): Promise<void> => new Promise((go) => setTimeout(go, ms));

/** One observer for the whole app: a thumbnail's job is held here until the
 *  thumbnail is nearly on screen, then handed to the queue. */
const waiting = new WeakMap<Element, Job>();
const nearby =
  typeof IntersectionObserver === "function"
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            release(entry.target);
            const job = waiting.get(entry.target);
            // It is on screen right now, so from here on "not in the document"
            // means the reader has moved on and the work can be dropped.
            if (job) queued.push(Object.assign(job, { wasVisible: true }));
          }
          pump();
        },
        { rootMargin: NEAR_VIEWPORT },
      )
    : null;

/**
 * Everything the observer is currently watching.
 *
 * This set exists because an `IntersectionObserver` holds its targets *by
 * strong reference*, and a target that is removed from the document is not
 * automatically dropped. The plants index rebuilds all ~190 of its cards on
 * every keystroke, so without a sweep, typing "milkweed" would leave a couple of
 * thousand detached images pinned in memory with the observer re-measuring them
 * on every frame.
 */
const observed = new Set<Element>();
/** Sweep once the watch-list is larger than a screenful could justify. Bigger
 *  than any real viewport's worth of thumbnails, small enough that a few
 *  keystrokes trigger a tidy-up. */
const SWEEP_AT = 300;

function release(target: Element): void {
  nearby?.unobserve(target);
  observed.delete(target);
}

/** Drop everything that has left the document since the last sweep. Checking
 *  `isConnected` on a few hundred nodes is microseconds; doing it never is a
 *  leak. */
function sweep(): void {
  for (const target of observed) {
    if (!target.isConnected) release(target);
  }
}

/**
 * Load `url` into an `<img>` that has no `src` yet, and fade it in when it is
 * ready. The image must already be in the document and styled `photo-fade`.
 *
 * `urgent` means "the reader is looking at this now" — the plant page's hero.
 * Urgent images skip the viewport wait and go to the front of the queue;
 * everything else waits until it is nearly on screen.
 */
export function loadPhoto(
  img: HTMLImageElement,
  url: string,
  slotPx: number,
  urgent = false,
): void {
  const level = budget();
  const job: Job = {
    img,
    url: renditionFor(url, slotPx, level === "full" ? 0 : -1),
    urgent,
    wasVisible: false,
  };
  if (urgent || !nearby) {
    queued.push(job);
    pump();
    return;
  }
  waiting.set(img, job);
  observed.add(img);
  nearby.observe(img);
  if (observed.size > SWEEP_AT) sweep();
}
