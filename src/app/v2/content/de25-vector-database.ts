import type { V2Lesson } from "../lib/types";

// Recall vs biaya RAM: empat konfigurasi yang dibandingkan tim TaniKlik.
const COST_SVG = `<svg viewBox="0 0 640 260" role="img" aria-label="Perbandingan recall dan kebutuhan RAM empat konfigurasi vector store.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="60" y="60" width="70" height="160" fill="var(--c1)" fill-opacity="0.75"/>
<rect x="170" y="170" width="70" height="50" fill="var(--c2)" fill-opacity="0.75"/>
<rect x="280" y="195" width="70" height="25" fill="var(--c3)" fill-opacity="0.75"/>
<rect x="390" y="212" width="70" height="8" fill="var(--c4)" fill-opacity="0.75"/>
<rect x="500" y="20" width="70" height="200" fill="var(--chart-text)" fill-opacity="0.25"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text)" text-anchor="middle">
<text x="95" y="235">3072-dim + Milvus</text>
<text x="205" y="235">768-dim + Qdrant</text>
<text x="315" y="235">384-dim + pgvector</text>
<text x="425" y="235">128-dim + pgvector</text>
<text x="535" y="235">batas RAM 8 GB</text>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--chart-text)" text-anchor="middle">
<text x="95" y="50">recall 99,2%</text>
<text x="205" y="162">recall 98,6%</text>
<text x="315" y="188">recall 100%</text>
<text x="425" y="205">recall 100%</text>
<text x="95" y="30" font-size="11">~37 GB</text>
<text x="205" y="152" font-size="11">~9 GB</text>
<text x="315" y="178" font-size="11">~3,1 GB</text>
<text x="425" y="196" font-size="11">~1 GB</text>
</g>
<text x="320" y="255" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">tinggi batang = kebutuhan RAM index (2 juta vektor); label = recall@10 terhadap brute force</text>
</svg>`;

// HNSW: lapisan atas melompat jauh, lapisan bawah menyisir dekat.
const HNSW_SVG = `<svg viewBox="0 0 640 220" role="img" aria-label="Ilustrasi lapisan HNSW: pencarian melompat di lapisan atas lalu menyisir di lapisan bawah.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<g stroke="var(--c2)" stroke-width="1.5">
<circle cx="120" cy="60" r="14" fill="var(--c2)" fill-opacity="0.2"/><circle cx="260" cy="60" r="14" fill="var(--c2)" fill-opacity="0.2"/><circle cx="400" cy="60" r="14" fill="var(--c2)" fill-opacity="0.2"/><circle cx="540" cy="60" r="14" fill="var(--c2)" fill-opacity="0.2"/>
<line x1="134" y1="60" x2="246" y2="60"/><line x1="274" y1="60" x2="386" y2="60"/><line x1="414" y1="60" x2="526" y2="60"/>
</g>
<g stroke="var(--c1)" stroke-width="1.2">
<circle cx="80" cy="150" r="11" fill="var(--c1)" fill-opacity="0.2"/><circle cx="170" cy="150" r="11" fill="var(--c1)" fill-opacity="0.2"/><circle cx="260" cy="150" r="11" fill="var(--c1)" fill-opacity="0.2"/><circle cx="350" cy="150" r="11" fill="var(--c1)" fill-opacity="0.2"/><circle cx="440" cy="150" r="11" fill="var(--c1)" fill-opacity="0.2"/><circle cx="530" cy="150" r="11" fill="var(--c1)" fill-opacity="0.2"/>
<line x1="91" y1="150" x2="159" y2="150"/><line x1="181" y1="150" x2="249" y2="150"/><line x1="271" y1="150" x2="339" y2="150"/><line x1="361" y1="150" x2="429" y2="150"/><line x1="451" y1="150" x2="519" y2="150"/>
</g>
<line x1="260" y1="74" x2="260" y2="139" stroke="var(--chart-text)" stroke-dasharray="5 4"/>
<polygon points="260,74 254,86 266,86" fill="var(--chart-text)"/>
<polygon points="400,150 392,144 392,156" fill="var(--c1)"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text)">
<text x="60" y="30">lapisan 1: sedikit simpul, lompatan jauh</text>
<text x="60" y="120">lapisan 0: semua vektor, koneksi dekat</text>
<text x="300" y="110" fill="var(--chart-text)" font-size="10">turun lapisan</text>
<text x="470" y="185" font-size="10" fill="var(--chart-text)">query masuk, berhenti di tetangga terdekat</text>
</g>
</svg>`;

