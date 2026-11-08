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
  estMinutes: 75,
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
          id: "gap-r8-eda-temporal",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G23)",
          title: "Langkah 5 yang akhirnya bekerja: EDA temporal yang operasional",
          prose: [
            "Workflow lesson ini menaruh WAKTU sebagai langkah ke-5 — tetapi dataset 12 barisnya tidak punya kolom tanggal sama sekali, sehingga langkah itu tidak pernah bisa dipraktikkan. Langkah ini memperbaikinya dengan cara yang jujur: beri tiap baris bulan pencairan (Jan–Mar 2026, id 1–4 = Januari, 5–8 = Februari, 9–12 = Maret — penugasan didaktik untuk lab ini) dan jalankan tiga analisis temporal yang operasional. Satu, AGREGASI PER PERIODE: NPL per bulan — Januari 1/4 = 25%, Februari 1/4 = 25%, Maret 3/4 = 75%. Dua, TREN: NPL datar lalu melonjak di Maret — pertanyaan lanjutnya bukan 'Maret lebih buruk?' melainkan 'apa yang berubah di Maret: vintage baru? kebijakan baru? segmen baru?' Tiga, MISSINGNESS SEPANJANG WAKTU: plafon hilang hanya di Maret (id 12) — 0%, 0%, 25% per bulan. Missing yang muncul tiba-tiba di satu periode adalah sinyal PERUBAHAN PROSES (sistem baru? formulir baru?), bukan sifat data.",
            "Tiga teknik yang membuat analisis temporal operasional (bukan sekadar 'plot per bulan'): ROLLING — rata-rata bergerak 3 bulan menghaluskan noise bulanan (dengan 3 bulan data, rolling-nya masih ilustrasi — jujurlah soal itu); GROUBY PERIODE + UKURAN — selalu tampilkan n per periode di samping ratenya (75% dari n=4 bukan 75% dari n=400); dan PERUBAHAN MISSINGNESS — hitung % missing per periode untuk tiap kolom, karena missing yang berubah sepanjang waktu merusak tren apa pun yang kamu hitung dari kolom itu. Dan satu peringatan: 3 bulan tidak bisa membuktikan MUSIMAN — 'Maret selalu buruk' butuh beberapa tahun data; yang bisa dikatakan dari 3 bulan hanyalah 'ada lonjakan di Maret yang perlu diselidiki'.",
          ],
          formula: String.raw`\text{NPL}_{\text{bulan}} = \frac{\text{kolektibilitas} \ge 3 \text{ di bulan itu}}{\text{total bulan itu}} \qquad \text{missing}_{\text{bulan}} = \frac{\text{plafon hilang}}{\text{total bulan itu}}`,
          formulaNote: "NPL: Jan 25%, Feb 25%, Mar 75%. Missing plafon: Jan 0%, Feb 0%, Mar 25% (id 12).",
          tasks: [
            { id: "t1", text: "Hitung NPL per bulan: `npl_jan`, `npl_feb`, `npl_mar` (%, 1 desimal)" },
            { id: "t2", text: "Hitung missing plafon per bulan: `miss_jan`, `miss_feb`, `miss_mar` (%, 1 desimal)" },
          ],
          expected: "npl_jan=25.0 npl_feb=25.0 npl_mar=75.0 miss_jan=0.0 miss_feb=0.0 miss_mar=25.0",
          hints: [
            "NPL = kolektibilitas ≥ 3. Jan: id 1–4 (1,2,3,1); Feb: id 5–8 (4,1,2,1); Mar: id 9–12 (5,1,3,5).",
            "Plafon hilang hanya id 12 (Maret).",
          ],
          code: {
            starter: `# (bulan, kolektibilitas, plafon_hilang?) — 12 baris kanonis d9\nrows = [("Jan", 1, False), ("Jan", 2, False), ("Jan", 3, False), ("Jan", 1, False),\n        ("Feb", 4, False), ("Feb", 1, False), ("Feb", 2, False), ("Feb", 1, False),\n        ("Mar", 5, False), ("Mar", 1, False), ("Mar", 3, False), ("Mar", 5, True)]\n\n# TULIS KODEMU: NPL % dan missing % per bulan\nnpl_jan =\nnpl_feb =\nnpl_mar =\nmiss_jan =\nmiss_feb =\nmiss_mar =\n\nprint(f"npl_jan={npl_jan} npl_feb={npl_feb} npl_mar={npl_mar} miss_jan={miss_jan} miss_feb={miss_feb} miss_mar={miss_mar}")`,
            lockLines: 6,
            solution: `# (bulan, kolektibilitas, plafon_hilang?) — 12 baris kanonis d9\nrows = [("Jan", 1, False), ("Jan", 2, False), ("Jan", 3, False), ("Jan", 1, False),\n        ("Feb", 4, False), ("Feb", 1, False), ("Feb", 2, False), ("Feb", 1, False),\n        ("Mar", 5, False), ("Mar", 1, False), ("Mar", 3, False), ("Mar", 5, True)]\n\n# TULIS KODEMU: NPL % dan missing % per bulan\n# kolektibilitas >= 3 dihitung manual per bulan agar transparan\nnpl_jan = round(sum(1 for b, k, _ in rows if b == "Jan" and k >= 3) / 4 * 100, 1)\nnpl_feb = round(sum(1 for b, k, _ in rows if b == "Feb" and k >= 3) / 4 * 100, 1)\nnpl_mar = round(sum(1 for b, k, _ in rows if b == "Mar" and k >= 3) / 4 * 100, 1)\nmiss_jan = round(sum(1 for b, _, m in rows if b == "Jan" and m) / 4 * 100, 1)\nmiss_feb = round(sum(1 for b, _, m in rows if b == "Feb" and m) / 4 * 100, 1)\nmiss_mar = round(sum(1 for b, _, m in rows if b == "Mar" and m) / 4 * 100, 1)\n\nprint(f"npl_jan={npl_jan} npl_feb={npl_feb} npl_mar={npl_mar} miss_jan={miss_jan} miss_feb={miss_feb} miss_mar={miss_mar}")`,
            checks: [
              { kind: "equal", task: "t1", name: "npl_jan", value: 25.0, tol: 0.1, label: "`npl_jan` = 25%", msg: "1 dari 4 (id 3) kolektibilitas ≥ 3." },
              { kind: "equal", task: "t1", name: "npl_feb", value: 25.0, tol: 0.1, label: "`npl_feb` = 25%", msg: "1 dari 4 (id 5) kolektibilitas ≥ 3." },
              { kind: "equal", task: "t1", name: "npl_mar", value: 75.0, tol: 0.1, label: "`npl_mar` = 75%", msg: "3 dari 4 (id 9, 11, 12) — lonjakan yang perlu diselidiki, bukan disimpulkan." },
              { kind: "equal", task: "t2", name: "miss_jan", value: 0.0, tol: 0.1, label: "`miss_jan` = 0%", msg: "Tidak ada plafon hilang di Januari." },
              { kind: "equal", task: "t2", name: "miss_feb", value: 0.0, tol: 0.1, label: "`miss_feb` = 0%", msg: "Tidak ada plafon hilang di Februari." },
              { kind: "equal", task: "t2", name: "miss_mar", value: 25.0, tol: 0.1, label: "`miss_mar` = 25%", msg: "1 dari 4 (id 12) — missing muncul tiba-tiba di Maret: sinyal perubahan proses." },
              { kind: "stdout_matches", task: "t2", pattern: "npl_jan=25\\.0\\s+npl_feb=25\\.0\\s+npl_mar=75\\.0\\s+miss_jan=0\\.0\\s+miss_feb=0\\.0\\s+miss_mar=25\\.0", label: "`print` menampilkan keenamnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "NPL Maret 75% (3 dari 4) vs Januari 25% (1 dari 4). Kesimpulan yang benar?",
              options: [
                { text: "'Ada lonjakan di Maret yang perlu diselidiki' — bukan 'Maret selalu buruk'", why: "Tepat: n=4 per bulan terlalu kecil untuk vonis, dan 3 bulan tidak bisa membuktikan musiman.", correct: true },
                { text: "Maret tiga kali lebih berisiko — hentikan pencairan di Maret", why: "Salah: 75% dari n=4 punya interval yang sangat lebar; keputusan bisnis dari 4 baris adalah kecerobohan." },
                { text: "Tidak ada apa-apa — 25% ke 75% masih dalam noise", why: "Salah: 'masih dalam noise' pun butuh hitungan (langkah berikutnya) — dan missing plafon yang muncul di Maret adalah sinyal proses yang terpisah." },
                { text: "Vintage Maret memang buruk — ganti kebijakan underwriting", why: "Salah: vintage, kebijakan, dan segmen belum dipisahkan — lonjakan agregat tidak menunjuk penyebabnya." },
              ],
            },
          ],
          reference: "EDA temporal = agregasi per periode + n per periode + rolling + missingness per periode. 3 bulan = lonjakan yang diselidiki, bukan musiman.",
        },
        {
          id: "gap-r8-rate-sampel-kecil",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G24)",
          title: "'Jakarta 60% vs Medan 0%': dua angka yang sama-sama tidak bisa dipercaya",
          prose: [
            "Lesson ini memperingatkan 'n per kota hanya 2–5 — insight pertama wajib dicurigai' — tetapi tidak menunjukkan SEBERAPA besar keraguannya. Mari kuantifikasi dengan interval Wilson 95% (interval yang tepat untuk proporsi sampel kecil). Jakarta: 3 NPL dari 5 → 60%, tetapi intervalnya (23,1%; 88,2%) — lebar 65 poin! 'Tertinggi' 60% itu cocok dengan tingkat sebenarnya 25% maupun 85%. Medan: 0 dari 2 → 0%, intervalnya (0%; 65,8%) — '0%' cocok dengan tingkat sebenarnya sampai 65,8%! Peringkat 'Jakarta tertinggi, Medan 0%' adalah peringkat dari dua angka yang intervalnya tumpang tindih hampir total.",
            "Obatnya bukan 'kumpulkan data lalu diam' — melainkan SHRINKAGE: tarik tiap estimasi kota menuju rata-rata keseluruhan (5/12 = 41,7%) dengan kekuatan yang tergantung n-nya. Dengan prior sekuat 4 observasi: Jakarta (3 + 4×0,4167)/(5 + 4) = 51,9%; Medan (0 + 4×0,4167)/(2 + 4) = 27,8%. Peringkatnya tetap Jakarta > Medan — tetapi selisihnya menyusut dari 60 poin menjadi 24 poin, dan keduanya kini 'berbicara' dengan kerendahan hati yang sesuai n-nya. Shrinkage bukan memalsukan data — ia mengakui bahwa estimasi dari n kecil seharusnya tidak jauh-jauh dari rata-rata keseluruhan sampai data membuktikan sebaliknya.",
            "Aturan: JANGAN PERNAH melaporkan rate per grup tanpa (a) n-nya, (b) intervalnya (Wilson untuk n kecil), dan (c) versi shrinkage-nya bila n < 30. 'Jakarta 60% (n=5, CI 23–88%)' adalah kalimat analis; 'Jakarta 60%' telanjang adalah kalimat koran.",
          ],
          formula: String.raw`\text{Wilson 95\%} = \frac{\hat{p} + z^2/2n \pm z\sqrt{\hat{p}(1-\hat{p})/n + z^2/4n^2}}{1 + z^2/n} \qquad \text{shrinkage} = \frac{x + k\,p_0}{n + k}`,
          formulaNote: "Jakarta 3/5: 60%, Wilson (23,1%; 88,2%), shrinkage 51,9%. Medan 0/2: 0%, Wilson (0%; 65,8%), shrinkage 27,8%. (k = 4, p0 = 41,7%.)",
          tasks: [
            { id: "t1", text: "Hitung interval Wilson 95% Jakarta (3/5) dan Medan (0/2): `jkt_lo`, `jkt_hi`, `medan_lo`, `medan_hi` (%, 1 desimal)" },
            { id: "t2", text: "Hitung shrinkage (k=4, p0=5/12): `shrink_jkt`, `shrink_medan` (%, 1 desimal)" },
          ],
          expected: "jkt_lo=23.1 jkt_hi=88.2 medan_lo=0.0 medan_hi=65.8 shrink_jkt=51.9 shrink_medan=27.8",
          hints: [
            "Wilson: z = 1,96; pusat = (p + z²/2n)/(1 + z²/n); setengah-lebar = z·√(p(1−p)/n + z²/4n²)/(1 + z²/n).",
            "Shrinkage = (x + k·p0)/(n + k) × 100%.",
          ],
          code: {
            starter: `import math\n\nz = 1.96; k = 4; p0 = 5 / 12\n\ndef wilson(x, n):\n    p = x / n; d = 1 + z * z / n\n    c = (p + z * z / (2 * n)) / d\n    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d\n    return round(max(0.0, c - h) * 100, 1), round(min(1.0, c + h) * 100, 1)\n\n# TULIS KODEMU: Wilson Jakarta (3/5) + Medan (0/2), lalu shrinkage\njkt_lo, jkt_hi = wilson(3, 5)\nmedan_lo, medan_hi = wilson(0, 2)\nshrink_jkt =\nshrink_medan =\n\nprint(f"jkt_lo={jkt_lo} jkt_hi={jkt_hi} medan_lo={medan_lo} medan_hi={medan_hi} shrink_jkt={shrink_jkt} shrink_medan={shrink_medan}")`,
            lockLines: 11,
            solution: `import math\n\nz = 1.96; k = 4; p0 = 5 / 12\n\ndef wilson(x, n):\n    p = x / n; d = 1 + z * z / n\n    c = (p + z * z / (2 * n)) / d\n    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d\n    return round(max(0.0, c - h) * 100, 1), round(min(1.0, c + h) * 100, 1)\n\n# TULIS KODEMU: Wilson Jakarta (3/5) + Medan (0/2), lalu shrinkage\njkt_lo, jkt_hi = wilson(3, 5)\nmedan_lo, medan_hi = wilson(0, 2)\nshrink_jkt = round((3 + k * p0) / (5 + k) * 100, 1)\nshrink_medan = round((0 + k * p0) / (2 + k) * 100, 1)\n\nprint(f"jkt_lo={jkt_lo} jkt_hi={jkt_hi} medan_lo={medan_lo} medan_hi={medan_hi} shrink_jkt={shrink_jkt} shrink_medan={shrink_medan}")`,
            checks: [
              { kind: "equal", task: "t1", name: "jkt_lo", value: 23.1, tol: 0.5, label: "`jkt_lo` = 23,1%", msg: "Batas bawah Wilson untuk 3/5." },
              { kind: "equal", task: "t1", name: "jkt_hi", value: 88.2, tol: 0.5, label: "`jkt_hi` = 88,2%", msg: "Batas atas Wilson untuk 3/5 — lebar 65 poin." },
              { kind: "equal", task: "t1", name: "medan_lo", value: 0.0, tol: 0.5, label: "`medan_lo` = 0%", msg: "Batas bawah 0/2." },
              { kind: "equal", task: "t1", name: "medan_hi", value: 65.8, tol: 0.5, label: "`medan_hi` = 65,8%", msg: "'0%' dari n=2 cocok dengan tingkat sebenarnya sampai 65,8%." },
              { kind: "equal", task: "t2", name: "shrink_jkt", value: 51.9, tol: 0.5, label: "`shrink_jkt` = 51,9%", msg: "(3 + 1,67)/9 = 51,9%." },
              { kind: "equal", task: "t2", name: "shrink_medan", value: 27.8, tol: 0.5, label: "`shrink_medan` = 27,8%", msg: "(0 + 1,67)/6 = 27,8%." },
              { kind: "stdout_matches", task: "t2", pattern: "jkt_lo=23\\.1\\s+jkt_hi=88\\.2\\s+medan_lo=0\\.0\\s+medan_hi=65\\.8\\s+shrink_jkt=51\\.9\\s+shrink_medan=27\\.8", label: "`print` menampilkan keenamnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Kota A: NPL 60% (n=5). Kota B: NPL 0% (n=2). Mana pernyataan yang benar?",
              options: [
                { text: "Keduanya tidak bisa dipercaya telanjang — interval A (23–88%) dan B (0–66%) tumpang tindih", why: "Tepat: peringkat dari dua interval yang tumpang tindih hampir total bukan peringkat.", correct: true },
                { text: "A jelas lebih berisiko — 60% vs 0%", why: "Salah: 60% dari n=5 punya CI 23–88%; 0% dari n=2 punya CI 0–66%. Selisihnya belum terbukti." },
                { text: "B jelas aman — 0% berarti tidak ada NPL", why: "Salah: 0 dari 2 hanya berarti belum terlihat — intervalnya mencapai 65,8%." },
                { text: "Kumpulkan 6 bulan data, lalu laporkan ratenya saja", why: "Salah: data lebih banyak membantu, tetapi rate tetap wajib dilaporkan beserta n dan intervalnya." },
              ],
            },
          ],
          reference: "Rate per grup wajib membawa n + interval Wilson + shrinkage (n kecil). Jakarta 60% (n=5, CI 23–88%); Medan 0% (n=2, CI 0–66%).",
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
