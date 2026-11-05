import type { V2Lesson } from "../lib/types";

const TRACE_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Waterfall trace satu request: retrieval 0,4 detik, bangun prompt 0,1 detik, LLM 1,6 detik, guardrail 0,1 detik. Total 2,2 detik.">
<g font-family="var(--font-ui)" font-size="11">
<text x="10" y="30" fill="var(--chart-text)">0s</text><text x="140" y="30" fill="var(--chart-text)">0,5s</text><text x="270" y="30" fill="var(--chart-text)">1,0s</text><text x="400" y="30" fill="var(--chart-text)">1,5s</text><text x="455" y="30" fill="var(--chart-text)">2,2s</text>
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="10" y1="38" x2="10" y2="160"/><line x1="140" y1="38" x2="140" y2="160"/><line x1="270" y1="38" x2="270" y2="160"/><line x1="400" y1="38" x2="400" y2="160"/><line x1="465" y1="38" x2="465" y2="160"/></g>
<rect x="10" y="52" width="84" height="18" fill="var(--c2)"/><text x="14" y="65" fill="var(--text)" font-size="10">retrieval 0,4s</text>
<rect x="94" y="80" width="21" height="18" fill="var(--c3)"/><text x="118" y="93" fill="var(--chart-text)" font-size="10">prompt 0,1s</text>
<rect x="115" y="108" width="336" height="18" fill="var(--c1)"/><text x="119" y="121" fill="var(--text)" font-size="10">LLM 1,6s (73% dari total)</text>
<rect x="451" y="136" width="14" height="18" fill="var(--c4)"/><text x="330" y="149" fill="var(--chart-text)" font-size="10">guardrail 0,1s</text>
<text x="10" y="178" fill="var(--text)" font-size="11" font-weight="600">Tanpa trace ini, "lambat" hanya keluhan — dengan trace, ia 73% waktu LLM yang bisa di-cache.</text>
</g></svg>`;

const LLMOPS7_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Histogram latensi NusaBank: 45, 30, 15, 7, 2, 1 persen; ada benjolan di bucket 10+ detik."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">25%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><rect x="59.2" y="20.0" width="43.2" height="160.0" rx="3" fill="var(--c1)"/><text x="80.8" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">45%</text><text x="80.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0-0,5</text><rect x="128.9" y="73.3" width="43.2" height="106.7" rx="3" fill="var(--c1)"/><text x="150.5" y="67.3" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">30%</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,5-1</text><rect x="198.6" y="126.7" width="43.2" height="53.3" rx="3" fill="var(--c1)"/><text x="220.2" y="120.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">15%</text><text x="220.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1-2</text><rect x="268.2" y="155.1" width="43.2" height="24.9" rx="3" fill="var(--c2)"/><text x="289.8" y="149.1" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">7%</text><text x="289.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">2-5</text><rect x="337.9" y="172.9" width="43.2" height="7.1" rx="3" fill="var(--c3)"/><text x="359.5" y="166.9" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">2%</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">5-10</text><rect x="407.6" y="176.4" width="43.2" height="3.6" rx="3" fill="var(--c4)"/><text x="429.2" y="170.4" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">1%!</text><text x="429.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">10+</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">detik; % request</text></svg>`;

