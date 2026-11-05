// Time Capsule Predictions (Gelombang H — ide #19): prediksi tersegel sebelum
// ground truth proyek dibuka, dinilai kalibrasinya dengan Brier score.
//
// PRINSIP: pengguna menyegel prediksi (jawaban + keyakinan 0–100% + alasan)
// TEPAT SEBELUM langkah yang membuka hasil. Prediksi tidak bisa diedit/dihapus;
// koreksi hanya sebagai versi baru bertimestamp. Resolusi otomatis saat pengguna
// melewati langkah pembuka ground truth, memakai ANGKA YANG SAMA dengan yang
// dipakai checks proyek (lihat expected: di file konten). Bukan taruhan —
// tidak ada hukuman; yang dilatih adalah kalibrasi keyakinan.
// Versi yang disegel SETELAH resolusi ditandai "di luar jendela" dan tidak
// ikut skor (mencegah gaming lewat navigasi mundur).
//
// Semua client-side, localStorage, tanpa backend/endpoint baru.

export type TcQKind = "int" | "number" | "pair" | "code";

export interface TcQuestion {
  qid: string;
  label: string;
  kind: TcQKind;
  /** satuan untuk tampilan, mis. "%", "minggu" */
  unit?: string;
  /** nilai ground truth (angka / string) — SAMA dengan expected: konten proyek */
  expected: number | string;
  /** toleransi untuk kind number */
  tolerance?: number;
  /** teks ground truth untuk tampilan hasil */
  expectedNote: string;
  /** sumber ground truth (jejak audit, bukan untuk dihitung) */
  source: string;
}

export interface TcPoint {
  pointId: string;
  /** langkah yang MEMBUKA ground truth; titik prediksi tampil di ATAS langkah ini */
  anchorStepId: string;
  title: string;
  intro: string;
  questions: TcQuestion[];
}

export interface TcVersion {
  v: number;
  sealedAt: string;
  answers: Record<string, string>;
  conf: Record<string, number>;
  reason: string;
  /** true bila disegel setelah resolusi — tidak ikut skor */
  outOfWindow?: boolean;
}

export interface TcQResult {
  qid: string;
  answer: string;
  confidence: number;
  correct: boolean | null;
  brier: number | null;
}

export interface TcState {
  versions: TcVersion[];
  skippedAt?: string;
  resolvedAt?: string;
  /** "resolved" | "skipped" | "no-versions" */
  resolutionKind?: string;
  eligibleV?: number[];
  results?: TcQResult[];
  brier?: number;
}

/* ================= konfigurasi titik prediksi ================= */

function normNum(s: string): number | null {
  const t = s.trim().replace(/\s+/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  return parseFloat(t);
}
function normPair(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, "").split("+").sort().join("+");
}

/** cocokkan jawaban dengan ground truth; null = tidak bisa dinilai */
export function checkAnswer(q: TcQuestion, raw: string): boolean | null {
  if (q.kind === "int") {
    const a = normNum(raw);
    if (a === null || !Number.isInteger(a)) return null;
    return a === (q.expected as number);
  }
  if (q.kind === "number") {
    const a = normNum(raw);
    if (a === null) return null;
    return Math.abs(a - (q.expected as number)) <= (q.tolerance ?? 0);
  }
  if (q.kind === "pair") {
    const t = raw.trim();
    if (!t) return null;
    return normPair(t) === normPair(q.expected as string);
  }
  // code
  const t = raw.trim().toUpperCase();
  if (!t) return null;
  return t === (q.expected as string).toUpperCase();
}

