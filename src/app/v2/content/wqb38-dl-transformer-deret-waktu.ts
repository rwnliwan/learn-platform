import type { V2Lesson } from "../lib/types";

export const wqb38: V2Lesson = {
  slug: "wqb38-dl-transformer-deret-waktu",
  track: "WorldQuant Brain",
  module: "Machine Learning",
  title: "WQB38 — Deep Learning & Transformer untuk Deret Waktu Finansial",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Transformer yang mengalahkan AR — dan pertanyaan yang tersisa",
      prose: [
        "Seorang peneliti membandingkan tiga model untuk meramal return harian dalam validasi walk-forward lima lipatan. Model AR klasik: MAE rata-rata 1,80 persen. LSTM: 1,50 persen. Transformer: 1,35 persen — perbaikan 25,0 persen dibanding AR. Angka itu mengesankan — sampai peneliti itu bertanya tiga hal: apakah perbaikan itu bertahan setelah biaya transaksi, apakah transformer itu stabil antar lipatan, dan apakah ia bisa dijelaskan saat ia salah?",
        "Lesson ini mengajarkan deep learning dan transformer untuk deret waktu finansial dari sudut peneliti alpha: cara kerja sekuensialnya, cara menilainya dengan walk-forward yang jujur, dan tiga pertanyaan yang harus dijawab sebelum model itu dipakai — biaya, stabilitas, dan interpretabilitas. DLE28 mengajarkan arsitektur sequence forecasting dari sudut deep learning; lesson ini mengajarkan PENERAPANNYA sebagai alpha di WorldQuant Brain.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DLE28 mengajarkan RNN, 1D ConvNet, WaveNet, dan transformer untuk sequence forecasting dari sudut arsitektur deep learning. 'Transformer' tidak pernah muncul di track WQB (pencarian menghasilkan nol). Lesson ini TIDAK mengulang arsitektur DLE28 — ia membangun sudut WQB-nya: walk-forward sebagai alpha, perbaikan vs baseline AR, stabilitas antar lipatan, biaya, dan interpretabilitas untuk peneliti alpha.",
      },
      reference: "Walk-forward 5 lipatan, MAE: AR 1,80 persen; LSTM 1,50 persen; transformer 1,35 persen. Perbaikan 25,0 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menilai model deep learning deret waktu sebagai kandidat alpha.",
        "(1) Menjelaskan kenapa deret waktu finansial sulit bagi model sekuensial;",
        "(2) Menghitung MAE walk-forward dan perbaikan relatif terhadap baseline;",
        "(3) Menjelaskan attention sebagai cara transformer memilih masa lalu yang relevan;",
        "(4) Menyebutkan tiga pertanyaan sebelum memakai model: biaya, stabilitas, interpretabilitas;",
        "(5) Membedakan perbaikan statistik dari perbaikan yang bisa ditradingkan.",
      ],
      tasks: [],
    },
    {
      id: "mengapa-sulit",
      eyebrow: "Langkah 3 · Teori",
      title: "Kenapa deret waktu finansial sulit",
      prose: [
        "Tiga sifat membuat deret waktu finansial berbeda dari teks atau gambar. Pertama, signal-to-noise ratio yang sangat rendah: sebagian besar gerakan harga adalah noise, dan sinyal yang dicari hanyalah sebagian kecil darinya. Model yang kuat — seperti transformer — sangat pandai menghafal noise dan menyebutnya pola. Kedua, non-stationarity: distribusi return berubah antar rezim, sehingga pola yang dipelajari di 2020 belum tentu berlaku di 2024. Ketiga, data yang sedikit secara efektif: sepuluh tahun data harian hanya 2.520 titik — kecil untuk model dengan jutaan parameter.",
        "RNN dan LSTM menangani sekuensial dengan memori yang dibawa dari langkah ke langkah — tetapi memori itu memudar untuk dependensi jauh, dan pelatihannya lambat karena harus berurutan. 1D ConvNet dan WaveNet memakai konvolusi dengan dilasi — melihat jauh ke belakang tanpa urutan — tetapi jendela pandangnya tetap terbatas oleh arsitektur. Transformer menghilangkan PEMROSESAN BERURUTAN — bukan urutannya: attention membiarkan tiap titik melihat SEMUA titik sebelumnya sekaligus dan memilih mana yang relevan, dan urutan itu sendiri dikodekan lewat positional encoding. Tanpa positional encoding, transformer tidak tahu mana titik yang lebih dulu — attention saja tidak membawa informasi urutan.",
        "Implikasinya untuk peneliti alpha: model yang lebih kuat bukan model yang lebih baik — melainkan model yang lebih berbahaya bila tidak divalidasi dengan benar. Validasi walk-forward (latih di masa lalu, uji di masa depan, geser jendela, ulangi) adalah validasi standar yang jujur untuk deret waktu — bukan satu-satunya: blocked cross-validation (lipatan berurutan tanpa acak) dan purged/embargoed split adalah alternatif yang sah bila dipakai dengan benar. Validasi acak — membagi data secara random — adalah look-ahead bias yang menyamar sebagai metodologi (lihat WQB36).",
      ],
      tasks: [],
      note: {
        title: "Attention bukan penjelasan",
        body: "Bobot attention yang tinggi pada satu titik masa lalu tidak berarti titik itu 'menyebabkan' prediksi — ia hanya berarti model itu memperhatikannya. Menafsirkan attention sebagai penjelasan kausal adalah kesalahan yang umum dan mahal. Attention adalah petunjuk untuk investigasi, bukan vonis.",
      },
      reference: "Signal-to-noise rendah, non-stationary, 2.520 titik dalam 10 tahun. Walk-forward adalah validasi standar yang jujur; blocked CV dan embargo adalah alternatif yang sah.",
    },
    {
      id: "menilai",
      eyebrow: "Langkah 4 · Teori",
      title: "Menilai dengan walk-forward: MAE, perbaikan, stabilitas",
      prose: [
        "Walk-forward lima lipatan di cerita pembuka: MAE per lipatan transformer adalah 1,40; 1,30; 1,35; 1,40; 1,30 — rata-rata 1,35 persen. AR: 1,90; 1,70; 1,80; 1,90; 1,70 — rata-rata 1,80 persen. LSTM: 1,60; 1,40; 1,50; 1,60; 1,40 — rata-rata 1,50 persen. Perbaikan transformer vs AR: (1,80 dikurangi 1,35) dibagi 1,80 dikali 100 sama dengan 25,0 persen.",
        "Tiga pertanyaan setelah angka itu. Pertama, stabilitas: MAE transformer berkisar 1,30 sampai 1,40 — sempit, stabil antar lipatan. Bila satu lipatan 0,90 dan lipatan lain 1,80, rata-rata 1,35 itu menipu — modelnya tidak stabil. Kedua, biaya: perbaikan 25,0 persen dalam MAE belum tentu berarti perbaikan dalam profit setelah biaya — bila transformer trading lebih sering, biayanya bisa memakan seluruh perbaikan. Ketiga, interpretabilitas: saat transformer salah besar di satu lipatan, bisakah peneliti menjelaskan kenapa — atau ia hanya bisa berkata 'modelnya begitu'?",
        "Satu aturan praktis: model deep learning hanya layak sebagai alpha bila ia mengalahkan baseline AR secara KONSISTEN di semua lipatan, bukan hanya rata-rata — dan bila keunggulannya bertahan setelah biaya dan setelah netralisasi faktor (lihat WQB8 dan WQB39). Bila tidak, ia adalah model yang mengesankan di paper dan tidak berguna di portofolio.",
      ],
      tasks: [],
      note: {
        title: "MAE bukan profit",
        body: "MAE mengukur kesalahan ramalan, bukan uang. Model dengan MAE lebih kecil bisa menghasilkan profit lebih kecil bila kesalahannya terkonsentrasi di hari-hari besar — saat sinyal paling berharga. Selalu ukur juga profit setelah biaya dan Sharpe (WQB3) sebelum memutuskan.",
      },
      reference: "Transformer MAE 1,35 persen (rentang 1,30-1,40); perbaikan 25,0 persen vs AR. Stabil, tetapi cek biaya dan interpretabilitas.",
    },
    {
      id: "lab-dl",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: MAE walk-forward dan perbaikan relatif",
      prose: [
        "Lab ini menghitung tiga angka dari validasi walk-forward: MAE rata-rata transformer, MAE rata-rata AR, dan perbaikan relatif transformer. Hitung dulu di kepala. MAE transformer: (1,40 ditambah 1,30 ditambah 1,35 ditambah 1,40 ditambah 1,30) dibagi 5 sama dengan 6,75 dibagi 5 sama dengan 1,35. MAE AR: (1,90 ditambah 1,70 ditambah 1,80 ditambah 1,90 ditambah 1,70) dibagi 5 sama dengan 9,0 dibagi 5 sama dengan 1,80. Perbaikan: (1,80 dikurangi 1,35) dibagi 1,80 dikali 100 sama dengan 25,0 persen.",
        "Tugas lab: isi tiga variabel — mae_trans, mae_ar, perbaikan — lalu cetak ketiganya. Tiga angka ini adalah kartu skor walk-forward: seberapa baik tiap model, dan seberapa besar keunggulan yang baru.",
        "Setelah lolos, coba eksperimen: ubah lipatan KETIGA transformer (1,35) menjadi 1,80 dan lihat rata-ratanya naik menjadi 1,44 dengan perbaikan turun ke 20,0 persen — (1,40 + 1,30 + 1,80 + 1,40 + 1,30) / 5 = 7,20 / 5 = 1,44; (1,80 − 1,44) / 1,80 = 20,0 persen. Lalu tanyakan: apakah transformer masih menang? Jawabannya: ya secara rata-rata — tetapi satu lipatan yang buruk adalah peringatan stabilitas yang harus diselidiki, bukan diabaikan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung MAE rata-rata transformer (persen)" },
        { id: "t2", text: "Hitung MAE rata-rata AR (persen)" },
        { id: "t3", text: "Hitung perbaikan relatif transformer vs AR (persen)" },
      ],
      expected: "mae_trans=1.35\nmae_ar=1.8\nperbaikan=25.0",
      hints: [
        "MAE rata-rata = jumlah MAE lima lipatan dibagi 5.",
        "Perbaikan = (MAE AR - MAE transformer) / MAE AR x 100.",
        "Bulatkan ke 2 desimal untuk MAE dan 1 desimal untuk perbaikan.",
      ],
      code: {
        starter: "# Walk-forward 5 lipatan, MAE persen. JANGAN UBAH.\nmae_transformer = [1.40, 1.30, 1.35, 1.40, 1.30]\nmae_ar = [1.90, 1.70, 1.80, 1.90, 1.70]\n\n# TULIS KODEMU: MAE rata-rata keduanya dan perbaikan relatif\nmae_trans = \nmae_ar_rata = \nperbaikan = \nprint(f\"mae_trans={round(mae_trans, 2)}\")\nprint(f\"mae_ar={round(mae_ar_rata, 2)}\")\nprint(f\"perbaikan={round(perbaikan, 1)}\")",
        lockLines: 4,
        solution: "# Walk-forward 5 lipatan, MAE persen. JANGAN UBAH.\nmae_transformer = [1.40, 1.30, 1.35, 1.40, 1.30]\nmae_ar = [1.90, 1.70, 1.80, 1.90, 1.70]\n\n# TULIS KODEMU: MAE rata-rata keduanya dan perbaikan relatif\nmae_trans = sum(mae_transformer) / len(mae_transformer)\nmae_ar_rata = sum(mae_ar) / len(mae_ar)\nperbaikan = (mae_ar_rata - mae_trans) / mae_ar_rata * 100\nprint(f\"mae_trans={round(mae_trans, 2)}\")\nprint(f\"mae_ar={round(mae_ar_rata, 2)}\")\nprint(f\"perbaikan={round(perbaikan, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "mae_trans=1.35", label: "MAE transformer 1,35 persen", msg: "6,75 / 5 = 1,35. Rentang 1,30-1,40 — stabil antar lipatan." },
          { kind: "stdout_matches", task: "t2", pattern: "mae_ar=1.8", label: "MAE AR 1,80 persen", msg: "9,0 / 5 = 1,80. Baseline yang harus dikalahkan." },
          { kind: "stdout_matches", task: "t3", pattern: "perbaikan=25.0", label: "Perbaikan 25,0 persen", msg: "(1,80 - 1,35) / 1,80 x 100 = 25,0. Perbaikan statistik — cek biaya sebelum merayakan." },
        ],
      },
      reference: "MAE transformer 1,35 persen; AR 1,80 persen; perbaikan 25,0 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: transformer yang menang di MAE, kalah di profit",
      prose: [
        "Transformer itu mengalahkan AR 25,0 persen dalam MAE — dan tim memutuskan membangun alpha darinya. Tiga bulan live, alpha itu merugi. Penyelidikan menemukan penyebabnya: transformer itu trading dua kali lebih sering dari AR — sinyalnya berubah tiap hari, sementara AR berubah tiap minggu. Biaya transaksi memakan seluruh keunggulan MAE-nya, dan sisanya adalah noise yang dihafal dari data latih.",
        "Perbaikannya: sinyal transformer dihaluskan dengan decay 5 hari (lihat WQB6) dan hanya ditradingkan saat perubahannya melebihi ambang — turnover turun 60 persen, dan alpha itu kembali positif dengan Sharpe 1,1. MAE-nya memburuk sedikit — dari 1,35 menjadi 1,42 — tetapi profitnya membaik. Pelajaran yang dicatat: MAE yang lebih baik bukan profit yang lebih baik, dan sinyal yang berubah tiap hari adalah sinyal yang membayar biaya tiap hari.",
        "Sejak itu, setiap model deret waktu yang diusulkan sebagai alpha wajib melewati tiga gerbang: MAE walk-forward yang konsisten, profit setelah biaya yang positif, dan turnover yang masuk akal. Model yang hanya lolos gerbang pertama tidak pernah sampai ke submit — berapa pun mengesankan MAE-nya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, penyebab dicari di biaya dan turnover, bukan di arsitektur. Kedua, decay dan ambang mengubah sinyal yang berisik menjadi sinyal yang bisa ditradingkan. Ketiga, tiga gerbang dijadikan syarat permanen — MAE saja tidak cukup.",
      },
      reference: "MAE menang 25,0 persen tetapi live merugi; decay 5 hari + ambang mengembalikan Sharpe 1,1.",
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
        "Deret waktu finansial: signal-to-noise rendah, non-stationary, data efektif sedikit.",
        "Lab: MAE transformer 1,35 persen; AR 1,80 persen; perbaikan 25,0 persen.",
        "Walk-forward adalah validasi standar yang jujur (blocked CV dan embargo adalah alternatif sah); validasi acak adalah look-ahead.",
        "Attention bukan penjelasan kausal — ia petunjuk investigasi.",
        "MAE bukan profit — ukur juga profit setelah biaya dan turnover.",
      ],
      next: { label: "WQB39 — Factor Research: Dari Premia ke Alpha di WorldQuant Brain", href: "/v2/learn/wqb39-factor-research" },
      quiz: [
        {
          q: "MAE transformer [1,40; 1,30; 1,35; 1,40; 1,30] dan AR [1,90; 1,70; 1,80; 1,90; 1,70]. Berapa rata-rata keduanya dan perbaikannya?",
          options: [
            { text: "1,35 dan 1,80; perbaikan 25,0 persen", why: "Tepat: 6,75/5 = 1,35; 9,0/5 = 1,80; (1,80-1,35)/1,80 = 25,0 persen.", correct: true },
            { text: "1,35 dan 1,80; perbaikan 45,0 persen", why: "Salah: 45,0 adalah hasil bila pembaginya 1,0, bukan 1,80." },
            { text: "1,44 dan 1,80; perbaikan 20,0 persen", why: "Salah: 1,44 adalah rata-rata bila satu lipatan diubah menjadi 1,80 — bukan data soal." },
            { text: "1,35 dan 1,70; perbaikan 20,6 persen", why: "Salah: 1,70 adalah MAE lipatan terendah AR, bukan rata-ratanya." },
          ],
        },
        {
          q: "Kenapa validasi acak (random split) tidak boleh dipakai untuk deret waktu finansial?",
          options: [
            { text: "Karena terlalu lambat", why: "Salah: kecepatan bukan alasannya." },
            { text: "Karena ia mencampur masa depan ke masa lalu — look-ahead bias yang menyamar sebagai metodologi", why: "Tepat: validasi acak melatih pada data yang seharusnya di masa depan relatif terhadap data uji.", correct: true },
            { text: "Karena hasilnya selalu lebih buruk", why: "Salah: terbalik — hasilnya biasanya terlihat LEBIH BAIK karena kebocoran." },
            { text: "Karena transformer tidak bisa dilatih dengan split acak", why: "Salah: transformer bisa dilatih begitu — hasilnya saja yang tidak jujur." },
          ],
        },
        {
          q: "Transformer mengalahkan AR 25,0 persen dalam MAE tetapi merugi di live karena trading dua kali lebih sering. Apa diagnosisnya?",
          options: [
            { text: "MAE yang salah hitung", why: "Salah: MAE-nya benar — yang salah adalah mengira MAE sama dengan profit." },
            { text: "Biaya transaksi memakan keunggulan MAE — MAE bukan profit", why: "Tepat: sinyal yang berubah tiap hari membayar biaya tiap hari.", correct: true },
            { text: "Transformer tidak cocok untuk deret waktu", why: "Salah: transformer cocok — yang tidak cocok adalah sinyal yang tidak dihaluskan dan tanpa ambang." },
            { text: "Walk-forward lima lipatan terlalu sedikit", why: "Salah: jumlah lipatan bukan penyebab kerugian live." },
          ],
        },
        {
          q: "Bobot attention transformer tinggi pada harga 30 hari lalu. Apa yang boleh disimpulkan?",
          options: [
            { text: "Harga 30 hari lalu menyebabkan prediksi ini", why: "Salah: attention bukan penjelasan kausal — ia hanya petunjuk untuk investigasi." },
            { text: "Model memperhatikan harga 30 hari lalu — petunjuk untuk diselidiki, bukan vonis", why: "Tepat: attention menunjukkan perhatian, bukan sebab-akibat.", correct: true },
            { text: "Tidak ada — attention tidak berarti apa-apa", why: "Salah: attention berarti model memperhatikan titik itu; ia hanya bukan bukti kausal." },
            { text: "Model itu pasti overfitting", why: "Salah: attention tinggi pada satu titik bukan bukti overfitting." },
          ],
        },
        {
          q: "Apa tiga gerbang sebelum model deret waktu boleh menjadi alpha?",
          options: [
            { text: "MAE walk-forward konsisten, profit setelah biaya positif, turnover masuk akal", why: "Tepat: ketiganya harus lolos — MAE saja tidak cukup.", correct: true },
            { text: "MAE terendah, parameter terbanyak, arsitektur terbaru", why: "Salah: parameter dan kebaruan bukan gerbang — profit setelah biaya adalah gerbang." },
            { text: "Akurasi arah 90 persen, Sharpe 3, tanpa biaya", why: "Salah: 'tanpa biaya' bukan gerbang — biaya harus dihitung, bukan diabaikan." },
            { text: "Paper yang mendukung, nama yang terkenal, backtest sepuluh tahun", why: "Salah: otoritas dan panjang backtest bukan pengganti profit setelah biaya." },
          ],
        },
      ],
    },
  ],
};
