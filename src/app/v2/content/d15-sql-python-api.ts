import type { V2Lesson } from "../lib/types";

export const d15: V2Lesson = {
  slug: "d15-sql-python-api",
  track: "Python",
  module: "Integrasi",
  title: "D15 SQL & API: Mengambil Data dari Luar",
  estMinutes: 55,
  steps: [
    {
      id: "kenapa-sql",
      eyebrow: "Langkah 1 · SQL",
      title: "Cerita pembuka: data tidak lahir di CSV",
      prose: [
        "Data produksi tinggal di database, bukan CSV. Analis yang hanya bisa baca CSV menunggu orang lain mengekstrak — analis yang bisa SQL mengambil sendiri. SQL adalah bahasa mengambil data; Python bahasa mengolahnya. Keduanya dipakai bersama setiap hari.",
        "Di sini kita pakai `sqlite3` bawaan Python (database file/in-memory, tanpa server) — sintaks SQL-nya sama dengan yang dipakai di PostgreSQL/MySQL untuk SELECT, JOIN, GROUP BY. Keterampilan SQL-nya transferable.",
      ],
      tasks: [],
      reference: "SQL = ambil; Python = olah. sqlite3 untuk latihan, sintaks transferable.",
    },
    {
      id: "query-dasar",
      eyebrow: "Langkah 2 · Query dasar",
      title: "SELECT, WHERE, COUNT dari Python",
      prose: [
        "`sqlite3.connect(':memory:')` membuat database di RAM. `cur.execute('SELECT COUNT(*) FROM nasabah')` menjalankan SQL; `.fetchone()[0]` mengambil hasilnya. Parameter pakai `?` (bukan f-string!) — mencegah SQL injection.",
        "Aturan keamanan: JANGAN pernah format string SQL dengan f-string untuk nilai dari user. Selalu `?` + tuple parameter. Ini bukan gaya — ini keamanan.",
      ],
      requires: ["sqlite3"],
      tasks: [
        { id: "t1", text: "Hitung `n_nasabah` via SELECT COUNT(*)" },
        { id: "t2", text: "Hitung `total_plafon` via SELECT SUM(plafon)" },
      ],
      expected: "n_nasabah=3  total_plafon=230000000",
      note: {
        title: "Sering salah",
        body: "Menyusun SQL dengan f-string: f\"SELECT ... WHERE kota = '{kota}'\". Satu input jahat (`' OR '1'='1`) membocorkan seluruh tabel. Selalu placeholder `?` + parameter.",
      },
      hints: [
        "cur.execute('SELECT COUNT(*) FROM nasabah').fetchone()[0].",
        "cur.execute('SELECT SUM(plafon) FROM nasabah').fetchone()[0].",
        "Parameter aman: cur.execute('... WHERE kota = ?', (kota,)).",
      ],
      code: {
        starter: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id INTEGER, kota TEXT, plafon REAL)")\ncur.executemany("INSERT INTO nasabah VALUES (?, ?, ?)",\n                [(1, "Jakarta", 50_000_000), (2, "Bandung", 100_000_000), (3, "Jakarta", 80_000_000)])\n\n# TULIS KODEMU\nn_nasabah = \ntotal_plafon = \n\nprint(f"n_nasabah={n_nasabah}  total_plafon={total_plafon:.0f}")`,
        lockLines: 6,
        solution: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id INTEGER, kota TEXT, plafon REAL)")\ncur.executemany("INSERT INTO nasabah VALUES (?, ?, ?)",\n                [(1, "Jakarta", 50_000_000), (2, "Bandung", 100_000_000), (3, "Jakarta", 80_000_000)])\n\n# TULIS KODEMU\nn_nasabah = cur.execute("SELECT COUNT(*) FROM nasabah").fetchone()[0]\ntotal_plafon = cur.execute("SELECT SUM(plafon) FROM nasabah").fetchone()[0]\n\nprint(f"n_nasabah={n_nasabah}  total_plafon={total_plafon:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_nasabah", value: 3, tol: 1e-9, label: "`n_nasabah` = 3", msg: "Tiga baris di tabel nasabah." },
          { kind: "equal", task: "t2", name: "total_plafon", value: 230000000.0, tol: 1.0, label: "`total_plafon` = 230000000", msg: "50jt + 100jt + 80jt." },
          { kind: "stdout_matches", task: "t2", pattern: "n_nasabah=3\\s+total_plafon=230000000", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Placeholder `?` + tuple — jangan f-string untuk nilai.",
    },
    {
      id: "join-agregat",
      eyebrow: "Langkah 3 · JOIN + GROUP BY",
      title: "Menggabung dan meringkas",
      prose: [
        "Pertanyaan bisnis jarang dijawab satu tabel: total transaksi per kota butuh JOIN nasabah-transaksi lalu GROUP BY kota. Pola ini — join lalu agregat — adalah 80% query analisis.",
        "Dari query ke pandas: `pd.read_sql(query, con)` langsung menjadi DataFrame. SQL untuk mengambil-meringkas di database (cepat, dekat data); pandas untuk eksplorasi lanjutan di Python.",
      ],
      requires: ["sqlite3", "pandas"],
      tasks: [
        { id: "t1", text: "Query total transaksi per kota (JOIN + GROUP BY) → `tot` (dict)" },
        { id: "t2", text: "Hitung `pangsa_jkt` = Jakarta / total" },
      ],
      expected: "jkt=800000  bdg=700000  pangsa_jkt=0.4706",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Konsentrasi exposure per kota/segmen adalah metrik risiko kredit inti. Query agregat per segmen seperti ini adalah cara laporan konsentrasi dibuat — salah JOIN (duplikat baris) berarti angka konsentrasi salah, dan keputusan limit ikut salah.",
      },
      hints: [
        "SELECT n.kota, SUM(t.jumlah) AS total FROM nasabah n JOIN trx t ON t.nasabah_id = n.id GROUP BY n.kota.",
        "tot = dict(cur.execute(query).fetchall()).",
        "pangsa_jkt = tot['Jakarta'] / sum(tot.values())",
      ],
      code: {
        starter: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id INTEGER, kota TEXT)")\ncur.execute("CREATE TABLE trx (nasabah_id INTEGER, jumlah REAL)")\ncur.executemany("INSERT INTO nasabah VALUES (?, ?)",\n                [(1, "Jakarta"), (2, "Bandung"), (3, "Surabaya"), (4, "Jakarta")])\ncur.executemany("INSERT INTO trx VALUES (?, ?)",\n                [(1, 500_000), (4, 300_000), (2, 700_000), (3, 200_000)])\n\n# TULIS KODEMU\nquery = \ntot = \njkt = \nbdg = \npangsa_jkt = \n\nprint(f"jkt={jkt:.0f}  bdg={bdg:.0f}  pangsa_jkt={pangsa_jkt:.4f}")`,
        lockLines: 8,
        solution: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id INTEGER, kota TEXT)")\ncur.execute("CREATE TABLE trx (nasabah_id INTEGER, jumlah REAL)")\ncur.executemany("INSERT INTO nasabah VALUES (?, ?)",\n                [(1, "Jakarta"), (2, "Bandung"), (3, "Surabaya"), (4, "Jakarta")])\ncur.executemany("INSERT INTO trx VALUES (?, ?)",\n                [(1, 500_000), (4, 300_000), (2, 700_000), (3, 200_000)])\n\n# TULIS KODEMU\nquery = """SELECT n.kota, SUM(t.jumlah) AS total\n           FROM nasabah n JOIN trx t ON t.nasabah_id = n.id\n           GROUP BY n.kota"""\ntot = dict(cur.execute(query).fetchall())\njkt = tot["Jakarta"]\nbdg = tot["Bandung"]\npangsa_jkt = tot["Jakarta"] / sum(tot.values())\n\nprint(f"jkt={jkt:.0f}  bdg={bdg:.0f}  pangsa_jkt={pangsa_jkt:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "jkt", value: 800000.0, tol: 1.0, label: "`jkt` = 800000", msg: "500rb + 300rb dari dua nasabah Jakarta." },
          { kind: "equal", task: "t1", name: "bdg", value: 700000.0, tol: 1.0, label: "`bdg` = 700000", msg: "Satu nasabah Bandung." },
          { kind: "equal", task: "t2", name: "pangsa_jkt", value: 0.4706, tol: 0.0001, label: "`pangsa_jkt` sekitar 0.4706", msg: "800rb / 1.7jt." },
          { kind: "stdout_matches", task: "t2", pattern: "jkt=800000\\s+bdg=700000\\s+pangsa_jkt=0\\.4706", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "JOIN lalu GROUP BY = 80% query analisis. pd.read_sql(query, con) -> DataFrame.",
    },
    {
      id: "api-json",
      eyebrow: "Langkah 4 · API",
      title: "Membaca respons API",
      prose: [
        "Data eksternal (kurs, skor kredit biro) datang via API sebagai JSON. Pola: request → `json.loads` → navigasi dict bertingkat → validasi `status`. Di produksi pakai `urllib.request`/`requests`; di sini kita latih parsing-nya dengan respons contoh.",
        "Selalu validasi: cek `status == 'ok'`, cek kunci ada (`.get` dengan default), tangani timeout. API yang berubah format tanpa validasi = pipeline yang diam-diam menghasilkan angka salah.",
      ],
      tasks: [
        { id: "t1", text: "Parse JSON respons → `d`" },
        { id: "t2", text: "Ambil `usd` dan `n_kurs`" },
      ],
      expected: "usd=15800  n_kurs=2",
      note: {
        title: "Sering salah",
        body: "Mengakses `d['data']['kurs']['USD']` tanpa cek — satu level hilang dan seluruh pipeline crash (atau lebih buruk: except polos menelannya). Validasi struktur respons sebelum dipakai.",
      },
      hints: [
        "d = json.loads(resp).",
        "usd = d['data']['kurs']['USD'].",
        "n_kurs = len(d['data']['kurs'])",
      ],
      code: {
        starter: `import json\n\n# simulasi respons API kurs (produksi: urllib.request.urlopen)\nresp = '{"status": "ok", "data": {"kurs": {"USD": 15800, "EUR": 17100}}}'\n\n# TULIS KODEMU\nd = \nok = \nusd = \nn_kurs = \n\nprint(f"ok={ok}  usd={usd}  n_kurs={n_kurs}")`,
        lockLines: 3,
        solution: `import json\n\n# simulasi respons API kurs (produksi: urllib.request.urlopen)\nresp = '{"status": "ok", "data": {"kurs": {"USD": 15800, "EUR": 17100}}}'\n\n# TULIS KODEMU\nd = json.loads(resp)\nok = d["status"] == "ok"\nusd = d["data"]["kurs"]["USD"]\nn_kurs = len(d["data"]["kurs"])\n\nprint(f"ok={ok}  usd={usd}  n_kurs={n_kurs}")`,
        checks: [
          { kind: "equal", task: "t2", name: "usd", value: 15800, tol: 1e-9, label: "`usd` = 15800", msg: "Kurs USD dari respons." },
          { kind: "equal", task: "t2", name: "n_kurs", value: 2, tol: 1e-9, label: "`n_kurs` = 2", msg: "Dua mata uang dalam respons." },
          { kind: "equal", task: "t1", name: "ok", value: true, label: "`ok` = True", msg: "Status respons 'ok'." },
          { kind: "stdout_matches", task: "t2", pattern: "ok=True\\s+usd=15800\\s+n_kurs=2", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "json.loads -> navigasi dict -> validasi status. Cek kunci sebelum pakai.",
    },
    {
      id: "advanced-injection",
      eyebrow: "Langkah 5 · Advanced",
      requires: ["sqlite3"],
      title: "Advanced: parameterized query — SQL injection dalam 3 baris",
      prose: [
        "Serangan paling klasik terhadap kode data — dan paling mudah dicegah. SQL injection terjadi saat input user digabung ke query via f-string/format: `f'SELECT * FROM nasabah WHERE id = \"{masukan}\"'`. Bila masukan = `\" OR \"1\"=\"1`, query menjadi `WHERE id = \"\" OR \"1\"=\"1\"` — kondisi selalu benar, SEMUA baris kembali. Dalam kasus nyata: `'; DROP TABLE nasabah; --` menghapus tabel; `' OR '1'='1' --` melewati login. Ini bukan teori — ini OWASP Top 10 yang tetap nomor satu setelah 20 tahun.",
        "Obatnya satu dan tidak bisa ditawar: PARAMETERIZED QUERY — placeholder `?` (sqlite3), `%s` (psycopg2), atau `:nama` (SQLAlchemy): `cur.execute(\"SELECT * FROM nasabah WHERE id = ?\", (masukan,))`. Database memisahkan QUERY (dikompilasi sekali) dari DATA (tidak pernah dikompilasi) — input jahat hanya menjadi string yang dicocokkan, tidak pernah menjadi kode. Aturannya absolut: TIDAK ADA f-string/format/% dalam query SQL yang menyentuh input luar — tanpa pengecualian, tanpa 'tapi inputnya internal'. Berlaku juga untuk `pd.read_sql(query, con, params=[...])` dan `sqlalchemy.text('... WHERE id = :id').bindparams(id=...)`. Praktikkan di lab: buktikan 3 baris bocor vs 0 baris aman — dengan input yang SAMA.",
        "Dua catatan senior. Pertama, parameterized melindungi NILAI, bukan STRUKTUR — nama tabel/kolom tidak bisa jadi parameter; bila nama kolom berasal dari input, validasi melawan allowlist (`if kolom not in {'id','nama','kota'}: raise`). Kedua, injection bukan hanya SQL — pola yang sama (data menjadi kode) ada di shell (`os.system(f'...{input}')`), eval, dan template HTML; obatnya sama: API yang memisahkan kode dari data, bukan sanitasi manual dengan regex yang pasti bocor.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `q_bahaya` via f-string dan hitung `n_bahaya` (baris yang bocor)" },
        { id: "t2", text: "Query AMAN dengan placeholder `?` + tuple params, hitung `n_aman`" },
      ],
      expected: "n_bahaya=3 (semua bocor), n_aman=0 (input hanya data)",
      hints: [
        "q_bahaya = f'SELECT * FROM nasabah WHERE id = \"{masukan}\"'.",
        "Aman: cur.execute('SELECT * FROM nasabah WHERE id = ?', (masukan,)).",
        "Bandingkan: n_bahaya vs n_aman untuk masukan yang SAMA.",
      ],
      code: {
        starter: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id TEXT, nama TEXT, kota TEXT)")\ncur.executemany("INSERT INTO nasabah VALUES (?,?,?)",\n                [("A01", "Sari", "Jakarta"),\n                 ("A02", "Budi", "Bandung"),\n                 ("A03", "Rina", "Jakarta")])\nprint("tabel siap: 3 baris")\n\n# simulasi input dari user / API (JANGAN PERCAYA INPUT INI)\nmasukan = '" OR "1"="1'\n\n# TULIS KODEMU: dua cara query — berbahaya vs aman\n# CARA BERBAHAYA: f-string — input menjadi BAGIAN query\nq_bahaya =\nn_bahaya = len(cur.execute(q_bahaya).fetchall())\n\n# CARA AMAN: parameterized — input hanya DATA, tidak pernah kode\nn_aman = len(cur.execute(\n    "SELECT * FROM nasabah WHERE id = ?", ).fetchall())\n\nprint(f"n_bahaya={n_bahaya} n_aman={n_aman}")\n`,
        lockLines: 13,
        solution: `import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id TEXT, nama TEXT, kota TEXT)")\ncur.executemany("INSERT INTO nasabah VALUES (?,?,?)",\n                [("A01", "Sari", "Jakarta"),\n                 ("A02", "Budi", "Bandung"),\n                 ("A03", "Rina", "Jakarta")])\nprint("tabel siap: 3 baris")\n\n# simulasi input dari user / API (JANGAN PERCAYA INPUT INI)\nmasukan = '" OR "1"="1'\n\n# TULIS KODEMU: dua cara query — berbahaya vs aman\n# CARA BERBAHAYA: f-string — input menjadi BAGIAN query\nq_bahaya = f'SELECT * FROM nasabah WHERE id = "{masukan}"'\nn_bahaya = len(cur.execute(q_bahaya).fetchall())\n\n# CARA AMAN: parameterized — input hanya DATA, tidak pernah kode\nn_aman = len(cur.execute(\n    "SELECT * FROM nasabah WHERE id = ?", (masukan,)).fetchall())\n\nprint(f"n_bahaya={n_bahaya} n_aman={n_aman}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "q_bahaya", label: "`q_bahaya` terdefinisi", msg: "Bangun query dengan f-string memakai variabel masukan." },
          { kind: "equal", task: "t1", name: "n_bahaya", value: 3, tol: 1e-09, label: "`n_bahaya` = 3", msg: "Injection ' OR '1'='1 membuat kondisi selalu benar — semua baris bocor." },
          { kind: "equal", task: "t2", name: "n_aman", value: 0, tol: 1e-09, label: "`n_aman` = 0", msg: "Parameterized: input jahat hanya string yang dicocokkan — 0 baris." },
          { kind: "stdout_matches", task: "t2", pattern: "n_bahaya=3 n_aman=0", label: "Perbandingan tercetak", msg: "Format: n_bahaya=3 n_aman=0." },
        ],
      },
      reference: "Jangan pernah f-string untuk query. Placeholder: ? / %s / :nama. Nama kolom dari input = allowlist.",
    },
    {
      id: "advanced-pooling",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: connection pooling & chunked reads — skala nyata",
      prose: [
        "Dua teknik skala yang memisahkan 'query jalan' dari 'pipeline bertahan'. Pertama, CONNECTION POOLING: membuka koneksi database itu mahal — handshake, autentikasi, alokasi sesi (puluhan ms per koneksi). Script yang membuka-tutup koneksi per query dalam loop 200× membayar pajak 200×. Pooling = kolam koneksi yang dipakai ulang: `engine = create_engine('postgresql://...', pool_size=5, max_overflow=10)` (SQLAlchemy) — koneksi dipinjam dan dikembalikan, bukan dibuat dan dibuang. Aturannya: SATU engine/pool per aplikasi (bukan per fungsi), dan untuk sqlite3 lokal cukup satu koneksi yang dipakai ulang + `with` untuk transaksi. Jebakannya: lupa menutup = kebocoran koneksi yang menghabiskan pool di production — gunakan context manager (`with engine.connect() as c:`) agar kembali otomatis.",
        "Kedua, CHUNKED READS: `pd.read_sql('SELECT * FROM transaksi_8gb', con)` di laptop 16 GB = OOM dan mati. Polanya: `pd.read_sql(query, con, chunksize=50_000)` — iterator per 50 ribu baris, memori DATAR berapa pun ukuran tabel; agregat diakumulasi per chunk (count/sum manual, atau tulis per chunk ke Parquet lalu agregat). Trade-off yang wajib dipahami: operasi GLOBAL tidak bisa per-chunk tanpa strategi — median eksak, dedup global, dan sort penuh butuh dua pass atau dikerjakan DI DATABASE (GROUP BY/ORDER BY) sebelum ditarik. Aturan keputusan: bisa diagregasi di DB → agregat di DB (kirim 1.000 baris hasil, bukan 8 GB mentah); harus di Python dan besar → chunked; butuh operasi global eksak → DB-side atau terima aproksimasi.",
        "Kombinasi keduanya di dunia nyata: API yang melayani 50 request/detik memakai pool (tanpa pool, latency +40ms per request hanya untuk handshake), dan ETL harian atas tabel 8 GB memakai chunked read 50 ribu — 11 menit, memori datar 300 MB, tidak pernah OOM. Skala bukan tentang mesin besar — melainkan tentang tidak melakukan hal mahal berulang-ulang dan tidak memuat yang tidak muat.",
      ],
      tasks: [],
      reference: "Satu pool per aplikasi; context manager agar koneksi kembali. Chunked read untuk >RAM; agregat di DB bila bisa; global-eksak butuh strategi.",
    },
    {
      id: "minicase-oom",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: laporan yang meledak saat data 10×",
      prose: [
        "Skenario (angka konkret): script laporan harian menarik SELURUH tabel transaksi (800 MB saat ditulis, jalan 4 menit) dengan `pd.read_sql('SELECT * FROM transaksi', con)`. Setahun kemudian tabel 8 GB — script OOM dan mati setiap pagi jam 6; analis me-restart manual, laporan telat 2 jam, direksi komplain 3×. 'Solusi' pertama: naikkan RAM server (Rp 12 juta/bulan). Solusi yang benar (2 jam kerja): (1) pindahkan agregasi ke database — `SELECT kota, COUNT(*), SUM(nominal) FROM transaksi WHERE tanggal = ... GROUP BY kota` — yang ditarik 40 baris, bukan 8 GB; (2) untuk kebutuhan baris-mentah, `chunksize=50_000` dengan memori datar 300 MB. Hasil: 11 menit, tidak pernah OOM, biaya server tetap.",
        "Pertanyaan analisis: (1) Mengapa script yang 'baik-baik saja' setahun lalu mati sekarang? (2) Kapan agregat di DB vs chunked di Python? (3) Apa yang seharusnya ditulis sejak hari pertama?",
        "Pembahasan: (1) `SELECT *` + muat-semua berskala O(n) terhadap ukuran tabel — ia bukan 'rusak', ia 'tidak dirancang untuk tumbuh'; data 10× mengekspos asumsi yang dulu tidak terlihat. (2) Butuh ringkasan (per kota, per hari) → GROUP BY di DB, tarik hasilnya yang kecil; butuh baris mentah untuk logika Python yang kompleks → chunked read; butuh keduanya → agregat di DB dulu, chunked untuk detail bila perlu. (3) Sejak hari pertama: tidak ada `SELECT *` di kode produksi (sebutkan kolomnya), parameterized untuk semua filter tanggal, dan satu baris komentar tentang ekspektasi ukuran ('tabel ini tumbuh ~700 MB/bulan — tinjau strategi baca saat >4 GB').",
        "Kaitan ke karier: 'tambah RAM' adalah jawaban termahal untuk masalah termurah — kedua kalinya dalam track ini kamu melihat polanya. Mengenali 'kode yang tidak dirancang untuk tumbuh' SEBELUM ia meledak adalah insting skala.",
      ],
      tasks: [],
      reference: "Agregat di DB (kirim 40 baris, bukan 8 GB). Chunked untuk baris mentah besar. Tanpa SELECT * di produksi; catat ekspektasi tumbuh.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: database adalah mitra komputasi, bukan gudang",
      prose: [
        "Heuristik penutup: pindahkan komputasi ke data — bukan data ke komputasi — kecuali ada alasan kuat.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: database adalah mitra komputasi, bukan gudang",
        body: "Heuristik pertama: filter dan agregat DI DATABASE — WHERE/GROUP BY di server mengirim 40 baris hasil, bukan 8 GB mentah; Python adalah tempat untuk logika yang tidak bisa di-SQL-kan, bukan untuk mengulang yang bisa. Heuristik kedua: parameterized SELALU — tidak ada f-string dalam query yang menyentuh input luar, tanpa pengecualian; 'tapi inputnya internal' adalah kalimat sebelum insiden. Heuristik ketiga: koneksi adalah sumber daya mahal — satu pool per aplikasi, context manager agar kembali; membuka-tutup per query dalam loop adalah pajak yang tidak terlihat sampai production. Heuristik keempat: jangan muat yang tidak muat — tabel lebih besar dari RAM dibaca chunked atau diagregat dulu; OOM jam 6 pagi adalah bug yang bisa diprediksi sejak kode ditulis. Heuristik kelima: API diperlakukan seperti database yang tidak kamu kuasai — paginasi dihormati, rate limit diantisipasi (backoff), respons divalidasi skemanya; API yang 'tiba-tiba' mengubah format adalah database yang skemanya berubah tanpa migrasi. Dan yang paling senior: setiap query produksi menjawab 'berapa biayanya bila data 10×' — bila jawabannya 'tambah server', tulis ulang querynya dulu.",
      },
      reference: "Komputasi ke data. Parameterized selalu. Pool + context manager. Chunked untuk >RAM. Query tahan 10×.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Nilai dari user ke dalam SQL sebaiknya...",
          options: [
            { text: "f-string", why: "Rentan SQL injection." },
            { text: "Placeholder `?` + parameter", why: "Aman dari injection.", correct: true },
            { text: "Concat string", why: "Sama berbahayanya dengan f-string." },
            { text: "Tidak perlu", why: "Perlu — keamanan." },
          ],
        },
        {
          q: "JOIN lalu GROUP BY adalah pola untuk...",
          options: [
            { text: "80% query analisis (gabung lalu ringkas)", why: "Pola inti laporan.", correct: true },
            { text: "Hapus data", why: "Itu DELETE." },
            { text: "Buat tabel", why: "Itu CREATE." },
            { text: "Jarang dipakai", why: "Justru paling sering." },
          ],
        },
        {
          q: "Respons API sebelum dipakai...",
          options: [
            { text: "Langsung pakai", why: "Format bisa berubah." },
            { text: "Validasi status & struktur", why: "Mencegah angka salah diam-diam.", correct: true },
            { text: "Diabaikan", why: "Datanya dibutuhkan." },
            { text: "Di-print saja", why: "Print bukan validasi." },
          ],
        },
        {
          q: "sqlite3 cocok untuk...",
          options: [
            { text: "Produksi multi-user besar", why: "Butuh PostgreSQL/MySQL." },
            { text: "Latihan & aplikasi kecil; sintaks SQL transferable", why: "Tepat guna.", correct: true },
            { text: "Menggantikan pandas", why: "Beda peran: ambil vs olah." },
            { text: "Tidak ada gunanya", why: "Berguna untuk latihan dan kecil." },
          ],
        },
      ],
      summary: [
        "SQL = ambil data; Python = olah. Keduanya dipakai bersama.",
        "Placeholder `?` — jangan f-string untuk nilai.",
        "JOIN + GROUP BY = pola 80% query analisis.",
        "pd.read_sql menjembatani SQL ke pandas.",
        "Validasi respons API sebelum dipakai.",
      ],
      next: { label: "E1 — Struktur Pasar", href: "/v2/learn/e1-struktur-pasar" },
    },
  ],
};