export const PROJECT_POINTS: Record<string, TcPoint[]> = {
  "pj-dbd-surveilans": [
    {
      pointId: "dbd-lag",
      anchorStepId: "lab-korelasi",
      title: "Kapsul Waktu 1 — Di mana puncak korelasi?",
      intro:
        "Sebelum Lab 2 menghitung korelasi silang dari data, segel prediksimu. Ground truth dibuka begitu kamu melewati langkah ini.",
      questions: [
        {
          qid: "lag",
          label: "Pada lag berapa (minggu) korelasi hujan → kasus mencapai puncak?",
          kind: "int",
          unit: "minggu",
          expected: 7,
          expectedNote: "lag 7",
          source: "expected: lab-korelasi — lag_puncak=7",
        },
        {
          qid: "r",
          label: "Berapa nilai korelasi pada lag puncak itu?",
          kind: "number",
          expected: 0.63,
          tolerance: 0.05,
          expectedNote: "r ≈ 0,63",
          source: "expected: lab-korelasi — r_lag7≈0,63 (toleransi checks proyek: 0,05)",
        },
      ],
    },
    {
      pointId: "dbd-aturan",
      anchorStepId: "keputusan-ambang",
      title: "Kapsul Waktu 2 — Seberapa bagus aturan 100 mm?",
      intro:
        "Kamu tahu lag dominannya 7 minggu. Sebelum melihat evaluasi aturan 'hujan > 100 mm', segel prediksimu tentang kinerjanya.",
      questions: [
        {
          qid: "n_peringatan",
          label: "Berapa peringatan yang dihasilkan aturan hujan > 100 mm?",
          kind: "int",
          expected: 5,
          expectedNote: "5 peringatan (minggu 27, 67, 89, 108, 115)",
          source: "prose keputusan-ambang — 5 peringatan",
        },
        {
          qid: "precision",
          label: "Precision aturan itu (0–1)?",
          kind: "number",
          expected: 0.8,
          tolerance: 0.02,
          expectedNote: "precision 0,80",
          source: "prose keputusan-ambang — precision 0,80",
        },
        {
          qid: "recall",
          label: "Recall aturan itu (0–1)?",
          kind: "number",
          expected: 1.0,
          tolerance: 0.02,
          expectedNote: "recall 1,00",
          source: "prose keputusan-ambang — recall 1,00",
        },
      ],
    },
  ],
  "pj-vcf-varian": [
    {
      pointId: "vcf-upgma",
      anchorStepId: "lab-filogenetik",
      title: "Kapsul Waktu 1 — Siapa digabung pertama?",
      intro:
        "Matriks jarak genetik sudah di tanganmu. Sebelum Lab 4 menjalankan UPGMA, segel prediksimu tentang hasil penggabungannya.",
      questions: [
        {
          qid: "pasangan",
          label: "Pasangan sampel pertama yang digabung UPGMA? (format: X+Y)",
          kind: "pair",
          expected: "S2+S5",
          expectedNote: "S2+S5 (jarak 0,008)",
          source: "expected: lab-filogenetik — pasangan_pertama=S2+S5",
        },
        {
          qid: "tetangga",
          label: "Tetangga terdekat S1?",
          kind: "code",
          expected: "S3",
          expectedNote: "S3 (jarak 0,015)",
          source: "expected: lab-filogenetik — tetangga_s1=S3",
        },
      ],
    },
    {
      pointId: "vcf-vendor",
      anchorStepId: "dossier-vendor",
      title: "Kapsul Waktu 2 — Seberapa salah laporan vendor?",
      intro:
        "Kamu akan membandingkan tiap baris laporan 'GenoSure Lab' dengan anotasi referensi. Sebelum membuka dossier-nya, segel prediksimu.",
      questions: [
        {
          qid: "fp",
          label: "Berapa false positive vendor (dilaporkan patogenik, padahal bukan)?",
          kind: "int",
          expected: 2,
          expectedNote: "FP = 2 (var_0108, var_0256)",
          source: "expected: dossier-vendor — n_fp=2",
        },
        {
          qid: "fn",
          label: "Berapa false negative vendor (patogenik yang terlewat)?",
          kind: "int",
          expected: 1,
          expectedNote: "FN = 1 (var_0177)",
          source: "expected: dossier-vendor — n_fn=1",
        },
      ],
    },
  ],
  /* ===== Gelombang L — perluasan ke 5 proyek flagship (ide #19) ===== */
  "pj-audit-portofolio": [
    {
      pointId: "audit-sharpe",
      anchorStepId: "lab-sharpe",
      title: "Kapsul Waktu 1 — Seberapa jujur angka deck?",
      intro:
        "Deck mengklaim Sharpe 1,42 dan maximum drawdown −8%. Sebelum Lab 1 menghitung dari data mentah, segel prediksimu.",
      questions: [
        {
          qid: "sharpe",
          label: "Berapa Sharpe ratio dana yang sebenarnya (klaim deck: 1,42)?",
          kind: "number",
          expected: 0.73,
          tolerance: 0.02,
          expectedNote: "0,73 — jauh di bawah klaim 1,42",
          source: "expected: lab-sharpe — sharpe_fund=0,73 (toleransi checks proyek: 0,02)",
        },
        {
          qid: "dd",
          label: "Berapa maximum drawdown dana, dalam % (klaim deck: −8%)?",
          kind: "number",
          unit: "%",
          expected: -25.85,
          tolerance: 0.5,
          expectedNote: "−25,85% — lebih dari 3× klaim −8%",
          source: "expected: lab-sharpe — dd_maks=−25,85 (toleransi checks proyek: 0,5)",
        },
      ],
    },
    {
      pointId: "audit-jendela",
      anchorStepId: "lab-jendela",
      title: "Kapsul Waktu 2 — Cherry-picking atau bukan?",
      intro:
        "Deck memilih 2 tahun 'terbaik' untuk dipamerkan. Sebelum Lab 4 menguji jendela waktunya, segel prediksimu.",
      questions: [
        {
          qid: "cherry",
          label: "Berapa Sharpe di jendela 2 tahun terbaik pilihan deck?",
          kind: "number",
          expected: 0.99,
          tolerance: 0.02,
          expectedNote: "0,99 — bahkan di jendela terbaiknya pun tidak 1,42",
          source: "expected: lab-jendela — sharpe_cherry=0,99 (toleransi checks proyek: 0,02)",
        },
        {
          qid: "full",
          label: "Berapa Sharpe di seluruh periode penuh?",
          kind: "number",
          expected: 0.73,
          tolerance: 0.02,
          expectedNote: "0,73 — sama dengan hasil Lab 1",
          source: "expected: lab-jendela — sharpe_full=0,73 (toleransi checks proyek: 0,02)",
        },
      ],
    },
  ],
  "pj-scorecard-kredit": [
    {
      pointId: "sk-validasi",
      anchorStepId: "lab-validasi",
      title: "Kapsul Waktu 1 — Seberapa jujur modelmu di data baru?",
      intro:
        "Model dilatih di train.csv. Sebelum Lab 4 mengujinya di holdout.csv yang belum pernah dilihat model, segel prediksimu.",
      questions: [
        {
          qid: "auc",
          label: "Berapa AUC model di data holdout?",
          kind: "number",
          expected: 0.78,
          tolerance: 0.015,
          expectedNote: "AUC holdout ≈ 0,78",
          source: "expected: lab-validasi — auc_holdout≈0,78 (toleransi checks proyek: 0,015)",
        },
        {
          qid: "ks",
          label: "Berapa KS statistic di holdout?",
          kind: "number",
          expected: 0.49,
          tolerance: 0.02,
          expectedNote: "KS ≈ 0,49",
          source: "expected: lab-validasi — ks_holdout≈0,49 (toleransi checks proyek: 0,02)",
        },
      ],
    },
    {
      pointId: "sk-binning",
      anchorStepId: "lab-binning",
      title: "Kapsul Waktu 2 — Fitur ajaib atau fitur bocor?",
      intro:
        "Satu fitur terlihat 'terlalu bagus untuk jadi kenyataan'. Sebelum Lab 2 menghitung WOE & Information Value, segel prediksimu.",
      questions: [
        {
          qid: "iv_checking",
          label: "Berapa Information Value fitur checking account?",
          kind: "number",
          expected: 0.64,
          tolerance: 0.01,
          expectedNote: "IV ≈ 0,64 — prediktif kuat",
          source: "expected: lab-binning — iv_checking≈0,64 (toleransi checks proyek: 0,01)",
        },
        {
          qid: "iv_leak",
          label: "Berapa IV fitur 'ajaib' yang mencurigakan itu?",
          kind: "number",
          expected: 3.26,
          tolerance: 0.05,
          expectedNote: "IV ≈ 3,26 — tidak wajar, bocor",
          source: "expected: lab-binning — iv_leak≈3,26 (toleransi checks proyek: 0,05)",
        },
      ],
    },
  ],
  "pj-aml-monitoring": [
    {
      pointId: "aml-eda",
      anchorStepId: "lab-eda",
      title: "Kapsul Waktu 1 — Kenali medannya dulu",
      intro:
        "Aturan yang ditulis tanpa mengenal data adalah doa, bukan engineering. Sebelum Lab 1 memprofil 5.997 transaksi, segel prediksimu tentang dua angka medan ini.",
      questions: [
        {
          qid: "dorman",
          label: "Berapa akun dorman (tidak aktif) di dataset?",
          kind: "int",
          expected: 12,
          expectedNote: "12 akun dorman",
          source: "expected: lab-eda — n_dorman=12",
        },
        {
          qid: "pct_transfer",
          label: "Berapa proporsi transaksi via channel transfer (0–1)?",
          kind: "number",
          expected: 0.59,
          tolerance: 0.005,
          expectedNote: "≈ 0,59",
          source: "expected: lab-eda — pct_transfer≈0,59 (toleransi checks proyek: 0,005)",
        },
      ],
    },
    {
      pointId: "aml-rule",
      anchorStepId: "lab-rule",
      title: "Kapsul Waktu 2 — Menangkap yang sengaja menghindar",
      intro:
        "Structuring dirancang untuk lolos dari ambang tunggal. Sebelum Lab 2 menjalankan rule engine & detector, segel prediksimu.",
      questions: [
        {
          qid: "struct_tx",
          label: "Berapa transaksi structuring yang ditangkap detector?",
          kind: "int",
          expected: 9,
          expectedNote: "9 transaksi structuring",
          source: "expected: lab-rule — n_struct_tx=9",
        },
        {
          qid: "ketat",
          label: "Berapa sumber dana (SRC) yang ditandai detector ketat?",
          kind: "int",
          expected: 2,
          expectedNote: "2 (SRC01, SRC02)",
          source: "expected: lab-rule — n_ketat=2",
        },
      ],
    },
  ],
  "pj-ips-portofolio": [
    {
      pointId: "ips-return",
      anchorStepId: "lab-return",
      title: "Kapsul Waktu 1 — Satu angka yang mengikat segalanya",
      intro:
        "Angka ini menjadi GERBANG di IPS: setiap kandidat alokasi yang expected return-nya di bawahnya gugur. Sebelum Lab 2 menghitungnya dengan binary search, segel prediksimu.",
      questions: [
        {
          qid: "rstar",
          label: "Berapa required return r* (%, riil)?",
          kind: "number",
          unit: "%",
          expected: 4.2358,
          tolerance: 0.05,
          expectedNote: "4,2358% (dibulatkan 4,24%)",
          source: "expected: lab-return — r_bintang=4,2358% (toleransi checks proyek: 0,05pp)",
        },
        {
          qid: "fv",
          label: "Berapa FV check dalam juta Rp?",
          kind: "int",
          expected: 20000,
          expectedNote: "20.000 (juta Rp)",
          source: "expected: lab-return — fv_check=20000",
        },
      ],
    },
    {
      pointId: "ips-atribusi",
      anchorStepId: "lab-atribusi",
      title: "Kapsul Waktu 2 — Siapa pantas dapat kredit?",
      intro:
        "Konsultan mengklaim jasanya atas kinerja portofolio. Sebelum Lab 4 menjalankan atribusi Brinson, segel prediksimu tentang angka yang sebenarnya.",
      questions: [
        {
          qid: "excess",
          label: "Berapa excess return portofolio vs benchmark, dalam %?",
          kind: "number",
          unit: "%",
          expected: 0.265,
          tolerance: 0.005,
          expectedNote: "+0,265%",
          source: "expected: lab-atribusi — excess=+0,265% (toleransi checks proyek: 0,005pp)",
        },
        {
          qid: "alloc",
          label: "Berapa kontribusi allocation effect, dalam poin persen?",
          kind: "number",
          unit: "pp",
          expected: 0.285,
          tolerance: 0.005,
          expectedNote: "+0,285 pp",
          source: "expected: lab-atribusi — alloc=+0,285% (toleransi checks proyek: 0,005pp)",
        },
      ],
    },
  ],
  "rr19-audit-impostor": [
    {
      pointId: "rr19-fitness",
      anchorStepId: "lab-fitness",
      title: "Kapsul Waktu 1 — Wasit memeriksa doping",
      intro:
        "Sharpe adalah juara lomba; fitness adalah wasit yang memeriksa dopingnya. Sim #1153 dan #1151 sudah dibahas di materi konsep — sim #822 belum. Sebelum Lab 1 menjalankan mesin kategori, segel prediksimu.",
      questions: [
        {
          qid: "kat822",
          label: "Apa kategori fitness sim #822? (Excellent / Good / Average)",
          kind: "code",
          expected: "AVERAGE",
          expectedNote: "Average",
          source: "expected: lab-fitness — Sim #822: Average",
        },
        {
          qid: "ant822",
          label: "Apakah sim #822 masuk antrean review manual? (True / False)",
          kind: "code",
          expected: "TRUE",
          expectedNote: "True — masuk antrean",
          source: "expected: lab-fitness — Sim #822: antrean=True",
        },
      ],
    },
    {
      pointId: "rr19-impostor",
      anchorStepId: "misi",
      title: "Kapsul Waktu 2 — Temukan suntikannya sebelum debrief",
      intro:
        "Lima sabotase disuntikkan TANPA pengumuman ke dossier 17 baris — tidak ada yang menandai angka palsu dengan bendera merah. Sebelum kamu mulai menandai anomali, segel prediksimu: dua suntikan klaim berikut ada di sim ID berapa?",
      questions: [
        {
          qid: "sim_turnover",
          label: "Sim ID berapa yang ringkasan paketnya disuntik klaim 'Turnover 31% — efisien'?",
          kind: "int",
          expected: 1141,
          expectedNote: "sim #1141",
          source: "konten misi — klaim injected: true pada simId 1141 (\"Turnover 31% — efisien\")",
        },
        {
          qid: "sim_selfcorr",
          label: "Sim ID berapa yang klaim self-corr-nya disuntik ('0.28 — LOLOS ✓')?",
          kind: "int",
          expected: 1153,
          expectedNote: "sim #1153",
          source: "konten misi — klaim injected: true pada simId 1153 (\"Self-corr: 0.28 — LOLOS ✓\")",
        },
      ],
    },
  ],
};

