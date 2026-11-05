import type { V2Lesson } from "../lib/types";

export const dm5: V2Lesson = {
  slug: "dm5-orkestrasi-dbt",
  track: "Data Management",
  module: "Pipeline",
  title: "Orkestrasi & dbt: Pipelinemu Butuh Konduktor",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-dashboard",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Dashboard pagi yang kosong",
      prose: [
        "Jam 7 pagi, direksi membuka dashboard — kosong. Investigasi: script Python di cron mati jam 2 pagi karena disk penuh. Tidak ada yang tahu sampai pagi. Lebih parah: cron tetap jalan jam 3, 4, 5 — menumpuk error. Dan tidak ada yang tahu urutan script mana yang harus di-rerun dulu.",
        "Semua script-nya benar. Yang gagal adalah orkestrasinya: tidak ada yang tahu job gagal, tidak ada retry otomatis, tidak ada urutan dependensi, tidak ada yang bisa menjawab \"data tanggal berapa yang belum diproses?\" Inilah beda script vs pipeline produksi.",
      ],
      tasks: [],
      reference: "Script benar tidak cukup — pipeline produksi butuh konduktor.",
    },
    {
      id: "orkestrasi",
      eyebrow: "Langkah 2 · Orkestrasi",
      title: "Konduktor orkestra data",
      prose: [
        "Orkestrator = sistem yang menjadwalkan, mengurutkan, memantau, dan memulihkan pipeline data. Pemain utama: Apache Airflow (paling umum di lowongan), Dagster (modern, data-aware), Prefect (ringan).",
        "Yang diberikan orkestrator dan tidak diberikan cron: dependensi (\"jangan jalan sebelum X sukses\"), retry + alert (gagal → coba lagi 3 kali → kirim Slack/email), visibilitas (dashboard status tiap job), dan backfill (proses ulang rentang tanggal). Cron itu seperti menyuruh tiap pemain musik main sendiri sesuai jam dinding — tanpa mendengar satu sama lain.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\"Pipeline kami sudah otomatis pakai cron.\" Cron hanya penjadwal waktu buta: tidak memahami dependensi antar job, tidak memberi tahu saat gagal, tidak bisa retry cerdas. Produksi = orkestrator; cron hanya untuk mainan.",
        type: "pitfall",
      },
      reference: "Airflow untuk orkestrasi antar sistem; dbt untuk transformasi di dalam warehouse.",
    },
    {
      id: "dag",
      eyebrow: "Langkah 3 · DAG",
      title: "Partitur musiknya",
      prose: [
        "DAG = Directed Acyclic Graph: directed (ada arah: A → B), acyclic (tidak boleh melingkar — A → B → A dilarang, kalau tidak, tidak pernah selesai). Node = task (misal bronze_transaksi), edge = dependensi (\"jalan setelah\").",
        "Aturan main: task jalan hanya jika semua dependensinya sukses. Jika satu gagal, downstream-nya tidak jalan — ini yang mencegah data setengah matang naik ke Gold.",
        "Anatomi task Airflow: PythonOperator, BashOperator, sensor (menunggu file/partisi datang), dengan retries=3, retry_delay, dan on_failure_callback (kirim alert). Intuisi desain: desain DAG dari data, bukan dari waktu — \"jalan setelah partisi tiba\", bukan sekadar \"jalan jam 2 pagi\".",
      ],
      tasks: [],
      reference: "Task C bergantung pada A dan B; A gagal → C tidak jalan.",
    },
    {
      id: "dbt",
      eyebrow: "Langkah 4 · dbt",
      title: "Transformasi sebagai kode",
      prose: [
        "dbt (data build tool) = framework untuk transformasi ELT: kamu tulis SELECT biasa (+ Jinja templating), dbt yang mengurus urutan eksekusi (dari ref() antar model), dokumentasi otomatis, dan test (unique, not_null, custom).",
        "Filosofinya \"analytics engineering\": transformasi diperlakukan seperti software — version control (git), code review, CI (test jalan tiap pull request), dokumentasi yang lahir dari kode. Struktur tipikal: staging/ (cermin 1:1 sumber), intermediate/ (logika bisnis: join, agregat), marts/ (tabel final siap dashboard — Gold-nya medallion).",
        "Bedanya dengan ETL tool klasik (Informatica, SSIS): tool klasik = GUI drag-and-drop, logika terkunci di tool; dbt = teks SQL di git, bisa di-review. Praktik umum: task Airflow memanggil \"dbt run\".",
      ],
      tasks: [],
      note: {
        title: "Intuisi: dbt membalik cara berpikir tentang urutan",
        body: "Di script biasa kamu berpikir imperatif: \"jalankan A, lalu B, lalu C\". dbt memaksamu berpikir deklaratif: kamu hanya menyatakan \"model C memakai (ref) model B\", dan mesin menyimpulkan sendiri urutan eksekusinya dari dependency graph. Konsekuensinya besar: mengubah satu model di tengah rantai tidak perlu re-run manual seluruh chain — perintah seperti \"dbt ls --select model_ini+\" menunjukkan persis siapa saja turunannya yang terdampak, dan \"dbt run --select model_ini+\" membangun ulang hanya yang perlu. Manfaat sampingannya: graph itu sendiri adalah dokumentasi — engineer baru membaca peta dependensi, bukan 50 file SQL berantakan. Heuristiknya: kalau kamu tidak bisa menggambar dependency graph file-file SQL-mu di papan tulis dalam 2 menit, kamu belum punya pipeline — kamu punya tumpukan script. Dan karena ref() menciptakan keterikatan di waktu kompilasi, salah ketik nama model gagal saat build, bukan jam 3 pagi saat job jalan.",
      },
      reference: "dbt ≠ pengganti Airflow. Lapisan berbeda: dbt = transformasi, Airflow = orkestrasi.",
    },
    {
      id: "idempoten-lab",
      eyebrow: "Langkah 5 · Idempotency · lab",
      title: "Aman dijalankan 10 kali",
      prose: [
        "Job idempoten: dijalankan 1 kali atau 10 kali hasilnya sama — f(f(x)) = f(x). Kenapa wajib: retry adalah fitur inti orkestrator, job akan dijalankan ulang (network glitch, timeout). Job tidak-idempoten (INSERT buta) + retry = data ganda.",
        "Pola implementasi: DELETE + INSERT per partisi tanggal (hapus dulu hasil tanggal X, lalu tulis ulang), MERGE/UPSERT by key, atau INSERT OVERWRITE partition. Idempotency membuat retry aman, dan retry yang aman membuat backfill mungkin — tiga konsep ini satu paket.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `tulis_idempoten`: hapus baris tanggal tsb dulu, baru append" },
        { id: "t2", text: "Hitung `n_baris` = jumlah baris di `gold` setelah 2× tulis (simulasi retry)" },
        { id: "t3", text: "Cetak n_baris dengan `print`" },
      ],
      expected: "baris=1",
      note: {
        title: "Sering salah",
        body: "Menyalakan retry sebelum memastikan job idempoten. Retry + INSERT buta = duplikat diam-diam. Urutan yang benar: idempoten dulu, baru nyalakan retry.",
        type: "pitfall",
      },
      hints: [
        "Hapus dulu: gold[:] = [r for r in gold if r[0] != tanggal]",
        "Lalu gold.append((tanggal, total)) seperti biasa.",
        "n_baris = len(gold)",
      ],
      code: {
        starter: `gold = []  # gold_penjualan_harian: list of (tanggal, total)\n\ndef tulis_buta(tanggal, total):\n    gold.append((tanggal, total))  # INSERT buta: retry = duplikat\n\n# TULIS KODEMU: versi idempoten — hapus hasil tanggal ini dulu, baru tulis\ndef tulis_idempoten(tanggal, total):\n    ...\n\n# Simulasi: tulis sukses, tapi laporan gagal -> orkestrator me-retry (jalan 2x)\ntulis_idempoten("2026-10-01", 1500000)\ntulis_idempoten("2026-10-01", 1500000)  # retry\n\nn_baris = \nprint(f"baris={n_baris}")`,
        lockLines: 4,
        solution: `gold = []  # gold_penjualan_harian: list of (tanggal, total)\n\ndef tulis_buta(tanggal, total):\n    gold.append((tanggal, total))  # INSERT buta: retry = duplikat\n\n# TULIS KODEMU: versi idempoten — hapus hasil tanggal ini dulu, baru tulis\ndef tulis_idempoten(tanggal, total):\n    gold[:] = [r for r in gold if r[0] != tanggal]\n    gold.append((tanggal, total))\n\n# Simulasi: tulis sukses, tapi laporan gagal -> orkestrator me-retry (jalan 2x)\ntulis_idempoten("2026-10-01", 1500000)\ntulis_idempoten("2026-10-01", 1500000)  # retry\n\nn_baris = len(gold)\nprint(f"baris={n_baris}")`,
        checks: [
          { kind: "equal", task: "t2", name: "n_baris", value: 1, tol: 0, label: "`n_baris` seharusnya 1", msg: "Retry ke-2 harus menghapus hasil retry ke-1 dulu. Cek baris hapus-di-dulunya." },
          { kind: "stdout_matches", task: "t3", pattern: "baris=1", label: "`print` menampilkan baris=1", msg: "Cetak dengan format baris=... ." },
        ],
      },
      reference: "Bandingkan: tulis_buta 2× = 2 baris (duplikat). Itulah mini-case di langkah 7.",
    },
    {
      id: "backfill-retry",
      eyebrow: "Langkah 6 · Backfill & retry",
      title: "Mesin waktu pipeline",
      prose: [
        "Retry: kegagalan sesaat (network, API limit) → coba lagi otomatis dengan backoff (jeda membesar: 1 → 5 → 15 menit). Setelah N kali tetap gagal → alert manusia, jangan retry selamanya.",
        "Backfill: \"proses ulang rentang tanggal X–Y\" — dibutuhkan saat bug logika ditemukan (3 bulan data salah hitung), sumber telat kirim, atau skema berubah. Syarat backfill aman: (1) job idempoten, (2) partisi per tanggal jelas, (3) kapasitas compute cukup (jangan backfill 90 hari di jam sibuk).",
        "Contoh hitungan: pipeline 6 task (20+15+10+25+5+5 = 80 menit), SLA dashboard jam 07.00, mulai 04.00. Tanpa orkestrasi, kegagalan baru sadar jam 08.30 dan pulih dengan rerun manual dari awal — telat 3 jam 20 menit, direksi rapat dengan angka kemarin.",
      ],
      tasks: [],
      reference: "Retry untuk gagal transien; backfill untuk perbaiki masa lalu. Keduanya butuh idempotency.",
    },
    {
      id: "minicase-ganda",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Job ganda, angka ganda",
      prose: [
        "Job gold_penjualan_harian memakai INSERT buta. Suatu malam network glitch: task sukses menulis tapi gagal melapor → Airflow me-retry → INSERT kedua jalan. Hasil: penjualan tanggal itu tercatat 2 kali. Dashboard direksi menunjukkan rekor penjualan — yang palsu. Butuh 2 hari untuk sadar dan perbaiki.",
        "Akar masalah: job tidak idempoten + retry otomatis = kombinasi beracun. Perbaikan kode: DELETE + INSERT per tanggal (atau MERGE by tanggal). Test dbt yang bisa menangkap lebih awal: test unique pada kolom tanggal di model gold — duplikat langsung gagal di CI sebelum naik ke dashboard. Inilah nilai \"transformasi sebagai kode\".",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Angka penjualan ganda bukan sekadar malu-maluin — ia bisa memicu keputusan bisnis yang salah (bonus, target, bahkan laporan keuangan). Test unique/not_null di dbt adalah kontrol kualitas yang murah dibanding biaya keputusan atas angka palsu.",
      },
      reference: "Setiap model gold: test unique di key-nya, not_null di kolom kuncinya.",
    },
    {
      id: "skala-kegagalan",
      eyebrow: "Langkah 8 · Skala & kegagalan",
      title: "Ketika pipeline-mu tumbuh 100 kali lipat",
      prose: [
        "Bayangkan fintech \"DanaKilat\": 12.000 pencairan per hari dengan rata-rata Rp8 juta per pencairan — artinya Rp96 miliar dana bergerak setiap hari melalui pipeline mereka. Rantainya empat job berurutan: ingest dari core banking (45 menit), validasi dan cleansing (20 menit), risk scoring (35 menit), dan kompilasi laporan harian ke regulator (15 menit). Total 115 menit, mulai jam 03.00 dini hari, dengan SLA laporan harus terkirim jam 06.00. Di skala ini orkestrasi bukan lagi \"nice to have\" — satu job yang macet satu jam berarti laporan regulator telat, dan denda keterlambatan laporan ke OJK bisa mencapai ratusan juta rupiah per kejadian, belum termasuk temuan audit yang mempertanyakan pengendalian internal perusahaan. Semua pelajaran dari langkah 1 sampai 7 diuji di sini, tetapi taruhannya bukan lagi nilai lab — melainkan uang sungguhan, reputasi, dan hubungan dengan regulator. Prinsip yang sama, konsekuensi yang berlipat seratus kali.",
        "Mode kegagalan pertama adalah zombie task: task yang tidak gagal dan tidak sukses — ia menggantung di antaranya. Penyebab klasiknya dua. Pertama, sensor yang menunggu file partisi atau data yang tidak pernah datang, tanpa timeout yang dikonfigurasi. DAG terlihat \"running\" berjam-jam, tidak ada alert yang bunyi karena secara teknis tidak ada yang \"gagal\". Kedua, API call tanpa timeout yang hang selamanya menunggu respons server yang sudah mati. Di Airflow, sensor punya dua mode: poke (worker diduduki terus selama menunggu — boros slot) dan reschedule (worker dibebaskan antar pengecekan — hemat, tetapi butuh konfigurasi sadar). Aturan keputusannya keras dan tidak bisa ditawar: setiap sensor dan setiap panggilan jaringan wajib punya timeout eksplisit. \"Kalau sebuah task berjalan lebih dari dua kali p95 runtime normalnya, bunuh dan kirim alert — jangan tunggu ia sadar sendiri.\" Timeout mengubah kegagalan senyap menjadi kegagalan yang berisik, dan hanya kegagalan yang berisik yang bisa diperbaiki. Bonus: kenali parameter soft_fail — kadang sensor yang timeout memang boleh dianggap \"skip\" (misalnya data akhir pekan yang memang tidak ada), tetapi itu harus keputusan eksplisit, bukan kecelakaan.",
        "Mode kegagalan kedua adalah retry storm, dan ia lebih licik karena datang dari fitur yang seharusnya menolong. Job ingest 45 menit gagal di menit ke-44 karena network glitch sesaat. Retry tiga kali berarti tiga kali 45 menit — lebih dari dua jam keterlambatan berantai, semua downstream ikut molor, dan SLA jam 06.00 jebol telak. Lebih parah lagi: retry tanpa backoff dan jitter menghantam API yang sedang sekarat secara bersamaan dan berulang — fenomena thundering herd yang mengubah gangguan kecil menjadi outage penuh. Matematikanya sederhana: backoff eksponensial 1 → 2 → 4 menit plus jitter acak memberi server yang sakit ruang bernapas; retry serentak tanpa jeda justru menendangnya saat jatuh. Aturan keputusannya tiga lapis: pertama, retry hanya untuk error transien yang sudah diklasifikasikan secara eksplisit (timeout, HTTP 429, HTTP 503) — error logika seperti salah query atau skema berubah tidak boleh di-retry karena akan gagal dengan cara yang persis sama; kedua, backoff eksponensial plus jitter adalah wajib, bukan opsional; ketiga, maksimal tiga kali — retry keempat hampir tidak pernah menyelamatkan apa pun, ia hanya menunda pengakuan bahwa manusia harus turun tangan. Klasifikasikan errormu sebelum menyalakan retry, bukan sesudah insiden.",
        "Bandingkan dua tim yang menangani insiden yang sama. Tim A memakai cron plus script plus grup WhatsApp sebagai \"alerting\". Suatu malam job validasi gagal diam-diam; tidak ada yang sadar sampai analis datang jam 8 pagi dan menemukan dashboard kosong; investigasi manual satu jam; rerun berurutan dua jam; laporan regulator dikirim jam 11 — telat lima jam, denda, dan surat teguran. Tim B memakai orkestrator dengan SLA per task: SLA ingest 60 menit, SLA scoring 50 menit. Begitu job ingest melewati 60 menit — walau belum gagal — callback sla_miss_callback sudah berbunyi jam 04.05, engineer bangun, melihat log, menemukan disk hampir penuh, membersihkan, dan rantai selesai jam 05.40 — dua puluh menit sebelum SLA. Bedanya bukan tool mahal versus murah; bedanya adalah SLA per task yang mengubah \"nanti juga ketahuan\" menjadi \"ketahuan sebelum terlambat\". SLA di Airflow bukan janji ke pelanggan — ia adalah alarm internal yang memberimu waktu untuk bertindak selagi masih bisa. Pelajaran yang tidak obvious: alert yang paling berharga bukanlah alert \"gagal\", melainkan alert \"akan gagal\".",
        "Pendalaman berikutnya: pool dan prioritas, dua konsep yang baru terasa pentingnya saat puluhan DAG berebut resource yang sama. Tanpa batasan, sepuluh backfill berat yang dijalankan bersamaan bisa menghabiskan semua worker slot — scheduler kelaparan, dan job kritis harian ikut antre di belakang pekerjaan historis yang sebenarnya bisa menunggu. Solusinya adalah pool: misalnya pool_etl_berat dibatasi 4 slot, sehingga maksimal empat job berat berjalan bersamaan tidak peduli berapa banyak yang antre. Lalu prioritas: tidak semua job sama pentingnya. Job laporan regulator harus selalu menang atas job eksperimen analis; job yang mengisi dashboard direksi menang atas job arsip. Di Airflow ini diekspresikan lewat priority_weight per task. Aturan praktisnya yang sering dilupakan: \"kalau semua job dianggap penting, maka tidak ada yang penting.\" Tulis prioritasnya eksplisit di konfigurasi — jangan disimpan di kepala engineer yang sedang cuti. Insiden klasik yang bisa dicegah: tim analitik menjalankan backfill 90 hari di jam 9 pagi tanpa pool, job laporan harian antre tiga jam, direksi rapat dengan angka kemarin.",
        "Backfill di skala besar menuntut matematika, bukan keberanian. Contoh hitungan: backfill 90 hari untuk job berdurasi 45 menit sama dengan 90 × 45 menit = 67,5 jam compute. Dijalankan di jam sibuk, ia mencuri resource dari job harian dan menciptakan insiden baru tepat saat kamu memperbaiki insiden lama — seperti memadamkan kebakaran dengan bensin. Aturan keputusannya empat lapis. Pertama, backfill hanya jalan di window maintenance — misalnya jam 10.00 sampai 15.00 saat load warehouse rendah — bukan \"sekarang juga\" karena panik. Kedua, batasi max_active_runs agar run-run backfill tidak menyerbu sekaligus; antrean yang tertib lebih cepat selesai daripada kerumunan yang saling berebut. Ketiga, mulai dari tanggal terbaru mundur ke yang lama — karena data terbaru biasanya yang paling dibutuhkan bisnis duluan, dan kalau backfill harus dihentikan di tengah jalan, bagian paling berharganya sudah selesai. Keempat, dan ini fondasinya: backfill hanya aman di atas job yang idempoten. Backfill di atas job tidak-idempoten bukan perbaikan — ia adalah penggandaan masalah secara sistematis. Pelajaran terkait yang pahit: parameter catchup yang dibiarkan true secara default bisa memicu backfill raksasa tak disengaja setiap kali DAG diaktifkan ulang — selalu periksa perilaku catchup sebelum menekan tombol deploy.",
        "Tutup dengan checklist sepuluh detik untuk operator pipeline — ditempel di dinding, bukan dihafal. Task gagal sekali: biarkan retry bekerja, itu memang tugasnya. Task yang sama gagal dua kali berturut-turut: page manusia, jangan tunggu retry ketiga yang hampir pasti gagal juga. Ada risiko SLA jebol: eskalasi sebelum SLA jebol, bukan sesudah — meminta perpanjangan waktu secara proaktif atau mengirim laporan parsial yang jujur tentang keterbatasannya selalu lebih baik daripada telat diam-diam lalu ketahuan. Setiap insiden, sekecil apa pun: tulis runbook satu paragraf — \"gejala, penyebab, perintah yang dijalankan, berapa lama pulih\" — supaya malam berikutnya tidak mengulang kebingungan yang sama. Dan sebulan sekali: baca ulang runbook yang terkumpul, cari polanya; tiga insiden dengan akar masalah sama berarti ada perbaikan sistemik yang belum dilakukan. Pipeline yang dewasa bukan pipeline yang tidak pernah gagal — tidak ada yang seperti itu. Pipeline yang dewasa adalah yang gagalnya berisik, pulihnya otomatis, dan pelajarannya tertulis sehingga kegagalan yang sama tidak perlu dibayar dua kali.",
        "Granularitas task adalah keputusan desain yang diremehkan. Task yang terlalu besar — satu task monolit 45 menit — berarti kegagalan di menit ke-44 menghanguskan 44 menit compute dan memaksa pengulangan penuh; tidak ada checkpoint, tidak ada partial progress. Task yang terlalu kecil — seribu task berdurasi lima detik — berarti scheduler tenggelam dalam overhead penjadwalan dan log, dan dependency graph menjadi sarang laba-laba yang tidak bisa dibaca manusia. Aturan praktis industri: satu task berdurasi 5 sampai 30 menit. Lebih pendek dari itu, gabungkan; lebih panjang dari itu, pecah dengan checkpoint di antaranya (misalnya tulis hasil intermediate ke staging). Heuristiknya: \"bisakah saya me-retry task ini tanpa meringis membayangkan biayanya?\" Kalau jawabannya tidak, task-nya terlalu besar. Granularitas yang tepat membuat retry murah, backfill presisi (hanya task yang rusak yang diulang, bukan seluruh rantai), dan debugging manusiawi — tiga keuntungan dari satu keputusan desain.",
        "Sisi dbt dari skala adalah CI yang serius. Di tim kecil, \"dbt test\" dijalankan manual sebelum merge; di skala DanaKilat, setiap pull request otomatis menjalankan \"dbt build\" di environment terisolasi: model dibangun dari data dummy atau sample, seluruh test dieksekusi — unique, not_null, accepted_values, relationships (foreign key) — dan dokumentasi di-generate. PR tidak bisa di-merge kalau ada test merah. Empat jenis test yang wajib ada di setiap model gold: unique di primary key, not_null di kolom kunci, accepted_values di kolom status/kategori (menangkap nilai baru yang tidak dikenal dari sumber — misalnya status \"X9\" misterius), dan relationships yang memastikan setiap foreign key punya pasangan di dimensi (inilah yang menangkap \"nasabah hantu\" sebelum mencapai dashboard). Test dbt yang baik bersifat murah dan cepat — berjalan dalam hitungan menit, bukan jam — sehingga developer tidak tergoda melewatinya. Aturan: test yang lambat akan dimatikan orang; buat test kritis tetap di bawah lima menit.",
        "Kegagalan yang tidak kalah mahal adalah alert fatigue: terlalu banyak alert sehingga semuanya diabaikan. Pipeline yang mengirim 200 notifikasi Slack per hari sama bahayanya dengan pipeline tanpa alert — engineer belajar mengabaikan channel itu, dan alert yang benar-benar kritis tenggelam di antara 199 alert tidak penting. Solusinya adalah severity yang disiplin. SEV-1 (page telepon, bangunkan orang): laporan regulator terancam, data corruption terdeteksi. SEV-2 (Slack + tiket, tangani jam kerja): satu task gagal tetapi retry masih punya peluang, SLA masih aman. SEV-3 (log + dashboard, review mingguan): anomali kecil, tren yang perlu diperhatikan. Aturan: kalau dalam sebulan tidak ada SEV-1, bagus; kalau SEV-1 berbunyi lebih dari dua kali seminggu, ambang batasnya salah atau sistemnya memang rapuh — perbaiki sistemnya, jangan naikkan ambangnya diam-diam. Setiap alert wajib punya runbook tertaut: alert tanpa instruksi \"lalu saya harus apa\" hanyalah kecemasan yang diformat rapi.",
        "Capacity planning adalah matematika yang memisahkan tim reaktif dari tim proaktif. Contoh DanaKilat: empat job berdurasi total 115 menit compute per hari di window 03.00–06.00 (180 menit). Utilisasi 64% — terlihat aman, sampai musim promo menggandakan volume transaksi dan durasi ingest naik dari 45 menjadi 80 menit: total 150 menit, utilisasi 83%, dan satu gangguan kecil saja menjebol SLA. Aturan: rencanakan kapasitas untuk 2× beban puncak, bukan rata-rata; ukur tren durasi job tiap minggu (job yang tumbuh 5% per minggu akan menggandakan diri dalam 14 minggu — kamu punya kalender peringatan); dan pisahkan workload: job kritis harian tidak boleh berbagi pool dengan backfill historis. Konsep terkait adalah idempotency window: berapa lama data mentah disimpan untuk memungkinkan reprocess? Tiga puluh hari adalah titik awal yang umum — cukup untuk memperbaiki bug yang baru disadari berminggu-minggu kemudian, tanpa membayar penyimpanan abadi untuk data mentah.",
        "Lapisan terakhir kedewasaan adalah disaster recovery: \"bagaimana kalau semuanya hilang?\" Skenario nyata: region cloud bermasalah, atau — lebih sering — seseorang menghapus tabel produksi karena salah ketik perintah. Dua pertanyaan yang harus terjawab sebelum insiden, bukan sesudahnya. Pertama, RPO (Recovery Point Objective): data sampai titik mana yang bisa hilang tanpa bencana? Kalau staging mentah disimpan 30 hari, RPO-mu 30 hari untuk reprocess penuh. Kedua, RTO (Recovery Time Objective): berapa lama membangun ulang dari nol? Uji dengan game day: sekali per kuartal, tim berlatih membangun ulang pipeline di environment kosong dan mengukur waktunya — tanpa game day, RTO hanyalah angka di dokumen. Praktik yang menyelamatkan banyak perusahaan: backup logis harian untuk tabel gold kritis (bukan seluruh warehouse — mahal), versioning kode pipeline di git (infrastruktur sebagai kode, bukan klik manual di konsol), dan runbook recovery satu halaman yang bisa diikuti engineer yang baru bergabung tiga hari. Bencana tidak bertanya apakah kamu siap; ia hanya datang dan mengukur.",
        "Satu jebakan terakhir yang pantas disebut: start_date dinamis. Menulis start_date sebagai \"kemarin\" yang dihitung saat file dibaca (misalnya datetime.now() minus satu hari) membuat Airflow menganggap setiap pembacaan file sebagai definisi baru — DAG tidak pernah berjalan, atau berjalan dengan perilaku aneh yang sulit di-debug. Aturan: start_date harus tanggal statis di masa lalu. Ini contoh sempurna dari kelas bug \"konfigurasi yang terlihat pintar\": ia bekerja di kepala penulisnya, gagal di scheduler, dan tidak ada test yang menangkapnya karena test biasanya tidak mensimulasikan scheduler. Pelajaran umumnya: pahami kapan kodemu dievaluasi — kode DAG dievaluasi berulang-ulang oleh scheduler, bukan sekali saat kamu menulisnya. Setiap ekspresi yang bergantung pada \"sekarang\" di level definisi DAG adalah bom waktu.",
        "Menutup loop-nya: orkestrasi yang baik pada akhirnya adalah tentang kepercayaan yang bisa diaudit. Setiap keputusan dalam langkah ini — timeout berapa, retry berapa kali, SLA kapan, pool seberapa besar — harus tertulis di konfigurasi yang ter-version control, bukan di ingatan satu orang. Ketika auditor, regulator, atau engineer baru bertanya \"kenapa pipeline ini didesain begini?\", jawabannya ada di git history dan runbook, bukan \"tanya Budi, dia yang dulu bikin\". DanaKilat yang hipotetis di awal langkah ini selamat bukan karena teknologinya canggih, melainkan karena setiap kegagalan yang mungkin terjadi sudah dipikirkan sebelumnya, diberi batas, diberi alarm, dan diberi prosedur. Itulah definisi operasional dari \"pipeline produksi\": bukan pipeline yang tidak pernah gagal, melainkan pipeline yang kegagalannya sudah direncanakan.",
      ],
      tasks: [],
      reference: "Skala mengubah segalanya: timeout wajib, retry dibatasi, SLA per task, backfill di window sepi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah."],
      tasks: [],
      summary: [
        "Orkestrator (Airflow/Dagster): jadwal + dependensi + retry + alert + visibilitas + backfill. Cron tidak cukup untuk produksi.",
        "DAG: directed, acyclic; task jalan hanya jika semua dependensi sukses.",
        "dbt: transformasi SQL sebagai kode — git, test, dokumentasi otomatis; dipanggil dari orkestrator.",
        "Idempotency f(f(x))=f(x): prasyarat retry dan backfill yang aman.",
        "Retry untuk gagal transien (dengan backoff + batas); backfill untuk perbaiki masa lalu.",
      ],
      next: { label: "DM6 — Batch vs Streaming", href: "/learn/dm6-batch-streaming" },
      quiz: [
        {
          q: "Kenapa cron tidak cukup untuk pipeline produksi?",
          options: [
            { text: "Karena cron lambat", why: "Kecepatan bukan masalahnya." },
            { text: "Karena cron tidak memahami dependensi antar job, tidak memberi visibilitas status, dan tidak punya retry/alert", why: "Cron hanya penjadwal waktu buta. Pipeline butuh orkestrasi.", correct: true },
            { text: "Karena cron tidak bisa jalan tiap hari", why: "Cron bisa jalan tiap hari; itu bukan kekurangannya." },
            { text: "Karena cron mahal", why: "Cron gratis dan ringan; masalahnya fitur, bukan harga." },
          ],
        },
        {
          q: "Dalam DAG, task C bergantung pada A dan B. A gagal. Apa yang terjadi pada C?",
          options: [
            { text: "C tetap jalan", why: "Itu justru yang dicegah DAG." },
            { text: "C tidak jalan (menunggu semua dependensi sukses) — mencegah data setengah matang", why: "Aturan DAG: task jalan hanya jika semua dependensi sukses.", correct: true },
            { text: "C jalan setengah", why: "Tidak ada konsep \"jalan setengah\" di orkestrator." },
            { text: "DAG otomatis memperbaiki A", why: "DAG tidak memperbaiki; ia menahan downstream dan memberi alert." },
          ],
        },
        {
          q: "Job idempoten berarti…",
          options: [
            { text: "Job yang cepat", why: "Kecepatan tidak ada hubungannya dengan idempotency." },
            { text: "f(f(x)) = f(x) — dijalankan berulang hasilnya sama; prasyarat agar retry aman", why: "Idempotency membuat retry tidak berbahaya.", correct: true },
            { text: "Job yang tidak pernah gagal", why: "Job idempoten tetap bisa gagal; bedanya retry-nya aman." },
            { text: "Job tanpa kode", why: "Idempotency adalah sifat pola tulis, bukan ketiadaan kode." },
          ],
        },
        {
          q: "Peran dbt vs Airflow yang tepat adalah…",
          options: [
            { text: "dbt menggantikan Airflow", why: "Keduanya lapisan berbeda, bukan saingan." },
            { text: "Airflow = orkestrasi antar sistem (jadwal, dependensi, alert); dbt = transformasi SQL di dalam warehouse", why: "Praktik umum: task Airflow memanggil \"dbt run\".", correct: true },
            { text: "Keduanya sama persis", why: "Fungsinya berbeda: orkestrasi vs transformasi." },
            { text: "dbt hanya untuk database kecil", why: "dbt dipakai di warehouse enterprise besar." },
          ],
        },
        {
          q: "Data 3 bulan salah hitung karena bug logika. Solusi yang benar?",
          options: [
            { text: "Biarkan saja, nanti juga lewat", why: "Data salah yang dibiarkan meracuni semua keputusan 3 bulan." },
            { text: "Backfill: proses ulang rentang tanggal itu — hanya aman jika job idempoten + partisi tanggal jelas", why: "Backfill adalah mesin waktu pipeline.", correct: true },
            { text: "Hapus semua data", why: "Menghapus bukan memperbaiki; histori ikut hilang." },
            { text: "Tulis ulang manual di Excel", why: "Manual tidak teraudit, tidak terulang, dan tidak skala." },
          ],
        },
        {
          q: "Task sensor menunggu file partisi yang tak kunjung datang. Setelah 6 jam DAG masih \"running\" tanpa alert. Akar masalah dan perbaikan yang tepat?",
          options: [
            { text: "Tambah retry sensor jadi 10 kali", why: "Retry tidak membantu — masalahnya bukan kegagalan sesaat, melainkan penantian tanpa batas." },
            { text: "Sensor tanpa timeout: kegagalan senyap. Perbaikan: wajibkan timeout + alert saat timeout tercapai", why: "Timeout mengubah gantung diam-diam menjadi gagal berisik yang bisa ditangani.", correct: true },
            { text: "Hapus sensornya, langsung jalan saja", why: "Menjalankan tanpa menunggu data = memproses data yang belum lengkap." },
            { text: "Naikkan resource worker", why: "Bukan soal resource — task-nya idle menunggu, bukan kekurangan compute." },
          ],
        },
      ],
    },
  ],
};
