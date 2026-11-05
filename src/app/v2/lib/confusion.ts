// Confusion Index (Gelombang G — ide #15): peta konsep rapuh.
//
// PRINSIP: friksi belajar (jawaban salah berulang, kartu Again terus-menerus,
// petunjuk yang sering dibuka) diubah menjadi node kebingungan yang
// terprioritas — BUKAN vonis kemampuan. Semua diagnosis dilabeli "dugaan
// awal" dan bisa ditolak pengguna.
//
// SUMBER DATA (semua client-side, localStorage — tanpa backend/endpoint baru):
//  1. FSRS store (`v2:fsrs:*`): lapses (Again), reps, stability, due.
//  2. Sinyal perilaku `v2:sig:<slug>:<stepId>` = {hints, revisions} —
//     dicatat pasif oleh Workspace; bisa dimatikan total (opt-out).
//  3. Upaya lab gagal dari `v2:step:<slug>:<stepId>` {attempts, passed}.
// GUARDRAIL ide asli: tidak menyimpulkan dari waktu respons; pengguna bisa
// mematikan pencatatan sinyal perilaku.

import {
  parseCardId,
  type StoredFsrsCard,
} from "./fsrs";

const SIG_PREFIX = "v2:sig:";
const OPTOUT_KEY = "v2:sig-optout";
const DISMISS_PREFIX = "v2:conf-dismiss:";
const KIND_PREFIX = "v2:conf-kind:";
const INT_PREFIX = "v2:conf-int:";

function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* noop */
  }
}

/* ================= sinyal perilaku ================= */

export interface StepSignal {
  /** berapa kali petunjuk dibuka (hintbar klasik + tangga Socratic) */
  hints: number;
  /** berapa kali jawaban direvisi sebelum lolos (run lab gagal) */
  revisions: number;
  updatedAt: string;
}

