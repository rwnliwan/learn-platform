import type { V2Lesson } from "../lib/types";

// ── Figure: downtime deploy DDL manual vs migrasi berversi ─────────────────
const MIG_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang downtime dan kegagalan deploy: DDL manual vs migrasi berversi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g>
<rect x="100" y="86" width="60" height="120" fill="var(--chart-text)" opacity="0.5"/>
<text x="130" y="78" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">45 mnt</text>
<text x="130" y="224" text-anchor="middle" font-size="11" fill="var(--text)">DDL manual</text>
<rect x="230" y="186" width="60" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="260" y="178" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">~0</text>
<text x="260" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Migrasi berversi</text>
<rect x="380" y="126" width="60" height="80" fill="var(--chart-text)" opacity="0.5"/>
<text x="410" y="118" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1 dari 4</text>
<text x="410" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Deploy gagal manual</text>
<rect x="480" y="196" width="40" height="10" fill="var(--c1)" opacity="0.9"/>
<text x="500" y="188" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1 dari 40</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="52" y="30">downtime deploy (kiri) &amp; rasio deploy gagal (kanan) — ilustrasi</text>
</g>
</svg>`;

export const dba15: V2Lesson = {
  slug: "dba15-schema-change",
  track: "Database Administrator",
  module: "Fondasi Operasi",
  title: "Schema Change Management: Flyway, Liquibase & DDL Tanpa Downtime",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "ALTER TABLE yang mengunci produksi 45 menit",
      prose: [
        "Jumat malam, tim merilis fitur baru yang butuh kolom tambahan di tabel transaksi — 800 juta baris. DBA menjalankan `ALTER TABLE transaksi ADD COLUMN status_baru VARCHAR(20)` langsung di produksi. Di database itu, operasi ini menulis ulang seluruh tabel sambil memegang lock eksklusif. Tiga menit berlalu, aplikasi mulai timeout. Sepuluh menit, antrean transaksi menumpuk. Empat puluh lima menit kemudian kolom berhasil ditambahkan — dan tim memadamkan kebakaran hingga jam 3 pagi. Twist-nya: tidak ada yang salah dengan SQL-nya. Sintaksnya benar, kolomnya dibutuhkan. Yang salah adalah caranya: DDL destruktif dijalankan langsung, tanpa strategi online, tanpa rollback plan, tanpa bertanya “berapa lama lock ini dipegang?”.",
        "Solusinya adalah schema change management: memperlakukan perubahan skema seperti perubahan kode — berversi, terautomasi, bisa diulang, dan bisa di-rollback. Flyway dan Liquibase adalah dua tool standar industri untuk ini: migrasi ditulis sebagai file berversi (V1__, V2__... atau changeset XML/YAML/SQL), dijalankan berurutan oleh tool, dan dicatat di tabel riwayat — sehingga database mana pun bisa dibawa dari versi 0 ke versi terkini secara deterministik.",
        "Di lesson ini kamu belajar anatomi migrasi berversi, strategi DDL tanpa downtime (expand–migrate–contract), dan cara memilih Flyway vs Liquibase.",
      ],
      tasks: [],
      note: {
        title: "Kenapa DBA modern wajib menguasai migrasi berversi",
        type: "risk",
        body: "Skema adalah kontrak antara database dan semua aplikasi di atasnya. Perubahan skema yang sembrono = memutus kontrak sepihak — aplikasi crash, data terkunci, atau lebih buruk: migrasi setengah jalan yang tidak bisa maju maupun mundur. Migrasi berversi mengubah “doa sebelum ALTER TABLE” menjadi proses yang teruji.",
      },
      reference: "Skema = kontrak. Migrasi berversi = perubahan kontrak yang tercatat, teruji, dan bisa dibatalkan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan alur migrasi berversi (baseline → migrate → validate → rollback plan); (2) membedakan migrasi destruktif vs non-destruktif dan strategi expand–migrate–contract; (3) membedakan Flyway vs Liquibase dan memilih berdasar kebutuhan tim; (4) menghitung jendela lock DDL dan memutuskan strategi online.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (migrasi berversi; DDL tanpa downtime) → lab Python (simulator antrian migrasi + validasi urutan) → chart manual vs berversi → peta keputusan → mini-case rename kolom → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari arsitektur database: DDL (CREATE/ALTER/DROP) mengubah struktur, bukan isi — dan banyak operasi DDL memegang lock yang memblokir baca/tulis selama berjalan; di tabel besar, “sebentar” bisa berarti puluhan menit. Dari CI/CD untuk data: kode aplikasi sudah melewati pipeline otomatis (test → review → deploy bertahap) — lesson ini menerapkan disiplin yang sama ke skema database: tidak ada DDL yang lolos tanpa versi, review, dan uji.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap skema database seperti API publik — setiap perubahan harus backward-compatible dulu, baru bersih-bersih kemudian. Aturan yang sama dengan versioning API berlaku untuk tabel.",
      ],
      reference: "Bekal: (1) DDL = lock yang bisa lama di tabel besar; (2) disiplin CI/CD berlaku untuk skema juga.",
    },
    {
      id: "konsep-migrasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Migrasi Berversi — Si Arsiparis Skema",
      prose: [
        "Definisi: migrasi berversi adalah file perubahan skema yang diberi nomor urut dan dijalankan sekali secara berurutan oleh tool. Flyway memakai konvensi nama `V1__buat_tabel_nasabah.sql`, `V2__tambah_kolom_status.sql` — tool mencatat versi yang sudah jalan di tabel `flyway_schema_history`, sehingga database selalu tahu “saya di versi berapa” dan hanya menjalankan yang belum. Liquibase memakai changeset (XML/YAML/JSON/SQL) dengan id + author, mencatat di `DATABASECHANGELOG`, dan mendukung rollback otomatis per changeset serta prasyarat (preconditions).",
        "Kepribadiannya: seperti arsiparis yang menyimpan setiap amandemen undang-undang dengan nomor dan tanggal — tidak ada pasal yang berubah tanpa tercatat siapa, kapan, dan apa isinya. Database tanpa migrasi berversi seperti undang-undang yang diubah dengan spidol di naskah asli: tidak ada yang tahu versi mana yang berlaku. Sifat kuncinya: (1) berurutan & idempoten — dijalankan sekali, dalam urutan yang sama di semua environment; (2) tercatat — tabel riwayat adalah sumber kebenaran versi; (3) teruji — migrasi jalan di CI melawan database tiruan sebelum menyentuh produksi.",
        "Kapan memakai: setiap perubahan skema di semua environment — dev, staging, prod. Tidak ada “DDL cepat langsung di prod” — itulah yang diperangi. Flyway cocok untuk tim yang nyaman dengan SQL murni dan ingin sederhana; Liquibase cocok untuk tim yang butuh database-agnostic (satu changeset jalan di Oracle, Postgres, MySQL), rollback deklaratif, dan dokumentasi changeset.",
      ],
      formula: String.raw`\text{waktu lock} \approx \frac{\text{baris} \times \text{biaya per baris}}{\text{throughput}} + \text{lock akuisisi}`,
      formulaNote: "Estimasi kasar durasi DDL yang me-lock tabel. Contoh: 800 juta baris × rewrite = puluhan menit lock eksklusif — inilah yang terjadi di cerita pembuka. Interpretasi: hitung dulu SEBELUM menjalankan; bila hasilnya melebihi jendela toleransi (mis. > 1 menit untuk tabel transaksi), pakai strategi online (expand–migrate–contract), bukan DDL langsung.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Migrasi berversi = tinggal bungkus ALTER TABLE jadi file V1__”",
        type: "pitfall",
        body: "Yang benar: membungkus DDL destruktif menjadi file berversi hanya membuat kegagalan menjadi TERDOKUMENTASI — tetap gagal. Migrasi berversi mengatur URUTAN dan KETERULANGAN; keamanan DDL-nya sendiri (non-destruktif, online) tetap harus dirancang per migrasi. File berversi tanpa strategi = arsip kegagalan yang rapi.",
      },
      hints: [
        "💡 Intuisi: tabel riwayat migrasi (flyway_schema_history / DATABASECHANGELOG) adalah “git log” database-mu. Saat insiden, pertanyaan pertama bukan “apa yang berubah?” melainkan “versi berapa yang sedang jalan, dan apa isi migrasinya?”.",
      ],
      reference: "Flyway = SQL + konvensi nama V__. Liquibase = changeset + rollback + preconditions. Keduanya: urut, tercatat, teruji.",
    },
    {
      id: "konsep-online",
      eyebrow: "Langkah 4 · Konsep",
      title: "Expand–Migrate–Contract — Si Pesulap Tiga Babak",
      prose: [
        "Definisi: strategi DDL tanpa downtime dalam tiga fase. Expand: tambahkan struktur BARU tanpa menghapus yang lama (tambah kolom baru nullable, buat tabel bayangan) — aplikasi lama tetap jalan. Migrate: pindahkan/mutakhirkan data secara bertahap (backfill) sambil kedua struktur hidup — tulis ke keduanya (dual-write) bila perlu. Contract: setelah semua aplikasi memakai struktur baru, hapus yang lama. Tidak ada fase yang memutus aplikasi yang sedang jalan.",
        "Kepribadiannya: seperti pesulap yang mengganti taplak meja tanpa menjatuhkan piring — ia membentangkan taplak baru DI ATAS yang lama (expand), memindahkan piring satu per satu (migrate), lalu menarik taplak lama dari bawah (contract). Penonton (aplikasi) tidak pernah melihat meja telanjang. Lawannya — “tarik taplak langsung” (ALTER destruktif) — hanya berhasil di meja kecil; di meja perjamuan 800 juta baris, piring beterbangan.",
        "Kapan memakai: setiap perubahan pada tabel besar/produksi — tambah kolom NOT NULL (expand: tambah nullable → backfill → set NOT NULL), rename kolom (tambah kolom baru → dual-write → migrasi baca → hapus lama), ubah tipe data. Kapan boleh DDL langsung: tabel kecil/non-produksi di jendela maintenance — tetapi tetap via migrasi berversi agar tercatat.",
      ],
      formula: String.raw`\text{aman} \iff \text{expand} \land \text{migrate} \land \text{contract} \quad \text{(tidak ada lompat fase)}`,
      formulaNote: "Syarat keamanan: ketiga fase harus dilalui berurutan — tidak boleh melompat dari expand langsung ke contract (menghapus yang lama sebelum migrasi selesai = kehilangan data), dan tidak boleh menggabung expand+migrate dalam satu deploy bila aplikasi lama masih membaca struktur lama. Setiap fase = satu rilis yang bisa di-rollback independen.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Kolom NOT NULL bisa langsung ditambah dengan DEFAULT”",
        type: "pitfall",
        body: "Yang benar: di banyak database, ADD COLUMN ... NOT NULL DEFAULT menulis ulang seluruh tabel (lock lama) — atau lebih buruk, gagal di tengah. Pola aman: tambah NULLABLE → backfill bertahap → validasi tidak ada NULL → baru SET NOT NULL. Tiga langkah, bukan satu.",
      },
      hints: [
        "💡 Intuisi: setiap migrasi destruktif punya “kembaran aman”-nya — DROP COLUMN → tandai deprecated dulu; RENAME → alias/dual-write dulu; ALTER TYPE → kolom baru + backfill dulu. Hafalkan kembarannya, bukan larangannya.",
      ],
      reference: "Expand (tambah baru) → Migrate (pindah data) → Contract (hapus lama). Tiap fase = rilis independen.",
    },
    {
      id: "lab-antrian",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Simulator antrian migrasi",
      prose: [
        "Waktunya jadi tool migrasinya. Di bawah ada daftar file migrasi (sintetis) — sebagian penomorannya rusak (duplikat, lompat). Tugasmu: tulis validator yang (1) mengurutkan migrasi, (2) mendeteksi nomor duplikat dan lompatan, (3) mensimulasikan `migrate()`: jalankan yang versinya > versi database saat ini, dan (4) tandai migrasi destruktif (mengandung kata DROP/RENAME/ALTER TYPE) yang butuh review.",
        "Coba: setelah lolos, tambahkan `V4__drop_kolom_lama.sql` (destruktif) dan lihat ia ditandai butuh review. Lalu tanya: kenapa tool migrasi menandai, bukan melarang, migrasi destruktif? (Petunjuk: contract phase memang butuh DROP — yang dilarang adalah DROP tanpa strategi.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `versi(nama)`: ambil angka dari nama file (mis. V12__x.sql → 12)" },
        { id: "t2", text: "Hitung `duplikat` = daftar nomor versi yang muncul > 1 kali" },
        { id: "t3", text: "Lengkapi `migrate(db_versi)`: kembalikan daftar nama file dengan versi > db_versi, terurut" },
        { id: "t4", text: "Kumpulkan `butuh_review` = migrasi pending yang mengandung DROP/RENAME/ALTER TYPE" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "db versi 1, pending: 4 migrasi\nduplikat: [3]\nbutuh review: ['V3__rename_kolom_status.sql']",
      code: {
        starter: `# File migrasi di folder db/migration (SINTETIS)