export const llmops7: V2Lesson = {
  slug: "llmops7-observability",
  track: "LLMOps",
  module: "Operasi Harian",
  title: "LLMOps7 — Observability",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "`Jawabannya ngaco` — dan tidak ada yang bisa membuktikannya salah",
      prose: [
        "Kamis sore, CS NusaBank meneruskan komplain: `chatbot menjawab ngaco soal biaya admin`. Tim AI membuka dashboard — semua metrik hijau: latency normal, error rate 0%, tidak ada alert. Mereka mencoba mereproduksi dengan pertanyaan yang sama... dan mendapat jawaban yang benar. Kasus ditutup sebagai `tidak bisa direproduksi`. Seminggu kemudian, komplain yang sama datang dari 40 user berbeda.",
        "Twist-nya: tidak ada yang salah dengan model — dan tidak ada yang salah dengan prompt template. Bug-nya ada di kode aplikasi: untuk user dengan riwayat chat panjang, konteks yang di-inject ke prompt terpotong di tengah kalimat, mengubah makna pertanyaan. Tanpa trace (prompt lengkap yang benar-benar dikirim), semua masalah terlihat seperti `modelnya bodoh` — dan tidak ada yang bisa membedakan bug aplikasi dari perilaku model.",
        "Lesson ini tentang observability LLM: mencatat trace prompt→response, mengagregasi metrik yang tepat, dan sampling yang waras antara biaya dan visibilitas.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa rata-rata latensi menipu dan p99 yang menentukan pengalaman user; (2) menghitung p50/p95/p99 dari data latensi dan membaca histogram; (3) merancang tracing dengan sampling yang ekonomis; (4) menentukan SLO latensi yang defensibel dari distribusi nyata.",
      ],
      tasks: [],
      note: {
        title: "Mitos: log pertanyaan + jawaban cukup untuk debugging",
        type: "pitfall",
        body: "Yang benar: yang menentukan perilaku adalah prompt LENGKAP — system prompt + template terisi + konteks retrieval + config. Log yang hanya menyimpan pertanyaan user tidak bisa mereproduksi apa pun, karena 80% penentu jawaban ada di bagian yang tidak dicatat.",
      },
      reference: "Trace = prompt lengkap + response + latency + token + versi + konteks. Tanpa itu, debugging = menebak.",
    },
    {
      id: "trace",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi satu trace",
      prose: [
        "Satu trace lengkap berisi: timestamp, ID request, prompt final yang dikirim (system + template terisi variabel + konteks dokumen), respons mentah model, config (model, temperature, versi prompt), metrik (latency per tahap, token input/output), dan konteks bisnis (hash user ID, fitur, hasil guardrail). Inilah unit terkecil kebenaran operasional — semua metrik dan investigasi diturunkan darinya.",
        "Perhatikan dua hal sensitif. Satu: prompt lengkap bisa mengandung PII (nama, NIK dari konteks) — trace adalah data sensitif yang butuh retensi dan akses terkontrol, bukan log yang bisa dibaca semua orang. Dua: menyimpan 100% full-text itu mahal dan berisiko; pola sehat = 100% metadata (murah, kecil) + sampling full-text 1–5% + 100% full-text untuk kasus bermasalah (error, diblokir guardrail, thumbs-down).",
        "💡 Intuisi: instrumentasi mengikuti aturan `debug like a detective` — catat cukup untuk merekonstruksi TKP 30 hari kemudian, saat orang yang on-call sudah lupa konteksnya. Trace yang baik menjawab `apa yang sebenarnya dikirim ke model?` tanpa perlu bertanya ke siapa pun.",
      ],
      formula: String.raw`p_{95} = \text{nilai ke-}\lceil 0{,}95 \times n \rceil \text{ setelah diurutkan}`,
      formulaNote: "p95 = latency yang hanya dilampaui 5% request. n = jumlah sampel. Rata-rata menutupi penderitaan 5% user terburuk — p95 tidak.",
      tasks: [],
      note: {
        title: "Mitos: rata-rata latency cukup untuk SLA",
        type: "pitfall",
        body: "Yang benar: rata-rata 1,2 detik bisa berarti `semua 1,2 detik` (bagus) atau `95% dalam 0,5 detik, 5% dalam 15 detik` (mengerikan bagi 5% user). SLA yang jujur memakai p95/p99 — karena user tidak merasakan rata-rata, mereka merasakan request mereka sendiri.",
      },
      reference: "100% metadata + 1–5% full-text + 100% kasus bermasalah. SLA = p95/p99.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 3 · Konsep",
      title: "Empat metrik yang benar-benar dibaca",
      prose: [
        "Satu: latency per tahap (retrieval, prompt build, LLM, guardrail) — bukan total saja. Tanpa breakdown, kamu tidak tahu tuas mana yang menekan. Di kasus NusaBank, 73% waktu habis di LLM — solusinya cache, bukan optimasi retrieval. Dua: token per request (input/output terpisah) — jembatan ke biaya (LLMOps6) dan detektor anomali (konteks yang tiba-tiba membengkak).",
        "Tiga: error rate + guardrail block rate — bedakan keduanya. Error = sistem gagal teknis; block = sistem menolak dengan sengaja. Block rate yang naik tiba-tiba bisa berarti serangan — atau false positive yang membuat user frustrasi. Empat: sinyal kualitas — thumbs-down rate, repeat-question rate (user bertanya ulang = jawaban gagal), dan eskalasi ke manusia. Ini proksi kepuasan yang murah dan jujur.",
        "💡 Intuisi: dashboard yang baik menjawab tiga pertanyaan dalam 10 detik: `apakah sistem sehat?` (error, latency), `apakah user puas?` (thumbs-down, repeat), `apakah biaya wajar?` (token/request). Selain itu adalah vanity metric.",
        "💡 Intuisi: alert hanya untuk yang butuh manusia SEKARANG (error rate, block rate anomali). Sisanya dashboard. Setiap alert yang tidak membutuhkan tindakan malam itu adalah spam yang melatih tim mengabaikan alert berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Mitos: makin banyak metrik = makin observable",
        type: "pitfall",
        body: "Yang benar: 40 metrik yang tidak dibaca = 0 observability + biaya storage. Observability diukur dari `berapa menit dari keluhan ke akar masalah`, bukan dari jumlah chart. Mulai dari 4 metrik di atas, tambah hanya saat ada pertanyaan yang tidak terjawab.",
      },
      reference: "Latency per tahap, token/request, error+block rate, sinyal kualitas. Alert hemat.",
    },
    {
      id: "lab-trace",
      eyebrow: "Langkah 4 · Lab",
      title: "Agregasi trace menjadi metrik (mock)",
      prose: [
        "Lab ini mensimulasikan 20 trace request NusaBank: latency, token, dan status error tiap request. Tugasmu: agregasi menjadi tiga metrik operasional — p95 latency, rata-rata token, dan error rate.",
        "Coba eksplorasi: bandingkan rata-rata latency dengan p95. Berapa persen user yang merasakan latency di atas rata-rata? Itulah mengapa SLA memakai p95.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p95` latency (detik)" },
        { id: "t2", text: "Hitung `avg_tok` = rata-rata token per request" },
        { id: "t3", text: "Hitung `err_pct` = error rate (persen)" },
      ],
      expected: "p95=6.1s  avg_tok=1275  err=10%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung p95 dari data yang belum diurutkan, atau memakai indeks yang salah. Rumus: urutkan dulu, lalu ambil elemen ke-ceil(0,95×n) (1-based). Untuk n=20: elemen ke-19 = 6,1. Satu off-by-one mengubah SLA-mu.",
      },
      hints: [
        "Urutkan latency dulu: sorted(lat).",
        "Indeks 1-based ke-ceil(0.95*n) → 0-based kurangi 1.",
        "p95 = sorted(lat)[math.ceil(0.95 * len(lat)) - 1]",
      ],
      code: {
        starter: `import math\n\nlat = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8,\n       2.0, 2.2, 2.5, 2.8, 3.0, 3.5, 4.0, 5.2, 6.1, 9.8]\ntok = [800 + 50 * i for i in range(20)]\nerr = [False] * 18 + [True, True]\n\n# TULIS KODEMU: agregasi metrik dari traces\np95 = \navg_tok = \nerr_pct = \n\nprint(f"p95={p95}s  avg_tok={avg_tok:.0f}  err={err_pct:.0f}%")`,
        lockLines: 8,
        solution: `import math\n\nlat = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8,\n       2.0, 2.2, 2.5, 2.8, 3.0, 3.5, 4.0, 5.2, 6.1, 9.8]\ntok = [800 + 50 * i for i in range(20)]\nerr = [False] * 18 + [True, True]\n\n# TULIS KODEMU: agregasi metrik dari traces\np95 = sorted(lat)[math.ceil(0.95 * len(lat)) - 1]\navg_tok = sum(tok) / len(tok)\nerr_pct = sum(err) / len(err) * 100\n\nprint(f"p95={p95}s  avg_tok={avg_tok:.0f}  err={err_pct:.0f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "p95", value: 6.1, tol: 1e-9, label: "`p95` seharusnya 6.1", msg: "Data terurut, elemen ke-19 (1-based) = 6,1." },
          { kind: "equal", task: "t2", name: "avg_tok", value: 1275, tol: 1e-9, label: "`avg_tok` seharusnya 1275", msg: "Rata-rata 800..1750 langkah 50 = 1275." },
          { kind: "equal", task: "t3", name: "err_pct", value: 10, tol: 1e-9, label: "`err_pct` seharusnya 10", msg: "2 dari 20 = 10%." },
          { kind: "stdout_matches", task: "t3", pattern: "p95=6\\.1s\\s+avg_tok=1275\\s+err=10%", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "p95 dari data terurut; token/request menjembatani ke biaya; error vs block dibedakan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Apa dicatat, apa di-alert, apa di-dashboard",
      prose: [
        "Lima skenario. Satu: butuh debug incident kemarin → butuh full-text trace — pastikan sampling mencakup kasus bermasalah 100% (error, block, thumbs-down). Dua: storage membengkak, finance protes → turunkan sampling full-text umum ke 1%, pertahankan 100% metadata. Tiga: butuh bukti untuk sengketa nasabah → triple (query, dokumen ter-retrieve, jawaban) untuk jawaban sensitif, retensi 1 tahun.",
        "Empat: tim kebanjiran alert → audit: alert mana yang 30 hari terakhir tidak memicu tindakan? Hapus atau turunkan ke dashboard. Lima: tidak tahu kenapa latency naik → butuh breakdown per tahap, bukan total — instrumentasi tiap tahap sebelum optimasi.",
        "Aturan praktis 10 detik: `catat untuk merekonstruksi, agregasi untuk memantau, alert hanya untuk membangunkan`. Jika sebuah data tidak melayani salah satu dari tiga itu, jangan simpan.",
      ],
      figure: {
        svg: TRACE_SVG,
        alt: "Waterfall trace satu request: retrieval 0,4 detik, bangun prompt 0,1 detik, LLM 1,6 detik, guardrail 0,1 detik. Total 2,2 detik.",
        caption: "Cara membaca: tiap bar = satu tahap, panjang bar = durasi, posisi horizontal = urutan waktu. Total 2,2 detik. Interpretasi: LLM memakan 73% waktu — optimasi retrieval tidak akan terasa user. Tanpa breakdown per tahap, tim akan mengoptimasi hal yang salah.",
      },
      tasks: [],
      note: {
        title: "Mitos: sampling trace = kehilangan bukti",
        type: "pitfall",
        body: "Yang benar: sampling cerdas (100% metadata + 100% kasus bermasalah + 1–5% umum) kehilangan sangat sedikit bukti investigasi sambil memangkas 95% biaya. Yang benar-benar menghilangkan bukti adalah TIDAK mencatat prompt lengkap — sampling 100% dari data yang salah tetap salah.",
      },
      reference: "Rekonstruksi → catat; pantau → agregasi; bangunkan → alert. Sisanya jangan simpan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "4 GB vs 200 MB: ekonomi sampling",
      prose: [
        "Chatbot NusaBank: 2.000.000 request/bulan. Full-text trace rata-rata 2 KB per request → 2.000.000 × 2 KB = 4.000 MB ≈ 4 GB per bulan. Dengan strategi sampling (100% metadata ~0,2 KB + 5% full-text): metadata 400 MB + full-text 200 MB = 600 MB — hemat 85%. Jika kasus bermasalah (error+block+thumbs-down) hanya 3% dari traffic, full-text 100% untuk mereka hanya menambah ~120 MB.",
        "Pertanyaan analisis: (a) kapan 5% sampling TIDAK cukup — kasus investigasi apa yang butuh 100%? (b) rancang kebijakan retensi: berapa lama metadata vs full-text disimpan, dan mengapa berbeda? (c) siapa yang boleh membaca full-text trace, mengingat ia bisa mengandung PII?",
        "Jawaban yang defensibel: (a) incident keamanan/serangan terkoordinasi — pola serangan hanya terlihat dari populasi penuh; naikkan sampling sementara saat alert. (b) metadata 1 tahun (murah, untuk tren), full-text 30–90 hari (mahal + sensitif) — kecuali kasus sengketa yang di-freeze. (c) akses berbasis peran + audit log baca; full-text bukan untuk dashboard umum.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Trace adalah pedang bermata dua: ia bukti investigasi sekaligus liabilitas privasi. Tanpa kebijakan retensi dan kontrol akses, log yang kamu simpan untuk debugging bisa menjadi temuan audit UU PDP. Observability tanpa governance = mengumpulkan risiko.",
      },
      reference: "4 GB → 600 MB via sampling cerdas. Retensi beda untuk metadata vs full-text.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "p99, bukan rata-rata: 1% yang merusak reputasi",
      prose: [
        "Chatbot NusaBank: rata-rata latensi 1,2 detik — terlihat bagus. Tapi p99 = 14 detik. Artinya 1% dari 1,2 juta request/bulan = 12.000 user menunggu > 14 detik. Dan 12.000 user yang marah menulis 400 review bintang 1 — yang dibaca 200.000 calon user. Rata-rata 1,2 detik tidak pernah masuk review; p99 14 detik selalu masuk. Reputasi ditentukan oleh EKOR distribusi, bukan tengahnya.",
        "Kenapa ekornya panjang? Tiga penyebab dengan tanda tangannya: (1) COLD START — 3% request pertama setelah scale-up: 8–12 detik (tanda: latensi tinggi bergerombol setelah traffic naik); (2) RETRY — 2% request gagal lalu retry 3x dengan backoff: 6–15 detik (tanda: latensi kelipatan timeout); (3) ANTRIAN — saat λ > kapasitas: 5–20 detik (tanda: berkorelasi dengan traffic). Tanpa tracing per-request, ketiganya terlihat sama: `kadang lambat`. Dengan trace, masing-masing punya obat berbeda: pre-warming, idempotency + cache, autoscaling.",
        "Ukur dengan benar: simpan HISTOGRAM latensi (bukan rata-rata!) — bucket 0–0,5 / 0,5–1 / 1–2 / 2–5 / 5–10 / 10+ detik. Dari histogram, p99 = bucket tempat kumulatif melewati 99%. Contoh: [45%, 30%, 15%, 7%, 2%, 1%] → kumulatif 99% jatuh di bucket 5–10 → p99 ≈ 8 detik. Histogram 6 angka ini LEBIH BERGUNA dari 1 juta data mentah — dan murah disimpan (6 counter per menit).",
        "SLO latensi yang defensibel: `p95 < 3 detik, p99 < 8 detik` — DITURUNKAN dari histogram nyata + kebutuhan produk (user menunggu 3 detik masih oke, 8 detik batas sabar). BUKAN `rata-rata < 2 detik` (menipu, lihat di atas) dan BUKAN `p100 < 5 detik` (mustahil — selalu ada 1 request aneh). SLO ditulis dari distribusi, bukan dari harapan. Dan setiap SLO butuh error budget (MLOps12): 1% request boleh melanggar p99 per bulan.",
      ],
      formula: String.raw`p_k = \text{nilai pada saat kumulatif mencapai } k\%`,
      formulaNote: "p_k = persentil ke-k; hitung dari histogram kumulatif. Operasional: p50 = pengalaman tipikal, p95 = pengalaman buruk yang umum, p99 = pengalaman yang masuk review bintang 1. Jangan pernah laporkan rata-rata saja.",
      tasks: [],
      note: {
        title: "💡 Intuisi: user tidak merasakan rata-rata",
        body: "Tidak ada user yang mengalami `rata-rata 1,2 detik` — mereka mengalami SATU request yang kebetulan 14 detik. Melaporkan rata-rata = melaporkan pengalaman yang tidak dialami siapa pun. Simpan histogram, laporkan p50/p95/p99, dan obati ekornya berdasarkan tanda tangannya.",
      },
      reference: "Histogram 6 bucket per menit > 1 juta data mentah. SLO dari distribusi, bukan harapan.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Histogram: membaca sidik jari masalah",
      prose: [
        "Histogram normal (sehat): [60%, 25%, 10%, 4%, 1%, 0%] — menurun mulus, ekor tipis. Histogram NusaBank: [45%, 30%, 15%, 7%, 2%, 1%] — ada BENJOLAN di bucket 10+ (1% vs 0%). Benjolan di ujung = subpopulasi dengan penyebab khusus (cold start / retry / antrean). Histogram yang mulus = masalah sistemik (model memang lambat); yang berbenjol = masalah subpopulasi (ada yang bisa diobati spesifik). Baca BENTUKNYA, bukan angkanya.",
        "Dua histogram, dua diagnosis. Kasus A: [30%, 30%, 25%, 10%, 4%, 1%] — datar di tengah, p50 = 1,5 detik (buruk untuk SEMUA). Diagnosis: model terlalu besar / prompt terlalu panjang — obati dengan model lebih kecil atau potong token. Kasus B: [70%, 20%, 7%, 2%, 0,7%, 0,3%] — 90% request < 1 detik TAPI ada ekor. Diagnosis: subpopulasi (cold start?) — obati dengan pre-warming, bukan ganti model. Obat yang salah (ganti model untuk kasus B) = mahal dan tidak menyembuhkan.",
        "Sampling trace yang ekonomis: simpan 100% trace untuk request > 5 detik (ekor = tempat bukti), 1% untuk yang normal. Biaya storage: 12.000 trace ekor × 50KB = 600MB/bulan (murah) vs 1,2 juta trace × 50KB = 60GB/bulan (mahal). Aturan: ekor disimpan semua (sedikit tapi berharga), badan disampling (banyak tapi biasa). Saat insiden p99, yang kamu butuhkan HANYA trace ekor — dan semuanya ada.",
      ],
      figure: {
        svg: LLMOPS7_DEEP_SVG,
        alt: "Histogram latensi: menurun dari 45% ke 1%, dengan benjolan mencurigakan di bucket 10+ detik.",
        caption: "Cara membaca: tiap batang = % request di rentang latensi itu; baca dari kiri (cepat) ke kanan (lambat). Interpretasi: bentuknya menurun mulus KECUALI benjolan 1% di 10+ detik — itu subpopulasi (cold start/retry/antrean), bukan model yang lambat. Obati benjolannya, bukan modelnya. p99 ≈ 8 detik.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: benjolan di ekor = sidik jari pelaku",
        body: "Histogram mulus = masalah sistemik (semua request lambat). Histogram berbenjol di ekor = subpopulasi dengan penyebab khusus — dan setiap penyebab punya tanda tangan (bergerombol setelah scale-up = cold start; kelipatan timeout = retry). Baca bentuknya sebelum memilih obat.",
      },
      reference: "Simpan 100% trace ekor (> 5 dtk), 1% sisanya. Ekor sedikit tapi berharga.",
    },
    {
      id: "replay-sesi",
      eyebrow: "Langkah 9 · Replay",
      title: "Replay sesi: memutar ulang produksi untuk debugging",
      prose: [
        "Jumat malam, tim NusaBank menerima komplain: `chatbot memberi jawaban salah soal biaya admin`. Insinyur menjalankan ulang pertanyaan yang sama — dan mendapat jawaban yang BENAR. Kasus ditutup sebagai `tidak bisa direproduksi`. Masalahnya: tanpa rekaman sesi, tidak ada yang bisa membedakan `bugnya sudah hilang` dari `modelnya kebetulan menjawab beda kali ini`. Dengan temperature 0,7, menjalankan ulang pertanyaan yang sama memang bisa memberi jawaban berbeda — bahkan tanpa ada perubahan apa pun.",
        "Solusinya: rekam sesi secara lengkap dan aman. Satu rekaman sesi = prompt final yang benar-benar dikirim (system prompt + template terisi variabel + konteks retrieval), config (versi model, versi prompt, temperature), respons mentah model, dan hasil guardrail — disimpan bersama ID request. PII diredaksi sebelum disimpan: nama dan NIK dari konteks dokumen diganti token `[REDACTED]`, karena rekaman yang kamu simpan untuk debugging bisa dibaca insinyur lain enam bulan kemudian.",
        "Replay deterministik vs non-deterministik: dengan temperature=0, replay biasanya mereproduksi jawaban yang sama — berguna untuk membuktikan `prompt versi ini + konteks ini = jawaban ini`. Dengan temperature>0, jawaban bisa beda tiap run — dan itu BUKAN kegagalan replay. Nilai replay di sini bukan `mendapat jawaban identik`, melainkan `menjalankan ulang skenario yang persis sama secara terkendali`: sesi yang sama dijalankan melalui versi prompt/model lama DAN baru, lalu hasilnya dibandingkan.",
        "Inilah yang disebut golden traffic: sebelum merilis versi prompt atau model baru, putar ulang 1.000 sesi produksi yang terekam melalui kedua versi, lalu ukur deltanya — tingkat kesepakatan, skor evaluasi, jumlah eskalasi. Regresi prompt (versi baru yang diam-diam lebih buruk) tertangkap SEBELUM user merasakannya, bukan sesudah 40 komplain masuk. Tanpa rekaman, setiap rilis adalah lompatan buta.",
        "Biaya dan retensi: menyimpan rekaman lengkap semua request itu mahal dan berisiko. Pola yang waras = 100% metadata ringan, rekaman sesi penuh untuk 100% kasus bermasalah (error, diblokir, thumbs-down), plus golden set terekam 3–5% yang dipilih secara stratifikasi (mewakili tiap fitur utama). Retensi: 30–90 hari untuk rekaman penuh, lebih lama untuk yang terkait sengketa. Rekaman yang tidak direncanakan penghapusannya = liabilitas.",
        "💡 Intuisi: rekaman sesi adalah kotak hitam pesawat. Tidak ada yang menontonnya saat penerbangan normal — tapi saat ada yang jatuh, ia satu-satunya saksi yang tidak berbohong. Bedanya dengan log biasa: log bilang `apa yang terjadi`, rekaman sesi membiarkanmu `mengalaminya lagi`.",
      ],
      tasks: [
        { id: "d1", text: "Rancang isi satu rekaman sesi untuk chatbot CS: field apa saja yang disimpan, dan mana yang diredaksi?" },
        { id: "d2", text: "Tentukan golden set untuk rilis prompt baru: berapa sesi, dari periode apa, dan metrik perbandingan apa?" },
        { id: "d3", text: "Putuskan kebijakan retensi rekaman penuh vs metadata, dengan alasan biaya dan privasi." },
      ],
      note: {
        title: "Mitos: replay = jawabannya harus sama persis",
        type: "pitfall",
        body: "Yang benar: dengan temperature>0, jawaban memang bisa beda — dan replay tetap berguna. Tujuan replay bukan mendapatkan keluaran identik, melainkan menjalankan skenario yang persis sama melalui dua versi (prompt lama vs baru, model lama vs baru) lalu membandingkannya secara adil. Yang dibandingkan adalah DELTA antar versi, bukan identitas jawaban.",
      },
      reference: "Rekam lengkap + redaksi PII; replay = perbandingan terkendali versi, bukan fotokopi jawaban.",
    },
    {
      id: "otel-genai",
      eyebrow: "Langkah 10 · Observability",
      title: "OpenTelemetry untuk GenAI: trace yang bicara bahasa model",
      prose: [
        "OpenTelemetry (OTel) adalah standar instrumentasi: aplikasi membuat `span` — satu operasi berwaktu dengan nama, durasi, dan atribut. Span bersarang: request → span retrieval → span bangun prompt → span panggilan LLM → span guardrail. Waterfall 2,2 detik di Langkah 5 sebenarnya adalah visualisasi dari span-span ini. Tanpa OTel, setiap tim menemukan format trace-nya sendiri — dan dasbor tidak bisa dipakai lintas layanan.",
        "Untuk GenAI, span butuh atribut semantik khusus: nama model, token input/output, `finish reason` (stop karena selesai, length karena kepotong, content_filter karena diblokir), versi prompt, temperature. Konvensi penamaan atribut GenAI sedang dibakukan komunitas OpenTelemetry — ikuti konvensinya, bukan bikin sendiri. Alasannya praktis: dasbor dan alert yang ditulis untuk atribut baku bisa dipakai ulang saat kamu ganti model atau vendor; yang memakai nama atribut buatan sendiri harus ditulis ulang.",
        "Kekuatan sebenarnya: korelasi lintas layanan. Satu `trace_id` merambat dari API → antrean → worker → panggilan model. Tanpa itu, komplain user di API tidak bisa disambungkan ke retry loop di worker — dua tim melihat dua masalah berbeda padahal satu. Propagasi konteks adalah lem yang menyatukan observability sistem terdistribusi; OTel menyediakannya gratis.",
        "Ekonomi sampling: simpan 100% span untuk request bermasalah (error, diblokir guardrail, latency > 5 detik), sampling 1–5% untuk yang sukses. Dua strategi: head sampling (keputusan di awal request — murah, tapi bisa kehilangan request menarik) vs tail sampling (keputusan setelah tahu hasilnya — menyimpan semua yang menarik, tapi butuh buffer sementara). Untuk chatbot, tail sampling dengan buffer 1 menit adalah sweet spot: yang disimpan hanya yang berharga.",
        "💡 Intuisi: span adalah struk belanja untuk setiap tangan yang dilewati request. Waterfall di Langkah 5 bilang `73% waktu di LLM` — itu bukan tebakan, itu jumlah durasi span. Observability yang baik mengubah `kayaknya LLM-nya yang lambat` menjadi `span llm-call = 1.640 ms dari total 2.265 ms, dan 210 token output menjelaskan biayanya`.",
        "Dari span, dasbor dibangun: latensi per tahap per model, token per fitur, error rate per versi prompt — empat metrik Langkah 3, kini dengan atribut GenAI. Alert-nya: error rate per versi prompt (menangkap regresi rilis), p95 latensi span llm-call (menangkap degradasi vendor). Trace tanpa atribut GenAI hanya bilang `lambat`; dengan atribut ia bilang `di mana, berapa biayanya, dan versi apa yang salah`.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_ms` = total latensi request dari semua span" },
        { id: "t2", text: "Temukan `tahap_terberat` = nama span dengan durasi terbesar" },
        { id: "t3", text: "Hitung `total_token` = total token input + output" },
      ],
      expected: "total=2265ms terberat=llm-call token=1660",
      note: {
        title: "Mitos: pasang OpenTelemetry = langsung observable",
        type: "pitfall",
        body: "Yang benar: OTel hanya kerangka. Tanpa atribut semantik GenAI (token, finish reason, versi prompt), trace-mu hanya bilang `request lambat 2,2 detik` — tidak bisa menjawab `di tahap mana, berapa biayanya, model versi apa`. Instrumentasi tanpa atribut yang tepat = kamera tanpa film.",
      },
      hints: [
        "total_ms = jumlahkan durasi_ms semua span.",
        "tahap_terberat = span dengan durasi_ms terbesar — pakai max dengan key.",
        "total_token = jumlahkan tok_in + tok_out tiap span.",
      ],
      code: {
        starter: `# Satu request = 5 span tertanam (nama, durasi_ms, tok_in, tok_out)\nspans = [\n    {"nama": "api-gateway", "durasi_ms": 45, "tok_in": 0, "tok_out": 0},\n    {"nama": "retrieval", "durasi_ms": 380, "tok_in": 0, "tok_out": 0},\n    {"nama": "prompt-build", "durasi_ms": 90, "tok_in": 0, "tok_out": 0},\n    {"nama": "llm-call", "durasi_ms": 1640, "tok_in": 1450, "tok_out": 210},\n    {"nama": "guardrail", "durasi_ms": 110, "tok_in": 0, "tok_out": 0},\n]\n\n# TULIS KODEMU: hitung total_ms, tahap_terberat, total_token\ntotal_ms = \ntahap_terberat = \ntotal_token = \n\nprint(f"total={total_ms}ms terberat={tahap_terberat} token={total_token}")`,
        lockLines: 10,
        solution: `# Satu request = 5 span tertanam (nama, durasi_ms, tok_in, tok_out)\nspans = [\n    {"nama": "api-gateway", "durasi_ms": 45, "tok_in": 0, "tok_out": 0},\n    {"nama": "retrieval", "durasi_ms": 380, "tok_in": 0, "tok_out": 0},\n    {"nama": "prompt-build", "durasi_ms": 90, "tok_in": 0, "tok_out": 0},\n    {"nama": "llm-call", "durasi_ms": 1640, "tok_in": 1450, "tok_out": 210},\n    {"nama": "guardrail", "durasi_ms": 110, "tok_in": 0, "tok_out": 0},\n]\n\n# TULIS KODEMU: hitung total_ms, tahap_terberat, total_token\ntotal_ms = sum(s["durasi_ms"] for s in spans)\ntahap_terberat = max(spans, key=lambda s: s["durasi_ms"])["nama"]\ntotal_token = sum(s["tok_in"] + s["tok_out"] for s in spans)\n\nprint(f"total={total_ms}ms terberat={tahap_terberat} token={total_token}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_ms", value: 2265, label: "`total_ms` seharusnya 2265", msg: "Jumlahkan durasi_ms kelima span: 45+380+90+1640+110." },
          { kind: "equal", task: "t2", name: "tahap_terberat", value: "llm-call", label: "`tahap_terberat` seharusnya llm-call", msg: "Span dengan durasi terbesar = llm-call (1.640 ms)." },
          { kind: "equal", task: "t3", name: "total_token", value: 1660, label: "`total_token` seharusnya 1660", msg: "Hanya llm-call yang punya token: 1450+210." },
          { kind: "stdout_matches", task: "t3", pattern: "total=2265ms terberat=llm-call token=1660", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Span per tahap + atribut GenAI baku; korelasi via trace_id; tail sampling untuk yang menarik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Trace = prompt lengkap + response + latency/token + versi + konteks; tanpa itu debugging = menebak.",
        "SLA memakai p95/p99, bukan rata-rata — user merasakan request mereka, bukan rata-rata.",
        "Empat metrik inti: latency per tahap, token/request, error+block rate, sinyal kualitas.",
        "Sampling: 100% metadata + 1–5% full-text + 100% kasus bermasalah.",
        "Alert hanya untuk yang butuh manusia sekarang; sisanya dashboard.",
      ],
      next: { label: "LLMOps8 — Operasional Fine-Tuning", href: "/learn/llmops8-finetune" },
      quiz: [
        {
          q: "Tim tidak bisa mereproduksi komplain `jawaban ngaco` karena hanya mencatat pertanyaan + jawaban. Apa yang hilang?",
          options: [
            { text: "Tidak ada — itu sudah cukup", why: "Kasus NusaBank membuktikan tidak cukup: bug ada di konteks yang di-inject." },
            { text: "Prompt lengkap yang benar-benar dikirim (template terisi + konteks + config)", why: "80% penentu jawaban ada di bagian yang tidak dicatat.", correct: true },
            { text: "Nama model vendor", why: "Berguna tapi bukan akar masalah kasus ini." },
            { text: "Waktu komplain user", why: "Timestamp ada di log biasa; bukan yang hilang." },
          ],
        },
        {
          q: "Rata-rata latency 1,2 dtk, p95 6,1 dtk. Apa artinya?",
          options: [
            { text: "Sistem baik-baik saja, rata-rata kecil", why: "p95 6,1 dtk berarti 5% user menunggu >6 detik — itu buruk." },
            { text: "5% user mengalami latency ≥6,1 dtk — ekor yang disembunyikan rata-rata", why: "Rata-rata menutupi penderitaan minoritas; p95 membukanya.", correct: true },
            { text: "95% request gagal", why: "p95 bukan failure rate — ia persentil latency." },
            { text: "Harus segera ganti vendor", why: "Belum tentu — breakdown per tahap dulu sebelum menyalahkan vendor." },
          ],
        },
        {
          q: "Block rate guardrail naik tiba-tiba 3x lipat. Respons pertama yang benar?",
          options: [
            { text: "Matikan guardrail agar user tidak terganggu", why: "Mematikan pertahanan saat sinyal anomali = respons terburuk." },
            { text: "Cek trace: serangan terkoordinasi atau false positive massal — lalu putuskan", why: "Kenaikan block = sinyal, bukan vonis. Bedakan serangan vs filter yang terlalu agresif dari data.", correct: true },
            { text: "Naikkan ambang agar block rate turun", why: "Menurunkan angka tanpa memahami penyebab = menyembunyikan masalah." },
            { text: "Abaikan — fluktuasi normal", why: "3x lipat bukan fluktuasi normal; ia sinyal yang harus dibaca." },
          ],
        },
        {
          q: "Strategi penyimpanan trace yang paling waras untuk 2 juta request/bulan?",
          options: [
            { text: "100% full-text selamanya", why: "4 GB/bulan + liabilitas privasi tanpa batas — tidak waras." },
            { text: "100% metadata + 1–5% full-text + 100% kasus bermasalah", why: "Bukti investigasi terjaga, biaya turun 85%, risiko privasi terkendali.", correct: true },
            { text: "Tidak menyimpan apa pun — hemat total", why: "Hemat 100% biaya, kehilangan 100% kemampuan debug. False economy." },
            { text: "Hanya simpan yang error", why: "Kehilangan baseline perilaku normal — tidak bisa bandingkan `sebelum vs sesudah`." },
          ],
        },
        {
          q: "Dalam lab, avg_tok=1275. Jika harga Rp2,5/1K input dan semua token adalah input, estimasi biaya 20 request?",
          options: [
            { text: "Rp63,75", why: "20 × 1,275 × Rp2,5 = Rp63,75. Token/request menjembatani observability ke biaya.", correct: true },
            { text: "Rp637,50", why: "Lupa membagi 1000 — 1275 token = 1,275 ribu token." },
            { text: "Rp6,38", why: "Salah penempatan desimal." },
            { text: "Tidak bisa dihitung dari avg_tok", why: "Justru bisa — itulah gunanya metrik token per request." },
          ],
        },
        {
          q: "Rata-rata latensi 1,2 dtk terlihat bagus, tapi ada 400 review bintang 1 soal `lemot`. Data apa yang PALING menjelaskan?",
          options: [
            { text: "Rata-rata sudah cukup — review-nya pasti dari kompetitor", why: "Menyalahkan review = menolak data. 400 review adalah sinyal; tugasmu menemukan angkanya, bukan pelakunya." },
            { text: "Histogram: p99 = 14 dtk — 12.000 user/bulan mengalami ekor", why: "Tepat. Rata-rata 1,2 dtk tidak dialami siapa pun; 1% user mengalami 14 dtk dan merekalah yang menulis review. Obati ekornya (cold start/retry/antrean) berdasarkan tanda tangannya.", correct: true },
            { text: "Naikkan rata-rata agar angkanya lebih bagus", why: "Rata-rata bukan masalahnya — 1,2 dtk sudah bagus. Menaikkan rata-rata = mengobati angka, bukan user." },
            { text: "Hapus review bintang 1 dari Play Store", why: "Menghapus termometer tidak menurunkan demam. 12.000 user tetap menunggu 14 detik; mereka hanya tidak bisa memprotes." },
          ],
        },
      ],
    },
  ],
};
