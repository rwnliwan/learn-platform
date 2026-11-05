import meta from "./lessonMeta.json";

// Metadata RAMPING untuk komponen client — PENGGANTI impor registry penuh
// di jalur client (lihat header scripts/gen-lesson-meta.mjs: registry penuh
// = konten ~26 MB yang dulu ikut ke shared chunk client 22 MB).
// File ini hanya membaca lessonMeta.json (~0,09 MB: judul, track,
// estMinutes). Judul per step TIDAK ada di sini — ia pindah ke
// lessonMetaSteps.json (~0,42 MB) yang HANYA dipakai /v2/kebingungan via
// dynamic import (lazy); halaman lain tidak pernah mengunduhnya. Konten
// penuh (prosa, quiz, lab) tetap dibaca server-side dari registry.ts.
// WAJIB regenerasi lessonMeta.json + lessonMetaSteps.json setiap kali
// konten lesson/misi/proyek berubah, sebelum deploy.

type SlimLesson = { t: string; tr: string; e: number };
type SlimMisi = { t: string; tr: string; e: number };
type SlimProyek = { t: string };

const DATA = meta as unknown as {
  lessons: Record<string, SlimLesson>;
  misi: Record<string, SlimMisi>;
  proyek: Record<string, SlimProyek>;
};

export interface LessonMeta {
  slug: string;
  title: string;
  track: string;
  estMinutes: number;
}

export interface MisiMeta {
  slug: string;
  title: string;
  track: string;
  estMinutes: number;
}

function toLessonMeta(slug: string, s: SlimLesson): LessonMeta {
  return {
    slug,
    title: s.t,
    track: s.tr,
    estMinutes: s.e,
  };
}

function toMisiMeta(slug: string, s: SlimMisi): MisiMeta {
  return {
    slug,
    title: s.t,
    track: s.tr,
    estMinutes: s.e,
  };
}

export function lessonMetas(): LessonMeta[] {
  return Object.entries(DATA.lessons).map(([slug, s]) => toLessonMeta(slug, s));
}

export function getLessonMeta(slug: string): LessonMeta | null {
  const s = DATA.lessons[slug];
  return s ? toLessonMeta(slug, s) : null;
}

export function misiMetas(): MisiMeta[] {
  return Object.entries(DATA.misi).map(([slug, s]) => toMisiMeta(slug, s));
}

export function getMisiMeta(slug: string): MisiMeta | null {
  const s = DATA.misi[slug];
  return s ? toMisiMeta(slug, s) : null;
}

/** judul proyek terpandu (stepMeta paths.ts hanya butuh judul) */
export function getProyekTitle(slug: string): string | null {
  return DATA.proyek[slug]?.t ?? null;
}

export function hasProyek(slug: string): boolean {
  return slug in DATA.proyek;
}
