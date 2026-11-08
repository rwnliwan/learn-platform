import type { V2Lesson } from "../lib/types";

export const fr5: V2Lesson = {
  slug: "fr5-rule-based",
  track: "Fraud & AML Analytics",
  module: "Deteksi Klasik",
  title: "FR5 — Rule-Based Detection",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rule 3 baris yang mengalahkan model Rp500 juta",
      prose: [
        "Fintech \"BayarKu\" menghabiskan Rp500 juta membangun model ML fraud — 6 bulan kerja, 40 fitur, AUC 0,97. Minggu pertama produksi: model menangkap 12% fraud. Sementara itu, analis senior menulis rule 3 baris di sore hari: \"Tahan jika >5 transaksi/jam dari device baru ke merchant baru\" — menangkap 34% fraud sendirian.",
        "Bagaimana bisa? Model 0,97 AUC itu dilatih dengan label 4 bulan terakhir yang belum matang — ia belajar pola basi. Rule 3 baris itu lahir dari pengalaman investigator kemarin sore: \"serangan warming selalu begini polanya.\"",
        "Dua tahun kemudian, rule 3 baris itu masih jalan — dimodifikasi 40x, tapi tidak pernah dimatikan. Model Rp500 juta sudah diganti 3x. Rule-based bukan \"teknologi kuno sebelum ML\" — ia lapisan pertahanan yang tak tergantikan, dan analis yang bisa merancangnya adalah aset paling mahal di tim fraud.",
      ],
      tasks: [],
      reference: "Rule = pengetahuan yang bisa dibaca, diukur, dan diwariskan — bahkan saat analisnya resign.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 2 · Anatomi rule",
      title: "Kondisi, aksi, prioritas, expiry, owner",
      prose: [
        "Rule profesional punya 5 komponen. Kondisi: predikat yang bisa dievaluasi real-time, mis. velocity_1h > 5 AND device_age_days < 7. Aksi: block (tolak), hold (tahan + review), step-up (minta verifikasi tambahan), monitor (catat saja) — aksi adalah spektrum gesekan, bukan biner tahan/lolos. Step-up untuk skor menengah sering lebih optimal daripada block.",
        "Prioritas: urutan evaluasi — rule \"block\" yang murah dievaluasi dulu; rule mahal (panggil API eksternal) belakangan. Expiry / review date: setiap rule wajib punya tanggal kedaluwarsa review. Rule tanpa expiry = bom waktu: penipu sudah adaptasi, rule masih menahan nasabah normal. Owner & alasan: siapa yang membuat, berdasarkan kasus apa — tanpa ini tidak ada yang berani mematikan rule \"keramat\" 2 tahun kemudian.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Velocity rule = batasi N transaksi per jam untuk semua orang.\" Ambang absolut buta konteks — pedagang pasar yang terima 50 QRIS/jam adalah normal, tapi akun pribadi dengan 50 transfer/jam adalah mule. Velocity harus relatif terhadap baseline (per user, per segmen).",
      },
      reference: "Velocity relatif terhadap baseline, bukan absolut. Tulis tiap rule: HIPOTESIS → RULE → METRIK → KEDALUWARSA.",
    },
    {
      id: "velocity",
      eyebrow: "Langkah 3 · Lab velocity",
      title: "Trade-off ambang: tangkap banyak vs tepat",
      prose: [
        "Velocity = jumlah/nilai transaksi dalam jendela waktu: count_1h, sum_24h, distinct_merchant_10m. Kenapa mematikan? Penipu berpacu dengan waktu — kartu curian harus dikuras sebelum diblokir; mule harus meneruskan sebelum hold. Kecepatan adalah sidik jari universal serangan.",
        "Dua metrik mengukur sebuah rule — dan keduanya bertentangan. Detection rate: \"dari semua fraud, berapa % yang tertangkap?\" Hit rate: \"dari yang ditahan rule ini, berapa % yang benar fraud?\" — inilah yang dirasakan investigator. Geser ambang dan rasakan trade-off-nya di lab.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `evaluasi(ambang)` → (detection%, hit%, jumlah ditahan)" },
        { id: "t2", text: "Uji ambang 3, 5, 7, 9, 12 dan cetak tabelnya" },
      ],
      expected: "Ambang rendah (3) = detection 100% tapi hit 5.1%; ambang tinggi (12) = hit 100% tapi detection 50%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Tuning = cari ambang dengan akurasi tertinggi.\" Akurasi tidak relevan untuk rule fraud (base rate kecil). Yang relevan: detection rate pada budget false positive yang tersedia. Rule dengan \"akurasi 99%\" tapi menghasilkan 5.000 alert/hari untuk tim 10 orang = rule yang mati di hari pertama.",
      },
      hints: [
        "ditahan = transaksi dengan velocity >= ambang.",
        "detection = TP/40*100; hit = TP/len(ditahan)*100.",
        "def evaluasi(ambang): hitung ditahan, tp, lalu kembalikan ketiganya.",
      ],
      code: {
        starter: `# 2000 transaksi (40 fraud). Rule: tahan jika velocity >= N trx/jam.\nimport random\nrandom.seed(11)\ndata = [(random.gauss(12, 4), 1) for _ in range(40)] + \\\n       [(random.gauss(2.5, 1.5), 0) for _ in range(1960)]\nrandom.shuffle(data)\n\n# TULIS KODEMU: evaluasi rule pada satu ambang\ndef evaluasi(ambang):\n    ditahan =\n    tp =\n    det =\n    hit =\n    return det, hit, len(ditahan)\n\nprint(f"{'Ambang':>6s} {'Ditahan':>7s} {'Detect%':>7s} {'Hit%':>6s}")\nfor a in [3, 5, 7, 9, 12]:\n    d, h, n = evaluasi(a)\n    print(f">={a:4d}/jam {n:7d} {d:6.1f}% {h:5.1f}%")`,
        lockLines: 6,
        solution: `# 2000 transaksi (40 fraud). Rule: tahan jika velocity >= N trx/jam.\nimport random\nrandom.seed(11)\ndata = [(random.gauss(12, 4), 1) for _ in range(40)] + \\\n       [(random.gauss(2.5, 1.5), 0) for _ in range(1960)]\nrandom.shuffle(data)\n\n# TULIS KODEMU: evaluasi rule pada satu ambang\ndef evaluasi(ambang):\n    ditahan = [(v, y) for v, y in data if v >= ambang]\n    tp = sum(y for _, y in ditahan)\n    det = tp / 40 * 100\n    hit = tp / len(ditahan) * 100 if ditahan else 0\n    return det, hit, len(ditahan)\n\nprint(f"{'Ambang':>6s} {'Ditahan':>7s} {'Detect%':>7s} {'Hit%':>6s}")\nfor a in [3, 5, 7, 9, 12]:\n    d, h, n = evaluasi(a)\n    print(f">={a:4d}/jam {n:7d} {d:6.1f}% {h:5.1f}%")`,
        checks: [
          { kind: "defined", task: "t1", name: "evaluasi", label: "`evaluasi` terdefinisi", msg: "Buat fungsi evaluasi(ambang) yang mengembalikan (det, hit, jumlah)." },
          { kind: "stdout_matches", task: "t2", pattern: ">=\\s+5/jam\\s+134\\s+97\\.5%\\s+29\\.1%", label: "Baris ambang 5 benar", msg: "Ambang 5: 134 ditahan, detection 97,5%, hit 29,1%." },
          { kind: "stdout_matches", task: "t2", pattern: ">=\\s+12/jam\\s+20\\s+50\\.0%\\s+100\\.0%", label: "Baris ambang 12 benar", msg: "Ambang 12: 20 ditahan, detection 50,0%, hit 100,0%." },
        ],
      },
      reference: "Ambang rendah = detection tinggi + FP tinggi. Titik optimal ditentukan kapasitas investigasi.",
    },
    {
      id: "champion",
      eyebrow: "Langkah 4 · Champion-challenger",
      title: "Uji rule baru tanpa risiko produksi",
      prose: [
        "Champion = rule yang sedang produksi. Challenger = rule kandidat pengganti. Challenger dijalankan dalam shadow mode: ia mengevaluasi tiap transaksi dan mencatat apa yang akan dilakukannya — tanpa benar-benar menahan. Kriteria promosi: detection rate ≥ champion (pada data matang), hit rate tidak turun signifikan (>~20% relatif), dan volume alert ≤ kapasitas.",
        "Kenapa tidak langsung ganti? Rule yang \"bagus di data historis\" bisa katastrofik di produksi: distribusi bergeser, penipu adaptasi, atau ada bug logika yang hanya muncul di edge case live. Shadow mode = uji coba tanpa korban. Contoh nyata: champion \"negara asing + nominal > Rp5jt\" (precision 10,5%) vs challenger \"device baru + velocity + nominal > persentil-95\" (precision 22,8%) — challenger menangkap sedikit lebih sedikit fraud tapi 2,2x lebih efisien per rupiah biaya review.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `champion(d)` dan `challenger(d)`" },
        { id: "t2", text: "Bandingkan: ditahan, detect%, hit% — cetak keduanya" },
      ],
      expected: "Champion: 134 ditahan, 97.5% detect, 29.1% hit | Challenger: 61 ditahan, 47.5% detect, 31.1% hit",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Challenger menangkap lebih sedikit fraud total (47,5% < 97,5%) — analis junior akan mempertahankan champion. Tapi hitung biayanya: champion butuh 134 review, challenger 61. Keputusan senior: promosikan challenger, tapi jangan buang fraud unik champion — ekstrak polanya jadi rule ketiga yang lebih spesifik.",
      },
      hints: [
        "champion: d[0] >= 5 (velocity saja).",
        "challenger: d[0] >= 5 dan d[1] == 1 (velocity + device baru).",
        "flagged = [d for d in data if rule(d)], lalu hitung tp/detect/hit.",
      ],
      code: {
        starter: `# Champion: rule lama (ambang 5). Challenger: rule baru (ambang 5 + device baru).\nimport random\nrandom.seed(23)\ndata = [(random.gauss(12, 4), random.choice([0,1]), 1) for _ in range(40)] + \\\n       [(random.gauss(2.5, 1.5), random.choice([0,1]), 0) for _ in range(1960)]\nrandom.shuffle(data)\n\n# TULIS KODEMU: dua fungsi rule\ndef champion(d):\n    return \ndef challenger(d):\n    return \n\nfor nama, rule in [("Champion ", champion), ("Challenger", challenger)]:\n    flagged = [d for d in data if rule(d)]\n    tp = sum(d[2] for d in flagged)\n    det = tp / 40 * 100\n    hit = tp / len(flagged) * 100 if flagged else 0\n    print(f"{nama}: ditahan={len(flagged):4d}  detect={det:5.1f}%  hit={hit:5.1f}%")`,
        lockLines: 6,
        solution: `# Champion: rule lama (ambang 5). Challenger: rule baru (ambang 5 + device baru).\nimport random\nrandom.seed(23)\ndata = [(random.gauss(12, 4), random.choice([0,1]), 1) for _ in range(40)] + \\\n       [(random.gauss(2.5, 1.5), random.choice([0,1]), 0) for _ in range(1960)]\nrandom.shuffle(data)\n\n# TULIS KODEMU: dua fungsi rule\ndef champion(d):\n    return d[0] >= 5\ndef challenger(d):\n    return d[0] >= 5 and d[1] == 1\n\nfor nama, rule in [("Champion ", champion), ("Challenger", challenger)]:\n    flagged = [d for d in data if rule(d)]\n    tp = sum(d[2] for d in flagged)\n    det = tp / 40 * 100\n    hit = tp / len(flagged) * 100 if flagged else 0\n    print(f"{nama}: ditahan={len(flagged):4d}  detect={det:5.1f}%  hit={hit:5.1f}%")`,
        checks: [
          { kind: "defined", task: "t1", name: "champion", label: "`champion` terdefinisi", msg: "Buat fungsi champion(d)." },
          { kind: "defined", task: "t1", name: "challenger", label: "`challenger` terdefinisi", msg: "Buat fungsi challenger(d)." },
          { kind: "stdout_matches", task: "t2", pattern: "Champion : ditahan=\\s+134", label: "Champion menahan 134", msg: "Champion = velocity >= 5 → 134 ditahan." },
          { kind: "stdout_matches", task: "t2", pattern: "Challenger: ditahan=\\s+61", label: "Challenger menahan 61", msg: "Challenger = velocity >= 5 AND device baru → 61 ditahan." },
        ],
      },
      reference: "Challenger wajib shadow mode; promosi hanya jika detection ≥, hit rate aman, volume muat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Rule kapan, ML kapan",
      prose: [
        "Satu: pola serangan jelas & stabil → rule (cepat, murah, bisa dijelaskan). Contoh: rule 3 baris BayarKu yang mengalahkan model Rp500 juta. Dua: pola kabur / banyak interaksi fitur → ML. Contoh: first-party fraud — tidak ada \"ambang ajaib\", hanya pola perilaku halus. Tiga: nol label / produk baru → rule pakar + unsupervised. Contoh: fitur QRIS baru — 3 bulan pertama full rule-based. Empat: produksi jangka panjang → keduanya, berlapis. Arsitektur standar industri: rule layer → ML scoring → manual review.",
        "Rule punya siklus hidup. Rule darurat 0-day: deploy dalam 2 jam, pasang tanggal kedaluwarsa 14 hari, pantau hit rate harian — rule darurat tanpa tanggal kedaluwarsa akan hidup selamanya. Retire tiap kuartal: fire rate 0 dalam 90 hari = kandidat hapus; precision turun 3 kuartal beruntun = pola basi; 95% tangkapan juga ditangkap rule lain = redundan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Rule yang bagus tidak perlu diubah-ubah.\" Rule adalah foto pola serangan di satu titik waktu — dan penjahat terus berganti pose. Rule tanpa jadwal review kuartalan = foto usang yang dipajang sebagai cermin. Yang hebat bukan rule-nya, tapi disiplin meninjau ulangnya.",
      },
      reference: "Rule = pagar (murah, jelas); ML = anjing penjaga (pintar, butuh dilatih). Rumah aman punya keduanya, pagar dulu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "6 rule, kapasitas 200 review/hari",
      prose: [
        "Kamu mewarisi 6 rule. R1 (velocity, hit 34%): 120 alert/hari. R2 (device baru, hit 28%): 90 alert/hari. R3 (nominal besar, hit 12%): 60 alert/hari. R4 (lokasi aneh, hit 22%): 70 alert/hari. R5 (jam aneh, hit 8%): 150 alert/hari. R6 (merchant baru, hit 15%): 40 alert/hari. Total: 530 alert/hari — 2,6x kapasitas 200. Investigator kelelahan, banyak alert dilewati tanpa dibaca.",
        "Pertanyaan: rancang portofolio rule yang muat 200/hari dengan detection maksimal. Rule mana dipertahankan/diubah/dimatikan?",
        "Pembahasan: hitung \"harga per detection\" — R5 memakan 150 slot (75% kapasitas!) dengan hit rate 8%: termahal dan terburuk. Rancangan: (a) R5 turunkan aksi dari hold → monitor (tidak makan kapasitas, tetap kumpulkan data); (b) R1+R2 ketatkan sedikit agar total ~150/hari; (c) R4 gabungkan dengan R2 (\"device baru AND lokasi aneh\") — kombinasi dua sinyal sedang jadi satu sinyal kuat, ~30/hari; (d) R3, R6 pertahankan sebagai monitor. Total hold ≈ 180/hari ≤ 200. Optimasi portofolio rule = knapsack problem — maksimalkan detection dengan budget kapasitas.",
      ],
      tasks: [],
      reference: "Rule tidak dinilai sendirian, melainkan sebagai portofolio. Hit rate <10% = kandidat kombinasi/penurunan aksi.",
    },
    {
      id: "rule-bloat",
      eyebrow: "Langkah 7 · Rule bloat",
      title: "340 rule, 207 tak pernah fire: Rp310,5 juta per tahun",
      prose: [
        "Hasil audit rule di bank 'X': 340 rule aktif. 207 di antaranya (61%) TIDAK PERNAH fire dalam 12 bulan terakhir. 48 rule fire kurang dari 10 kali setahun. Hanya 85 rule (25%) yang benar-benar bekerja. Setiap rule punya biaya hidup: review kuartalan 2 jam × Rp300 ribu per jam = Rp600 ribu; testing regresi tiap deploy; dokumentasi; dan waktu evaluasi tiap transaksi — 340 rule × 0,5 milidetik = 170 ms latensi tambahan di jalur real-time, di mana 170 ms adalah perbedaan antara 'blokir sebelum dana keluar' dan 'blokir setelah dana keluar'. Total biaya maintenance: 207 rule mati × Rp1,5 juta per tahun (review + test + dokumen + overhead) = Rp310,5 juta per tahun — untuk rule yang tidak menghasilkan apa-apa selain rasa aman yang palsu.",
        "Dari mana bloat berasal — empat sumber yang semuanya manusiawi. Satu: rule insiden — setiap fraud besar melahirkan 1 rule baru 'agar tidak terulang', dan tidak pernah dicabut setelah ancamannya berlalu. Dua: rule titipan — 'tambahkan rule untuk kasus X ya' dari atasan, tanpa owner, tanpa hipotesis, tanpa tanggal kedaluwarsa. Tiga: rule duplikat — 3 rule berbeda menangkap pola yang sama dengan 95% overlap tangkapan (ditemukan saat audit: rule #112, #187, dan #245 pada dasarnya satu rule yang ditulis ulang 3 kali oleh 3 orang). Empat: rule takut — 'jangan dihapus, siapa tahu masih berguna' — argumen yang tidak pernah bisa dibantah dan tidak pernah benar. Bloat bukan kegagalan teknis; ia adalah kegagalan keberanian menghapus.",
        "Biaya tersembunyi yang tidak ada di spreadsheet. Konflik rule: 2 rule fire bersamaan untuk 1 transaksi → alert ganda → investigator bingung mana yang prioritas → waktu triage naik 2x. Latensi: 170 ms × 200.000 transaksi per hari = 9,4 jam-komputasi per hari — server tambahan yang dibeli untuk mengevaluasi rule yang tidak pernah fire. False sense of security: 'kita punya 340 rule' terdengar seperti 'kita aman' di rapat direksi — padahal 61% di antaranya mati. Dan yang termahal: biaya marjinal. Rule ke-341 harus diuji terhadap 340 rule lama (konflik? duplikat? latensi?) — biayanya 10x lipat dari rule ke-10. Sistem yang bloated menghukum setiap perbaikan baru; inovasi mati bukan karena dilarang, tapi karena terlalu mahal.",
        "Strategi sunset dengan angka — bukan 'bersih-bersih kalau sempat'. Tahap 1, inventarisasi (2 minggu): untuk tiap rule catat fire rate 12 bulan, precision (bila ada label), dan overlap tangkapan antar-rule (berapa % tangkapan rule A juga ditangkap rule B). Tahap 2, shadow mode 90 hari: 207 rule mati dinonaktifkan aksinya tapi tetap dicatat 'akan fire' — bila 0 fire dalam 90 hari → hapus permanen. Bila ada yang fire → ia bukan mati, ia jarang; pindahkan ke tier 'rule jarang' dengan review tahunan. Tahap 3, konsolidasi: 48 rule jarang dengan overlap ≥ 80% digabungkan — target akhir 340 → 120 rule. Tahap 4, gerbang masuk: rule baru WAJIB punya owner + expiry date + hipotesis tertulis ('rule ini menangkap X, ekspektasi Y fire per bulan, precision target Z%') — tanpa hipotesis, dilarang masuk produksi. Hipotesis yang tidak terpenuhi dalam 90 hari = rule di-sunset otomatis.",
        "Hasilnya di bank X setelah 6 bulan: 340 → 118 rule. Latensi 170 ms → 59 ms. Biaya maintenance Rp510 juta → Rp177 juta per tahun (hemat Rp333 juta). Alert per hari turun 18% (duplikat hilang) → precision naik 6 poin → investigator berhenti mengeluh. Dan efek samping yang tak terduga: tim menjadi BERANI menambah rule baru — karena gerbang masuknya jelas dan biayanya terlihat. Paradoksnya: sistem yang rajin menghapus adalah sistem yang paling mudah ditambahi. Bloat bukan masalah 'terlalu banyak rule'; ia masalah 'tidak ada yang berani menghapus'.",
        "Jadwal sunset yang bisa ditempel di dinding. Tiap kuartal: (1) tarik laporan fire rate semua rule; (2) rule dengan 0 fire dalam 180 hari → shadow mode otomatis; (3) rule dengan precision turun 3 kuartal beruntun → review pola (basi?); (4) rule dengan overlap tangkapan > 90% dengan rule lain → kandidat gabung; (5) rule darurat yang umurnya > 14 hari tanpa perpanjangan → mati otomatis (lihat FR5 langkah 5). Total waktu: 4 jam per kuartal untuk 1 analis. Empat jam per kuartal vs Rp310 juta per tahun — ROI 775x. Tidak ada alasan 'tidak sempat' yang bisa bertahan dari angka itu.",

        "Anatomi satu rule mati — rule #187, 'transfer > Rp50 juta ke rekening < 30 hari di atas jam 22.00'. Lahir Maret 2023 dari insiden: 1 kasus fraud Rp78 juta jam 23.14. Sejak itu: 0 fire dalam 36 bulan. Biayanya: 12 review kuartalan × 2 jam × Rp300 ribu = Rp7,2 juta; 36 testing regresi × 0,5 jam × Rp300 ribu = Rp5,4 juta; latensi 0,5 ms × 200.000 trx/hari × 1.095 hari = 30 jam-komputasi. Total: ~Rp13 juta untuk 1 rule selama 3 tahun — dikali 207 = Rp2,7 miliar dalam 3 tahun untuk 'jaga-jaga'. Dan ironisnya: bila pola 2023 itu muncul lagi, rule #187 TIDAK akan menangkapnya — penipu sudah pindah ke jam 21.00 dan rekening 45 hari. Rule mati tidak hanya mahal; ia juga tidak melindungi dari ancaman yang melahirkannya.",
        "Shadow mode — cara menghapus tanpa drama politik. Teknisnya: flag rule sebagai 'shadow' — engine tetap mengevaluasi, hasilnya dicatat ke log, TAPI tidak memicu alert/tindakan. Jalankan 90 hari. Tiga hasil mungkin: (1) 0 shadow-fire → hapus permanen, tanpa debat (datanya bicara); (2) shadow-fire > 0 tapi semuanya false positive → hapus juga (ia hidup tapi tidak berguna); (3) shadow-fire dengan true positive → hidupkan kembali sebagai 'rule jarang' dengan review tahunan. Shadow mode mengubah penghapusan dari keputusan politik ('siapa yang berani hapus rule Pak Direktur?') menjadi keputusan data ('90 hari, 0 fire, hapus otomatis sesuai SOP'). SOP sunset yang disetujui di awal = tameng untuk analis di akhir.",
        "Rule debt — analogi yang tepat adalah tech debt. Setiap rule insiden yang ditambahkan tanpa expiry = pinjaman: kamu mendapat 'keamanan' hari ini, membayar bunganya tiap kuartal (review, test, latensi, konflik). 207 rule mati = pokok Rp310,5 juta/tahun + bunga berupa kelambatan setiap perubahan. Dan seperti tech debt, ada titik bangkrut: tim yang 70% waktunya habis untuk merawat rule lama tidak punya waktu untuk ancaman baru — lalu kecolongan, lalu menambah rule insiden baru, lalu semakin bloated. Spiralnya hanya berhenti dengan satu cara: cicil penghapusan tiap kuartal, seperti cicilan utang. Tidak ada 'proyek bersih-bersih besar tahun depan' — yang ada hanya disiplin kecil yang konsisten.",
        "Ringkasnya, rule bloat. Satu: audit dulu — 61% tak pernah fire = Rp310,5 juta per tahun untuk rasa aman palsu. Dua: kenali 4 sumber bloat (insiden, titipan, duplikat, takut) — semuanya masalah manusia, bukan teknis. Tiga: hitung biaya tersembunyi (konflik, latensi 170 ms, biaya marjinal rule ke-341). Empat: sunset bertahap — inventarisasi → shadow 90 hari → konsolidasi → gerbang hipotesis. Lima: jadwal kuartalan 4 jam. Rule adalah inventaris, bukan monumen — yang tak pernah fire dalam setahun adalah kandidat hapus, bukan koleksi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: rule yang tak pernah fire bukan pengaman — ia beban",
        type: "risk",
        body: "Rule yang tidak pernah fire terasa seperti asuransi: 'untung ada'. Padahal ia seperti asuransi yang premi-nya dibayar tiap kuartal (review, testing, latensi) tanpa pernah ada klaim — dan premi 207 polis sekaligus. Tanyakan pada setiap rule: 'apa yang kamu tangkap kuartal ini, dengan precision berapa?' Tidak ada jawaban = tidak ada pekerjaan. Kedua, rule adalah foto pola serangan di satu titik waktu — dan penjahat terus berganti pose (FR5 langkah 5). Museum foto lama bukan pertahanan; ia arsip. Ketiga, disiplinnya ada pada penghapusan, bukan penambahan: siapa pun bisa menambah rule dalam rapat post-mortem yang emosional; butuh tim yang dewasa untuk menghapus 200 rule di Selasa yang tenang — dengan data, tanpa drama. Dan terakhir: tim yang takut menghapus akan berhenti menambah; tim yang rajin menghapus justru paling berani berinovasi. Keberanian menghapus adalah prasyarat keberanian mencoba. Kelima, waspadai 'rule pahlawan': 1 rule yang menangkap 1 kasus besar 2 tahun lalu lalu diabadikan — ia hidup dari nostalgia, bukan dari data. Uji: bila rule itu dihapus hari ini, berapa yang hilang? Bila jawabannya 'tidak tahu', shadow mode 90 hari akan memberitahumu — dan hampir selalu jawabannya 'tidak ada'. Keenam, rayakan penghapusan: umumkan 'kuartal ini kita menghapus 40 rule dan menghemat Rp60 juta' sama meriahnya dengan peluncuran fitur. Budaya yang merayakan penghapusan tidak akan pernah bloated.",
      },
      reference: "Rule adalah inventaris, bukan monumen. 0 fire dalam 180 hari = shadow mode, bukan koleksi.",
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
        "Rule profesional = kondisi + aksi (block/hold/step-up/monitor) + prioritas + expiry + owner.",
        "Velocity (count/amount/distinct-counterparty, relatif terhadap baseline) = sinyal universal serangan.",
        "Hit rate = presisi rule; detection rate = recall rule. Keduanya bertentangan — pilih via kapasitas.",
        "Tuning = pilih ambang dengan detection maksimal pada budget alert ≤ kapasitas tim.",
        "Champion-challenger: challenger wajib shadow mode; promosi hanya jika detection ≥, hit rate aman, volume muat.",
      ],
      next: { label: "FR6 — Feature Engineering", href: "/v2/learn/fr6-feature-engineering" },
      quiz: [
        {
          q: "Mengapa setiap rule WAJIB punya expiry/review date?",
          options: [
            { text: "Agar terlihat profesional", why: "Bukan soal penampilan — soal adaptasi musuh." },
            { text: "Karena penipu beradaptasi — rule yang tidak direview akan menahan nasabah normal sambil meloloskan pola baru", why: "Rule adalah foto pola serangan di satu titik waktu; penipu bergerak, foto menjadi basi. Tanpa expiry, rule keramat menumpuk.", correct: true },
            { text: "Karena database butuh dibersihkan", why: "Expiry rule tidak ada hubungannya dengan kebersihan database." },
            { text: "Tidak wajib", why: "Wajib — rule tanpa tanggal kedaluwarsa = utang yang tidak tercatat." },
          ],
        },
        {
          q: "Rule menahan 200 transaksi, 68 di antaranya benar fraud. Hit rate dan artinya?",
          options: [
            { text: "17% — buruk, hapus rule-nya", why: "Salah hitung: 68/200 = 34%, bukan 17%." },
            { text: "34% — dari tiap 100 yang ditahan, 34 benar fraud; bandingkan 'harga' kapasitasnya sebelum menilai", why: "68/200 = 34%. Tiap 100 review menghasilkan 34 temuan — bandingkan dengan 'harga' 100 slot kapasitas. Di bawah ~10% baru jadi kandidat kombinasi.", correct: true },
            { text: "68% — sangat bagus", why: "68 adalah jumlah TP, bukan persentasenya." },
            { text: "Tidak bisa dihitung", why: "Bisa: hit rate = TP / total ditahan." },
          ],
        },
        {
          q: "Pedagang pasar terima 50 QRIS/jam (normal), akun pribadi transfer 50x/jam (mule). Kesimpulannya?",
          options: [
            { text: "Blokir keduanya — 50/jam selalu mencurigakan", why: "Memblokir pedagang normal = membunuh bisnis sendiri." },
            { text: "Velocity harus relatif terhadap baseline per user/segmen, bukan ambang absolut", why: "50/jam normal untuk merchant, gila untuk akun pribadi. Rule yang benar: v > k x baseline_user.", correct: true },
            { text: "Naikkan ambang jadi 100/jam", why: "Menggeser angka absolut tidak menyelesaikan masalah konteksnya." },
            { text: "Velocity tidak berguna", why: "Velocity justru sinyal universal serangan — yang salah adalah ambang absolutnya." },
          ],
        },
        {
          q: "Kapan challenger boleh promosi menggantikan champion?",
          options: [
            { text: "Begitu akurasinya lebih tinggi di data historis", why: "'Bagus di historis' saja tidak cukup — distribusi produksi bisa berbeda." },
            { text: "Setelah shadow mode: detection ≥ champion, hit rate tidak anjlok, volume ≤ kapasitas", why: "Tiga kriteria. 'Bagus di historis' saja tidak cukup — volume alert adalah nyawa investigator.", correct: true },
            { text: "Atas perintah atasan", why: "Keputusan promosi berbasis data, bukan hierarki." },
            { text: "Tidak pernah — champion abadi", why: "Champion yang tidak pernah diganti = fosil. Musuh beradaptasi, pertahanan harus ikut." },
          ],
        },
        {
          q: "Kapan rule LEBIH tepat daripada ML?",
          options: [
            { text: "Tidak pernah — ML selalu menang", why: "Rule 3 baris BayarKu mengalahkan model Rp500 juta — buktinya ada." },
            { text: "Pola serangan jelas & stabil, butuh deploy cepat, butuh penjelasan ke auditor, atau nol label", why: "Rule unggul saat pola known (cepat, murah, explainable) dan saat ML tidak bisa jalan (nol label). Arsitektur dewasa = keduanya berlapis.", correct: true },
            { text: "Hanya untuk perusahaan kecil", why: "Perusahaan besar pun memakai rule layer — ini soal arsitektur, bukan ukuran." },
            { text: "Hanya untuk data kecil", why: "Rule dipakai di volume raksasa sebagai firewall cepat pola known." },
          ],
        },
      ],
    },
  ],
};
