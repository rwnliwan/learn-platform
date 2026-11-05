// "Mulai dari Sini" — jalur belajar terurut (Gelombang A, 2026-10-16).
// Murni lapisan navigasi di atas registry yang sudah ada: TIDAK mengubah isi
// lesson, misi, maupun proyek. Urutan lesson memakai lessonSortKey dari
// career.ts (numerik-aware: a21 < a210 < a211). rr19 TIDAK dimasukkan ke
// jalur mana pun (aturan: jangan sentuh rr19 dalam bentuk apa pun).

import type { V2Lesson } from "./types";
import { getV2Lesson } from "./registry";
import { lessonSortKey } from "./career";
import { REG_MISI } from "./reg-misi";
import { PROYEK_REGISTRY } from "./reg-proyek";

export type PathStepKind = "lesson" | "misi" | "proyek";

export interface PathStep {
  kind: PathStepKind;
  slug: string;
  note?: string;
}

export interface PathPhase {
  title: string;
  desc?: string;
  steps: PathStep[];
}

export interface LearnPath {
  id: string;
  name: string;
  desc: string;
  /** hasil yang bisa diklaim pelajar setelah menyelesaikan jalur */
  outcome: string;
  phases: PathPhase[];
}

/* ── blok slug fondasi (urutan registry, diambil 2026-10-16) ──────────── */

