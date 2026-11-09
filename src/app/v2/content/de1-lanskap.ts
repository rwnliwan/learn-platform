import type { V2Lesson } from "../lib/types";

// Diagram 4 peran: DE -> DA/DS/MLE, aliran data kiri ke kanan.
const PERAN_SVG = `<svg viewBox="0 0 560 190" role="img" aria-label="Diagram empat peran: Data Engineer membangun pipeline, Data Analyst, Data Scientist, dan ML Engineer menggunakannya.">
<defs><marker id="de1a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="14" y="55" width="118" height="80" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="73" y="88" font-size="13" font-weight="600" fill="var(--text)">Data Engineer</text>
<text x="73" y="108" font-size="11" fill="var(--text-muted)">tukang ledeng</text>
<text x="73" y="124" font-size="11" fill="var(--text-muted)">+ arsitek fondasi</text>
<rect x="162" y="20" width="118" height="44" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="221" y="38" font-size="12" font-weight="600" fill="var(--text)">Data Analyst</text>
<text x="221" y="55" font-size="11" fill="var(--text-muted)">detektif</text>
<rect x="162" y="80" width="118" height="44" rx="10" fill="var(--c3)" opacity="0.22" stroke="var(--c3)" stroke-width="2"/>
<text x="221" y="98" font-size="12" font-weight="600" fill="var(--text)">Data Scientist</text>
<text x="221" y="115" font-size="11" fill="var(--text-muted)">peramal</text>
<rect x="162" y="140" width="118" height="44" rx="10" fill="var(--c4)" opacity="0.22" stroke="var(--c4)" stroke-width="2"/>
<text x="221" y="158" font-size="12" font-weight="600" fill="var(--text)">ML Engineer</text>
<text x="221" y="175" font-size="11" fill="var(--text-muted)">insinyur produk</text>
<rect x="330" y="55" width="216" height="80" rx="10" fill="none" stroke="var(--chart-grid)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="438" y="80" font-size="12" font-weight="600" fill="var(--text)">Keputusan &amp; Produk</text>
<text x="438" y="100" font-size="11" fill="var(--text-muted)">dashboard, model, laporan,</text>
<text x="438" y="116" font-size="11" fill="var(--text-muted)">billing, alert risiko</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#de1a)">
<line x1="132" y1="42" x2="158" y2="42"/><line x1="132" y1="102" x2="158" y2="102"/><line x1="132" y1="162" x2="158" y2="162"/>
<line x1="280" y1="42" x2="326" y2="80"/><line x1="280" y1="102" x2="326" y2="102"/><line x1="280" y1="162" x2="326" y2="124"/>
</g>
<text x="73" y="160" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">pipeline</text>
</svg>`;

