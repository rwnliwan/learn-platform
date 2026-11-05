import type { V2Lesson } from "../lib/types";

// ── Figure: waktu analisis event — parse di Python vs query di DB ────────
const WAKTU_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang waktu analisis 2 juta event: download dan parse di Python vs query JSON langsung di database">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">30</text><text x="54" y="139">60</text>
<text x="54" y="99">90</text><text x="54" y="59">120 mnt</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="120" y="116" width="70" height="100" fill="var(--chart-text)" opacity="0.55"/>
<text x="155" y="108" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">75</text>
<text x="155" y="232" text-anchor="middle" fill="var(--text)">download +</text>
<text x="155" y="246" text-anchor="middle" fill="var(--text)">parse Python</text>
<rect x="300" y="204" width="70" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="335" y="196" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0,3</text>
<text x="335" y="232" text-anchor="middle" fill="var(--text)">query JSON</text>
<text x="335" y="246" text-anchor="middle" fill="var(--text)">di database</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">pertanyaan sama: total nominal pembayaran sukses per kanal, 2 juta event (ilustrasi)</text>
</g>
</svg>`;

const C20_SCHEMA = `CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  diterima TEXT,
  payload TEXT
);`;

const C20_SEED = `INSERT INTO events VALUES (1, '2026-10-01 08:01', '{"tipe":"pembayaran","nominal":150000,"status":"sukses","meta":{"kanal":"mobile"}}');
INSERT INTO events VALUES (2, '2026-10-01 08:02', '{"tipe":"pembayaran","nominal":2500000,"status":"gagal","meta":{"kanal":"web"}}');
INSERT INTO events VALUES (3, '2026-10-01 08:03', '{"tipe":"pendaftaran","nominal":null,"status":"sukses","meta":{"kanal":"mobile"}}');
INSERT INTO events VALUES (4, '2026-10-01 08:05', '{"tipe":"pembayaran","nominal":750000,"status":"sukses","meta":{"kanal":"mobile"}}');
INSERT INTO events VALUES (5, '2026-10-01 08:07', '{"tipe":"penarikan","nominal":500000,"status":"sukses","meta":{"kanal":"atm"}}');
INSERT INTO events VALUES (6, '2026-10-01 08:09', '{"tipe":"pembayaran","nominal":300000,"status":"sukses","meta":{"kanal":"web"}}');`;

export const c20: V2Lesson = {
  slug: "c20-json-sql",
  track: "SQL",
  module: "Lanjutan",
  title: "SQL & JSON: Menjinakkan Data Semi-terstruktur — Event, Webhook, API",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "2 juta event, 2 jam download, 20 detik query",
      prose: [
        "Tim risk sebuah payment gateway menyimpan semua webhook event di satu kolom payload bertipe TEXT — isinya JSON seperti {\"tipe\":\"pembayaran\",\"nominal\":150000,\"status\":\"sukses\",\"meta\":{\"kanal\":\"mobile\"}}. Suatu pagi direksi bertanya: “berapa total pembayaran sukses per kanal kemarin?” Analis junior melakukan yang ia tahu: men-download 2 juta baris ke laptop, parse JSON-nya satu per satu di Python, agregasi manual. Laptopnya ngos-ngosan 2 jam; jawabannya datang saat rapat sudah bubar.",
        "Sore itu analis senior menunjukkan caranya: satu query — SELECT payload ->> '$.meta.kanal' AS kanal, SUM(payload ->> '$.nominal') FROM events WHERE payload ->> '$.status' = 'sukses' GROUP BY kanal; — selesai dalam 20 detik, tanpa satu pun baris meninggalkan database. Twist-nya: kolom JSON-nya bukan masalahnya. Selama ini junior mengira “data JSON = harus di-parse di Python” — padahal database modern bisa query KE DALAM JSON. Masalahnya bukan format datanya, melainkan ketidaktahuan bahwa SQL punya obeng untuk baut itu.",
        "Lesson ini tentang kapan menyimpan JSON di kolom database (dan kapan jangan), plus operator untuk menaklukkannya. Bekal ringkas dari dua lesson prasyarat (diringkas agar mandiri): dari SELECT dasar — SELECT, WHERE, GROUP BY + SUM/COUNT; dari fungsi — fungsi teks seperti substr() dan cara membaca dokumentasi fungsi baru (nama, argumen, contoh). JSON di SQL hanyalah “fungsi baru” dengan pola yang sama.",
      ],
      tasks: [],
      note: {
        title: "Kenapa analis modern wajib bisa ini",
        type: "risk",
        body: "Event tracking, webhook payment gateway, respons API, log aplikasi — semuanya tiba sebagai JSON. Analis yang tidak bisa query JSON di database akan selalu menjadi yang paling lambat di tim: download dulu, parse dulu, baru analisis. Di industri real-time, “lambat 2 jam” = “tidak relevan”.",
      },
      reference: "Data JSON bukan alasan keluar dari database. SQL modern bisa query ke dalam JSON.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita 2 juta event. (2) Peta ini. (3) Konsep: JSON di kolom — Si Laci Serbaguna (kapan pakai, kapan jangan). (4) Konsep: operator ekstraksi — json_extract, ->, ->>, path $. (5) Konsep: batas JSON — tiga antipattern kolom JSON. (6) Lab 1: ekstraksi field dari payload. (7) Lab 2: agregasi menembus JSON bertingkat. (8) Chart: download-parse vs query-di-DB. (9) Peta keputusan: kolom JSON vs kolom relasional vs document DB. (10) Mini-case: audit webhook gateway. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) memutuskan kapan kolom JSON tepat dan kapan itu antipattern; (2) mengekstrak field JSON dengan json_extract / -> / ->> termasuk path bertingkat ($.meta.kanal); (3) memfilter, mengurutkan, dan mengagregasi berdasarkan isi JSON; (4) menjelaskan tiga batas kolom JSON (index, validasi skema, keterbacaan).",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: SELECT kolom FROM tabel WHERE kondisi GROUP BY kolom + SUM/COUNT; fungsi dipanggil sebagai nama(argumen) — mis. substr(tanggal,1,7); string literal memakai kutip tunggal 'teks'. JSON di lab memakai kutip ganda di dalamnya (\"tipe\") — itu bagian dari data JSON, bukan sintaks SQL.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart → peta keputusan → mini-case → kuis. Estimasi 55 menit; tiap lab ±10 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: baca payload ->> '$.meta.kanal' sebagai kalimat: “dari kolom payload, ambil (->>) nilai pada path $.meta.kanal”. Tanda $ = akar dokumen JSON; titik = turun satu level. Setelah pola ini dikuasai, semua operator JSON hanyalah variasinya.",
      ],
      reference: "Tujuan: kapan pakai JSON + ekstraksi + agregasi + tiga batasnya. Bekal: SELECT/WHERE/GROUP BY + fungsi.",
    },
    {
      id: "konsep-laci",
      eyebrow: "Langkah 3 · Konsep",
      title: "JSON di Kolom — Si Laci Serbaguna",
      prose: [
        "Definisi: kolom JSON (TEXT berisi JSON, atau tipe JSON/JSONB di Postgres) menyimpan data semi-terstruktur — field-nya bisa berbeda antar baris tanpa ALTER TABLE. Contoh payload webhook: baris pembayaran punya nominal, baris pendaftaran tidak — keduanya muat di satu kolom payload. Inilah alasan utamanya: skema yang BERUBAH-UBAH (event tracking yang tiap sprint tambah field baru) tanpa migrasi skema tiap minggu.",
        "Kepribadiannya: kolom JSON adalah laci serbaguna di meja kerja — kamu bisa melempar apa saja ke dalamnya tanpa menata ulang lemari (skema). Praktis untuk barang yang bentuknya tidak menentu (payload webhook, respons API, konfigurasi). Tetapi laci serbaguna punya kutukan: mencari barang di dalamnya lambat (tidak ada index alami), tidak ada yang memastikan isinya rapi (tidak ada validasi tipe), dan orang lain tidak tahu apa isinya tanpa membongkar. Lemari berlabel (kolom relasional) tetap unggul untuk barang yang bentuknya sudah pasti.",
        "Kapan memakai — aturan dari buku More SQL Antipatterns (“when to use JSON columns”): PAKAI untuk data yang (1) skemanya berubah-ubah dan tidak di-query rutin (payload mentah webhook, log), (2) dibaca utuh sebagai dokumen (tampilkan detail event), (3) tidak menjadi kunci JOIN atau filter utama. JANGAN untuk kolom yang (1) rutin di-WHERE/JOIN (jadikan kolom nyata + index), (2) butuh constraint tipe (tanggal sebagai DATE, bukan string di JSON), (3) dianalisis lintas baris secara intensif. Tes 10 detik: “apakah field ini akan muncul di WHERE/JOIN dalam 3 bulan ke depan?” Ya → kolom relasional. Tidak → JSON boleh.",
      ],
      formula: String.raw`\text{putuskan} = \begin{cases} \text{kolom relasional}, & \text{field dipakai di WHERE/JOIN rutin} \\ \text{kolom JSON}, & \text{skema berubah-ubah, dibaca utuh} \end{cases}`,
      formulaNote: "Ini aturan keputusan (bukan persamaan hitung): dua cabang berdasarkan pemakaian field. Interpretasi: pertanyaan kuncinya bukan “datanya JSON atau bukan?”, melainkan “bagaimana field ini akan DIQUERY?”. Contoh: field status dipakai di WHERE tiap laporan → kolom relasional + index (walau datanya datang sebagai JSON, ekstrak saat ingest). Field meta.kampanye hanya ditampilkan di detail → biarkan di JSON. Kesalahan klasik: menyimpan SEMUA field webhook di JSON karena “praktis”, lalu setahun kemudian query WHERE di dalam JSON atas 100 juta baris tanpa index — praktis di awal, mahal selamanya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “JSON fleksibel, jadi simpan SEMUA di JSON saja”",
        type: "pitfall",
        body: "Yang benar: fleksibilitas JSON dibayar dengan tiga harga — tidak ada index alami (query lambat), tidak ada validasi tipe (data kotor masuk diam-diam), dan tidak ada dokumentasi skema (analis berikutnya menebak-nebak). Fleksibilitas adalah fitur untuk data yang MEMANG tidak menentu; untuk data yang polanya sudah jelas, ia hanya kemalasan yang menunda migrasi skema.",
      },
      hints: [
        "💡 Intuisi laci: perlakukan kolom JSON seperti laci meja — boleh ada, tetapi isi tetap harus “cukup rapi untuk ditemukan”. Tim yang sehat punya kontrak: field apa saja yang BOLEH masuk payload, siapa yang boleh menambah field baru, dan kapan field yang sering di-query “dipromosikan” menjadi kolom relasional.",
      ],
      reference: "JSON untuk skema berubah-ubah + dibaca utuh. WHERE/JOIN rutin → kolom relasional + index. Selalu.",
    },
    {
      id: "konsep-ekstraksi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Operator Ekstraksi — Si Pengebor Presisi",
      prose: [
        "Definisi: tiga operator untuk menembus JSON di SQLite (didukung sql.js di lab ini; Postgres/DuckDB punya padanan): json_extract(payload, '$.tipe') — fungsi eksplisit, paling portabel; payload -> '$.tipe' — mengembalikan FRAGMEN JSON (untuk objek/array, hasilnya tetap JSON); payload ->> '$.tipe' — mengembalikan NILAI TEKS/angka (unquote) — inilah yang paling sering dipakai karena langsung bisa dibandingkan dan diagregasi.",
        "Kepribadiannya: bayangkan JSON sebagai gedung bertingkat — $ adalah lobi, $.meta adalah lantai 2, $.meta.kanal adalah ruangan 2A. Operator ->> adalah pengebor presisi: ia turun persis ke ruangan yang dituju dan membawa pulang isinya, tanpa membongkar gedung. Beda -> dan ->>: -> membawa pulang “pintu ruangannya” (fragmen JSON, masih berbingkai kutip), ->> membawa pulang “isi ruangannya” (nilai murni). Untuk WHERE dan SUM, kamu butuh isinya — pakai ->>.",
        "Kapan memakai: ->> untuk ekstraksi nilai (filter, agregasi, tampil); -> untuk mengambil sub-objek/array yang akan diolah lanjut (mis. -> '$.items' lalu json_each untuk meledakkan array); json_each(payload, '$.items') untuk mengubah array JSON menjadi baris-baris (table-valued function — dipakai di FROM/JOIN). Contoh path: $.tipe (level 1), $.meta.kanal (level 2), $.items[0].nama (elemen array pertama). Jebakan: path yang salah TIDAK error — ia mengembalikan NULL diam-diam. Salah ketik $.meta.kanall → NULL, bukan error. Selalu verifikasi dengan SELECT sampel dulu.",
      ],
      formula: String.raw`\text{payload} \xrightarrow{\text{->> '\$.meta.kanal'}} \text{'mobile'}`,
      formulaNote: "Simbol: payload = kolom berisi JSON; ->> = operator ekstraksi nilai; '$.meta.kanal' = path (akar → objek meta → field kanal); 'mobile' = nilai yang dikembalikan. Interpretasi: operator ini MENGUBAH data semi-terstruktur menjadi nilai relasional biasa — setelah diekstrak, ia bisa di-WHERE, di-GROUP BY, di-SUM seperti kolom lain. Contoh angka dari lab: 6 event → ekstrak kanal → mobile: 3 event, web: 2 event, atm: 1 event. Tanpa operator ini, 6 event itu hanyalah teks buram.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “-> dan ->> sama saja, pilih yang pendek”",
        type: "pitfall",
        body: "Yang benar: -> mengembalikan fragmen JSON (masih dikutip: '\"mobile\"'), ->> mengembalikan nilai murni ('mobile'). Akibatnya: WHERE payload -> '$.status' = 'sukses' TIDAK PERNAH cocok (membandingkan '\"sukses\"' dengan 'sukses'), sementara ->> cocok. Bug ini tidak error — ia hanya mengembalikan 0 baris, dan analis mengira “datanya memang kosong”.",
      },
      hints: [
        "💡 Intuisi pengebor: hafalkan “->> untuk nilai, -> untuk fragmen”. Kalau hasil query JSON-mu tiba-tiba 0 baris padahal data ada, cek pertama: apakah kamu memakai -> di WHERE yang seharusnya ->>? Ini bug #1 pemula JSON-SQL di seluruh dunia.",
      ],
      reference: "->> = nilai (untuk WHERE/SUM). -> = fragmen JSON. Path salah → NULL diam-diam, bukan error.",
    },
    {
      id: "konsep-batas",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tiga Batas Kolom JSON — Harga Fleksibilitas",
      prose: [
        "Definisi tiga batas yang harus dihafal sebelum memakai kolom JSON di produksi: (1) INDEX — database tidak bisa meng-index isi JSON secara alami (ada expression index di Postgres/SQLite modern, tetapi itu optimasi lanjutan, bukan default); query WHERE payload ->> '$.status' = 'sukses' atas 100 juta baris = full scan. (2) VALIDASI SKEMA — tidak ada yang mencegah baris berisi {\"nominal\": \"mahal\"} (string, bukan angka) atau field yang tiba-tiba hilang; SUM atas data kotor menghasilkan NULL/bug diam-diam. (3) KETERBACAAN — analis berikutnya harus menebak struktur payload; tidak ada \\d tabel yang menjelaskan field-nya.",
        "Kepribadiannya: tiga batas ini adalah tiga tagihan yang datang belakangan. Tagihan pertama (performa) datang saat data membesar. Tagihan kedua (kualitas) datang saat producer mengubah format tanpa bilang-bilang. Tagihan ketiga (kebingungan) datang saat kamu resign dan penggantimu menatap kolom payload misterius. Laci serbaguna memang praktis — tetapi tagihannya nyata.",
        "Kapan waspada — tiga pola antipattern dari More SQL Antipatterns: (a) menyimpan di JSON padahal field-nya stabil dan di-query rutin → solusinya ekstrak menjadi kolom relasional saat ingest (ETL); (b) JOIN memakai nilai dari dalam JSON (payload ->> '$.user_id' = users.id) → lambat dan tidak ter-index; (c) logika bisnis kritis bergantung pada field JSON yang tidak tervalidasi → satu perubahan producer meruntuhkan laporan tanpa error. Pola sehat: JSON sebagai tempat PENYIMPANAN mentah + kolom hasil ekstrak untuk yang di-query (dual-write saat ingest).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Nanti saja di-index kalau lambat.” Expression index di atas JSON memang ada, tetapi ia mengobati gejala — desain yang benar adalah mempromosikan field yang sering di-query menjadi kolom nyata. Index di atas JSON rapuh: berubah path, index-nya ikut basi secara makna.",
      },
      hints: [
        "💡 Intuisi tagihan: setiap kali menambah field ke JSON yang akan di-WHERE, bayangkan menandatangani tagihan performa masa depan. Tanya: “apakah field ini akan di-query >1×/minggu dalam 6 bulan?” Ya → jadikan kolom relasional SEKARANG, selagi murah.",
      ],
      reference: "Tiga batas: index, validasi skema, keterbacaan. Pola sehat: JSON mentah + kolom ekstrak untuk yang di-query.",
    },
    {
      id: "lab-ekstrak",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Mengebor payload: ekstraksi field",
      prose: [
        "Waktunya praktik. Tabel events berisi 6 webhook event dengan kolom payload JSON. Tugasmu: tampilkan id, tipe_event (dari $.tipe), dan nominal (dari $.nominal) HANYA untuk event bertipe 'pembayaran' yang berstatus 'sukses'. Urutkan id menaik.",
        "Petunjuk: pakai payload ->> '$.tipe' untuk ekstraksi nilai. Ingat jebakan Langkah 4: di WHERE pakai ->> (bukan ->).",
        "Coba: setelah lolos, ganti WHERE menjadi payload -> '$.status' = 'sukses' (satu >) dan jalankan — lihat hasilnya 0 baris. Itulah bug -> vs ->> yang dibahas di Langkah 4, kini kamu melihatnya sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Ekstrak id, $.tipe AS tipe_event, $.nominal AS nominal; filter tipe='pembayaran' AND status='sukses'; ORDER BY id" },
      ],
      sqlLab: {
        task: "Tampilkan id, tipe_event (payload ->> '$.tipe'), dan nominal (payload ->> '$.nominal') untuk event bertipe 'pembayaran' yang berstatus 'sukses'. Urutkan id menaik.",
        schema: C20_SCHEMA,
        seedData: C20_SEED,
        starter: "SELECT\n",
        solution: "SELECT id, payload ->> '$.tipe' AS tipe_event, payload ->> '$.nominal' AS nominal FROM events WHERE payload ->> '$.tipe' = 'pembayaran' AND payload ->> '$.status' = 'sukses' ORDER BY id",
        expectedColumns: ["id", "tipe_event", "nominal"],
        expectedRows: [[1, "pembayaran", 150000], [4, "pembayaran", 750000], [6, "pembayaran", 300000]],
        orderMatters: true,
      },
      reference: "->> untuk nilai. Path salah → NULL diam-diam: verifikasi dengan SELECT sampel.",
    },
    {
      id: "lab-agregasi",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Agregasi menembus JSON bertingkat",
      prose: [
        "Lab kedua menembus dua level: $.meta.kanal. Tugasmu: hitung total nominal event SUKSES per kanal — tampilkan kanal dan total, urutkan kanal alfabetis.",
        "Perhatikan: event pendaftaran (id 3) nominalnya null dan kanalnya mobile — SUM mengabaikan NULL sehingga total mobile tetap benar (150.000 + 750.000 = 900.000). Ini perilaku SQL standar: agregasi mengabaikan NULL, bukan mengubahnya jadi 0.",
        "Coba: setelah lolos, tambahkan COUNT(*) AS n_event ke SELECT — kanal mana yang event suksesnya paling banyak? Apakah kanal dengan event terbanyak juga total nominal terbesar? (Jawaban: mobile 3 event/Rp900rb vs web 1/Rp300rb vs atm 1/Rp500rb — ya, di data kecil ini; di data nyata belum tentu.)",
      ],
      tasks: [
        { id: "t1", text: "GROUP BY kanal (payload ->> '$.meta.kanal'); SUM nominal; filter status='sukses'; ORDER BY kanal" },
      ],
      sqlLab: {
        task: "Tampilkan kanal (payload ->> '$.meta.kanal') dan total nominal (SUM dari payload ->> '$.nominal') untuk event berstatus 'sukses' saja, dikelompokkan per kanal. Urutkan kanal alfabetis.",
        schema: C20_SCHEMA,
        seedData: C20_SEED,
        starter: "SELECT\n",
        solution: "SELECT payload ->> '$.meta.kanal' AS kanal, SUM(payload ->> '$.nominal') AS total FROM events WHERE payload ->> '$.status' = 'sukses' GROUP BY kanal ORDER BY kanal",
        expectedColumns: ["kanal", "total"],
        expectedRows: [["atm", 500000], ["mobile", 900000], ["web", 300000]],
        orderMatters: true,
      },
      reference: "Ekstrak dulu (->>), baru agregasi. SUM mengabaikan NULL — pahami, jangan hafal.",
    },
    {
      id: "chart-waktu",
      eyebrow: "Langkah 8 · Chart",
      title: "Membaca biaya arsitektur: pindah data vs pindah pertanyaan",
      prose: [
        "Chart di bawah membandingkan dua arsitektur untuk pertanyaan yang sama (total pembayaran sukses per kanal, 2 juta event): memindahkan DATA ke analis (download + parse Python) vs memindahkan PERTANYAAN ke data (query JSON di database).",
        "Cara membaca: sumbu Y = menit; batang kiri = download + parse di Python (75 menit); batang kanan = query JSON langsung di database (0,3 menit = ~20 detik).",
        "Interpretasi: selisihnya 250× lipat — dan itu baru waktu. Biaya tersembunyi arsitektur kiri: laptop analis menjadi bottleneck, data 2 juta baris berpindah lewat jaringan (risiko keamanan), dan setiap analis mengulang download yang sama. Pelajaran chart: prinsip komputasi modern — pindahkan PERTANYAAN ke data, bukan data ke pertanyaan. Kolom JSON tidak mengubah prinsip ini; operator ->> adalah kendaraan yang memungkinkan pertanyaan itu diekspresikan di dalam database.",
      ],
      figure: {
        svg: WAKTU_SVG,
        alt: "Diagram batang: download + parse Python 75 menit vs query JSON di database 0,3 menit untuk pertanyaan yang sama atas 2 juta event.",
        caption: "Waktu analisis pertanyaan yang sama (ilustrasi). Pindahkan pertanyaan ke data, bukan data ke pertanyaan.",
      },
      tasks: [],
      reference: "Prinsip: pindahkan pertanyaan ke data. Operator JSON membuat itu mungkin tanpa keluar dari SQL.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Kolom JSON, kolom relasional, atau document database?",
      prose: [
        "Lima skenario penyimpanan data semi-terstruktur:",
        "Skenario 1 — Webhook payment gateway, field berubah tiap sprint, hanya dibaca utuh untuk audit. → Kolom JSON (TEXT/JSONB). Alasan: zona emas JSON — skema berubah-ubah, dibaca utuh, tidak di-WHERE rutin.",
        "Skenario 2 — Field status di dalam JSON mulai dipakai di WHERE 20 laporan. → Promosikan menjadi kolom relasional + index (ekstrak saat ingest). Alasan: tes 10 detik Langkah 3 — field yang di-query rutin bukan penghuni JSON.",
        "Skenario 3 — Aplikasi butuh simpan dokumen utuh + query ad-hoc kompleks + transaksi. → Postgres JSONB. Alasan: JSONB mendukung index (GIN), validasi, dan query kaya — JSON dengan hak-hak relasional.",
        "Skenario 4 — Data murni dokumen (katalog produk dengan atribut liar per kategori), skala besar, tim app-driven. → Document DB (MongoDB dkk.). Alasan: bila 90% akses adalah dokumen utuh dan timnya application developer, paksaan relasional hanya menambah friksi.",
        "Skenario 5 — Sudah terlanjur 100 juta baris JSON dengan WHERE di dalamnya, query lambat. → JANGAN langsung migrasi big-bang: buat kolom hasil ekstrak (generated/stored column) + index untuk field yang paling sering di-query, ukur, baru putuskan migrasi bertahap. Alasan: migrasi 100 juta baris berisiko; generated column memberi 80% manfaat dengan 20% risiko.",
        "Aturan praktis 10 detik: dibaca utuh + skema liar → JSON; di-WHERE/JOIN rutin → kolom relasional; butuh keduanya serius → Postgres JSONB; dokumen murni skala besar → document DB; sudah terlanjur → generated column dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih document DB karena “datanya JSON” padahal 80% query-nya adalah agregasi relasional (GROUP BY, JOIN). Document DB unggul untuk dokumen utuh; untuk analitik relasional, ia justru lebih sulit. Pilih berdasarkan POLA QUERY, bukan format data.",
      },
      reference: "Pilih berdasarkan pola query, bukan format data. Utuh+liar → JSON; rutin di-WHERE → relasional.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Audit webhook gateway: siapa yang salah hitung?",
      prose: [
        "Skenario (sintetis, angka konkret): payment gateway mencatat 1,2 juta event/bulan di kolom payload JSON. Tim finance melaporkan total pembayaran sukses Rp 48,2 miliar; tim risk melaporkan Rp 47,1 miliar — selisih Rp 1,1 miliar. Investigasi menemukan: finance memakai WHERE payload ->> '$.status' = 'sukses'; risk memakai WHERE payload -> '$.status' = 'sukses' (satu >) — yang tidak pernah cocok sehingga risk sebenarnya menghitung dengan filter berbeda yang ia tulis manual di Python (status dari kolom lain). Lebih dalam lagi: 0,3% event tidak punya field nominal sama sekali (payload versi lama), dan 12 event punya nominal berupa string \"150000\" bukan angka.",
        "Pertanyaan analisis: (1) Jelaskan mekanisme selisih Rp 1,1 miliar dari perbedaan satu karakter > itu. (2) Bagaimana menangani 0,3% event tanpa field nominal dan 12 event nominal-string agar totalnya benar? (3) Rekomendasi arsitektur agar insiden ini tidak berulang?",
        "Pembahasan: (1) payload -> '$.status' mengembalikan '\"sukses\"' (dengan kutip JSON) — perbandingan = 'sukses' tidak pernah benar → filter risk kosong → risk fallback ke logika manual berbeda yang menghitung dari sumber lain dengan definisi “sukses” berbeda (mis. tanpa memfilter refund). Selisih Rp 1,1 miliar = beda definisi yang tersembunyi di balik bug satu karakter. (2) Event tanpa nominal: json_extract → NULL → SUM mengabaikannya (benar secara agregat, tetapi catat: 0,3% × 1,2 juta = 3.600 event hilang dari total — laporkan sebagai catatan kaki, bukan diam-diam). Nominal string: CAST(payload ->> '$.nominal' AS INTEGER) setelah validasi — atau lebih baik, perbaiki di producer. (3) Rekomendasi: ekstrak status+nominal menjadi kolom relasional saat ingest (generated column + validasi tipe), kontrak skema dengan tim producer (field wajib, tipe pasti), dan satu definisi “pembayaran sukses” di view/kamus metrik — bukan di query tiap tim.",
        "Kaitan ke risk: selisih Rp 1,1 miliar antar dua tim untuk angka yang sama adalah temuan audit. Akarnya bukan fraud — melainkan tidak adanya kontrak data. Kontrolnya murah (kolom ekstrak + validasi); biaya insidennya mahal (kepercayaan direksi).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bug satu karakter (-> vs ->>) yang tidak error tetapi mengubah angka Rp 1,1 miliar adalah contoh sempurna “silent failure”. Pelajaran untuk analis risiko: query yang tidak error BUKAN berarti query yang benar. Verifikasi dengan rekonsiliasi antar-sumber, bukan dengan tidak-adanya-error.",
      },
      reference: "Silent failure > loud failure. Kontrak skema + kolom ekstrak + satu definisi = obatnya.",
    },
    {
      id: "intuisi-json",
      eyebrow: "Langkah 11 · Intuisi",
      title: "Kolom JSON adalah keputusan skema yang ditunda — dengan bunga",
      prose: [
        "Setiap field yang masuk ke JSON adalah pertanyaan skema yang belum dijawab: “apakah ini atribut stabil atau catatan liar?”",
      ],
      tasks: [],
      note: {
        title: "Intuisi: bila sebuah field mulai di-query, ia sudah bukan penghuni JSON lagi",
        body: "Kolom JSON bekerja dengan baik selama isinya diperlakukan sebagai DOKUMEN: ditulis utuh, dibaca utuh, skemanya liar. Masalah selalu dimulai dengan cara yang sama — seseorang menulis WHERE atas field di dalam JSON “hanya untuk satu laporan”. Satu laporan menjadi dua puluh, dan tiba-tiba kamu punya kolom relasional yang menyamar sebagai JSON: di-filter, di-join, di-agregat, tetapi tanpa index, tanpa tipe, tanpa constraint. Heuristik senior: hitung berapa query yang menyentuh field itu per bulan; bila > 5 dan trennya naik, promosikan menjadi kolom relasional (atau generated column + index) SEKARANG — biayanya hanya naik dari sini. Tes 10 detiknya: “apakah field ini menjawab pertanyaan bisnis yang berulang?” Ya → kolom. Tidak → biarkan di JSON. Dan untuk producer yang mengubah format tanpa pemberitahuan: kontrak skema (atau minimal validasi saat ingest) lebih murah daripada 3 insiden “kok totalnya beda”. JSON memberi kebebasan; kebebasan tanpa kontrak menagih belakangan.",
      },
      reference: "Field yang di-query rutin → promosikan ke kolom; JSON untuk dokumen, bukan untuk atribut.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Kolom JSON tepat untuk skema berubah-ubah yang dibaca utuh (webhook, log); field yang rutin di-WHERE/JOIN harus dipromosikan menjadi kolom relasional + index.",
        "Ekstraksi: ->> mengembalikan NILAI (untuk WHERE/SUM), -> mengembalikan FRAGMEN JSON; path $.meta.kanal menembus dua level; path salah → NULL diam-diam.",
        "Setelah diekstrak, nilai JSON diperlakukan seperti kolom biasa: bisa di-WHERE, GROUP BY, SUM — prinsip “pindahkan pertanyaan ke data”.",
        "Tiga batas JSON: tidak ada index alami (full scan), tidak ada validasi skema (data kotor masuk diam-diam), tidak ada dokumentasi struktur.",
        "Pola sehat: JSON sebagai penyimpanan mentah + kolom hasil ekstrak untuk yang di-query; pilih teknologi berdasarkan pola query, bukan format data.",
      ],
      quiz: [
        {
          q: "Query WHERE payload -> '$.status' = 'sukses' mengembalikan 0 baris padahal data ada. Penyebabnya?",
          options: [
            { text: "Operator -> mengembalikan fragmen JSON '\"sukses\"' (dengan kutip) sehingga tidak pernah sama dengan 'sukses' — harus pakai ->>", why: "Benar: inilah bug #1 JSON-SQL. Tidak error, hanya 0 baris — silent failure yang paling berbahaya.", correct: true },
            { text: "Data JSON-nya corrupt sehingga tidak bisa dibaca", why: "Salah: datanya baik-baik saja — buktinya query dengan ->> mengembalikan hasil. Masalahnya operator, bukan data." },
            { text: "SQLite tidak mendukung operator panah", why: "Salah: SQLite/sql.js mendukung -> dan ->> (JSON1). Keduanya jalan — hanya maknanya berbeda." },
            { text: "Kolom payload harus di-CAST ke JSON dulu", why: "Salah: di SQLite, kolom TEXT berisi JSON valid langsung bisa diquery — tidak perlu cast khusus." },
          ],
        },
        {
          q: "Field status di dalam JSON dipakai di WHERE 20 laporan harian. Keputusan tepat?",
          options: [
            { text: "Promosikan menjadi kolom relasional + index (ekstrak saat ingest) — field yang di-query rutin bukan penghuni JSON", why: "Benar: tes 10 detik Langkah 3. Expression index hanya mengobati gejala; desain yang benar memindahkan field-nya.", correct: true },
            { text: "Biarkan di JSON — kan sudah bisa diquery dengan ->>", why: "Salah: bisa diquery ≠ layak diquery rutin. Full scan atas jutaan baris tiap laporan adalah tagihan performa yang tumbuh." },
            { text: "Pindahkan seluruh database ke MongoDB", why: "Salah: 80% query-nya agregasi relasional — document DB justru lebih sulit untuk itu. Pilih berdasar pola query." },
            { text: "Buat index pada kolom payload utuh", why: "Salah: index pada teks JSON utuh tidak membantu pencarian di dalam path $.status." },
          ],
        },
        {
          q: "Path $.meta.kanal pada payload {\"meta\":{\"kanal\":\"mobile\"}} menghasilkan NULL. Kemungkinan penyebab?",
          options: [
            { text: "Salah ketik path (mis. $.meta.kanall) — path yang tidak ada mengembalikan NULL diam-diam, bukan error", why: "Benar: perilaku NULL-diam-diam ini kenapa verifikasi dengan SELECT sampel wajib sebelum agregasi.", correct: true },
            { text: "Operator ->> tidak bisa menembus dua level", why: "Salah: ->> menembus path bertingkat dengan baik — $.meta.kanal valid dan dipakai di lab 2." },
            { text: "Nilai null di JSON selalu error saat diekstrak", why: "Salah: JSON null diekstrak menjadi SQL NULL — bukan error." },
            { text: "Kutip ganda di JSON tidak didukung SQLite", why: "Salah: JSON standar memakai kutip ganda dan didukung penuh." },
          ],
        },
        {
          q: "SUM(payload ->> '$.nominal') atas data yang 0,3%-nya tidak punya field nominal. Perilaku yang benar?",
          options: [
            { text: "Baris tanpa field → NULL → diabaikan SUM; total benar secara agregat tetapi 3.600 event hilang harus dicatat sebagai catatan kaki laporan", why: "Benar: agregasi mengabaikan NULL (bukan 0). Analis profesional melaporkan cakupan, bukan menyembunyikannya.", correct: true },
            { text: "Query error karena ada NULL", why: "Salah: SUM tidak error atas NULL — ia mengabaikannya. Ini perilaku standar SQL." },
            { text: "NULL dianggap 0 sehingga total tetap tepat", why: "Salah: NULL diabaikan, bukan dianggap 0 — beda untuk COUNT vs SUM vs AVG. Untuk AVG, bedanya material." },
            { text: "Harus menghapus baris-baris itu dulu", why: "Salah: menghapus data mentah menghancurkan audit trail. Catat dan laporkan, jangan hapus." },
          ],
        },
        {
          q: "Tim ingin menyimpan respons API yang strukturnya berubah tiap sprint dan hanya dibaca utuh untuk audit. Pilihan tepat?",
          options: [
            { text: "Kolom JSON — zona emasnya: skema berubah-ubah, dibaca utuh, tidak di-WHERE rutin", why: "Benar: inilah tepat tiga syarat kapan JSON dipakai dari Langkah 3.", correct: true },
            { text: "Satu kolom relasional per field respons API", why: "Salah: tiap sprint tambah field = ALTER TABLE tiap sprint — migrasi skema tanpa akhir untuk data yang tidak diquery." },
            { text: "Simpan sebagai file teks di server", why: "Salah: tidak bisa diquery sama sekali — audit menjadi proyek manual tiap kali." },
            { text: "Satu tabel per versi respons API", why: "Salah: ledakan tabel per versi = mimpi buruk maintenance tanpa manfaat query." },
          ],
        },
      ],
    },
  ],
};
