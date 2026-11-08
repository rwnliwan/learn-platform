import type { V2Lesson } from "../lib/types";

// ── Figure: perbandingan lock time tiga strategi load ────────────────────
const LOCK_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang lock time: strategi A 41 detik, B 1 detik, C 0,25 detik, dengan garis jendela 5 detik">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="150" y1="20" x2="150" y2="200"/><line x1="150" y1="200" x2="540" y2="200"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text)">
<text x="10" y="60">A: baris-per-baris</text><text x="10" y="110">B: batch</text><text x="10" y="160">C: batch + partisi</text>
</g>
<g opacity="0.9">
<rect x="152" y="48" width="360" height="18" rx="4" fill="var(--c1)"/>
<rect x="152" y="98" width="9" height="18" rx="4" fill="var(--c2)"/>
<rect x="152" y="148" width="4" height="18" rx="4" fill="var(--c3)"/>
<line x1="196" y1="20" x2="196" y2="200" stroke="var(--text)" stroke-width="1.5" stroke-dasharray="6 4"/>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--text-muted)">
<text x="516" y="62">41,00 dtk</text><text x="166" y="112">1,00 dtk</text><text x="160" y="162">0,25 dtk</text>
<text x="200" y="216">jendela 5 dtk</text>
</g>
</svg>`;

export const dba24: V2Lesson = {
  slug: "dba24-etl-untuk-dba",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA24 — ETL sebagai Kompetensi DBA",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan beban ETL dari kacamata DBA — lock, I/O, dan jendela batch; (2) menghitung lock time tiga strategi load (baris-per-baris, batch, batch + partisi) dan memilih yang muat dalam jendela; (3) menjelaskan mengapa partisi memperkecil lock dan mempercepat load; (4) menjelaskan CDC dari redo/WAL sebagai alternatif load periodik; (5) menegosiasikan kontrak kerja yang sehat dengan tim data engineer.",
        "Rutenya: cerita dashboard mati jam 7 pagi → lock dan jendela batch → partisi → CDC → lab sqlite3 (bukti nyata + model biaya lock) → jebakan load → peta keputusan → mini-case 2 juta baris → kuis → rangkuman. Estimasi 60 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. ETL = Extract, Transform, Load — memindahkan data dari sistem operasional ke gudang data/laporan, biasanya malam hari dalam “jendela batch” (jam-jam sepi). Lock = mekanisme database yang mengunci baris/tabel agar tidak diubah bersamaan — load yang buruk mengunci tabel sehingga aplikasi lain antre. Commit = titik di mana sekumpulan perubahan disahkan permanen; tiap commit ada biayanya. CDC (Change Data Capture) = menangkap perubahan dari log transaksi (redo/WAL) alih-alih memindai tabel — seperti menyadap radio, bukan menggeledah rumah.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: ETL dari kacamata DE adalah “pipa data”; dari kacamata DBA ia adalah “tamu yang datang jam 2 pagi”. Tamu yang baik mengetuk pelan (batch kecil), tidak mengunci pintu rumah (lock minimal), dan pergi sebelum tuan rumah bangun (muat dalam jendela).",
      ],
      reference: "Bekal: ETL, jendela batch, lock, commit, CDC. DBA = penjaga rumah saat tamu datang.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Dashboard yang mati tepat jam 7 pagi",
      prose: [
        "Setiap pagi jam 7, direksi membuka dashboard penjualan. Selasa itu dashboard-nya mati — timeout. Tim data engineer bersikeras: “query ETL kami ringan kok, cuma INSERT 20 ribu baris”. DBA memeriksa log dan menemukan: 20 ribu baris itu dimuat SATU PER SATU, masing-masing dengan commit sendiri, ke tabel yang sama dengan yang dibaca dashboard — selama 41 detik tabel terkunci penuh, tepat saat dashboard melakukan refresh paginya.",
        "Twist-nya: query-nya memang ringan. Yang berat bukan query — melainkan 20 ribu commit individual (tiap commit = tulis ke log + sinkronisasi disk) dan lock eksklusif selama proses. DE mengukur “ringan” dari kompleksitas query; DBA mengukur dari dampak konkurensi. Keduanya benar di dunianya masing-masing — dan dashboard tetap mati.",
        "Pelajaran lesson ini: DBA tidak perlu bisa menulis pipeline ETL, tetapi wajib bisa MENILAI pipeline ETL — dari lock time-nya, bukan dari panjang query-nya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “ETL urusan data engineer, DBA tinggal sediakan tabel”",
        body: "Yang benar: setiap load adalah beban lock, I/O, dan log di database — dan DBA yang menanggung akibatnya saat jendela batch jebol atau aplikasi terkunci. DBA yang buta ETL akan selalu kalah cepat dari masalahnya: ia tahu setelah dashboard mati, bukan sebelum. Kompetensi ETL bagi DBA bukan soal tool (Airflow/dbt), melainkan soal fisika load: lock × commit × jendela.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-lock",
      eyebrow: "Langkah 3 · Konsep",
      title: "Lock — Si Antrean Tak Terlihat",
      prose: [
        "Definisi: saat baris dimuat satu per satu dengan commit per baris, database melakukan N kali (tulis baris + tulis log + commit). Commit adalah operasi mahal — ia memaksa sinkronisasi ke disk. Rumus di bawah memodelkan total waktu tabel terkunci. Strategi B (satu batch, satu commit) membayar biaya tulis N kali tetapi biaya commit hanya sekali — itulah mengapa ia 40× lebih cepat untuk N = 20.000.",
        "Kepribadiannya: lock seperti palang pintu tol — mobil (transaksi) antre di belakangnya. Baris-per-baris = petugas yang membuka-tutup palang untuk TIAP mobil (20 ribu kali). Batch = palang dibuka sekali untuk konvoi. Antreannya sama panjang, tetapi palangnya jauh lebih jarang bergerak.",
        "Jendela batch adalah kontraknya: bila load butuh 41 detik tetapi jendela hanya 5 detik (karena dashboard refresh tiap 5 detik, atau aplikasi mulai sibuk), strategi A bukan “kurang optimal” — ia GAGAL kontrak. DBA menilai strategi dari vonis ini, bukan dari keanggunannya.",
      ],
      formula: String.raw`T_{lock} = N \times (t_{baris} + t_{commit})`,
      formulaNote: "T_lock = total waktu lock (detik) — selama inilah tabel tidak bisa dipakai pihak lain; N = jumlah baris; t_baris = biaya tulis satu baris (detik); t_commit = biaya satu commit (detik). Strategi A: tiap baris membayar keduanya → N × (t_baris + t_commit). Strategi B: satu commit untuk semua → N × t_baris + t_commit. Dengan N = 20.000, t_baris = 0,05 ms, t_commit = 2 ms: A = 41,0 detik, B = 1,0 detik.",
      tasks: [],
      hints: [
        "💡 Intuisi: t_commit adalah “pajak tetap per commit” — strategi baris-per-baris membayar pajak 20 ribu kali. Inilah alasan DBA alergi melihat commit di dalam loop.",
      ],
      reference: "T_lock = N × (t_baris + t_commit). Nilai strategi dari vonis jendelanya.",
    },
    {
      id: "konsep-partisi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Partisi — Si Sekat",
      prose: [
        "Definisi: partisi membagi tabel besar menjadi potongan-potongan fisik (per bulan, per wilayah) yang dikelola terpisah tetapi dibaca sebagai satu tabel logis. Dua manfaatnya untuk load: (1) lock per partisi — memuat kuartal berjalan tidak mengunci kuartal lama yang sedang dibaca laporan; (2) operasi per partisi — drop/reload satu partisi jauh lebih murah daripada operasi seluruh tabel.",
        "Cara membaca chart di bawah: tiga batang = lock time strategi A (41,00 dtk), B (1,00 dtk), C (0,25 dtk); garis putus-putus vertikal = jendela 5 detik. Interpretasi: A melewati garis puluhan kali lipat — gagal kontrak; B muat dengan margin 5×; C (batch + 4 partisi) muat dengan margin 20× DAN lock-nya tersebar per partisi sehingga laporan historis tidak terganggu sama sekali.",
        "Kapan partisi layak: tabel > jutaan baris dengan pola akses per periode/wilayah, dan load rutin menyentuh sebagian kecil tabel. Kapan TIDAK: tabel kecil (< 100 ribu baris) — overhead partisi (perencanaan query lebih kompleks) lebih besar dari manfaatnya. Partisi adalah obat dosis besar untuk penyakit besar.",
      ],
      figure: {
        svg: LOCK_SVG,
        alt: "Perbandingan lock time strategi A 41 detik, B 1 detik, C 0,25 detik terhadap jendela 5 detik",
        caption: "A = 41,00 dtk (gagal kontrak), B = 1,00 dtk (muat), C = 0,25 dtk per partisi (muat + lock tersebar). Garis putus-putus = jendela 5 detik.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: “partisi selalu mempercepat query”",
        body: "Yang benar: partisi mempercepat query yang MENYARING kolom partisi (pruning) dan memperkecil lock saat load. Query tanpa filter partisi justru bisa lebih lambat (harus memindai semua partisi). Partisi adalah strategi load dan retensi dulu, strategi query kemudian.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: partisi seperti laci arsip berlabel bulan — mencari “Januari” cukup buka satu laci; memasukkan arsip Februari tidak mengacak laci Januari.",
      ],
      reference: "Partisi = lock per potongan + operasi per potongan. Layak untuk tabel besar berpola periode.",
    },
    {
      id: "konsep-cdc",
      eyebrow: "Langkah 5 · Konsep",
      title: "CDC — Si Mata-mata Log",
      prose: [
        "Definisi: Change Data Capture menangkap perubahan dari LOG transaksi database (redo log di Oracle, WAL di Postgres) — bukan dengan memindai tabel. Setiap commit sudah menulis ke log; CDC “menyadap” aliran itu dan meneruskannya ke gudang data/antrean. Hasilnya: beban nyaris nol di database sumber (tidak ada query pemindaian berat), dan latensi mendekati real-time (detik, bukan jam).",
        "Kepribadiannya: ETL batch seperti sensus penduduk — datang tiap malam, mengetuk semua pintu, mengganggu yang sedang tidur. CDC seperti petugas catatan sipil — mencatat setiap kelahiran/kematian saat terjadi, tanpa mengganggu siapa pun. Untuk DBA, CDC adalah tamu ideal: ia tidak mengunci, tidak memindai, tidak meminta jendela.",
        "Kapan CDC vs batch: CDC bila butuh latensi rendah (menit/detik) atau sumber tidak boleh dibebani — dengan harga kompleksitas operasional (connector, schema registry, monitoring lag). Batch tetap menang bila latensinya boleh harian dan tim kecil — sederhana, mudah di-debug. Kolaborasi DBA–DE yang sehat: DBA menyediakan akses log + memonitor lag CDC; DE membangun transformasinya. Kontraknya tertulis: berapa lag maksimum yang ditoleransi, dan siapa yang dihubungi saat lag melewatinya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “CDC = tidak butuh DBA lagi”",
        body: "Yang benar: CDC memindahkan beban, bukan menghilangkannya. Log harus di-retain cukup lama (bila connector mati seminggu, log-nya harus masih ada), lag harus dimonitor, dan schema change di sumber bisa mematahkan connector. DBA tetap penjaga — hanya menjaga hal yang berbeda: retensi log dan lag, bukan jendela batch.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: tanya tiga hal sebelum setuju CDC — (1) berapa lama log di-retain? (2) siapa yang monitor lag? (3) apa yang terjadi saat schema berubah? Jawaban “belum tahu” untuk ketiganya = CDC belum siap.",
      ],
      reference: "CDC = sadap log, bukan pindai tabel. Kontrak: lag maksimum + retensi log + pemilik.",
    },
    {
      id: "lab-lock",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bukti nyata + model biaya lock",
      prose: [
        "Dua lapis dalam satu lab. Pertama, bukti nyata di sqlite3 (tersedia di browser): 2.000 baris dimuat baris-per-baris vs batch — keduanya berhasil, hitung barisnya. Kedua, model biaya dari angka: dengan N = 20.000, hitung lock time tiga strategi dan vonis terhadap jendela 5 detik. Tugasmu: lengkapi tiga perhitungan dan tentukan pemenangnya.",
        "Coba: setelah lolos, naikkan N menjadi 2.000.000 (dua juta) dan lihat vonis tiap strategi — strategi B pun akhirnya jebol; hanya C yang selamat. Itulah mengapa mini-case memakai angka itu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lock_a` = N × (T_BARIS_MS + T_COMMIT_MS) / 1000 (detik)" },
        { id: "t2", text: "Hitung `lock_b` = (N × T_BARIS_MS + T_COMMIT_MS) / 1000 (detik)" },
        { id: "t3", text: "Hitung `lock_c` = lock_b / 4 (4 partisi)" },
        { id: "t4", text: "Isi `pemenang` dengan \"A\", \"B\", atau \"C\" — tercepat yang muat di jendela" },
        { id: "t5", text: "Jalankan dan pastikan “Pemenang: C” tercetak" },
      ],
      expected: "Baris termuat A: 2000 | B: 2000 | partisi: 4 tabel\nStrategi A (baris-per-baris): lock 41.00 dtk -> MELEBIHI jendela (5 dtk)\nStrategi B (batch): lock 1.00 dtk -> MUAT (5 dtk)\nStrategi C (batch + 4 partisi): lock 0.25 dtk per partisi -> MUAT (5 dtk)\nPemenang: C",
      code: {
        starter: `# Lab DBA24 — angka SINTETIS; sqlite3 dipakai untuk bukti nyata
import sqlite3  # JANGAN UBAH
N = 20000  # JANGAN UBAH
T_BARIS_MS, T_COMMIT_MS, JENDELA_DTK = 0.05, 2.0, 5.0  # JANGAN UBAH

con = sqlite3.connect(":memory:")  # JANGAN UBAH
con.execute("CREATE TABLE stg_a (id INTEGER PRIMARY KEY, amt REAL)")  # JANGAN UBAH
con.execute("CREATE TABLE stg_b (id INTEGER PRIMARY KEY, amt REAL)")  # JANGAN UBAH
data = [(i, i * 1.5) for i in range(2000)]  # JANGAN UBAH
for r in data:  # JANGAN UBAH
    con.execute("INSERT INTO stg_a VALUES (?, ?)", r)  # JANGAN UBAH
con.commit()  # JANGAN UBAH
con.executemany("INSERT INTO stg_b VALUES (?, ?)", data)  # JANGAN UBAH
con.commit()  # JANGAN UBAH

# TULIS KODEMU DI BAWAH INI
lock_a = 0.0  # TODO t1
lock_b = 0.0  # TODO t2
lock_c = 0.0  # TODO t3
pemenang = ""  # TODO t4: "A", "B", atau "C"

def vonis(lock):
    return "MUAT" if lock <= JENDELA_DTK else "MELEBIHI jendela"

n_a = con.execute("SELECT COUNT(*) FROM stg_a").fetchone()[0]
n_b = con.execute("SELECT COUNT(*) FROM stg_b").fetchone()[0]
print("Baris termuat A: %d | B: %d | partisi: %d tabel" % (n_a, n_b, 4))
print("Strategi A (baris-per-baris): lock %.2f dtk -> %s (%d dtk)" % (lock_a, vonis(lock_a), JENDELA_DTK))
print("Strategi B (batch): lock %.2f dtk -> %s (%d dtk)" % (lock_b, vonis(lock_b), JENDELA_DTK))
print("Strategi C (batch + 4 partisi): lock %.2f dtk per partisi -> %s (%d dtk)" % (lock_c, vonis(lock_c), JENDELA_DTK))
print("Pemenang: %s" % pemenang)`,
        lockLines: 14,
        solution: `# Lab DBA24 — angka SINTETIS; sqlite3 dipakai untuk bukti nyata
import sqlite3  # JANGAN UBAH
N = 20000  # JANGAN UBAH
T_BARIS_MS, T_COMMIT_MS, JENDELA_DTK = 0.05, 2.0, 5.0  # JANGAN UBAH

con = sqlite3.connect(":memory:")  # JANGAN UBAH
con.execute("CREATE TABLE stg_a (id INTEGER PRIMARY KEY, amt REAL)")  # JANGAN UBAH
con.execute("CREATE TABLE stg_b (id INTEGER PRIMARY KEY, amt REAL)")  # JANGAN UBAH
data = [(i, i * 1.5) for i in range(2000)]  # JANGAN UBAH
for r in data:  # JANGAN UBAH
    con.execute("INSERT INTO stg_a VALUES (?, ?)", r)  # JANGAN UBAH
con.commit()  # JANGAN UBAH
con.executemany("INSERT INTO stg_b VALUES (?, ?)", data)  # JANGAN UBAH
con.commit()  # JANGAN UBAH

# TULIS KODEMU DI BAWAH INI
lock_a = N * (T_BARIS_MS + T_COMMIT_MS) / 1000
lock_b = (N * T_BARIS_MS + T_COMMIT_MS) / 1000
lock_c = lock_b / 4
pemenang = "C"

def vonis(lock):
    return "MUAT" if lock <= JENDELA_DTK else "MELEBIHI jendela"

n_a = con.execute("SELECT COUNT(*) FROM stg_a").fetchone()[0]
n_b = con.execute("SELECT COUNT(*) FROM stg_b").fetchone()[0]
print("Baris termuat A: %d | B: %d | partisi: %d tabel" % (n_a, n_b, 4))
print("Strategi A (baris-per-baris): lock %.2f dtk -> %s (%d dtk)" % (lock_a, vonis(lock_a), JENDELA_DTK))
print("Strategi B (batch): lock %.2f dtk -> %s (%d dtk)" % (lock_b, vonis(lock_b), JENDELA_DTK))
print("Strategi C (batch + 4 partisi): lock %.2f dtk per partisi -> %s (%d dtk)" % (lock_c, vonis(lock_c), JENDELA_DTK))
print("Pemenang: %s" % pemenang)`,
        checks: [
          { kind: "equal", task: "t1", name: "lock_a", value: 41.0, tol: 0.01, label: "`lock_a` = 41,00 detik", msg: "N × (0,05 + 2,0) / 1000." },
          { kind: "equal", task: "t2", name: "lock_b", value: 1.0, tol: 0.01, label: "`lock_b` = 1,00 detik", msg: "(N × 0,05 + 2,0) / 1000." },
          { kind: "equal", task: "t3", name: "lock_c", value: 0.25, tol: 0.01, label: "`lock_c` = 0,25 detik", msg: "lock_b / 4 partisi." },
          { kind: "equal", task: "t4", name: "pemenang", value: "C", label: "`pemenang` = C", msg: "Tercepat yang muat di jendela 5 detik." },
          { kind: "stdout_matches", task: "t5", pattern: "41\\.00", label: "Angka 41,00 tercetak", msg: "Pastikan perhitungan lock_a tercetak." },
          { kind: "stdout_matches", task: "t5", pattern: "Pemenang: C", label: "Pemenang tercetak", msg: "Baris terakhir: “Pemenang: C”." },
        ],
      },
      reference: "Bukti sqlite3: kedua strategi memuat 2.000 baris. Model: A = 41 dtk (gagal), B = 1 dtk, C = 0,25 dtk.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Tiga jebakan load",
      prose: [
        "Jebakan 1 — indeks di tabel staging. Load 2 juta baris ke tabel dengan 5 indeks: tiap INSERT memperbarui 5 indeks → load 3× lebih lambat. Aturan: staging table untuk load = tanpa indeks (atau indeks minimal); indeks dibangun SETELAH load selesai.",
        "Jebakan 2 — statistik basi. Tabel baru saja dimuat 2 juta baris, tetapi statistik optimizer masih menggambarkan tabel kosong → query plan memilih full scan untuk query yang seharusnya pakai indeks. Aturan: ANALYZE/gather stats adalah bagian dari pipeline load, bukan pekerjaan “nanti”.",
        "Jebakan 3 — foreign key check saat load. Tiap baris INSERT memicu pengecekan FK ke tabel parent → ribuan lookup acak. Aturan: untuk load awal yang datanya sudah tervalidasi, nonaktifkan FK sementara (dengan documented window), lalu validasi ulang setelahnya — jangan biarkan check per-baris membunuh throughput.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “load lambat = databasenya kurang kuat”",
        body: "Yang benar: 9 dari 10 load lambat adalah masalah POLA (commit per baris, indeks saat load, FK check, tanpa partisi) — bukan kapasitas. Menambah CPU untuk load baris-per-baris seperti menambah lajur tol untuk petugas yang membuka-tutup palang tiap mobil: antreannya tetap.",
        type: "pitfall",
      },
      reference: "Staging tanpa indeks; ANALYZE setelah load; FK dinonaktifkan sementara untuk bulk load tervalidasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan strategi load",
      prose: [
        "Skenario 1 — < 100 ribu baris, jendela longgar: batch sederhana cukup — jangan over-engineering.",
        "Skenario 2 — Jutaan baris, jendela ketat: batch + partisi (lock tersebar, operasi per partisi).",
        "Skenario 3 — Butuh latensi menit/detik, sumber tak boleh dibebani: CDC dari log — dengan kontrak lag dan retensi yang tertulis.",
        "Skenario 4 — Load lambat misterius: cek tiga tersangka berurutan — commit per baris? indeks saat load? FK check per baris?",
        "Aturan praktis 10 detik: (1) Hitung T_lock SEBELUM menyetujui jadwal load. (2) Staging tanpa indeks; ANALYZE setelah load. (3) CDC butuh kontrak lag tertulis, bukan sekadar connector yang jalan.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "2 juta baris, jendela 30 menit",
      prose: [
        "Retail memuat 2 juta baris penjualan tiap malam; jendela batch 30 menit (01.00–01.30) sebelum laporan regional jam 02.00. Parameter sama seperti lab (t_baris 0,05 ms, t_commit 2 ms). Pertanyaan: (1) Berapa lock time strategi A, B, dan C (4 partisi)? (2) Strategi mana yang muat — dan mana yang memberi margin paling aman? (3) Bila tim DE mengusulkan CDC, dua pertanyaan apa yang harus dijawab dulu?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) A = 2.000.000 × 2,05 ms = 4.100 dtk ≈ 68 menit (GAGAL — 2× jendela); B = 2.000.000 × 0,05 ms + 2 ms ≈ 100 dtk; C = 25 dtk per partisi. (2) B dan C muat; C memberi margin 72× dan tidak mengunci tabel historis — pilih C bila tabel terpartisi, B bila belum. (3) Berapa lag maksimum yang ditoleransi laporan jam 02.00? dan berapa lama log di-retain bila connector mati? Tanpa jawaban tertulis untuk keduanya, CDC adalah janji kosong.",
        type: "risk",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "DBA menilai ETL dari lock time-nya: T_lock = N × (t_baris + t_commit); vonis terhadap jendela batch.",
        "Batch mengalahkan baris-per-baris karena membayar pajak commit sekali, bukan N kali.",
        "Partisi = lock per potongan + operasi per potongan; layak untuk tabel besar berpola periode.",
        "CDC menyadap log (nyaris nol beban sumber, latensi detik) — butuh kontrak lag + retensi log tertulis.",
        "Jebakan load: indeks saat load, statistik basi, FK check per baris.",
        "Kontrak DBA–DE: T_lock dihitung dulu, lag CDC tertulis, pemiliknya bernama.",
      ],
      next: { label: "DBA25 — Jalur Sertifikasi DBA: Oracle & Azure", href: "/v2/learn/dba25-sertifikasi-oracle-azure" },
      quiz: [
        {
          q: "Load 20 ribu baris baris-per-baris dengan commit tiap baris. Komponen biaya dominannya?",
          options: [
            { text: "Kompleksitas query INSERT", why: "Salah: INSERT satu baris itu sepele — yang mahal adalah pengulangannya.", correct: false },
            { text: "20 ribu commit individual — pajak tetap per commit dibayar 20 ribu kali", why: "Benar: t_commit × N mendominasi; batch membayarnya sekali.", correct: true },
            { text: "Ukuran data 20 ribu baris", why: "Salah: strategi B memuat data yang sama 40× lebih cepat.", correct: false },
            { text: "Kecepatan disk", why: "Salah: disk yang sama dipakai strategi B tanpa masalah.", correct: false },
          ],
        },
        {
          q: "Mengapa strategi C (batch + 4 partisi) lebih baik dari B untuk tabel historis besar?",
          options: [
            { text: "Total waktunya selalu lebih kecil dari B", why: "Salah: totalnya seperempat B per partisi — tetapi keunggulannya bukan cuma kecepatan.", correct: false },
            { text: "Lock tersebar per partisi: laporan yang membaca kuartal lama tidak terganggu load kuartal berjalan", why: "Benar: isolasi blast radius adalah nilai tambah utama partisi.", correct: true },
            { text: "Partisi menghapus kebutuhan commit", why: "Salah: commit tetap ada, hanya lock-nya yang tersekat.", correct: false },
            { text: "Query menjadi otomatis lebih cepat", why: "Salah: hanya query dengan filter partisi yang terbantu (pruning).", correct: false },
          ],
        },
        {
          q: "Tabel staging untuk bulk load sebaiknya...",
          options: [
            { text: "Diberi indeks lengkap agar load terpantau", why: "Salah: tiap INSERT memperbarui semua indeks — load melambat berkali lipat.", correct: false },
            { text: "Tanpa indeks (minimal); indeks dibangun setelah load + ANALYZE dijalankan", why: "Benar: urutan yang benar — muat dulu, struktur kemudian, statistik terakhir.", correct: true },
            { text: "Dipartisi per baris", why: "Salah: partisi per baris = overhead tanpa manfaat.", correct: false },
            { text: "Dibuat sebagai view", why: "Salah: view tidak menyimpan data load.", correct: false },
          ],
        },
        {
          q: "Tim DE mengusulkan CDC untuk mengganti batch malam. Dua pertanyaan DBA yang wajib terjawab dulu?",
          options: [
            { text: "Merek connector dan bahasanya", why: "Salah: detail implementasi, bukan kontrak operasional.", correct: false },
            { text: "Berapa lag maksimum yang ditoleransi + berapa lama log di-retain bila connector mati", why: "Benar: dua hal yang menentukan apakah CDC bisa diandalkan saat masalah.", correct: true },
            { text: "Apakah CDC lebih modern dari batch", why: "Salah: modern bukan kriteria keputusan.", correct: false },
            { text: "Siapa vendor termurahnya", why: "Salah: harga tanpa kontrak operasional = jebakan.", correct: false },
          ],
        },
        {
          q: "Dashboard timeout tiap pagi bersamaan dengan job ETL. Langkah diagnosis pertama yang tepat?",
          options: [
            { text: "Menambah CPU database", why: "Salah: menebak kapasitas sebelum mengukur pola adalah cara mahal yang sering gagal.", correct: false },
            { text: "Memeriksa apakah job me-lock tabel yang dibaca dashboard, dan menghitung T_lock vs jendela", why: "Benar: ukur dulu (lock + waktu), tebak kemudian — seperti cerita pembuka.", correct: true },
            { text: "Meminta DE menulis ulang query", why: "Salah: query-nya ringan; masalahnya pola load.", correct: false },
            { text: "Memindahkan dashboard ke jam lain", why: "Salah: mengobati gejala; lock 41 detik akan mengganggu siapa pun yang datang.", correct: false },
          ],
        },
        {
          q: "Kapan partisi TIDAK layak dipakai?",
          options: [
            { text: "Tabel 50 ribu baris tanpa pola akses periode", why: "Benar: overhead partisi lebih besar dari manfaatnya di tabel kecil.", correct: true },
            { text: "Tabel 500 juta baris dengan query per bulan", why: "Salah: ini kasus ideal partisi.", correct: false },
            { text: "Load harian 10 juta baris", why: "Salah: ini kasus ideal partisi.", correct: false },
            { text: "Butuh drop data lama per kuartal", why: "Salah: drop partisi adalah operasi termurah untuk retensi.", correct: false },
          ],
        },
      ],
    },
  ],
};
