import type { V2Lesson } from "../lib/types";

// ── Figure: jumlah permission langsung vs via role ─────────────────────────
const RBAC_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang jumlah assignment permission: langsung per user vs via role">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="46" y="209">0</text><text x="46" y="169">150</text><text x="46" y="129">300</text>
<text x="46" y="89">450</text><text x="46" y="49">600</text>
</g>
<g>
<rect x="130" y="52" width="70" height="154" fill="var(--chart-text)" opacity="0.5"/>
<text x="165" y="44" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">480</text>
<text x="165" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Direct grant</text>
<rect x="330" y="182" width="70" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="365" y="174" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">48</text>
<text x="365" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Via role (RBAC)</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="52" y="30">assignment permission untuk 40 user × 12 dataset (ilustrasi)</text>
</g>
</svg>`;

export const de20: V2Lesson = {
  slug: "de20-access-control",
  track: "Data Engineer",
  module: "Platform Data",
  title: "RBAC & Access Control di Platform Data",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Intern yang bisa membaca gaji direksi",
      prose: [
        "Di sebuah perusahaan teknologi, seorang intern data — minggu kedua kerja — iseng menjalankan `SELECT * FROM payroll` di warehouse. Ia kaget: query-nya jalan. Gaji seluruh direksi tampil di layarnya. Ia lapor ke mentornya, yang pucat: enam bulan lalu, saat migrasi warehouse, seseorang memberikan akses `ALL TABLES` ke grup “data-team” agar “tidak menghambat kerja” — dan tidak pernah dicabut. Twist-nya: tidak ada peretasan, tidak ada kebocoran ke publik, tidak ada niat jahat. Hanya satu grant yang terlalu luas, diberikan dengan alasan produktivitas, yang membuat data paling sensitif perusahaan bisa dibaca siapa saja yang punya akun warehouse — termasuk intern minggu kedua.",
        "Itulah wilayah access control: siapa boleh melakukan apa, terhadap data apa, dalam kondisi apa. Model standarnya adalah RBAC (Role-Based Access Control): permission tidak diberikan ke user langsung, melainkan ke role (peran) — `analyst_finance`, `engineer_data` — dan user mendapatkan role sesuai pekerjaannya. Prinsipnya least privilege: setiap identitas hanya memegang akses minimum yang dibutuhkan untuk tugasnya.",
        "Di lesson ini kamu belajar anatomi RBAC (user–role–permission), teknik lanjutan (row-level security, column masking, ABAC), dan cara mengaudit siapa bisa mengakses apa — sebelum intern berikutnya menemukannya.",
      ],
      tasks: [],
      note: {
        title: "Kenapa access control adalah pekerjaan data engineer",
        type: "risk",
        body: "Di platform data modern, engineer-lah yang membuat tabel, view, dan pipeline — artinya engineer-lah yang menentukan siapa bisa membaca apa. Keamanan bukan “urusan tim security”; ia diimplementasikan di DDL, di GRANT, dan di konfigurasi warehouse yang kamu tulis.",
      },
      reference: "RBAC = permission → role → user. Least privilege = akses minimum untuk tugasnya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan model RBAC (user, role, permission, hierarki) dan kenapa direct grant berbahaya; (2) membedakan kontrol akses level tabel, kolom (masking), dan baris (row-level security); (3) merancang role untuk tim data (engineer, analyst, auditor) dengan least privilege; (4) mengaudit effective permission dan menemukan privilege berlebih.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (RBAC; kontrol halus: masking & RLS) → lab Python (simulator effective permission + deteksi over-privilege) → chart direct vs role → peta keputusan → mini-case akses vendor → kuis → rangkuman. Estimasi 55 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari keamanan & privasi data: data diklasifikasikan berdasar sensitivitas — klasifikasi inilah yang menentukan seberapa ketat kontrolnya; data gaji direksi dan data publik tidak boleh diperlakukan sama. Dari data governance: setiap dataset butuh pemilik (owner) yang berhak memutuskan siapa boleh akses — tanpa owner yang jelas, permintaan akses disetujui “agar tidak menghambat”, dan begitulah intern bisa membaca payroll.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: access control yang baik itu membosankan — permintaan akses ditolak dengan sopan, butuh persetujuan owner, tercatat. Kalau pemberian akses terasa “mudah dan cepat”, biasanya itu bukan efisiensi — itu kelalaian.",
      ],
      reference: "Bekal: (1) klasifikasi sensitivitas menentukan ketatnya kontrol; (2) tiap dataset butuh owner yang memutuskan akses.",
    },
    {
      id: "konsep-rbac",
      eyebrow: "Langkah 3 · Konsep",
      title: "RBAC — Si Penjaga dengan Daftar Tamu Berlapis",
      prose: [
        "Definisi: RBAC (Role-Based Access Control) adalah model kontrol akses di mana permission (izin: SELECT pada tabel X, WRITE pada schema Y) diberikan kepada role, dan user (atau grup/service account) diberikan role. Hierarki umum: role dasar (`data_reader`), role tim (`analyst_finance`), role istimewa (`data_admin`). Prinsip least privilege: mulai dari NOL akses, tambahkan hanya yang dibutuhkan — bukan sebaliknya.",
        "Kepribadiannya: RBAC seperti gedung dengan sistem kartu akses berlapis. Kartu “tamu” hanya membuka lobi; kartu “karyawan finance” membuka lantai finance; kartu “engineer” membuka ruang server — tetapi tidak ada kartu yang membuka semuanya kecuali petugas keamanan. Direct grant (izin langsung ke user) seperti memberi kunci duplikat pintu utama ke tiap orang: praktis hari ini, dan tidak terlacak besok — saat orangnya pindah tim, kuncinya ikut terbawa.",
        "Kapan memakai: selalu, sebagai model dasar. Pengecualian sementara (akses darurat/break-glass) boleh — tetapi dengan masa berlaku (time-bound) dan tercatat, bukan grant permanen. Aturan operasional: review akses berkala (tiap kuartal: apakah role ini masih dibutuhkan?), dan cabut otomatis saat karyawan pindah tim/resign (joiner-mover-leaver).",
      ],
      formula: String.raw`\text{assignment}_{\text{direct}} = u \times p \qquad \text{assignment}_{\text{RBAC}} = u + (r \times p)`,
      formulaNote: "u = jumlah user, p = permission per user, r = jumlah role (r jauh lebih kecil dari u). Contoh: 40 user × 12 permission = 480 assignment langsung yang harus dikelola satu per satu. Dengan 4 role: 40 (user→role) + 4×12 (role→permission) = 88 — dan saat seorang analis pindah tim, cukup cabut 1 role, bukan 12 permission. Interpretasi: RBAC mengubah biaya pengelolaan dari perkalian menjadi penjumlahan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Semua butuh akses semua agar tidak menghambat kerja”",
        type: "pitfall",
        body: "Yang benar: ini alasan klasik setiap pelanggaran least privilege — dan persis yang membuat intern bisa membaca payroll. Hambatan kerja yang nyata diatasi dengan proses permintaan akses yang CEPAT (SLA jam, bukan minggu) dan role yang dirancang baik — bukan dengan membuka semua pintu. Keamanan yang menghambat adalah keamanan yang dirancang buruk, bukan keamanan yang ketat.",
      },
      hints: [
        "💡 Intuisi: desain role mengikuti PEKERJAAN, bukan ORANG. “Analyst Finance butuh baca tabel budget” → role `analyst_finance`. Kalau role dinamai berdasar orang (“akses_budi”), kamu sedang membangun direct grant berkedok role.",
      ],
      reference: "Permission → role → user. Review kuartalan. Mover/leaver = cabut otomatis. Darurat = time-bound.",
    },
    {
      id: "konsep-halus",
      eyebrow: "Langkah 4 · Konsep",
      title: "Masking & Row-Level Security — Si Sensor dan Si Penyekat",
      prose: [
        "Definisi: kontrol akses halus (fine-grained) mengatur BEYOND “boleh baca tabel atau tidak”. Column masking: nilai kolom sensitif disamarkan berdasar role — analis melihat `0812XXXXXX` atau `***`, sedangkan HR melihat nomor penuh (dynamic data masking). Row-level security (RLS): user hanya melihat BARIS yang memenuhi kebijakan — manajer cabang Jakarta hanya melihat baris cabangnya, walau query-nya `SELECT *`. ABAC (Attribute-Based): keputusan akses memakai atribut (departemen, lokasi, jam kerja, klasifikasi data).",
        "Kepribadiannya: masking seperti sensor di acara TV — kata-katanya tetap ada, tetapi penonton umum mendengar “bip”. RLS seperti penyekat ruangan di restoran — semua tamu di gedung yang sama, tetapi hanya melihat mejanya sendiri. Keduanya memungkinkan SATU tabel dipakai banyak pihak dengan “versi kebenaran” yang berbeda-beda — tanpa menduplikasi tabel per tim (duplikasi = mimpi buruk konsistensi).",
        "Kapan memakai: masking untuk kolom yang “perlu terlihat ada, tetapi tidak perlu terlihat isinya” (NIK, nomor HP, gaji — analis butuh tahu kolomnya ada untuk join, tidak butuh isinya); RLS untuk data yang tersegmentasi alami (cabang, region, tim); ABAC untuk aturan kompleks (hanya jam kerja + hanya dari VPN kantor). Kapan TIDAK: jangan pakai RLS sebagai pengganti desain role yang buruk — RLS yang menutupi 50 kebijakan ad-hoc adalah direct grant yang disamarkan.",
      ],
      formula: String.raw`\text{effective permission} = \bigcup_{\text{role} \in \text{roles(user)}} \text{permissions(role)}`,
      formulaNote: "Hak akses efektif seorang user = gabungan (union) permission dari SEMUA role yang ia pegang — termasuk role warisan dari grup dan role default. Contoh: user memegang `analyst_finance` (baca budget) + `data_reader` (baca semua tabel mentah) → ia bisa membaca tabel mentah payroll walau “analyst finance” tidak membutuhkannya. Interpretasi: audit harus menghitung UNION ini — melihat satu role saja menipu.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “View sudah cukup sebagai kontrol akses”",
        type: "pitfall",
        body: "Yang benar: view TANPA kontrol akses yang tepat hanyalah “tabel dengan nama lain” — siapa pun yang bisa query view biasanya bisa menebak tabel aslinya. View menjadi kontrol akses hanya bila dipasangkan dengan: revoke akses tabel dasar + grant hanya ke view + (bila perlu) RLS/masking di dalamnya. View saja = gorden, bukan kunci.",
      },
      hints: [
        "💡 Intuisi: masking bukan enkripsi — ia untuk TAMPILAN, bukan penyimpanan. Data asli tetap ada di storage; yang disamarkan adalah apa yang dilihat role tertentu. Jangan andalkan masking untuk melindungi backup atau file export.",
      ],
      reference: "Masking = samarkan tampilan kolom. RLS = sekat baris. ABAC = aturan berdasar atribut. Audit = hitung union semua role.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Audit effective permission",
      prose: [
        "Waktunya jadi auditor aksesnya. Di bawah ada definisi role → permission, dan user → role (sintetis). Tugasmu: tulis fungsi `effective(user)` yang menghitung gabungan permission dari semua role user, lalu deteksi `over_privilege`: user yang memegang permission `payroll:read` tetapi TIDAK memegang role `hr` (indikasi grant berlebihan).",
        "Coba: setelah lolos, tambahkan role `data_reader` (baca semua tabel mentah, termasuk payroll) ke user `budi`, lalu jalankan ulang — apakah ia kini over-privilege? Itulah kenapa audit harus menghitung union, bukan membaca satu role.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `effective(user)`: kembalikan LIST terurut gabungan permission dari semua role user" },
        { id: "t2", text: "Hitung `eff_budi` = effective('budi')" },
        { id: "t3", text: "Kumpulkan `over` = user dengan 'payroll:read' di effective-nya tetapi tanpa role 'hr'" },
        { id: "t4", text: "Hitung `skor_risiko` = jumlah user over-privilege × 10" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "efektif budi: 4 permission\nover-privilege: ['budi', 'sari']\nskor risiko: 20",
      code: {
        starter: `# Role -> permission, user -> role (SINTETIS)
