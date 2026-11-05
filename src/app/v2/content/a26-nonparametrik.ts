import type { V2Lesson } from "../lib/types";

export const a26: V2Lesson = {
  slug: "a26-nonparametrik",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.6 Uji Nonparametrik: Saat Data Tak Mau Normal",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-bonus",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Kemenangan signifikan milik satu orang",
      prose: [
        "HRD mengumumkan: rata-rata bonus Divisi X = Rp18,5 juta, Divisi Y = Rp15,2 juta. Uji-t signifikan (p = 0,03). Selamat untuk Divisi X! Analis membuka distribusinya: X — 59 orang dapat Rp8–14 juta, 1 direktur dapat Rp400 juta. Y — semua 60 orang dapat Rp12–18 juta, merata. Median X = Rp12 juta — di bawah median Y = Rp13,5 juta!",
        "Uji-t membandingkan mean — dan mean X menang hanya karena satu direktur. Mayoritas karyawan X justru menerima lebih kecil dari mayoritas Y. Ada uji yang tidak bisa ditipu direktur itu: Mann-Whitney. Ia tidak peduli berapa bonusnya, hanya urutannya — direktur Rp400 juta cuma dihitung sebagai peringkat 1.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih_mean` = 18,5 − 15,2 (versi mean)" },
        { id: "t2", text: "Hitung `selisih_median` = 12,0 − 13,5 (versi median)" },
      ],
      expected: "selisih_mean=3.3  selisih_median=-1.5",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mean berkata X menang, median berkata Y menang — keduanya benar untuk definisinya masing-masing, tapi menjawab pertanyaan beda. Untuk karyawan tipikal dapat berapa, median/Mann-Whitney jujur; untuk total biaya bonus, mean yang relevan. Pilih statistik sesuai pertanyaan, bukan sesuai hasil yang diinginkan.",
      },
      hints: [
        "selisih_mean = 18.5 - 15.2.",
        "selisih_median = 12.0 - 13.5 — negatif!",
        "Tandanya berbalik: mean vs median bercerita berlawanan.",
      ],
      code: {
        starter: `# bonus (juta Rp): mean & median per divisi\n\n# TULIS KODEMU\nselisih_mean = \nselisih_median = \n\nprint(f"selisih_mean={selisih_mean}  selisih_median={selisih_median}")`,
        lockLines: 1,
        solution: `# bonus (juta Rp): mean & median per divisi\n\n# TULIS KODEMU\nselisih_mean = round(18.5 - 15.2, 1)\nselisih_median = round(12.0 - 13.5, 1)\n\nprint(f"selisih_mean={selisih_mean}  selisih_median={selisih_median}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih_mean", value: 3.3, tol: 0.01, label: "`selisih_mean` seharusnya 3.3", msg: "Mean: X menang 3,3 juta — kemenangan satu direktur." },
          { kind: "equal", task: "t2", name: "selisih_median", value: -1.5, tol: 0.01, label: "`selisih_median` seharusnya -1.5", msg: "Median: X kalah 1,5 juta — karyawan tipikal X lebih kecil." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih_mean=3\\.3\\s+selisih_median=-1\\.5", label: "`print` menampilkan keduanya", msg: "Format: selisih_mean=...  selisih_median=... ." },
        ],
      },
      reference: "Satu outlier bisa memenangkan uji-t sendirian.",
    },
    {
      id: "mann-whitney",
      eyebrow: "Langkah 2 · Mann-Whitney U",
      title: "Wasit yang hanya menghitung urutan",
      prose: [
        "Mann-Whitney U menguji dominansi stokastik: apakah nilai satu grup cenderung lebih besar dari grup lain. Cara kerja: gabung semua data, urutkan, beri peringkat 1…N; jumlahkan peringkat grup 1 → R1; hitung U = R1 − n1(n1+1)/2. Di bawah H0, U menyebar di sekitar n1·n2/2.",
        "Contoh mini: A = [8, 12, 400], B = [10, 11, 13]. Urutan: 8(A), 10(B), 11(B), 12(A), 13(B), 400(A) → R1 = 1+4+6 = 11; U = 11 − 6 = 5. Ekspektasi H0 = 4,5; maksimum U = 9. U = 5 nyaris tepat di ekspektasi → tidak ada bukti A dominan, meski mean A (140) menghancurkan mean B (11,3)! Satu direktur tidak bisa memenangkan pemilu peringkat sendirian.",
      ],
      formula: String.raw`U = R_1 - \frac{n_1(n_1+1)}{2}, \quad E[U \mid H_0] = \frac{n_1 n_2}{2}`,
      formulaNote: "U = statistik Mann-Whitney; R_1 = jumlah ranking observasi grup 1 setelah semua data digabung dan diurutkan; n_1, n_2 = ukuran dua grup; E[U|H0] = nilai U yang diharapkan bila kedua grup setara.",
      tasks: [
        { id: "t1", text: "Hitung `R1` = jumlah peringkat grup A ([8,12,400] vs [10,11,13])" },
        { id: "t2", text: "Hitung `U` = R1 − 3·4/2" },
        { id: "t3", text: "Hitung `U_harapan` = 3·3/2" },
      ],
      expected: "R1=11  U=5  U_harapan=4.5",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mann-Whitney menguji perbedaan median. Salah — ia menguji dominansi stokastik. Ia menjadi uji median hanya jika kedua distribusi punya bentuk yang sama (hanya bergeser). Jika bentuknya beda, interpretasi beda median bisa menyesatkan.",
      },
      hints: [
        "Urutan gabungan: 8(A),10(B),11(B),12(A),13(B),400(A) → peringkat 1–6.",
        "R1 = 1 + 4 + 6.",
        "U = R1 - 6; U_harapan = 9/2.",
      ],
      code: {
        starter: `# grup A: [8,12,400], grup B: [10,11,13] (peringkat 1..6)\n\n# TULIS KODEMU\nR1 = \nU = \nU_harapan = \n\nprint(f"R1={R1}  U={U}  U_harapan={U_harapan}")`,
        lockLines: 1,
        solution: `# grup A: [8,12,400], grup B: [10,11,13] (peringkat 1..6)\n\n# TULIS KODEMU\nR1 = 1 + 4 + 6  # peringkat anggota A\nU = R1 - 3*4/2\nU_harapan = 3*3/2\n\nprint(f"R1={R1}  U={U}  U_harapan={U_harapan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "R1", value: 11, tol: 1e-9, label: "`R1` seharusnya 11", msg: "Peringkat A: 1, 4, 6 → jumlah 11." },
          { kind: "equal", task: "t2", name: "U", value: 5, tol: 1e-9, label: "`U` seharusnya 5", msg: "U = 11 − 6 = 5." },
          { kind: "equal", task: "t3", name: "U_harapan", value: 4.5, tol: 1e-9, label: "`U_harapan` seharusnya 4.5", msg: "Ekspektasi H0 = 4,5 — U=5 nyaris tepat di sana." },
          { kind: "stdout_matches", task: "t3", pattern: "R1=11\\s+U=5(\\.0)?\\s+U_harapan=4\\.5", label: "`print` menampilkan ketiganya", msg: "Format: R1=...  U=...  U_harapan=... ." },
        ],
      },
      reference: "Rp400 juta hanya jadi peringkat 1 — kekuatannya dinetralkan.",
    },
    {
      id: "wilcoxon-peta",
      eyebrow: "Langkah 3 · Wilcoxon & peta uji",
      title: "Satu peta, empat kuadran",
      prose: [
        "Wilcoxon signed-rank adalah padanan berpasangan dari Mann-Whitney — pengganti uji-t berpasangan saat selisihnya tidak normal: hitung selisih tiap pasangan, buang yang nol, peringkat nilai absolut selisih, jumlahkan peringkat selisih positif → W. Di bawah H0, W ≈ setengah total peringkat.",
        "Peta pasangan: berpasangan + normal → uji-t berpasangan; berpasangan + tidak normal → Wilcoxon signed-rank; independen + normal → uji-t Welch; independen + tidak normal → Mann-Whitney; 3+ grup independen + tidak normal → Kruskal-Wallis (ANOVA-nya ranking). Harga ranking: sedikit kurang power jika data sebenarnya normal — tapi tidak pernah tertipu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Nonparametrik berarti tanpa parameter sama sekali. Salah — artinya tanpa parameter distribusi seperti μ dan σ. Ranking adalah senjatanya: membuang informasi besar-kecil, mempertahankan urutan.",
      },
      reference: "Untuk data ordinal (kepuasan 1–5), ranking menghormati sifat ordinal.",
    },
    {
      id: "chi-square",
      eyebrow: "Langkah 4 · Chi-square",
      title: "Detektif tabel kategori",
      prose: [
        "Uji chi-square mengukur seberapa jauh frekuensi teramati (O) menyimpang dari harapan (E) jika tidak ada hubungan: χ² = Σ(O−E)²/E. Pembagi E menstandarkan — selisih 10 dari harapan 1.000 tidak sama dengan selisih 10 dari harapan 12.",
        "Contoh 2×2: Aplikasi (Puas 55, Tidak 45), Kantor (Puas 40, Tidak 60), n=200. Harapan tiap sel: 47,5; 52,5; 47,5; 52,5. χ² ≈ 4,51; df = 1; nilai kritis 5% = 3,84 → tolak H0: kepuasan berhubungan dengan kanal. Syarat: expected tiap sel ≥ 5 — jika ada sel kecil, aproksimasi χ² jebol → pakai Fisher exact.",
      ],
      formula: String.raw`\chi^2 = \sum \frac{(O - E)^2}{E}`,
      formulaNote: "chi-kuadrat = statistik uji; O = frekuensi teramati tiap sel; E = frekuensi harapan tiap sel bila tidak ada hubungan; pembagi E menstandarkan selisih agar sel besar dan kecil sebanding.",
      tasks: [
        { id: "t1", text: "Hitung `chi2` = Σ(O−E)²/E untuk O=[55,45,40,60], E=[47,5,52,5,47,5,52,5]; bulatkan 2 desimal" },
        { id: "t2", text: "Hitung `df` = (2−1)(2−1)" },
      ],
      expected: "chi2=4.51  df=1",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Chi-square selalu valid untuk tabel kategori. Salah — aturan praktis: expected ≥ 5 tiap sel. Tabel jarang (fraud, default langka) adalah kasus klasik di mana Fisher exact yang tepat, bukan chi-square.",
      },
      hints: [
        "chi2 = sum((o-e)**2/e for o,e in zip(O,E)).",
        "Bulatkan 2 desimal: round(..., 2).",
        "df = 1; kritis 5% = 3,84.",
      ],
      code: {
        starter: `# kepuasan x kanal: O teramati, E harapan di bawah H0\nO = [55, 45, 40, 60]\nE = [47.5, 52.5, 47.5, 52.5]\n\n# TULIS KODEMU\nchi2 = \ndf = \n\nprint(f"chi2={chi2}  df={df}")`,
        lockLines: 3,
        solution: `# kepuasan x kanal: O teramati, E harapan di bawah H0\nO = [55, 45, 40, 60]\nE = [47.5, 52.5, 47.5, 52.5]\n\n# TULIS KODEMU\nchi2 = round(sum((o-e)**2/e for o, e in zip(O, E)), 2)\ndf = (2-1)*(2-1)\n\nprint(f"chi2={chi2}  df={df}")`,
        checks: [
          { kind: "equal", task: "t1", name: "chi2", value: 4.51, tol: 0.01, label: "`chi2` seharusnya 4.51", msg: "χ² ≈ 4,51 > 3,84 → tolak H0." },
          { kind: "equal", task: "t2", name: "df", value: 1, tol: 1e-9, label: "`df` seharusnya 1", msg: "df = (2−1)(2−1) = 1." },
          { kind: "stdout_matches", task: "t2", pattern: "chi2=4\\.51\\s+df=1", label: "`print` menampilkan keduanya", msg: "Format: chi2=...  df=... ." },
        ],
      },
      reference: "χ² memeriksa setiap sel: seharusnya 42, tapi ada 55 — mencurigakan?",
    },
    {
      id: "ks-fisher",
      eyebrow: "Langkah 5 · KS & Fisher",
      title: "Membandingkan bentuk, bukan cuma lokasi",
      prose: [
        "Uji Kolmogorov–Smirnov membandingkan seluruh bentuk distribusi (D = celah CDF maksimum), bukan cuma lokasi. Dua grup bisa punya mean dan median identik — tapi satu bimodal, satu unimodal. Uji-t dan Mann-Whitney fokus pada lokasi dan buta terhadap perbedaan bentuk murni; KS menangkapnya.",
        "Fisher exact: untuk tabel dengan expected < 5, ia menghitung p-value persis via hipergeometrik — tanpa aproksimasi. Tabel jarang (fraud, default langka) adalah kasus klasiknya. Dan ingat analogi ANOVA: chi-square signifikan hanya bilang ada hubungan — tidak bilang di sel mana. Lihat kontribusi (O−E)²/E per sel untuk menemukan sel-sel pencuriga.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Chi-square signifikan berarti tahu kategori mana yang menyebabkan hubungan. Salah — seperti ANOVA, ia hanya bilang ada hubungan. Butuh analisis kontribusi per sel / post-hoc dengan koreksi untuk tahu di mana.",
      },
      reference: "Saat statistiknya tidak standar (rasio, persentil kompleks), bootstrap (A2.9) lebih fleksibel.",
    },
    {
      id: "minicase-kanal",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Median sama belum tentu sama baik",
      prose: [
        "MajuBank mensurvei 300 nasabah (100 per kanal), skor 1–5. Median aplikasi = 4, median cabang = 4, median call center = 3. Tim produk: median aplikasi = cabang, jadi sama baiknya. Distribusi lengkap: aplikasi [15, 30, 55] vs cabang [25, 35, 40] untuk Tidak/Netral/Puas.",
        "(a) Uji: chi-square independensi 3×3 (semua expected ≥ 5) atau Kruskal-Wallis untuk ordinal. χ² ≈ 13,2, df = 4, p ≈ 0,01 → kepuasan berhubungan dengan kanal. (b) Median hanya satu titik potong: aplikasi punya 55% puas vs cabang 40% — pengalaman atas jauh lebih baik di aplikasi. Satu statistik ringkas menyembunyikan bentuk. (c) Lihat kontribusi per sel, uji post-hoc berpasangan (Mann-Whitney + Bonferroni), dan kualitatif: angka bilang di mana, bukan mengapa.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `df` = (3−1)(3−1) untuk tabel 3×3" },
        { id: "t2", text: "Catat `chi2` = 13,2 (dari analisis)" },
        { id: "t3", text: "Hitung `selisih_puas` = 55 − 40 (proporsi puas aplikasi vs cabang)" },
      ],
      expected: "df=4  chi2=13.2  selisih_puas=15",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Median sama → sama baik adalah kesimpulan dari satu titik potong distribusi. Selisih 15 poin pada proporsi puas mengubah prioritas budget perbaikan. Selalu lihat distribusi lengkapnya sebelum alokasi.",
      },
      hints: [
        "df = (3-1)*(3-1).",
        "chi2 = 13.2 dari analisis chi-square.",
        "selisih_puas = 55 - 40.",
      ],
      code: {
        starter: `# survei 3 kanal x 3 kategori kepuasan\n\n# TULIS KODEMU\ndf = \nchi2 = \nselisih_puas = \n\nprint(f"df={df}  chi2={chi2}  selisih_puas={selisih_puas}")`,
        lockLines: 1,
        solution: `# survei 3 kanal x 3 kategori kepuasan\n\n# TULIS KODEMU\ndf = (3-1)*(3-1)\nchi2 = 13.2  # dari analisis; p ~ 0.01\nselisih_puas = 55 - 40\n\nprint(f"df={df}  chi2={chi2}  selisih_puas={selisih_puas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "df", value: 4, tol: 1e-9, label: "`df` seharusnya 4", msg: "df = 4 untuk tabel 3×3." },
          { kind: "equal", task: "t2", name: "chi2", value: 13.2, tol: 0.01, label: "`chi2` seharusnya 13.2", msg: "χ² ≈ 13,2, p ≈ 0,01 → kepuasan berhubungan dengan kanal." },
          { kind: "equal", task: "t3", name: "selisih_puas", value: 15, tol: 1e-9, label: "`selisih_puas` seharusnya 15", msg: "55% vs 40% puas — median yang sama menyembunyikan ini." },
          { kind: "stdout_matches", task: "t3", pattern: "df=4\\s+chi2=13\\.2\\s+selisih_puas=15", label: "`print` menampilkan ketiganya", msg: "Format: df=...  chi2=...  selisih_puas=... ." },
        ],
      },
      reference: "Median = satu titik potong; distribusi = cerita lengkap.",
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
        "Ranking membuang besarnya nilai, mempertahankan urutan — kebal outlier.",
        "Mann-Whitney: dominansi stokastik (bukan sekadar beda median).",
        "Wilcoxon signed-rank untuk desain berpasangan yang tidak normal.",
        "Chi-square untuk tabel kategori; expected ≥ 5 atau pakai Fisher exact.",
        "KS membandingkan seluruh bentuk distribusi, bukan cuma lokasi.",
      ],
      next: { label: "A2.7 — Effect Size", href: "/learn/a27-effect-size" },
      quiz: [
        {
          q: "Mengapa Mann-Whitney kebal terhadap outlier Rp400 juta dalam contoh bonus?",
          options: [
            { text: "Karena outlier dihapus otomatis", why: "Tidak dihapus — ia tetap dihitung, hanya sebagai peringkat." },
            { text: "Karena ia memakai peringkat — Rp400 juta hanya jadi 'peringkat 1', besarnya nilai tidak dihitung", why: "Ranking membuang 'berapa besar', menyisakan 'urutan'.", correct: true },
            { text: "Karena n besar", why: "n=60 bukan besar; kekebalan datang dari ranking." },
            { text: "Karena datanya normal", why: "Datanya justru sangat tidak normal — itu poinnya." },
          ],
        },
        {
          q: "Data kepuasan ordinal (1–5) dua grup. Mengapa uji-t bermasalah secara konsep?",
          options: [
            { text: "Karena n selalu kecil", why: "n bukan masalahnya — skala pengukurannya." },
            { text: "Karena selisih skor (4−3 vs 3−2) belum tentu bermakna sama — mean dari ordinal tidak valid secara ketat", why: "Uji-t mengasumsikan skala interval; ordinal hanya punya urutan.", correct: true },
            { text: "Karena uji-t terlalu lambat", why: "Kecepatan komputasi bukan masalah di sini." },
            { text: "Tidak bermasalah sama sekali", why: "Secara prinsip bermasalah; ranking lebih tepat." },
          ],
        },
        {
          q: "Tabel 2×2 dengan expected count 2,1 di satu sel. Uji yang tepat?",
          options: [
            { text: "Chi-square — selalu valid", why: "Expected < 5 membuat aproksimasi chi-square tidak andal." },
            { text: "Fisher exact — expected < 5 membuat aproksimasi chi-square tidak andal", why: "Fisher menghitung p-value persis via hipergeometrik.", correct: true },
            { text: "Uji-t", why: "Uji-t untuk mean kontinu, bukan tabel kategori." },
            { text: "ANOVA", why: "ANOVA untuk mean 3+ grup kontinu, bukan tabel kategori." },
          ],
        },
        {
          q: "Dua grup punya mean dan median IDENTIK, tapi satu bimodal dan satu unimodal. Uji mana yang paling mungkin mendeteksi perbedaan?",
          options: [
            { text: "Uji-t", why: "Uji-t fokus pada lokasi (mean) — buta terhadap bentuk." },
            { text: "Mann-Whitney", why: "Mann-Whitney fokus pada dominansi — buta terhadap bentuk murni." },
            { text: "Kolmogorov–Smirnov — ia membandingkan seluruh bentuk distribusi (D = celah CDF maksimum), bukan cuma lokasi", why: "KS melihat seluruh CDF sehingga menangkap bimodalitas.", correct: true },
            { text: "Chi-square", why: "Chi-square untuk tabel kategori, bukan perbandingan distribusi kontinu." },
          ],
        },
        {
          q: "Studi sebelum–sesudah (n=25), selisih sangat miring karena 2 pasien ekstrem. Pilihan terbaik?",
          options: [
            { text: "Uji-t berpasangan — n=25 cukup untuk CLT", why: "CLT menolong mean, tapi 2 ekstrem masih mendistorsi pada n=25." },
            { text: "Wilcoxon signed-rank — berpasangan (membuang noise antar-subjek) + ranking (kebal 2 ekstrem)", why: "Memenuhi dua kebutuhan sekaligus: desain berpasangan dan ketahanan.", correct: true },
            { text: "Mann-Whitney", why: "Itu untuk grup independen — desainnya berpasangan." },
            { text: "Chi-square", why: "Chi-square untuk tabel kategori, bukan selisih kontinu." },
          ],
        },
      ],
      note: {
        title: "Intuisi: ranking adalah demokrasi — satu orang satu suara",
        body: "Lima heuristik. Satu: ranking adalah demokrasi — satu observasi satu suara; direktur dengan bonus raksasa tidak mendapat suara ganda; itulah mengapa uji ranking kebal outlier. Dua: harga demokrasi adalah informasi besaran yang dibuang — bila data sebenarnya normal, uji-t lebih powerful; nonparametrik adalah asuransi, bukan default. Tiga: Mann-Whitney menguji dominansi stokastik, bukan beda median — dua distribusi bisa punya median identik tetapi bentuk berbeda, dan uji ini menangkapnya; jangan menyederhanakannya jadi “uji median”. Empat: aturan praktis — n kecil plus tak normal berarti nonparametrik; n besar berarti CLT menyelamatkan uji-t; tabel jarang (expected < 5) berarti Fisher exact, bukan chi-square. Lima: “nonparametrik” bukan berarti “tanpa asumsi” — exchangeability di bawah H0 tetap dituntut; uji permutasi yang labelnya tidak bisa diacak adalah hakim yang tidak adil. Enam: untuk data berpasangan ada padanannya — Wilcoxon signed-rank adalah saudara berpasangan Mann-Whitney; peta pasangannya sederhana: berpasangan pakai selisihnya, independen pakai rankingnya, dan untuk tiga grup atau lebih Kruskal-Wallis menjaga gerbangnya.",
      },
    },
  ],
};
