import type { V2Lesson, ImpostorAuditSpec } from "../lib/types";

// ── Snapshot read-only Turso brain_sims, 2026-10-14 (16 sim nyata) ────────
// Nilai di bawah = nilai persis di database (spot-check: id, sharpe, fitness).
const AUDIT_SPEC: ImpostorAuditSpec = {
  version: "pilot-v1",
  snapshotDate: "2026-10-14",
  rows: [
    {
      rowId: 1, simId: 1141, family: "dsens-d2", sharpe: 2.96, fitness: 1.36,
      turnover: 0.6297, decay: 2.0, region: "USA", status: "Tunggu review",
      claims: [
        { label: "Ringkasan paket", value: "Turnover 31% — efisien", injected: true },
        { label: "Catatan", value: "Champion orth-vwap" },
      ],
    },
    {
      rowId: 2, simId: 1132, family: "dsens-d0", sharpe: 2.07, fitness: 1.54,
      turnover: 0.3832, decay: 0.0, region: "USA", status: "Tunggu review",
      claims: [{ label: "Catatan", value: "slowrev-corr-est; antrean submit" }],
    },
    {
      rowId: 3, simId: 1151, family: "w2-orth dsens-d2", sharpe: 2.88, fitness: 1.33,
      turnover: 0.659, decay: 2.0, region: "USA", status: "Baru (Wave 2)",
      claims: [{ label: "Catatan", value: "Lolos self-corr (cek manual)" }],
    },
    {
      rowId: 4, simId: 1152, family: "w2-orth dsens-d2", sharpe: 3.0, fitness: 1.41,
      turnover: 0.6577, decay: 2.0, region: "USA", status: "Baru (Wave 2)",
      claims: [{ label: "Catatan", value: "Lolos self-corr (cek manual)" }],
    },
    {
      rowId: 5, simId: 1153, family: "w2-srx dsens-d2", sharpe: 2.38, fitness: 2.1,
      turnover: 0.2484, decay: 2.0, region: "USA", status: "Baru (Wave 2)",
      claims: [
        { label: "Self-corr", value: "0.28 — LOLOS ✓", injected: true },
        { label: "Catatan verifikasi silang", value: "cek manual: 0.94 — GAGAL" },
      ],
    },
    {
      rowId: 6, simId: 1161, family: "w2-corr-est", sharpe: 2.36, fitness: 2.0,
      turnover: 0.2419, decay: 4.0, region: "USA", status: "Baru (Wave 2)",
      claims: [{ label: "Catatan", value: "Ambang Excellent; antrean submit" }],
    },
    {
      rowId: 7, simId: 1137, family: "dsens-d0", sharpe: 2.96, fitness: 1.1,
      turnover: 0.9238, decay: 0.0, region: "USA", status: "Diblokir",
      claims: [
        { label: "Label paket", value: "decay 4 (standar)", injected: true },
        { label: "Catatan", value: "Paper champion; turnover 92%" },
      ],
    },
    {
      rowId: 8, simId: 795, family: "claude-v9-s3g", sharpe: 1.75, fitness: 1.11,
      turnover: 0.2493, decay: 4.0, region: "USA", status: "Ditolak",
      claims: [
        { label: "Sub-universe", value: "Lolos ✓", injected: true },
        { label: "Sub-universe sharpe (data)", value: "0.72" },
      ],
    },
    {
      rowId: 9, simId: 1139, family: "dsens-d8", sharpe: 1.84, fitness: 1.59,
      turnover: 0.2554, decay: 8.0, region: "USA", status: "Ditolak",
      claims: [{ label: "Catatan", value: "Sub-universe sharpe 0.70 < 1.0" }],
    },
    {
      rowId: 10, simId: 1071, family: "tw-slowrev-corr-est", sharpe: 1.97, fitness: 1.66,
      turnover: 0.2864, decay: 4.0, region: "USA", status: "Ditolak",
      claims: [{ label: "Catatan", value: "Sub-universe sharpe 0.83 < 1.0" }],
    },
    {
      rowId: 11, simId: 1108, family: "tw-slowrev-corr-est", sharpe: 1.95, fitness: 1.66,
      turnover: 0.2776, decay: 4.0, region: "USA", status: "Ditolak",
      claims: [{ label: "Catatan", value: "Sub-universe sharpe 0.82 < 1.0" }],
    },
    {
      rowId: 12, simId: 832, family: "fundamental-blend", sharpe: 1.6, fitness: 1.31,
      turnover: 0.1006, decay: 4.0, region: "USA", status: "Belum dinilai",
      claims: [{ label: "Catatan", value: "Viable; turnover rendah" }],
    },
    {
      rowId: 13, simId: 822, family: "lane-c", sharpe: 1.52, fitness: 1.23,
      turnover: 0.0997, decay: 4.0, region: "USA", status: "Belum dinilai",
      claims: [{ label: "Catatan", value: "Viable; turnover rendah" }],
    },
    // Baris 14 = duplikat terselubung dari baris 10 (sim #1071 yang sama,
    // nama family sedikit berbeda). Paket mengklaim 16 sim unik.
    {
      rowId: 14, simId: 1071, family: "slowrev-corr-est", sharpe: 1.97, fitness: 1.66,
      turnover: 0.2864, decay: 4.0, region: "USA", status: "Ditolak",
      claims: [{ label: "Catatan", value: "Sub-universe sharpe 0.83 < 1.0" }],
    },
    {
      rowId: 15, simId: 846, family: "fundamental-blend", sharpe: 1.4, fitness: 1.11,
      turnover: 0.0536, decay: 4.0, region: "USA", status: "Belum dinilai",
      claims: [{ label: "Catatan", value: "Viable; turnover rendah" }],
    },
    {
      rowId: 16, simId: 398, family: "Residual-v1", sharpe: 2.26, fitness: 1.12,
      turnover: 0.7395, decay: 4.0, region: "USA", status: "Diblokir",
      claims: [{ label: "Catatan", value: "Paper champion; turnover 74%" }],
    },
    {
      rowId: 17, simId: 265, family: "advanced-v3", sharpe: 2.24, fitness: 1.05,
      turnover: 0.8401, decay: 4.0, region: "USA", status: "Diblokir",
      claims: [{ label: "Catatan", value: "Paper champion; turnover 84%" }],
    },
  ],
  injections: [
    {
      key: "self-corr-palsu",
      rowIds: [5],
      title: "Self-corr yang dipalsukan (sim #1153)",
      clue: "Dossier menulis self-corr 0.28 (LOLOS), tetapi catatan verifikasi silang di baris yang sama mencatat 0.94 (GAGAL). Dua angka untuk satu sim berarti satu di antaranya bohong — dan ambang batasnya 0.7.",
      danger: "Self-corr palsu membuat alpha yang sebenarnya berkorelasi tinggi dengan portofolio existing lolos seleksi. Hasilnya: diversifikasi ilusi — portofolio terlihat tersebar padahal bergerak bersama, dan risikonya baru terlihat saat pasar stres.",
    },
    {
      key: "turnover-mismatch",
      rowIds: [1],
      title: "Turnover ringkasan vs detail tidak cocok (sim #1141)",
      clue: "Ringkasan paket menulis turnover 31%, tetapi kolom detail menunjukkan 62.97%. Selisih dua kali lipat bukan pembulatan — ini dua cerita yang berbeda.",
      danger: "Turnover yang diremehkan membuat biaya transaksi terlihat kecil. Return bersih jadi overestimasi: alpha yang di kertas 'menguntungkan' ternyata merugi setelah biaya. Inilah cara paling umum laporan risiko menyesatkan pengambil keputusan.",
    },
    {
      key: "label-decay-salah",
      rowIds: [7],
      title: "Label decay salah (sim #1137)",
      clue: "Paket melabeli 'decay 4 (standar)' padahal kolom decay menunjukkan 0.0. Decay 0 vs 4 adalah dua strategi berbeda — yang satu tanpa peluruhan sinyal, yang satu meluruh empat hari.",
      danger: "Label parameter yang salah meracuni seluruh interpretasi: ekspektasi holding period, kapasitas dana, dan perilaku strategi saat volatilitas — semuanya dibangun di atas fondasi yang salah. Keputusan alokasi modal jadi didasarkan pada strategi yang tidak ada.",
    },
    {
      key: "duplikat-terselubung",
      rowIds: [10, 14],
      title: "Baris duplikat terselubung (sim #1071 ganda)",
      clue: "Sim #1071 muncul dua kali dengan nama family sedikit berbeda (tw-slowrev-corr-est vs slowrev-corr-est) tetapi metrik identik persis. Paket mengklaim 16 sim unik — hitung ulang barisnya.",
      danger: "Duplikat membuat stok cadangan terlihat lebih besar dari aslinya. Rencana submit harian, ekspektasi jumlah alpha, dan klaim 'klaster independen' semuanya dibangun di atas jumlah yang salah — double counting adalah dosa klasik pelaporan.",
    },
    {
      key: "klaim-subuniverse-palsu",
      rowIds: [8],
      title: "Klaim 'lolos sub-universe' palsu (sim #795)",
      clue: "Dossier menulis 'Lolos ✓' padahal sub-universe sharpe tercatat 0.72 — di bawah ambang 1.0. Klaim dan data tidak bisa dua-duanya benar.",
      danger: "Alpha yang gagal di sub-universe (tidak robust di luar universe utama) dianggap lolos. Ini risiko overfit klasik: bagus di backtest universe utama, runtuh di produksi. Sub-universe check ada justru untuk menangkap ini.",
    },
  ],
};

