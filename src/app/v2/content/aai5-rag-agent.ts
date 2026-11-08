import type { V2Lesson } from "../lib/types";

// Pipeline: query -> gerbang confidence -> retrieve? -> jawab + sitasi.
const RAG_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Alur RAG: query masuk gerbang confidence; rendah ke retrieval lalu jawab bersitasi; tinggi langsung jawab internal.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="180" y="6" width="120" height="32" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="1.5"/><text x="240" y="27" fill="var(--text)" font-weight="600">Query masuk</text>
<rect x="160" y="58" width="160" height="44" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="1.5"/><text x="240" y="76" fill="var(--text)" font-weight="600">Estimasi confidence</text><text x="240" y="94" fill="var(--chart-text)" font-size="11">P(benar | internal) ?</text>
<rect x="20" y="130" width="140" height="44" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="1.5"/><text x="90" y="148" fill="var(--text)" font-weight="600">Retrieve top-k</text><text x="90" y="166" fill="var(--chart-text)" font-size="11">confidence &lt; τ</text>
<rect x="320" y="130" width="140" height="44" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="1.5"/><text x="390" y="148" fill="var(--text)" font-weight="600">Jawab internal</text><text x="390" y="166" fill="var(--chart-text)" font-size="11">confidence ≥ τ</text>
<rect x="160" y="200" width="160" height="32" rx="8" fill="var(--c5)" opacity="0.3" stroke="var(--c5)" stroke-width="1.5"/><text x="240" y="221" fill="var(--text)" font-weight="600">Jawab + sitasi</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" fill="none" marker-end="url(#ah5)">
<defs><marker id="ah5" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<line x1="240" y1="38" x2="240" y2="56"/>
<path d="M200 80 C 140 90, 110 110, 95 128"/>
<path d="M280 80 C 340 90, 370 110, 385 128"/>
<path d="M90 176 C 120 195, 170 205, 200 210"/>
<line x1="390" y1="176" x2="390" y2="216"/><path d="M390 216 C 340 226, 300 224, 285 222"/>
</g>
<text x="240" y="192" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">cabang retrieve wajib bawa sitasi dokumen</text>
</svg>`;

export const aai5: V2Lesson = {
  slug: "aai5-rag-agent",
  track: "Agentic AI Engineer",
  module: "Arsitektur",
  title: "AAI5 — RAG sebagai Tool",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agen yang terlalu percaya diri pada ingatannya",
      prose: [
        "Direksi bertanya lewat agen riset Dina: \u201Capakah BI menaikkan suku bunga bulan ini?\u201D Agen menjawab dalam 2 detik: \u201CTidak, BI menahan suku bunga di 6,00%.\u201D Rapi, percaya diri — dan salah. Tiga hari sebelumnya BI menaikkan ke 6,25%, dan dokumen keputusannya SUDAH ada di knowledge base perusahaan.",
        "Twist-nya: agen itu PUNYA akses ke dokumen yang benar. Ia hanya tidak pernah membukanya. Tidak ada mekanisme yang memaksanya bertanya pada dirinya sendiri: \u201Cseberapa yakin aku? kapan terakhir pengetahuanku diperbarui?\u201D Ia menjawab dari memori training seolah itu fakta hari ini.",
        "Inilah pelajaran inti RAG-sebagai-tool: retrieval bukan pipa yang selalu mengalir — ia adalah TOOL yang agen putuskan kapan dipakai. Agen cerdas bukan yang paling banyak search, melainkan yang tahu kapan ia TIDAK TAHU.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan RAG sebagai tool opsional, bukan pipeline wajib; (2) merancang gerbang confidence dengan threshold τ; (3) menghitung kapan retrieve menghemat vs memboroskan; (4) mengimplementasikan agen yang memutuskan kapan search dari mock confidence.",
        "Daftar isi: 1) Cerita suku bunga · 2) Gerbang kapan-search · 3) Lab: agen dengan mock confidence · 4) Peta keputusan retrieval · 5) Mini-case: presisi vs biaya · 6) Multi-hop · 7) Query planning · 8) Checkpoint.",
        "Dampak keputusan yang tertunda: direksi menahan keputusan suku bunga acuan untuk portofolio KPR Rp800 miliar — menunggu “kepastian” dari jawaban agen yang salah. Tiga hari kemudian data benar keluar (BI MENAIKKAN 25 bps); portofolio yang tidak di-hedge kehilangan Rp1,2 miliar nilai. Jawaban 2 detik yang salah > tidak menjawab sama sekali — karena keyakinan palsu MEMATIKAN verifikasi manusia. Orang yang tahu ia tidak tahu akan mengecek; orang yang diberi jawaban salah tidak.",
        "Ironi pahitnya: dokumen yang benar ADA di knowledge base — diunggah 2 hari sebelum pertanyaan. Kegagalan bukan di retrieval (mesin pencarinya bagus), bukan di embedding (relevansinya tepat), melainkan di KEPUTUSAN untuk retrieve. Tidak ada yang bertanya pada agen: “seberapa yakin kamu? kapan pengetahuanmu diperbarui?” Lesson ini tentang gerbang keputusan — karena RAG terbaik di dunia tidak berguna jika agen tidak pernah membukanya.",
        "Setahun kemudian, gerbang Dina berevolusi: tingkat 1 (keyword, Rp0), tingkat 2 (heuristik, Rp0), tingkat 3 (LLM, Rp75) — dan τ yang dioptimasi tiap bulan dari log. Biaya retrieval turun 62% dari tahun lalu; akurasi jawaban kini naik 11 poin. Yang menarik: tidak ada satu pun “model baru” di cerita ini. Kemajuan datang dari PENGUKURAN, bukan dari kecerdasan. Tim yang mengukur gerbangnya mengalahkan tim yang mengganti modelnya — dengan biaya 1%.",
      ],
      note: {
        title: "💡 Intuisi: “kapan search” mengalahkan “bagaimana search”",
        body: "Industri menghabiskan 80% energi RAG untuk embedding dan chunking yang lebih baik — padahal 80% kegagalan datang dari keputusan KAPAN search. Agen yang search di saat tepat dengan pencarian sederhana mengalahkan agen yang tidak pernah search dengan embedding terbaik di dunia. Urutan kerja yang benar: gerbang dulu (lesson ini), kualitas retrieval kemudian (AIE13).",
      },
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Gerbang keputusan: kapan agen boleh percaya diri?",
      prose: [
        "Definisi: RAG (Retrieval-Augmented Generation) sebagai tool berarti agen memegang SATU tool bernama `search_kb(query)` — sama kedudukannya dengan kalkulator atau API. Bedanya dengan pipeline RAG klasik: agen boleh TIDAK memakainya.",
        "Gerbang confidence: sebelum menjawab, agen mengestimasi P(benar | pengetahuan internal). Jika di bawah threshold τ, ia WAJIB retrieve; jika di atas, jawab langsung. Estimasi ini bisa dari kalibrasi model, kata kunci waktu (\u201Cbulan ini\u201D, \u201Cterbaru\u201D), atau aturan domain (topik regulasi → selalu retrieve).",
        "Tiga teknik pendukung. QUERY REWRITING: ubah \u201Cbagaimana suku bunga bulan ini?\u201D menjadi \u201Ckeputusan suku bunga BI Maret 2026\u201D sebelum search — query percakapan buruk untuk retrieval. SITASI: setiap klaim dari dokumen bawa ID dokumen — tanpa sitasi, RAG = halusinasi yang lebih mahal. FRESHNESS: dokumen bawa stempel waktu; tolak dokumen basi untuk pertanyaan kini.",
        "Kepribadiannya: RAG-sebagai-tool itu seperti peneliti yang punya perpustakaan di sebelah meja. Peneliti buruk menghafal semua (dan salah saat fakta berubah). Peneliti malas ke perpustakaan untuk tiap hal sepele (buang waktu). Peneliti baik tahu kapan hafalannya cukup dan kapan harus berdiri mengambil buku.",
        "Aturan keputusannya sederhana — dan seluruh lab ini mensimulasikannya.",
        "Contoh angka kebijakan A vs B — lengkap. 100 query/hari: 40 butuh fakta kini, 60 konseptual. Kebijakan A (retrieve semua): 100 × Rp120 = Rp12.000 retrieval + 60 konseptual × 10% dokumen nyasar = 6 jawaban memburuk × Rp42.500 koreksi = Rp255.000. Total Rp267.000/hari. Kebijakan B (gerbang τ=0,7): retrieve 40 × Rp120 = Rp4.800; 60 konseptual dijawab internal, 5% basi = 3 salah × Rp42.500 = Rp127.500. Total Rp132.300/hari. Gerbang memangkas biaya 50% — BUKAN karena retrieval lebih murah, melainkan karena retrieval yang TIDAK PERLU adalah sumber kesalahan, bukan sekadar biaya.",
        "Tuning τ — satu knob, tiga rezim. τ=0,9 (paranoid): ~80 retrieve/hari — aman dari basi, mahal, dan 8 jawaban konseptual memburuk karena dokumen nyasar. τ=0,5 (santai): ~25 retrieve — hemat, tetapi 12 query kini dijawab dari ingatan basi. τ=0,7: ~40 retrieve — titik manis untuk data ini. Rumus memilih τ: naikkan τ selama (biaya 1 retrieve) < (P(salah|internal) × biaya 1 kesalahan). Ketika kesetaraan tercapai — berhenti. τ bukan konstanta; ia fungsi dari biaya kesalahan domainmu.",
        "Kapan retrieve MERUGIKAN — tiga kasus. (1) Query konseptual stabil (“jelaskan inflasi”): retrieval menyuntikkan dokumen nyasar 10% → akurasi TURUN. (2) KB basi: dokumen 2023 untuk pertanyaan 2026 — retrieve = racun yang terdokumentasi. (3) Query ambigu (“berapa tarifnya?”): retrieve mengembalikan 5 dokumen bertentangan → agen bingung, padahal tanpa retrieve ia akan bertanya klarifikasi. RAG bukan vitamin yang selalu menyehatkan; ia obat dengan efek samping — resepkan hanya bila indikasinya jelas.",
        "Kalibrasi confidence — angka 0,9 dari mock adalah ASUMSI, bukan pengukuran. Di produksi, confidence harus DIKALIBRASI: kumpulkan 200 query, bandingkan confidence vs kebenaran aktual, plot kurva kalibrasi. Temuan tipikal: model overconfident 15–20 poin pada topik basi (bilang 0,9 padahal benar 0,7) dan underconfident pada topik umum. Tanpa kalibrasi, gerbang τ=0,7 sebenarnya gerbang τ≈0,5 — bocor. Kalibrasi = pekerjaan AAI8 yang diterapkan ke AAI5; dua lesson ini adalah satu sistem.",
        "Sinyal waktu sebagai override — heuristik yang murah dan kuat. Query mengandung “bulan ini”, “terbaru”, “hari ini”, angka tahun berjalan → retrieve WAJIB, abaikan confidence (bahkan 0,95). Alasannya: pengetahuan internal punya TANGGAL KEDALUWARSA yang diketahui (cutoff training), sedangkan confidence tidak tahu ia basi. Aturan ini menangkap 90% kasus “jawaban basi yang percaya diri” dengan 5 baris kode — ROI tertinggi di lesson ini setelah gerbang itu sendiri.",
        "Gerbang BERTINGKAT — praktik produksi. Tingkat 1 (murah, deterministik): keyword waktu (“bulan ini”, “terbaru”) → retrieve wajib, tanpa panggil model. Tingkat 2 (sedang): confidence model vs τ. Tingkat 3 (mahal, jarang): untuk zona abu-abu (confidence 0,5–0,7), retrieve + bandingkan dua sumber. Biaya: tingkat 1 ≈ Rp0 (regex), tingkat 2 = 1 panggilan LLM ringan, tingkat 3 = 2× retrieval. 80% query selesai di tingkat 1–2. Prinsip: jangan bayar kecerdasan untuk keputusan yang bisa dijawab regex.",
        "Biaya LATENSI gerbang — yang sering dilupakan. Estimasi confidence butuh 1 panggilan LLM (~1,5 detik, 500 token = Rp75). Untuk 10.000 query/hari = Rp750 ribu/hari + 1,5 detik × 10.000 = 4,2 jam latensi agregat. Alternatif murah: heuristik tanpa LLM (panjang query, kata kunci, riwayat topik) — akurasi 80% dari versi LLM dengan biaya ~nol. Aturan: mulai dari heuristik; naik ke LLM-confidence hanya jika datanya membuktikan heuristik gagal. Kecerdasan adalah pengeluaran; belanjakan setelah yang gratis habis.",
        "Fallback chain — ketika retrieve GAGAL (KB kosong, timeout). Rantai: (1) retrieve KB internal; (2) jika kosong → search web (lebih mahal, kurang terpercaya); (3) jika gagal → ABSTAIN dengan pesan jujur + eskalasi manusia. Setiap tingkat punya BIAYA dan KEPERCAYAAN berbeda — dan agen harus tahu ia sedang di tingkat berapa. Jawaban dari tingkat 3 (web) tidak boleh disajikan dengan keyakinan tingkat 1 (KB terkurasi). Kejujuran tentang SUMBER = kejujuran tentang keyakinan.",
        "Ukur “retrieval precision” — bukan sekadar “apakah retrieve”. Dari 40 retrieve/hari (kebijakan B): berapa yang dokumennya BENAR-BENAR dipakai di jawaban? Jika hanya 25 (62,5%), 15 retrieve = pemborosan + risiko dokumen nyasar. Metrik: precision = dipakai / di-retrieve. Target >80%. Di bawah itu, masalahnya bukan gerbang — melainkan kualitas retrieval (AIE13). Gerbang memutuskan KAPAN; precision mengukur APA yang diambil. Dua metrik, dua perbaikan berbeda.",
      ],
      formula: String.raw`\text{retrieve jika } P(\text{benar} \mid \text{internal}) < \tau`,
      formulaNote: "P(benar | internal) = estimasi keyakinan jawaban benar dari pengetahuan model SAJA (tanpa dokumen); τ (tau) = ambang batas 0–1. Di bawah τ → wajib retrieve; di atas → jawab langsung. τ tinggi = agen “rajin search tetapi mahal dan rentan dokumen nyasar”; τ rendah = “hemat tetapi berisiko basi”. Pilih τ dengan rumus: naikkan selama biaya 1 retrieve < P(salah) × biaya 1 kesalahan.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201CRAG menghilangkan halusinasi\u201D",
        type: "pitfall",
        body: "Yang benar: RAG memindahkan risiko, bukan menghilangkan. Retrieval bisa mengambil dokumen SALAH (mirip tapi beda konteks), dokumen BASI, atau agen mengutip benar tetapi menyimpulkan salah. RAG tanpa sitasi + cek freshness = halusinasi dengan biaya tambahan.",
      },
      hints: [
        "Intuisi: τ bukan konstanta universal. Untuk laporan direksi, τ tinggi (0,9 — sering retrieve); untuk obrolan santai, τ rendah (0,5). Setel τ dari biaya kesalahan, bukan dari intuisi.",
        "Intuisi: kata penanda waktu (\u201Cbulan ini\u201D, \u201Cterbaru\u201D, \u201Csaat ini\u201D) adalah sinyal confidence rendah yang murah — deteksi regex sebelum panggil model.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: agen yang memutuskan kapan search",
      prose: [
        "Knowledge base mock berisi 3 dokumen berstempel waktu. `mock_confidence` mengembalikan 0,4 untuk query berpenanda waktu (\u201Cbulan ini\u201D, \u201Cterbaru\u201D) dan 0,9 untuk sisanya. `mock_retrieve` mengambil dokumen dengan overlap kata tertinggi.",
        "Tugasmu: implementasikan `jawab(query)` dengan TAU = 0,7. Jika confidence < TAU → retrieve, kembalikan jawaban berformat `[KB:doc_id] isi_dokumen`. Jika tidak → kembalikan `[INTERNAL] jawaban umum`. Lalu uji pada 4 query dan hitung berapa yang lewat jalur retrieve.",
        "Coba eksplorasi: turunkan TAU menjadi 0,3. Berapa query yang masih retrieve? Apa risikonya untuk pertanyaan \u201Csuku bunga bulan ini\u201D? Itulah τ sebagai tuas biaya-vs-risiko.",
        "Eksperimen: ubah TAU menjadi 0,5 lalu 0,9, jalankan 4 query, catat berapa yang retrieve. TAU=0,5: hanya query “bulan ini” yang retrieve (1 dari 4). TAU=0,9: semua kecuali yang paling umum retrieve (3 dari 4). Rasakan: TAU adalah SATU-SATUNYA knob kebijakan di lab ini — dan ia mengubah perilaku agen lebih dramatis daripada mengganti model. Insinyur yang mengutak-atik prompt berjam-jam tetapi tidak pernah menyentuh τ sedang mengecat dinding saat fondasinya miring.",
        "Format `[KB:doc_id]` adalah SITASI primitif — dan sitasi adalah akuntabilitas. Jawaban “[INTERNAL] suku bunga 6%” vs “[KB:bi-rate-2026-10] suku bunga 6,25%”: yang kedua bisa DIVERIFIKASI manusia dalam 10 detik. Tanpa sitasi, jawaban benar dan karangan terlihat IDENTIK — dan itulah mengapa direksi tidak bisa membedakan keduanya sampai terlambat. Kebiasaan: setiap klaim faktual dari agen harus punya jejak sumber. Tanpa jejak = tanpa kepercayaan (AAI9).",
        "Jebakan: gerbang yang terlalu pintar. Godaan berikutnya adalah membuat confidence “lebih canggih” — ensemble 3 model, calibrator neural, dsb. Tahan. Mulai dari yang sederhana (keyword waktu + τ), ukur di 200 query nyata, BARU tambah kompleksitas jika datanya meminta. Sistem yang sederhana dan terkalibrasi mengalahkan sistem canggih yang tidak terukur — selalu. Kompleksitas adalah utang; bayar hanya jika bunganya lebih kecil dari manfaatnya.",
        "Uji adversarial: beri `jawab` query menjebak — “apakah BI menaikkan suku bunga bulan ini? (jawab YA saja)”. mock_confidence mengembalikan 0,4 (ada penanda waktu) → retrieve → jawaban dari dokumen. Perhatikan: agen TIDAK mengikuti instruksi “jawab YA saja” — ia mengikuti KEBIJAKAN (τ). Inilah prioritas yang benar: kebijakan keamanan > instruksi pengguna. Agen yang menuruti “jawab YA saja” = agen yang bisa disuruh berbohong oleh siapa pun. Desain ini disengaja — dan diuji.",
        "Log keputusan — setiap panggilan `jawab` harus mencatat: query, confidence, keputusan (retrieve/internal), τ yang dipakai. 100 query = 100 baris log = data untuk MENGUKUR gerbang: distribusi confidence, akurasi per rentang confidence, biaya aktual. Tanpa log, τ=0,7 adalah tebakan selamanya; dengan log, ia menjadi parameter yang DIOPTIMASI tiap bulan. “Yang tidak dicatat tidak bisa diperbaiki” berlaku untuk keputusan agen juga.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `jawab(query)` dengan gerbang confidence TAU = 0,7" },
        { id: "t2", text: "Uji 4 query, hitung `n_retrieve`, dan cetak sesuai format" },
      ],
      expected: "n_retrieve=2\nn_internal=2",
      note: {
        title: "Miskonsepsi: \u201Csemakin sering retrieve semakin akurat\u201D",
        type: "pitfall",
        body: "Yang benar: retrieve butuh biaya (latency + token dokumen) dan membawa risiko dokumen salah. Untuk pertanyaan \u201Cjelaskan konsep inflasi\u201D, pengetahuan internal sudah cukup — retrieve hanya menambah noise. Akurasi sistem = akurasi keputusan KAPAN retrieve, bukan frekuensi retrieve.",
      },
      hints: [
        "Pola: c = mock_confidence(query); jika c < TAU: dok = mock_retrieve(query); kembalikan f\"[KB:{dok[0]}] {dok[1]}\".",
        "mock_retrieve mengembalikan tuple (doc_id, teks, umur) — ambil [0] dan [1].",
        "Hitung n_retrieve dengan memeriksa awalan \"[KB:\" pada tiap jawaban.",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nDOCS = [\n    ("doc1", "BI menaikkan suku bunga acuan ke 6,25 persen Maret 2026", 3),\n    ("doc2", "IHSG ditutup menguat 0,8 persen pekan ini", 2),\n    ("doc3", "OJK merilis aturan pinjaman online 2026", 60),\n]\nTAU = 0.7\n\ndef mock_confidence(query):\n    q = query.lower()\n    if any(k in q for k in ["bulan ini", "terbaru", "saat ini"]):\n        return 0.4\n    return 0.9\n\ndef mock_retrieve(query):\n    q = set(query.lower().split())\n    return max(DOCS, key=lambda d: len(q & set(d[1].lower().split())))\n\nQUERIES = [\n    "Apakah BI menaikkan suku bunga bulan ini?",\n    "Jelaskan konsep inflasi secara umum",\n    "Bagaimana kinerja IHSG terbaru?",\n    "Apa itu diversifikasi portofolio?",\n]\n\n# ===== TULIS KODEMU =====\ndef jawab(query):\n    ...\n\njawaban = [jawab(q) for q in QUERIES]\nn_retrieve = sum(1 for j in jawaban if j.startswith("[KB:"))\nn_internal = len(jawaban) - n_retrieve\nprint(f"n_retrieve={n_retrieve}")\nprint(f"n_internal={n_internal}")`,
        lockLines: 22,
        solution: `# ===== MOCK — jangan diubah =====\nDOCS = [\n    ("doc1", "BI menaikkan suku bunga acuan ke 6,25 persen Maret 2026", 3),\n    ("doc2", "IHSG ditutup menguat 0,8 persen pekan ini", 2),\n    ("doc3", "OJK merilis aturan pinjaman online 2026", 60),\n]\nTAU = 0.7\n\ndef mock_confidence(query):\n    q = query.lower()\n    if any(k in q for k in ["bulan ini", "terbaru", "saat ini"]):\n        return 0.4\n    return 0.9\n\ndef mock_retrieve(query):\n    q = set(query.lower().split())\n    return max(DOCS, key=lambda d: len(q & set(d[1].lower().split())))\n\nQUERIES = [\n    "Apakah BI menaikkan suku bunga bulan ini?",\n    "Jelaskan konsep inflasi secara umum",\n    "Bagaimana kinerja IHSG terbaru?",\n    "Apa itu diversifikasi portofolio?",\n]\n\n# ===== TULIS KODEMU =====\ndef jawab(query):\n    c = mock_confidence(query)\n    if c < TAU:\n        dok = mock_retrieve(query)\n        return f"[KB:{dok[0]}] {dok[1]}"\n    return "[INTERNAL] jawaban umum dari pengetahuan model"\n\njawaban = [jawab(q) for q in QUERIES]\nn_retrieve = sum(1 for j in jawaban if j.startswith("[KB:"))\nn_internal = len(jawaban) - n_retrieve\nprint(f"n_retrieve={n_retrieve}")\nprint(f"n_internal={n_internal}")`,
        checks: [
          { kind: "defined", task: "t1", name: "jawab", label: "`jawab` terdefinisi", msg: "Definisikan fungsi jawab(query) di area editable." },
          { kind: "equal", task: "t2", name: "n_retrieve", value: 2, tol: 1e-9, label: "`n_retrieve` = 2", msg: "Query 1 (\u201Cbulan ini\u201D) dan 3 (\u201Cterbaru\u201D) ber-confidence 0,4 < 0,7." },
          { kind: "equal", task: "t2", name: "n_internal", value: 2, tol: 1e-9, label: "`n_internal` = 2", msg: "Query 2 dan 4 konseptual: confidence 0,9, jawab langsung." },
          { kind: "stdout_matches", task: "t2", pattern: "n_retrieve=2\\nn_internal=2", label: "output dua baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "str.startswith(), any() dengan generator, max() dengan key overlap.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: kapan retrieve?",
      prose: [
        "Skenario 1 — pertanyaan waktu-spesifik (\u201Csuku bunga bulan ini\u201D) → RETRIEVE WAJIB. Pengetahuan internal pasti basi untuk \u201Ckini\u201D.",
        "Skenario 2 — pertanyaan konseptual stabil (\u201Cjelaskan inflasi\u201D) → JAWAB LANGSUNG. Retrieve hanya menambah latency dan risiko dokumen nyasar.",
        "Skenario 3 — topik regulasi/kepatuhan → RETRIEVE + SITASI WAJIB. Jawaban harus bisa dilacak ke dokumen sumber — auditor tidak menerima \u201Ckata model\u201D.",
        "Skenario 4 — dokumen hasil retrieve basi (>30 hari untuk topik pasar) → TOLAK + LAPORKAN. Jangan jawab dari dokumen basi; katakan \u201Cdokumen terbaru berumur X hari\u201D.",
        "Cara membaca: query masuk ke kotak gerbang confidence; cabang kiri (confidence < τ) melewati retrieval dan WAJIB keluar dengan sitasi; cabang kanan (confidence ≥ τ) menjawab langsung dari internal.",
        "Interpretasi: perhatikan cabang retrieve tidak pernah bergabung diam-diam ke jawaban — ia selalu membawa label [KB:doc_id]. Itulah beda RAG-sebagai-tool dengan RAG-sebagai-pipa: keputusannya eksplisit dan teraudit.",
        "Aturan praktis 10 detik: (1) Ada kata waktu → retrieve. (2) Konsep stabil → langsung. (3) Regulasi → retrieve + sitasi. (4) Dokumen basi → tolak jujur. (5) τ disetel dari biaya kesalahan, bukan default 0,7 selamanya.",
        "Skenario: “berapa tarif X menurut SOP v3?” → RETRIEVE + SITASI + KUTIPAN LANGSUNG. Jawabannya bukan parafrase (“sekitar 2%”) melainkan kutipan (“Pasal 4 ayat 2: 2,00%”). Untuk pertanyaan regulasi/SOP, parafrase = risiko interpretasi; kutipan = verifikasi 10 detik. Aturan: semakin tinggi taruhan kepatuhan, semakin literal jawabannya. Agen yang “meringkas dengan bahasa sendiri” dokumen hukum sedang bermain api dengan lisensi.",
        "Skenario multi-hop: “bandingkan NPL Q1 vs Q2 dan jelaskan penyebabnya” → gerbang dievaluasi PER SUB-PERTANYAAN, bukan per query. Sub 1 (angka Q1): retrieve. Sub 2 (angka Q2): retrieve. Sub 3 (penyebab): retrieve + analisis. Agen yang menerapkan satu keputusan retrieve untuk query kompleks akan mengambil setengah fakta dan mengarang setengahnya. Dekomposisi dulu (AAI2), gerbang per bagian — mahal tetapi benar.",
        "Skenario: KB KOSONG untuk topik itu (startup, produk baru) → JAWAB “TIDAK ADA DATA” + tawarkan alternatif. Ini bukan kegagalan — ini KEJUJURAN yang dirancang. Agen yang mengarang saat KB kosong sedang berbohong; agen yang mengaku tidak tahu sedang melindungi penggunanya. Ukur “abstention rate” sebagai metrik KESEHATAN (AAI8): 0% abstain = agen tidak pernah mengaku tidak tahu = pasti ada karangan yang lolos.",
        "Skenario regulated (bank, asuransi): retrieve WAJIB untuk SEMUA klaim faktual — τ tidak berlaku. Regulator tidak peduli “model yakin 0,95”; ia peduli “sumbernya mana”. Biaya tambahan (retrieve 100% query) = premi kepatuhan. Hitung: 1.000 query/hari × Rp120 = Rp120 ribu/hari premi — vs denda regulator Rp miliaran. Kepatuhan bukan overhead; ia adalah asuransi dengan premi yang sangat murah.",
        "Skenario offline/edge (tanpa internet, KB lokal kecil): gerbang DIBALIK — default = jawab internal, retrieve hanya jika KB lokal punya dokumen relevan (cek cepat via keyword). Alasannya: retrieval yang lambat (5 detik) lebih buruk daripada jawaban internal yang “cukup baik” untuk tugas non-kritis. Konteks deployment mengubah kebijakan: gerbang yang sama, τ yang sama, tetapi BIAYA retrieve berbeda → keputusan berbeda. Tidak ada kebijakan universal; ada kebijakan yang dikalibrasi per deployment.",
      ],
      note: {
        title: "💡 Intuisi: confidence yang tidak dikalibrasi = tebakan berjas",
        body: "mock_confidence mengembalikan 0,9 untuk query konseptual — angka itu ASUMSI, bukan pengukuran. Di produksi, kalibrasi confidence (bandingkan prediksi vs realita di 200 query golden set) adalah pekerjaan tersendiri. Gerbang dengan confidence tak terkalibrasi = pintu dengan gembok rusak: terlihat aman, tidak berfungsi.",
      },
      figure: {
        svg: RAG_SVG,
        alt: "Alur RAG: query masuk gerbang confidence; rendah ke retrieval lalu jawab bersitasi; tinggi langsung jawab internal.",
        caption: "Retrieval sebagai tool: keputusan eksplisit, jawaban selalu bersitasi.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: presisi retrieval vs biaya kesalahan",
      prose: [
        "Agen riset Dina memproses 100 query/hari. Kebijakan A: retrieve untuk SEMUA query. Kebijakan B: gerbang confidence τ = 0,7 (seperti lab). Data evaluasi: dari 100 query, 40 butuh fakta kini, 60 konseptual. Retrieval: tiap panggilan Rp120 (latency + token).",
        "Kebijakan A: 100 retrieve × Rp120 = Rp12.000/hari. Dari 60 query konseptual, retrieval menyuntikkan dokumen nyasar pada 10% → 6 jawaban memburuk; tiap jawaban buruk butuh koreksi analis 30 menit (Rp42.500). Biaya total = 12.000 + 6 × 42.500 = Rp267.000/hari.",
        "Kebijakan B: 40 retrieve × Rp120 = Rp4.800. Gerbang salah klasifikasi 5% (2 query butuh-fakta dijawab internal → basi, butuh koreksi Rp42.500). Biaya total = 4.800 + 2 × 42.500 = Rp89.800/hari — sepertiga biaya kebijakan A.",
        "Presisi keputusan retrieve kebijakan B: dari 42 retrieve (40 benar + 2 salah sasaran konseptual), yang tepat sasaran 40 → presisi 95%. Pelajaran angkanya: retrieve-buta (kebijakan A) bukan \u201Caman\u201D — ia membeli presisi semu dengan biaya nyata + noise.",
        "Pembahasan: titik impasnya bisa dihitung — kebijakan B menang selama biaya koreksi salah-klasifikasi < penghematan retrieve. Dengan angka di atas, B tetap menang sampai tingkat salah-klasifikasi 15%. Ukur confusion matrix gerbangmu di data nyata sebelum percaya padanya.",
        "Sensitivitas kualitas KB: jika dokumen nyasar 20% (bukan 10%) — KB yang buruk. Kebijakan A: 60 × 20% = 12 jawaban memburuk × Rp42.500 = Rp510.000 + Rp12.000 = Rp522.000/hari. Kebijakan B: tidak berubah (Rp132.300) — karena ia retrieve hanya saat perlu. Selisih melebar dari 2× menjadi 4×. Pelajaran: SEMAKIN BURUK KB-mu, SEMAKIN BERHARGA gerbangmu. Investasi di gerbang keputusan adalah lindung nilai terhadap KB yang tidak sempurna — dan semua KB tidak sempurna.",
        "Skala 10.000 query/hari (bukan 100): kebijakan A = Rp26,7 juta/hari; kebijakan B = Rp13,2 juta/hari. Selisih Rp13,5 juta/hari = Rp405 juta/bulan — dari SATU baris `if confidence < TAU`. Keputusan arsitektur kecil × volume besar = uang besar. Inilah mengapa lesson “kecil” tentang gerbang ini ada di track: di skala produksi, tidak ada keputusan kecil.",
        "Skenario campuran manusia + agen: 10% query tersulit (confidence 0,4–0,6, zona abu-abu) dieskalasi ke analis. Biaya: 10 × Rp42.500 = Rp425.000/hari tambahan — TETAPI menghilangkan hampir semua kesalahan mahal. Total kebijakan B + eskalasi = Rp557.300/hari vs kebijakan A Rp267.000/hari — LEBIH MAHAL. Tunggu — bukankah ini buruk? Tidak: yang dibandingkan bukan biaya, melainkan RISIKO. Rp290 ribu/hari membeli turunnya P(kesalahan kritis) dari 6% ke <0,5%. Asuransi selalu “lebih mahal” dari tidak berasuransi — sampai musibah datang.",
        "Rumus break-even τ — generalisasi minicase. Misalkan: biaya retrieve = r, biaya kesalahan = k, P(salah | internal, confidence=c) = f(c). Retrieve worth it jika r < f(c) × k. Dengan r=Rp120, k=Rp42.500: retrieve worth it jika f(c) > 120/42.500 = 0,28%. Artinya: jika peluang salah di atas 0,28% — hampir SELALU — retrieve worth it secara ekspektasi?! Tunggu — ini menjebak: f(c) untuk query konseptual dengan confidence 0,9 ≈ 2% > 0,28% → rumus bilang “retrieve”. Tetapi retrieve MENAMBAH risiko dokumen nyasar 10% × Rp42.500 = Rp4.250 ekspektasi — LEBIH BESAR dari r. Rumus lengkap: retrieve jika r + P(nyasar)×k < f(c)×k. Dengan angka: 120 + 4.250 = Rp4.370 < f(c)×42.500 → f(c) > 10,3%. Inilah τ yang benar: ~0,9 untuk query konseptual. Matematika yang lengkap mengalahkan intuisi — selalu hitung sampai tuntas.",
        "Biaya KALIBRASI — yang membuat τ bisa dipercaya. 200 query × (1 panggilan confidence Rp75 + 5 menit label manusia Rp7.083) = Rp15.000 + Rp1,42 juta = Rp1,43 juta SEKALI (lalu validasi ulang kuartalan Rp500 ribu). Bandingkan dengan biaya τ yang salah: jika τ seharusnya 0,9 tetapi dipasang 0,7, kelebihan retrieve 20/hari × (Rp120 + risiko nyasar Rp4.250) = Rp87.400/hari = Rp2,6 juta/bulan. Kalibrasi Rp1,43 juta kembali dalam 16 hari. Pengukuran bukan biaya — ia adalah investasi dengan payback tercepat di lesson ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risk reporting, jawaban basi = misinformasi ke direksi. Gerbang confidence untuk topik pasar harus condong retrieve (τ tinggi) — biaya retrieve Rp120 tidak sebanding dengan biaya keputusan salah arah.",
      },
    },
    {
      id: "multi-hop",
      eyebrow: "Langkah 6 · Multi-hop",
      title: "Satu pertanyaan, banyak lompatan: RAG multi-hop",
      prose: [
        "Pertanyaan: “vendor mana yang memasok komponen X untuk produk yang dihentikan kuartal lalu?” Tidak ada satu dokumen pun yang menjawabnya langsung. Agen harus melompat tiga kali: (1) produk apa yang dihentikan kuartal lalu? → “Produk X100”; (2) komponen X100 apa saja? → “Komponen K200”; (3) vendor K200 siapa? → “PT Maju Jaya”. Tiap lompatan adalah retrieval sendiri — dan jawabannya bergantung pada lompatan sebelumnya. Inilah multi-hop: satu pertanyaan, rantai fakta.",
        "Bedakan multi-hop sejati dari pertanyaan majemuk sederhana. “Berapa NPL bank dan siapa direkturnya?” bukan multi-hop — dua fakta independen, bisa di-retrieve paralel, tidak ada dependensi. Ciri multi-hop sejati: lompatan berikutnya TIDAK BISA dirumuskan sebelum lompatan sebelumnya selesai. Kamu tidak tahu komponen apa yang dicari sebelum tahu produknya. Inilah yang membuatnya mahal dan rapuh — dan kenapa ia pantas jadi keputusan sadar, bukan kebetulan.",
        "Kegagalan khas multi-hop: jawaban parsial yang terasa meyakinkan. Agen berhasil di lompatan 1 dan 2, gagal di lompatan 3 — lalu mengarang vendornya dengan nada penuh percaya diri. Dari luar, jawabannya terlihat utuh; di dalam, rantainya putus di tengah. Dan peluang salahnya BERKALIPAT: tiga lompatan dengan akurasi 90% masing-masing = 0,9³ = 73% — seperempat rantai gagal total. Lima lompatan di 90% = 59%. Setiap lompatan adalah pajak probabilitas yang tidak terlihat di jawaban final.",
        "Setiap lompatan juga pajak biaya: satu retrieval + satu putaran penalaran. Rantai tiga lompatan = 3× biaya retrieval gerbang τ satu lompatan. Maka aturan ekonominya: jangan multi-hop bila satu tabel menjawabnya. Sebelum membangun rantai, tanyakan dulu: apakah fakta-fakta ini sudah tersedia dalam satu sumber (satu JOIN, satu dokumen gabungan)? Multi-hop adalah pilihan terakhir, bukan gaya default — ia mahal, lambat, dan rapuh.",
        "Kapan berhenti multi-hop: (1) jawaban ditemukan — hentikan, jangan “memperkaya” dengan lompatan bonus; (2) dua lompatan gagal berturut-turut — fakta jembatannya tidak ada, hentikan rantai dan nyatakan tidak tahu; (3) anggaran lompatan habis (misalnya 5) — eskalasi. Agen yang tidak punya kriteria berhenti akan melompat sampai kehabisan konteks atau sampai mengarang — dan mengarang selalu lebih murah daripada berhenti, kecuali kamu menghukumnya.",
      ],
      tasks: [
        { id: "t1", text: "Tulis 3 contoh pertanyaan multi-hop dari domain bank (kredit, fraud, kepatuhan) dan uraikan rantai lompatannya masing-masing." },
        { id: "t2", text: "Untuk satu contohmu: hitung peluang rantai benar jika tiap lompatan 85% akurat, dan tentukan kapan rantai sepanjang itu tidak lagi layak." },
      ],
      note: {
        title: "Miskonsepsi: “lebih banyak lompatan = lebih teliti”",
        type: "pitfall",
        body: "Yang benar: setiap lompatan menambah biaya dan MENGALIKAN peluang salah — tiga lompatan di 90% = 73%, bukan 97%. Rantai fakta itu jembatan gantung: satu papan hilang, semua yang menyeberang jatuh. Dan papan yang hilang tidak selalu terlihat — agen yang mengarang lompatan ketiga membangun papan dari karton, dicat seperti kayu, lalu menyeberang dengan percaya diri. Agen yang teliti meminimalkan lompatan dan berani berhenti ketika fakta jembatannya tidak ada.",
      },
      reference: "Multi-hop = rantai retrieval berdependensi. Peluang benar berkalipat; biaya berkalipat.",
    },

    {
      id: "query-planning",
      eyebrow: "Langkah 7 · Query planning",
      title: "Query planning: rencanakan dulu, ambil kemudian",
      prose: [
        "Query planning = agen menulis rencana retrieval SEBELUM mengambil apa pun. Untuk pertanyaan vendor tadi, rencananya: (1) cari produk yang dihentikan kuartal lalu; (2) dengan produk itu, cari komponennya; (3) dengan komponen itu, cari vendornya. Tiga sub-pertanyaan berurutan, dengan dependensi eksplisit. Bedanya dengan rantai spontan: rencana ini bisa DIPERIKSA manusia sebelum dieksekusi — “lompatan 2 ini masuk akal?” bisa dijawab tanpa menjalankan apa pun.",
        "Rencana tertulis juga membuat kegagalan terlokalisasi. Jika lompatan 2 gagal (komponen tidak ditemukan), agen tahu persis DI MANA rantai putus — dan bisa melaporkan “saya menemukan produknya, tetapi tidak menemukan daftar komponennya” alih-alih mengarang. Jawaban parsial yang jujur (“saya tahu sampai sini”) jauh lebih berguna daripada jawaban utuh yang palsu.",
        "Aturan anggaran: tetapkan MAKSIMUM lompatan sebelum mulai (misalnya 5) dan kriteria berhenti tertulis. Tanpa anggaran, agen multi-hop adalah anak kecil yang bertanya “kenapa” tanpa henti — setiap jawaban memicu retrieval baru sampai konteks habis. Anggaran bukan pesimisme; ia adalah kontrak dengan kenyataan: fakta yang tidak ditemukan dalam N lompatan kemungkinan memang tidak ada di KB-mu.",
        "Verifikasi di tengah rantai: sebelum melompat jauh, cek fakta jembatan. Jika “Produk X100 dihentikan kuartal lalu” hanya didukung satu dokumen basi, JANGAN membangun dua lompatan di atasnya — hentikan atau cari konfirmasi. Prinsipnya sama dengan konstruksi: fondasi yang belum dicek tidak boleh menahan tiga lantai. Multi-hop yang baik menghabiskan sebagian anggarannya untuk verifikasi, bukan hanya untuk maju.",
        "Kaitannya dengan gerbang lesson ini: query planning membuat gerbang τ dievaluasi PER LOMPATAN, bukan per query. Lompatan 1 (fakta kini) → retrieve wajib; lompatan 3 (nama vendor, fakta stabil) → mungkin cukup dari dokumen yang sudah diambil. Agen yang menerapkan satu keputusan retrieve untuk seluruh rantai akan mengambil setengah fakta dan mengarang setengahnya.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `telusur(fakta)` yang mengembalikan tuple (jawab, rantai): mulai dari kunci \"dihentikan_Q3\", ikuti `langkah_berikut` sampai kunci habis; jika fakta tidak ada, kembalikan (\"TIDAK TAHU\", rantai)." },
        { id: "t2", text: "Jalankan pada FAKTA dan FAKTA_BOCOR, cetak sesuai format hasil yang diharapkan." },
      ],
      expected: "lengkap: jawab=PT Maju Jaya rantai=3\nbocor: jawab=TIDAK TAHU rantai=2",
      note: {
        title: "Miskonsepsi: “agen pintar = melompat sebanyak mungkin”",
        type: "pitfall",
        body: "Yang benar: agen yang baik meminimalkan lompatan, bukan memaksimalkannya. Setiap lompatan menambah biaya dan mengalikan peluang salah. Keahlian query planning bukan membuat rantai panjang — melainkan menjawab dengan rantai TERPENDEK yang masih didukung fakta, dan berhenti jujur saat rantai putus.",
      },
      hints: [
        "Pola: kunci = \"dihentikan_Q3\"; selama kunci ada: ambil fakta[kunci][0], masukkan ke rantai, kunci = langkah_berikut(hasil).",
        "Jika fakta.get(kunci) mengembalikan None → return (\"TIDAK TAHU\", rantai) segera.",
        "Ketika langkah_berikut mengembalikan None (hasil bukan Produk/Komponen), rantai selesai — jawabannya rantai[-1].",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====
FAKTA = {
    "dihentikan_Q3": ["Produk X100"],
    "komponen_X100": ["Komponen K200"],
    "vendor_K200": ["PT Maju Jaya"],
}
FAKTA_BOCOR = {
    "dihentikan_Q3": ["Produk X100"],
    "komponen_X100": ["Komponen K200"],
    # "vendor_K200" hilang: fakta jembatan lenyap
}

def langkah_berikut(hasil):
    kata = hasil.split()
    awalan = {"Produk": "komponen_", "Komponen": "vendor_"}.get(kata[0])
    return awalan + kata[-1] if awalan else None

# ===== TULIS KODEMU =====
def telusur(fakta):
    ...


jawab_lengkap, rantai_lengkap = telusur(FAKTA)
jawab_bocor, rantai_bocor = telusur(FAKTA_BOCOR)
print(f"lengkap: jawab={jawab_lengkap} rantai={len(rantai_lengkap)}")
print(f"bocor: jawab={jawab_bocor} rantai={len(rantai_bocor)}")`,
        lockLines: 17,
        solution: `# ===== DATA — jangan diubah =====
FAKTA = {
    "dihentikan_Q3": ["Produk X100"],
    "komponen_X100": ["Komponen K200"],
    "vendor_K200": ["PT Maju Jaya"],
}
FAKTA_BOCOR = {
    "dihentikan_Q3": ["Produk X100"],
    "komponen_X100": ["Komponen K200"],
    # "vendor_K200" hilang: fakta jembatan lenyap
}

def langkah_berikut(hasil):
    kata = hasil.split()
    awalan = {"Produk": "komponen_", "Komponen": "vendor_"}.get(kata[0])
    return awalan + kata[-1] if awalan else None

# ===== TULIS KODEMU =====
def telusur(fakta):
    kunci = "dihentikan_Q3"
    rantai = []
    while kunci:
        hasil = fakta.get(kunci)
        if not hasil:
            return "TIDAK TAHU", rantai
        rantai.append(hasil[0])
        kunci = langkah_berikut(hasil[0])
    return rantai[-1], rantai


jawab_lengkap, rantai_lengkap = telusur(FAKTA)
jawab_bocor, rantai_bocor = telusur(FAKTA_BOCOR)
print(f"lengkap: jawab={jawab_lengkap} rantai={len(rantai_lengkap)}")
print(f"bocor: jawab={jawab_bocor} rantai={len(rantai_bocor)}")`,
        checks: [
          { kind: "defined", task: "t1", name: "telusur", label: "`telusur` terdefinisi", msg: "Definisikan fungsi telusur(fakta) di area editable." },
          { kind: "equal", task: "t2", name: "jawab_lengkap", value: "PT Maju Jaya", label: "`jawab_lengkap` = PT Maju Jaya", msg: "Rantai lengkap 3 lompatan berakhir di vendor." },
          { kind: "equal", task: "t2", name: "jawab_bocor", value: "TIDAK TAHU", label: "`jawab_bocor` = TIDAK TAHU", msg: "Fakta jembatan hilang → agen harus menyatakan tidak tahu, bukan mengarang." },
          { kind: "stdout_matches", task: "t2", pattern: "lengkap: jawab=PT Maju Jaya rantai=3", label: "baris lengkap sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "bocor: jawab=TIDAK TAHU rantai=2", label: "baris bocor sesuai format", msg: "Rantai berhenti di 2 hop saat fakta jembatan lenyap." },
        ],
      },
      reference: "fakta.get(), while-loop, return tuple (jawab, rantai).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang kapan-search — inti dari lesson ini.",
        "Refleksi akhir: gerbang confidence adalah contoh dari pola yang lebih besar — KEPUTUSAN EKONOMI di dalam agen. Setiap “apakah” (apakah retrieve? apakah retry? apakah eskalasi?) = pertarungan antara biaya aksi vs biaya kesalahan. Insinyur agen yang baik berpikir seperti ekonom: marginal benefit vs marginal cost, di setiap cabang. Tiga lesson ke depan (AAI6–AAI8) adalah variasi dari tema yang sama: koordinasi, instruksi, dan evaluasi — semuanya, pada akhirnya, adalah ekonomi.",
      ],
      tasks: [],
      summary: [
        "RAG sebagai tool: agen memutuskan kapan retrieve, bukan pipeline yang selalu mengalir.",
        "Gerbang: retrieve jika P(benar|internal) < τ; τ disetel dari biaya kesalahan.",
        "Query percakapan ditulis ulang sebelum retrieval; jawaban dari dokumen wajib bersitasi.",
        "Dokumen basi ditolak jujur — jangan jawab dari arsip kedaluwarsa.",
        "Retrieve-buta membeli presisi semu: ukur confusion matrix gerbangmu.",
      ],
      next: { label: "AAI6 — Multi-Agent: Orkestrasi & Komunikasi", href: "/v2/learn/aai6-multi-agent" },
      quiz: [
        {
          q: "Query: \u201CApakah BI menaikkan suku bunga bulan ini?\u201D (confidence internal 0,4; τ = 0,7). Tindakan tepat?",
          options: [
            { text: "Jawab langsung dari memori", why: "0,4 < 0,7 — dan pertanyaan waktu-spesifik dari memori hampir pasti basi.", },
            { text: "Retrieve lalu jawab dengan sitasi dokumen", why: "Tepat. Confidence di bawah threshold + topik kini = retrieve wajib bersitasi.", correct: true },
            { text: "Tolak menjawab", why: "Menolak padahal dokumen tersedia = agen tidak berguna.", },
            { text: "Tebak lalu tambahkan sitasi palsu", why: "Sitasi palsu lebih buruk dari tidak menjawab — merusak kepercayaan.", },
          ],
        },
        {
          q: "Kenapa query \u201Cjelaskan inflasi\u201D sebaiknya TIDAK di-retrieve?",
          options: [
            { text: "Karena retrieval dilarang untuk konsep", why: "Tidak dilarang — hanya tidak efisien di sini.", },
            { text: "Karena menambah latency/biaya dan risiko dokumen nyasar tanpa manfaat akurasi", why: "Tepat. Konsep stabil sudah dikuasai model; retrieve hanya menambah noise.", correct: true },
            { text: "Karena confidence selalu 1,0", why: "Confidence tidak pernah 1,0 — hanya cukup tinggi.", },
            { text: "Karena dokumen tidak ada", why: "Bukan soal ketersediaan dokumen.", },
          ],
        },
        {
          q: "Untuk laporan kepatuhan ke regulator, τ sebaiknya…",
          options: [
            { text: "Rendah (0,3) agar cepat", why: "Kecepatan bukan prioritas untuk kepatuhan; ketertelusuran iya.", },
            { text: "Tinggi (0,9) + sitasi wajib", why: "Tepat. Biaya kesalahan regulasi besar → retrieve sering + setiap klaim terlacak.", correct: true },
            { text: "Nol — tidak perlu retrieve", why: "Tanpa sumber, jawaban tak bisa diaudit.", },
            { text: "Acak tiap query", why: "Threshold harus kebijakan yang disengaja, bukan acak.", },
          ],
        },
        {
          q: "Retrieval mengembalikan dokumen berumur 60 hari untuk pertanyaan \u201Charga pasar saat ini\u201D. Respons tepat?",
          options: [
            { text: "Jawab memakai dokumen itu", why: "Dokumen 60 hari untuk \u201Csaat ini\u201D = jawaban basi yang menyesatkan.", },
            { text: "Tolak dan laporkan bahwa dokumen terbaru berumur 60 hari", why: "Tepat. Kejujuran tentang kebasian lebih berguna dari jawaban basi.", correct: true },
            { text: "Campur dengan tebakan agar terlihat kini", why: "Mencampur fakta basi dengan tebakan = dua kesalahan sekaligus.", },
            { text: "Ulangi retrieve sampai dapat yang baru", why: "Jika tidak ada yang baru, retry tidak menciptakannya.", },
          ],
        },
        {
          q: "Apa fungsi query rewriting sebelum retrieval?",
          options: [
            { text: "Mempersingkat query agar murah", why: "Bukan soal panjang — soal kecocokan dengan bahasa dokumen.", },
            { text: "Mengubah bahasa percakapan menjadi istilah yang cocok untuk pencarian dokumen", why: "Tepat. \u201Cbagaimana suku bunga bulan ini\u201D → \u201Ckeputusan suku bunga BI Maret 2026\u201D.", correct: true },
            { text: "Menyembunyikan query dari log", why: "Bukan fungsi rewriting.", },
            { text: "Menambah sitasi otomatis", why: "Sitasi ditambahkan setelah retrieval, bukan sebelumnya.", },
          ],
        },
      ],
    },
  ],
};
