import type { V2Lesson } from "../lib/types";

export const d3: V2Lesson = {
  slug: "d3-numpy",
  track: "Python",
  module: "NumPy",
  title: "D3 NumPy: Vectorization & Berpikir Array",
  estMinutes: 30,
  steps: [
    {
      id: "vectorization",
      eyebrow: "Langkah 1 · Vectorization",
      title: "Cerita pembuka: loop 8 detik vs 0,05 detik",
      prose: [
        "Seorang analis menghitung rata-rata 10 juta transaksi dengan loop Python: 8 detik. Rekannya memakai NumPy: 0,05 detik — 160x lebih cepat dengan kode lebih pendek. Rahasianya: vectorization, operasi ke seluruh array sekaligus di C yang dikompilasi, bukan per elemen di Python.",
        "Ini cara berpikir baru: berhenti memerintah untuk tiap elemen, lakukan X, mulai memerintah untuk seluruh array, lakukan X. `a + b` bekerja element-wise tanpa loop; `a.sum()`, `a.mean()` adalah agregat vectorized.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `npl` = plafon macet / total plafon (tanpa loop)" },
        { id: "t2", text: "Hitung `rata_macet` dan `rata_lancar`, cetak ketiganya" },
      ],
      expected: "npl=31.72%  macet=57.5  lancar=82.5",
      note: {
        title: "Sering salah",
        body: "Menulis loop `for` di atas array NumPy. Refleks yang benar: saat jari mengetik `for` untuk angka, berhenti dan tanyakan apakah ini operasi array. 95% bisa di-vectorize.",
      },
      hints: [
        "plafon[macet] memilih elemen yang macet (boolean indexing).",
        "npl = plafon[macet].sum() / plafon.sum().",
        "rata_macet = plafon[macet].mean()",
      ],
      code: {
        starter: `import numpy as np\n\nplafon = np.array([50, 100, 30, 200, 75, 40, 60, 90, 25, 55], dtype=float)  # juta\nmacet = np.array([False, True, True, False, True, False, False, False, True, False])\n\n# TULIS KODEMU: tanpa loop!\nnpl = \nrata_macet = \nrata_lancar = \n\nprint(f"npl={npl:.2%}  macet={rata_macet}  lancar={rata_lancar}")`,
        lockLines: 4,
        solution: `import numpy as np\n\nplafon = np.array([50, 100, 30, 200, 75, 40, 60, 90, 25, 55], dtype=float)  # juta\nmacet = np.array([False, True, True, False, True, False, False, False, True, False])\n\n# TULIS KODEMU: tanpa loop!\nnpl = plafon[macet].sum() / plafon.sum()\nrata_macet = plafon[macet].mean()\nrata_lancar = plafon[~macet].mean()\n\nprint(f"npl={npl:.2%}  macet={rata_macet}  lancar={rata_lancar}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npl", value: 0.3172, tol: 0.001, label: "`npl` sekitar 31.72%", msg: "(100+30+75+25) / 725 = 0.3172." },
          { kind: "equal", task: "t2", name: "rata_macet", value: 57.5, tol: 1e-9, label: "`rata_macet` = 57.5", msg: "230 / 4 = 57.5." },
          { kind: "equal", task: "t2", name: "rata_lancar", value: 82.5, tol: 1e-9, label: "`rata_lancar` = 82.5", msg: "495 / 6 = 82.5. ~ membalik mask." },
          { kind: "forbids", task: "t1", token: "for", label: "tanpa loop for", msg: "Langkah ini melatih vectorization — pakai operasi array." },
          { kind: "stdout_matches", task: "t2", pattern: "npl=31\\.72%", label: "`print` menampilkan npl", msg: "Format persen dengan :.2%." },
        ],
      },
      reference: "a + b element-wise. a[mask] = filter. .sum() .mean() .max().",
    },
    {
      id: "broadcasting",
      eyebrow: "Langkah 2 · Broadcasting",
      title: "Shape beda, tetap jalan",
      prose: [
        "Array kecil direntangkan mengikuti yang besar, dari dimensi terakhir: matriks (2,3) tambah vektor (3,) berhasil — tiap baris ditambah vektor itu. Tapi (2,3) tambah (2,) error, karena 2 tidak cocok dengan 3 dari belakang.",
        "Hafalkan: broadcasting cocok dari kanan ke kiri. Jebakan klasik: shape (3,) lawan (3,1) itu beda — pakai `.reshape(-1, 1)` untuk vektor kolom. Saat error, `print(a.shape)` menyelesaikan 80% masalah NumPy.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `mu` = rata-rata tiap kolom (`axis=0`)" },
        { id: "t2", text: "Hitung `Z` = z-score tiap kolom via broadcasting" },
      ],
      expected: "Z_kolom0=[-1.22, 0.0, 1.22]",
      note: {
        title: "Sering salah",
        body: "Mengira (3,) dan (3,1) sama. (3,) adalah vektor baris untuk broadcasting; (3,1) adalah kolom. Salah satunya error atau — lebih buruk — berhasil diam-diam dengan hasil salah. Cek shape sebelum operasi.",
      },
      hints: [
        "mu = X.mean(axis=0) memberi vektor 2 elemen (per kolom).",
        "sd = X.std(axis=0), lalu Z = (X - mu) / sd.",
        "Z[:, 0] adalah kolom pertama hasil standarisasi.",
      ],
      code: {
        starter: `import numpy as np\n\nX = np.array([[10., 5.], [20., 15.], [30., 10.]])  # 3 baris, 2 kolom\n\n# TULIS KODEMU\nmu = \nsd = \nZ = \n\nprint(f"Z_kolom0={[round(v, 2) for v in Z[:, 0]]}")`,
        lockLines: 3,
        solution: `import numpy as np\n\nX = np.array([[10., 5.], [20., 15.], [30., 10.]])  # 3 baris, 2 kolom\n\n# TULIS KODEMU\nmu = X.mean(axis=0)\nsd = X.std(axis=0)\nZ = (X - mu) / sd\n\nprint(f"Z_kolom0={[round(v, 2) for v in Z[:, 0]]}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mu", value: [20.0, 10.0], label: "`mu` = [20, 10]", msg: "Rata-rata per kolom (axis=0)." },
          { kind: "stdout_matches", task: "t2", pattern: "Z_kolom0=\\[-1\\.22, 0\\.0, 1\\.22\\]", label: "`print` menampilkan z-score kolom 0", msg: "(X - mu) / sd dengan broadcasting (3,2) - (2,)." },
        ],
      },
      reference: "axis=0 = per kolom. Broadcasting cocok dari kanan; cek .shape.",
    },
    {
      id: "boolean-indexing",
      eyebrow: "Langkah 3 · Boolean indexing",
      title: "WHERE-nya NumPy",
      prose: [
        "`dpd > 30` menghasilkan array boolean — dipakai sebagai kacamata untuk memfilter: `dpd[dpd > 30]` hanya mengambil yang memenuhi. `mask.sum()` menghitung yang True, karena boolean = 0/1.",
        "Operatornya `&` (and), `|` (or), `~` (not) — dengan kurung, karena prioritas operator. Dan `a[a < 0] = 0` adalah assign bersyarat: semua negatif jadi 0 dalam satu baris — pola cleaning yang sering dipakai.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `pct` = % elemen `dpd` yang di atas 30" },
        { id: "t2", text: "Buat `bersih` = salinan dpd dengan nilai di atas 90 di-cap jadi 90" },
      ],
      expected: "pct=44.44%  max_bersih=90",
      note: {
        title: "Sering salah",
        body: "Menulis `dpd[dpd > 30 and dpd < 90]` dengan `and` Python — error, karena `and` tidak bisa untuk array. Pakai `&` dengan kurung: `(dpd > 30) & (dpd < 90)`.",
      },
      hints: [
        "pct = (dpd > 30).mean() * 100 — boolean.mean() = proporsi True.",
        "Salin dulu: bersih = dpd.copy(), lalu bersih[bersih > 90] = 90.",
        "pct = (dpd > 30).mean() * 100",
      ],
      code: {
        starter: `import numpy as np\n\ndpd = np.array([0, 15, 45, 0, 90, 5, 120, 20, 60])\n\n# TULIS KODEMU\npct = \nbersih = dpd.copy()\n\n\nprint(f"pct={pct:.2f}%  max_bersih={bersih.max()}")`,
        lockLines: 3,
        solution: `import numpy as np\n\ndpd = np.array([0, 15, 45, 0, 90, 5, 120, 20, 60])\n\n# TULIS KODEMU\npct = (dpd > 30).mean() * 100\nbersih = dpd.copy()\nbersih[bersih > 90] = 90\n\nprint(f"pct={pct:.2f}%  max_bersih={bersih.max()}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pct", value: 44.44, tol: 0.01, label: "`pct` sekitar 44.44%", msg: "4 dari 9 elemen di atas 30: 45, 90, 120, 60." },
          { kind: "equal", task: "t2", name: "bersih", value: [0, 15, 45, 0, 90, 5, 90, 20, 60], label: "`bersih` ter-cap di 90", msg: "Hanya 120 yang berubah jadi 90; sisanya tetap." },
          { kind: "stdout_matches", task: "t2", pattern: "max_bersih=90", label: "`print` menampilkan max 90", msg: "Setelah cap, nilai maksimum = 90." },
        ],
      },
      reference: "a[mask] filter; a[kondisi] = v assign bersyarat; & | ~ dengan kurung.",
    },
    {
      id: "random-seed",
      eyebrow: "Langkah 4 · Random & seed",
      title: "Simulasi Monte Carlo dengan seed",
      prose: [
        "Simulasikan 100.000 return harian N(0,1%, 2%) lalu estimasi P(rugi di atas 5%) = proporsi return di bawah -0,05. Dengan `default_rng(42)`, angka acaknya tetap — seed sama berarti hasil sama, hasil bisa direplikasi orang lain.",
        "Aturan simulasi: selalu set seed dan catat di kode. Hasil yang tidak bisa direplikasi tidak bisa dipercaya. Coba ganti seed — P-nya beda tipis, itulah Monte Carlo error.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Simulasikan 100.000 return dan hitung `p_rugi` = P(return < -0.05)" },
        { id: "t2", text: "Cetak `p_rugi` dalam persen 2 desimal" },
      ],
      expected: "p_rugi=0.56%",
      note: {
        title: "Sering salah",
        body: "Memakai `np.random.seed` global lalu heran hasil berubah saat kode dijalankan ulang dalam urutan berbeda. Pakai `default_rng(seed)` — generator modern yang terisolasi per objek.",
      },
      hints: [
        "rng = np.random.default_rng(42); ret = rng.normal(0.001, 0.02, 100_000).",
        "p_rugi = (ret < -0.05).mean().",
        "print(f\"p_rugi={p_rugi:.2%}\")",
      ],
      code: {
        starter: `import numpy as np\n\nrng = np.random.default_rng(42)\n\n# TULIS KODEMU: 100.000 return N(0.001, 0.02), hitung P(rugi > 5%)\nret = \np_rugi = \n\nprint(f"p_rugi={p_rugi:.2%}")`,
        lockLines: 3,
        solution: `import numpy as np\n\nrng = np.random.default_rng(42)\n\n# TULIS KODEMU: 100.000 return N(0.001, 0.02), hitung P(rugi > 5%)\nret = rng.normal(0.001, 0.02, 100_000)\np_rugi = (ret < -0.05).mean()\n\nprint(f"p_rugi={p_rugi:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_rugi", value: 0.00565, tol: 0.0005, label: "`p_rugi` sekitar 0.0057", msg: "Dengan seed 42: (ret < -0.05).mean() = 0.00565." },
          { kind: "stdout_matches", task: "t2", pattern: "p_rugi=0\\.5\\d%", label: "`print` menampilkan persen", msg: "Format persen 2 desimal: sekitar 0.56%." },
        ],
      },
      reference: "default_rng(seed) lalu .normal/.uniform/.binomial. Seed = reproduksibel.",
    },
    {
      id: "minicase-stress",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Stress test portofolio",
      prose: [
        "Portofolio Rp 1 miliar, return harian N(0,05%, 1,5%). Dua pertanyaan: (a) P(rugi di atas Rp 50 juta sehari), (b) VaR 95% satu hari. Jawab dengan simulasi 100.000 skenario: `r = rng.normal(0.0005, 0.015, 100_000)`, lalu `(r < -0.05).mean()` dan `-np.percentile(r, 5) * 1e9`.",
        "Bandingkan dengan rumus: VaR 95% = 1e9 x (1.645 x 0.015 - 0.0005) = Rp 24,2 juta. Simulasi dan rumus saling memverifikasi — dua alat, satu kebenaran. Selisih kecil di antaranya adalah Monte Carlo error, bukan kesalahan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "VaR dari simulasi vs rumus harus berdekatan. Jika jauh berbeda, salah satunya salah — biasanya asumsi distribusi. Jangan pernah melaporkan angka risiko dari satu metode tanpa pembanding.",
      },
      reference: "VaR 95% = -persentil 5% dari distribusi P&L. Simulasi memverifikasi rumus.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Intuisi: berpikir dalam array, bukan dalam elemen",
      prose: [
        "Perpindahan mental tersulit dari Python murni ke numpy: berhenti memikirkan elemen satu per satu, mulai memikirkan seluruh array sekaligus.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: berpikir dalam array, bukan dalam elemen",
        body: "Loop Python di atas array numpy adalah code smell — bukan karena selalu salah, melainkan karena hampir selalu ada cara vektorisasi yang 10–100× lebih cepat DAN lebih pendek. Heuristik senior: bila jarimu mengetik for untuk mengolah angka, berhentilah dan tanyakan operasi array apa yang sebenarnya kamu maksud — mask, agregasi, atau broadcasting. Broadcasting adalah sumber bug senyap nomor satu: array bentuk (n,) dan (n,1) terlihat sama saat dicetak tetapi berperilaku beda saat dioperasikan — biasakan cetak .shape sebelum operasi antar-array, bukan sesudah error. Heuristik kedua: view vs copy — slicing numpy memberi VIEW (mengubah slice mengubah aslinya), boolean indexing memberi COPY. Bila ragu, panggil .copy() eksplisit; memori yang sedikit boros jauh lebih murah dari bug yang mengubah data sumber diam-diam. Heuristik ketiga: setiap hasil stokastik tanpa seed bukan hasil — melainkan anekdot. Tetapkan default_rng(seed) di awal agar simulasimu bisa direproduksi, diaudit, dan diperdebatkan. Dan trade-off yang jarang diakui: vektorisasi ekstrem bisa mengorbankan keterbacaan — bila satu baris numpy butuh 5 menit dipahami, pecah jadi 3 baris bernama jelas; kecepatan yang tidak bisa dirawat akan ditulis ulang.",
      },
      reference: "for di atas array = code smell; cek .shape dulu; view vs copy; seed untuk reproduksibilitas; keterbacaan > golf.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Vectorization cepat karena...",
          options: [
            { text: "Python-nya lebih cepat", why: "Tidak — Python-nya sama. Yang cepat adalah loop di C." },
            { text: "Operasi di C terkompilasi sekaligus, bukan loop Python", why: "Loop berjalan di C yang dikompilasi — beda orde kecepatan.", correct: true },
            { text: "Array lebih kecil", why: "Ukuran data sama; yang beda cara komputasinya." },
            { text: "NumPy memakai GPU", why: "Tidak otomatis — NumPy standar berjalan di CPU." },
          ],
        },
        {
          q: "X.shape = (5, 3), v.shape = (3,). X + v...",
          options: [
            { text: "Bisa — v direntangkan ke 5 baris", why: "Broadcasting cocok dari kanan: (3,) pas dengan dimensi terakhir (5,3).", correct: true },
            { text: "Error", why: "Tidak — (5,3) + (3,) valid." },
            { text: "Bisa tapi hasilnya (3,)", why: "Hasilnya tetap (5,3)." },
            { text: "Bisa hanya jika v di-transpose", why: "Tidak perlu — (3,) sudah cocok dari kanan." },
          ],
        },
        {
          q: "Untuk AND di boolean indexing...",
          options: [
            { text: "and", why: "and Python tidak bisa untuk array — error." },
            { text: "& dengan kurung", why: "& bitwise dengan kurung: (a > 1) & (b < 2).", correct: true },
            { text: "&&", why: "Itu sintaks bahasa lain, bukan Python." },
            { text: "+", why: "+ menjumlahkan, bukan logika AND." },
          ],
        },
        {
          q: "Seed dalam simulasi untuk...",
          options: [
            { text: "Kecepatan", why: "Seed tidak memengaruhi kecepatan." },
            { text: "Reproduksibilitas — hasil sama tiap run", why: "Seed sama = angka sama = hasil bisa direplikasi dan dipercaya.", correct: true },
            { text: "Keamanan", why: "Tidak ada hubungannya dengan keamanan." },
            { text: "Tidak penting", why: "Tanpa seed, hasil tak bisa direplikasi = tak bisa dipercaya." },
          ],
        },
      ],
      summary: [
        "Vectorization: operasi array sekaligus di C — berhenti loop untuk numerik.",
        "Broadcasting: cocokkan shape dari kanan; cek .shape saat error.",
        "Boolean indexing: filter dan assign bersyarat; & | ~ dengan kurung.",
        "Random: default_rng(seed) — simulasi selalu reproduksibel.",
        "NumPy adalah mesin di dalam pandas.",
      ],
      next: { label: "D4 — pandas Dasar", href: "/v2/learn/d4-pandas-dasar" },
    },
  ],
};
