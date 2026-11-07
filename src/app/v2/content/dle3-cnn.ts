import type { V2Lesson } from "../lib/types";

// Konvolusi: kernel 3x3 digeser di atas citra 5x5, posisi pertama disorot.
const CONV_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Kernel 3x3 digeser di atas citra 5x5 menghasilkan satu nilai output.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="130" y="18" fill="var(--text)" font-size="13" font-weight="600">Citra 5x5</text>
<text x="430" y="18" fill="var(--text)" font-size="13" font-weight="600">Kernel 3x3 (Sobel-X)</text>
</g>
<g font-family="var(--font-mono)" font-size="10" text-anchor="middle">
<rect x="40" y="30" width="180" height="180" fill="none" stroke="var(--border)"/>
<rect x="40" y="30" width="108" height="108" fill="var(--c1)" opacity="0.28" stroke="var(--c1)" stroke-width="2"/>
<text x="94" y="92" fill="var(--text)" font-size="13">3x3</text>
<rect x="370" y="30" width="108" height="108" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="424" y="66" fill="var(--text)">-1 0 1</text><text x="424" y="88" fill="var(--text)">-2 0 2</text><text x="424" y="110" fill="var(--text)">-1 0 1</text>
<text x="424" y="140" fill="var(--text-muted)" font-size="11">Sobel-X</text>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text-muted)">
<text x="130" y="232" text-anchor="middle">jendela 3x3 pertama → satu angka output</text>
<text x="424" y="160" text-anchor="middle">bobot dipelajari,</text>
<text x="424" y="176" text-anchor="middle">dipakai ulang di semua posisi</text>
</g>
<g font-family="var(--font-ui)" font-size="13">
<rect x="250" y="90" width="70" height="40" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="285" y="115" text-anchor="middle" fill="#fff" font-weight="600">= 2</text>
<text x="200" y="115" text-anchor="end" fill="var(--text-muted)">Σ(piksel×bobot)</text>
</g>
</svg>`;

export const dle3: V2Lesson = {
  slug: "dle3-cnn",
  track: "Deep Learning Engineer",
  module: "Fondasi",
  title: "DLE3 — CNN untuk Citra",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-ktp",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model 99% akurat yang tidak melihat wajah sama sekali",
      prose: [
        "Bank meluncurkan verifikasi e-KTP otomatis: foto selfie vs foto KTP, CNN, akurasi validasi 99%. Tim merayakan. Tiga bulan kemudian audit menemukan: model hampir tidak memakai fitur wajah. Ia memakai watermark biru di sudut foto KTP — pola yang selalu ada di dokumen asli dan tidak ada di fotokopian.",
        "Saat format KTP digital baru tanpa watermark diluncurkan, akurasi anjlok ke 61%. Modelnya tidak bodoh — ia cerdas dengan cara yang salah: menemukan jalan pintas termudah menuju loss kecil. Fenomena ini punya nama: Clever Hans, dari kuda yang tampak bisa berhitung padahal membaca bahasa tubuh penontonnya.",
        "Twist-nya: 99% akurasi justru sinyal bahaya bila kamu tidak tahu apa yang dipelajari model. CNN belajar pola lokal — dan pola lokal termudah sering bukan yang kamu maksud. Lesson ini: cara kerja konvolusi, dan cara memastikan ia melihat hal yang benar.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan konvolusi dan weight sharing dengan kata-katamu sendiri; (2) menghitung penghematan parameter CNN vs fully-connected; (3) memilih kapan memakai CNN dan seberapa besar arsitekturnya; (4) mendiagnosis model yang akurat tetapi “tidak melihat” fitur yang benar (Clever Hans).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Shortcut learning adalah risiko model: performa validasi tinggi, performa produksi anjlok saat jalan pintasnya hilang. Mitigasinya: uji di data yang jalan pintasnya dihapus, dan visualisasikan apa yang dilihat filter.",
      },
      reference: "Akurasi tinggi tanpa pemahaman = Clever Hans. Selalu tanya: apa yang sebenarnya dipelajari?",
    },
    {
      id: "konvolusi",
      eyebrow: "Langkah 2 · Konvolusi",
      title: "Konvolusi: detektor pola yang digeser-geser",
      prose: [
        "Konvolusi mengambil filter kecil (kernel, mis. 3×3) dan menggesernya ke seluruh citra. Di tiap posisi, ia menghitung jumlah dari perkalian elemen-demi-elemen antara jendela citra dan kernel: (I ∗ K)(i,j) = ΣₘΣₙ I(i+m, j+n)·K(m,n). Satu jendela → satu angka output. Geser satu piksel → angka berikutnya. Hasilnya: peta fitur yang menandai di mana pola itu muncul.",
        "Kernel Sobel-X = [[−1,0,1],[−2,0,2],[−1,0,1]] adalah detektor tepi vertikal: ia merespons kuat saat kiri gelap dan kanan terang. Dalam CNN modern, kernel tidak didesain manual — ia dipelajari dari data via backprop. Lapisan awal biasanya menemukan sendiri detektor tepi dan tekstur; lapisan dalam mengombinasikannya menjadi pola objek.",
        "Contoh konkret dari lab: citra 5×5, kernel Sobel-X 3×3, konvolusi valid → peta 3×3. Nilai tengah peta = 5: respons kuat, artinya ada transisi gelap→terang di tengah citra. Nilai negatif = transisi sebaliknya. Peta fitur adalah citra baru yang isinya bukan piksel, melainkan seberapa cocok tiap lokasi dengan pola kernel.",
        "💡 Intuisi: weight sharing adalah alasan CNN hemat. Satu kernel 3×3 = 9 bobot dipakai di semua posisi — dibanding fully-connected yang butuh bobot per posisi per piksel. Asumsinya: pola yang berguna di kiri atas juga berguna di kanan bawah. Untuk citra, asumsi ini hampir selalu benar.",
        "💡 Intuisi: konvolusi = pencocokan pola, bukan sekadar perkalian. Nilai output besar berarti jendela citra mirip kernel. Tumpuk banyak kernel → tiap kernel jadi spesialis satu pola (tepi vertikal, sudut, tekstur).",
        "Cara membaca: kotak kiri = citra 5x5 dengan jendela 3x3 disorot biru; kotak kanan = kernel Sobel-X; panah ke angka 2 artinya jumlah perkalian elemen jendela dengan kernel = 2.",
        "Interpretasi: satu posisi jendela menghasilkan satu angka peta fitur. Geser jendela ke semua posisi = peta lengkap yang menandai di mana pola tepi vertikal muncul.",
      ],
      formula: String.raw`(I * K)(i,j) = \sum_{m}\sum_{n} I(i+m,\, j+n)\; K(m,n)`,
      formulaNote: "I = citra input; K = kernel (filter); (i,j) = posisi jendela; m,n = indeks di dalam kernel. Output di (i,j) = jumlah perkalian elemen jendela citra dengan kernel — ukuran kecocokan pola di posisi itu.",
      figure: {
        svg: CONV_SVG,
        alt: "Kernel 3x3 digeser di atas citra 5x5; satu posisi menghasilkan satu nilai output.",
        caption: "Satu langkah konvolusi: jendela 3×3 × kernel → satu angka di peta fitur.",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Implementasikan konvolusi valid 5x5 * 3x3, simpan di `O`" },
        { id: "t2", text: "Ambil `tengah` = O[1,1] sebagai integer, lalu cetak" },
      ],
      expected: "tengah=5",
      note: {
        title: "🚨 Mitos: filter CNN didesain manual seperti Sobel",
        type: "pitfall",
        body: "Yang benar: Sobel hanya contoh untuk intuisi. Dalam training, kernel diinisialisasi acak lalu dipelajari via backprop — network menemukan sendiri filter yang meminimalkan loss. Jangan menghabiskan waktu mendesain filter manual; habiskan untuk memastikan data dan loss-nya benar.",
      },
      hints: [
        "Output valid berukuran (5-3+1) x (5-3+1) = 3x3.",
        "Tiap O[i,j] = jumlah dari I[i:i+3, j:j+3] * K.",
        "tengah = int(O[1,1])",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(3)\n\nI = np.array([[1,2,0,1,3],\n              [0,1,2,1,0],\n              [2,0,1,2,1],\n              [1,1,0,2,0],\n              [0,2,1,0,1]], dtype=float)\nK = np.array([[-1,0,1],\n              [-2,0,2],\n              [-1,0,1]], dtype=float)  # Sobel-X\n\n# TULIS KODEMU: konvolusi valid -> O berukuran 3x3\nO = np.zeros((3, 3))\n\n\ntengah = int(O[1, 1])\nprint(f"tengah={tengah}")`,
        lockLines: 11,
        solution: `import numpy as np\nnp.random.seed(3)\n\nI = np.array([[1,2,0,1,3],\n              [0,1,2,1,0],\n              [2,0,1,2,1],\n              [1,1,0,2,0],\n              [0,2,1,0,1]], dtype=float)\nK = np.array([[-1,0,1],\n              [-2,0,2],\n              [-1,0,1]], dtype=float)  # Sobel-X\n\n# TULIS KODEMU: konvolusi valid -> O berukuran 3x3\nO = np.zeros((3, 3))\nfor i in range(3):\n    for j in range(3):\n        O[i, j] = np.sum(I[i:i+3, j:j+3] * K)\n\ntengah = int(O[1, 1])\nprint(f"tengah={tengah}")`,
        checks: [
          { kind: "defined", task: "t1", name: "O", label: "`O` terdefinisi", msg: "Buat matriks O berukuran 3x3." },
          { kind: "equal", task: "t2", name: "tengah", value: 5, tol: 1e-9, label: "`tengah` seharusnya 5", msg: "Jumlahkan I[1:4,1:4]*K elemen per elemen. Hasilnya 5." },
          { kind: "stdout_matches", task: "t2", pattern: "tengah=5", label: "`print` menampilkan tengah", msg: "Format: tengah=5." },
        ],
      },
      reference: "Konvolusi valid: geser kernel, jumlahkan perkalian elemen. Output = (n-f+1).",
    },
    {
      id: "pooling-ukuran",
      eyebrow: "Langkah 3 · Pooling & ukuran",
      title: "Pooling: ringkasan yang membuang detail",
      prose: [
        "Pooling memperkecil peta fitur dengan mengambil ringkasan tiap blok — max pooling 2×2 mengambil nilai terbesar dari tiap blok 2×2, mengubah peta 4×4 menjadi 2×2. Tujuannya dua: mengurangi komputasi lapisan berikut, dan memberi sedikit ketahanan translasi (tepi yang bergeser satu piksel tetap terdeteksi).",
        "Ukuran output konvolusi mengikuti rumus: out = ⌊(n + 2p − f)/s⌋ + 1, dengan n = ukuran input, p = padding, f = ukuran filter, s = stride. Contoh: citra 32×32, filter 3×3, padding 1, stride 2 → ⌊(32+2−3)/2⌋+1 = 16. Padding 1 menjaga ukuran saat stride 1 (same convolution); stride 2 membelah ukuran — downsampling murah tanpa pooling.",
        "Cara membaca rumus: (n + 2p − f) = berapa jauh jendela bisa bergeser; dibagi s = berapa langkah diambil; +1 = posisi awal. Salah satu angka ini saja dan dimensi tensor tidak cocok — error paling umum saat merancang CNN manual.",
      ],
      formula: String.raw`\text{out} = \left\lfloor\frac{n + 2p - f}{s}\right\rfloor + 1`,
      formulaNote: "n = ukuran input (satu sisi); p = padding (bingkai nol di tepi); f = ukuran filter; s = stride (langkah geser). Kurung siku bawah = pembulatan ke bawah.",
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `conv_out` untuk n=32, f=3, p=1, s=2" },
        { id: "t2", text: "Hitung `pool_out` untuk max-pool 2x2 pada peta 4x4" },
      ],
      expected: "conv_out=16  pool_out=2",
      note: {
        title: "🚨 Mitos: pooling selalu membantu",
        type: "pitfall",
        body: "Yang benar: pooling membuang informasi lokasi presisi. Untuk klasifikasi itu bagus (tidak peduli kucing di kiri atau kanan), tetapi untuk segmentasi atau deteksi presisi, pooling agresif merusak. Arsitektur modern sering mengganti pooling dengan stride-2 convolution — downsampling yang bobotnya dipelajari, bukan dibuang.",
      },
      hints: [
        "conv_out = (n + 2*p - f)//s + 1.",
        "Pooling 2x2 membagi tiap sisi dengan 2.",
        "conv_out = (32 + 2*1 - 3)//2 + 1",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(3)\n\n# TULIS KODEMU\nconv_out = \npool_out = \n\nprint(f"conv_out={conv_out}  pool_out={pool_out}")`,
        lockLines: 2,
        solution: `import numpy as np\nnp.random.seed(3)\n\n# TULIS KODEMU\nconv_out = (32 + 2*1 - 3)//2 + 1\npool_out = 4//2\n\nprint(f"conv_out={conv_out}  pool_out={pool_out}")`,
        checks: [
          { kind: "equal", task: "t1", name: "conv_out", value: 16, tol: 1e-9, label: "`conv_out` seharusnya 16", msg: "(32+2-3)//2 + 1 = 16." },
          { kind: "equal", task: "t2", name: "pool_out", value: 2, tol: 1e-9, label: "`pool_out` seharusnya 2", msg: "4//2 = 2." },
          { kind: "stdout_matches", task: "t2", pattern: "conv_out=16\\s+pool_out=2", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "out = (n + 2p - f)//s + 1. Pooling 2x2 = bagi sisi dengan 2.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: CNN kapan, sebesar apa?",
      prose: [
        "Skenario 1 — Klasifikasi citra standar (KTP, produk, citra medis), 50 ribu–1 juta gambar. → CNN klasik (ResNet) pretrained, fine-tune. Alasan: pretrained ImageNet memberi detektor tepi-tekstur gratis; 50 ribu gambar cukup untuk adaptasi domain.",
        "Skenario 2 — Citra sangat besar (> 1 juta) atau butuh konteks global (citra satelit). → Vision Transformer. Alasan: tanpa inductive bias lokalitas, ViT butuh data besar — tetapi begitu cukup, ia menangkap dependensi jarak jauh yang CNN butuhkan banyak lapisan untuk menjangkau.",
        "Skenario 3 — Data citra kecil (< 5 ribu), tidak ada pretrained yang cocok. → Jangan CNN dari nol; pakai pretrained terdekat + augmentasi agresif, atau fitur klasik. Alasan: CNN dari nol pada 5 ribu gambar = menghafal; augmentasi (rotasi, crop, flip) melipatgandakan data efektif.",
        "Skenario 4 — Butuh lokasi presisi (deteksi cacat, segmentasi tumor). → Hindari pooling agresif; pakai stride-conv atau arsitektur encoder-decoder (U-Net). Alasan: tiap pooling membuang resolusi lokasi yang tidak bisa dikembalikan.",
        "Skenario 5 — Deploy di HP/edge. → MobileNet/EfficientNet + quantization (DLE10). Alasan: depthwise separable convolution memangkas komputasi ~8× dengan akurasi hampir setara.",
        "Aturan praktis 10 detik: (1) ada pretrained yang mirip? pakai; (2) hitung ukuran tensor tiap blok dengan rumus out — dimensi salah = bug; (3) augmentasi dulu sebelum memperbesar model; (4) curigai akurasi > 98%: cari jalan pintasnya (Clever Hans).",
      ],
      note: {
        title: "💡 Intuisi: weight sharing = asumsi, bukan hukum",
        body: "CNN hemat karena SATU kernel dipakai di semua posisi — asumsi: “pola berguna di kiri atas juga berguna di kanan bawah”. Benar untuk citra alami; SALAH untuk data dengan posisi bermakna (misal citra medis di mana kiri vs kanan = organ berbeda!). Jika asumsinya salah, CNN buta. Tanyakan selalu: apakah posisi benar-benar tidak penting di dataku?",
      },
      tasks: [],
      reference: "Pretrained dulu, augmentasi kedua, arsitektur ketiga. Curigai akurasi terlalu bagus.",
    },
    {
      id: "minicase-cacat",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Deteksi cacat: 896 vs 98.336 parameter",
      prose: [
        "Pabrik meminta sistem deteksi cacat pada citra produk 32×32 RGB. Dua proposal: (A) lapisan konvolusi 32 filter 3×3×3; (B) fully-connected 32 neuron langsung dari piksel. Hitung parameter tiap proposal — angka ini menentukan mana yang bisa dilatih dengan 20 ribu foto cacat yang tersedia.",
        "Proposal A: tiap filter = 3×3×3 bobot + 1 bias = 28; ×32 filter = 896 parameter. Proposal B: input 32×32×3 = 3.072; (3.072+1)×32 = 98.336 parameter — 110× lebih banyak, untuk tugas yang sama, tanpa asumsi lokalitas. Dengan 20 ribu gambar, proposal B hampir pasti menghafal; proposal A punya peluang menggeneralisasi.",
        "Pembahasan: inilah keunggulan struktural CNN dalam angka. Bukan karena konvolusi itu magis — melainkan karena 896 parameter yang dipakai ulang jauh lebih mudah dipelajari daripada 98 ribu parameter yang masing-masing hanya melihat satu posisi. Keputusan: proposal A + pretrained bila tersedia.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `p_conv` = parameter 32 filter 3x3x3 (+bias)" },
        { id: "t2", text: "Hitung `p_fc` = parameter FC 3072 -> 32 (+bias)" },
      ],
      expected: "p_conv=896  p_fc=98336",
      note: {
        title: "💡 Intuisi: receptive field",
        type: "risk",
        body: "Satu neuron conv 3×3 hanya melihat 9 piksel — tetapi tumpuk 3 lapis dan neuron teratas melihat 7×7 piksel input. Receptive field tumbuh dengan kedalaman: lapisan awal = detail lokal, lapisan akhir = konteks global. Desain CNN = mengatur seberapa luas tiap lapisan boleh melihat.",
      },
      hints: [
        "Per filter: 3*3*3 bobot + 1 bias, kali 32.",
        "FC: (3072 + 1) * 32.",
        "p_conv = (3*3*3 + 1) * 32",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(3)\n\n# TULIS KODEMU\np_conv = \np_fc = \n\nprint(f"p_conv={p_conv}  p_fc={p_fc}")`,
        lockLines: 2,
        solution: `import numpy as np\nnp.random.seed(3)\n\n# TULIS KODEMU\np_conv = (3*3*3 + 1) * 32\np_fc = (32*32*3 + 1) * 32\n\nprint(f"p_conv={p_conv}  p_fc={p_fc}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_conv", value: 896, tol: 1e-9, label: "`p_conv` seharusnya 896", msg: "(27+1)x32 = 896." },
          { kind: "equal", task: "t2", name: "p_fc", value: 98336, tol: 1e-9, label: "`p_fc` seharusnya 98336", msg: "(3072+1)x32 = 98336." },
          { kind: "stdout_matches", task: "t2", pattern: "p_conv=896\\s+p_fc=98336", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Conv: (f*f*ch+1) x filter. FC: (masuk+1) x keluar. Bandingkan sebelum memilih.",
    },    {
      id: "lab-ukuran-konvolusi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: ukuran feature map, tahap demi tahap",
      prose: [
        "Input citra 32×32. Arsitektur: conv 3×3 stride 1 pad 1 → pool 2×2 → conv 3×3 stride 1 pad 0 → pool 2×2. Tugasmu: implementasikan rumus ukuran output dan hitung tiap tahap. Satu angka yang salah di tahap awal merambat ke semua tahap — persis seperti bug shape di CNN nyata.",
        "Hasilnya: 32 → 32 → 16 → 14 → 7. Perhatikan tahap ketiga: conv tanpa padding memangkas 2 piksel (16 ke 14) — padding bukan kosmetik, ia menentukan apakah informasi tepi bertahan.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `out(ukuran, kernel, stride, pad)` = (ukuran + 2*pad - kernel)//stride + 1" },
        { id: "t2", text: "Hitung conv1, pool1, conv2, pool2 dan cetak keempatnya" },
      ],
      expected: "conv1=32\npool1=16\nconv2=14\npool2=7",
      note: {
        title: "💡 Intuisi",
        body: "Rumus shape adalah kompas CNN: sebelum menulis satu baris PyTorch, hitung dulu di kertas. Engineer yang menghitung shape di kertas tidak pernah menghabiskan sore mengejar error “size mismatch”.",
      },
      hints: [
        "out = (ukuran + 2×pad − kernel) // stride + 1.",
        "Pool 2×2 stride 2: ukuran dibagi 2 (bila genap).",
      ],
      code: {
        starter: `# DATA — jangan diubah
# Input 32x32 -> conv 3x3 s1 p1 -> pool 2x2 -> conv 3x3 s1 p0 -> pool 2x2

# TULIS KODEMU: rumus ukuran output + hitung tiap tahap
def out(ukuran, kernel, stride=1, pad=0):
    ...

conv1 = ...
pool1 = ...
conv2 = ...
pool2 = ...
print(f"conv1={conv1}")
print(f"pool1={pool1}")
print(f"conv2={conv2}")
print(f"pool2={pool2}")`,
        lockLines: 2,
        solution: `# DATA — jangan diubah
# Input 32x32 -> conv 3x3 s1 p1 -> pool 2x2 -> conv 3x3 s1 p0 -> pool 2x2

# TULIS KODEMU: rumus ukuran output + hitung tiap tahap
def out(ukuran, kernel, stride=1, pad=0):
    return (ukuran + 2 * pad - kernel) // stride + 1

conv1 = out(32, 3, 1, 1)
pool1 = out(conv1, 2, 2)
conv2 = out(pool1, 3, 1, 0)
pool2 = out(conv2, 2, 2)
print(f"conv1={conv1}")
print(f"pool1={pool1}")
print(f"conv2={conv2}")
print(f"pool2={pool2}")`,
        checks: [
          { kind: "equal", task: "t2", name: "conv1", value: 32, tol: 1e-9, label: "`conv1` = 32", msg: "(32 + 2 − 3)/1 + 1 = 32 — padding 1 mempertahankan ukuran." },
          { kind: "equal", task: "t2", name: "pool1", value: 16, tol: 1e-9, label: "`pool1` = 16", msg: "32/2 = 16." },
          { kind: "equal", task: "t2", name: "conv2", value: 14, tol: 1e-9, label: "`conv2` = 14", msg: "(16 + 0 − 3)/1 + 1 = 14 — tanpa padding, tepi terpangkas 2." },
          { kind: "equal", task: "t2", name: "pool2", value: 7, tol: 1e-9, label: "`pool2` = 7", msg: "14/2 = 7." },
          { kind: "stdout_matches", task: "t2", pattern: "conv1=32\\npool1=16\\nconv2=14\\npool2=7", label: "output empat baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "out = (w + 2p − k)//s + 1. Padding mempertahankan ukuran; tanpa padding tepi terpangkas.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang konvolusi, pooling, dan jebakan Clever Hans.",
      ],
      note: {
        title: "💡 Intuisi: akurasi tinggi bisa buta",
        body: "Model 99 persen yang tidak melihat wajah = Clever Hans (kuda yang “berhitung” dari isyarat pelatih). Akurasi validasi TIDAK MENJAMIN model memakai fitur yang benar — audit dengan visualisasi (Grad-CAM) atau uji oklusi WAJIB untuk kasus kritis. Model yang “benar karena alasan salah” = bom waktu yang menunggu data sedikit bergeser.",
      },
      tasks: [],
      summary: [
        "Konvolusi = geser kernel, jumlahkan perkalian elemen: (I∗K)(i,j) = ΣΣ I(i+m,j+n)·K(m,n).",
        "Kernel dipelajari dari data via backprop; Sobel hanya contoh intuisi, bukan praktik.",
        "Weight sharing: pola yang berguna di satu posisi berguna di semua posisi — hemat parameter 100× lipat.",
        "Ukuran output: out = ⌊(n+2p−f)/s⌋ + 1; salah satu angka = dimensi tensor tidak cocok.",
        "Akurasi 99% tanpa pemahaman = Clever Hans; cari jalan pintas sebelum merayakan.",
      ],
      next: { label: "DLE4 — Sequence: dari RNN ke Transformer", href: "/v2/learn/dle4-seq" },
      quiz: [
        {
          q: "Citra 5×5, kernel 3×3, konvolusi valid. Ukuran output?",
          options: [
            { text: "5×5", why: "Itu bila pakai padding 1 (same convolution)." },
            { text: "3×3", why: "Valid: (5−3+1) = 3 per sisi.", correct: true },
            { text: "2×2", why: "Itu hasil pooling 2×2 pada output 4×4, bukan konvolusi ini." },
            { text: "7×7", why: "Konvolusi valid tidak pernah memperbesar citra." },
          ],
        },
        {
          q: "Model verifikasi KTP 99% akurat ternyata memakai watermark, bukan wajah. Ini contoh?",
          options: [
            { text: "Overfitting klasik", why: "Overfitting = hafal training; ini = belajar sinyal yang salah tapi general." },
            { text: "Shortcut learning (Clever Hans)", why: "Model menemukan jalan pintas termudah ke loss kecil — watermark — bukan fitur yang dimaksud.", correct: true },
            { text: "Underfitting", why: "Underfitting = performa buruk di training juga; ini 99%." },
            { text: "Data leakage biasa", why: "Mirip, tapi spesifiknya: model belajar fitur spurious yang valid di training, hilang di produksi." },
          ],
        },
        {
          q: "Mengapa CNN butuh jauh lebih sedikit parameter daripada fully-connected untuk citra?",
          options: [
            { text: "Karena citra selalu kecil", why: "Citra justru besar; penghematan datang dari struktur, bukan ukuran." },
            { text: "Weight sharing: satu kernel dipakai ulang di semua posisi", why: "896 vs 98.336 parameter di mini-case — asumsi lokalitas yang dipakai ulang.", correct: true },
            { text: "Karena tidak ada bias", why: "CNN tetap memakai bias per filter." },
            { text: "Karena tidak perlu training", why: "Kernel tetap dilatih; hanya jumlahnya jauh lebih sedikit." },
          ],
        },
        {
          q: "Citra 32×32, filter 3×3, padding 1, stride 2. Output?",
          options: [
            { text: "32", why: "Itu stride 1 dengan padding 1." },
            { text: "16", why: "⌊(32+2−3)/2⌋+1 = 16.", correct: true },
            { text: "15", why: "Lupa +1 di akhir rumus." },
            { text: "30", why: "Itu konvolusi valid stride 1 tanpa padding." },
          ],
        },
        {
          q: "Kapan max pooling 2×2 merugikan?",
          options: [
            { text: "Klasifikasi citra biasa", why: "Di situ pooling membantu: invariansi translasi + hemat komputasi." },
            { text: "Segmentasi yang butuh lokasi presisi", why: "Pooling membuang resolusi lokasi; tiap 2×2 pooling = separuh presisi hilang.", correct: true },
            { text: "Tidak pernah merugikan", why: "Selalu ada tradeoff: ringkasan vs detail lokasi." },
            { text: "Saat data sedikit", why: "Data sedikit butuh augmentasi/pretrained; pooling bukan masalah utamanya." },
          ],
        },
        {
          q: "Input 32×32 → conv 3×3 s1 p1 → pool 2×2 → conv 3×3 s1 p0 → pool 2×2. Ukuran akhirnya?",
          options: [
            { text: "7×7", why: "Benar: 32 → 32 → 16 → 14 → 7.", correct: true },
            { text: "8×8", why: "Salah: conv kedua tanpa padding memangkas 16 ke 14, bukan 16 — 14/2 = 7.", },
            { text: "16×16", why: "Salah: itu baru setelah pool pertama — masih ada dua tahap lagi.", },
            { text: "4×4", why: "Salah: pool terakhir membagi 14, bukan 16 — 14/2 = 7.", },
          ],
        },
        {
          q: "Kenapa conv 3×3 dengan pad 1 mempertahankan ukuran, sedangkan pad 0 memangkas 2 piksel?",
          options: [
            { text: "Karena stride-nya berbeda", why: "Stride keduanya 1 — bukan itu pembedanya.", },
            { text: "Rumus (w + 2p − k)//s + 1: p=1 memberi (w+2−3)+1 = w; p=0 memberi (w−3)+1 = w−2", why: "Benar: padding menambah piksel semu di tepi sehingga kernel tidak kehilangan tepi.", correct: true },
            { text: "Karena kernelnya berbeda", why: "Kernel keduanya 3×3.", },
            { text: "Padding tidak berpengaruh pada ukuran", why: "Salah: justru itulah fungsi padding — mempertahankan ukuran.", },
          ],
        },
      ],
    },
  ],
};
