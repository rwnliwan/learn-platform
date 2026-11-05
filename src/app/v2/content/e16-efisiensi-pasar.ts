import type { V2Lesson } from "../lib/types";

export const e16: V2Lesson = {
  slug: "e16-efisiensi-pasar",
  track: "Financial Markets",
  module: "Teori Pasar",
  title: "E16. Pasar Efisien, Bias & Backtest",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-monyet",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Monyet vs fund manager",
      prose: [
        "Tahun 1973, ekonom Burton Malkiel menulis: “Monyet yang melempar dart ke halaman koran saham akan mengalahkan mayoritas manajer investasi.” Setengah abad kemudian datanya mendukungnya: ~90% reksa dana saham aktif AS kalah dari indeks dalam 15 tahun (setelah fee). Apakah pasar terlalu efisien untuk dikalahkan? Atau manusia terlalu bias untuk menang? Jawabannya: keduanya.",
        "Hipotesis Pasar Efisien (EMH): harga mencerminkan semua informasi yang tersedia. Tiga bentuk: lemah (harga mencerminkan data historis → teknikal tidak berguna), semi-kuat (+ semua info publik → fundamental tidak memberi keunggulan sistematis), kuat (+ info privat → terbukti salah: insider trading memang menguntungkan, makanya ilegal!).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Makin efisien pasar (saham US large-cap), makin sulit dikalahkan → pakai indeks murah. Makin tidak efisien (saham kecil Indonesia), makin besar peluang — tapi juga makin besar biaya riset dan jebakannya.",
      },
      reference: "EMH: lemah (teknikal mati) → semi-kuat (fundamental sulit) → kuat (terbukti salah).",
    },
    {
      id: "behavioral",
      eyebrow: "Langkah 2 · Behavioral finance",
      title: "Musuh terbesarmu = otakmu sendiri",
      prose: [
        "Behavioral finance (Kahneman & Tversky, Nobel 2002): manusia menilai perubahan (untung/rugi), bukan kekayaan total — dan rugi Rp1 terasa ~2× lebih menyakitkan dari nikmatnya untung Rp1 (loss aversion). Eksperimen klasik: 82% memilih kepastian Rp10 jt dibanding 50% peluang Rp25 jt (ekspektasi Rp12,5 jt!) — menolak taruhan dengan ekspektasi lebih tinggi. Tapi saat rugi, mayoritas justru nekat berjudi.",
        "Empat bias paling mematikan: overconfidence (merasa bisa prediksi → overtrading; obat: catat dan skor prediksimu), loss aversion (take profit cepat, biarkan rugi membesar; obat: aturan cut-loss tertulis), herding (beli karena viral/FOMO; obat: checklist fundamental), anchoring (terpaku harga beli; obat: evaluasi zero-based).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ev_a` (pasti Rp10 jt) dan `ev_b` (50% × Rp25 jt)" },
        { id: "t2", text: "Tentukan `rasional` (\"a\" atau \"b\" — yang EV-nya lebih besar)" },
      ],
      expected: "ev_a=10000000  ev_b=12500000  rasional=b",
      note: {
        title: "Sering salah",
        body: "“Aku sudah tahu bias-bias ini, jadi aku kebal.” Tidak — bias adalah autopilot evolusioner; pengetahuan tidak menghapusnya. Yang bekerja = aturan tertulis yang dibuat saat tenang.",
      },
      hints: [
        "EV = jumlah (peluang × hasil).",
        "ev_a = 1,0 × 10 jt. ev_b = 0,5 × 25 jt + 0,5 × 0.",
        "rasional = \"b\" jika ev_b > ev_a",
      ],
      code: {
        starter: `# Skenario untung: a = pasti Rp10 jt; b = 50% Rp25 jt, 50% Rp0\nev_a = \nev_b = \nrasional = \n\nprint(f"ev_a={ev_a:.0f}  ev_b={ev_b:.0f}  rasional={rasional}")`,
        lockLines: 1,
        solution: `# Skenario untung: a = pasti Rp10 jt; b = 50% Rp25 jt, 50% Rp0\nev_a = 1.0 * 10_000_000\nev_b = 0.5 * 25_000_000 + 0.5 * 0\nrasional = "b" if ev_b > ev_a else "a"\n\nprint(f"ev_a={ev_a:.0f}  ev_b={ev_b:.0f}  rasional={rasional}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ev_a", value: 10000000, tol: 1, label: "`ev_a` = Rp10 jt", msg: "Kepastian Rp10 jt = EV Rp10 jt." },
          { kind: "equal", task: "t1", name: "ev_b", value: 12500000, tol: 1, label: "`ev_b` = Rp12,5 jt", msg: "0,5 × 25 jt = 12,5 jt > 10 jt — tapi 82% manusia memilih a!" },
          { kind: "stdout_matches", task: "t2", pattern: "rasional=b", label: "Pilihan rasional = b", msg: "Rasional = EV lebih besar. Manusia takut risiko saat untung — itulah loss aversion." },
        ],
      },
      reference: "Loss aversion: rugi Rp1 ≈ 2× sakitnya untung Rp1. Obat = aturan tertulis.",
    },
    {
      id: "microstructure-backtest",
      eyebrow: "Langkah 3 · Microstructure & jebakan backtest",
      title: "Biaya yang memakan strategi kertas",
      prose: [
        "Market microstructure: spread = kompensasi market maker atas risiko inventory dan adverse selection (takut bertransaksi dengan yang lebih tahu!). Market impact = harga bergerak karena ordermu. Likuiditas semu: order book terlihat tebal tapi menghilang saat dibutuhkan — jangan percaya kedalaman layar saat panik.",
        "Lima dosa backtest: look-ahead bias (pakai info masa depan; obat: point-in-time data), survivorship bias (hanya saham yang masih hidup; obat: database termasuk delisting), overfitting (20 parameter di-tune pas masa lalu; obat: sedikit parameter + out-of-sample), biaya diabaikan (obat: kurangi 0,5–1% per round-trip), data snooping (uji ribuan strategi, pamerkan 1 yang terbaik).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Backtest-ku sempurna 3 tahun!” Backtest sempurna = curigai. Minta out-of-sample + potong biaya konservatif + forward-test di data yang belum tersentuh.",
      },
      reference: "Strategi kertas − spread − fee − slippage − pajak = strategi sungguhan.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang EMH dan bias.",
      ],
      tasks: [],
      quiz: [
        {
          q: "EMH bentuk semi-kuat mengklaim…",
          options: [
            { text: "Analisis teknikal pasti berhasil", why: "Salah: itu justru yang dibunuh EMH bentuk LEMAH." },
            { text: "Semua info PUBLIK sudah tercermin di harga — analisis fundamental tidak memberi keunggulan sistematis", why: "Benar: semi-kuat = historis + publik.", correct: true },
            { text: "Insider tidak bisa untung", why: "Salah: itu bentuk KUAT — dan terbukti salah." },
            { text: "Pasar tidak pernah crash", why: "Salah: EMH tidak mengklaim pasar tidak pernah crash." },
          ],
        },
        {
          q: "Investor cepat take profit tapi membiarkan rugi membesar. Bias apa?",
          options: [
            { text: "Overconfidence", why: "Salah: overconfidence = merasa bisa prediksi → overtrading." },
            { text: "Loss aversion — takut risiko saat untung, nekat saat rugi", why: "Benar: rugi Rp1 terasa ~2× lebih sakit — makanya “tunggu balik”.", correct: true },
            { text: "Herding", why: "Salah: herding = ikut keramaian/FOMO." },
            { text: "Anchoring", why: "Salah: anchoring = terpaku harga beli." },
          ],
        },
      ],
    },
    {
      id: "lab-snooping",
      eyebrow: "Langkah 5 · Lab: data snooping",
      title: "1.000 strategi acak, 31 terlihat “hebat”",
      prose: [
        "Dengan cukup banyak percobaan, data acak murni pun menghasilkan “strategi hebat”. Peluang satu strategi acak terlihat bagus (misal “untung 5 tahun beruntun” murni kebetulan) = (1/2)⁵ = 3,125%. Dari 1.000 strategi yang dicoba: 1.000 × 3,125% ≈ 31 akan terlihat “hebat” — padahal semuanya acak.",
        "Inilah cara kerja backtest palsu: uji ribuan variasi, tampilkan 1 yang terbaik, sembunyikan 999 yang gagal. Rumus skeptis: kepercayaan ∝ (out-of-sample profit) / (jumlah strategi yang dicoba × kompleksitas).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_5` (peluang 5 tahun untung beruntun murni kebetulan)" },
        { id: "t2", text: "Hitung `ekspektasi` (“pemenang” palsu dari 1.000 strategi)" },
      ],
      expected: "p_5=0.03125  ekspektasi=31.25",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu strategi sederhana yang untung moderat di 3 periode berbeda > 1 strategi 20-parameter yang “sempurna” di 1 periode. Kesederhanaan = robustness.",
      },
      hints: [
        "Peluang 5 kejadian independen @50% = 0,5^5.",
        "ekspektasi = 1000 × p_5.",
        "p_5 = 0.5 ** 5",
      ],
      code: {
        starter: `# TULIS KODEMU: peluang & ekspektasi “pemenang” palsu\np_5 = \nekspektasi = \n\nprint(f"p_5={p_5:.5f}  ekspektasi={ekspektasi:.2f}")`,
        lockLines: 1,
        solution: `# TULIS KODEMU: peluang & ekspektasi “pemenang” palsu\np_5 = 0.5 ** 5\nekspektasi = 1000 * p_5\n\nprint(f"p_5={p_5:.5f}  ekspektasi={ekspektasi:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_5", value: 0.03125, tol: 1e-9, label: "`p_5` = 0,03125", msg: "(1/2)^5 = 3,125%." },
          { kind: "equal", task: "t2", name: "ekspektasi", value: 31.25, tol: 0.01, label: "`ekspektasi` = 31,25", msg: "Dari 1000 strategi acak, ~31 terlihat “hebat” murni kebetulan. Solusi: out-of-sample!" },
          { kind: "stdout_matches", task: "t2", pattern: "p_5=0\\.03125\\s+ekspektasi=31\\.25", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Makin banyak dicoba, makin besar peluang temuan palsu. Wajib uji out-of-sample.",
    },
    {
      id: "minicase-bot",
      eyebrow: "Langkah 6 · Mini-case",
      title: "“AI trading bot” Rp15 juta: tolak atau ambil?",
      prose: [
        "Sebuah grup Telegram menjual “AI trading bot” Rp15 juta: backtest 3 tahun menunjukkan return +212%, win rate 78%, max drawdown cuma 4%. Testimoni memukau. Kamu tertarik.",
        "Pertanyaan: (a) Terapkan 5 dosa backtest — apa yang harus kamu tanyakan? (b) Tanda bahaya apa yang sudah terlihat dari angkanya? (c) Keputusanmu?",
        "Pembahasan: (a) Look-ahead? (data point-in-time?) Survivorship? (saham delisting ikut?) Overfitting? (berapa parameter?) Biaya? (spread+fee+slippage masuk?) Snooping? (berapa strategi dicoba sebelum yang ini dipamerkan?) — penjual yang menolak menjawab = jawaban. (b) Win rate 78% + MaxDD 4% + return 212% = kombinasi yang hampir mustahil tanpa tail risk tersembunyi (profil “jual asuransi”!). Atau murni overfit. Either way: curigai. (c) Tolak / minta forward-test live 6 bulan dengan akun terverifikasi pihak ketiga. Uang Rp15 juta lebih baik untuk ETF indeks.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Prinsip 2L — tidak logis + tidak transparan = jangan. Return fantastis + win rate tinggi + drawdown kecil = segitiga mustahil tanpa ekor tersembunyi.",
      },
      reference: "Backtest indah + penjual menolak 5 pertanyaan = jawaban.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Bertahan dari dirimu sendiri: empat skenario",
      prose: [
        "Godaan trading harian/sinyal viral → hitung dulu ekspektasi biayanya: spread + fee + pajak + overconfidence = ekspektasi negatif untuk mayoritas ritel. Portofolio merah dan ingin “tunggu balik modal” → evaluasi zero-based: “apakah aku akan BELI saham ini hari ini di harga sekarang?” Jika tidak → jual.",
        "Menemukan “strategi hebat” → siksa dengan 5 dosa backtest, lalu forward-test. Pasar efisien dan kamu sibuk → indeks murah + rebalance berkala: mengakui keterbatasan = strategi rasional.",
        "Aturan 10 detik: aturan tertulis sebelum emosi. Backtest sempurna = curigai. Harga belimu tidak penting — keputusan dari harga kini dan prospek.",
      ],
      tasks: [],
      reference: "Cut-loss, alokasi, review — tulis saat tenang. Minta out-of-sample + potong biaya.",
    },
    {
      id: "efisiensi-lanjut",
      eyebrow: "Langkah 8 · Pendalaman: batas arbitrase",
      title: "Batas arbitrase: kenapa harga yang salah bisa awet",
      prose: [
        "Pasar yang efisien tidak berarti harga selalu benar — melainkan harga yang salah sulit dieksploitasi. Anomali bertebaran di data: momentum (saham pemenang 6 bulan lanjut menang — Jegadeesh & Titman), value, size, January effect. Sebagian adalah premi risiko yang belum dipahami; sebagian adalah kesalahan perilaku yang nyata: overconfidence, disposition effect (menjual pemenang terlalu cepat, memelihara pecundang), herding.",
        "Kenapa “uang gratis” tidak langsung diserbu? Shleifer & Vishny: limits to arbitrage. Pertama, noise trader risk — harga bisa makin salah SEBELUM menjadi benar, dan arbitraser kehabisan modal duluan (“pasar bisa lebih lama irasional daripada kamu bisa tetap solven” — Keynes). Kedua, fundamental risk — berita mengubah “nilai benarnya”. Ketiga, biaya implementasi: di IDX, short selling praktis tidak tersedia untuk ritel — mispricing ke ATAS tidak bisa diarbitrase jual-kosong; kamu hanya bisa tidak membeli.",
        "Musuh yang lebih licin: data snooping. Uji 20 strategi acak pada data yang sama — yang terbaik bisa mencatat Sharpe 1,92 (coba lab di bawah) padahal semuanya noise murni. Inilah kenapa anomali butuh dua hal: out-of-sample (berlaku di data yang belum dilihat) DAN cerita ekonomi yang masuk akal. Pola tanpa logika = kebetulan yang menunggu malu.",
        "Aturan praktis: (1) temukan anomali → tanya dulu “ini premi risiko atau kesalahan?”; (2) butuh p-value DAN cerita — statistik tanpa ekonomi = numerology; (3) kurangi return teoritis dengan biaya transaksi Indonesia (fee + spread + pajak) — banyak “anomali” mati di sini; (4) anomali yang dipublikasikan cenderung melemah setelahnya.",
      ],
      tasks: [
        { id: "t1", text: "Jalankan 20 strategi acak (sudah disediakan)" },
        { id: "t2", text: "Hitung `sharpe_max` — seberapa “hebat” noise terbaik?" },
      ],
      expected: "n_strat=20  sharpe_max=1.92",
      hints: [
        "sharpe_max = max(sharpes) — tidak perlu loop lagi.",
        "Renungkan: semuanya noise, tetapi yang terbaik Sharpe 1,92.",
      ],
      code: {
        starter: `import random\nrandom.seed(42)\n\nn_strat = 20\nbulan = 60\nsharpes = []\nfor s in range(n_strat):\n    rets = [random.gauss(0, 0.05) for _ in range(bulan)]  # murni noise\n    mean = sum(rets) / bulan\n    var = sum((r - mean) ** 2 for r in rets) / bulan\n    sd = var ** 0.5\n    sharpes.append(mean / sd * (bulan ** 0.5))\n\n# TULIS KODEMU: sharpe tertinggi dari 20 strategi acak\nsharpe_max = \n\nprint(f"n_strat={n_strat}  sharpe_max={sharpe_max:.2f}")`,
        lockLines: 13,
        solution: `import random\nrandom.seed(42)\n\nn_strat = 20\nbulan = 60\nsharpes = []\nfor s in range(n_strat):\n    rets = [random.gauss(0, 0.05) for _ in range(bulan)]  # murni noise\n    mean = sum(rets) / bulan\n    var = sum((r - mean) ** 2 for r in rets) / bulan\n    sd = var ** 0.5\n    sharpes.append(mean / sd * (bulan ** 0.5))\n\n# TULIS KODEMU: sharpe tertinggi dari 20 strategi acak\nsharpe_max = max(sharpes)\n\nprint(f"n_strat={n_strat}  sharpe_max={sharpe_max:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_strat", value: 20, tol: 1e-9, label: "`n_strat` = 20", msg: "Dua puluh strategi, semuanya acak murni." },
          { kind: "equal", task: "t2", name: "sharpe_max", value: 1.9237, tol: 0.02, label: "`sharpe_max` sekitar 1,92", msg: "Noise murni bisa “berprestasi” Sharpe 1,92 — itulah data snooping." },
          { kind: "stdout_matches", task: "t2", pattern: "n_strat=20\\s+sharpe_max=1\\.92", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: efisien = sulit dikalahkan, bukan selalu benar",
        body: "“Pasar efisien” bukan klaim harga selalu benar — ia klaim bahwa kesalahan harga sulit diubah jadi uang setelah biaya dan risiko. Empat heuristik. Pertama: tahu harga salah ≠ bisa untung — butuh modal untuk menahan posisi saat harga makin salah, instrumen untuk short, dan perut untuk menunggu; ketiganya mahal, dan di IDX short selling praktis tidak ada untuk ritel. Kedua: anomali = pola + cerita + out-of-sample — tanpa ketiganya, itu data snooping; lab di atas membuktikan noise murni bisa “berprestasi” Sharpe 1,92; p-value tanpa logika ekonomi = numerology. Ketiga: biaya adalah kuburan anomali — strategi yang menang 3% di kertas dengan turnover 400%/tahun mati oleh fee, spread, dan pajak Indonesia; kurangi dulu, kagum kemudian. Keempat: anomali yang dipublikasikan cenderung melemah — setelah semua orang tahu, arbitrase (yang bisa) menggerogotinya; edge yang diumumkan = edge yang kedaluwarsa. Aturan 10 detiknya: sebelum kagum pada backtest, tanya tiga hal — “datanya out-of-sample?”, “cerita ekonominya apa?”, “setelah biaya masih hidup?”.",
      },
      reference: "Tahu salah ≠ bisa untung. Anomali butuh out-of-sample + logika + biaya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "EMH: lemah (teknikal mati) → semi-kuat (fundamental sulit) → kuat (terbukti salah). Pasar cukup efisien.",
        "Empat bias mematikan: overconfidence, loss aversion, herding, anchoring. Obat = aturan tertulis.",
        "Microstructure: spread + market impact + likuiditas semu = biaya nyata yang memakan strategi kertas.",
        "Lima dosa backtest: look-ahead, survivorship, overfitting, biaya diabaikan, data snooping.",
        "Musuh terbesarmu bukan pasar — otakmu sendiri.",
      ],
      next: { label: "E17 — Makro & Siklus", href: "/learn/e17-makro-siklus" },
      quiz: [
        {
          q: "Saham turun 40% dari harga belimu. Respons bebas anchoring?",
          options: [
            { text: "“Tunggu balik modal dulu”", why: "Salah: itu anchoring — harga beli = sunk cost." },
            { text: "Evaluasi zero-based: apakah akan BELI di harga sekarang? Jika tidak, jual — harga beli = sunk cost", why: "Benar: keputusan dari harga kini + prospek + opportunity cost.", correct: true },
            { text: "Beli lagi agar rata-rata turun", why: "Salah: averaging down tanpa tesis fundamental = memperbesar taruhan kalah." },
            { text: "Lupakan saja", why: "Salah: mengabaikan ≠ mengelola." },
          ],
        },
        {
          q: "Backtest hanya memakai saham yang masih tercatat hari ini. Dosanya?",
          options: [
            { text: "Look-ahead bias", why: "Salah: look-ahead = memakai info masa depan." },
            { text: "Survivorship bias — yang bangkrut hilang dari data, return terlihat lebih indah", why: "Benar: database jujur mencakup saham delisting/bangkrut.", correct: true },
            { text: "Overfitting", why: "Salah: overfitting = terlalu banyak parameter di-tune." },
            { text: "Tidak ada masalah", why: "Salah: ini dosa klasik backtest." },
          ],
        },
        {
          q: "Dari 1.000 strategi yang dicoba, 1 terlihat hebat di backtest. Ini…",
          options: [
            { text: "Bukti strategi hebat", why: "Salah: dari 1000 acak, ~31 terlihat hebat murni kebetulan." },
            { text: "Data snooping — kebetulan statistik dari multiple testing; wajib uji out-of-sample", why: "Benar: makin banyak dicoba, makin besar peluang temuan palsu.", correct: true },
            { text: "Overfitting", why: "Salah: ini soal multiple testing, bukan parameter tuning (meski sering bersamaan)." },
            { text: "Look-ahead bias", why: "Salah: tidak ada info masa depan di sini." },
          ],
        },
        {
          q: "Backtest strategi frekuensi tinggi untung 30%/tahun TANPA memasukkan spread & fee. Masalahnya?",
          options: [
            { text: "Tidak masalah — biaya kecil", why: "Salah: di frekuensi tinggi, biaya microstructure bisa menghapus seluruh keuntungan." },
            { text: "Biaya microstructure (spread + fee + slippage + pajak) bisa menghapus seluruh “keuntungan” — wajib dimasukkan konservatif", why: "Benar: kurangi 0,5–1% per round-trip; jika masih untung, lanjutkan ke forward-test.", correct: true },
            { text: "Strategi pasti tetap untung", why: "Salah: tidak ada yang pasti sebelum biaya dihitung." },
            { text: "Fee tidak ada di Indonesia", why: "Salah: fee broker + pajak 0,1% per transaksi jelas ada." },
          ],
        },
      ],
    },
  ],
};
