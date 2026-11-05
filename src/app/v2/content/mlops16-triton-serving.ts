import type { V2Lesson } from "../lib/types";

// Throughput per GPU: Flask per model 100 req/s vs Triton 600 req/s (dynamic batching + konkuren).
const FIG_TPUT = `<svg viewBox=\"0 0 480 220\" role=\"img\" aria-label=\"Throughput per GPU: Flask per model 100 request per detik, Triton 600 request per detik.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\"><line x1=\"210\" y1=\"30\" x2=\"210\" y2=\"180\"/></g>
<g font-size=\"12\" fill=\"var(--text)\" font-family=\"var(--font-ui)\" text-anchor=\"end\">
<text x=\"202\" y=\"84\">Flask per model</text><text x=\"202\" y=\"154\">Triton</text>
</g>
<rect x=\"210\" y=\"60\" width=\"40\" height=\"30\" rx=\"3\" fill=\"var(--c4)\"/>
<text x=\"258\" y=\"80\" font-size=\"11\" font-weight=\"600\" fill=\"var(--text)\" font-family=\"var(--font-ui)\">100 req/s</text>
<rect x=\"210\" y=\"130\" width=\"240\" height=\"30\" rx=\"3\" fill=\"var(--c1)\"/>
<text x=\"458\" y=\"150\" font-size=\"11\" font-weight=\"600\" fill=\"var(--text)\" font-family=\"var(--font-ui)\" text-anchor=\"end\">600 req/s (6x)</text>
<text x=\"335\" y=\"200\" font-size=\"11\" fill=\"var(--text-muted)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">throughput per 1 GPU — batching + eksekusi konkuren</text>
</svg>`;

