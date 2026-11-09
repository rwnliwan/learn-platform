import type { V2Lesson } from "../lib/types";

// Latensi total untuk 20/100/300 token output: TTFT 250ms tetap, sisanya decode @20ms/token.
// Total: 650ms / 2.250ms / 6.250ms. Batang bertumpuk: TTFT (gelap) + decode (terang).
const FIG_TTFT_TPOT = `<svg viewBox="0 0 480 250" role="img" aria-label="Komposisi latensi: TTFT 250ms tetap, decode tumbuh dengan jumlah token.">
<text x="10" y="44" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="start">20 token</text>
<rect x="100" y="30" width="12" height="20" rx="3" fill="var(--c1)"/><rect x="112" y="30" width="19" height="20" rx="3" fill="var(--c2)"/>
<text x="141" y="44" font-size="11" fill="var(--text)" font-family="var(--font-ui)">650ms</text>
<text x="10" y="104" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="start">100 token</text>
<rect x="100" y="90" width="12" height="20" rx="3" fill="var(--c1)"/><rect x="112" y="90" width="96" height="20" rx="3" fill="var(--c2)"/>
<text x="218" y="104" font-size="11" fill="var(--text)" font-family="var(--font-ui)">2.250ms</text>
<text x="10" y="164" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="start">300 token</text>
<rect x="100" y="150" width="12" height="20" rx="3" fill="var(--c1)"/><rect x="112" y="150" width="288" height="20" rx="3" fill="var(--c2)"/>
<text x="410" y="164" font-size="11" fill="var(--text)" font-family="var(--font-ui)">6.250ms</text>
<g font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">
<rect x="100" y="196" width="12" height="12" fill="var(--c1)"/><text x="118" y="206">TTFT 250ms (tetap)</text>
<rect x="230" y="196" width="12" height="12" fill="var(--c2)"/><text x="248" y="206">decode: 20ms × jumlah token (tumbuh)</text>
</g>
<text x="240" y="232" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">komposisi latensi vs panjang respons — TTFT 250ms, TPOT 20ms/token</text>
</svg>`;

