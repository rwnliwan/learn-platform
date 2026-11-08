import type { V2Lesson } from "../lib/types";

// Overhead per request (skala logaritmik): Bifrost 11us, Kong 2ms, LiteLLM 11.5ms, OpenRouter 37.5ms, RouteLLM 125ms.
const FIG_OVERHEAD = `<svg viewBox=\"0 0 480 240\" role=\"img\" aria-label=\"Overhead per request: Bifrost 11 mikrodetik, Kong 2ms, LiteLLM 11,5ms, OpenRouter 37,5ms, RouteLLM 125ms.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\"><line x1=\"150\" y1=\"20\" x2=\"150\" y2=\"215\"/><line x1=\"150\" y1=\"20\" x2=\"460\" y2=\"20\"/></g>
<g font-size=\"12\" fill=\"var(--text)\" font-family=\"var(--font-ui)\" text-anchor=\"end\"><text x=\"142\" y=\"44\">Bifrost</text><text x=\"142\" y=\"84\">Kong</text><text x=\"142\" y=\"124\">LiteLLM</text><text x=\"142\" y=\"164\">OpenRouter</text><text x=\"142\" y=\"204\">RouteLLM</text></g>
<rect x=\"150\" y=\"30\" width=\"17.0\" height=\"18\" rx=\"3\" fill=\"var(--c1)\"/><text x=\"175\" y=\"44\" font-size=\"11\" fill=\"var(--text)\" font-family=\"var(--font-ui)\">11µs</text>
<rect x=\"150\" y=\"70\" width=\"176.2\" height=\"18\" rx=\"3\" fill=\"var(--c2)\"/><text x=\"334\" y=\"84\" font-size=\"11\" fill=\"var(--text)\" font-family=\"var(--font-ui)\">2ms</text>
<rect x=\"150\" y=\"110\" width=\"229.7\" height=\"18\" rx=\"3\" fill=\"var(--c3)\"/><text x=\"387\" y=\"124\" font-size=\"11\" fill=\"var(--text)\" font-family=\"var(--font-ui)\">11,5ms</text>
<rect x=\"150\" y=\"150\" width=\"265.9\" height=\"18\" rx=\"3\" fill=\"var(--c4)\"/><text x=\"423\" y=\"164\" font-size=\"11\" fill=\"var(--text)\" font-family=\"var(--font-ui)\">37,5ms</text>
<rect x=\"150\" y=\"190\" width=\"302.7\" height=\"18\" rx=\"3\" fill=\"var(--c5)\"/><text x=\"460\" y=\"204\" font-size=\"11\" fill=\"var(--text)\" font-family=\"var(--font-ui)\" text-anchor=\"end\">125ms</text>
<text x=\"305\" y=\"232\" font-size=\"11\" fill=\"var(--text-muted)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">overhead per request (skala logaritmik) — data artikel benchmark 2026</text>
</svg>`;

