import type { V2Lesson } from "../lib/types";

export const bi30: V2Lesson = {
  slug: "bi30-galaxy",
  track: "Bioinformatika",
  module: "Reprodusibilitas & Etika",
  title: "BI30 — Platform Galaxy: Analisis Genomik Tanpa Baris Perintah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "50 sampel, 4 tool, 65 menit — dan nol baris perintah",
      prose: [
        "Seorang peneliti biologi punya 50 sampel RNA-seq dan tidak bisa menulis skrip. Rekannya memberi alur kerja Galaxy: unggah FASTQ, jalankan FastQC (5 menit), Trimmomatic (12 menit), HISAT2 (40 menit), featureCounts (8 menit) — total serial 65 menit per sampel. Biayanya 0,12 dolar per menit komputasi: 7,80 dolar per sampel, 390 dolar untuk 50 sampel. Penyimpanan: 8 GB per sampel, 400 GB total.",
        "Yang membuat Galaxy berbeda bukan tool-nya — tool yang sama tersedia di baris perintah — melainkan JEJAKNYA. Tiap langkah tercatat: tool apa, versi berapa, parameter apa, data apa yang masuk dan keluar. Enam bulan kemudian, reviewer meminta analisis diulang dengan parameter trimming yang berbeda. Peneliti itu tidak membuka catatan lab yang hilang — ia membuka history Galaxy dan menekan tombol rerun.",
        "Lesson ini mengajarkan platform Galaxy: history, workflow, ToolShed, dan reprodusibilitas. Setelah lesson ini kamu bisa: (1) menjelaskan tiga konsep inti Galaxy — history, workflow, dan ToolShed; (2) membangun alur kerja RNA-seq standar di Galaxy; (3) menghitung waktu serial, biaya, dan penyimpanan sebuah proyek; (4) menjelaskan mengapa Galaxy membuat analisis reprodusibel; (5) memutuskan kapan Galaxy cukup dan kapan baris perintah dibutuhkan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson BI yang membahas Galaxy — grep Galaxy di seluruh track menghasilkan nol. BI17 mengajarkan reprodusibilitas (workflow manager, container, version control) dan BI4 mengajarkan baris perintah, tetapi platform analisis berbasis web yang dipakai kursus JHU Genomic Data Science with Galaxy ini belum pernah diajarkan. Lesson ini mengisi celah itu sebagai pelengkap BI17 — Galaxy adalah salah satu cara mewujudkan reprodusibilitas yang diajarkan di sana.",
      },
      reference: "Alur: FastQC 5 + Trimmomatic 12 + HISAT2 40 + featureCounts 8 = 65 menit; 7,80 dolar/sampel; 50 sampel = 390 dolar; 400 GB.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan dan mengaudit analisis genomik di Galaxy — tanpa menulis skrip.",
        "(1) Menjelaskan history, workflow, dan ToolShed — tiga konsep inti Galaxy;",
        "(2) Menyusun alur kerja RNA-seq standar: QC, trimming, alignment, counting;",
        "(3) Menghitung waktu serial, biaya komputasi, dan kebutuhan penyimpanan;",
        "(4) Menjelaskan mengapa history Galaxy adalah jejak audit yang bisa diulang;",
        "(5) Memutuskan kapan Galaxy cukup dan kapan harus pindah ke baris perintah.",
      ],
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 3 · Teori",
      title: "History, workflow, ToolShed: tiga konsep inti",
      prose: [
        "HISTORY adalah buku lab otomatis. Setiap dataset yang diunggah dan setiap hasil tool tercatat berurutan, lengkap dengan parameter dan versi tool. History bisa dibagikan (link), disalin, dan diekspor — reviewer yang mendapat link history bisa melihat persis apa yang dilakukan, bukan membaca deskripsi methods yang ditulis dari ingatan. History yang baik diberi nama dan anotasi; history bernama 'untitled history 47' adalah buku lab yang tidak pernah ditulis.",
        "WORKFLOW adalah alur kerja yang bisa diulang: rantai tool yang didefinisikan sekali, dijalankan berkali-kali pada dataset berbeda. Workflow RNA-seq standar: FastQC (QC) → Trimmomatic (trimming) → HISAT2 atau STAR (alignment) → featureCounts (counting) → DESeq2 (differential expression, BI26). Sekali workflow diuji pada satu sampel, 49 sampel sisanya dijalankan dengan tombol yang sama — tanpa risiko salah ketik parameter di sampel ke-37.",
        "TOOLSHED adalah toko tool komunitas: ribuan tool bioinformatika yang sudah dibungkus agar jalan di Galaxy — dari FastQC sampai tool niche untuk organisme langka. Tiap tool punya versi yang tercatat; workflow yang memakai Trimmomatic 0,39 akan tetap memakai 0,39 bila diulang tahun depan — bukan versi terbaru yang mengubah hasilnya diam-diam. Inilah yang membedakan Galaxy dari 'menjalankan tool di laptop': versi adalah bagian dari metode, dan metode tercatat.",
        "Tiga hal yang Galaxy lakukan untukmu tanpa diminta: (1) menyimpan parameter tiap langkah; (2) menyimpan versi tiap tool; (3) menyimpan hubungan input-output (provenance) — dataset mana menghasilkan dataset mana. Tiga hal ini adalah definisi reprodusibilitas komputasional menurut BI17 — dan di Galaxy, ketiganya otomatis.",
      ],
      tasks: [],
      note: {
        title: "Galaxy bukan pengganti pemahaman",
        body: "Galaxy menghilangkan baris perintah — bukan menghilangkan kebutuhan memahami. Memilih Trimmomatic tanpa tahu apa itu adapter trimming, atau memakai HISAT2 tanpa tahu apa itu alignment, menghasilkan alur kerja yang jalan tetapi salah. Galaxy menurunkan hambatan TEKNIS, bukan hambatan KONSEPTUAL. Lesson ini mengajarkan keduanya: tool-nya dan alasan di balik tiap langkahnya.",
      },
      reference: "History = buku lab otomatis. Workflow = alur yang bisa diulang. ToolShed = toko tool berversi.",
    },
    {
      id: "alur",
      eyebrow: "Langkah 4 · Teori",
      title: "Alur RNA-seq di Galaxy: dari FASTQ ke hitungan",
      prose: [
        "Langkah pertama: unggah dan QC. FASTQ diunggah ke history (atau diambil dari SRA lewat tool pengunduh). FastQC berjalan 5 menit dan memberi laporan: kualitas per basa, kandungan adapter, duplikasi. Keputusan pertama ada di sini: bila kualitas ujung read jatuh, trimming dibutuhkan; bila adapter terdeteksi, adapter harus dipotong.",
        "Langkah kedua: trimming dengan Trimmomatic (12 menit). Parameter yang dicatat: jendela geser, ambang kualitas, panjang minimum. Trimmomatic memotong adapter dan basa berkualitas rendah — dan Galaxy mencatat persis berapa persen read yang selamat. Bila 40 persen read hilang di trimming, itu temuan — bukan sekadar langkah yang dilewati.",
        "Langkah ketiga: alignment dengan HISAT2 (40 menit — langkah terberat). HISAT2 dan STAR adalah aligner standar RNA-seq karena keduanya menangani splice junction — read RNA-seq melompati intron, dan aligner yang tidak memodelkan splicing akan memetakan read itu dengan salah atau membuangnya. BWA dirancang untuk DNA dan bukan pilihan standar untuk RNA-seq. Reference genome dipilih dari daftar bawaan Galaxy; indeks bawaan tersedia untuk genom dan tool yang umum — tetapi untuk organisme atau versi genom yang tidak ada di daftar, indeks harus dibangun atau diunggah sendiri, jadi periksa ketersediaannya sebelum merencanakan jadwal. Angka 65 menit adalah ilustrasi dari satu konfigurasi contoh — waktu nyata tiap tool bergantung pada ukuran FASTQ, kedalaman sekuensing, dan beban server. Langkah keempat: counting dengan featureCounts (8 menit) — menghitung read per gen dari alignment. Total serial 65 menit per sampel; dengan 50 sampel, total komputasi 3.250 menit — tetapi Galaxy menjalankan sampel secara paralel bila sumber daya tersedia, sehingga waktu dinding jauh lebih pendek dari total serial.",
        "Setelah counting, alur berlanjut ke DESeq2 (BI26) untuk differential expression — tetapi itu lesson lain. Yang penting di sini: tiap langkah menghasilkan dataset baru di history, dan tiap dataset bisa diperiksa — buka alignment di viewer, periksa distribusi count — sebelum lanjut. Galaxy yang dipakai dengan benar adalah Galaxy yang DIPERIKSA tiap langkahnya, bukan yang dijalankan buta sampai akhir.",
      ],
      tasks: [],
      note: {
        title: "Paralel bukan gratis",
        body: "Total serial 65 menit per sampel berarti 50 sampel memakai 3.250 menit komputasi — biaya 390 dolar pada 0,12 dolar per menit, berapa pun paralelisasinya. Paralel mempersingkat WAKTU TUNGGU, bukan total biaya. Bila anggaran terbatas, kurangi sampel atau tool — bukan berharap paralel menghemat uang.\n\nWalkthrough antarmuka Galaxy (tanpa baris perintah): (1) Unggah FASTQ lewat Upload Data di panel kiri. (2) Cari FastQC di panel Tools, klik, pilih file input, klik Execute — ulangi untuk Trimmomatic, HISAT2, dan featureCounts, tiap kali memilih output langkah sebelumnya sebagai input. (3) Simpan rantai sebagai workflow lewat menu Workflow → Extract workflow from history, supaya 49 sampel sisanya dijalankan dengan tombol yang sama. Yang tidak dihilangkan Galaxy: keputusan tiap langkah — parameter trimming, pilihan genom referensi, dan interpretasi QC — tetap butuh pemahaman analis.",
      },
      reference: "FastQC 5 + Trimmomatic 12 + HISAT2 40 + featureCounts 8 = 65 menit serial per sampel; 50 sampel = 3.250 menit komputasi.",
    },
    {
      id: "lab-galaxy",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung waktu, biaya, dan penyimpanan proyek Galaxy",
      prose: [
        "Lab ini membangun kalkulator proyek Galaxy: dari waktu tiap tool, tarif per menit, jumlah sampel, dan ukuran FASTQ per sampel — hitung waktu serial per sampel, biaya per sampel, biaya total, dan penyimpanan total.",
        "Hitung dulu di kepala. Waktu serial: 5 ditambah 12 ditambah 40 ditambah 8 sama dengan 65 menit per sampel. Biaya per sampel: 65 dikali 0,12 sama dengan 7,80 dolar. Biaya total 50 sampel: 7,80 dikali 50 sama dengan 390 dolar. Penyimpanan total: 8 GB dikali 50 sama dengan 400 GB — belum termasuk hasil antara (BAM, count) yang menambah sekitar 50 persen lagi bila tidak dibersihkan.",
        "Tugas lab: tulis fungsi yang menerima waktu empat tool, tarif per menit, jumlah sampel, dan ukuran per sampel — lalu mencetak empat angka: waktu_serial, biaya_per_sampel, biaya_total, penyimpanan_gb. Empat angka ini adalah anggaran proyek yang diajukan sebelum satu FASTQ pun diunggah.",
        "Setelah lolos, coba eksperimen: naikkan sampel menjadi 200 dan lihat biaya menjadi 1.560 dolar dengan penyimpanan 1.600 GB — lalu tanyakan: pada titik berapa kamu meminta kuota institusi, atau pindah ke cloud dengan anggaran yang disetujui?",
      ],
      tasks: [
        { id: "t1", text: "Hitung waktu serial per sampel dari empat tool" },
        { id: "t2", text: "Hitung biaya per sampel dan biaya total 50 sampel" },
        { id: "t3", text: "Hitung kebutuhan penyimpanan total" },
      ],
      expected: "waktu_serial=65\nbiaya_per_sampel=7.8\nbiaya_total=390.0\npenyimpanan_gb=400",
      hints: [
        "Waktu serial = jumlah waktu keempat tool.",
        "Biaya per sampel = waktu serial dikali tarif per menit.",
        "Biaya total = biaya per sampel dikali jumlah sampel.",
        "Penyimpanan = ukuran per sampel dikali jumlah sampel.",
      ],
      code: {
        starter: `# Kalkulator proyek Galaxy: waktu, biaya, penyimpanan.\nfastqc = 5  # menit\ntrimmomatic = 12  # menit\nhisat2 = 40  # menit\nfeaturecounts = 8  # menit\ntarif = 0.12  # dolar per menit\njumlah_sampel = 50\nukuran_per_sampel = 8  # GB FASTQ\n\n# TULIS KODEMU: hitung empat angka proyek di bawah ini.\n# Cetak, per baris: waktu_serial, biaya_per_sampel,\n# biaya_total, penyimpanan_gb.\n\n\nkalkulator_galaxy(fastqc, trimmomatic, hisat2, featurecounts, tarif, jumlah_sampel, ukuran_per_sampel)`,
        lockLines: 7,
        solution: `# Kalkulator proyek Galaxy: waktu, biaya, penyimpanan.\nfastqc = 5  # menit\ntrimmomatic = 12  # menit\nhisat2 = 40  # menit\nfeaturecounts = 8  # menit\ntarif = 0.12  # dolar per menit\njumlah_sampel = 50\nukuran_per_sampel = 8  # GB FASTQ\n\n\ndef kalkulator_galaxy(fastqc, trimmomatic, hisat2, featurecounts, tarif, jumlah_sampel, ukuran_per_sampel):\n    waktu_serial = fastqc + trimmomatic + hisat2 + featurecounts\n    biaya_per_sampel = waktu_serial * tarif\n    biaya_total = biaya_per_sampel * jumlah_sampel\n    penyimpanan_gb = ukuran_per_sampel * jumlah_sampel\n    print(f"waktu_serial={waktu_serial}")\n    print(f"biaya_per_sampel={biaya_per_sampel}")\n    print(f"biaya_total={biaya_total}")\n    print(f"penyimpanan_gb={penyimpanan_gb}")\n\n\nkalkulator_galaxy(fastqc, trimmomatic, hisat2, featurecounts, tarif, jumlah_sampel, ukuran_per_sampel)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "waktu_serial=65", label: "Waktu serial 65 menit", msg: "5 + 12 + 40 + 8 = 65 menit per sampel." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya_per_sampel=7.8", label: "Biaya 7,80 dolar/sampel", msg: "65 x 0,12 = 7,80 dolar per sampel." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya_total=390.0", label: "Biaya total 390 dolar", msg: "7,80 x 50 = 390 dolar. Anggaran yang diajukan sebelum mengunggah." },
          { kind: "stdout_matches", task: "t3", pattern: "penyimpanan_gb=400", label: "Penyimpanan 400 GB", msg: "8 GB x 50 = 400 GB FASTQ — belum termasuk hasil antara." },
        ],
      },
      reference: "Waktu serial 65 menit; biaya 7,80 dolar/sampel; total 390 dolar; penyimpanan 400 GB.",
    },
    {
      id: "batas",
      eyebrow: "Langkah 6 · Teori",
      title: "Kapan Galaxy cukup — dan kapan baris perintah",
      prose: [
        "Galaxy cukup bila: analisis memakai tool standar dengan parameter standar; kolaborator tidak bisa menulis skrip; reprodusibilitas dan jejak audit adalah syarat (misalnya analisis klinis); dan jumlah sampel masih dalam kuota server. Sebagian besar analisis RNA-seq, ChIP-seq, dan varian standar berada di wilayah ini.",
        "Baris perintah dibutuhkan bila: tool yang dipakai belum ada di ToolShed; analisis butuh logika kondisional yang kompleks; data mencapai skala konsorsium (ribuan sampel — lihat BI31); atau komputasi butuh cluster HPC dengan penjadwalan khusus. Aturan praktis: bila workflow Galaxy membutuhkan lebih dari 20 tool dengan percabangan rumit, ia sudah menjadi program — dan program lebih baik ditulis sebagai program.",
        "Jembatan di antara keduanya: Galaxy bisa mengekspor workflow sebagai file dan menjalankan tool lewat API; baris perintah bisa memanggil Galaxy. Banyak tim memakai keduanya — prototipe dan QC di Galaxy, produksi skala besar di baris perintah dengan workflow manager (BI17). Yang tidak berubah: prinsipnya — parameter tercatat, versi tercatat, provenance tercatat — di mana pun analisis dijalankan.",
        "Satu peringatan tentang server publik: Galaxy publik (usegalaxy.org) gratis tetapi berkuota — penyimpanan dan antrean dibatasi. Proyek 400 GB dan 50 sampel biasanya butuh server institusi atau cloud Galaxy sendiri. Periksa kuota SEBELUM mengunggah 400 GB — bukan setelah antrean menolak.",
      ],
      tasks: [],
      note: {
        title: "Reprodusibilitas bukan milik satu platform",
        body: "Galaxy adalah salah satu cara mewujudkan reprodusibilitas — bukan satu-satunya. Workflow manager (Snakemake, Nextflow), container (Docker, Singularity), dan version control mencapai tujuan yang sama dari arah baris perintah. Yang dinilai reviewer bukan platformnya, melainkan apakah analisis bisa diulang dari jejak yang ditinggalkan.",
      },
      reference: "Galaxy cukup: tool standar, kolaborator non-koding, audit. Baris perintah: tool baru, logika kompleks, skala konsorsium.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: reviewer meminta rerun enam bulan kemudian",
      prose: [
        "Kembali ke peneliti 50 sampel. Makalahnya dikirim; enam bulan kemudian reviewer meminta: ulangi analisis dengan panjang minimum trimming 30, bukan 36. Peneliti yang memakai baris perintah tanpa catatan harus merekonstruksi dari ingatan — parameter apa, versi tool apa, file mana yang menjadi masukan. Peneliti Galaxy membuka history, menggandakan workflow, mengubah satu parameter, dan menekan rerun.",
        "Hasil baru keluar dalam sehari: 47 dari 50 sampel tidak berubah vonisnya; 3 sampel berpindah kelompok — dan peneliti itu menulis balasan reviewer dengan angka, bukan dengan keyakinan. Makalah diterima. Yang menyelamatkannya bukan kepintaran — melainkan history yang tercatat otomatis saat ia bekerja.",
        "Tiga hal yang membuat kasus ini berhasil. Pertama, workflow didefinisikan sekali dan dipakai untuk semua sampel — tidak ada variasi diam-diam antar sampel. Kedua, parameter dan versi tercatat otomatis — tidak ada yang mengandalkan ingatan. Ketiga, history dibagikan ke reviewer sebagai tautan — bukti yang bisa diperiksa, bukan klaim yang harus dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: reprodusibilitas bukan pekerjaan akhir — ia adalah cara bekerja sejak langkah pertama. Galaxy membuatnya otomatis; baris perintah membuatnya manual tetapi mungkin. Yang tidak bisa ditawar: jejak yang memungkinkan orang lain mengulang analisismu tanpa bertanya padamu.",
      },
      reference: "Rerun dengan parameter baru dalam sehari; 47/50 vonis tidak berubah; makalah diterima.",
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
        "History = buku lab otomatis; workflow = alur yang bisa diulang; ToolShed = toko tool berversi.",
        "Alur RNA-seq: FastQC 5 + Trimmomatic 12 + HISAT2 40 + featureCounts 8 = 65 menit.",
        "Lab: 65 menit; 7,80 dolar/sampel; 390 dolar total; 400 GB.",
        "Galaxy cukup untuk tool standar; baris perintah untuk tool baru dan skala konsorsium.",
        "Reprodusibilitas = parameter + versi + provenance tercatat.",
      ],
      next: { label: "BI31 — Data Konsorsium Skala Cloud: TCGA dan ENCODE", href: "/v2/learn/bi31-konsorsium-cloud" },
      quiz: [
        {
          q: "Alur Galaxy: FastQC 5, Trimmomatic 12, HISAT2 40, featureCounts 8 menit; tarif 0,12 dolar/menit; 50 sampel @ 8 GB. Berapa waktu serial, biaya total, dan penyimpanan?",
          options: [
            { text: "65 menit; 390 dolar; 400 GB", why: "Tepat: 5+12+40+8 = 65 menit; 65 x 0,12 x 50 = 390 dolar; 8 x 50 = 400 GB.", correct: true },
            { text: "65 menit; 7,80 dolar; 400 GB", why: "Salah: 7,80 dolar adalah biaya PER SAMPEL — total 50 sampel adalah 390 dolar." },
            { text: "57 menit; 390 dolar; 400 GB", why: "Salah: 5+12+40+8 = 65, bukan 57 — jangan lupakan featureCounts 8 menit." },
            { text: "65 menit; 390 dolar; 40 GB", why: "Salah: 8 GB per sampel x 50 = 400 GB, bukan 40 — satu nol mengubah anggaran penyimpanan." },
          ],
        },
        {
          q: "Apa yang membuat analisis Galaxy reprodusibel?",
          options: [
            { text: "Tool-nya gratis", why: "Salah: gratis tidak ada hubungannya dengan reprodusibilitas — tool gratis yang tidak mencatat versi tetap tidak reprodusibel." },
            { text: "History mencatat parameter, versi tool, dan provenance input-output secara otomatis", why: "Tepat: ketiganya adalah definisi reprodusibilitas komputasional — dan di Galaxy ketiganya otomatis.", correct: true },
            { text: "Galaxy berjalan di browser — semua orang bisa mengaksesnya", why: "Salah: akses mudah bukan reprodusibilitas. Yang dibutuhkan adalah jejak yang memungkinkan pengulangan." },
            { text: "Galaxy memakai server yang kuat", why: "Salah: kekuatan server memengaruhi kecepatan, bukan kemampuan mengulang analisis." },
          ],
        },
        {
          q: "Reviewer meminta rerun dengan parameter trimming berbeda enam bulan kemudian. Mengapa peneliti Galaxy bisa melakukannya dalam sehari?",
          options: [
            { text: "Karena Galaxy menyimpan hasil lama sehingga tidak perlu menghitung ulang", why: "Salah: rerun dengan parameter BERBEDA harus menghitung ulang — yang dihemat adalah waktu merekonstruksi, bukan komputasi." },
            { text: "Karena workflow, parameter, versi tool, dan input tercatat di history — tinggal gandakan, ubah satu parameter, rerun", why: "Tepat: jejak lengkap menghilangkan pekerjaan merekonstruksi dari ingatan.", correct: true },
            { text: "Karena Galaxy otomatis menjawab reviewer", why: "Salah: Galaxy tidak menulis balasan reviewer — peneliti tetap harus menganalisis hasil baru dan menulis jawabannya." },
            { text: "Karena parameter trimming tidak memengaruhi hasil", why: "Salah: dalam kasus ini 3 dari 50 sampel berpindah vonis — parameter itu memengaruhi hasil." },
          ],
        },
        {
          q: "Kapan Galaxy TIDAK lagi cukup dan baris perintah dibutuhkan?",
          options: [
            { text: "Bila analisis memakai tool standar dengan parameter standar", why: "Salah: itu justru wilayah Galaxy paling kuat." },
            { text: "Bila tool belum ada di ToolShed, logika kondisional kompleks, atau skala ribuan sampel", why: "Tepat: tiga kondisi ini adalah batas Galaxy — di sinilah program ditulis sebagai program.", correct: true },
            { text: "Bila kolaborator tidak bisa menulis skrip", why: "Salah: terbalik — kolaborator non-koding adalah ALASAN memakai Galaxy." },
            { text: "Bila reprodusibilitas adalah syarat", why: "Salah: terbalik — reprodusibilitas adalah kekuatan Galaxy, bukan batasnya." },
          ],
        },
        {
          q: "Paralelisasi 50 sampel di Galaxy mempersingkat waktu tunggu. Apa yang TIDAK diubahnya?",
          options: [
            { text: "Total menit komputasi dan total biaya — paralel membagi waktu, bukan tagihan", why: "Tepat: 3.250 menit komputasi tetap 3.250 menit — 390 dolar berapa pun paralelnya.", correct: true },
            { text: "Waktu tunggu — itu justru yang dipersingkat", why: "Salah: waktu tunggu ADALAH yang dipersingkat paralelisasi." },
            { text: "Jumlah sampel yang bisa diproses", why: "Salah: paralel tidak menambah jumlah sampel — ia memproses sampel yang sama lebih cepat." },
            { text: "Kualitas hasil alignment", why: "Salah: paralelisasi tidak mengubah hasil tiap sampel — hanya kapan selesainya." },
          ],
        },
      ],
    },
  ],
};
