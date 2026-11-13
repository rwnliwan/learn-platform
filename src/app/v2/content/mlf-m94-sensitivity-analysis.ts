import type { V2Lesson } from "../lib/types";

export const mlfM94: V2Lesson = {
  slug: "mlf-m94-sensitivity-analysis",
  track: "Machine Learning Finance",
  module: "Simulation, Backtesting & Validation",
  title: "MLF-M9.4 — Sensitivity Analysis: Input Mana yang Paling Menggerakkan Jawabanmu?",
  estMinutes: 85,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "VaR 0,0328 — tapi seberapa yakin kamu pada angka itu?",
      prose: [
        "Portofolio equal-weight BBCA/KLBF/UNVR punya VaR95 parametrik 0,0328 [M4.2]: dalam satu hari, dengan keyakinan 95%, kerugian tidak melebihi 3,28% nilai portofolio. Angka itu dihitung dari dua input — mean return harian μ_d −0,000558 dan simpangan baku harian σ_d 0,0196 — plus satu pilihan — tingkat keyakinan α = 95% (z = 1,645). Pertanyaan lesson ini bukan «berapa VaR-nya?» — itu sudah dijawab M4.2. Pertanyaannya: bila SATU input itu salah sedikit, VaR bergerak berapa? Bila vol naik 10%, apakah VaR naik 1% atau 10%? Bila korelasi antar-saham naik saat stress, apakah VaR ikut naik — dan seberapa besar? Jawaban atas pertanyaan-pertanyaan itulah SENSITIVITY ANALYSIS: peta tentang input mana yang paling menggerakkan jawabanmu.",
        "Semua return di lesson ini adalah SIMPLE daily return (bukan log return): VaR parametrik M4.2 memakai simple return portofolio (n=480), dan σ_port 0,0196 dihitung dari matriks kovarians ketiga saham — konsisten dengan σ_d yang sama. Simulasi GBM di M9.1 memakai LOG return — jangan campur keduanya: angka lesson ini tidak berlaku untuk log return, dan sebaliknya. Basis lesson ini [m9_canonical.json]: VaR95 parametrik 0,0328; μ_d −0,000558 (dibulatkan −0,0006 di m9_canonical.json); σ_d 0,0196; matriks korelasi BBCA–KLBF 0,3488, BBCA–UNVR 0,2774, KLBF–UNVR 0,2897; σ_port dari matriks kovarians 0,0196 — sama dengan σ_d, jadi basisnya konsisten dari dua arah.",
        "Peta lesson: cerita VaR 0,0328 dan pertanyaan «seberapa yakin?» → tornado one-at-a-time: ranking input dan kenapa α terbesar dan μ terkecil → multi-way: σ dan korelasi bergerak bersama, interaksi +0,6 poin persen → sensitivitas model kredit: LGD dan margin menggerakkan profit, dan profit PALING sensitif terhadap margin → sensitivitas vs ketidakpastian: dua pertanyaan yang berbeda, keduanya dibutuhkan → jebakan sensitivitas lokal vs global → mini-case: komite tanya «VaR naik berapa bila vol naik 20%?» — hitung eksak, jangan interpolasi → 2 lab → 2 figure → cara melaporkan sensitivitas → checkpoint.",
        "Nilai: sensitivity analysis bagus karena ia mengubah satu angka («VaR 0,0328») menjadi PETA RISIKO: kamu tahu input mana yang wajib diukur dengan teliti (α dan σ), input mana yang boleh diperkirakan kasar (μ), dan input mana yang berbahaya bila bergerak bersama (σ dan korelasi saat stress). Tanpa peta ini, semua input terlihat sama pentingnya — dan waktu validasi habis untuk mengukur hal yang tidak menggerakkan jawaban.",
        "Baik atau buruk: VaR 0,0328 itu bagus sebagai TITIK AWAL — ia direplikasi dari data dan konsisten dari dua arah (σ_d langsung 0,0196 = σ_port dari kovarians 0,0196). Buruk bila dibaca sebagai «jawaban» tanpa peta sensitivitasnya: VaR yang sama bisa menjadi 0,0296 atau 0,0390 hanya karena satu input bergerak 10% atau satu pilihan α berubah — dan komite yang hanya melihat 0,0328 tidak tahu itu.",
        "Mitigasi: jangan pernah melaporkan satu angka hasil model tanpa satu baris sensitivitasnya: «VaR95 0,0328; naik 10% bila σ naik 10%; naik 18,8% bila α naik ke 97,5%». Lesson ini memberi baris itu — dan cara menghitungnya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: angka hasil model adalah «jawaban»",
        type: "pitfall",
        body: "Yang benar: VaR 0,0328 adalah jawaban UNTUK SATU SET INPUT (μ_d −0,000558; σ_d 0,0196; α = 95%). Ubah satu input, jawabannya berubah — dan seberapa besar ia berubah adalah informasi yang sama pentingnya dengan jawabannya. Sensitivity analysis adalah cara membaca jawaban bersama peta perubahannya.",
      },
    },
    {
      id: "tornado",
      eyebrow: "Langkah 2 · Tornado",
      title: "Tornado one-at-a-time: ubah satu input, catat berapa VaR bergerak",
      prose: [
        "Definisi eksak: SENSITIVITAS adalah turunan — atau beda hingga — output terhadap SATU input, dengan semua input lain ditahan tetap (one-at-a-time). Tornado chart adalah cara menyajikannya: tiap baris adalah satu input yang diganggu sebesar yang ditentukan, dan panjang barnya adalah perubahan output (ΔVaR95) terhadap basis. Basis [m9_canonical.json]: VaR95 parametrik 0,0328 (μ_d −0,000558, σ_d 0,0196, α = 95%, z = 1,645). Rumus yang dipakai: VaR95 = −(μ_d − z·σ_d) = −μ_d + z·σ_d — VaR adalah kerugian positif, jadi tanda minus membalik return negatif menjadi kerugian.",
        "Nilai [m9_canonical.json] — tornado terurut dari |Δ| terbesar (nilai mutlak ΔVaR95): α 95% → 97,5% (z 1,645 → 1,96) → VaR95 0,0390 (Δ +0,0062, +18,8%) — TERBESAR; σ +10% → 0,0361 (Δ +0,0032, +9,8%); σ −10% → 0,0296 (Δ −0,0032, −9,8%); korelasi +0,1 semua pasangan → 0,0347 (Δ +0,0019, +5,8%; σ_port naik 0,0196 → 0,0208 tak-bulat 0,020780 — memakai 0,0208 bulat memberi 0,0348, selisih 0,0001 murni pembulatan; kanonis memakai nilai tak-bulat — berbeda dari lab 1 yang memakai 0,0208 bulat; begitu juga persentase Δ-nya: +9,8% dihitung dari nilai tak-bulat [turunan] (0,036055/0,032828), bukan dari angka tampil 0,0361/0,0328 (yang memberi ≈ +10,1% — selisihnya pembulatan, bukan kesalahan)); μ +0,0005 → 0,0323 (Δ −0,0005, −1,5%); μ −0,0005 → 0,0333 (Δ +0,0005, +1,5%) — TERKECIL. Perhatikan simetrinya: σ ±10% memberi Δ yang sama besar (±0,0032) karena VaR linear dalam σ; μ ±0,0005 memberi Δ yang sama besar (±0,0005) karena VaR linear dalam μ — dengan tanda berlawanan: μ naik MENURUNKAN VaR (return rata-rata lebih baik → kerugian lebih kecil).",
        "KENAPA α paling besar? Karena α mengubah z — pengali ekor — dari 1,645 menjadi 1,96: z naik 19,1% (0,315/1,645), dan karena VaR didominasi suku z·σ_d (0,0322 dari total 0,0328), kenaikan z itu hampir sepenuhnya diteruskan ke VaR: +18,8%. α bukan «parameter statistik yang diestimasi dari data» — ia PILIHAN kebijakan (seberapa jauh ke ekor kamu mau melihat). Justru karena ia pilihan, dampaknya paling besar: mengganti α dari 95% ke 97,5% menggerakkan VaR lebih besar daripada kesalahan estimasi σ sebesar 10%. KENAPA μ paling kecil? Karena μ_d hanya −0,000558 — sekitar 1/35 dari σ_d 0,0196. VaR95 = 0,000558 + 1,645 × 0,0196: suku μ menyumbang 0,0006 dari 0,0328 (di bawah 2%). Menggeser μ sebesar 0,0005 — hampir sebesar μ itu sendiri — hanya menggeser VaR sebesar 0,0005. VaR didominasi σ, bukan μ — dan tornado membuktikannya dengan angka, bukan dengan intuisi.",
        "Nilai: tornado bagus karena ia memberi RANKING yang bisa ditindaklanjuti: ukur α dan σ dengan teliti (keduanya menggerakkan VaR 10–19%), korelasi secukupnya (5,8%), dan jangan habiskan waktu memperdebatkan μ sampai 4 desimal (1,5%). Ranking ini juga yang dipakai lab 1 — dan figure 1 menggambarkannya.",
        "Baik atau buruk: tornado one-at-a-time bagus bila gangguan tiap input dipilih JUJUR — sebesar ketidakpastian input itu yang sebenarnya (σ ±10% adalah gangguan yang realistis untuk estimasi σ dari 480 hari; α 95→97,5 adalah pilihan kebijakan yang nyata). Buruk bila gangguannya dipilih supaya barnya terlihat besar atau kecil: tornado dengan gangguan yang dibuat-buat adalah grafik yang berbohong dengan sumbu yang benar. Dan buruk bila dibaca sebagai «μ tidak penting» — μ tidak penting DI TITIK INI (langkah 6).",
        "Mitigasi: setiap kali kamu membaca tornado, tanyakan dua hal: (1) «gangguan sebesar ini realistis tidak untuk input itu?» dan (2) «apa yang TIDAK ditunjukkan tornado ini?» — jawabannya: interaksi antar-input (langkah 3) dan sensitivitas di titik lain (langkah 6).",
      ],
      formula: String.raw`\mathrm{VaR}_{95} = -(\mu_d - z_{0{,}95}\,\sigma_d) = -\mu_d + 1{,}645\,\sigma_d, \qquad \mathrm{VaR}_{95}^{\text{basis}} = 0{,}000558 + 1{,}645 \times 0{,}0196 = 0{,}0328`,
      formulaNote: "VaR95 parametrik (kerugian positif) dari simple daily return portofolio equal-weight BBCA/KLBF/UNVR (n=480) [M4.2]. μ_d −0,000558 (dibulatkan −0,0006 di m9_canonical.json); σ_d 0,0196; z 1,645 untuk α = 95%. Tornado di langkah ini memakai rumus ini satu input demi satu input — semua angka tornado berasal dari m9_canonical.json.",
      tasks: [],
      note: {
        title: "Jebakan: membaca tornado sebagai «input ini penting, input itu tidak»",
        type: "pitfall",
        body: "Yang benar: tornado mengukur sensitivitas LOKAL — di titik basis ini, dengan gangguan sebesar ini. μ yang «tidak sensitif» di sini (Δ 1,5%) tetap tidak sensitif di titik lain — karena VaR linear dalam μ, Δ-nya tetap 0,0005; yang naik hanya porsi suku μ (langkah 6) — dan ranking tornado berubah bila gangguannya berubah. Yang dibaca dari tornado adalah «di titik ini, dengan gangguan ini, urutannya begini» — bukan vonis permanen tentang pentingnya tiap input.",
      },
    },
    {
      id: "multiway",
      eyebrow: "Langkah 3 · Multi-way",
      title: "Multi-way: bila σ dan korelasi bergerak BERSAMA, jumlahnya tidak berlaku",
      prose: [
        "One-at-a-time menahan semua input lain tetap. Dunia nyata tidak begitu: saat stress, vol naik DAN korelasi naik bersamaan — korelasi naik saat stress [M4.5], dan stress VaR95 0,0431 [M4.5] adalah bukti bahwa gabungan keduanya jauh lebih besar dari basis. Multi-way sensitivity menggerakkan DUA input sekaligus dan membandingkan hasilnya dengan JUMLAH efek masing-masing sendiri. Selisih antara keduanya adalah INTERAKSI: bagian dari efek gabungan yang tidak bisa dijelaskan oleh penjumlahan efek sendiri-sendiri.",
        "Nilai [m9_canonical.json]: σ +10% DAN korelasi +0,1 semua pasangan → VaR95 0,0382 (Δ +0,0053, +16,2%). Jumlah efek sendiri: σ +10% sendiri +9,8% dan korelasi +0,1 sendiri +5,8% — jumlahnya 15,6%. Efek gabungan 16,2% LEBIH BESAR 0,6 poin persen daripada jumlah bagiannya: interaksi +0,6 pp. Tuliskan dengan hati-hati: efek gabungan SEDIKIT lebih besar dari jumlah bagiannya — JANGAN klaim «jauh lebih besar». 0,6 poin persen di atas 15,6% adalah interaksi yang nyata tapi kecil: sekitar 4% dari efek gabungan. Kenapa ada interaksi sama sekali? Karena korelasi yang lebih tinggi membuat kenaikan σ tiap saham lebih banyak diteruskan ke σ_port — σ_port dari kovarians naik lebih dari sekadar 10% bila korelasinya ikut naik. (σ_port dengan korelasi +0,1 saja adalah 0,0208; dengan σ +10% pula, σ_port menjadi 0,0208 × 1,1 = 0,0229 — dan VaR95 = 0,000558 + 1,645 × 0,0229 = 0,0382.)",
        "Nilai: multi-way bagus karena ia menangkap apa yang disembunyikan tornado: one-at-a-time MEREMEHKAN risiko bila input bergerak bersama. Di sini remehnya kecil (+0,6 pp) — tapi arahnya penting: efek gabungan LEBIH BESAR dari jumlah bagiannya, bukan lebih kecil. Validator yang hanya membaca tornado akan melaporkan «σ +10% menaikkan VaR 9,8%» kepada komite — dan komite yang menghadapi stress sesungguhnya (vol naik DAN korelasi naik) akan melihat 16,2%, bukan 9,8%. Selisih 6,4 poin persen itulah yang dibayar oleh asumsi «input bergerak sendiri-sendiri».",
        "Baik atau buruk: analisis multi-way bagus bila pasangan inputnya dipilih dari ALASAN EKONOMI — σ dan korelasi bergerak bersama saat stress [M4.5], jadi pasangan itu wajib diuji. Buruk bila pasangan dipilih acak dari semua kombinasi yang ada: dengan 5 input ada 10 pasangan, dan menguji semuanya tanpa alasan menghasilkan 10 angka yang tidak ada yang ditindaklanjuti. Buruk juga bila interaksi dibesar-besarkan: +0,6 pp adalah interaksi kecil — menuliskannya sebagai «efek gabungan JAUH lebih besar» adalah melebih-lebihkan bukti.",
        "Mitigasi: untuk setiap model, tulis SATU skenario multi-way yang paling masuk akal secara ekonomi — di sini σ +10% dan korelasi +0,1 — dan laporkan efek gabungannya BERSAMA jumlah efek sendiri-sendiri, supaya pembaca melihat interaksinya sendiri: «gabungan 16,2% vs jumlah 15,6% — interaksi +0,6 pp». Jangan laporkan hanya angka gabungannya.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «efek gabungan = jumlah efek sendiri-sendiri»",
        type: "risk",
        body: "Yang benar: penjumlahan hanya berlaku bila tidak ada interaksi — dan interaksi hampir selalu ada bila input-input itu saling memengaruhi (di sini lewat matriks kovarians). One-at-a-time adalah perkiraan orde pertama; multi-way adalah koreksinya. Di lesson ini koreksinya kecil (+0,6 pp) — tapi di model lain ia bisa besar, dan satu-satunya cara mengetahuinya adalah menghitungnya.",
      },
    },
    {
      id: "kredit",
      eyebrow: "Langkah 4 · Sensitivitas kredit",
      title: "Sensitivitas model kredit: LGD dan margin menggerakkan profit — margin paling besar",
      prose: [
        "Pindah dari VaR ke uang: model kredit flagship (GBM terkalibrasi, threshold 0,10, test 6.000 nasabah) menghasilkan profit +NT$8.214.000 [M6.4]. Dua input bisnis menggerakkan profit itu: LGD (loss given default — berapa persen dari limit yang hilang bila nasabah default) dan margin (pendapatan bunga/marjin atas limit yang disetujui). Keduanya BUKAN parameter statistik — keduanya adalah input BISNIS: LGD adalah asumsi tentang seberapa besar kerugian saat default terjadi, margin adalah asumsi tentang harga kredit. Sensitivitasnya dihitung dengan cara yang sama seperti tornado: ubah satu input, tahan yang lain, catat profitnya.",
        "Nilai [m9_canonical.json] — threshold 0,10, n_approved 1.710, approval rate 28,5%, bad rate yang disetujui 6,67% (ketiganya TETAP di semua baris — LGD dan margin tidak mengubah SIAPA yang disetujui, hanya berapa uang yang dihasilkan tiap keputusan). LGD → net profit: 0,40 → +NT$9.513.500; 0,45 → +NT$8.214.000; 0,50 → +NT$6.914.500; 0,60 → +NT$4.315.500. Tiap +0,05 LGD ≈ −NT$1.299.500 (9.513.500 − 8.214.000 = 1.299.500; 8.214.000 − 6.914.500 = 1.299.500; dan dari 0,50 ke 0,60: 6.914.500 − 4.315.500 = 2.599.000 = 2 × 1.299.500 — persis linear, karena kerugian = LGD × limit default yang tetap). Margin → net profit: 0,04 → +NT$4.232.100; 0,05 → +NT$8.214.000; 0,06 → +NT$12.195.900. Tiap +0,01 margin ≈ +NT$3.981.900 (8.214.000 − 4.232.100 = 3.981.900; 12.195.900 − 8.214.000 = 3.981.900 — juga linear, karena pendapatan = margin × limit non-default yang tetap).",
        "Kesimpulan yang harus dibaca dengan benar: profit PALING sensitif terhadap margin (input bisnis), bukan terhadap parameter statistik. Bandingkan per 0,01 perubahan input: margin +0,01 menaikkan profit NT$3.981.900, sedangkan LGD +0,01 menurunkannya NT$259.900 (1.299.500 ÷ 5) — margin sekitar 15 kali lebih sensitif per satuan yang sama. Perbandingan yang jujur memakai satuan yang sama (0,01) — bukan membandingkan «+0,05 LGD» dengan «+0,01 margin» seolah keduanya setara. Dan threshold TIDAK dihitung ulang di sini — ekonomika threshold sudah dihitung di M6.4 dan hanya dirujuk: t=0,10 profit +NT$8.214.000; t=0,15 profit +NT$5.490.500; t=0,20 profit −NT$216.500 (profit BERBALIK negatif); t=0,50 profit −NT$18.994.456 [M6.4]. Threshold adalah tuas ketiga yang paling kuat — menaikkan threshold dari 0,10 ke 0,20 saja sudah membalik profit menjadi rugi — tapi ia sudah dibahas penuh di M6.4, jadi lesson ini tidak mengulang hitungannya.",
        "Nilai: sensitivitas kredit bagus karena ia menunjukkan DI MANA uangnya berada: bukan di kalibrasi model (ECE 0,0087), bukan di ranking (ROC-AUC 0,7816) — melainkan di dua angka bisnis, margin dan LGD, yang tidak ada di dalam model sama sekali. Model yang sama, dengan margin 0,04 bukan 0,05, menghasilkan profit setengahnya (NT$4.232.100 vs NT$8.214.000). Validator yang hanya memeriksa ROC-AUC tidak akan pernah melihat itu.",
        "Baik atau buruk: analisis ini bagus bila LGD dan margin dibaca sebagai ASUMSI yang harus diuji — «dari mana angka LGD 0,45 ini? data recovery berapa tahun? margin 0,05 ini harga pasar atau harga internal?» Buruk bila keduanya dibaca sebagai konstanta alam: LGD 0,45 dan margin 0,05 adalah pilihan [notebook] — dan profit +NT$8.214.000 hanya setepat pilihan itu. Buruk juga bila sensitivitas kredit dibaca tanpa menyebut n_approved yang tetap (1.710): LGD/margin tidak mengubah keputusan persetujuan — yang mengubah keputusan adalah threshold [M6.4].",
        "Mitigasi: laporkan profit SELALU bersama sensitivitas bisnisnya: «profit +NT$8.214.000 pada LGD 0,45 dan margin 0,05; tiap +0,05 LGD mengurangi profit NT$1.299.500; tiap +0,01 margin menambah profit NT$3.981.900». Dan bila komite bertanya «profitnya bisa negatif tidak?», jawab dengan threshold [M6.4]: ya — pada t=0,20 profit sudah −NT$216.500.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: membandingkan sensitivitas dengan satuan yang berbeda",
        type: "pitfall",
        body: "Yang benar: «tiap +0,05 LGD ≈ −NT$1.299.500» dan «tiap +0,01 margin ≈ +NT$3.981.900» memakai langkah yang BERBEDA (0,05 vs 0,01) — membandingkan keduanya mentah-mentah menyesatkan. Perbandingan yang benar memakai satuan yang sama: per 0,01, margin +NT$3.981.900 vs LGD −NT$259.900 — margin sekitar 15 kali lebih sensitif. Selalu samakan satuannya sebelum meranking.",
      },
    },
    {
      id: "sens-vs-ketidakpastian",
      eyebrow: "Langkah 5 · Dua pertanyaan",
      title: "Sensitivitas vs ketidakpastian: «bila input salah sekian» bukan «seberapa salah input itu»",
      prose: [
        "Dua kata yang sering dicampur — dan lesson ini memisahkannya dengan definisi eksak. SENSITIVITAS = «bila input salah sekian, output salah sekian»: turunan/beda hingga output terhadap satu input (langkah 2–4). Ia menjawab pertanyaan tentang MODEL: seberapa curam output merespons input. KETIDAKPASTIAN = «seberapa salah input itu»: sebaran estimator input itu — seberapa lebar pita di sekitar estimasi kita. Ia menjawab pertanyaan tentang DATA: seberapa besar estimasi kita bisa meleset. Keduanya dibutuhkan untuk keputusan — dan keduanya saja tidak cukup: kamu butuh sensitivitas untuk tahu input mana yang penting, DAN ketidakpastian untuk tahu seberapa salah input penting itu.",
        "Nilai — contoh dari angka yang sudah kamu kenal. Sensitivitas: σ +10% menaikkan VaR95 sebesar +0,0032 (+9,8%) [m9_canonical.json]. Ketidakpastian: VaR95 historis punya CI95 bootstrap [0,0229; 0,0322] (iid, B=10.000, n=480) [M9.5] — pita selebar 0,0093 di sekitar titik estimasi historis 0,0286 (mean bootstrap 0,0284). Bad rate yang disetujui 6,67% punya CI95 [5,47%; 7,85%] [M8.1] — pita selebar 2,38 poin persen. Bacalah keduanya bersama: σ adalah input yang SENSITIF (langkah 2) — dan estimasi σ dari 480 hari punya ketidakpastian samplingnya sendiri. Sebaliknya μ adalah input yang TIDAK SENSITIF (langkah 2) — jadi ketidakpastian μ yang besar pun tidak terlalu menggerakkan VaR. Aturan praktisnya: kalikan keduanya — input yang sensitif DAN tidak pasti adalah yang wajib diselidiki; input yang tidak sensitif boleh tidak pasti; input yang sensitif tapi pasti (α — pilihan, bukan estimasi) wajib DIPUTUSKAN secara eksplisit, bukan dibiarkan implisit.",
        "Satu peringatan tentang CI VaR95 [0,0229; 0,0322] [M9.5]: interval itu adalah CI untuk VaR95 HISTORIS (0,0286) — bukan untuk VaR95 parametrik 0,0328 yang menjadi basis lesson ini. Jangan tempelkan CI itu pada 0,0328 seolah keduanya estimasi yang sama: keduanya mengestimasi besaran yang berbeda (historis vs parametrik), dan CI bootstrap-nya dihitung atas estimator historis. Yang DIBAHAS PENUH di M9.5 adalah konstruksi CI itu (iid vs block bootstrap) — di sini ia hanya dirujuk sebagai contoh ketidakpastian, bukan dihitung ulang.",
        "Nilai: pemisahan ini bagus karena ia mencegah dua kesalahan yang berlawanan: (1) mengira sensitivitas besar berarti masalah besar — padahal inputnya mungkin diestimasi dengan sangat pasti; dan (2) mengira ketidakpastian besar berarti masalah besar — padahal outputnya mungkin tidak sensitif terhadap input itu. Keputusan yang benar membutuhkan KEDUA angka — dan perkalian keduanya.",
        "Baik atau buruk: analisis yang hanya melaporkan sensitivitas (tanpa CI) bagus sebagai PETA — tapi buruk sebagai KEPUTUSAN: ia memberitahu «bila σ salah 10%, VaR salah 9,8%» tanpa memberitahu «seberapa mungkin σ salah 10%». Sebaliknya analisis yang hanya melaporkan CI (tanpa sensitivitas) bagus sebagai UKURAN — tapi buruk sebagai ARAHAN: ia memberitahu «VaR punya pita 0,0093» tanpa memberitahu input mana yang harus diperbaiki untuk mempersempit pita itu.",
        "Mitigasi: setiap laporan sensitivitas tutup dengan satu baris ketidakpastian untuk input yang paling sensitif: «σ +10% → VaR +9,8%; estimasi σ dari 480 hari [M9.5 membahas CI-nya]». Dan setiap laporan CI tutup dengan satu baris sensitivitas: «CI VaR95 [0,0229; 0,0322]; pendorong utama lebar pita ini adalah σ (langkah 2)».",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «sensitivitas besar = ketidakpastian besar»",
        type: "pitfall",
        body: "Yang benar: sensitivitas adalah sifat MODEL (seberapa curam output merespons input), ketidakpastian adalah sifat ESTIMASI (seberapa lebar pita di sekitar input itu). α adalah input yang PALING SENSITIF (+18,8%) tapi punya ketidakpastian NOL — ia pilihan, bukan estimasi. σ sensitif DAN tidak pasti. μ tidak sensitif — ketidakpastiannya hampir tidak penting. Tiga kasus, tiga tindakan yang berbeda.",
      },
    },
    {
      id: "jebakan-lokal-global",
      eyebrow: "Langkah 6 · Jebakan",
      title: "Jebakan: sensitivitas LOKAL (di satu titik) vs global — dan tornado yang menyembunyikan interaksi",
      prose: [
        "Semua angka tornado di langkah 2 adalah sensitivitas LOKAL: turunan di SATU titik — basis (μ_d −0,000558, σ_d 0,0196, α = 95%). Kata «lokal» di sini punya arti yang tajam: sensitivitas di titik itu BELUM TENTU sama di titik lain. Contohnya μ: di titik ini μ «tidak sensitif» (Δ 1,5% untuk gangguan 0,0005) — karena μ_d hanya −0,000558, sekitar 1/35 dari σ_d. Tapi bayangkan portofolio lain — atau periode lain — di mana μ_d = −0,005 (return rata-rata negatif 0,5% per hari, sekitar sembilan kali lipat): suku μ kini menyumbang 0,005 dari VaR 0,0372 — porsinya naik dari 1,7% menjadi 13,4% — TAPI sensitivitasnya TIDAK naik: VaR95 = −μ_d + 1,645·σ_d LINEAR dalam μ, jadi dVaR/dμ = −1 konstan, dan menggeser μ sebesar 0,0005 tetap menggeser VaR sebesar 0,0005 — sama persis seperti di titik basis; secara relatif justru TURUN dari 1,52% menjadi 1,34% [turunan], karena VaR totalnya lebih besar. Yang naik di titik itu hanya PORSI suku μ, bukan sensitivitasnya. Jadi «μ tidak sensitif» di titik ini tetap «tidak sensitif» di titik itu — tornado tidak berbohong, ia hanya diam tentang titik lain, dan contoh μ ini membuktikan bahwa porsi yang naik bukan bukti sensitivitas yang naik.",
        "Sensitivitas GLOBAL adalah jawabannya: bukan turunan di satu titik, melainkan rata-rata sensitivitas di SELURUH rentang input yang masuk akal — atau setidaknya di beberapa titik (skenario). Lesson ini tidak menghitung sensitivitas global penuh (itu butuh simulasi atas seluruh ruang input — lihat M9.1 untuk mesinnya), tapi mengajarkan ATURANNYA: bila kesimpulanmu («μ tidak penting») bergantung pada nilai titik basis, ujilah kesimpulan itu di titik lain sebelum menulisnya sebagai vonis. Satu titik tambahan yang murah: hitung tornado yang sama pada basis stress — σ_d yang lebih besar, korelasi yang lebih tinggi [M4.5] — dan lihat apakah rankingnya bertahan. Bila ranking berubah, laporanmu harus menulis DUA ranking, bukan satu.",
        "Jebakan kedua: tornado one-at-a-time MENYEMBUNYIKAN interaksi — secara konstruksi. Tornado menggerakkan satu input sementara yang lain ditahan — jadi interaksi (langkah 3) tidak pernah muncul di gambarnya. Pembaca tornado yang tidak membaca langkah 3 akan menyimpulkan «σ +10% menaikkan VaR 9,8%» dan berhenti di situ — padahal bila korelasi ikut naik, jawabannya 16,2%. Tornado bukan gambar yang salah; ia gambar yang TIDAK LENGKAP. Selalu pasangkan tornado dengan minimal satu skenario multi-way (langkah 3).",
        "Nilai: membedakan lokal vs global bagus karena ia mengubah tornado dari vonis menjadi HIPOTESIS: «di titik ini, urutannya begini — dan inilah yang harus dicek sebelum menggeneralisasi». Itu sikap yang benar terhadap alat yang kuat tapi sempit.",
        "Baik atau buruk: sensitivitas lokal bagus bila titik basisnya adalah titik KEPUTUSAN — titik di mana model benar-benar dipakai (di sini basis 0,0328 adalah VaR yang dilaporkan). Buruk bila titik basisnya dipilih karena nyaman — mis. titik di mana model terlihat paling stabil. Dan buruk bila laporan hanya berisi tornado tanpa satu pun skenario multi-way: itu laporan yang menyembunyikan interaksi dengan diam.",
        "Mitigasi: di bawah setiap tornado, tulis dua baris: (1) «sensitivitas ini lokal di titik basis (μ_d −0,000558, σ_d 0,0196, α = 95%) — ranking bisa berbeda di titik lain»; (2) «skenario multi-way: σ +10% dan korelasi +0,1 → +16,2% (interaksi +0,6 pp) — lihat langkah 3». Dua baris itu yang membedakan tornado yang jujur dari tornado yang menyesatkan.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «μ tidak sensitif» dibaca sebagai «μ tidak penting, selamanya»",
        type: "risk",
        body: "Yang benar: μ tidak sensitif DI TITIK INI — karena μ_d −0,000558 jauh lebih kecil dari σ_d 0,0196. Di portofolio atau periode dengan μ_d yang besar (mis. tren turun yang dalam), suku μ menyumbang jauh lebih banyak — porsinya naik dari 1,7% menjadi 13,4% pada μ_d = −0,005 — TAPI sensitivitasnya tetap 0,0005 konstan, karena VaR linear dalam μ (dVaR/dμ = −1); secara relatif justru turun dari 1,52% menjadi 1,34% [turunan]. Yang naik hanya porsi suku μ, bukan sensitivitasnya. Tulis selalu «di titik ini» sesudah klaim sensitivitas — tiga kata yang mencegah generalisasi yang salah.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: komite tanya «VaR naik berapa bila vol naik 20%?»",
      prose: [
        "Komite risiko bertanya — dan pertanyaannya persis seperti yang akan kamu dengar di pekerjaan nyata: «Vol naik 20% minggu ini. VaR kita naik berapa?» Di atas mejamu ada tornado langkah 2: σ +10% menaikkan VaR95 sebesar +0,0032 (+9,8%). Godaan terbesar di ruangan itu: menjawab «kira-kira dua kali efek 10% — jadi naik sekitar 0,0064, VaR sekitar 0,0392». JANGAN menjawab begitu. Bukan karena angkanya jauh salah — di kasus ini angkanya HAMPIR sama (0,0392 vs 0,0393 eksak — selisih 0,0001, murni pembulatan Δ tornado; lihat bawah) — melainkan karena METODENYA tidak bisa dipertanggungjawabkan: interpolasi linear dari tornado hanya benar bila output linear dalam input itu DI SELURUH rentang — dan kamu belum membuktikannya. Metode yang benar: hitung ulang dari rumus.",
        "Hitungan eksak: σ_d tak-bulat 0,0196172; σ × 1,2 = 0,0235406. VaR95 = −(μ_d − 1,645 × σ_baru) = 0,000558 + 1,645 × 0,0235406 = 0,000558 + 0,0387243 = 0,0392824 ≈ 0,0393. Kenaikan vs basis: 0,0392824 − 0,0328284 = +0,0064540 ≈ +0,0065 (+19,7%). (Memakai σ_d kanonis bulat 0,0196 memberi 0,0392 — selisih 0,0001 yang murni pembulatan, bukan kesalahan — dan itulah angka yang keluar dari interpolasi di bawah.) Jawaban untuk komite: «VaR95 naik dari 0,0328 menjadi 0,0393 — naik 0,0065, atau 19,7% — bila HANYA vol yang naik 20% dan korelasi tidak berubah.» Kalimat terakhir itu wajib: bila korelasi ikut naik saat stress [M4.5], jawaban 0,0393 MEREMEHKAN — skenario multi-way langkah 3 menunjukkan arahnya.",
        "Kenapa interpolasi «2 × efek 10%» HAMPIR memberi angka yang sama di sini? Karena VaR parametrik LINEAR dalam σ: VaR95 = −μ_d + 1,645·σ_d — menggandakan Δσ menggandakan ΔVaR, persis — BILA Δ-nya tak-bulat: 2 × 0,0032270 = 0,0064540; 0,0328284 + 0,0064540 = 0,0392824 = 0,0393 eksak. Yang kamu lihat di tornado adalah Δ yang SUDAH DIBULATKAN (0,0032): 2 × 0,0032 = 0,0064; 0,0328 + 0,0064 = 0,0392 — selisih 0,0001 dari 0,0393, murni pembulatan. Jadi interpolasi di sini «berhasil» sampai 3 desimal — dan meleset di desimal ke-4 — BUKAN karena linearitasnya salah, melainkan karena kamu menginterpolasi angka yang sudah dibulatkan. Linearitas inilah yang membuat interpolasi hampir berhasil DI KASUS INI — dan hanya di kasus ini. Interpolasi yang sama GAGAL pada α (efek z tidak linear: langkah 5 pp dari 90% ke 95% memberi Δz 0,363, langkah 2,5 pp dari 95% ke 97,5% memberi Δz 0,315 — per pp, ekor naik lebih cepat: 0,073 vs 0,126 per pp) dan GAGAL bila dua input bergerak bersama (langkah 3: interaksi +0,6 pp tidak tertangkap interpolasi satu input). Aturan umumnya: interpolasi dari tornado adalah TEBAKAN yang kadang benar — hitung ulang dari rumus adalah JAWABAN. Di depan komite, berikan jawaban.",
        "Nilai: mini-case ini bagus karena ia mengajarkan perbedaan antara «angka yang benar» dan «cara yang benar»: jawaban 0,0392 yang didapat dari interpolasi dan jawaban 0,0393 yang didapat dari rumus HAMPIR sama (selisih 0,0001, murni pembulatan Δ tornado) — tapi NILAI BUKTI keduanya berbeda. Yang pertama runtuh bila ditanya «kenapa dua kali?»; yang kedua bertahan karena rumusnya tertulis.",
        "Baik atau buruk: jawaban «0,0393, naik 19,7%, bila hanya vol yang naik» bagus — ia eksak, bersyarat, dan bisa diaudit. Buruk bila syaratnya hilang («VaR naik 19,7%») — tanpa «bila hanya vol yang naik», komite akan memakai 0,0393 untuk skenario stress di mana korelasi juga naik, dan angka itu akan meremehkan. Buruk juga bila jawabannya «kira-kira dua kali» — «kira-kira» bukan bahasa komite risiko.",
        "Mitigasi: setiap kali kamu tergoda menginterpolasi dari tornado, tulis rumusnya dan hitung ulang — butuh satu baris. Dan setiap jawaban sensitivitas untuk komite akhiri dengan syaratnya: «bila hanya input ini yang bergerak; bila korelasi ikut naik, lihat skenario multi-way».",
      ],
      formula: String.raw`\sigma_{\text{baru}} = 1{,}2 \times 0{,}0196 = 0{,}02352, \qquad \mathrm{VaR}_{95} = 0{,}000558 + 1{,}645 \times 0{,}02352 = 0{,}0392484 \approx 0{,}0392`,
      formulaNote: "Mini-case: vol naik 20%, korelasi TIDAK berubah, μ_d dan α tetap. Kenaikan vs basis 0,0328: +0,0065 (+19,7%). Hitungan eksak memakai μ_d dan σ_d tak-bulat (−0,000558; 0,0196172); memakai σ_d kanonis bulat 0,0196 memberi 0,0392 — selisih 0,0001 murni pembulatan.",
      tasks: [],
      note: {
        title: "Jebakan: interpolasi linear dari tornado",
        type: "pitfall",
        body: "Yang benar: «2 × efek 10%» memberi 0,0392 di sini — selisih 0,0001 dari 0,0393 eksak, murni pembulatan Δ tornado — HANYA karena VaR parametrik linear dalam σ. Metode itu gagal pada α (efek z tidak linear) dan gagal bila dua input bergerak bersama (interaksi +0,6 pp, langkah 3). Hitung ulang dari rumus — satu baris — dan jawabanmu tidak bergantung pada kebetulan linearitas.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 8 · Lab 1",
      title: "Lab: tornado VaR — hitung, ranking, dan interaksi",
      prose: [
        "Sekarang hitung sendiri tornado langkah 2 dari rumus — dan buktikan rankingnya dengan mesin, bukan dengan mata. Basis [m9_canonical.json]: μ_d kanonis dibulatkan 4 desimal menjadi −0,0006 (nilai tak-bulat −0,000558); σ_d 0,0196; z 1,645 untuk α = 95% dan 1,96 untuk α = 97,5%; σ_port dengan korelasi +0,1 semua pasangan adalah 0,0208. Lab ini memakai μ_d = −0,0006 — nilai bulat kanonis — sehingga semua angka 4-desimalnya mereproduksi tabel kanonis; satu pengecualian dijelaskan di bawah.",
        "Hasil yang diharapkan [lab]: var95_base=0.0328; var95_alpha=0.0390; var95_sigma_plus10=0.0361; var95_sigma_minus10=0.0296; var95_corr_plus01=0.0348; var95_multi=0.0382; var95_mu_plus=0.0323; var95_mu_minus=0.0333; ranking[0]='alpha_97.5'; interaksi_pp=0.6. Dua catatan pembulatan — baca sebelum bertanya. PERTAMA: var95_corr_plus01 lab adalah 0,0348, sedangkan kanonis [m9_canonical.json] 0,0347 — selisih 0,0001 karena lab memakai σ_port 0,0208 yang sudah dibulatkan 4 desimal (nilai tak-bulatnya sekitar 0,02073). Ranking TIDAK berubah: korelasi tetap di bawah σ +10% (0,0361) dan di atas μ (0,0333). KEDUA: interaksi dihitung dari persentase lab (multi 16,4% vs jumlah 9,8% + 6,0% = 15,8%) ≈ 0,6 pp — sama dengan interaksi kanonis +0,6 pp (16,2% vs 15,6%) — selisihnya murni pembulatan σ korelasi yang sama.",
        "Setelah lab jalan, bandingkan ranking lab dengan tornado langkah 2 — hati-hati, konvensinya BERBEDA: ranking lab terurut dari ΔVaR95 bertanda terbesar (signed Δ), sedangkan tornado langkah 2 terurut dari |Δ| terbesar. Karena itu σ −10% (Δ −0,0032) berada di peringkat TERAKHIR di ranking lab, padahal di tornado langkah 2 ia peringkat 3 (|Δ| 0,0032). Urutan ranking lab: α 97,5% di puncak (Δ +0,0062), lalu multi-way (Δ +0,0053), σ +10% (Δ +0,0032), korelasi +0,1 (Δ +0,0019), μ −0,0005 (Δ +0,0005), μ +0,0005 (Δ −0,0005), σ −10% (Δ −0,0032). Perhatikan bahwa multi-way berada di peringkat KEDUA — di atas efek σ sendiri: bila komite hanya membaca tornado one-at-a-time, mereka tidak akan pernah melihat baris kedua itu.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi var95_alpha, var95_sigma_plus10, var95_sigma_minus10 dari rumus VaR parametrik" },
        { id: "t2", text: "Lengkapi var95_corr_plus01, var95_multi, var95_mu_plus, var95_mu_minus, lalu ranking terurut dari ΔVaR95 bertanda terbesar (signed Δ — bukan |Δ|)" },
        { id: "t3", text: "Lengkapi interaksi_pp: efek gabungan (multi) dikurangi jumlah efek sendiri-sendiri, dalam poin persen" },
      ],
      expected: "var95_base=0.0328\nvar95_alpha=0.0390\nvar95_sigma_plus10=0.0361\nvar95_sigma_minus10=0.0296\nvar95_corr_plus01=0.0348\nvar95_multi=0.0382\nranking[0]='alpha_97.5'\ninteraksi_pp=0.6",
      hints: [
        "VaR95 = −μ_d + z·σ_d. var95_alpha = 0,0006 + 1,96 × 0,0196 = 0,0390; var95_sigma_plus10 = 0,0006 + 1,645 × 0,0196 × 1,1 = 0,0361; var95_sigma_minus10 = 0,0006 + 1,645 × 0,0196 × 0,9 = 0,0296.",
        "var95_corr_plus01 = 0,0006 + 1,645 × 0,0208 = 0,0348 (kanonis 0,0347 — selisih 0,0001 karena σ 0,0208 sudah dibulatkan); var95_multi = 0,0006 + 1,645 × 0,0208 × 1,1 = 0,0382; var95_mu_plus = −(−0,0006 + 0,0005) + 1,645 × 0,0196 = 0,0323; var95_mu_minus = 0,0333.",
        "interaksi_pp = 100 × (multi − base)/base − 100 × (sigma_plus10 − base)/base − 100 × (corr_plus01 − base)/base ≈ 16,2 − 9,8 − 5,8 = 0,6 — efek gabungan SEDIKIT lebih besar dari jumlah bagiannya.",
      ],
      requires: ["numpy"],
      code: {
        starter: `# Lab 1 — tornado VaR parametrik [m9_canonical.json]
# Basis: mu_d -0,0006 (nilai tak-bulat -0,000558, dibulatkan kanonis 4 desimal),
# sigma_d 0,0196, z 1,645 (alpha 95%) / 1,96 (alpha 97,5%).
# sigma_port korelasi +0,1 semua pasangan = 0,0208.
import numpy as np

MU_D = -0.0006
SIGMA_D = 0.0196
Z95 = 1.645
Z975 = 1.96
SIGMA_CORR_PLUS01 = 0.0208

def var95(mu, sigma, z):
    return -mu + z * sigma

var95_base = var95(MU_D, SIGMA_D, Z95)
var95_alpha = 0.0  # TODO: alpha 97,5% (z 1,96), mu dan sigma basis
var95_sigma_plus10 = 0.0  # TODO: sigma x 1,1
var95_sigma_minus10 = 0.0  # TODO: sigma x 0,9
var95_corr_plus01 = 0.0  # TODO: sigma = SIGMA_CORR_PLUS01
var95_multi = 0.0  # TODO: sigma = SIGMA_CORR_PLUS01 x 1,1
var95_mu_plus = 0.0  # TODO: mu + 0,0005
var95_mu_minus = 0.0  # TODO: mu - 0,0005
# TODO: ranking = daftar nama terurut dari delta bertanda terbesar (signed Δ).
#   Nama: "alpha_97.5", "multi", "sigma_+10pct", "corr_+0.1",
#         "mu_-0.0005", "mu_+0.0005", "sigma_-10pct"
names = np.array(["alpha_97.5", "multi", "sigma_+10pct", "corr_+0.1",
                  "mu_-0.0005", "mu_+0.0005", "sigma_-10pct"])
vals = np.array([var95_alpha, var95_multi, var95_sigma_plus10,
                 var95_corr_plus01, var95_mu_minus, var95_mu_plus,
                 var95_sigma_minus10])
ranking = []
# TODO: interaksi_pp = efek gabungan (multi) dikurangi jumlah efek
#   sendiri-sendiri (sigma +10% dan korelasi +0,1), dalam poin persen
interaksi_pp = 0.0
print(f"var95_base={var95_base:.4f}")
print(f"var95_alpha={var95_alpha:.4f}")
print(f"var95_sigma_plus10={var95_sigma_plus10:.4f}")
print(f"var95_sigma_minus10={var95_sigma_minus10:.4f}")
print(f"var95_corr_plus01={var95_corr_plus01:.4f}")
print(f"var95_multi={var95_multi:.4f}")
print(f"var95_mu_plus={var95_mu_plus:.4f}")
print(f"var95_mu_minus={var95_mu_minus:.4f}")
print(f"ranking={ranking}")
print(f"interaksi_pp={interaksi_pp:.1f}")`,
        lockLines: 14,
        solution: `# Lab 1 — tornado VaR parametrik [m9_canonical.json]
# Basis: mu_d -0,0006 (nilai tak-bulat -0,000558, dibulatkan kanonis 4 desimal),
# sigma_d 0,0196, z 1,645 (alpha 95%) / 1,96 (alpha 97,5%).
# sigma_port korelasi +0,1 semua pasangan = 0,0208.
import numpy as np

MU_D = -0.0006
SIGMA_D = 0.0196
Z95 = 1.645
Z975 = 1.96
SIGMA_CORR_PLUS01 = 0.0208

def var95(mu, sigma, z):
    return -mu + z * sigma

var95_base = var95(MU_D, SIGMA_D, Z95)
var95_alpha = var95(MU_D, SIGMA_D, Z975)
var95_sigma_plus10 = var95(MU_D, SIGMA_D * 1.1, Z95)
var95_sigma_minus10 = var95(MU_D, SIGMA_D * 0.9, Z95)
var95_corr_plus01 = var95(MU_D, SIGMA_CORR_PLUS01, Z95)
var95_multi = var95(MU_D, SIGMA_CORR_PLUS01 * 1.1, Z95)
var95_mu_plus = var95(MU_D + 0.0005, SIGMA_D, Z95)
var95_mu_minus = var95(MU_D - 0.0005, SIGMA_D, Z95)
names = np.array(["alpha_97.5", "multi", "sigma_+10pct", "corr_+0.1",
                  "mu_-0.0005", "mu_+0.0005", "sigma_-10pct"])
vals = np.array([var95_alpha, var95_multi, var95_sigma_plus10,
                 var95_corr_plus01, var95_mu_minus, var95_mu_plus,
                 var95_sigma_minus10])
order = np.argsort(-(vals - var95_base))
ranking = list(names[order])
pct = lambda v: 100.0 * (v - var95_base) / var95_base
interaksi_pp = pct(var95_multi) - pct(var95_sigma_plus10) - pct(var95_corr_plus01)
print(f"var95_base={var95_base:.4f}")
print(f"var95_alpha={var95_alpha:.4f}")
print(f"var95_sigma_plus10={var95_sigma_plus10:.4f}")
print(f"var95_sigma_minus10={var95_sigma_minus10:.4f}")
print(f"var95_corr_plus01={var95_corr_plus01:.4f}")
print(f"var95_multi={var95_multi:.4f}")
print(f"var95_mu_plus={var95_mu_plus:.4f}")
print(f"var95_mu_minus={var95_mu_minus:.4f}")
print(f"ranking={ranking}")
print(f"interaksi_pp={interaksi_pp:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95_alpha", value: 0.039, tol: 0.0005, label: "`var95_alpha` seharusnya 0.0390", msg: "α 97,5%: 0,0006 + 1,96 × 0,0196 = 0,0390 — Δ +0,0062 (+18,8%), efek TERBESAR di tornado." },
          { kind: "equal", task: "t1", name: "var95_sigma_plus10", value: 0.0361, tol: 0.0005, label: "`var95_sigma_plus10` seharusnya 0.0361", msg: "σ +10%: 0,0006 + 1,645 × 0,02156 = 0,0361 — Δ +0,0032 (+9,8%)." },
          { kind: "equal", task: "t2", name: "var95_multi", value: 0.0382, tol: 0.0005, label: "`var95_multi` seharusnya 0.0382", msg: "σ +10% DAN korelasi +0,1: 0,0006 + 1,645 × 0,02288 = 0,0382 — Δ +0,0053 (+16,2%)." },
          { kind: "stdout_matches", task: "t2", pattern: "ranking=\\['alpha_97.5'", label: "Ranking menempatkan alpha_97.5 di puncak", msg: "Ranking terurut dari ΔVaR95 bertanda terbesar dimulai dengan alpha_97.5 (+18,8%) — α adalah input yang paling menggerakkan VaR." },
          { kind: "equal", task: "t3", name: "interaksi_pp", value: 0.6, tol: 0.3, label: "`interaksi_pp` seharusnya sekitar 0.6", msg: "Efek gabungan (16,2% kanonis) minus jumlah efek sendiri (9,8% + 5,8% = 15,6%) = +0,6 pp — SEDIKIT lebih besar, bukan jauh lebih besar." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 9 · Lab 2",
      title: "Lab: LGD dan margin menggerakkan profit — hitung dari agregat kanonis",
      prose: [
        "Lab kedua menghitung sensitivitas profit kredit dari RUMUS dengan agregat kanonis — bukan dari 6.000 probabilitas (lab Pyodide tidak memuat data sebesar itu). Agregatnya [m8_canonical.json m8_tiering]: total LIMIT yang disetujui APPROVED_LIMIT = NT$424.180.000; total LIMIT nasabah default yang disetujui DEFAULT_LIMIT = NT$25.990.000 [turunan: realised_loss_approved_NT 11.695.500 ÷ LGD 0,45]; LIMIT nasabah non-default yang disetujui = 424.180.000 − 25.990.000 = NT$398.190.000 [turunan]. Rumusnya: net profit = margin × LIMIT non-default − LGD × LIMIT default. Periksa basisnya: 0,05 × 398.190.000 − 0,45 × 25.990.000 = 19.909.500 − 11.695.500 = NT$8.214.000 — sama dengan profit kanonis [M6.4]. n_approved 1.710, approval rate 28,5%, dan bad rate 6,67% TETAP di semua baris — LGD/margin tidak mengubah siapa yang disetujui.",
        "Hasil yang diharapkan [lab]: net_lgd_040=9513500; net_lgd_045=8214000; net_lgd_050=6914500; net_lgd_060=4315500; net_margin_004=4232100; net_margin_005=8214000; net_margin_006=12195900; delta_lgd_per_005=-1299500; delta_margin_per_001=3981900; margin_paling_sensitif=True. Perhatikan baris terakhir: perbandingan memakai SATUAN YANG SAMA (per 0,01): margin +0,01 → +NT$3.981.900, LGD +0,01 → −NT$259.900 (1.299.500 ÷ 5) — margin sekitar 15 kali lebih sensitif per satuan yang sama. Itulah kesimpulan langkah 4, kini dihitung sendiri.",
        "Setelah lab jalan, tanyakan pada dirimu: input bisnis mana yang harus dinegosiasikan paling keras? Margin — karena tiap 0,01 margin bernilai NT$3.981.900 profit, sementara tiap 0,01 LGD hanya «bernilai» NT$259.900. Dan ingat batas lab ini: rumus ini mengasumsikan LIMIT default dan non-default TETAP saat LGD/margin berubah — benar di sini karena LGD/margin tidak mengubah keputusan persetujuan (threshold 0,10 tetap) — tapi tidak benar bila threshold ikut berubah [M6.4].",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi net_lgd_040, net_lgd_050, net_lgd_060: margin tetap 0,05, LGD berubah" },
        { id: "t2", text: "Lengkapi net_margin_004 dan net_margin_006: LGD tetap 0,45, margin berubah" },
        { id: "t3", text: "Lengkapi delta_lgd_per_005, delta_margin_per_001, dan margin_paling_sensitif (bandingkan per 0,01)" },
      ],
      expected: "net_lgd_040=9513500\nnet_lgd_045=8214000\nnet_lgd_050=6914500\nnet_lgd_060=4315500\nnet_margin_004=4232100\nnet_margin_005=8214000\nnet_margin_006=12195900\ndelta_lgd_per_005=-1299500\ndelta_margin_per_001=3981900\nmargin_paling_sensitif=True",
      hints: [
        "net(lgd, margin) = margin × 398.190.000 − lgd × 25.990.000. net_lgd_040 = 0,05 × 398.190.000 − 0,40 × 25.990.000 = 19.909.500 − 10.396.000 = 9.513.500.",
        "net_margin_004 = 0,04 × 398.190.000 − 0,45 × 25.990.000 = 15.927.600 − 11.695.500 = 4.232.100; net_margin_006 = 23.891.400 − 11.695.500 = 12.195.900.",
        "delta_lgd_per_005 = net_lgd_050 − net_lgd_045 = 6.914.500 − 8.214.000 = −1.299.500; delta_margin_per_001 = net_margin_006 − net_margin_005 = 12.195.900 − 8.214.000 = 3.981.900. Per 0,01: margin +3.981.900 vs LGD −259.900 (1.299.500 ÷ 5) — margin menang, jadi margin_paling_sensitif = True.",
      ],
      code: {
        starter: `# Lab 2 — sensitivitas profit kredit: LGD dan margin [m9_canonical.json]
# Agregat kanonis [m8_canonical.json m8_tiering]: total LIMIT disetujui
# NT$424.180.000; LIMIT nasabah default yang disetujui NT$25.990.000
# [turunan: realised_loss_approved 11.695.500 / LGD 0,45].
# Rumus: net profit = margin x LIMIT non-default - LGD x LIMIT default.
# n_approved 1.710, approval 28,5%, bad rate 6,67% TETAP di semua baris.
APPROVED_LIMIT = 424180000
DEFAULT_LIMIT = 25990000
NONDEFAULT_LIMIT = APPROVED_LIMIT - DEFAULT_LIMIT

def net_profit(lgd, margin):
    return margin * NONDEFAULT_LIMIT - lgd * DEFAULT_LIMIT

net_lgd_040 = 0  # TODO: net_profit(0.40, 0.05)
net_lgd_045 = 0  # TODO: net_profit(0.45, 0.05) — basis
net_lgd_050 = 0  # TODO: net_profit(0.50, 0.05)
net_lgd_060 = 0  # TODO: net_profit(0.60, 0.05)
net_margin_004 = 0  # TODO: net_profit(0.45, 0.04)
net_margin_005 = 0  # TODO: net_profit(0.45, 0.05) — basis
net_margin_006 = 0  # TODO: net_profit(0.45, 0.06)
delta_lgd_per_005 = 0  # TODO: net_lgd_050 - net_lgd_045
delta_margin_per_001 = 0  # TODO: net_margin_006 - net_margin_005
# TODO: True bila |delta per 0,01 margin| > |delta per 0,01 LGD|
#   (delta per 0,01 LGD = delta_lgd_per_005 / 5)
margin_paling_sensitif = None
print(f"net_lgd_040={net_lgd_040:.0f}")
print(f"net_lgd_045={net_lgd_045:.0f}")
print(f"net_lgd_050={net_lgd_050:.0f}")
print(f"net_lgd_060={net_lgd_060:.0f}")
print(f"net_margin_004={net_margin_004:.0f}")
print(f"net_margin_005={net_margin_005:.0f}")
print(f"net_margin_006={net_margin_006:.0f}")
print(f"delta_lgd_per_005={delta_lgd_per_005:.0f}")
print(f"delta_margin_per_001={delta_margin_per_001:.0f}")
print(f"margin_paling_sensitif={margin_paling_sensitif}")`,
        lockLines: 12,
        solution: `# Lab 2 — sensitivitas profit kredit: LGD dan margin [m9_canonical.json]
# Agregat kanonis [m8_canonical.json m8_tiering]: total LIMIT disetujui
# NT$424.180.000; LIMIT nasabah default yang disetujui NT$25.990.000
# [turunan: realised_loss_approved 11.695.500 / LGD 0,45].
# Rumus: net profit = margin x LIMIT non-default - LGD x LIMIT default.
# n_approved 1.710, approval 28,5%, bad rate 6,67% TETAP di semua baris.
APPROVED_LIMIT = 424180000
DEFAULT_LIMIT = 25990000
NONDEFAULT_LIMIT = APPROVED_LIMIT - DEFAULT_LIMIT

def net_profit(lgd, margin):
    return margin * NONDEFAULT_LIMIT - lgd * DEFAULT_LIMIT

net_lgd_040 = net_profit(0.40, 0.05)
net_lgd_045 = net_profit(0.45, 0.05)
net_lgd_050 = net_profit(0.50, 0.05)
net_lgd_060 = net_profit(0.60, 0.05)
net_margin_004 = net_profit(0.45, 0.04)
net_margin_005 = net_profit(0.45, 0.05)
net_margin_006 = net_profit(0.45, 0.06)
delta_lgd_per_005 = net_lgd_050 - net_lgd_045
delta_margin_per_001 = net_margin_006 - net_margin_005
margin_paling_sensitif = abs(delta_margin_per_001) > abs(delta_lgd_per_005 / 5)
print(f"net_lgd_040={net_lgd_040:.0f}")
print(f"net_lgd_045={net_lgd_045:.0f}")
print(f"net_lgd_050={net_lgd_050:.0f}")
print(f"net_lgd_060={net_lgd_060:.0f}")
print(f"net_margin_004={net_margin_004:.0f}")
print(f"net_margin_005={net_margin_005:.0f}")
print(f"net_margin_006={net_margin_006:.0f}")
print(f"delta_lgd_per_005={delta_lgd_per_005:.0f}")
print(f"delta_margin_per_001={delta_margin_per_001:.0f}")
print(f"margin_paling_sensitif={margin_paling_sensitif}")`,
        checks: [
          { kind: "equal", task: "t1", name: "net_lgd_040", value: 9513500, tol: 1, label: "`net_lgd_040` seharusnya 9513500", msg: "LGD 0,40: 19.909.500 − 10.396.000 = NT$9.513.500 — LGD lebih rendah, kerugian lebih kecil, profit lebih besar." },
          { kind: "equal", task: "t1", name: "net_lgd_060", value: 4315500, tol: 1, label: "`net_lgd_060` seharusnya 4315500", msg: "LGD 0,60: 19.909.500 − 15.594.000 = NT$4.315.500 — tiap +0,05 LGD mengurangi profit NT$1.299.500." },
          { kind: "equal", task: "t2", name: "net_margin_004", value: 4232100, tol: 1, label: "`net_margin_004` seharusnya 4232100", msg: "Margin 0,04: 15.927.600 − 11.695.500 = NT$4.232.100 — hampir setengah profit basis." },
          { kind: "equal", task: "t2", name: "net_margin_006", value: 12195900, tol: 1, label: "`net_margin_006` seharusnya 12195900", msg: "Margin 0,06: 23.891.400 − 11.695.500 = NT$12.195.900 — tiap +0,01 margin menambah profit NT$3.981.900." },
          { kind: "equal", task: "t3", name: "delta_lgd_per_005", value: -1299500, tol: 1, label: "`delta_lgd_per_005` seharusnya -1299500", msg: "Tiap +0,05 LGD: 6.914.500 − 8.214.000 = −NT$1.299.500 — linear, karena LIMIT default tetap." },
          { kind: "stdout_matches", task: "t3", pattern: "margin_paling_sensitif=True", label: "Output menampilkan margin_paling_sensitif=True", msg: "Per 0,01: margin +NT$3.981.900 vs LGD −NT$259.900 — margin sekitar 15 kali lebih sensitif. Profit PALING sensitif terhadap margin, input bisnis — bukan parameter statistik." },
        ],
      },
    },
    {
      id: "figure-tornado",
      eyebrow: "Langkah 10 · Figure 1",
      title: "Figure 1: tornado chart — ΔVaR95 bertanda terurut dari yang terbesar",
      prose: [
        "Gambar ini adalah tornado langkah 2 — angka yang sama, dalam bentuk yang bisa dibaca sekilas. Tiap bar adalah ΔVaR95 terhadap basis 0,0328: bar ke kanan berarti VaR naik, bar ke kiri berarti VaR turun. Urutannya dari ΔVaR95 bertanda terbesar (bukan |Δ| — konvensi di sini berbeda dari tornado langkah 2 yang memakai |Δ| terbesar): α 95→97,5% (+0,0062, +18,8%), multi-way σ +10% dan korelasi +0,1 (+0,0053, +16,2%), σ +10% (+0,0032, +9,8%), korelasi +0,1 (+0,0019, +5,8%), μ −0,0005 (+0,0005, +1,5%), μ +0,0005 (−0,0005, −1,5%), σ −10% (−0,0032, −9,8%). Perhatikan dua hal di gambar: pertama, bar multi-way (peringkat 2) TIDAK berasal dari tornado one-at-a-time — ia sengaja dimasukkan supaya pembaca melihat efek gabungan di samping efek sendiri-sendiri; kedua, bar μ hampir tidak terlihat — dan itulah pesannya: di titik ini, μ nyaris tidak menggerakkan jawaban.",
        "Nilai: tornado chart bagus karena ia mengubah tabel menjadi KEPUTUSAN: mata langsung jatuh ke bar terpanjang (α), lalu ke bar kedua (multi-way). Komite yang tidak membaca tabel pun membaca gambar ini dengan benar.",
        "Baik atau buruk: gambar ini bagus bila dibaca BERSAMA keterangannya — gangguan tiap input (α 95→97,5%; σ ±10%; korelasi +0,1; μ ±0,0005) tertulis di label, jadi pembaca tahu persis «gangguan sebesar apa» yang menghasilkan tiap bar. Buruk bila gambar ini dipotong dari keterangannya: bar tanpa ukuran gangguan adalah bar yang tidak bisa dinilai.",
        "Mitigasi: bila kamu membuat tornado sendiri, selalu tulis ukuran gangguan di label tiap bar — dan selalu sertakan bar multi-way bila ada skenario gabungan yang masuk akal. Tornado tanpa gangguan tertulis adalah grafik yang berbohong dengan sumbu yang benar.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Tornado chart: perubahan VaR95 terhadap basis 0,0328; alpha 95 ke 97,5 persen plus 0,0062; multi-way sigma plus 10 persen dan korelasi plus 0,1 plus 0,0053; sigma plus 10 persen plus 0,0032; korelasi plus 0,1 plus 0,0019; mu minus 0,0005 plus 0,0005; mu plus 0,0005 minus 0,0005; sigma minus 10 persen minus 0,0032">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tornado — ΔVaR95 vs basis 0,0328 (one-at-a-time + multi-way)</text>
<line x1="270" y1="30" x2="270" y2="232" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="270" y="246" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0 (basis 0,0328)</text>
<text x="12" y="50" font-size="10" fill="var(--text)" font-family="var(--font-ui)">α 95→97,5% (z 1,645→1,96) · +18,8%</text>
<rect x="270" y="38" width="140" height="16" fill="var(--c1)"/>
<text x="414" y="50" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,0062</text>
<text x="12" y="78" font-size="10" fill="var(--text)" font-family="var(--font-ui)">σ +10% &amp; korel +0,1 (multi) · +16,2%</text>
<rect x="270" y="66" width="120" height="16" fill="var(--c2)"/>
<text x="394" y="78" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,0053</text>
<text x="12" y="106" font-size="10" fill="var(--text)" font-family="var(--font-ui)">σ +10% · +9,8%</text>
<rect x="270" y="94" width="72" height="16" fill="var(--c1)"/>
<text x="346" y="106" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,0032</text>
<text x="12" y="134" font-size="10" fill="var(--text)" font-family="var(--font-ui)">korelasi +0,1 semua pasangan · +5,8%</text>
<rect x="270" y="122" width="43" height="16" fill="var(--c1)"/>
<text x="317" y="134" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,0019</text>
<text x="12" y="162" font-size="10" fill="var(--text)" font-family="var(--font-ui)">μ −0,0005 · +1,5%</text>
<rect x="270" y="150" width="11" height="16" fill="var(--c1)"/>
<text x="285" y="162" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,0005</text>
<text x="12" y="190" font-size="10" fill="var(--text)" font-family="var(--font-ui)">μ +0,0005 · −1,5%</text>
<rect x="259" y="178" width="11" height="16" fill="var(--c4)"/>
<text x="255" y="190" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−0,0005</text>
<text x="12" y="218" font-size="10" fill="var(--text)" font-family="var(--font-ui)">σ −10% · −9,8%</text>
<rect x="198" y="206" width="72" height="16" fill="var(--c4)"/>
<text x="194" y="218" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−0,0032</text>
</svg>`,
        alt: "Tornado chart: perubahan VaR95 terhadap basis 0,0328; alpha 95 ke 97,5 persen plus 0,0062; multi-way sigma plus 10 persen dan korelasi plus 0,1 plus 0,0053; sigma plus 10 persen plus 0,0032; korelasi plus 0,1 plus 0,0019; mu minus 0,0005 plus 0,0005; mu plus 0,0005 minus 0,0005; sigma minus 10 persen minus 0,0032.",
        caption: "Cara membaca: bar ke kanan = VaR naik, bar ke kiri = VaR turun, garis tengah = basis 0,0328. Bar terpanjang adalah α 95→97,5% (+0,0062, +18,8%) — pilihan tingkat keyakinan menggerakkan VaR lebih besar daripada kesalahan estimasi σ sebesar 10%. Bar kedua adalah multi-way (σ +10% DAN korelasi +0,1: +0,0053, +16,2%) — sengaja dimasukkan supaya efek gabungan terlihat di samping efek sendiri-sendiri. Bar μ hampir tidak terlihat: di titik ini μ nyaris tidak menggerakkan jawaban. Angka dari m9_canonical.json.",
      },
      tasks: [],
    },
    {
      id: "figure-profit",
      eyebrow: "Langkah 11 · Figure 2",
      title: "Figure 2: profit vs LGD (turun) dan profit vs margin (naik) — dua garis, satu gambar",
      prose: [
        "Gambar ini adalah sensitivitas kredit langkah 4 — dua garis dalam satu gambar, dengan skala profit yang SAMA di kedua panel. Skala profit yang sama SAJA tidak membuat kemiringannya bisa dibandingkan: sumbu-x kedua panel BERBEDA (LGD 0,40–0,60 di kiri, rentang 0,20; margin 0,04–0,06 di kanan, rentang 0,02) pada lebar panel yang sama — jadi kemiringan visual menyesatkan. Yang benar dari mata hanyalah Δprofit rentang-penuh: LGD 5,19 jt vs margin 7,97 jt [turunan] — visual ≈1,5×, BUKAN 15×. Angka 15× hanya datang dari hitungan per 0,01 (langkah 4: margin NT$3.981.900 vs LGD NT$259.900 per 0,01), bukan dari mata. Panel kiri: profit vs LGD — garis TURUN dari +NT$9.513.500 (LGD 0,40) ke +NT$4.315.500 (LGD 0,60), melewati basis +NT$8.214.000 (LGD 0,45). Panel kanan: profit vs margin — garis NAIK dari +NT$4.232.100 (margin 0,04) ke +NT$12.195.900 (margin 0,06), melewati basis yang sama +NT$8.214.000 (margin 0,05). Kedua garis bertemu di titik basis yang sama — karena keduanya mengukur profit yang sama, dari dua arah yang berbeda.",
        "Nilai: dua panel dengan skala profit yang sama bagus karena ia membuat Δprofit rentang-penuh bisa dibandingkan dengan jujur (LGD 5,19 jt vs margin 7,97 jt [turunan] — ≈1,5×) — TAPI bukan kemiringannya: karena sumbu-x-nya berbeda (rentang LGD 0,20 vs margin 0,02), garis margin yang «terlihat jauh lebih curam» itu melebih-lebihkan perbandingan yang sebenarnya. Perbandingan 15× hanya benar dari angka per 0,01 (langkah 4: margin NT$3.981.900 vs LGD NT$259.900 per 0,01), bukan dari mata. Bila kedua panel memakai skala profit yang berbeda, bahkan Δprofit rentang-penuhnya pun tidak bisa dibandingkan — dan kesimpulannya akan salah.",
        "Baik atau buruk: gambar ini bagus bila dibaca dengan sumbu-x yang berbeda di tiap panel (LGD 0,40–0,60 di kiri; margin 0,04–0,06 di kanan) — dua input yang berbeda memang butuh dua sumbu-x yang berbeda, dan menyamakannya akan menyesatkan. Buruk bila pembaca membandingkan KEMIRINGAN visual seolah itu perbandingan sensitivitas: kemiringan visual TIDAK bermakna sebagai perbandingan sensitivitas — sumbu-x-nya berbeda, jadi yang terlihat «15× lebih curam» itu sebenarnya hanya ≈1,5× dalam Δprofit rentang-penuh. Skala profit (sumbu-y) yang disamakan hanya membuat Δprofit rentang-penuh bisa dibandingkan — perbandingan sensitivitas yang benar memakai angka per 0,01 (langkah 4), bukan mata.",
        "Mitigasi: bila kamu menggambar dua sensitivitas dalam satu gambar, samakan SELALU skala sumbu output-nya (di sini profit NT$), dan beri label yang jelas pada tiap sumbu input-nya. Dan tulis kesimpulan perbandingannya dalam angka per satuan yang sama — bukan «garis ini terlihat lebih curam».",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Profit vs LGD turun dari 9.513.500 pada LGD 0,40 ke 4.315.500 pada LGD 0,60; profit vs margin naik dari 4.232.100 pada margin 0,04 ke 12.195.900 pada margin 0,06; keduanya melewati basis 8.214.000">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Profit vs LGD (turun) dan vs margin (naik) — skala profit sama</text>
<text x="130.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Profit vs LGD</text>
<text x="350.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Profit vs margin</text>
<line x1="40" y1="40" x2="40" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="40" y1="200" x2="220" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="260" y1="40" x2="260" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="260" y1="200" x2="440" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="34" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">13 jt</text>
<text x="34" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6,5 jt</text>
<text x="34" y="203" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="254" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">13 jt</text>
<text x="254" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6,5 jt</text>
<text x="254" y="203" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="40" y1="99" x2="220" y2="99" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="260" y1="99" x2="440" y2="99" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="130" y="92" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">basis +NT$8.214.000</text>
<text x="350" y="92" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">basis +NT$8.214.000</text>
<polyline points="40,83 85,99 130,115 220,147" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="40" cy="83" r="4" fill="var(--c1)"/>
<circle cx="85" cy="99" r="4" fill="var(--c1)"/>
<circle cx="130" cy="115" r="4" fill="var(--c1)"/>
<circle cx="220" cy="147" r="4" fill="var(--c1)"/>
<text x="40" y="72" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">9,51 jt</text>
<text x="130" y="130" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">6,91 jt</text>
<text x="220" y="162" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">4,32 jt</text>
<polyline points="260,148 350,99 440,50" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<circle cx="260" cy="148" r="4" fill="var(--c4)"/>
<circle cx="350" cy="99" r="4" fill="var(--c4)"/>
<circle cx="440" cy="50" r="4" fill="var(--c4)"/>
<text x="260" y="163" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">4,23 jt</text>
<text x="440" y="39" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">12,20 jt</text>
<text x="40" y="218" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<text x="85" y="218" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,45</text>
<text x="130" y="218" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<text x="220" y="218" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,60 LGD</text>
<text x="260" y="218" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,04</text>
<text x="350" y="218" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<text x="440" y="218" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,06 margin</text>
<text x="240" y="238" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Per 0,01: margin +NT$3.981.900 vs LGD −NT$259.900 — margin ~15× lebih sensitif.</text>
</svg>`,
        alt: "Profit vs LGD turun dari 9.513.500 pada LGD 0,40 ke 4.315.500 pada LGD 0,60; profit vs margin naik dari 4.232.100 pada margin 0,04 ke 12.195.900 pada margin 0,06; keduanya melewati basis 8.214.000.",
        caption: "Cara membaca: kedua panel memakai skala profit yang SAMA (0–13 juta NT$) — itu hanya membuat Δprofit rentang-penuh bisa dibandingkan (LGD 5,19 jt vs margin 7,97 jt [turunan] — ≈1,5×), BUKAN kemiringannya: sumbu-x kedua panel berbeda (LGD 0,40–0,60; margin 0,04–0,06), jadi garis margin yang terlihat jauh lebih curam itu menyesatkan bila dibaca sebagai perbandingan sensitivitas. Angka 15× hanya dari hitungan per 0,01 perubahan input: margin +NT$3.981.900 vs LGD −NT$259.900 — margin sekitar 15 kali lebih sensitif, dari angka (langkah 4), bukan dari mata. Keduanya bertemu di titik basis yang sama, +NT$8.214.000. Angka dari m9_canonical.json.",
      },
      tasks: [],
    },
    {
      id: "pelaporan",
      eyebrow: "Langkah 12 · Melaporkan sensitivitas",
      title: "Melaporkan sensitivitas: basis, gangguan, dan batas — tiga baris yang wajib ada",
      prose: [
        "Sensitivity analysis yang tidak dilaporkan dengan benar sama bahayanya dengan yang tidak dilakukan: angka yang benar tanpa konteksnya akan dibaca salah. Aturan pelaporan lesson ini [kebijakan lesson ini] — tiga baris yang wajib ada di setiap laporan sensitivitas: (1) BASIS: nilai basis output dan semua inputnya — «VaR95 0,0328 pada μ_d −0,000558, σ_d 0,0196, α = 95%» — tanpa basis, Δ tidak punya acuan; (2) GANGGUAN: ukuran gangguan tiap input dan alasannya — «σ ±10% (ketidakpastian estimasi dari 480 hari); α 95→97,5% (pilihan kebijakan); korelasi +0,1 (skenario stress [M4.5]); μ ±0,0005» — tanpa ukuran gangguan, ranking tornado tidak bisa dinilai; (3) BATAS: lokal vs global dan one-at-a-time vs multi-way — «sensitivitas ini lokal di titik basis; skenario multi-way σ +10% dan korelasi +0,1 memberi +16,2% (interaksi +0,6 pp)» — tanpa batas, pembaca akan menggeneralisasi yang tidak boleh digeneralisasi.",
        "Nilai: tiga baris ini bagus karena ia membuat laporan sensitivitas bisa DIAUDIT: validator lain bisa mengambil basis dan gangguannya, menghitung ulang, dan mendapat angka yang sama — atau menemukan di mana ia berbeda. Laporan tanpa basis adalah klaim; laporan dengan basis adalah bukti.",
        "Baik atau buruk: laporan yang baik menulis ambang dan kriteria KEBIJAKAN dengan label [kebijakan lesson ini] — mis. «gangguan σ ±10% dipilih sebagai [kebijakan lesson ini]» — supaya pembaca tidak mengiranya konstanta alam. Buruk bila ambang kebijakan ditulis tanpa label: pembaca akan mengiranya hukum statistik. Dan buruk bila laporan mencampur satuan mata uang: «Rp» hanya untuk portofolio IDX, «NT$» hanya untuk kredit UCI — profit kredit lesson ini selalu NT$, tidak pernah Rp.",
        "Mitigasi: sebelum mengirim laporan sensitivitas apa pun, cek tiga barisnya: basis tertulis? gangguan tertulis beserta alasannya? batas (lokal/global, one-at-a-time/multi-way) tertulis? Bila satu baris hilang, laporan belum siap dikirim — berapa pun benarnya angka di dalamnya.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: laporan sensitivitas tanpa basis",
        type: "risk",
        body: "Yang benar: «σ +10% menaikkan VaR 9,8%» tanpa basis adalah kalimat yang tidak bisa diperiksa — 9,8% dari berapa? Selalu tulis basisnya dulu: «VaR95 0,0328 → 0,0361 (+9,8%) bila σ +10%» — +9,8%-nya dihitung dari nilai tak-bulat [turunan] (0,036055/0,032828 [m9_canonical.json]); dari angka tampil 0,0361/0,0328 diperoleh ≈ +10,1%, selisihnya pembulatan. Δ tanpa basis adalah angka yatim.",
      },
    },
    {
      id: "propagasi-ketidakpastian",
      eyebrow: "Langkah 13 · Propagasi ketidakpastian",
      title: "Propagasi ketidakpastian: nested bootstrap — bila μ dan σ sendiri tidak pasti",
      prose: [
        "Lesson ini mengajarkan dua hal yang terpisah: sensitivitas («bila input bergerak sekian, output bergerak sekian» — tornado) dan ketidakpastian («seberapa salah input itu» — CI bootstrap M9.5). Yang belum diajarkan adalah MENGGABUNGKANNYA: bila μ dan σ sendiri tidak pasti, berapa ketidakpastian VaR MC yang keluar? Jawabannya bukan tornado (tornado memakai SATU input yang digerakkan dengan tangan) dan bukan CI bootstrap HS (itu ketidakpastian estimator HS, bukan MC). Jawabannya adalah nested bootstrap: resample data → estimasi ulang parameter → simulasi ulang → distribusi output. Tiga lapis, satu angka akhir.",
        "Prosedurnya [notebook]: B_outer = 500 resample iid dari 480 return; pada tiap resample, estimasi ulang μ_log dan σ_log; lalu jalankan MC N=10.000 dari parameter itu dan hitung VaR95-nya. Hasilnya [notebook]: VaR95 nested mean 0,0324, sd 0,0025, CI95 [0,0281; 0,0377], range [0,0260; 0,0414]. Bandingkan dengan VaR parametrik titik 0,0328 — mean nested 0,0004 di bawahnya [turunan], dan CI-nya mencakup 0,0328 dengan nyaman. Lebar CI nested 0,0096 [turunan] — hampir sama dengan lebar CI bootstrap HS (M9.5: 0,0093 [turunan]) — dua rute berbeda menuju ketidakpastian yang sama, dan keduanya setuju dalam 0,0003 pada sd-nya (0,0025 vs 0,0022) [turunan].",
        "Sekarang pisahkan DUA sumber variasinya — persis seperti langkah 6 M9.1 membedakan MC error dari data error. Param-only (rumus analitik 1,6449σ−μ atas parameter hasil resample, TANPA simulasi ulang): mean 0,0329, sd 0,0026, CI95 [0,0286; 0,0384] [notebook]. MC-only (simulasi ulang dari parameter TETAP, N=10.000): sd 0,0004 [notebook] — sama dengan sd antar-batch M9.1 langkah 6. Jadi: ketidakpastian parameter (sd 0,0026) vs ketidakpastian simulasi (sd 0,0004) — nested 6,25× MC-only [turunan], dan error MC hanya menyumbang 2,56% dari varians total [turunan]. Dengan kata lain: sekitar 97% ketidakpastian VaR MC-mu berasal dari DATA (480 hari yang terbatas), bukan dari SIMULASI (N=10.000 yang terbatas) [turunan]. Menaikkan N dari 10.000 ke 100.000 mengecilkan 2,56% itu — mengumpulkan data lebih banyak mengecilkan 97% sisanya.",
        "Satu keanehan yang harus dibaca dengan benar: sd nested (0,0025) SEDIKIT LEBIH KECIL dari sd param-only (0,0026) — padahal nested MENAMBAH noise simulasi di atas ketidakpastian parameter. Selisihnya 0,0001 [turunan] — sekitar 1 SE dari estimasi sd itu sendiri (500 resample) — jadi keduanya mengukur hal yang sama dalam noise; jangan klaim «simulasi mengurangi ketidakpastian». Secara teori sd_nested ≈ √(0,0026² + 0,0004²) = 0,0026 [turunan]; yang teramati 0,0025 — selisih 0,0001 adalah noise estimasi dari 500 resample.",
        "Nilai: nested bootstrap bagus karena ia menjawab pertanyaan yang tornado dan CI biasa tidak bisa jawab: «berapa lebar pita VaR MC-ku bila datanya sendiri goyah?» — dan jawabannya (CI [0,0281; 0,0377]) bisa langsung dibandingkan dengan CI bootstrap HS ([0,0229; 0,0322]) untuk melihat apakah dua metode setuju tentang ketidakpastiannya sendiri.",
        "Baik atau buruk: propagasi bagus bila dua sumber variasinya DIPISAHKAN dan dilaporkan (param-only vs MC-only) — tanpa pemisahan itu, kamu tidak tahu apakah yang harus diperbaiki adalah N atau datanya. Buruk bila nested bootstrap dipakai sebagai pengganti validasi: ia mengukur ketidakpastian di DALAM model yang sama — ia tidak menguji apakah modelnya benar (itu tugas backtest M9.3).",
        "Mitigasi: laporkan SELALU tiga angka — VaR titik, sd param-only (ketidakpastian data), sd MC-only (ketidakpastian simulasi). Bila sd param-only >> sd MC-only, berhenti menaikkan N — kumpulkan data atau terima pitanya. Bila sebaliknya, naikkan N sampai MC-only < 10% dari total [kebijakan lesson ini].",
      ],
      tasks: [],
      formula: String.raw`\widehat{\mathrm{VaR}}_{95}^{(b)} = \mathrm{MC}_{N=10.000}\left(\hat{\mu}_{\log}^{(b)}, \hat{\sigma}_{\log}^{(b)}\right), \qquad b = 1, \dots, 500, \qquad \mathrm{sd}_{\mathrm{nested}}^2 \approx \mathrm{sd}_{\mathrm{param}}^2 + \mathrm{sd}_{\mathrm{MC}}^2`,
      formulaNote: "Lapisan luar (b): resample iid 480 return, estimasi ulang μ_log dan σ_log — inilah ketidakpastian PARAMETER (data). Lapisan dalam: MC N=10.000 dari parameter hasil resample — inilah ketidakpastian SIMULASI. Hasil [notebook]: nested mean 0,0324, sd 0,0025, CI95 [0,0281; 0,0377]; param-only mean 0,0329, sd 0,0026, CI95 [0,0286; 0,0384]; MC-only sd 0,0004. Dekomposisi varians: (0,0004/0,0025)² = 2,56% [turunan] — error MC hanya 2,56% dari varians total. Secara teori sd_nested ≈ √(0,0026² + 0,0004²) = 0,0026 [turunan]; yang teramati 0,0025 — selisih 0,0001 adalah noise estimasi dari 500 resample.",
      note: {
        title: "Nested bootstrap tidak menguji kebenaran model",
        type: "risk",
        body: "Nested bootstrap mengukur seberapa goyah VaR MC bila datanya di-resample — SEMUA di dalam asumsi GBM yang sama (normal, iid, vol konstan). Bila asumsi itu salah (dan lesson M9.1 membuktikan ketiganya gagal deskriptif: skew −0,5091, excess kurtosis 6,0216, autokorelasi squared return 0,1043), nested bootstrap TIDAK mendeteksinya — pitanya sempit di sekitar jawaban yang salah. Ketidakpastian parameter ≠ ketidakpastian model. Untuk yang kedua, pakai backtest (M9.3) dan perbandingan generator (M9.1 langkah 13).",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: jawabanmu bergerak berapa bila inputnya bergerak?",
      prose: [
        "Rangkuman: basis VaR95 parametrik 0,0328 (μ_d −0,000558 — dibulatkan −0,0006 di m9_canonical.json — σ_d 0,0196, α = 95%, z = 1,645; simple daily return portofolio equal-weight BBCA/KLBF/UNVR, n=480 [M4.2]; σ_port dari matriks kovarians 0,0196 — konsisten). Tornado one-at-a-time [m9_canonical.json]: α 95→97,5% → 0,0390 (+0,0062, +18,8%) TERBESAR; σ +10% → 0,0361 (+0,0032, +9,8%); σ −10% → 0,0296 (−0,0032, −9,8%); korelasi +0,1 → 0,0347 (+0,0019, +5,8%; σ_port 0,0196 → 0,0208); μ +0,0005 → 0,0323 (−0,0005, −1,5%); μ −0,0005 → 0,0333 (+0,0005, +1,5%) TERKECIL. α terbesar karena z naik 19,1% dan VaR didominasi suku z·σ_d; μ terkecil karena μ_d hanya −0,000558, sekitar 1/35 dari σ_d — VaR didominasi σ. Multi-way: σ +10% DAN korelasi +0,1 → 0,0382 (+0,0053, +16,2%) vs jumlah efek sendiri 15,6% — interaksi +0,6 pp: efek gabungan SEDIKIT lebih besar dari jumlah bagiannya, jangan klaim «jauh lebih besar»; one-at-a-time meremehkan bila input bergerak bersama (korelasi naik saat stress [M4.5]; stress VaR95 0,0431 [M4.5]). Kredit (threshold 0,10, test 6.000, n_approved 1.710, approval 28,5%, bad rate 6,67%): LGD → net profit 0,40 → +NT$9.513.500; 0,45 → +NT$8.214.000; 0,50 → +NT$6.914.500; 0,60 → +NT$4.315.500 (tiap +0,05 LGD ≈ −NT$1.299.500); margin → net profit 0,04 → +NT$4.232.100; 0,05 → +NT$8.214.000; 0,06 → +NT$12.195.900 (tiap +0,01 margin ≈ +NT$3.981.900); per 0,01 yang sama, margin ~15× lebih sensitif daripada LGD (NT$3.981.900 vs NT$259.900) — profit PALING sensitif terhadap margin, input bisnis. Threshold dirujuk [M6.4], tidak dihitung ulang: t=0,10 +NT$8.214.000; t=0,15 +NT$5.490.500; t=0,20 −NT$216.500; t=0,50 −NT$18.994.456. Sensitivitas vs ketidakpastian: sensitivitas = «bila input salah sekian, output salah sekian» (turunan/beda hingga terhadap SATU input); ketidakpastian = «seberapa salah input itu» (sebaran estimator) — VaR95 historis CI95 [0,0229; 0,0322] iid [M9.5]; bad rate CI95 [5,47%; 7,85%] [M8.1]. Jebakan: sensitivitas LOKAL di satu titik — μ yang «tidak sensitif» di sini tetap tidak sensitif di titik lain (porsi suku μ-nya yang naik, bukan sensitivitasnya — langkah 6); tornado one-at-a-time menyembunyikan interaksi. Mini-case: σ × 1,2 = 0,02354 → VaR95 = 0,000558 + 1,645 × 0,02354 = 0,0393 (+0,0065, +19,7% vs basis) — hitung eksak, jangan interpolasi «2 × efek 10%» (angkanya HAMPIR sama — 0,0392 vs 0,0393, selisih 0,0001 murni pembulatan Δ tornado — karena VaR linear dalam σ; metodenya gagal pada α dan pada input yang bergerak bersama). Lab: tornado VaR (var95_alpha 0,0390, ranking[0] alpha_97.5, interaksi +0,6 pp) dan profit kredit (net_lgd_040 NT$9.513.500, net_margin_006 NT$12.195.900, margin_paling_sensitif True). Propagasi ketidakpastian (langkah 13): nested bootstrap (B_outer=500 → MC N=10.000) — VaR95 mean 0,0324, sd 0,0025, CI95 [0,0281; 0,0377] [notebook]; param-only sd 0,0026 vs MC-only sd 0,0004 — ketidakpastian didominasi data (error MC 2,56% varians) [turunan]. Pelaporan [kebijakan lesson ini]: tiga baris wajib — basis, gangguan beserta alasannya, batas (lokal/global, one-at-a-time/multi-way); «Rp» hanya untuk portofolio IDX, «NT$» hanya untuk kredit UCI.",
        "Guided task di Colab — notebook mlf-m94-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari agregat kanonis: tornado VaR + ranking, multi-way dan interaksi, sensitivitas profit LGD/margin dari agregat limit, mini-case σ × 1,2, dan rangkuman sensitivitas vs ketidakpastian. Tautan Colab: https://colab.research.google.com/drive/1a7Q3brOC8dSNj1-dILVyx60wHcnuK3NL",
        "Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu satu angka hasil model, tanyakan «bila inputnya bergerak, jawabannya bergerak berapa — dan input mana yang paling menggerakkannya?» Bila jawabannya tidak ada, angka itu belum menjadi keputusan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tornado VaR95 (basis 0,0328): input mana yang PALING menggerakkan VaR — dan berapa besarnya?",
          options: [
            { text: "σ +10% — VaR naik menjadi 0,0361 (+9,8%)", why: "Salah: σ +10% memang besar (+9,8%), tapi bukan yang terbesar. Ada input yang menggerakkan VaR lebih besar lagi — lihat puncak tornado." },
            { text: "α 95% → 97,5% (z 1,645 → 1,96) — VaR naik menjadi 0,0390 (+0,0062, +18,8%)", why: "Benar: α adalah yang TERBESAR di tornado. z naik 19,1% dan VaR didominasi suku z·σ_d (0,0322 dari 0,0328) — kenaikan z hampir sepenuhnya diteruskan ke VaR. Dan α adalah PILIHAN kebijakan, bukan estimasi.", correct: true },
            { text: "Korelasi +0,1 — VaR naik menjadi 0,0347 (+5,8%)", why: "Salah: korelasi +0,1 hanya +5,8% — peringkat keempat dalam urutan tornado langkah 2 (dari |Δ| terbesar: α, σ +10%, σ −10%, lalu korelasi), di bawah α (+18,8%) dan σ +10% (+9,8%)." },
            { text: "μ −0,0005 — VaR naik menjadi 0,0333 (+1,5%)", why: "Salah: μ adalah yang TERKECIL di tornado (+1,5%), bukan yang terbesar — μ_d hanya −0,000558, sekitar 1/35 dari σ_d 0,0196." },
          ],
        },
        {
          q: "Kenapa μ adalah input yang PALING TIDAK sensitif di tornado ini?",
          options: [
            { text: "Karena μ diestimasi dengan sangat teliti, jadi gangguannya kecil", why: "Salah: gangguan μ (±0,0005) justru hampir sebesar μ itu sendiri (−0,000558) — gangguannya BESAR secara relatif, tapi dampaknya tetap kecil. Alasannya bukan ketelitian estimasi." },
            { text: "Karena μ_d hanya −0,000558 — sekitar 1/35 dari σ_d 0,0196 — sehingga VaR95 = 0,000558 + 1,645 × 0,0196 didominasi suku σ; menggeser μ sebesar 0,0005 hanya menggeser VaR sebesar 0,0005", why: "Benar: suku μ menyumbang 0,0006 dari 0,0328 (di bawah 2%). VaR didominasi σ — dan tornado membuktikannya dengan angka. Ingat: ini sensitivitas LOKAL di titik ini (langkah 6).", correct: true },
            { text: "Karena μ tidak masuk rumus VaR parametrik", why: "Salah: μ ADA di rumus — VaR95 = −μ_d + 1,645·σ_d. Ia masuk rumus, tapi sumbangannya kecil di titik ini." },
            { text: "Karena μ_d negatif, jadi menaikkan μ menurunkan VaR — efeknya saling meniadakan", why: "Salah: tanda negatif μ memang membuat μ naik MENURUNKAN VaR (Δ −0,0005 untuk μ +0,0005) — tapi itu soal ARAH, bukan soal BESAR. Kecilnya efek μ disebabkan ukurannya yang kecil relatif terhadap σ, bukan tandanya." },
          ],
        },
        {
          q: "Multi-way: σ +10% DAN korelasi +0,1 memberi VaR95 0,0382 (+16,2%), sedangkan jumlah efek sendiri-sendiri adalah 9,8% + 5,8% = 15,6%. Apa artinya?",
          options: [
            { text: "Efek gabungan JAUH lebih besar dari jumlah bagiannya — one-at-a-time tidak berguna sama sekali", why: "Salah: selisihnya hanya +0,6 poin persen (16,2% vs 15,6%) — SEDIKIT lebih besar, bukan jauh lebih besar. Melebih-lebihkan interaksi sama salahnya dengan mengabaikannya." },
            { text: "Efek gabungan SEDIKIT lebih besar dari jumlah bagiannya — interaksi +0,6 pp; one-at-a-time meremehkan bila input bergerak bersama (korelasi naik saat stress [M4.5])", why: "Benar: interaksi +0,6 pp — nyata tapi kecil (sekitar 4% dari efek gabungan). Arahnya yang penting: gabungan LEBIH BESAR dari jumlah, jadi tornado one-at-a-time meremehkan risiko stress.", correct: true },
            { text: "Efek gabungan SAMA dengan jumlah bagiannya — tidak ada interaksi, jadi multi-way tidak perlu", why: "Salah: 16,2% ≠ 15,6% — selisihnya +0,6 pp. Interaksinya kecil tapi ADA, dan satu-satunya cara mengetahuinya adalah menghitung multi-way." },
            { text: "Efek gabungan LEBIH KECIL dari jumlah bagiannya — σ dan korelasi saling meniadakan", why: "Salah: 16,2% LEBIH BESAR dari 15,6%, bukan lebih kecil. Korelasi yang lebih tinggi membuat kenaikan σ lebih banyak diteruskan ke σ_port — keduanya saling memperkuat, bukan meniadakan." },
          ],
        },
        {
          q: "Sensitivitas kredit: LGD naik dari 0,45 ke 0,60 (threshold 0,10, margin tetap 0,05). Profit menjadi berapa?",
          options: [
            { text: "Tetap +NT$8.214.000 — LGD tidak memengaruhi profit karena n_approved tetap 1.710", why: "Salah: n_approved memang tetap 1.710, tapi LGD mengubah BESAR kerugian tiap default: 0,45 × 25.990.000 = 11.695.500 vs 0,60 × 25.990.000 = 15.594.000. Profit berubah walau keputusannya tetap." },
            { text: "+NT$6.914.500 — turun NT$1.299.500 dari basis", why: "Salah: +NT$6.914.500 adalah profit pada LGD 0,50 (satu langkah +0,05). LGD 0,60 adalah TIGA langkah dari 0,45 — penurunannya 3 × 1.299.500 = NT$3.898.500." },
            { text: "+NT$4.315.500 — turun NT$3.898.500 dari basis (3 × NT$1.299.500)", why: "Benar: tiap +0,05 LGD mengurangi profit NT$1.299.500 — linear, karena kerugian = LGD × LIMIT default yang tetap (NT$25.990.000). Dari 0,45 ke 0,60 adalah 3 langkah: 8.214.000 − 3 × 1.299.500 = 4.315.500.", correct: true },
            { text: "−NT$216.500 — profit berbalik negatif", why: "Salah: −NT$216.500 adalah profit pada THRESHOLD 0,20 [M6.4] — bukan pada LGD 0,60. Jangan campur sensitivitas LGD dengan sensitivitas threshold." },
          ],
        },
        {
          q: "Profit PALING sensitif terhadap margin, bukan LGD. Bukti angka yang benar?",
          options: [
            { text: "Tiap +0,05 LGD ≈ −NT$1.299.500 sedangkan tiap +0,01 margin ≈ +NT$3.981.900 — margin lebih besar", why: "Salah: perbandingan ini memakai SATUAN YANG BERBEDA (0,05 vs 0,01) — membandingkan keduanya mentah-mentah menyesatkan. Samakan dulu satuannya." },
            { text: "Per 0,01 yang sama: margin +NT$3.981.900 vs LGD −NT$259.900 (1.299.500 ÷ 5) — margin sekitar 15 kali lebih sensitif", why: "Benar: perbandingan yang jujur memakai satuan yang sama. Per 0,01, margin menggerakkan profit NT$3.981.900 — sekitar 15 kali LGD (NT$259.900). Profit PALING sensitif terhadap margin, input bisnis.", correct: true },
            { text: "Margin 0,06 memberi profit +NT$12.195.900 — angka terbesar di tabel, jadi margin paling sensitif", why: "Salah: «angka profit terbesar» bukan «sensitivitas terbesar». Sensitivitas adalah PERUBAHAN profit per satuan perubahan input — dan itu harus dibandingkan dengan satuan yang sama." },
            { text: "LGD 0,60 memberi profit terendah (+NT$4.315.500), jadi LGD paling sensitif", why: "Salah: sama seperti di atas — «profit terendah» bukan «sensitivitas terbesar». Per 0,01, LGD hanya menggerakkan NT$259.900 — jauh di bawah margin." },
          ],
        },
        {
          q: "Apa beda sensitivitas dan ketidakpastian — dengan contoh yang benar?",
          options: [
            { text: "Tidak ada beda — keduanya mengukur seberapa besar output bisa meleset", why: "Salah: keduanya mengukur hal yang BERBEDA. Sensitivitas = sifat model (seberapa curam output merespons input); ketidakpastian = sifat estimasi (seberapa lebar pita di sekitar input itu)." },
            { text: "Sensitivitas = «bila input salah sekian, output salah sekian» (σ +10% → VaR +9,8%); ketidakpastian = «seberapa salah input itu» (VaR95 historis CI95 [0,0229; 0,0322] [M9.5])", why: "Benar: sensitivitas adalah turunan/beda hingga terhadap SATU input; ketidakpastian adalah sebaran estimator. Keduanya dibutuhkan — dan α membuktikan keduanya berbeda: α PALING sensitif (+18,8%) tapi punya ketidakpastian NOL (ia pilihan, bukan estimasi).", correct: true },
            { text: "Sensitivitas = CI95 output; ketidakpastian = Δ output saat input diganggu", why: "Terbalik: CI95 adalah ketidakpastian (sebaran estimator), Δ saat input diganggu adalah sensitivitas (turunan/beda hingga). Menukar keduanya membuat laporanmu tidak bisa dibaca validator." },
            { text: "Sensitivitas hanya untuk VaR; ketidakpastian hanya untuk model kredit", why: "Salah: keduanya berlaku untuk SEMUA output model — VaR punya sensitivitas (tornado) DAN ketidakpastian (CI bootstrap [M9.5]); profit kredit punya sensitivitas (LGD/margin) DAN ketidakpastian (bad rate CI95 [5,47%; 7,85%] [M8.1])." },
          ],
        },
        {
          q: "Jebakan lokal vs global: μ «tidak sensitif» di titik basis ini. Apa risiko membaca klaim itu sebagai vonis permanen?",
          options: [
            { text: "Tidak ada risiko — tornado sudah membuktikan μ tidak penting", why: "Salah: tornado membuktikan μ tidak sensitif DI TITIK INI — karena μ_d −0,000558 jauh lebih kecil dari σ_d 0,0196. Di portofolio atau periode dengan μ_d yang besar, suku μ menyumbang jauh lebih banyak (porsinya naik 1,7%→13,4% pada μ_d = −0,005) — TAPI sensitivitasnya tetap 0,0005 konstan, karena VaR linear dalam μ; secara relatif justru turun 1,52%→1,34% [turunan]." },
            { text: "Porsi μ bisa naik di titik lain (1,7%→13,4% pada μ_d = −0,005) tapi sensitivitas μ tetap 0,0005 konstan karena VaR linear dalam μ — dan tornado one-at-a-time menyembunyikan interaksi (langkah 3)", why: "Benar: sensitivitas tornado adalah LOKAL, tapi untuk μ linearitasnya berlaku di titik mana pun: dVaR/dμ = −1 konstan, jadi ΔVaR untuk gangguan 0,0005 tetap 0,0005 — secara relatif justru turun 1,52%→1,34% [turunan]. Yang naik hanya PORSI suku μ, bukan sensitivitasnya. Dan selalu pasangkan tornado dengan minimal satu skenario multi-way, karena tornado menyembunyikan interaksi.", correct: true },
            { text: "Risikonya hanya bila μ_d berubah tanda — selama μ_d negatif, ranking tidak berubah", why: "Salah: ranking berubah bukan karena TANDA μ, melainkan karena UKURAN μ relatif terhadap σ. μ_d = −0,005 (negatif juga) sekitar sembilan kali lipat μ_d basis — dan sensitivitasnya tetap 0,0005 karena VaR linear dalam μ; yang naik hanya porsi suku μ (1,7%→13,4%), bukan sensitivitasnya." },
            { text: "Tidak ada risiko selama gangguannya ±0,0005 — gangguan yang sama memberi hasil yang sama di titik mana pun", why: "Salah: gangguan yang sama memberi Δ yang sama HANYA karena VaR linear dalam μ (Δ = gangguan itu sendiri) — tapi SENSITIVITAS RELATIFNYA (Δ dibanding VaR total) berubah bila titiknya berubah. Dan untuk input non-linear (α, σ lewat korelasi), Δ-nya sendiri berubah." },
          ],
        },
        {
          q: "Mini-case: vol naik 20% (korelasi tidak berubah). VaR95 menjadi berapa — dan bagaimana cara menjawab yang benar?",
          options: [
            { text: "Kira-kira 2 × efek 10%: 0,0328 + 2 × 0,0032 = 0,0392 — interpolasi dari tornado sudah cukup", why: "Salah: angkanya HAMPIR sama (0,0392 vs 0,0393 eksak — selisih 0,0001 murni pembulatan Δ tornado) karena VaR linear dalam σ — tapi METODENYA tidak bisa dipertanggungjawabkan: interpolasi gagal pada α (efek z tidak linear) dan gagal bila dua input bergerak bersama (interaksi +0,6 pp). Di depan komite, berikan hitungan, bukan tebakan." },
            { text: "Hitung eksak dari rumus: σ × 1,2 = 0,02354; VaR95 = 0,000558 + 1,645 × 0,02354 = 0,0393 (+0,0065, +19,7% vs basis) — dengan syarat «bila HANYA vol yang naik»", why: "Benar: hitung ulang dari rumus — satu baris — dan sertakan syaratnya. Bila korelasi ikut naik saat stress [M4.5], 0,0393 meremehkan (skenario multi-way: +16,2% untuk σ +10% DAN korelasi +0,1).", correct: true },
            { text: "0,0361 — sama dengan efek σ +10%, karena vol naik 20% sama dengan dua kali 10% dan VaR tidak linear", why: "Salah dua kali: 0,0361 adalah efek σ +10% (bukan +20%), dan VaR parametrik JUSTRU linear dalam σ — 2 × 0,0032 = 0,0064. Jawaban yang benar adalah 0,0393, dihitung dari rumus." },
            { text: "0,0431 — VaR stress [M4.5]", why: "Salah: 0,0431 adalah stress VaR95 [M4.5] — skenario stress penuh (σ dan korelasi bergerak bersama dengan gangguan stress). Mini-case ini hanya menaikkan vol 20% dengan korelasi tetap — jawabannya 0,0393, bukan 0,0431." },
          ],
        },
        {
          q: "Threshold [M6.4]: t=0,10 profit +NT$8.214.000; t=0,15 +NT$5.490.500; t=0,20 −NT$216.500; t=0,50 −NT$18.994.456. Apa yang ditunjukkan sensitivitas threshold ini?",
          options: [
            { text: "Profit tidak sensitif terhadap threshold — dari 0,10 ke 0,15 hanya turun NT$2.723.500", why: "Salah: turun NT$2.723.500 dari 8.214.000 adalah −33% — dan pada t=0,20 profit BERBALIK NEGATIF (−NT$216.500). Itu sensitivitas yang BESAR, bukan kecil." },
            { text: "Profit SANGAT sensitif terhadap threshold: menaikkan threshold dari 0,10 ke 0,20 saja sudah membalik profit menjadi rugi (−NT$216.500); pada t=0,50 rugi −NT$18.994.456", why: "Benar: threshold adalah tuas yang paling kuat — ia mengubah SIAPA yang disetujui (tidak seperti LGD/margin yang hanya mengubah uang tiap keputusan). Itulah kenapa ekonomika threshold dibahas penuh di M6.4 dan hanya dirujuk di sini.", correct: true },
            { text: "Threshold 0,50 adalah yang terbaik karena menolak paling banyak nasabah berisiko", why: "Salah: t=0,50 memberi profit −NT$18.994.456 — rugi terbesar. Menolak paling banyak bukan berarti profit paling besar: threshold yang terlalu tinggi menolak juga nasabah baik yang membayar margin." },
            { text: "Sensitivitas threshold tidak bisa dibandingkan dengan sensitivitas LGD/margin karena satuannya berbeda", why: "Salah: ketiganya bisa dibandingkan lewat DAMPAKNYA pada profit (NT$) — threshold 0,10→0,20 mengubah profit sebesar −NT$8.430.500, jauh lebih besar dari satu langkah LGD (−NT$1.299.500) atau margin (+NT$3.981.900). Perbandingan lewat output (NT$) selalu bisa dilakukan." },
          ],
        },
        {
          q: "Nested bootstrap VaR95 MC (B_outer=500 resample → estimasi ulang μ_log/σ_log → MC N=10.000): mean 0,0324, sd 0,0025, CI95 [0,0281; 0,0377]. Param-only (analitik, tanpa simulasi ulang): sd 0,0026. MC-only (parameter tetap, N=10.000): sd 0,0004 [notebook]. Apa kesimpulan yang benar?",
          options: [
            { text: "Ketidakpastian didominasi DATA, bukan simulasi: nested 6,25× MC-only [turunan], error MC hanya 2,56% dari varians total [turunan] — menaikkan N hampir tidak membantu; yang membantu adalah data lebih banyak (atau menerima pitanya)", why: "Benar: sd param-only 0,0026 vs MC-only 0,0004 — sumber variasi yang sama seperti M9.1 langkah 6, kini digabung dan dipisahkan sekaligus. CI nested [0,0281; 0,0377] mencakup VaR titik 0,0328.", correct: true },
            { text: "Naikkan N dari 10.000 ke 100.000 — itu cara mengecilkan sd 0,0025", why: "Salah: N hanya mengecilkan MC-only (sd 0,0004, 2,56% varians [turunan]) — sd param-only 0,0026 tidak bergerak bila N naik; ia hanya bergerak bila datanya bertambah.", correct: false },
            { text: "sd nested (0,0025) < sd param-only (0,0026) membuktikan simulasi mengurangi ketidakpastian", why: "Salah: selisih 0,0001 [turunan] ≈ 1 SE noise estimasi sd dari 500 resample — secara teori sd_nested ≈ √(0,0026² + 0,0004²) = 0,0026 [turunan]; keduanya mengukur hal yang sama dalam noise.", correct: false },
            { text: "Nested bootstrap membuktikan model GBM benar, karena CI-nya mencakup 0,0328", why: "Salah: nested bootstrap mengukur ketidakpastian DI DALAM asumsi GBM — ia tidak menguji asumsi itu. Tiga asumsi GBM gagal deskriptif (M9.1 langkah 6); kebenaran model diuji backtest (M9.3) dan perbandingan generator (M9.1 langkah 13), bukan bootstrap.", correct: false },
          ],
        },
      ],
      summary: [
        "Basis: VaR95 parametrik 0,0328 (μ_d −0,000558 — dibulatkan −0,0006 di m9_canonical.json — σ_d 0,0196, α = 95%, z = 1,645; simple daily return portofolio equal-weight BBCA/KLBF/UNVR, n=480 [M4.2]; σ_port dari matriks kovarians 0,0196 — konsisten).",
        "Tornado one-at-a-time [m9_canonical.json]: α 95→97,5% → 0,0390 (+0,0062, +18,8%) TERBESAR; σ +10% → 0,0361 (+0,0032, +9,8%); σ −10% → 0,0296 (−0,0032, −9,8%); korelasi +0,1 → 0,0347 (+0,0019, +5,8%; σ_port 0,0196 → 0,0208); μ +0,0005 → 0,0323 (−0,0005, −1,5%); μ −0,0005 → 0,0333 (+0,0005, +1,5%) TERKECIL.",
        "Kenapa rankingnya begitu: α terbesar karena z naik 19,1% dan VaR didominasi suku z·σ_d; μ terkecil karena μ_d hanya −0,000558, sekitar 1/35 dari σ_d — VaR didominasi σ.",
        "Multi-way: σ +10% DAN korelasi +0,1 → 0,0382 (+0,0053, +16,2%) vs jumlah efek sendiri 15,6% — interaksi +0,6 pp: efek gabungan SEDIKIT lebih besar dari jumlah bagiannya; one-at-a-time meremehkan bila input bergerak bersama (korelasi naik saat stress [M4.5]; stress VaR95 0,0431 [M4.5]).",
        "Kredit (threshold 0,10, test 6.000, n_approved 1.710, approval 28,5%, bad rate 6,67%): LGD → net profit 0,40 → +NT$9.513.500; 0,45 → +NT$8.214.000; 0,50 → +NT$6.914.500; 0,60 → +NT$4.315.500 (tiap +0,05 LGD ≈ −NT$1.299.500); margin → net profit 0,04 → +NT$4.232.100; 0,05 → +NT$8.214.000; 0,06 → +NT$12.195.900 (tiap +0,01 margin ≈ +NT$3.981.900).",
        "Per 0,01 yang sama, margin ~15× lebih sensitif daripada LGD (NT$3.981.900 vs NT$259.900) — profit PALING sensitif terhadap margin, input bisnis, bukan parameter statistik.",
        "Threshold dirujuk [M6.4], tidak dihitung ulang: t=0,10 +NT$8.214.000; t=0,15 +NT$5.490.500; t=0,20 −NT$216.500; t=0,50 −NT$18.994.456 — menaikkan threshold 0,10 → 0,20 saja sudah membalik profit menjadi rugi.",
        "Sensitivitas vs ketidakpastian: sensitivitas = «bila input salah sekian, output salah sekian» (turunan/beda hingga terhadap SATU input); ketidakpastian = «seberapa salah input itu» (sebaran estimator) — VaR95 historis CI95 [0,0229; 0,0322] iid [M9.5]; bad rate CI95 [5,47%; 7,85%] [M8.1]. α paling sensitif (+18,8%) tapi ketidakpastiannya NOL — ia pilihan, bukan estimasi.",
        "Jebakan: sensitivitas LOKAL di satu titik — μ yang «tidak sensitif» di sini tetap tidak sensitif di titik lain (porsi suku μ-nya yang naik, bukan sensitivitasnya — langkah 6); tornado one-at-a-time menyembunyikan interaksi.",
        "Mini-case: σ × 1,2 = 0,02354 → VaR95 = 0,000558 + 1,645 × 0,02354 = 0,0393 (+0,0065, +19,7% vs basis) — hitung eksak, jangan interpolasi «2 × efek 10%» (angkanya HAMPIR sama — 0,0392 vs 0,0393, selisih 0,0001 murni pembulatan Δ tornado — karena VaR linear dalam σ; metodenya gagal pada α dan pada input yang bergerak bersama).",
        "Lab: tornado VaR (var95_alpha 0,0390, ranking[0] alpha_97.5, interaksi +0,6 pp) dan profit kredit (net_lgd_040 NT$9.513.500, net_margin_006 NT$12.195.900, margin_paling_sensitif True).",
        "Pelaporan [kebijakan lesson ini]: tiga baris wajib — basis, gangguan beserta alasannya, batas (lokal/global, one-at-a-time/multi-way); «Rp» hanya untuk portofolio IDX, «NT$» hanya untuk kredit UCI.",
        "Propagasi ketidakpastian (langkah 13) [notebook]: nested bootstrap B_outer=500 → MC N=10.000 — VaR95 mean 0,0324, sd 0,0025, CI95 [0,0281; 0,0377]; param-only sd 0,0026, MC-only sd 0,0004.",
        "Dekomposisi varians [turunan]: error MC hanya 2,56% dari varians total (nested 6,25× MC-only) — ketidakpastian didominasi data, bukan simulasi; sd nested 0,0025 vs param-only 0,0026 selisih 0,0001 ≈ noise estimasi.",
      ],
      next: { label: "Lanjut: MLF-M9.5 — Historical Simulation & Bootstrap", href: "/v2/learn/mlf-m95-historical-simulation-bootstrap" },
    },
  ],
};
