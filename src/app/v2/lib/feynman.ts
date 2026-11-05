// Feynman Gate 2.0 — Gelombang N.
//
// Penilai "ajarkan kembali" (teknik Feynman) oleh AI untuk satu lesson.
// BUKAN pengunci progres: lesson tetap selesai seperti biasa; yang ditahan
// gate hanyalah lencana "Feynman: Lolos". Disengaja — AI bisa error/offline
// dan murid tidak boleh terkunci oleh kegagalan AI.
//
// Ekstraksi poin kunci deterministik dari konten lesson (bukan karangan):
// per langkah → judul + paragraf prose pertama + `why` opsi benar kuis
// pertama yang memilikinya. Riwayat attempt di localStorage `v2:feynman:<slug>`.

import type { V2Lesson } from "./types";

/** Penjelasan di bawah ini dianggap terlalu pendek untuk dinilai secara adil. */
export const FEYNMAN_MIN_CHARS = 280;

/** Batas ukuran konteks poin kunci yang dikirim ke AI (karakter). */
export const FEYNMAN_CONTEXT_MAX_CHARS = 6000;

export interface KeyPoint {
  stepId: string;
  stepTitle: string;
  text: string;
  /** "paragraf pertama langkah" | "penjelasan jawaban kuis" */
  source: string;
}

export interface KeyContext {
  lessonSlug: string;
  lessonTitle: string;
  points: KeyPoint[];
  /** Karakter terpakai dari budget. */
  totalChars: number;
  /** true bila ada poin yang terpotong karena budget habis. */
  truncated: boolean;
}

/**
 * Bangun konteks poin kunci dari lesson. Iterasi berurutan sehingga langkah
 * awal otomatis diprioritaskan saat budget habis. Deterministik.
 */
export function buildKeyContext(
  lesson: V2Lesson,
  maxChars: number = FEYNMAN_CONTEXT_MAX_CHARS
): KeyContext {
  const points: KeyPoint[] = [];
  let chars = 0;
  let truncated = false;

  const push = (pt: KeyPoint): boolean => {
    const len = pt.stepTitle.length + pt.text.length;
    if (chars + len > maxChars) {
      truncated = true;
      return false;
    }
    points.push(pt);
    chars += len;
    return true;
  };

  for (const step of lesson.steps) {
    if (truncated) break;
    if (step.prose.length > 0 && step.prose[0].trim()) {
      if (
        !push({
          stepId: step.id,
          stepTitle: step.title,
          text: step.prose[0].trim(),
          source: "paragraf pertama langkah",
        })
      )
        break;
    }
    const quizItem = (step.quiz ?? []).find((qq) =>
      qq.options.some((o) => o.correct && o.why.trim().length > 0)
    );
    const why = quizItem?.options.find((o) => o.correct)?.why.trim();
    if (why) {
      if (
        !push({
          stepId: step.id,
          stepTitle: step.title,
          text: why,
          source: "penjelasan jawaban kuis",
        })
      )
        break;
    }
  }

  return { lessonSlug: lesson.slug, lessonTitle: lesson.title, points, totalChars: chars, truncated };
}

/** Render konteks poin kunci sebagai teks untuk system prompt. */
export function renderKeyContext(ctx: KeyContext): string {
  const lines = [`LESSON: ${ctx.lessonTitle}`, "POIN KUNCI (dari konten lesson):"];
  for (const p of ctx.points) {
    lines.push(`- [${p.stepTitle}] (${p.source}): ${p.text}`);
  }
  return lines.join("\n");
}

export const FEYNMAN_SYSTEM_PROMPT = `Kamu adalah penilai teknik Feynman yang ketat namun adil. Seorang murid selesai membaca sebuah lesson, lalu menjelaskan kembali konsepnya dengan kata-katanya sendiri. Tugasmu: nilai penjelasan itu HANYA terhadap poin kunci lesson di bawah (jangan menilai hal di luar poin kunci).

POIN KUNCI:
{{KEY_POINTS}}

RUBRIK — beri skor 0-100 untuk tiap kriteria:
1. Akurasi konsep — tidak ada kesalahan faktual atau konseptual.
2. Kelengkapan poin kunci — seberapa banyak poin kunci yang tercakup.
3. Kejelasan & struktur — runtut, mudah diikuti, memakai bahasa sendiri (bukan tempelan teks).
4. Contoh/aplikasi — ada contoh konkret atau penerapan konsep.

ATURAN VERDICT:
- "lolos" hanya bila Akurasi dan Kelengkapan sama-sama kuat (tidak ada kesalahan berarti, mayoritas poin kunci tercakup).
- Selain itu "perbaiki", dengan "gaps" berisi daftar spesifik apa yang kurang/salah.
- Bila penjelasan sangat jauh dari topik lesson, verdict "perbaiki" dan jelaskan di feedback.

JAWAB HANYA dengan SATU objek JSON valid, tanpa teks lain sebelum atau sesudahnya:
{"verdict":"lolos","scores":{"akurasi":85,"kelengkapan":80,"kejelasan":90,"contoh":70},"gaps":[],"feedback":"..."}`;

