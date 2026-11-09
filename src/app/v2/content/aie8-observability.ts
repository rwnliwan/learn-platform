import type { V2Lesson } from "../lib/types";

// Batang atribusi kegagalan: retrieval 60%, generate 30%, rerank 10%.
const FIG_ATRIBUSI = `<svg viewBox="0 0 480 230" role="img" aria-label="Atribusi kegagalan: retrieval 60 persen, generate 30 persen, rerank 10 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="120" y1="180" x2="460" y2="180"/><line x1="120" y1="130" x2="460" y2="130"/><line x1="120" y1="80" x2="460" y2="80"/><line x1="120" y1="30" x2="460" y2="30"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="112" y="184">0%</text><text x="112" y="134">25%</text><text x="112" y="84">50%</text><text x="112" y="34">75%</text></g>
<rect x="150" y="60" width="204" height="28" fill="var(--c4)"/>
<rect x="150" y="100" width="102" height="28" fill="var(--c1)"/>
<rect x="150" y="140" width="34" height="28" fill="var(--text-muted)" opacity="0.7"/>
<g fill="var(--text)" font-size="12" font-family="var(--font-ui)" font-weight="600"><text x="360" y="79">60%</text><text x="258" y="119">30%</text><text x="190" y="159">10%</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)"><text x="10" y="79">retrieval</text><text x="10" y="119">generate</text><text x="10" y="159">rerank</text></g>
<text x="240" y="210" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">10 kegagalan · panjang batang = porsi per tahap pipeline</text>
</svg>`;