const STATISTIKA = [
  "a11-tipe-data","a12-pemusatan","a13-sebaran","a14-skewness-kurtosis",
  "a15-kuantil-outlier","a16-korelasi","a17-missing-data","a18-visualisasi",
  "a19-eda-end-to-end","a21-sampling-bias","a22-estimasi-mle",
  "a23-interval-kepercayaan","a24-uji-hipotesis","a25-uji-t-anova",
  "a26-nonparametrik","a27-effect-size","a28-multiple-testing","a29-bootstrap",
  "a30-alur-modeling","a31-regresi-ols","a32-diagnostik-regresi",
  "a33-regularisasi","a34-logistic-glm","a35-metrik-klasifikasi","a36-kalibrasi",
  "a37-imbalanced-data","a38-validasi-model","a39-time-series","a210-power-sampel",
  "a211-ab-testing","a212-bayesian","a213-kausalitas","a310-volatilitas",
  "a311-pca-clustering","a312-survival-analysis","a313-kausal","a314-explainability",
  "a315-tree-boosting","a316-mixed-effects","a317-quantile-regression",
  "a318-doe-faktorial",
];
const PROBABILITAS = [
  "b1-aksioma-peluang","b2-kombinatorik","b3-peluang-bersyarat","b4-bayes",
  "b5-variabel-acak-ekspektasi","b6-distribusi-diskret-1","b6-distribusi-diskret-2",
  "b7-distribusi-kontinu-1","b7-distribusi-kontinu-2","b8-fitting-distribusi",
  "b9-joint-kovarians","b10-copula","b11-lln-clt","b12-monte-carlo","b13-vasicek",
  "b14-markov-chain","b15-proses-stokastik","b16-heavy-tails-evt",
  "b17-bayesian-praktis","b18-poisson-process","b19-mcmc","b20-hidden-markov",
];
const SQL = [
  "c1-select-dasar","c2-null-logika","c3-agregasi-groupby",
  "c4-fungsi-tanggal-string","c5-join","c6-subquery","c7-cte","c8-union-set",
  "c9-window-functions-1","c9-window-functions-2","c10-dedupe-pivot-yoy",
  "c11-cohort-retention-funnel","c12-recursive-cte","c13-risiko-dpd-rollrate",
  "c14-fraud-velocity","c15-data-quality","c16-data-modeling","c17-index-explain",
  "c18-transaksi-acid","c19-views","c20-json-sql","c21-duckdb","c22-sql-antipatterns",
];
const PYTHON = [
  "d1-python-dasar","d2-struktur-data","d3-numpy","d4-pandas-dasar",
  "d5-data-cleaning","d6-wrangling","d7-datetime-timeseries","d8-visualisasi-1",
  "d8-visualisasi-2","d9-eda","d10-feature-engineering","d11-scipy-statsmodels",
  "d12-sklearn","d13-performa","d14-rekayasa","d15-sql-python-api","d16-polars",
  "d17-pytest",
];
const CREDIT_RISK = [
  "cr1-produk-kredit","cr2-kolektibilitas","cr3-pd-lgd-ead","cr4a-basel-rwa-kpmm",
  "cr4b-ifrs9-psak71","cr5-definisi-default","cr6-analisis-portofolio",
  "cr7a-application-scorecard-1","cr7b-application-scorecard-2",
  "cr8-reject-inference","cr9-behavioral-scorecard","cr10-pd-modeling",
  "cr11-forward-looking","cr12-lgd","cr13-ead-ccf","cr14a-ecl-staging",
  "cr14b-ecl-perhitungan","cr15-risiko-portofolio","cr16-stress-testing",
  "cr17a-corporate-credit-1","cr17b-corporate-credit-2","cr18-industry-country-risk",
  "cr19-validasi-model","cr20-monitoring-kri","cr21-pricing-risiko",
  "cr22-collection-recovery","cr23-regulasi-indonesia","cr24-fairness-explainability",
  "cr25-capstone","cr26-private-credit","cr27-fintech-lending",
  "cr28-climate-risk-kredit","cr29-sekuritisasi","cr30-specialised-lending",
  "cr31-low-default-portfolio","cr32-credit-derivatives-cds",
  "cr33-basel3-final-output-floor","cr34-tkbi-v2-kredit-hijau",
];
const FRAUD_AML = [
  "aml1-triage-alert","fr1-lanskap-fraud","aml2-kyc-cdd","fr2-fraud-vs-aml",
  "aml3-edd","fr3-data-fraud","aml4-sanctions","fr4-label-fraud","aml5-structuring",
  "fr5-rule-based","aml6-layering","fr6-feature-engineering","aml7-sar",
  "fr7-supervised-ml","aml8-network","fr8-unsupervised","aml9-virtual-assets",
  "fr9-evaluasi","aml10-ira","fr10-drift","aml11-terrorist-financing",
  "fr11-threshold","aml12-bribery-corruption","fr12-graph-analytics",
  "aml13-cybercrime-laundering","fr13-realtime","aml14-regtech-ai-pkyc",
  "fr14-case-management","aml15-sanctions-evasion","fr15-aml",
  "aml16-fatf-greylist-indonesia","fr16-anomali-time-series","aml17-fusion-center",
  "fr17-explainability","aml18-defi-laundering","fr18-mlops","aml19-gaming-gambling-ml",
  "fr19-nlp-phishing","aml20-beneficial-ownership-ubo","fr20-capstone",
  "aml21-proliferation-financing","fr21-sql-fraud","fr22-chargeback",
  "fr23-regulasi-indonesia","fr24-fraud-loss-reporting-roi",
];
const MARKET_RISK = [
  "mr1-trading-book","mr2-volatilitas","mr3-var","mr4-var-lanjut",
  "mr5-expected-shortfall","mr6-backtesting","mr7-stress-test",
  "mr8-risiko-suku-bunga","mr9-kurva-yield","mr10-irrbb","mr11-options-risk",
  "mr12-fx-komoditas","mr13-risiko-likuiditas","mr14-counterparty-risk",
  "mr15-model-stokastik","mr16-regulasi-frtb","mr17-limit-laporan",
  "mr18-validasi-model","mr19-capstone-var-es","mr20-model-risk-ai",
  "mr21-crypto-market-risk","mr22-geopolitical-risk","mr23-otc-clearing-ccp",
  "mr24-risk-factor-mapping","mr25-nmrf-plat-frtb-ima","mr26-tail-risk-hedging",
];
const RISK_REPORTING = [
  "rr1-lanskap","rr2-anatomi","rr3-metrik","rr4-data-quality","rr5-visualisasi",
  "rr6-narasi","rr7-dashboard","rr8-otomasi","rr9-adhoc","rr10-regulasi",
  "rr11-stress","rr12-insiden","rr13-kri","rr14-capstone","rr15-risk-appetite",
  "rr16-ecl-rwa","rr17-bcbs239","rr18-market-risk","rr20-laporan-likuiditas",
  "rr21-sustainability-reporting","rr22-operational-risk-reporting",
  "rr23-erm-terintegrasi","rr24-pillar3-disclosure","rr25-icaap-pilar2",
  "rr26-laporan-kpmm-car",
  /* rr19-audit-impostor sengaja dikecualikan (aturan proyek) */
];
const DATA_MANAGEMENT = [
  "dm1-data-lifecycle","dm2-pemodelan-data","dm3a-database-relasional",
  "dm3b-database-nosql","dm4-data-warehouse","dm5-orkestrasi-dbt",
  "dm6-batch-streaming","dm7-kualitas-data","dm8-data-contract","dm9-governance",
  "dm10-metadata-lineage","dm11-master-data","dm12-keamanan-privasi",
  "dm13-data-risiko-regulasi","dm14-arsitektur-modern","dm15-cloud-dataops",
  "dm16-bi-analytics-engineering","dm17-strategi-data","dm18-spark-pyspark",
  "dm19-capstone-dwh","dm20-reference-data","dm21-document-management",
  "dm22-data-sharing","dm23-retensi-arsip",
];

