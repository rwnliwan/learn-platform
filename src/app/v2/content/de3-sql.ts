import type { V2Lesson } from "../lib/types";

// Lapisan transformasi: staging -> clean -> mart.
const LAYER_SVG = `<svg viewBox="0 0 600 210" role="img" aria-label="Tiga lapisan: staging untuk data mentah, clean untuk data bersih, mart untuk data siap analisis.">
<defs><marker id="de3a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="14" y="50" width="160" height="110" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="94" y="76" font-size="13" font-weight="600" fill="var(--text)">staging</text>
<text x="94" y="96" font-size="11" fill="var(--text-muted)">salinan setia</text>
<text x="94" y="112" font-size="11" fill="var(--text-muted)">sumber, apa adanya</text>
<text x="94" y="132" font-size="11" fill="var(--text-muted)">boleh kotor,</text>
<text x="94" y="148" font-size="11" fill="var(--text-muted)">tak boleh diubah</text>
<rect x="220" y="50" width="160" height="110" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="300" y="76" font-size="13" font-weight="600" fill="var(--text)">clean</text>
<text x="300" y="96" font-size="11" fill="var(--text-muted)">dedup, validasi,</text>
<text x="300" y="112" font-size="11" fill="var(--text-muted)">standarisasi</text>
<text x="300" y="132" font-size="11" fill="var(--text-muted)">satu kebenaran</text>
<text x="300" y="148" font-size="11" fill="var(--text-muted)">per tabel</text>
<rect x="426" y="50" width="160" height="110" rx="10" fill="var(--c3)" opacity="0.22" stroke="var(--c3)" stroke-width="2"/>
<text x="506" y="76" font-size="13" font-weight="600" fill="var(--text)">mart</text>
<text x="506" y="96" font-size="11" fill="var(--text-muted)">agregasi siap</text>
<text x="506" y="112" font-size="11" fill="var(--text-muted)">pakai per tim</text>
<text x="506" y="132" font-size="11" fill="var(--text-muted)">dimodel sesuai</text>
<text x="506" y="148" font-size="11" fill="var(--text-muted)">kebutuhan</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#de3a)">
<line x1="174" y1="105" x2="216" y2="105"/><line x1="380" y1="105" x2="422" y2="105"/>
</g>
<text x="300" y="190" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">aturan: analis hanya boleh baca mart &amp; clean — jangan pernah staging mentah</text>
</svg>`;

// SCD Tipe 2: timeline histori tier pelanggan.
const SCD_SVG = `<svg viewBox="0 0 600 170" role="img" aria-label="SCD tipe 2: setiap perubahan tier menambah baris baru dengan rentang tanggal berlaku.">
<g font-family="var(--font-ui)">
<line x1="40" y1="60" x2="560" y2="60" stroke="var(--chart-grid)" stroke-width="2"/>
<line x1="40" y1="120" x2="560" y2="120" stroke="var(--chart-grid)" stroke-width="2"/>
<rect x="60" y="42" width="200" height="36" rx="6" fill="var(--c1)" opacity="0.35" stroke="var(--c1)"/>
<text x="160" y="65" font-size="12" fill="var(--text)" text-anchor="middle">silver · Jan–Jun 2026</text>
<rect x="280" y="42" width="260" height="36" rx="6" fill="var(--c2)" opacity="0.35" stroke="var(--c2)"/>
<text x="410" y="65" font-size="12" fill="var(--text)" text-anchor="middle">gold · Jul 2026 – sekarang</text>
<rect x="60" y="102" width="480" height="36" rx="6" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-dasharray="5 3"/>
<text x="300" y="125" font-size="12" fill="var(--text)" text-anchor="middle">SCD tipe 1: hanya "gold" — histori hilang</text>
<text x="40" y="30" font-size="11" fill="var(--text-muted)">Andi (id=1) · SCD tipe 2</text>
<text x="40" y="162" font-size="11" fill="var(--text-muted)">tipe 2 = tambah baris tiap perubahan (valid_from → valid_to) · tipe 1 = timpa (cepat, tapi amnesia)</text>
</g></svg>`;

