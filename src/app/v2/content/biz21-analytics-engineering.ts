import type { V2Lesson } from "../lib/types";

// ── Figure: lapisan dbt staging → intermediate → mart ────────────────────
const LAPISAN_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Diagram lapisan data dbt: staging, intermediate, mart">
<g font-size="12" font-family="var(--font-ui)">
<rect x="30" y="30" width="130" height="60" rx="8" fill="var(--chart-text)" opacity="0.35"/>
<text x="95" y="54" text-anchor="middle" fill="var(--text)">raw.*</text>
<text x="95" y="72" text-anchor="middle" font-size="10" fill="var(--text-muted)">sumber apa adanya</text>
<rect x="30" y="110" width="130" height="60" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="95" y="134" text-anchor="middle" fill="#fff">stg_*</text>
<text x="95" y="152" text-anchor="middle" font-size="10" fill="#fff">bersih 1:1 per sumber</text>
<rect x="195" y="110" width="130" height="60" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="260" y="134" text-anchor="middle" fill="#fff">int_*</text>
<text x="260" y="152" text-anchor="middle" font-size="10" fill="#fff">gabung & hitung antar</text>
<rect x="360" y="110" width="130" height="60" rx="8" fill="var(--c1)" opacity="0.9"/>
<text x="425" y="134" text-anchor="middle" fill="#fff">mart_*</text>
<text x="425" y="152" text-anchor="middle" font-size="10" fill="#fff">siap konsumsi BI</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.5" opacity="0.7">
<line x1="160" y1="140" x2="195" y2="140"/>
<line x1="325" y1="140" x2="360" y2="140"/>
<line x1="95" y1="90" x2="95" y2="110"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="30" y="200">aturan: raw tidak boleh dibaca dasbor; mart hanya boleh baca int_/stg_</text>
<text x="30" y="218">setiap panah = SELECT yang bernama, berversion, dan bertes</text>
</g>
</svg>`;

export const biz21: V2Lesson = {
  slug: "biz21-analytics-engineering",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI21 — Analytics Engineering & dbt untuk BI",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Ada pekerjaan di tim data yang tidak cocok disebut data engineering (ia tidak membangun pipeline infrastruktur) dan tidak cocok disebut analis (ia tidak menjawab pertanyaan bisnis) — tapi tanpa pekerjaan ini, semua dashboard rapuh. Namanya analytics engineering, dan senjata utamanya dbt.",
        "Rute lesson: cerita → siapa itu analytics engineer → dbt sebagai gagasan (model, DAG) → tes data sebagai kontrak → lapisan staging–intermediate–mart → lab (tes atas data nyata tertanam) → dampaknya untuk tim BI → kapan dbt berlebihan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan peran analytics engineer di antara data engineering dan analis; (2) membaca arsitektur model dbt (staging → intermediate → mart) dan DAG ketergantungannya; (3) menulis tes data (unik, tidak null, nilai diterima, relasi) sebagai kontrak kualitas; (4) menilai apakah suatu tim perlu dbt atau cukup dengan yang lebih ringan.",
      ],
      tasks: [],
      reference: "Analytics engineer = pemilik keandalan angka yang disajikan ke bisnis.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Angka yang berubah padahal tidak ada yang menyentuhnya",
      prose: [
        "Senin pagi, 09:40. Di ruang rapat lantai 14 sebuah bank digital, kepala cabang wilayah timur menunjuk ke layar: “Pendapatan bulan ini Rp48,2 miliar — minggu lalu masih Rp52,5 miliar. Ada yang mengubah dasbor saya?” Tim BI mengecek: dasbornya tidak disentuh siapa pun selama tiga bulan. Querynya tidak berubah. Tapi angkanya turun 8% — Rp4,3 miliar lenyap tanpa jejak.",
        "Twist-nya: yang berubah bukan dasbor, melainkan SATU baris SQL di tabel transformasi hulu — seorang analis “memperbaiki” definisi pendapatan (mengeluarkan pendapatan fee yang selama ini ikut dihitung) lalu menjalankan ulang pipeline malam itu. Tidak ada yang salah dengan niatnya; yang salah adalah tidak ada yang TAHU ia melakukannya. Tidak ada tes yang memvalidasi hasil, tidak ada catatan versi, tidak ada persetujuan — dasbor hanya menampilkan apa yang diberi makan.",
        "Insiden ini punya nama di industri: transformasi tanpa kontrak. Solusinya juga punya nama: analytics engineering dengan dbt — transformasi ditulis sebagai model berversion, setiap perubahan bisa ditelusuri, dan tes otomatis menjerat perubahan diam-diam sebelum sampai ke dasbor. Lesson ini mengajarkan pola pikirnya: angka yang tidak bisa dilacak asal-usulnya bukan angka bisnis, melainkan rumor.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: yang rusak adalah dasbornya",
        type: "pitfall",
        body: "“Dasbornya salah.” Dalam kasus seperti ini, dasbornya benar menampilkan data yang salah. Menyalahkan lapisan presentasi adalah refleks yang selalu menunjuk ke tempat yang salah — 90% “bug dasbor” adalah bug data di hulu.",
      },
      reference: "Masalah: perubahan transformasi tanpa versi, tes, dan jejak audit.",
    },
    {
      id: "disiplin",
      eyebrow: "Langkah 3 · Konsep",
      title: "Analytics engineering: disiplin di antara dua dunia",
      prose: [
        "Data engineer berpikir dalam infrastruktur: seberapa cepat data sampai, seberapa murah disimpan, seberapa andal pipelinenya. Analis berpikir dalam pertanyaan: berapa churn bulan ini, segmen mana yang tumbuh. Keduanya benar, tapi di antara keduanya ada jurang: data mentah yang sampai ke warehouse belum tentu layak ditanya — kolom tidak konsisten, definisi berubah, duplikat menyelinap.",
        "Analytics engineer mengisi jurang itu. Ia menulis transformasi — SELECT yang mengubah data mentah menjadi tabel bersih — TAPI dengan disiplin software engineering: kode berversion di Git, direview sejawat, dites otomatis, dan bisa di-run ulang dari nol. Analis biasa menulis query sekali pakai; analytics engineer menulis query yang harus benar setiap hari selama bertahun-tahun.",
        "💡 Intuisi: kalau data engineer membangun jalan tol dan analis mengendarai mobilnya, analytics engineer adalah dinas perhubungan — ia memasang rambu, marka, dan memastikan peta jalannya bisa dipercaya. Tanpa dia, jalannya ada tapi orang tersesat.",
        "Pola kerjanya selalu sama: raw data masuk → dibersihkan menjadi model → model diuji → model dikonsumsi BI. Satu orang bisa merangkap peran ini di tim kecil, tapi fungsinya harus ada: seseorang yang bertanggung jawab atas KEBENARAN transformasi, bukan hanya keberhasilannya jalan.",
      ],
      tasks: [
        { id: "t1", text: "Tuliskan dalam satu kalimat: apa beda output seorang analis dengan output seorang analytics engineer?" },
      ],
      expected: "Analis menjawab pertanyaan (sekali pakai); analytics engineer membangun tabel/transformasi yang bisa diandalkan berulang-ulang.",
      reference: "Jurang antara ‘data sampai’ dan ‘data layak ditanya’ diisi analytics engineer.",
    },
    {
      id: "dbt-model",
      eyebrow: "Langkah 4 · Konsep",
      title: "dbt: model adalah SELECT yang bernama",
      prose: [
        "dbt (data build tool) adalah alat yang mempopulerkan disiplin ini. Gagasannya sederhana sampai terasa sepele: setiap transformasi ditulis sebagai SATU file berisi SATU query SELECT, diberi nama, dan dbt menjalankannya dalam urutan yang benar lalu menyimpannya sebagai tabel/view. File `stg_penjualan.sql` berisi `SELECT ... FROM raw_penjualan` — tidak lebih, tidak kurang.",
        "Kekuatan sebenarnya ada di DAG (directed acyclic graph): dbt membaca query-mu, menemukan bahwa `mart_pendapatan` membaca dari `int_penjualan` yang membaca dari `stg_penjualan`, lalu membangun graf ketergantungan otomatis. Ubah satu model di hulu, dbt tahu persis model mana di hilir yang harus dihitung ulang — dan mana yang tidak terdampak. Tidak ada lagi “jalankan ulang semuanya, biar aman”.",
        "Dokumentasi pun menyatu dengan kode: deskripsi kolom ditulis di file YAML di samping model, dan dbt menghasilkannya menjadi situs dokumentasi lengkap dengan graf lineage — peta “angka ini berasal dari mana”. Ingat cerita langkah 2? Dengan dbt, perubahan Rp4,3 miliar itu akan tercatat: siapa mengubah, kapan, dan tes mana yang menangkapnya.",
        "Cara membaca DAG dbt: node = model (tabel), panah = “dibaca oleh”. Model tanpa panah masuk = sumber (staging). Model yang dibaca dasbor = mart. Jika dua dasbor menampilkan angka berbeda untuk metrik yang sama, ikuti panah mundur sampai ke node tempat definisinya bercabang — di sanalah bugnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: dbt itu ETL tool",
        type: "pitfall",
        body: "“dbt itu ETL tool.” Bukan — dbt hanya mengerjakan huruf T (Transform) di dalam warehouse. Extract dan Load dikerjakan tool lain. dbt berasumsi datanya SUDAH ada di warehouse; ia tidak menarik data dari API atau file.",
      },
      reference: "Model = SELECT bernama berversion. DAG = peta ketergantungan otomatis.",
    },
    {
      id: "tes-data",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tes data: kontrak, bukan sekadar cek",
      prose: [
        "Di software engineering, tes menjawab: “apakah kode ini masih berperilaku seperti yang dijanjikan?” Di analytics engineering, tes menjawab: “apakah DATA ini masih berbentuk seperti yang dijanjikan?” Empat tes skema yang paling sering dipakai di dbt:",
        "Pertama, `unique`: kolom yang seharusnya unik (mis. id_transaksi) benar-benar unik — menangkap duplikat dari sumber yang mengirim ulang data. Kedua, `not_null`: kolom yang tidak boleh kosong (tanggal_transaksi) memang terisi — menangkap baris setengah jadi. Ketiga, `accepted_values`: kolom status hanya berisi nilai yang dikenal (lunas, refund) — menangkap nilai baru misterius seperti “pending” yang lolos validasi sumber. Keempat, `relationships`: setiap pelanggan_id di tabel penjualan ADA di tabel pelanggan — menangkap join yang akan menghasilkan NULL diam-diam.",
        "Kuncinya: tes ditulis SEBELUM masalah terjadi, sebagai kontrak. Kontrak berbunyi: “tabel mart_penjualan berjanji id-nya unik, tanggalnya terisi, statusnya dikenal, dan pelanggan_id-nya valid.” Ketika kontrak dilanggar, pipeline GAGAL dengan pesan yang jelas — bukan lolos diam-diam lalu meracuni dasbor. Itulah bedanya dengan cerita langkah 2: di sana tidak ada kontrak, jadi perubahan lolos.",
        "💡 Intuisi: tes data seperti alarm kebakaran — nilainya bukan saat berbunyi, tapi saat diam. Dasbor yang angkanya stabil selama setahun BUKAN bukti data sehat; bukti data sehat adalah serangkaian tes yang berjalan setiap hari dan semuanya lolos.",
      ],
      tasks: [
        { id: "t1", text: "Tabel klaim asuransi punya kolom no_polis. Tes skema apa yang paling tepat untuk kolom ini, dan pelanggaran apa yang ia tangkap?" },
      ],
      expected: "unique + relationships ke tabel polis: menangkap duplikat klaim dan klaim atas polis yang tidak ada.",
      reference: "Empat tes dasar: unique, not_null, accepted_values, relationships.",
      note: {
        title: "🚨 Mitos: tes data cukup ditulis sekali, lalu beres",
        type: "pitfall",
        body: "Yang benar: tes hanya bernilai bila DIJALANKAN — sebagai bagian dari setiap build, bukan artefak sekali tulis. Contoh: tim menulis tes accepted_values untuk kolom status di mart_penjualan, tapi tes itu hanya dijalankan manual oleh penulisnya; tiga bulan kemudian sumber mengirim nilai “pending”, tidak ada yang menjalankan tesnya, dan dasbor menampilkan “pending” dua minggu tanpa ada yang sadar. Di dbt, tes dieksekusi otomatis setiap model dibangun (dbt build / dbt test di CI). Heuristiknya: kalau kamu tidak tahu kapan terakhir kali tes dijalankan, anggap tes itu tidak ada.",
      },
    },
    {
      id: "lapisan",
      eyebrow: "Langkah 6 · Konsep",
      title: "Staging → intermediate → mart: kebersihan berlapis",
      prose: [
        "Konvensi lapisan dbt yang paling umum: staging (stg_) membersihkan SATU sumber apa adanya — ganti nama kolom, perbaiki tipe, buang baris sampah. Tidak ada join lintas sumber di sini. Intermediate (int_) menggabungkan beberapa staging dan menghitung logika bisnis antar-tabel — di sinilah definisi “pendapatan” ditulis SEKALI. Mart (mart_) adalah tabel final yang dibaca dasbor — ramping, terdokumentasi, dan stabil strukturnya.",
        "Kenapa tiga lapis, bukan langsung raw → mart? Karena perubahan terlokalisasi. Sumber mengubah nama kolom? Hanya stg_ yang berubah. Definisi pendapatan berubah? Hanya int_ yang berubah, dan mart_ ikut benar otomatis lewat DAG. Tanpa lapisan, satu perubahan kecil memaksa membedah satu query raksasa 800 baris — tempat bug bersembunyi.",
        "Cara membaca diagram lapisan: kotak bawah = mentah, kotak tengah = bersih per sumber dan gabungan, kotak atas = siap konsumsi. Aturan kerasnya dua: (1) dasbor TIDAK BOLEH membaca raw atau stg_ — hanya mart_; (2) mart_ TIDAK BOLEH membaca raw langsung — harus lewat stg_/int_. Melanggar aturan ini = membangun jalan pintas yang suatu hari akan runtuh.",
        "Mart yang baik punya tiga sifat: satu mart melayani satu kebutuhan analisis (mart_pendapatan, bukan mart_serba_ada), kolomnya punya definisi tertulis, dan strukturnya jarang berubah — dasbor boleh bergantung padanya tanpa takut.",
      ],
      figure: {
        svg: LAPISAN_SVG,
        alt: "Diagram lapisan: raw, staging, intermediate, mart dengan panah ketergantungan.",
        caption: "Cara membaca: panah = dibaca oleh. Interpretasi: mart_ hanya boleh dibaca dasbor dan hanya boleh membaca int_/stg_ — aturan inilah yang membuat perubahan terlokalisasi.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: intermediate itu lapisan buang-buang",
        body: "Mitos: mart boleh langsung baca staging — memangkas intermediate membuat pipeline lebih cepat dan sederhana. Yang benar: intermediate adalah satu-satunya tempat logika bisnis ditulis SEKALI (definisi “pendapatan”, join antar-sumber); tanpanya, logika yang sama disalin ke tiap mart dan definisinya menyimpang diam-diam — persis masalah yang membuat profesi analytics engineer lahir.",
        type: "pitfall",
      },
      reference: "Tiga lapis: stg_ (bersih per sumber), int_ (logika bisnis), mart_ (siap konsumsi BI).",
    },
    {
      id: "lab-tes",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: jalankan tes data di atas mart",
      prose: [
        "Sekarang kamu jadi analytics engineer-nya. Di bawah ada data `mart_penjualan` (5 baris, disengaja kotor) dan `mart_pelanggan` (2 baris). DAG-nya: stg_penjualan → int_penjualan → mart_penjualan, dan dasbor_pendapatan membaca mart_penjualan.",
        "Tugasmu: implementasikan 4 tes skema dan laporkan (1) tes mana saja yang GAGAL, (2) nilai bermasalahnya, (3) model hilir apa yang terdampak. Tes: `unik` (id unik?), `tidak_null` (tanggal terisi?), `nilai_diterima` (status hanya lunas/refund?), `relasi` (setiap pelanggan_id ada di mart_pelanggan?).",
        "Aturan main: `hasil` adalah dict nama_tes → daftar nilai bermasalah (kosong bila lolos). `daftar_gagal` berisi nama tes yang gagal. `dampak` berisi nama model/dasbor yang terdampak oleh kegagalan ini.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan 4 tes dan isi `hasil` dengan nilai bermasalah tiap tes" },
        { id: "t2", text: "Isi `daftar_gagal` (nama tes yang gagal) dan `jumlah_gagal`" },
        { id: "t3", text: "Isi `dampak` — model/dasbor hilir yang terdampak" },
        { id: "t4", text: "Cetak ringkasan: jumlah tes gagal dan yang terdampak" },
      ],
      expected: "TES GAGAL: 4 dari 4 / TERDAMPAK: dasbor_pendapatan",
      hints: [
        "unik: kumpulkan id, cari yang muncul lebih dari sekali.",
        "relasi: pelanggan_id harus ada di {p['id'] for p in mart_pelanggan}.",
        "dampak: ikuti panah DAG — dasbor_pendapatan membaca mart_penjualan.",
      ],
      code: {
        starter: `# Data tertanam (sengaja kotor) — JANGAN ubah blok ini\nmart_penjualan = [\n    {"id": "T1", "tanggal": "2026-09-01", "pelanggan_id": "P1", "status": "lunas",  "nilai": 2000000},\n    {"id": "T2", "tanggal": "2026-09-02", "pelanggan_id": "P9", "status": "lunas",  "nilai": 1500000},\n    {"id": "T3", "tanggal": None,         "pelanggan_id": "P1", "status": "lunas",  "nilai": 3000000},\n    {"id": "T2", "tanggal": "2026-09-04", "pelanggan_id": "P2", "status": "lunas",  "nilai": 500000},\n    {"id": "T4", "tanggal": "2026-09-05", "pelanggan_id": "P2", "status": "pending","nilai": 750000},\n]\nmart_pelanggan = [\n    {"id": "P1", "nama": "PT Maju"},\n    {"id": "P2", "nama": "CV Berkah"},\n]\n# DAG: stg_penjualan -> int_penjualan -> mart_penjualan -> dasbor_pendapatan\n# TULIS KODEMU DI BAWAH INI\n\nhasil = {}\ndaftar_gagal = []\njumlah_gagal = 0\ndampak = []\n\nprint(f"TES GAGAL: {jumlah_gagal} dari 4")\nprint(f"TERDAMPAK: {', '.join(dampak)}")`,
        lockLines: 12,
        solution: `# Data tertanam (sengaja kotor) — JANGAN ubah blok ini\nmart_penjualan = [\n    {"id": "T1", "tanggal": "2026-09-01", "pelanggan_id": "P1", "status": "lunas",  "nilai": 2000000},\n    {"id": "T2", "tanggal": "2026-09-02", "pelanggan_id": "P9", "status": "lunas",  "nilai": 1500000},\n    {"id": "T3", "tanggal": None,         "pelanggan_id": "P1", "status": "lunas",  "nilai": 3000000},\n    {"id": "T2", "tanggal": "2026-09-04", "pelanggan_id": "P2", "status": "lunas",  "nilai": 500000},\n    {"id": "T4", "tanggal": "2026-09-05", "pelanggan_id": "P2", "status": "pending","nilai": 750000},\n]\nmart_pelanggan = [\n    {"id": "P1", "nama": "PT Maju"},\n    {"id": "P2", "nama": "CV Berkah"},\n]\n# DAG: stg_penjualan -> int_penjualan -> mart_penjualan -> dasbor_pendapatan\n# TULIS KODEMU DI BAWAH INI\n\nids = [r["id"] for r in mart_penjualan]\nhasil = {\n    "unik": sorted({i for i in ids if ids.count(i) > 1}),\n    "tidak_null": [r["id"] for r in mart_penjualan if r["tanggal"] is None],\n    "nilai_diterima": sorted({r["status"] for r in mart_penjualan} - {"lunas", "refund"}),\n    "relasi": sorted({r["pelanggan_id"] for r in mart_penjualan} - {p["id"] for p in mart_pelanggan}),\n}\ndaftar_gagal = [nama for nama, bermasalah in hasil.items() if bermasalah]\njumlah_gagal = len(daftar_gagal)\ndampak = ["dasbor_pendapatan"] if daftar_gagal else []\n\nprint(f"TES GAGAL: {jumlah_gagal} dari 4")\nprint(f"TERDAMPAK: {', '.join(dampak)}")`,
        checks: [
          { kind: "defined", task: "t1", name: "hasil", label: "`hasil` terdefinisi", msg: "Isi dict hasil dengan 4 tes." },
          { kind: "equal", task: "t2", name: "daftar_gagal", value: ["unik", "tidak_null", "nilai_diterima", "relasi"], label: "`daftar_gagal` berisi 4 tes", msg: "Keempat tes gagal pada data ini — urutan: unik, tidak_null, nilai_diterima, relasi." },
          { kind: "equal", task: "t2", name: "jumlah_gagal", value: 4, label: "`jumlah_gagal` = 4", msg: "Hitung dari panjang daftar_gagal." },
          { kind: "equal", task: "t1", name: "hasil", value: {"unik": ["T2"], "tidak_null": ["T3"], "nilai_diterima": ["pending"], "relasi": ["P9"]}, label: "`hasil` berisi nilai bermasalah yang tepat", msg: "unik: T2 ganda; tidak_null: T3 tanpa tanggal; nilai_diterima: pending; relasi: P9 tak terdaftar." },
          { kind: "stdout_matches", task: "t4", pattern: "TES GAGAL: 4 dari 4", label: "Output menampilkan jumlah tes gagal", msg: "Samakan format print dengan contoh." },
          { kind: "stdout_matches", task: "t4", pattern: "TERDAMPAK: dasbor_pendapatan", label: "Output menampilkan dampak", msg: "Ikuti panah DAG dari mart_penjualan." },
        ],
      },
      reference: "Tes sebagai kontrak: pelanggaran = pipeline gagal dengan pesan jelas.",
    },
    {
      id: "dampak-bi",
      eyebrow: "Langkah 8 · Konsep",
      title: "Dampaknya untuk tim BI: satu definisi, jejak yang jelas",
      prose: [
        "Bagi analis, mart yang bersih dan bertes berarti satu hal besar: definisi metrik ditulis SEKALI di int_ dan dipakai semua mart. “Pendapatan” di dasbor cabang dan “pendapatan” di laporan direksi berasal dari model yang sama — perang definisi seperti di lesson semantic layer tidak perlu terjadi dua kali.",
        "Lineage mengubah cara debugging. Dulu: “angka ini aneh, tolong cek.” Sekarang: buka graf dbt, klik mart_pendapatan, lihat panah mundur — oh, int_penjualan diubah kemarin oleh Rina, dan tes `nilai_diterima` gagal. Waktu investigasi turun dari hitungan hari menjadi hitungan menit, dan yang lebih penting: percakapannya berubah dari menyalahkan menjadi menelusuri.",
        "Perubahan model pun terverifikasi SEBELUM sampai ke dasbor: dbt menjalankan tes setiap kali model dibangun ulang. Analis yang ingin “memperbaiki” definisi pendapatan (seperti di cerita) akan melihat pipeline-nya MERAH sebelum dasbor sempat berubah — persis alarm yang hilang di cerita langkah 2.",
        "💡 Intuisi: analytics engineering mengubah BI dari “percaya lalu kecewa” menjadi “verifikasi lalu percaya”. Dasbor tetap wajahnya, tapi di baliknya sekarang ada kontrak tertulis yang dijaga mesin.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: sudah pakai dbt = data pasti benar",
        type: "pitfall",
        body: "“Kalau sudah pakai dbt, data pasti benar.” dbt hanya menjalankan tes YANG KAMU TULIS. Tabel tanpa tes = kontrak kosong = kepercayaan buta. dbt memberi kerangkanya; kejujuran datanya tetap tanggung jawab manusia.",
      },
      reference: "Manfaat BI: definisi tunggal, lineage untuk debugging, perubahan terverifikasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Kapan dbt perlu, kapan berlebihan",
      prose: [
        "Skenario 1 — Tim 5+ analis, 3+ sumber data, dasbor dipakai direksi: PAKAI dbt (atau pola setaranya). Kompleksitas transformasi sudah cukup untuk membenarkan disiplin versi + tes + lineage.",
        "Skenario 2 — Satu analis, satu sumber (mis. satu database aplikasi), 5 dasbor: dbt BERLEBIHAN. Biaya belajar dan operasionalnya lebih besar dari manfaatnya. Cukup: query terdokumentasi + satu tabel mart manual + tes sederhana.",
        "Skenario 3 — Startup yang baru mulai, data berubah tiap minggu: pola dbt RINGAN. Pakai konvensi lapisan dan tes dasar, tapi jangan birokratiskan review untuk setiap perubahan kecil — kecepatan belajar lebih berharga dari kesempurnaan.",
        "Skenario 4 — Perusahaan teregulasi (bank, asuransi): dbt atau setara HAMPIR WAJIB. Jejak audit “angka ini berasal dari transformasi versi sekian, lolos tes sekian” adalah kebutuhan kepatuhan, bukan kemewahan.",
        "Aturan praktis 10 detik: (1) kalau definisi metrik pernah diperdebatkan lebih dari sekali → butuh kontrak (tes + versi); (2) kalau transformasi hanya kamu yang paham → butuh dokumentasi menyatu kode; (3) kalau tim < 3 orang dan sumber tunggal → mulai dari pola ringan, naikkan saat sakitnya terasa.",
      ],
      tasks: [],
      reference: "Proporsional: disiplinnya wajib, berat alatnya menyesuaikan skala tim.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "TokoNusa: 40 dasbor, 0 kontrak",
      prose: [
        "TokoNusa, marketplace regional, punya 40 dasbor yang dibangun 6 analis selama 2 tahun. Setiap analis menulis query-nya sendiri langsung ke tabel mentah. Bulan lalu: (1) dasbor GMV menampilkan Rp120 M, laporan finance Rp112 M — selisih Rp8 M dari definisi “batal” yang berbeda; (2) kolom `ongkir` berubah nama jadi `biaya_kirim` di sumber — 11 dasbor rusak semalam; (3) tidak ada yang berani menghapus dasbor lama karena tidak tahu siapa yang masih memakainya.",
        "Pertanyaan analisis: (a) Untuk tiap masalah, lapisan dbt mana (stg_/int_/mart_) yang seharusnya mencegahnya, dan bagaimana? (b) Tes skema apa yang akan menangkap masalah (2) sebelum dasbor rusak? (c) Dasbor mana yang boleh dibaca analis menurut aturan lapisan — dan apa konsekuensi aturan itu untuk 40 dasbor yang ada?",
        "Pembahasan: (a1) stg_ menyerap perubahan nama kolom — dasbor tidak pernah melihat nama mentah; (a2) int_ menulis definisi “batal” SEKALI — GMV dan finance membaca model yang sama; (a3) lineage dbt menunjukkan dasbor mana membaca model mana — yang tak terbaca siapa pun bisa dipensiunkan dengan percaya diri. (b) Tes skema pada stg_: kolom `biaya_kirim` harus ada (not_null / kolom wajib) — pipeline merah sebelum dasbor sempat rusak. (c) Hanya mart_ — artinya 40 dasbor perlu dimigrasi bertahap; mulai dari dasbor yang paling sering dipakai dan paling sering bermasalah.",
      ],
      tasks: [],
      reference: "Tiga penyakit TokoNusa = tiga hal yang disembuhkan lapisan + tes + lineage.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Analytics engineer = pemilik keandalan transformasi, di antara data engineering dan analis.",
        "dbt: model = SELECT bernama berversion; DAG = peta ketergantungan otomatis.",
        "Tes data (unik, tidak null, nilai diterima, relasi) adalah kontrak — pelanggaran menggagalkan pipeline.",
        "Lapisan stg_ → int_ → mart_ melokalisasi perubahan; dasbor hanya boleh membaca mart_.",
        "Manfaat BI: satu definisi metrik, lineage untuk debugging, perubahan terverifikasi sebelum tayang.",
        "Proporsional: tim kecil + sumber tunggal tidak wajib dbt penuh — polanya yang wajib.",
      ],
      next: { label: "BI22 — Teori Visualisasi: Kenapa Bagan Bekerja (atau Menipu)", href: "/v2/learn/biz22-teori-visualisasi" },
      quiz: [
        {
          q: "Apa beda utama output analis dengan output analytics engineer?",
          options: [
            { text: "Analis memakai SQL, analytics engineer memakai Python", why: "Keduanya bisa memakai keduanya — bedanya bukan bahasa, melainkan sifat outputnya." },
            { text: "Analis menjawab pertanyaan (sekali pakai); analytics engineer membangun transformasi yang harus benar setiap hari", why: "Analis: jawaban. Analytics engineer: tabel/kontrak yang diandalkan berulang-ulang.", correct: true },
            { text: "Analytics engineer tidak perlu memahami bisnis", why: "Justru harus — definisi metrik adalah keputusan bisnis yang ditulis sebagai kode." },
            { text: "Tidak ada beda, hanya istilah baru", why: "Bedanya nyata: versi, tes, review, dan tanggung jawab atas keandalan harian." },
          ],
        },
        {
          q: "Dalam DAG dbt, mart_pendapatan membaca int_penjualan yang membaca stg_penjualan. Kamu mengubah definisi di int_penjualan. Apa yang terjadi?",
          options: [
            { text: "Semua model dihitung ulang dari nol", why: "dbt hanya membangun ulang yang terdampak lewat DAG — itulah gunanya graf." },
            { text: "dbt tahu mart_pendapatan terdampak dan membangun ulang rantai yang relevan + menjalankan tesnya", why: "DAG memberi tahu persis siapa hilirnya; tes berjalan sebagai kontrak.", correct: true },
            { text: "Dasbor langsung berubah tanpa jejak", why: "Itu yang terjadi TANPA dbt (cerita langkah 2). Dengan dbt, ada versi dan tes." },
            { text: "Tidak ada yang terjadi sampai manual dijalankan", why: "dbt memang dijalankan terjadwal/manual, tapi ia tahu persis apa yang harus dibangun ulang." },
          ],
        },
        {
          q: "Kolom status_order tiba-tiba berisi nilai “menunggu_kurir” yang belum pernah ada. Tes dbt apa yang menangkapnya?",
          options: [
            { text: "unique", why: "unique menangkap duplikat, bukan nilai baru." },
            { text: "not_null", why: "Kolomnya terisi — bukan masalah null." },
            { text: "accepted_values", why: "Nilai di luar daftar yang dikenal = pelanggaran kontrak nilai.", correct: true },
            { text: "relationships", why: "relationships memeriksa keberadaan kunci di tabel lain, bukan kosakata nilai." },
          ],
        },
        {
          q: "Menurut aturan lapisan, bolehkah dasbor membaca langsung tabel stg_penjualan?",
          options: [
            { text: "Boleh, asal cepat", why: "Kecepatan bukan kriterianya — stabilitas kontraknya. stg_ boleh berubah struktur kapan pun." },
            { text: "Tidak — dasbor hanya boleh membaca mart_; stg_ adalah area kerja internal", why: "Aturan keras: dasbor → mart_ saja. Jalan pintas ke stg_ menciptakan ketergantungan rapuh.", correct: true },
            { text: "Boleh untuk dasbor darurat", why: "“Darurat” yang menjadi permanen adalah asal mula 40 dasbor TokoNusa." },
            { text: "Boleh kalau analisnya senior", why: "Aturan lapisan tidak mengenal senioritas — ia melindungi dari perubahan di masa depan." },
          ],
        },
        {
          q: "Tim 2 analis, 1 sumber data, 6 dasbor internal. Keputusan paling proporsional?",
          options: [
            { text: "Adopsi dbt penuh dengan CI/CD dan 50 tes", why: "Biaya operasional melebihi manfaat pada skala ini — birokrasi tanpa rasa sakit yang nyata." },
            { text: "Pola ringan: konvensi lapisan sederhana + dokumentasi + beberapa tes kunci", why: "Disiplinnya diambil, berat alatnya disesuaikan — naikkan saat tim/sumber bertambah.", correct: true },
            { text: "Tidak perlu apa-apa, query langsung ke raw saja", why: "Ini resep mengulang cerita langkah 2 dalam skala kecil." },
            { text: "Tunggu sampai ada insiden dulu", why: "Mencegah lebih murah — tapi pencegahannya proporsional, bukan maksimal." },
          ],
        },
        {
          q: "Apa nilai utama lineage (graf asal-usul angka) bagi tim BI?",
          options: [
            { text: "Membuat dasbor lebih cepat di-render", why: "Lineage tidak memengaruhi kecepatan render." },
            { text: "Mengubah debugging dari menebak menjadi menelusuri: klik angka, ikuti panah mundur ke perubahan penyebabnya", why: "Waktu investigasi turun dari hari ke menit; percakapan berubah dari menyalahkan menjadi menelusuri.", correct: true },
            { text: "Menghapus kebutuhan akan tes data", why: "Lineage menunjukkan ASAL, tes menunjukkan KESEHATAN — keduanya dibutuhkan." },
            { text: "Otomatis memperbaiki data yang rusak", why: "Lineage tidak memperbaiki apa pun — ia memberi tahu di mana melihat." },
          ],
        },
      ],
    },
  ],
};