const L = (slugs: string[]): PathStep[] => slugs.map((slug) => ({ kind: "lesson" as const, slug }));
const M = (slugs: string[], note?: string): PathStep[] =>
  slugs.map((slug) => ({ kind: "misi" as const, slug, note }));
const P = (slug: string, note?: string): PathStep[] => [{ kind: "proyek" as const, slug, note }];

/* ── definisi 5 jalur ────────────────────────────────────────────────── */

export const PATHS: LearnPath[] = [
  {
    id: "fondasi",
    name: "Fondasi Analis Data",
    desc: "Bangun fondasi kuantitatif sebelum masuk ke peran apa pun: statistika, probabilitas, SQL, dan Python — diakhiri misi-misi fondasi.",
    outcome: "Siap mengikuti track peran mana pun tanpa tersesat di prasyarat.",
    phases: [
      { title: "Statistika", desc: "Dari tipe data sampai A/B testing & kausalitas.", steps: L(STATISTIKA) },
      { title: "Probabilitas", desc: "Dari aksioma peluang sampai proses stokastik & Monte Carlo.", steps: L(PROBABILITAS) },
      { title: "SQL", desc: "Dari SELECT dasar sampai window function & pemodelan data.", steps: L(SQL) },
      { title: "Python", desc: "Dari sintaks dasar sampai pandas, sklearn & performa.", steps: L(PYTHON) },
      {
        title: "Misi fondasi",
        desc: "Uji fondasimu di kasus end-to-end dengan dataset nyata.",
        steps: M(
          [
            "misi-sampel-menyanjung",
            "misi-taman-p-hack",
            "misi-bayes-terbalik",
            "misi-kehancuran-penjudi",
            "misi-laporan-bulanan-sql",
            "misi-dua-sumber-tidak-cocok",
            "misi-pipeline-kotor-python",
          ],
          "Checkpoint praktik",
        ),
      },
    ],
  },
  {
    id: "credit",
    name: "Analis Credit Risk",
    desc: "Jalur menuju peran analis risiko kredit: fondasi kuantitatif, lalu penilaian kelayakan, PD/LGD/EAD, ECL & regulasi — ditutup proyek scorecard.",
    outcome: "Mampu membangun & membaca scorecard kredit, memahami PD/LGD/EAD/ECL, dan mempresentasikan rekomendasi cutoff.",
    phases: [
      { title: "Fondasi", desc: "Statistika, probabilitas & SQL — prasyarat pemodelan kredit.", steps: [...L(STATISTIKA), ...L(PROBABILITAS), ...L(SQL)] },
      { title: "Inti: Credit Risk", desc: "Seluruh track Credit Risk, dari produk kredit sampai kredit hijau.", steps: L(CREDIT_RISK) },
      {
        title: "Misi terapan",
        desc: "Kasus pinjaman & NPL dengan data nyata.",
        steps: M(["misi-pinjaman-pertama", "misi-npl-tersembunyi"], "Checkpoint praktik"),
      },
      {
        title: "Proyek capstone",
        desc: "Bangun scorecard kredit end-to-end dengan validasi & deteksi leakage.",
        steps: P("pj-scorecard-kredit", "Milestone akhir — deliverable dinilai"),
      },
    ],
  },
  {
    id: "fraud",
    name: "Analis Fraud / AML",
    desc: "Jalur menuju peran deteksi fraud & anti-pencucian uang: fondasi data, pola transaksi, rule engine, ML & investigasi.",
    outcome: "Mampu merancang deteksi fraud/AML: rule, fitur, model, investigasi jaringan, sampai narasi SAR.",
    phases: [
      { title: "Fondasi", desc: "Statistika, SQL & Python — prasyarat deteksi & investigasi.", steps: [...L(STATISTIKA), ...L(SQL), ...L(PYTHON)] },
      { title: "Inti: Fraud & AML Analytics", desc: "Seluruh track Fraud & AML, dari triase alert sampai proliferation financing.", steps: L(FRAUD_AML) },
      {
        title: "Misi terapan",
        desc: "Buru kartu hantu & jaringan mule dengan data transaksi.",
        steps: M(["misi-kartu-hantu", "misi-jaring-mule"], "Checkpoint praktik"),
      },
      {
        title: "Proyek capstone",
        desc: "Bangun monitoring transaksi AML end-to-end dengan rule engine & audit impostor.",
        steps: P("pj-aml-monitoring", "Milestone akhir — deliverable dinilai"),
      },
    ],
  },
  {
    id: "market",
    name: "Analis Market Risk",
    desc: "Jalur menuju peran risiko pasar: fondasi kuantitatif, VaR, expected shortfall, stress testing & valuasi.",
    outcome: "Mampu mengukur & melaporkan risiko pasar: VaR, ES, backtesting, stress test, dan audit portofolio.",
    phases: [
      { title: "Fondasi", desc: "Statistika, probabilitas & Python — prasyarat pemodelan risiko pasar.", steps: [...L(STATISTIKA), ...L(PROBABILITAS), ...L(PYTHON)] },
      { title: "Inti: Market Risk", desc: "Seluruh track Market Risk, dari trading book sampai tail-risk hedging.", steps: L(MARKET_RISK) },
      {
        title: "Misi terapan",
        desc: "Backtest VaR & uji korelasi di rezim stres.",
        steps: M(["misi-var-backtest", "misi-stress-korelasi"], "Checkpoint praktik"),
      },
      {
        title: "Proyek capstone",
        desc: "Konstruksi portofolio berbasis IPS (gaya CFA): return objective terhitung, SAA ber-kendala, rebalancing, atribusi Brinson & audit konsultan impostor.",
        steps: P("pj-ips-portofolio", "Milestone akhir — deliverable dinilai"),
      },
    ],
  },
  {
    id: "reporting",
    name: "Analis Risk Reporting",
    desc: "Jalur menuju peran pelaporan risiko: fondasi data, SQL/Python, manajemen data & penyusunan laporan yang bisa diaudit.",
    outcome: "Mampu membangun pipeline pelaporan risiko: dari query SQL sampai dashboard & laporan regulator.",
    phases: [
      { title: "Fondasi", desc: "Statistika, SQL & Python — prasyarat pelaporan & otomasi.", steps: [...L(STATISTIKA), ...L(SQL), ...L(PYTHON)] },
      { title: "Inti: Reporting & Data", desc: "Track Risk Reporting & Data Management — dari anatomi laporan sampai BCBS 239.", steps: [...L(RISK_REPORTING), ...L(DATA_MANAGEMENT)] },
      {
        title: "Misi terapan",
        desc: "Rekonsiliasi laporan dari dua sumber yang tidak cocok.",
        steps: M(["misi-rekonsiliasi-laporan", "misi-laporan-dua-sumber"], "Checkpoint praktik"),
      },
      {
        title: "Proyek capstone",
        desc: "Audit portofolio end-to-end sebagai latihan laporan yang bisa dipertahankan di depan komite.",
        steps: P("pj-audit-portofolio", "Milestone akhir — deliverable dinilai"),
      },
    ],
  },
];

