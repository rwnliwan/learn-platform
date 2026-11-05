// Silent Mentor Network — Gelombang P (ide #16).
//
// "Silent": mentor TIDAK pernah memanggil AI sendiri. Mereka hanya menulis
// catatan saat pengguna MEMBUKA halaman /v2/mentor dan menekan tombol.
// Catatan tersimpan langsung tampil saat halaman dibuka — tanpa panggilan
// AI baru, tanpa notifikasi, tanpa pop-up, tanpa interupsi.
//
// "Grounded": keempat mentor membaca PAKET FAKTA yang SAMA, dihitung dari
// data lokal nyata (progress, FSRS, sinyal kebingungan, Feynman, Penyanggah,
// Warisan). Prompt melarang keras menyebut angka/aktivitas di luar paket
// fakta; angka mentah tidak diulang di catatan (rujuk kualitatif) karena
// angka persis sudah tampil di panel "Basis fakta" yang bisa diaudit.
//
// Pola mengikuti feynman.ts / penyanggah.ts: parser JSON tahan banting
// (gagal → mentah terlipat, catatan lama TIDAK tertimpa), store localStorage,
// localStorage hanya dibaca dari komponen (useEffect).

import { chatComplete } from "./ai"; // dipakai komponen; diekspor ulang lewat requestNote
import { getLocalDone, getActivity } from "./progress";
import { getStats, parseCardId, type StoredFsrsCard } from "./fsrs";
import { loadFeynmanAttempts, feynmanStatus } from "./feynman";
import {
  listProjectableCards,
  projectCards,
  aggregateByTrack,
} from "./legacy";
import kgData from "./kgData.json";

// ── Paket fakta ─────────────────────────────────────────────────────────────

export interface FactItem {
  label: string;
  value: string;
  /** Dari mana angka ini dihitung — tampil di panel Basis fakta. */
  source: string;
}

export interface FactPack {
  items: FactItem[];
  /** Hash stabil atas isi paket — dipakai menandai catatan yang basi. */
  hash: string;
  /** true bila tidak ada aktivitas belajar tercatat sama sekali. */
  empty: boolean;
}

const LESSON_TRACK: Record<string, string> = (() => {
  try {
    const l = (kgData as { lessons?: Record<string, { tr?: string }> }).lessons ?? {};
    const out: Record<string, string> = {};
    for (const [slug, info] of Object.entries(l)) {
      if (info.tr) out[slug] = info.tr;
    }
    return out;
  } catch {
    return {};
  }
})();

function lsKeys(prefix: string): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) out.push(k);
    }
  } catch {
    /* noop */
  }
  return out;
}

function lsJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(ts);
  }
}

