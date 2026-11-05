"use client";
import { useMemo } from "react";
import SqlLab from "../components/SqlLab";
import EChartFigure from "../components/EChartFigure";
import type { SqlLabSpec } from "../lib/types";
import {
  buildRiskDataset,
  expectedNplPerSegmen,
  expectedTopDebitMobile,
  buildOhlc,
  CORR_FACTORS,
  CORR_MATRIX,
  buildReturnBoxplots,
} from "./data";

// Dataset dibuat sekali di scope modul — deterministik (PRNG bersel tetap),
// hasilnya identik di SSR maupun di browser.
const DS = buildRiskDataset();
const NPL = expectedNplPerSegmen(DS);
const TOPDEBIT = expectedTopDebitMobile(DS);

const SQL_TASK_1_STARTER = `-- NPL rate per segmen
-- NPL = status IN ('diragukan', 'macet')
-- Kolom hasil: segmen, total_pinjaman, npl, npl_rate
SELECT
`;

const SQL_TASK_1_SOLUTION = `SELECT n.segmen AS segmen,
       COUNT(*) AS total_pinjaman,
       SUM(CASE WHEN p.status IN ('diragukan', 'macet') THEN 1 ELSE 0 END) AS npl,
       1.0 * SUM(CASE WHEN p.status IN ('diragukan', 'macet') THEN 1 ELSE 0 END) / COUNT(*) AS npl_rate
FROM pinjaman p
JOIN nasabah n ON n.id = p.nasabah_id
GROUP BY n.segmen
ORDER BY n.segmen;`;

const SQL_TASK_2_STARTER = `-- Top 5 nasabah: total nominal DEBIT terbesar via channel 'mobile' selama 2025
-- Kolom hasil: nasabah_id, nama, total_debit (terbesar dulu)
SELECT
`;

const SQL_TASK_2_SOLUTION = `SELECT t.nasabah_id AS nasabah_id,
       n.nama AS nama,
       SUM(t.nominal) AS total_debit
FROM transaksi t
JOIN nasabah n ON n.id = t.nasabah_id
WHERE t.jenis = 'debit'
  AND t.channel = 'mobile'
  AND t.tanggal LIKE '2025%'
GROUP BY t.nasabah_id, n.nama
ORDER BY total_debit DESC, t.nasabah_id ASC
LIMIT 5;`;

const USAGE_SNIPPET = `// src/app/v2/content/<track>N-....ts — ADITIF, field lama tak disentuh
import type { V2Step } from "../../lib/types";

const stepSql: V2Step = {
  id: "lab-npl-segmen",
  eyebrow: "Langkah 3 · Lab SQL",
  title: "NPL rate per segmen",
  prose: ["Pinjaman macet tidak tersebar merata ..."],
  tasks: [{ id: "t1", text: "Tulis query NPL rate per segmen" }],
  // Workspace otomatis me-render SqlLab bila field ini ada:
  sqlLab: {
    task: "Untuk tiap segmen tampilkan total_pinjaman, npl, npl_rate ...",
    schema: RISK_SCHEMA,   // string CREATE TABLE ...
    seedData: SEED_SQL,    // string INSERT ... (deterministik)
    starter: "SELECT\\n",
    solution: "SELECT ...",
    expectedColumns: ["segmen", "total_pinjaman", "npl", "npl_rate"],
    expectedRows: [["Mikro", 9, 2, 0.2222], ["Ritel", 15, 3, 0.2], ["SME", 6, 1, 0.1667]],
    // orderMatters: true,   // opsional — default: urutan baris tidak dinilai
    // floatTol: 1e-6,       // opsional — toleransi perbandingan numerik
  },
};

const stepChart: V2Step = {
  id: "lihat-distribusi",
  eyebrow: "Langkah 4 · Visual",
  title: "Distribusi return per kelas aset",
  prose: ["Boxplot ..."],
  tasks: [],
  // Workspace otomatis me-render EChartFigure di panel instruksi:
  echart: {
    option: {
      xAxis: { type: "category", data: ["Saham", "Obligasi", "Campuran"] },
      yAxis: { type: "value", name: "return harian (%)" },
      series: [{ type: "boxplot", data: [[-3.1, -0.9, 0.1, 1.0, 3.2], ...] }],
    },
    caption: "Distribusi return harian per kelas aset (%, 250 hari).",
  },
};`;

