import type { V2Lesson } from "../lib/types";

const CSV_KREDIT = `id,kota,plafon,tenor,dpd,kolektibilitas
1,Jakarta,50000000,12,0,1
2,Bandung,100000000,24,15,2
3,Jakarta,30000000,12,45,3
4,Surabaya,200000000,36,0,1
5,Jakarta,75000000,24,90,4
6,Bandung,40000000,12,5,1
7,Medan,60000000,18,30,2
8,Jakarta,90000000,24,0,1
9,Surabaya,25000000,12,120,5
10,Medan,55000000,18,0,1
11,Bandung,30000000,12,60,3
12,Jakarta,,6,150,5`;

export const d9: V2Lesson = {
  slug: "d9-eda",
  track: "Python",
  module: "EDA",
  title: "D9 EDA: Workflow & Profiling Data",
  estMinutes: 55,
  steps: [
    {
      id: "workflow",
      eyebrow: "Langkah 1 · Workflow 6 langkah",
      title: "Cerita pembuka: EDA acak vs sistematis",
      prose: [
        "Dua analis dapat dataset sama. Analis A: plot acak 2 jam, temukan 'gaji vs kota menarik' — tapi lupa cek missing, dan insight-nya ternyata artefak duplikat. Analis B: ikut workflow 6 langkah 90 menit — temukan 3 insight valid, 2 isu kualitas, daftar pertanyaan lanjutan.",
        "Workflow: (1) gambaran — data ini apa? (2) kualitas — apa yang kotor? (3) univariat — bagaimana tiap kolom? (4) bivariat — apa hubungannya? (5) waktu — bagaimana trennya? (6) sintesis — jadi apa? Aturan: urut, jangan lompat. Insight dari data kotor adalah sampah.",
      ],
      tasks: [],
      reference: "Mulai dengan 3-5 pertanyaan bisnis tertulis; akhiri dengan dokumentasi 1 halaman.",
    },
    {
      id: "profil",
      eyebrow: "Langkah 2 · Gambaran & kualitas",
      title: "Vital sign dataset",
      prose: [
        "Sebelum plot apapun: shape (skala), dtypes (tipe benar?), missing per kolom dalam persen, duplikat. Lima baris ini adalah vital sign — analis B memulainya dari sini, analis A langsung plot.",
        "Dataset kredit 12 baris ini: 1 missing plafon (8%), 0 duplikat, dan NPL (kolektibilitas >= 3) sebanyak 5 dari 12 — 41,7%, jauh di atas benchmark ~3%. Tapi n=12 terlalu kecil untuk kesimpulan — catat sebagai batasan.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `n_baris`, `n_missing_plafon`" },
        { id: "t2", text: "Hitung `npl_rate` = proporsi kolektibilitas >= 3" },
      ],
      expected: "n_baris=12  n_missing=1  npl_rate=41.67%",
      note: {
        title: "Sering salah",
        body: "Lompat ke bivariat sebelum cek kualitas. Insight dari data kotor = sampah: duplikat menciptakan kluster palsu, tipe salah membuat agregat salah. Kualitas adalah langkah 2 yang tidak bisa dinegosiasi.",
      },
      hints: [
        "n_baris = len(df); n_missing_plafon = int(df['plafon'].isna().sum()).",
        "npl_rate = (df['kolektibilitas'] >= 3).mean().",
        "5 dari 12 baris: kolektibilitas 3, 4, 5, 3, 5.",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_KREDIT}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nn_baris = \nn_missing_plafon = \nnpl_rate = \n\nprint(f"n_baris={n_baris}  n_missing={n_missing_plafon}  npl_rate={npl_rate:.2%}")`,
        lockLines: 4,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_KREDIT}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nn_baris = len(df)\nn_missing_plafon = int(df['plafon'].isna().sum())\nnpl_rate = (df['kolektibilitas'] >= 3).mean()\n\nprint(f"n_baris={n_baris}  n_missing={n_missing_plafon}  npl_rate={npl_rate:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_baris", value: 12, tol: 1e-9, label: "`n_baris` = 12", msg: "Dataset 12 baris." },
          { kind: "equal", task: "t1", name: "n_missing_plafon", value: 1, tol: 1e-9, label: "`n_missing_plafon` = 1", msg: "Satu plafon kosong (baris 12)." },
          { kind: "equal", task: "t2", name: "npl_rate", value: 0.4167, tol: 0.001, label: "`npl_rate` sekitar 41.67%", msg: "5 dari 12: kolektibilitas >= 3." },
          { kind: "stdout_matches", task: "t2", pattern: "npl_rate=41\\.67%", label: "`print` menampilkan npl_rate", msg: "Format persen 2 desimal." },
        ],
      },
      reference: "shape, dtypes, isna().mean(), duplicated().sum() — sebelum plot apapun.",
    },
    {
      id: "univariat",
      eyebrow: "Langkah 3 · Univariat",
      title: "Mean lawan median: sinyal skew",
      prose: [
        "Mean plafon Rp 68,6 juta, median Rp 55 juta — mean jauh di atas median menandakan skew kanan (outlier 200jt menariknya). Skewness di profil adalah sinyal: skew tinggi berarti pakai median atau log-transform, bukan mean.",
        "Red flag kardinalitas: kolom 'kategori' dengan 5.000 nilai unik dari 10.000 baris berarti data kotor (typo, case beda) atau sebenarnya ID. Normalisasi dulu, baru analisis.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `mean_plafon` dan `median_plafon` (abaikan NaN)" },
        { id: "t2", text: "Hitung `selisih` = mean - median, tentukan `skew_kanan` (bool)" },
      ],
      expected: "mean=68636364  median=55000000  skew_kanan=True",
      note: {
        title: "Sering salah",
        body: "Melaporkan mean tanpa melihat median. Untuk data skew, mean menyesatkan — median mewakili tipikal. Selalu bandingkan keduanya di langkah univariat.",
      },
      hints: [
        "mean_plafon = df['plafon'].mean() — NaN otomatis diabaikan.",
        "selisih = mean_plafon - median_plafon.",
        "skew_kanan = selisih > 0",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_KREDIT}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nmean_plafon = \nmedian_plafon = \nselisih = \nskew_kanan = \n\nprint(f"mean={mean_plafon:.0f}  median={median_plafon:.0f}  skew_kanan={skew_kanan}")`,
        lockLines: 4,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_KREDIT}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nmean_plafon = df['plafon'].mean()\nmedian_plafon = df['plafon'].median()\nselisih = mean_plafon - median_plafon\nskew_kanan = selisih > 0\n\nprint(f"mean={mean_plafon:.0f}  median={median_plafon:.0f}  skew_kanan={skew_kanan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_plafon", value: 68636363.64, tol: 1.0, label: "`mean_plafon` sekitar 68636364", msg: "Mean dari 11 nilai valid." },
          { kind: "equal", task: "t1", name: "median_plafon", value: 55000000.0, tol: 1e-9, label: "`median_plafon` = 55000000", msg: "Nilai tengah setelah diurutkan." },
          { kind: "equal", task: "t2", name: "skew_kanan", value: true, label: "`skew_kanan` = True", msg: "Mean >> median = skew kanan (outlier 200jt)." },
          { kind: "stdout_matches", task: "t2", pattern: "skew_kanan=True", label: "`print` menampilkan skew_kanan", msg: "Format: skew_kanan=True." },
        ],
      },
      reference: "mean vs median = detektor skew. Skew tinggi -> median/log, bukan mean.",
    },
    {
      id: "bivariat",
      eyebrow: "Langkah 4 · Bivariat",
      title: "Hubungan — lalu curigai",
      prose: [
        "Korelasi plafon-dpd = -0,42: hubungan negatif lemah-sedang. NPL per kota (count): Jakarta 60%, Surabaya 50%, Bandung 33%, Medan 0%. Tapi n per kota hanya 2-5 — insight pertama wajib dicurigai.",
        "Teknik 5 Whys untuk data: NPL tinggi — kenapa? (bucket menumpuk) — kenapa? (vintage tertentu) — kenapa? Setiap 'kenapa' adalah 1 analisis lanjutan. Dan setiap temuan menarik wajib lolos 3 cek: sumbu kategorikal vs kontinu, duplikat, stratifikasi grup.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `kor` = korelasi plafon-dpd" },
        { id: "t2", text: "Hitung NPL rate per kota, ambil `npl_jkt`" },
      ],
      expected: "kor=-0.42  npl_jkt=60.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "NPL 41,7% terlihat mengerikan — tapi n=12 tidak konklusif. Melaporkan angka tanpa menyebut ukuran sampel adalah cara tercepat kehilangan kepercayaan direksi saat angka direvisi. Selalu laporkan n bersama rate.",
      },
      hints: [
        "kor = df['plafon'].corr(df['dpd']).",
        "npl = df.assign(npl=df['kolektibilitas'] >= 3).groupby('kota')['npl'].mean().",
        "npl_jkt = npl['Jakarta'] * 100",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_KREDIT}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nkor = \nnpl = \nnpl_jkt = \n\nprint(f"kor={kor:.2f}  npl_jkt={npl_jkt:.1f}")`,
        lockLines: 4,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_KREDIT}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nkor = df['plafon'].corr(df['dpd'])\nnpl = df.assign(npl=df['kolektibilitas'] >= 3).groupby('kota')['npl'].mean()\nnpl_jkt = npl['Jakarta'] * 100\n\nprint(f"kor={kor:.2f}  npl_jkt={npl_jkt:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kor", value: -0.417, tol: 0.01, label: "`kor` sekitar -0.42", msg: "Korelasi plafon-dpd dari data." },
          { kind: "equal", task: "t2", name: "npl_jkt", value: 60.0, tol: 1e-09, label: "`npl_jkt` = 60.0", msg: "Jakarta: 3 dari 5 macet (kolektibilitas >= 3)." },
          { kind: "stdout_matches", task: "t2", pattern: "kor=-0\\.42\\s+npl_jkt=60\\.0", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "groupby untuk hubungan kategori; corr untuk numerik. Curigai insight pertama.",
    },
    {
      id: "dokumentasi",
      eyebrow: "Langkah 5 · Sintesis",
      title: "Dokumentasi: EDA yang hilang = tak pernah ada",
      prose: [
        "Catat dengan struktur: pertanyaan, jawaban, validasi, tindak lanjut. Contoh: Q 'NPL per kota?' A 'Jakarta 60% tertinggi (3 dari 5)' validasi 'n=5, kecil — tidak signifikan' tindak 'kumpulkan data 6 bulan'.",
        "Untuk atasan: 1 halaman — konteks, 3 temuan, batasan, rekomendasi. Maksimal. EDA hebat = temuan + kerendahan hati (batasan). Rekomendasi tanpa batasan adalah kecerobohan.",
      ],
      tasks: [],
      reference: "Konteks -> 3 temuan -> batasan -> rekomendasi. 1 halaman + lampiran.",
    },
    {
      id: "advanced-jebakan",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: otomasi profiling, jebakan kardinalitas, pola missingness",
      prose: [
        "Tiga pendalaman EDA yang memisahkan eksplorasi turis dari interogasi analis. Pertama, OTOMASI PROFILING: library seperti ydata-profiling menghasilkan laporan lengkap (distribusi, korelasi, missing, duplikat) dalam satu perintah — senjata hebat untuk 10 menit pertama. Tetapi aturan seniornya: auto-profile menemukan KANDIDAT, bukan KESIMPULAN — ia tidak tahu pertanyaan bisnismu dan tidak tahu mana anomali yang wajar vs yang salah. Pola yang benar: profiling otomatis untuk memetakan medan, lalu EDA berbasis hipotesis untuk sisanya. Untuk data raksasa: profile SAMPEL yang representatif (100 ribu baris cukup untuk distribusi), bukan 100 juta baris yang butuh 3 jam; dan profile SEBELUM dan SESUDAH cleaning, lalu bandingkan — apakah cleaning-mu benar-benar memperbaiki yang dikira?",
        "Kedua, JEBAKAN KARDINALITAS: value_counts pada kolom 1 juta nilai unik (user_id, transaction_id) bukan insight — ia ledakan memori yang menyamar sebagai analisis. Tiga aturan: (1) kardinalitas mendekati jumlah baris berarti itu IDENTIFIER, bukan prediktor — keluarkan dari analisis; (2) untuk kategorikal berkardinalitas tinggi yang bermakna (kode produk, kota), batasi ke top-k + 'lainnya' — ekor panjangnya noise; (3) groupby pada kardinalitas tinggi menghasilkan 1 juta grup yang lambat dan tidak terbaca — agregasi butuh granularitas yang bisa dicerna manusia. Rasio cepat: n_unique / n_rows mendekati 1 berarti ID; di bawah 0,01 berarti kategorikal sehat; di antaranya, pikirkan top-k.",
        "Ketiga, POLA MISSINGNESS: data hilang bukan sekadar soal 'diisi apa' — melainkan 'MENGAPA hilang', karena mekanismenya menentukan penanganannya. MCAR (hilang acak sempurna): jarang di dunia nyata; imputasi sederhana aman. MAR (hilang tergantung variabel teramati — pendapatan lebih sering hilang untuk segmen mikro): imputasi harus memakai variabel terkait. MNAR (hilang tergantung nilainya sendiri — pendapatan RENDAH yang tidak dilaporkan): imputasi apa pun bias; penanganan jujurnya adalah memodelkan mekanisme hilangnya. Insight yang paling sering terlewat: missingness ITU SENDIRI adalah fitur — kolom 'apakah pendapatan hilang' sering lebih prediktif dari pendapatannya. Visualisasikan matriks missing (heatmap null per kolom per periode): missing TERSTRUKTUR (blok hilang untuk periode/wilayah tertentu) menandakan kegagalan pipeline, bukan keacakan. Praktikkan di lab: buktikan missing terstruktur dari angkanya, bukan dari feeling.",
      ],
      tasks: [],
      reference: "Auto-profile = kandidat, bukan kesimpulan. Kardinalitas ~ n_rows = ID. Missing: kenali mekanismenya (MCAR/MAR/MNAR); missingness itu sendiri adalah fitur.",
    },
    {
      id: "minicase-missing",
      eyebrow: "Langkah 7 · Mini-case",
      requires: ["pandas", "numpy"],
      title: "Mini-case: 20% data hilang — dan itu bukan kebetulan",
      prose: [
        "Skenario (angka konkret): dataset 5.000 debitur; kolom pendapatan 20% hilang. Analis junior mengisi dengan median (Rp 8 juta) dan lanjut modeling. Kamu memeriksa pola: missing 40% di segmen mikro, 0% di ritel dan korporat. Artinya: yang hilang bukan acak — debitur mikro dengan pendapatan rendah tidak melaporkan pendapatannya (MNAR). Imputasi median mengisi mereka dengan Rp 8 juta: pendapatan segmen mikro terlihat 60% lebih tinggi dari realitas, model risiko meremehkan segmen mikro, dan limit kredit yang diberikan kebablasan Rp 3,1 miliar di atas profil risiko yang benar.",
        "Pertanyaan analisis: (1) Bagaimana membuktikan missing terstruktur dari angka? (2) Mengapa imputasi median salah di sini? (3) Penanganan apa yang jujur?",
        "Pembahasan: (1) Hitung tingkat missing per segmen — 40% vs 0% vs 0% bukan keacakan (praktikkan di lab). (2) Median dihitung dari yang MELAPOR — mengisi yang tidak melapor dengan nilai pelapor mengasumsikan keduanya sama, padahal mekanisme hilangnya justru berkorelasi dengan nilainya (yang rendah yang hilang). (3) Tiga opsi jujur: tambah kolom indikator 'pendapatan_hilang' sebagai fitur (missingness adalah sinyal); imputasi bersyarat per segmen dengan catatan asumsi; atau modelkan mekanisme hilangnya bila keputusan bernilai besar. Yang tidak jujur: imputasi buta lalu diam.",
        "Kaitan ke karier: 'berapa persen missing' adalah pertanyaan junior; 'di mana missing-nya terkonsentrasi' adalah pertanyaan senior. Jawaban kedua yang mengubah keputusan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `miss_total` dan `miss_per_segmen` (rata-rata isna per segmen)" },
        { id: "t2", text: "Tentukan `pola`: 'MNAR-terstruktur' bila miss_mikro > 0.3 dan miss_ritel < 0.01" },
      ],
      expected: "miss_total sekitar 0.20, miss_mikro sekitar 0.40, pola=MNAR-terstruktur",
      hints: [
        "miss_total = df['pendapatan'].isna().mean().",
        "miss_per_segmen = df['pendapatan'].isna().groupby(df['segmen']).mean().",
        "Ambil miss_mikro = miss_per_segmen['mikro'], miss_ritel = miss_per_segmen['ritel'].",
      ],
      code: {
        starter: `import pandas as pd\nimport numpy as np\n\nrng = np.random.default_rng(33)\nn = 5000\nsegmen = rng.choice(["mikro", "ritel", "korporat"], n, p=[0.5, 0.35, 0.15])\npendapatan = rng.normal(8_000_000, 2_000_000, n).clip(1_000_000)\n# pola TERSTRUKTUR: 40% pendapatan segmen mikro hilang (MNAR: yang tak dilaporkan)\nhilang = (segmen == "mikro") & (rng.random(n) < 0.4)\npendapatan = np.where(hilang, np.nan, pendapatan)\ndf = pd.DataFrame({"segmen": segmen, "pendapatan": pendapatan})\nprint("baris:", len(df))\n\n# TULIS KODEMU: buktikan missing-nya terstruktur, bukan acak\nmiss_total =\nmiss_per_segmen =\nmiss_mikro =\nmiss_ritel =\n\npola = "MNAR-terstruktur" if miss_mikro > 0.3 and miss_ritel < 0.01 else "acak"\nprint(f"miss_total={miss_total:.3f}")\nprint(miss_per_segmen.round(3).to_dict())\nprint(f"miss_mikro={miss_mikro:.3f} pola={pola}")\n`,
        lockLines: 13,
        solution: `import pandas as pd\nimport numpy as np\n\nrng = np.random.default_rng(33)\nn = 5000\nsegmen = rng.choice(["mikro", "ritel", "korporat"], n, p=[0.5, 0.35, 0.15])\npendapatan = rng.normal(8_000_000, 2_000_000, n).clip(1_000_000)\n# pola TERSTRUKTUR: 40% pendapatan segmen mikro hilang (MNAR: yang tak dilaporkan)\nhilang = (segmen == "mikro") & (rng.random(n) < 0.4)\npendapatan = np.where(hilang, np.nan, pendapatan)\ndf = pd.DataFrame({"segmen": segmen, "pendapatan": pendapatan})\nprint("baris:", len(df))\n\n# TULIS KODEMU: buktikan missing-nya terstruktur, bukan acak\nmiss_total = df["pendapatan"].isna().mean()\nmiss_per_segmen = df["pendapatan"].isna().groupby(df["segmen"]).mean()\nmiss_mikro = miss_per_segmen["mikro"]\nmiss_ritel = miss_per_segmen["ritel"]\n\npola = "MNAR-terstruktur" if miss_mikro > 0.3 and miss_ritel < 0.01 else "acak"\nprint(f"miss_total={miss_total:.3f}")\nprint(miss_per_segmen.round(3).to_dict())\nprint(f"miss_mikro={miss_mikro:.3f} pola={pola}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "miss_per_segmen", label: "`miss_per_segmen` terdefinisi", msg: "Groupby segmen atas boolean isna, lalu mean." },
          { kind: "equal", task: "t1", name: "miss_mikro", value: 0.4, tol: 0.03, label: "`miss_mikro` sekitar 0.40", msg: "40% pendapatan segmen mikro hilang (sesuai desain data)." },
          { kind: "stdout_matches", task: "t2", pattern: "pola=MNAR-terstruktur", label: "Pola teridentifikasi", msg: "Missing terkonsentrasi di mikro = terstruktur (MNAR), bukan acak." },
        ],
      },
      reference: "Missing per segmen dulu; 40% vs 0% = terstruktur. Imputasi buta atas MNAR = bias yang dirapikan.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: EDA adalah interogasi, bukan tur",
      prose: [
        "Heuristik penutup: data tidak berbohong — tetapi ia menjawab persis apa yang ditanyakan, termasuk pertanyaan yang salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: EDA adalah interogasi, bukan tur",
        body: "Heuristik pertama: mulai dari PERTANYAAN, bukan dari plot — 'apakah segmen mikro lebih berisiko' menghasilkan 3 chart yang tajam; 'lihat-lihat data' menghasilkan 50 chart yang tidak menghasilkan keputusan. Setiap chart harus punya hipotesis yang bisa salah. Heuristik kedua: curigai data yang terlalu rapi — tidak ada missing, tidak ada outlier, distribusi sempurna sering berarti data sudah dibersihkan orang lain dengan asumsi yang tidak kamu ketahui; tanyakan siapa membersihkan dan apa yang dibuang. Heuristik ketiga: keanehan adalah undangan, bukan gangguan — spike di satu jam, missing terstruktur, kategori dengan 1 baris: selidiki sebelum menghapus; di sanalah fraud, bug pipeline, dan insight bersembunyi. Heuristik keempat: output EDA adalah DAFTAR KEPUTUSAN, bukan galeri chart — 'drop kolom X (99% missing terkonsentrasi di...)', 'cap outlier di... karena...', 'pisahkan analisis segmen mikro'. Bila EDA-mu tidak mengubah satu pun keputusan downstream, itu tur, bukan interogasi. Dan yang paling senior: dokumentasikan yang MENGEJUTKAN — temuan yang membuatmu berhenti scroll adalah temuan yang akan ditanyakan atasanmu 3 bulan lagi; tulis sekarang selagi konteksnya segar.",
      },
      reference: "Pertanyaan dulu, plot kemudian; curigai yang terlalu rapi; keanehan = undangan; output = daftar keputusan.",
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
          q: "Langkah pertama EDA...",
          options: [
            { text: "Bivariat", why: "Bivariat adalah langkah 4 — setelah kualitas." },
            { text: "Gambaran + kualitas (jangan lompat)", why: "Urut: insight dari data kotor = sampah.", correct: true },
            { text: "Modeling", why: "Modeling jauh setelah EDA." },
            { text: "Presentasi", why: "Presentasi adalah langkah terakhir." },
          ],
        },
        {
          q: "Insight pertama sebaiknya...",
          options: [
            { text: "Langsung presentasi", why: "Berbahaya — belum divalidasi." },
            { text: "Dicurigai dan divalidasi berlapis", why: "Insight EDA = hipotesis, bukan kesimpulan.", correct: true },
            { text: "Diabaikan", why: "Jangan abaikan — validasi." },
            { text: "Disebar ke tim", why: "Belum saatnya sebelum validasi." },
          ],
        },
        {
          q: "Korelasi 0.8 artinya...",
          options: [
            { text: "Kausalitas", why: "Korelasi tidak pernah berarti kausalitas." },
            { text: "Hubungan kuat, bukan kausalitas", why: "Kuat ya; sebab-akibat belum tentu.", correct: true },
            { text: "Tidak ada hubungan", why: "0.8 adalah hubungan kuat." },
            { text: "Error", why: "0.8 nilai valid." },
          ],
        },
        {
          q: "Mean jauh di atas median menandakan...",
          options: [
            { text: "Data normal", why: "Data normal: mean sekitar median." },
            { text: "Skew kanan (outlier) — pakai median/log", why: "Sinyal dari profil univariat.", correct: true },
            { text: "Error", why: "Bukan error — pola data." },
            { text: "Data bersih", why: "Skew bukan ukuran kebersihan." },
          ],
        },
      ],
      summary: [
        "Workflow: gambaran -> kualitas -> univariat -> bivariat -> waktu -> sintesis.",
        "Mulai dengan pertanyaan tertulis; akhiri dengan dokumentasi.",
        "Curigai insight pertama; validasi berlapis (5 Whys).",
        "Lapor: 3 temuan + 1 rekomendasi + batasan (jujur!).",
        "n kecil = tidak konklusif: laporkan n bersama rate.",
      ],
      next: { label: "D10 — Feature Engineering", href: "/v2/learn/d10-feature-engineering" },
    },
  ],
};
