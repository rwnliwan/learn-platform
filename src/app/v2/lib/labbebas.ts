// Lab Bebas (Gelombang I, ide #44) — experiment cards + dataset catalog.
// Seluruhnya client-side, localStorage-first. Dataset diambil dari data yang
// SUDAH ada di platform (Misi/proyek); tidak ada dataset baru yang dikarang.

export type LabLanguage = "python" | "sql";
export type Verdict = "supported" | "contradicted" | "inconclusive" | "broken";

export const VERDICT_LABEL: Record<Verdict, string> = {
  supported: "Didukung",
  contradicted: "Terbantahkan",
  inconclusive: "Tidak konklusif",
  broken: "Kode bermasalah",
};

export interface LabDataset {
  id: string;
  language: LabLanguage;
  label: string;
  /** sumber di platform, mis. "Misi: Backtest VaR" */
  source: string;
  /** info ringkas: jumlah baris, kolom/tabel */
  detail: string;
  /** Python: URL publik CSV (pola Misi: pyodide.http.open_url). */
  url?: string;
  /** SQL: nama tabel yang di-seed ke SQLite. */
  table?: string;
  /** SQL: CREATE TABLE … */
  schema?: string;
  /** SQL: INSERT … */
  seed?: string;
  /** isi awal editor */
  starter: string;
}

/* ---------- katalog dataset: semuanya sudah ada di platform ---------- */

const PY_STARTER_IMBAL = `import pandas as pd
from pyodide.http import open_url

df = pd.read_csv(open_url("/misi/misi-var-backtest/imbal_hasil.csv"))

# --- Tulis eksperimenmu di bawah ini ---
print("baris:", len(df))
print("kolom:", list(df.columns))
`;

const PY_STARTER_DBD = `import pandas as pd
from pyodide.http import open_url

df = pd.read_csv(open_url("/misi/misi-dbd-surveilans/laporan_bulanan.csv"))

# --- Tulis eksperimenmu di bawah ini ---
print("baris:", len(df))
print("kolom:", list(df.columns))
`;

// Seed IDENTIK dengan sqlLab Misi Pinjaman Pertama (misi-pinjaman-pertama.ts):
// schema + INSERT yang sama persis, agar hasil run bisa dibandingkan 1:1.
const PENGAJUAN_SCHEMA =
  "CREATE TABLE pengajuan (application_id TEXT, nama TEXT, tujuan TEXT, plafon INTEGER, installment_rate INTEGER, usia INTEGER, riwayat TEXT);";
const PENGAJUAN_SEED = [
  "INSERT INTO pengajuan VALUES",
  "('APP-2201', 'Sari Wulandari', 'modal usaha', 12000000, 4, 38, 'existing credits paid duly'),",
  "('APP-2201', 'Sari Wulandari', 'modal usaha', 12000000, 4, 38, 'existing credits paid duly'),",
  "('APP-2207', 'Budi Santoso', 'kendaraan', 85000000, 3, 45, 'no credits / all paid duly'),",
  "('APP-2207', 'Budi Santoso', 'kendaraan', 85000000, 3, 45, 'no credits / all paid duly'),",
  "('APP-2211', 'Dewi Anggraini', 'renovasi rumah', 60000000, 99, 52, 'delay in paying off'),",
  "('APP-2214', 'Agus Pratama', 'pendidikan', 25000000, 2, 29, 'all credits at this bank paid duly'),",
  "('APP-2218', 'Rina Marlina', 'furniture', 18000000, 4, 33, 'existing credits paid duly'),",
  "('APP-2223', 'Joko Susilo', 'modal usaha', 45000000, 3, 47, 'critical account / other credits elsewhere'),",
  "('APP-2229', 'Fitri Handayani', 'kesehatan', 15000000, 2, 26, 'no credits / all paid duly'),",
  "('APP-2231', 'Hendra Gunawan', 'kendaraan', 72000000, 4, 55, 'existing credits paid duly'),",
  "('APP-2235', 'Nina Kurnia', 'pendidikan', 30000000, 3, 31, 'delay in paying off'),",
  "('APP-2240', 'Dedi Supriadi', 'renovasi rumah', 55000000, 2, 60, 'all credits at this bank paid duly');",
].join("\n");

// Dihasilkan deterministik dari public/misi/misi-atribusi-menipu/belanja.csv (CRLF dibersihkan).
const BELANJA_SCHEMA = "CREATE TABLE belanja (channel TEXT, spend_rp INTEGER);";
const BELANJA_SEED = [
  "INSERT INTO belanja VALUES",
  "('display', 40000000),",
  "('social', 25000000),",
  "('email', 10000000),",
  "('search', 30000000);",
].join("\n");

// Dihasilkan deterministik dari public/misi/misi-atribusi-menipu/efek_kausal.csv (CRLF dibersihkan).
const EFEK_SCHEMA =
  "CREATE TABLE efek_kausal (channel TEXT, koefisien_logit REAL, kenaikan_peluang_pp REAL);";
