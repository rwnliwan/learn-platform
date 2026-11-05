import meta from "./lessonMeta.json";

// Metadata RAMPING untuk komponen client — PENGGANTI impor registry penuh
// di jalur client (lihat header scripts/gen-lesson-meta.mjs: registry penuh
// = konten ~26 MB yang dulu ikut ke shared chunk client 22 MB).
// File ini hanya membaca lessonMeta.json (0,49 MB: judul, track,
// estMinutes, judul per step). Konten penuh (prosa, quiz, lab) TIDAK ada
// di sini dan tetap dibaca server-side dari registry.ts.
// WAJIB regenerasi lessonMeta.json setiap kali konten lesson/misi/proyek
// berubah, sebelum deploy.

type SlimStep = [string, string];
type SlimLesson = { t: string; tr: string; e: number; s: SlimStep[] };
type SlimMisi = { t: string; tr: string; e: number; s: SlimStep[] };
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
  steps: { id: string; title: string }[];
}

export interface MisiMeta {
  slug: string;
  title: string;
  track: string;
  estMinutes: number;
  steps: { id: string; title: string }[];
}

function toLessonMeta(slug: string, s: SlimLesson): LessonMeta {
  return {
    slug,
    title: s.t,
    track: s.tr,
    estMinutes: s.e,
    steps: s.s.map(([id, title]) => ({ id, title })),
  };
}

function toMisiMeta(slug: string, s: SlimMisi): MisiMeta {
  return {
    slug,
    title: s.t,
    track: s.tr,
    estMinutes: s.e,
    steps: s.s.map(([id, title]) => ({ id, title })),
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
