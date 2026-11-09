import type { V2Lesson } from "../lib/types";

// ── Figure: perbandingan 3 format tabel terbuka ────────────────────────────
const FORMAT_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Tabel perbandingan Iceberg, Delta Lake, dan Hudi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="150" y1="40" x2="150" y2="240"/><line x1="320" y1="40" x2="320" y2="240"/>
<line x1="150" y1="76" x2="540" y2="76"/><line x1="150" y1="112" x2="540" y2="112"/>
<line x1="150" y1="148" x2="540" y2="148"/><line x1="150" y1="184" x2="540" y2="184"/>
<line x1="150" y1="220" x2="540" y2="220"/>
</g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--text)" font-weight="600">
<text x="235" y="32" text-anchor="middle">Iceberg</text>
<text x="405" y="32" text-anchor="middle">Delta Lake</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<text x="20" y="68">Lahir</text><text x="160" y="68">Netflix 2018 → Apache</text><text x="330" y="68">Databricks 2019 → Linux Fdn</text>
<text x="20" y="104">Kunci</text><text x="160" y="104">hidden partitioning,</text><text x="330" y="104">tight Spark,</text>
<text x="160" y="118" font-size="10" fill="var(--text-muted)">schema evolution, v3 (2025)</text><text x="330" y="118" font-size="10" fill="var(--text-muted)">time travel, DLP</text>
<text x="20" y="140">Dukungan</text><text x="160" y="140">Snowflake, BigQuery,</text><text x="330" y="140">Fabric, Spark,</text>
<text x="160" y="154" font-size="10" fill="var(--text-muted)">Athena, Trino, Flink</text><text x="330" y="154" font-size="10" fill="var(--text-muted)">Trino, Athena</text>
<text x="20" y="176">Kuat di</text><text x="160" y="176">multi-engine,</text><text x="330" y="176">ekosistem Spark/</text>
<text x="160" y="190" font-size="10" fill="var(--text-muted)">vendor-netral</text><text x="330" y="190" font-size="10" fill="var(--text-muted)">Databricks</text>
<text x="20" y="212">Waspada</text><text x="160" y="212">metadata overhead</text><text x="330" y="212">lock-in halus</text>
<text x="160" y="226" font-size="10" fill="var(--text-muted)">di tabel kecil</text><text x="330" y="226" font-size="10" fill="var(--text-muted)">ke ekosistem</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<text x="20" y="258" font-weight="600">Hudi:</text>
<text x="70" y="258" fill="var(--text-muted)">Uber 2019 → Apache · upsert &amp; streaming tercepat · indeks record-level · kuat di CDC/streaming</text>
</g>
</svg>`;

export const de21: V2Lesson = {
  slug: "de21-open-table-formats",
  track: "Data Engineer",
  module: "Platform Data",
  title: "Format Tabel Terbuka: Iceberg, Delta Lake & Hudi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Data lake yang berubah menjadi rawa — dan format yang menyelamatkannya",
      prose: [
        "Tahun 2017, Netflix menyimpan ratusan petabyte di data lake berbasis file Parquet mentah. Masalahnya: file Parquet tidak tahu ia bagian dari “tabel” — tidak ada skema terpusat, tidak ada transaksi, tidak ada cara aman menambah kolom tanpa menulis ulang semuanya. Hive metastore yang mencatat partisi sering tidak sinkron dengan file di storage: query mengembalikan data basi atau error partisi misterius. Insiden “tabel rusak setelah job gagal di tengah jalan” menjadi rutinitas. Twist-nya: masalahnya bukan skala datanya — melainkan tidak adanya LAPISAN TABEL di atas file. File tahu cara menyimpan byte; ia tidak tahu cara menjadi tabel yang bisa dipercaya.",
        "Jawaban Netflix: Apache Iceberg (open-source 2018) — format tabel terbuka yang menambahkan lapisan metadata (snapshot, manifest, skema berversi) di atas file Parquet/ORC di object storage. Ide yang sama melahirkan Delta Lake (Databricks, 2019) dan Apache Hudi (Uber, 2019). Ketiganya mengubah data lake menjadi lakehouse: gudang data dengan keandalan transaksi, tanpa meninggalkan storage murah. Pada April 2025, Snowflake mengumumkan dukungan penuh untuk tabel Iceberg — pelanggan bisa memakai performa dan governance Snowflake langsung di atas data Iceberg tanpa migrasi. Spesifikasi Iceberg v3 diratifikasi pada musim semi 2025, menambah deletion vectors, tipe VARIANT, dan row lineage.",
        "Di lesson ini kamu belajar anatomi format tabel terbuka, perbedaan tiga format utama, dan cara memilih — termasuk kapan Parquet mentah sebenarnya masih cukup.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini P1 untuk data engineer 2025–2026",
        type: "risk",
        body: "Industri sedang bermigrasi ke format terbuka: vendor besar (Snowflake, Databricks, Google, AWS) semuanya mendukung Iceberg. Engineer yang hanya tahu “Parquet di S3” akan kesulitan di arsitektur lakehouse modern — dan keputusan format tabel adalah keputusan 5–10 tahun yang mahal untuk dibalik.",
      },
      reference: "Format tabel terbuka = lapisan metadata (snapshot, skema, transaksi) di atas file di object storage. Lake + keandalan = lakehouse.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan masalah yang dipecahkan format tabel (vs Parquet mentah + Hive metastore); (2) menjelaskan anatomi Iceberg: metadata → snapshot → manifest → data files, plus time travel; (3) membedakan Iceberg, Delta Lake, dan Hudi berdasar kekuatan dan trade-off-nya; (4) menghitung overhead small-files dan merencanakan compaction.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (anatomi format tabel; tiga format) → lab Python (simulator snapshot & time travel + small-files) → chart perbandingan → peta keputusan → mini-case migrasi lakehouse → kuis → rangkuman. Estimasi 55 menit; lab-nya ±15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari storage untuk data: object storage (S3/GCS) menyimpan file murah dan skalabel, tetapi tidak punya konsep tabel/transaksi — file Parquet hanyalah byte terkompresi. Dari warehouse vs lakehouse: warehouse memberi skema, transaksi ACID, dan time travel, tetapi dengan storage proprietary yang mahal dan terkunci vendor; lakehouse menggabungkan keduanya — storage terbuka yang murah + lapisan tabel yang andal. Format tabel terbuka adalah lapisan yang memungkinkan penggabungan itu.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: bedakan tiga lapisan — FILE (Parquet: cara menyimpan byte), TABEL (Iceberg: metadata + snapshot + skema), ENGINE (Spark/Trino/Snowflake: yang mengeksekusi query). Kebingungan ketiganya adalah sumber 90% miskonsepsi topik ini.",
      ],
      reference: "Bekal: (1) object storage = file murah tanpa konsep tabel; (2) lakehouse = storage terbuka + keandalan warehouse.",
    },
    {
      id: "konsep-anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi Format Tabel — Si Arsiparis Bertingkat",
      prose: [
        "Definisi: format tabel terbuka menambahkan hierarki metadata di atas data files (Parquet/ORC): metadata.json menunjuk ke snapshot aktif; snapshot menunjuk ke manifest list; manifest list menunjuk ke manifest files; manifest menunjuk ke data files + delete files. Setiap operasi tulis (append, overwrite, delete) membuat SNAPSHOT BARU — snapshot lama tetap ada, sehingga time travel (query “tabel kemarin jam 3 sore”) dan rollback menjadi operasi metadata, bukan pemulihan backup.",
        "Kepribadiannya: seperti arsiparis bertingkat di perpustakaan nasional. Data files = bukunya di gudang. Manifest = katalog per rak (“rak 5 berisi buku A–Z”). Manifest list = indeks katalog (“katalog rak 1–100 ada di sini”). Snapshot = foto seluruh perpustakaan pada satu waktu (“kondisi per 15 Okt 2025”). Metadata = penjaga yang tahu foto mana yang aktif. Pembaca tidak pernah mencari buku langsung ke gudang — ia bertanya ke arsiparis, yang menjawab dari katalog. Menambah buku tidak menggeser buku lain; mengganti katalog lama dengan yang baru adalah operasi atomik.",
        "Fitur kunci yang lahir dari arsitektur ini: (1) hidden partitioning — partisi berdasar transformasi (hari/bulan dari timestamp), query menulis `WHERE tanggal = X` tanpa tahu layout partisi; (2) schema evolution — tambah/rename/drop kolom tanpa rewrite (kolom dipetakan via ID, bukan nama); (3) ACID via optimistic concurrency — dua penulis bersamaan, yang kalah retry; (4) time travel & rollback — `SELECT ... FOR TIMESTAMP AS OF`.",
      ],
      formula: String.raw`\text{biaya query} \propto \text{file dibaca} \quad ; \quad \text{file dibaca} = \frac{\text{data relevan}}{\text{ukuran file rata-rata}} + \text{overhead manifest}`,
      formulaNote: "Kompas performa lakehouse. Pembilang = data yang benar-benar dibutuhkan query (diperkecil oleh partition pruning & column pruning dari metadata). Penyebut = ukuran file rata-rata: file kecil (KB) berarti ribuan file dibuka untuk 1 GB data — overhead manifest dan request storage meledak. Interpretasi: target ukuran file 128MB–512MB; di bawah itu, jadwalkan compaction (tugas background menggabungkan file kecil).",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Iceberg/Delta = file Parquet yang lebih bagus”",
        type: "pitfall",
        body: "Yang benar: file-nya TETAP Parquet biasa — yang baru adalah LAPISAN METADATA di atasnya. Parquet tanpa format tabel = tumpukan file tanpa katalog; Parquet + Iceberg = tabel berversi dengan transaksi. Membandingkan “Parquet vs Iceberg” adalah kategori yang salah — yang benar “Parquet mentah vs Parquet + format tabel”.",
      },
      hints: [
        "💡 Intuisi: snapshot adalah “git commit” untuk tabel — immutable, berantai, bisa di-checkout (time travel) dan di-revert (rollback). Kalau kamu paham git, kamu sudah paham 60% arsitektur Iceberg.",
      ],
      reference: "Hierarki: metadata → snapshot → manifest list → manifest → data files. Tulis = snapshot baru. Baca = via katalog.",
    },
    {
      id: "konsep-tiga",
      eyebrow: "Langkah 4 · Konsep",
      title: "Iceberg vs Delta Lake vs Hudi — Tiga Saudara Seperguruan",
      prose: [
        "Definisi singkat ketiganya. Apache Iceberg (Netflix 2018 → Apache): dirancang engine-agnostic sejak awal — Spark, Trino, Flink, Snowflake, BigQuery, Athena semua bisa membaca/menulis; hidden partitioning dan schema evolution adalah keunggulan klasiknya; v3 (2025) menambah deletion vectors, tipe VARIANT semi-terstruktur, dan row lineage. Delta Lake (Databricks 2019 → Linux Foundation): terintegrasi paling dalam dengan Spark/Databricks (DLT, time travel, `Z-ORDER`); open-source tetapi ekosistem terkuatnya di Databricks. Apache Hudi (Uber 2019 → Apache): spesialis upsert dan streaming — record-level index membuatnya tercepat untuk workload update intensif dan CDC.",
        "Kepribadiannya: tiga saudara seperguruan dengan jurus andalan berbeda. Si Diplomat (Iceberg) — berteman dengan semua engine, tidak memihak vendor; pilihannya saat arsitektur multi-engine atau menghindari lock-in. Si Anak Emas (Delta) — jurusnya paling lengkap DI DALAM ekosistem Databricks/Spark; pilihannya saat tim sudah “rumah” di sana. Si Petarung Jalanan (Hudi) — hidup untuk upsert dan streaming berkecepatan tinggi; pilihannya saat tabel di-update jutaan kali per hari dari CDC.",
        "Kapan memakai: Iceberg bila butuh vendor-netral/multi-engine (tren industri 2024–2026 jelas ke sini — dukungan Snowflake penuh April 2025 adalah sinyal kuat); Delta Lake bila tim standard di Databricks/Spark dan butuh fitur termaturnya; Hudi bila workload didominasi upsert/streaming (CDC dari database operasional). Kapan TIDAK memakai ketiganya: tabel kecil (< 1 GB) yang jarang berubah — overhead metadata tidak sepadan; Parquet mentah + katalog sederhana cukup.",
      ],
      formula: String.raw`\text{lock-in} \approx \frac{\text{fitur proprietary yang dipakai}}{\text{fitur standar format terbuka}}`,
      formulaNote: "Kompas pemilihan format. Pembilang = fitur yang hanya ada di satu vendor/engine; penyebut = fitur yang dijamin spesifikasi terbuka. Contoh: memakai fitur eksklusif satu platform untuk 80% workload → lock-in tinggi walau “formatnya terbuka”. Interpretasi: “terbuka” adalah spektrum, bukan biner — audit fitur proprietary yang kamu pakai, bukan cuma label formatnya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Pilih Iceberg karena semua orang pakai Iceberg”",
        type: "pitfall",
        body: "Yang benar: tren industri adalah sinyal, bukan keputusan. Iceberg unggul untuk multi-engine dan netralitas vendor — tetapi bila timmu 100% Databricks dan butuh fitur DLT termaturnya, Delta Lake bisa lebih produktif. Keputusan format = 5–10 tahun; dasarkan pada arsitektur dan skill tim, bukan hype.",
      },
      hints: [
        "💡 Intuisi: tanya “engine apa yang akan membaca tabel ini 3 tahun lagi?” — bukan “engine apa hari ini?”. Jawaban yang jujur sering kali “tidak tahu” — dan “tidak tahu” adalah argumen terbaik untuk format yang paling netral.",
      ],
      reference: "Iceberg = diplomat multi-engine. Delta = anak emas Databricks/Spark. Hudi = petarung upsert/streaming.",
    },
    {
      id: "lab-snapshot",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Simulator snapshot, time travel & small files",
      prose: [
        "Waktunya jadi engine-nya. Di bawah ada simulator tabel Iceberg sederhana (sintetis): tiap tulis membuat snapshot baru berisi daftar file. Tugasmu: (1) implementasikan `tulis()` yang menambah snapshot; (2) implementasikan `baca(snapshot_id)` untuk time travel (None = snapshot terakhir); (3) hitung `rasio_small` = fraksi file < 128MB; (4) tentukan `butuh_compaction` bila rasio_small > 30%.",
        "Coba: setelah lolos, tulis 20 file kecil tambahan dan lihat kapan `butuh_compaction` menyala. Lalu tanya: kenapa compaction adalah operasi background, bukan bagian dari tulis? (Petunjuk: tulis harus cepat; compaction bisa lambat.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `tulis(nama_file, mb)`: tambah snapshot baru berisi file-file snapshot terakhir + file baru" },
        { id: "t2", text: "Lengkapi `baca(snap_id)`: kembalikan daftar file pada snapshot itu (None = terakhir)" },
        { id: "t3", text: "Hitung `rasio_small` = fraksi file < 128 MB pada snapshot terakhir" },
        { id: "t4", text: "Hitung `butuh_compaction` = True bila rasio_small > 0.30" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "snapshot: 6, file: 7\ntime travel snap 1: 3 file\nsmall files: 57.1%, compaction: True",
      code: {
        starter: `# Simulator tabel Iceberg (SINTETIS — konsep disederhanakan)
