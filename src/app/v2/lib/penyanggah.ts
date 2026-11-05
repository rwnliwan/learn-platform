// AI Penyanggah (devil's advocate) — Gelombang O.
//
// Latihan berpikir kritis: murid mengambil sebuah posisi (jawaban kuis atau
// klaim bebas tentang topik lesson), AI menyusun sanggahan terkuat terhadap
// posisi itu, murid menulis pembelaan, AI memberi vonis akhir.
//
// NON-BLOKIR dan NON-PENILAI: tidak mengubah skor kuis, progres lesson,
// atau kartu FSRS. AI TIDAK mengklaim jawaban benar sebagai salah secara
// faktual — yang diserang adalah kekuatan penalarannya (asumsi, edge case,
// interpretasi alternatif). Selalu dilabeli jelas sebagai latihan.
//
// Pola mengikuti feynman.ts: parser JSON tahan banting (gagal parse →
// respons mentah ditampilkan terlipat, TIDAK mengarang), store localStorage,
// localStorage hanya dibaca dari komponen (useEffect).

import type { V2QuizItem } from "./types";

/** Klaim bebas di mode bebas minimal sepanjang ini agar bisa disanggah adil. */
export const PENYANGGAH_MIN_CHARS = 120;

/** Cap sesi mode bebas per lesson. */
const FREE_SESSIONS_MAX = 10;

export interface Sanggahan {
  sanggahan: string;
  titik_lemah: string[];
  pertanyaan_balik: string;
}

export interface Vonis {
  bertahan: boolean;
  alasan: string;
  saran: string;
}

/** Satu sesi penyanggah: dari posisi sampai vonis (vonis opsional bila berhenti di tengah). */
export interface PenyanggahSession {
  ts: number;
  /** Ringkasan posisi murid (jawaban kuis / klaim bebas). */
  posisi: string;
  sanggahan: Sanggahan;
  pembelaan?: string;
  vonis?: Vonis;
}

export type PenyanggahParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; raw: string };

/**
 * Parse respons AI menjadi objek. Tahan banting: strip code fence,
 * ambil objek JSON pertama..terakhir, validasi bentuk ketat.
 * Bila gagal: kembalikan respons mentah — JANGAN mengarang.
 */
