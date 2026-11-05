// Legacy Mode (Gelombang F — ide #45): proyeksi retensi pengetahuan jangka panjang.
//
// PRINSIP: semua proyeksi dihitung dari mesin FSRS yang SAMA (ts-fsrs) yang
// dipakai halaman Review — bukan model baru yang dikarang. State FSRS per
// kartu dibaca dari localStorage (`v2:fsrs:*`, lihat fsrs.ts). Tidak ada
// backend, tidak ada skema DB baru, tidak ada endpoint baru.
//
// OUTPUT selalu RENTANG (kuartil 25–75 antar kartu), bukan angka tunggal —
// mengikuti guardrail ide asli: proyeksi = rentang ketidakpastian, bukan janji.
// SATUAN: persen 0..100 di seluruh modul ini (mengikuti konvensi getStats()).

import { FSRS, Rating, type Card } from "ts-fsrs";
import {
  toCard,
  retrievabilityAt,
  type StoredFsrsCard,
} from "./fsrs";

export type ScenarioId = "stop" | "light" | "project";

export interface ScenarioDef {
  id: ScenarioId;
  /** Judul tab, Bahasa Indonesia. */
  title: string;
  /** Narasi satu kalimat. */
  desc: string;
  /** Asumsi model — WAJIB ditampilkan di UI, eksplisit sebagai model. */
  assumption: string;
}

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "stop",
    title: "Berhenti total",
    desc: "Tidak ada review sama sekali mulai hari ini.",
    assumption:
      "Model: kurva lupa FSRS murni dari stability terakhir tiap kartu. Tidak ada latihan ulang, tidak ada pemakaian.",
  },
  {
    id: "light",
    title: "Review ringan · 10 menit/minggu",
    desc: "Setiap minggu, 10 menit dihabiskan untuk kartu yang paling rapuh.",
    assumption:
      "Model: 10 menit ≈ 12 kartu (50 detik per kartu). Tiap minggu, 12 kartu dengan retrievability terendah direview dengan nilai Good; kartu lain terus meluruh.",
  },
  {
    id: "project",
    title: "Dipakai lewat proyek",
    desc: "Materi dipakai ulang secara rutin dalam kerja proyek.",
    assumption:
      "Model: tiap 30 hari seluruh kartu dipakai ulang sekali — dimodelkan sebagai satu review bernilai Good per kartu. Ini perkiraan kasar; pemakaian nyata lebih tidak merata.",
  },
];

export interface HorizonDef {
  days: number;
  label: string;
}

export const HORIZONS: HorizonDef[] = [
  { days: 365, label: "1 tahun" },
  { days: 1095, label: "3 tahun" },
  { days: 1825, label: "5 tahun" },
];

const sched = new FSRS({});

// ts-fsrs versi ini mengembalikan string persen ("67.24%") saat format=true
// (default) — parseFloat memberi 0..100, SAMA seperti getStats() di fsrs.ts.
function retOf(card: Card, at: Date): number {
  try {
    const v = parseFloat(String(sched.get_retrievability(card, at)));
    if (!Number.isFinite(v)) return 0;
    return Math.min(100, Math.max(0, v));
  } catch {
    return 0;
  }
}

