// A snapshot written one row per line.
//
// The wildlife checks commit a verdict per animal (and per tie) for every
// region. Pretty-printed, each row ran to a dozen lines, so 400 animals made a
// 20,000-line pull request that nobody could read. One row per line keeps the
// same content, and a changed verdict is still a one-line diff.
//
// `rowsKey` names the array that holds the rows; everything else in the
// document is written as usual.
export function snapshotJson(doc, rowsKey) {
  const { [rowsKey]: rows, ...head } = doc;
  // `{}` has no closing line to strip, so a document that is only rows opens
  // its own brace rather than inheriting a comma from nothing.
  const top = Object.keys(head).length ? `${JSON.stringify(head, null, 2).replace(/\n}$/, "")},` : "{";
  const body = (rows ?? []).map((r) => `    ${JSON.stringify(r)}`).join(",\n");
  return `${top}\n  "${rowsKey}": [\n${body}\n  ]\n}\n`;
}