function parseJsonStrict<T>(text: string, validate: (o: Record<string, unknown>) => T | null): PenyanggahParseResult<T> {
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
  const value = validate(obj as Record<string, unknown>);
  if (!value) return { ok: false, raw: text };
  return { ok: true, value };
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Parse respons ronde 1 (sanggahan). */
export function parseSanggahan(text: string): PenyanggahParseResult<Sanggahan> {
  return parseJsonStrict(text, (o) => {
    if (!isNonEmptyString(o.sanggahan)) return null;
    if (!Array.isArray(o.titik_lemah) || o.titik_lemah.length === 0 || !o.titik_lemah.every(isNonEmptyString)) return null;
    if (!isNonEmptyString(o.pertanyaan_balik)) return null;
    return {
      sanggahan: (o.sanggahan as string).trim(),
      titik_lemah: (o.titik_lemah as string[]).map((s) => s.trim()),
      pertanyaan_balik: (o.pertanyaan_balik as string).trim(),
    };
  });
}

/** Parse respons ronde 2 (vonis). */
export function parseVonis(text: string): PenyanggahParseResult<Vonis> {
  return parseJsonStrict(text, (o) => {
    if (typeof o.bertahan !== "boolean") return null;
    if (!isNonEmptyString(o.alasan)) return null;
    if (typeof o.saran !== "string") return null;
    return {
      bertahan: o.bertahan,
      alasan: (o.alasan as string).trim(),
      saran: (o.saran as string).trim(),
    };
  });
}

// ── Prompt builder ─────────────────────────────────────────────────────────

export const PENYANGGAH_SYSTEM_R1 = `Kamu adalah penyanggah (devil's advocate) yang adil namun keras dalam sebuah latihan berpikir kritis. Seorang murid mengambil sebuah POSISI (jawaban kuis atau klaim tentang topik). Tugasmu: susun SANGGAHAN TERKUAT terhadap posisi itu — serang asumsi tersembunyi, edge case, dan interpretasi alternatif yang masuk akal.

ATURAN KERAS:
- Yang kamu uji adalah KEKUATAN PENALARAN, bukan fakta. Kebenaran faktual posisi sudah ditetapkan di konteks (lihat "STATUS POSISI"); JANGAN mengklaim posisi yang BENAR secara faktual sebagai salah.
- Bila posisi murid BENAR secara faktual: serang justru alasan, asumsi, dan kasus batasnya — mis. "kapan argumen ini justru gagal?" atau "asumsi tersembunyi apa yang membuatnya tampak benar?".
- Bila posisi murid SALAH secara faktual: susun sanggahan yang menunjukkan tepat di mana ia runtuh — sebagai tantangan latihan, bukan ceramah jawaban benar.
- Nada: tajam tapi suportif, seperti sparring partner. Bahasa Indonesia.

JAWAB HANYA dengan SATU objek JSON valid, tanpa teks lain sebelum atau sesudahnya:
{"sanggahan":"...","titik_lemah":["..."],"pertanyaan_balik":"..."}
- "sanggahan": paragraf sanggahan utama, 2-4 kalimat.
- "titik_lemah": 2-3 titik lemah spesifik dari posisi murid.
- "pertanyaan_balik": SATU pertanyaan tajam yang wajib dijawab murid dalam pembelaannya.`;

export interface QuizPosition {
  question: string;
  options: { label: string; text: string }[];
  userLabel: string;
  userText: string;
  userCorrect: boolean;
  correctLabel: string;
  correctText: string;
  correctWhy: string;
}

/** Susun posisi kuis dari data langkah (sudah dimuat Workspace). */
export function buildQuizPosition(quiz: V2QuizItem[], qIdx: number, userOptIdx: number): QuizPosition | null {
  const item = quiz[qIdx];
  if (!item || userOptIdx < 0 || userOptIdx >= item.options.length) return null;
  const correctIdx = item.options.findIndex((o) => o.correct);
  const label = (i: number) => String.fromCharCode(65 + i);
  return {
    question: item.q,
    options: item.options.map((o, i) => ({ label: label(i), text: o.text })),
    userLabel: label(userOptIdx),
    userText: item.options[userOptIdx].text,
    userCorrect: correctIdx >= 0 && userOptIdx === correctIdx,
    correctLabel: correctIdx >= 0 ? label(correctIdx) : "?",
    correctText: correctIdx >= 0 ? item.options[correctIdx].text : "(tidak ada kunci)",
    correctWhy: correctIdx >= 0 ? item.options[correctIdx].why.trim() : "",
  };
}

/** Prompt user ronde 1 untuk mode kuis. */
export function penyanggahUserPromptQuiz(lessonTitle: string, pos: QuizPosition): string {
  const opsi = pos.options.map((o) => `${o.label}) ${o.text}`).join("\n");
  return (
    `LESSON: "${lessonTitle}"\n` +
    `Pertanyaan kuis: "${pos.question}"\n` +
    `Opsi:\n${opsi}\n\n` +
    `POSISI MURID: opsi ${pos.userLabel}) "${pos.userText}"\n` +
    `STATUS POSISI: ${pos.userCorrect ? "BENAR" : "SALAH"} menurut kunci jawaban.\n` +
    (pos.userCorrect
      ? ""
      : `Kunci: opsi ${pos.correctLabel}) "${pos.correctText}". Alasan kunci: "${pos.correctWhy || "(tidak ada penjelasan)"}"\n`) +
    `\nSusun sanggahan terkuat terhadap POSISI MURID di atas (bukan terhadap kunci jawaban). Jawab hanya dengan objek JSON.`
  );
}

/** Prompt user ronde 1 untuk mode bebas. */
export function penyanggahUserPromptFree(lessonTitle: string, claim: string): string {
  return (
    `LESSON: "${lessonTitle}"\n` +
    `KLAIM/POSISI MURID tentang topik lesson ini:\n"""\n${claim}\n"""\n\n` +
    `STATUS POSISI: belum dinilai — anggap sebagai klaim yang perlu diuji penalarannya.\n\n` +
    `Susun sanggahan terkuat terhadap klaim di atas. Jawab hanya dengan objek JSON.`
  );
}

export const PENYANGGAH_SYSTEM_R2 = `Kamu adalah juri dalam latihan berpikir kritis. Murid telah menerima sanggahan atas posisinya, lalu menulis PEMBELAAN. Tugasmu: nilai HANYA kualitas pembelaannya — apakah ia menjawab titik lemah dan pertanyaan balik sanggahan, dan apakah alasannya koheren.

JAWAB HANYA dengan SATU objek JSON valid, tanpa teks lain sebelum atau sesudahnya:
{"bertahan":true,"alasan":"...","saran":"..."}
- "bertahan": true bila pembelaan secara masuk akal menjawab sanggahan; false bila posisi masih runtuh.
- "alasan": 1-2 kalimat penilaian pembelaan.
- "saran": 1 kalimat saran perbaikan — atau 1 kalimat penguat bila bertahan dengan sempurna.`;

/** Prompt user ronde 2 (vonis atas pembelaan). */
export function penyanggahUserPromptR2(posisi: string, sanggahan: Sanggahan, pembelaan: string): string {
  return (
    `POSISI AWAL MURID:\n"""\n${posisi}\n"""\n\n` +
    `SANGGAHAN YANG DITERIMA:\n${sanggahan.sanggahan}\n` +
    `Titik lemah: ${sanggahan.titik_lemah.join(" | ")}\n` +
    `Pertanyaan balik: ${sanggahan.pertanyaan_balik}\n\n` +
    `PEMBELAAN MURID:\n"""\n${pembelaan}\n"""\n\n` +
    `Beri vonis atas pembelaan di atas. Jawab hanya dengan objek JSON.`
  );
}

// ── Store localStorage ─────────────────────────────────────────────────────

const storeKey = (slug: string, konteksId: string) => `v2:penyanggah:${slug}:${konteksId}`;

export function quizKonteksId(stepId: string, qIdx: number): string {
  return `quiz:${stepId}:${qIdx}`;
}

function readJson<T>(key: string): T | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* best-effort */
  }
}

