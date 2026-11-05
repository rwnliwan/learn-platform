import type { V2Lesson } from "../lib/types";

export const cr7b: V2Lesson = {
  slug: "cr7b-application-scorecard-2",
  track: "Credit Risk",
  module: "Scorecard & Pemodelan PD",
  title: "CR7B — Application Scorecard 2: Skor & Cut-off",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Skor 650 — angka keramat yang diperdebatkan",
      prose: [
        "Rapat direksi Bank Nusantara memanas. Tim bisnis mengusulkan: \"Turunkan cut-off KTA dari 650 ke 620! Approval naik 15%, target tercapai!\" Tim risiko menolak: \"Bad rate naik dari 4% ke 7% — NPL meledak 6 bulan lagi!\"",
        "Direktur utama menoleh ke analis Rina: \"Kamu yang buat modelnya. Angka 650 itu datang dari mana? Kenapa bukan 640 atau 660?\" Rina menarik napas. \"650 bukan angka keramat, Pak. Ia adalah titik di mana keuntungan dari nasabah yang di-ACC sama dengan kerugian dari yang macet. Turunkan ke 620, dan tiap nasabah tambahan justru merugikan bank Rp 2 juta.\"",
        "Di balik satu angka \"650\" ada matematika trade-off yang bisa dihitung — bukan firasat. Part 2 ini mengajarkan cara menghitungnya, plus cara mengubah peluang model menjadi skor yang dimengerti manusia.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model yang tidak dipakai = tidak berguna. Skor adalah antarmuka: manusia tidak berpikir dalam peluang — 'skor 640 di atas 600, lumayan' langsung bisa dipakai bisnis, dijelaskan ke nasabah, dan dipertahankan ke auditor.",
      },
      reference: "Part 2 = penyajian: scaling PDO, cut-off, validasi, monitoring.",
    },
    {
      id: "pdo",
      eyebrow: "Langkah 2 · PDO",
      title: "Menyulap peluang jadi skor cantik",
      prose: [
        "Model logistik menghasilkan peluang (0–100%) — sulit dicerna bisnis (\"PD 3,7%\" tidak intuitif). PDO scaling mengubahnya menjadi skor (misal 300–850) dengan dua parameter. PDO (Points to Double Odds): berapa poin skor untuk menggandakan odds kelancaran. PDO 20 = tiap +20 poin, odds lancar 2× lipat. Base score & base odds: titik jangkar — misal skor 600 ↔ odds 50:1.",
        "Contoh: PDO 20, base 600 ↔ odds 50:1. Nasabah dengan peluang lancar 98% (PD 2%). Odds = 0,98/0,02 = 49 ≈ 50:1. Factor = 20/ln(2) = 28,85; offset = 600 − 28,85×ln(50) = 487,2. Skor = 487,2 + 28,85×ln(49) ≈ 599 — mendekati 600, sesuai jangkar.",
        "Artinya intuitif: skor 620 vs 600 = odds 2× lipat (karena PDO 20). Bisnis langsung paham: \"nasabah 620 dua kali lebih aman dari 600\". PDO adalah \"zoom\" skor: PDO besar (30) = skor meregang; PDO kecil (15) = skor memadat. Industri Indonesia umum memakai PDO 15–25. Yang penting konsisten — jangan ganti PDO tiap tahun, atau tren skor tidak bisa dibandingkan.",
      ],
      formula: String.raw`\text{Skor} = \text{Offset} + \text{Factor} \times \ln(\text{odds}) \qquad \text{Factor} = \frac{\text{PDO}}{\ln 2}`,
      formulaNote: "odds = p_lancar / p_default. Offset diatur agar odds 50:1 tepat skor 600.",
      tasks: [],
      reference: "Skor 620 vs 600 = dua kali lebih aman (PDO 20).",
    },
    {
      id: "lab-pdo",
      eyebrow: "Langkah 3 · Lab PDO",
      title: "Dari log-odds ke skor",
      prose: [
        "PDO 20, base score 600 ↔ odds 50:1. Tugasmu: hitung factor dan offset, lalu konversi dua peluang kelancaran menjadi skor — p = 98% dan p = 80%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `factor` = pdo/ln(2) dan `offset` = 600 − factor×ln(50)" },
        { id: "t2", text: "Hitung `skor_98` dan `skor_80` via offset + factor×ln(p/(1−p))" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "factor=28.85 offset=487.12 skor_98=599 skor_80=527",
      hints: [
        "Gunakan math.log untuk logaritma natural.",
        "odds = p / (1 - p), lalu ln(odds).",
        "factor = pdo / math.log(2)",
      ],
      code: {
        starter: `import math\n\npdo = 20\nbase_odds = 50\nbase_score = 600\n\n# TULIS KODEMU\nfactor = \noffset = \n\ndef to_score(p):\n    return offset + factor * math.log(p / (1 - p))\n\nskor_98 = \nskor_80 = \n\nprint(f"factor={factor:.2f} offset={offset:.2f} skor_98={skor_98:.0f} skor_80={skor_80:.0f}")`,
        lockLines: 5,
        solution: `import math\n\npdo = 20\nbase_odds = 50\nbase_score = 600\n\n# TULIS KODEMU\nfactor = pdo / math.log(2)\noffset = base_score - factor * math.log(base_odds)\n\ndef to_score(p):\n    return offset + factor * math.log(p / (1 - p))\n\nskor_98 = to_score(0.98)\nskor_80 = to_score(0.80)\n\nprint(f"factor={factor:.2f} offset={offset:.2f} skor_98={skor_98:.0f} skor_80={skor_80:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "factor", value: 28.85, tol: 0.01, label: "`factor` sekitar 28.85", msg: "20 / ln(2) ≈ 28.85." },
          { kind: "equal", task: "t1", name: "offset", value: 487.12, tol: 0.05, label: "`offset` sekitar 487.12", msg: "600 − 28.85 × ln(50) ≈ 487.12." },
          { kind: "equal", task: "t2", name: "skor_98", value: 599, tol: 1.0, label: "`skor_98` sekitar 599", msg: "Peluang 98% ≈ odds 50:1 = jangkar skor 600." },
          { kind: "stdout_matches", task: "t3", pattern: "factor=28\\.85\\s+offset=487\\.12\\s+skor_98=599\\s+skor_80=527", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: ubah pdo jadi 30 — skor jadi lebih 'meregang'. PDO = 'zoom' skor.",
    },
    {
      id: "cutoff",
      eyebrow: "Langkah 4 · Cut-off",
      title: "Garis hidup-mati yang penuh trade-off",
      prose: [
        "Cut-off = skor minimum untuk ACC. Di atasnya diterima, di bawahnya ditolak. Menentukan dua metrik yang tarik-menarik: approval rate = % aplikan yang di-ACC (bisnis suka tinggi); bad rate = % dari yang di-ACC yang akhirnya default (risiko suka rendah).",
        "Cara rasional memilih cut-off: hitung profit per skor — pendapatan bunga dari yang lancar minus kerugian dari yang macet. Cut-off optimal = titik di mana nasabah marjinal impas (profit = 0). Di bawah titik itu, tiap ACC tambahan = bakar uang. Contoh: cut-off 550 → approval 85% tetapi bad rate 12% (mengerikan). Cut-off 750 → bad rate 1,5% tetapi approval cuma 25% (bisnis mati). Zona rasional: 600–700 — di sinilah analisis profit marjinal menentukan angka pastinya.",
        "Hubungannya non-linear — menurunkan cut-off di daerah rendah jauh lebih \"mahal\" (bad rate meledak) dibanding di daerah tinggi. Tiap +50 poin cut-off: bad rate turun ~2–3 poin TAPI approval turun ~10–15 poin. Tidak ada yang gratis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Cut-off harus memaksimalkan akurasi model.\" Cut-off memaksimalkan profit, bukan akurasi. Menolak nasabah bagus (false negative) = kehilangan bunga; menerima nasabah jelek (false positive) = kehilangan pokok. Karena biayanya tidak simetris (pokok >> bunga), cut-off optimal biasanya lebih ketat dari yang memaksimalkan akurasi.",
      },
      reference: "Cost-sensitive decision: biaya salah tidak simetris — pokok yang hilang >> bunga yang hilang.",
    },
    {
      id: "lab-cutoff",
      eyebrow: "Langkah 5 · Lab Cut-off",
      title: "Simulasi approval vs bad rate",
      prose: [
        "10.000 aplikan dibangkitkan (skor ~ normal(620, 80); peluang macet turun dengan skor). Kode pembangkitan terkunci. Tugasmu: untuk cut-off 650, hitung approval rate (%) dan bad rate (%) dari yang di-ACC.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `approval` (%) untuk cut-off 650" },
        { id: "t2", text: "Hitung `bad_rate` (%) dari aplikan yang di-ACC" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "approval=36.0 bad_rate=4.75",
      hints: [
        "Saring aplikan dengan skor >= 650.",
        "Bad rate = rata-rata status macet (True=1) yang di-ACC × 100.",
        "acc = [b for s, b in aplikan if s >= 650]",
      ],
      code: {
        starter: `import random, math\nrandom.seed(11)\n\naplikan = []\nfor _ in range(10000):\n    skor = int(random.gauss(620, 80))\n    p_bad = 1 / (1 + math.exp((skor - 550) / 45))\n    aplikan.append((skor, random.random() < p_bad))\n\ncutoff = 650\n\n# TULIS KODEMU\napproval = \nbad_rate = \n\nprint(f"approval={approval:.1f} bad_rate={bad_rate:.2f}")`,
        lockLines: 9,
        solution: `import random, math\nrandom.seed(11)\n\naplikan = []\nfor _ in range(10000):\n    skor = int(random.gauss(620, 80))\n    p_bad = 1 / (1 + math.exp((skor - 550) / 45))\n    aplikan.append((skor, random.random() < p_bad))\n\ncutoff = 650\n\n# TULIS KODEMU\nacc = [b for s, b in aplikan if s >= cutoff]\napproval = len(acc) / len(aplikan) * 100\nbad_rate = sum(acc) / len(acc) * 100\n\nprint(f"approval={approval:.1f} bad_rate={bad_rate:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "approval", value: 36.0, tol: 0.3, label: "`approval` sekitar 36.0", msg: "36% aplikan lolos cut-off 650." },
          { kind: "equal", task: "t2", name: "bad_rate", value: 4.75, tol: 0.2, label: "`bad_rate` sekitar 4.75", msg: "4.75% dari yang di-ACC akhirnya macet." },
          { kind: "stdout_matches", task: "t3", pattern: "approval=36\\.0\\s+bad_rate=4\\.75", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: cut-off 575, 625, 675 — rasakan trade-off-nya.",
    },
    {
      id: "validasi",
      eyebrow: "Langkah 6 · Validasi",
      title: "KS, Gini, dan scorecard yang kedaluwarsa",
      prose: [
        "KS (Kolmogorov-Smirnov): jarak maksimum antara kurva kumulatif Good vs Bad. KS 45% = daya beda kuat. Patokan: <20% lemah, 20–40% sedang, 40–60% kuat, >60% curigai (leakage?). Gini = 2×AUC − 1: mengukur daya beda keseluruhan. Gini 0,55 (AUC 0,775) = standar bagus scorecard retail Indonesia. Swap set analysis: bandingkan keputusan model baru vs lama — yang masuk harusnya bad rate rendah, yang keluar bad rate tinggi.",
        "Tetapi diskriminasi tanpa kalibrasi tidak cukup untuk CKPN. Model A: Gini 0,60 tetapi kalibrasi meleset (skor 650 = PD aktual 8%, bukan 4%). Model B: Gini 0,50 tetapi kalibrasi pas. Untuk perhitungan CKPN (PSAK 71), pilih Model B — ECL butuh angka PD yang benar, bukan cuma ranking yang benar.",
        "Scorecard dilatih dari data masa lalu — dunia berubah. Monitoring tiap bulan: PSI (Population Stability Index) — PSI >0,25 = populasi bergeser signifikan; Gini/KS out-of-time — turun >10 poin = alarm; bad rate per skor — skor 650 kini 7% (bukan 4%) = kalibrasi rusak. Scorecard seperti vaksin — perlu booster (rebuild) saat virus bermutasi. Aturan praktis: rebuild tiap 1–2 tahun, monitor tiap bulan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Model sudah divalidasi sekali, aman selamanya.\" Validasi awal hanya membuktikan model bekerja di data lama. Bank yang memakai scorecard 2019 untuk aplikan 2026 tanpa monitoring = memakai peta 2019 untuk jalan 2026.",
      },
      reference: "Contoh: akuisisi digital → PSI 0,35, Gini turun 15 poin = pergeseran populasi, bukan model rusak.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Cut-off diturunkan demi target",
      prose: [
        "Q3 2026, direksi Bank Nusantara menurunkan cut-off KTA 650 → 620 agar target akuisisi tercapai. Data 6 bulan kemudian: approval naik 15% (target tercapai); bad rate segmen baru (skor 620–649): 11% vs 4% di atas 650; tambahan CKPN Rp 45 M — melampaui tambahan pendapatan bunga Rp 30 M; vintage Q3-2026 KTA mulai menunjukkan pola NPL di atas normal (CR6).",
        "Pembahasan: harga keputusan = net −Rp 15 M (45 − 30) dalam 6 bulan — belum termasuk biaya collection dan modal untuk UL yang lebih tinggi. Setiap nasabah tambahan di band 620–649 rata-rata merugikan bank. Target tercapai, laba bocor.",
        "Rekomendasi: (1) kembalikan cut-off ke 650 (atau 640 dengan pricing lebih tinggi — CR21: kompensasi risiko via bunga, bukan via volume); (2) tetapkan governance: perubahan cut-off wajib lewat analisis profit marjinal + persetujuan komite risiko — bukan keputusan target semata. Pelajaran: cut-off adalah keputusan risiko, bukan keputusan sales.",
      ],
      tasks: [],
      reference: "Cut-off optimal = titik nasabah marjinal impas (profit = 0).",
    },
    {
      id: "cutoff-ekonomi",
      eyebrow: "Langkah 8 · Ekonomi cut-off",
      title: "Cut-off dari laba, bukan dari perut",
      prose: [
        "Cut-off yang rasional diturunkan dari ekonomi marjinal, bukan dari target approval atau angka kompetitor. Rumusnya: laba marjinal = pendapatan bunga bersih (setelah biaya dana dan operasional) − EL − biaya modal. Cut-off optimal = skor di mana laba marjinal = 0. Di atasnya tiap ACC menambah laba; di bawahnya tiap ACC membakar uang. Semua komponen harus dari data sendiri: biaya dana dari treasury, opex dari akuntansi aktivitas, EL dari model.",
        "Contoh dengan angka: KTA Rp 30 jt tenor 3 tahun, pita marjinal skor 620–640 dengan PD 7%, LGD 65%. EL = 0,07 × 0,65 × 30 = Rp 1,365 jt. Pendapatan bunga total ≈ Rp 11 jt; biaya dana + operasional ≈ Rp 7 jt; laba sebelum risiko = Rp 4 jt. Laba marjinal = 4 − 1,365 − biaya modal (±Rp 0,5 jt) ≈ Rp 2,1 jt → ACC. Tetapi jika opex sebenarnya Rp 9 jt (bukan 7 jt — biaya collection digital yang tidak dialokasikan), laba marjinal tinggal Rp 0,1 jt — nyaris impas. Cut-off \"benar\" bisa bergeser 20–30 poin hanya karena satu asumsi biaya.",
        "Cara salah yang paling umum: menetapkan cut-off dari target approval (\"direksi minta approval 50%\") lalu mencari justifikasi. Itu membalik logika — approval adalah HASIL dari ekonomi, bukan input. Cara salah kedua: menyalin cut-off kompetitor. Kompetitor punya biaya dana, opex, dan risk appetite yang berbeda; cut-off 650 yang menguntungkan mereka bisa merugikanmu.",
        "Aturan keputusan. Satu: hitung ulang ekonomi marjinal tiap tahun — biaya berubah (suku bunga, opex digital), maka cut-off harus ikut bergerak. Dua: cut-off adalah kebijakan yang ditandatangani komite, bukan angka di spreadsheet analis. Tiga: dokumentasikan SEMUA asumsi biaya di satu halaman; saat direksi menekan cut-off turun, tunjukkan halaman itu dan tanyakan asumsi mana yang mereka ubah. Empat: untuk produk bersubsidi (KUR) di mana harga tidak boleh menutup risiko, cut-off menggantikan harga sebagai alat seleksi — perlakukan dengan keseriusan ganda.",
      ],
      tasks: [],
      reference: "Cut-off = titik impas marjinal. Approval rate adalah hasil, bukan target.",
    },
    {
      id: "drift-diam",
      eyebrow: "Langkah 9 · Drift diam-diam",
      title: "Cut-off yang melonggar tanpa disentuh",
      prose: [
        "Cut-off 650 yang tidak pernah diubah bisa melonggar sendiri. Scorecard menua: populasi bergeser (akuisisi digital membawa aplikan berbeda), perilaku berubah (aplikasi belajar \"mempercantik\" data), ekonomi bergerak. Skor 650 tahun 2026 tidak lagi berarti risiko yang sama dengan skor 650 tahun 2023 — tetapi garisnya tetap di 650, sehingga risiko yang masuk diam-diam memburuk. Inilah pelonggaran tanpa keputusan: tidak ada yang menandatangani, tidak ada yang bertanggung jawab.",
        "Contoh dengan angka: 2023, cut-off 650 → bad rate 4,75% (dari lab langkah 5). 2026, cut-off masih 650 → bad rate pita yang sama 6,8%. Investigasi: PSI per karakteristik menunjukkan pendapatan yang dilaporkan bergeser naik (inflasi skor — aplikan dan marketing belajar mengisi form), sementara verifikasi tidak ikut diperketat. Cut-off efektif telah melonggar setara ~30 poin tanpa ada yang menyentuh. Vintage 2024–2025 mengonfirmasi: kurva default di semua MOB lebih tinggi.",
        "Cara salah: menyalahkan ekonomi (\"daya beli turun\") dan menunggu. Cara benar: bedah drift per karakteristik — jika yang bergeser adalah variabel yang bisa di-game (pendapatan self-reported), solusinya verifikasi, bukan rebuild model. Jika yang bergeser adalah komposisi kanal (digital vs cabang), solusinya cut-off per kanal atau scorecard per kanal. Diagnosis menentukan obat.",
        "Aturan keputusan. Satu: dashboard bulanan — approval rate, bad rate per pita skor, PSI total dan per karakteristik. Dua: pemicu tindakan — bad rate pita naik >1,5 poin dari baseline → kalibrasi ulang cut-off (belum tentu rebuild model). Tiga: definisikan \"cut-off efektif\" = skor yang memberi bad rate sama dengan baseline awal; laporkan angka ini, bukan angka nominal 650. Empat: setiap perubahan cut-off nominal dicatat dengan alasan — \"drift\" adalah alasan yang sah dan harus diakui eksplisit, bukan disembunyikan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: cut-off adalah harga, model hanyalah timbangan",
        body: "Pisahkan dua peran ini dengan tegas: model adalah timbangan (mengurutkan risiko), cut-off adalah harga (memutuskan siapa dilayani). Timbangan yang biasa-biasa saja dengan harga yang tepat mengalahkan timbangan presisi dengan harga yang salah — karena yang menentukan laba bukan urutannya, melainkan di mana garis ditarik. Heuristik yang jarang disadari: sebagian besar perdebatan cut-off sebenarnya adalah perdebatan biaya yang menyamar. Orang berdebat soal angka 650 vs 670, padahal yang mereka pertentangkan adalah asumsi opex, biaya dana, atau hurdle rate yang tidak pernah ditulis. Begitu asumsi biaya dibuka di atas meja, perdebatan skor biasanya selesai dalam sepuluh menit. Maka saat cut-off dipersoalkan, jangan mulai dari skor — mulailah dari pertanyaan \"berapa opex per aplikasi yang kita pakai?\" Jawaban atas pertanyaan itulah yang sesungguhnya menentukan garis. Satu ujian terakhir untuk setiap cut-off yang kamu tetapkan: bisakah kamu menjelaskan kepada pemilik bisnis mengapa angkanya 650 dan bukan 640, hanya dengan aritmetika laba marjinal — tanpa menyebut \"model menyarankan\"? Jika tidak bisa, cut-off-mu belum menjadi kebijakan; ia masih menjadi tebakan yang rapi.",
      },
      reference: "Perdebatkan biaya dulu, skor kemudian.",
    },
    {
      id: "swap-set",
      eyebrow: "Langkah 10 · Swap set",
      title: "Mengganti model tanpa menebak",
      prose: [
        "Swap set analysis menjawab pertanyaan paling politis dalam modeling: \"model baru ini lebih baik — buktinya?\" Caranya: jalankan model lama dan model baru pada populasi aplikan yang sama, lalu fokus pada yang KEPUTUSANNYA BERBEDA (swap set) — yang lama tolak / baru terima (swap-in) dan sebaliknya (swap-out). Jika model baru benar, swap-in harus berkinerja baik dan swap-out berkinerja buruk. Populasi yang keputusannya sama tidak memberi informasi — mereka hanya noise yang mengaburkan perbandingan.",
        "Contoh dengan angka: 10.000 aplikan. Model lama ACC 4.000; model baru ACC 4.200. Swap-in: 500 orang (baru terima, lama tolak) — bad rate aktual 6%. Swap-out: 300 orang (baru tolak, lama terima) — bad rate aktual 14%. Keputusan: model baru benar — ia menukar 300 risiko 14% dengan 500 risiko 6%. Tetapi jika swap-in bad rate-nya 13% (hampir sama dengan swap-out), model baru hanya \"mengocok\" tanpa memperbaiki — jangan ganti; biaya implementasi tidak terbayar.",
        "Aturan keputusan. Satu: uji swap set memakai data out-of-time, bukan data training — di data training model baru selalu menang (itu bukan bukti). Dua: syarat ganti model — swap-in harus JELAS lebih baik (selisih bad rate >3 poin), bukan sekadar menang tipis yang bisa jadi noise. Tiga: hitung nilai ekonominya — selisih EL swap-in/out dikali volume tahunan harus melampaui biaya implementasi (IT, pelatihan, dokumentasi). Model yang \"lebih baik 0,5%\" tetapi butuh 6 bulan implementasi sering tidak worth it.",
      ],
      tasks: [],
      reference: "Bukti model baru = kinerja swap set, bukan metrik agregat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "PDO: tiap +PDO poin, odds kelancaran 2× lipat. Skor = antarmuka intuitif bagi bisnis.",
        "Cut-off memaksimalkan profit (cost-sensitive), bukan akurasi.",
        "KS 40–60% kuat; Gini 0,55 standar bagus; kalibrasi wajib untuk CKPN.",
        "Monitoring: PSI >0,25, Gini turun >10 poin, bad rate per skor bergeser = alarm.",
        "Rebuild tiap 1–2 tahun; cut-off = keputusan risiko, bukan sales.",
      ],
      next: { label: "CR8 — Reject Inference", href: "/learn/cr8-reject-inference" },
      quiz: [
        {
          q: "PDO 20 artinya?",
          options: [
            { text: "Skor maksimum 20", why: "PDO bukan skor maksimum." },
            { text: "Setiap +20 poin skor, odds kelancaran berlipat 2×", why: "Points to Double Odds. Skor 620 dua kali lebih aman dari 600 — inilah yang membuat skor intuitif.", correct: true },
            { text: "PD turun 20%", why: "Bukan persen PD — ini soal odds." },
            { text: "Cut-off harus 20", why: "Tidak ada hubungannya dengan cut-off." },
          ],
        },
        {
          q: "Mengapa cut-off optimal BUKAN yang memaksimalkan akurasi?",
          options: [
            { text: "Akurasi tidak penting", why: "Akurasi penting, tetapi bukan fungsi tujuannya." },
            { text: "Biaya salah tidak simetris: menerima yang macet (rugi pokok) jauh lebih mahal dari menolak yang bagus (rugi bunga) — cut-off memaksimalkan profit", why: "False positive = hilang pokok ratusan juta; false negative = hilang bunga. Cut-off menyeimbangkan rupiah.", correct: true },
            { text: "Regulator melarang akurasi", why: "Tidak ada larangan seperti itu." },
            { text: "Akurasi tidak bisa dihitung", why: "Akurasi bisa dihitung — hanya bukan tujuan yang tepat." },
          ],
        },
        {
          q: "KS = 45%. Artinya?",
          options: [
            { text: "Model 45% akurat", why: "KS bukan akurasi." },
            { text: "Pada skor tertentu, selisih kumulatif Good vs Bad mencapai 45 poin — daya beda kuat", why: "KS = jarak maksimum kurva kumulatif. 45% = kuat (patokan 40–60%).", correct: true },
            { text: "45% aplikan ditolak", why: "Tidak ada hubungannya dengan approval rate." },
            { text: "Error model 45%", why: "KS mengukur daya beda, bukan error." },
          ],
        },
        {
          q: "Model A: Gini 0,60 tapi kalibrasi meleset (skor 650 = PD aktual 8%, bukan 4%). Model B: Gini 0,50 tapi kalibrasi pas. Untuk perhitungan CKPN (PSAK 71), pilih?",
          options: [
            { text: "Model A — Gini lebih tinggi selalu menang", why: "Gini tinggi tanpa kalibrasi = salah hitung cadangan." },
            { text: "Model B — CKPN butuh angka PD yang benar (kalibrasi); ranking bagus tidak cukup untuk menghitung rupiah cadangan", why: "ECL = PD × LGD × EAD — butuh PD yang benar angkanya.", correct: true },
            { text: "Keduanya sama", why: "Berbeda: kalibrasi menentukan rupiah CKPN." },
            { text: "Buang keduanya", why: "Model B layak pakai untuk CKPN." },
          ],
        },
        {
          q: "PSI = 0,3 pada monitoring bulanan. Tindakan?",
          options: [
            { text: "Abaikan — PSI tidak penting", why: "PSI mengukur pergeseran populasi — penting." },
            { text: "Investigasi pergeseran populasi; siapkan rekalibrasi/rebuild — model mungkin tidak lagi mewakili aplikan saat ini", why: "PSI >0,25 = populasi bergeser signifikan. Model dilatih untuk 'dunia lama'.", correct: true },
            { text: "Langsung hapus model", why: "Terlalu drastis — investigasi dulu." },
            { text: "Turunkan cut-off", why: "Menggeser cut-off tidak memperbaiki ketidakcocokan populasi." },
          ],
        },
      ],
    },
  ],
};
