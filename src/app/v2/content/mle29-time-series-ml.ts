import type { V2Lesson } from "../lib/types";

export const mle29: V2Lesson = {
  slug: "mle29-time-series-ml",
  track: "Machine Learning Engineer",
  module: "Forecasting",
  title: "MLE29 — Time Series Forecasting dengan ML: ARIMA, Prophet & XGBoost",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang menang di validasi, kalah di gudang",
      prose: [
        "Rani, demand planner di distributor FMCG Distribusi Nusantara, punya 16 minggu data penjualan mingguan satu SKU kopi sachet. Ia melatih XGBoost dengan train test split acak seperti biasa di data tabular, dan melaporkan MAPE 2,1 persen ke direksi. Stok dipesan berdasarkan forecast itu. Empat minggu kemudian gudang kelebihan stok di dua minggu dan kehabisan di dua minggu lainnya — error aktual 38 persen.",
        "Investigasi menemukan akar yang sama seperti cerita Sinar Mart di MLE15: split acak membiarkan model mengintip masa depan. Minggu-minggu setelah periode test ikut masuk training, sehingga model menghafal, bukan meramal. Yang rusak bukan XGBoost-nya; yang rusak adalah cara mengevaluasinya. Lesson A3.9 sudah mengajarkan fondasi statistiknya — ARIMA, stasioneritas, dan walk-forward satu lipatan. Lesson ini naik satu tingkat: forecasting sebagai kompetensi ML — Prophet, XGBoost dengan fitur lag, dan validasi walk-forward multi-lipatan dengan perbandingan metrik yang jujur.",
        "Setelah lesson ini kamu bisa: (1) membedakan kapan memakai ARIMA, Prophet, dan XGBoost untuk forecasting; (2) membangun fitur lag dan rolling tanpa leakage; (3) menjalankan walk-forward multi-lipatan dan membaca MAE serta MAPE per model; (4) memilih model dari angka, bukan dari gengsi algoritmanya.",
      ],
      tasks: [],
      note: {
        title: "Hubungan dengan A3.9 dan MLE15",
        body: "A3.9 adalah fondasi statistik: ARIMA(1,1,1), uji ADF, dan interval forecast yang melebar. MLE15 Langkah 8 adalah survei senjata klasik: naive, seasonal naive, moving average, Holt-Winters, dan rolling-origin backtest satu kali. Lesson ini TIDAK mengulang keduanya: di sini ARIMA hanya jadi pembanding, fokusnya adalah Prophet sebagai model aditif modern, XGBoost dengan fitur lag, dan walk-forward empat lipatan dengan empat model yang dibandingkan kepala lawan kepala.",
      },
      reference: "A3.9 = fondasi statistik ARIMA. MLE15 = survei senjata klasik. MLE29 = forecasting sebagai kompetensi ML.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun dan mengevaluasi model forecasting ML dari ujung ke ujung pada satu deret waktu, dan mempertahankan pilihan modelmu dengan angka.",
        "(1) Menjelaskan dekomposisi Prophet — tren, musiman, dan efek libur — serta kapan changepoint membuat tren lama tidak lagi berlaku;",
        "(2) Membangun tabel fitur lag dan rolling untuk XGBoost, dengan aturan alignment yang mencegah leakage;",
        "(3) Menjalankan walk-forward empat lipatan dan menghitung MAE serta MAPE tiap model dari prediksi per lipatan;",
        "(4) Memilih model dari tabel perbandingan dan menerjemahkan MAE menjadi stok pengaman yang bisa dipertahankan di depan direksi.",
      ],
      tasks: [],
    },
    {
      id: "prophet",
      eyebrow: "Langkah 3 · Teori",
      title: "Prophet: tren plus musiman plus libur, ditulis sebagai penjumlahan",
      prose: [
        "Prophet, dari Meta, menulis forecast sebagai penjumlahan tiga komponen: y sama dengan tren ditambah musiman ditambah efek libur, ditambah residu. Trennya piecewise linear — garis lurus yang boleh patah di titik-titik bernama changepoint, misalnya saat harga naik atau kompetitor tutup. Musimannya deret Fourier — kombinasi sinus dan kosinus dengan periode mingguan dan tahunan. Efek liburnya regresor khusus: Lebaran bukan sekadar minggu biasa, ia punya lonjakan sendiri yang diestimasi dari data tahun-tahun sebelumnya.",
        "Kekuatan Prophet ada pada dua hal. Pertama, ia tahan terhadap data bolong dan outlier — minggu gudang tutup tidak merusak seluruh fit. Kedua, ia bisa dijelaskan ke non-teknis: forecast minggu depan sekian karena tren sekian ditambah musiman sekian ditambah efek Lebaran sekian. Kelemahannya: ia butuh musiman yang stabil dan tidak belajar interaksi antar fitur seperti pohon keputusan. Bila permintaanmu digerakkan oleh harga promo dan stok kompetitor, Prophet butuh regresor tambahan — dan di situlah ML tabular mengambil alih.",
        "Aturan praktis: pakai Prophet bila deretmu punya musiman kuat yang berulang, ada efek kalender yang jelas, dan kamu butuh forecast yang bisa dijelaskan dalam satu slide. Jangan pakai Prophet sebagai kotak hitam: periksa changepoint yang ia temukan — bila changepoint jatuh di minggu yang tidak punya penjelasan bisnis, itu sinyal noise, bukan sinyal.",
      ],
      tasks: [],
      formula: String.raw`y(t) = g(t) + s(t) + h(t) + \epsilon_t`,
      formulaNote: "y(t) = nilai deret di waktu t; g(t) = tren piecewise linear dengan changepoint; s(t) = musiman Fourier; h(t) = efek libur; epsilon = residu. Intuisi: forecast adalah penjumlahan, sehingga tiap komponen bisa dibaca dan diperdebatkan satu per satu.",
      reference: "Prophet = tren plus musiman plus libur. Changepoint = tempat tren boleh patah.",
    },
    {
      id: "lag-xgboost",
      eyebrow: "Langkah 4 · Teori",
      title: "XGBoost untuk deret waktu: ubah waktu menjadi kolom",
      prose: [
        "XGBoost tidak mengerti waktu — ia mengerti tabel. Maka tugasmu adalah mengubah deret menjadi tabel: tiap baris adalah satu minggu, kolomnya adalah fitur lag dan rolling. Lag 1 adalah penjualan minggu lalu, lag 4 adalah penjualan empat minggu lalu (satu siklus musiman), rolling mean 4 adalah rata-rata empat minggu terakhir, dan tren adalah nomor minggu itu sendiri. Targetnya adalah penjualan minggu ini. Setelah tabel jadi, XGBoost hanyalah XGBoost biasa — pohon, boosting, dan tuning yang sama seperti di A3.15.",
        "Satu aturan yang tidak boleh dilanggar: alignment. Fitur baris minggu t hanya boleh memakai data sampai minggu t minus 1. Rolling mean yang memakai minggu t sendiri adalah leakage — model melihat jawaban sebelum menjawab. Kesalahan klasik kedua: membuat fitur lag dari kolom target yang sudah diisi forecast, lalu memakainya sebagai fitur di horizon berikutnya tanpa sadar itu prediksi, bukan observasi. Di horizon 2 dan seterusnya, lag 1 adalah prediksimu sendiri — errornya ikut terbawa.",
        "Kapan XGBoost menang atas Prophet: bila ada banyak pendorong eksternal — harga, promo, cuaca, stok kompetitor — dan interaksinya penting, misalnya promo hanya ampuh bila stok kompetitor kosong. Kapan ia kalah: deret pendek di bawah 50 titik, karena pohon butuh banyak baris untuk belajar pola musiman; di sana Prophet atau ARIMA lebih hemat data. Dan ingat MLE15: XGBoost yang dievaluasi dengan split acak adalah fiksi — validasinya harus walk-forward, selalu.",
      ],
      tasks: [],
      note: {
        title: "Jebakan horizon panjang",
        body: "Forecast 1 minggu ke depan memakai lag observasi asli — aman. Forecast 4 minggu ke depan secara rekursif memakai prediksimu sendiri sebagai lag — error menumpuk tiap langkah. Alternatifnya adalah direct forecasting: latih satu model per horizon (model khusus minggu ke-4). Lebih mahal, tetapi errornya tidak menumpuk.",
      },
      reference: "Ubah waktu menjadi kolom: lag, rolling, tren. Alignment = fitur minggu t hanya memakai data sampai t minus 1.",
    },
    {
      id: "walk-forward",
      eyebrow: "Langkah 5 · Teori",
      title: "Walk-forward multi-lipatan: wasit yang tidak bisa disogok",
      prose: [
        "Walk-forward satu lipatan, seperti di A3.9, menguji satu titik potong train dan test. Multi-lipatan mengulanginya empat kali dengan jendela train yang membesar: latih minggu 1 sampai 12 lalu uji minggu 13, latih 1 sampai 13 lalu uji minggu 14, dan seterusnya sampai minggu 16. Setiap lipatan mensimulasikan satu keputusan nyata: hari ini kamu hanya punya data sampai kemarin, dan harus meramal besok.",
        "Metriknya dua. MAE adalah rata-rata nilai absolut error, satuannya sama dengan data — MAE 2,5 pada penjualan mingguan berarti meleset rata-rata 2,5 unit per minggu, kalimat yang langsung dimengerti gudang. MAPE adalah versi persen — enak untuk membandingkan antar SKU, tetapi tidak terdefinisi bila aktual nol; dan untuk deviasi yang sama besar, under- dan over-forecast dihukum SAMA — klaim sebaliknya terbalik: MAPE under-forecast dibatasi 100 persen (saat prediksi nol), sementara over-forecast tidak terbatas, jadi bila ada asimetri, justru over-forecast yang bisa dihukum lebih berat. Aturan dari MLE15 tetap berlaku: MAE dulu untuk keputusan, MAPE untuk perbandingan, selalu dengan konteks.",
        "Data lab lesson ini: penjualan mingguan 16 minggu, yaitu 120, 132, 128, 145, 138, 152, 148, 163, 158, 172, 168, 183, 180, 190, 186, 205. Empat lipatan menguji minggu 13 sampai 16. Hasil yang akan kamu hitung di lab: naive MAE 9,0; seasonal naive MAE 20,0; moving average 4 minggu MAE 12,5; model lag-OLS — regresi linear di atas fitur lag 1 dan lag 4, proksi yang jujur untuk cara kerja XGBoost — MAE 2,50. Seasonal naive kalah telak di sini karena tren naik 5,05 unit per minggu membuat nilai empat minggu lalu selalu ketinggalan.",
      ],
      tasks: [],
      formula: String.raw`\text{MAE} = \frac{1}{n}\sum_{t=1}^{n}\lvert y_t - \hat{y}_t \rvert \qquad \text{MAPE} = \frac{100}{n}\sum_{t=1}^{n}\left\lvert \frac{y_t - \hat{y}_t}{y_t} \right\rvert`,
      formulaNote: "MAE = rata-rata error absolut, satuannya sama dengan data. MAPE = rata-rata error persen. n = jumlah titik uji, di lab ini 4 lipatan. y_t = aktual, y-topi = prediksi.",
      reference: "Walk-forward = latih masa lalu, uji masa depan, geser maju, ulangi. MAE untuk keputusan, MAPE untuk perbandingan.",
    },
    {
      id: "lab-walkforward",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: walk-forward empat lipatan, empat model",
      prose: [
        "Sekarang hitung sendiri. Data 16 minggu sudah diberikan. Empat lipatan menguji minggu 13 sampai 16, dengan train yang membesar tiap lipatan. Empat model: naive (prediksi sama dengan minggu lalu), seasonal naive (prediksi sama dengan empat minggu lalu), moving average 4 minggu, dan regresi lag-OLS — regresi linear di atas fitur lag 1 dan lag 4, yang cara kerjanya sama persis dengan tabel fitur XGBoost, hanya kepala modelnya linear, bukan pohon.",
        "Hitung dulu di kepala untuk lipatan pertama, minggu 13 dengan aktual 180. Naive memprediksi 183, error 3. Seasonal naive memprediksi 158, error 22. MA4 memprediksi rata-rata minggu 9 sampai 12, yaitu 170,25, error 9,75. Model lag-OLS memprediksi 178,49, error 1,51. Polanya berulang di empat lipatan dan menghasilkan MAE akhir: naive 9,00; musiman 20,00; MA4 12,50; lag-OLS 2,50.",
        "Perhatikan kenapa seasonal naive begitu buruk: tren naik 5,05 unit per minggu membuat nilai empat minggu lalu selalu ketinggalan sekitar 20 unit — errornya 22, 18, 18, dan 22. Dan kenapa lag-OLS menang: koefisien lag 4-nya sekitar 1,0 — ia belajar bahwa penjualan minggu ini kira-kira sama dengan empat minggu lalu ditambah kenaikan tren — ditambah koreksi kecil dari lag 1. MAPE-nya: naive 4,59 persen, lag-OLS 1,31 persen.",
        "Setelah lolos, coba eksperimen: ganti horizon menjadi 2 minggu dan lihat MAE lag-OLS memburuk — itulah pajak prediksi rekursif dari Langkah 4.",
      ],
      tasks: [
        { id: "t1", text: "Hitung prediksi naive, seasonal naive, dan MA4 untuk tiap lipatan minggu 13 sampai 16" },
        { id: "t2", text: "Implementasikan fit OLS pada fitur lag 1 dan lag 4 dengan persamaan normal, lalu prediksi tiap lipatan" },
        { id: "t3", text: "Hitung MAE keempat model dan cetak model terbaik" },
      ],
      expected: "lag-OLS MAE=2.50",
      hints: [
        "MA4 lipatan 1: rata-rata minggu 9 sampai 12 = (158 + 172 + 168 + 183) / 4 = 170,25.",
        "OLS: susun matriks normal 3x3 dari fitur 1, lag 1, lag 4, lalu selesaikan dengan eliminasi Gauss — pivot dipilih dengan max dan abs.",
        "MAE = rata-rata error absolut empat lipatan; bulatkan 2 desimal saat mencetak.",
      ],
      code: {
        starter: `data = [120, 132, 128, 145, 138, 152, 148, 163, 158, 172, 168, 183, 180, 190, 186, 205]\n\n# TULIS KODEMU: walk-forward 4 lipatan (uji minggu 13 sampai 16).\n# Model: naive, seasonal naive (lag 4), MA4, dan OLS pada fitur lag 1 dan lag 4.\n# Cetak MAE tiap model dengan 2 desimal, lalu nama model terbaik.\n\nmae_naive = 0.0\nmae_musiman = 0.0\nmae_ma4 = 0.0\nmae_lag = 0.0\n\nprint(f"naive MAE={mae_naive:.2f}")\nprint(f"musiman MAE={mae_musiman:.2f}")\nprint(f"MA4 MAE={mae_ma4:.2f}")\nprint(f"lag-OLS MAE={mae_lag:.2f}")\nprint("terbaik=lag-OLS")`,
        lockLines: 1,
        solution: `data = [120, 132, 128, 145, 138, 152, 148, 163, 158, 172, 168, 183, 180, 190, 186, 205]\n\n\ndef ols_fit(train):\n    rows = []\n    target = []\n    for t in range(4, len(train)):\n        rows.append([1.0, float(train[t - 1]), float(train[t - 4])])\n        target.append(float(train[t]))\n    n = 3\n    a = [[sum(rows[k][i] * rows[k][j] for k in range(len(rows))) for j in range(n)] for i in range(n)]\n    b = [sum(rows[k][i] * target[k] for k in range(len(rows))) for i in range(n)]\n    m = [a[i][:] + [b[i]] for i in range(n)]\n    for c in range(n):\n        p = max(range(c, n), key=lambda r: abs(m[r][c]))\n        m[c], m[p] = m[p], m[c]\n        for r in range(n):\n            if r != c:\n                f = m[r][c] / m[c][c]\n                for cc in range(c, n + 1):\n                    m[r][cc] -= f * m[c][cc]\n    return [m[i][n] / m[i][i] for i in range(n)]\n\n\nerr_naive = []\nerr_musiman = []\nerr_ma4 = []\nerr_lag = []\nfor i in range(12, 16):\n    aktual = data[i]\n    err_naive.append(abs(aktual - data[i - 1]))\n    err_musiman.append(abs(aktual - data[i - 4]))\n    err_ma4.append(abs(aktual - sum(data[i - 4:i]) / 4))\n    coef = ols_fit(data[:i])\n    pred = coef[0] + coef[1] * data[i - 1] + coef[2] * data[i - 4]\n    err_lag.append(abs(aktual - pred))\n\nmae_naive = round(sum(err_naive) / 4, 2)\nmae_musiman = round(sum(err_musiman) / 4, 2)\nmae_ma4 = round(sum(err_ma4) / 4, 2)\nmae_lag = round(sum(err_lag) / 4, 2)\n\nprint(f"naive MAE={mae_naive:.2f}")\nprint(f"musiman MAE={mae_musiman:.2f}")\nprint(f"MA4 MAE={mae_ma4:.2f}")\nprint(f"lag-OLS MAE={mae_lag:.2f}")\nprint("terbaik=lag-OLS")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "naive MAE=9\\.00\\nmusiman MAE=20\\.00\\nMA4 MAE=12\\.50\\nlag-OLS MAE=2\\.50\\nterbaik=lag-OLS", label: "Tabel MAE empat model sesuai hitungan", msg: "MAE: naive 9,00; musiman 20,00; MA4 12,50; lag-OLS 2,50. Periksa prediksi tiap lipatan — lipatan 1: naive 183, musiman 158, MA4 170,25." },
          { kind: "equal", task: "t3", name: "mae_lag", value: 2.5, tol: 0.01, label: "`mae_lag` = 2.50", msg: "Error lag-OLS per lipatan: 1,51; 3,04; 2,59; 2,85 — rata-rata 2,50." },
          { kind: "equal", task: "t1", name: "mae_naive", value: 9.0, tol: 0.01, label: "`mae_naive` = 9.00", msg: "Error naive per lipatan: 3, 10, 4, 19 — rata-rata 9,00." },
          { kind: "uses", task: "t2", token: "ols_fit", label: "Fungsi fit OLS dipakai", msg: "Fit OLS pada fitur lag 1 dan lag 4 lewat persamaan normal — panggil ols_fit tiap lipatan." },
        ],
      },
      reference: "MAE: naive 9,00; musiman 20,00; MA4 12,50; lag-OLS 2,50. MAPE: naive 4,59 persen; lag-OLS 1,31 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: pesan berapa untuk minggu 17?",
      prose: [
        "Gudang bertanya: berapa unit kopi sachet yang dipesan untuk minggu 17? Model lag-OLS yang dilatih ulang pada seluruh 16 minggu memprediksi 200,50 unit — koefisiennya 16,05 plus 0,017 kali 205 (lag 1) plus 1,0053 kali 180 (lag 4). Stok pengaman ditetapkan — sebagai HEURISTIK lesson ini, bukan formula — dua kali MAE, yaitu 5 unit, sehingga pesanan menjadi 205,50, dibulatkan ke atas menjadi 206 unit. Aturan '2 × MAE' di sini adalah heuristik praktis: stok pengaman yang benar butuh distribusi error, lead time, dan service level yang ditargetkan.",
        "Mengapa bukan memakai seasonal naive yang lebih sederhana? Karena MAE-nya 20,00 — stok pengamannya saja sudah 40 unit, dan forecastnya bias ke bawah secara sistematis karena tren naik. Model yang bias tidak diperbaiki oleh stok pengaman; ia hanya ditambal.",
        "Dan mengapa forecast minggu 17 sebesar 200,50 justru di bawah aktual minggu 16 sebesar 205? Karena koefisien lag 4 mendominasi: model membaca minggu 13 sebesar 180 sebagai jangkar musiman, lalu menambah kenaikan tren. Bila direksi protes karena angkanya turun, jawabanmu adalah tabel MAE lab: model ini meleset rata-rata 2,50 unit, sementara naive meleset 9,00. Kepercayaan datang dari validasi, bukan dari arah angkanya.",
        "Keputusan akhir: pesan 206 unit, catat forecast 200,50 dan MAE 2,50 di lembar keputusan, dan jadwalkan evaluasi ulang setelah minggu 17 aktual masuk — satu lipatan walk-forward baru, gratis.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Forecast minggu 17 = 200,50; stok pengaman 2 kali MAE 2,50 = 5 (heuristik — lihat Langkah 7); pesanan 205,50 dibulatkan ke atas menjadi 206 unit. Seasonal naive ditolak karena MAE 20,00 dan bias ke bawah sistematis sebesar 20 unit per lipatan.",
      },
      reference: "Pesan 206 unit = forecast 200,50 plus pengaman 5. Validasi walk-forward adalah alasan keputusannya.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Prophet = tren plus musiman plus libur; changepoint adalah tempat tren boleh patah.",
        "XGBoost butuh tabel fitur lag dan rolling; alignment mencegah leakage — fitur minggu t hanya memakai data sampai t minus 1.",
        "Walk-forward multi-lipatan: latih masa lalu, uji masa depan, geser maju, ulangi.",
        "Lab: MAE naive 9,00; musiman 20,00; MA4 12,50; lag-OLS 2,50 — MAPE naive 4,59 persen, lag-OLS 1,31 persen.",
        "MAE diterjemahkan menjadi stok pengaman: pesan 206 unit untuk minggu 17.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Kenapa XGBoost dengan train test split acak melaporkan MAPE 2,1 persen tetapi error aktualnya 38 persen?",
          options: [
            { text: "Karena XGBoost tidak cocok untuk data deret waktu", why: "Salah: XGBoost bisa dipakai untuk deret waktu bila fiturnya lag dan rolling — yang rusak di cerita ini adalah evaluasinya, bukan algoritmanya." },
            { text: "Karena split acak membiarkan masa depan masuk training — model menghafal, bukan meramal", why: "Tepat: inilah temporal leakage. Validasi deret waktu wajib walk-forward: latih masa lalu, uji masa depan.", correct: true },
            { text: "Karena MAPE selalu lebih kecil dari error aktual", why: "Salah: MAPE adalah rata-rata error persen pada data yang sama. Selisih sebesar ini menandakan kebocoran, bukan sifat metrik." },
            { text: "Karena data 16 minggu terlalu sedikit untuk XGBoost", why: "Salah: data pendek memang melemahkan XGBoost, tetapi tidak menjelaskan MAPE 2,1 persen yang berubah menjadi 38 persen — itu pola leakage." },
          ],
        },
        {
          q: "Fitur rolling mean 4 minggu untuk baris minggu t dihitung dari minggu t minus 3 sampai t. Apa masalahnya?",
          options: [
            { text: "Tidak ada — rolling mean memang memakai minggu t", why: "Salah: memakai minggu t berarti memakai jawaban yang sedang diramal. Itu leakage." },
            { text: "Leakage: fitur memakai data minggu t yang belum tersedia saat prediksi dibuat", why: "Tepat: alignment menuntut fitur minggu t hanya memakai data sampai t minus 1.", correct: true },
            { text: "Rolling mean harus memakai 12 minggu, bukan 4", why: "Salah: panjang jendela adalah pilihan desain, bukan sumber leakage. Masalahnya adalah ujung jendela yang menyentuh minggu t." },
            { text: "Rolling mean tidak boleh dipakai bersama fitur lag", why: "Salah: lag dan rolling justru pasangan standar — lag menangkap titik, rolling menangkap level. Keduanya sah bila alignment-nya benar." },
          ],
        },
        {
          q: "Dalam lab, seasonal naive MAE 20,00 — jauh lebih buruk dari naive 9,00. Penjelasan yang benar?",
          options: [
            { text: "Seasonal naive selalu lebih buruk dari naive", why: "Salah: di data musiman kuat tanpa tren, seasonal naive sering menang. Hasil di sini disebabkan tren, bukan sifat metode." },
            { text: "Tren naik 5,05 unit per minggu membuat nilai empat minggu lalu selalu ketinggalan sekitar 20 unit", why: "Tepat: errornya 22, 18, 18, 22 — bias ke bawah yang sistematis, bukan noise.", correct: true },
            { text: "Lag 4 terlalu pendek untuk musiman mingguan", why: "Salah: lag 4 adalah satu siklus bila pola berulang tiap 4 minggu. Masalahnya adalah tren, bukan panjang lag." },
            { text: "Seasonal naive tidak memakai data training sama sekali", why: "Salah: ia memakai satu titik training — nilai empat minggu lalu. Ia kalah karena titik itu sudah usang oleh tren." },
          ],
        },
        {
          q: "Kapan Prophet lebih tepat daripada XGBoost untuk forecasting?",
          options: [
            { text: "Bila ada banyak pendorong eksternal dan interaksinya penting", why: "Salah: itu wilayah XGBoost — pohon belajar interaksi antar fitur. Prophet unggul di musiman yang stabil dan efek kalender." },
            { text: "Bila musiman kuat dan berulang, ada efek libur yang jelas, dan forecast harus bisa dijelaskan dalam satu slide", why: "Tepat: dekomposisi aditif Prophet membuat tiap komponen bisa dibaca dan diperdebatkan.", correct: true },
            { text: "Bila deret hanya punya 20 titik dan tidak ada musiman", why: "Salah: deret pendek tanpa musiman lebih cocok untuk ARIMA atau naive — Prophet butuh cukup data untuk mengestimasi musimannya." },
            { text: "Selalu — Prophet adalah pengganti universal ARIMA dan XGBoost", why: "Salah: tidak ada model universal. Prophet kalah bila pendorong eksternal dan interaksinya yang menentukan." },
          ],
        },
        {
          q: "Gudang memakai MAE 2,50 untuk menetapkan stok pengaman 5 unit. Apa logika di balik angka 5?",
          options: [
            { text: "5 adalah dua kali MAE — pengaman menutup sekitar dua kali rata-rata meleset model", why: "Tepat: stok pengaman 2 kali MAE = 5 unit, sehingga pesanan minggu 17 menjadi 206 unit.", correct: true },
            { text: "5 adalah MAPE model dalam persen", why: "Salah: MAPE lag-OLS adalah 1,31 persen, bukan 5. Pengaman dihitung dari MAE, bukan MAPE." },
            { text: "5 adalah selisih forecast minggu 17 dan aktual minggu 16", why: "Salah: selisih itu 205 minus 200,50 = 4,50 — dekat tetapi bukan 5, dan bukan itu logikanya." },
            { text: "5 adalah jumlah lipatan walk-forward ditambah satu", why: "Salah: lipatannya 4, dan pengaman tidak ada hubungannya dengan jumlah lipatan." },
          ],
        },
      ],
    },
  ],
};