export function getPath(id: string): LearnPath | null {
  return PATHS.find((p) => p.id === id) ?? null;
}

/** semua langkah jalur, diratakan mengikuti urutan fase */
export function pathSteps(path: LearnPath): PathStep[] {
  return path.phases.flatMap((ph) => ph.steps);
}

/** meta tampilan satu langkah: judul + href (tidak mengembalikan konten lesson) */
export function stepMeta(step: PathStep): { title: string; track: string; href: string } {
  if (step.kind === "misi") {
    const m = REG_MISI[step.slug];
    return {
      title: m?.title ?? step.slug,
      track: m?.track ?? "Misi",
      href: `/v2/misi/${step.slug}`,
    };
  }
  if (step.kind === "proyek") {
    const p = PROYEK_REGISTRY[step.slug];
    return {
      title: p?.title ?? step.slug,
      track: "Proyek Terpandu",
      href: `/v2/proyek/${step.slug}`,
    };
  }
  const l: V2Lesson | null = getV2Lesson(step.slug);
  return {
    title: l?.title ?? step.slug,
    track: l?.track ?? "",
    href: `/v2/learn/${step.slug}`,
  };
}

export interface PathProgress {
  total: number;
  done: number;
  pct: number;
}

/** progres: lesson "terlewati via tes" TIDAK dihitung selesai */
export function pathProgress(path: LearnPath, done: Set<string>): PathProgress {
  const steps = pathSteps(path);
  const total = steps.length;
  const doneCount = steps.filter((s) => done.has(s.slug)).length;
  return { total, done: doneCount, pct: total ? Math.round((doneCount / total) * 100) : 0 };
}

