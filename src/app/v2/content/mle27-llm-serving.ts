import type { V2Lesson } from "../lib/types";

// Latensi: sekuensial 100 pass vs continuous batching 40 pass (4 request, 0,1 dtk/pass).
const FIG_BATCH = `<svg viewBox="0 0 480 260" role="img" aria-label="Perbandingan waktu: sekuensial 10 detik vs continuous batching 4 detik.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="100" y1="30" x2="100" y2="200"/><line x1="100" y1="200" x2="460" y2="200"/></g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)">
<text x="100" y="216" text-anchor="middle">0</text><text x="172" y="216" text-anchor="middle">2</text><text x="244" y="216" text-anchor="middle">4</text><text x="316" y="216" text-anchor="middle">6</text><text x="388" y="216" text-anchor="middle">8</text><text x="460" y="216" text-anchor="middle">10 dtk</text>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text)">
<text x="8" y="86">Sekuensial</text><text x="8" y="146">Cont. batch</text>
</g>
<rect x="100" y="70" width="360" height="26" fill="var(--c1)" fill-opacity="0.85" rx="4"/>
<rect x="100" y="130" width="144" height="26" fill="var(--c2)" fill-opacity="0.85" rx="4"/>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)">
<text x="464" y="88" text-anchor="end">10,0 dtk</text>
<text x="250" y="148" text-anchor="start">4,0 dtk</text>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--c4)" font-weight="700">
<text x="244" y="170" text-anchor="middle">request selesai bersamaan — tidak ada yang menunggu giliran</text>
</g>
<text x="280" y="240" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">waktu total 4 request (10/20/30/40 token, 0,1 dtk per forward pass)</text>
</svg>`;

// KV cache: 5,0 MB puncak vs budget 4,0 MB.
const FIG_KV = `<svg viewBox="0 0 480 240" role="img" aria-label="Puncak KV cache 5 MB melebihi budget 4 MB.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="190" x2="460" y2="190"/></g>
<rect x="120" y="40" width="90" height="150" fill="var(--c2)" fill-opacity="0.85" rx="4"/>
<rect x="250" y="40" width="90" height="150" fill="var(--c1)" fill-opacity="0.35" rx="4"/>
<rect x="250" y="70" width="90" height="120" fill="var(--c1)" fill-opacity="0.85" rx="4"/>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle" fill="var(--text)">
<text x="165" y="206">Puncak: 5,0 MB</text><text x="295" y="206">Budget: 4,0 MB</text>
</g>
<line x1="60" y1="70" x2="460" y2="70" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="452" y="62" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="end">kelebihan 1,0 MB = satu request harus menunggu/evict</text>
<text x="260" y="230" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">KV cache = 2 × token × d × layer × byte — tumbuh dengan konkurensi</text>
</svg>`;

