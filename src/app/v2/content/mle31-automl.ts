import type { V2Lesson } from "../lib/types";

export const mle31: V2Lesson = {
  slug: "mle31-automl",
  track: "Machine Learning Engineer",
  module: "ML Lanjutan",
  title: "MLE31 — AutoML: Biarkan Mesin Mencari Model Terbaik",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga minggu tuning manual vs satu malam AutoML",
      prose: [
        "Tim kredit KirimCepat menghabiskan tiga minggu menala XGBoost: learning rate 0,05 atau 0,1, kedalaman 6 atau 8, 200 atau 500 pohon. Tiap percobaan 12 menit; 64 kombinasi = 768 menit, 12,8 jam komputasi yang tersebar jadi tiga minggu karena tiap hasil harus ditunggu, dicatat, dan didiskusikan. Skor akhir: AUC 0,891. Lalu seorang engineer menjalankan AutoML semalam dengan anggaran yang sama — pagi harinya AUC 0,903, dengan pipeline preprocessing yang tidak pernah terpikirkan tim: imputasi median plus target encoding plus seleksi fitur.",
        "AutoML bukan sihir — ia adalah pencarian sistematis atas ruang keputusan yang terlalu besar untuk manusia: preprocessing, algoritma, dan hyperparameter, dicari bersamaan dengan anggaran komputasi yang eksplisit. Keunggulannya bukan kepintaran, melainkan kesabaran: ia mencoba 59 kombinasi acak tanpa bosan, sementara manusia berhenti di kombinasi ke-12 karena rapat berikutnya.",
        "Lesson ini mengajarkan AutoML sebagai disiplin anggaran: kapan random search cukup, kapan Bayesian optimization menang, bagaimana successive halving memangkas biaya 75 persen, dan kapan AutoML harus DITOLAK. Setelah lesson ini kamu bisa: (1) menghitung berapa trial yang dibutuhkan random search; (2) membandingkan biaya grid, random, dan successive halving; (3) menjelaskan Bayesian optimization dalam satu paragraf; (4) menilai hasil AutoML sebelum menerimanya; (5) memutuskan kapan tuning manual masih lebih baik.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MLE16 mengajarkan hyperparameter tuning manual (grid dan random search untuk satu model) dan MLE17 experiment tracking. Lesson ini TIDAK mengulang keduanya: ia naik satu tingkat — pencarian atas SELURUH pipeline (preprocessing + algoritma + hyperparameter) dengan anggaran eksplisit, Bayesian optimization, dan successive halving — plus kerangka keputusan kapan AutoML dipakai dan kapan ditolak.",
      },
      reference: "Random search: 59 trial untuk keyakinan 95 persen. Grid 64 kombinasi = 12,8 jam. Successive halving hemat 672 menit (75 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membeli hasil tuning dengan anggaran komputasi, bukan dengan lembur.",
        "(1) Menghitung jumlah trial random search untuk keyakinan yang diinginkan;",
        "(2) Menghitung dan membandingkan biaya grid search vs successive halving;",
        "(3) Menjelaskan Bayesian optimization: surrogate + acquisition;",
        "(4) Membaca leaderboard AutoML dan mendeteksi kebocoran;",
        "(5) Memutuskan kapan AutoML tepat dan kapan tuning manual menang.",
      ],
      tasks: [],
    },
    {
      id: "random-search",
      eyebrow: "Langkah 3 · Teori",
      title: "Random search: 59 trial mengalahkan 64 grid",
      prose: [
        "Hasil klasik yang mengejutkan banyak orang: random search biasanya mengalahkan grid search dengan anggaran yang sama. Alasannya: tidak semua hyperparameter sama pentingnya. Grid 4 x 4 x 4 menghabiskan 64 trial tetapi hanya mencoba 4 nilai berbeda untuk hyperparameter terpenting; random search dengan 64 trial mencoba 64 nilai berbeda untuk hyperparameter itu. Bila hanya 1 dari 3 hyperparameter yang benar-benar penting, grid membuang 75 persen anggarannya.",
        "Berapa trial yang dibutuhkan? Bila 5 persen teratas ruang konfigurasi dianggap 'bagus', peluang satu trial acak TIDAK mengenai daerah bagus = 0,95. Peluang n trial semuanya meleset = 0,95^n. Untuk keyakinan 95 persen mengenai minimal satu konfigurasi bagus: 1 - 0,95^n = 0,95, sehingga n = ln(0,05) / ln(0,95) = 58,4 — dibulatkan 59 trial. Angka ini independen dari jumlah hyperparameter — itulah kekuatan random search: ia berskala ke ruang berdimensi tinggi tanpa biaya tambahan.",
        "Grid search tetap punya tempat: bila ruangnya kecil (2-3 hyperparameter, sedikit nilai) dan kamu butuh peta lengkap untuk laporan. Tetapi sebagai default, mulai dari random search 59 trial — murah, dan memberi baseline yang jujur sebelum metode yang lebih pintar.",
      ],
      tasks: [],
      formula: "n = \\frac{\\ln(1 - c)}{\\ln(1 - p)}",
      formulaNote: "c = keyakinan yang diinginkan (0,95); p = fraksi ruang yang dianggap bagus (0,05); n = jumlah trial acak yang dibutuhkan.",
      note: {
        title: "Anggaran dulu, metode kemudian",
        body: "Pertanyaan pertama AutoML bukan 'metode apa' melainkan 'berapa jam GPU yang boleh dipakai'. Anggaran 2 jam dan 200 jam menghasilkan jawaban yang berbeda — bukan hanya lebih banyak trial, tetapi metode yang berbeda (random untuk anggaran kecil, Bayesian + halving untuk anggaran besar). Tulis anggaran di dokumen sebelum menjalankan apa pun.",
      },
      reference: "59 trial untuk keyakinan 95 persen mengenai 5 persen teratas.",
    },
    {
      id: "bayesian-halving",
      eyebrow: "Langkah 4 · Teori",
      title: "Bayesian optimization & successive halving: pintar dan hemat",
      prose: [
        "Bayesian optimization (BO) belajar dari trial sebelumnya. Ia membangun model surrogate — biasanya Gaussian process — yang memprediksi skor tiap konfigurasi plus ketidakpastiannya, lalu fungsi acquisition (misalnya expected improvement) memilih konfigurasi berikutnya: yang diprediksi bagus, atau yang belum dijelajahi. Bedanya dengan random search: BO menghabiskan trial di daerah yang menjanjikan, bukan merata. Harganya: surrogate mahal dihitung untuk ruang besar, dan BO kesulitan di atas ~20 hyperparameter. Aturan praktis: di bawah 20 dimensi dan trial mahal (lebih dari 10 menit), BO menang; di atas itu, random search kembali kompetitif.",
        "Successive halving (SH) memangkas biaya dengan cara lain: jangan latih semua konfigurasi sampai selesai. Mulai 64 konfigurasi dengan 1 epoch, simpan 16 terbaik, latih 2 epoch, simpan 4 terbaik, latih 4 epoch. Total biaya: 64 x 1 + 16 x 2 + 4 x 4 = 112 unit epoch. Bandingkan melatih semua 64 konfigurasi penuh 7 epoch: 64 x 7 = 448 unit. Dengan 2 menit per epoch: SH 224 menit vs penuh 896 menit — hemat 672 menit, 75 persen. Risikonya: konfigurasi yang lambat panas (bagus di akhir, buruk di awal) bisa terbuang di ronde pertama — itulah mengapa Hyperband menjalankan SH dengan beberapa jadwal berbeda.",
        "AutoML modern (AutoGluon, FLAML, H2O, Auto-sklearn) menggabungkan ketiganya: SH untuk memangkas, BO untuk memilih, dan ensembling untuk menggabungkan pemenang. Hasilnya bukan satu model, melainkan leaderboard — dan tugasmu berubah dari 'menala' menjadi 'menilai': apakah pemenang itu masuk akal, stabil di validasi, dan tidak bocor?",
      ],
      tasks: [],
      note: {
        title: "Kebocoran adalah kegagalan AutoML nomor satu",
        body: "AutoML yang diberi data bocor (fitur yang mengandung target, split acak pada data deret waktu, preprocessing di-fit sebelum split) akan menemukan 'model' dengan skor mustahil — dan kamu tidak akan tahu sampai produksi. Sebelum menerima leaderboard apa pun: periksa split (waktu? grup?), periksa preprocessing (di-fit di train saja?), dan periksa fitur teratas (adakah yang mustahil diketahui saat prediksi?). AutoML mempercepat pencarian; ia juga mempercepat kesalahan.",
      },
      reference: "SH: 112 unit vs 448 unit penuh — hemat 75 persen (672 menit).",
    },
    {
      id: "lab-automl",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: anggaran pencarian — random, grid, dan halving",
      prose: [
        "Lab ini menghitung anggaran tiga strategi pencarian dari angka mentah: random search, grid search, dan successive halving.",
        "Hitung dulu di kepala. Random search: n = ln(0,05) / ln(0,95) = 58,4 — dibulatkan 59 trial untuk keyakinan 95 persen. Grid: 64 kombinasi x 12 menit = 768 menit = 12,8 jam. Successive halving: 64 x 1 + 16 x 2 + 4 x 4 = 112 unit epoch; 112 x 2 menit = 224 menit. Penuh: 64 x 7 = 448 unit = 896 menit. Hemat: 896 - 224 = 672 menit, yaitu 75,0 persen.",
        "Tugas lab: hitung lima angka dari data di atas dan cetak masing-masing di baris sendiri: trial, grid_menit, sh_menit, penuh_menit, hemat_persen. Lima angka ini adalah bahasa anggaran — dengan ini kamu bisa bernegosiasi dengan manajer: 'beri saya 4 jam GPU, saya kembalikan model yang sudah dicari 59 konfigurasi'.",
        "Setelah lolos, coba eksperimen: ubah keyakinan menjadi 99 persen dan lihat trial naik menjadi 90 (ln(0,01)/ln(0,95) = 89,8). Lalu tanyakan: apakah 31 trial tambahan sepadan dengan 4 persen keyakinan ekstra? Itulah keputusan anggaran yang sebenarnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `trial` random search untuk keyakinan 95 persen" },
        { id: "t2", text: "Hitung `grid_menit` untuk 64 kombinasi @ 12 menit" },
        { id: "t3", text: "Hitung `sh_menit`, `penuh_menit`, dan `hemat_persen` successive halving" },
      ],
      expected: "trial=59\ngrid_menit=768\nsh_menit=224\npenuh_menit=896\nhemat_persen=75.0",
      hints: [
        "Trial = ceil(ln(0,05) / ln(0,95)); pakai math.log dan math.ceil.",
        "Grid = 64 x 12 menit.",
        "SH = (64x1 + 16x2 + 4x4) unit x 2 menit; penuh = 64x7 unit x 2 menit.",
        "Hemat persen = (penuh - SH) / penuh x 100.",
      ],
      code: {
        starter: `# Anggaran pencarian AutoML: random, grid, successive halving.\nimport math\n\nkeyakinan = 0.95\nfraksi_bagus = 0.05\nkombinasi_grid = 64\nmenit_per_trial = 12\nmenit_per_epoch = 2\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntrial = \ngrid_menit = \nsh_menit = \npenuh_menit = \nhemat_persen = \n\nprint(f"trial={trial}")\nprint(f"grid_menit={grid_menit}")\nprint(f"sh_menit={sh_menit}")\nprint(f"penuh_menit={penuh_menit}")\nprint(f"hemat_persen={hemat_persen}")`,
        lockLines: 8,
        solution: `# Anggaran pencarian AutoML: random, grid, successive halving.\nimport math\n\nkeyakinan = 0.95\nfraksi_bagus = 0.05\nkombinasi_grid = 64\nmenit_per_trial = 12\nmenit_per_epoch = 2\n\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ntrial = math.ceil(math.log(1 - keyakinan) / math.log(1 - fraksi_bagus))\ngrid_menit = kombinasi_grid * menit_per_trial\nsh_unit = 64 * 1 + 16 * 2 + 4 * 4\npenuh_unit = 64 * 7\nsh_menit = sh_unit * menit_per_epoch\npenuh_menit = penuh_unit * menit_per_epoch\nhemat_persen = (penuh_menit - sh_menit) / penuh_menit * 100\n\nprint(f"trial={trial}")\nprint(f"grid_menit={grid_menit}")\nprint(f"sh_menit={sh_menit}")\nprint(f"penuh_menit={penuh_menit}")\nprint(f"hemat_persen={hemat_persen}")`,
        checks: [
          { kind: "equal", task: "t1", name: "trial", value: 59, tol: 1e-9, label: "`trial` seharusnya 59", msg: "ln(0,05)/ln(0,95) = 58,4, dibulatkan ke atas 59." },
          { kind: "equal", task: "t2", name: "grid_menit", value: 768, tol: 1e-9, label: "`grid_menit` seharusnya 768", msg: "64 x 12 = 768 menit = 12,8 jam." },
          { kind: "equal", task: "t3", name: "sh_menit", value: 224, tol: 1e-9, label: "`sh_menit` seharusnya 224", msg: "112 unit x 2 menit = 224 menit." },
          { kind: "equal", task: "t3", name: "penuh_menit", value: 896, tol: 1e-9, label: "`penuh_menit` seharusnya 896", msg: "448 unit x 2 menit = 896 menit." },
          { kind: "equal", task: "t3", name: "hemat_persen", value: 75.0, tol: 1e-9, label: "`hemat_persen` seharusnya 75.0", msg: "(896-224)/896 = 75,0 persen." },
        ],
      },
      reference: "59 trial; grid 768 menit; SH 224 menit vs penuh 896 menit; hemat 75,0 persen.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: kapan AutoML, kapan manual",
      prose: [
        "Skenario 1 — Data tabular, deadline besok, tim kecil. → AutoML (AutoGluon/FLAML). Alasan: baseline kuat dalam semalam; manusia fokus ke definisi masalah dan validasi.",
        "Skenario 2 — Trial mahal (lebih dari 10 menit), dimensi di bawah 20. → Bayesian optimization. Alasan: tiap trial berharga; surrogate menghemat trial yang terbuang.",
        "Skenario 3 — Trial murah, dimensi tinggi (lebih dari 20). → Random search 59 trial + successive halving. Alasan: BO tidak berskala; random + halving memberi 80 persen manfaat dengan 20 persen kerumitan.",
        "Skenario 4 — Model harus bisa dijelaskan ke regulator (kredit, asuransi). → Tuning manual atas model yang bisa dijelaskan (regresi logistik, pohon dangkal). Alasan: AutoML yang mengembalikan ensemble 40 model tidak bisa dipertahankan di depan auditor — kemenangan skor bukan kemenangan.",
        "Skenario 5 — Data kecil (di bawah 1.000 baris). → Jangan AutoML. Alasan: pencarian atas ruang besar dengan data kecil = overfitting pada validasi; model sederhana + validasi silang yang ketat menang.",
        "Aturan praktis: AutoML adalah alat baseline dan alat kehabisan waktu — bukan pengganti pemahaman. Terima hasilnya hanya bila: skor stabil di validasi kedua (bukan hanya leaderboard), fitur teratas masuk akal, dan preprocessing-nya bisa dijelaskan dalam satu paragraf.",
      ],
      tasks: [],
      note: {
        title: "Leaderboard bukan vonis",
        body: "Selisih AUC 0,903 vs 0,901 di leaderboard AutoML hampir selalu noise — bukan keunggulan model. Jangan memilih pemenang berdasarkan selisih 0,002; pilih berdasarkan stabilitas (varians antar lipatan), kesederhanaan, dan biaya inferensi. Model peringkat 3 yang stabil dan murah hampir selalu lebih baik di produksi daripada peringkat 1 yang rapuh dan mahal.",
      },
      reference: "AutoML untuk baseline cepat; manual untuk model yang harus dijelaskan; data kecil jangan AutoML.",
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
        "Random search: 59 trial untuk keyakinan 95 persen mengenai 5 persen teratas.",
        "Grid 64 kombinasi @ 12 menit = 768 menit (12,8 jam).",
        "Successive halving: 224 vs 896 menit — hemat 75 persen.",
        "Bayesian optimization: surrogate + acquisition; menang bila trial mahal dan dimensi di bawah 20.",
        "Terima AutoML hanya bila stabil, masuk akal, dan bisa dijelaskan.",
      ],
      next: { label: "MLE32 — Edge ML & ONNX/TFLite: Model yang Muat di Saku", href: "/v2/learn/mle32-edge-ml-onnx-tflite" },
      quiz: [
        {
          q: "Berapa trial random search untuk keyakinan 95 persen mengenai 5 persen konfigurasi teratas?",
          options: [
            { text: "59", why: "Tepat: ln(0,05)/ln(0,95) = 58,4, dibulatkan ke atas 59.", correct: true },
            { text: "20 — seperlima dari 100", why: "Salah: keyakinan tumbuh logaritmik, bukan linear. 20 trial hanya memberi keyakinan 64 persen." },
            { text: "95 — sama dengan persen keyakinan", why: "Salah: angka 95 di sini persen, bukan jumlah trial. Rumusnya logaritmik." },
            { text: "64 — sama dengan grid 4x4x4", why: "Salah: 64 adalah jumlah kombinasi grid; random search tidak terikat grid." },
          ],
        },
        {
          q: "Mengapa random search sering mengalahkan grid search dengan anggaran sama?",
          options: [
            { text: "Karena acak selalu lebih pintar dari sistematis", why: "Salah: bukan soal pintar — soal alokasi. Grid membuang trial pada nilai hyperparameter yang tidak penting." },
            { text: "Karena random mencoba lebih banyak nilai berbeda untuk hyperparameter yang paling penting", why: "Tepat: grid 4x4x4 hanya mencoba 4 nilai untuk hyperparameter terpenting; random 64 trial mencoba 64 nilai.", correct: true },
            { text: "Karena grid search tidak bisa paralel", why: "Salah: keduanya bisa paralel. Perbedaannya di alokasi nilai, bukan paralelisme." },
            { text: "Karena random search memakai GPU lebih cepat", why: "Salah: kecepatan hardware sama; yang berbeda adalah konfigurasi yang dicoba." },
          ],
        },
        {
          q: "Successive halving 64 konfigurasi: 64x1 + 16x2 + 4x4 unit @ 2 menit. Berapa hematnya vs melatih semua penuh 7 epoch?",
          options: [
            { text: "224 menit vs 896 menit — hemat 75 persen", why: "Tepat: 112 unit = 224 menit; 448 unit = 896 menit; hemat 672 menit.", correct: true },
            { text: "224 menit vs 448 menit — hemat 50 persen", why: "Salah: penuh = 64 x 7 = 448 UNIT, bukan menit. Dikalikan 2 menit = 896 menit." },
            { text: "Tidak hemat — total trial-nya sama", why: "Salah: SH memangkas epoch untuk konfigurasi yang kalah lebih awal; total unit 112 vs 448." },
            { text: "Hemat 90 persen", why: "Salah: 75 persen sudah besar; 90 persen butuh pemangkasan yang jauh lebih agresif dan berisiko." },
          ],
        },
        {
          q: "Kapan Bayesian optimization menjadi pilihan yang tepat?",
          options: [
            { text: "Trial murah dan dimensi di atas 20", why: "Salah: itu wilayah random search — surrogate BO tidak berskala ke dimensi tinggi." },
            { text: "Trial mahal (lebih dari 10 menit) dan dimensi di bawah 20", why: "Tepat: tiap trial berharga, surrogate menghemat trial yang terbuang.", correct: true },
            { text: "Data kecil di bawah 1.000 baris", why: "Salah: data kecil jangan AutoML sama sekali — pencarian besar = overfitting validasi." },
            { text: "Selalu — BO mengalahkan semua metode lain", why: "Salah: tidak ada metode universal; BO kalah di dimensi tinggi dan trial murah." },
          ],
        },
        {
          q: "AutoML mengembalikan pemenang AUC 0,903 vs 0,901 di peringkat 2. Apa keputusan yang benar?",
          options: [
            { text: "Ambil peringkat 1 — skor tertinggi adalah vonis", why: "Salah: selisih 0,002 hampir selalu noise. Periksa stabilitas, kesederhanaan, dan biaya inferensi." },
            { text: "Bandingkan stabilitas antar lipatan, kesederhanaan, dan biaya — peringkat 3 yang stabil bisa menang", why: "Tepat: leaderboard bukan vonis; produksi menghargai stabilitas dan biaya, bukan selisih 0,002.", correct: true },
            { text: "Tolak keduanya — AutoML tidak bisa dipercaya", why: "Salah: AutoML berguna sebagai baseline; yang dibutuhkan adalah penilaian, bukan penolakan buta." },
            { text: "Ensemble semua 40 model di leaderboard", why: "Salah: ensemble raksasa mahal di inferensi dan tidak bisa dijelaskan ke regulator." },
          ],
        },
      ],
    },
  ],
};
