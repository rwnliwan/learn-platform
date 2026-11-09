import type { V2Lesson } from "../lib/types";

// Downtime per tahun untuk tiap "nine" (skala log). 99% -> 3,65 hari; 99,9% -> 8,76 jam;
// 99,99% -> 52,6 menit; 99,999% -> 5,3 menit. Tinggi batang proporsional terhadap log10.
const NINES_SVG = `<svg viewBox="0 0 480 168" role="img" aria-label="Batang downtime per tahun: 99 persen 3,65 hari, 99,9 persen 8,76 jam, 99,99 persen 52,6 menit, 99,999 persen 5,3 menit.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="30" y1="110" x2="450" y2="110"/></g>
<g font-family="var(--font-ui)">
<rect x="48" y="20" width="64" height="90" fill="var(--c4)" opacity="0.85"/>
<rect x="158" y="50" width="64" height="60" fill="var(--c3)" opacity="0.85"/>
<rect x="268" y="80" width="64" height="30" fill="var(--c2)" opacity="0.85"/>
<rect x="378" y="106" width="64" height="4" fill="var(--c1)" opacity="0.9"/>
<text x="80" y="128" text-anchor="middle" font-size="12" fill="var(--chart-text)" font-weight="600">99%</text>
<text x="80" y="144" text-anchor="middle" font-size="11" fill="var(--text-muted)">3,65 hari</text>
<text x="190" y="128" text-anchor="middle" font-size="12" fill="var(--chart-text)" font-weight="600">99,9%</text>
<text x="190" y="144" text-anchor="middle" font-size="11" fill="var(--text-muted)">8,76 jam</text>
<text x="300" y="128" text-anchor="middle" font-size="12" fill="var(--chart-text)" font-weight="600">99,99%</text>
<text x="300" y="144" text-anchor="middle" font-size="11" fill="var(--text-muted)">52,6 mnt</text>
<text x="410" y="128" text-anchor="middle" font-size="12" fill="var(--chart-text)" font-weight="600">99,999%</text>
<text x="410" y="144" text-anchor="middle" font-size="11" fill="var(--text-muted)">5,3 mnt</text>
<text x="240" y="12" text-anchor="middle" font-size="12" fill="var(--text-muted)">Downtime per tahun (skala log)</text>
</g></svg>`;

