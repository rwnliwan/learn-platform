import type { V2Lesson } from "../lib/types";

// Kurva biaya: biaya retrain turun dengan interval, kerugian basi naik kuadratik.
// Total berbentuk U dengan optimum ~14 hari.
const COST_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Kurva biaya total berbentuk U dengan optimum di interval 14 hari.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="170" x2="460" y2="170"/><line x1="40" y1="125" x2="460" y2="125"/><line x1="40" y1="80" x2="460" y2="80"/><line x1="40" y1="35" x2="460" y2="35"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="40" y="188">7</text><text x="130" y="188">21</text><text x="220" y="188">45</text><text x="310" y="188">60</text><text x="420" y="188">90 hari</text></g>
<path d="M 40 60 C 120 90, 200 105, 460 165" fill="none" stroke="var(--chart-grid)" stroke-width="2" stroke-dasharray="5 4"/>
<path d="M 40 150 C 100 100, 160 60, 460 20" fill="none" stroke="var(--chart-grid)" stroke-width="2" stroke-dasharray="5 4"/>
<path d="M 40 168 C 80 130, 100 105, 130 118 C 200 150, 320 160, 460 168" fill="none" stroke="var(--c1)" stroke-width="3"/>
<circle cx="105" cy="112" r="5" fill="var(--c4)"/>
<text x="105" y="96" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">optimum ~14 hari</text>
<text x="400" y="150" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">biaya retrain (turun)</text>
<text x="400" y="30" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">rugi kebasian (naik)</text>
<text x="300" y="140" font-size="11" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">total (U)</text>
</svg>`;

const MLOPS8_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Biaya retrain per bulan: cold start mingguan Rp16 juta vs strategi hybrid Rp5,3 juta."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">8</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">16</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c4)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp16 jt</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Cold mingguan</text><rect x="294.7" y="127.0" width="129.6" height="53.0" rx="3" fill="var(--c1)"/><text x="359.5" y="121.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp5,3 jt</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Hybrid</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">juta rupiah / bulan</text></svg>`;