export const llmops15: V2Lesson = {
  slug: "llmops15-latency-slo",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps15 — Latency SLO & Capacity Planning: TTFT, TPOT & Berapa GPU?",
  estMinutes: 52,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Demo day yang mati di detik ke-9",
      prose: [
        "Kamis, 09:40. Ruang board lantai 22 sebuah bank di Jakarta. Empat puluh eksekutif menatap layar. Di panggung, tim AI PayNova — startup yang enam bulan membangun asisten CS berbasis LLM — mempersilakan direktur utama mencoba chatbot mereka. Beliau mengetik: `berapa sisa limit kartu kredit saya?` Kursor berkedip. Satu detik. Tiga detik. Lima detik. Di detik ke-9,2 jawaban muncul — benar, sopan, lengkap. Ruangan itu sudah terlanjur dingin.",
        "Postmortem-nya pahit karena datanya `baik-baik saja`. Dashboard tim menunjukkan latensi RATA-RATA 2,1 detik — di bawah SLO 4 detik yang mereka tetapkan. Tapi tidak ada yang memisah latensi menjadi dua komponen: TTFT (time to first token — berapa lama token PERTAMA muncul) dan TPOT (time per output token — kecepatan token-token berikutnya mengalir). Dan tidak ada yang menghitung kapasitas dengan benar: mereka tahu server `mampu 5 request per detik`, tapi tidak tahu bahwa 5 RPS × 3 detik latensi = 15 request yang harus hidup BERSAMAAN.",
        "Yang sebenarnya terjadi: TTFT mereka 400ms (bagus!), tapi TPOT 35ms × 250 token = 8,75 detik decode untuk jawaban panjang. Rata-rata 2,1 detik menutupi ekor distribusi: p95 mereka 4,6 detik — artinya 1 dari 20 pelanggan menunggu lebih dari 4,6 detik. Demo day hanya butuh SATU pelanggan sial untuk membunuh kepercayaan ruangan. Lesson ini membangun dua alat yang seharusnya mereka punya: bedah latensi TTFT/TPOT dan capacity planning dengan Little's Law.",
        "Prasyarat ringkas (dari LLMOps13, 2 kalimat): inference LLM = kirim prompt ke server GPU, server mengembalikan token. Prompt diproses sekaligus dalam fase prefill (cepat, compute-bound), lalu token keluar satu per satu dalam fase decode (lambat, memory-bound). Lesson ini menjawab: berapa LAMA tiap fase itu, dan berapa GPU yang kamu butuhkan untuk traffic-mu.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mendefinisikan TTFT dan TPOT serta menghitung latensi total dari keduanya; (2) menjelaskan tradeoff latency-vs-throughput saat concurrency dinaikkan; (3) menulis SLO latensi yang benar (p50/p95, bukan rata-rata); (4) menghitung kebutuhan concurrency dan jumlah GPU dengan Little's Law; (5) memilih antara pay-per-token, provisioned throughput, dan autoscaling. Durasi 52 menit · 3 lab · 8 kuis · 1 chart · 1 mini-case. Daftar isi: 1) Cerita PayNova · 2) TTFT vs TPOT · 3) Tradeoff latency-throughput · 4) Lab: simulator kapasitas · 5) Sizing & autoscaling · 6) Peta keputusan · 7) Mini-case: hitungan PayNova · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Latensi rata-rata 2 detik = aman`",
        type: "pitfall",
        body: "Rata-rata adalah pembohong yang sopan. Distribusi latensi LLM berekor panjang: 90% request 1,5 detik, 10% request 8 detik → rata-rata 2,15 detik terlihat aman, tapi 1 dari 10 pelangganmu menderita. SLO profesional ditulis di persentil: `p95 < 4 detik` artinya 95% request harus di bawah 4 detik. PayNova lolos rata-rata dan gagal di demo — karena demo tidak peduli rata-rata.",
      },
      reference: "PayNova: rata-rata 2,1 dtk lolos SLO, p95 4,6 dtk membunuh demo. Ukur ekor, bukan tengah.",
    },
    {
      id: "ttft-tpot",
      eyebrow: "Langkah 2 · Konsep",
      title: "TTFT dan TPOT: dua mesin dalam satu request",
      prose: [
        "Setiap request LLM menjalani DUA fase dengan fisika yang berbeda. Fase PREFILL: seluruh prompt (mis. 2.000 token) diproses SEKALIGUS dalam satu komputasi matriks besar — GPU bekerja penuh, compute-bound, selesai dalam ratusan milidetik. Fase DECODE: token dikeluarkan SATU PER SATU; setiap token mengharuskan GPU membaca SELURUH bobot model dari memori — memory-bound, lambat, berulang N kali untuk N token.",
        "Dari sinilah lahir dua metrik baku industri (definisi dari dokumentasi benchmark Databricks yang menjadi sumber lesson ini). TTFT — Time To First Token: waktu dari request dikirim sampai token PERTAMA muncul = waktu prefill + overhead. Ini yang dirasakan user sebagai `aplikasinya responsif atau lemot`. TPOT — Time Per Output Token: waktu rata-rata ANTAR token selama decode = seberapa cepat teks `mengalir` setelah mulai. User merasakan TPOT sebagai kecepatan mengetiknya AI.",
        "Rumus totalnya sederhana dan wajib dihafal: Latency = TTFT + TPOT × (jumlah token output). Contoh PayNova: TTFT 400ms + 35ms × 250 token = 400 + 8.750 = 9.150ms ≈ 9,2 detik — persis angka demo day. Perhatikan asimetrinya: TTFT hanya 4% dari total! Tim yang mengoptimasi prefill selama 3 bulan (400ms → 200ms) hanya memangkas 2% latensi — mereka mengoptimasi komponen yang salah karena tidak pernah memisahnya. Catatan ketelitian: rumus ×N ini aproksimasi standar industri — secara ketat ada N−1 jeda antar-token setelah token pertama, jadi rumus eksak TTFT + TPOT×(N−1) = 400 + 35×249 = 9.115ms; selisih satu TPOT (35ms, 0,4%) tidak mengubah keputusan apa pun di lesson ini.",
        "Diagnosis dua menit: kalau user mengeluh `lama munculnya` → masalahmu TTFT (prefill lambat: prompt terlalu panjang, KV-cache penuh, GPU kecil). Kalau user mengeluh `teksnya tersendat-sendat` → masalahmu TPOT (decode lambat: batch terlalu besar, memory bandwidth jenuh). Obat yang salah untuk diagnosis yang salah = nol perbaikan + tiga bulan terbuang.",
        "Satu kalimat kunci untuk dibawa pulang: TTFT ditentukan oleh PANJANG PROMPT, TPOT ditentukan oleh PANJANG RESPONS — jadi ringkas prompt untuk responsivitas, batasi max_tokens untuk kelancaran.",
      ],
      formula: String.raw`L = T_{TTFT} + T_{TPOT} \times N`,
      formulaNote: "L = latensi total; T_TTFT = time to first token (prefill + overhead); T_TPOT = waktu per token decode; N = jumlah token output. Contoh: 400ms + 35ms × 250 = 9.150ms (aproksimasi standar; eksak 400 + 35×249 = 9.115ms). Ingat: TTFT ~ f(panjang prompt), TPOT ~ f(panjang respons).",
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: restoran cepat saji",
        body: "TTFT = waktu dari kamu pesan sampai burger PERTAMA di nampan (dapur memproses seluruh pesanan sekaligus = prefill). TPOT = jeda antar burger berikutnya keluar (satu per satu = decode). Restoran bisa cepat menyajikan pesanan pertama tapi lambat menyelesaikan 10 burger — dua kecepatan yang berbeda, dua masalah yang berbeda, dua solusi yang berbeda.",
      },
      reference: "Latency = TTFT + TPOT × N (aproksimasi standar; eksak ×(N−1)). TTFT ~ panjang prompt; TPOT ~ panjang respons.",
    },
    {
      id: "tradeoff",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tradeoff abadi: latency vs throughput",
      prose: [
        "GPU yang sama bisa melayani SATU request dengan sangat cepat, atau BANYAK request sekaligus dengan total token per detik yang jauh lebih besar — tapi tidak bisa keduanya sekaligus. Inilah tradeoff yang didokumentasikan Databricks: pada beban concurrency RENDAH, latensi berada di titik terendah; naikkan beban request, latensi ikut naik, TAPI throughput (token per detik) juga naik — karena memproses dua request `senilai token` memakan waktu kurang dari dua kali lipat.",
        "Mekanismenya: continuous batching. Server tidak menunggu request A selesai sebelum memulai B; ia menggabungkan token-token dari banyak request dalam satu langkah GPU. Batch yang lebih besar = utilisasi GPU lebih tinggi = token/detik naik. Harganya: request A harus `berbagi` GPU dengan B, C, D — TPOT-nya naik. Kamu menukar kecepatan per-request dengan volume total.",
        "Implikasinya adalah keputusan desain, bukan parameter tuning: kasus LOW LATENCY (chatbot real-time, asisten suara) → kirim SEDIKIT request konkuren per GPU, jaga latensi rendah, terima throughput per GPU yang kecil (artinya: butuh LEBIH BANYAK GPU untuk RPS yang sama). Kasus HIGH THROUGHPUT (batch summarization semalam, embedding massal) → jenuhkan endpoint dengan concurrency tinggi; latensi per request boleh naik 3x karena tidak ada manusia yang menunggu.",
        "Kontrol utamanya ada di tanganmu: JUMLAH REQUEST PARALEL yang diizinkan masuk ke sistem (max concurrency / max_num_seqs di vLLM). Terlalu kecil = GPU menganggur, tagihan per token mahal. Terlalu besar = antrean menumpuk, p95 meledak, SLO jebol. Capacity planning = mencari angka ini dengan data, bukan firasat — dan itulah lab berikutnya.",
        "Catatan anti-tumpang-tindih: MLOps7 membahas capacity planning untuk model ML klasik (batch training, CPU). Di sini konteksnya spesifik LLM serving: arsitektur dua-fase prefill/decode, TTFT/TPOT, dan continuous batching — hewan yang sama sekali berbeda.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Tambah GPU = latensi turun`",
        type: "pitfall",
        body: "Menambah GPU menaikkan KAPASITAS (RPS yang bisa ditangani), bukan menurunkan latensi per request — latensi satu request ditentukan TTFT/TPOT, bukan jumlah GPU menganggur. Kalau p95-mu 4,6 detik karena TPOT 35ms — dan antrean sudah bukan penyebabnya (sistem tidak jenuh, p95 murni waktu layanan) — menambah 10 GPU tetap menghasilkan p95 4,6 detik, hanya tagihan yang naik. Sebaliknya bila p95 membengkak karena antrean, tambah GPU justru menurunkan p95 karena antrean menyusut. Obati penyebabnya: kecilkan batch, percepat decode, atau batasi panjang respons.",
      },
      reference: "Concurrency rendah → latensi minimal. Concurrency tinggi → throughput maksimal. Pilih sesuai kasus.",
    },
    {
      id: "lab-kapasitas",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: simulator antrean & Little's Law",
      prose: [
        "SIMULASI — jujur: lab ini mensimulasikan ANTRIAN server (kedatangan deterministik, 3 slot paralel, waktu layanan = TTFT + TPOT × token) dalam Python murni. Ini BUKAN vLLM asli — tidak ada GPU yang berjalan — melainkan laboratorium untuk merasakan bagaimana antrean terbentuk SEBELUM kamu membayar $4/jam per GPU.",
        "Skenario: endpoint dengan TTFT 250ms, TPOT 20ms/token. 200 request tiba tiap 1.000ms (1 RPS), panjang respons 50–199 token (deterministik). Server hanya bisa memproses 3 request bersamaan — request ke-4 harus MENUNGGU. Tugasmu: implementasikan rumus latensi, statistik persentil, simulasi antrean FIFO, lalu Little's Law untuk sizing.",
        "Cara membaca: `latency_rata2` vs `p50` vs `p95` — perhatikan GAP antara rata-rata dan p95 (itulah ekor yang membunuh demo PayNova). `dalam_SLO_4s` = % request di bawah 4 detik. `antre_max` = waktu tunggu terburuk. `concurrency_20qps=60` adalah Little's Law: 20 request/detik × 3 detik = 60 request harus hidup bersamaan — inilah angka yang TIDAK dimiliki PayNova saat demo.",
        "Coba eksplorasi: ubah ARR_MS 1000 → 700 (traffic naik 43%). Perhatikan antre_max dan dalam_SLO_4s runtuh — inilah yang terjadi saat promo tanpa autoscaling. Lalu kembalikan dan ubah PARALLEL 3 → 5: p95 membaik, tapi hitung GPU tambahannya. Inilah tradeoff langkah 3 dalam angka.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `response_latency_ms(n)` = TTFT + TPOT × n, dan `pct(xs, q)` (persentil)" },
        { id: "t2", text: "Implementasikan `simulate()` — antrean FIFO dengan 3 slot paralel" },
        { id: "t3", text: "Implementasikan `required_concurrency` (Little's Law) + `gpu_needed`, jalankan agregasi" },
      ],
      expected: "latency_rata2=2896ms p50=2930ms p95=4630ms · dalam_SLO_4s=83.0% antre_max=780ms · throughput=124.3 tok/s · concurrency_20qps=60 gpu_untuk_20qps=8 gpu_untuk_5qps=2",
      note: {
        title: "💡 Intuisi: Little's Law = hukum kasir supermarket",
        body: "Rata-rata pelanggan di toko = (pelanggan datang per menit) × (menit tiap pelanggan di kasir). 20 pelanggan/menit × 3 menit = 60 orang mengantre — kamu butuh kasir untuk 60 orang, bukan untuk 20. Sama persis: concurrency = QPS × latensi. PayNova tahu QPS-nya tapi tidak pernah mengalikannya dengan latensi.",
      },
      hints: [
        "response_latency_ms: TTFT_MS + TPOT_MS * n_tokens.",
        "pct: urutkan, ambil indeks int(q/100 * len) — bukan rata-rata.",
        "simulate: server = [0.0]*PARALLEL (waktu selesai tiap slot); mulai = max(tiba, min(server)); selesai = mulai + layanan; update server[server.index(min(server))] = selesai; kembalikan (lats, waits, total_tokens, max(server)/1000).",
        "required_concurrency: qps * avg_latency_s. gpu_needed: ceil(concurrency / per_gpu) — import math di dalam fungsi boleh.",
      ],
      code: {
        starter: `TTFT_MS = 250.0\nTPOT_MS = 20.0\nPARALLEL = 3\nARR_MS = 1000\nN = 200\n\ndef tokens(rid):\n    return 50 + (rid * 37) % 150\n\n# TULIS KODEMU: response_latency_ms, pct, simulate, required_concurrency, gpu_needed\ndef response_latency_ms(n_tokens):\n    ...\n\ndef pct(xs, q):\n    ...\n\ndef simulate():\n    ...\n\ndef required_concurrency(qps, avg_latency_s):\n    ...\n\ndef gpu_needed(qps, avg_latency_s, per_gpu):\n    ...\n\n# AGREGASI (jangan ubah)\nlats, waits, total_tokens, makespan_s = simulate()\np50, p95 = pct(lats, 50), pct(lats, 95)\nslo_ok = sum(1 for x in lats if x <= 4000) / N * 100\ntps = total_tokens / makespan_s\nprint(f"latency_rata2={sum(lats) / N:.0f}ms p50={p50:.0f}ms p95={p95:.0f}ms")\nprint(f"dalam_SLO_4s={slo_ok:.1f}% antre_max={max(waits):.0f}ms")\nprint(f"throughput={tps:.1f} tok/s makespan={makespan_s:.0f}s")\nprint(f"concurrency_20qps={required_concurrency(20, 3.0):.0f}")\nprint(f"gpu_untuk_20qps={gpu_needed(20, 3.0, 8)}")\nprint(f"gpu_untuk_5qps={gpu_needed(5, 3.0, 8)}")`,
        lockLines: 9,
        solution: `TTFT_MS = 250.0\nTPOT_MS = 20.0\nPARALLEL = 3\nARR_MS = 1000\nN = 200\n\ndef tokens(rid):\n    return 50 + (rid * 37) % 150\n\n# TULIS KODEMU: response_latency_ms, pct, simulate, required_concurrency, gpu_needed\ndef response_latency_ms(n_tokens):\n    return TTFT_MS + TPOT_MS * n_tokens\n\ndef pct(xs, q):\n    s = sorted(xs)\n    return s[min(len(s) - 1, int(q / 100.0 * len(s)))]\n\ndef simulate():\n    finish = [0.0] * PARALLEL\n    lats, waits = [], []\n    total_tokens = 0\n    for rid in range(N):\n        arr = rid * ARR_MS\n        tok = tokens(rid)\n        svc = response_latency_ms(tok)\n        start = max(arr, min(finish))\n        waits.append(start - arr)\n        end = start + svc\n        finish[finish.index(min(finish))] = end\n        lats.append(end - arr)\n        total_tokens += tok\n    return lats, waits, total_tokens, max(finish) / 1000.0\n\ndef required_concurrency(qps, avg_latency_s):\n    return qps * avg_latency_s\n\ndef gpu_needed(qps, avg_latency_s, per_gpu):\n    import math\n    return math.ceil(required_concurrency(qps, avg_latency_s) / per_gpu)\n\n# AGREGASI (jangan ubah)\nlats, waits, total_tokens, makespan_s = simulate()\np50, p95 = pct(lats, 50), pct(lats, 95)\nslo_ok = sum(1 for x in lats if x <= 4000) / N * 100\ntps = total_tokens / makespan_s\nprint(f"latency_rata2={sum(lats) / N:.0f}ms p50={p50:.0f}ms p95={p95:.0f}ms")\nprint(f"dalam_SLO_4s={slo_ok:.1f}% antre_max={max(waits):.0f}ms")\nprint(f"throughput={tps:.1f} tok/s makespan={makespan_s:.0f}s")\nprint(f"concurrency_20qps={required_concurrency(20, 3.0):.0f}")\nprint(f"gpu_untuk_20qps={gpu_needed(20, 3.0, 8)}")\nprint(f"gpu_untuk_5qps={gpu_needed(5, 3.0, 8)}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "p50=2930ms p95=4630ms", msg: "p50 harus 2930ms dan p95 4630ms — cek rumus latensi dan indeks persentil.", pattern: "p50=2930ms p95=4630ms" },
          { kind: "stdout_matches", task: "t3", label: "SLO 83.0% & antre 780ms", msg: "dalam_SLO_4s harus 83.0% dan antre_max 780ms — cek logika antrean FIFO.", pattern: "dalam_SLO_4s=83\\.0% antre_max=780ms" },
          { kind: "stdout_matches", task: "t3", label: "throughput 124.3 tok/s", msg: "Throughput harus 124.3 tok/s — cek total token dan makespan.", pattern: "throughput=124\\.3 tok/s" },
          { kind: "stdout_matches", task: "t3", label: "Little's Law: 60", msg: "concurrency_20qps harus 60 (20 × 3.0) — Little's Law: QPS × latensi.", pattern: "concurrency_20qps=60" },
          { kind: "stdout_matches", task: "t3", label: "GPU: 8 dan 2", msg: "gpu_untuk_20qps harus 8 dan gpu_untuk_5qps harus 2 — ceil(concurrency / per_gpu).", pattern: "gpu_untuk_20qps=8" },
          { kind: "stdout_matches", task: "t3", label: "GPU 5qps = 2", msg: "gpu_untuk_5qps harus 2 (ceil(15/8)).", pattern: "gpu_untuk_5qps=2" },
        ],
      },
      reference: "Simulasi antrean (bukan vLLM asli). p95 4630ms > rata-rata 2896ms: ekornya yang berbahaya.",
    },
    {
      id: "sizing",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Sizing produksi: dari QPS ke jumlah GPU",
      prose: [
        "Resep sizing empat langkah yang dipakai tim serving profesional. LANGKAH 1 — ukur latensi per komponen: jalankan benchmark beban (tool seperti guidellm atau skrip Locust) pada SATU replika, catat TTFT, TPOT, dan p50/p95 pada beberapa titik concurrency. Tanpa angka ini, semua perhitungan adalah ramalan cuaca.",
        "LANGKAH 2 — Little's Law: Required Concurrency = Target QPS × Rata-rata Latensi (detik). Contoh Databricks: target 100 QPS dengan latensi rata-rata 200ms → 100 × 0,2 = 20 request harus hidup bersamaan. Inilah `ukuran antrean` yang harus ditampung sistemmu setiap detik.",
        "LANGKAH 3 — bagi dengan kapasitas per GPU: ukur dari benchmark langkah 1 berapa concurrency yang bisa ditangani satu GPU sambil menjaga p95 dalam SLO (mis. 8). Jumlah GPU = ceil(Required Concurrency / per_gpu). Contoh: 60 / 8 = 7,5 → 8 GPU. Selalu bulatkan ke atas DAN tambah buffer 20–30% untuk spike — antrean yang jenuh tidak `melambat sedikit`, ia runtuh eksponensial.",
        "LANGKAH 4 — pilih model konsumsi. PAY-PER-TOKEN (serverless): nol operasi, bayar per token, tapi latensi berekor (cold start, noisy neighbor) dan mahal di volume besar — untuk dev, eksperimen, traffic rendah. PROVISIONED THROUGHPUT (dedicated GPU, SLA): latensi dapat diprediksi, compliance terjaga (data tidak campur), tapi bayar kapasitas menganggur — untuk produksi dengan SLO ketat. AUTOSCALING: min concurrency untuk baseline (tanpa antre), max untuk spike (kendali biaya); scale-up cepat saat antrean tumbuh, scale-down saat sepi. Databricks merekomendasikan provisioned untuk mayoritas workload produksi — terutama model fine-tuned.",
        "Dua peringatan operasional: (1) autoscaling BUKAN sihir — scale-up butuh menit (loading model puluhan GB ke GPU), jadi spike 10x dalam 30 detik tetap mengantre; gabungkan dengan rate limiting dan degradasi anggun. (2) Ukur ULANG setelah tiap perubahan: ganti max_tokens, ganti model, naikkan batch — semua angka langkah 1–3 kadaluarsa. Capacity planning adalah kebiasaan, bukan dokumen sekali tulis.",
      ],
      figure: {
        svg: FIG_TTFT_TPOT,
        alt: "Komposisi latensi: TTFT 250ms tetap, decode 20ms per token tumbuh dengan panjang respons.",
        caption: "Cara membaca: tiap batang = satu respons; segmen gelap = TTFT (tetap 250ms), segmen terang = decode (20ms × token). Interpretasi: pada 20 token TTFT mendominasi (38% dari total) — optimasi prefill berarti. Pada 300 token decode mendominasi 96% — optimasi prefill nyaris tak terasa; batasi panjang respons atau percepat decode. Inilah kenapa `rata-rata latensi` tanpa memisah komponen menyesatkan: dua request dengan total sama bisa punya penyakit berbeda.",
      },
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Under-provisioning saat spike = antrean eksponensial = timeout massal = SLA breach + penalti kontrak. Over-provisioning kronis = GPU menganggur $4/jam × 24 × 30 = $2.880/bulan per GPU yang tidak bekerja. Capacity planning yang buruk adalah risiko finansial dua arah — SLO di satu sisi, tagihan di sisi lain. Buffer 20–30% + autoscaling adalah kompromi standarnya.",
      },
      reference: "QPS × latensi = concurrency. Bagi per-GPU, ceil, +buffer. Ukur ulang tiap ada perubahan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Pola mana untuk workload-mu?",
      prose: [
        "**Skenario 1 — Chatbot CS real-time, SLO p95 < 2 detik.** → Ukur TTFT & TPOT terpisah; jaga concurrency per GPU rendah; provisioned throughput; autoscale min cukup untuk baseline. Jangan: kejar throughput per GPU (p95-mu yang mati).",
        "**Skenario 2 — Batch: 1 juta dokumen diringkas tiap malam, tidak ada manusia menunggu.** → Maksimalkan throughput: concurrency tinggi, batch besar, terima TPOT naik 3x. Spot/preemptible GPU boleh. Jangan: provisioned mahal untuk workload yang toleran latensi.",
        "**Skenario 3 — Traffic spiky (promo, gajian, viral).** → Autoscaling dengan min = baseline + 20%, max = kendali biaya; rate limit + antrean berbatas; degradasi anggun (jawaban singkat saat padat). Jangan: andalkan scale-up instan — loading model butuh menit.",
        "**Skenario 4 — Dev/eksperimen, traffic < 1 QPS.** → Pay-per-token serverless. Nol operasi, nol GPU menganggur. Pindah ke provisioned saat tagihan bulanan > biaya 1 GPU dedicated.",
        "**Skenario 5 — Model fine-tuned / data regulasi (bank, kesehatan).** → Provisioned throughput dedicated: latensi terprediksi + isolasi data. Jangan: serverless campur (noisy neighbor + jejak compliance kabur).",
        "Aturan praktis 10 detik: `Ada manusia menunggu?` → optimasi p95, provisioned. `Tidak ada yang menunggu?` → maksimalkan throughput, batch. `Traffic naik-turun?` → autoscale + buffer. `Belum tahu polanya?` → benchmark dulu di 1 GPU, baru kalikan.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: jalan tol vs jalan desa",
        body: "Provisioned throughput = jalan tol: bayar mahal, kecepatan terjamin, tidak macet. Pay-per-token = jalan umum: murah saat sepi, macet saat semua orang lewat. Autoscaling = membuka-tutup gerbang tol mengikuti arus. Pilih berdasarkan siapa yang `menyetir` di atasnya: manusia yang tidak sabar, atau batch job yang sabar.",
      },
      reference: "Manusia menunggu → p95 + provisioned. Batch → throughput. Spiky → autoscale + buffer.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Hitungan PayNova: dari 9,2 detik ke berapa GPU?",
      prose: [
        "PayNova pasca-demo: target 20 QPS, SLO p95 < 4 detik. Benchmark 1 GPU: TTFT 250ms, TPOT 20ms/token, respons rata-rata 130 token → latensi rata-rata = 250 + 20 × 130 = 2.850ms ≈ 2,85 detik. Satu GPU menjaga p95 < 4 detik sampai 8 request konkuren.",
        "Hitung: (a) required concurrency; (b) jumlah GPU; (c) berapa traffic yang bisa ditangani 8 GPU itu sebelum p95 jebol; (d) strategi autoscaling. **Pembahasan:** (a) Little's Law: 20 × 2,85 = 57 → 57 request hidup bersamaan. (b) ceil(57 / 8) = 8 GPU (7,125 → 8; tanpa buffer). Dengan buffer 25%: 57 × 1,25 = 71,25 → ceil(71,25/8) = 9 GPU. (c) 8 GPU × 8 = 64 concurrency / 2,85 detik ≈ 22,5 QPS — di atas itu antrean tumbuh dan p95 jebol; inilah `kapasitas asli` mereka. (d) Autoscale min 9 GPU (baseline + buffer), max 14 GPU (kendali biaya); alert saat concurrency > 60 selama 2 menit; rate limit + respons singkat sebagai degradasi anggun.",
        "Biaya: 9 GPU × $4/jam × 730 jam ≈ $26.280/bulan. Bandingkan dengan biaya demo yang gagal: satu kontrak bank yang hilang. Capacity planning bukan biaya — ia asuransi yang bisa dihitung.",
        "Pelajaran demo day dalam satu kalimat: mereka tidak kekurangan GPU — mereka kekurangan PERKALIAN (QPS × latensi).",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Angka (c) — 22,5 QPS — adalah `batas patah` yang harus ditempel di dashboard dan diuji tiap rilis (load test). Tim yang tidak tahu batas patahnya akan menemukannya dengan cara yang paling mahal: di depan pelanggan. Chaos engineering untuk LLM serving = uji spike 2x tiap bulan, bukan sekali setahun.",
      },
      reference: "20 QPS × 2,85 dtk = 57 concurrency → 9 GPU (+buffer). Batas patah: 22,5 QPS.",
    },
    {
          id: "gap-r9-kv-cache-sizing",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P7-G5)",
          title: "KV-cache sizing: concurrency = fungsi VRAM",
          prose: [
            "Langkah 5 menghitung GPU dari QPS × latensi — tetapi belum menyebut BATAS yang paling sering menjerat serving LLM: KV-cache. Setiap request yang hidup menyimpan Key-Value untuk SEMUA token konteksnya di VRAM GPU. KV per token = 2 (K + V) × jumlah layer × hidden size × byte per angka. Bila VRAM habis, request baru tidak bisa masuk — concurrency-mu dibatasi MEMORI, bukan komputasi.",
            "Contoh angka (model 32 layer, hidden 4.096, FP16 = 2 byte): KV per token = 2 × 32 × 4.096 × 2 = 524.288 byte ≈ 0,5 MB/token. Request dengan konteks 2.048 token → 524.288 × 2.048 = 1.073.741.824 byte = 1.024 MB ≈ 1 GB. Dengan 40 GB VRAM yang dialokasikan untuk KV-cache → concurrency maks = 40 GB / 1 GB = 40 request bersamaan. Naikkan konteks ke 8.192 token → per-request 4 GB → concurrency jatuh ke 10. Konteks panjang MEMAKAN concurrency.",
            "Tiga tuas bila KV-cache menjadi bottleneck: (1) KUANTISASI KV (FP8/INT8 — setengah byte per token, concurrency naik ~2× dengan sedikit penurunan kualitas); (2) PREFIX CACHING (konteks awal yang sama dipakai ulang — lihat gap tuas TPOT); (3) PAGEDATTENTION (alokasi KV per blok, bukan per request penuh — mengurangi fragmentasi). Aturan: hitung KV DULU sebelum menambah GPU — GPU tambahan tidak membantu bila tiap GPU kehabisan KV-cache di concurrency 10.",
          ],
          formula: String.raw`\text{KV/token} = 2 \times L \times H \times b \qquad \text{conc}_{maks} = \frac{\text{VRAM}_{KV}}{\text{token} \times \text{KV/token}}`,
          formulaNote: "KV-cache: per token = 2 × layer × hidden × byte. Contoh angka: 32 layer × 4.096 × FP16 → 524.288 byte/token; konteks 2.048 → 1.024 MB (≈1 GB)/request; 40 GB VRAM → concurrency maks 40. Konteks panjang memakan concurrency.",
          tasks: [
            { id: "t1", text: "Hitung `per_token` (byte) dan `per_req_mb` (konteks 2.048)" },
            { id: "t2", text: "Hitung `conc` (VRAM KV 40 GB) dan cetak ketiganya" },
          ],
          expected: "per_token=524288 per_req_MB=1024 conc=40",
          hints: [
            "per_token = 2 × layer × hidden × byte.",
            "per_req_mb = per_token × ctx // (1024 × 1024).",
          ],
          code: {
            starter: `layers, hidden, byte = 32, 4096, 2\nvram_kv_gb, ctx = 40, 2048\n\n# TULIS KODEMU: KV/token, KV/request, concurrency maks\nper_token = \nper_req_mb = \nconc = \n\nprint(f"per_token={per_token} per_req_MB={per_req_mb} conc={conc}")`,
            lockLines: 4,
            solution: `layers, hidden, byte = 32, 4096, 2\nvram_kv_gb, ctx = 40, 2048\n\n# TULIS KODEMU: KV/token, KV/request, concurrency maks\nper_token = 2 * layers * hidden * byte\nper_req_mb = per_token * ctx // (1024 * 1024)\nconc = vram_kv_gb * 1024 // per_req_mb\n\nprint(f"per_token={per_token} per_req_MB={per_req_mb} conc={conc}")`,
            checks: [
              { kind: "equal", task: "t1", name: "per_token", value: 524288, label: "`per_token` seharusnya 524.288", msg: "2 × 32 × 4.096 × 2 = 524.288 byte." },
              { kind: "equal", task: "t1", name: "per_req_mb", value: 1024, label: "`per_req_mb` seharusnya 1.024", msg: "524.288 × 2.048 / 1.048.576 = 1.024 MB." },
              { kind: "equal", task: "t2", name: "conc", value: 40, label: "`conc` seharusnya 40", msg: "40 GB / 1 GB = 40." },
              { kind: "stdout_matches", task: "t2", pattern: "per_token=524288\\s+per_req_MB=1024\\s+conc=40", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Konteks request naik dari 2.048 ke 8.192 token, VRAM KV tetap 40 GB. Concurrency maks?",
              options: [
                { text: "Turun 40 → 10 — KV per request naik 4×, concurrency jatuh 4×", why: "Benar: concurrency = VRAM / (token × KV/token); konteks 4× = concurrency ¼.", correct: true },
                { text: "Tetap 40 — concurrency ditentukan QPS, bukan konteks", why: "Salah: QPS × latensi memberi concurrency yang DIBUTUHKAN; KV-cache memberi concurrency yang MUNGKIN." },
                { text: "Naik ke 160 — konteks panjang = batching lebih efisien", why: "Salah: konteks panjang memakan KV-cache lebih banyak, bukan lebih sedikit." },
              ],
            },
          ],
          reference: "KV/token = 2×L×H×b; conc = VRAM_KV / (token×KV/token); kuantisasi KV / prefix caching / PagedAttention.",
        },
    {
          id: "gap-r9-tuas-tpot",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P7-G6)",
          title: "Lima tuas TPOT: kuantisasi, speculative, chunked, prefix, tensor",
          prose: [
            "Langkah 2–3 mengajarkan diagnosis TTFT/TPOT — tetapi belum memberi OBAT konkret untuk TPOT. Lima tuas baku industri: (1) KUANTISASI INT8/FP8 — bobot 8-bit (bukan 16-bit): decode yang memory-bandwidth-bound jadi ~2× lebih cepat karena separuh byte yang dibaca; harga: sedikit penurunan kualitas (ukur!). (2) SPECULATIVE DECODING — model kecil (draft) menebak beberapa token, model besar memverifikasi sekaligus: bila tebakan benar, beberapa token per langkah, bukan satu. (3) CHUNKED PREFILL — prompt panjang dipotong jadi chunk: TTFT tidak lagi menunggu seluruh prefill (latensi pertama turun, throughput terjaga). (4) PREFIX CACHING — system prompt / konteks awal yang sama dipakai ulang dari KV-cache: prefill yang berulang tidak dihitung dua kali. (5) TENSOR PARALLEL — model dibagi ke beberapa GPU: membantu TTFT (prefill paralel) lebih dari TPOT (decode tetap serial).",
            "Contoh angka (TPOT baseline 35ms): INT8 (×0,6) → 35 × 0,6 = 21,0ms; tambah speculative decoding (×0,7) → 21 × 0,7 = 14,7ms — gabungan keduanya memangkas TPOT 58%. Perhatikan: pengali TIDAK selalu independen (INT8 + speculative bisa berinteraksi) — ukur kombinasi di workload-mu sendiri, jangan kalikan angka brosur.",
            "Aturan memilih: TPOT tinggi + batch besar → kuantisasi dulu (bandwidth). TPOT tinggi + batch kecil → speculative decoding (latensi per token). TTFT tinggi + prompt berulang → prefix caching. TTFT tinggi + prompt panjang sekali-pakai → chunked prefill. Semua tuas gagal + model terlalu besar untuk satu GPU → tensor parallel. Dan selalu: ukur SEBELUM dan SESUDAH di p95, bukan rata-rata (lihat Langkah 3).",
          ],
          formula: String.raw`T_{TPOT}' = T_{TPOT} \times f_{kuant} \times f_{spec} \times \cdots`,
          formulaNote: "Tuas TPOT: INT8/FP8 (×~0,6, bandwidth), speculative decoding (×~0,7, draft+verifikasi), chunked prefill (TTFT), prefix caching (prefill berulang), tensor parallel (TTFT, multi-GPU). Contoh angka: 35ms → INT8 21,0ms → +speculative 14,7ms (−58%). Pengali tidak selalu independen — ukur kombinasi.",
          tasks: [
            { id: "t1", text: "Hitung `int8` (35 × 0,6) dan `spec` (int8 × 0,7)" },
            { id: "t2", text: "Cetak keduanya" },
          ],
          expected: "int8=21.0 spec=14.7",
          hints: [
            "int8 = tpot × 0,6.",
            "spec = int8 × 0,7.",
          ],
          code: {
            starter: `tpot = 35.0\n\n# TULIS KODEMU: TPOT setelah INT8 (x0,6) lalu speculative (x0,7)\nint8 = \nspec = \n\nprint(f"int8={int8:.1f} spec={spec:.1f}")`,
            lockLines: 3,
            solution: `tpot = 35.0\n\n# TULIS KODEMU: TPOT setelah INT8 (x0,6) lalu speculative (x0,7)\nint8 = tpot * 0.6\nspec = int8 * 0.7\n\nprint(f"int8={int8:.1f} spec={spec:.1f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "int8", value: 21.0, tol: 0.01, label: "`int8` seharusnya 21,0", msg: "35 × 0,6 = 21,0." },
              { kind: "equal", task: "t1", name: "spec", value: 14.7, tol: 0.01, label: "`spec` seharusnya 14,7", msg: "21 × 0,7 = 14,7." },
              { kind: "stdout_matches", task: "t2", pattern: "int8=21.0\\s+spec=14.7", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "TPOT 35ms, batch besar, decode memory-bandwidth-bound. Tuas pertama yang dicoba?",
              options: [
                { text: "Kuantisasi INT8/FP8 — separuh byte dibaca per token", why: "Benar: decode yang bandwidth-bound membaik paling besar dari kuantisasi.", correct: true },
                { text: "Tensor parallel — bagi model ke 4 GPU", why: "Salah: tensor parallel membantu TTFT (prefill paralel) lebih dari TPOT yang serial." },
                { text: "Chunked prefill — potong prompt jadi chunk", why: "Salah: chunked prefill obat TTFT, bukan TPOT." },
              ],
            },
          ],
          reference: "INT8/FP8, speculative decoding, chunked prefill, prefix caching, tensor parallel — ukur p95 sebelum/sesudah.",
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
          q: "TTFT 300ms, TPOT 25ms/token, respons 200 token. Latensi total?",
          options: [
            { text: "325ms — TTFT + TPOT", why: "Kamu menjumlahkan tarifnya tapi lupa mengalikan TPOT dengan jumlah token. TPOT adalah tarif PER TOKEN, bukan biaya tetap." },
            { text: "5.300ms — 300 + 25 × 200", why: "Tepat: 300 + 5.000 = 5.300ms. Perhatikan 94% latensi ada di decode — mengoptimasi TTFT di sini hampir tidak terasa.", correct: true },
            { text: "200 × 25ms = 5.000ms — TTFT tidak dihitung", why: "TTFT selalu dihitung: prefill harus selesai sebelum token pertama keluar. Mengabaikannya = meremehkan 300ms setiap request." },
            { text: "300ms — yang penting token pertama", why: "TTFT hanya awal cerita. User menunggu SELURUH 200 token; 5 detik decode tidak hilang hanya karena token pertama cepat." },
          ],
        },
        {
          q: "User mengeluh `jawabannya tersendat-sendat, kata per kata lambat muncul`. Diagnosis?",
          options: [
            { text: "TTFT tinggi — prefill lambat", why: "TTFT hanya memengaruhi KAPAN teks mulai muncul, bukan kecepatannya setelah mulai. Gejala `tersendat` = aliran token, bukan start." },
            { text: "TPOT tinggi — decode lambat (batch besar / bandwidth jenuh)", why: "Tepat. Teks yang sudah mulai tapi mengalir lambat = TPOT. Obatnya: kecilkan batch/concurrency, percepat decode, atau batasi max_tokens.", correct: true },
            { text: "Prompt terlalu panjang", why: "Prompt panjang menaikkan TTFT (prefill), bukan kecepatan aliran token. Gejalanya akan `lama munculnya`, bukan `tersendat`." },
            { text: "Model terlalu besar — ganti yang kecil", why: "Prematur dan mahal. Diagnosis dulu dengan angka: ukur TPOT pada beberapa concurrency. Bisa jadi batch-mu saja yang kebesaran." },
          ],
        },
        {
          q: "Target 50 QPS, latensi rata-rata 1,2 detik. Required concurrency (Little's Law)?",
          options: [
            { text: "60 — 50 × 1,2", why: "Tepat: 50 request/detik × 1,2 detik = 60 request hidup bersamaan. Inilah angka kapasitas yang harus disediakan.", correct: true },
            { text: "50 — sama dengan QPS", why: "QPS tanpa dikali latensi = menghitung orang masuk pintu tanpa menghitung berapa lama mereka di dalam. 50 orang/detik × 1,2 detik = 60 orang di dalam." },
            { text: "41,7 — 50 / 1,2", why: "Terbalik. Pembagian dipakai untuk throughput per server (1/latensi), bukan untuk concurrency. Rumusnya perkalian: QPS × latensi." },
            { text: "1,2 — latensinya saja cukup", why: "Latensi saja tidak tahu volume. 1,2 detik untuk 1 QPS vs 50 QPS = kebutuhan kapasitas yang beda 50x lipat." },
          ],
        },
        {
          q: "Naikkan max concurrency per GPU dari 8 ke 32. Efek yang PALING mungkin?",
          options: [
            { text: "Latensi per request turun karena paralelisme", why: "Terbalik: 32 request berbagi GPU yang sama = tiap request dapat jatah compute lebih kecil = TPOT naik = latensi NAIK." },
            { text: "Throughput (token/detik) naik, tapi p95 latensi ikut naik", why: "Tepat — inilah tradeoff langkah 3. Batch lebih besar = utilisasi GPU naik, tapi tiap request antre lebih lama di dalam batch.", correct: true },
            { text: "TTFT turun karena prefill lebih efisien", why: "Prefill 32 request sekaligus justru lebih berat; TTFT cenderung naik, bukan turun. Batching membantu throughput, bukan responsivitas." },
            { text: "Tidak ada efek — GPU otomatis menyesuaikan", why: "GPU tidak punya autopilot kapasitas. Max concurrency adalah KAMU yang set; salah set = p95 jebol atau GPU menganggur." },
          ],
        },
        {
          q: "Startup dengan traffic 0,5 QPS, belum ada SLO ketat. Pilihan konsumsi TEPAT?",
          options: [
            { text: "Provisioned throughput 4 GPU sejak hari pertama", why: "4 GPU × $4 × 730 jam ≈ $11.680/bulan untuk 0,5 QPS = membakar uang. Provisioned untuk produksi bervolume, bukan eksperimen." },
            { text: "Pay-per-token serverless — pindah ke provisioned saat tagihan > biaya 1 GPU", why: "Tepat: nol operasi, nol kapasitas menganggur. Aturan pindahnya kuantitatif, bukan berdasarkan firasat.", correct: true },
            { text: "Beli GPU fisik sendiri — paling murah jangka panjang", why: "Capex + operasi + tidak elastis untuk startup yang polanya belum tahu. `Termurah jangka panjang` hanya benar bila utilisasinya tinggi dan stabil." },
            { text: "Gratis tier API publik tanpa batas", why: "Rate limit tier gratis akan mencekikmu tepat saat demo ke investor. Gratis = untuk prototipe, bukan rencana produksi." },
          ],
        },
        {
          q: "Setelah menaikkan max_tokens dari 500 ke 2.000, apa yang WAJIB dilakukan tim capacity?",
          options: [
            { text: "Tidak ada — max_tokens hanya batas, jarang tercapai", why: "Respons yang tadinya 300 token sekarang bisa 1.500 token: TPOT × token meledak, latensi rata-rata naik, angka sizing lama kadaluarsa." },
            { text: "Ukur ulang TTFT/TPOT/p95 dan hitung ulang concurrency + GPU", why: "Tepat: setiap perubahan yang memengaruhi panjang respons mengkadaluarsakan seluruh perhitungan langkah 1–3. Capacity planning adalah kebiasaan.", correct: true },
            { text: "Langsung tambah 2x GPU untuk jaga-jaga", why: "Menambah buta = bisa kurang (tetap jebol) atau lebih (bakar uang). Ukur dulu 30 menit, baru putuskan — data lebih murah dari GPU." },
            { text: "Turunkan temperature agar respons pendek", why: "Temperature mengatur keacakan, bukan panjang. Mengakali parameter yang salah untuk masalah kapasitas = dua masalah, nol solusi." },
          ],
        },
      ],
      summary: [
        "Latency = TTFT + TPOT × N (aproksimasi; eksak ×(N−1)): TTFT (prefill, ~panjang prompt) vs TPOT (decode, ~panjang respons) — diagnosis dimulai dari memisah keduanya.",
        "Tradeoff abadi: concurrency rendah → latensi minimal; concurrency tinggi → throughput maksimal. Pilih sesuai ada/tidaknya manusia yang menunggu.",
        "SLO ditulis di persentil (p95/p99), bukan rata-rata — rata-rata menyembunyikan ekor yang membunuh demo.",
        "Little's Law: Required Concurrency = QPS × latensi (detik); GPU = ceil(concurrency / kapasitas-per-GPU) + buffer 20–30%.",
        "Pay-per-token untuk eksperimen/traffic rendah; provisioned throughput untuk SLO ketat; autoscaling (min/max) untuk traffic spiky — scale-up butuh menit, bukan detik.",
        "Capacity planning adalah kebiasaan: ukur ulang TTFT/TPOT/p95 setiap kali model, max_tokens, atau batch berubah.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