files = [
    "V1__buat_tabel_nasabah.sql",
    "V2__tambah_kolom_status.sql",
    "V3__rename_kolom_status.sql",
    "V3__tambah_indeks_status.sql",  # duplikat nomor!
    "V5__tambah_kolom_limit.sql",    # lompat dari 3 ke 5
]
DB_VERSI = 1  # database saat ini di versi 1

# TULIS KODEMU DI BAWAH INI
def versi(nama):
    return

duplikat = []  # TODO: nomor versi yang muncul lebih dari sekali

def migrate(db_versi):
    return

pending = []  # TODO: migrate(DB_VERSI)

butuh_review = []  # TODO: pending yang mengandung DROP/RENAME/ALTER TYPE

print(f"db versi {DB_VERSI}, pending: {len(pending)} migrasi")
print(f"duplikat: {duplikat}")
print(f"butuh review: {butuh_review}")`,
        lockLines: 9,
        solution: `# File migrasi di folder db/migration (SINTETIS)
files = [
    "V1__buat_tabel_nasabah.sql",
    "V2__tambah_kolom_status.sql",
    "V3__rename_kolom_status.sql",
    "V3__tambah_indeks_status.sql",  # duplikat nomor!
    "V5__tambah_kolom_limit.sql",    # lompat dari 3 ke 5
]
DB_VERSI = 1  # database saat ini di versi 1

