import type { V2Lesson } from "../lib/types";

const RAG_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Pipeline RAG: dokumen masuk ke index, query mengambil top-k, jawaban disusun. Titik freshness ditandai di antara dokumen dan index.">
<g font-family="var(--font-ui)" font-size="11">
<rect x="10" y="70" width="100" height="60" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="60" y="95" text-anchor="middle" fill="var(--text)" font-weight="600">Dokumen</text>
<text x="60" y="112" text-anchor="middle" fill="var(--chart-text)">1.200 file</text>
<rect x="150" y="70" width="100" height="60" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="200" y="95" text-anchor="middle" fill="var(--text)" font-weight="600">Index</text>
<text x="200" y="112" text-anchor="middle" fill="var(--chart-text)">+ freshness</text>
<rect x="290" y="70" width="90" height="60" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="335" y="95" text-anchor="middle" fill="var(--text)" font-weight="600">Retrieval</text>
<text x="335" y="112" text-anchor="middle" fill="var(--chart-text)">top-k</text>
<rect x="410" y="70" width="60" height="60" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="440" y="95" text-anchor="middle" fill="var(--text)" font-weight="600">LLM</text>
<line x1="110" y1="100" x2="148" y2="100" stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ar)"/>
<line x1="250" y1="100" x2="288" y2="100" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="380" y1="100" x2="408" y2="100" stroke="var(--chart-grid)" stroke-width="1.5"/>
<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/></marker></defs>
<text x="200" y="160" text-anchor="middle" fill="var(--c4)" font-weight="600">TITIK FRESHNESS: TTL + last_updated + re-index</text>
<text x="200" y="178" text-anchor="middle" fill="var(--chart-text)">dokumen basi yang lolos ke sini = jawaban salah yang terlihat benar</text>
</g></svg>`;

const LLMOPS4_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Kontaminasi efektif per kuartal: tanpa pipeline naik 34 ke 81 persen, dengan pipeline stabil di 4 persen."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Q1</text><text x="185.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Q2</text><text x="324.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Q3</text><text x="464.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Q4</text><polyline points="46.0,117.7 185.3,80.3 324.7,47.0 464.0,20.0" fill="none" stroke="var(--c4)" stroke-width="2.5"/><polyline points="46.0,180.0 185.3,180.0 324.7,177.9 464.0,180.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/><line x1="46" y1="177.9" x2="464" y2="177.9" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="171.9" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">ambang 5%</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">merah=tanpa pipeline, biru=dengan pipeline</text></svg>`;

