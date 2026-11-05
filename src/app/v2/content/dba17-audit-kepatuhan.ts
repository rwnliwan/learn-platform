import type { V2Lesson } from "../lib/types";

// ── Figure: kelengkapan jejak audit per kategori ────────────────────────────
const AUD_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Diagram batang kelengkapan jejak audit per kategori aktivitas database">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="46" y="209">0%</text><text x="46" y="169">25%</text><text x="46" y="129">50%</text>
<text x="46" y="89">75%</text><text x="46" y="49">100%</text>
</g>
<g>
<rect x="90" y="66" width="56" height="140" fill="var(--c1)" opacity="0.9"/>
<text x="118" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">100%</text>
<text x="118" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Login</text>
<rect x="186" y="86" width="56" height="120" fill="var(--c1)" opacity="0.9"/>
<text x="214" y="78" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">85%</text>
<text x="214" y="224" text-anchor="middle" font-size="11" fill="var(--text)">DDL</text>
<rect x="282" y="126" width="56" height="80" fill="var(--chart-text)" opacity="0.55"/>
<text x="310" y="118" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">50%</text>
<text x="310" y="224" text-anchor="middle" font-size="11" fill="var(--text)">DML sensitif</text>
<rect x="378" y="166" width="56" height="40" fill="var(--chart-text)" opacity="0.55"/>
<text x="406" y="158" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">25%</text>
<text x="406" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Akses baca</text>
<rect x="474" y="106" width="40" height="100" fill="var(--c2)" opacity="0.85"/>
<text x="494" y="98" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">70%</text>
<text x="494" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Target</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="52" y="30">kelengkapan jejak audit per kategori (biru = memenuhi target, abu = di bawah) — ilustrasi</text>
<text x="52" y="244">celah: siapa membaca data sensitif (25%) nyaris tak tercatat</text>
</g>
</svg>`;

export const dba17: V2Lesson = {
  slug: "dba17-audit-kepatuhan",
  track: "Database Administrator",
  module: "Keamanan & Risiko",
  title: "Audit Trail & Kepatuhan: Jejak yang Bisa Dipertahankan ke Auditor",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Auditor bertanya “siapa mengubah data ini?” — dan tidak ada yang bisa menjawab",
      prose: [
        "Dalam audit tahunan sebuah bank, auditor menunjuk satu baris di tabel suku bunga: nilainya berubah tiga kali dalam seminggu, dan perubahan terakhir membuat margin produk menyimpang. Pertanyaan sederhana: “Siapa yang mengubahnya, kapan, dan atas otorisasi apa?” Tim DBA membuka log database — dan menemukan: log hanya menyimpan 7 hari terakhir (rotasi agresif demi hemat storage), tidak mencatat user aplikasi (semua koneksi memakai satu service account), dan tidak mencatat nilai sebelum–sesudah (hanya “UPDATE sukses”). Tiga pertanyaan auditor, nol jawaban. Temuan audit: pengendalian tidak memadai. Twist-nya: tidak ada bukti kecurangan. Mungkin perubahannya sah dan disetujui. Tetapi dalam audit, “tidak ada bukti” = “tidak terjadi dengan benar”. Bank tidak bisa membuktikan perubahan itu sah — dan ketidakmampuan membuktikan adalah temuan itu sendiri.",
        "Inilah wilayah audit trail: catatan sistematis SIAPA melakukan APA, KAPAN, dari MANA, dan (bila relevan) nilai SEBELUM–SESUDAH — yang disimpan cukup lama, tidak bisa diubah, dan bisa ditunjukkan ke auditor/regulator. Di perbankan Indonesia, ekspektasi ini nyata: OJK mewajibkan bank menerapkan manajemen risiko teknologi informasi, termasuk pencatatan aktivitas yang dapat diaudit; tanpa jejak, bank tidak bisa membuktikan pengendaliannya berjalan.",
        "Di lesson ini kamu belajar merancang audit trail (apa yang dicatat, di mana, berapa lama), melindunginya dari manipulasi, dan menjawab pertanyaan auditor dengan percaya diri.",
      ],
      tasks: [],
      note: {
        title: "Kenapa audit trail adalah pekerjaan DBA, bukan auditor",
        type: "risk",
        body: "Auditor hanya MEMBACA jejak — DBA-lah yang MERANCANG dan MENJAGANYA: mengaktifkan audit logging, menentukan retensi, memisahkan penyimpanan, dan memastikan service account tidak menutupi identitas pelaku. Jejak yang buruk bukan temuan auditor; ia kegagalan DBA yang ditemukan auditor.",
      },
      reference: "Audit trail = siapa + apa + kapan + dari mana (+ sebelum/sesudah) — tercatat, tak terubah, cukup lama.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan 5W+1H audit trail dan merancang kebijakan pencatatan per kategori aktivitas; (2) membedakan audit di level database, aplikasi, dan SIEM — serta kapan masing-masing; (3) melindungi jejak dari manipulasi (immutability, segregasi, retensi); (4) menghitung kelengkapan jejak dan membaca celahnya.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (anatomi audit trail; perlindungan jejak) → lab Python (parser jejak + deteksi anomali) → chart kelengkapan per kategori → peta keputusan → mini-case investigasi fraud → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari keamanan database: database mengenal autentikasi (siapa kamu), otorisasi (boleh apa), dan enkripsi — audit adalah pilar keempatnya: MENCATAT apa yang terjadi. Tanpa audit, tiga pilar pertama tidak bisa diverifikasi. Dari access control: service account bersama menutupi identitas pelaku — audit trail yang mencatat “service account X” untuk 200 user aplikasi sama dengan tidak mencatat siapa-siapa; identitas harus diteruskan (propagated) sampai ke database.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: audit trail menjawab pertanyaan MASA LALU (“siapa mengubah ini kemarin?”), bukan mencegah masa depan. Ia seperti CCTV — tidak menghentikan maling, tetapi membuat maling berpikir dua kali dan membuat investigasi mungkin.",
      ],
      reference: "Bekal: (1) audit = pilar keempat keamanan DB; (2) identitas harus sampai ke database, bukan berhenti di service account.",
    },
    {
      id: "konsep-anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi Audit Trail — Si Juru Catat 5W+1H",
      prose: [
        "Definisi: audit trail yang baik mencatat 5W+1H tiap peristiwa penting: WHO (identitas user asli, bukan service account), WHAT (operasi + objek: UPDATE tabel suku_bunga), WHEN (timestamp presisi dengan zona waktu), WHERE (IP/host aplikasi asal), WHY (konteks: session id, modul aplikasi, nomor tiket perubahan — bila tersedia), dan HOW MUCH changed (nilai sebelum–sesudah untuk DML sensitif). Kategori yang wajib dicatat: login/logout (gagal maupun sukses), DDL (perubahan struktur), DML pada tabel sensitif, perubahan permission/role, dan akses baca ke data sangat sensitif (selective).",
        "Kepribadiannya: seperti juru catat pengadilan — ia tidak menilai, tidak menghakimi, hanya mencatat dengan presisi membosankan: siapa bicara, jam berapa, apa katanya. Catatan yang “kreatif” (meringkas, membulatkan, menghilangkan detail) tidak laku di pengadilan; yang laku adalah catatan verbatim yang konsisten. Audit trail yang mencatat “UPDATE sukses” tanpa siapa/kapan/nilai-lama adalah juru catat yang tidur saat sidang.",
        "Kapan mencatat apa: login selalu (gagal 3× = sinyal serangan); DDL selalu (perubahan struktur = perubahan kontrak); DML sensitif selektif (tabel gaji, suku bunga, limit — bukan setiap tabel log); GRANT/REVOKE selalu; baca data sensitif bila regulasi/bisnis menuntut (dengan sadar akan volume). Aturan: kebijakan pencatatan DITULIS dan DISETUJUI — “catat semua” tanpa kebijakan = storage jebol dan jejak tak terbaca.",
      ],
      formula: String.raw`\text{kelengkapan} = \frac{\text{peristiwa tercatat}}{\text{peristiwa seharusnya tercatat}} \times 100\%`,
      formulaNote: "Penyebut = menurut KEBIJAKAN pencatatan (bukan menurut feeling). Contoh: kebijakan mewajibkan catat 1.000 DML sensitif/bulan; yang tercatat 500 → kelengkapan 50% — ada kebocoran (mungkin bypass via service account, atau tabel baru belum masuk kebijakan). Interpretasi: di bawah 95% untuk kategori kritis = temuan audit yang menunggu ditemukan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Log aplikasi sudah cukup, tidak perlu audit di database”",
        type: "pitfall",
        body: "Yang benar: log aplikasi mencatat apa yang dilakukan APLIKASI — ia buta terhadap akses langsung ke database (DBA via console, tool migrasi, koneksi darurat). Audit database mencatat apa yang terjadi DI DATABASE, dari semua jalur. Keduanya komplementer; mengandalkan satu saja meninggalkan blind spot. Penyerang/oknum yang cerdik justru memakai jalur yang tidak dicatat.",
      },
      hints: [
        "💡 Intuisi: uji “jalur gelap” — daftarkan semua cara mencapai database (aplikasi, console DBA, tool ETL, koneksi darurat, replikasi) lalu tanya per jalur: “jejaknya tercatat di mana?” Jalur tanpa jawaban adalah jalur favorit masalah.",
      ],
      reference: "5W+1H per peristiwa; kategori wajib: login, DDL, DML sensitif, permission, baca sensitif. Kebijakan tertulis dulu.",
    },
    {
      id: "konsep-lindungi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Melindungi Jejak — Si Brankas Anti Perusak",
      prose: [
        "Definisi: jejak audit hanya berguna bila bisa DIPERCAYA — artinya: (1) immutable — tidak bisa diubah/dihapus oleh siapa pun termasuk DBA (append-only, atau ditulis ke sistem terpisah/WORM storage); (2) segregasi — DBA yang mengelola database tidak sendirian mengendalikan jejaknya (prinsip “penjaga tidak boleh sendirian memegang kunci brankas”); (3) retensi cukup — disimpan selama yang dituntut regulasi/kebijakan (bukan 7 hari karena “hemat storage”); (4) termonitor — ada alert untuk pola aneh (login gagal massal, DDL di jam aneh, penonaktifan audit).",
        "Kepribadiannya: seperti brankas bukti di kantor polisi — barang bukti dimasukkan, disegel, dan kuncinya dipegang pihak berbeda dari penyidik kasusnya. Brankas yang kuncinya dipegang tersangka = lelucon. Audit trail yang bisa dihapus oleh DBA yang sama yang mengubah data = lelucon yang sama. Aturan keras: mematikan audit logging harus menjadi peristiwa audit itu sendiri (dicatat, butuh persetujuan) — “audit dimatikan jam 02:00 tanpa catatan” adalah bendera merah terbesar.",
        "Kapan memakai: selalu, untuk jejak kategori kritis. Pola umum: kirim jejak ke SIEM/log terpusat secara real-time (atau near-real-time) sehingga jejak hidup di DUA tempat — database dan sistem terpisah. Bila database dikompromikan, salinan di SIEM tetap bicara.",
      ],
      formula: String.raw`\text{kepercayaan jejak} = \text{immutability} \times \text{segregasi} \times \text{kelengkapan}`,
      formulaNote: "Perkalian, bukan penjumlahan: satu faktor NOL = kepercayaan NOL. Jejak lengkap tetapi bisa dihapus DBA = 0. Jejak immutable tetapi hanya 50% lengkap = setengah. Jejak lengkap dan immutable tetapi DBA-nya juga admin SIEM-nya (tanpa segregasi) = 0. Interpretasi: audit keamanan jejak dengan mengalikan, bukan merata-rata.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “DBA senior pasti jujur, jadi segregasi tidak perlu”",
        type: "pitfall",
        body: "Yang benar: segregasi bukan soal ketidakpercayaan personal — melainkan soal PEMBUKTIAN ke pihak ketiga. Auditor tidak menilai karakter DBA; ia menilai desain pengendalian. “Kami percaya Pak Budi” bukan pengendalian; “jejak tidak bisa diubah Pak Budi sekalipun” adalah pengendalian.",
      },
      hints: [
        "💡 Intuisi: desain audit trail dengan asumsi penyerangnya adalah orang dalam yang tahu sistem — karena itulah kasus tersulit dan paling merusak. Jejak yang tahan terhadap insider otomatis tahan terhadap outsider.",
      ],
      reference: "Immutable + segregasi + retensi + monitoring. Mematikan audit = peristiwa audit.",
    },
    {
      id: "lab-jejak",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Parser jejak & deteksi anomali",
      prose: [
        "Waktunya jadi investigator-nya. Di bawah ada jejak audit (sintetis): login, DDL, dan DML. Tugasmu: tulis penganalisis yang (1) menghitung kelengkapan pencatatan DML sensitif, (2) mendeteksi login gagal ≥ 3× dari satu user (indikasi brute force), (3) mendeteksi DDL di luar jam kerja (di atas jam 18 atau di bawah jam 7), dan (4) menandai peristiwa TANPA identitas user asli (user kosong/service account generik).",
        "Coba: setelah lolos, tambahkan satu baris DDL jam 02:30 oleh user tak dikenal dan lihat deteksinya. Lalu tanya: jejak ini mencatat nilai sebelum–sesudah — apa yang hilang bila kolom itu tidak ada? (Petunjuk: cerita pembuka.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kelengkapan` = DML sensitif tercatat / seharusnya (seharusnya = 4)" },
        { id: "t2", text: "Kumpulkan `brute` = user dengan login gagal ≥ 3 kali" },
        { id: "t3", text: "Kumpulkan `ddl_aneh` = id peristiwa DDL di luar jam 07–18" },
        { id: "t4", text: "Kumpulkan `tanpa_identitas` = id peristiwa dengan user kosong" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "kelengkapan DML sensitif: 75.0%\nindikasi brute force: ['hacker07']\nDDL jam aneh: ['E006']\ntanpa identitas: ['E007']",
      code: {
        starter: `# Jejak audit (SINTETIS — format disederhanakan)
jejak = [
    {"id": "E001", "jenis": "login", "user": "agus", "jam": 8, "status": "gagal", "detail": ""},
    {"id": "E002", "jenis": "login", "user": "hacker07", "jam": 2, "status": "gagal", "detail": ""},
    {"id": "E003", "jenis": "login", "user": "hacker07", "jam": 2, "status": "gagal", "detail": ""},
    {"id": "E004", "jenis": "login", "user": "hacker07", "jam": 3, "status": "gagal", "detail": ""},
    {"id": "E005", "jenis": "ddl", "user": "dba_rina", "jam": 10, "status": "ok", "detail": "ALTER TABLE nasabah ADD COLUMN"},
    {"id": "E006", "jenis": "ddl", "user": "dba_rina", "jam": 23, "status": "ok", "detail": "DROP TABLE sementara_x"},
    {"id": "E007", "jenis": "dml", "user": "", "jam": 14, "status": "ok", "detail": "UPDATE suku_bunga 5.0->5.5"},
    {"id": "E008", "jenis": "dml", "user": "teller_01", "jam": 15, "status": "ok", "detail": "UPDATE limit_kredit"},
    {"id": "E009", "jenis": "dml", "user": "teller_02", "jam": 16, "status": "ok", "detail": "UPDATE suku_bunga 5.5->5.2"},
]

# TULIS KODEMU DI BAWAH INI
kelengkapan = 0.0  # TODO: dml tercatat / 4 * 100

brute = []  # TODO: user dengan >= 3 login gagal

ddl_aneh = []  # TODO: id DDL dengan jam < 7 atau > 18

tanpa_identitas = []  # TODO: id peristiwa dengan user kosong

print(f"kelengkapan DML sensitif: {kelengkapan:.1f}%")
print(f"indikasi brute force: {brute}")
print(f"DDL jam aneh: {ddl_aneh}")
print(f"tanpa identitas: {tanpa_identitas}")`,
        lockLines: 12,
        solution: `# Jejak audit (SINTETIS — format disederhanakan)
jejak = [
    {"id": "E001", "jenis": "login", "user": "agus", "jam": 8, "status": "gagal", "detail": ""},
    {"id": "E002", "jenis": "login", "user": "hacker07", "jam": 2, "status": "gagal", "detail": ""},
    {"id": "E003", "jenis": "login", "user": "hacker07", "jam": 2, "status": "gagal", "detail": ""},
    {"id": "E004", "jenis": "login", "user": "hacker07", "jam": 3, "status": "gagal", "detail": ""},
    {"id": "E005", "jenis": "ddl", "user": "dba_rina", "jam": 10, "status": "ok", "detail": "ALTER TABLE nasabah ADD COLUMN"},
    {"id": "E006", "jenis": "ddl", "user": "dba_rina", "jam": 23, "status": "ok", "detail": "DROP TABLE sementara_x"},
    {"id": "E007", "jenis": "dml", "user": "", "jam": 14, "status": "ok", "detail": "UPDATE suku_bunga 5.0->5.5"},
    {"id": "E008", "jenis": "dml", "user": "teller_01", "jam": 15, "status": "ok", "detail": "UPDATE limit_kredit"},
    {"id": "E009", "jenis": "dml", "user": "teller_02", "jam": 16, "status": "ok", "detail": "UPDATE suku_bunga 5.5->5.2"},
]

# TULIS KODEMU DI BAWAH INI
from collections import Counter
dml = [e for e in jejak if e["jenis"] == "dml"]
kelengkapan = len(dml) / 4 * 100

gagal = Counter(e["user"] for e in jejak if e["jenis"] == "login" and e["status"] == "gagal")
brute = sorted(u for u, n in gagal.items() if n >= 3)

ddl_aneh = [e["id"] for e in jejak if e["jenis"] == "ddl" and (e["jam"] < 7 or e["jam"] > 18)]

tanpa_identitas = [e["id"] for e in jejak if not e["user"]]

print(f"kelengkapan DML sensitif: {kelengkapan:.1f}%")
print(f"indikasi brute force: {brute}")
print(f"DDL jam aneh: {ddl_aneh}")
print(f"tanpa identitas: {tanpa_identitas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kelengkapan", value: 75.0, tol: 0.01, label: "`kelengkapan` = 75,0", msg: "3 DML tercatat dari 4 seharusnya." },
          { kind: "equal", task: "t2", name: "brute", value: ["hacker07"], tol: 0, label: "Brute force terdeteksi", msg: "hacker07: 3 login gagal." },
          { kind: "equal", task: "t3", name: "ddl_aneh", value: ["E006"], tol: 0, label: "DDL jam aneh = ['E006']", msg: "E006: DROP TABLE jam 23." },
          { kind: "equal", task: "t4", name: "tanpa_identitas", value: ["E007"], tol: 0, label: "Tanpa identitas = ['E007']", msg: "E007: UPDATE suku_bunga tanpa user — persis lubang di cerita pembuka." },
          { kind: "stdout_matches", task: "t5", pattern: "kelengkapan DML sensitif: 75\\.0%", label: "Ringkasan kelengkapan tercetak", msg: "Baris pertama: 'kelengkapan DML sensitif: 75.0%'." },
        ],
      },
      reference: "Analisis jejak: kelengkapan, brute force, DDL jam aneh, identitas kosong. Tiap temuan = tindak lanjut.",
    },
    {
      id: "chart-lengkap",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart kelengkapan jejak",
      prose: [
        "Chart di bawah memplot kelengkapan pencatatan jejak per kategori aktivitas, dibanding target 70% (ilustrasi).",
        "Cara membaca: sumbu Y = persen kelengkapan; tiap batang = satu kategori. Batang biru = memenuhi/mendekati target; batang abu = di bawah target. Batang oranye = target.",
        "Interpretasi: login (100%) dan DDL (85%) tercakup baik — kategori “mudah” karena volumenya kecil dan tool-nya standar. DML sensitif (50%) dan akses baca (25%) jebol — kategori “sulit” karena volumenya besar dan sering dikecualikan “demi performa”. Celah terbesar: siapa MEMBACA data sensitif nyaris tak tercatat (25%). Pelajaran chart ini: organisasi cenderung mengaudit apa yang MUDAH diaudit, bukan apa yang PENTING diaudit. Auditor yang baik menyerang celah abu-abu — bukan memuji batang biru.",
      ],
      figure: {
        svg: AUD_SVG,
        alt: "Diagram batang: login 100%, DDL 85%, DML sensitif 50%, akses baca 25%, target 70%.",
        caption: "Kelengkapan jejak per kategori vs target 70% (ilustrasi). Celah ada di DML sensitif dan akses baca.",
      },
      tasks: [],
      reference: "Audit yang mudah ≠ audit yang penting. Tutup celah abu-abu dulu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Merancang kebijakan audit — keputusan apa?",
      prose: [
        "Empat skenario keputusan audit trail:",
        "Skenario 1 — Tabel baru berisi data gaji dibuat. → Masukkan ke kebijakan DML sensitif: catat before/after, retensi sesuai regulasi. Alasan: tabel sensitif tanpa audit = lubang yang menunggu ditemukan auditor.",
        "Skenario 2 — Tim aplikasi memakai satu service account untuk 200 user. → Wajibkan propagasi identitas (set application_name/client user per session) atau pindah ke auth per user. Alasan: jejak “service account” untuk 200 orang = anonim — 5W+1H-nya gagal di W pertama.",
        "Skenario 3 — Storage jejak membengkak, tim ingin memangkas retensi jadi 30 hari. → Tolak bila regulasi/kebijakan menuntut lebih lama; sebagai gantinya tiering (panas 90 hari, arsip dingin selebihnya). Alasan: retensi adalah kewajiban, bukan preferensi — hemat storage tidak boleh memangkas pembuktian.",
        "Skenario 4 — DBA butuh menonaktifkan audit sementara untuk bulk load. → Boleh dengan: persetujuan tertulis, jendela waktu, dan peristiwa penonaktifan/pengaktifan TERCATAT. Alasan: “audit dimatikan tanpa jejak” adalah bendera merah terbesar — bahkan untuk alasan sah.",
        "Aturan praktis 10 detik: kebijakan audit? → (1) tulis kategori + 5W+1H-nya; (2) identitas asli sampai ke DB; (3) jejak immutable + terpisah; (4) retensi ikut regulasi; (5) matikan audit = peristiwa audit.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mencatat “semua” tanpa kebijakan — lalu kewalahan volume dan mematikan audit diam-diam saat storage penuh. Audit yang baik itu SELEKTIF dan BERTAHAN: kategori jelas, volume terukur, retensi terjaga. “Catat semua” tanpa desain = “catat apa pun yang sempat” = tidak ada kebijakan.",
      },
      reference: "Selektif + tertulis + bertahan. Identitas asli, jejak tak terubah, retensi cukup.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Investigasi: siapa menurunkan limit kredit nasabah prioritas?",
      prose: [
        "Skenario (sintetis, untuk latihan): nasabah prioritas komplain — limit kreditnya turun dari Rp500 juta menjadi Rp200 juta tanpa pemberitahuan. Investigasi jejak menemukan: (1) perubahan dilakukan via service account aplikasi (200 teller memakai account yang sama); (2) log aplikasi hanya menyimpan 30 hari — perubahan terjadi 45 hari lalu; (3) tidak ada catatan before/after di database; (4) tiket perubahan tidak ditemukan.",
        "Pertanyaan analisis: (1) Dari 5W+1H, apa saja yang gagal dijawab? (2) Apakah ini fraud, kesalahan, atau tidak bisa ditentukan — dan kenapa jawabannya penting? (3) Tiga perbaikan konkret apa yang mencegah kasus berikutnya?",
        "Pembahasan: (1) WHO gagal (service account bersama), WHEN kabur (di luar retensi log), HOW MUCH gagal (tanpa before/after), WHY gagal (tanpa tiket). Hanya WHAT (limit berubah) dan WHERE (tabel limit) yang terjawab — 2 dari 6. (2) TIDAK BISA DITENTUKAN — dan itulah masalahnya. Tanpa jejak, bank tidak bisa membedakan kesalahan teller, bug aplikasi, dan fraud orang dalam. Dalam audit, ketidakmampuan membedakan = temuan pengendalian. (3) Perbaikan: propagasi identitas teller sampai ke database (atau auth per user); audit DML tabel limit dengan before/after + retensi 1 tahun; wajibkan nomor tiket perubahan untuk DML sensitif (precondition di aplikasi).",
        "Catatan biaya: tiga perbaikan ini = beberapa sprint. Biaya alternatifnya: satu kasus fraud orang dalam yang tidak terbukti + temuan audit berulang + nasabah prioritas yang pindah bank.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kasus ini adalah mimpi buruk risk: kerugian nyata (nasabah prioritas pergi), penyebab tidak diketahui, dan tidak ada cara mencegah ulang karena tidak tahu apa yang terjadi. Audit trail adalah satu-satunya jembatan dari “tidak tahu” menjadi “tahu dan perbaiki”.",
      },
      reference: "2 dari 6 W terjawab = investigasi gagal. Perbaiki identitas, before/after, dan tiket wajib.",
    },
    {
      id: "pendalaman-uupdp",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "UU PDP untuk DBA: Hak Subjek, Kewajiban & Jebakan Praktis",
      prose: [
        "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) bukan urusan tim legal saja — ia menerjemahkan diri menjadi pekerjaan DBA yang konkret. Dua konsep kuncinya: hak subjek data dan kewajiban pengendali data. Hak subjek mencakup akses (“tunjukkan data saya”), perbaikan, penghapusan/pemusnahan, penarikan persetujuan, dan portabilitas. Konsekuensi praktisnya: “hapus” harus BENAR-BENAR hapus. Kolom deleted_at (soft delete) bukan pemusnahan — datanya masih di sana, masih bisa dibaca, masih bisa bocor. Pemusnahan berarti hard delete atau anonimisasi yang irreversibel. Dan penghapusan butuh silsilah data (data lineage): satu baris nasabah bisa hidup di tabel utama, replika, data warehouse, file ekspor analis, dan log aplikasi — permintaan hapus yang hanya menyentuh tabel utama adalah janji yang tidak ditepati. (Catatan: ini panduan praktis, bukan nasihat hukum — validasi interpretasi ke tim legal/compliance perusahaan.)",
        "Jebakan pertama: backup vs penghapusan. Kamu tidak bisa menulis ulang tape backup bulan lalu untuk menghapus satu baris — dan tidak ada regulator yang waras menuntut itu. Praktik industri: backup berbatas retensi (backup kedaluwarsa dalam N hari sehingga data terhapus alami seiring rotasi) dan crypto-erasure (data dienkripsi dengan kunci per subjek atau per periode; hancurkan kuncinya maka data menjadi tidak terbaca selamanya). Yang penting: DOKUMENTASIKAN pendekatanmu di kebijakan atau DPIA. Auditor menerima “tidak mungkin secara teknis + kontrol kompensasi yang terdokumentasi”; yang tidak diterima adalah mengangkat bahu. Jebakan kedua: log yang tidak tamper-evident. Jejak audit yang bisa diubah oleh DBA yang sama — topik inti lesson ini — bukan bukti; gunakan hash-chained log (tiap batch memuat hash batch sebelumnya) atau penyimpanan WORM. Pemalsuan satu baris akan merusak rantai dan ketahuan.",
        "Kewajiban pengendali data yang paling operasional: melindungi data by design, mencegah akses tidak sah, dan — ini yang paling menakutkan — notifikasi pelanggaran maksimal 3×24 jam secara tertulis kepada subjek data dan otoritas. Jam mulai berdetak saat pelanggaran TERDETEKSI. Tanpa audit trail yang baik seperti dibahas di lesson ini, kamu tidak bisa menjawab “data siapa yang bocor?” dalam 72 jam — dan “kami tidak tahu” adalah jawaban terburuk di depan otoritas. Implikasi untuk DBA: deteksi harus cepat (alert anomali dari lab lesson ini bukan hiasan), dan kamu butuh runbook kebocoran: siapa yang menyatakan insiden, bagaimana scoping via log, template notifikasi yang siap pakai. DPIA (penilaian dampak) untuk pemrosesan berisiko tinggi juga butuh peta aliran data — dan siapa yang paling tahu aliran data? DBA.",
        "Jebakan ketiga: retensi tanpa akhir. Prinsip minimisasi: simpan data hanya selama diperlukan untuk tujuannya. Terjemahan DBA: kebijakan retensi per tabel — mis. data transaksi 5 tahun mengikuti kewajiban perbankan, data marketing 2 tahun — plus job purge otomatis plus BUKTI purge (catat penghapusan itu sendiri di audit trail; “kami menghapus” juga harus bisa dibuktikan). Penarikan persetujuan adalah jebakan keempat: aplikasi berhenti memakai data, tetapi salinan di warehouse dan mart analis tetap hidup — lagi-lagi soal lineage. Pola yang bekerja: klasifikasikan data dulu (tabel mana yang memuat data pribadi?), lalu petakan salinannya, baru tulis kebijakan. Urutan terbalik — tulis kebijakan dulu, inventarisasi nanti — menghasilkan dokumen indah yang tidak menutup apa pun.",
        "Terakhir: access review dan paket akuntabilitas. Review akses berkala — tiap kuartal untuk akun privileged — menjawab “masih perlukah orang ini membaca tabel gaji?”; akun yatim (karyawan resign yang login-nya masih aktif) adalah temuan klasik yang memalukan. Terapkan least privilege dan masking kolom untuk peran non-operasional (support melihat 4 digit terakhir, bukan penuh). Kumpulkan semuanya menjadi paket akuntabilitas yang selalu siap: inventaris data, kebijakan retensi, hasil access review terakhir, runbook kebocoran, bukti penanganan permintaan hapus. Uji kesiapan senior: “bila auditor datang besok pagi, apa yang bisa kutunjukkan dalam 1 jam?” Bila jawabannya “bentar, saya cari dulu” — itulah backlog-mu. Kepatuhan bukan tentang tidak pernah salah; tentang bisa membuktikan kamu mengendalikan.",
        "DPIA mini untuk DBA: bila diminta menilai dampak pemrosesan berisiko tinggi, kamu tidak perlu menjadi ahli hukum — cukup jawab lima pertanyaan dengan jujur. (1) Data pribadi apa yang diproses, di tabel mana? (2) Dari mana asalnya dan ke mana mengalir — gambarkan salinannya (replika, warehouse, ekspor, log). (3) Dasar pemrosesan dan tujuan: masih relevan dengan tujuan awal, atau sudah merembet? (4) Risiko untuk subjek bila bocor/disalahgunakan: skala 1–5 beserta skenario konkretnya. (5) Kontrol yang ada vs yang kurang: enkripsi, masking, retensi, access review — dan backlog-nya apa. Lima jawaban ini adalah 80% nilai sebuah DPIA; 20% sisanya adalah bahasa hukum yang dilengkapi tim legal. DBA yang bisa menjawab kelimanya dalam satu sore adalah DBA yang “siap audit” — dan ironisnya, proses menjawabnya sendiri yang biasanya menemukan lubang terbesar.",
      ],
      formula: String.raw`\text{storage\_audit} \approx \text{event\_per\_hari} \times \text{byte\_per\_event} \times \text{hari\_retensi}`,
      formulaNote: "Perencanaan kapasitas jejak audit untuk retensi 1 tahun (365 hari). Ukur event_per_hari dari sampel 1 minggu dan byte_per_event rata-rata. Contoh: 2 juta event/hari × 500 byte × 365 ≈ 365 GB. Interpretasi: angka ini menjadi dasar tiering — 90 hari “panas” di storage cepat, sisanya arsip dingin yang murah; bila angkanya mengejutkan, sinyalnya adalah “selektif dan bertiering”, bukan memangkas retensi diam-diam (itu pelanggaran kebijakan).",
      tasks: [],
      note: {
        title: "Intuisi: kepatuhan = bisa membuktikan, bukan bisa mengklaim",
        body: "Setiap klaim kepatuhan harus lolos uji “tunjukkan”. “Kami menghapus data pengguna” — tunjukkan log penghapusan dan bukti salinan backup tertangani. “Akses kami terkontrol” — tunjukkan hasil access review kuartal terakhir. Heuristik praktis: pertama, inventarisasi dulu — kamu tidak bisa melindungi tabel yang tidak kamu tahu ada; mulai dari “tabel mana yang memuat data pribadi?”. Kedua, soft delete bukan delete — ini jebakan PDP paling umum; hapus berarti hilang irreversibel atau teranonimisasi. Ketiga, anggap jam notifikasi 3×24 jam mulai berdetak saat deteksi — maka deteksi harus cepat; audit trail dan alert anomali adalah fondasinya. Keempat, backup bukan alasan untuk tidak menghapus — dokumentasikan strategi retensi atau crypto-erasure, jangan mengangkat bahu. Kelima, review akses seperti kamu tidak percaya siapa pun termasuk dirimu 6 bulan lalu — akun yatim dan privilege yang menumpuk adalah temuan paling memalukan karena paling mudah dicegah. Keenam, simpan paket akuntabilitas dalam satu folder yang selalu siap — kepatuhan yang butuh “bentar saya cari dulu” bukan kepatuhan. Ketujuh: perlakukan setiap permintaan hak subjek sebagai latihan audit — catat waktu responsnya; bila butuh 3 minggu untuk menemukan semua salinan data seseorang, lineage-mu yang bermasalah, bukan permintaannya.",
      },
      reference: "UU PDP → hapus = irreversibel; backup = retensi/crypto-erasure terdokumentasi; breach = notifikasi 3×24 jam; bukti = paket akuntabilitas.",
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
        "Audit trail = 5W+1H (siapa, apa, kapan, dari mana, kenapa, sebelum/sesudah) — tercatat, tak terubah, cukup lama.",
        "Kategori wajib: login, DDL, DML sensitif, perubahan permission, baca data sangat sensitif — berdasar kebijakan tertulis.",
        "Log aplikasi ≠ audit database: keduanya komplementer; uji “jalur gelap” tiap cara mencapai DB.",
        "Kepercayaan jejak = immutability × segregasi × kelengkapan — satu nol = semua nol.",
        "Mematikan audit = peristiwa audit; retensi ikut regulasi; identitas asli harus sampai ke database.",
      ],
      quiz: [
        {
          q: "Auditor bertanya “siapa mengubah data ini bulan lalu?” dan jejak tidak bisa menjawab. Ini temuan tentang apa?",
          options: [
            { text: "Pengendalian — ketidakmampuan membuktikan = pengendalian tidak memadai, terlepas dari ada/tidaknya kecurangan", why: "Benar: audit menilai kemampuan membuktikan, bukan niat. “Mungkin sah” tanpa bukti = temuan.", correct: true },
            { text: "Kecurangan — pasti ada yang disembunyikan", why: "Salah: tidak ada bukti kecurangan — justru itu masalahnya: tidak ada bukti apa pun. Jangan melompat ke tuduhan." },
            { text: "Performa — jejak memperlambat database", why: "Salah: masalahnya kelengkapan/retensi jejak, bukan dampak performanya." },
            { text: "Bukan temuan — yang penting datanya benar sekarang", why: "Salah: “benar sekarang” tidak menjawab siapa mengubah dan atas otorisasi apa — justru inti pengendalian." },
          ],
        },
        {
          q: "200 user aplikasi memakai satu service account database. Dampak ke audit trail?",
          options: [
            { text: "WHO gagal — jejak mencatat account bersama, pelaku individu tidak teridentifikasi", why: "Benar: 5W+1H runtuh di W pertama. Solusinya propagasi identitas atau auth per user.", correct: true },
            { text: "Tidak masalah — yang penting operasinya tercatat", why: "Salah: “operasi tercatat tanpa pelaku” = setengah jejak. Untuk investigasi, pelaku adalah yang paling penting." },
            { text: "Malah lebih aman karena account-nya satu", why: "Salah: satu account bersama = tidak ada akuntabilitas individu + kredensial tersebar di 200 tempat." },
            { text: "Cukup tambahkan kolom user di tabel", why: "Salah: kolom aplikasi bisa dimanipulasi aplikasi; identitas harus ditegakkan di level koneksi database." },
          ],
        },
        {
          q: "DBA yang sama mengelola database DAN bisa menghapus jejak auditnya. Masalahnya?",
          options: [
            { text: "Segregasi nol → kepercayaan jejak nol — perkalian, bukan rata-rata", why: "Benar: penjaga memegang kunci brankas bukti = pengendalian semu. Auditor menilai desain, bukan karakter.", correct: true },
            { text: "Tidak masalah selama DBA-nya senior", why: "Salah: senioritas bukan pengendalian. “Percaya Pak Budi” tidak laku di depan auditor." },
            { text: "Hanya masalah bila DBA-nya jahat", why: "Salah: pengendalian dirancang untuk kasus terburuk; menunggu kejahatan terjadi baru memperbaiki = terlambat." },
            { text: "Cukup dengan janji tertulis DBA", why: "Salah: janji bukan kontrol teknis. Yang dibutuhkan: jejak tak terubah + akses terpisah." },
          ],
        },
        {
          q: "Tim ingin memangkas retensi jejak jadi 30 hari demi hemat storage, padahal kebijakan menuntut 1 tahun. Respons yang benar?",
          options: [
            { text: "Tolak — retensi adalah kewajiban; gunakan tiering (panas + arsip dingin) sebagai gantinya", why: "Benar: kewajiban tidak dinegosiasikan dengan alasan biaya; tiering menyelesaikan biaya tanpa melanggar kewajiban.", correct: true },
            { text: "Setuju — storage mahal", why: "Salah: “mahal” tidak membatalkan kewajiban. Temuan audit + denda regulator jauh lebih mahal." },
            { text: "Pangkas diam-diam, tidak ada yang tahu", why: "Salah: pelanggaran kebijakan yang disembunyikan = dua pelanggaran sekaligus saat ketahuan." },
            { text: "Pangkas hanya untuk tabel yang jarang diaudit", why: "Salah: “jarang diaudit” bukan kriteria retensi — kriteria adalah kebijakan dan regulasi." },
          ],
        },
        {
          q: "Jejak menunjukkan DDL `DROP TABLE` jam 23:00 oleh DBA. Tindakan pertama yang benar?",
          options: [
            { text: "Investigasi: konfirmasi ke DBA + cek tiket perubahan + verifikasi dampak — jam aneh + DDL destruktif = bendera merah", why: "Benar: respons berlapis — verifikasi dulu (bisa jadi maintenance sah), tetapi perlakukan sebagai insiden sampai terbukti sah.", correct: true },
            { text: "Abaikan — DBA berhak melakukan apa pun", why: "Salah: “berhak” tidak berarti “tanpa jejak dan verifikasi”. DDL destruktif jam aneh wajib dikonfirmasi." },
            { text: "Langsung pecat DBA-nya", why: "Salah: investigasi dulu, vonis kemudian. Bisa jadi change window sah yang tidak terkomunikasikan." },
            { text: "Hapus baris jejaknya agar tidak menimbulkan panik", why: "Salah: menghapus jejak = perusakan bukti + pelanggaran segregasi — jauh lebih buruk dari DDL-nya sendiri." },
          ],
        },
        {
          q: "Nasabah memakai hak penghapusan data. Tim aplikasi mengusulkan set kolom deleted_at = now(). Penilaian DBA?",
          options: [
            { text: "Tidak memenuhi — soft delete bukan pemusnahan; butuh hard delete/anonimisasi irreversibel + penanganan salinan (replika, warehouse, backup) yang terdokumentasi", why: "Benar: data yang masih bisa dibaca bukan data yang terhapus; auditor menguji keterbacaan, bukan niat.", correct: true },
            { text: "Memenuhi — datanya sudah tidak tampil di aplikasi", why: "Salah: “tidak tampil” tidak sama dengan “terhapus”; data tetap ada di disk, backup, dan log — tetap bisa bocor." },
            { text: "Memenuhi bila kolomnya dienkripsi dulu", why: "Salah: enkripsi tanpa penghancuran kunci berarti data masih ada; crypto-erasure mensyaratkan kuncinya DIHANCURKAN." },
            { text: "Tidak perlu dipenuhi — hak penghapusan hanya untuk data kertas", why: "Salah: UU PDP mengatur data pribadi dalam bentuk apa pun, termasuk digital." },
          ],
        },
        {
          q: "Kebocoran terdeteksi Senin 09:00; scope belum jelas karena jejak tidak lengkap. Kewajiban pengendali data dan langkah DBA yang benar?",
          options: [
            { text: "Notifikasi tertulis maks 3×24 jam ke subjek + otoritas; DBA segera scoping via jejak yang ada + amankan bukti — jam berdetak sejak deteksi", why: "Benar: batas waktunya keras; “belum tahu scope” bukan alasan menunda — sampaikan yang diketahui, lengkapi menyusul.", correct: true },
            { text: "Tunggu investigasi selesai total, baru beri tahu", why: "Salah: menunggu berarti melanggar batas 3×24 jam; keterlambatan notifikasi adalah pelanggaran tersendiri." },
            { text: "Tutup-tutupi dulu, umumkan bila bocor ke media", why: "Salah: menyembunyikan pelanggaran memperberat sanksi dan menghancurkan kepercayaan; transparansi adalah kewajiban hukum." },
            { text: "Hapus log agar jejak serangan tidak disalahgunakan", why: "Salah: menghapus bukti = perusakan barang bukti + menghilangkan kemampuan scoping; amankan, jangan hapus." },
          ],
        },
      ],
    },
  ],
};
