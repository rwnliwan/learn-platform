import type { V2Lesson } from "../lib/types";

export const d6: V2Lesson = {
  slug: "d6-wrangling",
  track: "Python",
  module: "pandas",
  title: "D6 Wrangling: Merge, GroupBy, Pivot & Reshape",
  estMinutes: 55,
  steps: [
    {
      id: "merge",
      eyebrow: "Langkah 1 · merge",
      title: "Cerita pembuka: tiga file, satu jawaban",
      prose: [
        "Data tersebar: nasabah.csv, transaksi.csv, kredit.csv. Pertanyaan — rata-rata transaksi per kota untuk nasabah yang punya kredit macet — butuh ketiganya. Wrangling adalah seni menggabung dan membentuk data: merge (JOIN-nya pandas), groupby (GROUP BY-nya), pivot (reshape).",
        "Jika kamu kuasai SQL, ini terasa seperti terjemahan: konsep sama, sintaks beda. Tapi fan-out ikut diterjemahkan — merge yang salah menggandakan baris sama diam-diamnya. Senjata: `validate='1:m'` melempar error jika relasi bukan 1-ke-banyak, dan `indicator=True` mengaudit asal tiap baris.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Merge `nasabah` + `kredit` (left) dengan `validate='1:m'`, hitung `n_baris`" },
        { id: "t2", text: "Hitung `total_bdg` = total plafon kota Bandung" },
      ],
      expected: "n_baris=4  total_bdg=130000000",
      note: {
        title: "Sering salah",
        body: "Merge tanpa cek duplikat key di kedua sisi. Key benar tidak berarti relasi benar: duplikat tak disengaja di kedua sisi meledakkan baris (m:m). Cek `df.duplicated(key).sum()` di kedua sisi sebelum merge.",
      },
      hints: [
        "pd.merge(nasabah, kredit, left_on='id', right_on='nasabah_id', how='left', validate='1:m').",
        "n_baris = len(g).",
        "total_bdg = g[g['kota'] == 'Bandung']['plafon'].sum()",
      ],
      code: {
        starter: `import pandas as pd, io\n\nnasabah = pd.read_csv(io.StringIO("""id,nama,kota\n1,Andi,Jakarta\n2,Budi,Bandung\n3,Citra,Jakarta"""))\nkredit = pd.read_csv(io.StringIO("""id,nasabah_id,plafon,kolektibilitas\n1,1,50000000,1\n2,2,100000000,2\n3,2,30000000,3\n4,3,30000000,1"""))\n\n# TULIS KODEMU\ng = \nn_baris = \ntotal_bdg = \n\nprint(f"n_baris={n_baris}  total_bdg={total_bdg:.0f}")`,
        lockLines: 7,
        solution: `import pandas as pd, io\n\nnasabah = pd.read_csv(io.StringIO("""id,nama,kota\n1,Andi,Jakarta\n2,Budi,Bandung\n3,Citra,Jakarta"""))\nkredit = pd.read_csv(io.StringIO("""id,nasabah_id,plafon,kolektibilitas\n1,1,50000000,1\n2,2,100000000,2\n3,2,30000000,3\n4,3,30000000,1"""))\n\n# TULIS KODEMU\ng = pd.merge(nasabah, kredit, left_on="id", right_on="nasabah_id", how="left", validate="1:m")\nn_baris = len(g)\ntotal_bdg = g[g["kota"] == "Bandung"]["plafon"].sum()\n\nprint(f"n_baris={n_baris}  total_bdg={total_bdg:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_baris", value: 4, tol: 1e-9, label: "`n_baris` = 4", msg: "Left merge: 1 nasabah -> banyak kredit; Budi punya 2 kredit." },
          { kind: "equal", task: "t2", name: "total_bdg", value: 130000000, tol: 1e-9, label: "`total_bdg` = 130000000", msg: "100jt + 30jt = 130jt (plafon granularitas kredit, aman)." },
          { kind: "stdout_matches", task: "t2", pattern: "n_baris=4\\s+total_bdg=130000000", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "pd.merge(..., how='inner'/'left', validate='1:m'). Cek duplicated key di kedua sisi.",
    },
    {
      id: "groupby",
      eyebrow: "Langkah 2 · GroupBy",
      title: "Split-apply-combine",
      prose: [
        "GroupBy adalah GROUP BY-nya pandas: pecah berdasar grup, terapkan agregat, gabungkan kembali. `df.groupby('kota')['penghasilan'].mean()` — analogi SQL langsung. Named aggregation memberi nama kolom baru: `.agg(n=('nama','count'), rata=('penghasilan','mean'))`.",
        "`transform` adalah window function pandas: `df['rata_kota'] = df.groupby('kota')['plafon'].transform('mean')` menulis rata-rata grup ke tiap baris tanpa melipat. Beda dengan `agg` yang melipat jadi 1 baris per grup.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `total_jkt` = total plafon kota Jakarta via groupby" },
        { id: "t2", text: "Tambahkan `rata_kota` via transform, ambil `rata_baris0`" },
      ],
      expected: "total_jkt=80000000  rata_baris0=40000000",
      note: {
        title: "Sering salah",
        body: "Menghitung rata-rata per nasabah SETELAH merge 1-ke-banyak tanpa sadar fan-out: baris nasabah terganda sebanyak kreditnya. Agregat dulu di sisi yang benar, baru merge — atau pakai transform yang tidak melipat.",
      },
      hints: [
        "total_jkt = g.groupby('kota')['plafon'].sum()['Jakarta'].",
        "g['rata_kota'] = g.groupby('kota')['plafon'].transform('mean').",
        "rata_baris0 = g['rata_kota'].iloc[0]  # baris 0 = Jakarta",
      ],
      code: {
        starter: `import pandas as pd, io\n\nnasabah = pd.read_csv(io.StringIO("""id,nama,kota\n1,Andi,Jakarta\n2,Budi,Bandung\n3,Citra,Jakarta"""))\nkredit = pd.read_csv(io.StringIO("""id,nasabah_id,plafon\n1,1,50000000\n2,2,100000000\n3,2,30000000\n4,3,30000000"""))\ng = pd.merge(nasabah, kredit, left_on="id", right_on="nasabah_id", how="left")\n\n# TULIS KODEMU\ntotal_jkt = \ng['rata_kota'] = \nrata_baris0 = \n\nprint(f"total_jkt={total_jkt:.0f}  rata_baris0={rata_baris0:.0f}")`,
        lockLines: 7,
        solution: `import pandas as pd, io\n\nnasabah = pd.read_csv(io.StringIO("""id,nama,kota\n1,Andi,Jakarta\n2,Budi,Bandung\n3,Citra,Jakarta"""))\nkredit = pd.read_csv(io.StringIO("""id,nasabah_id,plafon\n1,1,50000000\n2,2,100000000\n3,2,30000000\n4,3,30000000"""))\ng = pd.merge(nasabah, kredit, left_on="id", right_on="nasabah_id", how="left")\n\n# TULIS KODEMU\ntotal_jkt = g.groupby('kota')['plafon'].sum()['Jakarta']\ng['rata_kota'] = g.groupby('kota')['plafon'].transform('mean')\nrata_baris0 = g['rata_kota'].iloc[0]\n\nprint(f"total_jkt={total_jkt:.0f}  rata_baris0={rata_baris0:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_jkt", value: 80000000, tol: 1e-9, label: "`total_jkt` = 80000000", msg: "50jt (Andi) + 30jt (Citra) = 80jt." },
          { kind: "equal", task: "t2", name: "rata_baris0", value: 40000000, tol: 1e-9, label: "`rata_baris0` = 40000000", msg: "Rata-rata plafon Jakarta = 80jt / 2, ditulis ke tiap baris Jakarta." },
          { kind: "stdout_matches", task: "t2", pattern: "total_jkt=80000000\\s+rata_baris0=40000000", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "groupby.agg = GROUP BY (melipat); .transform = window (tanpa melipat).",
    },
    {
      id: "pivot-melt",
      eyebrow: "Langkah 3 · pivot & melt",
      title: "Reshape: wide lawan long",
      prose: [
        "`pivot_table` mengubah baris jadi kolom — untuk tampil: `index='kategori', columns='channel'`. `melt` kebalikannya: kolom jadi baris — untuk analisis. Aturan: tidy data = 1 baris per observasi (long).",
        "Kebanyakan operasi pandas ingin long/tidy; wide enak dibaca manusia. Jadi: pivot untuk laporan, melt untuk analisis. Jangan analisis dalam format wide.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Buat pivot `p` = total jumlah per kategori (baris) per channel (kolom)" },
        { id: "t2", text: "Ambil `belanja_mobile` dari pivot" },
      ],
      expected: "belanja_mobile=1000000",
      note: {
        title: "Sering salah",
        body: "Mengira wide format lebih baik untuk analisis. Sebaliknya: groupby, plot, dan model ingin long/tidy. Wide untuk dibaca manusia (laporan); melt dulu, analisis kemudian.",
      },
      hints: [
        "p = trx.pivot_table(index='kategori', columns='channel', values='jumlah', aggfunc='sum', fill_value=0).",
        "belanja_mobile = p.loc['belanja', 'mobile'].",
        "500rb + 500rb = 1000000.",
      ],
      code: {
        starter: `import pandas as pd, io\n\ntrx = pd.read_csv(io.StringIO("""nasabah_id,kategori,channel,jumlah\n1,belanja,mobile,500000\n1,makan,mobile,250000\n2,belanja,web,1000000\n2,travel,web,2000000\n3,belanja,mobile,500000\n1,travel,web,1200000"""))\n\n# TULIS KODEMU\np = \nbelanja_mobile = \n\nprint(f"belanja_mobile={belanja_mobile:.0f}")\nprint(p)`,
        lockLines: 8,
        solution: `import pandas as pd, io\n\ntrx = pd.read_csv(io.StringIO("""nasabah_id,kategori,channel,jumlah\n1,belanja,mobile,500000\n1,makan,mobile,250000\n2,belanja,web,1000000\n2,travel,web,2000000\n3,belanja,mobile,500000\n1,travel,web,1200000"""))\n\n# TULIS KODEMU\np = trx.pivot_table(index="kategori", columns="channel", values="jumlah", aggfunc="sum", fill_value=0)\nbelanja_mobile = p.loc["belanja", "mobile"]\n\nprint(f"belanja_mobile={belanja_mobile:.0f}")\nprint(p)`,
        checks: [
          { kind: "equal", task: "t2", name: "belanja_mobile", value: 1000000, tol: 1e-9, label: "`belanja_mobile` = 1000000", msg: "500rb (nasabah 1) + 500rb (nasabah 3)." },
          { kind: "stdout_matches", task: "t2", pattern: "belanja_mobile=1000000", label: "`print` menampilkan nilai", msg: "Format: belanja_mobile=1000000." },
        ],
      },
      reference: "pivot_table(index, columns, values, aggfunc) untuk tampil; melt untuk analisis.",
    },
    {
      id: "concat",
      eyebrow: "Langkah 4 · concat",
      title: "UNION-nya pandas",
      prose: [
        "`pd.concat([df_jan, df_feb], ignore_index=True)` menumpuk baris — 1 baris untuk 12 file bulanan: `pd.concat([pd.read_csv(f) for f in files], ignore_index=True)`. `ignore_index=True` mereset index agar tidak ganda.",
        "Dengan `axis=1`, concat menumpuk kolom — tapi pastikan index sejajar. Untuk filter eksistensi ('punya kredit macet'), dedup key dulu baru merge: semi-join aman tanpa fan-out.",
      ],
      tasks: [],
      reference: "pd.concat([...], ignore_index=True) untuk tumpuk baris; axis=1 untuk kolom.",
    },
    {
      id: "minicase-fanout",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Tiga file, satu jawaban — tanpa fan-out",
      prose: [
        "Pertanyaan: rata-rata transaksi per kota untuk nasabah yang punya kredit macet (kolektibilitas 5). Pipeline: dedup dulu `k = kredit[kredit.kolektibilitas == 5][['nasabah_id']].drop_duplicates()`, merge nasabah dengan k, merge transaksi, lalu groupby kota mean.",
        "Tanpa dedup, nasabah dengan 2 kredit macet terganda dan rata-rata salah. Pola semi-join — merge dengan tabel key unik — adalah cara aman filter eksistensi. Inilah fan-out C5 dalam baju pandas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rata-rata eksposur per kota yang ter-fan-out bisa mengecilkan atau membesarkan angka risiko tanpa ada yang sadar. Setiap merge sebelum agregat di pipeline risiko wajib punya validate atau cek duplikat key.",
      },
      reference: "Dedup key sebelum merge untuk filter eksistensi. Agregat dulu, merge kemudian.",
    },
    {
      id: "advanced-merge",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: validasi merge, explode, dan categorical",
      prose: [
        "Tiga senjata wrangling yang jarang diajarkan tetapi menentukan benar-tidaknya angkamu. Pertama, VALIDASI MERGE: setiap join adalah janji tentang keunikan kunci — dan janji yang tidak diperiksa akan dilanggar diam-diam. Kasus klasik: tabel nasabah punya duplikat id (satu nasabah, dua baris karena data entry ganda); join ke tabel transaksi melipatgandakan baris — 10.000 transaksi menjadi 23.000, dan semua agregat downstream salah 2,3×. Pengamannya tiga lapis: (1) `validate=\"one_to_one\"` / `\"many_to_one\"` — pandas MELEMPAR error bila janji dilanggar, mengubah bug diam-diam menjadi kegagalan berisik; (2) `indicator=True` — kolom _merge mencatat asal tiap baris (both/left_only/right_only) sehingga kamu bisa audit berapa yang tidak match; (3) cek shape sebelum vs sesudah — baris hasil join tidak boleh melebihi ekspektasimu tanpa penjelasan. Aturan: setiap merge di kode produksi membawa validate + pemeriksaan indicator.",
        "Kedua, EXPLODE: data nyata sering menyimpan list di dalam sel — satu transaksi dengan 3 kode produk dalam satu string/list. `df[\"kode\"].str.split(\",\")` memberi list per sel; `.explode(\"kode\")` memecahnya menjadi satu baris per elemen — normalisasi dari format \"lebar\" ke \"panjang\". Ini invers dari groupby-agg-list, dan pola wajib sebelum agregasi per produk. Jebakannya: explode menduplikasi kolom lain (nominal transaksi ikut terduplikasi per baris produk) — jadi putuskan DULU apakah nominal dibagi rata atau diatribusikan penuh, sebelum agregasi; keputusan bisnis, bukan teknis.",
        "Ketiga, CATEGORICAL dtype: untuk kolom string kardinalitas rendah (kota, segmen, bucket DPD) — tiga kemenangan sekaligus: memori turun 5–10× (disimpan sebagai kode integer), groupby lebih cepat, dan yang paling penting secara analitis: kategori yang TIDAK MUNCUL di data tetap dipertahankan — pivot table menampilkan bucket kosong sebagai 0/NaN, bukan menghilang diam-diam. Trade-off: merge dua kolom categorical dengan himpunan kategori berbeda melempar error — selaraskan kategori dulu (`astype` dengan categories yang sama). Heuristik: string dengan <100 nilai unik yang dipakai untuk groupby/filter berulang = kandidat categorical.",
      ],
      tasks: [],
      reference: "Merge: validate + indicator + cek shape. Explode: normalisasi list-di-sel; putuskan atribusi dulu. Categorical: hemat memori + kategori kosong tetap ada.",
    },
    {
      id: "lab-merge-aman",
      eyebrow: "Langkah 7 · Lab",
      requires: ["pandas"],
      title: "Lab — merge dengan sabuk pengaman",
      prose: [
        "Praktik langsung pola merge aman. Data: 4 nasabah, 5 transaksi — satu transaksi (A99) merujuk id yang tidak ada di tabel nasabah. Tugasmu: (1) merge transaksi→nasabah dengan `how=\"left\"`, `validate=\"many_to_one\"`, dan `indicator=True`; (2) hitung berapa baris yang match (`both`) dan berapa yang hilang (`left_only`); (3) cetak ringkasannya.",
        "Perhatikan: `validate=\"many_to_one\"` menyatakan janji \"satu id nasabah untuk banyak transaksi\" — bila tabel nasabah ternyata punya duplikat id, baris ini MELEMPAR error alih-alih melipatgandakan baris diam-diam. Itulah sabuk pengamannya. Coba setelah lolos: duplikatkan satu baris nasabah (pd.concat) dan jalankan merge lagi — lihat error-nya, lalu kembalikan.",
      ],
      tasks: [
        { id: "t1", text: "Merge dengan `how=\"left\"`, `validate=\"many_to_one\"`, `indicator=True` ke `gab`" },
        { id: "t2", text: "Hitung `n_match` (both) dan `n_hilang` (left_only), cetak ringkasan" },
      ],
      expected: "match=4 hilang=1 baris=5",
      hints: [
        "gab = pd.merge(transaksi, nasabah, on=\"id\", how=\"left\", validate=\"many_to_one\", indicator=True).",
        "n_match = (gab[\"_merge\"] == \"both\").sum(); n_hilang = (gab[\"_merge\"] == \"left_only\").sum().",
        "Cetak: print(f\"match={n_match} hilang={n_hilang} baris={len(gab)}\").",
      ],
      code: {
        starter: `import pandas as pd\\n\\nnasabah = pd.DataFrame({\\n    "id": ["A01", "A02", "A03", "A04"],\\n    "nama": ["Sari", "Budi", "Rina", "Agus"],\\n    "kota": ["Jakarta", "Bandung", "Jakarta", "Medan"],\\n})\\ntransaksi = pd.DataFrame({\\n    "id": ["A01", "A01", "A02", "A03", "A99"],\\n    "nominal": [500_000, 750_000, 300_000, 900_000, 100_000],\\n})\\nprint("nasabah:", nasabah.shape, "| transaksi:", transaksi.shape)\\n\\n# TULIS KODEMU: merge aman + audit\\ngab = \\n\\nn_match = \\nn_hilang = \\n\\nprint(f"match={n_match} hilang={n_hilang} baris={len(gab)}")\\n`,
        lockLines: 13,
        solution: `import pandas as pd\\n\\nnasabah = pd.DataFrame({\\n    "id": ["A01", "A02", "A03", "A04"],\\n    "nama": ["Sari", "Budi", "Rina", "Agus"],\\n    "kota": ["Jakarta", "Bandung", "Jakarta", "Medan"],\\n})\\ntransaksi = pd.DataFrame({\\n    "id": ["A01", "A01", "A02", "A03", "A99"],\\n    "nominal": [500_000, 750_000, 300_000, 900_000, 100_000],\\n})\\nprint("nasabah:", nasabah.shape, "| transaksi:", transaksi.shape)\\n\\n# TULIS KODEMU: merge dengan validasi + audit indicator\\ngab = pd.merge(transaksi, nasabah, on="id", how="left",\\n               validate="many_to_one", indicator=True)\\n\\nn_match = (gab["_merge"] == "both").sum()\\nn_hilang = (gab["_merge"] == "left_only").sum()\\n\\nprint(f"match={n_match} hilang={n_hilang} baris={len(gab)}")\\n`,
        checks: [
          { kind: "defined", task: "t1", name: "gab", label: "`gab` terdefinisi", msg: "Simpan hasil merge di variabel gab." },
          { kind: "equal", task: "t2", name: "n_match", value: 4, tol: 1e-09, label: "`n_match` = 4", msg: "4 transaksi punya id yang dikenal (A01 x2, A02, A03)." },
          { kind: "equal", task: "t2", name: "n_hilang", value: 1, tol: 1e-09, label: "`n_hilang` = 1", msg: "1 transaksi (A99) tidak punya pasangan di tabel nasabah." },
          { kind: "stdout_matches", task: "t2", pattern: "match=4 hilang=1", label: "Ringkasan tercetak", msg: "Format: match=4 hilang=1 baris=5." },
        ],
      },
      reference: "validate= mengubah janji kunci jadi error berisik; indicator=True memberi jejak audit per baris.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: setiap join adalah janji tentang keunikan kunci",
      prose: [
        "Heuristik penutup: di wrangling, baris yang berlipat ganda diam-diam lebih berbahaya dari error yang berisik.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: setiap join adalah janji tentang keunikan kunci",
        body: "Bug join tidak pernah terlihat di baris kode join-nya — ia terlihat 3 langkah kemudian sebagai \"kok totalnya aneh\". Heuristik pertama: SEBELUM merge, periksa keunikan kunci di kedua sisi (`duplicated().any()`) — 10 detik ini mencegah 3 jam debugging agregat yang salah 2,3×. Heuristik kedua: validate= adalah sabuk pengaman — tulis janji kardinalitasmu (one_to_one, many_to_one) dan biarkan pandas meledak saat janji dilanggar; ledakan di depanmu jauh lebih murah dari laporan salah. Heuristik ketiga: indicator=True adalah jejak audit — \"berapa persen yang tidak match\" adalah pertanyaan yang PASTI ditanyakan atasanmu; punyalah jawabannya sebelum ditanya. Heuristik keempat: shape adalah sidik jari — catat shape sebelum dan sesudah setiap merge; baris yang bertambah tanpa penjelasan adalah alarm. Heuristik kelima: untuk kolom string yang di-groupby berulang, pertimbangkan categorical — bukan sekadar hemat memori, tetapi karena kategori yang tidak muncul tetap dipertahankan di pivot (bucket kosong yang hilang diam-diam adalah laporan yang berbohong dengan sopan). Dan untuk reshape: explode untuk menormalkan, pivot untuk meringkas, melt untuk memanjangkan — pilih berdasarkan PERTANYAAN (\"per produk\" → explode dulu), bukan berdasarkan fungsi yang paling kamu hafal.",
      },
      reference: "Cek duplikat kunci dulu; validate= sebagai janji; indicator sebagai audit; shape sebagai sidik jari.",
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
          q: "validate='1:m' pada merge nasabah -> kredit...",
          options: [
            { text: "Mempercepat merge", why: "Tidak ada efek kecepatan — ini penjaga kebenaran." },
            { text: "Error jika relasi bukan 1-ke-banyak — penjaga fan-out", why: "Validasi relasi menangkap masalah sebelum angka salah.", correct: true },
            { text: "Mengubah hasil merge", why: "Tidak mengubah hasil; hanya memvalidasi asumsi." },
            { text: "Tidak ada efek", why: "Ada: error saat relasi tak sesuai." },
          ],
        },
        {
          q: "transform vs agg...",
          options: [
            { text: "Sama saja", why: "Beda: transform menulis ke tiap baris, agg melipat." },
            { text: "transform: hasil ke tiap baris tanpa melipat; agg: 1 baris per grup", why: "transform = window function pandas.", correct: true },
            { text: "transform lebih lambat", why: "Bukan soal kecepatan — soal bentuk output." },
            { text: "agg untuk kolom baru", why: "agg melipat; kolom baru per baris = transform atau assign." },
          ],
        },
        {
          q: "pivot untuk ___ ; melt untuk ___ ...",
          options: [
            { text: "analisis; tampil", why: "Terbalik." },
            { text: "tampil (laporan); analisis (tidy/long)", why: "Wide dibaca manusia; long dianalisis mesin.", correct: true },
            { text: "hapus; tambah", why: "Keduanya reshape, bukan hapus/tambah." },
            { text: "cepat; lambat", why: "Bukan soal kecepatan." },
          ],
        },
        {
          q: "pd.merge(a, b, on='id') menghasilkan baris lebih banyak dari len(a). Diagnosis...",
          options: [
            { text: "Normal, biarkan", why: "Tidak normal — itu fan-out." },
            { text: "Cek b['id'].duplicated().sum() — sisi kanan tidak unik", why: "Duplikat key di sisi banyak menggandakan baris.", correct: true },
            { text: "Ganti how='inner'", why: "how tidak memperbaiki duplikat key." },
            { text: "Restart kernel", why: "Masalah data, bukan environment." },
          ],
        },
      ],
      summary: [
        "merge = JOIN (validate relasi!); concat = UNION.",
        "groupby.agg = GROUP BY; transform = window tanpa melipat.",
        "pivot_table untuk tampil; melt untuk analisis (tidy).",
        "Fan-out: cek duplikat key; dedup/agregat dulu baru merge.",
        "SQL ke pandas: konsep sama, sintaks beda.",
      ],
      next: { label: "D7 — Datetime & Time Series", href: "/learn/d7-datetime-timeseries" },
    },
  ],
};
