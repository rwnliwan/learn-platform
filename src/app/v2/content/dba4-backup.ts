import type { V2Lesson } from "../lib/types";

// Timeline: full backup 02:00, WAL tiap 5 mnt, insiden 14:35. RPO tanpa WAL = 12,58 jam;
// dengan WAL = 5 mnt. RTO = restore + replay.
const TIMELINE_SVG = `<svg viewBox="0 0 480 170" role="img" aria-label="Timeline backup: full backup jam 2, arsip WAL tiap 5 menit, insiden jam 14:35.">
<g font-family="var(--font-ui)">
<line x1="30" y1="80" x2="450" y2="80" stroke="var(--chart-grid)" stroke-width="2"/>
<rect x="60" y="62" width="14" height="36" fill="var(--c2)"/>
<text x="67" y="52" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-weight="600">FULL</text>
<text x="67" y="116" text-anchor="middle" font-size="11" fill="var(--text-muted)">02:00</text>
<g fill="var(--c3)" opacity="0.8">
<rect x="120" y="70" width="8" height="20"/><rect x="150" y="70" width="8" height="20"/><rect x="180" y="70" width="8" height="20"/><rect x="210" y="70" width="8" height="20"/><rect x="240" y="70" width="8" height="20"/><rect x="270" y="70" width="8" height="20"/><rect x="300" y="70" width="8" height="20"/><rect x="330" y="70" width="8" height="20"/>
</g>
<text x="225" y="52" text-anchor="middle" font-size="11" fill="var(--chart-text)">arsip WAL / 5 mnt</text>
<line x1="380" y1="40" x2="380" y2="110" stroke="var(--c4)" stroke-width="2"/>
<text x="380" y="30" text-anchor="middle" font-size="11" fill="var(--c4)" font-weight="600">INSIDEN 14:35</text>
<text x="380" y="126" text-anchor="middle" font-size="11" fill="var(--text-muted)">disk corrupt</text>
<path d="M74 96 Q 227 130 376 96" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5,4"/>
<text x="225" y="148" text-anchor="middle" font-size="11" fill="var(--text-muted)">RPO tanpa WAL = 12,58 jam · dengan WAL = 5 mnt</text>
</g></svg>`;