// ── Figur: peta keputusan audit (SVG) ─────────────────────────────────────
const FIG_DECISION = `<svg viewBox="0 0 480 360" role="img" aria-label="Peta keputusan audit: lima kondisi dan keputusan masing-masing.">
<g font-family="var(--font-ui)" text-anchor="middle">
<text x="240" y="28" font-size="13" font-weight="600" fill="var(--chart-text)">Peta keputusan auditor — kondisi → keputusan</text>
<g>
<rect x="20" y="48" width="200" height="44" rx="8" fill="var(--c1)" opacity="0.9"/>
<text x="120" y="66" font-size="10" font-weight="600" fill="#fff">Sharpe ≥ 1.25, fitness ≥ 1,</text>
<text x="120" y="80" font-size="10" fill="#fff">TO ≤ 40%, self-corr &lt; 0.7</text>
<rect x="260" y="48" width="200" height="44" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="360" y="66" font-size="11" font-weight="700" fill="var(--c1)">ANTRIAN SUBMIT</text>
<text x="360" y="80" font-size="10" fill="var(--text-muted)">calon cadangan resmi</text>
<line x1="220" y1="70" x2="260" y2="70" stroke="var(--chart-text)" stroke-width="1.5"/>
</g>
<g>
<rect x="20" y="108" width="200" height="44" rx="8" fill="var(--c5)" opacity="0.9"/>
<text x="120" y="126" font-size="10" font-weight="600" fill="#fff">Sharpe tinggi TAPI</text>
<text x="120" y="140" font-size="10" fill="#fff">turnover &gt; 70%</text>
<rect x="260" y="108" width="200" height="44" rx="8" fill="none" stroke="var(--c5)" stroke-width="2"/>
<text x="360" y="126" font-size="11" font-weight="700" fill="var(--c5)">BLOKIR</text>
<text x="360" y="140" font-size="10" fill="var(--text-muted)">paper champion — tak bisa dipakai</text>
<line x1="220" y1="130" x2="260" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
</g>
<g>
<rect x="20" y="168" width="200" height="44" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="120" y="186" font-size="10" font-weight="600" fill="#fff">Sub-universe sharpe</text>
<text x="120" y="200" font-size="10" fill="#fff">&lt; 1.0</text>
<rect x="260" y="168" width="200" height="44" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="360" y="186" font-size="11" font-weight="700" fill="var(--c4)">TOLAK</text>
<text x="360" y="200" font-size="10" fill="var(--text-muted)">tidak robust — risiko overfit</text>
<line x1="220" y1="190" x2="260" y2="190" stroke="var(--chart-text)" stroke-width="1.5"/>
</g>
<g>
<rect x="20" y="228" width="200" height="44" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="120" y="246" font-size="10" font-weight="600" fill="#fff">Self-corr ≥ 0.7</text>
<text x="120" y="260" font-size="10" fill="#fff">vs alpha yang sudah disubmit</text>
<rect x="260" y="228" width="200" height="44" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="360" y="246" font-size="11" font-weight="700" fill="var(--c4)">TOLAK</text>
<text x="360" y="260" font-size="10" fill="var(--text-muted)">duplikat portofolio</text>
<line x1="220" y1="250" x2="260" y2="250" stroke="var(--chart-text)" stroke-width="1.5"/>
</g>
<g>
<rect x="20" y="288" width="200" height="44" rx="8" fill="var(--c2)" opacity="0.9"/>
<text x="120" y="306" font-size="10" font-weight="600" fill="#fff">Angka yang sama beda</text>
<text x="120" y="320" font-size="10" fill="#fff">di dua bagian dossier</text>
<rect x="260" y="288" width="200" height="44" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/>
<text x="360" y="306" font-size="11" font-weight="700" fill="var(--c2)">TAHAN</text>
<text x="360" y="320" font-size="10" fill="var(--text-muted)">audit dulu — jangan nilai</text>
<line x1="220" y1="310" x2="260" y2="310" stroke="var(--chart-text)" stroke-width="1.5"/>
</g>
</g>
</svg>`;