/** Hash djb2 atas isi paket — deterministik, berubah bila ada fakta berubah. */
export function factPackHash(items: FactItem[]): string {
  const s = items.map((i) => `${i.label}=${i.value}`).join("|");
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

function trackOfCard(cardId: string): string {
  const p = parseCardId(cardId);
  if (!p) return "Lainnya";
  return LESSON_TRACK[p.slug] ?? "Lainnya";
}

/**
 * Membangun paket fakta dari data lokal yang SUDAH ada.
 * Setiap fakta = angka/label nyata; tidak ada yang dikarang.
 */
export function buildFactPack(): FactPack {
  const items: FactItem[] = [];
  let hasActivity = false;

  // — Progres lesson & kunjungan (progress.ts) —
  const done = getLocalDone();
  const visits = getActivity();
  items.push({
    label: "Lesson selesai",
    value: String(done.size),
    source: "progres lokal (progress.ts)",
  });
  items.push({
    label: "Kunjungan tercatat",
    value: String(visits.length),
    source: "riwayat kunjungan (progress.ts)",
  });
  if (done.size > 0) hasActivity = true;
  if (visits.length > 0) {
    hasActivity = true;
    const last = visits[visits.length - 1];
    items.push({
      label: "Aktivitas terakhir",
      value: `${last.slug} · ${fmtDate(last.ts)}`,
      source: "riwayat kunjungan (progress.ts)",
    });
    // Track paling banyak diselesaikan (maks 2), dari pemetaan kurikulum nyata.
    const perTrack = new Map<string, number>();
    for (const slug of done) {
      const t = LESSON_TRACK[slug];
      if (t) perTrack.set(t, (perTrack.get(t) ?? 0) + 1);
    }
    const top = [...perTrack.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    if (top.length > 0) {
      items.push({
        label: "Track paling banyak diselesaikan",
        value: top.map(([t, n]) => `${t} (${n})`).join(" · "),
        source: "progres lokal × pemetaan kurikulum (kgData)",
      });
    }
  }

  // — FSRS (fsrs.ts): kartu, due, retensi, topik terlemah —
  // (dibungkus try/catch: store korup tidak boleh merobohkan paket fakta)
  try {
  const stats = getStats();
  items.push({
    label: "Kartu FSRS",
    value: String(stats.totalCards),
    source: "store kartu FSRS (fsrs.ts)",
  });
  if (stats.totalCards > 0) {
    hasActivity = true;
    items.push({
      label: "Kartu jatuh tempo",
      value: String(stats.dueCount),
      source: "store kartu FSRS (fsrs.ts)",
    });
    items.push({
      label: "Rata-rata retensi prediksi",
      value: stats.avgRetention !== null ? `${stats.avgRetention}%` : "belum ada data review",
      source: "getStats() — retrievability FSRS",
    });
    // Topik terlemah = track dengan lapses terbanyak (bila ada).
    const lapsesPerTrack = new Map<string, number>();
    let anyLapse = false;
    for (const k of lsKeys("v2:fsrs:")) {
      const s = lsJson(k) as StoredFsrsCard | null;
      if (!s || typeof s.lapses !== "number" || s.lapses <= 0) continue;
      anyLapse = true;
      const t = trackOfCard(s.cardId);
      lapsesPerTrack.set(t, (lapsesPerTrack.get(t) ?? 0) + s.lapses);
    }
    if (anyLapse) {
      const top = [...lapsesPerTrack.entries()].sort((a, b) => b[1] - a[1])[0];
      items.push({
        label: "Topik dengan lapses terbanyak",
        value: `${top[0]} (${top[1]} lapses)`,
        source: "store kartu FSRS — jumlah lapses per track",
      });
    }
  }
  }
  catch {
    /* store kartu korup = dilewati, bukan dikarang */
  }

  // — Sinyal kebingungan (confusion.ts): hint & revisi per langkah —
  interface StepSignal {
    hints?: number;
    revisions?: number;
  }
  // Kecualikan kunci opt-out ("v2:sig-optout") — itu bukan sinyal langkah.
  try {
  const sigKeys = lsKeys("v2:sig:").filter((k) => k !== "v2:sig-optout");
  if (sigKeys.length > 0) {
    hasActivity = true;
    let hints = 0;
    let revisions = 0;
    let topKey = "";
    let topScore = 0;
    for (const k of sigKeys) {
      const s = (lsJson(k) as StepSignal | null) ?? {};
      const h = typeof s.hints === "number" ? s.hints : 0;
      const r = typeof s.revisions === "number" ? s.revisions : 0;
      hints += h;
      revisions += r;
      if (h + r > topScore) {
        topScore = h + r;
        topKey = k.slice("v2:sig:".length);
      }
    }
    items.push({
      label: "Langkah dengan sinyal kebingungan",
      value: String(sigKeys.length),
      source: "sinyal perilaku (confusion.ts)",
    });
    items.push({
      label: "Total hint dibuka / revisi kode",
      value: `${hints} hint · ${revisions} revisi`,
      source: "sinyal perilaku (confusion.ts)",
    });
    if (topKey) {
      items.push({
        label: "Langkah paling sering dibantu",
        value: `${topKey} (${topScore} sinyal)`,
        source: "sinyal perilaku (confusion.ts)",
      });
    }
  }
  }
  catch {
    /* sinyal korup = dilewati, bukan dikarang */
  }

  // — Feynman (feynman.ts): status per lesson —
  try {
  const fKeys = lsKeys("v2:feynman:");
  if (fKeys.length > 0) {
    hasActivity = true;
    let lolos = 0;
    for (const k of fKeys) {
      const slug = k.slice("v2:feynman:".length);
      const st = feynmanStatus(loadFeynmanAttempts(slug));
      if (st === "lolos") lolos++;
    }
    items.push({
      label: "Feynman Gate: lolos",
      value: `${lolos} dari ${fKeys.length} lesson yang dinilai`,
      source: "riwayat Feynman lokal (feynman.ts)",
    });
  }
  }
  catch {
    /* riwayat Feynman korup = dilewati */
  }

  // — Penyanggah (penyanggah.ts): sesi sanggah —
  try {
  const pKeys = lsKeys("v2:penyanggah:");
  if (pKeys.length > 0) {
    hasActivity = true;
    let sessions = 0;
    let lastTs = 0;
    for (const k of pKeys) {
      const v = lsJson(k);
      if (Array.isArray(v)) {
        sessions += v.length;
        for (const s of v) {
          if (typeof s?.ts === "number" && s.ts > lastTs) lastTs = s.ts;
        }
      } else if (v && typeof (v as { ts?: unknown }).ts === "number") {
        sessions++;
        const ts = (v as { ts: number }).ts;
        if (ts > lastTs) lastTs = ts;
      }
    }
    items.push({
      label: "Sesi AI Penyanggah",
      value: String(sessions),
      source: "riwayat Penyanggah lokal (penyanggah.ts)",
    });
    if (lastTs > 0) {
      items.push({
        label: "Sanggahan terakhir",
        value: fmtDate(lastTs),
        source: "riwayat Penyanggah lokal (penyanggah.ts)",
      });
    }
  }
  }
  catch {
    /* riwayat Penyanggah korup = dilewati */
  }

  // — Warisan (legacy.ts): proyeksi retensi 1 tahun, track terlemah —
  try {
    const cards = listProjectableCards();
    if (cards.length > 0) {
      const bands = aggregateByTrack(
        projectCards(cards, "stop", 365),
        trackOfCard
      );
      if (bands.length > 0) {
        const weakest = bands[0];
        items.push({
          label: "Proyeksi retensi 1-tahun terendah",
          value: `${weakest.track} (rata-rata ${Math.round(weakest.mean)}%)`,
          source: "proyeksi FSRS skenario berhenti total (legacy.ts)",
        });
      }
    }
  } catch {
    /* warisan bersifat opsional: gagal hitung = fakta dilewati, bukan dikarang */
  }

  return { items, hash: factPackHash(items), empty: !hasActivity };
}

/** Render paket fakta sebagai teks untuk prompt AI. */
export function renderFactPack(pack: FactPack): string {
  return pack.items.map((i) => `- ${i.label}: ${i.value}`).join("\n");
}

// ── Persona mentor ──────────────────────────────────────────────────────────

export interface MentorPersona {
  id: string;
  nama: string;
  /** Satu kalimat: dari sudut apa ia membaca data. */
  lensa: string;
  /** Gaya bicaranya. */
  gaya: string;
}

export const MENTORS: MentorPersona[] = [
  {
    id: "risiko",
    nama: "Praktisi Risiko",
    lensa: "aplikasi & relevansi kerja — menghubungkan materi ke praktik analis risiko (credit risk, market risk, fraud/AML)",
    gaya: "praktis dan lugas, memakai analogi dunia kerja",
  },
  {
    id: "statistikawan",
    nama: "Statistikawan",
    lensa: "ketelitian & jebakan penalaran — asumsi tersembunyi, interpretasi statistik yang rawan salah",
    gaya: "teliti dan presisi, menunjuk tepat di mana intuisi bisa menipu",
  },
  {
    id: "auditor",
    nama: "Auditor",
    lensa: "skeptisisme bukti — gaya impostor-hunter: mempertanyakan klaim, menuntut bukti, mencari yang disembunyikan data",
    gaya: "kritis tapi adil, seperti auditor yang ramah namun tidak mudah dibohongi",
  },
  {
    id: "karier",
    nama: "Mentor Karier",
    lensa: "arah portofolio & langkah berikutnya — mengubah progres belajar menjadi bukti karier yang bisa dibagikan",
    gaya: "mendorong dan strategis, fokus pada langkah konkret berikutnya",
  },
];

export const MENTOR_OUTPUT_SCHEMA = `{"judul":"...","isi":"2-4 kalimat","saran":"satu langkah konkret"}`;

/** System prompt satu mentor: peran + lensa + paket fakta + aturan grounding keras. */
export function mentorSystemPrompt(p: MentorPersona, factText: string): string {
  return (
    `Kamu adalah ${p.nama} dalam "Silent Mentor Network" — jaringan mentor yang diam-diam mengamati data belajar nyata seorang murid, dan hanya menulis catatan saat diminta.\n\n` +
    `LENSA-MU: ${p.lensa}\n` +
    `GAYA: ${p.gaya}\n\n` +
    `PAKET FAKTA — satu-satunya sumber kebenaran tentang murid ini:\n${factText}\n\n` +
    `ATURAN KERAS:\n` +
    `- DILARANG menyebut angka, aktivitas, lesson, atau fakta apa pun yang TIDAK ada di paket fakta di atas. Bila datanya tidak ada, tulis "belum tercatat" — JANGAN mengarang.\n` +
    `- Jangan mengulang angka mentah paket fakta di catatanmu; rujuk secara KUALITATIF (mis. "track yang paling sering kamu review ulang", bukan "lapses=7"). Angka persis sudah tampil di panel Basis fakta.\n` +
    `- Isi harus SPESIFIK untuk data murid ini dari lensamu — bukan nasihat generik yang berlaku untuk siapa pun.\n` +
    `- Bahasa Indonesia, hangat, ringkas.\n\n` +
    `JAWAB HANYA dengan SATU objek JSON valid, tanpa teks lain sebelum atau sesudahnya:\n` +
    MENTOR_OUTPUT_SCHEMA
  );
}

/** Prompt user: minta catatan dari persona ini. */
export function mentorUserPrompt(p: MentorPersona): string {
  return `Tulis catatan ${p.nama} untuk murid dengan paket fakta di atas, dari lensamu. Jawab hanya dengan objek JSON.`;
}

// ── Parse respons AI ────────────────────────────────────────────────────────

export interface MentorNoteContent {
  judul: string;
  isi: string;
  saran: string;
}

export type MentorParseResult =
  | { ok: true; note: MentorNoteContent }
  | { ok: false; raw: string };

/**
 * Parse respons AI menjadi catatan mentor. Tahan banting: strip code fence,
 * ambil objek JSON pertama..terakhir, validasi bentuk ketat.
 * Bila gagal: kembalikan respons mentah — JANGAN mengarang catatan.
 */
export function parseMentorNote(text: string): MentorParseResult {
  const noFence = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
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
  const str = (v: unknown): string | null =>
    typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
  const judul = str(o.judul);
  const isi = str(o.isi);
  const saran = str(o.saran);
  if (!judul || !isi || !saran) return { ok: false, raw: text };
  return { ok: true, note: { judul, isi, saran } };
}

// ── Panggilan AI (satu catatan) ─────────────────────────────────────────────

/** Satu panggilan AI untuk satu mentor. Dipakai komponen; ledger dicatat ai.ts. */
export async function requestMentorNote(
  p: MentorPersona,
  factText: string,
  signal?: AbortSignal
): Promise<MentorParseResult> {
  const r = await chatComplete({
    messages: [
      { role: "system", content: mentorSystemPrompt(p, factText) },
      { role: "user", content: mentorUserPrompt(p) },
    ],
    feature: "mentor",
    temperature: 0.4,
    maxTokens: 600,
    signal,
  });
  return parseMentorNote(r.text);
}

// ── Store localStorage ──────────────────────────────────────────────────────

export interface MentorNote extends MentorNoteContent {
  ts: number;
  /** Hash paket fakta saat catatan dibuat — untuk penanda "data berubah". */
  faktaHash: string;
}

const NOTES_KEY = "v2:mentor:notes";

/** Semua catatan tersimpan, per id mentor. */
export function loadMentorNotes(): Record<string, MentorNote> {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw) as Record<string, MentorNote>;
    return typeof v === "object" && v !== null ? v : {};
  } catch {
    return {};
  }
}

/** Simpan catatan satu mentor (menimpa yang lama). */
export function saveMentorNote(id: string, note: MentorNote): void {
  if (typeof localStorage === "undefined") return;
  try {
    const all = loadMentorNotes();
    all[id] = note;
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  } catch {
    /* best-effort */
  }
}
