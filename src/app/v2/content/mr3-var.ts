import type { V2Lesson } from "../lib/types";

export const mr3: V2Lesson = {
  slug: "mr3-var",
  track: "Market Risk",
  module: "VaR & Backtesting",
  title: "MR3 — Value at Risk: Tiga Cara Mengukur Kerugian Terburuk yang Wajar",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-direksi",
      eyebrow: "Langkah 1 · Definisi VaR",
      title: "Cerita: angka yang menidurkan direksi",
      prose: [
        "2007. Sebuah bank investasi melaporkan ke direksi: VaR 99% harian kami $50 juta. Direksi tenang — pada 99 hari dari 100, kerugian tidak melebihi $50 juta. Angka itu kecil dibanding modal $10 miliar. Rapat selesai dalam 20 menit. Setahun kemudian bank itu kolaps dengan kerugian miliaran dolar dalam hitungan minggu.",
        "Yang salah bukan hitungannya — VaR-nya benar secara matematis. Yang salah adalah cara angka itu dibaca: direksi mengira VaR = kerugian maksimal. Padahal VaR diam tentang satu pertanyaan paling penting: pada 1 hari dari 100 itu — saat VaR terlampaui — seberapa dalam jurangnya? VaR mereka pun dihitung dari data masa tenang, dan korelasi antar aset melonjak saat krisis.",
        "Definisi: Value at Risk pada tingkat kepercayaan α dan horizon T adalah ambang kerugian yang hanya terlampaui dengan probabilitas 1−α. Versi bersahabat: VaR_99% = −kuantil_1%(P&L). Cara baca yang benar: VaR 99%/1-hari = Rp470 juta artinya ada 99% peluang kerugian besok ≤ Rp470 juta — dan 1% peluang kerugian lebih besar dari itu, entah seberapa besar. Tanda negatif: VaR dilaporkan sebagai angka positif = besarnya kerugian ambang.",
      ],
      formula: String.raw`\text{VaR}_{99\%} = -\text{kuantil}_{1\%}(\text{P\&L})`,
      formulaNote: "VaR_99% = ambang kerugian 99%; kuantil_1%(P&L) = titik yang hanya dilampaui 1% skenario terburuk; tanda minus karena kuantil P&L-nya negatif (kerugian) — VaR dilaporkan sebagai angka positif.",
      tasks: [
        { id: "t1", text: "Tuliskan cara baca yang benar untuk: VaR 95%/10-hari = Rp2 miliar." },
        { id: "t2", text: "Sebutkan dua hal yang TIDAK dikatakan VaR." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira VaR = kerugian maksimal. VaR adalah ambang yang terlampaui 1% dari waktu — bukan batas atas. Kerugian bisa (dan pernah, berkali-kali dalam sejarah) jauh melampaui VaR. Analis yang melaporkan VaR tanpa menyebut ekspektasi kerugian saat terlampaui (ES) baru menyampaikan setengah cerita.",
        type: "pitfall",
      },
      reference: "VaR = kuantil kerugian. Selalu sebut: kepercayaan, horizon, metode.",
    },
    {
      id: "historical",
      eyebrow: "Langkah 2 · Historical simulation",
      title: "Metode 1: biarkan masa lalu berbicara",
      prose: [
        "Historical Simulation (HS) mengambil N hari return historis, menerapkannya ke portofolio saat ini — seolah tiap skenario historis terjadi besok — lalu mengambil kuantilnya. Tidak ada asumsi bentuk distribusi: non-parametrik, menangkap fat tail dan skew asli data.",
        "Kepribadiannya seperti sejarawan yang jujur tetapi buta masa depan: tidak mengasumsikan apa pun, tetapi tidak bisa membayangkan apa yang belum pernah terjadi. Krisis yang belum ada di jendela data = tidak ada di VaR. Kelemahan lain: butuh 250+ hari data, sensitif ke pilihan jendela (ghost effect — hari krisis yang keluar dari jendela membuat VaR anjlok tiba-tiba), dan tidak bisa untuk instrumen baru tanpa histori.",
        "Coba mekaniknya dengan tangan. 20 P&L harian (Rp juta, sudah diurutkan): −60, −25, −18, −12, −9, −7, −5, −3, −1, 0, 2, 4, 6, 8, 10, 12, 15, 20, 25, 30. VaR 95% berarti 5% × 20 = 1 observasi boleh lebih buruk → observasi terburuk ke-1 = −60. VaR 90% berarti 2 observasi boleh lebih buruk → −25. Konvensi yang dipakai lesson ini: nearest-rank — kuantil 5% dari 20 data = data ke-1 dari yang terkecil; konvensi lain (interpolasi) bisa menggeser satu observasi. Selalu sebut konvensimu — E13 memakai nearest-rank yang sama (data ke-50 dari 1000, indeks 49).",
      ],
      formula: String.raw`\text{VaR}^{HS}_{99\%} = -\text{kuantil}_{1\%}\{V_0 \cdot r_1, \dots, V_0 \cdot r_N\}`,
      formulaNote: "VaR^HS = VaR via Historical Simulation; V_0 = nilai portofolio kini; r_i = return historis hari ke-i — tiap skenario masa lalu diterapkan ke portofolio kini, lalu diambil kuantilnya.",
      tasks: [
        { id: "t1", text: "Urutkan `pnl` lalu ambil `var95` (terburuk ke-1) dan `var90` (terburuk ke-2) sebagai angka positif" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "var95=60  var90=25",
      note: {
        title: "Sering salah",
        body: "Mengambil kuantil dari sisi yang salah (keuntungan terbesar, bukan kerugian terbesar). VaR dihitung dari ekor kerugian — urutkan dari yang paling negatif, atau ambil dari ujung kiri distribusi.",
        type: "pitfall",
      },
      hints: [
        "Urutkan dari terkecil: s = sorted(pnl). s[0] = yang terburuk.",
        "var95 = -s[0] (jadikan positif), var90 = -s[1].",
        "Dengan 20 observasi, 5% = 1 observasi boleh lebih buruk — tidak perlu interpolasi di sini.",
      ],
      code: {
        starter: `# 20 P&L harian (Rp juta)\npnl = [-60,-25,-18,-12,-9,-7,-5,-3,-1,0,2,4,6,8,10,12,15,20,25,30]\n\n# TULIS KODEMU: VaR 95% dan VaR 90% (historical), sebagai angka positif\nvar95 = \nvar90 = \n\nprint(f"var95={var95}  var90={var90}")`,
        lockLines: 2,
        solution: `# 20 P&L harian (Rp juta)\npnl = [-60,-25,-18,-12,-9,-7,-5,-3,-1,0,2,4,6,8,10,12,15,20,25,30]\n\n# TULIS KODEMU: VaR 95% dan VaR 90% (historical), sebagai angka positif\ns = sorted(pnl)\nvar95 = -s[0]\nvar90 = -s[1]\n\nprint(f"var95={var95}  var90={var90}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95", value: 60, tol: 1e-9, label: "`var95` seharusnya 60", msg: "5% × 20 = 1 observasi boleh lebih buruk → ambil yang terburuk, jadikan positif." },
          { kind: "equal", task: "t1", name: "var90", value: 25, tol: 1e-9, label: "`var90` seharusnya 25", msg: "10% × 20 = 2 observasi boleh lebih buruk → ambil terburuk ke-2." },
          { kind: "stdout_matches", task: "t2", pattern: "var95=60\\s+var90=25", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "HS: kuantil dari skenario historis × portofolio kini. Buta terhadap yang belum terjadi.",
    },
    {
      id: "parametrik",
      eyebrow: "Langkah 3 · Parametrik & scaling",
      title: "Metode 2: asumsi normal, hitungan kilat",
      prose: [
        "Metode parametrik mengasumsikan return berdistribusi normal dengan volatilitas σ, lalu VaR tinggal mengalikan: VaR_99% = 2,33 × σ × V_0. Untuk portofolio multi-aset: 2,33 × √(w^T Σ w) × V_0. Hitungan instan, agregasi elegan — tetapi buta terhadap fat tail. Return pasar nyata berekor lebih tebal dari normal, sehingga VaR parametrik sistematis meremehkan kejadian ekstrem.",
        "Contoh: portofolio Rp200 juta, volatilitas harian σ = 1,2% (diestimasi dari model volatilitas adaptif — rata-rata bergerak dengan bobot eksponensial untuk data terbaru). VaR = 2,33 × 0,012 × Rp200 jt = Rp5.592.000. Tiga langkah, selesai — tetapi wajib tanya: apakah return aset ini benar-benar normal? Kalau kurtosis berlebih > 0 (kurtosis > 3), angka ini CENDERUNG underestimate ekor — tetapi tidak selalu: arah dan besarnya tergantung skew dan bentuk ekor; selalu bandingkan dengan HS.",
        "VaR 1-hari perlu diskalakan ke horizon regulasi (Basel: 10 hari). Dengan asumsi return i.i.d.: VaR(T) = VaR(1 hari) × √T. Kenapa akar? Variansi jumlah T return independen = T × variansi harian, sehingga standar deviasi = √T × σ. Tetapi hati-hati: √T menskalakan STANDAR DEVIASI. Menerapkannya ke KUANTIL VaR hanya sah bila return normal dengan mean nol (atau mean diabaikan); di luar itu √T untuk VaR adalah aproksimasi — label sebagai aproksimasi, bukan rumus eksak. Aturan ini berbohong saat ada autokorelasi positif (risiko tumbuh lebih cepat dari √T), mean-reversion (lebih lambat), atau posisi illiquid (asumsi bisa keluar dalam T hari fiktif).",
      ],
      formula: String.raw`\text{VaR}_{99\%} = 2{,}33 \cdot \sigma \cdot V_0 \qquad \text{VaR}(T) = \text{VaR}(1\text{d}) \sqrt{T}`,
      formulaNote: "2,33 = kuantil 99% distribusi normal — hanya sah bila return normal; σ = volatilitas harian; V_0 = nilai portofolio; VaR(T) = VaR horizon T hari — faktor √T hanya sah bila return i.i.d. normal dengan mean nol; di luar itu aproksimasi.",
      tasks: [
        { id: "t1", text: "Hitung `var_1d` parametrik 99% dari `posisi` dan `sigma_harian`" },
        { id: "t2", text: "Skalakan ke `var_10d` dengan aturan akar waktu, lalu cetak keduanya" },
      ],
      expected: "var_1d=5592000  var_10d=17683457",
      note: {
        title: "Sering salah",
        body: "Memakai z = 2,33 untuk semua distribusi. 2,33 hanya benar jika return normal — untuk distribusi berekor tebal, kuantil 1% yang benar bisa 3–4σ. Selalu cek kurtosis sebelum percaya VaR parametrik.",
        type: "pitfall",
      },
      hints: [
        "var_1d = 2.33 * sigma_harian * posisi.",
        "Scaling: var_10d = var_1d * sqrt(10). Perlu import math.",
        "Bulatkan ke rupiah penuh dengan :.0f pada print.",
      ],
      code: {
        starter: `import math\n\nposisi = 200_000_000  # Rp200 juta\nsigma_harian = 0.012\n\n# TULIS KODEMU: VaR parametrik 99% 1-hari, lalu skala ke 10 hari\nvar_1d = \nvar_10d = \n\nprint(f"var_1d={var_1d:.0f}  var_10d={var_10d:.0f}")`,
        lockLines: 4,
        solution: `import math\n\nposisi = 200_000_000  # Rp200 juta\nsigma_harian = 0.012\n\n# TULIS KODEMU: VaR parametrik 99% 1-hari, lalu skala ke 10 hari\nvar_1d = 2.33 * sigma_harian * posisi\nvar_10d = var_1d * math.sqrt(10)\n\nprint(f"var_1d={var_1d:.0f}  var_10d={var_10d:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_1d", value: 5592000, tol: 1, label: "`var_1d` seharusnya 5.592.000", msg: "2,33 × 0,012 × 200 jt = 5.592.000." },
          { kind: "equal", task: "t2", name: "var_10d", value: 17683457, tol: 1, label: "`var_10d` seharusnya 17.683.457", msg: "5.592.000 × √10. Ingat: ini mengasumsikan return i.i.d." },
          { kind: "stdout_matches", task: "t2", pattern: "var_1d=5592000\\s+var_10d=17683457", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Parametrik: z·σ·V₀. Scaling √T hanya sah jika i.i.d. — sebutkan asumsinya.",
    },
    {
      id: "monte-carlo",
      eyebrow: "Langkah 4 · Monte Carlo",
      title: "Metode 3: bangkitkan ribuan masa depan",
      prose: [
        "Monte Carlo tidak memakai histori apa adanya (HS) atau asumsi normal (parametrik) — ia membangkitkan ribuan skenario dari model stokastik, menilai ulang portofolio di tiap skenario (full revaluation), lalu mengambil kuantilnya. Model paling umum: GBM, di mana harga besok = harga kini × faktor acak dengan satu dadu normal standar Z per skenario.",
        "Kepribadiannya seperti penulis skenario yang imajinatif tetapi mahal: bisa menangani instrumen non-linear (opsi!) dengan full revaluation dan memasukkan korelasi antar faktor via dekomposisi Cholesky — tetapi butuh puluhan ribu simulasi dan kualitasnya hanya sebaik modelnya. Sampah masuk, sampah keluar.",
        "Kapan wajib Monte Carlo: portofolio mengandung opsi atau derivatif non-linear dengan gamma/vega material — aproksimasi delta saja tidak cukup. Kapan overkill: portofolio linear sederhana — HS atau parametrik lebih cepat dan transparan. Tiga metode = tiga filosofi: HS berkata masa depan = masa lalu yang terpilih acak; parametrik berkata masa depan = rumus; Monte Carlo berkata masa depan = ribuan dadu dari model.",
      ],
      formula: String.raw`S_{t+\Delta t} = S_t \cdot \exp\left[\left(\mu - \tfrac{1}{2}\sigma^2\right)\Delta t + \sigma\sqrt{\Delta t}\,Z\right]`,
      formulaNote: "S_{t+Δt} = harga di skenario simulasi; S_t = harga kini; μ = drift; σ = volatilitas; Z = bilangan acak normal standar — tiap skenario = satu tarikan dadu Z; kuantil dari ribuan skenario = VaR Monte Carlo.",
      tasks: [
        { id: "t1", text: "Jelaskan kapan Monte Carlo wajib dipilih dan kapan ia overkill." },
        { id: "t2", text: "Sebutkan dua kelemahan Monte Carlo dibanding HS." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Kualitas Monte Carlo hanya sebaik modelnya. Contoh nyata: portofolio Rp10 M dengan 12 hari krisis di data — MC berdistribusi normal memberi VaR ≈ Rp285 jt, nyaris sama butanya dengan parametrik, sementara MC berdistribusi t-student memberi ≈ Rp395 jt yang cocok dengan historical Rp385 jt. Model yang salah memberi VaR yang salah dengan penuh percaya diri.",
        type: "risk",
      },
      reference: "MC: ribuan skenario + full revaluation. Wajib untuk non-linear; mahal & sebagus modelnya.",
    },
    {
      id: "subadditivitas",
      eyebrow: "Langkah 5 · Cacat struktural",
      title: "VaR bisa menghukum diversifikasi",
      prose: [
        "Cacat paling berbahaya VaR bersifat struktural: ia melanggar subadditivitas — aksioma bahwa risiko gabungan ≤ jumlah risiko bagian-bagiannya. Contoh klasik: dua obligasi, masing-masing peluang default 4%, rugi Rp100 jika default, independen.",
        "VaR 95% tiap obligasi = 0 (peluang rugi > 0 hanya 4% < 5%, kuantil 95% jatuh di skenario tidak default). Tetapi portofolio gabungan: peluang minimal satu default = 1 − 0,96² = 7,84% > 5%, sehingga VaR 95% gabungan = 100. Hasil: VaR(A+B) = 100 > VaR(A) + VaR(B) = 0 — diversifikasi yang secara ekonomi mengurangi risiko justru menaikkan angka VaR.",
        "Manajer yang dievaluasi murni dari VaR mendapat insentif menolak diversifikasi. ES tidak pernah begini: ES 95% tiap obligasi = 80, ES gabungan = 103,2 ≤ 160 — diversifikasi diakui. Inilah alasan regulator beralih ke Expected Shortfall (rata-rata kerugian di ekor terburuk, bukan cuma ambang batasnya) di FRTB. Pelajaran LTCM 1998 melengkapi: VaR mengasumsikan likuiditas (bisa keluar dalam horizon), korelasi stabil (padahal korelasi → 1 saat krisis), dan data representatif. LTCM rugi US$4,6 miliar dalam hitungan minggu dengan leverage ~25:1 — angka VaR tanpa konteks leverage adalah angka buta.",
      ],
      tasks: [
        { id: "t1", text: "Hitung peluang minimal satu default dari dua obligasi independen (p=4%) dan jelaskan kenapa VaR gabungan = 100." },
        { id: "t2", text: "Sebutkan tiga asumsi tak tertulis di balik setiap angka VaR." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Pelanggaran subadditivitas bukan kasus mainan — ia terjadi tepat di portofolio kredit dan eksotik (obligasi high-yield, tranche sekuritisasi) yang payoff-nya lompatan, bukan kontinu. Justru di aset-aset inilah VaR paling sering dipakai untuk limit. Limit VaR yang menghukum diversifikasi membuat desk berkonsentrasi untuk menghemat VaR — persis perilaku yang ingin dicegah.",
        type: "risk",
      },
      reference: "VaR(A+B) bisa > VaR(A)+VaR(B). ES koheren — tidak pernah begitu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Metode mana, kapan",
      prose: [
        "Lima keputusan. Pertama, portofolio linear (saham, obligasi biasa, FX spot) yang butuh cepat dan transparan → Historical Simulation: tanpa asumsi distribusi, menangkap fat tail empiris, mudah diaudit. Waspadai ghost effect dan kebutaan terhadap kejadian unprecedented.",
        "Kedua, butuh agregasi portofolio besar atau alokasi modal per desk → Parametrik: rumus tertutup √(w^T Σ w) membuat dekomposisi per faktor/desk mudah (jembatan ke teknik component VaR — bedah kontribusi risiko tiap desk terhadap VaR total). Harganya: asumsi normal — selalu cek kurtosis.",
        "Ketiga, ada opsi atau derivatif non-linear material → Monte Carlo dengan full revaluation: salah satu metode yang menilai ulang payoff eksak per skenario (bersama binomial/PDE numerik untuk kasus tertentu — MC bukan satu-satunya). Keempat, horizon > 1 hari → scaling √T plus uji asumsi; untuk posisi illiquid pakai liquidity horizon, bukan √T. Kelima, angka VaR untuk keputusan besar (laporan direksi, limit, modal) → bandingkan minimal 2 metode: selisih besar = sinyal asumsi bermasalah, bukan gangguan.",
        "Aturan 10 detik: selalu sebut tiga hal — tingkat kepercayaan, horizon, metode. VaR menjawab seberapa sering ambang terlampaui, bukan seberapa dalam jika terlampaui (itu ES). Kalau portofolio berubah (ada opsi baru), metodenya harus dievaluasi ulang — bukan datanya saja.",
      ],
      tasks: [
        { id: "t1", text: "Desk baru saja membeli opsi dalam jumlah besar. Metode VaR apa yang harus dievaluasi ulang?" },
        { id: "t2", text: "Tiga metode memberi hasil jauh berbeda. Apa respons analis yang tepat?" },
      ],
      note: {
        title: "Sering salah",
        body: "Merata-ratakan tiga metode yang saling bertentangan. Selisih besar antar metode adalah informasi diagnostik — misal MC tertinggi + parametrik terendah mengarah ke fat tail atau non-linearitas. Jangan hancurkan informasi itu dengan rata-rata; investigasi penyebabnya.",
        type: "pitfall",
      },
      reference: "Linear → HS. Agregasi → parametrik. Non-linear → MC. Keputusan besar → bandingkan ≥2.",
    },
    {
      id: "minicase-abc",
      eyebrow: "Langkah 7 · Mini-case",
      title: "VaR hijau, bank jebol",
      prose: [
        "Bank ABC, 2007. Portofolio Rp8 triliun (obligasi + sekuritisasi kredit perumahan AS). VaR 99%/1-hari (Historical, 250 hari): Rp95 miliar — hanya 1,2% dari portofolio. Direksi: aman. Data 250 hari berasal dari 2006–2007: masa tenang. Korelasi antar tranche dalam data: 0,3; saat krisis melonjak ke 0,9. Kerugian aktual 2008: Rp2,1 triliun — sekitar 22,11× VaR 1-hari. Catatan horizon: kerugian Rp2,1 T itu kerugian SETAHUN penuh 2008, sementara VaR-nya 1-hari — membandingkan keduanya langsung adalah horizon mismatch. Diskalakan ke horizon tahunan (√250 ≈ 15,8×), VaR tahunan ≈ Rp1,5 T — jurangnya 1,4×, bukan 22×; tetap jauh, tetapi perbandingan yang jujur memakai horizon yang sama.",
        "Tiga kegagalan spesifik: pertama, jendela tenang — HS buta terhadap krisis yang belum ada di data. Kedua, korelasi statis — diversifikasi yang diandalkan menguap saat krisis (correlation breakdown). Ketiga, VaR dibaca sebagai batas rugi — tidak ada yang bertanya bagaimana jika 1% itu terjadi (ES tidak dihitung).",
        "Stressed VaR (VaR dari periode krisis historis) dan stress test skenario korelasi → 0,9 akan menunjukkan angka ratusan miliar, bukan 95 miliar. Backtesting membandingkan VaR dengan P&L aktual — tetapi di masa tenang pun backtest akan lolos. Backtest menguji kalibrasi frekuensi, bukan ketahanan terhadap krisis: ia tidak cukup sendirian, harus dipasangkan dengan stress test.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kelipatan` = kerugian aktual / VaR, lalu cetak" },
        { id: "t2", text: "Tuliskan tiga kegagalan spesifik penggunaan VaR di kasus ini." },
      ],
      expected: "kelipatan=22.11",
      note: {
        title: "Kaitan ke risk",
        body: "Angka VaR yang terlihat kecil dibanding portofolio (1,2%) memberi rasa aman palsu ke direksi. Selalu laporkan VaR bersama ES, stressed VaR, dan skenario korelasi-naik — direksi butuh tahu apa yang terjadi saat asumsi tenang runtuh.",
        type: "risk",
      },
      hints: [
        "kelipatan = rugi_aktual / var_99. Kedua angka sudah disediakan.",
        "Gunakan :.2f untuk dua desimal pada print.",
        "Hasilnya sekitar 22 ribu kali — itulah skala kegagalannya.",
      ],
      code: {
        starter: `var_99 = 95_000_000_000  # VaR 99%/1-hari = Rp95 miliar (Rp)\nrugi_aktual = 2_100_000_000_000  # kerugian 2008 (Rp)\n\n# TULIS KODEMU: berapa kali lipat kerugian aktual terhadap VaR?\nkelipatan = \n\nprint(f"kelipatan={kelipatan:.2f}")`,
        lockLines: 2,
        solution: `var_99 = 95_000_000_000  # VaR 99%/1-hari = Rp95 miliar (Rp)\nrugi_aktual = 2_100_000_000_000  # kerugian 2008 (Rp)\n\n# TULIS KODEMU: berapa kali lipat kerugian aktual terhadap VaR?\nkelipatan = rugi_aktual / var_99\n\nprint(f"kelipatan={kelipatan:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kelipatan", value: 22.11, tol: 0.01, label: "`kelipatan` seharusnya 22,11", msg: "2,1 triliun / 95 miliar. Cek pembagi dan pembilangnya." },
          { kind: "stdout_matches", task: "t1", pattern: "kelipatan=22\\.11", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kerugian 22,11× VaR 1-hari: jendela tenang + korelasi statis + VaR dibaca sebagai batas rugi. Ingat horizon mismatch: rugi setahun vs VaR 1-hari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: VaR adalah janji frekuensi, bukan janji kedalaman",
        body: "Cara berpikir yang benar tentang VaR: ia menjawab seberapa sering, bukan seberapa parah. Lima heuristik. Pertama: setiap angka VaR wajib dibaca lengkap — kepercayaan, horizon, metode — ketiganya hilang satu saja, angkanya tidak berarti apa-apa. Kedua: jangan pernah membiarkan VaR dibaca sebagai kerugian maksimal; selalu pasangkan dengan Expected Shortfall atau skenario stres, terutama untuk portofolio yang payoff-nya lompatan (kredit, eksotik). Ketiga: selisih besar antar metode adalah informasi diagnostik — Historical tertinggi + parametrik terendah mengarah ke fat tail; Monte Carlo tertinggi mengarah ke non-linearitas; jangan hancurkan sinyal itu dengan rata-rata. Keempat: tanyakan selalu tiga asumsi tak tertulis — likuiditas (benarkah bisa keluar dalam horizon?), korelasi stabil (berapa korelasi stresnya?), dan data representatif (apakah jendela dataku mencakup rezim seperti hari ini?). Kelima: aturan akar waktu adalah pinjaman dari dunia i.i.d — untuk posisi illiquid atau return berautokorelasi, pakai liquidity horizon atau estimasi langsung, bukan √T. Aturan 10 detiknya: sebut tiga hal (kepercayaan, horizon, metode), tanyakan kedalaman ekornya, dan curigai angka yang terlihat terlalu kecil dibanding portofolio.",
      },
      summary: [
        "VaR = kuantil kerugian: 1−α peluang rugi ≤ VaR — selalu sebut kepercayaan, horizon, metode.",
        "Historical: non-parametrik, tanpa asumsi distribusi; buta terhadap yang belum terjadi; ghost effect.",
        "Parametrik: z·σ·V₀ (multi-aset: z√(w^TΣw)); cepat & terdekomposisi; asumsi normal meremehkan fat tail.",
        "Monte Carlo: ribuan skenario + full revaluation; wajib untuk portofolio non-linear; mahal & sebagus modelnya.",
        "Scaling: VaR(T) = VaR(1d)√T hanya sah jika i.i.d. — sebutkan asumsinya.",
        "VaR bukan kerugian maksimal dan diam tentang kedalaman ekor → butuh Expected Shortfall (rata-rata kerugian di ekor terburuk) + stress test (simulasi skenario ekstrem) + backtest (pengujian akurasi model dengan data nyata).",
      ],
      next: { label: "MR4 — VaR Lanjut", href: "/v2/learn/mr4-var-lanjut" },
      quiz: [
        {
          q: "\u201CVaR 99%/10-hari = Rp5 M (Historical)\u201D. Interpretasi tepat?",
          options: [
            { text: "Kerugian maksimal 10 hari ke depan adalah Rp5 M", why: "VaR bukan batas atas — kerugian bisa jauh melampauinya." },
            { text: "Ada 1% peluang kerugian 10-hari melebihi Rp5 M — dan jika terlampaui, besarnya tidak diketahui dari VaR ini", why: "VaR = ambang kuantil, bukan batas maksimal. Seberapa dalam jika terlampaui adalah pekerjaan Expected Shortfall.", correct: true },
            { text: "Rugi Rp5 M sudah pasti terjadi", why: "VaR adalah ambang probabilistik, bukan kepastian." },
            { text: "VaR hanya berlaku untuk 1 hari", why: "horizon 10 hari valid — hanya perlu scaling yang benar." },
          ],
        },
        {
          q: "Portofolio Rp200 juta, σ harian 1,2%. VaR parametrik 99%/1-hari?",
          options: [
            { text: "Rp2,4 juta", why: "cek lagi perkaliannya." },
            { text: "Rp5,6 juta", why: "2,33 × 0,012 × Rp200 jt = Rp5,59 jt ≈ Rp5,6 jt. Ingat asumsi normalnya — cek kurtosis.", correct: true },
            { text: "Rp4,7 juta", why: "itu angka contoh volatilitas masa tenang dengan vol tahunan 16% — konteksnya beda." },
            { text: "Rp7,9 juta", why: "terlalu besar untuk z = 2,33." },
          ],
        },
        {
          q: "Kapan Monte Carlo wajib dipilih atas Historical/Parametrik?",
          options: [
            { text: "Portofolio hanya saham blue-chip", why: "portofolio linear cukup dengan HS/parametrik." },
            { text: "Portofolio mengandung opsi dengan gamma/vega material — payoff non-linear butuh full revaluation per skenario", why: "aproksimasi linear (delta) gagal untuk opsi — hanya full revaluation per skenario yang menangkap payoff non-linear.", correct: true },
            { text: "Data historis sangat panjang", why: "data panjang justru menguntungkan HS." },
            { text: "Selalu — Monte Carlo selalu terbaik", why: "MC mahal dan hanya sebagus modelnya; untuk linear ia overkill." },
          ],
        },
        {
          q: "VaR 1-hari = Rp100 jt. Dengan asumsi i.i.d., VaR 10-hari?",
          options: [
            { text: "Rp1.000 jt", why: "itu scaling linear — variansi yang linear, bukan standar deviasi." },
            { text: "Rp316 jt", why: "100 × √10 ≈ Rp316 jt. Tetapi ingat — ini mengasumsikan return i.i.d.", correct: true },
            { text: "Rp100 jt", why: "horizon lebih panjang = risiko lebih besar." },
            { text: "Rp32 jt", why: "itu arah yang terbalik." },
          ],
        },
        {
          q: "Kelemahan utama Historical Simulation?",
          options: [
            { text: "Terlalu lambat dihitung", why: "HS justru cepat dan sederhana." },
            { text: "Tidak bisa membayangkan kejadian yang belum ada di jendela data, dan sensitif terhadap pilihan jendela (ghost effect)", why: "HS = masa depan adalah masa lalu yang terpilih. Krisis unprecedented tidak akan muncul di VaR HS.", correct: true },
            { text: "Membutuhkan asumsi normal", why: "itu kelemahan metode parametrik, bukan HS." },
            { text: "Tidak bisa untuk portofolio besar", why: "HS mudah diskalakan ke portofolio besar." },
          ],
        },
      ],
    },
  ],
};
