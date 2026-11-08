import type { V2Lesson } from "../lib/types";

export const mr19: V2Lesson = {
  slug: "mr19-capstone-var-es",
  track: "Market Risk",
  module: "Capstone",
  title: "MR19 — Capstone: Bangun VaR/ES Engine",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-wawancara",
      eyebrow: "Langkah 1 · Wawancara",
      title: "Cerita: wawancara yang menentukan",
      prose: [
        "Bayangkan 6 bulan dari sekarang. Kamu duduk di wawancara Market Risk Analyst di sebuah bank. Pewawancara bertanya: ceritakan pengalamanmu membangun model risiko. Kandidat A menjawab: saya pernah belajar VaR — rumusnya z × σ. Kandidat B membuka laptop: ini VaR engine yang saya bangun — 3 metode, backtest Kupiec untuk ketiganya, stress test dengan skenario 2008 dan skenario hipotetis, plus laporan 1 halaman dengan rekomendasi limit. Metode historical saya tolak karena gagal backtest saat krisis mini — saya pilih Monte Carlo dengan alasan ini…",
        "Twist-nya: pewawancara tidak menguji hafalan rumus — ia menguji judgment. Kenapa pilih metode ini? Apa kelemahannya? Kapan ia gagal? — semua pertanyaan yang hanya bisa dijawab oleh orang yang benar-benar membangun, bukan menghafal. Capstone ini mengubahmu dari Kandidat A menjadi Kandidat B.",
        "Misi: bangun VaR engine (3 metode + ES), backtest ketiganya, jalankan stress test, tulis laporan 1 halaman. Estimasi 3–4 jam. Coding hanya 30% — 70% adalah judgment: memilih metode, menafsirkan selisih, memutuskan limit, menulis rekomendasi. Dokumentasikan alasan, bukan cuma hasil.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan perbedaan Kandidat A dan Kandidat B dalam satu kalimat." },
        { id: "t2", text: "Kenapa hipotesis metode harus ditulis SEBELUM melihat hasil backtest?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Pewawancara membeli judgment, bukan hafalan. Artefak (engine + laporan) = bukti; penjelasan kenapa/kapan gagal/apa keterbatasannya = pembeda. Analis yang tidak tahu batas modelnya = berbahaya.",
        type: "risk",
      },
      reference: "Capstone = artefak kerja + judgment. 4 milestone: engine → backtest → stress → laporan.",
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 2 · Arsitektur",
      title: "Arsitektur engine: 7 tahap",
      prose: [
        "Engine yang kamu bangun punya 7 tahap — cerminan seluruh track: data → kalibrasi → hitung VaR/ES (3 metode) → validasi (backtest) → stress test → lapor → review. Perhatikan urutan yang disengaja: validasi (backtest) datang sebelum laporan — angka yang belum diuji tidak boleh dilaporkan. Dan stress test sejajar dengan VaR, bukan sesudahnya — keduanya pilar kembar, bukan urutan.",
        "Engine yang baik memisahkan perhitungan, validasi, dan pelaporan menjadi modul independen — sehingga tiap bagian bisa diganti/diuji sendiri (ganti metode VaR tanpa menyentuh backtest). Ini bukan cuma clean code — ini disiplin validasi model: modul terpisah = bisa diuji terpisah. Jangan campur perhitungan dan pelaporan dalam satu fungsi.",
        "Peta keputusan desain: struktur kode → modul terpisah (data → hitung → validasi → lapor). Pilih data → kalibrasi vs uji HARUS terpisah (out-of-sample) — backtest dengan data kalibrasi = mencontek; sertakan krisis mini di data uji. Pilih metode → backtest + judgment, bukan angka terkecil (metode dengan VaR terkecil = limit paling longgar = godaan). Tulis laporan → angka + keputusan + keterbatasan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa validasi harus datang sebelum laporan." },
        { id: "t2", text: "Jelaskan kenapa modul harus terpisah." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira makin banyak skenario Monte Carlo makin akurat VaR-nya. Menambah skenario hanya mengurangi Monte Carlo error (noise simulasi) — tidak mengurangi model error (salah asumsi distribusi, parameter basi). 1 juta skenario dari model yang salah = jawaban sangat presisi untuk pertanyaan yang salah.",
        type: "pitfall",
      },
      reference: "Urutan: hitung → validasi → lapor. Stress sejajar VaR. Modul terpisah = validasi terpisah.",
    },
    {
      id: "milestone-1",
      eyebrow: "Langkah 3 · Milestone 1",
      title: "VaR engine: 3 metode + ES",
      prose: [
        "Spesifikasi Milestone 1: input 500 hari return 2 faktor (saham + obligasi, berkorelasi) untuk portofolio Rp10 M (60/40). Output: VaR 99%/1-hari dengan 3 metode (historis, parametrik, Monte Carlo) + ES 99% (rata-rata kerugian di luar VaR) + rasio ES/VaR. Deliverable: tabel perbandingan + 1 paragraf: metode mana yang paling meyakinkan untuk data ini, dan mengapa? Kriteria lolos: ketiga angka terhitung; rasio ES/VaR ditafsirkan (detektor ekor!); ada hipotesis awal metode mana yang akan menang di backtest — tulis hipotesismu dulu (melatih judgment, bukan curve-fitting).",
        "Walkthrough angka (pola pikir, bukan kunci jawaban — angkamu akan berbeda): Historical VaR = Rp428 jt, ES 99% = Rp512 jt (rasio 1,20). Parametrik VaR = Rp402 jt, ES = Rp468 jt (rasio 1,16). Monte Carlo (10rb skenario, t-copula): VaR = Rp435 jt, ES = Rp548 jt (rasio 1,26). Interpretasi: parametrik terendah di keduanya + rasio 1,16 ≈ normal-teoritis (1,15) — mencurigakan untuk data ber-krisis-mini. MC tertinggi untuk ES (menangkap ekor via t-copula).",
        "Lab mini: 20 hari P&L (Rp jt, satu hari krisis mini −480). Hitung VaR 99% historis = 398,68, ES 99% = 480,00, rasio = 1,204 — mirip pola walkthrough: rasio > 1,15 = ekor tebal terdeteksi. Selisih antar metode = bahan bakar analisismu, bukan gangguan.",
        "Judgment memilih metode — bukan angka terkecil. Tiga metode memberi tiga angka berbeda; godaan terbesar adalah memilih VaR terkecil (limit paling longgar, bisnis paling senang) atau terbesar (terlihat konservatif tanpa berpikir). Keduanya salah: pilihan benar = bukti (backtest out-of-sample) + judgment (robustness: metode mana yang paling tidak bergantung pada asumsi yang rapuh?) + alasan tertulis. Hipotesis ditulis SEBELUM melihat hasil — pre-registration melawan hindsight bias: klaim 'saya sudah tahu historical akan menang' setelah melihat hasil = bias, bukan judgment. Pewawancara menguji persis ini: 'kenapa pilih metode ini?' — jawaban 'karena backtest-nya terbaik' hanya separuh; separuh lainnya adalah 'dan karena ia tidak bergantung pada asumsi normalitas yang dilanggar data ini'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var_hist` (VaR 99%) dan `es_hist` (ES 99%) dari `pnl`" },
        { id: "t2", text: "Hitung `rasio` = es/var; tafsirkan vs 1,15 lalu cetak ketiganya" },
      ],
      expected: "var_hist=398.68  es_hist=480.00  rasio=1.204",
      note: {
        title: "Sering salah",
        body: "Mengira capstone = coding exercise. Coding hanya 30% — 70% adalah judgment. Pewawancara tidak bertanya apakah kodemu jalan — ia bertanya kenapa kamu percaya angka ini. Dokumentasikan alasan, bukan cuma hasil.",
        type: "pitfall",
      },
      hints: [
        "losses = sorted(-x for x in pnl); var = kuantil 99% dgn interpolasi.",
        "es = rata-rata ceil(1%) kerugian terbesar.",
        "rasio > 1,15 = ekor lebih tebal dari normal.",
      ],
      code: {
        starter: `import math\n\n# 20 hari P&L (Rp jt); hari ke-15 = krisis mini\npnl = [-15,-22,-8,-31,-19,-45,-12,-28,-52,-18,\n       -25,-38,-11,-29,-480,-21,-33,-16,-42,-24]\nlosses = sorted(-x for x in pnl)\n\n# TULIS KODEMU: VaR 99% historis, ES 99%, rasio\ndef kuantil(xs, p):\n    k = (len(xs) - 1) * p\n    f = math.floor(k)\n    return xs[f] + (xs[f + 1] - xs[f]) * (k - f)\nvar_hist = \nn_tail = \nes_hist = \nrasio = \n\nprint(f"var_hist={var_hist:.2f}  es_hist={es_hist:.2f}  rasio={rasio:.3f}")`,
        lockLines: 10,
        solution: `import math\n\n# 20 hari P&L (Rp jt); hari ke-15 = krisis mini\npnl = [-15,-22,-8,-31,-19,-45,-12,-28,-52,-18,\n       -25,-38,-11,-29,-480,-21,-33,-16,-42,-24]\nlosses = sorted(-x for x in pnl)\n\n# TULIS KODEMU: VaR 99% historis, ES 99%, rasio\ndef kuantil(xs, p):\n    k = (len(xs) - 1) * p\n    f = math.floor(k)\n    return xs[f] + (xs[f + 1] - xs[f]) * (k - f)\nvar_hist = kuantil(losses, 0.99)\nn_tail = math.ceil(0.01 * len(losses))\nes_hist = sum(sorted(losses, reverse=True)[:n_tail]) / n_tail\nrasio = es_hist / var_hist\n\nprint(f"var_hist={var_hist:.2f}  es_hist={es_hist:.2f}  rasio={rasio:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_hist", value: 398.68, tol: 0.01, label: "`var_hist` seharusnya 398.68", msg: "Kuantil 99% dgn interpolasi: 52 + 0,81×(480−52)." },
          { kind: "equal", task: "t1", name: "es_hist", value: 480.0, tol: 1e-9, label: "`es_hist` seharusnya 480.00", msg: "Rata-rata 1 kerugian terburuk (1% dari 20 = 1)." },
          { kind: "equal", task: "t2", name: "rasio", value: 1.204, tol: 0.001, label: "`rasio` seharusnya 1.204", msg: "480/398,68. > 1,15 = ekor tebal terdeteksi." },
          { kind: "stdout_matches", task: "t2", pattern: "var_hist=398\\.68\\s+es_hist=480\\.00\\s+rasio=1\\.204", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "M1: 3 metode + ES + rasio ES/VaR (detektor ekor). Hipotesis ditulis SEBELUM backtest.",
    },
    {
      id: "milestone-2",
      eyebrow: "Langkah 4 · Milestone 2",
      title: "Backtest ketiganya — lalu pilih satu",
      prose: [
        "Spesifikasi Milestone 2: data 250 hari out-of-sample (berbeda dari data kalibrasi!) dengan krisis mini di tengah (15 hari). Uji: Kupiec POF untuk tiap metode (uji statistik jumlah pelanggaran VaR vs ekspektasi) + hitung kapan pelanggaran terjadi (tersebar vs berkelompok — Christoffersen intuitif). Keputusan: pilih 1 metode untuk limit operasional + tulis alasan 3 kalimat. Jebakan yang disengaja: data out-of-sample mengandung krisis mini — metode yang menang di Milestone 1 (in-sample) belum tentu menang di sini. Inilah overfitting versi risiko.",
        "Walkthrough: pelanggaran — Historical 3 (hijau), Parametrik 6 (kuning!), MC 2 (hijau). Uji Kupiec: parametrik LR ≈ 3,56 < 3,84 → gagal tolak (zona kuning — dekat batas!). Keputusan: metode resmi = Historical (LR terkecil, tanpa asumsi), MC sebagai challenger untuk ES. Parametrik diturunkan jadi indikator cepat saja — LR 3,56 yang mepet batas belum cukup meyakinkan untuk limit resmi. (Hipotesis sebelum M2 yang benar: Historical akan backtest terbaik — tanpa asumsi distribusi; parametrik akan underperform di periode berekor.)",
        "Lab mini: hitung LR Kupiec ketiga metode (ekspektasi 2,5 pelanggaran). Hasil: hist 0,095, parametrik 3,555, MC 0,108 — ketiganya < 3,84, tetapi parametrik di zona kuning (mendekati batas) sementara dua lainnya nyaman di hijau. Pilih metode dengan LR terkecil yang jelas hijau: historical. Aturan: bukan yang terkecil VaR-nya — yang terkecil = godaan; bukan yang terbesar — itu kemalasan berpikir. Pilihan benar = bukti (backtest) + judgment (robustness) + alasan tertulis.",
        "Melampaui Kupiec — independensi pelanggaran (Christoffersen). Kupiec hanya menghitung JUMLAH pelanggaran — tetapi 6 pelanggaran yang tersebar acak sangat berbeda dari 6 pelanggaran beruntun dalam 2 minggu. Yang kedua = model gagal tepat saat krisis (clustering) — jauh lebih berbahaya. Uji Christoffersen menambahkan uji independensi: apakah pelanggaran saling bebas, atau berkelompok? Aturan praktis capstone: catat TANGGAL tiap pelanggaran; jika 3+ terjadi dalam 10 hari berurutan, modelmu gagal di momen yang paling penting — tolak, apapun kata Kupiec. Backtest yang hanya menghitung tanpa melihat pola = setengah buta.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lr_hist`, `lr_param`, `lr_mc` (Kupiec, n=250)" },
        { id: "t2", text: "Pilih `terpilih` = metode LR terkecil; cetak semua + keputusan" },
      ],
      expected: "lr_hist=0.09  lr_param=3.56  lr_mc=0.11  terpilih=historical",
      note: {
        title: "Kaitan ke risk",
        body: "Backtest WAJIB out-of-sample: in-sample = ujian dengan kunci jawaban yang sudah dihafal — memberi rasa aman palsu. Hanya out-of-sample (apalagi dengan krisis mini) yang menguji generalisasi. Inilah pelajaran overfitting versi risiko.",
        type: "risk",
      },
      hints: [
        "Gunakan fungsi kupiec(n, x) yang sudah disediakan.",
        "Ekspektasi = n × 0,01 = 2,5 pelanggaran.",
        "terpilih = nama metode dengan LR terkecil (string 'historical').",
      ],
      code: {
        starter: `import math\n\ndef kupiec(n, x, p0=0.01):\n    ph = x / n\n    a = (n - x) * math.log(1 - p0) + x * math.log(p0)\n    b = (n - x) * math.log(1 - ph) + x * math.log(ph)\n    return -2 * (a - b)\n\nn = 250  # hari out-of-sample\npelanggaran = {"historical": 3, "parametrik": 6, "mc": 2}\n\n# TULIS KODEMU: LR tiap metode, lalu pilih yang terbaik\nlr_hist = \nlr_param = \nlr_mc = \nterpilih = \n\nprint(f"lr_hist={lr_hist:.2f}  lr_param={lr_param:.2f}  lr_mc={lr_mc:.2f}  terpilih={terpilih}")`,
        lockLines: 8,
        solution: `import math\n\ndef kupiec(n, x, p0=0.01):\n    ph = x / n\n    a = (n - x) * math.log(1 - p0) + x * math.log(p0)\n    b = (n - x) * math.log(1 - ph) + x * math.log(ph)\n    return -2 * (a - b)\n\nn = 250  # hari out-of-sample\npelanggaran = {"historical": 3, "parametrik": 6, "mc": 2}\n\n# TULIS KODEMU: LR tiap metode, lalu pilih yang terbaik\nlr_hist = kupiec(n, pelanggaran["historical"])\nlr_param = kupiec(n, pelanggaran["parametrik"])\nlr_mc = kupiec(n, pelanggaran["mc"])\nterpilih = min([("historical", lr_hist), ("parametrik", lr_param), ("mc", lr_mc)], key=lambda t: t[1])[0]\n\nprint(f"lr_hist={lr_hist:.2f}  lr_param={lr_param:.2f}  lr_mc={lr_mc:.2f}  terpilih={terpilih}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lr_hist", value: 0.09, tol: 0.01, label: "`lr_hist` seharusnya ~0.09", msg: "kupiec(250, 3). Dekat nol = sangat cocok." },
          { kind: "equal", task: "t1", name: "lr_param", value: 3.56, tol: 0.01, label: "`lr_param` seharusnya ~3.56", msg: "kupiec(250, 6). Zona kuning — dekat batas 3,84." },
          { kind: "equal", task: "t1", name: "lr_mc", value: 0.11, tol: 0.01, label: "`lr_mc` seharusnya ~0.11", msg: "kupiec(250, 2)." },
          { kind: "contains", task: "t2", name: "terpilih", value: "historical", label: "`terpilih` = historical", msg: "LR terkecil yang jelas hijau — bukan VaR terkecil." },
          { kind: "stdout_matches", task: "t2", pattern: "lr_hist=0\\.09\\s+lr_param=3\\.56\\s+lr_mc=0\\.11\\s+terpilih=historical", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "M2: Kupiec out-of-sample. Pilih = bukti + judgment + alasan tertulis. Bukan VaR terkecil.",
    },
    {
      id: "milestone-3",
      eyebrow: "Langkah 5 · Milestone 3",
      title: "Stress test: paksa hingga menembus",
      prose: [
        "Spesifikasi Milestone 3 — 3 skenario (historis, hipotetis, reverse). Historis: 2008 terulang — vol 2× lipat, korelasi 0,25 → 0,8. Hipotetis: rancanganmu sendiri — harus punya narasi + konsisten antar faktor. Reverse sederhana: kombinasi apa yang membuat kerugian > Rp1 M (10% portofolio)? — cari batasnya. Deliverable: tabel hasil 3 skenario + 1 paragraf: skenario mana yang paling mengkhawatirkan, dan apa mitigasinya?",
        "Walkthrough: skenario 2008 terulang (saham −40%, spread +400bp, korelasi → 0,8) memberi kerugian ≈ Rp2,1 M — 21% portofolio, 5× VaR harian. Angka ini yang mengubah keputusan: limit yang terlihat aman dari VaR harian ternyata rapuh terhadap guncangan sistemik. Inilah gunanya stress test — VaR menjawab hari biasa, stress menjawab hari yang menentukan.",
        "Intuisi kunci: stress test capstone harus mengubah keputusanmu — jika semua skenario aman, skenariomu terlalu sopan (ingat: stress yang tidak mengubah keputusan = gagal). Paksa satu skenario hingga menembus batas — lalu rancang mitigasinya. Itulah latihan yang jujur.",
        "Merancang reverse stress test yang jujur. Reverse stress test bertanya terbalik: bukan 'apa yang terjadi jika X?', melainkan 'kombinasi apa yang membuat kita rugi > Rp1 M (10% portofolio)?' — lalu menilai apakah kombinasi itu masuk akal. Tekniknya: (1) tetapkan ambang kerugian dulu; (2) cari kombinasi faktor yang menembusnya (saham −X%, spread +Y bp, korelasi → Z); (3) uji plausibilitas — apakah kombinasi ini pernah terjadi atau secara ekonomi mungkin? Jika ya, kamu menemukan titik matimu. Nilai reverse stress bukan di angkanya, melainkan di penemuannya: 'ternyata kami mati jika saham −25% DAN spread +300bp bersamaan — dan itu persis 2008.'",
      ],
      tasks: [
        { id: "t1", text: "Rancang 1 skenario hipotetis dengan narasi + asumsi konsisten antar faktor." },
        { id: "t2", text: "Jelaskan kenapa kerugian 21% (5× VaR) harus mengubah keputusan limit." },
      ],
      note: {
        title: "Sering salah",
        body: "Menilai stress test yang semua hasilnya aman sebagai kabar baik. Itu kegagalan latihan — skenario terlalu sopan. Nilai stress test = menemukan batas + merancang mitigasi, bukan konfirmasi kenyamanan.",
        type: "pitfall",
      },
      reference: "M3: historis + hipotetis (narasi!) + reverse (cari batas Rp1 M). Harus mengubah keputusan.",
    },
    {
      id: "milestone-4",
      eyebrow: "Langkah 6 · Milestone 4",
      title: "Laporan 1 halaman untuk direksi",
      prose: [
        "Spesifikasi Milestone 4 (laporan yang dibaca, bukan diarsip): 5 angka — VaR (metode terpilih), ES, hasil backtest (lolos/gagal), kerugian skenario terburuk, utilisasi limit. 3 warna — hijau/kuning/merah per metrik. 1 paragraf aksi — berdasarkan ini, saya merekomendasikan ___ karena ___. 1 paragraf keterbatasan — angka ini tidak menangkap ___; untuk itu butuh ___.",
        "Kriteria kelulusan capstone: keempat milestone selesai + laporan 1 halaman + paragraf keterbatasan yang jujur. Tanpa paragraf keterbatasan = belum lulus. Kejujuran adalah nilai tertinggi: analis yang tidak tahu batas modelnya = berbahaya.",
        "Contoh paragraf aksi: berdasarkan backtest, saya merekomendasikan metode historical sebagai VaR resmi (lolos Kupiec, tanpa asumsi distribusi), MC sebagai challenger untuk ES, dan limit VaR harian Rp450 jt — karena stress 2008 menunjukkan kerugian bisa 5× VaR. Contoh keterbatasan: angka ini tidak menangkap risiko likuiditas (butuh LVaR — VaR + biaya likuidasi) dan lompatan korelasi di luar skenario 2008 (butuh reverse stress lebih ekstrem).",
        "Komunikasi risiko ke direksi — seni menerjemahkan angka menjadi keputusan. Direksi tidak butuh rumus Kupiec; mereka butuh tiga jawaban: (1) apakah kita aman? (2) apa yang harus dilakukan? (3) apa yang tidak ditangkap angka ini? Formatnya: 5 angka + 3 warna + 1 paragraf aksi + 1 paragraf keterbatasan. Jebakan komunikasi: menyajikan VaR tanpa jangkar ('VaR Rp450 jt' — artinya apa?). Selalu beri jangkar: 'VaR Rp450 jt = 0,9% dari modal; skenario 2008 = Rp2,1 M = 4,2% dari modal; appetite = 5% dari modal.' Angka tanpa jangkar = noise; angka dengan jangkar = keputusan. Dan ingat aturan emas laporan: jika butuh > 15 menit untuk paham intinya, laporan gagal — halaman 1 harus menjawab 'apakah kita aman, dan apa yang harus dilakukan hari ini?'",
      ],
      tasks: [
        { id: "t1", text: "Tuliskan 5 angka + 3 warna untuk laporan versimu." },
        { id: "t2", text: "Tulis 1 paragraf aksi + 1 paragraf keterbatasan." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Laporan tanpa rekomendasi = data mentah; tanpa keterbatasan = tidak jujur. Keduanya wajib. Paragraf keterbatasan memaksa humility — kualitas terpenting risk manager: tahu apa yang tidak ditangkap angkanya.",
        type: "risk",
      },
      reference: "M4: 5 angka + 3 warna + aksi + keterbatasan. Tanpa keterbatasan = belum lulus.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Capstone menguji judgment, bukan hafalan",
      prose: [
        "Satu kalimat yang merangkum seluruh capstone: pewawancara tidak membeli hafalan rumus — ia membeli judgment yang terbukti: kenapa pilih metode ini, apa kelemahannya, kapan ia gagal. Engine yang kamu bangun adalah artefak; penjelasanmu tentang batas-batasnya adalah pembeda antara Kandidat A dan Kandidat B.",
        "Tiga pertanyaan yang diajukan pewawancara senior — dan harus bisa kamu jawab dari capstone ini: (1) kenapa metode historical, bukan parametrik yang VaR-nya lebih kecil? (2) apa yang tidak ditangkap oleh angka-angkamu — dan apa yang kamu butuhkan untuk menangkapnya? (3) kapan kamu terakhir mengubah keputusan karena stress test — bukan karena VaR?",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan perbedaan Kandidat A dan Kandidat B — dan di mana posisimu sekarang." },
        { id: "t2", text: "Tulis jawabanmu untuk tiga pertanyaan pewawancara di atas." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk capstone VaR/ES. Pertama, ingat proporsinya: coding 30%, judgment 70%. Engine yang jalan tetapi tanpa hipotesis awal, tanpa alasan pemilihan metode, dan tanpa paragraf keterbatasan = kalkulator mahal — bukan bukti analis. Dokumentasikan alasan, bukan cuma hasil. Kedua, tulis hipotesis SEBELUM melihat hasil backtest (pre-registration): 'historical akan menang karena tanpa asumsi distribusi; parametrik akan underperform di periode berekor.' Klaim 'sudah tahu' setelah melihat hasil = hindsight bias — musuh analis. Ketiga, tolak godaan angka terkecil: parametrik Rp402 jt terlihat 'lebih baik' dari historical Rp428 jt — tetapi LR 3,56 yang mepet batas + asumsi normalitas yang dilanggar data = fondasi rapuh. Pilihan benar = bukti (backtest) + robustness + alasan tertulis. Keempat, hitung independensi pelanggaran, bukan cuma jumlahnya: 6 pelanggaran beruntun dalam 2 minggu = model gagal tepat saat krisis — tolak, apapun kata Kupiec (Christoffersen intuitif). Kelima, stress test harus mengubah keputusan: jika semua skenario aman, skenariomu terlalu sopan — paksa satu skenario hingga menembus batas (reverse: kombinasi apa yang membuat rugi > Rp1 M?), lalu rancang mitigasinya. Keenam, ES melengkapi VaR: rasio ES/VaR adalah detektor ekor — 1,16 ≈ normal (1,15), 1,26 = ekor tebal terdeteksi. Jangan laporkan VaR tanpa ES. Ketujuh, komunikasikan dengan jangkar: 'VaR Rp450 jt = 0,9% modal; skenario 2008 = Rp2,1 M = 4,2% modal' — angka tanpa jangkar = noise. Dan terakhir, syarat kelulusan yang paling penting: paragraf keterbatasan yang jujur. Tanpa itu = belum lulus. Analis yang tidak tahu batas modelnya = berbahaya — dan pewawancara tahu itu.",
      },
      reference: "Judgment > hafalan: hipotesis dulu, bukti + robustness, stress mengubah keputusan, keterbatasan jujur.",
    },
    {
      id: "minicase-engine-mengubah",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Engine yang mengubah keputusan: Rp2,1 miliar yang tak terlihat VaR",
      prose: [
        "Analis junior Bank Nusantara menyelesaikan engine capstone-nya: portofolio Rp10 M (60% saham, 40% obligasi). VaR 99% historis = Rp428 jt. Direksi bertanya: 'jadi risiko kita Rp428 jt?' Analis menjawab: 'itu risiko hari biasa. Hari yang menentukan: skenario 2008 terulang memberi kerugian Rp2,1 M — 21% portofolio, 5× VaR harian.' Direksi terdiam — limit VaR Rp500 jt yang mereka setujui ternyata rapuh terhadap guncangan sistemik.",
        "Backtest memilih historical (LR 0,095 — hijau jelas) atas parametrik (LR 3,56 — kuning mepet batas), walau parametrik memberi VaR lebih kecil (Rp402 jt vs Rp428 jt). Godaan memilih yang terkecil ditolak dengan alasan tertulis: parametrik bergantung pada asumsi normalitas yang dilanggar data berekor. Keputusan akhir: VaR resmi = historical Rp428 jt; limit operasional Rp450 jt; Monte Carlo sebagai challenger untuk ES (rasio ES/VaR 1,26 = ekor tebal terdeteksi).",
        "Laporan 1 halaman: 5 angka (VaR Rp428 jt, ES Rp548 jt, backtest lolos, skenario terburuk −Rp2,1 M, utilisasi 95%), 3 warna, 1 paragraf aksi ('turunkan eksposur saham 10% sebelum kuartal berakhir — stress 2008 menembus appetite 5% modal'), 1 paragraf keterbatasan ('tidak menangkap risiko likuiditas — butuh LVaR; korelasi di luar skenario 2008 — butuh reverse stress lebih ekstrem'). Tiga pelajaran: engine tanpa judgment = kalkulator mahal; hipotesis sebelum hasil = pre-registration melawan bias; laporan tanpa keterbatasan = belum lulus — kejujuran adalah nilai tertinggi.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa historical dipilih walau VaR-nya lebih besar dari parametrik." },
        { id: "t2", text: "Tuliskan 5 angka + paragraf keterbatasan untuk laporan versimu." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira capstone selesai saat engine-nya jalan. Engine yang jalan = 30%. Yang dinilai pewawancara: hipotesis sebelum hasil, alasan pemilihan metode, interpretasi selisih antar metode, dan paragraf keterbatasan yang jujur. Kandidat A menghafal rumus; Kandidat B menjelaskan batas modelnya.",
        type: "pitfall",
      },
      reference: "VaR Rp428 jt vs skenario 2008 Rp2,1 M: stress mengubah keputusan. Laporan: 5 angka + aksi + keterbatasan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan rangkuman track",
      prose: [
        "Delapan pertanyaan terakhir track Market Risk. Setiap opsi punya alasan kenapa benar atau salah. Setelah ini: FR1 — Lanskap Fraud.",
      ],
      tasks: [],
      summary: [
        "MR1–MR2: trading vs banking book; VaR buta konsentrasi tanpa P&L explain; EWMA untuk vol adaptif.",
        "MR3–MR6: VaR 3 metode; non-linear butuh full reval; ES koheren; backtest Kupiec + Christoffersen.",
        "MR7: stress historis + hipotetis + reverse; harus mengubah keputusan.",
        "MR8–MR10: DV01/durasi/konveksitas; bootstrap & Nelson-Siegel; IRRBB (EVE vs NII).",
        "MR11–MR12: Greeks; lindung nilai dinamis; FX/komoditas (basis, hedge ratio).",
        "MR13–MR14: LVaR/LCR/NSFR; CVA/netting/SA-CCR.",
        "MR15–MR16: pilih model dari propertinya; FRTB = arsitektur insentif.",
        "MR17–MR18: limit berlapis + eskalasi; 3 pilar validasi + lineage.",
        "MR19: engine → backtest → stress → laporan. Judgment > hafalan.",
      ],
      next: { label: "FR1 — Lanskap Fraud", href: "/v2/learn/fr1-lanskap-fraud" },
      quiz: [
        {
          q: "Mengapa backtest capstone WAJIB out-of-sample?",
          options: [
            { text: "Agar lebih sulit", why: "bukan soal kesulitan." },
            { text: "Backtest in-sample = mencontek: model diuji dengan data kalibrasinya sendiri → hasil tidak informatif, memberi rasa aman palsu", why: "hanya out-of-sample (apalagi dengan krisis mini) yang menguji generalisasi.", correct: true },
            { text: "Regulator memaksa", why: "ini soal metodologi, bukan kepatuhan." },
            { text: "Supaya kode lebih panjang", why: "tidak relevan." },
          ],
        },
        {
          q: "Tiga metode memberi VaR berbeda jauh. Untuk limit operasional, pilih?",
          options: [
            { text: "Yang terkecil — limit longgar, bisnis senang", why: "itu godaan bisnis, bukan analisis." },
            { text: "Yang lolos backtest + paling robust, dengan alasan tertulis — bukan yang terkecil", why: "terkecil = godaan; terbesar = kemalasan berpikir. Pilihan benar = bukti + judgment + alasan tertulis.", correct: true },
            { text: "Rata-rata ketiganya", why: "rata-rata mengaburkan perbedaan kualitas metode." },
            { text: "Yang terbesar — selalu konservatif", why: "konservatisme buta = kemalasan berpikir." },
          ],
        },
        {
          q: "Paragraf 'keterbatasan' dalam laporan 1 halaman berfungsi untuk?",
          options: [
            { text: "Formalitas", why: "ini substansi, bukan formalitas." },
            { text: "Kejujuran metodologis: memberi tahu pengambil keputusan apa yang TIDAK ditangkap angka — mencegah overconfidence", why: "analis yang tidak tahu batas modelnya = berbahaya. Syarat kelulusan capstone.", correct: true },
            { text: "Mengisi halaman", why: "bukan pengisi." },
            { text: "Menyalahkan model", why: "bukan menyalahkan, melainkan jujur tentang batas." },
          ],
        },
        {
          q: "Dalam capstone, kapan hipotesis 'metode mana akan menang' harus ditulis?",
          options: [
            { text: "Setelah melihat hasil backtest", why: "itu hindsight bias — musuh analis." },
            { text: "SEBELUM melihat hasil — melatih judgment dan mencegah curve-fitting/rasionalisasi pasca-fakta", why: "hipotesis dulu = pre-registration. Menulis 'saya sudah tahu' setelah melihat hasil = bias.", correct: true },
            { text: "Tidak perlu", why: "perlu — melatih judgment." },
            { text: "Setelah laporan jadi", why: "terlalu terlambat." },
          ],
        },
        {
          q: "Stress test capstone yang semua hasilnya 'aman'. Penilaian?",
          options: [
            { text: "Bagus — berarti portofolio aman", why: "itu konfirmasi kenyamanan, bukan latihan." },
            { text: "Gagal sebagai latihan — skenario terlalu sopan; paksa satu skenario hingga menembus batas, lalu rancang mitigasi", why: "stress yang tidak mengubah keputusan = ritual.", correct: true },
            { text: "Cukup", why: "tidak cukup sebagai latihan jujur." },
            { text: "Tidak perlu stress test", why: "stress test pilar kembar VaR." },
          ],
        },
        {
          q: "Rasio ES/VaR engine-mu = 1,35 untuk data yang mengandung krisis mini. Interpretasi?",
          options: [
            { text: "Normal — tidak ada yang spesial", why: "1,35 jauh di atas 1,15 (normal-teoritis)." },
            { text: "Ekor lebih tebal dari normal terdeteksi — rasio > 1,15 = sinyal tail risk; ES wajib dilaporkan mendampingi VaR", why: "rasio ES/VaR adalah detektor ekor: 1,16 ≈ normal, 1,26+ = ekor tebal.", correct: true },
            { text: "Modelnya salah", why: "rasio tinggi = informasi tentang data, bukan kesalahan model." },
            { text: "Abaikan — VaR cukup", why: "justru di sinilah ES penting." },
          ],
        },
        {
          q: "6 pelanggaran VaR terjadi dalam 8 hari berurutan (bukan tersebar acak). Kupiec masih hijau. Penilaian?",
          options: [
            { text: "Lolos — Kupiec hijau berarti aman", why: "Kupiec hanya menghitung jumlah, buta terhadap pola." },
            { text: "Tolak — pelanggaran berkelompok (clustering) = model gagal tepat saat krisis; uji independensi (Christoffersen) wajib", why: "6 pelanggaran beruntun dalam 2 minggu jauh lebih berbahaya dari 6 yang tersebar. Catat tanggal pelanggaran, bukan cuma jumlahnya.", correct: true },
            { text: "Tidak masalah — jumlahnya sesuai ekspektasi", why: "polanya yang masalah, bukan jumlahnya." },
            { text: "Naikkan VaR sedikit", why: "masalahnya struktural (clustering), bukan kalibrasi." },
          ],
        },
        {
          q: "Dua metode: parametrik VaR Rp402 jt (LR Kupiec 3,56) vs historical Rp428 jt (LR 0,095). Pilih untuk limit operasional?",
          options: [
            { text: "Parametrik — VaR lebih kecil, limit lebih longgar, bisnis senang", why: "itu godaan bisnis, bukan analisis — LR 3,56 mepet batas + asumsi normalitas dilanggar data." },
            { text: "Historical — bukti backtest jelas hijau + tanpa asumsi distribusi yang rapuh; dengan alasan tertulis", why: "pilihan benar = bukti + robustness + alasan tertulis. Bukan yang terkecil, bukan yang terbesar.", correct: true },
            { text: "Rata-rata keduanya", why: "rata-rata mengaburkan perbedaan kualitas metode." },
            { text: "Yang perhitungannya tercepat", why: "kecepatan bukan kriteria pemilihan model risiko." },
          ],
        },
      ],
    },
  ],
};
