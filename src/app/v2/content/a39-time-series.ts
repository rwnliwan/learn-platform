import type { V2Lesson } from "../lib/types";

export const a39: V2Lesson = {
  slug: "a39-time-series",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.9 Time Series: Meramal dari Gema Masa Lalu",
  estMinutes: 80,
  steps: [
    {
      id: "cerita-spurious",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Korelasi 0,99 yang tidak berarti apa-apa",
      prose: [
        "Tahun 1974, Clive Granger dan Paul Newbold mempublikasikan temuan menggemparkan: mereka meregresikan dua random walk independen (deret acak yang tidak berhubungan sama sekali) satu sama lain. Hasilnya? Korelasi 0,99, R kuadrat tinggi, t-statistik sangat signifikan. Menurut semua metrik regresi, ini hubungan yang luar biasa kuat.",
        "Padahal kedua deret dibangkitkan dari koin yang dilempar terpisah — tidak ada hubungan sama sekali. Inilah regresi lancung (spurious regression): dua deret non-stasioner yang sama-sama berjalan terlihat berhubungan hanya karena keduanya bergerak seiring waktu. Semua uji signifikansi rusak di sini — distribusi t-statistiknya bahkan bukan distribusi-t lagi.",
        "Granger kemudian memenangkan Nobel (2003) sebagian untuk kointegrasi — konsep bahwa dua deret non-stasioner bisa punya hubungan jangka panjang yang bermakna. Jadi korelasi antar deret waktu bukan selalu bohong — tapi kamu butuh peralatan khusus untuk membedakan yang asli dari yang lancung.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regresi lancung di data makro/finansial menghasilkan hubungan palsu yang terlihat signifikan — keputusan dari situ adalah keputusan dari noise yang berdasi.",
      },
      reference: "Deret waktu butuh peralatan khusus: stasioneritas dulu, baru regresi.",
    },
    {
      id: "lab-adf",
      eyebrow: "Langkah 2 · Lab: stasioneritas",
      title: "Syarat masuk dunia time series",
      prose: [
        "Deret stasioner: mean, variansi, dan kovarians antar lag konstan sepanjang waktu — hubungan yang stabil, syarat regresi DERET WAKTU yang valid (bukan syarat regresi secara umum: regresi cross-section tidak butuh stasioneritas — yang butuh adalah inferensi pada data berurutan waktu). Lawannya: unit root (random walk) — deret berjalan tanpa kembali; dan tren deterministik — mean-nya bergerak.",
        "Uji ADF (disederhanakan): regresikan perubahan dy ke level lag-nya; jika koefisien b negatif signifikan (t < −2,86), tolak unit root = stasioner. Angka −2,86 adalah nilai kritis 5% ASIMTOTIK untuk spesifikasi ADF dengan intersep TANPA tren (lab ini n=300, jadi −2,86 sudah cukup dekat; untuk sampel kecil nilai kritisnya sedikit lebih negatif — dan dengan tren, nilainya berubah total, sekitar −3,41). Di bawah: AR(1) phi=0,7 vs random walk phi=1,0 vs tren. Hitung t-stat masing-masing dan putuskan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `t_ar` (AR(1) phi=0.7) via `adf_simple`" },
        { id: "t2", text: "Hitung `t_rw` (random walk), lalu `print`" },
      ],
      expected: "t_ar=-6.46 t_rw=-2.30",
      note: {
        title: "Sering salah",
        body: "Langsung fit ARMA tanpa uji stasioneritas. Gagal menolak unit root (t > −2,86 pada spesifikasi ADF intersep-tanpa-tren ini) berarti differencing dulu — atau detrending jika trennya deterministik. Obatnya beda.",
      },
      hints: [
        "adf_simple(y) mengembalikan (b, t).",
        "Kritis kasar ADF 5% = -2.86 (asimtotik, intersep tanpa tren); t < -2.86 berarti stasioner.",
        "b_ar, t_ar = adf_simple(make_ar1(300, 0.7))",
      ],
      code: {
        starter: `import random, math\nrandom.seed(23)\n\ndef make_ar1(n, phi, sigma=1.0):\n    ys = [0.0]\n    for _ in range(n-1):\n        ys.append(phi*ys[-1] + random.gauss(0, sigma))\n    return ys\n\ndef adf_simple(y):\n    dy = [y[i]-y[i-1] for i in range(1, len(y))]\n    yl = y[:-1]\n    n = len(dy)\n    mx = sum(yl)/n; my = sum(dy)/n\n    sxx = sum((v-mx)**2 for v in yl)\n    b = sum((a-mx)*(c-my) for a, c in zip(yl, dy))/sxx\n    a = my - b*mx\n    resid = [c-(a+b*v) for v, c in zip(yl, dy)]\n    s2 = sum(r**2 for r in resid)/(n-2)\n    se_b = math.sqrt(s2/sxx)\n    return b, b/se_b\n\n# TULIS KODEMU: t-stat ADF untuk AR(1) stasioner vs random walk\nb_ar, t_ar = \nb_rw, t_rw = \n\nprint(f"t_ar={t_ar:.2f} t_rw={t_rw:.2f}")`,
        lockLines: 20,
        solution: `import random, math\nrandom.seed(23)\n\ndef make_ar1(n, phi, sigma=1.0):\n    ys = [0.0]\n    for _ in range(n-1):\n        ys.append(phi*ys[-1] + random.gauss(0, sigma))\n    return ys\n\ndef adf_simple(y):\n    dy = [y[i]-y[i-1] for i in range(1, len(y))]\n    yl = y[:-1]\n    n = len(dy)\n    mx = sum(yl)/n; my = sum(dy)/n\n    sxx = sum((v-mx)**2 for v in yl)\n    b = sum((a-mx)*(c-my) for a, c in zip(yl, dy))/sxx\n    a = my - b*mx\n    resid = [c-(a+b*v) for v, c in zip(yl, dy)]\n    s2 = sum(r**2 for r in resid)/(n-2)\n    se_b = math.sqrt(s2/sxx)\n    return b, b/se_b\n\n# TULIS KODEMU: t-stat ADF untuk AR(1) stasioner vs random walk\nb_ar, t_ar = adf_simple(make_ar1(300, 0.7))\nb_rw, t_rw = adf_simple(make_ar1(300, 1.0))\n\nprint(f"t_ar={t_ar:.2f} t_rw={t_rw:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "t_ar", value: -6.46, tol: 0.05, label: "`t_ar` sekitar -6.46", msg: "-6,46 < -2,86: tolak unit root — stasioner." },
          { kind: "equal", task: "t2", name: "t_rw", value: -2.30, tol: 0.05, label: "`t_rw` sekitar -2.30", msg: "-2,30 > -2,86: gagal menolak — non-stasioner, differencing dulu." },
          { kind: "stdout_matches", task: "t2", pattern: "t_ar=-6\\.46\\s+t_rw=-2\\.30", label: "`print` menampilkan kedua t-stat", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ADF (intersep, tanpa tren; asimtotik 5%): t < -2.86 -> stasioner. Jika tidak: differencing (stokastik) / detrending (deterministik).",
    },
    {
      id: "arma",
      eyebrow: "Langkah 3 · AR, MA, ARMA",
      title: "Dua cara masa lalu menggema",
      prose: [
        "AR(p): nilai hari ini = kombinasi linear p nilai sebelumnya + shock. Gema nilai masa lalu — momentum. MA(q): nilai hari ini = kombinasi q shock sebelumnya. Gema kejutan masa lalu — koreksi.",
        "ARMA menggabungkan keduanya untuk deret yang sudah stasioner. ARIMA(p,d,q) menambah d = berapa kali differencing agar stasioner. Resep lengkap: uji stasioneritas, differencing minimal (biasanya 0 atau 1), identifikasi p dan q, estimasi, cek residual.",
        "Peringatan overdifferencing: differencing deret yang sudah stasioner menciptakan autokorelasi MA(1) buatan dan membuang informasi level — mengobati orang sehat. Pilih d minimal agar stasioner.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Differencing berkali-kali karena merasa lebih aman. Setiap differencing membuang informasi level; deret stasioner yang di-difference justru menjadi non-invertible.",
      },
      reference: "AR = gema nilai. MA = gema shock. d = minimal agar stasioner.",
    },
    {
      id: "lab-interval",
      eyebrow: "Langkah 4 · Lab: forecast & interval",
      title: "Interval melebar seiring horizon",
      prose: [
        "Identifikasi orde: ACF meluruh bertahap + PACF terpotong setelah lag 2 = AR(2) — yang terpotong menunjukkan orde AR. (MA(q): ACF yang terpotong di lag q.) Bandingkan kandidat dengan AIC; residual model yang sehat = white noise (ACF residual tidak signifikan).",
        "Hasil estimasi ARIMA(1,1,1) di data return: phi = +0,062 (momentum), theta = -0,003 (koreksi shock), sigma = 1,333. Forecast 5 langkah: 124,54 / 124,75 / 124,96 / 125,17 / 125,39 — dengan interval 95 persen yang melebar.",
        "Tugasmu: hitung setengah-lebar interval di h=1 dan h=5 dengan pendekatan w = sigma x 1,96 x akar(h). Lihat sendiri betapa cepat ketidakpastian tumbuh.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `w1` = setengah-lebar interval h=1" },
        { id: "t2", text: "Hitung `w5` = setengah-lebar interval h=5, lalu `print`" },
      ],
      expected: "w1=2.61 w5=5.84",
      note: {
        title: "Sering salah",
        body: "Menyajikan forecast 12 bulan sebagai satu garis tanpa interval. Garis tanpa interval = setengah kebohongan — pembaca tidak tahu forecast jauh hampir tak informatif.",
      },
      hints: [
        "w = sigma * 1.96 * akar(h).",
        "sigma = 1.333 dari estimasi.",
        "w1 = 1.333 * 1.96 * math.sqrt(1)",
      ],
      code: {
        starter: `import math\n\nsigma = 1.333   # dari estimasi ARIMA(1,1,1)\n\n# TULIS KODEMU: setengah-lebar interval 95% di horizon 1 dan 5\nw1 = \nw5 = \n\nprint(f"w1={w1:.2f} w5={w5:.2f}")`,
        lockLines: 3,
        solution: `import math\n\nsigma = 1.333   # dari estimasi ARIMA(1,1,1)\n\n# TULIS KODEMU: setengah-lebar interval 95% di horizon 1 dan 5\nw1 = sigma * 1.96 * math.sqrt(1)\nw5 = sigma * 1.96 * math.sqrt(5)\n\nprint(f"w1={w1:.2f} w5={w5:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w1", value: 2.61, tol: 0.03, label: "`w1` sekitar 2.61", msg: "1,333 x 1,96 x 1 = 2,61." },
          { kind: "equal", task: "t2", name: "w5", value: 5.84, tol: 0.03, label: "`w5` sekitar 5.84", msg: "1,333 x 1,96 x akar(5) = 5,84 — lebih dari 2x lipat h=1." },
          { kind: "stdout_matches", task: "t2", pattern: "w1=2\\.61\\s+w5=5\\.84", label: "`print` menampilkan pelebaran", msg: "Ketidakpastian tumbuh proporsional akar(h)." },
        ],
      },
      reference: "Interval melebar ~ akar(h). Forecast jauh = hampir tak informatif.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 5 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 4. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dua random walk independen diregresikan: R kuadrat = 0,9, t-statistik signifikan. Kesimpulan?",
          options: [
            { text: "Hubungan kuat ditemukan", why: "Salah. Itu justru jebakannya." },
            { text: "Regresi lancung — dua deret non-stasioner bisa terlihat berhubungan tanpa hubungan nyata; uji kointegrasi dulu", why: "Benar. Granger-Newbold (1974).", correct: true },
            { text: "Butuh lebih banyak data", why: "Salah. Data lebih banyak tidak memperbaiki non-stasioneritas." },
            { text: "Ganti ke regresi logistik", why: "Salah. Tidak relevan dengan masalahnya." },
          ],
        },
        {
          q: "ACF meluruh bertahap, PACF terpotong setelah lag 2. Model?",
          options: [
            { text: "MA(2)", why: "Salah. Itu jika ACF yang terpotong." },
            { text: "AR(2) — yang terpotong (PACF) menunjukkan orde AR", why: "Benar.", correct: true },
            { text: "ARMA(2,2)", why: "Salah. Tidak ada indikasi komponen MA." },
            { text: "White noise", why: "Salah. White noise tidak punya pola ACF." },
          ],
        },
      ],
      reference: "Non-stasioner -> regresi lancung. Terpotong di PACF -> orde AR.",
    },
    {
      id: "walkforward",
      eyebrow: "Langkah 6 · Validasi walk-forward",
      title: "Random CV dilarang untuk data waktu",
      prose: [
        "Validasi time series = walk-forward: latih di masa lalu, uji di masa depan, geser maju, ulangi. Random CV mencampur masa depan ke training — temporal leakage yang dilembagakan: validasi yang secara sistematis membiarkan model belajar dari masa depan sebelum diuji di masa lalu.",
        "ARIMA buta terhadap perubahan struktural: jika resesi datang, forecast yang meluruh ke mean tidak berguna. Untuk keputusan seperti cadangan, lengkapi forecast dengan skenario stres — jangan hanya titik tengah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Forecast tanpa interval dan tanpa skenario stres membuat perencanaan modal bertumpu pada satu garis yang rapuh.",
      },
      reference: "Walk-forward selalu. Interval selalu. Stress test untuk keputusan modal.",
    },
    {
      id: "mini-case-npl",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Forecast NPL kuartalan",
      prose: [
        "Bank memintamu forecast NPL 4 kuartal ke depan untuk perencanaan modal. Data: NPL kuartalan 2016-2024 (36 observasi). Temuanmu: ADF t = -1,9 (gagal menolak unit root); setelah differencing 1x: t = -4,2 (stasioner). ACF/PACF data differenced: pola AR(1). AIC terkecil: ARIMA(1,1,1). Forecast: Q1 3,2% [2,4-4,0], Q2 3,0% [1,9-4,1], Q3 2,9% [1,5-4,3], Q4 2,8% [1,1-4,5]. Direksi: bagus, NPL turun ke 2,8 persen — kita bisa kurangi cadangan.",
        "Yang benar dari analisismu: prosedur textbook yang baik — uji stasioneritas, differencing tepat 1x (tidak overdifferencing), identifikasi orde, forecast dengan interval. Yang berbahaya dari kesimpulan direksi: pertama, mereka membaca titik forecast (2,8%) dan mengabaikan interval ([1,1-4,5]) — di Q4, NPL 4,5% masih sangat mungkin; mengurangi cadangan dari titik tengah adalah judi.",
        "Kedua, ARIMA buta perubahan struktural — jika resesi datang, forecast meluruh-ke-mean ini tidak berguna; butuh skenario stres. Yang kamu sampaikan: angka 2,8% adalah tengah dari rentang 1,1-4,5%. Perencanaan modal yang prudent memakai batas atas interval atau skenario stres, bukan titik tengah. Dan forecast ini mengasumsikan tidak ada perubahan struktural.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mengurangi cadangan dari titik tengah forecast berarti berjudi dengan modal bank. Keputusan prudent memakai batas atas interval atau stress test.",
      },
      reference: "Titik tengah untuk cerita; batas atas + stres untuk keputusan modal.",
    },
    {
      id: "pendalaman-acf-kointegrasi",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Sidik jari ACF/PACF, kointegrasi & patahan struktural",
      prose: [
        "ACF dan PACF adalah sidik jari proses stokastik. AR(p): ACF meluruh bertahap (eksponensial atau sinusoidal teredam), PACF terpotong setelah lag p — yang terpotong menunjukkan orde AR. MA(q): kebalikannya — ACF terpotong di lag q, PACF meluruh. ARMA: keduanya meluruh. Tapi sidik jari hanya bisa dibaca pada deret yang SUDAH stasioner — identifikasi orde sebelum differencing yang benar adalah membaca sidik jari dari tangan yang salah.",
        "Untuk AR(1), peluruhan itu punya rumus eksak: rho_k = phi^k. Dengan phi=0,7: lag-1 = 0,70, lag-2 = 0,49, lag-3 = 0,34 — geometris menurun. Inilah yang kamu lihat sebagai batang-batang ACF yang makin pendek. Bila ACF-mu meluruh jauh lebih lambat dari geometris — nyaris datar di banyak lag — curigai unit root: itu bukan AR stasioner, itu random walk yang menyamar.",
        "Kointegrasi (Granger, Nobel 2003): dua deret non-stasioner bisa punya kombinasi linear yang stasioner — hubungan jangka panjang yang bermakna di tengah bahaya regresi lancung. Contoh: harga spot dan forward, atau PD portofolio dan suku bunga. Uji Engle-Granger dua langkah: regresikan level-nya, lalu uji ADF pada residual — residual stasioner berarti terkointegrasi. Tanpa ini, regresi antar deret non-stasioner = undian berlisensi statistik.",
        "Patahan struktural: parameter berubah di tengah jalan — krisis 2008, COVID-19, perubahan regulasi. ARIMA yang di-fit di seluruh periode adalah rata-rata dua rezim: salah di keduanya. Deteksi: uji Chow (break diketahui) atau CUSUM (break tidak diketahui). Respons: dummy patahan, atau model terpisah per rezim. Aturan keputusan: forecast dari model yang mengabaikan patahan yang sudah diketahui = forecast yang sengaja buta. Untuk keputusan modal, selalu tanya: apakah rezim hari ini sama dengan rezim data latih?",
      ],
      formula: String.raw`\rho_k = \phi^k`,
      formulaNote: "rho_k = autokorelasi lag-k; phi = koefisien AR(1), |phi|<1 untuk stasioner. Contoh: phi=0,7 → rho_1=0,70, rho_2=0,49, rho_3=0,34 — luruh geometris, pola khas AR(1) di plot ACF. ACF yang nyaris datar di banyak lag = curigai unit root.",
      tasks: [],
      reference: "Sidik jari dibaca setelah stasioner. Kointegrasi = hubungan jangka panjang antar I(1). Break diketahui = jangan dirata-rata.",
    },
    {
      id: "gap-g12-stasioner-lemah-ketat",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G12)",
      title: "Stasioner lemah vs stasioner ketat: apa yang sebenarnya dijanjikan",
      prose: [
        "Dua definisi stasioneritas yang sering dicampur. Stasioner ketat (strict stationarity): SELURUH distribusi bersama tidak berubah saat digeser waktu — mean, varians, skewness, kurtosis, dan semua momen bersama, hari ini dan sepuluh tahun lagi, identik. Stasioner lemah (weak stationarity, covariance stationarity): hanya tiga janji — mean konstan, varians konstan, dan autokovarians hanya bergantung pada jarak lag, bukan pada waktu absolut. ARIMA, dan hampir semua alat deret waktu praktis, hanya butuh yang lemah.",
        "Hubungannya satu arah: ketat berimplikasi lemah (asal momen kedua ada — distribusi Cauchy yang tidak punya varians adalah pengecualian yang mengingatkan bahwa implikasi ini butuh momen hingga). Lemah TIDAK berimplikasi ketat. Contoh yang membedakan: misalkan X_t = s_t × ε_t, dengan ε_t galat baku yang miring (skewness positif) dan s_t = +1 di t genap, −1 di t ganjil. Mean tetap 0, varians tetap 1, autokovarians tetap 0 — lemah terpenuhi sempurna. Tetapi skewness X_t berganti tanda tiap periode: +γ di t genap, −γ di t ganjil — distribusinya berubah, jadi TIDAK ketat. Proses yang lolos uji stasioneritas lemah masih bisa punya perilaku ekstrem yang berubah-ubah menurut waktu.",
        "Kasus istimewa yang menyederhanakan hidup: bila prosesnya Gaussian, lemah = ketat — distribusi Gaussian sepenuhnya ditentukan mean dan kovarians, jadi tiga janji lemah sudah mengunci seluruh distribusi. Itulah alasan banyak teks terasa longgar memakai keduanya bergantian: mereka diam-diam mengasumsikan Gaussian. Di data keuangan — return saham yang berekor tebal dan miring — asumsi itu tidak berlaku, dan perbedaannya penting: interval prediksi ARIMA yang mengasumsikan Gaussian bisa meremehkan ekor bila prosesnya hanya lemah-stasioner.",
      ],
      formula: String.raw`\text{Lemah: } E[X_t] = \mu,\ Var(X_t) = \sigma^2,\ Cov(X_t, X_{t+h}) = \gamma_h \qquad \text{Ketat: } F_{t_1,\dots,t_k} = F_{t_1+\tau,\dots,t_k+\tau}`,
      formulaNote: "Ketat mengunci seluruh distribusi bersama; lemah hanya mengunci mean, varians, dan autokovarians.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira lolos uji ADF berarti deret stasioner ketat. ADF hanya menguji akar unit — soal mean dan varians jangka panjang — dan tidak menyentuh skewness atau perilaku ekor yang berubah menurut waktu. Untuk risk, yang berbahaya justru yang tidak diuji itu.",
      },
      quiz: [
        {
          q: "Proses punya mean, varians, dan autokovarians konstan, tapi skewness-nya berganti tanda tiap periode. Statusnya?",
          options: [
            { text: "Stasioner lemah, tetapi tidak stasioner ketat", why: "Tepat: tiga janji lemah terpenuhi; distribusi berubah karena skewness — ketat gagal.", correct: true },
            { text: "Stasioner ketat, tetapi tidak stasioner lemah", why: "Salah: arah implikasinya kebalik — ketat berimplikasi lemah, bukan sebaliknya." },
            { text: "Tidak stasioner sama sekali", why: "Salah: lemah terpenuhi; jangan buang istilah yang tepat." },
            { text: "Stasioner ketat karena autokovarians konstan sudah cukup", why: "Salah: autokovarians hanya satu dari tiga janji lemah — ketat menuntut seluruh distribusi." },
          ],
        },
      ],
      reference: "Stasioner lemah = mean, varians, autokovarians konstan. Stasioner ketat = seluruh distribusi bersama invarian waktu. Ketat berimplikasi lemah; Gaussian menyamakan keduanya.",
    },
    {
      id: "gap-g13-batas-adf-kpss-pp",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G13)",
      title: "Batas ADF, KPSS, dan PP — dan apa alternatifnya",
      prose: [
        "Tiga uji akar unit paling populer, tiga kelemahan yang berbeda — dan kesalahan paling umum adalah membaca hasilnya seolah mereka menguji hal yang sama. ADF (Augmented Dickey-Fuller): hipotesis nol = ada akar unit (tidak stasioner). Kelemahan utamanya: power rendah — bila proses hampir punya akar unit (misal AR(1) dengan φ = 0,95), ADF sering gagal menolak nol walau deret sebenarnya stasioner; dan hasil peka terhadap jumlah lag yang dipilih. Dengan galat MA yang kuat, ukuran uji (size) juga terdistorsi — menolak nol lebih sering dari yang seharusnya.",
        "KPSS: kebalikannya — hipotesis nol = stasioner. Itu justru kekuatannya bila dipakai BERPASANGAN dengan ADF (confirmatory analysis): ADF menolak + KPSS tidak menolak = stasioner (yakin). ADF tidak menolak + KPSS menolak = ada akar unit (yakin). Keduanya menolak atau keduanya tidak menolak = data tidak memberi jawaban — jangan paksa vonis. Kelemahan KPSS: sangat peka terhadap pilihan bandwidth dan mudah menolak stasioneritas bila ada patahan struktural yang tidak dimodelkan. PP (Phillips-Perron): seperti ADF tapi mengoreksi heteroskedastisitas dan autokorelasi secara nonparametrik — tanpa perlu memilih lag. Harganya: distorsi ukuran pada sampel kecil, terutama dengan galat MA negatif yang besar.",
        "Alternatif bila ketiganya meragukan: DF-GLS (ADF dengan detrending GLS — power lebih tinggi, standar untuk sampel menengah); Zivot-Andrews bila dicurigai ada patahan struktural (menguji akar unit sambil mengizinkan satu break endogen — break yang diabaikan membuat ADF bias ke arah tidak menolak); dan variance ratio test bila yang diuji adalah random walk murni. Aturan praktis: jangan pernah vonis stasioneritas dari satu uji — laporkan ADF + KPSS + satu alternatif, dan bila ketiganya tidak sepakat, nyatakan ketidaksepakatan itu sebagai temuan, bukan sebagai kegagalan.",
      ],
      formula: String.raw`\text{ADF } H_0\text{: akar unit} \qquad \text{KPSS } H_0\text{: stasioner} \qquad \text{Keduanya = confirmatory analysis}`,
      formulaNote: "ADF menolak + KPSS tidak menolak = stasioner. ADF tidak menolak + KPSS menolak = akar unit. Selain itu = tidak ada jawaban.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membaca ADF tidak-menolak sebagai bukti ada akar unit. Gagal menolak nol bukan membuktikan nol — dengan power rendah, ADF yang tidak menolak sering berarti datanya terlalu pendek atau φ-nya terlalu dekat ke 1 untuk dibedakan. Itulah gunanya pasangan KPSS.",
      },
      quiz: [
        {
          q: "ADF tidak menolak akar unit, KPSS menolak stasioneritas. Kesimpulan?",
          options: [
            { text: "Ada akar unit — kedua uji sepakat dari arah yang berlawanan", why: "Tepat: ADF tidak menolak H0 akar unit DAN KPSS menolak H0 stasioner — confirmatory analysis menyimpulkan tidak stasioner.", correct: true },
            { text: "Stasioner — ADF tidak menolak berarti aman", why: "Salah: gagal menolak bukan bukti; dan KPSS justru menolak stasioneritas." },
            { text: "Tidak ada jawaban — uji-ujinya bertentangan", why: "Salah: mereka tidak bertentangan; keduanya menunjuk arah yang sama (tidak stasioner)." },
            { text: "Perlu uji PP dulu sebelum vonis apa pun", why: "Salah: PP tidak menyelesaikan apa pun di sini — kedua uji sudah sepakat." },
          ],
        },
      ],
      reference: "ADF lemah power-nya dekat unit root; KPSS H0-nya stasioner (pasangan ADF); PP robust tapi terdistorsi di sampel kecil; alternatif: DF-GLS, Zivot-Andrews, variance ratio.",
    },
    {
      id: "gap-g14-interval-arima-parameter",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G14)",
      title: "Interval prediksi ARIMA vs ketidakpastian parameter",
      prose: [
        "Interval prediksi ARIMA yang keluar dari software hanya menghitung SATU sumber ketidakpastian: galat inovasi masa depan. Ia mengasumsikan parameter model (φ, θ, σ) diketahui persis — padahal semuanya diestimasi dari sampel berhingga, dengan standard error sendiri. Akibatnya interval yang dilaporkan terlalu sempit, dan semakin kecil sampel, semakin besar kebohongan itu. Interval nominal 95% bisa meliput nilai sebenarnya hanya 80-an persen pada sampel kecil.",
        "Contoh AR(1) dengan φ = 0,7 dan σ = 1. Ramalan 1 langkah ke depan: varians galat ramalan = σ² = 1, setengah-lebar interval 95% = 1,96 × 1 = 1,96. Ramalan 2 langkah: varians = σ²(1 + φ²) = 1,49, setengah-lebar = 1,96 × 1,22 = 2,39 — interval melebar karena ketidakpastian menumpuk. Tetapi kedua angka itu mengasumsikan φ = 0,7 persis. Bila φ diestimasi dengan standard error 0,08, ketidakpastian parameter menambah varians ramalan — dan pelebarannya membesar dengan horizon: pada horizon panjang, sedikit kesalahan φ terakumulasi lewat pangkat φ^h.",
        "Cara yang benar: bootstrap parametrik atau Bayesian. Bootstrap: simulasikan banyak deret dari parameter yang diestimasi, fit ulang model pada tiap simulasi, kumpulkan ramalannya — sebaran ramalan itu sudah memuat ketidakpastian parameter. Hasilnya interval yang lebih lebar dan jujur, terutama pada horizon jauh dan sampel pendek. Aturan praktis: bila n di bawah 100 atau horizon di atas 6, jangan laporkan interval software mentah-mentah — sebutkan bahwa ia mengabaikan ketidakpastian parameter, atau laporkan versi bootstrap-nya.",
      ],
      formula: String.raw`\text{Var}(e_{h}) = \sigma^2 \sum_{j=0}^{h-1} \psi_j^2 \quad (\psi_0 = 1) \qquad \text{+ ketidakpastian } \hat{\phi}, \hat{\theta} \text{ (diabaikan software)}`,
      formulaNote: "AR(1) φ=0,7: h=1 setengah-lebar 1,96; h=2 setengah-lebar 2,39 — sebelum ketidakpastian parameter ditambahkan.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan modal yang memakai interval ARIMA mentah meremehkan risiko. Interval yang terlalu sempit membuat skenario buruk tampak mustahil — padahal ia hanya tidak dihitung. Untuk horizon panjang, laporkan interval bootstrap yang memuat ketidakpastian parameter.",
      },
      quiz: [
        {
          q: "Interval prediksi ARIMA 95% dari software meliput nilai sebenarnya hanya 82% pada sampel kecil. Penjelasan yang benar?",
          options: [
            { text: "Interval software hanya memuat ketidakpastian inovasi — ketidakpastian estimasi parameter diabaikan", why: "Tepat: φ, θ, σ diestimasi dengan error; interval yang mengabaikannya terlalu sempit.", correct: true },
            { text: "Model ARIMA-nya salah orde — ganti orde dan liputan kembali 95%", why: "Salah: orde yang benar pun tetap punya ketidakpastian parameter; ini bukan soal orde." },
            { text: "Galat inovasinya tidak normal — normalitas adalah satu-satunya penyebab", why: "Salah: non-normalitas bisa berkontribusi, tapi penyebab utamanya adalah parameter yang diestimasi." },
            { text: "Interval 95% memang dirancang meliput 82% pada sampel kecil", why: "Salah: nominal 95% berarti dirancang meliput 95% bila semua asumsi terpenuhi — termasuk parameter diketahui." },
          ],
        },
      ],
      reference: "Interval ARIMA software = ketidakpastian inovasi saja; ketidakpastian parameter (φ, θ, σ) diabaikan — pakai bootstrap parametrik, terutama n kecil dan horizon jauh.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: deret waktu adalah regresi yang punya memori",
        body: "Deret waktu adalah regresi yang punya memori — dan memori merusak semua peralatan yang mengasumsikan observasi independen. Tiga heuristik. Pertama: selalu plot dulu sebelum uji. Mata menangkap tren, musiman, dan patahan struktural yang sering lolos dari uji formal — dan bentuk plot memberi tahu obatnya (differencing untuk tren stokastik, detrending untuk deterministik). Kedua: stasioneritas bukan tujuan, melainkan tiket masuk. Tanpa itu, semua uji signifikansi berbohong dengan sopan — seperti kasus regresi lancung di cerita pembuka. Ketiga: forecast adalah pernyataan tentang ketidakpastian, bukan tentang titik. Interval yang melebar seiring horizon adalah kejujuran, bukan kelemahan model; garis tanpa interval adalah setengah kebohongan. Aturan praktis: bila forecast-mu nyaris tidak berubah saat 2 tahun data tertua dibuang, curigai dua kemungkinan — datamu tidak stasioner sehingga model hanya menghafal level, atau modelmu tidak belajar dinamika apa-apa. Keduanya alasan untuk kembali ke plot, bukan untuk percaya garis.",
      },
      summary: [
        "Deret non-stasioner + regresi = regresi lancung. Uji stasioneritas dulu (ADF).",
        "AR = gema nilai; MA = gema shock; d = differencing minimal agar stasioner.",
        "Identifikasi orde: yang terpotong di PACF = orde AR; di ACF = orde MA. Bandingkan dengan AIC.",
        "Interval forecast melebar ~ akar(h) — wajib sertakan; forecast jauh hampir tak informatif.",
        "Validasi walk-forward; random CV dilarang. Lengkapi dengan stress test untuk keputusan modal.",
      ],
      next: { label: "B1 — Aksioma Peluang", href: "/v2/learn/b1-aksioma-peluang" },
      quiz: [
        {
          q: "ADF t-stat = -1,5 (nilai kritis -2,86, ADF intersep tanpa tren). Tindakan?",
          options: [
            { text: "Langsung fit ARMA — sudah stasioner", why: "Salah. -1,5 > -2,86 = gagal menolak unit root." },
            { text: "Gagal menolak unit root → differencing (atau detrending jika tren deterministik) dulu", why: "Benar. Tapi cek dulu jenis trennya — obatnya beda.", correct: true },
            { text: "Naikkan orde AR", why: "Salah. Orde tidak memperbaiki non-stasioneritas." },
            { text: "Buang data", why: "Salah. Bukan solusi." },
          ],
        },
        {
          q: "Setelah fit ARIMA, ACF residual masih signifikan di lag 3. Artinya?",
          options: [
            { text: "Model sempurna", why: "Salah. Justru sebaliknya." },
            { text: "Model belum menangkap semua dinamika — perbaiki spesifikasi sebelum forecast", why: "Benar. Residual sehat = white noise.", correct: true },
            { text: "Normal — abaikan", why: "Salah. Pola tersisa = informasi belum tertangkap." },
            { text: "Naikkan d", why: "Salah. Masalahnya orde AR/MA, bukan differencing." },
          ],
        },
        {
          q: "Forecast 12 bulan ARIMA disajikan sebagai satu garis tanpa interval. Masalah?",
          options: [
            { text: "Tidak ada — garisnya dari model", why: "Salah. Setengah kebohongan." },
            { text: "Ketidakpastian melebar ~ akar(h) — tanpa interval, pembaca tidak tahu forecast jauh hampir tak informatif", why: "Benar. Interval adalah bagian integral jawaban.", correct: true },
            { text: "ARIMA tidak bisa forecast 12 bulan", why: "Salah. Bisa, dengan interval yang jujur." },
            { text: "Harus pakai median", why: "Salah. Bukan itu masalahnya." },
          ],
        },
        {
          q: "Kapan differencing dilarang (overdifferencing)?",
          options: [
            { text: "Tidak pernah — differencing selalu aman", why: "Salah." },
            { text: "Saat deret sudah stasioner — differencing menciptakan autokorelasi MA(1) buatan dan membuang informasi level", why: "Benar. d dipilih minimal agar stasioner.", correct: true },
            { text: "Saat n kecil", why: "Salah. Bukan kriterianya." },
            { text: "Saat ada musiman", why: "Salah. Musiman justru butuh seasonal differencing." },
          ],
        },
        {
          q: "ACF meluruh perlahan nyaris datar hingga lag 20, PACF besar hanya di lag 1. Dugaan?",
          options: [
            { text: "AR(1) stasioner biasa", why: "Salah. AR(1) stasioner meluruh geometris cepat; yang nyaris datar = curigai unit root." },
            { text: "Kemungkinan unit root — ACF yang tidak meluruh = ciri random walk. Uji ADF dulu sebelum identifikasi orde", why: "Benar. Sidik jari hanya dibaca setelah stasioner.", correct: true },
            { text: "MA(1)", why: "Salah. MA(1) ACF-nya terpotong di lag 1, bukan meluruh lambat." },
            { text: "White noise", why: "Salah. White noise ACF-nya nol di semua lag." },
          ],
        },
        {
          q: "Harga spot dan forward (keduanya non-stasioner) diregresikan; residualnya stasioner menurut ADF. Artinya?",
          options: [
            { text: "Regresi lancung — buang modelnya", why: "Salah. Justru sebaliknya." },
            { text: "Keduanya terkointegrasi: ada hubungan jangka panjang yang bermakna; residual stasioner = Engle-Granger langkah 2 lolos", why: "Benar. Kombinasi linearnya stasioner.", correct: true },
            { text: "Keduanya stasioner", why: "Salah. Masing-masing tetap non-stasioner; yang stasioner kombinasinya." },
            { text: "Butuh differencing dulu", why: "Salah. Differencing justru membuang hubungan jangka panjangnya." },
          ],
        },
        {
          q: "Model ARIMA di-fit 2015-2024 tanpa penyesuaian, padahal Maret 2020 jelas mengubah rezim. Risiko?",
          options: [
            { text: "Tidak ada — ARIMA adaptif otomatis", why: "Salah. ARIMA tidak mendeteksi break sendiri." },
            { text: "Patahan struktural: parameter hasil fit = rata-rata dua rezim, salah di keduanya. Uji Chow/CUSUM; pakai dummy break atau model per rezim", why: "Benar. Untuk keputusan modal, tanya apakah rezim hari ini sama dengan rezim data latih.", correct: true },
            { text: "Naikkan orde AR", why: "Salah. Orde tidak memperbaiki perubahan rezim." },
            { text: "Perbanyak data", why: "Salah. Data lebih banyak dari dua rezim = rata-rata yang lebih presisi tapi tetap salah." },
          ],
        },
      ],
    },
  ],
};
