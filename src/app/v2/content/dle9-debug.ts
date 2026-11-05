import type { V2Lesson } from "../lib/types";

// Flowchart debugging: gejala -> diagnosis.
const DEBUG_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Flowchart debugging: loss NaN, flat, atau turun tapi val naik.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="200" y="10" width="160" height="40" rx="20" fill="var(--c1)" opacity="0.9"/>
<text x="280" y="35" fill="#fff" font-weight="600">Loss bermasalah?</text>
<rect x="30" y="80" width="140" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--c4)"/>
<text x="100" y="100" fill="var(--text)" font-weight="600">Loss = NaN</text>
<text x="100" y="118" fill="var(--text-muted)" font-size="11">→ lr/10, cek data</text>
<rect x="210" y="80" width="140" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--c2)"/>
<text x="280" y="100" fill="var(--text)" font-weight="600">Loss flat</text>
<text x="280" y="118" fill="var(--text-muted)" font-size="11">→ = −ln(1/C)? = acak</text>
<rect x="390" y="80" width="140" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--c3)"/>
<text x="460" y="100" fill="var(--text)" font-weight="600">Train turun,</text>
<text x="460" y="116" fill="var(--text)" font-weight="600">val naik</text>
<text x="460" y="130" fill="var(--text-muted)" font-size="11">→ overfit: rem</text>
<rect x="30" y="160" width="140" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="100" y="180" fill="var(--text)" font-weight="600">Loss turun lambat</text>
<text x="100" y="198" fill="var(--text-muted)" font-size="11">→ naikkan lr / batch</text>
<rect x="210" y="160" width="140" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="280" y="180" fill="var(--text)" font-weight="600">Akurasi = mayoritas</text>
<text x="280" y="198" fill="var(--text-muted)" font-size="11">→ cek label &amp; metrik</text>
<rect x="390" y="160" width="140" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="460" y="180" fill="var(--text)" font-weight="600">Train macet total</text>
<text x="460" y="198" fill="var(--text-muted)" font-size="11">→ overfit 1 batch dulu</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5">
<line x1="280" y1="50" x2="100" y2="80"/><line x1="280" y1="50" x2="280" y2="80"/><line x1="280" y1="50" x2="460" y2="80"/>
</g>
<text x="280" y="250" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">Aturan emas: 90% bug training ada di data &amp; config, bukan arsitektur.</text>
<text x="280" y="270" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">Uji overfit 1 batch: bila gagal menghafal 8 sampel, model/optimizermu rusak.</text>
</svg>`;

export const dle9: V2Lesson = {
  slug: "dle9-debug",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE9 — Debugging: Loss Tidak Turun",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-flat",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Loss 2,3 yang ternyata prestasi menebak acak",
      prose: [
        "Model klasifikasi 10 kelas dilatih 3 epoch. Loss: 2,31 → 2,30 → 2,30. Flat. Tim mulai menyalahkan arsitektur: tambah lapisan, ganti optimizer, curigai data. Seorang engineer iseng menghitung: −ln(1/10) = 2,3026. Loss model = 2,30. Modelnya tidak belajar apa-apa — ia menebak acak dengan sempurna, dan loss acak untuk 10 kelas memang 2,30.",
        "Akar masalah: label tidak ter-shuffle dengan benar terhadap fitur — tiap batch berisi label acak. Tidak ada arsitektur di dunia yang bisa belajar dari label acak; loss 2,30 adalah hal terbaik yang bisa dilakukan siapa pun. Perbaikan: satu baris shuffle. Training berikutnya loss turun ke 0,4.",
        "Twist-nya: angka 2,30 bukan kegagalan misterius — ia adalah tanda tangan matematis dari menebak acak. Setiap gejala training punya tanda tangan seperti ini, dan debugger yang baik mengenalinya seperti dokter mengenali gejala. Lesson ini adalah buku saku diagnosisnya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mendiagnosis loss flat 2,3 pada 10 kelas (ln(10)!); (2) menjalankan uji overfit satu batch sebagai tes kehamilan model; (3) memakai checklist debug sistematis (data, LR, inisialisasi, bug); (4) memetakan gejala ke diagnosis tanpa menebak arsitektur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model yang menebak acak tetapi di-deploy = risiko operasional maksimal. Tanda tangan loss acak (−ln(1/C)) adalah kontrol kualitas termurah: bila loss validasimu sama dengan angka ini, jangan deploy.",
      },
      reference: "Kenali tanda tangan gejala: loss acak = −ln(1/C). Jangan tebak, hitung.",
    },
    {
      id: "overfit-batch",
      eyebrow: "Langkah 2 · Tes sakti",
      title: "Uji overfit satu batch: tes kehamilan untuk model",
      prose: [
        "Sebelum debugging apa pun, lakukan tes sakti: ambil 8 sampel, latih sampai overfit total. Model yang sehat + optimizer yang benar akan menghafal 8 sampel dalam ratusan langkah — loss → ~0, akurasi → 100%. Lab membuktikan: regresi logistik pada 8 titik terpisah mencapai loss 0,0029, akurasi 1,00 dalam 300 langkah.",
        "Bila tes ini GAGAL (loss tidak turun bahkan untuk 8 sampel), masalahnya fundamental: bug di loss, gradien tidak mengalir (cek gradient check DLE2), learning rate nol atau data tidak masuk. Jangan sentuh arsitektur, jangan tambah data — perbaiki fondasi dulu.",
        "Bila tes ini BERHASIL tetapi training penuh gagal, masalahnya di skala: learning rate, batch size, regularisasi berlebih, atau data. Tes ini memisahkan dua dunia debugging dalam 2 menit — itulah mengapa ia disebut tes kehamilan: ya/tidak yang menentukan semua langkah berikut.",
        "💡 Intuisi: overfit adalah kemampuan, bukan penyakit — pada 8 sampel. Model yang tidak bisa menghafal 8 sampel tidak punya kapasitas atau gradien untuk belajar apa pun. Generalisasi = overfit yang dikendalikan (DLE6: regularisasi).",
        "💡 Intuisi: debugging DL = eliminasi berurutan, bukan tebakan paralel. Urutan: (1) overfit 1 batch; (2) cek data & label; (3) cek lr & loss; (4) cek inisialisasi & gradien; (5) baru arsitektur. Melompat ke (5) membuang minggu.",
        "Jika uji overfit GAGAL — vonis spesifik. Model tidak bisa menghafal 32 sampel = kapasitas atau sinyal RUSAK. Cek berurutan: (1) LR terlalu kecil? (coba 10x). (2) Loss function salah? (CrossEntropy untuk klasifikasi, bukan MSE!). (3) Label korup? (visualisasikan). (4) Arsitektur: ada aktivasi? dimensi cocok? 90 persen gagal-overfit = salah satu dari empat ini. Jangan sentuh data training penuh sampai 32 sampel ini takluk.",
        "Gradient check numerik — verifikasi backprop. Jika overfit 1 batch GAGAL dan arsitektur custom: bandingkan gradient analitik vs numerik ((f(w+e)−f(w−e))/2e). Selisih >1e-5 = bug di backward. Untuk layer standar framework: lewati (sudah teruji). Untuk custom layer/model: WAJIB sekali. Satu bug backward = training tidak pernah benar, selamanya. Verifikasi 10 menit vs debugging 10 hari.",
        "Reproduksi minimal — isolasi bug. Jika pipeline penuh membingungkan: buat script 30 baris (data sintetis + model + 1 batch + overfit). Jalan? Bug di DATA/PIPELINE. Tidak jalan? Bug di MODEL/LOSS. Reproduksi minimal = memotong 90 persen variabel. Aturan: tidak boleh lebih dari 50 baris; harus jalan <1 menit. Setiap jam debugging tanpa reproduksi minimal = jam yang terbuang.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Latih regresi logistik 300 langkah pada 8 sampel" },
        { id: "t2", text: "Hitung `loss` akhir dan `acc` training" },
      ],
      expected: "loss=0.0029  acc=1.00",
      note: {
        title: "🚨 Mitos: loss tidak turun = model kurang besar",
        type: "pitfall",
        body: "Yang benar: 90% kasus loss tidak turun disebabkan data, label, learning rate, atau bug — bukan kapasitas. Menambah lapisan pada model yang bahkan tidak bisa overfit 8 sampel seperti membeli mesin lebih besar untuk mobil yang bannya kempes. Tes 1 batch dulu, baru bicara kapasitas.",
      },
      hints: [
        "Loop 300x: p = sigmoid(X@w+b); gradien = X.T@(p-y)/8.",
        "Update: w -= lr*grad_w; b -= lr*grad_b.",
        "loss = rata-rata binary cross-entropy; acc = (p>0.5)==y.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(11)\n\nX = np.vstack([np.random.randn(4,2) + [2.,2.],\n               np.random.randn(4,2) + [-2.,-2.]])\ny = np.array([1,1,1,1,0,0,0,0], dtype=float)\nw = np.zeros(2); b = 0.0; lr = 0.5\n\n# TULIS KODEMU: latih 300 langkah full-batch\nfor _ in range(300):\n    \n\np = 1/(1+np.exp(-(X@w+b)))\nloss = \nacc = \n\nprint(f"loss={loss:.4f}  acc={acc:.2f}")`,
        lockLines: 8,
        solution: `import numpy as np\nnp.random.seed(11)\n\nX = np.vstack([np.random.randn(4,2) + [2.,2.],\n               np.random.randn(4,2) + [-2.,-2.]])\ny = np.array([1,1,1,1,0,0,0,0], dtype=float)\nw = np.zeros(2); b = 0.0; lr = 0.5\n\n# TULIS KODEMU: latih 300 langkah full-batch\nfor _ in range(300):\n    p = 1/(1+np.exp(-(X@w+b)))\n    w = w - lr * X.T@(p-y)/8\n    b = b - lr * (p-y).mean()\n\np = 1/(1+np.exp(-(X@w+b)))\nloss = -(y*np.log(p+1e-9)+(1-y)*np.log(1-p+1e-9)).mean()\nacc = ((p>0.5)==y).mean()\n\nprint(f"loss={loss:.4f}  acc={acc:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "loss", value: 0.0029, tol: 0.002, label: "`loss` sekitar 0.0029", msg: "8 sampel terpisah harus bisa dihafal: loss -> ~0. Cek update w dan b tiap langkah." },
          { kind: "equal", task: "t2", name: "acc", value: 1.0, tol: 1e-9, label: "`acc` seharusnya 1.00", msg: "Semua 8 sampel harus benar." },
          { kind: "stdout_matches", task: "t2", pattern: "loss=0\\.0029\\s+acc=1\\.00", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tes sakti: overfit 8 sampel. Gagal = fondasi rusak. Berhasil = masalah di skala.",
    },
    {
      id: "checklist",
      eyebrow: "Langkah 3 · Checklist",
      title: "Checklist sistematis: data, LR, inisialisasi, bug",
      prose: [
        "DATA: (1) Apakah fitur dan label ter-shuffle berpasangan? Bug cerita pembuka ada di sini. (2) Apakah ada NaN/inf di input? Satu NaN meracuni seluruh batch. (3) Apakah skala fitur wajar (normalisasi)? Input 0–255 tanpa normalisasi membuat gradien timpang. (4) Apakah label benar (0/1, bukan 1/2)? Off-by-one label = training pada target salah.",
        "LEARNING RATE & LOSS: (5) Apakah loss = −ln(1/C)? = menebak acak, cek data. (6) Apakah lr terlalu kecil (loss turun super lambat) atau besar (NaN)? (7) Apakah fungsi loss cocok (cross-entropy untuk klasifikasi, bukan MSE)? MSE untuk klasifikasi = gradien lemah saat salah besar.",
        "INISIALISASI & ARSITEKTUR: (8) Apakah aktivasi output cocok (sigmoid biner, softmax multi, linear regresi)? (9) Apakah inisialisasi sesuai aktivasi (He untuk ReLU, Xavier untuk tanh)? Inisialisasi salah = sinyal mati di lapisan dalam. (10) Apakah gradien mengalir (cek norm gradien per lapisan)? Lapisan awal gradien nol = vanishing.",
        "BUG KLASIK: lupa mode train/eval, lupa zero-grad (gradien menumpuk antar batch!), salah urutan (label, fitur) tertukar, dan seed tidak di-set sehingga bug tidak reproduksibel. Setiap bug ini pernah menghabiskan minimal satu minggu di suatu tim — checklist ini harganya 15 menit.",
        "💡 Intuisi: bug training tidak berteriak — ia berbisik lewat angka. Loss 2,3026, akurasi tepat sama dengan proporsi mayoritas, gradien tepat nol: semuanya pola matematis, bukan kebetulan. Belajar membaca pola = debugging 10× lebih cepat.",
        "Cara membaca: mulai dari oval biru (gejala), ikuti garis ke kotak gejalanya: NaN, flat, train-turun-val-naik; tiap kotak berisi diagnosis + tindakan.",
        "Interpretasi: flowchart mengurutkan tersangka dari yang paling sering (data dan config) ke yang paling jarang (arsitektur) — ikuti urutannya, jangan melompat.",
        "Urutan checklist = urutan biaya. (1) DATA (15 menit): label benar? ada NaN? distribusi masuk akal? — 50 persen bug ada di sini. (2) LR (5 menit): coba 10x lebih kecil dan 10x lebih besar, 20 iterasi tiap — loss bergerak? (3) INISIALISASI & LOSS (10 menit): loss untuk prediksi acak = teoritis? (ln(10)=2,3). (4) MODEL (30 menit): uji overfit 1 batch. (5) ARSITEKTUR (berjam-jam): terakhir! — karena termahal. Yang melompat ke (5) dulu = membayar 10x untuk bug yang sebenarnya di (1).",
        "Kapan BERHENTI debugging — aturan 2 jam. Jika 2 jam tidak ada kemajuan: (1) tulis yang sudah dicoba (hindari mengulang); (2) minta review orang lain (mata segar melihat yang lelah tak lihat); (3) coba pendekatan ORTOGONAL (bukan variasi ke-7 dari yang sama). Debugging >4 jam tanpa progres = biasanya asumsi dasar yang salah (data? label? task?). Berhenti BUKAN menyerah — ia strategi: istirahat + perspektif baru > ngotot buta.",
        "Bug klasik #1: label tertukar/shifted. Tanda: loss tidak turun-turun MESKI model bisa overfit 1 batch, dan akurasi validasi ~1/num_classes (acak). Cek 5 menit: visualisasikan 10 sampel + labelnya — “ini kucing, labelnya anjing??”. Terjadi saat: join tabel salah, shuffle tanpa sinkronisasi, mapping label berubah. Selalu visualisasikan SAMPEL + LABEL sebelum tuning apa pun — 5 menit yang menghemat 5 hari.",
        "Learning rate finder — sebelum checklist manual. Naikkan LR eksponensial dari 1e-7 ke 1e-1 dalam 100 iterasi, plot loss: loss turun TAJAM di rentang LR “sehat”. Pilih LR 10x di bawah titik minimum (zona aman). Satu plot 5 menit menggantikan 10 eksperimen tebak-tebakan. Jika plot FLAT di semua LR: bukan masalah LR — kembali ke checklist (data? label? loss?). Plot ini = kompas sebelum berjalan.",
      ],
      figure: {
        svg: DEBUG_SVG,
        alt: "Flowchart: kenali gejala loss lalu ikuti diagnosisnya.",
        caption: "Buku saku diagnosis: gejala → penyebab paling mungkin → tindakan.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: tambah epoch terus, nanti juga turun",
        type: "pitfall",
        body: "Yang benar: bila loss flat di angka tanda-tangan (acak/mayoritas) selama 3+ epoch, menambah epoch tidak mengubah apa-apa — fondasinya rusak. Epoch tambahan hanya membuang GPU. Berhenti, diagnosis dengan checklist, perbaiki, baru lanjutkan.",
      },
      reference: "Urutan cek: data -> lr/loss -> inisialisasi -> bug klasik. 15 menit menghemat seminggu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: gejala → diagnosis",
      prose: [
        "Skenario 1 — Loss NaN dalam 10 batch pertama. → lr ÷ 10 + warmup + cek NaN di data. Alasan: ledakan awal = langkah terlalu besar atau input korup.",
        "Skenario 2 — Loss flat di −ln(1/C) (2,30 untuk 10 kelas). → Cek pasangan fitur-label & shuffle. Alasan: model menebak acak = tidak ada sinyal yang bisa dipelajari dari input.",
        "Skenario 3 — Loss turun di train, akurasi val = proporsi mayoritas. → Cek imbalance + metrik (precision/recall), bukan akurasi. Alasan: model belajar memprediksi kelas mayoritas — rasional untuk loss, buruk untuk bisnis.",
        "Skenario 4 — Loss turun sangat lambat dari awal. → Naikkan lr 3–10× atau perbesar batch; cek normalisasi input. Alasan: langkah terlalu kecil atau gradien timpang skala.",
        "Skenario 5 — Semua terlihat benar tetapi hasil tidak reproduksibel. → Set seed (numpy, framework, data loader workers) + log config. Alasan: eksperimen tak reproduksibel = tak bisa di-debug.",
        "Aturan praktis 10 detik: (1) overfit 1 batch dulu; (2) cocokkan loss dengan tanda-tangan (−ln(1/C), mayoritas); (3) perbaiki dari data ke config ke arsitektur — jangan terbalik.",
      ],
      note: {
        title: "💡 Intuisi: 2,3 = vonis menebak acak",
        body: "Loss 2,31 pada 10 kelas = ln(10) = 2,3026 — TEPAT loss menebak acak uniform! Modelmu BELUM BELAJAR APA-APA (bukan “belajar lambat”). Vonis ini menghemat berjam-jam: jangan tuning hyperparameter untuk model yang belum belajar — cari BUG (label salah? loss salah? LR nol?). Angka 2,3 = diagnosis gratis.",
      },
      tasks: [],
      reference: "Gejala punya tanda tangan. Cocokkan dulu, tebak kemudian — tepatnya, jangan tebak.",
    },
    {
      id: "minicase-tanda",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Loss 2,31 pada 10 kelas: vonisnya?",
      prose: [
        "Kamu menerima laporan training: loss validasi 2,31, akurasi 10%, 10 kelas seimbang. Sebelum membaca 500 baris kode, hitung tanda tangannya: loss tebakan acak = −ln(1/10) = 2,3026; akurasi acak = 10%. Laporan cocok dengan kedua angka — vonis: model menebak acak, tidak belajar apa-apa.",
        "Selisih 2,31 − 2,3026 = 0,0074: noise statistik biasa, bukan sinyal belajar. Tindakan: hentikan training, jalankan checklist data (pasangan fitur-label, shuffle), lalu tes overfit 1 batch. Estimasi waktu perbaikan: 1 jam, bukan 1 minggu arsitektur.",
        "Pembahasan: inilah kekuatan tanda-tangan — diagnosis dalam 30 detik dari dua angka laporan. Engineer yang menghafal −ln(1/C) untuk C umum (2: 0,693; 10: 2,303) menghemat ratusan jam sepanjang karier.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `acak` = loss tebakan acak untuk 10 kelas (4 desimal)" },
        { id: "t2", text: "Hitung `selisih` = |2.31 - acak| (4 desimal)" },
      ],
      formula: String.raw`L_{\text{acak}} = -\ln\!\left(\frac{1}{C}\right)`,
      formulaNote: "L_acak = loss cross-entropy bila model menebak seragam; C = jumlah kelas. Untuk C=10: -ln(0,1) = 2,3026. Loss validasi yang sama dengan angka ini = model menebak acak.",
      expected: "acak=2.3026  selisih=0.0074",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira selisih kecil dari tanda-tangan berarti hampir belajar. Tidak: 0,0074 di atas acak = noise, bukan kemajuan. Belajar sejati menurunkan loss puluhan persen dari baseline acak, bukan seperseratus.",
      },
      hints: [
        "acak = -ln(1/10) = -np.log(0.1).",
        "selisih = abs(2.31 - acak).",
        "Cetak acak dengan :.4f.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(9)\n\nC = 10  # jumlah kelas\n\n# TULIS KODEMU\nacak = \nselisih = \n\nprint(f"acak={acak:.4f}  selisih={selisih:.4f}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(9)\n\nC = 10  # jumlah kelas\n\n# TULIS KODEMU\nacak = -np.log(1/C)\nselisih = abs(2.31 - acak)\n\nprint(f"acak={acak:.4f}  selisih={selisih:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "acak", value: 2.3026, tol: 0.001, label: "`acak` seharusnya 2.3026", msg: "-ln(1/10) = 2.3026." },
          { kind: "equal", task: "t2", name: "selisih", value: 0.0074, tol: 0.001, label: "`selisih` seharusnya 0.0074", msg: "|2.31 - 2.3026| = 0.0074." },
          { kind: "stdout_matches", task: "t2", pattern: "acak=2\\.3026\\s+selisih=0\\.0074", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tanda tangan acak: -ln(1/C). Cocok = tidak belajar. Selisih kecil = noise.",
    },
    {
      id: "ablation-study",
      eyebrow: "Langkah 6 · Studi ablasi",
      title: "Ablation: buktikan komponenmu benar-benar bekerja",
      prose: [
        "Tiga komponen baru masuk sekaligus: augmentasi, label smoothing, dan scheduler cosine. Akurasi naik 89,1% → 91,2%. Tim merayakan — sampai seseorang bertanya: komponen mana yang sebenarnya bekerja? Jawaban jujurnya: tidak ada yang tahu. Ketiga komponen selalu dilatih bersama; tidak satu pun pernah dicabut dan diuji sendiri.",
        "Studi ablasi menjawabnya dengan cara ilmuwan: cabut SATU komponen, latih ulang dengan semua hal lain identik, ukur penurunannya. Penurunan itulah kontribusi komponen itu. Desain yang adil punya lima syarat: (1) satu perubahan per run; (2) seed, data split, epoch, batch size, dan hardware sama persis; (3) baseline = model penuh TANPA komponen itu, bukan model lama dari eksperimen lain; (4) metrik diukur pada set validasi yang sama; (5) untuk klaim penting, ulangi dengan 3 seed dan laporkan rata-rata ± simpangan baku.",
        "💡 Intuisi: ablation adalah eksperimen kontrol. Klaim “akurasi 91,2% berkat arsitektur baruku” tanpa ablation sama dengan klaim obat bekerja tanpa kelompok kontrol. Setiap komponen yang tidak pernah dicabut = baris kode dan kompleksitas yang dibayar tanpa bukti ia menghasilkan apa-apa.",
        "Cara membaca tabel ablation: kolom drop = akurasi penuh − akurasi varian. Drop besar (mis. 6,5 pp untuk layer norm) = komponen vital. Drop kecil sekitar 0,2–0,5 pp = tidak bisa dibedakan dari noise seed — komponennya belum terbukti bekerja. Dua catatan: (1) interaksi — dua komponen yang masing-masing kecil bisa besar bila bersama, jadi ablation satu-per-satu kadang melewatkan sinergi; (2) komponen “kecil” yang mempercepat konvergensi tetap layak dipertahankan — tetapi dengan alasan biaya GPU, bukan akurasi.",
        "Hasil ablation yang jujur sering menyakitkan: dari tiga komponen yang “membawa” akurasi 89,1 → 91,2, bisa jadi hanya scheduler cosine yang bekerja, sisanya noise. Keputusan yang benar: buang yang tidak terbukti. Model lebih sederhana = lebih cepat, lebih murah, lebih mudah di-debug — dan akurasinya sama.",
        "Cara membaca output lab: tiap baris menampilkan drop satu varian dari baseline 91,2%. signifikan=YA berarti drop melebihi ambang 0,5 pp — komponen itu terbukti berkontribusi. signifikan=TIDAK berarti komponennya kandidat untuk dibuang, atau diuji ulang dengan 3 seed sebelum dibuang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `drop` akurasi tiap varian dari baseline 91,2" },
        { id: "t2", text: "Tandai komponen yang drop-nya tidak signifikan (≤ 0,5 pp)" },
      ],
      expected: "Tidak signifikan: augmentasi & scheduler cosine — signifikan: label smoothing, dropout, layer norm",
      note: {
        title: "🚨 Mitos: ablation = bandingkan model baru vs model lama",
        type: "pitfall",
        body: "Yang benar: itu BUKAN ablation, itu perbandingan apel-jeruk. Ablation yang adil = model PENUH yang sama, cabut SATU komponen per varian, semua config lain identik (seed, split, epoch, batch, hardware). Menambah 3 komponen sekaligus lalu mengklaim ketiganya bekerja = menipu diri sendiri. Satu perubahan per run, atau klaimmu tidak bisa dipertanggungjawabkan.",
      },
      hints: [
        "drop = penuh - ak.",
        "signifikan = \"YA\" bila drop > AMBANG, selain itu \"TIDAK\".",
        "Format: print(f\"{nama}: drop={drop:.2f}pp signifikan={signifikan}\")",
      ],
      code: {
        starter: `# Tabel ablation tertanam: akurasi validasi (%) — satu komponen dicabut per varian\npenuh = 91.2  # baseline: semua komponen aktif\nvarian = {\n    "tanpa_augmentasi": 90.9,\n    "tanpa_label_smoothing": 90.1,\n    "tanpa_scheduler_cosine": 91.0,\n    "tanpa_dropout": 89.4,\n    "tanpa_layer_norm": 84.7,\n}\nAMBANG = 0.5  # drop <= 0,5 pp dianggap tidak signifikan\n\n# TULIS KODEMU: hitung drop tiap varian, tandai yang signifikan\nfor nama, ak in varian.items():\n    `,
        lockLines: 13,
        solution: `# Tabel ablation tertanam: akurasi validasi (%) — satu komponen dicabut per varian\npenuh = 91.2  # baseline: semua komponen aktif\nvarian = {\n    "tanpa_augmentasi": 90.9,\n    "tanpa_label_smoothing": 90.1,\n    "tanpa_scheduler_cosine": 91.0,\n    "tanpa_dropout": 89.4,\n    "tanpa_layer_norm": 84.7,\n}\nAMBANG = 0.5  # drop <= 0,5 pp dianggap tidak signifikan\n\n# TULIS KODEMU: hitung drop tiap varian, tandai yang signifikan\nfor nama, ak in varian.items():\n    drop = penuh - ak\n    signifikan = "YA" if drop > AMBANG else "TIDAK"\n    print(f"{nama}: drop={drop:.2f}pp signifikan={signifikan}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "tanpa_layer_norm: drop=6\\.50pp signifikan=YA", label: "Layer norm teridentifikasi signifikan", msg: "drop layer norm = 91,2 − 84,7 = 6,50 pp → signifikan YA." },
          { kind: "stdout_matches", task: "t2", pattern: "tanpa_scheduler_cosine: drop=0\\.20pp signifikan=TIDAK", label: "Scheduler cosine teridentifikasi tidak signifikan", msg: "drop = 91,2 − 91,0 = 0,20 pp ≤ ambang 0,5 → TIDAK." },
          { kind: "stdout_matches", task: "t2", pattern: "tanpa_augmentasi: drop=0\\.30pp signifikan=TIDAK[\\s\\S]*tanpa_label_smoothing: drop=1\\.10pp signifikan=YA[\\s\\S]*tanpa_scheduler_cosine: drop=0\\.20pp signifikan=TIDAK[\\s\\S]*tanpa_dropout: drop=1\\.80pp signifikan=YA[\\s\\S]*tanpa_layer_norm: drop=6\\.50pp signifikan=YA", label: "Kelima baris tampil berurutan", msg: "Cetak tiap varian dengan format yang sama seperti contoh di hints." },
        ],
      },
      reference: "Satu perubahan per run; drop = kontribusi; yang tidak signifikan = buang atau buktikan ulang.",
    },
    {
      id: "experiment-tracking",
      eyebrow: "Langkah 7 · Tracking & learning curve",
      title: "Learning curve & tracking: baca kurva, catat semua, curigai satu angka",
      prose: [
        "Run terbaik minggu ini: akurasi 93,4%. Pertanyaan sederhana: learning rate-nya berapa? Seed berapa? Data split yang mana? Kode versi berapa? Tidak ada yang mencatat — dan run itu tidak akan pernah bisa direproduksi. Yang wajib dicatat per run: (1) config lengkap (lr, batch size, epoch, ringkasan arsitektur, seed); (2) versi data dan split; (3) versi kode (git hash); (4) metrik tiap epoch — train dan val loss plus metrik utama; (5) environment (GPU, versi library). Aturannya brutal tapi adil: angka yang tidak tercatat = angka yang tidak pernah terjadi.",
        "Learning curve adalah EKG training. Empat pola yang wajib dikenali: (a) train turun, val ikut turun lalu mendatar = sehat, lanjutkan; (b) train terus turun tetapi val naik dan gap melebar = overfit — hentikan, tambah regularisasi, atau kembali ke checkpoint terbaik; (c) keduanya flat di nilai buruk = underfit — naikkan kapasitas atau lr, atau kembali ke checklist bug; (d) val berosilasi liar = batch terlalu kecil atau lr terlalu besar. Keputusan lanjut atau henti dibaca dari BENTUK kurva, bukan dari satu angka epoch terakhir.",
        "Satu run = satu anekdot. Seed berbeda mengubah inisialisasi bobot dan urutan shuffle — dan pada dataset kecil, selisih 0,3–0,8 pp antar seed adalah hal biasa. Klaim “komponen X menambah 0,5%” dari satu run tidak bisa dibedakan dari keberuntungan seed. Standar kerja yang jujur: ulangi dengan 3 seed, laporkan mean ± std. Bila mean − std masih di atas baseline, klaimnya layak dipercaya.",
        "💡 Intuisi: seed punya dua peran yang berlawanan. Saat DEBUGGING, kunci seed — bug yang tidak reproduksibel tidak bisa dikejar. Saat EVALUASI klaim, acak seed — buktikan klaimmu tahan terhadap keberuntungan. Kebalikannya fatal: debug dengan seed acak = mengejar hantu; memilih seed terbaik untuk laporan = menipu diri sendiri.",
        "Early stopping dibaca dari kurva yang sama: tetapkan patience — mis. 10 epoch tanpa perbaikan val — SEBELUM training dimulai, bukan setelah melihat kurva (itu namanya hindsight). Patience terlalu kecil berhenti di lembah palsu; terlalu besar membuang GPU dan memberi overfit waktu berkembang. Dan selalu simpan checkpoint epoch TERBAIK di val, bukan epoch terakhir — model terakhir hampir tidak pernah yang terbaik.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: akurasi tertinggi dari 5 seed = hasil modelku",
        type: "pitfall",
        body: "Yang benar: itu hasil TERBAIK dari 5 lotre, bukan kemampuan model. Melaporkan max-of-5 tanpa std = inflasi sistematis: dengan cukup banyak seed, siapa pun bisa “mengalahkan” baseline. Praktik jujur: laporkan mean ± std dari SEMUA seed yang dijalankan, dan daftarkan semua run (termasuk yang gagal) di tracking. Reviewer — termasuk kamu 3 bulan lagi — hanya percaya pada angka yang bisa direproduksi.",
      },
      reference: "Catat semua run; baca bentuk kurva; klaim butuh 3 seed, bukan 1.",
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 8 · Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang diagnosis training yang gagal.",
      ],
      note: {
        title: "💡 Intuisi: uji overfit = tes kehamilan",
        body: "Ambil SATU batch (32 sampel), latih hingga loss ~0. BISA overfit = model & loss & pipeline SEHAT (bug ada di data/training scale). TIDAK BISA = bug di MODEL/LOSS (arsitektur, fungsi loss, label). Satu tes 5 menit yang membagi ruang pencarian menjadi dua. Tes kehamilan: positif/negatif, tidak ada “mungkin”. Jalankan ini SEBELUM menyentuh arsitektur.",
      },
      tasks: [],
      summary: [
        "Loss flat di −ln(1/C) = menebak acak; kenali tanda-tangannya sebelum menyalahkan arsitektur.",
        "Tes sakti: overfit 8 sampel dalam ratusan langkah — gagal = fondasi rusak.",
        "Urutan debug: data → lr/loss → inisialisasi → bug klasik → arsitektur.",
        "90% bug ada di data & config; arsitektur adalah tersangka terakhir.",
        "Bug training berbisik lewat pola angka — belajar membacanya.",
      ],
      next: { label: "DLE10 — Deploy Model DL", href: "/v2/learn/dle10-deploy" },
      quiz: [
        {
          q: "Loss 2,30 flat untuk klasifikasi 10 kelas. Diagnosis tercepat?",
          options: [
            { text: "Tambah lapisan", why: "Model yang menebak acak tidak butuh kapasitas lebih." },
            { text: "Model menebak acak (−ln(1/10)=2,30); cek pasangan fitur-label", why: "Tanda-tangan cocok persis: tidak ada sinyal yang dipelajari.", correct: true },
            { text: "Training 100 epoch lagi", why: "Fondasi rusak tidak sembuh dengan epoch." },
            { text: "Ganti optimizer", why: "Optimizer tidak memperbaiki label yang acak." },
          ],
        },
        {
          q: "Tes overfit 8 sampel GAGAL (loss tidak turun). Artinya?",
          options: [
            { text: "Data kurang", why: "8 sampel tidak butuh data banyak; ini soal fondasi." },
            { text: "Bug fundamental: loss, gradien, atau lr — perbaiki sebelum sentuh arsitektur", why: "Model sehat pasti bisa menghafal 8 sampel; gagal = fondasi rusak.", correct: true },
            { text: "Model kurang besar", why: "Regresi logistik pun bisa menghafal 8 titik terpisah." },
            { text: "Normal, lanjutkan training", why: "Ini sinyal berhenti, bukan lanjut." },
          ],
        },
        {
          q: "Akurasi val 92% tetapi sama dengan proporsi kelas mayoritas. Masalahnya?",
          options: [
            { text: "Model sangat bagus", why: "Ia hanya memprediksi mayoritas — nol nilai deteksi." },
            { text: "Metrik menipu; pakai precision/recall/AUC-PR", why: "Akurasi didominasi kelas mayoritas; yang dibutuhkan metrik kelas minoritas.", correct: true },
            { text: "Butuh lebih banyak epoch", why: "Model sudah konvergen ke strategi mayoritas." },
            { text: "Learning rate terlalu kecil", why: "Bukan masalah optimasi; ini masalah metrik dan imbalance." },
          ],
        },
        {
          q: "Lupa zero-grad antar batch menyebabkan?",
          options: [
            { text: "Training lebih cepat", why: "Sebaliknya: gradien menumpuk tak terkendali." },
            { text: "Gradien menumpuk dan update meledak/acak", why: "Tiap batch menambah gradien lama — arah update tercemar riwayat.", correct: true },
            { text: "Tidak ada efek", why: "Efeknya besar dan halus: loss berosilasi aneh." },
            { text: "Overfitting berkurang", why: "Tidak terkait regularisasi." },
          ],
        },
        {
          q: "Urutan debugging yang benar?",
          options: [
            { text: "Arsitektur → data → lr", why: "Terbalik: arsitektur tersangka terakhir." },
            { text: "Overfit 1 batch → data → lr/loss → inisialisasi → arsitektur", why: "Dari termurah dan tersering ke termahal dan terjarang.", correct: true },
            { text: "Acak, mana yang kepikiran dulu", why: "Itu cara menghabiskan minggu." },
            { text: "Langsung tanya forum", why: "Forum akan menanyakan hal yang sama di checklist ini." },
          ],
        },
      ],
    },
  ],
};
