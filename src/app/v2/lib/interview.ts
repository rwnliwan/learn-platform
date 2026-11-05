// Interview Simulator — Gelombang Q (ide #3).
//
// Simulasi wawancara kerja: AI berperan sebagai pewawancara profesional,
// pengguna menjawab tiap pertanyaan, AI memberi umpan balik + skor per
// jawaban, lalu penilaian akhir saat sesi selesai.
//
// GROUNDING TOPIK: topik wawancara BUKAN karangan AI. Tiap peran dipetakan
// ke track kurikulum Learn v2 yang nyata, judul lesson diambil dari
// kgData.json, dan urutan topik dipilih kode lokal secara DETERMINISTIK
// (seeded shuffle dari peran+level+jumlah). AI dilarang keluar dari daftar.
//
// TOKEN DISCIPLINE (fitur paling boros; estimasi desain 20–35 rb token/sesi):
// riwayat dipangkas (maks 3 giliran terakhir + ringkasan skor), maxTokens 700
// per panggilan, temperature 0.7. Semua panggilan lewat chatComplete dengan
// feature "interview" — TIDAK ada client AI kedua.

import { chatComplete, type AiMessage } from "./ai";
import kgData from "./kgData.json";

/** Jumlah pertanyaan per sesi: pilihan pengguna 5 atau 8. */
export const INTERVIEW_MAX_QUESTIONS = 8;
export const INTERVIEW_MIN_QUESTIONS = 5;

export type InterviewLevel = "junior" | "mid";

export interface InterviewRole {
  id: string;
  label: string;
  /** Track kurikulum nyata yang relevan — sumber topik wawancara. */
  tracks: string[];
  desc: string;
}

export const INTERVIEW_ROLES: InterviewRole[] = [
  {
    id: "credit-risk",
    label: "Credit Risk Analyst",
    tracks: ["Credit Risk", "Statistika", "Probabilitas", "Financial Markets"],
    desc: "PD/LGD/EAD, scorecard, IFRS 9/PSAK 71, stress testing, validasi model.",
  },
  {
    id: "fraud-aml",
    label: "Fraud/AML Analyst",
    tracks: ["Fraud & AML Analytics", "SQL", "Python", "Data Management"],
    desc: "Deteksi structuring, KYC/CDD, feature engineering fraud, evaluasi model.",
  },
  {
    id: "risk-reporting",
    label: "Risk Reporting Analyst",
    tracks: ["Risk Reporting", "SQL", "Business Intelligence", "Portfolio Management"],
    desc: "Metrik risiko, dashboard & narasi laporan, kualitas data, regulasi.",
  },
  {
    id: "data-analyst",
    label: "Data Analyst",
    tracks: ["SQL", "Python", "Statistika", "Business Intelligence"],
    desc: "Query, wrangling, EDA, visualisasi, eksperimen, storytelling data.",
  },
];

export const INTERVIEW_LEVELS: { id: InterviewLevel; label: string; desc: string }[] = [
  { id: "junior", label: "Junior", desc: "Konsep dasar, definisi, penerapan sederhana." },
  { id: "mid", label: "Mid", desc: "Studi kasus mini, trade-off, pengambilan keputusan." },
];

export interface InterviewTopic {
  slug: string;
  title: string;
  track: string;
}

// ── Kumpulan topik dari kurikulum nyata ─────────────────────────────────────

