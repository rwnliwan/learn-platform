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
cur.executescript("""CREATE TABLE transaksi (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER,
  tanggal TEXT,
  jumlah REAL,
  kategori TEXT,
  channel TEXT
)""")
data_transaksi = [
    (1, 1, '2026-09-01', 500000, 'belanja', 'mobile'),
    (2, 1, '2026-09-03', 250000, 'makan', 'mobile'),
    (3, 2, '2026-09-01', 1000000, 'belanja', 'web'),
    (4, 3, '2026-09-05', 75000, 'makan', 'mobile'),
    (5, 2, '2026-09-10', 2000000, 'travel', 'web'),
    (6, 4, '2026-09-02', 300000, 'belanja', 'mobile'),
    (7, 5, '2026-09-08', 150000, 'makan', 'atm'),
    (8, 3, '2026-09-12', 500000, 'belanja', 'mobile'),
    (9, 1, '2026-09-15', 1200000, 'travel', 'web'),
    (10, 6, '2026-09-20', 80000, 'makan', 'mobile'),
    (11, 7, '2026-09-21', 950000, 'belanja', 'mobile'),
    (12, 2, '2026-09-25', 400000, 'makan', 'web'),
    (13, 8, '2026-09-26', 600000, 'belanja', 'mobile'),
    (14, 9, '2026-09-27', 200000, 'makan', 'atm'),
    (15, 10, '2026-09-28', 350000, 'belanja', 'web')
]
cur.executemany("INSERT INTO transaksi VALUES (?,?,?,?,?,?)", data_transaksi)
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

