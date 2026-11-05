import type { V2Mission } from "../lib/types";

// ── MISI VaR: Model yang Terlalu Tenang ──────────────────────────────────
// M1 — Market Risk Misi A (core). Dataset: FRED SP500 harian 2019-01-01 s.d.
// 2021-06-30 (data publik pemerintah federal AS), dibekukan 2026-10-15.
// File: public/misi/misi-var-backtest/imbal_hasil.csv (606 baris) +
// laporan_var_mesin.csv (VaR99 parametrik mesin bank). Metode: METODE.md.

const BASE = "/misi/misi-var-backtest";

export const misiVar: V2Mission = {
  slug: "misi-var-backtest",
  track: "Market Risk",
  module: "Misi",
  title: "Misi VaR: Model yang Terlalu Tenang",
  estMinutes: 120,
  role: "Analis risiko pasar",
  client:
    "Chief Risk Officer — model VaR 99% harian portofolio ekuitas harus divalidasi independen sebelum komite menyetujui limit tahun depan",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Model yang tidak pernah salah itu mencurigakan",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis risiko pasar di sebuah bank — validator independen model",
        client:
          "Chief Risk Officer (CRO). Model VaR 99% harian untuk portofolio ekuitas dipakai menentukan berapa besar posisi desk boleh ambil. Tahun lalu model ini melaporkan pelanggaran (breach) JAUH lebih jarang dari yang diharapkan secara statistik — dan komite curiga angkanya “terlalu tenang”. Kamu diminta backtest independen: hitung ulang dari data mentah, uji secara statistik, dan tulis memo validasi yang berani bilang “model ini gagal” kalau memang gagal.",
        story: [
          "Rabu, 14:00. CRO memanggilmu ke ruangannya — jarang terjadi, dan tidak pernah untuk kabar baik. Di layarnya: grafik garis VaR 99% harian portofolio ekuitas setahun terakhir, mulus seperti jalan tol. “Model kita hampir tidak pernah breach,” katanya. “Secara statistik, VaR 99% HARUS breach sekitar 1% dari hari perdagangan — dua sampai tiga kali setahun. Kita hampir tidak pernah. Entah kita bank paling beruntung di dunia, atau modelnya buta.”",
          "Kamu tahu yang dia maksud. Model risiko yang tidak pernah salah bukanlah model yang bagus — itu model yang tidak mengukur apa-apa. VaR yang terlalu optimistis berarti desk trading boleh mengambil posisi lebih besar dari yang seharusnya, dan ketika pasar benar-benar jatuh, bank tidak punya bantalan yang dikiranya ada.",
          "Misi ini memakai data nyata: harga harian S&P 500 (2019–2021, termasuk kejatuhan Maret 2020) sebagai proxy portofolio ekuitas, plus file keluaran mesin VaR bank. Tugasmu: backtest independen, uji Kupiec, temukan sabotase di laporan validasi internal, dan putuskan nasib model ini.",
        ],
        objectives: [
          "Menghitung imbal hasil harian dan VaR 99% historis (jendela 250 hari) dari data mentah, lalu menghitung jumlah pelanggaran aktual.",
          "Menguji dengan statistik Kupiec apakah jumlah pelanggaran konsisten dengan klaim VaR 99% (tolak/terima model dengan bukti).",
          "Menemukan minimal 3 sabotase di laporan validasi internal dan menulis memo validasi dengan rekomendasi yang dipertahankan.",
        ],
        prereqSummary:
          "VaR 99% satu hari = ambang kerugian yang secara teori hanya terlampaui pada 1% hari perdagangan (sekitar 2–3 hari per tahun). Backtest = membandingkan prediksi model dengan kenyataan: hitung berapa hari kerugian aktual melebihi VaR, lalu uji statistik (Kupiec) apakah jumlah itu masih wajar atau modelnya sudah rusak. Yang penting di sini bukan rumusnya, melainkan logikanya: model yang mengklaim 99% tapi breach 29 kali sedang berbohong — dan tugasmu membuktikannya dengan angka.",
        datasetNote:
          "Sumber: FRED, Federal Reserve Bank of St. Louis — data publik pemerintah federal AS (S&P 500 harian).\nSlice: 2019-01-01 s.d. 2021-06-30 → 606 hari perdagangan (file imbal_hasil.csv: tanggal, harga_penutupan, imbal_hasil_pct).\nFile laporan_var_mesin.csv = keluaran mesin VaR bank (VaR99 parametrik, jendela 250 hari).\nKejujuran: S&P 500 dipakai sebagai PROXY portofolio ekuitas — bukan portofolio bank yang sebenarnya; mesin VaR disederhanakan untuk misi ini. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua file, dua cerita",
      prose: [
        "Dua file menunggumu. `imbal_hasil.csv` adalah kebenaran mentah: 606 baris harga penutupan harian S&P 500 beserta imbal hasil log hariannya — termasuk Maret 2020, bulan ketika pasar jatuh lebih dari 30% dalam hitungan minggu. Tidak ada yang disembunyikan di file ini.",
        "`laporan_var_mesin.csv` adalah klaim mesin bank: VaR 99% harian hasil model parametrik (2,33 × simpangan baku 250 hari berjalan). Inilah angka yang dipakai desk untuk menentukan limit — dan inilah yang akan kamu adili.",
        "Aturan main: (1) backtest dibangun dari file mentah, bukan dari klaim mesin; (2) satu pelanggaran = satu hari di mana kerugian aktual melebihi VaR hari itu; (3) keputusan “model lolos/gagal” diambil dengan uji statistik, bukan firasat.",
      ],
      tasks: [
        { id: "t1", text: "Buka `imbal_hasil.csv`: catat rentang tanggal dan jumlah baris" },
        { id: "t2", text: "Buka `laporan_var_mesin.csv`: pahami apa arti satu baris `var99_pct`" },
      ],
      note: {
        title: "Miskonsepsi #1: VaR = kerugian maksimum",
        type: "pitfall",
        body: "“VaR 99% sebesar 2,25% artinya kerugian tidak akan melebihi 2,25%.” SALAH — dan kesalahpahaman ini berbahaya. VaR 99% artinya: pada 1% hari TERBURUK, kerugian MELEBIHI 2,25% — bisa 3%, bisa 12%. VaR tidak bilang apa-apa tentang seberapa dalam jurangnya. Itulah kenapa backtest menghitung pelanggaran: untuk memastikan frekuensi “hari-hari jurang” itu masih 1%, bukan 5%.",
      },
      reference:
        "imbal_hasil.csv (606 baris, mentah) vs laporan_var_mesin.csv (klaim model). Backtest dari yang mentah; vonis untuk yang diklaim.",
    },
    {
      id: "lab-var",
      eyebrow: "Langkah 3 · Lab 1 — Backtest independen",
      title: "Berapa kali modelmu berbohong?",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `imbal_hasil.csv`: hitung VaR 99% historis memakai jendela 250 hari perdagangan terakhir (ambil persentil ke-1 dari distribusi imbal hasil — nilai positifnya sebagai “% kerugian”), lalu hitung berapa hari kerugian aktual melebihi ambang itu. Terakhir: uji Kupiec — statistik yang menjawab “apakah 29 pelanggaran dari 606 hari masih wajar untuk model 99%?”.",
        "Rumus Kupiec (likelihood ratio) sudah disiapkan di petunjuk — kamu tinggal menerjemahkannya ke kode. Nilai kritis khi-kuadrat 1 derajat bebas pada 1% adalah 6,63: LR di atas itu berarti model DITOLAK secara statistik.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`, `tgl_awal`, `tgl_akhir`" },
        { id: "t2", text: "Temukan hari terburuk: `hari_terburuk_tgl` dan `hari_terburuk_ret`" },
        { id: "t3", text: "Hitung `var99_trailing` (2,3263 × std 250 hari terakhir), `n_pelanggaran`, dan `kupiec_lr`" },
      ],
      expected:
        "n_baris=606, hari terburuk 2020-03-16 (-12,77%), var99_trailing=2,25%, n_pelanggaran=29, kupiec_lr=45,81 (>> 6,63 → model DITOLAK)",
      formula: String.raw`LR = -2\ln\left(\frac{(1-p)^{n-x}\,p^{x}}{(1-\hat{p})^{n-x}\,\hat{p}^{x}}\right)`,
      formulaNote:
        "p = 0,01 (peluang pelanggaran menurut klaim model 99%), n = jumlah hari, x = pelanggaran teramati, p̂ = x/n (frekuensi aktual). LR besar = data jauh lebih cocok dengan frekuensi aktual daripada dengan klaim model.",
      note: {
        title: "Miskonsepsi #2: sedikit pelanggaran = model bagus",
        type: "pitfall",
        body: "Insting berkata “pelanggaran sedikit = aman”. Statistik berkata sebaliknya: VaR 99% yang TIDAK PERNAH breach sama mencurigakannya dengan yang sering breach — keduanya berarti model tidak mengukur risiko yang sebenarnya. Model yang sehat breach 2–3 kali setahun. Model yang breach 29 kali sedang berbohong tentang seberapa aman kamu.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))` — kolom tanggal bertipe string di file ini.",
        "Hari terburuk: `df[\"imbal_hasil_pct\"].idxmin()` lalu ambil tanggalnya.",
        "VaR trailing: `2.3263 * df[\"imbal_hasil_pct\"].rolling(250).std().iloc[-1]` — ambil nilai TERAKHIR (jendela 250 hari terakhir).",
        "Kupiec: `import math`, lalu terjemahkan rumus di atas — hati-hati, p̂ = x/n bisa nol? Di sini tidak (x=29).",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-var-backtest/imbal_hasil.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "tgl_awal = ...",
          "tgl_akhir = ...",
          "",
          "i = df[\"imbal_hasil_pct\"].idxmin()",
          "hari_terburuk_tgl = ...",
          "hari_terburuk_ret = ...",
          "",
          "var99_trailing = ...   # 2.3263 * std 250 hari TERAKHIR",
          "n_pelanggaran = ...    # hari dengan imbal_hasil_pct < -var99_trailing",
          "",
          "import math",
          "n, x, p = n_baris, n_pelanggaran, 0.01",
          "phat = ...",
          "kupiec_lr = ...",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"terburuk:\", hari_terburuk_tgl, hari_terburuk_ret)",
          "print(\"VaR99:\", round(var99_trailing, 4), \"| pelanggaran:\", n_pelanggaran)",
          "print(\"Kupiec LR:\", round(kupiec_lr, 4))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-var-backtest/imbal_hasil.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "tgl_awal = df[\"tanggal\"].min()",
          "tgl_akhir = df[\"tanggal\"].max()",
          "",
          "i = df[\"imbal_hasil_pct\"].idxmin()",
          "hari_terburuk_tgl = df.loc[i, \"tanggal\"]",
          "hari_terburuk_ret = float(df.loc[i, \"imbal_hasil_pct\"])",
          "",
          "var99_trailing = float(2.3263 * df[\"imbal_hasil_pct\"].rolling(250).std().iloc[-1])",
          "n_pelanggaran = int((df[\"imbal_hasil_pct\"] < -var99_trailing).sum())",
          "",
          "import math",
          "n, x, p = n_baris, n_pelanggaran, 0.01",
          "phat = x / n",
          "kupiec_lr = float(-2 * (math.log((1-p)**(n-x) * p**x) - math.log((1-phat)**(n-x) * phat**x)))",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"terburuk:\", hari_terburuk_tgl, hari_terburuk_ret)",
          "print(\"VaR99:\", round(var99_trailing, 4), \"| pelanggaran:\", n_pelanggaran)",
          "print(\"Kupiec LR:\", round(kupiec_lr, 4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 606", name: "n_baris", value: 606, msg: "File punya 606 hari perdagangan (2019-01-03 s.d. 2021-06-30)." },
          { kind: "equal", task: "t2", label: "hari terburuk = 2020-03-16", name: "hari_terburuk_tgl", value: "2020-03-16", msg: "16 Maret 2020 — hari kejatuhan COVID (−12,77%)." },
          { kind: "equal", task: "t2", label: "ret terburuk ≈ −12,77", name: "hari_terburuk_ret", value: -12.7652, tol: 0.01, msg: "Ambil nilai imbal_hasil_pct pada baris idxmin." },
          { kind: "equal", task: "t3", label: "`var99_trailing` ≈ 2,25", name: "var99_trailing", value: 2.2479, tol: 0.01, msg: "2,3263 × std dev 250 hari TERAKHIR (bukan seluruh sampel)." },
          { kind: "equal", task: "t3", label: "`n_pelanggaran` = 29", name: "n_pelanggaran", value: 29, msg: "29 hari kerugian melebihi VaR — hampir 5× dari ekspektasi 1% (≈6 hari)." },
          { kind: "equal", task: "t3", label: "`kupiec_lr` ≈ 45,81", name: "kupiec_lr", value: 45.8125, tol: 0.1, msg: "Jauh di atas 6,63 → model DITOLAK pada tingkat 1%. Periksa rumus log-likelihood." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Pelanggaran berat",
      title: "Tidak semua pelanggaran diciptakan setara",
      prose: [
        "29 pelanggaran itu banyak — tapi regulator dan CRO peduli pada yang PALING parah: hari-hari di mana kerugian lebih dari DUA KALI LIPAT VaR. Itulah hari-hari yang bisa menghabiskan bantalan modal. Di tabel kecil ini (12 pelanggaran terburuk), saring yang “berat” dengan SQL.",
        "Tabel `pelanggaran(tanggal TEXT, imbal_pct REAL, var99_pct REAL)`. Tampilkan tanggal dan imbal_pct untuk baris dengan `ABS(imbal_pct) > 2 * var99_pct`, urut dari yang terburuk.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query pelanggaran berat (|imbal| > 2×VaR), urut dari terburuk" },
      ],
      expected: "8 baris — terburuk 2020-03-16 (−12,77), lalu 2020-03-12 (−9,99), 2020-03-09 (−7,90), …",
      sqlLab: {
        task: "Saring pelanggaran BERAT: |imbal_pct| lebih dari 2× var99_pct. Tampilkan tanggal + imbal_pct, urut dari yang terburuk.",
        schema: "CREATE TABLE pelanggaran (tanggal TEXT, imbal_pct REAL, var99_pct REAL);",
        seedData: [
          "INSERT INTO pelanggaran VALUES",
          "('2020-03-16',-12.7652,2.2479),",
          "('2020-03-12',-9.9945,2.2479),",
          "('2020-03-09',-7.901,2.2479),",
          "('2020-06-11',-6.0753,2.2479),",
          "('2020-03-18',-5.3222,2.2479),",
          "('2020-03-11',-5.0103,2.2479),",
          "('2020-02-27',-4.5168,2.2479),",
          "('2020-04-01',-4.5146,2.2479),",
          "('2020-03-20',-4.4328,2.2479),",
          "('2020-10-28',-3.5926,2.2479),",
          "('2020-09-03',-3.5758,2.2479),",
          "('2020-03-05',-3.4511,2.2479);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT tanggal, imbal_pct\nFROM pelanggaran\n",
        solution: [
          "SELECT tanggal, imbal_pct",
          "FROM pelanggaran",
          "WHERE ABS(imbal_pct) > 2 * var99_pct",
          "ORDER BY imbal_pct;",
        ].join("\n"),
        expectedColumns: ["tanggal", "imbal_pct"],
        expectedRows: [
          ["2020-03-16", -12.7652],
          ["2020-03-12", -9.9945],
          ["2020-03-09", -7.901],
          ["2020-06-11", -6.0753],
          ["2020-03-18", -5.3222],
          ["2020-03-11", -5.0103],
          ["2020-02-27", -4.5168],
          ["2020-04-01", -4.5146],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiVar;

// ── lanjutan misiVar: langkah 5–10 ───────────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_VAR: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Model ini mau kamu apakan?",
    prose: [
      "Angkanya tidak berbohong: 29 pelanggaran vs ekspektasi ~6, Kupiec LR 45,81 vs ambang 6,63. Model DITOLAK secara statistik. Tapi “ditolak secara statistik” dan “apa yang harus dilakukan bank” adalah dua keputusan berbeda — dan CRO menunggumu memilih. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke CRO atas model VaR ini? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-pertahankan",
          label: "Model lolos bersyarat — pertahankan, pantau triwulanan",
          rationale:
            "Kupiec memang menolak, tapi Maret 2020 adalah kejadian ekstrem sekali-seperempat-abad. Mengganti model di tengah jalan justru merusak konsistensi historis limit.",
          nextStepId: "temuan-aman",
          consequenceNote:
            "Komite menerima. Enam bulan kemudian pelanggaran ke-30 hingga ke-35 terjadi di koreksi pasar biasa (bukan krisis) — dan kali ini tidak ada alasan “kejadian ekstrem”. Kamu aman secara politik hari ini; risikonya mengendap.",
        },
        {
          id: "opt-kalibrasi",
          label: "Model amber — kalibrasi ulang + stress add-on sementara",
          rationale:
            "Model inti dipertahankan (konsistensi), tapi VaR dinaikkan via add-on stress sampai kalibrasi ulang selesai. Limit desk dikencangkan proporsional.",
          nextStepId: "temuan-kalibrasi",
          consequenceNote:
            "CRO setuju. Add-on menangkap 80% pelanggaran berikutnya; desk protes limit menyempit tapi audit regulator mencatat respons yang proporsional. Kalibrasi ulang selesai dalam 2 bulan.",
        },
        {
          id: "opt-eskalasi",
          label: "Model gagal — eskalasi, bekukan limit baru 2 minggu",
          rationale:
            "29 vs 6 bukan “sedikit meleset” — ini kegagalan model. Integritas angka di atas kenyamanan desk. Bekukan limit baru sampai model diganti.",
          nextStepId: "temuan-eskalasi",
          consequenceNote:
            "CRO membekukan limit baru. Desk trading ribut — dua minggu tanpa limit baru berarti peluang terlewat. Tapi laporan audit regulator kuartal berikutnya memuji: “bank menunjukkan kemauan menindak model yang gagal”.",
        },
      ],
    },
  },
  {
    id: "temuan-aman",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: model dipertahankan",
    prose: [
      "Komite menerima rekomendasimu — dengan catatan “pantau triwulanan”. Tiga bulan pertama tenang. Lalu koreksi pasar biasa datang (bukan krisis, bukan pandemi): −3% di sana, −4% di sini. Pelanggaran ke-30, 31, 32… 35 tercatat dalam enam minggu. Tidak ada lagi alasan “kejadian ekstrem sekali-seperempat-abad”.",
      "Pelajaran yang mahal: menunda keputusan atas model yang gagal tidak menghilangkan risikonya — hanya memindahkannya ke masa depan, dengan bunga. “Pantau triwulanan” tanpa ambang tindakan adalah cara sopan untuk tidak melakukan apa-apa.",
    ],
    tasks: [],
    note: {
      title: "Keputusan tanpa ambang = bukan keputusan",
      body: "“Kita pantau dulu” hanya bermakna kalau ada angka yang memicu tindakan (“bila breach > 10 dalam setahun, model diganti”). Tanpa itu, pantauan = penundaan. Di deliverable-mu, setiap rekomendasi “pantau” wajib ditemani ambang tindakannya.",
    },
  },
  {
    id: "temuan-kalibrasi",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: amber + add-on",
    prose: [
      "CRO menyetujui status amber. VaR operasional dinaikkan via stress add-on 40% sementara tim kuantitatif mengkalibrasi ulang dengan jendela yang mencakup episode stres. Dua bulan kemudian model baru lolos Kupiec pada data validasi — dan, yang lebih penting, desk sudah terbiasa hidup dengan limit yang lebih jujur.",
      "Ini jalan tengah yang bekerja: kamu tidak membuang model (dan konsistensi historisnya), tapi juga tidak membiarkan angka bohong mengatur limit. Regulator mencatatnya sebagai contoh respons proporsional.",
    ],
    tasks: [],
    note: {
      title: "Add-on bukan tambalan permanen",
      body: "Stress add-on adalah perban — berguna sementara, berbahaya bila jadi permanen tanpa kalibrasi ulang. Di memo-mu, tulis tanggal kedaluwarsa add-on (“berlaku hingga model baru lolos backtest, maksimal 2 kuartal”).",
    },
  },
  {
    id: "temuan-eskalasi",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: eskalasi penuh",
    prose: [
      "CRO membekukan limit baru selama dua minggu — keputusan yang membuatmu tidak populer di lantai trading. Tapi ketika laporan audit regulator kuartal berikutnya keluar, ada satu paragraf yang menyebut bankmu: “menunjukkan kemauan menindak model yang gagal — praktik yang diharapkan.” Satu paragraf itu bernilai lebih dari dua minggu peluang trading yang hilang.",
      "Harga yang kamu bayar nyata: desk kehilangan momentum, dan kamu akan diingat sebagai “orang yang membekukan limit”. Integritas angka memang punya harga sosial — validator yang baik membayarnya di muka.",
    ],
    tasks: [],
    note: {
      title: "Eskalasi butuh bukti, bukan keberanian saja",
      body: "Keputusan sekeras ini hanya bertahan bila buktinya sekeras Kupiec LR 45,81 milikmu. Tanpa angka itu, eskalasi = drama. Dengan angka itu, eskalasi = profesionalisme. Itulah kenapa Lab 1 ada sebelum keputusan ini.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 16 baris: laporan validasi yang “lolos” itu bohong",
    prose: [
      "Sebelum menulis memo, satu misi audit. Di bawah ini 16 baris “Kutipan Laporan Validasi Model VaR — Q2”, dokumen internal yang mengklaim model LOLOS backtest. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
      "Senjatamu: 29 pelanggaran versi perhitunganmu, Kupiec 45,81, dan 8 pelanggaran berat dari Lab 2.",
    ],
    tasks: [],
    auditDossier: {
      version: "var-m1a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan Laporan Validasi Model VaR Q2 yang menyatakan model LOLOS backtest.",
      columns: ["Tanggal", "Imbal hasil", "VaR99", "Status"],
      rows: [
        { rowId: 1, cells: { "Tanggal": "2020-03-16", "Imbal hasil": "−12,77%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 2, cells: { "Tanggal": "2020-03-12", "Imbal hasil": "−9,99%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 3, cells: { "Tanggal": "2020-03-09", "Imbal hasil": "−7,90%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 4, cells: { "Tanggal": "2020-06-11", "Imbal hasil": "−6,08%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 5, cells: { "Tanggal": "2020-03-18", "Imbal hasil": "−5,32%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 6, cells: { "Tanggal": "2020-03-11", "Imbal hasil": "−5,01%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 7, cells: { "Tanggal": "2020-02-27", "Imbal hasil": "−4,52%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 8, cells: { "Tanggal": "2020-04-01", "Imbal hasil": "−4,51%", "VaR99": "2,25%", "Status": "Pelanggaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I3: tanda dibalik ──
        { rowId: 9, cells: { "Tanggal": "2020-02-27", "Imbal hasil": "+4,52%", "VaR99": "2,25%", "Status": "Aman" }, claims: [{ label: "Tercatat", value: "Ya — hari tenang" }] },
        // ── I4: pekan tenang digandakan ──
        { rowId: 10, cells: { "Tanggal": "Pekan 2020-07-06", "Imbal hasil": "+0,8/+0,3/+1,1/+0,6/+0,4%", "VaR99": "2,25%", "Status": "ID W27-A" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 11, cells: { "Tanggal": "Pekan 2020-07-06", "Imbal hasil": "+0,8/+0,3/+1,1/+0,6/+0,4%", "VaR99": "2,25%", "Status": "ID W27-A" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 12, cells: { "Tanggal": "2021-03-15", "Imbal hasil": "−2,40%", "VaR99": "2,25%", "Status": "Pelanggaran ringan" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I2: lookahead ──
        { rowId: 13, cells: { "Tanggal": "—", "Imbal hasil": "—", "VaR99": "—", "Status": "Catatan metode" }, claims: [{ label: "Metode VaR", value: "Jendela 250 hari termasuk hari berjalan" }] },
        { rowId: 14, cells: { "Tanggal": "—", "Imbal hasil": "—", "VaR99": "—", "Status": "Sumber data" }, claims: [{ label: "Sumber", value: "FRED SP500, beku 2026-10-15" }] },
        // ── I1: jumlah pelanggaran dikecilkan ──
        { rowId: 15, cells: { "Tanggal": "Total 12 bulan", "Imbal hasil": "—", "VaR99": "2,25%", "Status": "4 pelanggaran" }, claims: [{ label: "Kesimpulan", value: "Dalam batas wajar" }] },
        { rowId: 16, cells: { "Tanggal": "—", "Imbal hasil": "—", "VaR99": "—", "Status": "Rekomendasi" }, claims: [{ label: "Rekomendasi", value: "Pertahankan model" }] },
      ],
      injections: [
        { key: "jumlah-dikecilkan", rowIds: [15, 16], title: "Jumlah pelanggaran dikecilkan", clue: "Laporan mengklaim 4 pelanggaran “dalam batas wajar” — perhitunganmu: 29. Selisih 25 pelanggaran tidak bisa dijelaskan oleh pembulatan.", danger: "Satu angka ringkasan yang salah membuat seluruh kesimpulan “lolos” berdiri di atas pasir. Komite menyetujui limit berdasarkan angka ini." },
        { key: "lookahead", rowIds: [13], title: "Lookahead: jendela termasuk hari berjalan", clue: "“Jendela 250 hari termasuk hari berjalan” — VaR hari ini dihitung memakai imbal hasil hari ini. Itu seperti menilai ujian dengan kunci jawaban di tangan.", danger: "Backtest dengan lookahead selalu terlihat bagus — dan selalu runtuh saat dipakai sungguhan, karena di produksi hari berjalan belum terjadi." },
        { key: "tanda-dibalik", rowIds: [9], title: "Tanda imbal hasil dibalik", clue: "2020-02-27 tercatat +4,52% “hari tenang” — di file mentah hari itu −4,52% (pelanggaran berat, baris 7). Satu tanda minus yang hilang menghapus satu pelanggaran.", danger: "Kesalahan tanda adalah sabotase paling murah dan paling mematikan: semua agregat di atasnya ikut salah arah." },
        { key: "pekan-ganda", rowIds: [10, 11], title: "Pekan tenang digandakan", clue: "Dua baris pekan 2020-07-06 identik persis — termasuk ID W27-A. Duplikat minggu tenang mengencerkan frekuensi pelanggaran.", danger: "Duplikat bukan cuma soal DBD — di laporan risiko, baris ganda mengecilkan semua rasio kejadian. Solusinya sama: constraint unik." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo validasi untuk CRO",
    prose: [
      "Semua bukti di tangan. Tulis memo validasi model satu halaman untuk CRO — artefak portofoliomu. Memo yang baik tidak hanya bilang “gagal”, tapi menunjukkan ANGKA kegagalannya, apa yang disembunyikan laporan internal, dan apa yang harus terjadi berikutnya.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): berapa pelanggaran teramati vs ekspektasi, hasil Kupiec, vonis model.",
        "Bukti kuantitatif: VaR trailing, jumlah pelanggaran, pelanggaran berat (8 hari), statistik Kupiec vs ambang 6,63.",
        "Temuan audit laporan: sabotase apa yang kamu temukan di laporan validasi internal, baris per baris.",
        "Rekomendasi: apa yang harus terjadi pada model & limit (rujuk keputusanmu di Langkah 5 + ambang tindakannya).",
        "Batas & risiko sisa: apa yang TIDAK dicakup backtest ini (mis. VaR bukan ukuran kerugian ekstrem; proxy S&P 500 bukan portofolio aktual).",
      ],
      rubric: [
        { criterion: "Kebenaran backtest", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "29 pelanggaran, Kupiec 45,81, 8 pelanggaran berat — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa ambang tindakan", "Ada rekomendasi, ambang kabur", "Rekomendasi + ambang tindakan eksplisit (mis. breach > 10/tahun → ganti model)"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim backtest membuktikan segalanya", "Menyebut sebagian batas", "Batas (VaR≠kerugian maks, proxy≠portofolio) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan validasi internal:",
      "1) **Jumlah dikecilkan** (baris 15–16): “4 pelanggaran, dalam batas wajar”. Angka sebenarnya: 29. Ekspektasi model 99% untuk 606 hari ≈ 6. Bahkan klaim “4” pun di bawah ekspektasi — laporan ini berbohong dua kali: mengecilkan angka DAN memutarbalikkan logika (“sedikit = bagus”).",
      "2) **Lookahead** (baris 13): jendela 250 hari “termasuk hari berjalan”. Backtest yang memakai data hari ini untuk memprediksi hari ini bukan backtest — itu sirkular. Di produksi, angka ini tidak akan pernah sebagus di laporan.",
      "3) **Tanda dibalik** (baris 9): 2020-02-27 ditulis +4,52%. Di data mentah: −4,52%, pelanggaran berat peringkat 7. Satu karakter minus = satu pelanggaran hilang = Rp miliaran limit yang salah hitung.",
      "4) **Pekan ganda** (baris 10–11): ID W27-A muncul dua kali dengan angka identik. Klasik — dan obatnya semurah di misi DBD: constraint unik.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi angka laporan terhadap sumber mentah, atau memercayai stempel “validasi”. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis. Validator terbaik bukan yang paling keras, melainkan yang buktinya paling tidak bisa dibantah — Kupiec 45,81 milikmu itu tidak bisa dibantah.",
      "Bahaya nyata terakhir: VaR yang terlalu tenang = limit yang terlalu longgar = ketika krisis datang, bank menemukan bahwa “bantalan” yang dikiranya ada ternyata ilusi. 2008 mengajarkan ini dengan harga triliunan dolar.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: backtest lolos sekali = aman selamanya",
      type: "risk",
      body: "Backtest adalah foto, bukan jaminan. Rezim pasar berubah — volatilitas 2021 (tenang) bukan volatilitas 2020 (badai). Itulah kenapa validasi model itu BERKALA (tahunan, atau tiap ada perubahan pasar material), bukan sekali seumur hidup model.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Backtest independen: 606 hari, VaR99 trailing 2,25% → 29 pelanggaran vs ekspektasi ~6; Kupiec LR 45,81 >> 6,63 → model DITOLAK pada 1%.",
      "Empat pola sabotase laporan validasi: jumlah dikecilkan, lookahead (jendela termasuk hari berjalan), tanda dibalik, baris ganda.",
      "Keputusan atas model gagal selalu punya harga: pertahankan (risiko mengendap), amber+add-on (jalan tengah proporsional), eskalasi (integritas dengan biaya sosial). Setiap opsi “pantau” wajib punya ambang tindakan.",
      "VaR 99% bukan kerugian maksimum — ia tidak bilang apa-apa tentang kedalaman jurang pada 1% hari terburuk.",
      "Data: FRED S&P 500 harian 2019-01-01–2021-06-30 (data publik pemerintah federal AS), dibekukan 2026-10-15; S&P 500 = proxy, bukan portofolio aktual.",
    ],
  },
];

(misiVar.steps as V2Step[]).push(...LANJUTAN_VAR);
