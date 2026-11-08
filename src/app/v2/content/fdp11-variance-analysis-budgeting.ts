import type { V2Lesson } from "../lib/types";

export const fdp11: V2Lesson = {
  slug: "fdp11-variance-analysis-budgeting",
  track: "Financial Data Pipeline",
  module: "Pemodelan dan Forecasting",
  title: "FDP11 — Variance Analysis & Budgeting: Anggaran yang Bisa Dipertanyakan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Revenue meleset Rp40 juta — kabar baik atau buruk?",
      prose: [
        "Sebuah perusahaan menganggarkan revenue Rp500 juta dari 10.000 unit dengan harga Rp50.000 per unit. Realisasinya: 10.800 unit terjual dengan harga yang sama — revenue Rp540 juta, meleset Rp40 juta di atas anggaran. Di rapat, separuh ruangan bersorak dan separuh lagi curiga. Yang bersorak melihat angka yang lebih besar; yang curiga bertanya: apakah kita menjual lebih banyak karena permintaan naik, atau karena tim sales memberi diskon tersembunyi lewat bundling? Jawabannya ada di variance analysis — membedah selisih menjadi harga dan kuantitas.",
        "Bedah itu berkata: price variance nol — harga jual persis Rp50.000, dengan catatan harga di sini adalah harga bersih setelah semua diskon dan efek bundling (bila yang dicatat hanya harga nominal, price variance nol tidak menyingkirkan diskon tersembunyi). Quantity variance Rp40 juta favourable — 800 unit tambahan dikali Rp50.000. Tetapi biaya juga meleset: biaya aktual Rp432 juta melawan anggaran fleksibel Rp428 juta — spending variance Rp4 juta unfavourable. Dan ada satu selisih yang tidak boleh hilang: biaya volume. Anggaran statis biaya adalah 10.000 dikali Rp35.000 ditambah Rp50 juta sama dengan Rp400 juta; anggaran fleksibel Rp428 juta berarti volume menambah biaya Rp28 juta. Laba anggaran Rp500 juta dikurangi Rp400 juta sama dengan Rp100 juta; laba aktual Rp540 juta dikurangi Rp432 juta sama dengan Rp108 juta — varians laba Rp8 juta favourable (40 dikurangi 28 dikurangi 4). Angka Rp36 juta (40 dikurangi 4) BUKAN varians laba: ia mengabaikan biaya volume Rp28 juta. Lesson ini mengajarkan variance analysis dan budgeting sebagai output pipeline: bukan sekadar membandingkan dua angka, melainkan menjelaskan selisih sampai ke penyebabnya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Variance analysis sudah disinggung di FDP10 sebagai satu langkah — membandingkan forecast dengan aktual per driver (revenue meleset 4,55 persen, laba 9,52 persen) — tetapi tidak pernah menjadi lesson sendiri: tidak ada budgeting, tidak ada flexible budget, tidak ada pemisahan price variance dan quantity variance. Lesson ini membangun disiplinnya secara penuh, dengan FDP10 sebagai prasyarat konseptual.",
      },
      reference: "Anggaran: 10.000 unit x Rp50.000 = Rp500 jt. Aktual: 10.800 unit x Rp50.000 = Rp540 jt. Quantity variance Rp40 jt (F); biaya volume Rp28 jt (U); spending variance Rp4 jt (U); varians laba Rp8 jt (F).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun anggaran dan membedah selisihnya sampai ke penyebab.",
        "(1) Menjelaskan tiga jenis anggaran: statis, fleksibel, dan bergulir;",
        "(2) Menghitung price variance dan quantity variance untuk revenue;",
        "(3) Membangun flexible budget biaya dan menghitung spending variance;",
        "(4) Menentukan apakah selisih bersifat favourable, unfavourable, atau netral;",
        "(5) Menulis penjelasan variance yang membedakan asumsi yang salah dari eksekusi yang salah.",
      ],
      tasks: [],
    },
    {
      id: "budgeting",
      eyebrow: "Langkah 3 · Teori",
      title: "Budgeting: statis, fleksibel, bergulir",
      prose: [
        "Anggaran statis dibuat sekali untuk satu tingkat aktivitas — 10.000 unit — dan tidak berubah saat realisasi berbeda. Ia berguna sebagai target, tetapi buruk sebagai pembanding: membandingkan biaya aktual 10.800 unit dengan anggaran 10.000 unit adalah membandingkan apel dengan jeruk — sebagian selisihnya hanya karena volume naik, bukan karena boros.",
        "Anggaran fleksibel memperbaiki itu: ia menghitung ulang berapa biaya SEHARUSNYA untuk volume aktual. Biaya variabel Rp35.000 per unit dikali 10.800 unit sama dengan Rp378 juta, ditambah biaya tetap Rp50 juta, sama dengan Rp428 juta. Inilah pembanding yang jujur untuk biaya aktual Rp432 juta — selisihnya Rp4 juta unfavourable, dan selisih itu murni soal pengeluaran, bukan soal volume.",
        "Anggaran bergulir (rolling) memperbarui dirinya tiap kuartal: begitu kuartal pertama selesai, satu kuartal baru ditambahkan di ujung, sehingga selalu ada 12 bulan ke depan. Ia lebih mahal dibuatnya tetapi jauh lebih jujur — anggaran statis yang dibuat Januari sudah basi di bulan September, sementara anggaran bergulir selalu berumur kurang dari tiga bulan.",
      ],
      tasks: [],
      note: {
        title: "Anggaran adalah janji, bukan ramalan",
        body: "Ramalan (forecast) berkata 'ini yang kemungkinan terjadi'; anggaran berkata 'ini yang kita sepakati untuk dicapai'. Mencampur keduanya — misalnya memakai forecast sebagai anggaran — membuat tidak ada yang bisa dimintai tanggung jawab saat selisih muncul, karena 'ramalan memang bisa salah'.",
      },
      reference: "Fleksibel: 10.800 x Rp35.000 + Rp50 jt = Rp428 jt. Statis: target. Bergulir: selalu 12 bulan ke depan.",
    },
    {
      id: "variance",
      eyebrow: "Langkah 4 · Teori",
      title: "Variance: harga, kuantitas, dan pengeluaran",
      prose: [
        "Variance revenue dibedah menjadi dua. Price variance: (harga aktual dikurangi harga anggaran) dikali kuantitas aktual — di cerita pembuka, (50.000 dikurangi 50.000) dikali 10.800 sama dengan nol, dengan catatan harga aktual di sini adalah harga bersih setelah diskon dan bundling. Quantity variance: (kuantitas aktual dikurangi kuantitas anggaran) dikali harga anggaran — (10.800 dikurangi 10.000) dikali 50.000 sama dengan Rp40 juta favourable. Favourable berarti menguntungkan — revenue di atas anggaran; unfavourable berarti sebaliknya.",
        "Variance biaya dibedah dengan logika yang sama tetapi pembandingnya anggaran fleksibel. Sebelum itu, pisahkan dulu efek volume: anggaran statis biaya Rp400 juta (10.000 dikali 35.000 ditambah 50 juta) naik menjadi Rp428 juta di fleksibel semata-mata karena 800 unit tambahan — varians biaya volume Rp28 juta unfavourable. Tanpa baris ini, selisih biaya aktual terhadap statis (432 dikurangi 400 sama dengan 32) akan dibaca sebagai boros Rp32 juta, padahal Rp28 juta di antaranya hanya volume. Spending variance: biaya aktual dikurangi anggaran fleksibel — 432 dikurangi 428 sama dengan Rp4 juta unfavourable. Ada pula efficiency variance — pemakaian input per unit — tetapi di lesson ini ia digabung ke spending variance agar lab tetap fokus: satu angka untuk 'apakah kita boros pada volume ini'.",
        "Aturan membaca variance: selisih yang besar belum tentu penting, dan selisih yang kecil belum tentu sepele. Rp4 juta unfavourable pada biaya Rp428 juta adalah 0,9 persen — noise. Tetapi Rp4 juta yang sama bila ia berasal dari satu pos — misalnya biaya lembur yang naik 40 persen — adalah sinyal. Selalu bedah variance sampai ke pos, bukan berhenti di total.",
      ],
      tasks: [],
      note: {
        title: "Favourable tidak selalu kabar baik",
        body: "Biaya yang favourable (di bawah anggaran) bisa berarti efisiensi — atau berarti tim tidak melakukan pemeliharaan yang seharusnya, dan kerusakannya datang kuartal depan. Revenue yang favourable bisa berarti permintaan naik — atau berarti sales mengorbankan margin lewat bundling. Variance berkata 'ada selisih'; penjelasan berkata 'kenapa'.",
      },
      reference: "Price variance Rp0; quantity variance Rp40 jt (F); biaya volume Rp28 jt (U); spending variance Rp4 jt (U); varians laba Rp8 jt (F).",
    },
    {
      id: "lab-variance",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: membedah variance revenue dan biaya",
      prose: [
        "Lab ini menghitung variance dari data cerita pembuka: quantity variance, price variance, spending variance, dan varians laba. Hitung dulu di kepala. Quantity variance: (10.800 dikurangi 10.000) dikali 50.000 sama dengan Rp40.000.000. Price variance: (50.000 dikurangi 50.000) dikali 10.800 sama dengan Rp0. Anggaran fleksibel biaya: 10.800 dikali 35.000 ditambah 50.000.000 sama dengan Rp428.000.000; anggaran statis biaya: 10.000 dikali 35.000 ditambah 50.000.000 sama dengan Rp400.000.000 — varians biaya volume: 428.000.000 dikurangi 400.000.000 sama dengan Rp28.000.000. Spending variance: 432.000.000 dikurangi 428.000.000 sama dengan Rp4.000.000. Varians laba: 40.000.000 ditambah 0 dikurangi 28.000.000 dikurangi 4.000.000 sama dengan Rp8.000.000 favourable.",
        "Tugas lab: isi empat variabel — qty_var, price_var, spend_var, laba_var — lalu cetak keempatnya. Empat angka ini adalah inti laporan variance bulanan: dari mana selisih datang, dan apakah ia menguntungkan.",
        "Setelah lolos, coba eksperimen: ubah harga_aktual menjadi 48000 dan lihat price variance menjadi minus Rp21.600.000 — revenue menjadi 10.800 dikali 48.000 sama dengan Rp518.400.000 (bukan Rp540 juta), dan varians laba berbalik menjadi minus Rp13.600.000 (40.000.000 dikurangi 21.600.000 dikurangi 28.000.000 dikurangi 4.000.000). Lalu tanyakan: apakah 800 unit tambahan itu masih kabar baik? Jawabannya: tidak — unit tambahan itu dibeli dengan diskon tersembunyi Rp2.000 per unit di semua 10.800 unit. Inilah kenapa price variance tidak boleh dilewatkan — dan kenapa varians laba harus memasukkan biaya volume.",
      ],
      tasks: [
        { id: "t1", text: "Hitung quantity variance revenue (Rp)" },
        { id: "t2", text: "Hitung price variance revenue (Rp)" },
        { id: "t3", text: "Hitung spending variance biaya terhadap flexible budget (Rp)" },
        { id: "t4", text: "Hitung varians laba (Rp)" },
      ],
      expected: "qty_var=40000000\nprice_var=0\nspend_var=4000000\nlaba_var=8000000",
      hints: [
        "Quantity variance = (kuantitas aktual - kuantitas anggaran) x harga anggaran.",
        "Price variance = (harga aktual - harga anggaran) x kuantitas aktual.",
        "Flexible budget = kuantitas aktual x biaya variabel per unit + biaya tetap.",
        "Varians biaya volume = flexible budget - anggaran statis (10.000 x biaya variabel + biaya tetap).",
        "Varians laba = quantity variance + price variance - varians biaya volume - spending variance.",
      ],
      code: {
        starter: "# Anggaran vs aktual (Rp). JANGAN UBAH.\nqty_anggaran, qty_aktual = 10000, 10800\nharga_anggaran = 50000\nharga_aktual = 50000\nbiaya_variabel, biaya_tetap = 35000, 50000000\nbiaya_aktual = 432000000\n\n# TULIS KODEMU: quantity variance, price variance, spending variance, varians laba\nqty_var = \nprice_var = \nspend_var = \nlaba_var = \nprint(f\"qty_var={qty_var}\")\nprint(f\"price_var={price_var}\")\nprint(f\"spend_var={spend_var}\")\nprint(f\"laba_var={laba_var}\")",
        lockLines: 6,
        solution: "# Anggaran vs aktual (Rp). JANGAN UBAH.\nqty_anggaran, qty_aktual = 10000, 10800\nharga_anggaran = 50000\nharga_aktual = 50000\nbiaya_variabel, biaya_tetap = 35000, 50000000\nbiaya_aktual = 432000000\n\n# TULIS KODEMU: quantity variance, price variance, spending variance, varians laba\nqty_var = (qty_aktual - qty_anggaran) * harga_anggaran\nprice_var = (harga_aktual - harga_anggaran) * qty_aktual\nflex_budget = qty_aktual * biaya_variabel + biaya_tetap\nbiaya_statis = qty_anggaran * biaya_variabel + biaya_tetap\nvol_cost_var = flex_budget - biaya_statis\nspend_var = biaya_aktual - flex_budget\nlaba_var = qty_var + price_var - vol_cost_var - spend_var\nprint(f\"qty_var={qty_var}\")\nprint(f\"price_var={price_var}\")\nprint(f\"spend_var={spend_var}\")\nprint(f\"laba_var={laba_var}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "qty_var=40000000", label: "Quantity variance Rp40.000.000", msg: "(10.800 - 10.000) x 50.000 = 40.000.000 favourable." },
          { kind: "stdout_matches", task: "t2", pattern: "price_var=0", label: "Price variance Rp0", msg: "(50.000 - 50.000) x 10.800 = 0. Harga bersih tidak berubah — dengan catatan harga di sini harga bersih setelah diskon." },
          { kind: "stdout_matches", task: "t3", pattern: "spend_var=4000000", label: "Spending variance Rp4.000.000", msg: "432.000.000 - 428.000.000 = 4.000.000 unfavourable. Pembandingnya flexible budget, bukan anggaran statis." },
          { kind: "stdout_matches", task: "t4", pattern: "laba_var=8000000", label: "Varians laba Rp8.000.000", msg: "40.000.000 + 0 - 28.000.000 - 4.000.000 = 8.000.000 favourable. Angka 36.000.000 (40 - 4) salah karena mengabaikan biaya volume Rp28.000.000." },
        ],
      },
      reference: "Quantity variance Rp40 jt (F); price variance Rp0; spending variance Rp4 jt (U); varians laba Rp8 jt (F).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: rapat yang berubah karena satu bedah",
      prose: [
        "Di rapat itu, bedah variance mengubah segalanya. Tanpa bedah, rapat akan menghabiskan satu jam merayakan revenue Rp540 juta dan satu jam menyalahkan tim operasi atas biaya Rp432 juta. Dengan bedah, rapat berlangsung 20 menit: revenue naik karena volume — kabar baik, dan price variance nol (pada harga bersih setelah diskon) berarti tidak ada diskon tersembunyi yang lolos dari harga yang dicatat. Biaya naik Rp4 juta di atas flexible budget — 0,9 persen, noise — dan satu-satunya tindak lanjut adalah memeriksa pos lembur yang naik sendiri.",
        "Yang lebih penting: bedah itu membedakan asumsi yang salah dari eksekusi yang salah. Bila quantity variance besar karena anggaran volumenya terlalu rendah, yang salah adalah asumsi — perbaiki forecast, jangan hukum sales. Bila spending variance besar karena boros, yang salah adalah eksekusi — perbaiki operasi, jangan ubah anggaran. Perusahaan yang tidak membedah akan menghukum orang yang benar dan memaafkan asumsi yang salah, kuartal demi kuartal.",
        "Sejak itu, laporan bulanan perusahaan itu selalu membawa tiga baris variance — harga, kuantitas, pengeluaran — plus satu kalimat penjelasan per baris. Rapat bulanan memendek dari dua jam menjadi 45 menit. Bukan karena masalahnya hilang, melainkan karena masalahnya akhirnya terlihat.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat bedah ini bekerja. Pertama, pembanding yang jujur — flexible budget, bukan anggaran statis. Kedua, pemisahan harga dan kuantitas — sehingga diskon tersembunyi tidak bisa bersembunyi di balik volume. Ketiga, penjelasan yang membedakan asumsi dari eksekusi.",
      },
      reference: "Rapat 2 jam menjadi 45 menit; tindak lanjut satu pos lembur.",
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
        "Anggaran fleksibel: biaya variabel x volume aktual + biaya tetap.",
        "Lab: quantity variance Rp40 jt (F); price variance Rp0; spending variance Rp4 jt (U); varians laba Rp8 jt (F) — biaya volume Rp28 jt (U) tidak boleh hilang.",
        "Price variance = (harga aktual - harga anggaran) x kuantitas aktual.",
        "Favourable tidak selalu kabar baik — bisa berarti pemeliharaan yang ditunda.",
        "Bedah variance membedakan asumsi yang salah dari eksekusi yang salah.",
      ],
      next: { label: "FDP12 — Dashboard & Visualisasi Keuangan: Dari Pipeline ke Layar", href: "/v2/learn/fdp12-dashboard-visualisasi" },
      quiz: [
        {
          q: "Anggaran 10.000 unit x Rp50.000; aktual 10.800 unit x Rp50.000. Berapa quantity variance?",
          options: [
            { text: "Rp40.000.000 favourable", why: "Tepat: (10.800 - 10.000) x 50.000 = 40.000.000.", correct: true },
            { text: "Rp40.000.000 unfavourable", why: "Salah: revenue di atas anggaran adalah favourable, bukan unfavourable." },
            { text: "Rp540.000.000 — total revenue aktual", why: "Salah: itu total revenue, bukan variance-nya." },
            { text: "Rp0 — harga tidak berubah", why: "Salah: yang nol adalah PRICE variance. Quantity variance tetap 40.000.000." },
          ],
        },
        {
          q: "Biaya aktual Rp432 juta; flexible budget Rp428 juta. Berapa spending variance dan apa artinya?",
          options: [
            { text: "Rp4 juta favourable — biaya di bawah anggaran", why: "Salah: 432 lebih besar dari 428 — biaya di ATAS anggaran, jadi unfavourable." },
            { text: "Rp4 juta unfavourable — boros Rp4 juta pada volume aktual", why: "Tepat: 432 - 428 = 4 juta (U). Pembandingnya flexible budget.", correct: true },
            { text: "Rp4 juta unfavourable — tetapi pembandingnya harus anggaran statis", why: "Salah: pembanding yang benar adalah flexible budget. Anggaran statis membandingkan volume yang berbeda." },
            { text: "Rp32 juta unfavourable — memakai anggaran statis Rp400 juta", why: "Salah: 432 - 400 = 32 adalah selisih yang menyesatkan — sebagian besarnya hanya volume." },
          ],
        },
        {
          q: "Kenapa biaya harus dibandingkan dengan flexible budget, bukan anggaran statis?",
          options: [
            { text: "Karena flexible budget selalu lebih besar", why: "Salah: flexible budget bisa lebih kecil bila volume turun. Alasannya bukan besar-kecil." },
            { text: "Karena anggaran statis membandingkan volume yang berbeda — sebagian selisihnya hanya volume", why: "Tepat: flexible budget menghitung ulang biaya untuk volume aktual.", correct: true },
            { text: "Karena anggaran statis sudah tidak dipakai lagi", why: "Salah: anggaran statis masih dipakai sebagai target — hanya bukan sebagai pembanding biaya." },
            { text: "Karena regulator mewajibkan flexible budget", why: "Salah: ini soal logika, bukan regulasi." },
          ],
        },
        {
          q: "Biaya pemeliharaan di bawah anggaran Rp10 juta (favourable). Apa yang harus dicurigai?",
          options: [
            { text: "Tidak ada — favourable selalu kabar baik", why: "Salah: favourable bisa berarti pemeliharaan yang ditunda — kerusakannya datang kuartal depan." },
            { text: "Pemeliharaan yang ditunda — periksa jadwal pemeliharaan sebelum merayakan", why: "Tepat: variance berkata 'ada selisih'; penjelasan berkata 'kenapa'.", correct: true },
            { text: "Anggaran yang terlalu besar — potong anggaran tahun depan", why: "Salah: satu bulan favourable bukan bukti anggaran salah. Periksa penyebabnya dulu." },
            { text: "Efisiensi tim — beri bonus segera", why: "Salah: memberi bonus sebelum tahu penyebabnya adalah merayakan penghematan yang mungkin adalah penundaan." },
          ],
        },
        {
          q: "Quantity variance besar karena anggaran volumenya terlalu rendah. Yang salah adalah apa?",
          options: [
            { text: "Eksekusi sales — mereka menjual terlalu banyak", why: "Salah: menjual lebih banyak bukan kesalahan. Yang salah adalah asumsi volume di anggaran." },
            { text: "Asumsi — perbaiki forecast, jangan hukum sales", why: "Tepat: bedah variance membedakan asumsi yang salah dari eksekusi yang salah.", correct: true },
            { text: "Harga — pasti ada diskon tersembunyi", why: "Salah: price variance nol pada harga BERSIH membuktikan tidak ada diskon yang lolos dari harga yang dicatat — tetapi bila harga yang dicatat adalah harga nominal sebelum diskon, diskon tersembunyi masih mungkin. Jangan menuduh tanpa bukti." },
            { text: "Tidak ada yang salah — variance besar selalu baik", why: "Salah: variance besar karena asumsi salah berarti perencanaan yang buruk, bukan keberhasilan." },
          ],
        },
      ],
    },
  ],
};
