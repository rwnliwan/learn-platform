import type { V2Lesson } from "../lib/types";

// Sketsa candlestick OHLC: 2 candle dengan anotasi open/high/low/close.
// Kiri bullish (close > open), kanan bearish (open > close).
// Angka ilustrasi, bukan data aktual.
const CANDLE_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Sketsa dua candlestick dengan anotasi open, high, low, close: kiri bullish, kanan bearish.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<line x1="190" y1="53" x2="190" y2="187" stroke="var(--c1)" stroke-width="2"/>
<rect x="170" y="87" width="40" height="66" fill="var(--c1)"/>
<line x1="400" y1="70" x2="400" y2="203" stroke="var(--c3)" stroke-width="2"/>
<rect x="380" y="87" width="40" height="83" fill="var(--c3)"/>
<g stroke="var(--chart-text)" stroke-width="1"><line x1="170" y1="53" x2="115" y2="40"/><line x1="170" y1="87" x2="115" y2="87"/><line x1="170" y1="153" x2="115" y2="153"/><line x1="170" y1="187" x2="115" y2="200"/><line x1="420" y1="87" x2="445" y2="87"/><line x1="420" y1="170" x2="445" y2="170"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="110" y="44">high = 130</text><text x="110" y="91">close = 120</text><text x="110" y="157">open = 100</text><text x="110" y="204">low = 90</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)"><text x="450" y="91">open = 120</text><text x="450" y="174">close = 95</text></g>
<text x="190" y="236" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">bullish: close &gt; open</text>
<text x="400" y="236" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">bearish: open &gt; close</text>
<text x="280" y="14" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">sketsa candlestick: OHLC</text>
</svg>`;

export const pmd1: V2Lesson = {
  slug: "pm-d1-data-harga",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D1 — Data & Harga",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-xyz",
      eyebrow: "Langkah 1 · Cerita",
      title: "Saham yang \u2018naik\u2019 500% dalam sehari",
      prose: [
        "2019: screener saham menampilkan XYZ +500% sehari! Junior analis berteriak \u2018breakout!\u2019 \u2014 senior tersenyum: reverse split 1:5. Harga \u2018naik\u2019 5×, nilai tetap. Yang beli di \u2018breakout\u2019 = tertipu data mentah.",
        "Twist-nya: 80% \u2018anomali\u2019 di backtest = artefak data (split tak ter-adjust, saham delisted hilang, harga basi). Analisis canggih di atas data kotor = kebohongan presisi.",
        "Lesson ini tentang fondasi sebelum menara: harga yang jujur, kuburan yang tidak hilang, dan ritual curiga.",
      ],
      tasks: [],
      reference: "Curiga dulu, kagum kemudian.",
    },
    {
      id: "adjusted-price",
      eyebrow: "Langkah 2 · Adjusted price + chart",
      title: "Harga yang jujur",
      prose: [
        "Harga unadjusted = harga tercatat (menipu saat corporate action!). Harga adjusted = disesuaikan mundur untuk split & dividen → return yang benar. Stock split 2:1: harga ÷2, jumlah saham ×2 (nilai tetap!). Dividen: harga turun ≈ dividen di ex-date → histori di-adjust naik. Aturannya: selalu pakai adjusted untuk return; unadjusted hanya untuk level (support/resistance).",
        "Contoh split: saham @10.000, split 2:1 → harga jadi 5.000. Mentah: (5.000−10.000)/10.000 = −50% (salah!). Adjusted: 10.000 → 5.000×2 = 10.000 → 0% (benar!). Contoh dividen: beli @100, jual @105, dividen 5 → price return 5%, tetapi total return = (105+5−100)/100 = 10%. Dividen = return; abaikan = setengah cerita. Standar industri = total return.",
        "Kasus XYZ: @10.000 → reverse split 1:5 → @50.000. Screener bilang +400% (salah!). Adjusted: 10.000×5 = 50.000 → 0%. Dan rights issue adalah jebakan terbesar: saham @1.000, rights 1:1 @800 → harga teoritis ex-rights = (1.000+800)/2 = 900. Jika tidak adjust → terlihat turun 10%, padahal 0% (pemegang dapat rights!).",
        "Cara membaca: tiap candle merangkum empat angka satu periode — open (harga buka), high (tertinggi), low (terendah), close (tutup). Badan (body) = jarak open–close; sumbu (wick) = high–low. Candle kiri bullish: close di atas open (badan terisi). Candle kanan bearish: open di atas close.",
        "Interpretasi: “breakout +500%” XYZ di screener biasanya tampil sebagai candle hijau raksasa — tanpa membaca OHLC-nya, ia terlihat seperti peluang. Begitu tahu high/low/open/close-nya (dan bahwa itu reverse split 1:5), candle raksasa itu terbaca sebagai artefak data, bukan sinyal. Candlestick tidak menyelamatkanmu dari data mentah — tetapi ia memaksamu melihat empat angka, bukan satu angka return yang menipu.",
      ],
      figure: {
        svg: CANDLE_SVG,
        alt: "Sketsa dua candlestick dengan anotasi open, high, low, close: kiri bullish, kanan bearish.",
        caption: "Anatomi candlestick: badan = open–close, sumbu = high–low. Baca keempat angkanya sebelum percaya pada satu angka return.",
      },
      formula: String.raw`P^{adj}_{t-1} = P_{t-1} \times \frac{P_t - D}{P_t} \quad (dividen)`,
      formulaNote: "Split 2:1: semua harga sebelum split dibagi 2. Dividen Rp100, harga Rp1.000 → faktor 0,9.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Return dihitung dari harga penutupan biasa (unadjusted).\u2019 Salah. Corporate action membuat unadjusted menipu (XYZ +400% palsu!). Selalu adjusted untuk return. Salah pilih = semua angka downstream salah.",
      },
      reference: "Split = pecah uang Rp100rb jadi 2×Rp50rb: kantong sama.",
    },
    {
      id: "lab-adjust-split",
      eyebrow: "Langkah 3 · Lab adjust split",
      title: "Betulkan harga historis",
      prose: [
        "Sesuaikan harga historis untuk stock split 2:1, lalu bandingkan return mentah vs adjusted. Coba ubah RASIO menjadi 5 (split 1:5): harga adjusted makin kecil \u2014 tetapi return adjusted tetap sama. Split tidak menciptakan nilai.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `adj`, `ret_unadj`, `ret_adj`" },
        { id: "t2", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Return UNADJUSTED: -50% (menipu!)  Return ADJUSTED  : 0.0% (benar)",
      hints: [
        "adj = [h/RASIO for h in harga] \u2014 semua harga sebelum split dibagi rasio.",
        "ret_unadj = (harga_setelah − harga[-1])/harga[-1]; ret_adj = (harga_setelah − adj[-1])/adj[-1].",
        "Format :.0% untuk persen bulat, :.1% untuk satu desimal.",
      ],
      code: {
        starter: `# Adjust harga untuk stock split\nharga = [10000, 10200, 10100, 10300]  # sebelum split\nRASIO = 2          # split 2:1 (ubah jadi 5!)\nharga_setelah = 5150  # tercatat setelah split\n\n# TULIS KODEMU\nadj = \nret_unadj = \nret_adj = \n\nprint("Harga adjusted:", [f"{h:.0f}" for h in adj])\nprint(f"Return UNADJUSTED: {ret_unadj:.0%} (menipu!)")\nprint(f"Return ADJUSTED  : {ret_adj:.1%} (benar)")\nprint()\nprint("Split tidak menciptakan nilai - hanya pecah uang.")`,
        lockLines: 3,
        solution: `# Adjust harga untuk stock split\nharga = [10000, 10200, 10100, 10300]  # sebelum split\nRASIO = 2          # split 2:1 (ubah jadi 5!)\nharga_setelah = 5150  # tercatat setelah split\n\n# TULIS KODEMU\nadj = [h / RASIO for h in harga]\nret_unadj = (harga_setelah - harga[-1]) / harga[-1]\nret_adj = (harga_setelah - adj[-1]) / adj[-1]\n\nprint("Harga adjusted:", [f"{h:.0f}" for h in adj])\nprint(f"Return UNADJUSTED: {ret_unadj:.0%} (menipu!)")\nprint(f"Return ADJUSTED  : {ret_adj:.1%} (benar)")\nprint()\nprint("Split tidak menciptakan nilai - hanya pecah uang.")`,
        checks: [
          { kind: "equal", task: "t1", name: "ret_unadj", value: -0.5, tol: 1e-9, label: "`ret_unadj` = −0.5", msg: "(5.150 − 10.300)/10.300 = −50% \u2014 menipu!" },
          { kind: "equal", task: "t1", name: "ret_adj", value: 0.0, tol: 1e-9, label: "`ret_adj` = 0.0", msg: "(5.150 − 5.150)/5.150 = 0% \u2014 benar." },
          { kind: "stdout_matches", task: "t2", pattern: "Return ADJUSTED  : 0\\.0% \\(benar\\)", label: "`print` menampilkan Return ADJUSTED 0.0%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Selalu pakai adjusted untuk return; mentah = menyesatkan.",
    },
    {
      id: "lab-survivorship",
      eyebrow: "Langkah 4 · Lab survivorship bias",
      title: "Kuburan yang hilang",
      prose: [
        "Simulasikan 60 saham hidup dan 40 saham bangkrut (−100%): bandingkan return yang \u2018tercatat\u2019 database dengan return sebenarnya. Coba ubah MATI menjadi 0 (tanpa delisted): bias hilang \u2014 itulah dunia fiksi database tanpa kuburan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tercatat`, `sebenarnya`, `bias`" },
        { id: "t2", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Return TERCATAT: 11.5%  Return SEBENARNYA: -33.1%  BIAS: +44.6%",
      hints: [
        "tercatat = rata-rata ret_hidup; sebenarnya = (sum(ret_hidup) + sum(ret_mati))/(HIDUP+MATI).",
        "bias = tercatat − sebenarnya; format :+.1% untuk tanda eksplisit.",
        "random.seed(42) membuat hasil deterministik \u2014 jangan ubah.",
      ],
      code: {
        starter: `# Survivorship bias: yang mati tidak tercatat\nimport random\nrandom.seed(42)\nHIDUP, MATI = 60, 40   # jumlah saham (ubah MATI jadi 0!)\nret_hidup = [random.uniform(-0.2, 0.5) for _ in range(HIDUP)]\nret_mati = [-1.0] * MATI  # bangkrut = -100%\n\n# TULIS KODEMU\ntercatat = \nsebenarnya = \nbias = \n\nprint(f"Return TERCATAT (tanpa yg mati): {tercatat:.1%}")\nprint(f"Return SEBENARNYA (semua)      : {sebenarnya:.1%}")\nprint(f"BIAS: {bias:+.1%} (kuburan yang hilang!)")\nprint()\nprint("Database tanpa delisted = fiksi yang optimis.")`,
        lockLines: 5,
        solution: `# Survivorship bias: yang mati tidak tercatat\nimport random\nrandom.seed(42)\nHIDUP, MATI = 60, 40   # jumlah saham (ubah MATI jadi 0!)\nret_hidup = [random.uniform(-0.2, 0.5) for _ in range(HIDUP)]\nret_mati = [-1.0] * MATI  # bangkrut = -100%\n\n# TULIS KODEMU\ntercatat = sum(ret_hidup) / HIDUP\nsebenarnya = (sum(ret_hidup) + sum(ret_mati)) / (HIDUP + MATI)\nbias = tercatat - sebenarnya\n\nprint(f"Return TERCATAT (tanpa yg mati): {tercatat:.1%}")\nprint(f"Return SEBENARNYA (semua)      : {sebenarnya:.1%}")\nprint(f"BIAS: {bias:+.1%} (kuburan yang hilang!)")\nprint()\nprint("Database tanpa delisted = fiksi yang optimis.")`,
        checks: [
          { kind: "equal", task: "t1", name: "tercatat", value: 0.1152, tol: 0.001, label: "`tercatat` ≈ 0.115", msg: "Rata-rata 60 return acak uniform(−0,2; 0,5) dengan seed 42." },
          { kind: "equal", task: "t1", name: "sebenarnya", value: -0.3309, tol: 0.001, label: "`sebenarnya` ≈ −0.331", msg: "40 saham −100% menarik rata-rata jauh ke bawah." },
          { kind: "equal", task: "t1", name: "bias", value: 0.4461, tol: 0.001, label: "`bias` ≈ +0.446", msg: "44,6 poin! Database tanpa kuburan = fiksi optimis." },
          { kind: "stdout_matches", task: "t2", pattern: "BIAS: \\+44\\.6% \\(kuburan yang hilang!\\)", label: "`print` menampilkan BIAS +44.6%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tanya vendor 1 kalimat: \u2018apakah database ini point-in-time termasuk delisted?\u2019",
    },
    {
      id: "survivorship-bias",
      eyebrow: "Langkah 5 · Survivorship bias",
      title: "Reuni tanpa yang bangkrut",
      prose: [
        "Survivorship bias: database hanya berisi saham yang masih hidup → return historis terlihat lebih tinggi (yang bangkrut \u2018dihapus\u2019!). Dampaknya: bias 2\u20134%/tahun untuk strategi saham. Analoginya: menilai sekolah dari alumni sukses \u2014 yang DO tidak diundang reuni.",
        "Contoh: backtest 2010\u20132020 saham IDX return 18%/tahun! Due diligence: database tanpa 40 saham delisted (mayoritas −100%). Dengan delisted: return 13%. Selisih 5 poin = kuburan. Contoh gaya CFA: 100 saham tahun 2000; 2020: 70 bertahan (rata-rata +10%/tahun), 30 delisted (−100%). Rata-rata yang \u2018dilaporkan\u2019: +10% (hanya yang bertahan!) vs sebenarnya jauh lebih rendah \u2014 bias 7\u20138 poin, masif.",
        "Saudaranya: look-ahead bias \u2014 backtest pakai konstituen indeks kini (2024) untuk 2010\u20132024. Konstituen kini = pemenang; yang keluar (kalah!) = hilang. Hasil backtest terlalu bagus. Obat keduanya: database point-in-time \u2014 data yang tersedia pada waktu itu, termasuk yang delisted. Jika vendor tidak punya: kurangi 2\u20134% dari hasil backtest, atau tolak.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Data dari vendor mahal = pasti bersih. Langsung analisis.\u2019 Salah. Tidak ada data bersih \u2014 vendor pun punya stale, error split, missing delisted. Quality check (distribusi return, lompatan, stale) = ritual wajib sebelum analisis. Percaya tapi verifikasi: 30 menit EDA menghemat 3 bulan sesat.",
      },
      reference: "Kasus nyata 2018: hedge fund backtest Sharpe 2,5 (look-ahead + tanpa adjust dividen) → live 0,2 → fund tutup 18 bulan kemudian.",
    },
    {
      id: "cleaning",
      eyebrow: "Langkah 6 · Data cleaning",
      title: "Stale, missing, sinkron",
      prose: [
        "Stale price: harga tidak bergerak berhari-hari (tidak likuid!) → volatilitas understated. Saham gorengan: harga Rp500 tidak bergerak 20 hari → vol terhitung 2% (\u2018aman!\u2019). Realita: tidak ada transaksi → saat ada, lompat ±30%. Vol 2% = fatamorgana. Aturan: hitung % hari nol-volume; jika > 20% → exclude dari analisis risiko. Likuiditas = prasyarat statistik.",
        "Missing data: libur beda negara, suspensi. Forward-fill hati-hati \u2014 bukan untuk return! Sinkronisasi: pasar tutup beda jam (IDX 15:00 WIB vs NYSE 04:00 WIB) → return \u2018harian\u2019 tidak sebanding; konversi ke UTC, dokumentasikan. Mata uang: konsisten! Saham AS +10%, IDR melemah 5% → return IDR = 1,10×1,05 − 1 = 15,5%.",
        "Outlier: harga 100, 101, 1000, 102 \u2014 salah ketik atau nyata (flash crash)? Jangan asal buang: investigasi, dokumentasikan, transparan. Ritual 3 cek sebelum analisis: (1) plot harga \u2014 ada lompatan vertikal > 20%? (2) % hari stale/nol-volume; (3) daftar corporate actions periode itu. 15 menit, selamatkan karier.",
      ],
      tasks: [],
      reference: "Checklist 7: adjusted? point-in-time? stale? outlier? mata uang? timezone? total return?",
    },
    {
      id: "minicase-breakout",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Breakout palsu",
      prose: [
        "Screener: XYZ +500% sehari! Junior: \u2018breakout!\u2019 (all-in!). Faktanya: reverse split 1:5 \u2014 return sebenarnya 0%. Junior rugi (beli di puncak ilusi!).",
        "(a) Return benar: 0% (Rp10.000×5 = Rp50.000 adjusted). Bukan +400%. (b) Sistem agar tidak terulang: screener pakai adjusted + alert corporate action + ritual 3 cek (lompatan? stale? CA?). Junior dilatih curiga dulu. (c) Pelajaran survivorship: data mentah = musuh pertama; 80% \u2018anomali\u2019 = artefak. Bersihkan dulu, kagum kemudian.",
        "(d) Jika backtest strategi ini 10 tahun tanpa adjust: bencana \u2014 backtest \u2018menemukan\u2019 breakout palsu → return ilusi; live = gagal. Garbage in = garbage out. (e) Checklist data: (1) adjusted? (2) point-in-time? (3) corporate actions? (4) stale? (5) outlier? (6) mata uang? (7) timezone? Tujuh cek sebelum analisis.",
      ],
      tasks: [],
      reference: "Tantangan Indonesia: likuiditas rendah → banyak stale; rights issue & waran sering → adjust semua CA.",
    },
    {
      id: "data-asof",
      eyebrow: "Langkah 8 · Data as-of",
      title: "Tanggal yang menipu: diumumkan vs efektif",
      prose: [
        "Jebakan lookahead yang paling halus bukan di harga — melainkan di KALENDER corporate action. IDX mengumumkan rights issue berminggu-minggu sebelum ex-date. Database “per hari ini” menampilkan harga yang sudah adjust sempurna... tetapi kapan pasar TAHU? Jika backtest-mu membeli di harga cum-date memakai informasi yang baru diumumkan kemudian, kamu sedang melihat masa depan dengan baju data historis.",
        "Tiga tanggal, tiga “kebenaran” berbeda. Tanggal pengumuman: pasar pertama kali tahu (harga mulai bergerak). Ex-date: yang membeli setelah tanggal ini tidak dapat hak (harga adjust). Tanggal distribusi: kas atau saham benar-benar diterima. Database vendor biasanya hanya menyimpan ex-date — dan harga adjusted-nya dihitung dengan hindsight sempurna: mereka tahu SEMUA corporate action yang pernah terjadi. Backtest yang jujur hanya boleh memakai information set yang tersedia SAAT ITU.",
        "Contoh konkret: rights issue sebuah bank BUMN 2021 — diumumkan September, ex-date Oktober. Strategi “beli 5 hari sebelum rights issue” yang diuji pada data adjusted sempurna terlihat cuan 8%: ia membeli di harga cum yang “tahu” harga ex-nya. Dengan vintage data (harga apa adanya per tanggal pengumuman), return-nya 1,2% — nyaris noise. Selisih 6,8 poin = hindsight, bukan alpha.",
        "Praktik jujur: bangun kalender corporate action sendiri dari pengumuman keterbukaan informasi IDX, lalu join sinyal pada tanggal PENGUMUMAN — bukan ex-date. Jika vendor tidak bisa memberi timestamp pengumuman, perlakukan setiap sinyal di sekitar corporate action sebagai tersangka. Aturan keputusan: strategi yang edge-nya terkonsentrasi dalam ±5 hari di sekitar corporate action = artefak data sampai terbukti sebaliknya. Buang jendela itu dari evaluasi; jika edge hilang, ia tidak pernah ada.",
      ],
      formula: String.raw`P_{ex} = \frac{P_{cum} \times N_{lama} + P_{rights} \times N_{baru}}{N_{lama} + N_{baru}}`,
      formulaNote: "P_ex = harga teoritis ex-rights; P_cum = harga cum-rights (sebelum ex-date); N_lama = jumlah saham lama; P_rights = harga tebus rights; N_baru = saham baru dari rights. Contoh: P_cum Rp1.000, rights 1:1 @Rp800 → P_ex = (1.000+800)/2 = Rp900. Harga tercatat Rp900 tanpa penjelasan = sudah adjust; tercatat Rp1.000 lalu “jatuh” 10% = belum adjust → return palsu −10%.",
      tasks: [],
      note: {
        title: "💡 Intuisi: data kotor berbohong dengan percaya diri",
        body: "Data kotor tidak pernah terlihat kotor — ia terlihat seperti anomali yang layak ditradingkan. Tiga heuristik praktisi. Pertama: jika backtest terlihat “terlalu bagus” (Sharpe > 2 tanpa penjelasan ekonomi), tersangka pertamanya adalah data, bukan kejeniusanmu — cek corporate action dulu, bukan parameter. Kedua: jangan percaya deret harga yang belum pernah kamu plot — mata menangkap lompatan vertikal > 20% yang lolos dari semua statistik ringkas; lompatan seperti itu 9 dari 10 kali adalah corporate action atau salah ketik, bukan peluang. Ketiga: ajukan satu kalimat ke vendor — “apakah database ini point-in-time termasuk delisted?” — jika jawabannya ragu-ragu, potong 2–4% dari hasil backtest-mu atau tolak databasenya. Ritual curiga 15 menit bukan paranoia; ia asuransi termurah di industri ini: 15 menit EDA menghemat 3 bulan mengejar hantu. Praktisi senior menyimpan “buku harian data” — setiap keanehan dicatat lengkap dengan tanggal dan perbaikannya, karena jebakan yang sama selalu kembali dengan penyamaran baru.",
      },
      reference: "Vintage data: harga yang diketahui SAAT ITU, bukan yang diketahui sekarang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Adjusted price: untuk return (split/dividen disesuaikan mundur); standar = total return.",
        "Survivorship bias 2\u20134%/tahun: database harus point-in-time termasuk delisted; waspadai look-ahead bias.",
        "Stale price: vol fatamorgana; flag jika > 20% hari nol-volume; likuiditas = prasyarat statistik.",
        "Sinkronisasi: samakan timestamp antar-pasar (UTC); konsisten mata uang (kurs tepat).",
        "Ritual: curiga dulu \u2014 plot, cek lompatan, daftar CA \u2014 sebelum model. Tidak ada data bersih.",
      ],
      next: { label: "D2 \u2014 Optimisasi", href: "/v2/learn/pm-d2-optimisasi" },
      quiz: [
        {
          q: "Split 2:1, harga Rp10.000. Harga adjusted histori?",
          options: [
            { text: "Rp10.000", why: "Salah: itu harga mentah sebelum adjust \u2014 return dari sini = −50% palsu." },
            { text: "Rp5.000", why: "Tepat: bagi 2. Nilai tetap (saham ×2). Return dihitung dari adjusted!", correct: true },
            { text: "Rp20.000", why: "Salah: split membagi harga, bukan menggandakan \u2014 itu arah reverse split." },
            { text: "Rp0", why: "Salah: split tidak menghapus nilai \u2014 hanya pecah uang." },
          ],
        },
        {
          q: "Database tanpa delisted, backtest 18%. Realita kemungkinan?",
          options: [
            { text: "18%", why: "Salah: 18% = angka fiksi optimis tanpa kuburan." },
            { text: "13% (bias 2\u20135 poin dari kuburan)", why: "Tepat: survivorship bias 2\u20134%/tahun. Tanya vendor: point-in-time?", correct: true },
            { text: "25%", why: "Salah: bias membuat angka terlihat lebih tinggi, bukan lebih rendah." },
            { text: "0%", why: "Salah: bias mengurangi beberapa poin, bukan menghapus semua return." },
          ],
        },
        {
          q: "Harga tidak bergerak 20 hari, vol terhitung 2%. Kesimpulan?",
          options: [
            { text: "Aman \u2014 vol rendah", why: "Salah: tidak ada transaksi ≠ tidak ada risiko \u2014 itu fatamorgana." },
            { text: "Stale price \u2014 vol fatamorgana, cek likuiditas", why: "Tepat: % hari nol-volume > 20% → exclude dari analisis risiko.", correct: true },
            { text: "Beli \u2014 stabil", why: "Salah: \u2018stabil\u2019 karena tidak diperdagangkan = jebakan likuiditas." },
            { text: "Jual \u2014 pasti jatuh", why: "Salah: stale tidak memprediksi arah \u2014 masalahnya data, bukan sinyal jual." },
          ],
        },
        {
          q: "Dividen Rp100, harga Rp1.000 ex-date. Adjust histori?",
          options: [
            { text: "Tidak usah", why: "Salah: harga ex-div turun ≈ dividen \u2014 return jadi diskontinu." },
            { text: "Kali 0,9 (turunkan histori)", why: "Tepat: faktor (1.000−100)/1.000 = 0,9 agar return kontinu.", correct: true },
            { text: "Kali 1,1", why: "Salah: arahnya turun, bukan naik \u2014 harga ex-div lebih rendah." },
            { text: "Hapus baris dividen", why: "Salah: menghapus data ≠ adjust \u2014 return tetap salah." },
          ],
        },
        {
          q: "XYZ +500% sehari. Ternyata reverse split 1:5. Return benar & pelajaran?",
          options: [
            { text: "+500% \u2014 breakout!", why: "Salah: itu ilusi data mentah \u2014 jebakan screener." },
            { text: "0% \u2014 adjusted; curiga dulu, kagum kemudian", why: "Tepat: 10.000×5 = 50.000 → 0%. Ritual 3 cek: lompatan? stale? CA?", correct: true },
            { text: "+400% \u2014 dikurangi split", why: "Salah: +400% = angka mentah; adjusted = 0%." },
            { text: "Tidak bisa dihitung", why: "Salah: bisa \u2014 kalikan harga lama dengan rasio reverse split." },
          ],
        },
        {
          q: "Saham Rp1.000 akan rights issue 1:1 @Rp800. Harga teoritis ex-rights (TERP)?",
          options: [
            { text: "Rp900", why: "Tepat: (1.000×1 + 800×1)/2 = Rp900. Jika harga tercatat “jatuh” ke Rp900 tanpa penjelasan, itu adjust — bukan rugi 10%.", correct: true },
            { text: "Rp1.000 — tidak berubah", why: "Salah: pemegang saham lama mendapat rights yang bernilai; harga ex-rights pasti menyesuaikan turun." },
            { text: "Rp800 — ikut harga tebus", why: "Salah: Rp800 hanya harga tebus saham BARU; harga teoritis = rata-rata tertimbang cum dan rights." },
            { text: "Rp1.800 — dijumlahkan", why: "Salah: menjumlah harga = menggandakan nilai; rights issue tidak menciptakan nilai, hanya menambah saham." },
          ],
        },
        {
          q: "Strategi “beli sebelum rights issue” cuan 8% di database adjusted sempurna, tetapi 1,2% dengan vintage data. Kesimpulan?",
          options: [
            { text: "Strategi tetap valid — 1,2% masih positif", why: "Salah: 1,2% tidak menutup biaya transaksi; dan 6,8 poin selisihnya adalah hindsight, bukan edge." },
            { text: "Lookahead via kalender corporate action — uji ulang dengan tanggal pengumuman", why: "Tepat: database adjusted sempurna memakai hindsight. Backtest jujur join sinyal pada tanggal pengumuman, bukan ex-date.", correct: true },
            { text: "Survivorship bias", why: "Salah: masalahnya waktu ketersediaan informasi, bukan universe saham yang hilang." },
            { text: "Naikkan leverage untuk mengembalikan 8%", why: "Salah: me-leverage artefak data = memperbesar kerugian atas sesuatu yang tidak pernah ada." },
          ],
        },
      ],
    },
  ],
};