const EFEK_SEED = [
  "INSERT INTO efek_kausal VALUES",
  "('display', 0.9, 9.21),",
  "('social', 0.5, 4.33),",
  "('email', 0.7, 6.6),",
  "('search', 0.1, 0.73);",
].join("\n");

export const DATASETS: LabDataset[] = [
  {
    id: "py-imbal",
    language: "python",
    label: "imbal_hasil.csv — harga & imbal hasil harian",
    source: "Misi: Backtest VaR",
    detail: "606 baris · kolom: tanggal, harga_penutupan, imbal_hasil_pct",
    url: "/misi/misi-var-backtest/imbal_hasil.csv",
    starter: PY_STARTER_IMBAL,
  },
  {
    id: "py-dbd",
    language: "python",
    label: "laporan_bulanan.csv — kasus DBD bulanan",
    source: "Misi: Surveilans DBD",
    detail: "1646 baris · kolom: provinsi, tahun, bulan, tanggal_mulai, tanggal_akhir, total_kasus, definisi_kasus",
    url: "/misi/misi-dbd-surveilans/laporan_bulanan.csv",
    starter: PY_STARTER_DBD,
  },
  {
    id: "sql-pengajuan",
    language: "sql",
    label: "pengajuan — 12 berkas aplikasi kredit",
    source: "Misi: Pinjaman Pertama (data lab yang sama)",
    detail: "12 baris · tabel: pengajuan",
    table: "pengajuan",
    schema: PENGAJUAN_SCHEMA,
    seed: PENGAJUAN_SEED,
    starter: "-- Tulis query-mu di sini\nSELECT application_id, nama, plafon\nFROM pengajuan\nORDER BY plafon DESC\nLIMIT 5;",
  },
  {
    id: "sql-belanja",
    language: "sql",
    label: "belanja — belanja media per channel",
    source: "Misi: Atribusi Menipu (belanja.csv)",
    detail: "4 baris · tabel: belanja",
    table: "belanja",
    schema: BELANJA_SCHEMA,
    seed: BELANJA_SEED,
    starter: "-- Tulis query-mu di sini\nSELECT channel, spend_rp\nFROM belanja\nORDER BY spend_rp DESC;",
  },
  {
    id: "sql-efek",
    language: "sql",
    label: "efek_kausal — efek kausal tiap channel",
    source: "Misi: Atribusi Menipu (efek_kausal.csv)",
    detail: "5 baris · tabel: efek_kausal",
    table: "efek_kausal",
    schema: EFEK_SCHEMA,
    seed: EFEK_SEED,
    starter: "-- Tulis query-mu di sini\nSELECT channel, kenaikan_peluang_pp\nFROM efek_kausal\nORDER BY kenaikan_peluang_pp DESC;",
  },
];

export function datasetsFor(lang: LabLanguage): LabDataset[] {
  return DATASETS.filter((d) => d.language === lang);
}

export function getDataset(id: string): LabDataset | undefined {
  return DATASETS.find((d) => d.id === id);
}

/* ---------- experiment card + arsip localStorage ---------- */

export interface RunRecord {
  at: string;
  timedOut: boolean;
  runError?: string;
  /** Python: pesan error runtime (mis. ValueError). */
  error?: string | null;
  /** ringkasan stdout (dipotong agar localStorage tetap ramping). */
  stdoutSummary: string;
  /** mis. "Pyodide v0.26.4 (CDN) · pandas · timeout 10 dtk" */
  envNote: string;
}

export interface ExperimentCard {
  id: string;
  createdAt: string;
  updatedAt: string;
  language: LabLanguage;
  datasetId: string;
  question: string;
  hypothesis: string;
  falsification: string;
  code: string;
  lastRun: RunRecord | null;
  verdict: Verdict | null;
}

const ARCHIVE_KEY = "v2:labbebas:experiments";
const MAX_RUNS_KEEP = 200; // batas lembut arsip agar tidak membengkak

export function loadArchive(): ExperimentCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (c): c is ExperimentCard =>
        c && typeof c.id === "string" && typeof c.code === "string"
    );
  } catch {
    return [];
  }
}

export function saveArchive(cards: ExperimentCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(cards.slice(0, MAX_RUNS_KEEP)));
  } catch {
    /* kuota penuh: arsip dibiarkan apa adanya */
  }
}

export function newCardId(): string {
  return "exp-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

/** Ringkas stdout agar hemat localStorage: max ~2000 char, potong di batas baris. */
export function summarizeStdout(out: string, max = 2000): string {
  if (out.length <= max) return out;
  const cut = out.slice(0, max);
  const nl = cut.lastIndexOf("\n");
  return (nl > max * 0.5 ? cut.slice(0, nl) : cut) + "\n…(dipotong)";
}

/** Kriteria gerbang: editor tidak boleh di-run sebelum ketiganya terisi. */
export function cardGate(card: {
  question: string;
  hypothesis: string;
  falsification: string;
}): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!card.question.trim()) missing.push("pertanyaan");
  if (!card.hypothesis.trim()) missing.push("hipotesis");
  if (!card.falsification.trim()) missing.push("kondisi falsifikasi");
  return { ok: missing.length === 0, missing };
}