export const aie8: V2Lesson = {
  slug: "aie8-observability",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE8 — Observability untuk Aplikasi LLM",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-ngawur",
      eyebrow: "Langkah 1 · Cerita",
      title: "'Modelnya ngawur kemarin' — dan tidak ada yang bisa membuktikan",
      prose: [
        "Senin pagi, tim support NusaBank ramai: 'chatbot ngawur kemarin sore!' Engineer membuka dashboard — tidak ada log prompt, tidak ada jejak retrieval, hanya angka 'error rate naik'. Mereka menebak: modelnya? Datanya? Jaringannya? Tiga hari dihabiskan untuk menebak.",
        "Twist-nya: setelah logging darurat dipasang, jawabannya muncul dalam sejam — 6 dari 10 jawaban buruk berasal dari retrieval yang mengembalikan KOSONG (dokumen SOP sedang dimigrasi), bukan dari model. Tiga hari menebak vs satu jam data. Observability bukan kemewahan; ia adalah selisih antara menebak dan mengetahui.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merancang log prompt/response yang aman; (2) membangun trace per tahap pipeline; (3) menghitung p95 latensi, cost per request, dan error rate; (4) melakukan atribusi kegagalan per tahap; (5) merancang sampling log yang hemat dan patuh privasi.",
        "🗺️ Isi lesson: Langkah 1 · Cerita menebak — Langkah 2 · Logging dan trace — Langkah 3 · Lab: metrik dari log — Langkah 4 · Atribusi kegagalan — Langkah 5 · Lab: siapa biang kerok — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Langkah 8 · Feedback loop — Langkah 9 · Pipeline feedback — Checkpoint.",
      ],
      tasks: [],
      reference: "Observability = log + trace + metrik. Tanpa ketiganya, debugging LLM adalah menebak.",
    },
    {
      id: "konsep-log-trace",
      eyebrow: "Langkah 2 · Logging dan trace",
      title: "Log: apa yang direkam; trace: ke mana alirnya",
      prose: [
        "Log minimal per request: timestamp, versi prompt, versi model, token input/output, latensi, status, dan ID sesi. Trace melangkah lebih jauh: tiap tahap pipeline (retrieve → rerank → generate) dicatat sebagai span dengan latensi dan output ringkasnya — sehingga 'jawaban buruk' bisa dilacak ke tahap yang gagal.",
        "Tiga keluarga metrik. Kualitas: pass rate golden set, thumbs-down rate, abstention rate. Operasional: p95 latensi (bukan rata-rata — rata-rata disembunyikan outlier), error rate, throughput. Ekonomi: cost per request, cost per pengguna. Satu dashboard, tiga keluarga — karena insiden bisa datang dari mana saja.",
        "Kepribadian trace: ia seperti kotak hitam pesawat — tidak mencegah kecelakaan, tetapi membuat setiap kecelakaan bisa dijelaskan dan tidak terulang.",
        "Lima field wajib tiap log — tanpa kecuali. (1) request_id (korelasi!); (2) timestamp_ms; (3) model_version; (4) token_in/out (biaya!); (5) latency_ms per tahap. Tanpa request_id: 50.000 request/hari = tumpukan tak terlacak. Tanpa token: tagihan misterius. Tanpa per-tahap: “lambat” tidak bisa diatribusikan. Lima field = 5 menit implementasi, menghemat 5 jam per insiden. Log tanpa request_id = CCTV tanpa timestamp.",
        "Sampling — matematika retensi. 50.000 request/hari × 2 KB/log = 100 MB/hari = 3 GB/bulan (murah!). Tetapi: log FULL TRACE (prompt+completion) × 50 KB = 2,5 GB/hari = 75 GB/bulan + risiko PII! Strategi: 100 persen METRIK (murah), 1 persen full trace acak (cukup untuk pola), 100 persen trace untuk ERROR (yang penting!). Sampling cerdas = 99 persen wawasan dengan 2 persen biaya. Jangan simpan semua; simpan yang PENTING semua.",
        "Dashboard — empat panel wajib. (1) Traffic + error rate (5 menit). (2) p50/p95/p99 latensi per tahap. (3) Biaya per jam (token × tarif). (4) Kualitas (thumbs-down rate, judge score sampel). Satu layar, empat angka = kesehatan sistem sekilas. Tanpa dashboard: insiden ditemukan dari komplain (terlambat 2 jam). Dengan: alert otomatis (terlambat 2 menit). 2 jam vs 2 menit = beda reputasi.",
      ],
      formula: String.raw`c = \frac{t_{in}\,p_{in} + t_{out}\,p_{out}}{10^6}`,
      formulaNote: "c = biaya per request; t_in, t_out = token input/output; p_in, p_out = harga per 1 juta token. Metrik ekonomi ini dihitung dari log token — tanpa log token, tagihan adalah misteri.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Rata-rata latensi 400ms, berarti cepat.' Salah. Rata-rata disembunyikan oleh mayoritas yang cepat; p95 5.200ms di lab berarti 1 dari 20 pengguna menunggu lebih dari 5 detik — dan merekalah yang komplain. Selalu monitor p95 (atau p99), bukan rata-rata.",
      },
      reference: "Log: prompt, response, token, latensi, versi. Trace: span per tahap. Metrik: kualitas + operasional + ekonomi.",
    },
    {
      id: "lab-metrik",
      eyebrow: "Langkah 3 · Lab metrik",
      title: "Lab: membaca cerita dari 20 baris log",
      prose: [
        "Dua puluh request: latensi, token, status. Tugasmu: hitung p95 latensi (urutkan, ambil elemen ke-ceil(0,95 x n)), total biaya token (hanya request 'ok' yang membayar output), dan error rate. Tiga angka ini adalah denyut nadi aplikasi LLM.",
        "Coba ubah: ganti satu status 'ok' menjadi 'timeout', jalankan ulang, dan lihat error rate naik tetapi biaya turun (timeout tidak membayar output). Log yang baik membuat trade-off seperti ini terlihat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p95` latensi dari LOG" },
        { id: "t2", text: "Hitung `cost` (USD) dan `err` (error rate)" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "p95=5200ms  cost=$0.0102  err=20%",
      note: {
        title: "💡 Intuisi",
        body: "p95 adalah 'janji' ke pengguna: 95 persen request lebih cepat dari ini. Rata-rata adalah 'harapan' yang tidak dialami siapa pun secara langsung. Kontrak SLA selalu ditulis dalam persentil, bukan rata-rata — karena persentil bisa ditepati.",
      },
      hints: [
        "import math; lat = sorted(l for l, _, _, _ in LOG)",
        "p95 = lat[math.ceil(0.95*len(lat))-1]",
        "cost = sum(ti*PIN + to*POUT for _, ti, to, s in LOG if s == \"ok\"); err = yang tidak ok / len(LOG)",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nimport math\n# LOG: (latency_ms, in_tok, out_tok, status)\nLOG = [\n    (320, 800, 120, "ok"), (450, 810, 200, "ok"), (280, 790, 90, "ok"),\n    (5100, 800, 0, "timeout"), (390, 805, 150, "ok"), (610, 820, 300, "ok"),\n    (295, 795, 110, "ok"), (480, 800, 180, "ok"), (5200, 800, 0, "timeout"),\n    (340, 800, 140, "ok"), (410, 815, 210, "ok"), (370, 800, 160, "ok"),\n    (5300, 800, 0, "error"), (300, 790, 100, "ok"), (440, 805, 190, "ok"),\n    (360, 800, 130, "ok"), (420, 810, 170, "ok"), (310, 795, 105, "ok"),\n    (5050, 800, 0, "timeout"), (380, 800, 155, "ok"),\n]\nPIN, POUT = 0.5/1e6, 1.5/1e6  # USD per token\n\n# TULIS KODEMU: p95, biaya, error rate\np95 = \ncost = \nerr = \n\nprint(f"p95={p95}ms  cost=\${cost:.4f}  err={err:.0%}")`,
        lockLines: 14,
        solution: `# DATA SEED — jangan ubah\nimport math\n# LOG: (latency_ms, in_tok, out_tok, status)\nLOG = [\n    (320, 800, 120, "ok"), (450, 810, 200, "ok"), (280, 790, 90, "ok"),\n    (5100, 800, 0, "timeout"), (390, 805, 150, "ok"), (610, 820, 300, "ok"),\n    (295, 795, 110, "ok"), (480, 800, 180, "ok"), (5200, 800, 0, "timeout"),\n    (340, 800, 140, "ok"), (410, 815, 210, "ok"), (370, 800, 160, "ok"),\n    (5300, 800, 0, "error"), (300, 790, 100, "ok"), (440, 805, 190, "ok"),\n    (360, 800, 130, "ok"), (420, 810, 170, "ok"), (310, 795, 105, "ok"),\n    (5050, 800, 0, "timeout"), (380, 800, 155, "ok"),\n]\nPIN, POUT = 0.5/1e6, 1.5/1e6  # USD per token\n\n# TULIS KODEMU: p95, biaya, error rate\nlat = sorted(l for l, _, _, _ in LOG)\np95 = lat[math.ceil(0.95*len(lat))-1]\ncost = sum(ti*PIN + to*POUT for _, ti, to, s in LOG if s == "ok")\nerr = sum(1 for _, _, _, s in LOG if s != "ok")/len(LOG)\n\nprint(f"p95={p95}ms  cost=\${cost:.4f}  err={err:.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p95", value: 5200, tol: 1e-9, label: "`p95` seharusnya 5200", msg: "Data terurut 20 angka; ceil(0,95x20)=19 → elemen indeks 18 = 5200." },
          { kind: "equal", task: "t2", name: "cost", value: 0.0102, tol: 0.001, label: "`cost` seharusnya 0.0102", msg: "Jumlahkan token request 'ok' saja; timeout/error tidak membayar output." },
          { kind: "equal", task: "t2", name: "err", value: 0.2, tol: 1e-9, label: "`err` seharusnya 0.2", msg: "4 dari 20 tidak ok (3 timeout + 1 error)." },
          { kind: "stdout_matches", task: "t3", pattern: "p95=5200ms\\s+cost=\\$0\\.0102\\s+err=20%", label: "`print` menampilkan ketiganya", msg: "Format: p95=5200ms  cost=$0.0102  err=20%." },
        ],
      },
      reference: "p95 untuk janji, error rate untuk alarm, cost/request untuk dompet. Tiga angka, satu denyut nadi.",
    },
    {
      id: "konsep-atribusi",
      eyebrow: "Langkah 4 · Atribusi",
      title: "Atribusi: jangan salahkan model sebelum bukti",
      prose: [
        "Jawaban buruk punya banyak tersangka: retrieval kosong, rerank salah urutan, konteks terpotong, prompt basi, model halusinasi. Trace per tahap memungkinkan atribusi: untuk tiap kegagalan, catat tahap pertama yang menyimpang. Polanya hampir selalu mengejutkan — seperti cerita pembuka: mayoritas bukan salah model.",
        "Aturan atribusi: bila retrieval kosong → perbaiki index/chunking, bukan model. Bila konteks benar tetapi jawaban salah → perbaiki prompt/generation. Bila latensi meledak di satu tahap → optimasi tahap itu. Tanpa atribusi, semua insiden 'diperbaiki' dengan mengganti model — mahal dan sering salah sasaran.",
        "Eval kontinu melengkapi: sampel acak harian dinilai (judge + manusia berkala) sehingga penurunan kualitas tertangkap dalam hitungan hari, bukan keluhan.",
        "Contoh atribusi — 3 menit vs 3 jam. “Model ngawur kemarin”: tanpa atribusi → salahkan model → fine-tune 3 hari → ternyata retrieval kosong (dokumen belum di-index!). Dengan atribusi (log per tahap): retrieval_hit=false terlihat di 3 baris → vonis 3 menit: perbaiki indexer, bukan model. 90 persen “model ngawur” = bukan model (retrieval? prompt? data?). Atribusi = jangan menghukum yang tidak bersalah.",
        "Trace sampling tail-based — pintar. Simpan SEMUA trace 1 jam, buang yang normal, simpan yang error/lambat. 99% dibuang OTOMATIS, 1% penting tersimpan. Head-based (acak 1%) bisa melewatkan THE insiden; tail-based tidak. Untuk error langka: tail-based wajib.",
      ],
      figure: {
        svg: FIG_ATRIBUSI,
        alt: "Atribusi kegagalan: retrieval 60 persen, generate 30 persen, rerank 10 persen.",
        caption: "Cara membaca: panjang batang horizontal = porsi 10 kegagalan yang diatribusikan ke tiap tahap pipeline. Interpretasi: 60 persen kegagalan berasal dari retrieval — mengganti model hanya menyentuh 30 persen masalah sambil membayar mahal. Atribusi mengarahkan usaha ke tempat yang benar: perbaiki index dan chunking dulu.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Jawaban buruk = model kurang pintar = ganti model lebih besar.' Salah tiga kali. Data lab dan cerita menunjukkan mayoritas kegagalan RAG ada di retrieval — mengganti model tanpa atribusi seperti mengganti mesin mobil saat bannya kempes: mahal, dan mobil tetap tidak jalan.",
      },
      reference: "Atribusi dulu, perbaiki yang ditunjuk data. Eval kontinu menangkap penurunan dalam hitungan hari.",
    },
    {
      id: "lab-atribusi",
      eyebrow: "Langkah 5 · Lab atribusi",
      title: "Lab: menemukan biang kerok dalam 3 baris",
      prose: [
        "Sepuluh trace kegagalan, masing-masing sudah dilabeli tahap penyebabnya. Hitung distribusinya dengan Counter, ambil yang terbanyak, dan lihat porsinya. Inilah versi mini dari dashboard atribusi produksi.",
        "Coba ubah: tambah tiga trace ('r11', 'generate') dan kawan-kawan, jalankan ulang, dan lihat apakah kesimpulan berubah. Atribusi yang sehat stabil terhadap sedikit data baru; yang goyah butuh sampel lebih besar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `cnt` (Counter tahap) dan `top` (tahap terbanyak)" },
        { id: "t2", text: "Cetak tahap dan porsinya" },
      ],
      expected: "gagal_terbanyak=retrieval  porsi=60%",
      note: {
        title: "💡 Intuisi",
        body: "Atribusi mengubah politik insiden menjadi sains: bukan lagi 'tim model vs tim data saling tunjuk', melainkan 'data menunjukkan 60 persen di retrieval'. Angka yang disepakati mengakhiri perdebatan lebih cepat dari rapat mana pun.",
      },
      hints: [
        "from collections import Counter sudah diimpor di seed.",
        "cnt = Counter(t for _, t in TRACES); top = cnt.most_common(1)[0][0]",
        "print(f\"gagal_terbanyak={top}  porsi={cnt[top]/len(TRACES):.0%}\")",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# TRACE: tiap request gagal dicatat tahapnya\nfrom collections import Counter\nTRACES = [\n    ("r01", "retrieval"), ("r02", "generate"), ("r03", "retrieval"),\n    ("r04", "retrieval"), ("r05", "rerank"), ("r06", "generate"),\n    ("r07", "retrieval"), ("r08", "retrieval"), ("r09", "generate"),\n    ("r10", "retrieval"),\n]\n\n# TULIS KODEMU: tahap penyumbang kegagalan terbesar\ncnt = \ntop = \n\nprint(f"gagal_terbanyak={top}  porsi={cnt[top]/len(TRACES):.0%}")`,
        lockLines: 11,
        solution: `# DATA SEED — jangan ubah\n# TRACE: tiap request gagal dicatat tahapnya\nfrom collections import Counter\nTRACES = [\n    ("r01", "retrieval"), ("r02", "generate"), ("r03", "retrieval"),\n    ("r04", "retrieval"), ("r05", "rerank"), ("r06", "generate"),\n    ("r07", "retrieval"), ("r08", "retrieval"), ("r09", "generate"),\n    ("r10", "retrieval"),\n]\n\n# TULIS KODEMU: tahap penyumbang kegagalan terbesar\ncnt = Counter(t for _, t in TRACES)\ntop = cnt.most_common(1)[0][0]\n\nprint(f"gagal_terbanyak={top}  porsi={cnt[top]/len(TRACES):.0%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "cnt", label: "`cnt` terdefinisi", msg: "cnt = Counter(t for _, t in TRACES)." },
          { kind: "equal", task: "t1", name: "top", value: "retrieval", label: "`top` seharusnya retrieval", msg: "retrieval 6, generate 3, rerank 1." },
          { kind: "stdout_matches", task: "t2", pattern: "gagal_terbanyak=retrieval\\s+porsi=60%", label: "`print` menampilkan keduanya", msg: "Format: gagal_terbanyak=retrieval  porsi=60%." },
        ],
      },
      reference: "Dashboard atribusi = Counter raksasa. Perbaiki yang ditunjuk data, bukan yang paling mudah disalahkan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: apa dicatat, apa tidak",
      prose: [
        "Satu, debugging insiden — trace penuh: input tiap tahap, latensi per tahap, versi prompt dan model. Dua, monitoring harian — agregat saja: p95, error rate, cost/request, thumbs-down rate; murah dan cukup untuk alarm.",
        "Tiga, data sensitif (PII, data nasabah) — redact sebelum simpan (masking nomor rekening, nama); retensi pendek (mis. 30 hari) untuk data mentah, agregat boleh lama. Log 100 persen prompt mentah adalah bom privasi yang menunggu meledak. Empat, eval kontinu — sampel acak harian (mis. 100 request) dinilai judge, subsampel mingguan oleh manusia.",
        "Aturan praktis 10 detik: catat yang kamu butuhkan untuk debug dan audit; agregatkan sisanya; redact yang sensitif; sampel yang mahal.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Observability yang baik seperti asuransi: terasa mahal saat tenang, tak ternilai saat krisis. Bedanya dengan asuransi: premi observability bisa dihitung (storage + komputasi), sedangkan biaya tanpa observability tidak terhingga — tiga hari menebak, seperti cerita pembuka.",
      },
      reference: "Debug → trace penuh. Monitor → agregat. Sensitif → redact + retensi pendek. Kualitas → sampel harian.",
    },
    {
      id: "minicase-log",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 50.000 request dan bom PII",
      prose: [
        "Chatbot NusaBank: 50.000 request per hari. Log penuh 2 KB per request = 100 MB per hari = 3 GB per bulan; retensi 90 hari = 9 GB. Terdengar kecil — sampai tim legal bertanya: 'di mana data nasabah disimpan, siapa yang bisa baca, kapan dihapus?'",
        "Desain hemat dan patuh: 100 persen metrik agregat (murah, tanpa PII), 10 persen trace penuh dengan PII di-redact (900 MB per 90 hari), 1 persen sampel mentah terenkripsi untuk audit (retensi 30 hari). Twist: log 100 persen mentah bukan 'lebih aman' — ia bom PII + biaya; sampling cerdas memberi 99 persen manfaat debugging dengan 10 persen risiko.",
        "Angka kuncinya: biaya storage 9 GB receh; biaya insiden kebocoran data tak terhingga. Observability yang baik adalah keputusan risiko, bukan keputusan storage.",
        "Bom PII — dihitung konkret. 50.000 request/hari, full trace menyimpan prompt (rata-rata 15 persen mengandung NIK/no HP dari invoice!). 7.500 PII/hari × 90 hari retensi = 675.000 PII tersimpan. Satu kebocoran: denda UU PDP = 2 persen omset + reputasi. Biaya redaksi PII otomatis: Rp5 juta/bulan. Biaya TANPA redaksi: ekspektasi denda = probabilitas bocor (1 persen/tahun?) × Rp2 miliar = Rp20 juta/tahun. Redaksi = asuransi Rp5 juta vs risiko Rp20 juta+. Hitung dan putuskan — jangan default “simpan semua”.",
        "Angka sampling minicase — rekomendasi final. Metrik 100 persen: 50.000 × 200 byte = 10 MB/hari (abaikan). Full trace 1 persen: 500 × 50 KB = 25 MB/hari. Error trace 100 persen (asumsi 2 persen error): 1.000 × 50 KB = 50 MB/hari. Total: 85 MB/hari = 2,5 GB/bulan ≈ Rp50 ribu/bulan storage. Wawasan: pola (dari 1 persen) + SEMUA error (untuk debugging). Inilah “cukup”: Rp50 ribu/bulan untuk observabilitas penuh. Mahal = menyimpan 100 persen (Rp5 juta/bulan + bom PII).",
        "Log retention tiering — hemat. 7 hari full (SSD cepat), 90 hari ringkas (murah), 1 tahun agregat saja. 50.000/hari × 90 hari = 4,5 juta request full = mahal! Tiering: 95% hemat storage. Akses pola: 99% query <7 hari. Desain dari pola akses, bukan 'simpan semua'.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Log berisi data nasabah adalah aset risiko: retensi, akses, dan enkripsinya harus masuk dokumen kepatuhan. Prinsipnya sama dengan retensi data model kredit — catat kebijakan, patuhi, audit berkala.",
      },
      reference: "Agregat 100 persen, trace 10 persen ter-redact, mentah 1 persen terenkripsi. Kebijakan tertulis, bukan kebiasaan.",
    },
    {
      id: "feedback-loop-konsep",
      eyebrow: "Langkah 8 · Feedback loop",
      title: "Feedback loop: dari thumbs-up jadi perbaikan",
      prose: [
        "Di gudang data sebuah perusahaan AI ada tabel berisi 40 ribu baris feedback — thumbs-up, thumbs-down, dan komentar pengguna. Tidak pernah dibaca siapa pun. Setiap malam tabel itu bertambah panjang; setiap pagi tidak ada satu pun yang berubah karenanya. Itulah kuburan feedback: sinyal paling mahal dari pengguna, dikubur hidup-hidup. Feedback loop adalah mesin yang membongkar kuburan itu — mengubah reaksi pengguna menjadi perbaikan yang terukur.",
        "Dua keluarga sinyal. Eksplisit: thumbs-up/down, bintang, koreksi langsung ('maksud saya X, bukan Y'). Implisit: perilaku — pengguna meng-copy jawaban (persetujuan diam-diam), menekan regenerate (penolakan sopan), mengabaikan saran lalu mengetik ulang sendiri (vonis), atau menutup chat (hukuman mati). Eksplisit memberitahu apa yang dikatakan pengguna; implisit memberitahu apa yang dilakukannya. Keduanya tidak selalu sepakat — dan ketidaksepakatan itu sendiri adalah informasi: jawaban yang di-thumbs-up tetapi tidak pernah di-copy mungkin hanya 'cukup baik', bukan 'benar-benar membantu'.",
        "Dari sinyal mentah ke bahan bakar perbaikan, jalurnya: kumpulkan → saring → kurasi → jadikan label. Feedback terbaik masuk eval set — pasangan pertanyaan dan jawaban benar versi kurasi — sehingga regresi kualitas tertangkap otomatis setiap rilis. Sebagian menjadi contoh fine-tuning atau few-shot. Sisanya dibuang, dan itu normal: dari 10 ribu sinyal, 200 yang terkurasi bisa lebih berharga daripada 10 ribu yang mentah. Kurasi adalah pekerjaan paling tidak glamor dan paling menentukan dalam loop ini.",
        "Aturan emas: feedback mentah BUKAN label benar. Tiga bias meracuninya. Satu, yang marah lebih vokal: 2 persen pengguna yang kecewa bisa menghasilkan 80 persen thumbs-down, sementara 98 persen yang puas diam saja. Dua, koreksi pengguna bisa salah — pengguna 'memperbaiki' jawaban yang sebenarnya sudah benar, atau memberi jawaban yang yakin tetapi keliru. Tiga, populasi pemberi feedback tidak mewakili semua pengguna: yang aktif memberi rating bukan potret yang diam. Menelan feedback mentah sebagai kebenaran adalah cara tercepat melatih model untuk menyenangkan yang paling berisik, bukan yang paling benar.",
        "Loop tertutup: rilis → ukur → kurasi → perbaiki → rilis. Observability (langkah 1–7 lesson ini) adalah kaki 'ukur'-nya: tanpa metrik, kamu tidak tahu apakah perbaikanmu benar-benar memperbaiki. Tanpa loop, feedback adalah kotak saran yang menumpuk. Dengan loop, setiap rilis membuat eval set sedikit lebih tajam — dan model sedikit lebih jujur.",
        "💡 Intuisi: regenerate adalah voting tanpa suara. Pengguna tidak menulis esai kritik — ia hanya menekan 'coba lagi'. Satu regenerate berarti: 'jawabanmu tidak cukup bagus sampai aku rela menunggu sekali lagi'. Agregat regenerate per topik adalah peta masalah yang digambar pengguna sendiri tanpa mereka sadari. Itulah yang kamu hitung di lab langkah berikutnya: topik dengan regenerate rate tertinggi adalah tempat masalah terbesar bersembunyi.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 2 sinyal eksplisit dan 2 sinyal implisit untuk chatbot bank, beserta artinya" },
        { id: "t2", text: "Jelaskan mengapa 'topik dengan thumbs-down terbanyak = topik terburuk' bisa menyesatkan" },
        { id: "t3", text: "Tulis 1 aturan kurasi yang harus dilewati feedback sebelum masuk eval set" },
      ],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "Mitos: 'semakin banyak feedback, semakin benar modelnya — tinggal latih ulang dengan semua data thumbs-up/down.' Salah. Tanpa kurasi dan stratifikasi, melatih ulang dengan feedback mentah berarti melatih model meniru bias populasi pemberi feedback: yang vokal, yang marah, yang salah paham — bukan kebenaran. Poisoning (langkah 9) adalah versi jahat dari masalah yang sama. Volume tanpa kurasi = sampah yang lebih banyak, bukan kebenaran yang lebih banyak.",
      },
      reference: "Feedback = sinyal eksplisit (rating, koreksi) + implisit (copy, regenerate, abandon). Kurasi sebelum jadi label. Loop tertutup: rilis → ukur → kurasi → perbaiki → rilis.",
    },
    {
      id: "feedback-loop-pipeline",
      eyebrow: "Langkah 9 · Pipeline feedback",
      title: "Membangun pipeline feedback yang aman",
      prose: [
        "Pipeline feedback yang serius dimulai dari skema, bukan dari tombol thumbs-up. Setiap feedback wajib membawa lima field: `request_id` (agar bisa di-join ke trace observability — 'feedback ini untuk jawaban yang mana?'), konteks ringkas (topik, versi model, versi prompt), isi respons yang dinilai, sinyalnya (`up`/`down`/`regen`/`copy`/`abandon`), dan timestamp. Tanpa `request_id`, feedback adalah surat kaleng: ada isinya, tidak ada alamatnya — tidak bisa dilacak, tidak bisa diperbaiki.",
        "Privasi: feedback adalah log yang menyamar. Pengguna yang marah menempelkan NIK, nomor rekening, dan alamat ke kolom komentar 'kenapa limit saya segini?!'. Maka aturan langkah 6 berlaku penuh di sini: redact PII sebelum disimpan, retensi pendek untuk teks mentah, agregat boleh lama. Pipeline feedback tanpa redaksi adalah bom PII kedua — kali ini diisi oleh pengguna sendiri, dengan sukarela.",
        "Ancaman: feedback poisoning dan gaming. Kompetitor atau bot bisa membanjiri thumbs-down untuk menjatuhkan skor kualitasmu; kelompok pengguna bisa mengoordinasikan rating untuk memaksa perilaku model tertentu. Tanda-tandanya: lonjakan volume harian yang tidak wajar, akun-akun baru yang semuanya memberi sinyal identik, atau sinyal yang bertentangan dengan perilaku (seribu thumbs-down tetapi retensi justru naik). Mitigasi: rate limit per akun, bobot berdasarkan reputasi dan riwayat, karantina sinyal anomali untuk review manusia — dan jangan pernah memicu perbaikan otomatis dari lonjakan yang belum diinvestigasi.",
        "Tidak semua feedback perlu dibaca manusia — tetapi sampelnya harus cerdas. Stratifikasi: ambil sampel per topik dan per jenis sinyal, prioritaskan topik dengan regenerate rate tinggi dan koreksi eksplisit. Seratus sampel terkurasi yang dibaca manusia tiap minggu mengalahkan sepuluh ribu baris yang tidak pernah dibuka. Review manusia adalah gerbang kualitas antara 'sinyal' dan 'label': di sinilah bias disaring dan kebenaran ditetapkan.",
        "💡 Intuisi: loop yang tidak pernah ditutup akan mati dengan sendirinya. Pengguna yang rajin memberi koreksi tetapi tidak pernah melihat perbaikan akan berhenti memberi — untuk apa repot? Maka bangun dasbor konversi: feedback masuk → dikurasi → menjadi perbaikan (prompt, eval, data) → dampak pada metrik. Setiap perbaikan yang lahir dari feedback adalah iklan terbaik untuk meminta feedback berikutnya. Loop yang hidup memproduksi bahan bakarnya sendiri.",
        "Lab: dua puluh empat sinyal feedback dan empat belas hari riwayat thumbs-down. Tugasmu: hitung regenerate rate per topik — topik dengan rate tertinggi adalah kandidat masalah terbesar. Lalu pindai deret harian: hari dengan jumlah thumbs-down melebihi 3× median adalah lonjakan mencurigakan — kandidat poisoning yang wajib diinvestigasi SEBELUM ditindaklanjuti.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `regen_rate` (dict topik → persen regen, 1 desimal)" },
        { id: "t2", text: "Hitung `mencurigakan` (list hari ke-n dengan thumbs-down > 3× median)" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "regen_rate: tagihan=50.0% jadwal=12.5% saldo=16.7%\nlonjakan_mencurigakan_hari_ke=[12, 13, 14]",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "Mitos: 'thumbs-down melonjak = model memburuk, segera fine-tune ulang.' Belum tentu. Lonjakan mendadak lebih sering berarti: serangan poisoning, perubahan perilaku pengguna, atau topik baru yang belum didukung — bukan penurunan kualitas model. Fine-tune dari data yang diracuni justru menanam racun ke dalam model. Urutannya selalu: investigasi dulu (siapa, kapan, pola apa), vonis kemudian.",
      },
      hints: [
        "regen_rate[t] = regen topik t / total sinyal topik t × 100, bulatkan 1 desimal",
        "median 14 data = rata-rata elemen ke-7 dan ke-8 setelah diurutkan (indeks 6 dan 7)",
        "mencurigakan = [i+1 untuk i, d di DOWN_HARIAN bila d > 3*median]",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# FEEDBACK: (request_id, topik, sinyal) — sinyal: up/down/regen/copy/abandon\nFEEDBACK = [\n    ("q001", "tagihan", "up"), ("q002", "tagihan", "regen"),\n    ("q003", "tagihan", "regen"), ("q004", "tagihan", "down"),\n    ("q005", "tagihan", "regen"), ("q006", "tagihan", "up"),\n    ("q007", "tagihan", "regen"), ("q008", "tagihan", "copy"),\n    ("q009", "tagihan", "abandon"), ("q010", "tagihan", "regen"),\n    ("q011", "jadwal", "up"), ("q012", "jadwal", "copy"),\n    ("q013", "jadwal", "up"), ("q014", "jadwal", "regen"),\n    ("q015", "jadwal", "up"), ("q016", "jadwal", "up"),\n    ("q017", "jadwal", "copy"), ("q018", "jadwal", "down"),\n    ("q019", "saldo", "up"), ("q020", "saldo", "up"),\n    ("q021", "saldo", "copy"), ("q022", "saldo", "up"),\n    ("q023", "saldo", "regen"), ("q024", "saldo", "up"),\n]\n# DOWN_HARIAN: thumbs-down per hari, 14 hari\nDOWN_HARIAN = [4, 6, 5, 7, 4, 5, 6, 5, 4, 6, 5, 58, 71, 80]\n\n# TULIS KODEMU: regen rate per topik + deteksi lonjakan\nregen_rate = \nmencurigakan = \n\nprint(f"regen_rate: tagihan={regen_rate['tagihan']:.1f}% jadwal={regen_rate['jadwal']:.1f}% saldo={regen_rate['saldo']:.1f}%")\nprint(f"lonjakan_mencurigakan_hari_ke={mencurigakan}")`,
        lockLines: 19,
        solution: `# DATA SEED — jangan ubah\n# FEEDBACK: (request_id, topik, sinyal) — sinyal: up/down/regen/copy/abandon\nFEEDBACK = [\n    ("q001", "tagihan", "up"), ("q002", "tagihan", "regen"),\n    ("q003", "tagihan", "regen"), ("q004", "tagihan", "down"),\n    ("q005", "tagihan", "regen"), ("q006", "tagihan", "up"),\n    ("q007", "tagihan", "regen"), ("q008", "tagihan", "copy"),\n    ("q009", "tagihan", "abandon"), ("q010", "tagihan", "regen"),\n    ("q011", "jadwal", "up"), ("q012", "jadwal", "copy"),\n    ("q013", "jadwal", "up"), ("q014", "jadwal", "regen"),\n    ("q015", "jadwal", "up"), ("q016", "jadwal", "up"),\n    ("q017", "jadwal", "copy"), ("q018", "jadwal", "down"),\n    ("q019", "saldo", "up"), ("q020", "saldo", "up"),\n    ("q021", "saldo", "copy"), ("q022", "saldo", "up"),\n    ("q023", "saldo", "regen"), ("q024", "saldo", "up"),\n]\n# DOWN_HARIAN: thumbs-down per hari, 14 hari\nDOWN_HARIAN = [4, 6, 5, 7, 4, 5, 6, 5, 4, 6, 5, 58, 71, 80]\n\n# TULIS KODEMU: regen rate per topik + deteksi lonjakan\ntopik = {}\nfor _, t, s in FEEDBACK:\n    tot, reg = topik.get(t, (0, 0))\n    topik[t] = (tot + 1, reg + (s == "regen"))\nregen_rate = {t: round(reg / tot * 100, 1) for t, (tot, reg) in topik.items()}\n\nurut = sorted(DOWN_HARIAN)\nmedian = (urut[len(urut) // 2 - 1] + urut[len(urut) // 2]) / 2\nmencurigakan = [i + 1 for i, d in enumerate(DOWN_HARIAN) if d > 3 * median]\n\nprint(f"regen_rate: tagihan={regen_rate['tagihan']:.1f}% jadwal={regen_rate['jadwal']:.1f}% saldo={regen_rate['saldo']:.1f}%")\nprint(f"lonjakan_mencurigakan_hari_ke={mencurigakan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "regen_rate", value: { tagihan: 50.0, jadwal: 12.5, saldo: 16.7 }, label: "`regen_rate` sesuai hitungan", msg: "tagihan 5/10 regen (50.0%), jadwal 1/8 (12.5%), saldo 1/6 (16.7%)." },
          { kind: "equal", task: "t2", name: "mencurigakan", value: [12, 13, 14], label: "`mencurigakan` = hari 12–14", msg: "Median 14 data = (5+6)/2 = 5.5; ambang 16.5 hanya dilewati 58, 71, 80." },
          { kind: "stdout_matches", task: "t3", pattern: "tagihan=50\\.0%\\s+jadwal=12\\.5%\\s+saldo=16\\.7%", label: "`print` menampilkan regen_rate", msg: "Format: regen_rate: tagihan=50.0% jadwal=12.5% saldo=16.7%." },
          { kind: "stdout_matches", task: "t3", pattern: "lonjakan_mencurigakan_hari_ke=\\[12, 13, 14\\]", label: "`print` menampilkan hari mencurigakan", msg: "Format: lonjakan_mencurigakan_hari_ke=[12, 13, 14]." },
        ],
      },
      reference: "Skema: request_id + konteks + respons + sinyal + timestamp. Redact PII, karantina anomali, stratifikasi sampel review, tutup loop dengan dasbor konversi.",
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
        "Observability = log (prompt, response, token, latensi, versi) + trace (span per tahap) + metrik (kualitas, operasional, ekonomi).",
        "Monitor p95, bukan rata-rata; kontrak SLA ditulis dalam persentil.",
        "Atribusi kegagalan per tahap sebelum menyalahkan model — mayoritas masalah RAG ada di retrieval.",
        "Log sensitif: redact PII, retensi pendek, agregat 100 persen + sampel trace yang hemat.",
        "Eval kontinu (sampel harian) menangkap penurunan kualitas dalam hitungan hari.",
      ],
      next: { label: "AIE9 — Safety: Prompt Injection dan Red Teaming", href: "/v2/learn/aie9-safety" },
      quiz: [
        {
          q: "Mengapa log prompt dan response penting?",
          options: [
            { text: "Agar insiden bisa direproduksi dan dilacak ke tahap penyebabnya", why: "Tepat: tanpa log, debugging adalah menebak — seperti tiga hari di cerita pembuka.", correct: true },
            { text: "Agar tagihan API lebih murah", why: "Log tidak mengubah tagihan.", correct: false },
            { text: "Agar model menjadi lebih pintar", why: "Log tidak melatih model.", correct: false },
            { text: "Karena semua perusahaan wajib menyimpan semua data selamanya", why: "Justru retensi harus dibatasi, terutama untuk data sensitif.", correct: false },
          ],
        },
        {
          q: "Mengapa p95 lebih baik dari rata-rata untuk monitoring latensi?",
          options: [
            { text: "Rata-rata disembunyikan mayoritas cepat; p95 menangkap pengalaman 5 persen terburuk", why: "Tepat: lab menunjukkan rata-rata ~400ms sementara p95 5.200ms — dua cerita berbeda.", correct: true },
            { text: "p95 selalu lebih kecil dari rata-rata", why: "Kebalikannya: p95 biasanya lebih besar.", correct: false },
            { text: "Rata-rata tidak bisa dihitung dari log", why: "Sangat bisa; hanya kurang informatif untuk SLA.", correct: false },
            { text: "p95 lebih mudah dihitung", why: "p95 butuh sorting; rata-rata lebih mudah.", correct: false },
          ],
        },
        {
          q: "Jawaban chatbot buruk. Langkah pertama yang benar?",
          options: [
            { text: "Ganti ke model yang lebih besar", why: "Tanpa atribusi, ini mahal dan sering salah sasaran.", correct: false },
            { text: "Lihat trace: tahap mana yang pertama menyimpang", why: "Tepat: atribusi dulu — 60 persen kasus ternyata retrieval, bukan model.", correct: true },
            { text: "Tambah contoh few-shot", why: "Mungkin membantu, tetapi buta tanpa tahu tahap yang gagal.", correct: false },
            { text: "Naikkan temperature", why: "Temperature tidak memperbaiki retrieval kosong.", correct: false },
          ],
        },
        {
          q: "Bahaya menyimpan 100 persen log prompt mentah?",
          options: [
            { text: "Bom PII: data nasabah tersimpan tanpa redact, retensi, dan kontrol akses", why: "Tepat: risiko privasi dan kepatuhan jauh melampaui manfaat debuggingnya.", correct: true },
            { text: "Log mentah membuat model lebih lambat", why: "Log tidak memengaruhi kecepatan model.", correct: false },
            { text: "Log mentah tidak bisa dibaca manusia", why: "Sangat bisa dibaca — justru itu masalahnya untuk data sensitif.", correct: false },
            { text: "Tidak ada bahaya sama sekali", why: "Berbahaya: PII + biaya + risiko hukum.", correct: false },
          ],
        },
        {
          q: "Metrik kualitas vs metrik operasional — contoh yang benar?",
          options: [
            { text: "Kualitas: pass rate, thumbs-down; Operasional: p95 latensi, cost/request", why: "Tepat: kualitas = jawaban benar; operasional = sistem sehat dan hemat.", correct: true },
            { text: "Kualitas: p95 latensi; Operasional: pass rate", why: "Tertukar.", correct: false },
            { text: "Keduanya sama saja", why: "Beda fungsi: alarm operasional vs vonis kualitas.", correct: false },
            { text: "Hanya metrik ekonomi yang penting", why: "Murah tetapi ngawur bukan kesuksesan.", correct: false },
          ],
        },
      ],
    },
  ],
};