/** System prompt lengkap dengan poin kunci lesson terisi. */
export function feynmanSystemPrompt(ctx: KeyContext): string {
  return FEYNMAN_SYSTEM_PROMPT.replace("{{KEY_POINTS}}", renderKeyContext(ctx));
}

/** Prompt user: penjelasan murid yang dinilai. */
export function feynmanUserPrompt(lessonTitle: string, text: string): string {
  return `Penjelasan murid tentang lesson "${lessonTitle}":\n\n"""\n${text}\n"""\n\nNilai penjelasan di atas terhadap poin kunci. Jawab hanya dengan objek JSON.`;
}

export interface FeynmanScores {
  akurasi: number;
  kelengkapan: number;
  kejelasan: number;
  contoh: number;
}

export interface FeynmanAssessment {
  verdict: "lolos" | "perbaiki";
  scores: FeynmanScores;
  gaps: string[];
  feedback: string;
}

export interface FeynmanAttempt extends FeynmanAssessment {
  ts: number;
  text: string;
}

export type FeynmanParseResult =
  | { ok: true; assessment: FeynmanAssessment }
  | { ok: false; raw: string };

/**
 * Parse respons AI menjadi penilaian. Tahan banting: strip code fence
 * ```json, ambil objek JSON pertama..terakhir, validasi bentuk ketat.
 * Bila gagal: kembalikan respons mentah — JANGAN mengarang skor.
 */
export function parseFeynmanResult(text: string): FeynmanParseResult {
  const noFence = text
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/```/g, "");
  const start = noFence.indexOf("{");
  const end = noFence.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return { ok: false, raw: text };
  }
  let obj: unknown;
  try {
    obj = JSON.parse(noFence.slice(start, end + 1));
  } catch {
    return { ok: false, raw: text };
  }
  if (typeof obj !== "object" || obj === null) return { ok: false, raw: text };
  const o = obj as Record<string, unknown>;
  if (o.verdict !== "lolos" && o.verdict !== "perbaiki") return { ok: false, raw: text };
  const s = o.scores as Record<string, unknown> | undefined;
  const num = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : null;
  const akurasi = num(s?.akurasi);
  const kelengkapan = num(s?.kelengkapan);
  const kejelasan = num(s?.kejelasan);
  const contoh = num(s?.contoh);
  if (akurasi === null || kelengkapan === null || kejelasan === null || contoh === null) {
    return { ok: false, raw: text };
  }
  if (!Array.isArray(o.gaps) || !o.gaps.every((g) => typeof g === "string")) {
    return { ok: false, raw: text };
  }
  if (typeof o.feedback !== "string") return { ok: false, raw: text };
  return {
    ok: true,
    assessment: {
      verdict: o.verdict,
      scores: { akurasi, kelengkapan, kejelasan, contoh },
      gaps: o.gaps as string[],
      feedback: o.feedback as string,
    },
  };
}

const storeKey = (slug: string) => `v2:feynman:${slug}`;
const ATTEMPTS_MAX = 20;

/** Baca riwayat attempt lesson (terbaru terakhir). */
export function loadFeynmanAttempts(slug: string): FeynmanAttempt[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(storeKey(slug));
    if (!raw) return [];
    const arr = JSON.parse(raw) as FeynmanAttempt[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Simpan satu attempt (append, capped). Mengembalikan daftar terbaru. */
export function saveFeynmanAttempt(slug: string, attempt: FeynmanAttempt): FeynmanAttempt[] {
  const arr = loadFeynmanAttempts(slug);
  arr.push(attempt);
  const trimmed = arr.length > ATTEMPTS_MAX ? arr.slice(arr.length - ATTEMPTS_MAX) : arr;
  try {
    localStorage.setItem(storeKey(slug), JSON.stringify(trimmed));
  } catch {
    /* best-effort */
  }
  return trimmed;
}

export type FeynmanStatus = "belum" | "perbaiki" | "lolos";

/** Status terbaik lesson: lolos bila PERNAH lolos. */
export function feynmanStatus(attempts: FeynmanAttempt[]): FeynmanStatus {
  if (attempts.length === 0) return "belum";
  return attempts.some((a) => a.verdict === "lolos") ? "lolos" : "perbaiki";
}
