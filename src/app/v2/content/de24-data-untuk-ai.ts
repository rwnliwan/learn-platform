import type { V2Lesson } from "../lib/types";

// Alur pipeline data untuk AI: tiap kotak adalah komponen yang bisa gagal sendiri-sendiri.
const PIPELINE_SVG = `<svg viewBox="0 0 640 200" role="img" aria-label="Alur pipeline data untuk AI: dokumen, chunking, embedding, vector store, retrieval, jawaban.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="12" y="70" width="96" height="48" rx="8" fill="var(--c1)" fill-opacity="0.22" stroke="var(--c1)" stroke-width="1.5"/>
<rect x="116" y="70" width="96" height="48" rx="8" fill="var(--c2)" fill-opacity="0.22" stroke="var(--c2)" stroke-width="1.5"/>
<rect x="220" y="70" width="96" height="48" rx="8" fill="var(--c3)" fill-opacity="0.22" stroke="var(--c3)" stroke-width="1.5"/>
<rect x="324" y="70" width="96" height="48" rx="8" fill="var(--c4)" fill-opacity="0.22" stroke="var(--c4)" stroke-width="1.5"/>
<rect x="428" y="70" width="96" height="48" rx="8" fill="var(--c2)" fill-opacity="0.22" stroke="var(--c2)" stroke-width="1.5"/>
<rect x="532" y="70" width="96" height="48" rx="8" fill="var(--c1)" fill-opacity="0.22" stroke="var(--c1)" stroke-width="1.5"/>
<g stroke="var(--chart-text)" stroke-width="1.5">
<line x1="108" y1="94" x2="116" y2="94"/><polygon points="116,88 116,100 124,94" fill="var(--chart-text)"/>
<line x1="212" y1="94" x2="220" y2="94"/><polygon points="220,88 220,100 228,94" fill="var(--chart-text)"/>
<line x1="316" y1="94" x2="324" y2="94"/><polygon points="324,88 324,100 332,94" fill="var(--chart-text)"/>
<line x1="420" y1="94" x2="428" y2="94"/><polygon points="428,88 428,100 436,94" fill="var(--chart-text)"/>
<line x1="524" y1="94" x2="532" y2="94"/><polygon points="532,88 532,100 540,94" fill="var(--chart-text)"/>
</g>
<g fill="var(--text)">
<text x="60" y="90">Dokumen</text><text x="60" y="107" font-size="10" fill="var(--chart-text)">PDF · scan · teks</text>
<text x="164" y="90">Chunking</text><text x="164" y="107" font-size="10" fill="var(--chart-text)">±512 token + overlap</text>
<text x="268" y="90">Embedding</text><text x="268" y="107" font-size="10" fill="var(--chart-text)">teks → vektor</text>
<text x="372" y="90">Vector store</text><text x="372" y="107" font-size="10" fill="var(--chart-text)">index + metadata</text>
<text x="476" y="90">Retrieval</text><text x="476" y="107" font-size="10" fill="var(--chart-text)">query → top-k</text>
<text x="580" y="90">Jawaban</text><text x="580" y="107" font-size="10" fill="var(--chart-text)">konteks → LLM</text>
</g>
</g>
<text x="320" y="160" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">query pengguna menempuh jalur yang sama: embed → cocokkan → jawab</text>
</svg>`;

