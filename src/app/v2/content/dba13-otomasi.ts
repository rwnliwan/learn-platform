import type { V2Lesson } from "../lib/types";

const DBAAUTO_SVG = `<svg viewBox="0 0 520 154" role="img" aria-label="MTTD manual 45 menit vs otomatis 2 menit; cek 5 menit vs 5 detik.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">MTTD manual</text><rect x="150" y="20" width="350.0" height="18" fill="var(--error)"/><text x="506" y="35">45 mnt</text>
<text x="140" y="75" text-anchor="end">MTTD otomatis</text><rect x="150" y="60" width="15.6" height="18" fill="var(--c1)"/><text x="172" y="75">2 mnt</text>
</g>
<text x="150" y="148" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="500" y="148" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">menit deteksi</text>
</svg>`;
export const dba13: V2Lesson = {
  slug: "dba13-otomasi",
  track: "Database Administrator",
  module: "Operasi & Keandalan",
  title: "DBA13 — Otomasi & Scripting untuk DBA",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pukul 03.00 yang seharusnya tidak terjadi",
      prose: [
        "Minggu, 03.00. Ponsel Budi (DBA) berdering: disk database penuh, aplikasi down. Ia bangun, VPN, hapus WAL lama manual, restart — selesai 04.15. Senin pagi ia menemukan: pertumbuhan WAL sudah terlihat JELAS di grafik 3 hari terakhir. Tidak ada yang melihat — karena tidak ada yang disuruh melihat.",
        "Yang lebih pahit: ini KETIGA KALINYA bulan ini. Tiga kali begadang untuk masalah yang polanya sama: disk 85% → 90% → 95% → penuh. Setiap kali 'ditangani', tidak pernah 'dicegah'.",
        "Twist-nya: solusinya 20 baris skrip + cron 5 menit — total 1 jam kerja. Tiga insiden × 1,25 jam begadang = 3,75 jam + reputasi. Budi bukan kekurangan skill; ia kekurangan KEBIASAAN mengotomasi. Otomasi bukan soal malas — soal konsistensi: manusia lelah, skrip tidak.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan kenapa otomasi = konsistensi (bukan kemalasan); (2) menulis health-check sebagai kode dengan exit code; (3) memilih Bash vs Python untuk tugas DBA; (4) mengotomasi housekeeping backup; (5) merancang skrip yang aman (dry-run, idempoten, log).",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Menjelaskan 4 tugas DBA yang WAJIB diotomasi (health check, housekeeping, rotasi backup, laporan harian);",
        "(2) Menulis health checker dengan threshold + exit code untuk integrasi monitoring;",
        "(3) Memilih Bash vs Python berdasar kompleksitas tugas;",
        "(4) Menerapkan kebijakan retensi backup sebagai kode (bukan ingatan);",
        "(5) Merancang skrip aman: dry-run, idempoten, log, dan alert saat gagal.",
      ],
      tasks: [],
    },
    {
      id: "konsistensi",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Otomasi = konsistensi, bukan kemalasan",
      prose: [
        "Manusia menjalankan checklist 50 langkah dengan benar ~95% kali — saat segar. Jam 3 pagi? 70%. Skrip menjalankannya 100% — jam berapa pun. Empat tugas yang wajib diotomasi: (1) HEALTH CHECK tiap 5 menit (koneksi, lag, disk, umur backup); (2) HOUSEKEEPING harian (hapus WAL/backup kedaluwarsa); (3) LAPORAN harian (pertumbuhan, slow query); (4) VERIFIKASI backup mingguan (restore test otomatis).",
        "Contoh langkah-demi-langkah (dari lab 1): 5 cek vs ambang → status OK/KRITIS per cek → kritis = [disk_pct, backup_umur_jam] → exit_code 2. Exit code = bahasa universal: 0 = sehat (cron diam), 2 = kritis (monitoring berteriak). Skrip yang hanya print tanpa exit code = tidak bisa diorkestrasi.",
        "Anatomi skrip DBA yang baik: (a) DRY-RUN mode (tampilkan yang AKAN dilakukan tanpa eksekusi); (b) IDEMPOTEN (jalan 2x = aman — pelajaran DE17); (c) LOG terstruktur (timestamp, aksi, hasil); (d) ALERT saat gagal (skrip yang gagal diam-diam = tidak ada skrip).",
        "💡 Intuisi kunci: otomasi tugas yang MEMBOSANKAN dulu, bukan yang sulit. Health check membosankan = diotomasi minggu ini. Tuning query sulit = tetap manual. ROI otomasi = frekuensi × kebosanan × risiko lupa.",
        "Kapan memakai: tugas yang (a) berulang (>1x/minggu), (b) punya aturan jelas, (c) berisiko jika terlewat. Ketiganya terpenuhi = otomasi WAJIB. Hanya 2 dari 3? Pertimbangkan.",
      ],
      formula: String.raw`\text{ROI} = \frac{f \times (t_m - t_o) \times r}{t_b}`,
      formulaNote:
        "ROI otomasi = frekuensi (f) × penghematan waktu per jalan (t_manual − t_otomatis) × risiko terlewat (r) dibagi waktu membangun (t_b). Health check: f=harian, r=tinggi (downtime!) → ROI raksasa. Tugas sekali setahun: f kecil → mungkin tidak worth it.",
      note: {
        title: "🚨 Miskonsepsi: scripting = menulis kode panjang yang canggih",
        body: "Skrip DBA yang paling berharga biasanya 20-50 baris MEMBOSANKAN: cek ambang, hapus file lama, kirim laporan. 'Canggih' (framework, OOP, microservice) untuk tugas housekeeping = over-engineering yang tidak ada yang berani ubah. Aturannya: skrip harus bisa dibaca DBA lain dalam 5 menit — atau ia akan diganti, bukan dipakai.",
      },
      tasks: [],
    },
    {
      id: "bash-python",
      eyebrow: "Langkah 4 · Bash vs Python",
      title: "Pilih senjata sesuai medan",
      prose: [
        "BASH untuk: merangkai perintah (pipe psql → grep → awk), cron satu baris, tugas < 20 baris. Contoh: hapus WAL lebih dari 7 hari: find /wal -mtime +7 -delete. Satu baris, jelas, selesai.",
        "PYTHON untuk: logika bercabang (threshold per cek), parsing terstruktur (JSON/CSV), perhitungan (retensi, tren), apa pun > 20 baris atau butuh diuji. Contoh lab 1-2: threshold 5 cek + kebijakan retensi = Python (Bash akan menjadi spageti).",
        "Aturan 20 baris: < 20 = Bash (ringkas). > 20 = Python (terbaca, bisa unit test). Di antaranya? Pilih yang TIM-mu bisa baca. Skrip yang hanya kamu yang paham = single point of failure manusia.",
        "Contoh Bash yang benar (housekeeping WAL): #!/bin/bash\\nset -euo pipefail\\nfind /var/lib/postgresql/wal -name '*.backup' -mtime +7 -delete\\n. set -euo pipefail = 'gagal cepat jika ada yang salah' — tanpa ini, Bash gagal DIAM-DIAM (skrip lanjut meski perintah gagal!).",
        "💡 Intuisi kunci: set -euo pipefail adalah helm pengaman Bash. Skrip Bash tanpa itu = mengendarai tanpa helm: terlihat baik-baik saja sampai kecelakaan. Untuk Python: selalu ada try/except di boundary (koneksi DB) + exit code eksplisit.",
        "Kapan memakai: butuh cepat + sederhana → Bash. Butuh logika + test + maintain → Python. Ragu? Python — keterbacaan mengalahkan keringkasan untuk skrip yang hidup > 1 bulan.",
      ],
      note: {
        title: "🚨 Miskonsepsi: 'nanti saja diotomasi, sekarang manual dulu'",
        body: "'Manual dulu' = tidak pernah. Tugas manual yang 'sementara' menjadi permanen dalam 2 minggu — dan insiden pertamanya datang sebelum otomasi sempat ditulis (cerita Budi: 3x). Aturannya: jika tugas kedua kalinya manual, otomasi dimulai HARI ITU. Yang pertama = eksplorasi; yang kedua = pola.",
      },
      tasks: [],
    },
    {
      id: "mttd",
      eyebrow: "Langkah 5 · Visual",
      title: "Dari 45 menit menjadi 2 menit",
      prose: [
        "Cara membaca: dua batang — 'MTTD manual' 45 menit (manusia sadar setelah user komplain), 'MTTD otomatis' 2 menit (skrip cek tiap 5 menit + alert). Batang manual disorot merah.",
        "Interpretasi: 22x lebih cepat deteksi = 22x lebih kecil dampak. Disk penuh yang ketahuan di 87% (alert) vs 100% (down) = beda 'tambah disk siang hari' vs 'begadang 03.00'. Otomasi tidak mencegah masalah — ia mencegah masalah menjadi INSIDEN.",
        "💡 Intuisi kunci: MTTD (waktu deteksi) adalah metrik otomasi yang paling jujur. Turunkan MTTD → MTTR ikut turun (pelajaran DBA12). Skrip 20 baris = MTTD 45 → 2 menit.",
      ],
      figure: {
        svg: DBAAUTO_SVG,
        alt: "MTTD manual 45 menit vs otomatis 2 menit.",
        caption:
          "Health check otomatis tiap 5 menit: deteksi 22x lebih cepat.",
      },
      tasks: [],
    },
    {
      id: "lab-health",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: health checker + exit code",
      prose: [
        "Lima hasil cek vs ambang. Arah 'max' = nilai harus <= ambang; 'min' = nilai harus >= ambang.",
        "Tugasmu: tentukan status tiap cek, daftarkan yang kritis, dan tentukan exit code (0 = sehat, 2 = kritis).",
        "Hasil: kritis = disk 87% (> 85) + backup 30 jam (> 26). Koneksi 185 (< 190) masih OK — tetapi DEKAT ambang: inilah yang dilaporkan sebagai WARNING di skrip nyata.",
        "Coba juga: ubah disk_pct menjadi 84. exit_code? 0 atau 2? (Jawaban: masih 2 — backup tetap kritis. Exit code mencerminkan KESELURUHAN.)",
      ],
      tasks: [
        { id: "t1", text: "Isi `status`: OK/KRITIS per cek berdasar ambang + arah" },
        { id: "t2", text: "Isi `kritis` (urutkan) dan `exit_code` (0 sehat, 2 kritis)" },
      ],
      expected: "kritis=['backup_umur_jam', 'disk_pct']  exit_code=2",
      note: {
        title: "Sering salah",
        body: "Membalik arah 'min': cache_hit 99.2 dengan ambang 95 = OK (lebih TINGGI lebih baik). 'min' = nilai minimum yang diterima. Salah arah = alert terbalik.",
      },
      hints: [
        "ok = (nilai <= ambang) jika 'max' else (nilai >= ambang).",
        "kritis = [nama for nama, s in status.items() if s == 'KRITIS'], urutkan.",
        "exit_code = 0 jika tidak ada kritis, else 2.",
      ],
      code: {
        starter: `# Hasil cek kesehatan (tiruan output skrip): (cek, nilai, ambang, arah)\n# arah: "max" (nilai harus <= ambang) atau "min" (nilai harus >= ambang)\nCEK = [\n    ("koneksi", 185, 190, "max"),\n    ("repl_lag_detik", 45, 60, "max"),\n    ("disk_pct", 87, 85, "max"),\n    ("backup_umur_jam", 30, 26, "max"),\n    ("cache_hit_pct", 99.2, 95, "min"),\n]\n# TULIS KODEMU: status, kritis, exit_code\nstatus = {}\nkritis = []\nexit_code = 0\n\nprint(f"status={status}")\nprint(f"kritis={kritis}  exit_code={exit_code}")\n`,
        lockLines: 9,
        solution: `# Hasil cek kesehatan (tiruan output skrip): (cek, nilai, ambang, arah)\n# arah: "max" (nilai harus <= ambang) atau "min" (nilai harus >= ambang)\nCEK = [\n    ("koneksi", 185, 190, "max"),\n    ("repl_lag_detik", 45, 60, "max"),\n    ("disk_pct", 87, 85, "max"),\n    ("backup_umur_jam", 30, 26, "max"),\n    ("cache_hit_pct", 99.2, 95, "min"),\n]\n\n# TULIS KODEMU: status, kritis, exit_code\nstatus = {}\nfor nama, nilai, ambang, arah in CEK:\n    ok = (nilai <= ambang) if arah == "max" else (nilai >= ambang)\n    status[nama] = "OK" if ok else "KRITIS"\nkritis = sorted(k for k, v in status.items() if v == "KRITIS")\nexit_code = 0 if not kritis else 2\n\nprint(f"status={status}")\nprint(f"kritis={kritis}  exit_code={exit_code}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "kritis", value: ["backup_umur_jam", "disk_pct"], label: "`kritis` benar", msg: "disk 87>85, backup 30>26." },
          { kind: "equal", task: "t2", name: "exit_code", value: 2, label: "`exit_code` = 2", msg: "Ada kritis → monitoring berteriak." },
          { kind: "stdout_matches", task: "t1", pattern: "'cache_hit_pct': 'OK'", label: "cache OK", msg: "99.2 >= 95 (arah min)." },
        ],
      },
      reference: "Health check sebagai kode: threshold + exit code = bisa diorkestrasi.",
    },
    {
      id: "lab-retensi",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: kebijakan retensi sebagai kode",
      prose: [
        "Tujuh file backup. Kebijakan: full disimpan 14 hari, incremental 7 hari.",
        "Tugasmu: tentukan yang kedaluwarsa, hitung GB yang kembali, dan VERIFIKASI keamanan (tidak menghapus full terakhir dalam retensi).",
        "Hasil: hapus 2 file (852 GB kembali), 2 full tersisa = aman. Tanpa verifikasi 'aman', skrip retensi yang bug = menghapus SEMUA backup (pernah terjadi di dunia nyata!).",
        "Coba juga: apa yang terjadi jika RET_FULL = 3? (full_2026-10-01 dan 10-08 ikut terhapus — aman=False. Skrip harus MENOLAK, bukan melanjutkan.)",
      ],
      tasks: [
        { id: "t1", text: "Terapkan retensi: full > 14 hari, incr > 7 hari → `hapus`" },
        { id: "t2", text: "Hitung `hemat_gb` dan pastikan `aman` (≥1 full tersisa)" },
      ],
      expected: "hapus=['full_2026-09-20', 'incr_2026-10-05']  hemat_gb=852",
      note: {
        title: "Sering salah",
        body: "Menghapus berdasar umur SAJA tanpa cek 'full terakhir tersisa'. Retensi = umur + 'jangan bunuh cadangan terakhir'. Selalu ada guard.",
      },
      hints: [
        "startswith('full') + umur > 14 → hapus; incr + umur > 7 → hapus.",
        "hemat_gb = sum ukuran yang dihapus.",
        "aman = ≥1 full tersisa; jika tidak → TOLAK eksekusi.",
      ],
      code: {
        starter: `# File backup: (nama, umur_hari, ukuran_gb)\nBACKUP = [\n    ("full_2026-09-20", 23, 790), ("full_2026-10-01", 12, 800),\n    ("full_2026-10-08", 5, 810), ("incr_2026-10-05", 8, 62),\n    ("incr_2026-10-11", 2, 60), ("incr_2026-10-12", 1, 55),\n    ("incr_2026-10-13", 0, 58),\n]\n# Kebijakan retensi: full 14 hari, incremental 7 hari\nRET_FULL, RET_INCR = 14, 7\n# TULIS KODEMU: hapus, hemat_gb, aman\nhapus = []\nhemat_gb = 0\naman = False\n\nprint(f"hapus={hapus}  hemat_gb={hemat_gb}  aman={aman}")\n`,
        lockLines: 9,
        solution: `# File backup: (nama, umur_hari, ukuran_gb)\nBACKUP = [\n    ("full_2026-09-20", 23, 790), ("full_2026-10-01", 12, 800),\n    ("full_2026-10-08", 5, 810), ("incr_2026-10-05", 8, 62),\n    ("incr_2026-10-11", 2, 60), ("incr_2026-10-12", 1, 55),\n    ("incr_2026-10-13", 0, 58),\n]\n# Kebijakan retensi: full 14 hari, incremental 7 hari\nRET_FULL, RET_INCR = 14, 7\n\n# TULIS KODEMU: hapus, hemat_gb, aman\nhapus = []\nfor nama, umur, gb in BACKUP:\n    if nama.startswith("full") and umur > RET_FULL:\n        hapus.append(nama)\n    elif nama.startswith("incr") and umur > RET_INCR:\n        hapus.append(nama)\nhemat_gb = sum(gb for nama, umur, gb in BACKUP if nama in hapus)\n# Aman: tidak menghapus full terakhir yang masih dalam retensi\nfull_tersisa = [n for n, u, g in BACKUP if n.startswith("full") and n not in hapus]\naman = len(full_tersisa) >= 1\n\nprint(f"hapus={hapus}  hemat_gb={hemat_gb}  aman={aman}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "hapus", value: ["full_2026-09-20", "incr_2026-10-05"], label: "`hapus` benar", msg: "23 hari > 14, 8 hari > 7." },
          { kind: "equal", task: "t2", name: "hemat_gb", value: 852, label: "`hemat_gb` = 852", msg: "790 + 62 GB kembali." },
          { kind: "equal", task: "t2", name: "aman", value: true, label: "`aman` = True", msg: "2 full dalam retensi tersisa." },
        ],
      },
      reference: "Retensi sebagai kode + guard: jangan hapus cadangan terakhir.",
    },
    {
      id: "aman",
      eyebrow: "Langkah 8 · Skrip aman",
      title: "Tiga perisai skrip DBA",
      prose: [
        "PERISAI 1 — DRY-RUN: setiap skrip destruktif (hapus, drop, kill) punya mode --dry-run yang menampilkan 'yang AKAN dilakukan' tanpa eksekusi. Budi yang baru bangun jam 3 pagi = manusia yang paling butuh dry-run.",
        "PERISAI 2 — IDEMPOTEN: jalan 2x = aman (DE17). Skrip housekeeping yang di-cron 2x tidak sengaja = tidak boleh menghancurkan. Overwrite/upsert, bukan append.",
        "PERISAI 3 — GAGAL BERISIK: skrip yang gagal HARUS berteriak (exit code != 0 + alert), bukan diam. Cron yang gagal diam-diam selama 3 bulan = backup yang 'ada' tetapi tidak jalan (ditemukan saat butuh restore — pelajaran DBA5).",
        "Contoh pola: dry_run = '--dry-run' in sys.argv → jika dry_run: print(aksi) else: eksekusi. Log: tiap aksi + timestamp ke file. Alert: exit(2) + kirim ke monitoring.",
        "💡 Intuisi kunci: skrip tanpa dry-run = senjata tanpa pengaman. Skrip tanpa alert saat gagal = penjaga yang tidur. Tiga perisai ini membedakan 'skrip' dari 'otomasi'.",
      ],
      tasks: [],
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 9 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Otomasi yang membosankan dulu. Health check, housekeeping, laporan — 20-50 baris yang membosankan > 500 baris yang canggih. ROI = frekuensi × kebosanan × risiko lupa.",
        "💡 Exit code adalah bahasa skrip. 0 = sehat, 2 = kritis. Skrip tanpa exit code = tidak bisa diorkestrasi cron/monitoring = mainan.",
        "💡 Tugas kedua yang manual = otomasi dimulai hari itu. Yang pertama = eksplorasi; yang kedua = pola. 'Nanti saja' = tidak pernah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: cron yang diam adalah cron yang mencurigakan",
        body: "Cron yang paling berbahaya bukanlah yang gagal dengan error — melainkan yang gagal DIAM-DIAM selama 40 hari. Kamu baru tahu saat bencana: \"backup terakhir kapan?\" … \"40 hari lalu, cron-nya error sejak…\" Heuristik praktisinya: setiap job otomatis wajib punya DUA sinyal — sinyal gagal (alert saat error) DAN sinyal sehat yang hilang (alert saat \"saya sukses\" tidak tiba sesuai jadwal). Yang kedua disebut dead man's switch, dan ia menangkap seluruh kelas kegagalan yang tidak ditangkap yang pertama: server cron mati, skrip terhapus, jadwal ter-disable, disk penuh sehingga log tidak tertulis. Aturan konkretnya: tidak ada cron tanpa kedua alert ini — tanpa pengecualian, termasuk \"cron kecil yang cuma…\". Terutama cron kecil itu. Jebakan kedua: skrip yang sukses tetapi hasilnya salah — backup \"sukses\" 0 byte, health check \"OK\" karena mengecek server yang salah. Maka sinyal sehat harus membawa BUKTI: ukuran file backup, jumlah baris, checksum — bukan sekadar exit code 0. Aturan ketiganya: satu tempat untuk semua sinyal. 30 cron yang lapor ke 30 tempat = tidak ada yang dipantau. Satu dashboard, satu channel alert, satu orang yang bertanggung jawab membacanya tiap pagi. Otomasi tanpa observability bukan otomasi — itu penyerahan nasib ke /dev/null. Dan ingat: tugas yang diotomasi dua kali setahun tetap butuh dead man's switch — justru karena jarang, kamu tidak akan sadar saat ia mati.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: otomasi atau manual?",
      prose: [
        "Skenario 1 — Health check (koneksi, lag, disk) tiap 5 menit. → OTOMASI (Python + cron). Alasan: frekuensi tinggi + risiko lupa = down.",
        "Skenario 2 — Hapus WAL/backup kedaluwarsa harian. → OTOMASI (Bash + dry-run + guard). Alasan: aturan jelas + destruktif jika salah = butuh kode + perisai.",
        "Skenario 3 — Tuning query lambat yang unik. → MANUAL. Alasan: tiap kasus berbeda (aturan tidak jelas) = otomasi salah sasaran.",
        "Skenario 4 — Laporan pertumbuhan harian ke tim. → OTOMASI (Python). Alasan: format tetap + frekuensi harian = robot penulis laporan.",
        "Skenario 5 — Failover darurat jam 3 pagi. → RUNBOOK + latihan (semi-otomasi). Alasan: jarang + kritis = manusia memutuskan, skrip mengeksekusi langkahnya.",
        "Aturan praktis 10 detik: (a) berulang >1x/minggu? (b) aturan jelas? (c) berisiko jika terlewat? Tiga-tiganya ya → otomasi WAJIB minggu ini.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: tiga kali begadang untuk pola yang sama",
      prose: [
        "Budi, DBA di PT DataNusa. Tiga insiden disk penuh dalam sebulan — semua jam 2-4 pagi, semua pola sama (WAL menumpuk, disk 85% → 100%). Tiap insiden: 1,25 jam begadang + aplikasi down 30-60 menit + pagi harinya produktivitas hancur.",
        "Total: 3,75 jam begadang + 3x downtime + reputasi 'DBA yang selalu kebakaran'. Solusi: skrip health check 20 baris (lab 1) + cron 5 menit + skrip housekeeping WAL (find -mtime +7 -delete, dengan dry-run). Waktu membangun: 1 jam.",
        "Setelah otomasi: disk 87% → alert siang hari → tambah disk / hapus WAL terjadwal → insiden keempat TIDAK PERNAH TERJADI. MTTD 45 menit → 2 menit. Budi tidur.",
        "Angka konkretnya: 1 jam membangun vs 3,75 jam begadang/bulan + downtime. ROI bulan pertama = 275%. Dan ini baru SATU skrip — ada 4 tugas wajib (health, housekeeping, laporan, verifikasi backup).",
        "Pembahasan: Budi tidak kurang skill — ia kurang kebiasaan. Aturan 'tugas kedua yang manual = otomasi hari itu' mencegah insiden ke-2 dan ke-3. Kebiasaan > kepahlawanan.",
        "💡 Intuisi kunci: DBA yang hebat bukan yang tercepat memadamkan api — melainkan yang membuat api tidak pernah menyala. Otomasi = pemadam yang bekerja sebelum ada asap.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "Otomasi = konsistensi: manusia 70% (jam 3 pagi), skrip 100% — selalu.",
        "Bash < 20 baris (rangkai perintah); Python > 20 baris (logika + test). set -euo pipefail untuk Bash.",
        "Exit code = bahasa skrip (0 sehat, 2 kritis); tanpa itu tidak bisa diorkestrasi.",
        "Tiga perisai: dry-run + idempoten + gagal berisik.",
        "Aturan: tugas kedua yang manual = otomasi dimulai hari itu.",
      ],
      next: { label: "DBA14 — Partitioning", href: "/v2/learn/dba14-partitioning" },
      quiz: [
        {
          q: "Kenapa exit code penting dalam skrip DBA?",
          options: [
            { text: "Supaya terlihat profesional", why: "Bukan soal penampilan — soal integrasi." },
            { text: "Agar cron/monitoring bisa bereaksi: 0 = sehat, 2 = kritis", why: "Tepat: exit code = BAHASA skrip ke orkestrator. Tanpa itu, cron tidak tahu skrip gagal; monitoring tidak tahu kapan berteriak. Skrip tanpa exit code = mainan.", correct: true },
            { text: "Mempercepat eksekusi", why: "Exit code tidak memengaruhi kecepatan." },
            { text: "Requirement Python", why: "Bukan requirement bahasa — ini kontrak operasional." },
          ],
        },
        {
          q: "Tugas: hapus WAL > 7 hari. Pilihan terbaik?",
          options: [
            { text: "Python 200 baris dengan framework", why: "Over-engineering untuk find -delete. 200 baris = 200 peluang bug + tidak ada yang berani ubah." },
            { text: "Bash satu baris + set -euo pipefail + dry-run", why: "Tepat: find /wal -mtime +7 -delete. Aturan 20 baris → Bash. set -euo pipefail = gagal cepat (tanpa ini Bash gagal diam-diam). Dry-run = pengaman.", correct: true },
            { text: "Manual tiap hari", why: "Manual harian = Budi jilid 2: lupa sekali = disk penuh jam 3 pagi." },
            { text: "Hapus semua WAL tiap minggu", why: "Menghapus SEMUA = menghancurkan kemampuan recovery. Retensi = umur + guard, bukan sapu bersih." },
          ],
        },
        {
          q: "Skrip retensi backup harus punya guard apa?",
          options: [
            { text: "Tidak perlu guard — retensi sudah jelas", why: "'Sudah jelas' = keyakinan yang menghancurkan backup. Bug retensi nyata pernah menghapus SEMUA backup." },
            { text: "Jangan hapus full terakhir dalam retensi; tolak eksekusi jika aman=False", why: "Tepat (lab 2): aman = ≥1 full tersisa. Jika guard gagal = skrip MENOLAK, bukan melanjutkan. Destruktif + otomatis = wajib perisai.", correct: true },
            { text: "Hapus yang terbesar dulu", why: "Ukuran bukan kriteria retensi. Kebijakan = umur + guard." },
            { text: "Jalankan sebagai root", why: "Root = lebih berbahaya, bukan lebih aman. Prinsip least privilege." },
          ],
        },
        {
          q: "Kapan tugas DBA harus diotomasi?",
          options: [
            { text: "Saat ada waktu luang", why: "'Waktu luang' tidak pernah datang. Tugas kedua yang manual = otomasi hari itu." },
            { text: "Berulang + aturan jelas + berisiko jika terlewat", why: "Tepat: tiga syarat. Health check = ketiganya (otomasi WAJIB). Tuning unik = aturan tidak jelas (manual). Failover = jarang + kritis (runbook).", correct: true },
            { text: "Semua tugas tanpa kecuali", why: "Tuning unik yang diotomasi = otomasi salah sasaran. Tidak semua bisa/boleh." },
            { text: "Tidak pernah — manual lebih aman", why: "Manual jam 3 pagi dengan akurasi 70% vs skrip 100%. 'Aman' semu." },
          ],
        },
        {
          q: "Apa itu 'gagal berisik' dan kenapa penting?",
          options: [
            { text: "Skrip yang banyak print", why: "Bukan banyak print — ini soal SINYAL kegagalan." },
            { text: "Skrip yang gagal harus berteriak (exit != 0 + alert), bukan diam", why: "Tepat: cron yang gagal diam-diam 3 bulan = backup 'ada' yang tidak jalan — ditemukan saat butuh restore (DBA5). Kegagalan diam = kegagalan ganda.", correct: true },
            { text: "Skrip yang lambat", why: "Bukan soal kecepatan." },
            { text: "Skrip yang butuh sudo", why: "Bukan soal privilege." },
          ],
        },
      ],
    },
  ],
};
