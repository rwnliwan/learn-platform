import type { V2Lesson } from "../lib/types";

export const hd38: V2Lesson = {
  slug: "hd38-mimic-iii",
  track: "Health Data Science",
  module: "Tooling & Tata Kelola Data",
  title: "HD38 — MIMIC-III: Hands-On Database EHR Publik",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "1.000 pasien ICU — dan angka yang tidak boleh dibaca mentah",
      prose: [
        "Seorang analis mendapat akses ke MIMIC-III — database rekam medis elektronik (EHR) publik dari ICU Beth Israel Deaconess Medical Center: puluhan ribu pasien, jutaan catatan. Ia mendefinisikan kohor 1.000 pasien ICU: 132 meninggal di rumah sakit — mortalitas 13,2 persen. Di antara 240 pasien sepsis (24,0 persen kohor), 58 meninggal — mortalitas 24,2 persen. Median lama rawat 3,2 hari.",
        "Angka-angka itu terlihat sederhana. Tetapi analis yang baik tahu: 13,2 persen bukan 'mortalitas ICU' secara umum — ia adalah mortalitas KOHOR ini, dengan definisi inklusi ini, pada periode ini. MIMIC-III adalah data nyata dengan semua kekotorannya: tanggal digeser untuk de-identifikasi, pasien bisa masuk ICU berkali-kali, dan 'sepsis' punya tiga definisi berbeda yang memberi tiga angka berbeda.",
        "Lesson ini mengajarkan MIMIC-III hands-on: struktur, akses, definisi kohor, dan kueri pertama. Setelah lesson ini kamu bisa: (1) menjelaskan struktur MIMIC-III dan tabel intinya; (2) menjelaskan de-identifikasi dan syarat aksesnya; (3) mendefinisikan kohor dengan kriteria inklusi/eksklusi yang tajam; (4) menghitung mortalitas dan lama rawat dari tabel; (5) menyebutkan tiga jebakan klasik analisis MIMIC-III.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson HD yang membahas MIMIC-III — grep MIMIC di seluruh track menghasilkan nol. HD11 mengajarkan wrangling EHR secara umum dan HD27 mengajarkan SQL kesehatan, tetapi database EHR publik yang menjadi standar latihan dunia ini belum pernah diajarkan sebagai hands-on. Lesson ini mengisi celah itu — dengan data sintetis yang meniru struktur MIMIC-III di lab, karena akses MIMIC-III asli butuh pelatihan dan perjanjian.",
      },
      reference: "Kohor 1.000 pasien ICU: mortalitas 13,2 persen (132); sepsis 240 pasien (24,0 persen), mortalitas 24,2 persen (58); median LOS 3,2 hari.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membuka MIMIC-III dan menghitung angka pertamamu — dengan definisi yang tajam.",
        "(1) Menjelaskan struktur MIMIC-III: pasien, admisi, ICU stay, chart, dan lab;",
        "(2) Menjelaskan de-identifikasi: tanggal digeser, usia di atas 89 tahun dikelompokkan;",
        "(3) Mendefinisikan kohor: inklusi, eksklusi, dan indeks waktu;",
        "(4) Menghitung mortalitas keseluruhan dan per subkelompok dari tabel;",
        "(5) Menyebutkan tiga jebakan: admisi ganda, definisi sepsis, dan tanggal yang digeser.",
      ],
      tasks: [],
    },
    {
      id: "struktur",
      eyebrow: "Langkah 3 · Teori",
      title: "Struktur MIMIC-III: lima tabel yang harus dikenal",
      prose: [
        "PATIENTS: satu baris per pasien — subject_id, jenis kelamin, tanggal lahir (digeser), tanggal kematian (bila meninggal). ADMISSIONS: satu baris per rawat inap — hadm_id, waktu masuk dan keluar, jenis admisi (darurat/elektif), diagnosis utama. Satu pasien bisa punya banyak admisi — dan ini jebakan pertama: menghitung 'pasien' dari tabel admisi tanpa deduplikasi berarti menghitung orang yang sama berkali-kali.",
        "ICUSTAYS: satu baris per masa rawat ICU — icustay_id, hadm_id, waktu masuk dan keluar ICU. Satu admisi bisa punya banyak ICU stay (pindah ICU). CHARTEVENTS: jutaan baris tanda vital dan observasi — detak jantung, tekanan darah, skor GCS — dengan itemid yang merujuk ke D_ITEMS. LABEVENTS: hasil laboratorium — dengan itemid yang merujuk ke D_LABITEMS. Dua tabel 'D_' adalah kamus: tanpa mereka, itemid hanyalah angka.",
        "De-identifikasi mengikuti aturan HIPAA: semua tanggal digeser ke masa depan dengan offset acak PER PASIEN — tetapi interval antar-peristiwa dipertahankan (lama rawat tetap benar, tanggal kalender tidak). Usia di atas 89 tahun dikelompokkan menjadi 300 tahun (ya, 300 — kode yang menandai 'di atas 89') untuk mencegah identifikasi. Nama, alamat, dan nomor identitas dihapus. Konsekuensinya: analisis musiman (misalnya flu musim dingin) TIDAK bisa dilakukan — tanggal kalender sudah tidak bermakna.",
        "Akses membutuhkan dua hal: pelatihan perlindungan subjek manusia (CITI) dan perjanjian penggunaan data yang ditandatangani — plus persetujuan institusi. MIMIC-III bukan 'unduh bebas': ia adalah data pasien nyata yang dide-identifikasi, dan aksesnya adalah kepercayaan yang bisa dicabut. Aturan yang tidak bisa ditawar: tidak ada upaya re-identifikasi, tidak ada pembagian data ke pihak yang tidak berizin.",
      ],
      tasks: [],
      note: {
        title: "MIMIC-III vs MIMIC-IV",
        body: "MIMIC-IV adalah penerus MIMIC-III: periode lebih baru (2008–2022 vs 2001–2012), struktur tabel yang diperbarui (misalnya labevents dipecah), dan modul baru (ED, radiologi). Lesson ini memakai MIMIC-III karena ia yang paling banyak dipakai dalam tutorial dan makalah — tetapi prinsipnya sama: pahami struktur dan de-identifikasinya sebelum satu kueri pun.",
      },
      reference: "Tabel inti: PATIENTS, ADMISSIONS, ICUSTAYS, CHARTEVENTS, LABEVENTS + kamus D_ITEMS/D_LABITEMS. Tanggal digeser per pasien; usia di atas 89 menjadi 300.",
    },
    {
      id: "kohor",
      eyebrow: "Langkah 4 · Teori",
      title: "Definisi kohor: angka yang tajam dimulai dari definisi yang tajam",
      prose: [
        "Kohor kita: 1.000 pasien ICU dewasa (usia 18 tahun ke atas) pada admisi pertama mereka, periode studi penuh. Tiga keputusan definisi yang menentukan angka akhir. Pertama, UNIT ANALISIS: pasien atau admisi? Kita memakai pasien pada admisi pertama — satu pasien satu baris — supaya pasien dengan 5 admisi tidak dihitung 5 kali. Kedua, INDEKS WAKTU: waktu masuk ICU pertama adalah t=0; mortalitas diukur sebagai kematian selama rawat inap itu (in-hospital mortality).",
        "Ketiga, DEFINISI SUBKELOMPOK: sepsis didefinisikan sebagai infeksi yang dicurigai (kultur + antibiotik) ditambah disfungsi organ (skor SOFA 2 atau lebih) — definisi Sepsis-3. Dari 1.000 pasien, 240 memenuhi definisi ini — 24,0 persen kohor. Definisi lain memberi angka lain: definisi berbasis kode ICD saja memberi 310 pasien; definisi berbasis kultur saja memberi 190. Bila dua analis memakai definisi berbeda, mereka membandingkan dua penyakit berbeda — dan tidak ada yang salah, kecuali mereka mengira membandingkan hal yang sama.",
        "Hasil kohor: mortalitas keseluruhan 132 dari 1.000 sama dengan 13,2 persen. Mortalitas sepsis 58 dari 240 sama dengan 24,2 persen (tepatnya 24,1667 persen, dibulatkan satu desimal). Mortalitas non-sepsis: 74 dari 760 sama dengan 9,7 persen. Median lama rawat ICU 3,2 hari — median, bukan rata-rata, karena distribusi LOS sangat miring ke kanan (sedikit pasien tinggal berminggu-minggu).",
        "Tiga jebakan klasik. Pertama, ADMISI GANDA: pasien yang sama muncul berkali-kali — deduplikasi dulu, hitung kemudian. Kedua, DEFINISI: sepsis, AKI, dan delirium punya banyak definisi — tulis definisimu dan bandingkan dengan definisi lain. Ketiga, TANGGAL DIGESER: jangan analisis musiman atau tren kalender — tanggalnya sudah tidak bermakna. Keempat (bonus): DATA HILANG BUKAN ACAK — pasien yang lebih sakit diukur lebih sering; frekuensi pengukuran adalah informasi (HD8).",
      ],
      tasks: [],
      note: {
        title: "Tulis definisi sebelum menghitung",
        body: "Aturan yang menyelamatkan banyak proyek MIMIC: tulis kriteria inklusi, eksklusi, definisi outcome, dan indeks waktu DALAM SATU PARAGRAF sebelum menulis kueri pertama. Bila paragraf itu tidak bisa ditulis, kuerinya belum boleh ditulis. Kohor yang didefinisikan sesudah melihat hasil adalah kohor yang dipilih untuk memberi hasil yang diinginkan.",
      },
      reference: "Mortalitas keseluruhan 13,2 persen; sepsis 24,2 persen; non-sepsis 9,7 persen; median LOS 3,2 hari.",
    },
    {
      id: "lab-mimic",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung mortalitas kohor dari tabel",
      prose: [
        "Lab ini meniru langkah analisis MIMIC-III dalam Python: dari kohor 1.000 pasien — 132 meninggal, 240 sepsis dengan 58 meninggal — hitung mortalitas keseluruhan, proporsi sepsis, mortalitas sepsis, dan mortalitas non-sepsis.",
        "Hitung dulu di kepala. Mortalitas keseluruhan: 132 dibagi 1.000 dikali 100 sama dengan 13,2 persen. Proporsi sepsis: 240 dibagi 1.000 dikali 100 sama dengan 24,0 persen. Mortalitas sepsis: 58 dibagi 240 dikali 100 sama dengan 24,2 persen (tepatnya 24,1667 persen, dibulatkan satu desimal). Mortalitas non-sepsis: 132 dikurangi 58 sama dengan 74 meninggal dari 1.000 dikurangi 240 sama dengan 760 pasien — 74 dibagi 760 dikali 100 sama dengan 9,7 persen (tepatnya 9,7368 persen).",
        "Tugas lab: tulis fungsi yang menerima total pasien, total meninggal, pasien sepsis, dan sepsis meninggal — lalu mencetak empat angka: mortalitas_persen, sepsis_persen, mortalitas_sepsis, mortalitas_nonsepsis. Empat angka ini adalah tabel pertama laporan kohor — yang dibaca sebelum model apa pun dibangun.",
        "Setelah lolos, coba eksperimen: ubah definisi sepsis menjadi berbasis kode ICD (310 pasien, 71 meninggal) dan lihat mortalitas sepsis menjadi 22,9 persen — lalu tanyakan: definisi mana yang kamu pakai, dan apakah perbandinganmu dengan makalah lain memakai definisi yang sama?",
      ],
      tasks: [
        { id: "t1", text: "Hitung mortalitas keseluruhan dan proporsi sepsis" },
        { id: "t2", text: "Hitung mortalitas sepsis" },
        { id: "t3", text: "Hitung mortalitas non-sepsis" },
      ],
      expected: "mortalitas_persen=13.2\nsepsis_persen=24.0\nmortalitas_sepsis=24.2\nmortalitas_nonsepsis=9.7",
      hints: [
        "Mortalitas persen = meninggal dibagi total pasien, dikali 100.",
        "Non-sepsis meninggal = total meninggal dikurangi sepsis meninggal.",
        "Non-sepsis pasien = total pasien dikurangi pasien sepsis.",
        "Bulatkan mortalitas sepsis dan non-sepsis ke 1 desimal.",
      ],
      code: {
        starter: `# Kohor MIMIC-III (data sintetis meniru struktur MIMIC-III).\ntotal_pasien = 1000\ntotal_meninggal = 132\npasien_sepsis = 240\nsepsis_meninggal = 58\n\n# TULIS KODEMU: hitung empat angka kohor di bawah ini.\n# Cetak, per baris: mortalitas_persen, sepsis_persen,\n# mortalitas_sepsis, mortalitas_nonsepsis.\n\n\nkalkulator_kohor(total_pasien, total_meninggal, pasien_sepsis, sepsis_meninggal)`,
        lockLines: 4,
        solution: `# Kohor MIMIC-III (data sintetis meniru struktur MIMIC-III).\ntotal_pasien = 1000\ntotal_meninggal = 132\npasien_sepsis = 240\nsepsis_meninggal = 58\n\n\ndef kalkulator_kohor(total_pasien, total_meninggal, pasien_sepsis, sepsis_meninggal):\n    mortalitas_persen = total_meninggal / total_pasien * 100\n    sepsis_persen = pasien_sepsis / total_pasien * 100\n    mortalitas_sepsis = round(sepsis_meninggal / pasien_sepsis * 100, 1)\n    nonsepsis_meninggal = total_meninggal - sepsis_meninggal\n    nonsepsis_pasien = total_pasien - pasien_sepsis\n    mortalitas_nonsepsis = round(nonsepsis_meninggal / nonsepsis_pasien * 100, 1)\n    print(f"mortalitas_persen={mortalitas_persen}")\n    print(f"sepsis_persen={sepsis_persen}")\n    print(f"mortalitas_sepsis={mortalitas_sepsis}")\n    print(f"mortalitas_nonsepsis={mortalitas_nonsepsis}")\n\n\nkalkulator_kohor(total_pasien, total_meninggal, pasien_sepsis, sepsis_meninggal)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "mortalitas_persen=13.2", label: "Mortalitas 13,2 persen", msg: "132 / 1.000 x 100 = 13,2 persen." },
          { kind: "stdout_matches", task: "t1", pattern: "sepsis_persen=24.0", label: "Sepsis 24,0 persen kohor", msg: "240 / 1.000 x 100 = 24,0 persen — dengan definisi Sepsis-3." },
          { kind: "stdout_matches", task: "t2", pattern: "mortalitas_sepsis=24.2", label: "Mortalitas sepsis 24,2 persen", msg: "58 / 240 x 100 = 24,1667 persen, dibulatkan 24,2." },
          { kind: "stdout_matches", task: "t3", pattern: "mortalitas_nonsepsis=9.7", label: "Mortalitas non-sepsis 9,7 persen", msg: "74 / 760 x 100 = 9,7368 persen, dibulatkan 9,7." },
        ],
      },
      reference: "Mortalitas 13,2 persen; sepsis 24,0 persen kohor; mortalitas sepsis 24,2 persen; non-sepsis 9,7 persen.",
    },
    {
      id: "kueri",
      eyebrow: "Langkah 6 · Teori",
      title: "Kueri pertama: pola SQL yang dipakai berulang",
      prose: [
        "Tiga pola SQL yang dipakai di hampir semua analisis MIMIC-III. Pertama, DEDUPLIKASI admisi pertama: ROW_NUMBER() OVER (PARTITION BY subject_id ORDER BY admittime) — ambil baris nomor 1. Kedua, GABUNG tabel: PATIENTS ke ADMISSIONS lewat subject_id, ADMISSIONS ke ICUSTAYS lewat hadm_id, ICUSTAYS ke CHARTEVENTS lewat icustay_id. Ketiga, AGREGASI jendela waktu: tanda vital dalam 24 jam pertama ICU — filter charttime antara intime dan intime + 24 jam.",
        "Contoh kueri konseptual (baca sebagai pola, bukan kueri yang dijalankan di lab ini): hitung mortalitas dari ADMISSIONS dan PATIENTS dengan menggabungkan subject_id, menyaring admisi pertama, dan menghitung yang meninggal selama rawat inap. Pola yang sama — gabung, saring jendela, agregasi — dipakai untuk sepsis (kultur + antibiotik dalam jendela), AKI (kreatinin naik), dan hampir semua outcome lainnya.",
        "Dua praktik yang membedakan analis MIMIC yang baik. Pertama, HITUNG DENOMINATOR DULU: sebelum menghitung mortalitas, hitung berapa pasien di kohor — dan laporkan berapa yang hilang di tiap langkah eksklusi (diagram alir kohor). Kedua, PERIKSA DISTRIBUSI: bila median LOS 3,2 hari tetapi rata-ratanya 6,8 hari, distribusinya miring — laporkan median, bukan rata-rata. Angka yang dilaporkan tanpa distribusinya adalah angka yang setengah berbohong.",
      ],
      tasks: [],
      note: {
        title: "SQL di sini, Python di lab",
        body: "Kueri SQL di atas ditampilkan sebagai pola untuk dibaca — lab lesson ini memakai Python dengan angka kohor yang sudah diagregasi, karena mesin lab adalah Pyodide dan data MIMIC-III asli tidak ada di lab. Bila kamu punya akses MIMIC-III, jalankan pola yang sama dalam SQL (HD27) dan bandingkan angkanya dengan lab ini.",
      },
      reference: "Pola: ROW_NUMBER untuk admisi pertama; gabung subject_id/hadm_id/icustay_id; filter jendela 24 jam pertama.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: dua analis, dua angka mortalitas",
      prose: [
        "Dua analis menghitung 'mortalitas ICU' dari MIMIC-III yang sama. Analis pertama: 13,2 persen — pasien pada admisi pertama, kematian selama rawat inap. Analis kedua: 18,7 persen — semua admisi (pasien yang sama dihitung berkali-kali), kematian dalam 30 hari setelah keluar ICU. Keduanya benar menurut definisinya — dan keduanya salah bila dikutip tanpa definisi.",
        "Tim menyelesaikannya dengan satu paragraf definisi yang ditulis sebelum analisis: unit pasien pada admisi pertama, outcome kematian selama rawat inap, definisi sepsis Sepsis-3. Angka yang dilaporkan: 13,2 persen keseluruhan, 24,2 persen sepsis, 9,7 persen non-sepsis. Makalah mereka diterima — dan reviewer memuji paragraf definisi itu sebagai bagian terkuat makalah.",
        "Tiga hal yang membuat kasus ini berhasil. Pertama, definisi ditulis sebelum menghitung. Kedua, perbedaan definisi diakui — bukan disembunyikan. Ketiga, angka dilaporkan bersama definisinya — sehingga siapa pun bisa mereplikasi atau membandingkan dengan benar.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: di EHR, definisi ADALAH analisis. Dua analis dengan data yang sama dan definisi berbeda akan menghasilkan angka berbeda — dan keduanya bisa benar. Yang membedakan analis yang baik bukan angkanya, melainkan apakah definisinya tertulis, tajam, dan bisa diulang orang lain.",
      },
      reference: "13,2 persen vs 18,7 persen — keduanya benar menurut definisinya. Definisi tertulis sebelum menghitung.",
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
        "Tabel inti: PATIENTS, ADMISSIONS, ICUSTAYS, CHARTEVENTS, LABEVENTS + kamus D_.",
        "De-identifikasi: tanggal digeser per pasien; usia di atas 89 menjadi 300.",
        "Lab: mortalitas 13,2 persen; sepsis 24,0 persen; mortalitas sepsis 24,2 persen; non-sepsis 9,7 persen.",
        "Definisi ditulis sebelum menghitung — sepsis punya banyak definisi.",
        "Jebakan: admisi ganda, definisi, tanggal digeser, data hilang bukan acak.",
      ],
      next: { label: "HD39 — DALY dan Standardisasi Umur: Mengukur Beban Penyakit", href: "/v2/learn/hd39-daly-standardisasi" },
      quiz: [
        {
          q: "Kohor 1.000 pasien ICU: 132 meninggal; 240 sepsis, 58 di antaranya meninggal. Berapa mortalitas keseluruhan, proporsi sepsis, mortalitas sepsis, dan non-sepsis?",
          options: [
            { text: "13,2 persen; 24,0 persen; 24,2 persen; 9,7 persen", why: "Tepat: 132/1.000 = 13,2; 240/1.000 = 24,0; 58/240 = 24,2; 74/760 = 9,7.", correct: true },
            { text: "13,2 persen; 24,0 persen; 24,2 persen; 13,2 persen", why: "Salah: mortalitas non-sepsis bukan 13,2 — itu mortalitas keseluruhan. Non-sepsis: 74/760 = 9,7 persen." },
            { text: "13,2 persen; 24,0 persen; 58,0 persen; 9,7 persen", why: "Salah: 58 adalah JUMLAH sepsis meninggal, bukan persen. Mortalitas sepsis: 58/240 = 24,2 persen." },
            { text: "13,2 persen; 24,0 persen; 24,2 persen; 74,0 persen", why: "Salah: 74 adalah jumlah non-sepsis meninggal — persennya 74/760 = 9,7." },
          ],
        },
        {
          q: "Mengapa tanggal di MIMIC-III digeser, dan apa konsekuensinya?",
          options: [
            { text: "Untuk menghemat penyimpanan — tidak ada konsekuensi", why: "Salah: penggeseran adalah de-identifikasi, bukan kompresi." },
            { text: "De-identifikasi HIPAA: tanggal kalender tidak bermakna — analisis musiman tidak bisa dilakukan, tetapi interval (lama rawat) tetap benar", why: "Tepat: offset acak per pasien mempertahankan interval antar-peristiwa dan menghapus makna kalender.", correct: true },
            { text: "Karena data MIMIC-III dari masa depan", why: "Salah: tanggal digeser KE masa depan sebagai teknik de-identifikasi — datanya dari 2001–2012." },
            { text: "Untuk menyamakan zona waktu semua pasien", why: "Salah: zona waktu bukan masalah di satu rumah sakit — privasilah alasannya." },
          ],
        },
        {
          q: "Dua analis menghitung mortalitas ICU: 13,2 persen vs 18,7 persen dari data yang sama. Apa penjelasan yang benar?",
          options: [
            { text: "Salah satu pasti salah hitung", why: "Salah: keduanya bisa benar menurut definisinya — unit analisis dan jendela outcome berbeda." },
            { text: "Keduanya benar menurut definisinya — yang satu pasien admisi pertama + kematian rawat inap, yang lain semua admisi + 30 hari. Definisi harus tertulis", why: "Tepat: di EHR, definisi adalah analisis.", correct: true },
            { text: "Yang 18,7 persen memakai data yang salah", why: "Salah: tidak ada data yang salah — ada definisi yang berbeda." },
            { text: "Rata-rata keduanya adalah angka yang benar", why: "Salah: rata-rata dua definisi berbeda adalah angka tanpa definisi — tidak bisa dipakai." },
          ],
        },
        {
          q: "Sepsis didefinisikan tiga cara: Sepsis-3 memberi 240 pasien, kode ICD memberi 310, kultur saja memberi 190. Apa yang harus dilakukan?",
          options: [
            { text: "Pakai yang memberi pasien terbanyak — lebih banyak data lebih baik", why: "Salah: jumlah bukan kriteria — definisi dipilih karena sesuai pertanyaan klinis, bukan karena besar." },
            { text: "Tulis definisi yang dipakai dan alasannya; bandingkan dengan definisi lain bila membandingkan dengan makalah lain", why: "Tepat: definisi adalah keputusan yang dilaporkan — bukan default yang tidak dipertanyakan.", correct: true },
            { text: "Rata-rata ketiganya — 247 pasien", why: "Salah: rata-rata tiga definisi adalah kohor tanpa definisi." },
            { text: "Pakai yang paling mudah dikueri", why: "Salah: kemudahan kueri bukan kriteria definisi klinis." },
          ],
        },
        {
          q: "Mengapa median LOS (3,2 hari) dilaporkan, bukan rata-rata?",
          options: [
            { text: "Karena median selalu lebih kecil dari rata-rata", why: "Salah: median tidak selalu lebih kecil — pada distribusi miring kanan, median lebih kecil karena sedikit pasien tinggal sangat lama." },
            { text: "Karena distribusi LOS miring ke kanan — sedikit pasien tinggal berminggu-minggu dan menarik rata-rata ke atas; median mewakili pasien tipikal", why: "Tepat: untuk distribusi miring, median adalah ukuran tengah yang jujur.", correct: true },
            { text: "Karena rata-rata tidak bisa dihitung dari data MIMIC-III", why: "Salah: rata-rata bisa dihitung — hanya saja menyesatkan untuk distribusi miring." },
            { text: "Karena median adalah standar jurnal", why: "Salah: bukan soal standar jurnal — soal kejujuran statistik terhadap distribusi." },
          ],
        },
      ],
    },
  ],
};
