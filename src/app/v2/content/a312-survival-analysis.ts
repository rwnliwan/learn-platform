import type { V2Lesson } from "../lib/types";

export const a312: V2Lesson = {
  slug: "a312-survival-analysis",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.12 Survival Analysis: Memprediksi Kapan, Bukan Sekadar Apakah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-kuburan",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Rata-rata umur dari data kuburan",
      prose: [
        "Tim risiko ingin tahu berapa lama rata-rata nasabah bertahan sebelum default. Analis mengambil data 5 tahun, lalu — agar bersih — membuang 70 persen nasabah: mereka yang belum default (masih aktif) dan yang lunas lebih awal. Dari 30 persen yang tersisa (yang benar-benar default), rata-rata waktu default = 14 bulan. Laporan: rata-rata nasabah default dalam 14 bulan. Direksi panik.",
        "Kesalahan fatal: 70 persen yang dibuang bukan sampah — mereka adalah kabar baik. Nasabah yang masih aktif 5 tahun tanpa default adalah bukti bertahan lama, bukan data rusak. Dengan membuang mereka, analis hanya mengukur yang gagal — seperti mengukur rata-rata umur manusia hanya dari data kuburan.",
        "Jawaban yang benar memakai semua data termasuk yang tersensor — dan median waktu default-nya ternyata di atas 60 bulan. Metode yang bisa melakukan ini bernama Kaplan-Meier.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Health Data Science, dan Marketing Analytics — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Membuang data tersensor membuat estimasi waktu default bias ke bawah secara sistematis — cadangan dan pricing dihitung dari angka yang terlalu pesimis, atau keputusan bisnis diambil dari kepanikan yang salah hitung.",
      },
      reference: "Tersensor bukan missing: kita tahu nasabah selamat setidaknya sampai waktu sensor.",
    },
    {
      id: "kaplan-meier",
      eyebrow: "Langkah 2 · Kaplan-Meier",
      title: "Memakai informasi parsial dengan benar",
      prose: [
        "Data tersensor kanan: untuk banyak nasabah, waktu default belum diketahui — mereka belum default sampai pengamatan terakhir. Tapi kita tahu mereka selamat setidaknya sampai waktu itu. Kaplan-Meier (KM) memakai informasi ini: peluang selamat sampai waktu t = perkalian (1 - default/at-risk) di tiap waktu kejadian.",
        "Peran observasi tersensor: mereka keluar dari at-risk untuk waktu berikutnya tanpa mengurangi S(t). Mereka berkontribusi informasi selamat sampai sini — mengurangi penyebut, bukan pembilang. Itulah cara KM memakai informasi parsial secara tepat.",
        "Median survival = waktu saat kurva S(t) pertama kali menyentuh 0,5. Di bawah, kamu hitung kurva KM dari 16 observasi dan temukan median serta S(12) — peluang selamat sampai bulan ke-12.",
      ],
      formula: String.raw`S(t) = \prod_{t_i \le t}\left(1 - \frac{d_i}{n_i}\right)`,
      formulaNote: "d_i = jumlah default di waktu t_i, n_i = jumlah at-risk tepat sebelum t_i.",
      tasks: [
        { id: "t1", text: "Lengkapi update KM: `S *= (1 - d/at_risk)`" },
        { id: "t2", text: "Hitung `S12` dan `median` (waktu pertama S <= 0,5)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "S12=0.5923 median=18",
      note: {
        title: "Sering salah",
        body: "Menganggap observasi tersensor mengurangi S(t) atau membuangnya. Tersensor bukan gagal dan bukan sampah — ia keluar dari at-risk tanpa mengurangi kurva.",
      },
      hints: [
        "Di tiap waktu kejadian: S dikali (1 - d/at_risk).",
        "Median = waktu pertama dengan S <= 0.5. Cari dari list Ss.",
        "S *= (1 - d/at_risk)",
      ],
      code: {
        starter: `# Data: (waktu_bulan, event: 1=default, 0=censored)\ndata = [(3,1),(5,1),(5,0),(6,1),(8,1),(8,0),(9,1),(12,1),(12,0),\n        (15,1),(18,0),(18,1),(21,0),(24,1),(24,0),(30,0)]\ntimes = sorted(set(t for t, e in data if e == 1))\nS = 1.0\nSs = []\nfor t in times:\n    at_risk = sum(1 for tt, _ in data if tt >= t)\n    d = sum(1 for tt, e in data if tt == t and e == 1)\n    # TULIS KODEMU: update Kaplan-Meier\n    \n    Ss.append(S)\n\n# TULIS KODEMU: S(12) dan median survival\nS12 = \nmedian = \n\nprint(f"S12={S12:.4f} median={median}")`,
        lockLines: 10,
        solution: `# Data: (waktu_bulan, event: 1=default, 0=censored)\ndata = [(3,1),(5,1),(5,0),(6,1),(8,1),(8,0),(9,1),(12,1),(12,0),\n        (15,1),(18,0),(18,1),(21,0),(24,1),(24,0),(30,0)]\ntimes = sorted(set(t for t, e in data if e == 1))\nS = 1.0\nSs = []\nfor t in times:\n    at_risk = sum(1 for tt, _ in data if tt >= t)\n    d = sum(1 for tt, e in data if tt == t and e == 1)\n    # TULIS KODEMU: update Kaplan-Meier\n    S *= (1 - d/at_risk)\n    Ss.append(S)\n\n# TULIS KODEMU: S(12) dan median survival\nS12 = Ss[times.index(12)]\nmedian = next(t for t, s in zip(times, Ss) if s <= 0.5)\n\nprint(f"S12={S12:.4f} median={median}")`,
        checks: [
          { kind: "equal", task: "t2", name: "S12", value: 0.5923, tol: 0.005, label: "`S12` sekitar 0.5923", msg: "Peluang selamat sampai bulan 12. Cek update S di dalam loop." },
          { kind: "equal", task: "t2", name: "median", value: 18, tol: 1e-9, label: "`median` seharusnya 18", msg: "Waktu pertama S(t) <= 0,5 adalah bulan 18." },
          { kind: "stdout_matches", task: "t3", pattern: "S12=0\\.5923\\s+median=18", label: "`print` menampilkan S(12) dan median", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "S(t) = peluang selamat sampai t. Median = S menyentuh 0,5.",
    },
    {
      id: "cox-ph",
      eyebrow: "Langkah 3 · Model Cox",
      title: "Regresi untuk waktu: hazard ratio",
      prose: [
        "Model Cox proportional hazards memodelkan hazard (laju sesaat default) sebagai baseline dikali pengali kovariat. Baseline hazard bentuknya bebas — tidak diasumsikan — itulah mengapa Cox disebut semi-parametrik. Estimasi via partial likelihood: hanya urutan kejadian yang dipakai, bukan waktu persisnya.",
        "Membaca hazard ratio: beta_LTV = 0,02 per 1 poin LTV berarti HR = e^0,02 = 1,02 per poin; per 10 poin = e^0,2 = 1,22 (laju default 22 persen lebih tinggi). Beta_skor_baik = -0,9 berarti HR = e^-0,9 = 0,41: laju default 59 persen lebih rendah — pada setiap titik waktu.",
        "Pada setiap titik waktu adalah asumsi proportional hazards — dan wajib diuji. Jika kurva KM dua kelompok bersilangan, rasio hazard berubah tanda seiring waktu: asumsi rusak. Solusi: interaksi kovariat dengan waktu, atau Cox stratifikasi per kelompok.",
      ],
      formula: String.raw`h(t \mid x) = h_0(t) \cdot \exp(\beta_1 x_1 + \cdots + \beta_k x_k)`,
      formulaNote: "h_0 baseline hazard, exp(beta_j) = hazard ratio per 1 satuan x_j.",
      tasks: [
        { id: "t1", text: "Hitung `hr_ltv10` = HR untuk LTV +10 poin" },
        { id: "t2", text: "Hitung `hr_skor` = HR untuk skor baik" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "hr_ltv10=1.2214 hr_skor=0.4066",
      note: {
        title: "Sering salah",
        body: "Membaca HR = 0,41 sebagai peluang default 59 persen lebih rendah. HR adalah rasio laju sesaat, bukan rasio probabilitas. Untuk probabilitas kumulatif, hitung dari kurva survival prediksi.",
      },
      hints: [
        "HR = e pangkat (beta x delta x).",
        "Untuk +10 poin: pangkatnya 0,02 x 10.",
        "hr_ltv10 = math.exp(0.02*10)",
      ],
      code: {
        starter: `import math\n\nbeta_ltv = 0.02    # per 1 poin LTV\nbeta_skor = -0.9   # skor baik vs buruk\n\n# TULIS KODEMU: hazard ratio\n\nhr_ltv10 = \nhr_skor = \n\nprint(f"hr_ltv10={hr_ltv10:.4f} hr_skor={hr_skor:.4f}")`,
        lockLines: 4,
        solution: `import math\n\nbeta_ltv = 0.02    # per 1 poin LTV\nbeta_skor = -0.9   # skor baik vs buruk\n\n# TULIS KODEMU: hazard ratio\n\nhr_ltv10 = math.exp(beta_ltv*10)\nhr_skor = math.exp(beta_skor)\n\nprint(f"hr_ltv10={hr_ltv10:.4f} hr_skor={hr_skor:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hr_ltv10", value: 1.2214, tol: 0.002, label: "`hr_ltv10` sekitar 1.2214", msg: "e^(0,02 x 10) = 1,22. Jangan lupa kali 10 poin." },
          { kind: "equal", task: "t2", name: "hr_skor", value: 0.4066, tol: 0.002, label: "`hr_skor` sekitar 0.4066", msg: "e^(-0,9) = 0,41 — laju 59 persen lebih rendah." },
          { kind: "stdout_matches", task: "t3", pattern: "hr_ltv10=1\\.2214\\s+hr_skor=0\\.4066", label: "`print` menampilkan dua HR", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "HR = rasio laju sesaat. Uji asumsi PH: kurva KM bersilangan = rusak.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 4 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 3. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dalam perhitungan Kaplan-Meier, apa peran observasi tersensor?",
          options: [
            { text: "Mengurangi S(t) langsung", why: "Salah. Tersensor bukan kejadian gagal." },
            { text: "Tidak dipakai sama sekali", why: "Salah. Itu sama dengan membuang informasi." },
            { text: "Keluar dari at-risk untuk waktu berikutnya tanpa mengurangi S(t) — berkontribusi informasi selamat sampai sini", why: "Benar. Mengurangi penyebut, bukan pembilang.", correct: true },
            { text: "Dianggap sebagai kejadian default", why: "Salah. Itu justru bias yang diceritakan di langkah 1." },
          ],
        },
        {
          q: "HR = 0,41 untuk skor baik vs buruk. Interpretasi yang tepat?",
          options: [
            { text: "Peluang default 59 persen lebih rendah", why: "Salah. HR bukan rasio probabilitas." },
            { text: "Laju (hazard) default 59 persen lebih rendah pada setiap titik waktu — dengan asumsi proportional hazards", why: "Benar. HR = rasio laju sesaat; frasa setiap titik waktu menuntut asumsi PH.", correct: true },
            { text: "PD 12-bulan = 41 persen dari kelompok buruk", why: "Salah. Untuk probabilitas kumulatif, hitung dari kurva survival." },
            { text: "Tidak ada efek", why: "Salah. HR 0,41 jauh dari 1." },
          ],
        },
      ],
      reference: "Tersensor: keluar at-risk, S tidak berkurang. HR = rasio laju.",
    },
    {
      id: "s-vs-h-competing",
      eyebrow: "Langkah 5 · S(t), h(t), competing risks",
      title: "Kapan memakai yang mana",
      prose: [
        "S(t) = P(T>t) untuk laporan dan deskripsi: berapa persen selamat sampai 2 tahun. h(t) untuk modeling dan pricing: seberapa bahaya sekarang — kovariat paling natural sebagai pengali laju, dan premi asuransi dihitung dari hazard.",
        "Jebakan: competing risks. Banyak nasabah KPR lunas dipercepat (refinancing). Lunas bukan sensor biasa — mereka tidak lagi berisiko default, mereka keluar via jalur lain. KM biasa yang menganggapnya sensor non-informatif akan overestimate probabilitas default. Butuh cumulative incidence function yang memodelkan tiap jalur keluar secara eksplisit.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menganggap lunas dipercepat sebagai sensor biasa. Yang lunas tidak lagi berisiko default — menganggapnya masih berisiko melebih-lebihkan probabilitas default secara sistematis.",
      },
      reference: "S(t): komunikasi. h(t): mesin modeling. Jalur keluar ganda -> competing risks.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "KM, Cox, atau competing risks?",
      prose: [
        "Satu, deskripsikan kurva survival satu atau beberapa kelompok tanpa kovariat: Kaplan-Meier plus uji log-rank untuk membandingkan. Dua, ingin efek kovariat terhadap waktu kejadian: Cox PH — baca hazard ratio, lalu uji asumsi proportional hazards (kurva bersilangan = rusak).",
        "Tiga, ada jalur keluar selain kejadian yang diteliti (lunas vs default): competing risks dengan cumulative incidence function — jangan pakai KM biasa. Empat, butuh ekstrapolasi di luar window observasi atau hazard dengan bentuk parametrik yang jelas: model parametrik (Weibull, log-normal) — dengan catatan asumsi bentuknya harus dipertahankan.",
        "Aturan 10 detik: jangan pernah buang data tersensor; bedakan S untuk laporan vs h untuk modeling; curigai competing risks setiap ada jalur keluar ganda.",
      ],
      tasks: [],
      reference: "Deskripsi -> KM. Kovariat -> Cox. Jalur ganda -> competing risks. Ekstrapolasi -> parametrik.",
    },
    {
      id: "mini-case-vintage",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Vintage analysis: apel vs apel",
      prose: [
        "Direksi khawatir: default rate vintage 2024 (2,1 persen) lebih tinggi dari vintage 2022 (1,8 persen) — kualitas underwriting memburuk? Kamu curiga ada bias waktu: vintage 2024 umurnya baru 18 bulan (periode rawan), vintage 2022 sudah 42 bulan. Kamu buat kurva KM per vintage plus model Cox dengan kovariat LTV, skor, tenor, dan dummy vintage.",
        "Hasil: kurva KM 2024 vs 2022 hampir berhimpit setelah penyesuaian umur; uji log-rank p = 0,34; HR vintage2024 = 1,08 (p = 0,28). Kesimpulan: tidak ada bukti penurunan kualitas — selisih 2,1 vs 1,8 persen dijelaskan sepenuhnya oleh perbedaan umur. Jangan ketatkan underwriting berdasarkan angka mentah; lanjutkan monitoring KM per vintage tiap kuartal.",
        "Perbandingan default rate mentah adalah apel vs jeruk temporal: ia mencampur umur portofolio dengan kualitas. KM membandingkan pada umur yang sama — apel vs apel. Dan jika banyak nasabah lunas dipercepat, analisis vintage butuh competing risks.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan underwriting dari angka mentah yang bias umur bisa mengencangkan kredit secara tidak perlu — kehilangan bisnis baik karena salah baca statistik.",
      },
      reference: "Bandingkan kurva pada umur yang sama, bukan angka mentah beda umur.",
    },
    {
      id: "pendalaman-sensor-ph-lanjut",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Jenis sensor, uji PH & competing risks lanjut",
      prose: [
        "KM dan Cox standar mengasumsikan sensor kanan yang non-informatif. Sensor kanan (T > c): kejadian belum terjadi sampai akhir pengamatan — kasus umum kredit (nasabah masih aktif). Sensor kiri (T < c): kejadian SUDAH terjadi sebelum pengamatan dimulai — mis. menganalisis portofolio akuisisi di mana sebagian nasabah sudah default sebelum tanggal cut-off. Sensor interval: kejadian diketahui terjadi di antara dua pemeriksaan — mis. cek kesehatan tahunan, atau default yang terdeteksi saat review kuartalan. Salah jenis = salah metode: KM biasa untuk sensor interval = bias.",
        "Yang lebih berbahaya: sensor informatif. Asumsi KM/Cox = mekanisme sensor independen dari risiko. Bila nasabah menutup akun KARENA tahu akan gagal bayar (self-selection keluar), yang tersisa di at-risk adalah yang sehat — kurva KM overestimate survival secara sistematis. Deteksi: bandingkan karakteristik yang tersensor vs yang tidak; bila berbeda sistematis (skor lebih buruk, LTV lebih tinggi), curigai informatif. Obatnya bukan KM — melainkan model yang memodelkan mekanisme keluarnya, atau analisis sensitivitas worst-case.",
        "Uji asumsi proportional hazards — jangan percaya buta. Alat satu: residual Schoenfeld — di bawah PH, residual tiap kovariat tidak berkorelasi dengan waktu; korelasi signifikan = efek kovariat berubah seiring waktu = asumsi rusak. Alat dua: plot log(−log S(t)) dua kelompok — garis sejajar berarti PH terpenuhi. Bila rusak: tambahkan interaksi kovariat x waktu (efek boleh berubah), atau stratifikasi Cox per kelompok (tiap strata baseline hazard sendiri).",
        "Competing risks lanjut: dua pendekatan, pilih sesuai pertanyaan. Fine-Gray memodelkan subdistribution hazard — langsung menjawab berapa probabilitas kumulatif tiap jenis kejadian (default vs lunas dipercepat) — untuk prediksi dan pelaporan. Cause-specific Cox memodelkan hazard tiap penyebab seolah penyebab lain tersensor — untuk memahami mekanisme (faktor apa mendorong default secara etiologis). Salah pilih = menjawab pertanyaan yang tidak ditanya. Aturan: prediksi probabilitas → Fine-Gray; pemahaman penyebab → cause-specific.",
      ],
      formula: String.raw`H(t) = -\log S(t), \qquad h(t) = \frac{f(t)}{S(t)}`,
      formulaNote: "H(t) = cumulative hazard (akumulasi risiko sampai t); S(t) = peluang selamat; h(t) = hazard sesaat; f(t) = densitas waktu kejadian. Hubungan: S(t) = exp(−H(t)) — dua bahasa untuk cerita yang sama: peluang selamat vs akumulasi bahaya.",
      tasks: [],
      reference: "Kenali jenis sensormu. Curigai sensor informatif. Uji PH: Schoenfeld + log-log. Competing risks: Fine-Gray vs cause-specific.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: sensor adalah informasi, bukan data hilang",
        body: "Setiap observasi tersensor berkata: saya selamat SETIDAKNYA sampai sini — itu informasi, bukan kekosongan. Membuangnya = membuang kabar baik. Tiga heuristik. Pertama: kenali jenis sensormu. Kanan (belum kejadian — umum di kredit), kiri (sudah kejadian sebelum observasi — mis. portofolio akuisisi), interval (kejadian di antara dua cek — mis. pemeriksaan tahunan). KM standar hanya sah untuk sensor kanan non-informatif — jenis lain butuh metode lain. Kedua: sensor informatif adalah pembunuh diam-diam. Bila yang tersensor keluar karena alasan yang berhubungan dengan risiko (nasabah menutup akun karena tahu akan default), yang tersisa adalah yang sehat — KM overestimate survival. Selalu tanya: kenapa observasi ini tersensor? Ketiga: median survival lebih jujur dari mean — mean butuh ekor distribusi yang sering tak teramati. Aturan praktis: S(t) untuk komunikasi (berapa persen selamat), h(t) untuk mesin modeling dan pricing (seberapa bahaya sekarang), dan curigai competing risks setiap ada lebih dari satu pintu keluar.",
      },
      summary: [
        "Jangan buang data tersensor: ia mengandung informasi selamat setidaknya sampai waktu sensor.",
        "Kaplan-Meier: S(t) = perkalian (1 - d/n); tersensor keluar dari at-risk tanpa mengurangi kurva.",
        "Cox: h(t|x) = h0(t) x exp(beta x); HR = rasio laju sesaat, bukan probabilitas. Uji asumsi PH.",
        "S(t) untuk laporan, h(t) untuk modeling dan pricing.",
        "Jalur keluar ganda (lunas vs default) = competing risks, bukan sensor biasa.",
      ],
      next: { label: "A3.13 — Inferensi Kausal", href: "/learn/a313-kausal" },
      quiz: [
        {
          q: "70 persen nasabah belum default di akhir window. Analis membuang mereka lalu menghitung rata-rata waktu default dari sisanya. Masalah?",
          options: [
            { text: "Tidak ada — data jadi bersih", why: "Salah. Yang dibuang adalah kabar baik." },
            { text: "Bias seleksi parah: yang dibuang adalah kabar baik. Rata-rata dari yang gagal saja seperti mengukur umur dari data kuburan", why: "Benar. Data tersensor mengandung informasi bertahan lama.", correct: true },
            { text: "Sampel terlalu kecil", why: "Salah. Masalahnya bias, bukan ukuran." },
            { text: "Harus pakai median saja", why: "Salah. Median dari sampel bias tetap bias." },
          ],
        },
        {
          q: "Kurva KM dua kelompok bersilangan di bulan 18. Implikasi untuk model Cox?",
          options: [
            { text: "Tidak ada — Cox selalu valid", why: "Salah. Cox punya asumsi yang bisa rusak." },
            { text: "Asumsi proportional hazards rusak — butuh interaksi dengan waktu atau stratifikasi", why: "Benar. Kurva bersilangan = rasio hazard berubah tanda.", correct: true },
            { text: "Naikkan ukuran sampel", why: "Salah. Sampel lebih besar tidak memperbaiki asumsi." },
            { text: "Ganti ke regresi logistik", why: "Salah. Itu menjawab apakah, bukan kapan." },
          ],
        },
        {
          q: "Kapan S(t) dan h(t) masing-masing lebih berguna?",
          options: [
            { text: "Sama saja keduanya", why: "Salah. Keduanya menjawab pertanyaan berbeda." },
            { text: "S(t) untuk laporan ('berapa persen selamat sampai 2 tahun'); h(t) untuk modeling dan pricing ('seberapa bahaya sekarang')", why: "Benar. S = kumulatif untuk komunikasi; h = sesaat untuk mesin.", correct: true },
            { text: "h(t) untuk laporan", why: "Salah. Hazard sesaat sulit dibaca non-teknis." },
            { text: "S(t) tidak bisa dihitung", why: "Salah. KM menghitungnya justru dengan benar." },
          ],
        },
        {
          q: "Banyak nasabah KPR lunas dipercepat (refinancing). KM biasa untuk probabilitas default akan?",
          options: [
            { text: "Tepat — lunas = sensor biasa", why: "Salah. Lunas adalah jalur keluar lain." },
            { text: "Overestimate — lunas adalah competing risk, bukan sensor non-informatif. Butuh cumulative incidence function", why: "Benar. Yang lunas tidak lagi berisiko default.", correct: true },
            { text: "Underestimate", why: "Salah. Arahnya melebih-lebihkan, bukan sebaliknya." },
            { text: "Tidak terpengaruh", why: "Salah. Jalur keluar ganda mengubah perhitungan." },
          ],
        },
        {
          q: "Nasabah menutup akun KPR lebih awal karena tahu akan gagal bayar, lalu tercatat sebagai tersensor. Masalahnya?",
          options: [
            { text: "Tidak ada — sensor adalah sensor", why: "Salah. Alasan keluarnya berhubungan dengan risiko." },
            { text: "Sensor informatif: yang keluar adalah yang berisiko — KM overestimate survival. Bandingkan karakteristik tersensor vs tidak; pertimbangkan analisis sensitivitas", why: "Benar. Asumsi sensor independen rusak.", correct: true },
            { text: "Mereka harus dihitung sebagai default", why: "Salah. Mereka belum default — itu justru bias sebaliknya." },
            { text: "Perbanyak sampel", why: "Salah. Sampel besar tidak memperbaiki bias mekanisme." },
          ],
        },
        {
          q: "Residual Schoenfeld untuk variabel LTV berkorelasi signifikan dengan waktu. Artinya?",
          options: [
            { text: "Model sempurna", why: "Salah. Justru sebaliknya." },
            { text: "Asumsi proportional hazards rusak untuk LTV — efeknya berubah seiring waktu. Solusi: interaksi LTV x waktu atau stratifikasi", why: "Benar. Di bawah PH, residual tidak berkorelasi dengan waktu.", correct: true },
            { text: "LTV tidak signifikan", why: "Salah. Ini soal asumsi, bukan signifikansi." },
            { text: "Ganti ke KM saja", why: "Salah. KM tidak memberi efek kovariat yang dibutuhkan." },
          ],
        },
        {
          q: "Manajemen bertanya: berapa probabilitas nasabah default vs lunas dipercepat dalam 3 tahun. Metode competing risks yang tepat?",
          options: [
            { text: "KM biasa per jenis kejadian", why: "Salah. KM biasa overestimate dengan competing risks." },
            { text: "Fine-Gray (subdistribution hazard) — langsung memodelkan probabilitas kumulatif tiap jenis kejadian untuk prediksi", why: "Benar. Cause-specific Cox untuk pertanyaan mekanisme, bukan prediksi probabilitas.", correct: true },
            { text: "Regresi logistik biasa", why: "Salah. Mengabaikan waktu dan sensor." },
            { text: "Cox tanpa penyesuaian", why: "Salah. Itu menjawab hazard, bukan probabilitas kumulatif tiap jalur." },
          ],
        },
      ],
    },
  ],
};
