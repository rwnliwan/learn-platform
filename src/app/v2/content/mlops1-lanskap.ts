import type { V2Lesson } from "../lib/types";

// Ilustrasi pola: AUC turun dari 0,91 ke ~0,72 selama 90 hari tanpa retrain.
// Garis putus-putus = ambang 0,80; titik = hari ke-52 (pertama kali tembus ambang).
const DECAY_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Grafik penurunan AUC dari 0,91 ke 0,72 selama 90 hari, menembus ambang 0,80 pada hari ke-52.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="180" x2="460" y2="180"/><line x1="40" y1="140" x2="460" y2="140"/><line x1="40" y1="100" x2="460" y2="100"/><line x1="40" y1="60" x2="460" y2="60"/><line x1="40" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="34" y="184">0,65</text><text x="34" y="144">0,72</text><text x="34" y="104">0,80</text><text x="34" y="64">0,87</text><text x="34" y="24">0,95</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="40" y="198">0</text><text x="150" y="198">30</text><text x="260" y="198">60</text><text x="370" y="198">90 hari</text></g>
<line x1="40" y1="100" x2="460" y2="100" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="452" y="94" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">ambang 0,80</text>
<polyline points="40,41 90,52 140,63 190,76 240,88 282,100 330,116 380,130 430,141 460,145" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="282" cy="100" r="5" fill="var(--c4)"/>
<text x="282" y="84" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">hari ke-52</text>
<text x="452" y="162" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">AUC hari ke-90: 0,715</text>
</svg>`;

const MLOPS1_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Waktu buta per lapisan monitoring: data setengah hari, prediksi 14 hari, keputusan 30 hari, bisnis 120 hari."><text x="142" y="55.25" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Lapisan data</text><rect x="150" y="42.25" width="1.2" height="18" rx="3" fill="var(--c1)"/><text x="157.2" y="55.25" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">≈0 hari</text><text x="142" y="97.75" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Lapisan prediksi</text><rect x="150" y="84.75" width="33.8" height="18" rx="3" fill="var(--c2)"/><text x="189.8" y="97.75" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">14 hari</text><text x="142" y="140.25" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Lapisan keputusan</text><rect x="150" y="127.25" width="72.5" height="18" rx="3" fill="var(--c3)"/><text x="228.5" y="140.25" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">30 hari</text><text x="142" y="182.75" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Lapisan bisnis</text><rect x="150" y="169.75" width="289.8" height="18" rx="3" fill="var(--c4)"/><text x="445.8" y="182.75" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">120 hari</text></svg>`;

