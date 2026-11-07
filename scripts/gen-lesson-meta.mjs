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
// Output: src/app/v2/lib/lessonMeta.json (ramping: judul/track/estMinutes
// SAJA, ~0,09 MB) + src/app/v2/lib/lessonMetaSteps.json (judul per step
// SAJA, ~0,42 MB). WAJIB regenerasi kedua file setiap kali konten
// lesson/misi/proyek berubah, sebelum deploy (pola yang sama seperti
// cardData.json untuk /api/v2/card).
// Alasan split (2026-11-05 malam): judul step 440 KB (82% file) HANYA
// dipakai halaman /v2/kebingungan — kalau ikut ke lessonMeta.json, ia
// masuk chunk client SEMUA halaman v2 (termasuk beranda) dan memblokir
// load di koneksi lambat. lessonMetaSteps.json di-load LAZY via dynamic
// import hanya oleh KebingunganClient; halaman lain tidak pernah
// mengunduhnya.
// Pakai: ./node_modules/.bin/esbuild scripts/meta-entry.ts --bundle \
//   --format=esm --outfile=/tmp/metabundle.mjs --log-level=error && \
//   node scripts/gen-lesson-meta.mjs
import { writeFileSync } from "node:fs";
const m = await import("/tmp/metabundle.mjs");

const slimSteps = (steps) =>
  (steps ?? []).map((s) => [s.id, s.title]);

// Modul bersama (spec topik-10-track.md §"Modul bersama"): ditulis sekali,
// dipakai banyak track — diberi tag `shared` di lessonMeta.json (sh: 1)
// dan DITUNDA duplikasi; track pemakai menautkan ke lesson ini.
// Daftar diverifikasi 2026-11-07 (gap audit Learn v2): 12 lesson.
const SHARED_SLUGS = new Set([
  "a312-survival-analysis", // dipakai Credit Risk, Health, Marketing
  "a37-imbalanced-data", // dipakai Credit Risk, Fraud, Health, Marketing
  "a28-multiple-testing", // dipakai Bioinformatics, Health, Marketing
  "a213-kausalitas", // dipakai Credit Risk, Health, Marketing
  "a313-kausal", // dipakai Credit Risk, Health, Marketing
  "a310-volatilitas", // GARCH; dipakai Market Risk, Portfolio Mgmt, Marketing
  "a36-kalibrasi", // dipakai Credit Risk, Fraud, Health, Marketing
  "a314-explainability", // dipakai Credit Risk, Fraud, Health, Marketing
  "b12-monte-carlo", // dipakai Credit Risk, Market Risk, Portfolio Mgmt
  "dm12-keamanan-privasi", // dipakai Fraud, Health, Marketing, Data Mgmt
  "c15-data-quality", // dipakai Credit Risk, Fraud, Health, Data Mgmt
  "dm7-kualitas-data", // dipakai Credit Risk, Fraud, Health, Data Mgmt
  "aie3-rag", // dipakai AE, AG, DL, ME (RAG dasar; ditaut dari dle24, mle28)
  "aie5-finetuning", // dipakai AE, AG, DL, ME (keputusan kapan fine-tune; ditaut dari dle20, mle26)
  "aie20-langchain-langgraph", // dipakai AE, AG (framework agen; ditaut dari aai10)
  "aie19-self-hosting-llm", // dipakai AE, ME, LO (ekonomi GPU/self-hosting; ditaut dari mle27, llmops13)
  "biz21-analytics-engineering", // dipakai BI, DE (dbt; ditaut dari biz14)
  "dba5-replikasi", // dipakai DBA (Patroni/HA; ditaut dari dba12)
  "c19-views", // dipakai SQL, Risk Reporting (view; ditaut dari rr33)
]);

const lessons = {};
const lessonSteps = {};
let noEst = 0;
for (const l of m.getV2Lessons()) {
  if (l.estMinutes === undefined || l.estMinutes === null) noEst++;
  lessons[l.slug] = {
    t: l.title,
    tr: l.track,
    e: l.estMinutes,
    ...(SHARED_SLUGS.has(l.slug) ? { sh: 1 } : {}),
  };
  lessonSteps[l.slug] = slimSteps(l.steps);
}

const misi = {};
const misiSteps = {};
for (const [slug, mis] of Object.entries(m.REG_MISI)) {
  misi[slug] = {
    t: mis.title,
    tr: mis.track,
    e: mis.estMinutes,
  };
  misiSteps[slug] = slimSteps(mis.steps);
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
const stepsOut = { lessons: lessonSteps, misi: misiSteps };
const stepsJson = JSON.stringify(stepsOut);
writeFileSync(
  new URL("../src/app/v2/lib/lessonMetaSteps.json", import.meta.url),
  stepsJson
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
console.log(
  "lessonMetaSteps.json:",
  (stepsJson.length / 1048576).toFixed(2),
  "MB"
);
