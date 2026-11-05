import type { V2Lesson } from "../lib/types";

// Pipeline capstone: data -> latih -> evaluasi -> deploy.
const PIPE_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Pipeline end-to-end: data, latih, evaluasi, deploy, monitor.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="15" y="60" width="96" height="60" rx="10" fill="var(--c1)" opacity="0.9"/><text x="63" y="85" fill="#fff" font-weight="600">Data</text><text x="63" y="103" fill="#fff" font-size="11">200 nasabah</text>
<rect x="131" y="60" width="96" height="60" rx="10" fill="var(--c2)" opacity="0.9"/><text x="179" y="85" fill="#fff" font-weight="600">Latih</text><text x="179" y="103" fill="#fff" font-size="11">MLP 2-8-1</text>
<rect x="247" y="60" width="96" height="60" rx="10" fill="var(--c3)" opacity="0.9"/><text x="295" y="85" fill="#fff" font-weight="600">Evaluasi</text><text x="295" y="103" fill="#fff" font-size="11">prec/rec</text>
<rect x="363" y="60" width="96" height="60" rx="10" fill="var(--c4)" opacity="0.9"/><text x="411" y="85" fill="#fff" font-weight="600">Deploy</text><text x="411" y="103" fill="#fff" font-size="11">INT8, 0,11MB</text>
<rect x="469" y="60" width="76" height="60" rx="10" fill="var(--c5)" opacity="0.9"/><text x="507" y="85" fill="#fff" font-weight="600">Monitor</text><text x="507" y="103" fill="#fff" font-size="11">drift</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ah5)">
<defs><marker id="ah5" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="111" y1="90" x2="131" y2="90"/><line x1="227" y1="90" x2="247" y2="90"/><line x1="343" y1="90" x2="363" y2="90"/><line x1="459" y1="90" x2="469" y2="90"/>
<path d="M507,120 C507,180 295,180 295,132" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5,4"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="280" y="170">setiap tahap punya angka &amp; kriteria lolos — tidak ada yang jalan atas firasat</text>
<text x="280" y="190">garis putus-putus: monitor → latih ulang saat drift terdeteksi</text>
</g>
</svg>`;

export const dle12: V2Lesson = {
  slug: "dle12-capstone",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE12 — Capstone: Proyek DL End-to-End",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-brief",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Brief di meja: skor risiko 10.000 UMKM dalam 6 minggu",
      prose: [
        "Brief-nya satu halaman: bangun skor risiko kredit untuk 10.000 UMKM, data 2 tahun, 40 fitur tabel + teks deskripsi usaha. Tim A mengusulkan Transformer multimodal 6 minggu penuh. Tim B mengusulkan MLP 2 lapis + gradient boosting sebagai baseline, 2 minggu. Manajemen memilih tim B untuk fase 1.",
        "Hasil fase 1: baseline GBM AUC 0,79 dalam 2 minggu; MLP numpy (yang akan kamu bangun di lesson ini) AUC 0,77. Tim A masih tuning di minggu ke-5. Fase 2 — multimodal — baru disetujui setelah baseline terbukti, dengan anggaran yang dihemat dari fase 1.",
        "Twist-nya: kemenangan tim B bukan karena MLP lebih baik dari Transformer — melainkan karena mereka mengirim nilai dalam 2 minggu, bukan janji dalam 6 minggu. Capstone ini melatih pola yang sama: desain end-to-end yang jujur, training mini yang jalan, evaluasi yang bisa dipertahankan, dan rencana deploy yang realistis. Model terbaik adalah model yang selesai, terukur, dan ter-deploy.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menulis kontrak desain sebelum satu baris kode; (2) melatih MLP dari nol hingga konvergen; (3) mengevaluasi dengan confusion matrix secara jujur; (4) merencanakan deploy dari notebook ke produksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap tahap capstone ini memetakan ke dokumen risiko model: desain (asumsi), training (reprodusibilitas), evaluasi (metrik bisnis), deploy (batas operasional). Kerjakan seolah akan diaudit — karena model kredit memang diaudit.",
      },
      reference: "Capstone = DLE1 sampai DLE11 dalam satu proyek nyata yang selesai.",
    },
    {
      id: "desain",
      eyebrow: "Langkah 2 · Desain",
      title: "Desain: tulis kontrak sebelum menulis kode",
      prose: [
        "Kontrak proyek (tulis sebelum kode): (1) Masalah: prediksi default UMKM 12 bulan ke depan. (2) Data: 200 nasabah sampel (miniatur), 2 fitur terstandarisasi (rasio utang, keterlambatan) — cukup untuk intuisi, mewakili 40 fitur asli. (3) Arsitektur: MLP 2-8-1 — kecil, cepat, cukup untuk batas non-linear. (4) Metrik sukses: recall ≥ 0,90 (menangkap defaulter lebih penting dari presisi) dengan precision ≥ 0,85.",
        "Mengapa metrik itu? False negative (defaulter lolos) = kredit macet = kerugian langsung. False positive (bagus ditolak) = opportunity cost. Untuk risiko kredit, bobot FN > FP — maka recall diprioritaskan, dan threshold 0,5 bukan harga mati (langkah 4).",
        "Rencana eksperimen: (a) baseline regresi logistik (tanpa hidden layer); (b) MLP 2-8-1; (c) bandingkan pada metrik yang sama, data yang sama, seed yang sama. Tanpa (a), klaim (b) tidak punya pembanding — melanggar pelajaran DLE1.",
        "💡 Intuisi: desain yang ditulis mengalahkan desain yang dihafal. Kontrak satu halaman memaksa keputusan eksplisit (metrik, threshold, baseline) sebelum tenggelam dalam kode — dan menjadi dokumentasi audit gratis.",
        "💡 Intuisi: mulai dari miniatur yang jalan penuh. 200 sampel + MLP mungil yang selesai end-to-end mengalahkan 10.000 sampel + arsitektur megah yang macet di tengah. Skala belakangan, kebenaran duluan.",
        "Cara membaca: lima kotak = Data, Latih, Evaluasi, Deploy, Monitor; panah putus-putus dari Monitor kembali ke Latih = retraining saat drift terdeteksi.",
        "Interpretasi: tiap tahap punya angka dan kriteria lolos (kontrak). Tidak ada tahap yang jalan atas firasat — dan loop monitor menutup siklus menjadi sistem hidup, bukan proyek sekali jalan.",
      ],
      note: {
        title: "💡 Intuisi: kontrak dulu, kode kemudian",
        body: "Satu jam menulis kontrak desain (input? output? metrik sukses? batas?) menghemat satu pekan refactor. Kontrak = jawaban tertulis untuk: “apa yang dibangun, untuk siapa, sukses = apa”. Tim A (Transformer 6 minggu) vs kontrak 1 jam yang menunjukkan MLP 2 pekan cukup. Kontrak = rem untuk ambisi yang tidak terukur.",
      },
      figure: {
        svg: PIPE_SVG,
        alt: "Pipeline end-to-end: data, latih, evaluasi, deploy, monitor dengan loop retraining.",
        caption: "Kontrak capstone: lima tahap, masing-masing dengan angka dan kriteria lolos.",
      },
      tasks: [],
      reference: "Tulis kontrak: masalah, data, arsitektur, metrik, baseline. Baru kode.",
    },
    {
      id: "training",
      eyebrow: "Langkah 3 · Training mini",
      title: "Training: MLP 2-8-1 dari nol, 500 iterasi",
      prose: [
        "Saatnya membangun. Jaringan: 2 input → 8 hidden (ReLU) → 1 output (sigmoid), loss = binary cross-entropy, gradient descent full-batch lr 0,1, 500 iterasi. Semua dari numpy — tidak ada framework. Setiap baris backprop di sini adalah DLE2 yang hidup.",
        "Hasil: akurasi training 0,970. Bukan 1,00 — dua-tiga titik berada di wilayah tumpang tindih (UMKM bagus dengan rasio utang tinggi, atau sebaliknya). 0,970 pada data training miniatur = model belajar pola tanpa menghafal sempurna — sehat untuk kapasitas 2-8-1.",
        "Cek kewarasan: (1) loss turun monoton? (2) akurasi > baseline mayoritas (0,50)? (3) reproducible (seed 12)? Ketiganya ya. Bila salah satunya tidak, kembali ke DLE9 — jangan lanjut ke evaluasi dengan fondasi retak.",
        "💡 Intuisi: 500 iterasi × 200 sampel = 100 ribu contoh terlihat — kecil untuk standar industri, cukup untuk miniatur. Yang penting bukan skalanya, melainkan loop-nya benar: forward → loss → backward → update, 500 kali tanpa error.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Latih MLP 2-8-1 selama 500 iterasi (loop sudah disiapkan)" },
        { id: "t2", text: "Hitung `acc` = akurasi training" },
      ],
      formula: String.raw`L = -\frac{1}{N}\sum_{i=1}^{N}\left[y_i \log p_i + (1-y_i)\log(1-p_i)\right]`,
      formulaNote: "L = binary cross-entropy; N = jumlah sampel; y_i = label (0/1); p_i = peluang prediksi. Menghukum kesalahan yang yakin: salah dengan p=0,99 jauh lebih mahal dari salah dengan p=0,51.",
      expected: "acc_train=0.970",
      note: {
        title: "🚨 Mitos: capstone harus memakai framework besar agar sah",
        type: "pitfall",
        body: "Yang benar: nilai capstone ada pada kebenaran loop end-to-end, bukan pada framework. MLP numpy yang kamu pahami per baris mengalahkan model PyTorch yang kamu copy-paste tanpa paham. Framework dipelajari dalam sehari setelah intuisi ini kokoh — sebaliknya tidak.",
      },
      hints: [
        "Forward: h = relu(X@W1+b1); p = sigmoid(h@W2+b2).",
        "Backward: dz=(p-y)/200; dW2=h.T@dz; dh=dz@W2.T (nol-kan di h<=0); dW1=X.T@dh.",
        "Update tiap parameter dengan lr=0.1.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(12)\n\nX = np.vstack([np.random.randn(100,2)+[1.5,1.5],\n               np.random.randn(100,2)+[-1.5,-1.5]])\ny = np.concatenate([np.ones(100), np.zeros(100)])[:,None]\nX = (X - X.mean(0))/X.std(0)\nW1 = np.random.randn(2,8)*0.5; b1 = np.zeros(8)\nW2 = np.random.randn(8,1)*0.5; b2 = np.zeros(1)\nlr = 0.1\n\n# TULIS KODEMU: latih 500 iterasi (BCE + sigmoid)\nfor _ in range(500):\n    \n\nh = np.maximum(X@W1+b1, 0); p = 1/(1+np.exp(-(h@W2+b2)))\nacc = ((p>0.5)==y).mean()\nprint(f"acc_train={acc:.3f}")`,
        lockLines: 10,
        solution: `import numpy as np\nnp.random.seed(12)\n\nX = np.vstack([np.random.randn(100,2)+[1.5,1.5],\n               np.random.randn(100,2)+[-1.5,-1.5]])\ny = np.concatenate([np.ones(100), np.zeros(100)])[:,None]\nX = (X - X.mean(0))/X.std(0)\nW1 = np.random.randn(2,8)*0.5; b1 = np.zeros(8)\nW2 = np.random.randn(8,1)*0.5; b2 = np.zeros(1)\nlr = 0.1\n\n# TULIS KODEMU: latih 500 iterasi (BCE + sigmoid)\nfor _ in range(500):\n    h = np.maximum(X@W1+b1, 0)\n    p = 1/(1+np.exp(-(h@W2+b2)))\n    dz = (p-y)/200\n    dW2 = h.T@dz; db2 = dz.sum(0)\n    dh = dz@W2.T; dh[h<=0] = 0\n    dW1 = X.T@dh; db1 = dh.sum(0)\n    W2 -= lr*dW2; b2 -= lr*db2; W1 -= lr*dW1; b1 -= lr*db1\n\nh = np.maximum(X@W1+b1, 0); p = 1/(1+np.exp(-(h@W2+b2)))\nacc = ((p>0.5)==y).mean()\nprint(f"acc_train={acc:.3f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "W1", label: "`W1` terdefinisi", msg: "Bobot W1 harus ada setelah training." },
          { kind: "equal", task: "t2", name: "acc", value: 0.97, tol: 0.01, label: "`acc` sekitar 0.970", msg: "500 iterasi GD seharusnya mencapai ~0.97. Cek backward ReLU (nol-kan dh di h<=0)." },
          { kind: "stdout_matches", task: "t2", pattern: "acc_train=0\\.970", label: "`print` menampilkan acc", msg: "Format: acc_train=0.970." },
        ],
      },
      reference: "Forward -> loss -> backward -> update, 500x. ReLU backward: nol di h<=0.",
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 4 · Mini-case: evaluasi",
      title: "Evaluasi: confusion matrix tidak berbohong",
      prose: [
        "Akurasi 0,970 terdengar bagus — tetapi untuk risiko kredit, yang penting adalah JENIS kesalahannya. Confusion matrix: TP=98 (defaulter tertangkap), TN=96 (bagus lolos), FP=4 (bagus ditolak — opportunity cost), FN=2 (defaulter lolos — kerugian!). Precision = 98/102 = 0,961; recall = 98/100 = 0,980.",
        "Recall 0,980 ≥ target 0,90 ✓; precision 0,961 ≥ 0,85 ✓. Kontrak terpenuhi. Dua FN yang lolos adalah kasus untuk review manual — bukan kegagalan, melainkan daftar kerja: model menyaring 98%, manusia menangani 2% yang ambigu. Inilah desain sistem yang jujur.",
        "Threshold 0,5 bukan harga mati: turunkan ke 0,3 → recall naik (lebih banyak tertangkap) dengan harga precision turun (lebih banyak ditolak sia-sia). Threshold adalah keputusan BISNIS (berapa harga satu FN vs satu FP), bukan keputusan teknis. Dokumentasikan tradeoff-nya untuk komite.",
        "💡 Intuisi: threshold = tombol kebijakan. Model memberi peluang; bisnis memutuskan ambang. Engineer yang menyerahkan threshold default 0,5 tanpa analisis = menyerahkan keputusan bisnis ke kebetulan.",
        "💡 Intuisi: evaluasi pada data training = optimis. Angka di sini untuk latihan loop; klaim produksi wajib memakai test set yang steril (DLE11: validasi pada data yang tidak pernah dilihat).",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Latih ulang MLP (kode sama), hitung TP/TN/FP/FN" },
        { id: "t2", text: "Hitung `precision` dan `recall` (3 desimal)" },
      ],
      expected: "TP=98 TN=96 FP=4 FN=2  precision=0.961  recall=0.980",
      note: {
        title: "🚨 Mitos: akurasi 97% berarti model siap produksi",
        type: "pitfall",
        body: "Yang benar: akurasi menyembunyikan jenis kesalahan. 97% dengan 2 FN pada 100 defaulter (recall 98%) sangat berbeda dari 97% dengan 30 FN (recall 70%) — yang pertama siap dengan review manual, yang kedua berbahaya. Selalu buka confusion matrix sebelum klaim siap.",
      },
      hints: [
        "pred = (p>0.5).astype(int); bandingkan dengan y.",
        "TP = ((pred==1)&(y==1)).sum(), dst.",
        "precision = TP/(TP+FP); recall = TP/(TP+FN).",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(12)\n\nX = np.vstack([np.random.randn(100,2)+[1.5,1.5],\n               np.random.randn(100,2)+[-1.5,-1.5]])\ny = np.concatenate([np.ones(100), np.zeros(100)])[:,None]\nX = (X - X.mean(0))/X.std(0)\nW1 = np.random.randn(2,8)*0.5; b1 = np.zeros(8)\nW2 = np.random.randn(8,1)*0.5; b2 = np.zeros(1)\n\n# TULIS KODEMU: latih 500 iterasi lalu confusion matrix\n\nprint(f"TP={TP} TN={TN} FP={FP} FN={FN}  precision={precision:.3f}  recall={recall:.3f}")`,
        lockLines: 9,
        solution: `import numpy as np\nnp.random.seed(12)\n\nX = np.vstack([np.random.randn(100,2)+[1.5,1.5],\n               np.random.randn(100,2)+[-1.5,-1.5]])\ny = np.concatenate([np.ones(100), np.zeros(100)])[:,None]\nX = (X - X.mean(0))/X.std(0)\nW1 = np.random.randn(2,8)*0.5; b1 = np.zeros(8)\nW2 = np.random.randn(8,1)*0.5; b2 = np.zeros(1)\n\n# TULIS KODEMU: latih 500 iterasi lalu confusion matrix\nlr = 0.1\nfor _ in range(500):\n    h = np.maximum(X@W1+b1, 0)\n    p = 1/(1+np.exp(-(h@W2+b2)))\n    dz = (p-y)/200\n    dW2 = h.T@dz; db2 = dz.sum(0)\n    dh = dz@W2.T; dh[h<=0] = 0\n    dW1 = X.T@dh; db1 = dh.sum(0)\n    W2 -= lr*dW2; b2 -= lr*db2; W1 -= lr*dW1; b1 -= lr*db1\nh = np.maximum(X@W1+b1, 0); p = 1/(1+np.exp(-(h@W2+b2)))\npred = (p>0.5).astype(int); yt = y.astype(int)\nTP = int(((pred==1)&(yt==1)).sum()); TN = int(((pred==0)&(yt==0)).sum())\nFP = int(((pred==1)&(yt==0)).sum()); FN = int(((pred==0)&(yt==1)).sum())\nprecision = TP/(TP+FP); recall = TP/(TP+FN)\n\nprint(f"TP={TP} TN={TN} FP={FP} FN={FN}  precision={precision:.3f}  recall={recall:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "TP", value: 98, tol: 1e-9, label: "`TP` seharusnya 98", msg: "98 defaulter tertangkap dari 100." },
          { kind: "equal", task: "t1", name: "FN", value: 2, tol: 1e-9, label: "`FN` seharusnya 2", msg: "2 defaulter lolos — daftar review manual." },
          { kind: "equal", task: "t2", name: "precision", value: 0.961, tol: 0.002, label: "`precision` sekitar 0.961", msg: "98/(98+4) = 0.961." },
          { kind: "equal", task: "t2", name: "recall", value: 0.98, tol: 0.002, label: "`recall` sekitar 0.980", msg: "98/(98+2) = 0.980." },
          { kind: "stdout_matches", task: "t2", pattern: "TP=98\\s+TN=96\\s+FP=4\\s+FN=2\\s+precision=0\\.961\\s+recall=0\\.980", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Buka confusion matrix. Threshold = keputusan bisnis. Evaluasi produksi di test steril.",
    },
    {
      id: "deploy-plan",
      eyebrow: "Langkah 5 · Rencana deploy",
      title: "Rencana deploy: dari notebook ke produksi",
      prose: [
        "Model miniatur: 2-8-1 = (2+1)×8 + (8+1)×1 = 33 parameter → INT8 = 33 byte. Tentu ini mainan; versi produksi (40 fitur, 2 hidden layer 64) ≈ 7.000 parameter → < 0,01 MB. Tidak ada masalah ukuran — masalahnya di tempat lain.",
        "Checklist deploy: (1) Ekspor: numpy → ONNX agar bisa jalan di server Java bank. (2) Validasi pasca-kompresi: metrik dihitung ulang pada test steril. (3) Versioning: model v1.0 dengan rollback ke rule-based lama bila bermasalah. (4) Monitoring: distribusi skor harian — bila rata-rata skor bergeser > 10% dalam seminggu, drift terdeteksi → investigasi. (5) Human-in-the-loop: 2% kasus ambigu (dekat threshold) selalu ke analis manusia.",
        "Kriteria go/no-go: recall ≥ 0,90 DAN precision ≥ 0,85 pada test steril DAN latensi < 100 ms DAN rollback plan teruji. Satu saja gagal = tidak deploy. Disiplin ini yang membedakan engineer dari penghobi.",
        "💡 Intuisi: deploy = pernikahan, bukan kencan. Training adalah kencan (eksperimen bebas); deploy adalah komitmen (monitoring, rollback, akuntabilitas). Rencanakan pernikahannya sebelum kencan ketiga.",
      ],
      tasks: [],
      reference: "Checklist: ekspor, validasi ulang, versioning, monitoring drift, human-in-the-loop.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: setelah capstone, ke mana?",
      prose: [
        "Skenario 1 — Ingin memperdalam visi. → Ulangi capstone dengan CNN (DLE3) pada dataset citra nyata + pretrained (DLE7). Alasan: pola end-to-end sama, domain berbeda.",
        "Skenario 2 — Ingin memperdalam bahasa. → Fine-tune model bahasa pretrained untuk klasifikasi keluhan (DLE5+DLE7). Alasan: jalur tercepat ke nilai produksi di teks.",
        "Skenario 3 — Ingin spesialis training. → Pelajari distributed training + mixed precision mendalam (DLE8) + experiment tracking. Alasan: skala adalah keterampilan tersendiri.",
        "Skenario 4 — Ingin ke produksi/MLOps. → ONNX + serving + monitoring + CI/CD model (DLE10). Alasan: model yang tidak ter-deploy tidak menghasilkan nilai.",
        "Skenario 5 — Ragu semua masih dangkal. → Normal: 12 lesson = fondasi + peta. Kedalaman datang dari 3–5 proyek end-to-end berikutnya, bukan dari 12 lesson lagi. Pilih satu domain, bangun, deploy, ulangi.",
        "Aturan praktis 10 detik: (1) satu domain, satu proyek penuh; (2) baseline dulu (DLE1); (3) tulis kontrak (lesson ini); (4) evaluasi jujur; (5) deploy atau tidak terjadi.",
      ],
      note: {
        title: "💡 Intuisi: capstone = sistem, bukan model",
        body: "Nilai capstone BUKAN akurasi tertinggi — melainkan SISTEM yang jalan end-to-end: data masuk → prediksi keluar → termonitor → bisa di-rollback. Perekrut menilai: “bisakah orang ini mengirim model ke produksi?” — bukan “bisakah ia tuning 0,5 poin?”. Fokus 80 persen ke sistem, 20 persen ke model. Itu juga rasio pekerjaan MLE sungguhan.",
      },
      tasks: [],
      reference: "Fondasi selesai. Kedalaman = 3-5 proyek end-to-end berikutnya.",
    },
    {
      id: "minicase-anggaran",
      eyebrow: "Mini-case",
      title: "Mini-case: 10.000 UMKM, 6 minggu, Rp50 juta",
      prose: [
        "Skenarionya konkret. Budget Rp50 juta, waktu 6 minggu, target: skor risiko 10.000 UMKM dari 40 fitur tabel + teks deskripsi usaha. Dua proposal di meja. Proposal A (Tim A): Transformer multimodal, 6 minggu penuh, GPU Rp30 juta, ekspektasi AUC 0,88. Proposal B: MLP + gradient boosting untuk tabel + TF-IDF untuk teks, 2 pekan, GPU Rp5 juta (atau CPU!), ekspektasi AUC 0,85.",
        "Hitung ekspektasi nilai. Selisih AUC 0,03 = berapa rupiah? Jika tiap 0,01 AUC = Rp20 juta/tahun (estimasi dari NPL): A = Rp60 juta/tahun lebih baik. Biaya A: Rp30 juta GPU + 6 pekan × 3 orang × Rp1,5 juta = Rp27 juta + Rp30 juta = Rp57 juta. Biaya B: Rp5 juta + 2 × 3 × 1,5 juta = Rp9 juta + Rp5 juta = Rp14 juta. Selisih biaya: Rp43 juta SEKALI; selisih nilai: Rp60 juta/TAHUN. Jangka panjang A menang — TETAPI: risiko A (tidak selesai 6 minggu?) vs B (selesai 2 pekan, iterasi 4 pekan sisanya?).",
        "Keputusan yang dewasa: B DULU (2 pekan) sebagai baseline + sistem end-to-end, lalu 4 pekan tersisa untuk (1) evaluasi jujur B di data baru, (2) coba A JIKA B terbukti kurang. Hasil tipikal: B mencapai AUC 0,85, A mencapai 0,87 (bukan 0,88 — ekspektasi optimis!) — selisih 0,02 = Rp40 juta/tahun vs biaya tambahan Rp43 juta + risiko. B + iterasi MENANG. Pelajaran: baseline cepat + iterasi > big bang. Yang “ambisius” sering kalah dari yang “selesai”.",
        "Pembahasan: perhatikan tiga hal. (1) Ekspektasi AUC proposal A (0,88) adalah TEBakan — diskonto 30 persen untuk optimisme (0,87 realistis). (2) Nilai 0,01 AUC = Rp20 juta/tahun adalah ASUMSI — validasi dengan data historis sebelum percaya. (3) Opsi B memberi SISTEM yang jalan di pekan 2 — nilai opsionalitas (bisa dipakai, bisa diiterasi) tidak masuk spreadsheet tetapi menentukan. Keputusan terbaik = yang menghargai KETIDAKPASTIAN, bukan yang mengasumsikannya pergi.",
        "Cara membaca: bandingkan bukan AUC vs AUC, melainkan (nilai − biaya − risiko) vs (nilai − biaya − risiko). Proposal A: 60 − 57 − risiko_tinggi. Proposal B: 0 (baseline) + opsionalitas − 14 − risiko_rendah. Angka-angka ini kasar — tetapi keputusan kasar dengan angka > keputusan “keren” tanpa angka. Selalu tulis aritmetikamu, sekasar apa pun.",
        "Interpretasi: mini-case ini = seluruh track DLE dalam 1 keputusan. Arsitektur (dle1–dle5) vs kebutuhan; training (dle6–dle8) vs budget; evaluasi jujur (dle4, dle9); deploy realistis (dle10). Capstone bukan tentang model TERBAIK — ia tentang KEPUTUSAN TERBAIK di bawah kendala. Itulah pekerjaan MLE/DL Engineer: optimasi di bawah kendala, bukan maksimalisasi akurasi.",
      ],
      tasks: [],
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan selamat!",
      prose: [
        "Lima pertanyaan terakhir dari seluruh track. Setelah ini, kamu kembali ke kurikulum dengan fondasi lengkap.",
      ],
      tasks: [],
      summary: [
        "Desain dulu (kontrak: masalah, data, arsitektur, metrik, baseline) — baru kode.",
        "MLP 2-8-1 numpy: forward → BCE → backward → update, 500 iterasi, acc 0,970.",
        "Confusion matrix > akurasi: TP=98, FN=2, precision 0,961, recall 0,980.",
        "Threshold = keputusan bisnis (harga FN vs FP), bukan default teknis 0,5.",
        "Deploy butuh: ekspor, validasi ulang, versioning, monitoring drift, human-in-the-loop.",
        "Model terbaik = yang selesai, terukur, dan ter-deploy — bukan yang paling kompleks.",
      ],
      next: { label: "DLE13 — Deteksi Objek (YOLO)", href: "/v2/learn/dle13-deteksi-objek" },
      quiz: [
        {
          q: "Langkah pertama proyek DL baru yang benar?",
          options: [
            { text: "Pilih arsitektur terbesar", why: "Arsitektur mengikuti kontrak, bukan sebaliknya." },
            { text: "Tulis kontrak: masalah, data, arsitektur, metrik, baseline", why: "Keputusan eksplisit sebelum kode = dokumentasi audit gratis.", correct: true },
            { text: "Kumpulkan data sebanyak mungkin", why: "Data mengikuti kebutuhan masalah, bukan sebaliknya." },
            { text: "Sewa GPU terbesar", why: "Infrastruktur mengikuti desain, bukan mendahuluinya." },
          ],
        },
        {
          q: "Recall 0,98 tetapi ada 2 FN dari 100 defaulter. Sikap yang benar?",
          options: [
            { text: "Model gagal, buang", why: "98% tertangkap = nilai besar; 2% = daftar review manual, bukan kegagalan." },
            { text: "Deploy dengan human-in-the-loop untuk kasus ambigu", why: "Desain sistem jujur: model menyaring, manusia menangani ambiguitas.", correct: true },
            { text: "Sembunyikan 2 FN dari laporan", why: "Itu pelanggaran integritas risiko model." },
            { text: "Naikkan threshold ke 0,9", why: "Itu menurunkan recall — arah yang salah untuk risiko kredit." },
          ],
        },
        {
          q: "Threshold 0,5 pada model kredit sebaiknya?",
          options: [
            { text: "Selalu dipakai", why: "Default teknis bukan keputusan bisnis." },
            { text: "Ditetapkan dari tradeoff harga FN vs FP bersama bisnis", why: "Threshold = tombol kebijakan; biayanya milik bisnis, bukan engineer.", correct: true },
            { text: "Dihilangkan", why: "Keputusan biner butuh ambang; yang benar = ambang yang dihitung." },
            { text: "Dipilih acak tiap deploy", why: "Itu sabotase, bukan engineering." },
          ],
        },
        {
          q: "Kriteria go/no-go deploy yang lengkap?",
          options: [
            { text: "Akurasi tinggi saja", why: "Akurasi menyembunyikan jenis kesalahan." },
            { text: "Metrik di test steril + latensi + rollback plan teruji", why: "Tiga kaki: kualitas, operasional, keamanan. Satu gagal = tidak deploy.", correct: true },
            { text: "Model selesai training", why: "Selesai training ≠ siap produksi." },
            { text: "Disetujui satu engineer", why: "Butuh kriteria objektif, bukan opini." },
          ],
        },
        {
          q: "Pelajaran terbesar track Deep Learning Engineer ini?",
          options: [
            { text: "Arsitektur terbesar selalu menang", why: "DLE1 membantahnya: medan menentukan senjata." },
            { text: "Model terbaik = selesai, terukur, ter-deploy — bukan paling kompleks", why: "12 lesson bermuara di sini: nilai = dampak produksi, bukan kecanggihan lab.", correct: true },
            { text: "GPU menyelesaikan semua masalah", why: "DLE8: GPU hanya untuk matmul; DLE9: bug tak selesai dengan hardware." },
            { text: "Akurasi satu-satunya metrik", why: "DLE9, DLE12: metrik yang salah lebih berbahaya dari model yang salah." },
          ],
        },
      ],
    },
  ],
};