export const mlops8: V2Lesson = {
  slug: "mlops8-retraining",
  track: "MLOps",
  module: "Pipeline & Deploy",
  title: "MLOps8 — Strategi Retraining",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Retrain yang meracuni modelnya sendiri",
      prose: [
        "PayLancar (dari lesson lalu) memasang retrain otomatis tiap awal bulan — 'biar model selalu segar'. September 2026: gelombang serangan fraud pola baru muncul di minggu terakhir Agustus. Label kebenaran butuh 30 hari untuk matang — artinya saat retrain 1 September berjalan, serangan itu BELUM berlabel fraud.",
        "Model 'belajar' dari data Agustus: ribuan transaksi pola serangan berlabel 'aman' (karena labelnya belum matang). Hasilnya: model Oktober secara sistematis menganggap pola serangan baru sebagai normal. Retrain terjadwal — yang dimaksudkan menyegarkan model — justru mengabadikan serangan sebagai kebenaran.",
        "Twist-nya: musuhnya bukan model basi, melainkan retrain buta. 'Pokoknya retrain tiap bulan' terdengar disiplin, tapi tanpa memperhatikan KEMATANGAN label dan VALIDASI, jadwal retrain adalah mesin yang bisa meracuni dirinya sendiri — secara otomatis, tepat waktu, setiap bulan.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membandingkan tiga strategi retraining (scheduled, trigger-based, continuous) dengan angka biayanya; (2) menghitung total biaya retrain sebagai fungsi interval; (3) menjelaskan trade-off warm start vs cold start dengan konkret; (4) memilih strategi retrain yang tepat untuk kasusmu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Semakin sering retrain, semakin bagus'",
        type: "pitfall",
        body: "Retrain dengan label mentah = mengajari model kebohongan. Label fraud butuh 30–90 hari untuk matang; retrain mingguan dengan label 7 hari melatih model pada 'kebenaran sementara'. Frekuensi tanpa kematangan = presisi tanpa akurasi.",
      },
      reference: "Retrain buta = mesin peracun diri. Kematangan label dulu, jadwal kemudian.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 2 · Tiga strategi",
      title: "Scheduled, trigger-based, continuous",
      prose: [
        "Scheduled (terjadwal): retrain tiap N hari/minggu/bulan. Pro: sederhana, terprediksi, mudah dijadwalkan resource. Kontra: buta terhadap kondisi — retrain saat tidak perlu (buang uang) atau terlambat saat darurat. Cocok untuk pola stabil yang sudah terukur.",
        "Trigger-based (berpemicu): retrain saat metrik melewati ambang — PSI > 0,25 dua minggu berturut-turut, akurasi turun > 5pp, atau pola serangan baru terkonfirmasi. Pro: efisien, responsif. Kontra: butuh monitoring matang (MLOps7) + investigasi manusia sebelum eksekusi. Ini standar emas untuk model berisiko.",
        "Continuous (kontinu): model di-update inkremental tiap batch data baru (online learning). Pro: selalu segar. Kontra: kompleks, sulit di-debug ('versi mana yang memutuskan X kemarin?'), rawan catastrophic forgetting. Hanya untuk kasus khusus (rekomendasi, ads) dengan tim kuat.",
        "Syarat universal sebelum retrain apa pun: data MATANG (embargo: jangan pakai label yang belum final), validasi time-split (jangan acak — masa depan tidak boleh bocor ke training), dan challenger harus lewat shadow sebelum mengganti champion (MLOps4–5).",
        "💡 Intuisi: seperti mengganti oli mobil. Scheduled = tiap 5.000 km (sederhana, kadang terlalu cepat/lambat). Trigger-based = saat indikator menyala (efisien, butuh sensor bagus). Continuous = oli mengalir terus (canggih, hanya untuk mesin balap). Mobil harianmu pakai yang mana?",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Retrain = tinggal tekan tombol training ulang'",
        type: "pitfall",
        body: "Tombol training ulang tanpa embargo data, tanpa time-split validation, tanpa shadow testing = tombol 'racuni model'. Retrain yang aman adalah PIPELINE (MLOps2): validate → train → evaluate → gate → shadow → promote. Bukan satu perintah.",
      },
      reference: "Scheduled / trigger-based / continuous. Syarat: data matang + time-split + shadow.",
    },
    {
      id: "biaya",
      eyebrow: "Langkah 3 · Ekonomi retrain",
      title: "Berapa sering yang optimal? Hitung, jangan tebak",
      prose: [
        "Terlalu sering = bayar komputasi + validasi + risiko berulang. Terlalu jarang = model basi menggerogoti margin tiap hari. Total biaya berbentuk U:",
      ],
      formula: String.raw`C(T) = \frac{H}{T}\cdot c_r + \sum_{siklus}\sum_{d=1}^{T} rugi(d)`,
      formulaNote: "C(T) = total biaya horizon H dengan interval retrain T hari; c_r = biaya sekali retrain (komputasi + validasi + engineer); rugi(d) = kerugian harian akibat model berusia d hari (biasanya tumbuh kuadratik). Suku pertama turun dengan T, suku kedua naik dengan T — optimum di lembah U.",
      figure: {
        svg: COST_SVG,
        alt: "Kurva biaya total berbentuk U dengan optimum di interval 14 hari.",
        caption: "Ekonomi retrain: biaya retrain turun dengan interval, rugi kebasian naik. Total berbentuk U — optimum di lembah (~14 hari pada contoh). Cara membaca: sumbu X = interval retrain (hari); kurva turun = biaya retrain, kurva naik = rugi akibat model basi, kurva U = total. Interpretasi: interval terlalu pendek = bayar compute sia-sia; terlalu panjang = bayar kebasian; optimum (14 hari) adalah titik total minimum — hitung, jangan tebak.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Biaya retrain kan cuma komputasi cloud Rp2 juta.' Biaya riil = komputasi + waktu engineer validasi + risiko deploy + opportunity cost. Dan 'rugi kebasian' bukan teori: ia Rp714 jt/bulan di kasus PayLancar. Hitung dengan angka bisnismu, bukan tagihan cloud saja.",
      },
      reference: "C(T) berbentuk U. Optimum = lembah, ditemukan dengan angka sendiri.",
    },
    {
      id: "lab-biaya",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: cari interval retrain optimal",
      prose: [
        "Parameter realistis: sekali retrain Rp45 juta (komputasi + validasi + engineer). Kerugian harian model basi tumbuh kuadratik: Rp25.000 × d² (d = umur model dalam hari) plus noise. Horizon 180 hari.",
        "Tugasmu: lengkapi `rugi_harian(d)` dan `total_biaya(interval)` — jumlahkan biaya retrain (H/T kali) + akumulasi rugi harian tiap siklus. Lalu baca tabel untuk interval 7–90 hari.",
        "Cara membaca: kolom 'Total biaya' = harga 180 hari untuk tiap pilihan interval. Interpretasi: interval TERPENDEK bukan termurah (bayar retrain terus), interval TERPANJANG bukan termurah (model basi menggerogoti). Pemenangnya ada di lembah.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `rugi_harian(d)` kuadratik + noise" },
        { id: "t2", text: "Implementasikan `total_biaya(interval)`" },
        { id: "t3", text: "Jalankan; tentukan interval optimal" },
      ],
      expected: "optimal ~14 hari · Rp844.8 jt per 180 hari",
      note: {
        title: "💡 Intuisi: jangan bertanya 'berapa sering', bertanya 'berapa biaya'",
        body: "'Retrain tiap berapa hari?' adalah pertanyaan yang salah — jawabannya selalu 'tergantung'. Pertanyaan yang benar: 'berapa biaya tiap pilihan?' U mengubah perdebatan opini ('menurutku 2 minggu') menjadi perbandingan angka. Data mengalahkan pendapat, bahkan pendapat senior.",
      },
      hints: [
        "rugi_harian = 25_000 * d**2 * random.uniform(0.95, 1.05).",
        "n_retrain = HORIZON // interval; biaya = n_retrain * BIAYA_RETRAIN + rugi tiap hari tiap siklus.",
        "Bandingkan kolom total; terkecil = optimal.",
      ],
      code: {
        starter: `import random\nrandom.seed(88)\n\nBIAYA_RETRAIN = 45_000_000\nHORIZON = 180\n\ndef rugi_harian(d):\n    # TULIS KODEMU: kuadratik + noise\n    \n\ndef total_biaya(interval):\n    # TULIS KODEMU: (H/T)*c_r + akumulasi rugi harian\n    \n\nprint(f"{'Interval':>8} {'Retrain':>8} {'Total biaya (Rp M)':>18}")\nterbaik = None\nfor T in [7, 14, 21, 30, 45, 60, 90]:\n    tot, n = total_biaya(T)\n    print(f"{T:>8} {n:>8} {tot/1e6:>18.1f}")\n    if terbaik is None or tot < terbaik[1]:\n        terbaik = (T, tot)\nprint(f"Interval optimal ~ {terbaik[0]} hari (total Rp{terbaik[1]/1e6:.1f} jt per {HORIZON} hari)")`,
        lockLines: 12,
        solution: `import random\nrandom.seed(88)\n\nBIAYA_RETRAIN = 45_000_000\nHORIZON = 180\n\ndef rugi_harian(d):\n    # TULIS KODEMU: kuadratik + noise\n    return 25_000 * d ** 2 * random.uniform(0.95, 1.05)\n\ndef total_biaya(interval):\n    # TULIS KODEMU: (H/T)*c_r + akumulasi rugi harian\n    n_retrain = HORIZON // interval\n    biaya = n_retrain * BIAYA_RETRAIN\n    for _ in range(n_retrain):\n        for d in range(1, interval + 1):\n            biaya += rugi_harian(d)\n    return biaya, n_retrain\n\nprint(f"{'Interval':>8} {'Retrain':>8} {'Total biaya (Rp M)':>18}")\nterbaik = None\nfor T in [7, 14, 21, 30, 45, 60, 90]:\n    tot, n = total_biaya(T)\n    print(f"{T:>8} {n:>8} {tot/1e6:>18.1f}")\n    if terbaik is None or tot < terbaik[1]:\n        terbaik = (T, tot)\nprint(f"Interval optimal ~ {terbaik[0]} hari (total Rp{terbaik[1]/1e6:.1f} jt per {HORIZON} hari)")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "Interval optimal ~ 14 hari", label: "Optimal 14 hari", msg: "Lembah kurva U ada di interval 14 hari untuk parameter ini." },
          { kind: "stdout_matches", task: "t3", pattern: "total Rp844\\.8 jt", label: "Biaya Rp844.8 jt", msg: "Total 180 hari pada interval 14 = Rp844.8 jt." },
          { kind: "stdout_matches", task: "t3", pattern: "\\s+90\\s+2\\s+12434\\.1", label: "90 hari termahal", msg: "Interval 90 hari = Rp12,4 M — model basi sangat mahal." },
        ],
      },
      reference: "U-shaped: retrain terlalu sering & terlalu jarang sama-sama mahal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Strategi retrain untuk tiap kasus",
      prose: [
        "**Skenario 1 — Pola stabil, label cepat matang.** Model churn dengan label 7 hari, drift lambat. → Scheduled 2–4 minggu + monitoring. Sederhana dan cukup.",
        "**Skenario 2 — Risiko tinggi, label lambat matang.** Fraud/kredit: label 30–90 hari. → Trigger-based: PSI + penurunan performa terkonfirmasi + investigasi manusia. Jangan pernah scheduled-buta di sini (pelajaran PayLancar).",
        "**Skenario 3 — Lingkungan sangat dinamis.** Rekomendasi/ads: pola berubah harian. → Continuous/incremental dengan guardrail ketat + rollback cepat. Butuh tim kuat; bukan untuk pemula.",
        "**Skenario 4 — Data sedikit / mahal.** Model B2B dengan 500 sampel/bulan. → Retrain jarang (kuartalan) + fokus pada kualitas data, bukan frekuensi. Retrain sering dengan data sedikit = overfitting terjadwal.",
        "Aturan praktis 10 detik: 'berapa lama labelku matang?' Jawaban itu menentukan interval MINIMUM yang masuk akal. Retrain lebih cepat dari kematangan label = melatih dengan kebohongan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: embargo seperti fermentasi",
        body: "Tempe tidak bisa dipanen 1 jam setelah dibungkus — butuh fermentasi. Label pun butuh 'fermentasi': waktu hingga kebenaran final diketahui. Memanen lebih awal = tempe mentah = model beracun. Hormati waktu fermentasi datamu.",
      },
      reference: "Interval minimum = waktu kematangan label. Strategi mengikuti risiko.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Opsi retrain Bank Mini",
      prose: [
        "Bank Mini menimbang 3 opsi untuk model scoring-nya (label matang 45 hari, biaya retrain Rp45 jt, rugi kebasian Rp25.000×d²/hari):",
        "Opsi A — mingguan (T=7): 25 retrain × Rp45 jt = Rp1,125 M + rugi basi Rp87,5 jt → total ≈ Rp1,21 M per 180 hari. Tapi: melanggar embargo label (7 < 45 hari) — RISIKO RACUN.",
        "Opsi B — 2 mingguan (T=14): 12 retrain × Rp45 jt = Rp540 jt + rugi basi Rp304,8 jt → total ≈ Rp844,8 jt. Masih < 45 hari — butuh embargo parsial (pakai label yang sudah matang saja).",
        "Opsi C — bulanan (T=30): 6 retrain × Rp45 jt = Rp270 jt + rugi basi Rp1,42 M → total ≈ Rp1,69 M. Label hampir matang, aman dari racun, tapi mahal karena basi.",
        "**Pertanyaan:** (1) Opsi termurah secara angka? (2) Kenapa opsi termurah pun butuh penyesuaian? (3) Rekomendasi finalmu?",
        "**Pembahasan:** (1) Opsi B, Rp844,8 jt. (2) Karena 14 hari < 45 hari kematangan label — tanpa embargo, ia meracuni model seperti PayLancar. (3) Opsi B + embargo: retrain tiap 14 hari HANYA dengan data yang labelnya sudah final (mundur 45 hari), ATAU trigger-based dengan interval minimum 45 hari. Angka tanpa syarat kematangan = jebakan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kebijakan retrain adalah bagian dari model risk governance: frekuensi, pemicu, embargo, dan approver harus TERTULIS dan disetujui. 'Retrain tiap bulan' yang tidak tertulis = tidak ada yang bisa dimintai pertanggungjawaban saat model keracunan.",
      },
      reference: "Termurah ≠ terbaik jika melanggar kematangan label. Tulis kebijakannya.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Warm start vs cold start: retrain murah vs retrain bersih",
      prose: [
        "Retrain dari NOL (cold start) untuk model KreditKu: 8 jam GPU × Rp500 ribu/jam = Rp4 juta per retrain. Retrain mingguan → Rp16 juta/bulan. Alternatifnya warm start: lanjutkan training dari checkpoint model lama dengan data baru saja — 2 jam × Rp500 ribu = Rp1 juta per retrain, Rp4 juta/bulan. Hemat 75%. Tapi ada harga yang tidak tertulis di tagihan: `catastrophic forgetting` versi ringan — model perlahan melupakan pola lama yang masih relevan.",
        "Contoh konkret: model fraud dilatih warm start tiap minggu selama 6 bulan. Pola fraud `skimming ATM` yang marak 2024 perlahan tergerus oleh data baru yang didominasi `phising QRIS`. Saat komplotan lama kembali beraksi bulan ke-7, detection rate untuk pola lama turun dari 92% ke 61% — model `lupa`. Cold start tiap 6 bulan (latih ulang dari nol dengan 12 bulan data) mengembalikan 92%. Pelajaran: warm start = murah tapi punya memori pendek; cold start = mahal tapi ingatannya utuh.",
        "Strategi hybrid yang dipakai industri: warm start MINGGUAN (murah, ikuti tren terbaru) + cold start KUARTALAN (bersih, cegah lupa) + evaluasi perbandingan tiap kuartal. Hitung biayanya: warm 4x/bulan × Rp1jt = Rp4jt + cold 1x/kuartal Rp4jt → ≈ Rp5,3jt/bulan. vs cold mingguan Rp16jt/bulan. Hemat Rp10,7jt/bulan DENGAN ingatan yang terjaga. Syaratnya: tiap cold start dibandingkan dengan warm terakhir — jika cold tidak lebih baik > 0,005 AUC, ada yang salah dengan data (bukan strateginya).",
        "Cara mendeteksi `lupa` sebelum terlambat: simpan `test set abadi` — 5.000 sampel dari tiap kuartal historis yang TIDAK PERNAH dipakai training, hanya evaluasi. Tiap retrain (warm maupun cold) diuji pada SEMUA test set abadi. Jika skor pada test set Q1 turun > 0,02 setelah 6x warm start → sinyal lupa → jadwalkan cold start. Tanpa test set abadi, kamu tidak akan tahu modelmu lupa — sampai pola lama kembali dan merugikan.",
        "Contoh angka test set abadi: warm start minggu ke-1–6, AUC pada test-Q1: 0,91 → 0,905 → 0,90 → 0,895 → 0,885 → 0,87. Penurunan 0,04 dalam 6 minggu = 0,0067/minggu — tren linear yang jelas, bukan noise (noise mingguan ± 0,003). Proyeksi: 12 minggu → 0,83. Keputusan: cold start SEKARANG, bukan menunggu kuartal. Test set abadi mengubah `feeling model kayaknya menurun` menjadi `tren -0,0067/minggu, proyeksi tembus ambang dalam 5 minggu`.",
        "Biaya penyimpanan test set abadi: 4 kuartal × 5.000 sampel × 2KB ≈ 40MB — praktis nol. Biaya evaluasinya: tiap retrain scoring 20.000 sampel ≈ 10 menit CPU ≈ Rp20 ribu. Total < Rp100 ribu/bulan untuk `asuransi ingatan` model. Bandingkan dengan biaya lupa: satu pola fraud lama yang lolos = Rp2–5 miliar. Ini asuransi termurah di seluruh track ini.",
        "Terakhir: dokumentasikan KEPUTUSAN strategi di registry (MLOps4). `Model fraud: warm mingguan + cold kuartalan, test set abadi 4 kuartal, ambang lupa Δ>0,02` — tertulis, bukan di kepala. Saat engineer baru bertanya `kenapa retrain-nya begini?`, jawabannya satu baris, bukan legenda lisan. Strategi retrain yang tidak tertulis akan diubah oleh orang berikutnya berdasarkan firasat — dan firasat tidak bisa di-audit.",
      ],
      formula: String.raw`C_{total} = n_{warm} \cdot c_{warm} + n_{cold} \cdot c_{cold}`,
      formulaNote: "C_total = biaya retrain per bulan; n_warm/n_cold = frekuensi warm/cold start per bulan; c_warm/c_cold = biaya per retrain. Warm start murah (c kecil) tapi butuh cold start berkala agar model tidak `lupa` pola lama — ukur dengan test set abadi.",
      figure: {
        svg: MLOPS8_DEEP_SVG,
        alt: "Diagram batang biaya retrain bulanan: cold start mingguan Rp16 juta vs hybrid (warm mingguan + cold kuartalan) Rp5,3 juta.",
        caption: "Cara membaca: tinggi batang = biaya retrain per bulan (juta rupiah); dua batang = dua strategi. Interpretasi: hybrid menghemat Rp10,7 juta/bulan (67%) DENGAN ingatan terjaga lewat cold start kuartalan + test set abadi — murah tidak harus berarti pelupa.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: model warm start itu seperti fotokopi dari fotokopi",
        body: "Setiap warm start menyalin dari salinan sebelumnya — sedikit detail hilang tiap generasi. Setelah 6 bulan, yang tersisa adalah versi pudar dari pengetahuan aslinya. Cold start berkala = kembali ke dokumen asli. Test set abadi = cara tahu kapan salinannya sudah terlalu pudar.",
      },
      reference: "Warm mingguan + cold kuartalan + test set abadi. Ambang lupa: Δ > 0,02 pada test set lama → cold start sekarang.",
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
        "Retrain buta bisa meracuni model: label mentah = kebohongan yang diajarkan.",
        "Tiga strategi: scheduled (sederhana), trigger-based (standar emas), continuous (khusus).",
        "Syarat retrain: data matang (embargo) + time-split + shadow sebelum ganti champion.",
        "Biaya berbentuk U: terlalu sering & terlalu jarang sama-sama mahal — hitung.",
        "Interval minimum yang masuk akal = waktu kematangan label.",
      ],
      next: { label: "MLOps9 — Testing: Data & Model Validation", href: "/learn/mlops9-testing" },
      quiz: [
        {
          q: "Kasus PayLancar: kenapa retrain bulanan justru meracuni model?",
          options: [
            { text: "Modelnya terlalu kecil", why: "Ukuran model tidak relevan dengan keracunan data." },
            { text: "Label serangan baru belum matang (30 hari) saat retrain berjalan — pola serangan berlabel 'aman'", why: "Model belajar bahwa serangan = normal. Frekuensi tanpa kematangan = presisi tanpa akurasi.", correct: true },
            { text: "Komputasinya kurang", why: "Komputasi tidak memengaruhi kebenaran label." },
            { text: "Jadwalnya kurang sering", why: "Lebih sering justru lebih beracun — masalahnya kematangan, bukan frekuensi." },
          ],
        },
        {
          q: "Label fraud matang 45 hari. Interval retrain yang MASUK AKAL?",
          options: [
            { text: "Mingguan — biar segar", why: "7 < 45: melatih dengan label mentah = racun terjadwal." },
            { text: "Minimal 45 hari, atau lebih cepat HANYA dengan embargo (data yang sudah final)", why: "Hormati fermentasi label. Pengecualian hanya dengan embargo ketat.", correct: true },
            { text: "Harian — continuous lebih baik", why: "Continuous dengan label mentah = keracunan real-time." },
            { text: "Tidak perlu retrain", why: "Model tetap membusuk (MLOps1) — hanya saja retrain-nya harus benar." },
          ],
        },
        {
          q: "Model fraud berisiko tinggi, pola serangan berubah-ubah. Strategi terbaik?",
          options: [
            { text: "Scheduled bulanan — sederhana", why: "Buta terhadap serangan baru; pelajaran PayLancar." },
            { text: "Trigger-based: PSI/akurasi + investigasi manusia sebelum retrain", why: "Responsif terhadap kondisi nyata + manusia mencegah keracunan. Standar emas risiko tinggi.", correct: true },
            { text: "Continuous tanpa guardrail", why: "Sulit di-debug dan rawan lupa katastropik — butuh tim sangat kuat." },
            { text: "Retrain saat ada waktu luang", why: "'Waktu luang' bukan strategi — itu penundaan berbungkus." },
          ],
        },
        {
          q: "Lab: kenapa interval 90 hari (Rp12,4 M) jauh lebih mahal dari 14 hari (Rp844,8 jt)?",
          options: [
            { text: "Biaya retrain-nya lebih besar", why: "Justru lebih kecil: 2× vs 12×. Yang meledak adalah suku kedua." },
            { text: "Rugi kebasian tumbuh kuadratik — model tua 90 hari menggerogoti tiap hari", why: "rugi(d) = 25rb×d²: di d=90, sehari = Rp202,5 jt. Kebasian adalah pajak harian yang senyap.", correct: true },
            { text: "Noise random-nya besar", why: "Noise hanya ±5% — tidak menjelaskan 14x lipat." },
            { text: "Horizon-nya beda", why: "Horizon sama 180 hari untuk semua interval." },
          ],
        },
        {
          q: "Sebelum retrain apa pun, syarat yang TIDAK BOLEH dilewatkan?",
          options: [
            { text: "Izin direksi tertulis", why: "Berlebihan untuk retrain rutin; yang dibutuhkan approval sesuai kebijakan." },
            { text: "Data matang (embargo) + validasi time-split + challenger lewat shadow", why: "Tiga serangkai keamanan retrain: kebenaran final, tanpa leakage waktu, bukti di produksi.", correct: true },
            { text: "GPU terbaru", why: "Hardware tidak menentukan keamanan retrain." },
            { text: "Libur nasional", why: "Jadwal kalender bukan syarat teknis." },
          ],
        },
        {
          q: "Setelah 6x warm start mingguan, AUC pada test set abadi Q1 turun 0,91 → 0,87 (tren -0,0067/minggu, noise ± 0,003). Tindakan TEPAT?",
          options: [
            { text: "Lanjutkan warm start — tren masih di atas ambang 0,80", why: "Tren -0,0067/minggu menembus 0,80 dalam ~10 minggu, dan penurunannya SISTEMATIS (2x noise), bukan fluktuasi. Menunggu ambang = menunggu kerusakan." },
            { text: "Jadwalkan cold start sekarang; investigasi pola lama yang terlupakan", why: "Tepat. Penurunan 0,04 yang sistematis pada data LAMA = gejala lupa klasik warm start. Cold start dari nol dengan 12 bulan data mengembalikan ingatan; test set abadi memverifikasinya.", correct: true },
            { text: "Hapus test set Q1 — datanya sudah kedaluwarsa", why: "Menghapus termometer karena tidak suka suhunya. Test set abadi justru BEKERJA dengan benar: ia menangkap lupa yang tidak terlihat di metrik validasi biasa." },
            { text: "Naikkan learning rate warm start agar lebih cepat adaptasi", why: "Learning rate lebih besar mempercepat LUPA (menimpa bobot lama lebih agresif), bukan menyembuhkan. Ini memperparah penyebabnya." },
          ],
        },
      ],
    },
  ],
};
