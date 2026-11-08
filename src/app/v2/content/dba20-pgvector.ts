import type { V2Lesson } from "../lib/types";

// ── Figure: memori indeks HNSW untuk 1 juta vektor pada tiga dimensi ───────
const MEM_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Estimasi memori indeks HNSW untuk satu juta vektor pada dimensi 384, 768, dan 1536">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="140" y1="20" x2="140" y2="200"/><line x1="140" y1="200" x2="540" y2="200"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<text x="20" y="80">dim 384</text><text x="20" y="130">dim 768</text><text x="20" y="180">dim 1536</text>
<text x="140" y="222">0</text><text x="300" y="222">3 GB</text><text x="470" y="222">6 GB</text>
</g>
<g opacity="0.9">
<rect x="142" y="66" width="136" height="20" rx="4" fill="var(--c1)"/>
<rect x="142" y="116" width="266" height="20" rx="4" fill="var(--c2)"/>
<rect x="142" y="166" width="525" height="20" rx="4" fill="var(--c3)"/>
</g>
<g font-size="10" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="284" y="80">1,60 GB</text><text x="414" y="130">3,14 GB</text><text x="500" y="180">6,21 GB</text>
</g>
</svg>`;

export const dba20: V2Lesson = {
  slug: "dba20-pgvector",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA20 — pgvector: Vector Search di PostgreSQL",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan apa itu pencarian vektor dan kapan ia mengalahkan pencarian kata kunci; (2) memakai tipe `vector` dan operator jarak pgvector (`<->`, `<#>`, `<=>`) dengan benar; (3) memilih antara indeks HNSW dan IVFFlat berdasar trade-off recall, waktu build, dan memori; (4) mengestimasi kebutuhan memori indeks dari jumlah vektor dan dimensinya; (5) memutuskan kapan pgvector cukup dan kapan vector database khusus layak dibayar.",
        "Rutenya: cerita fitur “cari dengan foto” yang timeout → tipe vector dan operator jarak → HNSW vs IVFFlat → perencanaan kapasitas memori → lab simulasi pencarian ala pgvector → kapan pgvector cukup → peta keputusan → mini-case katalog 2,4 juta produk → kuis → rangkuman. Estimasi 65 menit; lab-nya ±10 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Indeks database mempercepat pencarian dengan struktur data (B-tree untuk rentang, hash untuk kesetaraan) — semuanya mengasumsikan “cocok” berarti sama persis atau berurutan. Embedding adalah representasi teks/gambar sebagai vektor angka (mis. 768 dimensi) sehingga “mirip” bisa diukur sebagai jarak geometris. Pencarian vektor = temukan K vektor terdekat dengan query; brute force membandingkan query ke SEMUA baris (O(N)), indeks ANN (approximate nearest neighbor) mengorbankan sedikit akurasi demi kecepatan. pgvector adalah ekstensi Postgres yang membawa tipe `vector` dan indeks ANN ke dalam database yang sudah kamu kuasai.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: pencarian kata kunci bertanya “apakah kata ini ADA?”; pencarian vektor bertanya “mana yang PALING MIRIP?”. Yang pertama soal kecocokan, yang kedua soal jarak — dan jarak butuh geometri, bukan kamus.",
      ],
      reference: "Bekal: indeks klasik = cocok persis/berurutan; embedding = vektor kemiripan; ANN = cepat dengan sedikit mengorbankan akurasi.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Empat detik yang membunuh fitur “cari dengan foto”",
      prose: [
        "Rudi, DBA sebuah marketplace, diminta tim produk meluncurkan “cari dengan foto”: pelanggan mengunggah foto sepatu, sistem mengembalikan produk paling mirip. Tim ML sudah menghasilkan embedding 768 dimensi untuk 2,4 juta produk. Rudi menyimpannya di Postgres sebagai kolom `float[]` dan menulis query brute force — hitung jarak ke semua baris, ambil 5 terkecil. Di staging (10 ribu produk) hasilnya 80 milidetik. “Aman,” katanya.",
        "Saat peluncuran, query yang sama butuh 4,2 detik — dan timeout di jam sibuk. Brute force berarti setiap query menyentuh 2,4 juta × 768 angka: sekitar 1,8 miliar operasi per pencarian. Seorang vendor vector database khusus menawari kontrak Rp1,2 miliar per tahun dengan janji “sub-50 milidetik”. Manajemen hampir menandatangani — sampai Rudi mengukur satu hal: 92% query pelanggan menyertakan filter kategori (`WHERE kategori = 'sepatu'`) dan tim produk hanya butuh recall 0,95, bukan 1,0.",
        "Twist-nya: dengan filter SQL dulu lalu indeks HNSW pgvector di atasnya, latensi turun ke 60 milidetik — di Postgres yang sama, dengan biaya Rp0. Vendor Rp1,2 miliar itu bukan penipu; ia hanya menjawab pertanyaan yang salah. Pelajaran lesson ini: ukur dulu medannya (filter? recall berapa? skala berapa?), baru putuskan senjatanya. DBA yang baik tidak membeli kecepatan — ia membeli kecepatan yang TEPAT.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: pencarian vektor = masalah machine learning",
        body: "Yang benar: begitu embedding tersedia, pencarian vektor adalah masalah DATABASE — indeks, memori, latensi, dan trade-off recall. Itu wilayah DBA, bukan data scientist.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-operator",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tipe vector dan operator jarak — Si Pengukur Kemiripan",
      prose: [
        "pgvector menambah tipe `vector(768)` — kolom yang menyimpan tepat 768 angka. Tiga operator jarak adalah jantungnya: `<->` jarak Euclidean (garis lurus antar titik), `<#>` negative inner product (untuk vektor yang belum dinormalisasi, makin besar dot product makin dekat), dan `<=>` cosine distance (1 − cosine similarity; mengukur SUDUT, mengabaikan panjang vektor). Untuk embedding teks/gambar yang sudah dinormalisasi, `<=>` adalah pilihan default industri.",
        "Aturan mainnya sederhana: query `SELECT ... ORDER BY embedding <=> '[0.1, 0.2, ...]' LIMIT 5` mengembalikan 5 tetangga terdekat. Tanpa indeks, Postgres melakukan sequential scan — persis brute force Rudi. Operatornya murah ditulis; yang mahal adalah tidak adanya indeks.",
      ],
      formula: String.raw`\text{cos\_dist}(a, b) = 1 - \frac{a \cdot b}{\|a\| \, \|b\|}`,
      formulaNote: "cos_dist = cosine distance (0 = identik arah, 2 = berlawanan arah); a · b = dot product kedua vektor; ||a||, ||b|| = panjang (norm) masing-masing vektor; hasilnya 0 berarti sudut 0° (semirip mungkin).",
      tasks: [],
      note: {
        title: "🚨 Mitos: cosine distance dan cosine similarity bisa ditukar",
        body: "Yang benar: keduanya mengurutkan hasil dengan SAMA, tetapi nilainya beda — distance = 1 − similarity. Threshold “ambil yang similarity > 0,8” tidak sama dengan “distance < 0,8”. Salah tukar = filter yang salah.",
        type: "pitfall",
      },
      hints: [
        "💡 Normalisasi vektor sekali saat ingest (panjang = 1) membuat `<#>` dan `<=>` ekuivalen dan menghemat satu pembagian per perbandingan.",
      ],
    },
    {
      id: "konsep-indeks",
      eyebrow: "Langkah 4 · Konsep",
      title: "HNSW vs IVFFlat — Si Cepat vs Si Hemat",
      prose: [
        "Dua indeks ANN pgvector mewakili dua filosofi. HNSW membangun graf berlapis: pencarian melompat dari lapisan kasar ke halus seperti mencari alamat dari kota → kecamatan → gang. Query-nya sangat cepat dan recall-nya tinggi, tetapi build-nya lambat dan rakus memori. IVFFlat membagi vektor ke dalam `lists` klaster (voronoi) lalu hanya memeriksa `probes` klaster terdekat saat query — build cepat dan hemat, tetapi recall-nya tergantung seberapa banyak klaster kamu periksa.",
        "Recall@K mengukur kejujuran indeks: dari K tetangga sejati, berapa yang berhasil ditemukan. Rumusnya di bawah. Recall 1,0 = sempurna; recall 0,9 = 1 dari 10 tetangga terbaik lolos. Untuk “cari produk mirip”, recall 0,95 tidak terasa bedanya oleh manusia — tetapi query-nya bisa 10× lebih cepat.",
      ],
      formula: String.raw`\text{recall}@K = \frac{|\text{tepat} \cap \text{indeks}|}{K}`,
      formulaNote: "recall@K = proporsi tetangga sejati yang tertangkap (0–1); “tepat” = K tetangga dari brute force; “indeks” = K tetangga dari indeks ANN; ∩ = irisan keduanya; K = jumlah tetangga yang diminta.",
      tasks: [],
      note: {
        title: "🚨 Mitos: indeks vektor selalu lebih cepat dari brute force",
        body: "Yang benar: di bawah puluhan ribu baris, sequential scan justru menang — overhead graf/klaster tidak terbayar. Indeks ANN mulai masuk akal di atas ~100 ribu vektor. Jangan mengindeks 8.000 baris lalu heran kenapa lebih lambat.",
        type: "pitfall",
      },
      hints: [
        "💡 Aturan praktis: `lists` IVFFlat ≈ baris/1000 untuk 1 juta baris; HNSW `ef_construction` 64–200 menaikkan recall dengan harga build lebih lama.",
      ],
    },
    {
      id: "konsep-kapasitas",
      eyebrow: "Langkah 5 · Konsep",
      title: "Perencanaan kapasitas: hitung dulu memorinya",
      prose: [
        "Indeks vektor hidup di RAM agar cepat — dan RAM adalah anggaran yang harus dihitung, bukan ditebak. Estimasi kasarnya di bawah: setiap vektor butuh dimensinya × 4 byte (float32) plus overhead struktur indeks (HNSW ≈ 64 byte per vektor untuk tautan graf). Kalikan dengan jumlah baris, itulah harga kecepatan.",
        "Cara membaca: sumbu X = estimasi memori dalam GB; panjang batang = kebutuhan untuk 1 juta vektor; label di ujung batang = angka pastinya. Interpretasi: memori tumbuh LINEAR terhadap dimensi — naik dari 384 ke 1536 melipatgandakan kebutuhan ~4×. Untuk 2,4 juta vektor dimensi 768 (kasus Rudi), kalikan batang tengah dengan 2,4: sekitar 7,5 GB — muat nyaman di server 64 GB, tanpa vendor Rp1,2 miliar.",
      ],
      formula: String.raw`M = N \times (d \times 4 + o)`,
      formulaNote: "M = memori indeks (byte); N = jumlah vektor; d = dimensi embedding; 4 = byte per float32; o = overhead per vektor (≈64 byte untuk HNSW, lebih kecil untuk IVFFlat).",
      figure: {
        svg: MEM_SVG,
        alt: "Estimasi memori indeks HNSW untuk satu juta vektor pada dimensi 384, 768, dan 1536",
        caption: "Memori indeks HNSW untuk 1 juta vektor: 1,60 GB (dim 384), 3,14 GB (dim 768), 6,21 GB (dim 1536).",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: recall harus 1,0",
        body: "Yang benar: recall 1,0 berarti kamu membayar harga exact search. Untuk rekomendasi produk, recall 0,95 dengan latensi 10× lebih cepat adalah kemenangan — manusia tidak bisa membedakan tetangga peringkat 4 dan 5 yang tertukar.",
        type: "pitfall",
      },
    },
    {
      id: "lab-vektor",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Simulasi pencarian ala pgvector",
      prose: [
        "Waktunya jadi Rudi — tetapi dengan data kecil yang bisa kamu ukur. Di bawah ada 2000 vektor sintetis (64 dimensi) dan satu query. Tugasmu: (1) temukan 5 tetangga terdekat secara exact (brute force atas `d`); (2) simulasikan indeks ANN dengan hanya memeriksa 10% dan 50% kandidat acak; (3) hitung recall@5 masing-masing; (4) hitung kebutuhan memori indeks. Analogi jujurnya: `kandidat(0.10)` meniru `ef_search` kecil (sedikit yang diperiksa, cepat tapi buta), `kandidat(0.50)` meniru `ef_search` besar.",
        "Coba: setelah lolos, ubah fraksi menjadi 0.25 dan 0.75, lalu amati kurva recall vs jumlah perbandingan — di titik mana tambahan kandidat berhenti menaikkan recall secara berarti? Itulah titik tuning `ef_search`-mu di produksi.",
      ],
      tasks: [
        { id: "t1", text: "Isi `top_exact`: 5 indeks dengan jarak `d` terkecil (brute force)" },
        { id: "t2", text: "Isi `top_10`: 5 indeks terbaik di antara `kandidat(0.10)`" },
        { id: "t3", text: "Isi `top_50`: 5 indeks terbaik di antara `kandidat(0.50)`" },
        { id: "t4", text: "Hitung `recall_10` = |irisan(top_exact, top_10)| / K" },
        { id: "t5", text: "Hitung `recall_50` = |irisan(top_exact, top_50)| / K" },
        { id: "t6", text: "Hitung `mem_mb` = N * (DIM*4 + 64) / 1024**2" },
        { id: "t7", text: "Jalankan dan pastikan keempat baris tercetak" },
      ],
      expected: "top-5 exact: [591, 231, 543, 1350, 1354]\nrecall@5 kandidat 10%: 0.00 (banding 200)\nrecall@5 kandidat 50%: 1.00 (banding 1000)\nmemori indeks: 0.61 MB",
      code: {
        starter: `import numpy as np

rng = np.random.default_rng(42)
N, DIM, K = 2000, 64, 5          # dataset SINTETIS: 2000 vektor, 64 dimensi
data = rng.normal(size=(N, DIM))  # JANGAN UBAH
q = rng.normal(size=DIM)          # query; JANGAN UBAH

def cosine_distance(a, B):
    na = a / np.linalg.norm(a)
    nB = B / np.linalg.norm(B, axis=1, keepdims=True)
    return (1.0 - (nB @ na)).tolist()

def kandidat(frac, seed=1000):
    r = np.random.default_rng(seed)
    return r.choice(N, size=int(N * frac), replace=False).tolist()

d = cosine_distance(q, data)

# TULIS KODEMU DI BAWAH INI
top_exact = []  # TODO t1

top_10 = []     # TODO t2
top_50 = []     # TODO t3

recall_10 = 0.0 # TODO t4
recall_50 = 0.0 # TODO t5

mem_mb = 0.0    # TODO t6

print(f"top-5 exact: {top_exact}")
print(f"recall@5 kandidat 10%: {recall_10:.2f} (banding {int(N*0.10)})")
print(f"recall@5 kandidat 50%: {recall_50:.2f} (banding {int(N*0.50)})")
print(f"memori indeks: {mem_mb:.2f} MB")`,
        lockLines: 19,
        solution: `import numpy as np

rng = np.random.default_rng(42)
N, DIM, K = 2000, 64, 5          # dataset SINTETIS: 2000 vektor, 64 dimensi
data = rng.normal(size=(N, DIM))  # JANGAN UBAH
q = rng.normal(size=DIM)          # query; JANGAN UBAH

def cosine_distance(a, B):
    na = a / np.linalg.norm(a)
    nB = B / np.linalg.norm(B, axis=1, keepdims=True)
    return (1.0 - (nB @ na)).tolist()

def kandidat(frac, seed=1000):
    r = np.random.default_rng(seed)
    return r.choice(N, size=int(N * frac), replace=False).tolist()

d = cosine_distance(q, data)

# TULIS KODEMU DI BAWAH INI
top_exact = sorted(range(N), key=lambda i: d[i])[:K]

def top_dari(cand):
    return [cand[i] for i in sorted(range(len(cand)), key=lambda j: d[cand[j]])[:K]]

top_10 = top_dari(kandidat(0.10))
top_50 = top_dari(kandidat(0.50))

recall_10 = len(set(top_exact) & set(top_10)) / K
recall_50 = len(set(top_exact) & set(top_50)) / K

mem_mb = N * (DIM * 4 + 64) / 1024 ** 2

print(f"top-5 exact: {top_exact}")
print(f"recall@5 kandidat 10%: {recall_10:.2f} (banding {int(N*0.10)})")
print(f"recall@5 kandidat 50%: {recall_50:.2f} (banding {int(N*0.50)})")
print(f"memori indeks: {mem_mb:.2f} MB")`,
        checks: [
          { kind: "defined", task: "t1", name: "top_exact", label: "`top_exact` terdefinisi", msg: "Isi top_exact di bawah marker TULIS KODEMU." },
          { kind: "equal", task: "t1", name: "top_exact", value: [591, 231, 543, 1350, 1354], tol: 0, label: "`top_exact` = 5 tetangga sejati", msg: "Urutkan indeks 0..N-1 berdasar jarak d, ambil 5 terkecil." },
          { kind: "equal", task: "t4", name: "recall_10", value: 0.0, tol: 0.01, label: "`recall_10` = 0,00", msg: "Irisan top_exact dan top_10 dibagi K — kandidat 10% terlalu buta di sini." },
          { kind: "equal", task: "t5", name: "recall_50", value: 1.0, tol: 0.01, label: "`recall_50` = 1,00", msg: "Irisan top_exact dan top_50 dibagi K — kandidat 50% menangkap semuanya." },
          { kind: "equal", task: "t6", name: "mem_mb", value: 0.61, tol: 0.01, label: "`mem_mb` ≈ 0,61 MB", msg: "N * (DIM*4 + 64) / 1024**2." },
          { kind: "stdout_matches", task: "t7", pattern: "top-5 exact: ", label: "Baris top-5 tercetak", msg: "Pastikan print pertama mengeluarkan daftar indeks." },
          { kind: "stdout_matches", task: "t7", pattern: "memori indeks: 0.61 MB", label: "Baris memori tercetak", msg: "Baris terakhir: “memori indeks: 0.61 MB”." },
        ],
      },
      reference: "ANN = tukar sedikit recall dengan banyak kecepatan. recall@K mengukur harga yang dibayar; ukuran kandidat mengukur kecepatan yang dibeli.",
    },
    {
      id: "kapan-pgvector",
      eyebrow: "Langkah 7 · Konsep",
      title: "Kapan pgvector cukup — dan kapan harus membayar",
      prose: [
        "Keunggulan pgvector bukan kecepatannya — vector database khusus bisa lebih cepat di skala raksasa. Keunggulannya adalah KEBERSAMAAN: vektor tinggal serumah dengan data transaksionalmu. Filter `WHERE kategori = 'sepatu' AND stok > 0`, JOIN ke tabel harga, dan transaksi ACID semuanya gratis karena ini Postgres. Tidak ada sinkronisasi dua sistem, tidak ada inkonsistensi “produk sudah dihapus tapi vektornya masih ada”.",
        "Bayarlah vector database khusus ketika: (a) skala miliaran vektor dengan SLA latensi ketat; (b) butuh multi-tenancy dengan isolasi namespace yang kompleks; (c) tim ML butuh fitur hibrida (sparse + dense) yang belum ada di pgvector. Untuk sisanya — termasuk kasus Rudi — pgvector adalah jawaban default yang jujur. DBA yang membeli sistem baru sebelum mengukur adalah DBA yang membayar pajak ketidaktahuan.",
      ],
      tasks: [],
      note: {
        title: "Catatan jujur — batas pgvector",
        body: "pgvector tidak punya sharding vektor bawaan dan filter pra-indeks (pre-filtering) bisa menurunkan recall bila filter sangat selektif. Kenali batasnya sebelum berjanji ke tim produk.",
        type: "risk",
      },
      hints: [
        "💡 Pola produksi yang umum: satu kolom `embedding vector(768)`, indeks HNSW, dan query `WHERE kategori = ... ORDER BY embedding <=> $1 LIMIT 20` — filter relasional + jarak vektor dalam satu query.",
      ],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan pencarian vektor",
      prose: [
        "Skenario 1 — Kurang dari 50 ribu vektor: pakai brute force (sequential scan + `ORDER BY ... LIMIT K`). Indeks ANN tidak terbayar; kesederhanaan menang.",
        "Skenario 2 — Ratusan ribu hingga ~100 juta vektor + butuh filter SQL/JOIN: pgvector dengan indeks HNSW. Satu sistem, satu backup, satu monitoring.",
        "Skenario 3 — Miliaran vektor, SLA < 20 ms, multi-tenant: vector database khusus (atau sharding pgvector dengan kompleksitas yang kamu tanggung sendiri). Di sinilah Rp1,2 miliar mulai masuk akal.",
        "Skenario 4 — Recall harus 1,0 mutlak (deduplikasi dokumen hukum, anti-fraud): exact search, terima konsekuensi latensinya. Jangan berbohong pada diri sendiri dengan ANN lalu heran ada yang lolos.",
        "Aturan praktis 10 detik: (1) Ada filter SQL/JOIN? → pgvector dulu. (2) Di bawah 50 rb baris? → tanpa indeks. (3) Butuh recall berapa — 0,95 atau 1,0? (4) Hitung memori dengan M = N × (d × 4 + o) SEBELUM memilih HNSW.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Katalog 2,4 juta produk, anggaran 16 GB",
      prose: [
        "Marketplace tempat Rudi bekerja: 2,4 juta produk, embedding 768 dimensi, server database dengan 16 GB dialokasikan untuk indeks vektor. Tim produk menuntut recall ≥ 0,95 dan latensi p95 < 100 ms. Dua opsi di meja: (A) HNSW di pgvector; (B) IVFFlat dengan 2.400 lists dan 40 probes. Hitung kebutuhan memori masing-masing (HNSW: overhead 64 byte/vektor; IVFFlat: overhead ~8 byte/vektor), lalu putuskan — dan jelaskan apa yang berubah bila anggaran memori dipotong menjadi 4 GB.",
        "Pertanyaan: (1) Berapa memori masing-masing opsi? (2) Opsi mana yang kamu pilih dan kenapa? (3) Bila anggaran 4 GB, apa rencanamu — tetap pgvector atau pindah strategi?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "HNSW: 2,4 jt × (768×4 + 64) = 2,4 jt × 3.136 byte ≈ 7,53 GB — muat di 16 GB dengan ruang lega untuk pertumbuhan. IVFFlat: 2,4 jt × (3.072 + 8) ≈ 7,39 GB — mirip, tetapi recall 0,95 butuh probes lebih banyak (latensi naik). Pilihan: HNSW — recall dan latensi terbaik dalam anggaran. Bila anggaran 4 GB: tidak ada opsi yang muat penuh → pertimbangkan reduksi dimensi (mis. 768 → 384 via proyeksi, memori ~3,8 GB) atau IVFFlat dengan lists lebih besar + probes moderat dan terima recall ~0,90. Pelajarannya: keterbatasan memori mengubah jawaban, bukan menghilangkan kebutuhan berhitung.",
        type: "risk",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Pencarian vektor mengukur JARAK (kemiripan), bukan kecocokan kata — begitu embedding ada, ini masalah database (indeks, memori, latensi).",
        "Operator pgvector: `<->` Euclidean, `<#>` negative inner product, `<=>` cosine distance = 1 − cosine similarity.",
        "HNSW = cepat + recall tinggi, build lambat + rakus memori; IVFFlat = build cepat + hemat, recall tergantung probes.",
        "recall@K = |tepat ∩ indeks| / K; recall 0,95 biasanya cukup untuk UX manusia.",
        "Memori indeks: M = N × (d × 4 + o); hitung SEBELUM memilih indeks.",
        "pgvector menang saat butuh filter SQL/JOIN/ACID serumah dengan vektor; vector DB khusus untuk skala miliaran atau SLA ekstrem.",
      ],
      next: { label: "DBA21 — Oracle: RMAN, Data Guard, dan AWR", href: "/v2/learn/dba21-oracle-rman-data-guard" },
      quiz: [
        {
          q: "Query `ORDER BY embedding <=> '[...]' LIMIT 5` artinya?",
          options: [
            { text: "Ambil 5 vektor dengan cosine distance terkecil (paling mirip arahnya)", why: "Benar: `<=>` = 1 − cosine similarity; ORDER BY menaik + LIMIT 5 = 5 tetangga terdekat.", correct: true },
            { text: "Ambil 5 vektor yang identik persis", why: "Salah: ini pencarian kemiripan, bukan kesamaan persis — vektor jarang identik.", correct: false },
            { text: "Ambil 5 vektor dengan panjang terbesar", why: "Salah: cosine distance mengabaikan panjang vektor, hanya peduli sudut.", correct: false },
            { text: "Ambil 5 baris pertama tabel secara acak", why: "Salah: ORDER BY jarak mengurutkan berdasar kemiripan, bukan urutan acak.", correct: false },
          ],
        },
        {
          q: "Kapan IVFFlat lebih tepat daripada HNSW?",
          options: [
            { text: "Selalu — IVFFlat lebih modern", why: "Salah: tidak ada yang “selalu”; keduanya trade-off.", correct: false },
            { text: "Saat waktu build dan memori terbatas, dan recall sedang masih bisa diterima", why: "Benar: IVFFlat murah dibangun dan hemat memori; recall dikendalikan via probes.", correct: true },
            { text: "Saat butuh recall 0,99 dengan latensi terendah", why: "Salah: itu medan HNSW — query tercepat dengan recall tertinggi.", correct: false },
            { text: "Saat dataset di bawah 10 ribu vektor", why: "Salah: di bawah puluhan ribu, brute force tanpa indeks justru menang.", correct: false },
          ],
        },
        {
          q: "recall@5 = 0,60 artinya?",
          options: [
            { text: "60% query gagal", why: "Salah: recall bukan tingkat kegagalan query.", correct: false },
            { text: "3 dari 5 tetangga sejati berhasil ditemukan indeks", why: "Benar: 0,60 × 5 = 3 — dua tetangga terbaik lolos dari hasil.", correct: true },
            { text: "Query 60% lebih cepat dari brute force", why: "Salah: recall mengukur akurasi, bukan kecepatan.", correct: false },
            { text: "Indeks memakai 60% memori brute force", why: "Salah: tidak ada hubungan recall dengan pemakaian memori.", correct: false },
          ],
        },
        {
          q: "Estimasi memori HNSW untuk 10 juta vektor dimensi 768 (overhead 64 byte)?",
          options: [
            { text: "≈ 3,1 GB", why: "Salah: itu untuk 1 juta vektor — kamu lupa mengalikan 10.", correct: false },
            { text: "≈ 31,4 GB", why: "Benar: 10 jt × (768×4 + 64) = 10 jt × 3.136 byte ≈ 31,36 GB.", correct: true },
            { text: "≈ 314 GB", why: "Salah: kelebihan satu nol — cek kembali perkaliannya.", correct: false },
            { text: "Tidak bisa diestimasi tanpa menjalankan", why: "Salah: rumusnya deterministik — DBA menghitung dulu, bukan menebak.", correct: false },
          ],
        },
        {
          q: "Aplikasi butuh `WHERE status = 'aktif'` + JOIN ke tabel harga + pencarian vektor. Pilihan paling jujur?",
          options: [
            { text: "Vector DB khusus + sinkronisasi manual ke Postgres", why: "Salah: dua sistem = dua sumber kebenaran; sinkronisasi adalah utang operasional.", correct: false },
            { text: "pgvector — filter, JOIN, dan ACID serumah dengan vektornya", why: "Benar: keunggulan pgvector adalah kebersamaan dengan data relasional.", correct: true },
            { text: "Brute force di aplikasi, tanpa database", why: "Salah: memindahkan 2,4 juta vektor ke aplikasi per query adalah bencana latensi.", correct: false },
            { text: "Elasticsearch untuk semuanya", why: "Salah: bukan medan alaminya untuk JOIN transaksional + ACID.", correct: false },
          ],
        },
        {
          q: "“Indeks vektor selalu mengalahkan brute force.” Respons yang tepat?",
          options: [
            { text: "Setuju — indeks selalu lebih cepat", why: "Salah: di bawah puluhan ribu baris, sequential scan menang.", correct: false },
            { text: "Salah untuk dataset kecil: overhead ANN tidak terbayar di bawah ~50–100 ribu vektor; indeks mulai masuk akal di atas itu", why: "Benar: kecepatan indeks adalah fungsi skala — tanpa skala, ia hanya overhead.", correct: true },
            { text: "Setuju asal memakai HNSW", why: "Salah: HNSW pun punya overhead build dan memori yang tidak gratis.", correct: false },
            { text: "Salah karena brute force recall-nya 1,0", why: "Salah alasan: recall 1,0 benar, tetapi alasannya soal biaya/kecepatan, bukan akurasi.", correct: false },
          ],
        },
      ],
    },
  ],
};
