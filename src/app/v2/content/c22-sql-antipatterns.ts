import type { V2Lesson } from "../lib/types";

// ── Figure: waktu query SARGable vs non-SARGable per ukuran data ──────────
const WAKTU_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang waktu query per ukuran data: WHERE tanggal langsung vs WHERE YEAR(tanggal)">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">60</text><text x="54" y="139">120</text>
<text x="54" y="99">180</text><text x="54" y="59">240 dtk</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="110" y="208" width="56" height="8" fill="var(--c1)" opacity="0.9"/>
<text x="138" y="204" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">0,2</text>
<rect x="110" y="196" width="56" height="12" fill="var(--c2)" opacity="0.85"/>
<text x="138" y="192" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">0,8</text>
<text x="138" y="232" text-anchor="middle" fill="var(--text)">100 rb</text>
<rect x="242" y="204" width="56" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="270" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">1,1</text>
<rect x="242" y="136" width="56" height="80" fill="var(--c2)" opacity="0.85"/>
<text x="270" y="128" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">38</text>
<text x="270" y="232" text-anchor="middle" fill="var(--text)">1 jt</text>
<rect x="374" y="196" width="56" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="402" y="188" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">9</text>
<rect x="374" y="56" width="56" height="160" fill="var(--c2)" opacity="0.85"/>
<text x="402" y="48" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">230</text>
<text x="402" y="232" text-anchor="middle" fill="var(--text)">10 jt</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="110" y="244" width="12" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="128" y="254" fill="var(--text)">SARGable (index dipakai)</text>
<rect x="290" y="244" width="12" height="12" fill="var(--c2)" opacity="0.85"/>
<text x="308" y="254" fill="var(--text)">fungsi di kolom (full scan)</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">query sama: transaksi tahun 2026 · baris = ukuran tabel (ilustrasi)</text>
</g>
</svg>`;

const C22_SCHEMA = `CREATE TABLE transaksi (
  id INTEGER PRIMARY KEY,
  tanggal TEXT,
  nasabah_id TEXT,
  produk TEXT,
  qty INTEGER,
  harga INTEGER,
  diskon INTEGER,
  channel TEXT
);
CREATE TABLE nasabah (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kota TEXT,
  penghasilan REAL
);`;

const C22_SEED = `INSERT INTO transaksi VALUES (1, '2026-01-05', 'N1', 'Kopi A', 120, 18000, 0, 'mobile');
INSERT INTO transaksi VALUES (2, '2026-01-06', 'N2', 'Kopi B', 200, 15000, 500, 'web');
INSERT INTO transaksi VALUES (3, '2026-01-07', 'N3', 'Teh C', 150, 12000, 0, 'mobile');
INSERT INTO transaksi VALUES (4, '2026-01-08', 'N1', 'Roti D', 300, 10000, 1000, 'toko');
INSERT INTO transaksi VALUES (5, '2026-01-09', 'N4', 'Roti E', 80, 22000, 0, 'web');
INSERT INTO transaksi VALUES (6, '2026-01-10', 'N2', 'Kopi A', 50, 18000, 0, 'mobile');
INSERT INTO transaksi VALUES (7, '2026-01-11', 'N5', 'Snack F', 500, 5000, 200, 'toko');
INSERT INTO transaksi VALUES (8, '2026-01-12', 'N3', 'Kopi B', 10, 15000, 0, 'web');
INSERT INTO nasabah VALUES (1, 'Andi', 'Jakarta', 8500000);
INSERT INTO nasabah VALUES (2, 'Budi', 'Bandung', 12000000);
INSERT INTO nasabah VALUES (3, 'Citra', 'Jakarta', NULL);
INSERT INTO nasabah VALUES (4, 'Dewi', 'Surabaya', 15000000);
INSERT INTO nasabah VALUES (5, 'Eko', 'Jakarta', NULL);
INSERT INTO nasabah VALUES (6, 'Fitri', 'Bandung', 9200000);
INSERT INTO nasabah VALUES (7, 'Gilang', 'Medan', 7800000);
INSERT INTO nasabah VALUES (8, 'Hesti', 'Jakarta', 11000000);`;

export const c22: V2Lesson = {
  slug: "c22-sql-antipatterns",
  track: "SQL",
  module: "Lanjutan",
  title: "Antipola SQL: Kesalahan yang Tak Dilakukan Senior — N+1, SELECT *, Fungsi di Kolom Terindeks",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard 2 detik yang menjadi 4 menit dalam semalam",
      prose: [
        "Dashboard NPL direksi sudah berjalan 2 tahun: query 2 detik, semua orang bahagia. Lalu perusahaan akuisisi dua portofolio baru — data 10× lipat dalam semalam. Pagi harinya dashboard memuat 4 menit; direksi menelepon dengan nada yang tidak bersahabat. Tim memeriksa: query-nya TIDAK BERUBAH — WHERE YEAR(tanggal) = 2026 AND status = 'macet', sama persis seperti 2 tahun lalu. Yang berubah hanya skalanya.",
        "Root cause-nya dua antipattern klasik yang tidur selama 2 tahun: (1) YEAR(tanggal) — fungsi di atas kolom terindeks — membuat database tidak bisa memakai index tanggal, sehingga tiap query memindai SEMUA baris (pada 100 ribu baris tidak terasa; pada 10 juta baris terasa seperti 4 menit); (2) SELECT * menarik 80 kolom padahal dashboard hanya butuh 6 — transfer dan memori 13× lipat dari kebutuhan.",
        "Twist-nya: query itu “benar” selama 2 tahun — lolos semua review, semua test. Antipattern adalah bom waktu: ia tidak meledak saat ditulis, melainkan saat skala tiba. Senior dibedakan dari junior bukan karena query-nya lebih canggih, melainkan karena query-nya tidak menyimpan bom waktu. Lesson ini — terinspirasi buku More SQL Antipatterns (2026) — tentang tiga bom paling umum: SELECT *, fungsi di kolom terindeks, dan N+1. Bekal ringkas dari tiga lesson prasyarat (diringkas agar mandiri): dari JOIN — menggabungkan tabel lewat kunci; dari window function — ROW_NUMBER() OVER (PARTITION BY ...); dari index & EXPLAIN — index mempercepat pencarian seperti indeks buku, dan EXPLAIN QUERY PLAN menunjukkan apakah index dipakai.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini materi senior-level",
        type: "risk",
        body: "Antipattern tidak merusak kemarin — ia merusak saat akuisisi, saat promo 12.12, saat akhir tahun fiskal. Momen ketika query melambat 100× selalu bertepatan dengan momen ketika perusahaan paling butuh angkanya. Menulis SQL tanpa antipattern adalah asuransi yang preminya dibayar sekali (saat menulis) dan klaimnya tidak pernah diharapkan.",
      },
      reference: "Antipattern = bom waktu skala. Benar hari ini ≠ aman saat data 10× lipat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita dashboard 4 menit. (2) Peta ini. (3) Konsep: SELECT * — Si Serakah. (4) Konsep: fungsi di kolom terindeks — Si Penyamar (SARGable). (5) Konsep: N+1 — Si Penanya Berulang. (6) Lab 1: kolom eksplisit vs SELECT *. (7) Lab 2: jebakan COUNT(*) vs COUNT(kolom) dengan NULL. (8) Chart: SARGable vs non-SARGable per skala. (9) Peta keputusan: lima skenario anti-bom. (10) Mini-case: audit query dashboard direksi. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menulis SELECT dengan kolom eksplisit dan menjelaskan biaya SELECT *; (2) menulis kondisi WHERE yang SARGable (ramah index) dan mengenali pola non-SARGable; (3) mengenali pola N+1 di kode aplikasi dan menulis ulang dengan JOIN/agregasi; (4) memakai EXPLAIN QUERY PLAN untuk memverifikasi index dipakai.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: JOIN menggabungkan dua tabel lewat kunci (ON a.id = b.id); agregasi SUM/COUNT/AVG dengan GROUP BY; index = struktur yang membuat pencarian kolom cepat (seperti indeks di belakang buku); EXPLAIN QUERY PLAN menampilkan rencana eksekusi — baris “USING INDEX” berarti index dipakai, “SCAN” berarti seluruh tabel dipindai.",
        "Rutenya: cerita → peta → tiga antipattern → dua lab → chart skala → peta keputusan → mini-case → kuis. Estimasi 60 menit; tiap lab ±10 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: setiap antipattern punya pola “terlihat benar di kecil, mematikan di besar”. Saat membaca tiap konsep, latih refleks: “bagaimana query ini berperilaku saat tabelnya 100× lipat?” — refleks itulah yang membedakan senior.",
      ],
      reference: "Tujuan: SELECT eksplisit + WHERE SARGable + kenali N+1 + baca EXPLAIN QUERY PLAN.",
    },
    {
      id: "konsep-select-bintang",
      eyebrow: "Langkah 3 · Konsep",
      title: "SELECT * — Si Serakah",
      prose: [
        "Definisi: SELECT * mengambil SEMUA kolom tabel — nyaman saat eksplorasi, berbahaya di produksi. Tiga biayanya: (1) TRANSFER — 80 kolom × 10 juta baris melewati jaringan vs 6 kolom yang dibutuhkan (13× lipat); (2) MEMORI — aplikasi menampung kolom yang tidak dipakai; (3) kerapuhan SKEMA — tambah kolom hari ini (mis. foto_produk BLOB 2 MB), dan semua query SELECT * tiba-tiba 50× lebih berat tanpa ada yang mengubah query-nya.",
        "Kepribadiannya: SELECT * adalah tamu yang menghabiskan seluruh prasmanan padahal hanya lapar satu piring — di acara kecil (tabel 8 kolom, 1.000 baris) tidak ada yang peduli; di resepsi 10.000 tamu (tabel 80 kolom, 10 juta baris) ia membuat dapur kolaps. Lebih licik lagi: ia tamu yang porsinya MEMBESAR SENDIRI setiap kali tuan rumah menambah menu (kolom baru) — tanpa pernah meminta izin.",
        "Kapan memakai: eksplorasi ad-hoc (SELECT * FROM t LIMIT 5 untuk mengintip struktur — boleh, bahkan dianjurkan). Kapan JANGAN: query produksi, view, ETL, dan aplikasi — tulis kolom eksplisit: SELECT id, produk, qty*harga AS total. Bonus senior: kolom eksplisit membuat query TAHAN terhadap perubahan skema (tambah kolom tidak mengubah hasil) dan membuat code review bisa melihat tepat apa yang dipakai. Pengecualian jujur: SELECT COUNT(*) — bintangnya di sini bukan kolom, melainkan “hitung baris”, dan itu idiom yang benar.",
      ],
      formula: String.raw`\text{biaya\_transfer} = n_{\text{baris}} \times k_{\text{kolom}} \times \bar{b}_{\text{kolom}}`,
      formulaNote: "Simbol: n_baris = jumlah baris hasil, k_kolom = jumlah kolom yang diambil, b_kolom = rata-rata byte per kolom. Interpretasi: biaya tumbuh PERKALIAN ketiganya — SELECT * memaksimalkan k_kolom tanpa alasan. Contoh angka: 1 juta baris × 80 kolom × 50 byte = 4 GB transfer; dengan 6 kolom eksplisit = 300 MB. Selisih 3,7 GB per query — dikali 200× dibuka per hari = 740 GB/hari yang sebenarnya tidak dibutuhkan siapa pun.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “SELECT * lebih cepat ditulis, jadi lebih produktif”",
        type: "pitfall",
        body: "Yang benar: menghemat 30 detik menulis, membayar dengan jam debugging + biaya transfer selamanya. Produktivitas diukur dari total biaya hidup query, bukan kecepatan mengetiknya. Analis senior mengetik 6 nama kolom tanpa berpikir dua kali — itu otot, bukan beban.",
      },
      hints: [
        "💡 Intuisi serakah: perlakukan SELECT * seperti memesan “semuanya” di restoran — boleh saat kamu pemilik restoran (eksplorasi tabelmu sendiri, LIMIT 5), tidak boleh saat kamu tamu di acara orang (query produksi atas tabel bersama).",
      ],
      reference: "Produksi = kolom eksplisit, selalu. SELECT * hanya untuk mengintip (LIMIT 5).",
    },
    {
      id: "konsep-sargable",
      eyebrow: "Langkah 4 · Konsep",
      title: "Fungsi di Kolom Terindeks — Si Penyamar (SARGable)",
      prose: [
        "Definisi: kondisi SARGable (Search ARGument ABLE) adalah kondisi yang memungkinkan database memakai index — bentuknya kolom “telanjang” dibandingkan langsung dengan nilai: WHERE tanggal >= '2026-01-01' AND tanggal < '2027-01-01'. Lawannya, non-SARGable: WHERE YEAR(tanggal) = 2026 — fungsi membungkus kolom sehingga database harus menghitung YEAR() untuk SETIAP baris (full scan), karena index menyimpan nilai tanggal asli, bukan hasil fungsinya.",
        "Kepribadiannya: Si Penyamar memakai topeng fungsi — YEAR(tanggal) TERLIHAT seperti “mencari tahun 2026”, tetapi bagi optimizer ia berkata “hitung dulu fungsinya untuk 10 juta baris, baru bandingkan”. Index tanggal menjadi pajangan: database tidak bisa mencari “tahun 2026” di index yang menyimpan “2026-01-05”. Analogi buku: mencari bab berjudul “2026” di indeks buku yang disusun per tanggal lengkap — kamu tetap harus membolak-balik semua halaman.",
        "Kapan waspada — tiga pola non-SARGable paling umum: (1) fungsi di kolom: YEAR(tanggal), UPPER(nama), DATE(waktu); (2) aritmetika di kolom: WHERE harga * 1.1 > 100000 (pindahkan ke WHERE harga > 100000/1.1); (3) LIKE berawalan wildcard: WHERE nama LIKE '%kopi' (index B-tree tidak bisa dipakai untuk pencarian akhiran — butuh trigram/full-text). Perbaikannya selalu sama: biarkan kolom TELANJANG di satu sisi, pindahkan semua komputasi ke sisi nilai. Verifikasi dengan EXPLAIN QUERY PLAN: cari “USING INDEX” (baik) vs “SCAN” (buruk) — jangan percaya insting, baca rencananya.",
      ],
      formula: String.raw`\text{cost}_{\text{scan}} = n \times c \quad\text{vs}\quad \text{cost}_{\text{index}} \approx \log(n) \times c + m \times c`,
      formulaNote: "Simbol: n = total baris tabel, c = biaya per baris, m = baris yang cocok (jauh lebih kecil dari n). Interpretasi: full scan tumbuh LINIER terhadap n (10× data = 10× waktu); index tumbuh LOGARITMIK untuk pencarian + linier hanya terhadap hasil (m). Contoh angka chart: n=10 juta, m=1 juta (satu tahun): scan = 10 juta × c ≈ 230 detik; index ≈ (log + 1 juta) × c ≈ 9 detik. Selisih 25× — dan melebar tiap tahun karena n tumbuh sementara m (satu tahun) relatif tetap.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Database modern cukup pintar untuk memakai index walau ada fungsi”",
        type: "pitfall",
        body: "Yang benar: beberapa database punya function-based/expression index — tetapi itu OPTIMASI LANJUTAN yang harus dibuat eksplisit (CREATE INDEX idx ON t(YEAR(tanggal))), bukan sihir otomatis. Tanpa index ekspresi itu, YEAR(tanggal) = full scan di semua database. Jangan mengandalkan kepintaran yang belum kamu verifikasi dengan EXPLAIN.",
      },
      hints: [
        "💡 Intuisi penyamar: baca WHERE dari sudut pandang index — “bisakah index menjawab ini TANPA menghitung apa pun per baris?” Kalau ada fungsi/aritmetika/wildcard di depan kolom, jawabannya tidak. Tulis ulang hingga kolomnya telanjang.",
      ],
      reference: "Kolom telanjang di satu sisi, komputasi di sisi nilai. Verifikasi: EXPLAIN QUERY PLAN → USING INDEX.",
    },
    {
      id: "konsep-n1",
      eyebrow: "Langkah 5 · Konsep",
      title: "N+1 — Si Penanya Berulang",
      prose: [
        "Definisi: N+1 adalah pola di KODE APLIKASI (bukan di SQL-nya): 1 query mengambil N baris (mis. 100 nasabah), lalu N query susulan — satu per baris — mengambil detail tiap nasabah (saldo, transaksi terakhir). Total: N+1 query, N+1 round-trip jaringan. Pada 100 nasabah tidak terasa; pada 10.000 nasabah = 10.001 query — aplikasi dan database tenggelam dalam overhead koneksi.",
        "Kepribadiannya: Si Penanya Berulang adalah tamu yang bertanya “berapa saldo Andi?” lalu pergi, kembali bertanya “berapa saldo Budi?”, pergi lagi — 10.000× bolak-balik untuk daftar yang bisa ditanyakan SEKALIGUS (“berapa saldo semua nasabah ini?”). Ia lahir dari ORM yang malas (lazy loading): kode terlihat rapi (nasabah.saldo di loop), tetapi di baliknya tiap akses properti = 1 query. Rapi di kode, bencana di jaringan.",
        "Kapan waspada: loop di aplikasi yang di dalamnya ada query/database call; ORM dengan akses relasi di dalam loop; API yang memanggil database per item. Perbaikannya: SATU query dengan JOIN + agregasi menggantikan N+1 — SELECT n.nama, SUM(t.nominal) FROM nasabah n LEFT JOIN transaksi t ON t.nasabah_id = n.id GROUP BY n.nama; — atau eager loading di ORM (preload/include). Tes 10 detik: hitung query yang dieksekusi untuk 1.000 item — bila angkanya ribuan, kamu punya N+1. Catatan: N+1 tidak terlihat di lab SQL (ia pola aplikasi) — ia terlihat di log query database yang tiba-tiba meledak.",
      ],
      formula: String.raw`\text{total\_waktu} = (N+1) \times (t_{\text{query}} + t_{\text{roundtrip}}) \quad\text{vs}\quad 1 \times (t_{\text{query}}' + t_{\text{roundtrip}})`,
      formulaNote: "Simbol: N = jumlah item, t_query = waktu eksekusi satu query kecil, t_roundtrip = latency jaringan per query, t_query' = waktu satu query gabungan (sedikit lebih besar). Interpretasi: N+1 membayar roundtrip N+1 kali — dan roundtrip sering DOMINAN (1 ms × 10.001 = 10 detik hanya untuk bolak-balik, belum hitung query). Contoh angka: N=10.000, t_query=0,5 ms, t_roundtrip=1 ms → N+1 ≈ 15 detik; satu JOIN ≈ 80 ms. Selisih ~190× — dari menghilangkan bolak-balik, bukan dari query yang lebih pintar.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“N+1 hanya masalah ORM, analis SQL tidak perlu tahu.” Salah — analis menulis stored procedure/loop yang sama polanya (cursor loop dengan query di dalam), dan analis yang me-review kode aplikasi harus bisa menunjuknya. N+1 adalah pola PIKIR (tanya satu-satu vs tanya sekaligus), bukan fitur ORM.",
      },
      hints: [
        "💡 Intuisi penanya: setiap kali melihat loop + query, bisikkan “bisakah ini satu query?” Jawabannya hampir selalu ya — dengan JOIN untuk detail, atau GROUP BY untuk agregasi. Database dirancang untuk set, bukan untuk diobrolin satu-satu.",
      ],
      reference: "Loop + query di dalam = N+1. Ganti dengan 1 JOIN/agregasi. Hitung query untuk 1.000 item.",
    },
    {
      id: "lab-kolom",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Jinakkan Si Serakah: kolom eksplisit",
      prose: [
        "Waktunya praktik. Tabel transaksi punya 8 kolom; dashboard hanya butuh 3: id, produk, dan total (qty*harga). Tugasmu: tampilkan 5 transaksi dengan total TERBESAR — hanya 3 kolom itu — urutkan total menurun.",
        "Starter yang diberikan sengaja memakai SELECT * — jalankan dan tekan Periksa untuk melihat pemeriksanya menolak (kolom diharapkan 3, dapat 8). Lalu perbaiki menjadi kolom eksplisit.",
        "Coba: setelah lolos, bayangkan kolom ke-9 foto_produk (BLOB 2 MB) ditambahkan ke tabel — query SELECT *-mu akan menarik 2 MB × 5 baris = 10 MB sia-sia; query eksplisitmu tidak terpengaruh sama sekali. Itulah kerapuhan skema yang dibahas di Langkah 3.",
      ],
      tasks: [
        { id: "t1", text: "Ganti SELECT * menjadi SELECT id, produk, qty*harga AS total; ORDER BY total DESC LIMIT 5" },
      ],
      sqlLab: {
        task: "Tampilkan id, produk, dan total (qty*harga AS total) untuk 5 transaksi dengan total terbesar. HANYA 3 kolom ini — jangan SELECT *. Urutkan total menurun.",
        schema: C22_SCHEMA,
        seedData: C22_SEED,
        starter: "SELECT *\nFROM transaksi\nORDER BY qty * harga DESC\nLIMIT 5",
        solution: "SELECT id, produk, qty*harga AS total FROM transaksi ORDER BY total DESC LIMIT 5",
        expectedColumns: ["id", "produk", "total"],
        expectedRows: [[2, "Kopi B", 3000000], [4, "Roti D", 3000000], [7, "Snack F", 2500000], [1, "Kopi A", 2160000], [3, "Teh C", 1800000]],
        orderMatters: false,
      },
      reference: "SELECT * di starter DITOLAK pemeriksa (8 kolom vs 3). Produksi = kolom eksplisit.",
    },
    {
      id: "lab-count",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Jebakan NULL: COUNT(*) vs COUNT(kolom)",
      prose: [
        "Lab kedua tentang antipattern yang salah ANGKA (bukan sekadar lambat). Tabel nasabah: 8 baris, tetapi 2 di antaranya (Citra, Eko) penghasilannya NULL (belum terisi). Tugasmu: hitung berapa nasabah yang penghasilannya TERISI.",
        "Starter memakai COUNT(*) — ia menghitung BARIS (8), bukan nilai terisi. Tekan Periksa dan lihat ia ditolak: diharapkan 6, dapat 8. Perbaikannya: COUNT(penghasilan) — menghitung nilai NON-NULL saja.",
        "Coba: setelah lolos, tulis SELECT AVG(penghasilan) FROM nasabah — apakah hasilnya memakai pembagi 8 atau 6? (Jawaban: 6 — agregasi mengabaikan NULL. Analis yang tidak tahu ini melaporkan rata-rata yang salah tanpa sadar.)",
      ],
      tasks: [
        { id: "t1", text: "Ganti COUNT(*) menjadi COUNT(penghasilan) AS terisi — hitung nilai non-NULL, bukan baris" },
      ],
      sqlLab: {
        task: "Hitung berapa nasabah yang kolom penghasilannya TERISI (tidak NULL). Tampilkan sebagai satu kolom bernama terisi. Petunjuk: COUNT(*) menghitung baris — bukan itu yang ditanya.",
        schema: C22_SCHEMA,
        seedData: C22_SEED,
        starter: "SELECT COUNT(*) AS terisi FROM nasabah",
        solution: "SELECT COUNT(penghasilan) AS terisi FROM nasabah",
        expectedColumns: ["terisi"],
        expectedRows: [[6]],
        orderMatters: true,
      },
      reference: "COUNT(*) = hitung baris. COUNT(kolom) = hitung nilai non-NULL. Beda 2 di lab ini; beda jutaan di produksi.",
    },
    {
      id: "chart-waktu",
      eyebrow: "Langkah 8 · Chart",
      title: "Membaca bom waktu: kapan antipattern meledak",
      prose: [
        "Chart di bawah membandingkan query yang sama (transaksi tahun 2026) dalam dua penulisan: SARGable (WHERE tanggal >= '2026-01-01' AND tanggal < '2027-01-01' — index dipakai) vs non-SARGable (WHERE YEAR(tanggal) = 2026 — full scan). Tiga ukuran tabel: 100 ribu, 1 juta, 10 juta baris.",
        "Cara membaca: sumbu Y = detik; tiap kelompok = ukuran tabel; batang terang = SARGable, batang gelap = fungsi di kolom.",
        "Interpretasi: pada 100 ribu baris, bedanya belum terasa (0,2 vs 0,8 detik) — di sinilah antipattern lolos review (“kan cepat”). Pada 1 juta: 1,1 vs 38 detik — dashboard mulai dikeluhkan. Pada 10 juta: 9 vs 230 detik — insiden direksi. Pelajaran chart: garis SARGable tumbuh MELAMBAT (logaritmik + hasil), garis non-SARGable tumbuh LINIER (mengikuti n). Keduanya “benar” secara hasil — tetapi hanya satu yang bertahan saat skala tiba. Inilah visual dari bom waktu.",
      ],
      figure: {
        svg: WAKTU_SVG,
        alt: "Diagram batang waktu query: pada 100 rb baris 0,2 vs 0,8 detik; 1 jt baris 1,1 vs 38 detik; 10 jt baris 9 vs 230 detik (SARGable vs fungsi di kolom).",
        caption: "Waktu query SARGable vs non-SARGable per skala (ilustrasi). Antipattern tidak terasa di kecil — mematikan di besar.",
      },
      tasks: [],
      reference: "SARGable tumbuh melambat; non-SARGable tumbuh linier mengikuti n. Bom waktu meledak saat skala tiba.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Lima skenario anti-bom waktu",
      prose: [
        "Lima skenario penulisan query yang aman skala:",
        "Skenario 1 — Butuh 6 kolom dari tabel 80 kolom untuk dashboard produksi. → Kolom eksplisit. Alasan: transfer 13× lebih kecil + tahan tambah kolom.",
        "Skenario 2 — Filter transaksi tahun 2026 pada kolom tanggal terindeks. → WHERE tanggal >= '2026-01-01' AND tanggal < '2027-01-01'. Alasan: kolom telanjang → index dipakai → 9 detik vs 230 detik pada 10 juta baris.",
        "Skenario 3 — Kode aplikasi loop 10.000 nasabah, tiap iterasi query saldo. → Satu query JOIN + GROUP BY (atau eager load ORM). Alasan: 10.001 roundtrip → 1 roundtrip; selisih ~190×.",
        "Skenario 4 — Ragu apakah index dipakai. → EXPLAIN QUERY PLAN; cari USING INDEX. Alasan: jangan percaya insting — baca rencananya. SCAN pada tabel besar = investigasi.",
        "Skenario 5 — Query warisan dengan 3 antipattern sekaligus, deadline besok. → Perbaiki yang MENGUBAH HASIL dulu (COUNT(*)/NULL, JOIN salah), lalu yang performa (SARGable, SELECT *). Alasan: query cepat yang salah angka lebih berbahaya dari query lambat yang benar — urutkan perbaikan berdasarkan risiko, bukan kemudahan.",
        "Aturan praktis 10 detik: kolom eksplisit; kolom telanjang di WHERE; loop + query = N+1 → JOIN; ragu → EXPLAIN; perbaiki hasil-benar dulu, cepat kemudian.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengoptimasi query yang salah angka (“biar cepat dulu”). Kecepatan tidak pernah memperbaiki kebenaran — ia hanya membuat kesalahan tiba lebih cepat. Urutan: benar → aman-skala → cepat. Tidak bisa dinegosiasi.",
      },
      reference: "Benar dulu, aman-skala kedua, cepat ketiga. EXPLAIN untuk ragu; JOIN untuk N+1.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Audit query dashboard direksi: temukan 5 bom",
      prose: [
        "Skenario (sintetis, angka konkret): kamu diminta mengaudit query dashboard direksi sebelum akuisisi (data akan 8× lipat bulan depan). Query-nya (disederhanakan): SELECT * FROM transaksi t JOIN nasabah n ON t.nasabah_id = n.id WHERE YEAR(t.tanggal) = 2026 AND UPPER(n.kota) = 'JAKARTA'; — lalu di aplikasi, untuk tiap baris hasilnya, kode memanggil query lagi untuk mengambil total transaksi nasabah itu setahun. Tabel transaksi: 2 juta baris (akan jadi 16 juta); ada index pada tanggal dan kota.",
        "Pertanyaan analisis: (1) Identifikasi 5 antipattern/bom waktu dalam query + kode itu. (2) Tulis ulang query-nya yang aman. (3) Estimasi dampak tiap perbaikan pada skala 16 juta baris?",
        "Pembahasan: (1) Lima bom: (a) SELECT * — menarik semua kolom dua tabel; (b) YEAR(t.tanggal) — mematikan index tanggal (full scan 16 juta); (c) UPPER(n.kota) — mematikan index kota; (d) N+1 di aplikasi — 1 query per baris hasil (bila 5.000 baris Jakarta = 5.001 query); (e) JOIN tanpa agregasi dulu — mengambil baris detail padahal yang dibutuhkan agregat (implisit dari pola N+1: total per nasabah seharusnya dihitung di query, bukan di aplikasi). (2) Tulis ulang: SELECT n.id, n.nama, SUM(t.qty * t.harga) AS total_2026 FROM transaksi t JOIN nasabah n ON t.nasabah_id = n.id WHERE t.tanggal >= '2026-01-01' AND t.tanggal < '2027-01-01' AND n.kota = 'Jakarta' GROUP BY n.id, n.nama; — kolom eksplisit, kolom telanjang (index dipakai), agregasi di database (N+1 hilang). (3) Dampak: (a) transfer turun ~10×; (b)+(c) scan 16 juta → index seek + baca hasil (~detik vs menit); (d) 5.001 roundtrip → 1; (e) konsisten — total dihitung sekali di database, bukan diulang per baris. Total: dari “menit + risiko timeout” menjadi “detik”.",
        "Kaitan ke karier: “audit query sebelum akuisisi, menemukan 5 antipattern, dashboard selamat” adalah bukti kematangan yang tidak bisa dipalsukan — pewawancara senior akan mengorek detailnya, dan kamu punya semuanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dashboard direksi yang timeout saat akuisisi bukan masalah IT — ia berarti direksi mengambil keputusan akuisisi TANPA angka. Risiko antipattern pada akhirnya adalah risiko keputusan buta di momen kritis. Audit query adalah kontrol risiko yang murah.",
      },
      reference: "Audit = cari SELECT *, fungsi di kolom, N+1. Perbaiki: eksplisit + telanjang + agregasi di DB.",
    },
    {
      id: "intuisi-antipattern",
      eyebrow: "Langkah 11 · Intuisi",
      title: "Antipattern adalah bom waktu: ia meledak saat skala tiba, bukan saat ditulis",
      prose: [
        "Query yang “benar” selama 2 tahun bisa menjadi insiden dalam semalam — bukan karena berubah, melainkan karena datanya berubah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: review query dengan kacamata “bagaimana jika 10× lipat”",
        body: "Setiap query yang lolos review hari ini harus ditanya satu pertanyaan: apa yang terjadi bila datanya 10× lipat semester depan? Fungsi di kolom terindeks: 0,8 detik menjadi 4 menit. OFFSET 100.000: linear memburuk — halaman 1 cepat, halaman 10.000 timeout. SELECT *: kolom BLOB baru membuat transfer meledak. Heuristik senior: pola yang biayanya TUMBUH LEBIH CEPAT dari data (O(n log n) ke atas, atau round-trip per baris) adalah bom waktu; pola yang tumbuh linear atau konstan aman. Dan bom yang paling berbahaya bukan yang lambat — melainkan yang salah ANGKA (COUNT(*) vs COUNT(kolom), duplikat fan-out): query lambat dikeluhkan, query salah angka dipercaya. Urutan perbaikannya selalu: benar dulu, cepat kemudian.",
      },
      reference: "Tanya “bagaimana jika 10×?”; biaya super-linear = bom; perbaiki kebenaran dulu.",
    },
    {
      id: "antipattern-lanjut",
      eyebrow: "Langkah 12 · Antipattern lanjutan",
      title: "Keyset pagination dan EAV: dua bom produksi berikutnya",
      prose: [
        "OFFSET adalah bom waktu pagination: ORDER BY id LIMIT 20 OFFSET 100000 memaksa database membaca + mengurutkan + MEMBUANG 100.000 baris untuk menampilkan 20. Halaman 1 secepat kilat, halaman 5.000 timeout — dan “deep pagination” oleh scraper/bot adalah vektor DoS yang nyata. Obatnya keyset pagination (seek method): WHERE id > ? ORDER BY id LIMIT 20 — melompat langsung ke posisi via index, O(log n) di halaman berapa pun. Syaratnya: kunci urut yang unik dan stabil (id, atau (tanggal, id) untuk tie-break), dan klien menyimpan “kunci terakhir”, bukan “nomor halaman”. Trade-off jujur: keyset tidak bisa “lompat ke halaman 47” dan tidak stabil bila baris disisipkan di tengah (halaman bergeser) — untuk UI “halaman 1–10” biasa, itu acceptable; untuk “lompat ke halaman 47 dari 10.000”, pertimbangkan apakah fitur itu benar-benar dibutuhkan, atau batasi depth (tampilkan 10 halaman pertama + pencarian).",
        "EAV (Entity-Attribute-Value) adalah antipattern skema: satu tabel generik (entity_id, atribut, nilai) untuk “fleksibilitas” — dan neraka untuk query. “Tampilkan nasabah dengan penghasilan > 10jt DAN kota = 'Jakarta'” menjadi self-join per atribut (2 atribut = 2 join; 10 atribut = 10 join), tanpa tipe data (semua TEXT — perbandingan numerik salah), tanpa constraint, tanpa index yang waras. EAV menukar fleksibilitas skema dengan ketidakmungkinan query — dan “kemudahan tambah atribut” dibayar setiap kali seseorang membaca data. Kapan EAV sah? Hampir tidak pernah untuk data analitik; satu-satunya wilayahnya adalah atribut yang benar-benar jarang dibaca dan sangat jarang (data klinis dengan ribuan atribut opsional) — dan bahkan di sana, kolom JSON modern (tipe JSON dengan operator ekstraksi dan index atas ekspresi) hampir selalu lebih baik: tetap fleksibel, tetapi bisa di-index dan di-query tanpa self-join.",
        "Jalan keluar dari EAV yang sudah terlanjur: JANGAN big-bang rewrite — buat view/ tabel pivot yang mematerialkan atribut-atribut yang sering di-query menjadi kolom nyata (perlahan, atribut per atribut, dimulai dari yang paling sering difilter), dan arahkan query baru ke sana. Setiap atribut yang “naik kelas” menjadi kolom mendapat tipe, constraint, dan index-nya kembali. Pola ini — promosikan yang sering dipakai, biarkan yang jarang di EAV/JSON — adalah strategi migrasi yang realistis untuk sistem warisan: bukan kesempurnaan, melainkan perbaikan yang bisa dikirim Senin depan.",
      ],
      tasks: [],
      reference: "OFFSET dalam → keyset (WHERE id > ?); EAV → promosikan atribut populer jadi kolom nyata.",
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
        "SELECT * = Si Serakah: boros transfer + memori + rapuh terhadap tambah kolom — produksi selalu kolom eksplisit; SELECT * hanya untuk mengintip (LIMIT 5).",
        "Fungsi di kolom terindeks = Si Penyamar: YEAR(tanggal)/UPPER(nama) mematikan index → full scan; tulis ulang agar kolom telanjang, verifikasi dengan EXPLAIN QUERY PLAN.",
        "N+1 = Si Penanya Berulang: loop + query per item = ribuan roundtrip; ganti dengan satu JOIN/GROUP BY — database dirancang untuk set.",
        "COUNT(*) menghitung baris, COUNT(kolom) menghitung nilai non-NULL — salah pilih = salah angka, bukan sekadar lambat.",
        "Urutan perbaikan: benar dulu, aman-skala kedua, cepat ketiga — query cepat yang salah angka lebih berbahaya dari query lambat yang benar.",
      ],
      next: { label: "C23 — Dari SQL ke Power BI/Tableau", href: "/v2/learn/c23-sql-ke-bi-tools" },
      quiz: [
        {
          q: "Query SELECT * FROM transaksi (80 kolom) dipakai di dashboard produksi. Risiko terbesar saat skala membesar?",
          options: [
            { text: "Transfer dan memori membengkak (13× dari kebutuhan) + rapuh: kolom baru (mis. BLOB) otomatis terbawa tanpa ada yang mengubah query", why: "Benar: tiga biaya Langkah 3 — transfer, memori, kerapuhan skema. Bom waktu yang meledak saat tabel tumbuh.", correct: true },
            { text: "Query menjadi error saat kolom ditambah", why: "Salah: tidak error — itulah masalahnya. Ia tetap jalan tetapi semakin berat secara diam-diam." },
            { text: "Hasil query menjadi salah (angka berubah)", why: "Salah: SELECT * tidak mengubah kebenaran angka — ia mengubah biaya dan kerapuhan. (Pengecualian: kode yang bergantung urutan kolom.)" },
            { text: "Tidak ada risiko selama database kuat", why: "Salah: “database kuat” bukan strategi — biaya transfer 740 GB/hari sia-sia tetap biaya, sekuat apa pun database." },
          ],
        },
        {
          q: "Kolom tanggal terindeks. Penulisan WHERE yang memakai index?",
          options: [
            { text: "WHERE tanggal >= '2026-01-01' AND tanggal < '2027-01-01' — kolom telanjang dibandingkan langsung dengan nilai", why: "Benar: SARGable — index menyimpan nilai tanggal asli sehingga bisa dipakai. Verifikasi: EXPLAIN menunjukkan USING INDEX.", correct: true },
            { text: "WHERE YEAR(tanggal) = 2026", why: "Salah: fungsi membungkus kolom → full scan. Tampilan sama (“tahun 2026”), rencana eksekusi beda total." },
            { text: "WHERE DATE(tanggal) BETWEEN '2026-01-01' AND '2026-12-31'", why: "Salah: DATE() tetap fungsi di kolom — sama non-SARGable-nya dengan YEAR()." },
            { text: "WHERE tanggal LIKE '2026%'", why: "Salah: LIKE tanpa wildcard depan BISA memakai index di beberapa DB, tetapi ini pola rapuh dan tidak portabel — rentang tanggal eksplisit selalu benar." },
          ],
        },
        {
          q: "Kode aplikasi: for n in nasabah: saldo = query('SELECT ... WHERE id = ?', n.id). Masalah dan solusi?",
          options: [
            { text: "N+1: 10.001 query untuk 10.000 nasabah — ganti satu query JOIN/GROUP BY untuk semua nasabah sekaligus", why: "Benar: ~190× selisih dari menghilangkan roundtrip (Langkah 5). Pola pikir: tanya sekaligus, bukan satu-satu.", correct: true },
            { text: "Tidak masalah — query kecil selalu cepat", why: "Salah: query kecil × 10.000 + 10.000 roundtrip = bencana. “Kecil” tidak menyelamatkan dari perkalian." },
            { text: "Solusinya menambah index pada id", why: "Salah: index mempercepat tiap query kecil tetapi tidak menghilangkan 10.000 roundtrip — mengobati gejala, bukan penyakit." },
            { text: "Solusinya menjalankan loop secara paralel (multithreading)", why: "Salah: paralelisme mempercepat sedikit tetapi database tetap dihantam 10.000 query — bahkan bisa lebih buruk (connection storm)." },
          ],
        },
        {
          q: "Tabel 8 baris, 2 berpenghasilan NULL. Query “berapa nasabah berpenghasilan terisi” yang benar?",
          options: [
            { text: "SELECT COUNT(penghasilan) — menghitung nilai non-NULL = 6", why: "Benar: lab 2 membuktikan — COUNT(*) menjawab 8 (salah untuk pertanyaan ini). Salah pilih fungsi = salah angka.", correct: true },
            { text: "SELECT COUNT(*) — 8", why: "Salah: COUNT(*) menghitung baris, termasuk yang NULL. Menjawab pertanyaan yang berbeda dari yang ditanya." },
            { text: "SELECT SUM(penghasilan) — lalu bagi 8", why: "Salah: SUM mengabaikan NULL tetapi pembagi 8 salah — rata-rata harus dibagi 6. Dua kesalahan sekaligus." },
            { text: "SELECT COUNT(DISTINCT penghasilan)", why: "Salah: DISTINCT menghilangkan duplikat nilai — menghitung nilai UNIK, bukan nilai terisi." },
          ],
        },
        {
          q: "Query warisan punya 3 antipattern: COUNT(*) yang seharusnya COUNT(kolom) [salah angka], SELECT * [boros], YEAR(tanggal) [lambat]. Urutan perbaikan?",
          options: [
            { text: "Betulkan COUNT dulu (kebenaran), lalu YEAR (skala), lalu SELECT * (efisiensi) — benar > aman-skala > cepat", why: "Benar: skenario 5 peta keputusan. Query cepat yang salah angka lebih berbahaya dari query lambat yang benar.", correct: true },
            { text: "SELECT * dulu karena paling mudah", why: "Salah: kemudahan bukan kriteria — risiko yang menentukan urutan." },
            { text: "YEAR dulu karena paling lambat", why: "Salah: kecepatan nomor tiga. Angka yang salah + cepat = keputusan salah yang tiba lebih cepat." },
            { text: "Tidak perlu diperbaiki selama query jalan", why: "Salah: “jalan” bukan “benar” bukan “aman”. Tiga level yang berbeda." },
          ],
        },
      ],
    },
  ],
};