/** true = pengguna mematikan pencatatan sinyal perilaku. */
export function signalOptedOut(): boolean {
  try {
    return localStorage.getItem(OPTOUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSignalOptOut(off: boolean) {
  try {
    if (off) localStorage.setItem(OPTOUT_KEY, "1");
    else localStorage.removeItem(OPTOUT_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Catat satu sinyal perilaku untuk (slug, stepId). PASIF: tidak mengubah
 * perilaku belajar apa pun; no-op total bila opt-out aktif.
 */
export function logSignal(
  slug: string,
  stepId: string,
  kind: "hint" | "revision"
): void {
  try {
    if (signalOptedOut()) return;
    const k = SIG_PREFIX + slug + ":" + stepId;
    const raw = localStorage.getItem(k);
    const s: StepSignal = raw
      ? (JSON.parse(raw) as StepSignal)
      : { hints: 0, revisions: 0, updatedAt: new Date().toISOString() };
    if (kind === "hint") s.hints = (s.hints ?? 0) + 1;
    else s.revisions = (s.revisions ?? 0) + 1;
    s.updatedAt = new Date().toISOString();
    localStorage.setItem(k, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

export function readSignal(slug: string, stepId: string): StepSignal | null {
  const raw = lsGet(SIG_PREFIX + slug + ":" + stepId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StepSignal;
  } catch {
    return null;
  }
}

/** Upaya lab gagal (dari v2:step — sudah dicatat Workspace sejak dulu). */
export function readLabFailedAttempts(slug: string, stepId: string): number {
  const raw = lsGet("v2:step:" + slug + ":" + stepId);
  if (!raw) return 0;
  try {
    const s = JSON.parse(raw) as { attempts?: number; passed?: boolean };
    const a = s.attempts ?? 0;
    return Math.max(0, a - (s.passed ? 1 : 0));
  } catch {
    return 0;
  }
}

/* ================= node kebingungan ================= */

export type ConfusionKind = "definisi" | "prasyarat" | "notasi" | "transfer";

export const CONFUSION_KINDS: {
  id: ConfusionKind;
  title: string;
  desc: string;
}[] = [
  {
    id: "definisi",
    title: "Definisi / konsep inti",
    desc: "Konsep dasarnya belum kokoh — salah di soal yang menguji pemahaman langsung.",
  },
  {
    id: "prasyarat",
    title: "Prasyarat",
    desc: "Sering butuh petunjuk — fondasi dari materi sebelumnya mungkin belum kuat.",
  },
  {
    id: "notasi",
    title: "Notasi / interpretasi soal",
    desc: "Jawaban berubah-ubah — ragu membaca maksud soal atau simbolnya.",
  },
  {
    id: "transfer",
    title: "Transfer ke kasus nyata",
    desc: "Paham bahannya, tapi penerapan di lab/kasus tersendat.",
  },
];

export interface NodeSignals {
  lapses: number;
  reps: number;
  quizLapses: number;
  labLapses: number;
  hints: number;
  revisions: number;
  labFailedAttempts: number;
  overdueDays: number;
  cardCount: number;
}

export interface ConfusionNode {
  slug: string;
  stepId: string;
  lessonTitle: string;
  stepTitle: string;
  track: string;
  href: string;
  /** skor internal (lihat rumus di computeNodes); UI menampilkan basis, bukan angka mentah */
  score: number;
  signals: NodeSignals;
  /** DUGAN AWAL — selalu bisa salah, selalu bisa ditolak pengguna. */
  kind: ConfusionKind;
  kindBasis: string;
  cardIds: string[];
}

/**
 * RUMUS SKOR (terdokumentasi agar bisa diaudit):
 *   score = 3·min(lapses,12)
 *         + 1·min(hints,5)
 *         + 1·min(revisions,10)
 *         + 0.5·min(labFailedAttempts,10)
 *         + 0.1·min(overdueDays,30)
 * Node hanya muncul bila score ≥ 3 DAN ada minimal satu sinyal kuat
 * (lapses≥1, hints≥2, revisions≥2, labFailed≥2, atau overdue≥7 hari).
 * Lapses (Again) = sinyal terkuat karena datang dari penilaian recall langsung.
 */
const SCORE_MIN = 3;

function listFsrsCards(): StoredFsrsCard[] {
  const out: StoredFsrsCard[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("v2:fsrs:")) continue;
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const s = JSON.parse(raw) as StoredFsrsCard;
      if (s.v !== 1 || typeof s.due !== "string") continue;
      if ((s.reps ?? 0) > 0) out.push(s);
    }
  } catch {
    /* noop */
  }
  return out;
}

export interface NodeMeta {
  lessonTitle: string;
  stepTitle: string;
  track: string;
  href: string;
}

/**
 * metaOf: (slug, stepId) -> judul lesson, judul step, track, href.
 * Dipasok pemanggil dari registry (pola sama seperti buildMeta di WarisanClient).
 */
export function computeNodes(
  metaOf: (slug: string, stepId: string) => NodeMeta,
  now: Date = new Date()
): ConfusionNode[] {
  const byStep = new Map<string, StoredFsrsCard[]>();
  for (const c of listFsrsCards()) {
    const p = parseCardId(c.cardId);
    if (!p) continue;
    const key = p.slug + "␟" + p.stepId;
    const a = byStep.get(key);
    if (a) a.push(c);
    else byStep.set(key, [c]);
  }

  const out: ConfusionNode[] = [];
  for (const [key, cards] of byStep) {
    const [slug, stepId] = key.split("␟");
    let lapses = 0,
      reps = 0,
      quizLapses = 0,
      labLapses = 0,
      overdueDays = 0;
    const cardIds: string[] = [];
    for (const c of cards) {
      cardIds.push(c.cardId);
      const l = c.lapses ?? 0;
      lapses += l;
      reps += c.reps ?? 0;
      const p = parseCardId(c.cardId);
      if (p?.kind === "quiz") quizLapses += l;
      else labLapses += l;
      const od = Math.max(0, (now.getTime() - new Date(c.due).getTime()) / 86400000);
      if (od > overdueDays) overdueDays = od;
    }
    const sig = readSignal(slug, stepId);
    const hints = sig?.hints ?? 0;
    const revisions = sig?.revisions ?? 0;
    const labFailedAttempts = readLabFailedAttempts(slug, stepId);

    const score =
      3 * Math.min(lapses, 12) +
      1 * Math.min(hints, 5) +
      1 * Math.min(revisions, 10) +
      0.5 * Math.min(labFailedAttempts, 10) +
      0.1 * Math.min(overdueDays, 30);

    const strong =
      lapses >= 1 || hints >= 2 || revisions >= 2 || labFailedAttempts >= 2 || overdueDays >= 7;
    if (score < SCORE_MIN || !strong) continue;

    // --- klasifikasi heuristik: urutan = dominasi sinyal ---
    let kind: ConfusionKind;
    if (hints >= 3) kind = "prasyarat";
    else if (revisions >= 3) kind = "notasi";
    else if (labLapses + labFailedAttempts * 0.5 >= Math.max(1, quizLapses)) kind = "transfer";
    else kind = "definisi";

    const basisParts: string[] = [];
    if (lapses) basisParts.push(`${lapses}× Again`);
    if (hints) basisParts.push(`${hints}× buka petunjuk`);
    if (revisions) basisParts.push(`${revisions}× revisi jawaban`);
    if (labFailedAttempts) basisParts.push(`${labFailedAttempts}× upaya lab gagal`);
    if (overdueDays >= 7) basisParts.push(`tunggak review ${Math.round(overdueDays)} hari`);

    const meta = metaOf(slug, stepId);
    out.push({
      slug,
      stepId,
      lessonTitle: meta.lessonTitle,
      stepTitle: meta.stepTitle,
      track: meta.track,
      href: meta.href,
      score,
      signals: {
        lapses,
        reps,
        quizLapses,
        labLapses,
        hints,
        revisions,
        labFailedAttempts,
        overdueDays: Math.round(overdueDays),
        cardCount: cards.length,
      },
      kind,
      kindBasis: basisParts.join(" · "),
      cardIds,
    });
  }

  return out
    .filter((n) => !isDismissed(n.slug, n.stepId))
    .sort((a, b) => b.score - a.score);
}

/* ================= micro-check, dismiss, intervensi, riwayat ================= */

export function isDismissed(slug: string, stepId: string): boolean {
  return lsGet(DISMISS_PREFIX + slug + ":" + stepId) !== null;
}

export function dismissNode(slug: string, stepId: string) {
  lsSet(DISMISS_PREFIX + slug + ":" + stepId, new Date().toISOString());
}

/** Dugaan yang dikonfirmasi pengguna via micro-check (menggantikan heuristik). */
export function confirmKind(slug: string, stepId: string, kind: ConfusionKind) {
  lsSet(KIND_PREFIX + slug + ":" + stepId, kind);
}

export function confirmedKind(slug: string, stepId: string): ConfusionKind | null {
  const v = lsGet(KIND_PREFIX + slug + ":" + stepId);
  return v === "definisi" || v === "prasyarat" || v === "notasi" || v === "transfer" ? v : null;
}

export interface Intervention {
  ts: string;
  cardIds: string[];
  lapsesBefore: number;
  repsBefore: number;
}

export function recordIntervention(slug: string, stepId: string, it: Intervention) {
  lsSet(INT_PREFIX + slug + ":" + stepId, JSON.stringify(it));
}

export function readIntervention(slug: string, stepId: string): Intervention | null {
  const raw = lsGet(INT_PREFIX + slug + ":" + stepId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Intervention;
  } catch {
    return null;
  }
}

/**
 * "Jadwalkan review ulang": majukan due semua kartu node ke sekarang
 * (pasif — hanya menulis data, tidak mengubah perilaku review).
 * Mengembalikan jumlah kartu yang dijadwalkan.
 */
export function rescheduleNodeCards(node: ConfusionNode): number {
  const nowISO = new Date().toISOString();
  let n = 0;
  const lapsesBefore = node.signals.lapses;
  const repsBefore = node.signals.reps;
  try {
    for (const cardId of node.cardIds) {
      const raw = localStorage.getItem("v2:fsrs:" + cardId);
      if (!raw) continue;
      const s = JSON.parse(raw) as StoredFsrsCard;
      if (s.v !== 1) continue;
      s.due = nowISO;
      s.updated_at = nowISO;
      localStorage.setItem("v2:fsrs:" + cardId, JSON.stringify(s));
      n++;
    }
  } catch {
    /* noop */
  }
  if (n > 0)
    recordIntervention(node.slug, node.stepId, {
      ts: nowISO,
      cardIds: node.cardIds,
      lapsesBefore,
      repsBefore,
    });
  return n;
}

export interface ResolutionEntry {
  slug: string;
  stepId: string;
  lessonTitle: string;
  stepTitle: string;
  ts: string;
  /** "membaik" | "belum jelas" — dihitung dari data, bukan klaim */
  status: "membaik" | "belum jelas";
  detail: string;
}

/** Riwayat resolusi: bandingkan lapses/reps kini vs saat intervensi. */
export function resolutionHistory(
  metaOf: (slug: string, stepId: string) => NodeMeta
): ResolutionEntry[] {
  const out: ResolutionEntry[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(INT_PREFIX)) continue;
      const rest = k.slice(INT_PREFIX.length);
      const sep = rest.indexOf(":");
      if (sep < 0) continue;
      const slug = rest.slice(0, sep);
      const stepId = rest.slice(sep + 1);
      const it = readIntervention(slug, stepId);
      if (!it) continue;
      let lapsesNow = 0,
        repsNow = 0;
      for (const cardId of it.cardIds) {
        const raw = localStorage.getItem("v2:fsrs:" + cardId);
        if (!raw) continue;
        try {
          const s = JSON.parse(raw) as StoredFsrsCard;
          lapsesNow += s.lapses ?? 0;
          repsNow += s.reps ?? 0;
        } catch {
          /* noop */
        }
      }
      const improved = lapsesNow <= it.lapsesBefore && repsNow > it.repsBefore;
      const meta = metaOf(slug, stepId);
      out.push({
        slug,
        stepId,
        lessonTitle: meta.lessonTitle,
        stepTitle: meta.stepTitle,
        ts: it.ts,
        status: improved ? "membaik" : "belum jelas",
        detail: improved
          ? `Tidak ada Again baru sejak intervensi; ${repsNow - it.repsBefore}× review tambahan tercatat.`
          : `Again: ${it.lapsesBefore} → ${lapsesNow}; review tambahan: ${repsNow - it.repsBefore}×.`,
      });
    }
  } catch {
    /* noop */
  }
  return out.sort((a, b) => (a.ts < b.ts ? 1 : -1));
}