/* ================= store (localStorage) ================= */

const TC_PREFIX = "v2:tc:";

function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string): void {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* noop */
  }
}

function key(slug: string, pointId: string): string {
  return `${TC_PREFIX}${slug}:${pointId}`;
}

export function loadTcState(slug: string, pointId: string): TcState {
  try {
    const raw = lsGet(key(slug, pointId));
    if (raw) {
      const s = JSON.parse(raw) as TcState;
      return { ...s, versions: s.versions ?? [] };
    }
  } catch {
    /* noop */
  }
  return { versions: [] };
}

function saveTcState(slug: string, pointId: string, s: TcState): void {
  lsSet(key(slug, pointId), JSON.stringify(s));
}

/** Segel prediksi baru. Tidak pernah mengedit versi lama. */
export function sealPrediction(
  slug: string,
  pointId: string,
  answers: Record<string, string>,
  conf: Record<string, number>,
  reason: string
): TcState {
  const s = loadTcState(slug, pointId);
  const v: TcVersion = {
    v: s.versions.length + 1,
    sealedAt: new Date().toISOString(),
    answers,
    conf,
    reason,
    // bila resolusi sudah terjadi, versi ini di luar jendela penilaian
    outOfWindow: s.resolvedAt ? true : undefined,
  };
  s.versions.push(v);
  delete s.skippedAt;
  saveTcState(slug, pointId, s);
  return s;
}

