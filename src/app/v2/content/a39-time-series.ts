import type { V2Lesson } from "../lib/types";

export const a39: V2Lesson = {
  slug: "a39-time-series",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.9 Time Series: Meramal dari Gema Masa Lalu",
  estMinutes: 50,
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
        "Deret stasioner: mean, variansi, dan kovarians antar lag konstan sepanjang waktu — hubungan yang stabil, syarat regresi. Lawannya: unit root (random walk) — deret berjalan tanpa kembali; dan tren deterministik — mean-nya bergerak.",
        "Uji ADF (disederhanakan): regresikan perubahan dy ke level lag-nya; jika koefisien b negatif signifikan (t < -2,86), tolak unit root = stasioner. Di bawah: AR(1) phi=0,7 vs random walk phi=1,0 vs tren. Hitung t-stat masing-masing dan putuskan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `t_ar` (AR(1) phi=0.7) via `adf_simple`" },
        { id: "t2", text: "Hitung `t_rw` (random walk), lalu `print`" },
      ],
      expected: "t_ar=-6.46 t_rw=-2.30",
      note: {
        title: "Sering salah",
        body: "Langsung fit ARMA tanpa uji stasioneritas. Gagal menolak unit root (t > -2,86) berarti differencing dulu — atau detrending jika trennya deterministik. Obatnya beda.",
      },
      hints: [
        "adf_simple(y) mengembalikan (b, t).",
        "Kritis kasar ADF 5% = -2.86; t < -2.86 berarti stasioner.",
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
      reference: "ADF: t < -2.86 -> stasioner. Jika tidak: differencing (stokastik) / detrending (deterministik).",
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
      next: { label: "B1 — Aksioma Peluang", href: "/learn/b1-aksioma-peluang" },
      quiz: [
        {
          q: "ADF t-stat = -1,5 (nilai kritis -2,86). Tindakan?",
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
