import type { V2Lesson } from "../lib/types";

// Request konkuren per bucket 5 menit: [2, 8, 15, 30, 12, 4]; kapasitas per replika = 10.
const AUTOSCALE_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Autoscaling: request vs kapasitas replika">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<line x1="40" y1="210" x2="520" y2="210" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="60" y="202" width="40" height="8" rx="3" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="140" y="178" width="40" height="32" rx="3" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="220" y="150" width="40" height="60" rx="3" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="300" y="90" width="40" height="120" rx="3" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="380" y="162" width="40" height="48" rx="3" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="460" y="194" width="40" height="16" rx="3" fill="var(--c1)" fill-opacity="0.8"/>
<polyline points="80,170 160,170 240,130 320,90 400,130 480,170" fill="none" stroke="var(--c3)" stroke-width="2.5"/>
<text x="80" y="228" fill="var(--text)">00:00</text><text x="160" y="228" fill="var(--text)">00:05</text><text x="240" y="228" fill="var(--text)">00:10</text>
<text x="320" y="228" fill="var(--text)">00:15</text><text x="400" y="228" fill="var(--text)">00:20</text><text x="480" y="228" fill="var(--text)">00:25</text>
<rect x="440" y="30" width="14" height="14" fill="var(--c1)" fill-opacity="0.8"/><text x="462" y="41" text-anchor="start" fill="var(--text)">request</text>
<line x1="440" y1="58" x2="454" y2="58" stroke="var(--c3)" stroke-width="2.5"/><text x="462" y="62" text-anchor="start" fill="var(--text)">kapasitas</text>
</g>
<text x="280" y="18" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Request vs kapasitas: replika naik-turun mengikuti beban</text>
</svg>`;

export const mlops21: V2Lesson = {
  slug: "mlops21-kserve-inference-optimization",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps21 — KServe & Optimasi Inferensi",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "GPU $3.000 yang begadang sendirian",
      prose: [
        "Juni 2026. TanyaDok, asisten tanya-jawab medis, melayani 40.000 request/hari — 80% di antaranya antara jam 7 pagi dan 7 malam. GPU A100-nya menyala 24 jam. Tagihan: $3.000/bulan. Utilisasi rata-rata: 31%. Malam hari, GPU $3.000 itu `begadang sendirian`: menyala, panas, dibayar — melayani 3 request per jam.",
        "Tim infra mengusulkan `beli GPU yang lebih kecil`. Tim ML mengusulkan `pakai model yang lebih kecil`. Keduanya salah sasaran: masalahnya bukan ukuran mesin atau modelnya — melainkan ELASTISITASNYA. Sistem tidak bisa menyusut saat sepi dan mengembang saat ramai. Solusinya: autoscaling ke nol di malam hari + kuantisasi model (26 GB → 13 GB) sehingga tiap replika lebih murah.",
        "Twist-nya: setelah autoscaling + INT8, tagihan turun ke $1.100/bulan — hemat 63% TANPA mengganti model, TANPA menurunkan akurasi yang terukur. Uang terbesar di MLOps jarang ada di `model yang lebih pintar`; ia ada di `mesin yang tahu kapan tidur`. Lesson ini tentang KServe (standar serving Kubernetes 2026) dan optimasi inferensi modern.",
      ],
      tasks: [],
      reference: "Optimasi inferensi terbesar = elastisitas (tidur saat sepi) + kuantisasi (replika lebih murah).",
    },
    {
      id: "kserve",
      eyebrow: "Langkah 2 · Konsep",
      title: "KServe: Si Pelayan Elastis",
      prose: [
        "KServe adalah standar serving model di Kubernetes pada 2026: kamu mendeklarasikan InferenceService (model apa, framework apa — sklearn, PyTorch, Triton, HuggingFace), dan KServe mengurus sisanya: deployment, networking, autoscaling, bahkan scale-to-zero. Si Pelayan Elastis: datang saat dipanggil, pulang saat sepi.",
        "Tiga fitur yang membuatnya standar. Pertama, SERVERLESS-ish: scale-to-zero berarti malam hari TanyaDok = 0 replika = $0 (cold start 2–5 detik bisa diterima untuk non-kritis). Kedua, CANARY: 5% trafik ke model baru, 95% ke lama — rollback otomatis bila metrik canary memburuk. Ketiga, TRANSFORMER & EXPLAINER: rantai pra/post-processing sebagai komponen terpisah, bukan kode tempel di aplikasi.",
        "Kapan KServe tepat: kamu SUDAH di Kubernetes dan butuh serving yang serius. Kapan tidak: tim 3 orang tanpa cluster — managed endpoint (lesson kemarin) lebih murah total. Standar bukan berarti wajib; ia berarti `bila kamu di K8s, ini default yang waras`.",
        "💡 Intuisi: KServe = restoran dengan pelayan on-call. Tanpa KServe, kamu menggaji 10 pelayan tetap untuk restoran yang ramai hanya saat makan siang. Dengan KServe, pelayan datang saat tamu datang — dan pulang saat restoran sepi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `scale-to-zero = gratis tanpa konsekuensi`",
        type: "pitfall",
        body: "Scale-to-zero punya harga: COLD START. Replika butuh 2–30 detik untuk bangun (tarik image, load model 13 GB ke GPU). Untuk chatbot santai = tidak masalah. Untuk fraud detection yang harus menjawab <200ms = bencana. Aturannya: scale-to-zero hanya untuk workload yang toleran terhadap latensi dingin; untuk yang kritis, pertahankan min-replicas = 1 (tetap hemat 90% dibanding 10 replika tetap).",
      },
      reference: "KServe = InferenceService deklaratif + autoscaling + scale-to-zero + canary. Tepat bila sudah di K8s.",
    },
    {
      id: "autoscaling",
      eyebrow: "Langkah 3 · Konsep",
      title: "Autoscaling: Si Termostat",
      prose: [
        "Si Termostat bekerja dengan rumus sederhana: R = ⌈L / C⌉ — jumlah replika = beban dibagi kapasitas per replika, dibulatkan ke atas. Beban L bisa diukur sebagai concurrency (request bersamaan), RPS, atau — untuk GPU — utilisasi. Kapasitas C ditentukan dari load test: berapa request konkuren yang masih memenuhi SLO latensi.",
        "Dua mode scaling. REAKTIF: tambah replika saat metrik melewati ambang (mis. concurrency > 8 selama 30 detik). Murah dan sederhana, tapi ada jeda (pod butuh 30–60 detik siap) — spike tajam = antrean sementara. PREDIKTIF/TERJADWAL: untuk pola harian yang jelas (TanyaDok: ramai 07:00–19:00), jadwalkan scale-up jam 6:30 pagi — tanpa jeda, tanpa tebak-tebakan.",
        "Jebakan klasik: scaling berdasarkan CPU pada workload GPU — CPU 20% padahal GPU 95% (atau sebaliknya). Selalu scale berdasarkan BOTTLENECK RIIL: untuk LLM = GPU memory/utilization atau queue depth, bukan CPU.",
        "💡 Intuisi: autoscaling yang baik seperti termostat AC — bukan menyala-matikan tiap detik (flapping), melainkan bereaksi halus dengan jeda (cooldown) agar tidak `menggigil`. Atur scale-down lebih lambat dari scale-up: kelebihan 5 menit lebih murah dari kekurangan 1 menit.",
      ],
      formula: String.raw`R = \left\lceil \frac{L}{C} \right\rceil`,
      formulaNote: "R = jumlah replika yang dibutuhkan (bilangan bulat, dibulatkan ke atas); L = beban (load) — concurrency/RPS/queue depth yang terukur; C = kapasitas per replika — beban maksimum satu replika sambil tetap memenuhi SLO latensi (dari load test). Contoh lab: L = [2, 8, 15, 30, 12, 4], C = 10 → R = [1, 1, 2, 3, 2, 1]. Interpretasi: pada bucket tersibuk (30 request) butuh 3 replika; total 50 replika-menit per 30 menit = $2,50 — bandingkan dengan 3 replika tetap 24/7.",
      tasks: [],
      note: {
        title: "🚨 Mitos: `autoscaling menyelesaikan semua masalah kapasitas`",
        type: "pitfall",
        body: "Autoscaling tidak menambah GPU ke cloud — bila region kehabisan GPU (sering terjadi untuk A100/H100), replika baru antre PENDING. Selalu siapkan: (1) quota/limit yang cukup, (2) fallback ke region lain atau instance lebih kecil, (3) rate limit yang anggun saat benar-benar penuh. Scaling tanpa kapasitas = termostat tanpa listrik.",
      },
      reference: "R = ⌈L/C⌉. Scale by bottleneck riil (GPU/queue, bukan CPU). Scale-down lebih lambat dari scale-up.",
    },
    {
      id: "quantization",
      eyebrow: "Langkah 4 · Konsep",
      title: "Kuantisasi & distilasi: Si Koper yang Dipadatkan",
      prose: [
        "Model 13B parameter dalam FP16 = 13 miliar × 2 byte = 26 GB — butuh GPU 40 GB hanya untuk memuatnya. Kuantisasi INT8 memadatkannya jadi 13 GB (1 byte per parameter): muat di GPU yang lebih murah, atau dua replika di GPU yang sama. FP8 lebih baru: 1 byte dengan rentang dinamis lebih baik untuk training dan inferensi modern.",
        "Harga yang dibayar: sedikit akurasi. INT8 pada LLM modern biasanya kehilangan <1% pada benchmark — tapi `biasanya` bukan `selalu`: untuk tugas presisi (matematika, kode), uji dulu dengan dataset emas (lesson kemarin!). Aturannya: kuantisasi = kompresi lossy — selalu ukur sebelum dan sesudah dengan eval yang sama.",
        "Distilasi adalah saudara tuanya: latih model KECIL meniru model BESAR (siswa meniru guru). Hasilnya model 10x lebih kecil dengan 95% kemampuan — untuk tugas sempit (klasifikasi intent, ekstraksi), distilasi sering mengalahkan kuantisasi. Pilih distilasi bila tugasnya SEMPIT dan stabil; pilih kuantisasi bila tugasnya UMUM.",
        "💡 Intuisi: kuantisasi = mengemas koper dengan vacuum bag — isinya sama, volumenya setengah. Distilasi = menulis ringkasan buku 500 halaman jadi 50 halaman — jauh lebih kecil, tapi hanya cocok bila kamu memang butuh ringkasannya, bukan bukunya.",
      ],
      formula: String.raw`M = P \times b`,
      formulaNote: "M = memori bobot model (byte); P = jumlah parameter; b = byte per parameter (FP32 = 4, FP16/BF16 = 2, INT8/FP8 = 1). Contoh lab: P = 13×10⁹ → M_FP16 = 26,0 GB, M_INT8 = 13,0 GB, hemat 13,0 GB (50%). Interpretasi: angka ini menentukan GPU apa yang bisa memuat model — 26 GB butuh A100-40GB, 13 GB cukup di GPU 24 GB yang jauh lebih murah. (Belum termasuk KV cache & aktivasi — anggaran riil tambah 20–30%.)",
      tasks: [],
      note: {
        title: "🚨 Mitos: `INT8 selalu aman tanpa uji`",
        type: "pitfall",
        body: "Untuk chatbot umum, INT8 biasanya aman. Untuk scoring kredit, diagnosis medis, atau perhitungan finansial — `biasanya` tidak cukup. Kuantisasi bisa menggeser kalibrasi probabilitas (model jadi overconfident). Aturannya: kuantisasi + eval ulang WAJIB satu paket; bila skor tugas kritis turun > ambang, tetap di FP16 atau pakai mixed precision.",
      },
      reference: "M = P × b. INT8 = setengah memori, uji ulang dengan dataset emas. Distilasi untuk tugas sempit.",
    },
    {
      id: "speculative",
      eyebrow: "Langkah 5 · Konsep",
      title: "Speculative decoding: Si Penerka Cepat",
      prose: [
        "LLM menghasilkan token satu per satu — tiap token = satu forward pass model besar yang mahal. Speculative decoding memakai model KECIL yang murah untuk `menebak` 3–5 token ke depan, lalu model BESAR memverifikasinya sekaligus dalam satu pass. Tebakan benar = dapat 4 token seharga 1; tebakan salah = mundur ke titik salah dan lanjut normal.",
        "Kapan ia bersinar: tugas yang PREDICTABLE (template, kode boilerplate, jawaban terstruktur) — tingkat penerimaan tebakan 70–80%, speedup 2–3x. Kapan ia loyo: teks kreatif yang tidak tertebak — penerimaan 30%, overhead verifikasi malah memperlambat. Seperti semua optimasi: ukur di workload-MU.",
        "Posisinya dalam toolkit: kuantisasi mengecilkan BIAYA per token, speculative decoding mempercepat WAKTU per token, autoscaling menyesuaikan KAPASITAS dengan beban. Tiga tuas yang saling melengkapi — bukan saling menggantikan.",
        "💡 Intuisi: seperti mengetik dengan autocomplete yang sangat pintar — kamu (model kecil) mengetik draf cepat, editor (model besar) menyetujui/mengoreksi sekaligus. Untuk email rutin = ngebut; untuk puisi = malah mengganggu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `optimasi inferensi = satu teknik terbaik`",
        type: "pitfall",
        body: "Tidak ada satu teknik yang memenangkan semuanya. TanyaDok memakai ketiganya: INT8 (murah per replika) + speculative decoding (cepat per token) + autoscaling (sesuai beban) = 63% hemat. Memakai satu saja = meninggalkan uang di meja. Urutan yang waras: ukur dulu (di mana waktu/biaya habis?) → pilih tuas yang menyerang bottleneck itu → ukur lagi.",
      },
      reference: "Kuantisasi = murah per token; speculative = cepat per token; autoscaling = kapasitas pas. Ukur, pilih, ukur lagi.",
    },
    {
      id: "slo",
      eyebrow: "Langkah 6 · Konsep",
      title: "SLO TTFT/TPOT: Si Stopwatch Dua Jarum",
      prose: [
        "Latensi LLM punya DUA jarum. TTFT (Time To First Token): berapa lama sampai token PERTAMA keluar — yang dirasakan user sebagai `responsif atau lemot`. TPOT (Time Per Output Token): kecepatan token-token berikutnya — yang dirasakan sebagai `mengalir atau tersendat`. Chatbot dengan TTFT 5 detik terasa rusak walau TPOT-nya cepat; dengan TPOT 200ms/token terasa patah-patah walau TTFT-nya instan.",
        "SLO yang sehat menyebut keduanya: mis. `p95 TTFT < 1,5 detik, p95 TPOT < 80ms`. TTFT didominasi oleh prefill (memproses seluruh prompt sekaligus — makin panjang prompt, makin lama); TPOT didominasi oleh decode + ukuran model (makin besar model, makin lambat per token). Diagnosis: TTFT buruk → periksa panjang prompt & antrean; TPOT buruk → periksa ukuran model & kuantisasi.",
        "Kaitan dengan autoscaling: kapasitas C di rumus R = ⌈L/C⌉ HARUS didefinisikan terhadap SLO ini — `berapa concurrency sebelum p95 TTFT jebol`. Tanpa SLO, C = tebakan; dengan SLO, C = hasil load test.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `latensi rata-rata cukup sebagai SLO`",
        type: "pitfall",
        body: "Rata-rata menyembunyikan penderitaan: TTFT rata-rata 800ms bisa berarti 90% user dapat 300ms dan 10% dapat 5 detik (antrean saat spike). Yang 10% itu yang menulis review bintang 1. Selalu SLO dalam persentil (p95/p99) — dan pisahkan TTFT vs TPOT karena obatnya beda.",
      },
      reference: "SLO = p95 TTFT + p95 TPOT. TTFT soal prefill & antrean; TPOT soal ukuran model. C dari load test terhadap SLO.",
    },
    {
      id: "lab-autoscale",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: termostatmu — replika mengikuti beban",
      prose: [
        "SIMULASI — kamu adalah autoscaler TanyaDok. Data: request konkuren per bucket 5 menit [2, 8, 15, 30, 12, 4], kapasitas 10 request per replika, harga $0,05 per replika-menit, model 13B parameter. Tugasmu: hitung replika per bucket (R = ceil(L/C)), total replika-menit, biayanya, dan memori FP16 vs INT8.",
        "Cara membaca output: baris pertama menampilkan daftar replika, total replika-menit, dan biaya 30 menit; baris kedua membandingkan memori model. Interpretasi: bucket tersibuk butuh 3 replika tapi total hanya 50 replika-menit ($2,50) — versus 3 replika tetap 24/7 yang jauh lebih mahal. Kuantisasi memangkas memori 50%.",
        "Coba eksplorasi: ubah `kapasitas` jadi 5 (SLO lebih ketat) — berapa biaya barunya? Ubah request malam hari jadi [2, 2, 2, 2, 2, 2] (trafik datar) — kapan autoscaling tidak lagi menghemat dibanding replika tetap? Itulah batas `kapan elastisitas berhenti berguna`.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `replika` per bucket: ceil(request / kapasitas) untuk tiap bucket" },
        { id: "t2", text: "Hitung `replika_menit` (jumlah replika × 5) dan `biaya` (replika_menit × harga)" },
        { id: "t3", text: "Hitung `mem_fp16` (param × 2 byte / 1e9), `mem_int8` (param × 1 byte / 1e9), dan `hemat_gb`" },
      ],
      expected: "replika=[1, 1, 2, 3, 2, 1] replika_menit=50 biaya=$2.50\nFP16=26.0GB INT8=13.0GB hemat=13.0GB (50%)",
      hints: [
        "import math; replika = [math.ceil(r / kapasitas) for r in req_per_5m].",
        "replika_menit = sum(replika) * 5 — tiap bucket 5 menit.",
        "mem_fp16 = param_m * 2 / 1e9 — bagi 1e9 agar jadi GB.",
      ],
      code: {
        starter: `# DATA SERVING (jangan ubah)