export const llmops14: V2Lesson = {
  slug: "llmops14-smart-routing",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps14 — Smart Routing & Fallback antar Model/Provider: Model Murah Dulu, Fallback Saat Gagal",
  estMinutes: 48,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tagihan $40.000 dan malam ketika satu provider tumbang",
      prose: [
        "November 2025. FinPay, fintech pembayaran di Jakarta, menatap dashboard biaya AI dengan ngeri: $40.000 per bulan. Setiap request — dari klasifikasi tiket CS yang sepele (`tolong reset PIN saya`) sampai analisis fraud yang rumit — dikirim ke model frontier termahal: $10 per 1 juta token. `Kita membayar harga mobil sport untuk mengantar gorengan,` kata CTO Bima dalam rapat.",
        "Solusi Bima: pindahkan SEMUA request ke model termurah ($0,20 per 1 juta token). Tagihan anjlok jadi $800/bulan. Perayaan di Slack bertahan 19 hari. Jumat malam pukul 21:14, provider murah itu down 3 jam. Seluruh chatbot CS lumpuh — tidak ada provider cadangan, tidak ada rencana B, tidak ada yang tahu harus ngapain. Estimasi kerugian reputasi + refund: lebih besar dari penghematan setahun.",
        "Twist-nya: FinPay salah DUA KALI dengan cara yang berlawanan. Kesalahan pertama: `satu model untuk semua request` = membayar 50x lipat untuk pertanyaan sepele. Kesalahan kedua: `satu provider untuk semua request` = satu titik kegagalan yang mematikan. Solusinya bukan memilih antara mahal-aman vs murah-rapuh — melainkan LAPISAN CERDAS di tengah yang memutuskan PER REQUEST: yang sepele ke model murah, yang sulit ke model kuat, yang gagal dialihkan otomatis ke cadangan. Lapisan itu bernama smart routing — dan lesson ini membangunnya dari nol.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan arsitektur routing layer dan bedanya dengan panggilan API langsung; (2) merancang fallback chain dengan penyaringan tipe error (429 vs 500 vs 400); (3) menghitung penghematan tiering biaya-vs-kualitas dengan angka konkret; (4) membandingkan lima tool routing 2026 (Bifrost, LiteLLM, OpenRouter, Kong, RouteLLM) dari data benchmark artikel sumber; (5) memilih strategi routing untuk skenario produksi nyata.",
        "Durasi 48 menit · 1 lab simulasi · 6 kuis · 1 chart · 1 mini-case. Daftar isi: 1) Cerita FinPay · 2) Dua otak router: gateway vs learned · 3) Fallback chain & tipe error · 4) Lab: simulasi router · 5) Lima tool di arena 2026 · 6) Peta keputusan · 7) Mini-case: hitungan FinPay · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Model terbaik = pakai yang paling pintar untuk semua request`",
        type: "pitfall",
        body: "Kualitas terbaik dengan biaya 50x untuk pertanyaan `jam berapa sekarang` bukan kualitas — itu pemborosan. 70–80% request produksi tipikal (klasifikasi, ekstraksi, format) diselesaikan model murah dengan kualitas yang sama. Model frontier adalah senjata presisi, bukan palu untuk semua paku. (Ringkasan LLMOps6: token economics = biaya per 1K token × volume; lesson ini menjawab `bagaimana membayar lebih sedikit untuk volume yang sama`.)",
      },
      reference: "FinPay salah dua kali: satu model untuk semua (mahal) dan satu provider untuk semua (rapuh).",
    },
    {
      id: "dua-otak",
      eyebrow: "Langkah 2 · Konsep",
      title: "Dua otak router: Si Polisi Lalu Lintas dan Si Penilai Ujian",
      prose: [
        "Routing layer adalah proxy di antara aplikasimu dan para provider. Aplikasimu memanggil SATU endpoint (format OpenAI-compatible); router yang memutuskan model, provider, dan API key mana yang melayani — per request, per milidetik. Tanpa router, logika `coba provider A, kalau 429 coba B, kalau gagal coba C` menempel di kode bisnis — berantakan, tidak konsisten antar tim, dan setiap ganti provider = deploy ulang 14 microservice.",
        "Otak pertama: GATEWAY DETERMINISTIK — Si Polisi Lalu Lintas. Ia tidak `berpikir`, ia MENEGAKKAN ATURAN: `request dari tier premium → Anthropic; sisanya → model murah`; `bagi traffic 70/30 antar dua key agar tidak kena rate limit`; `kalau error rate provider A > 5% dalam 1 menit, alihkan semua ke B`. Contoh rajanya: Bifrost (open-source Go, Apache 2.0, dari Maxim AI) — overhead 11 mikrodetik pada 5.000 request/detik, aturan ditulis dalam CEL (Common Expression Language), load balancing adaptif yang memantau kesehatan provider, dan fallback chain otomatis. 11 mikrodetik = 0,011 milidetik = tidak terasa di samping inference yang 500ms.",
        "Otak kedua: LEARNED ROUTER — Si Penilai Ujian. Ia tidak ikut aturan tetap; ia MEMPREDIKSI kesulitan tiap prompt dengan model ML kecil (matrix factorization, BERT classifier — RouteLLM dari LMSYS/UC Berkeley), lalu mengirim yang mudah ke model lemah-murah dan yang sulit ke model kuat-mahal. Hasil risetnya: biaya inference turun >75% dengan kualitas 95% dari model kuat. Harganya: 50–200ms komputasi classifier per request + perilakunya probabilistik (bisa drift, tidak 100% auditable).",
        "Keduanya bukan lawan — mereka LAPISAN. Pola produksi yang sehat (dari artikel sumber): gateway deterministik di perimeter (mengatur failover, rate limit, budget, audit — cepat & pasti), learned router opsional di dalam (memutuskan tier model — cerdas & hemat). Gateway menjawab `apakah request ini lolos dan ke mana?`; learned router menjawab `seberapa sulit prompt ini?`. Jangan minta gateway menilai kesulitan; jangan minta learned router menangani 5.000 RPS.",
        "Matematika tiering: misal 70% request sepele (c=$0,0002), 20% sedang (c=$0,002), 10% sulit (c=$0,01) per request. Ekspektasi biaya = 0,7×0,0002 + 0,2×0,002 + 0,1×0,01 = $0,00154 vs $0,01 jika semua ke frontier = hemat 84,6%. Satu rumus ini = seluruh argumen bisnis smart routing.",
      ],
      formula: String.raw`E[C] = f_{c}\,c_{c} + f_{m}\,c_{m} + f_{s}\,c_{s}`,
      formulaNote: "E[C] = ekspektasi biaya per request; f_c, f_m, f_s = fraksi request ke model cheap/mid/strong (jumlah ketiganya = 1); c_c, c_m, c_s = biaya per request tiap tier. Contoh di atas: $0,00154 vs $0,01 = hemat 84,6%. Ubah f dengan mengubah policy — itulah tuasmu.",
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: router = memisahkan KEBIJAKAN dari KODE",
        body: "Sebelum router: `model = 'gpt-4o'` tertulis di 14 microservice — ganti model = 14 deploy. Sesudah router: 14 service memanggil satu endpoint; ganti model = ubah 1 aturan di dashboard. Kebijakan (siapa boleh apa, budget berapa) hidup di SATU tempat, bukan tersebar di kode. Inilah nilai yang tidak terlihat di benchmark: kecepatan organisasi.",
      },
      reference: "Gateway = polisi (aturan, cepat, pasti). Learned router = penilai (ML, hemat, probabilistik).",
    },
    {
      id: "fallback",
      eyebrow: "Langkah 3 · Konsep",
      title: "Fallback chain: jangan panik, alihkan",
      prose: [
        "Provider mati itu BUKAN `kalau`, melainkan `kapan`. Outage regional, rate limit 429 saat traffic spike, degradasi diam-diam (latensi naik 3x tanpa error) — ketiganya rutin terjadi di produksi. Fallback chain = daftar cadangan berurutan: coba A → gagal → coba B → gagal → coba C. Kedengarannya sepele; yang membedakan amatir dan profesional adalah PENYARINGAN TIPE ERROR.",
        "Aturan penyaringan dari praktik produksi: HTTP 429 (rate limit) → tunggu sebentar (backoff) lalu fallback — provider-nya sehat, kuotamu yang habis. HTTP 500/502/503 (server error) → fallback LANGSUNG tanpa tunggu — provider-nya yang sakit. TIMEOUT → fallback — jangan menunggu mayat. HTTP 400 (bad request) → JANGAN fallback, JANGAN retry — request-nya yang salah; mengulanginya ke 3 provider = membayar 3x untuk kesalahan yang sama. LiteLLM mengimplementasikan persis ini: fallbacks otomatis hanya untuk 429/500.",
        "Dua jebakan fallback: (1) FALLBACK STORM — semua request gagal ke A lalu menyerbu B dalam 1 detik → B ikut tumbang (cascade!). Obatnya: backoff + circuit breaker (pola AAI15) + fallback ke provider yang BENAR-BENAR independen (beda region, beda infrastruktur — fallback dari OpenAI US ke OpenAI EU bukan independen saat control plane-nya down!). (2) FALLBACK MAHAL DIAM-DIAM — rantai `murah → mahal` membuat tagihan meledak saat provider murah down 3 jam (semua request lari ke frontier!). Obatnya: budget cap per virtual key + alert — Bifrost dan OpenRouter mendukung batas budget.",
        "Retry-aware: fallback yang baik tahu kapan MENCOBA LAGI vs kapan PINDAH. 429 sekali → retry ke provider sama setelah 2 detik (mungkin spike sesaat). 429 tiga kali beruntun → pindah provider (kuota key ini memang habis). 500 → pindah langsung (retry ke server yang sakit = buang waktu). Bedakan `coba lagi` dan `coba tempat lain` — keduanya ada di rantai yang benar.",
        "Matematika ketahanan: tiga provider masing-masing availability 99% (0,99) yang independen → availability rantai = 1 − 0,01³ = 0,999999 (six nines!). Tiga `sembilan` menjadi enam `sembilan` — bukan karena provider-nya hebat, melainkan karena rantai membuat kegagalan harus terjadi BERSAMAAN di ketiganya — dengan asumsi ketiga provider gagal secara independen. Bila mereka berbagi control plane/region/vendor, angka ini runtuh (lihat jebakan fallback di atas).",
      ],
      formula: String.raw`A_{rantai} = 1 - (1-a_1)(1-a_2)(1-a_3)`,
      formulaNote: "A_rantai = availability gabungan; a_i = availability tiap provider (wajib independen!). Contoh: 0,99³ → 0,999999. Syarat yang sering dilanggar: dua region dari vendor yang sama BUKAN independen saat control plane vendor down — rantai semu = rasa aman palsu.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Punya 3 API key = sudah punya fallback`",
        type: "pitfall",
        body: "Tiga key dari SATU provider mati bersama saat provider-nya down. Tiga key beda provider TANPA logika error-type = fallback buta (error 400 ikut diulang 3x = 3x biaya untuk kesalahan yang sama). Fallback = rantai + penyaringan tipe error + independensi provider. Key cadangan tanpa ketiganya = tali pengaman yang tidak diikat.",
      },
      reference: "429 → backoff+fallback. 500/timeout → fallback langsung. 400 → jangan diulang. Waspadai fallback storm.",
    },
    {
      id: "lab-router",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: simulasi router tiering + fallback chain",
      prose: [
        "SIMULASI — jujur: lab ini mensimulasikan KEPUTUSAN routing (policy tiering, injeksi kegagalan deterministik per model, fallback chain) dalam Python murni. Ini BUKAN gateway asli — tidak ada Bifrost/LiteLLM yang berjalan — melainkan laboratorium untuk memahami logikanya sebelum menyentuh tool sungguhan.",
        "Skenario: 120 request dengan tingkat kesulitan deterministik. Policy: kesulitan ≥ 0,70 → frontier ($0,01/1K token); 0,35–0,70 → mid ($0,002); < 0,35 → cheap ($0,0002). Tiap model punya pola gagal: frontier error 500 tiap id kelipatan 13; mid error 500 tiap kelipatan 17 dan 429 tiap kelipatan 7; cheap 429 tiap kelipatan 11. Rantai fallback: turun satu tier untuk 429/500; error 400 (tidak ada di simulasi ini) = berhenti, jangan buang biaya.",
        "Cara membaca: `routed:` = distribusi tier; `availability` = % request yang akhirnya sukses; `fallbacks` = request yang selamat berkat rantai; `hemat` = perbandingan vs semua-frontier. Interpretasi: tiering memangkas biaya 65,5% walau 9 request harus fallback — dan availability 96,7% (bukan 100%!) mengajarkan batasnya: fallback menaikkan ketahanan, bukan menghilangkannya.",
        "Coba eksplorasi: ubah threshold 0,70 → 0,90 (lebih banyak request ke mid). Perhatikan hemat naik — tapi pikirkan: apa yang terjadi pada kualitas jawaban sulit? Lalu ubah rantai fallback jadi NAIK tier (gagal di cheap → coba frontier): availability naik, tapi hitung tagihannya. Inilah trade-off yang dihadapi FinPay setiap hari.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `policy(cx)` — kembalikan tier dari threshold 0,70 / 0,35" },
        { id: "t2", text: "Implementasikan `call` (injeksi error) + `serve` (fallback turun tier utk 429/500)" },
        { id: "t3", text: "Agregasi mix, availability, biaya, hemat — jalankan dan baca output" },
      ],
      expected: "routed: frontier=33 mid=37 cheap=46 · availability=96.7% fallbacks=9 · cost=$0.44 vs $1.27 hemat=65.5%",
      note: {
        title: "💡 Intuisi: 400 sering jadi error yang paling `jujur`",
        body: "429 berkata `coba nanti`, 500 berkata `coba tempat lain` — keduanya masih memberi harapan. 400 berkata `salahmu, bukan salahku` — mengulanginya ke provider lain tidak akan mengubah apa-apa kecuali tagihan. Router yang baik menghormati kejujuran 400: catat, kembalikan ke aplikasi, jangan bakar uang. TAPI tidak semua 4xx begitu: 429 dan 408 bisa sementara/bergantung provider — jangan pukul rata semua 4xx sebagai 'salah pengirim'.",
      },
      hints: [
        "policy: cx >= 0.70 -> 'frontier'; cx >= 0.35 -> 'mid'; else 'cheap'.",
        "call: cek fail500_mod dulu (return 500), lalu fail429_mod (return 429); 0 = tidak pernah gagal.",
        "serve: chain = CHAIN mulai dari tier primary; untuk tiap model: error None -> sukses (hitung cost); 429/500 -> lanjut; 400 -> berhenti.",
      ],
      code: {
        starter: `MODELS = {\n    "frontier": {"cost_1k": 0.0100, "fail500_mod": 13, "fail429_mod": 0},\n    "mid":      {"cost_1k": 0.0020, "fail500_mod": 17, "fail429_mod": 7},\n    "cheap":    {"cost_1k": 0.0002, "fail500_mod": 0,  "fail429_mod": 11},\n}\nCHAIN = ["frontier", "mid", "cheap"]\nN = 120\n\ndef complexity(rid):\n    return ((rid * 53) % 100) / 100.0\n\ndef tokens(rid):\n    return 300 + (rid * 37) % 1700\n\n# TULIS KODEMU: policy(cx), call(model, rid), serve(rid)\ndef policy(cx):\n    ...\n\ndef call(model, rid):\n    ...\n\ndef serve(rid):\n    ...\n\n# AGREGASI (jangan ubah)\nresults = [serve(i) for i in range(N)]\nok = [r for r in results if r["ok"]]\nfb = sum(1 for r in ok if r["fallback"])\nfrom collections import Counter\nmix = Counter(r["model"] for r in ok)\ncost = sum(r["cost"] for r in ok)\nallf = sum(tokens(i) / 1000.0 * MODELS["frontier"]["cost_1k"] for i in range(N))\nprint(f"routed: frontier={mix['frontier']} mid={mix['mid']} cheap={mix['cheap']}")\nprint(f"availability={len(ok) / N * 100:.1f}% fallbacks={fb}")\nprint(f"cost=\${cost:.2f} vs all-frontier=\${allf:.2f} hemat={(1 - cost / allf) * 100:.1f}%")`,
        lockLines: 14,
        solution: `MODELS = {\n    "frontier": {"cost_1k": 0.0100, "fail500_mod": 13, "fail429_mod": 0},\n    "mid":      {"cost_1k": 0.0020, "fail500_mod": 17, "fail429_mod": 7},\n    "cheap":    {"cost_1k": 0.0002, "fail500_mod": 0,  "fail429_mod": 11},\n}\nCHAIN = ["frontier", "mid", "cheap"]\nN = 120\n\ndef complexity(rid):\n    return ((rid * 53) % 100) / 100.0\n\ndef tokens(rid):\n    return 300 + (rid * 37) % 1700\n\n# TULIS KODEMU: policy(cx), call(model, rid), serve(rid)\ndef policy(cx):\n    if cx >= 0.70:\n        return "frontier"\n    if cx >= 0.35:\n        return "mid"\n    return "cheap"\n\ndef call(model, rid):\n    spec = MODELS[model]\n    if spec["fail500_mod"] and rid % spec["fail500_mod"] == 0:\n        return 500\n    if spec["fail429_mod"] and rid % spec["fail429_mod"] == 0:\n        return 429\n    return None\n\ndef serve(rid):\n    cx, tok = complexity(rid), tokens(rid)\n    primary = policy(cx)\n    chain = CHAIN[CHAIN.index(primary):]\n    for m in chain:\n        err = call(m, rid)\n        if err is None:\n            cost = tok / 1000.0 * MODELS[m]["cost_1k"]\n            return {"model": m, "cost": cost, "ok": True, "fallback": m != primary}\n        if err == 400:\n            break\n    return {"model": None, "cost": 0.0, "ok": False, "fallback": True}\n\n# AGREGASI (jangan ubah)\nresults = [serve(i) for i in range(N)]\nok = [r for r in results if r["ok"]]\nfb = sum(1 for r in ok if r["fallback"])\nfrom collections import Counter\nmix = Counter(r["model"] for r in ok)\ncost = sum(r["cost"] for r in ok)\nallf = sum(tokens(i) / 1000.0 * MODELS["frontier"]["cost_1k"] for i in range(N))\nprint(f"routed: frontier={mix['frontier']} mid={mix['mid']} cheap={mix['cheap']}")\nprint(f"availability={len(ok) / N * 100:.1f}% fallbacks={fb}")\nprint(f"cost=\${cost:.2f} vs all-frontier=\${allf:.2f} hemat={(1 - cost / allf) * 100:.1f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "mix 33/37/46", msg: "Distribusi tier harus frontier=33 mid=37 cheap=46.", pattern: "routed: frontier=33 mid=37 cheap=46" },
          { kind: "stdout_matches", task: "t3", label: "availability 96.7%", msg: "Availability rantai harus 96.7% dengan 9 fallback.", pattern: "availability=96\\.7% fallbacks=9" },
          { kind: "stdout_matches", task: "t3", label: "hemat 65.5%", msg: "Penghematan vs semua-frontier harus 65.5%.", pattern: "hemat=65\\.5%" },
        ],
      },
      reference: "Simulasi keputusan (bukan gateway asli). Tiering hemat 65,5%; fallback menyelamatkan 9 request.",
    },
    {
      id: "arena",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Lima tool di arena 2026: angka benchmark-nya",
      prose: [
        "Lima tool, lima filosofi — angka di bawah dari artikel perbandingan routing tools 2026 (dev.to, artem42) yang menjadi sumber lesson ini. BIFROST — gateway Go open-source (Apache 2.0, Maxim AI): overhead 11 mikrodetik pada 5.000 RPS, aturan CEL, weighted pool antar key, adaptive load balancing berbasis kesehatan provider, semantic caching, virtual key + budget + audit log. Drop-in replacement: cukup arahkan base_url SDK ke gateway. Untuk: enterprise, throughput tinggi, in-VPC/air-gapped.",
        "LITELLM — proxy Python (FastAPI, MIT): overhead 8–15ms, Router dengan fallbacks (429/500), strategi round-robin/least-busy, pelacakan RPM/TPM per key, cost tracking. Butuh Redis untuk state terdistribusi. Untuk: tim Python, prototipe cepat, eksperimen multi-provider. Bukan untuk: 5.000 RPS dengan SLO ketat.",
        "OPENROUTER — SaaS managed: overhead 25–50ms, Auto Router (openrouter/auto) yang memilih model dari tren spend 7 hari terakhir, cost_tier low/medium, fallback antar host (mis. Together AI → DeepInfra untuk bobot open-source yang sama). Nol operasi — tapi payload lewat server pihak ketiga (bukan untuk data regulasi/air-gapped). Untuk: startup, zero-ops.",
        "KONG AI GATEWAY — plugin di atas Kong (Lua/Nginx, 1–3ms): ai-proxy dengan weighted model splitting (contoh 70/30), prompt guard & decoration (suntik system prompt, sanitasi), observabilitas ke Datadog/Prometheus. Untuk: enterprise yang SUDAH memakai Kong sebagai API gateway. Batas: routing dinamis per kompleksitas token butuh Lua custom; tanpa semantic caching native.",
        "ROUTELLM — framework learned (LMSYS/UC Berkeley, Apache 2.0): router MF/BERT/causal-LM memprediksi kesulitan prompt; riset: biaya inference turun >75% dengan kualitas 95% model kuat. Harga: 50–200ms per request + butuh hosting scorer. Untuk: penghematan agresif dengan latensi longgar. Posisikan sebagai MESIN KLASIFIKASI di dalam gateway, bukan pengganti gateway.",
        "Tiga pola produksi yang wajib ada apa pun tool-nya: (1) MULTI-KEY RATE LIMIT — limit provider dihitung PER KEY, bukan per akun; sebar traffic ke pool key (berbobot) untuk melipatgandakan throughput tanpa renegosiasi kuota. (2) VIRTUAL KEY + BUDGET — tiap tim/layanan dapat key virtual dengan budget bulanan & rate limit sendiri; tagihan meledak bisa dilacak ke pelakunya (governance!). (3) SEMANTIC CACHING — prompt mirip yang pernah dijawab = jawab dari cache (mili-detik, $0). Plus dua peringatan: jangan ganti model di TENGAH percakapan sembarangan — beda tokenizer & kepatuhan system prompt bisa merusak koherensi (banyak router memakai session affinity); dan canary model baru nyaris gratis via router karena traffic splitting adalah fitur bawaannya (ringkasan LLMOps10: canary = rilis bertahap 1% → 10% → 100% dengan rollback otomatis).",
      ],
      figure: {
        svg: FIG_OVERHEAD,
        alt: "Overhead per request: Bifrost 11 mikrodetik, Kong 2ms, LiteLLM 11,5ms, OpenRouter 37,5ms, RouteLLM 125ms.",
        caption: "Cara membaca: panjang batang = overhead per request (skala logaritmik); label = angka dari artikel benchmark 2026. Interpretasi: gateway compiled (Bifrost) ~1.000x lebih ringan dari proxy Python dan ~10.000x dari learned router — pilih gateway by LATENSI yang bisa ditoleransi, pilih learned router by HEMAT yang dibutuhkan. Overhead gateway menempel di SETIAP request: 15ms × 10 juta request = 41 jam latensi kumulatif per bulan.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: 11 mikrodetik vs 200 milidetik = 18.000x",
        body: "Overhead Bifrost (11µs) vs classifier RouteLLM (rentang 50–200ms; 200ms adalah ujung atas) beda 18.000x — keduanya disebut `router` tapi hidup di dunia berbeda. Jangan bandingkan apel dan orkestra: gateway diukur dari latensi tambahannya, learned router dari rupiah yang dihematnya. Arsitektur yang benar memakai keduanya di lapisan masing-masing.",
      },
      reference: "Bifrost 11µs · Kong 1-3ms · LiteLLM 8-15ms · OpenRouter 25-50ms · RouteLLM 50-200ms.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Router mana untuk siapa?",
      prose: [
        "**Skenario 1 — Startup, 500rb req/bulan, 2 engineer, data tidak sensitif.** → OpenRouter (zero-ops, Auto Router) atau LiteLLM self-host sederhana. Jangan: Bifrost (overkill operasional untuk tim sekecil ini).",
        "**Skenario 2 — Bank/enterprise, 5.000+ RPS, UU PDP, wajib in-VPC.** → Bifrost self-hosted. 11µs, virtual key + budget + audit log untuk compliance. Jangan: OpenRouter (payload ke server pihak ketiga).",
        "**Skenario 3 — Perusahaan yang API gateway-nya sudah Kong.** → Kong AI Gateway (plugin ai-proxy). Memakai ulang mesh yang ada selalu lebih murah daripada menambah sistem baru.",
        "**Skenario 4 — Tim Python, fase eksperimen, gonta-ganti provider tiap minggu.** → LiteLLM. Drop-in, 100+ provider, fallbacks langsung jalan. Naik kelas ke Bifrost saat RPS > 1.000 atau butuh governance ketat.",
        "**Skenario 5 — Tagihan jebol $40rb/bulan, 80% request sepele, latensi longgar (batch job).** → RouteLLM sebagai classifier DI DALAM gateway (hemat >75%). Jangan: untuk chatbot real-time (tambahan 50–200ms terasa oleh user).",
        "Aturan praktis 10 detik: `RPS > 1.000 atau regulasi ketat?` → Bifrost. `Tim kecil & harus cepat?` → LiteLLM/OpenRouter. `Sudah pakai Kong?` → plugin Kong. `Tagihan jebol & latensi longgar?` → RouteLLM di dalam gateway. `Ragu?` → mulai dari LiteLLM, ukur, naik kelas saat datanya berkata demikian.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: sewa ojek vs punya sopir pribadi",
        body: "OpenRouter = ojek online (naik langsung jalan, tapi ikut aturan & tarif platform). LiteLLM = sewa mobil harian (fleksibel, kamu yang nyetir). Bifrost = punya sopir + armada sendiri (mahal di awal, penuh kendali, tercepat). RouteLLM = konsultan yang bilang `perjalanan ini naik ojek saja cukup` (menghemat, tapi konsultasinya butuh waktu). Pilih sesuai fase, bukan gengsi.",
      },
      reference: "RPS/regulasi → Bifrost. Cepat & kecil → LiteLLM/OpenRouter. Kong existing → plugin. Tagihan jebol → RouteLLM.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Hitungan FinPay: $20.000/bulan jadi $3.080?",
      prose: [
        "FinPay pasca-insiden: 2 juta request/bulan, rata-rata 1.000 token/request. Profil: 70% sepele (klasifikasi tiket), 20% sedang (ringkasan), 10% sulit (analisis fraud). Harga: cheap $0,20/1M, mid $2/1M, frontier $10/1M token. Provider cheap pernah down 3 jam/bulan (availability 99,6%); frontier 99,95%.",
        "Hitung: (a) biaya/bulan jika SEMUA ke frontier; (b) biaya dengan tiering ideal; (c) availability rantai `cheap → frontier` untuk request sepele; (d) tool apa + desain fallback untuk FinPay? **Pembahasan:** (a) 2 juta × 1.000 token = 2 miliar token = 2.000 unit 1M × $10 = $20.000/bulan. (b) Tiering: 1,4 juta × 1.000 × $0,20/1M = $280; 400rb × 1.000 × $2/1M = $800; 200rb × 1.000 × $10/1M = $2.000 → total $3.080/bulan. HEMAT 84,6% = $16.920/bulan = $203.040/tahun! (c) A = 1 − (1−0,996)(1−0,9995) = 1 − 0,004×0,0005 = 0,999998 ≈ 99,9998% — rantai dua provider mengubah 3 jam down menjadi ~1 detik per bulan. (d) LiteLLM (tim kecil, Python, butuh cepat) atau Bifrost bila RPS > 1.000; fallback chain cheap → mid → frontier dengan error-type filtering; budget cap per virtual key agar fallback massal tidak meledakkan tagihan; session affinity untuk percakapan CS.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rantai fallback tanpa budget cap = risiko ekor biaya: saat provider murah down, 100% traffic lari ke frontier dan tagihan 50x lipat berjalan diam-diam. Ini `wrong-way risk` versi LLMOps — proteksi ketersediaanmu justru menyerang dompetmu. Mitigasi: budget cap + alert + tier fallback yang disadari biayanya (mid dulu, bukan langsung frontier).",
      },
      reference: "$20.000 → $3.080/bulan (hemat 84,6%). Rantai: 99,6% → 99,9998%. Budget cap wajib.",
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
          q: "FinPay: tagihan $40rb/bulan, semua request ke frontier. Langkah pertama PALING tepat?",
          options: [
            { text: "Pindahkan semua ke model termurah — hemat 98%", why: "Inilah kesalahan kedua FinPay: satu provider murah = satu titik kegagalan (down 3 jam = lumpuh total). Hemat yang rapuh bukan hemat." },
            { text: "Audit profil kesulitan request, lalu tiering: sepele→murah, sulit→frontier", why: "Tepat. 70-80% request tipikal itu sepele; tiering memangkas 65-85% biaya TANPA mengorbankan kualitas yang sulit — dan tanpa menambah risiko single point of failure.", correct: true },
            { text: "Nego harga ke provider frontier", why: "Diskon 10-20% tidak mengubah aritmetika 50x lipat untuk request sepele. Nego = optimasi di tempat yang salah." },
            { text: "Kurangi jumlah request dengan membatasi fitur", why: "Membunuh produk untuk menghemat biaya = menyerah. Masalahnya bukan volume, melainkan semua request diperlakukan sama." },
          ],
        },
        {
          q: "Provider mengembalikan HTTP 400 untuk sebuah request. Tindakan router yang BENAR?",
          options: [
            { text: "Retry ke provider yang sama 3x dengan backoff", why: "400 = request-nya yang salah (format/parameter). Retry tidak akan mengubah apa-apa kecuali membuang waktu." },
            { text: "Fallback ke provider cadangan — mungkin dia bisa", why: "Salah dan mahal: request yang sama akan 400 juga di provider lain (atau lebih buruk: diinterpretasi berbeda). 3x 400 = 3x biaya untuk kesalahan yang sama." },
            { text: "Jangan retry/fallback — kembalikan error ke aplikasi untuk diperbaiki", why: "Tepat. 400 sering jadi error yang paling `jujur`: masalahnya di pengirim, bukan penerima. Satu-satunya obat = perbaiki request-nya.", correct: true },
            { text: "Fallback ke model yang lebih mahal — lebih pintar pasti bisa", why: "Model mahal tidak memperbaiki JSON yang rusak. Ini seperti membayar dokter spesialis untuk SIM yang kedaluwarsa." },
          ],
        },
        {
          q: "Provider A me-return 429 tiga kali beruntun untuk key-mu. Keputusan tepat?",
          options: [
            { text: "Retry lagi ke A setelah 60 detik — mungkin sudah pulih", why: "Tiga 429 beruntun = kuota key ini memang habis, bukan spike sesaat. Menunggu 60 detik = 60 detik latensi sia-sia." },
            { text: "Pindah ke provider/key lain (fallback), jangan mengulang ke yang habis", why: "Tepat. Pola retry-aware: 429 sekali = retry (spike sesaat); 429 beruntun = pindah (kuota habis). Bedakan `coba lagi` dan `coba tempat lain`.", correct: true },
            { text: "Naikkan concurrency ke A agar cepat selesai", why: "Menyerbu provider yang sedang me-rate-limit = memperparah + memperpanjang hukuman. Ini cara tercepat di-banned." },
            { text: "Matikan router dan hardcode ke provider B", why: "Memindahkan logika darurat ke kode = mengulang masalah yang diselesaikan router. Perbaiki rantai fallback-nya, bukan kodenya." },
          ],
        },
        {
          q: "Bank butuh in-VPC (UU PDP), 5.000 RPS, audit log per request. Tool yang TEPAT?",
          options: [
            { text: "OpenRouter — paling mudah, zero-ops", why: "Payload harus lewat server pihak ketiga = melanggar in-VPC/regulasi. Mudah bukan berarti boleh." },
            { text: "Bifrost self-hosted — 11µs, CEL rules, virtual key + budget + audit", why: "Tepat. Satu-satunya yang memenuhi KEEMPAT syarat: in-VPC (self-host), 5.000 RPS (11µs), audit log, budget per key. Angka benchmark mendukung.", correct: true },
            { text: "LiteLLM — Python, gampang diubah", why: "8-15ms overhead × 5.000 RPS = risiko SLO; dan governance enterprise-nya tidak sekuat Bifrost. Cocok untuk eksperimen, bukan core banking." },
            { text: "RouteLLM saja tanpa gateway", why: "RouteLLM tidak punya retry-aware fallback chain infrastruktur dan menambah 50-200ms. Ia mesin klasifikasi, bukan gateway." },
          ],
        },
        {
          q: "Kapan RouteLLM TIDAK cocok dipakai?",
          options: [
            { text: "Batch job malam hari yang memproses 1 juta dokumen", why: "Ini kasus IDEAL RouteLLM: latensi longgar, volume besar, hemat >75% sangat terasa." },
            { text: "Chatbot customer service real-time dengan SLO 1 detik", why: "Tepat. Tambahan 50-200ms classifier memakan 5-20% budget latensi — dan perilakunya probabilistik (bisa drift). Untuk real-time: gateway deterministik + tiering aturan.", correct: true },
            { text: "Klasifikasi tiket support yang 90% sepele", why: "Kasus ideal: pola kesulitan jelas, penghematan besar, latensi tidak kritis." },
            { text: "Ringkasan dokumen internal non-kritis", why: "Latensi longgar + volume besar = RouteLLM bersinar. Hemat 75% dari tagihan besar = angka yang disukai CFO." },
          ],
        },
        {
          q: "Mix: 70% cheap ($0,0002), 20% mid ($0,002), 10% strong ($0,01) per request. E[C]?",
          options: [
            { text: "$0,00154 — hemat 84,6% vs semua-strong", why: "Tepat: 0,7×0,0002 + 0,2×0,002 + 0,1×0,01 = 0,00014 + 0,0004 + 0,001 = $0,00154. Vs $0,01 = hemat 84,6%. Inilah rumus yang menjual smart routing ke CFO.", correct: true },
            { text: "$0,00407 — rata-rata biasa ketiga harga", why: "Rata-rata biasa ($0,0002+$0,002+$0,01)/3 mengabaikan BOBOT fraksi. 70% request murah harus menarik rata-rata ke bawah, bukan ke tengah." },
            { text: "$0,01 — yang mahal menentukan biaya", why: "Hanya 10% request yang membayar $0,01. Mengambil harga maksimum = mengasumsikan semua request sulit = kesalahan pertama FinPay." },
            { text: "$0,0002 — ikut yang termurah", why: "Mengabaikan 30% request yang BUTUH model lebih kuat. Hemat 100% dengan kualitas hancur = bukan optimasi, melainkan sabotase." },
          ],
        },
      ],
      summary: [
        "Routing layer memisahkan kebijakan (model/provider/budget) dari kode aplikasi — satu endpoint, keputusan per request.",
        "Dua otak: gateway deterministik (Bifrost 11µs, aturan CEL, failover) untuk perimeter; learned router (RouteLLM, hemat >75%) untuk klasifikasi kesulitan.",
        "Fallback chain wajib saring tipe error: 429 → backoff + fallback, 500/timeout → fallback langsung, 400 → jangan diulang.",
        "Tiering biaya: E[C] = f_c·c_c + f_m·c_m + f_s·c_s — contoh FinPay: $20.000 → $3.080/bulan (hemat 84,6%).",
        "Pola produksi: multi-key rate limit, virtual key + budget cap, semantic caching, session affinity untuk percakapan.",
        "Rantai cheap → frontier: availability 99,6% → 99,9998% — tapi pasang budget cap agar fallback massal tidak meledakkan tagihan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
