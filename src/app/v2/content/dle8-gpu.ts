import type { V2Lesson } from "../lib/types";

// CPU: sedikit core besar. GPU: ribuan core kecil — cocok untuk matmul masif.
const CORES_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="CPU dengan 4 core besar vs GPU dengan banyak core kecil.">
<g font-family="var(--font-ui)" font-size="13" text-anchor="middle">
<text x="140" y="24" fill="var(--text)" font-weight="600">CPU: 4 core besar</text>
<text x="420" y="24" fill="var(--text)" font-weight="600">GPU: 2.048 core kecil</text>
</g>
<g>
<rect x="40" y="40" width="200" height="160" rx="10" fill="var(--bg-panel)" stroke="var(--border)"/>
<rect x="60" y="60" width="80" height="60" rx="6" fill="var(--c2)" opacity="0.85"/>
<rect x="150" y="60" width="80" height="60" rx="6" fill="var(--c2)" opacity="0.85"/>
<rect x="60" y="130" width="80" height="60" rx="6" fill="var(--c2)" opacity="0.85"/>
<rect x="150" y="130" width="80" height="60" rx="6" fill="var(--c2)" opacity="0.85"/>
<rect x="320" y="40" width="200" height="160" rx="10" fill="var(--bg-panel)" stroke="var(--border)"/>
</g>
<g fill="var(--c1)" opacity="0.85">
<rect x="330" y="50" width="18" height="18"/><rect x="352" y="50" width="18" height="18"/><rect x="374" y="50" width="18" height="18"/><rect x="396" y="50" width="18" height="18"/><rect x="418" y="50" width="18" height="18"/><rect x="440" y="50" width="18" height="18"/><rect x="462" y="50" width="18" height="18"/><rect x="484" y="50" width="18" height="18"/>
<rect x="330" y="72" width="18" height="18"/><rect x="352" y="72" width="18" height="18"/><rect x="374" y="72" width="18" height="18"/><rect x="396" y="72" width="18" height="18"/><rect x="418" y="72" width="18" height="18"/><rect x="440" y="72" width="18" height="18"/><rect x="462" y="72" width="18" height="18"/><rect x="484" y="72" width="18" height="18"/>
<rect x="330" y="94" width="18" height="18"/><rect x="352" y="94" width="18" height="18"/><rect x="374" y="94" width="18" height="18"/><rect x="396" y="94" width="18" height="18"/><rect x="418" y="94" width="18" height="18"/><rect x="440" y="94" width="18" height="18"/><rect x="462" y="94" width="18" height="18"/><rect x="484" y="94" width="18" height="18"/>
<rect x="330" y="116" width="18" height="18"/><rect x="352" y="116" width="18" height="18"/><rect x="374" y="116" width="18" height="18"/><rect x="396" y="116" width="18" height="18"/><rect x="418" y="116" width="18" height="18"/><rect x="440" y="116" width="18" height="18"/><rect x="462" y="116" width="18" height="18"/><rect x="484" y="116" width="18" height="18"/>
<rect x="330" y="138" width="18" height="18"/><rect x="352" y="138" width="18" height="18"/><rect x="374" y="138" width="18" height="18"/><rect x="396" y="138" width="18" height="18"/><rect x="418" y="138" width="18" height="18"/><rect x="440" y="138" width="18" height="18"/><rect x="462" y="138" width="18" height="18"/><rect x="484" y="138" width="18" height="18"/>
<rect x="330" y="160" width="18" height="18"/><rect x="352" y="160" width="18" height="18"/><rect x="374" y="160" width="18" height="18"/><rect x="396" y="160" width="18" height="18"/><rect x="418" y="160" width="18" height="18"/><rect x="440" y="160" width="18" height="18"/><rect x="462" y="160" width="18" height="18"/><rect x="484" y="160" width="18" height="18"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="140" y="222">pintar: branch, cache, logika kompleks</text>
<text x="140" y="238">lemah: perkalian matriks masif</text>
<text x="420" y="222">bodoh per core, tapi ribuan sekaligus</text>
<text x="420" y="238">raja: matmul — jantung deep learning</text>
</g>
</svg>`;

export const dle8: V2Lesson = {
  slug: "dle8-gpu",
  track: "Deep Learning Engineer",
  module: "Arsitektur Modern",
  title: "DLE8 — GPU & Mixed Precision",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-72jam",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "72 jam menjadi 22 menit tanpa mengubah satu baris kode",
      prose: [
        "Tim melatih model scoring 3 hari 3 malam di server CPU 32-core. Seorang engineer baru memindahkan kode yang sama — tanpa mengubah satu baris Python — ke satu GPU cloud. Training selesai 22 menit kemudian. Speedup 196×. Tagihan GPU-nya Rp 110 ribu; biaya listrik dan waktu tunggu 3 hari di CPU jauh lebih mahal.",
        "Tidak ada yang salah dengan CPU-nya; ia hanya dirancang untuk pekerjaan berbeda. CPU = 4–64 core yang sangat pintar (branch prediction, cache besar) — ideal untuk logika kompleks berurutan. GPU = ribuan core sederhana yang hanya bisa satu hal dengan baik: melakukan operasi yang sama pada data berbeda secara bersamaan.",
        "Twist-nya: 90% komputasi deep learning adalah satu operasi — perkalian matriks. Forward pass = matmul, backprop = matmul, attention = matmul. GPU bukan sekadar lebih cepat; ia adalah hardware yang kebetulan dirancang untuk jantung deep learning. Lesson ini: mengapa, seberapa cepat, dan cara memerasnya lebih jauh dengan presisi campuran.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung speedup GPU vs CPU untuk workload matmul; (2) menjelaskan cara kerja mixed precision (FP16) dan risikonya; (3) menghitung aritmetika sewa GPU (Rp300 ribu vs Rp800 ribu); (4) memutuskan apakah workload-mu butuh GPU atau tidak.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Anggaran komputasi adalah risiko proyek: training 3 hari di CPU vs 22 menit di GPU = perbedaan biaya dan waktu delivery yang menentukan. Estimasi FLOPs sebelum training adalah kontrol biaya termurah.",
      },
      reference: "Deep learning = matmul berulang. GPU = mesin matmul masif.",
    },
    {
      id: "matmul",
      eyebrow: "Langkah 2 · Matmul & FLOPs",
      title: "Satu rumus untuk mengukur semua training",
      prose: [
        "Perkalian matriks A(m×k) × B(k×n): tiap dari m×n elemen output butuh k perkalian dan k penjumlahan ≈ 2k operasi. Total FLOPs = 2mnk. Contoh lab: A(512×1024) × B(1024×256) = 2×512×1024×256 = 268.435.456 FLOPs ≈ 268 juta operasi — dan itu baru satu matmul kecil dalam satu lapisan.",
        "GPU modern ~100 TFLOPS (100 triliun operasi/detik): idealnya matmul itu selesai dalam 2,68 mikrodetik. Praktiknya lebih lambat (overhead memori, transfer data), tetapi orde besarnya benar: yang butuh detik di CPU butuh milidetik di GPU. Inilah mengapa batch size besar penting — GPU lapar: beri ia matriks besar sekaligus, jangan suapi satu per satu.",
        "Cara membaca rumus: gandakan tiap dimensi 2× → FLOPs naik 8×. Model 2× lebih lebar = 8× lebih mahal. Inilah mengapa scaling model butuh perencanaan: biaya tumbuh kubik terhadap lebar lapisan.",
        "💡 Intuisi: bottleneck modern biasanya memori, bukan komputasi. GPU bisa menghitung 100 TFLOPS tetapi hanya membaca ~1 TB/detik dari memori — bila operasimu sedikit per byte yang dibaca (seperti attention tanpa optimasi), GPU menganggur menunggu data. Mixed precision membantu dua-duanya: lebih sedikit byte dibaca, lebih cepat dihitung.",
        "💡 Intuisi: hitung FLOPs sebelum janji. Satu forward pass modelmu = jumlahkan 2mnk semua lapisan. Estimasi 5 menit ini mencegah janji training seminggu yang ternyata butuh sebulan.",
        "Cara membaca: kiri = CPU dengan 4 core besar; kanan = GPU dengan banyak core kecil; teks bawah = keunggulan masing-masing.",
        "Interpretasi: CPU unggul di logika kompleks berurutan, GPU unggul di operasi seragam yang masif dan paralel — dan 90% komputasi deep learning adalah yang kedua (matmul).",
      ],
      formula: String.raw`\text{FLOPs}(\mathbf{A}_{m\times k}\mathbf{B}_{k\times n}) = 2mnk`,
      formulaNote: "FLOPs = jumlah operasi floating point; m = baris A; k = dimensi dalam (kolom A = baris B); n = kolom B. Faktor 2 = satu kali + satu tambah per pasangan.",
      figure: {
        svg: CORES_SVG,
        alt: "CPU dengan sedikit core besar vs GPU dengan ribuan core kecil.",
        caption: "Filosofi berbeda: CPU pintar dan sedikit, GPU sederhana dan ribuan — matmul butuh yang kedua.",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `flops` = 2*m*n*k untuk matmul (512,1024)x(1024,256)" },
        { id: "t2", text: "Hitung `t_us` = waktu ideal di GPU 100 TFLOPS (mikrodetik, 2 desimal)" },
      ],
      expected: "flops=268435456  t_us=2.68",
      note: {
        title: "🚨 Mitos: GPU mempercepat semua kode Python",
        type: "pitfall",
        body: "Yang benar: GPU hanya mempercepat operasi paralel masif (matmul, konvolusi) yang dijalankan via framework. Loop Python biasa, parsing data, atau operasi berurutan tidak dipercepat — bahkan bisa lebih lambat karena overhead transfer CPU→GPU. Profiling dulu: pastikan bottleneck-mu memang matmul sebelum menyewa GPU.",
      },
      hints: [
        "flops = 2*m*n*k.",
        "100 TFLOPS = 100e12 operasi/detik; detik ke mikrodetik = x1e6.",
        "t_us = flops / 100e12 * 1e6",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(8)\n\nm, n, k = 512, 256, 1024  # A(m,k) x B(k,n)\n\n# TULIS KODEMU\nflops = \nt_us = \n\nprint(f"flops={flops}  t_us={t_us:.2f}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(8)\n\nm, n, k = 512, 256, 1024  # A(m,k) x B(k,n)\n\n# TULIS KODEMU\nflops = 2*m*n*k\nt_us = flops / 100e12 * 1e6\n\nprint(f"flops={flops}  t_us={t_us:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "flops", value: 268435456, tol: 1e-9, label: "`flops` seharusnya 268435456", msg: "2x512x1024x256 = 268435456." },
          { kind: "equal", task: "t2", name: "t_us", value: 2.68, tol: 0.01, label: "`t_us` seharusnya 2.68", msg: "268435456/1e14 detik x 1e6 = 2.68 mikrodetik." },
          { kind: "stdout_matches", task: "t2", pattern: "flops=268435456\\s+t_us=2\\.68", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "FLOPs matmul = 2mnk. Gandakan lebar 2x = biaya 8x.",
    },
    {
      id: "mixed-precision",
      eyebrow: "Langkah 3 · Mixed precision",
      title: "FP16: setengah bit, dua kali lipat kecepatan",
      prose: [
        "Float32 memakai 32 bit; float16 hanya 16 bit — separuh memori, separuh waktu transfer, dan Tensor Core GPU menghitung matmul FP16 ~2–8× lebih cepat. Mixed precision: komputasi berat (matmul, konvolusi) jalan di FP16, akumulasi sensitif (penjumlahan gradien, bobot master) tetap FP32. Hasil: training ~1,5–2× lebih cepat dengan akurasi praktis identik.",
        "Harganya: presisi. FP16 hanya punya ~3 desimal presisi dan rentang hingga 65.504. Lab menunjukkan: 1.000 angka acak di-quant ke FP16 lalu kembali — error maksimum 0,000970, kecil dan aman untuk aktivasi. Tetapi gradien kecil g = 1e-8 menjadi tepat 0,0 di FP16 (di bawah batas subnormal) — gradien hilang bukan karena vanishing, melainkan karena underflow!",
        "Obatnya: loss scaling — kalikan loss dengan 1.024–32.768 sebelum backprop agar gradien naik ke rentang aman FP16, lalu bagi kembali saat update bobot. Framework modern (PyTorch AMP) melakukan ini otomatis. Kamu tidak perlu mengimplementasikannya — tetapi wajib tahu ia ada saat loss berperilaku aneh di mixed precision.",
        "💡 Intuisi: mixed precision = kirim paket kecil untuk barang besar, amplop tebal untuk dokumen penting. Matmul (barang besar, toleran) di FP16; akumulasi bobot (dokumen penting, sensitif) di FP32. Ekonomi presisi, bukan pelit presisi.",
      ],
      formula: String.raw`\text{FP16: 1 tanda + 5 eksponen + 10 mantissa} \;\approx\; \text{3 desimal, maks } 65504`,
      formulaNote: "Dibanding FP32 (8 eksponen + 23 mantissa ≈ 7 desimal, maks 3,4e38): FP16 jauh lebih sempit. Gradien < ~6e-5 berisiko underflow menjadi nol — di sinilah loss scaling bekerja.",
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Quant ke FP16 lalu kembali; hitung `err_maks`" },
        { id: "t2", text: "Konversi gradien kecil g=1e-8 ke FP16, simpan di `g16`" },
      ],
      expected: "err_maks=0.000970  g_fp16=0.0",
      note: {
        title: "🚨 Mitos: FP16 selalu aman, tinggal nyalakan",
        type: "pitfall",
        body: "Yang benar: tanpa loss scaling, gradien kecil underflow menjadi nol dan lapisan awal berhenti belajar — training terlihat jalan tetapi model pincang. Selalu pakai AMP (automatic mixed precision) bawaan framework yang menangani scaling otomatis, dan curigai underflow bila lapisan awal tidak belajar di mode FP16.",
      },
      hints: [
        "q = x.astype(np.float16).astype(np.float32).",
        "err_maks = maksimum |x - q|.",
        "g16 = float(np.float16(1e-8))",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(8)\n\nx = np.random.randn(1000)  # aktivasi contoh\n\n# TULIS KODEMU\nq = \nerr_maks = \ng16 = \n\nprint(f"err_maks={err_maks:.6f}  g_fp16={g16}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(8)\n\nx = np.random.randn(1000)  # aktivasi contoh\n\n# TULIS KODEMU\nq = x.astype(np.float16).astype(np.float32)\nerr_maks = np.abs(x - q).max()\ng16 = float(np.float16(1e-8))\n\nprint(f"err_maks={err_maks:.6f}  g_fp16={g16}")`,
        checks: [
          { kind: "equal", task: "t1", name: "err_maks", value: 0.00097, tol: 1e-6, label: "`err_maks` sekitar 0.000970", msg: "Maksimum |x - FP16(x)| untuk 1000 sampel = 0.000970." },
          { kind: "equal", task: "t2", name: "g16", value: 0.0, tol: 1e-12, label: "`g16` seharusnya 0.0", msg: "1e-8 di bawah rentang FP16 -> underflow menjadi 0.0. Inilah bahayanya." },
          { kind: "stdout_matches", task: "t2", pattern: "err_maks=0\\.000970\\s+g_fp16=0\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "FP16 hemat 2x; gradien kecil underflow -> loss scaling. Pakai AMP framework.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: butuh GPU? presisi apa?",
      prose: [
        "Skenario 1 — Prototyping, data kecil, iterasi cepat. → CPU + model kecil. Alasan: overhead sewa GPU dan transfer data mengalahkan manfaatnya untuk eksperimen 5 menit.",
        "Skenario 2 — Training serius (jam–hari), matmul dominan. → GPU + batch sebesar memori muat + mixed precision. Alasan: GPU lapar batch besar; FP16 menggandakan throughput efektif.",
        "Skenario 3 — Bottleneck di data loading (GPU menganggur 50%). → Perbaiki pipeline dulu (prefetch, num_workers), bukan sewa GPU lebih besar. Alasan: GPU tercepat pun tak berguna bila menunggu data.",
        "Skenario 4 — Model sangat besar, satu GPU tak muat. → Model/data parallelism atau gradient accumulation. Alasan: akumulasi gradien mensimulasikan batch besar di memori kecil — gratis, hanya lebih lambat.",
        "Skenario 5 — Inferensi produksi. → FP16/INT8 (DLE10), bukan FP32 training. Alasan: inferensi tidak butuh presisi gradien; yang dibutuhkan throughput dan latensi.",
        "Aturan praktis 10 detik: (1) profiling dulu, sewa kemudian; (2) batch sebesar muat; (3) AMP nyala default untuk training; (4) hitung FLOPs sebelum janji deadline.",
      ],
      note: {
        title: "💡 Intuisi: GPU = matmul, bukan sihir",
        body: "GPU mempercepat operasi PARALEL MASIF (perkalian matriks) — 72 jam menjadi 22 menit untuk training. Tetapi kode SEQUENSIAL (loop Python, I/O) TIDAK terbantu — bahkan bisa lebih lambat (overhead transfer CPU-GPU). Profil dulu: jika 80 persen waktu = matmul → GPU. Jika 80 persen = loading data → perbaiki data loader (bukan beli GPU!).",
      },
      tasks: [],
      reference: "CPU untuk prototipe, GPU+AMP untuk training, INT8 untuk inferensi.",
    },
    {
      id: "minicase-biaya",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Rp 300 ribu vs Rp 800 ribu: aritmetika sewa GPU",
      prose: [
        "Modelmu butuh 20 jam GPU (Rp 15.000/jam) atau 400 jam CPU (20× lebih lambat, Rp 2.000/jam). Hitung: GPU = Rp 300.000, CPU = Rp 800.000. GPU tidak hanya 20× lebih cepat — ia 2,7× lebih murah untuk pekerjaan ini. Ditambah 380 jam waktu tunggu yang bisa dipakai iterasi.",
        "Tetapi ada jebakannya: bila training-mu hanya 30 menit di GPU vs 10 jam di CPU, overhead setup dan antrean cloud bisa menghapus keunggulan. Aturan: sewa GPU bila training > 2 jam; di bawah itu, pertimbangkan spot/preemptible atau tetap CPU untuk iterasi cepat.",
        "Pembahasan: keputusan infrastruktur = aritmetika, bukan gengsi. Hitung (waktu × tarif) untuk kedua opsi setiap kali — angka 5 menit ini menghemat jutaan per proyek.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `c_gpu` = 20 jam x Rp 15.000" },
        { id: "t2", text: "Hitung `c_cpu` = 400 jam x Rp 2.000" },
      ],
      expected: "c_gpu=300000  c_cpu=800000",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan tarif per jam (GPU terlihat mahal) tanpa mengalikan waktu. Rp 15.000/jam × 20 jam < Rp 2.000/jam × 400 jam. Selalu bandingkan total biaya proyek, bukan tarif satuan.",
      },
      hints: [
        "c_gpu = 20 * 15000.",
        "c_cpu = 400 * 2000.",
        "Bandingkan totalnya, bukan tarif per jam.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(8)\n\n# TULIS KODEMU\nc_gpu = \nc_cpu = \n\nprint(f"c_gpu={c_gpu}  c_cpu={c_cpu}")`,
        lockLines: 2,
        solution: `import numpy as np\nnp.random.seed(8)\n\n# TULIS KODEMU\nc_gpu = 20 * 15000\nc_cpu = 400 * 2000\n\nprint(f"c_gpu={c_gpu}  c_cpu={c_cpu}")`,
        checks: [
          { kind: "equal", task: "t1", name: "c_gpu", value: 300000, tol: 1e-9, label: "`c_gpu` seharusnya 300000", msg: "20 x 15000 = 300000." },
          { kind: "equal", task: "t2", name: "c_cpu", value: 800000, tol: 1e-9, label: "`c_cpu` seharusnya 800000", msg: "400 x 2000 = 800000." },
          { kind: "stdout_matches", task: "t2", pattern: "c_gpu=300000\\s+c_cpu=800000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bandingkan total biaya (waktu x tarif), bukan tarif per jam.",
    },    {
      id: "lab-roofline",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: roofline — memory-bound atau compute-bound?",
      prose: [
        "GPU ilustratif: 300 TFLOPS, bandwidth memori 2 TB/detik. Dua operasi, masing-masing 1e12 FLOP. Op A memindahkan 1e12 byte (aritmetika intensitas 1 FLOP/byte); Op B memindahkan 1e9 byte (intensitas 1.000 FLOP/byte). Tugasmu: hitung waktu komputasi dan waktu memori tiap op, lalu tentukan bottleneck-nya (yang lebih lama).",
        "Hasilnya: Op A butuh 0,5 detik — memory-bound (waktu memori 0,5 detik vs komputasi 0,0033 detik). Op B butuh 0,0033 detik — compute-bound (komputasi 0,0033 vs memori 0,0005). Pelajarannya: FLOPS besar tidak membantu Op A sama sekali — yang ia butuhkan adalah bandwidth atau lebih sedikit byte.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `waktu(flop, byte)` = max(flop/TFLOPS, byte/BANDWIDTH)" },
        { id: "t2", text: "Hitung op_a, op_b, dan bottleneck tiap op, lalu cetak" },
      ],
      expected: "op_a=0.5000\nop_b=0.0033\nbottleneck_a=memory\nbottleneck_b=compute",
      note: {
        title: "💡 Intuisi",
        body: "Kebanyakan op deep learning di batch kecil adalah memory-bound — GPU menunggu data, bukan menghitung. Itulah kenapa batching dan mixed precision (DLE8) mempercepat training: bukan karena FLOPS naik, melainkan karena byte per FLOP turun.",
      },
      hints: [
        "waktu_komputasi = FLOP / TFLOPS; waktu_memori = byte / bandwidth.",
        "Bottleneck = yang lebih lama; intensitas = FLOP / byte.",
      ],
      code: {
        starter: `# DATA — jangan diubah (angka ilustratif)
TFLOPS, BANDWIDTH = 300e12, 2e12  # 300 TFLOPS, 2 TB/detik
# Op A: 1e12 FLOP, 1e12 byte; Op B: 1e12 FLOP, 1e9 byte

# TULIS KODEMU: roofline
def waktu(flop, byte):
    ...

op_a = ...
op_b = ...
bot_a = ...
bot_b = ...
print(f"op_a={op_a:.4f}")
print(f"op_b={op_b:.4f}")
print(f"bottleneck_a={bot_a}")
print(f"bottleneck_b={bot_b}")`,
        lockLines: 3,
        solution: `# DATA — jangan diubah (angka ilustratif)
TFLOPS, BANDWIDTH = 300e12, 2e12  # 300 TFLOPS, 2 TB/detik
# Op A: 1e12 FLOP, 1e12 byte; Op B: 1e12 FLOP, 1e9 byte

# TULIS KODEMU: roofline
def waktu(flop, byte):
    return max(flop / TFLOPS, byte / BANDWIDTH)

op_a = waktu(1e12, 1e12)
op_b = waktu(1e12, 1e9)
bot_a = "memory" if 1e12 / BANDWIDTH > 1e12 / TFLOPS else "compute"
bot_b = "memory" if 1e9 / BANDWIDTH > 1e12 / TFLOPS else "compute"
print(f"op_a={op_a:.4f}")
print(f"op_b={op_b:.4f}")
print(f"bottleneck_a={bot_a}")
print(f"bottleneck_b={bot_b}")`,
        checks: [
          { kind: "equal", task: "t2", name: "op_a", value: 0.5, tol: 0.0001, label: "`op_a` = 0.5 detik", msg: "max(0,0033; 0,5) = 0,5 — memory-bound." },
          { kind: "equal", task: "t2", name: "op_b", value: 0.0033, tol: 0.0001, label: "`op_b` sekitar 0.0033 detik", msg: "max(0,0033; 0,0005) = 0,0033 — compute-bound." },
          { kind: "equal", task: "t2", name: "bot_a", value: "memory", label: "`bot_a` = memory", msg: "Waktu memori 0,5 jauh di atas komputasi 0,0033." },
          { kind: "stdout_matches", task: "t2", pattern: "op_a=0\\.5000\\nop_b=0\\.0033\\nbottleneck_a=memory\\nbottleneck_b=compute", label: "output empat baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Roofline: waktu = max(FLOP/TFLOPS, byte/bandwidth). Intensitas rendah = memory-bound.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang GPU, FLOPs, dan mixed precision.",
      ],
      note: {
        title: "💡 Intuisi: FP16: cepat dengan pengaman",
        body: "Mixed precision (FP16) = 2x cepat, setengah memori — TETAPI rentan underflow (gradient kecil menjadi nol!). Pengamannya: loss scaling (kalikan loss 2^k sebelum backward, bagi setelahnya). Tanpa loss scaling: training “jalan” tetapi tidak belajar (gradient hilang diam-diam). Aturan: pakai AMP (automatic) bawaan framework — jangan implementasi manual kecuali paham.",
      },
      tasks: [],
      summary: [
        "90% DL = matmul; GPU = ribuan core sederhana yang dirancang untuk itu.",
        "FLOPs matmul = 2mnk; gandakan lebar 2× = biaya 8×.",
        "GPU lapar batch besar; bottleneck modern biasanya memori, bukan komputasi.",
        "Mixed precision: FP16 untuk matmul, FP32 untuk akumulasi — 1,5–2× lebih cepat.",
        "FP16 underflow membunuh gradien kecil; loss scaling (AMP) adalah obatnya.",
      ],
      next: { label: "DLE9 — Debugging: Loss Tidak Turun", href: "/v2/learn/dle9-debug" },
      quiz: [
        {
          q: "Mengapa GPU jauh lebih cepat untuk deep learning?",
          options: [
            { text: "Clock speed lebih tinggi", why: "Clock GPU justru lebih rendah dari CPU." },
            { text: "Ribuan core paralel untuk matmul — operasi dominan DL", why: "Forward/backprop/attention semuanya matmul; GPU dirancang untuk itu.", correct: true },
            { text: "Memori lebih besar", why: "Memori GPU justru biasanya lebih kecil dari RAM server." },
            { text: "Python lebih cepat di GPU", why: "Python tetap jalan di CPU; yang pindah ke GPU hanya tensor ops." },
          ],
        },
        {
          q: "Matmul A(512×1024)×B(1024×256). FLOPs?",
          options: [
            { text: "134 juta", why: "Lupa faktor 2 (kali + tambah)." },
            { text: "268.435.456", why: "2×512×1024×256 = 268.435.456.", correct: true },
            { text: "536 juta", why: "Kelebihan faktor 2." },
            { text: "Tidak bisa dihitung tanpa GPU", why: "FLOPs adalah hitungan matematis, bukan pengukuran." },
          ],
        },
        {
          q: "Gradien 1e-8 menjadi 0,0 di FP16. Fenomena dan obatnya?",
          options: [
            { text: "Vanishing gradient; tambah lapisan", why: "Ini underflow numerik, bukan vanishing arsitektural." },
            { text: "Underflow FP16; loss scaling via AMP", why: "1e-8 di bawah rentang FP16; kalikan loss agar gradien naik ke rentang aman.", correct: true },
            { text: "Exploding gradient; clipping", why: "Terbalik: ini gradien yang hilang, bukan meledak." },
            { text: "Normal, abaikan", why: "Lapisan awal berhenti belajar = model pincang." },
          ],
        },
        {
          q: "GPU menganggur 50% saat training. Tindakan pertama?",
          options: [
            { text: "Sewa GPU lebih besar", why: "Memperbesar yang menganggur = buang uang." },
            { text: "Perbaiki data pipeline (prefetch, workers)", why: "Bottleneck-nya pasokan data, bukan komputasi.", correct: true },
            { text: "Kecilkan batch", why: "Itu memperparah kelaparan GPU." },
            { text: "Matikan mixed precision", why: "Tidak terkait dengan pasokan data." },
          ],
        },
        {
          q: "Kapan CPU lebih rasional daripada GPU?",
          options: [
            { text: "Tidak pernah", why: "Ada: prototyping cepat dan data kecil." },
            { text: "Prototyping 5 menit dengan data kecil", why: "Overhead sewa+transfer GPU mengalahkan manfaatnya untuk eksperimen kilat.", correct: true },
            { text: "Training 3 hari", why: "Itu justru kasus terbaik GPU." },
            { text: "Model 10 miliar parameter", why: "Itu wajib GPU cluster." },
          ],
        },
        {
          q: "GPU 300 TFLOPS, bandwidth 2 TB/detik. Op 1e12 FLOP + 1e12 byte. Waktu dan bottleneck-nya?",
          options: [
            { text: "0,5 detik, memory-bound", why: "Benar: komputasi 0,0033 detik, memori 0,5 detik — yang lebih lama menang.", correct: true },
            { text: "0,0033 detik, compute-bound", why: "Salah: itu waktu komputasinya saja — memori 150 kali lebih lambat.", },
            { text: "0,5033 detik — keduanya dijumlah", why: "Salah: komputasi dan transfer tumpang tindih — yang menentukan adalah max, bukan jumlah.", },
            { text: "0,0005 detik", why: "Salah: itu waktu memori Op B, bukan Op A.", },
          ],
        },
        {
          q: "Op memory-bound (intensitas 1 FLOP/byte). Cara mempercepatnya yang BENAR?",
          options: [
            { text: "Beli GPU dengan FLOPS lebih besar", why: "Salah: bottleneck-nya memori — FLOPS tidak dipakai.", },
            { text: "Kurangi byte yang dipindah (batching, mixed precision, cache) atau naikkan bandwidth", why: "Benar: bottleneck adalah memori — perbaiki memori, bukan komputasi.", correct: true },
            { text: "Perkecil batch agar GPU tidak kepanasan", why: "Salah: batch kecil justru memperburuk intensitas — lebih sedikit FLOP per byte.", },
            { text: "Naikkan learning rate", why: "Tidak ada hubungannya dengan waktu eksekusi op.", },
          ],
        },
      ],
    },
  ],
};
