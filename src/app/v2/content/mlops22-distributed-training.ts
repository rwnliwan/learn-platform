import type { V2Lesson } from "../lib/types";

// Waktu epoch vs jumlah GPU: T(n) = 120/n + 6(n-1); minimum di n=4, memburuk setelahnya.
const SCALING_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Waktu epoch vs jumlah GPU: tercepat di 4 GPU.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<line x1="50" y1="220" x2="530" y2="220" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="50" y1="220" x2="50" y2="30" stroke="var(--chart-text)" stroke-width="1.5"/>
<polyline points="90,60 170,105 250,130 330,118 410,72" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="90" cy="60" r="5" fill="var(--c1)"/>
<circle cx="170" cy="105" r="5" fill="var(--c1)"/>
<circle cx="250" cy="130" r="5" fill="var(--c3)"/>
<circle cx="330" cy="118" r="5" fill="var(--c1)"/>
<circle cx="410" cy="72" r="5" fill="var(--c1)"/>
<text x="90" y="238" fill="var(--text)">1</text>
<text x="170" y="238" fill="var(--text)">2</text>
<text x="250" y="238" fill="var(--text)">4</text>
<text x="330" y="238" fill="var(--text)">8</text>
<text x="410" y="238" fill="var(--text)">16</text>
<text x="90" y="48" fill="var(--chart-text)" font-size="10">120 mnt</text>
<text x="170" y="93" fill="var(--chart-text)" font-size="10">66 mnt</text>
<text x="250" y="148" fill="var(--c3)" font-size="10">48 mnt ★</text>
<text x="330" y="106" fill="var(--chart-text)" font-size="10">57 mnt</text>
<text x="410" y="60" fill="var(--chart-text)" font-size="10">97,5 mnt</text>
<text x="500" y="238" fill="var(--chart-text)" font-size="10">GPU</text>
<text x="28" y="120" fill="var(--chart-text)" font-size="10" transform="rotate(-90 28 120)">waktu epoch</text>
</g>
<text x="280" y="22" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">dari 4 ke 8 GPU: komputasi menyusut, pajak komunikasi membengkak</text>
</svg>`;

export const mlops22: V2Lesson = {
  slug: "mlops22-distributed-training",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps22 — Distributed Training: DDP, FSDP & Ray Train",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "8 GPU yang lebih lambat dari 4",
      prose: [
        "Mei 2026. Tim ML WarungPintar melatih model rekomendasi di 4 GPU: 42 menit per epoch, 12 epoch = 8,4 jam. 'Kalau 4 GPU butuh 8 jam, 8 GPU butuh 4 jam,' kata manajernya — aritmetika yang terdengar tak terbantahkan. Budget disetujui, 8 GPU dinyalakan. Hasilnya: 47 menit per epoch. LEBIH LAMBAT. Tagihan 2x, waktu 1,12x lebih lama.",
        "Investigasi menemukan dua pembunuh. Pertama, PAJAK KOMUNIKASI: tiap training step, 8 GPU harus saling bertukar gradien (all-reduce) — untuk model yang tidak terlalu besar, waktu kirim-kirim ini melampaui waktu hitung yang dihemat. Kedua, KELAPARAN DATA: data loader hanya mampu menyuapi 4 GPU; 8 GPU berarti separuh waktu mereka menunggu antrean data — seperti 8 koki berebut 4 kompor.",
        "Twist-nya: solusinya BUKAN 'kembali ke 4 GPU' saja, melainkan memahami KAPAN menambah GPU membantu dan kapan tidak. Model raksasa yang tidak muat di 1 GPU = wajib terdistribusi (FSDP). Model sedang dengan data melimpah = DDP di 2–4 GPU optimal. Model kecil = 1 GPU + data loader yang benar lebih cepat dari 8 GPU yang kelaparan. Lesson ini tentang tiga pola paralelisme dan aritmetika kejujurannya.",
      ],
      tasks: [],
      reference: "GPU ke-n membantu hanya bila: komputasi yang dihemat > komunikasi yang ditambah + data yang tersedia.",
    },
    {
      id: "ddp",
      eyebrow: "Langkah 2 · Konsep",
      title: "DDP: Si Paduan Suara",
      prose: [
        "Data Parallelism (DDP = Distributed Data Parallel, PyTorch) adalah pola paling umum: tiap GPU memegang SALINAN PENUH model, tetapi mengerjakan BATCH DATA yang berbeda. Seperti paduan suara: semua menyanyikan lagu yang sama (model sama), tiap seksi menyanyikan bait berbeda (data berbeda) — lalu mereka menyelaraskan nada (gradien) sebelum bait berikutnya.",
        "Mekanismenya per step: (1) tiap GPU forward+backward di shard datanya → gradien lokal; (2) ALL-REDUCE: semua GPU bertukar dan merata-ratakan gradien — setiap GPU mengirim dan menerima ~2× ukuran model; (3) tiap GPU update bobotnya dengan gradien rata-rata yang SAMA → model tetap sinkron. Sederhana, robust, dan menjadi default yang waras untuk 90% kasus.",
        "Syaratnya: model harus MUAT di satu GPU (beserta gradien + optimizer states — ingat pelajaran memori dari fine-tuning: Adam butuh ~4x memori bobot). Bila tidak muat, DDP bukan jawabannya — FSDP-lah.",
        "💡 Intuisi: DDP = fotokopi resep ke 8 koki, tiap koki masak porsi berbeda, lalu mereka menyepakati 'rata-rata bumbunya'. Bila resepnya (model) tidak muat di satu dapur (GPU), fotokopi tidak membantu — butuh dapur yang lebih besar atau resep yang dibagi (FSDP).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: DDP = tinggal bungkus model, langsung N kali lebih cepat",
        type: "pitfall",
        body: "DDP memperkenalkan dua overhead: komunikasi all-reduce tiap step DAN kebutuhan batch global N kali lebih besar (bila batch per GPU tetap). Batch global yang membengkak bisa MERUSAK konvergensi (learning rate harus disesuaikan — aturan linear scaling) atau menghantam batas memori. 'Bungkus dan gas' tanpa menyesuaikan batch/LR = training lebih cepat menuju model yang lebih buruk.",
      },
      reference: "DDP: salinan model penuh × shard data, sinkron via all-reduce. Syarat: model muat di 1 GPU.",
    },
    {
      id: "fsdp",
      eyebrow: "Langkah 3 · Konsep",
      title: "FSDP: Si Koperasi",
      prose: [
        "Fully Sharded Data Parallel (FSDP) menjawab pertanyaan: 'bagaimana bila modelnya TIDAK muat di satu GPU?' Jawabannya: jangan fotokopi resepnya — BAGI-BAGI. Tiap GPU hanya menyimpan 1/N dari parameter, gradien, dan optimizer states (koperasi: tiap anggota menyimpan sebagian arsip). Saat komputasi butuh layer tertentu, GPU 'meminjam' shard dari GPU lain (all-gather), menghitung, lalu membuangnya lagi.",
        "Harganya: KOMUNIKASI LEBIH BANYAK dari DDP (all-gather per layer + reduce-scatter, bukan sekali all-reduce per step). FSDP menang telak saat model 70B yang mustahil di 1 GPU; FSDP KALAH (lebih lambat dari DDP) untuk model 7B yang muat santai — pajak komunikasinya tidak terbayar oleh penghematan memori yang tidak dibutuhkan.",
        "Aturan pemilihannya sederhana: (1) Model + gradien + optimizer muat di 1 GPU → DDP. (2) Tidak muat → FSDP (atau tensor/pipeline parallel untuk kasus ekstrem). (3) Tidak yakin → ukur memori dulu (M = P × b + gradien + optimizer, dari lesson fine-tuning), jangan tebak. Kebanyakan tim yang 'butuh FSDP' sebenarnya butuh DDP + gradient checkpointing.",
        "💡 Intuisi: DDP = tiap koki punya resep lengkap. FSDP = resep disobek menjadi N bagian, tiap koki pegang satu sobekan dan mereka saling pinjam saat memasak. Sobek-menyobek ada biayanya (waktu pinjam-meminjam) — worth it hanya bila resepnya memang tidak muat di satu dapur.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: FSDP selalu lebih baik dari DDP karena 'lebih modern'",
        type: "pitfall",
        body: "'Lebih canggih' ≠ 'lebih cepat'. FSDP menambah komunikasi all-gather per layer; untuk model yang muat di 1 GPU, ini murni overhead tanpa manfaat memori. Benchmark di workload-MU: untuk LLM 7B di 8×A100, DDP sering menang 10–20% atas FSDP. Pilih dari kendala (muat/tidak muat), bukan dari kemodernan.",
      },
      reference: "FSDP = sharding parameter/gradien/optimizer. Menang saat memory-bound; kalah saat tidak.",
    },
    {
      id: "pajak-komunikasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Pajak komunikasi: Si Tukang Pungut",
      prose: [
        "Setiap GPU tambahan memungut pajak: waktu komunikasi. Model sederhananya: T(n) = T₁/n + k(n−1) — waktu komputasi menyusut (dibagi n), tetapi pajak komunikasi tumbuh (n−1 koneksi yang harus sinkron). Di n kecil, suku pertama menang (makin cepat); di n besar, suku kedua menang (makin lambat). Ada TITIK BALIK — dan di cerita tadi, titiknya di n = 4.",
        "Efisiensi scaling mengukurnya: E(n) = T₁ / (n × T(n)) — 'berapa persen dari janji linear yang terpenuhi'. E = 1,0 = sempurna (tidak pernah terjadi); E = 0,26 di n = 8 artinya kamu membayar 8 GPU untuk kecepatan 2 GPU. Uang yang terbakar di sini tidak terlihat di dashboard — hanya di tagihan.",
        "Tiga tuas menggeser titik balik ke kanan (membuat n besar tetap worth it): (1) MODEL LEBIH BESAR — komputasi per step naik, pajak relatif menyusut; (2) JARINGAN LEBIH CEPAT — NVLink/InfiniBand memangkas k (ini kenapa topologi cluster penting); (3) KOMUNIKASI TERTIMPA — overlap all-reduce dengan backward pass (DDP melakukannya otomatis sebagian).",
        "Cara membaca rumus: T₁/n = 'janji' (semakin banyak GPU, semakin cepat hitung); k(n−1) = 'pajak' (semakin banyak GPU, semakin lama sinkron). Optimal di mana turunannya nol — atau, lebih praktis: ukur di 1, 2, 4, 8 dan berhenti saat waktu naik.",
        "Interpretasi: di lab, n = 4 adalah sweet spot (48 menit, E = 0,62). n = 8 lebih lambat (57 menit) dengan E = 0,26 — membayar 8 GPU untuk kecepatan setara 2,1 GPU. Inilah aritmetika yang seharusnya ditunjukkan SEBELUM budget 8 GPU disetujui.",
      ],
      formula: String.raw`T(n) = \frac{T_1}{n} + k(n-1) \quad ; \quad E(n) = \frac{T_1}{n \cdot T(n)}`,
      formulaNote: "T(n) = waktu per epoch dengan n GPU (menit); T₁ = waktu 1 GPU (120 menit di lab); k = pajak komunikasi per GPU tambahan (6 menit di lab); E(n) = efisiensi scaling (1,0 = linear sempurna). Contoh: n = 4 → T = 30 + 18 = 48 menit, E = 120/(4×48) = 0,62. n = 8 → T = 15 + 42 = 57 menit — LEBIH LAMBAT dari n = 4.",
      figure: {
        svg: SCALING_SVG,
        alt: "Kurva waktu epoch vs jumlah GPU: turun sampai 4 GPU (48 menit), lalu NAIK di 8 dan 16 GPU karena pajak komunikasi",
        caption: "Cara membaca: sumbu x = jumlah GPU (1, 2, 4, 8, 16), sumbu y = waktu per epoch (menit). Kurva turun selama suku komputasi T₁/n menang, mencapai titik terendah di n = 4, lalu berbalik naik saat pajak komunikasi k(n−1) mengambil alih. Interpretasi: titik terendah kurva adalah n* — batas rasional penambahan GPU; setiap titik di sebelah kanannya lebih lambat DAN lebih mahal.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: bottleneck training selalu komputasi (butuh GPU lebih banyak)",
        type: "pitfall",
        body: "Tiga bottleneck berebut: KOMPUTASI (GPU), KOMUNIKASI (jaringan antar-GPU), dan DATA (loader). Menambah GPU hanya membantu yang pertama — dan memperparah yang kedua. Sebelum sewa GPU, profil dulu: bila GPU utilization 40% (kelaparan data), yang dibutuhkan adalah data loader yang benar (num_workers, prefetch, format biner), bukan GPU ke-9. Ukur, jangan tebak.",
      },
      reference: "T(n) = T₁/n + k(n−1). Cari titik balik dengan mengukur 1-2-4-8. E < 0,5 = bakar uang.",
    },
    {
      id: "ray-train",
      eyebrow: "Langkah 5 · Konsep",
      title: "Ray Train & checkpointing: Si Maraton",
      prose: [
        "Ray Train adalah orkestrator di atas DDP/FSDP: ia mengurus scale-up cluster, fault tolerance (worker mati → diganti otomatis), dan integrasi hyperparameter tuning (Ray Tune). Pilih Ray Train bila training-mu adalah MARATON: berhari-hari, di spot/preemptible instance yang bisa mati kapan saja, dengan puluhan eksperimen paralel.",
        "Untuk maraton, ada satu disiplin yang lebih penting dari kecepatan: CHECKPOINTING. Simpan state lengkap (bobot + optimizer + scheduler + RNG + nomor step) tiap N step ke storage tahan lama. Aturannya: interval checkpoint = (biaya restart tanpa checkpoint) vs (biaya menulis checkpoint). Untuk job 3 hari di spot instance: checkpoint tiap 30 menit adalah asuransi murah; untuk job 2 jam di on-demand: tiap 30 menit adalah overhead konyol.",
        "Dua jebakan checkpointing: (1) hanya menyimpan bobot (tanpa optimizer state) — resume 'bisa' tetapi konvergensi restart dari nol secara diam-diam; (2) checkpoint ke disk lokal worker — worker mati = checkpoint ikut mati. Selalu ke object storage (S3/GCS) dengan penulisan atomik.",
        "💡 Intuisi: distributed training tanpa checkpointing = maraton tanpa pos minum. Bukan soal KAPAN kamu haus (worker mati), melainkan bahwa cepat atau lambat PASTI haus — dan satu-satunya pertanyaan adalah seberapa jauh kamu harus berlari mundur.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'nanti saja checkpoint-nya, yang penting jalan dulu'",
        type: "pitfall",
        body: "Job 3 hari yang mati di hari ke-2,9 tanpa checkpoint = 2,9 hari × 8 GPU hangus — bisa ratusan dolar sekali kejadian. Checkpointing BUKAN optimasi; ia adalah bagian definisi 'training yang benar' untuk job panjang. Tulis SEBELUM training pertama yang panjang, bukan sesudah insiden pertama.",
      },
      reference: "Maraton (berhari-hari, spot) = Ray Train + checkpoint lengkap tiap interval waras ke object storage.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: temukan titik balik GPU",
      prose: [
        "Waktunya menjadi manajer yang menolak aritmetika '8 GPU = 2x lebih cepat'. Lab ini mensimulasikan waktu epoch mengikuti T(n) = T₁/n + k(n−1) dengan T₁ = 120 menit dan k = 6 menit — angka yang meniru cerita WarungPintar.",
        "Tugasmu: implementasikan `waktu_epoch(n)` dan `efisiensi(n)`, cetak tabel untuk n = 1, 2, 4, 8, 16, lalu tentukan `n_optimal` (n dengan waktu terkecil). Perhatikan: n = 8 (57 menit) LEBIH LAMBAT dari n = 4 (48 menit) — dan n = 16 (97,5 menit) hampir 2x lebih lambat dari n = 4 dengan tagihan 4x lipat.",
        "Cara membaca output: tiap baris = waktu + efisiensi; baris terakhir = vonis. Efisiensi 0,26 di n = 8 berarti dari 8 GPU yang dibayar, hanya ~2,1 yang 'bekerja'.",
        "Interpretasi: lab ini BUKAN dalil '4 GPU selalu optimal' — T₁ dan k berbeda untuk setiap model dan cluster. Dalilnya: UKUR di 1-2-4-8 SEBELUM menyewa 16, karena kurvanya SELALU punya titik balik — pertanyaannya hanya di mana.",
      ],
      formula: String.raw`n^* = \arg\min_n T(n)`,
      formulaNote: "n* = jumlah GPU optimal (waktu epoch terkecil); T(n) = model waktu di atas. Contoh lab: T = [120, 66, 48, 57, 97,5] untuk n = [1, 2, 4, 8, 16] → n* = 4. Interpretasi: di kanan n*, tiap GPU tambahan MEMPERLAMBAT sekaligus MENAMBAH tagihan — zona bakar uang.",
      tasks: [
        { id: "t1", text: "Lengkapi `waktu_epoch(n)` = T₁/n + k(n−1) dan `efisiensi(n)` = T₁/(n·T(n))" },
        { id: "t2", text: "Cetak tabel waktu + efisiensi untuk tiap n di GPU_LIST (2 desimal)" },
        { id: "t3", text: "Tentukan `n_optimal` — n dengan waktu_epoch terkecil" },
      ],
      expected: "n=1: 120.0 mnt (efisiensi 1.00)\nn=2: 66.0 mnt (efisiensi 0.91)\nn=4: 48.0 mnt (efisiensi 0.62)\nn=8: 57.0 mnt (efisiensi 0.26)\nn=16: 97.5 mnt (efisiensi 0.08)\noptimal: 4 GPU",
      note: {
        title: "Sering salah",
        body: "Menghitung efisiensi sebagai T(n)/T₁ (terbalik) sehingga n = 16 terlihat 'paling efisien'. Efisiensi = janji linear DIBAGI realita: T₁/(n·T(n)) — makin KECIL makin buruk. Bila angkamu > 1,0, rumusnya terbalik.",
      },
      hints: [
        "waktu_epoch: return T1 / n + K * (n - 1).",
        "efisiensi: return T1 / (n * waktu_epoch(n)).",
        "n_optimal: min(GPU_LIST, key=waktu_epoch).",
        "Cetak: f\"n={n}: {waktu_epoch(n):.1f} mnt (efisiensi {efisiensi(n):.2f})\".",
      ],
      code: {
        starter: `# Model eksperimen WarungPintar: T1 = 120 mnt, pajak komunikasi k = 6 mnt/GPU\n` +