# Catatan: data_reader mencakup tabel mentah payroll (warisan migrasi!)
ROLES = {
    "analyst_finance": {"budget:read", "laporan:read"},
    "data_reader": {"mentah:read", "laporan:read", "payroll:read"},
    "hr": {"payroll:read", "karyawan:read"},
    "data_admin": {"payroll:read", "mentah:read", "budget:read", "all:write"},
}
USERS = {
    "budi": ["analyst_finance", "data_reader"],
    "sari": ["data_reader"],
    "agus": ["hr"],
    "rudi": ["data_admin"],
}

# TULIS KODEMU DI BAWAH INI
def effective(user):
    return

eff_budi = []  # TODO: effective("budi")

over = []  # TODO: user dengan payroll:read tetapi tanpa role hr

skor_risiko = 0  # TODO: len(over) * 10

print(f"efektif budi: {len(eff_budi)} permission")
print(f"over-privilege: {over}")
print(f"skor risiko: {skor_risiko}")`,
        lockLines: 14,
        solution: `# Role -> permission, user -> role (SINTETIS)
# Catatan: data_reader mencakup tabel mentah payroll (warisan migrasi!)
ROLES = {
    "analyst_finance": {"budget:read", "laporan:read"},
    "data_reader": {"mentah:read", "laporan:read", "payroll:read"},
    "hr": {"payroll:read", "karyawan:read"},
    "data_admin": {"payroll:read", "mentah:read", "budget:read", "all:write"},
}
USERS = {
    "budi": ["analyst_finance", "data_reader"],
    "sari": ["data_reader"],
    "agus": ["hr"],
    "rudi": ["data_admin"],
}