snapshots = [[["f1.parquet", 256], ["f2.parquet", 256]]]  # snapshot 0: 2 file besar

# TULIS KODEMU DI BAWAH INI
def tulis(nama_file, mb):
    return

def baca(snap_id=None):
    return

# Aliran tulis: 1 file besar + 4 file kecil (streaming!)
tulis("f3.parquet", 256)
tulis("s1.parquet", 8)
tulis("s2.parquet", 12)
tulis("s3.parquet", 5)
tulis("s4.parquet", 20)

n_snap = 0  # TODO: len(snapshots)
n_file = 0  # TODO: len(baca())
tt = []  # TODO: baca(1)
rasio_small = 0.0  # TODO: fraksi file < 128 MB di snapshot terakhir
butuh_compaction = False  # TODO: rasio_small > 0.30

print(f"snapshot: {n_snap}, file: {n_file}")
print(f"time travel snap 1: {len(tt)} file")
print(f"small files: {rasio_small:.1%}, compaction: {butuh_compaction}")`,
        lockLines: 2,
        solution: `# Simulator tabel Iceberg (SINTETIS — konsep disederhanakan)
snapshots = [[["f1.parquet", 256], ["f2.parquet", 256]]]  # snapshot 0: 2 file besar

# TULIS KODEMU DI BAWAH INI
def tulis(nama_file, mb):
    baru = list(snapshots[-1]) + [[nama_file, mb]]
    snapshots.append(baru)
    return len(snapshots) - 1