export const dba1: V2Lesson = {
  slug: "dba1-lanskap",
  track: "Database Administrator",
  module: "Fondasi Operasi",
  title: "DBA1 — DBA di Era Cloud",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-flash-sale",
      eyebrow: "Langkah 1 · Cerita",
      title: "Malam flash sale yang (hampir) sempurna",
      prose: [
        "Pukul 00:00, 11 November. TokoKita — marketplace fiktif dengan 2 juta pengguna — membuka flash sale: 50 ribu unit sneakers diskon 70%. Tim engineering sudah menyiapkan segalanya: server aplikasi di-auto-scale ke 40 instance, CDN hangat, payment gateway standby.",
        "Pukul 00:07, checkout mulai gagal. Pukul 00:09, seluruh aplikasi mati total. Bukan servernya yang down — CPU aplikasi bahkan sepi. Yang mati adalah database: antrean koneksinya meledak dari 80 menjadi 4.200 dalam 90 detik, dan `max_connections` (default 100) menolak sisanya. Recovery 23 menit. Estimasi kerugian: Rp1,8 miliar transaksi yang kabur ke kompetitor.",
        "Twist-nya: database-nya tidak rusak sama sekali. Tidak ada data hilang, tidak ada hardware terbakar. Database hanya melakukan persis apa yang dikonfigurasi untuk dilakukan — menolak koneksi ke-101. Insiden ini bukan kegagalan teknologi, melainkan kegagalan operasi: tidak ada yang pernah menguji konfigurasi database di bawah beban 40x normal.",
        "Orang yang pekerjaannya mencegah malam seperti ini disebut DBA — Database Administrator. Di era cloud, perannya tidak hilang; ia berubah bentuk.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CPindah ke cloud = database anti-downtime\u201D",
        body: "Cloud memberi kemudahan (tombol scale, backup otomatis), bukan jaminan. Cloud tidak tahu berapa max_connections yang kamu butuhkan, tidak tahu query mana yang lambat, dan tidak tahu kapan disk-mu penuh. TokoKita justru sudah di cloud saat insiden itu terjadi. Yang hilang bukan teknologinya — melainkan seseorang yang bertanggung jawab atas perilaku database di bawah tekanan.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan peran DBA modern sebagai insinyur keandalan — bukan sekadar penjaga backup.",
        "(1) Menghitung downtime yang diizinkan dari target 'sembilan' (99,9% vs 99,99% = 10x beda); (2) Menghitung sisa error budget dan menerjemahkannya menjadi kebijakan deploy;",
        "(3) Membedakan tanggung jawab DBA di on-premise vs managed cloud (shared responsibility);",
        "(4) Menjelaskan kenapa 'pindah ke cloud' tidak otomatis berarti 'anti-downtime'.",
      ],
      tasks: [],
    },

    {
      id: "peran-dba",
      eyebrow: "Langkah 3 · Peran",
      title: "DBA modern: dari penjaga backup ke insinyur keandalan",
      prose: [
        "DBA klasik tahun 2000-an: install database, buat user, jadwalkan backup, pulang. DBA modern tahun 2026: merancang agar database selamat dari flash sale, serangan, human error, dan pertumbuhan 10x — lalu membuktikan lewat angka bahwa ia memang selamat.",
        "Empat pilar kerja DBA modern. Pertama, **Operate**: instalasi, konfigurasi, upgrade, dan rutinitas harian (DBA2–DBA3). Kedua, **Protect**: backup yang bisa di-restore, replikasi, keamanan (DBA4, DBA5, DBA7). Ketiga, **Perform**: indexing, query plan, tuning (DBA6). Keempat, **Plan**: monitoring, capacity planning, dan keputusan build-vs-buy di cloud (DBA8–DBA11).",
        "💡 Intuisi: database jarang mati karena hardware. Ia mati karena konfigurasi default yang tidak pernah diubah, query yang tidak pernah diuji di beban puncak, backup yang tidak pernah dicoba di-restore, dan disk yang tidak ada yang memantau. Keempatnya adalah masalah operasi — wilayah DBA.",
        "Untuk analis risiko/data/AI, memahami DBA penting karena dua alasan praktis: (1) model dan dashboard-mu hanya sebagus database di belakangnya — downtime database = downtime keputusan; (2) peran \u201Cdata engineer + DBA lite\u201D makin menyatu di tim kecil, dan perusahaan membayar mahal orang yang bisa keduanya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CDBA sudah mati, sekarang zamannya managed database\u201D",
        body: "Managed database (RDS, Cloud SQL) mengotomasi instalasi dan backup dasar — tetapi seseorang tetap harus memilih ukuran instance, mengatur parameter, membaca query plan yang lambat, merancang indeks, dan memutuskan kapan scale. Vendor cloud menyebutnya \u201Cshared responsibility\u201D: mereka menjaga mesinnya, kamu menjaga perilakunya. DBA tidak mati; job description-nya naik kelas.",
        type: "pitfall",
      },
    },
    {
      id: "sla-slo",
      eyebrow: "Langkah 4 · Angka keandalan",
      title: "Sembilan di belakang koma: bahasa keandalan",
      prose: [
        "DBA tidak berkata \u201Cdatabase-nya lumayan stabil\u201D. Ia berkata \u201C99,95%\u201D — dan semua orang di ruangan itu langsung tahu artinya: boleh down 21,9 menit per bulan. Inilah bahasa keandalan: mengubah rasa menjadi angka yang bisa diuji.",
        "Rumusnya sederhana. Downtime yang diizinkan per tahun = (1 − uptime) × 525.600 menit (jumlah menit dalam setahun). Setiap tambahan satu angka 9 di belakang koma memangkas downtime 10x lipat — tetapi biayanya naik jauh lebih dari 10x. Itulah kenapa memilih target SLA adalah keputusan bisnis, bukan teknis.",
        "Cara membaca grafik di bawah: sumbu horizontal adalah target uptime, tinggi batang adalah downtime yang masih \u201Cdiperbolehkan\u201D per tahun (skala logaritmik). Interpretasi: lompat dari 99% ke 99,9% memangkas downtime dari 3,65 hari menjadi 8,76 jam — perbaikan terbesar dengan biaya termurah. Lompat ke 99,999% hanya menghemat 47 menit tambahan per tahun, tetapi butuh arsitektur multi-region. Tanya ke bisnis: apakah 47 menit itu worth puluhan ribu dolar?",
        "💡 Intuisi: SLA tanpa konsekuensi hanyalah angan-angan. SLA yang serius selalu ditemani SLO (target internal, mis. 99,95%) dan error budget: \u201Ckita boleh down 21,9 menit/bulan; kalau budget habis, semua deploy fitur berhenti sampai keandalan pulih.\u201D Tanpa error budget, angka 99,9% tidak mengubah perilaku siapa pun.",
      ],
      formula: String.raw`\text{downtime/tahun} = (1 - \text{uptime}) \times 525.600\ \text{menit}`,
      formulaNote: "uptime = fraksi waktu layanan tersedia (mis. 0,999 untuk 99,9%). 525.600 = 365 hari × 24 jam × 60 menit. Hasilnya dalam menit per tahun — angka ini yang dinegosiasikan dengan bisnis.",
      figure: {
        svg: NINES_SVG,
        alt: "Batang downtime per tahun: 99% = 3,65 hari, 99,9% = 8,76 jam, 99,99% = 52,6 menit, 99,999% = 5,3 menit.",
        caption: "Downtime yang diizinkan per tahun untuk tiap target uptime. Satu angka 9 tambahan = downtime 10x lebih kecil.",
      },
      tasks: [
        { id: "t1", text: "Hitung `downtime_999` (menit/tahun) untuk uptime 99,9%" },
        { id: "t2", text: "Hitung `downtime_9999` (menit/tahun) untuk uptime 99,99%" },
        { id: "t3", text: "Hitung `rasio` = downtime_999 / downtime_9999" },
      ],
      expected: "downtime_999=525.6  downtime_9999=52.56  rasio=10.0",
      note: {
        title: "Sering salah",
        body: "Mengira beda 99% dan 99,9% itu \u201Ccuma 0,9%\u201D. Dalam downtime, bedanya 10x lipat: 3,65 hari vs 8,76 jam per tahun. Persentase menipu; selalu konversi ke menit.",
      },
      hints: [
        "Menit dalam setahun = 365 * 24 * 60.",
        "downtime = (1 - uptime) * menit_setahun.",
        "downtime_999 = (1 - 0.999) * 365 * 24 * 60",
      ],
      code: {
        starter: `# Kalkulator error budget DBA\n# Baris ini disiapkan (jangan diubah)\nmenit_setahun = 365 * 24 * 60\n\n# TULIS KODEMU: downtime (menit/tahun) untuk tiap target\nuptime_999 = 0.999\ndowntime_999 = \n\nuptime_9999 = 0.9999\ndowntime_9999 = \n\nrasio = \n\nprint(f"downtime_999={downtime_999:.1f}  downtime_9999={downtime_9999:.2f}  rasio={rasio:.1f}")`,
        lockLines: 3,
        solution: `# Kalkulator error budget DBA\n# Baris ini disiapkan (jangan diubah)\nmenit_setahun = 365 * 24 * 60\n\n# TULIS KODEMU: downtime (menit/tahun) untuk tiap target\nuptime_999 = 0.999\ndowntime_999 = (1 - uptime_999) * menit_setahun\n\nuptime_9999 = 0.9999\ndowntime_9999 = (1 - uptime_9999) * menit_setahun\n\nrasio = downtime_999 / downtime_9999\n\nprint(f"downtime_999={downtime_999:.1f}  downtime_9999={downtime_9999:.2f}  rasio={rasio:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "downtime_999", value: 525.6, tol: 0.01, label: "`downtime_999` = 525,6 menit", msg: "(1 - 0.999) * 525600 = 525,6. Cek rumusnya." },
          { kind: "equal", task: "t2", name: "downtime_9999", value: 52.56, tol: 0.01, label: "`downtime_9999` = 52,56 menit", msg: "(1 - 0.9999) * 525600 = 52,56." },
          { kind: "equal", task: "t3", name: "rasio", value: 10.0, tol: 0.01, label: "`rasio` = 10,0", msg: "525,6 / 52,56 = 10. Satu nine tambahan = 10x lebih ketat." },
          { kind: "stdout_matches", task: "t3", pattern: "downtime_999=525\\.6\\s+downtime_9999=52\\.56\\s+rasio=10\\.0", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "menit_setahun = 365*24*60. downtime = (1-uptime)*menit_setahun.",
    },    {
      id: "lab2-error-budget",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: sisa error budget bulan ini",
      prose: [
        "SLO 99,9% bukan 'target muluk' — ia anggaran: 43,2 menit downtime per bulan. Tiga insiden sudah terjadi. Tugasmu: hitung berapa menit tersisa dan berapa persennya — lalu putuskan: bolehkah deploy berisiko minggu ini?",
        "Hasilnya: sisa NEGATIF (−1,8 menit) — budget jebol. Aturan SRE: fitur dibekukan sampai bulan baru, hanya perbaikan keandalan yang boleh jalan. Angka ini mengubah debat 'deploy atau tidak' dari opini menjadi akuntansi.",
        "Coba juga: insiden ketiga 28 menit — andai 45 menit, apa keputusanmu? Satu angka mengubah kebijakan seluruh tim.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `budget_mnt`: 0,1% dari menit sebulan (2 desimal), lalu cetak dengan print" },
        { id: "t2", text: "Hitung `terpakai` dan `sisa` (2 desimal)" },
        { id: "t3", text: "Hitung `sisa_pct`: % budget tersisa (1 desimal)" },
      ],
      expected: "budget_mnt=43.2  terpakai=45",
      note: {
        title: "Sering salah",
        body: "Menghitung 0,1% dari 30 hari sebagai 0,03 hari lalu bingung konversi. Kerja dalam menit dari awal: 43.200 × 0,001 = 43,2 menit.",
      },
      hints: [
        "MENIT_SEBULAN = 30*24*60; budget = MENIT_SEBULAN * 0.001.",
        "sisa = budget_mnt - sum(insiden).",
        "sisa_pct = sisa / budget_mnt * 100.",
      ],
      code: {
        starter: `# SLO 99,9% per bulan 30 hari. Insiden bulan ini (menit downtime):\ninsiden = [12, 5, 28]  # tiga insiden\nMENIT_SEBULAN = 30 * 24 * 60\n# TULIS KODEMU: budget_mnt, terpakai, sisa, sisa_pct\nbudget_mnt = 0.0\nterpakai = 0\nsisa = 0.0\nsisa_pct = 0.0\n`,
        lockLines: 3,
        solution: `# SLO 99,9% per bulan 30 hari. Insiden bulan ini (menit downtime):\ninsiden = [12, 5, 28]  # tiga insiden\nMENIT_SEBULAN = 30 * 24 * 60\n\n# TULIS KODEMU: budget_mnt, terpakai, sisa, sisa_pct\nbudget_mnt = round(MENIT_SEBULAN * (1 - 0.999), 2)\nterpakai = sum(insiden)\nsisa = round(budget_mnt - terpakai, 2)\nsisa_pct = round(sisa / budget_mnt * 100, 1)\n\nprint(f"budget_mnt={budget_mnt}  terpakai={terpakai}")\nprint(f"sisa={sisa}  sisa_pct={sisa_pct}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "budget_mnt", value: 43.2, tol: 0.01, label: "`budget_mnt` = 43,2", msg: "0,1% dari 43.200 menit." },
          { kind: "equal", task: "t2", name: "terpakai", value: 45, label: "`terpakai` = 45", msg: "12+5+28." },
          { kind: "equal", task: "t2", name: "sisa", value: -1.8, tol: 0.01, label: "`sisa` = −1,8", msg: "Budget jebol: 43,2 − 45." },
          { kind: "stdout_matches", task: "t3", pattern: "sisa_pct=-4\\.2", label: "`sisa_pct` = −4,2", msg: "Persen sisa budget." },
        ],
      },
      reference: "Error budget SRE: (1 − SLO) × periode = jatah kegagalan.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 SLO adalah janji bisnis, bukan angka teknis. '99,9%' tidak berarti apa-apa sampai diterjemahkan: 43 menit/bulan. Selalu terjemahkan nine ke menit — di situlah keputusan dibuat.",
      ],
      tasks: [],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: seberapa serius operasimu harus?",
      prose: [
        "Tidak semua database butuh DBA penuh waktu. Empat skenario di bawah membantumu memutuskan level operasi yang wajar — over-engineering sama borosnya dengan under-engineering.",
        "Skenario 1 — Blog pribadi / side project, 500 visitor/hari. → Managed database tier terkecil + backup harian otomatis. Alasan: biaya downtime-mu mendekati nol; jangan bayar keandalan yang tidak kamu butuhkan. Aturan praktis: kalau down 1 jam tidak ada yang komplain, tier termurah cukup.",
        "Skenario 2 — SaaS B2B dengan 200 pelanggan membayar, SLA kontrak 99,9%. → Managed database + read replica + backup teruji restore + monitoring koneksi & disk. Alasan: downtime 8,76 jam/tahun adalah batas kontrak; satu pelanggaran = penalti atau churn. Replica memberi jalan keluar saat primary bermasalah.",
        "Skenario 3 — Fintech/payment, regulator mengawasi, target 99,99%. → Multi-AZ / multi-region, RPO mendekati nol (replikasi sinkron), backup terenkripsi dengan uji restore berkala, DBA atau tim platform khusus. Alasan: 52,6 menit/tahun tidak bisa dicapai dengan satu server di satu gedung, apa pun mereknya.",
        "Skenario 4 — Kamu analis data yang query-nya makin berat dan sering dikomplain \u201Cdashboard lemot\u201D. → Pelajari DBA lite: indexing, query plan, dan capacity dasar (DBA6 + DBA9 track ini). Alasan: 80% keluhan performa data diselesaikan dengan indeks yang tepat, bukan server baru.",
        "Aturan praktis 10 detik: (1) Ada SLA kontrak? → minimal skenario 2. (2) Uang pelanggan bergerak? → skenario 3. (3) Tidak ada keduanya? → skenario 1, dan investasikan waktumu di skenario 4.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: warung kopi vs unicorn",
      prose: [
        "Dua perusahaan, dua keputusan operasi. KopiNusa: 30 gerai, aplikasi kasir + loyalty, database 40 GB, omzet Rp900 juta/bulan. Andai kasir down 1 jam di jam sibuk, kerugian ≈ Rp3 juta + antrean komplain. UnicornPay: payment gateway, 12 juta transaksi/hari, database 8 TB, downtime 1 jam = Rp4,2 miliar + risiko sanksi regulator.",
        "KopiNusa memilih: managed database 1 instance (Rp1,2 juta/bulan), backup harian otomatis, alert disk 80%. Total biaya operasi ≈ Rp1,5 juta/bulan. UnicornPay memilih: cluster multi-AZ 3 node + 2 read replica (Rp180 juta/bulan), replikasi sinkron, tim DBA 3 orang, uji failover tiap kuartal. Total ≈ Rp380 juta/bulan.",
        "Pertanyaan analisis: apakah KopiNusa \u201Cpelit\u201D dan UnicornPay \u201Cboros\u201D? Hitung: biaya operasi KopiNusa per bulan (Rp1,5 juta) vs ekspektasi rugi downtime-nya — dengan 99,5% uptime (~3,65 jam/bulan) × Rp3 juta/jam ≈ Rp11 juta/bulan ekspektasi rugi. Hmm, bukankah itu berarti mereka under-invest?",
        "Pembahasan: hitung ulang dengan benar. Managed database modern umumnya memberi ~99,95% (≈21,9 menit/bulan), bukan 99,5%. Ekspektasi rugi = 0,365 jam × Rp3 juta ≈ Rp1,1 juta/bulan — di bawah biaya operasinya (Rp1,5 juta). Keputusan KopiNusa rasional: menaikkan ke arsitektur Rp20 juta/bulan untuk menghemat Rp1 juta/bulan adalah boros. Sebaliknya UnicornPay: 21,9 menit/bulan × Rp4,2 miliar/jam ≈ Rp1,5 miliar/bulan ekspektasi rugi — maka Rp380 juta/bulan untuk menekan ke 99,99% (≈Rp150 juta/bulan ekspektasi rugi) adalah investasi, bukan biaya. Pelajaran: level operasi yang benar = fungsi dari biaya downtime-mu, bukan gengsi arsitektur.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: keandalan adalah produk yang dibeli",
        body: "Setiap \u201Cnine\u201D punya harga. DBA yang baik tidak memaksimalkan nine — ia menyamakan marginal cost keandalan dengan marginal cost downtime. Itu sebabnya dua perusahaan waras bisa memilih arsitektur yang sangat berbeda.",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi menjelaskan alasannya — baca semuanya meski kamu yakin dengan jawabanmu.",
      ],
      tasks: [],
      summary: [
        "DBA modern = insinyur keandalan data: operate, protect, perform, plan — cloud tidak menghapus peran ini, hanya menaikkan levelnya.",
        "Insiden terbesar biasanya kegagalan operasi (konfigurasi, beban tak teruji), bukan kegagalan hardware.",
        "Downtime/tahun = (1 − uptime) × 525.600 menit; satu nine tambahan = 10x lebih ketat dengan biaya jauh lebih mahal.",
        "SLA butuh SLO + error budget agar angkanya mengubah perilaku, bukan sekadar pajangan.",
        "Level operasi yang tepat ditentukan oleh biaya downtime-mu, bukan oleh tren arsitektur.",
      ],
      next: { label: "DBA2 — Arsitektur Database", href: "/v2/learn/dba2-arsitektur" },
      quiz: [
        {
          q: "TokoKita down 23 menit saat flash sale padahal database-nya sehat dan tidak ada data hilang. Akar masalah paling tepat?",
          options: [
            { text: "Hardware server tidak kuat", why: "CPU aplikasi justru sepi; hardware bukan penyebabnya." },
            { text: "Kegagalan operasi: max_connections default tak pernah diuji di beban 40x", why: "Database hanya menjalankan konfigurasinya — menolak koneksi ke-101. Tidak ada yang menguji perilaku di bawah tekanan.", correct: true },
            { text: "Serangan DDoS", why: "Tidak ada bukti serangan; traffic-nya legitimate dari flash sale." },
            { text: "Cloud provider-nya down", why: "Provider sehat; yang jenuh adalah antrean koneksi database milik TokoKita sendiri." },
          ],
        },
        {
          q: "Kontrak SLA 99,9% per bulan. Berapa downtime maksimum yang diizinkan per bulan?",
          options: [
            { text: "43,2 menit", why: "0,001 × 43.200 menit/bulan = 43,2 menit. Tepat.", correct: true },
            { text: "8,76 jam", why: "Itu angka per tahun, bukan per bulan." },
            { text: "52,6 menit", why: "Itu untuk 99,99% per tahun." },
            { text: "7,2 jam", why: "Tidak cocok dengan perhitungan (1−0,999) × menit per bulan." },
          ],
        },
        {
          q: "Mana pernyataan yang benar tentang DBA di era managed database?",
          options: [
            { text: "DBA tidak lagi dibutuhkan", why: "Shared responsibility: vendor jaga mesin, kamu jaga perilaku — parameter, indeks, query plan tetap butuh manusia." },
            { text: "DBA tetap dibutuhkan untuk perilaku database: tuning, indeks, capacity, query plan", why: "Managed service mengotomasi instalasi/backup dasar, bukan keputusan operasional. Inilah inti shared responsibility.", correct: true },
            { text: "DBA hanya dibutuhkan untuk install awal", why: "Install adalah bagian terkecil; operasi harian (day-2) jauh lebih besar." },
            { text: "Managed database otomatis anti-downtime", why: "Mitos DBA1: cloud memberi kemudahan, bukan jaminan." },
          ],
        },
        {
          q: "Perusahaan A rugi Rp10 juta/jam downtime; perusahaan B rugi Rp10 miliar/jam. Keduanya memakai arsitektur yang sama persis. Mana yang paling tepat?",
          options: [
            { text: "Keduanya sudah benar karena konsisten", why: "Konsistensi bukan metriknya; biaya downtime yang menentukan level operasi yang rasional." },
            { text: "Salah satu pasti boros atau kurang — level operasi harus sebanding dengan biaya downtime masing-masing", why: "Keandalan adalah produk yang dibeli; nine yang tepat = fungsi biaya downtime. Arsitektur identik untuk risiko berbeda hampir pasti salah satu tidak optimal.", correct: true },
            { text: "Perusahaan A harus meniru B agar aman", why: "Meniru arsitektur Rp380 juta/bulan untuk risiko Rp10 juta/jam adalah pemborosan." },
            { text: "Perusahaan B harus meniru A agar hemat", why: "Menghemat operasi saat downtime Rp10 miliar/jam adalah penghematan yang mahal." },
          ],
        },
        {
          q: "Apa fungsi error budget dalam praktik SLA?",
          options: [
            { text: "Dana cadangan untuk membayar denda SLA", why: "Error budget diukur dalam menit downtime, bukan rupiah." },
            { text: "Batas downtime yang bila habis menghentikan deploy fitur sampai keandalan pulih", why: "Inilah yang membuat angka SLA mengubah perilaku tim: keandalan punya harga yang dibayar dengan velocity fitur.", correct: true },
            { text: "Anggaran lembur tim DBA", why: "Tidak ada kaitannya dengan anggaran personalia." },
            { text: "Toleransi bug di aplikasi", why: "Error budget spesifik untuk keandalan layanan (downtime/latensi), bukan bug fungsional umum." },
          ],
        },
        {
          q: "SLO 99,9% tercapai 11 bulan, jebol di Desember (downtime 90 menit). Bonus tim infra dipotong. Adil?",
          options: [
            { text: "Adil — SLO jebol ya jebol", why: "SLO adalah anggaran, bukan target muluk: 43,2 menit/bulan. Jebol 90 menit = memakai 2 bulan budget sekaligus. Konsekuensi adalah cara organisasi menghargai keandalan — adil jika aturannya disepakati di awal.", correct: true },
            { text: "Tidak adil — 11 bulan bagus harusnya menutupi", why: "Error budget tidak bisa ditabung antar bulan (kecuali disepakati): tiap bulan punya jatahnya. 'Menutupi' = meminjam keandalan masa depan." },
            { text: "Naikkan SLO jadi 99,99% agar aman", why: "Menaikkan SLO justru MEMPERKECIL budget (4,3 menit/bulan) — semakin mudah jebol. SLO bukan mantra." },
            { text: "Hapus SLO-nya", why: "Menghapus pengukur tidak menghapus downtime — hanya menghapus akuntabilitasnya." },
          ],
        },
      ],
    },
  ],
};
