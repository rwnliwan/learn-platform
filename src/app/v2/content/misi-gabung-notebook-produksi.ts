import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Notebook: Skor yang Tak Bisa Diulang di Produksi ────────────────
// CAPSTONE (Misi C kombinasi): ML Engineer × MLOps.
// Dataset SINTETIS: 5000 baris training + 2000 baris production logs fiksi
// (seed 42) — BUKAN data pelanggan asli, BUKAN log produksi asli.
// File: public/misi/misi-gabung-notebook-produksi/ (training_data.csv,
// production_logs.csv, feature_config.csv, METODE.md).

const BASE = "/misi/misi-gabung-notebook-produksi";

export const misiGabungNotebook: V2Mission = {
  slug: "misi-gabung-notebook-produksi",
  track: "Machine Learning Engineer",
  module: "Misi",
  title: "Misi Notebook: Skor yang Tak Bisa Diulang di Produksi",
  estMinutes: 170,
  role: "ML engineer",
  client:
    "Head of Data — model churn AUC 0,91 di notebook, 0,72 di produksi; on-call berbunyi",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Pager berbunyi 02:14 — skor yang tak bisa diulang",
      prose: [],
      tasks: [],
      briefing: {
        role: "ML engineer — penanggung jawab on-call untuk model churn v2.3.1",
        client:
          "Head of Data. Enam minggu lalu tim mendeploy model churn v2.3.1 dengan AUC 0,91 di notebook — angka yang dirayakan di sprint review. Tadi malam dashboard produksi menunjukkan AUC 0,72, dan pager on-call membangunkamu pukul 02:14. Tugasmu malam ini: buktikan kedua angka itu dari data mentah, temukan kenapa skornya jatuh, dan putuskan tindakan darurat sebelum matahari terbit. Pagi ini beredar 'Laporan Insiden Churn v2' yang menyimpulkan akar masalahnya adalah 'data musiman'. Kamu tidak yakin — churn musiman tidak menjelaskan kenapa fitur yang sama bisa berkhianat.",
        story: [
          "Selasa, 02:14. Ponselmu bergetar: PagerDuty, severity-2. Dashboard model monitoring — yang baru dipasang bulan lalu — menampilkan satu garis merah: AUC produksi model churn turun ke 0,72. Di notebook evaluasi enam minggu lalu, angkanya 0,91. Selisih 0,19. Itu bukan fluktuasi; itu jurang.",
          "Model ini penting: skornya dipakai tim retensi untuk memilih siapa yang ditelepon duluan. Skor yang salah urutan berarti pelanggan yang benar-benar akan churn tidak ditelepon, sementara yang setia malah diganggu promo. Setiap hari model ini salah, uang bocor diam-diam.",
          "Pukul 09:00 beredar 'Laporan Insiden Churn v2' dari tim analis: 12 halaman, rapi, dengan kesimpulan yang nyaman — 'pergeseran musiman perilaku pelanggan'. Tidak ada yang perlu diperbaiki, cukup tunggu musim berlalu. Kamu membaca lampirannya dua kali dan menemukan empat hal yang tidak beres. Misi ini: reproduksi angkanya sendiri, ukur skew-nya sendiri, putuskan tindakanmu sendiri — lalu audit laporan itu baris per baris.",
        ],
        objectives: [
          "Mereproduksi AUC 0,91 dari data training dan menghitung ulang AUC 0,72 dari production logs — termasuk pola mingguannya (apakah jatuhnya bertahap atau langsung?).",
          "Mengukur train-serving skew per fitur dan mengidentifikasi fitur yang definisinya berbeda di serving.",
          "Memilih satu dari tiga tindakan darurat (rollback / hotfix pipeline fitur / retrain) dengan memahami konsekuensi masing-masing.",
          "Menemukan 4 sabotase di Laporan Insiden Churn v2 dan menulis postmortem + rencana monitoring yang dinilai rubrik.",
        ],
        prereqSummary:
          "Train-serving skew = ketika sebuah fitur dihitung dengan definisi berbeda antara training dan produksi, sehingga model menerima 'makanan' yang tidak dikenalnya. AUC = peluang skor pelanggan yang benar-benar churn lebih tinggi daripada skor yang tidak churn — 0,91 berarti nyaris selalu benar mengurutkan, 0,72 berarti sering salah. Leakage = fitur training yang diam-diam mengandung informasi dari masa depan (setelah tanggal label), membuat evaluasi terlihat bagus padahal menipu.",
        datasetNote:
          "Data 100% SINTETIS: 5000 baris training + 2000 baris production logs fiksi hasil generator acak (seed 42) — BUKAN data pelanggan asli, BUKAN log produksi asli, BUKAN konfigurasi pipeline asli.\nFile: training_data.csv — kolom customer_id, label_date, tenure_months, total_minutes, monthly_spend, support_tickets, days_since_last_login, churn, score (skor notebook v2.3.1). production_logs.csv — request_id, customer_id, inference_date, kelima fitur, model_version, score, churn_observed (label yang baru diketahui 30 hari kemudian). feature_config.csv — definisi tiap fitur di training vs serving + status monitoring.\nMetode & batas jujur: file METODE.md di folder yang sama. Modelnya regresi logistik sederhana — pola masalahnya nyata, kerumitannya disederhanakan untuk latihan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, satu kontrak yang dilanggar",
      prose: [
        "`training_data.csv` — 5000 baris, label_date 2026-08-15. Kolom `churn` adalah labelnya (1 = churn), kolom `score` adalah skor yang dihasilkan notebook v2.3.1 — dari kolom inilah klaim 'AUC 0,91' harus dibuktikan ulang, bukan dipercaya.",
        "`production_logs.csv` — 2000 request inferensi, inference_date 2026-09-01 sampai 2026-10-12 (enam minggu pasca-deploy). Kolom `churn_observed` adalah label yang baru diketahui 30 hari setelah inferensi — inilah kebenaran lapangan untuk menghitung ulang 'AUC 0,72'. Kolom `inference_date` memungkinkanmu menguji klaim 'penurunan bertahap': kelompokkan per minggu dan lihat sendiri.",
        "`feature_config.csv` — tabel paling jujur di misi ini. Tiga kolom: `definisi_training`, `definisi_serving`, dan `monitoring_aktif`. Baca seperti membaca kontrak — karena di sinilah pengkhianatan biasanya tertulis hitam di atas putih.",
      ],
      tasks: [
        { id: "t1", text: "Buka ketiga file: catat jumlah baris training_data.csv dan production_logs.csv" },
        { id: "t2", text: "Dari feature_config.csv: tulis definisi `total_minutes` di training vs di serving" },
        { id: "t3", text: "Catat nilai kolom `monitoring_aktif` untuk semua fitur" },
      ],
      note: {
        title: "Cara membaca feature_config.csv",
        body: "Kontrak fitur yang sehat: definisi_training IDENTIK dengan definisi_serving, dan monitoring_aktif = true. Setiap baris yang melanggar salah satunya adalah tersangka. Di misi ini kamu akan menemukan kedua pelanggaran itu — dan laporan insiden resmi mengklaim tidak ada pelanggaran sama sekali.",
      },
      reference:
        "training_data.csv (5000 baris SINTETIS, seed 42) + production_logs.csv (2000 baris SINTETIS) + feature_config.csv (kontrak definisi fitur). Kebenaran = file mentah, bukan laporan.",
    },
    {
      id: "teori-skew",
      eyebrow: "Langkah 3 · Teori — lensa modeling",
      title: "Model tidak pernah salah makan — manusialah yang salah suap",
      prose: [
        "Lensa pertama: modeling. Model machine learning pada dasarnya adalah fungsi yang menghafal pola dari distribusi training: 'pelanggan seperti INI biasanya churn'. Ketika distribusi di serving berbeda — fitur dihitung dengan definisi lain, atau informasinya bocor dari masa depan — model tetap menjawab dengan percaya diri, hanya saja menjawab pertanyaan yang salah.",
        "Ada tiga cara distribusi berkhianat. Pertama, definisi fitur berubah diam-diam antara training dan serving (inilah yang terjadi pada `total_minutes` di misi ini). Kedua, leakage: fitur training mengandung informasi yang tidak akan tersedia saat inferensi — evaluasi terlihat cemerlang, produksi hancur. Ketiga, populasi benar-benar bergeser (inilah yang dituduhkan laporan insiden — 'musiman'). Dua yang pertama adalah sabotase; yang ketiga adalah kambing hitam.",
        "AUC mengukur satu hal: kemampuan model mengurutkan. Rumusnya sederhana — dan setiap simbolnya penting untuk memahami kenapa gap 0,19 adalah bencana, bukan 'sedikit turun'.",
      ],
      tasks: [
        { id: "t1", text: "Tulis ulang rumus AUC dengan kata-katamu sendiri (satu kalimat)" },
        { id: "t2", text: "Jelaskan kenapa AUC 0,91 → 0,72 berarti model 'salah urutan' 19% lebih sering" },
      ],
      formula: String.raw`\text{AUC} = P(S_{+} > S_{-})`,
      formulaNote:
        "S_+ = skor model untuk pelanggan yang benar-benar churn; S_- = skor untuk pelanggan yang tidak churn; P = peluang. Cara baca: ambil satu churner dan satu non-churner secara acak — AUC adalah peluang skor churner lebih tinggi. AUC 0,91: 91% benar mengurutkan. AUC 0,72: hanya 72% — hampir sepertiga pasangan salah urutan. Gap 0,19 = 19 poin peluang hilang, dan tim retensi menelepon berdasarkan urutan itu.",
      note: {
        title: "Miskonsepsi #1: AUC 0,91 = model bagus, titik",
        type: "pitfall",
        body: "“Angkanya 0,91, modelnya pasti bagus — yang rusak pasti datanya.” Belum tentu. AUC yang dihitung di atas data training — apalagi dengan fitur yang bocor dari masa depan — bukan bukti model bagus; itu bukti model hafal pola yang tidak akan ditemuinya di produksi. Angka evaluasi hanya sejujur data evaluasinya. Di misi ini 0,91 memang tidak pernah nyata.",
      },
    },
    {
      id: "teori-operasi",
      eyebrow: "Langkah 4 · Teori — lensa operasionalisasi",
      title: "Model yang sama, makanan yang beda",
      prose: [
        "Lensa kedua: operasionalisasi. Model v2.3.1 yang di-serve adalah byte-per-byte model yang sama dengan yang dievaluasi di notebook — `model_version` konsisten di 2000 log. Yang berubah bukan modelnya, melainkan makanannya: lima angka fitur yang disodorkan pipeline serving setiap ada request.",
        "Di sinilah monitoring drift seharusnya bekerja: membandingkan distribusi tiap fitur di serving dengan distribusi training secara berkala, dan membunyikan alarm ketika pergeserannya melewati ambang. Tanpa itu, skew bisa hidup berminggu-minggu tanpa ada yang tahu — seperti di misi ini, di mana kolom `monitoring_aktif` bernilai false untuk semua fitur sejak hari pertama deploy.",
        "Urutan diagnosis yang benar: reproduksi angkanya dulu (Lab 1 — apakah 0,91 dan 0,72 benar?), lalu ukur skew per fitur (Lab 2 — fitur mana yang berkhianat?), baru putuskan tindakan (Langkah 7). Urutan ini penting: keputusan tanpa diagnosis adalah judi dengan pager sebagai taruhannya.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 3 penyebab gap AUC versi pemahamanmu, dan mana yang paling mudah dibuktikan dari data" },
        { id: "t2", text: "Jelaskan dengan kata-katamu: kenapa monitoring drift yang mati membuat skew 'tak terlihat'?" },
      ],
      note: {
        title: "Miskonsepsi #2: skor turun = model usang, retrain saja beres",
        type: "pitfall",
        body: "“Ya sudah, retrain dengan data terbaru.” Retrain dengan pipeline yang sama hanya melatih ulang model di atas definisi fitur yang rusak. Kalau `total_minutes` di serving tetap dihitung 7 hari sementara training 30 hari, model hasil retrain pun menerima makanan yang salah — dan leakage di data training ikut terlatih ulang. Perbaiki dulu definisinya, baru bicara retrain. Urutan yang terbalik = membayar dua kali.",
      },
    },
    {
      id: "lab-auc",
      eyebrow: "Langkah 5 · Lab 1 — Reproduksi jurang 0,19",
      title: "Buktikan angkanya, jangan percaya laporannya",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `training_data.csv`: hitung AUC memakai kolom `churn` dan `score` — inilah reproduksi klaim 'AUC 0,91' dari notebook. Dari `production_logs.csv`: hitung AUC memakai `churn_observed` dan `score` — inilah hitung ulang 'AUC 0,72' dari lapangan. Fungsi `auc()` (metode peringkat Mann-Whitney) sudah disediakan dan dikunci — yang kamu isi hanya pemuatan data dan pemanggilannya.",
        "Terakhir, uji klaim 'musiman' dengan cara paling sederhana: kelompokkan production logs ke minggu pertama pasca-deploy (`inference_date` < '2026-09-08'). Kalau penurunan itu bertahap mengikuti musim, minggu pertama masih tinggi. Kalau langsung rendah — 'musiman' gugur sebagai penjelasan.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV ke `train` dan `prod`" },
        { id: "t2", text: "Hitung `auc_train` dari kolom churn + score" },
        { id: "t3", text: "Hitung `auc_prod` dari churn_observed + score, lalu `gap`" },
        { id: "t4", text: "Hitung `auc_minggu1` dari log minggu pertama pasca-deploy" },
      ],
      expected:
        "auc_train=0,9081 (≈0,91 — klaim notebook TERBUKTI); auc_prod=0,7214 (≈0,72 — dashboard TERBUKTI); gap=0,1867 (≈0,19). auc_minggu1=0,7069 (n=354) — sudah rendah sejak minggu pertama, bukan menurun bertahap.",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/training_data.csv\"))`.",
        "AUC training: `auc(train[\"churn\"], train[\"score\"])` — bulatkan 4 desimal.",
        "AUC produksi: `auc(prod[\"churn_observed\"], prod[\"score\"])`; gap = selisihnya.",
        "Minggu pertama: `w1 = prod[pd.to_datetime(prod[\"inference_date\"]) < \"2026-09-08\"]` lalu AUC dari w1.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-notebook-produksi\"",
          "",
          "# Fungsi AUC (metode peringkat Mann-Whitney) — JANGAN diubah",
          "def auc(y, s):",
          "    y = np.asarray(y, dtype=float)",
          "    s = np.asarray(s, dtype=float)",
          "    order = np.argsort(s, kind=\"mergesort\")",
          "    ranks = np.empty(len(s), dtype=float)",
          "    ranks[order] = np.arange(1, len(s) + 1)",
          "    n_pos = y.sum()",
          "    n_neg = len(y) - n_pos",
          "    return float((ranks[y == 1].sum() - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg))",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "train = pd.read_csv(open_url(BASE + \"/training_data.csv\"))",
          "prod = pd.read_csv(open_url(BASE + \"/production_logs.csv\"))",
          "",
          "auc_train = ...   # dari train: churn vs score",
          "auc_prod = ...    # dari prod: churn_observed vs score",
          "gap = ...         # selisih, bulatkan 4 desimal",
          "",
          "w1 = ...          # log minggu pertama: inference_date < \"2026-09-08\"",
          "auc_minggu1 = ... # AUC dari w1",
          "",
          "print(\"auc_train:\", auc_train, \"| auc_prod:\", auc_prod, \"| gap:\", gap)",
          "print(\"auc_minggu1:\", auc_minggu1, \"n=\" + str(len(w1)))",
        ].join("\n"),
        lockLines: 21,
        solution: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-notebook-produksi\"",
          "",
          "# Fungsi AUC (metode peringkat Mann-Whitney) — JANGAN diubah",
          "def auc(y, s):",
          "    y = np.asarray(y, dtype=float)",
          "    s = np.asarray(s, dtype=float)",
          "    order = np.argsort(s, kind=\"mergesort\")",
          "    ranks = np.empty(len(s), dtype=float)",
          "    ranks[order] = np.arange(1, len(s) + 1)",
          "    n_pos = y.sum()",
          "    n_neg = len(y) - n_pos",
          "    return float((ranks[y == 1].sum() - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg))",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "train = pd.read_csv(open_url(BASE + \"/training_data.csv\"))",
          "prod = pd.read_csv(open_url(BASE + \"/production_logs.csv\"))",
          "",
          "auc_train = round(auc(train[\"churn\"], train[\"score\"]), 4)",
          "auc_prod = round(auc(prod[\"churn_observed\"], prod[\"score\"]), 4)",
          "gap = round(auc_train - auc_prod, 4)",
          "",
          "w1 = prod[pd.to_datetime(prod[\"inference_date\"]) < \"2026-09-08\"]",
          "auc_minggu1 = round(auc(w1[\"churn_observed\"], w1[\"score\"]), 4)",
          "",
          "print(\"auc_train:\", auc_train, \"| auc_prod:\", auc_prod, \"| gap:\", gap)",
          "print(\"auc_minggu1:\", auc_minggu1, \"n=\" + str(len(w1)))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`train` termuat", name: "train", msg: "train harus berisi DataFrame dari training_data.csv." },
          { kind: "defined", task: "t1", label: "`prod` termuat", name: "prod", msg: "prod harus berisi DataFrame dari production_logs.csv." },
          { kind: "equal", task: "t2", label: "`auc_train` = 0,9081", name: "auc_train", value: 0.9081, tol: 0.01, msg: "Reproduksi klaim notebook: AUC training ≈ 0,91." },
          { kind: "equal", task: "t3", label: "`auc_prod` = 0,7214", name: "auc_prod", value: 0.7214, tol: 0.01, msg: "Hitung ulang dari log: AUC produksi ≈ 0,72." },
          { kind: "equal", task: "t3", label: "`gap` = 0,1867", name: "gap", value: 0.1867, tol: 0.015, msg: "Jurang 0,19 — bukan fluktuasi." },
          { kind: "equal", task: "t4", label: "`auc_minggu1` = 0,7069", name: "auc_minggu1", value: 0.7069, tol: 0.02, msg: "Minggu pertama sudah 0,71 (n=354) — jatuhnya LANGSUNG, bukan bertahap. Klaim 'musiman' gugur." },
        ],
      },
    },
    {
      id: "lab-skew",
      eyebrow: "Langkah 6 · Lab 2 — Buru pelakunya per fitur",
      title: "Fitur mana yang berkhianat?",
      prose: [
        "Angka terbukti: 0,91 vs 0,72, dan jatuhnya langsung sejak minggu pertama. Sekarang cari pelakunya. Untuk tiap fitur, hitung skew ternormalisasi: selisih rata-rata train vs serving dibagi simpangan baku training. Fitur yang definisinya sama akan punya skew mendekati nol; fitur yang definisinya berbeda akan menjerit.",
        "Ambang bacanya: skew di atas 1,0 berarti rata-rata bergeser lebih dari satu simpangan baku — itu bukan noise sampling, itu dua definisi yang berbeda. Di bawah 0,5: wajar untuk dua sampel berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV ke `train` dan `prod`" },
        { id: "t2", text: "Hitung skew 5 fitur ke dalam dict `hasil`" },
        { id: "t3", text: "Tentukan `fitur_paling_skew` dan `skew_total_minutes`" },
      ],
      expected:
        "total_minutes skew 1,094 (pelaku utama — definisi 30 hari vs 7 hari); days_since_last_login 0,182; support_tickets 0,041; monthly_spend 0,010; tenure_months 0,006. Satu fitur menjerit, empat lainnya diam.",
      formula: String.raw`\text{skew}(f) = \frac{|\mu_{\text{train}} - \mu_{\text{serve}}|}{\sigma_{\text{train}}}`,
      formulaNote:
        "f = satu fitur; μ_train = rata-rata fitur di data training; μ_serve = rata-rata di production logs; σ_train = simpangan baku di training. Contoh: total_minutes → |μ_train − μ_serve| / σ_train = 1,094. Artinya rata-rata serving bergeser 1,09 simpangan baku dari training — model menerima angka dalam 'bahasa' yang tidak dikenalnya.",
      echart: {
        option: {
          title: { text: "Skew ternormalisasi per fitur (train vs serving)" },
          tooltip: { trigger: "axis" },
          xAxis: {
            type: "category",
            data: ["tenure_months", "total_minutes", "monthly_spend", "support_tickets", "days_since_last_login"],
            axisLabel: { rotate: 20 },
          },
          yAxis: { type: "value", name: "skew" },
          series: [
            {
              type: "bar",
              data: [0.006, 1.094, 0.01, 0.041, 0.182],
              markLine: { data: [{ yAxis: 1 }] },
            },
          ],
        },
        caption:
          "Cara membaca: sumbu X = lima fitur model; tinggi batang = skew ternormalisasi (|μ_train − μ_serve| / σ_train); garis horizontal = ambang 1,0. Interpretasi: hanya total_minutes yang menembus ambang (1,09) — empat fitur lain di bawah 0,2, artinya distribusinya konsisten antara training dan serving. Satu batang yang menjulang = satu definisi yang berbeda, bukan pergeseran populasi.",
      },
      hints: [
        "Muat CSV seperti Lab 1: `pd.read_csv(open_url(BASE + \"/training_data.csv\"))`.",
        "Isi dict: `hasil = {}` lalu loop `for f in fitur:` dengan `hasil[f] = round(skew(train[f], prod[f]), 3)`.",
        "Fitur paling skew: `max(hasil, key=hasil.get)` — fungsi max dengan kunci nilai dict.",
        "Bandingkan dengan feature_config.csv: definisi total_minutes di training vs serving.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-notebook-produksi\"",
          "",
          "# Statistik skew ternormalisasi — JANGAN diubah",
          "def skew(train_col, serve_col):",
          "    a = np.asarray(train_col, dtype=float)",
          "    b = np.asarray(serve_col, dtype=float)",
          "    return float(abs(a.mean() - b.mean()) / a.std())",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "train = pd.read_csv(open_url(BASE + \"/training_data.csv\"))",
          "prod = pd.read_csv(open_url(BASE + \"/production_logs.csv\"))",
          "",
          "fitur = [\"tenure_months\", \"total_minutes\", \"monthly_spend\", \"support_tickets\", \"days_since_last_login\"]",
          "hasil = ...                 # dict: nama fitur -> skew (bulatkan 3 desimal)",
          "fitur_paling_skew = ...     # nama fitur dengan skew tertinggi",
          "skew_total_minutes = ...    # nilai skew total_minutes",
          "",
          "print(hasil)",
          "print(\"paling skew:\", fitur_paling_skew, skew_total_minutes)",
        ].join("\n"),
        lockLines: 17,
        solution: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-notebook-produksi\"",
          "",
          "# Statistik skew ternormalisasi — JANGAN diubah",
          "def skew(train_col, serve_col):",
          "    a = np.asarray(train_col, dtype=float)",
          "    b = np.asarray(serve_col, dtype=float)",
          "    return float(abs(a.mean() - b.mean()) / a.std())",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "train = pd.read_csv(open_url(BASE + \"/training_data.csv\"))",
          "prod = pd.read_csv(open_url(BASE + \"/production_logs.csv\"))",
          "",
          "fitur = [\"tenure_months\", \"total_minutes\", \"monthly_spend\", \"support_tickets\", \"days_since_last_login\"]",
          "hasil = {f: round(skew(train[f], prod[f]), 3) for f in fitur}",
          "fitur_paling_skew = max(hasil, key=hasil.get)",
          "skew_total_minutes = hasil[\"total_minutes\"]",
          "",
          "print(hasil)",
          "print(\"paling skew:\", fitur_paling_skew, skew_total_minutes)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`train` termuat", name: "train", msg: "train harus berisi DataFrame dari training_data.csv." },
          { kind: "defined", task: "t1", label: "`prod` termuat", name: "prod", msg: "prod harus berisi DataFrame dari production_logs.csv." },
          { kind: "equal", task: "t3", label: "pelaku = `total_minutes`", name: "fitur_paling_skew", value: "total_minutes", msg: "Satu-satunya fitur yang skew-nya menembus 1,0." },
          { kind: "equal", task: "t3", label: "`skew_total_minutes` = 1,094", name: "skew_total_minutes", value: 1.094, tol: 0.05, msg: "Bergeser 1,09 simpangan baku — definisi 30 hari vs 7 hari (cek feature_config.csv)." },
        ],
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 7 · Checkpoint keputusan",
      title: "Pager masih berbunyi — tiga tindakan di meja",
      prose: [
        "Diagnosis di tangan: gap 0,19 terbukti nyata (0,9081 vs 0,7214), jatuhnya langsung sejak minggu pertama (0,71 — bukan musiman bertahap), pelaku utamanya `total_minutes` dengan skew 1,09 (definisi 30 hari vs 7 hari), dan monitoring drift mati total sejak deploy. Pukul 03:20, Head of Data menelepon: 'Keputusanmu apa? Tim retensi mulai shift dalam 4 jam.'",
        "Keputusan ini tercatat seperti memo yang sudah dikirim — tiap opsi membuka konsekuensi berbeda di langkah berikut.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Tindakan darurat apa yang kamu ambil malam ini untuk model churn v2.3.1?",
        options: [
          {
            id: "opt-rollback",
            label: "Rollback ke v2.2.9 — model versi sebelumnya yang 'terbukti' berjalan",
            rationale:
              "v2.3.1 jelas bermasalah; versi sebelumnya tenang-tenang saja. Rollback itu cepat — satu perintah deploy — dan mengembalikan keadaan ke titik terakhir yang stabil.",
            nextStepId: "kons-rollback",
            consequenceNote:
              "v2.2.9 memakai pipeline fitur yang SAMA — bug definisi total_minutes sudah ada sejak v2.2. Rollback mengembalikan model lama ke makanan yang sama salahnya: AUC produksi v2.2.9 ternyata 0,70. Kamu menukar satu model rusak dengan model rusak yang lebih tua.",
          },
          {
            id: "opt-hotfix",
            label: "Hotfix pipeline fitur malam ini: samakan total_minutes serving ke 30 hari, bekukan deploy lain",
            rationale:
              "Serang akar masalah yang terukur: definisi fitur. Hotfix tidak menyentuh model — risikonya kecil, efeknya langsung terlihat di skew minggu depan.",
            nextStepId: "kons-hotfix",
            consequenceNote:
              "Skew total_minutes hilang; AUC produksi naik ke ~0,80 dalam seminggu. Tapi tidak kembali ke 0,91 — karena 0,91 memang tidak pernah nyata: ia digelembungkan leakage di training. Hotfix menyembuhkan serving, bukan masa lalu.",
          },
          {
            id: "opt-retrain",
            label: "Retrain penuh dengan data produksi + definisi fitur yang diperbaiki",
            rationale:
              "Bangun ulang dari fondasi yang benar: data berlabel dari produksi (definisi serving) tanpa fitur bocor. Satu kali kerja, hasil permanen.",
            nextStepId: "kons-retrain",
            consequenceNote:
              "Label produksi butuh 30 hari observasi — retrain yang bersih baru bisa jalan 4–6 minggu lagi. Sementara itu model tetap salah skor setiap hari, dan tanpa monitoring yang dinyalakan, skew berikutnya tetap tak terdeteksi. Retrain adalah jawaban yang benar untuk bulan depan, bukan untuk pager malam ini.",
          },
        ],
      },
    },
    {
      id: "kons-rollback",
      goto: "audit",
      eyebrow: "Langkah 8 · Konsekuensi",
      title: "Diputuskan: rollback ke v2.2.9",
      prose: [
        "Pukul 03:40 rollback dieksekusi. Dashboard sempat hijau selama 20 menit — lalu angka produksi v2.2.9 muncul: 0,70. Lebih buruk dari 0,72. Kamu baru sadar: v2.2.9 dilatih dan di-serve oleh pipeline fitur yang sama persis, termasuk definisi `total_minutes` 7 hari di serving. Rollback mengembalikan versi model, bukan memperbaiki makanan yang disodorkan ke model.",
        "Pelajaran yang mahal: rollback adalah obat untuk 'versi yang salah deploy', bukan untuk 'data yang salah definisi'. Tanpa diagnosis Lab 2, kamu tidak akan tahu bedanya — dan pager akan berbunyi lagi besok dengan angka yang sama buruknya.",
      ],
      tasks: [],
      note: {
        title: "Kapan rollback benar-benar obat",
        body: "Rollback bekerja ketika penyebabnya ada di artefak yang di-deploy (bobot model korup, config salah, dependency pecah). Ketika penyebabnya ada di data yang mengalir (definisi fitur, leakage, drift), rollback hanya memutar ulang film yang sama dengan pemeran yang lebih tua.",
      },
    },
    {
      id: "kons-hotfix",
      goto: "audit",
      eyebrow: "Langkah 8 · Konsekuensi",
      title: "Diputuskan: hotfix pipeline fitur",
      prose: [
        "Pukul 04:10 kamu mengunci definisi `total_minutes` di serving menjadi trailing 30 hari — sama dengan training — dan membekukan semua deploy lain. Seminggu kemudian skew-nya runtuh mendekati nol dan AUC produksi naik ke ~0,80. Pager diam.",
        "Tapi 0,80 bukan 0,91. Kamu mengejar selisihnya dan menemukan kebenaran yang tidak nyaman: 0,91 memang tidak pernah nyata. Fitur `days_since_last_login` di training dihitung memakai riwayat login 30 hari SETELAH label_date — informasi masa depan yang tidak akan pernah tersedia saat inferensi. Hotfix menyembuhkan serving; ia tidak bisa menyembuhkan masa lalu. Model ini butuh retrain bersih — dan itu pekerjaan bulan depan.",
        "Pelajaran yang mahal sekaligus melegakan: hotfix yang tepat sasaran menghentikan pendarahan malam ini, dan diagnosis yang jujur mencegahmu mengejar angka hantu 0,91.",
      ],
      tasks: [],
      note: {
        title: "Hotfix vs perbaikan permanen",
        body: "Hotfix pipeline fitur = menyamakan definisi serving dengan training (atau sebaliknya, lalu retrain). Ia menghentikan skew yang terukur. Yang tidak ia lakukan: menghapus leakage dari data training lama, menyalakan monitoring, atau mencegah definisi berikutnya berubah diam-diam. Ketiganya masuk postmortem-mu di Langkah 12.",
      },
    },
    {
      id: "kons-retrain",
      goto: "audit",
      eyebrow: "Langkah 8 · Konsekuensi",
      title: "Diputuskan: retrain penuh",
      prose: [
        "Kamu memilih jalan yang paling benar secara teknis: kumpulkan label dari produksi (butuh 30 hari observasi churn), perbaiki definisi fitur, buang fitur bocor, lalu retrain. Enam minggu kemudian model baru deploy dengan AUC 0,84 yang JUJUR — dan bertahan.",
        "Tapi selama enam minggu itu, model lama tetap salah skor setiap hari. Tim retensi menelepon orang yang salah selama 42 hari karena 'menunggu fondasi yang benar'. Dan karena monitoring drift tidak pernah dinyalakan, tidak ada yang akan tahu kalau skew berikutnya muncul di minggu kedua.",
        "Pelajaran yang mahal: kebenaran yang datang enam minggu terlambat adalah kebenaran yang membiarkan kerugian berjalan. Jawaban yang benar untuk bulan depan (retrain) dan jawaban yang benar untuk malam ini (hotfix + monitoring) adalah dua keputusan berbeda — insinyur yang baik mengambil keduanya, berurutan.",
      ],
      tasks: [],
      note: {
        title: "Retrain bukan strategi darurat",
        body: "Retrain menjawab 'bagaimana model yang benar seharusnya dibangun'. Ia tidak menjawab 'apa yang menghentikan pendarahan malam ini'. Dalam insiden, urutannya: hentikan pendarahan (hotfix/rollback) → diagnosis penuh → perbaikan permanen (retrain + monitoring). Melewatkan langkah pertama demi lompat ke langkah ketiga = membiarkan pager berbunyi 42 hari.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 9 · Misi audit",
      title: "Dossier 12 baris: laporan insiden yang nyaman itu bohong",
      prose: [
        "Sebelum menulis postmortem, satu misi audit. Di bawah ini 12 baris 'Laporan Insiden Churn v2' — dokumen 12 halaman yang menyimpulkan akar masalahnya adalah 'data musiman'. Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil lab-mu sendiri — gap 0,1867, skew total_minutes 1,094, AUC minggu pertama 0,7069, dan feature_config.csv.",
        "Cara kerja: untuk setiap pernyataan, cocokkan dengan angka mentah. Laporan yang jujur selamat; yang tidak — kamu tandai.",
      ],
      tasks: [],
      auditDossier: {
        version: "churn-capstone-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai Laporan Insiden Churn v2 — 'analisis menyeluruh dengan kesimpulan data musiman'. Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini. Kolom 'Status di laporan' adalah klaim laporan itu sendiri, bukan vonismu.",
        columns: ["#", "Pernyataan laporan insiden", "Bukti mentah", "Status di laporan"],
        rows: [
          { rowId: 1, cells: { "#": "1", "Pernyataan laporan insiden": "AUC 0,91 di notebook terverifikasi dari data training", "Bukti mentah": "reproduksi: 0,9081", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Sesuai verifikasi" }] },
          { rowId: 2, cells: { "#": "2", "Pernyataan laporan insiden": "AUC produksi 0,72 dari 2000 log inferensi 6 minggu", "Bukti mentah": "hitung ulang: 0,7214", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Sesuai verifikasi" }] },
          // ── I1: definisi fitur diklaim identik ──
          { rowId: 3, cells: { "#": "3", "Pernyataan laporan insiden": "Seluruh fitur dihitung identik antara training dan serving", "Bukti mentah": "feature_config.csv — total_minutes: 30 hari (training) vs 7 hari (serving)", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Dinyatakan identik" }] },
          // ── I2: tidak ada leakage ──
          { rowId: 4, cells: { "#": "4", "Pernyataan laporan insiden": "Tidak ada kebocoran data masa depan di fitur training", "Bukti mentah": "definisi days_since_last_login: memakai login 30 hari SETELAH label_date", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Dinyatakan bersih" }] },
          // ── I3: monitoring diklaim aktif ──
          { rowId: 5, cells: { "#": "5", "Pernyataan laporan insiden": "Monitoring drift aktif sejak deploy; nol alert berarti nol drift", "Bukti mentah": "feature_config.csv — monitoring_aktif=false untuk semua fitur; tidak ada tabel alert", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Dinyatakan aktif" }] },
          // ── I4: kambing hitam musiman ──
          { rowId: 6, cells: { "#": "6", "Pernyataan laporan insiden": "Akar masalah: pergeseran musiman perilaku pelanggan", "Bukti mentah": "AUC minggu pertama pasca-deploy langsung 0,71 — bukan penurunan bertahap; monthly_spend stabil (skew 0,01)", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Kesimpulan resmi" }] },
          { rowId: 7, cells: { "#": "7", "Pernyataan laporan insiden": "Model yang di-serve = model yang dievaluasi (v2.3.1)", "Bukti mentah": "model_version konsisten di 2000 log", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Sesuai verifikasi" }] },
          { rowId: 8, cells: { "#": "8", "Pernyataan laporan insiden": "Distribusi label stabil antara train dan produksi", "Bukti mentah": "churn 11,3% vs 10,8%", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Sesuai verifikasi" }] },
          // ── I1 pendukung: verifikasi serving diklaim sudah dilakukan ──
          { rowId: 9, cells: { "#": "9", "Pernyataan laporan insiden": "Tim sudah memverifikasi ulang definisi fitur serving sebelum deploy", "Bukti mentah": "tidak ada tiket atau catatan verifikasi di repo", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Dinyatakan sudah" }] },
          // ── I4 pendukung: fitur kontrol stabil ──
          { rowId: 10, cells: { "#": "10", "Pernyataan laporan insiden": "Fitur kontrol monthly_spend tidak bergeser (bukti 'hanya musiman')", "Bukti mentah": "skew monthly_spend 0,01 — stabil, justru melemahkan klaim musiman", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Dinyatakan stabil" }] },
          // ── I2 pendukung ──
          { rowId: 11, cells: { "#": "11", "Pernyataan laporan insiden": "days_since_last_login berpola wajar di training", "Bukti mentah": "definisi memakai data masa depan; skew train-vs-serving 0,18", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Dinyatakan wajar" }] },
          // ── I4 pendukung: penurunan diklaim bertahap ──
          { rowId: 12, cells: { "#": "12", "Pernyataan laporan insiden": "Penurunan AUC terjadi bertahap selama 6 minggu", "Bukti mentah": "minggu 36: 0,69; minggu 37: 0,71 — rendah sejak awal", "Status di laporan": "BENAR" }, claims: [{ label: "Klaim", value: "Dinyatakan bertahap" }] },
        ],
        injections: [
          { key: "definisi-berbeda", rowIds: [3, 9], title: "Fitur dihitung berbeda di serving = skew tersembunyi", clue: "Laporan mengklaim semua fitur identik (baris 3) dan 'sudah diverifikasi' (baris 9). feature_config.csv menulis hitam di atas putih: total_minutes = 30 hari di training, 7 hari di serving. Lab 2 mengukur akibatnya: skew 1,094.", danger: "Satu definisi yang berbeda diam-diam = model menerima angka dalam bahasa yang tidak dikenalnya, setiap request, tanpa satu pun alert. Di produksi nyata, skew seperti ini hidup berbulan-bulan dan menggerogoti keputusan bisnis yang memakai skornya." },
          { key: "leakage-training", rowIds: [4, 11], title: "Leakage dari data masa depan di training", clue: "Laporan mengklaim 'tidak ada kebocoran' (baris 4) dan pola 'wajar' (baris 11). Definisi mentahnya: days_since_last_login memakai riwayat login 30 hari SETELAH label_date — informasi yang tidak akan pernah ada saat inferensi. Inilah yang menggelembungkan 0,91.", danger: "Leakage membuat evaluasi berbohong dengan wajah paling meyakinkan: angka tinggi, metodologi terlihat rapi. Model yang lahir dari leakage tidak 'sedikit bias' — ia optimis secara sistematis, dan optimisme itu diterjemahkan bisnis menjadi target yang tidak akan tercapai." },
          { key: "monitoring-mati", rowIds: [5], title: "Monitoring drift tidak pernah dinyalakan", clue: "Laporan: 'monitoring aktif; nol alert = nol drift' (baris 5). feature_config.csv: monitoring_aktif=false untuk SEMUA fitur. Tidak ada alert karena tidak ada yang mendengarkan — bukan karena tidak ada suara.", danger: "'Nol alert' tanpa monitoring yang aktif adalah keheningan yang menipu. Skew 1,09 berjalan enam minggu tanpa terdeteksi; setiap minggu keterlambatan = satu minggu keputusan retensi yang salah sasaran." },
          { key: "kambing-hitam-musiman", rowIds: [6, 10, 12], title: "Laporan menyalahkan 'data musiman'", clue: "Kesimpulan resmi (baris 6): musiman. Tapi AUC minggu pertama langsung 0,71 (baris 12) — bukan menurun bertahap — dan fitur kontrol monthly_spend stabil total (baris 10, skew 0,01). Musiman yang sesungguhnya menggeser banyak fitur perlahan; di sini satu fitur meloncat tajam tepat saat deploy.", danger: "Kambing hitam 'musiman' adalah kesimpulan yang paling nyaman: tidak ada yang salah, tidak ada yang perlu diperbaiki, cukup tunggu. Setiap insiden yang ditutup dengan kesimpulan nyaman tanpa bukti adalah insiden yang akan terulang — dengan pager yang sama di jam yang sama." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 10 · Deliverable",
      title: "Postmortem + rencana monitoring — artefak portofoliomu",
      prose: [
        "Semua bukti di tangan: gap 0,1867 yang terbukti, skew total_minutes 1,094, leakage days_since_last_login, monitoring yang mati, dan 4 sabotase di laporan resmi. Tulis postmortem — dokumen yang dibaca Head of Data, tim retensi, dan insinyur yang akan on-call setelahmu. Postmortem yang baik tidak mencari kambing hitam; ia mencari sistem yang memungkinkan kesalahan itu lolos.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan insiden: timeline (deploy 2026-09-01 → pager 02:14 → diagnosis), dampak (AUC 0,91 → 0,72; keputusan retensi salah urutan 19% lebih sering), dan status (sudah/belum pulih).",
          "Akar masalah (dengan bukti angka): skew definisi total_minutes 30 hari vs 7 hari (skew 1,094); leakage days_since_last_login memakai data 30 hari setelah label_date (sumber inflasi 0,91); monitoring drift mati (monitoring_aktif=false); kesimpulan 'musiman' yang gugur oleh AUC minggu pertama 0,71.",
          "Tindakan darurat yang diambil + alasannya (rujuk keputusanmu di Langkah 7 dan konsekuensinya di Langkah 8).",
          "Rencana monitoring: metrik apa yang dipantau (skew per fitur, AUC mingguan dari label tertunda, distribusi skor), ambang alarm, siapa yang on-call, dan uji coba alarm (alarm yang tidak pernah diuji = tidak ada alarm).",
          "Pencegahan terulang: kontrak definisi fitur tunggal (satu kode untuk training & serving), CI check skew sebelum deploy, daftar fitur terlarang-bocor, dan aturan 'laporan insiden wajib melampirkan bukti mentah'.",
          "Batas & risiko sisa: apa yang belum diperbaiki (mis. model masih membawa bobot dari era leakage sampai retrain bersih selesai; label produksi butuh 30 hari).",
        ],
        rubric: [
          { criterion: "Diagnosis akar masalah", weight: 30, levels: ["Menyalahkan musiman / tanpa bukti angka", "Menyebut skew atau leakage tanpa angka", "Skew (1,094) + leakage + monitoring mati, semua dengan angka/bukti file"] },
          { criterion: "Rencana perbaikan pipeline", weight: 25, levels: ["'Retrain saja' tanpa perbaiki definisi", "Perbaiki definisi tapi tanpa kontrak fitur", "Definisi tunggal training=serving + CI check skew + daftar fitur terlarang-bocor"] },
          { criterion: "Rencana monitoring", weight: 25, levels: ["Tidak ada / 'pasang dashboard'", "Metrik tanpa ambang/pemilik", "Skew per fitur + AUC mingguan + ambang + pemilik on-call + uji alarm"] },
          { criterion: "Kejujuran batas & pencegahan", weight: 20, levels: ["Mengklaim masalah selesai total", "Menyebut sebagian risiko sisa", "Risiko sisa eksplisit (bobot era-leakage, label 30 hari) + aturan bukti-mentah untuk laporan insiden"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 11 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di Laporan Insiden Churn v2:",
        "1) **Definisi berbeda di serving** (baris 3 & 9): laporan mengklaim semua fitur 'identik' dan 'sudah diverifikasi'. Kebenaran mentah: `total_minutes` dihitung dari 30 hari di training dan 7 hari di serving — tertulis di feature_config.csv yang tidak pernah dibaca penulis laporan. Akibat terukur: skew 1,094.",
        "2) **Leakage di training** (baris 4 & 11): laporan mengklaim 'tidak ada kebocoran'. Kebenaran mentah: `days_since_last_login` memakai riwayat login 30 hari SETELAH label_date. Inilah mesin di balik 0,91 — angka yang membuat semua orang tenang selama enam minggu.",
        "3) **Monitoring mati** (baris 5): laporan mengklaim 'monitoring aktif; nol alert = nol drift'. Kebenaran mentah: `monitoring_aktif=false` untuk semua fitur. Tidak ada alert karena tidak ada yang mendengarkan.",
        "4) **Kambing hitam musiman** (baris 6, 10 & 12): laporan menyimpulkan 'pergeseran musiman'. Kebenaran mentah: AUC minggu pertama langsung 0,71 (bukan bertahap), dan fitur kontrol `monthly_spend` stabil total (skew 0,01). Musiman tidak menjelaskan loncatan tajam tepat saat deploy.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel 'laporan resmi'.",
        "Bahaya nyata terakhir: model churn yang salah skor 19% lebih sering berarti tim retensi menelepon pelanggan yang salah selama berminggu-minggu — yang akan churn tidak diselamatkan, yang setia malah terganggu. Kerugiannya tidak muncul sebagai satu angka merah di dashboard; ia bocor sebagai puluhan keputusan kecil yang salah, setiap hari, tanpa alarm. Itulah kenapa monitoring yang mati adalah sabotase paling mahal di antara keempatnya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #3: monitoring itu nice-to-have",
        type: "pitfall",
        body: "“Nanti saja pasang monitoringnya, yang penting modelnya jalan.” Di misi ini 'nanti saja' berlangsung enam minggu — dan selama itu tidak ada satu manusia pun yang tahu skornya salah. Monitoring drift bukan hiasan dashboard; ia adalah satu-satunya saksi yang tidak bisa dibungkam oleh laporan yang nyaman. Model tanpa monitoring = mengemudi dengan mata tertutup dan berharap jalanan lurus.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 12 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "Train-serving skew: `total_minutes` dihitung 30 hari di training vs 7 hari di serving → skew ternormalisasi 1,094; model menerima 'makanan' yang tidak dikenalnya setiap request.",
        "Leakage: `days_since_last_login` di training memakai login 30 hari SETELAH label_date → menggelembungkan AUC training ke 0,9081 (≈0,91); AUC produksi yang jujur 0,7214 (≈0,72).",
        "AUC = P(S_+ > S_-) — gap 0,19 berarti model 19 poin peluang lebih sering salah mengurutkan; tim retensi menelepon berdasarkan urutan itu.",
        "AUC minggu pertama pasca-deploy langsung 0,71 (n=354) — jatuhnya seketika, bukan musiman bertahap; fitur kontrol monthly_spend stabil (skew 0,01).",
        "Keputusan darurat: rollback gagal bila penyebabnya di data (v2.2.9 → 0,70); hotfix definisi menghentikan pendarahan (~0,80); retrain bersih butuh 4–6 minggu — ambil berurutan, bukan salah satu.",
        "Monitoring drift yang mati (monitoring_aktif=false) membuat skew 1,09 tak terdeteksi enam minggu; 'nol alert' tanpa monitoring = keheningan yang menipu.",
        "Data: 5000 baris training + 2000 log produksi SINTETIS (seed 42), BUKAN data asli; model regresi logistik sederhana — file METODE.md.",
      ],
    },
  ],
};

export default misiGabungNotebook;
