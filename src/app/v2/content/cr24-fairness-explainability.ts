import type { V2Lesson } from "../lib/types";

export const cr24: V2Lesson = {
  slug: "cr24-fairness-explainability",
  track: "Credit Risk",
  module: "Regulasi & Fairness",
  title: "CR24 — Fairness & Explainability",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "'Keputusan sistem, tidak bisa dijelaskan'",
      prose: [
        "Sari, guru honorer dengan riwayat bayar sempurna, ditolak KTA tanpa alasan jelas. Ketika Sari protes, bank menjawab: \"Keputusan sistem, tidak bisa dijelaskan.\"",
        "Di banyak yurisdiksi — dan dalam semangat perlindungan konsumen OJK — jawaban itu tidak cukup. Nasabah yang ditolak berhak tahu alasannya.",
        "Lesson ini tentang dua kewajiban modern analis: model yang adil dan model yang bisa menjelaskan dirinya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keadilan adalah manajemen risiko: model yang diskriminatif = risiko regulasi (sanksi OJK), risiko reputasi (viral di media sosial), dan risiko model (proxy berkorelasi SARA biasanya tidak stabil). Bank yang mengabaikan fairness menabung tiga bom waktu sekaligus.",
      },
      reference: "Jika kamu tidak bisa menjelaskan penolakan ke nasabah, kamu juga tidak bisa mempertahankannya ke OJK.",
    },
    {
      id: "bias",
      eyebrow: "Langkah 2 · Bias",
      title: "Diskriminasi tanpa niat",
      prose: [
        "Disparate impact = kebijakan yang netral di permukaan tetapi merugikan kelompok tertentu secara tidak proporsional. Aturan praktis (dari praktik EEOC AS, diadopsi industri): jika kelompok B disetujui di bawah 80% dari tingkat kelompok A, model harus diaudit — bukan otomatis dinyatakan bersalah, tetapi wajib dijelaskan.",
        "Disparate impact seperti syarat tinggi badan untuk pekerjaan kantoran — netral di kertas, tetapi menyingkirkan perempuan secara sistemik. Model kredit punya \"syarat tinggi badan\" versinya sendiri: variabel yang terlihat teknis tetapi berpihak.",
        "Contoh: rasio = 41/68 = 0,60 < 0,80 — disparate impact terdeteksi. Ini memicu investigasi: apakah selisih karena risiko riil (kelompok B memang lebih berisiko — legitimate) atau karena bias model (fitur proxy)? Rasio tidak menjawab — ia bertanya.",
      ],
      formula: String.raw`\text{Rasio} = \frac{\text{approval rate}_B}{\text{approval rate}_A} \ge 0{,}8`,
      formulaNote: "Rasio < 0,8 = disparate impact → investigasi wajib. Bukan vonis — tetapi wajib dijelaskan.",
      note: {
        title: "🚨 Miskonsepsi: \"Model adil = model yang tidak memakai data SARA\"",
        type: "pitfall",
        body: "Salah — menghapus kolom suku, agama, dan gender tidak membuat model adil. Diskriminasi berjalan lewat proxy: 'kode pos' (korelasi 0,72 dengan etnis), 'tipe HP' (proxy Jawa vs luar Jawa, IV 0,28), atau nama. Contoh nyata: pinjol yang membuang 'tipe HP' dan menggantinya dengan 'riwayat pembayaran 12 bulan' (penyebab kausal langsung) — Gini turun tipis 0,44 → 0,42, tetapi rasio fairness naik 0,58 → 0,88. Keadilan diukur dari outcome (disparate impact < 0,8 = audit), bukan dari daftar kolom yang dihapus.",
      },
      tasks: [],
      reference: "Approval A 70%, B 52% → rasio 0,74 < 0,8: bedakan bias model vs beda risiko riil.",
    },
    {
      id: "lab-impact",
      eyebrow: "Langkah 3 · Lab Impact",
      title: "Deteksi disparate impact",
      prose: [
        "Simulasi terkunci: n=2000; kelompok A base 68%; kelompok B \"dihukum\" 27 poin (bias via proxy). Tugasmu: hitung approval rate tiap kelompok, rasio B/A, dan tentukan disparate impact.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rate_A` dan `rate_B`" },
        { id: "t2", text: "Hitung `rasio` dan `impact` (True jika rasio < 0,8)" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "A=67.9% B=40.9% rasio=0.60 impact=True",
      hints: [
        "Fungsi simulasi(n, base_rate, bias) terkunci.",
        "rate = hasil simulasi / n.",
        "rasio = rate_B / rate_A.",
      ],
      code: {
        starter: `import random\nrandom.seed(42)\n\ndef simulasi(n, base_rate, bias=0.0):\n    return sum(1 for _ in range(n) if random.random() < base_rate - bias)\n\nn = 2000\n\n# TULIS KODEMU\nrate_A = \nrate_B = \nrasio = \nimpact = \n\nprint(f"A={rate_A:.1%} B={rate_B:.1%} rasio={rasio:.2f} impact={impact}")`,
        lockLines: 6,
        solution: `import random\nrandom.seed(42)\n\ndef simulasi(n, base_rate, bias=0.0):\n    return sum(1 for _ in range(n) if random.random() < base_rate - bias)\n\nn = 2000\n\n# TULIS KODEMU\nrate_A = simulasi(n, 0.68) / n\nrate_B = simulasi(n, 0.68, bias=0.27) / n\nrasio = rate_B / rate_A\nimpact = rasio < 0.8\n\nprint(f"A={rate_A:.1%} B={rate_B:.1%} rasio={rasio:.2f} impact={impact}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rate_A", value: 0.679, tol: 0.005, label: "`rate_A` sekitar 67.9%", msg: "simulasi(2000, 0.68) / 2000." },
          { kind: "equal", task: "t1", name: "rate_B", value: 0.4095, tol: 0.005, label: "`rate_B` sekitar 41.0%", msg: "simulasi(2000, 0.68, bias=0.27) / 2000." },
          { kind: "equal", task: "t2", name: "rasio", value: 0.6031, tol: 0.01, label: "`rasio` sekitar 0.60", msg: "rate_B / rate_A = 0.60 < 0.80." },
          { kind: "equal", task: "t2", name: "impact", value: true, label: "`impact` = True", msg: "0.60 < 0.8 → disparate impact → investigasi wajib." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio=0\\.60\\s+impact=True", label: "`print` menampilkan rasio & impact", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "🚨 Mitos: lolos ambang 80% berarti model adil",
        body: "Yang benar: rasio ≥0,8 hanya berarti tidak ada sinyal disparate impact yang kuat — bukan sertifikat keadilan. Model bisa lolos 0,8 tetapi tetap diskriminatif lewat proxy halus (kode pos, tipe HP); sebaliknya rasio <0,8 bisa murni mencerminkan perbedaan risiko riil yang legitimate dan terdokumentasi. Ambang 0,8 adalah pemicu investigasi, bukan vonis — keadilan dibuktikan lewat bedah proxy, fitur kausal, dan jalur keluar bagi yang ditolak, bukan satu angka.",
      },
      reference: "0,74 < 0,8 = picu investigasi, bukan vonis. Mungkin risiko riil beda — tetapi harus dibuktikan.",
    },
    {
      id: "proxy",
      eyebrow: "Langkah 4 · Proxy",
      title: "Jalan tikus",
      prose: [
        "Proxy discrimination = model mendiskriminasi lewat variabel pengganti (proxy) yang berkorelasi dengan atribut sensitif (suku, agama, gender) — meski atribut itu tidak dipakai langsung. Contoh proxy umum: kode pos (etnis/wilayah), pekerjaan tertentu (gender), nama (suku), riwayat pendidikan (kelas sosial).",
        "Kode pos (korelasi 0,72 dengan kelompok etnis) = proxy berbahaya — hampir sama dengan memakai atribut sensitif langsung. Aturan: fitur dengan korelasi tinggi ke atribut sensitif harus diuji ulang: apakah ia menambah prediksi risiko murni, atau hanya menyalurkan bias? Jika yang kedua → buang, apapun IV-nya (CR7a).",
        "Variabel 'kode pos' prediktif (IV 0,3) tetapi berkorelasi 0,72 dengan etnis minoritas: buang sebagai default; ganti dengan penyebab kausal langsung (misal harga properti/pengangguran wilayah). 'Kan prediktif' bukan pembelaan hukum.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Model adil = buang semua variabel demografis.\" Membuang variabel sensitif tidak cukup — proxy tetap menyalurkan bias (fairness through unawareness = gagal). Sebaliknya, memakai atribut sensitif untuk audit (mengukur disparitas) justru diperlukan — kamu tidak bisa memperbaiki yang tidak kamu ukur. Prinsip: jangan pakai untuk keputusan, wajib pakai untuk pengujian.",
      },
      reference: "Mengapa atribut sensitif tetap dikumpulkan? Untuk MENGUKUR disparitas — bukan untuk keputusan.",
    },
    {
      id: "explain",
      eyebrow: "Langkah 5 · Explain",
      title: "Hak untuk tahu alasan",
      prose: [
        "Explainability = kemampuan menjelaskan mengapa model mengambil keputusan tertentu, dalam bahasa manusia. Standarnya: adverse action notice — nasabah yang ditolak menerima alasan spesifik utama (bukan \"keputusan sistem\").",
        "SHAP (SHapley Additive exPlanations) = tiap fitur diberi kontribusi +/− terhadap skor; jumlahnya = selisih dari rata-rata. Intuisi: seperti pembagian rapot — tiap mata pelajaran (fitur) menambah/mengurangi nilai akhir.",
        "Contoh penolakan terutama karena \"DPD 2× dalam 12 bulan\" (+0,35 risiko) dan \"utilisasi 85%\". Inilah yang ditulis di surat penolakan: \"ditolak karena riwayat keterlambatan dan utilisasi tinggi\" — spesifik, bisa ditindaklanjuti nasabah (bayar tepat waktu, turunkan utilisasi). \"Keputusan sistem\" = tidak bisa ditindaklanjuti = tidak adil.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Explainability bukan sekadar etika — melainkan kontrol kualitas. Model yang tidak bisa dijelaskan = tidak bisa diaudit = tidak bisa diperbaiki saat salah. Nasabah ditolak → adverse action notice: 2–3 alasan spesifik utama yang bisa ditindaklanjuti.",
      },
      reference: "Fintech ingin memakai 'isi galeri foto' untuk scoring? Dilarang — pelanggaran privasi berat (UU PDP).",
    },
    {
      id: "lab-shap",
      eyebrow: "Langkah 6 · Lab SHAP",
      title: "Kontribusi fitur per keputusan",
      prose: [
        "Tiru cara kerja SHAP: skor akhir = base + jumlah kontribusi. Data terkunci: base 650; kontribusi [DPD 2x (−70), utilisasi 85% (−45), penghasilan <5jt (−30), SLIK bersih (+25), pekerjaan tetap (+20)]; cutoff 600. Tugasmu: hitung skor, keputusan, dan 2 alasan penolakan utama.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor`" },
        { id: "t2", text: "Tentukan `ditolak` (bool)" },
        { id: "t3", text: "Cetak skor, keputusan, dan 2 alasan utama" },
      ],
      expected: "skor=550 DITOLAK alasan=DPD 2x & utilisasi",
      hints: [
        "skor = base_score + sum(kontribusi).",
        "ditolak = skor < cutoff.",
        "Urutkan kontribusi dari terkecil (paling negatif) untuk 2 alasan utama.",
      ],
      code: {
        starter: `base_score = 650\nkontribusi = [\n    ("DPD 12 bln terakhir: 2x", -70),\n    ("Utilisasi kartu 85%", -45),\n    ("Penghasilan < Rp 5 jt", -30),\n    ("SLIK bersih 3 thn", +25),\n    ("Pekerjaan tetap 5 thn", +20),\n]\ncutoff = 600\n\n# TULIS KODEMU\nskor = \nditolak = \nalasan = \n\nprint(f"skor={skor} keputusan={'DITOLAK' if ditolak else 'DITERIMA'} alasan={alasan}")`,
        lockLines: 9,
        solution: `base_score = 650\nkontribusi = [\n    ("DPD 12 bln terakhir: 2x", -70),\n    ("Utilisasi kartu 85%", -45),\n    ("Penghasilan < Rp 5 jt", -30),\n    ("SLIK bersih 3 thn", +25),\n    ("Pekerjaan tetap 5 thn", +20),\n]\ncutoff = 600\n\n# TULIS KODEMU\nskor = base_score + sum(k for _, k in kontribusi)\nditolak = skor < cutoff\nalasan = [nama for nama, k in sorted(kontribusi, key=lambda x: x[1])[:2]]\n\nprint(f"skor={skor} keputusan={'DITOLAK' if ditolak else 'DITERIMA'} alasan={alasan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: 550, label: "`skor` seharusnya 550", msg: "650 − 70 − 45 − 30 + 25 + 20 = 550." },
          { kind: "equal", task: "t2", name: "ditolak", value: true, label: "`ditolak` = True", msg: "550 < 600 → DITOLAK." },
          { kind: "contains", task: "t3", name: "alasan", value: "DPD 12 bln terakhir: 2x", label: "`alasan` memuat DPD 2x", msg: "Alasan utama = kontribusi paling negatif." },
          { kind: "stdout_matches", task: "t3", pattern: "skor=550\\s+keputusan=DITOLAK", label: "`print` menampilkan skor & keputusan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Penjelasan ke nasabah: 'ditolak terutama karena: DPD 2x dan utilisasi 85%' — spesifik, actionable.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: model adil yang bisa dijelaskan",
      prose: [
        "Skenario 1 — Rasio approval kelompok B/A di bawah 0,8. → Audit wajib: bedah apakah selisih = risiko riil (legitimate) atau bias model. Contoh nyata: 41/68 = 0,60 < 0,80 — disparate impact terdeteksi. Rasio tidak menjawab — ia bertanya.",
        "Skenario 2 — Fitur prediktif berkorelasi tinggi dengan atribut sensitif. → Uji model tanpa fitur itu. Contoh nyata: 'kode pos' IV tertinggi kedua tetapi korelasi 0,72 dengan etnis — dibuang, Gini 0,45 → 0,43, tetapi rasio naik ke 0,85. 0,02 Gini tidak sebanding dengan diskriminasi sistemik. 'Kan prediktif' bukan pembelaan hukum.",
        "Skenario 3 — Nasabah ditolak dan protes. → Berikan adverse action notice: alasan spesifik utama dari SHAP ('ditolak karena riwayat keterlambatan dan utilisasi 85%') — spesifik dan bisa ditindaklanjuti. 'Keputusan sistem, tidak bisa dijelaskan' = tidak adil, dan di banyak yurisdiksi tidak cukup secara hukum.",
        "Skenario 4 — Gini bagus (0,45) tetapi rasio 0,50. → Bekukan deployment sambil investigasi: risiko reputasi & hukum (OJK perlindungan konsumen, LSM, media) lebih besar dari 0,02 Gini. Gini bagus ≠ model boleh dipakai.",
        "Skenario 5 — Membangun ulang scorecard. → Pasang fairness test otomatis di pipeline validasi + guardrail, bukan slogan. Contoh nyata: pinjol mengganti 'tipe HP' (IV 0,28, proxy ketimpangan struktural) dengan 'riwayat pembayaran 12 bulan' (kausal langsung) — Gini 0,44 → 0,42, rasio 0,58 → 0,88.",
        "Aturan praktis 10 detik: fairness = sistem (ukur → uji → guardrail), bukan niat; keadilan diukur dari outcome (disparate impact), bukan dari input; fitur yang 'prediktif' karena memetakan ketimpangan struktural sedang mewarisi ketidakadilan dan menamainya 'data'.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghapus kolom suku/agama/gender lalu mengklaim 'model kami adil' — sementara 'kode pos' (korelasi 0,72 dengan etnis) dan 'tipe HP' (proxy Jawa vs luar Jawa) tetap di dalam dan justru punya IV tertinggi. Diskriminasi tidak butuh niat — ia butuh jalan tikus, dan proxy adalah jalan tikusnya.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Scorecard yang rasis tanpa sadar",
      prose: [
        "Scorecard KTA Bank Nusantara (Gini 0,45 — bagus!) lolos validasi teknis. Tetapi audit fairness menemukan: approval kelompok B = 35% vs kelompok A = 70% → rasio 0,50; fitur \"kode pos\" punya IV tertinggi kedua — dan berkorelasi 0,72 dengan kelompok; tim model: \"Tapi Gini-nya bagus dan tidak ada variabel SARA!\" LSM konsumen mengancam lapor ke OJK & media.",
        "Gini bagus ≠ model boleh dipakai. Tiga langkah: (1) akui & bekukan: rasio 0,50 = disparate impact jelas. Hentikan deployment sambil investigasi — risiko reputasi & hukum (perlindungan konsumen OJK) lebih besar dari Gini 0,45. (2) Bedah proxy: uji model tanpa kode pos — jika Gini turun sedikit (0,45 → 0,43) tetapi rasio naik ke 0,85, tukar: 0,02 Gini tidak sebanding dengan diskriminasi sistemik. Cari fitur pengganti yang legitimate (riwayat pembayaran, utilisasi). (3) Bangun ulang dengan guardrail: fairness test otomatis di pipeline validasi (CR19) + adverse action notice untuk tiap penolakan + dokumentasi trade-off ke komite.",
        "Pelajaran: \"tidak ada variabel SARA\" bukan pertahanan — proxy adalah diskriminasi dengan topeng teknis. Dan model terbaik adalah yang berani kamu pertahankan di depan kamera.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Gini/AUC-nya bagus, jadi modelnya aman dipakai.\" Skor diskriminasi mengukur kemampuan memilah risiko — BUKAN keadilan. Model bisa punya Gini 0,45 SEKALIGUS disparate impact 0,50: dua metrik, dua pertanyaan berbeda. Jangan menjawab \"apakah modelnya adil?\" dengan angka yang menjawab \"apakah modelnya akurat?\".",
      },
      reference: "Menghapus kode pos: Gini 0,45→0,43 tetapi rasio 0,50→0,85 — tukar. Putuskan via komite & dokumentasikan.",
    },
    {
      id: "pendalaman-sistem",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Fairness sebagai sistem, bukan slogan",
      prose: [
        "Contoh terapan kedua dari lapangan Indonesia: sebuah pinjol memakai \"tipe HP\" sebagai fitur scoring — HP flagship vs HP entry-level. IV-nya 0,28 (prediktif!), dan tim model mempertahankannya: \"kan tidak ada variabel SARA\". Audit menemukan: 78% pengguna HP flagship berdomisili di Jakarta/Surabaya dengan penghasilan >Rp 10 juta; 71% pengguna HP entry-level di luar Jawa dengan penghasilan <Rp 4 juta. Fitur ini bukan mengukur risiko individu — ia mengukur kode pos ekonomi yang dibungkus plastik. Approval rate kelompok luar-Jawa 38% vs Jawa 66% → rasio 0,58 < 0,8: disparate impact. Ketika fitur dibuang dan diganti \"riwayat pembayaran 12 bulan\" (fitur kausal langsung), Gini turun tipis 0,44 → 0,42 tetapi rasio naik ke 0,88. Pelajarannya: fitur yang \"prediktif\" karena memetakan ketimpangan struktural bukanlah menemukan risiko — ia mewarisi ketidakadilan dan menamainya \"data\".",
        "Kontras cara salah vs benar menangani temuan disparate impact. Cara salah — kuota kosmetik: \"approval kelompok B harus 60%\" tanpa mengubah model. Hasilnya: kelompok B yang berisiko tetap disetujui (NPL segmen meledak 8% → 14%), lalu manajemen menyalahkan \"keadilan\" dan mencabut programnya — keadilan menjadi kambing hitam atas NPL yang sebenarnya disebabkan model buruk. Cara benar — bedah akar: (1) identifikasi fitur proxy (korelasi ke atribut sensitif >0,5 = kandidat buang); (2) ganti dengan fitur kausal (riwayat bayar, utilisasi, stabilitas penghasilan); (3) ukur ulang: jika disparitas hilang DAN Gini bertahan, masalahnya memang proxy — bukan \"kelompok B lebih berisiko\". Kuota tanpa perbaikan model adalah makeup; perbaikan model tanpa kuota adalah operasi. Jangan tertukar.",
        "Mode kegagalan yang paling licin: feedback loop (lingkaran setan data). Model menolak 60% aplikasi dari kelompok B → kelompok B hampir tidak punya riwayat kredit di bank → 2 tahun kemudian model dilatih ulang dengan data baru yang \"menunjukkan\" kelompok B tidak punya track record → skor mereka makin rendah → penolakan makin tinggi. Model menciptakan realitas yang ia prediksi. Ini bukan teori: pola ini terdokumentasi di pasar kredit AS dan berisiko terulang di segmen thin-file Indonesia (pekerja informal, luar Jawa). Pertahanannya tiga lapis: (1) simpan data aplikasi yang DITOLAK beserta outcome proxy-nya (misal bayar pinjol lain via SLIK) — jangan latih model hanya dari yang disetujui (reject inference); (2) monitor approval rate per kelompok TIAP KUARTAL sebagai KRI fairness — tren menurun 2 kuartal = investigasi; (3) program kredit perintis kecil untuk segmen thin-file agar ada data outcome yang sebenarnya, bukan data ketiadaan.",
        "Pendalaman sub-topik yang selama ini hanya disebut sekilas: jebakan SHAP. SHAP membagi kontribusi antar fitur yang berkorelasi — dua fitur yang mengukur hal sama (misal \"DPD 12 bulan\" dan \"kolektibilitas SLIK terburuk\") akan SALING MEMBAGI kontribusi, sehingga masing-masing terlihat kecil. Akibatnya: adverse action notice menulis \"alasan: penghasilan rendah (−15)\" padahal alasan sebenarnya adalah riwayat macet yang kontribusinya terpecah ke tiga fitur berkorelasi. Nasabah mendapat surat yang menyesatkan — ia memperbaiki penghasilan, tetap ditolak. Aturan: sebelum menulis adverse action notice, gabungkan fitur berkorelasi >0,7 menjadi satu \"keluarga alasan\" (misal \"riwayat pembayaran\"), lalu laporkan kontribusi keluarganya. Penjelasan yang jujur kadang butuh mengelompokkan dulu, bukan melaporkan angka mentah.",
        "Aturan keputusan untuk komite model. Satu: setiap model baru wajib lolos fairness test otomatis (rasio approval per kelompok sensitif ≥0,8 ATAU terdokumentasi alasannya) sebelum deployment — fairness adalah gerbang, bukan hiasan. Dua: fitur dengan korelasi >0,5 ke atribut sensitif = kandidat buang; pertahankan hanya jika terbukti kausal dan disetujui komite tertulis. Tiga: adverse action notice untuk SEMUA penolakan — 2–3 alasan spesifik yang actionable, ditulis dalam bahasa nasabah. Empat: KRI fairness (approval rate per kelompok) dimonitor kuartalan; tren memburuk 2 kuartal = investigasi wajib. Lima: simpan data aplikasi ditolak + outcome proxy untuk reject inference — model yang hanya belajar dari yang disetujui sedang belajar dari separuh kebenaran. Lima aturan ini membuat fairness menjadi sistem, bukan slogan.",
        "Contoh konkret adverse action notice yang benar vs salah — dari kasus nyata polanya. Pak Andi ditolak KTA Rp 50 juta. Surat yang SALAH: \"Berdasarkan hasil verifikasi sistem, pengajuan Anda belum dapat disetujui.\" — tidak ada informasi, tidak bisa ditindaklanjuti, dan secara regulasi rawan. Surat yang BENAR: \"Pengajuan belum dapat disetujui terutama karena: (1) riwayat keterlambatan: 2× DPD>30 hari dalam 12 bulan terakhir (kontribusi terbesar terhadap skor); (2) utilisasi kartu kredit 85% dari limit. Yang bisa Anda lakukan: bayar tepat waktu minimal 6 bulan berturut-turut dan turunkan utilisasi di bawah 50%, lalu ajukan kembali.\" Perhatikan: spesifik, terukur, ada jalan keluar. Standar operasionalnya: surat penolakan ditulis dari 2–3 kontribusi SHAP terbesar yang bersifat actionable — \"umur terlalu muda\" bukan alasan yang bisa ditindaklanjuti, jadi jangan jadikan alasan utama walau kontribusinya besar; pilih alasan yang bisa diubah nasabah. Menolak tanpa jalan keluar = menghukum; menolak dengan jalan keluar = mendidik.",
        "Pendalaman tata kelola: model card fairness. Setiap model kredit wajib punya satu halaman \"kartu model\" yang ditempel di dokumentasi: untuk siapa model ini diuji (kelompok sensitif apa saja), berapa rasio approval per kelompok pada data validasi, fitur apa yang dicurigai sebagai proxy dan apa keputusannya (buang/pertahankan + alasan tertulis + tanda tangan komite), dan kapan audit fairness berikutnya dijadwalkan. Kartu ini bukan birokrasi — ia adalah bukti bahwa bank berpikir SEBELUM skandal, bukan sesudahnya. Ketika OJK atau media bertanya \"apakah model Anda adil?\", jawaban \"kami sudah menguji, ini hasilnya\" jauh lebih kuat dari \"kami tidak berniat diskriminatif\". Niat tidak bisa diaudit; kartu bisa. Dan satu aturan keras: model tanpa kartu fairness yang ditandatangani = tidak boleh deployment, tanpa pengecualian — sama seperti obat tanpa label tidak boleh dijual. Kepercayaan konsumen adalah aset bank; kartu fairness adalah polis asuransinya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: fairness bukan soal niat, soal sistem — ukur, bukan duga",
        body: "Tidak ada tim model yang berniat diskriminatif — dan justru di situlah bahayanya. Bias tidak masuk lewat niat jahat; ia masuk lewat fitur yang \"kan prediktif\", lewat data historis yang \"kan objektif\", lewat threshold yang \"kan sama untuk semua\". Heuristiknya: jangan pernah bertanya \"apakah model ini adil?\" — pertanyaan itu tidak bisa dijawab dengan perasaan. Tanyakan tiga angka: (1) berapa rasio approval antar kelompok? (2) fitur apa yang paling berkorelasi dengan atribut sensitif, dan apakah ia kausal atau sekadar proxy? (3) apakah kelompok yang ditolak punya jalur membangun riwayat (atau modelku menutup pintu lalu menyalahkan mereka karena tidak punya kunci)? Keadilan dalam perkreditan bukanlah sifat model — ia adalah sifat SISTEM: data yang dikumpulkan, fitur yang dipilih, threshold yang ditetapkan, dan jalur keluar yang disediakan. Model yang adil tanpa sistem yang adil hanyalah niat baik yang belum diuji. Dan ingat asimetri risikonya: satu kasus viral \"ditolak karena suku\" menghancurkan kepercayaan yang dibangun sepuluh tahun — biaya fairness selalu lebih murah dari biaya skandalnya, dan kepercayaan yang hilang tidak bisa dibeli kembali.",
      },
      reference: "Ukur tiga angka: rasio approval antar kelompok, korelasi proxy, dan jalur keluar bagi yang ditolak.",
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
        "Disparate impact: rasio < 0,8 → investigasi wajib. Rasio bertanya, bukan memvonis.",
        "Fairness through unawareness gagal — proxy (kode pos, nama) menyalurkan bias.",
        "Atribut sensitif: jangan pakai untuk keputusan, wajib pakai untuk pengujian.",
        "Adverse action notice: 2–3 alasan spesifik, actionable.",
        "Explainability = kontrol kualitas: model yang tak bisa dijelaskan tak bisa diaudit.",
      ],
      next: { label: "CR25 — Capstone", href: "/learn/cr25-capstone" },
      quiz: [
        {
          q: "Approval A 70%, B 52%. Rasio 0,74. Artinya?",
          options: [
            { text: "Diskriminasi terbukti — model harus dibuang", why: "Rasio memicu investigasi, bukan vonis." },
            { text: "Disparate impact terdeteksi (< 0,8) → investigasi wajib: bedakan bias model vs beda risiko riil", why: "Mungkin risiko riil beda — tetapi harus dibuktikan, bukan diasumsikan.", correct: true },
            { text: "Aman — di atas 0,5", why: "Ambangnya 0,8, bukan 0,5." },
            { text: "Naikkan approval B secara manual", why: "Itu manipulasi — selidiki dulu." },
          ],
        },
        {
          q: "Model tidak memakai variabel SARA sama sekali. Apakah pasti adil?",
          options: [
            { text: "Ya — pasti adil", why: "Proxy = jalan tikus." },
            { text: "Tidak: proxy discrimination — kode pos/pekerjaan bisa menyalurkan bias tanpa variabel sensitif langsung (fairness through unawareness gagal)", why: "Audit butuh data sensitif (untuk pengujian, bukan keputusan).", correct: true },
            { text: "Ya jika Gini tinggi", why: "Gini tidak mengukur keadilan." },
            { text: "Tidak, tetapi tidak bisa diperbaiki", why: "Bisa — buang proxy, ukur disparitas." },
          ],
        },
        {
          q: "Nasabah ditolak. Respons yang benar?",
          options: [
            { text: "'Keputusan sistem, tidak bisa dijelaskan'", why: "Itu tidak cukup — dan tidak adil." },
            { text: "Adverse action notice: 2-3 alasan spesifik utama (misal riwayat DPD + utilisasi tinggi) yang bisa ditindaklanjuti", why: "Hak nasabah = tahu alasan.", correct: true },
            { text: "Diam saja", why: "Melanggar hak nasabah." },
            { text: "Terima semua agar adil", why: "Itu bukan solusi." },
          ],
        },
        {
          q: "Variabel 'kode pos' prediktif (IV 0,3) tetapi berkorelasi 0,72 dengan etnis minoritas. Keputusan?",
          options: [
            { text: "Pertahankan — kan prediktif", why: "'Kan prediktif' bukan pembelaan hukum." },
            { text: "Buang sebagai default; ganti dengan penyebab kausal langsung (misal harga properti/pengangguran wilayah) — 'kan prediktif' bukan pembelaan hukum", why: "Pakai penyebabnya, bukan alamatnya.", correct: true },
            { text: "Sembunyikan dari dokumentasi", why: "Itu pelanggaran." },
            { text: "Pakai tetapi jangan bilang siapa-siapa", why: "Itu diskriminasi tersembunyi." },
          ],
        },
        {
          q: "Fintech ingin memakai 'isi galeri foto' untuk scoring (katanya IV tinggi). Penilaianmu?",
          options: [
            { text: "Boleh — IV tinggi = boleh", why: "IV tidak mengalahkan hukum." },
            { text: "Dilarang — pelanggaran privasi berat (UU PDP); tidak ada consent yang membenarkan; IV tinggi tidak mengalahkan hukum", why: "Model dari data curian = ilegal sejak lahir.", correct: true },
            { text: "Boleh asal tidak ketahuan", why: "Itu pelanggaran." },
            { text: "Boleh untuk thin-file saja", why: "Tidak ada pengecualian." },
          ],
        },
      ],
    },
  ],
};
