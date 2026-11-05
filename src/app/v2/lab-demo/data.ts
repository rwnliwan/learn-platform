// Data deterministik untuk demo lab SQL + ECharts (halaman internal /v2/lab-demo).
// Semua angka dibuat dari PRNG bersel benih tetap → sama di setiap build/run.

/** mulberry32 — PRNG deterministik kecil */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: readonly T[], weights?: readonly number[]): T {
  if (!weights) return arr[Math.floor(rand() * arr.length)];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

/* ================= dataset risiko (lab SQL) ================= */

export interface NasabahRow { id: number; nama: string; kota: string; segmen: string; tanggal_gabung: string; skor_kredit: number }
export interface TransaksiRow { id: number; nasabah_id: number; tanggal: string; jenis: string; kategori: string; nominal: number; channel: string }
export interface PinjamanRow { id: number; nasabah_id: number; produk: string; pokok: number; tenor_bulan: number; bunga_pct: number; status: string; dpd: number }

export const RISK_SCHEMA = `
CREATE TABLE nasabah (
  id INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  kota TEXT NOT NULL,
  segmen TEXT NOT NULL,          -- Ritel | Mikro | SME
  tanggal_gabung TEXT NOT NULL,  -- YYYY-MM-DD
  skor_kredit INTEGER NOT NULL
);
CREATE TABLE transaksi (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER NOT NULL REFERENCES nasabah(id),
  tanggal TEXT NOT NULL,
  jenis TEXT NOT NULL,           -- debit | kredit
  kategori TEXT NOT NULL,        -- gaji | belanja | transfer | cicilan | topup
  nominal REAL NOT NULL,
  channel TEXT NOT NULL          -- mobile | atm | teller | edc
);
CREATE TABLE pinjaman (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER NOT NULL REFERENCES nasabah(id),
  produk TEXT NOT NULL,          -- KTA | Multiguna | KPR | Modal Kerja
  pokok REAL NOT NULL,
  tenor_bulan INTEGER NOT NULL,
  bunga_pct REAL NOT NULL,
  status TEXT NOT NULL,          -- lancar | kurang_lancar | diragukan | macet
  dpd INTEGER NOT NULL           -- days past due
);`.trim();

function esc(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

export interface RiskDataset {
  nasabah: NasabahRow[];
  transaksi: TransaksiRow[];
  pinjaman: PinjamanRow[];
  schema: string;
  seedData: string;
}

export function buildRiskDataset(): RiskDataset {
  const rand = mulberry32(20261014);
  const kota = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar"] as const;
  const segmen = ["Ritel", "Mikro", "SME"] as const;

  const nasabah: NasabahRow[] = [];
  for (let i = 1; i <= 50; i++) {
    const y = 2021 + Math.floor(rand() * 4);
    const m = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
    const d = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
    nasabah.push({
      id: i,
      nama: `Nasabah-${String(i).padStart(3, "0")}`,
      kota: pick(rand, kota),
      segmen: pick(rand, segmen, [0.5, 0.3, 0.2]),
      tanggal_gabung: `${y}-${m}-${d}`,
      skor_kredit: 450 + Math.floor(rand() * 351),
    });
  }

  const jenisW = ["debit", "kredit"] as const;
  const kategori = ["gaji", "belanja", "transfer", "cicilan", "topup"] as const;
  const channel = ["mobile", "atm", "teller", "edc"] as const;
  const transaksi: TransaksiRow[] = [];
  for (let i = 1; i <= 120; i++) {
    const jenis = pick(rand, jenisW, [0.6, 0.4]);
    const m = String(1 + Math.floor(rand() * 9)).padStart(2, "0");
    const d = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
    transaksi.push({
      id: i,
      nasabah_id: 1 + Math.floor(rand() * 50),
      tanggal: `2025-${m}-${d}`,
      jenis,
      kategori: pick(rand, kategori),
      nominal: jenis === "debit" ? 50000 + Math.floor(rand() * 50) * 100000 : 50000 + Math.floor(rand() * 200) * 100000,
      channel: pick(rand, channel, [0.5, 0.25, 0.15, 0.1]),
    });
  }

  const produk = ["KTA", "Multiguna", "KPR", "Modal Kerja"] as const;
  const tenor = [6, 12, 24, 36] as const;
  const statusW = ["lancar", "kurang_lancar", "diragukan", "macet"] as const;
  // nasabah unik per pinjaman (tanpa penggantian)
  const ids = Array.from({ length: 50 }, (_, i) => i + 1);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const pinjaman: PinjamanRow[] = [];
  for (let i = 1; i <= 30; i++) {
    const status = pick(rand, statusW, [0.7, 0.15, 0.08, 0.07]);
    pinjaman.push({
      id: i,
      nasabah_id: ids[i - 1],
      produk: pick(rand, produk),
      pokok: 5000000 + Math.floor(rand() * 100) * 5000000,
      tenor_bulan: pick(rand, tenor),
      bunga_pct: Math.round((6 + rand() * 12) * 100) / 100,
      status,
      dpd: status === "lancar" ? 0 : 5 + Math.floor(rand() * 116),
    });
  }

  const ins = (table: string, cols: string[], rows: (string | number)[][]) =>
    rows.map((r) => `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${r.join(", ")});`).join("\n");
  const seedData = [
    ins("nasabah", ["id", "nama", "kota", "segmen", "tanggal_gabung", "skor_kredit"],
      nasabah.map((n) => [n.id, esc(n.nama), esc(n.kota), esc(n.segmen), esc(n.tanggal_gabung), n.skor_kredit])),
    ins("transaksi", ["id", "nasabah_id", "tanggal", "jenis", "kategori", "nominal", "channel"],
      transaksi.map((t) => [t.id, t.nasabah_id, esc(t.tanggal), esc(t.jenis), esc(t.kategori), t.nominal, esc(t.channel)])),
    ins("pinjaman", ["id", "nasabah_id", "produk", "pokok", "tenor_bulan", "bunga_pct", "status", "dpd"],
      pinjaman.map((p) => [p.id, p.nasabah_id, esc(p.produk), p.pokok, p.tenor_bulan, p.bunga_pct, esc(p.status), p.dpd])),
  ].join("\n");

  return { nasabah, transaksi, pinjaman, schema: RISK_SCHEMA, seedData };
}

/* ---- expected hasil (dihitung di JS dari baris mentah yang sama) ---- */

const NPL_STATUS = new Set(["diragukan", "macet"]);

export function expectedNplPerSegmen(ds: RiskDataset): { columns: string[]; rows: unknown[][] } {
  const bySeg = new Map<string, { total: number; npl: number }>();
  for (const p of ds.pinjaman) {
    const n = ds.nasabah.find((x) => x.id === p.nasabah_id)!;
    const g = bySeg.get(n.segmen) ?? { total: 0, npl: 0 };
    g.total++;
    if (NPL_STATUS.has(p.status)) g.npl++;
    bySeg.set(n.segmen, g);
  }
  const rows = [...bySeg.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([segmen, g]) => [segmen, g.total, g.npl, g.npl / g.total]);
  return { columns: ["segmen", "total_pinjaman", "npl", "npl_rate"], rows };
}

export function expectedTopDebitMobile(ds: RiskDataset): { columns: string[]; rows: unknown[][] } {
  const sum = new Map<number, number>();
  for (const t of ds.transaksi) {
    if (t.jenis === "debit" && t.channel === "mobile" && t.tanggal.startsWith("2025")) {
      sum.set(t.nasabah_id, (sum.get(t.nasabah_id) ?? 0) + t.nominal);
    }
  }
  const rows = [...sum.entries()]
    .map(([id, total]) => {
      const n = ds.nasabah.find((x) => x.id === id)!;
      return [id, n.nama, total] as unknown[];
    })
    .sort((a, b) => (b[2] as number) - (a[2] as number) || (a[0] as number) - (b[0] as number))
    .slice(0, 5);
  return { columns: ["nasabah_id", "nama", "total_debit"], rows };
}

/* ================= data demo ECharts ================= */

export interface Ohlc { date: string; open: number; close: number; low: number; high: number }

export function buildOhlc(): Ohlc[] {
  const rand = mulberry32(777);
  const out: Ohlc[] = [];
  let price = 5000;
  for (let i = 0; i < 30; i++) {
    const d = new Date(2026, 8, 15 + i);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const open = price;
    const drift = (rand() - 0.48) * 0.06;
    const close = Math.round(open * (1 + drift));
    const high = Math.max(open, close) + Math.round(rand() * open * 0.015);
    const low = Math.min(open, close) - Math.round(rand() * open * 0.015);
    out.push({ date, open, close, low, high });
    price = close;
  }
  return out;
}

export const CORR_FACTORS = ["Suku Bunga", "USD/IDR", "IHSG", "Minyak", "CDS 5Y"];
/** matriks korelasi simetris contoh (diagonal 1) */
export const CORR_MATRIX: number[][] = [
  [1.0, 0.42, -0.35, 0.28, 0.61],
  [0.42, 1.0, -0.58, 0.33, 0.47],
  [-0.35, -0.58, 1.0, -0.21, -0.52],
  [0.28, 0.33, -0.21, 1.0, 0.19],
  [0.61, 0.47, -0.52, 0.19, 1.0],
];

export interface BoxStats { name: string; box: [number, number, number, number, number]; outliers: number[] }

/** ringkasan 5-angka + outlier (aturan 1,5×IQR) dari return harian contoh */
export function buildReturnBoxplots(): BoxStats[] {
  const rand = mulberry32(4242);
  const assets = [
    { name: "Saham", mu: 0.0008, sigma: 0.018 },
    { name: "Obligasi", mu: 0.0002, sigma: 0.004 },
    { name: "Campuran", mu: 0.0005, sigma: 0.009 },
  ];
  return assets.map(({ name, mu, sigma }) => {
    // Box-Muller
    const rets: number[] = [];
    for (let i = 0; i < 250; i++) {
      const u1 = Math.max(rand(), 1e-9);
      const u2 = rand();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      rets.push(mu + sigma * z);
    }
    rets.sort((a, b) => a - b);
    const q = (p: number) => rets[Math.min(rets.length - 1, Math.floor(p * (rets.length - 1)))];
    const q1 = q(0.25);
    const med = q(0.5);
    const q3 = q(0.75);
    const iqr = q3 - q1;
    const lo = q1 - 1.5 * iqr;
    const hi = q3 + 1.5 * iqr;
    const inliers = rets.filter((v) => v >= lo && v <= hi);
    const outliers = rets.filter((v) => v < lo || v > hi);
    const pct = (v: number) => Math.round(v * 10000) / 100; // → persen, 2 desimal
    return {
      name,
      box: [pct(inliers[0]), pct(q1), pct(med), pct(q3), pct(inliers[inliers.length - 1])],
      outliers: outliers.map(pct),
    };
  });
}
