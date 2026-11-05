import type { V2Lesson } from "../lib/types";

// Proyeksi linear: 400 GB + 2,5 GB/hari -> 85% (850 GB) dalam ~120 hari.
const GROWTH_SVG = `<svg viewBox="0 0 480 180" role="img" aria-label="Grafik pertumbuhan disk: data 60 hari naik linear, proyeksi menyentuh 85 persen dalam 120 hari.">
<g font-family="var(--font-ui)">
<line x1="30" y1="150" x2="450" y2="150" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="30" y1="52" x2="450" y2="52" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="444" y="46" text-anchor="end" font-size="11" fill="var(--c4)" font-weight="600">85% (850 GB) — batas aksi</text>
<polyline points="40,128 90,122 140,116 190,110 240,104 290,98" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="290" y1="98" x2="430" y2="58" stroke="var(--c1)" stroke-width="2" stroke-dasharray="7,5"/>
<circle cx="290" cy="98" r="4" fill="var(--c1)"/>
<text x="165" y="140" text-anchor="middle" font-size="11" fill="var(--text-muted)">data 60 hari: +2,5 GB/hari</text>
<text x="365" y="80" text-anchor="middle" font-size="11" fill="var(--text-muted)">proyeksi: penuh dalam ±120 hari</text>
<text x="240" y="170" text-anchor="middle" font-size="11" fill="var(--text-muted)">Waktu → · pesan disk 1 TB sekarang, bukan saat 99%</text>
</g></svg>`;

