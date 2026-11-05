import type { V2Lesson } from "../lib/types";

// Satu neuron: jumlah berbobot -> bias -> aktivasi -> output.
const NEURON_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Diagram satu neuron: dua input masuk ke lingkaran neuron, keluar satu output.">
<g font-family="var(--font-ui)" font-size="13">
<circle cx="70" cy="70" r="26" fill="var(--bg-panel)" stroke="var(--c1)" stroke-width="2"/><text x="70" y="75" text-anchor="middle" fill="var(--text)">x1</text>
<circle cx="70" cy="170" r="26" fill="var(--bg-panel)" stroke="var(--c1)" stroke-width="2"/><text x="70" y="175" text-anchor="middle" fill="var(--text)">x2</text>
<circle cx="300" cy="120" r="52" fill="var(--c1)" opacity="0.9"/>
<text x="300" y="112" text-anchor="middle" fill="#fff" font-size="12">z = w1x1+w2x2+b</text>
<text x="300" y="132" text-anchor="middle" fill="#fff" font-size="12">a = σ(z)</text>
<circle cx="490" cy="120" r="26" fill="var(--bg-panel)" stroke="var(--c4)" stroke-width="2"/><text x="490" y="125" text-anchor="middle" fill="var(--text)">ŷ</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ah)">
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="96" y1="70" x2="252" y2="105"/><line x1="96" y1="170" x2="252" y2="138"/><line x1="352" y1="120" x2="464" y2="120"/>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text-muted)">
<text x="150" y="72">w1 = 0,8</text><text x="150" y="168">w2 = −0,4</text>
<text x="300" y="200" text-anchor="middle">bias b = 0,1 menggeser ambang keputusan</text>
<text x="300" y="220" text-anchor="middle">σ = sigmoid: memetakan z ke peluang (0, 1)</text>
</g>
</svg>`;

export const dle2: V2Lesson = {
  slug: "dle2-nn",
  track: "Deep Learning Engineer",
  module: "Fondasi",
  title: "DLE2 — Neural Network: Forward & Backprop",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-whiteboard",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Satu neuron yang salah hitung, satu kredit yang salah lolos",
      prose: [
        "Rina, analis risiko, mempresentasikan model skor kredit barunya ke komite: sebuah neural network mungil, dua fitur (rasio utang, riwayat telat), satu hidden layer. Seorang anggota komite — mantan dosen matematika — meminta Rina menghitung forward pass satu nasabah secara manual di whiteboard.",
        "Rina menulis: z = 0,8×0,5 + (−0,4)×(−0,3) + 0,1 = 0,62 ... lalu berhenti. Ia lupa menerapkan sigmoid di hidden layer sebelum lanjut ke lapisan berikut. Angka yang ia laporkan ke komite — 0,71, di atas ambang 0,5, kredit disetujui — ternyata 0,63 setelah dihitung dengan benar. Masih di atas ambang, tapi komite membatalkan persetujuan hari itu juga.",
        "Twist-nya: bukan angkanya yang menyelamatkan Rina, melainkan keberaniannya menghitung manual. Neural network bukan kotak hitam yang magis — ia hanya aritmetika berlapis yang bisa kamu telusuri dengan kalkulator. Lesson ini memberimu kemampuan itu: membaca forward pass seperti membaca laporan keuangan, dan memahami backprop sebagai akuntansi kesalahan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regulator (OJK/Basel) menuntut model yang explainable. Engineer yang bisa menelusuri forward pass per neuron bisa menjelaskan keputusan model ke auditor — yang hanya bisa memanggil .predict() tidak bisa.",
      },
      reference: "Forward pass = aritmetika berlapis yang bisa ditelusuri manual. Kuasai itu dulu.",
    },
    {
      id: "forward",
      eyebrow: "Langkah 2 · Forward pass",
      title: "Forward pass: uang mengalir, kesalahan menumpuk",
      prose: [
        "Satu neuron melakukan tiga hal: (1) jumlah berbobot z = w₁x₁ + w₂x₂ + ... + b — setiap fitur dikalikan pentingnya (bobot), lalu bias menggeser ambang; (2) fungsi aktivasi a = σ(z) — memampatkan z menjadi rentang bermakna, mis. peluang 0–1 untuk sigmoid; (3) meneruskan a ke lapisan berikut. Tumpuk neuron → lapisan; tumpuk lapisan → network.",
        "Dalam notasi matriks untuk satu lapisan: z = Wx + b, a = σ(z). Di sini W = matriks bobot (baris = neuron tujuan, kolom = neuron asal), x = vektor input, b = vektor bias, σ = aktivasi yang dipakai elemen-per-elemen. Forward pass = menerapkan rumus ini berulang dari input ke output.",
        "Contoh langkah-demi-langkah (jaringan 2-2-1 di lab): x = [0,5, −0,3]. Lapisan 1: z₁ = xW₁ + b₁ = [0,41, −0,67]; a₁ = sigmoid = [0,6011, 0,3385]. Lapisan 2: z₂ = a₁W₂ + b₂ = 0,5344; ŷ = sigmoid(0,5344) = 0,6305. Setiap angka di antaranya bisa kamu verifikasi dengan kalkulator — tidak ada magis.",
        "💡 Intuisi: bias adalah suara default neuron. Tanpa bias, garis keputusan dipaksa lewat titik nol — seperti memaksa semua nasabah dinilai dari nol rupiah. Bias memberi neuron kebebasan memilih ambangnya sendiri.",
        "💡 Intuisi: fungsi aktivasi adalah satu-satunya sumber kelengkungan. Tanpa σ, sepuluh lapisan linear runtuh menjadi satu lapisan linear — network sedalam apa pun hanya regresi linear yang mahal.",
        "Cara membaca: dua lingkaran kiri = input x1, x2; panah berlabel w1, w2 = bobot; lingkaran besar tengah = neuron (jumlah berbobot + bias, lalu sigmoid); lingkaran kanan = output ŷ.",
        "Interpretasi: diagram ini adalah rumus z = Wx + b, a = σ(z) dalam bentuk gambar. Setiap panah adalah perkalian, setiap lingkaran adalah penjumlahan + aktivasi — tidak ada yang disembunyikan.",
      ],
      formula: String.raw`\mathbf{z} = \mathbf{W}\mathbf{x} + \mathbf{b}, \qquad \mathbf{a} = \sigma(\mathbf{z})`,
      formulaNote: "W = matriks bobot, x = vektor input lapisan, b = vektor bias, σ = fungsi aktivasi (mis. sigmoid σ(z) = 1/(1+e^(−z))). Output a menjadi input lapisan berikut.",
      figure: {
        svg: NEURON_SVG,
        alt: "Diagram satu neuron: input x1, x2 dikali bobot, ditambah bias, dilewatkan sigmoid menjadi output.",
        caption: "Anatomi satu neuron: timbang, geser (bias), mampatkan (aktivasi).",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Implementasikan forward pass 2 lapis, simpan di `y_hat`" },
        { id: "t2", text: "Cetak `y_hat` dengan 4 desimal" },
      ],
      expected: "y_hat=0.6305",
      note: {
        title: "🚨 Mitos: bias itu opsional, yang penting bobotnya",
        type: "pitfall",
        body: "Yang benar: tanpa bias, setiap neuron dipaksa punya ambang di nol. Pada data yang tidak terpusat di nol (hampir semua data nyata), network tanpa bias harus mengkompensasi dengan bobot yang aneh — training lebih sulit dan sering macet. Selalu sertakan bias kecuali ada alasan matematis eksplisit.",
      },
      hints: [
        "z1 = X @ W1 + b1, lalu a1 = sigmoid(z1).",
        "Ulangi untuk lapisan 2: z2 = a1 @ W2 + b2.",
        "y_hat = sigmoid(z2)[0, 0]; cetak y_hat dengan :.4f",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(2)\n\nX  = np.array([[0.5, -0.3]])\nW1 = np.array([[0.8, -0.4], [0.3, 0.9]])\nb1 = np.array([0.1, -0.2])\nW2 = np.array([[1.2], [-0.7]])\nb2 = np.array([0.05])\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# TULIS KODEMU: forward pass 2 lapis\nz1 = \na1 = \nz2 = \ny_hat = \n\nprint(f"y_hat={y_hat:.4f}")`,
        lockLines: 11,
        solution: `import numpy as np\nnp.random.seed(2)\n\nX  = np.array([[0.5, -0.3]])\nW1 = np.array([[0.8, -0.4], [0.3, 0.9]])\nb1 = np.array([0.1, -0.2])\nW2 = np.array([[1.2], [-0.7]])\nb2 = np.array([0.05])\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# TULIS KODEMU: forward pass 2 lapis\nz1 = X @ W1 + b1\na1 = sigmoid(z1)\nz2 = a1 @ W2 + b2\ny_hat = sigmoid(z2)[0, 0]\n\nprint(f"y_hat={y_hat:.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "y_hat", label: "`y_hat` terdefinisi", msg: "Simpan hasil forward pass di variabel y_hat." },
          { kind: "equal", task: "t1", name: "y_hat", value: 0.6305, tol: 0.001, label: "`y_hat` sekitar 0.6305", msg: "Urutan: z1 -> a1=sigmoid(z1) -> z2 -> y_hat=sigmoid(z2). Jangan lewatkan sigmoid di tengah." },
          { kind: "stdout_matches", task: "t2", pattern: "y_hat=0\\.6305", label: "`print` menampilkan y_hat", msg: "Format: y_hat=0.6305 (4 desimal)." },
        ],
      },
      reference: "z = Wx + b; a = σ(z). Ulangi per lapisan. Sigmoid: 1/(1+e^-z).",
    },
    {
      id: "backprop",
      eyebrow: "Langkah 3 · Backprop",
      title: "Backprop: akuntansi kesalahan dari belakang",
      prose: [
        "Forward pass menjawab: dengan bobot ini, prediksinya apa? Backprop menjawab pertanyaan sebaliknya: bobot mana yang paling bersalah atas kesalahan ini, dan ke arah mana harus digeser? Ia memakai aturan rantai kalkulus: kesalahan di output ditelusuri mundur, lapisan per lapisan, dikalikan turunan tiap fungsi yang dilewati.",
        "Untuk satu bobot w: ∂L/∂w = (∂L/∂a) · (∂a/∂z) · (∂z/∂w) — tiga faktor: seberapa sensitif loss terhadap aktivasi, seberapa sensitif aktivasi terhadap jumlah berbobot, seberapa sensitif jumlah berbobot terhadap w (yang terakhir ini sederhana: = x, inputnya). Kalikan ketiganya, kamu dapat arah koreksi. Lalu w ← w − η·∂L/∂w dengan η = learning rate.",
        "Sebelum percaya implementasi backprop-mu, lakukan gradient check: bandingkan turunan analitik dengan turunan numerik [f(w+h) − f(w−h)] / 2h. Untuk f(w) = w³ − 2w di w = 1,5: analitik 3w² − 2 = 4,75; numerik ≈ 4,7500. Cocok empat desimal = implementasimu benar. Satu langkah gradient descent dengan η = 0,1: w = 1,5 − 0,1×4,75 = 1,025.",
        "💡 Intuisi: backprop bukan algoritma pintar — ia hanya aturan rantai yang diorganisasi efisien. Kepintarannya ada pada reuse: turunan tiap lapisan dihitung sekali lalu dipakai semua bobot di lapisan itu. Tanpa reuse, training network dalam butuh waktu eksponensial.",
        "💡 Intuisi: gradient check hanya untuk debugging, bukan untuk training. Ia butuh dua forward pass per parameter — untuk 100 ribu parameter = 200 ribu forward pass per cek. Pakai sekali untuk validasi, lalu matikan.",
      ],
      formula: String.raw`\frac{\partial L}{\partial w} = \frac{\partial L}{\partial a}\cdot\frac{\partial a}{\partial z}\cdot\frac{\partial z}{\partial w}, \qquad w \leftarrow w - \eta\,\frac{\partial L}{\partial w}`,
      formulaNote: "L = loss (ukuran kesalahan); a = aktivasi; z = jumlah berbobot; w = satu bobot; η (eta) = learning rate, seberapa besar langkah koreksi. Tiga faktor kiri adalah aturan rantai: kesalahan dirambatkan mundur.",
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `grad_analitik` dari f(w) = w³ − 2w di w = 1,5" },
        { id: "t2", text: "Hitung `grad_numerik` dengan central difference (h = 1e-5)" },
        { id: "t3", text: "Satu langkah GD: `w_baru` dengan learning rate 0,1" },
      ],
      expected: "grad_analitik=4.75  grad_numerik=4.7500  w_baru=1.025",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai turunan aktivasi yang salah — paling klasik: turunan sigmoid ditulis σ(z) padahal yang benar σ(z)(1−σ(z)), atau lupa bahwa turunan ReLU di z<0 adalah 0 sehingga neuron mati tidak pernah pulih. Satu turunan salah = seluruh backprop salah arah. Gradient check ada untuk menangkap ini.",
      },
      hints: [
        "Turunan w^3 adalah 3w^2; turunan -2w adalah -2.",
        "Central difference: (f(w+h) - f(w-h)) / (2*h).",
        "w_baru = w - 0.1 * grad_analitik",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(2)\n\nw = 1.5\nh = 1e-5\n\ndef f(t):\n    return t**3 - 2*t\n\n# TULIS KODEMU\ngrad_analitik = \ngrad_numerik = \nw_baru = \n\nprint(f"grad_analitik={grad_analitik}  grad_numerik={grad_numerik:.4f}  w_baru={w_baru}")`,
        lockLines: 8,
        solution: `import numpy as np\nnp.random.seed(2)\n\nw = 1.5\nh = 1e-5\n\ndef f(t):\n    return t**3 - 2*t\n\n# TULIS KODEMU\ngrad_analitik = 3*w**2 - 2\ngrad_numerik = (f(w+h) - f(w-h)) / (2*h)\nw_baru = w - 0.1 * grad_analitik\n\nprint(f"grad_analitik={grad_analitik}  grad_numerik={grad_numerik:.4f}  w_baru={w_baru}")`,
        checks: [
          { kind: "equal", task: "t1", name: "grad_analitik", value: 4.75, tol: 1e-9, label: "`grad_analitik` seharusnya 4.75", msg: "f'(w) = 3w^2 - 2; di w=1.5: 3x2.25 - 2 = 4.75." },
          { kind: "equal", task: "t2", name: "grad_numerik", value: 4.75, tol: 1e-4, label: "`grad_numerik` sekitar 4.75", msg: "(f(w+h) - f(w-h)) / (2h). Harus cocok dengan analitik." },
          { kind: "equal", task: "t3", name: "w_baru", value: 1.025, tol: 1e-9, label: "`w_baru` seharusnya 1.025", msg: "1.5 - 0.1 x 4.75 = 1.025." },
          { kind: "stdout_matches", task: "t3", pattern: "grad_analitik=4\\.75\\s+grad_numerik=4\\.7500\\s+w_baru=1\\.025", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Aturan rantai: kalikan turunan tiap tahap mundur. Gradient check = (f(w+h)-f(w-h))/2h.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: seberapa dalam, aktivasi apa?",
      prose: [
        "Skenario 1 — Data tabel, hubungan kira-kira linear. → 0 hidden layer (regresi logistik) atau 1 hidden layer kecil. Alasan: kapasitas berlebih hanya menambah variansi; mulai dari yang paling sederhana dan naikkan bila underfit terbukti di validasi.",
        "Skenario 2 — Batas keputusan jelas non-linear (XOR, interaksi fitur). → 1–2 hidden layer, aktivasi ReLU. Alasan: satu hidden layer cukup secara teori (universal approximation), dua lapis memberi efisiensi parameter. ReLU murah dan anti-saturasi.",
        "Skenario 3 — Output peluang kalibrasi untuk skor kredit. → Sigmoid di output + cross-entropy loss. Alasan: sigmoid memetakan ke (0,1) yang bisa dibaca sebagai peluang; cross-entropy menghukum kesalahan peluang secara tepat. Jangan pakai MSE untuk klasifikasi.",
        "Skenario 4 — Regresi nilai kontinu (estimasi loss). → Linear di output (tanpa aktivasi) + MSE. Alasan: aktivasi di output regresi memotong rentang prediksi — sigmoid tidak akan pernah memprediksi di atas 1.",
        "Skenario 5 — Network dalam (> 5 lapis) tidak kunjung belajar. → Cek inisialisasi (He untuk ReLU), normalisasi input, lalu pertimbangkan residual/skip connection. Alasan: gradien menyusut tiap lapisan; inisialisasi yang salah = sinyal mati sebelum sampai.",
        "Aturan praktis 10 detik: (1) mulai dari arsitektur terkecil yang masuk akal; (2) ReLU untuk hidden, sigmoid/softmax/linear untuk output sesuai tugas; (3) cross-entropy untuk klasifikasi, MSE untuk regresi; (4) bila dalam dan macet, salahkan inisialisasi dan skala input dulu, bukan kedalaman.",
      ],
      note: {
        title: "💡 Intuisi: tanpa aktivasi, kedalaman = ilusi",
        body: "Sepuluh lapisan LINEAR runtuh menjadi SATU lapisan linear (perkalian matriks beruntun = satu matriks). Satu-satunya sumber kelengkungan = fungsi aktivasi non-linear. Karena itu: (1) jangan pernah lupa aktivasi antar lapisan; (2) kedalaman tanpa non-linearitas = regresi linear yang mahal. Cek arsitekturmu: ada sigma di tiap lapisan tersembunyi?",
      },
      tasks: [],
      reference: "ReLU = hidden default. Output: sigmoid biner, softmax multi-kelas, linear regresi.",
    },
    {
      id: "minicase-skor",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Persetujuan kredit Rp 50 juta dalam satu neuron",
      prose: [
        "Komite memintamu mensimulasikan satu neuron keputusan: z = 0,9×rasio_bayar − 0,6×telat_bayar + 0,2, lalu peluang = sigmoid(z). Nasabah A: rasio_bayar 0,7 (70% tagihan dibayar tepat waktu), telat_bayar 0,4 (40% cicilan pernah telat). Ambang persetujuan: peluang ≥ 0,5.",
        "Hitung: z = 0,9×0,7 − 0,6×0,4 + 0,2 = 0,63 − 0,24 + 0,2 = 0,59. Peluang = 1/(1+e^(−0,59)) = 0,6434. Di atas 0,5 → setujui. Sekarang uji sensitivitasmu: bila telat_bayar naik ke 0,9, z = 0,63 − 0,54 + 0,2 = 0,29 → peluang 0,5720, masih lolos tapi tipis. Satu fitur buruk tidak langsung membunuh — bobot −0,6 memberi hukuman proporsional.",
        "Pembahasan: inilah yang dimaksud explainable — kamu bisa menunjuk exactly angka mana yang mendorong keputusan. Bandingkan dengan model 12 lapis: menjelaskan satu keputusan butuh menelusuri ribuan jalur. Untuk keputusan kredit yang diaudit, ketertelusuran ini bernilai lebih dari 2 poin AUC.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `z` untuk nasabah A" },
        { id: "t2", text: "Hitung `peluang` = sigmoid(z), 4 desimal" },
        { id: "t3", text: "Hitung `peluang2` bila telat_bayar = 0,9, 4 desimal" },
      ],
      expected: "peluang=0.6434  peluang2=0.5720",
      note: {
        title: "🚨 Mitos: makin kompleks makin akurat, jadi pakai yang kompleks",
        type: "pitfall",
        body: "Yang benar: untuk keputusan yang diaudit (kredit, asuransi, rekrutmen), model sederhana yang bisa dijelaskan per-keputusan sering mengalahkan model kompleks — bukan di AUC, tapi di kelolosan audit dan kepercayaan komite. Akurasi tanpa explainability = risiko regulasi.",
      },
      hints: [
        "z = 0.9*rasio - 0.6*telat + 0.2.",
        "sigmoid(z) = 1/(1+exp(-z)).",
        "Hitung ulang z dengan telat=0.9 untuk peluang2.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(2)\n\nrasio, telat = 0.7, 0.4\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# TULIS KODEMU: z, peluang, lalu peluang2 dengan telat=0.9\nz = \npeluang = \npeluang2 = \n\nprint(f"peluang={peluang:.4f}  peluang2={peluang2:.4f}")`,
        lockLines: 7,
        solution: `import numpy as np\nnp.random.seed(2)\n\nrasio, telat = 0.7, 0.4\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# TULIS KODEMU: z, peluang, lalu peluang2 dengan telat=0.9\nz = 0.9*rasio - 0.6*telat + 0.2\npeluang = sigmoid(z)\npeluang2 = sigmoid(0.9*rasio - 0.6*0.9 + 0.2)\n\nprint(f"peluang={peluang:.4f}  peluang2={peluang2:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "z", value: 0.59, tol: 1e-9, label: "`z` seharusnya 0.59", msg: "0.9x0.7 - 0.6x0.4 + 0.2 = 0.59." },
          { kind: "equal", task: "t2", name: "peluang", value: 0.6434, tol: 0.001, label: "`peluang` sekitar 0.6434", msg: "sigmoid(0.59) = 0.6434." },
          { kind: "equal", task: "t3", name: "peluang2", value: 0.572, tol: 0.001, label: "`peluang2` sekitar 0.5720", msg: "sigmoid(0.29) = 0.5720." },
          { kind: "stdout_matches", task: "t3", pattern: "peluang=0\\.6434\\s+peluang2=0\\.5720", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "z = jumlah berbobot + bias; peluang = sigmoid(z); ambang 0.5.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang forward pass dan backprop. Perhatikan jebakan turunan aktivasi.",
      ],
      note: {
        title: "💡 Intuisi: backprop = akuntansi kesalahan",
        body: "Backprop bukan sihir: ia aturan rantai kalkulus + akuntansi — setiap bobot “disalahkan” proporsional dengan kontribusinya pada error. Intuisi ini menjelaskan SEMUA: vanishing gradient (kesalahan “menguap” di lapisan awal), perlunya LR kecil di awal, dan mengapa inisialisasi penting. Kuasai akuntansinya, dan 80 persen misteri training hilang.",
      },
      tasks: [],
      summary: [
        "Forward pass: z = Wx + b, a = σ(z), diulang per lapisan — aritmetika yang bisa ditelusuri manual.",
        "Bias memberi neuron kebebasan memilih ambang; tanpanya garis keputusan dipaksa lewat nol.",
        "Aktivasi satu-satunya sumber kelengkungan; tanpa σ, network dalam = regresi linear mahal.",
        "Backprop = aturan rantai yang diorganisasi efisien; reuse turunan per lapisan membuatnya feasible.",
        "Gradient check memvalidasi implementasi (numerik vs analitik); hanya untuk debugging, bukan training.",
      ],
      next: { label: "DLE3 — CNN untuk Citra", href: "/v2/learn/dle3-cnn" },
      quiz: [
        {
          q: "Mengapa bias penting dalam neuron?",
          options: [
            { text: "Agar training lebih cepat di GPU", why: "Kecepatan GPU tidak terkait bias." },
            { text: "Tanpa bias, ambang keputusan dipaksa lewat nol", why: "Bias menggeser z sehingga neuron bebas memilih ambangnya — krusial untuk data tak terpusat di nol.", correct: true },
            { text: "Bias menggantikan fungsi aktivasi", why: "Bias menggeser, aktivasi melengkungkan — dua peran berbeda." },
            { text: "Bias tidak penting", why: "Justru sebaliknya: menghilangkannya merusak fleksibilitas model." },
          ],
        },
        {
          q: "Network 10 lapis tanpa fungsi aktivasi setara dengan?",
          options: [
            { text: "Regresi linear satu lapis", why: "Komposisi fungsi linear tetap linear — kedalaman tanpa σ tidak menambah kapasitas.", correct: true },
            { text: "Network 10 lapis dengan ReLU", why: "ReLU menambah kelengkungan; tanpanya tidak ada yang dipelajari selain linear." },
            { text: "Decision tree", why: "Tree mempartisi ruang secara non-linear; linear tidak bisa." },
            { text: "Tidak bisa disederhanakan", why: "Bisa: perkalian matriks beruntun runtuh menjadi satu matriks." },
          ],
        },
        {
          q: "Gradient check (numerik vs analitik) cocok menunjukkan 4,75 vs 4,7500. Kesimpulan?",
          options: [
            { text: "Implementasi backprop benar", why: "Kecocokan empat desimal = turunan analitik (termasuk turunan aktivasi) sudah tepat.", correct: true },
            { text: "Model sudah optimal", why: "Gradient check memvalidasi kebenaran turunan, bukan kualitas model." },
            { text: "Learning rate sudah tepat", why: "Learning rate tidak diuji oleh gradient check." },
            { text: "Harus dijalankan tiap epoch", why: "Terlalu mahal (2 forward pass per parameter); cukup sekali saat debugging." },
          ],
        },
        {
          q: "Dalam ∂L/∂w = (∂L/∂a)·(∂a/∂z)·(∂z/∂w), faktor ∂z/∂w sama dengan?",
          options: [
            { text: "Input x dari koneksi itu", why: "z = ... + wx + ..., sehingga turunan z terhadap w adalah x.", correct: true },
            { text: "Learning rate", why: "Learning rate dipakai setelah gradien didapat, bukan bagiannya." },
            { text: "Nilai loss", why: "Loss sudah diwakili faktor ∂L/∂a." },
            { text: "Bobot w itu sendiri", why: "Itu terjadi pada regularisasi L2, bukan pada z linear." },
          ],
        },
        {
          q: "Kesalahan paling klasik saat mengimplementasikan backprop manual?",
          options: [
            { text: "Salah urutan lapisan", why: "Itu kesalahan forward pass, mudah terlihat dari dimensi." },
            { text: "Turunan fungsi aktivasi yang salah", why: "Mis. sigmoid ditulis σ(z) bukan σ(z)(1−σ(z)) — seluruh gradien salah arah secara halus.", correct: true },
            { text: "Lupa mengacak data", why: "Itu masalah training, bukan kesalahan turunan." },
            { text: "Batch terlalu kecil", why: "Itu pilihan hiperparameter, bukan bug implementasi." },
          ],
        },
      ],
    },
  ],
};
