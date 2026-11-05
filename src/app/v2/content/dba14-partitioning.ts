import type { V2Lesson } from "../lib/types";

const PART_SVG = `<svg viewBox="0 0 520 154" role="img" aria-label="Query 7 hari: tanpa partisi baca 36 bulan, dengan partisi baca 1.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">Tanpa partisi</text><rect x="150" y="20" width="350.0" height="18" fill="var(--error)"/><text x="506" y="35">36</text>
<text x="140" y="75" text-anchor="end">Dengan partisi</text><rect x="150" y="60" width="9.7" height="18" fill="var(--c1)"/><text x="166" y="75">1</text>
</g>
<text x="150" y="148" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="500" y="148" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">partisi dibaca</text>
</svg>`;
export const dba14: V2Lesson = {
  slug: "dba14-partitioning",
  track: "Database Administrator",
  module: "Operasi & Keandalan",
  title: "DBA14 — Partitioning",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query 7 hari yang membaca 3 tahun",
      prose: [
        "November 2026. Dashboard 'revenue 7 hari terakhir' butuh 4 menit untuk load. Tabel transaksi: 500 juta baris, 3 tahun. Setiap load dashboard = full scan 3 tahun untuk 7 hari data. Pengguna mengira 'datanya besar' — padahal yang besar = pemborosannya.",
        "DBA-nya, Rudi, menambahkan index pada kolom tanggal. Waktu turun ke 2 menit — tetapi scan masih membaca jutaan baris di luar rentang (index membantu, tetapi tidak menghapus data yang tidak perlu dari bacaan). Lalu ia mempartisi tabel per bulan. Waktu: 4 detik. Bukan 2 menit — 4 DETIK. 60x lebih cepat dari index saja.",
        "Twist-nya: index dan partisi menyelesaikan masalah BERBEDA. Index = menemukan baris cepat di DALAM data. Partisi = tidak membaca data yang TIDAK PERLU sama sekali. Query 7 hari tidak perlu menyentuh 35 bulan lainnya — partisi membuat 'tidak menyentuh' menjadi mungkin secara fisik.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan partition pruning; (2) menghitung penghematan bacaan; (3) memilih partition key yang baik; (4) memilih strategi (range/list/hash); (5) mengelola lifecycle partisi (buat, arsip, drop).",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Menjelaskan partition pruning: lewati partisi yang tidak dibutuhkan;",
        "(2) Menghitung rasio bacaan (dibaca/total) untuk query berdasar waktu;",
        "(3) Menilai kandidat partition key (kardinalitas vs pola filter);",
        "(4) Memilih strategi: range (waktu), list (kategori), hash (distribusi);",
        "(5) Merancang lifecycle partisi: buat otomatis, arsip yang lama, drop yang kedaluwarsa.",
      ],
      tasks: [],
    },
    {
      id: "pruning",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Partition pruning: jangan baca yang tidak perlu",
      prose: [
        "Partisi = tabel besar dipecah menjadi potongan fisik berdasar kunci (biasanya waktu). Partition pruning = optimizer MELEWATI partisi yang tidak mungkin berisi jawaban. Query 'Oktober 2026' pada tabel terpartisi bulanan: baca 1 partisi, lewati 35.",
        "Contoh langkah-demi-langkah (dari lab 1): 36 partisi bulanan (2024–2026). Query butuh 2026-10 → dibaca=1, dilewati=35, rasio=0,028 (2,8% data dibaca!). 97,2% bacaan HILANG — bukan dipercepat, tetapi DIHILANGKAN. Inilah kenapa 4 detik vs 2 menit: index mempercepat yang dibaca; partisi menghapus yang tidak perlu dibaca.",
        "Syarat pruning bekerja: filter query HARUS pada partition key (WHERE tanggal BETWEEN ...). Filter pada kolom lain = tidak ada pruning (semua partisi dibaca). Partisi tanpa filter yang cocok = dekorasi mahal.",
        "💡 Intuisi kunci: partisi = jawaban fisik untuk pertanyaan 'data mana yang tidak perlu dibaca?'. Jika 90% query-mu memfilter tanggal, partition key = tanggal. Partisi mengikuti POLA AKSES, bukan struktur data.",
        "Kapan memakai: tabel > 10 juta baris (atau > 100 GB) + mayoritas query memfilter satu kolom yang sama (biasanya waktu). Tabel kecil? Overhead partisi > manfaatnya.",
      ],
      formula: String.raw`\text{Rasio} = \frac{|\text{partisi dibaca}|}{|\text{total partisi}|} = \frac{1}{36} \approx 2{,}8\%`,
      formulaNote:
        "Rasio bacaan = partisi yang dibaca dibagi total partisi. Query 7 hari pada tabel 36 partisi bulanan = 1/36 ≈ 2,8%. 97,2% data tidak dibaca SAMA SEKALI — inilah sumber percepatan 60x (lab 1).",
      note: {
        title: "🚨 Miskonsepsi: partisi = index yang lebih besar",
        body: "Index mempercepat PENCARIAN di dalam data (tetap membaca via index). Partisi MENGHAPUS data dari bacaan (tidak dibaca sama sekali). Keduanya komplementer: partisi untuk 'potong 35 bulan', index di DALAM partisi untuk 'temukan 7 hari'. Rudi butuh KEDUANYA — tetapi partisi memberi 60x, index memberi 2x. Jangan memilih; lapisi.",
      },
      tasks: [],
    },
    {
      id: "key",
      eyebrow: "Langkah 4 · Partition key",
      title: "Memilih kunci: kardinalitas vs pola filter",
      prose: [
        "Partition key yang baik: (1) SERING di-filter (WHERE) — tanpa filter = tanpa pruning; (2) KARDINALITAS SEDANG — ratusan hingga puluhan ribu partisi; (3) STABIL — nilainya tidak berubah-ubah (tanggal lahir customer = stabil; status order = berubah!).",
        "Contoh (dari lab 2): order_id (50 juta unik → 50 juta partisi mungil = bencana) −40; status (4 nilai → pruning hanya 1/4 = lemah) −30; customer_id (2 juta → terlalu banyak) −40; tanggal (1095 + 85% query memfilter) = 85 → TERBAIK. Pemenang = kardinalitas sedang + paling sering difilter.",
        "Terlalu BANYAK partisi (jutaan): overhead metadata, file kecil-kecil, optimizer lambat. Terlalu SEDIKIT (4): pruning lemah (tetap baca 25% data). Sweet spot: tiap partisi 1–10 GB, jumlah ratusan–puluhan ribu.",
        "💡 Intuisi kunci: partition key = kolom yang menjawab 'query-queryku biasanya meminta JENDELA apa?'. Jendela waktu (hari/bulan) = range partition pada tanggal. Jendela kategori (region) = list partition. Tidak ada jendela dominan? Mungkin belum butuh partisi.",
        "Kapan memakai: tanggal/transaksi → RANGE (bulanan/harian). Kategori berhingga (region, tipe) → LIST. Butuh sebar beban tulis merata (tanpa pola filter) → HASH. Pilih SATU strategi dominan — jangan campur tanpa alasan.",
      ],
      note: {
        title: "🚨 Miskonsepsi: semakin banyak partisi semakin baik",
        body: "50 juta partisi (per order_id) = 50 juta file/metadata = database yang tidak bisa bernapas. Setiap partisi punya overhead (file, statistik, entri katalog). Aturannya: partisi sebesar 1–10 GB; jika partisimu berukuran KB = terlalu banyak. 'Granular' bukan 'baik' — 'sesuai pola akses' yang baik.",
      },
      tasks: [],
    },
    {
      id: "pruning-chart",
      eyebrow: "Langkah 5 · Visual",
      title: "36 bulan vs 1 bulan",
      prose: [
        "Cara membaca: dua batang — 'Tanpa partisi' = 36 (seluruh tabel dibaca), 'Dengan partisi' = 1 (hanya Oktober 2026). Batang 'tanpa' disorot merah.",
        "Interpretasi: penghematan BUKAN 36x waktu (ada overhead), tetapi 36x DATA yang tidak dibaca. Di kasus Rudi: 4 menit → 4 detik (60x). Partisi = satu-satunya optimasi yang MENGHILANGKAN kerja, bukan mempercepatnya.",
        "💡 Intuisi kunci: bandingkan dengan index (pelajaran DBA3): index 2x di kasus ini, partisi 60x. Saat query memfilter jendela kecil dari tabel besar, partisi hampir selalu menang. Ukur polanya dulu (query log), baru pilih senjata.",
      ],
      figure: {
        svg: PART_SVG,
        alt: "Partisi dibaca untuk query 7 hari: 36 tanpa partisi vs 1 dengan partisi.",
        caption:
          "Partition pruning: 35 dari 36 partisi tidak dibaca sama sekali.",
      },
      tasks: [],
    },
    {
      id: "lab-pruning",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: kalkulator partition pruning",
      prose: [
        "36 partisi bulanan (2024-01 s.d. 2026-12). Query revenue 7 hari terakhir hanya butuh 2026-10.",
        "Tugasmu: hitung berapa partisi dibaca vs dilewati, dan rasionya.",
        "Hasil: 1 dibaca, 35 dilewati, rasio 0,028. 97,2% data TIDAK DIBACA — inilah 4 detik vs 4 menit.",
        "Coba juga: query 'revenue Q4 2026' (Okt+Nov+Des). Rasio? (3/36 = 0,083. Pruning tetap bekerja — selama filter pada partition key.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dibaca`, `dilewati`, dan `rasio`" },
        { id: "t2", text: "Cetak juga penghematan (partisi yang tidak dibaca)" },
      ],
      expected: "dibaca=1  dilewati=35  rasio=0.028",
      note: {
        title: "Sering salah",
        body: "Menghitung 'dibaca' = 7 (hari) bukan 1 (partisi). Pruning bekerja pada TINGKAT PARTISI (bulanan), bukan baris. 7 hari dalam 1 partisi = 1 partisi dibaca.",
      },
      hints: [
        "dibaca = len(QUERY_BULAN).",
        "dilewati = len(PARTISI) - dibaca.",
        "rasio = dibaca / len(PARTISI).",
      ],
      code: {
        starter: `# Tabel transaksi: 36 partisi bulanan (2024-01 .. 2026-12).\n# Query: "revenue 7 hari terakhir" (Okt 2026).\nPARTISI = [f"{y:04d}-{m:02d}" for y in (2024, 2025, 2026) for m in range(1, 13)]\nQUERY_BULAN = ["2026-10"]  # hanya butuh 1 partisi\n# TULIS KODEMU: dibaca, dilewati, rasio\ndibaca = 0\ndilewati = 0\nrasio = 0.0\n\nprint(f"dibaca={dibaca}  dilewati={dilewati}  rasio={rasio:.3f}")\n`,
        lockLines: 4,
        solution: `# Tabel transaksi: 36 partisi bulanan (2024-01 .. 2026-12).\n# Query: "revenue 7 hari terakhir" (Okt 2026).\nPARTISI = [f"{y:04d}-{m:02d}" for y in (2024, 2025, 2026) for m in range(1, 13)]\nQUERY_BULAN = ["2026-10"]  # hanya butuh 1 partisi\n\n# TULIS KODEMU: dibaca, dilewati, rasio\n# Partition pruning: hanya partisi yang dibutuhkan yang dibaca\ndibaca = len(QUERY_BULAN)\ndilewati = len(PARTISI) - dibaca\nrasio = dibaca / len(PARTISI)\n\nprint(f"dibaca={dibaca}  dilewati={dilewati}  rasio={rasio:.3f}")\nprint(f"penghematan={dilewati} partisi tidak dibaca")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "dibaca", value: 1, label: "`dibaca` = 1", msg: "Hanya 2026-10." },
          { kind: "equal", task: "t1", name: "dilewati", value: 35, label: "`dilewati` = 35", msg: "35 bulan dilewati." },
          { kind: "stdout_matches", task: "t1", pattern: "rasio=0\\.028", label: "`rasio` = 0.028", msg: "1/36 ≈ 2,8%." },
        ],
      },
      reference: "Partition pruning: hitung yang dilewati, bukan yang dibaca.",
    },
    {
      id: "lab-key",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: penilai partition key",
      prose: [
        "Empat kandidat: (kolom, kardinalitas, % query yang memfilter).",
        "Tugasmu: skor = where_pct − penalti (40 jika kardinalitas > 1 juta; 30 jika < 10; 0 jika sedang). Pilih terbaik.",
        "Hasil: tanggal (85) menang telak. order_id = -35 (50 juta partisi mungil = bencana); customer_id = -10; status = 10 (pruning lemah).",
        "Coba juga: bagaimana jika 95% query memfilter customer_id? (skor 55 — masih kalah dari tanggal. Frekuensi TINGGI tidak menyelamatkan kardinalitas BURUK.)",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan fungsi penalti + hitung `skor` tiap kandidat" },
        { id: "t2", text: "Tentukan `terbaik` (skor tertinggi)" },
      ],
      expected: "terbaik=tanggal",
      note: {
        title: "Sering salah",
        body: "Memilih order_id karena 'unik = presisi'. Unik = 50 JUTA partisi = overhead metadata raksasa. Presisi pruning tidak butuh unik — butuh SESUAI POLA AKSES.",
      },
      hints: [
        "penalti(k): >1jt → 40; <10 → 30; else 0.",
        "skor = {kol: pct - penalti(k)}.",
        "terbaik = max(skor, key=skor.get).",
      ],
      code: {
        starter: `# Kandidat partition key: (kolom, kardinalitas, dipakai_di_where_pct)\nKANDIDAT = [\n    ("order_id", 50_000_000, 5),     # unik, jarang di-filter\n    ("tanggal", 1095, 85),           # 3 tahun harian, sering di-filter\n    ("status", 4, 40),               # 4 nilai, sering di-filter\n    ("customer_id", 2_000_000, 30),   # 2 juta, kadang di-filter\n]\n# TULIS KODEMU: skor, terbaik\nskor = {}\nterbaik = ""\n\nprint(f"skor={skor}")\nprint(f"terbaik={terbaik}")\n`,
        lockLines: 7,
        solution: `# Kandidat partition key: (kolom, kardinalitas, dipakai_di_where_pct)\nKANDIDAT = [\n    ("order_id", 50_000_000, 5),     # unik, jarang di-filter\n    ("tanggal", 1095, 85),           # 3 tahun harian, sering di-filter\n    ("status", 4, 40),               # 4 nilai, sering di-filter\n    ("customer_id", 2_000_000, 30),   # 2 juta, kadang di-filter\n]\n\n# TULIS KODEMU: skor, terbaik, alasan\n# Skor = manfaat pruning (where_pct) - penalti kardinalitas ekstrem\n# Aturan: kardinalitas sangat tinggi (jutaan unik) -> partisi terlalu kecil/terlalu banyak\n#         kardinalitas sangat rendah (4) -> pruning lemah (1/4 data tetap dibaca)\ndef penalti(k):\n    if k > 1_000_000:\n        return 40      # terlalu banyak partisi kecil\n    if k < 10:\n        return 30      # pruning lemah\n    return 0\nskor = {kol: pct - penalti(k) for kol, k, pct in KANDIDAT}\nterbaik = max(skor, key=skor.get)\nalasan = "tanggal: kardinalitas sedang (1095) + paling sering di-filter (85%)"\n\nprint(f"skor={skor}")\nprint(f"terbaik={terbaik}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "terbaik", value: "tanggal", label: "`terbaik` = tanggal", msg: "Kardinalitas sedang + 85% filter." },
          { kind: "equal", task: "t1", name: "skor", value: {'order_id': -35, 'tanggal': 85, 'status': 10, 'customer_id': -10}, label: "`skor` benar", msg: "order_id: 5-40; tanggal: 85; status: 40-30; customer: 30-40." },
        ],
      },
      reference: "Partition key: kardinalitas sedang + sering difilter.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 8 · Strategi",
      title: "Range, list, hash: tiga strategi",
      prose: [
        "RANGE (berdasar interval — biasanya waktu): partisi bulanan/harian. Pruning alami untuk query jendela waktu. Contoh: PARTITION BY RANGE (tanggal) — tiap bulan satu partisi. Cocok: 90% kasus time-series.",
        "LIST (berdasar nilai kategori): partisi per region/tipe. Contoh: PARTITION BY LIST (region) — 'ap-southeast', 'eu-west'. Cocok: kategori berhingga + query memfilter kategori + butuh isolasi (drop region = drop partisi).",
        "HASH (berdasar hash key): sebar merata ke N partisi. TIDAK memberi pruning (hash tidak berurutan) — gunanya: sebar beban TULIS + paralelisme. Cocok: tidak ada pola filter dominan, tetapi butuh paralelisme.",
        "SUBPARTITION (komposit): range per bulan + hash di dalamnya. Untuk tabel SANGAT besar (miliaran baris). Jangan mulai dari sini — kompleksitas ganda.",
        "Contoh lifecycle: buat partisi bulan depan OTOMATIS (cron + skrip DBA13!); arsip partisi > 1 tahun ke storage murah (detach); drop partisi > 7 tahun (retensi). Partisi tanpa lifecycle = 36 partisi hari ini, 360 dalam 10 tahun — bom waktu metadata.",
        "💡 Intuisi kunci: strategi = cerminan pola akses. Pola waktu → range. Pola kategori → list. Tidak ada pola → hash (atau belum butuh partisi). Jangan memilih strategi dari 'yang keren' — dari query log.",
      ],
      tasks: [],
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 9 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Partisi MENGHILANGKAN kerja, bukan mempercepatnya. Index = cari lebih cepat di DALAM data; partisi = tidak baca data yang tidak perlu. Untuk jendela kecil dari tabel besar: partisi hampir selalu menang.",
        "💡 Pruning butuh filter pada partition key. Partisi tanggal + WHERE customer_id = ... = 36 partisi dibaca (dekorasi mahal). Desain partisi DARI query, bukan dari skema.",
        "💡 Tiap partisi 1–10 GB; ratusan–puluhan ribu partisi. Di luar itu = terlalu banyak (overhead) atau terlalu sedikit (pruning lemah).",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kemenangan terbesar partisi bukan SELECT — melainkan DROP",
        body: "Kemenangan terbesar partitioning bukan SELECT yang lebih cepat — melainkan DROP yang instan. Ya, partition pruning mempercepat query jendela kecil — tetapi kemenangan operasional yang mengubah hidup DBA adalah manajemen siklus hidup data: menghapus 500 juta baris lama dengan DELETE memakan waktu berjam-jam, meledakkan WAL 2× lipat, dan meninggalkan bloat; DROP PARTITION menyelesaikan hal yang sama dalam <1 detik dengan ruang langsung kembali. Heuristik praktisinya: desain partisi DARI kebijakan retensi, bukan dari query. \"Data disimpan 2 tahun\" + partisi bulanan = kedaluwarsa cukup DROP PARTITION bulanan via cron — O(1), terjadwal, tanpa begadang. Aturan keduanya: ukuran partisi 1–10 GB, jumlah ratusan hingga puluhan ribu — di luar itu pruning-nya lemah atau overhead-nya mahal. Jebakan yang sering terjadi: partisi demi \"performance\" untuk query yang sebenarnya butuh index — lalu kaget karena query tanpa filter partition key tetap membaca semua partisi (36 partisi dibaca untuk filter kolom lain). Partisi menghilangkan kerja, bukan mempercepatnya; index mempercepat pencarian di dalam data. Keduanya alat berbeda untuk masalah berbeda. Dan jebakan terakhir: partition key yang salah tidak bisa \"diperbaiki sedikit\" — mengganti key = menulis ulang seluruh tabel. Pilih key dari pola filter query tersering (biasanya tanggal), validasi dengan EXPLAIN (pastikan pruning terjadi), dan ingat: partisi adalah komitmen arsitektur, bukan tuning sesaat.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: partisi atau tidak?",
      prose: [
        "Skenario 1 — Tabel 500 juta baris, 90% query filter tanggal. → RANGE per bulan pada tanggal. Alasan: pruning 97% (lab 1) = 60x.",
        "Skenario 2 — Tabel 5 juta baris, query bervariasi. → TIDAK USAH partisi (index cukup). Alasan: overhead partisi > manfaat untuk tabel kecil.",
        "Skenario 3 — Query sering filter region + butuh drop data per region (regulasi). → LIST per region. Alasan: pruning + DROP PARTITION (instan) vs DELETE (lambat).",
        "Skenario 4 — Tulis sangat tinggi, tidak ada pola filter dominan. → HASH (N partisi). Alasan: sebar beban tulis + paralelisme; pruning bukan tujuan.",
        "Skenario 5 — Tabel 2 miliar baris, query filter tanggal + butuh paralelisme. → RANGE per bulan + SUBPARTITION hash. Alasan: pruning (range) + paralelisme (hash). Mulai sederhana — naik ke sini jika terbukti perlu.",
        "Aturan praktis 10 detik: > 10 juta baris (atau > 100 GB) + satu kolom yang difilter mayoritas query → partisi pada kolom itu. Tidak memenuhi → index dulu, ukur, baru putuskan.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: 4 menit menjadi 4 detik",
      prose: [
        "PT DagangKita, November 2026. Dashboard revenue 7 hari: 4 menit load. Tabel 500 juta baris / 3 tahun. Full scan tiap load — pengguna membuka 50x/hari = 200 menit scan/hari untuk 7 hari data.",
        "Langkah 1: index pada tanggal → 2 menit (2x). Langkah 2: partisi RANGE bulanan → 4 detik (60x dari index, 120x dari awal). Total compute dashboard: 200 menit/hari → 3,3 menit/hari. Tagihan warehouse turun 40% bulan itu.",
        "Angka konkretnya: 36 partisi, query baca 1 (rasio 0,028). 50 load/hari x (240-4) detik = 3,3 jam compute/hari dihemat. Dengan lifecycle otomatis (skrip DBA13): partisi baru tiap bulan, arsip > 1 tahun, drop > 7 tahun.",
        "Pembahasan: (a) ukur pola akses DULU (query log: 90% filter tanggal) — partisi mengikuti pola; (b) index dulu (murah, cepat), partisi kemudian (struktural); (c) lifecycle dari hari pertama — partisi tanpa lifecycle = bom metadata.",
        "💡 Intuisi kunci: optimasi terbaik = yang menghapus kerja. Partisi = satu-satunya yang menghapus 97% bacaan. Saat jendela kecil + tabel besar, jangan tuning — partisi.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "Partition pruning: lewati partisi yang tidak dibutuhkan — 1/36 dibaca = 97% kerja hilang.",
        "Partition key = kardinalitas sedang + paling sering difilter (biasanya tanggal).",
        "Range (waktu), list (kategori), hash (sebar beban) — pilih dari pola akses.",
        "Pruning butuh filter pada key; tanpa itu partisi = dekorasi mahal.",
        "Lifecycle dari hari pertama: buat otomatis, arsip, drop — atau bom metadata.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Query '7 hari terakhir' pada tabel 36 partisi bulanan. Berapa yang dibaca?",
          options: [
            { text: "7 partisi (satu per hari)", why: "Pruning tingkat PARTISI (bulanan), bukan baris. 7 hari dalam 1 bulan = 1 partisi." },
            { text: "1 partisi (rasio 1/36 ≈ 2,8%)", why: "Tepat (lab 1): hanya partisi 2026-10 yang dibaca; 35 dilewati. 97,2% data tidak dibaca = 4 detik vs 4 menit.", correct: true },
            { text: "36 partisi (tetap full scan)", why: "Itu tanpa partisi. Dengan partisi + filter pada key = pruning." },
            { text: "0 (dari cache)", why: "Cache tidak relevan — ini soal pruning fisik." },
          ],
        },
        {
          q: "Kandidat partition key terbaik untuk tabel transaksi?",
          options: [
            { text: "order_id (50 juta unik)", why: "50 juta partisi mungil = overhead metadata raksasa. Unik ≠ baik." },
            { text: "tanggal (1095 nilai, 85% query memfilter)", why: "Tepat (lab 2): kardinalitas SEDANG + paling sering difilter = skor 85. Partisi mengikuti pola akses.", correct: true },
            { text: "status (4 nilai)", why: "Hanya 4 partisi = pruning lemah (tetap baca 25%). Skor 10." },
            { text: "customer_id (2 juta unik)", why: "2 juta partisi = terlalu banyak. Skor -10." },
          ],
        },
        {
          q: "Partisi tanggal tetapi query memfilter customer_id. Apa yang terjadi?",
          options: [
            { text: "Pruning tetap bekerja", why: "Pruning butuh filter pada PARTITION KEY. Filter kolom lain = tidak ada pruning." },
            { text: "Tidak ada pruning: 36 partisi dibaca (dekorasi mahal)", why: "Tepat: partisi tanpa filter yang cocok = overhead tanpa manfaat. Desain partisi DARI query — jika pola berubah, pertimbangkan ulang key.", correct: true },
            { text: "Query error", why: "Tidak error — hanya lambat (full scan 36 partisi)." },
            { text: "Otomatis dibuat partisi customer", why: "Tidak ada yang otomatis. Partisi = desain sadar." },
          ],
        },
        {
          q: "Kapan memakai strategi HASH?",
          options: [
            { text: "Query selalu filter tanggal", why: "Itu RANGE. Hash tidak memberi pruning untuk filter tanggal." },
            { text: "Tulis sangat tinggi + tidak ada pola filter dominan (sebar beban)", why: "Tepat: hash = distribusi merata untuk paralelisme tulis/baca. Bukan untuk pruning — untuk beban.", correct: true },
            { text: "Selalu — paling modern", why: "'Modern' bukan argumen. Tanpa pola yang cocok = overhead." },
            { text: "Tabel kecil", why: "Tabel kecil tidak butuh partisi sama sekali." },
          ],
        },
        {
          q: "Kenapa lifecycle partisi wajib dari hari pertama?",
          options: [
            { text: "Agar terlihat rapi", why: "Bukan soal rapi — soal metadata." },
            { text: "Tanpa lifecycle: 36 partisi → 360 dalam 10 tahun = bom overhead metadata", why: "Tepat: buat otomatis (skrip DBA13) + arsip yang lama + drop yang kedaluwarsa. Partisi yang tidak dikelola = utang yang tumbuh tiap bulan.", correct: true },
            { text: "Regulasi mengharuskan", why: "Regulasi soal retensi data, bukan lifecycle partisi." },
            { text: "Tidak wajib — nanti saja", why: "'Nanti saja' = Budi jilid 2 (DBA13). 360 partisi tidak bisa dirapikan 'nanti'." },
          ],
        },
      ],
    },
  ],
};