export const dba9: V2Lesson = {
  slug: "dba9-kapasitas",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA9 — Capacity Planning",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-disk-penuh",
      eyebrow: "Langkah 1 · Cerita",
      title: "Disk penuh jam 2 pagi — yang terlihat 4 bulan sebelumnya",
      prose: [
        "Minggu 02:07, database HealthTrack berhenti: disk 100%. Tim begadang migrasi darurat ke disk lebih besar — 5 jam downtime, data pasien tertunda. Senin pagi, seorang analis junior membuka grafik 6 bulan dan berkata pelan: \u201CKalau ditarik garis lurus dari Januari… ini terlihat sejak Maret.\u201D",
        "Twist-nya: tidak ada yang salah dengan monitoring — grafiknya ada, datanya akurat. Yang tidak ada adalah seseorang yang menarik garis lurus ke depan dan bertanya \u201Ckapan menyentuh 85%?\u201D. Capacity planning bukan alat canggih; ia adalah kebiasaan melihat ke depan dengan aritmetika SMP: laju × waktu.",
        "Biaya keterlambatan: disk darurat tengah malam = 5 jam downtime + migrasi panik. Biaya ketepatan: pesan disk 3 bulan sebelumnya = 0 downtime, harga normal, migrasi terjadwal. Selisihnya bukan teknologi — melainkan satu spreadsheet proyeksi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CKapasitas = beli yang besar sekalian, beres\u201D",
        body: "Over-provisioning 10x adalah pemborosan yang nyata (bayar 10x tiap bulan selamanya) dan menutupi masalah (query boros tak terdeteksi karena \u201Cserver besar\u201D). Kapasitas yang benar = cukup + headroom + proyeksi — bukan sebesar-besarnya.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa melakukan capacity planning yang memperhitungkan musiman.",
        "(1) Menghitung laju pertumbuhan dari histori (regresi/slope) dan menerjemahkannya ke 'sisa berapa hari';",
        "(2) Mengidentifikasi pola musiman (lonjakan kuartalan) agar estimasi tidak meleset;",
        "(3) Menjelaskan kenapa kapasitas yang 'cukup 4 bulan' bisa habis dalam 3 bulan;",
        "(4) Menerjemahkan 'trafik naik 3x' menjadi 'beli disk berapa GB' dengan angka.",
      ],
      tasks: [],
    },

    {
      id: "proyeksi",
      eyebrow: "Langkah 3 · Proyeksi",
      title: "Menarik garis ke depan: regresi untuk DBA",
      prose: [
        "Model paling berguna di capacity planning adalah yang paling sederhana: garis lurus. Ambil pemakaian harian 60–90 hari, hitung laju (slope) dengan regresi linear, lalu proyeksikan: hari_menuju_batas = (batas − pemakaian_sekarang) / laju. Batas aksi = 85%, bukan 100% — 15% terakhir adalah runway untuk pesan, migrasi, dan kejutan.",
        "Cara membaca grafik: garis tebal = data 60 hari (400 → 547 GB, +2,5 GB/hari); garis putus-putus = proyeksi; garis merah = 85% (850 GB dari 1 TB). Interpretasi: proyeksi menyentuh merah dalam ±120 hari — artinya pesan/upgrade harus dimulai sekarang jika lead time pengadaan 30–60 hari. Keputusan \u201Ckapan\u201D menjadi aritmetika, bukan firasat.",
        "💡 Intuisi: proyeksi linear meremehkan pertumbuhan eksponensial dan musiman — tetapi untuk horizon 3–6 bulan ia cukup akurat dan jauh lebih baik daripada tidak ada proyeksi. Kesalahan terbesar bukan model yang salah, melainkan tidak pernah menghitung sama sekali.",
      ],
      formula: String.raw`\text{hari tersisa} = \frac{\text{batas} - \text{pakai sekarang}}{\text{laju harian}}`,
      formulaNote: "batas = 85% kapasitas (bukan 100%). laju harian = slope regresi linear dari data historis. Hasil dalam hari — kalender aksi DBA.",
      figure: {
        svg: GROWTH_SVG,
        alt: "Grafik pertumbuhan disk linear menyentuh batas 85 persen dalam 120 hari.",
        caption: "Data 60 hari + proyeksi linear. Batas aksi 85% memberi runway 120 hari.",
      },
      tasks: [],
    },
    {
      id: "scale-up-out",
      eyebrow: "Langkah 4 · Skala",
      title: "Scale up vs scale out: dua arah yang berbeda",
      prose: [
        "**Scale up (vertical)** — Si Raksasa. Server lebih besar: CPU/RAM/disk naik. Kepribadiannya: sederhana (tidak ubah aplikasi), tetapi ada plafon (server termahal pun ada batasnya) dan single point of failure tetap satu. Cocok untuk: database < 2 TB, tim kecil, beban tumbuh moderat.",
        "**Scale out (horizontal)** — Si Keroyokan. Beban dibagi: read replica untuk baca (DBA5), sharding untuk tulis dibagi-bagi. Kepribadiannya: plafon hampir tak terbatas, tetapi kompleksitas meledak — konsistensi lintas shard, query yang menyentuh banyak shard, rebalancing. Cocok untuk: beban baca >> tulis (replica dulu!), atau data > batas satu server.",
        "Urutan dewasa: (1) optimasi dulu (indeks, query — DBA6; sering menunda scale 1–2 tahun); (2) scale up (murah, cepat); (3) read replica untuk beban baca; (4) sharding sebagai pilihan terakhir. 💡 Intuisi: sharding adalah pernikahan — mudah masuk, sangat mahal keluar. Jangan sharding karena \u201Ckelihatan keren\u201D; sharding karena aritmetika memaksamu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CDatabase besar harus di-shard\u201D",
        body: "Banyak database 5–10 TB berjalan bahagia di satu server besar + replica. Sharding menambah kompleksitas operasional 10x (backup per shard, query lintas shard, reshard). Aturannya: shard saat SATU server terbesar yang masuk akal sudah tidak cukup — bukan sebelumnya.",
        type: "pitfall",
      },
    },
    {
      id: "lab-proyeksi",
      eyebrow: "Langkah 5 · Lab simulasi",
      title: "Lab: kapan disk-mu penuh?",
      prose: [
        "Data: 60 hari pemakaian disk (GB), mulai ~400 GB, tumbuh ~2,5 GB/hari + noise. Kapasitas 1 TB, batas aksi 85% = 850 GB. Tugasmu: hitung slope & intercept regresi linear (rumus least squares), lalu hitung sisa hari hingga 85% dari hari terakhir data.",
        "Interpretasi: ±120 hari = 4 bulan runway. Jika lead time tambah disk 2 minggu, kamu aman — tetapi jika itu berarti migrasi antar data center (lead time 3 bulan), kamu sudah harus mulai minggu ini. Angka mengubah \u201Cnanti saja\u201D menjadi tanggal di kalender.",
        "Coba eksplorasi: ubah laju menjadi 2x (mis. kalikan slope manual) — berapa runway-mu? Inilah cara DBA menjawab \u201Cbagaimana jika traffic naik 2x setelah launching fitur baru?\u201D: bukan dengan panik, melainkan dengan mengalikan satu angka.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `slope` regresi (GB/hari, 3 desimal)" },
        { id: "t2", text: "Hitung `sisa_hari` hingga 850 GB dari hari terakhir (1 desimal)" },
      ],
      expected: "slope=2.516  sisa_hari=120.0",
      note: {
        title: "Sering salah",
        body: "Menghitung sisa hari dari hari ke-0, bukan dari hari terakhir data (hari ke-59). Proyeksi selalu dihitung dari posisi TERKINI: (target − intercept)/slope − (n−1).",
      },
      hints: [
        "slope = (n*sxy − sx*sy) / (n*sxx − sx*sx).",
        "intercept = (sy − slope*sx) / n.",
        "sisa_hari = (850 − intercept)/slope − 59.",
      ],
      code: {
        starter: `import random\nrandom.seed(21)  # data 60 hari tetap\n\ndays = list(range(60))\nusage = [round(400 + 2.5*d + random.uniform(-3, 3), 1) for d in days]\n\nn = len(days)\nsx, sy = sum(days), sum(usage)\nsxx = sum(d*d for d in days)\nsxy = sum(d*u for d, u in zip(days, usage))\n\n# TULIS KODEMU: slope, intercept, sisa hari hingga 850 GB\nslope = \nintercept = \nsisa_hari = \n\nprint(f"slope={slope:.3f}  sisa_hari={sisa_hari:.1f}")`,
        lockLines: 9,
        solution: `import random\nrandom.seed(21)  # data 60 hari tetap\n\ndays = list(range(60))\nusage = [round(400 + 2.5*d + random.uniform(-3, 3), 1) for d in days]\n\nn = len(days)\nsx, sy = sum(days), sum(usage)\nsxx = sum(d*d for d in days)\nsxy = sum(d*u for d, u in zip(days, usage))\n\n# TULIS KODEMU: slope, intercept, sisa hari hingga 850 GB\nslope = (n*sxy - sx*sy) / (n*sxx - sx*sx)\nintercept = (sy - slope*sx) / n\nsisa_hari = (850 - intercept) / slope - (n - 1)\n\nprint(f"slope={slope:.3f}  sisa_hari={sisa_hari:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "slope", value: 2.516, tol: 0.01, label: "`slope` ≈ 2,516 GB/hari", msg: "Rumus least squares dengan seed 21." },
          { kind: "equal", task: "t2", name: "sisa_hari", value: 120.0, tol: 0.5, label: "`sisa_hari` ≈ 120,0 hari", msg: "(850 − intercept)/slope − 59. Dari hari TERAKHIR." },
          { kind: "stdout_matches", task: "t2", pattern: "slope=2\\.516\\s+sisa_hari=120\\.0", label: "`print` menampilkan keduanya", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "slope=(n·sxy−sx·sy)/(n·sxx−sx²). Proyeksi dari hari terakhir.",
    },    {
      id: "lab2-ramalan-musiman",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: ramalan kapasitas bermusim",
      prose: [
        "Rata-rata pertumbuhan 53 GB/bulan — tetapi tiap kuartal melonjak ke ~70 GB (tutup buku). Tugasmu: hitung rata-rata, identifikasi bulan lonjakan, dan estimasi sisa bulan hingga 850 GB penuh.",
        "Lab 1 memakai regresi linear; lab ini menambahkan mata musiman: rata-rata saja meremehkan bulan kuartal. Kapasitas yang 'cukup 4,3 bulan' bisa habis dalam 3 bulan jika kuartal tiba lebih dulu.",
        "Coba juga: jika lonjakan kuartal tumbuh 10% per kuartal (68→70→71...), kapan perkiraanmu meleset? Model sederhana + asumsi eksplisit > model rumit yang tidak dipahami siapa pun.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata2` pertumbuhan (1 desimal)" },
        { id: "t2", text: "Isi `bulan_kuartal`: bulan dengan growth > 60" },
        { id: "t3", text: "Hitung `sisa_bulan` hingga penuh (1 desimal)" },
      ],
      expected: "rata2=53.0  bulan_kuartal=[3, 6, 9, 12]",
      note: {
        title: "Sering salah",
        body: "Memakai growth bulan TERAKHIR (71) sebagai laju — estimasi jadi terlalu pesimistis. Rata-rata 12 bulan + kesadaran musiman = estimasi yang jujur.",
      },
      hints: [
        "rata2 = sum(GROWTH)/len(GROWTH).",
        "bulan_kuartal = [i+1 for i,g in enumerate(GROWTH) if g > 60].",
        "sisa_bulan = (850-620) / rata2.",
      ],
      code: {
        starter: `# Pertumbuhan GB per bulan 12 bulan terakhir (musiman: lonjakan tiap kuartal)\nGROWTH = [42, 45, 68, 44, 46, 70, 43, 47, 69, 45, 46, 71]\nKAPASITAS, TERPAKAI = 850, 620  # GB\n# TULIS KODEMU: rata2, bulan_kuartal, sisa_bulan\nrata2 = 0.0\nbulan_kuartal = []\nsisa_bulan = 0.0\n`,
        lockLines: 3,
        solution: `# Pertumbuhan GB per bulan 12 bulan terakhir (musiman: lonjakan tiap kuartal)\nGROWTH = [42, 45, 68, 44, 46, 70, 43, 47, 69, 45, 46, 71]\nKAPASITAS, TERPAKAI = 850, 620  # GB\n\n# TULIS KODEMU: rata2, bulan_kuartal, sisa_bulan\nrata2 = round(sum(GROWTH) / len(GROWTH), 1)\nbulan_kuartal = [i + 1 for i, g in enumerate(GROWTH) if g > 60]\nsisa_gb = KAPASITAS - TERPAKAI\nsisa_bulan = round(sisa_gb / rata2, 1)\n\nprint(f"rata2={rata2}  bulan_kuartal={bulan_kuartal}")\nprint(f"sisa_bulan={sisa_bulan}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "rata2", value: 53.0, tol: 0.05, label: "`rata2` = 53,0", msg: "Rata-rata 12 bulan." },
          { kind: "equal", task: "t2", name: "bulan_kuartal", value: [3, 6, 9, 12], label: "`bulan_kuartal` benar", msg: "Bulan dengan growth > 60." },
          { kind: "equal", task: "t3", name: "sisa_bulan", value: 4.3, tol: 0.05, label: "`sisa_bulan` = 4,3", msg: "(850−620)/53." },
        ],
      },
      reference: "Capacity forecast: run-rate rata-rata + penanda musiman.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Capacity planning adalah tentang KAPAN membeli, bukan APA yang dibeli. Estimasi 'habis 4,3 bulan lagi' + lead time pengadaan 6 minggu = pesan SEKARANG, bukan 4 bulan lagi.",
        "💡 Selalu tampilkan asumsi di samping angka: '4,3 bulan JIKA growth 53 GB/bulan dan tidak ada lonjakan kuartal'. Angka tanpa asumsi = kebohongan yang rapi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: gigabyte termurah adalah yang tidak perlu dibeli",
        body: "Sebelum membeli satu gigabyte pun, tanyakan dulu: gigabyte apa yang bisa PERGI? Gigabyte termurah adalah yang tidak perlu dibeli — dan di hampir setiap database yang pernah kulihat, 30–60% data adalah kandidat arsip yang tidak pernah ditanya siapa pun. Heuristik praktisinya: setiap review kapasitas dimulai dari kebijakan retensi, bukan dari katalog hardware. \"Data transaksi 3 tahun\" — tetapi 90% query hanya menyentuh 90 hari terakhir. Arsipkan 33 bulan sisanya ke storage dingin: kamu baru saja \"membeli\" 2,7 tahun headroom dengan harga nol. Aturan keduanya: kompresi dan arsip untuk data dingin SEBELUM scale-up. Tabel log 2 TB yang dikompresi jadi 400 GB = 5× headroom tanpa belanja. Jebakan klasiknya adalah \"beli dulu, bereskan nanti\" — server baru datang, data sampah ikut pindah, 18 bulan kemudian beli lagi. Itu bukan capacity planning; itu langganan. Uji kejujurannya: tunjukkan 10 tabel terbesar + tanggal terakhir tiap tabel di-query. Tabel 800 GB yang terakhir dibaca 14 bulan lalu bukan \"data penting\" — itu penghuni liar yang membayar sewa termahal (storage + backup + replikasi). Kebijakan retensi yang tertulis (\"data X disimpan Y bulan, lalu diarsip atau dihapus\") mengubah perdebatan emosional (\"tapi siapa tahu nanti butuh\") menjadi prosedur. Arsipkan dengan sadar, hapus dengan berani, beli hanya setelah keduanya selesai — urutan ini menghemat miliaran.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: optimasi, up, atau out?",
      prose: [
        "Skenario 1 — Disk 70%, tumbuh 2 GB/hari, runway 75 hari. → Pesan tambah disk sekarang (lead time < runway). Alasan: masalah kapasitas murni — tidak perlu heroik.",
        "Skenario 2 — CPU 90% tetapi query belum di-tuning. → Optimasi dulu (EXPLAIN, indeks — DBA6). Alasan: 1 indeks tepat sering memangkas CPU 10x; scale tanpa tuning = membayar ketidakefisienan selamanya.",
        "Skenario 3 — Beban baca 10x beban tulis, replica idle. → Read replica + pisahkan beban analitik. Alasan: scale out termurah untuk pola baca-berat; tanpa ubah tulis.",
        "Skenario 4 — Server terbesar masuk akal sudah penuh, data 15 TB tumbuh 1 TB/bulan. → Sharding / arsip data dingin. Alasan: aritmetika memaksa; tetapi arsipkan dulu data > 2 tahun ke storage murah — sering menunda shard 2 tahun.",
        "Aturan praktis 10 detik: ukur → proyeksikan → optimasi → scale up → scale out baca → shard. Jangan lompat antrean.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: arsip yang menyelamatkan Rp2 miliar",
      prose: [
        "BankMini (DBA2) mencapai 8 TB; server max 12 TB; tumbuh 300 GB/bulan → penuh 13 bulan. Vendor mengusulkan sharding: Rp2 miliar proyek 8 bulan. DBA junior mengusulkan alternatif: analisis umur data — 71% data > 3 tahun tidak pernah di-query kecuali audit tahunan.",
        "Hitung: arsipkan data > 3 tahun ke object storage (query via foreign table saat audit): 8 TB → 2,4 TB aktif. Pertumbuhan aktif: 90 GB/bulan → runway baru: (12 − 2,4)/0,09 ≈ 106 bulan ≈ 9 tahun. Biaya arsip: Rp8 juta/bulan vs proyek shard Rp2 miliar.",
        "Pembahasan: tim memilih arsip + scale up terjadwal. Sharding ditunda hingga benar-benar perlu (mungkin tidak pernah). Pelajaran ganda: (1) \u201Cdata besar\u201D ≠ \u201Cdata panas besar\u201D — ukur distribusi umur akses sebelum arsitektur; (2) capacity planning yang baik kadang menyimpulkan \u201Cjangan bangun apa-apa\u201D — dan itu keputusan yang valid dan berharga.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang capacity planning dan skala.",
      ],
      tasks: [],
      summary: [
        "Batas aksi 85% (bukan 100%); proyeksikan dengan laju × waktu dari data terkini.",
        "Proyeksi linear cukup untuk 3–6 bulan; yang fatal adalah tidak menghitung.",
        "Urutan: optimasi → scale up → read replica → shard (terakhir!).",
        "Bedakan data panas vs dingin: arsip sering menunda arsitektur mahal bertahun-tahun.",
        "Runway dibandingkan dengan lead time aksi — itulah kalender DBA.",
      ],
      next: { label: "DBA10 — Migrasi & Upgrade Tanpa Downtime", href: "/v2/learn/dba10-migrasi" },
      quiz: [
        {
          q: "Disk 547 GB dari 1 TB, tumbuh 2,5 GB/hari. Kapan harus MULAI bertindak (batas 85%)?",
          options: [
            { text: "Saat 100% (1000 GB)", why: "100% = database berhenti; bertindak di sini = terlambat." },
            { text: "Sekarang: sisa ±120 hari; bandingkan dengan lead time pengadaan/migrasi", why: "(850−547)/2,5 ≈ 121 hari. Jika lead time 3 bulan, mulai minggu ini.", correct: true },
            { text: "Tahun depan", why: "120 hari < 1 tahun — akan penuh duluan." },
            { text: "Tidak perlu, 547 < 850", why: "Statis vs dinamis: yang penting lajunya, bukan posisinya." },
          ],
        },
        {
          q: "Database 8 TB, 71% data > 3 tahun tak pernah di-query. Langkah paling hemat?",
          options: [
            { text: "Sharding segera Rp2 miliar", why: "Membayar arsitektur termahal untuk data dingin." },
            { text: "Arsip data dingin ke storage murah; fokus kapasitas pada data panas", why: "8 TB → 2,4 TB aktif; runway 9 tahun dengan Rp8 juta/bulan.", correct: true },
            { text: "Hapus data lama", why: "Audit butuh data itu; hapus = melanggar compliance." },
            { text: "Beli server 10x", why: "Membayar untuk menyimpan data dingin di media mahal." },
          ],
        },
        {
          q: "CPU 95% tetapi query belum pernah di-EXPLAIN. Urutan tepat?",
          options: [
            { text: "Scale up 4x segera", why: "Membayar ketidakefisienan selamanya tanpa tahu penyebabnya." },
            { text: "Optimasi dulu (EXPLAIN, indeks), baru scale jika masih perlu", why: "Satu indeks tepat bisa 10x; scale adalah antrean setelah optimasi.", correct: true },
            { text: "Shard database", why: "Lompat antrean paling jauh untuk masalah yang belum didiagnosis." },
            { text: "Tambah replica", why: "Replica membantu baca; CPU 95% butuh diagnosis dulu." },
          ],
        },
        {
          q: "Beban baca 10x tulis, primary kepayahan. Solusi paling tepat?",
          options: [
            { text: "Sharding tulis", why: "Masalahnya di baca, bukan tulis." },
            { text: "Read replica untuk beban baca/analitik", why: "Scale out termurah untuk pola baca-berat; isolasi juga melindungi transaksi.", correct: true },
            { text: "Scale up primary 10x", why: "Mahal dan tetap mencampur OLTP+OLAP di satu mesin." },
            { text: "Matikan analitik", why: "Membunuh kebutuhan bisnis bukan solusi." },
          ],
        },
        {
          q: "Mengapa batas aksi 85%, bukan 100%?",
          options: [
            { text: "Angka cantik", why: "Bukan estetika." },
            { text: "15% terakhir = runway untuk pesan, migrasi, dan kejutan (pertumbuhan tak linear)", why: "Kapasitas butuh lead time; 100% berarti nol waktu reaksi.", correct: true },
            { text: "Agar grafik bagus", why: "Bukan soal visual." },
            { text: "Regulasi mengharuskan", why: "Ini praktik operasional, bukan aturan hukum." },
          ],
        },
        {
          q: "Estimasi 'disk penuh 4,3 bulan lagi' memakai rata-rata 53 GB/bulan. Bulan depan adalah tutup kuartal (+70 GB). Revisimu?",
          options: [
            { text: "Tetap 4,3 bulan — rata-rata sudah mencakup kuartal", why: "Rata-rata mencakup kuartal LALU, bukan kuartal DEPAN yang jatuh tempo bulan depan. 230 GB tersisa / 70 GB = ~3,3 bulan — dan itu jika tidak ada lonjakan lain." },
            { text: "Koreksi: hitung dengan laju kuartal untuk bulan depan (~3,3 bulan)", why: "Tepat: estimasi harus memakai laju yang RELEVAN dengan periode yang diprediksi. Rata-rata tahunan untuk bulan kuartal = meremehkan. Sampaikan sebagai rentang + asumsi.", correct: true },
            { text: "Beli disk sekarang 10x lipat", why: "Over-provisioning buta = uang menganggur. Yang dibutuhkan = estimasi jujur + lead time pengadaan, bukan panik." },
            { text: "Hapus data lama agar muat", why: "Menghapus data untuk mengejar estimasi yang salah = mengorbankan retensi demi menutupi kesalahan hitung. Perbaiki hitungannya dulu." },
          ],
        },
      ],
    },
  ],
};
