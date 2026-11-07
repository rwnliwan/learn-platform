import type { V2Lesson } from "../lib/types";

// ── Figure: biaya query boros vs hemat ────────────────────────────────────
const BQ_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang biaya: query boros 15 dolar, query hemat 1,67 dolar">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">4</text>
<text x="54" y="139">8</text><text x="54" y="99">12</text>
<text x="54" y="59">16 $</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="130" y="30" width="80" height="186" fill="var(--c4)" opacity="0.9"/>
<text x="170" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">15,00</text>
<text x="170" y="232" text-anchor="middle" fill="var(--text)">SELECT *</text>
<text x="170" y="246" text-anchor="middle" fill="var(--text-muted)">2,4 TB dipindai</text>
<rect x="330" y="195" width="80" height="21" fill="var(--c1)" opacity="0.9"/>
<text x="370" y="187" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1,67</text>
<text x="370" y="232" text-anchor="middle" fill="var(--text)">2 kolom + filter</text>
<text x="370" y="246" text-anchor="middle" fill="var(--text-muted)">0,27 TB dipindai</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">satu query, dua penulisan · tarif $6,25/TB (ilustrasi BigQuery)</text>
</g>
</svg>`;

export const d22: V2Lesson = {
  slug: "d22-bigquery-snowflake",
  track: "Python",
  module: "Skala",
  title: "D22 — BigQuery & Snowflake dari Python",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query $15 yang dijalankan 20 kali",
      prose: [
        "Rina, data engineer sebuah e-commerce, baru migrasi ke BigQuery. Hari pertama ia bahagia: query agregasi 2,4 TB selesai dalam 11 detik — “ajaib”. Ia lalu debugging: menjalankan SELECT * FROM transaksi ORDER BY created_at DESC LIMIT 5 dua puluh kali sambil merapikan logika (“biar lihat datanya dulu”). Sorenya email dari FinOps: tagihan hari ini $300. Satu query yang sama — yang di laptopnya gratis — di BigQuery berharga $15 per eksekusi, dan ia mengeksekusinya 20 kali. Twist-nya: query “final”-nya yang hemat (2 kolom + filter tanggal) hanya berharga $1,67 — 9× lebih murah — dan LIMIT 5 di query borosnya TIDAK menghemat satu sen pun.",
        "Minggu depannya giliran Snowflake: Rina menjalankan query “kecil” yang sama, tagihan nyaris nol — tetapi warehouse-nya ia biarkan menyala 24/7 “biar siap”, dan di akhir bulan muncul $2.160 untuk compute yang menganggur. Dua warehouse, dua model tagihan, dua cara berbeda untuk terkejut. Lesson ini tentang membaca meteran sebelum menekan Run — dan pola Python yang aman untuk keduanya.",
        "Tiga hal yang akan kamu kuasai: (1) dua model biaya — bayar per byte dipindai (BigQuery) vs bayar per detik compute (Snowflake); (2) pola koneksi + parameterized query dari Python untuk kedua warehouse; (3) empat jebakan yang membuat tagihan meledak — termasuk SELECT * yang “cuma lihat 5 baris”.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "BigQuery dan Snowflake ASLI butuh akun cloud + kredensial — tidak tersedia di lab browser. Lab memakai sqlite3 sebagai STAND-IN dengan pola 1:1: query boros vs hemat dijalankan sungguhan di sqlite (hasilnya identik), sedangkan estimasi byte & dolar dihitung dari ukuran tabel contoh dengan rumus tarif asli kedua warehouse. Di laptop: pip install google-cloud-bigquery / snowflake-connector-python, dan pola koneksinya mengikuti struktur yang sama (client → parameterized query → fetch).",
      },
      reference: "$15 × 20 eksekusi = $300. LIMIT tidak menghemat. Snowflake 24/7 idle = $2.160/bulan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita Rina dan tagihan $300. (2) Peta ini. (3) Konsep: dua model tagihan — Si Meteran Air vs Si Taksi Argometer. (4) Konsep: pola koneksi Python + parameterized query. (5) Konsep: empat jebakan tagihan (SELECT *, tanpa partisi, view berulang, warehouse idle). (6) Lab 1: tulis query boros vs hemat di sqlite. (7) Lab 2: hitung tagihan BigQuery & Snowflake. (8) Chart: $15 vs $1,67. (9) Peta keputusan: kapan warehouse mana + kapan kembali ke sqlite. (10) Mini-case: audit tagihan $2.160. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menghitung estimasi biaya query SEBELUM menekan Run di kedua model tagihan; (2) menulis pola koneksi Python yang aman (parameterized) untuk BigQuery/Snowflake; (3) mengenali 4 jebakan tagihan dari pola query; (4) memutuskan kapan data cukup di sqlite/Postgres lokal.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: SQL dasar (SELECT, WHERE, GROUP BY); Python dasar (f-string, fungsi); sqlite3 pernah dipakai di lesson C-series (cukup tahu connect + execute). Tidak perlu akun cloud.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart biaya → peta keputusan → mini-case → kuis. Estimasi 60 menit; dua lab ±16 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap BigQuery seperti PDAM — kamu bayar per liter air yang MENGALIR LEWAT METERAN (byte dipindai), bukan per gelas yang kamu minum (baris hasil). Snowflake seperti taksi argometer — kamu bayar per detik mobil BERJALAN (compute menyala), tidak peduli penumpangnya sedikit. Rina membayar PDAM untuk 20 ember air padahal ia cuma mencicipi satu gelas — dan ia menyewa taksi 24 jam untuk perjalanan 5 menit.",
      ],
      reference: "Tujuan: dua model tagihan + pola Python aman + 4 jebakan. sqlite sebagai stand-in 1:1.",
    },
    {
      id: "konsep-tagihan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dua meteran: Si Meteran Air dan Si Taksi Argometer",
      prose: [
        "Definisi: BigQuery memakai model on-demand bayar per BYTE DIPINDAI — tiap query ditagih berdasarkan kolom × baris yang dibaca mesin, bukan yang dikembalikan. Tarif ilustrasi: $6,25 per TB. Snowflake memakai model bayar per DETIK COMPUTE — virtual warehouse (cluster) ditagih per detik menyala (auto-suspend bila idle), tidak peduli query-nya kecil; tarif ilustrasi: $3 per kredit, 1 kredit ≈ 1 jam warehouse ukuran XS.",
        "Kepribadiannya: BigQuery adalah PDAM — meteran berputar saat air mengalir; keran kecil (2 kolom) = tagihan kecil, keran jebol (SELECT *) = tagihan jebol, dan jumlah gelas yang kamu minum (LIMIT 5) TIDAK mengubah meteran. Snowflake adalah taksi argometer — begitu masuk mobil (warehouse menyala), argo jalan per detik; perjalanan 5 menit = murah, tetapi sopir yang menunggu 24 jam di depan rumah = $2.160/bulan. Rina membayar PDAM 20 ember untuk satu gelas cicipan, lalu menyewa taksi siaga sebulan.",
        "Kapan memakai: BigQuery on-demand cocok untuk beban sporadis (analisis ad-hoc, tim kecil) — bayar hanya saat query jalan. Snowflake cocok untuk beban terjadwal/predictable dengan auto-suspend agresif (mis. suspend setelah 60 detik idle) — dan pisahkan warehouse per beban (ETL vs dashboard) agar tagihan bisa dilacak per tim. Tiga aturan meteran: (1) hitung SEBELUM Run: byte ≈ kolom × baris × ukuran baris; (2) LIMIT bukan rem tagihan di model byte; (3) di model compute, musuhmu adalah IDLE — bukan query-nya.",
      ],
      tasks: [],
      formula: String.raw`C = B \times p`,
      formulaNote: "C = biaya satu query; B = byte yang dipindai (kolom yang dibaca × baris × ukuran per baris); p = tarif per byte ($6,25/TB ilustrasi). Contoh: tabel 2,4 TB, 18 kolom, query butuh 2 kolom → B ≈ 2,4 × 2/18 = 0,27 TB → C = 0,27 × 6,25 = $1,67. Query SELECT * → B = 2,4 TB → C = $15,00. Untuk Snowflake: C = t × r (t = detik warehouse menyala, r = tarif per detik).",
      note: {
        title: "🚨 Mitos: “LIMIT 5 membuat query murah”",
        type: "pitfall",
        body: "Yang benar: di BigQuery on-demand, LIMIT memangkas baris KELUARAN, bukan byte PINDAIAN — mesin tetap membaca seluruh kolom yang diminta dari semua baris, lalu mengambil 5. Rina membayar $15 penuh untuk “cuma lihat 5 baris”. Pengecualiannya hanya bila query bisa berhenti dini (rare). Aturan: murah = sedikit KOLOM + filter partisi, bukan LIMIT.",
      },
      hints: [
        "💡 Intuisi kolom: warehouse cloud menyimpan data per KOLOM (columnar), bukan per baris. Meminta 2 dari 18 kolom = mesin hanya membuka 2 dari 18 “laci” — itulah kenapa penghematannya proporsional (2/18 ≈ 11% tagihan). SELECT * membuka semua laci.",
      ],
      reference: "BigQuery = bayar per byte dipindai. Snowflake = bayar per detik compute. LIMIT bukan rem.",
    },
    {
      id: "konsep-koneksi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Pola koneksi Python — Si Kurir Berseragam",
      prose: [
        "Definisi: pola koneksi yang aman untuk kedua warehouse sama strukturnya: (1) buat client dari kredensial (service account / key pair — JANGAN hardcode di kode, pakai environment variable); (2) tulis query dengan PARAMETER (placeholder), bukan f-string; (3) eksekusi + fetch hasilnya sebagai DataFrame. Parameterized query artinya nilai disisipkan oleh DRIVER secara terpisah dari teks SQL — mesin tidak pernah menafsirkan input user sebagai kode.",
        "Kepribadiannya: parameterized query adalah kurir berseragam dengan amplop tersegel — isi amplop (parameter) tidak pernah dibaca sebagai instruksi, hanya diantar. f-string SQL adalah kertas catatan yang ditempel di kaca mobil — siapa pun bisa menimpanya dengan tulisan lain (SQL injection). Contoh bahaya: f\"SELECT * FROM users WHERE nama = '{input_user}'\" dengan input_user = \"' OR '1'='1\" → mengembalikan SEMUA user. Versi aman: query = \"SELECT id, nama FROM users WHERE nama = ?\" lalu cur.execute(query, (input_user,)) — driver yang menangani kutipnya.",
        "Kapan memakai: SELALU parameterized untuk nilai yang berasal dari luar (input user, file, API) — tanpa pengecualian, di sqlite, Postgres, BigQuery, Snowflake. Pengecualian yang sah: nama tabel/kolom DINAMIS tidak bisa jadi parameter (placeholder hanya untuk nilai) — untuk itu pakai allowlist (daftar nama yang diizinkan) + kutip identifier sesuai dialek. Tiga aturan kurir: (1) kredensial di env var, bukan di repo; (2) nilai = parameter, tidak pernah f-string; (3) tutup koneksi/client setelah selesai (context manager).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Data internal tidak butuh parameterized query”",
        type: "pitfall",
        body: "Yang benar: “internal” bukan jaminan — data internal mengalir dari CSV vendor, form karyawan, dan API pihak ketiga, semuanya bisa mengandung kutip atau karakter aneh yang merusak query (atau lebih buruk). Injection bukan hanya soal hacker; soal ketahanan. Kebiasaan parameterized harus refleks, bukan keputusan per kasus.",
      },
      hints: [
        "💡 Intuisi placeholder: di sqlite placeholder-nya ? (qmark); di BigQuery @nama atau ?; di Snowflake %(nama)s atau ?. Beda simbol, SATU prinsip: nilai tidak pernah digabung ke teks SQL oleh tanganmu.",
      ],
      reference: "Nilai = parameter (driver yang menyisipkan). Kredensial di env var. Tutup client setelah selesai.",
    },
    {
      id: "konsep-jebakan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Empat jebakan tagihan — Si Lubang di Kantong",
      prose: [
        "Definisi: empat pola yang membuat tagihan meledak tanpa menambah nilai: (1) SELECT * eksplorasi berulang — tiap “lihat datanya dulu” memindai penuh; ganti dengan SELECT kolom_kebutuhan + TABLESAMPLE / LIMIT atas tabel kecil; (2) tanpa filter partisi — query atas tabel terpartisi tanggal tanpa WHERE tanggal = membuka semua partisi — selalu sertakan filter tanggalnya agar partition pruning bekerja; (3) view/dashboard yang di-refresh puluhan kali sehari atas query mahal — materialkan sebagai tabel terjadwal; (4) warehouse idle menyala — di Snowflake, lupa auto-suspend = membayar taksi siaga.",
        "Kepribadiannya: keempatnya adalah lubang di kantong yang sama — bukan pencuri besar, melainkan kebocoran kecil yang diulang 20× sehari. Rina tidak “boros besar” satu kali; ia bocor $15 sebanyak 20 kali. FinOps tidak marah pada query $15 — ia marah pada kebiasaan yang mengulanginya.",
        "Kapan memakai: jadikan checklist sebelum Run: (a) kolom eksplisit? (b) filter partisi ada? (c) ini eksekusi ke-berapa hari ini — bisakah hasilnya di-cache/materialkan? (d) untuk Snowflake: warehouse akan auto-suspend berapa detik setelah ini? Kebiasaan ini membedakan engineer yang “bisa query” dari yang “bisa dipercaya dengan kartu kredit perusahaan”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Tagihan cloud = biaya yang tak terhindarkan”",
        type: "pitfall",
        body: "Yang benar: 80–90% tagihan warehouse yang “bengkak” berasal dari disiplin penulisan, bukan dari kebutuhan bisnis yang nyata — persis seperti lesson C25 (tiga penulisan, tiga tagihan, satu hasil). Perusahaan yang tagihannya 10× lipat hampir selalu punya 3–4 pola bocor di atas, bukan 10× data.",
      },
      hints: [
        "💡 Intuisi dry-run: BigQuery punya mode dry-run — menghitung byte yang AKAN dipindai tanpa mengeksekusi (gratis). Kebiasaan profesional: dry-run dulu, baca estimasinya, baru Run. Di Snowflake: EXPLAIN + riwayat query (query history) untuk audit setelahnya.",
      ],
      reference: "4 jebakan: SELECT * berulang, tanpa filter partisi, view mahal di-refresh, warehouse idle.",
    },
    {
      id: "lab-query",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Tulis query boros vs hemat (sqlite stand-in)",
      prose: [
        "Waktunya praktik. Tabel pembayaran (12 baris, 6 kolom) sudah tersedia di sqlite. Tugasmu: (1) tulis query BOROS sebagai string ke query_boros — SELECT * tanpa filter (seperti Rina saat debugging); (2) tulis query HEMAT ke query_hemat — hanya 2 kolom yang dibutuhkan (id, nominal) + filter status='sukses'; (3) jalankan KEDUANYA dan simpan jumlah barisnya ke n_boros dan n_hemat. Hasil barisnya boleh sama — yang dinilai adalah POLA penulisannya.",
        "Di BigQuery asli, query (1) memindai 6 kolom × 12 baris; query (2) memindai 2 kolom × baris yang lolos filter. Di sini baris adalah proksinya — logika byte-nya identik.",
        "Coba: setelah lolos, tambahkan kondisi tanggal ke query_hemat (kolom partisi) — di warehouse nyata inilah yang memangkas partisi. Lalu renungkan: berapa kali sehari kamu menjalankan “query_boros” versi dirimu?",
      ],
      tasks: [
        { id: "t1", text: "Tulis `query_boros` (string): SELECT * tanpa filter" },
        { id: "t2", text: "Tulis `query_hemat` (string): 2 kolom (id, nominal) + WHERE status='sukses'" },
        { id: "t3", text: "Jalankan keduanya; simpan jumlah baris ke `n_boros` dan `n_hemat`" },
      ],
      expected: "boros: 12 baris (6 kolom dipindai) | hemat: 8 baris (2 kolom dipindai)",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE pembayaran(id INTEGER PRIMARY KEY, tanggal TEXT, pelanggan TEXT, nominal INTEGER, status TEXT, kanal TEXT)\")\ndata = [(1,\"2026-06-01\",\"A\",150000,\"sukses\",\"QRIS\"),(2,\"2026-06-01\",\"B\",75000,\"gagal\",\"VA\"),(3,\"2026-06-02\",\"C\",200000,\"sukses\",\"QRIS\"),(4,\"2026-06-02\",\"D\",50000,\"gagal\",\"VA\"),(5,\"2026-06-03\",\"E\",300000,\"sukses\",\"Transfer\"),(6,\"2026-06-03\",\"F\",125000,\"sukses\",\"QRIS\"),(7,\"2026-06-04\",\"G\",90000,\"gagal\",\"VA\"),(8,\"2026-06-04\",\"H\",175000,\"sukses\",\"Transfer\"),(9,\"2026-06-05\",\"I\",225000,\"sukses\",\"QRIS\"),(10,\"2026-06-05\",\"J\",60000,\"gagal\",\"VA\"),(11,\"2026-06-06\",\"K\",110000,\"sukses\",\"Transfer\"),(12,\"2026-06-06\",\"L\",85000,\"sukses\",\"QRIS\")]\ncur.executemany(\"INSERT INTO pembayaran VALUES (?,?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 query boros sebagai teks\nquery_boros =\n\n# t2 query hemat sebagai teks: 2 kolom + filter status\nquery_hemat =\n\n# t3: jalankan keduanya, hitung baris\nn_boros =\nn_hemat =\n\nprint(f\"boros: {n_boros} baris (6 kolom dipindai) | hemat: {n_hemat} baris (2 kolom dipindai)\")\n",
        lockLines: 5,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE pembayaran(id INTEGER PRIMARY KEY, tanggal TEXT, pelanggan TEXT, nominal INTEGER, status TEXT, kanal TEXT)\")\ndata = [(1,\"2026-06-01\",\"A\",150000,\"sukses\",\"QRIS\"),(2,\"2026-06-01\",\"B\",75000,\"gagal\",\"VA\"),(3,\"2026-06-02\",\"C\",200000,\"sukses\",\"QRIS\"),(4,\"2026-06-02\",\"D\",50000,\"gagal\",\"VA\"),(5,\"2026-06-03\",\"E\",300000,\"sukses\",\"Transfer\"),(6,\"2026-06-03\",\"F\",125000,\"sukses\",\"QRIS\"),(7,\"2026-06-04\",\"G\",90000,\"gagal\",\"VA\"),(8,\"2026-06-04\",\"H\",175000,\"sukses\",\"Transfer\"),(9,\"2026-06-05\",\"I\",225000,\"sukses\",\"QRIS\"),(10,\"2026-06-05\",\"J\",60000,\"gagal\",\"VA\"),(11,\"2026-06-06\",\"K\",110000,\"sukses\",\"Transfer\"),(12,\"2026-06-06\",\"L\",85000,\"sukses\",\"QRIS\")]\ncur.executemany(\"INSERT INTO pembayaran VALUES (?,?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 query boros sebagai teks\nquery_boros = \"SELECT * FROM pembayaran\"\n\n# t2 query hemat sebagai teks: 2 kolom + filter status\nquery_hemat = \"SELECT id, nominal FROM pembayaran WHERE status = 'sukses'\"\n\n# t3: jalankan keduanya, hitung baris\nn_boros = len(cur.execute(query_boros).fetchall())\nn_hemat = len(cur.execute(query_hemat).fetchall())\n\nprint(f\"boros: {n_boros} baris (6 kolom dipindai) | hemat: {n_hemat} baris (2 kolom dipindai)\")\n",
        checks: [
          { kind: "contains", task: "t1", label: "query_boros memakai SELECT *", msg: "Pola Rina saat debugging — pindai semua kolom.", name: "query_boros", value: "SELECT *" },
          { kind: "contains", task: "t2", label: "query_hemat menyebut nominal", msg: "Kolom kebutuhan ditulis eksplisit.", name: "query_hemat", value: "nominal" },
          { kind: "contains", task: "t2", label: "query_hemat memfilter status", msg: "Filter = lebih sedikit baris diproses.", name: "query_hemat", value: "sukses" },
          { kind: "equal", task: "t3", label: "n_boros = 12", msg: "Semua baris, semua kolom.", name: "n_boros", value: 12 },
          { kind: "equal", task: "t3", label: "n_hemat = 8", msg: "8 baris berstatus sukses.", name: "n_hemat", value: 8 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Dua pola, dua angka.", pattern: "hemat: 8 baris" },
        ],
      },
      reference: "Hasil boleh sama; yang dinilai pola penulisan. Byte dipindai = kolom × baris.",
    },
    {
      id: "lab-biaya",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Hitung tagihan BigQuery & Snowflake",
      prose: [
        "Lab kedua memakai rumus Langkah 3 untuk angka Rina: tabel transaksi 2,4 TB, 18 kolom, tarif BigQuery $6,25/TB. Tugasmu: (1) biaya_bq_boros — SELECT * (18/18 kolom); (2) biaya_bq_hemat — 2 kolom (2/18); (3) hemat_persen; (4) biaya_sf_idle — warehouse Snowflake XS lupa dimatikan 24 jam penuh @ $3/kredit, 1 kredit/jam. Vonis: berapa “harga ketidaktahuan” satu hari Rina?",
        "Di produksi, langkah (1)–(3) dikerjakan via dry-run SEBELUM menekan Run; langkah (4) dicegah dengan auto-suspend 60 detik.",
        "Coba: setelah lolos, hitung ulang dengan tarif $12,50/TB (tier lain) — dan untuk Snowflake, bandingkan idle 24 jam vs auto-suspend 60 detik (query 5 menit/hari). Itulah kenapa FinOps mencintai auto-suspend.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_bq_boros` ($; 2,4 TB × $6,25)" },
        { id: "t2", text: "Hitung `biaya_bq_hemat` ($; 2/18 kolom) dan `hemat_persen`" },
        { id: "t3", text: "Hitung `biaya_sf_idle` ($; 24 jam × $3/kredit)" },
      ],
      expected: "BQ boros: $15.0 | BQ hemat: $1.67 (hemat 88.9%) | Snowflake idle 24j: $72.0",
      code: {
        starter: "# TULIS KODEMU: t1 BigQuery boros — 2,4 TB penuh @ $6,25/TB\nbiaya_bq_boros =\n\n# t2: hemat = 2 dari 18 kolom\nbiaya_bq_hemat =\nhemat_persen =\n\n# t3: Snowflake XS idle 24 jam @ $3/kredit (1 kredit/jam)\nbiaya_sf_idle =\n\nusd = \"$\"\nprint(f\"BQ boros: {usd}{biaya_bq_boros} | BQ hemat: {usd}{biaya_bq_hemat} (hemat {hemat_persen}%) | Snowflake idle 24j: {usd}{biaya_sf_idle}\")\n",
        lockLines: 1,
        solution: "# TULIS KODEMU: t1 BigQuery boros — 2,4 TB penuh @ $6,25/TB\nbiaya_bq_boros = round(2.4 * 6.25, 2)\n\n# t2: hemat = 2 dari 18 kolom\nbiaya_bq_hemat = round(2.4 * 2 / 18 * 6.25, 2)\nhemat_persen = round((1 - biaya_bq_hemat / biaya_bq_boros) * 100, 1)\n\n# t3: Snowflake XS idle 24 jam @ $3/kredit (1 kredit/jam)\nbiaya_sf_idle = 24 * 3.0\n\nusd = \"$\"\nprint(f\"BQ boros: {usd}{biaya_bq_boros} | BQ hemat: {usd}{biaya_bq_hemat} (hemat {hemat_persen}%) | Snowflake idle 24j: {usd}{biaya_sf_idle}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "biaya_bq_boros = $15,00", msg: "2,4 × 6,25 — harga satu “lihat data dulu”.", name: "biaya_bq_boros", value: 15.0, tol: 0.01 },
          { kind: "equal", task: "t2", label: "biaya_bq_hemat = $1,67", msg: "2/18 kolom — sepersembilan tagihan.", name: "biaya_bq_hemat", value: 1.67, tol: 0.01 },
          { kind: "equal", task: "t2", label: "hemat_persen = 88,9%", msg: "Disiplin menulis memangkas hampir 90%.", name: "hemat_persen", value: 88.9, tol: 0.1 },
          { kind: "equal", task: "t3", label: "biaya_sf_idle = $72", msg: "24 × 3 — taksi siaga sehari.", name: "biaya_sf_idle", value: 72.0, tol: 0.01 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Tiga tagihan Rina.", pattern: "Snowflake idle 24j" },
        ],
      },
      reference: "BQ: $15 vs $1,67 (dry-run dulu!). Snowflake idle 24 jam = $72 — auto-suspend 60 detik.",
    },
    {
      id: "chart-biaya",
      eyebrow: "Langkah 8 · Chart",
      title: "$15 vs $1,67: harga dua penulisan",
      prose: [
        "Chart di bawah memvisualkan rumus Langkah 3 untuk tabel 2,4 TB (tarif $6,25/TB): query boros $15,00 vs query hemat $1,67.",
        "Cara membaca: sumbu Y = dolar AS per satu eksekusi; tiap batang = satu pola penulisan; label bawah = byte yang dipindai.",
        "Interpretasi: batang boros 9× lipat batang hemat — untuk HASIL yang setara bagi kebutuhan Rina. Kalikan dengan 20 eksekusi debugging: $300 vs $33. Pelajaran chart: di warehouse cloud, “query yang sama” tidak ada — yang ada adalah “penulisan yang sama”. Meteran PDAM tidak peduli niatmu, hanya keran yang kamu buka.",
      ],
      figure: {
        svg: BQ_SVG,
        alt: "Diagram batang: query boros 15 dolar (2,4 TB), query hemat 1,67 dolar (0,27 TB).",
        caption: "$15 vs $1,67 untuk satu query — ×20 eksekusi debugging = $300 vs $33. Keran yang kamu buka, bukan niatmu.",
      },
      tasks: [],
      reference: "9× selisih dari penulisan. ×20 debugging = $300 vs $33.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: warehouse mana, kapan",
      prose: [
        "Skenario 1 — Analisis ad-hoc sesekali, tim 3 orang, tidak ada pola tetap. → BigQuery on-demand. Alasan: bayar hanya saat query jalan; nol biaya idle; dry-run gratis sebelum Run.",
        "Skenario 2 — ETL terjadwal tiap jam + dashboard direksi, beban predictable. → Snowflake dengan warehouse terpisah per beban + auto-suspend 60 detik. Alasan: compute terjadwal lebih murah dari on-demand bila utilisasinya tinggi; pemisahan warehouse = tagihan per tim terlacak.",
        "Skenario 3 — Data <10 GB, satu analis, query interaktif. → Tetap sqlite/Postgres lokal. Alasan: warehouse cloud untuk data ini = membayar meteran PDAM untuk segelas air — overkill total.",
        "Skenario 4 — Query dari aplikasi Python production (API). → Koneksi parameterized + service account + (BigQuery) dry-run di CI untuk query baru. Alasan: aplikasi mengeksekusi ribuan kali — satu pola boros = tagihan berulang otomatis.",
        "Skenario 5 — Tagihan tiba-tiba 5× lipat bulan ini. → Audit: query history (siapa, query apa, byte berapa) → temukan pola bocor (SELECT * berulang / tanpa partisi / idle) → perbaiki pola, bukan hapus data. Alasan: 90% kasus = disiplin, bukan kebutuhan.",
        "Aturan praktis 10 detik: sporadis = BQ on-demand; terjadwal = Snowflake + auto-suspend; kecil = lokal; dari aplikasi = parameterized + dry-run di CI; tagihan meledak = audit pola dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih warehouse karena “perusahaan tetangga pakai itu” tanpa menghitung pola beban sendiri. Tetangga dengan ETL 24/7 cocok di Snowflake; kamu dengan 5 query ad-hoc sehari akan membayar mahal untuk idle. Warehouse dipilih dari METERAN vs BEBAN, bukan dari tren.",
      },
      reference: "Sporadis = BQ; terjadwal = Snowflake + suspend; kecil = lokal; dari app = parameterized.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Audit tagihan $2.160: bedah dan selamatkan",
      prose: [
        "Skenario (sintetis, angka konkret): startup X memakai Snowflake XS ($3/kredit). Warehouse ETL menyala 24/7 “biar siap” padahal ETL hanya jalan 2 jam/hari. Tagihan compute: 24 × 30 × $3 = $2.160/bulan. Ditambah analis menjalankan SELECT * atas tabel 2,4 TB rata-rata 3× sehari: 90 × $15 = $1.350/bulan. Total $3.510/bulan — untuk beban yang sebenarnya butuh <$300.",
        "Pertanyaan analisis: (1) Hitung tagihan setelah auto-suspend 60 detik (asumsikan ETL 2 jam + analis total 1 jam compute/hari). (2) Hitung penghematan bila analis beralih ke pola hemat ($1,67). (3) Mana yang diperbaiki DULU dan kenapa?",
        "Pembahasan: (1) Compute: 3 jam × 30 × $3 = $270/bulan (dari $2.160 — hemat 87,5%). (2) Analis: 90 × $1,67 = $150/bulan (dari $1.350 — hemat 88,9%). Total baru ≈ $420/bulan — turun 88%. (3) Perbaiki idle DULU: satu toggle auto-suspend (5 menit kerja) menghemat $1.890/bulan — ROI tertinggi; pola query kedua karena butuh mengubah kebiasaan 3 orang.",
        "Kaitan ke karier: “menurunkan tagihan Snowflake 88% dalam seminggu” adalah cerita interview yang membuktikan kamu berpikir dalam dolar, bukan sekadar sintaks — skill yang langka di kalangan engineer muda.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tagihan cloud tak terkendali adalah risiko operasional — dan respons panik (“matikan warehouse ETL!”) bisa menghentikan pipeline kritis. Audit pola dulu (query history), perbaiki dari ROI tertinggi (idle → pola query), jangan pernah mengorbankan pipeline produksi demi menghemat.",
      },
      reference: "$3.510 → $420: auto-suspend dulu ($1.890), pola query kedua ($1.200).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "BigQuery = bayar per byte dipindai (C = B × p); Snowflake = bayar per detik compute menyala.",
        "LIMIT tidak menghemat di model byte — yang menghemat: kolom eksplisit + filter partisi.",
        "Parameterized query: nilai disisipkan driver, tidak pernah f-string — refleks, bukan opsi.",
        "4 jebakan: SELECT * berulang, tanpa filter partisi, view/dashboard mahal di-refresh, warehouse idle.",
        "Kecil & sporadis = lokal/BQ on-demand; terjadwal = Snowflake + auto-suspend; dari aplikasi = parameterized + dry-run.",
      ],
      next: { label: "D23 — OOP Formal: Class, Inheritance, Polymorphism", href: "/v2/learn/d23-oop-formal" },
      quiz: [
        {
          q: "Rina menjalankan SELECT * FROM t_24TB LIMIT 5 sebanyak 20× di BigQuery on-demand. Tagihan?",
          options: [
            { text: "~$300 — tiap eksekusi memindai penuh (~$15), LIMIT tidak menghemat", why: "Benar: angka cerita — 20 × $15. LIMIT memangkas keluaran, bukan pindaian.", correct: true },
            { text: "~$0 — LIMIT 5 berarti hampir tidak ada byte dibaca", why: "Salah: mitos Langkah 3 — mesin tetap memindai kolom penuh dari semua baris." },
            { text: "$15 — 20 eksekusi di-cache otomatis", why: "Salah: tidak ada cache otomatis antar eksekusi ad-hoc yang membayar penuh tiap kali." },
            { text: "Tergantung kecepatan internet Rina", why: "Salah: biaya warehouse = byte dipindai × tarif, tanpa hubungan ke koneksi analis." },
          ],
        },
        {
          q: "Query butuh 2 dari 18 kolom tabel 2,4 TB @ $6,25/TB. Estimasi biaya vs SELECT *?",
          options: [
            { text: "$1,67 vs $15,00 — hemat 88,9% karena columnar hanya membaca kolom diminta", why: "Benar: angka lab — 2/18 × 2,4 TB × 6,25.", correct: true },
            { text: "Sama $15 — mesin membaca baris fisik utuh", why: "Salah: itu logika row-store; warehouse kolumnar membaca per kolom." },
            { text: "$7,50 — setengah kolom setengah harga", why: "Salah: proporsinya 2/18, bukan “aturan setengah”." },
            { text: "$0 — 2 kolom di bawah ambang minimum", why: "Salah: tidak ada ambang gratis untuk query on-demand standar." },
          ],
        },
        {
          q: "Mana pola Python yang AMAN untuk nilai dari input user di semua warehouse?",
          options: [
            { text: "Parameterized: cur.execute(\"... WHERE nama = ?\", (nama,)) — driver menyisipkan nilai", why: "Benar: prinsip Langkah 4 — nilai tidak pernah digabung ke teks SQL oleh tanganmu.", correct: true },
            { text: "f-string dengan .replace(\"'\", \"''\") manual", why: "Salah: sanitasi manual rapuh — satu karakter terlewat = injection; driver lebih andal." },
            { text: "f-string biasa — input dari form internal aman", why: "Salah: mitos Langkah 4 — “internal” bukan jaminan; kebiasaan harus refleks." },
            { text: "Menyimpan query di file .sql terpisah", why: "Salah: file terpisah tidak mengubah cara nilai disisipkan — f-string di file .sql tetap injection." },
          ],
        },
        {
          q: "Snowflake XS ($3/kredit) dibiarkan menyala 24/7 padahal query hanya 3 jam/hari. Pemborosan per bulan?",
          options: [
            { text: "$1.890 — (24−3) × 30 × $3 untuk compute menganggur", why: "Benar: angka mini-case — auto-suspend 60 detik menghapus hampir semuanya.", correct: true },
            { text: "$0 — idle tidak ditagih bila tanpa query", why: "Salah: justru sebaliknya — model compute menagih selama warehouse menyala, query atau tidak." },
            { text: "$270 — hanya jam query yang ditagih otomatis", why: "Salah: itu tagihan SETELAH auto-suspend, bukan sebelum." },
            { text: "$90 — ada diskon idle 95%", why: "Salah: tidak ada diskon idle — inilah kenapa lupa suspend mahal." },
          ],
        },
        {
          q: "Data 5 GB, satu analis, query interaktif sesekali. Pilihan paling profesional?",
          options: [
            { text: "Tetap sqlite/Postgres lokal — warehouse cloud overkill untuk beban ini", why: "Benar: skenario 3 peta — membayar meteran PDAM untuk segelas air.", correct: true },
            { text: "BigQuery — gratis sampai 1 TB pertama tiap bulan", why: "Salah: free tier ada, tetapi kompleksitas + risiko pola boros tidak sebanding untuk 5 GB." },
            { text: "Snowflake — paling modern", why: "Salah: “modern” bukan metrik pemilihan — meteran vs beban yang menentukan." },
            { text: "Keduanya sekaligus untuk redundansi", why: "Salah: redundansi warehouse = 2× kompleksitas + 2× risiko tagihan, tanpa manfaat untuk skala ini." },
          ],
        },
        {
          q: "Tagihan warehouse naik 5× dalam sebulan. Langkah pertama yang benar?",
          options: [
            { text: "Audit query history: siapa, query apa, byte berapa — temukan pola bocornya", why: "Benar: skenario 5 peta — 90% kasus = disiplin penulisan, didiagnosis dari data.", correct: true },
            { text: "Hapus data lama agar tabel mengecil", why: "Salah: menghapus histori merusak analitik demi menghemat — mengorbankan kebenaran." },
            { text: "Pindah warehouse lain yang “lebih murah”", why: "Salah: pola boros ikut pindah — meteran beda, kebocoran sama." },
            { text: "Batasi semua analis maksimal 3 query/hari", why: "Salah: mengorbankan produktivitas manusia — perbaiki polanya, bukan manusianya." },
          ],
        },
      ],
    },
  ],
};
