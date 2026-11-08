import type { V2Lesson } from "../lib/types";

export const cr8: V2Lesson = {
  slug: "cr8-reject-inference",
  track: "Credit Risk",
  module: "Scorecard & Pemodelan PD",
  title: "CR8 — Reject Inference: Nasib yang Ditolak",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rumah sakit yang hanya merawat orang sehat",
      prose: [
        "Sebuah RS mengklaim: \"Tingkat kesembuhan pasien kami 99%!\" Wartawan menyelidiki — ternyata RS itu menolak semua pasien kritis di pintu masuk. Tentu saja yang dirawat (yang sehat-sehat) sembuh. Klaim 99% itu benar secara angka, bohong secara makna.",
        "Scorecard bank melakukan hal yang sama — secara struktural. Model dilatih hanya dari nasabah yang di-ACC (yang lolos cut-off). Nasabah yang ditolak? Tidak pernah diamati — tidak ada yang tahu apakah mereka benar-benar akan macet.",
        "Rina, analis Bank Nusantara, menyadarinya saat audit: \"Model kita tidak pernah melihat skor di bawah 600. Tapi kita memakai model ini untuk... menolak skor di bawah 600. Kita menolak berdasarkan ramalan tentang wilayah yang tidak pernah kita amati.\"",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Reject inference paling penting saat cut-off akan diubah. Kalau cut-off tetap selamanya, biasnya \"terkunci\" dan model tetap berguna di wilayah operasinya. Masalah meledak saat ekspansi (cut-off turun) — keputusan justru diambil di wilayah paling buta. Aturan: mau ubah cut-off? Wajib reject inference dulu.",
      },
      reference: "Reject inference = menyimpulkan nasib \"yang ditolak\" dari jejak \"yang diterima\".",
    },
    {
      id: "masalah",
      eyebrow: "Langkah 2 · Masalah",
      title: "Kita tak pernah tahu yang ditolak",
      prose: [
        "Selection bias = data latih (yang di-ACC) adalah sampel tidak acak dari populasi aplikan — melainkan sampel yang sudah disaring oleh kebijakan sebelumnya. Reject inference = teknik mengestimasi perilaku yang ditolak (rejects) agar model mewakili seluruh populasi (through-the-door population).",
        "Seperti sejarawan yang hanya membaca arsip pemenang perang — ceritanya lengkap, tetapi sepihak. Scorecard tanpa reject inference adalah sejarah yang ditulis para penyintas (yang di-ACC).",
        "Selection bias memburuk seiring waktu: model v1 menolak skor <600 → data latih v2 tidak punya skor <600 → v2 makin yakin wilayah itu berbahaya → cut-off naik ke 620 → makin buta. Ini lingkaran setan yang hanya bisa diputus dengan sengaja mengamati wilayah tolak (sampel acak di bawah cut-off).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Data kita besar (jutaan nasabah), jadi bias tidak masalah.\" Selection bias bukan masalah ukuran sampel, melainkan keterwakilan. Sejuta data dari wilayah yang sama tetap buta terhadap wilayah lain. Seperti survei kepuasan yang hanya bertanya ke pelanggan yang tidak komplain.",
      },
      reference: "Tiga dampak: bad rate underestimate · koefisien bias (range restriction) · ilusi perbaikan.",
    },
    {
      id: "lab-bias",
      eyebrow: "Langkah 3 · Lab Bias",
      title: "Yang terlihat vs yang sebenarnya",
      prose: [
        "Simulasi 20.000 aplikan (skor ~ normal(600, 90)), cut-off 600. Kode simulasi terkunci. Tugasmu: untuk band skor 500–600, hitung bad rate SEBENARNYA (dari fungsi true_pd) dan hitung berapa yang terlihat (di-ACC) di band itu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `true_bad` (%) band 500–600 dari `true_pd`" },
        { id: "t2", text: "Hitung `n_acc` = yang di-ACC di band 500–600" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "true_bad=47.9 n_acc=0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di band di bawah cut-off: tidak ada data observasi sama sekali — model buta total. Keputusan menolak di wilayah buta ini didasarkan pada ekstrapolasi, bukan observasi.",
      },
      hints: [
        "Saring populasi ke band 500 <= s < 600.",
        "Rata-ratakan true_pd(s) untuk tiap anggota band.",
        "n_acc = yang skornya >= cutoff di band itu.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(5)\n\ndef true_pd(skor):\n    return 1 / (1 + math.exp((skor - 550) / 45))\n\ncutoff = 600\npopulasi = [int(random.gauss(600, 90)) for _ in range(20000)]\n\n# TULIS KODEMU: band 500-600\ntrue_bad = \nn_acc = \n\nprint(f"true_bad={true_bad:.1f} n_acc={n_acc}")`,
        lockLines: 8,
        solution: `import random, math\nrandom.seed(5)\n\ndef true_pd(skor):\n    return 1 / (1 + math.exp((skor - 550) / 45))\n\ncutoff = 600\npopulasi = [int(random.gauss(600, 90)) for _ in range(20000)]\n\n# TULIS KODEMU: band 500-600\nanggota = [s for s in populasi if 500 <= s < 600]\ntrue_bad = sum(true_pd(s) for s in anggota) / len(anggota) * 100\nn_acc = sum(1 for s in anggota if s >= cutoff)\n\nprint(f"true_bad={true_bad:.1f} n_acc={n_acc}")`,
        checks: [
          { kind: "equal", task: "t1", name: "true_bad", value: 47.9, tol: 0.2, label: "`true_bad` sekitar 47.9", msg: "Rata-rata true_pd di band 500–600 ≈ 47.9%." },
          { kind: "equal", task: "t2", name: "n_acc", value: 0, tol: 1e-9, label: "`n_acc` seharusnya 0", msg: "Cut-off 600: tidak satu pun di band 500–600 yang di-ACC — buta total." },
          { kind: "stdout_matches", task: "t3", pattern: "true_bad=47\\.9\\s+n_acc=0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: turunkan cutoff jadi 550 — band 500-600 kini 'terlihat'. Bandingkan terlihat vs true.",
    },
    {
      id: "metode",
      eyebrow: "Langkah 4 · Metode",
      title: "Empat metode: dari abaikan sampai ideal",
      prose: [
        "Empat metode reject inference. (1) Ignore (abaikan) — latih dari yang di-ACC saja. Praktik umum, berbahaya jika cut-off akan diubah. \"Berdoa biasnya kecil.\" (2) Parceling — bagi yang ditolak ke band skor, tetapkan bad rate asumsi per band (misal: 2× bad rate band yang di-ACC), lalu latih ulang. Sederhana, tetapi asumsi = tebakan.",
        "(3) Augmentation (pembobotan) — beri bobot 1/P(ACC) pada yang di-ACC: yang \"hampir ditolak\" (dekat cut-off) diberi bobot besar karena mewakili banyak yang ditolak. Nasabah skor 605 (peluang ACC 55%) diberi bobot 1/0,55 ≈ 1,8 — ia \"berbicara untuk\" dirinya + 0,8 \"hantu\" yang ditolak. Populer di industri — tanpa data rejects pun bisa. (4) Full model / Heckman — model dua tahap: (a) model siapa yang di-ACC, (b) model default dengan koreksi seleksi. Ideal secara teori, kompleks, jarang dipakai penuh.",
        "Praktik emas industri: sampel acak di bawah cut-off — ACC-kan 5–10% aplikan di bawah cut-off secara acak (dengan limit kecil) untuk observasi langsung. Mahal tetapi jujur — \"membeli\" data kebenaran. Tidak ada yang mengalahkan data observasi langsung, karena semua metode statistik pada dasarnya menebak yang tak teramati.",
      ],
      formula: String.raw`w_i = \frac{1}{P(\text{ACC} \mid \text{skor}_i)}`,
      formulaNote: "Makin dekat cut-off (peluang ACC kecil), makin besar bobotnya — ia mewakili wilayah tolak di sekitarnya.",
      tasks: [],
      reference: "Sweet spot industri: augmentation (murah, cukup baik). Kebenaran terbaik: sampel acak di bawah cut-off.",
    },
    {
      id: "lab-augment",
      eyebrow: "Langkah 5 · Lab Augmentasi",
      title: "Menimbang ulang yang di-ACC",
      prose: [
        "Ide: yang di-ACC di dekat cut-off \"mewakili\" yang ditolak. Kode populasi terkunci (cutoff 600 dengan sedikit randomness). Tugasmu: hitung bad rate NAIF (rata-rata yang di-ACC, tanpa bobot) dan bad rate AUGMENTATION (bobot = 1/P(ACC)).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `naif` (%) = rata-rata bad yang di-ACC" },
        { id: "t2", text: "Hitung `aug` (%) = Σ(bad/bobot)/Σ(1/bobot) yang di-ACC" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "naif=10.47 aug=40.70",
      hints: [
        "Saring data yang acc = True.",
        "Bobot tiap nasabah = 1 / acc_prob.",
        "aug = sum(b/p)/sum(1/p) × 100 untuk yang di-ACC.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(9)\n\ndef true_pd(skor):\n    return 1 / (1 + math.exp((skor - 550) / 45))\n\ndata = []\nfor _ in range(20000):\n    s = int(random.gauss(600, 90))\n    acc_prob = 1 / (1 + math.exp(-(s - 600) / 15))\n    acc = random.random() < acc_prob\n    bad = random.random() < true_pd(s)\n    data.append((s, acc, bad, acc_prob))\n\n# TULIS KODEMU: hanya yang di-ACC (a=True)\nnaif = \naug = \n\nprint(f"naif={naif:.2f} aug={aug:.2f}")`,
        lockLines: 13,
        solution: `import random, math\nrandom.seed(9)\n\ndef true_pd(skor):\n    return 1 / (1 + math.exp((skor - 550) / 45))\n\ndata = []\nfor _ in range(20000):\n    s = int(random.gauss(600, 90))\n    acc_prob = 1 / (1 + math.exp(-(s - 600) / 15))\n    acc = random.random() < acc_prob\n    bad = random.random() < true_pd(s)\n    data.append((s, acc, bad, acc_prob))\n\n# TULIS KODEMU: hanya yang di-ACC (a=True)\nacc_data = [(b, p) for _, a, b, p in data if a]\nnaif = sum(b for b, p in acc_data) / len(acc_data) * 100\naug = sum(b/p for b, p in acc_data) / sum(1/p for b, p in acc_data) * 100\n\nprint(f"naif={naif:.2f} aug={aug:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "naif", value: 10.47, tol: 0.15, label: "`naif` sekitar 10.47", msg: "Bad rate yang terlihat dari yang di-ACC." },
          { kind: "equal", task: "t2", name: "aug", value: 40.70, tol: 0.3, label: "`aug` sekitar 40.70", msg: "Estimasi populasi penuh jauh lebih tinggi — itulah biasnya." },
          { kind: "stdout_matches", task: "t3", pattern: "naif=10\\.47\\s+aug=40\\.70", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Selisih naif vs aug = ukuran kebutaanmu. Ekspansi cut-off tanpa ini = tebakan.",
    },
    {
      id: "alternatif",
      eyebrow: "Langkah 6 · Alternatif",
      title: "Saat eksperimen ditolak direksi",
      prose: [
        "Direksi menolak eksperimen sampel acak (mahal). Alternatif murah: SLIK lookback — cek status 12–24 bulan kemudian dari aplikan yang ditolak. Nasabah yang kita tolak mungkin di-ACC bank lain — perilakunya tercatat di SLIK. Ini reject inference \"gratis\" (terbatas pada yang terlacak) yang sering cukup untuk mengestimasi bias dan meyakinkan direksi.",
        "Untuk ekspansi ke segmen yang belum pernah dilayani (misal UMKM informal thin-file), pendekatan terbaik adalah program percontohan: ACC sampel acak dengan limit kecil, amati 12 bulan, latih model khusus segmen. Model lama buta total di populasi baru — satu-satunya obat adalah data dari populasi itu sendiri. \"Gaspol\" tanpa pilot = eksperimen dengan uang nasabah; hasilnya terlihat 12–18 bulan kemudian sebagai NPL.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Analis yang berkata \"model kita punya bad rate 3%\" tanpa menyebut selection bias sedang berbohong dengan statistik — ia melaporkan angka yang hanya berlaku di \"dunia yang di-ACC\".",
      },
      reference: "Pertanyaan kunci bukan \"apakah modelku bias?\" (jawabannya selalu ya), melainkan \"apakah aku memakainya di luar wilayah datanya?\"",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan dan bagaimana koreksi bias seleksi",
      prose: [
        "Skenario 1 — Cut-off akan diubah (misal 600 → 640). → Wajib reject inference dulu. Alasan: model tidak pernah melihat wilayah skor yang selama ini ditolak — memakai model lama untuk kebijakan baru = meramal wilayah yang tak pernah diamati.",
        "Skenario 2 — Direksi menolak eksperimen sampel acak karena mahal. → Pakai augmentation: beri bobot 1/P(ACC) pada yang di-ACC. Contoh nyata: nasabah skor 605 (peluang ACC 55%) diberi bobot 1,8 — ia 'berbicara untuk' dirinya + 0,8 'hantu' yang ditolak. Tanpa data rejects pun bisa.",
        "Skenario 3 — Ada budget dan kesabaran 12 bulan. → Sampel acak di bawah cut-off 5–10%: standar emas industri. Satu-satunya cara mengamati wilayah tolak secara langsung.",
        "Skenario 4 — SLIK tersedia. → SLIK lookback: lacak aplikan yang ditolak 12–24 bulan lalu — sebagian di-ACC bank lain dan perilakunya tercatat. Contoh nyata: 5.000 ditolak, 3.200 terlacak, 22% macet vs 9% accepts di pita sama → pengali 2,4×. Reject inference gratis.",
        "Skenario 5 — Bobot augmentation meledak (sedikit accepts di dekat cut-off) atau wilayah tolak jauh dari data. → JANGAN lakukan reject inference: bobot raksasa × observasi berisik = bias baru yang lebih percaya diri. Akui kebutaanmu.",
        "Aturan praktis 10 detik: modelmu buta di tempat yang paling penting (wilayah tolak) — sebelum mengubah cut-off atau mengklaim 'model membaik', koreksi dulu bias seleksinya; kalau tidak bisa dikoreksi dengan jangkar data, jangan pura-pura bisa.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Bangga melaporkan 'bad rate turun 4,2% → 2,5%, model makin jago!' — padahal cut-off dinaikkan 3× (approval 70% → 45%) dan ekonomi justru memburuk. Itu bukan model yang membaik; itu penyaringan yang mengetat. Ilusi seleksi.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "\"Model kita membaik!\" — benarkah?",
      prose: [
        "Tim modeling Bank Nusantara melaporkan dengan bangga: \"Bad rate turun 4 tahun berturut-turut: 4,2% → 2,5%! Model makin jago!\" Kamu diminta verifikasi independen. Temuanmu: cut-off dinaikkan 3 kali dalam 4 tahun (600 → 620 → 640 → 660); approval rate turun 70% → 45%; tidak pernah ada reject inference — semua metrik dari data yang di-ACC saja; data makro: pengangguran naik, daya beli turun dalam periode yang sama.",
        "Pembahasan: tidak — ini ilusi seleksi. Bad rate turun karena penyaringan makin ketat (approval 70%→45%), bukan karena model makin pintar atau debitur membaik. Buktinya: ekonomi justru memburuk — jika model \"membaik\" sungguhan, ia harusnya mendeteksi risiko naik, bukan turun.",
        "Rekomendasi: (1) lakukan reject inference (augmentation) untuk estimasi bad rate populasi penuh — sajikan dua angka (terlihat vs terkoreksi) ke direksi; (2) pisahkan metrik: \"kualitas seleksi\" (bad rate yang di-ACC) vs \"kualitas model\" (Gini/KS out-of-time + bad rate populasi). Jangan biarkan seleksi ketat menyamar sebagai model hebat.",
      ],
      tasks: [],
      reference: "Manajemen merayakan risiko turun — padahal itu efek seleksi, bukan debitur membaik.",
    },
    {
      id: "parcel-bedah",
      eyebrow: "Langkah 9 · Bedah parceling",
      title: "Parceling: tebakan yang bisa dipertanggungjawabkan",
      prose: [
        "Parceling bekerja band per band: bagi skor menjadi pita (misalnya tiap 20 poin), hitung bad rate yang di-ACC di tiap pita, lalu tetapkan bad rate asumsi untuk yang ditolak di pita itu — biasanya kelipatan dari bad rate accepts, misalnya 1,5× atau 2×. Logikanya: yang ditolak di pita skor yang sama pasti lebih buruk dari yang di-ACC (kalau tidak, mengapa ditolak?), tetapi seberapa jauh lebih buruk adalah tebakan. Satu-satunya cara menambatkan tebakan ini ke realitas adalah SLIK lookback — lacak sebagian yang ditolak yang ternyata di-ACC bank lain, dan ukur rasio bad rate mereka vs accepts kita di pita yang sama.",
        "Contoh dengan angka: pita skor 550–600. Yang di-ACC 2.000 orang dengan bad rate 12% (240 bad). Yang ditolak 8.000 orang. Parceling dengan pengali 1,5× → bad rate asumsi 18% → 1.440 \"bad\" inferensi. Total pita: 10.000 orang, 1.680 bad (16,8%). Tetapi jika pengali yang benar adalah 2× (ditemukan setahun kemudian via SLIK lookback), bad rate pita seharusnya 21,6% — model meremehkan risiko pita ini 4,8 poin. Cut-off yang dipasang di 600 berdasarkan angka 16,8% ternyata meloloskan risiko 21,6%. Satu angka tebakan menggeser seluruh kebijakan cut-off.",
        "Cara salah yang umum: satu pengali untuk semua pita (\"pakai 2× untuk semua, simpel\"), atau menyalin pengali kartu kredit untuk KUR. Pengali seharusnya berbeda per pita — di dekat cut-off, yang ditolak mirip yang di-ACC (pengali mendekati 1,2×); jauh di bawah cut-off, pengali bisa 3×. Dan pengali kartu kredit (perilaku konsumtif) tidak berlaku untuk KUR (perilaku usaha). Parceling yang malas = tebakan kuadrat.",
        "Aturan keputusan. Satu: turunkan pengali dari SLIK lookback sendiri, per pita, per produk — jangan pinjam dari bank lain. Dua: uji sensitivitas tiga pengali (1,25× / 1,5× / 2×) dan laporkan rentangnya ke komite, bukan satu angka. Tiga: perbarui pengali tiap tahun — perilaku populasi bergeser. Empat: jika tidak ada data lookback sama sekali, nyatakan parceling sebagai \"asumsi manajemen\" dengan pemilik dan tanggal kedaluwarsa, bukan sebagai \"hasil model\".",
      ],
      tasks: [],
      reference: "Parceling = tebakan berstruktur: pengali per pita dari data sendiri, bukan angka pinjaman.",
    },
    {
      id: "kapan-berhenti",
      eyebrow: "Langkah 10 · Batas metode",
      title: "Kapan reject inference justru merusak",
      prose: [
        "Reject inference punya dua mode kegagalan yang mengubah \"koreksi bias\" menjadi \"produksi noise\". Pertama, bobot meledak: augmentation memberi bobot 1/P(ACC), dan di dekat cut-off dengan sedikit accepts, segelintir observasi berisik mendapat bobot raksasa. Kedua, ekstrapolasi buta: jika cut-off sangat ketat (misalnya hanya 20% di-ACC), wilayah tolak jauh dari wilayah data — augmentation dan parceling sama-sama menebak di wilayah yang tidak punya jangkar data sama sekali.",
        "Contoh dengan angka: pita 600–620 hanya punya 80 accepts (bad rate terukur 9%, tetapi dengan 80 observasi, selang kepercayaannya ±6 poin — angka 9% itu sendiri goyang). Bobot augmentation 8× mengubah 80 observasi berisik menjadi 640 \"hantu\" yang mendominasi training. Model kemudian mempelajari noise 80 orang itu seolah-olah pola populasi. Hasilnya bukan koreksi bias — melainkan bias baru yang lebih percaya diri dan lebih salah.",
        "Cara salah: fintech pindar dengan rejection rate 92% tetap memaksakan augmentation \"karena itu standar industri\", lalu heran mengapa modelnya tidak stabil tiap retraining. Cara benar: akui wilayah buta. Jika rejects lebih dari 4× accepts di suatu pita, jangan augment — jalankan program percontohan (ACC sampel acak kecil di pita itu) atau pakai SLIK lookback. Reject inference adalah alat ukur, bukan alat sulap: ia tidak menciptakan data yang tidak ada.",
        "Aturan keputusan. Satu: minimum 200 accepts per pita untuk augmentation; di bawah itu, bobotnya tidak stabil. Dua: petakan \"wilayah buta\" — pita dengan rasio tolak/lolos di atas 4× — dan tandai model \"tidak valid\" di sana sampai ada data percontohan. Tiga: monitor stabilitas bobot antar retraining; bobot yang melompat-lompat = sinyal datanya terlalu tipis. Empat: laporkan selalu dua angka — metrik dengan dan tanpa koreksi — agar direksi melihat seberapa besar keputusan bergantung pada tebakan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: modelmu buta di tempat yang paling penting",
        body: "Ketidakpastian model paling besar persis di wilayah yang paling diinginkan bisnis: di bawah cut-off, tempat ekspansi berada. Ini bukan kebetulan yang sial — ini struktural. Setiap kebijakan cut-off menciptakan titik buta tepat di bawahnya, dan setiap rencana ekspansi meminta model memprediksi di dalam titik buta itu. Reject inference tidak menghilangkan kebutaan; ia mengukurnya dan memberi harga. Heuristik yang jarang disadari: informasi per rupiah risiko eksperimen paling tinggi ada pada near-miss — yang ditolak tipis di bawah cut-off. Merekalah yang paling mirip populasi target ekspansi, dan bobot augmentation memang paling besar di sana bukan karena kebetulan. Maka jika direksi hanya mengizinkan satu eksperimen kecil, jangan sebar sampel acak ke seluruh wilayah tolak — fokuskan di 20–40 poin di bawah cut-off. Di sanalah satu observasi jujur mengalahkan seribu tebakan statistik, dan di sanalah keputusan ekspansi benar-benar dibuat. Dan satu disiplin pelaporan: setiap metrik model yang kamu sajikan ke direksi harus berlabel wilayah berlakunya — \"berlaku untuk skor ≥600\" — karena angka tanpa wilayah adalah janji tanpa batas, dan ekspansi adalah tindakan melintasi batas itu.",
      },
      reference: "Ukur kebutaanmu; jangan berdoa ia kecil.",
    },
    {
      id: "slik-lookback",
      eyebrow: "Langkah 11 · SLIK lookback",
      title: "Reject inference gratis dari SLIK",
      prose: [
        "SLIK lookback adalah reject inference termurah: ambil daftar aplikan yang kamu tolak 12–24 bulan lalu, cocokkan dengan SLIK, dan lihat perilaku mereka — sebagian ternyata di-ACC bank atau multifinance lain, dan riwayat pembayarannya tercatat. Kamu mendapatkan \"bad rate yang ditolak\" observasi langsung, tanpa eksperimen, tanpa biaya. Keterbatasannya jelas: hanya yang terlacak (di-ACC pihak lain dan dilaporkan ke SLIK); yang tidak pernah dapat kredit di mana pun tetap tak teramati — dan merekalah yang kemungkinan paling buruk (selection bias di dalam lookback itu sendiri).",
        "Contoh dengan angka: 5.000 yang ditolak Januari 2024. Ditelusuri Januari 2026: 3.200 terlacak di SLIK (di-ACC pihak lain), 1.800 tidak terlacak. Dari yang terlacak, 22% macet (kolektibilitas 3+) dalam 24 bulan. Bandingkan dengan bad rate accepts di pita skor yang sama: 9%. Rasio lookback = 22/9 ≈ 2,4× — inilah pengali parceling yang ditambatkan data, bukan tebakan. Koreksi untuk yang tak terlacak: asumsikan mereka 1,5× lebih buruk dari yang terlacak (konservatif) → estimasi pita ≈ 27%. Satu query SLIK mengubah \"tebakan 2×\" menjadi \"estimasi 2,4× dari data sendiri\".",
        "Aturan keputusan. Satu: jalankan lookback tiap semester untuk pita di bawah cut-off — jadikan laporan rutin, bukan proyek sekali. Dua: laporkan selalu tiga angka — terlacak, tak terlacak, dan asumsi untuk tak terlacak — agar direksi melihat asumsi yang tersisa. Tiga: jangan pakai lookback untuk populasi yang perilakunya berubah cepat (fintech baru, segmen baru); jendela 24 bulan berarti datanya \"basi\" untuk segmen yang berumur 12 bulan. Empat: lookback mengukur masa lalu; untuk ekspansi ke depan, ia adalah lantai (batas bawah), bukan ramalan.",
      ],
      tasks: [],
      reference: "Lookback = jangkar data untuk pengali parceling; tak-terlacak = asumsi yang dinyatakan eksplisit.",
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
        "Selection bias: data latih = sampel tersaring, bukan populasi — model buta di bawah cut-off.",
        "Bias memburuk antar generasi model (spiral kebutaan) — hanya diputus data dari wilayah tolak.",
        "Empat metode: ignore · parceling · augmentation (1/P(ACC)) · full model/Heckman.",
        "Kebenaran terbaik = sampel acak di bawah cut-off (observasi langsung). Alternatif murah = SLIK lookback.",
        "Aturan emas: mau ubah cut-off? Wajib reject inference dulu.",
      ],
      next: { label: "CR9 — Behavioral Scorecard", href: "/v2/learn/cr9-behavioral-scorecard" },
      quiz: [
        {
          q: "Apa itu selection bias dalam scorecard?",
          options: [
            { text: "Data latih terlalu sedikit", why: "Bukan soal ukuran — soal keterwakilan." },
            { text: "Data latih (yang di-ACC) adalah sampel tersaring — tidak mewakili populasi aplikan — sehingga model buta di bawah cut-off", why: "Model belajar dari 'para penyintas' seleksi — wilayah tolak tidak pernah diamati.", correct: true },
            { text: "Model memilih variabel yang salah", why: "Itu masalah seleksi variabel, bukan selection bias." },
            { text: "Bias analis yang subjektif", why: "Ini bias struktural data, bukan subjektivitas analis." },
          ],
        },
        {
          q: "Bank berencana menurunkan cut-off 650 → 620 untuk ekspansi. Langkah wajib sebelumnya?",
          options: [
            { text: "Langsung turunkan — model pasti bisa", why: "Ekspansi = masuk wilayah buta. Tanpa estimasi, proyeksi NPL-nya tebakan." },
            { text: "Reject inference (augmentation/parceling) untuk estimasi bad rate di band 620–649 — keputusan diambil di wilayah buta", why: "Inilah aturan emas lesson ini.", correct: true },
            { text: "Naikkan bunga", why: "Pricing tidak menggantikan estimasi risiko wilayah baru." },
            { text: "Tunggu 1 tahun", why: "Menunggu tanpa data tidak menyelesaikan kebutaan." },
          ],
        },
        {
          q: "Dalam augmentation, nasabah skor 605 (peluang ACC 55%) diberi bobot 1/0,55 ≈ 1,8. Mengapa?",
          options: [
            { text: "Agar totalnya genap", why: "Tidak ada hubungannya dengan pembulatan." },
            { text: "Ia 'mewakili' dirinya + sebagian yang ditolak di sekitarnya — makin dekat cut-off, makin besar bobotnya", why: "Inverse probability weighting: yang hampir ditolak adalah 'duta' terbaik untuk wilayah tolak.", correct: true },
            { text: "Supaya model lebih cepat", why: "Pembobotan tidak mempercepat komputasi." },
            { text: "Tidak ada alasan", why: "Ada: mengkompensasi yang tak teramati." },
          ],
        },
        {
          q: "Metode mana yang memberi 'kebenaran' terbaik tentang yang ditolak?",
          options: [
            { text: "Ignore — paling sederhana", why: "Sederhana tetapi buta." },
            { text: "Parceling — asumsinya fleksibel", why: "Fleksibel tetapi tetap tebakan." },
            { text: "Sampel acak di bawah cut-off (observasi langsung) — data nyata mengalahkan semua tebakan statistik", why: "Hanya eksperimen terkontrol yang benar-benar mengamatinya.", correct: true },
            { text: "Augmentation — rumusnya elegan", why: "Elegan tetapi tetap estimasi, bukan observasi." },
          ],
        },
        {
          q: "Bank ingin ekspansi ke segmen UMKM informal (thin-file) yang belum pernah dilayani. Pendekatan reject inference yang paling tepat?",
          options: [
            { text: "Langsung gaspol — model lama pasti bisa dipakai", why: "Model lama buta total di populasi baru." },
            { text: "Program percontohan: ACC sampel acak dengan limit kecil, amati 12 bulan, latih model khusus segmen", why: "Satu-satunya obat kebutaan total adalah data dari populasi itu sendiri.", correct: true },
            { text: "Tolak semua — terlalu berisiko", why: "Terlalu defensif — pilot terkendali lebih baik." },
            { text: "Pakai model lama tanpa perubahan", why: "Model lama tidak valid di populasi baru." },
          ],
        },
      ],
    },
  ],
};