import math
req_per_5m = [2, 8, 15, 30, 12, 4]  # request konkuren per bucket 5 menit
kapasitas = 10          # request konkuren per replika
harga_replika_mnt = 0.05  # $ per replika-menit
param_m = 13e9          # 13 miliar parameter

# TULIS KODEMU
replika = ...
replika_menit = ...
biaya = ...

mem_fp16 = ...
mem_int8 = ...
hemat_gb = ...

# CETAK (jangan ubah formatnya)
print(f"replika={replika} replika_menit={replika_menit} biaya=\${biaya:.2f}")
print(f"FP16={mem_fp16:.1f}GB INT8={mem_int8:.1f}GB hemat={hemat_gb:.1f}GB (50%)")`,
        lockLines: 7,
        solution: `# DATA SERVING (jangan ubah)
import math
req_per_5m = [2, 8, 15, 30, 12, 4]  # request konkuren per bucket 5 menit
kapasitas = 10          # request konkuren per replika
harga_replika_mnt = 0.05  # $ per replika-menit
param_m = 13e9          # 13 miliar parameter

# TULIS KODEMU
replika = [math.ceil(r / kapasitas) for r in req_per_5m]
replika_menit = sum(replika) * 5
biaya = replika_menit * harga_replika_mnt

mem_fp16 = param_m * 2 / 1e9
mem_int8 = param_m * 1 / 1e9
hemat_gb = mem_fp16 - mem_int8

