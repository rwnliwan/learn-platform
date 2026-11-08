// Generator manifest Knowledge Graph Navigator (/v2/peta, Gelombang J).
// Menjalankan bundle ter-esbuild lalu mengekstrak HANYA field yang dibutuhkan
// graf: judul/track per lesson, urutan lesson per track (lessonSortKey
// numeric-aware), daftar jalur + track yang tercakup, dan proyek terpandu
// (judul, track deklarasi konten, daftar skill).
// Output: src/app/v2/lib/kgData.json — di-commit (pola cardData.json).
// Client-side only: tidak ada fungsi edge baru, tidak ada impor registry penuh.
// Pakai: printf '%s' '<ENTRY>' > /tmp/kgentry.ts   (lihat bawah)
//   ./node_modules/.bin/esbuild /tmp/kgentry.ts --bundle --format=esm \
//   --outfile=/tmp/kgbundle.mjs --log-level=error && node scripts/gen-kg-data.mjs
// <ENTRY> =
// export { getV2Lessons, getV2Lesson } from "/home/hatch/workspace/learn-platform/src/app/v2/lib/registry";
// export { PATHS, pathSteps } from "/home/hatch/workspace/learn-platform/src/app/v2/lib/paths";
// export { PROYEK_REGISTRY } from "/home/hatch/workspace/learn-platform/src/app/v2/lib/reg-proyek";
// export { lessonSortKey } from "/home/hatch/workspace/learn-platform/src/app/v2/lib/career";
// (getV2Lesson tinggal di registry.ts, BUKAN paths.ts — header lama salah alamat,
//  membuat generator gagal "m.getV2Lesson is not a function"; diperbaiki 2026-11-08.)
import { writeFileSync } from "node:fs";

const m = await import("/tmp/kgbundle.mjs");

const lessons = m.getV2Lessons();
const lessonMap = {};
const trackOrder = {};
for (const l of lessons) {
  lessonMap[l.slug] = { t: l.title, tr: l.track };
  (trackOrder[l.track] ??= []).push(l.slug);
}
// urutan kurikulum per track = numeric-aware (a22 sebelum a210)
for (const tr of Object.keys(trackOrder)) {
  trackOrder[tr].sort((a, b) => {
    const ka = m.lessonSortKey(a);
    const kb = m.lessonSortKey(b);
    return ka[0] - kb[0] || (ka[1] < kb[1] ? -1 : ka[1] > kb[1] ? 1 : 0) || (ka[2] < kb[2] ? -1 : ka[2] > kb[2] ? 1 : 0);
  });
}

const paths = m.PATHS.map((p) => {
  const tracks = [];
  for (const s of m.pathSteps(p)) {
    if (s.kind !== "lesson") continue;
    const l = m.getV2Lesson(s.slug);
    const tr = l?.track;
    if (tr && !tracks.includes(tr)) tracks.push(tr);
  }
  return { id: p.id, name: p.name, desc: p.desc, tracks };
});

// Alias track yang dideklarasikan konten proyek ke nama track resmi registry.
// Ditemukan saat validasi silang: pj-aml-monitoring mendeklarasikan "Fraud/AML"
// padahal nama track resminya "Fraud & AML Analytics". Alasan relasi di UI
// tetap menyebut deklarasi aslinya agar bisa ditelusur.
const TRACK_ALIASES = {
  "Fraud/AML": "Fraud & AML Analytics",
};

const proyek = Object.values(m.PROYEK_REGISTRY).map((p) => ({
  slug: p.slug,
  t: p.title,
  tr: TRACK_ALIASES[p.track] ?? p.track,
  trDeclared: p.track,
  skills: p.skills ?? [],
}));

const out = {
  generated: "2026-11-08",
  lessons: lessonMap,
  trackOrder,
  paths,
  proyek,
};
const json = JSON.stringify(out);
writeFileSync(new URL("../src/app/v2/lib/kgData.json", import.meta.url), json);
const tracks = Object.keys(trackOrder);
console.log(
  "kgData.json:",
  lessons.length,
  "lesson,",
  tracks.length,
  "track,",
  paths.length,
  "jalur,",
  proyek.length,
  "proyek,",
  (json.length / 1024).toFixed(1),
  "KB"
);
// validasi silang: semua track jalur & proyek harus ada di trackOrder
const missing = new Set();
for (const p of paths) for (const t of p.tracks) if (!(t in trackOrder)) missing.add(`jalur:${p.id}->${t}`);
for (const p of proyek) if (!(p.tr in trackOrder)) missing.add(`proyek:${p.slug}->${p.tr}`);
if (missing.size) {
  console.error("TRACK TAK DIKENAL:", [...missing].join("; "));
  process.exit(1);
}
console.log("validasi relasi track: bersih");
