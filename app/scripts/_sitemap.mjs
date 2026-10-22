// sitemap.xml for the pages that have a file of their own. Pure, so
// `src/lib/sitemap.test.ts` can pin it.
//
// Some pages are reachable only from one other page (a post, a region's lawn
// picks), and a crawler that misses that page misses them too. The sitemap
// lists every address the prerenderer writes, plus the guide and the release
// notes, which are built after it.

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** `paths` are site-relative ("", "plants/white-oak", "guide/"). Duplicates are
 *  dropped; order is kept, so the home page leads. */
export function sitemapXml(origin, paths) {
  const urls = [...new Set(paths)].map((p) => `  <url><loc>${escape(`${origin}/${p}`)}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
