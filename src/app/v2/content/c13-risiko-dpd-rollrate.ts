import type { V2Lesson } from "../lib/types";

const SETUP = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
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

export const c13: V2Lesson = {
  slug: "c13-risiko-dpd-rollrate",
  track: "SQL",
  module: "Risiko",
  title: "C13 DPD, Roll Rate & Vintage: Bahasa Risiko Kredit",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-npl-naik",
      eyebrow: "Langkah 1 · Diagnosis NPL",
      title: "NPL naik 0,5% — kenapa?",
      prose: [
        "Laporan bulanan: NPL naik dari 2,1% ke 2,6%. Direksi bertanya kenapa — dan angka agregat tidak bisa menjawab. Apakah vintage 2025 yang buruk? Apakah kolektibilitas 2 bergeser ke 3 (roll rate memburuk)? Atau satu debitur besar macet?",
        "NPL naik 2,1% → 2,6% — satu angka, tiga penyakit yang sama sekali berbeda, dan obatnya beda total untuk tiap penyakit. Angka agregat seperti demam: ia bilang “ada yang salah” tapi tidak bilang di mana — dan mengobati demam tanpa diagnosis = mengobati gejala sambil penyakitnya berjalan.",
        "Tiga alat diagnosis — DPD bucket, roll rate, vintage — membedah NPL menjadi di mana masalahnya. Ini SQL yang langsung dipakai di credit risk.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Selalu dokumentasikan definisi NPL di query (komentar!): “-- NPL = kol 3-5 per SE OJK”. Definisi beda = angka beda = rapat yang panas.",
      },
      reference: "NPL naik = gejala; DPD bucket + roll rate + vintage = diagnosis.",
    },
    {
      id: "bucket-npl",
      eyebrow: "Langkah 2 · DPD bucket & NPL",
      title: "Bahasa kolektibilitas",
      prose: [
        "DPD (Days Past Due) = hari keterlambatan bayar. Bucket standar Indonesia: current (0) = kolektibilitas 1; 1–30 = kol 2 (DPK); 31–60 = kol 3; 61–90 = kol 4; 90+ = kol 5 (macet). NPL = kolektibilitas 3–5 — tapi samakan definisi dulu!",
        "NPL ratio = `SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) * 1.0 / SUM(plafon)` — berdasar nominal (baki debet), bukan jumlah debitur. Satu debitur besar mengubah segalanya. Selalu tampilkan nominal + ratio berdampingan: NPL ratio bisa naik karena penyebut menyusut (penyaluran turun) sementara pembilang tetap — % tanpa basis = manipulasi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: `npl_nominal`, `total_plafon`, dan `npl_ratio` (kolektibilitas >= 3, berdasar plafon)" },
        { id: "t2", text: "Ambil `npl` dan `ratio` dari hasil; pastikan npl = 180000000 dan ratio ≈ 0.2323" },
      ],
      expected: "npl_nominal=180000000, total=775000000, npl_ratio=0.2323 (23.23%)",
      hints: [
        "SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) AS npl_nominal.",
        "Kredit macet (kol 3-5): 30jt + 75jt + 25jt + 30jt + 20jt = 180jt.",
        "npl = rows[0][0]; ratio = rows[0][2]  →  180000000 dan 0.2323.",
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
# TULIS KODEMU: npl_nominal dan npl_ratio dari hasil
npl =
ratio =

print(f"npl: {npl}")
print(f"ratio: {ratio:.4f}")`,
        lockLines: 27,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT
SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) AS npl_nominal,
SUM(plafon) AS total_plafon,
SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) * 1.0 / SUM(plafon) AS npl_ratio
FROM kredit
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: npl_nominal dan npl_ratio dari hasil
npl = rows[0][0]
ratio = rows[0][2]

print(f"npl: {npl}")
print(f"ratio: {ratio:.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "npl", value: 180000000, tol: 1e-9, label: "`npl` seharusnya 180000000", msg: "Kolektibilitas ≥ 3: 30jt + 75jt + 25jt + 30jt + 20jt = 180jt." },
          { kind: "equal", task: "t2", name: "ratio", value: 0.2323, tol: 0.001, label: "`ratio` sekitar 0.2323", msg: "180jt / 775jt = 0,2323 (23,23%)." },
        ],
      },
      reference: "NPL ratio = SUM(CASE WHEN kol >= 3 THEN plafon ELSE 0 END) / SUM(plafon).",
    },
    {
      id: "roll-rate",
      eyebrow: "Langkah 3 · Roll rate",
      title: "Probabilitas memburuk",
      prose: [
        "Roll rate = % saldo di bucket X bulan ini yang pindah ke bucket lebih buruk bulan depan. Ini PD empiris antar bucket! Roll rate matrix (bucket_ini × bucket_depan) = matriks transisi Markov — jembatan ke modeling: angka yang kamu hitung di sini menjadi input matriks transisi dan PD di track credit risk.",
        "Contoh rantai: roll rate 1–30 → 31–60 = 35%, 31–60 → 61–90 = 45%, 61–90 → 90+ = 55%, 90+ → macet = 70%. Maka P(DPD 1–30 → macet) = 0,35 × 0,45 × 0,55 × 0,70 = 0,0606 — ekspektasi macet dari Rp300M di DPD 1–30 = Rp18,2M. Inilah dasar provisioning (CKPN/ECL stage 2!). Di lab ini: simulasi sederhana — asumsikan bulan depan tiap dpd +30 (tak ada yang bayar).",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: bucket `ini` (dpd) dan `depan` (dpd+30), hitung roll rate dari tiap bucket" },
        { id: "t2", text: "Ambil `rr` = roll rate bucket '1-30' dan pastikan = 1.0" },
      ],
      expected: "roll rate '1-30' → '31-60' = 1.0 (simulasi: semua dpd +30 tanpa pembayaran)",
      note: {
        title: "Sering salah",
        body: "Roll rate yang benar butuh snapshot 2 periode (bulan ini vs bulan lalu) — data historis SCD-2! Tanpa itu, yang kamu hitung hanya simulasi. Di produksi, jangan presentasikan simulasi sebagai roll rate aktual.",
      },
      hints: [
        "CTE: WITH b AS (SELECT CASE WHEN dpd BETWEEN 1 AND 30 THEN '1-30' WHEN dpd BETWEEN 31 AND 60 THEN '31-60' ELSE 'lain' END AS ini, CASE WHEN dpd+30 BETWEEN 31 AND 60 THEN '31-60' WHEN dpd+30 BETWEEN 61 AND 90 THEN '61-90' ELSE 'lain' END AS depan FROM kredit).",
        "Lalu SELECT ini, COUNT(*), SUM(CASE WHEN depan <> ini THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS roll_rate FROM b WHERE ini <> 'lain' GROUP BY ini.",
        "rr = [r[2] for r in rows if r[0] == '1-30'][0]  →  1.0.",
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
# TULIS KODEMU: roll rate bucket '1-30' (kolom: ini, n, roll_rate)
rr =

print("rr:", rr)
for r in rows:
    print(r)`,
        lockLines: 27,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH b AS (
  SELECT
  CASE WHEN dpd BETWEEN 1 AND 30 THEN '1-30'
       WHEN dpd BETWEEN 31 AND 60 THEN '31-60' ELSE 'lain' END AS ini,
  CASE WHEN dpd+30 BETWEEN 31 AND 60 THEN '31-60'
       WHEN dpd+30 BETWEEN 61 AND 90 THEN '61-90' ELSE 'lain' END AS depan
  FROM kredit
)
SELECT ini, COUNT(*) AS n,
SUM(CASE WHEN depan <> ini THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS roll_rate
FROM b WHERE ini <> 'lain' GROUP BY ini
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: roll rate bucket '1-30' (kolom: ini, n, roll_rate)
rr = [r[2] for r in rows if r[0] == '1-30'][0]

print("rr:", rr)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "rr", value: 1.0, tol: 1e-9, label: "`rr` seharusnya 1.0", msg: "Bucket 1-30: dpd 15, 5, 30 → +30 = 45, 35, 60 → semua ke 31-60. Roll rate simulasi = 1.0." },
        ],
      },
      reference: "Roll rate = % yang memburuk antar bucket; butuh snapshot 2 periode di produksi.",
    },
    {
      id: "vintage",
      eyebrow: "Langkah 4 · Vintage",
      title: "Cohort-nya kredit",
      prose: [
        "Vintage = cohort berdasar bulan pencairan (origination). Analisis: bagaimana kualitas tiap angkatan seiring umur (MOB = month on book)? Kurva vintage: X = MOB, Y = NPL%, garis per vintage — pola “naik lalu stabil” normal; yang lebih tinggi dari kakaknya = underwriting memburuk!",
        "Diagnosis NPL naik: vintage baru buruk → masalah underwriting (perketat akuisisi). Vintage lama memburuk → masalah collection/ekonomi. Contoh: NPL total naik 2,1% → 2,6%; vintage 2024 stabil 1,8%, vintage 2025 = 5,2% — biang keroknya underwriting 2025, bukan collection! Tapi ingat seasoning: kredit butuh 12–24 bulan sebelum pola default terlihat. Vintage 6 bulan yang “bersih” belum tentu baik; ia belum matang. Jangan nilai bayi dari ujian akhir!",
      ],
      tasks: [],
      quiz: [
        {
          q: "Vintage Jul-25 konsisten lebih buruk dari Jan-25. Diagnosis?",
          options: [
            { text: "Ekonomi memburuk", why: "Salah — jika ekonomi, semua vintage ikut memburuk." },
            { text: "Underwriting angkatan Jul-25 bermasalah", why: "Benar. Pola per angkatan = masalah origination, bukan sistemik.", correct: true },
            { text: "Collection malas", why: "Salah — collection memengaruhi vintage lama juga." },
          ],
        },
        {
          q: "NPL naik tapi semua vintage stabil. Kemungkinan penyebab?",
          options: [
            { text: "Data salah", why: "Mungkin, tapi ada penjelasan struktural dulu." },
            { text: "Mix effect: porsi vintage berisiko membesar dalam portofolio", why: "Benar. Tiap vintage sehat, tapi komposisi bergeser ke yang berisiko — agregat naik tanpa ada vintage yang memburuk.", correct: true },
            { text: "Tidak mungkin terjadi", why: "Salah — Simpson's paradox versi kredit." },
          ],
        },
      ],
      reference: "Vintage = NPL% per MOB per angkatan cair; butuh seasoning 12–24 bulan.",
    },
    {
      id: "minicase-diagnosis",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Diagnosis NPL naik",
      prose: [
        "Situasi: NPL 2,1% → 2,6% dalam 3 bulan. Tugas: (1) hitung NPL nominal + ratio; (2) distribusi bucket — di mana penumpukan? (3) jika vintage Jul-25 NPL-nya 2× vintage Jan-25, apa diagnosis & rekomendasi? (4) tulis memo 5 kalimat untuk direksi.",
        "Diagnosis contoh: “Kenaikan NPL terkonsentrasi di bucket 31–60 vintage Jul–Sep 25 (roll rate 1–30→31–60 naik 18%→27%). Vintage lama stabil — masalah underwriting, bukan collection/ekonomi. Satu debitur besar (plafon 200jt) menyumbang 0,2pp — sisanya granular.” Rekomendasi: (1) hold penyaluran segmen vintage bermasalah sambil review scoring; (2) intensifkan collection bucket 1–30 (cegah roll); (3) monitor vintage baru mingguan.",
        "Pelajaran: angka agregat bertanya “berapa”; bedah bucket/roll/vintage menjawab “kenapa” dan “apa yang dilakukan”. Itulah analyst → advisor.",
      ],
      tasks: [],
      reference: "Bedah tiga dimensi: bucket (di mana) + roll (seberapa cepat) + vintage (angkatan mana).",
    },
    {
      id: "intuisi-rollrate",
      eyebrow: "Langkah 6 · Intuisi",
      title: "NPL adalah foto; roll rate adalah film",
      prose: [
        "Satu angka NPL tidak bisa menjawab “kenapa” — ia hanya bisa menjawab “berapa”.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: bila direksi bertanya “kenapa NPL naik”, jangan jawab dengan NPL",
        body: "Kenaikan NPL 2,1% → 2,6% punya tiga penyakit yang obatnya berlawanan: (1) inflow memburuk — debitur lancar mulai telat (masalah underwriting/ekonomi, obatnya kebijakan akuisisi); (2) outflow melambat — yang telat tidak sembuh dan tidak dihapus-buku (masalah collection, obatnya intensitas penagihan); (3) denominator menyusut — portofolio menciut sehingga porsi macet naik tanpa satu debitur pun bertambah telat (ilusi statistik, obatnya tidak panik). Angka agregat tidak bisa membedakan ketiganya; matriks roll rate bisa — ia menunjukkan ALIRAN antar bucket, bukan stok. Heuristiknya: setiap kali melihat rasio stok (NPL, DPD), tanyakan “berapa inflow-nya, berapa outflow-nya?” — rasio tanpa arus adalah foto tanpa cerita. Dan untuk laporan rutin, tiga angka selalu berdampingan: NPL (stok), roll rate forward 1→2 (inflow), cure rate (outflow). Satu angka = tebakan; tiga angka = diagnosis.",
      },
      reference: "Stok tanpa arus = foto tanpa cerita; laporkan NPL + roll rate + cure rate.",
    },
    {
      id: "pit-asof",
      eyebrow: "Langkah 7 · Point-in-time",
      title: "As-of join, matriks roll rate anti-leakage, dan vintage",
      prose: [
        "Dosa terbesar analisis risiko historis adalah anakronisme: memakai informasi yang BELUM ADA pada tanggal analisis. Contoh klasik: menghitung “NPL per segmen Januari 2025” memakai kolom segmen dari tabel nasabah HARI INI — padahal 15% nasabah pindah segmen sejak itu. Hasilnya bukan “NPL Januari”, melainkan “NPL Januari dilihat dari kacamata hari ini” — dan trennya palsu. Obatnya adalah point-in-time correctness: setiap join ke data yang berubah terhadap waktu harus memakai kondisi as-of — n.segmen pada tanggal t adalah baris yang berlaku_dari <= t AND berlaku_sampai > t (pola slowly-changing-dimension: tabel dimensi menyimpan tiap versi baris dengan rentang berlakunya). Aturan keras: bila query historismu tidak punya satupun kondisi tanggal pada tabel dimensi, curigai ia anakronistik.",
        "Matriks roll rate yang benar dibangun dari snapshot, bukan dari tabel live. Pola kanonis: untuk tiap akhir bulan m, ambil snapshot DPD tiap fasilitas (dari tabel snapshot bulanan atau rekonstruksi dari event), lalu hitung transisi bucket m → m+1. Leakage mengintip di tiga tempat: (1) fasilitas yang lunas/dihapus-buku di antara m dan m+1 hilang dari matriks — perlakukan sebagai status terminal eksplisit (bukan “hilang”), karena cure-via-lunas berbeda dari cure-via-bayar; (2) restrukturisasi me-reset DPD ke 0 — tanpa flag restruktur, ia terlihat sebagai “sembuh” padahal risikonya dipindah; (3) vintage effect — roll rate cohort 2024 vs 2025 tidak sebanding bila komposisi produknya beda; stratifikasi per vintage/produk sebelum menyimpulkan “memburuk”.",
        "Vintage analysis adalah lensa yang memisahkan kualitas underwriting dari nasib ekonomi: plot NPL kumulatif per cohort pencairan terhadap “umur kredit” (bulan sejak pencairan), bukan terhadap bulan kalender. Kurva vintage 2023 yang naik lebih curam dari 2022 pada umur yang sama = underwriting melonggar (atau segmen berubah) — kesimpulan yang tidak bisa diambil dari NPL agregat yang tercampur umur. Dua disiplinnya: (1) bandingkan pada umur yang SAMA sejak pencairan — cohort 2023 umur 12 bulan vs cohort 2022 umur 12 bulan, bukan Januari vs Januari di kalender; (2) tandai peristiwa eksternal pada chart (bencana, perubahan kebijakan) agar “perbaikan” semu tidak diklaim sebagai prestasi. Vintage yang “membaik” tepat setelah kriteria hapus-buku dilonggarkan adalah akuntansi, bukan kualitas.",
        "Aturan keputusan untuk pelaporan risiko rutin: (1) simpan snapshot bulanan (fasilitas, DPD, segmen, status) sebagai tabel append-only — ia bahan bakar SEMUA analisis point-in-time dan tidak bisa direkonstruksi sempurna dari event bila logikanya berubah; (2) setiap angka historis yang dipublikasikan harus bisa direproduksi dari snapshot itu (reproducibility = kredibilitas); (3) pisahkan “NPL akuntansi” (angka laporan keuangan, ikut aturan hapus-buku) dari “NPL manajemen” (angka untuk keputusan, tanpa distorsi hapus-buku) — mencampur keduanya membuat tren tidak bisa dibaca. Analis yang menguasai point-in-time adalah analis yang angkanya dipercaya direksi: karena angkanya tidak berubah-ubah tergantung kapan ditanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Pakai data terbaru saja, kan lebih akurat.” Untuk posisi HARI INI, benar. Untuk tren HISTORIS, fatal: segmen, status, bahkan definisi “macet” berubah sepanjang waktu. “Lebih akurat” versi hari ini justru merusak perbandingan antar waktu. Akurat = benar pada tanggalnya, bukan benar menurut pengetahuan hari ini.",
      },
      reference: "Join historis wajib as-of; snapshot append-only; pisahkan NPL akuntansi vs manajemen.",
    },
    {
      id: "rollrate-ke-pd",
      eyebrow: "Langkah 8 · Roll rate → PD",
      title: "Dari matriks transisi ke estimasi PD: rantai Markov dan batasnya",
      prose: [
        "Matriks roll rate bukan sekadar diagnostik — ia mesin estimasi: probabilitas fasilitas CURRENT menjadi macet dalam 12 bulan ≈ hasil kali peluang transisi sepanjang rantai (current→1, 1→2, ..., 30→macet). Inilah intuisi di balik model rantai Markov untuk PD: bila matriks transisinya stabil, perkalian matriks 12× memberi distribusi 12 bulan ke depan. Praktiknya: hitung matriks dari 24–36 bulan data (cukup untuk stabil, tidak terlalu lama hingga usang), lalu proyeksikan — dan BANDINGKAN proyeksi 12 bulan lalu dengan realisasinya (backtest!). Matriks yang proyeksnya meleset sistematis bukan “model yang perlu di-tuning” — melainkan sinyal bahwa asumsi stasionernya salah (ekonomi berubah, kebijakan berubah).",
        "Tiga batas asumsi Markov yang harus jujur diakui: (1) TANPA MEMORI — Markov mengasumsikan peluang transisi hanya tergantung bucket SAAT INI, bukan riwayat (“sudah 3× keluar-masuk bucket 1” vs “baru pertama kali telat” dianggap sama — padahal perilakunya beda jauh); segmentasi perilaku (ever-delinquent vs first-time) memperbaiki ini; (2) STASIONER — matriks dihitung dari masa lalu; resesi, perubahan underwriting, atau program restrukturisasi massal membuat matriks lama tidak berlaku — solusinya overlay forward-looking (skenario makro), bukan matriks yang lebih rumit; (3) SEASONING — fasilitas baru berperilaku beda dari yang tua (risiko memuncak di bulan 6–18 untuk KTA); matriks agregat mencampur umur — stratifikasi per umur/vintage sebelum mengalikan.",
        "Aturan keputusan: gunakan roll-rate Markov untuk ESTIMASI PORTOFOLIO (cadangan, stress test ringan) — bukan untuk KEPUTUSAN INDIVIDU (persetujuan kredit per nasabah butuh scorecard, bukan matriks agregat). Dan selalu sajikan dengan interval keyakinan dari backtest (“proyeksi 12 bulan terakhir meleset ±15%”) — angka tanpa ketepatan historisnya adalah ramalan, bukan estimasi. Analis yang menyajikan keduanya (angka + seberapa bisa dipercaya) adalah analis yang komite dengarkan.",
      ],
      tasks: [],
      reference: "Matriks × 12 = proyeksi PD; backtest wajib; Markov untuk portofolio, bukan individu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "DPD bucket: bahasa kolektibilitas; CASE + agregat.",
        "NPL ratio: samakan definisi; nominal + ratio berdampingan.",
        "Roll rate: % memburuk antar bucket = PD empiris = matriks transisi.",
        "Vintage: cohort kredit — diagnosis underwriting vs collection vs ekonomi.",
        "Bedah tiga dimensi = dari “berapa” ke “kenapa” ke “apa yang dilakukan”.",
      ],
      next: { label: "C14 — Velocity & Fraud", href: "/v2/learn/c14-fraud-velocity" },
      quiz: [
        {
          q: "NPL ratio naik. Yang harus dicek dulu?",
          options: [
            { text: "Langsung salahkan marketing", why: "Salah — diagnosis dulu, tuduh kemudian." },
            { text: "Nominal + definisi + komponen (bucket/vintage)", why: "Benar. Ratio = pembilang/pernyebut — bedah dulu sebelum simpulkan.", correct: true },
            { text: "Ganti definisi", why: "Salah — mengganti definisi agar angka bagus = manipulasi." },
          ],
        },
        {
          q: "Roll rate 1–30 → 31–60 = 25% artinya?",
          options: [
            { text: "25% sudah bayar", why: "Salah — kebalikannya." },
            { text: "25% saldo bucket 1–30 memburuk ke 31–60", why: "Benar. Probabilitas transisi = PD empiris antar bucket.", correct: true },
            { text: "NPL 25%", why: "Salah — roll rate bukan NPL." },
          ],
        },
        {
          q: "Roll rate yang BENAR butuh?",
          options: [
            { text: "Satu snapshot", why: "Salah — satu snapshot hanya memberi posisi, bukan transisi." },
            { text: "Snapshot 2 periode (bulan ini vs bulan lalu)", why: "Benar. Transisi butuh dua titik waktu (SCD-2).", correct: true },
            { text: "Estimasi", why: "Salah — estimasi bukan pengukuran." },
          ],
        },
        {
          q: "Vintage 3 bulan yang “bersih”?",
          options: [
            { text: "Pasti baik", why: "Salah — belum tentu." },
            { text: "Belum tentu — butuh seasoning 12–24 bulan", why: "Benar. Pola default butuh waktu matang.", correct: true },
            { text: "Harus di-write-off", why: "Salah — tidak ada alasan write-off." },
          ],
        },
        {
          q: "NPL regulator dihitung berdasar?",
          options: [
            { text: "Jumlah debitur", why: "Salah." },
            { text: "Baki debet (nominal)", why: "Benar. Satu debitur besar mengubah segalanya.", correct: true },
            { text: "Rata-rata", why: "Salah." },
          ],
        },
      ],
    },
  ],
};
