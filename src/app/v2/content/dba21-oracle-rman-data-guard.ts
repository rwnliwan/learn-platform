import type { V2Lesson } from "../lib/types";

// ── Figure: jendela kehilangan data dua skenario kegagalan ──────────────────
const RPO_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Perbandingan RPO: archivelog utuh nol jam versus archivelog korup 36 jam">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="170" y1="20" x2="170" y2="180"/><line x1="170" y1="180" x2="540" y2="180"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<text x="10" y="80">archivelog utuh</text><text x="10" y="130">archivelog korup</text>
<text x="170" y="202">0 jam</text><text x="330" y="202">18 jam</text><text x="500" y="202">36 jam</text>
</g>
<g opacity="0.9">
<rect x="172" y="68" width="6" height="20" rx="4" fill="var(--c1)"/>
<rect x="172" y="118" width="360" height="20" rx="4" fill="var(--c4)"/>
</g>
<g font-size="10" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="184" y="82">RPO = 0 jam (point-in-time recovery)</text>
<text x="380" y="132">RPO = 36 jam (mundur ke full Minggu 02:00)</text>
</g>
</svg>`;

export const dba21: V2Lesson = {
  slug: "dba21-oracle-rman-data-guard",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA21 — Oracle: RMAN, Data Guard, dan AWR",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) merancang strategi backup RMAN (backup set vs image copy, incremental level 0/1, retention policy) dan menjelaskan kenapa backup yang tak pernah diuji = rumor; (2) membedakan switchover dan failover Data Guard serta memilih SYNC vs ASYNC berdasar target RPO; (3) membaca laporan AWR/ASH untuk menemukan bottleneck (DB Time, AAS, top wait events); (4) menghitung RPO/RTO dan kebutuhan arsip redo dari angka operasional; (5) menyusun runbook switchover yang tidak mengandalkan ingatan.",
        "Rutenya: cerita backup “sukses” yang gagal saat dibutuhkan → RMAN → Data Guard → AWR/ASH → lab simulasi RPO/RTO → runbook switchover → peta keputusan → mini-case bank kecil → kuis → rangkuman. Estimasi 65 menit; lab-nya ±10 menit. Catatan jujur: tidak ada Oracle di browser — lesson ini melatih nalar operasional dan aritmetika DBA-nya, bukan klik di Enterprise Manager.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Backup adalah salinan data untuk pemulihan; restore mengembalikannya. RPO (Recovery Point Objective) = seberapa banyak data boleh hilang (dalam waktu); RTO (Recovery Time Objective) = seberapa lama boleh mati. Replikasi menyalin perubahan ke server kedua secara kontinu — berbeda dari backup yang periodik. Bottleneck performa database biasanya bukan CPU, melainkan TUNGGU: menunggu disk, menunggu lock, menunggu jaringan.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: backup menjawab “bagaimana jika datanya rusak?”, replikasi menjawab “bagaimana jika servernya mati?”. Dua pertanyaan berbeda — butuh dua jawaban berbeda. Kebanyakan bencana membutuhkan keduanya.",
      ],
      reference: "Bekal: RPO = data boleh hilang; RTO = lama boleh mati; backup ≠ replikasi; bottleneck = tunggu, bukan CPU.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Tiga tahun backup “sukses” yang ternyata rumor",
      prose: [
        "Sari, DBA sebuah perusahaan logistik, mewarisi job RMAN yang berjalan tiap malam selama tiga tahun. Log-nya selalu “completed successfully”. Audit menanyakan satu hal sederhana: “Kapan terakhir restore-test?” Jawabannya: tidak pernah. “Buat apa,” kata pendahulunya, “backup-nya kan sukses.”",
        "Lalu ransomware mengenkripsi primary di hari Selasa. Sari memulai restore — dan menemukan dua dari tujuh backup set korup (media tape yang degradasi, tidak pernah dibaca balik). Recovery yang direncanakan 4 jam menjadi 3 hari, dengan data terakhir yang bisa dipulihkan mundur ke 11 hari sebelumnya. Perusahaan membayar tebusan parsial hanya untuk mendapatkan kunci dekripsi arsip yang seharusnya tidak dibutuhkan.",
        "Twist-nya: tidak ada yang salah dengan strategi backup-nya — full mingguan + incremental harian + archivelog adalah desain yang benar. Yang salah adalah keyakinan bahwa “backup sukses = bisa restore”. RMAN punya perintah `VALIDATE` dan `RESTORE ... VALIDATE` persis untuk ini — dan tidak pernah dijalankan. Pelajaran lesson ini: backup yang tak pernah diuji bukanlah backup; ia adalah rumor yang ditulis di log.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “backup completed successfully” = aman",
        body: "Yang benar: status sukses hanya berarti proses penulisan selesai — bukan bahwa datanya bisa dibaca kembali. Satu-satunya bukti backup adalah restore yang berhasil, diuji berkala, diukur waktunya.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-rman",
      eyebrow: "Langkah 3 · Konsep",
      title: "RMAN — Si Arsiparis yang Teliti",
      prose: [
        "RMAN (Recovery Manager) adalah alat backup bawaan Oracle — dan keunggulannya bukan sekadar menyalin file, melainkan MEMAHAMI database: ia tahu block mana yang berubah, bisa memvalidasi checksum, dan mencatat semuanya di katalog. Dua format: backup set (terkompresi, hanya RMAN yang bisa baca — hemat ruang) vs image copy (salinan file 1:1 — restore lebih cepat, boros ruang).",
        "Incremental ada dua rasa: level 0 = fondasi (seperti full untuk rantai incremental), level 1 differential = blok berubah sejak backup level 1 TERAKHIR (kecil, cepat), level 1 cumulative = blok berubah sejak level 0 TERAKHIR (lebih besar, restore lebih cepat karena sedikit potongan). Retention policy menjawab “berapa lama arsip disimpan”: recovery window 7 hari (bisa mundur 7 hari ke titik mana pun) vs redundancy 2 (simpan 2 salinan terakhir). Pilih recovery window bila bisnismu bicara dalam “hari”, redundancy bila bicara dalam “salinan”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: incremental selalu lebih baik dari full",
        body: "Yang benar: incremental menghemat WAKTU BACKUP tetapi memperpanjang WAKTU RESTORE (banyak potongan disambung). Bila RTO-mu ketat, full mingguan + sedikit incremental sering menang atas incremental tiap jam.",
        type: "pitfall",
      },
      hints: [
        "💡 Jadwalkan `RESTORE DATABASE VALIDATE` tiap kuartal dan catat durasinya — angka itulah RTO jujurmu, bukan angka di slide presentasi.",
      ],
    },
    {
      id: "konsep-data-guard",
      eyebrow: "Langkah 4 · Konsep",
      title: "Data Guard — Si Pengganti yang Siaga",
      prose: [
        "Data Guard memelihara standby database: salinan yang terus di-update dari redo primary. Physical standby = replika blok-per-blok (bisa di-failover). Redo dikirim dalam dua mode: SYNC (primary menunggu ack standby sebelum commit — RPO = 0, harga = latensi) atau ASYNC (primary tidak menunggu — cepat, tetapi ada lag; failover bisa kehilangan data selisih lag).",
        "Dua operasi yang wajib dibedakan: switchover = pertukaran peran TERENCANA (maintenance), tanpa kehilangan data, bisa dibalik; failover = DARURAT saat primary mati, berpotensi kehilangan data, dan tidak bisa “dibatalkan” dengan santai. Apply lag mengukur seberapa jauh standby tertinggal — pantau terus; standby yang lag-nya 6 jam adalah standby yang berbohong tentang kesiapannya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “punya standby = punya backup”",
        body: "Yang benar: standby melindungi dari matinya SERVER, bukan dari rusaknya DATA. `DELETE` yang salah atau ransomware direplikasi ke standby dalam hitungan detik. Untuk itu butuh backup terpisah — atau delayed apply / flashback.",
        type: "pitfall",
      },
      hints: [
        "💡 Uji switchover tiap 6 bulan seperti latihan kebakaran: yang gagal saat latihan hanya memalukan; yang gagal saat bencana memecat orang.",
      ],
    },
    {
      id: "konsep-awr",
      eyebrow: "Langkah 5 · Konsep",
      title: "AWR/ASH — Si Dokter yang Membaca Denyut",
      prose: [
        "AWR (Automatic Workload Repository) mengambil snapshot statistik tiap jam; ASH (Active Session History) mencatat sampel sesi aktif tiap detik. Bersama-sama mereka menjawab “database-nya sakit apa?” tanpa menebak. Metrik kuncinya: DB Time = total waktu yang dihabiskan semua sesi (CPU + tunggu); AAS (Average Active Sessions) = DB Time dibagi elapsed time — rata-rata “berapa sesi sibuk bersamaan”.",
        "Cara membacanya: AAS 3,2 pada server 8 CPU = masih ada headroom; AAS 7,9 pada 8 CPU = antrean — lalu lihat top wait events: `db file sequential read` = disk/penyimpanan, `enq: TX - row lock contention` = aplikasi berebut baris, `log file sync` = commit menunggu redo. Obati penyebabnya, bukan gejalanya: menambah CPU saat wait-nya lock contention seperti menambah lajur tol saat macetnya di gerbang.",
      ],
      formula: String.raw`\text{AAS} = \frac{\text{DB Time}}{\text{elapsed}}`,
      formulaNote: "AAS = Average Active Sessions (rata-rata sesi aktif bersamaan); DB Time = total detik-sesi yang sibuk (CPU + tunggu); elapsed = durasi periode snapshot (detik). AAS mendekati jumlah CPU = saturasi.",
      tasks: [],
      hints: [
        "💡 Urutan diagnosis: AAS dulu (seberapa sibuk?), lalu top 5 wait events (sibuk ngapain?), lalu SQL teratas per wait (siapa pelakunya?). Jangan mulai dari SQL.",
      ],
    },
    {
      id: "lab-backup",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Simulasi RPO/RTO dari jadwal backup",
      prose: [
        "Waktunya jadi Sari — tetapi sebelum bencana. Di bawah ada kebijakan backup SINTETIS: full tiap Minggu 02:00 (800 GB), incremental level-1 tiap hari 02:00 (60 GB), archivelog kontinu 40 GB/hari, retensi 7 hari. Tugasmu: (1) hitung RPO saat primary gagal Senin 14:00 dengan archivelog utuh; (2) hitung RPO bila archivelog ternyata korup (mundur ke full terakhir); (3) hitung kebutuhan arsip redo; (4–6) estimasi RTO dari kecepatan restore dan apply.",
        "Coba: setelah lolos, ubah `retensi_hari` menjadi 30 dan `redo_gb_hari` menjadi 100 — berapa kebutuhan arsipnya? Lalu tanyakan: apakah tape budget-mu masih cukup? Itulah cara DBA bernegosiasi dengan finansial: dengan angka, bukan perasaan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rpo_dengan_arsip`: gagal Senin 14:00, archivelog utuh → point-in-time recovery" },
        { id: "t2", text: "Hitung `rpo_tanpa_arsip`: archivelog korup → mundur ke full Minggu 02:00 (dalam jam)" },
        { id: "t3", text: "Hitung `arsip_gb` = redo per hari × retensi" },
        { id: "t4", text: "Hitung `restore_jam` = (full + 1 incremental) / kecepatan restore" },
        { id: "t5", text: "Hitung `apply_jam` = 1 hari redo / kecepatan apply" },
        { id: "t6", text: "Hitung `rto_menit` = (deteksi/60 + restore + apply) × 60, bulatkan" },
        { id: "t7", text: "Jalankan dan pastikan keempat baris tercetak" },
      ],
      expected: "RPO dengan archivelog utuh: 0.0 jam\nRPO tanpa archivelog: 36.0 jam\nKebutuhan arsip redo: 280 GB\nRTO estimasi: 409 menit",
      code: {
        starter: `# Lab DBA21 — angka SINTETIS, bukan runbook Oracle sungguhan
full_gb, incr_gb, redo_gb_hari = 800.0, 60.0, 40.0  # JANGAN UBAH
retensi_hari = 7                                     # JANGAN UBAH
kecepatan_restore_gb_jam = 150.0                     # JANGAN UBAH
kecepatan_apply_gb_jam = 40.0                        # JANGAN UBAH
deteksi_menit = 5                                    # JANGAN UBAH

# TULIS KODEMU DI BAWAH INI
rpo_dengan_arsip = 0.0  # TODO t1
rpo_tanpa_arsip = 0.0   # TODO t2

arsip_gb = 0.0          # TODO t3

restore_jam = 0.0       # TODO t4
apply_jam = 0.0         # TODO t5
rto_menit = 0           # TODO t6

print(f"RPO dengan archivelog utuh: {rpo_dengan_arsip:.1f} jam")
print(f"RPO tanpa archivelog: {rpo_tanpa_arsip:.1f} jam")
print(f"Kebutuhan arsip redo: {arsip_gb:.0f} GB")
print(f"RTO estimasi: {rto_menit} menit")`,
        lockLines: 8,
        solution: `# Lab DBA21 — angka SINTETIS, bukan runbook Oracle sungguhan
full_gb, incr_gb, redo_gb_hari = 800.0, 60.0, 40.0  # JANGAN UBAH
retensi_hari = 7                                     # JANGAN UBAH
kecepatan_restore_gb_jam = 150.0                     # JANGAN UBAH
kecepatan_apply_gb_jam = 40.0                        # JANGAN UBAH
deteksi_menit = 5                                    # JANGAN UBAH

# TULIS KODEMU DI BAWAH INI
rpo_dengan_arsip = 0.0  # archivelog utuh -> bisa point-in-time, tidak ada data hilang
rpo_tanpa_arsip = 24 + 12  # Minggu 02:00 -> Senin 02:00 (24 jam) + 12 jam = 36 jam

arsip_gb = redo_gb_hari * retensi_hari

restore_jam = (full_gb + incr_gb) / kecepatan_restore_gb_jam
apply_jam = redo_gb_hari / kecepatan_apply_gb_jam
rto_menit = round((deteksi_menit / 60 + restore_jam + apply_jam) * 60)

print(f"RPO dengan archivelog utuh: {rpo_dengan_arsip:.1f} jam")
print(f"RPO tanpa archivelog: {rpo_tanpa_arsip:.1f} jam")
print(f"Kebutuhan arsip redo: {arsip_gb:.0f} GB")
print(f"RTO estimasi: {rto_menit} menit")`,
        checks: [
          { kind: "equal", task: "t1", name: "rpo_dengan_arsip", value: 0.0, tol: 0.01, label: "`rpo_dengan_arsip` = 0,0 jam", msg: "Archivelog utuh = point-in-time recovery: tidak ada data hilang." },
          { kind: "equal", task: "t2", name: "rpo_tanpa_arsip", value: 36.0, tol: 0.01, label: "`rpo_tanpa_arsip` = 36,0 jam", msg: "Minggu 02:00 → Senin 14:00 = 36 jam mundur ke full terakhir." },
          { kind: "equal", task: "t3", name: "arsip_gb", value: 280, tol: 0.01, label: "`arsip_gb` = 280 GB", msg: "40 GB/hari × 7 hari retensi." },
          { kind: "equal", task: "t6", name: "rto_menit", value: 409, tol: 1, label: "`rto_menit` = 409 menit", msg: "(5/60 + 860/150 + 40/40) × 60, dibulatkan." },
          { kind: "stdout_matches", task: "t7", pattern: "RPO tanpa archivelog: 36.0 jam", label: "Baris RPO tercetak", msg: "Pastikan baris kedua tercetak persis." },
          { kind: "stdout_matches", task: "t7", pattern: "RTO estimasi: 409 menit", label: "Baris RTO tercetak", msg: "Baris terakhir: “RTO estimasi: 409 menit”." },
        ],
      },
      reference: "RPO ditentukan oleh titik pemulihan tertua yang utuh; RTO ditentukan oleh kecepatan restore + apply. Keduanya dihitung, bukan diasumsikan.",
    },
    {
      id: "runbook",
      eyebrow: "Langkah 7 · Konsep",
      title: "Runbook switchover: jangan mengandalkan ingatan",
      prose: [
        "Switchover yang baik membosankan — dan itu pujian. Runbook minimal: (1) verifikasi apply lag < ambang (mis. 5 menit) di standby; (2) hentikan aplikasi / alihkan ke mode baca; (3) `SWITCHOVER TO standby` dari primary; (4) verifikasi peran bertukar dan aplikasi menunjuk ke database baru; (5) uji tulis kecil end-to-end; (6) catat waktu tiap langkah untuk mengukur RTO nyata. Setiap langkah punya perintah pastinya, pemiliknya, dan kriteria “lanjut atau batal”.",
        "Cara membaca chart di Langkah 4: dua batang horizontal = dua skenario kegagalan Senin 14:00; panjang batang = jam data yang hilang. Interpretasi: archivelog yang utuh membuat RPO nol — seluruh 36 jam perbedaan itu adalah nilai dari satu komponen yang sering dianggap “detail”: arsip redo yang terjaga. DBA senior tidak bertanya “apakah kita punya backup?” melainkan “apakah arsip kita utuh dan kapan terakhir diuji?”.",
      ],
      figure: {
        svg: RPO_SVG,
        alt: "Perbandingan RPO: archivelog utuh nol jam versus archivelog korup 36 jam",
        caption: "RPO dua skenario: 0 jam (archivelog utuh) vs 36 jam (archivelog korup). Selisih 36 jam adalah nilai arsip redo.",
      },
      tasks: [],
      note: {
        title: "Catatan jujur — tanpa Oracle di lab",
        body: "Perintah Data Guard/RMAN di lesson ini disajikan sebagai pengetahuan operasional konseptual. Sintaks pastinya berbeda antar versi Oracle — selalu rujuk dokumentasi versi yang kamu kelola, dan uji di lingkungan non-produksi dulu.",
        type: "risk",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan keandalan Oracle",
      prose: [
        "Skenario 1 — RPO harus 0 (perbankan, core trading): Data Guard SYNC + standby di situs berbeda + switchover teruji. Bayar latensinya; tidak ada jalan pintas.",
        "Skenario 2 — RPO 24 jam masih bisa diterima + budget terbatas: ASYNC + backup RMAN harian yang diuji restore tiap kuartal. Jujur pada manajemen soal 24 jam itu.",
        "Skenario 3 — Butuh baca laporan tanpa mengganggu OLTP: Active Data Guard (standby readable) — ingat jebakan baca basi bila apply lag besar.",
        "Skenario 4 — Database melambat misterius tiap jam 10: buka AWR — cek AAS vs CPU, lalu top wait events. Jangan tambah CPU sebelum tahu wait-nya apa.",
        "Aturan praktis 10 detik: (1) Tulis RPO/RTO-mu dalam ANGKA sebelum memilih teknologi. (2) Backup tanpa restore-test = rumor. (3) Standby tanpa pantau apply lag = dekorasi. (4) Switchover tanpa latihan = judi.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Bank kecil, redo 40 GB/hari: SYNC atau ASYNC?",
      prose: [
        "Bank perkreditan rakyat dengan database 800 GB menghasilkan 40 GB redo per hari (rata-rata ~3,7 Mbps). Manajemen menuntut RPO = 0 “karena ini bank”, tetapi aplikasi core-nya sensitif latensi: tiap 5 ms tambahan menurunkan throughput 8%. Link ke situs DR berkapasitas 50 Mbps dengan RTT 12 ms. Pertanyaan: (1) Apakah SYNC feasible secara bandwidth dan latensi? (2) Bila ya, apa risikonya saat link DR putus? (3) Bila manajemen menolak latensi tambahan, alternatif jujur apa yang kamu tawarkan?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) Ya: 3,7 Mbps << 50 Mbps, dan RTT 12 ms berarti commit menunggu ~12 ms — masih dalam batas wajar OLTP. (2) Risiko: bila link putus dan standby tidak bisa dihubungi, SYNC membuat primary HANG (tidak bisa commit) — butuh kebijakan failover link yang jelas, atau mode Maximum Availability yang turun ke ASYNC otomatis. (3) Alternatif jujur: ASYNC dengan RPO = lag (ukur dan laporkan, mis. < 1 menit) + backup RMAN ketat — lalu minta manajemen menandatangani penerimaan RPO tersebut. DBA tidak berbohong soal RPO; ia membuatnya eksplisit.",
        type: "risk",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Backup yang tak pernah diuji = rumor; satu-satunya bukti adalah restore yang berhasil dan terukur waktunya.",
        "RMAN: backup set (hemat) vs image copy (restore cepat); incremental differential (sejak level-1 terakhir) vs cumulative (sejak level-0).",
        "Data Guard: SYNC = RPO 0 dengan harga latensi; ASYNC = cepat dengan jendela kehilangan sebesar lag; switchover terencana, failover darurat.",
        "Standby melindungi dari matinya server, BUKAN dari rusaknya data (DELETE salah ikut terreplikasi).",
        "AWR/ASH: AAS = DB Time / elapsed; diagnosis mulai dari AAS → top wait events → SQL pelaku.",
        "RPO/RTO ditulis dalam angka sebelum memilih teknologi — dan ditandatangani oleh yang menanggung risikonya.",
      ],
      next: { label: "DBA22 — SQL Server: Always On & T-SQL untuk DBA", href: "/learn/dba22-sql-server-always-on" },
      quiz: [
        {
          q: "Job backup RMAN “completed successfully” tiap malam selama 3 tahun, tak pernah restore-test. Vonis DBA yang tepat?",
          options: [
            { text: "Aman — log sukses 3 tahun adalah bukti", why: "Salah: ini persis jebakan cerita pembuka — sukses proses ≠ bisa restore.", correct: false },
            { text: "Belum terbukti: jadwalkan RESTORE VALIDATE dan ukur durasinya — itulah RTO jujurmu", why: "Benar: satu-satunya bukti backup adalah restore yang berhasil.", correct: true },
            { text: "Ganti ke incremental tiap jam agar lebih aman", why: "Salah: frekuensi bukan masalahnya — ketiadaan pengujian yang masalah.", correct: false },
            { text: "Hapus backup lama untuk hemat ruang", why: "Salah dan berbahaya: menghapus arsip tanpa verifikasi memperpendek recovery window.", correct: false },
          ],
        },
        {
          q: "Bedanya incremental level-1 differential vs cumulative?",
          options: [
            { text: "Tidak ada beda, hanya penamaan", why: "Salah: keduanya nyata berbeda dalam cakupan blok.", correct: false },
            { text: "Differential: blok berubah sejak level-1 terakhir (kecil); cumulative: sejak level-0 terakhir (lebih besar, restore lebih cepat)", why: "Benar: differential hemat backup, cumulative hemat restore — pilih sesuai RTO.", correct: true },
            { text: "Cumulative lebih kecil dari differential", why: "Salah: cumulative mencakup rentang lebih panjang, jadi lebih besar.", correct: false },
            { text: "Differential hanya untuk archivelog", why: "Salah: differential/cumulative adalah konsep backup datafile, bukan archivelog.", correct: false },
          ],
        },
        {
          q: "“Kita punya physical standby, jadi tidak butuh backup lagi.”",
          options: [
            { text: "Benar — standby adalah backup yang lebih baik", why: "Salah: standby = replikasi, bukan backup.", correct: false },
            { text: "Salah: standby melindungi dari matinya server, bukan rusaknya data — DELETE salah/ransomware ikut terreplikasi dalam hitungan detik", why: "Benar: butuh backup terpisah atau delayed apply untuk kesalahan logis.", correct: true },
            { text: "Benar asal mode-nya SYNC", why: "Salah: SYNC/ ASYNC soal kehilangan data saat failover, bukan soal kesalahan logis.", correct: false },
            { text: "Salah karena standby lebih lambat", why: "Salah alasan: kecepatan bukan masalahnya — cakupan perlindungannya.", correct: false },
          ],
        },
        {
          q: "Manajemen menuntut RPO = 0. Pilihan Data Guard yang jujur?",
          options: [
            { text: "ASYNC dengan lag kecil", why: "Salah: lag sekecil apa pun = jendela kehilangan > 0.", correct: false },
            { text: "SYNC — primary menunggu ack standby; bayar dengan latensi commit dan risiko hang saat link putus", why: "Benar: hanya SYNC yang menjamin RPO 0, lengkap dengan harganya.", correct: true },
            { text: "Backup RMAN tiap jam", why: "Salah: backup periodik tidak bisa memberi RPO 0.", correct: false },
            { text: "Tambah CPU di primary", why: "Salah: CPU tidak ada hubungannya dengan kehilangan data.", correct: false },
          ],
        },
        {
          q: "AWR menunjukkan AAS = 7,9 pada server 8 CPU, top wait = “enq: TX - row lock contention”. Tindakan tepat?",
          options: [
            { text: "Tambah CPU menjadi 16", why: "Salah: wait-nya lock contention (aplikasi berebut baris), bukan kekurangan CPU.", correct: false },
            { text: "Telusuri SQL pelaku dan pola aksesnya — masalahnya perebutan baris di aplikasi, bukan kapasitas", why: "Benar: obati penyebab (kontensi), bukan gejala (AAS tinggi).", correct: true },
            { text: "Restart database tiap malam", why: "Salah: restart tidak mengubah pola kontensi aplikasi.", correct: false },
            { text: "Naikkan SGA", why: "Salah: memori tidak menyelesaikan row lock contention.", correct: false },
          ],
        },
        {
          q: "Bedanya switchover dan failover?",
          options: [
            { text: "Sama saja, hanya istilah", why: "Salah: keduanya berbeda sifat dan risikonya.", correct: false },
            { text: "Switchover terencana tanpa kehilangan data dan bisa dibalik; failover darurat saat primary mati, berpotensi kehilangan data", why: "Benar: switchover = latihan yang direncanakan; failover = pemadam kebakaran.", correct: true },
            { text: "Failover lebih aman dari switchover", why: "Salah: failover justru yang berisiko (darurat, mungkin ada data loss).", correct: false },
            { text: "Switchover hanya untuk backup", why: "Salah: switchover menukar peran primary-standby, bukan soal backup.", correct: false },
          ],
        },
      ],
    },
  ],
};
