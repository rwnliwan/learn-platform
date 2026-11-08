import type { V2Lesson } from "../lib/types";

export const d10: V2Lesson = {
  slug: "d10-feature-engineering",
  track: "Python",
  module: "Machine Learning",
  title: "D10 Feature Engineering: Bahan Bakar Model",
  estMinutes: 50,
  steps: [
    {
      id: "pola-fitur",
      eyebrow: "Langkah 1 · Empat keluarga",
      title: "Cerita pembuka: 60% ke 85% tanpa ganti algoritma",
      prose: [
        "Kompetisi: model A akurasi 60% dengan 5 fitur mentah. Model B 85% — algoritma sama persis (logistic regression), tapi 40 fitur hasil engineering: rasio, agregat 30-hari, tren. Fitur bagus + model sederhana mengalahkan model canggih + fitur mentah.",
        "Empat keluarga fitur: agregat (rata-rata DPD 6 bulan; count transaksi 1 jam untuk fraud), rasio (utilisasi = terpakai/plafon), waktu (hari sejak transaksi terakhir; MOB), kategorikal (one-hot untuk kecil; target encoding untuk besar). Mulai dari hipotesis domain: 'fraud = cepat + besar + jam aneh' menjadi velocity, amount ratio, hour.",
      ],
      tasks: [],
      reference: "Fitur dari hipotesis domain. Kualitas > kuantitas; tiap fitur bisa dijelaskan.",
    },
    {
      id: "fitur-kredit",
      eyebrow: "Langkah 2 · Agregat, rasio, waktu",
      title: "Bangun fitur dari data mentah",
      prose: [
        "Dari log transaksi per nasabah: agregat per nasabah (count, sum, max, mean), rasio utilisasi = total transaksi / plafon, dan recency = hari sejak transaksi terakhir vs 2026-10-01. Semua vectorized via groupby — pola 'agregat per entitas per jendela' adalah 80% feature engineering credit/fraud.",
        "Rasio menormalisasi skala (plafon 100jt artinya beda untuk gaji 10jt vs 100jt), tapi rasio membuang info absolut — beri model keduanya (rasio + absolut), biar model yang memilih.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `utilisasi_1` = trx_sum / plafon untuk nasabah 1" },
        { id: "t2", text: "Hitung `hari_1` = hari sejak transaksi terakhir nasabah 1" },
      ],
      expected: "utilisasi_1=0.039  hari_1=16",
      note: {
        title: "Sering salah",
        body: "Memakai jendela agregat yang mencakup masa depan relatif terhadap tanggal observasi (lookahead, D7). Jendela harus berakhir sebelum tanggal target — selalu tulis tanggal observasi untuk tiap fitur.",
      },
      hints: [
        "agg = trx.groupby('nasabah_id').agg(trx_sum=('jumlah', 'sum')).",
        "utilisasi_1 = 1950000 / 50000000.",
        "hari_1 = (pd.Timestamp('2026-10-01') - terakhir).dt.days untuk nasabah 1.",
      ],
      code: {
        starter: `import pandas as pd, io\n\ntrx = pd.read_csv(io.StringIO("""nasabah_id,tanggal,jumlah,kategori\n1,2026-09-01,500000,belanja\n1,2026-09-03,250000,makan\n1,2026-09-15,1200000,travel\n2,2026-09-01,1000000,belanja\n2,2026-09-10,2000000,travel\n2,2026-09-25,400000,makan"""), parse_dates=["tanggal"])\nplafon_1 = 50_000_000\n\n# TULIS KODEMU\nagg = trx.groupby("nasabah_id").agg(trx_sum=("jumlah", "sum"))\nutilisasi_1 = \nterakhir = trx.groupby("nasabah_id")["tanggal"].max()\nhari_1 = \n\nprint(f"utilisasi_1={utilisasi_1:.3f}  hari_1={hari_1}")`,
        lockLines: 9,
        solution: `import pandas as pd, io\n\ntrx = pd.read_csv(io.StringIO("""nasabah_id,tanggal,jumlah,kategori\n1,2026-09-01,500000,belanja\n1,2026-09-03,250000,makan\n1,2026-09-15,1200000,travel\n2,2026-09-01,1000000,belanja\n2,2026-09-10,2000000,travel\n2,2026-09-25,400000,makan"""), parse_dates=["tanggal"])\nplafon_1 = 50_000_000\n\n# TULIS KODEMU\nagg = trx.groupby("nasabah_id").agg(trx_sum=("jumlah", "sum"))\nutilisasi_1 = agg.loc[1, "trx_sum"] / plafon_1\nterakhir = trx.groupby("nasabah_id")["tanggal"].max()\nhari_1 = int((pd.Timestamp("2026-10-01") - terakhir.loc[1]).days)\n\nprint(f"utilisasi_1={utilisasi_1:.3f}  hari_1={hari_1}")`,
        checks: [
          { kind: "equal", task: "t1", name: "utilisasi_1", value: 0.039, tol: 1e-9, label: "`utilisasi_1` = 0.039", msg: "1950000 / 50000000." },
          { kind: "equal", task: "t2", name: "hari_1", value: 16, tol: 1e-9, label: "`hari_1` = 16", msg: "2026-10-01 minus 2026-09-15 = 16 hari." },
          { kind: "stdout_matches", task: "t2", pattern: "utilisasi_1=0\\.039\\s+hari_1=16", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Agregat per entitas per jendela; rasio; recency. Beri model rasio + absolut.",
    },
    {
      id: "encoding-scaling",
      eyebrow: "Langkah 3 · Encoding & scaling",
      title: "One-hot dan scaler anti-leakage",
      prose: [
        "One-hot untuk kategorikal kecil: `pd.get_dummies`. Kardinalitas besar (200 kota)? One-hot meledak — pakai target/frequency encoding. Scaling wajib untuk model jarak/gradien (SVM, KNN, neural net); tree-based tidak butuh.",
        "Aturan emas: bagi train/test DULU, fit (mean/std scaler, kolom one-hot) HANYA di train, terapkan ke test. Di sini manual: kolom test di-reindex mengikuti train (`fill_value=0` untuk kota baru), scaler memakai mean/std train.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Samakan kolom test dengan train (`sama` = True/False)" },
        { id: "t2", text: "Scaling manual: `mean_scaled` (train) dan `skala_test0`" },
      ],
      expected: "sama=True  mean_scaled=0.0  skala_test0=-0.724",
      note: {
        title: "Sering salah",
        body: "Fit scaler di full data sebelum split — statistik test bocor ke train (leakage halus). Selalu: split dulu, fit di train saja. Di produksi, bungkus dalam Pipeline agar urutan ini otomatis.",
      },
      hints: [
        "Xte = Xte.reindex(columns=Xtr.columns, fill_value=0).",
        "mean = Xtr['plafon'].mean(); std = Xtr['plafon'].std().",
        "mean_scaled = ((Xtr['plafon'] - mean) / std).mean()  # ~0",
      ],
      code: {
        starter: `import pandas as pd\n\ndf = pd.DataFrame({\n    "kota": ["Jakarta", "Bandung", "Jakarta", "Surabaya", "Bandung", "Jakarta"],\n    "plafon": [50e6, 100e6, 30e6, 200e6, 40e6, 90e6],\n    "macet": [0, 0, 1, 0, 0, 1]})\ntrain, test = df.iloc[:4], df.iloc[4:]\nXtr = pd.get_dummies(train[["kota", "plafon"]], columns=["kota"])\nXte = pd.get_dummies(test[["kota", "plafon"]], columns=["kota"])\n\n# TULIS KODEMU: samakan kolom, scaling manual dari statistik TRAIN\nXte = \nsama = \nmean = \nstd = \nmean_scaled = \nskala_test0 = \n\nprint(f"sama={sama}  mean_scaled={mean_scaled:.1f}  skala_test0={skala_test0:.3f}")`,
        lockLines: 9,
        solution: `import pandas as pd\n\ndf = pd.DataFrame({\n    "kota": ["Jakarta", "Bandung", "Jakarta", "Surabaya", "Bandung", "Jakarta"],\n    "plafon": [50e6, 100e6, 30e6, 200e6, 40e6, 90e6],\n    "macet": [0, 0, 1, 0, 0, 1]})\ntrain, test = df.iloc[:4], df.iloc[4:]\nXtr = pd.get_dummies(train[["kota", "plafon"]], columns=["kota"])\nXte = pd.get_dummies(test[["kota", "plafon"]], columns=["kota"])\n\n# TULIS KODEMU: samakan kolom, scaling manual dari statistik TRAIN\nXte = Xte.reindex(columns=Xtr.columns, fill_value=0)\nsama = list(Xtr.columns) == list(Xte.columns)\nmean = Xtr["plafon"].mean()\nstd = Xtr["plafon"].std()\nmean_scaled = ((Xtr["plafon"] - mean) / std).mean()\nskala_test0 = ((Xte["plafon"] - mean) / std).iloc[0]\n\nprint(f"sama={sama}  mean_scaled={mean_scaled:.1f}  skala_test0={skala_test0:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sama", value: true, label: "`sama` = True", msg: "Kolom test mengikuti train; kota baru jadi 0 semua." },
          { kind: "equal", task: "t2", name: "mean_scaled", value: 0.0, tol: 1e-9, label: "`mean_scaled` = 0.0", msg: "Scaling dari statistik train: mean train jadi 0." },
          { kind: "equal", task: "t2", name: "skala_test0", value: -0.724, tol: 0.001, label: "`skala_test0` sekitar -0.724", msg: "(40jt - 95jt) / 75,94jt." },
          { kind: "stdout_matches", task: "t2", pattern: "sama=True\\s+mean_scaled=0\\.0\\s+skala_test0=-0\\.724", label: "`print` menampilkan ketiganya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Split dulu; fit hanya di train. One-hot kecil; scaling untuk jarak/gradien.",
    },
    {
      id: "leakage",
      eyebrow: "Langkah 4 · Leakage",
      title: "Dosa terbesar: data leakage",
      prose: [
        "Data leakage = fitur mengandung info masa depan atau target itu sendiri. 'DPD 90 hari' untuk prediksi saat pencairan: belum terjadi — bocor. Imputasi pakai mean full data: info test bocor. 'Status macet' sebagai fitur prediksi macet: itu targetnya!",
        "Tes leakage: apakah fitur ini sudah diketahui saat prediksi dibuat? Apakah ada info test di train? Gejala: akurasi tidak wajar (99%+) dan 1 fitur mendominasi importance. Curigai dulu, rayakan kemudian.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model dengan leakage yang lolos ke produksi memberi rasa aman palsu — angka bagus di laporan, keputusan salah di lapangan. Audit leakage adalah checklist wajib sebelum model risiko dipakai untuk keputusan kredit.",
      },
      quiz: [
        {
          q: "'DPD 90 hari' sebagai fitur prediksi saat pencairan...",
          options: [
            { text: "Aman", why: "Tidak — DPD 90 hari belum terjadi saat pencairan." },
            { text: "Leakage (belum terjadi)", why: "Point-in-time: hanya info yang diketahui saat observasi.", correct: true },
            { text: "Fitur yang bagus", why: "Bagus di train, hancur di live — itu definisi leakage." },
            { text: "Tidak masalah", why: "Masalah besar: model menipu." },
          ],
        },
        {
          q: "Scaler harus di-fit...",
          options: [
            { text: "Di full data", why: "Itu leakage: statistik test bocor ke train." },
            { text: "Hanya di train, lalu transform test", why: "Statistik test tidak boleh memengaruhi train.", correct: true },
            { text: "Hanya di test", why: "Terbalik — model belajar dari train." },
            { text: "Tidak perlu di-fit", why: "Scaler butuh mean/std dari data." },
          ],
        },
      ],
      reference: "Tes: tersedia saat prediksi dibuat? Ada info test di train? Curigai 99%+.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 5 · Intuisi",
      title: "Intuisi: fitur adalah hipotesis tentang dunia, bukan kolom",
      prose: [
        "Heuristik penutup: setiap fitur yang kamu buat adalah klaim tentang bagaimana dunia bekerja — perlakukan ia seperti klaim, bukan seperti kolom.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: fitur adalah hipotesis tentang dunia, bukan kolom",
        body: "Heuristik pertama: fitur sederhana yang jujur mengalahkan fitur cerdas yang bocor — rasio, count, recency, dan agregat as-of menutupi 80% nilai feature engineering; sisanya adalah optimasi, bukan fondasi. Heuristik kedua: uji waktu untuk setiap fitur — 'bisakah nilai ini diketahui saat prediksi?' Bila jawabannya 'tidak' atau 'tergantung', itu leakage yang menunggu ditemukan auditor. Heuristik ketiga: curigai fitur yang terlalu bagus — satu fitur yang menaikkan AUC 10pp sendirian adalah KANDIDAT leakage pertama yang diperiksa — bukan vonis: fitur sah bisa menaikkan banyak bila ia menangkap sinyal yang memang kuat (mis. fitur domain yang baru tersedia); yang wajib adalah membuktikan ia lolos uji waktu, bukan mengasumsinya bocor. Fitur yang benar BIASANYA menaikkan metrik sedikit demi sedikit — tetapi “biasanya” bukan “selalu”. Heuristik keempat: dokumentasikan DEFINISI setiap fitur (jendela waktu, populasi statistik, perlakuan missing) — fitur tanpa definisi tidak bisa di-debug, tidak bisa direproduksi, dan tidak bisa dipertahankan saat datanya berubah. Heuristik kelima: validasi fitur dengan split yang menghormati waktu — KFold acak pada data berwaktu memberi nilai yang menyanjung dan salah; TimeSeriesSplit memberi nilai yang LEBIH jujur untuk data berwaktu — tetapi “lebih jujur” bukan jaminan: bila ada leakage lain (fitur masa depan, target encoding dari seluruh data), TimeSeriesSplit tetap menyanjung. Split temporal adalah syarat perlu, bukan cukup. Pilih yang jujur, meski angkanya lebih jelek. Heuristik keenam: fitur agregat butuh 'tanggal kedaluwarsa' — rata-rata 30 hari yang dihitung hari ini berbeda dengan yang dihitung bulan depan; bila definisi jendelanya tidak tertulis, dua orang akan menghitung 'fitur yang sama' dengan dua angka berbeda dan tidak ada yang tahu siapa yang benar.",
      },
      reference: "Fitur = hipotesis. Uji waktu selalu; curigai yang terlalu bagus; definisi tertulis; validasi temporal.",
    },
    {
      id: "advanced-leakage",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: disiplin fit/transform, target encoding dengan CV, fitur waktu",
      prose: [
        "Tiga disiplin yang memisahkan feature engineering yang menaikkan skor dari yang menaikkan skor PALSU. Pertama, DISIPLIN FIT/TRANSFORM: aturan emasnya — fit HANYA di train, transform di keduanya. `scaler.fit(X_train)` lalu `transform(X_train)` dan `transform(X_test)`; tidak pernah fit di seluruh data sebelum split. Kebocoran yang halus: imputasi dengan mean seluruh data, seleksi fitur memakai seluruh data, dan yang paling licik — target encoding yang dihitung dari seluruh data. Semuanya memakai informasi yang \"belum boleh diketahui\" saat prediksi. Uji seniornya satu kalimat: \"bisakah nilai fitur ini diketahui PADA SAAT prediksi dilakukan?\" — bila tidak, itu leakage, bukan fitur.",
        "Kedua, TARGET ENCODING DENGAN CV: mengganti kategori dengan rata-rata target per kategori itu powerful (menangkap 'kota X historically berisiko'), tetapi bila dihitung dari baris yang sama dengan yang di-encode, kategori langka akan overfit noise-nya sendiri — model \"belajar\" bahwa kota dengan 2 sampel dan 1 default punya risiko 50%. Perbaikannya dua lapis: (1) OUT-OF-FOLD encoding — bagi train menjadi K lipatan, encode tiap lipatan dengan statistik dari lipatan LAIN (pola yang sama dengan cross-validation); (2) SMOOTHING — campur rata-rata kategori dengan rata-rata global, dibobot jumlah sampel: w = n / (n + m), encoded = w * mean_kategori + (1 - w) * mean_global. Dengan m = 100, kategori berisi 3 sampel hampir seluruhnya ditarik ke global — skeptisisme yang dikodekan.",
        "Ketiga, FITUR BERBASIS WAKTU: untuk data kredit/fraud, fitur harus menghormati urutan temporal — statistik rolling (rata-rata transaksi 30 hari) dihitung dengan jendela TERTUTUP (hanya data <= timestamp baris itu, pola 'as-of join'); tidak pernah memakai masa depan. Dan validasinya harus temporal juga: train di masa lalu, test di masa depan (TimeSeriesSplit) — KFold acak pada data berwaktu adalah leakage yang disponsori library. Praktikkan di lab: buktikan target encoding yang bocor terlihat 'lebih prediktif' dari yang jujur — selisihnya adalah ilusi yang harus kamu kenali sebelum modelmu yang mengalaminya.",
      ],
      tasks: [],
      reference: "Fit di train, transform keduanya. Target encoding: out-of-fold + smoothing w=n/(n+m). Fitur waktu: as-of, jendela tertutup, validasi temporal.",
    },
    {
      id: "minicase-encoding",
      eyebrow: "Langkah 7 · Mini-case",
      requires: ["pandas", "numpy"],
      title: "Mini-case: fitur 'ajaib' yang hanya ajaib di atas kertas",
      prose: [
        "Skenario (angka konkret): tim modeling membangun skor aplikasi dengan fitur 'risiko_kota' = rata-rata default historis per kota (target encoding). Validasi internal: AUC 0,81 — jauh di atas baseline 0,68. Fitur ini 'menjelaskan' segalanya. Model di-deploy ke 4 cabang baru. Tiga bulan kemudian: AUC live 0,63 — di bawah baseline. Investigasi menemukan encoding dihitung dari SELURUH data termasuk periode validasi; kategori kota kecil (n < 50) meng-overfit noise periodenya sendiri — 'risiko_kota' pada dasarnya menghafal jawaban. Kerugian: 3 bulan model buruk + biaya redeploy + kepercayaan bisnis yang turun.",
        "Pertanyaan analisis: (1) Mengapa skor validasi terlihat hebat? (2) Di mana tepatnya kebocorannya? (3) Bagaimana cara yang benar?",
        "Pembahasan: (1) Encoding memakai label yang sama dengan yang dievaluasi — fitur 'tahu' jawabannya; korelasi di test terlihat positif padahal sinyal aslinya ~nol (praktikkan di lab: kor_bocor > kor_benar pada data berisik). (2) Di baris groupby: statistik dihitung SEBELUM split, sehingga informasi test merembes ke fitur train DAN test. (3) Out-of-fold encoding (statistik per lipatan dari lipatan lain) + smoothing w = n/(n+m) untuk kategori langka; dan validasi temporal bila datanya berwaktu. Aturan: setiap fitur agregat harus bisa menjawab 'statistik ini dihitung dari data apa, dan apakah data itu boleh diketahui saat prediksi'.",
        "Kaitan ke karier: leakage tidak pernah terlihat seperti bug — ia terlihat seperti KEBERHASILAN. Kecurigaan yang sehat: bila satu fitur menaikkan metrik terlalu banyak terlalu mudah, itu kandidat leakage pertama yang diperiksa.",
      ],
      tasks: [
        { id: "t1", text: "Hitung target encoding JUJUR (`map_benar` dari train) dan `enc_benar_te`" },
        { id: "t2", text: "Hitung versi BOCOR (`map_bocor` dari semua data), bandingkan korelasinya di test" },
      ],
      expected: "kor_bocor > kor_benar (bocor_menang=True) — ilusi prediktif dari leakage",
      hints: [
        "map_benar = df.iloc[tr].groupby('kota')['y'].mean(); enc_benar_te = df.iloc[te]['kota'].map(map_benar).",
        "map_bocor = df.groupby('kota')['y'].mean() — memakai SEMUA label termasuk test.",
        "kor = np.corrcoef(enc_te, df.iloc[te]['y'])[0, 1]; bandingkan keduanya.",
      ],
      code: {
        starter: `import pandas as pd\nimport numpy as np\n\nrng = np.random.default_rng(7)\nn = 2000\nkota = rng.choice(["JKT", "BDG", "SBY", "MDN", "MKS"], n)\n# target BERISIK: kota hampir tidak berpengaruh — noise mendominasi\nbase = {"JKT": 0.10, "BDG": 0.12, "SBY": 0.09, "MDN": 0.11, "MKS": 0.10}\nprob = np.array([base[k] for k in kota])\ny = (rng.random(n) < prob).astype(int)\ndf = pd.DataFrame({"kota": kota, "y": y})\n\nidx = np.arange(n)\nrng.shuffle(idx)\ntr, te = idx[:1500], idx[1500:]\nprint("train:", len(tr), "| test:", len(te))\n\n# TULIS KODEMU: dua cara target encoding — jujur vs bocor\n# CARA JUJUR: statistik HANYA dari train\nmap_benar =\nenc_benar_te =\n\n# CARA BOCOR: statistik dari SEMUA data (termasuk label test!)\nmap_bocor =\nenc_bocor_te =\n\nkor_benar = np.corrcoef(enc_benar_te, df.iloc[te]["y"])[0, 1]\nkor_bocor = np.corrcoef(enc_bocor_te, df.iloc[te]["y"])[0, 1]\nbocor_menang = kor_bocor > kor_benar\nprint(f"kor_benar={kor_benar:.3f} kor_bocor={kor_bocor:.3f} bocor_menang={bocor_menang}")\n`,
        lockLines: 15,
        solution: `import pandas as pd\nimport numpy as np\n\nrng = np.random.default_rng(7)\nn = 2000\nkota = rng.choice(["JKT", "BDG", "SBY", "MDN", "MKS"], n)\n# target BERISIK: kota hampir tidak berpengaruh — noise mendominasi\nbase = {"JKT": 0.10, "BDG": 0.12, "SBY": 0.09, "MDN": 0.11, "MKS": 0.10}\nprob = np.array([base[k] for k in kota])\ny = (rng.random(n) < prob).astype(int)\ndf = pd.DataFrame({"kota": kota, "y": y})\n\nidx = np.arange(n)\nrng.shuffle(idx)\ntr, te = idx[:1500], idx[1500:]\nprint("train:", len(tr), "| test:", len(te))\n\n# TULIS KODEMU: dua cara target encoding — jujur vs bocor\n# CARA JUJUR: statistik HANYA dari train\nmap_benar = df.iloc[tr].groupby("kota")["y"].mean()\nenc_benar_te = df.iloc[te]["kota"].map(map_benar)\n\n# CARA BOCOR: statistik dari SEMUA data (termasuk label test!)\nmap_bocor = df.groupby("kota")["y"].mean()\nenc_bocor_te = df.iloc[te]["kota"].map(map_bocor)\n\nkor_benar = np.corrcoef(enc_benar_te, df.iloc[te]["y"])[0, 1]\nkor_bocor = np.corrcoef(enc_bocor_te, df.iloc[te]["y"])[0, 1]\nbocor_menang = kor_bocor > kor_benar\nprint(f"kor_benar={kor_benar:.3f} kor_bocor={kor_bocor:.3f} bocor_menang={bocor_menang}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "enc_benar_te", label: "`enc_benar_te` terdefinisi", msg: "Encode test dengan statistik dari train saja." },
          { kind: "defined", task: "t2", name: "enc_bocor_te", label: "`enc_bocor_te` terdefinisi", msg: "Encode test dengan statistik dari semua data." },
          { kind: "equal", task: "t2", name: "bocor_menang", value: true, tol: 0, label: "`bocor_menang` = True", msg: "Encoding bocor 'mengenal' label test — korelasinya lebih tinggi (ilusi)." },
          { kind: "stdout_matches", task: "t2", pattern: "bocor_menang=True", label: "Perbandingan tercetak", msg: "Format: kor_benar=... kor_bocor=... bocor_menang=True." },
        ],
      },
      reference: "Leakage terlihat seperti keberhasilan. Agregat fitur: dari data apa, bolehkah diketahui saat prediksi?",
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
          q: "Feature engineering penting karena...",
          options: [
            { text: "Menggantikan model", why: "Tidak menggantikan — memberi bahan bakar." },
            { text: "Fitur bagus + model sederhana > model canggih + fitur mentah", why: "Terbukti di kompetisi: 60% ke 85% tanpa ganti algoritma.", correct: true },
            { text: "Wajib 1000 fitur", why: "Kualitas > kuantitas." },
            { text: "Tidak penting", why: "Justru penentu utama." },
          ],
        },
        {
          q: "Data leakage = ...",
          options: [
            { text: "Data hilang", why: "Itu missing, bukan leakage." },
            { text: "Fitur mengandung info masa depan/target — model menipu", why: "Dosa terbesar: sempurna di train, hancur di live.", correct: true },
            { text: "Data duplikat", why: "Itu masalah kualitas, bukan leakage." },
            { text: "Fitur terlalu banyak", why: "Itu overfitting, bukan leakage." },
          ],
        },
        {
          q: "Scaling wajib untuk...",
          options: [
            { text: "Random forest", why: "Tree tidak peduli skala." },
            { text: "SVM/KNN/neural net (jarak/gradien)", why: "Fitur 0-1 vs 0-1jt mendominasi tanpa scaling.", correct: true },
            { text: "Semua model", why: "Tree-based tidak butuh." },
            { text: "Tidak ada model", why: "Ada: yang berbasis jarak/gradien." },
          ],
        },
        {
          q: "Kota dengan 200 nilai unik sebaiknya...",
          options: [
            { text: "One-hot 200 kolom", why: "Meledak: 200 kolom sparse." },
            { text: "Target/frequency encoding", why: "Alternatif untuk kardinalitas besar.", correct: true },
            { text: "Dihapus", why: "Informasi kota mungkin prediktif." },
            { text: "Label encoding ordinal", why: "Menciptakan urutan palsu untuk nominal." },
          ],
        },
      ],
      summary: [
        "4 keluarga: agregat, rasio, waktu, kategorikal — dari hipotesis domain.",
        "Encoding: one-hot untuk kecil; scaling untuk jarak/gradien.",
        "Split dulu; fit (scaler/encoder) hanya di train.",
        "Leakage: point-in-time; curigai akurasi 99%+.",
        "Kualitas > kuantitas; tiap fitur bisa dijelaskan.",
      ],
      next: { label: "D11 — SciPy & statsmodels", href: "/v2/learn/d11-scipy-statsmodels" },
    },
  ],
};
