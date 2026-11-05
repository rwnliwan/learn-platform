import type { V2Lesson } from "../lib/types";

// Lab 1: 70B params, Adam mixed precision (16 byte/param). N=8: DDP 1120, Z1 385, Z2 262.5, Z3 140 GB.
const FIG_MEM = `<svg viewBox="0 0 480 270" role="img" aria-label="Memori per GPU 8xH100 untuk model 70B: DDP 1120 GB, ZeRO-3 140 GB.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="90" y1="215" x2="460" y2="215"/><line x1="90" y1="165" x2="460" y2="165"/><line x1="90" y1="115" x2="460" y2="115"/><line x1="90" y1="65" x2="460" y2="65"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="84" y="219">0</text><text x="84" y="169">400</text><text x="84" y="119">800</text><text x="84" y="69">1200 GB</text></g>
<g font-size="12" font-family="var(--font-ui)">
<rect x="120" y="70" width="320" height="26" fill="var(--c1)"/><text x="112" y="89" fill="var(--chart-text)" text-anchor="end">DDP</text><text x="445" y="89" fill="var(--text)" text-anchor="end">1120</text>
<rect x="120" y="108" width="110" height="26" fill="var(--c2)"/><text x="112" y="127" fill="var(--chart-text)" text-anchor="end">ZeRO-1</text><text x="235" y="127" fill="var(--text)">385</text>
<rect x="120" y="146" width="75" height="26" fill="var(--c4)"/><text x="112" y="165" fill="var(--chart-text)" text-anchor="end">ZeRO-2</text><text x="200" y="165" fill="var(--text)">262</text>
<rect x="120" y="184" width="40" height="26" fill="var(--chart-grid)" stroke="var(--c1)" stroke-width="2"/><text x="112" y="203" fill="var(--chart-text)" text-anchor="end">ZeRO-3</text><text x="165" y="203" fill="var(--text)">140</text>
</g>
<line x1="148" y1="60" x2="148" y2="220" stroke="var(--text)" stroke-width="2" stroke-dasharray="6 4"/><text x="148" y="50" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">H100 = 80 GB</text>
<text x="290" y="250" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">tambah GPU tidak menolong DDP: replika penuh di tiap GPU</text>
</svg>`;

// Skema sharding FSDP: 4 GPU memegang potongan parameter yang berbeda.
const FIG_SHARD = `<svg viewBox="0 0 480 250" role="img" aria-label="FSDP: parameter dibagi 4, tiap GPU pegang seperempat.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="30" y="40" width="90" height="130" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="75" y="32" fill="var(--text)">GPU 0</text>
<rect x="145" y="40" width="90" height="130" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="190" y="32" fill="var(--text)">GPU 1</text>
<rect x="260" y="40" width="90" height="130" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="305" y="32" fill="var(--text)">GPU 2</text>
<rect x="375" y="40" width="90" height="130" rx="8" fill="none" stroke="var(--chart-text)" stroke-width="2"/><text x="420" y="32" fill="var(--text)">GPU 3</text>
<rect x="38" y="48" width="74" height="30" fill="var(--c1)"/><text x="75" y="68" fill="var(--text)">P0</text>
<rect x="153" y="80" width="74" height="30" fill="var(--c2)"/><text x="190" y="100" fill="var(--text)">P1</text>
<rect x="268" y="112" width="74" height="30" fill="var(--c4)"/><text x="305" y="132" fill="var(--text)">P2</text>
<rect x="383" y="144" width="74" height="30" fill="var(--chart-grid)" stroke="var(--chart-text)" stroke-width="1.5"/><text x="420" y="164" fill="var(--text)">P3</text>
<text x="75" y="200" fill="var(--chart-text)">all-gather: pinjam</text><text x="75" y="216" fill="var(--chart-text)">P1..P3 saat forward</text>
<text x="305" y="200" fill="var(--chart-text)">reduce-scatter:</text><text x="305" y="216" fill="var(--chart-text)">gradien dibagi lagi</text>
</g>
<text x="240" y="240" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">shard = sewa gudang bersama; komputasi = pinjam sebentar, kembalikan</text>
</svg>`;

