import type { V2Lesson } from "../lib/types";

const SETUP = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE nasabah (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kota TEXT,
  penghasilan REAL,
  dpd INTEGER,
  status TEXT
)""")
data_nasabah = [
    (1, 'Andi', 'Jakarta', 8500000, 0, 'lancar'),
    (2, 'Budi', 'Bandung', 12000000, 15, 'lancar'),
    (3, 'Citra', 'Jakarta', 6700000, 45, 'telat'),
    (4, 'Dewi', 'Surabaya', 15000000, 0, 'lancar'),
    (5, 'Eko', 'Jakarta', None, 90, 'macet'),
    (6, 'Fitri', 'Bandung', 9200000, 5, 'lancar'),
    (7, 'Gilang', 'Medan', 7800000, 30, 'telat'),
    (8, 'Hesti', 'Jakarta', 11000000, 0, 'lancar'),
    (9, 'Irfan', 'Surabaya', 5400000, 120, 'macet'),
    (10, 'Joko', 'Medan', 8900000, 0, 'lancar')
]
cur.executemany("INSERT INTO nasabah VALUES (?,?,?,?,?,?)", data_nasabah)
cur.executescript("""CREATE TABLE kredit (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER,
  plafon REAL,
  tenor INTEGER,
  dpd INTEGER,
  kolektibilitas INTEGER
)""")
data_kredit = [
    (1, 1, 50000000, 12, 0, 1),
    (2, 2, 100000000, 24, 15, 2),
    (3, 3, 30000000, 12, 45, 3),
    (4, 4, 200000000, 36, 0, 1),
    (5, 5, 75000000, 24, 90, 4),
    (6, 6, 40000000, 12, 5, 1),
    (7, 7, 60000000, 18, 30, 2),
    (8, 8, 90000000, 24, 0, 1),
    (9, 9, 25000000, 12, 120, 5),
    (10, 10, 55000000, 18, 0, 1),
    (11, 2, 30000000, 12, 60, 3),
    (12, 5, 20000000, 6, 150, 5)
]
cur.executemany("INSERT INTO kredit VALUES (?,?,?,?,?,?)", data_kredit)
db.commit()`;

const TAIL = `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`;

export const c8: V2Lesson = {
  slug: "c8-union-set",
  track: "SQL",
  module: "Fondasi",
  title: "C8 UNION & Operasi Himpunan: Menumpuk, Bukan Menyambung",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-merger",
      eyebrow: "Langkah 1 · UNION",
      title: "Dua sistem, satu laporan",
      prose: [
        "Bank hasil merger: data nasabah ada di dua sistem (core banking lama + sistem baru) dengan struktur tabel sama. Direksi minta “satu daftar nasabah”. JOIN? Salah — tidak ada relasi antar baris; yang dibutuhkan adalah menumpuk dua daftar menjadi satu. UNION menumpuk baris; JOIN menyambung kolom. Tertukar = hasil kacau.",
        "`UNION` menumpuk + membuang duplikat (lebih lambat, butuh sort). `UNION ALL` menumpuk apa adanya (lebih cepat). Default: `UNION ALL` — kecuali kamu butuh dedup. Kebanyakan bug “kok jumlahnya kurang” berasal dari UNION yang membuang duplikat sah! Syarat: jumlah kolom sama, tipe kompatibel, urutan sejajar. Nama kolom hasil = dari SELECT pertama. `ORDER BY`/`LIMIT` hanya di AKHIR (berlaku untuk gabungan).",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tumpuk nasabah Jakarta dan non-Jakarta dengan `UNION ALL` (kolom nama, kota)" },
        { id: "t2", text: "Jalankan dan pastikan 10 baris kembali (4 + 6)" },
      ],
      expected: "baris: 10 (4 Jakarta + 6 non-Jakarta, apa adanya)",
      note: {
        title: "Sering salah",
        body: "“UNION dan UNION ALL sama saja.” Beda hasil DAN beda cepat! Saat menghitung total (mis. total transaksi dua sistem), UNION membuang duplikat “sejati” — dua transaksi identik yang memang terjadi 2× — sehingga total salah. Agregasi setelah gabung → UNION ALL dulu, dedupe belakangan jika perlu.",
      },
      hints: [
        "SELECT nama, kota FROM nasabah WHERE kota = 'Jakarta' UNION ALL SELECT ...",
        "Partisi saling lepas: kota = 'Jakarta' vs kota <> 'Jakarta'.",
        "Hasilnya 10 baris: 4 + 6.",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 48,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT nama, kota FROM nasabah WHERE kota = 'Jakarta'
UNION ALL
SELECT nama, kota FROM nasabah WHERE kota <> 'Jakarta'
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "UNION ALL", label: "Query memakai UNION ALL", msg: "Tumpuk dua daftar dengan UNION ALL." },
          { kind: "equal", task: "t2", name: "n", value: 10, tol: 1e-9, label: "10 baris kembali", msg: "4 nasabah Jakarta + 6 non-Jakarta = 10 baris." },
        ],
      },
      reference: "UNION ALL = tumpuk apa adanya (cepat); UNION = tumpuk + dedup (lambat).",
    },
    {
      id: "intersect-except",
      eyebrow: "Langkah 2 · INTERSECT & EXCEPT",
      title: "Irisan dan selisih",
      prose: [
        "`INTERSECT` = “yang ada di keduanya” — untuk rekonsiliasi kecocokan. `EXCEPT` = “yang ada di A tapi tidak di B” — untuk menemukan yang hilang, mis. nasabah yang belum pindah sistem setelah migrasi. Di SQLite namanya EXCEPT (bukan MINUS seperti Oracle).",
        "Pola audit migrasi: `(A EXCEPT B)` = hilang; `(B EXCEPT A)` = baru tak terduga; `(A UNION B)` vs `(A INTERSECT B)` = cakupan. Tiga query = audit migrasi lengkap. Catatan: EXCEPT membandingkan semua kolom SELECT — samakan kolomnya, dan perlakukan NULL = NULL (sama!) — beda dengan `=` yang UNKNOWN.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: nasabah ber-dpd (dpd > 0) yang TIDAK punya kredit macet — pakai `EXCEPT`" },
        { id: "t2", text: "Jalankan dan pastikan 4 baris kembali" },
      ],
      expected: "baris: 4 — Budi, Citra, Fitri, Gilang (Eko & Irfan punya kredit macet)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "EXCEPT dua arah adalah template audit setiap migrasi/ELT: yang hilang vs yang baru tak terduga. Setelah migrasi core banking, EXCEPT menemukan nasabah yang belum pindah — tanpa ini, mereka hilang dari layanan.",
      },
      hints: [
        "SELECT id, nama FROM nasabah WHERE dpd > 0 EXCEPT SELECT ...",
        "Sisi kedua: nasabah yang punya kredit kolektibilitas = 5 (via JOIN).",
        "6 ber-dpd dikurangi Eko & Irfan (punya kredit macet) = 4 baris.",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 48,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT id, nama FROM nasabah WHERE dpd > 0
EXCEPT
SELECT n.id, n.nama FROM nasabah n
JOIN kredit k ON k.nasabah_id = n.id
WHERE k.kolektibilitas = 5
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "EXCEPT", label: "Query memakai EXCEPT", msg: "Selisih himpunan memakai EXCEPT." },
          { kind: "equal", task: "t2", name: "n", value: 4, tol: 1e-9, label: "4 baris kembali", msg: "Ber-dpd: Budi, Citra, Eko, Fitri, Gilang, Irfan (6). Yang punya kredit macet: Eko, Irfan. Selisih = 4." },
          { kind: "stdout_matches", task: "t2", pattern: "Budi", label: "Budi termasuk hasil", msg: "Budi ber-dpd (15) tapi tidak punya kredit macet — harus muncul." },
        ],
      },
      reference: "INTERSECT = irisan; EXCEPT = selisih (alat audit “yang hilang”).",
    },
    {
      id: "union-vs-join",
      eyebrow: "Langkah 3 · UNION vs JOIN",
      title: "Jangan tertukar",
      prose: [
        "UNION: vertikal (tumpuk baris), syaratnya kolom sejajar — untuk baris dari dua tabel sejenis. JOIN: horizontal (sambung kolom), syaratnya kunci relasi (ON) — untuk kolom dari dua tabel yang berelasi. Baris hasil UNION = jumlah dijumlah; baris hasil JOIN = dikalikan (fan-out!).",
        "Jika ragumu “pakai yang mana”, tanyakan: “apakah baris-baris ini entitas yang sama?” Ya → UNION; tidak → JOIN. Contoh: “daftar kota dari 2 tabel” (entitas sama) → UNION. “Nasabah + kreditnya” (berelasi) → JOIN. Dan waspada: `SELECT nama FROM a UNION SELECT kota FROM b` “jalan” tapi hasilnya sampah — syarat UNION hanya jumlah kolom & tipe kompatibel; makna kolom tidak dicek! SQL patuh pada sintaks, bukan pada maksudmu.",
      ],
      tasks: [],
      reference: "Entitas sama → UNION (vertikal); berelasi → JOIN (horizontal).",
    },
    {
      id: "minicase-migrasi",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Audit migrasi sistem",
      prose: [
        "Bank migrasi 10.000 nasabah ke sistem baru. Seorang analis menulis `SELECT COUNT(*) FROM lama EXCEPT ...` — salah, EXCEPT tidak bekerja pada angka! Bagaimana audit yang benar?",
        "Pembahasan — tiga query audit: (a) yang hilang: `SELECT id FROM lama EXCEPT SELECT id FROM baru;` (b) yang baru tak terduga: `SELECT id FROM baru EXCEPT SELECT id FROM lama;` (c) total unik: `SELECT COUNT(*) FROM (SELECT id FROM lama UNION SELECT id FROM baru);`",
        "Pelajaran: EXCEPT bekerja pada himpunan baris, bukan angka. Tiga query ini = template audit setiap migrasi/ELT. Simpan sebagai snippet.",
      ],
      tasks: [],
      reference: "Audit migrasi = EXCEPT dua arah + UNION untuk total unik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Operasi himpunan: alat mana untuk apa",
      prose: [
        "Tumpuk daftar sejenis → `UNION ALL` (default; cepat, apa adanya; syarat kolom sejajar). Butuh unik → `UNION` (buang duplikat, ada biaya sort). Ada di keduanya → `INTERSECT` (rekonsiliasi kecocokan). Hilang di satu sisi → `EXCEPT` (audit migrasi). Ragu UNION vs JOIN → tanya entitasnya.",
        "Aturan praktis: default UNION ALL; UNION hanya jika butuh dedup. Kolom harus sejajar (jumlah, tipe, urutan). ORDER BY/LIMIT di akhir gabungan — bungkus tiap SELECT dengan tanda kurung jika perlu ORDER BY sendiri.",
      ],
      tasks: [],
      reference: "Default UNION ALL; UNION untuk dedup; INTERSECT irisan; EXCEPT selisih.",
    },
    {
      id: "intuisi-union",
      eyebrow: "Langkah 6 · Intuisi",
      title: "UNION menanyakan “apa saja yang ada”, UNION ALL menanyakan “berapa banyak”",
      prose: [
        "Dua operator yang ejaannya mirip menjawab dua pertanyaan bisnis yang berbeda — tertukar sedikit, angkanya sesat total.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: default ke UNION ALL, naik ke UNION hanya bila ada alasan",
        body: "UNION membayar pajak sort-unique di setiap eksekusi — pada 10 juta baris, itu bisa menjadi operator termahal di query. Kebanyakan pemakaian UNION di kode produksi sebenarnya tidak butuh dedup: cabang-cabangnya sudah saling lepas (data Januari vs Februari, sistem A vs sistem B) sehingga tidak ada duplikat yang perlu dibuang — pajaknya dibayar untuk nol manfaat. Heuristik senior: tulis UNION ALL dulu; naik ke UNION hanya bila kamu bisa menyebutkan DENGAN SPESIFIK duplikat apa yang kamu takutkan dan dari cabang mana ia berasal. Bila jawabannya “tidak tahu, untuk jaga-jaga” — itu bukan alasan, itu UNION ALL yang menyamar. Pengecualiannya justru informatif: bila duplikat MUNGKIN ada dan kamu butuh himpunan unik yang benar (daftar nasabah unik lintas dua sistem hasil merger), UNION adalah alat yang tepat — tetapi verifikasi dulu dengan COUNT per cabang vs COUNT hasil: selisihnya harus bisa dijelaskan, bukan diterima buta.",
      },
      reference: "UNION ALL = default; UNION = hanya bila duplikatnya nyata dan harus dibuang.",
    },
    {
      id: "biaya-union",
      eyebrow: "Langkah 7 · Biaya set-op",
      title: "Harga UNION, dedup di pipeline, dan jebakan himpunan",
      prose: [
        "Harga UNION yang sebenarnya: untuk membuang duplikat, database harus menemukan duplikat — artinya mengurutkan (sort) atau meng-hash SELURUH hasil gabungan. Kompleksitasnya O(n log n) untuk sort, plus memori untuk menampungnya; pada 10 juta baris ini berarti ratusan MB memori kerja dan spilling ke disk bila tidak muat. UNION ALL tidak melakukan apa-apa selain menumpuk — O(n), nyaris gratis. Aturan kuantitatifnya: bila tiap cabang sudah unik secara konstruksi (rentang tanggal tidak tumpang tindih, sumber sistem berbeda), UNION dan UNION ALL menghasilkan baris yang SAMA PERSIS — dan selisih biayanya murni terbuang. Buktikan dengan EXPLAIN: cari node “Unique”/“HashAggregate” di atas “Append” — itulah pajak yang kamu bayar.",
        "Pola pipeline yang benar untuk dedup skala besar bukan “UNION di tiap langkah”, melainkan “UNION ALL dulu, dedup sekali di akhir”. Alasannya dua: (1) dedup parsial di tengah pipeline sering sia-sia karena langkah berikutnya (JOIN, agregasi) bisa memunculkan duplikat baru lagi; (2) satu dedup di akhir atas data yang sudah menyusut (mis. setelah agregasi per kunci) jauh lebih murah daripada tiga dedup atas data mentah. Bentuk kanonisnya: WITH gabung AS (SELECT ... UNION ALL SELECT ... UNION ALL SELECT ...) SELECT kunci, SUM(nilai) FROM gabung GROUP BY kunci — agregasi per kunci sekaligus mendup secara alami bila grain-nya benar.",
        "Jebakan yang lebih berbahaya dari biaya adalah SEMANTIK: UNION menyembunyikan duplikat yang seharusnya membuatmu curiga. Dua cabang yang “seharusnya” saling lepas ternyata tumpang tindih 2% — dengan UNION, 2% itu hilang diam-diam dan laporan terlihat rapi; dengan UNION ALL + COUNT per cabang, kamu melihat angkanya tidak cocok dan menemukan bug sumber data. Inilah alasan analis senior kadang SENGAJA memakai UNION ALL saat debugging: duplikat adalah sinyal, bukan sampah. Aturan: di pipeline produksi pakai yang benar sesuai kebutuhan; saat investigasi anomali, UNION ALL dulu untuk melihat apa adanya.",
        "INTERSECT dan EXCEPT punya jebakan NULL-nya sendiri: dalam operasi himpunan, NULL dianggap SAMA dengan NULL (berbeda dengan = biasa!) — jadi INTERSECT bisa memasangkan baris ber-NULL yang JOIN tidak akan pernah pasangkan. Perilaku ini benar menurut standar, tetapi mengejutkan bila kamu tidak tahu. EXCEPT juga tidak simetris dengan NOT IN: EXCEPT A B mengembalikan baris di A yang tidak di B dengan semantik himpunan (kebal NULL seperti di atas), sedangkan NOT IN runtuh bila sisi kanan mengandung NULL — satu NULL meracuni seluruh perbandingan menjadi UNKNOWN sehingga hasilnya kosong. Untuk “ada di A tapi tidak di B” atas data ber-NULL, EXCEPT hampir selalu lebih aman daripada NOT IN.",
        "Dua detail tipe yang menjebak lintas cabang: (1) kolom-kolom cabang harus SEJENIS dan SEURUTAN — database melakukan koersi implisit bila beda (INTEGER vs TEXT), dan koersi bisa gagal di runtime pada baris ke-9-juta setelah 10 menit berjalan; samakan tipe secara eksplisit dengan CAST di tiap cabang; (2) nama kolom hasil diambil dari CABANG PERTAMA — alias yang rapi di cabang kedua tidak terbawa; beri alias final di cabang pertama. Dan untuk ORDER BY atas hasil gabungan: ia hanya boleh di AKHIR (setelah cabang terakhir), mengacu pada nama kolom output — ORDER BY di tengah cabang adalah syntax error di sebagian dialek.",
        "Kapan set-op BUKAN jawabannya — rewrite ke JOIN: pertanyaan “pelanggan yang beli A DAN beli B” sering ditulis sebagai INTERSECT dua SELECT, tetapi versi agregasi kondisional (GROUP BY pelanggan HAVING SUM(CASE WHEN produk='A' ...) > 0 AND SUM(CASE WHEN produk='B' ...) > 0) hanya memindai tabel sekali, bukan dua kali. Aturan: bila kedua cabang membaca TABEL YANG SAMA dengan filter berbeda, curigai bahwa satu scan + agregasi kondisional lebih murah daripada dua scan + INTERSECT. Set-op bersinar ketika cabangnya membaca SUMBER BERBEDA (dua tabel, dua sistem, dua periode arsip) — di sanalah ia tak tergantikan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“UNION otomatis mengurutkan hasil.” Tidak ada janji seperti itu — dedup internal memakai sort/hash, tetapi urutan OUTPUT tidak dijamin tanpa ORDER BY eksplisit di akhir. Laporan yang “kebetulan” terurut dari UNION akan acak sendiri setelah upgrade database atau perubahan volume data. Mau urut? Tulis ORDER BY.",
      },
      reference: "UNION ALL + dedup sekali di akhir; INTERSECT/EXCEPT: NULL dianggap sama; cabang beda sumber → set-op, satu sumber → agregasi kondisional.",
    },
    {
      id: "anti-join-trio",
      eyebrow: "Langkah 8 · Anti-join",
      title: "Tiga cara menulis “yang tidak punya pasangan” — dan kapan masing-masing berkhianat",
      prose: [
        "Pertanyaan “nasabah yang TIDAK punya kredit macet” bisa ditulis tiga cara: (A) EXCEPT — SELECT id FROM nasabah EXCEPT SELECT nasabah_id FROM kredit WHERE status = 'macet'; (B) NOT EXISTS — SELECT ... FROM nasabah n WHERE NOT EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id AND k.status = 'macet'); (C) LEFT JOIN + IS NULL — SELECT n.* FROM nasabah n LEFT JOIN kredit k ON k.nasabah_id = n.id AND k.status = 'macet' WHERE k.id IS NULL. Ketiganya “terlihat” sama — tetapi berbeda dalam semantik NULL, ketahanan terhadap duplikat, dan performa. Memilih dengan benar adalah keterampilan senior.",
        "Semantik NULL: (A) EXCEPT kebal NULL — ia memakai semantik himpunan (NULL = NULL), tidak pernah runtuh diam-diam. (B) NOT EXISTS kebal NULL — ia menguji keberadaan baris, bukan perbandingan nilai. (C) LEFT JOIN + IS NULL kebal NULL pada KONDISI JOIN (= biasa tetap tidak memasangkan NULL, tetapi itu justru yang diinginkan di sini — baris tanpa pasangan tetap muncul). Yang BERKHIANAT adalah (D) NOT IN — yang tidak ada di daftar ini karena runtuh bila sisi kanan mengandung NULL. Aturan: untuk anti-join, NOT IN hampir tidak pernah menjadi jawaban; pilih di antara A, B, C.",
        "Duplikat dan makna: (A) EXCEPT mengembalikan himpunan UNIK — bila nasabah muncul 2× di tabel nasabah (duplikat!), EXCEPT tetap mengembalikannya sekali; ini benar untuk pertanyaan himpunan, tetapi menyembunyikan masalah duplikat sumber. (B) dan (C) mempertahankan duplikat sisi kiri — bila yang kamu butuhkan adalah “baris nasabah” (untuk di-update/di-follow-up), B/C benar; bila yang kamu butuhkan adalah “daftar id unik”, A benar. Salah pilih = laporan “nasabah tanpa kredit macet” yang jumlahnya beda 2% antar dua query yang “sama” — dan 2% itu adalah duplikat yang satu versi sembunyikan.",
        "Performa — kapan masing-masing menang: (B) NOT EXISTS biasanya menjadi semi/anti-join di optimizer dan berhenti di baris pertama yang cocok — terbaik bila tabel kanan BESAR dan selektif (jutaan kredit, sedikit yang macet) dengan index pada (nasabah_id, status). (A) EXCEPT harus mematerialkan kedua himpunan lalu membandingkan — O(n log n), tetapi sangat baik bila KEDUA sisi sudah kecil (hasil agregasi/saring) dan kamu butuh semantik himpunan yang ketat. (C) LEFT JOIN + IS NULL sering dioptimasi menjadi anti-join yang sama dengan B di database modern — tetapi di optimizer yang lemah ia benar-benar melakukan join penuh dulu (menggandakan baris!) baru menyaring; verifikasi dengan EXPLAIN bila ragu. Aturan praktis: default ke NOT EXISTS (aman + biasanya tercepat); EXCEPT bila butuh himpunan unik eksplisit; LEFT JOIN + IS NULL bila gayanya lebih terbaca untuk timmu — tetapi cek plan-nya.",
        "Satu jebakan khusus (C): kondisi filter tabel kanan harus di ON, bukan di WHERE. LEFT JOIN kredit k ON k.nasabah_id = n.id AND k.status = 'macet' WHERE k.id IS NULL — benar (“tidak punya kredit MACET”). Bila status = 'macet' pindah ke WHERE, LEFT JOIN berubah menjadi INNER JOIN diam-diam (baris tanpa pasangan tersaring oleh WHERE k.status = 'macet' yang NULL) — dan “anti-join”-mu mengembalikan KOSONG. Ini bug klasik yang lolos review karena querynya “terlihat benar”. Aturan: di anti-join LEFT JOIN, SEMUA kondisi sisi kanan di ON; WHERE hanya untuk IS NULL.",
        "Menutup dengan kapan set-op BUKAN jawabannya — rewrite ke agregasi kondisional: “pelanggan yang beli A DAN beli B” sebagai INTERSECT dua SELECT memindai tabel dua kali; versi GROUP BY pelanggan HAVING SUM(CASE WHEN produk = 'A' THEN 1 ELSE 0 END) > 0 AND SUM(CASE WHEN produk = 'B' THEN 1 ELSE 0 END) > 0 memindai SEKALI. Aturan umumnya: bila kedua cabang membaca TABEL YANG SAMA dengan filter berbeda → satu scan + agregasi kondisional hampir selalu menang. Bila cabang membaca SUMBER BERBEDA (dua tabel, dua sistem, arsip + live) → set-op tak tergantikan. Dan untuk UNION atas banyak cabang sejenis (12 bulan arsip), pertimbangkan apakah PARTITION (satu tabel terpartisi) seharusnya menggantikan 12 cabang UNION ALL — arsitektur yang benar mengalahkan query yang pintar.",
        "Pola “UNION ALL dulu, dedup sekali di akhir” layak dipertegas dengan contoh pipeline nyata: tiga sumber transaksi (core banking, mobile app, arsip CSV) masing-masing 5 juta baris, butuh total unik per nasabah. Versi naif — UNION (dedup) tiap sumber lalu UNION lagi — membayar sort-unique 4× atas data mentah. Versi senior: WITH gabung AS (SELECT nasabah_id, nominal FROM core UNION ALL SELECT nasabah_id, nominal FROM mobile UNION ALL SELECT nasabah_id, nominal FROM arsip) SELECT nasabah_id, SUM(nominal) FROM gabung GROUP BY nasabah_id — satu GROUP BY di akhir sekaligus mendup (bila grain-nya benar: 1 baris per nasabah) dan menghitung. Dedup parsial di tengah hanya berguna bila langkah berikutnya (mis. JOIN ke tabel kecil) jauh lebih murah atas data unik — dan itu pun harus dibuktikan, bukan diasumsikan.",
        "Dua detail tipe dan urut yang menjebak lintas cabang: pertama, kolom-kolom cabang harus SEJENIS dan SEURUTAN — database melakukan koersi implisit bila beda (INTEGER vs TEXT untuk kolom id), dan koersi bisa GAGAL di runtime pada baris ke-9-juta setelah 10 menit berjalan (satu nilai 'ABC' di kolom yang “seharusnya” numerik). Samakan tipe eksplisit dengan CAST di tiap cabang, dan validasi dengan query “nilai yang tidak bisa di-cast” SEBELUM union besar. Kedua, nama kolom hasil diambil dari CABANG PERTAMA — alias rapi di cabang kedua tidak terbawa; beri alias final di cabang pertama. Ketiga, ORDER BY atas hasil gabungan hanya boleh di AKHIR (setelah cabang terakhir) dan mengacu pada nama kolom output — ORDER BY di tengah cabang adalah syntax error di sebagian dialek, dan LIMIT di tengah cabang membatasi cabang itu saja (kadang itu yang diinginkan — top-N per sumber — tetapi harus disadari).",
        "Satu pola lanjutan untuk UNION atas sumber yang SANGAT timpang: bila satu cabang 100 juta baris dan cabang lain 100 baris, optimizer tetap harus merencanakan keduanya — dan statistik yang buruk di cabang kecil bisa merusak estimasi keseluruhan. Tekniknya: materialkan cabang kecil ke temp table dulu (dengan ANALYZE), atau tulis cabang besar sebagai query luar dan cabang kecil sebagai CTE MATERIALIZED — memisahkan perencanaan keduanya. Ini optimasi tingkat lanjut yang jarang dibutuhkan, tetapi saat UNION 10 cabang tiba-tiba lambat tanpa alasan jelas, “rencana yang buruk untuk satu cabang meracuni semuanya” adalah hipotesis pertama yang dicek di EXPLAIN.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“LEFT JOIN + IS NULL dan NOT EXISTS itu sama saja, pilih yang pendek.” Sama hasilnya (biasanya), belum tentu sama biayanya — dan belum tentu sama maknanya saat ada duplikat di sisi kiri. “Sama saja” adalah klaim yang harus dibuktikan dengan EXPLAIN + COUNT, bukan diasumsikan dari hasil 10 baris sampel.",
      },
      reference: "Anti-join: NOT EXISTS default; EXCEPT untuk himpunan unik; filter kanan di ON, bukan WHERE.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "UNION ALL (default, cepat) vs UNION (dedup, lambat).",
        "INTERSECT = irisan; EXCEPT = selisih (alat audit).",
        "Syarat: kolom sejajar; ORDER BY/LIMIT di akhir gabungan.",
        "UNION = tumpuk baris (vertikal); JOIN = sambung kolom (horizontal).",
        "EXCEPT bekerja pada himpunan baris, bukan angka.",
      ],
      next: { label: "C9-1 — Window Functions (Ranking)", href: "/v2/learn/c9-window-functions-1" },
      quiz: [
        {
          q: "UNION vs UNION ALL — bedanya?",
          options: [
            { text: "Tidak ada", why: "Salah — beda hasil dan beda cepat." },
            { text: "UNION buang duplikat (lebih lambat); UNION ALL apa adanya (cepat)", why: "Benar. Default UNION ALL kecuali butuh dedup.", correct: true },
            { text: "UNION ALL buang duplikat", why: "Salah — kebalikannya." },
          ],
        },
        {
          q: "Syarat UNION: kolom harus?",
          options: [
            { text: "Sama nama", why: "Salah — nama hasil ikut SELECT pertama; yang penting sejajar." },
            { text: "Sejajar: jumlah sama, tipe kompatibel, urutan sama", why: "Benar. Makna kolom tidak dicek — itu tanggung jawabmu.", correct: true },
            { text: "Harus primary key", why: "Salah — tidak ada syarat itu." },
          ],
        },
        {
          q: "Nasabah yang ada di sistem lama tapi belum di sistem baru?",
          options: [
            { text: "UNION", why: "Salah — itu menggabungkan, bukan mencari selisih." },
            { text: "INTERSECT", why: "Salah — itu yang ada di keduanya." },
            { text: "EXCEPT (lama EXCEPT baru)", why: "Benar. Selisih = EXCEPT. Pola audit migrasi.", correct: true },
          ],
        },
        {
          q: "ORDER BY pada query UNION?",
          options: [
            { text: "Di tiap SELECT", why: "Salah — ORDER BY per SELECT butuh tanda kurung pembungkus." },
            { text: "Hanya di akhir (untuk gabungan)", why: "Benar. Berlaku untuk hasil gabungan.", correct: true },
            { text: "Tidak boleh", why: "Salah — boleh, di akhir." },
          ],
        },
        {
          q: "Mau “daftar kota dari 2 tabel” (entitas sama)?",
          options: [
            { text: "JOIN", why: "Salah — JOIN menyambung kolom tabel berelasi." },
            { text: "UNION", why: "Benar. Menumpuk = UNION. Menyambung kolom = JOIN.", correct: true },
            { text: "EXISTS", why: "Salah — EXISTS untuk cek keberadaan, bukan menumpuk daftar." },
          ],
        },
      ],
    },
  ],
};
