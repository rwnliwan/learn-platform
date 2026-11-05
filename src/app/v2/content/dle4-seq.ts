import type { V2Lesson } from "../lib/types";

// RNN di-unroll: 3 langkah waktu, hidden state mengalir dan menyusut.
const UNROLL_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="RNN di-unroll tiga langkah: hidden state mengalir dari h0 ke h3 sambil membawa input.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="30" y="150" width="90" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/><text x="75" y="176" fill="var(--text)">x1 = 0,5</text>
<rect x="235" y="150" width="90" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/><text x="280" y="176" fill="var(--text)">x2 = −0,2</text>
<rect x="440" y="150" width="90" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/><text x="485" y="176" fill="var(--text)">x3 = 0,8</text>
<rect x="105" y="40" width="90" height="52" rx="10" fill="var(--c1)" opacity="0.9"/><text x="150" y="62" fill="#fff" font-weight="600">h1</text><text x="150" y="80" fill="#fff" font-size="11">0,422</text>
<rect x="310" y="40" width="90" height="52" rx="10" fill="var(--c1)" opacity="0.7"/><text x="355" y="62" fill="#fff" font-weight="600">h2</text><text x="355" y="80" fill="#fff" font-size="11">0,115</text>
<rect x="470" y="40" width="70" height="52" rx="10" fill="var(--c1)" opacity="0.9"/><text x="505" y="62" fill="#fff" font-weight="600">h3</text><text x="505" y="80" fill="#fff" font-size="11">0,664</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ah2)">
<defs><marker id="ah2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="75" y1="150" x2="130" y2="92"/><line x1="280" y1="150" x2="335" y2="92"/><line x1="485" y1="150" x2="505" y2="92"/>
<line x1="195" y1="66" x2="310" y2="66"/><line x1="400" y1="66" x2="470" y2="66"/>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text-muted)" text-anchor="middle">
<text x="252" y="58">W_hh = 0,7: ingatan dikali 0,7 tiap langkah</text>
<text x="280" y="225">informasi x1 mencapai h3 setelah dikali 0,7 dua kali → tinggal setengahnya</text>
</g>
</svg>`;

export const dle4: V2Lesson = {
  slug: "dle4-seq",
  track: "Deep Learning Engineer",
  module: "Fondasi",
  title: "DLE4 — Sequence: dari RNN ke Transformer",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-npl",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model yang lupa krisis 1998",
      prose: [
        "Tim risiko bank melatih RNN untuk memprediksi NPL dari deret 60 bulan indikator makro. Di training (2010–2019, masa tenang) akurasinya bagus. Saat diuji pada skenario stres yang menyerupai 1998 — lonjakan suku bunga di awal deret — model memprediksi NPL tetap rendah. Ia tidak melihat krisisnya.",
        "Investigasi: RNN membaca deret bulan per bulan, membawa satu vektor ingatan (hidden state). Setiap langkah, ingatan lama dikalikan bobot 0,7 lalu ditambah input baru. Setelah 20 langkah, jejak bulan pertama tinggal 0,7²⁰ ≈ 0,0008 — praktis nol. Modelnya tidak bodoh; ia dirancang untuk lupa. Krisis di bulan ke-1 sudah terhapus saat prediksi dibuat di bulan ke-60.",
        "Twist-nya: kegagalan ini bukan bug, melainkan sifat matematis RNN. Dan solusinya — attention — lahir dari pertanyaan sederhana: mengapa ingatan harus antre lewat satu vektor sempit, kalau setiap posisi bisa bicara langsung dengan posisi lain? Lesson ini menelusuri kegagalan RNN sampai ke akarnya, lalu membuka pintu ke Transformer.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa RNN melupakan masa lalu (vanishing gradient); (2) membandingkan RNN, LSTM, dan Transformer untuk data deret waktu; (3) menghitung “ingatan efektif” model untuk deret 60 bulan; (4) memilih arsitektur sekuens yang tepat untuk kasus NPL-mu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model sekuens yang lupa tail event di awal deret = risiko model sistemik. Stress test harus menaruh guncangan di awal sekuens, bukan hanya di akhir — di situlah ingatan model diuji.",
      },
      reference: "RNN = ingatan yang bocor tiap langkah. Pahami kebocorannya sebelum percaya prediksinya.",
    },
    {
      id: "rnn",
      eyebrow: "Langkah 2 · RNN",
      title: "RNN: pencerita yang membaca satu kata per detik",
      prose: [
        "RNN memproses sekuens x₁, x₂, ..., x_T satu per satu, membawa hidden state h_t sebagai ingatan: h_t = tanh(W_xh·x_t + W_hh·h_{t−1} + b). Tiga suku: input baru (W_xh·x_t), ingatan lama yang dibawa (W_hh·h_{t−1}), dan bias. Tanh memampatkan ke (−1, 1) agar nilai tidak meledak.",
        "Bobotnya dipakai ulang di semua langkah (seperti weight sharing di CNN, tapi sepanjang waktu). Artinya: RNN yang sama bekerja untuk sekuens 10 maupun 1.000 langkah — elegan, tetapi juga berarti satu bobot W_hh menentukan nasib ingatan di semua jarak waktu.",
        "Contoh dari lab: x = [0,5, −0,2, 0,8], W_xh = 0,9, W_hh = 0,7. h₁ = tanh(0,45) = 0,4219 — ingatan hanya berisi x₁. h₂ = tanh(−0,18 + 0,2953) = 0,1148 — x₁ sudah dikali 0,7. h₃ = tanh(0,72 + 0,0804) = 0,6642. Perhatikan: kontribusi x₁ ke h₃ telah dikali 0,7² = 0,49 — tinggal setengahnya setelah dua langkah.",
        "💡 Intuisi: hidden state adalah leher botol. Seluruh masa lalu — 60 bulan data makro — dipaksa muat dalam satu vektor beberapa ratus angka. Informasi yang tidak muat, hilang. Inilah harga dari memproses sekuens secara berurutan.",
        "💡 Intuisi: tanh bukan hiasan. Tanpa fungsi pemampat, perkalian berulang W_hh akan meledak atau menyusut tak terkendali dalam belasan langkah. Tanh menjaga nilai tetap di (−1,1) — tetapi ia juga yang membuat gradien menyusut (langkah 3).",
        "Cara membaca: kotak bawah = input tiap langkah (x1, x2, x3); kotak biru = hidden state h1 ke h2 ke h3; panah horizontal = ingatan dikali W_hh = 0,7 tiap langkah.",
        "Interpretasi: nilai di kotak biru menyusut sebelum naik lagi oleh input baru — visual dari ingatan yang bocor. Inilah mengapa x1 hampir tidak terdengar di h3.",
      ],
      formula: String.raw`\mathbf{h}_t = \tanh(\mathbf{W}_{xh}\mathbf{x}_t + \mathbf{W}_{hh}\mathbf{h}_{t-1} + \mathbf{b})`,
      formulaNote: "h_t = ingatan di langkah t; x_t = input langkah t; W_xh = bobot input→ingatan; W_hh = bobot ingatan→ingatan (dipakai ulang tiap langkah); b = bias; tanh = pemampat ke (−1,1). h_0 biasanya vektor nol.",
      figure: {
        svg: UNROLL_SVG,
        alt: "RNN di-unroll: hidden state mengalir h1 ke h3, tiap langkah dikali bobot ingatan 0,7.",
        caption: "RNN di-unroll: ingatan mengalir maju, tetapi dikali W_hh = 0,7 di setiap langkah — bocor secara eksponensial.",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Unroll RNN 3 langkah, simpan ingatan akhir di `h`" },
        { id: "t2", text: "Cetak `h` dengan 4 desimal" },
      ],
      expected: "h_akhir=0.6642",
      note: {
        title: "🚨 Mitos: RNN mengingat seperti manusia",
        type: "pitfall",
        body: "Yang benar: ingatan RNN adalah vektor angka yang dikali bobot < 1 tiap langkah — ia meluruh eksponensial, bukan memudar seperti memori manusia. Praktisnya, RNN standar hanya efektif untuk dependensi < 10 langkah. Untuk ingatan puluhan–ratusan langkah, butuh LSTM/GRU atau attention.",
      },
      hints: [
        "Mulai h = 0.0, lalu loop tiap x di x_seq.",
        "Tiap langkah: h = tanh(0.9*x + 0.7*h).",
        "Gunakan np.tanh; cetak dengan :.4f",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(4)\n\nx_seq = [0.5, -0.2, 0.8]\nW_xh, W_hh, b = 0.9, 0.7, 0.0\n\n# TULIS KODEMU: unroll RNN 3 langkah\nh = 0.0\n\n\nprint(f"h_akhir={h:.4f}")`,
        lockLines: 5,
        solution: `import numpy as np\nnp.random.seed(4)\n\nx_seq = [0.5, -0.2, 0.8]\nW_xh, W_hh, b = 0.9, 0.7, 0.0\n\n# TULIS KODEMU: unroll RNN 3 langkah\nh = 0.0\nfor x in x_seq:\n    h = np.tanh(W_xh*x + W_hh*h + b)\n\nprint(f"h_akhir={h:.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "h", label: "`h` terdefinisi", msg: "Simpan ingatan akhir di variabel h." },
          { kind: "equal", task: "t1", name: "h", value: 0.6642, tol: 0.001, label: "`h` sekitar 0.6642", msg: "h = tanh(0.9x + 0.7h) tiga kali dari h=0. Jangan lupa tanh tiap langkah." },
          { kind: "stdout_matches", task: "t2", pattern: "h_akhir=0\\.6642", label: "`print` menampilkan h", msg: "Format: h_akhir=0.6642." },
        ],
      },
      reference: "h_t = tanh(W_xh x_t + W_hh h_{t-1} + b). Unroll = loop biasa.",
    },
    {
      id: "vanishing",
      eyebrow: "Langkah 3 · Gradien hilang",
      title: "Vanishing gradient: kabar dari masa lalu yang tak sampai",
      prose: [
        "Training RNN butuh gradien loss terhadap W_hh yang melewati semua langkah waktu — backprop through time. Gradien dari langkah t ke langkah t−k dikalikan (W_hh · tanh′) sebanyak k kali. Karena |tanh′| ≤ 1 (maksimum 1, tipikal 0,25), faktor per langkah biasanya < 1. Kalikan 50 kali: 0,9⁵⁰ ≈ 0,0052 — gradien dari 50 langkah lalu praktis nol. Network tidak bisa belajar dependensi sejauh itu, bukan karena tidak mau, melainkan karena sinyalnya mati di jalan.",
        "Sisi sebaliknya: bila faktor > 1, gradien meledak — 1,1⁵⁰ ≈ 117,4 — update bobot melompat liar dan loss menjadi NaN. Inilah dua penyakit RNN: vanishing (lupa yang jauh) dan exploding (belajar tidak stabil). Gradient clipping (memotong gradien bila normanya > ambang) adalah perban standar untuk exploding; untuk vanishing, perbannya bernama LSTM/GRU: gerbang yang memutuskan apa yang disimpan dan apa yang dibuang.",
        "LSTM menambah cell state — jalur ingatan terpisah yang mengalir nyaris tanpa dikali bobot (gradiennya ≈ 1, bukan 0,9). GRU menyederhanakannya dengan dua gerbang. Keduanya memperpanjang ingatan efektif dari ~10 menjadi ~100 langkah. Tetapi keduanya tetap memproses berurutan dan tetap memaksa masa lalu lewat leher botol.",
      ],
      formula: String.raw`\frac{\partial L}{\partial \mathbf{h}_{t-k}} \;\propto\; \prod_{j=1}^{k} \mathbf{W}_{hh}\,\mathrm{diag}\!\left(1 - \tanh^2(\cdot)\right)`,
      formulaNote: "Gradien dari k langkah lalu = perkalian k faktor (bobot ingatan × turunan tanh). Tiap faktor < 1 → hasil menyusut eksponensial terhadap k. Inilah rumus matematis dari lupa.",
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `f_hilang` = faktor gradien setelah 50 langkah (basis 0,9)" },
        { id: "t2", text: "Hitung `f_meledak` = faktor gradien setelah 50 langkah (basis 1,1)" },
      ],
      expected: "f_hilang=0.0052  f_meledak=117.4",
      note: {
        title: "🚨 Mitos: tambah lapisan RNN bikin ingatan lebih panjang",
        type: "pitfall",
        body: "Yang benar: menumpuk lapisan RNN menambah kapasitas per langkah, bukan jangkauan ingatan — gradien tetap harus menempuh k langkah waktu dan tetap menyusut eksponensial. Ingatan panjang butuh arsitektur berbeda (gerbang LSTM atau attention), bukan RNN yang lebih dalam.",
      },
      hints: [
        "Faktor = basis dipangkatkan jumlah langkah.",
        "f_hilang = 0.9**50, cetak 4 desimal.",
        "f_meledak = 1.1**50, cetak 1 desimal.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(4)\n\n# TULIS KODEMU: faktor gradien setelah 50 langkah waktu\nf_hilang = \nf_meledak = \n\nprint(f"f_hilang={f_hilang:.4f}  f_meledak={f_meledak:.1f}")`,
        lockLines: 2,
        solution: `import numpy as np\nnp.random.seed(4)\n\n# TULIS KODEMU: faktor gradien setelah 50 langkah waktu\nf_hilang = 0.9**50\nf_meledak = 1.1**50\n\nprint(f"f_hilang={f_hilang:.4f}  f_meledak={f_meledak:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "f_hilang", value: 0.0052, tol: 0.001, label: "`f_hilang` sekitar 0.0052", msg: "0.9^50 = 0.0052. Gradien 50 langkah lalu tinggal 0,5%." },
          { kind: "equal", task: "t2", name: "f_meledak", value: 117.4, tol: 0.5, label: "`f_meledak` sekitar 117.4", msg: "1.1^50 = 117.4. Gradien meledak 117x lipat." },
          { kind: "stdout_matches", task: "t2", pattern: "f_hilang=0\\.0052\\s+f_meledak=117\\.4", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Faktor k langkah = basis^k. <1 = hilang, >1 = meledak.",
    },
    {
      id: "attention-teaser",
      eyebrow: "Langkah 4 · Jalan keluar",
      title: "Attention: mengapa antre kalau bisa bicara langsung?",
      prose: [
        "Attention memutus antrean. Alih-alih memaksa informasi bulan ke-1 merangkak lewat 59 hidden state, setiap posisi boleh langsung melihat semua posisi lain dan memilih mana yang penting — dengan bobot. Krisis 1998 di awal deret bisa diperhatikan langsung oleh prediksi di akhir, tanpa dikali 0,7 lima puluh sembilan kali.",
        "Harganya: kompleksitas O(n²) — tiap dari n posisi membandingkan dengan n posisi lain. Untuk deret 60 bulan, 3.600 perbandingan: murah. Untuk dokumen 100 ribu token, 10 miliar: mahal. Inilah tradeoff fundamental attention: ingatan sempurna dengan biaya kuadratik.",
        "💡 Intuisi: RNN = telepon berantai (pesan berubah tiap diteruskan); attention = rapat (semua bicara langsung). Telepon berantai murah untuk pesan pendek; rapat mahal tapi tidak ada pesan yang hilang. Pilih sesuai panjang sekuensmu.",
        "💡 Intuisi: LSTM/GRU adalah evolusi, Transformer adalah revolusi. Gerbang LSTM memperbaiki kebocoran; attention menghapus kebutuhan akan ingatan berantai sama sekali. Itulah mengapa setelah 2017, hampir semua SOTA sekuens memakai attention.",
      ],
      note: {
        title: "💡 Intuisi: kabar jauh butuh jalan tol",
        body: "Vanishing gradient = kabar dari 60 bulan lalu “menguap” sebelum sampai ke keputusan hari ini. LSTM = jalan tol berpintu (gerbang selektif); attention = telepon langsung (tak peduli jarak). Pilih berdasarkan JARAK ketergantungan: <50 langkah = LSTM cukup; ratusan = attention. Jangan bayar jalan tol untuk perjalanan 5 menit.",
      },
      tasks: [],
      reference: "Attention = akses langsung antar posisi, biaya O(n²). Detail penuh di DLE5.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: arsitektur sekuens apa?",
      prose: [
        "Skenario 1 — Sekuens pendek (< 50 langkah), data kecil (deret 36 bulan NPL). → LSTM/GRU 1–2 lapis. Alasan: ingatan cukup, biaya O(n) murah, tidak butuh data raksasa seperti Transformer.",
        "Skenario 2 — Sekuens panjang dengan dependensi jauh (dokumen, genomik). → Transformer. Alasan: satu-satunya arsitektur yang gradiennya tidak meluruh terhadap jarak — attention menghubungkan langsung.",
        "Skenario 3 — Streaming real-time (sensor, trading tick). → RNN/LSTM atau TCN kausal. Alasan: Transformer butuh seluruh sekuens sekaligus; RNN memproses satu per satu dengan memori konstan — cocok untuk aliran tak berujung.",
        "Skenario 4 — Data sekuens kecil (< 10 ribu sampel). → Jangan Transformer dari nol; pakai pretrained atau LSTM kecil. Alasan: attention O(n²) dengan parameter besar = overfitting instan pada data kecil.",
        "Skenario 5 — Butuh kecepatan training maksimal. → Transformer (paralel penuh) mengalahkan RNN (berurutan) telak di GPU. Alasan: GPU membenci antrean; attention menghitung semua posisi sekaligus.",
        "Aturan praktis 10 detik: (1) sekuens < 50 & data kecil → LSTM; (2) butuh ingatan jauh → Transformer; (3) streaming → RNN/TCN; (4) selalu tanya: apakah dependensi jauhnya nyata, atau hanya khayalan? Buktikan dengan ablation.",
      ],
      note: {
        title: "💡 Intuisi: deret pendek jangan Transformer",
        body: "Transformer untuk deret 60 bulan = memakai truk kontainer untuk belanja mingguan: BISA, tetapi overhead attention O(n^2) + butuh data BANYAK. Aturan praktis: n<100 = LSTM/GRU; n>500 = Transformer; di antaranya = uji keduanya. Arsitektur = fungsi dari PANJANG sekuens, bukan dari hype.",
      },
      tasks: [],
      reference: "Panjang sekuens + ukuran data + streaming/tidak = tiga penentu pilihan.",
    },
    {
      id: "minicase-deret",
      eyebrow: "Langkah 6 · Mini-case",
      title: "60 bulan data, ingatan tinggal berapa?",
      prose: [
        "Kamu mengevaluasi proposal model NPL: RNN dengan bobot ingatan efektif 0,95 per bulan, deret 60 bulan. Pertanyaannya: setelah berapa bulan jejak guncangan awal tinggal di bawah 1%? Jawabannya menentukan apakah model ini layak untuk stress test krisis.",
        "Hitung: cari k terkecil sehingga 0,95ᵏ < 0,01. k = 90 bulan — lebih panjang dari deret 60 bulan! Artinya dalam setting ini ingatan tidak hilang total, tetapi di bulan ke-60 faktornya 0,95⁶⁰ ≈ 0,046: guncangan awal hanya bersuara 4,6% dari kekuatan aslinya. Cukup untuk memengaruhi, tidak cukup untuk diandalkan.",
        "Pembahasan: inilah cara mengaudit klaim ingatan model secara kuantitatif — jangan percaya arsitekturnya, hitung faktor peluruhannya. Keputusan: untuk stress test krisis 1998-an, minta LSTM (gerbang menjaga faktor ≈ 1) atau attention; RNN polos ditolak untuk horizon 60 bulan.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Cari `k` terkecil sehingga 0.95**k < 0.01" },
        { id: "t2", text: "Hitung `sisa` = 0.95**60 (4 desimal)" },
      ],
      expected: "k=90  sisa=0.0461",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira ingatan hilang total atau utuh — padahal ia meluruh halus. Audit yang benar menghitung faktor peluruhan, bukan menebak. 0,95⁶⁰ = 0,0461: bukan nol, bukan satu — angka inilah yang harus masuk dokumen risiko model.",
      },
      hints: [
        "Naikkan k dari 1 sampai syarat terpenuhi (loop while).",
        "sisa = 0.95**60.",
        "while 0.95**k >= 0.01: k += 1",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(4)\n\nbasis = 0.95\n\n# TULIS KODEMU\nk = 1\n\nsisa = \n\nprint(f"k={k}  sisa={sisa:.4f}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(4)\n\nbasis = 0.95\n\n# TULIS KODEMU\nk = 1\nwhile basis**k >= 0.01:\n    k += 1\n\nsisa = basis**60\n\nprint(f"k={k}  sisa={sisa:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "k", value: 90, tol: 1e-9, label: "`k` seharusnya 90", msg: "0.95^89 = 0.0104 (masih >= 0.01); 0.95^90 = 0.0099 < 0.01." },
          { kind: "equal", task: "t2", name: "sisa", value: 0.0461, tol: 0.001, label: "`sisa` sekitar 0.0461", msg: "0.95^60 = 0.0461." },
          { kind: "stdout_matches", task: "t2", pattern: "k=90\\s+sisa=0\\.0461", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Faktor peluruhan = basis^langkah. Cari k saat ia < ambang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang RNN, gradien, dan jalan keluarnya.",
      ],
      tasks: [],
      summary: [
        "RNN: h_t = tanh(W_xh·x_t + W_hh·h_{t−1} + b); bobot dipakai ulang tiap langkah.",
        "Hidden state = leher botol: seluruh masa lalu dipaksa muat dalam satu vektor.",
        "Gradien k langkah lalu ∝ basisᵏ: < 1 = vanishing, > 1 = exploding.",
        "LSTM/GRU memakai gerbang agar faktor gradien ≈ 1; ingatan efektif ~100 langkah.",
        "Attention menghapus antrean: akses langsung antar posisi dengan biaya O(n²).",
      ],
      next: { label: "DLE5 — Transformer Mendalam", href: "/v2/learn/dle5-transformer" },
      quiz: [
        {
          q: "RNN dengan W_hh efektif 0,9. Berapa sisa gradien dari 50 langkah lalu?",
          options: [
            { text: "0,9", why: "Itu faktor satu langkah, bukan 50 langkah." },
            { text: "≈ 0,005", why: "0,9⁵⁰ ≈ 0,0052 — sinyal dari 50 langkah lalu praktis hilang.", correct: true },
            { text: "50 × 0,9 = 45", why: "Faktornya dikali berulang (pangkat), bukan dijumlah." },
            { text: "Tetap 1", why: "Hanya LSTM dengan gerbang terbuka yang mendekati 1." },
          ],
        },
        {
          q: "Mengapa menumpuk lapisan RNN tidak memanjangkan ingatan?",
          options: [
            { text: "Karena GPU tidak cukup", why: "Bukan masalah hardware." },
            { text: "Gradien tetap menempuh k langkah waktu dan menyusut eksponensial", why: "Kedalaman menambah kapasitas per langkah, bukan memperpendek jarak waktu yang harus ditempuh gradien.", correct: true },
            { text: "Karena tanh tidak bisa ditumpuk", why: "Tanh bisa ditumpuk; masalahnya perkalian berulang terhadap waktu." },
            { text: "Lapisan tambahan selalu membantu", why: "Membantu kapasitas, bukan jangkauan ingatan." },
          ],
        },
        {
          q: "Keunggulan utama LSTM atas RNN polos?",
          options: [
            { text: "Lebih sedikit parameter", why: "LSTM justru punya ~4× parameter per unit (gerbang-gerbangnya)." },
            { text: "Cell state memberi jalur gradien ≈ 1 melewati waktu", why: "Gerbang mengatur apa disimpan/dibuang; jalur lurus cell state mencegah peluruhan eksponensial.", correct: true },
            { text: "Tidak butuh training", why: "Tetap butuh training; hanya lebih mampu belajar dependensi jauh." },
            { text: "Bisa paralel penuh", why: "LSTM tetap berurutan; paralel penuh adalah keunggulan Transformer." },
          ],
        },
        {
          q: "Tradeoff fundamental attention?",
          options: [
            { text: "Akurasi vs kecepatan training", why: "Bukan tradeoff utamanya." },
            { text: "Ingatan sempurna antar posisi vs biaya komputasi O(n²)", why: "Tiap posisi membandingkan dengan semua posisi: tidak ada yang hilang, tetapi mahal kuadratik.", correct: true },
            { text: "Butuh GPU vs bisa CPU", why: "Keduanya bisa di keduanya; bedanya skala biaya." },
            { text: "Tidak ada tradeoff", why: "O(n²) adalah harga nyata untuk sekuens sangat panjang." },
          ],
        },
        {
          q: "Untuk streaming sensor real-time tak berujung, pilihan terbaik?",
          options: [
            { text: "Transformer besar", why: "Butuh seluruh sekuens sekaligus; tidak cocok untuk aliran tak berujung." },
            { text: "RNN/LSTM kausal", why: "Memproses satu per satu dengan memori konstan — ideal untuk streaming.", correct: true },
            { text: "MLP", why: "MLP tidak punya konsep urutan waktu." },
            { text: "CNN 2D", why: "Untuk citra, bukan aliran sekuens tak berujung." },
          ],
        },
      ],
    },
  ],
};
