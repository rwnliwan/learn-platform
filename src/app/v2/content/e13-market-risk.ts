import type { V2Lesson } from "../lib/types";

export const e13: V2Lesson = {
  slug: "e13-market-risk",
  track: "Financial Markets",
  module: "Risiko Pasar",
  title: "E13. VaR, Expected Shortfall & Stress Test",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-var",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "“Rugi Rp5 miliar — normal?”",
      prose: [
        "Senin pagi, meja treasury bank melaporkan rugi Rp5 miliar dalam sehari. Direksi panik: “Siapa yang salah?!” Kepala risk management membuka laporan: “VaR 99% harian kita Rp6 miliar. Artinya rugi sampai Rp6 miliar diharapkan terjadi ~2–3 hari setahun. Hari ini bukan kegagalan — ini hari buruk yang normal.”",
        "Tanpa VaR, setiap rugi terasa seperti kesalahan. Dengan VaR, bank tahu berapa “cuaca buruk” yang sudah dianggarkan. Value at Risk pada tingkat kepercayaan 1−α = kerugian maksimum yang tidak akan terlampaui dengan probabilitas 1−α. “VaR 99% 1-hari = Rp6 M” artinya: 99% peluang rugi besok ≤ Rp6 M; 1% peluang rugi > Rp6 M. Bukan “rugi maksimal Rp6 M”!",
      ],
      formula: String.raw`P(\text{Loss} > VaR_{\alpha}) = \alpha \qquad VaR_{\alpha} = -(\mu - z_{\alpha} \cdot \sigma) \times \text{nilai}`,
      formulaNote: "α = toleransi (VaR 99% → α=1%); z = 1,645 (95%) atau 2,33 (99%); μ, σ = mean & vol return.",
      tasks: [
        { id: "t1", text: "Hitung `var_99` portofolio Rp100 M, vol harian 2% (parametrik)" },
        { id: "t2", text: "Hitung `var_10hari` dengan aturan akar-waktu (×√10)" },
      ],
      expected: "var_99=4660000000  var_10hari=14736213896",
      note: {
        title: "Sering salah",
        body: "“VaR 99% Rp6 M = rugi maksimal Rp6 M.” VaR justru menjamin kerugian di atas Rp6 M AKAN terjadi — ~2–3 hari setahun. VaR bukan sabuk pengaman; ia speedometer.",
      },
      hints: [
        "VaR 99% = 2,33 × σ × nilai portofolio (μ ≈ 0).",
        "var_10hari = var_99 × √10.",
        "Gunakan math.sqrt(10).",
      ],
      code: {
        starter: `import math\nnilai = 100_000_000_000  # Rp100 miliar\nvol_harian = 0.02\n\n# TULIS KODEMU: VaR 99% 1-hari dan 10-hari (parametrik)\nvar_99 = \nvar_10hari = \n\nprint(f"var_99={var_99:.0f}  var_10hari={var_10hari:.0f}")`,
        lockLines: 3,
        solution: `import math\nnilai = 100_000_000_000  # Rp100 miliar\nvol_harian = 0.02\n\n# TULIS KODEMU: VaR 99% 1-hari dan 10-hari (parametrik)\nvar_99 = 2.33 * vol_harian * nilai\nvar_10hari = var_99 * math.sqrt(10)\n\nprint(f"var_99={var_99:.0f}  var_10hari={var_10hari:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_99", value: 4660000000, tol: 1000000, label: "`var_99` = Rp4,66 M", msg: "2,33 × 0,02 × 100 miliar = Rp4,66 miliar." },
          { kind: "equal", task: "t2", name: "var_10hari", value: 14736213896, tol: 1000000, label: "`var_10hari` ≈ Rp14,74 M", msg: "4,66 × √10 = 14,74 miliar. Valid jika return independen — saat krisis asumsi ini jebol!" },
          { kind: "stdout_matches", task: "t2", pattern: "var_99=4660000000\\s+var_10hari=14736213896", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "VaR = ambang probabilitas, BUKAN rugi maksimal. Akar-waktu butuh asumsi i.i.d.",
    },
    {
      id: "tiga-metode",
      eyebrow: "Langkah 2 · Tiga metode VaR",
      title: "Satu portofolio, tiga jawaban",
      prose: [
        "Historical simulation: ambil N hari return historis, urutkan, ambil persentil ke-α. Pro: tanpa asumsi distribusi (menangkap ekor tebal asli). Kontra: buta terhadap kejadian yang belum pernah terjadi. Parametrik: asumsikan normal — cepat, mudah agregasi, tapi meremehkan ekor (return itu leptokurtik!).",
        "Monte Carlo: bangkitkan ribuan skenario dari model — paling fleksibel (opsi non-linear, korelasi!), tapi GIGO (garbage in, garbage out). Hitung VaR 95% dengan metode historis dan parametrik dari 1.000 hari return simulasi, plus Expected Shortfall historis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var_hist` (persentil 5% = kerugian)" },
        { id: "t2", text: "Hitung `var_param` (asumsi normal, z=1,645)" },
        { id: "t3", text: "Hitung `es` (rata-rata 5% terburuk)" },
      ],
      expected: "var_hist=6.22  var_param=6.28  es=7.85",
      note: {
        title: "Sering salah",
        body: "Mengira VaR parametrik “lebih ilmiah” sehingga pasti benar. Ia mengasumsikan return normal — asumsi yang persis runtuh di krisis. Speedometer yang dikalibrasi di jalan tol mulus, underestimate di jalan berlubang.",
      },
      hints: [
        "Urutkan return; persentil 5% dari 1000 data = indeks 50; VaR = −nilai itu.",
        "var_param = −(mean − 1,645×sd).",
        "es = −rata-rata 50 data terburuk.",
      ],
      code: {
        starter: `import math, random\nrandom.seed(42)\nrets = [random.gauss(0.5, 4.0) for _ in range(1000)]  # Rp jt, harian\nrs = sorted(rets)\nk = int(0.05 * len(rs))\n\n# TULIS KODEMU: VaR historis, parametrik, dan ES (Rp jt)\nvar_hist = \nmean = sum(rets) / len(rets)\nsd = math.sqrt(sum((x - mean) ** 2 for x in rets) / len(rets))\nvar_param = \nes = \n\nprint(f"var_hist={var_hist:.2f}  var_param={var_param:.2f}  es={es:.2f}")`,
        lockLines: 5,
        solution: `import math, random\nrandom.seed(42)\nrets = [random.gauss(0.5, 4.0) for _ in range(1000)]  # Rp jt, harian\nrs = sorted(rets)\nk = int(0.05 * len(rs))\n\n# TULIS KODEMU: VaR historis, parametrik, dan ES (Rp jt)\nvar_hist = -rs[k]\nmean = sum(rets) / len(rets)\nsd = math.sqrt(sum((x - mean) ** 2 for x in rets) / len(rets))\nvar_param = -(mean - 1.645 * sd)\nes = -sum(rs[:k]) / k\n\nprint(f"var_hist={var_hist:.2f}  var_param={var_param:.2f}  es={es:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_hist", value: 6.22, tol: 0.05, label: "`var_hist` sekitar 6,22", msg: "−return terburuk ke-50 dari 1000 data = Rp6,22 jt." },
          { kind: "equal", task: "t2", name: "var_param", value: 6.28, tol: 0.05, label: "`var_param` sekitar 6,28", msg: "−(0,5 − 1,645×sd) = Rp6,28 jt." },
          { kind: "equal", task: "t3", name: "es", value: 7.85, tol: 0.05, label: "`es` sekitar 7,85", msg: "Rata-rata 50 hari terburuk = Rp7,85 jt. ES selalu ≥ VaR — ia menjawab kedalaman ekor." },
          { kind: "stdout_matches", task: "t3", pattern: "var_hist=6\\.22\\s+var_param=6\\.28\\s+es=7\\.85", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Historical = data bicara. Parametrik = asumsi normal (waspadai ekor!). ES = E[Loss | Loss > VaR].",
    },
    {
      id: "es-backtest-stress",
      eyebrow: "Langkah 3 · Backtest & stress test",
      title: "Poligraf model dan simulasi kiamat",
      prose: [
        "Expected Shortfall = rata-rata kerugian saat VaR terlampaui — menjawab pertanyaan yang VaR diamkan (kedalaman ekor) dan koheren (subadditive). Inilah mengapa Basel/FRTB beralih dari VaR ke ES untuk modal risiko pasar.",
        "Backtesting = bandingkan prediksi VaR dengan realisasi: hitung pelanggaran dalam 250 hari. VaR 99% → ekspektasi ≈ 2–3. Zona Basel: hijau (0–4), kuning (5–9), merah (10+) = model ditolak. Stress test = skenario ekstrem (historis/hipotetis/reverse) — untuk kiamat yang tak tertangkap statistik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pelanggaran` dalam 250 hari (VaR 95%, batas −5)" },
        { id: "t2", text: "Tentukan `zona` (\"hijau\"/\"kuning\"/\"merah\", ambang 95%: 19/30)" },
      ],
      expected: "pelanggaran=15  zona=hijau",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model VaR yang tidak pernah di-backtest = ramalan dukun berjas. Analis market risk profesional hidup dalam tiga horizon: kemarin (backtest), besok (VaR/ES), kiamat (stress test).",
      },
      hints: [
        "Untuk tiap dari 250 hari: pnl = random.gauss(0.5, 3.2); hitung jika pnl < −5.",
        "Ekspektasi 95% = 12,5 pelanggaran. Zona: ≤19 hijau, ≤30 kuning, selebihnya merah.",
        "Gunakan random.seed(7) agar hasilnya reproduksibel.",
      ],
      code: {
        starter: `import random\nrandom.seed(7)\nvar_limit = -5.0  # klaim: rugi > Rp5 jt hanya 5% hari\n\n# TULIS KODEMU: hitung pelanggaran 250 hari dan zonanya\npelanggaran = \nzona = \n\nprint(f"pelanggaran={pelanggaran}  zona={zona}")`,
        lockLines: 3,
        solution: `import random\nrandom.seed(7)\nvar_limit = -5.0  # klaim: rugi > Rp5 jt hanya 5% hari\n\n# TULIS KODEMU: hitung pelanggaran 250 hari dan zonanya\npelanggaran = sum(1 for _ in range(250) if random.gauss(0.5, 3.2) < var_limit)\nzona = "hijau" if pelanggaran <= 19 else ("kuning" if pelanggaran <= 30 else "merah")\n\nprint(f"pelanggaran={pelanggaran}  zona={zona}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pelanggaran", value: 15, tol: 0, label: "`pelanggaran` = 15", msg: "Vol realita (3,2) > asumsi model — 15 pelanggaran vs ekspektasi 12,5." },
          { kind: "stdout_matches", task: "t2", pattern: "zona=hijau", label: "Zona = hijau", msg: "15 ≤ 19 = masih hijau untuk VaR 95% — tapi di atas ekspektasi. Pantau terus." },
        ],
      },
      reference: "Backtest = poligraf model. Traffic light tiap kuartal. Untuk kiamat: stress test.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang makna VaR dan keunggulan ES.",
      ],
      tasks: [],
      quiz: [
        {
          q: "“VaR 99% 1-hari = Rp6 M” artinya…",
          options: [
            { text: "Rugi maksimal Rp6 M", why: "Salah: VaR bukan langit-langit — 1% hari terburuk bisa jauh lebih dalam." },
            { text: "Ada 99% peluang rugi ≤ Rp6 M; 1% peluang rugi LEBIH dari Rp6 M (tanpa batas)", why: "Benar: VaR = ambang probabilitas. Kedalaman ekornya diukur ES.", correct: true },
            { text: "Pasti rugi Rp6 M besok", why: "Salah: VaR = kuantil distribusi, bukan ramalan titik." },
            { text: "Untung Rp6 M", why: "Salah: VaR bicara tentang kerugian." },
          ],
        },
        {
          q: "Keunggulan ES dibanding VaR?",
          options: [
            { text: "Lebih mudah dihitung", why: "Salah: ES butuh data ekor lebih banyak — justru lebih sulit." },
            { text: "Menjawab kedalaman ekor (rata-rata rugi saat VaR jebol) + koheren (subadditive)", why: "Benar: ES ≥ VaR dan subadditive. Standar modal Basel/FRTB kini memakai ES.", correct: true },
            { text: "Selalu lebih kecil dari VaR", why: "Salah: terbalik — ES selalu ≥ VaR." },
            { text: "Tidak butuh data", why: "Salah: ES butuh data yang sama (bahkan lebih). " },
          ],
        },
      ],
    },
    {
      id: "minicase-limit",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Limit treasury jebol 2 hari beruntun",
      prose: [
        "Desk treasury bank punya limit VaR 99% 1-hari Rp3 M. Senin rugi Rp2,5 M (dalam limit). Selasa rugi Rp4,2 M (pelanggaran). Rabu rugi Rp3,8 M (pelanggaran lagi). Kepala desk berdalih: “Kan 1% hari boleh jebol — ini cuma 2 hari dari 250, masih wajar!”",
        "Pertanyaan: (a) Apakah dalihnya benar secara statistik? (b) Apa yang seharusnya dilakukan risk management? (c) Metrik apa yang lebih menggambarkan bahaya situasi ini?",
        "Pembahasan: (a) Secara hitungan kasar ya (2/250 = 0,8% ≈ 1%) — TAPI pelanggaran berurutan = red flag clustering: model telat menangkap lonjakan volatilitas. Backtest yang baik menguji independensi juga, bukan cuma frekuensi. (b) Eskalasi + investigasi: cek apakah posisi membesar diam-diam, hitung ulang VaR dengan data terbaru, pertimbangkan pengurangan posisi paksa sampai model tervalidasi ulang. (c) ES (berapa rata-rata parahnya saat jebol?) + stress test intraday. VaR menjawab frekuensi — situasi ini butuh jawaban keparahan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Clustering pelanggaran = model tidak adaptif terhadap rezim volatilitas baru. Uji Christoffersen (independensi) sama pentingnya dengan hitungan frekuensi.",
      },
      reference: "Frekuensi wajar ≠ model sehat. Cek independensi pelanggaran juga.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Alat mana untuk situasi apa?",
      prose: [
        "Monitor harian meja trading → VaR 99% 1-hari + limit: VaR = bahasa umum trader dan risk; limit VaR = rem otomatis. Hitung modal dan laporkan ke regulator → ES (FRTB): koheren dan menangkap ekor — standar Basel terkini.",
        "Validasi model → backtesting (traffic light): satu-satunya cara objektif menangkap model yang meremehkan risiko. Rapat direksi / krisis → stress test (bukan VaR!): direksi berpikir skenario, bukan persentil.",
        "Aturan 10 detik: VaR = ambang, bukan langit-langit. Selalu pasangkan dengan ES. Model tanpa backtest = dukun berjas. Untuk kiamat, pakai stress test.",
      ],
      note: {
        title: "Intuisi: VaR menjawab “seberapa sering”, bukan “seberapa parah”",
        body: "VaR 99% Rp5 miliar artinya: 1 hari dari 100, kerugian melebihi Rp5 miliar — dan ia bungkam soal seberapa dalam jurangnya: Rp6 miliar atau Rp60 miliar, VaR tidak peduli. Empat heuristik. Pertama: VaR = ambang, ES = rata-rata di balik ambang — Expected Shortfall menjawab “kalau jebol, rata-rata seberapa parah?”; untuk ekor, ES selalu lebih jujur; itulah kenapa standar global beralih ke ES. Kedua: model risiko = peta, bukan wilayah — VaR historis mengasumsikan masa depan mirip masa lalu; 2008 tidak ada di data 2005; rezim berubah, peta kedaluwarsa. Ketiga: backtest adalah poligraf model — 99% VaR yang jebol 5 kali dari 100 hari = model berbohong; jadwalkan uji berkala, bukan saat krisis. Keempat: stress test = bertanya “bagaimana jika” — bagaimana jika rupiah −20% + SBN +200bps + IHSG −30% bersamaan? Tidak ada probabilitasnya, tetapi ada rencananya; yang tidak direncanakan = yang membunuh. Aturan 10 detiknya: laporkan VaR selalu berpasangan dengan ES dan satu skenario stress — angka tunggal = ketenangan palsu.",
      },
      tasks: [],
      reference: "Operasional = VaR. Modal = ES. Validasi = backtest. Kiamat = stress test.",
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
        "VaR α: P(Loss > VaR) = α — ambang probabilitas, BUKAN rugi maksimal.",
        "Tiga metode: historical (data bicara), parametrik (asumsi normal — waspadai ekor!), Monte Carlo (fleksibel, GIGO).",
        "ES = E[Loss | Loss > VaR] — kedalaman ekor + koheren; standar modal FRTB.",
        "Backtest = poligraf model; traffic light hijau/kuning/merah; uji independensi juga.",
        "Stress test (historis/hipotetis/reverse) — untuk kiamat yang tak tertangkap statistik.",
      ],
      next: { label: "E14 — Pasar Uang", href: "/v2/learn/e14-money-market" },
      quiz: [
        {
          q: "Backtest 250 hari (VaR 99%): 12 pelanggaran. Zona?",
          options: [
            { text: "Hijau", why: "Salah: hijau = 0–4 pelanggaran." },
            { text: "Kuning", why: "Salah: kuning = 5–9 pelanggaran." },
            { text: "Merah — model ditolak, kalibrasi ulang", why: "Benar: 10+ = merah. Model meremehkan risiko sistematis.", correct: true },
            { text: "Tidak bisa dinilai", why: "Salah: traffic light Basel justru untuk ini." },
          ],
        },
        {
          q: "Pelanggaran VaR terjadi 3 hari BERTURUT-TURUT. Masalahnya?",
          options: [
            { text: "Tidak masalah — frekuensi masih wajar", why: "Salah: frekuensi wajar ≠ independensi wajar." },
            { text: "Clustering: model telat menangkap rezim volatilitas baru — uji independensi juga penting", why: "Benar: backtest yang baik menguji frekuensi DAN independensi.", correct: true },
            { text: "VaR salah hitung", why: "Salah: hitungannya bisa benar tapi modelnya tidak adaptif." },
            { text: "Trader curang", why: "Salah: jangan tuduh orang sebelum memeriksa model." },
          ],
        },
        {
          q: "Kapan stress test WAJIB dipakai (bukan VaR)?",
          options: [
            { text: "Monitor harian", why: "Salah: itu ranah VaR." },
            { text: "Menjawab “bagaimana jika krisis?” untuk direksi/regulator — VaR buta di luar data historis", why: "Benar: stress test = simulasi kiamat (historis/hipotetis/reverse).", correct: true },
            { text: "Tidak pernah", why: "Salah: regulator justru mewajibkannya." },
            { text: "Hanya untuk kredit", why: "Salah: stress test dipakai untuk pasar, likuiditas, dan modal." },
          ],
        },
        {
          q: "Aturan akar-waktu (VaR₁₀ ≈ VaR₁ × √10) valid jika…",
          options: [
            { text: "Selalu valid", why: "Salah: butuh asumsi return i.i.d." },
            { text: "Return i.i.d. (independen & identik) — waspadai autokorelasi & volatilitas berklaster", why: "Benar: return nyata berklaster — scaling buta bisa meremehkan risiko.", correct: true },
            { text: "Hanya untuk saham", why: "Salah: soalnya asumsi statistik, bukan jenis aset." },
            { text: "Hanya untuk 10 hari", why: "Salah: aturan umumnya VaR_T ≈ VaR₁ × √T." },
          ],
        },
      ],
    },
  ],
};
