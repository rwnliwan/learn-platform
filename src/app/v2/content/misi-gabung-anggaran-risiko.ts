import type { V2Mission } from "../lib/types";

// ── MISI ANGGARAN RISIKO: Setiap Basis Poin Punya Pemilik ─────────────────
// Capstone (Misi C) — Portfolio Management × Market Risk. Dataset 100% SINTETIS
// (seed 42): expected_returns.csv + covariance.csv (6 aset) + proposal_alokasi.csv
// (klaim CIO). File: public/misi/misi-gabung-anggaran-risiko/. Metode: METODE.md.

const BASE = "/misi/misi-gabung-anggaran-risiko";

export const misiGabungAnggaranRisiko: V2Mission = {
  slug: "misi-gabung-anggaran-risiko",
  track: "Portfolio Management",
  module: "Misi",
  title: "Misi Anggaran Risiko: Setiap Basis Poin Punya Pemilik",
  estMinutes: 170,
  role: "Analis portofolio",
  client:
    "Chief Investment Officer — proposal alokasi “terdiversifikasi” harus diverifikasi anggaran risikonya sebelum komite menyetujui",
  xp: 800,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tanda tanganmu lebih mahal dari kertasnya",
      prose: [],
      tasks: [
        { id: "t1", text: "Baca cerita briefing sampai habis — catat siapa yang memintamu dan apa taruhannya" },
        { id: "t2", text: "Hafalkan tiga tujuan terukur misi ini dengan kata-katamu sendiri" },
      ],
      briefing: {
        role: "Analis portofolio di sebuah manajer investasi — verifier independen proposal alokasi",
        client:
          "Chief Investment Officer (CIO). Ia mengajukan alokasi “terdiversifikasi” ke enam kelas aset dan butuh tanda tangan verifikasi darimu sebelum komite menyetujui. Tanpa tanda tanganmu, proposal tidak jalan. Dengan tanda tanganmu, setiap basis poin risikonya jadi tanggung jawabmu juga.",
        story: [
          "Senin, 08:15. CIO meletakkan satu halaman proposal di mejamu — alokasi “terdiversifikasi” ke enam kelas aset, lengkap dengan stempel “semua budget risiko terpenuhi”. “Komite butuh persetujuanmu sebelum makan siang,” katanya. Kamu melirik kolom bobot: Saham AS cuma 12%. Kecil. Terlalu kecil untuk kabar yang belakangan kamu dengar: desk ekuitas tiga bulan terakhir rajin membeli index futures.",
          "Kamu tahu aturannya: anggaran risiko (risk budget) bukan soal berapa persen MODAL di tiap aset, melainkan berapa persen RISIKO yang “dimiliki” tiap aset. Bobot 12% bisa memiliki 44% risiko kalau asetnya volatil, berkorelasi dengan yang lain, dan — ini yang sering disembunyikan — didongkrak derivatif yang tidak muncul di ringkasan.",
          "Misi ini memakai data 100% sintetis (seed 42): expected returns, matriks kovarians 6 aset, dan file proposal CIO. Tugasmu: hitung ulang anggaran risiko dari bobot EFEKTIF, temukan empat suntikan di ringkasan CIO, dan tulis memo persetujuan yang berani bilang “tolak” kalau angkanya memang busuk.",
        ],
        objectives: [
          "Merekonstruksi bobot efektif (bobot dilaporkan + notional derivatif) dan mendekomposisi risiko portofolio menjadi kontribusi marginal (MCTR) per aset.",
          "Membandingkan % kontribusi risiko tiap aset dengan budget-nya, menandai pelanggaran budget dan konsentrasi tersembunyi di balik label “diversifikasi”.",
          "Mengkuantifikasi risiko rezim stres, menemukan 4 suntikan di ringkasan CIO, dan menulis memo persetujuan anggaran risiko dengan rekomendasi yang dipertahankan.",
        ],
        prereqSummary:
          "Anggaran risiko = alokasi RISIKO (bukan modal) ke tiap aset: %RC_i = MCTR_i / σ_p, dengan MCTR_i = w_i × (Σw)_i / σ_p. MCTR mengukur berapa banyak volatilitas portofolio yang “dimiliki” tiap aset — bobot kecil bisa memiliki risiko besar bila volatil, berkorelasi, atau ber-leverage. Jumlah %RC selalu 100%: setiap basis poin risiko selalu punya pemilik, tidak ada yang menguap.",
        datasetNote:
          "100% SINTETIS — dibuat khusus untuk misi ini dengan seed 42 (bukan data pasar nyata).\nFile: expected_returns.csv (6 baris imbal hasil ekspektasian tahunan), covariance.csv (matriks kovarians tahunan 6×6), proposal_alokasi.csv (klaim CIO: bobot, budget risiko, kolom derivatif_notional_pct).\nUkuran total < 5MB. Dinyatakan SINTETIS di semua permukaan. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, satu kolom yang “terlupakan”",
      prose: [
        "`expected_returns.csv` — enam baris imbal hasil ekspektasian tahunan. Ini asumsi return tiap aset; bukan kebenaran, tapi titik awal yang jujur karena tertulis eksplisit.",
        "`covariance.csv` — matriks kovarians tahunan 6×6. Ini mesin penghitung risikonya: volatilitas tiap aset ada di diagonal, korelasi antar aset ada di luar diagonal. Semua perhitungan MCTR berakar di sini.",
        "`proposal_alokasi.csv` — klaim CIO: bobot per aset, budget risiko per aset, kelompok aset… dan satu kolom yang menarik: `derivatif_notional_pct`. Kolom ini TIDAK muncul di ringkasan satu halaman CIO. Catat itu baik-baik — kolom yang hilang dari ringkasan biasanya kolom yang paling penting.",
        "Aturan main: (1) risiko dihitung dari bobot EFEKTIF (bobot + notional derivatif), bukan bobot yang dilaporkan; (2) pelanggaran budget = kontribusi risiko melebihi budget lebih dari 1pp; (3) “terdiversifikasi” adalah klaim yang harus dibuktikan dengan angka, bukan diterima dari label.",
      ],
      tasks: [
        { id: "t1", text: "Buka `expected_returns.csv`: catat 6 aset dan rentang return-nya" },
        { id: "t2", text: "Buka `covariance.csv`: identifikasi aset paling volatil (diagonal terbesar)" },
        { id: "t3", text: "Buka `proposal_alokasi.csv`: bandingkan kolomnya dengan ringkasan CIO — kolom apa yang hilang?" },
      ],
      note: {
        title: "Miskonsepsi #1: bobot kecil = risiko kecil",
        type: "pitfall",
        body: "“Saham AS cuma 12%, pasti jinak.” SALAH — dan ini miskonsepsi yang paling mahal di industri. Bobot adalah soal modal; risiko adalah soal bobot × volatilitas × korelasi × leverage. Saham AS 12% yang volatil 18%, berkorelasi 0,65–0,75 dengan aset ekuitas lain, DAN didongkrak futures 25% (efektif 37%) — memiliki 44,24% total risiko portofolio. Itulah kenapa anggaran risiko ada: modal berbohong, risiko tidak.",
      },
      reference:
        "expected_returns.csv (asumsi return) + covariance.csv (mesin risiko) + proposal_alokasi.csv (klaim CIO). Hitung dari file mentah; adili klaim ringkasan.",
    },
    {
      id: "lab-risiko",
      eyebrow: "Langkah 3 · Lab 1 — Dekomposisi anggaran risiko",
      title: "Setiap basis poin punya pemilik — buktikan",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `proposal_alokasi.csv`: bangun bobot EFEKTIF (bobot dilaporkan + `derivatif_notional_pct`), hitung volatilitas portofolio versi “dilaporkan” vs “efektif”, lalu dekomposisi risikonya — MCTR tiap aset dan persen kontribusinya terhadap total risiko. Terakhir: bandingkan tiap kontribusi dengan budget-nya, ukur pangsa risiko cluster ekuitas, dan hitung volatilitas di rezim stres (definisinya di METODE.md).",
        "Rumus MCTR sudah disiapkan di bawah — lengkap dengan arti tiap simbol. Tugasmu menerjemahkannya ke kode, bukan menghafalnya.",
      ],
      tasks: [
        { id: "t1", text: "Muat 3 CSV; hitung `bobot_efektif`, `bobot_neto`, `eksposur_bruto`" },
        { id: "t2", text: "Hitung `vol_dilaporkan`, `vol_efektif`, `mctr_saham_as`, `rc_saham_as`" },
        { id: "t3", text: "Hitung `n_pelanggaran` + `pelanggar_utama` (deviasi > 1pp), `rc_ekuitas`, `vol_stres`" },
      ],
      expected:
        "bobot_neto=100,0, eksposur_bruto=170,0, vol_dilaporkan=8,96%, vol_efektif=13,91%, mctr_saham_as=0,0615, rc_saham_as=44,24%, n_pelanggaran=1 (saham_as, +24,24pp), rc_ekuitas=77,32%, vol_stres=15,84%",
      formula: String.raw`\text{MCTR}_i = \frac{w_i \cdot (\Sigma w)_i}{\sigma_p}`,
      formulaNote:
        "w_i = bobot EFEKTIF aset i (fraksi NAV — sudah termasuk notional derivatif, bukan bobot laporan). Σ (sigma kapital) = matriks kovarians tahunan 6×6. (Σw)_i = kovarians aset i terhadap seluruh portofolio: seberapa “searah” aset i bergerak dengan dompetmu (sudah mencakup korelasinya dengan semua aset lain). σ_p = volatilitas portofolio = akar dari w^T Σ w. MCTR_i = porsi volatilitas portofolio yang “dimiliki” aset i, dalam satuan absolut. Persen kontribusi risiko = MCTR_i / σ_p × 100% — jumlahnya selalu 100%: tidak ada risiko yang menguap tanpa pemilik.",
      note: {
        title: "Miskonsepsi #2: neto 100% = tanpa leverage",
        type: "pitfall",
        body: "Proposal CIO neto 100% — terdengar fully invested dan polos. Tapi bruto-nya 170%: aset efektif 135% didanai kas −35% yang bahkan tidak punya baris di tabel. Leverage tidak selalu berbentuk utang bank; futures dan TRS menciptakannya tanpa mengubah angka “100%” di halaman ringkasan. Validator yang hanya membaca ringkasan akan menandatangani leverage 1,7× sambil mengira portofolionya polos.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))` — covariance.csv dibaca dengan `index_col=0` agar baris dan kolom sejajar.",
        "Bobot efektif: `prop[\"bobot_pct\"] + prop[\"derivatif_notional_pct\"]` — tanpa kolom kedua ini, kamu menghitung versi CIO, bukan versi kebenaran.",
        "Volatilitas: `np.sqrt(w @ Sigma @ w)` dengan w dalam fraksi (bagi 100 dulu), kali 100 untuk persen. Bandingkan w versi dilaporkan vs efektif.",
        "MCTR: `w_eff * (Sigma @ w_eff) / vol_desimal`, lalu `%RC = MCTR / vol_desimal * 100`. Cek: jumlah %RC harus 100.",
        "Rezim stres: bangun matriks korelasi stres dari METODE.md, kalikan dengan vol tiap aset (akar diagonal kovarians) untuk mendapatkan kovarians stres, lalu hitung ulang vol dengan w_eff.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-anggaran-risiko\"",
          "er = pd.read_csv(open_url(BASE + \"/expected_returns.csv\"))",
          "cov = pd.read_csv(open_url(BASE + \"/covariance.csv\"), index_col=0)",
          "prop = pd.read_csv(open_url(BASE + \"/proposal_alokasi.csv\")).set_index(\"aset\")",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "aset = [\"saham_as\", \"saham_eropa\", \"obligasi\", \"kredit_ig\", \"kredit_hy\", \"reit\"]",
          "",
          "bobot_efektif = ...   # bobot_pct + derivatif_notional_pct",
          "bobot_neto = ...",
          "eksposur_bruto = ...  # aset efektif + |kas short|",
          "",
          "Sigma = cov.loc[aset, aset].values",
          "w_rep = ...           # fraksi, dari bobot_pct",
          "w_eff = ...           # fraksi, dari bobot_efektif",
          "vol_dilaporkan = ...",
          "vol_efektif = ...",
          "",
          "mctr = ...",
          "rc_pct = ...",
          "rc = dict(zip(aset, rc_pct))",
          "mctr_saham_as = ...",
          "rc_saham_as = ...",
          "",
          "budget = prop[\"budget_risiko_pct\"].to_dict()",
          "deviasi = ...",
          "pelanggaran = ...     # aset dengan deviasi > 1.0 (pp)",
          "n_pelanggaran = ...",
          "pelanggar_utama = ...",
          "rc_ekuitas = ...      # jumlahkan rc aset berkelompok 'ekuitas'",
          "",
          "# Rezim stres (pasangan korelasi dari METODE.md)",
          "STRES = ...",
          "vol_aset = np.sqrt(np.diag(Sigma))",
          "CS = np.eye(6)",
          "for (a, b), v in STRES.items():",
          "    i, j = aset.index(a), aset.index(b)",
          "    CS[i, j] = v; CS[j, i] = v",
          "Sigma_stres = np.outer(vol_aset, vol_aset) * CS",
          "vol_stres = ...",
          "",
          "print(\"neto:\", bobot_neto, \"| bruto:\", eksposur_bruto)",
          "print(\"vol dilaporkan:\", round(vol_dilaporkan, 2), \"% | vol efektif:\", round(vol_efektif, 2), \"% | vol stres:\", round(vol_stres, 2), \"%\")",
          "print(\"MCTR saham_as:\", round(mctr_saham_as, 6), \"| %RC:\", round(rc_saham_as, 2))",
          "print(\"pelanggaran:\", n_pelanggaran, pelanggar_utama, \"| RC ekuitas:\", round(rc_ekuitas, 2), \"%\")",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-anggaran-risiko\"",
          "er = pd.read_csv(open_url(BASE + \"/expected_returns.csv\"))",
          "cov = pd.read_csv(open_url(BASE + \"/covariance.csv\"), index_col=0)",
          "prop = pd.read_csv(open_url(BASE + \"/proposal_alokasi.csv\")).set_index(\"aset\")",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "aset = [\"saham_as\", \"saham_eropa\", \"obligasi\", \"kredit_ig\", \"kredit_hy\", \"reit\"]",
          "",
          "bobot_efektif = prop[\"bobot_pct\"] + prop[\"derivatif_notional_pct\"]",
          "bobot_neto = float(prop[\"bobot_pct\"].sum())",
          "eksposur_bruto = float(bobot_efektif.sum() + prop[\"derivatif_notional_pct\"].sum())",
          "",
          "Sigma = cov.loc[aset, aset].values",
          "w_rep = (prop[\"bobot_pct\"] / 100).values",
          "w_eff = (bobot_efektif / 100).values",
          "vol_dilaporkan = float(np.sqrt(w_rep @ Sigma @ w_rep) * 100)",
          "vol_efektif = float(np.sqrt(w_eff @ Sigma @ w_eff) * 100)",
          "",
          "mctr = w_eff * (Sigma @ w_eff) / (vol_efektif / 100)",
          "rc_pct = mctr / (vol_efektif / 100) * 100",
          "rc = dict(zip(aset, rc_pct))",
          "mctr_saham_as = float(mctr[aset.index(\"saham_as\")])",
          "rc_saham_as = float(rc[\"saham_as\"])",
          "",
          "budget = prop[\"budget_risiko_pct\"].to_dict()",
          "deviasi = {a: float(rc[a] - budget[a]) for a in aset}",
          "pelanggaran = [a for a in aset if deviasi[a] > 1.0]",
          "n_pelanggaran = len(pelanggaran)",
          "pelanggar_utama = pelanggaran[0] if pelanggaran else \"\"",
          "rc_ekuitas = float(sum(rc[a] for a in aset if prop.loc[a, \"kelompok\"] == \"ekuitas\"))",
          "",
          "# Rezim stres (pasangan korelasi dari METODE.md)",
          "STRES = {(\"saham_as\",\"saham_eropa\"):0.92, (\"saham_as\",\"reit\"):0.90, (\"saham_eropa\",\"reit\"):0.90,",
          "         (\"kredit_ig\",\"kredit_hy\"):0.92,",
          "         (\"saham_as\",\"kredit_hy\"):0.82, (\"saham_as\",\"kredit_ig\"):0.70,",
          "         (\"saham_eropa\",\"kredit_hy\"):0.80, (\"saham_eropa\",\"kredit_ig\"):0.68,",
          "         (\"reit\",\"kredit_hy\"):0.82, (\"reit\",\"kredit_ig\"):0.70,",
          "         (\"obligasi\",\"saham_as\"):0.30, (\"obligasi\",\"saham_eropa\"):0.30, (\"obligasi\",\"reit\"):0.30,",
          "         (\"obligasi\",\"kredit_hy\"):0.45, (\"obligasi\",\"kredit_ig\"):0.50}",
          "vol_aset = np.sqrt(np.diag(Sigma))",
          "CS = np.eye(6)",
          "for (a, b), v in STRES.items():",
          "    i, j = aset.index(a), aset.index(b)",
          "    CS[i, j] = v; CS[j, i] = v",
          "Sigma_stres = np.outer(vol_aset, vol_aset) * CS",
          "vol_stres = float(np.sqrt(w_eff @ Sigma_stres @ w_eff) * 100)",
          "",
          "print(\"neto:\", bobot_neto, \"| bruto:\", eksposur_bruto)",
          "print(\"vol dilaporkan:\", round(vol_dilaporkan, 2), \"% | vol efektif:\", round(vol_efektif, 2), \"% | vol stres:\", round(vol_stres, 2), \"%\")",
          "print(\"MCTR saham_as:\", round(mctr_saham_as, 6), \"| %RC:\", round(rc_saham_as, 2))",
          "print(\"pelanggaran:\", n_pelanggaran, pelanggar_utama, \"| RC ekuitas:\", round(rc_ekuitas, 2), \"%\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`bobot_efektif` terdefinisi", name: "bobot_efektif", msg: "Bobot efektif = bobot_pct + derivatif_notional_pct (Series per aset)." },
          { kind: "equal", task: "t1", label: "`bobot_neto` = 100,0", name: "bobot_neto", value: 100.0, msg: "Jumlahkan kolom bobot_pct — proposal CIO neto 100%." },
          { kind: "equal", task: "t1", label: "`eksposur_bruto` = 170,0", name: "eksposur_bruto", value: 170.0, msg: "Aset efektif 135% + kas short 35% = 170%. Inilah leverage yang disembunyikan." },
          { kind: "equal", task: "t2", label: "`vol_dilaporkan` ≈ 8,96", name: "vol_dilaporkan", value: 8.9616, tol: 0.01, msg: "Vol dari bobot DILAPORKAN (tanpa derivatif): sqrt(w'Σw) dengan w fraksi." },
          { kind: "equal", task: "t2", label: "`vol_efektif` ≈ 13,91", name: "vol_efektif", value: 13.9127, tol: 0.01, msg: "Vol dari bobot EFEKTIF — 55% lebih tinggi dari yang dilaporkan." },
          { kind: "equal", task: "t2", label: "`mctr_saham_as` ≈ 0,0615", name: "mctr_saham_as", value: 0.061546, tol: 0.0005, msg: "MCTR = w_i × (Σw)_i / σ_p, dengan σ_p dalam desimal." },
          { kind: "equal", task: "t2", label: "`rc_saham_as` ≈ 44,24", name: "rc_saham_as", value: 44.2377, tol: 0.05, msg: "%RC = MCTR / σ_p × 100. Saham AS memiliki 44% risiko dari bobot 12%." },
          { kind: "equal", task: "t3", label: "`n_pelanggaran` = 1", name: "n_pelanggaran", value: 1, msg: "Hanya satu aset yang deviasinya > 1pp di atas budget." },
          { kind: "equal", task: "t3", label: "`pelanggar_utama` = saham_as", name: "pelanggar_utama", value: "saham_as", msg: "Deviasi +24,24pp di atas budget 20% — pelanggaran diam-diam." },
          { kind: "equal", task: "t3", label: "`rc_ekuitas` ≈ 77,32", name: "rc_ekuitas", value: 77.3182, tol: 0.05, msg: "Jumlahkan %RC aset berkelompok 'ekuitas' — jauh di atas klaim 40%." },
          { kind: "equal", task: "t3", label: "`vol_stres` ≈ 15,84", name: "vol_stres", value: 15.8443, tol: 0.01, msg: "Bangun kovarians stres dari METODE.md, hitung ulang vol dengan w_eff." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Peringkat kontributor risiko",
      title: "Satu tabel untuk mengadili enam aset",
      prose: [
        "CIO suka tabel ringkas — jadi buatkan satu, tapi yang jujur. Tabel `kontribusi_risiko(aset TEXT, rc_pct REAL, budget_pct REAL, deviasi_pp REAL)` sudah diisi dari perhitungan Lab 1-mu. Tampilkan peringkat kontributor risiko: aset, % kontribusi, budget, deviasi, dan kolom status yang menandai LANGGAR/OK — urut dari pemilik risiko terbesar.",
        "Tabel yang baik tidak menyembunyikan apa-apa: satu baris LANGGAR di peringkat pertama akan terlihat oleh siapa pun yang membacanya — termasuk komite.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query peringkat: aset, rc_pct, budget_pct, deviasi_pp, status LANGGAR/OK, urut %RC terbesar" },
      ],
      expected: "6 baris — peringkat 1 saham_as (44,24%, LANGGAR +24,24pp), lalu reit, kredit_hy, saham_eropa, kredit_ig, obligasi (OK semua)",
      sqlLab: {
        task: "Peringkat kontributor risiko: tampilkan aset, rc_pct, budget_pct, deviasi_pp, dan kolom status ('LANGGAR' bila deviasi_pp > 1, 'OK' bila tidak — ambang materialitas 1pp seperti Lab 1). Urut dari %RC terbesar.",
        schema: "CREATE TABLE kontribusi_risiko (aset TEXT, rc_pct REAL, budget_pct REAL, deviasi_pp REAL);",
        seedData: [
          "INSERT INTO kontribusi_risiko VALUES",
          "('saham_as',44.24,20.0,24.24),",
          "('reit',19.03,21.0,-1.97),",
          "('kredit_hy',15.60,15.0,0.60),",
          "('saham_eropa',14.05,15.0,-0.95),",
          "('kredit_ig',4.78,14.0,-9.22),",
          "('obligasi',2.30,15.0,-12.70);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT aset, rc_pct, budget_pct, deviasi_pp\nFROM kontribusi_risiko\n",
        solution: [
          "SELECT aset, rc_pct, budget_pct, deviasi_pp,",
          "  CASE WHEN deviasi_pp > 1.0 THEN 'LANGGAR' ELSE 'OK' END AS status",
          "FROM kontribusi_risiko",
          "ORDER BY rc_pct DESC;",
        ].join("\n"),
        expectedColumns: ["aset", "rc_pct", "budget_pct", "deviasi_pp", "status"],
        expectedRows: [
          ["saham_as", 44.24, 20.0, 24.24, "LANGGAR"],
          ["reit", 19.03, 21.0, -1.97, "OK"],
          ["kredit_hy", 15.60, 15.0, 0.60, "OK"],
          ["saham_eropa", 14.05, 15.0, -0.95, "OK"],
          ["kredit_ig", 4.78, 14.0, -9.22, "OK"],
          ["obligasi", 2.30, 15.0, -12.70, "OK"],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiGabungAnggaranRisiko;

// ── lanjutan misiGabungAnggaranRisiko: langkah 5–14 ───────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_RISKBUD: V2Step[] = [
  {
    id: "rezim-stres",
    eyebrow: "Langkah 5 · Korelasi yang naik saat badai",
    title: "Diversifikasi yang menguap tepat saat dibutuhkan",
    prose: [
      "Satu jebakan belum kamu sentuh: korelasi. Proposal CIO memakai korelasi historis “normal” — seolah korelasi adalah konstanta alam. Padahal di setiap krisis — 2008, Maret 2020 — korelasi ekuitas melompat ke 0,90+: semua yang kamu kira “berbeda” ternyata jatuh bersamaan. Fenomena ini bernama correlation breakdown, dan ia selalu datang tepat saat diversifikasi paling dibutuhkan.",
      "Angkamu dari Lab 1: volatilitas efektif 13,91% naik menjadi 15,84% di rezim stres — kenaikan hampir 2pp dari sebuah asumsi yang bahkan tidak ditulis di proposal. Lonjakan terbesar ada di pasangan kredit_ig–kredit_hy (0,70 → 0,92) dan blok ekuitas (→ 0,90–0,92). Anggaran risiko yang dihitung tanpa skenario stres adalah anggaran untuk cuaca cerah.",
    ],
    tasks: [
      { id: "t1", text: "Catat 3 pasangan korelasi dengan lonjakan terbesar (normal → stres)" },
      { id: "t2", text: "Bandingkan vol_efektif vs vol_stres — tulis satu kalimat untuk memo: apa artinya kenaikan ini?" },
    ],
    note: {
      title: "Miskonsepsi #3: korelasi masa tenang = korelasi masa krisis",
      type: "risk",
      body: "“Korelasi historis 0,70, jadi diversifikasi aman.” SALAH — korelasi bukan sifat aset, melainkan sifat REZIM. Di masa tenang korelasi rendah karena tiap aset digerakkan kabarnya sendiri; di krisis semua digerakkan satu kabar yang sama: panik. Risk budget yang memakai korelasi tenang untuk portofolio yang harus selamat di krisis sedang menganggarkan payung untuk musim kemarau.",
    },
    reference:
      "Definisi rezim stres: METODE.md. Hasil lab: vol 13,91% → 15,84%. Klaim CIO: 'korelasi stabil di semua rezim' (diuji di Langkah 11).",
  },
  {
    id: "jejak-leverage",
    eyebrow: "Langkah 6 · Jejak leverage",
    title: "Kebenaran ada di lampiran, kebohongan ada di ringkasan",
    prose: [
      "Kembali ke kolom `derivatif_notional_pct`: +25% futures Saham AS, +10% TRS Kredit HY — didanai kas −35% yang bahkan tidak punya baris di tabel aset. Di ringkasan satu halaman CIO tertulis “tanpa leverage” dan “tidak ada posisi derivatif”. Kolomnya ada di file mentah; kalimatnya hilang di ringkasan.",
      "Ini pola klasik yang wajib kamu kenali: kebenaran disimpan di lampiran (yang dibaca validator), kebohongan dipajang di ringkasan (yang dibaca komite). Kadang ini ketidaksengajaan; sering kali ini desain. Tugasmu bukan menuduh motif — tugasmu memastikan angka yang ditandatangani adalah angka yang benar.",
    ],
    tasks: [
      { id: "t1", text: "Cocokkan klaim 'tanpa leverage'/'tidak ada posisi derivatif' dengan isi kolom derivatif_notional_pct" },
      { id: "t2", text: "Hitung kas implisit pendanaan (−35%) dan tulis satu baris temuan untuk memo" },
    ],
    note: {
      title: "Leverage sintetis tidak muncul di tabel bobot",
      type: "risk",
      body: "Futures dan total return swap (TRS) memberi eksposur penuh dengan modal awal kecil — margin, bukan pembelian. Karena “bobot” dihitung dari modal, leverage 1,7× bisa bersembunyi di balik tabel bobot yang jumlahnya rapi 100%. Satu-satunya cara menangkapnya: rekonsiliasi bruto vs neto, setiap kali, tanpa kecuali.",
    },
    reference:
      "Bukti: proposal_alokasi.csv kolom derivatif_notional_pct vs ringkasan CIO baris 7 & 14 (diuji di Langkah 11).",
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Proposal ini mau kamu apakan?",
    prose: [
      "Angkanya tidak berbohong: volatilitas yang dilaporkan 8,96% ternyata 13,91% (15,84% di rezim stres), Saham AS memiliki 44,24% risiko dari budget 20%, cluster ekuitas menelan 77,32% risiko di balik label “terdiversifikasi”, dan leverage 1,7× disembunyikan dari ringkasan. Tapi “temuan” dan “keputusan” adalah dua hal berbeda — dan komite menunggumu memilih. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [
      { id: "t1", text: "Pilih satu opsi dan tulis alasanmu dalam 2 kalimat — seolah memo sudah dikirim" },
    ],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke komite atas proposal alokasi CIO ini? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-setujui",
          label: "Setujui proposal apa adanya",
          rationale:
            "Angka-angkanya masih dalam batas wajar industri; derivatif adalah alat lindung nilai yang umum dan komite sudah tidak sabar. Menolak berarti menunda alokasi berbulan-bulan.",
          nextStepId: "temuan-setujui",
          consequenceNote:
            "Komite menyetujui. Empat bulan kemudian episode stres datang: korelasi melonjak, portofolio turun jauh melampaui “budget” yang ditandatangani. CIO menyalahkan “korelasi yang tidak terduga” — tapi tanda tangan verifikasimu ada di memo persetujuan. Kali ini tidak ada yang bisa disalahkan selain validator yang menandatangani tanpa memverifikasi.",
        },
        {
          id: "opt-sesuaikan",
          label: "Setujui bersyarat — budget ditulis ulang, leverage diungkap",
          rationale:
            "Struktur alokasinya masuk akal, tapi anggarannya bohong. Syarat: budget Saham AS dinaikkan sesuai realita (atau futures dipangkas), leverage 1,7× diungkap eksplisit, dan ada skenario stres di lampiran memo.",
          nextStepId: "temuan-sesuaikan",
          consequenceNote:
            "CIO keberatan — tapi komite justru terkesan dengan ketelitianmu. Futures Saham AS dipangkas setengah, budget ditulis ulang sesuai kontribusi aktual, dan memo persetujuan mencantumkan skenario stres 15,84%. Saat koreksi pasar datang dua kuartal kemudian, portofolio bergerak dalam batas yang sudah dianggarkan. Tidak ada yang panik, karena tidak ada yang terkejut.",
        },
        {
          id: "opt-tolak",
          label: "Tolak — kembalikan ke CIO dengan temuan",
          rationale:
            "Empat suntikan di ringkasan (konsentrasi disamarkan, leverage dihilangkan, budget dilanggar diam-diam, korelasi stres diabaikan) berarti proposal ini tidak bisa diperbaiki dengan tambalan — ia harus ditulis ulang dari angka yang benar.",
          nextStepId: "temuan-tolak",
          consequenceNote:
            "CIO marah besar — reputasinya dipertaruhkan. Tapi dua bulan kemudian proposal yang ditulis ulang datang dengan angka jujur: budget sesuai kontribusi aktual dan leverage diungkap. Komite menyetujuinya dalam satu rapat. Memo penolakanmu menjadi template verifikasi untuk semua proposal berikutnya — dan tidak ada seorang pun yang berani menyembunyikan kolom lagi.",
        },
      ],
    },
  },
  {
    id: "temuan-setujui",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: proposal disetujui apa adanya",
    prose: [
      "Komite menyetujui — lagipula angkanya “terlihat wajar”. Empat bulan kemudian episode stres datang: korelasi ekuitas melonjak ke 0,90+, dan portofolio turun jauh melampaui apa yang “dianggarkan”. CIO menyalahkan “korelasi yang tidak terduga”. Tapi tanda tangan verifikasimu ada di memo persetujuan — dan angka stres 15,84% sebenarnya sudah bisa kamu hitung sebelum menandatangani.",
      "Pelajaran yang mahal: menandatangani verifikasi tanpa memverifikasi bukan netral — itu garansi palsu. Komite tidak membaca file mentah; mereka membacamu.",
    ],
    tasks: [
      { id: "t1", text: "Tulis satu kalimat: apa yang seharusnya menghentikanmu sebelum menandatangani?" },
    ],
    note: {
      title: "Persetujuan tanpa verifikasi = garansi palsu",
      body: "Di deliverable-mu, setiap kalimat “disetujui” wajib ditemani bukti angka yang diverifikasi independen. Tanda tangan validator adalah produk yang dijual ke komite — jangan jual yang palsu.",
    },
  },
  {
    id: "temuan-sesuaikan",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: setuju bersyarat",
    prose: [
      "CIO keberatan — tapi komite justru terkesan dengan ketelitianmu. Futures Saham AS dipangkas setengah, budget ditulis ulang mengikuti kontribusi aktual, leverage 1,7× diungkap eksplisit di memo, dan skenario stres 15,84% dilampirkan. Saat koreksi pasar datang dua kuartal kemudian, portofolio bergerak di dalam batas yang sudah dianggarkan.",
      "Tidak ada yang panik — karena tidak ada yang terkejut. Itulah seluruh gunanya anggaran risiko: bukan mencegah kerugian, melainkan memastikan kerugian yang datang adalah kerugian yang sudah dianggarkan dan disetujui.",
    ],
    tasks: [
      { id: "t1", text: "Catat 3 syarat yang kamu ajukan — ini akan menjadi kerangka memo di Langkah 12" },
    ],
    note: {
      title: "Syarat yang baik itu spesifik dan terukur",
      body: "“Leverage diungkap” tanpa angka = basa-basi. “Eksposur bruto maksimal 120% dan tercantum di setiap laporan bulanan” = syarat. Di memo-mu, setiap syarat wajib punya angka dan cara memverifikasinya.",
    },
  },
  {
    id: "temuan-tolak",
    goto: "audit",
    eyebrow: "Langkah 10 · Konsekuensi",
    title: "Diputuskan: proposal ditolak",
    prose: [
      "CIO marah besar — reputasinya dipertaruhkan di depan komite. Dua minggu yang tidak nyaman. Tapi dua bulan kemudian proposal yang ditulis ulang datang dengan angka jujur: budget mengikuti kontribusi aktual, leverage diungkap, skenario stres dilampirkan. Komite menyetujuinya dalam satu rapat.",
      "Memo penolakanmu menjadi template verifikasi untuk semua proposal berikutnya — dan tidak ada seorang pun yang berani menyembunyikan kolom lagi. Penolakan yang beralasan angka bukanlah drama; itu cara sebuah institusi belajar jujur.",
    ],
    tasks: [
      { id: "t1", text: "Tulis 3 temuan terkuatmu yang membuat penolakan ini tidak terbantahkan" },
    ],
    note: {
      title: "Penolakan butuh bukti, bukan keberanian saja",
      body: "Keputusan sekeras ini hanya bertahan bila buktinya sekeras “44,24% vs budget 20%” milikmu. Tanpa angka itu, penolakan = drama politik. Dengan angka itu, penolakan = profesionalisme. Itulah kenapa Lab 1 ada sebelum keputusan ini.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 11 · Misi audit",
    title: "Dossier 16 baris: ringkasan CIO yang “rapi” itu bohong",
    prose: [
      "Sebelum menulis memo, satu misi audit. Di bawah ini 16 baris “Ringkasan Proposal Alokasi CIO — 1 halaman”, dokumen yang mengklaim alokasi TERDIVERSIFIKASI dan SEMUA budget terpenuhi. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
      "Senjatamu: bobot efektif 37% Saham AS, %RC 44,24% vs budget 20%, RC ekuitas 77,32%, bruto 170%, dan vol stres 15,84%.",
    ],
    tasks: [
      { id: "t1", text: "Temukan 4 suntikan di dossier — catat nomor baris dan bukti angkanya" },
    ],
    auditDossier: {
      version: "riskbud-cap-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Ringkasan Proposal Alokasi CIO (1 halaman) yang menyatakan alokasi TERDIVERSIFIKASI dan SEMUA budget risiko terpenuhi.",
      columns: ["Baris", "Klaim", "Nilai"],
      rows: [
        { rowId: 1, cells: { "Baris": "1", "Klaim": "Alokasi Saham AS", "Nilai": "12% (budget risiko 20%)" }, claims: [{ label: "Status", value: "Sesuai budget" }] },
        { rowId: 2, cells: { "Baris": "2", "Klaim": "Alokasi Saham Eropa", "Nilai": "14% (budget 15%)" }, claims: [{ label: "Status", value: "Sesuai budget" }] },
        { rowId: 3, cells: { "Baris": "3", "Klaim": "Alokasi Obligasi Pemerintah", "Nilai": "28% (budget 15%)" }, claims: [{ label: "Status", value: "Sesuai budget" }] },
        { rowId: 4, cells: { "Baris": "4", "Klaim": "Alokasi Kredit IG", "Nilai": "16% (budget 14%)" }, claims: [{ label: "Status", value: "Sesuai budget" }] },
        { rowId: 5, cells: { "Baris": "5", "Klaim": "Alokasi Kredit HY", "Nilai": "14% (budget 15%)" }, claims: [{ label: "Status", value: "Sesuai budget" }] },
        { rowId: 6, cells: { "Baris": "6", "Klaim": "Alokasi REIT Global", "Nilai": "16% (budget 21%)" }, claims: [{ label: "Status", value: "Sesuai budget" }] },
        // ── I2: leverage dihilangkan ──
        { rowId: 7, cells: { "Baris": "7", "Klaim": "Total eksposur", "Nilai": "100% (fully invested)" }, claims: [{ label: "Leverage", value: "Tanpa leverage" }] },
        // ── I1: konsentrasi disamarkan ──
        { rowId: 8, cells: { "Baris": "8", "Klaim": "Diversifikasi", "Nilai": "6 kelas aset" }, claims: [{ label: "Aturan", value: "Tidak ada cluster > 40% risiko" }] },
        // ── I3: budget dilanggar diam-diam ──
        { rowId: 9, cells: { "Baris": "9", "Klaim": "Kontribusi risiko Saham AS", "Nilai": "20,7%" }, claims: [{ label: "Status", value: "Sesuai budget 20%" }] },
        { rowId: 10, cells: { "Baris": "10", "Klaim": "Volatilitas portofolio", "Nilai": "8,96%" }, claims: [{ label: "Basis", value: "Kovarians historis" }] },
        // ── I4: korelasi stres diabaikan ──
        { rowId: 11, cells: { "Baris": "11", "Klaim": "Asumsi korelasi", "Nilai": "Stabil di semua rezim" }, claims: [{ label: "Metode", value: "Korelasi historis penuh" }] },
        { rowId: 12, cells: { "Baris": "12", "Klaim": "Sumber data", "Nilai": "expected_returns.csv, covariance.csv" }, claims: [{ label: "Catatan", value: "Sintetis, seed 42 — terverifikasi" }] },
        { rowId: 13, cells: { "Baris": "13", "Klaim": "Tanggal proposal", "Nilai": "2026-10-15" }, claims: [{ label: "Versi", value: "Final" }] },
        // ── I2 (lanjutan): derivatif dinyatakan tidak ada ──
        { rowId: 14, cells: { "Baris": "14", "Klaim": "Posisi derivatif", "Nilai": "—" }, claims: [{ label: "Keterangan", value: "Tidak ada posisi derivatif" }] },
        { rowId: 15, cells: { "Baris": "15", "Klaim": "Kesimpulan CIO", "Nilai": "Alokasi terdiversifikasi, semua budget terpenuhi" }, claims: [{ label: "Rekomendasi", value: "Setujui" }] },
        { rowId: 16, cells: { "Baris": "16", "Klaim": "Lampiran", "Nilai": "proposal_alokasi.csv tersedia untuk verifikasi independen" }, claims: [{ label: "Catatan", value: "File mentah dapat diperiksa" }] },
      ],
      injections: [
        { key: "konsentrasi-disamarkan", rowIds: [8], title: "Konsentrasi disamarkan label diversifikasi", clue: "Klaim “tidak ada cluster > 40% risiko” — hitung ulang dari bobot EFEKTIF: cluster ekuitas (Saham AS + Saham Eropa + REIT) memiliki 77,32% total risiko. Enam baris aset tidak sama dengan enam sumber risiko yang independen.", danger: "Label “diversifikasi” bukan angka. Di pekerjaan nyata, konsentrasi tersembunyi seperti ini adalah cara portofolio “terdiversifikasi” runtuh serentak — karena yang terdiversifikasi hanya namanya, bukan faktor risikonya." },
        { key: "leverage-dihilangkan", rowIds: [7, 14], title: "Leverage derivatif dihilangkan", clue: "“Tanpa leverage” dan “tidak ada posisi derivatif” — kolom derivatif_notional_pct di proposal_alokasi.csv menunjukkan +25% futures Saham AS dan +10% TRS Kredit HY, didanai kas −35%. Eksposur bruto 170%, bukan 100%.", danger: "Leverage sintetis via derivatif tidak muncul di tabel bobot — persis pola Archegos 2021 (TRS) yang menghapus puluhan miliar dolar bank-bank pemberi pinjaman. Yang tidak terlihat di laporan masih bisa membunuhmu." },
        { key: "budget-dilanggar", rowIds: [9], title: "Budget dilanggar diam-diam", clue: "20,7% dihitung dari bobot DILAPORKAN (tanpa derivatif) — terlihat patuh pada budget 20%. Dari bobot EFEKTIF angkanya 44,24%: melampaui budget sejauh 24,24pp. Pelanggaran ini tidak “terjadi” — ia disembunyikan oleh pilihan denominator.", danger: "Anggaran yang dihitung dari angka yang salah bukan anggaran — itu dekorasi. Satu budget yang dilanggar diam-diam berarti seluruh kerangka akuntabilitas risiko tidak berfungsi." },
        { key: "korelasi-stres-diabaikan", rowIds: [11], title: "Korelasi rezim stres diabaikan", clue: "“Stabil di semua rezim” — skenario stres (korelasi blok ekuitas → 0,90–0,92, blok kredit → 0,92) menaikkan volatilitas portofolio dari 13,91% menjadi 15,84%. Kenaikan ~2pp ini tidak ada di proposal sama sekali.", danger: "Anggaran risiko tanpa skenario stres = anggaran untuk cuaca cerah. Correlation breakdown adalah mekanisme standar setiap krisis; mengabaikannya berarti menganggarkan payung untuk musim kemarau." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 12 · Deliverable",
    title: "Memo persetujuan anggaran risiko",
    prose: [
      "Semua bukti di tangan. Tulis memo persetujuan anggaran risiko satu halaman untuk komite — artefak portofoliomu. Memo yang baik tidak hanya bilang “setuju/tolak”, tapi menunjukkan ANGKA kebenarannya, apa yang disembunyikan ringkasan CIO, dan syarat apa yang harus dipenuhi sebelum tanda tanganmu layak dibubuhkan.",
    ],
    tasks: [
      { id: "t1", text: "Draf memo mengikuti 5 bagian template — sertakan semua angka kunci Lab 1" },
      { id: "t2", text: "Nilai drafmu sendiri dengan rubrik di bawah sebelum menyerahkan" },
    ],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): bobot efektif vs dilaporkan, volatilitas 8,96% → 13,91% (15,84% di rezim stres), vonis atas proposal.",
        "Bukti kuantitatif: tabel MCTR/%RC vs budget per aset, pelanggaran Saham AS (+24,24pp), konsentrasi cluster ekuitas 77,32%, eksposur bruto 170% (leverage 1,7×).",
        "Temuan audit ringkasan CIO: 4 suntikan (konsentrasi disamarkan, leverage dihilangkan, budget dilanggar diam-diam, korelasi stres diabaikan), baris per baris.",
        "Rekomendasi: rujuk keputusanmu di Langkah 7 + syarat terukur yang harus dipenuhi sebelum persetujuan (angka + cara verifikasi tiap syarat).",
        "Batas & risiko sisa: data 100% sintetis; korelasi stres adalah skenario bukan ramalan; budget risiko bukan jaminan kerugian maksimum — ia menjamin akuntabilitas, bukan keamanan.",
      ],
      rubric: [
        { criterion: "Kebenaran dekomposisi risiko", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "Bobot efektif, vol 8,96/13,91/15,84, MCTR & %RC per aset — semua tepat"] },
        { criterion: "Deteksi suntikan", weight: 25, levels: ["Tidak menyebut suntikan", "Menyebut sebagian tanpa baris bukti", "Keempat suntikan disebut dengan nomor baris dossier"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa syarat terukur", "Ada syarat, cara verifikasi kabur", "Rekomendasi + syarat berangka + cara verifikasi tiap syarat"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim memo menjamin keamanan", "Menyebut sebagian batas", "Batas (sintetis, skenario≠ramalan, budget≠jaminan) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 13 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat suntikan di ringkasan CIO:",
      "1) **Konsentrasi disamarkan** (baris 8): “tidak ada cluster > 40% risiko”. Angka sebenarnya dari bobot efektif: cluster ekuitas 77,32%. Enam nama aset ≠ enam sumber risiko independen — Saham AS, Saham Eropa, dan REIT bergerak searah (korelasi 0,65–0,75) sehingga ketiganya pada dasarnya satu taruhan besar.",
      "2) **Leverage dihilangkan** (baris 7 & 14): “tanpa leverage”, “tidak ada posisi derivatif”. File mentah berkata lain: +25% futures Saham AS, +10% TRS Kredit HY, kas −35% — bruto 170%. Volatilitas “dilaporkan” 8,96% vs “efektif” 13,91%: selisih 55% risiko yang tidak pernah disebut di ringkasan.",
      "3) **Budget dilanggar diam-diam** (baris 9): 20,7% terlihat patuh pada budget 20% — karena dihitung dari bobot yang salah. Dari bobot efektif: 44,24%, deviasi +24,24pp. Pelanggaran ini tidak terjadi secara alami; ia diproduksi oleh pilihan denominator.",
      "4) **Korelasi stres diabaikan** (baris 11): “stabil di semua rezim”. Skenario stres: vol naik ke 15,84%. Setiap krisis dalam sejarah — 2008, Maret 2020 — membuktikan korelasi melonjak tepat saat diversifikasi paling dibutuhkan.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu menghitung dari file mentah, atau memercayai ringkasan. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis. Validator terbaik bukan yang paling keras menolak, melainkan yang angkanya paling tidak bisa dibantah — “44,24% vs budget 20%” milikmu itu tidak bisa dibantah.",
      "Bahaya nyata terakhir: pola ini — leverage sintetis yang tak terlihat di laporan posisi — adalah pola Archegos Capital 2021. Total return swap memberi eksposur miliaran dolar tanpa muncul sebagai “kepemilikan”; ketika posisi berbalik, bank-bank pemberi pinjaman kehilangan lebih dari 10 miliar dolar gabungan. Anggaran risiko yang dihitung dari bobot laporan, bukan bobot efektif, adalah undangan tertulis untuk mengulanginya.",
    ],
    tasks: [
      { id: "t1", text: "Hitung skormu (x/4 suntikan) dan tulis satu pola yang akan selalu kamu cek mulai sekarang" },
    ],
    note: {
      title: "Budget risiko menjamin akuntabilitas, bukan keamanan",
      type: "risk",
      body: "Anggaran risiko tidak mencegah kerugian — ia memastikan setiap kerugian bisa ditelusuri ke pemiliknya dan sudah disetujui sebelumnya. Portofolio boleh rugi; yang tidak boleh adalah rugi yang “tidak terduga” oleh orang yang menandatanganinya.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 14 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Tutup file — tulis ulang 3 angka kunci misi ini dari memori" },
    ],
    summary: [
      "Dekomposisi risiko dari bobot EFEKTIF: vol dilaporkan 8,96% → efektif 13,91% → rezim stres 15,84%; Saham AS memiliki 44,24% risiko (MCTR 0,0615) dari bobot 12%.",
      "Satu budget dilanggar diam-diam: Saham AS +24,24pp di atas budget 20% (terlihat patuh 20,7% bila dihitung dari bobot yang salah); cluster ekuitas menelan 77,32% risiko di balik label “terdiversifikasi”.",
      "Leverage sintetis 1,7× (bruto 170%, kas −35%) disembunyikan dari ringkasan — pola Archegos: yang tak terlihat di laporan posisi tetap bisa membunuh.",
      "Empat pola suntikan ringkasan: konsentrasi disamarkan, leverage dihilangkan, budget dilanggar diam-diam, korelasi stres diabaikan.",
      "Keputusan atas proposal selalu punya harga: setujui (garansi palsu), setuju bersyarat (jalan tengah terukur), tolak (integritas dengan biaya sosial). Setiap syarat wajib berangka + bisa diverifikasi.",
      "Data: 100% sintetis, seed 42, 6 aset, < 5MB — dinyatakan SINTETIS di semua permukaan; korelasi stres adalah skenario, bukan ramalan.",
    ],
  },
];

(misiGabungAnggaranRisiko.steps as V2Step[]).push(...LANJUTAN_RISKBUD);