/** Semua kartu FSRS tersimpan (reps > 0 saja yang bermakna untuk proyeksi). */
export function listProjectableCards(): StoredFsrsCard[] {
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

export interface Projection {
  cardId: string;
  /** retrievability 0..100 (persen) pada tanggal horizon */
  retention: number;
}

/**
 * Simulasi retensi tiap kartu pada horizon, per skenario.
 * - stop: satu panggilan get_retrievability per kartu (kurva lupa murni).
 * - light: simulasi mingguan — 12 kartu terlemah direview Good.
 * - project: simulasi bulanan — semua kartu direview Good tiap 30 hari.
 */
export function projectCards(
  cards: StoredFsrsCard[],
  scenario: ScenarioId,
  horizonDays: number,
  now: Date = new Date()
): Projection[] {
  const horizon = new Date(now.getTime() + horizonDays * 86400000);
  if (scenario === "stop") {
    return cards.map((c) => ({
      cardId: c.cardId,
      retention: retrievabilityAt(c, horizon) ?? 0,
    }));
  }
  const v = cards.map((c) => ({ id: c.cardId, card: toCard(c) }));
  if (scenario === "light") {
    const LIGHT_CARDS_PER_WEEK = 12;
    for (let t = 0; t < horizonDays; t += 7) {
      const at = new Date(now.getTime() + t * 86400000);
      const ranked = v
        .map((x) => ({ x, r: retOf(x.card, at) }))
        .sort((a, b) => a.r - b.r)
        .slice(0, LIGHT_CARDS_PER_WEEK);
      for (const { x } of ranked) {
        x.card = sched.next(x.card, at, Rating.Good).card;
      }
    }
  } else {
    // project: review Good untuk semua kartu tiap 30 hari
    for (let t = 30; t <= horizonDays; t += 30) {
      const at = new Date(now.getTime() + t * 86400000);
      for (const x of v) {
        x.card = sched.next(x.card, at, Rating.Good).card;
      }
    }
  }
  return v.map((x) => ({ cardId: x.id, retention: retOf(x.card, horizon) }));
}

function mean(vals: number[]): number {
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base] + (sorted[base + 1] !== undefined ? rest * (sorted[base + 1] - sorted[base]) : 0);
}

export interface Band {
  n: number;
  mean: number;
  p25: number;
  p75: number;
}

/** Ringkasan sekelompok nilai persen (0..100) sebagai band (rata-rata + kuartil). */
export function bandOf(vals: number[]): Band {
  const sorted = [...vals].sort((a, b) => a - b);
  return {
    n: vals.length,
    mean: vals.length ? mean(vals) : 0,
    p25: quantile(sorted, 0.25),
    p75: quantile(sorted, 0.75),
  };
}

export interface TrackBand {
  track: string;
  n: number;
  /** rata-rata 0..100 */
  mean: number;
  /** kuartil 0..100 — inilah "rentang" yang ditampilkan */
  p25: number;
  p75: number;
}

/** Agregasi proyeksi per track; diurut paling rapuh dulu (paling butuh perhatian). */
export function aggregateByTrack(
  proj: Projection[],
  trackOf: (cardId: string) => string
): TrackBand[] {
  const groups = new Map<string, number[]>();
  for (const p of proj) {
    const t = trackOf(p.cardId);
    const a = groups.get(t);
    if (a) a.push(p.retention);
    else groups.set(t, [p.retention]);
  }
  const out: TrackBand[] = [];
  for (const [track, vals] of groups) {
    const sorted = [...vals].sort((a, b) => a - b);
    out.push({ track, ...bandOf(vals) });
  }
  return out.sort((a, b) => a.mean - b.mean);
}

export interface AssetInfo {
  cardId: string;
  reps: number;
  retentionNow: number; // persen 0..100
}

export interface PriorityAsset extends AssetInfo {
  /** skor preservasi = investasi (reps) × kerapuhan (100 − retensi 1thn stop) */
  score: number;
  retentionStop1y: number; // persen 0..100
}

/**
 * Aset prioritas preservasi: kartu yang investasi review-nya besar (reps
 * tinggi) TAPI meluruh tercepat bila berhenti total. Top-N diambil pemanggil.
 */
export function priorityAssets(
  cards: StoredFsrsCard[],
  stop1y: Projection[],
  now: Date = new Date()
): PriorityAsset[] {
  const stop = new Map(stop1y.map((p) => [p.cardId, p.retention]));
  return cards
    .map((c) => {
      const r1 = stop.get(c.cardId) ?? 0;
      const rNow = retrievabilityAt(c, now) ?? 0;
      return {
        cardId: c.cardId,
        reps: c.reps ?? 0,
        retentionNow: rNow,
        retentionStop1y: r1,
        score: (c.reps ?? 0) * (100 - r1),
      };
    })
    .sort((a, b) => b.score - a.score);
}