export const dba4: V2Lesson = {
  slug: "dba4-backup",
  track: "Database Administrator",
  module: "Fondasi Operasi",
  title: "DBA4 — Backup & Recovery: RPO/RTO",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-restore-gagal",
      eyebrow: "Langkah 1 · Cerita",
      title: "Backup-nya ada. Restore-nya tidak bisa.",
      prose: [
        "Kamis 03:12, disk database EduPay corrupt. DBA junior, Rian, tetap tenang: \u201CBackup harian ada di S3, aman.\u201D Ia mulai restore… dan 40 menit kemudian pucat. File backup 3 hari terakhir corrupt — job backup \u201Csukses\u201D setiap malam, tetapi tidak ada yang pernah memverifikasi isinya. Backup 4 hari lalu bisa dipakai, tetapi berarti kehilangan 4 hari transaksi: ~18 ribu pembayaran.",
        "Twist yang lebih pahit: kalaupun backup-nya sehat, Rian baru sadar restore 600 GB butuh ~11 jam di kecepatan network mereka — sementara kontrak SLA menuntut sistem pulih dalam 4 jam. Backup yang (a) tidak teruji dan (b) tidak memenuhi RTO bukanlah strategi recovery; ia hanyalah file mahal di S3.",
        "Lesson ini tentang dua singkatan yang mengatur seluruh strategi backup: RPO (berapa banyak data boleh hilang) dan RTO (berapa lama boleh down). Semua keputusan backup — full vs incremental, seberapa sering, di mana disimpan — adalah turunan dari dua angka ini.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CJob backup sukses = data aman\u201D",
        body: "Job \u201Csukses\u201D hanya berarti proses backup selesai tanpa error — tidak menjamin file-nya bisa di-restore. Satu-satunya bukti backup valid adalah restore yang berhasil dilakukan, di lingkungan terpisah, secara berkala. DBA senior menjadwalkan \u201Crestore drill\u201D seperti pemadam menjadwalkan latihan kebakaran.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang strategi backup yang memenuhi RPO/RTO — bukan sekadar 'punya backup'.",
        "(1) Menghitung RPO dari frekuensi backup + arsip WAL, dan RTO dari durasi restore + replay;",
        "(2) Memverifikasi backup MUAT di jendela waktunya termasuk verifikasi (bukan cuma copy);",
        "(3) Menjelaskan kenapa backup yang tidak pernah diuji restore = harapan, bukan backup;",
        "(4) Memilih full vs incremental vs WAL archiving berdasar RPO yang ditargetkan.",
      ],
      tasks: [],
    },

    {
      id: "strategi-backup",
      eyebrow: "Langkah 3 · Strategi",
      title: "Tiga lapis pertahanan: full, incremental, WAL",
      prose: [
        "**Full backup** — Si Fondasi. Salinan seluruh database, mis. tiap Minggu 02:00. Kepribadiannya: sederhana dan bisa berdiri sendiri, tetapi berat (600 GB tiap kali) dan lambat. Tanpa full yang sehat, lapis lain tidak berguna.",
        "**Incremental / differential** — Si Penghemat. Hanya menyimpan perubahan sejak backup terakhir. Incremental: sejak backup APAPUN terakhir (kecil, tetapi restore butuh rantai full + semua incremental). Differential: sejak FULL terakhir (lebih besar, restore hanya butuh full + 1 differential). Pilih differential jika kamu takut merangkai rantai panjang saat panik jam 3 pagi.",
        "**WAL archiving (PITR)** — Si Mesin Waktu. Setiap segmen WAL diarsipkan tiap beberapa menit. Dengan full + arsip WAL lengkap, kamu bisa me-replay hingga detik sebelum insiden — bahkan \u201Cputar balik\u201D ke titik waktu tertentu (point-in-time recovery), mis. sebelum DELETE tanpa WHERE dijalankan intern magang. Inilah yang memangkas RPO dari 24 jam menjadi hitungan menit.",
        "💡 Intuisi: backup menjawab \u201Cpunya salinan?\u201D; recovery menjawab \u201Cbisa kembali online kapan, dengan kehilangan berapa?\u201D. Industri menilai DBA dari jawaban kedua, bukan yang pertama.",
      ],
      tasks: [],
    },
    {
      id: "rpo-rto",
      eyebrow: "Langkah 4 · RPO & RTO",
      title: "RPO dan RTO: dua angka yang mengatur semuanya",
      prose: [
        "**RPO (Recovery Point Objective)**: seberapa banyak data (dalam satuan waktu) yang boleh hilang. RPO 24 jam = \u201Ckalau database meledak, kami rela kehilangan transaksi 24 jam terakhir.\u201D Ditentukan oleh frekuensi backup: full harian tanpa WAL → RPO 24 jam; WAL tiap 5 menit → RPO 5 menit.",
        "**RTO (Recovery Time Objective)**: berapa lama sistem boleh mati sampai pulih. RTO 4 jam = \u201Cdalam 4 jam harus online lagi.\u201D Ditentukan oleh kecepatan restore: ukuran backup ÷ throughput + waktu replay WAL + verifikasi.",
        "Cara membaca timeline di bawah: garis horizontal adalah waktu; kotak FULL di 02:00; kotak-kotak kecil adalah arsip WAL tiap 5 menit; garis merah 14:35 adalah insiden. Busur putus-putus menunjukkan jendela kehilangan data. Interpretasi: tanpa WAL, semua transaksi 02:00–14:35 (12,58 jam) hilang; dengan WAL, hanya 5 menit terakhir yang berisiko. Itulah perbedaan satu lapis arsitektur.",
        "💡 Intuisi: RPO dibeli dengan frekuensi backup (dan WAL); RTO dibeli dengan kecepatan restore (network, paralelisme, latihan). Keduanya dibayar di muka, dinikmati saat bencana — asuransi paling murni di dunia IT.",
      ],
      formula: String.raw`\text{RPO} \approx \text{interval backup} \qquad \text{RTO} \approx \frac{\text{ukuran backup}}{\text{throughput}} + t_{\text{replay}}`,
      formulaNote: "RPO ≈ jarak antar backup (worst case). RTO ≈ waktu menyalin backup + me-replay WAL + verifikasi. Keduanya dihitung SEBELUM bencana, dinegosiasikan dengan bisnis.",
      figure: {
        svg: TIMELINE_SVG,
        alt: "Timeline: full backup 02:00, arsip WAL tiap 5 menit, insiden 14:35. RPO tanpa WAL 12,58 jam, dengan WAL 5 menit.",
        caption: "Full harian + WAL tiap 5 menit. Tanpa WAL: RPO 12,58 jam. Dengan WAL: RPO 5 menit.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CRPO 0 = selalu terbaik\u201D",
        body: "RPO mendekati nol butuh replikasi sinkron + WAL archiving agresif — harganya latensi tulis lebih tinggi dan arsitektur lebih kompleks. Untuk blog company profile, RPO 24 jam sudah mewah. Tetapkan RPO dari biaya kehilangan data, bukan dari gengsi nol.",
        type: "pitfall",
      },
    },
    {
      id: "lab-rpo",
      eyebrow: "Langkah 5 · Lab simulasi",
      title: "Lab: hitung RPO-mu dan uji RTO-mu",
      prose: [
        "Skenario: full backup tiap hari 02:00, arsip WAL tiap 5 menit, ukuran database 40 GB, kecepatan restore 200 MB/s, replay WAL 30 menit data per 1 menit replay. Insiden: disk corrupt 14:35.",
        "Tugasmu menghitung empat angka: (1) RPO tanpa WAL = selisih insiden − backup terakhir (jam); (2) RPO dengan WAL = interval arsip (menit); (3) waktu restore full saja (menit); (4) RTO total = restore + replay seluruh WAL sejak 02:00.",
        "Interpretasi hasil: RPO 12,58 jam tanpa WAL vs 5 menit dengan WAL — satu lapis arsitektur mengubah kehilangan 18 ribu transaksi menjadi segelintir. RTO ~28,6 menit berarti kontrak \u201Cpulih dalam 4 jam\u201D aman; tetapi untuk database 600 GB (kasus EduPay), hitung ulang: 600×1024/200/60 ≈ 51 menit restore saja. Coba ubah ukuran menjadi 600 di kodemu dan lihat RTO-nya — masih di bawah 4 jam?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rpo_no_wal_jam` (jam, 3 desimal)" },
        { id: "t2", text: "Hitung `restore_mnt` untuk 40 GB @ 200 MB/s (2 desimal)" },
        { id: "t3", text: "Hitung `rto_total_mnt` = restore + replay WAL (2 desimal)" },
      ],
      expected: "rpo_no_wal_jam=12.583  restore_mnt=3.41  rto_total_mnt=28.58",
      note: {
        title: "Sering salah",
        body: "Lupa konversi GB→MB (×1024) atau jam→menit (×60). Tulis satuan di tiap variabel — rpo_no_wal_JAM vs restore_MNT — agar tidak tercampur.",
      },
      hints: [
        "Selisih 14:35 − 02:00 = 12 jam 35 menit = 12 + 35/60.",
        "restore_mnt = 40*1024/200/60.",
        "replay = (rpo_no_wal_jam*60)/30; rto = restore_mnt + replay.",
      ],
      code: {
        starter: `# Kalkulator RPO/RTO\n# Baris ini disiapkan (jangan diubah)\nukuran_gb, speed_mbps, wal_interval_mnt = 40, 200, 5\nrpo_wal_mnt = wal_interval_mnt  # worst case = satu interval arsip\n\n# TULIS KODEMU\nrpo_no_wal_jam = \nrestore_mnt = \nrto_total_mnt = \n\nprint(f"rpo_no_wal_jam={rpo_no_wal_jam:.3f}  restore_mnt={restore_mnt:.2f}  rto_total_mnt={rto_total_mnt:.2f}")`,
        lockLines: 4,
        solution: `# Kalkulator RPO/RTO\n# Baris ini disiapkan (jangan diubah)\nukuran_gb, speed_mbps, wal_interval_mnt = 40, 200, 5\nrpo_wal_mnt = wal_interval_mnt  # worst case = satu interval arsip\n\n# TULIS KODEMU\nrpo_no_wal_jam = 12 + 35/60\nrestore_mnt = ukuran_gb*1024/speed_mbps/60\nrto_total_mnt = restore_mnt + (rpo_no_wal_jam*60)/30\n\nprint(f"rpo_no_wal_jam={rpo_no_wal_jam:.3f}  restore_mnt={restore_mnt:.2f}  rto_total_mnt={rto_total_mnt:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rpo_no_wal_jam", value: 12.583, tol: 0.002, label: "`rpo_no_wal_jam` = 12,583", msg: "14:35 − 02:00 = 12 jam 35 menit." },
          { kind: "equal", task: "t2", name: "restore_mnt", value: 3.41, tol: 0.02, label: "`restore_mnt` = 3,41", msg: "40×1024/200/60 = 3,41 menit." },
          { kind: "equal", task: "t3", name: "rto_total_mnt", value: 28.58, tol: 0.05, label: "`rto_total_mnt` = 28,58", msg: "3,41 + (12,583×60)/30 = 28,58 menit." },
          { kind: "stdout_matches", task: "t3", pattern: "rpo_no_wal_jam=12\\.583\\s+restore_mnt=3\\.41\\s+rto_total_mnt=28\\.58", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "RPO ≈ interval backup. RTO ≈ ukuran/throughput + replay.",
    },    {
      id: "lab2-jendela-backup",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: muatkah backup di jendelanya?",
      prose: [
        "Full backup 800 GB @ 200 MB/s = 68,3 menit — muat di jendela 4 jam? Tugasmu: hitung durasi full dan incremental termasuk verifikasi 25 menit, lalu putuskan mana yang muat.",
        "Hasilnya mengejutkan banyak orang: full MUAT (93 menit < 240). Tetapi 'muat' ≠ 'aman': backup yang berlari 93 menit beririsan dengan batch pagi = I/O contention. Jendela bukan satu-satunya batasan.",
        "Coba juga: throughput turun ke 120 MB/s saat batch jalan. Apakah full masih muat? Inilah kenapa DBA mengukur throughput NYATA, bukan spesifikasi brosur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `full_mnt` dan `incr_mnt` (1 desimal)" },
        { id: "t2", text: "Tentukan `muat_full`, `muat_incr`: muat di jendela incl. verifikasi?" },
      ],
      expected: "full_mnt=68.3  incr_mnt=5.1",
      note: {
        title: "Sering salah",
        body: "Lupa verifikasi 25 menit — 'kan cuma copy'. Backup tanpa verifikasi = harapan, bukan backup. Selalu masukkan ke hitungan jendela.",
      },
      hints: [
        "GB→MB: kali 1024. Detik = MB / MBPS; menit = detik / 60.",
        "Total = durasi + VERIF_MNT; bandingkan dengan JENDELA_MNT.",
        "muat_* adalah boolean.",
      ],
      code: {
        starter: `# Full backup 800 GB @ 200 MB/s. Incremental harian 60 GB @ 200 MB/s.\n# Jendela backup: 02.00-06.00 (4 jam). Verifikasi + checksum: 25 menit.\nFULL_GB, INCR_GB, MBPS = 800, 60, 200\nJENDELA_MNT, VERIF_MNT = 240, 25\n# TULIS KODEMU: full_mnt, incr_mnt, muat_full, muat_incr\nfull_mnt, incr_mnt = 0.0, 0.0\nmuat_full, muat_incr = True, True\n`,
        lockLines: 4,
        solution: `# Full backup 800 GB @ 200 MB/s. Incremental harian 60 GB @ 200 MB/s.\n# Jendela backup: 02.00-06.00 (4 jam). Verifikasi + checksum: 25 menit.\nFULL_GB, INCR_GB, MBPS = 800, 60, 200\nJENDELA_MNT, VERIF_MNT = 240, 25\n\n# TULIS KODEMU: full_mnt, incr_mnt, muat_full, muat_incr\nfull_mnt = round(FULL_GB * 1024 / MBPS / 60, 1)\nincr_mnt = round(INCR_GB * 1024 / MBPS / 60, 1)\nmuat_full = (full_mnt + VERIF_MNT) <= JENDELA_MNT\nmuat_incr = (incr_mnt + VERIF_MNT) <= JENDELA_MNT\n\nprint(f"full_mnt={full_mnt}  incr_mnt={incr_mnt}")\nprint(f"muat_full={muat_full}  muat_incr={muat_incr}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "full_mnt", value: 68.3, tol: 0.05, label: "`full_mnt` = 68,3", msg: "800 GB @200 MB/s." },
          { kind: "equal", task: "t1", name: "incr_mnt", value: 5.1, tol: 0.05, label: "`incr_mnt` = 5,1", msg: "60 GB @200 MB/s." },
          { kind: "stdout_matches", task: "t2", pattern: "muat_full=True  muat_incr=True", label: "keduanya muat", msg: "Termasuk verifikasi 25 menit." },
        ],
      },
      reference: "Backup window math: durasi + verifikasi ≤ jendela.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 3-2-1 bukan jargon: 3 salinan, 2 media berbeda, 1 offsite. Backup yang semuanya di disk yang sama dengan database = satu kebakaran menghapus data DAN cadangannya.",
        "💡 Uji restore adalah satu-satunya bukti backup bekerja. Jadwalkan seperti jadwal backup-nya: backup yang belum pernah di-restore = Schrödinger's backup.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kunci enkripsi backup jangan tidur sekamar dengan backup-nya",
        body: "Backup terenkripsi yang kuncinya tersimpan di server yang sama adalah teater keamanan. Skenario yang membunuhnya sederhana: ransomware mengenkripsi server database — termasuk folder backup DAN file kunci yang tidur di sebelahnya. Kamu memegang brankas yang kuncinya ikut terbakar bersama rumahnya. Heuristik praktisinya: kunci enkripsi backup wajib tinggal di tempat yang BERBEDA secara fisik dan administratif — KMS atau secret manager cloud, vault terpisah, atau minimal media offsite yang berbeda dari media backup. Aturan \"tiga tempat\" yang kupakai: data di server A, backup di storage B, kunci di vault C — tidak ada dua yang mati bersamaan oleh satu insiden. Jebakan kedua: backup terenkripsi yang belum pernah di-restore dengan kunci yang diambil dari vault adalah backup Schrödinger versi enkripsi — kamu tidak tahu apakah dekripsinya bekerja sampai hari kamu paling membutuhkannya. Uji restore-mu harus mencakup DEKRIPSI memakai kunci yang diambil dari vault (bukan dari cache lokal), end-to-end, terjadwal. Dan yang ketiga: rotasi kunci. Kunci yang sama dipakai 5 tahun = 5 tahun backup bisa dibuka oleh siapa pun yang pernah memegangnya, termasuk mantan karyawan. Setiap rotasi, verifikasi bahwa backup lama masih bisa dibuka (atau re-enkripsi). Enkripsi tanpa manajemen kunci bukan keamanan — itu hanya mengubah \"tolong jangan dibaca\" menjadi \"tolong jangan dibaca, dengan langkah ekstra\".",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: strategi backup untuk tiap RPO/RTO",
      prose: [
        "Skenario 1 — RPO 24 jam, RTO 8 jam, database 50 GB (blog, CMS). → Full harian + simpan 7 hari. Alasan: murah, sederhana, restore 50 GB cuma ~4 menit — jauh di bawah RTO.",
        "Skenario 2 — RPO 1 jam, RTO 2 jam, database 300 GB (SaaS). → Full mingguan + differential harian + WAL tiap 15 menit. Alasan: differential memangkas rantai restore; WAL menutup jendela 1 jam.",
        "Skenario 3 — RPO 5 menit, RTO 30 menit, database 2 TB (fintech). → Full mingguan + incremental harian + WAL tiap 5 menit + standby replica (restore dari backup 2 TB terlalu lambat untuk RTO 30 menit — failover ke replica lebih cepat). Alasan: di skala ini, backup saja tidak cukup memenuhi RTO; butuh replikasi (DBA5).",
        "Skenario 4 — \u201CKami belum pernah restore drill.\u201D → Jadwalkan minggu ini, di environment terpisah, ukur waktunya. Alasan: RTO di atas kertas ≠ RTO nyata; drill mengubah asumsi menjadi fakta.",
        "Aturan praktis 10 detik: 3-2-1 — 3 salinan, 2 media berbeda, 1 offsite. Dan backup yang belum di-restore = belum ada backup.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: DELETE tanpa WHERE",
      prose: [
        "Jumat 16:40, analis magang di FinLog menjalankan DELETE FROM transaksi tanpa WHERE di database produksi — 2,1 juta baris hilang dalam 3 detik. Tidak ada corrupt disk; database-nya sehat. Yang hilang adalah data.",
        "Strategi backup FinLog: full harian 01:00 + WAL tiap 10 menit. Opsi A: restore full 01:00 (kehilangan 15,7 jam transaksi ≈ 41 ribu transaksi baru). Opsi B: PITR — restore full 01:00 lalu replay WAL hingga 16:39:59, satu detik sebelum DELETE. Kehilangan ≈ 0 (hanya transaksi dalam 10 menit terakhir yang berisiko, dan bisa dicek manual).",
        "Pembahasan: tim memilih B. Restore 800 GB (~68 menit) + replay 15,7 jam WAL (~31 menit) = total ~100 menit downtime. Mahal? Bandingkan dengan opsi A: 41 ribu transaksi hilang = Rp2,3 miliar yang harus direkonsiliasi manual berminggu-minggu. Pelajaran ganda: (1) PITR adalah alasan WAL archiving ada — bukan sekadar \u201Cbackup tambahan\u201D; (2) insiden ini juga kegagalan akses (magang punya DELETE di produksi — DBA7) — recovery yang baik tidak menghapus kebutuhan pencegahan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang backup dan recovery. Bedakan RPO vs RTO dengan tajam.",
      ],
      tasks: [],
      summary: [
        "Job backup \u201Csukses\u201D ≠ bisa di-restore — buktinya hanya restore drill berkala.",
        "Full = fondasi; incremental/differential = penghemat; WAL archiving = mesin waktu (PITR).",
        "RPO ≈ interval backup (dibeli dengan frekuensi); RTO ≈ ukuran/throughput + replay (dibeli dengan kecepatan restore).",
        "3-2-1: 3 salinan, 2 media, 1 offsite.",
        "Di skala besar, RTO ketat tidak bisa dipenuhi backup saja — butuh replikasi/failover.",
      ],
      next: { label: "DBA5 — Replikasi & High Availability", href: "/v2/learn/dba5-replikasi" },
      quiz: [
        {
          q: "Full harian 02:00 tanpa WAL archiving; database corrupt 14:35. RPO?",
          options: [
            { text: "5 menit", why: "Itu RPO jika ada WAL tiap 5 menit — tidak ada di sini." },
            { text: "~12,6 jam (transaksi 02:00–14:35 hilang)", why: "Tanpa WAL, titik pulih terakhir adalah full 02:00. Inilah harga tanpa arsip WAL.", correct: true },
            { text: "0 — tidak ada yang hilang", why: "RPO 0 butuh replikasi sinkron/WAL; full harian tidak memberikannya." },
            { text: "24 jam", why: "24 jam adalah interval backup, tetapi insiden terjadi 12,6 jam setelah backup terakhir." },
          ],
        },
        {
          q: "Job backup sukses tiap malam selama setahun, belum pernah restore drill. Status sebenarnya?",
          options: [
            { text: "Aman, sudah setahun sukses", why: "Mitos DBA4: sukses job ≠ file bisa di-restore (kasus EduPay: 3 hari file corrupt)." },
            { text: "Belum terbukti — backup = harapan sampai restore drill berhasil", why: "Satu-satunya bukti adalah restore yang berhasil di environment terpisah.", correct: true },
            { text: "Aman jika disimpan di S3", why: "Media penyimpanan tidak menjamin isi file valid." },
            { text: "Cukup cek ukuran file tiap pagi", why: "Ukuran file normal tidak mendeteksi corrupt isi." },
          ],
        },
        {
          q: "RTO 30 menit, database 2 TB, restore dari backup butuh 3 jam. Solusi?",
          options: [
            { text: "Backup lebih sering", why: "Frekuensi backup memperbaiki RPO, bukan kecepatan restore (RTO)." },
            { text: "Kompres backup lebih agresif", why: "Kompresi membantu sedikit, tidak memangkas 3 jam menjadi 30 menit." },
            { text: "Tambah standby replica untuk failover cepat; backup tetap untuk bencana total", why: "RTO ketat di skala besar butuh failover (menit), bukan restore (jam). Backup tetap wajib untuk skenario replica ikut mati.", correct: true },
            { text: "Naikkan RTO menjadi 4 jam", why: "Mengubah target agar cocok dengan kemampuan adalah menyerah — kecuali bisnis memang setuju." },
          ],
        },
        {
          q: "Analis menghapus 2 juta baris tanpa WHERE. Database sehat. Pemulihan terbaik dengan full + WAL?",
          options: [
            { text: "Restore full terakhir saja", why: "Kehilangan semua transaksi sejak backup — boros." },
            { text: "PITR: restore full + replay WAL hingga sedetik sebelum DELETE", why: "WAL mencatat urutan perubahan; replay berhenti tepat sebelum bencana = kehilangan ~nol.", correct: true },
            { text: "Flashback seluruh server", why: "Bukan fitur standar; PITR adalah caranya." },
            { text: "Minta analis mengingat datanya", why: "2,1 juta baris tidak bisa direkonstruksi dari ingatan." },
          ],
        },
        {
          q: "Mana pasangan yang BENAR?",
          options: [
            { text: "RPO = berapa lama boleh down; RTO = berapa data boleh hilang", why: "Terbalik total." },
            { text: "RPO = berapa data (waktu) boleh hilang; RTO = berapa lama boleh down", why: "RPO tentang titik data, RTO tentang durasi pulih — definisi yang mengatur semua keputusan backup.", correct: true },
            { text: "RPO dibeli dengan restore cepat; RTO dibeli dengan backup sering", why: "Terbalik: frekuensi→RPO, kecepatan restore→RTO." },
            { text: "Keduanya sama saja", why: "Berbeda dimensi: satu soal data, satu soal waktu." },
          ],
        },
        {
          q: "Backup full tiap malam berhasil 100% selama setahun, belum pernah diuji restore. Statusnya?",
          options: [
            { text: "Aman — 100% berhasil", why: "100% 'berhasil' tanpa satu pun uji restore = 100% harapan. Backup yang corrupt tetap 'berhasil' disalin. Satu-satunya bukti = restore yang pernah dilakukan." },
            { text: "Belum terbukti — wajib uji restore berkala", why: "Tepat: backup = klaim, restore = bukti. BSI eksplisit mensyaratkan testing restore berkala. Jadwalkan restore test seperti menjadwalkan backup-nya.", correct: true },
            { text: "Ganti ke incremental saja", why: "Incremental tidak menyelesaikan masalah verifikasi — ia menambah rantai dependensi (full + N incremental) yang justru lebih rapuh." },
            { text: "Simpan 2 copy agar aman", why: "2 copy dari backup yang corrupt = 2x keyakinan palsu. Redundansi tanpa verifikasi = redundansi harapan." },
          ],
        },
      ],
    },
  ],
};
