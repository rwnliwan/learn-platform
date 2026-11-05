import type { V2Lesson } from "../lib/types";

// Row-store vs columnar: byte yang dibaca.
const SCAN_SVG = `<svg viewBox="0 0 560 200" role="img" aria-label="Row-store membaca 80 MB, columnar 16 MB, parquet terkompresi 6,4 MB untuk query yang sama.">
<g font-family="var(--font-ui)">
<text x="20" y="30" font-size="12" fill="var(--text)">Query: baca 2 dari 10 kolom, 1 juta baris</text>
<text x="20" y="70" font-size="11" fill="var(--text-muted)">row-store (CSV)</text>
<rect x="150" y="52" width="380" height="22" rx="4" fill="var(--error)" opacity="0.55"/>
<text x="540" y="69" font-size="11" fill="var(--text)" text-anchor="end">80,0 MB</text>
<text x="20" y="110" font-size="11" fill="var(--text-muted)">columnar mentah</text>
<rect x="150" y="92" width="76" height="22" rx="4" fill="var(--c2)" opacity="0.7"/>
<text x="236" y="109" font-size="11" fill="var(--text)">16,0 MB</text>
<text x="20" y="150" font-size="11" fill="var(--text-muted)">parquet + snappy</text>
<rect x="150" y="132" width="30" height="22" rx="4" fill="var(--c3)" opacity="0.85"/>
<text x="190" y="149" font-size="11" fill="var(--text)">6,4 MB</text>
<text x="20" y="185" font-size="12" fill="var(--text)">penghematan: 12,5x — query yang sama, tagihan yang beda</text>
</g></svg>`;