export const de25: V2Lesson = {
  slug: "de25-vector-database",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE25 — Vector Database Operasional: pgvector, Pinecone, dan Weaviate",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Setelah lesson ini, kamu bisa memilih dan mengoperasikan vector database seperti engineer yang membayar tagihannya sendiri — bukan seperti yang membaca brosur vendor.",
        "(1) Menjelaskan mengapa embedding diperlakukan sebagai data biasa: berversi, bisa basi, dan punya biaya penyimpanan;",
        "(2) Membedakan brute force, IVF, dan HNSW — kapan pendekatan 'tidak sempurna' menghemat jutaan rupiah dan kapan ia menipu;",
        "(3) Merancang metadata filtering + hybrid search sebelum menyentuh tuning ANN apa pun;",
        "(4) Menghitung ekonomi index: dimensi × jumlah vektor × overhead = RAM, dan RAM = tagihan;",
        "(5) Menyusun runbook operasional: refresh index, monitoring recall, dan migrasi model embedding.",
        "Alurnya: cerita TaniKlik yang memilih 'yang terbaik' dan kalah di dua sisi → embedding sebagai data → index ANN → filter dan hybrid → ekonomi dan operasional → lab index mainan → peta keputusan → mini-case 2 juta vektor.",
        "Estimasi 65 menit. Lab memakai numpy — tanpa install, jalan di browser.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Recall 99,2% yang kalah dari dua sisi",
      prose: [
        "Februari 2026. TaniKlik, agritech dari Yogyakarta, meluncurkan pencarian visual: petani memotret hama di sawah, aplikasi mengembalikan produk pestisida yang cocok. Di baliknya: 2 juta foto produk diubah menjadi embedding 3072 dimensi, disimpan di Milvus dengan index HNSW, di atas instance 64 GB RAM.",
        "Benchmark pra-rilis terlihat meyakinkan: recall@10 = 99,2% terhadap brute force, latensi p99 = 12 milidetik. Kontrak cluster vector database ditandatangani satu tahun: Rp210 juta. Tim bangga — mereka memilih 'yang terbaik'.",
        "Twist-nya datang dari tim logistik yang membangun RAG arsip internal dengan pgvector: model embedding 384 dimensi, brute force biasa, tanpa index ANN sama sekali. Hasilnya: recall@10 = 100% (eksak, karena brute force memang tidak pernah salah), latensi p99 = 380 milidetik — dan tagihan Rp28 juta per tahun.",
        "Bacalah lagi angka itu: yang 'terbaik' menurut benchmark ternyata kalah akurasi (99,2% vs 100%) DAN kalah biaya (Rp210 juta vs Rp28 juta). 99,2% terdengar hebat sampai kamu sadar 0,8% yang hilang itu adalah kesalahan yang DIBAYAR MAHAL untuk dibuat — sementara brute force yang 'kuno' memberi jawaban sempurna karena 2 juta vektor masih nyaman di-scan Postgres. Tim membayar Rp182 juta per tahun untuk memperlambat dan memperburuk jawabannya sendiri.",
      ],
      tasks: [],
      reference: "Benchmark tanpa konteks biaya dan skala = iklan. 'Terbaik' hanya bermakna bila diukur terhadap kebutuhanmu.",
    },
    {
      id: "embedding-data",
      eyebrow: "Langkah 3 · Embedding sebagai data",
      title: "Embedding sebagai data: si KTP makna",
      prose: [
        "Embedding adalah deretan angka yang menempatkan teks (atau gambar) di 'ruang makna': yang mirip maknanya berdekatan, walau katanya beda. Untuk data engineer, cara berpikir yang benar: embedding adalah KOLOM data biasa — ia bisa basi, bisa salah, dan menempati byte. Panggil dia Si KTP Makna: identitas resmi tiap dokumen, yang kedaluwarsa bila model pembuatnya diganti.",
        "Dimensi adalah ukuran KTP-nya: 3072 angka vs 384 angka per dokumen. Rumus biayanya sederhana — untuk N vektor berdimensi d dengan float 32-bit:",
      ],
      formula: String.raw`\text{RAM} \approx N \times d \times 4\ \text{byte} \times \text{overhead}`,
      formulaNote: "N = jumlah vektor; d = dimensi embedding; 4 byte = satu float32; overhead = faktor index (brute force ≈ 1, HNSW ≈ 1,4–1,6). Contoh: 2 juta × 3072 × 4 × 1,5 ≈ 37 GB.",
      tasks: [],
      note: {
        title: "🚨 Mitos: dimensi lebih besar selalu lebih akurat",
        type: "pitfall",
        body: "Akurasi embedding ditentukan model dan datanya, bukan semata dimensinya. Model 384 dimensi yang dilatih untuk retrieval sering mengalahkan model 3072 dimensi generik pada domain spesifik — dengan RAM 8 kali lebih kecil. Ukur recall pada data-MU, bukan angka dimensi di brosur.",
      },
      reference: "Embedding = kolom data berversi. Hitung RAM sebelum memilih dimensi; versi index mengikuti versi model.",
    },
    {
      id: "ann-index",
      eyebrow: "Langkah 4 · Index ANN",
      title: "ANN index: si pustakawan yang melompat",
      prose: [
        "Mencari tetangga terdekat di antara 2 juta vektor satu per satu (brute force) itu akurat 100% tapi lambat: tiap query membandingkan dengan semuanya. ANN — approximate nearest neighbor — adalah teknik 'tidak memeriksa semuanya': mengorbankan sedikit akurasi demi kecepatan berkali lipat. Panggil dia Si Pustakawan yang Melompat: alih-alih menggeledah tiap rak, ia melompat ke lorong yang paling mungkin benar.",
        "Dua arsitekturnya yang paling dipakai. HNSW (lapisan seperti menara): vektor disusun berlapis — lapisan atas berisi sedikit simpul dengan lompatan jauh, lapisan bawah berisi semua vektor dengan koneksi ke tetangga dekat. Query masuk dari atas, melompat jauh, lalu turun dan menyisir dekat. Parameter kuncinya ef: makin besar ef, makin banyak kandidat diperiksa — recall naik, latensi naik. IVF (partisi ember): vektor dikelompokkan ke nlist ember (centroid); query hanya memeriksa nprobe ember terdekat. Ember sedikit yang diperiksa = cepat tapi bisa melewatkan jawaban yang jatuh di ember sebelah.",
        "Cara membaca diagram: query masuk di lapisan 1, melompat antar simpul jauh (garis panjang), turun ke lapisan 0, lalu berhenti di tetangga terdekat. Inilah mengapa HNSW cepat di jutaan vektor: ia tidak pernah melihat sebagian besar gudang.",
        "Interpretasi: kecepatan ANN datang dari 'tidak melihat'. Risiko ANN datang dari tempat yang sama — jawaban terbaik bisa ada di lorong yang tidak dilompati. Inilah 0,8% yang hilang di cerita TaniKlik.",
      ],
      figure: {
        svg: HNSW_SVG,
        alt: "Ilustrasi lapisan HNSW: pencarian melompat di lapisan atas lalu menyisir di lapisan bawah.",
        caption: "HNSW: melompat jauh di lapisan atas, menyisir dekat di lapisan bawah. Cepat karena sebagian besar vektor tidak pernah diperiksa.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: recall 99% 'cukup dekat' dengan 100%",
        type: "pitfall",
        body: "1% dari 10.000 query harian = 100 jawaban buruk per hari — dan yang hilang cenderung kasus sulit (tepi distribusi), bukan kasus mudah. Untuk pencarian produk, 1% itu pelanggan yang pergi ke kompetitor. Selalu ukur recall@k TERHADAP brute force pada data produksi-mu, bukan pada dataset benchmark vendor.",
      },
      reference: "HNSW: cepat karena melompat. IVF: cepat karena mengabaikan ember jauh. Keduanya menukar recall dengan latensi — ukur, jangan percaya.",
    },
    {
      id: "filter-hybrid",
      eyebrow: "Langkah 5 · Filter dan hybrid",
      title: "Filter dulu, cari makna kemudian: si satpam dan pustakawan",
      prose: [
        "Rahasia paling murah di dunia vector search: saring dengan metadata DULU, baru cari makna di dalam saringan. 'Pestisida untuk padi, tahun 2024 ke atas' — filter SQL biasa (kategori = pestisida, tahun >= 2024) memangkas 2 juta vektor menjadi 40 ribu, lalu vector search bekerja di 40 ribu itu. Panggil polanya Si Satpam dan Pustakawan: satpam memeriksa KTP di pintu, pustakawan hanya melayani yang lolos.",
        "Ini menyelesaikan 80% kebutuhan RAG perusahaan tanpa tuning ANN apa pun — dan sering membuat ANN tidak diperlukan sama sekali, karena 40 ribu vektor bisa di-brute-force dalam milidetik. Hybrid search melangkah lebih jauh: menggabungkan skor vektor (makna) dengan skor teks klasik BM25 (kata kunci) — 'BI rate' ketemu 'suku bunga acuan' lewat vektor, 'Pasal 12 ayat 3' ketemu persis lewat kata kunci.",
        "Urutan yang benar: filter metadata → (opsional) BM25 → vector search → gabung skor → top-k. Jangan pernah vector-search dulu lalu filter belakangan — kamu membuang komputasi untuk kandidat yang akhirnya dibuang.",
        "💡 Intuisi: kalau query-mu selalu menyebut kategori, tanggal, atau tipe dokumen, separuh pekerjaan vector database-mu sebenarnya dikerjakan oleh WHERE clause.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: hybrid search selalu lebih baik dari murni vektor",
        type: "pitfall",
        body: "Hybrid membantu bila query mengandung istilah persis (nomor pasal, nama produk, kode). Bila query murni semantik ('cara mengatasi daun menguning'), BM25 hanya menambah noise dan latensi. Uji A/B retrieval@k dengan dan tanpa komponen teks pada query nyata pengguna — bukan pada tebakan.",
      },
      reference: "Filter metadata dulu, vector search di dalam saringan, BM25 hanya untuk istilah persis.",
    },
    {
      id: "operasional",
      eyebrow: "Langkah 6 · Operasional",
      title: "Operasional: refresh, monitoring, dan ekonomi index",
      prose: [
        "Vector database yang sudah jalan butuh perawatan seperti database lain — plus dua hal khas. Pertama, refresh index: dokumen baru harus di-embed dan masuk index; dokumen revisi harus menggantikan versi lama (bukan menumpuk duplikat yang saling berebut peringkat). Jadwalkan rebuild atau incremental upsert, dan ukur lag: 'dokumen terbit jam 9, bisa dicari jam berapa?'",
        "Kedua, monitoring recall: jalankan set query evaluasi tetap setiap minggu, bandingkan ANN vs brute force. Recall yang merayap turun biasanya berarti distribusi data bergeser (produk baru beda gaya bahasa) atau parameter index (ef, nprobe) tidak lagi cocok. Recall drift adalah metrik kesehatan vector store — seperti error rate untuk API.",
        "Ketiga, ekonomi: dimensi adalah tuas termahal. Turun dari 3072 ke 768 dimensi memangkas RAM 4 kali lipat; bila recall@10 hanya turun 0,6 poin (99,2% menjadi 98,6%), itu dagang yang hampir selalu menang. Cara membaca diagram: tinggi batang = kebutuhan RAM untuk 2 juta vektor — batang 3072-dim menabrak batas 8 GB sendirian; label = recall@10 terhadap brute force.",
        "Interpretasi: opsi 384-dim + pgvector memberi recall SEMPURNA (brute force = 100%) dengan RAM 3,1 GB — di sinilah TaniKlik seharusnya berhenti sebelum menandatangani kontrak Rp210 juta. Opsi 128-dim menunjukkan batasnya: RAM 1 GB tapi recall 90,5% — terlalu murah untuk dibayar dengan akurasi.",
      ],
      figure: {
        svg: COST_SVG,
        alt: "Perbandingan recall dan kebutuhan RAM empat konfigurasi vector store.",
        caption: "Recall vs RAM (2 juta vektor). Brute force selalu 100% — pertanyaannya hanya apakah skalanya muat di kantong.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: index vector 'set and forget'",
        type: "pitfall",
        body: "Index membusuk tiga arah: data baru tidak masuk (stale), model embedding diganti (basi total — seluruh index harus di-embed ulang), dan distribusi bergeser (recall turun diam-diam). Runbook minimum: jadwal refresh, eval set mingguan, dan prosedur re-embed berversi dengan rollback.",
      },
      reference: "Rawat index seperti database: refresh terjadwal, recall dimonitor, re-embed berversi.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: index mainan — eksak vs pendekatan",
      prose: [
        "Waktunya membangun. Lab ini mensimulasikan vector database mini: 12 produk TaniKlik dengan embedding 4 dimensi dan kategori. Kamu akan mengimplementasikan tiga hal: pencarian brute force (eksak), pencarian dengan filter metadata, dan 'index pendekatan' ala IVF yang hanya memeriksa ember yang sama dengan query.",
        "Perhatikan hasil akhirnya: index pendekatan melewatkan P02 — produk pestisida yang sebenarnya peringkat 3 — karena ia jatuh di ember yang berbeda dari query. Itulah harga pendekatan: 0,8% yang hilang di cerita TaniKlik, dalam bentuk mini.",
        "Cara membaca output: tiap baris 'top' menampilkan id produk peringkat teratas; baris recall menunjukkan berapa dari 3 jawaban eksak yang ditemukan pendekatan.",
        "Interpretasi: recall = 0,6667 berarti sepertiga jawaban terbaik hilang. Di produksi, angka inilah yang kamu negosiasikan dengan latensi — bukan firasat.",
      ],
      formula: String.raw`\text{recall@k} = \frac{|\text{hasil ANN} \cap \text{hasil eksak}|}{k}`,
      formulaNote: "recall@k = fraksi jawaban benar yang ditemukan pendekatan; pembilang = irisan dua himpunan peringkat teratas; k = jumlah jawaban (di lab ini k = 3). Nilai 1 = sempurna, 0,667 = satu dari tiga hilang.",
      tasks: [
        { id: "t1", text: "Lengkapi `brute_topk`: urutkan semua item menurut cosine, kembalikan list id k teratas" },
        { id: "t2", text: "Lengkapi `filtered_topk`: saring kategori dulu, baru urutkan menurut cosine" },
        { id: "t3", text: "Lengkapi `approx_topk`: hanya periksa ember yang sama dengan query, hitung `recall`, pastikan 4 baris print cocok dengan expected" },
      ],
      expected: "top brute: ['P01', 'P03', 'P02']\ntop filter(pestisida): ['P01', 'P03']\ntop approx: ['P01', 'P03', 'P11']\nrecall=0.6667",
      note: {
        title: "Sering salah",
        body: "Mengurutkan skor ascending (terkecil dulu) sehingga 'top' berisi yang paling TIDAK mirip. Cosine makin besar = makin mirip — urutkan descending (reverse=True).",
      },
      hints: [
        "brute_topk: sorted(items, key=lambda it: cosine(it[2], q), reverse=True), ambil it[0] untuk k pertama.",
        "filtered_topk: calon = [it for it in items if it[1] == kategori] dulu, lalu pola yang sama.",
        "approx_topk: ember_q = bucket(q); calon = [it for it in items if bucket(it[2]) == ember_q].",
      ],
      code: {
        starter: `# Katalog produk TaniKlik: 12 produk, embedding mainan 4 dimensi\n` +
`import numpy as np\n` +
`items = [\n` +
`    ("P01", "pestisida", [4, 1, 0, 1]),\n` +
`    ("P02", "pestisida", [4, -2, 1, 1]),\n` +
`    ("P03", "pestisida", [5, 0, 1, 2]),\n` +
`    ("P04", "pupuk", [-1, 4, 1, 0]),\n` +
`    ("P05", "pupuk", [0, -5, 0, 1]),\n` +
`    ("P06", "pupuk", [1, -3, 2, 1]),\n` +
`    ("P07", "benih", [0, 1, 5, 1]),\n` +
`    ("P08", "benih", [-1, 0, 4, 2]),\n` +
`    ("P09", "benih", [2, 1, 3, 0]),\n` +
`    ("P10", "pestisida", [4, -3, 0, 0]),\n` +
`    ("P11", "pupuk", [2, 2, 2, 2]),\n` +
`    ("P12", "benih", [0, -2, 2, 4]),\n` +
`]\n` +
`query = [5, 1, 1, 1]\n` +
`\n` +
`def cosine(a, b):\n` +
`    a = np.array(a, dtype=float)\n` +
`    b = np.array(b, dtype=float)\n` +
`    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))\n` +
`\n` +
`def bucket(v):\n` +
`    return (1 if v[0] >= 0 else -1, 1 if v[1] >= 0 else -1)\n` +
`\n` +
`# TUGAS 1: lengkapi brute_topk (eksak: periksa SEMUA item)\n` +
`def brute_topk(q, k):\n` +
`    return\n` +
`\n` +
`# TUGAS 2: lengkapi filtered_topk (saring kategori DULU)\n` +
`def filtered_topk(q, kategori, k):\n` +
`    return\n` +
`\n` +
`# TUGAS 3: lengkapi approx_topk (hanya ember yang sama dengan query)\n` +
`def approx_topk(q, k):\n` +
`    return\n` +
`\n` +
`brute3 = brute_topk(query, 3)\n` +
`filt2 = filtered_topk(query, "pestisida", 2)\n` +
`approx3 = approx_topk(query, 3)\n` +
`recall = len(set(brute3) & set(approx3)) / 3\n` +
`print(f"top brute: {brute3}")\n` +
`print(f"top filter(pestisida): {filt2}")\n` +
`print(f"top approx: {approx3}")\n` +
`print(f"recall={recall:.4f}")\n`,
        lockLines: 25,
        solution: `# Katalog produk TaniKlik: 12 produk, embedding mainan 4 dimensi\nimport numpy as np\nitems = [\n    ("P01", "pestisida", [4, 1, 0, 1]),\n    ("P02", "pestisida", [4, -2, 1, 1]),\n    ("P03", "pestisida", [5, 0, 1, 2]),\n    ("P04", "pupuk", [-1, 4, 1, 0]),\n    ("P05", "pupuk", [0, -5, 0, 1]),\n    ("P06", "pupuk", [1, -3, 2, 1]),\n    ("P07", "benih", [0, 1, 5, 1]),\n    ("P08", "benih", [-1, 0, 4, 2]),\n    ("P09", "benih", [2, 1, 3, 0]),\n    ("P10", "pestisida", [4, -3, 0, 0]),\n    ("P11", "pupuk", [2, 2, 2, 2]),\n    ("P12", "benih", [0, -2, 2, 4]),\n]\nquery = [5, 1, 1, 1]\n\ndef cosine(a, b):\n    a = np.array(a, dtype=float)\n    b = np.array(b, dtype=float)\n    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))\n\ndef bucket(v):\n    return (1 if v[0] >= 0 else -1, 1 if v[1] >= 0 else -1)\n\n# TUGAS 1: lengkapi brute_topk (eksak: periksa SEMUA item)\ndef brute_topk(q, k):\n    skor = sorted(items, key=lambda it: cosine(it[2], q), reverse=True)\n    return [it[0] for it in skor[:k]]\n\n# TUGAS 2: lengkapi filtered_topk (saring kategori DULU)\ndef filtered_topk(q, kategori, k):\n    calon = [it for it in items if it[1] == kategori]\n    skor = sorted(calon, key=lambda it: cosine(it[2], q), reverse=True)\n    return [it[0] for it in skor[:k]]\n\n# TUGAS 3: lengkapi approx_topk (hanya ember yang sama dengan query)\ndef approx_topk(q, k):\n    ember_q = bucket(q)\n    calon = [it for it in items if bucket(it[2]) == ember_q]\n    skor = sorted(calon, key=lambda it: cosine(it[2], q), reverse=True)\n    return [it[0] for it in skor[:k]]\n\nbrute3 = brute_topk(query, 3)\nfilt2 = filtered_topk(query, "pestisida", 2)\napprox3 = approx_topk(query, 3)\nrecall = len(set(brute3) & set(approx3)) / 3\nprint(f"top brute: {brute3}")\nprint(f"top filter(pestisida): {filt2}")\nprint(f"top approx: {approx3}")\nprint(f"recall={recall:.4f}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "brute_topk", label: "fungsi `brute_topk` terdefinisi", msg: "Definisikan brute_topk(q, k) yang mengembalikan list id." },
          { kind: "equal", task: "t1", name: "brute3", value: ["P01", "P03", "P02"], label: "`brute3` = P01, P03, P02", msg: "Tiga produk paling mirip query menurut cosine." },
          { kind: "defined", task: "t2", name: "filtered_topk", label: "fungsi `filtered_topk` terdefinisi", msg: "Definisikan filtered_topk(q, kategori, k) yang mengembalikan list id." },
          { kind: "equal", task: "t2", name: "filt2", value: ["P01", "P03"], label: "`filt2` = P01, P03", msg: "Dua pestisida paling mirip query." },
          { kind: "defined", task: "t3", name: "approx_topk", label: "fungsi `approx_topk` terdefinisi", msg: "Definisikan approx_topk(q, k) yang hanya memeriksa ember query." },
          { kind: "equal", task: "t3", name: "recall", value: 0.6667, tol: 0.01, label: "`recall` sekitar 0,667", msg: "2 dari 3 jawaban eksak ditemukan pendekatan (P02 lolos dari ember)." },
          { kind: "stdout_matches", task: "t3", pattern: "top approx: \\['P01', 'P03', 'P11'\\]", label: "pendekatan menemukan P01, P03, P11", msg: "approx_topk melewatkan P02 yang jatuh di ember lain." },
          { kind: "stdout_matches", task: "t3", pattern: "recall=0\\.6667", label: "`print` recall=0.6667", msg: "Baris ringkasan harus mencetak recall=0.6667." },
        ],
      },
      reference: "Eksak dulu sebagai kebenaran, pendekatan sebagai dagang. Filter metadata sebelum vector search.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: vector store apa untuk siapa?",
      prose: [
        "Skenario 1 — Di bawah 1 juta vektor, tim sudah memakai Postgres, butuh filter metadata kaya. Keputusan: pgvector + brute force atau index IVF ringan. Alasan: satu database, tanpa infrastruktur baru, recall eksak bila di-brute-force.",
        "Skenario 2 — Di atas 10 juta vektor, SLA p99 di bawah 100ms. Keputusan: mesin khusus (Milvus/Qdrant/Weaviate) + HNSW + index berversi. Alasan: skala dan latensi sudah di luar jangkauan scan biasa.",
        "Skenario 3 — Query selalu menyebut kategori, tanggal, atau tipe dokumen. Keputusan: metadata filter dulu, vector search di dalam saringan — apapun mesinnya. Alasan: memangkas kandidat 50 kali lipat lebih murah dari tuning ANN.",
        "Skenario 4 — Ganti model embedding. Keputusan: re-embed seluruh korpus + versioning index + migrasi bertahap (shadow index), bukan big-bang. Alasan: vektor lama dan baru hidup di ruang berbeda; rollback harus tersedia.",
        "Skenario 5 — Budget terbatas, korpus tumbuh 2 kali lipat per tahun. Keputusan: turunkan dimensi dulu (ukur recall!), naikkan mesin belakangan. Alasan: dimensi adalah tuas biaya termurah — setengah dimensi, setengah RAM, recall turun sering di bawah 1 poin.",
        "Aturan praktis 10 detik: hitung RAM = N × d × 4 × overhead. Bila muat di database yang sudah ada dengan brute force = selesai. Bila tidak muat = ANN. Bila ragu = ukur recall@k terhadap brute force pada data sendiri.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih vector store khusus 'untuk jaga-jaga skala' saat korpusnya 50 ribu dokumen. Skala yang belum ada = biaya yang sudah ada. Mulai dari yang paling sederhana yang lolos SLA; pindah saat metrik memaksa.",
      },
      reference: "RAM muat + SLA lolos = pgvector. Tidak muat = mesin khusus. Selalu ada filter metadata.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: 2 juta vektor TaniKlik, putuskan ulang",
      prose: [
        "Kamu mewarisi keputusan TaniKlik: 2 juta foto produk, embedding 3072 dimensi, Milvus HNSW di instance 64 GB RAM, kontrak Rp210 juta per tahun. Hitungannya: 2.000.000 × 3072 × 4 byte = 24,6 GB + overhead HNSW ≈ 1,5× = 37 GB — memang butuh instance 64 GB (Rp17,5 juta/bulan).",
        "Alternatif yang diusulkan: model embedding 384 dimensi yang dilatih untuk retrieval produk + pgvector brute force di instance 8 GB (Rp2,3 juta/bulan = Rp27,6 juta/tahun). RAM: 2.000.000 × 384 × 4 = 3,1 GB — muat nyaman. Evaluasi offline pada 500 query nyata: recall@10 alternatif = 100% (eksak) vs incumbent 99,2%; latensi p99 alternatif 380ms vs 12ms — keduanya di bawah SLA 1 detik untuk pencarian visual.",
        "Pertanyaan analisis: (1) Mengapa tim awal memilih konfigurasi Rp210 juta — bias pengukuran apa yang terjadi? (2) Hitung penghematan tahunan bila pindah, dan apa yang harus dibuktikan sebelum migrasi? (3) Dalam kondisi apa kamu akan TETAP memilih Milvus HNSW 3072-dim?",
        "Pembahasan: (1) Benchmark diukur tanpa konteks biaya dan tanpa baseline brute force — '99,2%' terdengar hebat sampai dibandingkan dengan 100% yang gratis. Bias: mengukur yang mudah diukur (recall, latensi) dan mengabaikan yang menentukan (biaya, kebutuhan nyata). (2) Hemat Rp182,4 juta/tahun. Sebelum migrasi: buktikan recall@10 = 100% pada query produksi nyata (bukan 500 sampel sintetis), uji beban p99 di jam puncak, dan siapkan rollback (index lama tetap jalan paralel 2 minggu). (3) Tetap di Milvus bila: korpus tumbuh ke 50 juta vektor (brute force tak lagi muat), SLA p99 di bawah 100ms yang ketat, atau butuh replikasi multi-region yang dikelola.",
      ],
      tasks: [],
      reference: "Keputusan infrastruktur = aritmetika + bukti, bukan brosur. Selisih Rp182 juta/tahun pantas dapat evaluasi 2 minggu.",
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
        "Embedding = kolom data biasa: berversi, bisa basi, dan punya biaya (RAM ≈ N × d × 4 × overhead).",
        "Brute force = recall 100% (eksak); ANN (HNSW/IVF) menukar recall dengan latensi — ukur recall@k terhadap brute force.",
        "Filter metadata dulu, vector search kemudian; hybrid (vektor + BM25) hanya untuk query beristilah persis.",
        "Dimensi adalah tuas biaya termurah: turunkan dimensi dan ukur recall sebelum membeli mesin.",
        "Operasional: refresh terjadwal, monitoring recall mingguan, re-embed berversi dengan rollback.",
      ],
      next: { label: "DE26 — Apache Flink: Stream Processing yang Stateful", href: "/v2/learn/de26-apache-flink" },
      quiz: [
        {
          q: "Korpus 300 ribu dokumen, tim sudah memakai Postgres, SLA 2 detik. Pilihan paling rasional?",
          options: [
            { text: "Cluster vector store khusus 5 node 'untuk jaga-jaga'", why: "Overkill: 300 ribu vektor muat nyaman di Postgres, dan filter SQL-nya justru lebih kaya — skala yang belum ada = biaya yang sudah ada.", },
            { text: "pgvector + metadata filter, brute force dulu, ukur latensi", why: "Tepat: mulai dari yang paling sederhana yang lolos SLA; brute force memberi recall eksak 100% sebagai baseline kebenaran.", correct: true },
            { text: "Simpan embedding di file CSV dan scan dengan script", why: "CSV tidak punya index maupun filter efisien — 300 ribu vektor akan lambat dan operasionalnya menyiksa.", },
            { text: "Tidak perlu vector store, cukup LIKE di SQL", why: "LIKE mencocokkan kata, bukan makna — query semantik tidak akan ketemu.", },
          ],
        },
        {
          q: "Query pengguna selalu menyebut kategori produk dan tahun. Optimasi termurah dan paling berdampak?",
          options: [
            { text: "Naikkan parameter ef HNSW dua kali lipat", why: "Menaikkan ef menambah latensi untuk semua query — mahal dan tidak menyentuh akar masalah.", },
            { text: "Filter metadata (kategori, tahun) dulu, vector search di dalam saringan", why: "Tepat: memangkas kandidat puluhan kali lipat sebelum pencarian vektor — lebih murah dari tuning ANN apa pun.", correct: true },
            { text: "Ganti ke model embedding berdimensi lebih besar", why: "Dimensi lebih besar = RAM lebih besar, tanpa menyelesaikan apa-apa soal penyaringan.", },
            { text: "Tambah replika vector store", why: "Replika menambah throughput, bukan presisi — kandidat yang salah tetap dicari, hanya lebih cepat.", },
          ],
        },
        {
          q: "Tim mengganti model embedding v1 ke v2 yang lebih baik. Tindakan yang benar?",
          options: [
            { text: "Tetap pakai index lama agar hemat", why: "Vektor v1 dan v2 hidup di ruang makna berbeda — hasilnya ngawur.", },
            { text: "Re-embed seluruh korpus, versikan index, migrasi bertahap dengan rollback", why: "Tepat: index terikat versi model; versioning + shadow index memberi jalan kembali bila index baru bermasalah.", correct: true },
            { text: "Cukup update nama model di konfigurasi", why: "Konfigurasi tidak mengubah fakta seluruh vektor dibuat model lama.", },
            { text: "Hapus index lama segera agar hemat storage", why: "Menghapus jalan kembali sebelum index baru terbukti — migrasi tanpa jaring pengaman.", },
          ],
        },
        {
          q: "Recall@10 sistem turun dari 98% menjadi 91% dalam dua bulan, tanpa perubahan kode. Penyebab paling mungkin?",
          options: [
            { text: "Bug di kode aplikasi", why: "Kode tidak berubah — cari yang berubah: datanya.", },
            { text: "Distribusi data bergeser atau index basi (dokumen baru tak masuk / revisi tak terganti)", why: "Tepat: recall drift klasik — data baru beda gaya bahasa, atau refresh index macet. Inilah gunanya eval set mingguan.", correct: true },
            { text: "Pengguna mengetik lebih lambat", why: "Kecepatan mengetik tidak memengaruhi recall retrieval.", },
            { text: "Model LLM-nya perlu diganti", why: "Recall@10 adalah metrik retrieval, bukan metrik LLM — jangan menembak ke arah yang salah.", },
          ],
        },
        {
          q: "Di lab lesson ini, index pendekatan melewatkan P02. Pelajaran operasionalnya?",
          options: [
            { text: "Pendekatan (ANN) selalu buruk dan harus dihindari", why: "Berlebihan: di skala 50 juta vektor, brute force bukan pilihan — pendekatan adalah satu-satunya jalan, dengan recall yang terukur.", },
            { text: "Setiap index pendekatan punya 'titik buta' — ukur recall@k terhadap brute force dan negosiasikan dengan latensi secara eksplisit", why: "Tepat: P02 adalah 0,8%-nya TaniKlik dalam bentuk mini — yang hilang selalu kasus di tepi partisi. Ukur, jangan firasat.", correct: true },
            { text: "Solusinya selalu menambah ember yang diperiksa", why: "Menambah ember menaikkan latensi — kadang jawabannya justru menurunkan dimensi atau memperbaiki filter.", },
            { text: "P02 memang produk yang buruk", why: "P02 adalah pestisida yang relevan (peringkat 3 eksak) — 'buruk' hanyalah cara index melihatnya.", },
          ],
        },
        {
          q: "Kapan HNSW/Milvus benar-benar dibutuhkan (bukan sekadar keren)?",
          options: [
            { text: "Saat korpus di atas ~10 juta vektor dengan SLA latensi ketat, atau butuh replikasi/sharding serius", why: "Tepat: di sinilah brute force tak lagi muat dan latensi tak lagi lolos — ANN berhenti jadi kemewahan dan menjadi kebutuhan.", correct: true },
            { text: "Saat tim ingin terlihat modern di depan manajemen", why: "Teknologi untuk panggung = Rp182 juta per tahun untuk panggung.", },
            { text: "Saat jumlah dokumen di bawah 100 ribu", why: "Di bawah 100 ribu, Postgres + brute force hampir selalu menang di biaya dan kesederhanaan.", },
            { text: "Saat belum ada metrik recall yang diukur", why: "Tanpa metrik, kamu tidak tahu butuh apa — ukur dulu, beli kemudian.", },
          ],
        },
      ],
    },
  ],
};