`T1 = 120.0\n` +
`K = 6.0\n` +
`GPU_LIST = [1, 2, 4, 8, 16]\n` +
`\n` +
`# TUGAS 1: model waktu & efisiensi scaling\n` +
`def waktu_epoch(n):\n` +
`    return\n` +
`\n` +
`def efisiensi(n):\n` +
`    return\n` +
`\n` +
`# TUGAS 2 & 3: tabel + titik optimal\n` +
`t4 = waktu_epoch(4)\n` +
`for n in GPU_LIST:\n` +
`    print(f"n={n}: {waktu_epoch(n):.1f} mnt (efisiensi {efisiensi(n):.2f})")\n` +
`n_optimal = None\n` +
`print(f"optimal: {n_optimal} GPU")\n`,
        lockLines: 4,
        solution: `# Model eksperimen WarungPintar: T1 = 120 mnt, pajak komunikasi k = 6 mnt/GPU\n` +
`T1 = 120.0\n` +
`K = 6.0\n` +
`GPU_LIST = [1, 2, 4, 8, 16]\n` +
`\n` +
`# TUGAS 1: model waktu & efisiensi scaling\n` +
`def waktu_epoch(n):\n` +
`    return T1 / n + K * (n - 1)\n` +
`\n` +
`def efisiensi(n):\n` +
`    return T1 / (n * waktu_epoch(n))\n` +
`\n` +
`# TUGAS 2 & 3: tabel + titik optimal\n` +
`t4 = waktu_epoch(4)\n` +
`for n in GPU_LIST:\n` +
`    print(f"n={n}: {waktu_epoch(n):.1f} mnt (efisiensi {efisiensi(n):.2f})")\n` +
`n_optimal = min(GPU_LIST, key=waktu_epoch)\n` +
`print(f"optimal: {n_optimal} GPU")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "waktu_epoch", label: "fungsi `waktu_epoch` terdefinisi", msg: "Definisikan waktu_epoch(n) = T1/n + K*(n-1)." },
          { kind: "equal", task: "t1", name: "t4", value: 48.0, tol: 0.01, label: "`waktu_epoch(4)` = 48.0", msg: "120/4 + 6*3 = 30 + 18 = 48 — titik tercepat." },
          { kind: "defined", task: "t1", name: "efisiensi", label: "fungsi `efisiensi` terdefinisi", msg: "Definisikan efisiensi(n) = T1/(n*waktu_epoch(n))." },
          { kind: "equal", task: "t3", name: "n_optimal", value: 4, label: "`n_optimal` = 4", msg: "Waktu terkecil ada di n = 4 (48 menit)." },
          { kind: "stdout_matches", task: "t2", pattern: "n=8: 57\\.0 mnt", label: "`print` baris n=8", msg: "Baris n=8 harus mencetak 57.0 mnt — lebih lambat dari n=4." },
          { kind: "stdout_matches", task: "t3", pattern: "optimal: 4 GPU", label: "`print` vonis optimal", msg: "Baris terakhir harus memvonis 4 GPU." },
        ],
      },
      reference: "Ukur 1-2-4-8 sebelum sewa 16. Di kanan titik balik: tambah GPU = tambah lambat + tambah tagihan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: strategi paralelisme",
      prose: [
        "Skenario 1 — Model + gradien + optimizer muat di 1 GPU, data melimpah. → DDP di 2–4 GPU, ukur titik balik. Alasan: pola paling sederhana dan robust; pajak all-reduce terbayar.",
        "Skenario 2 — Model tidak muat di 1 GPU (LLM 70B). → FSDP (+ tensor parallel bila perlu). Alasan: tidak ada pilihan — DDP mustahil secara fisik.",
        "Skenario 3 — GPU utilization 40%, data loader jadi antrean. → Perbaiki loader dulu (workers, prefetch, format), BUKAN tambah GPU. Alasan: menambah GPU pada GPU yang kelaparan = menambah piring pada koki yang menganggur.",
        "Skenario 4 — Training 3 hari di spot instance, 20 eksperimen paralel. → Ray Train + checkpoint tiap 30 menit ke object storage. Alasan: maraton butuh orkestrasi + asuransi, bukan kecepatan mentah.",
        "Skenario 5 — E(n) < 0,5 di n saat ini. → Turunkan n atau besarkan model/batch (bila konvergensi mengizinkan). Alasan: di bawah 0,5 kamu membayar 2 GPU untuk kerja 1 GPU.",
        "Aturan praktis 10 detik: muat = DDP; tidak muat = FSDP; lapar data = perbaiki loader; maraton = Ray + checkpoint; E < 0,5 = bakar uang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih strategi dari blog post, bukan dari kendala. 'Perusahaan X pakai FSDP' tidak relevan bila modelmu 1/10 ukurannya. Urutan keputusan: ukur memori → profil bottleneck → pilih pola → ukur titik balik. Empat langkah, tidak bisa disingkat.",
      },
      reference: "Keputusan = f(kendala memori, bottleneck, durasi). Bukan f(tren).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: tagihan $14.400 yang seharusnya $3.600",
      prose: [
        "NusaAI melatih model vision 12 hari di 16 GPU ($50/GPU/hari). Tagihan: 12 × 24 × 16 × $50 / 24... hitung yang benar: 16 GPU × $2,08/jam × 288 jam = $9.600. Seharusnya, di n = 4 dengan waktu 1,5x lebih lama: 4 × $2,08 × 432 jam = $3.600. Selisih $6.000 hangus karena E(16) ≈ 0,08 — dan itu SEBELUM menghitung 2 restart tanpa checkpoint (1,5 hari × 16 GPU = $1.200 tambahan).",
        "Audit menemukan: model (3B param) muat santai di 1 GPU — FSDP/DDP 16 GPU murni overkill; data loader single-worker membuat GPU menunggu 55% waktu; tidak ada checkpointing ('nanti saja'). Tiga keputusan, tiga pemborosan yang saling menguatkan.",
        "Pertanyaan analisis: (1) Konfigurasi apa yang seharusnya dipakai sejak hari pertama? (2) Berapa estimasi penghematan total dengan konfigurasi benar + checkpointing? (3) Metrik apa yang harus dipantau live selama training agar ini tertangkap di hari pertama?",
        "Pembahasan: (1) DDP 4 GPU (titik balik untuk model seukuran ini) + data loader multi-worker + prefetch; checkpoint tiap 1 jam ke S3. (2) $9.600 → $3.600 (konfigurasi) + $1.200 (restart) = hemat ~$7.200, 75%. (3) GPU utilization + throughput sampel/detik + waktu all-reduce per step — ketiganya turun/naik di jam pertama sudah berteriak; tidak ada yang mendengar karena tidak ada yang merekam.",
      ],
      tasks: [],
      reference: "Tiga metrik live (utilisasi, throughput, waktu komunikasi) menangkap 90% pemborosan di jam pertama.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam soal. Semua jawaban ada di lesson ini — yang diuji adalah pemahaman, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "DDP: salinan model penuh × shard data, sinkron all-reduce; syarat model muat di 1 GPU.",
        "FSDP: sharding parameter/gradien/optimizer; menang saat memory-bound, kalah saat tidak.",
        "Pajak komunikasi: T(n) = T₁/n + k(n−1); ada titik balik; E(n) = T₁/(n·T(n)).",
        "Bottleneck bisa komputasi, komunikasi, ATAU data — tambah GPU hanya membantu yang pertama.",
        "Maraton (berhari-hari, spot): Ray Train + checkpoint lengkap berkala ke object storage.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "8 GPU lebih lambat dari 4 GPU (47 vs 42 menit/epoch). Penjelasan yang benar?",
          options: [
            { text: "GPU-nya rusak", why: "Semua 8 GPU 'rusak' dengan pola yang sama = bukan hardware, melainkan aritmetika.", },
            { text: "Pajak komunikasi all-reduce + kelaparan data melampaui penghematan komputasi", why: "Tepat: T(n) = T₁/n + k(n−1) — di kanan titik balik, suku pajak menang.", correct: true },
            { text: "Modelnya terlalu kecil untuk GPU", why: "Model kecil bukan masalahnya — masalahnya menambah GPU melewati titik balik.", },
            { text: "Learning rate salah", why: "LR memengaruhi konvergensi, bukan waktu per epoch.", },
          ],
        },
        {
          q: "Model 70B tidak muat di satu A100-80GB. Strategi yang tepat?",
          options: [
            { text: "DDP di 8 GPU", why: "DDP butuh salinan PENUH per GPU — mustahil secara fisik.", },
            { text: "FSDP (sharding parameter/gradien/optimizer), mungkin + tensor parallel", why: "Tepat: bagi-bagi resep karena tidak muat di satu dapur.", correct: true },
            { text: "1 GPU dengan batch kecil", why: "Batch kecil tidak mengubah fakta parameter tidak muat di memori.", },
            { text: "Kuantisasi saja tanpa distribusi", why: "INT8 70B = 70 GB — masih belum muat + butuh presisi training.", },
          ],
        },
        {
          q: "GPU utilization 40%, GPU sering idle menunggu data. Langkah pertama?",
          options: [
            { text: "Tambah GPU", why: "Menambah piring untuk koki yang menganggur — memperparah, bukan memperbaiki.", },
            { text: "Perbaiki data loader (workers, prefetch, format) — bottleneck-nya data, bukan komputasi", why: "Tepat: profil dulu; tambah GPU hanya membantu bottleneck komputasi.", correct: true },
            { text: "Ganti ke FSDP", why: "FSDP menjawab kendala memori, bukan kelaparan data.", },
            { text: "Naikkan learning rate", why: "LR tidak ada hubungannya dengan throughput data.", },
          ],
        },
        {
          q: "E(8) = 0,26. Artinya?",
          options: [
            { text: "Sangat efisien", why: "0,26 jauh dari 1,0 — ini buruk, bukan baik.", },
            { text: "Dari 8 GPU yang dibayar, hanya ~2,1 yang 'bekerja' — 74% tagihan terbuang", why: "Tepat: 8 × 0,26 = 2,08 GPU efektif. Di bawah 0,5 = bakar uang.", correct: true },
            { text: "Training 26% lebih cepat", why: "E bukan speedup — ia rasio terhadap janji linear.", },
            { text: "Butuh 26 GPU lagi", why: "Menambah GPU saat efisiensi 0,26 = memperdalam lubang.", },
          ],
        },
        {
          q: "Training 3 hari di spot instance. Praktik checkpointing yang benar?",
          options: [
            { text: "Simpan bobot saja tiap 6 jam ke disk lokal", why: "Tanpa optimizer state = konvergensi restart diam-diam; disk lokal mati bersama worker.", },
            { text: "State lengkap (bobot + optimizer + scheduler + RNG + step) berkala ke object storage", why: "Tepat: resume yang benar-benar melanjutkan, bukan mengulang.", correct: true },
            { text: "Tidak perlu — spot jarang mati", why: "'Jarang' × 3 hari × 8 GPU = kepastian statistik. Asuransi murah vs bencana mahal.", },
            { text: "Checkpoint hanya di akhir", why: "Mati di hari ke-2,9 = 2,9 hari hangus. Itu bukan strategi, itu judi.", },
          ],
        },
        {
          q: "Kapan Ray Train (bukan DDP mentah)?",
          options: [
            { text: "Selalu — lebih modern", why: "Kemodernan bukan kriteria; kendala yang menentukan.", },
            { text: "Training maraton (berhari-hari, spot/preemptible, banyak eksperimen paralel) yang butuh orkestrasi + fault tolerance", why: "Tepat: Ray = mandor untuk maraton, bukan untuk sprint 2 jam.", correct: true },
            { text: "Hanya untuk model kecil", why: "Ukuran model menentukan DDP vs FSDP; durasi/ketidakpastian menentukan Ray.", },
            { text: "Tidak pernah — terlalu kompleks", why: "Untuk 20 eksperimen paralel di spot, orkestrasi manual lebih kompleks.", },
          ],
        },
      ],
    },
  ],
};