// Anatomi pipeline 5 tahap + observability.
const PIPELINE_SVG = `<svg viewBox="0 0 640 200" role="img" aria-label="Lima tahap pipeline: Source, Ingest, Transform, Serve, dan Observe yang mengawasi semuanya.">
<defs><marker id="de1b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="10" y="60" width="100" height="70" rx="10" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="60" y="88" font-size="12" font-weight="600" fill="var(--text)">1. Source</text>
<text x="60" y="107" font-size="10" fill="var(--text-muted)">DB, API, file,</text>
<text x="60" y="121" font-size="10" fill="var(--text-muted)">event, sensor</text>
<rect x="140" y="60" width="100" height="70" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="190" y="88" font-size="12" font-weight="600" fill="var(--text)">2. Ingest</text>
<text x="190" y="107" font-size="10" fill="var(--text-muted)">tarik &amp; amankan</text>
<text x="190" y="121" font-size="10" fill="var(--text-muted)">data mentah</text>
<rect x="270" y="60" width="100" height="70" rx="10" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="320" y="88" font-size="12" font-weight="600" fill="var(--text)">3. Transform</text>
<text x="320" y="107" font-size="10" fill="var(--text-muted)">bersihkan, gabung,</text>
<text x="320" y="121" font-size="10" fill="var(--text-muted)">agregasi, uji</text>
<rect x="400" y="60" width="100" height="70" rx="10" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="450" y="88" font-size="12" font-weight="600" fill="var(--text)">4. Serve</text>
<text x="450" y="107" font-size="10" fill="var(--text-muted)">warehouse, mart,</text>
<text x="450" y="121" font-size="10" fill="var(--text-muted)">API, dashboard</text>
<rect x="520" y="20" width="110" height="160" rx="10" fill="none" stroke="var(--error)" stroke-width="1.6" stroke-dasharray="6 4"/>
<text x="575" y="48" font-size="12" font-weight="600" fill="var(--text)">5. Observe</text>
<text x="575" y="68" font-size="10" fill="var(--text-muted)">monitoring,</text>
<text x="575" y="82" font-size="10" fill="var(--text-muted)">alert, lineage,</text>
<text x="575" y="96" font-size="10" fill="var(--text-muted)">data quality</text>
<text x="575" y="120" font-size="10" fill="var(--text-muted)">mengawasi</text>
<text x="575" y="134" font-size="10" fill="var(--text-muted)">tahap 1-4</text>
<text x="575" y="158" font-size="10" fill="var(--error)">tanpanya = buta</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#de1b)">
<line x1="110" y1="95" x2="136" y2="95"/><line x1="240" y1="95" x2="266" y2="95"/><line x1="370" y1="95" x2="396" y2="95"/>
</g>
</svg>`;

