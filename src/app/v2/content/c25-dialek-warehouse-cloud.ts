import type { V2Lesson } from "../lib/types";

// ── Figure: biaya query per pola (USD, tarif $6,25/TB) ────────────────────
const BIAYA_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang biaya query: SELECT bintang 5,19 dolar vs kolom eksplisit 0,86 vs plus partisi 0,29">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">1,5</text><text x="54" y="139">3</text>
<text x="54" y="99">4,5</text><text x="54" y="59">6 $</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="106" y="78" width="56" height="138" fill="var(--c2)" opacity="0.85"/>
<text x="134" y="70" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">5,19</text>
<text x="134" y="232" text-anchor="middle" fill="var(--text)">SELECT *</text>
<rect x="238" y="193" width="56" height="23" fill="var(--c1)" opacity="0.9"/>
<text x="266" y="187" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">0,86</text>
<text x="266" y="232" text-anchor="middle" fill="var(--text)">2 kolom</text>
<rect x="370" y="208" width="56" height="8" fill="var(--c1)" opacity="0.55"/>
<text x="398" y="202" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">0,29</text>
<text x="398" y="232" text-anchor="middle" fill="var(--text)">+ partisi</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">biaya 1 query atas tabel 850 GB · tarif $6,25/TB (ilustrasi)</text>
</g>
</svg>`;

export const c25: V2Lesson = {
  slug: "c25-dialek-warehouse-cloud",
  track: "SQL",
  module: "Lanjutan",
  title: "Dialek Warehouse Cloud: BigQuery, Snowflake, dan Biaya Query",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query 3 detik yang menagih $5 — untuk mengintip",
      prose: [
        "Dimas, analis junior, baru mendapat akses BigQuery. Ia ingin “mengintip” tabel clickstream sebelum analisis: SELECT * FROM clickstream LIMIT 10. Query-nya selesai dalam 3 detik, 10 baris tampil rapi. Keesokan harinya tim FinOps bertanya: “kamu menjalankan query $5 kemarin?” Dimas bingung — “kan cuma 10 baris?”",
        "Twist-nya: di BigQuery, LIMIT 10 TIDAK mengurangi data yang dipindai — mesin tetap membaca SEMUA kolom dari SEMUA baris (850 GB), lalu mengambil 10 baris di akhir. Biaya dihitung dari byte yang DIPINDAI, bukan baris yang ditampilkan: 850 GB × $6,25/TB = $5,31 — untuk mengintip. Query yang sama dengan 2 kolom eksplisit: ~$0,86. Ditambah filter partisi tanggal: ~$0,29. Tiga penulisan, tiga tagihan, satu hasil yang sama.",
        "Riset lowongan Oktober 2026: 6 dari 10 listing SQL menyebut cloud warehouse (Snowflake/BigQuery/Redshift) — dan tidak satu pun lesson SQL yang mengajarkan dialek serta ekonominya. Lesson ini menutupnya: perbedaan dialek yang menjebak saat pindah warehouse, partitioning & clustering sebagai rem tagihan, data semi-structured, dan cara menghitung biaya SEBELUM menekan Run. Lab memakai sqlite3 di browser: kamu menulis query versi BigQuery/Snowflake sebagai teks, menjalankan padanan logikanya, dan menghitung estimasi biayanya.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini skill yang ditagih",
        type: "risk",
        body: "Di warehouse on-premise (Postgres lokal), query boros = lambat. Di warehouse cloud, query boros = LAMBAT + MAHAL — dan tagihannya datang ke kartu kredit perusahaan dengan namamu di log audit. “Bisa SQL” tanpa “paham biaya warehouse” adalah risiko finansial yang bisa dipecat.",
      },
      reference: "Biaya = byte DIPINDAI × tarif. LIMIT tidak menghemat. Kolom eksplisit + partisi = rem tagihan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita query $5. (2) Peta ini. (3) Konsep: dialek — logat yang menjebak. (4) Konsep: partitioning & clustering — rem tagihan. (5) Konsep: semi-structured — JSON di dalam kolom. (6) Lab 1: terjemahkan dialek + hitung biaya. (7) Lab 2: simulasi partition pruning. (8) Chart: tiga tagihan, satu hasil. (9) Peta keputusan: empat skenario warehouse. (10) Mini-case: tagihan dashboard $900/bulan. (11) Checkpoint: kuis + rangkuman.",
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menerjemahkan pola query antar dialek (LIMIT/TOP, QUALIFY, ekstraksi JSON); (2) menghitung estimasi biaya query dari byte yang dipindai; (3) menjelaskan cara kerja partition pruning dan kapan ia gagal; (4) memilih antara kolom terstruktur vs semi-structured (VARIANT/STRUCT); (5) memutuskan kapan mematerialkan tabel agregat.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: SELECT dengan WHERE dan GROUP BY; subquery (query di dalam FROM); window function ROW_NUMBER() OVER (ORDER BY ...) memberi nomor urut per baris; biaya = “harga satuan × jumlah yang dipakai”.",
        "Rutenya: cerita → peta → tiga konsep → dua lab → chart → peta keputusan → mini-case → kuis. Estimasi 60 menit; tiap lab ±12 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap tiap warehouse sebagai negara dengan mata uang (tarif) dan bahasa (dialek) sendiri. Turis yang tidak tahu kurs akan kaget di kasir — analis yang tidak tahu tarif akan kaget di tagihan. Lesson ini adalah kursus kilat “bahasa + kurs” sebelum kamu traveling.",
      ],
      reference: "Tujuan: terjemahkan dialek + hitung biaya + pangkas pindaian + pilih struktur data.",
    },
    {
      id: "konsep-dialek",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dialek — Bahasa yang Sama, Logat yang Menjebak",
      prose: [
        "Definisi: dialek adalah varian SQL tiap warehouse — intinya sama (SELECT/WHERE/GROUP BY), tetapi fungsi dan sintaks tambahannya berbeda. Tiga jebakan paling umum saat pindah warehouse: (1) pembatas baris: LIMIT 10 (Postgres/BigQuery/Snowflake/MySQL) vs TOP 10 (SQL Server) vs FETCH FIRST 10 ROWS ONLY (Oracle) — salah satu = error sintaks di wawancara live; (2) QUALIFY: BigQuery & Snowflake mengizinkan WHERE atas window function — SELECT halaman, ROW_NUMBER() OVER (ORDER BY AVG(durasi) DESC) AS rn FROM klik GROUP BY halaman QUALIFY rn <= 2 — di Postgres/MySQL ini ERROR (window function tidak boleh di WHERE; harus dibungkus subquery); (3) pembagian integer: 5/2 = 2 di Postgres/MySQL (integer division!) vs 2,5 di BigQuery/Snowflake — bug senyap yang mengubah angka tanpa error.",
        "Kepribadiannya: Dialek adalah logat daerah — “sama-sama bahasa Indonesia, tetapi pesan ‘nasi’ di satu daerah bisa diartikan berbeda”. Query yang lolos di Postgres bisa error di BigQuery, dan yang lebih berbahaya: bisa JALAN tetapi menghasilkan angka BEDA (integer division).",
        "Contoh langkah-demi-langkah (pola QUALIFY, angka lab 1): “2 halaman dengan rata-rata durasi tertinggi”. Versi BigQuery/Snowflake: SELECT halaman, AVG(durasi_detik) AS rata2 FROM klik GROUP BY halaman QUALIFY ROW_NUMBER() OVER (ORDER BY AVG(durasi_detik) DESC) <= 2 — satu level, QUALIFY memfilter SETELAH window dihitung. Versi Postgres/sqlite (tanpa QUALIFY): SELECT halaman, rata2 FROM (SELECT halaman, AVG(durasi_detik) AS rata2, ROW_NUMBER() OVER (ORDER BY AVG(durasi_detik) DESC) AS rn FROM klik GROUP BY halaman) WHERE rn <= 2 — dua level, subquery dulu baru filter. Hasil identik: /produk 156,67, /checkout 100,0. Pelajarannya: kuasai POLA (filter setelah window), bukan hafalan sintaks — pola diterjemahkan ke dialek mana pun.",
        "Strategi anti-jebakan: (1) tulis SQL standar (ANSI) untuk logika inti — ia jalan di mana-mana; (2) isolasi sintaks dialek-spesifik di satu tempat (komentar -- DIALEK: BigQuery); (3) di wawancara, sebutkan dialeknya eksplisit: “di BigQuery saya pakai QUALIFY; di Postgres padanannya subquery”. Pewawancara menilai kesadaran dialek — bukan hafalan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “SQL itu SQL — tulis sekali, jalan di mana saja”",
        type: "pitfall",
        body: "Yang benar: 80% jalan di mana saja, 20% menjebak — dan 20% itu berisi QUALIFY, integer division, fungsi tanggal, dan ekstraksi JSON. “Jalan di laptop (Postgres), error di production (BigQuery)” adalah insiden klasik migrasi warehouse. Selalu uji di dialek target, atau tulis ANSI.",
      },
      hints: [
        "💡 Intuisi logat: saat membaca query orang, tanyakan “dialek apa ini?” sebelum “benar atau salah?”. Query yang “salah” di kepalamu mungkin benar di dialeknya — dan query yang benar di dialekmu mungkin error di dialek pewawancara.",
      ],
      reference: "Kuasai pola (filter-setelah-window), bukan hafalan. Sebutkan dialek eksplisit di wawancara.",
    },
    {
      id: "konsep-partisi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Partitioning & Clustering — Rem Tagihan",
      prose: [
        "Definisi: partitioning membagi tabel raksasa menjadi “laci” fisik per nilai kolom (biasanya tanggal: satu laci per hari/bulan); clustering mengurutkan data di dalam laci per kolom yang sering difilter (mis. kategori). Partition PRUNING: saat query memfilter kolom partisi (WHERE tanggal = '2026-02-15'), mesin hanya membuka laci itu — laci lain tidak dibaca, tidak dibayar.",
        "Kepribadiannya: Partisi adalah arsiparis yang galak — “cari data Februari? Saya bukakan laci Februari saja; 11 laci lainnya jangan disentuh”. Tanpa arsiparis, tiap query = bongkar seluruh gudang (full scan). Clustering adalah asistennya yang menyusun isi laci berurutan — mencari kategori di dalam laci Februari tidak perlu mengobrak-abrik.",
        "Contoh langkah-demi-langkah (angka lab 2): tabel penjualan 12 baris (4 per bulan, Jan–Mar). Tanpa partisi: query “omzet Februari” memindai 12 baris. Dengan partisi per bulan + filter substr(tanggal,1,7)='2026-02': hanya 4 baris dipindai — hemat 66,7%. Di skala nyata: tabel 850 GB, 36 bulan → query 1 bulan memindai ~23,6 GB (1/36) — tagihan dari $5,31 menjadi $0,15. Inilah mengapa kolom partisi adalah keputusan ARSITEKTUR, bukan optimasi belakangan.",
        "Kapan pruning GAGAL (tiga pola): (1) filter memakai FUNGSI di kolom partisi: WHERE YEAR(tanggal)='2026' — persis antipattern SARGable lesson C22, arsiparis tidak mengenali laci; (2) filter di kolom BUKAN partisi: partisi per tanggal tetapi filter per kategori → semua laci dibuka; (3) partisi terlalu halus (per jam untuk query harian) → overhead metadata menggerogoti penghematan. Aturan: partisi per granularitas query tersering (harian untuk query harian), filter dengan kolom telanjang.",
      ],
      formula: String.raw`\text{biaya} = \frac{\text{byte\_dipindai}}{1\,\text{TB}} \times \text{tarif} \quad\text{dengan}\quad \text{byte\_dipindai} = \text{byte\_total} \times f_{kolom} \times f_{partisi}`,
      formulaNote: "Simbol: tarif = harga per TB dipindai (mis. $6,25), f_kolom = fraksi kolom yang dipilih (2 dari 12 kolom ≈ 1/6), f_partisi = fraksi partisi yang dibuka (1 bulan dari 36 ≈ 1/36). Interpretasi: biaya punya TIGA tuas — dan SELECT * + tanpa filter partisi memaksimalkan ketiganya (= 1 × 1 × 1). Contoh angka: 850 GB × 1 × 1 /1024 × $6,25 = $5,19; dengan 2 kolom (f=1/6): $0,86; plus 1 partisi dari 3 (f=1/3): $0,29. Tiga penulisan, satu hasil — selisih 18×.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “LIMIT 10 membuat query murah”",
        type: "pitfall",
        body: "Yang benar: di BigQuery, LIMIT memangkas BARIS KELUARAN, bukan byte yang dipindai — mesin tetap membaca semua kolom semua baris lalu mengambil 10. “Mengintip” dengan SELECT * LIMIT 10 atas 850 GB = $5,31 untuk 10 baris. Cara mengintip yang benar: pilih kolom eksplisit + filter partisi + (opsional) tabel sampel.",
      },
      hints: [
        "💡 Intuisi arsiparis: sebelum Run, tanyakan “berapa laci yang akan dibuka query ini?” Jika jawabannya “semua”, berhentilah — tambahkan filter partisi atau persempit kolom. Kebiasaan 5 detik ini menghemat ribuan dolar per tahun.",
      ],
      reference: "Biaya = byte dipindai × tarif. Tiga tuas: kolom, partisi, filter. LIMIT bukan rem.",
    },
    {
      id: "konsep-semistruktur",
      eyebrow: "Langkah 5 · Konsep",
      title: "Semi-structured — JSON di Dalam Kolom",
      prose: [
        "Definisi: kolom semi-structured menyimpan data nested (JSON) di dalam satu kolom — untuk atribut yang tidak tetap strukturnya (event tracking, respons API, konfigurasi). Snowflake: tipe VARIANT; BigQuery: STRUCT/JSON; Postgres: JSONB. Diekstrak dengan notasi titik: data:device (Snowflake), JSON_VALUE(data, '$.device') (BigQuery).",
        "Kepribadiannya: Semi-structured adalah tas serbaguna — muat apa saja (tambah atribut tanpa ALTER TABLE), tetapi mencari barang di dalamnya lebih lambat dari laci berlabel (kolom nyata). Fleksibilitas vs kecepatan query: abadi.",
        "Kapan memakai (tiga kasus sah): (1) event tracking dengan atribut yang terus bertambah (atribut baru tiap sprint — ALTER TABLE tiap sprint = mimpi buruk); (2) payload API pihak ketiga yang skemanya di luar kendalimu; (3) staging area sebelum data “naik kelas” menjadi kolom. Kapan JANGAN: kolom yang sering difilter/di-join/di-agregasi — ia butuh tipe, constraint, dan index (persis pelajaran EAV di lesson C22: atribut populer dipromosikan jadi kolom nyata).",
        "Pola profesional: “tampung fleksibel, sajikan kaku” — mentah sebagai VARIANT/JSON, lalu model dbt (lesson C24!) mempromosikan atribut populer menjadi kolom bertipe di mart. Fleksibilitas di hulu, kecepatan di hilir. Dan peringatan biaya: query atas VARIANT memindai SELURUH dokumen JSON — kolom JSON 2 KB × 100 juta baris = 200 GB terpindai walau kamu hanya butuh satu field 10 byte. Ekstraksi ≠ penghematan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “JSON fleksibel, jadi simpan SEMUA sebagai JSON”",
        type: "pitfall",
        body: "Yang benar: fleksibilitas menyimpan ≠ fleksibilitas memakai. Semua-Jadi-JSON = EAV modern: tanpa tipe (perbandingan numerik salah), tanpa constraint, tanpa index yang waras — plus tagihan pindaian raksasa. Aturan: yang sering dibaca = kolom nyata; yang jarang & tak menentu = JSON.",
      },
      hints: [
        "💡 Intuisi tas: jika kamu mengambil barang yang SAMA dari tas setiap hari (filter per device tiap query), belikan ia laci (kolom). Tas untuk barang musiman, laci untuk barang harian.",
      ],
      reference: "Tampung fleksibel (VARIANT/JSON), sajikan kaku (kolom). Atribut populer naik kelas.",
    },
    {
      id: "lab-dialek",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Terjemahkan dialek, hitung tagihannya",
      prose: [
        "Waktunya praktik. Tabel klik (8 baris) sudah tersedia. Tugasmu tiga lapis: (1) tulis query versi BigQuery/Snowflake (dengan QUALIFY) sebagai teks ke variabel query_bq — “2 halaman dengan rata-rata durasi tertinggi”; (2) jalankan PADANAN logikanya di sqlite (tanpa QUALIFY — pakai subquery) ke top2; (3) hitung estimasi biaya: tabel 850 GB, tarif $6,25/TB — untuk SELECT * vs 2 kolom eksplisit, plus persen penghematannya.",
        "Di produksi, langkah (1) dan (2) adalah pekerjaan sehari-hari saat migrasi warehouse; langkah (3) adalah kebiasaan sebelum menekan Run.",
        "Coba: setelah lolos, ubah tarif menjadi $23/TB (tarif Snowflake on-demand bisa setinggi ini tergantung edisi) — berapa tagihannya sekarang? Itulah kenapa “tahu tarif warehouse-mu” adalah skill.",
      ],
      tasks: [
        { id: "t1", text: "Simpan query BigQuery/Snowflake (dengan QUALIFY) sebagai string ke `query_bq`" },
        { id: "t2", text: "Jalankan padanan sqlite (subquery + ROW_NUMBER) ke `top2` — list of [halaman, rata2 rounded 2]" },
        { id: "t3", text: "Hitung `biaya_full`, `biaya_ramping`, `hemat` (%) untuk tabel 850 GB @ $6,25/TB" },
      ],
      expected: "top halaman: [['/produk', 156.67], ['/checkout', 100.0]] | biaya SELECT * : $5.19 | biaya 2 kolom: $0.86 | hemat: 83.4%",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE klik(id INTEGER PRIMARY KEY, tanggal TEXT, halaman TEXT, durasi_detik INTEGER)\")\ndata = [(1,\"2026-05-01\",\"/home\",45),(2,\"2026-05-01\",\"/produk\",120),(3,\"2026-05-01\",\"/home\",30),(4,\"2026-05-02\",\"/produk\",200),(5,\"2026-05-02\",\"/checkout\",90),(6,\"2026-05-02\",\"/home\",60),(7,\"2026-05-03\",\"/produk\",150),(8,\"2026-05-03\",\"/checkout\",110)]\ncur.executemany(\"INSERT INTO klik VALUES (?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 query dialek BigQuery/Snowflake sebagai teks\nquery_bq =\n\n# t2: padanan sqlite (tanpa QUALIFY): subquery + ROW_NUMBER, ambil 2 teratas\nrows =\ntop2 =\n\n# t3: estimasi biaya — tabel 850 GB, tarif $6,25/TB; ramping = 2 dari 12 kolom\nbiaya_full =\nbiaya_ramping =\nhemat =\nusd = \"$\"\n\nprint(f\"top halaman: {top2} | biaya SELECT * : {usd}{biaya_full} | biaya 2 kolom: {usd}{biaya_ramping} | hemat: {hemat}%\")\n",
        lockLines: 7,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE klik(id INTEGER PRIMARY KEY, tanggal TEXT, halaman TEXT, durasi_detik INTEGER)\")\ndata = [(1,\"2026-05-01\",\"/home\",45),(2,\"2026-05-01\",\"/produk\",120),(3,\"2026-05-01\",\"/home\",30),(4,\"2026-05-02\",\"/produk\",200),(5,\"2026-05-02\",\"/checkout\",90),(6,\"2026-05-02\",\"/home\",60),(7,\"2026-05-03\",\"/produk\",150),(8,\"2026-05-03\",\"/checkout\",110)]\ncur.executemany(\"INSERT INTO klik VALUES (?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 query dialek BigQuery/Snowflake sebagai teks\nquery_bq = \"SELECT halaman, AVG(durasi_detik) AS rata2 FROM klik GROUP BY halaman QUALIFY ROW_NUMBER() OVER (ORDER BY AVG(durasi_detik) DESC) <= 2\"\n\n# t2: padanan sqlite (tanpa QUALIFY): subquery + ROW_NUMBER, ambil 2 teratas\nrows = cur.execute(\"SELECT halaman, rata2 FROM (SELECT halaman, AVG(durasi_detik) AS rata2, ROW_NUMBER() OVER (ORDER BY AVG(durasi_detik) DESC) AS rn FROM klik GROUP BY halaman) WHERE rn <= 2\").fetchall()\ntop2 = [[r[0], round(r[1], 2)] for r in rows]\n\n# t3: estimasi biaya — tabel 850 GB, tarif $6,25/TB; ramping = 2 dari 12 kolom\nbiaya_full = round(850 / 1024 * 6.25, 2)\nbiaya_ramping = round(850 / 6 / 1024 * 6.25, 2)\nhemat = round((1 - biaya_ramping / biaya_full) * 100, 1)\nusd = \"$\"\n\nprint(f\"top halaman: {top2} | biaya SELECT * : {usd}{biaya_full} | biaya 2 kolom: {usd}{biaya_ramping} | hemat: {hemat}%\")\n",
        checks: [
          { kind: "contains", task: "t1", label: "query_bq memakai QUALIFY", msg: "Dialek BigQuery/Snowflake: filter setelah window function.", name: "query_bq", value: "QUALIFY" },
          { kind: "equal", task: "t2", label: "top2 benar", msg: "/produk 156,67 lalu /checkout 100,0 — sama di semua dialek.", name: "top2", value: [["/produk", 156.67], ["/checkout", 100.0]], tol: 0 },
          { kind: "equal", task: "t3", label: "biaya_full = $5,19", msg: "850/1024 × 6,25 — harga “mengintip” Dimas.", name: "biaya_full", value: 5.19, tol: 0.01 },
          { kind: "equal", task: "t3", label: "biaya_ramping = $0,86", msg: "Seperenam kolom = seperenam byte dipindai.", name: "biaya_ramping", value: 0.86, tol: 0.01 },
          { kind: "equal", task: "t3", label: "hemat = 83,4%", msg: "Kolom eksplisit memangkas 5/6 tagihan.", name: "hemat", value: 83.4, tol: 0.1 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Empat angka: top2, dua biaya, hemat.", pattern: "hemat: 83.4%" },
        ],
      },
      reference: "QUALIFY = filter setelah window (BQ/Snowflake). Biaya dihitung SEBELUM Run, bukan sesudah.",
    },
    {
      id: "lab-partisi",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Simulasi partition pruning",
      prose: [
        "Lab kedua mengukur langsung penghematan partisi. Tabel penjualan: 12 baris, 4 per bulan (Jan–Mar 2026), seolah terpartisi per bulan. Tugasmu: (1) hitung baris yang “dipindai” tanpa filter partisi; (2) dengan filter bulan='2026-02'; (3) persen penghematan + omzet Februari sebagai bonus verifikasi.",
        "Di warehouse nyata, “baris dipindai” = byte dibaca = dolar. Di sini baris adalah proksinya — logikanya identik.",
        "Coba: setelah lolos, ganti filter menjadi WHERE produk='Kopi A' (bukan kolom partisi) — berapa baris dipindai? (12 — semua laci dibuka.) Itulah kegagalan pruning pola #2.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pindai_tanpa` (tanpa filter) dan `pindai_pruned` (filter bulan 2026-02)" },
        { id: "t2", text: "Hitung `hemat_persen` dan `omzet_feb` (SUM omzet Februari)" },
      ],
      expected: "pindai tanpa partisi: 12 baris | dengan pruning: 4 baris | hemat: 66.7% | omzet Feb: 600",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE penjualan(id INTEGER PRIMARY KEY, tanggal TEXT, produk TEXT, omzet INTEGER)\")\ndata = [(1,\"2026-01-05\",\"Kopi A\",100),(2,\"2026-01-12\",\"Teh C\",150),(3,\"2026-01-20\",\"Roti D\",200),(4,\"2026-01-28\",\"Kopi B\",120),(5,\"2026-02-03\",\"Kopi A\",130),(6,\"2026-02-10\",\"Teh C\",170),(7,\"2026-02-17\",\"Roti D\",190),(8,\"2026-02-24\",\"Kopi B\",110),(9,\"2026-03-04\",\"Kopi A\",140),(10,\"2026-03-11\",\"Teh C\",160),(11,\"2026-03-18\",\"Roti D\",180),(12,\"2026-03-25\",\"Kopi B\",210)]\ncur.executemany(\"INSERT INTO penjualan VALUES (?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 baris dipindai tanpa vs dengan filter partisi\npindai_tanpa =\npindai_pruned =\n\n# t2: penghematan + omzet Februari\nhemat_persen =\nomzet_feb =\n\nprint(f\"pindai tanpa partisi: {pindai_tanpa} baris | dengan pruning: {pindai_pruned} baris | hemat: {hemat_persen}% | omzet Feb: {omzet_feb}\")\n",
        lockLines: 7,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE penjualan(id INTEGER PRIMARY KEY, tanggal TEXT, produk TEXT, omzet INTEGER)\")\ndata = [(1,\"2026-01-05\",\"Kopi A\",100),(2,\"2026-01-12\",\"Teh C\",150),(3,\"2026-01-20\",\"Roti D\",200),(4,\"2026-01-28\",\"Kopi B\",120),(5,\"2026-02-03\",\"Kopi A\",130),(6,\"2026-02-10\",\"Teh C\",170),(7,\"2026-02-17\",\"Roti D\",190),(8,\"2026-02-24\",\"Kopi B\",110),(9,\"2026-03-04\",\"Kopi A\",140),(10,\"2026-03-11\",\"Teh C\",160),(11,\"2026-03-18\",\"Roti D\",180),(12,\"2026-03-25\",\"Kopi B\",210)]\ncur.executemany(\"INSERT INTO penjualan VALUES (?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 baris dipindai tanpa vs dengan filter partisi\npindai_tanpa = cur.execute(\"SELECT COUNT(*) FROM penjualan\").fetchone()[0]\npindai_pruned = cur.execute(\"SELECT COUNT(*) FROM penjualan WHERE substr(tanggal,1,7)='2026-02'\").fetchone()[0]\n\n# t2: penghematan + omzet Februari\nhemat_persen = round((1 - pindai_pruned / pindai_tanpa) * 100, 1)\nomzet_feb = cur.execute(\"SELECT SUM(omzet) FROM penjualan WHERE substr(tanggal,1,7)='2026-02'\").fetchone()[0]\n\nprint(f\"pindai tanpa partisi: {pindai_tanpa} baris | dengan pruning: {pindai_pruned} baris | hemat: {hemat_persen}% | omzet Feb: {omzet_feb}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "tanpa filter = 12 baris", msg: "Semua laci dibuka.", name: "pindai_tanpa", value: 12, tol: 0 },
          { kind: "equal", task: "t1", label: "pruning = 4 baris", msg: "Hanya laci Februari.", name: "pindai_pruned", value: 4, tol: 0 },
          { kind: "equal", task: "t2", label: "hemat 66,7%", msg: "Dua pertiga pindaian hilang.", name: "hemat_persen", value: 66.7, tol: 0.05 },
          { kind: "equal", task: "t2", label: "omzet Feb = 600", msg: "130+170+190+110.", name: "omzet_feb", value: 600, tol: 0 },
          { kind: "stdout_matches", task: "t2", label: "laporan tercetak", msg: "Empat angka: pindaian, pruning, hemat, omzet.", pattern: "omzet Feb: 600" },
        ],
      },
      reference: "Pruning = hanya laci yang difilter yang dibuka. Filter di kolom non-partisi = semua laci.",
    },
    {
      id: "chart-biaya",
      eyebrow: "Langkah 8 · Chart",
      title: "Tiga tagihan, satu hasil",
      prose: [
        "Chart di bawah memvisualkan rumus Langkah 4 untuk satu query atas tabel 850 GB (tarif $6,25/TB): SELECT * ($5,19), 2 kolom eksplisit ($0,86), dan 2 kolom + filter satu partisi dari tiga ($0,29).",
        "Cara membaca: sumbu Y = dolar AS per satu eksekusi query; tiap batang = satu pola penulisan.",
        "Interpretasi: batang pertama 18× lipat dari batang ketiga — untuk HASIL YANG SAMA. Pelajaran chart: biaya warehouse bukan sifat query (“query berat”), melainkan sifat PENULISAN (kolom × partisi × filter). Analis yang sama, data yang sama, tiga tagihan berbeda — satu-satunya yang berubah adalah disiplin menulis. Inilah kenapa FinOps menelepon Dimas, bukan menelepon database-nya.",
      ],
      figure: {
        svg: BIAYA_SVG,
        alt: "Diagram batang biaya: SELECT bintang 5,19 dolar; 2 kolom 0,86; plus partisi 0,29.",
        caption: "Satu query, tiga penulisan: $5,19 vs $0,86 vs $0,29. Biaya = sifat penulisan, bukan sifat query.",
      },
      tasks: [],
      reference: "18× selisih dari disiplin menulis. FinOps menelepon analisnya, bukan databasenya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Empat skenario warehouse",
      prose: [
        "Skenario 1 — Migrasi 200 query dari Postgres ke BigQuery, deadline 2 minggu. → Terjemahkan pola dialek-spesifik dulu (QUALIFY, integer division, fungsi tanggal) — 80% query ANSI jalan langsung. Alasan: 20% yang menjebak ditemukan di awal, bukan di production.",
        "Skenario 2 — Dashboard harian atas tabel 2 TB; tagihan membengkak. → Kolom eksplisit + filter partisi tanggal + pertimbangkan tabel agregat materialized. Alasan: tiga tuas rumus — masing-masing memangkas kelipatan.",
        "Skenario 3 — Event tracking dengan 40 atribut baru per kuartal. → Tampung sebagai VARIANT/JSON di staging, promosikan atribut populer jadi kolom di mart (pola lesson C24). Alasan: fleksibel di hulu, cepat di hilir.",
        "Skenario 4 — Query analitik yang sama dijalankan 50× sehari oleh banyak analis. → Materialkan hasilnya sebagai tabel agregat terjadwal (bukan view). Alasan: membayar komputasi 1× sehari, bukan 50× — view mengulang pindaian tiap dibuka.",
        "Aturan praktis 10 detik: sebutkan dialeknya; hitung byte SEBELUM Run; filter di kolom partisi yang telanjang; yang sering dibaca = kolom nyata; yang diulang 50× = materialkan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengandalkan view untuk “menghemat” — view di warehouse cloud BUKAN tabel tersimpan; tiap query atas view mengulang SELURUH komputasi + pindaian di baliknya. View = singkatan penulisan, bukan penghematan. Penghematan = tabel materialized yang terjadwal.",
      },
      reference: "View = singkatan, bukan hemat. Ulang 50×/hari = materialkan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Tagihan dashboard $900/bulan: bedah dan selamatkan",
      prose: [
        "Skenario (sintetis, angka konkret): dashboard direksi di-refresh 4× sehari; tiap refresh menjalankan SELECT * atas tabel 1,2 TB tanpa filter partisi. Hitungan: 4 × 1,2 TB × 30 hari = 144 TB/bulan × $6,25 = $900/bulan — untuk SATU dashboard. FinOps meminta tagihan turun 90% tanpa mengubah angka dashboard.",
        "Pertanyaan analisis: (1) Identifikasi 3 pemborosan dalam pola query itu. (2) Hitung tagihan setelah tiap perbaikan. (3) Apa risikonya bila hanya “mengurangi frekuensi refresh” sebagai solusi?",
        "Pembahasan: (1) Tiga pemborosan: (a) SELECT * — dashboard hanya butuh 3 dari 18 kolom (f_kolom = 1/6); (b) tanpa filter partisi — dashboard hanya menampilkan 7 hari terakhir dari 2 tahun data (f_partisi ≈ 7/730 ≈ 1/104); (c) refresh 4× sehari atas data yang berubah 1× sehari. (2) Hitungan: setelah (a): $900/6 = $150. Setelah (a)+(b): $150/104 ≈ $1,44 — turun 99,8%. Bahkan hanya (a) saja sudah memenuhi target 90%. (3) Risiko mengurangi frekuensi: angka basi untuk keputusan — mengorbankan kebenaran demi biaya, urutan yang salah. Perbaiki PENULISAN dulu (murah, angka tetap segar), frekuensi terakhir.",
        "Kaitan ke karier: “menurunkan tagihan dashboard 99% tanpa mengubah angka” adalah cerita yang membuat FinOps dan hiring manager sama-sama tersenyum — ia membuktikan kamu berpikir dalam byte, bukan sekadar baris.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tagihan cloud yang tak terkendali adalah risiko operasional yang nyata — dan “solusi” tercepat (kurangi refresh, hapus histori) sering mengorbankan kualitas keputusan. Disiplin penulisan query adalah kontrol biaya yang tidak mengorbankan kebenaran.",
      },
      reference: "900 → 150 → 1,44: kolom, partisi, lalu frekuensi. Jangan korbankan kesegaran demi biaya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Dialek: kuasai pola (filter-setelah-window), bukan hafalan sintaks; waspadai QUALIFY, integer division, fungsi tanggal.",
        "Biaya = byte dipindai × tarif; LIMIT tidak menghemat; tiga tuas: kolom eksplisit, filter partisi, materialisasi.",
        "Partition pruning: hanya laci yang difilter yang dibuka — filter harus di kolom partisi yang telanjang.",
        "Semi-structured (VARIANT/JSON): tampung fleksibel di hulu, sajikan kaku (kolom) di hilir.",
        "View = singkatan penulisan, bukan penghematan; query yang diulang puluhan kali = materialkan.",
      ],
      next: {
        label: "Stored Procedure, Function & Trigger",
        href: "/learn/c26-stored-procedure",
      },
      quiz: [
        {
          q: "Dimas menjalankan SELECT * FROM clickstream LIMIT 10 di BigQuery (tabel 850 GB). Berapa byte dipindai?",
          options: [
            { text: "Tetap ~850 GB (semua kolom, semua baris) — LIMIT hanya memangkas baris keluaran", why: "Benar: inilah twist cerita — $5,31 untuk 10 baris. LIMIT bukan rem tagihan.", correct: true },
            { text: "~10 baris × ukuran baris — hanya yang ditampilkan", why: "Salah: justru asumsi Dimas yang salah — biaya dihitung dari yang DIPINDAI, bukan yang ditampilkan." },
            { text: "0 byte — LIMIT 10 dioptimalkan menjadi sampling", why: "Salah: tidak ada sampling otomatis; mesin tetap memindai penuh lalu mengambil 10." },
            { text: "Tergantung kecepatan internet Dimas", why: "Salah: biaya warehouse tidak ada hubungannya dengan koneksi analis — murni byte dipindai × tarif." },
          ],
        },
        {
          q: "Query “2 halaman teratas” ditulis dengan QUALIFY di BigQuery. Padanannya di Postgres/sqlite?",
          options: [
            { text: "Subquery: hitung window function di dalam, filter rn <= 2 di luar", why: "Benar: persis lab 1 — pola “filter setelah window” diterjemahkan ke dua level karena tanpa QUALIFY.", correct: true },
            { text: "WHERE ROW_NUMBER() ... <= 2 langsung — sama saja", why: "Salah: window function tidak boleh di WHERE di dialek tanpa QUALIFY — error sintaks." },
            { text: "GROUP BY halaman HAVING COUNT(*) <= 2", why: "Salah: HAVING memfilter agregat, bukan peringkat window — menjawab pertanyaan yang berbeda." },
            { text: "Tidak bisa — hanya BigQuery yang mampu", why: "Salah: semua warehouse modern punya window function; yang beda hanya sintaks filter-nya." },
          ],
        },
        {
          q: "Tabel terpartisi per bulan. Query WHERE produk = 'Kopi A' (tanpa filter tanggal) memindai?",
          options: [
            { text: "Semua partisi — filter bukan di kolom partisi sehingga pruning gagal", why: "Benar: pola kegagalan #2 Langkah 4 — arsiparis tidak bisa memilih laci tanpa tanggal.", correct: true },
            { text: "Hanya partisi yang mengandung 'Kopi A'", why: "Salah: mesin tidak tahu isi tiap laci tanpa membukanya — partisi dipilih BERDASARKAN kolom partisi." },
            { text: "Tidak ada — query ditolak karena tidak memakai partisi", why: "Salah: query tetap jalan (dan tetap ditagih penuh) — tidak ada penolakan otomatis." },
            { text: "Hanya 1 baris — produk adalah kunci unik", why: "Salah: produk bukan kunci unik tabel penjualan; dan pruning tidak bekerja seperti itu." },
          ],
        },
        {
          q: "Tabel 850 GB, 12 kolom. Query butuh 2 kolom. Estimasi penghematan vs SELECT *?",
          options: [
            { text: "~83% — byte dipindai proporsional kolom: $5,19 → $0,86", why: "Benar: angka lab 1 — 2/12 kolom ≈ 1/6 pindaian. Columnar storage membuat ini nyata.", correct: true },
            { text: "~0% — mesin membaca seluruh baris fisik", why: "Salah: itu logika row-store lawas; warehouse cloud kolumnar hanya membaca kolom yang diminta." },
            { text: "100% — query 2 kolom gratis", why: "Salah: tidak ada yang gratis — hanya lebih murah proporsional." },
            { text: "~50% — setengah kolom setengah harga (aturan praktis)", why: "Salah: bukan “aturan setengah” — proporsinya mengikuti jumlah kolom: 2/12 ≈ 17% dari biaya." },
          ],
        },
        {
          q: "Event tracking dengan atribut baru tiap sprint. Strategi penyimpanan yang profesional?",
          options: [
            { text: "Tampung sebagai VARIANT/JSON di staging; promosikan atribut populer jadi kolom bertipe di mart", why: "Benar: Langkah 5 — fleksibel di hulu (tak perlu ALTER tiap sprint), cepat di hilir.", correct: true },
            { text: "ALTER TABLE tiap sprint menambah kolom baru", why: "Salah: bisa, tetapi migrasi tiap sprint = beban operasional; dan atribut musiman mencemari skema." },
            { text: "Simpan SEMUA sebagai JSON selamanya — paling fleksibel", why: "Salah: mitos Langkah 5 — tanpa tipe/index, query lambat + tagihan pindaian raksasa." },
            { text: "Buat tabel baru tiap sprint", why: "Salah: fragmentasi skema — query lintas sprint menjadi mustahil tanpa UNION puluhan tabel." },
          ],
        },
        {
          q: "Satu query agregat dijalankan 50× sehari oleh banyak analis. Solusi biaya terbaik?",
          options: [
            { text: "Materialkan hasilnya sebagai tabel terjadwal 1× sehari", why: "Benar: membayar komputasi 1×, bukan 50× — skenario 4 peta keputusan.", correct: true },
            { text: "Bungkus sebagai view agar “tersimpan”", why: "Salah: view bukan penyimpanan — tiap akses mengulang komputasi + pindaian penuh." },
            { text: "Minta analis bergantian menjalankan", why: "Salah: mengorbankan produktivitas manusia demi menghemat mesin — urutan yang salah." },
            { text: "Naikkan tier warehouse agar lebih cepat", why: "Salah: lebih cepat ≠ lebih murah — di banyak model tarif, tier lebih tinggi = tarif per byte lebih mahal." },
          ],
        },
      ],
    },
  ],
};
