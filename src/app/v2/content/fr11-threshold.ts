import type { V2Lesson } from "../lib/types";

export const fr11: V2Lesson = {
  slug: "fr11-threshold",
  track: "Fraud & AML Analytics",
  module: "Operasi Model",
  title: "FR11 — Threshold & Antrian",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Threshold 0,5 yang salah semua orang",
      prose: [
        "Threshold default di semua tutorial ML: 0,5. Skor > 0,5 = fraud, < 0,5 = aman. Untuk BankMega, threshold 0,5 berarti 2.125 alert per hari untuk tim yang kapasitasnya 800. Hari pertama: investigator lembur sampai malam. Hari ketiga: mereka berhenti membuka antrian. Hari ketujuh: model dimatikan.",
        "Model yang sama, threshold 0,022 (bukan 0,5!), menghasilkan 800 alert per hari — pas dengan kapasitas tim. Threshold optimalnya: 0,022. Ya, nol koma nol dua dua. Angka \"aneh\" ini bukan bug — ia adalah jawaban dari pertanyaan: \"pada skor berapa 800 review/hari memberikan expected value maksimal?\"",
        "Kebanyakan tim memperlakukan threshold sebagai hyperparameter teknis. Yang benar: threshold adalah keputusan bisnis yang dihitung dari kapasitas tim, biaya review, dan biaya fraud yang lolos. Ia harus dihitung, bukan ditebak.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Threshold 0,5 = netral/obyektif.\" 0,5 hanya netral jika biaya FP = biaya FN — di fraud tidak pernah: biaya satu fraud lolos (jutaan rupiah) vs satu review sia-sia (puluhan ribu). 0,5 bukan netral; ia adalah tebakan yang hampir selalu salah.",
      },
      reference: "Threshold optimal bukan 0,5. Ia dihitung dari kapasitas, bukan ditebak dari default library.",
    },
    {
      id: "harga",
      eyebrow: "Langkah 2 · Harga keputusan",
      title: "Tiap ambang punya harga",
      prose: [
        "Setiap τ punya harga: alert rate (% transaksi masuk antrian) vs recall (% fraud tertangkap) vs precision (% alert yang benar). Simulasi 10.000 transaksi: τ=0,01 → 7.412 alert (74,1%), recall 96,2%, precision 8,5%. τ=0,05 → 2.129 alert (21,3%), recall 51,2%, precision 15,8%. τ=0,20 → 10 alert (0,1%), recall 0,9%, precision 60,0%.",
        "τ rendah = jaring lebar: hampir semua fraud tertangkap, tapi tim tenggelam dalam FP. τ tinggi = sniper: tiap alert berharga, tapi kebanyakan fraud lolos. Tidak ada τ yang \"benar\" secara absolut — yang benar adalah τ yang sesuai dengan kapasitas dan harga bisnismu.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `metrik(tau)` → (n_alert, alert_rate, recall, precision)" },
        { id: "t2", text: "Bangun tabel untuk τ = 0.01, 0.03, 0.05, 0.10, 0.20" },
        { id: "t3", text: "Cetak tabel dengan `print`" },
      ],
      expected: "Tabel 5 baris: τ=0.01 → 7412 alert/96.2% recall; τ=0.20 → 10 alert/0.9% recall",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Threshold yang bagus = yang memaksimalkan F1.\" F1 mengasumsikan FP dan FN sama pentingnya. Di fraud, FN (fraud lolos, jutaan rupiah) vs FP (review sia-sia, puluhan ribu) = tidak sebanding. F1-optimal ≠ bisnis-optimal. Maksimalkan expected value, bukan F1.",
      },
      hints: [
        "alert = [(s, y) for s, y in zip(scores, labels) if s > tau].",
        "recall = tp / total_fraud; precision = tp / len(alert).",
        "Loop tau dalam [0.01, 0.03, 0.05, 0.10, 0.20], print tiap baris.",
      ],
      code: {
        starter: `# Tiap threshold punya harga: alert rate vs recall vs precision.\nimport random\nrandom.seed(30)\nn = 10000\nscores = [random.betavariate(1, 30) for _ in range(n)]\nlabels = [1 if random.random() < s * 2 else 0 for s in scores]\n\n# TULIS KODEMU\ndef metrik(tau):\n    alert = \n    tp = sum(y for _, y in alert)\n    return \n\nprint(f"{'tau':>6} | {'alert':>6} | {'recall':>7} | {'precision':>9}")\nfor tau in [0.01, 0.03, 0.05, 0.10, 0.20]:\n    a, ar, rc, pr = metrik(tau)\n    print(f"{tau:6.2f} | {a:6d} | {rc:6.1%} | {pr:8.1%}")`,
        lockLines: 5,
        solution: `# Tiap threshold punya harga: alert rate vs recall vs precision.\nimport random\nrandom.seed(30)\nn = 10000\nscores = [random.betavariate(1, 30) for _ in range(n)]\nlabels = [1 if random.random() < s * 2 else 0 for s in scores]\n\n# TULIS KODEMU\ndef metrik(tau):\n    alert = [(s, y) for s, y in zip(scores, labels) if s > tau]\n    tp = sum(y for _, y in alert)\n    fn = sum(labels) - tp\n    return (len(alert), len(alert)/n,\n            tp/(tp+fn) if tp+fn else 0,\n            tp/len(alert) if alert else 0)\n\nprint(f"{'tau':>6} | {'alert':>6} | {'recall':>7} | {'precision':>9}")\nfor tau in [0.01, 0.03, 0.05, 0.10, 0.20]:\n    a, ar, rc, pr = metrik(tau)\n    print(f"{tau:6.2f} | {a:6d} | {rc:6.1%} | {pr:8.1%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "metrik", label: "`metrik` terdefinisi", msg: "Buat fungsi metrik(tau)." },
          { kind: "stdout_matches", task: "t3", pattern: "0\\.01 \\|\\s+7412", label: "τ=0.01 → 7412 alert", msg: "τ rendah = jaring lebar: 7.412 alert (74,1% dari semua transaksi)." },
          { kind: "stdout_matches", task: "t3", pattern: "0\\.20 \\|\\s+10", label: "τ=0.20 → 10 alert", msg: "τ tinggi = sniper: hanya 10 alert, tapi recall 0,9%." },
        ],
      },
      reference: "τ rendah = jaring lebar. τ tinggi = sniper. Harga tiap τ = alert rate x biaya review.",
    },
    {
      id: "kapasitas",
      eyebrow: "Langkah 3 · Dari kapasitas",
      title: "Threshold dihitung mundur dari tim",
      prose: [
        "Kasus BankMega: 2.125 alert per hari, kapasitas 10 investigator x 80 = 800 slot. Caranya: urutkan semua skor hari itu menurun, ambil 800 teratas — skor ke-800 itulah τ operasional hari itu (dalam contoh: 0,05). Prinsip: τ bukan angka tetap — ia bergerak mengikuti volume dan kapasitas harian.",
        "Rumus keputusan: setiap alert ke-k direview jika expected value-nya positif — P(fraud|skor) x loss > biaya review. Jika P(fraud|0,022) x Rp1,1jt > Rp25rb → review. Threshold = titik impas persamaan ini. Dan jangan lupakan: biaya review bukan cuma gaji — ada fatigue (reviewer ke-800 lebih ceroboh dari reviewer ke-80) dan opportunity cost.",
      ],
      formula: String.raw`P(\text{fraud} \mid \text{skor}) \times \text{loss} > \text{biaya review} \Rightarrow \text{review}`,
      formulaNote: "Review alert jika kerugian yang dihindari melebihi biaya review.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Threshold statis + volume musiman = bencana. Saat Harbolnas volume naik 10x, τ tetap = alert naik 10x = tim tenggelam = fraud lolos. Threshold harus adaptif terhadap volume (target alert rate, bukan angka tetap) atau punya mode khusus untuk event besar.",
      },
      reference: "τ = titik impas: P(fraud|skor) x loss = biaya review. Hitung mundur dari kapasitas.",
    },
    {
      id: "triage",
      eyebrow: "Langkah 4 · Triage",
      title: "Review yang paling berharga dulu",
      prose: [
        "Tidak semua alert sama: bucket 0,9+ → precision 84,9% (146 kasus); bucket 0,7–0,9 → 61,2%; 0,5–0,7 → 36,7%; 0,3–0,5 → 9,0%; <0,3 → 2,6% (879 kasus). Aturan review: dari skor tertinggi ke bawah. Jika kapasitas habis di tengah jalan, yang tidak tereview adalah yang paling tidak berharga.",
        "Struktur 3 zona: auto-block skor ≥ 0,70 (precision 82% — cukup tinggi untuk tindakan otomatis), review manusia 0,05–0,70 (zona abu-abu), auto-approve + sampling 0,1% di bawah 0,05 (menghemat kapasitas; sampling mencegah blind spot total). Sampling di zona auto-approve penting: tanpa itu, kamu tidak pernah tahu apa yang lolos.",
      ],
      tasks: [
        { id: "t1", text: "Kelompokkan skor ke 5 bucket, hitung precision tiap bucket" },
        { id: "t2", text: "Cetak bucket + jumlah + precision" },
      ],
      expected: "0.9+: 84.9% | 0.7-0.9: 61.2% | 0.5-0.7: 36.7% | 0.3-0.5: 9.0% | <0.3: 2.6%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Antrian diurut FIFO — siapa cepat dia dilayani.\" FIFO di antrian fraud = membuang kapasitas pada alert murah sambil alert mahal menunggu. Investigator yang kelelahan di kasus Rp200rb, lalu melewatkan kasus Rp200jt karena 'sudah malam'. Urutan antrian = keputusan ekonomi.",
      },
      hints: [
        "buckets = [(0.9, 1.01, '0.9+'), (0.7, 0.9, '0.7-0.9'), ...].",
        "b = [(s,y) untuk s,y jika lo <= s < hi]; precision = sum(y)/len(b).",
        "print(f'bucket {nama}: {len(b)} kasus, precision={prec:.1%}').",
      ],
      code: {
        starter: `# Bucketisasi: buktikan 'review dari skor tertinggi dulu'.\nimport random\nrandom.seed(31)\nscores = [random.random()**1.5 for _ in range(2000)]\nlabels = [1 if random.random() < s**2 * 0.9 else 0 for s in scores]\n\n# TULIS KODEMU\nbuckets = [(0.9, 1.01, "0.9+"), (0.7, 0.9, "0.7-0.9"), (0.5, 0.7, "0.5-0.7"),\n           (0.3, 0.5, "0.3-0.5"), (0.0, 0.3, "<0.3")]\nfor lo, hi, nama in buckets:\n    b =\n    prec =\n    print(f"bucket {nama}: {len(b)} kasus, precision={prec:.1%}")`,
        lockLines: 4,
        solution: `# Bucketisasi: buktikan 'review dari skor tertinggi dulu'.\nimport random\nrandom.seed(31)\nscores = [random.random()**1.5 for _ in range(2000)]\nlabels = [1 if random.random() < s**2 * 0.9 else 0 for s in scores]\n\n# TULIS KODEMU\nbuckets = [(0.9, 1.01, "0.9+"), (0.7, 0.9, "0.7-0.9"), (0.5, 0.7, "0.5-0.7"),\n           (0.3, 0.5, "0.3-0.5"), (0.0, 0.3, "<0.3")]\nfor lo, hi, nama in buckets:\n    b = [(s, y) for s, y in zip(scores, labels) if lo <= s < hi]\n    prec = sum(y for _, y in b)/len(b) if b else 0\n    print(f"bucket {nama}: {len(b)} kasus, precision={prec:.1%}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "bucket 0\\.9\\+: 146 kasus, precision=84\\.9%", label: "Bucket 0.9+: precision 84.9%", msg: "Bucket teratas 84,9% — zona auto-block." },
          { kind: "stdout_matches", task: "t2", pattern: "bucket <0\\.3: 879 kasus, precision=2\\.6%", label: "Bucket <0.3: precision 2.6%", msg: "Bucket terbawah 2,6% — zona auto-approve + sampling." },
        ],
      },
      reference: "FIFO = keputusan ekonomi yang buruk. Urutan antrian = prioritas nilai.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan auto, kapan manusia",
      prose: [
        "Satu: auto-block (tanpa manusia) → skor ≥ 0,70 dengan precision terukur ≥ 80%, nominal di bawah batas auto, bukan segmen sensitif. Dua: review manusia prioritas → 0,05–0,70, diurut skor menurun, SLA per tier (0,5+ = 1 jam, 0,2–0,5 = 4 jam). Tiga: auto-approve + sampling → < 0,05 dengan sampling 0,1% acak. Empat: τ adaptif → target alert rate dari kapasitas, bukan angka tetap; mode khusus Harbolnas/Ramadan.",
        "Syarat auto-block yang sering dilupakan: mekanisme banding yang cepat (nasabah salah blokir harus bisa komplain dan dibebaskan dalam hitungan jam, bukan hari) dan daftar pengecualian segmen sensitif (payroll karyawan, nasabah prioritas). Auto-block tanpa banding = bom reputasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Auto-block adalah keputusan untuk 'menuduh' nasabah melakukan fraud oleh mesin. Salah blokir = nasabah marah, viral, regulator bertanya. Bar untuk auto-block bukan cuma precision tinggi — tapi juga: banding cepat, pengecualian segmen sensitif, dan logging lengkap untuk audit.",
      },
      reference: "Tiga zona: auto-block (≥0,70) → review manusia (0,05–0,70) → auto-approve+sampling (<0,05).",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Tim 5 orang, volume naik 3x",
      prose: [
        "BankMega: 5 investigator (kapasitas 400/hari), volume naik 3x saat Harbolnas (alert naik dari 800 ke 2.400/hari). τ tetap = tim tenggelam. Rancang strategi 3 hari Harbolnas: bagaimana τ, zona, dan SLA berubah — dan apa yang dikorbankan?",
        "Pembahasan: hari H-7: tetapkan mode Harbolnas — target alert rate tetap 400/hari (τ naik mengikuti volume), auto-block diperluas ke ≥0,60 (precision terukur masih ≥75%), zona review dipersempit ke 0,10–0,60, SLA dilonggarkan (tier bawah jadi 24 jam), sampling auto-approve dinaikkan ke 0,5% (blind spot lebih berisiko saat volume tinggi). Yang dikorbankan: recall turun sementara (lebih banyak fraud kecil lolos) — keputusan sadar: melindungi tim dari kolaps lebih penting daripada menangkap semua fraud Rp200rb.",
      ],
      tasks: [],
      reference: "Saat volume meledak, yang dikorbankan = recall sementara. Lindungi tim dari kolaps.",
    },
    {
      id: "ambang-dinamis",
      eyebrow: "Langkah 7 · Ambang dinamis vs statis",
      title: "Rp500 ribu yang diam, Rp490 ribu × 9 yang lolos",
      prose: [
        "Ambang statis Rp500 ribu. Penipu mentransfer Rp490 ribu — sembilan kali. Total Rp4,41 juta lolos, 100%, selamanya. Tidak ada yang rusak, tidak ada yang error — sistem bekerja persis seperti dirancang, dan itulah masalahnya. Ambang statis adalah kurikulum bagi penipu: ia memberi tahu persis di mana batasnya, dan penipu hanya perlu menari 2% di bawahnya. Structuring (FR15) bukan kegagalan ambang — ia adalah murid terbaik ambang. Setiap threshold tetap yang kamu publikasikan (dan semua threshold pada akhirnya diketahui) adalah jadwal latihan yang kamu berikan gratis kepada musuh.",
        "Ambang adaptif membalik logikanya: threshold mengikuti perilaku, bukan angka mati. Contoh dua nasabah. Nasabah A — karyawan gaji Rp8 juta/bulan: persentil 99,5 transaksinya = Rp1,2 juta → ambang dinamisnya Rp1,2 juta. Tiba-tiba 9× Rp490 ribu dalam 1 jam: di bawah ambang statis, TAPI 3x lipat transaksi normalnya + frekuensi anomali → alert. Nasabah B — pedagang: p99,5 = Rp15 juta → 9× Rp490 ribu = hari biasa → tidak alert. Ambang yang sama untuk keduanya = salah untuk keduanya: A kebobolan structuring, B kebanjiran false positive. Pertanyaan yang benar bukan 'berapa ambangnya?' melainkan 'ambang SIAPA?'",
        "Matematikanya sederhana. Ambang adaptif per nasabah: τ_u = Q_99,5(riwayat_u, 90 hari) + margin. Atau per segmen bila riwayat tipis: τ_segmen = Q_99,5(segmen). Trade-off false positive-nya eksplisit dan bisa dihitung: persentil 99,5 → ekspektasi 0,5% transaksi normal ter-flag. Dari 200.000 transaksi/hari = 1.000 alert/hari. Bandingkan dengan kapasitas (FR11 langkah 3)! Bila kapasitas 1.500/hari: muat, dengan buffer. Bila kapasitas 600/hari: tidak muat — maka persentilnya dipilih MUNDUR dari kapasitas: butuh ≤ 600 alert → pakai p99,7. Sama seperti threshold skor: ambang adaptif dihitung mundur dari tim, bukan dari keindahan statistik. Persentil adalah alat; kapasitas adalah tuannya.",
        "Arsitektur yang benar: hibrida, bukan penggantian. Ambang statis (misal Rp500 ribu untuk kewajiban pelaporan) TETAP ADA — itu kewajiban hukum, bukan pilihan desain. Ambang adaptif DITAMBAHKAN sebagai lapisan kedua: rule 'di bawah ambang statis TAPI di atas p99,5 perilaku + frekuensi anomali' → inilah yang menangkap Rp490 ribu × 9. Statis untuk compliance, adaptif untuk deteksi. Jangan pernah mengganti ambang regulasi dengan ambang perilaku — auditor tidak peduli p99,5-mu; ia peduli angkanya. Lapisi, jangan ganti. Dua ambang, dua tujuan, nol konflik.",
        "Empat bahaya ambang adaptif — karena tidak ada makan siang gratis. Satu: riwayat tipis — nasabah baru 2 minggu tidak punya p99,5 yang bermakna; fallback ke ambang segmen (karyawan baru → segmen karyawan), bukan ke default global. Dua: perilaku legit yang bervariasi — pedagang musiman, pekerja proyek; solusinya segmen + fitur kalender (FR16), bukan persentil yang lebih longgar. Tiga: poisoning perlahan — penipu 'memanaskan' rekening dengan transaksi yang naik bertahap selama 3 bulan, menggeser p99,5 ke atas, lalu menyerang di bawah ambang barunya; solusinya jendela riwayat tetap (90 hari, bukan all-time) + deteksi drift (bila p99,5 naik > 30% dalam sebulan tanpa penjelasan, flag). Empat: komputasi — persentil per nasabah per hari untuk 10 juta nasabah; solusinya hitung batch harian (bukan real-time) dan cache — perilaku tidak berubah per menit.",
        "Contoh implementasi 30 hari. Minggu 1–2: hitung p99,5 per nasabah dari 90 hari riwayat (batch, semalam untuk 10 juta nasabah di klaster modern — bisa). Analisis distribusi: berapa % nasabah yang p99,5-nya di bawah Rp500 ribu? (Biasanya 60–70% — mayoritas orang jarang transaksi besar.) Minggu 3: shadow mode — jalankan rule adaptif tanpa aksi, ukur alert/hari dan precision via sampling. Target: alert ≤ 80% kapasitas, precision ≥ 25%. Minggu 4: go-live bertahap — 10% trafik → 50% → 100%, dengan kill switch. Yang diukur bukan hanya fraud tertangkap, tapi juga false positive per segmen — bila pedagang protes massal, segmennya yang dikalibrasi ulang, bukan seluruh sistem yang dimatikan.",
        "Angka dampaknya. Bank dengan 200.000 trx/hari, ambang statis Rp500 ribu: structuring Rp490 ribu × 9 lolos 100% — estimasi kebocoran Rp180 juta/bulan dari pola ini saja (dari sampling investigasi). Setelah lapisan adaptif: 73% pola tertangkap (p99,5 + frekuensi), kebocoran turun ke Rp49 juta/bulan. False positive tambahan: 1.000 alert/hari × precision 30% = 700 FP × Rp25 ribu = Rp17,5 juta/bulan biaya review. Net: hemat Rp113,5 juta/bulan. Dan yang tak terhitung: penipu yang tahu ambangnya 'bergerak' mulai menghindari bank ini — deterrence (FR9). Ambang yang hidup tidak hanya menangkap; ia mengusir.",

        "Duel angka: penyerang beradaptasi — lalu apa? Penipu tahu ambangmu adaptif (ia menguji dengan transfer kecil). Ia mencoba 'pemanasan': 3 bulan transaksi naik bertahap Rp100 ribu → Rp300 ribu → Rp500 ribu, menggeser p99,5 nasabah A dari Rp1,2 juta ke Rp2 juta. Lalu menyerang Rp1,9 juta × 5 = Rp9,5 juta — di bawah ambang baru. Pertahanan berlapis: (1) jendela riwayat tetap 90 hari — pemanasan 3 bulan baru menggeser sepertiga bobot; (2) deteksi drift — p99,5 naik > 30%/bulan tanpa penjelasan (gaji naik? promosi?) → flag 'pemanasan mungkin'; (3) frekuensi TETAP dipantau — 5× Rp1,9 juta dalam 1 jam anomali berapa pun ambangnya. Ambang adaptif bukan benteng; ia parit pertama. Parit kedua selalu frekuensi + drift.",
        "Ambang adaptif juga berlaku untuk SKOR model — bukan hanya nominal. FR11 langkah 5 (peta) menyebut 'τ adaptif: target alert rate dari kapasitas'. Itulah ambang adaptif versi skor: bukan τ = 0,7 tetap, melainkan τ_harian = skor persentil ke-(1 − kapasitas/volume). Volume naik 2x saat gajian? τ naik otomatis agar alert tetap 1.500/hari — investigator tidak tenggelam. Prinsipnya sama dengan nominal: threshold mengikuti dunia, bukan dunia mengikuti threshold. Implementasi: hitung distribusi skor 7 hari terakhir tiap pagi, set τ hari ini. Satu baris cron, menghemat 1 rapat darurat per bulan.",
        "Kejujuran: kapan ambang statis LEBIH baik. Satu: lingkungan data minim — bank kecil tanpa riwayat 90 hari yang bersih; persentil dari data sampah = ambang sampah. Dua: kebutuhan audit ekstrem — regulator di beberapa yurisdiksi menuntut aturan yang bisa dijelaskan dalam 1 kalimat ('di atas Rp500 ribu lapor'); 'di atas persentil 99,5 dinamis' membuatnya mengernyit. Tiga: serangan yang tidak adaptif — first-party fraud oportunistik tidak mempelajari ambangmu; ambang statis yang murah sudah cukup. Aturannya: mulai dari statis (murah, bisa diaudit), tambahkan adaptif saat (a) ada bukti structuring, (b) data cukup, (c) kapasitas tertekan. Kecanggihan adalah obat — diresepkan untuk penyakit yang tepat, bukan vitamin harian.",
        "Ringkasnya, ambang dinamis vs statis. Satu: ambang statis = kurikulum penipu — Rp490 ribu × 9 lolos selamanya. Dua: ambang adaptif = persentil perilaku (τ_u = Q_99,5 riwayat 90 hari) — pertanyaannya 'ambang siapa?', bukan 'berapa?'. Tiga: persentil dipilih mundur dari kapasitas (butuh ≤ X alert → persentil Y). Empat: hibrida — statis untuk compliance, adaptif untuk deteksi; lapisi, jangan ganti. Lima: waspadai 4 bahaya (riwayat tipis, variasi legit, poisoning, komputasi). Ambang yang diam mengajari penipu menari — buat ia menari di lantai yang bergerak.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ambang yang diam mengajari penipu menari di bawahnya",
        type: "risk",
        body: "Setiap threshold tetap adalah kunci jawaban yang dipublikasikan — penipu tidak mendobrak aturan, mereka mengoptimasi DI BAWAH aturan. Bila ambangmu tidak pernah bergerak, kamu tidak sedang memasang jebakan; kamu sedang memasang jadwal. Kedua, pertanyaan yang benar bukan 'berapa ambangnya?' melainkan 'ambang siapa?' — transfer Rp490 ribu adalah noise bagi pedagang dan teriakan bagi mahasiswa; threshold yang buta terhadap siapa adalah threshold yang salah untuk keduanya. Ketiga, ambang adaptif pun membusuk: perilaku bergeser, penyerang memanaskan rekening, segmen berubah — hitung ulang terjadwal atau threshold pintarmu menjadi threshold bodoh yang mahal. Dan terakhir: jangan pernah mengganti ambang hukum dengan ambang perilaku — yang satu untuk auditor, yang satu untuk penipu; keduanya harus ada, keduanya punya tuan yang berbeda. Kelima, ingat bahwa adaptif pun bisa diakali — penipu yang sabar memanaskan rekening selama 3 bulan untuk menggeser persentilmu. Maka ambang adaptif selalu dipasangkan dengan pemantau drift: persentil yang naik lebih dari 30% dalam sebulan tanpa penjelasan bisnis adalah serangan, bukan pertumbuhan. Keenam, jangan lupakan manusia di ujung ambang: setiap kali kamu menaikkan ambang adaptif, kamu memindahkan beban ke investigator atau ke nasabah — umumkan perubahannya, jelaskan alasannya, ukur dampaknya 2 minggu. Ambang yang berubah diam-diam mengkhianati kepercayaan tim yang memakainya.",
      },
      reference: "Ambang statis = kewajiban hukum. Ambang adaptif = senjata deteksi. Penipu menari di bawah yang statis — tangkap dengan yang adaptif.",
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
        "Threshold 0,5 bukan netral — dihitung dari kapasitas, biaya review, dan loss.",
        "Tiap τ punya harga: alert rate vs recall vs precision. Tidak ada τ benar absolut.",
        "τ = titik impas P(fraud|skor) x loss = biaya review; adaptif terhadap volume.",
        "Triage: review dari skor tertinggi; 3 zona (auto-block/review/auto-approve+sampling).",
        "Auto-block butuh banding cepat + pengecualian segmen sensitif.",
      ],
      next: { label: "FR12 — Graph Analytics", href: "/learn/fr12-graph-analytics" },
      quiz: [
        {
          q: "Mengapa threshold default 0,5 berbahaya untuk fraud?",
          options: [
            { text: "Karena 0,5 angka ganjil", why: "Bukan soal ganjil/genap." },
            { text: "0,5 hanya 'netral' jika biaya FP = biaya FN — di fraud tidak pernah: FN jutaan rupiah vs FP puluhan ribu", why: "Threshold = keputusan ekonomi, bukan default library.", correct: true },
            { text: "Karena 0,5 terlalu tinggi", why: "Kadang terlalu tinggi, kadang terlalu rendah — intinya ia tebakan, bukan perhitungan." },
            { text: "Tidak berbahaya", why: "Kasus BankMega: 0,5 → 2.125 alert vs kapasitas 800 → tim mogok." },
          ],
        },
        {
          q: "Tim kapasitas 800/hari, volume 100.000/hari. Bagaimana menetapkan τ?",
          options: [
            { text: "τ = 0,5", why: "Default yang tidak dihitung dari kapasitas." },
            { text: "Urutkan skor menurun, ambil 800 teratas — skor ke-800 = τ operasional hari itu (target alert rate 0,8%)", why: "Threshold dihitung mundur dari kapasitas, adaptif harian.", correct: true },
            { text: "τ = 0,022 selamanya", why: "0,022 adalah contoh satu hari — τ harus bergerak mengikuti volume." },
            { text: "Tanpa threshold", why: "Tanpa threshold = tanpa keputusan = chaos." },
          ],
        },
        {
          q: "Bucket 0,9+ precision 84,9% vs bucket <0,3 precision 2,6%. Implikasi untuk antrian?",
          options: [
            { text: "FIFO — siapa cepat dia dilayani", why: "FIFO membuang kapasitas pada alert murah." },
            { text: "Review dari skor tertinggi ke bawah; kapasitas habis = yang tak tereview adalah yang paling tak berharga", why: "Urutan antrian = keputusan ekonomi.", correct: true },
            { text: "Acak", why: "Acak = mengabaikan informasi nilai yang jelas." },
            { text: "Dari skor terendah", why: "Terbalik: membakar kapasitas pada precision 2,6%." },
          ],
        },
        {
          q: "Syarat auto-block skor ≥ 0,70 yang sering dilupakan?",
          options: [
            { text: "Precision tinggi saja cukup", why: "Tidak cukup — lihat opsi benar." },
            { text: "Mekanisme banding cepat + pengecualian segmen sensitif + logging audit — auto-block tanpa banding = bom reputasi", why: "Menuduh nasabah via mesin butuh jalan keluar yang cepat.", correct: true },
            { text: "Izin direksi", why: "Izin penting tapi bukan syarat operasional yang dilupakan." },
            { text: "Tidak ada syarat", why: "Ada: banding, pengecualian, logging." },
          ],
        },
        {
          q: "Volume naik 10x saat Harbolnas, τ tetap. Apa yang terjadi?",
          options: [
            { text: "Tidak ada masalah", why: "Alert naik 10x = tim tenggelam." },
            { text: "Alert naik 10x → tim kolaps → fraud lolos. Solusi: τ adaptif (target alert rate) atau mode khusus event", why: "Threshold statis + volume musiman = bencana.", correct: true },
            { text: "Recall naik", why: "Recall mungkin naik sedikit tapi tim tidak sanggup mereview — recall aktual anjlok." },
            { text: "Precision naik", why: "Precision tidak otomatis naik dengan volume." },
          ],
        },
      ],
    },
  ],
};
