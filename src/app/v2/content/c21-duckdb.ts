import type { V2Lesson } from "../lib/types";

// ── Figure: waktu query 1 GB Parquet — pandas vs DuckDB vs SQLite ────────
const WAKTU_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang waktu query agregasi 1 GB Parquet: pandas, SQLite, DuckDB">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">20</text><text x="54" y="139">40</text>
<text x="54" y="99">60</text><text x="54" y="59">80 dtk</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="110" y="76" width="64" height="140" fill="var(--chart-text)" opacity="0.55"/>
<text x="142" y="68" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">62</text>
<text x="142" y="232" text-anchor="middle" fill="var(--text)">pandas</text>
<text x="142" y="246" text-anchor="middle" font-size="10" fill="var(--text-muted)">load semua</text>
<rect x="238" y="136" width="64" height="80" fill="var(--c2)" opacity="0.85"/>
<text x="270" y="128" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">34</text>
<text x="270" y="232" text-anchor="middle" fill="var(--text)">SQLite</text>
<text x="270" y="246" text-anchor="middle" font-size="10" fill="var(--text-muted)">row-based</text>
<rect x="366" y="196" width="64" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="398" y="188" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">7</text>
<text x="398" y="232" text-anchor="middle" fill="var(--text)">DuckDB</text>
<text x="398" y="246" text-anchor="middle" font-size="10" fill="var(--text-muted)">kolomnar</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">query sama: GROUP BY kategori atas 1 GB Parquet/CSV (ilustrasi orde besaran)</text>
</g>
</svg>`;

const C21_SCHEMA = `CREATE TABLE penjualan (
  id INTEGER PRIMARY KEY,
  tanggal TEXT,
  kategori TEXT,
  produk TEXT,
  qty INTEGER,
  harga INTEGER
);`;

const C21_SEED = `INSERT INTO penjualan VALUES (1, '2026-01-05', 'Minuman', 'Kopi A', 120, 18000);
INSERT INTO penjualan VALUES (2, '2026-01-12', 'Minuman', 'Kopi B', 200, 15000);
INSERT INTO penjualan VALUES (3, '2026-01-20', 'Minuman', 'Teh C', 150, 12000);
INSERT INTO penjualan VALUES (4, '2026-01-08', 'Makanan', 'Roti D', 300, 10000);
INSERT INTO penjualan VALUES (5, '2026-01-15', 'Makanan', 'Roti E', 80, 22000);
INSERT INTO penjualan VALUES (6, '2026-02-03', 'Minuman', 'Kopi A', 100, 18000);
INSERT INTO penjualan VALUES (7, '2026-02-10', 'Minuman', 'Kopi B', 50, 15000);
INSERT INTO penjualan VALUES (8, '2026-02-14', 'Minuman', 'Teh C', 90, 12000);
INSERT INTO penjualan VALUES (9, '2026-02-06', 'Makanan', 'Roti D', 120, 10000);
INSERT INTO penjualan VALUES (10, '2026-02-12', 'Makanan', 'Roti E', 200, 22000);
INSERT INTO penjualan VALUES (11, '2026-02-18', 'Makanan', 'Snack F', 500, 5000);`;

export const c21: V2Lesson = {
  slug: "c21-duckdb",
  track: "SQL",
  module: "Lanjutan",
  title: "DuckDB: SQL Data Besar Tanpa Server — Query Parquet Langsung",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "CSV 2 GB yang membekukan laptop — dan bebek yang memakannya mentah-mentah",
      prose: [
        "Analis logistik mengunduh data pengiriman setahun: satu CSV 2 GB. Rencananya sederhana — hitung total biaya per rute. Ia buka Python, pd.read_csv(...), dan laptopnya mulai meraung: 2 GB CSV mengembang menjadi ~8 GB di memori, swap penuh, freeze 20 menit. Ia mengulang dengan chunk, dengan Dask, dengan menyewa VM — total 3 jam untuk satu angka agregasi.",
        "Rekannya yang lebih senior mengetik satu baris di terminal: duckdb -c \"SELECT rute, SUM(biaya) FROM read_csv_auto('pengiriman.csv') GROUP BY rute;\" — selesai 8 detik. Tanpa load ke memori, tanpa server, tanpa cluster, tanpa instalasi rumit. File CSV dibaca langsung dari disk seperti tabel, hanya kolom dan baris yang dibutuhkan yang disentuh.",
        "Twist-nya: bukan laptopnya yang kurang kuat — arsitekturnya yang salah. pandas memindahkan SELURUH data ke memori untuk menjawab pertanyaan agregasi; DuckDB memindahkan PERTANYAAN ke data — prinsip yang sama berlakunya untuk data JSON di database: komputasi terjadi di tempat data tinggal. Julukannya “SQLite untuk analitik” — database kolomnar in-process yang hidup di dalam proses Python/R/terminal-mu. Lesson ini tentang kapan bebek ini menyelamatkanmu, dan kapan ia bukan jawabannya. Bekal ringkas dari lesson SELECT dasar (diringkas agar mandiri): SELECT, WHERE, GROUP BY + SUM/COUNT/AVG, dan JOIN — DuckDB memakai SQL standar, jadi semua bekalmu langsung bisa dipakai.",
      ],
      tasks: [],
      note: {
        title: "Kenapa DuckDB ada di silabus 2026",
        type: "risk",
        body: "Silabus data science 2026 menempatkan DuckDB berdampingan dengan PySpark dan Polars — tiga jawaban modern untuk “data terlalu besar untuk laptop”. DuckDB adalah jawaban termurah: tanpa cluster, tanpa server, tanpa rewrite kode. Analis yang hanya bisa pandas akan selalu membayar pajak infrastruktur untuk pertanyaan yang sebenarnya ringan.",
      },
      reference: "DuckDB = SQLite untuk analitik: in-process, kolomnar, query file langsung. Prinsip: pindahkan pertanyaan ke data.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita CSV 2 GB. (2) Peta ini. (3) Konsep: DuckDB — Si Bebek Analitik (kolomnar in-process). (4) Konsep: query file langsung — read_parquet/read_csv_auto. (5) Konsep: kapan DuckDB vs SQLite vs Postgres vs Spark. (6) Lab 1: top-N per grup dengan window function. (7) Lab 2: agregasi selektif yang ramah kolomnar. (8) Chart: orde besaran waktu query. (9) Peta keputusan: lima skenario tool. (10) Mini-case: pipeline logistik harian. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan arsitektur DuckDB (in-process, kolomnar, vektorisasi) dan bedanya dengan SQLite; (2) menulis query langsung ke file Parquet/CSV tanpa ETL; (3) menulis pola query analitik yang memanfaatkan kekuatan kolomnar (proyeksi sempit, filter dini); (4) memilih antara DuckDB, SQLite, Postgres, dan Spark untuk skenario nyata.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: SELECT kolom, WHERE filter, GROUP BY + agregasi, window function ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) untuk peringkat per grup, dan CTE (WITH ...) untuk query bertahap. Semua ini SQL standar — DuckDB menerimanya apa adanya.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart → peta keputusan → mini-case → kuis. Estimasi 55 menit; tiap lab ±10 menit. Catatan kejujuran lab: lab berjalan di SQLite in-browser (sql.js) — sintaks yang dipakai (CTE, window function, GROUP BY) kompatibel penuh dengan DuckDB. Fungsi read_parquet dipelajari sebagai konsep karena butuh file nyata; instalasi DuckDB asli hanya satu perintah pip install duckdb.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: hafalkan posisi DuckDB dalam satu kalimat — “SQLite menyimpan baris untuk transaksi, DuckDB menyimpan kolom untuk analitik, keduanya tanpa server.” Semua perbedaan teknis turun dari kalimat ini.",
      ],
      reference: "Tujuan: arsitektur + query file langsung + pola ramah-kolomnar + pemilihan tool. Lab memakai sintaks kompatibel DuckDB.",
    },
    {
      id: "konsep-bebek",
      eyebrow: "Langkah 3 · Konsep",
      title: "DuckDB — Si Bebek Analitik (kolomnar, in-process, vektorisasi)",
      prose: [
        "Definisi: DuckDB adalah database OLAP (analitik) in-process — ia berjalan DI DALAM proses aplikasimu (Python, R, terminal), bukan sebagai server terpisah. Tiga pilar arsitekturnya: (1) penyimpanan KOLOMNAR — data disimpan per kolom, bukan per baris, sehingga query SUM(harga) hanya membaca kolom harga (bukan seluruh baris); (2) eksekusi VEKTORISASI — operasi diproses per batch ribuan nilai sekaligus memakai instruksi SIMD CPU; (3) tanpa server — tidak ada instalasi, tidak ada koneksi, file database tunggal seperti SQLite.",
        "Kepribadiannya: jika SQLite adalah brankas kecil yang rapi untuk menyimpan catatan harian (OLTP: banyak tulis/baca baris kecil), DuckDB adalah gudang dengan lorong per kolom — forklift analitik bisa mengambil satu lorong penuh (satu kolom 1 miliar nilai) tanpa menyentuh lorong lain. pandas adalah pekerja yang membawa SELURUH gudang ke meja kerjanya dulu (load ke RAM); DuckDB mengirim pertanyaan ke gudang dan hanya membawa pulang jawabannya.",
        "Kapan memakai: analisis interaktif atas file besar (CSV/Parquet GB-an) di laptop; ETL ringan-menengah; prototyping sebelum naik ke warehouse; pengganti pandas untuk agregasi besar. Tiga angka jangkar (orde besaran, bukan benchmark resmi): query agregasi 1 GB ~detik di DuckDB vs ~menit di pandas; tanpa server = nol DevOps; pip install duckdb selesai dalam 1 menit. Batasnya: satu mesin (tidak terdistribusi seperti Spark); bukan untuk transaksi konkurensi tinggi (itu ranah Postgres); dan ekosistemnya lebih muda (dokumentasi + tooling belum selengkap Postgres).",
      ],
      formula: String.raw`S = \frac{T_{\text{pandas}}}{T_{\text{duckdb}}} \approx \frac{t_{\text{load}} + t_{\text{hitung}}}{t_{\text{scan\_kolom}}}`,
      formulaNote: "Simbol: S = speedup (berapa kali lebih cepat); T_pandas = waktu total pandas; T_duckdb = waktu total DuckDB; t_load = waktu memuat seluruh data ke RAM; t_hitung = waktu komputasi; t_scan_kolom = waktu memindai hanya kolom yang dibutuhkan. Interpretasi: keunggulan DuckDB terutama dari MENGHILANGKAN t_load — ia tidak memindahkan data ke memori. Contoh angka ilustrasi: t_load 50 detik + t_hitung 12 detik = 62 detik (pandas) vs t_scan_kolom 7 detik (DuckDB) → S ≈ 9×. Makin besar data relatif terhadap RAM, makin besar S — karena t_load tumbuh sementara t_scan_kolom hanya menyentuh kolom yang dipakai.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “DuckDB = SQLite yang lebih cepat”",
        type: "pitfall",
        body: "Yang benar: keduanya in-process tanpa server — kemiripannya BERHENTI di situ. SQLite menyimpan per BARIS (optimal untuk transaksi: ambil 1 baris utuh dengan cepat); DuckDB menyimpan per KOLOM (optimal untuk analitik: agregasi 1 kolom atas miliaran baris). Memakai SQLite untuk agregasi 100 juta baris atau DuckDB untuk 10.000 transaksi/detik adalah salah alamat — arsitekturnya memang beda.",
      },
      hints: [
        "💡 Intuisi kolomnar: tanyakan “berapa kolom yang disentuh query ini dari total kolom tabel?” Query analitik tipikal menyentuh 3 dari 50 kolom — DuckDB hanya membaca 6% data. Inilah sumber utama kecepatannya, bukan “kode yang lebih pintar”.",
      ],
      reference: "SQLite = baris untuk transaksi. DuckDB = kolom untuk analitik. Keduanya tanpa server; arsitekturnya beda.",
    },
    {
      id: "konsep-file",
      eyebrow: "Langkah 4 · Konsep",
      title: "Query File Langsung — Tanpa ETL, Tanpa CREATE TABLE",
      prose: [
        "Definisi: DuckDB bisa query file SEOLAH tabel tanpa mengimpornya dulu: SELECT rute, SUM(biaya) FROM read_parquet('pengiriman.parquet') GROUP BY rute; — atau read_csv_auto('data.csv') yang menebak skema otomatis. Bahkan bisa langsung ke cloud: FROM 's3://bucket/data/*.parquet' (dengan ekstensi httpfs). Tidak ada CREATE TABLE, tidak ada COPY, tidak ada staging — file ADALAH tabel.",
        "Kepribadiannya: ini seperti perpustakaan yang membolehkanmu membaca buku langsung di rak — tidak perlu meminjam (impor), fotokopi (staging), dan mengembalikan. Analis tradisional: unduh → impor → baru query (tiga langkah, dua salinan data). Analis DuckDB: query file di tempatnya (satu langkah, nol salinan). Untuk data lake yang isinya ratusan file Parquet, ini mengubah “proyek ETL 2 minggu” menjadi “query sore ini”.",
        "Kapan memakai: eksplorasi data lake/arsip (Parquet/CSV di disk atau S3); ETL satu-pass (baca CSV kotor → tulis Parquet bersih); join file dengan tabel database. Tiga fungsi kuncinya: read_parquet (kolomnar — hanya kolom yang diquery dibaca dari disk!), read_csv_auto (tebak delimiter/skema), read_json. Catatan format: Parquet adalah pasangan alami DuckDB — keduanya kolomnar, sehingga filter + proyeksi didorong sampai ke level file (predicate pushdown). CSV tetap bisa, tetapi CSV harus dipindai penuh (format baris tidak bisa dilompati).",
      ],
      formula: String.raw`\text{data\_dibaca} = \frac{k_{\text{dipakai}}}{k_{\text{total}}} \times n_{\text{baris\_lolos\_filter}}`,
      formulaNote: "Simbol: k_dipakai = jumlah kolom di SELECT, k_total = jumlah kolom file, n_baris_lolos_filter = baris yang lolos WHERE. Interpretasi: pada Parquet, DuckDB hanya membaca fraksi kolom yang dipakai DARI baris yang lolos filter — bukan seluruh file. Contoh angka: file 50 kolom × 100 juta baris; query memakai 3 kolom dengan filter menyisakan 10 juta baris → data dibaca ≈ (3/50) × 10 juta “baris-kolom” — orde 6% dari file. Inilah kenapa query 1 GB terasa instan: yang dibaca bukan 1 GB.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “read_csv_auto berarti tidak perlu peduli skema”",
        type: "pitfall",
        body: "Yang benar: auto hanya MENEBak dari sampel baris awal — tipe yang salah tebak (tanggal dibaca sebagai teks, angka dengan koma dibaca null) menghasilkan bug diam-diam. Selalu verifikasi dengan DESCRIBE SELECT * FROM read_csv_auto(...) LIMIT 5, dan untuk pipeline produksi, tulis skema eksplisit (read_csv dengan definisi kolom). Kemudahan eksplorasi ≠ kelalaian produksi.",
      },
      hints: [
        "💡 Intuisi file-sebagai-tabel: biasakan pola “query dulu, impor kemudian (kalau perlu)”. 80% pertanyaan analitik terjawab langsung dari file — impor ke tabel permanen hanya untuk data yang diquery BERULANG kali oleh BANYAK orang.",
      ],
      reference: "File ADALAH tabel: read_parquet/read_csv_auto. Parquet + DuckDB = filter dan proyeksi didorong ke file.",
    },
    {
      id: "konsep-pilih",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kapan DuckDB, Kapan Bukan — Peta Wilayah Si Bebek",
      prose: [
        "Definisi wilayah tiap tool dalam satu kalimat: SQLite — database baris in-process untuk aplikasi transaksional kecil (mobile app, cache lokal). DuckDB — database kolom in-process untuk analitik satu mesin (laptop analis, ETL). Postgres — database server untuk transaksi + analitik menengah dengan konkurensi. Spark — komputasi terdistribusi untuk data yang tidak muat di satu mesin.",
        "Kepribadiannya: bayangkan empat kendaraan — SQLite sepeda (lincah, personal), DuckDB pikap (angkut beban analitik, tetap personal), Postgres truk engkel (muat banyak, butuh sopir/DevOps), Spark konvoi truk (antar-pulau, butuh koordinator). Memakai konvoi truk untuk belanja mingguan (Spark untuk CSV 2 GB) adalah komedi mahal yang sering terjadi di industri — biaya cluster untuk pertanyaan yang dijawab bebek 8 detik.",
        "Kapan memakai DuckDB: data muat di satu mesin (hingga ratusan GB — DuckDB spill ke disk dengan elegan), analisis interaktif, ETL batch, feature engineering untuk ML. Kapan NAIK ke Spark: data tidak muat di satu mesin ATAU komputasi butuh paralelisme cluster (bukan sekadar “data besar” — 100 GB masih wilayah bebek). Kapan ke Postgres: butuh banyak penulis konkuren, transaksi ACID antar-tabel kompleks, atau aplikasi production multi-user. Aturan praktis: mulai dari bebek; naik kelas hanya saat ada BUKTI (out-of-memory yang tidak wajar, atau kebutuhan konkuren) — bukan karena “nanti kalau besar”.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Data kami besar, jadi harus Spark.” 95% tim yang berkata ini belum mengukur: “besar” mereka 20 GB — wilayah nyaman DuckDB. Spark menambah kompleksitas 10× (cluster, tuning, debug terdistribusi). Aturan: ukur dulu di DuckDB; pindah ke Spark saat DuckDB terbukti tidak cukup, bukan saat arsitekturnya “terlihat keren”.",
      },
      hints: [
        "💡 Intuisi kendaraan: pilih kendaraan terkecil yang muat bebannya. Bebanmu CSV 2 GB → pikap (DuckDB), bukan konvoi (Spark). Penghematan bukan cuma uang cluster — tetapi juga jam debugging: query DuckDB di-debug seperti SQL biasa.",
      ],
      reference: "Satu mesin + analitik → DuckDB. Multi-writer/transaksi → Postgres. Tidak muat satu mesin → Spark. Buktikan dulu sebelum naik.",
    },
    {
      id: "lab-topn",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Top produk per grup: pola analitik klasik",
      prose: [
        "Waktunya praktik dengan pola yang paling sering dianalitik: “untuk tiap bulan dan kategori, tampilkan 2 produk dengan omzet tertinggi.” Di DuckDB ini pola sehari-hari atas file Parquet; di lab ini kita pakai tabel penjualan (11 baris sampel — sintaksnya identik).",
        "Tugasmu: tulis query dengan CTE + ROW_NUMBER() OVER (PARTITION BY bulan, kategori ORDER BY total DESC), lalu saring peringkat <= 2. Kolom hasil: bulan, kategori, produk, total — urutkan bulan, kategori, peringkat.",
        "Petunjuk: bulan = substr(tanggal,1,7); total per produk = SUM(qty*harga). Kerangka: WITH omzet AS (...), rn AS (SELECT *, ROW_NUMBER() OVER (...) AS peringkat FROM omzet) SELECT ... FROM rn WHERE peringkat <= 2 ...",
        "Coba: setelah lolos, ubah menjadi peringkat <= 1 — produk apa yang menjadi juara tiap grup? Lalu ganti ORDER BY total DESC menjadi ASC di window — apa yang berubah pada maknanya? (Jawaban: menjadi 2 produk TERENDAH — window yang sama, pertanyaan berbeda.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis CTE omzet (bulan, kategori, produk, total) + ROW_NUMBER per (bulan,kategori) lalu saring peringkat <= 2" },
      ],
      sqlLab: {
        task: "Untuk tiap bulan (substr(tanggal,1,7)) dan kategori, tampilkan 2 produk dengan total omzet (SUM(qty*harga)) tertinggi. Kolom: bulan, kategori, produk, total. Urutkan: bulan, kategori, peringkat.",
        schema: C21_SCHEMA,
        seedData: C21_SEED,
        starter: "SELECT\n",
        solution: "WITH omzet AS (SELECT substr(tanggal,1,7) AS bulan, kategori, produk, SUM(qty*harga) AS total FROM penjualan GROUP BY 1,2,3), rn AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY bulan, kategori ORDER BY total DESC) AS peringkat FROM omzet) SELECT bulan, kategori, produk, total FROM rn WHERE peringkat <= 2 ORDER BY bulan, kategori, peringkat",
        expectedColumns: ["bulan", "kategori", "produk", "total"],
        expectedRows: [["2026-01", "Makanan", "Roti D", 3000000], ["2026-01", "Makanan", "Roti E", 1760000], ["2026-01", "Minuman", "Kopi B", 3000000], ["2026-01", "Minuman", "Kopi A", 2160000], ["2026-02", "Makanan", "Roti E", 4400000], ["2026-02", "Makanan", "Snack F", 2500000], ["2026-02", "Minuman", "Kopi A", 1800000], ["2026-02", "Minuman", "Teh C", 1080000]],
        orderMatters: true,
      },
      reference: "Top-N per grup = GROUP BY lalu ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) lalu saring peringkat.",
    },
    {
      id: "lab-selektif",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Agregasi selektif: ramah kolomnar",
      prose: [
        "Lab kedua melatih pola “ramah kolomnar”: pilih SEDIKIT kolom, saring DINI. Tugasmu: untuk transaksi bulan 2026-02 dengan qty >= 100, tampilkan kategori, total_qty (SUM qty), dan rata_harga (AVG harga). Urutkan kategori alfabetis.",
        "Kenapa ini pola DuckDB: pada file Parquet 50 kolom, query ini hanya menyentuh 4 kolom (tanggal, kategori, qty, harga) dari baris yang lolos filter — bukan 50 kolom × semua baris. Kebiasaan “SELECT kolom yang dibutuhkan + WHERE sedini mungkin” adalah cara menulis SQL yang memanfaatkan arsitektur kolomnar.",
        "Coba: setelah lolos, hapus kondisi qty >= 100 dan jalankan ulang — bagaimana total_qty dan rata_harga berubah? Itulah efek filter dini: semakin selektif, semakin sedikit yang dibaca.",
      ],
      tasks: [
        { id: "t1", text: "SELECT kategori, SUM(qty), AVG(harga) dengan WHERE bulan='2026-02' AND qty >= 100, GROUP BY kategori" },
      ],
      sqlLab: {
        task: "Untuk transaksi bulan 2026-02 (substr(tanggal,1,7) = '2026-02') dengan qty >= 100: tampilkan kategori, total_qty (SUM qty), rata_harga (AVG harga). Kelompokkan per kategori, urutkan kategori alfabetis.",
        schema: C21_SCHEMA,
        seedData: C21_SEED,
        starter: "SELECT\n",
        solution: "SELECT kategori, SUM(qty) AS total_qty, AVG(harga) AS rata_harga FROM penjualan WHERE substr(tanggal,1,7)='2026-02' AND qty >= 100 GROUP BY kategori ORDER BY kategori",
        expectedColumns: ["kategori", "total_qty", "rata_harga"],
        expectedRows: [["Makanan", 820, 12333.333333333334], ["Minuman", 100, 18000.0]],
        orderMatters: true,
      },
      reference: "Ramah kolomnar: sedikit kolom di SELECT, filter di WHERE sedini mungkin. Sisanya tidak dibaca dari disk.",
    },
    {
      id: "chart-waktu",
      eyebrow: "Langkah 8 · Chart",
      title: "Membaca orde besaran: kenapa arsitektur mengalahkan optimasi",
      prose: [
        "Chart di bawah membandingkan waktu query agregasi yang sama (GROUP BY kategori) atas data 1 GB: pandas (load semua ke RAM dulu), SQLite (row-based), dan DuckDB (kolomnar). Angka bersifat ilustrasi orde besaran, bukan benchmark resmi.",
        "Cara membaca: sumbu Y = detik; tiap batang = satu tool; label kecil di bawah nama tool menjelaskan penyebab angkanya.",
        "Interpretasi: pandas 62 detik — didominasi waktu LOAD (memindahkan 1 GB ke memori + mengembang), bukan waktu hitung. SQLite 34 detik — tanpa load, tetapi memindai per baris (membaca kolom yang tidak dibutuhkan ikut terbaca). DuckDB 7 detik — hanya kolom yang dipakai yang dipindai, per batch vektor. Pelajaran chart: perbedaan 9× ini BUKAN dari “kode lebih optimal”, melainkan dari arsitektur (kolomnar + tanpa-load). Optimasi mikro tidak akan mengalahkan pilihan arsitektur yang tepat — pilih kendaraan dulu, baru tune mesinnya.",
      ],
      figure: {
        svg: WAKTU_SVG,
        alt: "Diagram batang waktu query agregasi 1 GB: pandas 62 detik (load semua), SQLite 34 detik (row-based), DuckDB 7 detik (kolomnar).",
        caption: "Waktu query agregasi 1 GB (ilustrasi orde besaran). Arsitektur — bukan optimasi mikro — yang menentukan.",
      },
      tasks: [],
      reference: "9× lebih cepat dari arsitektur (kolomnar + tanpa load), bukan dari optimasi mikro.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Memilih senjata data-besar tanpa membayar pajak cluster",
      prose: [
        "Lima skenario pemilihan tool data:",
        "Skenario 1 — CSV 2 GB di laptop, butuh agregasi sore ini. → DuckDB (read_csv_auto langsung). Alasan: 8 detik, nol setup, nol cluster.",
        "Skenario 2 — Arsip 300 file Parquet di S3, query ad-hoc mingguan. → DuckDB + read_parquet('s3://.../*.parquet'). Alasan: file adalah tabel; filter didorong ke file; tanpa ETL.",
        "Skenario 3 — Aplikasi mobile butuh database lokal untuk catatan pengguna. → SQLite. Alasan: ini wilayah transaksi baris-kecil — bebek salah alamat di sini.",
        "Skenario 4 — Data 5 TB yang tidak muat di satu mesin + butuh paralel cluster. → Spark. Alasan: satu-satunya skenario di mana pajak cluster terbayar — ada BUKTI DuckDB tidak cukup.",
        "Skenario 5 — Pipeline harian: baca 50 GB CSV kotor → tulis Parquet bersih → agregat. → DuckDB sebagai mesin ETL (atau Python + DuckDB). Alasan: ETL satu-pass tanpa server; jauh lebih sederhana daripada orkestrasi Spark untuk volume ini.",
        "Aturan praktis 10 detik: muat di satu mesin + analitik → DuckDB; transaksi kecil lokal → SQLite; multi-writer/app production → Postgres; tidak muat satu mesin (terbukti) → Spark. Mulai dari yang terkecil; naik hanya dengan bukti.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun pipeline Spark “untuk jaga-jaga kalau data membesar” sementara data saat ini 30 GB. Biaya: 3 bulan setup + debug terdistribusi untuk beban yang dijawab DuckDB dalam sehari. YAGNI (you aren't gonna need it) berlaku untuk arsitektur data: skala saat sakitnya nyata, bukan saat takutnya nyata.",
      },
      reference: "Pilih kendaraan terkecil yang muat beban. Naik kelas hanya dengan bukti, bukan ketakutan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Pipeline logistik harian: dari 3 jam menjadi 10 menit",
      prose: [
        "Skenario (sintetis, angka konkret): perusahaan logistik menerima 40 file CSV harian (total 12 GB) berisi data pengiriman. Pipeline saat ini: analis memuat semua ke pandas (3 jam, sering OOM), agregasi per rute + join tabel tarif, tulis ke Excel untuk finance. Finance mengeluh angka “kadang beda” karena analis memakai chunk berbeda tiap hari.",
        "Pertanyaan analisis: (1) Rancang ulang pipeline dengan DuckDB — tulis langkah dan query intinya. (2) Di mana letak penghematan 3 jam → 10 menit? (3) Apa yang TIDAK diselesaikan DuckDB di sini?",
        "Pembahasan: (1) Langkah: satu script — CREATE TABLE pengiriman AS SELECT * FROM read_csv_auto('harian/*.csv') (atau langsung query tanpa tabel); agregasi: SELECT rute, SUM(biaya) AS total, COUNT(*) AS n FROM read_csv_auto('harian/*.csv') GROUP BY rute; join tarif: ... FROM read_csv_auto(...) p JOIN tarif t ON p.kode_rute = t.kode; tulis hasil: COPY (SELECT ...) TO 'ringkasan.parquet' (FORMAT PARQUET). Finance membaca Parquet/Excel hasil — satu sumber, konsisten. (2) Penghematan: tanpa load 12 GB ke RAM (DuckDB streaming dari disk), tanpa chunk manual, tanpa OOM-retry; agregasi kolomnar atas 12 GB ≈ menit. “Kadang beda” hilang karena tidak ada chunk manual — satu query atas semua file. (3) Yang tidak diselesaikan: orkestrasi jadwal (tetap butuh cron/airflow), validasi kualitas data (tetap butuh cek), dan versi file arsip (tetap butuh manajemen file). DuckDB menyelesaikan KOMPUTASI — bukan seluruh rekayasa data.",
        "Kaitan ke karier: “memangkas pipeline 3 jam menjadi 10 menit dengan mengganti arsitektur” adalah cerita yang membuat hiring manager data engineer berhenti scroll CV.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "“Angka kadang beda karena chunk berbeda” adalah risiko integritas laporan finance — keputusan pembayaran vendor dihitung dari angka yang tidak deterministik. Pipeline yang deterministik (satu query, semua file) bukan sekadar lebih cepat — ia menghilangkan kelas risiko inkonsistensi.",
      },
      reference: "DuckDB: komputasi 3 jam → 10 menit + deterministik. Orkestrasi dan validasi tetap butuh rekayasa.",
    },
    {
      id: "intuisi-duckdb",
      eyebrow: "Langkah 11 · Intuisi",
      title: "Pilih senjata dari ukuran masalah, bukan dari gengsi teknologinya",
      prose: [
        "Insinyur junior memilih teknologi lalu mencari masalahnya; senior mengukur masalahnya lalu memilih teknologi terkecil yang cukup.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: mulai dari yang terkecil, naik hanya dengan bukti",
        body: "Setiap lompatan teknologi (DuckDB → Postgres → Spark) membayar “pajak”: pajak cluster (setup, orkestrasi, biaya), pajak operasional (monitoring, retry, partisi), dan pajak kognitif (tim harus menguasainya). Heuristik senior: buktikan dulu bahwa senjata yang lebih kecil TIDAK CUKUP — dengan angka, bukan firasat. “CSV 2 GB” bukan bukti butuh Spark; “query 8 detik di DuckDB” adalah bukti tidak butuh Spark. Urutan yang benar: ukur di DuckDB (satu mesin, nol pajak) → bila gagal (OOM yang tidak tertolong spill, atau memang butuh paralel cluster), baru naik — dan catat BUKTI kegagalannya sebagai ADR (arsitektur decision record). Kebanyakan “butuh big data” yang saya lihat sebenarnya adalah “butuh format kolomnar + query yang sargable”. Pajak terbesar dalam karier data bukanlah komputasi — melainkan kompleksitas yang dibayar tiap hari untuk masalah yang sebenarnya kecil.",
      },
      reference: "Buktikan senjata kecil gagal (dengan angka) sebelum membayar pajak senjata besar.",
    },
    {
      id: "partisi-parquet",
      eyebrow: "Langkah 12 · Partisi",
      title: "Partisi Parquet, partition pruning, dan batas si bebek",
      prose: [
        "File Parquet menjadi senjata sesungguhnya saat DIPARTISI: data/year=2026/month=09/data.parquet — struktur direktori hive-style tempat nilai kolom partisi dikodekan di PATH, bukan di dalam file. Keuntungannya adalah partition pruning: query WHERE year = 2026 AND month = 09 hanya membuka file di dua direktori itu — 36 file lain tidak disentuh sama sekali. Pada arsip 3 tahun (36 partisi bulan), query sebulan memindai ~3% data. Inilah “index”-nya data lake: bukan struktur B-tree, melainkan organisasi file. DuckDB memahami pola ini otomatis: FROM read_parquet('arsip/*/*/*.parquet', hive_partitioning = true) mengekspos year/month sebagai kolom virtual yang bisa di-WHERE.",
        "Tiga aturan partisi yang menentukan berhasil tidaknya: (1) partisi berdasarkan kolom yang SELALU difilter (tanggal, wilayah) — partisi atas kolom yang jarang difilter hanya menambah file kecil tanpa pruning; (2) ukuran file per partisi 100 MB–1 GB — ribuan file 1 MB (“small file problem”) membunuh performa karena overhead buka-file mendominasi; gabungkan (compaction) file kecil secara berkala; (3) JANGAN partisi atas kolom kardinalitas raksasa (user_id dengan 10 juta nilai = 10 juta direktori) — partisi ideal berjumlah puluhan hingga ribuan, bukan jutaan. Untuk kolom sangat selektif di dalam partisi, andalkan statistik min/max per row-group Parquet (pruning tingkat kedua, otomatis).",
        "Batas DuckDB yang harus jujur diakui — kapan ia BUKAN jawabannya: (1) multi-writer konkuren — DuckDB adalah satu proses; puluhan aplikasi menulis bersamaan adalah wilayah Postgres; (2) data yang tidak muat di satu mesin bahkan dengan spill — ratusan TB; (3) komputasi yang butuh paralelisme cluster (bukan sekadar data besar — 500 GB di satu mesin NVMe sering lebih cepat di DuckDB daripada di cluster kecil yang sibuk koordinasi); (4) serving latensi-rendah ribuan query/detik — DuckDB untuk analitik, bukan untuk API. Aturan: DuckDB menang di “satu mesin, analitik, batch/interaktif”; kalah di “banyak penulis, cluster, serving”. Mengetahui batasnya adalah yang membuat rekomendasi DuckDB-mu kredibel — bukan fanatisme.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Partisi per hari agar pruning-nya tajam.” Untuk 5 tahun data = 1.825 partisi × file kecil = small file problem: query memindai metadata ribuan file sebelum membaca data. Partisi per BULAN (60 partisi) dengan min/max row-group untuk ketajaman harian hampir selalu menang. Partisi = organisasi kasar; ketajaman = statistik file.",
      },
      reference: "Partisi = kolom yang selalu difilter, ukuran file 100MB–1GB; DuckDB = satu mesin analitik, bukan multi-writer.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "DuckDB = database OLAP in-process (tanpa server): penyimpanan kolomnar + eksekusi vektorisasi — “SQLite untuk analitik”, bukan “SQLite yang lebih cepat”.",
        "File ADALAH tabel: read_parquet/read_csv_auto query langsung tanpa ETL; pada Parquet, hanya kolom yang dipakai dari baris yang lolos filter yang dibaca.",
        "Kecepatan datang dari arsitektur (tanpa t_load + pindai kolom selektif), bukan optimasi mikro — S ≈ 9× pada contoh 1 GB.",
        "Pola ramah-kolomnar: sedikit kolom di SELECT, filter WHERE sedini mungkin; verifikasi skema read_csv_auto dengan DESCRIBE.",
        "Pilih tool: satu mesin + analitik → DuckDB; transaksi lokal → SQLite; multi-writer → Postgres; terbukti tidak muat satu mesin → Spark.",
      ],
      quiz: [
        {
          q: "Sumber utama kecepatan DuckDB atas pandas untuk agregasi file besar adalah…",
          options: [
            { text: "Arsitektur: tanpa memuat seluruh data ke RAM (t_load hilang) + hanya kolom yang dipakai yang dipindai (kolomnar)", why: "Benar: rumus Langkah 3 — keunggulan datang dari menghilangkan t_load dan pindai selektif, bukan dari kode yang lebih pintar.", correct: true },
            { text: "DuckDB ditulis dalam bahasa yang lebih cepat dari Python", why: "Salah: pandas intinya juga C/Cython. Bahasa bukan pembedanya — arsitektur datanya." },
            { text: "DuckDB memakai GPU secara otomatis", why: "Salah: DuckDB standar berjalan di CPU (vektorisasi SIMD). GPU bukan sumber kecepatannya." },
            { text: "DuckDB mengompres file sehingga datanya lebih kecil", why: "Salah: kompresi membantu I/O tetapi bukan sumber utama — sumber utamanya adalah tidak-membaca yang tidak dibutuhkan." },
          ],
        },
        {
          q: "Query SELECT rute, SUM(biaya) FROM read_parquet('s3://bucket/*.parquet') GROUP BY rute — apa yang terjadi?",
          options: [
            { text: "DuckDB membaca langsung file-file Parquet di S3 seolah tabel, hanya kolom rute+biaya yang dipindai, tanpa impor/ETL", why: "Benar: file ADALAH tabel; predicate pushdown + proyeksi kolom didorong hingga ke file.", correct: true },
            { text: "File harus diunduh dan diimpor dulu dengan CREATE TABLE", why: "Salah: justru inilah yang dihilangkan read_parquet — tanpa ETL, tanpa staging." },
            { text: "Query error karena tabel tidak didefinisikan", why: "Salah: fungsi table (read_parquet) valid di posisi FROM — tidak perlu tabel terdaftar." },
            { text: "Semua kolom semua file dimuat ke memori dulu", why: "Salah: itu perilaku pandas, bukan DuckDB kolomnar." },
          ],
        },
        {
          q: "Perbedaan fundamental SQLite vs DuckDB adalah…",
          options: [
            { text: "SQLite menyimpan per baris (optimal transaksi), DuckDB per kolom (optimal analitik) — kemiripan hanya pada “tanpa server”", why: "Benar: inilah miskonsepsi Langkah 3. Salah alamat = pakai SQLite untuk agregasi raksasa atau DuckDB untuk transaksi konkuren.", correct: true },
            { text: "DuckDB hanya bisa dipakai dari Python, SQLite dari mana saja", why: "Salah: DuckDB punya CLI, R, Java, WASM — sama multi-bahasa seperti SQLite." },
            { text: "SQLite gratis, DuckDB berbayar", why: "Salah: keduanya open-source gratis (MIT)." },
            { text: "Tidak ada beda — DuckDB adalah fork SQLite", why: "Salah: DuckDB dibangun dari nol dengan arsitektur berbeda, bukan fork." },
          ],
        },
        {
          q: "Tim mengusulkan cluster Spark untuk data 30 GB karena “nanti kalau membesar”. Respons tepat?",
          options: [
            { text: "Tolak untuk sekarang — 30 GB wilayah nyaman DuckDB; naik ke Spark saat ada bukti tidak cukup, bukan ketakutan", why: "Benar: skenario 5 + aturan YAGNI. Pajak cluster 10× kompleksitas tidak terbayar untuk beban yang dijawab bebek.", correct: true },
            { text: "Setuju — lebih baik over-engineering dari awal", why: "Salah: over-engineering arsitektur data = 3 bulan setup + debug terdistribusi untuk masalah yang belum ada." },
            { text: "Setuju — Spark selalu lebih cepat dari DuckDB", why: "Salah: untuk satu mesin, overhead distribusi justru membuat Spark LEBIH LAMBAT dari DuckDB pada data yang sama." },
            { text: "Tolak — data 30 GB harus diolah manual di Excel", why: "Salah: penolakan Spark bukan berarti kembali ke manual — DuckDB adalah jawaban yang tepat di tengahnya." },
          ],
        },
        {
          q: "read_csv_auto menebak kolom tanggal sebagai TEXT. Dampak dan tindakan benar?",
          options: [
            { text: "Fungsi tanggal (substr per bulan) tetap jalan tetapi sortir/filter tanggal bisa salah makna — verifikasi dengan DESCRIBE + tulis skema eksplisit untuk produksi", why: "Benar: inilah miskonsepsi Langkah 4. Auto = tebakan dari sampel; kemudahan eksplorasi bukan kelalaian produksi.", correct: true },
            { text: "Tidak masalah — TEXT dan DATE identik di semua operasi", why: "Salah: perbandingan string '2026-10-2' vs '2026-10-15' salah urutan; fungsi tanggal butuh tipe tanggal." },
            { text: "Query langsung error sehingga mudah ketahuan", why: "Salah: tidak error — inilah bahayanya. Bug diam-diam, bukan bug berisik." },
            { text: "Harus convert file CSV ke Parquet dulu", why: "Salah: tidak menyelesaikan masalah tebakan tipe — Parquet dari tebakan yang salah tetap salah." },
          ],
        },
      ],
    },
  ],
};
