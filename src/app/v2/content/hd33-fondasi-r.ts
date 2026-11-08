import type { V2Lesson } from "../lib/types";

export const hd33: V2Lesson = {
  slug: "hd33-fondasi-r",
  track: "Health Data Science",
  module: "Fondasi Data Kesehatan",
  title: "HD33 — Fondasi R untuk Data Kesehatan: Wrangling, Visualisasi dan Model Dasar",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Spreadsheet 200 ibu hamil dan pertanyaan yang tidak bisa dijawab Excel",
      prose: [
        "Sebuah puskesmas mengirim spreadsheet: 200 ibu hamil, 14 kolom — usia, paritas, hemoglobin, tekanan darah, status diabetes, dan tanggal kunjungan yang ditulis dalam tiga format berbeda. Pertanyaan dinas kesehatan sederhana: berapa prevalensi diabetes pada ibu hamil di atas 35 tahun, dan apakah tekanan darah sistolik mereka berbeda dari yang bukan diabetes? Di Excel, jawabannya butuh filter manual, rumus yang disalin ke bawah, dan satu sel yang tertukar tanpa jejak. Minggu depan datanya datang lagi — dan seluruh pekerjaan manual itu harus diulang dari nol.",
        "R adalah bahasa yang dirancang untuk pertanyaan seperti ini: data dibaca sekali, dibersihkan dengan kode yang bisa dijalankan ulang, dan jawabannya dihitung — bukan disalin. Lesson ini mengajarkan R dari nol untuk data kesehatan: wrangling dengan dplyr, visualisasi dengan ggplot2, dan model statistik dasar dengan lm. Track ini sudah punya SQL untuk kesehatan (HD27) dan Stata, SPSS, SAS (HD30) — tetapi tidak punya fondasi R, padahal sebagian besar kurikulum kesehatan (Michigan, Leiden) memulainya dari R, dan sebagian besar analisis di track ini (survival di HD6, kausal di HD10, prediksi di HD12) ditulis dalam idiom R. Setelah lesson ini kamu bisa: (1) membaca dan menulis R dasar (vektor, data frame, fungsi); (2) merapikan data kesehatan dengan lima kata kerja dplyr; (3) membuat satu grafik ggplot2 yang jujur; (4) menjalankan dan menafsirkan model linear sederhana.",
      ],
      tasks: [],
      note: {
        title: "Tentang kode R di lesson ini",
        body: "Mesin lab di sini menjalankan Python, jadi lab memakai Python yang meniru kata kerja dplyr langkah demi langkah — dan angka lab sama persis dengan angka yang dihasilkan kode R yang setara. Kode R ditampilkan sebagai referensi dengan tanda sama dengan untuk penugasan (gaya umum R memakai panah, dan pipe R ditulis sebagai panggilan bersarang agar mudah dibaca di halaman ini). Pelajari idiomnya di R; buktikan angkanya di lab.",
      },
      reference: "R = bahasa statistik. dplyr = lima kata kerja wrangling. ggplot2 = gramatika grafik. lm = model linear pertama.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membuka RStudio, membaca satu file CSV kesehatan, dan menjawab pertanyaan dinas kesehatan dengan kode yang bisa dijalankan ulang minggu depan.",
        "(1) Menjelaskan objek dasar R — vektor, data frame (tibble), dan fungsi — serta bedanya dengan Python (indeks mulai 1, operasi vektor);",
        "(2) Merapikan data dengan lima kata kerja dplyr: filter, select, mutate, group_by, summarise — plus join;",
        "(3) Membuat grafik ggplot2 dari tiga lapis (data, pemetaan, geometri) dan membaca kapan grafik berbohong;",
        "(4) Menjalankan lm, membaca koefisien dan intervalnya, dan menjelaskan kenapa beda mentah bukan efek kausal (rujuk HD10).",
      ],
      tasks: [],
    },
    {
      id: "r-dasar",
      eyebrow: "Langkah 3 · Teori",
      title: "R dari nol: vektor, tibble, dan fungsi",
      prose: [
        "R berpikir dalam vektor. Perintah usia sama dengan c(45, 62, 38, 55, 71, 29, 50, 66) membuat vektor delapan angka — dan mean(usia) langsung memberi 52,0 tanpa perulangan. Operasi di R bersifat vektor: bmi tambah 1 menambah 1 ke semua elemen; usia lebih dari 50 memberi delapan nilai benar-salah sekaligus. Inilah yang membuat kode R untuk statistik terasa pendek: perulangan yang di Python ditulis eksplisit, di R sudah ada di dalam fungsinya.",
        "Dua perbedaan dengan Python yang paling sering menjebak. Pertama, indeks mulai dari 1, bukan 0: usia[1] adalah 45 (elemen pertama), bukan 62. Kedua, data frame di R modern adalah tibble: tabel dengan nama kolom, tipe tiap kolom, dan perilaku yang menolak operasi ambigu — tibble tidak pernah mengubah string menjadi faktor secara diam-diam (perilaku lama R yang melahirkan banyak bug legendaris). Membaca CSV: pasien sama dengan read_csv('pasien.csv') — dan selalu periksa dengan glimpse(pasien) sebelum menghitung apa pun: tipe kolom yang salah (tanggal terbaca sebagai teks) adalah sumber error nomor satu di analisis kesehatan.",
        "Fungsi di R ditulis ringkas: rata_rata sama dengan function(x) mean(x, na.rm sama dengan TRUE). Perhatikan na.rm sama dengan TRUE — argumen paling penting di analisis kesehatan: data lapangan selalu punya nilai hilang (HD8), dan R secara default mengembalikan NA (tidak tersedia) bila satu saja nilai hilang. Analis yang lupa na.rm mendapat NA di mana-mana dan mengira datanya rusak; analis yang menulis na.rm tanpa berpikir mendapat angka dari data yang separuh hilang. Aturannya: tangani nilai hilang secara eksplisit (HD8) — jangan biarkan default yang memutuskan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira indeks R sama dengan Python. usia[1] di R adalah 45 (elemen pertama); di Python, usia[1] adalah 62 (elemen kedua). Satu angka selisih indeks telah membalikkan banyak analisis — selalu uji dengan vektor kecil yang kamu hafal isinya.",
      },
      reference: "Vektor dulu, perulangan kemudian. Indeks mulai 1. glimpse dulu sebelum menghitung.",
    },
    {
      id: "dplyr",
      eyebrow: "Langkah 4 · Teori",
      title: "Wrangling dplyr: lima kata kerja untuk semua data kesehatan",
      prose: [
        "Hampir semua perapian data kesehatan bisa diungkapkan dengan lima kata kerja dplyr. filter memilih baris (misal hanya ibu hamil di atas 35 tahun). select memilih kolom (hanya yang dibutuhkan analisis). mutate membuat kolom baru (BMI dari berat dan tinggi, atau kelompok usia dari usia). group_by plus summarise meringkas per kelompok (prevalensi diabetes per jenis kelamin). arrange mengurutkan. Ditambah left_join untuk menggabungkan tabel (misal data pasien dengan data kunjungan berdasarkan ID).",
        "Contoh dari lab — delapan pasien sintetis. Prevalensi diabetes keseluruhan: 5 dari 8, sama dengan 62,5 persen. Per jenis kelamin: perempuan 3 dari 4 (75,0 persen), laki-laki 2 dari 4 (50,0 persen). Rata-rata usia 52,0 tahun; rata-rata BMI 27,12. Tekanan darah sistolik rata-rata: 148,0 pada pasien diabetes, 115,0 pada yang bukan — selisih 33,0. Dalam R, seluruh hitungan itu adalah satu rantai: pasien dikelompokkan berdasarkan diabetes, lalu diringkas rata-rata sistoliknya. Dalam Python (lab), langkah yang sama ditulis eksplisit — dan angkanya harus sama persis, karena aritmetikanya sama.",
        "Dua kebiasaan yang membedakan analis senior. Pertama, rantai wrangling ditulis sebagai alur yang bisa dibaca dari atas ke bawah — tiap langkah satu kata kerja, tiap kata kerja satu tujuan. Kode yang tidak bisa dibaca sebagai kalimat adalah kode yang akan salah diam-diam. Kedua, JANGAN PERNAH menimpa file mentah: wrangling selalu membaca file mentah dan menulis file bersih yang baru. File mentah yang tertimpa adalah data yang hilang — dan di data kesehatan, data yang hilang bisa berarti pasien yang hilang dari analisis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke HD8 dan HD11",
        body: "Nilai hilang ditangani sebelum summarise (HD8) — filter atau imputasi dengan alasan yang ditulis. Wrangling EHR (HD11) memakai kata kerja yang sama pada skala lebih besar: jutaan baris, puluhan tabel, dan join berdasarkan ID pasien.",
      },
      reference: "filter, select, mutate, group_by + summarise, left_join. Baca mentah, tulis bersih — jangan pernah timpa file mentah.",
    },
    {
      id: "ggplot-lm",
      eyebrow: "Langkah 5 · Teori",
      title: "ggplot2 dan model linear: gambar yang jujur, angka yang ditafsir",
      prose: [
        "ggplot2 membangun grafik dari tiga lapis: data (tibble apa), pemetaan estetika (sumbu x apa, sumbu y apa, warna mewakili apa), dan geometri (titik, garis, batang). Contoh: ggplot(pasien, aes(x sama dengan diabetes, y sama dengan sistolik)) tambah geom_boxplot() — satu boxplot per kelompok yang langsung menunjukkan selisih 33 poin dari lab. Kekuatan gramatika ini: mengubah pertanyaan berarti mengubah satu lapis, bukan menggambar ulang. Kelemahannya sama: grafik yang salah lapis (misal sumbu y dipotong di tengah) berbohong dengan rapi — dan boxplot yang menyembunyikan jumlah observasi (n sama dengan 5 lawan n sama dengan 3) berbohong dengan sopan. Aturannya: selalu sertakan n per kelompok, dan jangan potong sumbu tanpa alasan yang ditulis.",
        "Model linear pertama: model sama dengan lm(sistolik mengikuti diabetes, data sama dengan pasien). Koefisiennya membaca: intersep 115,0 (rata-rata sistolik pasien bukan diabetes) dan koefisien diabetes 33,0 (selisih rata-rata pasien diabetes). Angka 33,0 ini SAMA dengan selisih lab — karena model linear dengan satu prediktor biner memang menghitung selisih rata-rata. Itu bukan kebetulan: itu yang membuat lm bisa dibaca sebagai 'selisih rata-rata dengan interval kepercayaan'.",
        "Dan di sinilah kejujuran ilmiah masuk: 33,0 adalah BEDA MENTAH, bukan efek kausal diabetes terhadap tekanan darah. Pasien diabetes di contoh ini juga lebih tua — dan usia menaikkan tekanan darah. Menyimpulkan 'diabetes menaikkan sistolik 33 poin' dari angka ini adalah kesalahan yang dibahas tuntas di HD10 (kausal observasional): beda mentah mencampur efek diabetes dengan efek usia dan faktor lain. Model yang benar menambahkan perancu (lm dengan usia sebagai kovariat) atau memakai desain kausal — dan lesson ini dengan sengaja berhenti di sini: R memberimu angka; HD10 memberimu hak untuk menafsirkannya.",
      ],
      tasks: [],
      formula: String.raw`\text{sistolik} = 115{,}0 + 33{,}0 \times \text{diabetes}`,
      formulaNote: "Model linear lab: intersep 115,0 (rata-rata bukan diabetes) + 33,0 (selisih rata-rata diabetes). Ini beda mentah — bukan efek kausal (HD10).",
      note: {
        title: "Sering salah",
        body: "Menyebut koefisien 33,0 sebagai 'efek diabetes'. Koefisien regresi pada data observasional adalah beda rata-rata yang disesuaikan (atau mentah) — bukan efek kausal. Tanpa desain kausal (HD10), 33,0 hanya berkata: kedua kelompok ini berbeda 33 poin, dan kita belum tahu kenapa.",
      },
      reference: "ggplot2 = data + pemetaan + geometri. lm dengan prediktor biner = selisih rata-rata. Beda mentah bukan efek kausal.",
    },
    {
      id: "lab-r",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: wrangling delapan pasien — kata kerja dplyr dalam Python",
      prose: [
        "Lab ini menjalankan kata kerja dplyr dalam Python (mesin lab di sini menjalankan Python; kode R yang setara ada di teori dan catatan). Delapan pasien sintetis: (45, L, BMI 24,5, bukan diabetes, sistolik 120), (62, P, 31,2, diabetes, 145), (38, P, 22,1, bukan, 110), (55, L, 28,7, diabetes, 150), (71, P, 29,8, diabetes, 160), (29, L, 21,3, bukan, 115), (50, P, 26,4, diabetes, 130), (66, L, 33,0, diabetes, 155).",
        "Hitung lima angka: rata-rata usia 52,0; rata-rata BMI 27,12; prevalensi diabetes 62,5 persen; prevalensi per jenis kelamin (perempuan 75,0 persen, laki-laki 50,0 persen); rata-rata sistolik per kelompok diabetes (148,0 lawan 115,0) dan selisihnya 33,0. Periksa tiap angka dengan tangan sebelum menjalankan: jumlah usia 416 dibagi 8 sama dengan 52,0; jumlah BMI 217,0 dibagi 8 sama dengan 27,125 (dibulatkan 27,12); diabetes 5 dari 8; sistolik diabetes (145 tambah 150 tambah 160 tambah 130 tambah 155) sama dengan 740 dibagi 5 sama dengan 148,0; bukan diabetes (120 tambah 110 tambah 115) sama dengan 345 dibagi 3 sama dengan 115,0.",
        "Setelah lolos, coba eksperimen: tambah satu pasien (40, P, BMI 23,0, bukan diabetes, sistolik 118) dan lihat angka mana yang bergerak — prevalensi turun menjadi 5 dari 9 (55,6 persen), rata-rata usia turun menjadi 50,7 ((416 + 40) / 9 = 50,67). Itulah gunanya kode yang bisa dijalankan ulang: data baru berarti menjalankan ulang, bukan menghitung ulang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `usia_rata` = rata-rata usia dan `bmi_rata` = rata-rata BMI (bulatkan 2 desimal)" },
        { id: "t2", text: "Hitung `prev` = prevalensi diabetes keseluruhan (persen) dan `prev_P`, `prev_L` per jenis kelamin" },
        { id: "t3", text: "Hitung `sis_diabetes`, `sis_bukan` = rata-rata sistolik per kelompok, lalu `selisih`" },
        { id: "t4", text: "Cetak ketujuh angka dengan format yang sama seperti Hasil yang diharapkan" },
      ],
      expected: "usia=52.0\nbmi=27.12\nprev=62.5\nprev_P=75.0\nprev_L=50.0\nsis_diabetes=148.0\nsis_bukan=115.0\nselisih=33.0",
      hints: [
        "Usia: jumlahkan 45, 62, 38, 55, 71, 29, 50, 66 = 416; bagi 8.",
        "BMI: jumlahkan semuanya = 217,0; bagi 8 = 27,125 — bulatkan 2 desimal menjadi 27,12.",
        "Prevalensi per jenis kelamin: perempuan 3 dari 4, laki-laki 2 dari 4 — hitung dari daftar, jangan dari ingatan.",
        "Sistolik diabetes: 145, 150, 160, 130, 155 (5 pasien) — jumlah 740, bagi 5.",
      ],
      code: {
        starter: `# Delapan pasien sintetis: (usia, jenis kelamin, bmi, diabetes 0/1, sistolik)\npasien = [\n    (45, "L", 24.5, 0, 120),\n    (62, "P", 31.2, 1, 145),\n    (38, "P", 22.1, 0, 110),\n    (55, "L", 28.7, 1, 150),\n    (71, "P", 29.8, 1, 160),\n    (29, "L", 21.3, 0, 115),\n    (50, "P", 26.4, 1, 130),\n    (66, "L", 33.0, 1, 155),\n]\n\n# t1: rata-rata (dplyr: summarise(mean))\nusia_rata = 0.0  # TULIS KODEMU\nbmi_rata = 0.0  # TULIS KODEMU\n\n# t2: prevalensi (dplyr: group_by + summarise(mean(diabetes) * 100))\nprev = 0.0  # TULIS KODEMU\nprev_P = 0.0  # TULIS KODEMU\nprev_L = 0.0  # TULIS KODEMU\n\n# t3: rata-rata sistolik per kelompok diabetes\nsis_diabetes = 0.0  # TULIS KODEMU\nsis_bukan = 0.0  # TULIS KODEMU\nselisih = 0.0  # TULIS KODEMU\n\nprint(f"usia={usia_rata:.1f}")\nprint(f"bmi={bmi_rata:.2f}")\nprint(f"prev={prev:.1f}")\nprint(f"prev_P={prev_P:.1f}")\nprint(f"prev_L={prev_L:.1f}")\nprint(f"sis_diabetes={sis_diabetes:.1f}")\nprint(f"sis_bukan={sis_bukan:.1f}")\nprint(f"selisih={selisih:.1f}")`,
        lockLines: 0,
        solution: `# Delapan pasien sintetis: (usia, jenis kelamin, bmi, diabetes 0/1, sistolik)\npasien = [\n    (45, "L", 24.5, 0, 120),\n    (62, "P", 31.2, 1, 145),\n    (38, "P", 22.1, 0, 110),\n    (55, "L", 28.7, 1, 150),\n    (71, "P", 29.8, 1, 160),\n    (29, "L", 21.3, 0, 115),\n    (50, "P", 26.4, 1, 130),\n    (66, "L", 33.0, 1, 155),\n]\n\n# t1: rata-rata (dplyr: summarise(mean))\nusia_rata = sum(p[0] for p in pasien) / len(pasien)\nbmi_rata = round(sum(p[2] for p in pasien) / len(pasien), 2)\n\n# t2: prevalensi (dplyr: group_by + summarise(mean(diabetes) * 100))\nprev = sum(p[3] for p in pasien) / len(pasien) * 100\nprev_P = sum(p[3] for p in pasien if p[1] == "P") / sum(1 for p in pasien if p[1] == "P") * 100\nprev_L = sum(p[3] for p in pasien if p[1] == "L") / sum(1 for p in pasien if p[1] == "L") * 100\n\n# t3: rata-rata sistolik per kelompok diabetes\nsis_diabetes = sum(p[4] for p in pasien if p[3] == 1) / sum(1 for p in pasien if p[3] == 1)\nsis_bukan = sum(p[4] for p in pasien if p[3] == 0) / sum(1 for p in pasien if p[3] == 0)\nselisih = sis_diabetes - sis_bukan\n\nprint(f"usia={usia_rata:.1f}")\nprint(f"bmi={bmi_rata:.2f}")\nprint(f"prev={prev:.1f}")\nprint(f"prev_P={prev_P:.1f}")\nprint(f"prev_L={prev_L:.1f}")\nprint(f"sis_diabetes={sis_diabetes:.1f}")\nprint(f"sis_bukan={sis_bukan:.1f}")\nprint(f"selisih={selisih:.1f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "usia=52.0", label: "Rata-rata usia = 52,0", msg: "Jumlah usia 416 dibagi 8 = 52,0." },
          { kind: "stdout_matches", task: "t1", pattern: "bmi=27.12", label: "Rata-rata BMI = 27,12", msg: "Jumlah BMI 217,0 dibagi 8 = 27,125 — dibulatkan 2 desimal menjadi 27,12." },
          { kind: "stdout_matches", task: "t2", pattern: "prev=62.5", label: "Prevalensi diabetes = 62,5 persen", msg: "5 dari 8 pasien diabetes." },
          { kind: "stdout_matches", task: "t2", pattern: "prev_P=75.0", label: "Prevalensi perempuan = 75,0 persen", msg: "Perempuan 3 dari 4 diabetes; laki-laki 2 dari 4 (50,0 persen)." },
          { kind: "equal", task: "t3", name: "selisih", value: 33.0, label: "Selisih sistolik = 33,0", msg: "Diabetes 740/5 = 148,0; bukan diabetes 345/3 = 115,0; selisih 33,0 — sama dengan koefisien lm di teori." },
        ],
      },
      reference: "Usia 52,0; BMI 27,12; prevalensi 62,5 persen (P 75,0, L 50,0); sistolik 148,0 lawan 115,0; selisih 33,0.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: R, SQL, atau Python",
      prose: [
        "Skenario 1 — 'Jawab pertanyaan statistik dari satu file CSV: prevalensi, rata-rata per kelompok, model linear.' → R (dplyr + ggplot2 + lm). Alasan: bahasa ini dirancang untuk itu — lima kata kerja dan satu model memberi jawaban yang bisa dijalankan ulang. Contoh nyata: analisis survei KIA tingkat kabupaten.",
        "Skenario 2 — 'Data tersebar di puluhan tabel EHR dan harus digabung sebelum dianalisis.' → SQL dulu (HD27), lalu R. Alasan: join dan filter jutaan baris lebih cepat dan lebih aman di database; R menerima hasil yang sudah rapi. Contoh nyata: kohort readmisi dari EHR (HD20).",
        "Skenario 3 — 'Pipeline produksi: baca API, bersihkan, latih model, deploy sebagai layanan.' → Python (HD32). Alasan: R unggul untuk analisis, Python unggul untuk engineering produksi. Contoh nyata: alert klinis real-time yang dibahas di HD32.",
        "Skenario 4 — 'Regulator atau tim lain meminta hasil dalam Stata/SPSS/SAS.' → HD30: terjemahkan, jangan tulis ulang dari nol. Alasan: angka yang sama dihitung dua kali dengan dua bahasa adalah dua peluang salah; satu analisis kanonis (R) plus terjemahan output lebih aman daripada dua analisis paralel.",
        "Aturan praktis 10 detik: pertanyaannya statistik dan jawabannya harus bisa diulang minggu depan? → R. Datanya besar dan tersebar? → SQL dulu. Hasilnya harus hidup sebagai layanan? → Python. Alat mengikuti pertanyaan, bukan sebaliknya.",
      ],
      tasks: [],
      reference: "Statistik yang bisa diulang → R. Data besar tersebar → SQL dulu. Layanan produksi → Python.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: dashboard KIA yang angkanya berubah tiap minggu",
      prose: [
        "Dinas kesehatan memakai dashboard KIA yang angkanya berubah tiap minggu tanpa penjelasan: prevalensi anemia ibu hamil 32 persen minggu lalu, 41 persen minggu ini — dari data yang sama. Penyelidikan menemukan penyebabnya di spreadsheet: tiap minggu seseorang memfilter manual, menyalin rumus ke bawah, dan satu baris tertukar tanpa jejak. Tidak ada yang tahu angka mana yang benar, karena tidak ada kode yang bisa dijalankan ulang.",
        "Perbaikan memakai R: satu script membaca file mentah, membersihkan (format tanggal diseragamkan, nilai hilang ditangani eksplisit mengikuti HD8), menghitung prevalensi dengan group_by dan summarise, dan menulis dashboard. Minggu depan, data baru berarti menjalankan ulang script — bukan mengulang pekerjaan manual. Angka minggu lalu bisa dihitung ulang kapan pun, karena script dan file mentahnya tersimpan.",
        "Pembahasan: perhatikan bahwa perbaikannya bukan soal R lebih 'canggih' dari Excel — melainkan soal JEJAK. Script adalah jejak yang bisa diaudit; filter manual bukan. Di data kesehatan, angka yang tidak bisa dihitung ulang adalah angka yang tidak bisa dipercaya — dan dashboard yang angkanya berubah tanpa penjelasan adalah dashboard yang tidak dipakai untuk keputusan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Perbaikan: satu script R (baca mentah, bersihkan, hitung, tulis dashboard) menggantikan filter manual mingguan. Angka bisa dihitung ulang kapan pun karena script dan file mentah tersimpan. Jejak yang bisa diaudit adalah bedanya.",
      },
      reference: "Angka yang tidak bisa dihitung ulang adalah angka yang tidak bisa dipercaya.",
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
        "R berpikir dalam vektor; indeks mulai 1; tibble menolak operasi ambigu; glimpse dulu sebelum menghitung.",
        "Lima kata kerja dplyr: filter, select, mutate, group_by + summarise, left_join — baca mentah, tulis bersih.",
        "Lab: usia 52,0; BMI 27,12; prevalensi 62,5 persen (P 75,0, L 50,0); sistolik 148,0 lawan 115,0; selisih 33,0.",
        "ggplot2 = data + pemetaan + geometri; selalu sertakan n per kelompok; jangan potong sumbu tanpa alasan.",
        "lm dengan prediktor biner = selisih rata-rata; 33,0 adalah beda mentah, bukan efek kausal (HD10).",
      ],
      next: { label: "HD34 — Deep Learning untuk Kesehatan: CNN, LSTM, Autoencoder dan Grad-CAM", href: "/v2/learn/hd34-deep-learning-kesehatan" },
      quiz: [
        {
          q: "Di R, usia[1] adalah 45 (elemen pertama). Seorang analis Python menulis usia[1] mengharapkan 62. Apa pelajarannya?",
          options: [
            { text: "R salah — indeks harus mulai dari 0 seperti bahasa modern", why: "Salah: bukan soal benar-salah, melainkan konvensi. R memakai 1-based sejak lahir; analis harus mengikuti konvensi bahasa yang dipakai, bukan yang dihafal." },
            { text: "Indeks R mulai dari 1, bukan 0 — selalu uji dengan vektor kecil yang isinya kamu hafal", why: "Tepat: selisih satu indeks telah membalikkan banyak analisis. Uji usia[1] pada vektor yang kamu kenal sebelum menghitung.", correct: true },
            { text: "Vektor R tidak bisa diindeks — harus memakai fungsi khusus", why: "Salah: vektor R bisa diindeks dengan [ ]. Yang berbeda hanya angka awalnya: 1, bukan 0." },
            { text: "Tidak ada dampak — mean dan summarise tidak memakai indeks", why: "Salah: banyak operasi memakai indeks (subset, lag, jendela). Indeks yang salah satu angka berarti baris yang salah." },
          ],
        },
        {
          q: "Prevalensi diabetes perempuan 75,0 persen dan laki-laki 50,0 persen, dari 4 orang per kelompok. Apa yang harus ditulis bersama angka ini?",
          options: [
            { text: "Tidak perlu tambahan — persen sudah cukup menjelaskan", why: "Salah: 75 persen dari 4 orang berarti 3 orang. Tanpa n, pembaca tidak tahu apakah 75 persen itu 3 dari 4 atau 750 dari 1.000 — dua bukti yang sangat berbeda." },
            { text: "Jumlah observasi per kelompok (n sama dengan 4) — persen tanpa penyebut adalah gosip", why: "Tepat: proporsi tanpa penyebut tidak bisa dinilai. Selalu sertakan n, di grafik maupun di tabel.", correct: true },
            { text: "Nilai p dari uji beda proporsi", why: "Salah: nilai p bukan pengganti n. Dengan n sama dengan 4, uji apa pun hampir tidak punya daya — nilai p di sini lebih menyesatkan daripada membantu." },
            { text: "Rata-rata usia tiap kelompok saja sudah cukup", why: "Salah: usia adalah informasi tambahan yang berguna, tetapi bukan pengganti n. Penyebut harus ditulis eksplisit." },
          ],
        },
        {
          q: "Model lm memberi koefisien diabetes 33,0 untuk sistolik. Apa tafsiran yang benar?",
          options: [
            { text: "Diabetes menyebabkan sistolik naik 33 poin", why: "Salah: ini data observasional. 33,0 adalah beda mentah — pasien diabetes juga lebih tua, dan usia menaikkan sistolik. Efek kausal butuh desain kausal (HD10)." },
            { text: "Rata-rata sistolik pasien diabetes 33 poin lebih tinggi dari yang bukan — beda mentah, bukan efek kausal", why: "Tepat: koefisien pada prediktor biner adalah selisih rata-rata. 'Kenapa berbeda' adalah pertanyaan terpisah yang dijawab desain kausal.", correct: true },
            { text: "Setiap pasien diabetes pasti punya sistolik 33 poin di atas normal", why: "Salah: 33,0 adalah rata-rata kelompok, bukan ramalan per orang. Variasi di dalam kelompok jauh lebih besar dari selisih antar kelompok." },
            { text: "Angka 33,0 tidak bermakna karena modelnya terlalu sederhana", why: "Salah: model sederhana yang ditafsir benar lebih berharga dari model rumit yang ditafsir salah. 33,0 bermakna sebagai beda rata-rata — dan itu sudah berguna." },
          ],
        },
        {
          q: "Kapan memakai SQL dulu sebelum R (HD27)?",
          options: [
            { text: "Selalu — R tidak bisa membaca CSV", why: "Salah: R membaca CSV dengan read_csv. SQL dipakai saat data tersebar di banyak tabel dan berukuran besar." },
            { text: "Saat data tersebar di puluhan tabel EHR dan harus digabung sebelum dianalisis", why: "Tepat: join dan filter jutaan baris lebih cepat dan aman di database; R menerima hasil yang sudah rapi.", correct: true },
            { text: "Saat ingin membuat grafik — SQL punya grafik lebih baik dari ggplot2", why: "Salah: SQL bukan alat grafik. Grafik adalah wilayah ggplot2; SQL adalah wilayah penggabungan dan penyaringan data besar." },
            { text: "Tidak pernah — R bisa melakukan semua yang dilakukan SQL", why: "Salah: secara teori bisa, secara praktik tidak bijak. Menarik jutaan baris ke memori R untuk join sederhana adalah pemborosan yang rawan gagal." },
          ],
        },
        {
          q: "Analis lupa menulis na.rm sama dengan TRUE dan mendapat NA di mana-mana. Apa yang seharusnya dilakukan?",
          options: [
            { text: "Menulis na.rm sama dengan TRUE di mana-mana tanpa berpikir — yang penting angkanya keluar", why: "Salah: itu menelan nilai hilang diam-diam. Angka dari data yang separuh hilang terlihat rapi tetapi menyesatkan." },
            { text: "Menangani nilai hilang secara eksplisit mengikuti HD8 — laporkan berapa yang hilang, lalu putuskan (filter, imputasi, atau model) dengan alasan tertulis", why: "Tepat: nilai hilang adalah informasi, bukan gangguan. Keputusan atasnya harus eksplisit dan tertulis, bukan diserahkan ke default.", correct: true },
            { text: "Menghapus semua baris dengan NA dari file mentahnya", why: "Salah: menimpa file mentah adalah dosa yang tidak bisa ditebus — data yang hilang tidak bisa dikembalikan. Bersihkan ke file baru, jangan pernah timpa mentah." },
            { text: "Mengganti NA dengan 0 agar hitungan jalan", why: "Salah: 0 adalah nilai, bukan 'tidak ada'. Mengganti NA dengan 0 menarik rata-rata ke bawah dan menciptakan pasien yang tidak pernah ada." },
          ],
        },
      ],
    },
  ],
};
