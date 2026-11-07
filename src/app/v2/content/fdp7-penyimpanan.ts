import type { V2Lesson } from "../lib/types";

// Diagram: tiga lapis penyimpanan — file mentah, tabel kanonis, gudang analitik.
const STORE_SVG = `<svg viewBox="0 0 640 230" role="img" aria-label="Tiga lapis penyimpanan: file mentah, tabel kanonis, gudang analitik.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="10" y="60" width="180" height="80" rx="10" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="100" y="90" font-size="12" font-weight="700" fill="var(--text)">1. Mentah</text>
<text x="100" y="110" font-size="10" fill="var(--text-muted)">JSON EDGAR apa adanya</text>
<text x="100" y="125" font-size="10" fill="var(--text-muted)">+ sumber + waktu tarik</text>
<rect x="230" y="60" width="180" height="80" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="320" y="90" font-size="12" font-weight="700" fill="var(--text)">2. Kanonis</text>
<text x="320" y="110" font-size="10" fill="var(--text-muted)">SQLite / DuckDB</text>
<text x="320" y="125" font-size="10" fill="var(--text-muted)">satu baris = satu fakta</text>
<rect x="450" y="60" width="180" height="80" rx="10" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="540" y="90" font-size="12" font-weight="700" fill="var(--text)">3. Analitik</text>
<text x="540" y="110" font-size="10" fill="var(--text-muted)">Parquet per kuartal</text>
<text x="540" y="125" font-size="10" fill="var(--text-muted)">siap dibaca mesin rasio</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6">
<line x1="190" y1="100" x2="226" y2="100"/><line x1="410" y1="100" x2="446" y2="100"/>
<line x1="320" y1="140" x2="320" y2="162"/>
</g>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="180" y="165" width="280" height="50" rx="10" fill="none" stroke="var(--error)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="320" y="186" font-size="12" font-weight="700" fill="var(--text)">KUNCI DEDUP: emiten + periode + pos</text>
<text x="320" y="205" font-size="10" fill="var(--text-muted)">Jalankan dua kali, hasilnya tetap sama.</text>
</g>
</svg>`;

