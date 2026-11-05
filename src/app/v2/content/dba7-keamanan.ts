import type { V2Lesson } from "../lib/types";

// Matriks peran x hak akses: hijau = wajar, merah = pelanggaran least privilege.
const MATRIX_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Matriks hak akses: app_api punya superuser dan drop, analis_bi punya delete dan truncate — pelanggaran.">
<g font-family="var(--font-ui)" font-size="11">
<text x="150" y="20" text-anchor="middle" fill="var(--chart-text)" font-weight="600">SELECT</text>
<text x="225" y="20" text-anchor="middle" fill="var(--chart-text)" font-weight="600">INSERT/UPD</text>
<text x="310" y="20" text-anchor="middle" fill="var(--chart-text)" font-weight="600">DELETE/DROP</text>
<text x="410" y="20" text-anchor="middle" fill="var(--chart-text)" font-weight="600">SUPERUSER</text>
<text x="12" y="52" fill="var(--chart-text)" font-weight="600">app_api</text>
<text x="12" y="92" fill="var(--chart-text)" font-weight="600">analis_bi</text>
<text x="12" y="132" fill="var(--chart-text)" font-weight="600">etl_loader</text>
<text x="12" y="172" fill="var(--chart-text)" font-weight="600">dba_ops</text>
<g>
<rect x="132" y="40" width="36" height="20" fill="var(--c2)" opacity="0.8"/><rect x="207" y="40" width="36" height="20" fill="var(--c2)" opacity="0.8"/><rect x="292" y="40" width="36" height="20" fill="var(--c4)"/><rect x="392" y="40" width="36" height="20" fill="var(--c4)"/>
<rect x="132" y="80" width="36" height="20" fill="var(--c2)" opacity="0.8"/><rect x="292" y="80" width="36" height="20" fill="var(--c4)"/>
<rect x="132" y="120" width="36" height="20" fill="var(--c2)" opacity="0.8"/><rect x="207" y="120" width="36" height="20" fill="var(--c2)" opacity="0.8"/>
<rect x="392" y="160" width="36" height="20" fill="var(--c1)" opacity="0.85"/>
<text x="240" y="186" text-anchor="middle" font-size="10" fill="var(--text-muted)">Merah = pelanggaran · hijau = wajar · dba_ops boleh SUPERUSER (tugasnya memang itu)</text>
</g></g></svg>`;

export const dba7: V2Lesson = {
  slug: "dba7-keamanan",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA7 — Keamanan Database",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-kredensial",
      eyebrow: "Langkah 1 · Cerita",
      title: "Password yang di-push ke GitHub",
      prose: [
        "Developer magang di StartupQ lembur dan — agar \u201Cpraktis\u201D — menaruh string koneksi database produksi (user postgres, password, host) langsung di file config, lalu push ke repo GitHub publik. 11 menit kemudian, bot pemindai kredensial menemukannya. 40 menit kemudian, 2,3 juta baris data pengguna diunduh pihak tak dikenal.",
        "Twist yang lebih menyakitkan: user postgres itu adalah superuser dengan hak penuh — bisa DROP DATABASE, membaca semua tabel, membuat user baru. Dan karena audit logging tidak dinyalakan (\u201Cbiar hemat disk\u201D), tim tidak pernah tahu pasti tabel apa saja yang diambil. Notifikasi ke 2,3 juta pengguna harus berbunyi \u201Ckami tidak tahu seberapa parah\u201D — kalimat termahal dalam insiden keamanan.",
        "Keamanan database bukan soal firewall canggih. Ia soal tiga hal membosankan: siapa boleh apa (least privilege), data terenkripsi di mana (encryption), dan siapa melakukan apa tercatat di mana (audit). Tiga-tiganya adalah pekerjaan DBA.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CDatabase di VPC/private network = aman\u201D",
        body: "Network boundary hanya satu lapis. Ancaman terbesar sering dari dalam: kredensial bocor, karyawan resign yang aksesnya tidak dicabut, atau aplikasi yang memakai superuser. Pertahanan berlapis (defense in depth) berarti tiap lapis — network, auth, privilege, enkripsi, audit — berdiri sendiri.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengaudit keamanan database secara sistematis.",
        "(1) Mengidentifikasi 4 hak berbahaya (SUPERUSER, DROP, DELETE massal, akses PII mentah) dari daftar grant;",
        "(2) Menghitung kelebihan hak (dimiliki − dibutuhkan) per role dan menunjuk yang paling parah;",
        "(3) Menerapkan least privilege: hak minimal + kebutuhan yang jujur (dua sisi);",
        "(4) Menjelaskan kenapa filter di aplikasi tidak menggantikan kontrol hak di database.",
      ],
      tasks: [],
    },

    {
      id: "least-privilege",
      eyebrow: "Langkah 3 · Akses",
      title: "Least privilege: beri sekecil mungkin, bukan sebesar mungkin",
      prose: [
        "Prinsip least privilege: setiap peran hanya mendapat hak minimum untuk tugasnya. Aplikasi API butuh SELECT/INSERT/UPDATE pada tabelnya — bukan SUPERUSER, bukan DROP. Analis BI butuh SELECT — bukan DELETE. ETL butuh INSERT + COPY — bukan akses ke tabel gaji.",
        "Praktiknya: buat ROLE per fungsi (app_api, analis_bi, etl_loader, dba_ops), berikan GRANT eksplisit per tabel, dan JANGAN PERNAH memberikan superuser ke aplikasi — aplikasi adalah kode yang bisa di-exploit; superuser di tangan aplikasi = superuser di tangan penyerang.",
        "Cara membaca matriks di bawah: baris = peran, kolom = hak. Kotak hijau = wajar untuk tugasnya; merah = pelanggaran. Interpretasi: app_api dengan SUPERUSER + DROP dan analis_bi dengan DELETE/TRUNCATE adalah bom waktu — persis pola yang membuat insiden StartupQ dan FinLog (DBA4) separah itu. Satu-satunya yang boleh merah-hijau-superuser adalah dba_ops, karena memang itu pekerjaannya.",
        "💡 Intuisi: privilege adalah blast radius. Setiap hak yang kamu berikan adalah luas ledakan maksimal jika kredensial itu bocor. Desain keamanan = memperkecil blast radius tiap peran hingga sekecil mungkin.",
      ],
      figure: {
        svg: MATRIX_SVG,
        alt: "Matriks peran vs hak akses dengan pelanggaran ditandai merah.",
        caption: "Audit hak akses: merah = pelanggaran least privilege. Blast radius = luas kerusakan jika kredensial bocor.",
      },
      tasks: [],
    },
    {
      id: "enkripsi",
      eyebrow: "Langkah 4 · Enkripsi",
      title: "Enkripsi: at rest, in transit, dan kunci",
      prose: [
        "**In transit (TLS)** — Si Kurir Terenkripsi. Koneksi aplikasi ↔ database harus TLS; tanpa itu, password dan data lewat network sebagai teks biasa. Cek: koneksimu memakai sslmode=require, bukan prefer yang diam-diam fallback ke plaintext.",
        "**At rest** — Si Brankas. File data & backup di disk terenkripsi (mis. AES-256). Gunanya bukan melawan hacker yang sudah masuk database (ia melihat data terdekripsi), melainkan melawan pencurian fisik/media: disk bekas dijual, backup S3 bocor, snapshot dicuri. Ingat EduPay (DBA4): backup di S3 tanpa enkripsi = data telanjang di tangan siapa pun yang dapat file-nya.",
        "**Manajemen kunci** — Si Penjaga Kunci. Enkripsi tanpa manajemen kunci yang benar = gembok yang kuncinya digantung di sebelahnya. Kunci di KMS/HSM dengan rotasi berkala; JANGAN di file config, JANGAN di repo (ingat magang StartupQ).",
        "💡 Intuisi: enkripsi at rest melindungimu dari pencuri disk; enkripsi in transit melindungimu dari penyadap network; keduanya tidak melindungimu dari query jahat yang sudah terautentikasi — itulah tugas least privilege + audit.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CSudah di-encrypt = sudah aman dari semuanya\u201D",
        body: "Enkripsi at rest tidak menghentikan SQL injection atau kredensial bocor — penyerang yang login valid melihat data terdekripsi normal. Enkripsi adalah satu lapis, bukan seluruh benteng. Lapisan lain (privilege, audit, input sanitization) tetap wajib.",
        type: "pitfall",
      },
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 5 · Lab simulasi",
      title: "Lab: audit hak akses dan temukan pelanggarannya",
      prose: [
        "Kamu diberi daftar (peran, daftar hak). Aturan audit: hak berbahaya = SUPERUSER, DROP, TRUNCATE, DELETE. Pengecualian: dba_ops memang boleh SUPERUSER (itu tugasnya). Tugasmu: temukan semua pelanggaran — pasangan (peran, hak) berbahaya di luar pengecualian.",
        "Interpretasi hasil: 4 pelanggaran dari 8 baris = separuh konfigurasi akses melanggar prinsip. app_api dengan SUPERUSER + DROP berarti satu celah di API = database bisa dihapus total. analis_bi dengan DELETE/TRUNCATE berarti satu query salah = tabel produksi hilang (ingat DELETE tanpa WHERE di DBA4 — akan jauh lebih murah jika pelakunya tidak punya hak DELETE).",
        "Coba eksplorasi: tambahkan baris (\u201Cmagang\u201D, [\u201CSELECT\u201D, \u201CDROP\u201D]) ke daftar roles, jalankan ulang — apakah audit-mu menangkapnya? Audit yang baik adalah fungsi, bukan hafalan: ia harus menangkap pola baru, bukan hanya kasus yang sudah diketahui.",
      ],
      tasks: [
        { id: "t1", text: "Definisikan himpunan `bahaya` berisi 4 hak berbahaya" },
        { id: "t2", text: "Hitung `pelanggaran` dan `n_pelanggaran` = len(pelanggaran)" },
        { id: "t3", text: "Cetak jumlah pelanggaran" },
      ],
      expected: "jumlah_pelanggaran=4",
      note: {
        title: "Sering salah",
        body: "Lupa pengecualian dba_ops — ia memang boleh SUPERUSER. Audit tanpa pengecualian yang terdokumentasi menghasilkan noise; noise membuat orang mengabaikan audit.",
      },
      hints: [
        "bahaya = {\"SUPERUSER\", \"DROP\", \"TRUNCATE\", \"DELETE\"}.",
        "Loop: for peran, hak_list in roles: for h in hak_list: ...",
        "Syarat: h in bahaya and peran != \"dba_ops\".",
      ],
      code: {
        starter: `# Audit least privilege\n# Baris ini disiapkan (jangan diubah)\nroles = [\n    ("app_api", ["SELECT", "INSERT", "UPDATE"]),\n    ("app_api", ["SUPERUSER"]),\n    ("analis_bi", ["SELECT"]),\n    ("analis_bi", ["DELETE", "TRUNCATE"]),\n    ("etl_loader", ["SELECT", "INSERT", "COPY"]),\n    ("dba_ops", ["SUPERUSER"]),\n    ("readonly_replika", ["SELECT"]),\n    ("app_api", ["DROP"]),\n]\n\n# TULIS KODEMU: temukan pelanggaran least privilege\nbahaya = \npelanggaran = \nn_pelanggaran = \n\nprint(f"jumlah_pelanggaran={n_pelanggaran}")\nfor p in pelanggaran:\n    print(p)`,
        lockLines: 11,
        solution: `# Audit least privilege\n# Baris ini disiapkan (jangan diubah)\nroles = [\n    ("app_api", ["SELECT", "INSERT", "UPDATE"]),\n    ("app_api", ["SUPERUSER"]),\n    ("analis_bi", ["SELECT"]),\n    ("analis_bi", ["DELETE", "TRUNCATE"]),\n    ("etl_loader", ["SELECT", "INSERT", "COPY"]),\n    ("dba_ops", ["SUPERUSER"]),\n    ("readonly_replika", ["SELECT"]),\n    ("app_api", ["DROP"]),\n]\n\n# TULIS KODEMU: temukan pelanggaran least privilege\nbahaya = {"SUPERUSER", "DROP", "TRUNCATE", "DELETE"}\npelanggaran = [(r, h) for r, hl in roles for h in hl if h in bahaya and r != "dba_ops"]\nn_pelanggaran = len(pelanggaran)\n\nprint(f"jumlah_pelanggaran={n_pelanggaran}")\nfor p in pelanggaran:\n    print(p)`,
        checks: [
          { kind: "defined", task: "t1", name: "bahaya", label: "`bahaya` terdefinisi", msg: "Buat himpunan berisi 4 hak berbahaya." },
          { kind: "defined", task: "t2", name: "pelanggaran", label: "`pelanggaran` terdefinisi", msg: "Buat list pelanggaran berisi pasangan (peran, hak)." },
          { kind: "equal", task: "t2", name: "n_pelanggaran", value: 4, tol: 0.01, label: "`n_pelanggaran` = 4", msg: "app_api×(SUPERUSER, DROP) + analis_bi×(DELETE, TRUNCATE). dba_ops dikecualikan." },
          { kind: "stdout_matches", task: "t3", pattern: "jumlah_pelanggaran=4", label: "`print` menampilkan jumlah", msg: "Format: jumlah_pelanggaran=... ." },
        ],
      },
      reference: "Comprehension + filter: h in bahaya and peran != pengecualian.",
    },    {
      id: "lab2-least-privilege",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: audit least privilege",
      prose: [
        "Lab 1 menemukan hak BERBAHAYA; lab ini mengukur KELEBIHAN: hak yang dimiliki tapi tidak dibutuhkan. Tugasmu: diff MILIKI vs BUTUH per role, totalkan, dan tunjuk role paling parah.",
        "Analis punya DELETE, DROP, bahkan INSERT 'karena dulu pernah butuh sekali'. Itulah cara hak menumpuk: diberikan untuk insiden, tidak pernah dicabut. Audit berkala = satu-satunya obat.",
        "Coba juga: role 'app' selisihnya nol — apakah berarti aman? Belum tentu: BUTUH-nya sendiri harus diaudit. Least privilege butuh dua sisi: hak minimal DAN kebutuhan yang jujur.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `berlebih`: dict role → sorted list hak berlebih" },
        { id: "t2", text: "Hitung `total_berlebih`" },
        { id: "t3", text: "Tentukan `paling_parah`: role dengan hak berlebih terbanyak" },
      ],
      expected: "berlebih={'analis': ['DELETE', 'DROP', 'INSERT'], 'app': [], 'backup': ['TRUNCATE']}",
      note: {
        title: "Sering salah",
        body: "Menghitung irisan (yang benar) alih-alih selisih (yang berlebih). Yang berbahaya = MILIKI − BUTUH, bukan MILIKI ∩ BUTUH.",
      },
      hints: [
        "Set difference: MILIKI[r] - BUTUH[r].",
        "sorted(...) agar deterministik.",
        "max(berlebih, key=lambda r: len(berlebih[r])).",
      ],
      code: {
        starter: `# Hak yang DIMILIKI vs yang DIBUTUHKAN per role\nMILIKI = {\n    "analis": {"SELECT", "INSERT", "DELETE", "DROP"},\n    "app": {"SELECT", "INSERT", "UPDATE"},\n    "backup": {"SELECT", "TRUNCATE"},\n}\nBUTUH = {\n    "analis": {"SELECT"},\n    "app": {"SELECT", "INSERT", "UPDATE"},\n    "backup": {"SELECT"},\n}\n# TULIS KODEMU: berlebih, total_berlebih, paling_parah\nberlebih = {}\ntotal_berlebih = 0\npaling_parah = ''\n`,
        lockLines: 11,
        solution: `# Hak yang DIMILIKI vs yang DIBUTUHKAN per role\nMILIKI = {\n    "analis": {"SELECT", "INSERT", "DELETE", "DROP"},\n    "app": {"SELECT", "INSERT", "UPDATE"},\n    "backup": {"SELECT", "TRUNCATE"},\n}\nBUTUH = {\n    "analis": {"SELECT"},\n    "app": {"SELECT", "INSERT", "UPDATE"},\n    "backup": {"SELECT"},\n}\n\n# TULIS KODEMU: berlebih, total_berlebih, paling_parah\nberlebih = {r: sorted(MILIKI[r] - BUTUH[r]) for r in MILIKI}\ntotal_berlebih = sum(len(v) for v in berlebih.values())\npaling_parah = max(berlebih, key=lambda r: len(berlebih[r]))\n\nprint(f"berlebih={berlebih}")\nprint(f"total_berlebih={total_berlebih}  paling_parah={paling_parah}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "total_berlebih", value: 4, label: "`total_berlebih` = 4", msg: "3 (analis) + 1 (backup)." },
          { kind: "equal", task: "t3", name: "paling_parah", value: "analis", label: "`paling_parah` = analis", msg: "Hak berlebih terbanyak." },
          { kind: "stdout_matches", task: "t1", pattern: "'analis': \\['DELETE', 'DROP', 'INSERT'\\]", label: "berlebih analis benar", msg: "Set difference + sorted." },
        ],
      },
      reference: "Least privilege audit: kelebihan = dimiliki − dibutuhkan.",
    },

    {
      id: "audit-log",
      eyebrow: "Langkah 7 · Audit",
      title: "Audit logging: kamera CCTV database",
      prose: [
        "Audit log mencatat SIAPA melakukan APA, KAPAN, dari MANA. Tanpa ini, insiden StartupQ tidak bisa diinvestigasi — \u201Ckami tidak tahu seberapa parah\u201D. Nyalakan pencatatan untuk: login gagal/berhasil, DDL (CREATE/DROP/ALTER), dan GRANT/REVOKE. Untuk tabel sensitif (gaji, KTP), catat juga SELECT oleh manusia (bukan aplikasi).",
        "Trade-off jujur: audit log memakan disk dan sedikit performa. Solusi dewasa: log ke sistem terpisah (tidak memenuhi disk database — ingat DBA3: disk terpisah), retensi 90 hari untuk operasional + arsip tahunan untuk compliance, dan alert real-time untuk pola berbahaya (DROP TABLE di jam kerja, SELECT massal di tabel gaji tengah malam).",
        "Checklist hardening 60 detik: (1) tidak ada superuser untuk aplikasi; (2) password di vault + rotasi 90 hari; (3) TLS wajib (sslmode=require); (4) enkripsi at rest + backup terenkripsi; (5) audit log on + retensi; (6) akses karyawan resign dicabut < 24 jam; (7) review GRANT tiap kuartal (jadwalkan audit lab di atas!).",
      ],
      tasks: [],
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 8 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Hak akses menumpuk seperti utang: diberikan untuk insiden 'sebentar', tidak pernah dicabut. Audit berkala adalah satu-satunya pembayaran utang ini — jadwalkan, jangan andalkan ingatan.",
        "💡 Prinsipnya: default DENY. Setiap GRANT harus punya alasan tertulis dan tanggal kedaluwarsa. Hak tanpa kedaluwarsa = hak selamanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kredensial di chat dan repo = kredensial yang sudah bocor",
        body: "Anggap setiap kredensial yang pernah muncul di chat, email, repo, atau screenshot SUDAH bocor — karena secara praktis memang begitu. Chat di-backup, repo di-clone ke laptop yang hilang, screenshot diteruskan ke grup yang salah. Heuristik praktisinya: tidak ada kredensial plaintext di tiga tempat — kode, repo, dan percakapan manusia. Aplikasi membaca secret dari vault atau secret manager saat startup; manusia memakai akses sementara yang kedaluwarsa. Aturan rotasinya konkret: setiap ada karyawan keluar, setiap ada laptop hilang, setiap ada secret yang \"kayaknya sempat terlihat orang\" → rotasi hari itu juga, bukan \"nanti\". Jebakan yang paling mahal adalah service account abadi: satu username-password yang dipakai 4 aplikasi selama 6 tahun, tidak ada yang tahu siapa pemiliknya, tidak ada yang berani merotasi karena \"nanti aplikasinya mati\". Inilah utang keamanan yang bunganya dibayar saat insiden. Solusinya: satu secret per aplikasi (bukan sharing), beri nama pemilik + tanggal pembuatan, dan uji rotasi tiap kuartal — rotasi yang belum pernah diuji = rotasi yang akan gagal di hari-H. Dan jangan lupa lapisan luarnya: koneksi database WAJIB TLS bahkan di dalam VPC (\"kan sudah private\") — sniffing di jaringan cloud bukan teori, dan password yang lewat plaintext di \"jaringan internal\" adalah password yang sudah setengah bocor. Keamanan database adalah rantai: secret management, least privilege, enkripsi transit, audit log — putus satu, putus semua.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: keamanan proporsional",
      prose: [
        "Skenario 1 — MVP 3 orang, data belum sensitif. → Vault untuk kredensial + role terpisah app vs manusia + backup terenkripsi. Alasan: murah, fondasi benar sejak awal; retrofit keamanan 10x lebih mahal.",
        "Skenario 2 — Data PII (KTP, rekening) skala menengah. → + enkripsi at rest & in transit, audit log DDL + akses tabel sensitif, review GRANT kuartalan. Alasan: PII = kewajiban hukum (UU PDP); denda + reputasi jauh lebih mahal dari setup.",
        "Skenario 3 — Fintech/healthcare teregulasi. → + HSM/KMS dengan rotasi kunci, segregasi duties (yang deploy bukan yang pegang kunci), audit eksternal tahunan, alert anomali real-time. Alasan: regulator mengaudit; \u201Ckami tidak tahu\u201D bukan jawaban yang diterima.",
        "Skenario 4 — Karyawan resign Jumat sore. → Cabut akses < 24 jam (idealnya otomatis via offboarding), rotasi kredensial shared yang ia ketahui. Alasan: mayoritas insiden orang dalam berasal dari akses yang tidak dicabut — bukan dari peretasan canggih.",
        "Aturan praktis 10 detik: tanya \u201Cjika kredensial ini bocor besok pagi, seberapa luas ledakannya?\u201D — lalu perkecil jawabannya.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: SELECT * FROM gaji tengah malam",
      prose: [
        "Alert berbunyi 02:47: user analis_budi menjalankan SELECT * FROM gaji (47 ribu baris) — tabel yang seharusnya hanya diakses HRD. Investigasi: 3 bulan lalu Budi membantu proyek HRD dan diberi GRANT SELECT \u201Csementara\u201D. Tidak ada yang mencabut. Audit log menunjukkan ini query ke-14 ke tabel gaji bulan ini.",
        "Angka: denda potensial UU PDP untuk kebocoran data karyawan dapat mencapai 2% pendapatan tahunan — untuk perusahaan Rp500 miliar = Rp10 miliar. Biaya mencegahnya: review GRANT kuartalan 2 jam kerja + GRANT dengan masa berlaku (atau grup sementara).",
        "Pembahasan: akar masalah bukan Budi \u201Cjahat\u201D — melainkan privilege sementara tanpa kedaluwarsa dan tanpa review. Perbaikan: (1) cabut GRANT; (2) kebijakan \u201Ctemporary grant max 30 hari + auto-expire\u201D; (3) alert untuk akses tabel sensitif di luar jam kerja; (4) data masking: analis melihat rentang gaji, bukan angka persis, kecuali butuh. Pelajaran: keamanan yang baik mengasumsikan orang baik dengan akses kedaluwarsa — bukan orang jahat.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang keamanan database. Pikirkan blast radius di tiap soal.",
      ],
      tasks: [],
      summary: [
        "Least privilege: hak minimum per peran; aplikasi tidak pernah superuser.",
        "Blast radius = luas kerusakan jika kredensial bocor — desain untuk memperkecilnya.",
        "TLS (in transit) + enkripsi at rest + kunci di KMS (jangan di repo).",
        "Audit log = satu-satunya cara menjawab \u201Cseberapa parah\u201D saat insiden.",
        "Review GRANT berkala + cabut akses resign < 24 jam + grant sementara pakai kedaluwarsa.",
      ],
      next: { label: "DBA8 — Monitoring & Alerting", href: "/v2/learn/dba8-monitoring" },
      quiz: [
        {
          q: "Bot menemukan kredensial superuser produksi di repo publik. Mengapa ini bencana ganda?",
          options: [
            { text: "Hanya karena passwordnya lemah", why: "Kuat/lemah tidak relevan — ia sudah publik." },
            { text: "Kredensial bocor + hak superuser = blast radius maksimal (baca semua, hapus semua, buat user baru)", why: "Dua kegagalan berlapis: secret di repo DAN privilege berlebihan. Salah satunya saja sudah buruk.", correct: true },
            { text: "Hanya karena repo-nya publik", why: "Repo privat yang di-share sembarangan sama berbahayanya; akarnya di secret + privilege." },
            { text: "Tidak masalah jika segera diganti", why: "11 menit cukup bagi bot; dan tanpa audit log kamu tak tahu apa yang sudah diambil." },
          ],
        },
        {
          q: "Aplikasi API sebaiknya memakai role dengan hak?",
          options: [
            { text: "SUPERUSER agar tidak ada error permission", why: "Menukar kenyamanan dengan blast radius total — anti-pattern paling klasik." },
            { text: "SELECT/INSERT/UPDATE hanya pada tabel yang dibutuhkan", why: "Least privilege: cukup untuk tugasnya, ledakan terbatas jika di-exploit.", correct: true },
            { text: "Sama dengan DBA agar fleksibel", why: "Fleksibilitas untuk kode = fleksibilitas untuk penyerang." },
            { text: "Hak penuh kecuali DROP", why: "Masih bisa TRUNCATE/DELETE massal — blast radius tetap besar." },
          ],
        },
        {
          q: "Backup S3 tidak terenkripsi bocor ke publik. Data apa yang terlindungi?",
          options: [
            { text: "Semua, karena S3 aman", why: "S3 aman ≠ file aman; yang bocor adalah file-nya." },
            { text: "Tidak ada — file backup berisi data plaintext", why: "Tanpa enkripsi at rest pada backup, siapa pun yang memegang file membaca semuanya.", correct: true },
            { text: "Hanya password", why: "Password mungkin ter-hash, tetapi data bisnis plaintext." },
            { text: "Hanya data lama", why: "Backup berisi salinan penuh — termasuk data terbaru." },
          ],
        },
        {
          q: "Tanpa audit log, apa yang hilang saat insiden?",
          options: [
            { text: "Tidak ada, log aplikasi cukup", why: "Log aplikasi tidak mencatat query langsung ke database." },
            { text: "Kemampuan menjawab SIAPA-APA-KAPAN: investigasi buta, notifikasi harus berkata \u201Ctidak tahu seberapa parah\u201D", why: "Inilah harga StartupQ: ketidakpastian adalah biaya termahal.", correct: true },
            { text: "Hanya kecepatan query", why: "Audit log bukan soal kecepatan." },
            { text: "Hanya ruang disk", why: "Terbalik: audit log MEMAKAN disk, bukan menghemat." },
          ],
        },
        {
          q: "GRANT SELECT \u201Csementara\u201D ke analis 3 bulan lalu tak dicabut. Perbaikan sistemik?",
          options: [
            { text: "Pecat analisnya", why: "Orangnya tidak jahat; sistemnya yang tidak punya kedaluwarsa." },
            { text: "Temporary grant dengan auto-expire + review GRANT kuartalan + alert akses sensitif", why: "Menyerang akar: privilege tanpa kedaluwarsa dan tanpa pengawasan.", correct: true },
            { text: "Hapus tabel gaji", why: "Menghancurkan data bukan keamanan." },
            { text: "Blokir semua analis", why: "Membunuh produktivitas; bukan solusi proporsional." },
          ],
        },
        {
          q: "Role analis memiliki DROP TABLE 'untuk keadaan darurat'. Kebijakan yang benar?",
          options: [
            { text: "Biarkan — darurat butuh kecepatan", why: "'Darurat' tanpa definisi = kapan pun. DROP oleh analis = satu typo menghapus tabel produksi. Kecepatan darurat disediakan oleh runbook + role khusus sementara, bukan hak permanen." },
            { text: "Cabut — terapkan least privilege + prosedur darurat terpisah", why: "Tepat: hak permanen = risiko permanen. Darurat ditangani via elevasi sementara yang tercatat dan kedaluwarsa (break-glass), bukan hak abadi. Default DENY, pengecualian terdokumentasi.", correct: true },
            { text: "Ganti nama haknya agar tidak disalahgunakan", why: "Security by obscurity: mengganti nama tidak mengurangi kemampuan. Yang dihapus = haknya, bukan labelnya." },
            { text: "Batasi hanya jam kerja", why: "Pembatasan waktu tidak mencegah typo jam 10 pagi. Masalahnya = haknya ada, bukan kapan dipakai." },
          ],
        },
      ],
    },
  ],
};