export default function LabDemoPage() {
  const spec1: SqlLabSpec = useMemo(
    () => ({
      task: "Hitung NPL rate per segmen: untuk tiap segmen (Ritel/Mikro/SME) tampilkan jumlah pinjaman (total_pinjaman), jumlah NPL (npl — status 'diragukan' atau 'macet'), dan rasio npl_rate = npl / total_pinjaman. Urutkan per segmen.",
      schema: DS.schema,
      seedData: DS.seedData,
      starter: SQL_TASK_1_STARTER,
      solution: SQL_TASK_1_SOLUTION,
      expectedColumns: NPL.columns,
      expectedRows: NPL.rows,
    }),
    []
  );
  const spec2: SqlLabSpec = useMemo(
    () => ({
      task: "Top 5 nasabah dengan total nominal DEBIT terbesar via channel 'mobile' selama 2025. Tampilkan nasabah_id, nama, total_debit — urutkan dari total terbesar (bila seri, nasabah_id terkecil dulu), LIMIT 5.",
      schema: DS.schema,
      seedData: DS.seedData,
      starter: SQL_TASK_2_STARTER,
      solution: SQL_TASK_2_SOLUTION,
      expectedColumns: TOPDEBIT.columns,
      expectedRows: TOPDEBIT.rows,
      orderMatters: true,
    }),
    []
  );

  const candleOpt = useMemo(() => {
    const ohlc = buildOhlc();
    return {
      title: { text: "Saham BANK — 30 hari terakhir", left: "center" },
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
      xAxis: { type: "category", data: ohlc.map((o) => o.date.slice(5)), scale: true, boundaryGap: true },
      yAxis: { scale: true, name: "Rp" },
      dataZoom: [{ type: "inside" }, { type: "slider", height: 24 }],
      series: [
        {
          type: "candlestick",
          name: "BANK",
          data: ohlc.map((o) => [o.open, o.close, o.low, o.high]),
          itemStyle: { color: "#1B7A4B", color0: "#B42318", borderColor: "#1B7A4B", borderColor0: "#B42318" },
        },
      ],
    };
  }, []);

  const heatOpt = useMemo(() => {
    const data: [number, number, number][] = [];
    CORR_MATRIX.forEach((row, y) => row.forEach((v, x) => data.push([x, y, Math.round(v * 100) / 100])));
    return {
      title: { text: "Matriks korelasi faktor risiko", left: "center" },
      tooltip: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        valueFormatter: (v: any) => Number(v).toFixed(2),
      },
      grid: { top: 60, bottom: 90, left: 90, right: 20 },
      xAxis: { type: "category", data: CORR_FACTORS, splitArea: { show: true } },
      yAxis: { type: "category", data: CORR_FACTORS, splitArea: { show: true } },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        inRange: { color: ["#B42318", "#F6F5F1", "#1D5FA8"] },
      },
      series: [
        {
          type: "heatmap",
          data,
          label: { show: true, fontSize: 11 },
          emphasis: { itemStyle: { shadowBlur: 8 } },
        },
      ],
    };
  }, []);

  const boxOpt = useMemo(() => {
    const stats = buildReturnBoxplots();
    return {
      title: { text: "Distribusi return harian per kelas aset", left: "center" },
      tooltip: { trigger: "item", axisPointer: { type: "shadow" } },
      xAxis: { type: "category", data: stats.map((s) => s.name), boundaryGap: true },
      yAxis: { type: "value", name: "return (%)", splitArea: { show: false } },
      series: [
        {
          type: "boxplot",
          name: "return",
          data: stats.map((s) => s.box),
          itemStyle: { color: "#E6F3EC", borderColor: "#1B7A4B" },
        },
        {
          type: "scatter",
          name: "outlier",
          data: stats.flatMap((s, i) => s.outliers.map((v) => [i, v] as [number, number])),
          itemStyle: { color: "#B42318" },
        },
      ],
    };
  }, []);

  return (
    <div className="labdemo">
      <div className="labdemo-inner">
        <div className="eyebrow">Demo internal · tidak ditautkan dari navigasi</div>
        <h1 className="step-title">Lab SQL + ECharts</h1>
        <p className="lede">
          Halaman uji untuk ITEM 3 (lab SQL in-browser via sql.js) dan ITEM 4 (Apache ECharts sebagai tipe chart baru)
          program upgrade Learn v2. Dataset contoh bertema risiko perbankan: 50 nasabah, 120 transaksi, 30 pinjaman —
          dibuat deterministik di kode.
        </p>

        <section aria-label="Lab SQL">
          <h2 className="label" style={{ fontSize: 15 }}>
            Lab SQL — tugas 1: agregasi + CASE
          </h2>
          <SqlLab spec={spec1} storageKey="v2:demo:sql1" />
        </section>

        <section aria-label="Lab SQL lanjutan" style={{ marginTop: 32 }}>
          <h2 className="label" style={{ fontSize: 15 }}>
            Lab SQL — tugas 2: JOIN + filter + LIMIT (urutan dinilai)
          </h2>
          <SqlLab spec={spec2} storageKey="v2:demo:sql2" />
        </section>

        <section aria-label="ECharts" style={{ marginTop: 40 }}>
          <h2 className="label" style={{ fontSize: 15 }}>
            ECharts — tiga tipe chart baru
          </h2>
          <EChartFigure
            option={candleOpt}
            caption="Candlestick: OHLC 30 hari saham BANK (data contoh). Hover untuk detail; dataZoom untuk memperbesar rentang."
          />
          <EChartFigure
            option={heatOpt}
            caption="Heatmap: matriks korelasi lima faktor risiko (data contoh). Merah = korelasi negatif, biru = positif."
          />
          <EChartFigure
            option={boxOpt}
            caption="Boxplot: distribusi return harian tiga kelas aset selama 250 hari (data contoh, %). Titik merah = outlier (1,5×IQR)."
          />
        </section>

        <section aria-label="Contoh pemakaian" style={{ marginTop: 40 }}>
          <h2 className="label" style={{ fontSize: 15 }}>
            Contoh pemakaian untuk lesson berikutnya
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Tambahkan field <code className="kc">sqlLab</code> atau <code className="kc">echart</code> pada sebuah{" "}
            <code className="kc">V2Step</code> — murni aditif, field lama tidak berubah. Workspace otomatis me-render
            komponen yang sesuai.
          </p>
          <pre className="codeblock">{USAGE_SNIPPET}</pre>
        </section>
      </div>
    </div>
  );
}
