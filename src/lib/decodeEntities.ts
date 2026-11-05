/**
 * decodeEntities — decode HTML entities in JS-string content.
 *
 * Why this exists (2026-10-13): quiz explanations and lab hints are passed as
 * JS string props and rendered via React expressions (`{explanation}`), where
 * React does NOT decode HTML entities (unlike JSX text children). Content
 * containing `&ldquo;` / `&lt;strong&gt;` therefore rendered literally.
 * Fix: decode before render. Content is own-generated, trusted.
 */
const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  ldquo: "\u201c",
  rdquo: "\u201d",
  lsquo: "\u2018",
  rsquo: "\u2019",
  laquo: "\u00ab",
  raquo: "\u00bb",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
  bull: "\u2022",
  middot: "\u00b7",
  dagger: "\u2020",
  Dagger: "\u2021",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
  euro: "\u20ac",
  pound: "\u00a3",
  yen: "\u00a5",
  plusmn: "\u00b1",
  times: "\u00d7",
  divide: "\u00f7",
  ne: "\u2260",
  le: "\u2264",
  ge: "\u2265",
  approx: "\u2248",
  infin: "\u221e",
  sum: "\u2211",
  prod: "\u220f",
  sqrt: "\u221a",
  alpha: "\u03b1",
  beta: "\u03b2",
  gamma: "\u03b3",
  delta: "\u03b4",
  epsilon: "\u03b5",
  zeta: "\u03b6",
  eta: "\u03b7",
  theta: "\u03b8",
  lambda: "\u03bb",
  mu: "\u03bc",
  nu: "\u03bd",
  pi: "\u03c0",
  rho: "\u03c1",
  sigma: "\u03c3",
  tau: "\u03c4",
  phi: "\u03c6",
  chi: "\u03c7",
  omega: "\u03c9",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Sigma: "\u03a3",
  Omega: "\u03a9",
};

export function decodeEntities(s: string): string {
  if (!s || s.indexOf("&") === -1) return s;
  return s.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (_m, body: string) => {
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      if (!isNaN(code)) {
        try {
          return String.fromCodePoint(code);
        } catch {
          return _m;
        }
      }
      return _m;
    }
    return NAMED[body] ?? _m;
  });
}
