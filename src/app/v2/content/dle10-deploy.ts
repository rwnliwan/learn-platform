import type { V2Lesson } from "../lib/types";

// Tradeoff kuantisasi: ukuran menyusut 4x, akurasi turun sedikit.
const TRADEOFF_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Kurva tradeoff: ukuran model vs akurasi untuk FP32, FP16, INT8.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="60" y2="240"/><line x1="60" y1="240" x2="530" y2="240"/></g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)" text-anchor="middle">
<text x="295" y="262">ukuran model (MB) →</text>
<text x="30" y="130" transform="rotate(-90 30 130)">akurasi</text>
<text x="120" y="256">0,4</text><text x="300" y="256">200</text><text x="470" y="256">800</text>
</g>
<path d="M120,60 C200,62 320,70 470,78" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<circle cx="120" cy="60" r="6" fill="var(--c4)"/><text x="120" y="44" fill="var(--text)">INT8: 0,11MB</text><text x="120" y="96" fill="var(--text-muted)" font-size="11">−0,3%</text>
<circle cx="290" cy="68" r="6" fill="var(--c2)"/><text x="290" y="52" fill="var(--text)">FP16: 0,22MB</text>
<circle cx="470" cy="78" r="6" fill="var(--c1)"/><text x="470" y="62" fill="var(--text)">FP32: 0,44MB</text><text x="470" y="112" fill="var(--text-muted)" font-size="11">baseline</text>
</g>
<text x="295" y="200" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">ukuran /4, akurasi −0,3%: tradeoff terbaik pertama yang dicoba</text>
</svg>`;

export const dle10: V2Lesson = {
  slug: "dle10-deploy",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE10 — Deploy Model DL",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-hp",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model 1,7 GB yang tidak muat di HP siapa pun",
      prose: [
        "Aplikasi scoring UMKM selesai dilatih: akurasi 94%, 400 juta parameter FP32 = 1,7 GB. Tim mobile mencoba memasukkannya ke aplikasi: HP kentang crash saat load, HP flagship butuh 40 detik untuk satu prediksi, baterai terkuras. Model terbaik di lab = tidak bisa dipakai di dunia nyata.",
        "Solusinya tiga langkah: kuantisasi INT8 (1,7 GB → 425 MB), distilasi ke model 40 juta parameter (→ 40 MB), kompilasi ke format mobile. Hasil akhir: 38 MB, inferensi 80 milidetik, akurasi 93,4% — turun 0,6 poin dari 94%. Pengguna tidak merasakan bedanya; yang mereka rasakan adalah aplikasi yang akhirnya bisa dibuka.",
        "Twist-nya: 0,6 poin akurasi yang dikorbankan membeli sesuatu yang tak ternilai — model yang benar-benar dipakai. Lesson ini: ekonomi deploy — kuantisasi, format portable, dan serving — supaya modelmu tidak menjadi artefak lab yang indah namun tak tersentuh.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung penghematan kuantisasi (4x lebih kecil, -0,3 persen); (2) menjelaskan peran ONNX sebagai format lintas framework; (3) memilih strategi deploy (kuantisasi, distilasi, pruning) sesuai batas; (4) menghitung apakah modelmu muat di batas 50 MB.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model yang tidak bisa di-deploy = investasi training yang hangus. Desain untuk target deploy sejak hari pertama (batas memori, latensi) — bukan sebagai renungan setelah training selesai.",
      },
      reference: "Akurasi lab tanpa kelayakan deploy = artefak. Rancang untuk target sejak awal.",
    },
    {
      id: "kuantisasi",
      eyebrow: "Langkah 2 · Kuantisasi",
      title: "Kuantisasi: diet 4× dengan harga 0,3%",
      prose: [
        "Kuantisasi memetakan bobot FP32 (4 byte) ke INT8 (1 byte): q = round(w/s) + z, dengan s = skala = max|w|/127, z = zero-point. 256 nilai integer mewakili rentang bobot; error kuantisasi = selisih w asli vs hasil dekuantisasi. Lab: 1.000 bobot acak FP32 (4.000 byte) → INT8 (1.000 byte), error maksimum 0,0146 — kecil dibanding skala bobot ~3.",
        "Mengapa akurasi hampir tidak turun? Network dalam toleran terhadap noise kecil per bobot — error acak 0,01 di ribuan bobot saling meniadakan, seperti kesalahan 1 rupiah di 1.000 transaksi. Yang tidak toleran: outlier bobot ekstrem (s membesar → semua bobot kecil terkompresi) dan akumulasi aktivasi — itulah mengapa kalibrasi (mengukur rentang aktivasi dari data nyata) penting untuk kuantisasi pasca-training.",
        "Dua mode: PTQ (post-training quantization) — kuantisasi model jadi, cepat, tanpa training ulang, sering menjadi percobaan pertama karena murah dan cepat — tetapi harus divalidasi pada metrik bisnis, karena cakupannya bergantung dataset, arsitektur, dan hardware (tidak ada angka universal seperti '90% kasus' tanpa konteks itu); QAT (quantization-aware training) — simulasikan kuantisasi saat training, 2–5× lebih lambat tetapi akurasi lebih terjaga untuk model kecil/sensitif. Aturan: coba PTQ dulu; QAT hanya bila akurasi PTQ tidak memenuhi syarat.",
        "💡 Intuisi: kuantisasi = membulatkan harga ke ribuan terdekat. Total belanja Rp 1.000.347 → Rp 1.000.000: error Rp 347 tidak mengubah keputusan beli. Bobot network pun begitu — yang penting pola besarnya, bukan desimal keempatnya.",
        "💡 Intuisi: ukuran model = parameter × byte per parameter. 109.386 parameter: FP32 = 0,44 MB, INT8 = 0,11 MB. Rumus 5 detik ini menentukan apakah modelmu muat di HP, di edge, atau butuh server.",
        "Cara membaca: sumbu X = ukuran model (MB), sumbu Y = akurasi; tiga titik = FP32 (baseline), FP16, INT8 untuk model yang sama.",
        "Interpretasi: kurva hampir datar — ukuran menyusut 4x (0,44 ke 0,11 MB) dengan akurasi turun hanya 0,3%. Inilah mengapa INT8 adalah kompresi pertama yang dicoba.",
        "Matematika kuantisasi — 1,7 GB menjadi berapa? FP32 (4 byte) → INT8 (1 byte) = 4x: 1,7 GB menjadi 425 MB. Masih >50 MB! Lanjut: (1) pruning 50 persen → 212 MB; (2) distilasi ke model 10x lebih kecil → 42 MB (FP32) → kuantisasi → 10,5 MB. Rantai kompresi = kalikan penghematan. Satu teknik jarang cukup untuk 1,7 GB → 50 MB (34x!) — butuh KOMBINASI. Rencanakan rantai kompresimu di awal, bukan panik di akhir.",
        "Kalibrasi kuantisasi — detail yang menentukan. INT8 butuh rentang (min, max) per tensor: diukur dari DATA KALIBRASI (500–1.000 sampel representatif). Data kalibrasi SALAH (tidak representatif) = akurasi jatuh 5 persen (bukan 0,3!). Aturan: kalibrasi dari data PRODUKSI (bukan training!), cukup 1.000 sampel, verifikasi akurasi setelah kuantisasi. 30 menit yang membedakan “diet sukses” vs “model rusak”. Dan batasan yang wajib diukur setelah kuantisasi — bukan hanya akurasi global: (1) metrik PER KELAS — akurasi global bisa tetap 93% sementara satu kelas langka jatuh 10 poin (kelas yang jarang muncul hampir tidak memengaruhi rata-rata); (2) fairness — periksa metrik per kelompok pengguna yang dilindungi, karena error kuantisasi tidak merata; (3) kalibrasi probabilitas — skor 0,8 pasca-kuantisasi belum tentu berarti peluang 80% lagi, ukur ulang (misal ECE) bila skor dipakai sebagai ambang keputusan; (4) outlier activation — satu aktivasi ekstrem bisa membesarkan skala s dan merusak semua bobot kecil di tensor itu; (5) fallback — bila operator tertentu tidak didukung INT8 di runtime target, rencananya adalah kuantisasi parsial (layer itu tetap FP32/FP16), bukan memaksa seluruh model INT8. Bila satu pun dari lima ini gagal, PTQ belum lolos — walau akurasi globalnya terlihat baik.",
        "Distilasi sebagai alternatif — kapan? Jika kuantisasi + pruning BELUM cukup (butuh 34x seperti kasus ini), latih model KECIL (murid) meniru model BESAR (guru): murid belajar dari soft labels guru (distribusi probabilitas, bukan hard label) — informasi “kucing 80%, anjing 15%” lebih kaya dari “kucing”. Hasil: murid 10x lebih kecil, akurasi −1 persen. Biaya: training 1x (guru sudah ada). Untuk 50 MB: murid + kuantisasi = jawaban standar industri.",
      ],
      formula: String.raw`q = \mathrm{round}\!\left(\frac{w}{s}\right) + z, \qquad s = \frac{\max|w|}{127}, \quad \hat{w} = (q - z)\,s`,
      formulaNote: "w = bobot asli FP32; s = skala (rentang bobot dibagi 127); z = zero-point (pergeseran agar 0 terwakili tepat); q = bobot INT8 (−128..127); ŵ = bobot hasil dekuantisasi untuk komputasi. Error = |w − ŵ|.",
      figure: {
        svg: TRADEOFF_SVG,
        alt: "Kurva tradeoff ukuran vs akurasi: INT8 seperempat ukuran dengan penurunan akurasi kecil.",
        caption: "Tradeoff kuantisasi: ukuran /4, akurasi −0,3% — kesepakatan terbaik pertama.",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Kuantisasi INT8 1000 bobot; simpan ukuran byte di `nq`" },
        { id: "t2", text: "Hitung `err` = error dekuantisasi maksimum" },
        { id: "t3", text: "Hitung ukuran model 109386 parameter dalam FP32 vs INT8 (MB)" },
      ],
      expected: "fp32_byte=4000  int8_byte=1000  err=0.0146  model_fp32=0.44MB  model_int8=0.11MB",
      note: {
        title: "🚨 Mitos: kuantisasi tidak mengubah akurasi, langsung pakai",
        type: "pitfall",
        body: "Yang benar: kuantisasi SELALU mengubah komputasi — pertanyaannya seberapa besar dampaknya pada METRIK BISNISMU. Wajib evaluasi ulang pada test set setelah kuantisasi, dengan metrik yang sama dengan saat training. Model yang akurasinya turun 5 poin tetapi tidak ada yang mengukur = bom waktu produksi.",
      },
      hints: [
        "skala = max|w|/127; q = round(w/skala) jadi int8.",
        "w_hat = q*skala; err = maks |w - w_hat|.",
        "MB = parameter * byte / 1e6; bulatkan 2 desimal.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(3)\n\nw = np.random.randn(1000).astype(np.float32)  # bobot FP32\nparams = 109386\n\n# TULIS KODEMU: kuantisasi INT8 + ukuran model\nskala = \nq = \nnq = \nw_hat = \nerr = \nmb_fp32 = \nmb_int8 = \n\nprint(f"fp32_byte={w.nbytes}  int8_byte={nq}  err={err:.4f}  model_fp32={mb_fp32}MB  model_int8={mb_int8}MB")`,
        lockLines: 5,
        solution: `import numpy as np\nnp.random.seed(3)\n\nw = np.random.randn(1000).astype(np.float32)  # bobot FP32\nparams = 109386\n\n# TULIS KODEMU: kuantisasi INT8 + ukuran model\nskala = np.abs(w).max()/127\nq = np.round(w/skala).astype(np.int8)\nnq = q.nbytes\nw_hat = q.astype(np.float32)*skala\nerr = float(np.abs(w - w_hat).max())\nmb_fp32 = round(params*4/1e6, 2)\nmb_int8 = round(params*1/1e6, 2)\n\nprint(f"fp32_byte={w.nbytes}  int8_byte={nq}  err={err:.4f}  model_fp32={mb_fp32}MB  model_int8={mb_int8}MB")`,
        checks: [
          { kind: "equal", task: "t1", name: "nq", value: 1000, tol: 1e-9, label: "`nq` seharusnya 1000", msg: "INT8 = 1 byte per bobot x 1000 = 1000 byte." },
          { kind: "equal", task: "t2", name: "err", value: 0.0146, tol: 0.001, label: "`err` sekitar 0.0146", msg: "Error maksimum dekuantisasi = 0.0146." },
          { kind: "equal", task: "t3", name: "mb_fp32", value: 0.44, tol: 0.01, label: "`mb_fp32` seharusnya 0.44", msg: "109386x4/1e6 = 0.44 MB." },
          { kind: "equal", task: "t3", name: "mb_int8", value: 0.11, tol: 0.01, label: "`mb_int8` seharusnya 0.11", msg: "109386x1/1e6 = 0.11 MB." },
          { kind: "stdout_matches", task: "t2", pattern: "fp32_byte=4000\\s+int8_byte=1000\\s+err=0\\.0146", label: "`print` menampilkan hasil kuantisasi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "q=round(w/s)+z. Ukuran = param x byte. Evaluasi ulang setelah kuantisasi, wajib.",
    },
    {
      id: "onnx-serving",
      eyebrow: "Langkah 3 · ONNX & serving",
      title: "ONNX: paspor model lintas framework",
      prose: [
        "Model dilatih di PyTorch, tetapi server produksi memakai runtime C++ atau HP butuh format mobile. ONNX (Open Neural Network Exchange) adalah format perantara: ekspor komputasi graph sekali, jalankan di ONNX Runtime / TensorRT — atau konversi ke format target (CoreML, TFLite) yang umumnya TIDAK menjalankan ONNX secara langsung sebagai runtime native. Satu model, banyak target — tetapi tiap target butuh jalur konversinya sendiri dan verifikasi paritasnya sendiri.",
        "Serving = membungkus model menjadi layanan: batching (kumpulkan beberapa request jadi satu matmul besar — GPU lapar!), caching, versioning (v1 vs v2 untuk rollback), dan monitoring (distribusi input, latensi, drift). Model tanpa serving yang baik = mesin Ferrari tanpa jalan.",
        "Distilasi (knowledge distillation): latih model kecil meniru output model besar (bukan label keras, melainkan distribusi peluang lunaknya). Model 40 juta parameter bisa mencapai 95%+ performa model 400 juta — karena yang ditransfer adalah pengetahuan, bukan parameter.",
        "💡 Intuisi: soft label adalah guru yang baik. Label keras berkata benar/salah; distribusi guru berkata kucing 80%, anjing 15%, rubah 5% — informasi kemiripan antar kelas yang tak ternilai untuk murid kecil.",
        "Mengapa ONNX penting — cerita nyata. Model dilatih di PyTorch, tim serving memakai Triton/ONNX Runtime, tim mobile memakai TFLite. TANPA format bersama: 3 konversi manual, 3 sumber bug. DENGAN ONNX: ekspor sekali (torch.onnx.export) sebagai format perantara, lalu jalankan di ONNX Runtime/TensorRT atau konversi ke TFLite/CoreML — satu sumber kebenaran untuk graph-nya, dengan satu langkah konversi yang terdokumentasi per target. Waktu konversi: 1 jam vs 1 pekan debugging inkonsistensi. Standar = membosankan = bekerja.",
        "Jebakan ekspor ONNX — 3 yang umum. (1) Op tidak didukung (custom op PyTorch) → sederhanakan atau tulis plugin — dan ingat target akhirnya: op yang didukung ONNX Runtime belum tentu ada padanannya setelah konversi ke CoreML/TFLite, jadi uji di runtime TARGET, bukan hanya di ONNX. (2) Dynamic axes lupa dideklarasikan → batch size TERKUNCI 1 di produksi (throughput hancur!). (3) Hasil numerik sedikit beda (1e-5) → normal (presisi), tetapi VERIFIKASI: bandingkan output PyTorch vs ONNX di 100 sampel, toleransi 1e-4 — lalu ulangi verifikasi yang sama SETELAH konversi ke format target (CoreML/TFLite), karena tiap konversi bisa menggeser angka. Ekspor tanpa verifikasi = deploy keyakinan, bukan model.",
        "Versi opset ONNX — jebakan keempat. Ekspor dengan opset 17 tetapi runtime hanya dukung 15 = error misterius di produksi. Aturan: cek versi ONNX Runtime/TFLite TARGET DULU, ekspor dengan opset yang didukung (biasanya 2 versi di bawah terbaru). “Terbaru” ≠ “terbaik” untuk kompatibilitas. Satu baris dokumentasi versi = menghemat 1 hari debugging “kok di saya jalan”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: ekspor ke ONNX otomatis mempercepat",
        type: "pitfall",
        body: "Yang benar: ONNX hanya format — kecepatan datang dari optimasi runtime (fusion operator, TensorRT) dan hardware. Ekspor tanpa optimasi bisa sama cepatnya dengan aslinya. Ukur latensi sebelum/sesudah di hardware target; jangan klaim speedup dari nama format.",
      },
      reference: "ONNX = format portable. Kecepatan = runtime + hardware. Distilasi = murid kecil meniru guru besar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: strategi deploy apa?",
      prose: [
        "Skenario 1 — Server GPU, latensi longgar. → FP16 + batching + ONNX Runtime. Alasan: termudah, akurasi praktis utuh, throughput naik 2×.",
        "Skenario 2 — HP/edge, batas puluhan MB. → INT8 (PTQ dulu) + format mobile (TFLite/CoreML). Alasan: 4× lebih kecil, inferensi integer cepat di chip mobile.",
        "Skenario 3 — PTQ menurunkan akurasi di bawah syarat. → QAT atau distilasi ke arsitektur kecil. Alasan: QAT melatih ketahanan terhadap kuantisasi; distilasi memindahkan pengetahuan ke tubuh yang lebih kecil.",
        "Skenario 4 — Butuh update model sering. → Versioning + canary deploy (5% trafik ke v2 dulu). Alasan: rollback instan bila v2 bermasalah; tanpa versioning, deploy = judi.",
        "Skenario 5 — Latensi ultra-ketat (< 10 ms). → TensorRT + batch 1 + pruning. Alasan: fusion operator dan presisi rendah memangkas setiap milidetik.",
        "Aturan praktis 10 detik: (1) ukur batas target (MB, ms) dulu; (2) PTQ → ukur → QAT/distilasi bila perlu; (3) evaluasi metrik bisnis pasca-kompresi; (4) versioning + monitoring sejak hari pertama.",
        "Metodologi benchmark — yang benar. (1) Device TARGET (HP kentang!), bukan laptop. (2) Ukur p50 DAN p99 (rata-rata menipu; p99 = pengalaman pengguna sial). (3) Kondisi realistis: baterai 20 persen (throttling!), HP panas, aplikasi lain jalan. (4) 100 inferensi, buang 10 pertama (warmup). Contoh: rata-rata 40ms tetapi p99 400ms (throttling) = TIDAK LULUS untuk real-time. Benchmark asal-asalan = keputusan deploy berdasarkan kebohongan.",
        "Rencana fallback — wajib ada. Jika kuantisasi GAGAL (akurasi jatuh >1 persen): (1) kuantisasi parsial (layer sensitif tetap FP32); (2) distilasi; (3) model lebih kecil dari awal. Jika latency GAGAL: (1) batch=1 optimasi; (2) delegasi ke server (hybrid); (3) fitur dikurangi. Tulis fallback SEBELUM deploy, bukan saat insiden jam 2 pagi. Deploy tanpa fallback = terjun tanpa parasut cadangan.",
      ],
      note: {
        title: "💡 Intuisi: kuantisasi = deal terbaik",
        body: "INT8: 4x lebih kecil, 2–4x lebih cepat, akurasi −0,3 persen. Tidak ada teknik lain dengan rasio sebaik ini. Urutan optimasi deploy: (1) kuantisasi DULU (murah, aman); (2) jika belum cukup → distilasi/pruning; (3) jika masih belum → arsitektur lebih kecil. Yang melompat ke (3) tanpa (1) = membuang deal terbaik.",
      },
      tasks: [],
      reference: "Ukur batas target dulu. PTQ pertama, QAT/distilasi bila perlu. Versioning wajib.",
    },
    {
      id: "minicase-batas",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Batas 50 MB: cukupkah kuantisasi saja?",
      prose: [
        "Model 200 juta parameter FP32 = 800 MB. Target: aplikasi < 50 MB. Hitung opsi: INT8 saja → 200 MB — masih 4× di atas batas. Kuantisasi saja TIDAK cukup; butuh kombinasi: distilasi ke 40 juta parameter (÷5) + INT8 (÷4) = 40 MB — masuk batas dengan margin.",
        "Inilah aritmetika deploy: tiap teknik memberi faktor pengali, dan faktor-faktor dikalikan. INT8 (÷4) × distilasi (÷5) = ÷20. Rancang kombinasi dari target mundur ke belakang: 800 MB ÷ 20 = 40 MB < 50 MB. Tanpa hitungan ini, tim akan mencoba INT8, gagal, lalu panik.",
        "Pembahasan: tradeoff akurasi tiap langkah harus diukur: INT8 −0,3%, distilasi −1–2% → total −1,5–2,5%. Bila syarat bisnis toleransi 3%, kombinasi ini lolos. Keputusan deploy = optimasi terkendala: minimalkan ukuran dengan kendala akurasi ≥ syarat. Dan ingat: ukuran yang dibandingkan dengan batas 50 MB BUKAN hanya bobot — evaluasi deploy yang lengkap mencakup artefak non-bobot: metadata (nama fitur, rentang normalisasi, versi model — 0,3 MB di lab MLE32), scale/zero-point kuantisasi per tensor, indeks sparse bila memakai pruning unstructured, runtime dan library pendukung yang ikut ter-paket, tokenizer/vocabulary untuk model teks, serta workspace dan activation memory saat inferensi (aktivasi intermediate bisa lebih besar dari bobotnya untuk input panjang — KV cache LLM adalah contoh ekstremnya). Model 40 MB bobot + runtime 15 MB + tokenizer 5 MB = 60 MB paket — GAGAL batas 50 MB walau 'modelnya' 40 MB. Ukur ukuran PAKET AKHIR yang terinstal, bukan ukuran bobot di notebook.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung ukuran FP32, INT8, dan kombinasi distilasi+INT8 (MB)" },
      ],
      expected: "fp32=800MB  int8=200MB  kombo=40MB",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira satu teknik cukup tanpa menghitung. Selalu kalikan faktor-faktornya dan bandingkan dengan batas — aritmetika 2 menit mencegah redesign 2 minggu.",
      },
      hints: [
        "FP32 = 200e6 * 4 byte / 1e6.",
        "INT8 = /4 dari FP32; kombo = 40e6 * 1 byte / 1e6.",
        "fp32 = 200_000_000*4/1e6",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(10)\n\np_besar, p_kecil = 200_000_000, 40_000_000\n\n# TULIS KODEMU\nfp32 = \nint8 = \nkombo = \n\nprint(f"fp32={fp32:.0f}MB  int8={int8:.0f}MB  kombo={kombo:.0f}MB")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(10)\n\np_besar, p_kecil = 200_000_000, 40_000_000\n\n# TULIS KODEMU\nfp32 = p_besar*4/1e6\nint8 = p_besar*1/1e6\nkombo = p_kecil*1/1e6\n\nprint(f"fp32={fp32:.0f}MB  int8={int8:.0f}MB  kombo={kombo:.0f}MB")`,
        checks: [
          { kind: "equal", task: "t1", name: "fp32", value: 800, tol: 1e-9, label: "`fp32` seharusnya 800", msg: "200jt x 4 byte = 800 MB." },
          { kind: "equal", task: "t1", name: "int8", value: 200, tol: 1e-9, label: "`int8` seharusnya 200", msg: "200jt x 1 byte = 200 MB. Masih di atas 50 MB!" },
          { kind: "equal", task: "t1", name: "kombo", value: 40, tol: 1e-9, label: "`kombo` seharusnya 40", msg: "40jt x 1 byte = 40 MB. Masuk batas." },
          { kind: "stdout_matches", task: "t1", pattern: "fp32=800MB\\s+int8=200MB\\s+kombo=40MB", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kalikan faktor kompresi; bandingkan dengan batas. Rancang mundur dari target.",
    },
    {
      id: "pruning-distilasi",
      eyebrow: "Langkah 6 · Pruning & distilasi",
      title: "Pruning & Distilasi: memangkas bobot, mendidik murid",
      prose: [
        "Kuantisasi membuat tiap bobot lebih murah; pruning bertanya apakah bobot itu perlu ada sama sekali. Pruning = menghapus bobot/koneksi yang kontribusinya kecil, lalu fine-tune singkat agar network pulih. Aturan praktis: hapus 30–50% bobot terkecil (|w| < τ), akurasi biasanya turun < 1 poin setelah fine-tune 5–10 epoch — lalu pruning lagi (iterative pruning) bila masih kurang kecil.",
        "Dua jenis pruning yang beda nasib. Unstructured pruning menghapus bobot INDIVIDUAL yang tersebar — matriksnya jadi sparse, berlubang-lubang. Structured pruning menghapus UNIT UTUH: satu filter konvolusi, satu neuron, satu attention head — matriksnya tetap dense, hanya dimensinya menyusut. Perbedaannya menentukan apakah kamu mendapat speedup NYATA atau sekadar angka sparsity yang indah di laporan.",
        "💡 Intuisi: unstructured = mencabut ubin acak dari lantai (lantai berlubang tapi tetap seluas dulu — tukang tetap harus berjalan memutarinya). Structured = membongkar satu ruangan utuh (lantai menyusut, tukang jalan lebih cepat). Hardware umum (CPU/GPU) hanya mempercepat yang kedua tanpa kernel sparse khusus.",
        "Contoh hitungan nyata — model 100 juta parameter FP32 = 400 MB. Unstructured pruning 50%: tersisa 50 juta bobot nonzero. Disimpan sebagai sparse CSR, tiap nonzero butuh 4 byte nilai + 4 byte indeks = 8 byte → 50 juta × 8 byte = 400 MB. SAMA BESAR dengan dense! Tanpa kernel sparse, pruning unstructured = kerja tanpa hasil. Structured pruning 50% (setengah filter dibuang): 50 juta parameter dense = 200 MB, dan perkalian matriksnya ~2× lebih cepat di GPU biasa. Lab di bawah membuktikan aritmetikanya — angka yang mengejutkan banyak orang.",
        "Knowledge distillation = jalan lain: bukan memangkas model lama, melainkan MENDIDIK model baru yang kecil. Guru (besar, akurat) melatih murid (kecil) — murid tidak belajar dari label keras (kucing/anjing), melainkan dari distribusi LUNAK guru: 'kucing 80%, anjing 15%, rubah 5%'. Informasi kemiripan antar kelas inilah yang membuat murid 10× lebih kecil bisa mengejar 95%+ performa guru.",
        "Loss distilasi memadukan dua sinyal: tiru label keras, dan tiru distribusi guru yang dilembutkan temperature. Hasil tipikal: guru 100 juta parameter (400 MB) akurasi 94,0%; murid 25 juta parameter (100 MB) yang dilatih label keras hanya 91,5% — tetapi dengan soft label guru mencapai 93,2%. Selisih 0,8 poin untuk ukuran 4× lebih kecil. Temperature T (biasanya 3–5) melembutkan distribusi; faktor T² mengkompensasi gradien yang menyusut.",
        "💡 Intuisi: label keras = guru yang hanya berkata 'salah' atau 'benar'. Soft label = guru yang menjelaskan 'jawabanmu salah, tapi alasanmu 80% benar — yang mengecohmu adalah kemiripan anjing dan rubah'. Murid yang diajari alasan belajar jauh lebih efisien daripada murid yang hanya dihakimi.",
        "Kapan pilih yang mana. Pruning: arsitektur harus TETAP (mis. backbone yang dipakai banyak downstream task), budget training minim (fine-tune singkat cukup), target hardware umum. Distilasi: arsitektur BOLEH BERBEDA (guru Transformer → murid CNN kecil), punya budget 1× training penuh, butuh lompatan ukuran besar (10×). Kombinasi standar industri: distilasi → pruning terstruktur → kuantisasi INT8 — tiga faktor pengali dikalikan.",
        "Hitungan rantai kompresi: guru 100M FP32 = 400 MB. Distilasi ke murid 25M (÷4) → 100 MB. Structured pruning 50% (÷2) → 50 MB. Kuantisasi INT8 (÷4) → 12,5 MB. Total ÷32 dengan akurasi turun ~1,5–2,5 poin. Inilah cara 400 MB menjadi 12,5 MB tanpa keajaiban — hanya aritmetika yang direncanakan dari awal.",
      ],
      formula: String.raw`\mathcal{L} = \alpha\,\mathrm{CE}\!\left(y, \sigma(z_s)\right) + (1-\alpha)\,T^2\,\mathrm{KL}\!\left(\sigma\!\left(\tfrac{z_t}{T}\right) \,\Big\|\, \sigma\!\left(\tfrac{z_s}{T}\right)\right)`,
      formulaNote: "y = label keras; z_t, z_s = logit guru & murid; σ = softmax; T = temperature (3–5) yang melembutkan distribusi guru; KL = divergensi Kullback-Leibler (jarak dua distribusi); α = bobot (0,1–0,3 tipikal) antara 'tirulah guru' vs 'percayalah label'; faktor T² mengkompensasi gradien yang menyusut akibat pembagian T.",
      tasks: [
        { id: "t1", text: "Hitung `dense` = ukuran FP32 guru 100 juta parameter (MB)" },
        { id: "t2", text: "Hitung `sparse50` = ukuran CSR setelah unstructured pruning 50% — 8 byte per bobot nonzero (MB)" },
        { id: "t3", text: "Hitung `struct50` = ukuran setelah structured pruning 50%, tetap dense (MB)" },
        { id: "t4", text: "Hitung `murid` = ukuran murid 25 juta parameter FP32 (MB)" },
      ],
      expected: "dense=400MB sparse50=400MB struct50=200MB murid=100MB",
      note: {
        title: "🚨 Mitos: pruning 50% = model 2× lebih kecil dan 2× lebih cepat",
        type: "pitfall",
        body: "Yang benar: hanya untuk STRUCTURED pruning di hardware umum. Unstructured pruning 50% tanpa kernel sparse = ukuran SAMA (lab membuktikan: 400 MB tetap 400 MB) dan kecepatan SAMA — GPU tetap mengalikan matriks penuh termasuk angka nol. Banyak laporan hanya memamerkan sparsity tanpa speedup nyata. Selalu tanyakan: 'sparsity ini diukur sebagai apa — storage atau latensi, di hardware apa?'",
      },
      hints: [
        "dense = 100_000_000 * 4 byte / 1e6.",
        "nonzero tersisa = 100jt x (1 - 0.5); tiap nonzero 8 byte (nilai + indeks).",
        "structured: parameter tinggal setengah, tetap dense 4 byte.",
        "murid = 25_000_000 * 4 byte / 1e6.",
      ],
      code: {
        starter: `# Guru 100 juta param FP32; murid 25 juta; pruning 50%\nparams_guru = 100_000_000\nparams_murid = 25_000_000\nsparsity = 0.5\n\n# TULIS KODEMU: ukuran penyimpanan (MB)\ndense = \nsparse50 = \nstruct50 = \nmurid = \n\nprint(f"dense={dense:.0f}MB sparse50={sparse50:.0f}MB struct50={struct50:.0f}MB murid={murid:.0f}MB")`,
        lockLines: 4,
        solution: `# Guru 100 juta param FP32; murid 25 juta; pruning 50%\nparams_guru = 100_000_000\nparams_murid = 25_000_000\nsparsity = 0.5\n\n# TULIS KODEMU: ukuran penyimpanan (MB)\ndense = params_guru*4/1e6\nsparse50 = params_guru*(1-sparsity)*8/1e6\nstruct50 = params_guru*(1-sparsity)*4/1e6\nmurid = params_murid*4/1e6\n\nprint(f"dense={dense:.0f}MB sparse50={sparse50:.0f}MB struct50={struct50:.0f}MB murid={murid:.0f}MB")`,
        checks: [
          { kind: "equal", task: "t1", name: "dense", value: 400, tol: 1e-9, label: "`dense` seharusnya 400", msg: "100jt x 4 byte = 400 MB." },
          { kind: "equal", task: "t2", name: "sparse50", value: 400, tol: 1e-9, label: "`sparse50` seharusnya 400", msg: "50jt nonzero x 8 byte = 400 MB — sama besar! Inilah jebakannya." },
          { kind: "equal", task: "t3", name: "struct50", value: 200, tol: 1e-9, label: "`struct50` seharusnya 200", msg: "50jt x 4 byte = 200 MB, dan benar-benar lebih cepat." },
          { kind: "equal", task: "t4", name: "murid", value: 100, tol: 1e-9, label: "`murid` seharusnya 100", msg: "25jt x 4 byte = 100 MB." },
          { kind: "stdout_matches", task: "t2", pattern: "dense=400MB\\s+sparse50=400MB\\s+struct50=200MB\\s+murid=100MB", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Unstructured tanpa sparse kernel = ilusi. Structured + distilasi + kuantisasi = rantai kompresi nyata.",
    },
    {
      id: "tensorrt-kv-cache",
      eyebrow: "Langkah 7 · TensorRT & KV cache",
      title: "TensorRT & KV Cache: optimasi mesin inferensi",
      prose: [
        "Kuantisasi, pruning, dan distilasi memperkecil MODEL. TensorRT menyerang sisi lain: MESIN yang menjalankannya. TensorRT (NVIDIA) mengambil graph komputasi (biasanya dari ONNX) dan mengompilasinya menjadi engine yang dioptimasi untuk GPU spesifik: operator fusion, kalibrasi presisi, dan auto-tuning kernel. Hasil tipikal: 2–6× lebih cepat dari PyTorch eager di GPU yang sama — tanpa mengubah satu bobot pun.",
        "Tiga senjata TensorRT. (1) Operator fusion: Conv + BatchNorm + ReLU yang tadinya 3 kernel launch (3× baca-tulis memori) digabung jadi 1 kernel — inferensi modern sering memory-bound, bukan compute-bound, jadi mengurangi trafik memori = mempercepat. (2) Precision calibration: FP16/INT8 otomatis dengan kalibrasi seperti kuantisasi. (3) Kernel auto-tuning: saat build, TensorRT mencoba puluhan implementasi kernel dan memilih yang tercepat untuk ukuran tensor & GPU-MU — engine yang sama belum tentu optimal di GPU lain.",
        "💡 Intuisi: PyTorch eager = koki yang membaca resep baris per baris setiap kali masak. TensorRT = koki yang menghafal seluruh resep, menyiapkan semua bahan di meja (fusion), dan memilih pisau paling tajam untuk tiap potongan (auto-tuning). Masakannya sama; dapurnya jauh lebih efisien.",
        "Contoh hitungan nyata — ResNet-50, batch 1, GPU T4. PyTorch FP32 eager: 8,2 ms. TensorRT FP16: 1,9 ms (4,3×). TensorRT INT8 terkalibrasi: 1,2 ms (6,8×). Untuk layanan 1.000 QPS: butuh ~9 GPU tanpa optimasi vs ~2 GPU dengan TensorRT INT8 — selisih biaya infrastruktur ~US$4.000/bulan per layanan. Optimasi inferensi = keputusan finansial, bukan hobi.",
        "Sekarang sisi LLM: mengapa decoding lambat, dan apa itu KV cache. Model autoregresif menghasilkan token satu per satu; untuk token ke-n, attention 'melihat' n−1 token sebelumnya. Tanpa cache, tiap langkah menghitung ulang Key & Value SELURUH token sebelumnya → biaya O(n²) dan recompute raksasa. KV cache MENYIMPAN proyeksi Key/Value token-token lampau; tiap langkah baru hanya menghitung 1 token + membaca cache. Decode 4.096 token tanpa cache bisa 50–100× lebih lambat.",
        "Tetapi cache = memori. Per token per layer: 2 (K dan V) × d_model × n_layers × byte. Contoh nyata — model 7B (32 layer, d=4096), FP16: 2 × 32 × 4096 × 2 byte = 524.288 byte ≈ 0,5 MB per token. Satu sekuens 4.096 token → ±2 GB. Batch 8 sekuens → ±17 GB KV cache SAJA. Modelnya sendiri 14 GB (FP16) — total ±31 GB > VRAM 24 GB = OOM. Inilah tradeoff inti serving LLM: kecepatan decode dibayar dengan VRAM yang tumbuh sebanding batch × panjang sekuens.",
        "💡 Intuisi: KV cache = notulen rapat. Tanpa notulen, tiap kali mau bicara kamu membaca ulang SELURUH transkrip (lambat). Dengan notulen, kamu membaca ringkasannya saja (cepat) — tetapi notulennya sendiri butuh lemari arsip (memori) yang membesar setiap rapat makin panjang.",
        "Continuous batching (vLLM) — optimasi antrean. Batching klasik: kumpulkan 8 request, tunggu yang paling lambat selesai, baru proses 8 berikutnya — GPU menganggur saat 7 sudah selesai. Continuous batching: tiap iterasi decode, request yang selesai KELUAR dan request baru MASUK ke batch yang sedang berjalan. Utilisasi GPU naik, throughput 2–4× vs batching statis, latensi antrean turun. Ini topik serving LLM tersendiri — cukup pahami idenya di sini.",
        "Membaca tradeoff memori vs kecepatan. Tiga tuas bila OOM: (1) kecilkan batch atau batasi max tokens — throughput turun; (2) kuantisasi KV cache (INT8/FP8) — hemat ~2× memori, kualitas hampir utuh; (3) paged attention (vLLM) — alokasi memori per blok seperti virtual memory, fragmentasi turun. Aturan: ukur dulu profil memori per skenario (batch × seq_len), JANGAN menebak — OOM di produksi = downtime.",
        "Kapan TensorRT, kapan tidak. GPU NVIDIA + model relatif statis (bentuk input stabil) = TensorRT menang besar. Model dengan bentuk input liar (LLM, panjang sekuens bervariasi) = rebuild engine mahal tiap perubahan; vLLM/TGI dengan CUDA graph + torch.compile sering lebih praktis. Pilih mesin sesuai medannya — tidak ada satu optimizer untuk semua.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Engine TensorRT dikompilasi UNTUK arsitektur GPU spesifik (T4 ≠ A10 ≠ L4). Pindah GPU = rebuild + revalidasi akurasi/latensi. Dokumentasikan pasangan (versi TensorRT, arsitektur GPU, opset ONNX) sebagai bagian artefak deploy — engine tanpa metadata = tidak bisa direproduksi saat insiden.",
      },
      reference: "TensorRT = optimasi mesin (fusion, kalibrasi, auto-tuning). KV cache = decode cepat dibayar VRAM ∝ batch × seq_len.",
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 8 · Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang kompresi dan serving model.",
      ],
      note: {
        title: "💡 Intuisi: ukur di HP kentang",
        body: "Latency di laptop (8ms) vs HP kentang (240ms) = 30x beda! Benchmark HARUS di device TARGET TERLEMAH yang didukung. Aturan: jika mendukung HP 2 jutaan, uji di HP 2 jutaan. “Di HP saya lancar” (flagship) = kebohongan yang tidak disengaja. Device lab ≠ device pengguna — selalu.",
      },
      tasks: [],
      summary: [
        "Kuantisasi INT8: q = round(w/s)+z; ukuran ÷4 dengan akurasi −0,3% tipikal.",
        "Evaluasi ulang pasca-kuantisasi wajib — dengan metrik bisnis yang sama.",
        "PTQ dulu (cepat); QAT bila akurasi tidak memenuhi syarat.",
        "ONNX = format portable; kecepatan datang dari runtime + hardware.",
        "Distilasi: murid kecil meniru distribusi lunak guru besar.",
      ],
      next: { label: "DLE11 — Generative: VAE, GAN, Diffusion", href: "/v2/learn/dle11-generative" },
      quiz: [
        {
          q: "Model 200 juta parameter FP32 = 800 MB, target < 50 MB. Strategi?",
          options: [
            { text: "INT8 saja", why: "200 MB — masih 4× di atas batas." },
            { text: "Distilasi ke 40 juta + INT8 = 40 MB", why: "Faktor ÷5 × ÷4 = ÷20: 800 → 40 MB, masuk batas.", correct: true },
            { text: "FP16 saja", why: "400 MB — tidak cukup." },
            { text: "Tidak mungkin", why: "Kombinasi teknik membuatnya mungkin dengan tradeoff terukur." },
          ],
        },
        {
          q: "Setelah kuantisasi INT8, langkah wajib?",
          options: [
            { text: "Langsung deploy", why: "Kuantisasi selalu mengubah komputasi; dampaknya harus diukur." },
            { text: "Evaluasi ulang di test set dengan metrik bisnis yang sama", why: "Satu-satunya cara tahu tradeoff nyata: ukur, jangan asumsikan.", correct: true },
            { text: "Training ulang dari nol", why: "Itu QAT, hanya bila PTQ gagal memenuhi syarat." },
            { text: "Naikkan ke FP64", why: "Mundur: memperbesar tanpa alasan." },
          ],
        },
        {
          q: "ONNX mempercepat model karena?",
          options: [
            { text: "Formatnya sendiri", why: "Format hanya wadah; kecepatan dari optimasi runtime." },
            { text: "Optimasi runtime (fusion, TensorRT) + hardware target", why: "ONNX membuka akses ke runtime yang dioptimasi — itulah sumber speedup.", correct: true },
            { text: "Mengurangi parameter", why: "Parameter tetap sama; yang berubah representasi komputasi." },
            { text: "Selalu 10× lebih cepat", why: "Speedup bervariasi; ukur di hardware target." },
          ],
        },
        {
          q: "Keunggulan soft label dalam distilasi?",
          options: [
            { text: "Lebih keras dari label asli", why: "Terbalik: soft = distribusi peluang, lebih lunak." },
            { text: "Mengandung info kemiripan antar kelas (kucing 80%, anjing 15%)", why: "Pengetahuan relasional ini yang membuat murid kecil belajar efisien.", correct: true },
            { text: "Mempercepat training guru", why: "Guru sudah dilatih; distilasi soal murid." },
            { text: "Tidak ada keunggulan", why: "Literatur menunjukkan murid soft-label mengungguli murid label-keras." },
          ],
        },
        {
          q: "Kapan QAT dipilih atas PTQ?",
          options: [
            { text: "Selalu", why: "QAT 2–5× lebih lambat; hanya bila dibutuhkan." },
            { text: "Bila akurasi PTQ di bawah syarat bisnis", why: "QAT melatih ketahanan terhadap kuantisasi — bayar mahal hanya bila perlu.", correct: true },
            { text: "Tidak pernah", why: "Ada: model kecil/sensitif yang PTQ-nya rusak." },
            { text: "Bila ingin lebih cepat deploy", why: "QAT justru lebih lambat." },
          ],
        },
      ],
    },
  ],
};