function topicPool(role: InterviewRole): InterviewTopic[] {
  let lessons: Record<string, { t?: string; tr?: string }> = {};
  try {
    lessons =
      (kgData as { lessons?: Record<string, { t?: string; tr?: string }> }).lessons ?? {};
  } catch {
    return [];
  }
  const pool: InterviewTopic[] = [];
  for (const [slug, info] of Object.entries(lessons)) {
    if (info.tr && role.tracks.includes(info.tr) && info.t) {
      pool.push({ slug, title: info.t, track: info.tr });
    }
  }
  // Deterministik: urut per urutan track peran, lalu per slug.
  pool.sort((a, b) => {
    const ta = role.tracks.indexOf(a.track);
    const tb = role.tracks.indexOf(b.track);
    if (ta !== tb) return ta - tb;
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
  return pool;
}

/** djb2 — seed deterministik dari string. */
function hashSeed(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

/** PRNG mulberry32 — shuffle deterministik. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pilih `count` topik untuk satu sesi. Deterministik untuk kombinasi
 * (peran, level, jumlah) yang sama — AI tidak ikut memilih topik.
 */
export function pickTopics(
  roleId: string,
  level: InterviewLevel,
  count: number
): InterviewTopic[] {
  const role = INTERVIEW_ROLES.find((r) => r.id === roleId);
  if (!role) return [];
  const pool = topicPool(role);
  const rand = mulberry32(hashSeed(`${roleId}:${level}:${count}`));
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr.slice(0, Math.min(count, arr.length));
}

/** Label peran untuk tampilan (fallback = id). */
export function roleLabel(roleId: string): string {
  return INTERVIEW_ROLES.find((r) => r.id === roleId)?.label ?? roleId;
}

/** Label level untuk tampilan. */
export function levelLabel(level: InterviewLevel): string {
  return INTERVIEW_LEVELS.find((l) => l.id === level)?.label ?? level;
}

// ── Prompt pewawancara ──────────────────────────────────────────────────────

function topicListText(topics: InterviewTopic[]): string {
  return topics.map((t, i) => `${i + 1}. [${t.track}] ${t.title}`).join("\n");
}

function interviewSystemPrompt(
  role: InterviewRole,
  level: InterviewLevel,
  topics: InterviewTopic[]
): string {
  const levelRule =
    level === "junior"
      ? "LEVEL JUNIOR: pertanyaan tentang konsep dasar, definisi, dan penerapan sederhana. Pola: \"Coba jelaskan...\", \"Apa perbedaan...\", \"Kapan kamu memakai...\"."
      : "LEVEL MID: pertanyaan berupa studi kasus mini, trade-off, dan pengambilan keputusan. Pola: \"Bayangkan kamu diminta...\", \"Apa yang kamu lakukan bila...\", \"Bandingkan pendekatan A vs B...\".";
  return (
    `Kamu adalah pewawancara profesional untuk posisi ${role.label} (${level === "junior" ? "Junior" : "Mid"}). Kamu mewawancarai seorang kandidat analis yang sedang berlatih menjawab seperti wawancara sungguhan.\n\n` +
    `DAFTAR TOPIK YANG DIIZINKAN — diambil dari kurikulum nyata. Setiap pertanyaanmu HARUS tentang salah satu topik di daftar ini. DILARANG mengajukan pertanyaan di luar daftar ini. DILARANG mengarang topik baru.\n` +
    `${topicListText(topics)}\n\n` +
    `ATURAN:\n` +
    `- Bahasa Indonesia; istilah teknis tetap Bahasa Inggris.\n` +
    `- Satu pertanyaan per giliran. Jangan mengulang pertanyaan yang sudah diajukan.\n` +
    `- ${levelRule}\n` +
    `- Umpan balik: 1-3 kalimat, spesifik terhadap jawaban kandidat — sebut apa yang tepat dan apa yang kurang. Tanpa basa-basi berlebihan.\n` +
    `- Skor 0-100 untuk tiap jawaban: 90+ luar biasa, 75-89 baik, 60-74 cukup, di bawah 60 perlu banyak perbaikan.\n\n` +
    `FORMAT OUTPUT — JAWAB HANYA dengan SATU objek JSON valid, tanpa teks lain sebelum atau sesudahnya.\n` +
    `Bila sesi BELUM selesai (masih ada pertanyaan tersisa setelah jawaban ini):\n` +
    `{"umpan_balik":"...","skor_jawaban":0-100,"pertanyaan_berikutnya":"..."}\n` +
    `Bila jawaban ini adalah jawaban TERAKHIR (tidak ada pertanyaan tersisa):\n` +
    `{"umpan_balik":"...","skor_jawaban":0-100,"selesai":true,"penilaian_akhir":{"konsep":0-100,"penerapan":0-100,"komunikasi":0-100,"kesimpulan":"2-4 kalimat","saran":["saran 1","saran 2","saran 3"]}}`
  );
}

function sessionContext(
  role: InterviewRole,
  level: InterviewLevel,
  topics: InterviewTopic[]
): string {
  return (
    `KONTEKS SESI\n` +
    `Peran target: ${role.label} (${level === "junior" ? "Junior" : "Mid"})\n` +
    `Jumlah pertanyaan: ${topics.length}\n` +
    `Urutan topik (TETAP — jangan diubah, jangan ditambah):\n` +
    topicListText(topics)
  );
}

/** Format topik untuk tampilan: "[track] judul lesson". */
export function fmtTopic(t: InterviewTopic): string {
  return `[${t.track}] ${t.title}`;
}

// ── Parse respons AI (tahan banting, pola N/O/P) ─────────────────────────────

export interface FinalAssessment {
  konsep: number;
  penerapan: number;
  komunikasi: number;
  kesimpulan: string;
  saran: string[];
}

export interface ParsedTurn {
  umpanBalik: string;
  skor: number;
  pertanyaanBerikutnya: string | null;
  selesai: boolean;
  penilaianAkhir: FinalAssessment | null;
}

export type InterviewParseResult =
  | { ok: true; turn: ParsedTurn }
  | { ok: false; raw: string };

export interface ParsedFinal {
  umpanBalik: string;
  penilaianAkhir: FinalAssessment;
}

export type FinalParseResult =
  | { ok: true; final: ParsedFinal }
  | { ok: false; raw: string };

function clampScore(v: unknown): number | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function nonEmptyStr(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const noFence = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
  const start = noFence.indexOf("{");
  const end = noFence.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const obj: unknown = JSON.parse(noFence.slice(start, end + 1));
    return typeof obj === "object" && obj !== null
      ? (obj as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function parseAssessment(pa: unknown): FinalAssessment | null {
  if (typeof pa !== "object" || pa === null) return null;
  const o = pa as Record<string, unknown>;
  const konsep = clampScore(o.konsep);
  const penerapan = clampScore(o.penerapan);
  const komunikasi = clampScore(o.komunikasi);
  const kesimpulan = nonEmptyStr(o.kesimpulan);
  const saran = Array.isArray(o.saran)
    ? o.saran.filter((s): s is string => typeof s === "string" && s.trim().length > 0).map((s) => s.trim())
    : [];
  if (konsep === null || penerapan === null || komunikasi === null || !kesimpulan || saran.length === 0) {
    return null;
  }
  return { konsep, penerapan, komunikasi, kesimpulan, saran };
}

/**
 * Parse satu giliran wawancara. Gagal → respons mentah; skor TIDAK dikarang.
 * Pada skema akhir, skor_jawaban boleh absen (diisi skor giliran terakhir).
 */
export function parseInterviewTurn(text: string, fallbackSkor: number | null = null): InterviewParseResult {
  const o = extractJsonObject(text);
  if (!o) return { ok: false, raw: text };
  const selesai = o.selesai === true;
  if (selesai) {
    const penilaianAkhir = parseAssessment(o.penilaian_akhir);
    if (!penilaianAkhir) return { ok: false, raw: text };
    const umpanBalik = nonEmptyStr(o.umpan_balik) ?? "";
    const skor = clampScore(o.skor_jawaban) ?? fallbackSkor ?? 0;
    return {
      ok: true,
      turn: { umpanBalik, skor, pertanyaanBerikutnya: null, selesai: true, penilaianAkhir },
    };
  }
  const umpanBalik = nonEmptyStr(o.umpan_balik);
  const skor = clampScore(o.skor_jawaban);
  const pb = nonEmptyStr(o.pertanyaan_berikutnya);
  if (!umpanBalik || skor === null || !pb) return { ok: false, raw: text };
  return {
    ok: true,
    turn: { umpanBalik, skor, pertanyaanBerikutnya: pb, selesai: false, penilaianAkhir: null },
  };
}

/** Parse penilaian akhir sesi yang diakhiri lebih awal. */
export function parseFinalAssessment(text: string): FinalParseResult {
  const o = extractJsonObject(text);
  if (!o) return { ok: false, raw: text };
  const penilaianAkhir = parseAssessment(o.penilaian_akhir);
  if (!penilaianAkhir) return { ok: false, raw: text };
  return {
    ok: true,
    final: { umpanBalik: nonEmptyStr(o.umpan_balik) ?? "", penilaianAkhir },
  };
}

// ── Panggilan AI ─────────────────────────────────────────────────────────────

export interface InterviewTurn {
  /** "[track] judul lesson" — topik yang ditanyakan. */
  topik: string;
  pertanyaan: string;
  jawaban: string;
  umpanBalik: string;
  skor: number;
}

/** Representasi ringkas giliran lampau — hemat token, skor tetap utuh. */
function compactTurnMsg(t: InterviewTurn): AiMessage {
  return {
    role: "assistant",
    content: JSON.stringify({
      umpan_balik: t.umpanBalik,
      skor_jawaban: t.skor,
      pertanyaan_berikutnya: t.pertanyaan,
    }),
  };
}

export interface TurnRequest {
  role: InterviewRole;
  level: InterviewLevel;
  topics: InterviewTopic[];
  /** Giliran yang sudah selesai (dengan umpan balik + skor). */
  turns: InterviewTurn[];
  /** null = buka sesi (minta pertanyaan pertama). */
  answer: string | null;
  signal?: AbortSignal;
}

/**
 * Satu giliran wawancara: buka sesi (answer=null) atau kirim jawaban.
 * Riwayat dipangkas: 3 giliran terakhir penuh + ringkasan skor sisanya.
 */
export async function requestInterviewTurn(req: TurnRequest): Promise<InterviewParseResult> {
  const { role, level, topics, turns, answer } = req;
  const count = topics.length;
  const messages: AiMessage[] = [
    { role: "system", content: interviewSystemPrompt(role, level, topics) },
    { role: "user", content: sessionContext(role, level, topics) },
  ];
  const recent = turns.slice(-3);
  for (const t of recent) {
    messages.push(compactTurnMsg(t));
    messages.push({ role: "user", content: `Jawaban kandidat: """${t.jawaban}"""` });
  }
  const older = turns.slice(0, Math.max(0, turns.length - 3));
  const summary =
    older.length > 0
      ? older.map((t, i) => `P${i + 1} [${t.topik}]: skor ${t.skor}`).join("; ")
      : "belum ada";

  if (answer === null) {
    messages.push({
      role: "user",
      content:
        `Mulai sesi wawancara untuk posisi ${role.label}. Sapa kandidat dalam SATU kalimat singkat di "umpan_balik" (bukan penilaian), ` +
        `lalu ajukan PERTANYAAN 1 tentang topik: ${fmtTopic(topics[0]!)}. Jawab hanya dengan objek JSON skema sesi berjalan.`,
    });
  } else {
    const k = turns.length + 1; // nomor pertanyaan yang baru dijawab
    const isLast = k >= count;
    // Topik pertanyaan yang dijawab = topik ke-k (indeks k-1 = turns.length).
    const answeringTopik = fmtTopic(topics[turns.length]!);
    messages.push({
      role: "user",
      content:
        `Jawaban kandidat untuk PERTANYAAN ${k} [${answeringTopik}]:\n` +
        `"""\n${answer}\n"""\n\n` +
        `RINGKASAN SKOR GILIRAN LAMA: ${summary}\n\n` +
        (isLast
          ? `Ini adalah jawaban TERAKHIR (${k} dari ${count}). Beri umpan balik + skor jawaban ini, lalu "selesai": true beserta "penilaian_akhir". Jawab hanya dengan objek JSON skema akhir.`
          : `Lanjutkan: ajukan PERTANYAAN ${k + 1} tentang topik: ${fmtTopic(topics[k]!)}. Jawab hanya dengan objek JSON skema sesi berjalan.`),
    });
  }

  const r = await chatComplete({
    messages,
    feature: "interview",
    temperature: 0.7,
    maxTokens: 700,
    signal: req.signal,
  });
  const fallbackSkor = turns.length > 0 ? turns[turns.length - 1]!.skor : null;
  return parseInterviewTurn(r.text, fallbackSkor);
}

/** Minta penilaian akhir untuk sesi yang diakhiri lebih awal (tanpa pertanyaan baru). */
export async function requestFinalAssessment(
  role: InterviewRole,
  level: InterviewLevel,
  topics: InterviewTopic[],
  turns: InterviewTurn[],
  signal?: AbortSignal
): Promise<FinalParseResult> {
  const messages: AiMessage[] = [
    { role: "system", content: interviewSystemPrompt(role, level, topics) },
    { role: "user", content: sessionContext(role, level, topics) },
  ];
  const recent = turns.slice(-3);
  for (const t of recent) {
    messages.push(compactTurnMsg(t));
    messages.push({ role: "user", content: `Jawaban kandidat: """${t.jawaban}"""` });
  }
  messages.push({
    role: "user",
    content:
      `Kandidat mengakhiri sesi lebih awal setelah menjawab ${turns.length} dari ${topics.length} pertanyaan. ` +
      `TIDAK ada pertanyaan baru. Beri penilaian akhir HANYA berdasarkan jawaban yang sudah ada (lihat riwayat). ` +
      `Jawab hanya dengan SATU objek JSON valid, tanpa teks lain: ` +
      `{"umpan_balik":"ringkasan 1-2 kalimat","penilaian_akhir":{"konsep":0-100,"penerapan":0-100,"komunikasi":0-100,"kesimpulan":"2-4 kalimat","saran":["saran 1","saran 2","saran 3"]}}`,
  });
  const r = await chatComplete({
    messages,
    feature: "interview",
    temperature: 0.7,
    maxTokens: 700,
    signal,
  });
  return parseFinalAssessment(r.text);
}

// ── Store localStorage ───────────────────────────────────────────────────────

export interface ActiveSession {
  id: string;
  ts: number;
  roleId: string;
  level: InterviewLevel;
  topics: InterviewTopic[];
  turns: InterviewTurn[];
  /** Pertanyaan yang sedang menunggu jawaban (null = belum diminta / menunggu AI). */
  pendingTopik: string | null;
  pendingPertanyaan: string | null;
  /** Draf jawaban yang sedang dikirim saat refresh (agar tidak hilang). */
  draftAnswer: string | null;
}

export interface FinishedSession {
  id: string;
  ts: number;
  roleId: string;
  level: InterviewLevel;
  turns: InterviewTurn[];
  penilaianAkhir: FinalAssessment | null;
  endedEarly: boolean;
}

const ACTIVE_KEY = "v2:interview:active";
const SESSIONS_KEY = "v2:interview:sessions";
const SESSIONS_MAX = 10;

function validTopic(t: unknown): t is InterviewTopic {
  const o = t as Record<string, unknown>;
  return (
    typeof o === "object" &&
    o !== null &&
    typeof o.slug === "string" &&
    typeof o.title === "string" &&
    typeof o.track === "string"
  );
}

function validTurn(t: unknown): t is InterviewTurn {
  const o = t as Record<string, unknown>;
  return (
    typeof o === "object" &&
    o !== null &&
    typeof o.topik === "string" &&
    typeof o.pertanyaan === "string" &&
    typeof o.jawaban === "string" &&
    typeof o.umpanBalik === "string" &&
    typeof o.skor === "number"
  );
}

/** Sesi aktif yang tersimpan (bertahan saat refresh). null bila tidak ada/rusak. */
export function loadActiveSession(): ActiveSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<ActiveSession>;
    if (
      typeof v.id !== "string" ||
      typeof v.roleId !== "string" ||
      (v.level !== "junior" && v.level !== "mid") ||
      !Array.isArray(v.topics) ||
      v.topics.length === 0 ||
      !v.topics.every(validTopic) ||
      !Array.isArray(v.turns) ||
      !v.turns.every(validTurn)
    ) {
      return null;
    }
    return {
      id: v.id,
      ts: typeof v.ts === "number" ? v.ts : Date.now(),
      roleId: v.roleId,
      level: v.level,
      topics: v.topics,
      turns: v.turns,
      pendingTopik: typeof v.pendingTopik === "string" ? v.pendingTopik : null,
      pendingPertanyaan: typeof v.pendingPertanyaan === "string" ? v.pendingPertanyaan : null,
      draftAnswer: typeof v.draftAnswer === "string" ? v.draftAnswer : null,
    };
  } catch {
    return null;
  }
}

/** Simpan sesi aktif; null = hapus. */
export function saveActiveSession(s: ActiveSession | null): void {
  if (typeof localStorage === "undefined") return;
  try {
    if (s === null) localStorage.removeItem(ACTIVE_KEY);
    else localStorage.setItem(ACTIVE_KEY, JSON.stringify(s));
  } catch {
    /* best-effort */
  }
}

/** Riwayat sesi selesai (terbaru dulu). */
export function loadSessions(): FinishedSession[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown[];
    return Array.isArray(arr)
      ? arr.filter(
          (s): s is FinishedSession =>
            typeof s === "object" &&
            s !== null &&
            typeof (s as FinishedSession).id === "string" &&
            Array.isArray((s as FinishedSession).turns)
        )
      : [];
  } catch {
    return [];
  }
}

/** Simpan sesi selesai ke riwayat (cap 10, terbaru dulu). */
export function saveFinishedSession(s: FinishedSession): void {
  if (typeof localStorage === "undefined") return;
  try {
    const arr = loadSessions().filter((x) => x.id !== s.id);
    arr.unshift(s);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(arr.slice(0, SESSIONS_MAX)));
  } catch {
    /* best-effort */
  }
}

/** Rata-rata skor jawaban satu sesi (null bila tanpa giliran). */
export function avgScore(s: FinishedSession): number | null {
  if (s.turns.length === 0) return null;
  const sum = s.turns.reduce((a, t) => a + t.skor, 0);
  return Math.round(sum / s.turns.length);
}