export const c14: V2Lesson = {
  slug: "c14-fraud-velocity",
  track: "SQL",
  module: "Risiko",
  title: "C14 Velocity & Impossible Travel: Menangkap Fraud dengan SQL",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-47jt",
      eyebrow: "Langkah 1 · Velocity",
      title: "Rp 47 juta dalam 11 menit",
      prose: [
        "Senin pagi, tim fraud melihat alert: satu kartu melakukan 14 transaksi dalam 11 menit di 3 kota berbeda — total Rp 47 juta. Pemilik kartu sedang tidur di Jakarta. Kartu dikloning. Velocity check (banyak transaksi dalam waktu singkat) + impossible travel (3 kota dalam 11 menit) = dua pola yang menangkapnya — keduanya murni SQL.",
        "14 transaksi dalam 11 menit di 3 kota — manusia tidak mungkin melakukannya, tapi sistem tidak “tahu” itu mustahil kecuali kamu mengajarkannya. Fraud detection jarang tentang pola jahat yang canggih; ia tentang menuliskan akal sehat sebagai query.",
        "Velocity = jumlah/nilai transaksi dalam jendela waktu (10 menit, 1 jam, 24 jam). Fraud = velocity abnormal. Ambang (threshold) ditentukan dari data historis (percentile!) bukan tebakan — ambang arbitrer tanpa data = false positive membabi buta.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Makin banyak rule = makin aman.” Salah — setiap rule menambah false positive; nasabah sah diblokir = komplain + churn. Fraud detection = trade-off presisi vs cakupan. Rule bagus = menangkap banyak fraud dengan sedikit gangguan. Ukur keduanya!",
      },
      reference: "Velocity = count/amount per jendela waktu; ambang dari percentile data, bukan tebakan.",
    },
    {
      id: "lab-velocity",
      eyebrow: "Langkah 2 · Lab velocity",
      title: "Agregat jendela harian",
      prose: [
        "Struktur alert: agregat jendela → CASE skor → saring yang relevan. `WITH v AS (SELECT nasabah_id, date(tanggal) AS tgl, COUNT(*) AS n, SUM(jumlah) AS amt FROM transaksi GROUP BY 1, 2) SELECT nasabah_id, tgl, n, amt, CASE WHEN n >= 3 OR amt >= 2000000 THEN 'waspada' ELSE 'normal' END AS alert FROM v;` — level: kritis (auto-block?), waspada (review manual), normal (abaikan).",
        "Di data lab yang tenang ini, hanya 1 baris yang lolos ambang: Budi, 10 Sep, total 2jt. Alert harus actionable — tiap alert = ada tindakan jelas. Alert tanpa tindakan = noise.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: per nasabah per hari hitung `n` dan `amt`, beri label `alert` ('waspada' jika n >= 3 atau amt >= 2000000)" },
        { id: "t2", text: "Hitung `waspada` = jumlah baris berlabel 'waspada' dan pastikan = 1" },
      ],
      expected: "waspada = 1 (Budi, 2026-09-10, amt 2000000); sisanya normal",
      hints: [
        "CTE v: SELECT nasabah_id, date(tanggal) AS tgl, COUNT(*) AS n, SUM(jumlah) AS amt FROM transaksi GROUP BY 1, 2.",
        "Lalu SELECT *, CASE WHEN n >= 3 OR amt >= 2000000 THEN 'waspada' ELSE 'normal' END AS alert FROM v.",
        "waspada = sum(1 for r in rows if r[4] == 'waspada')  →  1.",
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
# TULIS KODEMU: jumlah baris 'waspada' (kolom: nasabah_id, tgl, n, amt, alert)
waspada =

print("waspada:", waspada)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH v AS (
  SELECT nasabah_id, date(tanggal) AS tgl,
  COUNT(*) AS n, SUM(jumlah) AS amt
  FROM transaksi GROUP BY 1, 2
)
SELECT nasabah_id, tgl, n, amt,
CASE WHEN n >= 3 OR amt >= 2000000 THEN 'waspada' ELSE 'normal' END AS alert
FROM v
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: jumlah baris 'waspada' (kolom: nasabah_id, tgl, n, amt, alert)
waspada = sum(1 for r in rows if r[4] == 'waspada')

print("waspada:", waspada)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "CASE WHEN", label: "Query memakai CASE untuk label", msg: "Label alert memakai CASE WHEN." },
          { kind: "equal", task: "t2", name: "waspada", value: 1, tol: 1e-9, label: "`waspada` seharusnya 1", msg: "Hanya Budi 10 Sep (amt 2jt) yang memenuhi ambang n>=3 atau amt>=2jt." },
        ],
      },
      reference: "Alert = agregat jendela → CASE skor → saring; harus actionable.",
    },
    {
      id: "lab-travel",
      eyebrow: "Langkah 3 · Lab impossible travel",
      title: "Fisika sederhana",
      prose: [
        "Transaksi di Jakarta jam 10:00, lalu di Surabaya jam 10:30 — mustahil ditempuh (700 km dalam 30 menit). Pola: `LAG` (C9!) untuk pasangan berurutan per nasabah, lalu aturan kota beda + jeda < ambang (2 jam) = mustahil. Pengembangan: jarak_km / jeda_jam = kecepatan implisit; > 800 km/jam = flag.",
        "Tapi: impossible travel = screening, bukan vonis. VPN, perjalanan dinas (pesawat!), transaksi online dengan lokasi merchant aneh = penjelasan sah. Selalu ada langkah verifikasi (hubungi nasabah) sebelum blokir. Di lab ini: hitung jeda (jam) antar transaksi berurutan per nasabah — berapa yang tercepat?",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: jeda jam antar transaksi berurutan per nasabah (`LAG(tanggal)` + `julianday`)" },
        { id: "t2", text: "Hitung `tercepat` = jeda minimum dan pastikan = 48.0" },
      ],
      expected: "tercepat = 48.0 jam (Andi: 1 Sep → 3 Sep)",
      note: {
        title: "Sering salah",
        body: "“Impossible travel = pasti fraud.” Tidak — filter channel = 'offline' dulu untuk transaksi online (kota = kota merchant, bukan lokasi kartu!), atau false positive membanjiri tim.",
      },
      hints: [
        "CTE: WITH s AS (SELECT nasabah_id, tanggal, LAG(tanggal) OVER (PARTITION BY nasabah_id ORDER BY tanggal) AS lalu FROM transaksi).",
        "Jeda jam: (julianday(tanggal) - julianday(lalu)) * 24 — saring lalu IS NOT NULL.",
        "tercepat = min(r[2] for r in rows)  →  48.0.",
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
# TULIS KODEMU: jeda minimum (kolom: nasabah_id, tanggal, jeda_jam)
tercepat =

print("tercepat:", tercepat)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH s AS (
  SELECT nasabah_id, tanggal,
  LAG(tanggal) OVER (PARTITION BY nasabah_id ORDER BY tanggal) AS lalu
  FROM transaksi
)
SELECT nasabah_id, tanggal,
(julianday(tanggal) - julianday(lalu)) * 24 AS jeda_jam
FROM s
WHERE lalu IS NOT NULL
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: jeda minimum (kolom: nasabah_id, tanggal, jeda_jam)
tercepat = min(r[2] for r in rows)

print("tercepat:", tercepat)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "LAG", label: "Query memakai LAG", msg: "Pasangan berurutan memakai LAG(tanggal) OVER (PARTITION BY nasabah_id ORDER BY tanggal)." },
          { kind: "equal", task: "t2", name: "tercepat", value: 48.0, tol: 1e-9, label: "`tercepat` seharusnya 48.0", msg: "Jeda tersingkat = Andi: 1 Sep → 3 Sep = 48 jam." },
        ],
      },
      reference: "Impossible travel = LAG pasangan + aturan jarak/waktu; screening, bukan vonis.",
    },
    {
      id: "rule-tuning",
      eyebrow: "Langkah 4 · Rule tuning",
      title: "Presisi vs recall vs kapasitas tim",
      prose: [
        "Rule “≥5 transaksi/10 mnt”: menangkap 90% fraud (recall), tapi 98% alert adalah false positive (presisi 2%). Tim 5 orang, tiap alert 15 menit investigasi. 1000 alert/hari × 98% FP × 15 mnt = 245 jam/hari — kapasitas tim 40 jam/hari → butuh 6× lipat tim! Rule yang “menangkap banyak fraud” bisa tidak operasional — alert yang tidak diinvestigasi = tidak ada.",
        "Solusi: naikkan ambang (presisi naik, recall turun) atau skor gabungan (velocity + travel + nominal) lalu prioritaskan. Ukur rule seperti model ML: precision (% alert yang benar fraud) & recall (% fraud tertangkap). Rule tanpa metrik = tak bisa diperbaiki. Dan ingat skala: false positive 0,1% pada 1 juta nasabah = 1.000 nasabah sah terganggu — bencana operasional. Inilah mengapa tuning ambang = pekerjaan terpenting, bukan menambah rule.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Gabungkan sinyal lemah jadi skor kuat: velocity≥5 (+4), kota beda <2jam (+3), nominal bulat >1jt (+2), jam 00–05 (+1). ≥7 = auto-block + SMS; 4–6 = review 15 menit; <4 = log. Inilah cikal-bakal feature engineering untuk model ML.",
      },
      reference: "Desain rule = optimasi presisi × recall dalam batas kapasitas tim.",
    },
    {
      id: "minicase-47jt",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Rp 47 juta dalam 11 menit",
      prose: [
        "Alert: kartu X — 14 transaksi, 11 menit, 3 kota, Rp 47 juta. Pemilik tidur di Jakarta. Tugas: (1) tulis query velocity yang akan menangkap ini (jendela 15 menit, ambang?); (2) tulis query impossible travel-nya; (3) rancang aturan komposit (skor 0–10) + tindakan per level; (4) estimasi: jika ambang terlalu rendah, apa yang terjadi pada 1 juta nasabah?",
        "Pembahasan: (1) self-join jendela 15 menit, HAVING COUNT(*) >= 5 (ambang dari p99 historis). (2) LAG kota + jeda < 2 jam antar kota beda. (3) skor seperti langkah 4. (4) false positive 0,1% × 1 juta = 1.000 nasabah sah diblokir/hari = bencana call center!",
        "Pelajaran: fraud detection = statistik + operasional. Query menangkap pola; ambang menentukan bisnis. Dan pola ini menjadi fitur untuk model ML — rule-based hari ini, machine learning besok.",
      ],
      tasks: [],
      reference: "Velocity + impossible travel + skor komposit + tuning ambang.",
    },
    {
      id: "intuisi-velocity",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Velocity adalah pertanyaan tentang jendela waktu, bukan tentang transaksi",
      prose: [
        "Satu transaksi tidak pernah mencurigakan — yang mencurigakan adalah polanya dalam jendela waktu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: definisikan jendelanya dulu, baru hitung kecepatannya",
        body: "“14 transaksi dalam 11 menit” menjadi bermakna hanya karena jendelanya eksplisit: 11 menit. Ubah jendela menjadi 24 jam dan angka yang sama menjadi biasa saja. Inilah yang membedakan aturan fraud yang tajam dari yang berisik: jendela waktu yang dipilih dengan sadar. Heuristik praktisi: pilih jendela dari PERILAKU yang ingin ditangkap, bukan dari kemudahan query — card-present fraud bergerak dalam menit, account takeover dalam jam, structuring dalam hari. Jendela terlalu lebar menenggelamkan sinyal dalam noise (false negative); terlalu sempit memecah satu serangan menjadi potongan-potongan tak berbahaya (false negative juga, dari arah berlawanan). Dan selalu tanyakan: “jendela yang mana yang dipakai penyerang untuk berpikir?” — penyerang yang tahu batas “10 transaksi per jam” akan melakukan 9. Aturan yang baik memakai jendela bertingkat (5 menit, 1 jam, 24 jam) sehingga tidak ada satu batas pun yang bisa dipelajari dan diakali.",
      },
      reference: "Jendela dari perilaku yang ditangkap; bertingkat agar tak mudah diakali.",
    },
    {
      id: "velocity-skala",
      eyebrow: "Langkah 7 · Velocity skala",
      title: "Self-join lookback yang mahal, pra-agregasi, dan as-of join",
      prose: [
        "Pola velocity yang naif adalah self-join lookback: untuk tiap transaksi, join ke SEMUA transaksi kartu yang sama dalam jendela ke belakang, lalu hitung. SELECT t1.id, COUNT(*) FROM transaksi t1 JOIN transaksi t2 ON t2.kartu_id = t1.kartu_id AND t2.waktu BETWEEN t1.waktu - interval '1 jam' AND t1.waktu — secara logis benar, secara fisik bencana: tiap baris memindai ulang seluruh jendela, kompleksitas mendekati O(n × w) dengan w = rata-rata transaksi per jendela. Pada 50 juta transaksi dengan rata-rata 20 transaksi per kartu per jam, ini miliaran perbandingan per evaluasi aturan. Inilah query yang “jalan di lab, mati di produksi”.",
        "Strategi pra-agregasi membalik urutannya: hitung dulu ringkasan per kartu per bucket waktu yang kasar (mis. per 5 menit), baru evaluasi aturan di atas ringkasan. WITH agg AS (SELECT kartu_id, bucket_5m, COUNT(*) AS n, SUM(nominal) AS total FROM transaksi GROUP BY 1, 2) — 50 juta baris menjadi ratusan ribu bucket. Aturan “lebih dari 10 transaksi per jam” kemudian dihitung sebagai SUM(n) atas 12 bucket ke belakang per kartu — murah, dan bisa di-materialize sebagai tabel agregat yang di-refresh incremental (hanya bucket terbaru yang dihitung ulang). Harga yang dibayar: granularitas — bucket 5 menit tidak bisa menjawab “dalam 63 detik terakhir”; pilih granularitas dari jendela tersempit yang harus didukung.",
        "Untuk presisi penuh tanpa self-join, senjata modernnya adalah window function dengan RANGE frame atas interval waktu: COUNT(*) OVER (PARTITION BY kartu_id ORDER BY waktu RANGE BETWEEN INTERVAL '1 jam' PRECEDING AND CURRENT ROW) — satu sort per kartu, satu pass, tiap baris melihat tepat 1 jam ke belakang. Ini O(n log n), bukan O(n × w), dan semantiknya persis “jendela geser”. Syaratnya: database harus mendukung RANGE atas interval (Postgres ya; SQLite memakai pola subquery/join terbatas). Bila tidak tersedia, alternatifnya adalah “as-of join” ke tabel agregat: tiap transaksi di-join ke snapshot agregat per kartu per jam terakhir — bukan ke transaksi mentah.",
        "As-of join adalah pola yang lebih umum dari sekadar fraud: menggabungkan event dengan STATE pada saat event terjadi. “Limit kartu saat transaksi dilakukan” tidak boleh diambil dari tabel limit HARI INI (anakronisme — limitnya mungkin sudah berubah); ia harus di-join ke versi limit yang berlaku pada waktu transaksi (berlaku_dari <= waktu_transaksi). Tanpa ini, aturan “transaksi melebihi 80% limit” salah menilai ribuan transaksi historis — dan backtest aturan fraud-mu mengukur sesuatu yang tidak pernah terjadi. Aturan keras: setiap atribut yang berubah terhadap waktu dan dipakai dalam aturan/backtest WAJIB di-join secara as-of.",
        "Tiga aturan keputusan untuk velocity di produksi: (1) prototipe dengan window RANGE / self-join di sampel — validasi LOGIKA aturannya dulu (precision/recall di data berlabel); (2) untuk produksi, pra-agregasi ke bucket + evaluasi di atas bucket — pisahkan “menghitung ringkasan” (batch/incremental, murah) dari “mengevaluasi aturan” (real-time, di atas ringkasan kecil); (3) ukur biaya per evaluasi, bukan per query — aturan fraud dievaluasi ribuan kali per detik; query 50ms yang “cepat” untuk analis adalah bencana untuk 10.000 TPS. Dan satu peringatan operasional: jendela berbasis event-time (waktu transaksi) vs processing-time (waktu sistem menerima) — data yang telat datang (offline batch) membuat jendela processing-time salah total; selalu pakai event-time untuk logika, processing-time hanya untuk monitoring keterlambatan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Self-join lookback kan cuma sekali jalan semalam, tidak apa lambat.” Masalahnya bukan semalam — melainkan aturan yang sama biasanya diminta naik ke near-real-time (“blokir dalam 5 menit”), dan arsitektur yang dibangun di atas self-join tidak bisa dipindahkan begitu saja. Rancang untuk jendela geser sejak awal (pra-agregasi + window), meski batch pertamanya jalan semalam.",
      },
      reference: "Prototipe di sampel; produksi = pra-agregasi bucket + aturan di atasnya; atribut waktu-dependen wajib as-of.",
    },
    {
      id: "aturan-bertingkat",
      eyebrow: "Langkah 8 · Aturan bertingkat",
      title: "Aturan bertingkat, ekonomi alert, dan backtest",
      prose: [
        "Satu jendela tidak pernah cukup — penyerang yang tahu batas “10 transaksi/jam” akan melakukan 9. Arsitektur aturan yang matang memakai TINGKATAN: jendela sempit & ketat (5 menit, ambang rendah → skor +30), jendela menengah (1 jam → skor +20), jendela lebar (24 jam → skor +10) — skor digabung menjadi risk score, dan TINDAKAN ditentukan skornya: skor ≥ 70 → blokir otomatis; 40–70 → step-up authentication / review manual; < 40 → catat untuk pola. Keunggulannya: tidak ada satu batas pun yang bisa dipelajari penyerang, dan tiap aturan bisa di-tuning independen tanpa meruntuhkan sistem.",
        "Ekonomi alert — matematika yang menentukan ambang: setiap alert punya 4 biaya: true positive (fraud tertangkap: hemat Rp X), false positive (transaksi sah diblokir: nasabah marah + biaya review Rp Y), false negative (fraud lolos: rugi Rp Z), true negative (gratis). Ambang optimal BUKAN “precision tertinggi”, melainkan biaya total minimum: turunkan ambang → tangkap lebih banyak fraud (hemat Z) tetapi bayar lebih banyak review (Y) dan churn nasabah. Contoh konkret: aturan dengan precision 5% (95% alert adalah salah) bisa TETAP menguntungkan bila satu fraud Rp 50 juta dan satu review Rp 50 ribu — 19 review sia-sia (Rp 950 ribu) < 1 fraud tertangkap (Rp 50 juta). Analis yang hanya mengoptimasi precision tanpa memasukkan Rp akan mematikan aturan yang sebenarnya menghasilkan uang.",
        "Tetapi ada biaya yang tidak masuk spreadsheet: alert fatigue. Tim 5 analis dengan kapasitas 200 review/hari yang dibanjiri 2.000 alert/hari akan mulai “asal tutup” — dan fraud beneran lolos di antara yang asal-tutup. Aturan: kapasitas review adalah KONSTRAIN DESAIN — jumlah alert harian ≤ kapasitas × 0,8 (sisakan untuk investigasi mendalam). Bila aturan bagus melebihi kapasitas, solusinya BUKAN menaikkan ambang (membuang sinyal), melainkan tiering: alert skor tertinggi ke manusia, sisanya ke tindakan otomatis (step-up auth) atau antrean tunda. Dan ukur “time-to-close” + “reopen rate” — alert yang ditutup lalu fraud-nya kejadian adalah metrik kualitas triase yang jujur.",
        "Backtest & versioning aturan — disiplin yang memisahkan amatir: setiap perubahan ambang/logika WAJIB di-backtest atas data historis berlabel SEBELUM naik produksi: berapa yang akan tertangkap, berapa alert baru, berapa false positive baru. Tanpa backtest, “tuning” adalah tebak-tebakan yang dibayar dengan insiden. Versioning: tiap aturan punya versi (v3.2), tanggal efektif, dan alasan perubahan — saat fraud lolos, pertanyaan pertama adalah “aturan versi berapa yang aktif saat itu?” bukan “aturan kita apa?”. Dan satu aturan emas operasional: JANGAN ubah >1 aturan sekaligus tanpa jendela observasi — bila metrik bergerak, kamu harus tahu aturan mana yang menyebabkannya.",
        "Menutup dengan eskalasi tindakan yang proporsional: (1) catat (skor rendah — untuk analisis pola, bukan tindakan); (2) step-up authentication (minta OTP/biometrik — gesekan kecil, menangkap account takeover); (3) tahan sementara + review manual (transaksi besar mencurigakan); (4) blokir + bekukan (skor sangat tinggi / pola jelas). Kesalahan klasik adalah biner: blokir atau biarkan — padahal sebagian besar nilai fraud system ada di TENGAH (step-up auth): menangkap fraud dengan gesekan minimal. Aturan yang hanya bisa “blokir/lewat” akan selalu terlalu agresif atau terlalu longgar — tidak ada jalan tengahnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Target kita precision 99%.” Precision tanpa konteks biaya adalah vanity metric: aturan dengan precision 99% yang hanya menangkap 1% fraud (recall 1%) adalah aturan yang “akurat” tetapi tidak berguna. Yang dioptimasi adalah BIAYA TOTAL (fraud lolos × Rp + review × Rp + churn), bukan satu metrik tunggal. Minta selalu: berapa Rp yang dihemat per Rp biaya operasional?",
      },
      reference: "Aturan bertingkat + skor; ambang dari biaya total (Rp), bukan precision; backtest + versioning wajib.",
    },
    {
      id: "velocity-ml",
      eyebrow: "Langkah 9 · Velocity untuk ML",
      title: "Fitur velocity untuk model: freshness, leakage, dan jendela ganda",
      prose: [
        "Aturan (rule-based) menangkap pola yang DIKETAHUI; model ML menangkap pola yang TIDAK DIKETAHUI — tetapi keduanya makan fitur yang sama: velocity features. Tiga fitur kanonis: count_1h (jumlah transaksi 1 jam terakhir), sum_24h (total nominal 24 jam), distinct_merchant_7d (berapa merchant berbeda 7 hari) — semuanya adalah “agregat atas jendela geser per entitas”. Model fraud tanpa fitur velocity hampir selalu kalah dari model dengan fitur itu; perilakunya (“kecepatan”) lebih prediktif daripada atributnya (“umur kartu”).",
        "Tantangan produksinya ada dua. Pertama, FRESHNESS: fitur harus dihitung atas data hingga DETIK INI — model yang diberi fitur “24 jam terakhir” yang sebenarnya 26 jam (batch telat) membuat keputusan atas informasi basi; untuk fraud, 2 jam basi = 2 jam serangan tak terlihat. Arsitektur standarnya: streaming aggregation (Flink/Spark Streaming) atau pra-agregasi bucket mikro (Langkah 7) yang di-update near-real-time, BUKAN batch harian. Kedua, KONSISTENSI train-serve: fitur saat training (dihitung offline dari arsip) HARUS didefinisikan identik dengan fitur saat serving (dihitung real-time) — “sum_24h” yang di training memakai event-time tetapi di serving memakai processing-time adalah skew yang membuat model “bekerja di lab, gagal di produksi”. Solusinya: satu definisi fitur (feature store / satu kode agregasi) dipakai di kedua jalur.",
        "Leakage fitur adalah dosa yang spesifik untuk velocity: fitur yang “bocor” memakai informasi dari MASA DEPAN relatif terhadap label. Contoh klasik: label “fraud” ditentukan dari hasil investigasi 7 hari kemudian, tetapi fitur sum_24h dihitung mencakup 7 hari SETELAH transaksi (karena jendelanya tidak di-“as-of”-kan ke waktu transaksi). Model terlihat akurat luar biasa di backtest (AUC 0.99!) karena ia “melihat” masa depan — lalu anjlok di produksi. Aturan keras: setiap fitur velocity dihitung STRICTLY atas event dengan waktu ≤ waktu keputusan (as-of!), dan pipeline training memakai “as-of join” ke snapshot fitur historis — bukan tabel fitur terkini. Backtest yang tidak as-of bukan backtest; ia fantasi.",
        "Aturan keputusan untuk tim yang membangun keduanya (rules + ML): (1) rules untuk pola DIKETAHUI & butuh penjelasan (“blokir karena 14 transaksi/11 menit” bisa dijelaskan ke nasabah); (2) ML untuk pola TAK DIKETAHUI & skor risiko (prioritas antrean review); (3) keduanya berbagi fitur velocity yang sama — jangan bangun dua pipeline agregasi; (4) bila model dan rules tidak sepakat, eskalasi ke manusia — ketidaksepakatan adalah sinyal ketidakpastian, bukan bug. Dan metrik akhirnya selalu Rp: bukan AUC, melainkan “rupiah fraud dicegah per rupiah biaya operasional”.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Model dengan AUC 0.99 pasti bagus.” Untuk fraud, curigai dulu: AUC setinggi itu sering berarti leakage (fitur melihat masa depan) atau label yang bocor (fitur mengandung hasil investigasi). Validasi dengan “as-of backtest” yang ketat — bila AUC jatuh ke 0.75, itulah angka jujurnya, dan 0.75 yang jujur jauh lebih berguna daripada 0.99 yang bohong.",
      },
      reference: "Fitur velocity = agregat jendela per entitas; train-serve konsisten; semua fitur as-of (anti-leakage); metrik akhir = Rp.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Velocity: count/amount per jendela — self-join + ambang dari data.",
        "Impossible travel: LAG pasangan + aturan jarak/waktu.",
        "Rule komposit: gabung sinyal lemah jadi skor kuat (cikal feature engineering).",
        "Trade-off: rule = screening; ukur false positive; alert harus actionable.",
        "Rule-based hari ini → fitur ML besok.",
      ],
      next: { label: "C15 — Data Quality", href: "/learn/c15-data-quality" },
      quiz: [
        {
          q: "Velocity check memakai?",
          options: [
            { text: "GROUP BY biasa", why: "Salah — velocity butuh perbandingan tiap transaksi dengan jendelanya." },
            { text: "Self-join jendela waktu + ambang", why: "Benar. Tiap transaksi vs “saudara”-nya dalam jendela.", correct: true },
            { text: "LAG saja", why: "Salah — LAG untuk pasangan berurutan (impossible travel), bukan count per jendela." },
          ],
        },
        {
          q: "Ambang velocity sebaiknya dari?",
          options: [
            { text: "Tebakan", why: "Salah — ambang arbitrer = false positive membabi buta." },
            { text: "Percentile distribusi historis (mis. p99)", why: "Benar. Berbasis data — “1% teratas”.", correct: true },
            { text: "Copy bank lain", why: "Salah — perilaku nasabah tiap bank beda." },
          ],
        },
        {
          q: "Impossible travel memakai?",
          options: [
            { text: "COUNT", why: "Salah." },
            { text: "LAG untuk pasangan berurutan + aturan jarak/waktu", why: "Benar. Bandingkan lokasi & waktu transaksi berurutan.", correct: true },
            { text: "AVG", why: "Salah." },
          ],
        },
        {
          q: "Impossible travel terdeteksi = ?",
          options: [
            { text: "Pasti fraud, langsung blokir permanen", why: "Salah — VPN, dinas, merchant aneh = penjelasan sah." },
            { text: "Screening — verifikasi dulu sebelum tindakan", why: "Benar. Hubungi nasabah dulu.", correct: true },
            { text: "Abaikan", why: "Salah — tetap sinyal yang layak direview." },
          ],
        },
        {
          q: "False positive 0,1% pada 1 juta nasabah?",
          options: [
            { text: "Tidak masalah", why: "Salah — skala mengubah segalanya." },
            { text: "= 1.000 nasabah sah terganggu — bencana operasional", why: "Benar. Tuning ambang = pekerjaan terpenting.", correct: true },
            { text: "Bagus", why: "Salah." },
          ],
        },
      ],
    },
  ],
};
