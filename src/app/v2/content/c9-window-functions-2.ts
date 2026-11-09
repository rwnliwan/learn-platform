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

export const c9_2: V2Lesson = {
  slug: "c9-window-functions-2",
  track: "SQL",
  module: "Lanjutan",
  title: "C9.2 Window Functions: Agregat Berjalan & Bingkai",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-tembus",
      eyebrow: "Langkah 1 · Running total & frame",
      title: "Kapan kita tembus 10 juta?",
      prose: [
        "Direksi: “Kapan akumulasi transaksi kita tembus 10 juta bulan ini? Dan bagaimana tren rata-rata 7 hariannya?” Running total + moving average = dua jawaban dalam satu query. Running total menjawab “kapan tembus X” — pertanyaan yang tidak bisa dijawab GROUP BY, karena ia butuh urutan (“sebelum/sesudah”)! Agregasi klasik tidak kenal waktu; window function membawa dimensi waktu ke dalam SQL.",
        "Frame = “baris mana yang ikut dihitung untuk baris ini”: `SUM(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` = running total. Default saat ada ORDER BY: `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — RANGE memperlakukan nilai kembar sebagai satu (peer)! Beda dengan ROWS (baris fisik). Eksplisit selalu lebih aman daripada mengandalkan default.",
        "Pola “kapan tembus X”: `WITH r AS (...running total...) SELECT MIN(tanggal) FROM r WHERE akumulasi >= 10000000` — lagi-lagi pola CTE + saring dari Part 1.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“ROWS dan RANGE sama saja.” Beda saat ada nilai ORDER BY kembar! ROWS = baris fisik; RANGE = nilai logis (semua yang sama nilainya dihitung bersama). Tulis frame eksplisit.",
      },
      reference: "SUM OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING → CURRENT ROW) = running total.",
    },
    {
      id: "lab-running",
      eyebrow: "Langkah 2 · Lab running total",
      title: "Kapan akumulasi tembus 3 juta?",
      prose: [
        "Untuk nasabah 2, transaksinya: 1 Sep = 1jt, 10 Sep = 2jt, 25 Sep = 400rb. Running total: 1jt → 3jt → 3,4jt. Pada tanggal berapa akumulasi pertama kali ≥ 3 juta?",
        "Bangun CTE running total dengan frame eksplisit, lalu ambil MIN(tanggal) yang akumulasinya ≥ 3000000.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: CTE running total nasabah 2, lalu `SELECT MIN(tanggal)` saat akumulasi >= 3000000" },
        { id: "t2", text: "Ambil `tgl` dari hasil dan pastikan = '2026-09-10'" },
      ],
      expected: "tgl = 2026-09-10 (akumulasi: 1jt → 3jt → 3,4jt)",
      hints: [
        "CTE: WITH r AS (SELECT tanggal, SUM(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS akumulasi FROM transaksi WHERE nasabah_id = 2).",
        "Lalu SELECT MIN(tanggal) FROM r WHERE akumulasi >= 3000000.",
        "tgl = rows[0][0]  →  '2026-09-10'.",
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
# TULIS KODEMU: ambil tanggal dari hasil
tgl =

print("tgl:", tgl)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH r AS (
  SELECT tanggal,
  SUM(jumlah) OVER (ORDER BY tanggal
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS akumulasi
  FROM transaksi WHERE nasabah_id = 2
)
SELECT MIN(tanggal) FROM r WHERE akumulasi >= 3000000
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: ambil tanggal dari hasil
tgl = rows[0][0]

print("tgl:", tgl)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "UNBOUNDED PRECEDING", label: "Query memakai frame eksplisit", msg: "Tulis frame-nya eksplisit: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW." },
          { kind: "equal", task: "t2", name: "tgl", value: "2026-09-10", label: "`tgl` seharusnya 2026-09-10", msg: "Akumulasi: 1jt (1 Sep) → 3jt (10 Sep) → 3,4jt (25 Sep). Pertama kali ≥ 3jt = 10 Sep." },
        ],
      },
      reference: "Pola “kapan tembus X”: running total di CTE, MIN(tanggal) di luar.",
    },
    {
      id: "moving-average",
      eyebrow: "Langkah 3 · Moving average",
      title: "Menghaluskan noise",
      prose: [
        "`AVG(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` = MA-3 (jendela 3 baris: ini + 2 sebelumnya). Kapan: menghaluskan noise harian, tren 7-hari, deteksi anomali (aktual vs MA). Tepi: 2 baris pertama rata-rata dari < 3 baris — tandai atau abaikan periode pemanasan.",
        "MA terpusat: `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` — tapi baris terakhir tak punya “sesudah”. Dan MA “30 hari sebelum hari ini” (tidak termasuk hari ini, agar tidak bocor): `ROWS BETWEEN 30 PRECEDING AND 1 PRECEDING`. Untuk analisis berat (banyak jendela, statistik), pindahkan ke pandas — SQL cocok untuk MA sederhana di query laporan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Moving average 3 hari — frame yang benar?",
          options: [
            { text: "ROWS BETWEEN 3 PRECEDING AND CURRENT ROW", why: "Salah — itu 4 baris (3 sebelum + ini)." },
            { text: "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW", why: "Benar. 2 sebelum + ini = 3 baris.", correct: true },
            { text: "Tanpa frame", why: "Salah — tanpa frame eksplisit = default RANGE (running, bukan MA-3)." },
          ],
        },
        {
          q: "Frame default saat OVER (ORDER BY x)?",
          options: [
            { text: "ROWS UNBOUNDED PRECEDING → CURRENT ROW", why: "Salah — default-nya RANGE, bukan ROWS." },
            { text: "RANGE UNBOUNDED PRECEDING → CURRENT ROW", why: "Benar. RANGE memperlakukan nilai kembar sebagai peer. Tulis eksplisit agar aman.", correct: true },
            { text: "Hanya baris ini", why: "Salah." },
          ],
        },
      ],
      reference: "MA-n: ROWS BETWEEN (n-1) PRECEDING AND CURRENT ROW. Waspadai tepi jendela.",
    },
    {
      id: "lab-kuartil",
      eyebrow: "Langkah 4 · Lab NTILE & pangsa",
      title: "Kuartil dan % of total",
      prose: [
        "`NTILE(4) OVER (ORDER BY penghasilan)` membagi urutan jadi 4 grup sama besar (kuartil); `NTILE(10)` = desil. Hati-hati: NTILE membagi jumlah baris sama besar, bukan nilai sama lebar — untuk “20% nasabah teratas” NTILE tepat; untuk “penghasilan 0–5jt, 5–10jt” pakai CASE (C2).",
        "`SUM(x) OVER ()` (OVER kosong = semua baris) = total keseluruhan → % of total. Pangsa kumulatif (diurut DESC) = kurva konsentrasi: berapa % transaksi dikuasai top-N nasabah (Pareto!). Dua window berbeda dalam satu SELECT — tidak perlu dua query, tidak perlu join ke total.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: nama, penghasilan, dan kuartil (`NTILE(4) OVER (ORDER BY penghasilan)`) tiap nasabah" },
        { id: "t2", text: "Ambil `kd` = kuartil Dewi dan pastikan = 4" },
      ],
      expected: "baris: 10; Dewi (15jt, tertinggi) di kuartil 4",
      hints: [
        "SELECT nama, penghasilan, NTILE(4) OVER (ORDER BY penghasilan) AS kuartil FROM nasabah.",
        "NULL (Eko) terurut pertama di ASC — ia masuk kuartil 1.",
        "kd = [r[2] for r in rows if r[0] == 'Dewi'][0]  →  4.",
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
# TULIS KODEMU: kuartil Dewi
kd =

print("kd:", kd)
for r in rows:
    print(r)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT nama, penghasilan,
NTILE(4) OVER (ORDER BY penghasilan) AS kuartil
FROM nasabah
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: kuartil Dewi
kd = [r[2] for r in rows if r[0] == 'Dewi'][0]

print("kd:", kd)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "NTILE", label: "Query memakai NTILE", msg: "Bagi jadi kuartil dengan NTILE(4) OVER (ORDER BY penghasilan)." },
          { kind: "equal", task: "t2", name: "kd", value: 4, tol: 1e-9, label: "`kd` seharusnya 4", msg: "Dewi berpenghasilan tertinggi (15jt) → kuartil 4." },
        ],
      },
      reference: "NTILE(n) bagi baris sama besar; SUM(x) OVER () = total untuk % of total.",
    },
    {
      id: "minicase-anomali",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Anomali vs moving average",
      prose: [
        "Risk meminta: “Tandai transaksi harian yang > 2× moving average 3-hari-nya sebagai anomali untuk direview.” Query-nya: `WITH m AS (SELECT tanggal, jumlah, AVG(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING) AS ma3 FROM transaksi) SELECT * FROM m WHERE jumlah > 2 * ma3;` — MA dari 3 hari sebelumnya, tidak termasuk hari ini, agar tidak “bocor”.",
        "Kelemahan aturan “2×”: (1) 2× arbitrer — tidak berbasis distribusi (harusnya z-score!); (2) MA-3 sensitif outlier; (3) pola musiman (weekend) tidak tertangkap. Pelajaran: SQL bagus untuk screening anomali; validasi statistiknya di Python. Tahu batas alatmu!",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rule “> 2× MA” tanpa tuning = false positive membabi buta. Di fraud (C14), ambang harus dari percentile distribusi historis, bukan tebakan — dan rule adalah screening, bukan vonis.",
      },
      reference: "MA untuk screening anomali; frame mundur (tidak termasuk hari ini) agar tidak bocor.",
    },
    {
      id: "intuisi-window2",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Window function yang tidak deterministik adalah generator angka acak yang sopan",
      prose: [
        "Query yang hasilnya boleh berbeda tiap dijalankan tanpa ada yang salah secara sintaks — itulah window tanpa tie-breaker.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: bila hasilnya dipakai untuk keputusan, urutannya harus deterministik penuh",
        body: "Ada dua jenis query window: yang untuk dilihat manusia (chart tren, eksplorasi) dan yang untuk KEPUTUSAN (siapa top 10, baris mana yang dipertahankan dari duplikat, cutoff kelayakan). Untuk jenis pertama, urutan ties yang acak tidak masalah. Untuk jenis kedua, ia adalah bug: “10 nasabah terbaik” yang berbeda setiap refresh menghancurkan kepercayaan pada laporan, dan dedup yang kadang mempertahankan baris A kadang baris B membuat rekonsiliasi mustahil. Heuristiknya brutal dan sederhana: setiap OVER (ORDER BY ...) yang hasilnya memengaruhi keputusan WAJIB berakhir pada kunci unik (ORDER BY skor DESC, id ASC). Biaya tambahannya nol — tetapi ia mengubah query dari “biasanya benar” menjadi “terbukti deterministik”. Dan uji termudahnya: jalankan query dua kali, bandingkan hasilnya baris per baris. Bila berbeda tanpa perubahan data, kamu punya undian berkedok query.",
      },
      reference: "Keputusan → ORDER BY diakhiri kunci unik; uji dengan menjalankan dua kali.",
    },
    {
      id: "dedup-rownumber",
      eyebrow: "Langkah 7 · Dedup deterministik",
      title: "Pola dedup ROW_NUMBER: memilih pemenang dengan aturan eksplisit",
      prose: [
        "Pola dedup paling kanonis di SQL modern: WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY kunci_dedup ORDER BY prioritas DESC, id ASC) AS rn FROM t) SELECT * FROM ranked WHERE rn = 1. Tiga keputusan tersembunyi di satu pola ini — dan ketiganya harus eksplisit. Pertama, PARTITION BY mendefinisikan “duplikat” (baris mana yang dianggap sama): salah memilih kunci (mis. nama saja tanpa tanggal lahir) berarti menggabungkan dua orang berbeda. Kedua, ORDER BY mendefinisikan “pemenang”: baris terbaru? nilai terbesar? sumber paling tepercaya? Ketiga, tie-breaker kunci unik (id) menjamin determinisme saat prioritas seri.",
        "Kapan pola ini GAGAL — tiga mode kegagalan nyata: (1) kunci dedup salah — PARTITION BY email padahal satu orang punya 3 email (data hasil merger) → “dedup” justru membuang pelanggan berbeda; solusinya bukan query lebih pintar, melainkan master data / entity resolution di hulu; (2) aturan pemenang ambigu — ORDER BY tanggal DESC tanpa tie-breaker atas dua baris bertanggal sama → pemenang acak antar eksekusi, dan laporan “data master” berubah-ubah; (3) dedup di level yang salah — mendup transaksi sebelum agregasi vs sesudahnya menghasilkan angka berbeda; putuskan grain kebenaran dulu (1 baris = 1 apa?) baru tulis query-nya.",
        "Variasi pola untuk kebutuhan berbeda: butuh M baris terbaik per grup (top-3 produk per kategori)? → WHERE rn <= 3. Butuh menandai duplikat tanpa membuang (untuk audit)? → biarkan rn tampil sebagai kolom flag, jangan filter. Butuh menghapus duplikat fisik di tabel? → DELETE memakai CTE yang sama (di Postgres/SQLite: WITH ranked AS (...) DELETE FROM t WHERE id IN (SELECT id FROM ranked WHERE rn > 1)) — tetapi JANGAN hapus sebelum memverifikasi hitungannya (COUNT rn=1 vs COUNT total, selisih = yang akan hilang) dan backup dulu. Dedup destruktif tanpa verifikasi adalah cara tercepat kehilangan data yang tidak bisa dikembalikan.",
        "Perbandingan dengan alternatif: GROUP BY + agregat (MIN/MAX) untuk dedup hanya bisa mempertahankan SATU kolom agregat per grup — kamu kehilangan baris utuhnya (tidak bisa tahu “baris mana” yang menang secara utuh). DISTINCT ON (Postgres) lebih ringkas untuk kasus ini, tetapi tidak portabel dan tidak memberi nomor urut untuk analisis lanjutan. ROW_NUMBER menang karena: mempertahankan seluruh baris pemenang, memberi peringkat untuk analisis (rn = 2, 3 adalah “cadangan”), dan portabel ke semua database modern. Aturan keputusan: dedup butuh “baris utuh pemenang” → ROW_NUMBER; hanya butuh nilai agregat → GROUP BY cukup.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Dedup dengan GROUP BY kunci + MAX(tanggal) sudah cukup.” Cukup hanya bila kamu butuh tanggalnya saja. Begitu laporan butuh kolom lain dari baris pemenang (nominal, kota, status), MAX per kolom mengambil nilai dari BARIS BERBEDA — Frankenstein: tanggal dari baris A, nominal dari baris B. ROW_NUMBER mempertahankan baris utuh; agregat per kolom tidak.",
      },
      reference: "PARTITION BY = definisi duplikat; ORDER BY + tie-breaker = definisi pemenang; verifikasi sebelum DELETE.",
    },
    {
      id: "ranking-ties",
      eyebrow: "Langkah 9 · Ranking & ties",
      title: "RANK vs DENSE_RANK vs ROW_NUMBER: siapa menang saat seri",
      prose: [
        "Tiga fungsi ranking menjawab tiga pertanyaan berbeda tentang ties (nilai seri). Data: skor [100, 90, 90, 80]. ROW_NUMBER memberi [1, 2, 3, 4] — seri dipecah paksa (dengan tie-breaker, atau acak bila tidak ada). RANK memberi [1, 2, 2, 4] — seri berbagi peringkat, peringkat berikutnya MELOMPAT (tidak ada peringkat 3). DENSE_RANK memberi [1, 2, 2, 3] — seri berbagi, tanpa lompatan. Pilihannya bukan gaya — ia mengubah SIAPA yang lolos cutoff.",
        "Kasus keputusan “top 3 dapat bonus”: dengan RANK, WHERE rank <= 3 atas data di atas meloloskan 3 orang (peringkat 1, 2, 2) — benar 3 orang. Dengan ROW_NUMBER, 3 orang juga — tetapi SIAPA di antara dua yang seri 90 ditentukan tie-breaker (atau acak!). Dengan DENSE_RANK <= 3, lolos 4 orang (1, 2, 2, 3). Tiga fungsi, tiga daftar penerima bonus. Aturan: (1) “N orang” eksak → ROW_NUMBER + tie-breaker deterministik (adil prosedural, kejam pada yang seri); (2) “semua yang memenuhi standar” → RANK/DENSE_RANK dengan cutoff NILAI (skor >= 90), bukan cutoff peringkat — yang seri diperlakukan sama (adil substantif); (3) jangan pernah memakai ROW_NUMBER tanpa tie-breaker untuk keputusan — “acak” bukan prosedur yang bisa dipertahankan di depan komite.",
        "NTILE(n) — membagi urutan menjadi n keranjang — punya jebakan distribusi: NTILE(4) atas 10 baris memberi keranjang [3, 3, 2, 2] — tidak sama besar! Dan yang lebih licik: NTILE atas data dengan ties BESAR (1.000 baris bernilai sama dari 10.000) memecah ties secara arbitrer ke keranjang berbeda — dua nasabah dengan skor IDENTIK masuk decile berbeda. Untuk segmentasi (“decile risiko”), ini tidak adil dan tidak stabil. Alternatif yang benar: WIDTH_BUCKET / CASE atas NILAI (bukan urutan) — keranjang berdasarkan rentang skor, sehingga yang sama skornya selalu sekeranjang; atau CUME_DIST (proporsi kumulatif) untuk cutoff persen yang menghormati ties.",
        "PERCENT_RANK dan CUME_DIST untuk cutoff yang jujur: “masuk 10% teratas” seharusnya berarti CUME_DIST <= 0.10 — proporsi nilai ≤ nilai ini — yang otomatis mengikutkan SEMUA ties di batas (bila 12% berbagi nilai batas, 12% lolos; itu benar secara definisi “10% teratas” yang adil). Memakai ROW_NUMBER <= 10% × N justru memenggal ties secara arbitrer. Aturan keputusan: cutoff berbasis NILAI/PROPORSIties-aware (CUME_DIST, RANK atas nilai) untuk keadilan; ROW_NUMBER hanya untuk kuota eksak yang prosedurnya didokumentasikan dan tie-breaker-nya eksplisit.",
      ],
      tasks: [],
      reference: "Kuota eksak → ROW_NUMBER + tie-breaker; keadilan ties → RANK/CUME_DIST; NTILE memecah ties arbitrer.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Running total: SUM OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING → CURRENT ROW).",
        "Moving average: AVG OVER (... ROWS n PRECEDING → CURRENT ROW).",
        "Frame eksplisit; waspadai default RANGE & tepi jendela.",
        "NTILE (bagi baris), % of total (OVER kosong), pangsa kumulatif (konsentrasi).",
        "Window lengkap — skill SQL nomor satu interview sudah di tanganmu.",
      ],
      next: { label: "C10 — Dedupe, Pivot & YoY", href: "/v2/learn/c10-dedupe-pivot-yoy" },
      quiz: [
        {
          q: "`SUM(x) OVER (ORDER BY t)` vs `SUM(x) OVER ()` — bedanya?",
          options: [
            { text: "Sama", why: "Salah — frame-nya beda." },
            { text: "Dengan ORDER BY = running total; tanpa = total keseluruhan di semua baris", why: "Benar. Yang pertama untuk “akumulasi sampai saat ini”; yang kedua untuk “% terhadap total”.", correct: true },
            { text: "Yang kedua error", why: "Salah — OVER kosong valid." },
          ],
        },
        {
          q: "ROWS vs RANGE beda saat?",
          options: [
            { text: "Selalu sama", why: "Salah." },
            { text: "Ada nilai ORDER BY kembar", why: "Benar. ROWS = fisik, RANGE = logis (peer).", correct: true },
            { text: "Hanya 1 baris", why: "Salah." },
          ],
        },
        {
          q: "NTILE(4) membagi berdasar?",
          options: [
            { text: "Nilai sama lebar", why: "Salah — itu binning nilai (WIDTH_BUCKET/CASE)." },
            { text: "Jumlah baris sama besar", why: "Benar. Untuk “25% teratas”, NTILE yang tepat.", correct: true },
            { text: "Acak", why: "Salah." },
          ],
        },
        {
          q: "YTD (year-to-date) memakai?",
          options: [
            { text: "SUM OVER ()", why: "Salah — itu total keseluruhan, tidak reset per tahun." },
            { text: "Running total PARTITION BY tahun", why: "Benar. Akumulasi yang reset tiap tahun.", correct: true },
            { text: "LAG 12", why: "Salah — itu YoY, bukan YTD." },
          ],
        },
        {
          q: "Kelemahan aturan “anomali = > 2× MA”?",
          options: [
            { text: "Tidak ada", why: "Salah — tiga kelemahan di opsi berikut." },
            { text: "Ambang arbitrer, sensitif outlier, abaikan musiman — screening saja", why: "Benar. SQL untuk screening; validasi statistik di Python.", correct: true },
            { text: "Tidak bisa di SQL", why: "Salah — bisa, query-nya ada di mini-case." },
          ],
        },
      ],
    },
  ],
};
