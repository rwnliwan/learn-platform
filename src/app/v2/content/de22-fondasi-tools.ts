import type { V2Lesson } from "../lib/types";

// Alur pipe Unix untuk investigasi log: grep -> sort -> uniq -c -> sort -rn -> head.
const PIPE_SVG = `<svg viewBox="0 0 560 170" role="img" aria-label="Diagram alur pipe Unix: grep, sort, uniq -c, sort -rn, head.">
<g font-family="var(--font-ui)" font-size="12">
<rect x="14" y="60" width="86" height="50" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="57" y="80" text-anchor="middle" fill="var(--text)">app.log</text>
<text x="57" y="98" text-anchor="middle" fill="var(--text)" font-size="10">10.000 baris</text>
<rect x="120" y="60" width="86" height="50" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="163" y="80" text-anchor="middle" fill="var(--text)">grep ERROR</text>
<text x="163" y="98" text-anchor="middle" fill="var(--text)" font-size="10">6 baris</text>
<rect x="226" y="60" width="86" height="50" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="269" y="80" text-anchor="middle" fill="var(--text)">sort</text>
<text x="269" y="98" text-anchor="middle" fill="var(--text)" font-size="10">kelompokkan</text>
<rect x="332" y="60" width="86" height="50" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="375" y="80" text-anchor="middle" fill="var(--text)">uniq -c</text>
<text x="375" y="98" text-anchor="middle" fill="var(--text)" font-size="10">hitung</text>
<rect x="438" y="60" width="108" height="50" rx="8" fill="var(--c5)" opacity="0.25" stroke="var(--c5)" stroke-width="2"/>
<text x="492" y="80" text-anchor="middle" fill="var(--text)">sort -rn</text>
<text x="492" y="98" text-anchor="middle" fill="var(--text)" font-size="10">terbanyak dulu</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="2" marker-end="url(#arrowD)">
<defs><marker id="arrowD" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--chart-grid)"/></marker></defs>
<line x1="100" y1="85" x2="118" y2="85"/><line x1="206" y1="85" x2="224" y2="85"/><line x1="312" y1="85" x2="330" y2="85"/><line x1="418" y1="85" x2="436" y2="85"/>
</g>
<text x="280" y="140" text-anchor="middle" fill="var(--text)" font-size="12" font-family="var(--font-ui)">tiap alat melakukan satu hal kecil — pipe merangkainya menjadi investigasi</text>
<text x="280" y="158" text-anchor="middle" fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">grep ERROR app.log | sort | uniq -c | sort -rn | head -5</text>
</svg>`;

