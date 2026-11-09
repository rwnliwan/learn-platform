import type { V2Lesson } from "../lib/types";

export const mle1: V2Lesson = {
  slug: "mle1-lanskap",
  track: "Machine Learning Engineer",
  module: "Fondasi Produksi",
  title: "MLE1 — Dari Notebook ke Produksi",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Track ini bukan tentang algoritma yang lebih canggih. Ini tentang pertanyaan yang jarang ditanyakan di kursus ML: setelah model selesai di notebook, bagaimana ia sampai ke tangan pengguna — dan tetap waras di sana?",
        "Tujuan lesson ini:",
        "• Menjelaskan kenapa mayoritas model ML tidak pernah menyentuh produksi — dan apa penyebab utamanya.",
        "• Membedakan lingkungan notebook vs produksi dalam 5 dimensi konkret.",
        "• Memetakan peran Machine Learning Engineer terhadap Data Scientist, Data Engineer, dan MLOps.",
        "• Menghitung funnel eksperimen→produksi dan latency budget dari angka nyata.",
        "• Memutuskan kapan memakai ML, kapan cukup rule-based, dan kapan tidak pakai ML sama sekali.",
        "• Merumuskan problem framing: masalah bisnis → tugas ML, biaya kesalahan, dan uji kelayakan.",
        "Isi lesson: cerita pembuka (model 99,2% yang tidak pernah dipakai) → 5 perbedaan notebook vs produksi → peta peran → 2 lab (funnel + latency budget) → peta keputusan → problem framing + lab biaya kesalahan → mini-case bank → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model 99,2% yang tidak pernah dipakai siapa pun",
      prose: [
        "Maret 2025. Tim data sebuah bank digital merayakan: model deteksi fraud mereka mencapai akurasi 99,2% di notebook. Confusion matrix-nya rapi, ROC curve-nya mulus. Presentasi ke direksi sukses besar.",
        "November 2025 — delapan bulan kemudian. Model itu belum dipakai oleh siapa pun. Bukan karena akurasinya turun. Bukan karena ada model yang lebih bagus. Melainkan karena tidak ada yang tahu cara menjalankannya di luar laptop analis yang membuatnya.",
        "Twist-nya: pipeline datanya manual. Setiap pagi seseorang mengunduh CSV dari tiga sistem berbeda, menggabungkannya di Excel, lalu menjalankan notebook cell per cell. Minggu lalu nama satu kolom berubah dari `trx_amount` menjadi `transaction_amount` dan seluruh pipeline diam-diam menghasilkan angka sampah selama 6 hari — tanpa ada yang sadar.",
        "Ini bukan cerita fiksi. Survei industri konsisten menemukan angka yang menyakitkan: sekitar 87% model ML tidak pernah mencapai produksi. Dan dari yang mencapai produksi, sebagian besar gagal bukan karena matematikanya — melainkan karena infrastrukturnya.",
        "Machine Learning Engineer adalah orang yang menutup jurang itu. Bukan ilmuwan yang mencari akurasi tertinggi, melainkan insinyur yang memastikan model terbaik pun bisa berjalan andal, cepat, murah, dan terpantau — setiap hari, tanpa intervensi manual.",
        "Cara membaca: diagram funnel dibaca dari atas ke bawah. Lebar tiap batang = jumlah model di tahap itu; angka di kanan = jumlahnya. Perhatikan RASIO antar batang berturut-turut, bukan angka absolutnya — rasio itulah “tingkat kelulusan” tiap gerbang.",
        "Interpretasi: dari 120 eksperimen, hanya ~16 mencapai produksi (retensi ~13%). Penyusutan TERBESAR terjadi di dua gerbang: eksperimen → validasi offline (banyak yang tidak reproducible) dan validasi → produksi (tidak ada yang tahu cara mendeploy). Funnel ini BUKAN tentang model yang buruk — ia tentang INFRASTRUKTUR yang hilang. Setiap gerbang yang menyusut = satu kemampuan MLE yang belum dibangun tim itu.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Funnel eksperimen → produksi (tipikal)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Funnel eksperimen → produksi (tipikal)</text>
<text x="122" y="62.5" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Eksperimen</text>
<rect x="130" y="38.0" width="290.0" height="35.0" fill="var(--c1)" rx="4"/>
<text x="428.0" y="62.5" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">120</text>
<text x="122" y="107.5" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Validasi offline</text>
<rect x="130" y="83.0" width="99.1" height="35.0" fill="var(--c2)" rx="4"/>
<text x="237.1" y="107.5" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">41</text>
<text x="122" y="152.5" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Shadow test</text>
<rect x="130" y="128.0" width="36.2" height="35.0" fill="var(--c3)" rx="4"/>
<text x="174.2" y="152.5" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">15</text>
<text x="122" y="197.5" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Produksi</text>
<rect x="130" y="173.0" width="14.5" height="35.0" fill="var(--c4)" rx="4"/>
<text x="152.5" y="197.5" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6</text>
</svg>`,
        alt: "Funnel: 120 eksperimen, 41 lolos validasi offline, 15 masuk shadow test, 6 mencapai produksi.",
        caption: "Dari 120 eksperimen, hanya 6 (5%) yang mencapai produksi. Penyusutan terbesar terjadi di validasi offline — di situlah model-model 'bagus di notebook' gugur karena tidak reproducible atau tidak bisa di-serve.",
      },
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: model terbaik = model dengan akurasi tertinggi",
        type: "pitfall",
        body: "Yang benar: model terbaik untuk produksi = model yang memenuhi SEMUA kontrak — akurasi cukup, latency di bawah SLO, biaya masuk akal, bisa di-monitor, dan bisa di-rollback. Model dengan akurasi 94% yang stabil di produksi mengalahkan model 97% yang tidak bisa di-deploy.",
      },
    },
    {
      id: "notebook-vs-prod",
      eyebrow: "Langkah 3 · Notebook vs produksi",
      title: "Lima perbedaan yang menentukan hidup-matinya model",
      prose: [
        "Notebook dan produksi terlihat menjalankan 'kode yang sama', tetapi kontraknya berbeda total. Berikut lima dimensinya:",
        "1. Data: di notebook, data adalah file statis yang sudah dibersihkan. Di produksi, data adalah aliran hidup — terlambat, hilang, berubah skema tanpa pemberitahuan.",
        "2. Eksekusi: notebook dijalankan manusia cell per cell, boleh gagal di tengah. Produksi berjalan otomatis 24/7; kegagalan di tengah malam harus pulih sendiri atau membangunkan orang yang tepat.",
        "3. Dependensi: notebook memakai 'library yang terinstall di laptop saya'. Produksi butuh environment yang terkunci versinya dan bisa dibangun ulang dari nol.",
        "4. Skala: notebook memproses ribuan baris sekali jalan. Produksi melayani jutaan request per hari dengan latency budget dalam milidetik.",
        "5. Akuntabilitas: notebook cukup 'akurasi 95%'. Produksi menuntut: berapa biayanya per prediksi? Bagaimana tahu kalau performanya turun? Bagaimana cara mematikannya dengan aman?",
        "Setiap perbedaan ini adalah tempat model-model mati. Lab berikut mengukur seberapa kejam funnel-nya dengan angka.",
      ],
      formula: String.raw`\text{retensi} = \frac{N_{\text{produksi}}}{N_{\text{eksperimen}}} \times 100\%`,
      formulaNote: "retensi = proporsi eksperimen yang mencapai produksi (0–1); N_produksi = jumlah model yang live melayani; N_eksperimen = total model yang pernah dicoba. Retensi 13% berarti 87% tidak pernah dipakai — bukan karena matematikanya buruk, melainkan karena jurang notebook → produksi (infrastruktur, bukan algoritma).",
      tasks: [
        { id: "t1", text: "Hitung `retensi` eksperimen → produksi dalam persen" },
        { id: "t2", text: "Temukan `bottleneck`: transisi dengan penurunan relatif terbesar" },
        { id: "t3", text: "Cetak retensi, bottleneck, dan persentase penurunannya" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: ukur funnel-mu sendiri",
        body: "Tim yang sehat mencatat setiap eksperimen dan alasannya gugur. Kalau 80% gugur di validasi offline karena 'tidak reproducible', masalahmu bukan modeling — melainkan disiplin eksperimen (topik MLE3).",
      },
      hints: [
        "Retensi = stage terakhir / stage pertama × 100.",
        "Penurunan relatif satu transisi = (sebelum - sesudah) / sebelum × 100.",
        "Gunakan zip(stages, stages[1:]) untuk memasangkan stage berurutan.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
stages = [("eksperimen", 120), ("validasi_offline", 41),
          ("shadow_test", 15), ("produksi", 6)]

# TULIS KODEMU: retensi end-to-end (persen)
retensi = 

# TULIS KODEMU: cari transisi dengan penurunan relatif terbesar
bottleneck = ""
drop = 0.0

print(f"retensi={retensi:.1f}%  bottleneck={bottleneck}  drop={drop:.1f}%")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
stages = [("eksperimen", 120), ("validasi_offline", 41),
          ("shadow_test", 15), ("produksi", 6)]

# TULIS KODEMU: retensi end-to-end (persen)
retensi = stages[-1][1] / stages[0][1] * 100

# TULIS KODEMU: cari transisi dengan penurunan relatif terbesar
bottleneck = ""
drop = 0.0
for (nama1, c1), (nama2, c2) in zip(stages, stages[1:]):
    d = (c1 - c2) / c1 * 100
    if d > drop:
        bottleneck, drop = f"{nama1}->{nama2}", d

print(f"retensi={retensi:.1f}%  bottleneck={bottleneck}  drop={drop:.1f}%")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`retensi` = 5.0%",
            "name": "retensi",
            "value": 5.0,
            "tol": 1e-09,
            "msg": "6/120 × 100 = 5.0. Stage terakhir dibagi stage pertama.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`drop` ≈ 65.8%",
            "name": "drop",
            "value": 65.83333333333333,
            "tol": 0.05,
            "msg": "(120-41)/120 × 100 = 65.8%. Bandingkan ketiga transisi.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan retensi",
            "pattern": "retensi=5\\.0%",
            "msg": "Format: retensi=...%  bottleneck=...  drop=...%.",
          },
        ],
      },
      reference: "zip(a, a[1:]) memasangkan elemen berurutan. f-string {x:.1f} = 1 desimal.",
    },
    {
      id: "peta-peran",
      eyebrow: "Langkah 4 · Peta peran",
      title: "MLE, Data Scientist, Data Engineer: siapa mengerjakan apa",
      prose: [
        "Kebingungan peran adalah sumber konflik klasik. Data Scientist (DS) menjawab 'model apa yang memprediksi paling baik?'. Data Engineer (DE) menjawab 'bagaimana data mengalir andal dari sumber ke tujuan?'. Machine Learning Engineer duduk di persimpangannya: 'bagaimana model terbaik berjalan andal di produksi?'",
        "Praktisnya: DS memiliki eksperimen dan metrik offline. DE memiliki pipeline data dan warehouse. MLE memiliki training pipeline yang reproducible, serving infrastructure, monitoring, dan rollback plan. Di tim kecil, satu orang bisa merangkap ketiganya — tetapi tanggung jawabnya tetap tiga hal yang berbeda.",
        "MLOps bukan peran, melainkan praktik: gabungan budaya + tooling agar perubahan model bisa dikirim ke produksi dengan aman dan cepat — mirip DevOps untuk software, ditambah keunikan ML (data dan model ikut berversion).",
        "Twist karir: di banyak perusahaan Indonesia, lowongan 'Data Scientist' sebenarnya mencari MLE — deskripsinya menyebut deploy, API, dan monitoring. Membaca deskripsi pekerjaan dengan lensa lesson ini menghemat banyak kekecewaan.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'kalau jalan di notebook, deploy tinggal copy-paste'",
        type: "pitfall",
        body: "Yang benar: notebook menyembunyikan state (urutan run cell), dependensi tak terkunci, dan data yang sudah dibersihkan manual. Copy-paste ke server hampir pasti gagal — atau lebih buruk: jalan tetapi menghasilkan prediksi salah (train-serve skew, dibahas di MLE2).",
      },
    },
    {
      id: "latency-budget",
      eyebrow: "Langkah 5 · Latency budget",
      title: "SLO 250ms: ke mana perginya waktu?",
      prose: [
        "Kontrak produksi paling konkret adalah latency budget. Misal aplikasi kredit menjanjikan keputusan dalam 250ms (SLO). Budget itu harus dibagi ke semua komponen: preprocessing, inference, postprocessing, jaringan.",
        "Aturan main: jumlahkan semua komponen. Sisanya adalah headroom — ruang napas untuk lonjakan. Headroom 0% berarti sistem pas-pasan: satu lonjakan kecil dan SLO jebol.",
        "Cara membaca: total 200ms dari budget 250ms → sisa 50ms → headroom 20%. Interpretasi: masih ada ruang, tetapi model yang 2x lebih lambat tidak akan muat tanpa optimasi.",
        "Di lab ini kamu menghitungnya sendiri. Coba ubah: bagaimana jika inference naik menjadi 180ms? Headroom tinggal berapa?",
      ],
      formula: String.raw`\text{headroom} = \frac{\text{SLO} - \sum \text{komponen}}{\text{SLO}} \times 100\%`,
      formulaNote: "headroom = ruang napas sistem (0–1); SLO = target latency yang dijanjikan (mis. 250ms); Σkomponen = total latency semua tahap (preprocessing + inference + postprocessing). Headroom 20% berarti sistem tahan lonjakan 20% sebelum SLO jebol. Headroom 0% = pas-pasan: satu lonjakan kecil, SLO jebol, pager berbunyi.",
      tasks: [
        { id: "t1", text: "Hitung `total` latensi semua komponen" },
        { id: "t2", text: "Hitung `sisa` dan `headroom` (persen) dari SLO" },
        { id: "t3", text: "Cetak total, sisa, dan headroom" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: latency adalah fitur",
        body: "Pengguna merasakan 300ms vs 80ms — bukan akurasi 94% vs 95%. Dalam banyak produk, memangkas latency 200ms menaikkan konversi lebih banyak daripada menaikkan akurasi 1 poin.",
      },
      hints: [
        "total = jumlah semua value di dict komponen.",
        "sisa = SLO_MS - total; headroom = sisa / SLO_MS × 100.",
        "sum(komponen.values()) menjumlahkan dict.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
SLO_MS = 250
komponen = {"preprocessing": 25, "inference": 120, "postprocessing": 15, "jaringan": 40}

# TULIS KODEMU
total = 
sisa = 
headroom = 

print(f"total={total}ms  sisa={sisa}ms  headroom={headroom:.1f}%")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
SLO_MS = 250
komponen = {"preprocessing": 25, "inference": 120, "postprocessing": 15, "jaringan": 40}

# TULIS KODEMU
total = sum(komponen.values())
sisa = SLO_MS - total
headroom = sisa / SLO_MS * 100

print(f"total={total}ms  sisa={sisa}ms  headroom={headroom:.1f}%")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`total` = 200ms",
            "name": "total",
            "value": 200,
            "tol": 1e-09,
            "msg": "25+120+15+40 = 200.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`sisa` = 50ms",
            "name": "sisa",
            "value": 50,
            "tol": 1e-09,
            "msg": "250 - 200 = 50.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan headroom",
            "pattern": "headroom=20\\.0%",
            "msg": "50/250 × 100 = 20.0%.",
          },
        ],
      },
      reference: "sum(dict.values()). f-string {x:.1f} untuk 1 desimal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan pakai ML — dan kapan JANGAN",
      prose: [
        "Skenario 1 — Prediksi fraud kartu kredit real-time, pola berubah tiap minggu → pakai ML online serving. Alasan: pola terlalu kompleks untuk aturan manual dan berubah cepat; volume tinggi membenarkan biaya infra.",
        "Skenario 2 — Laporan agregat transaksi harian untuk direksi → JANGAN pakai ML serving; pakai batch job SQL. Alasan: tidak ada prediksi yang dibutuhkan, hanya agregasi deterministik. ML menambah biaya tanpa manfaat.",
        "Skenario 3 — Validasi format KTP di form pendaftaran → pakai rule-based (regex + checksum). Alasan: aturannya eksak dan stabil; ML hanya menambah ketidakpastian pada masalah yang sudah solved.",
        "Skenario 4 — Rekomendasi produk dengan data 200 pengguna → JANGAN pakai deep learning; mulai dari popularity baseline atau model sederhana. Alasan: data terlalu sedikit; model kompleks akan overfit dan mahal.",
        "Aturan praktis 10 detik: (1) Apakah polanya terlalu kompleks untuk aturan manual? (2) Apakah datanya cukup dan mengalir? (3) Apakah nilai bisnisnya menutup biaya serving + monitoring? Tiga 'ya' → ML layak dipertimbangkan. Satu 'tidak' → cari jalan yang lebih sederhana dulu.",
      ],
      tasks: [
      ],
    },
    {
      id: "problem-framing",
      eyebrow: "Langkah 7 · Problem framing",
      title: "Problem framing: dari masalah bisnis ke tugas ML",
      prose: [
        "Langkah 6 menjawab 'pakai ML atau tidak' secara kualitatif. Langkah ini membuatnya kuantitatif. Problem framing adalah pekerjaan menerjemahkan masalah bisnis menjadi tugas ML yang bisa diukur — dan memutuskan apakah tugas itu layak dikerjakan sama sekali. Framing yang salah adalah akar dari sebagian besar proyek ML yang 'berhasil secara teknis, gagal secara bisnis': modelnya akurat, tetapi ia menjawab pertanyaan yang tidak ditanyakan siapa pun.",
        "Empat langkah framing. Satu: nyatakan masalah bisnis dalam satu kalimat yang menyebut uang atau risiko ('menurunkan kerugian gagal bayar Rp1,6 miliar per bulan'). Dua: terjemahkan ke tugas ML ('klasifikasi biner: aplikasi akan gagal bayar atau tidak, diputuskan sebelum pencairan'). Tiga: tentukan metrik sukses DALAM BAHASA BISNIS dulu, baru padanannya di ML (sukses bisnis = 'kerugian bulanan turun Rp400 juta'; padanan ML = 'recall 70 persen dengan false positive di bawah 2 persen'). Empat: tulis biaya kesalahan — berapa rupiah satu false negative, berapa rupiah satu false positive — karena tanpa itu threshold dan metrik tidak punya jangkar.",
        "Kelayakan diuji dengan tiga gerbang, semuanya harus lolos. Gerbang data: apakah ada cukup contoh berlabel yang mewakili produksi (bukan data demo), dan apakah fitur yang dibutuhkan tersedia SAAT keputusan dibuat, bukan seminggu kemudian? Gerbang biaya kesalahan: apakah biaya kedua jenis kesalahan bisa diukur — kalau tidak bisa, kamu tidak bisa memilih threshold, dan modelmu menebak dalam gelap. Gerbang nilai: apakah penghematan dari model menutup biaya membangun + menjalankan + memantaunya? Model yang menghemat Rp10 juta per bulan tetapi menelan biaya operasi Rp40 juta per bulan adalah proyek yang merugi dengan akurasi tinggi.",
        "Lab berikut menghitung gerbang nilai untuk kasus pinjaman mikro (ilustratif): 10.000 aplikasi per bulan, 8 persen gagal bayar. Tiga kandidat: tanpa model (terima semua), rule-based, dan model ML. Biaya kesalahan ilustratif: satu gagal bayar yang lolos (false negative) Rp2.000.000; satu nasabah baik yang ditolak (false positive) Rp150.000. Rule-based: recall 40 persen, false positive 5 persen dari nasabah baik, biaya operasi Rp5 juta per bulan. Model ML: recall 70 persen, false positive 2 persen, biaya operasi Rp40 juta per bulan. Hitung total biaya tiap kandidat — dan lihat apakah ML layak, serta melawan SIAPA ia harus dibandingkan.",
        "Hasilnya (ilustratif): tanpa model Rp1.600 juta per bulan; rule-based Rp1.034 juta; model ML Rp547,6 juta. ML menghemat Rp486,4 juta per bulan dibanding rule-based — dan Rp1.052,4 juta dibanding tanpa model. Framing yang benar membandingkan ML dengan ALTERNATIF TERBAIK yang ada (rule-based), bukan dengan 'tanpa apa-apa': hemat Rp486,4 juta adalah angka yang jujur untuk dibawa ke direksi, bukan Rp1.052,4 juta. Dan perhatikan: recall naik dari 40 ke 70 persen hanya berarti bila biaya false negative memang jauh lebih besar dari false positive — di sinilah biaya kesalahan menentukan segalanya.",
        "Dua jebakan framing yang paling sering. Pertama, tugas ML yang salah: 'prediksi siapa yang akan gagal bayar' vs 'prediksi siapa yang AKAN MEMBAYAR TEPAT WAKTU bila diberi tenor lebih panjang' — tugas kedua membuka aksi bisnis (restrukturisasi) yang pertama tidak punya. Tanyakan selalu: 'keputusan APA yang berubah karena prediksi ini?' Bila tidak ada keputusan yang berubah, tidak ada tugas ML. Kedua, kelayakan yang dihitung dari akurasi: akurasi 95 persen terdengar layak, tetapi bila 92 persen datanya kelas mayoritas, model 'selalu tebak mayoritas' sudah 92 persen tanpa belajar apa-apa. Kelayakan dihitung dari RUPIAH, bukan dari akurasi.",
      ],
      formula: String.raw`\text{biaya total} = FN \times c_{FN} + FP \times c_{FP} + \text{biaya operasi}`,
      formulaNote: "biaya total = kerugian bulanan satu kandidat solusi; FN/FP = jumlah false negative/positive per bulan; c_FN/c_FP = biaya per kesalahan (rupiah, ilustratif di lab); biaya operasi = biaya menjalankan solusi itu. Kandidat layak bila biaya totalnya PALING RENDAH di antara semua alternatif — termasuk rule-based dan 'tanpa model'.",
      tasks: [
        { id: "t1", text: "Hitung `rule_cost`, `ml_cost`, dan `none_cost` (tanpa model) dalam rupiah per bulan" },
        { id: "t2", text: "Hitung `hemat` = penghematan ML dibanding rule-based, dan `layak` (True bila hemat lebih dari 0)" },
        { id: "t3", text: "Cetak keempat angka dan vonis kelayakan" },
      ],
      expected: "rule=Rp1.034.000.000  ml=Rp547.600.000  tanpa_model=Rp1.600.000.000  hemat_vs_rule=Rp486.400.000  layak=True",
      note: {
        title: "💡 Intuisi: framing dulu, modeling kemudian",
        body: "Satu jam framing yang jujur menghemat tiga bulan modeling yang salah arah. Tuliskan masalah bisnis, tugas ML, metrik sukses bisnis, dan biaya kesalahan DI ATAS KERTAS sebelum membuka notebook — dan minta pemilik bisnis menandatanganinya. Bila mereka tidak mau, framing-mu belum benar.",
      },
      hints: [
        "FN rule = 800 - TP rule; TP rule = 40% dari 800 kasus gagal bayar.",
        "FP rule = 5% dari 9.200 nasabah baik; FP ML = 2% dari 9.200.",
        "Tanpa model: semua 800 gagal bayar lolos (FN = 800), FP = 0, biaya operasi = 0.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
n, default = 10_000, 800
baik = n - default
C_FN, C_FP = 2_000_000, 150_000
# rule-based: recall 40%, FP 5% dari nasabah baik, operasi Rp5 jt/bln
# model ML: recall 70%, FP 2% dari nasabah baik, operasi Rp40 jt/bln
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: biaya total tiap kandidat (rupiah/bulan)
rule_cost = 
ml_cost = 
none_cost = 
hemat = 
layak = 

print(f"rule=Rp{rule_cost:,}  ml=Rp{ml_cost:,}  tanpa_model=Rp{none_cost:,}  hemat_vs_rule=Rp{hemat:,}  layak={layak}".replace(",", "."))`,
        lockLines: 6,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
n, default = 10_000, 800
baik = n - default
C_FN, C_FP = 2_000_000, 150_000
# rule-based: recall 40%, FP 5% dari nasabah baik, operasi Rp5 jt/bln
# model ML: recall 70%, FP 2% dari nasabah baik, operasi Rp40 jt/bln
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: biaya total tiap kandidat (rupiah/bulan)
rule_cost = (default - int(0.40 * default)) * C_FN + int(0.05 * baik) * C_FP + 5_000_000
ml_cost = (default - int(0.70 * default)) * C_FN + int(0.02 * baik) * C_FP + 40_000_000
none_cost = default * C_FN
hemat = rule_cost - ml_cost
layak = hemat > 0

print(f"rule=Rp{rule_cost:,}  ml=Rp{ml_cost:,}  tanpa_model=Rp{none_cost:,}  hemat_vs_rule=Rp{hemat:,}  layak={layak}".replace(",", "."))`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`rule_cost` = Rp1.034.000.000",
            "name": "rule_cost",
            "value": 1034000000,
            "tol": 1,
            "msg": "FN 480 x Rp2jt + FP 460 x Rp150rb + Rp5jt = Rp1.034jt.",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`ml_cost` = Rp547.600.000",
            "name": "ml_cost",
            "value": 547600000,
            "tol": 1,
            "msg": "FN 240 x Rp2jt + FP 184 x Rp150rb + Rp40jt = Rp547,6jt.",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`none_cost` = Rp1.600.000.000",
            "name": "none_cost",
            "value": 1600000000,
            "tol": 1,
            "msg": "Tanpa model: 800 gagal bayar lolos x Rp2jt.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`hemat` = Rp486.400.000",
            "name": "hemat",
            "value": 486400000,
            "tol": 1,
            "msg": "Bandingkan ML dengan alternatif terbaik (rule-based), bukan dengan tanpa model.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan vonis layak",
            "pattern": "layak=True",
            "msg": "Format: rule=Rp...  ml=Rp...  tanpa_model=Rp...  hemat_vs_rule=Rp...  layak=....",
          },
        ],
      },
      reference: "Framing = masalah bisnis → tugas ML → metrik bisnis → biaya kesalahan → uji kelayakan (data, biaya, nilai).",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bank Arus: model 94% yang mengantre 3 minggu",
      prose: [
        "Bank Arus punya model credit scoring dengan akurasi 94% — terbaik yang pernah mereka buat. Masalah: setiap retraining butuh 3 minggu kerja manual (tarik data, bersihkan, training, validasi, deploy). Akibatnya model hanya di-retrain 2x setahun.",
        "Datanya: portofolio Rp800 miliar, NPL naik dari 2,1% ke 3,4% dalam 6 bulan terakhir. Analisis menunjukkan 60% dari kenaikan NPL berasal dari segmen yang perilakunya bergeser 4 bulan lalu — model yang dipakai masih 'percaya' pada pola lama.",
        "Pertanyaan: (a) Berapa estimasi kerugian dari keterlambatan deteksi? (b) Apa intervensi MLE yang paling berdampak — menaikkan akurasi ke 95% atau memangkas siklus retrain ke 2 hari?",
        "Pembahasan: (a) Kenaikan NPL 1,3 poin dari Rp800 miliar ≈ Rp10,4 miliar eksposur bermasalah tambahan; 60%-nya ≈ Rp6,2 miliar terkait pola yang sudah bergeser 4 bulan. (b) Memangkas siklus retrain jauh lebih berdampak: model 94% yang segar mengalahkan model 95% yang basi 6 bulan. Inilah inti MLE — kecepatan dan keandalan siklus mengalahkan akurasi marginal.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam risiko kredit, model basi adalah risiko model (model risk) yang nyata: keputusan kredit diambil berdasarkan dunia yang sudah tidak ada. Regulator (OJK/Basel) mensyaratkan validasi dan monitoring berkala justru karena alasan ini.",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi menjelaskan alasannya.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Akar masalah paling umum kenapa model bagus tidak pernah produksi?",
          options: [
            {
              text: "Akurasi model kurang tinggi",
              why: "Akurasi 99% pun tidak menolong kalau tidak ada cara menjalankannya di produksi.",
            },
            {
              text: "Tidak ada pipeline produksi yang andal",
              why: "Data manual, environment tak terkunci, dan tanpa monitoring adalah pembunuh nomor satu model.",
              correct: true,
            },
            {
              text: "Kurang data training",
              why: "Itu masalah modeling, bukan masalah deploy — modelnya sudah jadi dan bagus.",
            },
            {
              text: "Komputasi terlalu mahal",
              why: "Biaya komputasi jarang menjadi penghalang utama dibanding tidak adanya jalur deploy.",
            },
          ],
        },
        {
          q: "Perbedaan notebook vs produksi yang PALING berbahaya jika diabaikan?",
          options: [
            {
              text: "Ukuran font di notebook",
              why: "Tidak relevan dengan kebenaran prediksi.",
            },
            {
              text: "Data produksi berubah dan bisa corrupt",
              why: "Skema berubah diam-diam menghasilkan prediksi sampah tanpa error — kegagalan sunyi yang paling mahal.",
              correct: true,
            },
            {
              text: "Notebook tidak bisa dibuka di HP",
              why: "Kenyamanan, bukan kebenaran sistem.",
            },
            {
              text: "Warna chart berbeda",
              why: "Kosmetik, tidak memengaruhi model.",
            },
          ],
        },
        {
          q: "Tanggung jawab utama seorang MLE adalah…",
          options: [
            {
              text: "Mencari arsitektur model terbaru",
              why: "Itu wilayah riset/data scientist.",
            },
            {
              text: "Menulis query SQL untuk dashboard",
              why: "Itu wilayah data engineer/analyst.",
            },
            {
              text: "Memastikan model berjalan andal, terpantau, dan bisa di-rollback di produksi",
              why: "Tepat: training reproducible, serving, monitoring, dan rollback adalah inti peran MLE.",
              correct: true,
            },
            {
              text: "Mendesain logo produk",
              why: "Bukan wilayah MLE.",
            },
          ],
        },
        {
          q: "SLO 250ms, total komponen 200ms. Headroom dan artinya?",
          options: [
            {
              text: "50ms / 20% — masih ada ruang, tapi model 2x lebih lambat tidak muat",
              why: "50/250 = 20%. Cukup untuk fluktuasi, tidak cukup untuk model yang jauh lebih berat.",
              correct: true,
            },
            {
              text: "50ms / 80% — sangat longgar",
              why: "50/250 = 20%, bukan 80%. Hitung lagi pembaginya.",
            },
            {
              text: "0ms — sudah pas",
              why: "Sisa = 250 − 200 = 50ms, bukan 0.",
            },
            {
              text: "450ms — dijumlahkan",
              why: "SLO bukan dijumlah dengan komponen; sisa = SLO − total.",
            },
          ],
        },
        {
          q: "Validasi format KTP di form pendaftaran sebaiknya memakai…",
          options: [
            {
              text: "Deep learning terbaru",
              why: "Berlebihan: aturannya eksak, ML hanya menambah ketidakpastian dan biaya.",
            },
            {
              text: "Rule-based (regex + checksum)",
              why: "Tepat: masalah deterministik dengan aturan stabil tidak butuh ML.",
              correct: true,
            },
            {
              text: "LLM via API",
              why: "Mahal, lambat, dan tidak deterministik untuk validasi format.",
            },
            {
              text: "Clustering",
              why: "Clustering untuk segmentasi, bukan validasi format eksak.",
            },
          ],
        },
        {
          q: "Kasus pinjaman mikro (ilustratif): tanpa model Rp1.600 juta/bulan, rule-based Rp1.034 juta, model ML Rp547,6 juta. Vonis framing yang benar?",
          options: [
            {
              text: "ML layak — hemat Rp486,4 juta/bulan dibanding alternatif terbaik (rule-based)",
              why: "Tepat: bandingkan dengan alternatif terbaik yang ada, bukan dengan tanpa model; hematnya Rp1.034jt dikurangi Rp547,6jt.",
              correct: true,
            },
            {
              text: "ML layak karena akurasinya pasti paling tinggi",
              why: "Akurasi tidak pernah dihitung di framing ini — kelayakan dihitung dari rupiah, bukan dari akurasi.",
            },
            {
              text: "ML tidak layak — biaya operasinya Rp40 juta, paling mahal",
              why: "Biaya operasi saja bukan vonis: total biaya ML tetap paling rendah karena ia memangkas kerugian gagal bayar.",
            },
            {
              text: "Pilih tanpa model — paling sederhana",
              why: "Paling sederhana tetapi paling mahal: Rp1.600 juta per bulan kerugian yang tidak dicegah.",
            },
          ],
        },
      ],
      summary: [
        "Problem framing: masalah bisnis → tugas ML → metrik sukses bisnis → biaya kesalahan → uji kelayakan (data, biaya, nilai).",
        "Kelayakan dihitung dari rupiah per bulan, bukan dari akurasi; bandingkan ML dengan alternatif terbaik yang ada.",
        "87% model tidak pernah produksi — penyebab utamanya infrastruktur dan proses, bukan matematika.",
        "Notebook vs produksi berbeda dalam 5 dimensi: data, eksekusi, dependensi, skala, akuntabilitas.",
        "MLE = memastikan model berjalan andal di produksi; DS = mencari model terbaik; DE = aliran data.",
        "Funnel tipikal: ~5% eksperimen mencapai produksi; bottleneck terbesar di validasi offline.",
        "Latency budget: jumlahkan komponen, sisakan headroom; 0% headroom = SLO pasti jebol.",
        "Tidak semua masalah butuh ML: cek kompleksitas pola, ketersediaan data, dan nilai bisnis dulu.",
      ],
      next: { label: "MLE2 — Data Pipeline & Feature Engineering", href: "/v2/learn/mle2-data-pipeline" },
    },
  ],
};