/** langkah berikutnya = langkah pertama yang belum selesai & tidak dilewati tes */
export function nextStep(path: LearnPath, done: Set<string>, skipped: Set<string>): PathStep | null {
  for (const s of pathSteps(path)) {
    if (done.has(s.slug) || skipped.has(s.slug)) continue;
    return s;
  }
  return null;
}

/** validasi semua slug resolve ke registry masing-masing; [] = bersih */
export function validatePaths(): string[] {
  const errors: string[] = [];
  for (const p of PATHS) {
    const seen = new Set<string>();
    for (const s of pathSteps(p)) {
      if (seen.has(`${s.kind}:${s.slug}`)) {
        errors.push(`[${p.id}] duplikat: ${s.kind}:${s.slug}`);
      }
      seen.add(`${s.kind}:${s.slug}`);
      const ok =
        s.kind === "lesson"
          ? getV2Lesson(s.slug) !== null
          : s.kind === "misi"
            ? s.slug in REG_MISI
            : s.slug in PROYEK_REGISTRY;
      if (!ok) errors.push(`[${p.id}] slug tidak dikenal: ${s.kind}:${s.slug}`);
    }
  }
  return errors;
}

/* helper urut numerik-aware untuk pemakaian halaman (re-ekspor pola career) */
export { lessonSortKey };