export const de1: V2Lesson = {
  slug: "de1-lanskap",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE1 — Data Engineering: Fondasi Semua Analitik",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan yang 100% benar dan 100% salah",
      prose: [
        "Nadia adalah analis terbaik di kantornya. Model churn-nya mencapai AUC 0,91 — angka yang bikin tim data science bertepuk tangan. Dashboard-nya rapi, query-nya bersih, direksi percaya penuh.",
        "Kuartal lalu dashboard Nadia menunjukkan churn turun dari 8% ke 5%. Direksi mengambil keputusan besar: budget tim customer service dipotong 30%, karena 'pelanggan sudah tidak kabur lagi'. Tiga bulan kemudian, revenue anjlok. Pelanggan ternyata kabur lebih banyak dari sebelumnya.",
        "Investigasi menemukan penyebabnya — dan ini twist-nya: query Nadia 100% benar. Tidak ada typo, tidak ada salah join. Yang berubah adalah arti kolom status_aktif di tabel pelanggan: tiga bulan lalu tim produk mengubahnya dari 'sudah bayar bulan ini' menjadi 'pernah login 30 hari terakhir'. Angka churn 5% itu benar secara matematis — dari definisi yang salah.",
        "Tidak ada analis, sehebat apa pun, yang bisa selamat dari fondasi data yang bergeser diam-diam. Lesson ini tentang orang yang menjaga fondasi itu: data engineer.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: kalau query-nya benar, angkanya pasti benar",
        type: "pitfall",
        body: "Query hanya menjawab 'apa yang ditanyakan'. Kalau arti kolom berubah di hulu (source), query yang sama menghasilkan jawaban yang berbeda — tanpa error apa pun. Inilah kenapa data engineering bukan soal menulis SQL yang bagus, melainkan soal menjaga makna data tetap stabil dari hulu ke hilir.",
      },
      reference: "Data engineer = penjaga makna + keandalan data dari sumber sampai keputusan.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan apa itu data engineering dan kapan sebuah tim membutuhkannya.",
        "(1) Membedakan peran DE, DA, DS, dan MLE dari sisi tanggung jawabnya; (2) Menjelaskan anatomi pipeline lima tahap + observe dan peran tiap tahap;",
        "(3) Mendeteksi schema drift dari data mentah dengan skrip sederhana;",
        "(4) Menjawab 'kapan tim butuh data engineer' dengan kriteria ukuran dan kompleksitas — bukan hype.",
      ],
      tasks: [],
    },

    {
      id: "peran",
      eyebrow: "Langkah 3 · Peran",
      title: "DE, DA, DS, MLE: siapa ngapain",
      prose: [
        "Bayangkan restoran. Data Engineer adalah tukang ledeng sekaligus arsitek dapur: memastikan air bersih mengalir, gas tidak bocor, dan setiap koki mendapat bahan yang sama setiap hari. Tanpa dia, koki terbaik pun masak dengan bahan basi.",
        "Data Analyst adalah detektif: 'kenapa penjualan turun minggu lalu?' Data Scientist adalah peramal: 'pelanggan mana yang akan kabur bulan depan?' ML Engineer adalah insinyur produk: 'bagaimana model ini jalan 24 jam di aplikasi?' Dan Data Engineer? Dia yang memastikan ketiganya bekerja di atas data yang sama, segar, dan tepercaya.",
        "💡 Intuisi: analis hebat + data jelek = koki hebat + bahan busuk. Hasilnya tetap tidak bisa dimakan. Kualitas keputusan tidak pernah melampaui kualitas pipeline yang memasoknya.",
        "💡 Intuisi: sekitar 80% waktu proyek data habis di pipeline (menarik, membersihkan, memperbaiki, menunggu), bukan di model. Perusahaan yang hanya merekrut data scientist tanpa data engineer seperti membeli mobil balap tanpa membangun jalan.",
        "Cara membaca: empat kotak peran berurutan — Data Engineer di paling kiri sebagai fondasi, lalu Data Analyst, Data Scientist, ML Engineer di atasnya. Panah mengalir satu arah: dari pipeline yang dibangun DE ke para pengguna.",
        "Interpretasi: DE tidak 'membantu' analis — DE membangun tanah tempat mereka berdiri. Analis yang menunggu CSV manual = fondasi yang belum dibangun. Inilah kenapa DE disebut fondasi semua analitik.",
      ],
      figure: {
        svg: PERAN_SVG,
        alt: "Data Engineer membangun pipeline yang dipakai Data Analyst, Data Scientist, dan ML Engineer untuk menghasilkan keputusan dan produk.",
        caption: "DE membangun fondasi; DA, DS, dan MLE membangun di atasnya.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: data engineer = orang SQL yang rajin",
        type: "pitfall",
        body: "SQL hanyalah salah satu alat. Pekerjaan inti DE adalah reliability engineering untuk data: pipeline harus jalan tiap hari tanpa dimonitor manusia, gagal dengan cara yang aman, bisa diulang (backfill), dan ketahuan saat datanya berubah arti. Itu ilmu sistem, bukan ilmu query.",
      },
      reference: "DE = keandalan + keterulangan + keteramatan (observability) data. DA/DS/MLE = konsumen fondasi itu.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 4 · Anatomi",
      title: "Anatomi pipeline: lima tahap, satu pengawas",
      prose: [
        "Setiap pipeline, dari yang paling sederhana sampai milik raksasa teknologi, punya lima tahap. Source: dari mana data berasal (database aplikasi, API, file, event klik, sensor). Ingest: menarik dan mengamankan data mentah — tahap ini tidak boleh mengubah isi, hanya menyalin dengan setia.",
        "Transform: dapur sesungguhnya — membersihkan, menggabung, mengagregasi, dan menguji. Serve: menyajikan ke warehouse, data mart, API, atau dashboard. Observe: pengawas yang memantau keempat tahap — inilah yang membedakan pipeline mainan dengan pipeline produksi.",
        "Kesegaran data bisa diukur. Kalau dashboard menampilkan data terakhir jam 06:00 dan sekarang jam 09:30, maka keterlambatannya 3,5 jam — terlepas dari seberapa canggih pipeline-nya:",
        "Cara membaca: lima kotak berurutan kiri ke kanan — Source, Ingest, Transform, Serve — plus kotak Observe yang membentang di atas semuanya dengan panah ke tiap tahap. Observe bukan tahap keenam; ia pengawas.",
        "Interpretasi: pipeline tanpa Observe = buta. Empat tahap pertama memindahkan data; Observe memastikan tiap tahap benar-benar bekerja (dan berteriak saat tidak). Kegagalan yang tidak terdeteksi = kegagalan yang tidak ada.",
      ],
      formula: String.raw`F = t_{sekarang} - t_{data}`,
      formulaNote: "F = keterlambatan/kesegaran data (freshness lag); t_sekarang = waktu saat ini; t_data = timestamp data terbaru yang tersedia. SLA umum: dashboard harian F < 24 jam, alert fraud F < 5 menit.",
      figure: {
        svg: PIPELINE_SVG,
        alt: "Lima tahap pipeline: Source, Ingest, Transform, Serve, dan Observe yang mengawasi semuanya.",
        caption: "Observe bukan tahap opsional — tanpanya kamu buta terhadap kegagalan.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: pipeline selesai saat pertama kali berhasil jalan",
        type: "pitfall",
        body: "Run pertama yang sukses hanyalah 10% pekerjaan. 90%-nya adalah hari ke-2 sampai ke-1000: schema berubah, source mati, data telat, definisi bergeser, perlu backfill 3 bulan. Pipeline yang 'selesai' tanpa monitoring dan backfill plan sebenarnya baru setengah jadi.",
      },
      reference: "5 tahap: Source → Ingest → Transform → Serve, diawasi Observe. Freshness F = t_sekarang − t_data.",
    },
    {
      id: "lab-drift",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: detektor schema drift",
      prose: [
        "Kasus Nadia terjadi karena dua hal: kolom berubah nama/arti (schema drift) dan nilai berubah skala diam-diam (semantic drift). Lab ini membangun detektor keduanya — versi mini dari apa yang berjalan di pipeline produksi setiap hari.",
        "Cara membaca: bandingkan daftar kolom kemarin vs hari ini untuk schema drift; bandingkan median nilai untuk semantic drift. Rasio median jauh dari 1,0 berarti satuan atau artinya berubah (contoh: rupiah menjadi ribuan rupiah).",
        "Interpretasi: detektor seperti ini dipasang sebagai quality gate — pipeline berhenti dan mengirim alert sebelum data aneh mencapai dashboard, bukan sesudah direksi mengambil keputusan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `deteksi_drift`: kembalikan kolom yang `hilang` dan yang `muncul`" },
        { id: "t2", text: "Hitung `rasio` median hari ini vs kemarin, dan flag `drift_semantik` (\"YA\" jika rasio < 0,5 atau > 2)" },
        { id: "t3", text: "Cetak keempat nilai dengan `print`" },
      ],
      expected: "hilang=['amount', 'currency'] | muncul=['amount_idr', 'channel'] | rasio_median=0.010 | drift_semantik=YA",
      note: {
        title: "Sering salah",
        body: "Hanya mengecek nama kolom. Schema drift yang paling berbahaya adalah semantic drift: nama kolom sama, arti berubah (seperti status_aktif milik Nadia). Selalu cek distribusi nilai, bukan cuma daftar kolom.",
      },
      hints: [
        "Kolom hilang = ada di lama tapi tidak di baru. Gunakan list comprehension.",
        "Median: statistics.median. Rasio = median_baru / median_lama.",
        "drift_semantik = \"YA\" if rasio < 0.5 or rasio > 2 else \"TIDAK\"",
      ],
      code: {
        starter: `import statistics as st\n\n# Daftar kolom tabel transaksi: kemarin vs hari ini\nkolom_kemarin = ["order_id", "tanggal", "amount", "currency", "status"]\nkolom_hari_ini = ["order_id", "tanggal", "amount_idr", "status", "channel"]\n\n# Nilai kolom amount (sampel 10 baris)\namount_kemarin = [150000, 200000, 175000, 300000, 250000, 180000, 220000, 190000, 210000, 160000]\namount_hari_ini = [1500, 2000, 1750, 3000, 2500, 1800, 2200, 1900, 2100, 1600]\n\n# TULIS KODEMU: deteksi schema drift\ndef deteksi_drift(lama, baru):\n    hilang = \n    muncul = \n    return hilang, muncul\n\nhilang, muncul = deteksi_drift(kolom_kemarin, kolom_hari_ini)\n\n# TULIS KODEMU: deteksi semantic drift via rasio median\nrasio = \ndrift_semantik = \n\nprint(f"hilang={hilang}")\nprint(f"muncul={muncul}")\nprint(f"rasio_median={rasio:.3f}")\nprint(f"drift_semantik={drift_semantik}")`,
        lockLines: 9,
        solution: `import statistics as st\n\n# Daftar kolom tabel transaksi: kemarin vs hari ini\nkolom_kemarin = ["order_id", "tanggal", "amount", "currency", "status"]\nkolom_hari_ini = ["order_id", "tanggal", "amount_idr", "status", "channel"]\n\n# Nilai kolom amount (sampel 10 baris)\namount_kemarin = [150000, 200000, 175000, 300000, 250000, 180000, 220000, 190000, 210000, 160000]\namount_hari_ini = [1500, 2000, 1750, 3000, 2500, 1800, 2200, 1900, 2100, 1600]\n\n# TULIS KODEMU: deteksi schema drift\ndef deteksi_drift(lama, baru):\n    hilang = [c for c in lama if c not in baru]\n    muncul = [c for c in baru if c not in lama]\n    return hilang, muncul\n\nhilang, muncul = deteksi_drift(kolom_kemarin, kolom_hari_ini)\n\n# TULIS KODEMU: deteksi semantic drift via rasio median\nrasio = st.median(amount_hari_ini) / st.median(amount_kemarin)\ndrift_semantik = "YA" if rasio < 0.5 or rasio > 2 else "TIDAK"\n\nprint(f"hilang={hilang}")\nprint(f"muncul={muncul}")\nprint(f"rasio_median={rasio:.3f}")\nprint(f"drift_semantik={drift_semantik}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hilang", value: ["amount", "currency"], label: "`hilang` tepat", msg: "Kolom yang ada kemarin tapi tidak ada hari ini: amount, currency." },
          { kind: "equal", task: "t1", name: "muncul", value: ["amount_idr", "channel"], label: "`muncul` tepat", msg: "Kolom yang muncul hari ini: amount_idr, channel." },
          { kind: "equal", task: "t2", name: "rasio", value: 0.01, tol: 1e-9, label: "`rasio` = 0.010", msg: "median hari ini / median kemarin = 0,01. Satuannya berubah 100x lipat!" },
          { kind: "equal", task: "t2", name: "drift_semantik", value: "YA", label: "flag `drift_semantik` = YA", msg: "Rasio 0,01 jauh di luar batas 0,5–2, jadi flag-nya YA." },
          { kind: "stdout_matches", task: "t3", pattern: "hilang=\\['amount', 'currency'\\]", label: "`print` menampilkan kolom hilang", msg: "Format: hilang=[...]." },
          { kind: "stdout_matches", task: "t3", pattern: "drift_semantik=YA", label: "`print` menampilkan flag", msg: "Baris terakhir: drift_semantik=YA." },
        ],
      },
      reference: "Schema drift = kolom berubah. Semantic drift = arti/nilai berubah. Cek keduanya.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 DE adalah satu-satunya peran data yang pekerjaannya 'selesai' saat orang lain bisa bekerja. Analis yang menunggu CSV manual darimu = pipeline yang belum ada. Ukur dirimu dari waktu-tunggu mereka, bukan dari query-mu.",
        "💡 Schema drift tidak mengumumkan kedatangan. Satu-satunya pertahanan murah: validasi skema di gerbang ingest (kolom, tipe, nullability) — 20 baris kode yang menyelamatkan 20 jam debugging.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: minggu pertama jangan membangun — petakan siapa yang menunggu",
        body: "Insting engineer baru di tim data: langsung membangun pipeline keren. Insting praktisi senior: minggu pertama tidak menulis satu baris pipeline pun — ia memetakan siapa yang menunggu apa. Caranya konkret: tanya setiap analis \"data apa yang kamu tunggu minggu ini, dari siapa, dan lewat apa — email, CSV manual, chat?\". Catat tiga kolom: sumber, penerima, frekuensi. Lalu urutkan dengan rumus kasar: jam-tunggu dikali jumlah-orang dikali frekuensi-per-bulan. Baris teratas itulah backlog pipeline-mu yang sebenarnya — bukan arsitektur impian di whiteboard. Aturan keputusannya tajam: tugas yang berulang lebih dari 3 kali sebulan layak jadi pipeline; yang kurang dari itu biarkan manual, karena otomasi yang jarang dipakai adalah kode yang membusuk. Jebakan klasiknya: membangun lakehouse megah sementara analis masih menunggu CSV lewat email setiap Senin pagi — infrastrukturnya modern, antreannya tetap. Dan satu heuristik umur panjang: setiap pipeline menambah pajak perawatan — monitoring, schema drift, backfill. Engineer yang baik bukan yang membangun paling banyak, melainkan yang memadamkan antrean paling menyakitkan dengan pajak paling kecil. Ukur dirimu dari antrean yang hilang, bukan dari pipeline yang lahir.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan tim butuh data engineer",
      prose: [
        "Tidak semua tim butuh DE full-time sejak hari pertama. Peta ini membantumu memutuskan — salah menilai ke arah mana pun mahal: terlalu dini berarti over-engineering, terlambat berarti insiden seperti Nadia.",
        "Skenario 1 — Satu sumber, satu dashboard, update harian. Kondisi: database aplikasi + query SQL terjadwal. Keputusan: belum butuh DE. Analis + SQL cukup; investasi pipeline akan menganggur.",
        "Skenario 2 — Lima sumber, definisi sering beda. Kondisi: tim produk, marketing, dan finance masing-masing punya arti 'revenue' sendiri. Keputusan: butuh pipeline + kontrak data. Di sinilah drift Nadia lahir; tanpa DE, setiap analis menemukan versinya sendiri.",
        "Skenario 3 — Keputusan butuh data di bawah 1 jam. Kondisi: alert fraud, stok gudang, harga dinamis. Keputusan: butuh infrastruktur streaming + DE yang paham exactly-once. Batch harian tidak akan pernah cukup cepat.",
        "Skenario 4 — Data dipakai untuk uang. Kondisi: billing pelanggan, laporan risiko ke regulator, model kredit. Keputusan: butuh quality gate + lineage + audit. Salah Rp1 di sini berarti denda atau kehilangan kepercayaan.",
        "Aturan praktis 10 detik: kalau data salah bisa bikin perusahaan rugi uang, kena denda, atau salah PHK orang — kamu butuh DE. Kalau risikonya cuma 'dashboard telat sehari', analis cukup.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira 'kita masih startup kecil, belum butuh DE'. Ukurannya bukan jumlah karyawan, melainkan harga kesalahan data. Startup 10 orang yang billing-nya salah Rp500 juta butuh quality gate kemarin sore.",
      },
      reference: "Butuh DE jika: multi-sumber berkonflik, butuh <1 jam, atau data = uang/regulasi.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: harga sebuah dashboard yang salah",
      prose: [
        "Kembali ke kasus Nadia. Dashboard revenue overstate 35% selama 21 hari. Karena 'revenue bagus', direksi meluncurkan diskon ekstra 8% ke semua pelanggan — padahal revenue sebenarnya biasa saja. Revenue benar harian Rp420 juta.",
        "Hitung: berapa rupiah margin yang hilang akibat diskon yang tidak perlu itu? Lalu bandingkan dengan biaya membangun monitoring pipeline dasar (Rp18 juta sekali bangun). Berapa kali lipat kerugiannya dibanding biaya pencegahan?",
        "Interpretasi: angka ini adalah bahasa yang dimengerti direksi. 'Kita butuh data quality' terdengar seperti biaya; 'satu insiden = 39x biaya pencegahannya' terdengar seperti investasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rugi` = revenue harian × hari × diskon ekstra" },
        { id: "t2", text: "Hitung `rasio_biaya` = rugi / biaya monitoring, bulatkan 1 desimal" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "rugi_diskon=Rp705,600,000 | rasio_biaya=39.2x",
      hints: [
        "Rugi = 420_000_000 × 21 × 0,08.",
        "Gunakan round(..., 1) untuk satu desimal.",
        "Format print: f\"rugi_diskon=Rp{rugi:,.0f}\"",
      ],
      code: {
        starter: `# Mini-case Nadia\nrevenue_benar_harian = 420_000_000  # Rp/hari\nhari = 21\ndiskon_ekstra = 0.08  # 8% diskon yang tak perlu\nbiaya_monitoring = 18_000_000  # Rp, sekali bangun\n\n# TULIS KODEMU\nrugi = \nrasio_biaya = \n\nprint(f"rugi_diskon=Rp{rugi:,.0f}")\nprint(f"rasio_biaya={rasio_biaya}x")`,
        lockLines: 5,
        solution: `# Mini-case Nadia\nrevenue_benar_harian = 420_000_000  # Rp/hari\nhari = 21\ndiskon_ekstra = 0.08  # 8% diskon yang tak perlu\nbiaya_monitoring = 18_000_000  # Rp, sekali bangun\n\n# TULIS KODEMU\nrugi = revenue_benar_harian * hari * diskon_ekstra\nrasio_biaya = round(rugi / biaya_monitoring, 1)\n\nprint(f"rugi_diskon=Rp{rugi:,.0f}")\nprint(f"rasio_biaya={rasio_biaya}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "rugi", value: 705600000, tol: 1, label: "`rugi` = Rp705.600.000", msg: "420jt × 21 hari × 8% = 705,6jt." },
          { kind: "equal", task: "t2", name: "rasio_biaya", value: 39.2, tol: 1e-9, label: "`rasio_biaya` = 39.2", msg: "705,6jt / 18jt = 39,2. Satu insiden = 39x biaya pencegahan." },
          { kind: "stdout_matches", task: "t3", pattern: "rugi_diskon=Rp705,600,000", label: "`print` menampilkan rugi", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bahasa direksi: nyatakan kebutuhan DE dalam rupiah risiko, bukan jargon.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Data engineer menjaga makna + keandalan data dari sumber sampai keputusan; analis hebat pun gagal di atas fondasi yang bergeser.",
        "Query yang benar bisa menghasilkan angka yang salah jika arti kolom berubah di hulu — itulah schema/semantic drift.",
        "Lima tahap pipeline: Source → Ingest → Transform → Serve, semuanya diawasi Observe.",
        "Kesegaran data: F = t_sekarang − t_data; tanpa monitoring dan backfill plan, pipeline baru setengah jadi.",
        "Butuh DE ketika: multi-sumber berkonflik, data dibutuhkan <1 jam, atau data dipakai untuk uang/regulasi.",
      ],
      next: { label: "DE2 — Merancang Pipeline: Batch vs Streaming", href: "/v2/learn/de2-pipeline" },
      quiz: [
        {
          q: "Apa akar masalah dashboard Nadia?",
          options: [
            { text: "Query-nya ada typo di JOIN", why: "Investigasi memastikan query 100% benar. Masalahnya bukan di query." },
            { text: "Model churn-nya overfitting", why: "AUC 0,91 bukan masalahnya; model dilatih di atas data yang artinya sudah bergeser." },
            { text: "Arti kolom status_aktif berubah tanpa tercatat", why: "Tepat: semantic drift. Nama kolom sama, definisi berubah dari 'sudah bayar' menjadi 'pernah login' — tanpa error apa pun.", correct: true },
            { text: "Database-nya terlalu lambat", why: "Kecepatan tidak relevan; angkanya keluar cepat dan salah dengan percaya diri." },
          ],
        },
        {
          q: "Mana yang paling tepat menggambarkan peran Data Engineer?",
          options: [
            { text: "Menulis query SQL untuk laporan direksi", why: "Itu pekerjaan analis. DE membangun sistem yang membuat query analis bisa dipercaya." },
            { text: "Reliability engineering untuk data: pipeline jalan tiap hari, gagal dengan aman, bisa diulang, dan terpantau", why: "Tepat. Analogi tukang ledeng: yang dijaga adalah aliran dan keandalannya, bukan isi laporannya.", correct: true },
            { text: "Melatih model machine learning", why: "Itu data scientist / ML engineer — mereka justru konsumen hasil kerja DE." },
            { text: "Mendesain tampilan dashboard", why: "Itu ranah analis/BI. DE memastikan angka di balik tampilannya benar." },
          ],
        },
        {
          q: "Urutan tahap pipeline yang benar adalah…",
          options: [
            { text: "Serve → Transform → Ingest → Source", why: "Terbalik. Data mengalir dari sumber ke penyajian, bukan sebaliknya." },
            { text: "Source → Ingest → Transform → Serve, diawasi Observe", why: "Tepat: tarik mentah dulu, olah, sajikan — dengan pengawas di semua tahap.", correct: true },
            { text: "Ingest → Source → Serve → Transform", why: "Source harus lebih dulu dari Ingest; Transform harus sebelum Serve." },
            { text: "Transform → Ingest → Source → Observe", why: "Tidak bisa mentransformasi data yang belum ditarik dari sumber." },
          ],
        },
        {
          q: "Kenapa 'pipeline berhasil jalan sekali' belum berarti selesai?",
          options: [
            { text: "Karena run pertama selalu gagal", why: "Tidak selalu; run pertama justru sering sukses dan menipu." },
            { text: "Karena 90% pekerjaan adalah hari ke-2 dst: schema berubah, source mati, butuh backfill dan monitoring", why: "Tepat. Pipeline produksi diuji oleh waktu, bukan oleh run pertama.", correct: true },
            { text: "Karena harus ditulis ulang dalam bahasa lain", why: "Bahasa implementasi bukan penentunya; keandalan operasional yang menentukan." },
            { text: "Karena analis belum sempat memakainya", why: "Adopsi analis penting, tapi bukan definisi 'selesai' untuk engineer." },
          ],
        },
        {
          q: "Startup 12 orang, satu database, satu dashboard harian. Butuh data engineer full-time?",
          options: [
            { text: "Ya, setiap perusahaan butuh DE sejak hari pertama", why: "Berlebihan: satu sumber + satu dashboard belum butuh pipeline engineer." },
            { text: "Belum — analis + SQL terjadwal cukup, kecuali datanya dipakai untuk uang/regulasi", why: "Tepat sesuai peta keputusan: ukurannya harga kesalahan, bukan jumlah karyawan.", correct: true },
            { text: "Ya, karena dashboard harian butuh streaming", why: "Dashboard harian = batch harian sudah cukup; streaming untuk kebutuhan <1 jam." },
            { text: "Tidak, startup tidak pernah butuh DE", why: "Terlalu mutlak; startup yang billing-nya bergantung pada data butuh quality gate segera." },
          ],
        },
        {
          q: "Tim dengan 3 analis menghabiskan 2 hari/minggu menunggu CSV manual dari tim IT. Diagnosis DE-nya?",
          options: [
            { text: "Butuh analis ke-4", why: "Menambah analis menambah yang menunggu — bukan yang melayani. Masalahnya pasokan data, bukan jumlah analis." },
            { text: "Butuh pipeline: otomatisasi ingest + validasi skema", why: "Tepat: 2 hari/minggu × 3 analis = 6 hari-kerja/minggu hilang karena proses manual. Pipeline (otomatis + tervalidasi) mengubah waktu-tunggu menjadi waktu-analisis. Inilah definisi kerja DE.", correct: true },
            { text: "Butuh database lebih besar", why: "Ukuran database tidak menyelesaikan proses manual. Masalahnya alur, bukan kapasitas." },
            { text: "Training SQL untuk analis", why: "Analis bisa SQL pun tetap menunggu CSV-nya datang. Skill tidak menggantikan pipa." },
          ],
        },
      ],
    },
  ],
};