export const de24: V2Lesson = {
  slug: "de24-data-untuk-ai",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE24 — Data untuk AI: Fitur, Embedding & Dokumen",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Setelah lesson ini, kamu bisa merancang jalur data yang memberi makan sistem AI — dari fitur untuk model klasik sampai embedding untuk RAG dan LLM.",
        "(1) Membedakan dua jalur data AI — pipeline fitur untuk ML dan pipeline embedding untuk LLM — serta kapan memakai yang mana;",
        "(2) Merancang chunking, batch embedding, dan versioning index agar jawaban RAG tidak basi saat model embedding diganti;",
        "(3) Memilih vector store: kapan pgvector cukup dan kapan butuh mesin ANN khusus;",
        "(4) Membangun pemrosesan dokumen dan OCR yang tervalidasi sebelum teks masuk ke index;",
        "(5) Menyiapkan dataset fine-tuning yang bersih: format instruksi, dedup, dan PII scrubbing.",
        "Alurnya: cerita kegagalan Rp380 juta dulu → dua pipeline (fitur vs embedding) → vector store → dokumen dan OCR → data fine-tuning → lab pipeline mini → peta keputusan → mini-case 1,2 juta halaman.",
        "Estimasi 60 menit. Lab memakai Python standar — tanpa install, jalan di browser.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Chatbot Rp380 juta yang tidak bisa menjawab pertanyaannya sendiri",
      prose: [
        "Maret 2026. Bank Nusa Dana meluncurkan asisten dokumen internal: karyawan bertanya soal regulasi lewat chat, jawabannya dikutip dari 40.000 halaman arsip. Biayanya Rp380 juta — model LLM kelas atas, GPU, konsultan.",
        "Dua minggu kemudian keluhan masuk: chatbot mengutip 'Pasal 12' yang tidak ada di dokumen mana pun, dan menyebut suku bunga acuan 6,75% padahal dokumen resmi menulis 5,75%. Tim ML menunjuk modelnya: 'halusinasi, harus ganti model yang lebih besar' — plus Rp200 juta per tahun.",
        "Twist-nya: audit pipeline data menemukan tiga hal. Pertama, chunking 2.000 kata tanpa overlap memotong tabel suku bunga tepat di tengah — setengah angka hilang. Kedua, OCR salah membaca dokumen scan: '5,75%' terbaca '6,75%'. Ketiga, index vector tidak pernah di-rebuild setelah 6.000 halaman dokumen direvisi — jawaban datang dari arsip basi.",
        "Modelnya tidak pernah salah membaca dokumen — ia diberi potongan yang salah, angka yang salah ketik, dan arsip yang kedaluwarsa. Setelah pipeline diperbaiki tanpa mengganti model: retrieval accuracy naik dari 41% ke 86%. Rp380 juta itu tidak membeli model yang buruk — ia membeli pipa yang bocor.",
      ],
      tasks: [],
      reference: "AI yang gagal jarang soal model — sering soal data yang masuk ke model.",
    },
    {
      id: "pipeline-fitur",
      eyebrow: "Langkah 3 · Pipeline fitur",
      title: "Pipeline fitur untuk ML: si kembaran yang disiplin",
      prose: [
        "Di ML klasik, model tidak makan dokumen — ia makan fitur: angka hasil olahan seperti 'rata-rata saldo 90 hari' atau 'jumlah transaksi gagal 7 hari'. Pipeline fitur adalah jalur perakitan angka-angka itu, dan ia punya satu aturan keras: fitur yang dipakai training harus kembar identik dengan fitur yang dipakai di produksi. Panggil dia Si Kembaran.",
        "Musuh utamanya bernama train-serve skew: model dilatih dengan fitur yang dihitung batch semalam, tapi di produksi fiturnya dihitung real-time dengan definisi sedikit berbeda. Contoh konkret: 'total transaksi 30 hari' di training dihitung dari snapshot tengah malam, di produksi dihitung dari jam berjalan — beda angka, model bingung, skor meleset diam-diam tanpa satu pun error.",
        "Senjata keduanya adalah point-in-time correctness: fitur harus dihitung seperti yang terlihat PADA tanggal kejadian, bukan seperti yang terlihat hari ini. Menghitung fitur memakai data yang baru ada minggu depan = leakage — model terlihat akurat di training, hancur di produksi.",
        "Arsitekturnya dua toko: offline store (batch, untuk training dan backtest) dan online store (latency milidetik, untuk serving). Feature store menjaga keduanya konsisten — satu definisi, dua kecepatan. Dari sudut pandang DE, ini pipeline batch/streaming biasa dengan kontrak tambahan: reproducible dan konsisten.",
        "💡 Intuisi: kalau fitur training dan fitur serving dihitung oleh dua kode yang berbeda, skew bukan kemungkinan — melainkan jadwal. Satu definisi fitur, dipakai di dua tempat.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: fitur training dan serving 'kira-kira sama' sudah cukup",
        type: "pitfall",
        body: "'Kira-kira sama' adalah skew yang belum ketahuan. Beda definisi '30 hari' (kalender vs rolling), beda timezone, beda handling null — semua melesetkan skor tanpa error. Solusinya: satu kode transformasi dipakai training dan serving, plus monitoring distribusi fitur seperti di pipeline monitoring biasa.",
      },
      reference: "Satu definisi fitur, dua kecepatan (offline untuk training, online untuk serving), nol skew.",
    },
    {
      id: "pipeline-embedding",
      eyebrow: "Langkah 4 · Pipeline embedding",
      title: "Pipeline embedding: dari dokumen ke vektor",
      prose: [
        "Model bahasa tidak membaca kalimat seperti manusia — ia bekerja dengan vektor: deretan angka yang menempatkan teks di 'ruang makna'. Embedding adalah penerjemah teks menjadi vektor itu: kalimat yang mirip maknanya berakhir berdekatan, walau katanya beda ('suku bunga acuan' dekat dengan 'BI rate'). Jadi mesin tidak lagi mencocokkan kata kunci, melainkan makna.",
        "Langkah pertamanya chunking — Si Tukang Potong. Dokumen dipotong jadi potongan ±512 token dengan overlap ±64 token. Terlalu besar: satu chunk berisi lima topik, retrieval membawa noise. Terlalu kecil: kalimat kehilangan konteks. Tanpa overlap: kalimat terpotong di batas chunk dan maknanya hilang — persis yang memotong tabel suku bunga di cerita tadi.",
        "Langkah kedua batch embedding: antrean chunk → panggil model embedding per batch (ratusan chunk sekaligus, bukan satu-satu) → simpan vektor bersama metadata (doc_id, halaman, tanggal dokumen, versi model). Polanya pipeline batch biasa: idempoten, bisa di-retry, bisa di-backfill.",
        "Langkah ketiga versioning index. Vektor dari model A tidak bisa dibandingkan dengan vektor dari model B — ruang maknanya berbeda. Ganti model embedding berarti seluruh index basi dan harus di-embed ulang. Index wajib berversi: index-v1 untuk model-v1, index-v2 untuk model-v2, migrasi bertahap, bukan big-bang.",
        "Cara membaca diagram: kotak dibaca kiri ke kanan — dokumen mentah dipotong, diubah jadi vektor, disimpan di index; query pengguna menempuh jalur yang sama (embed) lalu dicocokkan (retrieval) sebelum LLM menjawab.",
        "Interpretasi: setiap kotak adalah komponen pipeline yang bisa gagal sendiri-sendiri — dan di cerita tadi, tiga kotak gagal sekaligus: chunking, input embedding dari OCR yang salah, dan index yang basi.",
      ],
      figure: {
        svg: PIPELINE_SVG,
        alt: "Alur pipeline data untuk AI: dokumen, chunking, embedding, vector store, retrieval, jawaban.",
        caption: "Alur pipeline data untuk AI. Tiap kotak = titik kegagalan potensial; query menempuh jalur yang sama sebelum dijawab.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: re-embedding itu gratis dan bisa kapan saja",
        type: "pitfall",
        body: "Untuk 1,2 juta halaman (±4,8 juta chunk), re-embed berarti memanggil model embedding 4,8 juta kali: jam komputasi, biaya API, dan index ganda selama migrasi. Tanpa versioning, rollback mustahil — index baru buruk, tidak ada jalan kembali. Rencanakan re-embed seperti migrasi database: ada jadwal, ada versi, ada rollback.",
      },
      reference: "Chunk rapi → embed per batch → simpan dengan metadata → versikan index per model.",
    },
    {
      id: "vector-store",
      eyebrow: "Langkah 5 · Vector store",
      title: "Vector store: gudang yang paham jarak",
      prose: [
        "Setelah dokumen menjadi vektor, butuh gudang: vector store. Tugasnya satu — diberi vektor query, kembalikan k vektor terdekat secepat mungkin. Pencarian brute-force (bandingkan dengan semua vektor) akurat tapi lambat di jutaan vektor; ANN (approximate nearest neighbor, mis. HNSW atau IVF) mengorbankan sedikit akurasi demi kecepatan berkali lipat. Kepribadiannya: Si Penjaga Gudang yang tahu persis lorong mana yang harus dicek, tanpa menggeledah seluruh gudang.",
        "Kekuatan sebenarnya ada di metadata filter: saring dulu (doc_type = 'regulasi', tahun >= 2024), baru cari makna di dalam saringan itu. Pola hybrid ini — filter SQL biasa + pencarian vektor — menyelesaikan 80% kebutuhan RAG perusahaan tanpa tuning ANN apa pun.",
        "Kapan pgvector cukup: di bawah ±1 juta vektor, tim sudah memakai Postgres, dan butuh filter SQL yang kaya — satu database untuk semuanya. Kapan butuh mesin khusus (Milvus, Weaviate, Qdrant): di atas ±10 juta vektor, SLA di bawah 100ms, atau butuh replikasi dan sharding yang serius.",
        "💡 Intuisi: vector store bukan database ajaib — ia database biasa yang pandai soal jarak. Kalau kebutuhanmu 'cari dokumen mirip + filter tanggal', jangan beli meriam untuk membunuh lalat.",
      ],
      tasks: [],
      reference: "Filter dulu dengan metadata, cari makna dengan vektor. pgvector sampai ±1 juta; mesin khusus di atas itu.",
    },
    {
      id: "dokumen-ocr",
      eyebrow: "Langkah 6 · Dokumen & OCR",
      title: "Dokumen & OCR: dari PDF berantakan ke teks rapi",
      prose: [
        "PDF bukan teks — ia gambar instruksi cetak. 'Ekstrak teks dari PDF' sering menghasilkan urutan acak, kolom ganda tercampur, dan tabel hancur. Untuk dokumen scan, OCR mengubah gambar jadi teks dengan confidence score per kata; di bawah ambang (mis. 0,85), kata itu ditandai untuk review manusia, bukan dibiarkan lolos diam-diam.",
        "Validasi ekstraksi adalah QA-nya pipeline dokumen: bandingkan jumlah baris tabel hasil ekstraksi dengan sumbernya, cek pola angka dengan regex (rupiah, persen, tanggal), dan audit manual 1% sampel. Angka '6,75%' yang seharusnya '5,75%' di cerita tadi lolos karena tidak ada satu pun cek ini.",
        "Jangan lupakan metadata: sumber dokumen, nomor halaman, tanggal terbit. Tanpa metadata, jawaban RAG tidak bisa disitasi — dan jawaban tanpa sitasi tidak bisa dipertanggungjawabkan di depan auditor.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: PII yang sudah jadi vektor tidak bisa bocor",
        type: "pitfall",
        body: "Bisa — lewat jawaban. NIK, nama nasabah, dan nomor rekening dalam dokumen ikut ter-embed, lalu muncul di jawaban chatbot saat pengguna bertanya hal yang 'mirip'. Scrubbing PII (regex untuk NIK/telepon + NER untuk nama + audit sampel) wajib dilakukan SEBELUM chunking, bukan sesudah — vektor yang sudah masuk index tidak bisa 'dibersihkan' sebagian.",
      },
      reference: "Ekstrak → validasi (baris tabel, pola angka, sampel 1%) → metadata sitasi → baru chunking.",
    },
    {
      id: "data-finetune",
      eyebrow: "Langkah 7 · Data fine-tuning",
      title: "Data untuk fine-tuning: kurasi mengalahkan volume",
      prose: [
        "Fine-tuning tidak menambah pengetahuan model — ia mengajarkan gaya, format, dan perilaku. Formatnya pasangan instruksi–respons (JSONL): satu baris, satu contoh. Gaya 'jawab seperti analis risiko bank' dipelajari dari ratusan contoh, bukan dari membaca dokumentasi.",
        "Kualitas mengalahkan kuantitas dengan telak: 3.000 contoh bersih mengalahkan 200.000 contoh berisik. Contoh buruk tidak netral — ia aktif mengajarkan perilaku buruk.",
        "Dedup itu wajib: contoh duplikat mengajarkan model menghafal, bukan memahami. Dedup eksak untuk salinan persis, near-dup untuk parafrase yang hampir sama.",
        "Terakhir, pisahkan eval set sejak awal — dan pastikan tidak bocor ke data training. Model yang 'diuji' dengan data yang pernah dilihatnya sedang mencontek, bukan membuktikan kemampuan.",
        "💡 Intuisi: anggap dataset fine-tuning seperti kurikulum sekolah — 3.000 soal pilihan yang bagus meluluskan ujian; 200.000 soal asal-asalan meluluskan kebiasaan buruk.",
      ],
      tasks: [],
      reference: "Fine-tuning = ajari perilaku (format JSONL bersih, terdedup, bebas PII, eval terpisah). Pengetahuan = urusan RAG.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 8 · Lab",
      title: "Lab: pipeline mini — chunking, embedding, retrieval",
      prose: [
        "Waktunya merakit. Lab ini membangun pipeline embedding mini end-to-end: 4 dokumen → chunking per 10 kata → embedding hash 8 dimensi → index → query 'syarat pengajuan kredit usaha nasabah' → 3 chunk teratas.",
        "Embedding di sini memakai hash sederhana sebagai pengganti model embedding beneran — deterministik dan tanpa install, tapi ingat: ini mainan. Di produksi, pakai model embedding sungguhan karena hash tidak paham makna, hanya pola huruf.",
        "Cara membaca output: tiap baris 'top' menampilkan doc_id, nomor chunk, dan skor cosine — makin dekat ke 1, makin mirip maknanya dengan query.",
        "Interpretasi: D1 (prosedur kredit) harus di puncak. Kalau D4 (jadwal server) yang menang, ada yang salah di fungsi embed-mu — periksa lagi pemetaan katanya.",
      ],
      formula: String.raw`\text{cos}(a, b) = \frac{a \cdot b}{||a|| \cdot ||b||}`,
      formulaNote: "cos(a,b) = kemiripan kosinus; a·b = dot product (jumlah perkalian tiap elemen); ||a|| = panjang vektor (norma). Nilai 1 = arah identik, 0 = tidak berhubungan.",
      tasks: [
        { id: "t1", text: "Lengkapi `chunking`: potong teks per N kata" },
        { id: "t2", text: "Lengkapi `embed`: petakan tiap kata ke ember via jumlah ord() — JANGAN pakai hash()" },
        { id: "t3", text: "Lengkapi `n_chunks`, jalankan, dan pastikan 3 baris top cocok dengan expected" },
      ],
      expected: "query kredit → top: D1 chunk0 skor=0.8433 | top: D3 chunk0 skor=0.8000 | n_chunks=8",
      note: {
        title: "Sering salah",
        body: "Memakai hash() bawaan Python untuk memetakan kata. hash() string di Python diacak tiap proses berjalan (PYTHONHASHSEED) — vektornya berubah setiap run, index tidak reproducible. Pakai jumlah ord() seperti petunjuk: deterministik, selalu sama.",
      },
      hints: [
        "chunking: potong list kata per `ukuran`: kata[i:i+ukuran] untuk i in range(0, len(kata), ukuran), lalu gabung dengan ' '.join.",
        "embed: untuk tiap kata, ember = sum(ord(c) for c in kata) % dim; lalu vektor[ember] += 1.",
        "n_chunks = len(chunks).",
      ],
      code: {
        starter: `# Knowledge base mini: 4 dokumen (simulasi arsip perusahaan)\n` +
`docs = [\n` +
`    {"id": "D1", "teks": "Prosedur pengajuan kredit usaha: nasabah mengisi formulir aplikasi, melampirkan KTP dan laporan keuangan, lalu tim analis melakukan scoring risiko."},\n` +
`    {"id": "D2", "teks": "Kebijakan cuti karyawan: cuti tahunan dua belas hari kerja, pengajuan maksimal tiga hari sebelumnya, wajib persetujuan atasan langsung."},\n` +
`    {"id": "D3", "teks": "Manajemen risiko kredit macet: pantau kolektibilitas debitur setiap bulan, lakukan restrukturisasi untuk debitur terdampak, hapus buku sesuai ketentuan regulator."},\n` +
`    {"id": "D4", "teks": "Jadwal maintenance server: downtime setiap Minggu pukul dua sampai empat pagi, backup otomatis dijalankan sebelum maintenance dimulai."},\n` +
`]\n` +
`\n` +
`# TUGAS 1: lengkapi chunking (potong teks per N kata)\n` +
`def chunking(teks, ukuran=10):\n` +
`    kata = teks.split()\n` +
`    return \n` +
`\n` +
`# TUGAS 2: lengkapi embed (JANGAN pakai hash() - tidak deterministik!)\n` +
`def embed(teks, dim=8):\n` +
`    vektor = [0] * dim\n` +
`    \n` +
`    return vektor\n` +
`\n` +
`import math\n` +
`def cosine(a, b):\n` +
`    dot = sum(x*y for x, y in zip(a, b))\n` +
`    na = math.sqrt(sum(x*x for x in a))\n` +
`    nb = math.sqrt(sum(y*y for y in b))\n` +
`    return dot / (na * nb) if na and nb else 0.0\n` +
`\n` +
`# TUGAS 3: lengkapi n_chunks, lalu jalankan\n` +
`chunks = []\n` +
`for d in docs:\n` +
`    for i, c in enumerate(chunking(d["teks"])):\n` +
`        chunks.append({"doc": d["id"], "chunk": i, "teks": c, "vektor": embed(c)})\n` +
`\n` +
`query = "syarat pengajuan kredit usaha nasabah"\n` +
`qv = embed(query)\n` +
`ranking = sorted(\n` +
`    ((c["doc"], c["chunk"], cosine(qv, c["vektor"])) for c in chunks),\n` +
`    key=lambda r: r[2], reverse=True,\n` +
`)\n` +
`n_chunks = \n` +
`print(f"query: {query}")\n` +
`print(f"n_chunks={n_chunks}")\n` +
`for doc, ch, skor in ranking[:3]:\n` +
`    print(f"top: {doc} chunk{ch} skor={skor:.4f}")\n`,
        lockLines: 7,
        solution: `# Knowledge base mini: 4 dokumen (simulasi arsip perusahaan)\n` +
`docs = [\n` +
`    {"id": "D1", "teks": "Prosedur pengajuan kredit usaha: nasabah mengisi formulir aplikasi, melampirkan KTP dan laporan keuangan, lalu tim analis melakukan scoring risiko."},\n` +
`    {"id": "D2", "teks": "Kebijakan cuti karyawan: cuti tahunan dua belas hari kerja, pengajuan maksimal tiga hari sebelumnya, wajib persetujuan atasan langsung."},\n` +
`    {"id": "D3", "teks": "Manajemen risiko kredit macet: pantau kolektibilitas debitur setiap bulan, lakukan restrukturisasi untuk debitur terdampak, hapus buku sesuai ketentuan regulator."},\n` +
`    {"id": "D4", "teks": "Jadwal maintenance server: downtime setiap Minggu pukul dua sampai empat pagi, backup otomatis dijalankan sebelum maintenance dimulai."},\n` +
`]\n` +
`\n` +
`# TUGAS 1: lengkapi chunking (potong teks per N kata)\n` +
`def chunking(teks, ukuran=10):\n` +
`    kata = teks.split()\n` +
`    return [" ".join(kata[i:i+ukuran]) for i in range(0, len(kata), ukuran)]\n` +
`\n` +
`# TUGAS 2: lengkapi embed (JANGAN pakai hash() - tidak deterministik!)\n` +
`def embed(teks, dim=8):\n` +
`    vektor = [0] * dim\n` +
`    for kata in teks.lower().split():\n` +
`        ember = sum(ord(c) for c in kata) % dim\n` +
`        vektor[ember] += 1\n` +
`    return vektor\n` +
`\n` +
`import math\n` +
`def cosine(a, b):\n` +
`    dot = sum(x*y for x, y in zip(a, b))\n` +
`    na = math.sqrt(sum(x*x for x in a))\n` +
`    nb = math.sqrt(sum(y*y for y in b))\n` +
`    return dot / (na * nb) if na and nb else 0.0\n` +
`\n` +
`# TUGAS 3: lengkapi n_chunks, lalu jalankan\n` +
`chunks = []\n` +
`for d in docs:\n` +
`    for i, c in enumerate(chunking(d["teks"])):\n` +
`        chunks.append({"doc": d["id"], "chunk": i, "teks": c, "vektor": embed(c)})\n` +
`\n` +
`query = "syarat pengajuan kredit usaha nasabah"\n` +
`qv = embed(query)\n` +
`ranking = sorted(\n` +
`    ((c["doc"], c["chunk"], cosine(qv, c["vektor"])) for c in chunks),\n` +
`    key=lambda r: r[2], reverse=True,\n` +
`)\n` +
`n_chunks = len(chunks)\n` +
`print(f"query: {query}")\n` +
`print(f"n_chunks={n_chunks}")\n` +
`for doc, ch, skor in ranking[:3]:\n` +
`    print(f"top: {doc} chunk{ch} skor={skor:.4f}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "chunking", label: "fungsi `chunking` terdefinisi", msg: "Definisikan chunking(teks, ukuran=10) yang mengembalikan list potongan." },
          { kind: "equal", task: "t1", name: "n_chunks", value: 8, label: "`n_chunks` = 8 potongan", msg: "4 dokumen × 2 chunk (ukuran 10 kata) = 8." },
          { kind: "defined", task: "t2", name: "embed", label: "fungsi `embed` terdefinisi", msg: "Definisikan embed(teks, dim=8) yang mengembalikan list sepanjang dim." },
          { kind: "forbids", task: "t2", token: "hash", label: "tidak memakai `hash()`", msg: "hash() string di Python tidak deterministik antar-run (PYTHONHASHSEED). Pakai jumlah ord() seperti petunjuk." },
          { kind: "equal", task: "t2", name: "qv", value: [0, 1, 1, 1, 1, 0, 1, 0], label: "vektor query tepat", msg: "embed('syarat pengajuan kredit usaha nasabah') harus = [0,1,1,1,1,0,1,0]." },
          { kind: "stdout_matches", task: "t3", pattern: "top: D1 chunk0 skor=0\\.8433", label: "peringkat 1 = D1", msg: "Query kredit harus menempatkan D1 chunk0 di puncak (skor 0.8433)." },
          { kind: "stdout_matches", task: "t3", pattern: "top: D3 chunk0 skor=0\\.8000", label: "peringkat 2 = D3", msg: "D3 (risiko kredit) wajar di peringkat kedua (skor 0.8000)." },
          { kind: "stdout_matches", task: "t3", pattern: "n_chunks=8", label: "`print` n_chunks=8", msg: "Baris ringkasan harus mencetak n_chunks=8." },
        ],
      },
      reference: "Dokumen → chunking → embedding → index → query → ranking. Tiap tahap deterministik dan terukur.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: arsitektur data AI apa?",
      prose: [
        "Skenario 1 — Knowledge base internal di bawah 100 ribu halaman, butuh filter metadata yang kaya. Keputusan: pgvector + chunk ±512 token, overlap 64. Alasan: satu database, filter SQL penuh, tanpa infrastruktur baru.",
        "Skenario 2 — Di atas 5 juta halaman, SLA retrieval di bawah 200ms. Keputusan: vector store khusus (ANN) + index berversi + re-embed terjadwal. Alasan: skala dan latensi sudah di luar jangkauan Postgres.",
        "Skenario 3 — Arsip scan dan PDF bertabel. Keputusan: pipeline OCR + validasi ekstraksi dulu, baru chunking. Alasan: sampah masuk = sampah ter-embed; validasi di hulu, bukan di jawaban.",
        "Skenario 4 — Butuh gaya atau format jawaban khusus (mis. memo risiko bank). Keputusan: fine-tuning dengan 3–5 ribu contoh bersih, bukan RAG. Alasan: RAG menambah pengetahuan, fine-tuning mengubah perilaku — jangan tertukar.",
        "Skenario 5 — Ganti model embedding. Keputusan: versioning index + re-embed bertahap (shadow index), bukan big-bang. Alasan: rollback selalu tersedia; index lama tetap melayani selama migrasi.",
        "Aturan praktis 10 detik: tanya 'datanya bentuk apa, berapa banyak, dan apa yang harus berubah?' Dokumen + cari makna = RAG. Perilaku atau format = fine-tuning. Butuh keduanya = RAG dulu, fine-tuning belakangan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih vector store khusus 'untuk jaga-jaga skala' saat korpusnya 50 ribu halaman. Skala yang belum ada = biaya yang sudah ada. Mulai dari pgvector; pindah saat metrik (latensi p99, jumlah vektor) memaksa, bukan saat firasat memaksa.",
      },
      reference: "Bentuk data + volume + perilaku yang diinginkan → RAG, fine-tuning, atau keduanya.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: 1,2 juta halaman arsip Bank Nusa Dana",
      prose: [
        "Bank Nusa Dana ingin RAG di atas seluruh arsip: 1,2 juta halaman regulasi, SOP, dan memo — sekitar 4,8 juta chunk. Retrieval@5 saat ini 41%. Audit menemukan: (1) chunk 2.048 token tanpa overlap — pasal terpotong di batas; (2) OCR tanpa validasi — 3% angka salah baca; (3) index tidak di-rebuild 6 bulan — 6.000 halaman revisi tidak masuk index.",
        "Rencana perbaikan: chunk 512 + overlap 64; pipeline OCR dengan confidence threshold 0,85 + audit 1% sampel; re-embed penuh: 4,8 juta chunk ÷ 2.000 per batch = 2.400 batch × 3 detik = 7.200 detik (±2 jam), biaya Rp25 per 1.000 chunk = Rp120 ribu. Total proyek perbaikan ±Rp180 juta (termasuk 2 engineer selama 2 bulan) — versus Rp200 juta per tahun bila 'solusinya' ganti model LLM.",
        "Pertanyaan analisis: (1) Kenapa perbaikan dimulai dari chunking, bukan dari ganti model LLM? (2) Apa risiko terbesar dari re-embed 4,8 juta chunk, dan bagaimana versioning mengatasinya? (3) Setelah perbaikan, retrieval@5 naik ke 86% tapi 14% masih salah — kapan 86% 'cukup' untuk asisten internal vs asisten nasabah?",
        "Pembahasan: (1) Karena akar masalah terukur di pipeline — ganti model tidak memperbaiki chunk yang terpotong atau OCR yang salah baca. (2) Risiko: index baru lebih buruk, atau proses gagal di tengah — versioning memberi rollback instan dan migrasi bertahap tanpa downtime. (3) Untuk asisten internal, 86% + sitasi + keberanian menjawab 'tidak tahu' sudah operasional; untuk nasabah, jawaban berisiko (angka, keputusan kredit) butuh human-in-the-loop.",
      ],
      tasks: [],
      reference: "Perbaiki pipa dulu, ganti mesin belakangan. Ukur retrieval@k sebelum dan sesudah — bukan perasaan.",
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
        "Dua jalur data AI: pipeline fitur (angka untuk ML klasik; kontraknya konsistensi train-serve dan point-in-time) dan pipeline embedding (teks→vektor untuk RAG/LLM; kontraknya chunking rapi + index berversi).",
        "Chunking: ±512 token + overlap ±64; terlalu besar = noise, terlalu kecil = konteks hilang, tanpa overlap = makna terpotong di batas.",
        "Ganti model embedding = index basi total: re-embed seluruh korpus dengan versioning dan migrasi bertahap, bukan big-bang.",
        "Vector store: ANN untuk kecepatan, metadata filter untuk presisi; pgvector cukup di bawah ±1 juta vektor, mesin khusus di atas itu.",
        "Dokumen butuh OCR + validasi + metadata sitasi; PII di-scrub SEBELUM chunking; dataset fine-tuning: 3.000 contoh bersih mengalahkan 200.000 contoh berisik, dengan eval set yang terpisah.",
      ],
      next: { label: "DE25 — Vector Database Operasional", href: "/learn/de25-vector-database" },
      quiz: [
        {
          q: "Chatbot RAG bank menjawab dengan angka suku bunga yang salah, padahal model LLM-nya sama dengan kompetitor yang akurat. Langkah pertama yang paling tepat?",
          options: [
            { text: "Ganti ke model LLM yang lebih besar", why: "Mahal dan belum tentu menyentuh akar masalah — di cerita lesson ini modelnya tidak pernah salah baca, pipelinenya yang bocor." },
            { text: "Audit pipeline data: chunking, kualitas OCR, dan kesegaran index", why: "Tepat: tiga titik kegagalan paling umum RAG semuanya ada di sisi data, bukan di model.", correct: true },
            { text: "Tambah GPU untuk inference", why: "GPU mempercepat jawaban yang salah — kecepatan bukan masalahnya." },
            { text: "Latih ulang model dari nol", why: "Pretraining ulang butuh data dan biaya raksasa untuk masalah yang letaknya di chunking dan OCR." },
          ],
        },
        {
          q: "Dokumen regulasi di-chunk 2.048 token tanpa overlap. Risiko terbesarnya?",
          options: [
            { text: "Index vector menjadi terlalu kecil", why: "Ukuran index bukan masalahnya — kualitas potongannya." },
            { text: "Pasal dan tabel terpotong di batas chunk, konteks hilang saat retrieval", why: "Tepat: tanpa overlap, kalimat terbelah dua dan maknanya rusak — retrieval membawa potongan tak lengkap.", correct: true },
            { text: "Embedding menjadi lebih akurat", why: "Sebaliknya: chunk besar berisi banyak topik = vektor rata-rata yang kabur." },
            { text: "Query berjalan lebih cepat", why: "Kecepatan query ditentukan index ANN, bukan ukuran chunk." },
          ],
        },
        {
          q: "Tim mengganti model embedding v1 ke v2 yang skornya lebih baik. Tindakan yang benar?",
          options: [
            { text: "Tetap pakai index lama agar hemat", why: "Vektor v1 dan v2 hidup di 'ruang makna' berbeda — tidak bisa dibandingkan, hasilnya ngawur." },
            { text: "Cukup ganti nama model di file konfigurasi", why: "Config tidak mengubah fakta bahwa seluruh vektor di index dibuat oleh model lama." },
            { text: "Re-embed seluruh korpus, versikan index (v2), migrasi bertahap dengan rollback", why: "Tepat: index terikat versi model; versioning + migrasi bertahap memberi jalan kembali bila index baru bermasalah.", correct: true },
            { text: "Hapus semua dokumen lalu upload ulang", why: "Menghapus dokumen tidak menyelesaikan apa-apa — yang basi adalah vektornya, bukan dokumennya." },
          ],
        },
        {
          q: "Knowledge base 300 ribu halaman dan butuh filter 'hanya regulasi tahun 2024 ke atas'. Pilihan paling rasional?",
          options: [
            { text: "Vector store khusus dengan 10 node", why: "Overkill: 300 ribu halaman (±1,2 juta chunk) masih nyaman di Postgres, dan filter SQL-nya justru lebih kaya." },
            { text: "pgvector + metadata filter (doc_type, tahun)", why: "Tepat: di bawah ±1 juta vektor, pgvector + filter metadata menyelesaikan kebutuhan tanpa infrastruktur baru.", correct: true },
            { text: "Simpan vektor di file CSV", why: "CSV tidak punya index ANN maupun filter efisien — retrieval 1,2 juta vektor akan lambat dan menyiksa." },
            { text: "Tidak perlu vector store, cukup LIKE di SQL", why: "LIKE mencocokkan kata, bukan makna — 'BI rate' tidak akan ketemu 'suku bunga acuan'." },
          ],
        },
        {
          q: "Dokumen arsip mengandung NIK dan nomor rekening nasabah. Sebelum masuk pipeline RAG, yang wajib dilakukan?",
          options: [
            { text: "Scrubbing PII (regex + NER + audit sampel) SEBELUM chunking", why: "Tepat: sekali PII ter-embed, ia bisa bocor lewat jawaban chatbot; vektor yang sudah masuk index tidak bisa 'dibersihkan' sebagian.", correct: true },
            { text: "Biarkan saja — vektor tidak bisa dibaca manusia", why: "Salah dan berbahaya: jawaban chatbot adalah teks biasa, dan PII bisa muncul di sana saat query-nya 'mirip'." },
            { text: "Cukup enkripsi vector store-nya", why: "Enkripsi melindungi dari pencurian database, bukan dari jawaban chatbot yang sah tapi bocor." },
            { text: "Hapus PII setelah ada laporan kebocoran", why: "Reaktif dan terlambat — kebocoran sudah terjadi, dan index lama tetap menyimpan PII-nya." },
          ],
        },
        {
          q: "Bank ingin asisten yang menulis memo risiko dengan format baku mereka. Data training terbaik?",
          options: [
            { text: "200.000 contoh mentah tanpa dedup", why: "Volume tanpa kurasi mengajarkan kebiasaan buruk — model meniru noise yang paling banyak." },
            { text: "3.000 pasangan instruksi–respons yang bersih, terdedup, bebas PII, plus eval set terpisah", why: "Tepat: fine-tuning mengubah perilaku/format — 3.000 contoh bagus mengalahkan 200.000 contoh berisik, dan eval set terpisah mencegah 'mencontek'.", correct: true },
            { text: "Upload seluruh arsip PDF sebagai data training", why: "Itu bahan RAG (pengetahuan), bukan bahan fine-tuning (perilaku) — formatnya salah untuk tujuan ini." },
            { text: "Duplikatkan 500 contoh terbaik menjadi 50.000", why: "Duplikat mengajarkan hafalan, bukan pemahaman — model jadi kaku menghadapi variasi baru." },
          ],
        },
      ],
    },
  ],
};