export const mle27: V2Lesson = {
  slug: "mle27-llm-serving",
  track: "Machine Learning Engineer",
  module: "Serving & Skala",
  title: "MLE27 — LLM Serving at Scale: vLLM, Kuantisasi, dan SLO",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Chatbot 8 detik yang “butuh GPU lebih besar”",
      prose: [
        "April 2026. Asisten dokumen sebuah sekuritas menjawab pertanyaan nasabah dalam 8 detik — terlalu lambat untuk chat. Tim infra mengusulkan GPU 2× lebih mahal. Seorang engineer menolak dan membuka profiler: GPU-nya menganggur 70% dari waktu. Modelnya tidak lambat — ia MENUNGGU.",
        "Temuannya: server memproses SATU request dalam satu waktu (tanpa batching), dan setiap request menunggu request sebelumnya selesai total — termasuk request 400 token yang memblokir tiga request 20 token di belakangnya. Ditambah KV cache yang tak dibatasi: pada jam sibuk, memori habis dan server me-restart diam-diam. Twist-nya: setelah continuous batching + batas konkurensi + kuantisasi INT8, latensi median turun 8 → 1,1 detik DI GPU YANG SAMA. Mereka hampir membayar 2× untuk masalah yang solusinya gratis.",
        "Pelajaran lesson ini: serving LLM adalah soal ARUS, bukan soal otot. GPU yang menganggur 70% tidak butuh diganti — butuh diberi kerja yang lebih pintar.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung kebutuhan KV cache dari panjang konteks dan batch; (2) menjelaskan PagedAttention dan continuous batching; (3) membandingkan strategi kuantisasi inferensi (INT8/FP8/AWQ); (4) menetapkan SLO TTFT/TPOT yang waras; (5) mendiagnosis bottleneck serving dari metrik antrean.",
        "🗺️ Peta lesson: Langkah 1 · Cerita — Langkah 2 · KV cache & PagedAttention — Langkah 3 · Continuous batching — Langkah 4 · Kuantisasi & SLO — Langkah 5 · Lab antrean & KV budget — Langkah 6 · Jebakan produksi — Langkah 7 · Peta keputusan — Langkah 8 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Serving LLM = mengatur arus request dan memori, bukan membeli GPU terbesar.",
    },
    {
      id: "kv-cache",
      eyebrow: "Langkah 2 · KV cache & PagedAttention",
      title: "PagedAttention: si pustakawan yang tidak membuang halaman",
      prose: [
        "Saat LLM men-generate token, ia menyimpan key dan value setiap token sebelumnya — KV cache. Tanpa cache, tiap token baru menghitung ulang attention atas seluruh riwayat (O(n²) per token — bunuh diri komputasi). Dengan cache, tiap langkah hanya memproses 1 token baru. Tetapi cache ini MEMAKAN memori: 2 (K dan V) × panjang sekuens × dimensi × jumlah layer × byte per nilai.",
        "Masalah klasik: alokasi memori kontigu. Server lama memesan blok memori sebesar MAKSIMUM panjang sekuens untuk tiap request — request 20 token memakan jatah 4.096 token. Hasilnya fragmentasi: memori “penuh” padahal 70% kosong tak terpakai. PagedAttention (inti vLLM) memecahnya seperti virtual memory OS: KV cache disimpan dalam blok-blok kecil (pages) yang dialokasi sesuai kebutuhan aktual. Fragmentasi nyaris nol, batch bisa jauh lebih besar.",
        "Rumusnya wajib bisa dihitung di kepala: untuk L token, d_model, n layer, b byte → 2·L·d·n·b. Contoh: L=4.096, d=4.096, 32 layer, fp16 → 2×4096×4096×32×2 byte ≈ 2,1 GB PER REQUEST. Sepuluh request konkuren = 21 GB — satu GPU 24 GB habis hanya untuk cache, sebelum bobot model dihitung.",
        "Cara membaca: batang kiri = puncak KV cache 5,0 MB pada contoh lab (4 request konkuren); batang kanan = budget 4,0 MB; garis putus-putus = batas. Interpretasi: kelebihan 1,0 MB bukan “sedikit” — ia berarti satu request HARUS menunggu atau di-evict; tanpa batas konkurensi, inilah yang me-restart server di cerita.",
      ],
      formula: String.raw`M_{KV} = 2 \times L \times d \times n_{\text{layer}} \times b`,
      formulaNote: "M_KV = memori KV cache per request; 2 = key DAN value; L = panjang sekuens (token); d = dimensi model (d_model); n_layer = jumlah layer; b = byte per nilai (fp16 = 2). Contoh: 2×4096×4096×32×2 byte ≈ 2,1 GB — satu request panjang bisa memakan sepersepuluh GPU sendirian.",
      figure: {
        svg: FIG_KV,
        alt: "Puncak KV cache 5 MB melebihi budget 4 MB.",
        caption: "KV cache tumbuh dengan konkurensi. Tanpa budget, server kehabisan memori di jam sibuk.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“KV cache itu detail implementasi — biar framework yang urus.” Di skala kecil, benar. Di produksi dengan ratusan request konkuren, KV cache adalah KONSUMEN MEMORI TERBESAR — lebih besar dari bobot model. Engineer yang tidak bisa menghitung M_KV tidak bisa menentukan batas konkurensi, dan batas konkurensi menentukan SLO-mu. Ini bukan detail; ini anggaran.",
      },
      reference: "KV cache = 2·L·d·layer·b per request. PagedAttention menghilangkan fragmentasi alokasi.",
    },
    {
      id: "batching",
      eyebrow: "Langkah 3 · Continuous batching",
      title: "Continuous batching: si restoran yang mengisi kursi kosong",
      prose: [
        "Serving naive memproses request satu per satu (atau menunggu batch penuh sebelum jalan — static batching). Masalahnya: request selesai di waktu berbeda. Request 10 token selesai dalam 1 detik, tetapi “kursinya” tetap dipesan sampai request 40 token selesai di detik ke-4 — GPU menganggur menunggu yang lambat. Inilah head-of-line blocking versi LLM.",
        "Continuous batching (vLLM): setiap forward pass, request yang SUDAH SELESAI langsung diganti request antrean berikutnya — tanpa menunggu batch selesai. Analoginya restoran: tamu yang selesai makan langsung diganti tamu menunggu, meja tidak pernah dibiarkan kosong menunggu satu tamu yang makan lambat. Hasilnya pada contoh lab: 100 forward pass → 40 pass, speedup 2,5×, di hardware yang sama.",
        "Cara membaca: batang atas = sekuensial 10,0 detik (100 pass); batang bawah = continuous batching 4,0 detik (40 pass) — request-request selesai tumpang tindih. Interpretasi: speedup 2,5× datang BUKAN dari komputasi lebih cepat, melainkan dari tidak adanya waktu menganggur; request pendek tidak lagi dihukum oleh request panjang di depannya.",
        "Syaratnya: scheduler yang mengatur siapa masuk/keluar tiap iterasi + preemption (request prioritas rendah bisa dijeda saat memori penuh). vLLM, TGI, dan TensorRT-LLM semuanya mengimplementasikan varian ini — ini alasan mereka mengalahkan server naive 2–5× tanpa mengubah model.",
      ],
      formula: String.raw`\text{speedup} \approx \frac{\sum_i T_i}{\max_i T_i} \quad (\text{kasus tanpa prefill, arrival bersamaan})`,
      formulaNote: "T_i = jumlah token (forward pass) request ke-i. Pembilang = total pass bila sekuensial; penyebut = pass terpanjang bila batching sempurna. Contoh lab: (10+20+30+40)/40 = 2,5×. Ini batas atas ideal — prefill dan arrival acak menurunkannya sedikit.",
      figure: {
        svg: FIG_BATCH,
        alt: "Perbandingan waktu: sekuensial 10 detik vs continuous batching 4 detik.",
        caption: "Continuous batching 2,5× lebih cepat: tidak ada GPU menganggur menunggu request terpanjang.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Decode LLM itu memory-bound, bukan compute-bound: tiap forward pass membaca SELURUH bobot model dari memori untuk menghasilkan 1 token. Batching N request dalam 1 pass = membaca bobot sekali untuk N token (amortisasi). Itulah kenapa batching begitu powerful di LLM — ia menyerang bottleneck-nya langsung: bandwidth memori, bukan FLOPS.",
      },
      reference: "Continuous batching = ganti request selesai dengan antrean tiap iterasi. Speedup datang dari nol idle.",
    },
    {
      id: "kuantisasi-slo",
      eyebrow: "Langkah 4 · Kuantisasi & SLO",
      title: "INT8, TTFT, dan janji yang bisa dipegang",
      prose: [
        "Kuantisasi inferensi: menurunkan presisi bobot SAAT SERVING (bukan training). INT8 memangkas memori 2× dan mempercepat komputasi di hardware yang mendukung; FP8 (format 8-bit floating) menjaga rentang dinamis lebih baik untuk aktivasi; AWQ/GPTQ adalah metode kuantisasi 4-bit yang sadar aktivasi — penting karena beberapa channel aktivasi LLM punya outlier besar yang hancur bila dikuantisasi naif. Trade-off: kualitas turun sedikit (ukur di benchmark-mu!), biaya turun banyak.",
        "Tensor parallelism: membelah matriks bobot ke beberapa GPU (tiap GPU memegang sebagian kolom) — untuk model yang bahkan dalam 4-bit tidak muat di satu GPU. Harganya: komunikasi antar-GPU tiap layer (butuh NVLink/InfiniBand yang cepat); keuntungannya: latensi turun karena komputasi paralel.",
        "Dua metrik SLO yang wajib: TTFT (time to first token) — jeda dari request sampai token pertama keluar (didominasi prefill); TPOT (time per output token) — kecepatan streaming setelahnya (didominasi decode). SLO waras contoh: p95 TTFT < 1 detik, p95 TPOT < 100 ms untuk chat. Ukur p95/p99, BUKAN rata-rata — rata-rata menyembunyikan penderitaan 5% user terburuk.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Rata-rata latensi 800 ms — SLO terpenuhi.” Rata-rata adalah pembohong yang sopan: 95% request di 300 ms dan 5% di 10 detik tetap memberi rata-rata 785 ms. User yang mengalami 10 detik tidak peduli rata-ratamu. SLO selalu dalam persentil (p95/p99) — dan alerting-nya juga.",
      },
      reference: "Kuantisasi = memori & bandwidth turun; TTFT/TPOT dalam p95/p99; tensor parallelism untuk model raksasa.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: antrean & KV budget (stdlib murni)",
      prose: [
        "Simulasikan 4 request (10/20/30/40 token, 0,1 dtk per forward pass): (1) hitung total pass & waktu untuk sekuensial vs continuous batching + speedup; (2) hitung puncak KV cache (0,05 MB per token) dan vonis terhadap budget 4,0 MB.",
        "Cara membaca: pass = jumlah forward pass; puncak KV = total token konkuren × 0,05 MB. Interpretasi: speedup 2,5× gratis dari penjadwalan; tetapi puncak 5,0 MB > budget 4,0 MB → tanpa batas konkurensi, batching agresif justru memicu OOM — kecepatan dan keamanan memori harus dirancang bersama.",
        "Coba: naikkan budget ke 6,0 MB — vonis apa yang keluar? Lalu tambah request kelima 50 token — berapa speedup barunya? (Jawaban: (100+50)/50 = 3,0× — makin timpang panjang request, makin besar untung batching.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung total forward pass & waktu untuk mode sekuensial dan continuous batching; simpan pass CB dalam `pass_cb` dan speedup dalam `speedup`" },
        { id: "t2", text: "Hitung puncak KV cache dalam MB (`kv_peak`) dan cetak vonis MELEBIHI/AMAN terhadap budget 4,0 MB" },
      ],
      expected: "pass sekuensial: 100 (10.0 dtk)\npass continuous batching: 40 (4.0 dtk)\nspeedup: 2.5x\npuncak KV cache: 5.0 MB (budget 4.0 MB) -> MELEBIHI: batasi konkurensi atau naikkan budget",
      code: {
        starter: `# DATA — jangan ubah
panjang = [10, 20, 30, 40]  # token per request
t_pass = 0.1                # detik per forward pass
kv_per_token = 0.05         # MB per token
budget = 4.0                # MB

# TUGAS 1: sekuensial vs continuous batching
def total_sekuensial(ls):
    # TODO t1: jumlahkan semua panjang
    return 0

def total_cb(ls):
    # TODO t1: ambil panjang maksimum
    return 0

pass_cb = 0     # TODO t1
speedup = 0.0   # TODO t1: total_sekuensial / total_cb

# TUGAS 2: puncak KV cache
kv_peak = 0.0   # TODO t2: sum(panjang) * kv_per_token

# CETAK (jangan ubah)
ps = total_sekuensial(panjang); pc = total_cb(panjang)
print(f"pass sekuensial: {ps} ({ps * t_pass:.1f} dtk)")
print(f"pass continuous batching: {pc} ({pc * t_pass:.1f} dtk)")
print(f"speedup: {ps / pc:.1f}x")
print(f"puncak KV cache: {kv_peak:.1f} MB (budget {budget:.1f} MB) -> {'MELEBIHI: batasi konkurensi atau naikkan budget' if kv_peak > budget else 'AMAN'}")`,
        lockLines: 6,
        solution: `# DATA — jangan ubah
panjang = [10, 20, 30, 40]  # token per request
t_pass = 0.1                # detik per forward pass
kv_per_token = 0.05         # MB per token
budget = 4.0                # MB

# TUGAS 1: sekuensial vs continuous batching
def total_sekuensial(ls):
    return sum(ls)

def total_cb(ls):
    return max(ls)

pass_cb = total_cb(panjang)
speedup = total_sekuensial(panjang) / pass_cb

# TUGAS 2: puncak KV cache
kv_peak = sum(panjang) * kv_per_token

# CETAK (jangan ubah)
ps = total_sekuensial(panjang); pc = total_cb(panjang)
print(f"pass sekuensial: {ps} ({ps * t_pass:.1f} dtk)")
print(f"pass continuous batching: {pc} ({pc * t_pass:.1f} dtk)")
print(f"speedup: {ps / pc:.1f}x")
print(f"puncak KV cache: {kv_peak:.1f} MB (budget {budget:.1f} MB) -> {'MELEBIHI: batasi konkurensi atau naikkan budget' if kv_peak > budget else 'AMAN'}")`,
        checks: [
          { kind: "defined", task: "t1", name: "pass_cb", label: "pass_cb terdefinisi", msg: "Simpan total forward pass continuous batching." },
          { kind: "equal", task: "t1", name: "pass_cb", value: 40, label: "pass CB = 40", msg: "Batching sempurna = panjang request terpanjang." },
          { kind: "equal", task: "t1", name: "speedup", value: 2.5, tol: 0.01, label: "speedup = 2,5×", msg: "100 / 40 = 2,5." },
          { kind: "equal", task: "t2", name: "kv_peak", value: 5.0, tol: 0.01, label: "puncak KV = 5,0 MB", msg: "100 token × 0,05 MB." },
          { kind: "stdout_matches", task: "t2", pattern: "MELEBIHI", label: "Vonis = MELEBIHI", msg: "5,0 > 4,0 — butuh batas konkurensi." },
        ],
      },
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan ketegangan di lab ini: batching ingin konkurensi SEBESAR mungkin (speedup), memori ingin konkurensi SEKECIL mungkin (aman). Scheduler produksi (vLLM) hidup tepat di tegangan ini: admit request baru hanya bila KV budget cukup, preempt bila tidak. Serving yang baik = optimasi terkendala, bukan maksimalisasi buta.",
      },
      reference: "Hitung dua-duanya: speedup dari batching DAN puncak memori dari konkurensi.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 6 · Jebakan produksi",
      title: "Tiga cara server LLM mati di jam sibuk",
      prose: [
        "Jebakan 1 — OOM senyap: KV cache tumbuh dengan (panjang konteks × konkurensi). Prompt 32k token dari satu user = 8× memori prompt 4k. Tanpa batas panjang konteks per request, satu user rakus menumbangkan semua. Obat: max context per request + admission control berbasis budget KV.",
        "Jebakan 2 — prefill raksasa memblokir decode: satu request prefill 30k token memonopoli GPU 2 detik; ratusan request chat kecil menunggu dengan TPOT hancur. Obat: chunked prefill (potong prefill besar menjadi potongan-potongan yang disisipkan di antara decode) — vLLM dan TGI mengimplementasikannya.",
        "Jebakan 3 — autoscaling yang buta: menambah replica saat antrean panjang TANPA memperhatikan bahwa bottleneck-nya bandwidth memori, bukan CPU. Replica baru di GPU yang sama justru berebut bandwidth dan memperlambat semuanya. Obat: scale berdasarkan KV utilization dan queue depth, bukan sekadar RPS.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Tambah GPU = latensi turun.” Hanya bila bottleneck-nya komputasi. Decode LLM itu memory-bound: menambah GPU tanpa menambah bandwidth memori agregat (atau tanpa tensor parallelism yang benar) sering kali hanya menambah tagihan. Diagnosis dulu dengan profiler: roofline analysis sebelum belanja.",
      },
      reference: "Batasi konteks, chunk prefill besar, scale dari KV utilization — bukan dari insting.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: arsitektur serving apa untuk bebanmu?",
      prose: [
        "Skenario 1 — chatbot internal, 10 RPS, 1 GPU 24 GB → vLLM + continuous batching + model 4-bit. Cukup.",
        "Skenario 2 — p95 TTFT meledak saat ada dokumen panjang → chunked prefill + batasi max context per request.",
        "Skenario 3 — model 70B, butuh < 2 dtk → tensor parallelism 2–4 GPU + FP8; hitung dulu M_KV untuk konkurensi target.",
        "Skenario 4 — OOM tiap jam sibuk → admission control berbasis budget KV + preemption; JANGAN tambah batch membabi buta.",
        "Skenario 5 — biaya GPU membengkak, kualitas masih OK → coba AWQ/GPTQ 4-bit; ukur ulang benchmark tugasmu sebelum puas.",
        "Aturan praktis 10 detik: (1) hitung M_KV untuk (konteks × konkurensi) target; (2) batching dulu sebelum beli GPU; (3) SLO dalam p95/p99; (4) scale dari KV utilization, bukan RPS.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: 8 detik → 1,1 detik tanpa belanja",
      prose: [
        "Sekuritas di cerita: 40 RPS, p95 8 detik, GPU utilization 30%. Diagnosis: tanpa batching (utilisasi rendah = GPU menganggur), tanpa batas konkurensi (restart OOM mingguan). Perbaikan: vLLM + continuous batching → throughput 2,8×; INT8 → memori turun 40%; max-concurrency dari hitungan M_KV → restart hilang. Hasil: p95 1,1 detik, utilization 75%, biaya TETAP.",
        "Hitungan keputusannya: opsi A (GPU 2×) = +Rp120 juta/bulan, p95 → ~4 detik (bottleneck-nya bukan FLOPS). Opsi B (rekayasa) = Rp0, p95 → 1,1 detik. Mereka hampir memilih A karena “lebih mudah dijelaskan ke manajemen”. Pelajaran organisasi: metrik yang benar (p95, KV utilization) membuat opsi B bisa dijelaskan — tanpa metrik, opsi termahal selalu terlihat paling aman.",
        "Pembahasan: urutan yang benar adalah ukur → batching → kuantisasi → batas konkurensi → TERAKHIR tambah hardware. Setiap langkah punya angka pembenarnya sendiri; jangan melompat ke langkah termahal tanpa angka.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "KV cache = 2·L·d·layer·b per request; PagedAttention menghilangkan fragmentasi.",
        "Continuous batching mengganti request selesai tiap iterasi → 2–5× throughput tanpa hardware baru.",
        "Decode itu memory-bound: batching menyerang bandwidth memori, bukan FLOPS.",
        "Kuantisasi inferensi (INT8/FP8/AWQ) memangkas memori & biaya; ukur kualitas ulang.",
        "SLO dalam p95/p99 (TTFT & TPOT); scale dari KV utilization, bukan RPS.",
      ],
      next: { label: "MLE28 — RAG & Agent Systems in Production", href: "/learn/mle28-rag-agent-production" },
      quiz: [
        {
          q: "Request 4.096 token, d=4.096, 32 layer, fp16. Perkiraan KV cache per request?",
          options: [
            { text: "±2,1 GB", why: "Tepat: 2×4096×4096×32×2 byte ≈ 2,15 GB.", correct: true },
            { text: "±134 MB", why: "Itu bila lupa mengalikan jumlah layer (32×).", correct: false },
            { text: "±8,6 GB", why: "Itu bila memakai 8 byte (fp64) — tidak dipakai di serving.", correct: false },
            { text: "±0,5 GB", why: "Terlalu kecil 4× — cek lagi faktor 2 (K dan V).", correct: false },
          ],
        },
        {
          q: "Continuous batching mengalahkan static batching terutama karena…",
          options: [
            { text: "Request yang selesai langsung diganti — tidak ada GPU menganggur menunggu yang lambat", why: "Tepat: menghilangkan head-of-line blocking antar request.", correct: true },
            { text: "Komputasi per token menjadi lebih cepat", why: "Kecepatan per token sama; yang berubah adalah utilisasi.", correct: false },
            { text: "Modelnya dikompresi otomatis", why: "Batching tidak mengubah model sama sekali.", correct: false },
            { text: "Request pendek diprioritaskan selalu", why: "Tidak harus — intinya penggantian tiap iterasi, bukan prioritas.", correct: false },
          ],
        },
        {
          q: "p95 latensi 10 detik tetapi rata-rata 785 ms. Kesimpulan waras?",
          options: [
            { text: "SLO bermasalah — 5% user menderita; selidiki ekornya (prefill besar? antrean?)", why: "Tepat: rata-rata menyembunyikan ekor; SLO diukur dari persentil.", correct: true },
            { text: "SLO terpenuhi karena rata-rata di bawah 1 detik", why: "Rata-rata bukan SLO; user di ekor tidak peduli rata-rata.", correct: false },
            { text: "Tambah GPU untuk menurunkan rata-rata", why: "Rata-rata sudah rendah; masalahnya di ekor, bukan kapasitas rata-rata.", correct: false },
            { text: "Kurangi jumlah user", why: "Mengobati gejala; cari penyebab ekornya dulu.", correct: false },
          ],
        },
        {
          q: "Server OOM tiap jam sibuk padahal GPU utilization hanya 50%. Dugaan pertama?",
          options: [
            { text: "KV cache meledak oleh konkurensi × konteks panjang — terapkan admission control berbasis budget KV", why: "Tepat: utilization rendah + OOM = kehabisan memori, bukan komputasi; KV cache tersangka utama.", correct: true },
            { text: "Model terlalu besar — ganti yang lebih kecil", why: "Utilization 50% menunjukkan komputasi bukan masalah; model bukan tersangka.", correct: false },
            { text: "Batching terlalu kecil", why: "Batching kecil menurunkan throughput, bukan menyebabkan OOM.", correct: false },
            { text: "Jaringan lambat", why: "Jaringan tidak menyebabkan OOM GPU.", correct: false },
          ],
        },
        {
          q: "Kapan tensor parallelism dibutuhkan?",
          options: [
            { text: "Model (bahkan terkuantisasi) tidak muat di satu GPU dan butuh latensi rendah", why: "Tepat: belah matriks ke beberapa GPU untuk model raksasa.", correct: true },
            { text: "Selalu — lebih banyak GPU selalu lebih baik", why: "Komunikasi antar-GPU tiap layer ada harganya; untuk model kecil justru memperlambat.", correct: false },
            { text: "Untuk menaikkan throughput batch kecil", why: "Throughput batch kecil lebih baik dilayani batching + replikasi.", correct: false },
            { text: "Untuk menggantikan kuantisasi", why: "Keduanya komplemen: kuantisasi dulu, paralel bila masih tidak muat.", correct: false },
          ],
        },
      ],
    },
  ],
};