# CETAK (jangan ubah formatnya)
print(f"replika={replika} replika_menit={replika_menit} biaya=\${biaya:.2f}")
print(f"FP16={mem_fp16:.1f}GB INT8={mem_int8:.1f}GB hemat={hemat_gb:.1f}GB (50%)")`,
        checks: [
          { kind: "equal", task: "t1", label: "daftar replika", name: "replika", value: [1, 1, 2, 3, 2, 1], msg: "ceil([2,8,15,30,12,4]/10) = [1,1,2,3,2,1]." },
          { kind: "equal", task: "t2", label: "replika-menit", name: "replika_menit", value: 50, msg: "(1+1+2+3+2+1) × 5 = 50." },
          { kind: "equal", task: "t2", label: "biaya 30 menit", name: "biaya", value: 2.5, tol: 0.01, msg: "50 × $0,05 = $2,50." },
          { kind: "equal", task: "t3", label: "memori FP16", name: "mem_fp16", value: 26.0, tol: 0.01, msg: "13e9 × 2 / 1e9 = 26,0 GB." },
          { kind: "equal", task: "t3", label: "hemat memori", name: "hemat_gb", value: 13.0, tol: 0.01, msg: "26,0 − 13,0 = 13,0 GB (50%)." },
          { kind: "stdout_matches", task: "t2", label: "biaya di stdout", msg: "Cetak biaya=$2.50.", pattern: "biaya=\\$2\\.50" },
        ],
      },
      figure: {
        svg: AUTOSCALE_SVG,
        alt: "Request per 5 menit vs kapasitas replika: replika naik-turun mengikuti beban.",
        caption: "Beban (batang) vs kapasitas (garis). Replika mengikuti beban — tidak ada yang menganggur, tidak ada yang antre.",
      },
      reference: "R = [1,1,2,3,2,1] → 50 replika-menit = $2,50. INT8 memangkas memori 26 → 13 GB.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Tiga jebakan optimasi inferensi",
      prose: [
        "JEBAKAN 1 — KUANTISASI TANPA EVAL ULANG. `INT8 kan cuma kompresi` — lalu skor tugas presisi turun 4% tanpa ada yang tahu selama 2 bulan, karena tidak ada dataset emas yang dijalankan ulang. Aturannya dari lesson ini: kuantisasi dan eval ulang adalah SATU paket yang tidak terpisahkan. Tidak ada eval ulang = tidak ada kuantisasi. Titik.",
        "JEBAKAN 2 — AUTOSCALING BERDASARKAN CPU. HPA default Kubernetes melihat CPU. Workload LLM: CPU 20%, GPU 95%, antrean memanjang — autoscaler berkata `santai, CPU rendah`, user berkata `kenapa lemot`. Selalu scale by bottleneck RIIL: GPU utilization, queue depth, atau concurrency — metrik yang berkorelasi dengan penderitaan user, bukan yang mudah diukur.",
        "JEBAKAN 3 — SCALE-TO-ZERO UNTUK LATENSI KRITIS. Tim yang membaca `hemat 100% saat sepi` lalu menerapkannya ke fraud detection real-time: request pertama setelah sepi menunggu 25 detik cold start — transaksi fraud lolos sambil menunggu. Scale-to-zero adalah tuas untuk workload TOLERAN DINGIN. Untuk yang kritis: min-replicas = 1, tetap hemat 90% dibanding armada tetap.",
        "Ketiga jebakan punya akar yang sama: menerapkan optimasi TANPA MENGUKUR DULU. Optimasi buta = judi dengan latensi dan akurasi sebagai taruhannya. Urutan yang benar tidak pernah berubah: ukur (TTFT vs TPOT, idle vs sibuk) → pilih tuas → ukur lagi.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `semakin banyak optimasi dipasang semakin baik`",
        type: "pitfall",
        body: "Setiap optimasi menambah KOMPLEKSITAS OPERASIONAL: kuantisasi + speculative + autoscaling + canary = empat hal yang bisa rusak jam 2 pagi. Tim kecil dengan tiga tuas yang tidak dipahami = lebih rapuh dari satu tuas yang dikuasai. Aturannya: pasang tuas yang menyerang bottleneck TERUKUR-mu, dan hanya tambah bila bottleneck berpindah. Sederhana yang bekerja > canggih yang misterius.",
      },
      reference: "Kuantisasi + eval ulang satu paket. Scale by bottleneck riil. Scale-to-zero hanya untuk yang toleran dingin.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: tuas apa yang ditarik dulu?",
      prose: [
        "SKENARIO 1 — Tagihan GPU tinggi, trafik siang-malam timpang (TanyaDok). KEPUTUSAN: AUTOSCALING + SCALE-TO-ZERO DULU. Alasannya: tuas terbesar dengan risiko nol terhadap kualitas jawaban — tidak menyentuh model sama sekali. Ukur pola 1 minggu, pasang jadwal + reaktif.",
        "SKENARIO 2 — Latensi TPOT buruk, model 13B+ di GPU mahal. KEPUTUSAN: KUANTISASI INT8/FP8. Alasannya: memangkas memori 50% = GPU lebih murah per replika. Wajib: eval ulang dengan dataset emas; bila tugas presisi dan skor turun > ambang, tetap FP16.",
        "SKENARIO 3 — TTFT buruk pada prompt panjang + jawaban terstruktur. KEPUTUSAN: SPECULATIVE DECODING + rampingkan prompt. Alasannya: TTFT soal prefill (prompt panjang) dan decode; speculative 2–3x untuk pola tertebak. Bila jawaban kreatif/tak tertebak, lewati tuas ini.",
        "SKENARIO 4 — Spike tak terduga (viral, kampanye) membuat antrean. KEPUTUSAN: PREDIKTIF + RATE LIMIT ANGGUN. Alasannya: autoscaling reaktif butuh 30–60 detik; untuk spike, siapkan jadwal/sinyal bisnis + degradasi anggun (antrean dengan estimasi tunggu, bukan timeout misterius).",
        "SKENARIO 5 — Sudah di K8s, serving masih manual (kubectl apply + doa). KEPUTUSAN: ADOPSI KSERVE. Alasannya: InferenceService deklaratif + canary + autoscaling bawaan menggantikan YAML rakitan. Mulai dari 1 model non-kritis sebagai pilot.",
        "ATURAN PRAKTIS 10 DETIK: (1) Ukur dulu: ke mana perginya waktu (TTFT vs TPOT) dan uang (idle vs per-token)? (2) Tarik tuas tanpa risiko kualitas dulu (autoscaling). (3) Kuantisasi + eval ulang. (4) Speculative bila pola tertebak. (5) Semua tuas dipasang dengan SLO p95 — bukan rata-rata.",
      ],
      tasks: [
      ],
      reference: "Ukur → autoscaling → kuantisasi (+eval) → speculative → KServe. SLO selalu p95.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: ServeKu dan GPU yang `murah`",
      prose: [
        "ServeKu, SaaS HR dengan chatbot rekrutmen: 100.000 request/hari, 70% jam 8–17. Data: (a) memakai GPU L4 24 GB seharga $0,90/jam, 4 unit tetap 24/7 = $2.592/bulan; (b) model 13B FP16 = 26 GB — TIDAK MUAT di 1× L4, sehingga tiap replika butuh 2× L4 (tensor parallel) = $1,80/jam per replika; (c) utilisasi rata-rata 22%; (d) p95 TTFT 3,2 detik (SLO 1,5 detik); (e) belum ada autoscaling, belum ada kuantisasi.",
        "Pertanyaan 1 — Diagnosis: dari 5 data di atas, apa TIGA akar pemborosan ServeKu? Pertanyaan 2 — Hitungan: bila model di-INT8 (13 GB, muat 1× L4) + autoscaling rata-rata 2 replika pada jam kerja dan 0 di malam hari (asumsi 9 jam × 30 hari = 270 jam aktif): berapa biaya/bulan vs sekarang? Pertanyaan 3 — SLO: TTFT 3,2 detik vs SLO 1,5 — tuas apa yang menyerang TTFT, dan mengapa kuantisasi BUKAN jawaban utamanya?",
        "Pembahasan — P1: (i) Model 26 GB memaksa 2× GPU per replika — kuantisasi menghemat SETENGAH armada sebelum hal lain; (ii) 4 unit tetap 24/7 untuk trafik 70% di jam kerja = tidak ada elastisitas; (iii) TTFT 3,2 dtk menunjukkan masalah prefill/antrean, bukan ukuran model. P2: sekarang $2.592/bulan. Baru: 2 replika × $0,90 × 270 jam = $486/bulan — hemat $2.106/bulan (81%). P3: TTFT = prefill + antrean → tuasnya: rampingkan prompt (konteks lebih pendek), speculative decoding, tambah replika saat spike (kurangi antrean). Kuantisasi memperbaiki TPOT (kecepatan per token), BUKAN TTFT — salah tuas = tetap lemot.",
      ],
      tasks: [
        { id: "t1", text: "Tulis diagnosis 3 akar pemborosan ServeKu (kaitkan ke data a–e)" },
        { id: "t2", text: "Hitung biaya/bulan setelah INT8 + autoscaling (2 replika × 270 jam aktif)" },
        { id: "t3", text: "Jelaskan tuas yang tepat untuk TTFT 3,2 dtk dan mengapa bukan kuantisasi" },
      ],
      expected: "P1: 26 GB paksa 2×GPU/replika + tanpa elastisitas + TTFT buruk = masalah prefill/antrean. P2: $486/bln vs $2.592 — hemat $2.106 (81%). P3: rampingkan prompt + speculative + replika saat spike; kuantisasi memperbaiki TPOT, bukan TTFT.",
      note: {
        title: "🚨 Mitos: `GPU lebih besar menyelesaikan latensi`",
        type: "pitfall",
        body: "ServeKu sudah di GPU yang cukup — masalahnya arsitektur, bukan otot. TTFT 3,2 detik tidak sembuh dengan GPU 2x lebih cepat bila penyebabnya prompt 8.000 token + antrean. Aturannya: diagnosis dulu (TTFT vs TPOT, idle vs sibuk), baru belanja. GPU yang lebih besar untuk arsitektur yang salah = tagihan yang lebih besar untuk masalah yang sama.",
      },
      reference: "Ukur (TTFT vs TPOT) → tuas yang tepat → hitung. Jangan belanja sebelum diagnosis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Dari lab Langkah 7: request [2, 8, 15, 30, 12, 4], kapasitas 10. Berapa replika-menit dan biayanya?",
          options: [
            { text: "60 replika-menit, $3,00", why: "Itu hasil bila tiap bucket dibulatkan ke 2 (tanpa ceil yang benar) — cek lagi: ceil(2/10) = 1, bukan 2." },
            { text: "50 replika-menit = $2,50 (replika [1,1,2,3,2,1])", why: "Tepat. R = ⌈L/10⌉ per bucket; jumlah = 10 replika × 5 menit = 50; × $0,05 = $2,50.", correct: true },
            { text: "30 replika-menit, $1,50", why: "Itu bila memakai rata-rata request (14) bukan per-bucket — autoscaling bekerja per bucket waktu, bukan rata-rata." },
            { text: "180 replika-menit (3 replika × 60 menit)", why: "Itu pola replika TETAP mengikuti puncak — justru yang ingin dihindari autoscaling." },
          ],
        },
        {
          q: "Kapan scale-to-zero adalah pilihan yang SALAH?",
          options: [
            { text: "Saat trafik turun drastis di malam hari", why: "Itu kasus scale-to-zero TERBAIK — hemat maksimal. Bukan jawaban yang salah." },
            { text: "Saat workload butuh TTFT < 200ms konsisten (cold start 2–30 detik tidak tertahankan)", why: "Tepat. Mitos yang dibantah Langkah 2: scale-to-zero punya harga cold start. Untuk latensi kritis, pertahankan min-replicas = 1.", correct: true },
            { text: "Saat model berukuran kecil", why: "Model kecil justru cold start-nya cepat — makin cocok untuk scale-to-zero, bukan sebaliknya." },
            { text: "Saat memakai KServe", why: "KServe justru MEMUDAHKAN scale-to-zero (fitur bawaan). Platformnya bukan masalahnya." },
          ],
        },
        {
          q: "Model 13B parameter: berapa memori FP16 vs INT8, dan implikasinya?",
          options: [
            { text: "13 GB vs 6,5 GB — bisa jalan di laptop", why: "Salah hitung: 13B × 2 byte = 26 GB, bukan 13 GB. Selalu M = P × b." },
            { text: "26,0 GB vs 13,0 GB — INT8 memangkas setengah; 13 GB muat di GPU 24 GB yang jauh lebih murah", why: "Tepat. Dari lab: hemat 13,0 GB (50%). Implikasi arsitekturnya: tiap replika butuh GPU separuh harga.", correct: true },
            { text: "26 GB vs 26 GB — kuantisasi tidak mengubah memori", why: "Kuantisasi justru intinya mengubah byte per parameter (2 → 1). Itu seluruh poin Si Koper." },
            { text: "52 GB vs 26 GB — FP16 butuh 4 byte", why: "FP16 = 2 byte (16 bit), bukan 4. Yang 4 byte itu FP32." },
          ],
        },
        {
          q: "TTFT 3,2 detik (SLO 1,5) pada ServeKu. Tuas yang TEPAT?",
          options: [
            { text: "Kuantisasi INT8", why: "Salah tuas: kuantisasi memperbaiki TPOT (kecepatan per token), bukan TTFT. Mini-case P3 membuktikan ini jebakan umum." },
            { text: "Rampingkan prompt + speculative decoding + tambah replika saat spike (menyerang prefill & antrean)", why: "Tepat. TTFT = prefill + antrean. Tiga tuas ini menyerang keduanya langsung.", correct: true },
            { text: "Ganti ke GPU yang 2x lebih cepat", why: "Itu mitos mini-case: masalahnya arsitektur (prompt panjang + antrean), bukan otot. GPU lebih cepat untuk masalah yang salah = tagihan lebih besar." },
            { text: "Naikkan temperature agar jawaban lebih cepat", why: "Temperature tidak mempercepat apa-apa — ia mengubah variasi jawaban, dan jawaban lebih panjang justru menambah token (biaya naik)." },
          ],
        },
        {
          q: "Mengapa autoscaling harus memakai metrik bottleneck RIIL (GPU/queue), bukan CPU?",
          options: [
            { text: "Karena CPU tidak bisa diukur di Kubernetes", why: "CPU justru paling mudah diukur. Masalahnya bukan keterukuran — melainkan relevansi." },
            { text: "Karena pada workload LLM, CPU bisa 20% sementara GPU 95% — scaling by CPU = buta terhadap kemacetan sebenarnya", why: "Tepat. Jebakan Langkah 3: termostat yang mengukur suhu ruangan yang salah. Selalu scale by apa yang benar-benar penuh.", correct: true },
            { text: "Karena metrik GPU lebih murah dihitung", why: "Biaya metrik bukan masalahnya. Masalahnya = keputusan scaling yang salah arah." },
            { text: "Karena CPU tidak relevan sama sekali di ML", why: "Berlebihan: CPU relevan untuk pre/post-processing. Poinnya = pilih metrik sesuai bottleneck workload itu." },
          ],
        },
      ],
      summary: [
        "KServe = InferenceService deklaratif + autoscaling + scale-to-zero + canary; tepat bila sudah di Kubernetes.",
        "R = ⌈L/C⌉; scale by bottleneck riil; scale-down lebih lambat dari scale-up; siapkan quota & fallback.",
        "M = P × b: INT8 memangkas 50% memori (26 → 13 GB untuk 13B); selalu eval ulang setelah kuantisasi.",
        "Speculative decoding: model kecil menebak, model besar verifikasi — 2–3x untuk pola tertebak.",
        "SLO = p95 TTFT + p95 TPOT; TTFT soal prefill/antrean, TPOT soal ukuran model.",
        "Lab: 50 replika-menit = $2,50; INT8 hemat 13,0 GB (50%).",
      ],
      next: {
        label: "MLOps22 — Distributed Training: DDP, FSDP & Ray Train",
        href: "/learn/mlops22-distributed-training",
      },
    },
  ],
};