export const de3: V2Lesson = {
  slug: "de3-sql",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE3 — SQL Lanjutan untuk DE",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query 200 baris yang benar... kadang-kadang",
      prose: [
        "Rian menulis query 200 baris untuk laporan bonus salesman. Senin hasilnya Rp1,2 miliar. Selasa — tanpa ada yang diubah — hasilnya Rp1,19 miliar. Rabu kembali Rp1,2 miliar. Tidak ada error, tidak ada yang deploy ulang. Query-nya seperti punya mood.",
        "Setelah dua hari debugging, ketemu biang keroknya: satu baris di tengah query, LIMIT 1000 tanpa ORDER BY. Database bebas mengembalikan 1000 baris mana saja — dan pilihannya bisa berbeda tiap run. Laporan bonus dihitung dari sampel acak yang berbeda setiap hari.",
        "Twist-nya: query itu lolos semua review karena 'hasilnya masuk akal'. Bug non-deterministik adalah hantu pipeline: tidak pernah error, hanya kadang salah — dan 'kadang' adalah kata paling mahal dalam data engineering.",
        "Lesson ini tentang SQL yang ditulis bukan untuk menjawab sekali, melainkan untuk menjawab sama setiap kali dijalankan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: LIMIT tanpa ORDER BY itu tidak apa-apa",
        type: "pitfall",
        body: "Tanpa ORDER BY, database tidak menjanjikan urutan apa pun — hasil boleh beda tiap eksekusi. Dalam pipeline yang di-rerun, ini berarti angka berubah tanpa sebab. Aturan keras: setiap LIMIT wajib ditemani ORDER BY yang deterministik (tambahkan id sebagai tiebreaker).",
      },
      reference: "SQL pipeline harus deterministik: sama input → sama output, setiap run.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis SQL lanjutan yang aman untuk pipeline produksi.",
        "(1) Menerapkan pola staging → clean → mart dan menjelaskan kenapa analis tidak boleh query tabel mentah;",
        "(2) Memakai window function untuk agregat tanpa menghancurkan baris; (3) Mengimplementasikan SCD tipe 2 dengan SQL asli (sqlite);",
        "(4) Memutuskan 'SQL atau Python?' berdasar sifat transformasinya.",
      ],
      tasks: [],
    },

    {
      id: "lapisan",
      eyebrow: "Langkah 3 · Pola",
      title: "Staging → clean → mart: tiga lapisan suci",
      prose: [
        "Pipeline yang sehat tidak menumpuk semua logika dalam satu query raksasa. Ia dibagi tiga lapisan. Staging adalah 'lemari bukti': salinan setia dari sumber, apa adanya, tidak boleh diubah — kalau ada sengketa data, inilah barang buktinya.",
        "Clean adalah 'dapur steril': di sinilah dedup, validasi, dan standarisasi terjadi. Satu tabel = satu kebenaran. Mart adalah 'etalase': agregasi siap pakai, dimodel sesuai kebutuhan tiap tim (mart finance beda dengan mart marketing).",
        "💡 Intuisi: lapisan = pembagian tanggung jawab debugging. Angka mart salah? Cek clean. Clean salah? Cek staging. Staging salah? Salahkan sumber (dengan bukti). Tanpa lapisan, kamu debugging 200 baris sekaligus.",
        "💡 Intuisi: tulis transformasi sebagai CREATE OR REPLACE / MERGE, bukan INSERT append mentah. Pipeline di-rerun (dan ia akan di-rerun) — query append menumpuk duplikat, query idempoten menghasilkan tabel yang sama.",
        "Cara membaca: tiga lapisan bertumpuk — staging (bawah, mentah), clean (tengah, bersih), mart (atas, siap analisis). Panah hanya naik: analis membaca dari mart, tidak pernah dari staging.",
        "Interpretasi: lapisan = kontrak kepercayaan. Staging boleh kotor (itu gunanya: bukti mentah); mart harus bersih (itu janjinya: siap query). Analis yang query staging = memakan bahan mentah.",
      ],
      figure: {
        svg: LAYER_SVG,
        alt: "Tiga lapisan transformasi: staging, clean, mart.",
        caption: "Staging = bukti, clean = kebenaran, mart = etalase. Analis baca mart & clean saja.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: analis boleh query tabel mentah 'biar cepat'",
        type: "pitfall",
        body: "Sekali analis membangun dashboard di atas staging, definisi 'revenue' versi mereka hidup selamanya — dan berbeda dengan versi tim lain. Inilah resep insiden Nadia di DE1. Pintu staging dikunci untuk analis bukan karena pelit, melainkan karena definisi harus tunggal.",
      },
      reference: "3 lapisan: staging (bukti) → clean (kebenaran) → mart (etalase). Transform idempoten.",
    },
    {
      id: "window-scd",
      eyebrow: "Langkah 4 · Teknik",
      title: "Window function & SCD: dua senjata wajib",
      prose: [
        "Window function adalah agregasi tanpa GROUP BY: baris tetap utuh, tapi tiap baris mendapat 'pengetahuan' tentang kelompoknya. ROW_NUMBER() memberi peringkat dalam partisi; SUM() OVER memberi total berjalan. Kepribadiannya: 'mata-mata yang melihat sekeliling tanpa mengubah barisan.'",
        "Slowly Changing Dimension (SCD) menjawab: 'bagaimana mencatat perubahan?' Tipe 1 menimpa (cepat, tapi amnesia — histori hilang). Tipe 2 menambah baris baru dengan rentang valid_from → valid_to (histori utuh, query sedikit lebih rumit). Pilih tipe 2 untuk atribut yang memengaruhi uang atau analisis historis (tier pelanggan, harga).",
        "Kasus klasik window function: dedup. Data mentah sering berisi kirim-ulang (retry) — baris kembar persis. Polanya: ROW_NUMBER() OVER (PARTITION BY kolom_kunci ORDER BY id), lalu saring rn = 1. Tingkat duplikasi bisa diukur:",
        "Cara membaca: baris-baris untuk satu pelanggan yang sama, tiap baris punya rentang 'berlaku dari–sampai'. Perubahan tier menambah BARIS baru — baris lama tidak dihapus, hanya ditutup rentangnya.",
        "Interpretasi: inilah 'ingatan penuh' tipe 2. Query 'revenue Jakarta bulan Februari' memakai baris yang berlaku Februari — bukan kota kini. Tipe 1 (timpa) menghapus ingatan ini selamanya.",
      ],
      formula: String.raw`d = \frac{N_{mentah} - N_{unik}}{N_{mentah}}`,
      formulaNote: "d = tingkat duplikasi (0–1); N_mentah = jumlah baris sebelum dedup; N_unik = jumlah baris sesudah dedup. d = 0,286 berarti 28,6% baris adalah kirim-ulang.",
      figure: {
        svg: SCD_SVG,
        alt: "SCD tipe 2 menyimpan histori tier Andi sebagai dua baris dengan rentang tanggal; tipe 1 hanya menyimpan nilai terakhir.",
        caption: "Tipe 2 = ingatan penuh (tambah baris). Tipe 1 = amnesia (timpa).",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: SCD tipe 2 = 'tambah kolom updated_at'",
        type: "pitfall",
        body: "Kolom updated_at hanya tahu kapan terakhir berubah, bukan apa nilainya dulu. SCD tipe 2 butuh baris baru + valid_from/valid_to agar pertanyaan 'berapa tier Andi bulan Maret?' bisa dijawab. Tanpa itu, analisis historis mustahil.",
      },
      reference: "Dedup = ROW_NUMBER() PARTITION BY kunci, saring rn=1. SCD2 = baris baru per perubahan.",
    },
    {
      id: "lab-scd",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: SCD tipe 2 dengan SQL asli (sqlite)",
      prose: [
        "Lab ini menjalankan SQL betulan di browser via sqlite — tidak ada simulasi. Tabel dim_pelanggan berisi histori tier gaya SCD tipe 2: baris aktif ditandai valid_to = '9999-12-31'.",
        "Cara membaca: query snapshot ('kondisi saat ini') menyaring valid_to = '9999-12-31'; query histori mengelompokkan per id. Coba ubah tanggal snapshot menjadi '2026-05-01' (WHERE valid_from <= ... AND valid_to > ...) dan lihat tier Andi berubah menjadi silver — itulah kekuatan SCD tipe 2.",
        "Interpretasi: di warehouse produksi (BigQuery, Snowflake, Postgres) sintaksnya sama; yang berbeda hanya skala dan cara partisi.",
      ],
      requires: ["sqlite3"],
      tasks: [
        { id: "t1", text: "Tulis query `q_now`: hitung pelanggan aktif (valid_to = '9999-12-31')" },
        { id: "t2", text: "Tulis query `q_hist`: id pelanggan yang pernah ganti tier (COUNT(*) > 1)" },
        { id: "t3", text: "Eksekusi keduanya dan cetak hasilnya" },
      ],
      expected: "current=3 | pernah_berubah=[(1, 2), (3, 2)]",
      note: {
        title: "Sering salah",
        body: "Menulis WHERE valid_to = NULL. NULL tidak bisa dibandingkan dengan '=' — hasilnya selalu UNKNOWN (baris hilang diam-diam). Konvensi SCD tipe 2 memakai tanggal sentinel '9999-12-31' justru untuk menghindari jebakan NULL ini.",
      },
      hints: [
        "q_now: SELECT COUNT(*) FROM dim_pelanggan WHERE valid_to = '9999-12-31'.",
        "q_hist: GROUP BY id ... HAVING COUNT(*) > 1.",
        "Eksekusi: cur.execute(q).fetchone() / fetchall().",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE dim_pelanggan (id INTEGER, nama TEXT, tier TEXT, valid_from TEXT, valid_to TEXT)")\ncur.executemany("INSERT INTO dim_pelanggan VALUES (?,?,?,?,?)", [\n    (1, "Andi", "silver", "2026-01-01", "2026-06-30"),\n    (1, "Andi", "gold",   "2026-07-01", "9999-12-31"),\n    (2, "Budi", "silver", "2026-01-01", "9999-12-31"),\n    (3, "Cici", "bronze", "2026-03-01", "2026-08-31"),\n    (3, "Cici", "silver", "2026-09-01", "9999-12-31"),\n])\n\n# TULIS KODEMU: query snapshot saat ini\nq_now = \n# TULIS KODEMU: query id yang pernah ganti tier\nq_hist = \n\ncur.execute(q_now)\nprint("current=", cur.fetchone()[0])\ncur.execute(q_hist)\nprint("pernah_berubah=", cur.fetchall())`,
        lockLines: 10,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE dim_pelanggan (id INTEGER, nama TEXT, tier TEXT, valid_from TEXT, valid_to TEXT)")\ncur.executemany("INSERT INTO dim_pelanggan VALUES (?,?,?,?,?)", [\n    (1, "Andi", "silver", "2026-01-01", "2026-06-30"),\n    (1, "Andi", "gold",   "2026-07-01", "9999-12-31"),\n    (2, "Budi", "silver", "2026-01-01", "9999-12-31"),\n    (3, "Cici", "bronze", "2026-03-01", "2026-08-31"),\n    (3, "Cici", "silver", "2026-09-01", "9999-12-31"),\n])\n\n# TULIS KODEMU: query snapshot saat ini\nq_now = "SELECT COUNT(*) FROM dim_pelanggan WHERE valid_to = '9999-12-31'"\n# TULIS KODEMU: query id yang pernah ganti tier\nq_hist = "SELECT id, COUNT(*) FROM dim_pelanggan GROUP BY id HAVING COUNT(*) > 1"\n\ncur.execute(q_now)\nprint("current=", cur.fetchone()[0])\ncur.execute(q_hist)\nprint("pernah_berubah=", cur.fetchall())`,
        checks: [
          { kind: "uses", task: "t1", token: "execute", label: "query dieksekusi via `execute`", msg: "Gunakan cur.execute(q_now) untuk menjalankan SQL." },
          { kind: "stdout_matches", task: "t3", pattern: "current=\\s*3", label: "`print` current=3", msg: "3 pelanggan aktif (Andi-gold, Budi-silver, Cici-silver)." },
          { kind: "stdout_matches", task: "t3", pattern: "pernah_berubah=\\s*\\[\\(1, 2\\), \\(3, 2\\)\\]", label: "`print` histori Andi & Cici", msg: "Andi (id=1) dan Cici (id=3) masing-masing punya 2 baris histori." },
        ],
      },
      reference: "Snapshot SCD2: WHERE valid_to = '9999-12-31'. Histori: GROUP BY id HAVING COUNT(*) > 1.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Staging adalah 'kotak bukti': data mentah apa adanya, tidak pernah diubah. Saat angka dipertanyakan 6 bulan kemudian, staging-lah yang menjadi saksi — bukan ingatanmu.",
        "💡 SCD tipe 2 menjawab pertanyaan yang tipe 1 tidak bisa: 'berapa revenue Jakarta SAAT ITU?' Bisnis selalu bertanya tentang masa lalu dengan kacamata masa lalu — tipe 1 (timpa) menghapus kacamata itu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: sejarah hanya boleh ditimpa untuk kesalahan ketik",
        body: "Praktisi data punya satu trauma kolektif: angka kuartal lalu yang tidak bisa direproduksi. Akarnya hampir selalu sama — seseorang menimpa data yang seharusnya diabadikan. Heuristiknya sederhana dan keras: staging tidak pernah diubah, titik; ia kotak bukti yang menjawab \"datanya memang begitu saat masuk\". Untuk tabel bisnis, aturan keputusannya: perubahan makna bisnis — tier pelanggan naik, region berubah — menjadi baris baru dengan valid_from dan valid_to; koreksi kesalahan input — typo nama, salah ketik — boleh ditimpa langsung. Jebakan pertama: source yang goyang, nilainya berubah-ubah tiap load, meledakkan jumlah baris histori — solusinya, bandingkan hash kolom bisnis sebelum insert baris baru. Jebakan kedua: query lupa memfilter baris aktif sehingga angka double-count — solusinya, sediakan view \"current\" sebagai default dan paksa analis memakainya. Satu angka praktis: 1 juta pelanggan dikali rata-rata 4 perubahan setahun berarti 4 juta baris per tahun — rencanakan partisi dan retensi sejak hari pertama. Dan kebiasaan yang menyelamatkan karier: setiap kali angka dipertanyakan enam bulan kemudian, kamu membuka staging — bukan mengandalkan ingatanmu.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: SQL atau Python?",
      prose: [
        "Skenario 1 — Join + agregasi + filter di atas data terstruktur. Kondisi: logika set-based, data di warehouse. Keputusan: SQL. Alasan: deklaratif, dioptimasi engine, sejajar dengan data.",
        "Skenario 2 — Parsing JSON bersarang / regex kompleks / panggil API. Kondisi: logika baris-per-baris yang aneh. Keputusan: Python. Alasan: SQL tersiksa untuk prosedural; Python punya library.",
        "Skenario 3 — Dedup + window + SCD. Kondisi: butuh deterministik dan cepat di volume besar. Keputusan: SQL (window function). Alasan: engine warehouse mengeksekusi window jauh lebih cepat dari loop Python.",
        "Skenario 4 — Validasi kualitas + alert kustom. Kondisi: aturan 'jika X maka kirim pesan'. Keputusan: Python (orkestrasi di sekitar SQL). Alasan: SQL tidak mengirim alert; Python menjembatani query dan dunia luar.",
        "Aturan praktis 10 detik: kalau bisa diungkapkan sebagai 'untuk setiap grup, hitung ...' → SQL. Kalau butuh 'untuk setiap baris, jika ... maka hubungi ...' → Python.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menarik 10 juta baris ke Python untuk di-COUNT. Itu seperti memindahkan gudang ke rumah untuk menghitung isinya. Agregasi selalu di database (SQL); Python hanya menerima hasilnya yang kecil.",
      },
      reference: "Set-based → SQL. Prosedural/integrasi → Python. Keduanya sering kawin di satu pipeline.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: dedup + top-2 per kategori",
      prose: [
        "Tabel trx_mentah berisi 7 baris transaksi 13 Oktober — termasuk 2 kirim-ulang (retry) yang kembar persis: (kat, nominal, ts) sama. Tugasmu: bangun trx_bersih via ROW_NUMBER() dedup, hitung tingkat duplikasi, lalu ambil top-2 nominal per kategori.",
        "Angka yang harus kamu dapatkan: 7 → 5 baris, 2 duplikat dibuang, tingkat duplikasi 0,286. Top-2 per kategori: hiburan 200rb; makanan 120rb & 85rb; transport 60rb & 45rb.",
        "Interpretasi: di produksi, dedup seperti ini berjalan di lapisan clean setiap hari — retry jaringan adalah fakta hidup, bukan anomali.",
      ],
      requires: ["sqlite3"],
      tasks: [
        { id: "t1", text: "Buat `trx_bersih` via `ROW_NUMBER()` (PARTITION BY kat, nominal, ts)" },
        { id: "t2", text: "Hitung `tingkat_duplikat` dan cetak `mentah`, `bersih`, `duplikat_dibuang`" },
        { id: "t3", text: "Query top-2 nominal per kategori, cetak sebagai list tuple" },
      ],
      expected: "mentah=7 bersih=5 duplikat_dibuang=2 | tingkat_duplikat=0.286 | top2=[('hiburan', 200000), ('makanan', 120000), ('makanan', 85000), ('transport', 60000), ('transport', 45000)]",
      hints: [
        "Dedup: ROW_NUMBER() OVER (PARTITION BY kat, nominal, ts ORDER BY id) AS rn, saring rn = 1.",
        "tingkat_duplikat = (mentah - bersih) / mentah, format :.3f.",
        "Top-2: ROW_NUMBER() OVER (PARTITION BY kat ORDER BY nominal DESC), saring rn <= 2.",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE trx_mentah (id INTEGER, kat TEXT, nominal INTEGER, ts TEXT)")\ncur.executemany("INSERT INTO trx_mentah VALUES (?,?,?,?)", [\n    (1,'makanan',85000,'2026-10-13 08:01'),(2,'makanan',85000,'2026-10-13 08:01'),\n    (3,'transport',45000,'2026-10-13 09:12'),(4,'makanan',120000,'2026-10-13 12:30'),\n    (5,'hiburan',200000,'2026-10-13 19:00'),(6,'hiburan',200000,'2026-10-13 19:00'),\n    (7,'transport',60000,'2026-10-13 20:15'),\n])\n\n# TULIS KODEMU: dedup -> trx_bersih\ncur.execute(\n\ncur.execute("SELECT COUNT(*) FROM trx_mentah"); mentah = cur.fetchone()[0]\ncur.execute("SELECT COUNT(*) FROM trx_bersih"); bersih = cur.fetchone()[0]\n\n# TULIS KODEMU: tingkat duplikasi + print\ntingkat_duplikat = \nprint(f"mentah={mentah} bersih={bersih} duplikat_dibuang={mentah-bersih}")\nprint(f"tingkat_duplikat={tingkat_duplikat:.3f}")\n\n# TULIS KODEMU: top-2 per kategori\nq_top2 = \ncur.execute(q_top2)\nprint("top2=", cur.fetchall())`,
        lockLines: 10,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE trx_mentah (id INTEGER, kat TEXT, nominal INTEGER, ts TEXT)")\ncur.executemany("INSERT INTO trx_mentah VALUES (?,?,?,?)", [\n    (1,'makanan',85000,'2026-10-13 08:01'),(2,'makanan',85000,'2026-10-13 08:01'),\n    (3,'transport',45000,'2026-10-13 09:12'),(4,'makanan',120000,'2026-10-13 12:30'),\n    (5,'hiburan',200000,'2026-10-13 19:00'),(6,'hiburan',200000,'2026-10-13 19:00'),\n    (7,'transport',60000,'2026-10-13 20:15'),\n])\n\n# TULIS KODEMU: dedup -> trx_bersih\ncur.execute("""CREATE TABLE trx_bersih AS\nSELECT id, kat, nominal, ts FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY kat, nominal, ts ORDER BY id) rn FROM trx_mentah\n) WHERE rn = 1""")\n\ncur.execute("SELECT COUNT(*) FROM trx_mentah"); mentah = cur.fetchone()[0]\ncur.execute("SELECT COUNT(*) FROM trx_bersih"); bersih = cur.fetchone()[0]\n\n# TULIS KODEMU: tingkat duplikasi + print\ntingkat_duplikat = (mentah - bersih) / mentah\nprint(f"mentah={mentah} bersih={bersih} duplikat_dibuang={mentah-bersih}")\nprint(f"tingkat_duplikat={tingkat_duplikat:.3f}")\n\n# TULIS KODEMU: top-2 per kategori\nq_top2 = """SELECT kat, nominal FROM (\n  SELECT kat, nominal, ROW_NUMBER() OVER (PARTITION BY kat ORDER BY nominal DESC) rn FROM trx_bersih\n) WHERE rn <= 2 ORDER BY kat, nominal DESC"""\ncur.execute(q_top2)\nprint("top2=", cur.fetchall())`,
        checks: [
          { kind: "equal", task: "t2", name: "bersih", value: 5, tol: 0, label: "`bersih` = 5 baris", msg: "7 baris mentah − 2 duplikat = 5." },
          { kind: "stdout_matches", task: "t2", pattern: "tingkat_duplikat=0\\.286", label: "`print` tingkat_duplikat=0.286", msg: "2/7 = 0,286." },
          { kind: "stdout_matches", task: "t3", pattern: "\\('hiburan', 200000\\), \\('makanan', 120000\\)", label: "`print` top2 benar", msg: "Urutan: hiburan 200rb, makanan 120rb, makanan 85rb, transport 60rb, transport 45rb." },
        ],
      },
      reference: "Pola dedup universal: ROW_NUMBER() OVER (PARTITION BY kunci ORDER BY id), saring rn=1.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus: determinisme dan pemilihan alat.",
      ],
      tasks: [],
      summary: [
        "SQL pipeline harus deterministik: LIMIT selalu ditemani ORDER BY; sama input → sama output setiap run.",
        "Tiga lapisan: staging (bukti, jangan diubah) → clean (satu kebenaran) → mart (etalase per tim); transform idempoten.",
        "Window function = agregasi tanpa GROUP BY; pola dedup: ROW_NUMBER() PARTITION BY kunci, saring rn=1.",
        "SCD tipe 2 menyimpan histori via baris baru + valid_from/valid_to; tipe 1 menimpa (amnesia).",
        "Set-based → SQL; prosedural/integrasi → Python; agregasi besar selalu di database.",
      ],
      next: { label: "DE4 — Python untuk Pipeline", href: "/v2/learn/de4-python" },
      quiz: [
        {
          q: "Kenapa laporan bonus Rian berubah-ubah tiap hari?",
          options: [
            { text: "Datanya berubah setiap hari", why: "Tidak ada yang mengubah data; sumbernya sama setiap run." },
            { text: "LIMIT tanpa ORDER BY membuat database bebas memilih baris", why: "Tepat: non-deterministik. Tiap run boleh mengambil 1000 baris yang berbeda.", correct: true },
            { text: "Query-nya terlalu panjang (200 baris)", why: "Panjang bukan masalah; satu baris tanpa ORDER BY adalah masalahnya." },
            { text: "Server database overload", why: "Overload memperlambat, bukan mengacak hasil." },
          ],
        },
        {
          q: "Analis membangun dashboard langsung dari tabel staging. Risiko terbesarnya?",
          options: [
            { text: "Query-nya berjalan lambat", why: "Performa bukan risiko terbesarnya." },
            { text: "Definisi metrik bercabang antar tim tanpa ada yang sadar", why: "Tepat: setiap tim menafsirkan data mentah sendiri — resep insiden drift definisi.", correct: true },
            { text: "Tabel staging terhapus", why: "Staging tidak mudah terhapus; masalahnya adalah makna, bukan keberadaan." },
            { text: "Analis tidak bisa pakai window function", why: "Bisa-bisa saja; bukan itu masalahnya." },
          ],
        },
        {
          q: "Kapan memakai SCD tipe 2, bukan tipe 1?",
          options: [
            { text: "Ketika tabelnya kecil", why: "Ukuran bukan penentunya; kebutuhan historis yang menentukan." },
            { text: "Ketika perubahan atribut memengaruhi uang/analisis historis (tier, harga)", why: "Tepat: tipe 2 menyimpan 'dulu apa' via baris baru + rentang tanggal.", correct: true },
            { text: "Ketika ingin query tercepat", why: "Tipe 1 justru lebih cepat (satu baris per entitas) — tapi amnesia." },
            { text: "Ketika tidak ada perubahan data", why: "Kalau tidak ada perubahan, SCD tidak relevan sama sekali." },
          ],
        },
        {
          q: "Mana yang paling tepat dikerjakan di SQL (bukan Python)?",
          options: [
            { text: "Mengirim alert Telegram jika data telat", why: "Itu integrasi dunia luar — ranah Python." },
            { text: "Dedup 50 juta baris dengan window function", why: "Tepat: set-based, engine warehouse jauh lebih cepat dari loop Python.", correct: true },
            { text: "Parsing PDF invoice menjadi teks", why: "Butuh library khusus — ranah Python." },
            { text: "Menarik 10 juta baris lalu di-COUNT di Python", why: "Anti-pattern: pindahkan agregasi ke database, bukan datanya ke Python." },
          ],
        },
        {
          q: "Apa arti d = 0,286 pada rumus tingkat duplikasi?",
          options: [
            { text: "28,6% baris adalah kirim-ulang/duplikat", why: "Tepat: (7−5)/7 = 0,286. Hampir sepertiga data adalah retry.", correct: true },
            { text: "28,6% baris hilang", why: "Terbalik: d mengukur kelebihan (duplikat), bukan kekurangan." },
            { text: "Query berjalan 28,6% lebih lambat", why: "d tidak mengukur kecepatan." },
            { text: "286 baris duplikat", why: "d adalah rasio (0–1), bukan jumlah absolut." },
          ],
        },
        {
          q: "Analis menemukan revenue Desember 'berubah' antara laporan Januari dan Maret. Penyebab paling mungkin?",
          options: [
            { text: "Database corrupt", why: "Corrupt tidak memilih-milih bulan. Gejala sistematis per bulan = masalah logika, bukan corrupt." },
            { text: "Query ke tabel mentah/staging yang di-update retroaktif; mart tidak di-freeze", why: "Tepat: staging boleh berubah (retur masuk belakangan); mart/laporan harus di-freeze per periode ATAU memakai SCD. 'Berubah' = tidak ada lapisan kebenaran yang dibekukan.", correct: true },
            { text: "Window function salah", why: "Window function salah menghasilkan angka salah KONSISTEN — bukan angka yang berubah seiring waktu." },
            { text: "Analis salah baca", why: "Menyalahkan pembaca saat polanya sistematis = melewatkan bug arsitektur." },
          ],
        },
      ],
    },
  ],
};
