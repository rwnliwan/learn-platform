import type { V2Lesson } from "../lib/types";

// Pruning + kompresi: 36,5 GB -> 0,7 GB -> 0,17 GB.
const PRUNE_SVG = `<svg viewBox="0 0 560 210" role="img" aria-label="Tanpa pruning memindai 36,5 GB; dengan pruning 0,7 GB; plus kompresi 0,17 GB.">
<g font-family="var(--font-ui)">
<text x="20" y="30" font-size="12" fill="var(--text)">Query 7 hari terakhir dari 365 partisi harian @100 MB</text>
<text x="20" y="70" font-size="11" fill="var(--text-muted)">tanpa pruning</text>
<rect x="170" y="52" width="360" height="22" rx="4" fill="var(--error)" opacity="0.55"/>
<text x="540" y="69" font-size="11" fill="var(--text)" text-anchor="end">36,5 GB</text>
<text x="20" y="110" font-size="11" fill="var(--text-muted)">+ pruning</text>
<rect x="170" y="92" width="7" height="22" rx="4" fill="var(--c2)" opacity="0.8"/>
<text x="187" y="109" font-size="11" fill="var(--text)">0,7 GB</text>
<text x="20" y="150" font-size="11" fill="var(--text-muted)">+ kompresi zstd</text>
<rect x="170" y="132" width="4" height="22" rx="4" fill="var(--c3)" opacity="0.9"/>
<text x="184" y="149" font-size="11" fill="var(--text)">0,17 GB</text>
<text x="20" y="188" font-size="12" fill="var(--text)">209x lebih sedikit — query sama, partisi cerdas</text>
</g></svg>`;

