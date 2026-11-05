import type { V2Lesson } from "../lib/types";

// Perbandingan biaya: seq scan 5000 ms vs index scan 300 ms (16,7x).
const PLAN_SVG = `<svg viewBox="0 0 480 170" role="img" aria-label="Batang biaya query: full table scan 5000 ms, index scan 300 ms.">
<g font-family="var(--font-ui)">
<text x="240" y="18" text-anchor="middle" font-size="12" fill="var(--text-muted)">Biaya eksekusi: 10 jt baris, filter 0,1%</text>
<rect x="60" y="40" width="360" height="30" fill="var(--c4)" opacity="0.85"/>
<text x="70" y="60" font-size="12" fill="var(--text)" font-weight="600">Seq Scan: 5.000 ms</text>
<rect x="60" y="92" width="22" height="30" fill="var(--c2)" opacity="0.9"/>
<text x="92" y="112" font-size="12" fill="var(--text)" font-weight="600">Index Scan: 300 ms (16,7x lebih cepat)</text>
<text x="60" y="142" font-size="11" fill="var(--text-muted)">Seq scan membaca 100.000 halaman · index scan hanya menyentuh 10.000 baris yang cocok</text>
</g></svg>`;

export const dba6: V2Lesson = {
  slug: "dba6-performa",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA6 — Performance Tuning",
  estMinutes: 70,
  steps: [
    {
      id: "cerita-report",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan 3 detik yang menjadi 40 menit",
      prose: [
        "Setiap pagi, direksi FinArta membuka laporan eksposur kredit — 3 detik, sudah 2 tahun begitu. Senin pagi ini: 40 menit, lalu timeout. Tim data menuduh \u201Cdata makin banyak\u201D. Faktanya data hanya tumbuh 2% seminggu terakhir.",
        "DBA menjalankan EXPLAIN dan menemukan: query memakai Seq Scan di tabel 10 juta baris. Jumat malam ada migrasi skema; indeks di kolom tanggal — yang dipakai filter laporan — tidak ikut terbawa (script migrasi lupa). Planner, tanpa indeks itu, tidak punya pilihan selain memindai semuanya. Indeks dibuat ulang dalam 4 menit (CONCURRENTLY, tanpa lock); laporan kembali 3 detik.",
        "Twist-nya: tidak ada yang berubah pada data, query, atau server. Satu-satunya yang hilang adalah struktur pembantu tak terlihat bernama indeks. Performance tuning sering kali bukan soal menulis query lebih pintar — melainkan memastikan database punya \u201Cjalan pintas\u201D yang tepat untuk query yang ada.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CQuery lambat = query-nya jelek, tulis ulang\u201D",
        body: "Langkah pertama DBA bukan me-rewrite query, melainkan membaca query plan (EXPLAIN). 80% kasus lambat diselesaikan dengan indeks/statistik yang tepat tanpa menyentuh satu baris SQL aplikasi. Rewrite tanpa plan = menebak dalam gelap.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa melakukan performance tuning yang dimulai dari pengukuran — bukan dari firasat.",
        "(1) Membaca rencana eksekusi (EXPLAIN) dan membedakan seq scan vs index scan dari cost-nya;",
        "(2) Memberi skor kandidat index = frekuensi query × selektivitas, dan mengurutkan prioritasnya;",
        "(3) Menghitung speedup index scan vs full scan dari angka cost;",
        "(4) Menjelaskan kenapa index di kolom ber-selektivitas rendah mahal dan minim manfaat.",
      ],
      tasks: [],
    },

    {
      id: "indexing",
      eyebrow: "Langkah 3 · Indexing",
      title: "Indeks: Si Jalan Pintas yang punya harga",
      prose: [
        "Indeks B-tree adalah struktur terurut terpisah yang memetakan nilai kolom → lokasi baris. Tanpa indeks, mencari 10 ribu baris dari 10 juta = memindai 10 juta (Seq Scan). Dengan indeks, database melompat langsung ke yang cocok (Index Scan) — seperti mencari kata di kamus lewat indeks kata, bukan membaca seluruh kamus.",
        "Kepribadiannya: pelayan yang luar biasa untuk baca, tetapi menagih upah di setiap tulis. Tiap INSERT/UPDATE/DELETE harus meng-update SEMUA indeks tabel itu. Tabel dengan 12 indeks = tiap tulis membayar 12x pemeliharaan indeks. Inilah kenapa \u201Ctambah indeks untuk semua kolom\u201D adalah anti-pattern.",
        "Tiga aturan praktis: (1) indeks untuk kolom yang sering di-filter/di-join/di-sort (WHERE, JOIN, ORDER BY); (2) perhatikan selectivity — indeks paling ampuh untuk filter selektif (0,1% baris), kurang berguna untuk filter 50% baris (planner tetap pilih full scan — dan ia benar); (3) composite index untuk kombinasi kolom yang selalu muncul bersama, dengan kolom paling selektif di depan.",
        "💡 Intuisi: indeks bukan \u201Cvitamin\u201D yang makin banyak makin baik — ia seperti jalan tol: mempercepat yang lewat, tetapi mahal dibangun dan butuh perawatan (bloat, VACUUM). Bangun hanya di rute yang ramai.",
      ],
      tasks: [],
    },
    {
      id: "query-plan",
      eyebrow: "Langkah 4 · Query plan",
      title: "Membaca EXPLAIN: peta pikiran planner",
      prose: [
        "EXPLAIN menunjukkan rencana eksekusi SEBELUM query dijalankan: node apa dipakai (Seq Scan, Index Scan, Nested Loop, Hash Join), estimasi baris, dan cost. EXPLAIN ANALYZE menjalankannya sungguhan dan menunjukkan waktu aktual — bedakan keduanya: yang pertama tebakan, yang kedua fakta.",
        "Cara membaca: cari node dengan cost/time terbesar — itulah tersangka utama. Perhatikan \u201Crows=\u201D estimasi vs aktual: jika planner menebak 100 baris tetapi aktual 10 juta, statistiknya basi (ANALYZE!) atau query-nya menipu planner (fungsi di WHERE). Perhatikan juga \u201CBuffers: shared hit vs read\u201D — read tinggi = dari disk (DBA2).",
        "Cara membaca grafik di bawah: dua batang = dua rencana untuk query sama (filter 0,1% dari 10 juta baris). Batang merah (Seq Scan) membaca 100.000 halaman = 5.000 ms; batang hijau (Index Scan) hanya menyentuh 10.000 baris cocok = 300 ms. Interpretasi: untuk filter selektif, indeks memberi speedup 16,7x — bukan 16,7% melainkan 16,7 KALI. Inilah kenapa satu indeks yang tepat bisa \u201Cmenyelesaikan\u201D insiden performa.",
      ],
      figure: {
        svg: PLAN_SVG,
        alt: "Seq scan 5000 ms vs index scan 300 ms untuk filter 0,1 persen dari 10 juta baris.",
        caption: "Dua rencana, satu query. Filter selektif + indeks = 16,7x lebih cepat.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CIndex Scan selalu lebih cepat dari Seq Scan\u201D",
        body: "Untuk filter tidak selektif (mis. WHERE status yang 60% barisnya 'aktif'), planner BENAR memilih Seq Scan: melompat-lompat via indeks (random I/O) lebih mahal daripada membaca berurutan. Jangan \u201Cmemaksa\u201D indeks dengan hint; perbaiki selectivity atau terima keputusan planner.",
        type: "pitfall",
      },
    },
    {
      id: "lab-plan",
      eyebrow: "Langkah 5 · Lab simulasi",
      title: "Lab: bandingkan dua rencana eksekusi",
      prose: [
        "Model biaya sederhana: tabel 10 juta baris, 100 baris per halaman (8 KB) → 100.000 halaman. Query memfilter 0,1% baris (10.000 baris). Seq Scan: baca semua halaman berurutan @ 0,05 ms/halaman. Index Scan: baca indeks (0,001 ms/halaman × total halaman sebagai aproksimasi) + ambil 10.000 baris acak @ 0,02 ms/baris.",
        "Tugasmu: hitung cost kedua rencana (ms), lalu speedup = seq / index. Interpretasi: 16,7x berarti query 5 detik menjadi 0,3 detik — perbedaan antara \u201Ctimeout\u201D dan \u201Ctidak terasa\u201D.",
        "Coba eksplorasi: ubah selectivity menjadi 0,5 (50% baris cocok — match = 5.000.000). Berapa cost index scan sekarang? Apakah masih menang? Inilah alasan planner kadang \u201Cmenolak\u201D indeksmu — dan ia benar.",
      ],
      formula: String.raw`\text{cost}_{seq} = \text{halaman} \times 0{,}05 \qquad \text{cost}_{idx} = (\text{cocok} \times 0{,}02) + (\text{halaman} \times 0{,}001)`,
      formulaNote: "Satuan ms. Seq scan: halaman × baca berurutan. Index scan: baris cocok × ambil acak + overhead baca struktur indeks. Model disederhanakan, tetapi menangkap trade-off-nya.",
      tasks: [
        { id: "t1", text: "Hitung `seq_ms` (cost full scan)" },
        { id: "t2", text: "Hitung `idx_ms` (cost index scan, 1 desimal)" },
        { id: "t3", text: "Hitung `speedup` = seq_ms / idx_ms (1 desimal)" },
      ],
      expected: "seq_ms=5000  idx_ms=300.0  speedup=16.7",
      note: {
        title: "💡 Intuisi: cost model adalah alasan, bukan ramalan cuaca",
        body: "Planner memilih plan dengan cost terendah MENURUT MODELNYA. Kalau modelnya salah (statistik basi), keputusannya salah — tetapi konsisten. Maka debugging performa = memeriksa asumsi model (rows estimate), bukan menyalahkan \u201Ckeputusan bodoh\u201D planner.",
      },
      hints: [
        "halaman = rows // rows_per_page = 100000.",
        "cocok = rows * selectivity = 10000.",
        "speedup = round(seq_ms / idx_ms, 1)",
      ],
      code: {
        starter: `# Pembanding rencana eksekusi\n# Baris ini disiapkan (jangan diubah)\nrows, selectivity, rows_per_page = 10_000_000, 0.001, 100\nhalaman = rows // rows_per_page\ncocok = int(rows * selectivity)\n\n# TULIS KODEMU: cost kedua plan (ms) + speedup\nseq_ms = \nidx_ms = \nspeedup = \n\nprint(f"seq_ms={seq_ms:.0f}  idx_ms={idx_ms}  speedup={speedup}")`,
        lockLines: 5,
        solution: `# Pembanding rencana eksekusi\n# Baris ini disiapkan (jangan diubah)\nrows, selectivity, rows_per_page = 10_000_000, 0.001, 100\nhalaman = rows // rows_per_page\ncocok = int(rows * selectivity)\n\n# TULIS KODEMU: cost kedua plan (ms) + speedup\nseq_ms = halaman * 0.05\nidx_ms = round(cocok * 0.02 + halaman * 0.001, 1)\nspeedup = round(seq_ms / idx_ms, 1)\n\nprint(f"seq_ms={seq_ms:.0f}  idx_ms={idx_ms}  speedup={speedup}")`,
        checks: [
          { kind: "equal", task: "t1", name: "seq_ms", value: 5000, tol: 1, label: "`seq_ms` = 5000", msg: "100000 halaman × 0,05 ms." },
          { kind: "equal", task: "t2", name: "idx_ms", value: 300.0, tol: 0.5, label: "`idx_ms` = 300,0", msg: "10000×0,02 + 100000×0,001 = 300." },
          { kind: "equal", task: "t3", name: "speedup", value: 16.7, tol: 0.1, label: "`speedup` = 16,7", msg: "5000/300 = 16,7." },
          { kind: "stdout_matches", task: "t3", pattern: "seq_ms=5000(\\.0)?\\s+idx_ms=300\\.0\\s+speedup=16\\.7", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "halaman=rows//100. cocok=int(rows*sel).",
    },    {
      id: "lab2-index-advisor",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: index advisor mainan",
      prose: [
        "Empat kolom dikandidatkan untuk index, tapi maintenance index tidak gratis (write amplification). Tugasmu: skor tiap kandidat = jumlah_query × (1 − selektivitas) — frekuensi dikali daya pilah — lalu urutkan prioritasnya.",
        "customer_id menang telak: 3000 query × selektivitas 0,001. status paling sering dipakai (5000) tetapi selektivitas 0,5 = nyaris tidak memilah — index di sana mahal dan minim manfaat.",
        "Coba juga: bagaimana jika query status selalu dikombinasi dengan created_at? Itu argumen untuk COMPOSITE index — advisor mainan ini belum menanganinya, dan advisor beneran pun butuh DBA memverifikasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor`: dict kolom → n × (1 − selektivitas), 1 desimal" },
        { id: "t2", text: "Tentukan `prioritas`: kolom terurut skor menurun" },
      ],
      expected: "skor={'status': 2500.0, 'customer_id': 2997.0, 'created_at': 1900.0, 'region': 600.0}",
      note: {
        title: "Sering salah",
        body: "Memilih kolom dengan query TERBANYAK (status). Frekuensi tanpa selektivitas = index yang besar, lambat di-write, dan jarang dipakai planner.",
      },
      hints: [
        "skor[kol] = n * (1 - sel).",
        "sorted(skor, key=skor.get, reverse=True).",
      ],
      code: {
        starter: `# Pola query seminggu: (kolom_filter, jumlah_query, selektivitas)\n# selektivitas = fraksi baris yang cocok (makin kecil = makin selektif)\nPOLA = [\n    ("status", 5000, 0.50),\n    ("customer_id", 3000, 0.001),\n    ("created_at", 2000, 0.05),\n    ("region", 800, 0.25),\n]\n# TULIS KODEMU: skor, prioritas\nskor = {}\nprioritas = []\n`,
        lockLines: 8,
        solution: `# Pola query seminggu: (kolom_filter, jumlah_query, selektivitas)\n# selektivitas = fraksi baris yang cocok (makin kecil = makin selektif)\nPOLA = [\n    ("status", 5000, 0.50),\n    ("customer_id", 3000, 0.001),\n    ("created_at", 2000, 0.05),\n    ("region", 800, 0.25),\n]\n\n# TULIS KODEMU: skor, prioritas\nskor = {kol: round(n * (1 - sel), 1) for kol, n, sel in POLA}\nprioritas = sorted(skor, key=skor.get, reverse=True)\n\nprint(f"skor={skor}")\nprint(f"prioritas={prioritas}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "'customer_id': 2997\\.0", label: "skor customer_id = 2997", msg: "3000×(1−0,001)." },
          { kind: "equal", task: "t2", name: "prioritas", value: ["customer_id", "status", "created_at", "region"], label: "`prioritas` benar", msg: "Urut skor menurun." },
        ],
      },
      reference: "Index benefit ≈ frekuensi × selektivitas; biaya = write amplification.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Tuning tanpa baseline = dukun. Selalu ukur SEBELUM mengubah: EXPLAIN ANALYZE hari ini adalah pembanding satu-satunya yang sah untuk klaim 'lebih cepat' minggu depan.",
        "💡 80% masalah performa diselesaikan 20% usaha: index yang tepat + statistik up-to-date. Jangan menyentuh parameter eksotis sebelum dua yang membosankan ini beres.",
      ],
      tasks: [],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: diagnosa performa dalam 15 menit",
      prose: [
        "Skenario 1 — Satu query spesifik lambat, lainnya normal. → EXPLAIN (ANALYZE) query itu; cek node termahal + estimasi vs aktual. Alasan: masalah lokal = plan lokal; jangan tuning server untuk satu query.",
        "Skenario 2 — Banyak query lambat bersamaan, I/O tinggi. → Cek bloat + kapan terakhir VACUUM/ANALYZE; cek hit ratio. Alasan: masalah sistemik biasanya statistik basi atau tabel menggembung — bukan 50 query yang tiba-tiba bodoh bersamaan.",
        "Skenario 3 — Tulis melambat setelah tambah indeks. → Audit indeks: hapus yang tidak dipakai (pg_stat_user_indexes: idx_scan = 0). Alasan: tiap indeks = pajak tulis; indeks tak terpakai = pajak tanpa manfaat.",
        "Skenario 4 — Query analitik berat mengganggu transaksi. → Pisahkan: read replica untuk analitik, atau materialized view yang di-refresh berkala. Alasan: pola akses OLTP vs OLAP bertabrakan di buffer pool (DBA2) — isolasi lebih murah daripada perang.",
        "Aturan praktis 10 detik: EXPLAIN dulu, hipotesis kedua; satu perubahan dalam satu waktu; buat indeks dengan CONCURRENTLY di produksi (tanpa lock tulis).",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: dashboard yang membunuh dirinya sendiri",
      prose: [
        "MarketAnalytix: dashboard \u201Ctop produk hari ini\u201D di-refresh 500x/hari oleh tim, tiap refresh menjalankan agregasi ke tabel 80 juta baris (12 detik). Total: 500 × 12 dtk = 100 menit komputasi/hari untuk angka yang berubah tiap 15 menit. Lebih parah: full scan berulang mengusir halaman panas dari buffer pool → query transaksi ikut melambat. Dashboard-nya mendegradasi sistem yang ia laporkan.",
        "Tiga opsi: (A) indeks composite (tanggal, produk) → 12 dtk menjadi 0,4 dtk (30x), biaya: indeks 9 GB + pajak tulis; (B) materialized view refresh tiap 15 menit → query dashboard 0,05 dtk, data basi maksimal 15 menit; (C) pindah ke read replica → transaksi aman, tetapi tetap 12 dtk × 500.",
        "Pembahasan: tim memilih B + A parsial. Materialized view memutus lingkaran (dashboard tidak lagi memindai tabel produksi), indeks composite menjaga query ad-hoc analis tetap cepat. Biaya: refresh 15-menitan ~20 dtk di replica. Pelajaran: tuning bukan selalu \u201Cbuat lebih cepat\u201D — kadang jawabannya \u201Cjangan hitung ulang hal yang sama 500 kali\u201D. Kenali pola akses sebelum memilih senjata.",
      ],
      tasks: [],
    },
    {
      id: "indeks-khusus-pg",
      eyebrow: "Langkah 10 · Indeks khusus",
      title: "Indeks khusus PostgreSQL: GIN, GiST, BRIN & teman-temannya",
      prose: [
        "B-tree adalah pisau dapur para indeks: luar biasa untuk kesetaraan dan rentang pada kolom skalar (WHERE pelanggan_id = 42, WHERE created_at BETWEEN ...). Tetapi query dunia nyata punya pola lain yang tidak dijawab B-tree: mencari kata di dalam kolom teks, kunci di dalam kolom JSONB, elemen di dalam array, titik yang berdekatan di peta, atau memindai tabel 5 miliar baris yang terurut alami oleh waktu.",
        "GIN (Generalized Inverted Index) adalah indeks TERBALIK: dari \u201Cnilai → baris\u201D dibalik menjadi \u201Ckomponen → baris\u201D. Cocok untuk tiga pola: full-text search (dokumen mana mengandung kata X), JSONB (dokumen mana punya kunci/nilai ini), dan array (array mana mengandung elemen @> ini). Harganya: ukuran indeks besar dan write lebih lambat daripada B-tree — karena satu baris bisa menghasilkan puluhan entri indeks.",
        "GiST (Generalized Search Tree) menjawab relasi \u201Cbersinggungan / berdekatan / mengandung\u201D pada tipe data non-skalar: geometri (titik mana dalam radius 5 km — butuh PostGIS), dan rentang waktu (reservasi mana yang TUMPANG TINDIH dengan rentang X — operator && pada tstzrange). Tanpa GiST, query semacam ini = full scan dengan perhitungan geometri per baris.",
        "BRIN (Block Range INdex) adalah si mungil untuk tabel raksasa yang terurut alami — time-series di mana created_at selalu naik. BRIN tidak mencatat tiap baris: ia hanya menyimpan min/max per rentang blok halaman (default 128 halaman). Untuk 5 miliar baris, B-tree bisa 100 GB sementara BRIN hanya beberapa MB. Syaratnya keras: data HARUS terurut menurut kolom itu. Tabel yang di-update acak = BRIN tidak berguna.",
        "Cara memilih: baca pola query tersering (WHERE, JOIN, ORDER BY), lalu petakan pola → jenis indeks. Jangan memilih dari kebiasaan (\u201Cselalu B-tree\u201D). Dan ingat pelajaran Langkah 3: setiap indeks = pajak tulis. Indeks khusus yang tidak pernah dipakai planner (cek pg_stat_user_indexes: idx_scan = 0) adalah pajak tanpa manfaat — pantau, lalu pensiunkan dengan DROP INDEX.",
        "💡 Intuisi: memilih indeks seperti memilih alat. B-tree = pisau dapur (serbaguna, selalu di tangan). GIN = indeks di belakang buku (cari kata/frasa di dalam teks). GiST = peta (cari yang berdekatan/bertumpuk). BRIN = daftar isi per bab (tahu bab mana berisi apa, tanpa membaca tiap halaman).",
      ],
      formula: String.raw`\text{halaman} = \frac{\text{baris}}{\text{baris per halaman}} \qquad n_{\text{range}} = \left\lceil \frac{\text{halaman}}{128} \right\rceil`,
      formulaNote: "Perkiraan jumlah rentang BRIN. halaman = total halaman tabel; 128 = halaman per rentang (default). BRIN hanya menyimpan satu entri min/max per rentang — itulah kenapa ia mungil. Contoh: 1 juta halaman / 128 ≈ 7.813 entri, bukan 5 miliar.",
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CGIN/GiST/BRIN adalah versi 'lebih canggih' dari B-tree\u201D",
        body: "Bukan hierarki kecanggihan — ini pembagian kerja. B-tree tetap raja untuk kesetaraan dan rentang pada kolom skalar (dan ia yang paling murah di-write). GIN untuk \u201Cdi dalam\u201D (teks/JSONB/array), GiST untuk \u201Cberdekatan/bertumpuk\u201D (spasial/rentang), BRIN untuk \u201Cterurut alami dan raksasa\u201D. Memakai GIN untuk WHERE id = 5 adalah overkill yang mahal.",
        type: "pitfall",
      },
      reference: "Pola query → jenis indeks. GIN: di-dalam. GiST: berdekatan. BRIN: terurut & raksasa.",
    },
    {
      id: "indeks-sebagian-vacuum",
      eyebrow: "Langkah 11 · Indeks & kebersihan",
      title: "Partial index, covering index, dan vacuum",
      prose: [
        "Partial index: indeks yang hanya mencakup baris memenuhi syarat — CREATE INDEX ... WHERE status = 'aktif'. Tabel 50 juta baris, yang 'aktif' hanya 200 ribu, dan SEMUA query penting menyaring status='aktif': indeks parsialnya kecil, tajam, dan murah di-write (baris non-aktif tidak masuk indeks sama sekali). Syarat: query harus memuat predicate yang SAMA agar planner mau memakainya — predicate beda sedikit saja = indeks tak terlihat planner.",
        "Covering index: tambahkan kolom lewat INCLUDE — CREATE INDEX ... ON t(pelanggan_id) INCLUDE (nama, total). Query SELECT nama, total WHERE pelanggan_id = ... dijawab SELURUHNYA dari indeks, tanpa menyentuh tabel (heap). Ini namanya index-only scan — menghemat heap fetch acak yang mahal, terutama untuk query yang sering dan sempit.",
        "Tetapi index-only scan punya syarat: PostgreSQL harus YAKIN halaman itu tidak berubah sejak transaksi lama — informasi ini ada di visibility map, dan yang merawat visibility map adalah VACUUM. Tanpa vacuum rutin, \u201Cindex-only\u201D diam-diam menjadi \u201Cindex scan + heap fetch\u201D — keuntungannya lenyap.",
        "Kenapa vacuum penting: PostgreSQL memakai MVCC — setiap UPDATE/DELETE meninggalkan baris MATI (dead tuple). VACUUM membersihkan baris mati dan memperbarui visibility map; autovacuum melakukannya otomatis. Jika autovacuum tertinggal (tabel tulis-berat, maintenance_work_mem kecil), tabel MENGGEMBUNG: 30 GB data menempati 100 GB disk, planner membaca halaman sampah, dan index-only scan gagal. Gejala klasik: tabel tumbuh tanpa data bertambah.",
        "Rutinitas DBA yang sehat: (1) cek bloat berkala; (2) pastikan autovacuum tidak pernah tertinggal berhari-hari; (3) audit indeks tak terpakai; (4) ANALYZE setelah bulk load. Performance tuning jangka panjang adalah KEBERSIHAN, bukan sihir — sama seperti Langkah 4 mengajarkan: ukur dulu, tebak kemudian.",
        "💡 Intuisi: vacuum adalah petugas kebersihan mal yang mengosongkan tempat sampah tiap malam. Kalau ia mogok seminggu, mal tetap \u201Cbuka\u201D — tetapi lorong penuh sampah, pengunjung (query) melambat, dan bau (bloat) tercium sampai ke laporan direksi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `strategi(q)` yang mengembalikan strategi indeks per query sesuai aturan" },
        { id: "t2", text: "Tulis fungsi `perkiraan_baris(q, s)` untuk estimasi baris yang diperiksa tiap strategi" },
        { id: "t3", text: "Bangun `strategi_hasil` dan `baris_hasil`, lalu cetak tiap query" },
      ],
      expected: "Q1: partial index (~200000 baris) · Q2: BRIN (~7500000 baris) · Q3: B-tree (~10000 baris) · Q4: full scan (~50000000 baris) · Q5: index-only (covering) (~10000 baris)",
      note: {
        title: "🚨 Mitos: \u201CVacuum bisa ditunda 'nanti saja', toh autovacuum jalan sendiri\u201D",
        body: "Autovacuum yang tertinggal berhari-hari = bloat yang tidak bisa di-reclaim tanpa VACUUM FULL (mengunci tabel!). Di tabel tulis-berat, \u201Cnanti saja\u201D berubah menjadi downtime terencana. Monitor pg_stat_user_tables (n_dead_tup, last_autovacuum) seperti memonitor detak jantung pasien.",
        type: "pitfall",
      },
      hints: [
        "Urutkan kondisi dari yang paling spesifik: selektivitas >= 0.2 dulu, lalu pola status_aktif, rentang_waktu, covering, terakhir B-tree.",
        "perkiraan: full scan → TABEL['total']; partial → TABEL['aktif']; BRIN → int(total × selektivitas × 3); sisanya → int(total × selektivitas).",
        "Cetak dengan f-string: f\"{q['nama']}: {s} (~{b} baris)\".",
      ],
      code: {
        starter: `# Statistik tabel "transaksi" (kolom: status, pelanggan_id, created_at, nama, total)
TABEL = {"total": 50_000_000, "aktif": 200_000, "mati": 8_000_000}

# Daftar query: pola, selektivitas (fraksi baris yang cocok), kolom yang dipakai
QUERY = [
    {"nama": "Q1", "pola": "status_aktif", "selektivitas": 0.004, "kolom": ["pelanggan_id"]},
    {"nama": "Q2", "pola": "rentang_waktu", "selektivitas": 0.05, "kolom": ["created_at"]},
    {"nama": "Q3", "pola": "kesetaraan", "selektivitas": 0.0002, "kolom": ["pelanggan_id"]},
    {"nama": "Q4", "pola": "kesetaraan", "selektivitas": 0.45, "kolom": ["status"]},
    {"nama": "Q5", "pola": "covering", "selektivitas": 0.0002, "kolom": ["pelanggan_id", "nama", "total"]},
]

# ATURAN strategi (implementasikan sebagai fungsi strategi(q)):
# - selektivitas >= 0.2   -> "full scan"            (planner benar, indeks tak berguna)
# - pola "status_aktif"   -> "partial index"        (WHERE status='aktif' selalu ada)
# - pola "rentang_waktu"  -> "BRIN"                 (kolom waktu terurut alami)
# - pola "covering"       -> "index-only (covering)" (kolom sedikit, INCLUDE)
# - selain itu            -> "B-tree"
# Perkiraan baris terperiksa: full scan -> total; partial -> aktif;
# BRIN -> int(total*selektivitas*3); sisanya -> int(total*selektivitas)

# TULIS KODEMU: fungsi strategi(q), fungsi perkiraan_baris(q, s),
# dict strategi_hasil {nama: strategi}, dict baris_hasil {nama: baris},
# lalu cetak tiap baris: "NAMA: strategi (~BARIS baris)"`,
        lockLines: 21,
        solution: `# Statistik tabel "transaksi" (kolom: status, pelanggan_id, created_at, nama, total)
TABEL = {"total": 50_000_000, "aktif": 200_000, "mati": 8_000_000}

# Daftar query: pola, selektivitas (fraksi baris yang cocok), kolom yang dipakai
QUERY = [
    {"nama": "Q1", "pola": "status_aktif", "selektivitas": 0.004, "kolom": ["pelanggan_id"]},
    {"nama": "Q2", "pola": "rentang_waktu", "selektivitas": 0.05, "kolom": ["created_at"]},
    {"nama": "Q3", "pola": "kesetaraan", "selektivitas": 0.0002, "kolom": ["pelanggan_id"]},
    {"nama": "Q4", "pola": "kesetaraan", "selektivitas": 0.45, "kolom": ["status"]},
    {"nama": "Q5", "pola": "covering", "selektivitas": 0.0002, "kolom": ["pelanggan_id", "nama", "total"]},
]

# ATURAN strategi (implementasikan sebagai fungsi strategi(q)):
# - selektivitas >= 0.2   -> "full scan"            (planner benar, indeks tak berguna)
# - pola "status_aktif"   -> "partial index"        (WHERE status='aktif' selalu ada)
# - pola "rentang_waktu"  -> "BRIN"                 (kolom waktu terurut alami)
# - pola "covering"       -> "index-only (covering)" (kolom sedikit, INCLUDE)
# - selain itu            -> "B-tree"
# Perkiraan baris terperiksa: full scan -> total; partial -> aktif;
# BRIN -> int(total*selektivitas*3); sisanya -> int(total*selektivitas)

# TULIS KODEMU: fungsi strategi(q), fungsi perkiraan_baris(q, s),
# dict strategi_hasil {nama: strategi}, dict baris_hasil {nama: baris},
# lalu cetak tiap baris: "NAMA: strategi (~BARIS baris)"
def strategi(q):
    if q["selektivitas"] >= 0.2:
        return "full scan"
    if q["pola"] == "status_aktif":
        return "partial index"
    if q["pola"] == "rentang_waktu":
        return "BRIN"
    if q["pola"] == "covering":
        return "index-only (covering)"
    return "B-tree"

def perkiraan_baris(q, s):
    if s == "full scan":
        return TABEL["total"]
    if s == "partial index":
        return TABEL["aktif"]
    if s == "BRIN":
        return int(TABEL["total"] * q["selektivitas"] * 3)
    return int(TABEL["total"] * q["selektivitas"])

strategi_hasil = {}
baris_hasil = {}
for q in QUERY:
    s = strategi(q)
    b = perkiraan_baris(q, s)
    strategi_hasil[q["nama"]] = s
    baris_hasil[q["nama"]] = b
    print(f"{q['nama']}: {s} (~{b} baris)")`,
        checks: [
          { kind: "equal", task: "t1", name: "strategi_hasil", value: {"Q1": "partial index", "Q2": "BRIN", "Q3": "B-tree", "Q4": "full scan", "Q5": "index-only (covering)"}, label: "`strategi_hasil` benar untuk 5 query", msg: "Q4 selektivitas 0,45 ≥ 0,2 → full scan; Q5 covering → index-only." },
          { kind: "equal", task: "t2", name: "baris_hasil", value: {"Q1": 200000, "Q2": 7500000, "Q3": 10000, "Q4": 50000000, "Q5": 10000}, label: "`baris_hasil` benar", msg: "BRIN = int(50jt×0,05×3) = 7.500.000; B-tree/covering = int(total×selektivitas)." },
          { kind: "stdout_matches", task: "t3", pattern: "Q1: partial index \\(~200000 baris\\)", label: "Output Q1 tercetak", msg: "Format: \"NAMA: strategi (~BARIS baris)\"." },
          { kind: "stdout_matches", task: "t3", pattern: "Q5: index-only \\(covering\\) \\(~10000 baris\\)", label: "Output Q5 tercetak", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Partial: WHERE ... = 'aktif'. Covering: INCLUDE. Index-only butuh vacuum rutin.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang indexing dan query plan.",
      ],
      tasks: [],
      summary: [
        "Baca EXPLAIN dulu sebelum mengubah apa pun; bedakan estimasi vs aktual (ANALYZE).",
        "Indeks B-tree: jalan pintas baca yang memungut pajak di setiap tulis.",
        "Indeks ampuh untuk filter selektif; untuk 50% baris, Seq Scan benar.",
        "Statistik basi = plan salah; ANALYZE setelah bulk load/migrasi.",
        "CREATE INDEX CONCURRENTLY di produksi; audit & hapus indeks tak terpakai.",
      ],
      next: { label: "DBA7 — Keamanan Database", href: "/v2/learn/dba7-keamanan" },
      quiz: [
        {
          q: "Laporan 3 dtk menjadi 40 dtk; data +2%; ternyata indeks hilang setelah migrasi. Pelajaran utama?",
          options: [
            { text: "Data bertambah", why: "+2% tidak menjelaskan 800x lipat." },
            { text: "Selalu verifikasi indeks & statistik setelah migrasi skema", why: "Satu indeks hilang mengubah Index Scan menjadi Seq Scan 10 juta baris. Checklist pasca-migrasi mencegahnya.", correct: true },
            { text: "Server kurang besar", why: "Server sama; yang hilang struktur pembantu." },
            { text: "Query harus ditulis ulang", why: "Query tidak berubah dan kemarin 3 detik — plan-nya yang berubah." },
          ],
        },
        {
          q: "Tabel dengan 12 indeks, tulis (INSERT) melambat drastis. Tindakan pertama?",
          options: [
            { text: "Tambah 3 indeks lagi", why: "Menambah pajak tulis — memperburuk." },
            { text: "Audit indeks tak terpakai (idx_scan=0) dan hapus", why: "Tiap indeks = pajak tulis; yang tak terpakai = pajak tanpa manfaat.", correct: true },
            { text: "Naikkan work_mem", why: "work_mem untuk sort/hash, bukan untuk pajak indeks." },
            { text: "Pindah ke SSD lebih cepat", why: "Membayar hardware untuk masalah yang diselesaikan satu DROP INDEX." },
          ],
        },
        {
          q: "EXPLAIN: estimasi rows=100, aktual 10 juta. Artinya?",
          options: [
            { text: "Planner rusak", why: "Planner konsisten memakai modelnya; yang rusak asumsinya." },
            { text: "Statistik basi — jalankan ANALYZE", why: "Selisih estimasi vs aktual sebesar ini = peta kedaluwarsa. Refresh statistik dulu.", correct: true },
            { text: "Butuh indeks baru", why: "Mungkin, tetapi tanpa statistik benar kamu tidak tahu plan mana yang tepat." },
            { text: "Query salah tulis", why: "Query menghasilkan data benar; yang salah tebakannya." },
          ],
        },
        {
          q: "Filter WHERE status='aktif' cocok 60% baris; planner memilih Seq Scan. Sikap tepat?",
          options: [
            { text: "Paksa Index Scan dengan hint", why: "Random I/O 6 juta baris via indeks lebih mahal dari sequential — planner benar." },
            { text: "Terima: untuk filter tidak selektif, Seq Scan memang lebih murah", why: "Indeks ampuh untuk selektif (0,1%); untuk 60%, baca berurutan menang.", correct: true },
            { text: "Buat indeks baru di kolom status", why: "Indeks tidak mengubah fakta 60% baris harus dibaca." },
            { text: "Partisi tabel", why: "Partisi tidak relevan dengan masalah selectivity ini." },
          ],
        },
        {
          q: "Membuat indeks di tabel produksi 500 GB yang sibuk. Cara aman?",
          options: [
            { text: "CREATE INDEX biasa jam sibuk", why: "Mengunci tulis selama pembangunan — downtime de facto." },
            { text: "CREATE INDEX CONCURRENTLY di jam sepi, monitor progres", why: "Tanpa lock tulis; lebih lambat tetapi tidak memblokir. Standar operasi produksi.", correct: true },
            { text: "Matikan aplikasi dulu", why: "Itu downtime terencana — hindari jika ada cara tanpa downtime." },
            { text: "Buat di replica lalu promosikan", why: "Terlalu rumit dan berisiko untuk operasi rutin; CONCURRENTLY cukup." },
          ],
        },
        {
          q: "Query WHERE status='aktif' (50% baris) lambat. Seorang rekan mengusulkan index di kolom status. Penilaianmu?",
          options: [
            { text: "Setuju — index selalu mempercepat WHERE", why: "'Selalu' adalah mitos: index pada kolom selektivitas 0,5 nyaris tidak memilah — planner tetap memilih seq scan, tetapi kamu membayar maintenance index di setiap write. Skor = frekuensi × selektivitas." },
            { text: "Tolak — selektivitas 0,5 terlalu rendah, index tidak akan dipakai", why: "Tepat: index menguntungkan saat selektif (mis. customer_id 0,001). Pada 50%, planner benar memilih full scan; index hanya menjadi pajak write. Ukur dengan EXPLAIN, bukan dengan asumsi.", correct: true },
            { text: "Buat index di semua kolom WHERE", why: "Index di semua kolom = write amplification maksimal, manfaat minimal. Setiap index adalah utang yang dibayar tiap INSERT/UPDATE." },
            { text: "Tambah RAM saja", why: "RAM tidak mengubah fakta bahwa 50% tabel harus dibaca — masalahnya selektivitas, bukan cache." },
          ],
        },
      ],
    },
  ],
};