/** Satu sesi per soal kuis. null bila belum pernah disanggah. */
export function loadQuizSession(slug: string, konteksId: string): PenyanggahSession | null {
  const v = readJson<PenyanggahSession>(storeKey(slug, konteksId));
  return v && typeof v.ts === "number" && v.sanggahan ? v : null;
}

export function saveQuizSession(slug: string, konteksId: string, s: PenyanggahSession): void {
  writeJson(storeKey(slug, konteksId), s);
}

/** Riwayat sesi mode bebas per lesson (terbaru terakhir, cap 10). */
export function loadFreeSessions(slug: string): PenyanggahSession[] {
  const arr = readJson<PenyanggahSession[]>(storeKey(slug, "bebas"));
  return Array.isArray(arr) ? arr : [];
}

export function saveFreeSession(slug: string, s: PenyanggahSession): PenyanggahSession[] {
  const arr = loadFreeSessions(slug);
  // Upsert berdasarkan ts: sesi yang sama (mis. setelah vonis ditambahkan)
  // menggantikan entri lama, bukan menduplikasi.
  const idx = arr.findIndex((x) => x.ts === s.ts);
  if (idx >= 0) arr[idx] = s;
  else arr.push(s);
  const trimmed = arr.length > FREE_SESSIONS_MAX ? arr.slice(arr.length - FREE_SESSIONS_MAX) : arr;
  writeJson(storeKey(slug, "bebas"), trimmed);
  return trimmed;
}

/** Hapus sesi kuis (dipakai saat "Sesi baru" agar tidak bangkit lagi setelah reload). */
export function deleteQuizSession(slug: string, konteksId: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(storeKey(slug, konteksId));
  } catch {
    /* best-effort */
  }
}
