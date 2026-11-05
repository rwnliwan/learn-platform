import type { V2Lesson } from "../lib/types";

export const d13: V2Lesson = {
  slug: "d13-performa",
  track: "Python",
  module: "Performa",
  title: "D13 Performa: Python Cepat untuk Data Besar",
  estMinutes: 55,
  steps: [
    {
      id: "ukur",
      eyebrow: "Langkah 1 · Ukur dulu",
      title: "Cerita pembuka: 30 menit jadi 45 detik",
      prose: [
        "Skrip agregasi 2 juta transaksi jalan 30 menit. Profiling menunjukkan 29 menit dihabiskan satu loop `iterrows`. Diganti `groupby` vectorized: 45 detik. Pelajaran: optimasi tanpa ukur adalah tebak-tebakan — `%%timeit` dan `cProfile` dulu, baru sentuh kode.",
        "Tiga level optimasi: (1) algoritma — O(n²) ke O(n log n); (2) vectorize — numpy/pandas bukan loop Python; (3) paralel/chunk — hanya jika level 1-2 tidak cukup. Kebanyakan kasus selesai di level 2.",
      ],
      tasks: [],
      reference: "Ukur -> algoritma -> vectorize -> chunk. Jangan optimasi yang belum diukur.",
    },
    {
      id: "vectorize",
      eyebrow: "Langkah 2 · Vectorize",
      title: "Loop Python vs operasi array",
      prose: [
        "Loop Python 100.000 iterasi: lambat karena tiap iterasi adalah overhead interpreter. `chunk.sum()` di numpy: loop-nya di C, ribuan kali lebih cepat. Aturannya: jika kamu menulis `for` di atas array, hampir pasti ada cara vectorized.",
        "Untuk data yang tidak muat di memori sekaligus: proses per chunk (di sini 10 chunk x 10.000) dan agregat hasilnya. Pola ini skala ke jutaan baris tanpa menambah RAM.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Jumlahkan 100.000 nilai per chunk 10.000 → `total`, `n`" },
        { id: "t2", text: "Hitung `rata` = total / n" },
      ],
      expected: "total=49957670697.2  n=100000  rata=499576.7",
      note: {
        title: "Sering salah",
        body: "Menjumlahkan float dalam urutan berbeda memberi hasil sedikit berbeda (floating point tidak asosiatif). Untuk uang, pertimbangkan Decimal atau hitung dalam satuan terkecil (sen). Di sini toleransi kecil wajar.",
      },
      hints: [
        "for _ in range(10): chunk = rng.uniform(1000, 1000000, 10_000).",
        "total += chunk.sum(); n += len(chunk).",
        "rata = total / n",
      ],
      code: {
        starter: `import numpy as np\n\nrng = np.random.default_rng(3)\n\n# TULIS KODEMU: jumlahkan 100.000 transaksi per chunk\ntotal = 0.0\nn = 0\nfor _ in range(10):\n    chunk = \n    total += \n    n += \nrata = \n\nprint(f"total={total:.1f}  n={n}  rata={rata:.1f}")`,
        lockLines: 3,
        solution: `import numpy as np\n\nrng = np.random.default_rng(3)\n\n# TULIS KODEMU: jumlahkan 100.000 transaksi per chunk\ntotal = 0.0\nn = 0\nfor _ in range(10):\n    chunk = rng.uniform(1000, 1000000, 10_000)\n    total += chunk.sum()\n    n += len(chunk)\nrata = total / n\n\nprint(f"total={total:.1f}  n={n}  rata={rata:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 49957670697.2, tol: 1.0, label: "`total` sekitar 49957670697.2", msg: "Jumlah 100.000 transaksi uniform." },
          { kind: "equal", task: "t1", name: "n", value: 100000, tol: 1e-9, label: "`n` = 100000", msg: "10 chunk x 10.000." },
          { kind: "equal", task: "t2", name: "rata", value: 499576.7, tol: 1.0, label: "`rata` sekitar 499576.7", msg: "Rata-rata uniform(1000, 1000000) ~ 500.500." },
          { kind: "stdout_matches", task: "t2", pattern: "total=49957670697\\.2\\s+n=100000\\s+rata=499576\\.7", label: "`print` menampilkan ketiganya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "for di atas array = bau. Vectorize (numpy/pandas); chunk jika tak muat RAM.",
    },
    {
      id: "pandas-cepat",
      eyebrow: "Langkah 3 · pandas",
      title: "`iterrows` adalah jebakan",
      prose: [
        "`iterrows` 5.000 baris terasa cepat; 2 juta baris = 30 menit. `groupby(...).sum()` melakukan hal sama dalam detik. Verifikasi di sini: jumlah per kota dari loop dan dari groupby harus sama persis.",
        "Teknik pandas cepat: `groupby`/`merge`/`pivot` vectorized, `query()` untuk filter, hindari `apply` dengan fungsi Python (itu loop tersamar), pakai tipe kategorikal untuk kolom berulang.",
      ],
      requires: ["pandas", "numpy"],
      tasks: [
        { id: "t1", text: "Jumlahkan per kota dengan loop `iterrows` → `s_loop`" },
        { id: "t2", text: "Jumlahkan dengan `groupby` → `s_vec`, bandingkan (`sama`)" },
      ],
      expected: "sama=True  n_kota=3",
      note: {
        title: "Sering salah",
        body: "`apply` dengan lambda Python terasa vectorized — bukan. Itu loop dengan baju bagus. Selalu cari padanan vectorized (groupby, where, str accessor) sebelum apply.",
      },
      hints: [
        "for _, r in df.iterrows(): s_loop[r['kota']] = s_loop.get(r['kota'], 0) + r['jumlah'].",
        "s_vec = df.groupby('kota')['jumlah'].sum().",
        "sama = all(abs(s_loop[k] - s_vec[k]) < 1e-6 for k in s_loop)",
      ],
      code: {
        starter: `import pandas as pd, numpy as np\n\nrng = np.random.default_rng(9)\ndf = pd.DataFrame({\n    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya"], 5000),\n    "jumlah": rng.uniform(1000, 100000, 5000)})\n\n# TULIS KODEMU\ns_loop = {}\nfor _, r in df.iterrows():\n    \ns_vec = \nsama = \nn_kota = \n\nprint(f"sama={sama}  n_kota={n_kota}")`,
        lockLines: 6,
        solution: `import pandas as pd, numpy as np\n\nrng = np.random.default_rng(9)\ndf = pd.DataFrame({\n    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya"], 5000),\n    "jumlah": rng.uniform(1000, 100000, 5000)})\n\n# TULIS KODEMU\ns_loop = {}\nfor _, r in df.iterrows():\n    s_loop[r["kota"]] = s_loop.get(r["kota"], 0) + r["jumlah"]\ns_vec = df.groupby("kota")["jumlah"].sum()\nsama = all(abs(s_loop[k] - s_vec[k]) < 1e-6 for k in s_loop)\nn_kota = len(s_vec)\n\nprint(f"sama={sama}  n_kota={n_kota}")`,
        checks: [
          { kind: "equal", task: "t2", name: "sama", value: true, label: "`sama` = True", msg: "Loop dan groupby memberi hasil identik." },
          { kind: "equal", task: "t2", name: "n_kota", value: 3, tol: 1e-9, label: "`n_kota` = 3", msg: "Tiga kota." },
          { kind: "stdout_matches", task: "t2", pattern: "sama=True\\s+n_kota=3", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "groupby/merge/pivot > apply > iterrows. Selalu.",
    },
    {
      id: "memori",
      eyebrow: "Langkah 4 · Memori",
      title: "Data besar, RAM kecil",
      prose: [
        "Out of memory sebelum lambat: `pd.read_csv` 5 juta baris bisa makan 2 GB. Trik: `dtype` hemat (`float32` bukan `float64`, `category` untuk kolom berulang — hemat 10x), baca kolom yang perlu saja (`usecols`), proses per chunk (`chunksize`).",
        "Paralelisasi adalah level terakhir: `multiprocessing` untuk CPU-bound, tapi overhead-nya besar untuk tugas kecil. Numba (`@jit`) mengkompilasi loop numerik ke kecepatan C — berguna saat vectorize tidak memungkinkan.",
      ],
      tasks: [],
      reference: "dtype hemat + usecols + chunksize. Paralel/numba hanya jika perlu.",
    },
    {
      id: "advanced-profiling",
      eyebrow: "Langkah 5 · Advanced",
      requires: ["numpy"],
      title: "Advanced: profiling dulu — vektorisasi yang terukur",
      prose: [
        "Aturan pertama optimasi yang tidak bisa ditawar: UKUR DULU. `cProfile` (stdlib) menunjukkan di FUNGSI mana waktumu habis — dan 90% kasus jawabannya satu hotspot, bukan 'kode yang lambat secara umum'. Polanya: `python -m cProfile -s cumulative script.py` untuk gambaran, lalu optimasi HANYA hotspot-nya. Analis yang menebak ('kayaknya bagian groupby yang lambat') mengoptimasi bagian yang salah 8 dari 10 kali — profiler tidak pernah salah tebak.",
        "Setelah hotspot ketemu, senjata utamanya tetap vektorisasi: ganti loop Python dengan operasi array numpy — loop 200 ribu elemen yang 31× lebih lambat di lab ini adalah pola yang sama dengan ETL 45 menit di mini-case. Tetapi ada disiplinnya: (1) buktikan HASIL SAMA sebelum dan sesudah (assert selisih < toleransi) — optimasi yang mengubah jawaban bukan optimasi; (2) laporkan speedup sebagai ANGKA, bukan perasaan ('31× lebih cepat', bukan 'jauh lebih cepat') — angka membuat keputusan ('apakah 2 jam optimasi terbayar?') menjadi hitungan, bukan debat; (3) berhenti saat cukup cepat — pipeline 8 detik tidak perlu dioptimasi menjadi 2 detik bila SLA-nya 1 jam; optimasi berlebih adalah waktu yang dicuri dari pekerjaan yang benar-benar penting.",
        "Praktik di lab: ukur loop vs vektorisasi untuk jumlah kuadrat 200 ribu angka, hitung speedup-nya, dan buktikan hasilnya identik. Coba: naikkan ke 2 juta elemen — bagaimana speedup berubah? (Ekspektasi: overhead Python per elemen konstan, jadi selisih MELEBAR — inilah mengapa loop 'tidak apa-apa untuk data kecil' menjadi bencana untuk data besar.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi versi loop: jumlahkan `x*x` untuk tiap `x` di `a`, catat `t_loop`" },
        { id: "t2", text: "Lengkapi versi vektor: `np.sum(a*a)`, catat `t_vec`; hitung `speedup` dan buktikan `sama`" },
      ],
      expected: "lebih_cepat=True, speedup puluhan x, hasil_sama=True",
      hints: [
        "Loop: total = 0.0; for x in a: total += x * x — catat waktu dengan time.perf_counter().",
        "Vektor: total_v = float(np.sum(a * a)).",
        "speedup = t_loop / t_vec; sama = abs(total - total_v) < 1e-6.",
      ],
      code: {
        starter: `import time\\nimport numpy as np\\n\\nrng = np.random.default_rng(9)\\na = rng.normal(0, 1, 200_000)  # 200 ribu angka\\nprint("n:", len(a))\\n\\n# TULIS KODEMU: bandingkan loop Python vs vektorisasi numpy\\n# VERSI LAMBAT: loop Python (pola yang ditemukan profiler di hotspot)\\nt0 = time.perf_counter()\\ntotal = 0.0\\n\\nt_loop = time.perf_counter() - t0\\n\\n# VERSI CEPAT: vektorisasi — satu operasi atas seluruh array\\nt0 = time.perf_counter()\\ntotal_v =\\nt_vec = time.perf_counter() - t0\\n\\nlebih_cepat = t_vec < t_loop\\nspeedup = t_loop / t_vec\\nsama = abs(total - total_v) < 1e-6\\nprint(f"loop={t_loop:.3f}s vektor={t_vec:.3f}s speedup={speedup:.0f}x")\\nprint(f"lebih_cepat={lebih_cepat} hasil_sama={sama}")\\n`,
        lockLines: 6,
        solution: `import time\\nimport numpy as np\\n\\nrng = np.random.default_rng(9)\\na = rng.normal(0, 1, 200_000)  # 200 ribu angka\\nprint("n:", len(a))\\n\\n# TULIS KODEMU: bandingkan loop Python vs vektorisasi numpy\\n# VERSI LAMBAT: loop Python (pola yang ditemukan profiler di hotspot)\\nt0 = time.perf_counter()\\ntotal = 0.0\\nfor x in a:\\n    total += x * x\\nt_loop = time.perf_counter() - t0\\n\\n# VERSI CEPAT: vektorisasi — satu operasi atas seluruh array\\nt0 = time.perf_counter()\\ntotal_v = float(np.sum(a * a))\\nt_vec = time.perf_counter() - t0\\n\\nlebih_cepat = t_vec < t_loop\\nspeedup = t_loop / t_vec\\nsama = abs(total - total_v) < 1e-6\\nprint(f"loop={t_loop:.3f}s vektor={t_vec:.3f}s speedup={speedup:.0f}x")\\nprint(f"lebih_cepat={lebih_cepat} hasil_sama={sama}")\\n`,
        checks: [
          { kind: "defined", task: "t1", name: "t_loop", label: "`t_loop` terdefinisi", msg: "Catat waktu loop dengan perf_counter sebelum/sesudah." },
          { kind: "equal", task: "t2", name: "lebih_cepat", value: true, tol: 0, label: "`lebih_cepat` = True", msg: "Vektorisasi numpy hampir selalu menang atas loop Python." },
          { kind: "equal", task: "t2", name: "sama", value: true, tol: 0, label: "`sama` = True", msg: "Optimasi tidak boleh mengubah jawaban — buktikan identik." },
          { kind: "stdout_matches", task: "t2", pattern: "lebih_cepat=True", label: "Hasil tercetak", msg: "Format: lebih_cepat=True hasil_sama=True." },
        ],
      },
      reference: "cProfile dulu, tebak kemudian. Optimasi = hasil sama + speedup berangka. Berhenti saat cukup cepat.",
    },
    {
      id: "advanced-memori",
      eyebrow: "Langkah 6 · Advanced",
      requires: ["pandas", "numpy"],
      title: "Advanced: memori sebagai anggaran — downcasting & chunking",
      prose: [
        "Memori adalah anggaran, bukan keluhan: DataFrame 200 ribu baris × 3 kolom di lab ini makan 14,4 MB — 82% di antaranya bisa dihemat dengan memilih dtype yang jujur. Tiga teknik. Pertama, DOWNCASTING numerik: `pd.to_numeric(s, downcast='integer')` menurunkan int64 ke int32/int16 bila nilainya muat — id 0–1 juta tidak butuh 64 bit. Kedua, CATEGORICAL untuk string berulang: 5 nama kota disimpan sebagai kode integer + kamus 5 string, bukan 200 ribu string Python. Ketiga, CHUNKING untuk file lebih besar dari RAM: `pd.read_csv(..., chunksize=50_000)` memproses per potongan dengan memori datar — agregat sederhana (count, sum, mean via bobot) diakumulasi per chunk.",
        "Tetapi setiap penghematan punya harga — inilah trade-off yang membedakan praktisi. Downcasting: VALIDASI RENTANG DULU — int16 menampung maks 32.767; satu nilai 100.000 yang lolos menjadi overflow diam-diam (atau error, tergantung) — cek `s.min()/s.max()` sebelum downcast, dan dokumentasikan asumsi rentangnya. float32 mengorbankan presisi (~7 digit desimal): cukup untuk gaji, BERBAHAYA untuk uang yang diakumulasi jutaan kali (error pembulatan menumpuk). Chunking: operasi GLOBAL (sort, dedup, median eksak) tidak bisa per-chunk tanpa strategi dua-pass — putuskan: agregat di database (GROUP BY) atau terima aproksimasi. Aturan: hemat memori di kolom yang PASTI aman (id, kode, kategori), jangan di kolom uang yang diakumulasi.",
        "Praktik di lab: turunkan dtype tiga kolom, ukur penghematan 82% — lalu perhatikan gaji TETAP float64 (downcast float hanya turun bila presisinya aman). Coba: ubah gaji menjadi float32 manual via astype dan bandingkan totalnya vs float64 — berapa selisih akumulasinya? Itulah harga presisi yang harus kamu putuskan sadar, bukan kebetulan.",
      ],
      tasks: [
        { id: "t1", text: "Downcast `id` (integer) dan `gaji` (float), ubah `kota` jadi `category`" },
        { id: "t2", text: "Hitung `mem_akhir` dan `hemat`, cetak keduanya + dtypes akhir" },
      ],
      expected: "hemat sekitar 82% (14.4MB -> 2.6MB)",
      hints: [
        "pd.to_numeric(df['id'], downcast='integer'); pd.to_numeric(df['gaji'], downcast='float').",
        "df['kota'] = df['kota'].astype('category').",
        "hemat = 1 - mem_akhir / mem_awal; cetak dengan format {hemat:.0%}.",
      ],
      code: {
        starter: `import pandas as pd\\nimport numpy as np\\n\\nrng = np.random.default_rng(5)\\nn = 200_000\\ndf = pd.DataFrame({\\n    "id": rng.integers(0, 1_000_000, n),\\n    "gaji": rng.normal(9_000_000, 2_000_000, n),\\n    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar"], n),\\n})\\nmem_awal = df.memory_usage(deep=True).sum() / 1e6\\nprint(f"mem_awal={mem_awal:.1f}MB")\\nprint("dtypes awal:", dict(df.dtypes.astype(str)))\\n\\n# TULIS KODEMU: turunkan dtype tanpa mengubah makna data\\ndf["id"] =\\ndf["gaji"] =\\ndf["kota"] =\\n\\nmem_akhir = df.memory_usage(deep=True).sum() / 1e6\\nhemat = 1 - mem_akhir / mem_awal\\nprint(f"mem_akhir={mem_akhir:.1f}MB hemat={hemat:.0%}")\\nprint("dtypes akhir:", dict(df.dtypes.astype(str)))\\n`,
        lockLines: 12,
        solution: `import pandas as pd\\nimport numpy as np\\n\\nrng = np.random.default_rng(5)\\nn = 200_000\\ndf = pd.DataFrame({\\n    "id": rng.integers(0, 1_000_000, n),\\n    "gaji": rng.normal(9_000_000, 2_000_000, n),\\n    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar"], n),\\n})\\nmem_awal = df.memory_usage(deep=True).sum() / 1e6\\nprint(f"mem_awal={mem_awal:.1f}MB")\\nprint("dtypes awal:", dict(df.dtypes.astype(str)))\\n\\n# TULIS KODEMU: turunkan dtype tanpa mengubah makna data\\ndf["id"] = pd.to_numeric(df["id"], downcast="integer")   # int64 -> int32\\ndf["gaji"] = pd.to_numeric(df["gaji"], downcast="float") # float64 -> float32/64\\ndf["kota"] = df["kota"].astype("category")               # object -> category\\n\\nmem_akhir = df.memory_usage(deep=True).sum() / 1e6\\nhemat = 1 - mem_akhir / mem_awal\\nprint(f"mem_akhir={mem_akhir:.1f}MB hemat={hemat:.0%}")\\nprint("dtypes akhir:", dict(df.dtypes.astype(str)))\\n`,
        checks: [
          { kind: "defined", task: "t1", name: "mem_akhir", label: "`mem_akhir` terdefinisi", msg: "Hitung memory_usage(deep=True) setelah downcasting." },
          { kind: "stdout_matches", task: "t2", pattern: "hemat=82%", label: "Hemat 82% tercetak", msg: "14.4MB -> 2.6MB: downcasting + categorical." },
          { kind: "stdout_matches", task: "t2", pattern: "category", label: "kota jadi category", msg: "Kolom kota harus bertipe category di dtypes akhir." },
        ],
      },
      reference: "Downcast: cek min/max dulu; float32 vs akumulasi uang; chunking untuk >RAM; operasi global butuh strategi.",
    },
    {
      id: "minicase-loop",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: loop 45 menit yang menjadi 8 detik",
      prose: [
        "Skenario (angka konkret): ETL harian bank memproses 2 juta baris transaksi — dihitung dengan `iterrows` + logika Python per baris. Waktu jalan: 45 menit, dan 2× seminggu mepet SLA laporan jam 8 pagi. Usulan awal: tambah server (Rp 6 juta/bulan). Seorang analis menjalankan cProfile: 98% waktu di SATU loop. Ia menulis ulang loop itu menjadi operasi vektorisasi numpy/pandas — tanpa mengubah logika bisnis. Hasil: 8 detik di mesin yang sama. Speedup 337×. Proposal server dibatalkan; analisnya dipromosikan (bagian terakhir mungkin hiperbola — tetapi penghematannya nyata).",
        "Pertanyaan analisis: (1) Mengapa profiler langkah pertama yang benar, bukan tebakan? (2) Bagaimana memastikan penulisan ulang tidak mengubah hasil? (3) Kapan berhenti mengoptimasi?",
        "Pembahasan: (1) Tanpa profiler, 'bagian yang lambat' adalah tebakan — dan tebakan salah 8 dari 10 kali; cProfile menunjukkan 98% di satu loop, sehingga 2 jam kerja difokuskan tepat sasaran. (2) Golden test: jalankan versi lama dan baru pada sampel (mis. 10 ribu baris), assert hasilnya identik dalam toleransi — optimasi tanpa bukti kesetaraan adalah refactor buta. (3) Berhenti saat SLA terpenuhi dengan margin nyaman: 8 detik untuk SLA 1 jam sudah cukup; mengejar 2 detik adalah waktu yang dicuri dari pekerjaan lain. Optimasi adalah anggaran, bukan hobi.",
        "Kaitan ke karier: 'tambah server' adalah jawaban termahal untuk masalah termurah. Kemampuan membaca profiler + menulis ulang satu hotspot adalah skill dengan ROI tertinggi di seluruh track ini.",
      ],
      tasks: [],
      reference: "Profiler dulu (98% di satu loop). Golden test: hasil identik. Berhenti saat SLA terpenuhi.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: ukur dulu, tebak kemudian — dan berhenti saat cukup",
      prose: [
        "Heuristik penutup: kecepatan adalah fitur, tetapi optimasi adalah anggaran — belanjakan di tempat yang terukur.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ukur dulu, tebak kemudian — dan berhenti saat cukup",
        body: "Heuristik pertama: profiler sebelum teori — 'kayaknya yang lambat bagian X' salah 8 dari 10 kali; 10 menit cProfile mengalahkan 2 jam menebak. Optimasi dimulai dari ANGKA (di mana 90% waktu habis), bukan dari perasaan. Heuristik kedua: vektorisasi adalah default, loop adalah pengecualian yang butuh alasan tertulis — setiap loop Python di atas array adalah hotspot yang menunggu ditemukan. Heuristik ketiga: setiap optimasi membawa bukti kesetaraan — assert hasil lama vs baru dalam toleransi; optimasi yang mengubah jawaban adalah bug yang cepat. Heuristik keempat: laporkan speedup sebagai angka ('337×', bukan 'jauh lebih cepat') — angka mengubah debat menjadi hitungan: apakah 2 jam kerja terbayar oleh penghematan ini? Heuristik kelima: berhenti saat SLA terpenuhi dengan margin — pipeline 8 detik untuk SLA 1 jam tidak perlu jadi 2 detik; sisa waktumu lebih berharga di tempat lain. Dan untuk memori: dtype adalah kontrak tentang rentang dan presisi — downcast hanya setelah cek min/max; hemat 82% di kolom id/kategori, tetapi jangan korbankan presisi di kolom uang yang diakumulasi jutaan kali.",
      },
      reference: "Profiler dulu; loop butuh alasan; bukti kesetaraan; speedup berangka; berhenti saat SLA terpenuhi; dtype = kontrak.",
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
          q: "Langkah pertama optimasi...",
          options: [
            { text: "Tulis ulang dengan numba", why: "Prematur — ukur dulu." },
            { text: "Ukur (profiling) lalu perbaiki algoritma", why: "Optimasikan yang terbukti lambat.", correct: true },
            { text: "Paralelkan semua", why: "Overhead besar; level terakhir." },
            { text: "Beli RAM", why: "Bukan solusi teknik." },
          ],
        },
        {
          q: "for di atas array numpy sebaiknya...",
          options: [
            { text: "Dibiarkan", why: "Overhead interpreter tiap iterasi." },
            { text: "Diganti operasi vectorized", why: "Loop di C, ribuan kali lebih cepat.", correct: true },
            { text: "Diparalel", why: "Paralel level terakhir, bukan pertama." },
            { text: "Dihapus", why: "Logikanya dibutuhkan — caranya yang diganti." },
          ],
        },
        {
          q: "CSV 5 juta baris, RAM kecil...",
          options: [
            { text: "Baca semua sekaligus", why: "OOM sebelum selesai." },
            { text: "chunksize + dtype hemat + usecols", why: "Kombinasi standar data > RAM.", correct: true },
            { text: "iterrows", why: "Masih butuh baca semua dulu." },
            { text: "Tidak bisa diproses", why: "Bisa — dengan chunking." },
          ],
        },
        {
          q: "`apply` dengan lambda Python...",
          options: [
            { text: "Vectorized", why: "Bukan — itu loop tersamar." },
            { text: "Loop tersamar — cari padanan vectorized", why: "groupby/where/str accessor lebih cepat.", correct: true },
            { text: "Selalu cukup cepat", why: "Untuk jutaan baris tidak." },
            { text: "Dilarang", why: "Tidak dilarang — tapi bukan yang tercepat." },
          ],
        },
      ],
      summary: [
        "Ukur dulu (timeit/cProfile); optimasi = algoritma -> vectorize -> chunk.",
        "for di atas array = bau; numpy/pandas vectorized.",
        "iterrows/apply lambat di skala besar; groupby solusinya.",
        "RAM: dtype hemat, usecols, chunksize.",
        "Paralel/numba = level terakhir.",
      ],
      next: { label: "D14 — Rekayasa", href: "/learn/d14-rekayasa" },
    },
  ],
};
