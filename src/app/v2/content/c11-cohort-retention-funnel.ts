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

export const c11: V2Lesson = {
  slug: "c11-cohort-retention-funnel",
  track: "SQL",
  module: "Lanjutan",
  title: "C11 Cohort, Retention & Funnel: Analisis Perilaku",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-cmo",
      eyebrow: "Langkah 1 · Cohort",
      title: "Kenapa nasabah pergi?",
      prose: [
        "CMO: “Akuisisi naik 30%, tapi transaksi total stagnan. Ke mana perginya nasabah baru?” Jawabannya ada di cohort retention: nasabah Januari — berapa % yang masih transaksi di Februari? Maret? Ternyata: 70% nasabah baru tidak pernah transaksi lagi setelah bulan pertama. Masalahnya bukan akuisisi — tapi aktivasi. Satu analisis cohort mengubah strategi marketing Rp 2 miliar.",
        "Akuisisi naik 30% — kabar baik yang ternyata kabar buruk. Metrik agregat (“total transaksi stagnan”) menyembunyikan dua cerita berlawanan: akuisisi yang bagus dan aktivasi yang buruk. Cohort tidak menambah satu byte data pun — ia hanya memotong data dengan cara yang jujur.",
        "Cohort = kelompok berdasar waktu akuisisi (bulan daftar). Retention = % cohort yang masih aktif di periode ke-n. Langkah: tentukan akuisisi (MIN tanggal) → gabung aktivitas → pivot per periode. Retention rate = aktif_periode_n / n_cohort. Di credit risk, cohort = vintage kredit (C13) — analisis yang sama, domain berbeda.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Retention = 1 − churn, jadi sama saja.” Berhubungan tapi beda lensa: retention per cohort menjawab “apakah produk makin baik untuk pengguna baru?”; churn agregat tercemar komposisi (banyak pengguna baru = churn terlihat rendah!). Cohort = lensa yang jujur.",
      },
      quiz: [
        {
          q: "Cohort didefinisikan berdasar?",
          options: [
            { text: "Waktu kalender", why: "Salah — itu potongan waktu biasa, bukan cohort." },
            { text: "Waktu akuisisi (masuk)", why: "Benar. Kelompok per angkatan masuk — untuk melihat kualitas per generasi.", correct: true },
            { text: "Nilai transaksi", why: "Salah — itu segmentasi nilai, bukan cohort." },
          ],
        },
        {
          q: "Keunggulan cohort dibanding churn agregat?",
          options: [
            { text: "Sama", why: "Salah." },
            { text: "Cohort bebas distorsi komposisi — menunjukkan tren kualitas", why: "Benar. Banyak pengguna baru menutupi churn buruk di angka agregat.", correct: true },
            { text: "Churn tidak berguna", why: "Salah — churn tetap berguna, hanya lensanya beda." },
          ],
        },
      ],
      reference: "Cohort = kelompok per waktu akuisisi; retention = % aktif per periode sejak akuisisi.",
    },
    {
      id: "funnel",
      eyebrow: "Langkah 2 · Funnel",
      title: "Di tahap mana bocornya?",
      prose: [
        "Funnel = tahap berurutan (daftar → verifikasi → transaksi pertama → repeat). Tiap tahap menyaring. Conversion rate antar tahap = n_tahap_berikut / n_tahap_ini. Drop-off terbesar = prioritas perbaikan produk. Funnel mengubah “konversi rendah” (gejala) menjadi “tahap X bocor sebesar Y” (diagnosis).",
        "Di data lab: 10 nasabah terdaftar → 10 punya ≥1 transaksi → 2 punya ≥3 transaksi (hanya Andi dan Budi yang repeat). Konversi daftar→transaksi = 100%, tapi transaksi→repeat = 20% — bocornya di repeat, bukan di aktivasi. Funnel + cohort lebih ampuh: “apakah funnel membaik per cohort?”",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: funnel daftar → ≥1 transaksi → ≥3 transaksi (CTE + EXISTS/COUNT), tampilkan n tiap tahap" },
        { id: "t2", text: "Hitung `r3` = jumlah nasabah dengan ≥3 transaksi dan pastikan = 2" },
      ],
      expected: "daftar=10, trx1=10, trx3=2 — bocor di repeat (20%)",
      hints: [
        "CTE: WITH f AS (SELECT n.id, CASE WHEN EXISTS (SELECT 1 FROM transaksi t WHERE t.nasabah_id = n.id) THEN 1 ELSE 0 END AS t1, CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) >= 3 THEN 1 ELSE 0 END AS t3 FROM nasabah n).",
        "Lalu SELECT COUNT(*) AS daftar, SUM(t1) AS trx1, SUM(t3) AS trx3 FROM f.",
        "r3 = rows[0][2]  →  2 (hanya Andi dan Budi yang transaksi ≥3×).",
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
# TULIS KODEMU: jumlah nasabah dengan >=3 transaksi
r3 =

print("r3:", r3)
print(rows[0])`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH f AS (
  SELECT n.id,
  CASE WHEN EXISTS (SELECT 1 FROM transaksi t WHERE t.nasabah_id = n.id) THEN 1 ELSE 0 END AS t1,
  CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) >= 3 THEN 1 ELSE 0 END AS t3
  FROM nasabah n
)
SELECT COUNT(*) AS daftar, SUM(t1) AS trx1, SUM(t3) AS trx3,
SUM(t1) * 1.0 / COUNT(*) AS conv_ke_trx
FROM f
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: jumlah nasabah dengan >=3 transaksi
r3 = rows[0][2]

print("r3:", r3)
print(rows[0])`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "r3", value: 2, tol: 1e-9, label: "`r3` seharusnya 2", msg: "Yang transaksi ≥3×: Andi (3) dan Budi (3). Sisanya 1–2×." },
          { kind: "stdout_matches", task: "t1", pattern: "\\(10, 10, 2", label: "Funnel = (10, 10, 2)", msg: "daftar=10, trx1=10, trx3=2. Cek CASE WHEN dan EXISTS-mu." },
        ],
      },
      reference: "Funnel: ukur tiap tahap + konversi antar tahap; drop-off terbesar = prioritas.",
    },
    {
      id: "gaps-islands",
      eyebrow: "Langkah 3 · Gaps & islands",
      title: "Streak hari aktif",
      prose: [
        "Sessionization: kelompokkan event berurutan menjadi “sesi” jika jeda < X — tandai awal sesi dari jeda (LAG + ambang), lalu running SUM memberi ID sesi. Gaps-and-islands: temukan rentang berurutan (islands) vs lubang (gaps). Triknya: untuk deret harian berurutan, `tanggal − row_number` konstan → GROUP BY nilai itu = islands!",
        "“Gaps-and-islands hanya teka-teki interview” — justru pola produksi: streak login, consecutive DPD (kolektibilitas!), pola transaksi fraud beruntun. Interview menanyakannya karena dipakai di produksi. Di lab ini: temukan streak hari aktif transaksi terpanjang.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: island tanggal transaksi berurutan dengan trik `date(tanggal, '-' || ROW_NUMBER() OVER (ORDER BY tanggal) || ' days')`" },
        { id: "t2", text: "Hitung `terpanjang` = island terpanjang (hari) dan pastikan = 4" },
      ],
      expected: "terpanjang = 4 hari (25–28 Sep 2026)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Streak DPD beruntun = sinyal kolektibilitas memburuk; streak transaksi beruntun = pola velocity fraud (C14). Trik tanggal − row_number mengubah keduanya jadi GROUP BY sederhana.",
      },
      hints: [
        "WITH r AS (SELECT tanggal, date(tanggal, '-' || ROW_NUMBER() OVER (ORDER BY tanggal) || ' days') AS grp FROM (SELECT DISTINCT tanggal FROM transaksi)).",
        "Lalu SELECT MIN(tanggal), MAX(tanggal), COUNT(*) AS hari FROM r GROUP BY grp.",
        "terpanjang = max(r[2] for r in rows)  →  4 (25,26,27,28 Sep berurutan).",
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
# TULIS KODEMU: island terpanjang (kolom: mulai, selesai, hari)
terpanjang =

print("terpanjang:", terpanjang)
for r in rows:
    print(r)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH r AS (
  SELECT tanggal,
  date(tanggal, '-' || ROW_NUMBER() OVER (ORDER BY tanggal) || ' days') AS grp
  FROM (SELECT DISTINCT tanggal FROM transaksi)
)
SELECT MIN(tanggal) AS mulai, MAX(tanggal) AS selesai, COUNT(*) AS hari
FROM r GROUP BY grp
ORDER BY hari DESC
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: island terpanjang (kolom: mulai, selesai, hari)
terpanjang = max(r[2] for r in rows)

print("terpanjang:", terpanjang)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "ROW_NUMBER", label: "Query memakai trik row_number", msg: "Trik gaps-and-islands: tanggal − row_number = konstan per island." },
          { kind: "equal", task: "t2", name: "terpanjang", value: 4, tol: 1e-9, label: "`terpanjang` seharusnya 4", msg: "Tanggal transaksi: 1,2,3 lalu 5, 8, 10, 12, 15, 20,21, lalu 25,26,27,28. Island terpanjang = 25–28 (4 hari)." },
        ],
      },
      reference: "Gaps-and-islands: tanggal − row_number = konstan → GROUP BY.",
    },
    {
      id: "minicase-akuisisi",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Misteri akuisisi naik, transaksi stagnan",
      prose: [
        "Situasi: akuisisi +30% (dari kampanye), tapi total transaksi stagnan. CMO curiga “nasabah baru tidak aktif”. Tugas: (1) buat cohort berdasar bulan transaksi pertama; (2) hitung % yang transaksi lagi di bulan berikutnya (retensi M1); (3) buat funnel daftar → trx pertama; (4) tulis rekomendasi 3 kalimat untuk CMO.",
        "Pembahasan: di data lab, funnel daftar→trx = 100% (10/10) tapi repeat hanya 20% (2/10) — dan dengan data 1 bulan, cohort M1 tak terhitung. Dan itu pelajarannya: analisis cohort butuh rentang waktu cukup! Rekomendasi contoh: “Kampanye berhasil di akuisisi (+30%) tapi repeat hanya 20%. Alihkan 50% budget kampanye ke program aktivasi 7-hari pertama — akuisisi tanpa aktivasi = ember bocor.”",
        "Pelajaran: analisis perilaku mengubah debat opini (“marketing gagal!”) menjadi diagnosis presisi (“bocor di repeat”). Inilah nilai analyst.",
      ],
      tasks: [],
      reference: "Diagnosis perilaku = cohort (kualitas) × funnel (lokasi bocor).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Analisis perilaku: alat mana untuk apa",
      prose: [
        "“Apakah produk makin baik?” → cohort retention (bebas distorsi komposisi; diagonal = tren waktu). “Di mana bocornya?” → funnel (drop-off terbesar = prioritas). “Kelompokkan event berdekatan” → sessionization (LAG + ambang jeda + running SUM). “Streak/gap berurutan” → gaps-and-islands (tanggal − row_number). Kombinasi → cohort × funnel: apakah funnel membaik per cohort?",
        "Aturan praktis: cohort = kelompok berdasar waktu akuisisi, bukan waktu kalender. Funnel: ukur tiap tahap + konversi antar tahap. Selalu gabung cohort × funnel untuk cerita lengkap.",
      ],
      tasks: [],
      reference: "Cohort untuk kualitas, funnel untuk lokasi bocor, gaps-and-islands untuk streak.",
    },
    {
      id: "intuisi-cohort",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Cohort membandingkan apel dengan apel; agregat membandingkan apel dengan kebun",
      prose: [
        "Nilai cohort bukan pada angkanya — melainkan pada apa yang ia cegah: kesimpulan dari perbandingan yang tidak sebanding.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: setiap metrik waktu harus menjawab “dibandingkan dengan apa, pada umur yang sama”",
        body: "“Retensi bulan ini turun” adalah kalimat yang tidak lengkap — turun DIBANDINGKAN apa? Cohort Januari di umur 3 bulan vs cohort Februari di umur 3 bulan adalah perbandingan yang jujur; cohort Januari umur 6 bulan vs cohort Juni umur 1 bulan adalah perbandingan apel dengan kebun. Heuristik praktisi: sumbu-X analisis cohort bukanlah “bulan kalender” melainkan “umur sejak akuisisi” — begitu kamu memplot berdasarkan umur, anomali musiman dan efek bauran (mix effect) terpisah dengan sendirinya. Dan waspadai cohort kecil: retensi 50% dari cohort 4 orang adalah 2 orang — bukan insight, melainkan noise berpakaian persen. Aturan: jangan pernah mengambil keputusan dari sel cohort di bawah ~30 entitas tanpa menggabungkannya; persen tanpa penyebut adalah cara termanis untuk berbohong pada diri sendiri.",
      },
      reference: "Bandingkan pada umur yang sama; sel kecil = noise, bukan insight.",
    },
    {
      id: "spine-funnel",
      eyebrow: "Langkah 7 · Spine & funnel",
      title: "Date spine yang jujur dan definisi funnel yang konsisten",
      prose: [
        "Date spine (deret tanggal kontinu) adalah fondasi semua analisis cohort — dan fondasi yang berlubang menghasilkan chart yang berlubang. Dua kegagalan klasik: (1) spine tidak mencakup rentang penuh — cohort yang lahir di luar rentang spine hilang dari analisis tanpa peringatan, sehingga “retensi turun” ternyata “datanya tidak ikut”; (2) granularitas spine tidak cocok dengan definisi umur — spine harian untuk analisis retensi bulanan membuatmu menggabungkan 30 baris per sel dengan aturan yang ambigu (hari ke-30? rata-rata?). Aturan: bangun spine dari MIN(tanggal_akuisisi) hingga hari ini pada granularitas analisis (bulanan untuk retensi bulanan), dan validasi coverage-nya — COUNT cohort di spine vs COUNT DISTINCT cohort di data mentah harus sama. Selisihnya adalah cohort yang hilang.",
        "Funnel punya musuh yang lebih licik: definisi step yang bergeser antar laporan. “Checkout” di laporan marketing = klik tombol bayar; di laporan produk = pembayaran berhasil — conversion rate yang sama angkanya beda 40% tergantung siapa yang menghitung. Solusi senior bukan query lebih canggih, melainkan KONTRAK definisi: satu tabel/dokumen definisi event (nama event, kapan terpicu, siapa pemiliknya), dan setiap query funnel merujuk ke kontrak itu. Tanpa kontrak, optimasi funnel adalah mengoptimasi angka yang berbeda-beda — sia-sia.",
        "Tiga aturan konsistensi funnel yang mencegah sesat: (1) denominator tetap — conversion tiap step dihitung dari step SEBELUMNYA (bukan dari atas funnel), sehingga “drop 30% di step 3” menunjuk lokasi masalahnya; (2) jendela waktu yang sama untuk semua step — pengguna yang daftar kemarin belum sempat checkout bukan “drop”, melainkan “belum matang”; beri jendela konversi (mis. 7 hari) dan hanya analisis cohort yang jendelanya sudah tertutup penuh; (3) satu pengguna = satu perjalanan — dedup event per pengguna per step dulu (event ganda dari double-click!), baru hitung. Funnel yang tidak didedup menggelembungkan step atas dan mengecilkan conversion — “masalah checkout” yang ternyata masalah double-click.",
        "Terakhir, jebakan survivorship di cohort: retensi dihitung dari pengguna yang MASIH ADA — tetapi pengguna yang churn di bulan 2 tidak ada di penyebut bulan 3. Ini benar secara definisi, tetapi membuatmu buta terhadap SEBAB churn. Praktik senior: laporkan retensi berdampingan dengan churn absolut per umur (“dari 1.000 cohort Jan, 200 hilang di umur 1 bulan”) — angka absolut menunjukkan DI MANA darahnya keluar, persen menunjukkan seberapa parah. Dan untuk keputusan bisnis, cohort value (revenue kumulatif per cohort per umur) hampir selalu lebih penting daripada retensi headcount — 100 pengguna setia kecil bisa kalah nilainya dari 10 paus.",
      ],
      tasks: [],
      reference: "Spine: cakup penuh + granularitas cocok + validasi count; funnel: kontrak definisi + denominator konsisten + jendela tertutup.",
    },
    {
      id: "cohort-value",
      eyebrow: "Langkah 8 · Cohort value",
      title: "Dari retensi headcount ke cohort value: yang dibayar bisnis",
      prose: [
        "Retensi headcount (“60% pengguna masih aktif”) adalah metrik vanity bila tidak ditemani NILAI: 60% pengguna gratisan yang tidak pernah membayar vs 40% paus yang menyumbang 90% revenue adalah dua bisnis berbeda. Cohort value — revenue kumulatif per cohort per umur — adalah lensa yang dipakai untuk keputusan uang: “cohort Jan menghasilkan Rp 420 jt di umur 6 bulan vs cohort Jul Rp 310 jt” langsung menjawab “akuisisi mana yang lebih berkualitas”. Polanya: agregat revenue per (cohort, umur), lalu bandingkan kurva — seperti vintage analysis, tetapi untuk revenue, bukan NPL.",
        "Definisi CHURN adalah kontrak yang harus ditulis sebelum dihitung: churn = tidak ada aktivitas selama X hari? X = 30 untuk e-wallet, 90 untuk KPR — angkanya dari SIKLUS BISNIS, bukan default 30. Dua jebakan: (1) churn dihitung dari TANGGAL TERAKHIR aktivitas + X — pengguna yang “churn” dihitung mundur, sehingga churn bulan berjalan SELALU undercount (mereka yang akan churn belum X hari); hanya analisis cohort yang jendelanya tertutup yang valid; (2) reaktivasi — pengguna churn yang kembali: apakah ia “tidak jadi churn” (mengubah histori — dilarang! histori tidak ditulis ulang) atau “cohort baru”? Praktik benar: churn tetap tercatat pada waktunya; yang kembali dihitung sebagai reaktivasi di metrik terpisah.",
        "Net Revenue Retention (NRR) — metrik yang memisahkan bisnis sehat: NRR = revenue cohort hari ini / revenue cohort periode lalu (cohort yang SAMA). NRR > 100% berarti ekspansi (upsell) mengalahkan churn — bisnis tumbuh tanpa akuisisi baru. Untuk menghitungnya dengan benar: numerator dan denominator harus cohort yang sama (bukan total revenue!), dan ekspansi vs kontraksi vs churn dilaporkan terpisah — “NRR 105%” yang terdiri dari churn 20% + ekspansi 25% adalah bisnis yang sangat berbeda dari churn 2% + ekspansi 7%, meski angkanya sama. Agregat menyembunyikan; komponen menjelaskan.",
        "Aturan keputusan untuk analisis cohort yang dipercaya: (1) definisi churn/aktif TERTULIS dan SAMA di semua laporan (kontrak definisi, seperti funnel); (2) laporkan headcount DAN value berdampingan — divergensi keduanya adalah insight (“pengguna naik, revenue per cohort turun” = akuisisi murah berkualitas rendah); (3) untuk keputusan budget akuisisi, pakai payback per cohort (kapan revenue kumulatif menutup CAC), bukan retensi bulan-1 — retensi tinggi yang tidak pernah payback adalah hobi mahal, bukan bisnis.",
      ],
      tasks: [],
      reference: "Headcount + value berdampingan; churn = kontrak tertulis; NRR dipecah komponennya; keputusan dari payback, bukan retensi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Cohort retention: % aktif per periode sejak akuisisi — lensa kualitas yang jujur.",
        "Funnel: konversi bertahap — temukan di mana bocornya.",
        "Sessionization: LAG + ambang jeda + running SUM.",
        "Gaps-and-islands: tanggal − row_number = konstan.",
        "Kombinasi cohort × funnel = diagnosis perilaku lengkap.",
      ],
      next: { label: "C12 — Recursive CTE", href: "/learn/c12-recursive-cte" },
      quiz: [
        {
          q: "Funnel menjawab pertanyaan?",
          options: [
            { text: "Siapa terbaik?", why: "Salah — itu ranking." },
            { text: "“Di tahap mana bocornya?”", why: "Benar. Drop-off terbesar = prioritas perbaikan.", correct: true },
            { text: "Berapa total?", why: "Salah — itu agregasi biasa." },
          ],
        },
        {
          q: "Trik gaps-and-islands untuk deret harian?",
          options: [
            { text: "tanggal + row_number", why: "Salah — yang konstan adalah selisihnya." },
            { text: "tanggal − row_number = konstan per island", why: "Benar. Deret berurutan → selisih konstan → GROUP BY.", correct: true },
            { text: "LAG 7 hari", why: "Salah — itu pola lain." },
          ],
        },
        {
          q: "Sessionization memakai?",
          options: [
            { text: "GROUP BY saja", why: "Salah — tidak cukup untuk mendeteksi jeda." },
            { text: "LAG untuk jeda + ambang + running SUM sebagai id sesi", why: "Benar. Deteksi awal sesi dari jeda, lalu nomor sesi kumulatif.", correct: true },
            { text: "UNION", why: "Salah." },
          ],
        },
        {
          q: "Cohort di credit risk setara dengan?",
          options: [
            { text: "DPD", why: "Salah — DPD = hari keterlambatan, bukan cohort." },
            { text: "Vintage (angkatan kredit)", why: "Benar. Vintage = cohort-nya kredit (C13).", correct: true },
            { text: "NPL", why: "Salah — NPL = rasio, bukan cohort." },
          ],
        },
        {
          q: "Kohor Mar: 800 nasabah, M1 = 320. Kohor Apr: 900 nasabah, M1 = 270. Mana yang retensinya lebih baik di M1?",
          options: [
            { text: "April", why: "Salah — 270 < 320 secara absolut, tapi yang dibandingkan adalah rate." },
            { text: "Maret (40% vs 30%)", why: "Benar. Mar M1 = 40%, Apr M1 = 30% — retensi memburuk di Apr. Bandingkan umur yang sama (M1 vs M1), bukan M3 vs M1.", correct: true },
            { text: "Sama", why: "Salah — 40% vs 30% jelas beda." },
          ],
        },
      ],
    },
  ],
};
