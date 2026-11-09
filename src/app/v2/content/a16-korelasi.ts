import type { V2Lesson } from "../lib/types";

export const a16: V2Lesson = {
  slug: "a16-korelasi",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.6 Angka 0,92 yang Menyesatkan: Pearson, Spearman, Kendall",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-dimas",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Kampanye Rp 800 juta yang tidak menaikkan apa-apa",
      prose: [
        "Dimas, analis di sebuah bank, menemukan angka cantik: korelasi 0,92 antara frekuensi login mobile banking dan jumlah transaksi per nasabah. Ia presentasi ke direksi: naikkan login, transaksi ikut naik. Disetujui. Rp 800 juta digelontorkan untuk kampanye push notification. Login naik 34%. Transaksi? Flat. Nol koma nol.",
        "Tiga minggu kemudian investigasi menemukan jawabannya: keduanya naik setiap tanggal gajian. Gajian — variabel ketiga yang tak pernah diukur — mendorong orang sekaligus login dan bertransaksi. Korelasinya nyata. Kausalitas langsung login\u2192transaksi praktis nol SETELAH gajian dikontrol (korelasi murni tinggal \u2248 0,10) \u2014 'nol' di sini berarti tidak ada bukti efek langsung, bukan bukti matematis ketiadaan kausalitas.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih` = korelasi mentah − korelasi murni (yang dijelaskan gajian)" },
      ],
      expected: "selisih=0.82",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Korelasi mengukur bergerak bersama, bukan saling menyebabkan. Keputusan bisnis Rp 800 juta yang dibangun di atas korelasi tanpa kontrol confounder adalah risiko model yang nyata — selalu tanya: variabel ketiga apa yang menggerakkan keduanya?",
      },
      hints: [
        "Korelasi mentah = 0,92; korelasi murni = 0,10.",
        "Selisih = mentah − murni.",
        "selisih = 0.92 - 0.10",
      ],
      code: {
        starter: `r_mentah = 0.92  # login vs transaksi\nr_murni = 0.10  # setelah gajian dikontrol\n\n# TULIS KODEMU\nselisih = \n\nprint(f"selisih={selisih}")`,
        lockLines: 2,
        solution: `r_mentah = 0.92  # login vs transaksi\nr_murni = 0.10  # setelah gajian dikontrol\n\n# TULIS KODEMU\nselisih = r_mentah - r_murni\n\nprint(f"selisih={selisih}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih", value: 0.82, tol: 1e-9, label: "`selisih` seharusnya 0.82", msg: "0,92 − 0,10 = 0,82 — hampir seluruh korelasi dijelaskan gajian." },
          { kind: "stdout_matches", task: "t1", pattern: "selisih=0\\.82", label: "`print` menampilkan selisih", msg: "Format: selisih=0.82." },
        ],
      },
      reference: "Korelasi ≠ kausalitas. Cari confounder sebelum bertindak.",
    },
    {
      id: "pearson",
      eyebrow: "Langkah 2 · Pearson",
      title: "Pearson: hanya bisa melihat garis lurus",
      prose: [
        "Korelasi Pearson (r) mengukur kekuatan hubungan linear: rentang −1 hingga +1, 0 = tidak ada hubungan linear. Pembilang = kovariansi × n: rata-rata kesearahan kedua variabel — jika x dan y menyimpang ke arah yang sama dari pusatnya, hasil kali positif. Penyebut menormalisasi agar hasil selalu di [−1, 1].",
        "Data (1,2), (2,4), (3,5), (4,7). Mean x = 2,5, mean y = 4,5. Simpangan x: −1,5; −0,5; 0,5; 1,5. Simpangan y: −2,5; −0,5; 0,5; 2,5. Hasil kali: 3,75; 0,25; 0,25; 3,75 → jumlah 8. Dibagi penyebutnya → r ≈ 0,992: hubungan linear positif sangat kuat.",
      ],
      formula: String.raw`r = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n}(x_i - \bar{x})^2 \sum_{i=1}^{n}(y_i - \bar{y})^2}}`,
      formulaNote: "r = korelasi Pearson; x_i, y_i = pasangan observasi ke-i; x-bar, y-bar = rata-rata; pembilang = kovariansi kali n (kesearahan); penyebut = hasil kali simpangan baku (penormal ke rentang −1 sampai 1).",
      tasks: [
        { id: "t1", text: "Hitung korelasi Pearson `r` dari `x` dan `y` (3 desimal)" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "r=0.992",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "r = 0 berarti tidak ada hubungan. Salah: r = 0 hanya berarti tidak ada hubungan linear. Pola U-shape yang simetris di sekitar nol punya r ≈ 0 — padahal hubungannya deterministik sempurna. Selalu tanya: nol linear, atau nol betulan? Jawabannya hanya ada di scatterplot.",
      },
      hints: [
        "Hitung mean tiap variabel dulu.",
        "Pembilang = jumlah hasil kali simpangan.",
        "r = num / (sum_dx2*sum_dy2)**0.5",
      ],
      code: {
        starter: `x = [1, 2, 3, 4]\ny = [2, 4, 5, 7]\n\nmx = sum(x)/len(x)\nmy = sum(y)/len(y)\n\n# TULIS KODEMU\nnum = \nden = \nr = \n\nprint(f"r={r:.3f}")`,
        lockLines: 5,
        solution: `x = [1, 2, 3, 4]\ny = [2, 4, 5, 7]\n\nmx = sum(x)/len(x)\nmy = sum(y)/len(y)\n\n# TULIS KODEMU\nnum = sum((a-mx)*(b-my) for a, b in zip(x, y))\nden = (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5\nr = num/den\n\nprint(f"r={r:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r", value: 0.992, tol: 0.002, label: "`r` sekitar 0.992", msg: "Ikuti tiga langkah: simpangan → hasil kali → normalisasi. Hasilnya ≈ 0,992." },
          { kind: "stdout_matches", task: "t2", pattern: "r=0\\.992", label: "`print` menampilkan r", msg: "Format tiga desimal: r=0.992." },
        ],
      },
      reference: "Pearson: linear, interval/rasio, tanpa outlier ekstrem. r² = proporsi variansi bersama.",
    },
    {
      id: "spearman",
      eyebrow: "Langkah 3 · Spearman",
      title: "Spearman: tukang ranking yang tidak bisa dibeli",
      prose: [
        "Korelasi Spearman (ρ) = Pearson yang dihitung dari ranking, bukan nilainya. Ia mengukur hubungan monotonik — kalau x naik, y cenderung naik — tanpa peduli bentuk kurvanya. Data y = x² untuk x = 1..5: y = 1, 4, 9, 16, 25. Ranking x dan y sama persis (1,2,3,4,5) → selisih ranking nol semua → ρ = 1,0.",
        "Pearson hanya ≈ 0,981 di sini — bagus tapi tidak sempurna, karena kurvanya tidak lurus. Spearman tidak peduli kelurusan, hanya urutan. Karena hanya melihat ranking, outlier tidak bisa menyuapnya: nilai 1 miliar tetap cuma ranking 1.",
      ],
      formula: String.raw`\rho = 1 - \frac{6\sum d_i^2}{n(n^2-1)} \qquad d_i = \text{selisih ranking}`,
      formulaNote: "rho = korelasi Spearman; d_i = selisih ranking x dan y pada observasi ke-i; n = banyaknya data; rumus ini = Pearson yang dihitung dari ranking, sehingga mengukur hubungan monotonik apa pun bentuknya. BATAS: rumus selisih-ranking ini berlaku bila TIDAK ada nilai kembar (ties); bila ada ties, pakai Pearson atas ranking RATA-RATA (lihat rank() di lab) \u2014 rumus di atas memberi hasil salah pada ties.",
      tasks: [
        { id: "t1", text: "Hitung Spearman `rho` dari ranking `x` dan `y`" },
        { id: "t2", text: "Hitung Pearson `r` dari nilai aslinya (3 desimal)" },
      ],
      expected: "rho=1.0  r=0.981",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Spearman selalu ≥ Pearson, jadi pakai Spearman saja. Salah: tidak ada jaminan begitu — keduanya mengukur hal berbeda (linear vs monotonik). Pada hubungan linear bersih dengan sedikit noise, Pearson justru lebih tepat dan lebih efisien. Pilih berdasarkan jenis hubungan yang kamu cari, bukan angka yang lebih besar.",
      },
      hints: [
        "Fungsi rank() sudah disediakan di bagian terkunci.",
        "d2 = jumlah kuadrat selisih ranking.",
        "rho = 1 - 6*d2/(n*(n**2-1))",
      ],
      code: {
        starter: `x = [1, 2, 3, 4, 5]\ny = [v*v for v in x]\n\ndef rank(v):\n    s = sorted(v)\n    return [sum(1 for b in s if b < a) + (sum(1 for b in s if b == a) + 1) / 2 for a in v]  # ranking RATA-RATA bila ada ties\n\nrx, ry = rank(x), rank(y)\nn = len(x)\n\n# TULIS KODEMU\nd2 = \nrho = \nmx, my = sum(x)/n, sum(y)/n\nnum = sum((a-mx)*(b-my) for a, b in zip(x, y))\nr = \n\nprint(f"rho={rho}  r={r:.3f}")`,
        lockLines: 11,
        solution: `x = [1, 2, 3, 4, 5]\ny = [v*v for v in x]\n\ndef rank(v):\n    s = sorted(v)\n    return [sum(1 for b in s if b < a) + (sum(1 for b in s if b == a) + 1) / 2 for a in v]  # ranking RATA-RATA bila ada ties\n\nrx, ry = rank(x), rank(y)\nn = len(x)\n\n# TULIS KODEMU\nd2 = sum((a-b)**2 for a, b in zip(rx, ry))\nrho = 1 - 6*d2/(n*(n**2-1))\nmx, my = sum(x)/n, sum(y)/n\nnum = sum((a-mx)*(b-my) for a, b in zip(x, y))\nr = num/((sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5)\n\nprint(f"rho={rho}  r={r:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rho", value: 1.0, tol: 1e-9, label: "`rho` seharusnya 1.0", msg: "Ranking cocok sempurna → d² = 0 → ρ = 1." },
          { kind: "equal", task: "t2", name: "r", value: 0.981, tol: 0.002, label: "`r` sekitar 0.981", msg: "Pearson kecewa karena kurvanya tidak lurus: ≈ 0,981." },
          { kind: "stdout_matches", task: "t2", pattern: "rho=1(\\.0)?\\s+r=0\\.981", label: "`print` menampilkan keduanya", msg: "Format: rho=1.0  r=0.981." },
        ],
      },
      reference: "Spearman untuk ordinal atau monotonik non-linear; kebal outlier.",
    },
    {
      id: "kendall",
      eyebrow: "Langkah 4 · Kendall",
      title: "Kendall: menghitung setiap pasangan",
      prose: [
        "Korelasi Kendall (τ) memeriksa semua pasangan data: konkordan (x dan y bergerak searah) vs diskordan (berlawanan arah). τ = (konkordan − diskordan) / total pasangan \u2014 ini \u03c4-a (Kendall tau-a), yang TIDAK mengoreksi ties: pada ties sempurna \u03c4-a tidak mencapai 1. Data (1,2), (2,3), (3,1), (4,4): total 6 pasangan. Konkordan 4, diskordan 2 → τ-a = 2/6 ≈ 0,33.",
        "Satu data bandel (3,1) merusak 2 pasangan — Kendall jujur soal itu. Ia paling sabar dan teliti: lambat (O(n²)) tapi paling bisa diandalkan untuk sampel kecil (n < 30). Untuk data berties pakai \u03c4-b (penyebut dikoreksi ties) \u2014 \u03c4-a di atas BUKAN alat ties. Catatan: nilai τ biasanya lebih kecil dari ρ untuk data yang sama — skalanya berbeda, jadi τ 0,5 ≠ ρ 0,5 dalam kekuatan.",
      ],
      formula: String.raw`\tau = \frac{\text{konkordan} - \text{diskordan}}{n(n-1)/2}`,
      formulaNote: "tau = korelasi Kendall; konkordan = pasangan yang bergerak searah; diskordan = pasangan yang berlawanan arah; penyebut = total pasangan n(n-1)/2.",
      tasks: [
        { id: "t1", text: "Hitung `total` pasangan dari n = 4 data" },
        { id: "t2", text: "Hitung `tau` = (4 − 2) / total (2 desimal)" },
      ],
      expected: "total=6  tau=0.33",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Kendall dan Spearman bisa dipertukarkan — toh sama-sama rank. Salah: nilai τ biasanya lebih kecil dari ρ; τ 0,5 tidak sama kuatnya dengan ρ 0,5. Kendall lebih konservatif dan punya interpretasi peluang yang bersih (selisih probabilitas pasangan searah vs berlawanan).",
      },
      hints: [
        "Total pasangan = n(n−1)/2.",
        "tau = (konkordan − diskordan) / total.",
        "Bulatkan 2 desimal dengan round().",
      ],
      code: {
        starter: `n = 4\nkonkordan, diskordan = 4, 2\n\n# TULIS KODEMU\ntotal = \ntau = \n\nprint(f"total={total}  tau={tau}")`,
        lockLines: 2,
        solution: `n = 4\nkonkordan, diskordan = 4, 2\n\n# TULIS KODEMU\ntotal = n*(n-1)//2\ntau = round((konkordan-diskordan)/total, 2)\n\nprint(f"total={total}  tau={tau}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 6, tol: 1e-9, label: "`total` seharusnya 6", msg: "4×3/2 = 6 pasangan." },
          { kind: "equal", task: "t2", name: "tau", value: 0.33, tol: 0.01, label: "`tau` seharusnya 0.33", msg: "(4 − 2)/6 ≈ 0,33." },
          { kind: "stdout_matches", task: "t2", pattern: "total=6\\s+tau=0\\.33", label: "`print` menampilkan keduanya", msg: "Format: total=6  tau=0.33." },
        ],
      },
      reference: "Kendall untuk sampel kecil dan banyak ties (pakai τ-b bila ada ties); interpretasi peluangnya bersih.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 5 · Jebakan korelasi",
      title: "Anscombe, Simpson, dan korelasi spurious",
      prose: [
        "Anscombe's Quartet: empat dataset dengan statistik identik — mean x = 9, mean y = 7,5, r = 0,816, garis regresi sama persis. Tapi scatterplot-nya sangat beda: satu linear, satu parabola, satu linear dengan satu outlier raksasa, satu garis vertikal. Angka yang sama, makna yang berlawanan. Plot dulu, hitung kemudian.",
        "Simpson's paradox: korelasi agregat berlawanan arah dengan korelasi per grup. Obat terlihat buruk secara agregat tapi positif di tiap grup usia — pasien yang lebih sakit cenderung diberi obat. Dalam kredit: limit besar berkorelasi dengan default tinggi bisa berbalik setelah dikontrol segmen pendapatan. N besar tidak menyembuhkan bias struktural.",
        "Korelasi spurious: konsumsi keju vs kematian terlilit sprei (r = 0,95) — keduanya naik seiring waktu, tidak ada yang menyebabkan yang lain. Versi keuangannya: dua saham uptrend 5 tahun bull market berkorelasi tinggi karena pasarnya naik, bukan bisnisnya terkait. Untuk time series: difference dulu (korelasikan perubahannya, bukan levelnya) atau detrend.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Korelasi level harga dua saham uptrend hampir tidak informatif; korelasi return-nya yang bermakna. Diversifikasi yang dibangun di atas korelasi spurious adalah diversifikasi semu — ia runtuh tepat saat dibutuhkan.",
      },
      reference: "Aturan 10 detik: scatterplot dulu. Linear+bersih → Pearson. Melengkung/ordinal → Spearman. Kecil+ties → Kendall. Time series → difference dulu.",
    },
    {
      id: "minicase-diversifikasi",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Diversifikasi yang tidak mendiversifikasi",
      prose: [
        "Manajer investasi mengelola Dana A (obligasi korporat) dan Dana B (saham perbankan): korelasi Pearson −0,15 selama 2019–2024. Komite menyimpulkan hampir tidak berkorelasi → diversifikasi bagus → alokasi 50/50. Stress test skenario krisis likuiditas: Dana A −18%, Dana B −22% — jatuh bersamaan.",
        "(a) Correlation breakdown: korelasi di masa tenang mengasumsikan hubungan stabil. Dalam krisis likuiditas semua aset berisiko dijual bersamaan \u2014 korelasi rendah BISA melonjak mendekati +1 (dalam contoh stres ini kedua dana jatuh bersamaan) \u2014 bukan hukum bahwa setiap krisis membuat korelasi +1; ukur korelasi kondisional/stressed, jangan asumsikan. Korelasi historis mengukur cuaca kemarin, bukan badai besok.",
        "(b) Yang seharusnya dipakai: korelasi kondisional (hitung r hanya pada hari pasar turun > 3%), tail dependence (probabilitas jatuh bersama di ekor), dan stress test skenario. (c) Tindakan: tetapkan batas korelasi stres (bukan korelasi normal) sebagai input alokasi; wajibkan stress test likuiditas tiap kuartal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dua saham berkorelasi −0,8 selama 5 tahun normal bisa jatuh bersamaan saat krisis. Korelasi historis bukan jaminan — inilah mengapa stress testing ada, dan mengapa diversifikasi harus diuji di rezim stres, bukan di masa tenang.",
      },
      reference: "Peta keputusan: linear+bersih → Pearson; ordinal/monotonik → Spearman; kecil+ties → Kendall; krisis → korelasi kondisional + stress test.",
    },
        {
          id: "gap-r8-korelasi-ketidakpastian",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G3)",
          title: "Korelasi 0,99 dari 4 data: seberapa yakin kamu?",
          prose: [
            "Lesson ini menghitung r dengan teliti — tetapi tidak pernah bertanya seberapa PASTI angka itu. Korelasi dari sampel kecil adalah estimasi yang goyah, dan interval kepercayaannya (CI) mengatakannya dengan jujur. Ambil data Pearson langkah 2: (1,2), (2,4), (3,5), (4,7) → r ≈ 0,992, n = 4. Dengan transformasi Fisher z (z = artanh(r), SE = 1/√(n−3)), CI 95%-nya adalah (0,66; 1,00). (Catatan: interval Fisher ini mengasumsikan normalitas bivariat — asumsi yang tidak dinyatakan dan nyaris tak teruji pada n = 4; dengan SE = 1/√(4−3) = 1,0, CI ini hanya orde-magnitudo, bukan presisi.) Baca kalimat itu baik-baik: r = 0,99 dari 4 data masih cocok dengan korelasi populasi 0,66 — 'sangat kuat' boleh jadi hanya 'kuat'. Angka titiknya memukau; intervalnya merendahkan.",
            "Bandingkan dengan n = 30 pada r yang sama: SE = 1/√27 ≈ 0,19 → CI 95% = (0,98; 1,00). Barulah 0,99 berarti sesuatu. Pelajarannya: JANGAN pernah melaporkan r tanpa n — dan untuk n kecil, laporkan CI-nya, bukan hanya titiknya. Aturan praktis: n < 10 → CI korelasi hampir selalu terlalu lebar untuk klaim kuat; n ≥ 30 → barulah CI mulai sempit. Inilah alasan lesson ini tidak boleh dipakai untuk menyimpulkan 'login menyebabkan transaksi' dari segelintir titik — selain kausalitas, ketidakpastiannya sendiri sudah melarang.",
            "Prasyarat yang sama pentingnya: pasangan observasi harus INDEPENDEN. Korelasi Pearson mengasumsikan tiap pasangan (x, y) adalah undian independen. Pada data runtun waktu — harga saham harian, login vs transaksi per hari — asumsi ini runtuh: hari ini mirip kemarin (autokorelasi), sehingga n efektif jauh lebih kecil dari n nominal dan CI di atas terlalu sempit (terlalu pede). Obatnya seperti di langkah jebakan: difference dulu (korelasikan PERUBAHANNYA, bukan levelnya) atau detrend — dan laporkan bahwa CI standar tidak berlaku mentah-mentah untuk data berwaktu.",
          ],
          formula: String.raw`z = \text{artanh}(r) \qquad SE = \frac{1}{\sqrt{n-3}} \qquad CI_{95\%} = \tanh(z \pm 1{,}96 \times SE)`,
          formulaNote: "r = 0,992: n = 4 → CI (0,66; 1,00); n = 30 → CI (0,98; 1,00). CI menyempit dengan n; data runtun waktu butuh difference/detrend dulu.",
          tasks: [
            { id: "t1", text: "Hitung CI 95% Fisher untuk r = 0,992 dengan n = 4: `ci4_lo`, `ci4_hi` (2 desimal)" },
            { id: "t2", text: "Hitung CI 95% Fisher untuk r = 0,992 dengan n = 30: `ci30_lo`, `ci30_hi` (2 desimal)" },
          ],
          expected: "ci4_lo=0.66 ci4_hi=1.0 ci30_lo=0.98 ci30_hi=1.0",
          hints: [
            "z = artanh(0,992) ≈ 2,76; SE n=4 adalah 1/√1 = 1,0.",
            "Batas bawah = tanh(z − 1,96×SE), batas atas = tanh(z + 1,96×SE).",
            "Gunakan math.atanh dan math.tanh; bulatkan 2 desimal.",
          ],
          code: {
            starter: `import math\n\nr = 0.992\n\n# TULIS KODEMU: CI 95% Fisher untuk n=4 dan n=30 (2 desimal)\nci4_lo =\nci4_hi =\nci30_lo =\nci30_hi =\n\nprint(f"ci4_lo={ci4_lo} ci4_hi={ci4_hi} ci30_lo={ci30_lo} ci30_hi={ci30_hi}")`,
            lockLines: 5,
            solution: `import math\n\nr = 0.992\n\n# TULIS KODEMU: CI 95% Fisher untuk n=4 dan n=30 (2 desimal)\ndef fisher_ci(r, n):\n    z = math.atanh(r)\n    se = 1 / math.sqrt(n - 3)\n    return round(math.tanh(z - 1.96 * se), 2), round(math.tanh(z + 1.96 * se), 2)\nci4_lo, ci4_hi = fisher_ci(r, 4)\nci30_lo, ci30_hi = fisher_ci(r, 30)\n\nprint(f"ci4_lo={ci4_lo} ci4_hi={ci4_hi} ci30_lo={ci30_lo} ci30_hi={ci30_hi}")`,
            checks: [
              { kind: "equal", task: "t1", name: "ci4_lo", value: 0.66, tol: 0.01, label: "`ci4_lo` = 0,66", msg: "tanh(2,76 − 1,96) ≈ 0,66." },
              { kind: "equal", task: "t1", name: "ci4_hi", value: 1.0, tol: 0.01, label: "`ci4_hi` = 1,00", msg: "tanh(2,76 + 1,96) ≈ 0,9998 → 1,00." },
              { kind: "equal", task: "t2", name: "ci30_lo", value: 0.98, tol: 0.01, label: "`ci30_lo` = 0,98", msg: "SE = 1/√27 ≈ 0,19 → tanh(2,76 − 0,38) ≈ 0,98." },
              { kind: "equal", task: "t2", name: "ci30_hi", value: 1.0, tol: 0.01, label: "`ci30_hi` = 1,00", msg: "tanh(2,76 + 0,38) ≈ 0,996 → 1,00." },
              { kind: "stdout_matches", task: "t2", pattern: "ci4_lo=0\\.66\\s+ci4_hi=1\\.0\\s+ci30_lo=0\\.98\\s+ci30_hi=1\\.0", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Dua studi melaporkan r = 0,99: studi A dengan n = 4, studi B dengan n = 30. Mana yang buktinya lebih kuat?",
              options: [
                { text: "Studi B — CI-nya (0,98; 1,00), jauh lebih sempit dari A (0,66; 1,00)", why: "Tepat: angka titik yang sama, ketidakpastian yang beda jauh. r tanpa n (dan CI) tidak bisa dibandingkan.", correct: true },
                { text: "Sama kuat — r-nya sama-sama 0,99", why: "Salah: r = 0,99 dari 4 data masih cocok dengan korelasi populasi 0,66." },
                { text: "Studi A — n kecil berarti datanya lebih bersih", why: "Salah: n kecil berarti SE besar (1,0) dan CI lebar — bukan data lebih bersih." },
                { text: "Tidak bisa dibandingkan karena rumusnya beda", why: "Salah: rumusnya sama (Fisher z); yang beda hanya n — dan itulah intinya." },
              ],
            },
          ],
          reference: "Laporkan r beserta n dan CI-nya (Fisher z); n kecil → CI lebar; pasangan harus independen — data runtun waktu di-difference/detrend dulu.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Pearson = hubungan linear; butuh data interval/rasio, bersih, tanpa outlier.",
        "Spearman = hubungan monotonik via ranking; untuk ordinal dan kurva non-linear; kebal outlier.",
        "Kendall = per pasangan; untuk sampel kecil dan banyak ties (τ-b bila ada ties); nilainya tidak sebanding dengan Spearman.",
        "r = 0 hanya berarti tidak ada hubungan linear — cek scatterplot untuk pola non-linear.",
        "Korelasi ≠ kausalitas; waspadai Anscombe, Simpson, spurious, dan breakdown saat krisis.",
      ],
      next: { label: "A1.7 — Missing Data", href: "/v2/learn/a17-missing-data" },
      quiz: [
        {
          q: "Hubungan y = x² untuk x positif. Korelasi yang paling tepat?",
          options: [
            { text: "Pearson (linear)", why: "Pearson mengukur linearitas sehingga underestimate (r ≈ 0,98, bukan 1)." },
            { text: "Spearman (monotonik)", why: "Hubungan monotonik naik tapi non-linear: Spearman menangkap peringkatnya sempurna (ρ = 1).", correct: true },
            { text: "Keduanya sama", why: "Keduanya mengukur hal berbeda: linear vs monotonik." },
            { text: "Tidak ada korelasi", why: "Ada hubungan deterministik yang kuat — hanya tidak linear." },
          ],
        },
        {
          q: "Apa pelajaran utama dari Anscombe's Quartet?",
          options: [
            { text: "Korelasi selalu akurat", why: "Angka identik (r = 0,816) menyembunyikan pola yang sangat beda." },
            { text: "Selalu visualisasikan data", why: "Statistik identik bisa berarti linear, parabola, outlier, atau garis vertikal. Plot dulu, hitung kemudian.", correct: true },
            { text: "Mean tidak penting", why: "Mean tetap penting — pelajarannya soal visualisasi, bukan soal mean." },
            { text: "Outlier tidak masalah", why: "Satu outlier raksasa mengubah seluruh cerita salah satu dataset." },
          ],
        },
        {
          q: "Dua saham A dan B berkorelasi Pearson −0,8 selama 5 tahun normal. Saat krisis, keduanya jatuh bersamaan. Apa yang terjadi?",
          options: [
            { text: "Korelasi tetap −0,8 — matematika tidak berubah", why: "Korelasi adalah properti data, dan datanya berubah saat rezim berubah." },
            { text: "Correlation breakdown: korelasi bisa melonjak mendekati +1 saat stres", why: "Aset yang biasanya berlawanan bisa jatuh bersamaan. Korelasi historis bukan jaminan diversifikasi.", correct: true },
            { text: "Spearman akan tetap −0,8", why: "Spearman juga dihitung dari data yang sama — ia ikut berubah." },
            { text: "Diversifikasi dijamin aman", why: "Justru tidak: diversifikasi runtuh tepat saat paling dibutuhkan." },
          ],
        },
        {
          q: "Data rating kredit (ordinal: AAA, AA, A, BBB...) vs probabilitas default. Korelasi mana yang valid?",
          options: [
            { text: "Pearson — standar industri", why: "Pearson butuh jarak antar nilai yang sama — rating tidak punya itu." },
            { text: "Spearman/Kendall — data ordinal, hubungan monotonik", why: "Keduanya bekerja pada ranking — tepat untuk ordinal.", correct: true },
            { text: "Tidak bisa dihitung korelasi untuk ordinal", why: "Bisa — dengan koefisien berbasis ranking." },
            { text: "Harus diubah ke angka 1-10 lalu Pearson", why: "Mengubah ke angka mengasumsikan jarak antar rating sama — salah secara konsep." },
          ],
        },
        {
          q: "r = 0,02 antara jam belajar dan nilai ujian pada 200 mahasiswa. Kesimpulan paling tepat?",
          options: [
            { text: "Tidak ada hubungan sama sekali", why: "r hanya buta terhadap linearitas — pola non-linear masih mungkin." },
            { text: "Tidak ada hubungan LINEAR — tapi bisa ada pola non-linear; cek scatterplot", why: "Pola U-shape memberi r ≈ 0 dengan hubungan yang nyata.", correct: true },
            { text: "Pasti ada kesalahan input data", why: "Jangan tuduh data sebelum melihat plotnya." },
            { text: "Spearman pasti = 1", why: "Tidak ada jaminan — Spearman mengukur monotonik, bukan keajaiban." },
          ],
        },
      ],
      note: {
        title: "Intuisi: korelasi mengukur kerapian barisan, bukan pentingnya hubungan",
        body: "Enam heuristik. Satu: r = 0,9 bisa 100 persen spurious — sebelum merayakan, cari variabel ketiganya; gajian menggerakkan login dan transaksi sekaligus tanpa keduanya saling menyebabkan. Dua: Pearson buta terhadap kelengkungan — y = x kuadrat adalah hubungan sempurna yang terlihat “tidak sempurna” di matanya; untuk hubungan monotonik apa pun bentuknya, Spearman lebih jujur. Tiga: satu outlier bisa menciptakan korelasi dari ketiadaan atau menghancurkan korelasi yang nyata — plot scatterplot selalu, tanpa kecuali. Empat: korelasi bukan kemiringan — r = 0,9 dengan slope datar berarti hubungan kuat tetapi efek praktis kecil; kekuatan hubungan dan besar dampak adalah dua pertanyaan berbeda. Lima: korelasi yang dihitung di masa tenang bisa runtuh saat badai — diversifikasi yang nyaman di masa normal menipumu tepat saat kamu paling butuh; uji korelasimu di periode stres sebelum percaya. Enam: bedakan korelasi dalam-sampel dari stabilitas antar-waktu — korelasi yang dihitung dari satu jendela waktu bisa lenyap di jendela berikutnya; uji di beberapa periode sebelum menjadikannya asumsi portofolio.",
      },
    },
  ],
};
