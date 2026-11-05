import type { V2Lesson } from "../lib/types";

export const a17: V2Lesson = {
  slug: "a17-missing-data",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.7 Missing Data: Lubang yang (Kadang) Bercerita",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-sinta",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model AUC 0,91 yang gagal di produksi",
      prose: [
        "Sinta, analis kredit di sebuah bank, merayakan model scoring-nya mencapai AUC 0,91 di data training. Model di-deploy. Enam bulan kemudian, angka default 2,3× lipat dari prediksi. Ia membongkar pipeline dan menemukan: di training, semua baris dengan kolom penghasilan kosong dihapus biar bersih. Di produksi, baris yang sama diisi median oleh skrip ETL biar tidak error.",
        "Twist-nya: kelompok penghasilan kosong itu default 3× lebih sering daripada rata-rata. Model Sinta tidak pernah belajar mengenali mereka — di training mereka dibuang, di produksi mereka disamarkan jadi nasabah median yang aman. Lubang di dataset bukan selalu kekosongan. Kadang, lubang itu sendiri adalah pesannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `realita` = 2,3 × prediksi default (prediksi = 2,0%)" },
        { id: "t2", text: "Hitung `missing` = 3 × rata-rata default (rata-rata = 3,0%)" },
      ],
      expected: "realita=4.6  missing=9.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perlakuan missing yang berbeda antara training dan produksi adalah risiko model yang nyata: model tidak pernah belajar mengenali kelompok berisiko tertinggi, lalu di produksi kelompok itu disamarkan. Pipeline training dan serving harus memakai aturan missing yang identik.",
      },
      hints: [
        "realita = 2,3 × 2,0.",
        "missing = 3 × 3,0.",
        "missing = 3 * 3.0",
      ],
      code: {
        starter: `prediksi = 2.0   # % default prediksi\nrata2 = 3.0      # % default rata-rata\n\n# TULIS KODEMU\nrealita = \nmissing = \n\nprint(f"realita={realita}  missing={missing}")`,
        lockLines: 2,
        solution: `prediksi = 2.0   # % default prediksi\nrata2 = 3.0      # % default rata-rata\n\n# TULIS KODEMU\nrealita = 2.3 * prediksi\nmissing = 3 * rata2\n\nprint(f"realita={realita}  missing={missing}")`,
        checks: [
          { kind: "equal", task: "t1", name: "realita", value: 4.6, tol: 1e-9, label: "`realita` seharusnya 4.6", msg: "2,3 × 2,0 = 4,6%." },
          { kind: "equal", task: "t2", name: "missing", value: 9.0, tol: 1e-9, label: "`missing` seharusnya 9.0", msg: "3 × 3,0 = 9,0% — kelompok missing adalah segmen risiko tersendiri." },
          { kind: "stdout_matches", task: "t2", pattern: "realita=4\\.6\\s+missing=9(\\.0)?", label: "`print` menampilkan keduanya", msg: "Format: realita=...  missing=... ." },
        ],
      },
      reference: "Kelompok missing bisa jadi kelompok berisiko tertinggi — jangan buang tanpa analisis.",
    },
    {
      id: "mcar",
      eyebrow: "Langkah 2 · MCAR",
      title: "MCAR: kebetulan murni yang jujur",
      prose: [
        "MCAR (Missing Completely At Random): hilangnya tidak berhubungan dengan apapun — tidak dengan nilai yang hilang, tidak dengan variabel lain. Murni kecelakaan: sensor rusak acak, file corrupt saat transfer, halaman kuesioner robek di percetakan. Peluang sebuah data hilang sama saja apapun nilainya — koin yang adil.",
        "Survei 1.000 nasabah: 40 tidak menjawab pertanyaan usia karena halaman robek acak. Robeknya tidak berhubungan dengan usia maupun variabel lain → MCAR. 960 yang tersisa adalah sampel acak yang representatif; hapus 40 baris masih OK secara bias.",
      ],
      formula: String.raw`P(R \mid Y_{obs}, Y_{mis}) = P(R)`,
      formulaNote: "R = indikator missing (1 = hilang); Y_obs = variabel yang teramati; Y_mis = nilai yang hilang; peluang hilang sama untuk semua — tidak bergantung pada apa pun.",
      tasks: [
        { id: "t1", text: "Hitung `sisa` responden setelah 40 baris dihapus" },
        { id: "t2", text: "Hitung `pct` = persen baris yang dihapus" },
      ],
      expected: "sisa=960  pct=4.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "MCAR berarti boleh abaikan missing-nya begitu saja. Salah: tidak bias ≠ tidak ada biaya. Menghapus 20% baris (walau MCAR) membuang 20% informasi: standard error membesar, power turun, interval melebar. Dan MCAR murni jarang — jangan klaim MCAR tanpa bukti (uji Little atau bandingkan distribusi variabel lain antara yang missing vs tidak).",
      },
      hints: [
        "sisa = 1000 − 40.",
        "pct = 40/1000 × 100.",
        "pct = 40/1000*100",
      ],
      code: {
        starter: `n = 1000\nmissing = 40\n\n# TULIS KODEMU\nsisa = \npct = \n\nprint(f"sisa={sisa}  pct={pct}")`,
        lockLines: 2,
        solution: `n = 1000\nmissing = 40\n\n# TULIS KODEMU\nsisa = n - missing\npct = missing/n*100\n\nprint(f"sisa={sisa}  pct={pct}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sisa", value: 960, tol: 1e-9, label: "`sisa` seharusnya 960", msg: "1000 − 40 = 960." },
          { kind: "equal", task: "t2", name: "pct", value: 4.0, tol: 1e-9, label: "`pct` seharusnya 4.0", msg: "40/1000 × 100% = 4%." },
          { kind: "stdout_matches", task: "t2", pattern: "sisa=960\\s+pct=4(\\.0)?", label: "`print` menampilkan keduanya", msg: "Format: sisa=...  pct=... ." },
        ],
      },
      reference: "MCAR + missing < 5% → hapus baris valid, tapi tetap laporkan.",
    },
    {
      id: "mar",
      eyebrow: "Langkah 3 · MAR",
      title: "MAR: meninggalkan jejak di variabel teramati",
      prose: [
        "MAR (Missing At Random): hilangnya berhubungan dengan variabel lain yang teramati — tapi tidak dengan nilai yang hilang itu sendiri setelah mengontrol variabel teramati. Contoh: direktur cenderung tidak mengisi kolom gaji. Data 500 karyawan: kolom gaji 12% kosong. Tabulasi % missing per jabatan: staff 3%, manager 8%, direktur 45%.",
        "Pola jelas: missing berhubungan dengan jabatan (teramati). Kita bisa memprediksi siapa yang missing dari jabatan — dan mengimputasi gaji direktur dari pola gaji direktur lain, bukan dari rata-rata seluruh karyawan. MAR meninggalkan jejak; jejak itu cukup untuk merekonstruksi.",
      ],
      formula: String.raw`P(R \mid Y_{obs}, Y_{mis}) = P(R \mid Y_{obs})`,
      formulaNote: "Hilangnya boleh bergantung pada Y_obs (variabel teramati, misal jabatan) tetapi — setelah mengontrol itu — tidak bergantung pada Y_mis (nilai yang hilang itu sendiri).",
      tasks: [
        { id: "t1", text: "Hitung `miss_dir` = jumlah direktur yang missing (20 direktur, 45%)" },
        { id: "t2", text: "Hitung `total` missing: staff 400×3% + manager 80×8% + direktur" },
      ],
      expected: "miss_dir=9  total=27",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Random' di MAR berarti missing-nya acak. Salah total: ini istilah paling menyesatkan dalam statistika. MAR justru berarti missing-nya sistematis (berpola!) — tapi polanya bisa dijelaskan oleh variabel yang teramati. Random di sini artinya acak setelah mengontrol variabel teramati.",
      },
      hints: [
        "miss_dir = 20 × 0,45.",
        "int() untuk membulatkan ke bawah.",
        "total = int(400*0.03) + int(80*0.08) + miss_dir",
      ],
      code: {
        starter: `# jumlah karyawan per jabatan dan % missing gaji\nstaff, mgr, direktur = 400, 80, 20\n\n# TULIS KODEMU\nmiss_dir = \ntotal = \n\nprint(f"miss_dir={miss_dir}  total={total}")`,
        lockLines: 2,
        solution: `# jumlah karyawan per jabatan dan % missing gaji\nstaff, mgr, direktur = 400, 80, 20\n\n# TULIS KODEMU\nmiss_dir = int(direktur*0.45)\ntotal = int(staff*0.03) + int(mgr*0.08) + miss_dir\n\nprint(f"miss_dir={miss_dir}  total={total}")`,
        checks: [
          { kind: "equal", task: "t1", name: "miss_dir", value: 9, tol: 1e-9, label: "`miss_dir` seharusnya 9", msg: "20 × 45% = 9 direktur bungkam." },
          { kind: "equal", task: "t2", name: "total", value: 27, tol: 1e-9, label: "`total` seharusnya 27", msg: "12 + 6 + 9 = 27." },
          { kind: "stdout_matches", task: "t2", pattern: "miss_dir=9\\s+total=27", label: "`print` menampilkan keduanya", msg: "Format: miss_dir=...  total=... ." },
        ],
      },
      reference: "MAR → imputasi berbasis model (regresi/KNN/MICE) memakai variabel teramati.",
    },
    {
      id: "mnar",
      eyebrow: "Langkah 4 · MNAR",
      title: "MNAR: menghapus jejaknya sendiri",
      prose: [
        "MNAR (Missing Not At Random): hilangnya berhubungan dengan nilai yang hilang itu sendiri — sesuatu yang tidak bisa kita amati. Orang bangkrut tidak melaporkan kebangkrutan; sensor mati justru saat suhu melebihi batasnya. Data yang ada tidak cukup untuk memperbaiki diri sendiri.",
        "Survei pendapatan: respons rate 70%, rata-rata responden Rp 12 juta. Sensus menunjukkan non-responden terkonsentrasi di dua ujung: sangat kaya dan sangat miskin. Rp 12 juta tidak bisa diperbaiki dengan imputasi dari data responden — butuh data eksternal atau model seleksi eksplisit. Yang paling jujur: sensitivity analysis — bagaimana jika non-responden 20% lebih buruk?",
      ],
      formula: String.raw`P(R \mid Y_{obs}, Y_{mis}) \neq P(R \mid Y_{obs})`,
      formulaNote: "Hilangnya tetap bergantung pada Y_mis bahkan setelah mengontrol Y_obs — nilai yang hilang itu sendiri menyebabkan ia hilang; mekanisme paling berbahaya karena tak bisa diverifikasi dari data.",
      tasks: [
        { id: "t1", text: "Hitung `est_baik`: 70% responden (12 jt) + 30% non-responden (8 jt)" },
        { id: "t2", text: "Hitung `est_buruk`: 70% responden (12 jt) + 30% non-responden (6 jt)" },
      ],
      expected: "est_baik=10.8  est_buruk=10.2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "MICE bisa memperbaiki MNAR. Salah: MICE mengasumsikan MAR. Untuk MNAR, MICE hanya mengulang bias dengan rapi — hasilnya terlihat meyakinkan tapi tetap salah arah. MNAR butuh asumsi eksplisit (selection model, pattern-mixture) atau data eksternal.",
      },
      hints: [
        "Estimasi = 0,7×12 + 0,3×(nilai non-responden).",
        "Skenario baik: non-responden 8 jt; buruk: 6 jt.",
        "est_baik = 0.7*12 + 0.3*8",
      ],
      code: {
        starter: `# sensitivity analysis: dua skenario untuk 30% non-responden\nresp = 12  # juta, rata-rata responden\n\n# TULIS KODEMU\nest_baik = \nest_buruk = \n\nprint(f"est_baik={est_baik}  est_buruk={est_buruk}")`,
        lockLines: 2,
        solution: `# sensitivity analysis: dua skenario untuk 30% non-responden\nresp = 12  # juta, rata-rata responden\n\n# TULIS KODEMU\nest_baik = 0.7*resp + 0.3*8\nest_buruk = 0.7*resp + 0.3*6\n\nprint(f"est_baik={est_baik}  est_buruk={est_buruk}")`,
        checks: [
          { kind: "equal", task: "t1", name: "est_baik", value: 10.8, tol: 1e-9, label: "`est_baik` seharusnya 10.8", msg: "0,7×12 + 0,3×8 = 10,8." },
          { kind: "equal", task: "t2", name: "est_buruk", value: 10.2, tol: 1e-9, label: "`est_buruk` seharusnya 10.2", msg: "0,7×12 + 0,3×6 = 10,2." },
          { kind: "stdout_matches", task: "t2", pattern: "est_baik=10\\.8\\s+est_buruk=10\\.2", label: "`print` menampilkan rentang", msg: "Format: est_baik=...  est_buruk=... ." },
        ],
      },
      reference: "MNAR: asumsikan mungkin sampai terbukti sebaliknya, terutama data sensitif.",
    },
    {
      id: "strategi-variansi",
      eyebrow: "Langkah 5 · Strategi penanganan",
      title: "Imputasi mean: menambal lubang dengan ilusi",
      prose: [
        "Strategi defensible per mekanisme: MCAR kecil → hapus baris, laporkan. MAR → imputasi cerdas (MICE/regresi/KNN) + kolom indikator missing — karena faktanya hilang sering prediktif. MNAR → jangan imputasi buta; pakai asumsi eksplisit, data eksternal, atau sensitivity analysis. Missing struktural (alasan_tolak kosong untuk yang disetujui) → jadikan kategori sendiri; mengisinya dengan apapun merusak makna kolom.",
        "Jebakan imputasi mean: semua nilai tambalan identik → tidak menambah variasi → SD underestimate → standard error kekecilan → p-value terlalu optimis → kesimpulan signifikan yang palsu. Data [1,2,3,4,10] dengan 3 missing diimputasi mean (4): SD turun dari 3,54 ke 2,67 — bukan karena data membaik, tapi karena metode berbohong.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sd_awal` dari `d` (2 desimal)" },
        { id: "t2", text: "Hitung `sd_sesudah` dari `d2` (mean-imputed, 2 desimal)" },
      ],
      expected: "sd_awal=3.54  sd_sesudah=2.67",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Setelah imputasi mean, SD turun lalu diklaim data jadi lebih stabil. Salah fatal: penyusutan SD adalah artefak imputasi, bukan perbaikan data. Mengklaim lebih stabil lalu memakai SD itu untuk uji hipotesis = membangun kesimpulan di atas ilusi.",
      },
      hints: [
        "statistics.stdev untuk SD sampel.",
        "d2 = d + [4, 4, 4] (mean = 4).",
        "sd_sesudah = st.stdev(d2)",
      ],
      code: {
        starter: `import statistics as st\n\nd = [1, 2, 3, 4, 10]\nd2 = d + [4, 4, 4]  # 3 missing diimputasi mean\n\n# TULIS KODEMU\nsd_awal = \nsd_sesudah = \n\nprint(f"sd_awal={sd_awal:.2f}  sd_sesudah={sd_sesudah:.2f}")`,
        lockLines: 4,
        solution: `import statistics as st\n\nd = [1, 2, 3, 4, 10]\nd2 = d + [4, 4, 4]  # 3 missing diimputasi mean\n\n# TULIS KODEMU\nsd_awal = st.stdev(d)\nsd_sesudah = st.stdev(d2)\n\nprint(f"sd_awal={sd_awal:.2f}  sd_sesudah={sd_sesudah:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_awal", value: 3.54, tol: 0.01, label: "`sd_awal` sekitar 3.54", msg: "SD sampel dari [1,2,3,4,10] ≈ 3,54." },
          { kind: "equal", task: "t2", name: "sd_sesudah", value: 2.67, tol: 0.01, label: "`sd_sesudah` sekitar 2.67", msg: "Setelah imputasi mean ≈ 2,67 — menyusut artifisial." },
          { kind: "stdout_matches", task: "t2", pattern: "sd_awal=3\\.54\\s+sd_sesudah=2\\.67", label: "`print` menampilkan keduanya", msg: "Format: sd_awal=...  sd_sesudah=... ." },
        ],
      },
      reference: "Jangan isi 0 untuk tidak tahu; jangan imputasi memakai target (leakage).",
    },
    {
      id: "minicase-penghasilan",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Kolom penghasilan 15% kosong",
      prose: [
        "Kamu analis risiko. Dataset 10.000 aplikasi kredit: kolom penghasilan 15% kosong (1.500 aplikasi). Cek pola: yang missing 2× lebih sering wiraswasta dan terkonsentrasi di 3 wilayah. Default rate kelompok missing: 9,1% vs 3,2% populasi. Tim modeling mengusulkan isi saja dengan median biar model bisa jalan.",
        "(a) Mekanisme: MAR mengarah ke MNAR. Pola terkait variabel teramati (wiraswasta, wilayah) → minimal MAR. Tapi default 3× lipat adalah red flag MNAR: nilai penghasilan itu sendiri kemungkinan menyebabkan orang tidak melapor. Perlakukan sebagai MNAR sampai terbukti sebaliknya.",
        "(b) Jangan isi median — itu tragedi Sinta jilid 2: menyamarkan kelompok berisiko 9,1% jadi nasabah median. Yang defensible: MICE memakai pekerjaan/wilayah/usia sebagai prediktor + kolom penghasilan_missing sebagai feature, plus sensitivity analysis. (c) Laporkan ke komite: 15% missing berpola non-acak; kelompok missing adalah segmen risiko tersendiri; model tanpa perlakuan khusus akan systematically underestimate risiko segmen ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Peta keputusan 10 detik: laporkan % missing per kolom dulu. Diagnosis mekanisme dari logika domain + pola di variabel teramati. MCAR kecil → hapus. MAR → MICE + indikator. MNAR → waspada + sensitivity. Struktural → kategori sendiri. Dan dokumentasikan batasannya di model risk documentation.",
      },
      reference: "Kadang hilangnya itu sendiri adalah feature terbaik.",
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
        "MCAR = hilang acak total; MAR = berpola pada variabel teramati; MNAR = hilangnya terkait nilainya sendiri.",
        "Mekanisme menentukan obat: MCAR kecil → hapus; MAR → MICE + indikator; MNAR → asumsi eksplisit + sensitivity.",
        "Imputasi mean merusak variansi secara artifisial → SE kekecilan → p-value terlalu optimis.",
        "Missing struktural jangan diimputasi — jadikan kategori sendiri.",
        "Kadang faktanya hilang adalah sinyal: kolom indikator missing bisa jadi feature terbaik.",
      ],
      next: { label: "A1.8 — Visualisasi", href: "/learn/a18-visualisasi" },
      quiz: [
        {
          q: "Kolom gaji kosong lebih sering untuk jabatan direktur. Mekanisme apa?",
          options: [
            { text: "MCAR", why: "MCAR berarti hilang acak total — di sini ada pola jabatan yang jelas." },
            { text: "MAR", why: "Missing berhubungan dengan variabel teramati (jabatan), bukan acak — tapi polanya bisa diprediksi dari variabel lain.", correct: true },
            { text: "MNAR", why: "MNAR butuh bukti bahwa nilai gaji itu sendiri menyebabkan hilang — belum ada buktinya." },
            { text: "Tidak ada missing", why: "Ada: kolom gaji kosong lebih sering untuk direktur." },
          ],
        },
        {
          q: "Kolom alasan_tolak_pinjaman kosong untuk semua nasabah yang DISETUJUI. Mekanisme apa dan bagaimana menanganinya?",
          options: [
            { text: "MCAR — hapus barisnya", why: "Bukan acak: polanya sempurna mengikuti status persetujuan." },
            { text: "MAR — imputasi dengan KNN", why: "Mengimputasi alasan penolakan untuk yang tidak ditolak merusak makna kolom." },
            { text: "MNAR/struktural — missing-nya bermakna; jangan imputasi, perlakukan sebagai kategori sendiri", why: "Kolom hanya relevan untuk yang ditolak. Jadikan Tidak ditolak sebagai kategori tersendiri.", correct: true },
            { text: "Isi dengan 0", why: "0 bukan alasan penolakan — jangan isi 0 untuk tidak tahu." },
          ],
        },
        {
          q: "Dataset 10.000 baris, kolom penghasilan 15% missing (MAR). Strategi terbaik?",
          options: [
            { text: "Hapus 1.500 baris (listwise)", why: "15% terlalu besar untuk dihapus — buang informasi + potensi bias." },
            { text: "Isi semua dengan mean", why: "Mean merusak variansi dan menyamarkan segmen berisiko." },
            { text: "MICE / imputasi berbasis model + kolom indikator missing", why: "MICE mempertahankan variansi dan jujur soal ketidakpastian; indikator menangkap sinyal dari faktanya hilang.", correct: true },
            { text: "Isi dengan 0", why: "0 merusak makna: penghasilan 0 ≠ penghasilan tidak diketahui." },
          ],
        },
        {
          q: "Setelah imputasi mean pada 30% data, analis melaporkan SD turun dari 2,5 ke 1,8 lalu mengklaim data jadi lebih stabil. Kesalahan fatalnya?",
          options: [
            { text: "Tidak ada — SD turun memang berarti lebih stabil", why: "Penyusutan SD adalah artefak imputasi, bukan cerminan realitas." },
            { text: "SD menyusut artifisial karena nilai imputasi tidak bervariasi; lebih stabil adalah ilusi metode", why: "Semua tambalan identik → tidak menambah variasi. Memakai SD itu untuk uji = membangun kesimpulan di atas ilusi.", correct: true },
            { text: "Seharusnya memakai median, bukan mean", why: "Median pun bermasalah sama: nilai tambalan identik." },
            { text: "Seharusnya menghapus saja 30% datanya", why: "Menghapus 30% membuang informasi besar — bukan solusi otomatis." },
          ],
        },
        {
          q: "Kolom pendapatan_tambahan 40% missing, terbukti MCAR (uji Little tidak signifikan), n = 50.000. Tindakan paling defensible?",
          options: [
            { text: "Isi semua dengan 0 agar dataset lengkap", why: "0 merusak makna kolom." },
            { text: "Hapus baris yang missing — MCAR & n besar, sisa 30.000 baris tetap representatif; laporkan % yang dihapus", why: "MCAR + n besar = listwise deletion valid tanpa bias. Yang wajib: transparansi.", correct: true },
            { text: "Wajib MICE karena missing > 5%", why: "MICE boleh tapi overkill untuk MCAR dengan n sebesar ini." },
            { text: "Buang kolomnya sekalian", why: "Kolom dengan 60% data valid masih bernilai — jangan buang." },
          ],
        },
      ],
      note: {
        title: "Intuisi: data yang hilang tetap bercerita — lewat polanya",
        body: "Lima heuristik. Satu: MCAR, MAR, dan MNAR tidak bisa dibedakan dari data saja — polanya butuh pengetahuan domain; uji statistik atas missingness hanya bisa menolak MCAR, tidak pernah membuktikan MAR. Dua: imputasi mean adalah ilusi presisi — semua tambalan identik sehingga variansi menyusut, standard error kekecilan, dan p-value terlalu optimis; kesimpulan signifikan yang lahir dari sini adalah palsu. Tiga: kolom indikator “apakah missing” sering lebih prediktif daripada nilai imputasinya — fakta bahwa penghasilan kosong memprediksi default 3 kali lipat adalah informasi, bukan masalah. Empat: untuk MNAR, jangan imputasi seolah tidak terjadi apa-apa — modelkan proses hilangnya, lakukan analisis sensitivitas, atau akui batasnya secara eksplisit; kejujuran mengalahkan kepalsuan yang rapi. Lima: laporkan persentase missing per kolom di setiap analisis — angka yang hilang dari laporan adalah masalah yang hilang dari kesadaran; Sinta membayarnya dengan model AUC 0,91 yang gagal di produksi. Enam: mulai dari yang sederhana — bila missing di bawah 5 persen dan terdiagnosis MCAR, hapus baris dan laporkan; jangan kerahkan MICE untuk masalah yang sebenarnya kecil.",
      },
    },
  ],
};