def baca(snap_id=None):
    if snap_id is None:
        snap_id = len(snapshots) - 1
    return snapshots[snap_id]

# Aliran tulis: 1 file besar + 4 file kecil (streaming!)
tulis("f3.parquet", 256)
tulis("s1.parquet", 8)
tulis("s2.parquet", 12)
tulis("s3.parquet", 5)
tulis("s4.parquet", 20)

n_snap = len(snapshots)
n_file = len(baca())
tt = baca(1)
files = baca()
rasio_small = sum(1 for _, mb in files if mb < 128) / len(files)
butuh_compaction = rasio_small > 0.30

print(f"snapshot: {n_snap}, file: {n_file}")
print(f"time travel snap 1: {len(tt)} file")
print(f"small files: {rasio_small:.1%}, compaction: {butuh_compaction}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_snap", value: 6, tol: 0, label: "6 snapshot (0 awal + 5 tulis)", msg: "Tiap tulis = 1 snapshot baru." },
          { kind: "equal", task: "t2", name: "tt", value: [["f1.parquet", 256], ["f2.parquet", 256], ["f3.parquet", 256]], tol: 0, label: "Time travel snap 1 = 3 file", msg: "Snapshot 1 = snapshot 0 + f3.parquet." },
          { kind: "equal", task: "t3", name: "rasio_small", value: 4/7, tol: 0.001, label: "rasio_small = 4/7", msg: "4 file kecil dari 7 file total." },
          { kind: "equal", task: "t4", name: "butuh_compaction", value: true, tol: 0, label: "`butuh_compaction` True", msg: "57,1% > 30% — jadwalkan compaction." },
          { kind: "stdout_matches", task: "t5", pattern: "small files: 57\\.1%, compaction: True", label: "Ringkasan small files tercetak", msg: "Baris ketiga: 'small files: 57.1%, compaction: True'." },
        ],
      },
      reference: "Tulis = snapshot baru (immutable). Baca = pilih snapshot. File kecil menumpuk → compaction terjadwal.",
    },
    {
      id: "chart-format",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca tabel perbandingan tiga format",
      prose: [
        "Chart di bawah merangkum perbandingan Iceberg, Delta Lake, dan Hudi dalam satu tabel visual.",
        "Cara membaca: tiap baris = satu dimensi perbandingan (asal, keunggulan kunci, dukungan engine, kekuatan, hal yang diwaspadai). Kolom = format. Baris terakhir merangkum Hudi yang spesialisnya berbeda.",
        "Interpretasi: tidak ada format yang menang di semua baris — Iceberg unggul di netralitas dan dukungan lintas vendor (diperkuat dukungan penuh Snowflake April 2025 dan v3 2025); Delta unggul di kedalaman ekosistem Spark/Databricks; Hudi unggul di upsert/streaming. Baris “Waspada” adalah yang paling penting: metadata overhead (Iceberg di tabel kecil), lock-in halus ke ekosistem (Delta), dan kompleksitas operasional (Hudi). Pelajaran chart ini: pilih berdasar baris yang paling penting untuk arsitekturmu 3 tahun ke depan — bukan berdasar siapa paling ramai dibicarakan.",
      ],
      figure: {
        svg: FORMAT_SVG,
        alt: "Tabel perbandingan: Iceberg (Netflix 2018, multi-engine, vendor-netral), Delta Lake (Databricks 2019, ekosistem Spark), Hudi (Uber 2019, upsert/streaming).",
        caption: "Iceberg vs Delta Lake vs Hudi: asal, keunggulan, dukungan, dan hal yang diwaspadai.",
      },
      tasks: [],
      reference: "Bandingkan per dimensi; baris “Waspada” sering menentukan lebih dari baris “Kuat di”.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Memilih format tabel — keputusan 5 tahun",
      prose: [
        "Empat skenario keputusan format:",
        "Skenario 1 — Perusahaan multi-cloud: Spark untuk ETL, Trino untuk ad-hoc, Snowflake untuk BI. → Iceberg. Alasan: satu-satunya format yang didukung penuh semua engine itu — satu tabel dibaca tiga engine tanpa duplikasi.",
        "Skenario 2 — Tim 100% Databricks, butuh DLT dan fitur terbaru. → Delta Lake. Alasan: kedalaman integrasi mengalahkan netralitas bila tidak ada rencana multi-engine; produktivitas tim adalah nilai nyata.",
        "Skenario 3 — Tabel transaksi di-update jutaan kali/hari dari CDC Debezium. → Hudi (atau Iceberg v3 dengan deletion vectors — evaluasi). Alasan: workload upsert-intensif adalah habitat alami Hudi; uji benchmark dengan data sendiri sebelum memutuskan.",
        "Skenario 4 — Data mart kecil 500 MB, di-refresh harian, dibaca satu tim. → Parquet mentah + katalog sederhana cukup. Alasan: overhead metadata format tabel tidak sepadan; jangan bayar kompleksitas yang tidak dipakai.",
        "Aturan praktis 10 detik: pilih format? → (1) multi-engine 3 tahun lagi? → Iceberg; (2) 100% satu ekosistem? → format ekosistem itu; (3) upsert ekstrem? → Hudi; (4) tabel kecil jarang berubah? → Parquet mentah cukup.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Migrasi format tanpa rencana kompatibilitas baca-tulis. Tabel yang ditulis engine A (mis. Spark dengan fitur v3 terbaru) bisa tidak terbaca engine B yang versinya lebih lama. Uji matriks baca-tulis antar engine SEBELUM migrasi produksi — “format terbuka” tidak otomatis berarti “semua versi saling mengerti”.",
      },
      reference: "Keputusan 5–10 tahun: dasarkan pada arsitektur masa depan, uji dengan data sendiri, cek matriks kompatibilitas.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Migrasi lakehouse: 800 TB Parquet mentah",
      prose: [
        "Skenario (sintetis, untuk latihan): perusahaan punya 800 TB Parquet mentah di S3 (tanpa format tabel), dibaca oleh Spark (ETL) dan Trino (ad-hoc). Masalah: 40.000 file kecil per tabel terbesar, schema evolution manual (tambah kolom = rewrite), dan tidak ada time travel — job gagal = data rusak sampai di-repair manual. Target: migrasi ke format tabel dalam 1 kuartal.",
        "Pertanyaan analisis: (1) Format apa yang paling masuk akal dan kenapa? (2) Bagaimana migrasi 800 TB tanpa downtime baca? (3) Apa yang dilakukan terhadap 40.000 file kecil?",
        "Pembahasan: (1) Iceberg: dua engine (Spark + Trino) butuh format yang didukung penuh keduanya — Iceberg adalah jawaban netralnya; didukung tren industri (Snowflake penuh 2025, v3 2025). (2) Migrasi in-place: Iceberg mendukung “migrasi metadata” — daftarkan file Parquet existing sebagai tabel Iceberg tanpa menulis ulang data (snapshot awal menunjuk file lama), lalu tulis baru memakai format tabel. Pembaca lama tetap bisa membaca file mentah selama transisi; pembaca baru memakai katalog. (3) File kecil: migrasi metadata tidak menggabungkan file — jalankan compaction bertahap (rewrite_data_files) di jam sepi, prioritaskan tabel terpanas; target 128–512MB per file. Pantau rasio small-files sebagai KPI migrasi.",
        "Catatan risiko: migrasi format adalah perubahan fondasi — uji baca-tulis Spark↔Trino di 1 tabel percontoh selama 2 minggu sebelum migrasi massal. Satu tabel percontoh yang gagal memberi pelajaran murah; 800 TB yang gagal memberi pelajaran mahal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "800 TB tanpa time travel = 800 TB tanpa jaring pengaman. Setiap job ETL yang gagal berpotensi merusak data produksi tanpa cara rollback cepat. Migrasi ke format tabel bukan proyek “modernisasi” kosmetik — ia pemasangan jaring pengaman untuk seluruh platform data.",
      },
      reference: "Migrasi: in-place via metadata, percontoh dulu, compaction bertahap, KPI small-files.",
    },
    {
      id: "pendalaman-operasional",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Operasional format tabel: compaction, evolusi, dan ACID sungguhan",
      prose: [
        "Compaction — kenapa operasi background, bukan bagian tulis. Menggabungkan file kecil berarti me-rewrite data — mahal dan lambat; menaruhnya di critical path tulis akan membunuh latensi streaming. Karena itu compaction adalah TUGAS TERJADWAL (jam sepi), bukan bagian dari commit. Kapan dijalankan: rasio small files >30%, delete files menumpuk, atau file tidak ter-sort. Dua strategi: binpack (gabung file sekadar mencapai ukuran target — cepat, murah) vs sort/Z-order (tulis ulang dengan data terurut/clustered — mahal, tetapi query mendapat data skipping: file yang min/max-nya tak relevan dilewati tanpa dibaca). Jadwal senior: prioritaskan tabel TERPANAS (query per jam × ukuran) — compaction tabel yang jarang dibaca = biaya rewrite tanpa pengembalian. Otomatisasi: Delta auto-optimize, Iceberg rewrite_data_files terjadwal di orchestrator.",
        "Delete — tiga mekanisme, tiga ekonomi. Copy-on-write (CoW): delete = tulis ulang seluruh file tanpa baris terhapus — sederhana, tetapi menghapus 10 baris dari file 512MB = rewrite 512MB. Merge-on-read (MoR): delete ditulis ke delete file kecil; saat baca, engine menggabungkan — tulis murah, tetapi SETIAP baca membayar pajak merge. Deletion vectors (Iceberg v3): bitmap baris terhapus yang ditempel di metadata — delete cepat TANPA rewrite dan tanpa pajak baca besar. Aturan pilih: delete jarang (koreksi manual) → CoW cukup; delete sering (streaming CDC, GDPR) → MoR/deletion vectors + compaction terjadwal WAJIB (tumpukan delete file = baca melambat diam-diam). Ukur: pantau jumlah delete files per tabel sebagai KPI.",
        "Schema evolution lanjutan — yang aman dan yang tidak. Aman: tambah kolom (dengan default), drop kolom (data lama tetap terbaca), rename kolom (berkat column mapping BY ID — kolom diidentifikasi nomor, bukan nama — rename tidak merusak data historis). TIDAK aman: promote/demote tipe yang tak kompatibel (long→int = data loss; int→long = aman). Partition evolution — keunggulan Iceberg atas Hive: ubah partisi harian→bulanan HANYA di metadata, tanpa rewrite 50 TB! (Hive: rewrite total atau tabel ganda.) Praktik: definisikan partisi dari kebutuhan query 3 tahun ke depan, bukan hari ini — karena evolusi murah tetapi tidak gratis (kompatibilitas pembaca lama harus diuji).",
        "Partitioning dalam — hidden partitioning dan jebakannya. Transformasi partisi (day(ts), month(ts), bucket(id, 16), truncate(nama, 4)) tercatat di METADATA; penulis query cukup menulis WHERE tanggal = X — engine menerjemahkan ke partisi fisik dan melakukan partition pruning via statistik min/max per file di manifest. Jebakan over-partitioning: partisi per jam pada tabel 2 GB = ribuan partisi × file kecil = small-files KUADRAT (masalah yang ingin dipecahkan malah digandakan!). Aturan: target ≥128MB data per partisi; mulai dari partisi KASAR (bulan), haluskan (hari) hanya bila pruning terbukti kurang. Dan: filter harus pada kolom mentah yang bisa diterjemahkan — WHERE date_trunc('month', ts) kadang menggagalkan pruning tergantung engine; uji EXPLAIN.",
        "ACID sungguhan — optimistic concurrency, bukan lock raksasa. Tiap commit: baca snapshot terkini → tulis file baru → coba 'tukar' pointer snapshot secara atomik; bila snapshot berubah sejak dibaca (penulis lain lebih dulu) → KONFLIK → retry dengan backoff, bukan deadlock. Isolation level: snapshot isolation (baca konsisten per snapshot — default, cukup untuk analitik) vs serializable (lebih ketat, lebih sering konflik). Praktik konflik rendah: tulis dalam batch kecil-sering (jendela konflik kecil) daripada raksasa-jam-jaman; antisipasi retry saat streaming dan batch menulis tabel yang sama. Jangan melawan konflik dengan 'tulis tengah malam saja' — itu penjadwalan, bukan engineering.",
        "Time travel operasional — lebih dari sekadar 'keren'. Kegunaan nyata: debugging ('dashboard benar kemarin, salah hari ini — diff snapshot kemarin vs hari ini, ketemu!'), audit ('tunjukkan data seperti yang terlihat regulator bulan lalu'), dan rollback DARURAT (tunjuk pointer kembali ke snapshot sehat — operasi metadata hitungan detik, bukan restore backup berjam-jam). Retensi snapshot = trade-off: expire_snapshots (mis. simpan 7 hari) — riwayat panjang = storage mahal + konflik GDPR (data subjek yang 'dihapus' masih hidup di snapshot lama!). Aturan: retensi snapshot selaras dengan kebijakan hapus data — time travel BUKAN arsip abadi, dan 'lupa expire' = bom privasi.",
        "Matriks keputusan senior — kapan pilih yang mana, dan biaya yang jarang dihitung. Multi-engine / hindari lock-in / arsitektur 3 tahun tak pasti → Iceberg. 100% Databricks/Spark + butuh DLT dan fitur termutakhir ekosistem → Delta Lake (produktivitas > netralitas bila tak ada rencana multi-engine). Upsert jutaan baris/hari dari CDC → Hudi, ATAU Iceberg v3 dengan deletion vectors — JANGAN putuskan dari brosur: benchmark dengan data dan pola tulis SENDIRI (hasil benchmark vendor = iklan). Biaya yang sering dilupakan: mengadopsi 2–3 format sekaligus melipatgandakan biaya operasional (skill tim, tooling compaction, monitoring, matriks kompatibilitas). Satu format untuk 90% tabel; pengecualian butuh justifikasi tertulis. Migrasi: in-place via metadata, 1 tabel percontoh 2 minggu, KPI rasio small-files — baru massal.",
      ],
      formula: String.raw`\text{biaya baca} \propto N_{\text{file}} \times c_{\text{buka}} + \frac{\text{data relevan}}{\text{throughput}}`,
      formulaNote: "N_file = jumlah file yang disentuh query; c_buka = biaya per file (open, manifest lookup, request storage). Contoh: query 1 GB dari 10.000 file 100KB → suku pertama (10.000 × c_buka) mendominasi — inilah pajak small files. Compaction menekan N_file (10.000 → 8 file 128MB) sehingga biaya kembali proporsional ke data. Ukur N_file rata-rata per query sebagai KPI kesehatan tabel.",
      tasks: [],
      note: {
        title: "Intuisi: format tabel = git untuk data, tapi git yang butuh tukang kebun",
        body: "Heuristik yang merangkum seluruh lesson: snapshot adalah 'git commit' untuk tabel — immutable, berantai, bisa di-checkout (time travel) dan di-revert (rollback). Tetapi tidak seperti git, repositori ini TUMBUH setiap detik (streaming!) dan butuh tukang kebun: compaction (seperti git gc) yang menggabungkan file kecil, expire snapshot (seperti prune) yang membuang riwayat tua, dan rewrite yang merapikan. Bau masalah yang harus membuatmu berhenti: rasio small files naik tiap minggu ('nanti di-compact'), tiga format tabel sekaligus di satu perusahaan ('yang penting modern'), partisi per jam untuk tabel 2 GB, dan time travel yang 'tidak pernah di-expire'. Ritual sehatnya: KPI small-files di dashboard (target <30%), compaction terjadwal di jam sepi untuk tabel terpanas, expire snapshot selaras kebijakan privasi, dan SATU format standar dengan pengecualian tertulis. Tabel yang tidak dirawat kembali menjadi rawa — hanya kini rawanya punya metadata. Satu heuristik pamungkas: format tabel yang 'terbaik' adalah yang tim-mu berani operasikan jam 2 pagi saat pager berbunyi — dokumentasi runbook compaction, rollback snapshot, dan expire ada sebelum insiden, bukan ditulis saat insiden. Teknologi tanpa runbook = hobi, bukan produksi.",
      },
      reference: "Compaction = background, prioritaskan tabel panas. Delete: CoW (jarang), MoR/deletion vectors (sering) + compaction. Evolusi skema/partisi via metadata. ACID = optimistic + retry. Satu format standar.",
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
        "Format tabel terbuka = lapisan metadata (metadata → snapshot → manifest → data files) di atas Parquet/ORC di object storage; file-nya tetap Parquet biasa.",
        "Tulis = snapshot baru (immutable); time travel & rollback = operasi metadata; hidden partitioning dan schema evolution bawaan.",
        "Iceberg = diplomat multi-engine (v3 2025: deletion vectors, VARIANT, row lineage; Snowflake penuh April 2025); Delta = anak emas Databricks/Spark; Hudi = petarung upsert/streaming.",
        "Small files (< 128MB) menumpuk dari streaming → pantau rasio dan jadwalkan compaction; target 128–512MB per file.",
        "Pilih berdasar arsitektur 3 tahun ke depan; tabel kecil jarang berubah cukup Parquet mentah.",
      ],
      quiz: [
        {
          q: "Apa yang MEMBEDAKAN tabel Iceberg dari sekumpulan file Parquet mentah?",
          options: [
            { text: "Lapisan metadata: snapshot, manifest, skema berversi — yang memberi transaksi, time travel, dan schema evolution", why: "Benar: file-nya sama-sama Parquet; yang baru adalah katalog + snapshot di atasnya.", correct: true },
            { text: "Format file-nya berbeda dan lebih terkompresi", why: "Salah: Iceberg memakai Parquet/ORC biasa — bukan format file baru." },
            { text: "Hanya bisa dibaca oleh Spark", why: "Salah: justru sebaliknya — Iceberg dirancang engine-agnostic (Trino, Flink, Snowflake, BigQuery)." },
            { text: "Datanya disimpan di database, bukan object storage", why: "Salah: data tetap di object storage murah; yang ditambahkan hanya metadata." },
          ],
        },
        {
          q: "Query `SELECT ... FOR TIMESTAMP AS OF '2025-10-01'` mengembalikan data lama. Bagaimana ini bisa murah?",
          options: [
            { text: "Snapshot lama tetap tersimpan; query hanya membaca metadata snapshot itu — tanpa restore backup", why: "Benar: snapshot immutable + manifest = time travel adalah operasi pilihan katalog, bukan pemulihan data.", correct: true },
            { text: "Karena ada backup harian yang di-restore otomatis", why: "Salah: tidak ada restore yang terjadi — snapshot adalah bagian arsitektur, bukan backup." },
            { text: "Karena data diduplikasi setiap ada perubahan", why: "Salah: snapshot baru hanya mencatat file yang berubah (copy-on-write metadata); file lama dipakai ulang." },
            { text: "Tidak mungkin murah — pasti lambat", why: "Salah: justru ini keunggulan arsitektur snapshot dibanding backup tradisional." },
          ],
        },
        {
          q: "Perusahaan memakai Spark (ETL), Trino (ad-hoc), dan berencana Snowflake (BI). Format yang paling masuk akal?",
          options: [
            { text: "Iceberg — didukung penuh ketiga engine, netral vendor", why: "Benar: kasus multi-engine adalah habitat alami Iceberg; Snowflake penuh sejak April 2025.", correct: true },
            { text: "Delta Lake — karena paling populer", why: "Salah: popularitas bukan kriteria; dukungan Trino/Snowflake untuk Delta lebih terbatas dibanding Iceberg." },
            { text: "Hudi — karena paling cepat", why: "Salah: “paling cepat” hanya untuk upsert/streaming — bukan kriteria kasus ini yang baca-analitik." },
            { text: "Tetap Parquet mentah — paling sederhana", why: "Salah: kesederhanaan file mentah dibayar dengan tidak adanya transaksi, time travel, dan schema evolution." },
          ],
        },
        {
          q: "Tabel streaming menghasilkan 10.000 file 5MB per hari. Masalah dan solusinya?",
          options: [
            { text: "Small files: overhead manifest + request storage meledak — jadwalkan compaction berkala ke 128–512MB", why: "Benar: 10.000 file kecil = 10.000 pembuka file per query. Compaction menggabungkan tanpa mengubah logika.", correct: true },
            { text: "Tidak masalah — file kecil lebih cepat dibaca", why: "Salah: justru sebaliknya — overhead per file (open, manifest, request) mendominasi untuk file kecil." },
            { text: "Hapus file lama setiap hari", why: "Salah: menghapus merusak time travel dan riwayat; yang benar menggabungkan (compaction), bukan menghapus." },
            { text: "Ganti ke format baris seperti CSV", why: "Salah: CSV tidak menyelesaikan small files dan kehilangan kompresi + skema kolom Parquet." },
          ],
        },
        {
          q: "Apa arti “hidden partitioning” bagi penulis query?",
          options: [
            { text: "Cukup tulis WHERE tanggal = X — engine menerjemahkan ke partisi via metadata, tanpa tahu layout fisik", why: "Benar: partisi adalah fungsi transformasi yang tercatat di metadata; layout fisik bisa berubah tanpa merusak query.", correct: true },
            { text: "Partisinya disembunyikan agar tidak bisa di-query", why: "Salah: “hidden” = tersembunyi dari keharusan menuliskannya, bukan dari query." },
            { text: "Tidak ada partisi sama sekali", why: "Salah: partisi tetap ada secara fisik — yang disembunyikan adalah detail layout-nya dari penulis query." },
            { text: "Partisi dibuat otomatis tanpa bisa diatur", why: "Salah: transformasi partisi didefinisikan saat membuat tabel dan bisa berevolusi (partition evolution)." },
          ],
        },
        {
          q: "Tabel menerima 10.000 delete/jam dari CDC. Mekanisme delete dan perawatan yang tepat?",
          options: [
            { text: "Deletion vectors / merge-on-read + compaction terjadwal untuk tumpukan delete files", why: "Benar: CoW me-rewrite file tiap delete (mahal); MoR/deletion vectors murah saat tulis — tetapi tumpukan delete file harus digabung berkala.", correct: true },
            { text: "Copy-on-write setiap jam", why: "Salah: rewrite seluruh file yang tersentuh delete tiap jam = biaya tulis raksasa untuk 10.000 delete kecil.", correct: false },
            { text: "Biarkan delete files menumpuk — toh hanya metadata", why: "Salah: tumpukan delete file = pajak merge di SETIAP baca — performa query melambat diam-diam.", correct: false },
            { text: "Hapus file Parquet manual yang berisi baris terhapus", why: "Salah: mengutak-atik file di bawah format tabel = merusak snapshot dan katalog — inilah jalan menuju tabel corrupt.", correct: false },
          ],
        },
        {
          q: "Perlu mengubah partisi harian menjadi bulanan pada tabel Iceberg 50 TB. Pendekatan yang benar?",
          options: [
            { text: "Partition evolution — ubah di metadata saja, tanpa rewrite data", why: "Benar: partisi Iceberg adalah transformasi di metadata; evolusi tidak menyentuh 50 TB data fisik.", correct: true },
            { text: "Rewrite seluruh 50 TB dengan layout baru", why: "Salah: itu cara Hive — mahal dan berisiko; justru masalah yang diselesaikan partition evolution.", correct: false },
            { text: "Buat tabel baru dan copy data", why: "Salah: duplikasi 50 TB + downtime baca + dua tabel untuk disinkronkan — hindari bila ada evolusi metadata.", correct: false },
            { text: "Tidak bisa — partisi bersifat permanen", why: "Salah: permanen adalah keterbatasan Hive metastore klasik, bukan Iceberg.", correct: false },
          ],
        },
      ],
    },
  ],
};