export function skipPoint(slug: string, pointId: string): TcState {
  const s = loadTcState(slug, pointId);
  if (!s.resolvedAt) s.skippedAt = new Date().toISOString();
  saveTcState(slug, pointId, s);
  return s;
}

export function unskipPoint(slug: string, pointId: string): TcState {
  const s = loadTcState(slug, pointId);
  if (!s.resolvedAt) delete s.skippedAt;
  saveTcState(slug, pointId, s);
  return s;
}

/* ================= resolusi & skor ================= */

function brierOf(correct: boolean | null, confidence: number): number | null {
  if (correct === null) return null;
  const c = Math.min(100, Math.max(0, confidence)) / 100;
  const o = correct ? 1 : 0;
  return (c - o) * (c - o);
}

function resolveOne(slug: string, point: TcPoint): boolean {
  const s = loadTcState(slug, point.pointId);
  if (s.resolvedAt) return false;
  s.resolvedAt = new Date().toISOString();
  if (s.skippedAt) {
    s.resolutionKind = "skipped";
  } else {
    const eligible = s.versions.filter((v) => !v.outOfWindow);
    if (eligible.length === 0) {
      s.resolutionKind = "no-versions";
    } else {
      const latest = eligible[eligible.length - 1];
      const results: TcQResult[] = point.questions.map((q) => {
        const correct = checkAnswer(q, latest.answers[q.qid] ?? "");
        const confidence = latest.conf[q.qid] ?? 50;
        return { qid: q.qid, answer: latest.answers[q.qid] ?? "", confidence, correct, brier: brierOf(correct, confidence) };
      });
      const scored = results.filter((r) => r.brier !== null) as { brier: number }[];
      s.resolutionKind = "resolved";
      s.eligibleV = eligible.map((v) => v.v);
      s.results = results;
      s.brier = scored.length ? scored.reduce((a, r) => a + r.brier, 0) / scored.length : undefined;
    }
  }
  saveTcState(slug, point.pointId, s);
  return true;
}