# TULIS KODEMU DI BAWAH INI
def versi(nama):
    angka = ""
    for c in nama[1:]:
        if c.isdigit():
            angka += c
        else:
            break
    return int(angka)

from collections import Counter
hitung = Counter(versi(f) for f in files)
duplikat = sorted(v for v, n in hitung.items() if n > 1)

def migrate(db_versi):
    return sorted([f for f in files if versi(f) > db_versi], key=versi)

pending = migrate(DB_VERSI)

KATA_BAHAYA = ("DROP", "RENAME", "ALTER TYPE")
butuh_review = [f for f in pending if any(k in f.upper() for k in KATA_BAHAYA)]

print(f"db versi {DB_VERSI}, pending: {len(pending)} migrasi")
print(f"duplikat: {duplikat}")
print(f"butuh review: {butuh_review}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pending", value: ["V2__tambah_kolom_status.sql", "V3__rename_kolom_status.sql", "V3__tambah_indeks_status.sql", "V5__tambah_kolom_limit.sql"], tol: 0, label: "4 migrasi pending terurut", msg: "Semua file versi > 1, terurut by versi." },
          { kind: "equal", task: "t2", name: "duplikat", value: [3], tol: 0, label: "`duplikat` = [3]", msg: "Dua file memakai nomor V3." },
          { kind: "equal", task: "t4", name: "butuh_review", value: ["V3__rename_kolom_status.sql"], tol: 0, label: "Rename terdeteksi butuh review", msg: "RENAME = destruktif, butuh strategi expand-migrate-contract." },
          { kind: "stdout_matches", task: "t5", pattern: "pending: 4 migrasi", label: "Ringkasan pending tercetak", msg: "Baris pertama: 'db versi 1, pending: 4 migrasi'." },
          { kind: "stdout_matches", task: "t5", pattern: "duplikat: \\[3\\]", label: "Duplikat tercetak", msg: "Baris kedua: 'duplikat: [3]'." },
        ],
      },
      reference: "Validator migrasi: urutkan, deteksi duplikat/lompat, tandai destruktif. Jalan di CI sebelum prod.",
    },
    {
      id: "chart-migrasi",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart DDL manual vs migrasi berversi",
      prose: [
        "Chart di bawah membandingkan dua pendekatan perubahan skema (ilustrasi dari cerita pembuka).",
        "Cara membaca: dua batang kiri = downtime per deploy DDL besar (45 menit manual vs ~0 migrasi online berversi). Dua batang kanan = rasio deploy yang gagal/bermasalah (1 dari 4 manual vs 1 dari 40 berversi).",
        "Interpretasi: DDL manual bukan cuma lambat — ia gagal 10× lebih sering, karena tidak ada uji, tidak ada urutan pasti, dan tidak ada rollback plan. Migrasi berversi tidak menghilangkan risiko sepenuhnya (1 dari 40 tetap gagal — biasanya karena strategi DDL-nya sendiri buruk), tetapi mengubah kegagalan dari “kebakaran 45 menit” menjadi “rollback terkendali”. Pelajaran chart ini: yang dibeli bukan kecepatan — melainkan prediktabilitas.",
      ],
      figure: {
        svg: MIG_SVG,
        alt: "Diagram batang: downtime 45 menit vs ~0; deploy gagal 1 dari 4 vs 1 dari 40.",
        caption: "DDL manual vs migrasi berversi: downtime dan rasio kegagalan (ilustrasi).",
      },
      tasks: [],
      reference: "Migrasi berversi membeli prediktabilitas: downtime ~0, kegagalan 10× lebih jarang.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Perubahan skema datang — strategi apa?",
      prose: [
        "Empat skenario keputusan schema change:",
        "Skenario 1 — Tambah kolom opsional di tabel kecil non-kritis. → Migrasi berversi biasa (Flyway V__ atau changeset Liquibase), DDL langsung boleh. Alasan: risiko rendah, tetapi tetap tercatat dan teruji di CI.",
        "Skenario 2 — Tambah kolom NOT NULL di tabel transaksi 800 juta baris. → Expand–migrate–contract: tambah NULLABLE → backfill bertahap → validasi → SET NOT NULL. Alasan: DDL langsung = lock 45 menit seperti cerita pembuka.",
        "Skenario 3 — Rename kolom yang dibaca 5 aplikasi. → Tambah kolom baru + dual-write + migrasi aplikasi satu per satu + hapus lama (contract). Alasan: rename atomik memutus 5 aplikasi sekaligus; strategi bertahap memutus nol.",
        "Skenario 4 — Hotfix prod: kolom salah tipe dan aplikasi crash. → Darurat: perbaiki via migrasi berversi juga (jangan DDL liar) — buat file migrasi darurat, review cepat, jalankan via tool. Alasan: DDL darurat yang tidak tercatat menjadi “versi hantu” — database prod lebih baru dari riwayat migrasi, dan deploy berikutnya kacau.",
        "Aturan praktis 10 detik: ubah skema? → (1) tulis sebagai migrasi berversi; (2) destruktif? → expand–migrate–contract; (3) tabel besar? → hitung lock dulu; (4) uji di CI + staging; (5) rollback plan siap.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjalankan migrasi di produksi tanpa menjalankannya di staging yang ukurannya mirip. Migrasi yang “lolos” di database dev 10 ribu baris bisa me-lock 45 menit di produksi 800 juta baris. Staging harus mirip produksi dalam ukuran, bukan cuma skema.",
      },
      reference: "Semua skema via migrasi berversi — termasuk hotfix darurat. Staging mirip ukuran produksi.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Rename kolom `status` → `status_transaksi` di 5 aplikasi",
      prose: [
        "Skenario (sintetis, untuk latihan): kolom `status` di tabel transaksi harus di-rename menjadi `status_transaksi` agar konsisten dengan konvensi baru. Lima aplikasi membaca kolom ini; downtime tidak boleh lebih dari 1 menit; tabel 800 juta baris.",
        "Pertanyaan analisis: (1) Kenapa `ALTER TABLE ... RENAME COLUMN` langsung berbahaya di sini? (2) Rancang 3 fase expand–migrate–contract untuk kasus ini. (3) Apa rollback plan tiap fase?",
        "Pembahasan: (1) Rename langsung memutus 5 aplikasi seketika — semua query yang menyebut `status` error sampai aplikasinya di-deploy ulang; jendela ketidaksinkronan = downtime. Di tabel 800 juta baris, operasi katalognya sendiri bisa me-lock. (2) Expand (rilis 1): tambah kolom `status_transaksi` nullable + trigger/dual-write agar selalu sama dengan `status`; aplikasi masih baca `status`. Migrate (rilis 2–3): backfill `status_transaksi` untuk baris lama; migrasikan 5 aplikasi satu per satu untuk membaca kolom baru (tulis ke keduanya selama transisi). Contract (rilis 4): setelah semua aplikasi memakai kolom baru + periode observasi, hapus kolom `status` dan dual-write. (3) Rollback: fase expand → hapus kolom baru (tidak ada yang memakainya); fase migrate → kembalikan aplikasi ke baca kolom lama (kolom lama masih ada!); fase contract → tidak ada rollback murah — itu sebabnya contract hanya setelah observasi cukup.",
        "Catatan Flyway/Liquibase: tiap fase = satu file migrasi berversi (V10 expand, V11 backfill, V12 contract) — bukan satu file raksasa. Fase yang gagal bisa diinvestigasi tanpa membatalkan yang sudah sukses.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rename kolom terlihat sepele — tetapi ia mengubah kontrak dengan 5 aplikasi sekaligus. Dalam risk register, “perubahan skema tanpa strategi” adalah risiko operasional dengan dampak tinggi dan probabilitas yang sepenuhnya bisa dikendalikan. Tidak ada alasan untuk mengambil risiko ini.",
      },
      reference: "Rename = 3+ rilis bertahap, bukan 1 ALTER. Kolom lama adalah jaring pengamanmu — jangan dilepas duluan.",
    },
    {
      id: "pendalaman-osc",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Migrasi Online Lanjutan: pt-osc, gh-ost & Backfill Bertahap",
      prose: [
        "Pola expand–migrate–contract adalah strateginya; perkakas migrasi online adalah taktiknya. Dua standar industri: pt-online-schema-change (pt-osc, bagian dari Percona Toolkit untuk MySQL) dan gh-ost (buatan GitHub). Cara kerja pt-osc: buat tabel bayangan kosong dengan skema baru, salin baris dalam chunk kecil, pasang trigger INSERT/UPDATE/DELETE di tabel asli agar setiap tulis selama penyalinan ikut direplikasi ke tabel bayangan, lalu tukar keduanya dengan RENAME yang atomik. Trigger adalah harga yang dibayar: selama migrasi berjalan, setiap tulis aplikasi menanggung overhead trigger — di tabel dengan write-rate tinggi bebannya bisa berlipat ganda dan memicu lag replikasi. pt-osc memang bisa di-throttle (berjeda saat lag melewati ambang), tetapi trigger tetap terpasang selama proses berlangsung.",
        "gh-ost menempuh jalan tanpa trigger: ia membaca binlog (format ROW) untuk menangkap perubahan, menerapkannya ke tabel bayangan, dan hanya melakukan cutover saat kamu memerintahkan. Keunggulannya: bisa diuji di replika terlebih dahulu, bisa dijeda atau dibatalkan kapan saja tanpa sisa (cukup drop tabel bayangan), dan tidak membebani tulis aplikasi dengan trigger. Syaratnya: binlog ROW wajib aktif, dan ia tidak menangani foreign key dengan baik — gh-ost membangun tabel bayangan tanpa FK, sehingga untuk tabel yang terikat constraint ke tabel lain, cutover bisa meloloskan hilangnya jaminan integritas. Aturan keputusannya: write-rate tinggi tetapi overhead trigger masih bisa ditoleransi → pt-osc; butuh testabilitas dan zero-trigger → gh-ost; tabel penuh foreign key kritis → jangan pakai keduanya, kerjakan manual expand–migrate–contract dengan dual-write agar constraint diuji eksplisit di tiap fase.",
        "Backfill — memindahkan data ke struktur baru — punya hukumnya sendiri: jangan pernah satu UPDATE raksasa. Satu UPDATE untuk 800 juta baris berarti satu transaksi raksasa: lock yang lama, rollback segment yang membengkak, dan lonjakan lag replikasi. Pola yang benar: loop UPDATE kecil berdasar primary key (WHERE id BETWEEN x AND y), tanpa OFFSET — OFFSET memindai ulang dari awal di tiap iterasi sehingga makin jauh makin lambat; keyset pagination jauh lebih murah. Tiap chunk harus idempoten, mis. WHERE kolom_baru IS NULL, sehingga chunk yang gagal bisa diulang tanpa merusak data. Beri jeda antar chunk, atau lebih baik: jadikan lag replika sebagai rem otomatis — lanjut hanya bila lag di bawah ambang. Kegagalan nyata: backfill tanpa chunk menaikkan lag replika 40 menit sehingga traffic baca yang dilayani replika mendapat data basi; backfill di jam sibuk tanpa jeda memicu deadlock dengan tulis aplikasi. Keduanya bukan bug perkakas — melainkan tidak adanya strategi.",
        "Bahkan perkakas “online” pun butuh lock sesaat saat cutover (RENAME). Ukur dulu: cutover aman bila lock RENAME lebih singkat dari timeout aplikasi; bila tidak, kecilkan lock_wait_timeout di sesi migrasi agar DDL yang macet gagal cepat alih-alih antre di belakang transaksi panjang — DDL yang menunggu lock akan memblokir semua query di belakangnya, tumpukan “waiting for table metadata lock” yang klasik itu. Pasang statement_timeout di sesi migrasi sebagai sabuk pengaman kedua. Dan ingat: online bukan berarti gratis — penyalinan 800 juta baris tetap memakan I/O dan slot replikasi; jadwalkan di jendela sepi walau perkakasnya “online”. Jendela maintenance tidak mati; ia hanya berubah fungsi dari “wajib” menjadi “bijak”.",
        "Terakhir: rencana rollback per fase, ditulis SEBELUM migrasi berjalan. Sebelum cutover (pt-osc/gh-ost): rollback = drop tabel bayangan — nol risiko, nyaris gratis. Setelah cutover: tidak ada “undo” ajaib — rollback adalah migrasi baru yang ditulis dan diuji seperti migrasi biasa. Untuk expand–migrate–contract manual: fase expand dibatalkan dengan menghapus struktur baru; fase migrate dibatalkan dengan kembali membaca struktur lama (yang belum dihapus!); fase contract tidak punya rollback murah — itulah kenapa ia terakhir dan hanya setelah periode observasi. Kegagalan nyata: tim menjalankan gh-ost di tabel ber-FK, cutover sukses, dan tiga minggu kemudian muncul baris orphan — constraint yang hilang di tabel bayangan tidak ketahuan sampai data rusak. Daftar periksa senior sebelum migrasi apa pun: (1) bisakah saya membatalkannya kapan saja tanpa kerusakan? (2) berapa lama lock cutover dibanding timeout aplikasi? (3) rem lag replika terpasang? (4) inventaris FK dan trigger selesai? (5) rollback-nya adalah file migrasi nomor berapa? Lima jawaban “ya” berarti jalan; satu “belum” berarti tunda.",
        "Terakhir, matriks keputusan per jenis perubahan — karena tidak semua DDL butuh senjata berat. Tambah kolom nullable: migrasi berversi biasa, online trivial. Tambah kolom NOT NULL: tambah nullable → backfill bertahap → validasi → SET NOT NULL (tiga rilis). Rename kolom: kolom baru + dual-write + migrasi baca aplikasi satu per satu + contract (tiga rilis atau lebih). Ubah tipe data: kolom baru dengan tipe target + backfill + alihkan baca + hapus lama — jangan ALTER TYPE langsung di tabel besar. Drop kolom: tandai deprecated dulu (biarkan satu-dua rilis), baru contract. Tambah index: CREATE INDEX CONCURRENTLY agar tidak me-lock tulis. Aturan seniornya: pilih strategi dari JENIS perubahannya, bukan dari kebiasaan; tiap jenis punya “kembaran aman” yang sudah baku — dan bila jenisnya tidak ada di matriks, default-nya adalah expand–migrate–contract manual sampai terbukti aman.",
      ],
      formula: String.raw`\text{waktu\_backfill} \approx \frac{\text{baris}}{\text{chunk\_size}} \times (\text{waktu\_per\_chunk} + \text{jeda})`,
      formulaNote: "Estimasi durasi backfill bertahap. baris = total baris; chunk_size dipilih agar waktu_per_chunk 1–5 detik (ukur di staging berukuran mirip produksi); jeda = throttle 0,1–1 detik atau adaptif mengikuti lag replika. Contoh: 800 juta baris / chunk 10 ribu = 80 ribu chunk × (2 dtk + 0,5 dtk) ≈ 55 jam — terlalu lambat untuk jendela yang tersedia, berarti chunk perlu dibesarkan (awasi lag) atau dipakai perkakas online. Interpretasi: rumus ini mengubah “backfill semalaman” dari harapan menjadi aritmetika; bila hasilnya melebihi jendela, rencananya yang salah, bukan angkanya.",
      tasks: [],
      note: {
        title: "Intuisi: migrasi online yang aman terasa membosankan",
        body: "Migrasi yang membuatmu deg-degan biasanya migrasi yang belum siap. Heuristik para praktisi: pertama, uji “bisakah saya kill -9 proses ini kapan saja?” — bila jawabannya ya tanpa merusak apa pun (tabel bayangan bisa di-drop, chunk idempoten, kolom lama masih ada), migrasimu aman; bila tidak, kamu sedang berjudi. Kedua, curigai migrasi yang “cepat selesai” di tabel besar — penyalinan 800 juta baris tidak mungkin selesai dalam semenit; yang terlalu cepat biasanya melewatkan sesuatu, entah throttle atau verifikasi. Ketiga, ukur lock cutover di staging lalu kalikan tiga untuk produksi — staging selalu lebih jinak dari kenyataan. Keempat, lag replika adalah batas kecepatan yang sebenarnya, bukan I/O disk — throttle yang mengikuti lag tidak pernah salah arah. Kelima, foreign key berarti kerja manual: tidak ada perkakas yang boleh memutuskan nasib constraint-mu; uji constraint secara eksplisit di tiap fase expand–migrate–contract. Keenam, setelah cutover jangan langsung DROP tabel lama — rename dulu dan biarkan hidup beberapa hari sebagai jaring pengaman; contract yang ditunda seminggu tidak pernah membunuh siapa pun, contract yang terburu-buru pernah. Membosankan berarti bisa diprediksi, dan bisa diprediksi berarti profesional.",
      },
      reference: "pt-osc = trigger + chunk copy; gh-ost = binlog ROW tanpa trigger, tanpa FK. Backfill = chunk idempoten + rem lag. Rollback ditulis sebelum jalan.",
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
        "Migrasi berversi (Flyway V__/Liquibase changeset): berurutan, tercatat di tabel riwayat, teruji di CI — untuk SEMUA environment termasuk hotfix.",
        "Flyway = SQL sederhana + konvensi nama; Liquibase = database-agnostic + rollback deklaratif + preconditions.",
        "DDL di tabel besar = lock lama; hitung estimasi lock sebelum menjalankan; melebihi toleransi → strategi online.",
        "Expand–migrate–contract: tambah baru → pindah data → hapus lama; tiap fase rilis independen dengan rollback sendiri.",
        "Staging harus mirip produksi dalam ukuran; tiap fase migrasi = satu file berversi, bukan satu raksasa.",
      ],
      quiz: [
        {
          q: "Fungsi utama tabel riwayat migrasi (flyway_schema_history / DATABASECHANGELOG)?",
          options: [
            { text: "Sumber kebenaran versi database: mencatat migrasi apa yang sudah jalan, sehingga hanya yang belum yang dijalankan", why: "Benar: inilah yang membuat migrasi deterministik di semua environment — “database saya di versi berapa?” selalu terjawab.", correct: true },
            { text: "Menyimpan backup data sebelum migrasi", why: "Salah: tabel riwayat menyimpan METADATA migrasi (versi, checksum, waktu), bukan backup data." },
            { text: "Mempercepat eksekusi migrasi", why: "Salah: tidak ada efek kecepatan — fungsinya kebenaran dan keterurutan, bukan performa." },
            { text: "Menggantikan kebutuhan testing migrasi", why: "Salah: pencatatan ≠ pengujian. Migrasi tetap harus diuji di CI/staging." },
          ],
        },
        {
          q: "Butuh menambah kolom NOT NULL di tabel 800 juta baris produksi. Urutan yang aman?",
          options: [
            { text: "Tambah NULLABLE → backfill bertahap → validasi → SET NOT NULL", why: "Benar: tiap langkah non-destruktif dan bisa di-rollback; lock lama dihindari.", correct: true },
            { text: "Langsung ADD COLUMN NOT NULL DEFAULT — satu langkah", why: "Salah: di banyak database ini rewrite tabel + lock lama = cerita pembuka 45 menit." },
            { text: "Buat tabel baru, pindahkan data, rename tabel — dalam satu transaksi", why: "Salah: “satu transaksi” untuk 800 juta baris = lock raksasa + rollback log raksasa. Terdengar atomik, sebenarnya bom." },
            { text: "Tambah kolom di aplikasi saja (ORM), database menyusul", why: "Salah: skema aplikasi dan database yang tidak sinkron = error runtime misterius. Database adalah kontraknya." },
          ],
        },
        {
          q: "Kapan Liquibase lebih cocok daripada Flyway?",
          options: [
            { text: "Tim multi-database (Oracle + Postgres) butuh satu changeset jalan di semua, plus rollback deklaratif", why: "Benar: database-agnostic + rollback per changeset adalah keunggulan utama Liquibase.", correct: true },
            { text: "Selalu — Liquibase selalu lebih baik", why: "Salah: untuk tim SQL-murni satu database, kesederhanaan Flyway justru lebih produktif." },
            { text: "Ketika tidak butuh versioning", why: "Salah: keduanya adalah tool versioning — “tidak butuh versioning” bukan alasan memilih salah satunya." },
            { text: "Ketika migrasi hanya sekali setahun", why: "Salah: frekuensi rendah bukan kriteria pemilihan tool; kebutuhan fitur (agnostic/rollback) yang menentukan." },
          ],
        },
        {
          q: "Fase CONTRACT pada rename kolom dilakukan terlalu dini (aplikasi masih ada yang baca kolom lama). Akibatnya?",
          options: [
            { text: "Aplikasi yang tertinggal error — kolom yang dibacanya sudah dihapus; tidak ada rollback murah", why: "Benar: contract = titik tidak kembali. Itulah kenapa ia terakhir dan hanya setelah observasi cukup.", correct: true },
            { text: "Tidak apa-apa, aplikasi otomatis memakai kolom baru", why: "Salah: aplikasi tidak “otomatis” apa pun — ia membaca nama kolom yang dikodenya." },
            { text: "Bisa di-rollback dengan mudah via tool migrasi", why: "Salah: mengembalikan kolom yang dihapus + datanya tidak semudah rollback DDL biasa — apalagi setelah tulis baru masuk." },
            { text: "Hanya warning di log, aplikasi tetap jalan", why: "Salah: query ke kolom yang tidak ada = error, bukan warning." },
          ],
        },
        {
          q: "Hotfix produksi butuh perubahan skema SEGERA. Praktik yang benar?",
          options: [
            { text: "Tetap via migrasi berversi: file darurat + review cepat + jalankan via tool — tercatat", why: "Benar: darurat mempercepat proses, bukan melewatkannya. DDL liar = versi hantu yang merusak deploy berikutnya.", correct: true },
            { text: "DDL langsung via console — hotfix tidak sempat proses", why: "Salah: “tidak sempat” hari ini = database prod lebih baru dari riwayat migrasi = deploy berikutnya kacau." },
            { text: "Ubah di aplikasi saja, skema nanti", why: "Salah: ketidakcocokan skema aplikasi-database adalah sumber error yang sulit di-debug." },
            { text: "Tunggu jendela maintenance minggu depan", why: "Salah: hotfix yang menunggu seminggu bukan hotfix — ada kalanya kecepatan dibutuhkan, dengan proses yang tetap tercatat." },
          ],
        },
        {
          q: "Tabel 800 juta baris, write-rate sangat tinggi, terikat foreign key ke tabel orders. Pilihan perkakas migrasi online yang paling tepat?",
          options: [
            { text: "Manual expand–migrate–contract dengan dual-write — FK kritis tidak boleh diserahkan ke perkakas yang mengabaikannya; constraint diuji eksplisit tiap fase", why: "Benar: gh-ost menggugurkan FK di tabel bayangan; pt-osc bisa menangani FK tetapi trigger-nya berisiko di write-rate ekstrem. Kombinasi keduanya = kerja manual yang terkontrol adalah pilihan senior.", correct: true },
            { text: "gh-ost — modern, tanpa trigger, pasti aman", why: "Salah: gh-ost tidak menangani foreign key dengan baik; tabel bayangan tanpa FK berarti integritas hilang setelah cutover." },
            { text: "pt-osc dengan throttle agresif", why: "Salah: throttle mengatasi lag replikasi, bukan overhead trigger per tulis; di write-rate ekstrem, trigger tetap menjadi pajak tiap transaksi — dan FK menambah kompleksitas." },
            { text: "ALTER TABLE langsung di jam sepi", why: "Salah: jam sepi tidak mengubah sifat operasi — rewrite 800 juta baris + lock eksklusif tetap terjadi; “sepi” bukan strategi." },
          ],
        },
        {
          q: "Backfill 800 juta baris direncanakan sebagai satu UPDATE raksasa “agar cepat selesai”. Keberatan utama praktisi?",
          options: [
            { text: "Satu transaksi raksasa = lock lama + rollback segment membengkak + lonjakan lag replikasi; chunk kecil idempoten dengan rem lag jauh lebih aman", why: "Benar: kecepatan semu — begitu lag meledak atau deadlock terjadi, “cepat” berubah menjadi insiden.", correct: true },
            { text: "Satu UPDATE justru paling aman karena atomik", why: "Salah: atomik untuk 800 juta baris berarti semua-atau-tidak-sama-sekali dengan harga lock raksasa; atomisitas bukan alasan untuk transaksi raksasa." },
            { text: "Tidak masalah selama dijalankan di replika", why: "Salah: backfill harus berjalan di primary karena data ditulis di sana; menjalankannya di replika tidak memindahkan data apa pun." },
            { text: "Yang penting WHERE-nya pakai OFFSET agar rapi", why: "Salah: OFFSET memindai ulang dari awal tiap iterasi — makin jauh makin lambat; gunakan keyset berdasar primary key." },
          ],
        },
      ],
    },
  ],
};