// ── Figur: scatter Sharpe vs Turnover (16 titik data nyata) ───────────────
const FIG_SCATTER = `<svg viewBox="0 0 480 320" role="img" aria-label="Scatter plot Sharpe vs turnover untuk 16 simulasi: sumbu X Sharpe 1,0 sampai 3,2, sumbu Y turnover 0 sampai 100 persen.">
<g font-family="var(--font-ui)">
<text x="240" y="20" font-size="13" font-weight="600" fill="var(--chart-text)" text-anchor="middle">Sharpe vs Turnover — 16 sim nyata (snapshot 2026-10-14)</text>
<g stroke="var(--chart-text)" stroke-width="1" opacity="0.3">
<line x1="60" y1="270" x2="440" y2="270"/><line x1="60" y1="270" x2="60" y2="30"/>
</g>
<line x1="60" y1="174" x2="440" y2="174" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="444" y="177" font-size="9" fill="var(--c1)">batas antrean 40%</text>
<line x1="60" y1="102" x2="440" y2="102" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="444" y="105" font-size="9" fill="var(--c4)">batas WQB 70%</text>
<g font-size="9" fill="var(--text-muted)" text-anchor="middle">
<text x="60" y="286">1,0</text><text x="146" y="286">1,5</text><text x="232" y="286">2,0</text><text x="318" y="286">2,5</text><text x="404" y="286">3,0</text>
<text x="250" y="302" font-size="10" fill="var(--chart-text)">Sharpe →</text>
</g>
<g font-size="9" fill="var(--text-muted)" text-anchor="end">
<text x="54" y="273">0%</text><text x="54" y="177">40%</text><text x="54" y="105">70%</text><text x="54" y="33">100%</text>
</g>
<circle cx="398.5" cy="118.9" r="6" fill="var(--c1)" opacity="0.85"><title>Sim #1141: Sharpe 2.96, Turnover 63.0%</title></circle>
<text x="406.5" y="121.9" font-size="8" fill="var(--chart-text)">1141</text>
<circle cx="244.8" cy="178.0" r="6" fill="var(--c1)" opacity="0.85"><title>Sim #1132: Sharpe 2.07, Turnover 38.3%</title></circle>
<text x="252.8" y="181.0" font-size="8" fill="var(--chart-text)">1132</text>
<circle cx="384.7" cy="111.8" r="6" fill="var(--c2)" opacity="0.85"><title>Sim #1151: Sharpe 2.88, Turnover 65.9%</title></circle>
<text x="392.7" y="114.8" font-size="8" fill="var(--chart-text)">1151</text>
<circle cx="405.5" cy="112.2" r="6" fill="var(--c2)" opacity="0.85"><title>Sim #1152: Sharpe 3.0, Turnover 65.8%</title></circle>
<text x="413.5" y="115.2" font-size="8" fill="var(--chart-text)">1152</text>
<circle cx="298.4" cy="210.4" r="6" fill="var(--c2)" opacity="0.85"><title>Sim #1153: Sharpe 2.38, Turnover 24.8%</title></circle>
<text x="306.4" y="213.4" font-size="8" fill="var(--chart-text)">1153</text>
<circle cx="294.9" cy="211.9" r="6" fill="var(--c2)" opacity="0.85"><title>Sim #1161: Sharpe 2.36, Turnover 24.2%</title></circle>
<text x="302.9" y="214.9" font-size="8" fill="var(--chart-text)">1161</text>
<circle cx="398.5" cy="48.3" r="6" fill="var(--c5)" opacity="0.85"><title>Sim #1137: Sharpe 2.96, Turnover 92.4%</title></circle>
<text x="406.5" y="51.3" font-size="8" fill="var(--chart-text)">1137</text>
<circle cx="189.5" cy="210.2" r="6" fill="var(--c4)" opacity="0.85"><title>Sim #795: Sharpe 1.75, Turnover 24.9%</title></circle>
<text x="197.5" y="213.2" font-size="8" fill="var(--chart-text)">795</text>
<circle cx="205.1" cy="208.7" r="6" fill="var(--c4)" opacity="0.85"><title>Sim #1139: Sharpe 1.84, Turnover 25.5%</title></circle>
<text x="213.1" y="211.7" font-size="8" fill="var(--chart-text)">1139</text>
<circle cx="227.5" cy="201.3" r="6" fill="var(--c4)" opacity="0.85"><title>Sim #1071: Sharpe 1.97, Turnover 28.6%</title></circle>
<text x="235.5" y="204.3" font-size="8" fill="var(--chart-text)">1071</text>
<circle cx="224.1" cy="203.4" r="6" fill="var(--c4)" opacity="0.85"><title>Sim #1108: Sharpe 1.95, Turnover 27.8%</title></circle>
<text x="232.1" y="206.4" font-size="8" fill="var(--chart-text)">1108</text>
<circle cx="163.6" cy="245.9" r="6" fill="var(--c3)" opacity="0.85"><title>Sim #832: Sharpe 1.6, Turnover 10.1%</title></circle>
<text x="171.6" y="248.9" font-size="8" fill="var(--chart-text)">832</text>
<circle cx="149.8" cy="246.1" r="6" fill="var(--c3)" opacity="0.85"><title>Sim #822: Sharpe 1.52, Turnover 10.0%</title></circle>
<text x="157.8" y="249.1" font-size="8" fill="var(--chart-text)">822</text>
<circle cx="129.1" cy="257.1" r="6" fill="var(--c3)" opacity="0.85"><title>Sim #846: Sharpe 1.4, Turnover 5.4%</title></circle>
<text x="137.1" y="260.1" font-size="8" fill="var(--chart-text)">846</text>
<circle cx="277.6" cy="92.5" r="6" fill="var(--c5)" opacity="0.85"><title>Sim #398: Sharpe 2.26, Turnover 74.0%</title></circle>
<text x="285.6" y="95.5" font-size="8" fill="var(--chart-text)">398</text>
<circle cx="274.2" cy="68.4" r="6" fill="var(--c5)" opacity="0.85"><title>Sim #265: Sharpe 2.24, Turnover 84.0%</title></circle>
<text x="282.2" y="71.4" font-size="8" fill="var(--chart-text)">265</text>
<g font-size="9" fill="var(--chart-text)">
<circle cx="70" cy="308" r="5" fill="var(--c1)"/><text x="80" y="311">tunggu review</text>
<circle cx="160" cy="308" r="5" fill="var(--c2)"/><text x="170" y="311">baru (Wave 2)</text>
<circle cx="250" cy="308" r="5" fill="var(--c4)"/><text x="260" y="311">ditolak</text>
<circle cx="320" cy="308" r="5" fill="var(--c5)"/><text x="330" y="311">diblokir turnover</text>
<circle cx="410" cy="308" r="5" fill="var(--c3)"/><text x="420" y="311">viable terlewat</text>
</g>
</g>
</svg>`;