export const mlops16: V2Lesson = {
  slug: "mlops16-triton-serving",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps16 — Serving Klasik: Triton & BentoML",
  estMinutes: 48,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Lima GPU menganggur untuk lima model",
      prose: [
        "Februari 2026. TokoKita, e-commerce Indonesia, punya 5 model ML di produksi: rekomendasi (XGBoost), fraud (LightGBM), OCR struk (PyTorch), embedding produk (ONNX), churn (TensorFlow). Masing-masing dibungkus Flask oleh tim berbeda, masing-masing duduk di GPU sendiri. Total: 5 GPU × $2.000 = $10.000/bulan. Utilisasi rata-rata: 12%.",
        "Lalu tim data science melatih model ke-6 (propensity beli). Permintaan: `tambah 1 GPU lagi`. Head of Engineering, Sinta, menolak: `Kita tidak punya masalah GPU — kita punya masalah ARSITEKTUR.` Ia menunjuk dashboard: 5 GPU menganggur 88% waktunya, tapi tiap model tetap butuh `rumahnya sendiri` karena serving-nya custom dan tidak bisa berbagi.",
        "Twist-nya: Sinta memigrasikan kelimanya ke SATU model server — NVIDIA Triton Inference Server — dalam 3 minggu. Hasil: 1 GPU melayani 5 model sekaligus (concurrent execution), throughput naik 6x (dynamic batching), deploy model ke-6 = tambah 1 folder, bukan 1 GPU. Tagihan: $10.000 → $2.500/bulan. Pelajaran: serving model klasik BUKAN `bungkus dengan Flask` — ia disiplin tersendiri dengan tool yang sudah matang.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan arsitektur Triton (model repository, backend, scheduler); (2) menghitung keuntungan dynamic batching dan concurrent execution dengan angka; (3) merancang ensemble/pre-postprocessing dalam satu server; (4) membandingkan Triton vs BentoML vs vLLM untuk skenario konkret; (5) menghitung kebutuhan GPU fleet dengan rumus kapasitas.",
        "Durasi 48 menit · 1 lab simulasi · 6 kuis · 1 chart · 1 mini-case. Daftar isi: 1) Cerita TokoKita · 2) Model repository: gudang yang rapi · 3) Dynamic batching & eksekusi konkuren · 4) Ensemble: pipeline dalam satu server · 5) Lab: simulasi batching · 6) Backend, protokol & kapan BUKAN Triton · 7) Peta keputusan · 8) Mini-case: hitungan TokoKita · 9) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Serving = bungkus model dengan Flask, selesai`",
        type: "pitfall",
        body: "Flask = 1 request 1 proses, tanpa batching, tanpa concurrent model, tanpa versioning, tanpa metrics standar. Untuk 1 model 10 req/s: cukup. Untuk 5 model 100 req/s: 5 Flask = 5 GPU menganggur + 5 cara deploy berbeda + 5 sumber bug. Triton = Flask yang sudah dewasa: batching, multi-model, multi-framework, observability — dalam 1 biner. (Ringkasan MLOps6: serving infra = endpoint REST/gRPC + autoscaling + strategi deploy; lesson ini = `mesin di dalam endpoint itu`.)",
      },
      reference: "5 GPU × 12% utilisasi = masalah arsitektur, bukan masalah GPU.",
    },
    {
      id: "repository",
      eyebrow: "Langkah 2 · Konsep",
      title: "Model repository: gudang yang rapi",
      prose: [
        "Triton dimulai dari MODEL REPOSITORY — direktori dengan struktur baku: tiap model punya folder berisi versi (`1/`, `2/`) + file `config.pbtxt`. Contoh: `model_repository/rekomendasi/{1/model.onnx, config.pbtxt}`. Config mendeklarasikan: backend (onnxruntime/pytorch/tensorrt/python), max_batch_size, instance_group (berapa copy model jalan paralel), shape dan dtype input/output. Satu file config = seluruh kontrak serving model itu — tidak ada kode serving yang ditulis manual.",
        "BACKEND = mesin eksekusi per framework. Triton mendukung banyak backend: TensorRT (tercepat di GPU NVIDIA), PyTorch (TorchScript), ONNX Runtime, OpenVINO (CPU Intel), Python (logika custom apa pun!), RAPIDS FIL (model klasik XGBoost/LightGBM/scikit-learn!). XGBoost dan LightGBM TokoKita jalan di backend FIL — tanpa Flask, tanpa FastAPI custom. Satu server, lima framework — inilah `multi-framework` yang dimaksud README resmi Triton.",
        "SCHEDULER: tiap model memilih strategi antrean — dynamic batching (kumpulkan request hingga BMAX atau timeout, eksekusi sekaligus) atau sequence batching (untuk model stateful: request berurutan dari sesi yang sama dijamin ke instance yang sama + state terjaga). Scheduler = otak yang membuat 1 GPU terasa seperti 5 GPU.",
        "Deploy semudah: `docker run --gpus=1 -v /models:/models nvcr.io/nvidia/tritonserver:26.09-py3 tritonserver --model-repository=/models` — dari README resmi (rilis 2.73.0, 11rb+ stars, BSD-3-Clause). Model baru = tambah folder + load eksplisit. Bandingkan dengan 5 Flask app yang masing-masing punya Dockerfile, requirements.txt, dan bug uniknya sendiri.",
        "Contoh isi config.pbtxt untuk model rekomendasi: `name: \"rekomendasi\"`, `backend: \"onnxruntime\"`, `max_batch_size: 8`, `instance_group [{ count: 2, kind: KIND_GPU }]`, plus deklarasi input (name, data_type: TYPE_FP32, dims: [128]) dan output. Tiga baris terpenting: backend (mesin apa), max_batch_size (seberapa besar rombongan), instance_group (berapa bus). Salah satu saja = performa anjlok atau OOM. Tidak perlu menebak: Model Analyzer (tool bawaan Triton) memprofiling otomatis puluhan kombinasi dan melaporkan throughput vs latensi p99.",
        "MODEL CONTROL MODE: `explicit` (model di-load manual via API — untuk produksi yang terkontrol) vs `poll` (Triton memindai repository berkala dan me-load model baru otomatis — untuk eksperimen). API load/unload model = fondasi GitOps untuk model: merge ke main → CI memvalidasi config → CD me-load versi baru. Model repository di Git + load API = serving yang bisa di-review seperti kode biasa.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: Triton = bandara, model = pesawat",
        body: "Flask per model = tiap maskapai membangun bandaranya sendiri (mahal, sepi). Triton = SATU bandara dengan banyak landasan (backend), menara kontrol (scheduler), dan jadwal keberangkatan (batching) — pesawat (model) tinggal daftar dan terbang. Utilisasi landasan 12% → 70% bukan karena pesawatnya lebih cepat, melainkan bandaranya pintar.",
      },
      reference: "Repository + config.pbtxt + backend + scheduler = seluruh kontrak serving.",
    },
    {
      id: "batching",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dynamic batching & eksekusi konkuren: dua mesin penghemat",
      prose: [
        "DYNAMIC BATCHING: request yang datang dalam window singkat digabung menjadi satu eksekusi GPU. GPU itu mesin paralel raksasa — mengeksekusi 8 request sekaligus hanya sedikit lebih lambat dari 1 request (60ms vs 40ms di simulasi lab), tapi throughput-nya 6–8x lipat. Dua parameter kunci: max_batch_size (B) dan max_queue_delay (berapa lama menunggu batch terisi). Terlalu besar = latensi naik; terlalu kecil = GPU menganggur.",
        "CONCURRENT MODEL EXECUTION: 5 model TokoKita berjalan BERSAMAAN di 1 GPU — scheduler membagi waktu GPU antar model sesuai antrean masing-masing. Model sepi (churn, 2 req/s) tidak memblokir model ramai (rekomendasi, 50 req/s). Inilah yang memangkas 5 GPU → 1: bukan kompresinya, melainkan BERBAGINYA. Satu GPU yang dibagi 5 model sibuk > 5 GPU yang masing-masing sepi.",
        "INSTANCE GROUP: satu model bisa punya N copy (instance) di GPU yang sama atau berbeda — untuk model yang latensinya kritis, 2 instance = 2x throughput tanpa batching (tanpa tambahan latensi antre!). Kombinasi instance + batching = dua tuas kapasitas yang independen: instance untuk latensi, batching untuk throughput.",
        "Matematika kapasitas: GPU yang dibutuhkan = ceil(λ × L / B) — λ = request per detik, L = latensi per eksekusi batch (detik), B = batch efektif. Contoh: λ=100, L=0,06, B=8 → 100×0,06/8 = 0,75 → 1 GPU. Tanpa batching (B=1): 6 GPU! Satu rumus ini menjelaskan 80% penghematan TokoKita — dan menjadi dasar kalkulator fleet di lab.",
        "Mengukur sebelum menebak: Performance Analyzer (perf_analyzer CLI bawaan Triton) mengirim request sintetis dan melaporkan throughput vs latensi untuk tiap ukuran batch — dalam 5 menit kamu tahu B optimal untuk modelmu, bukan tebakan. Aturan praktis: mulai dari preferred_batch_size 8 + max_queue_delay 10ms, ukur p99; naikkan B selama p99 masih di bawah SLO; berhenti saat GPU utilization > 85% (sisakan headroom untuk spike). Tuning batching = 1 jam kerja untuk penghematan permanen.",
      ],
      formula: String.raw`N_{GPU} = \left\lceil \frac{\lambda \cdot L}{B} \right\rceil`,
      formulaNote: "N_GPU = jumlah GPU; λ (lambda) = request per detik; L = latensi per eksekusi batch (detik); B = ukuran batch efektif. Contoh: 100 × 0,06 / 8 = 0,75 → 1 GPU. Tanpa batching (B=1) → 6 GPU. Batching = tuas kapasitas termurah: gratis, hanya konfigurasi!",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Batching selalu menambah latensi — buruk untuk real-time`",
        type: "pitfall",
        body: "Dynamic batching menambah max_queue_delay (mis. 10ms) TAPI mengurangi antrean (request tidak menunggu GPU yang sibuk serial). Efek bersih di load tinggi: latensi p99 TURUN — karena request ke-8 tidak menunggu 7 eksekusi serial. Di load rendah, set max_queue_delay kecil (5ms). Batching yang dikonfigurasi benar = latensi lebih baik, bukan lebih buruk.",
      },
      reference: "Batching = tuas throughput. Instance = tuas latensi. Konkuren = tuas utilisasi.",
    },
    {
      id: "ensemble",
      eyebrow: "Langkah 4 · Konsep",
      title: "Ensemble: pipeline dalam satu server",
      prose: [
        "Model produksi jarang sendirian: OCR struk TokoKita = preprocess gambar → deteksi teks (PyTorch) → postprocess → klasifikasi kategori. ENSEMBLE Triton merangkai ini dalam SATU server: scheduler mengeksekusi pipeline langkah-demi-langkah, data berpindah via GPU/shared memory — tanpa hop network antar service. Satu request masuk, satu respons keluar, satu round-trip.",
        "Untuk logika custom (business rules, feature engineering yang aneh): BUSINESS LOGIC SCRIPTING (BLS) — backend Python yang mengorkestrasi pemanggilan antar model DI DALAM Triton. Python backend = jalan keluar universal: apa pun yang tidak muat di backend standar, tulis sebagai model Python. Tidak ada alasan `tidak bisa` — hanya `belum ditulis`.",
        "BENTOML — sepupu Triton yang lebih muda: mengemas model + kode + dependensi menjadi satu artefak `bento`, dengan Yatai untuk orkestrasi. Filosofinya: developer experience dulu (dari notebook ke deploy dalam hitungan menit). Pilih BentoML untuk prototipe cepat 1–3 model; pilih Triton untuk fleet besar multi-framework yang butuh batching agresif dan TensorRT.",
        "Versioning: tiap model punya folder versi (`1/`, `2/`) — Triton bisa load/unload versi tanpa restart (explicit mode). Model v2 bisa hidup berdampingan dengan v1 — fondasi untuk canary dan rollback yang aman.",
        "KServe protocol — standar komunitas yang dipakai Triton untuk HTTP/REST dan gRPC — membuat klienmu portabel: kode klien yang bicara ke Triton hari ini bisa bicara ke server KServe lain besok tanpa rewrite. Inilah bedanya dengan API Flask custom: protokol standar = tidak terkunci vendor. Dan BentoML lebih dalam: `bento` mengemas model + kode preprocess + requirements + config dalam satu artefak berversi; `bentoml build` → `bentoml containerize` → Docker image siap. Pilih BentoML saat kecepatan eksperimen lebih penting dari efisiensi fleet; pindah ke Triton saat tagihan GPU mulai terasa.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: ensemble = dapur, bukan food court",
        body: "Lima microservice Flask = food court (tiap tenant masak sendiri, antre di kasir masing-masing, piring berpindah-pindah tangan). Ensemble Triton = SATU dapur dengan stasiun kerja (preprocess → model → postprocess): bahan mengalir di ban berjalan, satu pintu keluar. Latensi food court = jumlah antrean; latensi dapur = satu aliran.",
      },
      reference: "Ensemble = pipeline 1 round-trip. BLS/Python backend = jalan keluar universal. BentoML = DX cepat.",
    },
    {
      id: "lab-batching",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: simulasi dynamic batching + kalkulator fleet",
      prose: [
        "SIMULASI — jujur: lab ini mensimulasikan KEPUTUSAN KAPASITAS (bukan Triton asli — tidak ada GPU atau server di sini): dynamic batching vs eksekusi serial, dalam Python murni.",
        "Skenario: 48 request tiba tiap 5ms. Naive: tiap request dieksekusi serial 40ms (1 GPU, tanpa batching). Dynamic: kumpulkan hingga 8 request atau window 10ms, eksekusi satu batch 60ms. Bagian kedua: kalkulator fleet — 5 model @20 req/s; pola lama = 1 GPU per model; Triton = 1 GPU berkapasitas 600 req/s (batching + konkuren).",
        "Cara membaca: makespan naive 1920ms vs dynamic 960ms (speedup 2,00x, throughput 50 req/s); fleet: 5 GPU → 1 GPU (hemat 80%). Interpretasi: batching menggandakan throughput TANPA hardware baru — dan sharing fleet memangkas sisanya. Inilah aritmetika di balik $10.000 → $2.500/bulan.",
        "Coba eksplorasi: naikkan WAIT_MS jadi 50ms — apa yang terjadi pada makespan? (Petunjuk: menunggu terlalu lama = latensi sia-sia.) Turunkan BMAX jadi 2 — kapan batching tidak lagi worth it? Inilah tuning yang dilakukan Sinta di config.pbtxt Triton.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `naive(arr)` — eksekusi serial 40ms per request" },
        { id: "t2", text: "Implementasikan `dynamic(arr)` — batch ≤8 / window 10ms, 60ms per batch" },
        { id: "t3", text: "Hitung makespan, speedup, throughput + kalkulator fleet — jalankan" },
      ],
      expected: "naive=1920ms dynamic=960ms speedup=2.00x · fleet: 5 GPU → 1 GPU (hemat 80%)",
      note: {
        title: "💡 Intuisi: GPU benci menganggur, suka rombongan",
        body: "Menjalankan 1 request di GPU seperti menyewa bus untuk 1 penumpang — ongkos jalan, kursi kosong. Dynamic batching = menunggu penumpang lain 10ms agar bus penuh. 60ms untuk 8 penumpang vs 40ms untuk 1 penumpang: bus yang penuh selalu menang secara ekonomi. Dan ingat: batching bukan gratis — max_queue_delay yang terlalu besar membuat request sepi menunggu sia-sia. Atur window sekecil mungkin yang masih mengisi batch di traffic normalmu.",
      },
      hints: [
        "naive: t = max(t, arrival) + SERV_MS untuk tiap request.",
        "dynamic: batch = request yang tiba dalam [arr[i], arr[i]+WAIT_MS], maks BMAX; t = max(t, arr[i]) + BATCH_MS.",
        "fleet: math.ceil(5*20/600) GPU Triton vs 5 GPU pola lama.",
      ],
      code: {
        starter: `SERV_MS = 40.0\nBATCH_MS = 60.0\nBMAX = 8\nWAIT_MS = 10.0\narrivals = [i * 5.0 for i in range(48)]\n\n# TULIS KODEMU\ndef naive(arr):\n    ...\n\ndef dynamic(arr):\n    ...\n\n# AGREGASI (jangan ubah)\nimport math\nt_naive = naive(arrivals)\nt_dyn, b_dyn = dynamic(arrivals)\nprint(f"naive_makespan={t_naive:.0f}ms dynamic_makespan={t_dyn:.0f}ms batches={b_dyn}")\nprint(f"speedup={t_naive / t_dyn:.2f}x throughput_dyn={len(arrivals) / (t_dyn / 1000):.0f} req/s")\ngpu_naive, gpu_triton = 5, math.ceil(5 * 20 / 600.0)\nprint(f"fleet: naive_gpu={gpu_naive} triton_gpu={gpu_triton} hemat={(1 - gpu_triton / gpu_naive) * 100:.0f}%")`,
        lockLines: 6,
        solution: `SERV_MS = 40.0\nBATCH_MS = 60.0\nBMAX = 8\nWAIT_MS = 10.0\narrivals = [i * 5.0 for i in range(48)]\n\n# TULIS KODEMU\ndef naive(arr):\n    t = 0.0\n    for a in arr:\n        t = max(t, a) + SERV_MS\n    return t\n\ndef dynamic(arr):\n    t, i, n = 0.0, 0, len(arr)\n    batches = 0\n    while i < n:\n        start = max(t, arr[i])\n        j = i\n        while j < n and j - i < BMAX and arr[j] <= arr[i] + WAIT_MS:\n            j += 1\n        t = start + BATCH_MS\n        batches += 1\n        i = j\n    return t, batches\n\n# AGREGASI (jangan ubah)\nimport math\nt_naive = naive(arrivals)\nt_dyn, b_dyn = dynamic(arrivals)\nprint(f"naive_makespan={t_naive:.0f}ms dynamic_makespan={t_dyn:.0f}ms batches={b_dyn}")\nprint(f"speedup={t_naive / t_dyn:.2f}x throughput_dyn={len(arrivals) / (t_dyn / 1000):.0f} req/s")\ngpu_naive, gpu_triton = 5, math.ceil(5 * 20 / 600.0)\nprint(f"fleet: naive_gpu={gpu_naive} triton_gpu={gpu_triton} hemat={(1 - gpu_triton / gpu_naive) * 100:.0f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "makespan 1920/960", msg: "Makespan harus naive=1920ms, dynamic=960ms, 16 batch.", pattern: "naive_makespan=1920ms dynamic_makespan=960ms batches=16" },
          { kind: "stdout_matches", task: "t3", label: "speedup 2.00x", msg: "Speedup dynamic vs naive harus 2.00x, throughput 50 req/s.", pattern: "speedup=2\\.00x throughput_dyn=50 req/s" },
          { kind: "stdout_matches", task: "t3", label: "fleet 5→1", msg: "Fleet harus 5 GPU pola lama vs 1 GPU Triton (hemat 80%).", pattern: "fleet: naive_gpu=5 triton_gpu=1 hemat=80%" },
        ],
      },
      reference: "Simulasi keputusan kapasitas (bukan Triton asli). Batching 2x; sharing fleet 5→1 GPU.",
    },
    {
      id: "backend",
      eyebrow: "Langkah 6 · Pendalaman",
      title: "Backend, protokol & kapan BUKAN Triton",
      prose: [
        "BACKEND LENGKAP (dari README resmi triton-inference-server — rilis 2.73.0 / container 26.09, 11rb+ stars, lisensi BSD-3-Clause): TensorRT, PyTorch, ONNX Runtime, OpenVINO, Python, RAPIDS FIL — plus C API dan Java API untuk edge/in-process. Platform: GPU NVIDIA, CPU x86/ARM, AWS Inferentia, Jetson/JetPack (edge!). Satu biner, semua target — dari data center sampai perangkat tepi.",
        "PROTOKOL: HTTP/REST + gRPC berbasis KServe protocol (standar komunitas) — klien Python/C++/Java tersedia; bahkan bisa mengirim JPEG langsung di body HTTP tanpa metadata tambahan. OBSERVABILITY: metrics bawaan (utilisasi GPU, throughput, latensi server) + Performance Analyzer & Model Analyzer untuk tuning config via profiling otomatis. Tidak perlu menebak max_batch_size — ukur.",
        "KAPAN BUKAN TRITON — batas yang dijanjikan: vLLM (LLMOps13) adalah MESIN KHUSUS LLM — continuous batching + PagedAttention untuk mengelola KV-cache saat text generation; Triton TIDAK mengoptimasi KV-cache. Pilih Triton untuk fleet campuran (vision, tabular/XGBoost, embedding, model klasik); pilih vLLM untuk LLM text-gen murni. Keduanya bisa hidup berdampingan dalam satu arsitektur.",
        "SEQUENCE BATCHING untuk model stateful (RNN sesi, streaming audio/video): request dari sesi yang sama dijamin sampai ke instance yang sama dengan state yang terjaga (implicit state management). Tanpa ini, model stateful di server stateless = bug yang misterius dan sulit direproduksi.",
        "DECOUPLED BACKEND untuk streaming dan job panjang: backend bisa mengirim MULTIPLE response untuk satu request (atau tidak mengirim sama sekali) — fondasi token streaming, audio/video streaming, dan long-running job. Ditambah repository agent: hook yang berjalan saat model di-load/unload (autentikasi, dekripsi model terenkripsi!) — model proprietary bisa disimpan terenkripsi di repository dan dibuka hanya saat load. Serving enterprise-grade = model tidak pernah telanjang di disk.",
        "KEAMANAN DEPLOY (README menautkan Secure Deployment Considerations): Triton di produksi = di balik reverse proxy + TLS + autentikasi; model repository hanya dari sumber tepercaya — karena model adalah KODE yang dieksekusi. Jangan expose port Triton mentah ke internet.",
        "Alur tuning konkret dengan Model Analyzer: (1) tulis config awal dengan tebakan wajar (max_batch_size 8, instance 1); (2) jalankan profiling dengan dataset representatif — ia mencoba kombinasi batch/instance/precision; (3) baca laporan: throughput vs latensi p99 per konfigurasi; (4) kunci config terbaik, deploy. Siklus ini 1–2 jam per model — jauh lebih murah dari sebulan over-provision. Metrics real-time Triton: request success, request duration, GPU utilization — sambungkan ke Prometheus + Grafana (pola observability MLOps7). Alert wajib: latensi p99 > SLO, queue time naik, GPU < 20% (over-provision!) atau > 95% (segera tambah instance).",
      ],
      figure: {
        svg: FIG_TPUT,
        alt: "Throughput per GPU: Flask per model 100 request per detik, Triton 600 request per detik.",
        caption: "Cara membaca: panjang batang = throughput per 1 GPU (req/s); dua batang = Flask per model vs Triton. Interpretasi: 6x bukan karena GPU-nya lebih cepat — GPU-nya SAMA. 6x datang dari batching (request digabung) + konkuren (5 model berbagi 1 GPU). Optimasi arsitektur mengalahkan belanja hardware.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: beli sendok, bukan restoran",
        body: "Butuh 1 model XGBoost 50 req/s? Triton = sendok yang tepat (backend FIL, 1 GPU, setup 10 menit). Butuh 20 model multi-framework? Triton = dapur lengkap. Jangan bangun dapur untuk merebus 1 telur — tapi jangan rebus 20 telur dengan 20 kompor terpisah.",
      },
      reference: "Triton = fleet klasik campuran. vLLM = LLM text-gen murni. BentoML = prototipe cepat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Triton, BentoML, vLLM, atau Flask?",
      prose: [
        "**Skenario 1 — Fleet model klasik campuran (XGBoost, ONNX, PyTorch, TF) di GPU.** → Triton. Multi-backend + concurrent + dynamic batching = kasus idealnya.",
        "**Skenario 2 — LLM text generation murni (chatbot, summarizer).** → vLLM (LLMOps13), bukan Triton. KV-cache dan continuous batching = dunia berbeda.",
        "**Skenario 3 — Prototipe cepat, 1–3 model, tim kecil.** → BentoML (bento = 1 artefak deploy) atau bahkan 1 Flask. Naik ke Triton saat fleet > 5 model atau butuh TensorRT.",
        "**Skenario 4 — Edge (Jetson) atau AWS Inferentia.** → Triton (dukungan JetPack & Inferentia resmi di README).",
        "**Skenario 5 — Pipeline preprocess → model → postprocess yang kompleks.** → Triton ensemble/BLS (1 round-trip) — bukan 3 microservice yang saling memanggil.",
        "**Skenario 6 — Butuh canary model baru tanpa downtime.** → Triton explicit mode: load v2 berdampingan dengan v1, arahkan 5% traffic via load balancer/router di depan (pola LLMOps14!), pantau metrics per versi, promosikan atau rollback via unload. Model repository yang berversion = rollback semudah me-load ulang folder lama — tidak ada deploy ulang, tidak ada panik.",
        "Aturan praktis 10 detik: `> 5 model atau multi-framework?` → Triton. `LLM murni?` → vLLM. `Prototipe 1 model?` → BentoML/Flask. `Edge?` → Triton. `Butuh canary?` → explicit mode + router.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: pilih kendaraan sesuai penumpang",
        body: "Flask = sepeda (1 penumpang, dekat). BentoML = taksi (cepat, praktis, 1-3 penumpang). Triton = bus trans (banyak penumpang, banyak rute, terjadwal). vLLM = kereta cepat (satu rute khusus, tercepat di jalurnya). Jangan naik bus untuk ke warung sebelah; jangan naik sepeda untuk mudik.",
      },
      reference: ">5 model → Triton. LLM murni → vLLM. Prototipe → BentoML. Edge → Triton.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Hitungan TokoKita: $10.000 jadi $2.500?",
      prose: [
        "TokoKita: 5 model, masing-masing 20 req/s (total 100 req/s), latensi eksekusi 60ms, batch efektif 8. GPU A100 $2.000/bulan. Pola lama: 1 GPU per model.",
        "Hitung: (a) GPU & biaya pola lama per bulan; (b) GPU dengan Triton (rumus N=ceil(λL/B)); (c) penghematan; (d) apa yang terjadi jika model ke-6 (20 req/s) ditambah di kedua pola? **Pembahasan:** (a) 5 GPU × $2.000 = $10.000/bulan. (b) N = ceil(100 × 0,06 / 8) = ceil(0,75) = 1 GPU = $2.000/bulan (+ $500 buffer monitoring = $2.500). (c) Hemat 75% = $7.500/bulan = $90.000/tahun. (d) Pola lama: GPU ke-6 = +$2.000/bulan (biaya marginal PENUH). Triton: kapasitas 1 GPU = 8/0,06 = 133 req/s > 120 → tambah 0 GPU, biaya marginal NOL. Pelajaran: arsitektur yang benar membuat pertumbuhan menjadi murah.",
        "(e) Dengan N+1 redundansi (2 GPU): biaya $4.000/bulan — hemat 60%, bukan 75%. Worth it? Downtime 4 jam/bulan × 100 req/s = 1,44 juta request gagal. Jika tiap request gagal = potensi revenue Rp5.000 yang hilang → Rp7,2 miliar/bulan risiko vs Rp32 juta premi redundansi. Redundansi = premi asuransi termurah yang pernah ada — jangan tukar 5 titik kegagalan mahal menjadi 1 titik kegagalan murah tanpa cadangan.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "1 GPU untuk 5 model = konsentrasi risiko (single point of failure). Mitigasi: 2 GPU dengan replikasi model (N+1) — biaya $4.000/bulan, masih hemat 60% dari $10.000. Jangan menukar 5 titik kegagalan yang mahal menjadi 1 titik kegagalan yang murah tanpa redundansi.",
      },
      reference: "$10.000 → $2.500/bulan (hemat 75%). Model ke-6: +$2.000 vs +$0. N+1 untuk redundansi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "TokoKita: 5 GPU utilisasi 12%. Diagnosis UTAMA?",
          options: [
            { text: "GPU kurang — tambah jadi 10 GPU", why: "Menambah GPU untuk utilisasi 12% = 10 GPU menganggur. Masalahnya bukan jumlah, melainkan tiap GPU tidak bisa berbagi." },
            { text: "Arsitektur serving: 5 Flask custom tak bisa berbagi GPU (tanpa batching/konkuren)", why: "Tepat. 88% idle × 5 = arsitektur yang tidak berbagi. Triton (concurrent + batching) memangkas 5→1 GPU tanpa GPU baru.", correct: true },
            { text: "Modelnya terlalu kecil — latih yang lebih besar", why: "Model lebih besar = latensi naik = utilisasi makin buruk. Ukuran model bukan obat arsitektur." },
            { text: "Traffic-nya kurang — cari lebih banyak user", why: "Mencari traffic agar GPU sibuk = membalik logika. Infrastruktur harus efisien di traffic sekarang." },
          ],
        },
        {
          q: "λ=100 req/s, L=0,06 dtk, batch efektif B=8. Kebutuhan GPU?",
          options: [
            { text: "6 GPU — tanpa batching", why: "Itu jawaban B=1 (100×0,06/1=6). Dengan batching B=8, angkanya jauh lebih kecil." },
            { text: "1 GPU — ceil(100×0,06/8) = ceil(0,75)", why: "Tepat. Satu rumus N=ceil(λL/B) = seluruh argumen kapasitas. Batching = tuas termurah.", correct: true },
            { text: "8 GPU — satu per batch slot", why: "Batch slot bukan GPU. 8 slot batch jalan dalam SATU eksekusi GPU 60ms." },
            { text: "100 GPU — satu per req/s", why: "Itu aritmetika tanpa pembagi sama sekali. λ/L/B ketiganya punya peran." },
          ],
        },
        {
          q: "Model XGBoost TokoKita di Triton sebaiknya pakai backend?",
          options: [
            { text: "PyTorch backend — paling populer", why: "XGBoost bukan PyTorch; memaksanya masuk backend yang salah = konversi tak perlu + lambat." },
            { text: "Python backend dengan Flask di dalamnya", why: "Python backend untuk logika custom, bukan untuk model klasik yang sudah ada backend khususnya." },
            { text: "RAPIDS FIL — backend khusus model klasik (XGBoost/LightGBM/sklearn)", why: "Tepat. FIL = Forest Inference Library, dioptimasi untuk tree model di GPU. Tanpa Flask, tanpa wrapper.", correct: true },
            { text: "TensorRT — selalu tercepat", why: "TensorRT untuk deep learning NVIDIA; untuk XGBoost, FIL yang dirancang khusus. `Selalu` tidak pernah benar." },
          ],
        },
        {
          q: "Kapan pilih vLLM BUKAN Triton?",
          options: [
            { text: "Fleet 5 model klasik campuran", why: "Itu kasus ideal Triton (multi-backend). vLLM tidak membantu XGBoost/ONNX." },
            { text: "LLM text generation murni (chatbot) — butuh KV-cache & continuous batching", why: "Tepat. vLLM = mesin khusus LLM (PagedAttention); Triton tidak mengoptimasi KV-cache. Batas 2-3 kalimat lesson ini.", correct: true },
            { text: "Prototipe 1 model di laptop", why: "Keduanya overkill; BentoML/Flask cukup. Jangan bawa bus ke warung." },
            { text: "Tidak pernah — Triton bisa semua", why: "`Bisa` ≠ `optimal`. Triton BISA serve LLM, tapi tanpa PagedAttention = boros memori KV-cache." },
          ],
        },
        {
          q: "Sequence batching Triton ditujukan untuk?",
          options: [
            { text: "Menggabungkan request acak sebanyak-banyaknya", why: "Itu dynamic batching. Sequence batching justru MENJAGA urutan, bukan mengacak." },
            { text: "Model stateful: request satu sesi ke instance yang sama, state terjaga", why: "Tepat (mis. RNN sesi, streaming audio/video). Tanpa ini, state tercecer antar instance = bug misterius.", correct: true },
            { text: "Menjalankan 5 model berbeda bersamaan", why: "Itu concurrent model execution — fitur scheduler yang berbeda." },
            { text: "Menyimpan model ke disk", why: "Itu model repository/versioning, bukan batching." },
          ],
        },
        {
          q: "Model ke-6 (+20 req/s) ditambahkan. Biaya marginal pola lama vs Triton?",
          options: [
            { text: "Sama: +$2.000 di keduanya", why: "Triton punya headroom: kapasitas 1 GPU = 133 req/s > 120. Tidak butuh GPU baru." },
            { text: "Pola lama +$2.000 (GPU ke-6); Triton +$0 (masih muat di 1 GPU)", why: "Tepat. Inilah `pertumbuhan murah`: arsitektur berbagi membuat model ke-6..ke-10 hampir gratis.", correct: true },
            { text: "Triton +$2.000; pola lama +$0", why: "Terbalik. Pola lama yang membayar penuh per model baru." },
            { text: "Keduanya +$0 — GPU elastis", why: "GPU tidak elastis seperti serverless; kapasitasnya diskret. Headroom Triton yang membuatnya terasa elastis." },
          ],
        },
      ],
      summary: [
        "Triton = model server multi-framework (TensorRT, PyTorch, ONNX, OpenVINO, Python, RAPIDS FIL) — 1 server untuk fleet campuran, bukan 1 Flask per model.",
        "Model repository + config.pbtxt = kontrak serving; model baru = tambah folder, bukan deploy service baru.",
        "Dynamic batching (speedup 2x di lab) + concurrent execution = 5 GPU → 1 (hemat 80%); rumus N_GPU = ceil(λ·L/B).",
        "Ensemble/BLS: pipeline preprocess → model → postprocess dalam 1 server, 1 round-trip.",
        "Triton untuk fleet klasik campuran; vLLM untuk LLM text-gen murni (KV-cache); BentoML untuk prototipe cepat.",
        "1 GPU = single point of failure → pakai N+1 redundansi; jangan expose port Triton mentah ke internet.",
      ],
      next: { label: "MLOps17 — Keamanan ML: Ancaman di Seluruh Rantai", href: "/v2/learn/mlops17-keamanan-ml" },
    },
  ],
};
