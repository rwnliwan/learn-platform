import type { V2Lesson } from "../lib/types";

// ── Figure: jam maintenance per tahun — query manual vs view ─────────────
const MAINT_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang jam maintenance laporan per tahun: query disalin manual vs view terpusat">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">10</text><text x="54" y="139">20</text>
<text x="54" y="99">30</text><text x="54" y="59">40 jam</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="130" y="176" width="60" height="40" fill="var(--chart-text)" opacity="0.55"/>
<text x="160" y="168" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">10</text>
<text x="160" y="232" text-anchor="middle" fill="var(--text)">tanpa view</text>
<rect x="250" y="200" width="60" height="16" fill="var(--c1)" opacity="0.9"/>
<text x="280" y="192" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">3</text>
<text x="280" y="232" text-anchor="middle" fill="var(--text)">dengan view</text>
<rect x="370" y="96" width="60" height="120" fill="var(--c2)" opacity="0.85"/>
<text x="400" y="88" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">32</text>
<text x="400" y="232" text-anchor="middle" fill="var(--text)">tanpa view</text>
<text x="400" y="246" text-anchor="middle" font-size="10" fill="var(--text-muted)">+ 1 insiden</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="130" y="30">kiri: definisi berubah 1x/tahun · kanan: definisi berubah 3x/tahun (1x menimbulkan insiden angka-beda)</text>
</g>
</svg>`;

const C19_SCHEMA = `CREATE TABLE penjualan (
  id INTEGER PRIMARY KEY,
  tanggal TEXT,
  kode_produk TEXT,
  qty INTEGER,
  harga INTEGER
);
CREATE TABLE produk (
  kode_produk TEXT PRIMARY KEY,
  nama TEXT,
  kategori TEXT,
  hpp INTEGER
);
CREATE VIEW v_omzet_bulanan AS
SELECT substr(tanggal, 1, 7) AS bulan,
       SUM(qty * harga) AS omzet,
       COUNT(*) AS n_transaksi
FROM penjualan
GROUP BY substr(tanggal, 1, 7);
CREATE VIEW v_margin_kategori AS
SELECT pr.kategori AS kategori,
       SUM((j.harga - pr.hpp) * j.qty) * 1.0 / SUM(j.harga * j.qty) AS margin