export const fdp7: V2Lesson = {
  slug: "fdp7-penyimpanan",
  track: "Financial Data Pipeline",
  module: "Penyimpanan",
  title: "FDP7 — Penyimpanan: Di Mana Tabel Kanonis Tinggal",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "CSV yang hilang di antara dua kuartal",
      prose: [
        "Riko menjalankan pipeline capstone untuk KLBF FY2024 dan mendapat dataset_kanonis.csv yang LULUS gerbang. Tiga bulan kemudian ia menambahkan BBCA H1 2026 — dan menimpa file yang sama. Angka KLBF hilang. Ia menjalankannya lagi dari awal: fetch ulang, parse ulang, clean ulang. Dua jam untuk kesalahan yang seharusnya tidak mungkin terjadi.",
        "Sinta menunjukkan masalah sebenarnya: pipeline Riko tidak punya rumah untuk datanya. CSV di satu file adalah meja kerja, bukan gudang. Meja kerja boleh berantakan dan boleh ditimpa; gudang harus bisa menampung banyak emiten dan banyak kuartal, menolak duplikat, dan menjawab pertanyaan tanpa membuka seluruh isi gudang.",
        "Twist-nya: memilih tempat simpan bukan soal 'mana yang paling canggih', melainkan soal 'pertanyaan apa yang akan kamu ajukan'. Satu emiten, satu kuartal, dibaca manusia: CSV cukup. Tiga emiten, delapan kuartal, ditanya 'berapa gross margin KLBF tiap tahun': butuh database. Seratus emiten, dibaca mesin tiap malam: butuh format kolom seperti Parquet. Lesson ini: memilih rumah yang tepat untuk tiap lapis data.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: CSV adalah database",
        type: "pitfall",
        body: "CSV tidak menolak duplikat, tidak punya tipe data, dan tidak bisa menjawab 'tampilkan laba KLBF 2024' tanpa membaca seluruh file. Ia format tukar-menukar yang bagus, bukan tempat tinggal jangka panjang.",
      },
      reference: "Meja kerja (CSV) vs gudang (database): pilih berdasarkan pertanyaan yang akan diajukan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menyimpan tabel kanonis dengan cara yang tahan terhadap emiten dan kuartal baru.",
        "(1) Membedakan tiga lapis penyimpanan: mentah, kanonis, analitik — dan memilih format untuk masing-masing;",
        "(2) Membandingkan CSV vs Parquet vs SQLite vs DuckDB dari sisi baca-tulis, kompresi, dan kueri;",
        "(3) Merancang kunci dedup emiten + periode + pos agar pipeline idempotent;",
        "(4) Menyimpan dan menanyakan kembali angka benchmark KLBF, BBRI, dan BBCA dari database.",
      ],
      tasks: [],
    },
    {
      id: "tiga-lapis",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga lapis, tiga rumah",
      prose: [
        "Lapis 1 — mentah. Simpan respons JSON EDGAR apa adanya, lengkap dengan kapan diambil dan dari URL mana. Alasannya: bila parser berubah atau aturan filed berubah, kamu bisa memutar ulang dari mentah tanpa fetch ulang ke SEC. Formatnya file biasa (JSON), satu file per emiten per tanggal tarik. Aturannya: mentah tidak pernah diedit — ia arsip, bukan bahan kerja.",
        "Lapis 2 — kanonis. Tabel satu baris per fakta (emiten, periode, pos, nilai, satuan, sumber, filed) tinggal di database ringan: SQLite atau DuckDB. Kenapa database: ia menjawab pertanyaan ('laba BBRI FY2024?') tanpa memindai seluruh file, menolak duplikat lewat primary key, dan menampung multi-emiten multi-kuartal dalam satu file. SQLite sudah ada di Python standar; DuckDB satu langkah lebih jauh — kueri analitik cepat atas file Parquet dan CSV tanpa server.",
        "Lapis 3 — analitik. Untuk konsumsi mesin rasio dan model, ekspor snapshot per kuartal ke Parquet: format kolom yang terkompresi, bertipe, dan dibaca 10 sampai 100 kali lebih cepat daripada CSV untuk kueri agregat. Parquet bukan tempat edit — ia artefak baca-cepat yang dibuat ulang dari lapis kanonis bila dibutuhkan.",
        "Cara membaca: tiga kotak berurutan, panah dari mentah ke kanonis ke analitik, dengan kotak kunci dedup di bawah. Interpretasi: data mengalir satu arah — mentah diabadikan, kanonis dirawat, analitik dihasilkan. Tidak ada lapis yang menimpa lapis lain.",
      ],
      figure: {
        svg: STORE_SVG,
        alt: "Tiga lapis penyimpanan: mentah (JSON EDGAR), kanonis (SQLite/DuckDB), analitik (Parquet per kuartal), dengan kunci dedup emiten + periode + pos.",
        caption: "Mentah diabadikan, kanonis dirawat, analitik dihasilkan.",
      },
      tasks: [],
      reference: "Mentah = arsip JSON. Kanonis = database. Analitik = Parquet.",
    },
    {
      id: "banding-format",
      eyebrow: "Langkah 4 · Konsep",
      title: "CSV vs Parquet vs SQLite vs DuckDB",
      prose: [
        "CSV: keunggulan — bisa dibaca manusia dan semua alat; kelemahan — tanpa tipe, tanpa skema, tanpa dedup, baca penuh setiap kali. Cocok untuk: tukar-menukar, sampel kecil, dan deliverable capstone FDP6. Tidak cocok untuk: gudang multi-kuartal.",
        "Parquet: keunggulan — format kolom terkompresi, bertipe, baca kolom yang dibutuhkan saja; kelemahan — tidak bisa dibaca mata telanjang, tidak cocok untuk edit baris-demi-baris. Cocok untuk: snapshot analitik dan dataset besar. Aturan praktis: bila file CSV-mu melewati ratusan ribu baris, Parquet mulai terasa manfaatnya.",
        "SQLite: keunggulan — satu file, tanpa server, sudah di Python standar, transaksi dan primary key menjaga integritas; kelemahan — satu penulis dalam satu waktu, analitik berat lebih lambat dari DuckDB. Cocok untuk: tabel kanonis pipeline pribadi sampai tim kecil.",
        "DuckDB: keunggulan — kueri analitik cepat langsung di atas Parquet dan CSV, sintaks SQL yang sama, tanpa server; kelemahan — ekosistem lebih muda dari SQLite, bukan tempat untuk transaksi tulis-banyak. Cocok untuk: gudang analitik lokal dan eksplorasi cepat. Pilihan track ini: SQLite untuk kanonis (nol dependensi), Parquet untuk snapshot analitik — DuckDB dicatat sebagai langkah naik berikutnya, bukan kewajiban.",
        "Satu peringatan satuan: database tidak menyelesaikan jebakan satuan FDP4 dengan sendirinya. Kolom satuan wajib ikut tersimpan, dan nilai wajib dalam satuan penuh (Rp, bukan Rp-juta) atau dengan faktor konversi yang eksplisit. Database yang menyimpan '32627776' tanpa satuan sama berbahayanya dengan CSV yang sama.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyimpan nilai tanpa kolom satuan karena 'sudah tahu satuannya'. Tiga bulan kemudian 'tahu' itu hilang — dan 32.627.776 dibaca sebagai Rp32 juta, bukan Rp32 triliun. Simpan satuan di samping nilai, selalu.",
      },
      reference: "CSV untuk tukar, Parquet untuk baca-cepat, SQLite untuk kanonis, DuckDB untuk analitik lokal.",
    },
    {
      id: "lab-simpan",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: simpan benchmark ke SQLite, tanyakan kembali",
      prose: [
        "Kamu menyimpan 8 angka benchmark ke tabel kanonis SQLite (in-memory): KLBF FY2024 penjualan neto 32.627.776.108.026, laba bruto 12.957.040.191.898, laba bersih atribusional 3.240.636.626.331, total ekuitas 24.590.433.810.486; BBRI FY2024 NII 142.057.190 (Rp-juta) dan laba bersih 60.154.887 (Rp-juta); BBCA H1 2026 NII 42.604.563 (Rp-juta) dan laba bersih 29.534.446 (Rp-juta).",
        "Tugasmu: tulis fungsi simpan dan tanya. simpan membuat tabel dengan primary key (emiten, periode, pos), memasukkan 8 baris, lalu mencoba memasukkan ulang baris yang sama dengan INSERT OR IGNORE. tanya menghitung gross margin KLBF dari angka tersimpan (laba bruto dibagi penjualan, kali 100) dan net margin KLBF (laba bersih dibagi penjualan, kali 100).",
        "Eksperimen setelah selesai: jalankan simpan dua kali berturut-turut. Jumlah baris harus tetap 8 — itulah idempotent: pipeline boleh dijalankan ulang tanpa menggandakan data. Lalu ubah satu nilai dan jalankan lagi: apa yang terjadi bila primary key sama tetapi nilainya beda? (Jawaban: INSERT OR IGNORE menolak baris baru — untuk memperbarui angka, butuh aturan filed-menang dari FDP4, bukan insert buta.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis `simpan`: buat tabel kanonis + masukkan 8 baris + coba insert ulang (OR IGNORE)" },
        { id: "t2", text: "Tulis `tanya`: hitung gross margin dan net margin KLBF dari tabel" },
        { id: "t3", text: "Cetak baris, kedua margin, jumlah baris CSV, dan status dedup" },
      ],
      expected: "baris=8 | gross_margin=39.71 | net_margin=9.93 | csv_baris=9 | dedup_ok=True",
      note: {
        title: "Kunci dedup",
        body: "Primary key (emiten, periode, pos) adalah kunci dedup yang sama dengan capstone FDP6. INSERT OR IGNORE membuat simpan ulang menjadi operasi yang aman — tetapi ia juga menelan pembaruan diam-diam. Aturan update tetap milik FDP4: filed terbaru menang, secara eksplisit.",
      },
      hints: [
        "Margin dari tabel, bukan dari angka literal: SELECT nilai WHERE pos = 'laba_bruto' AND emiten = 'KLBF'.",
        "CSV: tulis 8 baris + header dengan modul csv ke io.StringIO, lalu hitung barisnya — harus 9.",
        "Dedup: bandingkan jumlah baris sebelum dan sesudah insert ulang — sama berarti True.",
      ],
      code: {
        starter: `import sqlite3, csv, io\n\nBARIS = [\n    ("KLBF", "FY2024", "penjualan_neto", 32627776108026, "Rp"),\n    ("KLBF", "FY2024", "laba_bruto", 12957040191898, "Rp"),\n    ("KLBF", "FY2024", "laba_bersih_atribusional", 3240636626331, "Rp"),\n    ("KLBF", "FY2024", "total_ekuitas", 24590433810486, "Rp"),\n    ("BBRI", "FY2024", "nii", 142057190, "Rp-juta"),\n    ("BBRI", "FY2024", "laba_bersih_atribusional", 60154887, "Rp-juta"),\n    ("BBCA", "H1-2026", "nii", 42604563, "Rp-juta"),\n    ("BBCA", "H1-2026", "laba_bersih_atribusional", 29534446, "Rp-juta"),\n]\n\n# TULIS KODEMU\ndef simpan(baris):\n    \n\n# TULIS KODEMU\ndef tanya(con):\n    \n\ncon, n_awal, n_akhir = simpan(BARIS)\ngm, nm = tanya(con)\nbuf = io.StringIO()\nw = csv.writer(buf)\nw.writerow(["emiten", "periode", "pos", "nilai", "satuan"])\nw.writerows(BARIS)\ncsv_baris = len(buf.getvalue().strip().splitlines())\nprint(f"baris={n_akhir} | gross_margin={gm:.2f} | net_margin={nm:.2f} | csv_baris={csv_baris} | dedup_ok={n_awal == n_akhir}")`,
        lockLines: 11,
        solution: `import sqlite3, csv, io\n\nBARIS = [\n    ("KLBF", "FY2024", "penjualan_neto", 32627776108026, "Rp"),\n    ("KLBF", "FY2024", "laba_bruto", 12957040191898, "Rp"),\n    ("KLBF", "FY2024", "laba_bersih_atribusional", 3240636626331, "Rp"),\n    ("KLBF", "FY2024", "total_ekuitas", 24590433810486, "Rp"),\n    ("BBRI", "FY2024", "nii", 142057190, "Rp-juta"),\n    ("BBRI", "FY2024", "laba_bersih_atribusional", 60154887, "Rp-juta"),\n    ("BBCA", "H1-2026", "nii", 42604563, "Rp-juta"),\n    ("BBCA", "H1-2026", "laba_bersih_atribusional", 29534446, "Rp-juta"),\n]\n\ndef simpan(baris):\n    con = sqlite3.connect(":memory:")\n    cur = con.cursor()\n    cur.execute("CREATE TABLE kanonis (emiten TEXT, periode TEXT, pos TEXT, nilai INTEGER, satuan TEXT, PRIMARY KEY (emiten, periode, pos))")\n    cur.executemany("INSERT INTO kanonis VALUES (?,?,?,?,?)", baris)\n    n_awal = cur.execute("SELECT COUNT(*) FROM kanonis").fetchone()[0]\n    cur.executemany("INSERT OR IGNORE INTO kanonis VALUES (?,?,?,?,?)", baris)\n    n_akhir = cur.execute("SELECT COUNT(*) FROM kanonis").fetchone()[0]\n    con.commit()\n    return con, n_awal, n_akhir\n\ndef tanya(con):\n    cur = con.cursor()\n    rev = cur.execute("SELECT nilai FROM kanonis WHERE emiten='KLBF' AND pos='penjualan_neto'").fetchone()[0]\n    bruto = cur.execute("SELECT nilai FROM kanonis WHERE emiten='KLBF' AND pos='laba_bruto'").fetchone()[0]\n    ni = cur.execute("SELECT nilai FROM kanonis WHERE emiten='KLBF' AND pos='laba_bersih_atribusional'").fetchone()[0]\n    return bruto / rev * 100, ni / rev * 100\n\ncon, n_awal, n_akhir = simpan(BARIS)\ngm, nm = tanya(con)\nbuf = io.StringIO()\nw = csv.writer(buf)\nw.writerow(["emiten", "periode", "pos", "nilai", "satuan"])\nw.writerows(BARIS)\ncsv_baris = len(buf.getvalue().strip().splitlines())\nprint(f"baris={n_awal} | gross_margin={gm:.2f} | net_margin={nm:.2f} | csv_baris={csv_baris} | dedup_ok={n_awal == n_akhir}")`,
        checks: [
          { kind: "equal", task: "t2", name: "gm", value: 39.71, tol: 0.01, label: "`gm` sekitar 39,71", msg: "Laba bruto 12.957.040.191.898 dibagi penjualan 32.627.776.108.026, kali 100." },
          { kind: "equal", task: "t2", name: "nm", value: 9.93, tol: 0.01, label: "`nm` sekitar 9,93", msg: "Laba bersih 3.240.636.626.331 dibagi penjualan 32.627.776.108.026, kali 100." },
          { kind: "stdout_matches", task: "t3", pattern: "baris=8", label: "8 baris tersimpan", msg: "Tabel kanonis harus memuat tepat 8 baris benchmark." },
          { kind: "stdout_matches", task: "t3", pattern: "csv_baris=9", label: "CSV 9 baris (header + 8)", msg: "Ekspor CSV: 1 header + 8 baris data." },
          { kind: "stdout_matches", task: "t3", pattern: "dedup_ok=True", label: "Insert ulang tidak menggandakan", msg: "Primary key + INSERT OR IGNORE: jumlah baris tetap 8." },
        ],
      },
      reference: "Primary key (emiten, periode, pos) + INSERT OR IGNORE = simpan ulang yang aman.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Memilih rumah untuk datamu",
      prose: [
        "Skenario 1 — satu emiten, satu kuartal, untuk dibaca manusia. Keputusan: CSV. Alasan: tidak ada yang perlu ditanya berulang, dan keterbacaan manusia adalah fiturnya.",
        "Skenario 2 — tiga emiten, delapan kuartal, ditanya berulang. Keputusan: SQLite. Alasan: kueri tanpa pindai penuh, dedup lewat primary key, satu file yang bisa dicadangkan.",
        "Skenario 3 — seratus emiten, snapshot tiap malam untuk mesin rasio. Keputusan: Parquet per kuartal + DuckDB untuk kueri. Alasan: baca kolom yang dibutuhkan saja, terkompresi, cepat untuk agregat.",
        "Skenario 4 — tim lima orang menulis bersamaan ke gudang yang sama. Keputusan: bukan ketiganya — naik ke database server (mis. Postgres) dengan kontrol akses. Aturan praktis: bila ada lebih dari satu penulis bersamaan, SQLite sudah bukan jawabannya.",
        "Aturan 10 detik: tanya dirimu 'berapa emiten, berapa kuartal, siapa yang bertanya'. Jawabannya menunjuk rumahnya.",
      ],
      tasks: [],
      reference: "Satu emiten = CSV. Multi-kuartal = SQLite. Skala mesin = Parquet. Multi-penulis = server.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: kuartal baru menimpa kuartal lama",
      prose: [
        "Tim Riko menyimpan dataset_kanonis.csv per emiten — satu file per emiten, ditimpa tiap kuartal. Kuartal ini mereka menambahkan BBCA Q3 2026 ke file BBCA: NII Q3 21.900.000 (Rp-juta, ilustratif). Esoknya seseorang bertanya: 'berapa NII BBCA H1 2026?' — jawabannya sudah tidak ada. File itu hanya berisi Q3.",
        "Pertanyaan: di mana kesalahan arsitekturnya, dan apa perbaikan minimalnya?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Kesalahan: satu file per emiten tanpa dimensi periode — periode tidak menjadi bagian dari identitas baris, sehingga data baru menimpa data lama. Perbaikan minimal: simpan periode sebagai kolom (atau sebagai bagian nama file: bbca_H1-2026.csv), lalu pindahkan ke SQLite dengan primary key (emiten, periode, pos). NII H1 42.604.563 dan NII Q3 21.900.000 (ilustratif) adalah dua baris berbeda, bukan dua versi dari baris yang sama.",
      },
      reference: "Periode adalah identitas, bukan catatan kaki. Tanpa kolom periode, data baru = data lama yang hilang.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Tiga lapis: mentah (JSON arsip) → kanonis (SQLite/DuckDB) → analitik (Parquet).",
        "CSV untuk tukar-menukar; Parquet untuk baca-cepat; SQLite untuk kanonis; DuckDB untuk analitik lokal.",
        "Kunci dedup: emiten + periode + pos — pipeline idempotent, simpan ulang tidak menggandakan.",
        "Satuan wajib tersimpan di samping nilai — database tidak memperbaiki jebakan satuan dengan sendirinya.",
        "Gross margin KLBF FY2024 dari tabel tersimpan: 39,71; net margin: 9,93 (cocok dengan benchmark).",
      ],
      next: { label: "FDP8 — Otomasi & Penjadwalan: Pipeline yang Jalan Sendiri", href: "/v2/learn/fdp8-otomasi-penjadwalan" },
      quiz: [
        {
          q: "Pipeline-mu menyimpan tabel kanonis sebagai satu CSV yang ditimpa tiap kuartal. Masalah terbesarnya?",
          options: [
            { text: "CSV tidak bisa dibuka di spreadsheet", why: "Salah: CSV justru paling mudah dibuka di mana-mana — itu bukan masalahnya." },
            { text: "Data kuartal lama hilang karena tertimpa, dan tidak ada dedup atau kueri", why: "Tepat: tanpa dimensi periode dan kunci, data baru menghapus data lama dan tidak bisa ditanya per kuartal.", correct: true },
            { text: "CSV terlalu lambat untuk 8 baris", why: "Salah: 8 baris dibaca instan di format apa pun. Masalahnya struktur, bukan kecepatan." },
            { text: "CSV tidak mendukung angka desimal", why: "Salah: CSV menyimpan teks apa pun, termasuk desimal. Masalahnya bukan itu." },
          ],
        },
        {
          q: "Kapan Parquet menjadi pilihan yang tepat dibanding CSV?",
          options: [
            { text: "Saat datanya harus dibaca manusia langsung", why: "Salah: Parquet biner — manusia tidak bisa membacanya tanpa alat." },
            { text: "Saat snapshot besar dibaca mesin berulang untuk agregat — baca kolom yang dibutuhkan saja", why: "Tepat: format kolom terkompresi unggul untuk kueri agregat atas data besar.", correct: true },
            { text: "Saat hanya ada satu emiten dan satu kuartal", why: "Salah: untuk data sekecil itu CSV lebih sederhana dan cukup." },
            { text: "Saat banyak orang menulis bersamaan", why: "Salah: Parquet adalah format baca; tulis-bersamaan butuh database server." },
          ],
        },
        {
          q: "Apa fungsi primary key (emiten, periode, pos) di tabel kanonis?",
          options: [
            { text: "Mempercepat tampilan spreadsheet", why: "Salah: spreadsheet tidak memakai primary key." },
            { text: "Menjamin satu fakta hanya tersimpan sekali — simpan ulang tidak menggandakan data", why: "Tepat: kunci dedup membuat pipeline idempotent.", correct: true },
            { text: "Mengubah satuan otomatis ke Rp penuh", why: "Salah: konversi satuan tetap tugas cleaning (FDP4); key hanya menjaga keunikan." },
            { text: "Menghapus data lama saat restatement", why: "Salah: restatement ditangani aturan filed-menang (FDP4), bukan oleh key." },
          ],
        },
        {
          q: "Dari tabel tersimpan, gross margin KLBF FY2024 dihitung dari angka apa?",
          options: [
            { text: "Laba bersih dibagi total ekuitas", why: "Salah: itu mendekati definisi ROE, bukan gross margin." },
            { text: "Laba bruto 12.957.040.191.898 dibagi penjualan 32.627.776.108.026 = 39,71 persen", why: "Tepat: angka benchmark tersimpan, dihitung ulang dari tabel — cocok dengan benchmark 39,71.", correct: true },
            { text: "NII dibagi total aset", why: "Salah: itu rumus bank, bukan margin manufaktur KLBF." },
            { text: "Penjualan dibagi laba bruto", why: "Salah: kebalik — hasilnya 251,79 persen, bukan margin." },
          ],
        },
        {
          q: "Tim lima orang akan menulis ke gudang yang sama secara bersamaan. Keputusan yang benar?",
          options: [
            { text: "Tetap SQLite — satu file mudah dibagikan", why: "Salah: SQLite satu penulis dalam satu waktu; tulis bersamaan akan antre atau gagal." },
            { text: "Naik ke database server (mis. Postgres) dengan kontrol akses", why: "Tepat: multi-penulis bersamaan adalah ambang naik kelas dari file-database ke server.", correct: true },
            { text: "Satu CSV per orang, digabung manual tiap minggu", why: "Salah: itu gudang yang dirawat dengan copy-paste — sumber segala duplikat." },
            { text: "Parquet per orang, tanpa database", why: "Salah: Parquet format baca; ia tidak menyelesaikan tulis bersamaan." },
          ],
        },
      ],
    },
  ],
};
