// Generator manifest metadata ramping untuk komponen CLIENT.
// Latar: DashboardNav -> FocusPanel (dan Warisan/Kebingungan/Mulai/Peta
// via paths.ts) mengimpor registry PENUH (src/app/v2/content, ~26 MB
// source) padahal hanya butuh judul/track/estimasi/judul-step. Webpack
// menaruh seluruh konten itu ke satu shared chunk client ~22 MB yang
// dipakai 25 halaman v2 — kalau chunk itu gagal load di koneksi lambat,
// seluruh app crash (temuan N1 Instinct, Six-Site Recheck 2026-11-05).
// Manifest ini menggantikan impor registry di jalur client: judul, track,
// estMinutes, dan judul per step saja. Konten penuh tetap dibaca
// server-side dari registry.ts (generateStaticParams, halaman [slug],
// daftar lesson, review, karier, proyek, catatan) — tidak berubah.
// Output: src/app/v2/lib/lessonMeta.json — WAJIB regenerasi setiap kali
// konten lesson/misi/proyek berubah, sebelum deploy (pola yang sama
// seperti cardData.json untuk /api/v2/card).
// Pakai: ./node_modules/.bin/esbuild scripts/meta-entry.ts --bundle \
//   --format=esm --outfile=/tmp/metabundle.mjs --log-level=error && \
//   node scripts/gen-lesson-meta.mjs
import { writeFileSync } from "node:fs";
const m = await import("/tmp/metabundle.mjs");

const slimSteps = (steps) =>
  (steps ?? []).map((s) => [s.id, s.title]);

const lessons = {};
let noEst = 0;
for (const l of m.getV2Lessons()) {
  if (l.estMinutes === undefined || l.estMinutes === null) noEst++;
  lessons[l.slug] = {
    t: l.title,
    tr: l.track,
    e: l.estMinutes,
    s: slimSteps(l.steps),
  };
}

const misi = {};
for (const [slug, mis] of Object.entries(m.REG_MISI)) {
  misi[slug] = {
    t: mis.title,
    tr: mis.track,
    e: mis.estMinutes,
    s: slimSteps(mis.steps),
  };
}

const proyek = {};
for (const [slug, p] of Object.entries(m.PROYEK_REGISTRY)) {
  proyek[slug] = { t: p.title };
}

const out = { lessons, misi, proyek };
const json = JSON.stringify(out);
writeFileSync(
  new URL("../src/app/v2/lib/lessonMeta.json", import.meta.url),
  json
);
console.log(
  "lessonMeta.json:",
  Object.keys(lessons).length,
  "lesson,",
  Object.keys(misi).length,
  "misi,",
  Object.keys(proyek).length,
  "proyek,",
  (json.length / 1048576).toFixed(2),
  "MB, lesson tanpa estMinutes:",
  noEst
);