FROM penjualan j
JOIN produk pr ON j.kode_produk = pr.kode_produk
GROUP BY pr.kategori;`;

const C19_SEED = `INSERT INTO penjualan VALUES (1, '2026-01-05', 'P1', 120, 18000);
INSERT INTO penjualan VALUES (2, '2026-01-12', 'P2', 200, 15000);
INSERT INTO penjualan VALUES (3, '2026-01-20', 'P3', 150, 12000);
INSERT INTO penjualan VALUES (4, '2026-02-03', 'P1', 100, 18000);
INSERT INTO penjualan VALUES (5, '2026-02-14', 'P4', 300, 10000);
INSERT INTO penjualan VALUES (6, '2026-02-21', 'P5', 80, 22000);
INSERT INTO penjualan VALUES (7, '2026-03-02', 'P2', 50, 15000);
INSERT INTO penjualan VALUES (8, '2026-03-15', 'P4', 120, 10000);
INSERT INTO produk VALUES ('P1', 'Kopi A', 'Minuman', 11000);
INSERT INTO produk VALUES ('P2', 'Kopi B', 'Minuman', 9000);
INSERT INTO produk VALUES ('P3', 'Teh C', 'Minuman', 7000);
INSERT INTO produk VALUES ('P4', 'Roti D', 'Makanan', 6000);
INSERT INTO produk VALUES ('P5', 'Roti E', 'Makanan', 15000);`;

export const c19: V2Lesson = {
  slug: "c19-views",
  track: "SQL",
  module: "Lanjutan",
  title: "VIEWs: Bangun Sekali, Pakai Selamanya — Abstraksi Query Analitik",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query 40 baris yang disalin 52 kali setahun",
      prose: [
        "Dimas, analis kredit di sebuah multifinance, punya ritual Senin pagi: membuka file query “NPL per segmen” — 40 baris, 3 JOIN, 1 window function — menyalinnya ke query baru, mengganti periode tanggal, menjalankannya, menempel hasilnya ke laporan. 52 Senin setahun, 52 salinan. Suatu Senin di bulan Maret, definisi “macet” berubah (dpd > 90 menjadi dpd > 60 untuk satu segmen). Ia memperbarui salinan minggu itu — tetapi lupa bahwa laporan komparasi kuartalan memakai salinan Januari. Hasilnya: dua laporan resmi dengan dua angka NPL berbeda untuk segmen yang sama. Direksi bertanya angka mana yang benar; jawabannya memalukan — keduanya “benar” menurut salinannya masing-masing.",
        "Twist-nya: Dimas tidak ceroboh — ia korban arsitektur. Selama query inti hidup sebagai teks yang disalin-ulang, setiap perubahan definisi adalah perburuan salinan: berapa banyak copy yang ada, di mana saja, apakah semuanya diperbarui? Pertanyaan yang tidak bisa dijawab dengan teliti — hanya dengan menghilangkan kebutuhan menyalin. Solusinya berumur 50 tahun dan ada di semua database: CREATE VIEW — simpan query-nya SEKALI sebagai objek bernama di database, lalu semua laporan query view itu seperti tabel biasa.",
        "Lesson ini tentang abstraksi tertua dan paling diremehkan di SQL. Bekal ringkas dari lesson SELECT dasar (diringkas agar mandiri): kamu sudah bisa SELECT kolom, FROM tabel, WHERE filter baris, GROUP BY + agregasi (SUM/COUNT/AVG), dan JOIN dua tabel — view tidak menambah sintaks query baru, ia hanya memberi NAMA pada query yang sudah kamu kuasai.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini masalah senior, bukan junior",
        type: "risk",
        body: "Junior menulis query; senior merancang query yang tidak perlu ditulis ulang. Insiden Dimas bukan bug — melainkan tidak adanya abstraksi. Di code review, query analitik yang disalin ke 5 tempat adalah red flag yang sama seriusnya dengan angka yang salah: ia adalah insiden yang belum terjadi.",
      },
      reference: "Salin-ulang query = arsitektur insiden. VIEW = tulis sekali, pakai selamanya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita 52 salinan. (2) Peta ini. (3) Konsep: VIEW — Si Jendela (query tersimpan). (4) Konsep: materialized view — Si Gudang Foto. (5) Konsep: view untuk keamanan — Si Penjaga Pintu. (6) Lab 1: query view omzet bulanan. (7) Lab 2: view berlapis untuk margin kategori. (8) Chart: biaya maintenance dengan vs tanpa view. (9) Peta keputusan: view vs CTE vs materialized vs tabel fisik. (10) Mini-case: migrasi 12 laporan ke view. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) membuat view dengan CREATE VIEW dan meng-query-nya seperti tabel biasa; (2) menjelaskan perbedaan view biasa, materialized view, dan CTE — serta kapan memakai masing-masing; (3) memakai view untuk menyembunyikan kolom sensitif dan menyederhanakan akses analis; (4) mengelola dependensi view (apa yang terjadi saat tabel dasar berubah).",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: SELECT memilih kolom; FROM menunjuk tabel; WHERE menyaring baris; GROUP BY + SUM/COUNT/AVG meringkas per kelompok; JOIN menggabungkan dua tabel lewat kunci. Contoh: SELECT kategori, SUM(qty*harga) FROM penjualan JOIN produk USING(kode_produk) GROUP BY kategori — pola inilah yang akan kita bungkus menjadi view.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart → peta keputusan → mini-case → kuis. Estimasi 50 menit; tiap lab ±8 menit. Catatan lab: editor SQL di lesson ini hanya menerima query BACA (SELECT/WITH) — view-nya sudah dibuatkan di skema lab; tugasmu adalah MEMAKAI view seperti analis profesional, sementara sintaks CREATE VIEW dipelajari lewat contoh di Langkah 3–5.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap view sebagai “nama panggilan” untuk query. Kamu tidak menghafal nomor telepon temanmu — kamu menyimpan namanya di kontak. View melakukan hal yang sama untuk query 40 baris: beri nama sekali, panggil dengan SELECT * FROM nama_view selamanya.",
      ],
      reference: "Tujuan: buat view + bedakan view/materialized/CTE + view untuk keamanan + kelola dependensi.",
    },
    {
      id: "konsep-view",
      eyebrow: "Langkah 3 · Konsep",
      title: "VIEW — Si Jendela (query tersimpan, bukan data tersimpan)",
      prose: [
        "Definisi: VIEW adalah query SELECT yang disimpan sebagai objek bernama di database. Sintaksnya: CREATE VIEW v_omzet_bulanan AS SELECT substr(tanggal,1,7) AS bulan, SUM(qty*harga) AS omzet FROM penjualan GROUP BY 1; — setelah itu, SELECT * FROM v_omzet_bulanan ORDER BY bulan berlaku persis seperti query ke tabel biasa: bisa di-WHERE, di-JOIN, di-GROUP BY lagi.",
        "Kepribadiannya: view adalah jendela — ia tidak menyimpan pemandangan, ia hanya MEMBINGKAI pemandangan yang ada. Setiap kali kamu menengok (query view), database menjalankan query aslinya saat itu juga terhadap data TERKINI. Konsekuensinya dua arah: (1) data selalu segar — tidak ada view basi; (2) tidak ada “tabel view” yang memakan disk — view hanyalah teks query yang disimpan. Analogi Dimas: 52 salinannya adalah 52 foto pemandangan yang bisa basi; satu view adalah satu jendela yang selalu menunjukkan kondisi terkini.",
        "Kapan memakai: query analitik yang dipakai berulang (laporan mingguan/bulanan), query kompleks yang ingin disederhanakan bagi analis junior (mereka query view 1 baris, bukan JOIN 40 baris), dan definisi bisnis yang harus tunggal (definisi “macet” hidup di SATU view — ubah di sana, semua laporan ikut). Tiga operasi perawatannya: CREATE OR REPLACE VIEW untuk memperbarui definisi; DROP VIEW untuk menghapus; dan di banyak database, ALTER VIEW. Perhatian dependensi: view yang query view lain (view berlapis) itu legal dan berguna — tetapi rantai terlalu panjang (>3 lapis) menjadi sulit di-debug; dokumentasikan.",
      ],
      formula: String.raw`\text{total\_baris\_ditulis} = n_{\text{laporan}} \times b_{\text{query}} \quad\text{vs}\quad b_{\text{query}} + n_{\text{laporan}} \times 1`,
      formulaNote: "Simbol: n_laporan = jumlah laporan/salinan per tahun, b_query = jumlah baris query inti. Kiri = tanpa view (salin penuh tiap laporan); kanan = dengan view (tulis query sekali sepanjang b_query baris, tiap laporan hanya 1 baris SELECT dari view). Interpretasi: penghematan = (n−1)×(b−1) baris yang tidak ditulis — dan yang lebih penting, (n−1) peluang inkonsistensi yang hilang. Contoh angka Dimas: n=52, b=40 → tanpa view 2.080 baris ditulis setahun; dengan view 40 + 52 = 92 baris. Penghematan 1.988 baris — tetapi angka sebenarnya adalah NOL insiden definisi-beda.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “VIEW menyimpan hasil query sehingga lebih cepat”",
        type: "pitfall",
        body: "Yang benar: view BIASA tidak menyimpan apa pun — tiap query ke view menjalankan ulang query aslinya. Kalau query aslinya lambat (full scan 100 juta baris), view-nya tetap lambat. Yang menyimpan hasil adalah MATERIALIZED view (Langkah 4) — dua benda berbeda dengan nama mirip. Mengira view mempercepat query adalah miskonsepsi paling umum di interview SQL.",
      },
      hints: [
        "💡 Intuisi jendela: untuk mengingat sifat view, tanyakan “apakah ini jendela atau foto?” Jendela (view biasa) = selalu terkini, tidak memakan tempat, tetapi pemandangannya dihitung ulang tiap ditengok. Foto (materialized) = instan dilihat, tetapi bisa basi.",
      ],
      reference: "VIEW = teks query tersimpan (jendela). Selalu segar, tidak memakan disk, tidak mempercepat.",
    },
    {
      id: "konsep-materialized",
      eyebrow: "Langkah 4 · Konsep",
      title: "Materialized View — Si Gudang Foto (hasil yang disimpan)",
      prose: [
        "Definisi: MATERIALIZED VIEW mengeksekusi query-nya sekali lalu MENYIMPAN hasilnya sebagai tabel fisik. Query ke materialized view membaca hasil simpanan — instan, tanpa menghitung ulang. Harganya: hasil bisa BASI — perlu REFRESH (manual atau terjadwal) agar sinkron dengan tabel dasar. Sintaks (Postgres/DuckDB): CREATE MATERIALIZED VIEW mv_omzet AS SELECT ...; lalu REFRESH MATERIALIZED VIEW mv_omzet;",
        "Kepribadiannya: jika view biasa adalah jendela, materialized view adalah foto panorama yang dicetak dan ditempel di dinding — dilihat dalam sekejap, tetapi memotret kondisi saat diambil. Cocok untuk dashboard direksi yang dibuka 200× sehari dengan query 30 detik: cetak fotonya sekali per jam, semua orang melihat foto yang sama dalam 0,2 detik. Tidak cocok untuk data yang harus real-time (stok gudang live) — foto sejam lalu bisa menyesatkan.",
        "Kapan memakai: query berat (>detik) yang diakses sering dengan toleransi basi (dashboard harian, laporan direksi); agregasi raksasa yang tidak berubah intraday. Kapan JANGAN: data harus segar per menit; tabel dasar berubah sangat sering (refresh lebih mahal daripada query langsung). Catatan jujur untuk lab: SQLite TIDAK punya materialized view bawaan — pola ekuivalennya adalah CREATE TABLE hasil AS SELECT ... + DELETE/INSERT ulang terjadwal, atau pindah ke DuckDB/Postgres. Di lesson ini kamu mempelajari KONSEP-nya agar bisa memilih dengan benar saat memakai database yang mendukungnya.",
      ],
      formula: String.raw`\text{untung} = (t_{\text{query}} - t_{\text{baca}}) \times f_{\text{akses}} - t_{\text{refresh}} \times f_{\text{refresh}}`,
      formulaNote: "Simbol: t_query = waktu query asli, t_baca = waktu baca hasil simpanan (≈0), f_akses = frekuensi dibaca, t_refresh = waktu refresh, f_refresh = frekuensi refresh. Interpretasi: materialized view untung bila penghematan baca (kiri) melebihi biaya refresh (kanan). Contoh angka: query 30 detik dibaca 200×/hari → hemat ≈ 200×30 = 6.000 detik; refresh 30 detik tiap jam (24×) = 720 detik → untung bersih ≈ 5.280 detik/hari (~1,5 jam komputasi). Kalau datanya berubah tiap menit dan harus segar, f_refresh meledak dan keuntungannya negatif — jangan materialize.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Materialized view selalu lebih baik dari view biasa”",
        type: "pitfall",
        body: "Yang benar: ia menukar kecepatan dengan kesegaran. Dashboard stok gudang yang memakai foto sejam lalu bisa menjual barang yang sudah habis. Aturan: toleransi basi harus ditulis EKSPLISIT (“data per jam 07:00”) di dashboard — analis yang menampilkan foto tanpa label waktu sedang berbohong dengan visual.",
      },
      hints: [
        "💡 Intuisi foto: sebelum membuat materialized view, tulis di kertas: “data ini boleh basi maksimal ___”. Kalau jawabannya “tidak boleh basi”, berhentilah — itu bukan kandidat materialize. Kalau “1 jam”, kamu baru saja menentukan jadwal refresh-nya.",
      ],
      reference: "Materialized = hasil disimpan, instan, bisa basi. Untung bila hemat-baca > biaya-refresh. SQLite: pakai CREATE TABLE AS.",
    },
    {
      id: "konsep-keamanan",
      eyebrow: "Langkah 5 · Konsep",
      title: "View untuk Keamanan — Si Penjaga Pintu",
      prose: [
        "Definisi: view bisa menyembunyikan kolom/baris sensitif — analis diberi akses ke VIEW, bukan ke tabel aslinya. Contoh: CREATE VIEW v_nasabah_publik AS SELECT id, nama, kota FROM nasabah; — kolom penghasilan dan dpd tidak ada di view, sehingga analis yang query view TIDAK BISA melihatnya bahkan dengan SELECT *. Ditambah GRANT SELECT ON v_nasabah_publik TO analis_junior; — kontrol akses per view, bukan per tabel.",
        "Kepribadiannya: view keamanan adalah penjaga pintu museum — pengunjung boleh mengagumi lukisan di galeri (view), tetapi tidak boleh masuk ke ruang arsip (tabel asli). Beda dengan “tolong jangan SELECT kolom gaji ya” yang mengandalkan kesopanan: penjaga pintu MENEGAKKAN aturan di level database. Ini juga jawaban atas kebutuhan privasi data (mis. analis marketing tidak perlu melihat NIK).",
        "Kapan memakai: kolom sensitif (gaji, NIK, diagnosis) yang tidak relevan untuk sebagian analis; row-level filtering via view (v_transaksi_cabang_jakarta hanya berisi cabang Jakarta — analis cabang tidak bisa mengintip cabang lain); menyederhanakan skema untuk analis junior (view 5 kolom ramah vs tabel 80 kolom menakutkan). Batasnya: view bukan enkripsi — DBA dan pemilik tabel tetap bisa melihat aslinya; dan view tidak menggantikan audit akses.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyembunyikan kolom sensitif dengan “tidak menampilkannya di dashboard” sementara analis tetap punya akses SELECT ke tabel aslinya. Itu seperti menutup lukisan dengan kain tetapi membiarkan pintu arsip terbuka — siapa pun bisa mengintip dengan query langsung. Aturan: sembunyikan di LEVEL AKSES (view + grant), bukan di level tampilan.",
      },
      hints: [
        "💡 Intuisi penjaga: setiap kali ada kolom yang “tidak boleh dilihat tim X”, tanyakan “apakah database MENOLAK query mereka, atau kita hanya BERHARAP mereka tidak query?” Hanya jawaban pertama yang merupakan kontrol keamanan.",
      ],
      reference: "View + GRANT = kontrol akses di level database. Sembunyikan di level akses, bukan level tampilan.",
    },
    {
      id: "lab-view-1",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Query view seperti tabel biasa",
      prose: [
        "Waktunya praktik. Skema lab sudah berisi tabel penjualan dan produk, plus dua view yang sudah dibuatkan: v_omzet_bulanan (bulan, omzet, n_transaksi) dan v_margin_kategori (kategori, margin).",
        "Tugasmu: tampilkan kolom bulan dan omzet dari v_omzet_bulanan, urutkan bulan menaik. Perhatikan: kamu TIDAK menulis GROUP BY sama sekali — view sudah membungkusnya. Itulah abstraksi: analis cukup tahu nama view dan kolomnya.",
        "Coba: setelah lolos, query SELECT * FROM v_omzet_bulanan tanpa ORDER BY — apakah urutannya masih terjamin? (Jawaban: tidak — tanpa ORDER BY, urutan tidak dijamin bahkan dari view. Kebiasaan baik: selalu ORDER BY eksplisit.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis SELECT bulan, omzet FROM v_omzet_bulanan dengan ORDER BY bulan menaik" },
      ],
      sqlLab: {
        task: "Tampilkan kolom bulan dan omzet dari view v_omzet_bulanan, urutkan bulan dari terkecil (ORDER BY bulan). Hanya dua kolom ini.",
        schema: C19_SCHEMA,
        seedData: C19_SEED,
        starter: "SELECT\n",
        solution: "SELECT bulan, omzet FROM v_omzet_bulanan ORDER BY bulan",
        expectedColumns: ["bulan", "omzet"],
        expectedRows: [["2026-01", 6960000], ["2026-02", 6560000], ["2026-03", 1950000]],
        orderMatters: true,
      },
      reference: "View di-query seperti tabel: SELECT kolom FROM nama_view. Abstraksi = GROUP BY-nya tidak ditulis ulang.",
    },
    {
      id: "lab-view-2",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — View berlapis: bertanya pada hasil yang sudah jadi",
      prose: [
        "Lab kedua memakai v_margin_kategori — view yang di dalamnya SUDAH ada JOIN penjualan–produk dan perhitungan margin. Tugasmu: dari view itu, tampilkan kategori dan margin HANYA untuk kategori yang marginnya di bawah 0,39, urutkan margin menaik.",
        "Perhatikan apa yang TIDAK kamu tulis: tidak ada JOIN, tidak ada rumus margin — semua sudah dibungkus view. Inilah rasanya menjadi analis junior yang memakai view buatan senior: pertanyaan bisnis 2 baris, bukan query 15 baris.",
        "Coba: setelah lolos, ubah ambang menjadi 0,40 — kategori apa yang ikut masuk? Lalu tanyakan pada dirimu: bila definisi margin berubah (mis. HPP diganti HPP+overhead), berapa tempat yang harus diubah — query-mu, atau definisi view-nya?",
      ],
      tasks: [
        { id: "t1", text: "Tulis SELECT kategori, margin FROM v_margin_kategori WHERE margin < 0.39 ORDER BY margin" },
      ],
      sqlLab: {
        task: "Dari view v_margin_kategori tampilkan kategori dan margin untuk kategori yang marginnya di bawah 0,39. Urutkan margin menaik (ORDER BY margin).",
        schema: C19_SCHEMA,
        seedData: C19_SEED,
        starter: "SELECT\n",
        solution: "SELECT kategori, margin FROM v_margin_kategori WHERE margin < 0.39 ORDER BY margin",
        expectedColumns: ["kategori", "margin"],
        expectedRows: [["Makanan", 0.37583892617449666]],
        orderMatters: true,
      },
      reference: "View berlapis = bertanya pada hasil jadi. Ubah definisi sekali di view, semua pemakai ikut.",
    },
    {
      id: "chart-maint",
      eyebrow: "Langkah 8 · Chart",
      title: "Membaca biaya maintenance: salinan vs view",
      prose: [
        "Chart di bawah membandingkan jam kerja tahunan untuk memelihara satu laporan yang definisinya berubah — tanpa view (salinan manual) vs dengan view (ubah definisi sekali).",
        "Cara membaca: sumbu Y = jam kerja per tahun; kelompok kiri = definisi berubah 1×/tahun; kelompok kanan = berubah 3×/tahun. Batang abu-abu = tanpa view, batang berwarna = dengan view.",
        "Interpretasi: dengan 1 perubahan/tahun, tanpa view menghabiskan 10 jam (mencari semua salinan, memperbarui, menguji) vs 3 jam dengan view. Dengan 3 perubahan/tahun, tanpa view membengkak ke 32 jam DAN menimbulkan 1 insiden angka-beda (ada salinan yang terlewat) — dengan view tetap ~3 jam per perubahan karena hanya satu tempat yang diubah. Pelajaran chart: biaya salinan tumbuh perkalian (perubahan × salinan), biaya view tumbuh linier (perubahan × 1). Insiden bukan kemungkinan — pada skala cukup besar ia kepastian statistik.",
      ],
      figure: {
        svg: MAINT_SVG,
        alt: "Diagram batang jam maintenance per tahun. Definisi berubah 1x: tanpa view 10 jam vs dengan view 3 jam. Berubah 3x: tanpa view 32 jam + 1 insiden vs dengan view tetap rendah.",
        caption: "Jam maintenance tahunan satu laporan (ilustrasi). Biaya salinan tumbuh perkalian; biaya view tumbuh linier.",
      },
      tasks: [],
      reference: "Tanpa view: biaya = perubahan × salinan. Dengan view: biaya = perubahan × 1.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "View, CTE, materialized, atau tabel fisik?",
      prose: [
        "Lima skenario pemilihan abstraksi query:",
        "Skenario 1 — Query 40 baris dipakai 5 laporan mingguan, data harus terkini. → VIEW biasa. Alasan: tulis sekali, selalu segar, tanpa duplikasi definisi.",
        "Skenario 2 — Query kompleks hanya dipakai di SATU laporan, tidak akan dipakai ulang. → CTE (WITH ...). Alasan: abstraksi sesaat di dalam satu query — membuat view permanen untuk sekali pakai mengotori katalog database.",
        "Skenario 3 — Query 30 detik dibuka 200×/hari di dashboard, data boleh basi 1 jam. → MATERIALIZED VIEW + refresh per jam. Alasan: hemat-baca jauh melebihi biaya-refresh (lihat rumus Langkah 4).",
        "Skenario 4 — Hasil query dipakai sebagai input ETL lanjutan dengan transformasi bertahap. → Tabel fisik (CREATE TABLE AS). Alasan: butuh index sendiri, butuh di-JOIN berkali-kali dalam pipeline — materialized view di banyak database tidak bisa di-index sebebas tabel.",
        "Skenario 5 — View sudah dipakai 10 laporan, lalu seseorang ingin mengubah definisinya. → Ubah dengan CREATE OR REPLACE + umumkan ke semua pemilik laporan + uji. Alasan: kekuatan view (satu definisi) adalah juga risikonya — perubahan definisi merambat ke semua pemakai. Tidak ada perubahan definisi yang “kecil” bila pemakainya banyak.",
        "Aturan praktis 10 detik: dipakai ulang + harus segar → view; sekali pakai → CTE; berat + sering dibaca + boleh basi → materialized; butuh index/pipeline → tabel fisik; ubah definisi view populer → umumkan dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membuat view untuk SETIAP query (“biar rapi”) hingga katalog berisi 300 view yang 250-nya tidak dipakai siapa pun. View yang tidak dipakai adalah utang: ia tetap harus dipahami saat tabel dasar berubah. Aturan: view dibuat karena ADA pemakai berulang, bukan karena query-nya panjang.",
      },
      reference: "Ulang+segar → view; sekali → CTE; berat+sering+basi-ok → materialized; pipeline → tabel fisik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Migrasi 12 laporan ke view dalam 2 minggu",
      prose: [
        "Skenario (sintetis, angka konkret): Divisi analis sebuah bank memiliki 12 laporan mingguan yang semuanya menghitung “NPL per segmen” dengan query yang disalin-ulang (rata-rata 35 baris, 3 JOIN). Audit menemukan 4 varian definisi “macet” hidup bersamaan (dpd>90, dpd>60, dpd>90 tanpa restrukturisasi, dpd>60 khusus segmen mikro). Kamu ditugasi migrasi ke view dalam 2 minggu.",
        "Pertanyaan analisis: (1) Langkah pertama sebelum menulis CREATE VIEW — dan kenapa langkah itu bukan teknis? (2) Rancang 2 view yang menggantikan 12 laporan — apa isi tiap view? (3) Bagaimana mencegah 4 varian definisi muncul lagi 6 bulan kemudian?",
        "Pembahasan: (1) Langkah pertama: menyepakati SATU definisi “macet” dengan pemilik risiko kredit — karena view hanya membungkus definisi; membungkus 4 definisi yang bertengkar menghasilkan 4 view yang bertengkar. Ini keputusan bisnis, bukan teknis. (2) View 1: v_npl_base — query dasar (JOIN + flag macet per definisi resmi + segmen), tanpa agregasi — fondasi mentah yang benar. View 2: v_npl_segmen — agregasi per segmen dari v_npl_base (view berlapis). 12 laporan menjadi SELECT ringan dari v_npl_segmen dengan WHERE periode/segmen berbeda. (3) Pencegahan: (a) definisi resmi ditulis di komentar view + kamus metrik; (b) cabut kebiasaan salin-ulang — laporan baru WAJIB dari view (code review menolak query NPL mentah); (c) satu pemilik view (data steward) yang menyetujui perubahan definisi. Tanpa ketiganya, 6 bulan lagi akan ada 4 varian lagi — kali ini dalam bentuk view.",
        "Kaitan ke karier: “migrasi N laporan ke view + menyatukan definisi” adalah cerita portofolio yang menunjukkan kematangan rekayasa — pewawancara senior langsung paham kamu pernah merasakan sakitnya inkonsistensi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Empat varian definisi “macet” berarti empat angka NPL yang bisa dipilih sesuai kebutuhan narasi — ini risiko integritas laporan keuangan, bukan sekadar inefisiensi. Migrasi ke view adalah kontrol: definisi tunggal yang bisa diaudit, bukan 12 salinan yang bisa dipilih-pilih.",
      },
      reference: "Sepakati definisi dulu (bisnis), baru bungkus (teknis): v_npl_base + v_npl_segmen berlapis.",
    },
    {
      id: "intuisi-view",
      eyebrow: "Langkah 11 · Intuisi",
      title: "View yang bagus membuat definisi bisnis punya satu alamat",
      prose: [
        "Nilai view bukan pada sintaksnya — melainkan pada berhentinya perdebatan definisi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: bila dua laporan beda angka untuk hal yang sama, masalahnya hampir pasti definisi — dan view adalah tempat definisi itu tinggal",
        body: "Setiap organisasi punya “angka yang bertengkar”: NPL versi risk vs NPL versi finance, “pelanggan aktif” versi marketing vs versi produk. Akarnya jarang data — melainkan definisi yang tinggal di kepala masing-masing analis dan disalin dengan variasi kecil. Heuristik senior: definisi bisnis yang dipakai lebih dari satu laporan WAJIB punya satu alamat — view bernama, terdokumentasi, dimiliki seseorang. Begitu definisinya punya alamat, perdebatan berubah dari “angkamu salah” menjadi “definisi di view ini perlu diubah” — dan perubahannya tercatat, bukan tersebar di 52 salinan query. Aturan pilihannya: dipakai 2+ laporan + harus konsisten → view; dipakai sekali → CTE; berat + sering dibaca + boleh basi → materialized. Dan satu kewaspadaan: view tidak memperbaiki definisi yang buruk — ia hanya membuat keburukan itu konsisten. Menyepakati definisinya tetap pekerjaan manusia pertama.",
      },
      reference: "Definisi bersama → satu view; perdebatan angka = perdebatan definisi.",
    },
    {
      id: "view-lanjut",
      eyebrow: "Langkah 12 · View lanjut",
      title: "View yang bisa ditulisi dan siapa yang menjalankannya",
      prose: [
        "View sederhana (satu tabel, tanpa agregat/DISTINCT/GROUP BY) umumnya BISA ditulisi: INSERT/UPDATE/DELETE lewat view diteruskan ke tabel dasar — di Postgres dan SQLite. Ini berguna untuk “jendela tulis terbatas”: v_transaksi_jakarta hanya menampilkan baris Jakarta, dan staf cabang menginput lewat view itu. Tetapi tanpa pengaman, ada lubang: INSERT lewat view dengan kota = 'Bandung' BERHASIL tersimpan ke tabel dasar — lalu “hilang” dari view (tidak memenuhi filternya). Baris hantu: ada di tabel, tak terlihat lewat jendela. Obatnya WITH CHECK OPTION — database menolak tulis yang tidak akan terlihat lewat view. Aturan: setiap view berfilter yang dipakai untuk tulis WAJIB WITH CHECK OPTION; tanpanya kamu membangun pintu yang bisa dilewati tapi tidak terlihat.",
        "View kompleks (JOIN, agregat) bersifat read-only — kecuali kamu memasang INSTEAD OF trigger yang menerjemahkan tulis menjadi operasi ke tabel dasar. Ini escape hatch yang sah (mis. view gabungan yang perlu di-update dari aplikasi lama), tetapi setiap trigger adalah logika tersembunyi: pembaca query tidak melihatnya, dan debugging “kenapa UPDATE view ini mengubah dua tabel” memakan waktu. Pakai hanya bila antarmukanya tidak bisa diubah; bila bisa, tulis ke tabel dasar langsung dan biarkan view untuk baca.",
        "Pertanyaan keamanan yang lebih dalam: DENGAN HAK SIAPA view dijalankan? Dua mode: DEFINER (hak pembuat view — Postgres: SECURITY DEFINER) vs INVOKER (hak yang meng-query — default). Trade-off-nya nyata. DEFINER memungkinkan pola “akses terkontrol”: analis tidak punya akses ke tabel gaji, tetapi boleh query v_gaji_anonym yang berjalan dengan hak pembuatnya — jendela sempit ke data sensitif. Risikonya: view DEFINER yang terlalu luas = jalur eskalasi hak; bila definisinya berubah menjadi menampilkan lebih banyak, semua pemakainya ikut mendapat lebih banyak tanpa sadar. INVOKER lebih aman secara default (tidak ada kejutan hak), tetapi tiap pemakai butuh grant ke tabel dasar — yang mengalahkan tujuan pembatasan.",
        "Aturan keputusan senior: (1) view untuk analis umum → INVOKER + grant minimal ke tabel dasar, atau DEFINER hanya untuk view yang definisinya dikunci dan di-review; (2) view DEFINER wajib tercatat di inventaris akses (siapa pembuatnya, tabel apa yang dibuka) dan di-review berkala — ia adalah pengecualian keamanan, bukan fitur biasa; (3) JANGAN membuat view DEFINER milik akun superuser/admin untuk dipakai luas — kompromi satu view = kompromi seluruh database. Prinsipnya sama seperti sudo: berikan hak minimum, catat pengecualiannya, dan curigai setiap kenyamanan yang menyembunyikan hak akses.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“View keamanan = cukup sembunyikan kolom gaji dari SELECT.” Menyembunyikan kolom di view tidak menghentikan analis yang punya akses ke tabel dasar untuk query langsung — view keamanan hanya bekerja bila akses ke TABEL DASAR dicabut dan satu-satunya jalan adalah lewat view. Keamanan adalah soal hak akses, bukan soal kolom yang ditampilkan.",
      },
      reference: "Tulis lewat view → WITH CHECK OPTION; DEFINER = pengecualian tercatat, bukan default.",
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
        "VIEW = query SELECT tersimpan sebagai objek bernama (jendela, bukan foto): selalu segar, tidak memakan disk, tidak mempercepat query — abstraksi untuk tulis-sekali-pakai-selamanya.",
        "Materialized view = hasil query disimpan fisik: instan dibaca tetapi bisa basi — untung bila hemat-baca melebihi biaya-refresh; labeli waktu foto di dashboard.",
        "View + GRANT = kontrol akses di level database: sembunyikan kolom/baris sensitif dengan menolak query, bukan dengan berharap analis sopan.",
        "Pilih abstraksi: dipakai ulang + segar → view; sekali pakai → CTE; berat + sering dibaca + boleh basi → materialized; pipeline butuh index → tabel fisik.",
        "Perubahan definisi view populer merambat ke semua pemakai — umumkan dan uji dulu; view dibuat karena ada pemakai berulang, bukan karena query-nya panjang.",
      ],
      quiz: [
        {
          q: "Apa yang sebenarnya disimpan oleh VIEW biasa di database?",
          options: [
            { text: "Teks query SELECT-nya saja — datanya dihitung ulang dari tabel dasar setiap kali view di-query", why: "Benar: view = jendela, bukan foto. Inilah kenapa view selalu segar tetapi tidak mempercepat query lambat.", correct: true },
            { text: "Hasil query yang dihitung saat CREATE VIEW", why: "Salah: itu definisi materialized view. View biasa tidak menyimpan hasil apa pun." },
            { text: "Salinan tabel dasar yang disinkronkan otomatis", why: "Salah: tidak ada salinan data. Sinkronisasi otomatis tanpa basi adalah khayalan — yang ada hanya hitung-ulang atau simpan-basi." },
            { text: "Index khusus yang mempercepat query aslinya", why: "Salah: view biasa tidak membuat index dan tidak mengubah rencana eksekusi query aslinya." },
          ],
        },
        {
          q: "Dashboard direksi membuka query 30 detik sebanyak 200×/hari. Data boleh basi 1 jam. Solusi tepat?",
          options: [
            { text: "Materialized view dengan refresh per jam — hemat-baca (200×30 detik) jauh melebihi biaya refresh (24×30 detik)", why: "Benar: inilah rumus Langkah 4 bekerja — untung bersih ~1,5 jam komputasi/hari, dengan label waktu foto di dashboard.", correct: true },
            { text: "View biasa — karena datanya selalu segar", why: "Salah: view biasa tetap menghitung 30 detik tiap dibuka — 200×30 detik = 100 menit komputasi/hari terbuang." },
            { text: "CTE di setiap dashboard", why: "Salah: CTE adalah abstraksi sesaat per query — tidak menyimpan hasil dan tidak membantu performa sama sekali." },
            { text: "Menyalin hasil query ke spreadsheet tiap pagi", why: "Salah: kembali ke arsitektur salinan manual — rapuh, tidak teraudit, dan tidak skalabel." },
          ],
        },
        {
          q: "Analis marketing tidak boleh melihat kolom gaji. Kontrol yang benar?",
          options: [
            { text: "Buat view tanpa kolom gaji + GRANT SELECT hanya pada view — database menolak query langsung ke tabel asli", why: "Benar: kontrol di level akses (penjaga pintu), bukan level tampilan. Analis tidak bisa mengintip walau menulis query manual.", correct: true },
            { text: "Minta analis berjanji tidak SELECT kolom gaji", why: "Salah: keamanan berbasis harapan bukan keamanan. Satu query penasaran membocorkan semuanya." },
            { text: "Sembunyikan kolom gaji di dashboard", why: "Salah: dashboard hanya tampilan — analis tetap bisa query tabel asli langsung." },
            { text: "Hapus kolom gaji dari tabel", why: "Salah: kolom itu dibutuhkan tim HR/payroll. Solusinya bukan menghapus data, melainkan membatasi siapa melihatnya." },
          ],
        },
        {
          q: "Query kompleks hanya dipakai SATU kali untuk laporan ad-hoc. Abstraksi yang tepat?",
          options: [
            { text: "CTE (WITH ...) di dalam query itu — abstraksi sesaat tanpa mengotori katalog database", why: "Benar: view permanen untuk sekali pakai adalah utang katalog. CTE memberi keterbacaan tanpa objek permanen.", correct: true },
            { text: "Buat view permanen agar \"rapi\"", why: "Salah: 300 view tak terpakai = 300 utang yang harus dipahami saat tabel berubah." },
            { text: "Materialized view agar cepat", why: "Salah: overhead penyimpanan + refresh untuk sekali pakai tidak pernah terbayar." },
            { text: "Simpan query di file teks pribadi", why: "Salah: ini salinan manual versi Dimas — tidak teraudit, tidak terbagi, tidak terjaga." },
          ],
        },
        {
          q: "Seseorang mengusulkan mengubah definisi view v_npl_segmen yang dipakai 10 laporan. Respons profesional?",
          options: [
            { text: "Umumkan ke semua pemilik laporan, uji dampaknya, baru CREATE OR REPLACE — karena perubahan merambat ke semua pemakai", why: "Benar: kekuatan view (satu definisi) = risikonya. Tidak ada perubahan definisi yang kecil bila pemakainya banyak.", correct: true },
            { text: "Langsung ubah — kan cuma satu tempat", why: "Salah: \"cuma satu tempat\" justru masalahnya — satu perubahan mengubah 10 laporan sekaligus, mungkin tanpa sepengetahuan pemiliknya." },
            { text: "Buat view baru v_npl_segmen_v2 dan biarkan yang lama", why: "Salah: tanpa migrasi + sunset plan, ini melahirkan 2 definisi yang hidup berdampingan — kembali ke 4 varian definisi." },
            { text: "Tolak — definisi view tidak boleh berubah selamanya", why: "Salah: definisi bisnis memang berubah; yang dibutuhkan adalah proses perubahan yang aman, bukan pembekuan." },
          ],
        },
      ],
    },
  ],
};