# TULIS KODEMU DI BAWAH INI
def effective(user):
    hasil = set()
    for r in USERS[user]:
        hasil |= ROLES[r]
    return sorted(hasil)

eff_budi = effective("budi")

over = [u for u in USERS if "payroll:read" in effective(u) and "hr" not in USERS[u] and "data_admin" not in USERS[u]]

skor_risiko = len(over) * 10

print(f"efektif budi: {len(eff_budi)} permission")
print(f"over-privilege: {over}")
print(f"skor risiko: {skor_risiko}")`,
        checks: [
          { kind: "equal", task: "t2", name: "eff_budi", value: ["budget:read", "laporan:read", "mentah:read", "payroll:read"], tol: 0, label: "Effective permission budi tepat", msg: "Union analyst_finance + data_reader (yang kini mencakup payroll:read), terurut." },
          { kind: "equal", task: "t3", name: "over", value: ["budi", "sari"], tol: 0, label: "`over` = ['budi', 'sari']", msg: "Keduanya punya payroll:read tanpa role hr/admin." },
          { kind: "equal", task: "t4", name: "skor_risiko", value: 20, tol: 0, label: "`skor_risiko` = 20", msg: "2 user × 10." },
          { kind: "stdout_matches", task: "t5", pattern: "efektif budi: 4 permission", label: "Ringkasan efektif tercetak", msg: "Baris pertama: 'efektif budi: 4 permission'." },
          { kind: "stdout_matches", task: "t5", pattern: "over-privilege: \\['budi', 'sari'\\]", label: "Daftar over-privilege tercetak", msg: "Baris kedua: \"over-privilege: ['budi', 'sari']\"." },
        ],
      },
      reference: "Audit = hitung union semua role per user, lalu bandingkan dengan kebutuhan jabatannya.",
    },
    {
      id: "chart-rbac",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart direct grant vs RBAC",
      prose: [
        "Chart di bawah membandingkan beban pengelolaan akses untuk 40 user × 12 dataset (ilustrasi): via direct grant vs via role.",
        "Cara membaca: sumbu Y = jumlah assignment permission yang harus dikelola. Batang abu = direct grant (480 assignment). Batang biru = via 4 role (48 assignment: 40 user→role + 8 role→permission yang relevan).",
        "Interpretasi: direct grant 10× lebih banyak assignment — dan setiap assignment adalah peluang lupa mencabut. Saat seorang analis pindah tim, direct grant menuntut 12 pencabutan manual (yang sering terlupakan — inilah “kunci duplikat yang terbawa”); RBAC menuntut 1 pencabutan role. Pelajaran chart ini: keamanan yang tidak scalable akan dilanggar — bukan karena orang jahat, melainkan karena mengelola 480 assignment dengan benar melebihi kapasitas manusia.",
      ],
      figure: {
        svg: RBAC_SVG,
        alt: "Diagram batang: direct grant 480 assignment vs via role 48 assignment untuk 40 user.",
        caption: "Beban pengelolaan akses: direct grant vs RBAC (ilustrasi, 40 user × 12 dataset).",
      },
      tasks: [],
      reference: "Keamanan harus scalable — 480 assignment manual pasti bocor; 48 via role bisa diaudit.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Permintaan akses masuk — keputusan apa?",
      prose: [
        "Empat skenario keputusan access control:",
        "Skenario 1 — Analis baru butuh baca tabel budget. → Berikan role `analyst_finance`, bukan grant langsung ke tabel. Alasan: saat ia pindah tim, cukup cabut role — tidak ada permission yang tertinggal.",
        "Skenario 2 — Vendor butuh akses baca data agregat selama proyek 3 bulan. → Role khusus vendor + time-bound (kedaluwarsa otomatis) + hanya ke view agregat (bukan tabel mentah). Alasan: pihak eksternal = risiko tertinggi; aksesnya harus tersempit dan berjangka.",
        "Skenario 3 — Engineer butuh akses tulis darurat ke produksi malam ini. → Break-glass: akses sementara dengan persetujuan + dicatat + kedaluwarsa besok pagi. Alasan: darurat nyata butuh jalan, tetapi jalan darurat yang tidak ditutup menjadi jalan utama.",
        "Skenario 4 — Manajer regional hanya boleh lihat data regionnya. → RLS (row-level security) pada tabel, bukan 34 tabel per region. Alasan: satu tabel + kebijakan baris = konsisten; 34 tabel = 34 tempat untuk salah.",
        "Aturan praktis 10 detik: permintaan akses? → (1) role apa yang cocok? → tidak ada? → buat role, bukan direct grant; (2) berapa lama? → default permanen hanya untuk karyawan tetap di role-nya; (3) seberapa sensitif? → masking/RLS bila perlu; (4) catat + review kuartalan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memberi role `data_admin` “sementara” yang tidak pernah dicabut. “Sementara” tanpa tanggal kedaluwarsa otomatis = permanen. Setiap grant sementara WAJIB punya expiry — tanpa pengecualian, tanpa “nanti saya cabut”.",
      },
      reference: "Tidak ada grant tanpa expiry untuk yang sementara; tidak ada direct grant untuk yang permanen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Audit akses: 200 user, 1 minggu",
      prose: [
        "Skenario (sintetis, untuk latihan): auditor meminta bukti bahwa 200 user warehouse hanya memegang akses yang dibutuhkan. Temuan awal: 60% permission diberikan via direct grant (warisan migrasi), 15 service account memakai kredensial personal mantan karyawan, dan role `data_reader` mencakup tabel mentah payroll.",
        "Pertanyaan analisis: (1) Mana temuan paling kritis dan kenapa? (2) Urutan remediasi 30 hari yang masuk akal? (3) Kontrol apa yang mencegah kambuh?",
        "Pembahasan: (1) Paling kritis: service account berkredensial personal mantan karyawan — akses aktif yang pemiliknya sudah tidak ada (tidak ada yang bertanggung jawab, tidak ada yang memonitor). Kedua: `data_reader` mencakup payroll — satu role “polos” membuka data paling sensitif untuk puluhan user. (2) Remediasi 30 hari: minggu 1 — cabut/nonaktifkan kredensial mantan karyawan + inventarisasi service account (tiap SA punya pemilik); minggu 2 — keluarkan payroll dari `data_reader`, buat role `payroll_reader` khusus; minggu 3–4 — migrasi direct grant ke role per tim (mulai dari tim terbesar), dengan jendela pengumuman. (3) Pencegah kambuh: larangan direct grant di CI (pipeline menolak GRANT ke user langsung), review akses kuartalan otomatis, dan joiner-mover-leaver terhubung ke HRIS — pindah tim = role ikut pindah.",
        "Catatan metrik: ukur % direct grant tiap bulan — target < 5%. Yang tidak diukur tidak diperbaiki.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Auditor tidak bertanya “apakah ada niat jahat?” — ia bertanya “bisakah terjadi?”. 15 kredensial hantu + payroll terbuka = jawaban “ya” untuk dua skenario terburuk. Temuan audit seperti ini masuk laporan dan mempengaruhi penilaian pengendalian internal perusahaan.",
      },
      reference: "Remediasi: kredensial hantu → role payroll → migrasi grant → larang direct grant di CI.",
    },
    {
      id: "pendalaman-pdp",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "UU PDP Indonesia dan jebakan over-permission bertumpuk",
      prose: [
        "RBAC vs ABAC vs ReBAC — kapan naik tingkat. RBAC (role statis: analyst_finance, data_admin) menyelesaikan 90% kasus dengan biaya kognitif rendah. ABAC (Attribute-Based): keputusan akses dihitung dari ATRIBUT — mis. izinkan bila department(user) == owner(data) DAN clearance(user) >= klasifikasi(data) DAN dalam jam kerja — untuk aturan kompleks lintas dimensi yang akan meledakkan jumlah role (50+ role ad-hoc = RBAC yang gagal). ReBAC (Relationship-Based, model Google Zanzibar): 'dokumen yang dibagikan kepadaku' — untuk produk dengan sharing granular antar user. Aturan senior: mulai RBAC SELALU; naik ke ABAC bila matriks role tak terkendali; ReBAC hanya untuk kebutuhan sharing produk. Abstraksi yang lebih canggih dari kebutuhan = kompleksitas yang tidak diaudit.",
        "Least privilege operasional — dari prinsip ke mekanisme. Default-deny (tidak ada akses kecuali diberikan eksplisit); just-in-time access (minta → approve → otomatis kedaluwarsa dalam hitungan jam — untuk akses sensitif/insiden); approval oleh OWNER DATA (yang paham isi datanya!), bukan admin IT generik; break-glass tercatat untuk darurat. Metrik yang diukur: % grant permanen vs time-bound — target senior: >80% akses ke data sensitif bersifat time-bound. Grant permanen bukan dosa untuk karyawan tetap di role-nya — dosa adalah grant permanen untuk AKSES SEMENTARA (vendor, darurat, proyek).",
        "Masking, tokenisasi, dan PII discovery. Dynamic masking per role: analis melihat 0812XXXXXX, HR melihat penuh — SATU tabel, banyak 'versi kebenaran'. Tokenisasi untuk non-prod: dev/staging WAJIB memakai data tokenized/sintetis — BUKAN salinan prod asli ('kan cuma staging' adalah kalimat pembuka banyak insiden). PII discovery otomatis: scan kolom dengan regex (NIK 16 digit, nomor HP) + classifier → label klasifikasi → masking policy otomatis menempel. Jebakan klasik: masking dipasang di VIEW tetapi tabel dasar masih bisa di-query langsung — revoke akses tabel dasar, grant hanya ke view. Masking tanpa revoke = gorden di jendela yang pintunya terbuka.",
        "UU PDP Indonesia (UU No. 27 Tahun 2022) — yang wajib diketahui data engineer. Hak subjek data: hak akses (tahu datanya diproses untuk apa), koreksi, PENGHAPUSAN (right to erasure), penarikan persetujuan, dan portabilitas. Kewajiban pengendali/prosesor data: dasar pemrosesan yang sah, pembatasan tujuan, keamanan data, PENCATATAN aktivitas pemrosesan, DPIA (penilaian dampak) untuk pemrosesan berisiko tinggi, dan NOTIFIKASI TERTULIS atas kebocoran kepada subjek + lembaga dalam tenggat ketat. Sanksi administratif bertingkat: peringatan tertulis, penghentian sementara pemrosesan, hingga denda administratif. Ini bukan 'urusan legal' — setiap butirnya adalah TUGAS TEKNIS di pipeline-mu.",
        "Right to erasure — tantangan teknik yang sesungguhnya. 'Hapus data saya' terdengar sepele sampai kamu peta-kan: hapus dari tabel prod → mudah (DELETE WHERE subject_id); dari snapshot/time travel Iceberg/Delta → butuh rewrite file + expire snapshot lama (snapshot = data masih ada!); dari backup → crypto-shredding (enkripsi per-subjek sejak awal; hapus kunci = seluruh salinan tak terbaca) atau purge terjadwal dengan retensi terdokumentasi; dari log Kafka → tombstone + compaction; dari data lake mentah → re-write partisi. Desain sejak awal: JANGAN simpan PII mentah di 17 tempat — sentralkan, katalogkan, enkripsi per-subjek. Permintaan hapus yang 'tidak bisa karena backup' = desain yang gagal, bukan alasan yang sah.",
        "Audit akses — dari log menjadi tindakan. Warehouse modern mencatat: siapa, kapan, query apa, tabel apa, berapa baris dibaca. Audit senior mencari POLA: akses di luar jam kerja yang tidak biasa, bulk export mendadak (SELECT * tanpa filter di tabel sensitif), tabel yang tak disentuh 90 hari tiba-tiba dibaca (indikasi eksplorasi/eksfiltrasi), dan service account yang perilakunya berubah. Mekanisme: alert otomatis ke owner data + review kuartalan di mana owner MENANDATANGANI 'akses ini masih dibutuhkan' — tanpa tanda tangan = akses dicabut (default-deny!). Audit tahunan yang hanya 'dibaca' tanpa pencabutan = teater.",
        "Respons insiden akses — playbook yang harus ada SEBELUM dibutuhkan. Skenario: kredensial service account bocor di repo publik. Langkah 1: revoke/rotasi kredensial SEGERA (jangan investigasi dulu — tutup keran dulu); langkah 2: audit log — apa saja yang diakses dengan kredensial itu selama jendela bocor; langkah 3: nilai dampak (data apa yang terbaca/diubah?); langkah 4: notifikasi sesuai kewajiban (UU PDP bila data pribadi terdampak!); langkah 5: post-mortem — kenapa kredensial bisa di repo (pre-commit hook secret scanning? kenapa tidak ada?). Playbook ini dilatih (tabletop exercise) setahun sekali — tim yang pertama kali membuka playbook saat insiden = tim yang panik.",
        "Jebakan over-permission bertumpuk — katalog. (a) Grup nested: user → 5 grup → tiap grup 3 role — effective permission tak terpahami manusia; (b) role warisan migrasi: data_reader yang diam-diam mencakup payroll (kasus lab lesson ini!); (c) service account dengan role admin 'sementara' yang abadi; (d) 'temporary' tanpa expiry — sementara tanpa tanggal = permanen; (e) pola 'samakan aksesnya dengan Budi' — mewarisi seluruh sampah historis Budi termasuk yang ia sendiri tak butuhkan. Teknik senior: hitung effective permission (UNION semua role!) tiap kuartal; automated recommender — role/permission tak dipakai 90 hari → usulkan pencabutan; larangan direct grant ditegakkan di CI (pipeline menolak GRANT ke user langsung). Keamanan = proses berulang, bukan keadaan sekali jadi.",
      ],
      formula: String.raw`\text{risiko akses} = \text{permission efektif} \times \text{jumlah identitas} \times \text{waktu tanpa review}`,
      formulaNote: "Tiga faktor yang masing-masing bisa dikecilkan. Contoh: 200 user × rata-rata 15 permission efektif × 12 bulan tanpa review = 36.000 'unit risiko'. Perkecil permission (least privilege + cabut yang tak dipakai), perkecil identitas (nonaktifkan SA hantu), perpendek interval review (kuartalan, bukan tahunan). Risiko akses bukan takdir — ia hasil kali tiga keputusan operasional.",
      tasks: [],
      note: {
        title: "Intuisi: akses yang tidak direview = akses yang bocor",
        body: "Heuristik lapangan: keamanan akses bukan keadaan ('sudah pakai RBAC') melainkan PROSES ('kapan terakhir direview?'). Setiap grant punya tanggal lahir — dan seharusnya punya tanggal kedaluwarsa atau tanggal review berikutnya. Bau masalah yang harus membuatmu berhenti: 'samakan aksesnya dengan Budi' (mewarisi sampah), 'sementara dulu ya' (tanpa expiry = permanen), role bernama orang ('akses_budi' = direct grant berkedok), dan kalimat 'kan cuma staging' untuk data prod asli. Ritual sehatnya: default-deny; grant sementara WAJIB expiry otomatis; owner data (bukan IT) yang approve; hitung union effective permission tiap kuartal; ukur % direct grant tiap bulan dengan target <5%; dan untuk data pribadi — katalogkan sejak awal karena UU PDP memberi subjek data hak hapus yang harus BISA dieksekusi secara teknis. Intern yang membaca payroll bukan kegagalan niat — ia kegagalan review. Dan ingat sisi manusianya: akses yang terlalu ketat tanpa jalur permintaan yang cepat akan dilanggar dengan 'jalan tikus' (akun bersama, screenshot) — keamanan yang baik memberi jalan resmi yang LEBIH MUDAH dari jalan tikus. Terakhir: dokumentasikan KENAPA tiap role sensitif ada — role tanpa dokumentasi alasan adalah calon sampah generasi berikutnya.",
      },
      reference: "RBAC dulu, ABAC bila role meledak. JIT + expiry untuk sensitif. Masking + revoke tabel dasar. UU PDP: hak hapus = tugas teknik (snapshot, backup, log). Audit pola + tanda tangan kuartalan.",
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
        "RBAC: permission → role → user; least privilege mulai dari nol; direct grant = kunci duplikat yang tak terlacak.",
        "Biaya kelola: direct = u × p; RBAC = u + (r × p) — scalable dan bisa diaudit.",
        "Masking menyamarkan tampilan kolom; RLS menyekat baris; ABAC memakai atribut — satu tabel untuk banyak pihak.",
        "Effective permission = union semua role; audit harus menghitungnya, bukan membaca satu role.",
        "Grant sementara wajib punya expiry otomatis; review kuartalan; joiner-mover-leaver terhubung HRIS.",
      ],
      quiz: [
        {
          q: "Kenapa direct grant (izin langsung ke user) berbahaya dalam jangka panjang?",
          options: [
            { text: "Saat user pindah tim/resign, permission-nya ikut terbawa karena tidak ada yang mencabut satu per satu", why: "Benar: 480 assignment individual tidak mungkin dikelola konsisten — inilah “kunci duplikat yang terbawa”.", correct: true },
            { text: "Karena query-nya lebih lambat", why: "Salah: model pemberian izin tidak mempengaruhi kecepatan query sama sekali." },
            { text: "Karena tidak bisa dipakai di cloud", why: "Salah: direct grant bisa dilakukan di semua platform — masalahnya tata kelola, bukan kompatibilitas." },
            { text: "Karena user tidak bisa melihat datanya", why: "Salah: justru sebaliknya — direct grant biasanya memberi TERLALU BANYAK akses, bukan terlalu sedikit." },
          ],
        },
        {
          q: "Manajer cabang hanya boleh melihat data cabangnya sendiri dari tabel penjualan nasional. Solusi yang tepat?",
          options: [
            { text: "Row-level security: satu tabel + kebijakan baris berdasar atribut cabang user", why: "Benar: satu sumber kebenaran, akses disekat per baris. Tidak ada duplikasi tabel.", correct: true },
            { text: "Buat 34 tabel, satu per cabang", why: "Salah: 34 tabel = 34 tempat untuk salah + mimpi buruk konsistensi + 34 pipeline." },
            { text: "Minta manajer filter manual dengan WHERE", why: "Salah: kontrol yang bergantung pada kejujuran query bukan kontrol — satu lupa WHERE = seluruh data nasional terlihat." },
            { text: "Berikan akses penuh — kan sesama manajer", why: "Salah: “sesama” bukan dasar kontrol akses. Least privilege tidak mengenal kesesamaan jabatan." },
          ],
        },
        {
          q: "Analis butuh kolom NIK untuk join, tetapi tidak boleh melihat isinya. Solusi?",
          options: [
            { text: "Column masking: tampilkan tersamar (***), nilai asli hanya untuk role berwenang", why: "Benar: kebutuhan join (keberadaan kolom) terpenuhi tanpa membuka isinya. Tepat guna.", correct: true },
            { text: "Hapus kolom NIK dari tabel", why: "Salah: menghapus merusak kebutuhan join yang sah + merusak data untuk role yang memang berhak." },
            { text: "Enkripsi seluruh database", why: "Salah: enkripsi melindungi storage, bukan tampilan per role — analis dengan akses baca tetap melihat plaintext." },
            { text: "Percaya saja pada analisnya", why: "Salah: “percaya” bukan kontrol akses. Kontrol yang baik tidak bergantung pada kebaikan hati." },
          ],
        },
        {
          q: "Engineer meminta akses tulis darurat ke produksi “sementara”. Praktik yang benar?",
          options: [
            { text: "Break-glass: berikan dengan persetujuan, tercatat, dan kedaluwarsa otomatis", why: "Benar: darurat diakomodasi dengan pagar — time-bound + audit trail. “Sementara” tanpa expiry = permanen.", correct: true },
            { text: "Tolak — tidak ada pengecualian", why: "Salah: rigiditas buta saat produksi down adalah kegagalan prioritas. Yang benar: pengecualian terkendali." },
            { text: "Berikan permanen agar lain kali tidak repot", why: "Salah: ini cara “sementara” menjadi permanen — preseden paling umum privilege creep." },
            { text: "Berikan via direct grant agar cepat", why: "Salah: kecepatan tidak membenarkan direct grant — role sementara + expiry sama cepatnya dan terlacak." },
          ],
        },
        {
          q: "Saat audit, apa yang HARUS dihitung untuk tiap user?",
          options: [
            { text: "Effective permission = gabungan semua permission dari semua role yang dipegang user", why: "Benar: satu role bisa terlihat polos sementara union-nya membuka payroll — seperti kasus data_reader di lab.", correct: true },
            { text: "Hanya role utama user", why: "Salah: “role utama” tidak ada dalam RBAC — semua role yang dipegang berlaku penuh." },
            { text: "Hanya permission yang dipakai 30 hari terakhir", why: "Salah: permission yang tidak dipakai tetap BISA dipakai — risiko diukur dari kemampuan, bukan riwayat." },
            { text: "Hanya direct grant-nya", why: "Salah: mengabaikan role = mengabaikan sebagian besar akses user. Audit parsial = audit gagal." },
          ],
        },
        {
          q: "Manajer meminta 'samakan aksesnya dengan Budi' untuk anggota tim baru. Respons senior yang tepat?",
          options: [
            { text: "Tolak polanya — petakan kebutuhan pekerjaan ke role, lalu hitung effective permission hasilnya", why: "Benar: 'samakan dengan Budi' mewarisi seluruh sampah historis Budi; role berdasar pekerjaan + verifikasi union adalah jalurnya.", correct: true },
            { text: "Samakan lalu catat di tiket", why: "Salah: pencatatan tidak membersihkan sampah yang diwariskan — ia hanya mendokumentasikan kesalahan.", correct: false },
            { text: "Samakan sementara, review bulan depan", why: "Salah: 'sementara' tanpa expiry otomatis = permanen; review bulan depan hampir pasti terlupakan.", correct: false },
            { text: "Beri read-only ke semua tabel agar aman", why: "Salah: read-only ke SEMUA tabel justru melanggar least privilege — termasuk payroll.", correct: false },
          ],
        },
        {
          q: "Permintaan penghapusan data pribadi masuk (hak erasure UU PDP). Di mana tantangan teknis terbesarnya?",
          options: [
            { text: "Data tersebar: snapshot/time travel, backup, dan log — butuh rewrite + expire + crypto-shredding", why: "Benar: DELETE di tabel prod tidak menghapus snapshot lama, backup, atau jejak di log — semuanya harus dirancang sejak awal.", correct: true },
            { text: "Tidak ada — cukup DELETE dari tabel produksi", why: "Salah: snapshot Iceberg/Delta menyimpan versi lama; backup menyimpan salinan; hak hapus menuntut semuanya.", correct: false },
            { text: "Tolak saja dengan alasan backup tidak bisa diubah", why: "Salah: crypto-shredding dan purge terjadwal adalah mekanisme sah — 'tidak bisa' = desain gagal.", correct: false },
            { text: "Tunda 1 tahun sampai retensi habis", why: "Salah: hak subjek data tidak menunggu siklus retensimu — ia harus dieksekusi dalam tenggat yang wajar.", correct: false },
          ],
        },
      ],
    },
  ],
};
