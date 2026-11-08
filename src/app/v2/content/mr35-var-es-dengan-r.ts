import type { V2Lesson } from "../lib/types";

export const mr35: V2Lesson = {
  slug: "mr35-var-es-dengan-r",
  track: "Market Risk",
  module: "Pengukuran Risiko",
  title: "MR35 — VaR dan Expected Shortfall dengan R: Dari Kuantil ke Laporan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan risiko yang ditulis dalam 10 baris R — dan dibaca direksi dalam 10 detik",
      prose: [
        "Di banyak bank dan manajer aset, laporan risiko harian tidak dibuat di Excel — melainkan di R. Analis risiko menarik 20 return harian terakhir, menjalankan tiga baris kode, dan mendapat VaR 95 persen serta Expected Shortfall — lalu mengirimkannya ke direksi sebelum pasar buka. Alasannya: R adalah bahasa statistik — kuantil, distribusi, dan uji backtesting adalah fungsi bawaan, bukan rumus yang harus ditulis dari nol. Kursus Duke Financial Risk Management with R memakai R tepat karena alasan ini.",
        "Tetapi R bukan sekadar kalkulator yang lebih pendek dari Python. Ia punya ekosistem risiko: paket PerformanceAnalytics untuk VaR dan ES, rugarch untuk GARCH, dan quantmod untuk menarik data pasar. Analis yang menguasai R bisa menarik data, menghitung risiko, menguji backtest, dan menggambar laporan — dalam satu skrip yang bisa diulang setiap pagi tanpa sentuhan tangan.",
        "Lesson ini membangun topik yang tidak ada di track ini: tidak satu pun file Market Risk memakai bahasa R — grep menyeluruh hanya menemukan kata 'bahasa' dalam 'bahasa rupiah' (DV01). MR3 dan MR5 sudah mengajarkan VaR dan ES dengan lab Python; lesson ini mengajarkan implementasi yang sama dalam R — dengan kode R sebagai referensi dan lab Python yang mencerminkan logika R langkah demi langkah. Setelah lesson ini kamu bisa: (1) menghitung VaR historis dan ES dengan fungsi R; (2) menjelaskan beda VaR parametrik dan historis di R; (3) menguji backtest VaR dengan uji Kupiec; (4) menarik data pasar dengan quantmod; (5) menulis laporan risiko yang bisa diulang.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MR3 (VaR) dan MR5 (Expected Shortfall) mengajarkan konsep dan lab Python. Tidak ada lesson Market Risk yang memakai bahasa R — grep 'bahasa R' hanya menemukan 'bahasa rupiah' untuk DV01. Lesson ini membangun implementasi R: quantile, PerformanceAnalytics, backtest Kupiec, dan quantmod. Catatan jujur: mesin lab di aplikasi ini menjalankan Python, bukan R — kode R tampil sebagai referensi yang bisa dijalankan di RStudio, dan lab Python di bawah mencerminkan logika R langkah demi langkah (pola yang sama dipakai HD33 dan BI26 untuk kode R).",
      },
      reference: "20 return harian: VaR 95 persen minus 2,1 persen; ES minus 2,65 persen. Portofolio Rp500 juta: VaR Rp10,5 juta; ES Rp13,25 juta.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis laporan VaR dan ES dalam R — dan menjelaskan setiap barisnya ke direksi.",
        "(1) Menghitung VaR historis dan Expected Shortfall dengan fungsi R;",
        "(2) Menjelaskan beda VaR parametrik (qnorm) dan historis (quantile) di R;",
        "(3) Menguji backtest VaR dengan uji Kupiec;",
        "(4) Menarik data pasar dengan quantmod;",
        "(5) Menulis skrip laporan risiko yang bisa diulang setiap pagi.",
      ],
      tasks: [],
    },
    {
      id: "var-r",
      eyebrow: "Langkah 3 · Teori",
      title: "VaR dan ES historis dalam R: tiga baris kode",
      prose: [
        "VaR historis di R adalah satu fungsi: quantile. Dengan 20 return harian (dalam persen) — minus 3,2; minus 2,1; minus 1,8; minus 1,5; minus 1,2; minus 0,9; minus 0,7; minus 0,5; minus 0,3; minus 0,1; 0,0; 0,2; 0,4; 0,6; 0,8; 1,0; 1,3; 1,6; 2,0; 2,5 — VaR 95 persen dengan konvensi order statistic sederhana adalah elemen ke-2 terkecil: minus 2,1 persen. Catatan jujur: quantile() bawaan R memakai interpolasi (type 7) dan memberi minus 2,155 persen untuk data ini — selisih kecil dari interpolasi antar dua return terkecil. Lesson ini dan lab-nya memakai konvensi order statistic (sama dengan quantile(ret, 0.05, type = 1) di R) agar angkanya transparan dan cocok dengan lab. Artinya: dalam 5 persen hari terburuk, kerugian melebihi 2,1 persen. Untuk portofolio Rp500 juta, VaR = 2,1 persen × 500 juta = Rp10,5 juta.",
        "Expected Shortfall adalah rata-rata dari return yang lebih buruk dari VaR: mean(ret[ret <= var_95]) = (minus 3,2 + minus 2,1) dibagi 2 = minus 2,65 persen. ES = 2,65 persen × 500 juta = Rp13,25 juta. ES selalu lebih besar dari VaR (dalam nilai absolut) — karena ia rata-rata dari ekor, bukan batas ekor. Inilah alasan FRTB (MR16) memakai ES, bukan VaR: ES menghukum ekor gemuk, VaR tidak.",
        "VaR parametrik memakai distribusi normal: var_param = mean(ret) + qnorm(0.05) × sd(ret). Dengan mean 0,0 persen dan standar deviasi 1,5 persen (nilai dibulatkan — mean sebenarnya dari 20 data ini minus 0,10 persen dan sd 1,45 persen; hasilnya sama): qnorm(0.05) = minus 1,645 → var_param = 0,0 + (minus 1,645) × 1,5 = minus 2,47 persen. Bandingkan dengan historis minus 2,1 persen: parametrik lebih konservatif di sini — tetapi bila return berekor tebal (MR37), parametrik justru MEREMEHKAN risiko karena normal tidak punya ekor gemuk. Aturan praktis: laporkan keduanya — bila selisihnya besar, distribusimu tidak normal dan historis lebih bisa dipercaya.",
        "Paket PerformanceAnalytics membungkus semuanya: VaR(ret, p = 0.95, method = 'historical') dan ES(ret, p = 0.95, method = 'historical'). Satu baris untuk VaR, satu baris untuk ES — dengan metode yang bisa diganti menjadi 'gaussian' atau 'modified' (Cornish-Fisher, yang mengoreksi skewness dan kurtosis). Analis yang memakai paket ini tidak menulis rumus — ia memilih metode dan mendokumentasikan pilihannya. Perhatian tanda: VaR() dan ES() di PerformanceAnalytics mengembalikan angka NEGATIF (kerugian — misalnya minus 0,021), karena keduanya adalah kuantil/rata-rata return. Untuk laporan rupiah, ambil nilai absolutnya (seperti lab di bawah memakai abs()) — jangan melaporkan 'VaR minus Rp10,5 juta' sebagai kerugian minus, dan jangan membalik tanda tanpa sadar.",
      ],
      tasks: [],
      formula: String.raw`\text{VaR}_{95} = Q_{0{,}05}(r) \qquad \text{ES}_{95} = E[r \mid r \le \text{VaR}_{95}]`,
      formulaNote: "Q = kuantil; E = rata-rata bersyarat. Contoh: VaR 95 persen minus 2,1 persen; ES minus 2,65 persen. Portofolio Rp500 juta: VaR Rp10,5 juta; ES Rp13,25 juta. Di R: quantile(ret, 0.05, type = 1) dan mean(ret[ret <= var_95]) — type 1 adalah konvensi order statistic lesson ini.",
      reference: "VaR 95 persen minus 2,1 persen (Rp10,5 juta); ES minus 2,65 persen (Rp13,25 juta).",
    },
    {
      id: "backtest-quantmod",
      eyebrow: "Langkah 4 · Teori",
      title: "Backtest Kupiec dan data pasar dengan quantmod",
      prose: [
        "VaR yang tidak diuji adalah tebakan. Uji Kupiec (1995) — uji proporsi kegagalan (POF) — memeriksa apakah jumlah pelanggaran VaR sesuai dengan yang diharapkan, dengan statistik likelihood-ratio: LR = −2 ln[ ((1−p)^(T−x) · p^x) / ((1−x/T)^(T−x) · (x/T)^x) ], yang dibandingkan dengan nilai kritis chi-kuadrat 1 derajat bebas, 3,84 pada 5 persen. Contoh: VaR 95 persen dipakai 250 hari, pelanggaran yang diharapkan = 250 × 5 persen = 12,5. Bila pelanggaran aktual 25, LR ≈ 10,3 — di atas 3,84, model DITOLAK karena meremehkan risiko. Bila pelanggaran hanya 2, LR ≈ 14,1 — model DITOLAK JUGA, dari arah sebaliknya: terlalu konservatif sehingga modal terbuang. Bila pelanggaran 12 atau 13, LR ≈ 0,02 — model lolos. Perhatikan: Kupiec hanya menguji JUMLAH pelanggaran (unconditional coverage) — ia tidak menguji apakah pelanggaran itu BERKELOMPOK (clustering); untuk itu ada uji Christoffersen. Di R, uji ini adalah bagian dari backtesting: hitung pelanggaran tiap hari (ret < var_95), lalu hitung LR-nya. MR6 membahas backtesting secara konseptual; R membuatnya menjadi tiga baris kode.",
        "Data pasar di R datang dari quantmod: getSymbols('BBCA.JK', src = 'yahoo') menarik harga BBCA dari Yahoo Finance; dailyReturn(BBCA.JK) menghitung return harian. Dua baris — tanpa API key, tanpa download manual. Analis risiko pagi hari: tarik data, hitung return, hitung VaR dan ES, uji backtest, kirim laporan. Seluruh alur bisa dijadwalkan (cron) dan diulang tanpa sentuhan tangan — inilah yang membedakan laporan risiko profesional dari spreadsheet yang di-copy-paste tiap pagi.",
        "Satu peringatan tentang data Yahoo: data gratis bisa mengandung harga yang salah (stale price, stock split yang tidak disesuaikan) — MR32 membahas validasi data pasar. Selalu periksa: apakah ada return harian di atas 50 persen (kemungkinan split yang tidak disesuaikan)? Apakah ada harga yang sama berhari-hari (stale)? R memudahkan penarikan data — tetapi tidak membebaskanmu dari validasi.",
        "Skrip laporan yang bisa diulang punya empat bagian: tarik data (quantmod), hitung risiko (PerformanceAnalytics), uji backtest (Kupiec), dan tulis laporan (rmarkdown). RMarkdown mengubah skrip menjadi PDF atau HTML dengan angka, tabel, dan grafik — laporan direksi yang diperbarui tiap pagi dari skrip yang sama. Analis yang menulis skrip sekali dan memakainya 250 kali setahun sedang bekerja 250 kali lebih efisien dari analis yang menulis laporan 250 kali.",
      ],
      tasks: [],
      note: {
        title: "Kode R di lesson ini",
        body: "Kode R ditampilkan dengan penugasan = (bukan panah) agar sesuai aturan penulisan lesson, dan tanpa pipe — tetapi kode itu valid di RStudio apa adanya. Contoh: var_95 = quantile(ret, 0.05, type = 1); es_95 = mean(ret[ret <= var_95]); var_param = mean(ret) + qnorm(0.05) * sd(ret). Salin ke RStudio dan jalankan — hasilnya sama dengan lab Python di bawah. Tanpa type = 1, quantile() bawaan memakai interpolasi type 7 dan memberi minus 2,155 persen — selisih kecil yang sudah dijelaskan di langkah 3.",
      },
      reference: "Kupiec: LR = −2 ln(rasio likelihood), kritis 3,84 (chi-kuadrat 1 db); 250 hari → diharapkan 12,5 pelanggaran; x=25 → LR ≈ 10,3 ditolak; x=2 → LR ≈ 14,1 ditolak; x=12–13 → LR ≈ 0,02 lolos. quantmod: getSymbols dan dailyReturn. Laporan: RMarkdown.",
    },
    {
      id: "lab-r",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin VaR dan ES (logika R, dijalankan Python)",
      prose: [
        "Lab ini mencerminkan logika R langkah demi langkah — tetapi dijalankan dalam Python karena mesin lab aplikasi ini memakai Python. Logika yang sama, bahasa yang berbeda: urutkan return, ambil kuantil 5 persen, rata-ratakan ekornya.",
        "Hitung dulu di kepala. Return terurut (20 data): minus 3,2 adalah yang terkecil, minus 2,1 yang kedua terkecil. VaR 95 persen = kuantil 5 persen = minus 2,1 persen. ES = rata-rata return yang kurang dari atau sama dengan VaR = (minus 3,2 + minus 2,1) dibagi 2 = minus 2,65 persen. Portofolio Rp500 juta: VaR rupiah = 2,1 persen × 500 = Rp10,5 juta; ES rupiah = 2,65 persen × 500 = Rp13,25 juta.",
        "Tugas lab: tulis fungsi yang menerima daftar return dan nilai portofolio — lalu mencetak VaR 95 persen (2 desimal), ES 95 persen (2 desimal), VaR rupiah, dan ES rupiah. Empat angka ini adalah laporan risiko harian dalam bentuk terkecilnya.",
        "Setelah lolos, coba eksperimen: ganti return terburuk menjadi minus 8,0 (krisis) dan lihat VaR tetap minus 2,1 persen tetapi ES jatuh ke minus 5,05 persen — lalu tanyakan: ukuran mana yang menangkap krisis, dan kenapa FRTB memilih ES?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var95` (kuantil 5 persen dari return terurut)" },
        { id: "t2", text: "Hitung `es95` (rata-rata return yang kurang dari atau sama dengan VaR)" },
        { id: "t3", text: "Hitung `var_rp` dan `es_rp` (persen dikali nilai portofolio)" },
      ],
      expected: "var95=-2.10\nes95=-2.65\nvar_rp=10.5\nes_rp=13.25",
      hints: [
        "Urutkan return; VaR 95% = elemen ke-2 terkecil (kuantil 5% dari 20 data).",
        "ES = rata-rata semua return yang <= VaR.",
        "Nilai rupiah = |persen| / 100 x nilai portofolio.",
      ],
      code: {
        starter: `# 20 return harian (%) dan portofolio Rp500 juta. Logika sama dengan quantile() R.\nret = [-3.2, -2.1, -1.8, -1.5, -1.2, -0.9, -0.7, -0.5, -0.3, -0.1,\n       0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.3, 1.6, 2.0, 2.5]\nportofolio = 500.0  # juta rupiah\n\n# TULIS KODEMU: hitung var95, es95, var_rp, es_rp.\n# Cetak, per baris: var95, es95, var_rp, es_rp.\n\n`,
        lockLines: 4,
        solution: `# 20 return harian (%) dan portofolio Rp500 juta. Logika sama dengan quantile() R.\nret = [-3.2, -2.1, -1.8, -1.5, -1.2, -0.9, -0.7, -0.5, -0.3, -0.1,\n       0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.3, 1.6, 2.0, 2.5]\nportofolio = 500.0  # juta rupiah\n\n\nurut = sorted(ret)\nvar95 = urut[1]\nekor = [x for x in urut if x <= var95]\nes95 = sum(ekor) / len(ekor)\nvar_rp = abs(var95) / 100 * portofolio\nes_rp = abs(es95) / 100 * portofolio\nprint(f"var95={var95:.2f}")\nprint(f"es95={es95:.2f}")\nprint(f"var_rp={var_rp:.2f}")\nprint(f"es_rp={es_rp:.2f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "var95", value: -2.1, tol: 0.01, label: "VaR 95 persen minus 2,10 persen", msg: "Kuantil 5 persen dari 20 data = elemen ke-2 terkecil = -2,1. Sama dengan quantile(ret, 0.05) di R." },
          { kind: "equal", task: "t2", name: "es95", value: -2.65, tol: 0.01, label: "ES 95 persen minus 2,65 persen", msg: "(-3,2 + -2,1) / 2 = -2,65. Sama dengan mean(ret[ret <= var_95]) di R." },
          { kind: "equal", task: "t3", name: "var_rp", value: 10.5, tol: 0.01, label: "VaR Rp10,5 juta", msg: "2,1 persen x 500 = 10,5." },
          { kind: "equal", task: "t3", name: "es_rp", value: 13.25, tol: 0.01, label: "ES Rp13,25 juta", msg: "2,65 persen x 500 = 13,25. ES lebih besar dari VaR — ia menghukum ekor." },
        ],
      },
      reference: "VaR 95 persen minus 2,1 persen (Rp10,5 juta); ES minus 2,65 persen (Rp13,25 juta).",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 6 · Teori",
      title: "Praktik: R vs Python — kapan memakai yang mana",
      prose: [
        "R dan Python keduanya bisa menghitung VaR — pilihannya bukan soal benar atau salah, melainkan soal ekosistem. R unggul di statistik klasik dan laporan: kuantil, distribusi, uji hipotesis, dan RMarkdown adalah bawaan. Python unggul di produksi dan machine learning: pipeline data, model ML, dan deployment ke sistem bank. Bank besar memakai keduanya: R untuk riset dan laporan, Python untuk produksi dan otomasi.",
        "Tiga jebakan R yang wajib diketahui. Pertama, R memakai indeks mulai dari 1 — ret[1] adalah elemen pertama, bukan kedua seperti Python. Kedua, R menyalin data saat diubah (copy-on-modify) — data besar menjadi lambat bila tidak memakai data.table. Ketiga, banyak paket R ditulis akademisi — dokumentasinya kadang minim dan fungsinya berubah antar versi. Selalu kunci versi paket (renv) untuk laporan yang harus bisa diulang tahun depan.",
        "Aturan penutup: bahasa adalah alat, bukan identitas. Analis risiko yang hanya bisa satu bahasa akan selalu menemukan masalah yang 'tidak bisa' diselesaikan — padahal masalahnya hanya membutuhkan bahasa lain. Kuasai satu dengan dalam, kenali satu lagi dengan cukup untuk membaca dan menerjemahkan. Lesson ini memberimu yang kedua untuk R — dan lab Python-nya memastikan logikanya kamu kuasai di bahasa pertamamu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira VaR parametrik (normal) selalu lebih konservatif dari historis. Bila return berekor tebal, parametrik MEREMEHKAN risiko — normal tidak punya ekor gemuk. Selalu laporkan keduanya dan selidiki bila selisihnya besar.",
      },
      reference: "R untuk riset dan laporan; Python untuk produksi dan ML. Kunci versi paket dengan renv.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: laporan yang menyelamatkan rapat direksi",
      prose: [
        "Jumat sore, direksi Bank Nusantara meminta laporan risiko Senin pagi — setelah pasar jatuh 5 persen dalam seminggu. Analis lama akan menghabiskan akhir pekan di Excel. Analis R menulis skrip 15 baris: tarik data seminggu (quantmod), hitung VaR dan ES historis dan parametrik (PerformanceAnalytics), uji backtest Kupiec, dan render RMarkdown ke PDF. Senin pukul 07.00, laporan sudah di meja direksi: VaR 95 persen Rp10,5 juta, ES Rp13,25 juta, backtest lolos (pelanggaran sesuai ekspektasi), dan satu paragraf: ES naik 40 persen dari minggu lalu karena ekor menebal — bukan karena posisi membesar.",
        "Direksi tidak bertanya tentang kode — mereka bertanya tentang paragraf terakhir: 'Ekor menebal — apa artinya?' Analis menjawab: 'Kerugian besar menjadi lebih mungkin — bukan karena kita memegang lebih banyak, melainkan karena pasar menjadi lebih berbahaya. Rekomendasi: kurangi limit intraday 20 persen sampai volatilitas kembali normal.' Direksi menyetujui dalam 10 menit. Laporan yang baik bukan yang paling panjang — melainkan yang menjawab pertanyaan sebelum ditanyakan.",
        "Keputusan itu menyelamatkan bank Rp50 juta minggu berikutnya saat pasar jatuh lagi 3 persen — karena posisi sudah dikurangi. Bukan karena modelnya sempurna — melainkan karena alurnya bisa diulang setiap pagi, dan karena analisnya memahami angka yang ia laporkan, bukan sekadar menyalinnya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat laporan ini bekerja. Pertama, alur yang bisa diulang (skrip, bukan spreadsheet manual). Kedua, dua metode dilaporkan (historis dan parametrik) sehingga selisihnya memberi informasi. Ketiga, laporan diakhiri rekomendasi tindakan — bukan sekadar angka.",
      },
      reference: "VaR Rp10,5 juta; ES Rp13,25 juta; ES naik 40 persen karena ekor menebal. Limit intraday dipotong 20 persen.",
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
        "VaR 95 persen minus 2,1 persen (Rp10,5 juta); ES minus 2,65 persen (Rp13,25 juta).",
        "Di R: quantile(ret, 0.05) untuk VaR; mean(ret[ret <= var_95]) untuk ES.",
        "VaR parametrik memakai qnorm — bisa meremehkan risiko bila return berekor tebal.",
        "Uji Kupiec: 250 hari → pelanggaran diharapkan 12,5; LR kritis 3,84 (x=25 → LR ≈ 10,3 ditolak; x=2 → LR ≈ 14,1 ditolak juga).",
        "quantmod menarik data; RMarkdown merender laporan yang bisa diulang.",
      ],
      next: { label: "MR36 — Risiko Repo: Haircut, Rehypothecation, dan Repo Run", href: "/v2/learn/mr36-repo-risk" },
      quiz: [
        {
          q: "20 return harian, dua terkecil minus 3,2 dan minus 2,1 persen. Portofolio Rp500 juta. Berapa VaR 95 persen dan ES-nya?",
          options: [
            { text: "VaR minus 2,1 persen (Rp10,5 juta); ES minus 2,65 persen (Rp13,25 juta)", why: "Tepat: kuantil 5 persen = elemen ke-2 terkecil = −2,1; ES = (−3,2 + −2,1)/2 = −2,65.", correct: true },
            { text: "VaR minus 3,2 persen (Rp16 juta); ES minus 2,1 persen (Rp10,5 juta)", why: "Salah: VaR bukan return terburuk — ia kuantil 5 persen. Dan ES selalu LEBIH BESAR dari VaR, bukan lebih kecil." },
            { text: "VaR minus 1,8 persen (Rp9 juta); ES minus 2,65 persen (Rp13,25 juta)", why: "Salah: −1,8 adalah elemen ke-3 terkecil (kuantil 10 persen), bukan kuantil 5 persen." },
            { text: "VaR minus 2,65 persen; ES minus 2,1 persen — ES lebih kecil dari VaR", why: "Salah: terbalik. ES adalah rata-rata ekor — selalu lebih besar (nilai absolut) dari VaR." },
          ],
        },
        {
          q: "Di R, fungsi apa yang menghitung VaR historis 95 persen dari vektor return `ret`?",
          options: [
            { text: "mean(ret)", why: "Salah: mean menghitung rata-rata — bukan kuantil. VaR adalah kuantil ekor." },
            { text: "quantile(ret, 0.05)", why: "Tepat: kuantil 5 persen dari return adalah VaR 95 persen. Satu fungsi, satu baris.", correct: true },
            { text: "sd(ret)", why: "Salah: sd menghitung standar deviasi — dipakai VaR parametrik bersama qnorm, bukan VaR historis." },
            { text: "sum(ret)", why: "Salah: sum menjumlahkan semua return — tidak ada hubungannya dengan kuantil ekor." },
          ],
        },
        {
          q: "VaR parametrik (normal) memberi minus 2,47 persen, historis memberi minus 2,1 persen, tetapi returnmu berekor tebal. Apa kesimpulan yang benar?",
          options: [
            { text: "Parametrik selalu benar karena memakai distribusi normal yang baku", why: "Salah: normal tidak punya ekor gemuk. Bila return berekor tebal, parametrik MEREMEHKAN risiko — bukan sebaliknya." },
            { text: "Historis lebih bisa dipercaya di sini — normal tidak menangkap ekor tebal; laporkan keduanya dan selidiki selisihnya", why: "Tepat: selisih besar antara keduanya adalah sinyal bahwa distribusimu tidak normal.", correct: true },
            { text: "Historis selalu salah karena hanya memakai 20 data", why: "Salah: 20 data memang sedikit — tetapi itu alasan untuk menambah data, bukan untuk percaya pada distribusi yang salah." },
            { text: "Ambil rata-rata keduanya sebagai VaR final", why: "Salah: rata-rata dari ukuran yang benar dan ukuran yang salah tetap salah. Pilih berdasarkan distribusi, bukan kompromi." },
          ],
        },
        {
          q: "Uji Kupiec: VaR 95 persen dipakai 250 hari, pelanggaran aktual 25. Apa vonisnya?",
          options: [
            { text: "Model lolos — 25 pelanggaran masih wajar", why: "Salah: yang diharapkan 250 × 5 persen = 12,5. Pelanggaran 25 berarti model meremehkan risiko dua kali lipat — ditolak." },
            { text: "Model ditolak — pelanggaran 25 jauh di atas 12,5 yang diharapkan; model meremehkan risiko", why: "Tepat: Kupiec menguji frekuensi pelanggaran terhadap yang diharapkan. LR ≈ 10,3 di atas kritis 3,84 — penolakan yang jelas.", correct: true },
            { text: "Model terlalu konservatif — harus dilonggarkan", why: "Salah: terbalik. Pelanggaran BERLEBIH berarti model terlalu longgar (meremehkan), bukan terlalu konservatif. (Catatan: pelanggaran yang TERLALU SEDIKIT — misalnya 2 — juga ditolak Kupiec, LR ≈ 14,1 — karena terlalu konservatif.)" },
            { text: "Tidak bisa dinilai — Kupiec butuh 1.000 hari minimum", why: "Salah: Kupiec bisa dipakai pada 250 hari (satu tahun perdagangan). 1.000 hari memberi kuasa uji lebih besar, tetapi 250 sudah cukup untuk vonis." },
          ],
        },
        {
          q: "Return terburuk berubah dari minus 3,2 menjadi minus 8,0 persen. Apa yang terjadi pada VaR dan ES?",
          options: [
            { text: "Keduanya tidak berubah — satu data tidak memengaruhi kuantil", why: "Salah: ES berubah karena ia rata-rata ekor — data terburuk masuk ke rata-rata itu." },
            { text: "VaR tetap minus 2,1 persen; ES jatuh ke minus 5,05 persen — ES menangkap krisis, VaR tidak", why: "Tepat: VaR hanya batas ekor (elemen ke-2 terkecil tidak berubah); ES rata-rata ekor ((−8,0 + −2,1)/2 = −5,05). Inilah alasan FRTB memakai ES.", correct: true },
            { text: "VaR jatuh ke minus 8,0 persen; ES tetap minus 2,65 persen", why: "Salah: terbalik. VaR adalah kuantil — satu data ekstrem tidak menggeser kuantil 5 persen bila ia tetap yang terkecil." },
            { text: "Keduanya jatuh ke minus 8,0 persen", why: "Salah: hanya ES yang bergerak — VaR tetap di kuantilnya." },
          ],
        },
      ],
    },
  ],
};