export const de22: V2Lesson = {
  slug: "de22-fondasi-tools",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE22 — Linux, Shell, Git & Docker: Fondasi yang Tak Terlihat",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "Pipeline data tidak hidup di dalam notebook. Ia hidup di server Linux, dijadwalkan cron, diambil dari repo Git, berbicara ke database lewat jaringan, dan dikemas dalam container Docker. Empat fondasi ini jarang diajarkan di kursus data — padahal insiden pipeline paling mahal hampir selalu berakar di sini, bukan di logika transformasi.",
        "Setelah lesson ini, kamu bisa mengoperasikan fondasi itu dengan percaya diri.",
        "(1) Membaca filesystem, permission, dan proses Linux untuk mendiagnosis kegagalan pipeline yang 'sepele' — disk penuh, permission denied, proses zombie.",
        "(2) Memakai pipe shell (grep, sort, uniq, wc) untuk investigasi log dalam hitungan detik, dan membaca exit code sebagai bahasa kegagalan script.",
        "(3) Menerapkan disiplin Git untuk tim data: apa yang di-commit, apa yang diabaikan, dan kenapa secret tidak boleh masuk repo.",
        "(4) Mendiagnosis masalah koneksi dengan checklist berlapis (DNS → port → firewall → auth) alih-alih menebak.",
        "(5) Menjelaskan image vs container Docker, cara kerja layer cache, dan menulis Dockerfile yang build-nya cepat karena urutannya benar.",
        "Isi lesson: cerita insiden nyata → 5 blok konsep (masing-masing dengan jebakannya) → lab pipe Unix + cache Docker → peta keputusan → mini-case → quiz.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Malam ketika pipeline mati tiga kali — tanpa satu pun bug kode",
      prose: [
        "Jumat, 02:00. Job ETL harian Bank Nusa Dana gagal. PagerDuty membangunkan tiga analis. Log-nya singkat dan kejam: `No space left on device`. Partisi /var/log 100% penuh — 14 bulan tidak pernah dirotasi. Job tidak bisa menulis file checkpoint, lalu mati. Tim menghapus log lama, job jalan lagi. Total begadang: 2,5 jam.",
        "Jumat, 03:40. Deploy perbaikan gagal. Pesan error-nya: `Permissions 0644 for 'deploy_key' are too open`. Kunci SSH hasil copy-paste punya permission 644; SSH menolak kunci yang bisa dibaca orang lain. Perbaikannya satu perintah — `chmod 600` — tapi butuh 40 menit untuk menemukannya, karena tidak ada yang menyangka masalahnya 'sekadar permission'.",
        "Jumat, 05:10. Data mart terisi, tapi angka transaksi Rp1,2 miliar tercatat ganda. Akarnya: server cron berjalan dengan zona waktu UTC, sedangkan kunci dedup memakai tanggal lokal (WIB, UTC+7). Jendela 7 jam itu membuat dua batch tumpang tindih — job yang sama memproses jam yang sama dua kali.",
        "Twist-nya: kode Python-nya benar 100%. Tidak ada bug logika, tidak ada query salah. Tiga kegagalan itu — disk penuh, permission, zona waktu — semuanya fondasi: Linux, shell, dan environment. Tagihan malam itu: 6 jam downtime, 3 analis begadang, Rp18 juta biaya lembur, dan laporan direksi yang telat sehari.",
        "Lesson ini memastikan kamu tidak membayar tagihan yang sama.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: insiden pipeline selalu soal kode",
        type: "pitfall",
        body: "Mayoritas insiden pipeline yang mahal berakar di fondasi: disk, permission, jaringan, zona waktu, secret kedaluwarsa. Kode transformasi justru yang paling jarang jadi biang kerok — karena kode diuji, sedangkan fondasi dianggap 'sudah beres'. Data engineer senior menghabiskan 80% waktu debugging di lapisan ini.",
      },
      reference: "Kode benar tidak cukup — environment harus benar juga.",
    },
    {
      id: "linux",
      eyebrow: "Langkah 3 · Linux",
      title: "Filesystem, permission, dan proses: tiga pembunuh paling sepele",
      prose: [
        "Linux punya satu ide besar: semuanya adalah file. Disk, proses, bahkan koneksi jaringan direpresentasikan sebagai file di `/proc` dan `/dev`. Artinya satu keterampilan — membaca, menulis, dan memeriksa file — membuka hampir semua pintu diagnosis.",
        "Filesystem: pahami tiga direktori yang paling sering membunuh pipeline. `/var/log` (log aplikasi — tumbuh tanpa ampun), `/tmp` (file sementara — dihapus saat reboot di banyak distro), dan direktori data job-mu sendiri. Dua perintah penyelamat: `df -h` (berapa ruang tersisa per partisi) dan `du -sh *` (folder mana yang rakus). Insiden cerita tadi terdeteksi dalam 10 detik dengan `df -h` — bukan dengan membaca 4.000 baris log.",
        "Permission: setiap file punya tiga angka — pemilik (u), grup (g), orang lain (o) — masing-masing baca (r=4), tulis (w=2), eksekusi (x=1). `chmod 600` artinya pemilik baca-tulis, orang lain tidak ada akses — standar untuk kunci SSH dan file secret. `chmod 755` untuk direktori dan script yang boleh dijalankan. Aturan praktisnya: beri hak sekecil mungkin yang masih membuat pekerjaan jalan (prinsip least privilege).",
        "Proses & sinyal: pipeline yang 'menggantung' biasanya proses yang tidak mati-mati. `ps aux | grep etl` menemukan PID-nya; `kill PID` mengirim SIGTERM (minta berhenti sopan — proses boleh bersih-bersih dulu); `kill -9 PID` mengirim SIGKILL (paksa mati seketika — data setengah tulis bisa korup). Urutannya selalu: TERM dulu, KILL hanya bila TERM diabaikan. `journalctl -u nama-service --since \"1 hour ago\"` membaca log service systemd tanpa harus tahu file log-nya di mana.",
        "💡 Intuisi: 90% diagnosis Linux hanya butuh lima perintah: `df -h`, `du -sh`, `ls -l`, `ps aux`, dan `tail -f log`. Kuasai lima ini sebelum menghafal yang lain — sisanya bisa dicari saat dibutuhkan.",
        "💡 Intuisi: 'Permission denied' dan 'No space left on device' adalah dua pesan error paling jujur di Linux. Jangan dilewati — mereka sudah memberi tahu diagnosisnya. Bandingkan dengan error aplikasi yang samar: fondasi justru paling to-the-point.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: chmod 777 menyelesaikan masalah permission",
        type: "pitfall",
        body: "777 memberi SEMUA orang baca-tulis-eksekusi — termasuk penyerang. SSH bahkan MENOLAK private key dengan permission terbuka (seperti insiden cerita: 0644 too open). Lebih parah: 777 menyembunyikan akar masalah (user yang salah, grup yang salah) alih-alih memperbaikinya. Perbaikan yang benar: pahami siapa pemiliknya (ls -l), lalu chown/chmod secukupnya — biasanya 600 untuk secret, 644 untuk file baca, 755 untuk direktori dan script.",
      },
      reference: "df -h, du -sh, ls -l, ps aux, tail -f — lima perintah diagnosis harian.",
    },
    {
      id: "shell",
      eyebrow: "Langkah 4 · Shell",
      title: "Shell & pipe: berpikir seperti operator Unix",
      prose: [
        "Filosofi Unix: tiap alat melakukan satu hal kecil dengan baik, dan pipe (`|`) merangkai output satu alat menjadi input alat berikutnya. Inilah 'bahasa investigasi' data engineer — sebelum menulis script Python 50 baris, sering cukup satu baris shell.",
        "Empat serangkai investigasi log: `grep ERROR app.log` (saring baris), `sort` (kelompokkan baris sama), `uniq -c` (hitung tiap kelompok — hanya bekerja pada baris yang BERURUTAN, makanya sort dulu), `wc -l` (hitung baris). Rangkaiannya: `grep ERROR app.log | sort | uniq -c | sort -rn | head -5` — lima error terbanyak, terurut menurun, dalam satu baris. Investigasi yang di Python butuh 30 baris, di shell butuh 10 detik mengetik.",
        "Redirect mengatur ke mana output pergi: `>` menimpa file, `>>` menambah di akhir. `2>` menangkap error (stderr) yang terpisah dari output normal (stdout). Pola klasik cron: `0 2 * * * /opt/etl/run.sh >> /var/log/etl.log 2>&1` — stdout DAN stderr sama-sama tercatat, jadi kegagalan jam 2 pagi tidak hilang tanpa jejak.",
        "Exit code adalah bahasa kegagalan script: 0 = sukses, bukan-0 = gagal. `echo $?` menampilkan exit code perintah terakhir. Inilah cara cron dan CI tahu job-mu gagal — bukan dari pesan error yang bagus, melainkan dari angka bukan-nol. Kebiasaan wajib di script otomasi: `set -e` di baris pertama — script berhenti di perintah pertama yang gagal, alih-alih melanjutkan dengan data setengah jadi.",
        "Cara membaca diagram di bawah: tiap kotak = satu alat kecil; panah = pipe yang menyalurkan output. Baca kiri ke kanan seperti kalimat: 'dari app.log, ambil baris ERROR, urutkan, hitung tiap pola, tampilkan yang terbanyak dulu'.",
        "Interpretasi: kekuatan pipe bukan di tiap alatnya — `grep` dan `sort` itu membosankan — melainkan di kombinasinya. Sepuluh alat sederhana × pipe = ribuan investigasi berbeda tanpa menulis program baru.",
      ],
      figure: {
        svg: PIPE_SVG,
        alt: "Diagram alur pipe: app.log masuk ke grep ERROR, lalu sort, uniq -c, sort -rn, menghasilkan 5 error terbanyak.",
        caption: "Satu baris shell = lima alat kecil yang dirangkai pipe. Investigasi log 10.000 baris selesai dalam detik.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "`uniq -c` tanpa `sort` dulu menghasilkan hitungan yang salah — uniq hanya menggabungkan baris yang BERSEBELAHAN sama. Baris ERROR yang tersebar di antara baris INFO akan dihitung berulang kali. Urutan yang benar selalu: grep → sort → uniq -c → sort -rn.",
      },
      reference: "grep | sort | uniq -c | sort -rn — urutan sakral investigasi log.",
    },
    {
      id: "git",
      eyebrow: "Langkah 5 · Git",
      title: "Git untuk tim data: commit kode, abaikan data dan rahasia",
      prose: [
        "Git adalah mesin waktu untuk kode. Setiap commit = snapshot yang bisa dikembalikan; setiap branch = jalur eksperimen yang aman; setiap merge = penggabungan yang tercatat. Untuk tim data, Git menjawab pertanyaan paling menakutkan saat insiden: 'apa yang berubah sejak terakhir kali pipeline ini jalan benar?' — jawabannya: `git log` dan `git diff`.",
        "Aturan commit untuk pipeline: commit SEMUA yang bisa merekonstruksi pekerjaan — script Python/SQL, Dockerfile, file konfigurasi, definisi cron/CI, dan dokumentasi. Pesan commit menjelaskan KENAPA, bukan apa: 'naikkan batch ke 5 menit karena SLA gudang berubah' mengalahkan 'update run.sh'. Enam bulan kemudian, yang pertama menyelamatkanmu dari menebak-nebak.",
        "Aturan abaikan: JANGAN commit tiga hal. (1) Data mentah dan hasil besar (CSV 2 GB, file parquet) — repo bukan data warehouse; pakai DVC atau object storage dengan versi. (2) File secret (`.env`, kunci API, kredensial database) — sekali masuk repo, dianggap bocor selamanya. (3) File turunan yang bisa dibangun ulang (folder `__pycache__`, `node_modules`, file `.pyc`). Ketiganya diatur di `.gitignore` — satu file, baris per pola.",
        "Branch untuk eksperimen pipeline: buat branch `coba-fitur-x`, uji di sana, merge ke `main` hanya setelah validasi. `main` harus selalu dalam keadaan bisa di-deploy — ini kontrak tim. Merge vs rebase sekilas: merge menyimpan sejarah apa adanya (aman untuk tim), rebase merapikan sejarah jadi linear (rapi untuk review) — untuk tim data kecil, merge biasa sudah cukup; jangan rebase branch yang sudah di-push dan dipakai orang lain.",
        "💡 Intuisi: `git log --oneline -10` + `git diff HEAD~1` adalah 'rekaman CCTV' pipeline-mu. Saat insiden jam 2 pagi, dua perintah ini menjawab 'apa yang berubah' dalam 30 detik — jauh lebih cepat daripada interogasi tim di grup chat.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: repo privat = aman untuk menyimpan secret",
        type: "pitfall",
        body: "Sekali secret masuk commit, ia tersimpan di history SELAMANYA — menghapus file di commit baru tidak menghapusnya dari history, dan setiap clone/fetch bisa sudah menyalinnya. 'Tapi kan repo privat' — akses berubah: karyawan resign, repo di-fork, backup bocor, atau repo dijadikan publik tanpa sengaja. Praktik yang benar: secret hidup di environment variable atau secret manager (bukan di file yang di-commit), dan `.gitignore` memblokir `.env` sejak hari pertama.",
      },
      reference: "Commit yang bisa direkonstruksi; abaikan data, hasil besar, dan secret.",
    },
    {
      id: "jaringan",
      eyebrow: "Langkah 6 · Jaringan",
      title: "Jaringan dasar: 'tidak bisa connect' bukan tebakan",
      prose: [
        "Hampir semua komponen pipeline berbicara lewat jaringan: aplikasi ke database, worker ke Kafka, Airflow ke API. Saat koneksi gagal, pemula menebak-nebak ('restart aja'); profesional memeriksa berlapis — dari bawah ke atas — karena tiap lapisan punya tesnya sendiri.",
        "Checklist lima lapis, berurutan: (1) DNS — apakah nama host bisa diterjemahkan ke IP? Tes: `nslookup db.internal` atau `ping db.internal`. Gagal di sini = masalah nama, bukan database-nya. (2) Port — apakah port tujuan terbuka dan ada yang mendengarkan? Tes: `nc -zv db.internal 5432` atau `telnet db.internal 5432`. Timeout di sini = firewall memblokir atau service tidak jalan. (3) Firewall/security group — aturan cloud (AWS security group, dsb.) sering hanya mengizinkan IP tertentu; pindah server = IP berubah = koneksi mati mendadak. (4) TLS/sertifikat — koneksi tersambung tapi handshake gagal: sertifikat kedaluwarsa adalah klasik yang 'tiba-tiba' setiap 90 hari/1 tahun. (5) Auth — username/password salah atau kredensial kedaluwarsa; baru di lapisan ini pesan 'access denied' relevan.",
        "Dua konsep yang sering tertukar: latency vs bandwidth. Latency = waktu tempuh satu paket pulang-pergi (ms) — menentukan seberapa 'responsif'. Bandwidth = berapa banyak data per detik (Mbps) — menentukan seberapa 'besar'. Query yang lambat karena 200 round-trip ke database butuh latency rendah, bukan bandwidth besar; memindahkan 10 GB butuh sebaliknya. Salah diagnosis di sini = salah beli solusi.",
        "💡 Intuisi: pesan error jaringan hampir selalu memberi tahu lapisannya — 'Name or service not known' = DNS; 'Connection timed out' = paket tidak sampai (firewall/port); 'Connection refused' = sampai tapi tidak ada yang mendengarkan; 'Access denied' = sampai dan didengar, tapi kredensial ditolak. Baca pesannya, jangan ditebak.",
        "💡 Intuisi: 80% 'database tiba-tiba tidak bisa diakses' setelah deploy/migrasi adalah perubahan IP atau security group — bukan database-nya yang rusak. Selalu curigai lapisan 3 (firewall) sebelum menyalahkan lapisan 5 (database).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menguji konektivitas dengan `ping` lalu menyimpulkan 'jaringan aman'. Ping hanya membuktikan host hidup (ICMP) — ia tidak membuktikan port database terbuka, firewall mengizinkan, atau TLS valid. Port 5432 bisa tertutup rapat sementara ping sukses. Uji lapisan yang tepat: nc/telnet untuk port, bukan ping.",
      },
      reference: "DNS → port → firewall → TLS → auth. Uji berlapis, jangan menebak.",
    },
    {
      id: "docker",
      eyebrow: "Langkah 7 · Docker",
      title: "Docker: akhir dari kalimat 'works on my machine'",
      prose: [
        "Masalah klasik: pipeline jalan sempurna di laptop analis, mati di server produksi — versi Python beda, library beda, environment variable beda. Docker menyelesaikan ini dengan satu janji: 'yang jalan di image ini, jalan di mana pun image ini dijalankan.'",
        "Dua kata yang wajib dibedakan: image vs container. Image = cetak biru (read-only): berisi OS mini, Python, library, dan kodemu — hasil dari Dockerfile. Container = cetakan yang hidup: instance image yang sedang berjalan, bisa di-start/stop/hapus. Satu image bisa dicetak menjadi banyak container identik — di laptop, di server, di cloud.",
        "Layer & cache: image tersusun dari layer — tiap baris Dockerfile = satu layer yang di-cache. Docker membangun ulang HANYA dari layer yang berubah ke bawah. Inilah kenapa URUTAN Dockerfile adalah keputusan performa: letakkan yang JARANG berubah di atas (install OS, `pip install`), yang SERING berubah di bawah (`COPY` kode aplikasi). Pola yang benar menghemat 210 detik per build pada contoh di lab lesson ini — pola yang salah mengunduh ulang semua dependensi setiap kali kamu mengubah satu baris kode.",
        "Volume: container bersifat fana — data di dalamnya hilang saat container dihapus. Volume (`-v data:/data`) adalah 'kantong' di luar container untuk data yang harus bertahan: database, file checkpoint, hasil ETL. Aturan: kode dan dependensi di dalam image (bisa dibangun ulang), data di dalam volume (tidak boleh hilang).",
        "💡 Intuisi: Dockerfile dibaca dari atas ke bawah seperti resep — dan seperti resep, urutannya menentukan biaya. 'Siapkan bahan yang lama dulu (base image, dependensi), masak yang cepat belakangan (copy kode)'. Tiap `COPY . .` di tengah resep = membuang semua persiapan di bawahnya setiap kali ada perubahan kecil.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: tag 'latest' = versi terbaru yang aman",
        type: "pitfall",
        body: "`latest` adalah label yang berpindah-pindah — image yang kamu pull hari ini bisa berbeda dengan yang di-pull minggu depan, tanpa ada yang berubah di kodemu. Pipeline yang 'tiba-tiba rusak padahal tidak ada yang diubah' sering berakar di sini. Praktik yang benar: pin versi eksplisit (`python:3.12-slim`, bukan `python:latest`) dan pin versi image-mu sendiri (`etl:v1.4.2`). Reproducibility berarti: build ulang hari ini = hasil sama dengan build bulan lalu.",
      },
      reference: "Image = cetak biru berlapis; container = cetakan hidup; data = di volume.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 8 · Lab",
      title: "Lab: pipe Unix + cache Docker dalam Python",
      prose: [
        "Waktunya mempraktikkan dua keterampilan lesson ini dalam satu lab. Bagian pertama meniru pipe Unix `grep ERROR app.log | sort | uniq -c | sort -rn` memakai Python stdlib — pola yang sama, bahasa yang berbeda. Bagian kedua menghitung penghematan build dari layer cache Docker.",
        "Cara membaca: `LOG.splitlines()` memecah teks menjadi baris (seperti file dibaca per baris); `b.split()[2]` mengambil kolom ke-3 (nama layanan); `sorted(..., reverse=True)` meniru `sort -rn`. Pada bagian Docker, `cache[k] = True` berarti layer itu diambil dari cache — tidak dibangun ulang.",
        "Interpretasi: setelah lab ini kamu bisa menjawab dua pertanyaan operasional dengan angka: 'layanan mana yang paling berisik?' dan 'berapa detik dihemat cache per build?' — bukan dengan firasat.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `error_lines`: saring baris yang mengandung \"ERROR\" (gaya `grep ERROR`)" },
        { id: "t2", text: "Lengkapi `hitung`: jumlah baris ERROR per layanan dari kolom ke-3 tiap baris (gaya `uniq -c`)" },
        { id: "t3", text: "Urutkan `peringkat` dari jumlah terbanyak (gaya `sort -rn`), lalu cetak hasilnya" },
        { id: "t4", text: "Hitung `penuh`, `cepat`, dan `hemat_cache` dari tabel layer Docker, lalu cetak ketiganya" },
      ],
      expected: "total_error=6 | api=3, db=2, worker=1 | build_penuh=235s | build_cache=25s | hemat=210s",
      note: {
        title: "Sering salah",
        body: "Dua jebakan klasik di lab ini. (1) `sorted(hitung.items(), key=...)` tanpa `reverse=True` mengurutkan dari yang TERKECIL — meniru `sort -n`, bukan `sort -rn`. (2) Mengambil kolom layanan dengan `b.split()[1]` — kolom ke-2 adalah level (ERROR/INFO), layanannya kolom ke-3 (indeks 2). Salah kolom = hitungan untuk 'ERROR' dan 'INFO', bukan per layanan.",
      },
      hints: [
        "T1: list comprehension — [b for b in LOG.splitlines() if \"ERROR\" in b].",
        "T2: layanan = b.split()[2]; hitung[layanan] = hitung.get(layanan, 0) + 1.",
        "T3: sorted(hitung.items(), key=lambda kv: kv[1], reverse=True).",
        "T4: penuh = sum(layer.values()); cepat = jumlah waktu layer yang cache-nya False; hemat_cache = penuh - cepat.",
      ],
      code: {
        starter: `# Log aplikasi satu pagi (format: waktu layanan level pesan)\nLOG = """2026-10-19 08:00:01 api ERROR koneksi timeout ke db\n2026-10-19 08:00:02 worker INFO job 114 selesai\n2026-10-19 08:00:03 db ERROR deadlock pada tabel transaksi\n2026-10-19 08:00:04 api INFO request ok 200\n2026-10-19 08:00:05 api ERROR koneksi timeout ke db\n2026-10-19 08:00:06 worker ERROR kehabisan memori\n2026-10-19 08:00:07 db ERROR deadlock pada tabel transaksi\n2026-10-19 08:00:08 api INFO healthcheck ok\n2026-10-19 08:00:09 api ERROR koneksi timeout ke db\n2026-10-19 08:00:10 db INFO vacuum selesai"""\n\n# TUGAS 1 (grep ERROR): saring baris yang mengandung "ERROR"\nerror_lines = \n\n# TUGAS 2 (uniq -c): hitung baris ERROR per layanan (kolom ke-3 tiap baris)\nhitung = {}\n\n# TUGAS 3 (sort -rn): urutkan dari jumlah terbanyak, lalu cetak\nperingkat = \nprint(f"total_error={len(error_lines)}")\nfor layanan, jumlah in peringkat:\n    print(f"layanan={layanan} jumlah={jumlah}")\n\n# TUGAS 4: cache layer Docker (detik); cache=True berarti layer diambil dari cache\nlayer = {"base": 120, "deps": 90, "kode": 20, "config": 5}\ncache = {"base": True, "deps": True, "kode": False, "config": False}\npenuh = \ncepat = \nhemat_cache = \nprint(f"build_penuh={penuh}s")\nprint(f"build_cache={cepat}s")\nprint(f"hemat={hemat_cache}s")`,
        lockLines: 13,
        solution: `# Log aplikasi satu pagi (format: waktu layanan level pesan)\nLOG = """2026-10-19 08:00:01 api ERROR koneksi timeout ke db\n2026-10-19 08:00:02 worker INFO job 114 selesai\n2026-10-19 08:00:03 db ERROR deadlock pada tabel transaksi\n2026-10-19 08:00:04 api INFO request ok 200\n2026-10-19 08:00:05 api ERROR koneksi timeout ke db\n2026-10-19 08:00:06 worker ERROR kehabisan memori\n2026-10-19 08:00:07 db ERROR deadlock pada tabel transaksi\n2026-10-19 08:00:08 api INFO healthcheck ok\n2026-10-19 08:00:09 api ERROR koneksi timeout ke db\n2026-10-19 08:00:10 db INFO vacuum selesai"""\n\n# TUGAS 1 (grep ERROR): saring baris yang mengandung "ERROR"\nerror_lines = [b for b in LOG.splitlines() if "ERROR" in b]\n\n# TUGAS 2 (uniq -c): hitung baris ERROR per layanan (kolom ke-3 tiap baris)\nhitung = {}\nfor b in error_lines:\n    layanan = b.split()[2]\n    hitung[layanan] = hitung.get(layanan, 0) + 1\n\n# TUGAS 3 (sort -rn): urutkan dari jumlah terbanyak, lalu cetak\nperingkat = sorted(hitung.items(), key=lambda kv: kv[1], reverse=True)\nprint(f"total_error={len(error_lines)}")\nfor layanan, jumlah in peringkat:\n    print(f"layanan={layanan} jumlah={jumlah}")\n\n# TUGAS 4: cache layer Docker (detik); cache=True berarti layer diambil dari cache\nlayer = {"base": 120, "deps": 90, "kode": 20, "config": 5}\ncache = {"base": True, "deps": True, "kode": False, "config": False}\npenuh = sum(layer.values())\ncepat = sum(w for k, w in layer.items() if not cache[k])\nhemat_cache = penuh - cepat\nprint(f"build_penuh={penuh}s")\nprint(f"build_cache={cepat}s")\nprint(f"hemat={hemat_cache}s")`,
        checks: [
          { kind: "equal", task: "t1", name: "error_lines", value: ["2026-10-19 08:00:01 api ERROR koneksi timeout ke db", "2026-10-19 08:00:03 db ERROR deadlock pada tabel transaksi", "2026-10-19 08:00:05 api ERROR koneksi timeout ke db", "2026-10-19 08:00:06 worker ERROR kehabisan memori", "2026-10-19 08:00:07 db ERROR deadlock pada tabel transaksi", "2026-10-19 08:00:09 api ERROR koneksi timeout ke db"], label: "`error_lines` = 6 baris ERROR", msg: "Saring dengan: [b for b in LOG.splitlines() if \"ERROR\" in b]." },
          { kind: "equal", task: "t2", name: "hitung", value: {"api": 3, "db": 2, "worker": 1}, label: "hitung = api:3, db:2, worker:1", msg: "Layanan = kolom ke-3: b.split()[2]; hitung dengan dict." },
          { kind: "stdout_matches", task: "t3", pattern: "total_error=6", label: "cetak total_error=6", msg: "Ada tepat 6 baris mengandung ERROR." },
          { kind: "stdout_matches", task: "t3", pattern: "layanan=api jumlah=3", label: "api terbanyak (3)", msg: "Urutkan menurun: sorted(hitung.items(), key=lambda kv: kv[1], reverse=True)." },
          { kind: "equal", task: "t4", name: "penuh", value: 235, tol: 1e-9, label: "build penuh = 235s", msg: "120 + 90 + 20 + 5 = 235." },
          { kind: "equal", task: "t4", name: "cepat", value: 25, tol: 1e-9, label: "build dengan cache = 25s", msg: "Hanya layer tanpa cache: kode (20) + config (5) = 25." },
          { kind: "equal", task: "t4", name: "hemat_cache", value: 210, tol: 1e-9, label: "hemat = 210s", msg: "235 - 25 = 210." },
          { kind: "stdout_matches", task: "t4", pattern: "build_cache=25s", label: "cetak build_cache=25s", msg: "Baris cetak terakhir bagian Docker: build_cache=25s." },
        ],
      },
      reference: "grep → sort → uniq -c → sort -rn = pola investigasi log; cache Docker = jangan bangun ulang yang tidak berubah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: shell, Python, Git, atau Docker?",
      prose: [
        "Skenario 1 — 'Tidak bisa connect ke database'. Kondisi: error timeout/refused, deploy baru saja selesai. Keputusan: JANGAN restart acak — jalankan checklist berlapis: nslookup (DNS) → nc ke port (port/firewall) → cek security group → cek sertifikat → cek kredensial. Alasan: tiap lapisan punya tes 10 detik; menebak membuang jam.",
        "Skenario 2 — Tugas otomasi kecil: cek file masuk tiap jam, filter baris, kirim ringkasan. Kondisi: logika < 30 baris, tanpa retry kompleks. Keputusan: shell script + cron dulu. Alasan: 5 menit ditulis, nol dependensi. Naik ke Python/Airflow HANYA bila butuh retry beradab, parsing kompleks, atau observability — jangan membayar kompleksitas sebelum dibutuhkan.",
        "Skenario 3 — Ragu apakah sesuatu boleh di-commit. Kondisi: file baru di working directory. Keputusan: tanya 'bisakah ini direkonstruksi dari kode?' Bisa (script, SQL, Dockerfile, config CI) → commit. Tidak bisa tapi besar/rahasia (data mentah, hasil 2 GB, .env, kunci) → JANGAN; masukkan ke .gitignore. Alasan: repo = resep yang bisa direkonstruksi, bukan gudang.",
        "Skenario 4 — 'Di laptop jalan, di server mati'. Kondisi: error versi library / environment berbeda. Keputusan: Docker — satu image untuk dev, staging, produksi; pin versi base image dan dependensi. Alasan: mengakhiri seluruh kelas masalah 'works on my machine' dengan satu artefak yang identik.",
        "Skenario 5 — Build Docker lambat (8 menit tiap deploy). Kondisi: pip install jalan ulang setiap build. Keputusan: pindahkan langkah yang jarang berubah ke atas Dockerfile (base image, install dependensi), COPY kode ke bawah. Alasan: layer cache — perubahan kode tidak boleh membatalkan cache instalasi dependensi.",
        "Aturan praktis 10 detik: gagal pipeline → cek fondasi dulu (df, permission, koneksi) sebelum membaca kode; butuh otomasi → shell dulu, Python bila kompleks; ragu commit → rekonstruksi-atau-abaikan; beda environment → Docker; build lambat → urutkan Dockerfile.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih 'solusi terbesar' untuk masalah terkecil: membangun DAG Airflow untuk tugas yang cukup cron 3 baris, atau membuat image Docker untuk script sekali jalan. Kompleksitas adalah biaya yang dibayar tiap hari (maintenance, debug, onboarding) — belanjakan hanya untuk masalah yang benar-benar membutuhkannya.",
      },
      reference: "Fondasi dulu sebelum kode; shell dulu sebelum Python; rekonstruksi-atau-abaikan untuk Git; satu image untuk semua environment.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: tiga malam pipeline basi",
      prose: [
        "TokoKita menjalankan ETL penjualan via cron jam 02:00. Senin–Rabu, job gagal tiga malam berturut-turut; data mart basi; tim finance memakai angka Jumat untuk laporan Senin. Setiap pagi, analis menghabiskan 2 jam men-debug dari nol — total 6 jam untuk tiga insiden yang ternyata berakar sama.",
        "Malam pertama: `No space left on device` — partisi log penuh. Malam kedua: `Permission denied` — file output milik user lama setelah migrasi server. Malam ketiga: `Connection timed out` ke database — IP server baru belum masuk whitelist security group.",
        "Pertanyaan analisis: (1) Untuk tiap malam, tulis SATU perintah diagnosis yang seharusnya dijalankan pertama (df -h / ls -l / nc -zv). (2) Tiga insiden, tiga akar berbeda — apa SATU perbaikan sistemik yang mencegah ketiganya terulang? (3) Hitung: jika runbook checklist 5 menit menggantikan 2 jam debug per insiden, berapa jam dihemat per bulan bila insiden serupa terjadi 4x?",
        "Pembahasan: (1) Malam 1: `df -h` (10 detik, langsung terlihat 100%); malam 2: `ls -l /data/output` (terlihat owner salah); malam 3: `nc -zv db.internal 5432` (timeout = paket tak sampai → curiga firewall). (2) Perbaikan sistemik: monitoring + alerting fondasi — alert disk 80%, validasi permission & konektivitas sebagai health check sebelum job jalan (pre-flight check), dan runbook tertulis. Ketiganya adalah 'fondasi yang dipantau', bukan 'fondasi yang diasumsikan beres'. (3) (120 − 5) menit × 4 = 460 menit ≈ 7,7 jam per bulan — hampir satu hari kerja penuh yang kembali, hanya dari checklist.",
      ],
      tasks: [],
      reference: "Diagnosis 10 detik per lapisan; pre-flight check sebelum job; runbook mengubah 2 jam debug menjadi 5 menit.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran fondasi. Perhatikan jebakan 'tebakan vs checklist' dan 'solusi terbesar vs solusi tepat'.",
      ],
      tasks: [],
      summary: [
        "Fondasi tak terlihat Linux: filesystem (df/du), permission (rwx, chmod secukupnya), proses & sinyal (TERM dulu, KILL terakhir) — tiga pembunuh pipeline paling sepele.",
        "Shell = cara berpikir investigasi: grep | sort | uniq -c | sort -rn; redirect > / >> / 2>; exit code sebagai bahasa kegagalan; set -e agar gagal cepat.",
        "Git untuk data: commit kode/SQL/Dockerfile/CI dengan pesan KENAPA; abaikan data mentah, hasil besar, dan secret via .gitignore — secret yang ter-commit = bocor selamanya.",
        "Debug jaringan berlapis: DNS → port → firewall → TLS → auth; baca pesan error (timed out vs refused vs denied) alih-alih menebak.",
        "Docker: image = cetak biru berlapis (read-only), container = cetakan hidup; urutan Dockerfile menentukan cache (jarang berubah di atas); data bertahan di volume; pin versi, jangan latest.",
        "Aturan 10 detik: fondasi dulu sebelum kode; shell dulu sebelum Python; rekonstruksi-atau-abaikan untuk Git; satu image untuk semua environment.",
      ],
      quiz: [
        {
          q: "Pipeline gagal menulis output. `df -h` menunjukkan partisi /var 100% penuh. Tindakan pertama yang benar?",
          options: [
            { text: "Restart server lalu jalankan ulang job", why: "Restart tidak mengosongkan disk — job akan gagal lagi dalam hitungan menit, plus downtime sia-sia." },
            { text: "Bebaskan ruang (hapus/arsipkan log lama), lalu atasi akarnya dengan rotasi log", why: "Tepat: pulihkan ruang dulu agar pipeline jalan malam ini, lalu pasang logrotate + alert 80% agar tidak terulang.", correct: true },
            { text: "chmod -R 777 /var agar job bisa menulis", why: "Disk penuh bukan masalah izin — 777 tidak menambah satu byte pun, malah merusak keamanan." },
            { text: "Upgrade versi Python di server", why: "Tidak ada hubungannya dengan ruang disk. Ini menebak, bukan mendiagnosis." },
          ],
        },
        {
          q: "Pada perintah `grep ERROR app.log | sort | uniq -c | sort -rn | head -5`, apa peran `uniq -c`?",
          options: [
            { text: "Menghapus semua baris duplikat dari file", why: "uniq hanya menggabungkan baris yang BERSEBELAHAN sama — tanpa sort dulu, hitungannya salah." },
            { text: "Menghitung kemunculan tiap baris unik yang sudah berurutan", why: "Tepat: setelah sort, baris-baris sama mengelompok, lalu uniq -c menghitung tiap kelompok.", correct: true },
            { text: "Mengurutkan hasil secara numerik menurun", why: "Itu tugas `sort -rn`. uniq tidak mengurutkan." },
            { text: "Menampilkan 5 baris pertama", why: "Itu tugas `head -5` di ujung pipe." },
          ],
        },
        {
          q: "Cron job gagal dengan 'Permission denied' saat menulis ke /data/output. Diagnosis paling mungkin?",
          options: [
            { text: "File output sedang dikunci database", why: "Lock database tidak menghasilkan pesan permission denied dari shell." },
            { text: "User cron tidak punya hak tulis pada direktori; perbaiki dengan chown/chmod secukupnya", why: "Tepat: permission denied = soal kepemilikan/izin. Cek dengan ls -l, perbaiki minimal — bukan 777.", correct: true },
            { text: "Disk penuh", why: "Disk penuh pesannya 'No space left on device' — berbeda dan jujur." },
            { text: "Zona waktu server salah", why: "Zona waktu salah merusak dedup/window waktu, bukan izin file." },
          ],
        },
        {
          q: "Mana yang WAJIB masuk .gitignore di repo pipeline data?",
          options: [
            { text: "File .env berisi API key dan folder data/ mentah", why: "Tepat: secret tidak boleh masuk repo (bocor selamanya di history); data mentah besar bukan kode.", correct: true },
            { text: "README.md dan Dockerfile", why: "Kebalikannya: keduanya justru wajib di-commit — dokumentasi dan definisi environment." },
            { text: "Skrip SQL transformasi", why: "SQL transformasi adalah kode yang merekonstruksi pekerjaan — wajib di-version." },
            { text: "Definisi job CI/CD", why: "Pipeline CI adalah kode infrastruktur — wajib di-commit agar reproducible." },
          ],
        },
        {
          q: "Container tidak bisa connect ke database: koneksi timeout. Urutan debug yang benar?",
          options: [
            { text: "Restart container dan berharap sembuh", why: "Restart tanpa diagnosis = mengulang kegagalan. Timeout menunjuk ke lapisan jaringan, bukan aplikasi." },
            { text: "Cek DNS resolve → cek port terbuka (nc) → cek firewall/security group → cek kredensial", why: "Tepat: dari lapisan terbawah ke atas. Tiap langkah punya tes 10 detik; berhenti di lapisan pertama yang gagal.", correct: true },
            { text: "Ganti password database terlebih dahulu", why: "Timeout berarti paket tidak sampai — auth belum sempat ditolak. Salah lapisan." },
            { text: "Naikkan memori container", why: "Kekurangan memori menyebabkan OOM kill, bukan timeout koneksi." },
          ],
        },
        {
          q: "Di Dockerfile, `COPY . .` ditulis SEBELUM `RUN pip install -r requirements.txt`. Akibatnya?",
          options: [
            { text: "Build menjadi lebih cepat karena paralel", why: "Terbalik: Docker build berurutan per layer, dan urutan ini justru mematikan cache." },
            { text: "Setiap perubahan kode membatalkan cache pip install — dependensi diunduh ulang tiap build", why: "Tepat: layer cache batal dari baris yang berubah ke bawah. Pindahkan install dependensi ke atas, COPY kode ke bawah.", correct: true },
            { text: "Image tidak bisa dijalankan sama sekali", why: "Image tetap jalan; masalahnya kecepatan build, bukan kemampuan jalan." },
            { text: "Volume container tidak berfungsi", why: "Volume tidak berhubungan dengan urutan layer build." },
          ],
        },
      ],
    },
  ],
};