/**
 * Dipanggil Workspace setiap stepIdx berubah. Me-resolve semua titik yang
 * anchor-nya sudah dilewati (stepIdx > idx anchor). Return true bila ada
 * yang baru ter-resolve (agar UI me-refresh).
 */
export function resolveDuePoints(
  slug: string,
  stepIdx: number,
  steps: { id: string }[]
): boolean {
  const points = PROJECT_POINTS[slug];
  if (!points) return false;
  let changed = false;
  for (const p of points) {
    const anchorIdx = steps.findIndex((s) => s.id === p.anchorStepId);
    if (anchorIdx >= 0 && stepIdx > anchorIdx) {
      if (resolveOne(slug, p)) changed = true;
    }
  }
  return changed;
}

/** Titik-titik yang anchor-nya = langkah yang sedang dibuka. */
export function pointsAtStep(slug: string, stepId: string): TcPoint[] {
  return (PROJECT_POINTS[slug] ?? []).filter((p) => p.anchorStepId === stepId);
}

export interface ProjectSummary {
  total: number;
  resolved: number;
  skipped: number;
  pending: number;
  /** rata-rata Brier atas titik ter-resolve (undefined bila belum ada) */
  meanBrier?: number;
  points: { point: TcPoint; state: TcState }[];
}

export function projectSummary(slug: string): ProjectSummary {
  const points = PROJECT_POINTS[slug] ?? [];
  const rows = points.map((point) => ({ point, state: loadTcState(slug, point.pointId) }));
  const resolved = rows.filter((r) => r.state.resolutionKind === "resolved" && r.state.brier !== undefined);
  const skipped = rows.filter((r) => r.state.resolutionKind === "skipped" || r.state.resolutionKind === "no-versions");
  return {
    total: rows.length,
    resolved: resolved.length,
    skipped: skipped.length,
    pending: rows.length - resolved.length - skipped.length,
    meanBrier: resolved.length
      ? resolved.reduce((a, r) => a + (r.state.brier as number), 0) / resolved.length
      : undefined,
    points: rows,
  };
}

/** Interpretasi Brier untuk tampilan (bukan presisi palsu — rentang kasar). */
export function brierLabel(b: number): string {
  if (b < 0.05) return "kalibrasi sangat baik";
  if (b < 0.15) return "kalibrasi baik";
  if (b < 0.3) return "kalibrasi sedang — keyakinanmu sering meleset";
  return "kalibrasi perlu latihan — keyakinan dan hasil jarang cocok";
}