export const mlops1: V2Lesson = {
  slug: "mlops1-lanskap",
  track: "MLOps",
  module: "Fondasi Operasi",
  title: "MLOps1 — Kenapa ML Butuh Ops",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang mati tanpa suara",
      prose: [
        "Maret 2026. Fintech KreditKu merayakan model credit scoring baru: AUC 0,91 di validasi, terbaik sepanjang sejarah tim. Model di-deploy ke produksi, tim data kembali ke riset, semua orang senang.",
        "September 2026. NPL (kredit macet) naik dari 3,1% ke 4,8%. Direksi memanggil tim data: 'Bukankah model kita bagus?' Investigasi dimulai — dan temuannya mengejutkan. Modelnya tidak rusak. Yang rusak: cron job retraining mati diam-diam sejak Mei karena disk penuh, dan tidak ada satu pun alert yang berbunyi. Selama empat bulan, model memakan data basi tanpa ada yang tahu.",
        "Twist-nya: tidak ada satu baris pun kode model yang salah. Kegagalannya 100% operasional — tidak ada monitoring, tidak ada alerting, tidak ada pemilik yang bertanggung jawab atas 'kesehatan' model setelah deploy. Inilah wilayah MLOps: disiplin agar model yang bagus di lab tetap bagus di produksi.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan dengan contoh KreditKu mengapa kegagalan ML di produksi hampir selalu kegagalan operasi, bukan algoritma; (2) menghitung nilai bisnis sebuah model dengan rumus V = A × C × U dan membandingkan dua model secara kuantitatif; (3) memetakan tiap jenis kerusakan ke lapisan monitoring yang menangkapnya paling awal; (4) menentukan level MLOps yang proporsional — tidak kurang, tidak berlebihan — untuk modelmu sendiri.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Tugas data scientist selesai saat model di-deploy'",
        type: "pitfall",
        body: "Deploy hanyalah garis start, bukan garis finis. Model di produksi menghadapi data yang bergeser, skema yang berubah, dan upstream yang tidak memberi tahu. Tanpa operasi, model terbaik pun punya tanggal kedaluwarsa — biasanya lebih cepat dari yang kamu kira.",
      },
      reference: "Kegagalan ML di produksi paling sering adalah kegagalan operasi, bukan kegagalan algoritma.",
    },
    {
      id: "tiga-nyawa",
      eyebrow: "Langkah 2 · Tiga fase hidup model",
      title: "Build, deploy, operate: tiga pekerjaan berbeda",
      prose: [
        "Setiap model melewati tiga fase. Build: eksperimen, training, validasi — dunianya notebook dan metrik. Deploy: model dibungkus jadi layanan — dunianya API, container, dan pipeline. Operate: model dijaga tetap sehat — dunianya monitoring, alert, retraining, dan rollback.",
        "Track Machine Learning Engineer fokus pada dua fase pertama: membangun sistem ML yang benar. Track ini fokus pada fase ketiga: mengoperasikannya. Skill-nya beda: bukan 'bagaimana melatih model terbaik', melainkan 'bagaimana memastikan model terbaik itu tetap hidup, aman, dan bisa dipertanggungjawabkan'.",
        "Peta disiplin MLOps terdiri dari delapan komponen yang saling terkait: pipeline & orchestration (aliran kerja otomatis), feature store (fitur konsisten), model registry (versi & stage), CI/CD (gerbang kualitas), serving (infrastruktur prediksi), monitoring & alerting (radar kesehatan), retraining (penyegaran model), dan testing & governance (validasi serta akuntabilitas). Delapan lesson ke depan membahas masing-masing satu per satu.",
        "💡 Intuisi: pikirkan model seperti restoran. Build = merancang menu. Deploy = membuka restoran. Operate = memastikan dapur tetap bersih, bahan segar, dan pelanggan tidak keracunan — setiap hari, bertahun-tahun. Koki hebat tanpa operasional restoran yang baik akan bangkrut juga.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'MLOps = membeli tools mahal (Kubeflow, SageMaker)'",
        type: "pitfall",
        body: "Tools hanyalah implementasi. MLOps adalah disiplin: siapa memantau apa, apa yang terjadi saat metrik turun, bagaimana rollback dilakukan. Perusahaan dengan cron + spreadsheet yang disiplin sering lebih andal daripada perusahaan dengan platform mahal tanpa runbook. Mulai dari proses, bukan dari belanja.",
      },
      reference: "MLOps = disiplin operasi untuk ML. Tools mengikuti proses, bukan sebaliknya.",
    },
    {
      id: "nilai-dan-decay",
      eyebrow: "Langkah 3 · Model decay",
      title: "Kenapa model membusuk — dan cara mengukurnya",
      prose: [
        "Model 'membusuk' karena dunia berubah: perilaku nasabah bergeser, kompetitor mengubah pasar, regulasi baru muncul, bahkan model itu sendiri mengubah perilaku yang ia prediksi (feedback loop). Di lab, data diam; di produksi, data bergerak.",
        "Nilai bisnis sebuah model bukan cuma akurasinya. Rumus sederhananya:",
      ],
      formula: String.raw`V = A \times C \times U`,
      formulaNote: "V = nilai bisnis; A = akurasi (seberapa benar); C = cakupan (berapa banyak keputusan memakai model); U = uptime (berapa sering model tersedia & sehat).",
      figure: {
        svg: DECAY_SVG,
        alt: "Grafik penurunan AUC dari 0,91 ke 0,72 selama 90 hari, menembus ambang 0,80 pada hari ke-52.",
        caption: "Ilustrasi pembusukan model: AUC 0,91 → 0,715 dalam 90 hari tanpa retrain. Ambang 0,80 tertembus pada hari ke-52. Cara membaca: sumbu X = hari sejak deploy, sumbu Y = AUC; garis putus-putus = ambang minimum 0,80, titik = hari pertama ambang tertembus. Interpretasi: tanpa retrain, model melewati batas aman di hari ke-52 — siapa pun yang baru sadar di hari ke-90 sudah membayar 38 hari kerugian tanpa sadar.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira monitoring model = memantau akurasi. Akurasi butuh label kebenaran yang sering datang berminggu-minggu kemudian (nasabah macet ketahuan 90 hari kemudian!). Yang bisa dipantau HARI INI: distribusi input, distribusi skor, dan metrik bisnis. Menunggu label = buta berbulan-bulan.",
      },
      reference: "V = A × C × U. Akurasi 0,95 dengan uptime 50% kalah dari akurasi 0,85 dengan uptime 99%.",
    },
    {
      id: "lab-decay",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: simulasi pembusukan model KreditKu",
      prose: [
        "Kita replika kasus KreditKu: AUC awal 0,91, turun rata-rata 0,0022 per hari plus noise. Setiap 0,01 penurunan AUC di bawah titik awal menaikkan peluang keputusan buruk — dan tiap keputusan buruk merugikan Rp150 ribu.",
        "Tugasmu: lengkapi loop 90 hari. Catat hari pertama AUC menembus 0,80, dan hitung total kerugian. Angka yang keluar adalah 'biaya tidak punya MLOps'.",
        "Cara membaca: tiga baris output = (1) kondisi akhir model, (2) kapan ia melewati batas aman, (3) harga yang dibayar bisnis. Interpretasi: jika hari_rusak jauh sebelum ada yang sadar, itulah bukti monitoring-mu bolong.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi loop 90 hari: turunkan `auc`, deteksi `hari_rusak`" },
        { id: "t2", text: "Akumulasi `total_rugi` dari peluang keputusan buruk" },
        { id: "t3", text: "Jalankan dan baca tiga baris output" },
      ],
      expected: "AUC hari ke-90 : 0.715 · hari ke-52 · Rp26.3 miliar",
      note: {
        title: "💡 Intuisi: model tidak membusuk seperti buah",
        body: "Buah membusuk dengan sendirinya. Model 'membusuk' karena dunianya berubah sementara ia diam. Analogi yang lebih tepat: peta. Peta 2016 tetap akurat secara internal — tapi jalan tol baru tidak ada di sana. Retraining = menggambar ulang peta mengikuti dunia.",
      },
      hints: [
        "Di tiap iterasi: auc = max(0.50, auc - random.gauss(0.0022, 0.0009)).",
        "hari_rusak diisi sekali saja: if hari_rusak is None and auc < 0.80.",
        "p_salah = max(0.0, 2.0 * (AUC_AWAL - auc)); total_rugi += VOLUME_HARIAN * p_salah * BIAYA_PER_SALAH.",
      ],
      code: {
        starter: `import random\nrandom.seed(7)\n\nAUC_AWAL = 0.91\nVOLUME_HARIAN = 10_000          # skor kredit per hari\nBIAYA_PER_SALAH = 150_000       # rupiah per keputusan buruk\n\nauc = AUC_AWAL\nhari_rusak = None               # hari pertama AUC < 0.80\ntotal_rugi = 0.0\n\n# TULIS KODEMU: simulasi 90 hari pembusukan\nfor hari in range(1, 91):\n    \n\nprint(f"AUC hari ke-90 : {auc:.3f}")\nprint(f"Hari pertama AUC < 0.80 : hari ke-{hari_rusak}")\nprint(f"Estimasi kerugian 90 hari : Rp{total_rugi / 1e9:.1f} miliar")`,
        lockLines: 12,
        solution: `import random\nrandom.seed(7)\n\nAUC_AWAL = 0.91\nVOLUME_HARIAN = 10_000          # skor kredit per hari\nBIAYA_PER_SALAH = 150_000       # rupiah per keputusan buruk\n\nauc = AUC_AWAL\nhari_rusak = None               # hari pertama AUC < 0.80\ntotal_rugi = 0.0\n\n# TULIS KODEMU: simulasi 90 hari pembusukan\nfor hari in range(1, 91):\n    auc = max(0.50, auc - random.gauss(0.0022, 0.0009))\n    if hari_rusak is None and auc < 0.80:\n        hari_rusak = hari\n    p_salah = max(0.0, 2.0 * (AUC_AWAL - auc))\n    total_rugi += VOLUME_HARIAN * p_salah * BIAYA_PER_SALAH\n\nprint(f"AUC hari ke-90 : {auc:.3f}")\nprint(f"Hari pertama AUC < 0.80 : hari ke-{hari_rusak}")\nprint(f"Estimasi kerugian 90 hari : Rp{total_rugi / 1e9:.1f} miliar")`,
        checks: [
          { kind: "equal", task: "t1", name: "hari_rusak", value: 52, tol: 0, label: "`hari_rusak` = 52", msg: "Hari pertama AUC menembus 0.80 adalah hari ke-52. Cek kondisi if di dalam loop." },
          { kind: "stdout_matches", task: "t3", pattern: "AUC hari ke-90 : 0\\.715", label: "AUC akhir 0.715", msg: "AUC akhir simulasi harus 0.715 dengan seed 7." },
          { kind: "stdout_matches", task: "t3", pattern: "Rp26\\.3 miliar", label: "Rugi Rp26.3 miliar", msg: "Total kerugian 90 hari = Rp26.3 miliar. Cek rumus p_salah dan akumulasi." },
        ],
      },
      reference: "random.gauss(mu, sigma). Biaya diam = peluang salah × volume × biaya satuan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Seberapa banyak MLOps yang kamu butuhkan?",
      prose: [
        "Tidak semua model butuh MLOps penuh. Peta keputusan berikut menempatkan usahamu sesuai risiko:",
        "**Skenario 1 — Prototipe internal.** Model dipakai 3 analis untuk eksplorasi, tidak ada keputusan otomatis. → Notebook + dokumentasi cukup. MLOps penuh = overkill.",
        "**Skenario 2 — Skor batch mingguan, dampak sedang.** Contoh: segmentasi nasabah untuk kampanye. Salah skor = kampanye kurang tepat, bukan kerugian langsung. → Pipeline terjadwal + validasi data dasar + monitoring mingguan. Inilah sweet spot kebanyakan tim.",
        "**Skenario 3 — Keputusan real-time berdampak finansial.** Contoh: credit scoring, fraud blocking, pricing. Salah = uang hilang atau nasabah dirugikan. → MLOps penuh: registry, CI/CD dengan gerbang kualitas, monitoring 4 lapis, rollback 1-klik, retraining berpemicu, audit trail.",
        "**Skenario 4 — Tidak ada tim platform.** Startup 5 orang tanpa dedicated ML engineer. → Pakai managed service (SageMaker, Vertex) atau bahkan aturan bisnis sederhana dulu. MLOps build-sendiri butuh minimal 1 orang yang menjaganya.",
        "Aturan praktis 10 detik: tanyakan 'berapa rupiah hilang jika model ini diam-diam rusak selama 2 minggu?' Jika jawabannya 'tidak tahu' — kamu butuh monitoring. Jika jawabannya besar — kamu butuh semuanya.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: MLOps itu asuransi",
        body: "Asuransi terlihat mahal sampai rumah kebakaran. Monitoring, registry, dan rollback terlihat seperti birokrasi sampai insiden datang. Bedakan biaya premi (waktu membangun) dengan biaya klaim (kerugian insiden × peluangnya). KreditKu membayar Rp26,3 miliar untuk premi yang tidak pernah mereka bayar.",
      },
      reference: "Skala MLOps mengikuti skala risiko, bukan skala hype.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "BelanjaYuk: rekomendasi yang pelan-pelan mati",
      prose: [
        "E-commerce BelanjaYuk memakai model rekomendasi. Angka-angka yang masuk ke meja analis:",
        "CTR (click-through rate) rekomendasi: Januari 12,4% → Februari 11,1% → Maret 9,6% → April 8,2%. Volume: 2 juta impression per hari. Nilai rata-rata klik yang berujung beli: Rp18.000 kontribusi margin.",
        "Tim produk mengira 'pengguna bosan dengan UI baru'. Tim data mengecek: katalog produk berganti 40% sejak Januari (banyak SKU baru tidak ada di training data), dan pipeline embedding produk terakhir jalan... Januari. Model merekomendasikan barang-barang lama yang makin tidak relevan.",
        "**Pertanyaan:** (1) Berapa estimasi margin yang hilang per hari di April vs Januari? (2) Komponen MLOps apa yang paling awal bisa menangkap masalah ini? (3) Kenapa 'pengguna bosan' adalah diagnosis yang berbahaya?",
        "**Pembahasan:** (1) Selisih CTR 12,4% − 8,2% = 4,2pp. 2.000.000 × 0,042 = 84.000 klik hilang/hari × Rp18.000 = Rp1,51 miliar per hari. (2) Monitoring distribusi input (fitur katalog/SKU baru) atau monitoring metrik bisnis (CTR) dengan alerting — keduanya absen. (3) 'Pengguna bosan' tidak bisa diuji dan tidak menunjuk pemilik masalah; ia menghentikan investigasi. Diagnosis operasional ('kapan terakhir pipeline embedding jalan?') langsung menunjuk aksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam risk reporting, penurunan metrik bisnis yang 'dijelaskan' dengan narasi tanpa data (bosan, musiman, anomali) adalah red flag. Selalu minta: angka pembanding, pemilik metrik, dan kapan terakhir komponen terkait diverifikasi berjalan.",
      },
      reference: "84.000 klik/hari × Rp18.000 = Rp1,51 M/hari. Narasi bukan diagnosis.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Empat lapis monitoring: di mana alarm dipasang",
      prose: [
        "Kisah KreditKu sebenarnya menyimpan empat alarm yang tidak pernah dipasang — satu di setiap lapisan. Lapisan 1, DATA: cron retraining mati sejak Mei karena disk penuh, dan tidak ada monitor yang mengecek kesehatan job. Lapisan 2, PREDIKSI: distribusi skor model bergeser pelan — rata-rata skor naik dari 0,42 ke 0,51 karena data basi — dan tidak ada yang memantau distribusi output. Lapisan 3, KEPUTUSAN: approval rate naik dari 41% ke 47%; model menjadi terlalu berani memberi kredit. Lapisan 4, BISNIS: NPL naik dari 3,1% ke 4,8% — satu-satunya sinyal yang akhirnya terlihat, empat bulan terlambat.",
        "Setiap lapisan punya `waktu buta` yang berbeda: selisih antara kerusakan mulai terjadi dan tim menyadarinya. Tulis B = t_sadar − t_rusak. Untuk KreditKu, seandainya monitoring ada: lapisan data B ≈ 0 hari (cron mati ketahuan hari itu juga lewat health check), lapisan prediksi B ≈ 14 hari (butuh dua minggu data untuk memastikan pergeseran distribusi bukan noise), lapisan keputusan B ≈ 30 hari (approval rate butuh satu siklus pengajuan), lapisan bisnis B ≈ 120 hari (kredit macet baru tercatat setelah 90 hari menunggak). Kerugian tumbuh mengikuti B: dari lab tadi, Rp26,3 miliar dibagi 4 bulan buta ≈ Rp6,5 miliar per bulan keterlambatan.",
        "Polanya umum: makin ke hilir suatu lapisan, makin lambat ia mendeteksi, tapi makin jelas dampaknya. Alarm lapisan hulu itu murah — health check cron tiap 5 menit praktis gratis — dan menangkap masalah saat masih murah diperbaiki (restart cron, kosongkan disk). Alarm lapisan hilir itu mahal — NPL yang sudah naik berarti uang benar-benar hilang, plus rapat direksi, plus denda. Karena itu monitoring yang baik memasang alarm di SEMUA lapisan, bukan memilih satu.",
        "Contoh kedua: BelanjaYuk dari mini-case. Kerusakannya — pipeline embedding berhenti sejak Januari — adalah kegagalan lapisan DATA, yang tertangkap di hari ke-0 oleh monitor sederhana `kapan terakhir pipeline ini sukses jalan?`. Tanpa monitor itu, sinyal pertama muncul di lapisan BISNIS (CTR turun) tiga bulan kemudian, setelah Rp1,51 miliar per hari menguap. Bedakan pertanyaan tiap lapisan: data menjawab `apakah mesinnya jalan?`, prediksi `apakah modelnya masih waras?`, keputusan `apakah keputusannya masih masuk akal?`, bisnis `apakah uangnya masih benar?`.",
        "Untuk tiap lapisan, tentukan TIGA hal: metriknya apa, ambangnya berapa, siapa yang dibangunkan. Contoh konkret yang bisa langsung dipakai: lapisan data — metrik `umur data fitur terakhir`, ambang `> 26 jam`, yang dibangunkan engineer on-call via page. Lapisan prediksi — metrik `rata-rata skor harian`, ambang `bergeser > 0,05 dari baseline 7 hari`, yang dibangunkan data scientist via tiket. Lapisan keputusan — metrik `approval rate mingguan`, ambang `menyimpang > 5pp dari baseline`, pemilik tim risiko. Tanpa ketiganya, dashboard hanya jadi wallpaper: indah dilihat, tidak membangunkan siapa pun.",
        "Menentukan ambang adalah soal ekonomi, bukan statistik murni. Ambang terlalu sensitif (skor bergeser 0,01 langsung page) menghasilkan 20 false alarm per bulan — tim berhenti merespons, dan alarm yang sungguhan ikut terabaikan (mekanisme ini dibedah di MLOps7). Ambang terlalu longgar (baru page kalau bergeser 0,15) memberi waktu buta 60 hari. Aturan praktis: kalibrasi dari data historis. Untuk rata-rata skor KreditKu, baseline 0,42 dengan noise harian ± 0,015; ambang 0,42 + 3 × 0,015 = 0,465 menangkap pergeseran nyata ke 0,51 tanpa false alarm dalam 6 bulan data historis. Ambang yang tidak dikalibrasi = tebakan yang dibungkus angka.",
        "Terakhir: tiap lapisan butuh PEMILIK yang namanya tertulis. Data → data engineer. Prediksi → data scientist. Keputusan → product/risk owner. Bisnis → business owner. Alarm tanpa pemilik adalah notifikasi yang di-snooze selamanya — semua orang mengira orang lain yang menangani. Kalau timmu kecil dan satu orang merangkap semua lapisan, tulis tetap namanya empat kali; yang penting, saat alarm berbunyi jam 2 pagi, jelas siapa yang harus bangun.",
      ],
      formula: String.raw`B = t_{sadar} - t_{rusak}`,
      formulaNote: "B = waktu buta dalam hari; t_rusak = kapan kerusakan mulai terjadi; t_sadar = kapan tim menyadarinya. Perkiraan kasar kerugian = laju rugi harian × B. Memperkecil B dari lapisan hulu adalah investasi monitoring dengan ROI tertinggi.",
      figure: {
        svg: MLOPS1_DEEP_SVG,
        alt: "Diagram batang horizontal waktu buta: lapisan data ~0 hari, prediksi 14 hari, keputusan 30 hari, bisnis 120 hari.",
        caption: "Cara membaca: tiap batang horizontal = satu lapisan monitoring; panjang batang = waktu buta, yaitu berapa lama kerusakan tidak disadari. Interpretasi: alarm termurah dan tercepat ada di hulu (lapisan data, ~0 hari); mengandalkan metrik bisnis berarti buta 120 hari — seperti KreditKu yang membayar Rp26,3 miliar untuk keterlambatan itu.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: alarm murah di hulu, mahal di hilir",
        body: "Mengecek cron tiap 5 menit hampir gratis; menyelidiki NPL butuh rapat direksi dan uang yang sudah hilang. Kalau hanya sempat memasang satu alarm minggu ini, pasang di lapisan paling hulu: kesehatan job dan kesegaran data. Itu menangkap sebagian besar kegagalan operasional sebelum mencapai dompet.",
      },
      reference: "Waktu buta × laju rugi = tagihan. Perkecil B mulai dari hulu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Kegagalan ML di produksi paling sering adalah kegagalan operasi, bukan algoritma.",
        "Tiga fase hidup model: build → deploy → operate; track ini fokus pada operate.",
        "Nilai bisnis model: V = A × C × U (akurasi × cakupan × uptime).",
        "Model membusuk karena dunia berubah; pantau input & output hari ini, bukan menunggu label.",
        "Skala MLOps mengikuti skala risiko: prototipe ≠ batch mingguan ≠ real-time finansial.",
      ],
      next: { label: "MLOps2 — Pipeline & Orchestration", href: "/learn/mlops2-pipeline" },
      quiz: [
        {
          q: "Kasus KreditKu: apa akar masalah sebenarnya?",
          options: [
            { text: "Algoritma scoring-nya buruk", why: "AUC 0,91 di validasi — algoritmanya baik-baik saja." },
            { text: "Tidak ada operasi: cron retrain mati 4 bulan tanpa alert", why: "Model dibiarkan memakan data basi tanpa monitoring, alerting, atau pemilik. 100% kegagalan operasional.", correct: true },
            { text: "Data training terlalu sedikit", why: "Tidak ada bukti ini; masalahnya terjadi SETELAH deploy." },
            { text: "Tim data kurang pintar", why: "Menyalahkan orang menghindari perbaikan sistem. Sistemnya yang tidak punya pengaman." },
          ],
        },
        {
          q: "Model A: akurasi 0,95, uptime 50%. Model B: akurasi 0,85, uptime 99%. Cakupan sama. Mana nilai bisnis lebih tinggi?",
          options: [
            { text: "Model A — akurasi jauh lebih tinggi", why: "V = 0,95 × C × 0,50 = 0,475C. Akurasi tinggi tidak menolong jika separuh waktu mati." },
            { text: "Model B — V = 0,85 × C × 0,99 = 0,84C, hampir 2x lipat A", why: "Uptime adalah pengali, bukan bonus. Model yang selalu tersedia mengalahkan model pintar yang sering mati.", correct: true },
            { text: "Seri — keduanya seimbang", why: "Hitung: 0,475C vs 0,842C. Tidak seri." },
            { text: "Tidak bisa dibandingkan", why: "Bisa — dengan rumus V = A × C × U yang sama." },
          ],
        },
        {
          q: "Kenapa memantau akurasi saja tidak cukup untuk monitoring?",
          options: [
            { text: "Akurasi sulit dihitung", why: "Menghitungnya mudah; masalahnya datanya belum ada." },
            { text: "Label kebenaran sering datang berminggu-minggu kemudian", why: "Kredit macet ketahuan 90 hari kemudian. Menunggu label = buta berbulan-bulan.", correct: true },
            { text: "Akurasi tidak penting", why: "Akurasi penting — tapi bukan satu-satunya dan bukan yang tercepat tersedia." },
            { text: "Akurasi selalu stabil", why: "Justru ia turun diam-diam — itulah masalahnya." },
          ],
        },
        {
          q: "Startup 5 orang tanpa ML engineer, model dipakai 3 analis internal. Langkah MLOps yang tepat?",
          options: [
            { text: "Bangun platform Kubeflow sendiri", why: "Overkill total: tidak ada yang menjaganya, dan risikonya rendah." },
            { text: "Notebook + dokumentasi cukup; fokus ke produk", why: "Risiko rendah (internal, non-otomatis) → biaya MLOps penuh tidak sebanding. Skenario 1.", correct: true },
            { text: "Tidak usah pakai model sama sekali", why: "Modelnya berguna untuk analis; yang tidak perlu hanya ceremonial ops-nya." },
            { text: "Sewa konsultan MLOps 6 bulan", why: "Uang lebih baik dipakai untuk hal yang risikonya nyata." },
          ],
        },
        {
          q: "Pernyataan mana yang PALING tepat tentang MLOps?",
          options: [
            { text: "MLOps = membeli tools ML termahal", why: "Mitos langkah 2: tools mengikuti proses. Disiplin + cron bisa mengalahkan platform mahal tanpa runbook." },
            { text: "MLOps = disiplin agar model tetap sehat, aman, dan akuntabel di produksi", why: "Tepat: monitoring, rollback, retraining, governance — semuanya tentang operasi, bukan algoritma.", correct: true },
            { text: "MLOps hanya untuk perusahaan besar", why: "Skalanya menyesuaikan risiko; prinsipnya berlaku untuk tim kecil juga." },
            { text: "MLOps menggantikan data scientist", why: "MLOps melengkapi, bukan menggantikan — fase operate vs fase build." },
          ],
        },
        {
          q: "Distribusi skor model fraud-mu bergeser kanan selama 3 minggu, tapi approval rate dan metrik bisnis masih normal. Lapisan monitoring mana yang menangkap anomali ini PALING AWAL?",
          options: [
            { text: "Lapisan data — cek skema dan kesegaran input", why: "Lapisan data menangkap input yang rusak atau basi, tapi di sini inputnya normal — yang bergeser adalah output model. Alarm di lapisan yang salah = alarm yang diam." },
            { text: "Lapisan prediksi — pantau distribusi skor output", why: "Tepat. Pergeseran distribusi skor adalah sinyal khas lapisan prediksi; ia muncul berminggu-minggu sebelum approval rate (keputusan) apalagi metrik bisnis bergerak.", correct: true },
            { text: "Lapisan keputusan — pantau approval rate", why: "Approval rate masih normal — menunggu lapisan ini berarti menunggu kerusakan merambat satu tingkat lebih jauh dan menambah waktu buta." },
            { text: "Lapisan bisnis — pantau NPL dan kerugian", why: "Metrik bisnis adalah alarm terakhir dan termahal; ia baru bergerak setelah kerugian benar-benar terjadi dan tercatat." },
          ],
        },
      ],
    },
  ],
};
