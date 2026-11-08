import type { V2Lesson } from "../lib/types";

export const mr5: V2Lesson = {
  slug: "mr5-expected-shortfall",
  track: "Market Risk",
  module: "VaR & Backtesting",
  title: "MR5 — Expected Shortfall: Melihat ke Dalam Ekor yang Disembunyikan VaR",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-dua-desk",
      eyebrow: "Langkah 1 · Definisi ES",
      title: "Cerita: dua portofolio, satu VaR, nasib berbeda",
      prose: [
        "Komite risiko membandingkan dua desk. Desk A (trading saham): VaR 99% = Rp12 miliar. Desk B (menjual proteksi kredit): VaR 99% = Rp12 miliar. Risikonya sama, simpul komite. Limit disamakan. Setahun kemudian pasar kredit guncang: Desk A rugi Rp15 miliar — sedikit di atas VaR, masih masuk akal. Desk B? Rugi Rp80 miliar.",
        "Twist-nya: VaR hanya menandai batas 1% ekor — dan kedua desk memang sama di batas itu. Tetapi bentuk ekornya beda total: ekor Desk A pendek, ekor Desk B seperti jurang — sekali jatuh, dalam sekali. Itulah sifat menjual proteksi: premi kecil, bencana besar. VaR buta terhadap perbedaan ini. Expected Shortfall tidak.",
        "Definisi: Expected Shortfall (ES) — juga disebut Conditional VaR — adalah ekspektasi kerugian dengan syarat kerugian melebihi VaR: ES_α = E[L | L > VaR_α]. Cara baca: ES 99% = Rp28 miliar artinya jika kita masuk ke 1% hari terburuk, rata-rata kerugiannya Rp28 miliar. Dalam definisi yang dipakai lesson ini (ES = ekspektasi kerugian bersyarat melebihi VaR, pada data diskrit dengan konvensi kuantil lesson), ES_α ≥ VaR_α \u2014 rata-rata ekor tidak mungkin lebih kecil dari ambang ekornya. Bila konvensi kuantil/definisi ES berbeda, ketidaksamaan ini perlu dicek ulang terhadap definisi itu. Rasio ES/VaR adalah detektor ekor yang murah: untuk distribusi normal ≈ 1,15; jika rasiomu 1,5–2+, ekormu tebal — VaR sendirian menipumu.",
      ],
      formula: String.raw`\text{ES}_\alpha = E[L \mid L > \text{VaR}_\alpha] \geq \text{VaR}_\alpha`,
      formulaNote: "ES_α = Expected Shortfall tingkat kepercayaan α; E[·|·] = ekspektasi bersyarat; L = kerugian; syarat L > VaR_α = hanya (1−α) skenario terburuk; selalu ES ≥ VaR — rata-rata ekor tak mungkin lebih kecil dari ambangnya.",
      tasks: [
        { id: "t1", text: "Tuliskan cara baca yang benar untuk: ES 99% = Rp28 miliar." },
        { id: "t2", text: "Jelaskan kenapa dua desk dengan VaR sama bisa bernasib beda." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira ES hanyalah VaR yang lebih konservatif. ES bukan VaR plus margin — ia mengukur hal yang berbeda: kedalaman ekor vs frekuensi terlampaui. Untuk distribusi simetris tipis ES ≈ 1,15 × VaR (hampir sama); untuk distribusi skew seperti penjualan proteksi, ES bisa berkali-kali lipat VaR.",
        type: "pitfall",
      },
      reference: "ES = rata-rata kerugian di luar ambang VaR. Rasio ES/VaR ≈ 1,15 normal; > 1,5 waspada.",
    },
    {
      id: "es-dari-data",
      eyebrow: "Langkah 2 · Hitung ES",
      title: "Menghitung ES dari data",
      prose: [
        "Cara hitung diskrit: urutkan kerugian dari terbesar, ambil rata-rata dari (1−α) bagian terburuk. Contoh 10 hari P&L (Rp juta): +5, −2, +8, −30, +3, −1, +6, −45, +2, −4. Ubah jadi kerugian (positif = rugi), urutkan menurun: 45, 30, 4, 2, 1, …",
        "VaR 80% = 4 (20% hari rugi > 4). ES 80% = rata-rata 20% terburuk = (45 + 30)/2 = 37,5. VaR bilang ambang 4, ES bilang tetapi kalau jebol, rata-rata 37,5. Rasio 9,4× — detektor ekor berteriak: distribusi ini sangat skew.",
        "Bandingkan dengan cerita dua desk: Desk A yang ekornya pendek punya rasio ES/VaR dekat 1,15; Desk B yang menjual proteksi punya rasio berkali-kali lipat. Satu rasio murah ini seharusnya sudah membuat komite curiga sebelum menyamakan limit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `es80` = rata-rata 20% kerugian terburuk dari `pnl`" },
        { id: "t2", text: "Hitung `rasio` = es80 / var80, lalu cetak keduanya" },
      ],
      expected: "es80=37.5  rasio=9.38",
      note: {
        title: "Sering salah",
        body: "Merata-ratakan seluruh data, bukan hanya ekornya. ES hanya merata-ratakan (1−α) bagian terburuk — 2 dari 10 data untuk ES 80%. Salah mengambil jendela = salah total angkanya.",
        type: "pitfall",
      },
      hints: [
        "Ubah P&L jadi kerugian: losses = [-x for x in pnl], lalu urutkan menurun.",
        "20% dari 10 data = 2 data terburuk: es80 = sum(losses[:2]) / 2.",
        "rasio = es80 / var80 dengan var80 = 4 yang sudah disediakan.",
      ],
      code: {
        starter: `# 10 hari P&L (Rp juta)\npnl = [5, -2, 8, -30, 3, -1, 6, -45, 2, -4]\nvar80 = 4  # VaR 80% (diketahui)\n\n# TULIS KODEMU: ES 80% dan rasio ES/VaR\nes80 = \nrasio = \n\nprint(f"es80={es80}  rasio={rasio:.2f}")`,
        lockLines: 3,
        solution: `# 10 hari P&L (Rp juta)\npnl = [5, -2, 8, -30, 3, -1, 6, -45, 2, -4]\nvar80 = 4  # VaR 80% (diketahui)\n\n# TULIS KODEMU: ES 80% dan rasio ES/VaR\nlosses = sorted([-x for x in pnl], reverse=True)\nes80 = sum(losses[:2]) / 2\nrasio = es80 / var80\n\nprint(f"es80={es80}  rasio={rasio:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "es80", value: 37.5, tol: 1e-9, label: "`es80` seharusnya 37.5", msg: "(45 + 30)/2 = 37,5. Cek: hanya 2 data terburuk yang dirata-ratakan." },
          { kind: "equal", task: "t2", name: "rasio", value: 9.375, tol: 0.01, label: "`rasio` seharusnya 9.38", msg: "37,5 / 4 = 9,375. Detektor ekor berteriak." },
          { kind: "stdout_matches", task: "t2", pattern: "es80=37\\.5\\s+rasio=9\\.38", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ES = rata-rata (1−α) terburuk. Rasio ES/VaR = detektor ekor.",
    },
    {
      id: "aksioma-koheren",
      eyebrow: "Langkah 3 · Koherensi",
      title: "Empat aksioma ukuran risiko yang waras",
      prose: [
        "Artzner dkk. (1999) mendefinisikan ukuran risiko koheren — sifat matematika yang seharusnya dimiliki setiap metrik risiko yang waras. Untuk ukuran risiko ρ (ρ(X) = modal/risiko posisi X), ada empat aksioma: monotonicity (posisi yang selalu lebih buruk → risiko lebih besar), subadditivitas (risiko gabungan ≤ jumlah risiko sendiri-sendiri — diversifikasi tidak boleh dihukum), positive homogeneity (skala posisi 2× → risiko 2×), dan translation invariance (tambah kas Rp c → risiko turun Rp c — inilah yang membuat ρ bisa dibaca sebagai kebutuhan modal).",
        "Hasil utama: ES memenuhi keempatnya (koheren). VaR gagal di subadditivitas — dan kegagalan itu bukan teori abstrak melainkan jebakan praktis. Kenapa subadditivitas aksioma terpenting? Tanpanya, metrik bisa berkata menggabungkan dua portofolio terdiversifikasi menaikkan risiko — memberi insentif yang salah: menghukum diversifikasi, menghargai konsentrasi.",
        "Bayangkan empat aksioma sebagai SIM untuk metrik risiko. Monotonicity = bisa bedakan baik vs buruk. Subadditivitas = tidak menghukum diversifikasi. Homogeneity = skala masuk akal. Translation invariance = bisa diterjemahkan jadi kebutuhan modal. VaR gagal ujian SIM di tikungan subadditivitas — makanya Basel beralih ke ES di FRTB.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan empat aksioma koherensi dengan satu kalimat masing-masing." },
        { id: "t2", text: "Jelaskan kenapa subadditivitas aksioma terpenting untuk regulator." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Regulator yang memakai metrik non-koheren untuk modal sedang memberi insentif berbahaya: bank dihukum saat diversifikasi dan dihargai saat konsentrasi. Pilihan metrik modal bukan soal statistika — ia membentuk perilaku seluruh industri.",
        type: "risk",
      },
      reference: "Koheren = 4 aksioma. ES lolos semua; VaR gagal subadditivitas.",
    },
    {
      id: "bukti-subadditivitas",
      eyebrow: "Langkah 4 · Bukti angka",
      title: "Membuktikan VaR tidak koheren — dan ES kebal",
      prose: [
        "Dua obligasi, masing-masing: default dengan probabilitas 4%, rugi 100 jika default, 0 jika tidak. Independen. VaR 95% tiap obligasi = 0 (peluang rugi > 0 hanya 4% < 5%). VaR 95% gabungan: peluang minimal satu default = 1 − 0,96² = 7,84% > 5% → kuantil 95% = 100. Jadi VaR(A+B) = 100 > VaR(A) + VaR(B) = 0 — subadditivitas dilanggar, saran implisit VaR: jangan diversifikasi.",
        "Sekarang ES 95%. Tiap obligasi: 5% terburuk = 4% massa di rugi 100 + 1% di rugi 0 → ES = (0,04×100)/0,05 = 80. Gabungan: P(rugi 200) = 0,16%, P(rugi 100) = 7,68%, P(rugi 0) = 92,16%. 5% terburuk = 0,16% di 200 + 4,84% di 100 → ES = (0,0016×200 + 0,0484×100)/0,05 = 103,2 ≤ 160. Tidak melanggar — diversifikasi diakui: 103,2 < 160. Selalu. Itu teorema, bukan kebetulan.",
        "Hitung sendiri kedua ES itu dan verifikasi ketidaksamaannya. Ini bukan kasus mainan: pelanggaran subadditivitas VaR terjadi tepat di portofolio kredit dan eksotik — obligasi high-yield, tranche sekuritisasi — yang payoff-nya lompatan. Justru di aset-aset inilah VaR paling sering dipakai untuk limit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `es_single` (ES 95% satu obligasi)" },
        { id: "t2", text: "Hitung `es_comb` (ES 95% gabungan) dan verifikasi `ok` = es_comb ≤ 2×es_single" },
      ],
      expected: "es_single=80.0  es_comb=103.2  ok=True",
      note: {
        title: "Sering salah",
        body: "Mengira pelanggaran subadditivitas VaR cuma kasus mainan yang tidak terjadi di dunia nyata. Ia terjadi tepat di portofolio dengan payoff lompatan — dan jika limit VaR menghukum diversifikasi, desk akan berkonsentrasi untuk menghemat VaR.",
        type: "pitfall",
      },
      hints: [
        "es_single = (0.04 * 100) / 0.05 — 4% massa di rugi 100, dibagi 5% ekor.",
        "es_comb = (0.0016*200 + 0.0484*100) / 0.05.",
        "ok = es_comb <= 2 * es_single. Harus True — ES tidak pernah melanggar.",
      ],
      code: {
        starter: `# Dua obligasi independen: P(default)=4%, rugi 100 jika default\n# TULIS KODEMU: ES 95% satu obligasi dan gabungan\nes_single = \nes_comb = \nok = \n\nprint(f"es_single={es_single}  es_comb={es_comb}  ok={ok}")`,
        lockLines: 1,
        solution: `# Dua obligasi independen: P(default)=4%, rugi 100 jika default\n# TULIS KODEMU: ES 95% satu obligasi dan gabungan\nes_single = (0.04 * 100) / 0.05\nes_comb = (0.0016 * 200 + 0.0484 * 100) / 0.05\nok = es_comb <= 2 * es_single\n\nprint(f"es_single={es_single}  es_comb={es_comb}  ok={ok}")`,
        checks: [
          { kind: "equal", task: "t1", name: "es_single", value: 80.0, tol: 1e-9, label: "`es_single` seharusnya 80.0", msg: "(0,04 × 100)/0,05 = 80. Ekor 5% berisi 4% massa di rugi 100." },
          { kind: "equal", task: "t2", name: "es_comb", value: 103.2, tol: 1e-9, label: "`es_comb` seharusnya 103.2", msg: "(0,0016×200 + 0,0484×100)/0,05. Cek bobot tiap skenario." },
          { kind: "equal", task: "t2", name: "ok", value: true, label: "`ok` seharusnya True", msg: "103,2 ≤ 160 — ES tidak melanggar subadditivitas." },
        ],
      },
      reference: "ES single = 80, ES gabungan = 103,2 ≤ 160. VaR: 100 > 0 + 0 — melanggar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "ES atau VaR — kapan memakai yang mana",
      prose: [
        "Empat keputusan. Pertama, kebutuhan modal regulasi (FRTB) → ES 97,5%: bukan pilihan melainkan kewajiban — regulator memilih ES karena koheren dan menangkap tail risk. ES 97,5% ≈ VaR 99% untuk distribusi normal, tetapi jauh lebih informatif untuk ekor tebal.",
        "Kedua, portofolio skew atau berekor tebal (kredit, short-vol, eksotik) → ES sebagai metrik utama: rasio ES/VaR > 1,5 atau payoff lompatan berarti VaR buta terhadap kedalaman ekor — persis di portofolio seperti inilah bencana bersembunyi. Ketiga, monitoring harian atau limit operasional sederhana → VaR masih OK dengan backtest: portofolio linear, distribusi tidak terlalu skew, butuh angka cepat yang mudah di-backtest.",
        "Keempat, alokasi modal antar unit bisnis → ES (koheren): pembagian capital charge harus aditif dan tidak menghukum diversifikasi; alokasi berbasis VaR bisa menghukum unit yang justru mendiversifikasi. Aturan 10 detik: selalu hitung ES bersama VaR — selisihnya adalah informasi ekor, bukan redundansi. Untuk modal dan alokasi: ES. Untuk backtest harian: VaR — karena VaR mudah di-backtest (hitung pelanggaran vs ekspektasi), sedangkan ES sulit di-backtest langsung.",
      ],
      tasks: [
        { id: "t1", text: "Desk menjual proteksi kredit mengajukan limit berbasis VaR 99% saja. Apa responsmu?" },
        { id: "t2", text: "Kenapa untuk monitoring harian VaR masih dipakai walau tidak koheren?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Payoff terima sedikit, rugi besar (menjual proteksi, short-vol) adalah kasus klasik buta-ekor VaR. Kombinasi ES + batas rasio ES/VaR + stress limit skenario spread memaksa desk membayar harga yang benar untuk tail risk — bukan harga diskon dari VaR.",
        type: "risk",
      },
      reference: "Modal & alokasi → ES. Monitoring harian → VaR (ter-backtest). Praktik terbaik: keduanya.",
    },
    {
      id: "minicase-limit",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Memilih metrik untuk limit trading",
      prose: [
        "Desk menjual proteksi kredit mengajukan limit: VaR 99% = Rp12 miliar — terlihat moderat dibanding modal yang dialokasikan. Kamu hitung ES 99%-nya: Rp38 miliar. Rasio ES/VaR = 3,2 — detektor ekor berteriak. Payoff desk ini skew: premi kecil masuk setiap bulan, bencana besar saat default beruntun.",
        "Keputusan: tolak limit berbasis VaR saja. Syaratkan tiga lapis: ES sebagai metrik limit utama (menangkap kedalaman ekor), batas rasio ES/VaR (alarm dini jika skew memburuk), dan stress limit skenario spread melebar (skenario konkret, bukan statistik abstrak). Desk memprotes: tidak ada desk lain yang diperlakukan begini. Jawabanmu: tidak ada desk lain yang payoff-nya seperti ini.",
        "Pelajaran umumnya: metrik limit harus mengikuti bentuk distribusi, bukan kebiasaan. Distribusi simetris tipis → VaR cukup. Distribusi skew atau lompatan → ES wajib. Dan apapun distribusinya, laporkan keduanya — selisihnya adalah informasi, bukan redundansi.",
      ],
      tasks: [
        { id: "t1", text: "Dengan VaR Rp12 M dan ES Rp38 M, hitung rasio dan simpulkan." },
        { id: "t2", text: "Tuliskan tiga lapis persyaratan limit untuk desk penjual proteksi." },
      ],
      note: {
        title: "Sering salah",
        body: "Menyeragamkan metrik limit untuk semua desk demi keadilan prosedural. Keadilan yang benar adalah metrik yang sesuai risiko masing-masing desk — menyeragamkan justru tidak adil bagi bank: desk skew mendapat subsidi risiko dari desk normal.",
        type: "pitfall",
      },
      reference: "Rasio 3,2 → tolak VaR-only. Syarat: ES + batas rasio + stress skenario.",
    },
    {
      id: "backtest-es",
      eyebrow: "Langkah 7 · Menguji ES",
      title: "Backtest Expected Shortfall: yang bisa dan tidak bisa diuji",
      prose: [
        "VaR mudah di-backtest: hitung pelanggaran, bandingkan dengan ekspektasi 1% — uji Kupiec dan Christoffersen bekerja karena VaR adalah kuantil, dan kuantil bisa diuji langsung dari frekuensi. ES jauh lebih sulit: ES adalah rata-rata bersyarat di ekor — tidak ada hitungan sederhana ya/tidak yang mengujinya. Hasil teorinya tegas: ES sendirian tidak elisitable (Gneiting, 2011) — tidak ada fungsi skoring yang membuat prakiraan ES jujur menjadi pemenang unik. Artinya: tidak ada uji backtest langsung untuk ES yang sebersih uji pelanggaran untuk VaR.",
        "Jalan keluarnya: ES bisa diuji bersama VaR. Pasangan (VaR, ES) bersifat jointly elicitable (Fissler-Ziegel, 2016) — ada fungsi skoring gabungan yang menghargai prakiraan jujur untuk keduanya sekaligus. Praktiknya: untuk membandingkan dua model ES, hitung rata-rata skor gabungan Fissler-Ziegel atas data historis — model dengan skor lebih rendah (lebih baik) menang. Ini bukan lampu lalu lintas hijau/kuning/merah seperti backtest VaR, melainkan perbandingan relatif antar model — tetapi ia memberi dasar statistik yang sah untuk memilih model ES, bukan sekadar intuisi.",
        "Pendekatan kedua yang dipakai regulator: uji VaR di beberapa tingkat kepercayaan sekaligus (misal 97,5% dan 99%) sebagai pemeriksaan tidak langsung terhadap ekor — jika model lolos di kedua level, bentuk ekornya lebih bisa dipercaya. Ditambah uji berbasis residual: pada hari-hari pelanggaran, bandingkan rata-rata kerugian aktual vs ES yang diprakirakan (exceedance residual test ala McNeil-Frey) — sederhana, intuitif, tetapi power statistiknya rendah untuk sampel 250 hari. Aturan praktis: untuk validasi formal pakai skoring gabungan untuk memilih model; untuk monitoring rutin pakai uji multi-level VaR + residual ekor; dan jangan pernah klaim model ES tervalidasi hanya karena backtest VaR-nya hijau — keduanya menguji hal berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa ES tidak bisa di-backtest langsung seperti VaR." },
        { id: "t2", text: "Sebutkan dua pendekatan praktis untuk memvalidasi model ES dan kapan masing-masing dipakai." },
      ],
      note: {
        title: "Intuisi: uji apa yang bisa diuji, akui yang tidak",
        body: "Prinsip senior dalam validasi model: jangan memaksa uji yang tidak ada. Lima heuristik. Pertama: pahami dulu sifat matematis metrikmu — VaR (kuantil) bisa diuji frekuensinya, ES (rata-rata bersyarat) tidak; memaksakan uji pelanggaran ke ES adalah kategori yang salah. Kedua: ketika uji langsung tidak ada, pakai uji tidak langsung yang sah — skoring gabungan VaR-ES untuk memilih model, uji multi-level untuk memeriksa bentuk ekor; jangan ganti dengan uji asal-asalan yang terlihat meyakinkan. Ketiga: bedakan memilih model vs memonitor model — skoring gabungan untuk seleksi berkala, residual ekor untuk alarm harian; satu alat untuk dua tujuan biasanya gagal di keduanya. Keempat: waspadai klaim validasi yang berlebihan — backtest VaR hijau bukan sertifikat ES; tulis di laporan validasi dengan jujur apa yang diuji dan apa yang tidak. Kelima: untuk ekor, sampel kecil adalah musuh abadi — 250 hari hanya memberi ~2–3 observasi di ekor 99%; jangan over-interpretasi satu statistik dari sedikit data, gabungkan beberapa bukti. Aturan 10 detiknya: tanya dulu apakah metrikmu bisa diuji langsung — kalau tidak, cari pasangan yang jointly elicitable dan uji keduanya.",
      },
      reference: "ES tidak elisitable sendirian; pasangan (VaR, ES) jointly elicitable — pakai skoring gabungan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Delapan pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut.",
      ],
      tasks: [],
      summary: [
        "ES = ekspektasi kerugian bersyarat di luar ambang VaR — menjawab seberapa dalam jika VaR terlampaui. Selalu ES ≥ VaR.",
        "Rasio ES/VaR adalah detektor ekor: ≈1,15 untuk normal; >1,5 waspadai skew; contoh tadi 9,4.",
        "Ukuran risiko koheren memenuhi 4 aksioma; VaR gagal di subadditivitas — menghukum diversifikasi.",
        "Bukti angka: VaR gabungan 100 > 0+0 (melanggar); ES gabungan 103,2 ≤ 160 (tidak).",
        "Modal FRTB dan alokasi → ES 97,5%. Monitoring harian → VaR (mudah di-backtest). Praktik terbaik: laporkan keduanya.",
      ],
      next: { label: "MR6 — Backtesting", href: "/v2/learn/mr6-backtesting" },
      quiz: [
        {
          q: "ES 99% = Rp28 M. Artinya?",
          options: [
            { text: "Kerugian maksimal Rp28 M", why: "ES bukan batas atas." },
            { text: "Jika masuk 1% hari terburuk, rata-rata kerugiannya Rp28 M", why: "ES = ekspektasi bersyarat di luar ambang VaR — menjawab seberapa dalam jika VaR terlampaui.", correct: true },
            { text: "Ada 99% peluang rugi tepat Rp28 M", why: "bukan peluang tepat, melainkan rata-rata bersyarat." },
            { text: "Sama dengan VaR 99%", why: "ES ≥ VaR, dan hanya sama jika ekornya datar sempurna." },
          ],
        },
        {
          q: "Aksioma koherensi yang dilanggar VaR?",
          options: [
            { text: "Monotonicity", why: "VaR lolos monotonicity." },
            { text: "Subadditivitas — VaR gabungan bisa melebihi jumlah VaR sendiri-sendiri, menghukum diversifikasi", why: "contoh dua obligasi — VaR₁+VaR₂ = 0 tetapi VaR gabungan = 100. Satu-satunya aksioma yang gagal, dan justru yang paling penting.", correct: true },
            { text: "Positive homogeneity", why: "VaR lolos homogeneity." },
            { text: "Translation invariance", why: "VaR lolos translation invariance." },
          ],
        },
        {
          q: "Rasio ES₉₉/VaR₉₉ portofoliomu = 2,8. Kesimpulan?",
          options: [
            { text: "Normal — tidak ada masalah", why: "normal ≈ 1,15, bukan 2,8." },
            { text: "Ekor sangat tebal/skew — VaR sendirian berbahaya; pakai ES untuk limit dan selidiki sumber skew-nya", why: "rasio 2,8 = detektor ekor berteriak — ada payoff lompatan/skew seperti menjual proteksi.", correct: true },
            { text: "Data salah hitung", why: "jangan salahkan data sebelum memahami distribusinya." },
            { text: "Kurangi VaR-nya", why: "masalahnya bukan besar VaR, melainkan bentuk ekor." },
          ],
        },
        {
          q: "Mengapa FRTB memilih ES 97,5% (bukan VaR 99%) untuk modal?",
          options: [
            { text: "Supaya angkanya lebih kecil", why: "bukan soal kosmetika angka." },
            { text: "ES koheren (tidak menghukum diversifikasi) dan menangkap tail risk — dua sifat yang dibutuhkan modal yang memberi insentif benar", why: "modal berbasis metrik non-koheren memberi insentif konsentrasi. ES 97,5% ≈ VaR 99% untuk normal tetapi jauh lebih informatif untuk ekor tebal.", correct: true },
            { text: "VaR terlalu sulit dihitung", why: "VaR justru lebih mudah dihitung." },
            { text: "Supaya bank terlihat aman", why: "motivasinya insentif yang benar, bukan pencitraan." },
          ],
        },
        {
          q: "Untuk monitoring harian operasional, VaR masih dipakai walau tidak koheren. Mengapa?",
          options: [
            { text: "Karena lebih akurat dari ES", why: "bukan soal akurasi." },
            { text: "Karena VaR mudah di-backtest (hitung pelanggaran vs ekspektasi); ES sulit di-backtest langsung", why: "backtest VaR sederhana — bandingkan jumlah pelanggaran aktual vs ekspektasi 1%. Praktik terbaik: laporkan keduanya.", correct: true },
            { text: "Karena regulator melarang ES harian", why: "tidak ada larangan seperti itu." },
            { text: "Karena ES tidak bisa dihitung", why: "ES bisa dihitung — yang sulit adalah backtest langsungnya." },
          ],
        },
        {
          q: "Mengapa ES tidak bisa di-backtest langsung seperti VaR?",
          options: [
            { text: "Karena ES selalu lebih besar dari VaR", why: "itu fakta, bukan alasan keterbatasan uji." },
            { text: "Karena ES adalah rata-rata bersyarat di ekor — tidak elisitable sendirian, tidak ada hitungan ya/tidak sederhananya", why: "VaR = kuantil → bisa diuji dari frekuensi pelanggaran. ES butuh pasangan VaR (jointly elicitable) untuk diuji secara sah.", correct: true },
            { text: "Karena ES tidak punya rumus", why: "ES punya rumus yang jelas — masalahnya di pengujiannya." },
            { text: "Karena data tidak cukup", why: "data sedikit memperparah, tetapi keterbatasannya bersifat matematis, bukan cuma sampel." },
          ],
        },
        {
          q: "Dua model ES bersaing. Cara yang sah secara statistik untuk memilih?",
          options: [
            { text: "Pilih yang angkanya lebih kecil", why: "lebih kecil belum tentu lebih akurat — bisa jadi underestimate." },
            { text: "Bandingkan rata-rata skor gabungan Fissler-Ziegel (VaR, ES) atas data historis — skor lebih baik menang", why: "pasangan (VaR, ES) jointly elicitable — skoring gabungan menghargai prakiraan jujur untuk keduanya.", correct: true },
            { text: "Pilih yang backtest VaR-nya hijau", why: "backtest VaR hijau tidak memvalidasi ES — keduanya menguji hal berbeda." },
            { text: "Pilih yang lebih konservatif", why: "konservatif berlebihan = modal terbuang; yang dicari adalah akurasi, bukan kehati-hatian buta." },
          ],
        },
        {
          q: "Backtest VaR 99% hijau tetapi uji multi-level (97,5% dan 99%) menunjukkan model gagal di 97,5%. Artinya?",
          options: [
            { text: "Tidak masalah — yang penting 99% lolos", why: "kegagalan di 97,5% berarti bentuk ekor tidak tertangkap — ES yang dihitung dari ekor itu tidak bisa dipercaya." },
            { text: "Bentuk ekor model salah — ES dari model ini tidak bisa dipercaya walau VaR 99%-nya lolos", why: "ES bergantung pada seluruh bentuk ekor, bukan satu titik kuantil. Uji multi-level memeriksa bentuknya.", correct: true },
            { text: "Model harus dibuang total", why: "belum tentu dibuang — bisa direkalibrasi dengan distribusi berekor lebih tebal." },
            { text: "Naikkan confidence ke 99,9%", why: "menaikkan confidence tidak memperbaiki bentuk ekor yang salah." },
          ],
        },
      ],
    },
  ],
};