export const de11: V2Lesson = {
  slug: "de11-cost",
  track: "Data Engineer",
  module: "Operasi & Kualitas",
  title: "DE11 — Cost & Performance Tuning",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Optimasi yang menaikkan tagihan 10x",
      prose: [
        "'TokoKita' mempartisi tabel transaksi per jam — 8.760 partisi setahun — 'agar query cepat'. Hasilnya: query seminggu terakhir membuka 168 file kecil @5 MB. Overhead buka-tutup file mendominasi; query 3x lebih lambat. Lalu mereka mempartisi per kategori (2.000 kategori!) — query satu kategori memindai 2.000 folder.",
        "Twist-nya: partisi yang salah lebih buruk daripada tanpa partisi. Small-file problem + partisi kardinalitas tinggi = metadata raksasa, scan sia-sia, tagihan meledak 10x. Mereka 'mengoptimasi' tanpa mengukur.",
        "Lesson ini: tuning adalah ilmu mengukur — partisi, kompresi, dan skew diperlakukan sebagai angka, bukan firasat.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: semakin banyak partisi semakin cepat",
        type: "pitfall",
        body: "Partisi ideal: tiap partisi 100 MB–1 GB, jumlah partisi sebanding dengan pola filter query. 8.760 partisi @5 MB = overhead metadata; 2.000 partisi kategori = scan sia-sia. Partisi adalah indeks — indeks yang salah lebih buruk dari tanpa indeks.",
      },
      reference: "Tuning = ukur dulu. Partisi ideal 100MB–1GB, selaras pola filter.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa men-tuning biaya dan performa data platform.",
        "(1) Menjelaskan partisi, pruning, dan kompresi — dan mengukur efek gabungannya (209x);",
        "(2) Menangani skew dengan salting dan broadcast join;",
        "(3) Menjelaskan kenapa 'semakin banyak partisi semakin cepat' adalah mitos;",
        "(4) Menghitung biaya per query per tahun (Rp994 ribu) sebagai bahasa komunikasi dengan manajemen.",
      ],
      tasks: [],
    },

    {
      id: "partisi-kompresi",
      eyebrow: "Langkah 3 · Partisi",
      title: "Partisi, pruning, dan kompresi",
      prose: [
        "Partisi membagi tabel jadi folder per nilai kolom (tanggal, wilayah). Pruning = engine melewatkan folder yang tak relevan: query 7 hari dari 365 partisi hanya membaca 7 folder — 52x lebih sedikit.",
        "Kompresi (Snappy cepat, Zstd rapat ~4x) mengecilkan tiap file. Kombinasi keduanya pada contoh kita: 36,5 GB → 0,7 GB (pruning) → 0,17 GB (+kompresi). 209x.",
        "💡 Intuisi: partisi berdasarkan kolom yang paling sering di-filter (tanggal!), bukan yang paling 'logis'. Cek 10 query teratas: jika 9 memfilter tanggal, partisinya tanggal. Sederhana tapi sering dilanggar.",
        "💡 Intuisi: kompresi hampir selalu menang untuk analitik (baca-sekali-tulis-sekali). CPU dekompresi murah; I/O mahal. Pengecualian: data yang ditulis-dan-dibaca ribuan kali per detik (jarang di analitik).",
        "Cara membaca: tiga bar untuk query yang SAMA (7 hari terakhir dari 365 partisi harian @100 MB): tanpa pruning 36,5 GB → dengan pruning 0,7 GB → plus kompresi zstd 0,17 GB. Anotasi: '209x lebih sedikit'.",
        "Interpretasi: pruning (lewati 358 partisi yang tidak dibutuhkan) memberi 52x; kompresi memberi 4x lagi; gabungannya perkalian: 209x. Dua optimasi 'biasa' yang dikombinasikan mengalahkan satu optimasi heroik.",
      ],
      figure: {
        svg: PRUNE_SVG,
        alt: "Pruning dan kompresi mengecilkan scan dari 36,5 GB menjadi 0,17 GB.",
        caption: "Pruning memangkas folder; kompresi memangkas isi. 209x gabungan.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: kompresi memperlambat query",
        type: "pitfall",
        body: "Pada workload analitik, bottleneck-nya I/O (membaca dari disk/jaringan), bukan CPU. File 4x lebih kecil = 4x lebih sedikit dibaca = query lebih cepat meski ada dekompresi. Ukur, jangan tebak.",
      },
      reference: "Partisi = folder per nilai. Pruning = lewati yang tak relevan. Kompresi ~4x.",
    },
    {
      id: "skew-tuning",
      eyebrow: "Langkah 4 · Skew",
      title: "Skew, salting, dan broadcast",
      prose: [
        "Skew di DE10 diobati dengan salting. Di tuning produksi ada dua senjata lagi: broadcast join (tabel dimensi kecil < 100 MB disebar ke semua mesin — tanpa shuffle tabel fakta raksasa) dan skew hint (engine menangani hot key khusus).",
        "Aturan praktis: join fakta raksasa × dimensi kecil → broadcast. Agregasi dengan hot key → salting. Keduanya menarget akar masalah: data yang pindah sia-sia atau menumpuk.",
      ],
      formula: String.raw`C_{query} = B_{scan} \times c_{GB}`,
      formulaNote: "C_query = biaya query; B_scan = byte dipindai (GB); c_GB = tarif per GB (mis. Rp75). Setiap GB yang tidak dipindai = Rp75 yang tidak dibayar. Tuning = mengecilkan B_scan.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Broadcast join untuk tabel 'kecil' 5 GB. Broadcast menyalin ke SEMUA executor — 5 GB × 100 executor = 500 GB memori. Batas praktis: < 100–200 MB. Lebih dari itu, shuffle join biasa + salting lebih aman.",
      },
      reference: "C_query = B_scan × tarif. Kecilkan B_scan = kecilkan tagihan.",
    },
    {
      id: "lab-pruning",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: ukur efek pruning + kompresi",
      prose: [
        "Lab ini menghitung byte yang dipindai tiga skenario untuk query yang sama (7 hari terakhir): tanpa pruning, dengan pruning, dan pruning + kompresi zstd 4x.",
        "Cara membaca: 36,5 GB → 0,7 GB → 0,17 GB. Rasio 209x ini langsung diterjemahkan ke rupiah di mini-case.",
        "Interpretasi: tuning terbaik sering bukan kode lebih pintar, melainkan data yang tidak perlu dibaca.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tanpa_mb` dan `dengan_pruning_mb`" },
        { id: "t2", text: "Hitung `dengan_kompresi_mb` dan `penghematan` (rasio total)" },
        { id: "t3", text: "Cetak ketiganya dalam GB + rasio" },
      ],
      expected: "tanpa_pruning_GB=36.5 | dengan_pruning_GB=0.7 | pruning_kompresi_GB=0.17 | total_penghematan=209x",
      note: {
        title: "Sering salah",
        body: "Menghitung penghematan sebagai selisih (36,5 − 0,17) bukan rasio. Untuk biaya cloud yang proporsional per GB, yang relevan adalah rasio: 209x lebih murah — bukan 'hemat 36,33 GB'.",
      },
      hints: [
        "tanpa = 365 × 100 MB; pruning = 7 × 100 MB.",
        "kompresi = pruning / 4.",
        "penghematan = round(tanpa / kompresi).",
      ],
      code: {
        starter: `# Tabel 1 tahun, partisi harian @100 MB; query 7 hari terakhir\npartisi_total, mb_per_partisi, hari_dibaca = 365, 100, 7\nkompresi = 4  # zstd\n\n# TULIS KODEMU\ntanpa_mb = \ndengan_pruning_mb = \ndengan_kompresi_mb = \npenghematan = round(tanpa_mb / dengan_kompresi_mb)\n\nprint(f"tanpa_pruning_GB={tanpa_mb/1000:.1f}")\nprint(f"dengan_pruning_GB={dengan_pruning_mb/1000:.1f}")\nprint(f"pruning_kompresi_GB={dengan_kompresi_mb/1000:.2f}")\nprint(f"total_penghematan={penghematan}x")`,
        lockLines: 2,
        solution: `# Tabel 1 tahun, partisi harian @100 MB; query 7 hari terakhir\npartisi_total, mb_per_partisi, hari_dibaca = 365, 100, 7\nkompresi = 4  # zstd\n\n# TULIS KODEMU\ntanpa_mb = partisi_total * mb_per_partisi\ndengan_pruning_mb = hari_dibaca * mb_per_partisi\ndengan_kompresi_mb = dengan_pruning_mb / kompresi\npenghematan = round(tanpa_mb / dengan_kompresi_mb)\n\nprint(f"tanpa_pruning_GB={tanpa_mb/1000:.1f}")\nprint(f"dengan_pruning_GB={dengan_pruning_mb/1000:.1f}")\nprint(f"pruning_kompresi_GB={dengan_kompresi_mb/1000:.2f}")\nprint(f"total_penghematan={penghematan}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "tanpa_mb", value: 36500, tol: 1, label: "`tanpa_mb` = 36.500", msg: "365 × 100 MB." },
          { kind: "equal", task: "t2", name: "dengan_kompresi_mb", value: 175, tol: 1e-9, label: "`dengan_kompresi_mb` = 175", msg: "700/4 = 175 MB = 0,17 GB." },
          { kind: "stdout_matches", task: "t3", pattern: "total_penghematan=209x", label: "`print` 209x", msg: "36500/175 = 208,57 → 209." },
        ],
      },
      reference: "Ukur B_scan tiap skenario. Rasio = bahasa tagihan.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Optimasi tanpa pengukuran = hobi mahal. Selalu ukur SEBELUM: 'query ini Rp994 ribu/tahun' adalah kalimat yang membuat optimasi disetujui — bukan 'query ini lambat'.",
        "💡 Pruning (lewati folder) + kompresi (kecilkan isi) bersifat perkalian: 52x × 4x = 209x. Kombinasi dua optimasi 'biasa' mengalahkan satu optimasi 'heroik'.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tagihan cloud adalah cermin arsitektur — baca tiap bulan",
        body: "Praktisi senior membaca tagihan cloud seperti dokter membaca hasil lab: ia tidak berbohong tentang arsitekturmu. Heuristik ritualnya: tiap bulan, buka 10 query dan 10 tabel termahal, lalu tanyakan dua hal — \"masih dibaca siapa?\" dan \"bisakah turun tier?\". Tabel yang tidak disentuh 90 hari bukan aset, melainkan sewa gudang — arsipkan. Aturan optimasinya berurutan: ukur dulu — kalimat \"query ini Rp994 ribu per tahun\" meloloskan optimasi, \"query ini lambat\" tidak — lalu serang scan terbesar: partition pruning dan kompresi bersifat perkalian, 52 dikali 4 sama dengan 209, mengalahkan satu optimasi heroik mana pun. Jebakan yang paling umum: mengoptimasi compute sementara storage membengkak diam-diam, atau sebaliknya — biaya total adalah compute plus storage plus transfer, dan transfer antar region sering luput dari perhatian. Satu kebiasaan yang menyelamatkan: beri tag pemilik pada setiap job dan tabel sejak hari pertama; tanpa atribusi, \"optimasi biaya\" berubah jadi rapat saling tunjuk. Dan ingat asimetrinya: menaikkan biaya itu satu baris konfigurasi, menurunkannya butuh refactor — maka rancang dari tagihan, bukan dari katalog fitur.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: optimasi apa dulu?",
      prose: [
        "Skenario 1 — Query lambat karena scan besar. Kondisi: B_scan raksasa. Keputusan: partisi + pruning + kompresi dulu. Alasan: 209x > optimasi kode apa pun.",
        "Skenario 2 — Join lambat, satu sisi kecil. Kondisi: dimensi < 200 MB. Keputusan: broadcast join. Alasan: hilangkan shuffle sisi besar.",
        "Skenario 3 — Satu task lembur, lainnya menganggur. Kondisi: skew. Keputusan: salting / skew hint. Alasan: tambah mesin tidak membantu (DE10).",
        "Skenario 4 — Banyak file kecil. Kondisi: ribuan file @KB. Keputusan: compaction (gabung file). Alasan: overhead buka-tutup mendominasi; target 100 MB–1 GB per file.",
        "Aturan praktis 10 detik: urutan tuning = kurangi yang dibaca → kurangi yang pindah → seimbangkan beban → rapikan file.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Tuning tanpa baseline: mengubah 5 hal sekaligus lalu 'merasa' lebih cepat. Selalu catat B_scan dan durasi SEBELUM tuning. Tanpa angka awal, kamu tidak tahu apa yang berhasil — dan akan mengulang kesalahan yang sama.",
      },
      reference: "Urut: baca → pindah → seimbang → rapikan. Selalu ukur sebelum & sesudah.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: Rp994 ribu per tahun per query",
      prose: [
        "Satu query harian tanpa tuning memindai 36,5 GB/hari @Rp75/GB selama setahun: Rp999.188. Dengan tuning (0,175 GB/hari): Rp4.791. Satu query menghemat Rp994.397/tahun.",
        "Kalikan dengan 200 query harian di perusahaan menengah: ~Rp199 juta/tahun. Itulah gaji seorang data engineer — dibayar oleh tuning.",
        "Interpretasi: tuning bukan 'nice to have'; ia adalah pos anggaran.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tanpa` dan `dengan` (biaya tahunan, Rp75/GB, 365 hari)" },
        { id: "t2", text: "Hitung `hemat` dan `rasio`, cetak semua" },
      ],
      expected: "tanpa_tuning=Rp999,188 | dengan_tuning=Rp4,791 | hemat=Rp994,397 | rasio=209x",
      hints: [
        "tanpa = 36.5 × 75 × 365; dengan = 0.175 × 75 × 365.",
        "Format: f\"Rp{nilai:,.0f}\".",
        "rasio = round(tanpa / dengan).",
      ],
      code: {
        starter: `# Satu query harian, tarif Rp75/GB\ntanpa_gb, dengan_gb, tarif, hari = 36.5, 0.175, 75, 365\n\n# TULIS KODEMU\ntanpa = \ndengan = \nhemat = tanpa - dengan\nrasio = round(tanpa / dengan)\n\nprint(f"tanpa_tuning=Rp{tanpa:,.0f}")\nprint(f"dengan_tuning=Rp{dengan:,.0f}")\nprint(f"hemat=Rp{hemat:,.0f} rasio={rasio}x")`,
        lockLines: 1,
        solution: `# Satu query harian, tarif Rp75/GB\ntanpa_gb, dengan_gb, tarif, hari = 36.5, 0.175, 75, 365\n\n# TULIS KODEMU\ntanpa = tanpa_gb * tarif * hari\ndengan = dengan_gb * tarif * hari\nhemat = tanpa - dengan\nrasio = round(tanpa / dengan)\n\nprint(f"tanpa_tuning=Rp{tanpa:,.0f}")\nprint(f"dengan_tuning=Rp{dengan:,.0f}")\nprint(f"hemat=Rp{hemat:,.0f} rasio={rasio}x")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "tanpa_tuning=Rp999,188", label: "`print` tanpa_tuning", msg: "36,5×75×365 = 999.187,5 → 999.188." },
          { kind: "stdout_matches", task: "t2", pattern: "dengan_tuning=Rp4,791", label: "`print` dengan_tuning", msg: "0,175×75×365 = 4.790,6 → 4.791." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio=209x", label: "`print` rasio=209x", msg: "999188/4791 ≈ 209." },
        ],
      },
      reference: "Tuning = pos anggaran. Satu query hemat ~Rp1 jt/tahun.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang membayar lebih sedikit.",
      ],
      tasks: [],
      summary: [
        "Partisi salah > tanpa partisi: target 100 MB–1 GB per partisi, selaras pola filter.",
        "Pruning + kompresi: 36,5 GB → 0,17 GB (209x) untuk query yang sama.",
        "C_query = B_scan × tarif; kecilkan B_scan = kecilkan tagihan.",
        "Skew diobati salting/broadcast, bukan tambah mesin; broadcast hanya untuk tabel kecil.",
        "Urutan tuning: baca → pindah → seimbang → rapikan; selalu ukur sebelum & sesudah.",
      ],
      next: { label: "DE12 — Governance: Katalog & Lineage", href: "/v2/learn/de12-governance" },
      quiz: [
        {
          q: "Kenapa partisi per jam (8.760 partisi) memperlambat query?",
          options: [
            { text: "Karena datanya terlalu besar", why: "Ukuran data sama; masalahnya jumlah file." },
            { text: "Small-file problem: overhead buka-tutup ribuan file kecil mendominasi", why: "Tepat: 168 file @5 MB — metadata & I/O overhead > komputasi.", correct: true },
            { text: "Karena kompresi rusak", why: "Tidak berhubungan." },
            { text: "Karena tidak ada indeks", why: "Partisi adalah indeksnya — yang salah desain." },
          ],
        },
        {
          q: "Partisi ideal dipilih berdasarkan…",
          options: [
            { text: "Kolom yang paling sering di-filter query", why: "Tepat: pruning bekerja saat filter = kolom partisi.", correct: true },
            { text: "Kolom dengan kardinalitas tertinggi", why: "Itu justru jebakan (2.000 partisi kategori).", },
            { text: "Urutan abjad nama kolom", why: "Tidak ada dasarnya." },
            { text: "Keinginan tim storage", why: "Keputusan milik pola baca, bukan tim." },
          ],
        },
        {
          q: "Kapan broadcast join tepat?",
          options: [
            { text: "Kedua tabel raksasa", why: "Broadcast menyalin ke semua executor — raksasa × 100 = bencana memori." },
            { text: "Satu sisi kecil (<200 MB): disebar ke semua mesin, tanpa shuffle sisi besar", why: "Tepat: itulah definisi broadcast join.", correct: true },
            { text: "Selalu, karena lebih cepat", why: "Tidak selalu; salah ukuran = OOM massal." },
            { text: "Tidak pernah", why: "Terlalu mutlak; untuk dimensi kecil ia optimal." },
          ],
        },
        {
          q: "Rumus C = B_scan × tarif mengajarkan…",
          options: [
            { text: "Naikkan tarif agar untung", why: "Kamu pembayar, bukan penjual." },
            { text: "Fokus tuning = mengecilkan byte yang dipindai", why: "Tepat: tarif tetap; B_scan yang bisa kamu kendalikan.", correct: true },
            { text: "Pindah ke cloud yang lebih murah selalu cukup", why: "Murah 2x < tuning 209x." },
            { text: "Hapus data lama", why: "Itu lifecycle, bukan inti rumusnya." },
          ],
        },
        {
          q: "Langkah pertama sebelum tuning apa pun?",
          options: [
            { text: "Ubah semua ke format baru", why: "Tanpa baseline = menebak." },
            { text: "Catat baseline: B_scan & durasi saat ini", why: "Tepat: tanpa angka awal, tak ada bukti perbaikan.", correct: true },
            { text: "Tambah partisi", why: "Mungkin justru memperburuk (small files)." },
            { text: "Beli mesin lebih besar", why: "Paling mahal, belum tentu menyentuh akar." },
          ],
        },
        {
          q: "Query memindai 365 partisi harian untuk 7 hari terakhir. Perbaikan satu baris konseptual?",
          options: [
            { text: "Tambah index", why: "Warehouse kolomnar tidak memakai index B-tree tradisional; 'index'-nya = partisi + sorting. Jawaban yang benar ada di desain partisi." },
            { text: "Partition pruning: filter pada kolom partisi (tanggal)", why: "Tepat: WHERE tanggal >= ... memungkinkan engine melewati 358 partisi (52x). Satu klausa WHERE pada kolom partisi = penghematan terbesar termurah.", correct: true },
            { text: "SELECT * agar lengkap", why: "SELECT * = membaca SEMUA kolom = anti-columnar. Malah memperparah 5-10x." },
            { text: "Perbesar warehouse", why: "Memperbesar untuk query yang 98% datanya tidak dibutuhkan = membayar ketidakefisienan." },
          ],
        },
        {
          q: "Manajemen bertanya 'optimasi ini hemat berapa?'. Jawaban yang meyakinkan?",
          options: [
            { text: "'Query jadi lebih cepat'", why: "'Lebih cepat' tidak masuk spreadsheet. Manajemen butuh rupiah." },
            { text: "'Dari Rp994 ribu/tahun/query menjadi Rp4,7 ribu — 209x, hemat Rp989 ribu per query'", why: "Tepat: bahasa manajemen = uang per tahun. 209x terdengar teknis; Rp989 ribu hemat per query per tahun = disetujui. Selalu terjemahkan ke rupiah.", correct: true },
            { text: "'Best practice says so'", why: "Argumen otoritas tanpa angka = lemah. Best practice butuh bukti lokal." },
            { text: "'Kompetitor juga begitu'", why: "Kompetitor tidak membayar tagihanmu. Angka sendiri yang meyakinkan." },
          ],
        },
      ],
    },
  ],
};