export const dle15: V2Lesson = {
  slug: "dle15-distributed-training",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE15 — Distributed Training: DDP, FSDP, dan ZeRO",
  estMinutes: 54,
  steps: [
    {
      id: "cerita-oom",
      eyebrow: "Langkah 1 · Cerita",
      title: "70B parameter, 8 GPU, OOM di batch pertama",
      prose: [
        "Tim riset startup AI menyewa 8xH100 untuk fine-tune model 70B parameter. Batch size = 1 (satu! tidak bisa lebih kecil). Training dimulai — 40 detik kemudian: CUDA out of memory. Arsitek senior mengusulkan 'tambah GPU jadi 16'. Ditambah. Hasilnya: OOM lagi, di batch pertama yang sama. Uang cloud terbakar Rp180 juta sebelum satu step pun selesai.",
        "Penyebabnya brutal dan sederhana: 70 miliar parameter × 2 byte (fp16) = 140 GB hanya untuk bobot — satu H100 hanya 80 GB. Dan DDP (Distributed Data Parallel) MEREPLIKASI seluruh model ke tiap GPU: 16 GPU berarti 16 salinan 140 GB, bukan 140 GB dibagi 16. Menambah GPU tanpa sharding seperti membeli 16 gudang lalu mengisi tiap gudang dengan barang yang sama persis.",
        "Twist-nya: solusinya bukan GPU lebih banyak, melainkan GPU yang BERBAGI. FSDP (Fully Sharded Data Parallel) memotong model menjadi 1/8 di tiap GPU (17,5 GB), meminjam potongan lain lewat all-gather hanya saat dibutuhkan, lalu mengembalikannya. Ditambah optimizer state yang di-shard (ZeRO), 70B yang mustahil di 8 GPU menjadi muat — dengan aritmetika yang bisa kamu hitung sendiri di lab pertama.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung kebutuhan memori training (parameter + gradien + optimizer state); (2) menjelaskan mengapa DDP tidak menghemat memori; (3) membedakan ZeRO-1/2/3 dan strategi sharding FSDP; (4) memilih kapan memakai CPU offload dan mixed precision; (5) memetakan strategi distribusi dari model 7B hingga 70B+.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · DDP dan aritmetika memori — Langkah 3 · Lab kalkulator memori — Langkah 4 · FSDP, ZeRO, offload — Langkah 5 · Lab scheduler gradien — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "DDP = replika penuh. Tambah GPU tanpa sharding tidak menambah memori model.",
    },
    {
      id: "konsep-ddp",
      eyebrow: "Langkah 2 · DDP dan memori",
      title: "DDP: cepat, sederhana, dan rakus memori",
      prose: [
        "Data parallel bekerja dengan prinsip 'bagi DATA, salin MODEL': tiap GPU memegang replika penuh model, memproses batch data yang berbeda, lalu merata-ratakan gradien lewat all-reduce. Ring all-reduce mengirim total 2(N−1)/N × ukuran_gradien per GPU — elegan karena biaya komunikasinya nyaris tidak tumbuh saat N membesar. Untuk model yang MUAT di satu GPU, DDP adalah pilihan tercepat dan termudah. Inilah default yang benar untuk 90% kasus.",
        "Tetapi 'bagi data' ≠ 'bagi memori'. Tiap GPU tetap menyimpan: parameter (P), gradien (P), dan optimizer state. Adam menyimpan tiga tensor fp32 per parameter: momentum m, variance v, dan salinan master fp32 — total 12 byte/parameter. Dengan mixed precision (parameter + gradien fp16 = 2+2 byte), totalnya 16 byte per parameter. Model 70B = 1,12 TB per GPU — angka yang tidak bisa dinegosiasi, berapa pun jumlah GPU-nya.",
        "Kepribadian DDP: kurir kilat yang membawa fotokopi seluruh arsip ke tiap cabang. Pengiriman antar cabang efisien (all-reduce), tetapi tiap cabang butuh gudang sebesar arsip penuh. Untuk arsip 70B, tidak ada gudang (GPU) yang cukup — kurirnya tidak bersalah, arsipnya yang kebesaran.",
        "Kapan DDP menang: model muat di satu GPU dengan nyaman (aturan praktis: < 60% memori GPU setelah aktivasi). Komunikasi all-reduce-nya minimal dan teroptimasi NCCL; tidak ada all-gather berulang seperti FSDP. Jangan membayar kompleksitas sharding untuk masalah yang tidak ada — DDP untuk 7B di 8xH100 seringkali LEBIH CEPAT dari FSDP.",
        "Prasyarat ringkas — training dan optimizer (dle8): Adam bukan SGD biasa — ia menyimpan m, v, dan master weight fp32, dan ketiga tensor inilah yang membuat optimizer state 3x lebih besar dari parameternya sendiri; tanpa memahami ini, angka 16 byte/param terlihat seperti sihir. Scaling generik (mle10): menambah mesin mempercepat komputasi, tetapi DDP tidak menambah KAPASITAS MEMORI model — dua jenis scaling yang sering tertukar.",
      ],
      formula: String.raw`M_{GPU} = P \times (b_{param} + b_{grad} + b_{opt}) \qquad b_{opt}^{Adam} = 4 + 4 + 4 = 12\text{ byte}`,
      formulaNote: "M_GPU = memori per GPU; P = jumlah parameter; b = byte per parameter (fp16 = 2, fp32 = 4). Adam: m (4) + v (4) + master fp32 (4) = 12 byte. Contoh: 70B × 16 byte = 1.120 GB — inilah yang dihitung lab untuk tiap strategi.",
      figure: {
        svg: FIG_MEM,
        alt: "Memori per GPU di 8xH100 untuk 70B: DDP 1120 GB vs ZeRO-3 140 GB; garis H100 80 GB.",
        caption: "Aritmetika kejam: hanya sharding penuh yang mendekati 80 GB.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'DDP adalah model paralel.' Salah — DDP itu DATA paralel (model disalin, data dibagi). Model paralel = modelnya yang dipotong: tensor parallel (tiap layer dibagi) atau pipeline parallel (layer berbeda di GPU berbeda). Tertukar istilahnya = salah memilih strategi = OOM yang 'misterius'.",
      },
      reference: "DDP: replika penuh, all-reduce gradien. 16 byte/param dengan Adam mixed precision.",
    },
    {
      id: "lab-memori",
      eyebrow: "Langkah 3 · Lab memori",
      title: "Lab: kalkulator memori DDP vs ZeRO (stdlib saja)",
      prose: [
        "SIMULASI SKALA — lab ini murni komputasi aritmetika Python (stdlib saja), BUKAN training 70B sungguhan. Tulis fungsi gb_per_gpu(strategy, n): DDP = 16 byte/param di tiap GPU; ZeRO-1 men-shard optimizer state (12 byte) → 4 + 12/n; ZeRO-2 menambah shard gradien → 2 + 14/n; ZeRO-3/FSDP FULL_SHARD men-shard semuanya → 16/n. Kalikan dengan 70 miliar parameter, bandingkan dengan 80 GB H100 untuk n = 8 dan n = 32.",
        "Eksplorasi wajib: (1) ubah P ke 7 miliar — strategi apa yang tiba-tiba 'cukup' dengan DDP? (inilah mengapa 7B fine-tune santai di 8 GPU); (2) ubah n = 64 untuk 70B — ZeRO-3 butuh berapa GB/GPU?; (3) simulasikan tanpa mixed precision (param+grad fp32 = 4+4, Adam 12 → 20 byte/param) — lihat DDP melonjak ke 1.400 GB. Pada n berapa ZeRO-3 akhirnya MUAT di 80 GB?",
        "Cara membaca: 'OOM' berarti strategi itu mustahil di konfigurasi tersebut — bukan 'lambat', melainkan 'tidak jalan sama sekali'. Interpretasi: kolom ZeRO-3 adalah satu-satunya yang turun saat n naik — satu-satunya strategi yang mengubah 'tambah GPU' menjadi 'tambah memori'.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `gb_per_gpu(strategy, n)` untuk DDP, ZeRO-1, ZeRO-2, ZeRO-3" },
        { id: "t2", text: "`print` tabel GB/GPU + MUAT/OOM untuk n = 8 dan n = 32" },
      ],
      expected: "8 GPU: DDP 1120.0, ZeRO-1 385.0, ZeRO-2 262.5, ZeRO-3 140.0 (semua OOM); 32 GPU: ZeRO-3 35.0 MUAT",
      note: {
        title: "💡 Intuisi",
        body: "Angka 16 byte/param adalah 'pajak training' yang tidak terlihat di paper: model 70B 'hanya' 140 GB sebagai file, tetapi 1,12 TB saat dilatih. Engineer yang hanya menghitung ukuran file akan OOM; yang menghitung pajaknya akan memilih sharding sebelum menyewa GPU.",
      },
      hints: [
        "DDP: b = 16.0 ; ZeRO-1: b = 4.0 + 12.0/n ; ZeRO-2: b = 2.0 + 14.0/n ; ZeRO-3: b = 16.0/n",
        "GB = b * P / 1e9 ; MUAT bila < 80",
        "cetak dengan f-string: f\"{s}: {g:.1f} GB/GPU -> {'MUAT' if g < 80 else 'OOM'}\"",
      ],
      code: {
        starter: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — bukan training 70B asli)
P = 70_000_000_000          # 70 miliar parameter
GPU_GB = 80                # H100 80 GB

# TULIS KODEMU
def gb_per_gpu(strategy, n):
    # TODO t1: tentukan b = byte per parameter sesuai strategi, return b * P / 1e9
    return 0.0

# UJI (jangan ubah)
for n in (8, 32):
    print(f"--- {n} GPU ---")
    for s in ("DDP", "ZeRO-1", "ZeRO-2", "ZeRO-3"):
        g = gb_per_gpu(s, n)
        print(f"{s}: {g:.1f} GB/GPU -> {'MUAT' if g < GPU_GB else 'OOM'}")`,
        lockLines: 3,
        solution: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — bukan training 70B asli)
P = 70_000_000_000          # 70 miliar parameter
GPU_GB = 80                # H100 80 GB

# TULIS KODEMU
def gb_per_gpu(strategy, n):
    if strategy == "DDP":
        b = 16.0
    elif strategy == "ZeRO-1":
        b = 4.0 + 12.0 / n
    elif strategy == "ZeRO-2":
        b = 2.0 + 14.0 / n
    elif strategy == "ZeRO-3":
        b = 16.0 / n
    return b * P / 1e9

# UJI (jangan ubah)
for n in (8, 32):
    print(f"--- {n} GPU ---")
    for s in ("DDP", "ZeRO-1", "ZeRO-2", "ZeRO-3"):
        g = gb_per_gpu(s, n)
        print(f"{s}: {g:.1f} GB/GPU -> {'MUAT' if g < GPU_GB else 'OOM'}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ZeRO-3: 140\\.0 GB/GPU -> OOM", label: "ZeRO-3 @8 GPU = 140 GB", msg: "Rumus sharding penuh benar." },
          { kind: "stdout_matches", task: "t2", pattern: "DDP: 1120\\.0 GB/GPU -> OOM", label: "DDP = 1120 GB", msg: "Replika penuh tidak terbagi." },
          { kind: "stdout_matches", task: "t2", pattern: "ZeRO-3: 35\\.0 GB/GPU -> MUAT", label: "ZeRO-3 @32 GPU muat", msg: "Sharding mengubah tambah-GPU jadi tambah-memori." },
        ],
      },
      reference: "16 byte/param: 2 param + 2 grad + 12 Adam. Shard = bagi dengan n.",
    },
    {
      id: "konsep-fsdp",
      eyebrow: "Langkah 4 · FSDP dan ZeRO",
      title: "FSDP: potong modelnya, pinjam saat perlu",
      prose: [
        "ZeRO (Zero Redundancy Optimizer, DeepSpeed) adalah ide intinya dalam tiga tahap: ZeRO-1 men-shard optimizer state (12 byte/param dibagi n); ZeRO-2 menambah sharding gradien (2 byte); ZeRO-3 men-shard parameter juga (2 byte) — total 16/n byte per GPU. FSDP (FullyShardedDataParallel, PyTorch) adalah implementasi ZeRO-3 sebagai wrapper: bungkus nn.Module dengan FSDP(model), dan parameter otomatis dipotong-potong ke semua rank.",
        "Mekanismenya seperti perpustakaan bersama: tiap GPU menyimpan 1/n parameter (shard-nya). Sebelum forward tiap layer, FSDP melakukan all-gather untuk 'meminjam' shard lain — menghitung — lalu melepaskannya (reshard). Backward: gradien di-reduce-scatter (rata-rata + potong) sehingga tiap GPU hanya menyimpan gradien shard-nya. Pinjam-kembali ini berbiaya komunikasi, tetapi mengubah memori dari O(P) menjadi O(P/n).",
        "PyTorch memberi empat strategi sharding (torch.distributed.fsdp.ShardingStrategy): FULL_SHARD = ZeRO-3 penuh (default, hemat memori maksimal); SHARD_GRAD_OP = ZeRO-2 (parameter utuh saat komputasi, di-shard di luar komputasi — lebih cepat, lebih boros); NO_SHARD = DDP biasa (replika penuh, all-reduce); HYBRID_SHARD = FULL_SHARD di dalam node + replika antar-node (untuk model sedang di klaster yang interkoneksinya lambat — komunikasi mahal hanya intra-node via NVLink).",
        "Dua pendamping wajib. CPU offload (CPUOffload(offload_params=True)): parameter dan gradien yang tidak dipakai diparkir di RAM CPU — optimizer step bahkan jalan di CPU. Lambat (PCIe!), tetapi memungkinkan training yang mustahil di GPU saja; untuk fine-tune 70B di 4 GPU, ini penyelamat. Mixed precision (MixedPrecision(param_dtype=torch.bfloat16)): komputasi jalan di bf16 (separuh byte, separuh komunikasi), tetapi shard parameter disimpan fp32 untuk optimizer step dan norm layer tetap fp32 — presisi dijaga di tempat yang penting.",
        "Detail engineering yang membedakan profesional: backward_prefetch = komunikasi bucket berikutnya dimulai selagi komputasi bucket berjalan (overlap, lihat lab 2); limit_all_gathers = 'rate limiter' agar prefetch agresif tidak meledakkan memori; summon_full_params untuk inspeksi/checkpoint (kumpulkan shard jadi model utuh sesaat). FSDP bukan sekadar 'bungkus dan jalan' — knop-knop inilah yang menentukan throughput akhirnya.",
        "Dokumen primernya hidup: halaman FSDP PyTorch terakhir diperbarui Mei 2026 dan terus menambah opsi sharding serta offload — selalu cek docs.pytorch.org/docs/main/fsdp.html sebelum mengunci desain training skala besar, karena default dan batasannya berubah antar rilis.",
      ],
      formula: String.raw`V_{allreduce} = 2\frac{N-1}{N}\,M \qquad M_{ZeRO3/GPU} = \frac{16 \times P}{N}`,
      formulaNote: "V = volume komunikasi ring all-reduce per GPU; N = jumlah GPU; M = ukuran gradien; P = parameter. Contoh: N=8, M=140 GB → V = 245 GB per GPU per step. ZeRO-3: 16 byte/param dibagi N — inilah rumus lab tadi.",
      figure: {
        svg: FIG_SHARD,
        alt: "Empat GPU masing-masing memegang seperempat parameter; all-gather meminjam saat forward.",
        caption: "Shard + pinjam: memori O(P/n), komunikasi sebagai harga.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'FSDP selalu lebih cepat dari DDP.' Salah — FSDP membayar all-gather/reduce-scatter di SETIAP layer, setiap step. Jika model muat nyaman di DDP, DDP menang telak (komunikasi minimal). FSDP adalah alat agar yang MUSTAHIL menjadi MUNGKIN, bukan agar yang cepat menjadi lebih cepat.",
      },
      reference: "FULL_SHARD = ZeRO-3; SHARD_GRAD_OP = ZeRO-2; HYBRID untuk antar-node lambat.",
    },
    {
      id: "lab-scheduler",
      eyebrow: "Langkah 5 · Lab scheduler",
      title: "Lab: simulator overlap komunikasi-komputasi",
      prose: [
        "SIMULASI SKALA — murni aritmetika Python (stdlib saja), angka ilustratif bukan benchmark hardware. Modelkan backward pass: gradien dibagi 8 bucket; tiap bucket butuh 6ms komputasi + 10ms all-reduce (interkonek lambat = communication-bound). Tulis total_ms(overlap, accum) untuk 4 mode: tanpa apa-apa; overlap saja (komunikasi bucket i jalan selagi bucket i+1 dihitung); akumulasi gradien saja (4 micro-batch tanpa sinkronisasi = no_sync, komunikasi 1x); keduanya.",
        "Eksplorasi wajib: (1) ubah t_comm_bucket 10 → 3 (interkonek cepat, NVLink) — mode apa yang keuntungannya menyusut? (komunikasi bukan lagi bottleneck); (2) ubah n_accum 4 → 8 — kapan akumulasi berhenti membantu? (komputasi total tumbuh, komunikasi sudah tenggelam); (3) renungkan: overlap + akumulasi = 198ms vs baseline 128ms per step TETAPI memproses 4x data — hitung throughput per micro-batch (49,5ms vs 128ms).",
        "Cara membaca: 'overlap' menghemat 42ms (128→86) tanpa mengubah hasil matematis sama sekali — optimasi gratis bila diimplementasikan benar (backward_prefetch di FSDP). Interpretasi: akumulasi gradien bukan cuma 'batch besar murah', melainkan juga AMORTISASI komunikasi: bayar all-reduce sekali untuk 4 micro-batch.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `total_ms(overlap, accum)` untuk 4 kombinasi mode" },
        { id: "t2", text: "`print` keempat total (ms) dan tentukan mode tercepat per micro-batch" },
      ],
      expected: "128.0, 86.0, 272.0, 198.0 ms — overlap+akumulasi tercepat per micro-batch (49.5 ms)",
      note: {
        title: "💡 Intuisi",
        body: "Jadwal gradien = 'jadwal truk gudang'. Tanpa jadwal, truk (komunikasi) menunggu bongkar (komputasi) selesai — gudang menganggur. Dengan overlap, truk berikutnya datang selagi bongkar berjalan. Akumulasi = 'kirim seminggu sekali, bukan tiap hari' — ongkir yang sama untuk muatan 4x lipat.",
      },
      hints: [
        "compute = 8 * 6 * (4 bila accum) ; comm = 8 * 10 (tetap 1x walau accum)",
        "tanpa overlap: compute + comm",
        "overlap: bila comm <= compute -> compute + 6 ; bila comm-bound -> 6 + comm",
      ],
      code: {
        starter: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — angka ilustratif, bukan benchmark hardware)
n_bucket = 8               # gradien dibagi 8 bucket komunikasi
t_compute_bucket = 6.0     # ms komputasi backward per bucket
t_comm_bucket = 10.0       # ms all-reduce per bucket (interkonek lambat)
n_accum = 4                # micro-batch diakumulasi tanpa sinkronisasi (no_sync)

# TULIS KODEMU
def total_ms(overlap, accum):
    # TODO t1: hitung total ms 1 step optimizer untuk 4 kombinasi mode
    return 0.0

# UJI (jangan ubah)
print("tanpa overlap        :", round(total_ms(False, False), 1), "ms")
print("overlap comm/compute :", round(total_ms(True, False), 1), "ms")
print("+ akumulasi gradien  :", round(total_ms(False, True), 1), "ms")
print("overlap + akumulasi  :", round(total_ms(True, True), 1), "ms")`,
        lockLines: 5,
        solution: `# SEED — jangan ubah (SIMULASI SKALA, stdlib saja — angka ilustratif, bukan benchmark hardware)
n_bucket = 8               # gradien dibagi 8 bucket komunikasi
t_compute_bucket = 6.0     # ms komputasi backward per bucket
t_comm_bucket = 10.0       # ms all-reduce per bucket (interkonek lambat)
n_accum = 4                # micro-batch diakumulasi tanpa sinkronisasi (no_sync)

# TULIS KODEMU
def total_ms(overlap, accum):
    compute = n_bucket * t_compute_bucket * (n_accum if accum else 1)
    comm = n_bucket * t_comm_bucket          # akumulasi: komunikasi tetap 1x
    if not overlap:
        return compute + comm
    if comm <= compute:
        return compute + t_compute_bucket   # komunikasi tenggelam seluruhnya
    return t_compute_bucket + comm           # comm-bound: pipeline bucket

# UJI (jangan ubah)
print("tanpa overlap        :", round(total_ms(False, False), 1), "ms")
print("overlap comm/compute :", round(total_ms(True, False), 1), "ms")
print("+ akumulasi gradien  :", round(total_ms(False, True), 1), "ms")
print("overlap + akumulasi  :", round(total_ms(True, True), 1), "ms")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "tanpa overlap\\s*:\\s*128\\.0 ms", label: "Baseline 128 ms", msg: "Penjumlahan compute+comm benar." },
          { kind: "stdout_matches", task: "t1", pattern: "overlap comm/compute\\s*:\\s*86\\.0 ms", label: "Overlap 86 ms", msg: "Pipeline bucket comm-bound benar." },
          { kind: "stdout_matches", task: "t2", pattern: "overlap \\+ akumulasi\\s*:\\s*198\\.0 ms", label: "Kombinasi 198 ms", msg: "Amortisasi komunikasi benar." },
        ],
      },
      reference: "Overlap = gratis bila comm tersembunyi; akumulasi = amortisasi all-reduce.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: strategi distribusi untuk tiap ukuran",
      prose: [
        "Skenario 1 — model muat di 1 GPU (< 60% memori) → DDP polos. Komunikasi minimal, setup termudah, seringkali tercepat. Jangan FSDP-kan yang tidak perlu.",
        "Skenario 2 — parameter muat, optimizer state tidak (fine-tune 13B di GPU kecil) → ZeRO-1/SHARD_GRAD_OP. Potong 12 byte/param yang paling boros, parameter tetap utuh saat komputasi.",
        "Skenario 3 — 30B+ atau mau batch besar → FSDP FULL_SHARD + bf16 mixed precision. Satu-satunya jalan agar 'tambah GPU' = 'tambah memori'. Aktifkan backward_prefetch.",
        "Skenario 4 — GPU sedikit, RAM CPU berlimpah (riset budget) → FULL_SHARD + CPU offload. Optimizer step pindah ke CPU: 2-3x lebih lambat, tetapi training yang mustahil menjadi mungkin.",
        "Skenario 5 — model SEDANG di multi-node dengan interkonek lambat → HYBRID_SHARD. Shard di dalam node (NVLink cepat), replika antar-node — komunikasi mahal dihindari.",
        "Aturan praktis 10 detik: (1) hitung 16 byte/param DULU (lab 1); (2) muat di DDP? pakai DDP; (3) tidak muat? FULL_SHARD + bf16; (4) masih OOM? + CPU offload; (5) comm-bound? overlap + akumulasi.",
      ],
      tasks: [],
    },
    {
      id: "minicase-70b",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: fine-tune 70B di 32xH100",
      prose: [
        "Startup 'NusaAI' menyewa 32xH100 (Rp2,4 miliar/bulan) untuk fine-tune 70B. Hitungan lab: DDP butuh 1.120 GB/GPU (mustahil), ZeRO-1 306 GB (mustahil), ZeRO-2 171 GB (mustahil), ZeRO-3 35 GB/GPU (MUAT di 80 GB — sisa 45 GB untuk aktivasi dan overhead). Keputusan: FSDP FULL_SHARD + bf16 + activation checkpointing (tukar komputasi 30% untuk memori aktivasi).",
        "Komunikasi per step: gradien fp16 = 140 GB total; ring all-reduce per GPU = 2×31/32×140 ≈ 271 GB per step. Dengan NVLink 900 GB/s intra-node dan 8 node, komunikasi antar-node menjadi bottleneck — solusinya HYBRID_SHARD? Tidak: model 70B terlalu besar untuk replika antar-node (140 GB > 80 GB). Jadi tetap FULL_SHARD global + gradient accumulation 4x untuk mengamortisasi komunikasi (lab 2: 49,5ms vs 128ms per micro-batch).",
        "Pembahasan: tanpa aritmetika ini, tim akan menyewa 32 GPU lalu OOM di step pertama seperti cerita pembuka — Rp2,4 miliar/bulan untuk GPU yang menganggur. Dengan aritmetika: satu kalkulator 20 baris (lab 1) menentukan seluruh desain training SEBELUM satu rupiah dibelanjakan. Inilah bedanya engineer dan penjudi infrastruktur.",
        "Cara membaca: 35 GB < 80 GB = hijau, tetapi 45 GB sisa bukan 'lega' — aktivasi 70B dengan sequence 4k bisa makan 30+ GB. Interpretasi: selalu sisakan margin 30% untuk aktivasi + fragmentasi; 'MUAT' di kalkulator ≠ 'MUAT' di dunia nyata tanpa activation checkpointing.",
        "Angka kunci yang dibawa pulang: pajak training 16 byte/param; ZeRO-3 membagi pajak dengan n; overlap menghemat 33% waktu step secara gratis; akumulasi mengamortisasi komunikasi.",
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
        "DDP = replika penuh: tambah GPU mempercepat, tidak menambah memori model.",
        "Pajak training Adam mixed precision = 16 byte/param (2+2+12); 70B = 1,12 TB per GPU di DDP.",
        "ZeRO-1/2/3 men-shard optimizer, gradien, lalu parameter; FSDP FULL_SHARD = ZeRO-3.",
        "HYBRID_SHARD untuk model sedang di interkonek lambat; CPU offload menukar kecepatan dengan kapasitas.",
        "Overlap comm/compute gratis secara matematis; akumulasi gradien mengamortisasi all-reduce.",
        "Hitung memori DULU (16×P/n), sewa GPU KEMUDIAN.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "GPU 8 → 16 dengan DDP untuk model 70B. Memori per GPU?",
          options: [
            { text: "Tetap 1.120 GB — DDP mereplika penuh, OOM tetap", why: "Tepat: DDP tidak membagi memori model.", correct: true },
            { text: "Turun jadi 560 GB", why: "Itu logika sharding — DDP tidak men-shard apa pun.", correct: false },
            { text: "Turun jadi 140 GB", why: "140 GB butuh ZeRO-3/FULL_SHARD di 8 GPU, bukan DDP.", correct: false },
            { text: "Naik dua kali lipat", why: "Memori per GPU tetap — yang naik throughput, bukan beban.", correct: false },
          ],
        },
        {
          q: "ZeRO-3 (FSDP FULL_SHARD) men-shard apa?",
          options: [
            { text: "Parameter + gradien + optimizer state — semuanya", why: "Tepat: 16 byte/param dibagi n.", correct: true },
            { text: "Hanya optimizer state", why: "Itu ZeRO-1 — parameter dan gradien tetap penuh.", correct: false },
            { text: "Hanya data training", why: "Data selalu dibagi di semua strategi data-parallel; ZeRO soal memori MODEL.", correct: false },
            { text: "Hanya gradien", why: "ZeRO-2 men-shard gradien + optimizer, bukan parameter.", correct: false },
          ],
        },
        {
          q: "Kapan HYBRID_SHARD lebih tepat dari FULL_SHARD?",
          options: [
            { text: "Model sedang + interkonek antar-node lambat", why: "Tepat: shard intra-node (NVLink), replika antar-node.", correct: true },
            { text: "Model 70B di 32 GPU", why: "70B tidak muat direplika antar-node (140 GB > 80 GB).", correct: false },
            { text: "Selalu — hybrid pasti lebih cepat", why: "Replikasi antar-node boros memori; hanya menang bila komunikasi mahal.", correct: false },
            { text: "Saat hanya ada 1 GPU", why: "1 GPU tidak butuh strategi distribusi apa pun.", correct: false },
          ],
        },
        {
          q: "Trade-off CPU offload (offload_params=True)?",
          options: [
            { text: "Muat model lebih besar; optimizer jalan di CPU = lebih lambat", why: "Tepat: PCIe lambat, tetapi kapasitas RAM CPU besar.", correct: true },
            { text: "Lebih cepat karena CPU membantu GPU", why: "Terbalik — CPU jauh lebih lambat untuk optimizer step.", correct: false },
            { text: "Tidak ada trade-off", why: "Ada: latensi PCIe di setiap pinjam-kembali parameter.", correct: false },
            { text: "Hanya untuk inference", why: "Ini fitur training — optimizer state yang di-offload.", correct: false },
          ],
        },
        {
          q: "Mengapa mixed precision (bf16) membantu FSDP?",
          options: [
            { text: "Parameter/gradien separuh byte + komunikasi all-gather/reduce separuh", why: "Tepat: memori dan bandwidth terpangkas ~2x; master tetap fp32.", correct: true },
            { text: "Menghilangkan kebutuhan sharding", why: "Hanya memangkas 2x — 70B tetap butuh sharding.", correct: false },
            { text: "Membuat training 2x lebih akurat", why: "Presisi lebih RENDAH — akurasi dijaga via master fp32, bukan ditingkatkan.", correct: false },
            { text: "Hanya menghemat disk checkpoint", why: "Penghematan utama di memori GPU dan komunikasi, bukan disk.", correct: false },
          ],
        },
      ],
    },
  ],
};