export const rr19: V2Lesson = {
  slug: "rr19-audit-impostor",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR19 — Audit Paket Alpha: Misi Auditor & Sang Impostor",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Jumat 16:40 — paket 16 alpha mendarat di mejamu",
      prose: [
        "Bayangkan: Jumat sore, 16:40. Tim kuantitatif mengirim paket berisi 16 hasil simulasi alpha — calon amunisi submit harianmu sebagai Research Consultant. Setiap baris sudah punya Sharpe, fitness, turnover, decay. Semua terlihat rapi. Terlalu rapi.",
        "Twist-nya: tiga minggu kemudian, satu alpha yang kamu submit ternyata datanya cacat — turnover yang dilaporkan 31% ternyata 63% di data aslinya. Bukan karena kamu malas. Karena paketnya berbohong dan kamu tidak punya otot untuk memeriksanya. Lesson ini melatih otot itu: kamu menjadi auditor, paketnya nyata (16 simulasi sungguhan dari database riset, snapshot 2026-10-14), dan — tanpa pengumuman — seseorang telah menyuntikkan sabotase ke dalam paketnya.",
        "Setelah lesson ini kamu bisa: (1) menilai alpha dengan lima lensa — Sharpe, fitness, turnover, self-correlation, sub-universe; (2) mendeteksi lima pola sabotase data yang paling umum; (3) menulis skrip audit otomatis untuk duplikat dan ambang batas; (4) menjelaskan kenapa tiap anomali berbahaya dalam bahasa risiko bisnis.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini pekerjaanmu, bukan tim kuant",
        type: "risk",
        body: "Di bank dan manajer investasi, analis risiko adalah garis pertahanan terakhir sebelum angka dipakai untuk keputusan. Tim kuant mengoptimasi return; kamu memastikan angka yang sampai ke pengambil keputusan bisa dipercaya. Audit bukan ketidakpercayaan — audit adalah pekerjaan.",
      },
      reference: "Auditor tidak mencari yang benar — auditor mencari yang tidak cocok.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan dan rute misi",
      prose: [
        "Lima tujuan pembelajaran — semuanya terukur. Di akhir lesson, kamu harus bisa: (1) menghitung kategori fitness (Excellent/Good/Average) dari angka mentah dan menjelaskan kenapa turnover menghukumnya; (2) menerapkan lima gerbang keputusan audit — kapan SUBMIT, kapan BLOKIR, kapan TOLAK, kapan TAHAN; (3) menemukan baris duplikat terselubung dengan skrip Python; (4) menandai minimal 4 dari 5 sabotase dalam misi audit; (5) menjelaskan dalam satu kalimat per sabotase kenapa ia berbahaya di pekerjaan risiko nyata.",
        "Rutenya: konsep inti (Sharpe → fitness → self-corr, 3 langkah) → dua lab Pyodide (hitung kategori, deteksi duplikat) → peta keputusan + chart data nyata → MISI AUDIT (dossier interaktif + debrief) → mini-case → kuis refleksi → rangkuman. Estimasi 60 menit; misi auditnya sendiri ±15 menit.",
      ],
      tasks: [],
      hints: [
        "Strategi: jangan buru-buru ke misi. Tiga langkah konsep adalah kacamata yang kamu pakai saat audit — tanpa kacamata itu, sabotase terlihat seperti angka biasa.",
      ],
      reference: "Konsep → lab → peta → misi → debrief. Kacamata dulu, baru berburu.",
    },
    {
      id: "konsep-sharpe",
      eyebrow: "Langkah 3 · Konsep",
      title: "Sharpe — Si Juara Lomba yang Butuh Wasit",
      prose: [
        "Definisi: Sharpe ratio mengukur return per unit risiko — berapa return yang kamu dapat untuk setiap satu unit volatilitas yang kamu tanggung. Semakin tinggi, semakin 'efisien' strateginya menghasilkan return.",
        "Kepribadiannya: Sharpe itu seperti juara lomba lari yang fotonya selalu bagus — tapi fotonya tidak menunjukkan apakah ia lari di trek datar atau menuruni bukit. Sharpe 2.96 terdengar hebat sampai kamu tahu turnover-nya 92%: ia 'menang' dengan berlari (trading) terus-menerus, dan biaya larinya tidak masuk foto.",
        "Kapan memakai: Sharpe adalah filter pertama — ambang 1.25 memisahkan kandidat serius dari noise. Tapi Sharpe tidak pernah boleh menjadi filter TERAKHIR. Setiap Sharpe tinggi wajib ditanya: berapa turnover-nya? Berapa fitness-nya? Apakah unik?",
      ],
      formula: String.raw`\text{Sharpe} = \frac{R_p - R_f}{\sigma_p}`,
      formulaNote: "R_p = return portofolio (tahunan), R_f = return bebas risiko, σ_p = standar deviasi return (volatilitas). Contoh: R_p = 12%, R_f = 4%, σ_p = 4% → Sharpe = (12−4)/4 = 2.0. Interpretasi: setiap 1 unit risiko dibayar 2 unit return di atas bebas risiko. Angka ini belum dikurangi biaya transaksi — di sinilah turnover masuk sebagai wasit.",
      tasks: [],
      note: {
        title: "🚨 Mitos: Sharpe tertinggi = alpha terbaik",
        type: "pitfall",
        body: "Yang benar: Sharpe tanpa konteks biaya adalah angka mentah. Sim #1137 Sharpe 2.96 — setara champion — tetapi turnover 92%: paper champion yang secara ekonomi tidak bisa dipakai karena biaya menghabiskan return. Di dunia nyata, analis yang hanya menyortir berdasarkan Sharpe akan merekomendasikan alpha yang merugi setelah biaya.",
      },
      reference: "Sharpe = filter pertama, bukan vonis terakhir. Selalu tanya: berapa biayanya?",
    },
    {
      id: "konsep-fitness",
      eyebrow: "Langkah 4 · Konsep",
      title: "Fitness & Turnover — Wasit yang Menghukum Curang",
      prose: [
        "Definisi: fitness adalah Sharpe yang 'dipaksa jujur' oleh turnover — ia menghukum strategi yang menghasilkan return dengan cara trading berlebihan. Kategorinya (standar industri): Excellent di atas 2.0, Good di atas 1.5, Average di bawah 1.5. Turnover sendiri adalah fraksi portofolio yang diperdagangkan — 0.66 berarti dua pertiga portofolio berpindah tangan.",
        "Kepribadiannya: jika Sharpe adalah foto juara lomba, fitness adalah wasit yang memeriksa apakah juaranya doping. Sim #1151 Sharpe 2.88 (foto bagus) tetapi fitness 1.33 — Average — karena turnover 65.9%: wasit melihat dopingnya. Sebaliknya sim #1153 Sharpe 'hanya' 2.38 tetapi fitness 2.10 — Excellent — karena turnover cuma 24.8%: menang bersih.",
        "Kapan memakai: fitness adalah lensa kedua setelah Sharpe. Aturan praktis: Sharpe ≥ 1.25 DAN fitness ≥ 1.0 untuk masuk antrean; turnover ≤ 40% untuk prioritas; di atas 70% = diblokir platform. Kombinasi ketiganya — bukan salah satunya — yang menentukan nasib alpha.",
      ],
      formula: String.raw`\text{fitness} = \text{Sharpe} \times \sqrt{\frac{|\text{returns}|}{\max(\text{turnover},\, 0.125)}}`,
      formulaNote: "returns = return tahunan (absolut), turnover = fraksi (0–1). Perhatikan max(turnover, 0.125): di bawah 12.5% tidak ada bonus tambahan — tetapi di atasnya, setiap kenaikan turnover menggerus fitness lewat akar kuadrat. Contoh: Sharpe 2.88, returns 8%, turnover 65.9% → fitness ≈ 2.88 × √(0.08/0.659) ≈ 1.0–1.4 (Average). Turnover adalah pajak yang tidak terlihat di foto Sharpe.",
      tasks: [],
      note: {
        title: "🚨 Mitos: fitness Excellent pasti bisa disubmit",
        type: "pitfall",
        body: "Yang benar: fitness mengukur kualitas statistik, bukan keunikan. Sim #1153 fitness 2.10 (Excellent!) tetapi KENA self-correlation — berkorelasi 0.94 dengan alpha yang sudah disubmit — sehingga tetap tidak bisa dipakai. Kualitas tanpa keunikan = duplikat yang mahal.",
      },
      hints: [
        "💡 Intuisi: Sharpe menjawab 'seberapa bagus?', fitness menjawab 'seberapa bagus SETELAH membayar biaya mainnya?' Selalu baca keduanya berpasangan.",
      ],
      reference: "Excellent > 2.0, Good > 1.5, Average < 1.5. Fitness = Sharpe setelah dipajaki turnover.",
    },
    {
      id: "konsep-selfcorr",
      eyebrow: "Langkah 5 · Konsep",
      title: "Self-Correlation & Sub-Universe — Tes Keunikan dan Ketahanan",
      prose: [
        "Definisi: self-correlation mengukur seberapa mirip alpha baru dengan alpha yang SUDAH kamu submit — korelasi di atas 0.7 berarti 'ini barang yang sama dengan baju beda' dan harus ditolak. Sub-universe check menguji alpha di luar universe utama (mis. hanya subset saham): sub-universe sharpe di bawah 1.0 berarti alpha-nya overfit — bagus di backtest, runtuh di produksi.",
        "Kepribadiannya: jika Sharpe adalah foto dan fitness adalah wasit doping, maka self-corr adalah sidik jari — memastikan 'orang' yang datang memang orang baru, bukan buronan yang berganti nama. Sub-universe adalah uji SIM di jalan berbeda — bisa nyetir di tol belum tentu bisa di jalan kampung.",
        "Kapan memakai: keduanya adalah gerbang TOLAK yang tidak bisa dinegosiasi. Tidak peduli Sharpe 3.0 — jika self-corr 0.94, ia ditolak. Tidak peduli fitness Excellent — jika sub-universe 0.72, ia ditolak. Gerbang ini melindungi hal yang paling mahal: reputasi dan modal.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: cek manual self-corr bisa diwakilkan ke 'feeling'",
        type: "pitfall",
        body: "Yang benar: korelasi 0.7 tidak bisa dirasakan — ia harus dihitung. Sim #1153 terlihat 'berbeda' (family w2-srx, decay 2) tetapi korelasinya 0.94 dengan alpha existing. Tanpa angka, auditor manusia akan meloloskannya. Inilah kenapa audit butuh sistem: mata manusia buta terhadap korelasi.",
      },
      hints: [
        "💡 Intuisi auditor: angka yang PALING berbahaya adalah angka yang tidak kamu hitung sendiri. Self-corr, sub-universe, turnover — ketiganya harus diverifikasi ke sumber, bukan dipercaya dari ringkasan.",
      ],
      reference: "Self-corr ≥ 0.7 = TOLAK. Sub-universe < 1.0 = TOLAK. Keduanya dihitung, bukan dirasa.",
    },
    {
      id: "lab-fitness",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Mesin kategori fitness",
      prose: [
        "Auditor tidak menilai dengan feeling — auditor menulis fungsi. Di lab ini kamu membangun dua fungsi yang dipakai di misi nanti: `kategori_fitness` (Excellent/Good/Average/Gagal) dan `lolos_antrean` (Sharpe ≥ 1.25, fitness ≥ 1.0, turnover ≤ 0.4). Datanya tiga sim nyata dari snapshot.",
        "Coba: ubah ambang turnover di `lolos_antrean` dari 0.4 menjadi 0.7. Sim mana yang berubah statusnya? Itulah bedanya 'prioritas internal' vs 'batas platform' — dan kenapa dua angka itu harus dibedakan dalam laporan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `kategori_fitness`: Excellent > 2.0, Good > 1.5, Average ≥ 1.0, Gagal di bawahnya" },
        { id: "t2", text: "Lengkapi `lolos_antrean`: True bila sharpe ≥ 1.25, fitness ≥ 1.0, turnover ≤ 0.4" },
        { id: "t3", text: "Jalankan dan pastikan tiga baris output tercetak" },
      ],
      expected: "Sim #1153: Excellent, antrean=True\nSim #1151: Average, antrean=False\nSim #822: Average, antrean=True",
      code: {
        starter: [
          "# Tiga sim nyata dari snapshot 2026-10-14",
          "sims = [",
          '    {"id": 1153, "sharpe": 2.38, "fitness": 2.10, "turnover": 0.2484},',
          '    {"id": 1151, "sharpe": 2.88, "fitness": 1.33, "turnover": 0.659},',
          '    {"id": 822, "sharpe": 1.52, "fitness": 1.23, "turnover": 0.0997},',
          "]",
          "",
          "def kategori_fitness(f):",
          "    # TODO: kembalikan kategorinya",
          "    return \"?\"",
          "",
          "def lolos_antrean(s):",
          "    # TODO: True/False sesuai aturan",
          "    return False",
          "",
          "for s in sims:",
          "    print(f\"Sim #{s['id']}: {kategori_fitness(s['fitness'])}, antrean={lolos_antrean(s)}\")",
        ].join("\n"),
        lockLines: 6,
        solution: [
          "# Tiga sim nyata dari snapshot 2026-10-14",
          "sims = [",
          '    {"id": 1153, "sharpe": 2.38, "fitness": 2.10, "turnover": 0.2484},',
          '    {"id": 1151, "sharpe": 2.88, "fitness": 1.33, "turnover": 0.659},',
          '    {"id": 822, "sharpe": 1.52, "fitness": 1.23, "turnover": 0.0997},',
          "]",
          "",
          "def kategori_fitness(f):",
          "    if f > 2.0:",
          "        return \"Excellent\"",
          "    if f > 1.5:",
          "        return \"Good\"",
          "    if f >= 1.0:",
          "        return \"Average\"",
          "    return \"Gagal\"",
          "",
          "def lolos_antrean(s):",
          "    return s[\"sharpe\"] >= 1.25 and s[\"fitness\"] >= 1.0 and s[\"turnover\"] <= 0.4",
          "",
          "for s in sims:",
          "    print(f\"Sim #{s['id']}: {kategori_fitness(s['fitness'])}, antrean={lolos_antrean(s)}\")",
        ].join("\n"),
        checks: [
          { kind: "stdout_matches", task: "t3", label: "Sim 1153 benar", pattern: "Sim #1153: Excellent, antrean=True", msg: "1153: fitness 2.10 = Excellent; Sharpe 2.38 ≥ 1.25, TO 24.8% ≤ 40% → antrean True." },
          { kind: "stdout_matches", task: "t3", label: "Sim 1151 benar", pattern: "Sim #1151: Average, antrean=False", msg: "1151: fitness 1.33 = Average; TO 65.9% > 40% → antrean False meski Sharpe 2.88." },
          { kind: "stdout_matches", task: "t3", label: "Sim 822 benar", pattern: "Sim #822: Average, antrean=True", msg: "822: fitness 1.23 = Average; semua ambang lolos → antrean True." },
          { kind: "uses", task: "t1", label: "Fungsi didefinisikan", token: "def", msg: "Definisikan kategori_fitness dan lolos_antrean dengan def." },
        ],
      },
      reference: "Fungsi > feeling. Aturan yang bisa dieksekusi tidak bisa dinegosiasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Lima gerbang auditor",
      prose: [
        "Sebelum misi, hafalkan peta ini — ia adalah SOP yang akan kamu pakai di setiap baris dossier. Lima kondisi, lima keputusan, tanpa area abu-abu. Perhatikan gerbang kelima: ia bukan tentang angka alpha, melainkan tentang INTEGRITAS dossier itu sendiri. Auditor yang melewatkan gerbang kelima sedang menilai angka palsu.",
        "Cara membaca figur: kotak kiri = kondisi yang kamu amati, panah = aturan, kotak kanan = keputusan + artinya. Interpretasi: urutan pemeriksaan yang benar adalah gerbang 5 DULU (apakah datanya bisa dipercaya?) baru gerbang 1–4 (apakah alphanya bagus?). Menilai alpha dari dossier yang cacat = membangun di atas pasir.",
      ],
      figure: {
        svg: FIG_DECISION,
        alt: "Peta keputusan audit: lima kondisi dan keputusan masing-masing.",
        caption: "Lima gerbang auditor. Gerbang 5 (integritas data) diperiksa pertama — sebelum menilai kualitas alpha.",
      },
      tasks: [],
      hints: [
        "💡 Aturan praktis 10 detik: untuk tiap baris, tanyakan berurutan — (1) angkanya konsisten? (2) Sharpe & fitness lolos? (3) turnover aman? (4) unik? (5) robust? Satu 'tidak' = keputusan mengikuti peta.",
      ],
      reference: "Integritas dulu (gerbang 5), kualitas kemudian (gerbang 1–4).",
    },
    {
      id: "chart",
      eyebrow: "Langkah 8 · Chart",
      title: "Membaca medan: Sharpe vs turnover",
      prose: [
        "Ini peta medannya — 16 titik, semuanya data nyata dari snapshot. Sumbu X = Sharpe (makin kanan makin 'bagus' di foto), sumbu Y = turnover (makin atas makin mahal mainnya). Dua garis putus-putus = batas antrean internal 40% dan batas platform 70%.",
        "Cara membaca: tiap titik = satu sim (arahkan kursor untuk detail); warna = status (hijau tunggu review, biru baru Wave 2, merah ditolak, oranye diblokir turnover, ungu viable-terlewat). Interpretasi: titik-titik di kanan-atas (1137, 265, 398) adalah paper champion — Sharpe elit, turnover di atas 70%, tidak bisa dipakai. Titik di kanan-bawah (1153, 1161) adalah zona emas — Sharpe tinggi DENGAN turnover rendah. Dan lihat 1071 vs 1108 yang berdekatan: dua sim mirip bukan masalah — masalahnya kalau keduanya ternyata SATU sim yang dihitung dua kali. Ingat pola ini saat misi.",
      ],
      figure: {
        svg: FIG_SCATTER,
        alt: "Scatter plot Sharpe vs turnover untuk 16 simulasi nyata.",
        caption: "16 sim nyata. Kanan-atas = paper champion (mahal), kanan-bawah = zona emas (bagus + murah).",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Titik paling kanan = yang terbaik.” Salah: titik paling kanan (1152, Sharpe 3.0) duduk di turnover 65.8% — di atas batas antrean 40%. Chart ini mengajarkan membaca DUA sumbu sekaligus; analis satu-sumbu adalah analis yang gampang ditipu.",
      },
      reference: "Baca dua sumbu. Zona emas = kanan-BAWAH, bukan kanan-atas.",
    },
    {
      id: "lab-duplikat",
      eyebrow: "Langkah 9 · Lab",
      title: "Lab 2 — Radar duplikat",
      prose: [
        "Senjata auditor berikutnya: deteksi duplikat otomatis. Paket mengklaim 16 sim unik dalam 17 baris — satu di antaranya ganda dengan nama family sedikit berbeda. Mata manusia mudah terkecoh oleh perbedaan nama; skrip tidak.",
        "Tugasmu: tulis `temukan_duplikat` yang mengembalikan list `sim_id` yang muncul lebih dari sekali. Coba: setelah ketemu, pikirkan — bagaimana jika duplikatnya tidak identik persis melainkan 'hampir sama' (mis. Sharpe 1.97 vs 1.98)? Itulah kenapa di dunia nyata radar duplikat memakai toleransi, bukan kesamaan persis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `temukan_duplikat`: kembalikan list sim_id yang muncul > 1 kali" },
        { id: "t2", text: "Jalankan dan pastikan duplikat + hitungan baris unik tercetak" },
      ],
      expected: "Duplikat: [1071]\nBaris unik: 16 dari 17",
      code: {
        starter: [
          "# 17 baris dossier: (row_id, sim_id). Paket mengklaim 16 sim unik.",
          "baris = [(1,1141),(2,1132),(3,1151),(4,1152),(5,1153),(6,1161),",
          "         (7,1137),(8,795),(9,1139),(10,1071),(11,1108),(12,832),",
          "         (13,822),(14,1071),(15,846),(16,398),(17,265)]",
          "",
          "def temukan_duplikat(data):",
          "    # TODO: kembalikan list sim_id yang muncul lebih dari sekali",
          "    return []",
          "",
          "d = temukan_duplikat(baris)",
          "print(f\"Duplikat: {d}\")",
          "print(f\"Baris unik: {len(baris) - len(d)} dari {len(baris)}\")",
        ].join("\n"),
        lockLines: 4,
        solution: [
          "# 17 baris dossier: (row_id, sim_id). Paket mengklaim 16 sim unik.",
          "baris = [(1,1141),(2,1132),(3,1151),(4,1152),(5,1153),(6,1161),",
          "         (7,1137),(8,795),(9,1139),(10,1071),(11,1108),(12,832),",
          "         (13,822),(14,1071),(15,846),(16,398),(17,265)]",
          "",
          "def temukan_duplikat(data):",
          "    hitung = {}",
          "    for _, sim_id in data:",
          "        hitung[sim_id] = hitung.get(sim_id, 0) + 1",
          "    return [s for s, c in hitung.items() if c > 1]",
          "",
          "d = temukan_duplikat(baris)",
          "print(f\"Duplikat: {d}\")",
          "print(f\"Baris unik: {len(baris) - len(d)} dari {len(baris)}\")",
        ].join("\n"),
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Duplikat ditemukan", pattern: "Duplikat: \\[1071\\]", msg: "Sim #1071 muncul di baris 10 dan 14." },
          { kind: "stdout_matches", task: "t2", label: "Hitungan unik benar", pattern: "Baris unik: 16 dari 17", msg: "17 baris − 1 duplikat = 16 unik." },
        ],
      },
      reference: "Radar duplikat: hitung kemunculan, jangan percaya nama.",
    },
    {
      id: "misi",
      eyebrow: "Langkah 10 · Misi",
      title: "Misi audit: temukan sang impostor",
      prose: [
        "Saatnya. Di bawah ini dossier lengkap paketnya — 17 baris yang diklaim sebagai 16 simulasi unik, semuanya angka nyata dari snapshot database. Lima sabotase telah disuntikkan TANPA pengumuman. Kamu tidak diberi tahu di mana — itulah inti latihannya, persis seperti pekerjaan nyata di mana tidak ada yang menandai angka palsu dengan bendera merah.",
        "Aturan main: periksa setiap baris dengan lima gerbang (integritas dulu, kualitas kemudian). Tekan “Tandai sebagai anomali” pada baris yang janggal — kamu boleh menandai lebih dari 5 baris, tetapi skor dihitung dari 5 sabotase yang tertangkap. Setelah yakin, buka debrief: semua suntikan dibuka, skormu ditampilkan, dan tiap sabotase dijelaskan kenapa berbahaya. Target: minimal 4 dari 5.",
      ],
      tasks: [],
      impostor: AUDIT_SPEC,
      reference: "Lima sabotase, tanpa pengumuman. Tandai yang janggal, buka debrief, pelajari yang terlewat.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Kamu CRO-nya: paket cacat sampai ke meja",
      prose: [
        "Skenario: kamu bukan lagi auditor — kamu CRO. Pagi ini paket berisi sim #1141 (Sharpe 2.96) sampai ke mejamu dengan headline 'Turnover 31% — efisien'. Tim mengusulkan alokasi modal Rp50 miliar. Kamu punya 10 menit sebelum rapat investasi.",
        "Pertanyaan analisis (jawab di kepala, lalu cocokkan): (1) Berapa turnover ASLI sim #1141 menurut data? (2) Keputusan apa yang kamu ambil — setujui, tolak, atau tunda? (3) Satu kalimat apa yang kamu tulis ke tim kuant sebagai tindak lanjut?",
        "Pembahasan: (1) 62.97% — dua kali lipat dari headline. (2) TUNDA — bukan tolak: alphanya sendiri (Sharpe 2.96, fitness 1.36) adalah kandidat antrean yang sah; yang cacat adalah LAPORANNYA. Menolak alpha karena laporan cacat = membuang aset; menyetujui karena headline = keputusan berbasis angka palsu. (3) Contoh: 'Verifikasi ulang seluruh angka headline vs detail sebelum rapat berikutnya; satu selisih = paket dikembalikan.' — Inilah kalimat yang membedakan CRO yang dijaga auditor dari yang tidak.",
      ],
      tasks: [],
      note: {
        title: "Pelajaran mini-case",
        type: "risk",
        body: "Kesalahan laporan ≠ kesalahan alpha. Auditor yang baik memisahkan keduanya: alpha #1141 tetap calon cadangan yang valid (sudah lolos self-corr manual), tetapi paketnya harus dikembalikan untuk diperbaiki. Menghukum alpha karena laporan = kehilangan aset; mempercayai laporan karena alpha bagus = keputusan buta.",
      },
      reference: "Tunda, bukan tolak. Perbaiki laporan, selamatkan alpha.",
    },
    {
      id: "kuis",
      eyebrow: "Langkah 12 · Kuis",
      title: "Kuis refleksi — 5 soal, lulus ≥ 4",
      prose: [
        "Lima soal tentang prinsipnya, bukan hafalannya. Setiap jawaban punya penjelasan kenapa — baca penjelasannya bahkan saat jawabanmu benar.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Sim #1151 Sharpe 2.88 tetapi fitness 1.33 (Average). Penjelasan yang TEPAT adalah…",
          options: [
            { text: "Sharpe-nya salah hitung sehingga fitness ikut salah", why: "Salah — Sharpe 2.88 benar adanya; yang 'menghukum' adalah turnover 65.9%, bukan kesalahan hitung." },
            { text: "Turnover 65.9% menggerus fitness — return-nya mahal", why: "Benar. Fitness = Sharpe setelah dipajaki turnover. Sharpe menjawab 'seberapa bagus', fitness menjawab 'seberapa bagus setelah membayar biaya mainnya'." },
            { text: "Fitness selalu lebih rendah dari Sharpe secara matematis", why: "Salah — sim #1153 Sharpe 2.38 tetapi fitness 2.10 (Excellent). Fitness bisa mendekati Sharpe bila turnover rendah." },
            { text: "Sim ini harus ditolak karena fitness Average", why: "Salah — Average bukan vonis tolak; #1151 lolos self-corr dan tetap cadangan valid, hanya prioritasnya di bawah yang turnover-nya rendah." },
          ],
        },
        {
          q: "Sim #1153 fitness 2.10 (Excellent) tetapi kena self-correlation 0.94. Keputusan audit yang benar…",
          options: [
            { text: "Tetap disubmit — Excellent mengalahkan segalanya", why: "Salah dan berbahaya. Fitness mengukur kualitas statistik, bukan keunikan. Korelasi 0.94 = duplikat portofolio." },
            { text: "Ditolak untuk submit — kualitas tanpa keunikan = duplikat mahal", why: "Benar. Gerbang self-corr tidak bisa dinegosiasi oleh fitness. #1153 adalah pelajaran bahwa 'terbaik secara statistik' ≠ 'bisa dipakai'." },
            { text: "Diturunkan prioritasnya tetapi tetap disubmit nanti", why: "Salah — self-corr ≥ 0.7 adalah gerbang TOLAK, bukan TAHAN. Menunda tidak mengubah korelasinya." },
            { text: "Dihitung ulang fitness-nya sampai lolos", why: "Salah — menghitung ulang sampai dapat angka yang diinginkan adalah manipulasi, bukan audit." },
          ],
        },
        {
          q: "Dossier menulis turnover 31% tetapi kolom detail 62.97%. Langkah auditor yang benar…",
          options: [
            { text: "Pakai angka 31% karena itu headline resmi paket", why: "Salah — headline adalah klaim, detail adalah data. Auditor selalu memverifikasi klaim ke data, bukan sebaliknya." },
            { text: "Rata-ratakan keduanya menjadi 47%", why: "Salah — mengkompromikan dua angka yang bertentangan menghasilkan angka ketiga yang tidak ada sumbernya." },
            { text: "TAHAN penilaian, verifikasi ke sumber, tolak pakai angka ringkasan", why: "Benar — gerbang 5: integritas dulu. Satu selisih = paket dikembalikan. Menilai dari angka yang belum terverifikasi = membangun di atas pasir." },
            { text: "Abaikan — selisih 2× lipat masih dalam toleransi", why: "Salah — 31% vs 63% bukan toleransi, melainkan dua cerita ekonomi yang berbeda (biaya transaksi 2× lipat)." },
          ],
        },
        {
          q: "Mengapa baris duplikat terselubung (sim #1071 ganda) berbahaya bagi perencanaan?",
          options: [
            { text: "Karena melanggar format tabel yang rapi", why: "Salah — ini soal kerapian, bukan soal risiko. Bahayanya jauh lebih dalam." },
            { text: "Karena stok cadangan terlihat lebih besar — alokasi dibangun di atas jumlah salah", why: "Benar. Double counting membuat '17 klaster independen' jadi ilusi. Rencana submit harian dan ekspektasi jumlah alpha semuanya didasarkan pada hitungan yang salah." },
            { text: "Karena duplikat selalu berarti data korup total", why: "Salah — duplikat belum tentu berarti seluruh dataset korup; ia berarti hitungan dan agregatnya salah. Reaksi proporsional: perbaiki hitungan, audit sumbernya." },
            { text: "Karena self-corr duplikat pasti 1.0", why: "Salah arah — masalah duplikat baris adalah akuntansi (jumlah), bukan korelasi. Jangan campur dua gerbang yang berbeda." },
          ],
        },
        {
          q: "Sim #795 mengklaim 'Lolos sub-universe ✓' padahal sub-universe sharpe-nya 0.72. Jika klaim itu dipercaya, risiko terbesarnya…",
          options: [
            { text: "Overfit — bagus di universe utama, runtuh di produksi", why: "Benar. Sub-universe check ada justru untuk menangkap ini: alpha yang hanya 'hafal' universe utama. Meloloskan yang gagal = mengimpor overfit ke portofolio." },
            { text: "Turnover-nya pasti ikut naik", why: "Salah — tidak ada hubungan mekanis antara sub-universe sharpe dan turnover. Jangan mengarang hubungan antar metrik." },
            { text: "Sharpe-nya otomatis turun di bawah 1.25", why: "Salah — Sharpe universe utama (#795 = 1.75) tidak berubah oleh hasil sub-universe. Yang berubah adalah KEPERCAYAAN pada angka itu." },
            { text: "Tidak ada risiko — sub-universe hanya formalitas", why: "Salah dan tepat jenis kesalahan yang dilatih lesson ini: menganggap gerbang QA sebagai formalitas adalah cara tercepat mengimpor risiko." },
          ],
        },
      ],
      reference: "Lulus ≥ 4/5. Baca 'why' tiap opsi — di sanalah pelajarannya.",
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 13 · Rangkuman",
      title: "Yang dibawa pulang auditor",
      prose: [
        "Tiga belas langkah selesai. Ini intisarinya dalam satu menit baca — dan satu peringatan terakhir tentang sang impostor.",
      ],
      tasks: [],
      summary: [
        "Sharpe = filter pertama (≥ 1.25), bukan vonis terakhir — selalu tanya biayanya.",
        "Fitness = Sharpe setelah dipajaki turnover; Excellent > 2.0, Good > 1.5, Average < 1.5.",
        "Self-corr ≥ 0.7 = TOLAK (duplikat portofolio); sub-universe < 1.0 = TOLAK (overfit). Keduanya dihitung, bukan dirasa.",
        "KAPAN TIDAK PAKAI Sharpe saja: tidak pernah menilai alpha hanya dari Sharpe — paper champion (Sharpe 2.96, turnover 92%) adalah buktinya.",
        "Gerbang 5 dulu: angka yang sama harus cocok di dua tempat; satu selisih = TAHAN dan audit.",
        "Peringatan impostor: dalam misi ini kamu DIBERITAHU ada 5 sabotase. Di pekerjaan nyata tidak ada yang memberi tahu — otot yang kamu latih hari ini (bandingkan, hitung, verifikasi ke sumber) adalah satu-satunya pemberitahuan yang akan kamu dapat.",
      ],
      reference: "Di dunia nyata tidak ada tombol 'buka debrief'. Ototmulah debrief-nya.",
    },
  ],
};
