import type { V2Lesson } from "../lib/types";

const LLMOPS13_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Biaya bulanan: API 50.000 dolar vs self-host 18.000 dolar pada 10 juta request."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">25rb</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50rb</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c4)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">$50.000</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">API</text><rect x="294.7" y="122.4" width="129.6" height="57.6" rx="3" fill="var(--c1)"/><text x="359.5" y="116.4" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">$18.000</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Self-host</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">USD / bulan @10jt req</text></svg>`;

export const llmops13: V2Lesson = {
  slug: "llmops13-inference-selfhosted",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps13 — Inference Self-Hosted (vLLM/TGI)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tagihan $50.000 yang memicu migrasi",
      prose: [
        "Januari 2026. Startup AI Svara membayar tagihan API LLM: $50.000/bulan untuk 10 juta request. CFO memanggil CTO: `Kita membakar $600.000 per tahun untuk sesuatu yang... bisa kita jalankan sendiri?` CTO menghitung cepat: 4x GPU A100 (sewa $2.000/bulan/GPU = $8.000) + 1 engineer ($10.000/bulan) = $18.000/bulan. Selisih: $32.000/bulan = $384.000/tahun. Migrasi disetujui hari itu juga.",
        "Twist-nya: 3 bulan kemudian tagihannya BUKAN $18.000 — melainkan $31.000. GPU-nya idle 60% (throughput buruk!), engineer-nya lembur tiap malam (OOM misterius!), dan latensi p99 12 detik (user kabur!). Mereka `berhasil` self-host secara teknis, tapi GAGAL secara operasional — karena tidak memahami tiga hal: continuous batching, KV-cache, dan capacity planning untuk LLM. Lesson ini adalah 3 hal itu + matematika break-even yang jujur.",
        "Self-hosted inference BUKAN `install model, selesai`. Ia adalah sistem operasi mini: scheduler (siapa dilayani kapan), memori (KV-cache!), dan autoscaling GPU. vLLM dan TGI (Text Generation Inference) adalah dua engine yang menyelesaikan 80% masalah ini — TAPI hanya jika kamu paham cara kerjanya. Lesson ini: paham dulu, deploy kemudian.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa naive self-hosting (satu request satu proses) gagal secara ekonomi; (2) menghitung kebutuhan memori KV-cache untuk batch dan sequence tertentu; (3) membandingkan throughput static vs continuous batching dengan angka; (4) menghitung break-even API vs self-host untuk volumenya sendiri; (5) memilih vLLM vs TGI vs API untuk skenario konkret.",
        "Ekonomi GPU dan self-hosting (break-even, sewa vs beli) diajarkan sebagai modul bersama di AIE19 — Self-Hosting LLM (track AI Engineering); lesson ini fokus pada operasi inference di produksi.",
        "Daftar isi: 1) Cerita Svara · 2) Continuous batching: rahasia vLLM · 3) KV-cache: memori adalah batasnya · 4) Lab: simulasi batching · 5) Break-even yang jujur · 6) Peta keputusan: API vs self-host · 7) Mini-case: hitungan NusaBank · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Self-host = install model, langsung hemat 60%`",
        type: "pitfall",
        body: "Hemat 60% hanya terjadi jika throughput-nya benar. Svara `berhasil install` tapi GPU idle 60% + OOM tiap malam = tagihan $31.000, bukan $18.000. Self-host tanpa paham batching dan KV-cache = membayar mahal untuk belajar. Lesson ini memastikan kamu tidak membayar `uang sekolah` itu.",
      },
      reference: "$50.000 vs $18.000 vs $31.000 — selisihnya adalah pemahaman operasional.",
    },
    {
      id: "batching",
      eyebrow: "Langkah 2 · Konsep",
      title: "Continuous batching: rahasia vLLM",
      prose: [
        "Serving naive: satu request = satu proses GPU. Request A (20 token) dan B (200 token) jalan sendiri-sendiri: GPU melayani A 1 detik, lalu B 10 detik — total 11 detik, GPU menganggur saat A menunggu? Tidak — lebih buruk: GPU TIDAK BISA dipakai orang lain saat melayani satu request (tanpa batching). Utilisasi: 15%. Inilah mengapa Svara butuh 4 GPU untuk pekerjaan 1 GPU.",
        "Static batching (naive batch): kumpulkan 4 request, jalankan bersama. Masalah: batch SELESAI saat request TERPANJANG selesai. A(20) + B(200) + C(30) + D(40): batch jalan 10 detik (menunggu B!) — A, C, D selesai di detik 1–2 tapi TIDAK BOLEH keluar (menunggu B). GPU membuang 70% waktunya menunggu. Plus: request E yang tiba di detik 2 harus menunggu batch berikutnya (antre 8 detik!). Static batching = restoran yang tidak boleh mengantar makanan sampai SEMUA meja selesai.",
        "Continuous batching (vLLM, TGI): TIDAK ADA konsep `batch selesai`. Tiap iterasi (satu token), scheduler: (1) keluarkan request yang sudah selesai (A keluar di detik 1!), (2) masukkan request baru yang antre (E masuk detik 2!), (3) lanjutkan sisanya. GPU tidak pernah menunggu yang lambat, tidak pernah menolak yang baru. Hasil lab lesson ini: throughput 61,9 vs 35,1 tok/s (1,76x!) — dan itu dengan contoh kecil; di produksi bedanya 3–5x.",
        "Angka produksi nyata (vLLM, A100, model 13B): tanpa batching: 8 req/s. Static batching: 22 req/s. Continuous batching: 68 req/s. Satu perubahan arsitektur (bukan GPU baru!) = 8,5x throughput. Svara yang memakai serving naive butuh 4 GPU; dengan vLLM cukup 1 GPU untuk traffic yang sama. $8.000/bulan → $2.000/bulan. Inilah `rahasia` yang bukan rahasia: batching yang benar.",
        "Cara kerja PagedAttention (inovasi vLLM): KV-cache tradisional menyimpan memori KONTIGU per request — boros (fragmentasi!) seperti malloc tanpa free. PagedAttention membagi KV-cache menjadi BLOK-BLOK kecil (seperti virtual memory OS!) yang bisa dipakai bersama antar request (prefix yang sama = blok yang sama = hemat!). Hasil: memori 2–4x lebih efisien → batch 2–4x lebih besar → throughput 2–4x. Tiga lapis pengali: continuous batching × PagedAttention × GPU yang sama.",
        "vLLM vs TGI 30 detik: vLLM (UC Berkeley) = throughput tertinggi, komunitas terbesar, PagedAttention; TGI (HuggingFace) = integrasi HF terbaik, production-hardened, sedikit lebih lambat. Untuk 90% kasus: vLLM. Untuk yang butuh `didukung HuggingFace resmi` (enterprise): TGI. Keduanya open-source, keduanya continuous batching. Pilih vLLM kecuali ada alasan spesifik untuk TGI.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: GPU menganggur = uang terbakar",
        body: "Setiap detik GPU idle = $0,0006 terbuang ($2.000/bulan / 2,6 juta detik). Static batching membuang 70% detiknya menunggu request terpanjang. Continuous batching = tidak ada detik terbuang. Optimasi inference #1 bukan GPU lebih cepat — melainkan GPU yang tidak pernah menganggur.",
      },
      reference: "Continuous batching 3–5x throughput. PagedAttention 2–4x memori. vLLM default untuk 90% kasus.",
    },
    {
      id: "kvcache",
      eyebrow: "Langkah 3 · Konsep",
      title: "KV-cache: memori adalah batasnya",
      prose: [
        "Setiap token yang di-generate menyimpan `ingatan` (key-value) agar tidak menghitung ulang: KV-cache. Ukurannya: mem = 2 (K dan V) × L (layer) × h (heads) × d (dim per head) × b (batch) × s (sequence) × 2 byte (fp16). Untuk model 13B (L=40, h=40, d=128), batch 16, sequence 1024: 2×40×40×128×16×1024×2 = 13,4 miliar byte ≈ 12,5GB. A100 40GB: model 26GB + KV 12,5GB = 38,5GB — HAMPIR PENUH dengan batch cuma 16!",
        "Inilah OOM misterius Svara tiap malam: traffic malam naik 2x → batch 32 → KV 25GB → total 51GB > 40GB → CRASH. Mereka mengira `modelnya bocor memori`; sebenarnya aritmetika. Solusinya BUKAN `restart tiap jam` (yang mereka lakukan 2 minggu!), melainkan: (1) batasi max_batch by hitungan (bukan firasat!); (2) kuantisasi KV-cache ke int8 (12,5GB → 6,3GB); (3) batasi max_sequence (1024 → 512 = setengah memori). Tiga tuas, semuanya dari rumus.",
        "Contoh perencanaan kapasitas: target 100 req/s, rata-rata 50 token/request = 5.000 tok/s. vLLM throughput 68 req/s per A100 (dari langkah 2) → butuh 2x A100 (100/68 = 1,47 → 2). Cek memori per GPU: batch efektif ~32, seq 512 → KV = 2×40×40×128×32×512×2 = 13,4GB × (32/16)×(512/1024) = 13,4GB. Model 26GB + 13,4 = 39,4GB < 40GB ✓ (tipis! pakai int8 KV untuk margin). Tanpa hitungan ini = Svara (OOM tiap malam). Dengan hitungan ini = tidur nyenyak.",
        "Trade-off kuantisasi: fp16 → int8 KV-cache: hemat 50% memori, kualitas turun < 0,5% (tidak terasa untuk kebanyakan use-case). fp16 → int4: hemat 75%, kualitas turun 1–2% (terasa untuk reasoning!). Aturan: KV int8 = default aman; int4 = hanya jika memori benar-benar kritis DAN sudah diuji di golden set (LLMOps3!). Jangan kuantisasi buta — ukur dampaknya.",
        "Autoscaling GPU untuk LLM berbeda dari MLOps6: cold start = load model 26GB → 60–90 detik (bukan 10 detik!). Selama 90 detik, traffic menunggu. Solusi: (1) scheduled scaling (tahu jam sibuk); (2) keep 1 GPU warm standby (bayar $2.000/bulan untuk tidur — murah dibanding 90 detik downtime); (3) scale by queue length, bukan CPU (GPU selalu 100%!). Svara yang scale by CPU tidak pernah scale (CPU selalu rendah!) — antrean 90 detik tiap spike.",
      ],
      formula: String.raw`mem_{KV} = 2 \cdot L \cdot h \cdot d \cdot b \cdot s \cdot 2\text{ byte}`,
      formulaNote: "mem_KV = memori KV-cache; L = layer; h = heads; d = dim per head; b = batch size; s = panjang sequence; 2 byte = fp16 (1 byte jika int8). Contoh: 13B, b=16, s=1024 → 12,5GB. Selalu hitung SEBELUM deploy — OOM bukan misteri, ia aritmetika.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `OOM = model bocor, restart saja`",
        type: "pitfall",
        body: "Svara restart tiap jam selama 2 minggu untuk `OOM misterius`. OOM tidak misterius — ia aritmetika KV-cache: batch naik 2x → memori naik 2x → crash. Restart = mengobati gejala. Hitung mem_KV, batasi batch, kuantisasi ke int8 = mengobati penyebab. Jangan restart buta; hitung dulu.",
      },
      reference: "Hitung mem_KV sebelum deploy. KV int8 = default aman. Scale by queue, bukan CPU.",
    },
    {
      id: "lab-batching",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: static vs continuous batching",
      prose: [
        "Kita simulasikan 6 request dengan waktu tiba dan panjang berbeda (mock). Static batching: batch 3, tunggu penuh/timeout, batch berikutnya menunggu. Continuous: tiap request mulai saat tiba. Tugasmu: implementasikan kedua scheduler dan hitung makespan + throughput.",
        "Cara membaca: makespan = total waktu; throughput = token/detik; speedup = static/continuous. Interpretasi: speedup 1,76x pada contoh kecil ini; di produksi (ratusan request) bedanya 3–5x. Angka ini = alasan vLLM ada.",
        "Coba eksplorasi: ubah request ke-2 menjadi 200 token (sangat panjang). Perhatikan: static batching makin menderita (semua menunggu si panjang!), continuous tidak peduli. Inilah `straggler problem` yang diselesaikan continuous batching.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `static_batch` — batch 3, makespan & throughput" },
        { id: "t2", text: "Implementasikan `continuous_batch` — mulai saat tiba" },
        { id: "t3", text: "Hitung speedup, jalankan dan baca output" },
      ],
      expected: "static: 3.70s, 35.1 tok/s · continuous: 2.10s, 61.9 tok/s · speedup 1.76x",
      note: {
        title: "💡 Intuisi: straggler = pajak static batching",
        body: "Satu request 200 token membuat 3 request lain menunggu 10 detik dalam static batching — pajak yang dibayar semua orang untuk satu orang lambat. Continuous batching menghapus pajak ini: yang selesai keluar, yang baru masuk. Tidak ada yang menunggu straggler.",
      },
      hints: [
        "static: batch reqs[i:i+3]; start = max(t, batch[0][0]); dur = max(tok)*0.05; t = start+dur.",
        "continuous: makespan = max(arr + tok*0.05); throughput = total_tok/makespan.",
        "speedup = t_static / t_continuous.",
      ],
      code: {
        starter: `requests = [(0.0, 20), (0.1, 40), (0.2, 10), (0.5, 30), (0.6, 20), (1.0, 10)]\nTOK = 0.05  # detik per token\n\n# TULIS KODEMU\ndef static_batch(reqs, bsize=3):\n    \n\ndef continuous_batch(reqs):\n    \n\nt1, tp1, b1 = static_batch(requests)\nt2, tp2 = continuous_batch(requests)\nprint(f\"static: makespan={t1:.2f}s throughput={tp1:.1f} tok/s batches={b1}\")\nprint(f\"continuous: makespan={t2:.2f}s throughput={tp2:.1f} tok/s\")\nprint(f\"speedup={t1 / t2:.2f}x\")`,
        lockLines: 3,
        solution: `requests = [(0.0, 20), (0.1, 40), (0.2, 10), (0.5, 30), (0.6, 20), (1.0, 10)]\nTOK = 0.05  # detik per token\n\n# TULIS KODEMU\ndef static_batch(reqs, bsize=3):\n    t = 0.0\n    total_tok = 0\n    i = 0\n    batches = []\n    while i < len(reqs):\n        batch = reqs[i:i + bsize]\n        start = max(t, batch[0][0])\n        wait_until = batch[0][0] + 1.0\n        start = max(start, min(wait_until, batch[-1][0] if len(batch) == bsize else wait_until))\n        dur = max(tok for _, tok in batch) * TOK\n        t = start + dur\n        total_tok += sum(tok for _, tok in batch)\n        batches.append(len(batch))\n        i += bsize\n    return t, total_tok / t, batches\n\ndef continuous_batch(reqs):\n    end_times = []\n    for arr, tok in reqs:\n        end_times.append(arr + tok * TOK)\n    makespan = max(end_times)\n    total_tok = sum(tok for _, tok in reqs)\n    return makespan, total_tok / makespan\n\nt1, tp1, b1 = static_batch(requests)\nt2, tp2 = continuous_batch(requests)\nprint(f\"static: makespan={t1:.2f}s throughput={tp1:.1f} tok/s batches={b1}\")\nprint(f\"continuous: makespan={t2:.2f}s throughput={tp2:.1f} tok/s\")\nprint(f\"speedup={t1 / t2:.2f}x\")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "static 3.70s", msg: "Makespan static batching harus 3.70s.", pattern: "static: makespan=3\\.70s" },
          { kind: "stdout_matches", task: "t3", label: "continuous 61.9 tok/s", msg: "Throughput continuous harus 61.9 tok/s.", pattern: "throughput=61\\.9 tok/s" },
          { kind: "stdout_matches", task: "t3", label: "speedup 1.76x", msg: "Speedup continuous vs static = 1.76x.", pattern: "speedup=1\\.76x" },
        ],
      },
      reference: "Straggler problem: static menunggu terpanjang; continuous tidak.",
    },
    {
      id: "breakeven",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Break-even yang jujur: $50.000 vs $18.000 vs $31.000",
      prose: [
        "Hitungan CTO Svara: API $50.000/bulan (10 juta request × $0,005) vs self-host $18.000 (4 GPU × $2.000 + engineer $10.000). Tapi angka $18.000 SALAH DUA KALI: (1) GPU over-provision 4x (tanpa continuous batching, butuh 4 GPU untuk kerja 1 GPU!) → seharusnya 2 GPU (redundansi) = $4.000; (2) engineer $10.000/bulan PENUH untuk 1 sistem — realistis 0,25 FTE setelah stabil = $2.500. Hitungan JUJUR: $4.000 + $2.500 + buffer 30% = $8.450/bulan. BUKAN $18.000! CTO over-estimasi 2x — dan realisasi $31.000 karena operasional buruk.",
        "Rumus break-even: Q* = GPU_fixed / (p_api − c_var). Dengan GPU_fixed = $4.000/bulan (2 GPU), p_api = $0,005/request, c_var = $0,0002 (listrik + bandwidth): Q* = 4000/0,0048 ≈ 833.000 request/bulan. Di ATAS 833rb/bulan: self-host menang. Di BAWAH: API menang. Svara (10 juta) = 12x di atas break-even — keputusan migrasi BENAR, eksekusinya yang salah.",
        "Tiga biaya yang selalu dilupakan: (1) ENGINEER TIME — 0,25 FTE setelah stabil, 1 FTE selama 3 bulan migrasi; (2) REDUNDANSI — 2 GPU minimum (1 down = tetap jalan); jangan hitung 1 GPU!; (3) OBSERVABILITY — monitoring GPU/throughput/latensi (LLMOps7) = $500/bulan tools + waktu. Total `biaya tak terlihat`: ~$4.000/bulan. Hitungan yang mengabaikan ketiganya = hitungan yang bohong.",
        "Kapan JANGAN self-host (jujur): (1) Q < 500rb/bulan — API lebih murah (di bawah break-even); (2) traffic SANGAT spiky (100x naik-turun) — GPU idle 90% = API (pay-per-use) menang; (3) butuh 10+ model berbeda — kelola 10 deployment vs 1 API call; (4) tim < 3 orang tanpa ML-ops — tidak ada yang jaga malam saat OOM. Svara lolos semua (10jt req, traffic stabil, 1 model, tim 8) — makanya migrasi benar.",
        "Jalur tengah: HYBRID. 80% traffic (reguler) → self-host ($6.760); 20% spike → API ($10.000). Total $16.760 vs murni self-host $8.450 + risiko spike vs murni API $50.000. Hybrid = self-host untuk baseline + API untuk overflow. Ini pola yang dipakai NusaBank (mini-case): hemat 66% dengan risiko spike nol.",
      ],
      formula: String.raw`Q^* = \frac{GPU_{fixed}}{p_{api} - c_{var}}`,
      formulaNote: "Q* = break-even (request/bulan); GPU_fixed = biaya tetap GPU/bulan (termasuk redundansi 2x!); p_api = harga API per request; c_var = biaya variabel per request (listrik/bandwidth). Di atas Q*: self-host. Di bawah: API. Jangan lupa 3 biaya tak terlihat.",
      figure: {
        svg: LLMOPS13_SVG,
        alt: "Diagram batang biaya bulanan: API $50.000 vs self-host $18.000 (hitungan kasar) — realisasi $31.000 karena operasional buruk.",
        caption: "Cara membaca: tinggi batang = biaya bulanan (USD) untuk 10 juta request; tiga batang = API, hitungan kasar self-host, realisasi Svara. Interpretasi: keputusan migrasi BENAR (di atas break-even 833rb), tapi realisasi $31.000 (bukan $18.000) karena GPU idle 60% + OOM. Selisih $13.000/bulan = harga ketidaktahuan operasional.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: keputusan benar, eksekusi salah",
        body: "Svara benar pindah (12x di atas break-even) tapi salah menjalankannya (naive batching + tanpa hitung KV-cache). Break-even menjawab `apakah pindah?`; lesson ini menjawab `bagaimana pindahnya dengan benar?`. Dua pertanyaan berbeda — jawab keduanya.",
      },
      reference: "Q* = 833rb/bulan (contoh). Hybrid: self-host baseline + API overflow.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "API, self-host, atau hybrid?",
      prose: [
        "**Skenario 1 — Startup, < 500rb req/bulan, tim 3 orang.** → API. Di bawah break-even + tidak ada yang jaga malam. Self-host = bunuh diri operasional.",
        "**Skenario 2 — Scale-up, 10jt req/bulan, traffic stabil, 1–2 model.** → Self-host (vLLM). 12x di atas break-even. Hemat $40.000+/bulan. Syarat: paham lesson ini!",
        "**Skenario 3 — E-commerce, spike 100x saat Harbolnas.** → Hybrid. Self-host untuk baseline (80%), API untuk spike (20%). GPU idle 90% di luar spike = pemborosan.",
        "**Skenario 4 — Bank, data sensitif (UU PDP), butuh kontrol penuh.** → Self-host (TGI/vLLM on-prem). Bukan soal biaya — soal data tidak boleh keluar. Break-even tidak relevan jika regulasi yang memerintah.",
        "Aturan praktis 10 detik: `Q > 1jt/bulan DAN traffic stabil DAN tim ada yang bisa jaga?` → self-host. `Ada satu TIDAK?` → API atau hybrid. `Regulasi?` → self-host, titik.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: sewa vs beli = API vs self-host",
        body: "API = sewa apartemen (mahal per bulan, nol urusan). Self-host = beli rumah (murah per bulan, urus sendiri bocornya). Hybrid = punya rumah + sewa apartemen saat renovasi. Pilih sesuai fase hidup, bukan gengsi.",
      },
      reference: "Break-even dulu, baru gengsi. Regulasi mengalahkan matematika.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Hitungan NusaBank: 2 juta request, spike Lebaran",
      prose: [
        "NusaBank: 2 juta request/bulan reguler, spike 5x saat Lebaran (1 bulan). Harga API $0,005/req. GPU A100 $2.000/bulan. Engineer 0,25 FTE ($2.500).",
        "Hitung: (a) Biaya API murni setahun. (b) Biaya self-host murni (ingat: provision untuk SPIKE = 5x GPU!). (c) Biaya hybrid. (d) Rekomendasi + alasan.",
        "**Pembahasan:** (a) API: 2jt × 12 × $0,005 = $120.000/tahun (spike termasuk, pay-per-use!). (b) Self-host: butuh GPU untuk 10jt req/bulan (spike!) = 4 GPU × $2.000 × 12 = $96.000 + engineer $30.000 = $126.000/tahun. LEBIH MAHAL dari API! (c) Hybrid: baseline 2jt = 1 GPU ($24.000) + engineer ($30.000) + spike via API (8jt × $0,005 = $40.000) = $94.000/tahun. (d) HYBRID menang $26.000/tahun (22%). Pelajaran: provision untuk spike = bunuh diri; spike adalah TUGAS API.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Provision untuk puncak = membayar 12 bulan untuk 1 bulan spike. Dalam risk, ini `over-hedging`: premi (GPU idle 11 bulan) > risiko (bayar API saat spike). Lindungi nilai yang tepat: baseline milikmu, ekor milik vendor.",
      },
      reference: "Spike = tugas API. Baseline = tugas self-host. Jangan tertukar.",
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
          q: "Svara: GPU idle 60%, OOM tiap malam, p99 12 detik. Diagnosis UTAMA?",
          options: [
            { text: "GPU-nya kurang — tambah jadi 8 GPU", why: "Menambah GPU untuk utilisasi 15% = 8 GPU idle 60% = 2x pemborosan. Masalahnya arsitektur serving, bukan jumlah GPU." },
            { text: "Naive serving tanpa continuous batching + tanpa hitung KV-cache", why: "Tepat. Idle 60% = tidak ada batching yang benar; OOM = KV-cache meledak saat batch naik; p99 12 dtk = antrean. Tiga gejala, satu akar: operasional inference tidak dipahami.", correct: true },
            { text: "Modelnya terlalu besar — ganti yang kecil", why: "Model 13B wajar untuk A100. Mengecilkan model tanpa perbaiki batching = tetap idle 60%, hanya lebih cepat idle-nya." },
            { text: "User-nya terlalu banyak", why: "10 juta req/bulan = 4 req/detik rata-rata — kecil! Masalahnya bukan volume, melainkan 1 req = 1 proses." },
          ],
        },
        {
          q: "Model 13B, batch 16, seq 1024. Estimasi KV-cache (fp16)?",
          options: [
            { text: "~12,5GB — hitung: 2×40×40×128×16×1024×2 byte", why: "Tepat. Dan 26GB (model) + 12,5GB = 38,5GB < 40GB — hampir penuh! Batch 32 = OOM. Hitungan ini mencegah `OOM misterius`.", correct: true },
            { text: "~1GB — KV-cache kecil, abaikan", why: "Salah 12x. KV-cache adalah KONSUMEN MEMORI TERBESAR setelah bobot model. Mengabaikannya = OOM tiap malam." },
            { text: "~40GB — pasti tidak muat", why: "Berlebihan 3x. 12,5GB muat (tipis). Estimasi yang terlalu takut = over-provision 2x = buang $2.000/bulan." },
            { text: "Tidak bisa dihitung tanpa menjalankan", why: "Bisa dan HARUS dihitung sebelum deploy — rumusnya deterministik. `Jalankan dulu` untuk OOM = Svara." },
          ],
        },
        {
          q: "Q* = 833rb/bulan. Startup dengan 300rb req/bulan, tim 3 orang. Keputusan?",
          options: [
            { text: "Self-host — lebih murah jangka panjang", why: "300rb < 833rb = di bawah break-even = API lebih murah. `Jangka panjang` tidak mengubah aritmetika." },
            { text: "Tetap API — di bawah break-even + tidak ada yang jaga malam", why: "Tepat. Dua alasan independen (ekonomi + operasional) menunjuk API. Self-host di sini = bunuh diri ganda.", correct: true },
            { text: "Self-host dengan 1 GPU saja agar murah", why: "1 GPU tanpa redundansi = 1 down = 100% down. Dan 300rb req tetap di bawah break-even. Murah yang rapuh." },
            { text: "Hybrid 50-50", why: "Hybrid untuk SPIKE, bukan untuk volume kecil stabil. 300rb stabil = API murni paling sederhana dan murah." },
          ],
        },
        {
          q: "Traffic naik 100x setahun sekali (Harbolnas). Strategi GPU TEPAT?",
          options: [
            { text: "Provision 100x GPU sepanjang tahun", why: "Membayar 12 bulan untuk 1 bulan spike = over-hedging. Premi (idle 11 bulan) > risiko." },
            { text: "Hybrid: self-host baseline + API untuk spike", why: "Tepat (mini-case: hemat 22%). Baseline milikmu (murah), ekor milik vendor (fleksibel). Jangan tertukar.", correct: true },
            { text: "Tolak traffic spike — tutup layanan saat Harbolnas", why: "Menolak revenue terbesar tahun ini = keputusan bisnis yang... berani. Tapi salah." },
            { text: "Berdoa spike tidak terjadi", why: "Bukan strategi. Spike PASTI terjadi; yang bisa dipilih hanya siapa yang menanggungnya." },
          ],
        },
        {
          q: "Autoscaling LLM: scaling trigger yang TEPAT?",
          options: [
            { text: "CPU utilization > 70%", why: "GPU inference: CPU selalu rendah (kerja di GPU!). Trigger CPU tidak pernah menyala = tidak pernah scale = antrean." },
            { text: "Queue length (antrean request) > ambang", why: "Tepat. Antrean = sinyal langsung `permintaan > kapasitas`. GPU selalu 100% saat bekerja, jadi GPU-util juga tidak berguna sebagai trigger.", correct: true },
            { text: "Jumlah user login", why: "Login ≠ request inference. 10.000 login diam ≠ 10.000 request. Trigger harus mengukur BEBAN, bukan kehadiran." },
            { text: "Waktu (scale tiap jam 12 siang)", why: "Scheduled scaling bagus untuk pola TERJADWAL, tapi butuh trigger reaktif untuk yang tak terduga. Kombinasi keduanya ideal." },
          ],
        },
        {
          q: "vLLM vs TGI: kapan pilih TGI?",
          options: [
            { text: "Selalu — TGI lebih cepat dari vLLM", why: "Tidak selalu; vLLM umumnya throughput lebih tinggi (PagedAttention). `Selalu` = tidak pernah benar untuk tooling." },
            { text: "Butuh dukungan resmi HuggingFace / enterprise (integrasi HF, support)", why: "Tepat. TGI = production-hardened + HF ecosystem. Untuk 90% kasus vLLM cukup; TGI untuk kebutuhan enterprise spesifik.", correct: true },
            { text: "Tidak pernah — vLLM selalu menang", why: "`Selalu` juga salah. Enterprise dengan kontrak HF / butuh fitur TGI spesifik (granular quantization) = TGI." },
            { text: "Pilih acak — keduanya sama", why: "Keduanya continuous batching, tapi beda komunitas, fitur, dan dukungan. Pilih by kebutuhan, bukan koin." },
          ],
        },
      ],
      summary: [
        "Naive serving (1 req = 1 proses) utilisasi 15% — continuous batching (vLLM/TGI) 3–5x throughput.",
        "KV-cache = batas memori: hitung mem_KV sebelum deploy; OOM = aritmetika, bukan misteri.",
        "Break-even Q* = GPU_fixed/(p_api − c_var); di atasnya self-host, di bawahnya API.",
        "Tiga biaya tak terlihat: engineer time, redundansi 2x, observability.",
        "Spike = tugas API (hybrid); baseline stabil = tugas self-host.",
        "vLLM default (90% kasus); TGI untuk enterprise HF. Scale by queue, bukan CPU.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