export const de5: V2Lesson = {
  slug: "de5-storage",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE5 — Warehouse vs Lake vs Lakehouse",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Danau yang berubah menjadi rawa",
      prose: [
        "Tahun 2023, 'TokoKita' memutuskan: simpan SEMUA data mentah di data lake. Murah — Rp300 per GB per bulan. Tiga tahun kemudian mereka punya 400 TB: klik, log, backup, file CSV dari 2019 yang tak ada yang ingat isinya. Total tagihan penyimpanan: Rp120 juta per bulan.",
        "Lalu tim analis butuh satu angka: 'total penjualan per kategori bulan lalu'. Query-nya memindai 40 TB file campur aduk selama 6 jam — dan gagal di menit ke-340 karena satu file korup. Tidak ada skema, tidak ada katalog, tidak ada yang tahu file mana yang benar.",
        "Twist-nya: menyimpan itu murah, menemukan itu mahal. Industri punya istilah untuk danau tanpa tata kelola: data swamp — rawa data. Lesson ini tentang memilih 'wadah' yang tepat sebelum danau berubah menjadi rawa.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: data lake = simpan saja, urusan belakangan",
        type: "pitfall",
        body: "Lake tanpa skema, katalog, dan lifecycle policy bukan strategi — melainkan penundaan masalah dengan bunga. Setiap TB yang masuk tanpa metadata adalah utang yang dibayar saat seseorang membutuhkannya (dengan 6 jam query gagal).",
      },
      reference: "Pilih wadah berdasarkan pola baca, bukan harga simpan.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih arsitektur penyimpanan data dengan sadar biaya.",
        "(1) Membedakan warehouse, lake, dan lakehouse dari sisi struktur, biaya, dan use case;",
        "(2) Menjelaskan kenapa format file (Parquet/columnar) adalah keputusan arsitektur — bukan detail;",
        "(3) Mengukur efek columnar vs row-store pada query yang sama;",
        "(4) Mendeteksi kapan 'data lake' berubah menjadi 'data swamp'.",
      ],
      tasks: [],
    },

    {
      id: "tiga-wadah",
      eyebrow: "Langkah 3 · Tiga wadah",
      title: "Warehouse, lake, lakehouse: tiga kepribadian",
      prose: [
        "Data warehouse adalah gudang berlabel rapi: skema ketat saat tulis (schema-on-write), SQL cepat, ACID, mahal. Kepribadiannya: 'pustakawan galak' — semua buku terkatalog, tapi denda keterlambatan mahal. Cocok untuk laporan keuangan dan dashboard yang angkanya harus bisa dipertanggungjawabkan.",
        "Data lake adalah danau liar: simpan apa saja apa adanya (schema-on-read), murah, fleksibel. Kepribadiannya: 'penimbun murah hati' — semua disimpan, tapi mencari jarum di tumpukan jerami. Cocok untuk data mentah, ML training, arsip.",
        "Lakehouse adalah danau berpagar: format terbuka (Delta/Iceberg/Hudi) + transaksi ACID + SQL di atas lake. Kepribadiannya: 'danau yang akhirnya punya satpam dan peta'. Tren industri 2024–2026: satu penyimpanan, dua pola akses.",
        "💡 Intuisi: schema-on-write vs schema-on-read adalah soal KAPAN kamu membayar harga kerapian — di awal (warehouse, mahal tapi aman) atau saat baca (lake, murah dulu, bayar saat query). Tidak ada yang gratis.",
        "💡 Intuisi: tanya 'siapa yang baca dan seberapa sering?' Data yang dibaca 1000x sehari oleh analis → warehouse. Data yang dibaca 2x setahun oleh data scientist → lake. Jawaban atas pertanyaan inilah arsitekturnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: lakehouse berarti tak perlu warehouse lagi",
        type: "pitfall",
        body: "Lakehouse menyatukan penyimpanan, bukan menghapus kebutuhan akan lapisan serving yang cepat dan terkontrol. Banyak arsitektur lakehouse tetap punya 'gold layer' yang berperilaku seperti warehouse. Yang hilang adalah duplikasi data, bukan fungsinya.",
      },
      reference: "Warehouse = kerapian mahal. Lake = fleksibilitas murah. Lakehouse = keduanya di satu penyimpanan.",
    },
    {
      id: "format-file",
      eyebrow: "Langkah 4 · Format",
      title: "Parquet: kenapa format file adalah keputusan arsitektur",
      prose: [
        "CSV menyimpan baris per baris: untuk membaca 2 kolom dari 10, kamu tetap membaca semuanya. Parquet menyimpan kolom per kolom (columnar): query hanya membaca kolom yang dibutuhkan. Untuk analitik (baca sedikit kolom, banyak baris), ini revolusioner.",
        "Ditambah kompresi (Snappy/Zstd): nilai sejenis dalam satu kolom terkompresi jauh lebih baik daripada baris campur aduk. Hasilnya pada 1 juta baris × 10 kolom: row-store 80 MB → columnar 16 MB → parquet+snappy 6,4 MB. 12,5x lebih sedikit byte dibaca.",
        "Cara membaca: tiga bar untuk query yang SAMA (baca 2 dari 10 kolom, 1 juta baris): row-store 80 MB, columnar mentah 16 MB, parquet+snappy 6,4 MB. Bar makin pendek = makin sedikit dibaca = makin murah.",
        "Interpretasi: 12,5x penghematan dari keputusan format file — SEBELUM satu baris kode ditulis. Query yang sama, tagihan yang beda: inilah kenapa format file adalah keputusan arsitektur.",
      ],
      formula: String.raw`R = \frac{C_{total}}{C_{baca}} \times k`,
      formulaNote: "R = rasio penghematan byte; C_total = jumlah kolom tabel; C_baca = kolom yang dibaca query; k = rasio kompresi (≈2,5 untuk Snappy). Contoh: (10/2) × 2,5 = 12,5x.",
      figure: {
        svg: SCAN_SVG,
        alt: "Perbandingan byte dibaca: row-store 80 MB, columnar 16 MB, parquet terkompresi 6,4 MB.",
        caption: "Format file menentukan tagihan query — sebelum kamu menulis satu baris SQL pun.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyimpan data analitik sebagai ribuan file CSV kecil ('biar gampang dibuka di Excel'). Akibatnya: query lambat (tanpa columnar), skema liar (tiap file beda), dan biaya request membengkak. CSV untuk pertukaran, Parquet untuk analitik.",
      },
      reference: "Analitik = columnar (Parquet). R = (C_total/C_baca) × k.",
    },
    {
      id: "lab-scan",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: ukur efek columnar",
      prose: [
        "Lab ini menghitung byte yang dibaca tiga format untuk query yang sama: 2 dari 10 kolom, 1 juta baris, 8 byte per nilai. Tidak ada teori — hanya aritmetika yang menjelaskan kenapa format file adalah keputusan arsitektur.",
        "Cara membaca: bandingkan tiga angka MB. Setiap MB yang tidak dibaca = waktu dan uang yang tidak dibayar.",
        "Interpretasi: di cloud, kamu membayar per byte yang dipindai. Memilih Parquet bukan 'optimasi', melainkan 'tidak membayar 12,5x lipat'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `byte_rowstore` (baca semua kolom)" },
        { id: "t2", text: "Hitung `byte_columnar` dan `byte_parquet` (kompresi 2,5x)" },
        { id: "t3", text: "Hitung `penghematan` (rasio) dan cetak semua dalam MB" },
      ],
      expected: "rowstore_MB=80.0 | columnar_MB=16.0 | parquet_snappy_MB=6.4 | penghematan=12.5x",
      hints: [
        "rowstore = baris × kolom_total × byte_per_nilai.",
        "columnar = baris × kolom_dibaca × byte_per_nilai; parquet = columnar / 2.5.",
        "MB = byte / 1e6; penghematan = rowstore / parquet.",
      ],
      code: {
        starter: `# Query: baca 2 dari 10 kolom, 1 juta baris\nbaris = 1_000_000\nkolom_total = 10\nkolom_dibaca = 2\nbyte_per_nilai = 8\nkompresi = 2.5  # snappy\n\n# TULIS KODEMU\nbyte_rowstore = \nbyte_columnar = \nbyte_parquet = \npenghematan = \n\nprint(f"rowstore_MB={byte_rowstore/1e6:.1f}")\nprint(f"columnar_MB={byte_columnar/1e6:.1f}")\nprint(f"parquet_snappy_MB={byte_parquet/1e6:.1f}")\nprint(f"penghematan={penghematan:.1f}x")`,
        lockLines: 6,
        solution: `# Query: baca 2 dari 10 kolom, 1 juta baris\nbaris = 1_000_000\nkolom_total = 10\nkolom_dibaca = 2\nbyte_per_nilai = 8\nkompresi = 2.5  # snappy\n\n# TULIS KODEMU\nbyte_rowstore = baris * kolom_total * byte_per_nilai\nbyte_columnar = baris * kolom_dibaca * byte_per_nilai\nbyte_parquet = byte_columnar / kompresi\npenghematan = byte_rowstore / byte_parquet\n\nprint(f"rowstore_MB={byte_rowstore/1e6:.1f}")\nprint(f"columnar_MB={byte_columnar/1e6:.1f}")\nprint(f"parquet_snappy_MB={byte_parquet/1e6:.1f}")\nprint(f"penghematan={penghematan:.1f}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "byte_rowstore", value: 80000000, tol: 1, label: "`byte_rowstore` = 80.000.000", msg: "1jt × 10 × 8 = 80jt byte." },
          { kind: "equal", task: "t2", name: "byte_parquet", value: 6400000, tol: 1, label: "`byte_parquet` = 6.400.000", msg: "(1jt × 2 × 8) / 2,5 = 6,4jt byte." },
          { kind: "equal", task: "t3", name: "penghematan", value: 12.5, tol: 1e-9, label: "`penghematan` = 12.5", msg: "80 / 6,4 = 12,5x." },
          { kind: "stdout_matches", task: "t3", pattern: "parquet_snappy_MB=6\\.4", label: "`print` menampilkan 6.4 MB", msg: "Samakan format satu desimal." },
        ],
      },
      reference: "Columnar + kompresi = bayar hanya yang dibaca.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Format file adalah keputusan sekali-bayar-manfaat-selamanya: tulis Parquet sekali, hemat biaya query setiap hari. CSV untuk data >1 GB di lake = membakar uang pelan-pelan.",
        "💡 Tanya 'siapa yang query, seberapa sering' SEBELUM memilih warehouse vs lake. Arsitektur yang benar untuk pola query yang salah = tetap salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: format file adalah keputusan sekali-bayar, tagihan adalah langganan",
        body: "Ada keputusan di data engineering yang hanya dibuat sekali tetapi dibayar setiap hari: format file. Menulis Parquet sekali berarti setiap query selama bertahun-tahun memindai lebih sedikit; membiarkan CSV 5 GB di lake berarti setiap pembaca membayar penuh, selamanya. Heuristiknya: data yang akan dibaca lebih dari 3 kali wajib columnar; data sekali-baca boleh apa saja. Aturan biayanya bekerja di dua sisi: storage murah di lake, tetapi query di warehouse dihitung per byte yang di-scan — maka simpan mentah di lake, sajikan curated di warehouse, dan jangan pernah biarkan keduanya tertukar. Jebakan yang paling sering: \"nanti saja dioptimasi\" untuk tabel 50 TB yang di-scan penuh tiap pagi oleh 3 dashboard; pada titik itu biayanya sudah terlanjur menjadi langganan. Kebiasaan praktisi senior: tiap kuartal, buka daftar 10 tabel termahal — storage plus scan — lalu tanyakan dua hal: masih dibaca siapa, dan bisakah turun tier. Data yang tidak dibaca 90 hari bukan aset, melainkan sewa gudang. Arsitektur storage yang baik bukan yang paling canggih, melainkan yang membuat data panas murah diakses dan data dingin murah disimpan — otomatis, tanpa perlu diingat.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan pilih apa",
      prose: [
        "Skenario 1 — Laporan keuangan & dashboard direksi. Kondisi: butuh SQL cepat, skema ketat, audit. Keputusan: warehouse (atau gold layer lakehouse). Alasan: kebenaran > harga simpan.",
        "Skenario 2 — Arsip log + training ML. Kondisi: tulis sekali, baca jarang, format beragam. Keputusan: lake (Parquet). Alasan: murah; fleksibilitas lebih penting dari kecepatan query.",
        "Skenario 3 — Tim kecil, satu tim data. Kondisi: tidak mau mengoperasikan dua sistem. Keputusan: lakehouse. Alasan: satu penyimpanan, ACID + SQL cukup untuk 80% kebutuhan.",
        "Skenario 4 — Event streaming mentah. Kondisi: data tiba tiap detik, belum tahu akan dipakai untuk apa. Keputusan: lake (landing zone), lalu olah ke warehouse/lakehouse. Alasan: jangan paksa skema pada data yang belum dipahami.",
        "Aturan praktis 10 detik: tulis skema dulu → warehouse. Belum tahu skemanya → lake. Mau keduanya tanpa duplikasi → lakehouse.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih berdasarkan harga storage per GB saja. Storage murah, tapi query mahal (scan) dan waktu engineer mahal (mencari file). Total cost = storage + query + waktu manusia — dan yang terakhir sering terbesar.",
      },
      reference: "Keputusan = pola baca + kebutuhan tata kelola, bukan harga per GB.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: tagihan TokoKita",
      prose: [
        "Hitung ulang tagihan TokoKita dengan angka ilustratif. Data 5 TB. Lake: Rp300/GB/bulan. Warehouse: Rp600/GB/bulan + query Rp75/GB dipindai; 100 query/hari × 50 GB scan = 5 TB scan per hari.",
        "Hitung biaya bulanan keduanya dan rasionya. Lalu jawab jujur: apakah selisih 9,5x berarti lake 'selalu menang'?",
        "Interpretasi: tidak. Selisih itu adalah 'pajak fitur' warehouse: SQL cepat, ACID, governance, dan analis yang tidak menunggu 6 jam. Keputusan arsitektur = fitur apa yang kamu beli dengan selisih itu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_lake` per bulan" },
        { id: "t2", text: "Hitung `biaya_wh` (storage + query 30 hari) dan `rasio`" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "biaya_lake=Rp1,500,000 | biaya_warehouse=Rp14,250,000 | rasio=9.5x",
      hints: [
        "Lake: 5 × 1000 GB × Rp300.",
        "WH storage: 5 × 1000 × Rp600; query: 5 × 1000 × Rp75 × 30.",
        "rasio = round(wh / lake, 1).",
      ],
      code: {
        starter: `# TokoKita: 5 TB data\ntb_gb = 5 * 1000  # dalam GB\n\n# TULIS KODEMU\nbiaya_lake = \nbiaya_wh_storage = \nbiaya_wh_query = \nbiaya_wh = biaya_wh_storage + biaya_wh_query\nrasio = round(biaya_wh / biaya_lake, 1)\n\nprint(f"biaya_lake=Rp{biaya_lake:,}")\nprint(f"biaya_warehouse=Rp{biaya_wh:,}")\nprint(f"rasio={rasio}x")\n# Jawabanmu (komentar): apakah lake selalu menang? Kenapa?`,
        lockLines: 1,
        solution: `# TokoKita: 5 TB data\ntb_gb = 5 * 1000  # dalam GB\n\n# TULIS KODEMU\nbiaya_lake = tb_gb * 300\nbiaya_wh_storage = tb_gb * 600\nbiaya_wh_query = tb_gb * 75 * 30\nbiaya_wh = biaya_wh_storage + biaya_wh_query\nrasio = round(biaya_wh / biaya_lake, 1)\n\nprint(f"biaya_lake=Rp{biaya_lake:,}")\nprint(f"biaya_warehouse=Rp{biaya_wh:,}")\nprint(f"rasio={rasio}x")\n# Jawaban: tidak selalu. Selisih 9,5x membeli SQL cepat, ACID, governance,\n# dan analis yang produktif. Lake menang untuk arsip/ML; warehouse menang\n# untuk serving analitik yang sering dibaca.`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_lake", value: 1500000, tol: 1, label: "`biaya_lake` = Rp1.500.000", msg: "5000 × 300 = 1,5jt." },
          { kind: "equal", task: "t2", name: "biaya_wh", value: 14250000, tol: 1, label: "`biaya_wh` = Rp14.250.000", msg: "3jt storage + 11,25jt query = 14,25jt." },
          { kind: "equal", task: "t2", name: "rasio", value: 9.5, tol: 1e-9, label: "`rasio` = 9.5", msg: "14,25jt / 1,5jt = 9,5x." },
        ],
      },
      reference: "Total cost = storage + query + waktu manusia.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang memilih wadah.",
      ],
      tasks: [],
      summary: [
        "Menyimpan murah, menemukan mahal: lake tanpa tata kelola = data swamp.",
        "Warehouse = schema-on-write, SQL cepat, mahal. Lake = schema-on-read, murah, fleksibel. Lakehouse = satu penyimpanan keduanya.",
        "Format columnar (Parquet) + kompresi: bayar hanya kolom yang dibaca; R = (C_total/C_baca) × k.",
        "Pilih berdasarkan pola baca + tata kelola, bukan harga per GB.",
        "CSV untuk pertukaran; Parquet untuk analitik.",
      ],
      next: { label: "DE6 — Data Modeling: Dimensional & Data Vault", href: "/v2/learn/de6-modeling" },
      quiz: [
        {
          q: "Apa penyebab utama 'data swamp' di TokoKita?",
          options: [
            { text: "Data lake terlalu mahal", why: "Lake justru murah — Rp300/GB. Masalahnya bukan harga." },
            { text: "Data disimpan tanpa skema, katalog, dan lifecycle", why: "Tepat: murah menyimpan + mahal menemukan = rawa. Query 6 jam gagal karena tak ada tata kelola.", correct: true },
            { text: "Terlalu sedikit data", why: "Mereka punya 400 TB — masalahnya kebanyakan tanpa kendali." },
            { text: "Tidak memakai streaming", why: "Streaming tidak relevan dengan masalah keterbacaan arsip." },
          ],
        },
        {
          q: "Kenapa Parquet jauh lebih hemat untuk query analitik dibanding CSV?",
          options: [
            { text: "Karena filenya lebih kecil di disk saja", why: "Ukuran file hanya sebagian cerita; yang utama adalah pola baca." },
            { text: "Columnar: hanya kolom yang dibutuhkan yang dibaca + kompresi per kolom", why: "Tepat: baca 2 dari 10 kolom = 1/5 byte, lalu dibagi kompresi.", correct: true },
            { text: "Karena bisa dibuka di Excel", why: "Justru CSV yang Excel-friendly; Parquet butuh engine." },
            { text: "Karena tidak butuh skema", why: "Parquet menyimpan skema — itu kelebihannya, bukan kekurangannya." },
          ],
        },
        {
          q: "Kapan memilih data lake (bukan warehouse)?",
          options: [
            { text: "Laporan keuangan yang diaudit", why: "Butuh skema ketat + ACID → warehouse." },
            { text: "Arsip log + training ML yang dibaca jarang", why: "Tepat: tulis-sekali-baca-jaran, format beragam → lake murah dan cocok.", correct: true },
            { text: "Dashboard direksi harian", why: "Butuh SQL cepat dan konsisten → warehouse/gold layer." },
            { text: "Data billing pelanggan", why: "Data uang butuh ACID dan governance → warehouse." },
          ],
        },
        {
          q: "Rumus R = (C_total/C_baca) × k. Tabel 20 kolom, query baca 4 kolom, k=2. R = ?",
          options: [
            { text: "10x", why: "Tepat: (20/4) × 2 = 10.", correct: true },
            { text: "5x", why: "Itu baru (20/4); lupa dikali kompresi k=2." },
            { text: "40x", why: "Kebalik: 20×4/2 bukan rumusnya." },
            { text: "2x", why: "Itu hanya faktor kompresi; lupa faktor kolom." },
          ],
        },
        {
          q: "Apa itu 'pajak fitur' warehouse dalam mini-case?",
          options: [
            { text: "Pajak pemerintah untuk cloud", why: "Bukan pajak literal — ini metafora biaya." },
            { text: "Selisih 9,5x yang membeli SQL cepat, ACID, governance, analis produktif", why: "Tepat: mahal bukan berarti buruk; kamu membeli fitur dengan selisih itu.", correct: true },
            { text: "Denda karena memakai lake", why: "Tidak ada denda; ini soal value, bukan hukuman." },
            { text: "Biaya lisensi software", why: "Angka dihitung dari storage + query, bukan lisensi." },
          ],
        },
        {
          q: "Startup menyimpan 5 TB CSV di object storage, query harian scan penuh: tagihan $2.000/bulan. Langkah pertama paling berdampak?",
          options: [
            { text: "Beli reserved capacity", why: "Diskon 30% dari $2.000 = masih $1.400 untuk query yang boros. Diskon tidak memperbaiki pemborosan." },
            { text: "Konversi ke Parquet + partisi tanggal", why: "Tepat: columnar (baca 2 dari 50 kolom) + pruning partisi (baca 7 dari 365 hari) = penghematan 10-200x SEBELUM negosiasi harga. Format dulu, diskon kemudian.", correct: true },
            { text: "Pindah cloud provider", why: "Migrasi mahal dan tagihan scan-penuh ikut pindah. Masalahnya pola akses, bukan logo provider." },
            { text: "Hapus data lama", why: "Menghapus data = menghapus aset perusahaan untuk menutupi inefisiensi. Opsi terakhir, bukan pertama." },
          ],
        },
        {
          q: "Tim ML butuh data mentah fleksibel; tim BI butuh query cepat terstruktur. Arsitektur yang jujur?",
          options: [
            { text: "Satu warehouse untuk semua", why: "Warehouse memaksa skema di tulis — ML yang butuh mentah fleksibel akan tersiksa (atau bypass ke CSV liar)." },
            { text: "Lakehouse: bronze mentah untuk ML, gold terstruktur untuk BI", why: "Tepat: satu platform, dua zona. Bronze menyimpan mentah (fleksibel untuk ML); gold menyajikan terstruktur (cepat untuk BI). Medallion = kedua tim dilayani tanpa dua sistem.", correct: true },
            { text: "Dua sistem terpisah penuh", why: "Dua sistem = dua biaya + masalah sinkronisasi ('kenapa angka ML beda dengan BI?'). Mahal dan membingungkan." },
            { text: "CSV di shared folder", why: "Itu 'data swamp' — bukan arsitektur. 5 TB CSV = tagihan + kekacauan." },
          ],
        },
      ],
    },
  ],
};
