import type { V2Lesson } from "../lib/types";

export const bi31: V2Lesson = {
  slug: "bi31-konsorsium-cloud",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "BI31 — Data Konsorsium Skala Cloud: TCGA dan ENCODE",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "165 TB yang tidak boleh diunduh",
      prose: [
        "Seorang peneliti ingin menganalisis seluruh RNA-seq TCGA: 11.000 sampel, masing-masing file BAM 15 GB — total 165.000 GB, 165 TB. Rencana awalnya: unduh semuanya ke server lab. Tagihan egress-nya saja 14.850 dolar — 165.000 GB dikali 0,09 dolar per GB — belum termasuk penyimpanan dan waktu unduh berminggu-minggu. Rencana itu mati di spreadsheet.",
        "Rencana yang hidup: komputasi mendatangi data, bukan sebaliknya. Analisis berjalan di cloud tempat data tinggal — GDC (Genomic Data Commons) untuk TCGA, dan kueri BigQuery untuk ENCODE. Satu kueri yang memindai 2,5 TB hanya 12,50 dolar. Pertanyaannya bukan lagi 'bagaimana mengunduh 165 TB', melainkan 'berapa yang perlu dipindai untuk menjawab pertanyaan ini'.",
        "Lesson ini mengajarkan analisis data konsorsium skala cloud: TCGA dan ENCODE, arsitektur GDC, komputasi-di-tempat, dan ekonomi cloud. Setelah lesson ini kamu bisa: (1) menjelaskan apa itu TCGA dan ENCODE dan apa yang tersedia di masing-masing; (2) menghitung biaya penyimpanan, egress, dan kueri cloud; (3) menjelaskan mengapa komputasi mendatangi data; (4) menangani batch effect antar-pusat konsorsium; (5) merancang analisis konsorsium dengan anggaran yang disetujui.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "TCGA dan ENCODE sudah disebut di track ini: BI21 memakai TCGA sebagai sumber (mutasi TP53/APC/KRAS mencakup 97,55 persen populasi TCGA), BI1 menyebut proyek ENCODE (80 persen genom aktif), BI13 menyebut standar ENCODE untuk ChIP-seq. Tidak ada lesson yang MENGAJARKAN analisis konsorsium skala cloud — GDC, akses data, ekonomi egress vs komputasi-di-tempat, dan batch effect antar-pusat. Lesson ini membangunnya dari nol.",
      },
      reference: "TCGA: 11.000 sampel x 15 GB = 165 TB; egress 14.850 dolar. Kueri BigQuery 2,5 TB = 12,50 dolar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang analisis konsorsium tanpa mengunduh 165 TB.",
        "(1) Menjelaskan TCGA dan ENCODE: apa datanya, siapa yang mengumpulkannya, bagaimana mengaksesnya;",
        "(2) Menghitung biaya penyimpanan, egress, dan kueri cloud dari angka mentah;",
        "(3) Menjelaskan prinsip komputasi mendatangi data;",
        "(4) Mengenali dan menangani batch effect antar-pusat;",
        "(5) Merancang analisis dengan anggaran: apa yang dipindai, apa yang diunduh, apa yang tidak.",
      ],
      tasks: [],
    },
    {
      id: "konsorsium",
      eyebrow: "Langkah 3 · Teori",
      title: "TCGA dan ENCODE: dua konsorsium, dua jenis jawaban",
      prose: [
        "TCGA — The Cancer Genome Atlas — memetakan genomik lebih dari 11.000 tumor dari 33 jenis kanker: sekuens DNA dan RNA, metilasi, dan data klinis (survival, stadium, terapi). Tiap sampel melewati pusat yang sama-sama mengikuti protokol standar — tetapi tetap berasal dari puluhan rumah sakit dan diproses dalam gelombang selama bertahun-tahun. Data tinggal di GDC (Genomic Data Commons): portal untuk mengunduh, API untuk mengambil metadata, dan lingkungan cloud untuk menganalisis — untuk BANYAK analisis, tanpa mengunduh. Tetapi apa yang bisa dilakukan tanpa mengunduh bergantung pada program dan layanannya (portal GDC, API GDC, dan Cancer Genomics Cloud masing-masing punya syarat, kuota, dan batas sendiri) — periksa sebelum merencanakan.",
        "ENCODE — Encyclopedia of DNA Elements — memetakan elemen fungsional genom: di mana kromatin terbuka, di mana faktor transkripsi terikat, histon apa yang menandai apa (BI13 memakai model 15-state ENCODE). ENCODE bukan data pasien — ia adalah peta referensi: 'wilayah ini adalah enhancer di sel hati'. Nilai ENCODE bagi analis adalah anotasi: varian GWAS yang jatuh di enhancer ENCODE punya hipotesis fungsi; varian yang jatuh di gurun tanpa anotasi tidak.",
        "Akses data punya dua lapis. Data TERBUKA (open): ekspresi gen, varian somatik agregat, peak — siapa pun bisa mengunduh. Data TERKONTROL (controlled): sekuens germline yang bisa mengidentifikasi pasien — butuh persetujuan dbGaP dan perjanjian penggunaan data. Aturan yang tidak bisa ditawar: data terkontrol tidak boleh diunduh ke laptop pribadi dan tidak boleh dibagikan ulang. Pelanggaran berarti kehilangan akses — untukmu dan untuk institusimu.",
        "Dua pertanyaan yang dijawab konsorsium — dan yang tidak. Konsorsium menjawab 'apa yang umum': mutasi TP53 di 97,55 persen populasi kolorektal TCGA adalah temuan konsorsium. Konsorsium TIDAK menjawab 'apa yang terjadi pada pasien ini': data agregat 11.000 sampel tidak menggantikan data klinis satu pasien. Bila pertanyaanmu tentang satu kohor kecil yang spesifik, konsorsium adalah latar — bukan jawaban.",
      ],
      tasks: [],
      note: {
        title: "Konsorsium bukan database",
        body: "Godaan umum: memperlakukan TCGA sebagai 'database kanker' yang tinggal dikueri. Kenyataannya TCGA adalah KOLEKSI dari puluhan pusat dengan protokol, gelombang, dan kualitas yang bervariasi — dan variasi itu adalah data juga. Analis konsorsium yang baik membaca metadata pusat dan gelombang SEBELUM membaca hasil — karena batch effect tinggal di sana.",
      },
      reference: "TCGA: 11.000+ tumor, 33 jenis kanker, GDC. ENCODE: peta elemen fungsional — anotasi untuk varian.",
    },
    {
      id: "ekonomi-cloud",
      eyebrow: "Langkah 4 · Teori",
      title: "Ekonomi cloud: egress, pemindaian, dan komputasi-di-tempat",
      prose: [
        "Tiga biaya cloud yang harus dihitung sebelum analisis. Pertama, PENYIMPANAN: data yang kamu simpan dikenai biaya per GB per bulan — 165 TB di cloud bukan gratis, tetapi jauh lebih murah daripada membeli dan merawat penyimpanan sendiri. Kedua, EGRESS: data yang KELUAR dari cloud dikenai biaya — 0,09 dolar per GB dalam contoh kita. Mengunduh 165 TB berarti 14.850 dolar hanya untuk memindahkan data. Ketiga, KOMPUTASI dan PEMINDAIAN: menjalankan analisis atau kueri dikenai biaya per sumber daya atau per data yang dipindai — kueri BigQuery 2,5 TB berarti 12,50 dolar pada 5 dolar per TB.",
        "Prinsip komputasi mendatangi data mengikuti aritmetika ini: memindahkan KOMPUTASI (skrip kecil, container) ke tempat data tinggal jauh lebih murah daripada memindahkan DATA ke tempat komputasi tinggal. Praktiknya: analisis berjalan di notebook cloud yang terhubung ke bucket data; hanya HASIL (tabel, gambar, model — megabyte, bukan terabyte) yang diunduh. Bila rencanamu melibatkan unduhan terabyte TANPA ALASAN yang kuat, rencananya patut dipertanyakan — unduhan besar kadang diperlukan (misalnya arsip lokal atau tool yang tidak tersedia di cloud), tetapi hitung dulu egress-nya dan bandingkan dengan komputasi-di-tempat sebelum memutuskan.",
        "Aturan anggaran praktis. Hitung dulu: berapa TB yang akan dipindai, berapa yang akan diunduh, berapa jam komputasi. Kalikan dengan tarif. Bila total melebihi anggaran, kurangi PEMINDAIAN — bukan kualitas: filter sampel dulu (hanya kanker yang relevan), agregasi dulu (hitung di cloud, unduh ringkasannya), dan partisi data (kueri hanya kolom dan baris yang dibutuhkan). BigQuery mengenakan biaya per TB yang DIPINDAI — kueri SELECT bintang pada tabel 165 TB adalah tagihan 825 dolar; kueri yang sama dengan kolom terpilih bisa 12,50 dolar.",
        "Satu biaya tersembunyi: data yang TIDAK dihapus. Hasil antara 50 TB yang tertinggal di bucket selama setahun adalah tagihan yang terus berjalan tanpa ada yang melihat. Aturan: tetapkan kebijakan retensi di awal — hasil antara dihapus setelah 90 hari, hasil akhir diarsipkan — dan audit bucket tiap kuartal.",
      ],
      tasks: [],
      note: {
        title: "Egress adalah pajak kepindahan",
        body: "Penyedia cloud mengenakan biaya keluar data karena itulah yang membuatmu bertahan: makin banyak data yang kamu simpan di satu penyedia, makin mahal pindah ke penyedia lain. Ini bukan konspirasi — ini model bisnis. Analis yang sadar menghitung egress SEBELUM menyimpan 165 TB di satu tempat, dan merancang agar hasil — bukan data mentah — yang keluar.",
      },
      reference: "Egress 165 TB = 14.850 dolar. Kueri 2,5 TB = 12,50 dolar. SELECT bintang = 825 dolar; kolom terpilih = 12,50 dolar.",
    },
    {
      id: "lab-cloud",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung tagihan analisis konsorsium",
      prose: [
        "Lab ini membangun kalkulator tagihan cloud: dari jumlah sampel, ukuran per sampel, tarif egress, dan ukuran kueri — hitung total penyimpanan, tagihan egress bila mengunduh semuanya, dan biaya kueri BigQuery.",
        "Hitung dulu di kepala. Total penyimpanan: 11.000 sampel dikali 15 GB sama dengan 165.000 GB — 165 TB. Tagihan egress: 165.000 dikali 0,09 sama dengan 14.850 dolar. Biaya kueri: 2,5 TB dipindai dikali 5 dolar per TB sama dengan 12,50 dolar. Perbandingan yang menentukan keputusan: mengunduh semuanya 14.850 dolar; menjawab pertanyaan dengan kueri 12,50 dolar — 1.188 kali lebih murah.",
        "Tugas lab: tulis fungsi yang menerima jumlah sampel, ukuran per sampel, tarif egress, ukuran kueri TB, dan tarif kueri — lalu mencetak empat angka: total_gb, total_tb, egress_usd, kueri_usd. Empat angka ini adalah lampiran anggaran yang diajukan ke pemberi dana sebelum analisis dimulai.",
        "Setelah lolos, coba eksperimen: naikkan kueri menjadi 165 TB (SELECT bintang pada semua data) dan lihat biayanya menjadi 825 dolar — lalu tanyakan: berapa banyak pertanyaan yang bisa dijawab dengan 12,50 dolar bila kueri ditulis dengan kolom terpilih?",
      ],
      tasks: [
        { id: "t1", text: "Hitung total penyimpanan TCGA dalam GB dan TB" },
        { id: "t2", text: "Hitung tagihan egress bila mengunduh semuanya" },
        { id: "t3", text: "Hitung biaya kueri BigQuery 2,5 TB" },
      ],
      expected: "total_gb=165000\ntotal_tb=165.0\negress_usd=14850.0\nkueri_usd=12.5",
      hints: [
        "Total GB = jumlah sampel dikali ukuran per sampel.",
        "Total TB = total GB dibagi 1.000.",
        "Egress = total GB dikali tarif egress per GB.",
        "Kueri = ukuran kueri (TB) dikali tarif per TB.",
      ],
      code: {
        starter: `# Kalkulator tagihan cloud: TCGA 11.000 sampel, BAM 15 GB.\njumlah_sampel = 11000\nukuran_per_sampel = 15  # GB\ntarif_egress = 0.09  # dolar per GB\nukuran_kueri_tb = 2.5  # TB dipindai\ntarif_kueri = 5.0  # dolar per TB\n\n# TULIS KODEMU: hitung empat angka tagihan di bawah ini.\n# Cetak, per baris: total_gb, total_tb, egress_usd, kueri_usd.\n\n\nkalkulator_cloud(jumlah_sampel, ukuran_per_sampel, tarif_egress, ukuran_kueri_tb, tarif_kueri)`,
        lockLines: 5,
        solution: `# Kalkulator tagihan cloud: TCGA 11.000 sampel, BAM 15 GB.\njumlah_sampel = 11000\nukuran_per_sampel = 15  # GB\ntarif_egress = 0.09  # dolar per GB\nukuran_kueri_tb = 2.5  # TB dipindai\ntarif_kueri = 5.0  # dolar per TB\n\n\ndef kalkulator_cloud(jumlah_sampel, ukuran_per_sampel, tarif_egress, ukuran_kueri_tb, tarif_kueri):\n    total_gb = jumlah_sampel * ukuran_per_sampel\n    total_tb = total_gb / 1000\n    egress_usd = total_gb * tarif_egress\n    kueri_usd = ukuran_kueri_tb * tarif_kueri\n    print(f"total_gb={total_gb}")\n    print(f"total_tb={total_tb}")\n    print(f"egress_usd={egress_usd}")\n    print(f"kueri_usd={kueri_usd}")\n\n\nkalkulator_cloud(jumlah_sampel, ukuran_per_sampel, tarif_egress, ukuran_kueri_tb, tarif_kueri)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "total_gb=165000", label: "Total 165.000 GB", msg: "11.000 x 15 = 165.000 GB." },
          { kind: "stdout_matches", task: "t1", pattern: "total_tb=165.0", label: "Total 165 TB", msg: "165.000 / 1.000 = 165 TB. Inilah yang tidak boleh diunduh." },
          { kind: "stdout_matches", task: "t2", pattern: "egress_usd=14850.0", label: "Egress 14.850 dolar", msg: "165.000 x 0,09 = 14.850 dolar hanya untuk memindahkan data." },
          { kind: "stdout_matches", task: "t3", pattern: "kueri_usd=12.5", label: "Kueri 12,50 dolar", msg: "2,5 x 5 = 12,50 dolar. 1.188 kali lebih murah dari mengunduh." },
        ],
      },
      reference: "Total 165.000 GB = 165 TB; egress 14.850 dolar; kueri 2,5 TB = 12,50 dolar.",
    },
    {
      id: "batch-effect",
      eyebrow: "Langkah 6 · Teori",
      title: "Batch effect: musuh yang tinggal di metadata",
      prose: [
        "Batch effect adalah perbedaan sistematis antar-kelompok sampel yang berasal dari TEKNIS, bukan biologi: pusat pengumpulan, tanggal library prep, operator, nomor flow cell, versi reagen. Di konsorsium, batch effect adalah kepastian — 11.000 sampel TCGA diproses puluhan pusat selama bertahun-tahun. Bila kelompok kanker A sebagian besar diproses di pusat X dan kelompok B di pusat Y, perbedaan 'biologi' yang kamu temukan bisa jadi perbedaan pusat.",
        "Tiga pertahanan. Pertama, DESAIN: bila memungkinkan, sebar kelompok perbandingan di semua batch — jangan biarkan satu kelompok menempati satu batch. Di data konsorsium yang sudah ada, desain tidak bisa diubah — yang tersisa adalah deteksi dan koreksi. Kedua, DETEKSI: PCA pada data mentah — bila sampel mengelompok menurut pusat atau tanggal, bukan menurut biologi, batch effect hadir. Ketiga, KOREKSI: metode seperti ComBat (untuk data yang sudah dinormalisasi) atau memasukkan batch sebagai kovariat dalam model DESeq2 (BI26) — dengan catatan: koreksi tidak bisa memisahkan batch dari biologi bila keduanya berkorelasi sempurna.",
        "Satu kegagalan klasik: mengoreksi batch effect TANPA mencatatnya. Koreksi yang tidak didokumentasikan membuat hasil tidak bisa diulang — dan bisa menghilangkan sinyal biologi yang kebetulan berkorelasi dengan batch. Aturan: laporkan batch apa yang dikoreksi, dengan metode apa, dan tunjukkan PCA sebelum dan sesudah. Bila setelah koreksi sampel masih mengelompok menurut pusat, koreksinya gagal — jangan lanjutkan analisis seolah berhasil.",
        "Metadata adalah separuh analisis konsorsium. Sebelum satu kueri ekspresi pun, unduh dan periksa metadata: pusat, gelombang, platform, tanggal. Analis yang melewati metadata dan langsung menghitung adalah analis yang akan menemukan 'gen penanda kanker' yang ternyata gen penanda pusat pengumpulan.",
      ],
      tasks: [],
      note: {
        title: "Batch dan biologi yang berkorelasi sempurna",
        body: "Kasus terburuk: semua sampel kanker A dari pusat X, semua kontrol dari pusat Y. Tidak ada metode statistik yang bisa memisahkan 'kanker A' dari 'pusat X' — keduanya adalah variabel yang sama. Satu-satunya jalan: data tambahan dari pusat lain, atau akui bahwa pertanyaan itu tidak bisa dijawab dari data ini. Kejujuran ini lebih berharga dari satu makalah.",
      },
      reference: "Deteksi: PCA mengelompok menurut pusat/tanggal. Koreksi: ComBat atau kovariat batch — laporkan sebelum/sesudah.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: gen penanda yang ternyata penanda pusat",
      prose: [
        "Sebuah tim menemukan 200 gen yang 'membedakan' dua subtipe kanker dari TCGA — calon panel diagnostik. Sebelum menulis makalah, seorang anggota tim memeriksa PCA: sampel mengelompok menurut pusat pengumpulan, bukan subtipe. Setelah memasukkan pusat sebagai kovariat, 200 gen menyusut menjadi 11 — dan 189 sisanya adalah perbedaan teknis antar-pusat.",
        "Tim itu tidak membuang 189 gen itu diam-diam. Mereka menulisnya di makalah: panel awal 200 gen, koreksi batch effect, panel akhir 11 gen — dengan PCA sebelum dan sesudah sebagai bukti. Reviewer memuji kejujuran itu; panel 11 gen lolos validasi di kohor independen. Panel 200 gen — bila diterbitkan tanpa koreksi — akan gagal di kohor mana pun dari pusat lain.",
        "Tiga hal yang membuat kasus ini berhasil. Pertama, metadata dibaca sebelum hasil dirayakan. Kedua, koreksi batch effect dilakukan dan dilaporkan — bukan disembunyikan. Ketiga, validasi dilakukan di kohor independen dari pusat berbeda — ujian sesungguhnya bagi temuan konsorsium.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: di data konsorsium, temuan pertama hampir selalu batch effect — dan analis yang baik mengasumsikan itu sampai terbukti sebaliknya. PCA sebelum analisis bukan formalitas; ia adalah tes kejujuran pertama. Dan validasi di kohor independen bukan kemewahan — ia adalah syarat, karena batch effect tidak mengikuti temuanmu ke pusat lain.",
      },
      reference: "200 gen menjadi 11 setelah koreksi batch; 189 adalah perbedaan pusat. Panel 11 lolos validasi independen.",
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
        "TCGA: 11.000+ tumor, 33 kanker, GDC. ENCODE: peta elemen fungsional.",
        "Ekonomi: egress 165 TB = 14.850 dolar; kueri 2,5 TB = 12,50 dolar.",
        "Prinsip: komputasi mendatangi data; unduh hasil, bukan data mentah.",
        "Lab: total 165.000 GB = 165 TB; egress 14.850 dolar; kueri 12,50 dolar.",
        "Batch effect: deteksi PCA, koreksi ComBat/kovariat, laporkan sebelum/sesudah.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "TCGA 11.000 sampel @ 15 GB; egress 0,09 dolar/GB; kueri BigQuery 2,5 TB @ 5 dolar/TB. Berapa total TB, egress, dan biaya kueri?",
          options: [
            { text: "165 TB; 14.850 dolar; 12,50 dolar", why: "Tepat: 11.000 x 15 = 165.000 GB = 165 TB; 165.000 x 0,09 = 14.850 dolar; 2,5 x 5 = 12,50 dolar.", correct: true },
            { text: "165 TB; 1.485 dolar; 12,50 dolar", why: "Salah: egress 165.000 x 0,09 = 14.850, bukan 1.485 — satu nol mengubah keputusan." },
            { text: "16,5 TB; 14.850 dolar; 125 dolar", why: "Salah: 11.000 x 15 = 165.000 GB = 165 TB, bukan 16,5. Kueri 2,5 x 5 = 12,50, bukan 125." },
            { text: "165 TB; 14.850 dolar; 825 dolar", why: "Salah: 825 dolar adalah biaya memindai SELURUH 165 TB (SELECT bintang) — kueri 2,5 TB hanya 12,50 dolar." },
          ],
        },
        {
          q: "Mengapa komputasi harus mendatangi data di analisis konsorsium?",
          options: [
            { text: "Karena cloud lebih cepat dari server lab", why: "Salah: kecepatan bukan alasan utamanya — biaya dan waktu pemindahanlah yang menentukan." },
            { text: "Karena memindahkan 165 TB (egress 14.850 dolar + berminggu-minggu) jauh lebih mahal dari memindahkan komputasi dan hanya mengunduh hasil", why: "Tepat: aritmetika egress adalah alasan prinsip ini.", correct: true },
            { text: "Karena data TCGA tidak boleh diunduh sama sekali", why: "Salah: data terbuka TCGA BOLEH diunduh — hanya saja mahal dan lambat. Data terkontrol yang dibatasi." },
            { text: "Karena analisis di cloud selalu lebih akurat", why: "Salah: lokasi komputasi tidak mengubah akurasi — yang berubah adalah biaya dan waktu." },
          ],
        },
        {
          q: "PCA pada data TCGA menunjukkan sampel mengelompok menurut pusat pengumpulan, bukan menurut subtipe kanker. Apa artinya?",
          options: [
            { text: "Pusat pengumpulan menentukan subtipe kanker pasien", why: "Salah: pengelompokan menurut pusat adalah sinyal batch effect teknis — bukan biologi." },
            { text: "Batch effect hadir — perbedaan teknis antar-pusat mendominasi sinyal; koreksi dan laporkan sebelum analisis lanjut", why: "Tepat: PCA adalah detektor batch effect. Temuan tanpa koreksi adalah temuan tentang pusat, bukan kanker.", correct: true },
            { text: "Normal — abaikan dan lanjutkan differential expression", why: "Salah: mengabaikan batch effect berarti 189 dari 200 'gen penanda' bisa jadi artefak pusat." },
            { text: "Data rusak — buang seluruh dataset", why: "Salah: batch effect bisa dikoreksi (ComBat/kovariat) bila tidak berkorelasi sempurna dengan biologi." },
          ],
        },
        {
          q: "Semua sampel kanker A dari pusat X, semua kontrol dari pusat Y. Apa vonis yang benar?",
          options: [
            { text: "Koreksi dengan ComBat — masalah selesai", why: "Salah: ComBat tidak bisa memisahkan batch dari biologi bila keduanya berkorelasi sempurna — keduanya adalah variabel yang sama." },
            { text: "Tidak ada metode yang bisa memisahkan keduanya — butuh data tambahan atau akui pertanyaan tidak bisa dijawab dari data ini", why: "Tepat: ini kasus terburuk batch effect. Kejujuran lebih berharga dari satu makalah.", correct: true },
            { text: "Buang pusat Y dan analisis hanya pusat X", why: "Salah: membuang kontrol berarti tidak ada pembanding — analisis menjadi tanpa kelompok kontrol." },
            { text: "Lanjutkan tanpa koreksi — efeknya kecil", why: "Salah: efeknya bukan kecil — seluruh perbedaan yang ditemukan bisa jadi perbedaan pusat." },
          ],
        },
        {
          q: "Kueri SELECT bintang pada tabel 165 TB dikenai 825 dolar, sementara kueri kolom terpilih hanya 12,50 dolar. Apa pelajarannya?",
          options: [
            { text: "BigQuery terlalu mahal untuk analisis konsorsium", why: "Salah: 12,50 dolar untuk pertanyaan yang sama menunjukkan biayanya ditentukan CARA menulis kueri, bukan platformnya." },
            { text: "Pilih kolom dan baris yang dibutuhkan sebelum memindai — biaya dihitung per TB yang dipindai, bukan per pertanyaan", why: "Tepat: filter dan proyeksi dulu, pindai kemudian. Itulah disiplin kueri cloud.", correct: true },
            { text: "Selalu unduh data dulu agar kueri gratis", why: "Salah: mengunduh 165 TB berarti egress 14.850 dolar — jauh lebih mahal dari kueri apa pun." },
            { text: "Hindari BigQuery — pakai spreadsheet saja", why: "Salah: spreadsheet tidak menangani 165 TB. Jawabannya adalah kueri yang ditulis dengan benar." },
          ],
        },
      ],
    },
  ],
};
