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
  nominal REAL
)""")
data_transaksi = [
    (1, 1, '2026-10-20', 1500000),
    (2, 2, '2026-11-05', 2300000),
    (3, 3, '2026-11-08', 750000),
]
cur.executemany("INSERT INTO transaksi VALUES (?,?,?,?)", data_transaksi)
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

export const c15: V2Lesson = {
  slug: "c15-data-quality",
  track: "SQL",
  module: "Engineering",
  title: "C15 Data Quality: Percaya tapi Verifikasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-2m",
      eyebrow: "Langkah 1 · Quality check",
      title: "Laporan direksi yang salah Rp 2 miliar",
      prose: [
        "Laporan keuangan kuartalan: total penyaluran Rp 48 miliar. Audit menemukan: Rp 2 miliar double-count dari duplikat + 300 debitur hilang dari filter NULL yang salah. Laporan ditarik, direksi malu, analis dimutasi. Akar masalah: tidak ada quality check di pipeline.",
        "Rp 2 miliar double-count + 300 debitur hilang — bukan karena analisnya bodoh, melainkan karena tidak ada yang mengecek. Quality check memakan 10 menit; tanpanya, laporan Rp 48 miliar ditarik dan karir melayang. Asuransi termurah di industri data bukanlah tools mahal — melainkan query validasi yang dijalankan sebelum laporan dikirim. Profesional = paranoid yang sistematis.",
        "Enam dimensi cek: (1) completeness — ada yang hilang? (2) uniqueness — ada duplikat? (3) validity — nilai di luar domain? (4) consistency — aturan bisnis dilanggar? (5) timeliness — data terbaru kapan? (6) accuracy — cocok dengan sumber kebenaran? Jadikan 6 cek ini template untuk setiap tabel baru: 15 menit menjalankan template ini menghemat berhari-hari debugging.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Fraud/ML Analytics, Health Data Science, dan Data Management — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Data quality = tanggung jawab data engineer.” Salah — semua orang yang menyentuh data bertanggung jawab! Analis yang memakai data tanpa cek = ikut salah saat laporan salah.",
      },
      reference: "Tabel baru → 6 cek template: completeness → timeliness.",
    },
    {
      id: "lab-completeness",
      eyebrow: "Langkah 2 · Lab completeness",
      title: "Ada yang hilang?",
      prose: [
        "Completeness: `SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi, COUNT(*) - COUNT(penghasilan) AS hilang FROM nasabah;` — selisihnya = baris dengan NULL. Uniqueness: `SELECT nama, COUNT(*) FROM nasabah GROUP BY nama HAVING COUNT(*) > 1;` — harus kosong. (GROUP BY id atas PRIMARY KEY tidak pernah menghasilkan baris — uji uniqueness pada kolom yang BISA duplikat seperti nama, no_ktp, atau email, bukan pada PK.) Validity: `SELECT * FROM nasabah WHERE dpd < 0 OR dpd > 3650;` — nilai di luar domain; waspadai sentinel seperti 9999 (“tak terhingga”) yang terlihat valid tapi artinya “tidak tahu” — lebih berbahaya dari NULL karena tidak terdeteksi COUNT.",
        "Di data lab: total 10, isi 9, hilang 1 (penghasilan Eko). Buktikan dengan query.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: `total`, `isi`, dan `hilang` untuk kolom penghasilan" },
        { id: "t2", text: "Ambil `hilang` dari hasil dan pastikan = 1" },
      ],
      expected: "total=10, isi=9, hilang=1 (Eko)",
      hints: [
        "SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi, COUNT(*) - COUNT(penghasilan) AS hilang FROM nasabah.",
        "Kolom hasil: total, isi, hilang → rows[0] = (10, 9, 1).",
        "hilang = rows[0][2]  →  1.",
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
# TULIS KODEMU: jumlah yang hilang (kolom: total, isi, hilang)
hilang =

print("hilang:", hilang)
print(rows[0])`,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi,
COUNT(*) - COUNT(penghasilan) AS hilang FROM nasabah
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: jumlah yang hilang (kolom: total, isi, hilang)
hilang = rows[0][2]

print("hilang:", hilang)
print(rows[0])`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "hilang", value: 1, tol: 1e-9, label: "`hilang` seharusnya 1", msg: "10 baris, 9 berpenghasilan — 1 hilang (Eko, NULL)." },
        ],
      },
      reference: "Completeness = COUNT(*) vs COUNT(kolom); uniqueness = GROUP BY + HAVING > 1.",
    },
    {
      id: "lab-consistency",
      eyebrow: "Langkah 3 · Lab consistency",
      title: "Aturan bisnis dilanggar?",
      prose: [
        "Consistency: `SELECT * FROM nasabah WHERE status = 'lancar' AND dpd > 0;` — status 'lancar' tapi dpd > 0 = inkonsisten! Di data lab: Budi (dpd 15) dan Fitri (dpd 5) berstatus 'lancar' — 2 baris melanggar aturan bisnis.",
        "Timeliness: `SELECT MAX(tanggal), julianday('now') - julianday(MAX(tanggal)) FROM transaksi;` — umur data (staleness). Accuracy: cocokkan dengan sumber kebenaran — reconciliation di langkah berikut.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: nasabah dengan status 'lancar' TAPI dpd > 0" },
        { id: "t2", text: "Jalankan dan pastikan 2 baris kembali: Budi dan Fitri" },
      ],
      expected: "baris: 2 — Budi (dpd 15), Fitri (dpd 5): status vs dpd tak cocok",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inkonsistensi status vs DPD di data kredit = kolektibilitas salah lapor = NPL salah hitung = provisi salah. Quality check ini langsung melindungi angka risk.",
      },
      hints: [
        "SELECT nama, dpd, status FROM nasabah WHERE status = 'lancar' AND dpd > 0.",
        "Budi dpd 15, Fitri dpd 5 — keduanya 'lancar'.",
        "Hasilnya 2 baris.",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT nama, dpd, status FROM nasabah
WHERE status = 'lancar' AND dpd > 0
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "n", value: 2, tol: 1e-9, label: "2 baris kembali", msg: "Budi (dpd 15) dan Fitri (dpd 5) berstatus 'lancar' — inkonsisten." },
          { kind: "stdout_matches", task: "t2", pattern: "Budi[\\s\\S]*Fitri", label: "Budi dan Fitri muncul", msg: "Cek kondisi WHERE: status = 'lancar' AND dpd > 0." },
        ],
      },
      reference: "Consistency = aturan bisnis sebagai WHERE; timeliness = umur data (MAX tanggal).",
    },
    {
      id: "reconciliation",
      eyebrow: "Langkah 4 · Reconciliation",
      title: "Cocokkan sumber vs target",
      prose: [
        "Setelah ETL/pipeline: apakah target = sumber? Tiga level: Level 1 — row count (`SELECT 'sumber', COUNT(*) FROM src UNION ALL SELECT 'target', COUNT(*) FROM tgt`) — cepat, menangkap kehilangan besar. Level 2 — agregat kunci (`SUM(jumlah)`, `COUNT(DISTINCT nasabah_id)` dua sisi) — menangkap duplikat & nilai berubah (count sama, isi beda!). Level 3 — baris yang hilang/berbeda (EXCEPT dua arah, C8) — untuk investigasi presisi.",
        "Aturan pipeline: tidak ada data yang pindah tanpa reconciliation. Jadikan recon sebagai gerbang: jika selisih > toleransi → pipeline FAIL, jangan lanjut. Test suite (konsep dbt): unique (id unik), not_null, accepted_values (status in (...)), relationships (FK tidak yatim — `LEFT JOIN ... WHERE n.id IS NULL`), custom SQL (SUM(src) = SUM(tgt)). Mulai dari 5 test generik — mencakup 80% masalah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Test memperlambat delivery.” Test memperlambat sekarang 10 menit, menghemat nanti berhari-hari + reputasi. Tim yang tidak test = tim yang debugging di produksi — dengan direksi menonton.",
      },
      quiz: [
        {
          q: "Recon Level 2 (agregat) menangkap yang tidak ditangkap Level 1 (count)?",
          options: [
            { text: "Tidak ada", why: "Salah — Level 2 menangkap lebih banyak." },
            { text: "Duplikat & nilai berubah (count sama, isi beda)", why: "Benar. Count sama tapi SUM beda = ada yang berubah/digandakan.", correct: true },
            { text: "Baris hilang", why: "Salah — itu Level 1 dan Level 3." },
          ],
        },
        {
          q: "Test 'relationships' memeriksa?",
          options: [
            { text: "Tipe data", why: "Salah." },
            { text: "FK tidak yatim (ada di tabel induk)", why: "Benar. Referential integrity: kredit.nasabah_id harus ada di nasabah.", correct: true },
            { text: "Kecepatan", why: "Salah." },
          ],
        },
      ],
      reference: "Recon 3 level: count → agregat → EXCEPT. Gate: gagal = pipeline berhenti.",
    },
    {
      id: "minicase-2m",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Laporan Rp 2 miliar",
      prose: [
        "Situasi: total penyaluran dilaporkan Rp 48M. Audit: Rp 2M double-count (duplikat) + 300 debitur hilang (filter NULL salah). Tugas: (1) test apa yang akan menangkap double-count? (2) test apa yang menangkap debitur hilang? (3) rancang gate pipeline: urutan cek + ambang FAIL. (4) tulis permintaan maaf + rencana perbaikan 4 kalimat untuk direksi.",
        "Pembahasan: (1) test uniqueness id + recon Level 2 (SUM sumber vs target). (2) recon Level 1 (count) + not_null test di kolom filter + review query filter NULL (C2!). (3) gate: ① row count ±0 → ② SUM ±0,01% → ③ unique/not_null → ④ custom bisnis. FAIL di langkah manapun = pipeline berhenti + alert. (4) contoh: “Kami menemukan kelebihan catat Rp 2M dari duplikat dan 300 debitur terlewat filter. Angka terkoreksi: Rp46M (hanya koreksi double-count Rp2M; nilai 300 debitur hilang BELUM masuk — total final = Rp46M + nilai 300 debitur, masih dihitung; jangan laporkan 46M sebagai final). Kami memasang 4 lapis automated check agar tidak terulang; laporan audit menyusul Jumat.”",
        "Pelajaran: krisis data = krisis kepercayaan. Respons profesional = akui + koreksi + sistem cegah. Inilah yang membedakan senior. Dan cara melaporkan temuan: skor per dimensi + dampak Rp — “Consistency 80%” menggerakkan anggaran; “data bermasalah” hanya keluhan.",
      ],
      tasks: [],
      reference: "Respons insiden = akui + koreksi + sistem cegah; laporkan sebagai skor + dampak Rp.",
    },
    {
      id: "intuisi-dq",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Data quality bukan tentang data — tentang kepercayaan pada keputusan",
      prose: [
        "Tidak ada yang peduli “data berkualitas”; yang dipedulikan adalah “apakah angka ini boleh dipakai untuk keputusan Rp 2 miliar”.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: uji kualitas dari keputusan yang akan diambil, bukan dari datanya",
        body: "Godaan klasik DQ adalah menguji segalanya: 200 cek atas 200 kolom, dashboard hijau semua, lalu laporan tetap salah karena SATU cek yang penting tidak ada. Heuristik praktisi membaliknya: mulai dari keputusan (“komite kredit menyetujui Rp 2 miliar berdasarkan NPL segmen ini”), tanyakan “asumsi data apa yang bila salah membuat keputusan ini salah?”, lalu tulis cek untuk asumsi itu. Tiga asumsi yang hampir selalu ada: kelengkapan (apakah semua fasilitas masuk?), kebenaran (apakah DPD-nya masuk akal?), konsistensi (apakah totalnya cocok dengan sumber?). Cek yang tidak terhubung ke keputusan adalah teater — ia membuatmu sibuk tanpa membuatmu aman. Dan satu disiplin yang membedakan: setiap cek punya PEMILIK dan AMBANG AKSI — “bila gagal, siapa yang dibangunkan dan apa yang dihentikan”. Cek tanpa pemilik adalah notifikasi yang diabaikan; cek tanpa ambang aksi adalah spam.",
      },
      reference: "Cek = asumsi keputusan + pemilik + ambang aksi; selebihnya teater.",
    },
    {
      id: "dq-assertions",
      eyebrow: "Langkah 7 · Assertions",
      title: "Assertion DQ ala Great Expectations dalam SQL + scorecard",
      prose: [
        "Framework seperti Great Expectations merumuskan DQ sebagai EXPECTATIONS — pernyataan yang bisa diuji: “kolom X tidak boleh null”, “nilai Y di antara 0 dan 100”, “tabel A dan B konsisten”. Kabar baiknya: 90% expectations bisa ditulis sebagai query SQL murni yang mengembalikan PELANGGARAN (bukan sekadar ya/tidak). Polanya: SELECT <kunci> FROM t WHERE NOT (<aturan>) — hasilnya adalah daftar baris bermasalah yang bisa dihitung (COUNT = metrik) dan diinspeksi (contoh = diagnosis). Enam expectation kanonis yang menutupi sebagian besar insiden: (1) completeness — WHERE kolom IS NULL atas kolom wajib; (2) uniqueness — GROUP BY kunci HAVING COUNT(*) > 1; (3) range — WHERE dpd < 0 OR dpd >= 9999; (4) referential — LEFT JOIN ... WHERE kanan.id IS NULL (orphan); (5) freshness — SELECT MAX(updated_at) FROM t HAVING MAX(updated_at) < batas (agregat tidak boleh di WHERE; pakai HAVING atau subquery); (6) reconciliation — selisih total antar dua sumber.",
        "Kekuatan pola ini adalah ia KOMPOSABEL menjadi suite yang berjalan tiap load: kumpulkan semua query pelanggaran ke satu tabel hasil_dq (cek_nama, waktu, n_pelanggaran, contoh_kunci), dan pipeline gagal (atau memperingatkan) bila n_pelanggaran melewati ambang. Bedakan dua tingkat kegagalan: HARD FAIL (pelanggaran > 0 langsung menghentikan pipeline — untuk invariant seperti “tidak boleh ada DPD negatif”) vs SOFT WARN (pelanggaran > ambang historis — untuk metrik seperti “% null naik 2× lipat dari minggu lalu”). Ambang absolut untuk invariant, ambang relatif-terhadap-baseline untuk metrik perilaku — mencampurnya membuatmu dibangunkan tengah malam untuk hal sepele atau tidur saat hal serius terjadi.",
        "Scorecard kualitas mengubah 50 cek menjadi SATU angka yang bisa dibaca direksi: skor per dimensi (completeness, validity, consistency, timeliness, uniqueness), masing-masing 0–100, lalu agregat berbobot. Rumus sederhananya: skor_dimensi = 100 × (1 − pelanggaran / total_dicek), dan skor_total = rata-rata berbobot dengan bobot dari DAMPAK KEPUTUSAN (dimensi yang dipakai komite kredit bobotnya 3× lipat dimensi arsip). Tiga aturan agar scorecard tidak menjadi vanity metric: (1) bobot diputuskan BERSAMA pemilik keputusan, bukan oleh tim data sendirian; (2) tren skor lebih penting dari skor absolut — penurunan 95→88 adalah sinyal, 88 yang stabil adalah baseline; (3) tiap sel skor bisa di-drill-down ke daftar pelanggaran — angka tanpa jejak audit adalah dekorasi.",
        "Terakhir, disiplin yang paling sering diabaikan: DQ untuk DATA MASUK vs DQ untuk DATA KELUAR. Cek di pintu masuk (saat ingest: skema, tipe, rentang) mencegah sampah masuk; cek di pintu keluar (sebelum laporan terbit: rekonsiliasi total, perbandingan dengan periode lalu, “apakah angka ini masuk akal?”) menangkap apa yang lolos. Insiden Rp 2 miliar double-count hampir selalu lolos dari cek masuk (datanya “valid” per baris!) dan hanya tertangkap oleh cek keluar (totalnya tidak cocok). Aturan senior: setiap laporan yang memengaruhi uang punya MINIMAL satu cek keluar yang membandingkan dengan sumber independen atau periode sebelumnya — “angka ini mirip dengan yang kemarin” adalah cek yang paling murah dan paling sering menyelamatkan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“DQ = persentase null per kolom.” Itu satu dimensi dari enam, dan bukan dimensi yang paling sering menyebabkan insiden uang. Insiden mahal biasanya datang dari inkonsistensi antar sumber (dua sistem beda angka) dan pelanggaran aturan bisnis (DPD negatif, tanggal lahir di masa depan) — hal yang tidak terlihat dari “% null”. Ukur yang menyebabkan kerugian, bukan yang mudah dihitung.",
      },
      reference: "Expectation = query pelanggaran; hard fail untuk invariant, soft warn untuk anomali; scorecard berbobot dampak + bisa di-drill-down.",
    },
    {
      id: "freshness-drift",
      eyebrow: "Langkah 8 · Freshness & drift",
      title: "Data telat, skema bergeser, dan kontrak data",
      prose: [
        "Dua dimensi DQ yang paling sering luput dari checklist: WAKTU dan PERUBAHAN. Freshness — “data terakhir jam berapa?” — adalah cek termurah dengan ROI tertinggi: satu query MAX(updated_at) per sumber vs SLA-nya, dan pipeline yang diam-diam berhenti 3 hari ketahuan dalam menit, bukan saat direksi bertanya. Bedakan keterlambatan NORMAL (batch harian jam 06:00) dari ANOMALI (jam 10:00 belum ada) — ambang freshness harus mengikuti jadwal sumber, bukan angka tetap. Dan untuk data yang datang TELAT (event 3 hari lalu baru masuk hari ini): putuskan kebijakannya — apakah metrik historis ditulis ulang (restatement, benar tetapi membingungkan) atau dibekukan (konsisten tetapi basi)? Tidak memutuskan = dua versi angka beredar.",
        "Schema drift — kolom baru muncul, tipe berubah, enum bertambah — adalah pembunuh diam-diam: pipeline yang “berhasil” tetapi mengabaikan kolom baru (informasi hilang) atau gagal total di tengah malam. Tiga pertahanan berlapis: (1) validasi skema saat ingest — tolak/gagalkan bila skema tidak sesuai kontrak (bukan silently ignore); (2) deteksi drift sebagai METRIK — laporkan “kolom baru terdeteksi: X” sebagai event, bukan error, agar tim sadar; (3) kontrak data dengan producer — dokumen tertulis: kolom apa, tipe apa, siapa yang boleh mengubah, pemberitahuan berapa hari sebelumnya. Kontrak yang ditandatangani lebih murah daripada 3 insiden.",
        "Aturan penutup DQ yang matang: setiap tabel produksi punya “paspor” — pemilik, SLA freshness, ekspektasi skema, dan cek keluar yang wajib lolos sebelum konsumen membacanya. Tabel tanpa paspor adalah tabel tanpa penanggung jawab — dan insiden di sana selalu menjadi “bukan salah siapa-siapa”. Kualitas data pada akhirnya bukan masalah tool, melainkan kepemilikan: seseorang yang dibangunkan saat cek gagal.",
      ],
      tasks: [],
      reference: "Freshness vs SLA per sumber; kebijakan data telat; drift = event; kontrak tertulis dengan producer.",
    },
    {
          id: "gap-r9-drift-psi",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P6-G1)",
          title: "Data drift & concept drift: PSI dan KS",
          prose: [
            "Langkah 8 menyebut schema drift dan freshness — tetapi belum mengajarkan dua drift yang lebih berbahaya: data drift (distribusi input berubah) dan concept drift (hubungan input→output berubah). Schema drift terlihat (kolom hilang); data drift tidak terlihat sampai modelmu diam-diam memburuk. Alat standarnya: PSI (Population Stability Index) membandingkan distribusi skor/probabilitas antar-periode, dan KS (Kolmogorov–Smirnov) membandingkan distribusi kumulatif.",
            "PSI = Σ (aktual − ekspektasi) × ln(aktual/ekspektasi) per bin. Aturan praktis industri: PSI < 0,1 = stabil, 0,1–0,25 = waspada (selidiki), > 0,25 = drift signifikan (retrain/review). KS mengukur jarak maksimum antar CDF: KS > 0,2 pada sampel besar biasanya sudah bermakna. Keduanya murah dihitung — dan jauh lebih murah daripada menemukan drift dari kerugian.",
            "Contoh angka (distribusi skor 3 bin): ekspektasi [50%, 30%, 20%], aktual [40%, 40%, 20%]. PSI = (0,40−0,50)×ln(0,40/0,50) + (0,40−0,30)×ln(0,40/0,30) + 0 = (−0,10)×(−0,223) + (0,10)×(0,288) = 0,022 + 0,029 = 0,051 — di bawah 0,1: stabil, pantau saja. Concept drift berbeda: distribusi input boleh stabil, tetapi ARTINYA berubah — mis. DPD 30 hari yang dulu berarti “lupa bayar” kini berarti “PHK massal” — PSI tidak menangkapnya; yang menangkap adalah monitoring performa (akurasi/KS per segmen) dan label baru.",
          ],
          formula: String.raw`PSI = \sum_i (A_i - E_i) \cdot \ln\left(\frac{A_i}{E_i}\right)`,
          formulaNote: "PSI: < 0,1 stabil; 0,1–0,25 waspada; > 0,25 drift signifikan. KS = jarak maksimum antar CDF. Contoh angka: E=[0,50; 0,30; 0,20], A=[0,40; 0,40; 0,20] → PSI ≈ 0,051 (stabil). Concept drift butuh monitoring performa, bukan hanya distribusi.",
          tasks: [
            { id: "t1", text: "Hitung `psi` dari distribusi ekspektasi vs aktual (3 bin)" },
            { id: "t2", text: "Cetak PSI-nya" },
          ],
          expected: "PSI=0.051",
          hints: [
            "PSI = jumlah (a−e)×ln(a/e) per bin.",
            "Gunakan math.log (log natural).",
          ],
          code: {
            starter: `import math\nexp = [0.50, 0.30, 0.20]\nact = [0.40, 0.40, 0.20]\n\n# TULIS KODEMU: PSI\npsi = \n\nprint(f"PSI={psi:.3f}")`,
            lockLines: 5,
            solution: `import math\nexp = [0.50, 0.30, 0.20]\nact = [0.40, 0.40, 0.20]\n\n# TULIS KODEMU: PSI\npsi = sum((a - e) * math.log(a / e) for a, e in zip(act, exp))\n\nprint(f"PSI={psi:.3f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "psi", value: 0.051, tol: 0.005, label: "`psi` seharusnya ≈0,051", msg: "(−0,10)×ln(0,8) + (0,10)×ln(1,333) ≈ 0,051." },
              { kind: "stdout_matches", task: "t2", pattern: "PSI=0.051", label: "`print` menampilkan PSI", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "PSI distribusi skor naik dari 0,05 ke 0,30 dalam sebulan, tetapi akurasi model tetap. Apa yang harus dilakukan?",
              options: [
                { text: "Selidiki + siapkan retrain — drift signifikan (>0,25), akurasi bisa menyusul turun", why: "Benar: PSI > 0,25 = drift signifikan; akurasi yang belum turun hanya berarti efeknya belum terlihat.", correct: true },
                { text: "Abaikan — akurasi tetap berarti model baik-baik saja", why: "Salah: data drift mendahului penurunan performa; menunggu akurasi turun berarti menunggu kerugian." },
                { text: "Retrain otomatis tanpa penyelidikan", why: "Salah: pahami DULU apa yang berubah (segmen? definisi? sumber?) — retrain buta bisa mengunci drift." },
              ],
            },
          ],
          reference: "PSI < 0,1 stabil, > 0,25 drift. Concept drift = hubungan berubah — pantau performa.",
        },
    {
          id: "gap-r9-recon-3-level",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P6-G2)",
          title: "Reconciliation 3 level + scorecard",
          prose: [
            "Langkah reconciliation menyebut recon — tetapi lesson ini belum memberi lab-nya, dan langkah dq-assertions tidak punya tugas. Reconciliation punya 3 level: Level 1 — COUNT (jumlah baris sumber vs target harus sama); Level 2 — SUM (total nilai kunci, mis. total penyaluran); Level 3 — SAMPLE (bandingkan baris-per-baris pada sampel, mis. 10 baris acak). Level 1 menangkap baris hilang (kasus 300 debitur!); Level 2 menangkap duplikat dan salah nilai (kasus Rp2M double-count!); Level 3 menangkap salah mapping yang lolos dari agregat.",
            "Contoh angka: sumber 1.000 baris, total Rp50.000.000; target 998 baris, total Rp49.800.000. Level 1: selisih 2 baris — ADA yang hilang. Level 2: selisih Rp200.000 — ADA salah nilai/duplikat. Level 3: 10 sampel, 1 mismatch (10%) — ADA salah mapping. Ketiganya gagal — dan ketiganya menunjuk masalah BERBEDA. Scorecard-nya: tiap level punya ambang (count ±0, sum ±0,01%, sample mismatch 0%) — FAIL di level mana pun = pipeline berhenti.",
            "Lab ini menghitung ketiga selisih itu. Perhatikan: Level 1 dan 2 bisa lolos bersamaan sementara Level 3 gagal (dua kesalahan saling meniadakan di agregat: +200rb di satu baris, −200rb di baris lain) — itulah mengapa Level 3 tidak boleh dilewatkan.",
          ],
          formula: String.raw`\text{L1: } |n_{sumber} - n_{target}| \qquad \text{L2: } |\sum_{sumber} - \sum_{target}| \qquad \text{L3: } \frac{\text{mismatch}}{\text{sampel}}`,
          formulaNote: "Recon 3 level: L1 count (±0), L2 sum (±0,01%), L3 sample mismatch (0%). Contoh angka: sumber 1.000 baris/Rp50.000.000 vs target 998/Rp49.800.000 → diff count 2, diff sum Rp200.000; 10 sampel, 1 mismatch (10%).",
          tasks: [
            { id: "t1", text: "Hitung `diff_count` dan `diff_sum` (sumber vs target)" },
            { id: "t2", text: "Hitung `mismatch` (rate) dan cetak ketiganya" },
          ],
          expected: "diff_count=2 diff_sum=200000 mismatch=0.10",
          hints: [
            "diff = nilai mutlak selisih (abs).",
            "mismatch = 1/10.",
          ],
          code: {
            starter: `src_n, tgt_n = 1000, 998\nsrc_sum, tgt_sum = 50_000_000, 49_800_000\nsampel, mismatch_n = 10, 1\n\n# TULIS KODEMU: recon 3 level\ndiff_count = \ndiff_sum = \nmismatch = \n\nprint(f"diff_count={diff_count} diff_sum={diff_sum} mismatch={mismatch:.2f}")`,
            lockLines: 5,
            solution: `src_n, tgt_n = 1000, 998\nsrc_sum, tgt_sum = 50_000_000, 49_800_000\nsampel, mismatch_n = 10, 1\n\n# TULIS KODEMU: recon 3 level\ndiff_count = abs(src_n - tgt_n)\ndiff_sum = abs(src_sum - tgt_sum)\nmismatch = mismatch_n / sampel\n\nprint(f"diff_count={diff_count} diff_sum={diff_sum} mismatch={mismatch:.2f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "diff_count", value: 2, label: "`diff_count` seharusnya 2", msg: "|1.000 − 998| = 2." },
              { kind: "equal", task: "t1", name: "diff_sum", value: 200000, label: "`diff_sum` seharusnya Rp200.000", msg: "|50.000.000 − 49.800.000| = 200.000." },
              { kind: "equal", task: "t2", name: "mismatch", value: 0.1, tol: 0.01, label: "`mismatch` seharusnya 0,10", msg: "1/10 = 0,10." },
              { kind: "stdout_matches", task: "t2", pattern: "diff_count=2\\s+diff_sum=200000\\s+mismatch=0.10", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Level 1 (count) dan Level 2 (sum) Lolos, tetapi Level 3 menemukan 1 mismatch dari 10 sampel. Apa kesimpulannya?",
              options: [
                { text: "Ada salah mapping — dua kesalahan bisa saling meniadakan di agregat", why: "Benar: itulah gunanya Level 3; agregat yang cocok tidak membuktikan barisnya benar.", correct: true },
                { text: "Data sudah benar — Level 3 hanya sampling noise", why: "Salah: 1 dari 10 mismatch (10%) jauh di atas ambang 0% — harus diselidiki." },
                { text: "Level 1 dan 2 salah hitung", why: "Salah: Level 1/2 mengukur hal berbeda; ketiganya saling melengkapi, bukan saling menggantikan." },
              ],
            },
          ],
          reference: "Recon L1 count, L2 sum, L3 sample — ketiganya wajib lolos; agregat bisa saling meniadakan.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "6 dimensi: completeness, uniqueness, validity, consistency, timeliness, accuracy.",
        "Recon 3 level: count → agregat → EXCEPT. Gate pipeline.",
        "Test: generik (80%) + custom bisnis; jalan otomatis tiap load.",
        "Komunikasi: skor + dampak Rp — bukan keluhan.",
        "Quality = asuransi karir.",
      ],
      next: { label: "C16 — Data Modeling", href: "/v2/learn/c16-data-modeling" },
      quiz: [
        {
          q: "Cek pertama untuk tabel baru?",
          options: [
            { text: "Langsung analisis", why: "Salah — itu cara tercepat menuju laporan salah." },
            { text: "Template 6 dimensi (completeness → timeliness)", why: "Benar. 15 menit audit menghemat berhari-hari debug.", correct: true },
            { text: "Visualisasi", why: "Salah — visualisasi tanpa cek = chart dari data kotor." },
          ],
        },
        {
          q: "status='lancar' tapi dpd>0 melanggar dimensi?",
          options: [
            { text: "Completeness", why: "Salah — datanya ada, hanya tidak konsisten." },
            { text: "Consistency", why: "Benar. Aturan bisnis dilanggar = inkonsisten.", correct: true },
            { text: "Timeliness", why: "Salah — bukan soal kekinian data." },
          ],
        },
        {
          q: "EXCEPT dua arah untuk?",
          options: [
            { text: "Dedup", why: "Salah." },
            { text: "Temukan tepat baris mana yang hilang/berbeda", why: "Benar. Level 3 recon = investigasi presisi.", correct: true },
            { text: "Pivot", why: "Salah." },
          ],
        },
        {
          q: "Laporan A (mart) = Rp100M; sumber (ODS) = Rp100M; tapi rincian per kota di A berjumlah Rp97M. Curigai dulu?",
          options: [
            { text: "Duplikat", why: "Salah — totalnya cocok, jadi bukan duplikat." },
            { text: "kota NULL/kosong — Rp3M tidak teralokasi", why: "Benar. Total cocok tapi rincian tidak = ada yang lolos dari GROUP BY (ingat C2!). Cek SUM(CASE WHEN kota IS NULL THEN nominal END).", correct: true },
            { text: "Server lambat", why: "Salah — bukan masalah performa." },
          ],
        },
        {
          q: "Mengapa test “COUNT(*) > 0” saja tidak cukup untuk pipeline harian?",
          options: [
            { text: "Cukup", why: "Salah." },
            { text: "Lolos jika pipeline memuat 1 baris dari 2 juta (drop 99,99%) atau duplikat 10×", why: "Benar. Butuh rentang wajar (band vs kemarin) + cek distribusi, bukan sekadar “ada”.", correct: true },
            { text: "Terlalu lambat", why: "Salah — bukan soal kecepatan." },
          ],
        },
      ],
    },
  ],
};
