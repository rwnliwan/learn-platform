import type { V2Lesson } from "../lib/types";

export const bi26: V2Lesson = {
  slug: "bi26-bioconductor",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "BI26 · Ekosistem Bioconductor: GenomicRanges, SummarizedExperiment dan DESeq2",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga analis, tiga jawaban, satu dataset yang sama",
      prose: [
        "Sebuah konsorsium mengirim satu dataset RNA-seq ke tiga analis. Analis pertama melaporkan 214 gen differential expression. Analis kedua: 187 gen. Analis ketiga: 260 gen. Dataset-nya sama, pertanyaannya sama — yang berbeda adalah wadahnya: count disimpan di satu file, metadata sampel di file lain, koordinat gen di file ketiga, dan setiap analis menggabungkannya dengan caranya sendiri. Satu analis kehilangan dua sampel saat menggabungkan karena nama kolomnya beda satu huruf. Satu analis lagi menormalisasi dua kali tanpa sadar. Tidak ada yang berbohong — tetapi tidak ada yang bisa mengulang pekerjaan yang lain.",
        "Bioconductor adalah jawaban ekosistem R untuk masalah ini: satu wadah bersama tempat count, metadata, dan koordinat genomik tinggal bersama dan bergerak bersama. Lesson ini membedah tiga pilarnya: GenomicRanges untuk interval genomik, SummarizedExperiment untuk wadah data, dan DESeq2 sebagai analisis yang hidup di dalam wadah itu. BI5 sudah menyebut Bioconductor sebagai kotak perkakas standar dan BI9 sudah membedah statistik DESeq2 (negative binomial dan shrinkage) — tetapi tidak ada lesson yang mengajarkan cara kerja wadahnya: bagaimana satu objek menjaga count, metadata, dan koordinat tetap konsisten, dan bagaimana analisis reprodusibel dibangun di atasnya. Setelah lesson ini kamu bisa: (1) menjelaskan interval genomik dan operasi overlap; (2) membangun SummarizedExperiment dan menjelaskan kenapa subsetting-nya aman; (3) menjalankan alur DESeq2 dari dalam wadah sampai log2 fold change; (4) membuat analisis yang bisa diulang orang lain (vignette dan sessionInfo).",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada di track ini",
        body: "BI5 memperkenalkan Bioconductor sebagai standar (2.300 paket lebih, rumah DESeq2). BI9 membedah model statistik DESeq2 — negative binomial, dispersi per gen, shrinkage — tetapi sebagai rumus, bukan sebagai alur kerja di dalam wadah. Lesson ini mengajarkan wadah dan alurnya; rumusnya dirujuk ke BI9, bukan diulang.",
      },
      reference: "GenomicRanges = interval genomik. SummarizedExperiment = satu wadah untuk count + metadata + koordinat. DESeq2 = analisis yang hidup di wadah itu.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca vignette Bioconductor dan mengikuti alur analisis genomik di R tanpa tersesat di antara file-file yang terpisah.",
        "(1) Menjelaskan interval genomik (kromosom, start, end, strand) dan operasi overlap antar interval;",
        "(2) Menjelaskan struktur SummarizedExperiment — assay, colData, rowData dan rowRanges — dan kenapa subsetting sampel otomatis memotong assay;",
        "(3) Menghitung size factor median-of-ratios dan log2 fold change dari count mentah di dalam logika wadah;",
        "(4) Menjelaskan praktik reprodusibilitas Bioconductor: vignette, BiocManager, dan sessionInfo.",
      ],
      tasks: [],
    },
    {
      id: "genomic-ranges",
      eyebrow: "Langkah 3 · Teori",
      title: "GenomicRanges: interval sebagai warga kelas satu",
      prose: [
        "Sebagian besar data genomik adalah interval: gen menempati chr1 dari 100 sampai 200, puncak ChIP menempati chr1 dari 180 sampai 320, varian menempati satu posisi. GenomicRanges (paket GRanges) menjadikan interval sebagai objek kelas satu: tiap interval punya kromosom (seqname), start, end, strand, dan metadata. Operasi yang paling sering dipakai adalah overlap: interval mana yang tumpang tindih dengan interval lain — misalnya gen mana yang tumpang tindih dengan puncak ChIP hasil eksperimenmu.",
        "Contoh dari lab: empat gen — g1 di chr1 100 sampai 200, g2 di chr1 150 sampai 250, g3 di chr1 300 sampai 400, g4 di chr2 50 sampai 150. Daerah query chr1 180 sampai 320 tumpang tindih dengan TIGA gen: g1 (bertemu di 180 sampai 200), g2 (150 sampai 250 sepenuhnya di dalam daerah tanya), dan g3 (bertemu di 300 sampai 320). Gen g4 tidak terhitung — kromosomnya berbeda (chr2), walau koordinatnya tumpang tindih secara angka. Inilah kesalahan paling umum analis baru: membandingkan koordinat tanpa memeriksa kromosom. Interval tanpa kromosom adalah angka tanpa alamat.",
        "Dua aturan praktis yang menyelamatkan banyak analisis. Pertama, sistem koordinat: GenomicRanges memakai 1-based dan ujung inklusif (posisi 100 sampai 200 berarti 101 huruf), sementara format BED memakai 0-based dan ujung eksklusif. Mencampur keduanya tanpa konversi menggeser semua interval satu huruf — cukup untuk membuat varian 'di dalam gen' menjadi 'di luar gen'. Kedua, strand: interval di strand minus dibaca dari arah berlawanan; operasi yang mengabaikan strand akan menggabungkan gen yang sebenarnya saling berhadapan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membandingkan koordinat lintas kromosom. chr1 100 sampai 200 dan chr2 100 sampai 200 adalah dua tempat yang sama sekali berbeda — seperti Jalan Merdeka nomor 100 di dua kota berbeda. Selalu sertakan kromosom dalam setiap perbandingan interval.",
      },
      reference: "Interval = kromosom + start + end + strand. Overlap selalu memeriksa kromosom dulu.",
    },
    {
      id: "summarized-experiment",
      eyebrow: "Langkah 4 · Teori",
      title: "SummarizedExperiment: satu wadah, satu kebenaran",
      prose: [
        "SummarizedExperiment adalah wadah yang menyatukan tiga hal. Pertama, assay: matriks count (gen sebagai baris, sampel sebagai kolom). Kedua, colData: metadata sampel — kondisi, batch, usia, apa pun yang menjelaskan kolom. Ketiga, rowData atau rowRanges: metadata gen — nama, koordinat genomik (GRanges), panjang. Ketiga bagian ini TERIKAT: nama baris assay harus cocok dengan baris rowData, nama kolom assay harus cocok dengan baris colData. Bila tidak cocok, objeknya tidak bisa dibuat — dan itu fitur, bukan bug.",
        "Ikatan ini yang menyelesaikan tragedi di cerita pembuka. Membuang satu sampel dari wadah otomatis membuang kolom assay-nya DAN baris colData-nya — tidak mungkin lagi ada sampel yang terbuang dari count tetapi tertinggal di metadata (atau sebaliknya). Mengurutkan ulang sampel di colData otomatis mengurutkan ulang kolom assay. Analis yang bekerja dengan tiga file terpisah harus menjaga sinkronisasi ini dengan disiplin manual; analis yang bekerja di dalam wadah mendapatkannya gratis dari struktur datanya.",
        "Pola yang sama dipakai di seluruh Bioconductor: SingleCellExperiment (turunan untuk single-cell, BI11) menambahkan reducedDim untuk PCA dan UMAP; RaggedExperiment untuk data yang panjangnya tidak seragam. Belajar satu wadah berarti belajar pola seluruh ekosistem — dan pola ini juga alasan kenapa tool Bioconductor bisa saling berbicara: DESeq2 menerima SummarizedExperiment, dan hasilnya kembali sebagai objek yang membawa metadata yang sama.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke BI9",
        body: "DESeq2 menerima SummarizedExperiment sebagai masukan: assay count mentah plus colData yang berisi desain (misal kondisi kontrol vs perlakuan). Statistik di dalamnya — negative binomial, dispersi, shrinkage — sudah dibedah di BI9. Di sini fokusnya adalah wadah dan alurnya, bukan rumusnya.",
      },
      reference: "Assay + colData + rowRanges, terikat namanya. Buang sampel = assay dan metadata ikut terbuang bersama.",
    },
    {
      id: "deseq2-alur",
      eyebrow: "Langkah 5 · Teori",
      title: "DESeq2 dari dalam wadah: normalisasi, model, visualisasi",
      prose: [
        "Alur DESeq2 dari dalam wadah punya empat langkah yang berurutan. Pertama, size factor dengan median-of-ratios: untuk tiap gen, hitung rasio count sampel terhadap rata-rata geometrik lintas sampel, lalu ambil MEDIAN rasio itu sebagai faktor skala sampel. Median kebal terhadap segelintir gen yang sangat berubah — asumsi intinya mayoritas gen tidak berubah antar kondisi (BI9). Pada contoh lab, size factor-nya 0,71, 1,41, 0,71, 1,41 — sampel kedua dan keempat disekuensing dua kali lebih dalam, dan normalisasi mengoreksi tepat itu.",
        "Kedua, model negative binomial dengan dispersi per gen dan shrinkage (BI9): count mentah dibagi size factor menjadi count ternormalisasi, lalu model menguji perubahan antar kondisi. Pada contoh lab, gen g4 ternormalisasi menjadi 14,14, 14,14 di kontrol dan 42,43, 42,43 di perlakuan — fold change tepat 3,0, log2 fold change 1,58. Angka yang bersih ini bukan kebetulan: contoh dirancang agar size factor-nya mengoreksi perbedaan depth secara tepat, sehingga yang tersisa adalah biologi.",
        "Ketiga, visualisasi dari wadah yang sama: MA plot (rata-rata vs fold change) untuk melihat bias, volcano plot (fold change vs nilai p) untuk melihat temuan, heatmap count ternormalisasi (VST atau rlog) untuk melihat pola. Keempat, reprodusibilitas: analisis ditulis sebagai vignette (dokumen R Markdown yang bisa dijalankan ulang), paket dikunci versinya lewat BiocManager, dan sessionInfo dicetak di akhir — siapa pun yang menjalankan ulang dengan versi paket yang sama mendapat angka yang sama. Paper yang melampirkan sessionInfo memberi pembaca kunci untuk mengulang; paper yang tidak, memberi pembaca tebak-tebakan.",
      ],
      tasks: [],
      formula: String.raw`s_j = \text{median}_i \frac{K_{ij}}{(\prod_{v} K_{iv})^{1/m}}`,
      formulaNote: "Size factor sampel j = median lintas gen dari rasio count terhadap rata-rata geometrik lintas sampel. Contoh lab: 0,71, 1,41, 0,71, 1,41 — gen g4 ternormalisasi 14,14 vs 42,43, fold change 3,0, log2FC 1,58.",
      note: {
        title: "Sering salah",
        body: "Menjalankan DESeq2 pada TPM atau count yang sudah dinormalisasi. DESeq2 butuh count MENTAH — model negative binomial-nya memakai informasi depth asli untuk mengestimasi dispersi. Memberinya TPM sama dengan memberi tahu model bahwa semua sampel punya depth sama, padahal tidak (BI9).",
      },
      reference: "Count mentah + desain di colData menjadi DESeq2; keluarannya log2FC + padj; visualisasi dari wadah yang sama.",
    },
    {
      id: "lab-bioconductor",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: wadah SummarizedExperiment dan size factor DESeq2",
      prose: [
        "Lab ini meniru wadah SummarizedExperiment dalam Python — karena mesin lab di sini menjalankan Python, sementara R ditampilkan sebagai kode referensi di bawah. Datanya: 4 gen (g1 sampai g4) dan 4 sampel (C1, C2 kontrol; T1, T2 perlakuan). Count mentah: g1 100, 200, 100, 200; g2 50, 100, 50, 100; g3 200, 400, 200, 400; g4 10, 20, 30, 60. Koordinat: g1 chr1 100 sampai 200, g2 chr1 150 sampai 250, g3 chr1 300 sampai 400, g4 chr2 50 sampai 150. Daerah query: chr1 180 sampai 320.",
        "Tugasmu ada tiga. Pertama, hitung size factor median-of-ratios: rata-rata geometrik tiap gen, rasio tiap sampel, lalu median — hasilnya 0,71, 1,41, 0,71, 1,41. Kedua, normalisasi gen g4 dan hitung log2 fold change-nya: 14,14 lawan 42,43, fold change 3,0, log2FC 1,58. Ketiga, hitung overlap: berapa gen yang tumpang tindih dengan daerah query chr1 180 sampai 320 — jawabannya 3 (g1, g2, g3; g4 gugur karena kromosomnya chr2).",
        "Kode R yang setara dengan lab ini (ditulis dengan tanda sama dengan agar tampil benar; gaya umum R memakai panah, dan pipe R ditulis tanpa spasi di sini agar mudah dibaca): se sama dengan SummarizedExperiment(assays sama dengan list(counts sama dengan hitung), colData sama dengan meta, rowRanges sama dengan gr); dds sama dengan DESeqDataSet(se, design sama dengan kondisi); dds sama dengan DESeq(dds); hasil sama dengan results(dds). Empat baris itu adalah seluruh alur — wadahnya yang bekerja.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sf` = size factor median-of-ratios tiap sampel (bulatkan 2 desimal)" },
        { id: "t2", text: "Normalisasi gen g4 dengan size factor, lalu hitung `log2fc` = log2(rata-rata perlakuan / rata-rata kontrol)" },
        { id: "t3", text: "Hitung `overlap` = jumlah gen yang tumpang tindih dengan daerah chr1 180-320 (kromosom harus sama)" },
        { id: "t4", text: "Cetak sf, log2fc, dan overlap" },
      ],
      expected: "sf=[0.71, 1.41, 0.71, 1.41]\nlog2fc_g4=1.58\noverlap=3",
      hints: [
        "Rata-rata geometrik: hasil kali semua count pangkat 1/4 — untuk g1: (100 x 200 x 100 x 200) pangkat 1/4 = 141,42.",
        "Size factor tiap sampel = median dari 4 rasio (satu per gen). Median dari [0,71, 0,71, 0,71, 0,41] adalah 0,71.",
        "Normalisasi g4: 10/0,71 = 14,14; 20/1,41 = 14,14; 30/0,71 = 42,43; 60/1,41 = 42,43.",
        "Overlap: interval tumpang tindih bila start gen tidak lebih dari end query DAN end gen tidak kurang dari start query, dengan kromosom sama.",
      ],
      code: {
        starter: `import math\nimport statistics\n\n# Assay: count mentah (gen x sampel: C1, C2 kontrol; T1, T2 perlakuan)\ncounts = {\n    "g1": [100, 200, 100, 200],\n    "g2": [50, 100, 50, 100],\n    "g3": [200, 400, 200, 400],\n    "g4": [10, 20, 30, 60],\n}\n# rowRanges: (kromosom, start, end)\ngranges = {\n    "g1": ("chr1", 100, 200),\n    "g2": ("chr1", 150, 250),\n    "g3": ("chr1", 300, 400),\n    "g4": ("chr2", 50, 150),\n}\nquery = ("chr1", 180, 320)\n\n# t1: size factor median-of-ratios\nsf = []  # TULIS KODEMU: rata-rata geometrik per gen, rasio, lalu median per sampel\n\n# t2: normalisasi g4 + log2 fold change\nlog2fc = 0.0  # TULIS KODEMU: count g4 dibagi sf, rata-rata per kelompok, log2 rasio\n\n# t3: overlap interval\noverlap = 0  # TULIS KODEMU: hitung gen yang tumpang tindih dengan query (kromosom sama)\n\nprint(f"sf={[round(x, 2) for x in sf]}")\nprint(f"log2fc_g4={log2fc:.2f}")\nprint(f"overlap={overlap}")`,
        lockLines: 0,
        solution: `import math\nimport statistics\n\n# Assay: count mentah (gen x sampel: C1, C2 kontrol; T1, T2 perlakuan)\ncounts = {\n    "g1": [100, 200, 100, 200],\n    "g2": [50, 100, 50, 100],\n    "g3": [200, 400, 200, 400],\n    "g4": [10, 20, 30, 60],\n}\n# rowRanges: (kromosom, start, end)\ngranges = {\n    "g1": ("chr1", 100, 200),\n    "g2": ("chr1", 150, 250),\n    "g3": ("chr1", 300, 400),\n    "g4": ("chr2", 50, 150),\n}\nquery = ("chr1", 180, 320)\n\n# t1: size factor median-of-ratios\ngeo = {g: math.prod(v) ** (1 / 4) for g, v in counts.items()}\nsf = []\nfor j in range(4):\n    rasio = sorted(counts[g][j] / geo[g] for g in counts)\n    sf.append(statistics.median(rasio))\n\n# t2: normalisasi g4 + log2 fold change\nnorm_g4 = [counts["g4"][j] / sf[j] for j in range(4)]\nkontrol = (norm_g4[0] + norm_g4[1]) / 2\nperlakuan = (norm_g4[2] + norm_g4[3]) / 2\nlog2fc = math.log2(perlakuan / kontrol)\n\n# t3: overlap interval\nq_chr, q_start, q_end = query\noverlap = 0\nfor g, (c, s, e) in granges.items():\n    if c == q_chr and s <= q_end and e >= q_start:\n        overlap += 1\n\nprint(f"sf={[round(x, 2) for x in sf]}")\nprint(f"log2fc_g4={log2fc:.2f}")\nprint(f"overlap={overlap}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sf", value: [0.71, 1.41, 0.71, 1.41], tol: 0.01, label: "Size factor = [0.71, 1.41, 0.71, 1.41]", msg: "Rata-rata geometrik g1 = 141,42; rasio C1 = 100/141,42 = 0,71. Median 4 rasio per sampel memberi 0,71, 1,41, 0,71, 1,41." },
          { kind: "equal", task: "t2", name: "log2fc", value: 1.58, tol: 0.01, label: "log2FC g4 = 1.58 (fold change 3,0)", msg: "g4 ternormalisasi 14,14 vs 42,43 — fold change 3,0, log2(3) = 1,58." },
          { kind: "equal", task: "t3", name: "overlap", value: 3, label: "Overlap dengan chr1 180-320 = 3 gen", msg: "g1, g2, g3 tumpang tindih; g4 gugur karena kromosomnya chr2, walau koordinatnya tumpang tindih secara angka." },
        ],
      },
      reference: "Size factor 0,71, 1,41, 0,71, 1,41. log2FC g4 = 1,58. Overlap chr1 180-320 = 3 gen.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: tool apa untuk pertanyaan apa",
      prose: [
        "Skenario 1 — 'Gen mana yang tumpang tindih dengan puncak ChIP hasil eksperimenku?' → GenomicRanges + findOverlaps. Alasan: operasi interval dengan kromosom dan strand yang benar. Contoh nyata: anotasi puncak ATAC-seq ke gen terdekat.",
        "Skenario 2 — 'Analisis RNA-seq lengkap dari count mentah sampai daftar DE yang bisa diulang.' → SummarizedExperiment + DESeq2 + vignette. Alasan: satu wadah menjaga konsistensi, DESeq2 modelnya standar, vignette membuat orang lain bisa mengulang. Contoh nyata: analisis konsorsium yang dikirim ke tiga analis dan memberi satu jawaban.",
        "Skenario 3 — 'Visualisasi publikasi: volcano plot dan heatmap dari hasil DE.' → Hasil DESeq2 + ggplot2 di dalam R. Alasan: gramatika grafik R dirancang untuk statistik; satu baris geom menggantikan puluhan baris matplotlib (BI5). Contoh nyata: gambar suplemen multi-panel untuk jurnal.",
        "Skenario 4 — 'Pipeline NGS end-to-end (QC, align, count) sebelum analisis statistik.' → BUKAN Bioconductor — itu urusan pipeline shell dan Python (BI4, BI8). Alasan: Bioconductor adalah rumah analisis statistik genomik, bukan rumah engineering pipeline. Memaksakan semuanya ke R membuang keunggulan kedua bahasa.",
        "Aturan praktis 10 detik: pertanyaannya statistik genomik dan jawabannya harus bisa diulang? → Bioconductor. Pertanyaannya engineering (parsing, pipeline, API)? → Python (BI5). Bilingual, bukan fanatik satu bahasa.",
      ],
      tasks: [],
      reference: "Overlap → GenomicRanges. RNA-seq lengkap → SummarizedExperiment + DESeq2. Pipeline → Python/shell, bukan R.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: daftar DE yang berubah setiap kali dihitung ulang",
      prose: [
        "Sebuah lab melaporkan 214 gen DE pada Senin, 187 gen pada Rabu — dari dataset yang sama, analis yang sama, script yang sama. Penyelidikan menemukan tiga penyebab sekaligus. Pertama, metadata sampel disimpan di spreadsheet yang diedit diam-diam (satu sampel pindah batch tanpa jejak). Kedua, count dinormalisasi dua kali: TPM dulu, lalu DESeq2 di atasnya — melanggar syarat count mentah (BI9). Ketiga, versi paket tidak dicatat, dan DESeq2 ter-update di antara Senin dan Rabu.",
        "Perbaikan ketiganya memakai wadah: (1) metadata masuk colData di dalam SummarizedExperiment — mengedit spreadsheet terpisah tidak lagi memengaruhi analisis; (2) assay berisi count mentah, dan normalisasi hanya terjadi di dalam DESeq2; (3) analisis ditulis sebagai vignette dengan sessionInfo di akhir, dan paket dikunci lewat BiocManager. Setelah perbaikan, angka Senin dan Rabu sama persis: 203 gen — dan kali ini bisa dibuktikan kenapa 203, bukan 214 atau 187.",
        "Pembahasan: perhatikan bahwa perbaikan ini bukan soal statistik yang lebih canggih — modelnya sama (DESeq2, BI9). Perbaikannya adalah soal WADAH dan JEJAK: satu objek yang konsisten, satu dokumen yang bisa dijalankan ulang, satu daftar versi paket. Sebagian besar 'ketidakreprodusibelan' dalam bioinformatika adalah masalah wadah, bukan masalah matematika.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga perbaikan: metadata ke colData (tidak ada lagi edit diam-diam), assay berisi count mentah (tidak ada normalisasi ganda), vignette + sessionInfo + BiocManager (versi paket terkunci). Hasilnya stabil di 203 gen — dan bisa dibuktikan kenapa 203.",
      },
      reference: "Reprodusibilitas = wadah konsisten + count mentah + versi paket terkunci. Bukan statistik yang lebih canggih.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "GenomicRanges: interval = kromosom + start + end + strand; overlap selalu memeriksa kromosom dulu.",
        "SummarizedExperiment: assay + colData + rowRanges terikat nama — buang sampel berarti assay dan metadata ikut terbuang bersama.",
        "DESeq2: count mentah + size factor median-of-ratios; lab: size factor 0,71, 1,41, 0,71, 1,41 dan log2FC g4 = 1,58.",
        "Visualisasi (MA, volcano, heatmap) dan reprodusibilitas (vignette, BiocManager, sessionInfo) adalah bagian dari analisis, bukan hiasan.",
        "Pipeline engineering tetap di Python/shell (BI4, BI8); Bioconductor adalah rumah statistik genomik.",
      ],
      next: { label: "BI27 · Gene Ontology dan Pathway Enrichment: dari Daftar Gen ke Makna Biologi", href: "/v2/learn/bi27-enrichment" },
      quiz: [
        {
          q: "Kenapa membuang satu sampel dari SummarizedExperiment otomatis membuang kolom assay-nya juga?",
          options: [
            { text: "Karena R menghapus data secara acak saat objek diubah", why: "Salah: tidak ada yang acak. Keterikatan nama baris dan kolom adalah desain wadah — assay dan metadata bergerak bersama." },
            { text: "Karena assay, colData, dan rowData terikat oleh nama baris dan kolom — wadah menjaga ketiganya tetap konsisten", why: "Tepat: itulah gunanya wadah. Tidak mungkin lagi ada sampel yang terbuang dari count tetapi tertinggal di metadata.", correct: true },
            { text: "Karena DESeq2 membutuhkan jumlah sampel yang tetap", why: "Salah: DESeq2 bisa menangani berapa pun jumlah sampel. Yang dijaga wadah adalah konsistensi, bukan jumlah." },
            { text: "Karena file count dan metadata disimpan dalam satu file fisik", why: "Salah: wadah adalah struktur di memori, bukan satu file. Keterikatannya logis (nama yang cocok), bukan fisik." },
          ],
        },
        {
          q: "Gen g4 di chr2 50 sampai 150. Daerah query chr1 180 sampai 320. Apakah keduanya tumpang tindih?",
          options: [
            { text: "Ya — 150 berada di antara 180 dan 320 bila dihitung dari ujungnya", why: "Salah: 150 tidak berada di antara 180 dan 320, dan yang lebih mendasar: kromosomnya berbeda. Koordinat tanpa kromosom adalah angka tanpa alamat." },
            { text: "Tidak — kromosom berbeda berarti tempat berbeda, walau angkanya tumpang tindih", why: "Tepat: chr1 dan chr2 adalah kromosom berbeda. Overlap selalu memeriksa kromosom dulu, baru koordinat.", correct: true },
            { text: "Ya — bila strand-nya diabaikan, semua interval di semua kromosom bisa dibandingkan", why: "Salah: mengabaikan strand saja sudah salah; mengabaikan kromosom lebih salah lagi. Interval tanpa kromosom tidak punya arti." },
            { text: "Tidak bisa ditentukan tanpa mengetahui panjang gennya", why: "Salah: panjang sudah diketahui dari start dan end (50 sampai 150). Yang menentukan adalah kromosom — dan itu berbeda." },
          ],
        },
        {
          q: "Analis menjalankan DESeq2 pada TPM, bukan count mentah. Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah — TPM lebih akurat karena sudah dinormalisasi panjang gen", why: "Salah: DESeq2 butuh count mentah. Model negative binomial-nya memakai informasi depth asli untuk mengestimasi dispersi — TPM menghapus informasi itu." },
            { text: "DESeq2 mengasumsikan count mentah; TPM membuatnya mengira semua sampel punya depth sama, sehingga estimasi dispersinya salah", why: "Tepat: normalisasi ganda (TPM lalu DESeq2) merusak model. TPM untuk visualisasi, count mentah untuk uji (BI9).", correct: true },
            { text: "TPM membuat DESeq2 berjalan lebih lambat", why: "Salah: kecepatan bukan masalahnya. Masalahnya adalah model statistik yang diberi data yang sudah diubah bentuknya." },
            { text: "DESeq2 tidak bisa membaca TPM karena format filenya berbeda", why: "Salah: DESeq2 menerima matriks angka apa pun. Masalahnya bukan format, melainkan asumsi statistik yang dilanggar." },
          ],
        },
        {
          q: "Size factor sampel kedua di lab adalah 1,41. Apa artinya?",
          options: [
            { text: "Sampel kedua punya ekspresi gen 41 persen lebih tinggi dari sampel lain", why: "Salah: size factor mengukur DEPTH sekuensing, bukan biologi. Sampel kedua disekuensing lebih dalam — bukan gen-nya lebih aktif." },
            { text: "Sampel kedua disekuensing sekitar 41 persen lebih dalam, dan count-nya dibagi 1,41 agar sebanding", why: "Tepat: median-of-ratios mengestimasi perbedaan teknis (depth), lalu mengoreksinya. Yang tersisa setelah koreksi adalah biologi.", correct: true },
            { text: "Sampel kedua mengandung 41 persen gen lebih banyak", why: "Salah: jumlah gen sama di semua sampel. Size factor tidak menghitung gen — ia menghitung skala count." },
            { text: "Sampel kedua harus dibuang karena terlalu berbeda", why: "Salah: perbedaan depth adalah hal normal yang dikoreksi normalisasi, bukan alasan membuang sampel. Yang dibuang adalah sampel yang gagal QC (BI8)." },
          ],
        },
        {
          q: "Sebuah paper melampirkan script analisis tetapi tanpa sessionInfo dan tanpa versi paket. Apa risikonya?",
          options: [
            { text: "Tidak ada — script yang sama selalu memberi hasil yang sama", why: "Salah: versi paket yang berbeda bisa memberi hasil berbeda (DESeq2 pernah berubah perilakunya antar versi). Tanpa versi, pengulangan adalah tebak-tebakan." },
            { text: "Orang lain tidak bisa mengulang dengan jaminan hasil sama — versi paket yang berbeda bisa mengubah angka", why: "Tepat: reprodusibilitas butuh tiga hal: data, kode, DAN versi lingkungan. sessionInfo dan BiocManager mengunci yang ketiga.", correct: true },
            { text: "Paper itu otomatis ditolak jurnal", why: "Salah: tidak ada aturan otomatis seperti itu. Risikonya adalah ilmiah (tidak bisa diulang), bukan administratif." },
            { text: "Script-nya tidak bisa dijalankan di komputer lain", why: "Salah: script-nya bisa jalan — hanya saja hasilnya bisa berbeda. Itulah yang lebih berbahaya: jalan tanpa error, tetapi angkanya bergeser diam-diam." },
          ],
        },
      ],
    },
  ],
};
