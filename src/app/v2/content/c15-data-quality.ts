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
        "Completeness: `SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi, COUNT(*) - COUNT(penghasilan) AS hilang FROM nasabah;` — selisihnya = baris dengan NULL. Uniqueness: `SELECT id, COUNT(*) FROM nasabah GROUP BY id HAVING COUNT(*) > 1;` — harus kosong. Validity: `SELECT * FROM nasabah WHERE dpd < 0 OR dpd > 3650;` — nilai di luar domain; waspadai sentinel seperti 9999 (“tak terhingga”) yang terlihat valid tapi artinya “tidak tahu” — lebih berbahaya dari NULL karena tidak terdeteksi COUNT.",
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
        "Pembahasan: (1) test uniqueness id + recon Level 2 (SUM sumber vs target). (2) recon Level 1 (count) + not_null test di kolom filter + review query filter NULL (C2!). (3) gate: ① row count ±0 → ② SUM ±0,01% → ③ unique/not_null → ④ custom bisnis. FAIL di langkah manapun = pipeline berhenti + alert. (4) contoh: “Kami menemukan kelebihan catat Rp 2M dari duplikat dan 300 debitur terlewat filter. Angka terkoreksi: Rp 46M. Kami memasang 4 lapis automated check agar tidak terulang; laporan audit menyusul Jumat.”",
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
        "Framework seperti Great Expectations merumuskan DQ sebagai EXPECTATIONS — pernyataan yang bisa diuji: “kolom X tidak boleh null”, “nilai Y di antara 0 dan 100”, “tabel A dan B konsisten”. Kabar baiknya: 90% expectations bisa ditulis sebagai query SQL murni yang mengembalikan PELANGGARAN (bukan sekadar ya/tidak). Polanya: SELECT <kunci> FROM t WHERE NOT (<aturan>) — hasilnya adalah daftar baris bermasalah yang bisa dihitung (COUNT = metrik) dan diinspeksi (contoh = diagnosis). Enam expectation kanonis yang menutupi sebagian besar insiden: (1) completeness — WHERE kolom IS NULL atas kolom wajib; (2) uniqueness — GROUP BY kunci HAVING COUNT(*) > 1; (3) range — WHERE dpd < 0 OR dpd > 9999; (4) referential — LEFT JOIN ... WHERE kanan.id IS NULL (orphan); (5) freshness — WHERE MAX(updated_at) < batas; (6) reconciliation — selisih total antar dua sumber.",
        "Kekuatan pola ini adalah ia KOMPOSABEL menjadi suite yang berjalan tiap load: kumpulkan semua query pelanggaran ke satu tabel hasil_dq (cek_nama, waktu, n_pelanggaran, contoh_kunci), dan pipeline gagal (atau memperingatkan) bila n_pelanggaran melewati ambang. Bedakan dua tingkat kegagalan: HARD FAIL (pelanggaran > 0 langsung menghentikan pipeline — untuk invariant seperti “tidak boleh ada DPD negatif”) vs SOFT WARN (pelanggaran > ambang historis — untuk metrik seperti “% null naik 2× lipat dari minggu lalu”). Ambang absolut untuk invariant, ambang relatif-terhadap-baseline untuk metrik perilaku — mencampurnya membuatmu dibangunkan tengah malam untuk hal sepele atau tidur saat hal serius terjadi.",
        "Scorecard kualitas mengubah 50 cek menjadi SATU angka yang bisa dibaca direksi: skor per dimensi (completeness, validity, consistency, timeliness, uniqueness), masing-masing 0–100, lalu agregat berbobot. Rumus sederhananya: skor_dimensi = 100 × (1 − pelanggaran / total_dicek), dan skor_total = rata-rata berbobot dengan bobot dari DAMPAK KEPUTUSAN (dimensi yang dipakai komite kredit bobotnya 3× lipat dimensi arsip). Tiga aturan agar scorecard tidak menjadi vanity metric: (1) bobot diputuskan BERSAMA pemilik keputusan, bukan oleh tim data sendirian; (2) tren skor lebih penting dari skor absolut — penurunan 95→88 adalah sinyal, 88 yang stabil adalah baseline; (3) tiap sel skor bisa di-drill-down ke daftar pelanggaran — angka tanpa jejak audit adalah dekorasi.",
        "Terakhir, disiplin yang paling sering diabaikan: DQ untuk DATA MASUK vs DQ untuk DATA KELUAR. Cek di pintu masuk (saat ingest: skema, tipe, rentang) mencegah sampah masuk; cek di pintu keluar (sebelum laporan terbit: rekonsiliasi total, perbandingan dengan periode lalu, “apakah angka ini masuk akal?”) menangkap apa yang lolos. Insiden Rp 2 miliar double-count hampir selalu lolos dari cek masuk (datanya “valid” per baris!) dan hanya tertangkap oleh cek keluar (totalnya tidak cocok). Aturan senior: setiap laporan yang memengaruhi uang punya MINIMAL satu cek keluar yang membandingkan dengan sumber independen atau periode sebelumnya — “angka ini mirip dengan yang kemarin” adalah cek yang paling murah dan paling sering menyelamatkan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“DQ = persentase null per kolom.” Itu satu dimensi dari lima, dan bukan dimensi yang paling sering menyebabkan insiden uang. Insiden mahal biasanya datang dari inkonsistensi antar sumber (dua sistem beda angka) dan pelanggaran aturan bisnis (DPD negatif, tanggal lahir di masa depan) — hal yang tidak terlihat dari “% null”. Ukur yang menyebabkan kerugian, bukan yang mudah dihitung.",
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
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "6 dimensi: completeness, uniqueness, validity, consistency, timeliness, accuracy.",
        "Recon 3 level: count → agregat → EXCEPT. Gate pipeline.",
        "Test: generik (80%) + custom bisnis; jalan otomatis tiap load.",
        "Komunikasi: skor + dampak Rp — bukan keluhan.",
        "Quality = asuransi karir.",
      ],
      next: { label: "C16 — Data Modeling", href: "/learn/c16-data-modeling" },
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
