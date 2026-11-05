import type { V2Lesson } from "../lib/types";

const SETUP = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE karyawan (id INTEGER PRIMARY KEY, nama TEXT, atasan_id INTEGER)""")
data_karyawan = [
    (1, 'Rina', None),
    (2, 'Budi', 1),
    (3, 'Sari', 1),
    (4, 'Agus', 2),
    (5, 'Dewi', 2),
    (6, 'Joko', 3)
]
cur.executemany("INSERT INTO karyawan VALUES (?,?,?)", data_karyawan)
cur.executescript("""CREATE TABLE transfer (pengirim TEXT, penerima TEXT, jumlah REAL)""")
data_transfer = [
    ('A', 'B', 5000000),
    ('B', 'C', 4900000),
    ('C', 'D', 4800000),
    ('D', 'B', 100000),
    ('A', 'E', 2000000)
]
cur.executemany("INSERT INTO transfer VALUES (?,?,?)", data_transfer)
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

export const c12: V2Lesson = {
  slug: "c12-recursive-cte",
  track: "SQL",
  module: "Lanjutan",
  title: "C12 Recursive CTE Mendalam: Hierarki, Graf & Jalan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-mule",
      eyebrow: "Langkah 1 · Recursive CTE",
      title: "Jaringan rekening mencurigakan",
      prose: [
        "Tim fraud menemukan: rekening A transfer ke B, B ke C, C ke D... rantai 8 rekening yang semuanya baru dibuka minggu ini — pola money mule klasik. Query biasa tidak bisa “mengikuti rantai” — panjangnya tidak diketahui! Recursive CTE mengikuti rantai sepanjang apapun: dari A, temukan semua yang terjangkau.",
        "SQL — bahasa yang “tidak bisa loop” — ternyata bisa mengikuti rantai 8 rekening money mule. Recursive CTE adalah loop yang menyamar sebagai query. Dan ironinya: pola jahat yang mencoba bersembunyi lewat rantai panjang justru paling mudah ditangkap oleh satu query rekursif.",
        "Anatomi: anchor (SELECT awal, tanpa merujuk CTE) + rekursi (SELECT yang merujuk CTE + UNION ALL) + terminasi (kondisi berhenti). Eksekusi: anchor → hasilnya diumpankan ke rekursi → berulang hingga kosong.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“UNION vs UNION ALL sama saja di recursive CTE.” Beda penting! UNION (dedup) mencegah cycle tak berujung (A→B→A→...) tapi lebih lambat; UNION ALL cepat tapi butuh guard kedalaman. Untuk graf yang mungkin ber-cycle, UNION atau path-tracking wajib.",
      },
      reference: "Recursive = anchor + UNION ALL + kondisi berhenti. Selalu pasang batas kedalaman.",
    },
    {
      id: "lab-hierarki",
      eyebrow: "Langkah 2 · Lab hierarki",
      title: "Level dan path karyawan",
      prose: [
        "Tabel karyawan: Rina (direktur, atasan NULL) → Budi & Sari → Agus & Dewi (bawahan Budi), Joko (bawahan Sari). Recursive CTE menghitung `level` (kedalaman, 0 = puncak) dan `path` (rantai nama: “Rina > Budi > Agus”) — path diakumulasi sebagai string via `h.path || ' > ' || k.nama`.",
        "Butuh “semua bawahan X”? Anchor = X, bukan puncak. Butuh “semua atasan Y”? Balik arah JOIN (naik, bukan turun). Recursive CTE dua arah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: hierarki lengkap dengan `level` dan `path` (anchor = atasan NULL)" },
        { id: "t2", text: "Ambil `lvl` = level Agus dan pastikan = 2" },
      ],
      expected: "baris: 6; Agus level 2, path 'Rina > Budi > Agus'",
      hints: [
        "Anchor: SELECT id, nama, 0 AS level, nama AS path FROM karyawan WHERE atasan_id IS NULL.",
        "Rekursi: SELECT k.id, k.nama, h.level + 1, h.path || ' > ' || k.nama FROM hier h JOIN karyawan k ON k.atasan_id = h.id.",
        "lvl = [r[2] for r in rows if r[1] == 'Agus'][0]  →  2 (kolom: id, nama, level, path).",
      ],
      code: {
        starter:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
# TULIS KODEMU: level Agus (kolom: id, nama, level, path)
lvl =

print("baris:", n)
print("lvl_agus:", lvl)`,
        lockLines: 23,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH RECURSIVE hier AS (
  SELECT id, nama, 0 AS level, nama AS path
  FROM karyawan WHERE atasan_id IS NULL
  UNION ALL
  SELECT k.id, k.nama, h.level + 1, h.path || ' > ' || k.nama
  FROM hier h JOIN karyawan k ON k.atasan_id = h.id
)
SELECT id, nama, level, path FROM hier
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
# TULIS KODEMU: level Agus (kolom: id, nama, level, path)
lvl = [r[2] for r in rows if r[1] == 'Agus'][0]

print("baris:", n)
print("lvl_agus:", lvl)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "RECURSIVE", label: "Query memakai WITH RECURSIVE", msg: "Hierarki butuh WITH RECURSIVE." },
          { kind: "equal", task: "t1", name: "n", value: 6, tol: 1e-9, label: "6 baris (6 karyawan)", msg: "Semua 6 karyawan harus muncul dengan level masing-masing." },
          { kind: "equal", task: "t2", name: "lvl", value: 2, tol: 1e-9, label: "`lvl` seharusnya 2", msg: "Agus bawahan Budi, Budi bawahan Rina → level 2." },
        ],
      },
      reference: "Hierarki: anchor puncak, JOIN ke anak; level + path untuk tampil.",
    },
    {
      id: "lab-graf",
      eyebrow: "Langkah 3 · Lab graf",
      title: "Ikuti rantai transfer",
      prose: [
        "Dari rekening 'A': A→B→C→D (dan D→B membentuk cycle!), plus A→E. Tanpa guard, D→B→C→D→... tak berujung. Solusi berlapis: `UNION` (dedup) + batas kedalaman (`WHERE j.d < 6`) + path tracking (`instr(j.path, t.penerima) = 0` — tolak node yang sudah dikunjungi).",
        "Untuk analisis jaringan berat (PageRank, community detection), pindah ke Python/graph DB — tapi untuk eksplorasi awal dan pola sederhana, recursive CTE cukup, dan datanya tidak perlu keluar database.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: semua rekening terjangkau dari 'A' + kedalaman + path (dengan guard anti-cycle)" },
        { id: "t2", text: "Jalankan dan pastikan 5 baris kembali (A, B, C, D, E)" },
      ],
      expected: "baris: 5 — A(0), B(1), E(1), C(2), D(3); cycle D→B tertahan guard",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pola ini menemukan jaringan mule, fan-in/fan-out, dan cycle transfer — fondasi analisis jaringan fraud/AML (C14). Semakin panjang rantai persembunyian, semakin jelas jejaknya bagi yang tahu cara mengikuti.",
      },
      hints: [
        "Anchor: SELECT 'A', 0, 'A' — dengan nama kolom (node, d, path).",
        "Rekursi: SELECT t.penerima, j.d + 1, j.path || '->' || t.penerima FROM j JOIN transfer t ON t.pengirim = j.node.",
        "Guard: WHERE j.d < 6 AND instr(j.path, t.penerima) = 0 — pakai UNION (bukan ALL).",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 23,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH RECURSIVE j(node, d, path) AS (
  SELECT 'A', 0, 'A'
  UNION
  SELECT t.penerima, j.d + 1, j.path || '->' || t.penerima
  FROM j JOIN transfer t ON t.pengirim = j.node
  WHERE j.d < 6 AND instr(j.path, t.penerima) = 0
)
SELECT * FROM j
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "RECURSIVE", label: "Query memakai WITH RECURSIVE", msg: "Penelusuran rantai butuh WITH RECURSIVE." },
          { kind: "equal", task: "t2", name: "n", value: 5, tol: 1e-9, label: "5 baris kembali", msg: "Terjangkau dari A: A, B, C, D, E. Cycle D→B harus tertahan guard." },
        ],
      },
      reference: "Graf: path tracking anti-cycle + batas kedalaman + UNION sebagai pengaman.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Rekursi: alat mana untuk apa",
      prose: [
        "Hierarki turun (bawahan) → anchor puncak, JOIN ke anak (level + path untuk tampil). Hierarki naik (atasan) → anchor node, JOIN ke induk (balik arah). Jaringan/graf → path tracking + batas kedalaman (cegah cycle; UNION sebagai pengaman). Deret (tanggal/angka) → anchor + increment + kondisi berhenti eksplisit (date spine!). Ragu ada cycle → UNION + guard kedalaman — pertahanan berlapis, selalu, di produksi.",
        "Bonus: rekursi tidak butuh tabel — anchor bisa baris literal. `WITH RECURSIVE fib(a, b, n) AS (SELECT 0, 1, 1 UNION ALL SELECT b, a+b, n+1 FROM fib WHERE n < 10) SELECT a FROM fib;` → 0,1,1,2,3,5,8,13,21,34. “SQL tidak bisa loop” = mitos yang baru saja kamu patahkan.",
      ],
      tasks: [],
      reference: "Anchor + rekursi + terminasi — tiga wajib; batas kedalaman selalu.",
    },
    {
      id: "minicase-skor",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Skor kecurigaan rantai",
      prose: [
        "Tim fraud ingin skor tiap rantai dari A: +1 per langkah, +2 jika penerima < 30 hari (rekening baru — butuh JOIN ke nasabah!), −1 jika jumlah menyusut > 50% (biaya normal?). Rancang query-nya (boleh pseudo-SQL) — komponen apa saja yang digabung?",
        "Pembahasan: (1) recursive CTE untuk rantai + kedalaman + path; (2) JOIN ke nasabah untuk umur rekening; (3) CASE untuk skor per langkah; (4) agregat SUM skor per rantai; (5) ambang (HAVING skor > X) untuk alert.",
        "Pelajaran: recursive CTE = mesin penjelajah; logika bisnis (skor) = CASE + agregat di atasnya. Pisahkan “jelajah” dari “nilai” — query tetap terbaca. Pola lengkapnya di C14.",
      ],
      tasks: [],
      reference: "Jelajah (recursive CTE) terpisah dari penilaian (CASE + agregat).",
    },
    {
      id: "intuisi-recursive",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Rekursi di SQL adalah perjalanan, bukan perulangan",
      prose: [
        "Model mental yang benar mengubah cara kamu menulis recursive CTE — dan cara kamu mendiagnosisnya saat rusak.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: pikirkan recursive CTE sebagai gelombang yang meluas, bukan loop yang berputar",
        body: "Recursive CTE tidak “mengulang”; ia bekerja dalam GELOMBANG: anchor menghasilkan gelombang 0 (titik awal), tiap iterasi mengambil gelombang sebelumnya dan memperluasnya satu langkah (satu level hierarki, satu edge graf), hingga tidak ada baris baru. Model ini menjelaskan segalanya: kenapa kondisi berhenti adalah “tidak ada baris baru” (bukan counter), kenapa cycle membuat gelombang tidak pernah berhenti (A→B→A menghasilkan baris baru selamanya), dan kenapa depth counter hanyalah pengaman tambahan. Heuristik debuggingnya: bila recursive CTE berjalan terlalu lama atau hasilnya meledak, jangan baca querynya — baca GELOMBANGNYA: SELECT gelombang_ke, COUNT(*) dari tiap iterasi (tambahkan kolom depth) dan lihat di gelombang berapa ledakannya mulai. Di sanalah cycle atau fan-out-nya bersembunyi. Rekursi yang sehat gelombangnya menyusut; rekursi yang sakit gelombangnya membesar.",
      },
      reference: "Debug rekursi via gelombang (depth + count per iterasi), bukan via query.",
    },
    {
      id: "rekursi-produksi",
      eyebrow: "Langkah 7 · Rekursi produksi",
      title: "Hierarki, cycle detection, dan jaminan terminasi",
      prose: [
        "Dua keluarga masalah tempat recursive CTE tak tergantikan: hierarki (org chart, kategori produk, bill-of-materials) dan graf (rantai transfer fraud, jaringan relasi). Keduanya memakai pola anchor + UNION ALL yang sama, tetapi menuntut disiplin yang berbeda. Untuk hierarki — yang secara definisi adalah pohon (tiap node punya SATU parent) — disiplinnya adalah validasi asumsi pohon: bila data ternyata punya node dengan dua parent (hasil merger, salah input), “hierarki”-mu adalah graf dan agregasi level (SUM per subtree) akan menggandakan. Verifikasi dulu: SELECT child, COUNT(DISTINCT parent) FROM relasi GROUP BY child HAVING COUNT(DISTINCT parent) > 1 — bila ada hasil, putuskan: pohonkan dulu (pilih parent kanonis) atau perlakukan sebagai graf.",
        "Bill-of-materials (BOM) adalah hierarki yang menuntut lebih: tiap edge punya KUANTITAS (1 mobil butuh 4 roda, tiap roda butuh 5 baut). Pola rekursinya membawa kolom akumulasi: SELECT ..., jumlah * parent.jumlah_akumulasi AS jumlah_akumulasi — perkalian di tiap level. Jebakannya: kuantitas sering disimpan di level yang salah (per unit vs per parent), dan satu angka yang salah di level atas dikalikan ribuan kali di bawah. Aturan: validasi dengan “rollup check” — total komponen level terbawah × harga harus cocok dengan total biaya yang diketahui; selisih = ada edge yang kuantitasnya salah. Dan BOM nyata punya SUBSTITUSI (komponen pengganti) — modelkan sebagai edge bertipe, bukan sebagai hierarki murni.",
        "Cycle detection — syarat mutlak untuk graf (bukan pohon): data transfer A→B→C→A akan membuat rekursi standar berputar selamanya. Teknik kanonis: bawa kolom path (string akumulasi id yang dikunjungi, mis. path || '>' || id_baru) dan hentikan perluasan bila id_baru sudah ada di path (instr(path, '>' || id_baru || '>') = 0). Ini O(panjang path) per baris — cukup untuk rantai fraud (panjang < 20), tetapi mahal untuk graf besar; di sana solusinya adalah algoritma graf di luar SQL (atau batasi depth agresif). Catatan penting: UNION (bukan UNION ALL) di recursive CTE juga menghentikan cycle — karena baris yang sudah pernah dihasilkan tidak diproses ulang — tetapi ia melakukannya dengan dedup GLOBAL yang mahal dan menyembunyikan informasi path; untuk analisis fraud kamu justru BUTUH path-nya (rantai lengkap untuk bukti), jadi deteksi eksplisit dengan kolom path lebih tepat.",
        "Batas kedalaman rekursi — tiga lapis pengaman yang harus selalu ada di query produksi: (1) kolom depth eksplisit (depth + 1 tiap iterasi) + filter WHERE depth < N — N dipilih dari domain (rantai mule jarang > 10; org chart jarang > 15); (2) batas database — SQLite tidak punya batas iterasi bawaan untuk recursive CTE (berhenti hanya saat tidak ada baris baru), Postgres punya statement_timeout sebagai jaring pengaman; (3) batas baris — validasi COUNT hasil sebelum dipakai hilir. Tanpa (1), satu cycle yang lolos dari deteksi = query berjalan selamanya = koneksi tergantung = insiden. Depth limit bukan “opsional untuk keamanan”; ia bagian dari query yang benar.",
        "Jaminan terminasi — checklist sebelum recursive CTE naik produksi: (a) ada kondisi yang membuat iterasi menghasilkan NOL baris baru? (untuk pohon: daun tidak punya anak — ya; untuk graf: hanya bila cycle detection benar); (b) depth limit eksplisit terpasang? (c) data sudah divalidasi bebas cycle bila asumsinya pohon? (d) hasil diuji atas SAMPEL yang mengandung cycle buatan — masukkan satu cycle sengaja ke data test dan pastikan query berhenti? Praktisi senior tidak percaya “datanya pasti pohon” — mereka menulis query yang tetap berhenti MESKIPUN datanya berkhianat. Itu perbedaan antara query lab dan query produksi.",
        "Satu pola lanjutan yang sangat praktis: agregasi bottom-up atas hierarki (total gaji per departemen termasuk sub-departemen). Triknya adalah membalik arah: anchor = daun (node tanpa anak), iterasi = naik ke parent sambil membawa SUM. Ini menghindari pola “untuk tiap node, jumlahkan seluruh subtree-nya” yang berbentuk correlated subquery per node (mahal, C6). Dan untuk hierarki yang DIBACA jauh lebih sering daripada DITULIS (kategori produk, chart of accounts), pertimbangkan materialized path (kolom path '1/4/12/' per baris) atau nested sets — query “semua descendant” menjadi LIKE '1/4/%' tanpa rekursi sama sekali, dengan harga penulisan yang lebih mahal. Rekursi adalah alat yang tepat untuk data yang berubah; untuk data yang stabil dan dibaca terus, struktur yang di-materialize menang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“UNION ALL di recursive CTE pasti aman karena ada kondisi berhenti.” Kondisi berhenti “tidak ada baris baru” hanya menghentikan bila barisnya memang berhenti bermunculan — cycle A→B→A memunculkan “baris baru” (dengan depth/path berbeda) selamanya. Kondisi berhenti adalah HARAPAN, bukan JAMINAN; jaminannya adalah depth limit + cycle detection yang teruji.",
      },
      reference: "Validasi asumsi pohon; bawa kolom path untuk cycle; depth limit selalu; uji dengan cycle buatan.",
    },
    {
      id: "rekursi-vs-app",
      eyebrow: "Langkah 8 · Rekursi vs aplikasi",
      title: "Kapan rekursi di SQL, kapan di kode aplikasi — dan urutan traversal",
      prose: [
        "Pertanyaan arsitektural yang jarang ditanyakan: haruskah traversal ini di SQL atau di kode aplikasi (Python/dll)? Aturannya praktis: (1) di SQL bila traversal BUTUH data relasional di tiap langkah (join ke tabel atribut, filter, agregasi) — memindahkan graf ke aplikasi berarti N+1 query atau satu dump raksasa; (2) di aplikasi bila traversal butuh LOGIKA kompleks per langkah (scoring ML, pemanggilan API, aturan bisnis prosedural) yang tidak wajar di SQL; (3) di SQL bila hasilnya perlu di-JOIN/agregat lebih lanjut — rantai fraud yang langsung dihitung total alirannya. Sinyal untuk pindah ke aplikasi: recursive CTE-mu mulai membutuhkan fungsi yang tidak ada di SQL, atau depth-nya ratusan (stack/iterasi SQL tidak dirancang untuk itu).",
        "Urutan traversal — breadth-first vs depth-first — menentukan BENTUK output dan sering menentukan kebenaran analisis. Recursive CTE standar menghasilkan urutan yang tidak dijamin; untuk hierarki org chart yang DITAMPILKAN (indentasi!), kamu butuh depth-first: tiap manajer diikuti seluruh subtree-nya sebelum pindah ke manajer berikutnya. Tekniknya: bawa kolom path (mis. 'CEO/VP_A/Mgr_1') dan ORDER BY path — string path yang terurut memberikan depth-first secara alami karena prefiks yang sama mengelompok. Untuk breadth-first (level per level — “semua VP dulu, baru manajer”), ORDER BY depth, path. Tanpa ORDER BY eksplisit, “tampilan pohon”-mu acak — dan bug tampilan ini sering disangka bug data.",
        "Postgres punya sintaks khusus yang patut diketahui: SEARCH DEPTH FIRST BY id SET ordercol dan CYCLE id SET is_cycle USING path — deklaratif untuk traversal + deteksi cycle bawaan (tidak perlu merangkai string path manual). SQLite tidak memilikinya — di sana pola path-string manual adalah caranya. Mengetahui keduanya membuatmu membaca query orang lain lintas dialek. Dan satu peringatan portabilitas: kolom path string punya BATAS PANJANG — rantai 10.000 node dengan id panjang bisa menabrak batas TEXT di tengah jalan; untuk graf dalam, batasi depth agresif atau pindah ke aplikasi dengan struktur data graf betulan.",
        "Path enumeration sebagai ALTERNATIF rekursi untuk data yang stabil: simpan kolom path materialized ('1/4/12/') di tiap baris saat INSERT/UPDATE (dijaga oleh trigger/aplikasi). Maka “semua descendant node 4” = WHERE path LIKE '1/4/%' — tanpa rekursi, secepat index. “Semua ancestor node 12” = pecah path-nya. Harganya: tulis lebih mahal (path harus dirawat saat node pindah — subtree pindah = update semua descendant) dan butuh disiplin. Aturan pilih: baca >> tulis (kategori produk, COA akuntansi) → materialized path; tulis sering / struktur selalu berubah (organisasi yang reorg tiap kuartal) → recursive CTE; butuh keduanya + skala → nested sets atau closure table (tabel terpisah berisi semua pasangan ancestor-descendant — tulis mahal, baca O(1)). Tiga pola ini adalah jawaban standar industri; recursive CTE hanyalah satu dari tiga.",
        "Iterative deepening — teknik untuk graf yang terlalu besar untuk dijelajahi penuh: mulai depth limit kecil (3), bila tidak ketemu, naikkan (6, 10). Untuk investigasi fraud (“apakah rekening X terhubung ke rekening Y?”), ini jauh lebih murah daripada menjelajahi seluruh graf sampai habis — kebanyakan koneksi yang relevan berjarak < 6 hop; menjelajah 20 hop hanya membuang waktu. Implementasinya: parameter depth limit di query + loop di aplikasi. Dan untuk pertanyaan “jarak terpendek”, recursive CTE standar TIDAK menjamin yang pertama ketemu adalah terpendek (tergantung urutan) — butuh BFS murni (antre per level) atau algoritma graf di luar SQL. Mengetahui batas ini mencegah klaim “jalur terpendek” yang sebenarnya “jalur yang kebetulan ketemu duluan”.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Recursive CTE bisa menggantikan graph database.” Untuk rantai pendek dan hierarki, ya. Untuk graf besar dengan pertanyaan jarak-terpendek, centrality, atau community detection — tidak; itu wilayah algoritma graf (BFS/DFS betulan, bukan emulasi string-path). Memaksakan recursive CTE untuk 1 juta node adalah cara lambat menemukan bahwa kamu butuh tool yang tepat.",
      },
      reference: "Traversal butuh data relasional → SQL; logika kompleks/depth ratusan → aplikasi; tampilkan pohon → ORDER BY path.",
    },
    {
      id: "pola-ring",
      eyebrow: "Langkah 9 · Pola ring",
      title: "Mendeteksi ring fraud: cycle sebagai bukti, bukan sekadar error",
      prose: [
        "Sejauh ini cycle diperlakukan sebagai MASALAH (penyebab infinite loop) — tetapi di investigasi fraud, cycle adalah TEMUAN: ring A→B→C→A adalah pola money mule klasik (dana berputar kembali ke titik awal untuk mengaburkan jejak). Recursive CTE yang sama, dengan kolom path, berubah dari “query hierarki” menjadi “detektor ring”: SELECT path FROM rantai WHERE instr(path, '>' || id_terakhir || '>') > 0 — baris yang kembali ke node yang sudah dikunjungi. Bedanya dengan deteksi-saat-traversal: di sini kamu SENGAJA mencari cycle, bukan menghindarinya — depth limit tetap dipasang (ring relevan < 10 hop; lebih dari itu biasanya bukan ring melainkan graf kusut).",
        "Dua pola graf fraud lain yang hidup di recursive CTE: fan-in (“banyak ke satu”) — 50 rekening baru transfer ke 1 rekening penampung (mule herd) — dideteksi bukan dengan rekursi melainkan agregasi (GROUP BY tujuan HAVING COUNT(DISTINCT sumber) > 50 AND umur_rekening < 30 hari); dan fan-out (“satu ke banyak”) — 1 rekening memecah ke 50 (layering) — pola simetris. Rekursi bersinar untuk RANTAI (A→B→C→D, layering berlapis) dan RING; agregasi bersinar untuk fan-in/fan-out. Analis yang hanya punya satu alat akan memaksakan rekursi untuk fan-in — lambat dan tidak perlu. Aturan: bentuk polanya menentukan alatnya — rantai/ring → rekursi + path; kipas → agregasi + ambang.",
        "Satu teknik lanjutan untuk ring: “canonical rotation” agar ring yang sama tidak dilaporkan 3× (A→B→C→A, B→C→A→B, C→A→B→C adalah SATU ring). Caranya: normalisasi representasi — rotasi path sehingga node terkecil (id minimum) selalu di depan, lalu DISTINCT atas representasi kanonis. Tanpa ini, dashboard “10 ring terdeteksi” sebenarnya 3 ring + 7 duplikat rotasi — dan tim investigasi membuang waktu membuka kasus yang sama. Detail kecil, dampak operasional besar: dedup temuan SAMA PENTINGNYA dengan menemukan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Ring = bukti fraud.” Bukan — ring = pola yang LAYAK DIINVESTIGASI. Arus kas bisnis normal (setoran cabang → pusat → cabang) juga membentuk cycle. Yang membedakan adalah konteks: umur rekening, kecepatan, nominal, dan putusnya rantai dokumentasi. Query menemukan kandidat; manusia memutuskan.",
      },
      reference: "Rantai/ring → rekursi + path; fan-in/out → agregasi; normalisasi rotasi untuk dedup temuan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Anatomi: anchor + rekursi + terminasi.",
        "Hierarki: level & path; anchor bisa puncak/node (dua arah).",
        "Graf: path tracking anti-cycle — fondasi analisis jaringan fraud.",
        "Aman: batas kedalaman selalu; UNION untuk graf ber-cycle.",
        "Rekursi tak butuh tabel — anchor bisa literal (deret, Fibonacci).",
      ],
      next: { label: "C13 — DPD, Roll Rate & Vintage", href: "/learn/c13-risiko-dpd-rollrate" },
      quiz: [
        {
          q: "Tiga bagian recursive CTE?",
          options: [
            { text: "SELECT, WHERE, ORDER BY", why: "Salah — itu klausa query biasa." },
            { text: "Anchor, rekursi (UNION ALL), terminasi", why: "Benar. Titik awal, perluasan, kondisi berhenti.", correct: true },
            { text: "JOIN, GROUP BY, HAVING", why: "Salah." },
          ],
        },
        {
          q: "Tanpa kondisi berhenti?",
          options: [
            { text: "Error langsung", why: "Salah — tidak langsung error." },
            { text: "Berisiko rekursi tak berujung / hang", why: "Benar. Selalu pasang batas kedalaman.", correct: true },
            { text: "Otomatis berhenti di 100", why: "Salah — jangan andalkan batas implisit." },
          ],
        },
        {
          q: "Mencegah cycle A→B→A→B...?",
          options: [
            { text: "ORDER BY", why: "Salah — tidak mencegah cycle." },
            { text: "Path tracking (instr) + UNION", why: "Benar. Lacak path yang dikunjungi, tolak yang sudah ada.", correct: true },
            { text: "LIMIT", why: "Salah — LIMIT memotong hasil, bukan mencegah loop." },
          ],
        },
        {
          q: "Semua bawahan Budi (id=2)?",
          options: [
            { text: "Anchor = puncak", why: "Salah — itu memberi seluruh hierarki." },
            { text: "Anchor = Budi (id=2), JOIN ke bawah", why: "Benar. Anchor menentukan subtree.", correct: true },
            { text: "Tidak bisa", why: "Salah — bisa, tinggal ganti anchor." },
          ],
        },
        {
          q: "UNION vs UNION ALL di recursive CTE graf?",
          options: [
            { text: "Sama", why: "Salah — beda penting." },
            { text: "UNION dedup (cegah cycle, lambat); ALL cepat tapi butuh guard", why: "Benar. Pilih berdasar butuh kecepatan vs keamanan.", correct: true },
            { text: "ALL cegah cycle", why: "Salah — kebalikannya." },
          ],
        },
      ],
    },
  ],
};