export const llmops4: V2Lesson = {
  slug: "llmops4-rag-ops",
  track: "LLMOps",
  module: "Fondasi",
  title: "LLMOps4 — Operasional RAG",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Jawaban yang benar dari dokumen yang salah",
      prose: [
        "ProteksiKu, perusahaan asuransi digital, bangga dengan chatbot RAG-nya: setiap jawaban disertai sumber dokumen, retrieval-nya akurat, modelnya tidak mengarang. Lalu datang komplain: nasabah dijanjikan `maksimal klaim rawat inap Rp50 juta` — padahal polis 2026 menaikkan limit menjadi Rp100 juta. Tim memeriksa: retrieval benar (dokumennya memang ada di index), model benar (menjawab sesuai dokumen), format benar. Semua hijau, jawaban salah.",
        "Twist-nya: dokumen yang diambil adalah polis 2023 yang sudah kedaluwarsa — masih nangkring di index karena tidak ada yang menghapusnya. RAG tidak menghilangkan masalah keandalan; ia memindahkannya dari `model mengarang` menjadi `data basi`. Dan data basi lebih berbahaya: jawabannya terlihat berdasar, bersumber, dan meyakinkan.",
        "Lesson ini tentang operasional RAG: pipeline index, freshness dokumen, dan evaluasi retrieval — tiga hal yang menentukan apakah jawaban `berdasar dokumen` berarti `benar`.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa index RAG adalah cache yang butuh strategi invalidasi; (2) menghitung tingkat kontaminasi index dari dokumen basi; (3) membedakan `relevan` dari `benar` (faithfulness vs freshness); (4) merancang pipeline freshness dengan TTL dan versioning dokumen.",
      ],
      tasks: [],
      note: {
        title: "Mitos: RAG = jawaban selalu benar karena berdasar dokumen",
        type: "pitfall",
        body: "Yang benar: RAG hanya sebaik dokumen di index-nya. Dokumen basi → jawaban basi yang terlihat meyakinkan karena bersumber. Kepercayaan buta pada `ada sumbernya` justru menumpulkan skeptisisme yang kamu butuhkan.",
      },
      reference: "RAG memindahkan risiko dari model ke data: freshness dokumen adalah kontrak baru.",
    },
    {
      id: "pipeline",
      eyebrow: "Langkah 2 · Konsep",
      title: "Pipeline index: chunk, embed, simpan, segarkan",
      prose: [
        "Pipeline RAG punya empat tahap. `Chunking`: dokumen dipotong menjadi potongan 300–800 token — terlalu besar membuat retrieval tidak presisi, terlalu kecil menghilangkan konteks. `Embedding`: tiap chunk diubah menjadi vektor. `Indexing`: vektor disimpan dengan metadata (sumber, `last_updated`, versi dokumen, tanggal kedaluwarsa). `Refresh`: index diperbarui saat dokumen berubah — inkremental untuk perubahan kecil, penuh untuk migrasi besar.",
        "Titik kegagalan operasional ada di tahap keempat. Kebanyakan tim membangun tiga tahap pertama dengan rapi, lalu refresh dilakukan `kalau sempat`. Akibatnya index menjadi museum: dokumen lama tidak pernah keluar, dokumen baru lambat masuk. ProteksiKu tidak punya pipeline refresh sama sekali — index dibangun sekali saat launch.",
        "💡 Intuisi: index RAG adalah cache dari kebenaran — dan semua cache butuh strategi invalidasi. Tanpa TTL dan `last_updated`, kamu tidak punya index; kamu punya arsip.",
      ],
      formula: String.raw`\text{recall@k} = \frac{\text{dokumen relevan yang terambil di top-k}}{\text{total dokumen relevan}}`,
      formulaNote: "recall@k = seberapa banyak dokumen yang seharusnya ketemu benar-benar ketemu. k = jumlah dokumen yang diambil (umumnya 3–5).",
      tasks: [],
      note: {
        title: "Mitos: re-index penuh tiap malam = paling aman",
        type: "pitfall",
        body: "Yang benar: re-index penuh itu mahal (compute embedding + downtime risiko) dan menutupi masalah desain — `kenapa dokumen basi bisa masuk?` Jawaban yang benar adalah pipeline inkremental + TTL per dokumen + validasi sebelum masuk index, bukan menyapu ulang setiap malam.",
      },
      reference: "Chunk → embed → index (+metadata) → refresh terjadwal. Tanpa refresh = arsip, bukan index.",
    },
    {
      id: "freshness",
      eyebrow: "Langkah 3 · Konsep",
      title: "Freshness: TTL, versioning, dan evaluasi retrieval",
      prose: [
        "Tiga mekanisme freshness. Satu: `last_updated` + TTL per dokumen — polis kedaluwarsa otomatis keluar dari kandidat retrieval, bukan menunggu dibersihkan manual. Dua: versioning dokumen — saat polis 2026 terbit, polis 2023 ditandai `superseded`, bukan dihapus (audit trail tetap ada, tapi tidak bisa ter-retrieve untuk jawaban). Tiga: evaluasi retrieval berkala — ukur recall@k dan `kontaminasi` (proporsi top-k yang basi) dengan query-query uji.",
        "Evaluasi retrieval terpisah dari evaluasi jawaban. Retrieval bisa sempurna (recall 100%) sementara jawaban tetap salah — persis kasus ProteksiKu di lab berikut: semua dokumen relevan ketemu, tapi dokumen teratas adalah yang basi. Metrik retrieval yang hanya melihat relevansi topik akan hijau sementara user menerima angka yang salah.",
        "💡 Intuisi: bedakan `relevan` dari `benar`. Dokumen basi bisa sangat relevan secara topik — ia menjawab pertanyaan yang tepat dengan angka yang salah. Checker freshness (tanggal, versi) harus menjadi filter independen, bukan sekadar fitur ranking.",
        "💡 Intuisi: faithfulness (jawaban didukung dokumen) tanpa freshness check = sertifikat untuk kebohongan yang rapi. Urutan pemeriksaan: dokumennya masih berlaku? → relevan? → jawaban didukung?",
      ],
      tasks: [],
      note: {
        title: "Mitos: recall@k tinggi = RAG sehat",
        type: "pitfall",
        body: "Yang benar: recall mengukur `ketemu atau tidak`, bukan `masih berlaku atau tidak`. Lab berikut menunjukkan recall 100% sebelum dan sesudah bersih-bersih — sementara 2 dari 4 query mengambil dokumen basi sebagai jawaban utama. Tambahkan metrik kontaminasi: proporsi top-k yang kedaluwarsa.",
      },
      reference: "TTL + versioning + metrik kontaminasi. Relevan ≠ masih berlaku.",
    },
    {
      id: "lab-retrieval",
      eyebrow: "Langkah 4 · Lab",
      title: "Ukur kontaminasi index (mock)",
      prose: [
        "Lab ini mensimulasikan index ProteksiKu: 6 dokumen, 2 di antaranya polis 2023 yang basi (ditandai `True`). Retrieval sederhana memakai overlap kata dengan query. Tugasmu: hitung berapa query yang dokumen teratasnya basi — sebelum dan sesudah dokumen basi dibersihkan dari index.",
        "Coba eksplorasi: bandingkan dengan recall@2 (apakah dokumen relevan yang benar ketemu?). Kamu akan melihat twist-nya: recall tetap 1,0 — retrieval `terlihat` sempurna sementara jawaban bisa basi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `basi_sebelum` = query dengan top-1 basi (index kotor)" },
        { id: "t2", text: "Hitung `basi_sesudah` = query dengan top-1 basi (index bersih)" },
        { id: "t3", text: "Hitung `pct_basi` = persen dokumen basi di index awal" },
      ],
      expected: "basi_sebelum=2  basi_sesudah=0  pct_basi=33.3%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung dokumen basi di top-2, bukan top-1. Yang menentukan jawaban adalah dokumen peringkat pertama — generator jawaban memakai konteks teratas. Kontaminasi di peringkat 2+ adalah risiko, kontaminasi di peringkat 1 adalah jawaban salah.",
      },
      hints: [
        "Untuk tiap query, ambil retrieve(q, corpus)[0] lalu cek flag basi-nya (indeks ke-2).",
        "Index bersih = [d for d in docs if not d[2]].",
        "basi_sebelum = sum(1 for q, rel in queries.values() if retrieve(q, docs)[0][2])",
      ],
      code: {
        starter: `docs = [\n    ("d2", "Polis 2023: maksimal klaim rawat inap Rp50 juta per tahun.", True),\n    ("d5", "Polis 2023: rawat jalan maksimal Rp5 juta per tahun.", True),\n    ("d1", "Polis 2026: maksimal klaim rawat inap Rp100 juta per tahun.", False),\n    ("d3", "Polis 2026: rawat jalan maksimal Rp10 juta per tahun.", False),\n    ("d4", "Polis 2026: klaim meninggal dunia Rp500 juta.", False),\n    ("d6", "Polis 2026: persalinan maksimal Rp25 juta.", False),\n]\nqueries = {\n    "q1": ("klaim rawat inap maksimal", "d1"),\n    "q2": ("rawat jalan maksimal", "d3"),\n    "q3": ("klaim meninggal dunia", "d4"),\n    "q4": ("persalinan maksimal", "d6"),\n}\n\ndef retrieve(qwords, corpus, k=2):\n    skor = sorted(corpus, key=lambda d: -len(set(qwords.split()) & set(d[1].lower().split())))\n    return skor[:k]\n\n# TULIS KODEMU: hitung top-1 basi sebelum & sesudah bersih-bersih\nbasi_sebelum = \nbasi_sesudah = \npct_basi = \n\nprint(f"basi_sebelum={basi_sebelum}  basi_sesudah={basi_sesudah}  pct_basi={pct_basi:.1f}%")`,
        lockLines: 20,
        solution: `docs = [\n    ("d2", "Polis 2023: maksimal klaim rawat inap Rp50 juta per tahun.", True),\n    ("d5", "Polis 2023: rawat jalan maksimal Rp5 juta per tahun.", True),\n    ("d1", "Polis 2026: maksimal klaim rawat inap Rp100 juta per tahun.", False),\n    ("d3", "Polis 2026: rawat jalan maksimal Rp10 juta per tahun.", False),\n    ("d4", "Polis 2026: klaim meninggal dunia Rp500 juta.", False),\n    ("d6", "Polis 2026: persalinan maksimal Rp25 juta.", False),\n]\nqueries = {\n    "q1": ("klaim rawat inap maksimal", "d1"),\n    "q2": ("rawat jalan maksimal", "d3"),\n    "q3": ("klaim meninggal dunia", "d4"),\n    "q4": ("persalinan maksimal", "d6"),\n}\n\ndef retrieve(qwords, corpus, k=2):\n    skor = sorted(corpus, key=lambda d: -len(set(qwords.split()) & set(d[1].lower().split())))\n    return skor[:k]\n\n# TULIS KODEMU: hitung top-1 basi sebelum & sesudah bersih-bersih\nbasi_sebelum = sum(1 for q, rel in queries.values() if retrieve(q, docs)[0][2])\nfresh = [d for d in docs if not d[2]]\nbasi_sesudah = sum(1 for q, rel in queries.values() if retrieve(q, fresh)[0][2])\npct_basi = sum(d[2] for d in docs) / len(docs) * 100\n\nprint(f"basi_sebelum={basi_sebelum}  basi_sesudah={basi_sesudah}  pct_basi={pct_basi:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "basi_sebelum", value: 2, tol: 1e-9, label: "`basi_sebelum` seharusnya 2", msg: "Query q1 dan q2 mengambil dokumen 2023 sebagai top-1." },
          { kind: "equal", task: "t2", name: "basi_sesudah", value: 0, tol: 1e-9, label: "`basi_sesudah` seharusnya 0", msg: "Setelah dokumen basi dibuang, semua top-1 adalah dokumen 2026." },
          { kind: "equal", task: "t3", name: "pct_basi", value: 33.333, tol: 0.01, label: "`pct_basi` seharusnya 33.3", msg: "2 dari 6 dokumen = 33,3%." },
          { kind: "stdout_matches", task: "t3", pattern: "basi_sebelum=2\\s+basi_sesudah=0\\s+pct_basi=33\\.3%", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kontaminasi = proporsi top-1 yang basi. Bersihkan via TTL, bukan re-index manual.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "RAG, fine-tune, atau prompt saja?",
      prose: [
        "Lima skenario. Satu: pengetahuan berubah tiap kuartal (polis, harga, regulasi) → RAG: update dokumen jauh lebih murah dari retrain. Dua: butuh gaya/format jawaban yang konsisten (nada CS, format laporan) → fine-tune atau prompt: itu soal perilaku, bukan pengetahuan. Tiga: dokumen < 50 halaman dan jarang berubah → pertimbangkan prompt langsung (long context), RAG menambah kompleksitas tanpa manfaat.",
        "Empat: jawaban salah padahal dokumen benar → masalah retrieval/generation, bukan freshness: perbaiki chunking atau prompt, jangan salahkan data. Lima: jawaban salah karena dokumen basi → masalah operasional: TTL, versioning, pipeline refresh — bukan masalah model.",
        "Aturan praktis 10 detik: tanya `apa yang berubah?` Pengetahuan berubah → RAG + freshness. Perilaku/format → prompt/fine-tune. Keduanya → perbaiki berlapis, ukur tiap lapis terpisah (retrieval vs generation).",
      ],
      figure: {
        svg: RAG_SVG,
        alt: "Pipeline RAG: dokumen masuk ke index, query mengambil top-k, jawaban disusun. Titik freshness ditandai di antara dokumen dan index.",
        caption: "Cara membaca: alir kiri ke kanan — dokumen → index → retrieval → LLM. Kotak yang disorot adalah titik freshness. Interpretasi: semua tim mengoptimasi panah kanan (retrieval, prompt), tapi incident ProteksiKu terjadi di panah kiri (dokumen → index). Operasional RAG = menjaga panah kiri tetap jujur.",
      },
      tasks: [],
      note: {
        title: "Mitos: RAG selalu lebih baik dari fine-tune",
        type: "pitfall",
        body: "Yang benar: keduanya menjawab pertanyaan berbeda. RAG = `pengetahuan apa yang dipakai?` (dinamis, bisa basi). Fine-tune = `bagaimana cara menjawab?` (gaya, format, perilaku). Memakai RAG untuk memperbaiki gaya bahasa = memakai obat yang salah.",
      },
      reference: "Pengetahuan berubah → RAG. Perilaku/format → prompt/fine-tune. Ukur retrieval dan generation terpisah.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "180 dokumen basi, Rp180 juta exposure",
      prose: [
        "ProteksiKu punya 1.200 dokumen kebijakan. Setiap kuartal ~15% kedaluwarsa atau diperbarui = 180 dokumen basi per kuartal jika tidak dibersihkan. Asumsi konservatif: 40% dokumen basi benar-benar ter-retrieve sebagai jawaban (72 jawaban salah per kuartal). Rata-rata selisih klaim yang salah bayar Rp2.500.000 → exposure 72 × 2.500.000 = Rp180.000.000 per kuartal.",
        "Pertanyaan analisis: (a) asumsi mana yang paling rapuh dalam perhitungan ini, dan bagaimana kamu memvalidasinya? (b) rancang pipeline freshness minimal untuk ProteksiKu: komponen apa saja, siapa pemiliknya, seberapa sering jalan? (c) mengapa `tambahkan tanggal ke prompt` bukan solusi operasional?",
        "Jawaban yang defensibel: (a) `40% ter-retrieve` — validasi dengan metrik kontaminasi dari lab ini di query log nyata, bukan asumsi. (b) minimal: `last_updated` + TTL wajib di metadata dokumen; job harian menandai kedaluwarsa; versioning superseded; dashboard kontaminasi; pemilik = tim data, bukan tim model. (c) tanggal di prompt bergantung pada model untuk menaatinya — tidak deterministik, tidak bisa diaudit, dan gagal diam-diam. Freshness harus di lapisan data, bukan di lapisan prompt.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jawaban RAG yang salah tapi bersumber adalah risiko reputasi dan hukum: nasabah memegang `bukti tertulis` dari chatbot-mu. Simpan log triple (query, dokumen ter-retrieve, jawaban) untuk setiap jawaban sensitif — itu bukti audit saat sengketa.",
      },
      reference: "180 × 40% × Rp2,5jt = Rp180jt/kuartal. Freshness di lapisan data, bukan prompt.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Kontaminasi index: mengukur racunnya",
      prose: [
        "ProteksiKu punya 1.200 dokumen; tiap kuartal ~15% kedaluwarsa = 180 dokumen basi. Definisikan TINGKAT KONTAMINASI = dokumen basi / total dokumen = 180/1200 = 15%. Tapi yang penting bukan kontaminasinya — melainkan PELUANG TER-RETRIEVE-nya. Dokumen basi yang tidak pernah relevan = racun yang tidak diminum. Ukur: dari 1.000 query log, berapa yang me-retrieve dokumen basi di top-3? Hasil: 340 query (34%). Inilah `kontaminasi efektif`: 15% racun di sumur, 34% gayung mengambilnya.",
        "Kenapa 34% > 15%? Karena dokumen basi (polis lama) justru POPULER — ia menjawab pertanyaan umum yang sering ditanyakan (`berapa premi dasar?`), sementara dokumen baru menjawab edge case. Kontaminasi efektif = kontaminasi × popularitas relatif. Pelajaran: JANGAN ukur kesehatan index dari `persen dokumen basi` saja; ukur dari query log nyata. Index dengan 5% dokumen basi tapi 60% query mengambilnya LEBIH BERACUN dari index dengan 20% basi yang tidak pernah ter-retrieve.",
        "Biaya kontaminasi: 340 query/hari × 30 hari = 10.200 jawaban berpotensi salah per bulan. Jika 10% di antaranya menyebabkan klaim salah hitung (rata-rata Rp2 juta) = Rp2,04 miliar/bulan exposure. Biaya pipeline freshness (TTL + versioning + job pembersih): ~Rp30 juta sekali bangun + Rp2 juta/bulan jalan. Rasio 68:1 per bulan. Dan ini BELUM termasuk denda regulator asuransi untuk informasi polis yang salah — yang bisa 10x lipatnya.",
        "Cara membangun pertahanan berlapis: (1) `last_updated` + TTL per dokumen — polis kedaluwarsa OTOMATIS keluar dari kandidat (bukan menunggu ada yang menghapus manual); (2) VERSIONING — polis 2024 menggantikan 2023, bukan menumpuk di sampingnya (duplikat versi = sumber kontaminasi #1); (3) FILTER WAKTU di retrieval — query `premi 2026` otomatis memfilter dokumen < 2026; (4) MONITOR kontaminasi efektif mingguan dari query log — alert jika > 5%. Empat lapis ini murah; satu lapis saja (mis. hanya TTL tanpa versioning) masih bocor lewat duplikat.",
      ],
      formula: String.raw`K_{efektif} = \frac{\text{query me-retrieve dokumen basi}}{\text{total query}}`,
      formulaNote: "K_efektif = kontaminasi efektif (ukur dari query log, bukan dari jumlah dokumen!); ambang sehat < 5%. Jika K_efektif > 5%, pipeline freshness bocor — periksa TTL, versioning, dan filter waktu.",
      tasks: [],
      note: {
        title: "💡 Intuisi: racun diukur dari gayung, bukan dari sumur",
        body: "15% dokumen basi terdengar `masih oke` — sampai tahu 34% query meminumnya. Selalu ukur kontaminasi dari sisi QUERY (log retrieval nyata), bukan dari sisi DOKUMEN (persen basi). Dokumen basi yang populer 10x lebih beracun dari yang tidak pernah dibuka.",
      },
      reference: "4 lapis: TTL + versioning + filter waktu + monitor K_efektif mingguan.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Peluruhan freshness: berapa cepat index membusuk",
      prose: [
        "Tanpa pipeline freshness, kontaminasi tumbuh linear: 15% per kuartal → 30% (Q2) → 45% (Q3) → 60% (Q4). Tapi K_efektif tumbuh LEBIH CEPAT karena dokumen basi terakumulasi di topik populer: 34% → 52% → 68% → 81%. Dalam 1 tahun, 4 dari 5 jawaban RAG terkontaminasi dokumen basi. Inilah `pembusukan index` — versi RAG dari model decay (MLOps1), dengan waktu buta yang sama berbahayanya.",
        "Dengan pipeline 4 lapis, kontaminasi stabil di ~3% (dokumen yang kedaluwarsa < 7 hari dan belum tersapu job mingguan). K_efektif ~4% — di bawah ambang 5%. Biaya: job mingguan 2 jam × Rp1 juta = Rp8 juta/bulan. Bandingkan tanpa pipeline: exposure Rp2,04 miliar/bulan di bulan ke-3 dan membesar. Grafiknya menunjukkan dua masa depan: garis merah (tanpa pipeline) naik ke 81%, garis hijau (dengan pipeline) datar di 4%. Pilih garis hijaunya.",
        "Jadwalkan `audit kontaminasi` bulanan: sampel 200 query acak, periksa top-3 retrieval, hitung K_efektif manual (validasi angka otomatis). Jika K_efektif otomatis bilang 4% tapi audit manual bilang 12% — monitornya yang rusak (mis. dokumen basi tidak ditandai `basi` dengan benar). Monitor yang tidak diaudit = doa. Audit bulanan 4 jam kerja ini adalah premi asuransi untuk seluruh pipeline.",
      ],
      figure: {
        svg: LLMOPS4_DEEP_SVG,
        alt: "Dua garis kontaminasi efektif: tanpa pipeline naik dari 34% ke 81%, dengan pipeline stabil ~4%.",
        caption: "Cara membaca: sumbu X = kuartal, sumbu Y = kontaminasi efektif (% query me-retrieve dokumen basi); merah = tanpa pipeline freshness, biru = dengan 4 lapis; garis putus-putus = ambang sehat 5%. Interpretasi: tanpa pipeline, 81% jawaban terkontaminasi dalam setahun; dengan pipeline (Rp8 juta/bulan), stabil di 4%. Pembusukan index itu eksponensial dampaknya, linear solusinya.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: index membusuk seperti model — tapi lebih cepat terlihat",
        body: "Model decay butuh berbulan-bulan untuk terlihat di metrik bisnis; kontaminasi RAG terlihat dalam hitungan minggu di query log. Itu kabar baik: audit bulanan 200 query menangkapnya saat masih murah diperbaiki. Yang buruk: tim yang tidak mengaudit sama sekali buta total.",
      },
      reference: "Audit kontaminasi bulanan: 200 query sampel, hitung K_efektif manual.",
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
        "RAG memindahkan risiko dari model ke data: dokumen basi = jawaban salah yang terlihat meyakinkan.",
        "Pipeline: chunk → embed → index (+metadata last_updated/TTL) → refresh terjadwal.",
        "Bedakan relevan dari masih berlaku; ukur kontaminasi, bukan hanya recall@k.",
        "Pengetahuan berubah → RAG; perilaku/format → prompt/fine-tune; ukur retrieval dan generation terpisah.",
        "Simpan triple (query, dokumen, jawaban) untuk jawaban sensitif sebagai bukti audit.",
      ],
      next: { label: "LLMOps5 — Guardrail Operasional", href: "/learn/llmops5-guardrail" },
      quiz: [
        {
          q: "Chatbot RAG menjawab dengan angka polis lama padahal retrieval-nya `benar`. Diagnosisnya?",
          options: [
            { text: "Model menghalusinasi", why: "Model menjawab sesuai dokumen yang diberikan — ia tidak mengarang." },
            { text: "Dokumen di index basi; freshness pipeline gagal", why: "Retrieval benar mengambil dokumen yang ada; yang salah adalah dokumennya kedaluwarsa dan tidak dibersihkan.", correct: true },
            { text: "Chunk terlalu kecil", why: "Chunking memengaruhi presisi retrieval, bukan kebasian dokumen." },
            { text: "Prompt kurang tegas", why: "Tidak ada prompt yang bisa memperbaiki dokumen yang salah secara andal." },
          ],
        },
        {
          q: "Di lab, recall@2 tetap 1,0 sebelum dan sesudah bersih-bersih, tapi 2 query mengambil dokumen basi. Pelajarannya?",
          options: [
            { text: "Recall@k tidak berguna", why: "Recall tetap berguna untuk mengukur ketemunya dokumen — hanya tidak cukup sendirian." },
            { text: "Butuh metrik kontaminasi (proporsi top-k yang basi) selain recall", why: "Recall mengukur relevansi topik; kontaminasi mengukur kebasian. Keduanya dibutuhkan.", correct: true },
            { text: "Naikkan k menjadi 10", why: "k lebih besar justru memberi lebih banyak ruang bagi dokumen basi." },
            { text: "Ganti model embedding", why: "Masalahnya bukan kualitas embedding, melainkan kebersihan index." },
          ],
        },
        {
          q: "Dokumen polis 2026 terbit menggantikan polis 2023. Penanganan operasional yang benar?",
          options: [
            { text: "Hapus polis 2023 dari index", why: "Menghapus merusak audit trail; tandai `superseded` agar tidak ter-retrieve tapi tetap terlacak." },
            { text: "Tandai polis 2023 `superseded` (tidak bisa ter-retrieve), index polis 2026", why: "Versioning menjaga audit sekaligus mencegah jawaban basi.", correct: true },
            { text: "Biarkan keduanya, model akan memilih yang benar", why: "Model tidak tahu mana yang berlaku — ia hanya melihat teks." },
            { text: "Tambahkan catatan `pakai yang 2026` di prompt", why: "Freshness di lapisan prompt tidak deterministik dan tidak bisa diaudit." },
          ],
        },
        {
          q: "Kapan RAG adalah pilihan yang salah?",
          options: [
            { text: "Pengetahuan berubah tiap kuartal", why: "Ini justru kasus ideal RAG." },
            { text: "Butuh gaya bahasa CS yang konsisten", why: "Itu soal perilaku/format → ranah prompt/fine-tune, bukan pengetahuan.", correct: true },
            { text: "Dokumen ribuan halaman", why: "Volume besar justru butuh retrieval." },
            { text: "Jawaban harus bersumber", why: "Sumber = kekuatan utama RAG." },
          ],
        },
        {
          q: "1.200 dokumen, 15% basi per kuartal, 40% ter-retrieve, selisih Rp2,5jt per jawaban salah. Exposure per kuartal?",
          options: [
            { text: "Rp180.000.000", why: "1.200 × 15% = 180; 180 × 40% = 72; 72 × Rp2,5jt = Rp180jt.", correct: true },
            { text: "Rp450.000.000", why: "Itu 180 × Rp2,5jt — lupa faktor 40% ter-retrieve." },
            { text: "Rp72.000.000", why: "Itu 72 × Rp1jt — salah nominal selisih." },
            { text: "Rp18.000.000", why: "Kurang satu nol — hitung ulang 72 × 2.500.000." },
          ],
        },
        {
          q: "Index: 15% dokumen basi, tapi 34% query me-retrieve dokumen basi di top-3. Metrik mana yang menentukan prioritas perbaikan?",
          options: [
            { text: "15% — karena itu tingkat kontaminasi resminya", why: "15% mengukur sumur, bukan gayung. Yang merugikan user adalah 34% query yang terkontaminasi — itulah K_efektif, metrik yang menentukan." },
            { text: "34% (K_efektif) — ukur dari query log nyata", why: "Tepat. Dokumen basi yang populer 10x lebih beracun. Prioritaskan perbaikan pada dokumen basi yang paling sering ter-retrieve, bukan sekadar yang paling banyak.", correct: true },
            { text: "Jumlah total dokumen (1.200)", why: "Jumlah total tidak memberi informasi risiko sama sekali. 1.200 dokumen bisa sehat total atau beracun total." },
            { text: "Rata-rata ukuran dokumen", why: "Tidak relevan dengan kontaminasi. Ukuran dokumen memengaruhi biaya embedding, bukan kebenaran jawaban." },
          ],
        },
      ],
    },
  ],
};
