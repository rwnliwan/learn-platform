import type { V2Lesson } from "../lib/types";

// Tiga kurva training pada fungsi kuadrat: LR kecil lambat, pas cepat, besar divergen.
const LR_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Kurva loss untuk tiga learning rate: kecil turun lambat, pas turun cepat, besar meledak.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="50" y1="20" x2="50" y2="240"/><line x1="50" y1="240" x2="530" y2="240"/></g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)" text-anchor="middle">
<text x="290" y="262">langkah training →</text>
<text x="28" y="130" transform="rotate(-90 28 130)">loss</text>
</g>
<path d="M50,60 C150,90 250,130 530,200" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<path d="M50,60 C120,150 200,210 340,232" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<path d="M50,60 L90,20 L110,240 L130,20 L150,240" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<g font-family="var(--font-ui)" font-size="12">
<rect x="360" y="30" width="12" height="12" fill="var(--c2)"/><text x="378" y="40" fill="var(--text)">LR kecil: turun, tapi lambat</text>
<rect x="360" y="52" width="12" height="12" fill="var(--c1)"/><text x="378" y="62" fill="var(--text)">LR pas: turun cepat &amp; stabil</text>
<rect x="360" y="74" width="12" height="12" fill="var(--c4)"/><text x="378" y="84" fill="var(--text)">LR besar: memantul lalu meledak</text>
</g>
<text x="290" y="200" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">w_baru = w − η·∇L : η mengatur panjang langkah</text>
</svg>`;

export const dle6: V2Lesson = {
  slug: "dle6-training",
  track: "Deep Learning Engineer",
  module: "Arsitektur Modern",
  title: "DLE6 — Training: Optimizer & Schedule",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-loss",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Loss yang menari-nari: dari 2,1 ke 847 ke NaN",
      prose: [
        "Dua minggu training model deteksi fraud. Loss: 2,1 → 1,4 → 847 → NaN. Tim panik: arsitektur diganti, data dicurigai, satu engineer lembur menulis ulang data loader. Seorang engineer senior melirik satu baris config: learning_rate: 0.1 — sepuluh kali lipat dari standar 0,01 untuk Adam pada kasus ini.",
        "Learning rate dikembalikan ke 0,01. Training ulang dari checkpoint: loss turun mulus 2,1 → 0,4 dalam 6 jam. Dua minggu kepanikan, solusinya satu angka desimal. Tidak ada yang salah dengan arsitektur, data, atau kode — hanya panjang langkah yang terlalu besar sehingga tiap update melompati lembah loss dan mendarat di dinding yang lebih tinggi.",
        "Twist-nya: hiperparameter terkecil di config sering menjadi penyebab terbesar kegagalan. Lesson ini memberimu intuisi fisika tentang learning rate, peta optimizer, dan jadwal yang membuat training stabil — supaya kamu tidak menghabiskan dua minggu menyalahkan arsitektur.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mendiagnosis loss yang divergen/NaN tanpa panik; (2) memilih antara SGD dan Adam untuk kasusmu; (3) merancang learning rate schedule (termasuk kosinus); (4) menerapkan regularisasi (dropout, weight decay, early stopping) secara tepat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Training yang divergen membuang anggaran GPU dan menunda delivery model. Learning rate adalah kontrol risiko termurah: satu angka, dampak dua minggu. Selalu log dan versioning hiperparameter seperti kamu memversioning kode.",
      },
      reference: "Saat loss aneh, curigai learning rate dulu sebelum merombak arsitektur.",
    },
    {
      id: "lr",
      eyebrow: "Langkah 2 · Learning rate",
      title: "Learning rate: panjang langkah di lembah berkabut",
      prose: [
        "Gradient descent: θ ← θ − η·∇L. Kamu berdiri di lereng lembah loss dalam kabut (hanya tahu kemiringan lokal = gradien), η = panjang langkahmu. η terlalu kecil: kamu mencapai lembah tapi butuh 10.000 langkah — kehabisan anggaran GPU. η pas: langkah besar di awal (lereng curam), otomatis mengecil mendekati dasar (gradien → 0). η terlalu besar: kamu melompati lembah, mendarat di lereng seberang yang lebih tinggi, memantul makin liar — divergen.",
        "Lab memakai f(w) = (w−3)², mulai w=0, 10 langkah. LR 0,01: w = 0,5488 — bergerak benar tapi baru 18% jalan (lambat). LR 0,1: w = 2,6779 — 89% jalan dalam 10 langkah (pas). LR 1,5: w = −3069,0 — meledak (divergen). Tiga nasib dari tiga angka, fungsi yang sama, kode yang sama.",
        "Aturan praktis menemukan η: mulai 0,01 untuk Adam / 0,1 untuk SGD; naikkan 10× sampai loss meledak, lalu pakai sepertiganya (LR range test). Jangan tuning buta — satu sweep terstruktur mengalahkan sepuluh tebakan.",
        "💡 Intuisi: η optimal ≈ 2/kurvatur. Di lembah sempit dan curam (kurvatur besar), langkah harus kecil; di lembah landai dan lebar, boleh besar. Optimizer adaptif (Adam) pada dasarnya menaksir kurvatur per parameter dan menyesuaikan langkah masing-masing — itulah mengapa ia lebih toleran terhadap pilihan η.",
        "💡 Intuisi: loss yang turun lalu tiba-tiba NaN hampir selalu LR terlalu besar atau data korup (NaN di input), bukan arsitektur rusak. Cek dua hal itu dulu — butuh 10 menit, bukan dua minggu.",
        "Cara membaca: sumbu X = langkah training, sumbu Y = loss; tiga kurva = tiga learning rate (legenda kanan atas).",
        "Interpretasi: kurva kecil (LR kecil) turun tapi lambat — kehabisan anggaran; kurva pas turun cepat dan stabil; kurva besar memantul liar lalu meledak. Pilih yang pas: η terbesar yang masih stabil.",
      ],
      formula: String.raw`\theta \leftarrow \theta - \eta\,\nabla_\theta L`,
      formulaNote: "θ (theta) = semua parameter model; η (eta) = learning rate; ∇L = gradien loss terhadap parameter (arah tercuram naiknya loss). Tanda minus = melangkah berlawanan arah naik = menuruni lembah.",
      figure: {
        svg: LR_SVG,
        alt: "Tiga kurva loss: learning rate kecil turun lambat, pas turun cepat, besar meledak.",
        caption: "Nasib training ditentukan η: kecil = lambat, pas = cepat-stabil, besar = divergen.",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Latih 10 langkah dengan lr=0.01, simpan `w_kecil`" },
        { id: "t2", text: "Latih 10 langkah dengan lr=0.1, simpan `w_pas`" },
        { id: "t3", text: "Latih 10 langkah dengan lr=1.5, simpan `w_besar`" },
      ],
      expected: "lr_kecil=0.5488  lr_pas=2.6779  lr_besar=-3069.0",
      note: {
        title: "🚨 Mitos: learning rate lebih besar = training lebih cepat",
        type: "pitfall",
        body: "Yang benar: lebih besar hanya lebih cepat sampai batas stabilitas (η < 2/kurvatur). Lewat batas, tiap langkah melompati lembah dan loss meledak — bukan lebih cepat, melainkan gagal total. Kecepatan sejati datang dari η terbesar yang masih stabil, bukan η terbesar.",
      },
      hints: [
        "Fungsi latih(lr) sudah disediakan di bagian terkunci.",
        "Panggil dengan tiga nilai lr berbeda.",
        "w_kecil = latih(0.01)",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(6)\n\ndef latih(lr, langkah=10):\n    w = 0.0\n    for _ in range(langkah):\n        w = w - lr * 2*(w - 3)  # f(w) = (w-3)^2, gradien = 2(w-3)\n    return w\n\n# TULIS KODEMU\nw_kecil = \nw_pas = \nw_besar = \n\nprint(f"lr_kecil={w_kecil:.4f}  lr_pas={w_pas:.4f}  lr_besar={w_besar:.1f}")`,
        lockLines: 8,
        solution: `import numpy as np\nnp.random.seed(6)\n\ndef latih(lr, langkah=10):\n    w = 0.0\n    for _ in range(langkah):\n        w = w - lr * 2*(w - 3)  # f(w) = (w-3)^2, gradien = 2(w-3)\n    return w\n\n# TULIS KODEMU\nw_kecil = latih(0.01)\nw_pas = latih(0.1)\nw_besar = latih(1.5)\n\nprint(f"lr_kecil={w_kecil:.4f}  lr_pas={w_pas:.4f}  lr_besar={w_besar:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w_kecil", value: 0.5488, tol: 0.001, label: "`w_kecil` sekitar 0.5488", msg: "latih(0.01): 10 langkah kecil, baru sampai 0.5488." },
          { kind: "equal", task: "t2", name: "w_pas", value: 2.6779, tol: 0.001, label: "`w_pas` sekitar 2.6779", msg: "latih(0.1): hampir sampai target 3." },
          { kind: "equal", task: "t3", name: "w_besar", value: -3069.0, tol: 1.0, label: "`w_besar` seharusnya -3069.0", msg: "latih(1.5): divergen ke -3069. Itulah harga langkah terlalu besar." },
          { kind: "stdout_matches", task: "t3", pattern: "lr_kecil=0\\.5488\\s+lr_pas=2\\.6779\\s+lr_besar=-3069\\.0", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "θ ← θ − η∇L. η kecil = lambat, η pas = cepat, η > batas = divergen.",
    },
    {
      id: "adam",
      eyebrow: "Langkah 3 · Optimizer",
      title: "SGD vs Adam: pejalan kaki vs pemandu gunung",
      prose: [
        "SGD (stochastic gradient descent): θ ← θ − η·g, dengan g = gradien dari satu mini-batch. Sederhana, jujur, tetapi satu η untuk semua parameter — parameter yang gradiennya jarang update (fitur langka) tertinggal, yang sering update melompat-lompat.",
        "Adam memberi tiap parameter pemandu pribadi: m = rata-rata bergerak gradien (momentum: ingat arah kemarin, redam zig-zag), v = rata-rata bergerak gradien kuadrat (taksir kurvatur: langkah kecil di lereng curam, besar di landai). Update: θ ← θ − η·m̂/(√v̂ + ε), dengan koreksi bias m̂ = m/(1−β₁ᵗ), v̂ = v/(1−β₂ᵗ). Satu langkah di lab: g=0,5, η=0,01 → Adam: w=0,9900; SGD: w=0,9950. Adam melangkah dua kali SGD di langkah pertama karena koreksi biasnya.",
        "Kapan siapa menang? Adam: default yang aman untuk hampir semua kasus — toleran terhadap η, konvergen cepat. SGD + momentum: sering mencapai generalisasi sedikit lebih baik di visi klasik, tetapi butuh tuning η dan schedule yang cermat. Aturan: mulai Adam; pindah ke SGD hanya bila validasi menunjukkan Adam overfit dan kamu punya waktu tuning.",
        "💡 Intuisi: momentum = bola menggelinding. Tanpa momentum, update zig-zag di lembah sempit (bolak-balik dinding). Dengan momentum, rata-rata arah meredam osilasi dan mempercepat arah konsisten — seperti bola yang makin laju di jalur lurus.",
      ],
      formula: String.raw`m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t, \quad v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2, \quad \theta \leftarrow \theta - \eta\,\frac{\hat{m}_t}{\sqrt{\hat{v}_t}+\epsilon}`,
      formulaNote: "m = momentum (rata-rata gradien); v = rata-rata gradien kuadrat (penaksir kurvatur); β₁=0,9, β₂=0,999 (default); m̂, v̂ = versi koreksi-bias (dibagi 1−βᵗ); ε=1e−8 pencegah bagi-nol. Tiap parameter punya m,v sendiri.",
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Satu langkah Adam (t=1): hitung `w_adam` dari w0=1.0" },
        { id: "t2", text: "Satu langkah SGD: hitung `w_sgd` dari w0=1.0" },
      ],
      expected: "w_adam=0.9900  w_sgd=0.9950",
      note: {
        title: "🚨 Mitos: Adam selalu terbaik, tak perlu SGD",
        type: "pitfall",
        body: "Yang benar: Adam konvergen lebih cepat dan toleran, tetapi pada beberapa tugas visi klasik SGD+momentum mencapai generalisasi akhir sedikit lebih baik. Lebih penting: AdamW (Adam dengan weight decay yang benar) ≠ Adam klasik — memakai Adam biasa dengan L2 justru salah implementasi regularisasi. Pilih AdamW sebagai default modern.",
      },
      hints: [
        "m = (1-b1)*g; v = (1-b2)*g^2 (karena m0=v0=0).",
        "m_hat = m/(1-b1); v_hat = v/(1-b2).",
        "w_adam = 1.0 - lr*m_hat/(sqrt(v_hat)+eps)",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(6)\n\ng, lr = 0.5, 0.01\nb1, b2, eps = 0.9, 0.999, 1e-8\n\n# TULIS KODEMU: satu langkah Adam (t=1) dan SGD, w0 = 1.0\nm = \nv = \nm_hat = \nv_hat = \nw_adam = \nw_sgd = \n\nprint(f"w_adam={w_adam:.4f}  w_sgd={w_sgd:.4f}")`,
        lockLines: 5,
        solution: `import numpy as np\nnp.random.seed(6)\n\ng, lr = 0.5, 0.01\nb1, b2, eps = 0.9, 0.999, 1e-8\n\n# TULIS KODEMU: satu langkah Adam (t=1) dan SGD, w0 = 1.0\nm = (1-b1)*g\nv = (1-b2)*g**2\nm_hat = m/(1-b1)\nv_hat = v/(1-b2)\nw_adam = 1.0 - lr*m_hat/(np.sqrt(v_hat)+eps)\nw_sgd = 1.0 - lr*g\n\nprint(f"w_adam={w_adam:.4f}  w_sgd={w_sgd:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w_adam", value: 0.99, tol: 1e-4, label: "`w_adam` seharusnya 0.9900", msg: "Koreksi bias membuat langkah pertama Adam penuh: 1.0 - 0.01 = 0.99." },
          { kind: "equal", task: "t2", name: "w_sgd", value: 0.995, tol: 1e-9, label: "`w_sgd` seharusnya 0.9950", msg: "1.0 - 0.01x0.5 = 0.995." },
          { kind: "stdout_matches", task: "t2", pattern: "w_adam=0\\.9900\\s+w_sgd=0\\.9950", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Adam: momentum + kurvatur per parameter. Default aman; AdamW untuk regularisasi benar.",
    },
    {
      id: "schedule-reg",
      eyebrow: "Langkah 4 · Schedule & regularisasi",
      title: "Jadwal LR dan rem overfitting",
      prose: [
        "Learning rate schedule: η besar di awal (jelajah cepat), kecil di akhir (mendarat presisi). Cosine annealing: η_t = η_min + ½(η_max−η_min)(1+cos(πt/T)) — meluruh mulus mengikuti kosinus dari η_max ke η_min selama T langkah. Step decay: bagi η dengan 10 tiap beberapa epoch — kasar tapi efektif. Warmup: mulai η kecil lalu naikkan — mencegah ledakan di awal saat bobot masih acak.",
        "Regularisasi melawan overfitting (model menghafal training): weight decay (L2) menghukum bobot besar — preferensi untuk solusi sederhana; dropout mematikan acak 20–50% neuron tiap batch — memaksa network tidak bergantung pada satu neuron (ensemble implisit); early stopping menghentikan training saat loss validasi naik — rem paling murah dan paling jujur.",
        "Urutan pertahanan yang benar: (1) data lebih banyak / augmentasi; (2) early stopping + validasi; (3) weight decay; (4) dropout; (5) model lebih kecil. Kebanyakan orang melompat ke (4) padahal (1) memberi hasil terbesar.",
        "💡 Intuisi: training vs overfitting adalah tarik-menambang antara menghafal dan menggeneralisasi. Gap train-val yang melebar = model mulai menghafal. Jangan lawan dengan arsitektur dulu — lawan dengan data dan rem.",
      ],
      note: {
        title: "💡 Intuisi: NaN = panik yang tidak perlu",
        body: "Loss NaN hampir selalu DUA penyebab: LR terlalu besar ATAU data korup (NaN/inf di input). Urutan cek: (1) turunkan LR 10x, coba 10 iterasi; (2) cek data (ada NaN?). JANGAN ganti arsitektur dulu — 90 persen NaN selesai di langkah 1–2. Arsitektur diganti = 2 hari; LR diturunkan = 2 menit. Cek yang murah dulu, selalu.",
      },
      tasks: [],
      reference: "Schedule: besar dulu, kecil kemudian. Rem overfitting: data > early stopping > decay > dropout.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: setup training apa?",
      prose: [
        "Skenario 1 — Mulai proyek baru, belum tahu apa-apa. → AdamW, lr 1e-3–3e-4, batch 32–128, cosine schedule. Alasan: default modern yang paling toleran; 80% kasus langsung jalan.",
        "Skenario 2 — Visi klasik, data besar, waktu tuning ada. → SGD + momentum 0,9, lr 0,1, step decay. Alasan: literatur menunjukkan generalisasi akhir sedikit lebih baik; harga = tuning manual.",
        "Skenario 3 — Loss NaN di awal training. → Turunkan lr 10× + warmup 500 langkah + cek NaN di data. Alasan: ledakan awal = langkah terlalu besar saat bobot acak; warmup menaikkan η perlahan.",
        "Skenario 4 — Train loss turun, val loss naik (overfitting). → Early stopping + augmentasi + weight decay 1e-4, naikkan hanya bila perlu. Alasan: urutan pertahanan — data dan rem dulu, arsitektur terakhir.",
        "Skenario 5 — Training lambat, GPU menganggur. → Naikkan batch size (atur lr ∝ batch: linear scaling rule) + mixed precision (DLE8). Alasan: GPU lapar data; batch kecil = GPU menunggu.",
        "Aturan praktis 10 detik: (1) AdamW + cosine = default; (2) NaN → lr/10 + warmup; (3) overfit → data & rem; (4) log semua hiperparameter — training yang tidak ter-reproduksi = eksperimen yang tidak terjadi.",
      ],
      note: {
        title: "💡 Intuisi: Adam untuk lari, SGD untuk finis",
        body: "Pola industri: Adam untuk eksplorasi CEPAT (konvergen cepat, tuning sedikit), lalu SGD+momentum untuk AKHIR (sering 0,5–1 poin lebih baik). Analoginya: Adam = pemandu gunung (cepat sampai basecamp), SGD = pendaki teliti (puncak lebih tepat). Jika waktu mepet: Adam saja. Jika akurasi kritis: finis dengan SGD.",
      },
      tasks: [],
      reference: "Default: AdamW + cosine. NaN: lr/10. Overfit: data dulu. Log semuanya.",
    },
    {
      id: "minicase-schedule",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Jadwal kosinus 10 epoch: berapa lr di tengah jalan?",
      prose: [
        "Kamu menjalankan training 10 epoch: lr_max 0,1, lr_min 0,001, cosine annealing. Seorang rekan bertanya: berapa lr di epoch 0, 5, dan 10? Jawaban ini menentukan apakah schedule-mu masuk akal — lr tengah yang terlalu tinggi berarti model belum mendarat saat training selesai.",
        "Hitung: η_t = 0,001 + 0,5×0,099×(1+cos(πt/10)). t=0: cos(0)=1 → 0,1. t=5: cos(π/2)=0 → 0,0505. t=10: cos(π)=−1 → 0,001. Kurva meluruh mulus: cepat di awal, presisi di akhir — tanpa patahan step decay yang bisa mengguncang training.",
        "Pembahasan: cosine memberi penurunan bertahap yang ramah untuk AdamW. Bila rekanmu memakai step decay (bagi 10 di epoch 5 dan 8), training-nya mengalami dua guncangan mendadak — kadang membantu (keluar dari lembah sempit), kadang merusak momentum. Pilihan schedule = pilihan filosofi pendaratan.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `lr0`, `lr5`, `lr10` dengan cosine annealing" },
      ],
      expected: "lr0=0.1  lr5=0.0505  lr10=0.001",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai lr konstan sepanjang training lalu heran kenapa loss mentok di akhir. Tanpa peluruhan, langkah di akhir terlalu besar untuk mendarat presisi — model bergetar di sekitar optimum tanpa pernah sampai. Schedule bukan opsional untuk hasil terbaik.",
      },
      hints: [
        "lr_t = lr_min + 0.5*(lr_max-lr_min)*(1+cos(pi*t/T)).",
        "Gunakan np.cos dan np.pi.",
        "lr5 = 0.001 + 0.5*0.099*(1+np.cos(np.pi*5/10))",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(6)\n\nlr_max, lr_min, T = 0.1, 0.001, 10\n\n# TULIS KODEMU: cosine annealing di t = 0, 5, 10\nlr0 = \nlr5 = \nlr10 = \n\nprint(f"lr0={lr0}  lr5={lr5:.4f}  lr10={lr10}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(6)\n\nlr_max, lr_min, T = 0.1, 0.001, 10\n\n# TULIS KODEMU: cosine annealing di t = 0, 5, 10\nlr0 = lr_min + 0.5*(lr_max-lr_min)*(1+np.cos(np.pi*0/T))\nlr5 = lr_min + 0.5*(lr_max-lr_min)*(1+np.cos(np.pi*5/T))\nlr10 = lr_min + 0.5*(lr_max-lr_min)*(1+np.cos(np.pi*10/T))\n\nprint(f"lr0={lr0}  lr5={lr5:.4f}  lr10={lr10}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lr0", value: 0.1, tol: 1e-9, label: "`lr0` seharusnya 0.1", msg: "Di t=0, cos(0)=1 -> lr = lr_max." },
          { kind: "equal", task: "t1", name: "lr5", value: 0.0505, tol: 1e-4, label: "`lr5` seharusnya 0.0505", msg: "Di t=5, cos(pi/2)=0 -> titik tengah 0.0505." },
          { kind: "equal", task: "t1", name: "lr10", value: 0.001, tol: 1e-9, label: "`lr10` seharusnya 0.001", msg: "Di t=10, cos(pi)=-1 -> lr = lr_min." },
          { kind: "stdout_matches", task: "t1", pattern: "lr0=0\\.1\\s+lr5=0\\.0505\\s+lr10=0\\.001", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Cosine: lr_min + 0.5*(max-min)*(1+cos(pi*t/T)). Mulus dari max ke min.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang optimizer, schedule, dan regularisasi.",
      ],
      tasks: [],
      summary: [
        "θ ← θ − η∇L: η kecil = lambat, pas = cepat-stabil, lewat batas = divergen.",
        "Adam = momentum + penaksir kurvatur per parameter; default aman, AdamW untuk decay yang benar.",
        "Momentum meredam zig-zag; koreksi bias Adam membuat langkah awal penuh.",
        "Schedule: besar di awal, kecil di akhir (cosine/step); warmup mencegah ledakan awal.",
        "Lawan overfitting berurutan: data/augmentasi → early stopping → weight decay → dropout.",
      ],
      next: { label: "DLE7 — Transfer Learning & Pretraining", href: "/v2/learn/dle7-transfer" },
      quiz: [
        {
          q: "Loss turun lalu tiba-tiba NaN di epoch awal. Langkah pertama?",
          options: [
            { text: "Ganti arsitektur", why: "Terlalu mahal untuk gejala yang 90% disebabkan dua hal sederhana." },
            { text: "Turunkan lr 10× + cek NaN di data", why: "Ledakan awal = langkah terlalu besar saat bobot acak, atau input korup — cek 10 menit.", correct: true },
            { text: "Tambah data", why: "Data tidak menyebabkan NaN mendadak." },
            { text: "Naikkan batch size", why: "Batch tidak terkait ledakan gradien." },
          ],
        },
        {
          q: "Peran momentum (m) dalam Adam?",
          options: [
            { text: "Mengurangi jumlah parameter", why: "Momentum tidak mengubah arsitektur." },
            { text: "Rata-rata arah gradien: meredam zig-zag, mempercepat arah konsisten", why: "Seperti bola menggelinding: osilasi dinding lembah saling meniadakan.", correct: true },
            { text: "Menggantikan learning rate", why: "Learning rate tetap ada sebagai pengali global." },
            { text: "Menghapus overfitting", why: "Itu tugas regularisasi, bukan optimizer." },
          ],
        },
        {
          q: "Train loss turun, val loss naik. Urutan pertahanan yang benar?",
          options: [
            { text: "Langsung kecilkan model", why: "Arsitektur adalah pilihan terakhir, bukan pertama." },
            { text: "Data/augmentasi → early stopping → weight decay → dropout", why: "Dari yang memberi hasil terbesar dan termurah ke yang lebih invasif.", correct: true },
            { text: "Naikkan learning rate", why: "Itu mempercepat, bukan mengatasi overfitting." },
            { text: "Training lebih lama", why: "Itu memperparah hafalan." },
          ],
        },
        {
          q: "Cosine annealing dengan lr_max 0,1, lr_min 0,001, T=10. lr di t=5?",
          options: [
            { text: "0,1", why: "Itu nilai di t=0." },
            { text: "0,0505", why: "cos(π/2)=0 → titik tengah: 0,001+0,5×0,099.", correct: true },
            { text: "0,001", why: "Itu nilai di t=10." },
            { text: "0,05", why: "Lupa lr_min 0,001: 0,001+0,0495=0,0505." },
          ],
        },
        {
          q: "Kapan SGD+momentum dipilih atas Adam?",
          options: [
            { text: "Tidak pernah", why: "Ada kasus valid: generalisasi akhir sedikit lebih baik di visi klasik." },
            { text: "Bila validasi menunjukkan Adam overfit dan ada waktu tuning", why: "SGD butuh tuning lr/schedule cermat; bayar mahal hanya bila terbukti worth it.", correct: true },
            { text: "Selalu, karena lebih sederhana", why: "Kesederhanaan tidak mengalahkan hasil; Adam default yang lebih toleran." },
            { text: "Hanya untuk data kecil", why: "Ukuran data bukan penentunya; perilaku generalisasi yang menentukan." },
          ],
        },
      ],
    },
  ],
};
