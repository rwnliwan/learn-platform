import type { V2Lesson } from "../lib/types";

export const mlfM93: V2Lesson = {
  slug: "mlf-m93-backtesting-walk-forward",
  track: "Machine Learning Finance",
  module: "Simulation, Backtesting & Validation",
  title: "MLF-M9.3 — Backtesting & Walk-Forward: Apakah VaR-mu Jujur?",
  estMinutes: 95,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "VaR yang tidak pernah di-backtest adalah klaim, bukan ukuran",
      prose: [
        "Bayangkan seorang risk manager mempresentasikan VaR95 portofolionya: 2,86% per hari [M4.2]. Angka itu rapi, dihitung dari 480 hari data, dan terlihat meyakinkan. Lalu seseorang di ruangan bertanya satu kalimat: «Berapa kali VaR itu tertembus dalam 230 hari terakhir — dan apakah tembusannya datang sendiri-sendiri, atau bergerombol?» Ruangan itu hening. VaR yang tidak pernah di-backtest adalah klaim, bukan ukuran: ia berkata «kerugian harian seharusnya menembus batas ini 5% dari waktu», tanpa pernah memeriksa apakah kenyataannya memang begitu.",
        "Lesson ini adalah pemeriksaannya. Kita memakai portofolio yang sama seperti M4.2 dan M5 — equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480 (2024-11-04 → 2026-11-11; return pertama 2024-11-04; harga pertama 2024-11-01), simpangan baku harian 0,0196 — dan menguji VaR historisnya secara out-of-sample (OOS): VaR dihitung dari jendela masa lalu, diuji pada hari yang belum pernah dilihat jendela itu. Bedakan SIMPLE vs LOG return secara eksplisit: seluruh lesson ini memakai SIMPLE returns (kerugian dalam persen dari nilai portofolio hari itu); LOG returns hanya dipakai di simulasi Monte Carlo M9.1, bukan di sini. Exceedance didefinisikan satu arah: return hari itu < −VaR (kerugian melebihi batas).",
        "Ada satu jebakan yang harus dikenali sebelum kita mulai menghitung — jebakan yang sudah kamu kenal dari M4.3: menguji VaR pada sampel yang sama dengan sampel yang membangunnya. VaR95 full-sample diuji pada 480 hari yang sama: exceedance 24 dari 480, LR Kupiec = 0, p = 1 — lolos SEMPURNA, karena ambangnya dibangun dari data itu sendiri. Itu bukan bukti VaR-nya bagus; itu bukti ujinya tidak menguji apa-apa. In-sample backtest adalah cermin yang memuji dirinya sendiri — dan lesson ini menunjukkan cara mengujinya dengan jujur: out-of-sample, dengan jendela yang berjalan maju (walk-forward).",
        "Peta lesson: cerita VaR yang tidak diuji → aturan backtest yang jujur + uji Kupiec → hasil kita (empat varian OOS) → independence: exceedance bergerombol? → walk-forward vs single split (tiga bukti) → Basel traffic-light → jebakan backtest yang «dilatih» → mini-case: putuskan → 2 lab → 2 figure → checkpoint.",
        "Nilai: backtest bagus karena ia mengubah VaR dari JANJI menjadi CATATAN: «dalam 230 hari OOS, VaR95 tertembus 15 kali (diharapkan 11,5)». Tanpa backtest, VaR adalah angka yang tidak bisa disalahkan — dan angka yang tidak bisa disalahkan adalah angka yang tidak bisa dipercaya.",
        "Baik atau buruk: VaR95 historis full-sample 0,0286 [M4.2] itu bagus sebagai TITIK AWAL — ia dihitung dari data nyata dan konsisten dengan VaR parametrik 0,0328. Buruk bila dibaca sebagai «model ini sudah benar»: tanpa backtest OOS, kamu tidak tahu apakah 0,0286 itu batas yang jujur atau batas yang kebetulan — dan tanpa uji independence, kamu tidak tahu apakah 15 tembusannya datang tersebar atau bergerombol tepat saat modal paling dibutuhkan.",
        "Mitigasi: jangan pernah menerima — atau menolak — sebuah VaR dari angkanya saja. Tanyakan dua hal sebelum memutuskan: berapa kali ia tertembus di data yang belum dilihatnya (coverage, langkah 2–3)? Dan apakah tembusannya datang sendiri-sendiri atau bergerombol (independence, langkah 4)? Lesson ini memberi kedua uji itu, dengan angka yang bisa kamu replikasi sendiri.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR yang dihitung dari data panjang pasti akurat",
        type: "pitfall",
        body: "Yang benar: VaR95 full-sample 0,0286 dihitung dari 480 hari — tapi diuji pada 480 hari YANG SAMA, ia lolos dengan LR = 0 dan p = 1 [M4.3]. Panjang data tidak membuat uji in-sample menjadi jujur. Yang membuat backtest jujur adalah PEMISAHAN: VaR dibangun dari masa lalu, diuji pada masa depan yang belum dilihatnya.",
      },
    },
    {
      id: "aturan-backtest",
      eyebrow: "Langkah 2 · Aturan backtest",
      title: "Aturan backtest yang jujur: OOS, exceedance, dan uji Kupiec (POF)",
      prose: [
        "Aturan pertama backtest yang jujur: PISAHKAN yang membangun dan yang menguji. VaR untuk hari t dihitung HANYA dari hari-hari sebelum t — jendela rolling 250 hari, atau expanding window yang membesar dari 250 hari awal. Hari t sendiri tidak pernah masuk ke jendela yang mengujinya. Inilah yang membedakan backtest dari jebakan in-sample langkah 1: di sini, setiap hari OOS adalah hari yang belum pernah dilihat VaR-nya. Rolling window menguji «apakah VaR yang diperbarui tiap hari tetap jujur?»; expanding window menguji «apakah VaR yang memakai semua sejarah tetap jujur?». Keduanya sah — dan keduanya bisa memberi jawaban yang berbeda (langkah 3).",
        "Aturan kedua: DEFINISIKAN exceedance sebelum menghitung. Di lesson ini, exceedance = return hari itu < −VaR. Tanda ketaksamaannya penting: return −3,00% terhadap VaR95 2,86% adalah exceedance (kerugian 3,00% > batas 2,86%); return −2,86% persis sama dengan batas BUKAN exceedance (tidak menembus). Konvensi ini sama dengan yang dipakai m9_canonical.json dan M4.3 — dan VaR di sini selalu VaR HISTORIS: ambang = kuantil 5% (atau 1%) dari return jendela, dalam SIMPLE returns. Satu angka yang harus diingat: untuk VaR95, peluang exceedance yang dijanjikan adalah 1 − 0,95 = 0,05 — 5 dari 100 hari.",
        "Uji yang menjawab «apakah frekuensinya sesuai janji?» adalah uji Kupiec POF (proportion of failures, 1995). Hipotesis nolnya (H0): peluang exceedance = 1 − α (untuk VaR95: 0,05). Statistik ujinya membandingkan dua kemungkinan (likelihood): kemungkinan data bila peluang exceedance-nya BENAR 0,05, versus kemungkinan data bila peluangnya adalah frekuensi yang TERAMATI (x/n). Bila keduanya jauh berbeda, LR membesar dan H0 ditolak. Kupiec menguji UNCONDITIONAL COVERAGE SAJA — apakah JUMLAH exceedance-nya sesuai — bukan apakah exceedance-nya tersebar acak sepanjang waktu. Itu tugas uji independence (langkah 4). Mencampuradukkan keduanya adalah kesalahan definisi yang paling mahal di lesson ini: Kupiec yang lolos TIDAK berarti «exceedance tersebar acak».",
        "Contoh hitung — rolling 250-hari VaR95 OOS (hari 251–480, n=230): exceedance teramati x = 15, diharapkan n × 0,05 = 230 × 0,05 = 11,5. Frekuensi teramati x/n = 15/230 = 0,0652 (6,52%) versus janji 0,05 (5%). LR = −2·ln[(0,95^215)·(0,05^15)] + 2·ln[(0,9348^215)·(0,0652^15)] = 1,0275. Di bawah H0, LR menyebar χ² dengan 1 derajat bebas; nilai kritis 5% adalah 3,841. Karena 1,0275 < 3,841, H0 TIDAK DITOLAK — p-value = 0,3108. Bacalah p-value itu dengan tepat: p = 0,3108 berarti «bila VaR ini jujur (peluang exceedance benar 0,05), hasil 15 dari 230 — atau yang lebih ekstrem — akan muncul 31,08% dari waktu». Itu BUKAN «peluang model benar 31%», dan BUKAN «model terbukti benar». p-value besar = «tidak ada bukti menolak», bukan «model benar».",
        "Nilai: Kupiec bagus karena ia mengubah pertanyaan «apakah VaR-mu jujur?» dari perasaan menjadi ANGKA yang bisa diaudit: x, n, LR, p — empat angka, satu keputusan. Dan ia murah: tidak butuh data baru, hanya catatan exceedance.",
        "Baik atau buruk: Kupiec bagus sebagai uji COVERAGE — ia menangkap VaR yang terlalu optimistis (terlalu sedikit exceedance? tidak — terlalu BANYAK: x jauh di atas yang diharapkan) maupun terlalu konservatif (x jauh di bawah yang diharapkan — VaR yang terlalu besar juga salah, karena modal yang dikunci sia-sia). Buruk bila dibaca sebagai uji LENGKAP: Kupiec buta terhadap URUTAN — 15 exceedance yang tersebar merata dan 15 exceedance yang datang dalam tiga minggu berturut-turut memberi LR yang SAMA. Itulah kenapa langkah 4 tidak bisa dilewati.",
        "Mitigasi: setiap kali kamu melaporkan Kupiec, laporkan keempat angkanya bersama-sama — «n=230, x=15, diharapkan 11,5, LR=1,0275, p=0,3108» — dan tulis kalimat penutupnya dengan tepat: «tidak ada bukti menolak H0 pada 5%», bukan «VaR terbukti benar». Dan jangan pernah berhenti di Kupiec: lanjutkan ke uji independence.",
      ],
      tasks: [],
      formula: String.raw`\mathrm{LR_{POF}} = -2\ln\left[(1-p)^{n-x} p^{x}\right] + 2\ln\left[\left(1-\frac{x}{n}\right)^{n-x}\left(\frac{x}{n}\right)^{x}\right] \sim \chi^2_1 \text{ di bawah H}_0`,
      formulaNote: "Uji Kupiec POF: p = 1 − α (untuk VaR95: p = 0,05); n = jumlah hari OOS; x = jumlah exceedance. H0: peluang exceedance = p. LR menyebar χ²₁ di bawah H0; nilai kritis 5% = 3,841. Contoh lesson ini: n=230, x=15, p=0,05 → LR = 1,0275, p-value = 0,3108 — H0 tidak ditolak. Kupiec menguji unconditional coverage SAJA, bukan independence (langkah 4).",
      note: {
        title: "Miskonsepsi: p-value besar berarti «VaR terbukti benar»",
        type: "pitfall",
        body: "Yang benar: p = 0,3108 berarti «hasil 15 dari 230 tidak cukup ekstrem untuk menolak H0» — bukan «H0 benar». Dengan n=230, Kupiec tidak punya kuasa untuk membedakan peluang 0,05 dari 0,0652: selisih 3,5 exceedance di atas yang diharapkan masih di dalam noise. «Tidak ada bukti menolak» adalah vonis tentang BUKTI, bukan tentang MODEL.",
      },
    },
    {
      id: "hasil-kita",
      eyebrow: "Langkah 3 · Hasil kita",
      title: "Hasil kita: empat varian OOS — jendela dan skema memengaruhi vonis",
      prose: [
        "Sekarang hasilnya — empat varian backtest OOS yang sama-sama dihitung dari portofolio SIMPLE returns n=480 [m9_canonical.json, m9_backtest_wf]. Rolling 250-hari VaR95 (hari 251–480, n=230): exceedance 15, diharapkan 11,5, laju 15/230 = 6,52% vs janji 5%, LR = 1,0275, p = 0,3108 — tidak menolak H0. Rolling 120-hari VaR95 (hari 121–480, n=360): exceedance 20, diharapkan 18,0, laju 20/360 = 5,56%, LR = 0,2261, p = 0,6344 — tidak menolak H0. Rolling 250-hari VaR99 (n=230): exceedance 4, diharapkan 2,3, laju 4/230 = 1,74% vs janji 1%, LR = 1,0398, p = 0,3079 — tidak menolak H0. Expanding-window VaR95 (mulai 250 hari, n=230): exceedance 16, diharapkan 11,5, laju 16/230 = 6,96%, LR = 1,6611, p = 0,1975 — tidak menolak H0. Empat varian, empat p-value di atas 0,19 — tidak satu pun yang menolak H0 pada 5%.",
        "Bacalah keempatnya BERSAMA-SAMA, bukan satu-satu — karena di sanalah pelajarannya. Pertama, jendela MEMENGARUHI hasil: rolling 120-hari (jendela pendek, VaR lebih responsif terhadap rezim terbaru) memberi 20 exceedance dari 360 hari — laju 5,56%, PALING DEKAT dengan janji 5% — sementara rolling 250-hari memberi laju 6,52% dan expanding 6,96%. Jendela yang lebih panjang mengingat krisis lama (termasuk hari-hari buruk awal 2025) dan memberi VaR yang lebih stabil tapi lebih lambat beradaptasi; jendela pendek beradaptasi cepat tapi VaR-nya lebih berisik. Kedua, TINGKAT keyakinan memengaruhi kuasa uji: VaR99 hanya punya 2,3 exceedance yang diharapkan dari 230 hari — dengan angka sekecil itu, Kupiec hampir tidak punya kuasa: 4 exceedance (hampir dua kali lipat janji) tetap memberi p = 0,3079. «Tidak menolak» pada VaR99 jauh lebih lemah buktinya daripada «tidak menolak» pada VaR95 — karena yang diharapkan hanya 2,3.",
        "Ketiga — dan ini yang paling penting untuk langkah 4 — keempat varian ini menguji hal yang SAMA (coverage) dengan cara yang berbeda, dan keempatnya «lolos». Bila kamu berhenti di sini, ceritanya adalah «VaR kita jujur». Cerita itu SALAH — bukan karena angkanya salah (semuanya benar, semuanya dari m9_canonical.json), melainkan karena ceritanya belum lengkap: Kupiec tidak melihat URUTAN exceedance. Empat varian yang lolos coverage bisa menyembunyikan satu kegagalan independence — dan itulah yang terjadi di sini (langkah 4).",
        "Nilai: empat varian bagus karena ia menunjukkan SENSITIVITAS vonis terhadap pilihan desain: jendela 120 vs 250, rolling vs expanding, 95% vs 99%. Backtest yang hanya melaporkan SATU varian menyembunyikan sensitivitas itu — dan varian yang dilaporkan cenderung varian yang angkanya paling bagus. Melaporkan keempatnya adalah kejujuran desain.",
        "Baik atau buruk: hasil ini bagus sebagai BUKTI COVERAGE — keempat varian konsisten (tidak ada yang menolak H0), dan konsistensi itu lebih meyakinkan daripada satu varian yang lolos sendirian. Buruk bila dibaca sebagai «VaR lolos backtest, selesai»: p-value 0,1975–0,6344 semuanya «tidak menolak», tetapi «tidak menolak» pada n=230 dengan 15 exceedance adalah bukti yang LEMAH — selisih 3,5 exceedance di atas harapan masih di dalam noise, dan VaR99 dengan 2,3 yang diharapkan hampir tidak teruji sama sekali. Lolos yang lemah tetap lolos — tapi jangan membesar-besarkannya.",
        "Mitigasi: laporkan SELALU lebih dari satu varian (jendela dan skema yang berbeda), laporkan n dan expected di samping x dan p, dan tulis kuasa ujinya: «VaR99: diharapkan 2,3 exceedance — uji ini hampir tidak punya kuasa». Bila satu varian menolak H0 sementara yang lain lolos, jangan pilih yang lolos — selidiki kenapa mereka berbeda.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: melaporkan hanya varian yang lolos",
        type: "risk",
        body: "Yang benar: bila kamu mencoba rolling 120, rolling 250, dan expanding — lalu hanya melaporkan yang p-value-nya paling besar — kamu sedang memilih bukti, bukan menguji model. Laporkan SEMUA varian yang kamu coba (di sini keempatnya lolos — jadi tidak ada yang disembunyikan), dan bila satu varian menolak H0, ia masuk laporan dengan huruf yang sama besarnya.",
      },
    },
    {
      id: "independence",
      eyebrow: "Langkah 4 · Independence",
      title: "Independence: exceedance bergerombol? Uji Christoffersen",
      prose: [
        "Kupiec lolos — 15 exceedance dari 230 hari, p = 0,3108. Sekarang pertanyaan kedua, yang Kupiec tidak bisa jawab: apakah ke-15 exceedance itu datang sendiri-sendiri, tersebar acak sepanjang 230 hari — atau bergerombol dalam beberapa minggu yang buruk? Untuk VaR, bedanya adalah beda antara «kerugian sesekali» dan «kerugian datang bertubi-tubi tepat saat modal paling dibutuhkan». Uji yang menjawabnya adalah uji independence Christoffersen (1998): ia membandingkan peluang exceedance SESUDAH hari tanpa exceedance dengan peluang exceedance SESUDAH hari exceedance. Bila exceedance independen, kedua peluang itu SAMA. Bila tidak — exceedance bergerombol.",
        "Nilai [m9_canonical.json, christoffersen_roll250_var95] — rolling-250 VaR95 OOS, 229 transisi antar-hari: n00 = 203 (hari tenang sesudah hari tenang), n01 = 11 (exceedance sesudah hari tenang), n10 = 11 (hari tenang sesudah exceedance), n11 = 4 (exceedance sesudah exceedance). Peluang exceedance unconditional π = 15/229 = 0,0655. Peluang exceedance sesudah hari TIDAK exceedance π01 = 11/214 = 0,0514. Peluang exceedance sesudah hari exceedance π11 = 4/15 = 0,2667. Bacalah dua perbandingan itu dengan pembanding yang BENAR dan jangan tertukar: π11/π01 = 0,2667/0,0514 = 5,19 — dibulatkan 5,2× — artinya sesudah satu hari exceedance, peluang exceedance keesokan harinya adalah 5,2 KALI peluang sesudah hari tenang. Pembanding yang BERBEDA: π11/π = 0,2667/0,0655 = 4,07 — dibulatkan 4,1× — artinya peluang exceedance sesudah exceedance adalah 4,1 KALI peluang rata-rata hari mana pun. 5,2× membandingkan dengan «sesudah hari tenang»; 4,1× membandingkan dengan «rata-rata». Keduanya benar — dengan pembandingnya masing-masing — dan keduanya salah bila pembandingnya ditukar.",
        "Statistik ujinya: LR_ind = 6,6456, p = 0,0099 — SIGNIFIKAN pada 5% (nilai kritis χ²₁ 3,841) dan pada 1% (6,635 — tipis, 6,6456 hanya 0,0106 di atasnya). Independensi DITOLAK: exceedance BERGEROMBOL. Uji gabungan (conditional coverage) LR_cc = LR_POF + LR_ind = 1,0275 + 6,6456 = 7,6731, p = 0,0216 (χ²₂, nilai kritis 5% 5,991) — juga menolak. Perhatikan aritmetikanya: LR_cc adalah JUMLAH kedua LR (1,0275 + 6,6456 = 7,6731) — dan vonis gabungannya ditentukan oleh komponen independence-nya, bukan oleh coverage-nya. Kupiec lolos (1,0275) + independence gagal (6,6456) = gabungan gagal (7,6731). Inilah pelajaran sentral lesson ini: coverage yang lolos TIDAK menyelamatkan model yang exceedance-nya bergerombol.",
        "Lihat gerombolnya dengan mata (figure 1, langkah 11): 15 exceedance itu bukan tersebar merata — ada TIGA hari beruntun (hari OOS 40, 41, 42: 2026-01-26, 27, 28) dan dua pasangan (95–96 dan 212–213). Empat transisi exceedance→exceedance (n11 = 4): 40→41, 41→42, 95→96, 212→213. Dan hari 212 (2026-10-16) adalah hari terburuk portofolio: return −13,98% [m9_canonical.json] — kerugian Rp13.983.464 pada Rp100jt [M9.2 skenario] — diikuti keesokan harinya oleh exceedance lagi (−4,83%). Inilah yang dimaksud «kerugian datang bergerombol»: bukan satu hari buruk, melainkan hari buruk yang memanggil hari buruk berikutnya. Mengapa ini terjadi? Volatilitas bergerombol (volatility clustering): return kuadrat lag-1 berkorelasi 0,1043 [M4.3] — hari yang bergejolak cenderung diikuti hari yang bergejolak — dan VaR historis rolling 250-hari bergerak LAMBAT (jendelanya panjang), sehingga setelah satu exceedance, ambangnya belum naik cukup cepat untuk menangkap hari buruk berikutnya.",
        "Nilai: Christoffersen bagus karena ia menangkap kegagalan yang TIDAK TERLIHAT di Kupiec: model yang jumlah exceedance-nya benar tetapi waktunya salah. Untuk risk manager, waktu adalah segalanya: 15 exceedance yang tersebar adalah 15 hari buruk yang bisa ditanggung satu-satu; 15 exceedance yang bergerombol dalam tiga minggu adalah krisis likuiditas.",
        "Baik atau buruk: hasil ini bagus sebagai DIAGNOSIS — ia memberi tahu PERSIS apa yang rusak (bukan coverage-nya, melainkan independence-nya) dan PERSIS seberapa besar (π11 5,2× π01). Buruk bila dibaca sebagai «VaR-nya sama sekali tidak berguna»: VaR95 ini tetap mengukur BESARNYA kerugian harian dengan cukup benar (coverage lolos) — yang gagal adalah asumsi bahwa exceedance datang sendiri-sendiri. Model yang coverage-nya lolos tapi independence-nya gagal adalah model yang butuh PERBAIKAN (mis. VaR yang beradaptasi lebih cepat, atau ES sebagai pelengkap), bukan model yang harus dibuang tanpa dipelajari.",
        "Mitigasi: JANGAN PERNAH melaporkan Kupiec tanpa Christoffersen — keduanya adalah pasangan yang tidak terpisahkan (coverage + independence = conditional coverage). Dan bila independence gagal, tulis penyebab yang paling mungkin (volatility clustering; jendela yang terlalu panjang) beserta perbaikan yang diusulkan — bukan hanya vonisnya.",
      ],
      tasks: [],
      formula: String.raw`\mathrm{LR_{ind}} = -2\ln L_0 + 2\ln L_1, \qquad \mathrm{LR_{cc}} = \mathrm{LR_{POF}} + \mathrm{LR_{ind}} \sim \chi^2_2`,
      formulaNote: "Uji independence Christoffersen: L₀ = likelihood dengan satu peluang π untuk semua hari; L₁ = likelihood dengan π01 (peluang exceedance sesudah hari tenang) dan π11 (sesudah hari exceedance) yang berbeda. LR_ind menyebar χ²₁ di bawah H0 (independence); LR_cc = LR_POF + LR_ind menyebar χ²₂. Lesson ini: n00=203, n01=11, n10=11, n11=4; π=0,0655; π01=0,0514; π11=0,2667; LR_ind=6,6456 (p=0,0099); LR_cc=7,6731 (p=0,0216). Perbandingan: π11/π01=5,2×; π11/π=4,1× — jangan tertukar pembandingnya.",
      note: {
        title: "Jebakan: π11/π01 dan π11/π tertukar",
        type: "pitfall",
        body: "Yang benar: π11 = 0,2667 adalah 5,2× dari π01 = 0,0514 (0,2667/0,0514 = 5,19) DAN 4,1× dari π = 0,0655 (0,2667/0,0655 = 4,07). Menulis «π11 adalah 4,1× π01» atau «π11 adalah 5,2× π» adalah salah aritmetika — dan keduanya sudah dicegah di lesson ini dengan menulis pembandingnya secara eksplisit di setiap kalimat.",
      },
    },
    {
      id: "walk-forward",
      eyebrow: "Langkah 5 · Walk-forward",
      title: "Walk-forward vs single split: satu split tidak cukup",
      prose: [
        "Backtest VaR di langkah 2–4 adalah walk-forward dalam bentuknya yang paling sederhana: jendela bergerak maju, hari demi hari, dan setiap hari diuji sekali — 230 keputusan OOS, bukan satu. Prinsip yang sama berlaku untuk model machine learning — dan tiga bukti dari modul-modul sebelumnya menunjukkan kenapa SATU split (train sekali, test sekali) tidak cukup untuk menilai model deret waktu.",
        "Bukti pertama [M4.1] — walk-forward 8 folds pada prediksi arah return: Random Forest 0,5250, Logistic Regression 0,5688, decision tree 0,5188, GBM 0,5062, naive (tebak mayoritas) 0,5625. Bandingkan dengan random cross-validation pada data yang sama: RF 0,5326, LR 0,6000. Dua hal terlihat. Pertama, random CV MELEBIHI walk-forward (LR 0,6000 acak vs 0,5688 walk-forward; RF 0,5326 vs 0,5250) — karena random CV mengacak waktu: ia «menguji» masa depan dengan potongan masa depan yang sudah dilihatnya, dan menguji masa lalu dengan masa depan. Kedua, dalam walk-forward, model NAIVE (0,5625) mengalahkan RF (0,5250), tree (0,5188), dan GBM (0,5062) — hanya LR (0,5688) yang sedikit di atasnya. Random CV menyembunyikan fakta memalukan ini; walk-forward menampakkannya. Model yang tidak bisa mengalahkan naive dalam walk-forward adalah model yang belum membuktikan apa-apa — berapa pun skor random CV-nya.",
        "Bukti kedua [M6.2] — nested CV vs single split pada credit scoring GBM: nested CV 0,7858 (sd antar-fold 0,0068) vs single-split test 0,7823. Selisihnya kecil (0,0035) — dan itulah poinnya: nested CV memberi estimasi yang TIDAK BERGANTUNG pada satu split, dengan ukuran penyebaran antar-fold (sd 0,0068) yang bisa dibaca. Single split 0,7823 adalah SATU undian dari distribusi itu; nested CV 0,7858 adalah rata-rata lima undian. Dan walk-forward BBCA di modul yang sama: mean ROC-AUC 0,5516 — jauh di bawah 0,7858, karena BBCA adalah prediksi deret waktu (arah return besok), bukan klasifikasi snapshot. Angka yang sama (ROC-AUC) berarti hal yang berbeda pada tugas yang berbeda — dan walk-forward adalah yang menunjukkan bedanya. Perhatikan penulisannya: «0,7858 (sd antar-fold 0,0068)» — sd antar-fold adalah penyebaran antar-fold, BUKAN ketidakpastian mean; jangan pernah menulisnya sebagai «mean ± sd».",
        "Bukti ketiga [M7.5] — pseudo-time chunks pada monitoring credit scoring: ROC-AUC per chunk 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006. Rentang (spread) 0,8138 − 0,7428 = 0,0710 — performa model berayun 7,10 poin persen antar-periode. Dan roc_drop 0,0388 = 0,7816 − 0,7428 — chunk terburuk 3,88 poin persen DI BAWAH baseline test 0,7816. Satu split test (0,7816) tidak memberi tahu kamu bahwa ada periode di mana modelmu hanya 0,7428. Walk-forward — atau pseudo-time chunks — memberi tahu. Dan perhatikan: validation halves M8.1 (half A vs B) adalah split ACAK, BUKAN walk-forward — halves mengukur noise sampling, bukan stabilitas waktu. Jangan klaim halves membuktikan stabilitas waktu; itu pelajaran M8.1 langkah desain validasi, dan batas itu tetap berlaku di sini.",
        "Nilai: walk-forward bagus karena ia menguji model SEPANJANG WAKTU, bukan pada satu titik waktu. Model deret waktu yang hanya diuji pada satu split adalah model yang diuji pada satu rezim — dan rezim berubah (langkah 4: volatility clustering; M4.5: regime stress). Walk-forward memaksa model membuktikan dirinya di rezim yang berbeda-beda.",
        "Baik atau buruk: walk-forward bagus bila fold-nya MENGHORMATI WAKTU (latih masa lalu, uji masa depan — tidak pernah sebaliknya) dan bila hasilnya dilaporkan PER FOLD, bukan hanya rata-ratanya (rata-rata 0,5516 BBCA menyembunyikan fold mana yang terburuk). Buruk bila fold-nya tumpang tindih tanpa disadari, atau bila «walk-forward» dipakai sebagai label untuk random CV yang diacak — label tidak mengubah isi.",
        "Mitigasi: untuk data berurutan waktu, JANGAN PERNAH memakai random split sebagai bukti utama. Pakai walk-forward (atau pseudo-time chunks bila datamu snapshot yang diurutkan) — dan laporkan skor per fold beserta spread-nya (di sini 0,0710), bukan hanya rata-rata.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: nested CV sudah cukup, walk-forward tidak perlu",
        type: "pitfall",
        body: "Yang benar: nested CV [M6.2] menguji stabilitas terhadap PEMILIHAN SAMPEL ACAK — fold-nya diacak, waktunya diabaikan. Walk-forward menguji stabilitas terhadap WAKTU — fold-nya berurutan. Keduanya menguji hal yang berbeda, dan keduanya diperlukan: nested CV 0,7858 (sd antar-fold 0,0068) tidak memberi tahu kamu bahwa chunk terburuk M7.5 hanya 0,7428 (roc_drop 0,0388). Jangan pakai yang satu untuk menggantikan yang lain.",
      },
    },
    {
      id: "basel",
      eyebrow: "Langkah 6 · Basel traffic-light",
      title: "Basel traffic-light: 3 exceedance 99% → GREEN — dan apa artinya",
      prose: [
        "Regulator tidak menunggu uji Kupiec selesai. Basel (framework backtesting 1996, masih dipakai sampai hari ini) mengubah jumlah exceedance VaR99 dalam 250 hari terakhir menjadi LAMPU LALU LINTAS — dan lampunya menentukan berapa banyak modal yang harus dicadangkan bank. Aturannya, sebagai fakta regulasi: GREEN bila 0–4 exceedance (multiplier modal 3,00); YELLOW bila 5–9 exceedance (multiplier naik 3,40 pada 5 exceedance, sampai 3,85 pada 9 exceedance); RED bila 10 atau lebih exceedance (multiplier 4,00). Multiplier mengalikan VaR untuk menentukan modal minimum — jadi lampu kuning bukan hanya «peringatan»: ia MENAMBAH modal yang harus disisihkan. Ambang-ambang ini adalah fakta regulasi Basel, bukan [kebijakan lesson ini] — lesson ini tidak mengubahnya.",
        "Hasil kita [m9_canonical.json, basel_99_last250]: dalam 250 hari terakhir, VaR99 (ambang dari 230 hari sebelumnya) tertembus 3 kali → GREEN. Tiga exceedance berada jauh di dalam zona hijau (batasnya 4) — konsisten dengan hasil Kupiec VaR99 langkah 3 (4 exceedance dari 230 hari OOS, p = 0,3079, tidak menolak H0). Perhatikan bahwa kedua hitungan ini mengukur hal yang BERBEDA: Basel menghitung exceedance VaR99 dalam 250 hari perdagangan terakhir dengan SATU ambang tetap (kuantil 1% dari 230 hari sebelumnya); Kupiec langkah 3 menghitung exceedance VaR99 ROLLING (ambang diperbarui tiap hari) selama 230 hari OOS. Keduanya GREEN/lolos — dan konsistensi dua cara hitung yang berbeda itu lebih meyakinkan daripada satu cara saja.",
        "Tapi baca juga apa yang TIDAK dikatakan lampu hijau ini. Pertama, Basel traffic-light — seperti Kupiec — hanya menghitung JUMLAH, bukan URUTAN: 3 exceedance yang bergerombol dan 3 yang tersebar memberi lampu yang sama. Kedua, dengan hanya 2,3 exceedance yang diharapkan pada VaR99 (langkah 3), zona hijau 0–4 itu LEBAR: VaR99 bisa hampir dua kali lipat terlalu optimistis (4 exceedance vs 2,3 yang diharapkan) dan tetap GREEN. Lampu hijau Basel adalah syarat MINIMUM regulasi, bukan vonis «model bagus». Ketiga, multiplier 3,00 pada zona hijau bukan berarti «tidak ada penalti»: modal minimum sudah 3× VaR — regulator memang tidak percaya VaR mentah, bahkan yang hijau.",
        "Nilai: Basel traffic-light bagus karena ia mengubah statistik menjadi KEPUTUSAN yang bisa ditegakkan: lampu kuning menaikkan modal, lampu merah memaksa peninjauan model. Ia memaksa bank yang VaR-nya buruk untuk MEMBAYAR (dengan modal), bukan hanya meminta maaf dengan laporan.",
        "Baik atau buruk: traffic-light bagus sebagai ALARM REGULASI — sederhana, tidak bisa dinegosiasikan sesudah melihat angka, dan konsekuensinya nyata (modal). Buruk bila dibaca sebagai VALIDASI LENGKAP: ia tidak menguji independence (langkah 4), tidak menguji besaran kerugian saat exceedance (itu tugas Expected Shortfall, M4.2), dan tidak menguji apakah VaR-nya terlalu konservatif. GREEN Basel + independence gagal (langkah 4) adalah kombinasi yang mungkin — dan memang itulah kombinasi kita: GREEN di sini, independence DITOLAK di langkah 4.",
        "Mitigasi: laporkan zona Basel BERSAMA uji Kupiec dan Christoffersen — ketiganya, selalu. «GREEN Basel» tanpa independence adalah laporan yang belum selesai. Dan bila zona kuning tercapai (5–9), jangan tunggu merah: selidiki SEBELUM multiplier naik lebih jauh.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: GREEN Basel berarti «VaR lolos validasi»",
        type: "risk",
        body: "Yang benar: GREEN (3 exceedance 99% dalam 250 hari) berarti «jumlah exceedance masih dalam batas regulasi» — bukan «model valid». Validasi lengkap butuh ketiganya: coverage (Kupiec, langkah 3), independence (Christoffersen, langkah 4), DAN zona Basel. Model kita GREEN di Basel dan lolos Kupiec — tapi gagal independence. Satu lampu hijau tidak memadamkan dua lampu lainnya.",
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Jebakan",
      title: "Jebakan: backtest yang «dilatih» pada hasil backtest",
      prose: [
        "Jebakan paling berbahaya di lesson ini tidak terlihat seperti kesalahan — ia terlihat seperti ketekunan. Kamu mencoba rolling 250-hari: p = 0,3108, lolos. Kamu mencoba rolling 120-hari: p = 0,6344, lolos. Kamu mencoba expanding: p = 0,1975, lolos. Semua lolos — jadi tidak ada masalah, kan? Masalahnya muncul bila urutannya DIBALIK: kamu mencoba BANYAK jendela, BANYAK skema, BANYAK tingkat keyakinan — dan hanya melaporkan yang lolos. Itulah OVERFITTING KE BACKTEST: backtest yang seharusnya menguji model, malah menjadi data latih kedua — model (atau jendelanya, atau ambangnya) dipilih KARENA hasil backtest-nya bagus. Backtest yang «dilatih» seperti ini tidak menguji apa-apa; ia hanya mengulang jebakan in-sample langkah 1 dengan langkah tambahan.",
        "Bentuknya bermacam-macam, dan semuanya punya nama yang sama di statistik: MULTIPLE TESTING. Mencoba 20 jendela dan melaporkan satu yang p-value-nya terbesar. Menggeser ambang VaR sedikit demi sedikit sampai exceedance-nya «pas» 11,5. Memilih jendela 120-hari KARENA p-nya 0,6344 — paling besar dari keempatnya — lalu menulis «VaR kami lolos dengan p = 0,63». Setiap percobaan tambahan adalah satu kesempatan lagi untuk kebetulan terlihat seperti kebenaran. Dengan 20 percobaan pada taraf 5%, peluang SATU di antaranya «lolos secara kebetulan» bukan 5% — ia mendekati 64% (1 − 0,95^20). Dan yang dilaporkan hanyalah yang lolos.",
        "Jebakan kedua adalah saudara kembarnya: MENGUBAH MODEL sampai backtest-nya lolos. VaR historis gagal independence (langkah 4)? Ganti ke VaR parametrik. Masih gagal? Tambah filter volatilitas. Masih gagal? Coba jendela 60 hari. Setiap perubahan yang diputuskan DARI hasil backtest menghabiskan kejujuran backtest itu — karena backtest berikutnya menguji model yang sudah «belajar» dari backtest sebelumnya. Inilah kenapa lesson ini melaporkan keempat varian langkah 3 BERSAMA-SAMA, tanpa memilih: keempatnya lolos, jadi tidak ada yang perlu disembunyikan — tetapi BILA satu varian menolak H0, ia tetap masuk laporan. Aturan yang sama berlaku untukmu: tuliskan SEMUA varian yang kamu coba, sebelum melihat hasilnya — dan laporkan semuanya, apa pun vonisnya.",
        "Nilai: mengenali jebakan ini bagus karena ia mengubah pertanyaan dari «apakah backtest-nya lolos?» menjadi «apakah backtest-nya JUJUR?». Backtest yang jujur adalah backtest yang DITULIS DULU (jendela, skema, ambang) dan DILAPORKAN SEMUA — seperti ambang traffic-light M8.1 yang ditulis sebelum melihat verdict.",
        "Baik atau buruk: mencoba banyak varian bagus bila tujuannya SENSITIVITAS («apakah vonisnya berubah bila jendelanya berubah?» — langkah 3 menjawab: tidak, keempatnya lolos) — dan buruk bila tujuannya PEMILIHAN («varian mana yang angkanya paling bagus?»). Bedanya bukan pada jumlah varian yang dicoba, melainkan pada APA YANG DILAPORKAN: semua, atau hanya yang lolos.",
        "Mitigasi: sebelum backtest, tulis protokolnya — jendela apa, skema apa, ambang apa — dan kunci (jangan diubah sesudah melihat hasil). Laporkan SEMUA varian yang dicoba, lolos maupun tidak. Bila kamu mengubah model karena backtest gagal, backtest berikutnya WAJIB memakai data yang belum pernah dipakai untuk memutuskan perubahan itu — atau ia bukan backtest, melainkan latihan.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «kami mencoba banyak jendela dan semuanya lolos»",
        type: "pitfall",
        body: "Yang benar: «semuanya lolos» hanya bermakna bila SEMUA yang dicoba DILAPORKAN — termasuk yang tidak lolos, bila ada. Di lesson ini keempat varian dilaporkan dan keempatnya lolos (p = 0,3108; 0,6344; 0,3079; 0,1975) — jadi klaimnya jujur. Bila kamu mencoba 20 varian dan melaporkan 4 yang lolos, «semuanya lolos» adalah kebohongan dengan statistik — dan multiple testing (peluang satu kebetulan lolos dari 20 percobaan ≈ 64%) adalah buktinya.",
      },
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: model VaR baru — lolos Kupiec, gagal independence. Putuskan.",
      prose: [
        "Sekarang giliranmu menjadi validator. Fakta di mejamu — semuanya dari angka kanonis yang sudah kamu lihat: model VaR baru (rolling 250-hari VaR95, portofolio SIMPLE returns n=480). Kupiec: n=230, exceedance 15, diharapkan 11,5, LR = 1,0275, p = 0,3108 — TIDAK menolak H0. Christoffersen: n00=203, n01=11, n10=11, n11=4; π01 = 0,0514; π11 = 0,2667 (5,2× π01; 4,1× π unconditional 0,0655); LR_ind = 6,6456, p = 0,0099 — independensi DITOLAK. Gabungan LR_cc = 7,6731, p = 0,0216 — ditolak. Basel: 3 exceedance 99% dalam 250 hari terakhir → GREEN. Walk-forward [M4.1]: model ini diuji sepanjang waktu, bukan satu split. Putuskan — dan tulis alasanmu sebelum membaca paragraf berikutnya.",
        "Putuskan dengan aturan yang ditulis dulu, bukan dengan perasaan sesudah melihat angka. Pertanyaan pertama: apakah coverage-nya lolos? Ya — Kupiec p = 0,3108, dan Basel GREEN. Pertanyaan kedua: apakah independence-nya lolos? TIDAK — LR_ind 6,6456, p = 0,0099, dan LR_cc gabungan 7,6731, p = 0,0216 juga menolak. Pertanyaan ketiga — yang menentukan: apakah «lolos coverage» cukup untuk meloloskan model? TIDAK. Conditional coverage (LR_cc) adalah uji GABUNGAN yang mensyaratkan KEDUANYA: jumlah yang benar DAN waktu yang benar. Model yang exceedance-nya bergerombol (π11 5,2× π01) adalah model yang kerugianya datang bertubi-tubi — tiga hari beruntun 40–42, pasangan 95–96 dan 212–213 — tepat saat modal paling dibutuhkan. Jawabannya: TIDAK LOLOS sebagai model — bukan karena VaR-nya salah mengukur besar kerugian (coverage lolos), melainkan karena VaR-nya salah tentang KAPAN kerugian itu datang.",
        "Yang TIDAK boleh dilakukan validator di sini — dan ini bagian dari pelajarannya: (a) MELOLOSKAN karena «Kupiec lolos dan Basel GREEN» — itu membaca setengah dari uji gabungan dan mengabaikan setengahnya; LR_cc 7,6731 (p = 0,0216) adalah vonis yang SUDAH mencakup Kupiec, dan vonis itu menolak. (b) MELOLOSKAN «dengan catatan ringan» karena «hanya independence yang gagal» — independence yang gagal berarti kerugian bergerombol, dan kerugian yang bergerombol adalah risiko likuiditas, bukan catatan kaki. (c) MENOLAK mentah-mentah tanpa syarat perbaikan — model ini coverage-nya lolos, jadi yang rusak adalah ADAPTASI-nya (jendela 250-hari bergerak terlalu lambat saat volatilitas naik), bukan seluruh modelnya. Keputusan yang benar: TIDAK LOLOS dalam bentuknya sekarang, dengan syarat perbaikan yang tertulis — VaR yang beradaptasi lebih cepat (jendela lebih pendek, atau pembobotan eksponensial), atau pelengkap Expected Shortfall [M4.2] — lalu backtest ULANG pada data yang belum dipakai untuk memutuskan perbaikan itu (langkah 7).",
        "Nilai: mini-case ini bagus karena jawabannya TIDAK ADA di satu angka mana pun secara sendirian — ia ada di PERBANDINGAN dua uji: Kupiec yang lolos dan Christoffersen yang gagal. Itulah pekerjaan validator: bukan menghitung (mesin bisa menghitung), melainkan MEMUTUSKAN dari aturan yang bisa diaudit — dan aturan itu berkata: conditional coverage butuh keduanya.",
        "Baik atau buruk: keputusan «tidak lolos» ini bagus bila syarat perbaikannya SPESIFIK (jendela lebih pendek? pembobotan eksponensial? ES sebagai pelengkap?) dan backtest ulangnya memakai data segar — dan buruk bila ia menjadi penolakan permanen tanpa jalan kembali. Model yang coverage-nya lolos adalah model yang SETENGAH benar — ia layak diperbaiki, bukan dibuang.",
        "Mitigasi: setiap kali kamu menjadi validator — di pekerjaan, di proyek, di lesson ini — tulis verdictmu dalam SATU KALIMAT: «[LOLOS/TIDAK LOLOS] karena [Kupiec p=… DAN/ATAU Christoffersen p=…], dengan syarat [syarat + pemilik + tanggal]». Bila kalimatmu hanya menyebut satu dari dua uji itu, verdictmu belum siap.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «Kupiec lolos sudah cukup — independence itu tambahan»",
        type: "pitfall",
        body: "Yang benar: independence BUKAN tambahan — ia setengah dari conditional coverage (LR_cc = LR_POF + LR_ind = 7,6731, p = 0,0216). Model dengan Kupiec p = 0,3108 dan independence p = 0,0099 adalah model yang GAGAL uji gabungannya. «Lolos Kupiec» tanpa «lolos independence» sama dengan «lolos setengah ujian» — dan setengah ujian yang lolos bukan kelulusan.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 9 · Lab 1",
      title: "Lab: rolling VaR backtest + Kupiec — replikasi 15/230",
      prose: [
        "Sekarang hitung sendiri backtest rolling-250 VaR95 dari data nyata [m9_canonical.json]. Starter di bawah ini berisi 480 SIMPLE daily returns portofolio equal-weight BBCA/KLBF/UNVR (2024-11-04 → 2026-11-11), dibulatkan 4 desimal — pembulatan ini TIDAK mengubah hasil: exceedance tetap 15, sama seperti data penuh (buktikan sendiri di notebook M9.3, yang memakai data penuh). Lab ini hanya memakai numpy + math — p-value χ²₁ dihitung tanpa scipy: p = erfc(√(LR/2)).",
        "Hasil yang diharapkan [lab]: n_oos=230; n_exceed=15; expected=11,5; lr_kupiec=1,0275; p_value=0,3108; lolos=True. Perhatikan baris terakhir: lolos=True — Kupiec TIDAK menolak H0 pada taraf 5%. Tapi ingat langkah 4: lolos di sini BUKAN vonis akhir model — lab 2 akan menunjukkan kenapa.",
        "Setelah lab jalan, bandingkan dengan langkah 2: LR = 1,0275 jauh di bawah nilai kritis χ²₁ 3,841 — dan p = 0,3108 berarti hasil 15 dari 230 akan muncul 31,08% dari waktu bila VaR ini jujur. Lalu tanyakan pada dirimu: bila exceedance-nya 20 (bukan 15), berapa LR dan p-nya? (Jawaban: LR ≈ 5,47, p ≈ 0,019 — H0 DITOLAK.) Lima exceedance tambahan mengubah vonis — itulah kenapa n=230 adalah sampel yang kecil untuk menguji VaR, dan kenapa «tidak menolak» harus dibaca sebagai bukti yang lemah, bukan sebagai pembuktian.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi exceed, n_oos, n_exceed, expected: rolling VaR95 250-hari OOS" },
        { id: "t2", text: "Lengkapi lr_kupiec: rumus Kupiec POF dari langkah 2" },
        { id: "t3", text: "Lengkapi p_value (erfc) dan lolos: True bila p >= 0,05" },
      ],
      expected: "n_oos=230\nn_exceed=15\nexpected=11.5\nlr_kupiec=1.0275\np_value=0.3108\nlolos=True",
      hints: [
        "exceed[t] = RETURNS[t] < np.quantile(RETURNS[t-250:t], 0.05) untuk t = 250..479 — ambang = kuantil 5% dari 250 hari SEBELUM t, tidak termasuk t.",
        "LR = −2·ln[(0,95^(n−x))·(0,05^x)] + 2·ln[((1−x/n)^(n−x))·((x/n)^x)] dengan n = 230, x = 15 — pakai math.log, bukan log10.",
        "p-value χ²₁ tanpa scipy: p = math.erfc(math.sqrt(LR/2)). lolos = p >= 0,05 — 0,3108 >= 0,05, jadi True.",
      ],
      code: {
        starter: `# Lab 1 — rolling VaR95 backtest + Kupiec POF [m9_canonical.json]
# Portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480
# (2024-11-04 -> 2026-11-11). Return dibulatkan 4 desimal — exceedance
# tetap 15 (sama seperti data penuh); replikasi penuh di notebook M9.3.
import math
import numpy as np

RETURNS_S = "-0.0118,-0.0099,-0.0084,-0.0168,-0.0048,-0.0111,0.0174,-0.0046,-0.0183,0.0097,-0.0067,-0.0076,0.0144,-0.0212,0.0151,0.0401,-0.0180,0.0061,-0.0024,-0.0121,0.0165,0.0073,0.0072,-0.0154,0.0181,0.0230,-0.0068,-0.0259,-0.0125,-0.0075,-0.0277,0.0004,-0.0252,-0.0160,0.0254,0.0158,0.0022,0.0051,-0.0060,-0.0163,-0.0229,0.0041,-0.0089,-0.0020,-0.0039,0.0025,-0.0109,0.0159,0.0026,0.0034,-0.0181,-0.0001,-0.0005,0.0022,-0.0223,-0.0109,0.0150,-0.0309,0.0045,-0.0125,0.0067,-0.0128,0.0261,-0.0381,0.0004,0.0055,0.0109,0.0060,0.0040,-0.0452,-0.0109,-0.0121,-0.0120,-0.0478,0.0198,-0.0222,-0.0728,0.0602,-0.0085,0.0088,0.0234,0.0186,-0.0285,-0.0033,-0.0006,0.0311,-0.0085,0.0141,-0.0270,0.0059,0.0079,-0.0026,-0.0139,0.0119,0.0081,0.0163,-0.0743,0.0152,0.0622,0.0187,0.0347,-0.0125,0.0103,-0.0136,0.0054,0.0111,0.0407,0.0029,0.0552,-0.0040,0.0011,0.0385,0.0012,0.0228,0.0179,-0.0039,-0.0009,0.0032,0.0180,0.0111,-0.0081,-0.0039,-0.0010,0.0243,-0.0109,-0.0000,0.0082,0.0002,-0.0154,-0.0007,-0.0117,0.0073,-0.0059,0.0013,-0.0113,0.0037,-0.0181,-0.0066,0.0153,-0.0181,-0.0167,-0.0222,-0.0221,0.0405,0.0057,-0.0023,0.0009,0.0045,-0.0032,0.0365,-0.0181,-0.0010,-0.0134,0.0011,0.0171,0.0198,-0.0112,-0.0065,-0.0075,0.0021,-0.0166,0.0087,-0.0076,0.0090,0.0095,-0.0159,0.0019,-0.0005,-0.0075,0.0229,0.0127,-0.0064,0.0136,-0.0217,0.0022,-0.0040,0.0107,0.0198,0.0067,0.0111,-0.0290,0.0028,0.0050,0.0052,-0.0252,-0.0116,-0.0086,-0.0045,-0.0051,-0.0340,-0.0141,-0.0043,0.0067,0.0001,-0.0229,-0.0183,0.0271,0.0176,-0.0072,0.0018,0.0100,-0.0041,-0.0196,0.0111,-0.0032,0.0210,-0.0187,-0.0089,0.0208,-0.0191,0.0003,-0.0143,0.0019,0.0034,0.0003,-0.0052,-0.0042,0.0266,-0.0092,-0.0122,-0.0216,0.0160,0.0618,-0.0051,0.0510,0.0261,-0.0185,0.0371,0.0491,0.0403,-0.0157,0.0239,-0.0080,-0.0075,0.0100,-0.0042,0.0278,-0.0321,-0.0026,-0.0025,-0.0081,0.0068,-0.0075,-0.0083,0.0139,-0.0293,0.0264,-0.0048,-0.0087,0.0090,0.0131,0.0000,-0.0119,-0.0088,0.0090,-0.0152,0.0245,0.0012,-0.0126,-0.0024,-0.0073,0.0079,-0.0254,0.0061,0.0346,0.0023,-0.0050,0.0088,0.0032,0.0037,-0.0199,-0.0026,0.0055,-0.0047,0.0005,0.0025,-0.0002,-0.0023,-0.0029,0.0017,0.0032,0.0048,-0.0057,-0.0204,-0.0115,-0.0134,-0.0140,0.0033,-0.0057,-0.0257,-0.0332,-0.0443,-0.0164,0.0393,0.0257,0.0018,0.0103,0.0187,0.0097,-0.0121,0.0004,-0.0084,-0.0012,-0.0117,-0.0023,-0.0105,-0.0024,0.0307,-0.0124,0.0191,-0.0160,0.0121,-0.0403,-0.0276,-0.0391,0.0286,-0.0120,-0.0317,0.0180,0.0023,-0.0147,-0.0164,-0.0070,0.0324,-0.0013,-0.0037,-0.0307,-0.0098,0.0079,0.0225,0.0039,-0.0098,-0.0052,0.0339,-0.0229,0.0150,-0.0096,0.0089,-0.0091,-0.0125,-0.0093,-0.0141,-0.0006,-0.0090,-0.0289,-0.0522,-0.0158,-0.0025,0.0150,-0.0192,0.0083,0.0141,0.0394,0.0344,-0.0016,-0.0150,-0.0060,-0.0118,-0.0054,-0.0143,0.0070,-0.0178,-0.0041,0.0164,-0.0149,-0.0353,-0.0123,-0.0369,0.0018,-0.0424,-0.0281,0.0470,0.0313,0.0271,0.0187,0.0431,-0.0100,-0.0122,0.0117,-0.0105,0.0250,-0.0026,0.0221,0.0116,-0.0100,-0.0209,-0.0025,0.0004,0.0242,-0.0014,0.0064,-0.0145,-0.0092,0.0016,-0.0069,-0.0040,-0.0124,0.0155,0.0349,0.0112,-0.0131,-0.0090,-0.0187,-0.0013,-0.0020,-0.0060,0.0007,0.0108,0.0157,-0.0042,0.0305,0.0315,-0.0166,0.0041,-0.0058,-0.0077,0.0055,-0.0044,0.0074,0.0021,-0.0120,0.0348,-0.0107,-0.0037,-0.0091,0.0017,0.0009,-0.0050,-0.0064,-0.0068,0.0180,-0.0107,-0.0024,0.0014,-0.0160,-0.0113,-0.0191,0.0072,0.0118,-0.0093,0.0120,-0.0070,-0.0144,-0.0013,0.0097,-0.0148,0.0034,-0.0071,-0.0017,-0.0048,-0.0077,-0.0014,0.0145,0.0024,-0.0038,0.0040,0.0102,-0.0161,0.0086,0.0140,-0.0036,-0.1398,-0.0483,0.0592,0.0036,0.0166,-0.0132,0.0026,-0.0166,0.0396,-0.0314,0.0073,-0.0034,-0.0153,0.0133,0.0449,0.0164,0.0036,0.0062,0.0094"
RETURNS = np.array([float(v) for v in RETURNS_S.split(",")])
WINDOW = 250
ALPHA = 0.95
Q = 1 - ALPHA  # peluang exceedance yang dijanjikan = 0,05

# TODO t1: rolling VaR95 OOS — tiap hari t >= WINDOW, ambang = kuantil Q
#   dari RETURNS[t-WINDOW:t]; exceed = RETURNS[t] < ambang
exceed = None  # TODO: np.array([...], dtype=bool)
n_oos = 0  # TODO: len(exceed)
n_exceed = 0  # TODO: int(exceed.sum())
expected = 0.0  # TODO: n_oos * Q
# TODO t2: Kupiec LR (POF) — rumus langkah 2
lr_kupiec = 0.0  # TODO
# TODO t3: p-value chi2 df=1 tanpa scipy: p = erfc(sqrt(LR/2));
#   lolos bila p >= 0,05 (taraf 5%)
p_value = 0.0  # TODO: math.erfc(math.sqrt(lr_kupiec / 2))
lolos = None  # TODO: p_value >= 0,05
print(f"n_oos={n_oos}")
print(f"n_exceed={n_exceed}")
print(f"expected={expected:.1f}")
print(f"lr_kupiec={lr_kupiec:.4f}")
print(f"p_value={p_value:.4f}")
print(f"lolos={lolos}")`,
        lockLines: 12,
        solution: `# Lab 1 — rolling VaR95 backtest + Kupiec POF [m9_canonical.json]
# Portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480
# (2024-11-04 -> 2026-11-11). Return dibulatkan 4 desimal — exceedance
# tetap 15 (sama seperti data penuh); replikasi penuh di notebook M9.3.
import math
import numpy as np

RETURNS_S = "-0.0118,-0.0099,-0.0084,-0.0168,-0.0048,-0.0111,0.0174,-0.0046,-0.0183,0.0097,-0.0067,-0.0076,0.0144,-0.0212,0.0151,0.0401,-0.0180,0.0061,-0.0024,-0.0121,0.0165,0.0073,0.0072,-0.0154,0.0181,0.0230,-0.0068,-0.0259,-0.0125,-0.0075,-0.0277,0.0004,-0.0252,-0.0160,0.0254,0.0158,0.0022,0.0051,-0.0060,-0.0163,-0.0229,0.0041,-0.0089,-0.0020,-0.0039,0.0025,-0.0109,0.0159,0.0026,0.0034,-0.0181,-0.0001,-0.0005,0.0022,-0.0223,-0.0109,0.0150,-0.0309,0.0045,-0.0125,0.0067,-0.0128,0.0261,-0.0381,0.0004,0.0055,0.0109,0.0060,0.0040,-0.0452,-0.0109,-0.0121,-0.0120,-0.0478,0.0198,-0.0222,-0.0728,0.0602,-0.0085,0.0088,0.0234,0.0186,-0.0285,-0.0033,-0.0006,0.0311,-0.0085,0.0141,-0.0270,0.0059,0.0079,-0.0026,-0.0139,0.0119,0.0081,0.0163,-0.0743,0.0152,0.0622,0.0187,0.0347,-0.0125,0.0103,-0.0136,0.0054,0.0111,0.0407,0.0029,0.0552,-0.0040,0.0011,0.0385,0.0012,0.0228,0.0179,-0.0039,-0.0009,0.0032,0.0180,0.0111,-0.0081,-0.0039,-0.0010,0.0243,-0.0109,-0.0000,0.0082,0.0002,-0.0154,-0.0007,-0.0117,0.0073,-0.0059,0.0013,-0.0113,0.0037,-0.0181,-0.0066,0.0153,-0.0181,-0.0167,-0.0222,-0.0221,0.0405,0.0057,-0.0023,0.0009,0.0045,-0.0032,0.0365,-0.0181,-0.0010,-0.0134,0.0011,0.0171,0.0198,-0.0112,-0.0065,-0.0075,0.0021,-0.0166,0.0087,-0.0076,0.0090,0.0095,-0.0159,0.0019,-0.0005,-0.0075,0.0229,0.0127,-0.0064,0.0136,-0.0217,0.0022,-0.0040,0.0107,0.0198,0.0067,0.0111,-0.0290,0.0028,0.0050,0.0052,-0.0252,-0.0116,-0.0086,-0.0045,-0.0051,-0.0340,-0.0141,-0.0043,0.0067,0.0001,-0.0229,-0.0183,0.0271,0.0176,-0.0072,0.0018,0.0100,-0.0041,-0.0196,0.0111,-0.0032,0.0210,-0.0187,-0.0089,0.0208,-0.0191,0.0003,-0.0143,0.0019,0.0034,0.0003,-0.0052,-0.0042,0.0266,-0.0092,-0.0122,-0.0216,0.0160,0.0618,-0.0051,0.0510,0.0261,-0.0185,0.0371,0.0491,0.0403,-0.0157,0.0239,-0.0080,-0.0075,0.0100,-0.0042,0.0278,-0.0321,-0.0026,-0.0025,-0.0081,0.0068,-0.0075,-0.0083,0.0139,-0.0293,0.0264,-0.0048,-0.0087,0.0090,0.0131,0.0000,-0.0119,-0.0088,0.0090,-0.0152,0.0245,0.0012,-0.0126,-0.0024,-0.0073,0.0079,-0.0254,0.0061,0.0346,0.0023,-0.0050,0.0088,0.0032,0.0037,-0.0199,-0.0026,0.0055,-0.0047,0.0005,0.0025,-0.0002,-0.0023,-0.0029,0.0017,0.0032,0.0048,-0.0057,-0.0204,-0.0115,-0.0134,-0.0140,0.0033,-0.0057,-0.0257,-0.0332,-0.0443,-0.0164,0.0393,0.0257,0.0018,0.0103,0.0187,0.0097,-0.0121,0.0004,-0.0084,-0.0012,-0.0117,-0.0023,-0.0105,-0.0024,0.0307,-0.0124,0.0191,-0.0160,0.0121,-0.0403,-0.0276,-0.0391,0.0286,-0.0120,-0.0317,0.0180,0.0023,-0.0147,-0.0164,-0.0070,0.0324,-0.0013,-0.0037,-0.0307,-0.0098,0.0079,0.0225,0.0039,-0.0098,-0.0052,0.0339,-0.0229,0.0150,-0.0096,0.0089,-0.0091,-0.0125,-0.0093,-0.0141,-0.0006,-0.0090,-0.0289,-0.0522,-0.0158,-0.0025,0.0150,-0.0192,0.0083,0.0141,0.0394,0.0344,-0.0016,-0.0150,-0.0060,-0.0118,-0.0054,-0.0143,0.0070,-0.0178,-0.0041,0.0164,-0.0149,-0.0353,-0.0123,-0.0369,0.0018,-0.0424,-0.0281,0.0470,0.0313,0.0271,0.0187,0.0431,-0.0100,-0.0122,0.0117,-0.0105,0.0250,-0.0026,0.0221,0.0116,-0.0100,-0.0209,-0.0025,0.0004,0.0242,-0.0014,0.0064,-0.0145,-0.0092,0.0016,-0.0069,-0.0040,-0.0124,0.0155,0.0349,0.0112,-0.0131,-0.0090,-0.0187,-0.0013,-0.0020,-0.0060,0.0007,0.0108,0.0157,-0.0042,0.0305,0.0315,-0.0166,0.0041,-0.0058,-0.0077,0.0055,-0.0044,0.0074,0.0021,-0.0120,0.0348,-0.0107,-0.0037,-0.0091,0.0017,0.0009,-0.0050,-0.0064,-0.0068,0.0180,-0.0107,-0.0024,0.0014,-0.0160,-0.0113,-0.0191,0.0072,0.0118,-0.0093,0.0120,-0.0070,-0.0144,-0.0013,0.0097,-0.0148,0.0034,-0.0071,-0.0017,-0.0048,-0.0077,-0.0014,0.0145,0.0024,-0.0038,0.0040,0.0102,-0.0161,0.0086,0.0140,-0.0036,-0.1398,-0.0483,0.0592,0.0036,0.0166,-0.0132,0.0026,-0.0166,0.0396,-0.0314,0.0073,-0.0034,-0.0153,0.0133,0.0449,0.0164,0.0036,0.0062,0.0094"
RETURNS = np.array([float(v) for v in RETURNS_S.split(",")])
WINDOW = 250
ALPHA = 0.95
Q = 1 - ALPHA  # peluang exceedance yang dijanjikan = 0,05

exceed = np.array([RETURNS[t] < np.quantile(RETURNS[t - WINDOW:t], Q)
                   for t in range(WINDOW, len(RETURNS))])
n_oos = len(exceed)
n_exceed = int(exceed.sum())
expected = n_oos * Q
x = n_exceed
lr_kupiec = (-2 * math.log((1 - Q) ** (n_oos - x) * Q ** x)
             + 2 * math.log((1 - x / n_oos) ** (n_oos - x) * (x / n_oos) ** x))
p_value = math.erfc(math.sqrt(lr_kupiec / 2))
lolos = p_value >= 0.05
print(f"n_oos={n_oos}")
print(f"n_exceed={n_exceed}")
print(f"expected={expected:.1f}")
print(f"lr_kupiec={lr_kupiec:.4f}")
print(f"p_value={p_value:.4f}")
print(f"lolos={lolos}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_oos", value: 230, tol: 0.5, label: "`n_oos` seharusnya 230", msg: "Hari OOS = 480 − 250 = 230 (hari 251–480) — jendela 250 hari pertama tidak diuji." },
          { kind: "equal", task: "t1", name: "n_exceed", value: 15, tol: 0.5, label: "`n_exceed` seharusnya 15", msg: "15 exceedance dari 230 hari OOS — laju 6,52% vs janji 5% (diharapkan 11,5)." },
          { kind: "equal", task: "t2", name: "lr_kupiec", value: 1.0275, tol: 0.01, label: "`lr_kupiec` seharusnya 1.0275", msg: "LR Kupiec 1,0275 — jauh di bawah nilai kritis χ²₁ 3,841 pada taraf 5%." },
          { kind: "equal", task: "t3", name: "p_value", value: 0.3108, tol: 0.01, label: "`p_value` seharusnya 0.3108", msg: "p = 0,3108 — «tidak ada bukti menolak H0», BUKAN «model terbukti benar» (langkah 2)." },
          { kind: "stdout_matches", task: "t3", pattern: "lolos=True", label: "Output menampilkan lolos=True", msg: "Kupiec lolos — tapi ingat lab 2: lolos coverage bukan vonis akhir model." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 10 · Lab 2",
      title: "Lab: Christoffersen + Basel zone — exceedance bergerombol?",
      prose: [
        "Lab kedua memakai flag exceedance yang sama dengan lab 1 (230 hari OOS, 1 = exceedance) dan menguji apa yang Kupiec tidak bisa uji: URUTAN. Hitung transisi antar-hari (229 transisi), peluang bersyarat π01 dan π11, LR_ind dan p-value-nya, LR_cc gabungan, lalu zona Basel dari 3 exceedance VaR99 dalam 250 hari terakhir [m9_canonical.json].",
        "Hasil yang diharapkan [lab]: n00=203; n01=11; n10=11; n11=4; pi=0,0655; pi01=0,0514; pi11=0,2667; lr_ind=6,6456; p_ind=0,0099; lr_cc=7,6731; p_cc=0,0216; zone=GREEN. Bacalah dua baris terakhir BERSAMA-SAMA: zone GREEN (Basel) DAN p_ind 0,0099 (independence DITOLAK) — lampu hijau regulasi tidak memadamkan vonis independence. Dan perhatikan p_cc = 0,0216: p-value χ²₂ dihitung tanpa scipy sebagai exp(−LR_cc/2) — rumus eksak untuk 2 derajat bebas.",
        "Setelah lab jalan, bandingkan dengan langkah 4: π11 = 0,2667 adalah 5,2× π01 = 0,0514 (pembanding «sesudah hari tenang») dan 4,1× π = 0,0655 (pembanding «rata-rata») — tulis keduanya dengan pembandingnya, jangan pernah menulis rasionya tanpa pembanding. Lalu tanyakan pada dirimu: bila n11 = 0 (tidak satu pun exceedance berurutan), berapa π11 dan LR_ind-nya? (Jawaban: π11 = 0, LR_ind ≈ 1,53, p ≈ 0,216 — independence lolos.) Empat transisi itulah yang membalik vonis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi n00, n01, n10, n11: hitung transisi antar-hari dari EXC" },
        { id: "t2", text: "Lengkapi pi, pi01, pi11: peluang exceedance unconditional dan bersyarat" },
        { id: "t3", text: "Lengkapi lr_ind, p_ind, lr_cc, p_cc, zone: uji independence + Basel" },
      ],
      expected: "n00=203\nn01=11\nn10=11\nn11=4\npi=0.0655\npi01=0.0514\npi11=0.2667\nlr_ind=6.6456\np_ind=0.0099\nlr_cc=7.6731\np_cc=0.0216\nzone=GREEN",
      hints: [
        "n00 = ((EXC[:-1]==0) & (EXC[1:]==0)).sum() — dan seterusnya untuk n01, n10, n11; keempatnya berjumlah 229 transisi.",
        "pi = (n01+n11)/229; pi01 = n01/(n00+n01); pi11 = n11/(n10+n11) — penyebut pi11 hanya 15 (n10+n11), jadi satu exceedance mengubahnya 6,7 poin persen.",
        "ll0 = xlnx(n00+n10, 1−pi) + xlnx(n01+n11, pi); ll1 = xlnx(n00, 1−pi01) + xlnx(n01, pi01) + xlnx(n10, 1−pi11) + xlnx(n11, pi11); lr_ind = −2·ll0 + 2·ll1. p_ind = erfc(√(lr_ind/2)); p_cc = exp(−lr_cc/2); zone dari EXCEED99_LAST250 = 3 (≤ 4 → GREEN).",
      ],
      code: {
        starter: `# Lab 2 — Christoffersen independence + zona Basel [m9_canonical.json]
# EXCEED_S: 230 flag exceedance rolling-250 VaR95 OOS (1 = exceedance),
# urutan hari OOS 1..230 — sama seperti Lab 1.
# Basel: EXCEED99_LAST250 = 3 (VaR99 dari 230 hari sebelum 250 hari terakhir).
import math
import numpy as np

EXCEED_S = "00000000000000000000000000000000000000011100000000000000000000101001000000001000000000000000001100000000000000000001010100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001100000001000000000"
EXC = np.array([int(c) for c in EXCEED_S])
EXCEED99_LAST250 = 3  # [m9_canonical.json, basel_99_last250]

def xlnx(a, b):
    return a * math.log(b) if a > 0 and b > 0 else 0.0

# TODO t1: hitung transisi antar-hari (229 transisi)
n00 = 0  # TODO: hari tenang sesudah hari tenang
n01 = 0  # TODO: exceedance sesudah hari tenang
n10 = 0  # TODO: hari tenang sesudah exceedance
n11 = 0  # TODO: exceedance sesudah exceedance
# TODO t2: peluang bersyarat
pi = 0.0  # TODO: (n01 + n11) / 229
pi01 = 0.0  # TODO: n01 / (n00 + n01)
pi11 = 0.0  # TODO: n11 / (n10 + n11)
# TODO t3: LR_ind + p_ind + LR_cc + zona Basel
lr_ind = 0.0  # TODO: -2*ll0 + 2*ll1 (pakai xlnx; lihat rumus langkah 4)
p_ind = 0.0  # TODO: math.erfc(math.sqrt(lr_ind / 2))
lr_kupiec = 1.0275  # dari Lab 1 (n=230, x=15, p=0,05)
lr_cc = 0.0  # TODO: lr_kupiec + lr_ind
p_cc = 0.0  # TODO: chi2 df=2: p = exp(-lr_cc / 2)
zone = ""  # TODO: GREEN bila <= 4; YELLOW 5-9; RED >= 10
print(f"n00={n00} n01={n01} n10={n10} n11={n11}")
print(f"pi={pi:.4f} pi01={pi01:.4f} pi11={pi11:.4f}")
print(f"lr_ind={lr_ind:.4f} p_ind={p_ind:.4f}")
print(f"lr_cc={lr_cc:.4f} p_cc={p_cc:.4f}")
print(f"zone={zone}")`,
        lockLines: 13,
        solution: `# Lab 2 — Christoffersen independence + zona Basel [m9_canonical.json]
# EXCEED_S: 230 flag exceedance rolling-250 VaR95 OOS (1 = exceedance),
# urutan hari OOS 1..230 — sama seperti Lab 1.
# Basel: EXCEED99_LAST250 = 3 (VaR99 dari 230 hari sebelum 250 hari terakhir).
import math
import numpy as np

EXCEED_S = "00000000000000000000000000000000000000011100000000000000000000101001000000001000000000000000001100000000000000000001010100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001100000001000000000"
EXC = np.array([int(c) for c in EXCEED_S])
EXCEED99_LAST250 = 3  # [m9_canonical.json, basel_99_last250]

def xlnx(a, b):
    return a * math.log(b) if a > 0 and b > 0 else 0.0

n00 = int(((EXC[:-1] == 0) & (EXC[1:] == 0)).sum())
n01 = int(((EXC[:-1] == 0) & (EXC[1:] == 1)).sum())
n10 = int(((EXC[:-1] == 1) & (EXC[1:] == 0)).sum())
n11 = int(((EXC[:-1] == 1) & (EXC[1:] == 1)).sum())
pi = (n01 + n11) / 229
pi01 = n01 / (n00 + n01)
pi11 = n11 / (n10 + n11)
ll0 = xlnx(n00 + n10, 1 - pi) + xlnx(n01 + n11, pi)
ll1 = (xlnx(n00, 1 - pi01) + xlnx(n01, pi01)
       + xlnx(n10, 1 - pi11) + xlnx(n11, pi11))
lr_ind = -2 * ll0 + 2 * ll1
p_ind = math.erfc(math.sqrt(lr_ind / 2))
lr_kupiec = 1.0275  # dari Lab 1 (n=230, x=15, p=0,05)
lr_cc = lr_kupiec + lr_ind
p_cc = math.exp(-lr_cc / 2)
zone = "GREEN" if EXCEED99_LAST250 <= 4 else "YELLOW" if EXCEED99_LAST250 <= 9 else "RED"
print(f"n00={n00} n01={n01} n10={n10} n11={n11}")
print(f"pi={pi:.4f} pi01={pi01:.4f} pi11={pi11:.4f}")
print(f"lr_ind={lr_ind:.4f} p_ind={p_ind:.4f}")
print(f"lr_cc={lr_cc:.4f} p_cc={p_cc:.4f}")
print(f"zone={zone}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n11", value: 4, tol: 0.5, label: "`n11` seharusnya 4", msg: "4 transisi exceedance→exceedance: 40→41, 41→42, 95→96, 212→213 — inilah gerombolnya." },
          { kind: "equal", task: "t2", name: "pi01", value: 0.0514, tol: 0.01, label: "`pi01` seharusnya 0.0514", msg: "Peluang exceedance sesudah hari tenang: 11/214 = 0,0514 — dekat dengan janji 0,05." },
          { kind: "equal", task: "t2", name: "pi11", value: 0.2667, tol: 0.01, label: "`pi11` seharusnya 0.2667", msg: "Peluang exceedance sesudah exceedance: 4/15 = 0,2667 — 5,2× pi01 (0,0514) dan 4,1× pi (0,0655)." },
          { kind: "equal", task: "t3", name: "lr_ind", value: 6.6456, tol: 0.05, label: "`lr_ind` seharusnya 6.6456", msg: "LR_ind 6,6456 > nilai kritis χ²₁ 3,841 — independensi DITOLAK (p = 0,0099)." },
          { kind: "equal", task: "t3", name: "p_cc", value: 0.0216, tol: 0.005, label: "`p_cc` seharusnya 0.0216", msg: "LR_cc gabungan 7,6731 (1,0275 + 6,6456), p = 0,0216 — conditional coverage DITOLAK walau Kupiec lolos." },
          { kind: "stdout_matches", task: "t3", pattern: "zone=GREEN", label: "Output menampilkan zone=GREEN", msg: "3 exceedance 99% dalam 250 hari terakhir → GREEN (batas hijau 0–4) — lampu hijau regulasi, bukan vonis validasi lengkap." },
        ],
      },
    },
    {
      id: "figure-timeline",
      eyebrow: "Langkah 11 · Figure 1",
      title: "Figure 1: timeline exceedance — 15 titik, 4 transisi berurutan",
      prose: [
        "Figure ini adalah langkah 4 yang digambar: 230 hari out-of-sample (hari 1 = hari ke-251 dari 480 hari data), tiap garis merah adalah satu exceedance rolling-250 VaR95. Hitung sendiri dari gambarnya: 15 garis merah — sama dengan 15 exceedance langkah 3. Tiga di antaranya beruntun tanpa jeda (hari OOS 40, 41, 42: 2026-01-26, 27, 28), dua pasangan berdekatan (95–96 dan 212–213), sisanya sendiri-sendiri (63, 65, 68, 77, 116, 118, 120, 221). Empat transisi exceedance→exceedance (n11 = 4): 40→41, 41→42, 95→96, 212→213.",
        "Perhatikan apa yang TIDAK terlihat bila kamu hanya membaca «15 exceedance, diharapkan 11,5»: paruh pertama OOS (hari 1–120) berisi 12 dari 15 exceedance — termasuk run tiga hari 40–42 — sementara paruh kedua (hari 121–230) hanya berisi 3 (212, 213, 221). Exceedance tidak hanya bergerombol antar-hari; ia juga bergerombol antar-periode. Dan hari 212 (2026-10-16) adalah hari terburuk portofolio: return −13,98% — kerugian Rp13.983.464 pada Rp100jt [M9.2 skenario] — diikuti keesokan harinya oleh exceedance lagi (−4,83%). Inilah gambar dari «kerugian datang bergerombol».",
        "Nilai: timeline bagus karena ia membuat independence BISA DILIHAT: mata manusia menangkap gerombol (tiga garis merah berdempetan) lebih cepat daripada tabel n00/n01/n10/n11. Figure ini dan uji Christoffersen berkata hal yang sama — tetapi figure-lah yang membuatmu MERASAKANNYA sebelum menghitungnya.",
        "Baik atau buruk: timeline bagus bila tiap tandanya bisa diaudit ke hari dan tanggalnya (di sini: 40–42 = 2026-01-26 s.d. 28; 212–213 = 2026-10-16 dan 19) — dan buruk bila ia hanya «ilustrasi» yang digambar kira-kira. Figure ini BUKAN ilustrasi: 15 tandanya sama persis dengan 15 exceedance kanonis [m9_canonical.json], dan prose, kuis, dan lab lesson ini memakai angka yang sama.",
        "Mitigasi: setiap kali kamu menggambar timeline exceedance, beri label tanggal pada gerombolnya — gerombol tanpa tanggal tidak bisa diselidiki («apa yang terjadi 26–28 Januari 2026?» adalah pertanyaan yang bisa dijawab; «ada gerombol di awal» bukan).",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Timeline 230 hari out-of-sample: 15 exceedance VaR95, tiga hari beruntun 40-42, pasangan 95-96 dan 212-213">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Timeline exceedance — 230 hari OOS, rolling VaR95 250-hari</text>
<text x="240" y="32" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">15 exceedance (diharapkan 11,5) — garis merah = hari return &lt; −VaR95</text>
<line x1="30" y1="120" x2="450" y2="120" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="30.0" y1="120" x2="30.0" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="48.3" y1="120" x2="48.3" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="66.7" y1="120" x2="66.7" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="85.0" y1="120" x2="85.0" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="103.4" y1="120" x2="103.4" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="121.7" y1="120" x2="121.7" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="140.0" y1="120" x2="140.0" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="158.4" y1="120" x2="158.4" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="176.7" y1="120" x2="176.7" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="195.1" y1="120" x2="195.1" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="213.4" y1="120" x2="213.4" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="231.7" y1="120" x2="231.7" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="250.1" y1="120" x2="250.1" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="268.4" y1="120" x2="268.4" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="286.8" y1="120" x2="286.8" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="305.1" y1="120" x2="305.1" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="323.4" y1="120" x2="323.4" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="341.8" y1="120" x2="341.8" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="360.1" y1="120" x2="360.1" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="378.5" y1="120" x2="378.5" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="396.8" y1="120" x2="396.8" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="415.2" y1="120" x2="415.2" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="433.5" y1="120" x2="433.5" y2="114" stroke="var(--chart-text)" stroke-width="0.7" opacity="0.45"/>
<line x1="101.5" y1="120" x2="101.5" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="101.5" cy="84" r="4" fill="var(--c1)"/>
<line x1="103.4" y1="120" x2="103.4" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="103.4" cy="84" r="4" fill="var(--c1)"/>
<line x1="105.2" y1="120" x2="105.2" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="105.2" cy="84" r="4" fill="var(--c1)"/>
<line x1="143.7" y1="120" x2="143.7" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="143.7" cy="84" r="4" fill="var(--c1)"/>
<line x1="147.4" y1="120" x2="147.4" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="147.4" cy="84" r="4" fill="var(--c1)"/>
<line x1="152.9" y1="120" x2="152.9" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="152.9" cy="84" r="4" fill="var(--c1)"/>
<line x1="169.4" y1="120" x2="169.4" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="169.4" cy="84" r="4" fill="var(--c1)"/>
<line x1="202.4" y1="120" x2="202.4" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="202.4" cy="84" r="4" fill="var(--c1)"/>
<line x1="204.2" y1="120" x2="204.2" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="204.2" cy="84" r="4" fill="var(--c1)"/>
<line x1="240.9" y1="120" x2="240.9" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="240.9" cy="84" r="4" fill="var(--c1)"/>
<line x1="244.6" y1="120" x2="244.6" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="244.6" cy="84" r="4" fill="var(--c1)"/>
<line x1="248.3" y1="120" x2="248.3" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="248.3" cy="84" r="4" fill="var(--c1)"/>
<line x1="417.0" y1="120" x2="417.0" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="417.0" cy="84" r="4" fill="var(--c1)"/>
<line x1="418.8" y1="120" x2="418.8" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="418.8" cy="84" r="4" fill="var(--c1)"/>
<line x1="433.5" y1="120" x2="433.5" y2="88" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="433.5" cy="84" r="4" fill="var(--c1)"/>
<text x="30.0" y="136" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">hari 1</text>
<text x="239.1" y="136" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">hari 115</text>
<text x="450.0" y="136" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">hari 230</text>
<text x="103.4" y="66" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3 hari beruntun: 40–42</text>
<line x1="103.4" y1="70" x2="103.4" y2="80" stroke="var(--text)" stroke-width="0.8"/>
<text x="203.3" y="66" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">95–96</text>
<line x1="203.3" y1="70" x2="203.3" y2="80" stroke="var(--text)" stroke-width="0.8"/>
<text x="417.9" y="66" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">212–213</text>
<line x1="417.9" y1="70" x2="417.9" y2="80" stroke="var(--text)" stroke-width="0.8"/>
<text x="240" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">4 transisi exceedance→exceedance (n11 = 4): 40→41, 41→42, 95→96, 212→213.</text>
<text x="240" y="176" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Kupiec lolos (p = 0,3108) — tapi exceedance TIDAK tersebar acak: ia bergerombol (langkah 4).</text>
<text x="240" y="196" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Hari 212 = 2026-10-16, return −13,98% — hari terburuk portofolio [M9.2 skenario].</text>
<text x="240" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Sumber: m9_canonical.json (m9_backtest_wf.roll250_var95); exceedance = return &lt; −VaR95 (simple returns).</text>
</svg>`,
        alt: "Timeline 230 hari out-of-sample: 15 exceedance VaR95, tiga hari beruntun 40-42, pasangan 95-96 dan 212-213; 4 transisi exceedance ke exceedance.",
        caption: "Cara membaca: tiap garis merah = satu hari return di bawah −VaR95. Hitung: 15 garis — sama dengan 15 exceedance langkah 3. Tiga garis berdempetan (hari 40–42), dua pasangan (95–96, 212–213): itulah gerombol yang ditangkap uji Christoffersen (π11 = 0,2667, 5,2× π01). Hari 212 = 2026-10-16, return −13,98%. Angka dari m9_canonical.json (m9_backtest_wf.roll250_var95).",
      },
      tasks: [],
    },
    {
      id: "figure-var-returns",
      eyebrow: "Langkah 12 · Figure 2",
      title: "Figure 2: rolling VaR95 vs realized returns — di mana batasnya tertembus",
      prose: [
        "Figure ini menunjukkan MESIN backtest-nya: garis tebal adalah −VaR95 rolling 250-hari (ambang kerugian, sekitar −2,5% s.d. −3,1% — VaR95-nya sendiri 0,0253 s.d. 0,0311), garis tipis adalah realized return harian (SIMPLE returns) selama 230 hari OOS, dan titik merah adalah 15 exceedance — hari-hari ketika return jatuh DI BAWAH garis VaR. Definisi exceedance di sini persis seperti langkah 2: return < −VaR. Titik yang menyentuh garis tetapi tidak melewatinya BUKAN exceedance.",
        "Perhatikan tiga hal. Pertama, garis VaR bergerak LAMBAT: ia nyaris datar di sekitar −2,8% selama 230 hari — karena jendela 250 hari hanya mengganti satu hari lama dengan satu hari baru tiap harinya. Kelambatan inilah yang membuat exceedance bergerombol (langkah 4): setelah satu hari buruk, ambang hampir tidak naik, sehingga hari buruk berikutnya menembusnya lagi. Kedua, exceedance terbesar bukan di tengah gambar — ia di ujung kanan: hari 212 (2026-10-16), return −13,98%, jauh di bawah garis VaR. Satu titik itu saja sudah ≈ 4,9× lebih dalam daripada VaR-nya — dan Kupiec tidak peduli seberapa DALAM exceedance itu; ia hanya menghitung JUMLAH. Besaran kerugian saat exceedance adalah tugas Expected Shortfall [M4.2], bukan Kupiec. Ketiga, sebagian besar return harian berada DI ATAS garis VaR (tidak tertembus) — 215 dari 230 hari. VaR95 bekerja pada 93,48% hari — dan gagal pada 6,52%-nya. Pertanyaannya bukan «apakah VaR pernah gagal?» (ia pasti gagal — itu janjinya: 5% dari waktu), melainkan «apakah ia gagal SESUAI JANJI, dan apakah kegagalannya tersebar?»",
        "Nilai: figure ini bagus karena ia menunjukkan backtest sebagai PERBANDINGAN DUA GARIS, bukan sebagai tabel p-value: garis VaR (apa yang dijanjikan) versus garis return (apa yang terjadi). Setiap exceedance adalah satu titik di mana janji dilanggar — dan kamu bisa melihat SENDIRI seberapa dalam pelanggarannya.",
        "Baik atau buruk: figure ini bagus bila garis VaR-nya adalah garis yang BENAR-BENAR dipakai backtest (rolling 250-hari, diperbarui tiap hari) — dan buruk bila garisnya adalah VaR full-sample yang datar (0,0286) — karena VaR full-sample «melihat» masa depan dan bukan VaR yang diuji. Di sini garisnya rolling — sama seperti lab 1.",
        "Mitigasi: setiap kali kamu menggambar VaR vs return, gambar garis VaR yang SAMA dengan yang dipakai backtest-mu (rolling, bukan full-sample), dan tandai exceedance dengan warna yang berbeda dari return biasa. Bila gambarmu tidak menunjukkan exceedance-nya, gambarmu menyembunyikan hasil backtest-nya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Rolling VaR95 250-hari versus realized return harian selama 230 hari out-of-sample; titik merah adalah 15 exceedance di bawah garis VaR">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Rolling VaR95 vs realized return — 230 hari OOS</text>
<text x="36" y="30" text-anchor="start" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+6%</text>
<text x="36" y="81.0" text-anchor="start" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="36" y="205" text-anchor="start" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−14%</text>
<line x1="30" y1="81.0" x2="450" y2="81.0" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<polyline points="30.0,69.9 31.8,81.0 33.7,91.1 35.5,88.5 37.3,73.4 39.2,93.9 41.0,60.2 42.8,79.9 44.7,91.7 46.5,83.1 48.3,87.2 50.2,74.3 52.0,102.6 53.8,75.8 55.7,51.6 57.5,79.0 59.3,85.2 61.2,73.5 63.0,78.3 64.8,77.9 66.7,98.0 68.5,83.3 70.3,76.3 72.2,85.0 74.0,80.6 75.9,78.9 77.7,81.1 79.5,83.0 81.4,83.5 83.2,79.6 85.0,78.3 86.9,76.9 88.7,85.8 90.5,98.4 92.4,90.8 94.2,92.4 96.0,92.9 97.9,78.2 99.7,85.9 101.5,102.9 103.4,109.2 105.2,118.7 107.0,95.0 108.9,47.6 110.7,59.1 112.5,79.4 114.4,72.3 116.2,65.1 118.0,72.7 119.9,91.3 121.7,80.7 123.5,88.2 125.4,82.0 127.2,91.0 129.0,83.0 130.9,89.9 132.7,83.0 134.5,54.9 136.4,91.5 138.2,64.8 140.0,94.6 141.9,70.7 143.7,115.3 145.5,104.4 147.4,114.2 149.2,56.7 151.0,91.2 152.9,108.0 154.7,65.7 156.6,79.1 158.4,93.5 160.2,94.9 162.1,87.0 163.9,53.4 165.7,82.1 167.6,84.1 169.4,107.1 171.2,89.3 173.1,74.3 174.9,61.9 176.7,77.7 178.6,89.4 180.4,85.4 182.2,52.2 184.1,100.5 185.9,68.2 187.7,89.2 189.6,73.5 191.4,88.7 193.2,91.6 195.1,88.9 196.9,93.0 198.7,81.5 200.6,88.7 202.4,105.6 204.2,125.3 206.1,94.4 207.9,83.1 209.7,68.2 211.6,97.4 213.4,74.0 215.2,69.0 217.1,47.5 218.9,51.7 220.7,82.4 222.6,93.7 224.4,86.1 226.2,91.0 228.1,85.6 229.9,93.2 231.7,75.0 233.6,96.1 235.4,84.5 237.2,67.1 239.1,93.7 240.9,111.0 242.8,91.4 244.6,112.4 246.4,79.5 248.3,117.0 250.1,104.9 251.9,41.0 253.8,54.4 255.6,58.0 257.4,65.1 259.3,44.4 261.1,89.5 262.9,91.4 264.8,71.1 266.6,89.9 268.4,59.7 270.3,83.3 272.1,62.3 273.9,71.1 275.8,89.5 277.6,98.8 279.4,83.2 281.3,80.7 283.1,60.4 284.9,82.2 286.8,75.6 288.6,93.3 290.4,88.9 292.3,79.7 294.1,86.9 295.9,84.4 297.8,91.5 299.6,67.8 301.4,51.4 303.3,71.4 305.1,92.1 306.9,88.6 308.8,96.9 310.6,82.1 312.4,82.7 314.3,86.1 316.1,80.4 317.9,71.8 319.8,67.7 321.6,84.5 323.4,55.1 325.3,54.2 327.1,95.1 329.0,77.5 330.8,85.9 332.6,87.6 334.5,76.3 336.3,84.7 338.1,74.7 340.0,79.2 341.8,91.2 343.6,51.4 345.5,90.1 347.3,84.2 349.1,88.7 351.0,79.6 352.8,80.2 354.6,85.2 356.5,86.4 358.3,86.7 360.1,65.7 362.0,90.1 363.8,83.0 365.6,79.8 367.5,94.6 369.3,90.6 371.1,97.2 373.0,74.9 374.8,71.0 376.6,88.9 378.5,70.8 380.3,87.0 382.1,93.3 384.0,82.1 385.8,72.8 387.6,93.6 389.5,78.1 391.3,87.0 393.1,82.4 395.0,85.1 396.8,87.5 398.6,82.2 400.5,68.6 402.3,79.0 404.1,84.2 406.0,77.6 407.8,72.3 409.7,94.7 411.5,73.7 413.3,69.1 415.2,84.1 417.0,199.9 418.8,122.1 420.7,30.7 422.5,77.9 424.3,66.9 426.2,92.2 428.0,78.8 429.8,95.1 431.7,47.3 433.5,107.7 435.3,74.8 437.2,83.9 439.0,94.0 440.8,69.7 442.7,42.9 444.5,67.0 446.3,77.9 448.2,75.7 450.0,73.0" fill="none" stroke="var(--c4)" stroke-width="1" opacity="0.75"/>
<polyline points="30.0,103.5 31.8,103.5 33.7,103.5 35.5,103.5 37.3,103.5 39.2,103.5 41.0,103.5 42.8,103.5 44.7,103.5 46.5,103.5 48.3,103.5 50.2,103.5 52.0,103.5 53.8,103.5 55.7,103.5 57.5,103.5 59.3,103.5 61.2,103.5 63.0,103.5 64.8,103.5 66.7,103.5 68.5,103.5 70.3,103.5 72.2,103.5 74.0,103.5 75.9,103.5 77.7,103.5 79.5,103.5 81.4,103.4 83.2,103.4 85.0,103.4 86.9,102.5 88.7,102.5 90.5,102.5 92.4,102.5 94.2,102.5 96.0,102.5 97.9,102.5 99.7,102.5 101.5,102.5 103.4,102.8 105.2,103.5 107.0,104.7 108.9,104.7 110.7,104.7 112.5,104.7 114.4,104.7 116.2,104.7 118.0,104.7 119.9,104.7 121.7,104.7 123.5,104.7 125.4,104.7 127.2,104.7 129.0,104.7 130.9,104.7 132.7,104.7 134.5,104.7 136.4,103.5 138.2,103.5 140.0,103.5 141.9,103.5 143.7,103.5 145.5,104.7 147.4,104.2 149.2,104.9 151.0,104.9 152.9,104.9 154.7,105.5 156.6,105.5 158.4,104.9 160.2,104.9 162.1,104.9 163.9,104.9 165.7,104.2 167.6,104.2 169.4,104.2 171.2,104.2 173.1,104.2 174.9,104.2 176.7,104.2 178.6,104.2 180.4,104.2 182.2,103.5 184.1,103.5 185.9,103.5 187.7,103.5 189.6,103.5 191.4,103.5 193.2,102.8 195.1,102.8 196.9,102.8 198.7,102.8 200.6,102.8 202.4,102.8 204.2,103.7 206.1,105.1 207.9,103.7 209.7,103.7 211.6,103.7 213.4,103.7 215.2,103.7 217.1,103.7 218.9,103.7 220.7,103.7 222.6,103.7 224.4,103.7 226.2,103.7 228.1,103.7 229.9,103.7 231.7,103.7 233.6,103.7 235.4,103.7 237.2,103.7 239.1,103.7 240.9,103.7 242.8,105.1 244.6,105.1 246.4,105.6 248.3,105.6 250.1,105.8 251.9,105.8 253.8,105.8 255.6,105.8 257.4,105.8 259.3,105.8 261.1,105.8 262.9,105.8 264.8,105.8 266.6,105.8 268.4,105.8 270.3,105.8 272.1,105.8 273.9,105.8 275.8,105.8 277.6,105.8 279.4,105.8 281.3,105.8 283.1,105.8 284.9,105.8 286.8,105.8 288.6,105.8 290.4,105.8 292.3,105.8 294.1,105.8 295.9,105.8 297.8,105.8 299.6,105.8 301.4,105.8 303.3,105.8 305.1,105.8 306.9,105.8 308.8,105.8 310.6,105.8 312.4,105.8 314.3,105.8 316.1,105.8 317.9,105.8 319.8,105.8 321.6,105.8 323.4,105.8 325.3,105.8 327.1,105.8 329.0,105.8 330.8,105.8 332.6,105.8 334.5,105.8 336.3,105.8 338.1,105.8 340.0,105.8 341.8,105.8 343.6,105.8 345.5,105.8 347.3,105.8 349.1,105.8 351.0,105.8 352.8,105.8 354.6,105.8 356.5,105.8 358.3,105.8 360.1,105.8 362.0,105.8 363.8,105.8 365.6,105.8 367.5,105.8 369.3,105.8 371.1,105.8 373.0,105.8 374.8,105.8 376.6,105.8 378.5,105.3 380.3,105.3 382.1,105.3 384.0,105.3 385.8,105.3 387.6,105.3 389.5,105.3 391.3,105.3 393.1,105.3 395.0,105.3 396.8,105.3 398.6,105.3 400.5,105.3 402.3,105.3 404.1,105.3 406.0,105.3 407.8,105.3 409.7,105.3 411.5,105.3 413.3,105.3 415.2,105.3 417.0,105.3 418.8,105.8 420.7,106.6 422.5,106.6 424.3,106.6 426.2,106.6 428.0,106.6 429.8,106.6 431.7,106.6 433.5,106.6 435.3,107.4 437.2,107.4 439.0,107.4 440.8,107.4 442.7,107.4 444.5,107.4 446.3,107.4 448.2,107.4 450.0,107.4" fill="none" stroke="var(--c2)" stroke-width="2"/>
<circle cx="101.5" cy="102.9" r="4" fill="var(--c1)"/>
<circle cx="103.4" cy="109.2" r="4" fill="var(--c1)"/>
<circle cx="105.2" cy="118.7" r="4" fill="var(--c1)"/>
<circle cx="143.7" cy="115.3" r="4" fill="var(--c1)"/>
<circle cx="147.4" cy="114.2" r="4" fill="var(--c1)"/>
<circle cx="152.9" cy="108.0" r="4" fill="var(--c1)"/>
<circle cx="169.4" cy="107.1" r="4" fill="var(--c1)"/>
<circle cx="202.4" cy="105.6" r="4" fill="var(--c1)"/>
<circle cx="204.2" cy="125.3" r="4" fill="var(--c1)"/>
<circle cx="240.9" cy="111.0" r="4" fill="var(--c1)"/>
<circle cx="244.6" cy="112.4" r="4" fill="var(--c1)"/>
<circle cx="248.3" cy="117.0" r="4" fill="var(--c1)"/>
<circle cx="417.0" cy="199.9" r="4" fill="var(--c1)"/>
<circle cx="418.8" cy="122.1" r="4" fill="var(--c1)"/>
<circle cx="433.5" cy="107.7" r="4" fill="var(--c1)"/>
<line x1="60" y1="222" x2="84" y2="222" stroke="var(--c2)" stroke-width="2"/>
<text x="88" y="226" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−VaR95 rolling 250-hari (≈ −2,5% s.d. −3,1%)</text>
<line x1="290" y1="222" x2="314" y2="222" stroke="var(--c4)" stroke-width="1"/>
<text x="318" y="226" font-size="10" fill="var(--text)" font-family="var(--font-ui)">return harian (simple)</text>
<circle cx="52" cy="234" r="4" fill="var(--c1)"/>
<text x="60" y="238" font-size="10" fill="var(--text)" font-family="var(--font-ui)">exceedance: return &lt; −VaR95 (15 hari)</text>
</svg>`,
        alt: "Rolling VaR95 250-hari versus realized return harian selama 230 hari out-of-sample; titik merah adalah 15 exceedance di bawah garis VaR.",
        caption: "Cara membaca: garis tebal = −VaR95 rolling 250-hari (≈ −2,5% s.d. −3,1%); garis tipis = realized return harian (simple returns); titik merah = exceedance (return < −VaR95, 15 hari). Titik terdalam: hari 212 (2026-10-16), return −13,98% — ≈ 4,9× lebih dalam daripada VaR-nya. Kupiec hanya menghitung JUMLAH titik merah (15 vs 11,5 yang diharapkan); seberapa DALAM titik itu adalah tugas Expected Shortfall [M4.2]. Angka dari m9_canonical.json (m9_backtest_wf.roll250_var95).",
      },
      tasks: [],
    },
    {
      id: "kedalaman-exceedance",
      eyebrow: "Langkah 13 · Kedalaman exceedance",
      title: "Backtest ES: jumlah lolos, kedalaman tidak — severity exceedance",
      prose: [
        "Kupiec lolos (p = 0,3108) — 15 exceedance dari 230 hari OOS, diharapkan 11,5. Tapi Kupiec hanya menghitung JUMLAH tembusan. Ia tidak pernah bertanya: SEBERAPA DALAM tembusan itu? VaR95 adalah ambang; ES95 adalah prakiraan kedalaman RATA-RATA bila ambang itu tertembus. Lesson ini belum pernah menguji prakiraan kedalaman itu — dan ketika diuji, ia gagal dengan cara yang Kupiec tidak bisa lihat. Lima belas exceedance rolling-250 VaR95 [turunan] — hari OOS 40, 41, 42, 63, 65, 68, 77, 95, 96, 116, 118, 120, 212, 213, 221 — kerugian rata-ratanya 0,0440 [turunan], terdalam 0,1398 pada hari OOS 212 (2026-10-16, return −13,98%) [turunan].",
        "Bandingkan dengan prakiraan ES95 rolling pada hari-hari itu: rata-rata 0,0394 [turunan]. Kerugian aktual rata-rata 0,0440 — rasio severity 1,1163 [turunan] — sekitar 12% LEBIH DALAM dari yang diprakirakan [turunan]. Tujuh dari 15 exceedance (46,7% [turunan]) lebih buruk dari ES forecast hari itu sendiri; tiga dari 15 (20% [turunan]) lebih buruk dari ES95 full-sample 0,0445. Dan yang paling dalam — 0,1398 — adalah 3,18× rata-rata exceedance [turunan]. Vonisnya: jumlah lolos, kedalaman tidak. Kupiec berkata «modelmu tidak tertembus terlalu sering»; severity berkata «tetapi ketika tertembus, ia tertembus lebih dalam dari yang kaujanjikan».",
        "Mengapa ES rolling meremehkan? Karena ES95 full-sample 0,0445 justru sedikit DI ATAS rata-rata kerugian exceedance 0,0440 — yang meremehkan bukan ES-nya, melainkan jendelanya. ES rolling 250-hari dihitung dari 250 hari SEBELUM hari itu; ketika volatilitas naik mendadak (Oktober 2026), jendela itu masih berisi bulan-bulan tenang, jadi prakiraan kedalamannya ketinggalan. Itu penyebab yang sama dengan kegagalan independence (langkah 8): jendela yang bergerak lambat. Tiga hari beruntun 40–42 dan pasangan 212–213 ada di daftar exceedance — kedalaman dan gerombol datang bersamaan: kerugian terdalam tidak datang sendiri-sendiri.",
        "Nilai: backtest ES bagus karena ia menguji APA YANG DIJANJIKAN ES — bukan jumlah tembusan (itu tugas Kupiec), melainkan kedalaman rata-rata tembusan. VaR95 + ES95 adalah pasangan: VaR berkata «seberapa sering», ES berkata «seberapa dalam». Menguji yang pertama tanpa yang kedua sama dengan menguji setengah janji.",
        "Baik atau buruk: perbandingan severity bagus bila ia deskriptif dan jujur tentang batasnya — 15 exceedance adalah sampel KECIL; rasio 1,1163 punya ketidakpastian yang besar, dan lesson ini TIDAK mengklaim uji formal (uji Acerbi–Szekely butuh angka di luar kanonik dan tidak diajarkan di sini — cukup disebut sebagai langkah lanjut). Buruk bila rasio 1,1163 dibaca sebagai «model salah 11,6%» — yang benar: pada 15 kejadian ini, rata-rata kerugian 11,6% lebih dalam dari prakiraan ES rolling [turunan]. Satu angka deskriptif, bukan vonis statistik.",
        "Mitigasi: laporkan severity BERSAMA Kupiec, selalu — tiga angka: jumlah exceedance vs diharapkan, rasio severity (rata-rata kerugian aktual / rata-rata ES forecast), dan kerugian terdalam. Bila rasio severity > 1,10 [kebijakan lesson ini] sementara Kupiec lolos, modelmu «lolos jumlah, gagal kedalaman» — naikkan ES (bukan VaR) dengan jendela lebih pendek atau pembobotan eksponensial, lalu backtest ulang pada data segar.",
      ],
      tasks: [],
      formula: String.raw`\mathrm{rasio\ severity} = \frac{\frac{1}{15}\sum_{i=1}^{15} L_i}{\frac{1}{15}\sum_{i=1}^{15} \widehat{\mathrm{ES}}_{95,i}} = \frac{0{,}0440}{0{,}0394} = 1{,}1163\ \text{(dari nilai tak-bulat)}`,
      formulaNote: "L_i = kerugian aktual pada exceedance ke-i (return negatif hari itu, SIMPLE); EŜ_95,i = prakiraan ES95 rolling-250 pada hari itu; n = 15 exceedance dari 230 hari OOS [turunan]. Rata-rata kerugian 0,0440, rata-rata prakiraan ES 0,0394, rasio 1,1163 [turunan] dihitung dari nilai tak-bulat 0,04402593/0,03943858 [turunan] — dari operan tampil 0,0440/0,0394 hasilnya 1,1168, jadi jangan hitung ulang dari angka bulat. Kerugian aktual sekitar 12% lebih dalam dari prakiraan [turunan]. Kerugian terdalam 0,1398 (hari OOS 212, 2026-10-16). Uji formal Acerbi–Szekely TIDAK diajarkan di lesson ini — ia butuh angka di luar kanonik; perbandingan deskriptif ini cukup untuk verdict.",
      note: {
        title: "15 exceedance adalah sampel kecil — jangan over-klaim",
        type: "risk",
        body: "Rasio 1,1163 dihitung dari 15 kejadian. Dengan n=15, satu kejadian 0,1398 (hari 212) menarik rata-rata ke atas sendirian: tanpa hari itu, rata-rata kerugian 14 exceedance lainnya adalah 0,0372 [turunan] — DI BAWAH rata-rata prakiraan ES 0,0394. Jadi «ES meremehkan 12%» sangat bergantung pada SATU hari. Yang tetap benar tanpa hari 212: 7 dari 15 exceedance lebih buruk dari ES forecast hari itu — dan gerombol 40–42 tetap ada. Bacalah severity sebagai sinyal untuk menyelidiki, bukan sebagai vonis akhir.",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: VaR yang jujur lolos DUA uji — coverage DAN independence",
      prose: [
        "Rangkuman: portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480 (2024-11-04 → 2026-11-11; return pertama 2024-11-04; harga pertama 2024-11-01), sd harian 0,0196; VaR95 historis full-sample 0,0286 [M4.2]. Exceedance = return hari itu < −VaR. Jebakan in-sample [M4.3]: VaR95 full-sample diuji pada sampel yang sama → exceedance 24 dari 480, LR Kupiec = 0, p = 1 — lolos karena dibangun dari data yang sama; VaR99 in-sample: exceedance 5 vs diharapkan 4,8 (by construction). Kupiec POF menguji unconditional coverage SAJA (bukan independence): LR = −2·ln[(1−p)^(n−x)·p^x] + 2·ln[(1−x/n)^(n−x)·(x/n)^x] ~ χ²₁; p-value besar = «tidak ada bukti menolak», BUKAN «model benar». Rolling 250-hari VaR95 OOS (n=230): exceedance 15, diharapkan 11,5, laju 6,52%, LR = 1,0275, p = 0,3108 — tidak menolak H0. Rolling 120-hari VaR95 (n=360): exceedance 20, diharapkan 18,0, LR = 0,2261, p = 0,6344. Rolling 250-hari VaR99 (n=230): exceedance 4, diharapkan 2,3, LR = 1,0398, p = 0,3079. Expanding-window VaR95 (n=230): exceedance 16, diharapkan 11,5, LR = 1,6611, p = 0,1975. Tidak satu pun menolak H0 — jendela dan skema memengaruhi angka, bukan vonis Kupiec-nya. Christoffersen independence (rolling-250 VaR95, 229 transisi): n00=203, n01=11, n10=11, n11=4; π = 0,0655; π01 = 0,0514; π11 = 0,2667 — π11 adalah 5,2× π01 (0,2667/0,0514 = 5,19) dan 4,1× π (0,2667/0,0655 = 4,07), jangan tertukar pembandingnya; LR_ind = 6,6456, p = 0,0099 — independensi DITOLAK; LR_cc gabungan = 7,6731, p = 0,0216 — conditional coverage DITOLAK walau Kupiec lolos. Gerombolnya: tiga hari beruntun 40–42 (2026-01-26 s.d. 28) + pasangan 95–96 dan 212–213; hari 212 (2026-10-16) return −13,98% — hari terburuk portofolio, kerugian Rp13.983.464 pada Rp100jt [M9.2 skenario]. Penyebab yang paling mungkin: volatility clustering (return kuadrat lag-1 berkorelasi 0,1043 [M4.3]) + jendela 250-hari yang bergerak lambat. Walk-forward vs single split: 8 folds — RF 0,5250 / LR 0,5688 / tree 0,5188 / GBM 0,5062 / naive 0,5625, vs random CV RF 0,5326 / LR 0,6000 [M4.1] (random CV melebihi walk-forward karena mengacak waktu; naive mengalahkan RF/tree/GBM dalam walk-forward); nested CV GBM 0,7858 [M6.2] (sd antar-fold 0,0068) vs single-split test 0,7823 [M6.2]; BBCA walk-forward mean ROC-AUC 0,5516 [M6.2]; pseudo-time chunks 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006, roc_spread 0,0710 (= 0,8138 − 0,7428), roc_drop 0,0388 (= 0,7816 − 0,7428) [M7.5]. Validation halves [M8.1] adalah split acak, BUKAN walk-forward — jangan klaim halves membuktikan stabilitas waktu. Basel traffic-light (fakta regulasi): 3 exceedance 99% dalam 250 hari terakhir → GREEN (0–4 GREEN multiplier 3,00; 5–9 YELLOW multiplier 3,40–3,85; ≥10 RED multiplier 4,00). Jebakan: backtest yang «dilatih» — mencoba banyak jendela/skema dan hanya melaporkan yang lolos (multiple testing: 20 percobaan pada 5% ≈ 64% peluang satu lolos kebetulan); laporkan SEMUA varian yang dicoba. Mini-case: TIDAK LOLOS sebagai model — Kupiec lolos (p = 0,3108) tapi independence gagal (p = 0,0099); coverage tanpa independence berarti kerugian datang bergerombol tepat saat modal paling dibutuhkan; perbaiki adaptasinya (jendela lebih pendek / pembobotan eksponensial / ES sebagai pelengkap [M4.2]) lalu backtest ulang pada data segar. Lab: rolling VaR backtest + Kupiec (n_oos=230, n_exceed=15, lr_kupiec=1,0275, p_value=0,3108, lolos=True); Christoffersen + Basel (n11=4, pi11=0,2667, lr_ind=6,6456, p_cc=0,0216, zone=GREEN). Backtest ES / severity (langkah 13): 15 exceedance, kerugian rata-rata 0,0440 vs prakiraan ES95 rolling 0,0394 — rasio severity 1,1163 [turunan]; 7/15 lebih buruk dari ES forecast hari itu, 3/15 lebih buruk dari ES95 full-sample 0,0445; terdalam 0,1398 (hari OOS 212). Verdict: jumlah lolos, kedalaman tidak.",
        "Guided task di Colab — notebook mlf-m93-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data harga: rolling VaR backtest + Kupiec (empat varian OOS), jebakan in-sample, Christoffersen independence, zona Basel, dan bukti walk-forward [M4.1/M6.2/M7.5], ditutup verdict mini-case. Tautan Colab: https://colab.research.google.com/drive/1Am2BJgns7_KkO9S-tesSMG5f50j9_SDS",
        "Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu VaR dengan backtest yang «lolos», tanyakan dua hal — berapa kali ia tertembus (coverage)? Dan apakah tembusannya datang sendiri-sendiri atau bergerombol (independence)? Bila satu jawabannya kosong, VaR itu belum menjadi ukuran.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Uji Kupiec POF menguji apa — dan apa yang TIDAK diujinya?",
          options: [
            { text: "Kupiec menguji unconditional coverage SAJA — apakah jumlah exceedance sesuai janji (1 − α); ia TIDAK menguji apakah exceedance tersebar acak (independence)", why: "Benar: Kupiec membandingkan frekuensi teramati (x/n) dengan yang dijanjikan (p) — 15/230 = 0,0652 vs 0,05. Urutan exceedance (bergerombol atau tersebar) tidak masuk ke LR-nya sama sekali; itu tugas Christoffersen (langkah 4).", correct: true },
            { text: "Kupiec menguji coverage DAN independence sekaligus — satu uji untuk keduanya", why: "Salah: itu uji GABUNGAN (conditional coverage, LR_cc = LR_POF + LR_ind). Kupiec sendiri hanya coverage. Model kita membuktikannya: Kupiec lolos (p = 0,3108) sementara independence gagal (p = 0,0099) — satu uji tidak bisa memberi dua vonis yang berbeda bila ia menguji keduanya." },
            { text: "Kupiec menguji seberapa DALAM kerugian saat exceedance — apakah kerugiannya melebihi VaR dengan jauh", why: "Salah: Kupiec hanya menghitung JUMLAH exceedance — ia buta terhadap besaran. Hari 212 (return −13,98%, ≈ 4,9× VaR) dihitung sama dengan exceedance −3,1%. Besaran kerugian saat exceedance adalah tugas Expected Shortfall [M4.2]." },
            { text: "Kupiec menguji apakah VaR dihitung dari jendela yang benar (250 vs 120 hari)", why: "Salah: Kupiec tidak tahu — dan tidak peduli — jendela apa yang dipakai. Ia hanya menerima n dan x. Pilihan jendela diuji dengan MEMBANDINGKAN varian (langkah 3), bukan dengan Kupiec." },
          ],
        },
        {
          q: "Rolling 250-hari VaR95 OOS: n=230, exceedance x=15, diharapkan 11,5, LR=1,0275, p=0,3108. Kesimpulan yang benar pada taraf 5%?",
          options: [
            { text: "Tolak H0 — 15 exceedance lebih banyak dari 11,5 yang diharapkan, jadi VaR terbukti tidak jujur", why: "Salah: «lebih banyak» bukan vonis — vonisnya dari LR vs nilai kritis χ²₁ 3,841. LR = 1,0275 < 3,841, p = 0,3108 > 0,05: selisih 3,5 exceedance masih di dalam noise untuk n=230." },
            { text: "Tidak ada bukti menolak H0 — p = 0,3108 berarti hasil 15 dari 230 akan muncul 31,08% dari waktu bila VaR ini jujur; ini BUKAN bukti VaR terbukti benar", why: "Benar: LR 1,0275 < 3,841 (nilai kritis 5%), p = 0,3108 > 0,05 — H0 tidak ditolak. Dan «tidak menolak» adalah vonis tentang bukti, bukan tentang model: dengan n=230, Kupiec tidak punya kuasa membedakan 0,05 dari 0,0652.", correct: true },
            { text: "VaR terbukti benar — p = 0,3108 berarti peluang model benar adalah 31,08%", why: "Salah dua kali: p-value BUKAN peluang H0 benar (ia peluang data-se-ekstrem-ini bila H0 benar), dan 0,3108 bukan «bukti benar» — ia «tidak ada bukti menolak». Membaca p-value sebagai peluang model benar adalah kesalahan interpretasi yang paling umum." },
            { text: "Tidak bisa diputuskan — p = 0,3108 terlalu besar untuk menjadi bukti apa pun", why: "Salah: p = 0,3108 ADALAH keputusan: H0 tidak ditolak pada 5%. «Tidak menolak» adalah vonis yang sah — yang harus ditulis bersama kekuatannya («bukti lemah: n=230»), bukan dibuang karena «terlalu besar»." },
          ],
        },
        {
          q: "Empat varian OOS: rolling-250 VaR95 (15/230, p=0,3108), rolling-120 VaR95 (20/360, p=0,6344), rolling-250 VaR99 (4/230, p=0,3079), expanding VaR95 (16/230, p=0,1975). Apa yang benar?",
          options: [
            { text: "Keempatnya tidak menolak H0 — jendela dan skema memengaruhi ANGKA (laju 5,56% s.d. 6,96%), tetapi vonis Kupiec-nya sama; VaR99 paling lemah buktinya karena hanya 2,3 exceedance yang diharapkan", why: "Benar: p-value keempatnya 0,1975–0,6344, semuanya di atas 0,05. Rolling-120 paling dekat dengan janji (5,56% vs 5%), expanding paling jauh (6,96%) — tetapi tidak satu pun menolak H0. Dan VaR99 (diharapkan 2,3) hampir tidak punya kuasa uji: 4 exceedance — hampir dua kali lipat janji — tetap p = 0,3079.", correct: true },
            { text: "Expanding VaR95 gagal — 16 exceedance adalah yang terbanyak, jadi skema expanding harus dibuang", why: "Salah: 16 vs diharapkan 11,5 memberi LR = 1,6611, p = 0,1975 — TIDAK menolak H0. «Terbanyak» bukan «gagal»; vonisnya dari uji, bukan dari peringkat." },
            { text: "VaR99 gagal — 4 exceedance hampir dua kali lipat dari 2,3 yang diharapkan", why: "Salah: 4 vs 2,3 memberi LR = 1,0398, p = 0,3079 — tidak menolak H0. Dengan hanya 2,3 yang diharapkan, Kupiec tidak punya kuasa untuk menolak atas selisih sekecil itu — itulah kenapa «tidak menolak» pada VaR99 adalah bukti yang lemah." },
            { text: "Rolling-120 adalah satu-satunya varian yang bisa dipercaya — n=360 terbesar, jadi p-value-nya paling besar", why: "Salah: n terbesar memang memberi kuasa uji terbesar — tetapi p-value terbesar (0,6344) bukan «paling bisa dipercaya»; p-value besar berarti «hasilnya paling biasa di bawah H0», bukan «varian terbaik». Keempat varian dilaporkan bersama-sama justru karena tidak ada satu pun yang istimewa." },
          ],
        },
        {
          q: "Christoffersen: π01 = 0,0514, π11 = 0,2667, π (unconditional) = 0,0655. Pernyataan rasio mana yang BENAR?",
          options: [
            { text: "π11 adalah 4,1× π01 — sesudah exceedance, peluang exceedance 4,1 kali peluang sesudah hari tenang", why: "Salah: 0,2667/0,0514 = 5,19 — π11 adalah 5,2× π01, bukan 4,1×. Angka 4,1× adalah perbandingan dengan pembanding yang BERBEDA (π unconditional 0,0655): 0,2667/0,0655 = 4,07. Menukar pembanding adalah salah aritmetika." },
            { text: "π11 adalah 5,2× π01 (0,2667/0,0514 = 5,19) DAN 4,1× π (0,2667/0,0655 = 4,07) — dua perbandingan yang benar dengan pembandingnya masing-masing", why: "Benar: 5,2× membandingkan dengan «sesudah hari tenang» (π01 = 0,0514); 4,1× membandingkan dengan «rata-rata hari mana pun» (π = 0,0655). Keduanya benar — dengan pembandingnya — dan keduanya salah bila pembandingnya ditukar.", correct: true },
            { text: "π11 adalah 5,2× π — sesudah exceedance, peluang exceedance 5,2 kali peluang rata-rata", why: "Salah: 0,2667/0,0655 = 4,07 — π11 adalah 4,1× π, bukan 5,2×. Angka 5,2× adalah perbandingan dengan π01 (0,0514): 0,2667/0,0514 = 5,19. Pembandingnya tertukar." },
            { text: "π11 ≈ π01 — peluang exceedance sesudah exceedance kira-kira sama dengan sesudah hari tenang", why: "Salah: 0,2667 vs 0,0514 — berbeda 5,2× lipat. Bila keduanya sama, LR_ind akan mendekati 0; kenyataannya LR_ind = 6,6456 (p = 0,0099) — independensi DITOLAK justru karena keduanya jauh berbeda." },
          ],
        },
        {
          q: "LR_ind = 6,6456 (p = 0,0099) dan LR_cc = 7,6731 (p = 0,0216), sementara Kupiec LR = 1,0275 (p = 0,3108). Apa vonisnya?",
          options: [
            { text: "Model lolos — Kupiec lolos dan itu uji yang utama; independence hanya tambahan", why: "Salah: independence BUKAN tambahan — ia setengah dari conditional coverage (LR_cc = LR_POF + LR_ind = 7,6731, p = 0,0216). LR_cc SUDAH mencakup Kupiec, dan vonisnya menolak. «Lolos Kupiec» tanpa «lolos independence» sama dengan lolos setengah ujian." },
            { text: "Independensi DITOLAK (p = 0,0099 < 0,05) dan conditional coverage DITOLAK (p = 0,0216) — exceedance bergerombol walau jumlahnya sesuai janji; Kupiec yang lolos tidak menyelamatkan model", why: "Benar: LR_ind 6,6456 > 3,841 (kritis χ²₁ 5%) — dan LR_cc 7,6731 = 1,0275 + 6,6456 > 5,991 (kritis χ²₂ 5%). Vonis gabungannya ditentukan komponen independence-nya. Coverage yang lolos + independence yang gagal = model yang gagal uji gabungannya.", correct: true },
            { text: "Independensi lolos — p = 0,0099 sangat kecil, jadi buktinya sangat kuat bahwa exceedance independen", why: "Terbalik: p KECIL berarti H0 (independence) DITOLAK — hasil ini hanya muncul 0,99% dari waktu bila exceedance benar-benar independen. p kecil = bukti MELAWAN H0, bukan mendukungnya." },
            { text: "LR_cc menguji coverage saja — 7,6731 berarti coverage-nya gagal, independence-nya lolos", why: "Salah: LR_cc = LR_POF + LR_ind adalah uji GABUNGAN (coverage DAN independence). Komponen coverage-nya (LR_POF = 1,0275) lolos; komponen independence-nya (LR_ind = 6,6456) gagal — dan jumlahnya 7,6731 menolak. Membaca LR_cc sebagai «coverage saja» membalik fakta." },
          ],
        },
        {
          q: "Walk-forward vs single split — bukti mana yang PALING menunjukkan satu split tidak cukup?",
          options: [
            { text: "Nested CV GBM 0,7858 (sd antar-fold 0,0068) [M6.2] — karena sd-nya kecil, model terbukti stabil sepanjang waktu", why: "Salah: nested CV menguji stabilitas terhadap PEMILIHAN SAMPEL ACAK — fold-nya diacak, waktunya diabaikan. Ia tidak membuktikan stabilitas WAKTU. Yang membuktikan ketidakstabilan waktu adalah chunk terburuk M7.5 (0,7428, roc_drop 0,0388)." },
            { text: "[M4.1] random CV LR 0,6000 vs walk-forward 0,5688, dan naive 0,5625 mengalahkan RF 0,5250 / tree 0,5188 / GBM 0,5062 dalam walk-forward — random CV melebihi walk-forward karena mengacak waktu, dan walk-forward menampakkan model yang tidak mengalahkan naive", why: "Benar: dua fakta sekaligus — random CV (0,6000) melebihi walk-forward (0,5688) karena «menguji» masa depan dengan potongan masa depan; dan dalam walk-forward, naive (0,5625) mengalahkan tiga model kompleks. Single split / random CV menyembunyikan keduanya.", correct: true },
            { text: "[M7.5] pseudo-time chunks 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006 — karena rata-ratanya 0,7816 sama dengan single-split test", why: "Salah: rata-rata chunk itu (0,7449+0,7428+0,8138+0,8041+0,8006)/5 = 0,7812 — dekat dengan 0,7823, tetapi POIN-nya bukan rata-rata: spread 0,0710 (0,8138 − 0,7428) dan roc_drop 0,0388 menunjukkan satu split (0,7816) menyembunyikan chunk terburuk 0,7428." },
            { text: "Validation halves M8.1 (half A 0,7885 vs half B 0,7746) — karena halves membuktikan stabilitas waktu", why: "Salah: halves adalah split ACAK, BUKAN walk-forward — ia mengukur noise sampling (selisih −0,0139), bukan stabilitas waktu. Mengklaim halves membuktikan stabilitas waktu adalah kesalahan yang diperingatkan M8.1 langkah desain validasi." },
          ],
        },
        {
          q: "Basel traffic-light: 3 exceedance VaR99 dalam 250 hari terakhir. Zona dan konsekuensinya?",
          options: [
            { text: "YELLOW — 3 exceedance sudah di atas batas hijau, multiplier naik menjadi 3,40", why: "Salah: zona hijau Basel adalah 0–4 exceedance (multiplier 3,00). 3 exceedance masih di dalam hijau — jauh dari batas kuning (5). Multiplier 3,40 berlaku pada 5 exceedance, bukan 3." },
            { text: "GREEN — 3 exceedance di dalam 0–4 (multiplier modal 3,00); YELLOW 5–9 (multiplier 3,40–3,85), RED ≥10 (multiplier 4,00). GREEN adalah syarat minimum regulasi, bukan vonis «model valid»", why: "Benar: 3 ≤ 4 → GREEN. Dan GREEN tidak memadamkan vonis independence (langkah 4): Basel hanya menghitung JUMLAH, bukan URUTAN — model kita GREEN di Basel tapi gagal independence.", correct: true },
            { text: "RED — VaR99 seharusnya hanya tertembus 2,3 kali; 3 sudah terlalu banyak", why: "Salah: «seharusnya 2,3» adalah harapan Kupiec (230 × 0,01), bukan ambang Basel. Ambang Basel: GREEN 0–4, YELLOW 5–9, RED ≥10 — 3 exceedance → GREEN. Dan jangan campur dua hitungan: p = 0,3079 adalah Kupiec VaR99 ROLLING langkah 3 (4 exceedance dari 230 hari OOS), bukan p untuk 3 exceedance Basel — keduanya mengukur hal yang berbeda (satu ambang tetap dalam 250 hari terakhir vs ambang rolling selama 230 hari OOS)." },
            { text: "GREEN — dan karena GREEN, model lolos validasi lengkap tanpa perlu uji independence", why: "Salah: GREEN Basel adalah syarat minimum REGULASI, bukan validasi lengkap. Validasi lengkap butuh ketiganya: coverage (Kupiec), independence (Christoffersen), DAN zona Basel. Model kita GREEN + Kupiec lolos + independence GAGAL — jadi TIDAK lolos sebagai model." },
          ],
        },
        {
          q: "Jebakan in-sample dan multiple testing: pernyataan mana yang benar?",
          options: [
            { text: "VaR99 in-sample (exceedance 5 vs diharapkan 4,8) membuktikan VaR99 akurat — Kupiec-nya pasti lolos", why: "Salah: 5 vs 4,8 adalah BY CONSTRUCTION — ambang kuantil 1% dari sampel yang sama hampir pasti dilampaui ~1% sampel itu. Sama seperti VaR95 in-sample [M4.3]: exceedance 24 dari 480, LR = 0, p = 1. Lolos yang dibangun dari data yang sama bukan bukti." },
            { text: "Mencoba banyak jendela/skema lalu hanya melaporkan yang lolos adalah overfitting ke backtest (multiple testing) — laporkan SEMUA varian yang dicoba, lolos maupun tidak", why: "Benar: dengan 20 percobaan pada taraf 5%, peluang SATU lolos kebetulan ≈ 64% (1 − 0,95^20). Di lesson ini keempat varian dilaporkan dan keempatnya lolos (p = 0,3108; 0,6344; 0,3079; 0,1975) — jadi klaimnya jujur. Yang dilarang adalah memilih yang dilaporkan.", correct: true },
            { text: "Mengubah model sampai backtest-nya lolos adalah praktik yang benar — itulah gunanya backtest", why: "Salah: itu overfitting ke backtest. Setiap perubahan yang diputuskan DARI hasil backtest menghabiskan kejujuran backtest itu — backtest berikutnya WAJIB memakai data yang belum dipakai untuk memutuskan perubahan itu, atau ia bukan backtest melainkan latihan." },
            { text: "Backtest in-sample lebih jujur daripada OOS — karena memakai SEMUA 480 hari, bukan hanya 230", why: "Salah: justru sebaliknya — in-sample memakai hari yang sama untuk membangun DAN menguji VaR, sehingga LR = 0 dan p = 1 [M4.3] secara konstruksi. Lebih banyak data tidak membuat uji in-sample jujur; yang membuatnya jujur adalah PEMISAHAN membangun vs menguji." },
          ],
        },
        {
          q: "Mini-case: model VaR baru — Kupiec lolos (p = 0,3108) tapi independence gagal (p = 0,0099), LR_cc = 7,6731 (p = 0,0216), Basel GREEN. Keputusan validator?",
          options: [
            { text: "LOLOS — Kupiec lolos dan Basel GREEN; dua dari tiga sudah cukup", why: "Salah: «dua dari tiga» bukan aturan — conditional coverage (LR_cc) mensyaratkan KEDUANYA (coverage DAN independence), dan LR_cc 7,6731 (p = 0,0216) menolak. Menghitung suara mayoritas dari tiga uji yang mengukur hal berbeda adalah cara yang salah untuk memutuskan." },
            { text: "LOLOS dengan catatan ringan — independence yang gagal hanya berarti exceedance datang berdekatan, bukan model rusak", why: "Salah: «datang berdekatan» BUKAN ringan — π11 5,2× π01 berarti kerugian bergerombol tepat saat modal paling dibutuhkan (tiga hari beruntun 40–42; hari terburuk −13,98% diikuti exceedance lagi). Itu risiko likuiditas, bukan catatan kaki." },
            { text: "TIDAK LOLOS sebagai model dalam bentuknya sekarang — coverage lolos tapi independence gagal, jadi conditional coverage gagal; perbaiki adaptasinya (jendela lebih pendek / pembobotan eksponensial / ES sebagai pelengkap) lalu backtest ulang pada data segar", why: "Benar: LR_cc = 7,6731 (p = 0,0216) adalah vonis gabungan yang SUDAH mencakup Kupiec — dan vonis itu menolak. Yang rusak adalah ADAPTASI (jendela 250-hari bergerak terlalu lambat saat volatilitas naik, [M4.3] return kuadrat lag-1 berkorelasi 0,1043), bukan seluruh model — jadi keputusannya «tidak lolos + syarat perbaikan», bukan penolakan permanen.", correct: true },
            { text: "TOLAK karena Kupiec gagal — 15 exceedance dari 11,5 yang diharapkan membuktikan VaR tidak jujur", why: "Salah: Kupiec TIDAK gagal — LR = 1,0275, p = 0,3108, tidak menolak H0. Yang gagal adalah independence (p = 0,0099) dan gabungannya (p = 0,0216). Menolak «karena Kupiec gagal» adalah vonis dengan alasan yang salah — dan validator yang alasannya salah tidak bisa diaudit." },
          ],
        },
        {
          q: "Rolling-250 VaR95 OOS (n=230): 15 exceedance, diharapkan 11,5 — Kupiec lolos (p = 0,3108). Tetapi 15 exceedance itu punya kerugian rata-rata 0,0440, sementara prakiraan ES95 rolling pada hari-hari itu rata-rata 0,0394 [turunan]. Apa verdict yang benar?",
          options: [
            { text: "«Jumlah lolos, kedalaman tidak»: rasio severity 1,1163 [turunan] — kerugian aktual sekitar 12% lebih dalam dari prakiraan ES [turunan]; 7 dari 15 lebih buruk dari ES forecast hari itu; model lolos Kupiec tapi gagal kedalaman", why: "Benar: Kupiec hanya menguji jumlah, bukan kedalaman — ES95 menjanjikan kedalaman rata-rata 0,0394 dan kenyataannya 0,0440. Verdict mini-case tetap TIDAK LOLOS sebagai model, dengan alasan yang kini bertambah satu: bukan hanya independence yang gagal (p = 0,0099), severity-nya pun meremehkan.", correct: true },
            { text: "Model LOLOS — Kupiec lolos berarti backtest selesai", why: "Salah: Kupiec menguji unconditional coverage SAJA. Severity 1,1163 [turunan] dan independence yang gagal (p = 0,0099) adalah dua kegagalan yang Kupiec tidak bisa lihat — «lolos» di satu uji bukan vonis «model valid».", correct: false },
            { text: "ES95 full-sample 0,0445 membuktikan ES rolling juga benar, karena 0,0445 > 0,0440", why: "Salah: 0,0445 adalah ES FULL-SAMPLE (dihitung dari semua 480 hari, termasuk hari-hari exceedance itu sendiri) — ia bukan prakiraan OOS. Yang diuji adalah prakiraan ES rolling hari itu (rata-rata 0,0394 [turunan]), dan terhadap prakiraan itulah kerugian aktual 0,0440 lebih dalam 11,6% [turunan].", correct: false },
            { text: "Rasio 1,1163 membuktikan model salah tepat 11,6%", why: "Salah: 1,1163 adalah perbandingan DESKRIPTIF dari 15 kejadian — dengan n=15, tanpa hari 212 rata-rata kerugian menjadi 0,0372 [turunan], di bawah prakiraan ES. Uji formal (Acerbi–Szekely) tidak diajarkan di sini; severity adalah sinyal untuk menyelidiki, bukan vonis statistik.", correct: false },
          ],
        },
      ],
      summary: [
        "VaR yang tidak pernah di-backtest adalah klaim, bukan ukuran. Jebakan in-sample [M4.3]: VaR95 full-sample diuji pada sampel yang sama → exceedance 24 dari 480, LR Kupiec = 0, p = 1; VaR99 in-sample: exceedance 5 vs diharapkan 4,8 (by construction). Backtest yang jujur adalah out-of-sample: VaR dibangun dari masa lalu, diuji pada hari yang belum dilihatnya.",
        "Kupiec POF menguji unconditional coverage SAJA (bukan independence): LR = −2·ln[(1−p)^(n−x)·p^x] + 2·ln[(1−x/n)^(n−x)·(x/n)^x] ~ χ²₁; p-value besar = «tidak ada bukti menolak», BUKAN «model benar». Exceedance = return hari itu < −VaR (SIMPLE returns).",
        "Empat varian OOS [m9_canonical.json]: rolling-250 VaR95 — exceedance 15/230, diharapkan 11,5, LR = 1,0275, p = 0,3108; rolling-120 VaR95 — 20/360, diharapkan 18,0, LR = 0,2261, p = 0,6344; rolling-250 VaR99 — 4/230, diharapkan 2,3, LR = 1,0398, p = 0,3079; expanding VaR95 — 16/230, diharapkan 11,5, LR = 1,6611, p = 0,1975. Tidak satu pun menolak H0 — jendela dan skema memengaruhi angka, bukan vonis Kupiec-nya.",
        "Christoffersen independence (rolling-250 VaR95, 229 transisi): n00=203, n01=11, n10=11, n11=4; π = 0,0655; π01 = 0,0514; π11 = 0,2667 — π11 adalah 5,2× π01 dan 4,1× π (jangan tertukar pembandingnya); LR_ind = 6,6456, p = 0,0099 — independensi DITOLAK; LR_cc = 7,6731, p = 0,0216 — conditional coverage DITOLAK walau Kupiec lolos. Gerombol: 40–42, 95–96, 212–213; hari 212 (2026-10-16) return −13,98%.",
        "Walk-forward vs single split: 8 folds — RF 0,5250 / LR 0,5688 / tree 0,5188 / GBM 0,5062 / naive 0,5625, vs random CV RF 0,5326 / LR 0,6000 [M4.1]; nested CV GBM 0,7858 [M6.2] (sd antar-fold 0,0068) vs single-split test 0,7823 [M6.2]; BBCA walk-forward mean ROC-AUC 0,5516 [M6.2]; chunks 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006, roc_spread 0,0710, roc_drop 0,0388 [M7.5]. Halves [M8.1] adalah split acak, BUKAN walk-forward.",
        "Basel traffic-light (fakta regulasi): 3 exceedance 99% dalam 250 hari terakhir → GREEN (0–4 GREEN multiplier 3,00; 5–9 YELLOW multiplier 3,40–3,85; ≥10 RED multiplier 4,00). GREEN adalah syarat minimum regulasi, bukan vonis «model valid».",
        "Jebakan: backtest yang «dilatih» — mencoba banyak jendela/skema dan hanya melaporkan yang lolos (multiple testing); laporkan SEMUA varian yang dicoba. Mengubah model sampai backtest lolos menghabiskan kejujuran backtest itu — backtest ulang WAJIB memakai data segar.",
        "Mini-case: TIDAK LOLOS sebagai model — Kupiec lolos (p = 0,3108) tapi independence gagal (p = 0,0099); coverage tanpa independence berarti kerugian datang bergerombol tepat saat modal paling dibutuhkan.",
        "Lab: rolling VaR backtest + Kupiec (n_oos=230, n_exceed=15, lr_kupiec=1,0275, p_value=0,3108, lolos=True); Christoffersen + Basel (n11=4, pi11=0,2667, lr_ind=6,6456, p_cc=0,0216, zone=GREEN).",
        "Backtest ES / severity (langkah 13) [turunan]: 15 exceedance, kerugian rata-rata 0,0440 vs prakiraan ES95 rolling 0,0394 — rasio severity 1,1163 (sekitar 12% lebih dalam); 7/15 lebih buruk dari ES forecast hari itu, 3/15 lebih buruk dari ES95 full-sample 0,0445; terdalam 0,1398 (hari OOS 212).",
        "Verdict: jumlah lolos (Kupiec p = 0,3108), kedalaman tidak — laporkan severity BERSAMA Kupiec; rasio > 1,10 [kebijakan lesson ini] = «lolos jumlah, gagal kedalaman».",
      ],
      next: { label: "Lanjut: MLF-M9.4 — Sensitivity Analysis", href: "/v2/learn/mlf-m94-sensitivity-analysis" },
    },
  ],
};
