import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Serving: Latensi yang Membunuh Pengalaman ────────────────────────
// CAPSTONE Misi C (kombinasi MLOps × LLMOps). Dataset SINTETIS: 240 request
// log fiksi (seed 42) — BUKAN log produksi, TANPA data pengguna.
// File: public/misi/misi-gabung-serving-llm/request_logs.csv (240 baris).
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-gabung-serving-llm";

export const misiGabungServing: V2Mission = {
  slug: "misi-gabung-serving-llm",
  track: "MLOps",
  module: "Misi",
  title: "Misi Serving: Latensi yang Membunuh Pengalaman",
  estMinutes: 200,
  role: "MLOps engineer",
  client:
    "Head of Product — chatbot LLM p99 latency 8 detik, tagihan GPU 3× budget, keluhan kualitas",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Delapan detik yang menggerogoti produk",
      prose: [],
      tasks: [],
      briefing: {
        role: "MLOps engineer — pemilik serving LLM produksi, dari GPU sampai SLO",
        client:
          "Head of Product. Rabu pagi ia meneruskan tiga hal ke channel #ml-platform: screenshot dashboard — p99 latency chatbot 8 detik; invoice GPU bulan ini 3× budget; dan 12 tiket support per minggu yang isinya variasi dari 'jawabannya ngawur'. Pesannya singkat: 'Salah satu dari tiga ini harus selesai bulan ini. Ketiganya lebih baik.'",
        story: [
          "Dua varian serving sedang berjalan berdampingan. Varian A: model penuh FP16 dengan KV-cache — tua, mahal, tapi stabil. Varian B: model terkuantisasi INT8 yang di-deploy vendor tiga bulan lalu dengan janji 'lebih cepat dan lebih murah'. Sejak itu tagihan naik, bukan turun.",
          "Vendor Varian B mengirim laporan triwulan yang mengklaim semuanya sesuai best practice: TTFT di bawah SLO, KV-cache aktif di kedua varian, eval kualitas seri. Angkanya terlalu rapi — dan kamu sudah cukup lama di infra untuk tahu bahwa angka yang terlalu rapi biasanya bukan angka yang jujur.",
          "Misi ini: ukur ulang semuanya dari 240 baris log mentah, tentukan satu strategi perbaikan untuk 90 hari ke depan (caching, kuantisasi, atau routing), audit laporan vendor yang 'rapi' itu baris per baris, lalu tulis proposal SLO + tabel tradeoff biaya-latensi-kualitas untuk Head of Product.",
        ],
        objectives: [
          "Menghitung ulang p50/p99 TTFT dan TPOT per varian dari log mentah dan membandingkannya dengan SLO.",
          "Menghitung biaya per 1.000 request per varian dan mengukur hubungan cache hit dengan latensi prefill.",
          "Memilih satu strategi perbaikan (caching / kuantisasi / routing), menemukan 4 sabotase di laporan vendor, dan menulis proposal SLO + tabel tradeoff biaya-latensi-kualitas.",
        ],
        prereqSummary:
          "TTFT (time-to-first-token) = jeda dari request masuk sampai token pertama keluar — didominasi fase prefill, saat model membaca seluruh prompt sekaligus. TPOT (time-per-output-token) = kecepatan fase decode sesudahnya, token demi token. KV-cache menyimpan hasil komputasi prompt (key/value attention) supaya prefill untuk prefix yang sama tidak dihitung ulang — kalau ia mati diam-diam, prefill melambat drastis sementara TPOT tidak berubah.",
        datasetNote:
          "Data 100% SINTETIS: 240 request fiksi hasil generator acak (seed 42) — BUKAN log produksi, BUKAN data pengguna, TANPA teks prompt asli.\nFile: request_logs.csv — kolom request_id, variant (A/B), prompt_tokens, completion_tokens, cache_hit (0/1), prefill_ms, queue_ms, ttft_ms, tpot_ms, decode_ms, total_ms, quality_score (skor evaluasi sintetis 1–5).\nMetode & batas jujur: file METODE.md di folder yang sama. Harga GPU ($3,20/jam) dan ambang SLO di misi ini disederhanakan untuk latihan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua ratus empat puluh baris log mentah",
      prose: [
        "File `request_logs.csv` adalah satu-satunya sumber kebenaran di misi ini: 240 baris, 12 kolom, tanpa kolom 'kesimpulan' — karena kesimpulan adalah KERJAMU, bukan data. Setiap baris adalah satu request fiksi dengan breakdown latensi lengkap: `prefill_ms` (membaca prompt), `queue_ms` (menunggu giliran), `ttft_ms` (= prefill + queue), `tpot_ms` (ms per token saat decode), `decode_ms`, dan `total_ms`. Kolom `cache_hit` menandai apakah KV-cache kena (1) atau tidak (0).",
        "Dua varian: A = model penuh FP16 dengan KV-cache; B = model terkuantisasi INT8 yang diklaim 'lebih cepat dan lebih murah'. Kolom `quality_score` adalah skor evaluasi SINTETIS 1–5 — bukan penilaian manusia, dan bukan lisensi untuk mengklaim kualitas produksi.",
        "Aturan main: setiap angka di laporan vendor (Langkah 10) harus diverifikasi ulang dari file ini. Kalau angka dossier dan angka CSV berbeda, yang menang adalah CSV — selalu.",
      ],
      tasks: [
        { id: "t1", text: "Buka `request_logs.csv`: catat jumlah baris dan nama kolomnya" },
        { id: "t2", text: "Hitung cepat: berapa baris varian A vs varian B" },
      ],
      note: {
        title: "Miskonsepsi #1: p99 8 detik berarti chatbot selalu lambat",
        type: "pitfall",
        body: "Salah baca. p99 = 1% request terburuk; p50 (median) bisa 3 detik sementara p99 8 detik. Keduanya penting untuk alasan berbeda: p50 mengukur pengalaman umum, p99 mengukur pengalaman yang membuat orang kapok — dan 1% dari 1 juta request = 10.000 pengguna yang marah. SLO yang hanya memantau rata-rata tidak akan pernah melihat mereka.",
      },
      reference:
        "request_logs.csv (240 baris SINTETIS, seed 42) — satu-satunya sumber kebenaran; ttft_ms = prefill_ms + queue_ms; total_ms = ttft_ms + decode_ms.",
    },
    {
      id: "teori",
      eyebrow: "Langkah 3 · Teori — dua lensa",
      title: "Prefill vs decode, biaya vs kualitas",
      prose: [
        "Lensa pertama: infra/serving. Request LLM hidup dalam dua fase. Prefill: model membaca SELURUH prompt sekaligus — compute-bound, makin panjang prompt makin lama, dan di sinilah antrean menumpuk. Decode: model mengeluarkan token satu per satu — memory-bandwidth-bound, kecepatannya diukur TPOT. TTFT = prefill + antrean; ia menjawab 'kapan pengguna melihat sesuatu'. KV-cache memangkas prefill dengan memakai ulang komputasi prefix yang pernah dihitung — cache hit = prefill murah, cache miss = bayar penuh.",
        "Lensa kedua: kualitas LLM. Kuantisasi (FP16 → INT8 → INT4) mempercepat decode karena bobot lebih kecil — tapi presisi yang dibuang bisa merusak jawaban. Inilah segitiga yang tidak bisa ditawar: latensi, biaya, kualitas. Menekan satu sisi hampir selalu menggelembungkan sisi lain. Dan evaluasi kualitas hanya jujur bila prompt evaluasinya SEGAR — prompt yang juga dipakai training tidak mengukur kualitas, ia mengukur daya ingat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung manual: TTFT 2,83 dtk, TPOT 20,8 ms/token, completion 120 token → total?" },
      ],
      expected:
        "Total = 2,83 + (0,0208 × 120) = 2,83 + 2,50 = 5,33 dtk. Untuk jawaban panjang, TPOT yang menentukan; untuk prompt panjang, TTFT yang menentukan.",
      formula: String.raw`\text{total} = \text{TTFT} + \text{TPOT} \times n_{\text{out}}`,
      formulaNote:
        "total = latensi ujung-ke-ujung satu request (detik); TTFT = jeda sampai token pertama (detik); TPOT = waktu per token output (di CSV dalam ms — bagi 1000 dulu); n_out = jumlah token completion. Contoh konkret: TTFT 0,61 dtk + TPOT 36,17 ms × 85 token = 0,61 + 3,07 = 3,68 dtk. Angka ini artinya: separuh lebih waktu request dihabiskan SETELAH token pertama keluar.",
      note: {
        title: "Miskonsepsi #2: TPOT kecil = serving cepat",
        type: "pitfall",
        body: "Belum tentu. TPOT hanya mengatur kecepatan SETELAH token pertama keluar. Kalau prompt 1.000 token tanpa cache, prefill 6 detik — TPOT 20 ms/token tidak menyelamatkan apa pun. Optimasi yang salah sasaran = mengecilkan angka yang bukan bottleneck. Ukur dulu, tebak kemudian — urutannya tidak bisa dibalik.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta: gejala → tuas yang benar",
      prose: [
        "Sebelum menyentuh data, pegang petanya. Empat skenario, empat tuas — salah pasang tuas = bakar waktu dan uang:",
        "1) TTFT p99 jebol, TPOT normal → masalah di prefill/antrean. Tuas: cek KV-cache hit rate, queue depth, distribusi panjang prompt. BUKAN kuantisasi — decode bukan masalahnya.",
        "2) TPOT tinggi, TTFT normal → decode lambat. Tuas: kuantisasi, speculative decoding, batching. Cache tidak membantu — prefill sudah sehat.",
        "3) Biaya 3× budget, latensi masih OK → over-provisioning atau varian yang tidak efisien. Tuas: rightsizing, routing query ringan ke model kecil, matikan varian yang boros.",
        "4) Kualitas turun setelah optimasi → optimasi memakan kualitas. Tuas: ukur ulang di eval set BERSIH (prompt segar), bukan eval lama yang mungkin terkontaminasi.",
        "Mini-case — Jumat 19:42. Traffic naik 3× dalam 10 menit. p99 total menyentuh 21 detik. Autoscaler menambah 0 replika selama 6 menit. CPU tercatat 62% (target scale-up 70%), sementara queue depth 340 request. Di mana letak butanya? Simpan jawabanmu — ia kembali menghantuimu di Langkah 10.",
      ],
      tasks: [
        { id: "t1", text: "Untuk tiap skenario 1–4, tulis SATU aksi pertama + metrik yang kamu cek dulu" },
      ],
      note: {
        title: "Aturan praktis 10 detik",
        body: "TTFT jebol → lihat prefill & antrean. TPOT jebol → lihat decode. Dompet jebol → lihat varian & utilisasi. Kualitas jebol setelah optimasi → curigai eval-nya dulu, modelnya kemudian.",
      },
    },
    {
      id: "lab-1",
      eyebrow: "Langkah 5 · Lab 1 — Bedah latensi",
      title: "Hitung ulang p50/p99 TTFT dan TPOT",
      prose: [
        "Laporan vendor mengklaim TTFT p99 Varian A 0,045 dtk — jauh di bawah SLO 2 dtk. Kedengarannya terlalu bagus; di lab ini kamu hitung sendiri dari 240 baris mentah. Pisahkan per varian, pakai quantile (p50 = quantile(0.50), p99 = quantile(0.99)), dan ubah TTFT ke detik (bagi 1000) supaya sebanding dengan SLO.",
        "Catat TPOT dalam ms/token — satuannya memang kecil. Justru itu yang membuat laporan penukar TTFT↔TPOT terlihat 'lolos SLO' padahal tidak: angka kecil selalu terlihat meyakinkan sampai kamu tanya satuannya apa.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; pisahkan DataFrame `A` dan `B`" },
        { id: "t2", text: "Hitung `p50_ttft_A`, `p99_ttft_A`, `p50_ttft_B`, `p99_ttft_B` (detik)" },
        { id: "t3", text: "Hitung `p50_tpot_A_ms`, `p99_tpot_A_ms`, `p50_tpot_B_ms`, `p99_tpot_B_ms` (ms/token)" },
      ],
      expected:
        "TTFT A: p50 0,61 dtk / p99 4,51 dtk — GAGAL SLO 2 dtk (klaim vendor 0,045 dtk = angka TPOT, bukan TTFT). TTFT B: p50 2,83 / p99 5,53 dtk. TPOT A: p50 36,17 / p99 45,28 ms per token; TPOT B: p50 20,80 / p99 25,70 ms per token.",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Pisahkan varian: `A = df[df[\"variant\"] == \"A\"]` — begitu pula B.",
        "Kuantil: `A[\"ttft_ms\"].quantile(0.99)`; ubah ke detik dengan `/ 1000`, bulatkan 2 desimal.",
        "TPOT biarkan dalam ms: `round(A[\"tpot_ms\"].quantile(0.50), 2)`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-serving-llm/request_logs.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "A = ...",
          "B = ...",
          "",
          "p50_ttft_A = ...",
          "p99_ttft_A = ...",
          "p50_tpot_A_ms = ...",
          "p99_tpot_A_ms = ...",
          "",
          "p50_ttft_B = ...",
          "p99_ttft_B = ...",
          "p50_tpot_B_ms = ...",
          "p99_tpot_B_ms = ...",
          "",
          "print(\"TTFT A : p50 =\", p50_ttft_A, \"dtk | p99 =\", p99_ttft_A, \"dtk\")",
          "print(\"TPOT A : p50 =\", p50_tpot_A_ms, \"ms/token | p99 =\", p99_tpot_A_ms, \"ms/token\")",
          "print(\"TTFT B : p50 =\", p50_ttft_B, \"dtk | p99 =\", p99_ttft_B, \"dtk\")",
          "print(\"TPOT B : p50 =\", p50_tpot_B_ms, \"ms/token | p99 =\", p99_tpot_B_ms, \"ms/token\")"
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-serving-llm/request_logs.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "A = df[df[\"variant\"] == \"A\"]",
          "B = df[df[\"variant\"] == \"B\"]",
          "",
          "p50_ttft_A = round(A[\"ttft_ms\"].quantile(0.50) / 1000, 2)",
          "p99_ttft_A = round(A[\"ttft_ms\"].quantile(0.99) / 1000, 2)",
          "p50_tpot_A_ms = round(A[\"tpot_ms\"].quantile(0.50), 2)",
          "p99_tpot_A_ms = round(A[\"tpot_ms\"].quantile(0.99), 2)",
          "",
          "p50_ttft_B = round(B[\"ttft_ms\"].quantile(0.50) / 1000, 2)",
          "p99_ttft_B = round(B[\"ttft_ms\"].quantile(0.99) / 1000, 2)",
          "p50_tpot_B_ms = round(B[\"tpot_ms\"].quantile(0.50), 2)",
          "p99_tpot_B_ms = round(B[\"tpot_ms\"].quantile(0.99), 2)",
          "",
          "print(\"TTFT A : p50 =\", p50_ttft_A, \"dtk | p99 =\", p99_ttft_A, \"dtk\")",
          "print(\"TPOT A : p50 =\", p50_tpot_A_ms, \"ms/token | p99 =\", p99_tpot_A_ms, \"ms/token\")",
          "print(\"TTFT B : p50 =\", p50_ttft_B, \"dtk | p99 =\", p99_ttft_B, \"dtk\")",
          "print(\"TPOT B : p50 =\", p50_tpot_B_ms, \"ms/token | p99 =\", p99_tpot_B_ms, \"ms/token\")"
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t2", label: "`p99_ttft_A` = 4,51 dtk", name: "p99_ttft_A", value: 4.51, tol: 0.02, msg: "TTFT p99 Varian A = 4,51 dtk — GAGAL SLO 2 dtk, bukan 0,045 dtk seperti klaim vendor." },
          { kind: "equal", task: "t2", label: "`p50_ttft_A` = 0,61 dtk", name: "p50_ttft_A", value: 0.61, tol: 0.02, msg: "Median TTFT A sehat; yang jebol adalah ekornya (p99)." },
          { kind: "equal", task: "t3", label: "`p99_tpot_A_ms` = 45,28", name: "p99_tpot_A_ms", value: 45.28, tol: 0.5, msg: "45,28 ms/token — persis angka yang diklaim vendor sebagai 'TTFT p99'." },
          { kind: "equal", task: "t2", label: "`p99_ttft_B` = 5,53 dtk", name: "p99_ttft_B", value: 5.53, tol: 0.02, msg: "TTFT p99 B lebih buruk dari A — petunjuk cache bermasalah." },
          { kind: "equal", task: "t2", label: "`p50_ttft_B` = 2,83 dtk", name: "p50_ttft_B", value: 2.83, tol: 0.02, msg: "Median TTFT B 4,6× lipat A — bukan sekadar ekor." },
          { kind: "equal", task: "t3", label: "`p50_tpot_B_ms` = 20,80", name: "p50_tpot_B_ms", value: 20.8, tol: 0.5, msg: "Decode B memang lebih cepat (kuantisasi bekerja) — masalahnya bukan di sini." },
        ],
      },
    },
    {
      id: "lab-2",
      eyebrow: "Langkah 6 · Lab 2 — Biaya & cache",
      title: "Varian 'hemat' yang ternyata mahal",
      prose: [
        "Tagihan GPU 3× budget. Rumus biaya di misi ini sederhana: rata-rata total_ms per request → jam GPU → kali $3,20 → kali 1.000 request. Hitung per varian. Lalu ukur dua hal tentang cache: hit rate per varian, dan korelasi cache_hit vs prefill_ms — korelasi negatif kuat berarti cache benar-benar memangkas prefill.",
        "Hasilnya akan mengejutkan: varian B yang 'lebih murah' justru lebih mahal per 1k request. Jangan buru-buru menyimpulkan — biarkan angka bicara dulu; penjelasannya menyusul di audit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hit_A`, `hit_B` (rata-rata `cache_hit` per varian)" },
        { id: "t2", text: "Hitung `cost_A`, `cost_B` (USD per 1k request)" },
        { id: "t3", text: "Hitung `corr_cache_prefill` (korelasi `cache_hit` vs `prefill_ms`)" },
      ],
      expected:
        "Hit rate A 0,858 vs B 0,000 — KV-cache varian B mati total. Biaya/1k: A $3,48 vs B $4,14 — varian 'hemat' 19% LEBIH MAHAL. Korelasi cache vs prefill −0,79: cache benar-benar memangkas prefill.",
      formula: String.raw`\text{biaya}_{1k} = \bar{t}_{\text{ms}} \times \frac{3{,}20}{3600}`,
      formulaNote:
        "t_bar_ms = rata-rata total_ms per request; 3,20 = harga GPU USD/jam (asumsi laporan keuangan); 3600 = detik per jam; hasil = USD per 1.000 request. Contoh: rata-rata 3.900 ms → 3900 × 3,20 / 3600 = $3,47 per 1k. Ini proksi — di produksi ada batching dan overhead — tapi untuk membandingkan dua varian ia cukup jujur.",
      hints: [
        "Hit rate: `df.groupby(\"variant\")[\"cache_hit\"].mean()` — lalu ambil `[\"A\"]` dan `[\"B\"]`.",
        "Biaya: rata-rata `total_ms` per varian × `PRICE_PER_GPU_HOUR` / 3600.0.",
        "Korelasi: `df[\"cache_hit\"].corr(df[\"prefill_ms\"])` — negatif = cache menekan prefill.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-serving-llm/request_logs.csv\"",
          "",
          "# Harga GPU (USD per jam) — asumsi dari laporan keuangan",
          "PRICE_PER_GPU_HOUR = 3.20",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "hit = ...",
          "hit_A = ...",
          "hit_B = ...",
          "",
          "cost = ...",
          "cost_A = ...",
          "cost_B = ...",
          "",
          "corr_cache_prefill = ...",
          "",
          "print(\"hit rate : A =\", hit_A, \"| B =\", hit_B)",
          "print(\"biaya/1k : A = $\", cost_A, \"| B = $\", cost_B, sep=\"\")",
          "print(\"korelasi cache_hit vs prefill_ms =\", corr_cache_prefill)"
        ].join("\n"),
        lockLines: 10,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-serving-llm/request_logs.csv\"",
          "",
          "# Harga GPU (USD per jam) — asumsi dari laporan keuangan",
          "PRICE_PER_GPU_HOUR = 3.20",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "hit = df.groupby(\"variant\")[\"cache_hit\"].mean()",
          "hit_A = round(float(hit[\"A\"]), 3)",
          "hit_B = round(float(hit[\"B\"]), 3)",
          "",
          "cost = df.groupby(\"variant\")[\"total_ms\"].mean() * PRICE_PER_GPU_HOUR / 3600.0",
          "cost_A = round(float(cost[\"A\"]), 2)",
          "cost_B = round(float(cost[\"B\"]), 2)",
          "",
          "corr_cache_prefill = round(float(df[\"cache_hit\"].corr(df[\"prefill_ms\"])), 2)",
          "",
          "print(\"hit rate : A =\", hit_A, \"| B =\", hit_B)",
          "print(\"biaya/1k : A = $\", cost_A, \"| B = $\", cost_B, sep=\"\")",
          "print(\"korelasi cache_hit vs prefill_ms =\", corr_cache_prefill)"
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`hit_A` = 0,858", name: "hit_A", value: 0.858, tol: 0.005, msg: "KV-cache A bekerja: 85,8% request kena cache." },
          { kind: "equal", task: "t1", label: "`hit_B` = 0,000", name: "hit_B", value: 0.0, msg: "NOL di semua 120 baris — cache B mati total, bukan 'aktif' seperti klaim laporan." },
          { kind: "equal", task: "t2", label: "`cost_A` = $3,48", name: "cost_A", value: 3.48, tol: 0.02, msg: "Rata-rata total_ms A × 3,20 / 3600." },
          { kind: "equal", task: "t2", label: "`cost_B` = $4,14", name: "cost_B", value: 4.14, tol: 0.02, msg: "B 19% lebih mahal — prefill tanpa cache membakar GPU lebih lama." },
          { kind: "equal", task: "t3", label: "`corr_cache_prefill` = −0,79", name: "corr_cache_prefill", value: -0.79, tol: 0.03, msg: "Korelasi negatif kuat: cache hit = prefill jauh lebih murah." },
        ],
      },
    },
    {
      id: "kuis",
      eyebrow: "Langkah 7 · Kuis kilat",
      title: "Empat pertanyaan sebelum keputusan",
      prose: [
        "Keputusan strategi tinggal selangkah lagi. Empat pertanyaan untuk memastikan intuisi serving-mu tajam — tiap jawaban membawa penjelasan kenapa.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Request: TTFT 0,61 dtk, TPOT 36 ms/token, completion 100 token. Total latensi ≈ ?",
          options: [
            {
              text: "4,21 dtk",
              why: "Benar. total = TTFT + TPOT × n = 0,61 + 0,036 × 100 = 4,21 dtk. Dua komponen, dua satuan — samakan dulu ke detik.",
              correct: true,
            },
            {
              text: "0,97 dtk",
              why: "Salah — itu TTFT + TPOT tanpa dikali jumlah token. TPOT 36 ms/token × 100 token = 3,6 dtk, bukan 0,036 dtk.",
            },
            {
              text: "36,61 dtk",
              why: "Salah — satuannya tercampur: 36 (ms) dijumlah langsung dengan 0,61 (dtk). Samakan satuan dulu.",
            },
          ],
        },
        {
          q: "Varian B: cache_hit = 0 di semua 120 baris. Metrik apa yang LANGSUNG memburuk karenanya?",
          options: [
            {
              text: "prefill_ms dan TTFT",
              why: "Benar. KV-cache memangkas prefill; tanpa cache setiap prompt dibayar penuh → prefill naik → TTFT naik. Data mentah: TTFT p50 B 4,6× lipat A.",
              correct: true,
            },
            {
              text: "TPOT",
              why: "Salah. TPOT mengukur kecepatan decode per token — cache prompt tidak mengubahnya. Buktinya: TPOT B justru lebih kecil dari A.",
            },
            {
              text: "quality_score",
              why: "Salah jalur. Kualitas B memang lebih rendah, tapi penyebabnya kuantisasi — bukan cache. Cache mempercepat penyampaian, bukan isi jawaban.",
            },
          ],
        },
        {
          q: "Autoscaler berbasis CPU (target 70%): saat lonjakan prompt panjang, CPU 62% dan queue depth 340. Apa yang terjadi?",
          options: [
            {
              text: "Tidak scale-up; antrean menumpuk dan TTFT meledak",
              why: "Benar. HPA hanya melihat CPU: 62% < 70% = 'aman', padahal 340 request mengantre di GPU. Inilah buta mini-case Jumat 19:42.",
              correct: true,
            },
            {
              text: "Scale-up karena queue penuh",
              why: "Salah — HPA tidak melihat queue depth. Ia buta terhadap sinyal yang dilihat pengguna.",
            },
            {
              text: "Scale-down karena CPU di bawah target",
              why: "Salah. Kebanyakan HPA tidak scale-down agresif saat traffic naik — tapi ia juga tidak scale-up. Hasilnya sama buruknya: kapasitas diam.",
            },
          ],
        },
        {
          q: "Eval set tumpang tindih 70% dengan data training. Skor kualitas model akan…?",
          options: [
            {
              text: "Terinflasi oleh memorisasi — bukan bukti generalisasi",
              why: "Benar. Model yang pernah melihat prompt + jawabannya saat training akan 'menjawab benar' tanpa memahami. Eval seperti ini memilih penghafal, bukan penjawab.",
              correct: true,
            },
            {
              text: "Tetap valid karena prompt-nya sama untuk semua varian",
              why: "Salah. Adil antar-varian ≠ valid. Kalau soalnya bocor, yang diukur adalah siapa menghafal lebih baik.",
            },
            {
              text: "Lebih rendah karena model overfit",
              why: "Salah arah. Overfit MENAIKKAN skor di data yang pernah dilihat — itulah definisi masalahnya.",
            },
          ],
        },
      ],
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 8 · Checkpoint keputusan",
      title: "Satu strategi untuk 90 hari",
      prose: [
        "Angkanya sudah di tangan: TTFT p99 kedua varian jebol SLO 2 dtk; KV-cache B mati total; B 19% lebih mahal per 1k request; kualitas B di bawah A. Head of Product menunggu SATU strategi untuk 90 hari ke depan — bukan tiga. Tiap opsi membuka konsekuensi berbeda di langkah berikut, dan pilihanmu tercatat seperti memo yang sudah dikirim.",
      ],
      tasks: [],
      decision: {
        prompt: "Strategi perbaikan apa yang kamu usulkan untuk 90 hari ke depan?",
        options: [
          {
            id: "opt-cache",
            label: "Perbaiki KV-cache varian B + cache prefix lintas request",
            rationale:
              "Akar masalahnya jelas: cache B mati. Nyalakan kembali + perpanjang TTL prefix cache = prefill B anjlok, biaya B turun di bawah A, tanpa menyentuh kualitas model. Perbaikan infra murni — risiko kualitas nol.",
            nextStepId: "kons-cache",
            consequenceNote:
              "Prefill B turun ~80%, total p99 gabungan 7,72 → 5,1 dtk, biaya B turun di bawah A — tapi skor kualitas B tetap 3,58: tiket 'jawaban ngawur' tidak berkurang satu pun.",
          },
          {
            id: "opt-kuant",
            label: "Kuantisasi agresif: INT4 + speculative decoding di varian B",
            rationale:
              "Serang dua burung sekaligus: TPOT makin kecil (latensi turun) dan model makin ringan (biaya turun). B sudah INT8 dan decode-nya tercepat — dorong sampai mentok.",
            nextStepId: "kons-kuant",
            consequenceNote:
              "TPOT B 20,8 → 12 ms/token, biaya/1k turun 45%, p99 total 4,4 dtk — dashboard hijau semua. Tapi quality B 3,58 → 3,1: tiket kualitas naik 3× dalam dua minggu.",
          },
          {
            id: "opt-route",
            label: "Routing per kompleksitas: model kecil untuk query ringan, varian A untuk query berat",
            rationale:
              "70% query chatbot itu ringan (salam, FAQ, ringkasan pendek) — tidak butuh model penuh. Route query ringan ke model kecil, sisakan varian A untuk yang berat. Latensi dan biaya turun tanpa mengorbankan kualitas query sulit.",
            nextStepId: "kons-route",
            consequenceNote:
              "Biaya turun 40%, p99 total 4,9 dtk, kualitas query berat terjaga — tapi 8% query kompleks salah route ke model kecil dan kualitasnya anjlok tanpa terdeteksi selama 3 hari.",
          },
        ],
      },
    },
    {
      id: "kons-cache",
      goto: "audit",
      eyebrow: "Langkah 9 · Konsekuensi",
      title: "Diputuskan: perbaiki cache dulu",
      prose: [
        "Tiga minggu setelah KV-cache varian B dinyalakan kembali + TTL prefix diperpanjang: prefill B anjlok ~80%, TTFT p99 B 5,53 → 1,9 dtk, total p99 gabungan 7,72 → 5,1 dtk, biaya B turun di bawah A. Tagihan kembali ke 1,4× budget. Head of Product puas — sampai laporan tiket bulanan datang: 'jawaban ngawur' tidak berkurang satu pun. Skor kualitas B tetap 3,58 vs A 4,27.",
        "Pelajaran: kamu memperbaiki pipa, bukan isi kerannya. Cache mempercepat PENYAMPAIAN jawaban — ia tidak memperbaiki jawaban.",
      ],
      tasks: [],
      note: {
        title: "Perbaikan infra ≠ perbaikan model",
        body: "Cache, scaler, dan routing adalah tuas PENGIRIMAN. Kalau masalahnya kualitas model (kuantisasi merusak jawaban), semua tuas pengiriman hanya mengantar jawaban buruk lebih cepat dan lebih murah.",
      },
    },
    {
      id: "kons-kuant",
      goto: "audit",
      eyebrow: "Langkah 9 · Konsekuensi",
      title: "Diputuskan: kuantisasi agresif",
      prose: [
        "INT4 + speculative decoding live dalam sebulan: TPOT B 20,8 → 12 ms/token, biaya/1k turun 45%, p99 total 4,4 dtk — dashboard hijau semua, Head of Product memuji di all-hands. Dua minggu kemudian tiket kualitas naik 3×: jawaban B makin pendek, makin ngawur, dan makin percaya diri. Rollback INT4 memakan 4 hari karena tidak ada eval bersih untuk membuktikan kemunduran secara cepat.",
        "Pelajaran yang mahal: menekan dua sisi segitiga latensi-biaya-kualitas hampir selalu menggelembungkan sisi ketiga — dan sisi yang menggelembung (kualitas) adalah yang paling lambat terlihat di dashboard.",
      ],
      tasks: [],
      note: {
        title: "Diskon yang dibayar pengguna",
        body: "Kuantisasi agresif tanpa eval bersih = potongan harga yang tagihannya datang sebagai tiket support. Setiap putaran kompresi WAJIB ditemani eval set segar — kalau tidak, kamu terbang buta.",
      },
    },
    {
      id: "kons-route",
      goto: "audit",
      eyebrow: "Langkah 9 · Konsekuensi",
      title: "Diputuskan: routing per kompleksitas",
      prose: [
        "Router kompleksitas live: 70% query ringan ke model kecil, 30% berat ke varian A. Biaya turun 40%, p99 total 4,9 dtk, kualitas query berat terjaga — strategi terbaik di atas kertas. Minggu ketiga: 8% query kompleks salah route ke model kecil; kualitasnya anjlok — dan tidak ada yang sadar selama 3 hari karena metrik kualitas hanya diukur mingguan, sementara metrik latensi real-time.",
        "Pelajaran: router adalah model juga — ia punya error rate sendiri. Strategi terbaik pun gagal diam-diam kalau metrik kualitasnya tidak se-real-time metrik latensinya.",
      ],
      tasks: [],
      note: {
        title: "Setiap lapisan = lapisan yang bisa salah diam-diam",
        body: "Menambah router = menambah satu komponen yang bisa rusak tanpa bunyi. Pasang monitor kualitas per rute sejak hari pertama, bukan setelah tiket menumpuk.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 10 · Misi audit",
      title: "Dossier 12 baris: laporan vendor yang 'rapi' itu bohong",
      prose: [
        "Sebelum menulis proposal SLO, satu misi audit. Di bawah ini 12 baris 'Laporan Serving Triwulan — sesuai best practice', dokumen vendor Varian B. Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil lab-mu sendiri — TTFT/TPOT per varian, hit rate, biaya per 1k — dan 240 baris CSV mentah.",
        "Cara kerja: untuk setiap baris yang mencurigakan, hitung ulang dari data MENTAH (bukan dari angka dossier) dan lihat di mana mereka berbohong. Sebagian baris JUJUR — tugasmu membedakan mana klaim yang didukung data dan mana yang tidak.",
      ],
      tasks: [],
      auditDossier: {
        version: "serving-llm-capc-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai Laporan Serving Triwulan vendor Varian B: 'sesuai best practice, semua metrik dalam batas'. Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini.",
        columns: ["#", "Area", "Klaim laporan", "Angka di laporan", "Status klaim"],
        rows: [
          { rowId: 1, cells: { "#": "1", "Area": "Latensi", "Klaim laporan": "TTFT p99 Varian A di bawah SLO 2 dtk", "Angka di laporan": "0,045 dtk", "Status klaim": "LOLOS" }, claims: [{ label: "Klaim", value: "Sesuai best practice" }] },
          { rowId: 2, cells: { "#": "2", "Area": "Latensi", "Klaim laporan": "Total p99 gabungan sesuai keluhan produk", "Angka di laporan": "7,72 dtk", "Status klaim": "PERLU AKSI" }, claims: [{ label: "Klaim", value: "Terkonfirmasi dari log" }] },
          { rowId: 3, cells: { "#": "3", "Area": "Cache", "Klaim laporan": "KV-cache Varian A bekerja normal", "Angka di laporan": "hit rate 85,8%", "Status klaim": "OK" }, claims: [{ label: "Klaim", value: "Sesuai best practice" }] },
          // ── I2: KV-cache B diklaim aktif, data mentah 0% ──
          { rowId: 4, cells: { "#": "4", "Area": "Cache", "Klaim laporan": "KV-cache aktif di kedua varian", "Angka di laporan": "Varian B: 84%", "Status klaim": "OK" }, claims: [{ label: "Klaim", value: "Sesuai best practice" }] },
          { rowId: 5, cells: { "#": "5", "Area": "Decode", "Klaim laporan": "Kuantisasi INT8 mempercepat decode Varian B", "Angka di laporan": "TPOT p50: 20,80 ms/token", "Status klaim": "OK" }, claims: [{ label: "Klaim", value: "Terkonfirmasi dari log" }] },
          { rowId: 6, cells: { "#": "6", "Area": "Biaya", "Klaim laporan": "Varian B 19% lebih mahal per 1k request — anomali", "Angka di laporan": "A $3,48 · B $4,14", "Status klaim": "ANOMALI" }, claims: [{ label: "Klaim", value: "Terkonfirmasi dari log" }] },
          // ── I4: eval terkontaminasi, B diklaim menang ──
          { rowId: 7, cells: { "#": "7", "Area": "Kualitas", "Klaim laporan": "Varian B tidak kalah kualitas (eval internal, n=200)", "Angka di laporan": "B 4,2 vs A 4,0", "Status klaim": "OK" }, claims: [{ label: "Klaim", value: "Sesuai best practice" }] },
          // ── I3: klaim queue depth, bukti CPU ──
          { rowId: 8, cells: { "#": "8", "Area": "Autoscaler", "Klaim laporan": "Scale-up <60 dtk mengikuti queue depth", "Angka di laporan": "HPA: metric CPU, target 70%", "Status klaim": "OK" }, claims: [{ label: "Klaim", value: "Sesuai best practice" }] },
          { rowId: 9, cells: { "#": "9", "Area": "Latensi", "Klaim laporan": "TTFT p50 Varian A", "Angka di laporan": "0,61 dtk", "Status klaim": "OK" }, claims: [{ label: "Klaim", value: "Terkonfirmasi dari log" }] },
          { rowId: 10, cells: { "#": "10", "Area": "Kualitas", "Klaim laporan": "Skor kualitas mentah (prompt segar)", "Angka di laporan": "A 4,27 vs B 3,58", "Status klaim": "B PERLU PERHATIAN" }, claims: [{ label: "Klaim", value: "Terkonfirmasi dari log" }] },
          { rowId: 11, cells: { "#": "11", "Area": "Latensi", "Klaim laporan": "TTFT p99 Varian B", "Angka di laporan": "5,53 dtk", "Status klaim": "GAGAL SLO" }, claims: [{ label: "Klaim", value: "Terkonfirmasi dari log" }] },
          { rowId: 12, cells: { "#": "12", "Area": "SLO", "Klaim laporan": "Draft SLO yang diusulkan", "Angka di laporan": "TTFT p99 ≤ 2 dtk; total p99 ≤ 8 dtk", "Status klaim": "—" }, claims: [{ label: "Klaim", value: "Usulan" }] },
        ],
        injections: [
          { key: "ttft-tpot-tertukar", rowIds: [1], title: "TTFT dan TPOT dicampuradukkan", clue: "Baris 1 menulis 'TTFT p99 = 0,045 dtk'. Itu skala TPOT — tepatnya TPOT p99 Varian A dari lab-mu (45,28 ms). TTFT p99 A sebenarnya 4,51 dtk: GAGAL SLO 2 dtk. TTFT tidak mungkin lebih kecil dari prefill — satu ketidakmungkinan fisika yang lolos karena angkanya 'kelihatan kecil'.", danger: "SLO yang diukur dengan metrik yang salah = SLO yang selalu hijau. Tim berhenti memperbaiki masalah yang laporannya bilang 'tidak ada' — sementara pengguna tetap menunggu 8 detik." },
          { key: "kv-cache-mati", rowIds: [4], title: "KV-cache varian B diam-diam mati", clue: "Baris 4 klaim hit rate B 84%. Data mentah: cache_hit = 0 di SEMUA 120 baris varian B — cache mati total, bukan 'aktif'. Ini menjelaskan dua anomali sekaligus: prefill B lambat (TTFT p99 5,53 dtk) dan B lebih mahal per 1k request meski 'terkuantisasi'.", danger: "Konfigurasi yang mati diam-diam adalah pembunuh senyap: tidak ada error, tidak ada alert — hanya tagihan yang membengkak dan pengguna yang menunggu." },
          { key: "eval-terkontaminasi", rowIds: [7], title: "Eval set terkontaminasi data training", clue: "Baris 7 klaim B menang 4,2 vs 4,0 dari 'eval internal'. Baris 10 (prompt segar, data mentah): A 4,27 vs B 3,58 — A menang jelas. Appendix laporan sendiri mencatat 140 dari 200 prompt eval juga dipakai di training: yang diukur memorisasi, bukan kualitas.", danger: "Eval terkontaminasi memilih model yang menghafal, bukan yang menjawab. Di produksi, 'pemenang eval' adalah yang paling ngawur pada prompt baru — tepat seperti 12 tiket/minggu itu." },
          { key: "autoscaler-cpu", rowIds: [8], title: "Autoscaler scaling berdasar CPU, bukan queue depth", clue: "Baris 8 mengklaim 'mengikuti queue depth' — tapi bukti di kolom yang sama: 'HPA: metric CPU, target 70%'. Kontradiksi dalam satu baris. CPU tidak melihat antrean GPU: saat prefill spike, CPU 62% < 70% → tidak scale-up sementara queue menumpuk (ingat mini-case Jumat 19:42).", danger: "Scaler yang buta terhadap antrean = kapasitas datang setelah pengguna pergi. Latensi p99 adalah pajak yang dibayar pengguna atas metrik yang salah." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 11 · Deliverable",
      title: "Proposal SLO + tabel tradeoff",
      prose: [
        "Semua bukti di tangan: bedah latensi per varian, biaya per 1k request, pilihan strategi + konsekuensinya, dan 4 sabotase di laporan vendor. Tulis proposal untuk Head of Product — artefak portofoliomu. Proposal yang baik bukan sekadar angka SLO, melainkan angka yang bisa DIPERTAHANKAN: setiap ambang punya alasan bisnis, setiap tradeoff punya angka dari lab-mu.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Proposal SLO: ambang TTFT p50/p99, TPOT p99, dan total p99 + alasan bisnis tiap angka (rujuk keluhan 8 dtk & risiko churn).",
          "Tabel tradeoff 3 strategi (caching / kuantisasi / routing): kolom biaya per 1k, TTFT p99, TPOT, skor kualitas, risiko utama — angka dari lab-mu, bukan perkiraan.",
          "Rekomendasi SATU strategi + urutan eksekusi 30-60-90 hari, dengan mitigasi untuk konsekuensi yang kamu lihat di Langkah 9.",
          "Temuan audit: 4 sabotase di laporan vendor, masing-masing dengan nomor baris dossier dan angka pembanding dari CSV mentah.",
          "Batas & risiko sisa: apa yang TIDAK dijawab data ini (data SINTETIS; harga GPU asumsi $3,20/jam; skor kualitas sintetis; traffic & prompt asli bisa berperilaku beda).",
        ],
        rubric: [
          { criterion: "Kebenaran analisis data", weight: 30, levels: ["Angka salah / tidak dari CSV", "Sebagian angka benar", "TTFT/TPOT/biaya/hit-rate tepat dari log mentah + dibandingkan dengan SLO"] },
          { criterion: "Kualitas keputusan strategi", weight: 25, levels: ["Strategi tanpa alasan data", "Strategi beralasan, konsekuensi diabaikan", "Satu strategi beralasan + mitigasi konsekuensi Langkah 9 + rencana 30-60-90 hari"] },
          { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa bukti baris", "Keempat sabotase disebut dengan nomor baris + angka pembanding mentah"] },
          { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim data = produksi", "Menyebut sebagian batas", "Batas (SINTETIS; harga asumsi; kualitas sintetis; SLO disederhanakan) dinyatakan eksplisit"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 12 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di laporan vendor yang 'sesuai best practice':",
        "1) **TTFT↔TPOT tertukar** (baris 1): 'TTFT p99 = 0,045 dtk' — itu TPOT p99 (45,28 ms/token). TTFT p99 sebenarnya 4,51 dtk: GAGAL SLO. Satuannya kecil, keyakinannya besar — dan tidak ada yang bertanya '0,045 dtk untuk baca prompt itu masuk akal?'",
        "2) **KV-cache B mati** (baris 4): diklaim hit rate 84%; data mentah 0% di 120 baris. Satu flag konfigurasi yang mati menjelaskan dua anomali sekaligus — prefill lambat DAN tagihan mahal. Pembunuh senyap tanpa error dan tanpa alert.",
        "3) **Eval terkontaminasi** (baris 7): B 'menang' 4,2 vs 4,0 di eval internal; prompt segar berkata A 4,27 vs B 3,58. 140 dari 200 prompt eval bocor dari training — laporan mengukur daya ingat dan menjualnya sebagai kualitas.",
        "4) **Autoscaler buta antrean** (baris 8): klaim 'mengikuti queue depth', bukti 'metric CPU target 70%' — kontradiksi dalam satu baris. Inilah yang terjadi Jumat 19:42: CPU 62%, queue 340, 0 replika baru, p99 21 detik.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel 'best practice'.",
        "Bahaya nyata terakhir: chatbot yang menjawab dalam 8 detik tidak dipakai orang — ia ditinggalkan. Tiap detik latensi menaikkan abandonment; tagihan 3× budget membunuh unit economics; jawaban ngawur merusak kepercayaan merek. Serving LLM bukan soal model terpintar — soal pengalaman yang tidak membuat pengguna pergi.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #3: laporan yang bagus = tidak ada masalah",
        type: "pitfall",
        body: "Vendor selalu punya insentif terlihat bagus. Audit bukan soal menuduh — soal memverifikasi klaim terhadap data mentah. Kepercayaan tanpa verifikasi = kamu meng-outsource penilaianmu ke pihak yang dinilai.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 13 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "TTFT (prefill + antrean) vs TPOT (decode per token): total = TTFT + TPOT × n_out — optimasi harus menyerang bottleneck yang benar, bukan metrik yang paling mudah dikecilkan.",
        "Hasil lab dari 240 request SINTETIS (seed 42): TTFT p99 A 4,51 dtk / B 5,53 dtk (SLO 2 dtk jebol); TPOT p50 A 36,17 vs B 20,80 ms/token; hit rate A 0,858 vs B 0,000; biaya/1k A $3,48 vs B $4,14.",
        "Segitiga latensi–biaya–kualitas: caching memperbaiki pengiriman, kuantisasi menekan biaya/latensi dengan harga kualitas, routing butuh monitor kualitas per rute — tiap strategi punya konsekuensi yang tercatat di Langkah 9.",
        "Empat pola sabotase laporan: TTFT↔TPOT tertukar, KV-cache mati diam-diam, autoscaler berbasis metrik yang salah, eval set terkontaminasi — semua terdeteksi dengan membandingkan ke data mentah.",
        "Bahaya nyata: latensi p99 = churn pengguna; eval kotor = model penghafal yang menang; scaler buta antrean = kapasitas datang setelah pengguna pergi. Data: SINTETIS, harga GPU & SLO disederhanakan — file METODE.md.",
      ],
    },
  ],
};

export default misiGabungServing;
