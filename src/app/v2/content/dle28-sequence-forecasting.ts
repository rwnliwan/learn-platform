import type { V2Lesson } from "../lib/types";

export const dle28: V2Lesson = {
  slug: "dle28-sequence-forecasting",
  track: "Deep Learning Engineer",
  module: "Sequence",
  title: "DLE28 — Sequence Forecasting: RNN, 1D ConvNet, WaveNet & Transformer",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model teks yang disuruh meramal angka",
      prose: [
        "Tim data di startup logistik KirimCepat punya model sequence yang hebat untuk teks — DLE4 sudah mengajarkan RNN dan transformer untuk kalimat. Saat diminta meramal volume paket harian 30 hari ke depan, mereka memakai transformer yang sama, dengan jendela 7 hari, dan hasilnya kalah dari seasonal naive. Manajemen bertanya: bukankah deep learning seharusnya menang?",
        "Jawabannya ada pada perbedaan soal. Teks adalah urutan simbol diskrit dengan dependensi panjang yang tidak teratur; deret waktu adalah angka kontinu dengan musiman yang teratur dan horizon yang harus dipertanggungjawabkan. Arsitektur yang sama, dipakai tanpa memahami receptive field dan horizon, menjadi meriam yang ditembakkan ke sasaran lalat — persis seperti peringatan di DLE1.",
        "Lesson ini memindahkan sequence modeling dari teks ke angka: kapan RNN cukup, kapan 1D ConvNet dan WaveNet menang, kapan transformer untuk deret waktu justru boros, dan bagaimana horizon mengubah segalanya. Setelah lesson ini kamu bisa: (1) menghitung receptive field tumpukan konvolusi dilated; (2) menulis konvolusi kausal dan membaca outputnya; (3) membedakan prediksi rekursif dan direct multi-horizon; (4) memilih arsitektur dari panjang dependensi dan horizon, bukan dari nama yang sedang populer.",
      ],
      tasks: [],
      note: {
        title: "Hubungan dengan DLE4 dan DLE5",
        body: "DLE4 mengajarkan RNN dan attention untuk teks; DLE5 mengajarkan transformer untuk teks. Lesson ini TIDAK mengulang keduanya: di sini urutannya adalah angka, metriknya MAE per horizon, dan pertanyaannya adalah berapa jauh ke belakang model bisa melihat — receptive field — dan berapa jauh ke depan ia harus meramal.",
      },
      reference: "Teks = simbol diskrit, dependensi tak teratur. Deret waktu = angka kontinu, musiman teratur, horizon wajib dipertanggungjawabkan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih dan mengevaluasi arsitektur deep learning untuk forecasting deret waktu, dengan receptive field dan horizon sebagai dua angka penentunya.",
        "(1) Menghitung receptive field tumpukan konvolusi kausal dilated dari kernel dan dilasi tiap lapis;",
        "(2) Menjelaskan kenapa konvolusi untuk forecasting harus kausal dan apa yang bocor bila padding-nya simetris;",
        "(3) Membandingkan prediksi rekursif dan direct untuk horizon multi-langkah, termasuk kenapa prediksi rekursif cenderung mendatar;",
        "(4) Memilih RNN, 1D ConvNet, WaveNet, atau transformer dari panjang dependensi, ukuran data, dan horizon.",
      ],
      tasks: [],
    },
    {
      id: "rnn-batas",
      eyebrow: "Langkah 3 · Teori",
      title: "RNN untuk angka: ingatan yang meluruh tiap langkah",
      prose: [
        "RNN membaca deret satu titik per langkah dan menyimpan ringkasan di hidden state. Untuk teks ini wajar — kalimat dibaca kata per kata. Untuk deret waktu, masalahnya adalah skala: dependensi musiman tahunan berarti 52 langkah mingguan atau 365 langkah harian yang harus diingat, dan gradien yang mengalir mundur sejauh itu mengecil secara eksponensial — vanishing gradient dari DLE4, kini dalam satuan hari, bukan kata.",
        "LSTM dan GRU memperpanjang ingatan dengan gerbang, tetapi tidak menghapus biayanya: training tetap sekuensial, tidak bisa diparalelkan per langkah, dan 365 langkah berarti 365 operasi berurutan. Untuk deret harian dua tahun, satu epoch menjadi lambat sebelum model sempat pintar. Aturan praktis: RNN masih masuk akal untuk deret pendek — di bawah 100 langkah — dengan pola yang berubah-ubah dan butuh adaptasi cepat, misalnya volume paket yang melonjak tiap ada flash sale.",
        "Satu keunggulan RNN yang sering dilupakan: ia menangani panjang deret yang bervariasi secara alami, tanpa padding ke panjang tetap. Bila deretmu datang dengan panjang berbeda-beda tiap SKU, RNN tidak memaksamu memotong atau mengisi — transformer dan ConvNet memaksamu memilih jendela.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: LSTM mengingat setahun penuh",
        body: "LSTM mengingat lebih lama dari RNN biasa, tetapi ingatannya tetap meluruh. Uji jujurnya: latih pada deret dengan pola tahunan, lalu lihat apakah forecast bulan ke-13 memakai pola bulan ke-1. Bila tidak, ingatanmu tidak sejauh yang kamu kira — tambah receptive field, bukan tambah lapis LSTM.",
      },
      reference: "RNN = ingatan meluruh, training sekuensial. Cocok untuk deret pendek di bawah 100 langkah.",
    },
    {
      id: "conv-wavenet",
      eyebrow: "Langkah 4 · Teori",
      title: "1D ConvNet dan WaveNet: melihat jauh dengan dilasi",
      prose: [
        "Konvolusi 1D menggeser kernel kecil di sepanjang deret dan menghitung rata-rata berbobot lokal. Syarat mutlaknya adalah kausal: output di waktu t hanya boleh memakai input sampai waktu t. Padding simetris — yang biasa di CNN citra — adalah leakage di sini: ia mengintip masa depan. Padding kausal mengisi sisi kiri saja, sehingga tidak ada informasi dari kanan yang bocor.",
        "WaveNet, dari DeepMind, menumpuk konvolusi kausal dengan dilasi yang berlipat: 1, 2, 4, 8, dan seterusnya. Receptive field tumpukan itu adalah 1 ditambah (ukuran kernel minus 1) dikali jumlah seluruh dilasi. Dengan kernel 3 dan dilasi 1, 2, 4, 8, receptive field-nya 1 ditambah 2 dikali 15, yaitu 31 langkah — model melihat 31 hari ke belakang dengan hanya 4 lapis. Tambah dilasi 16 dan 32, receptive field-nya menjadi 127 langkah dengan 6 lapis. Inilah keunggulan WaveNet: jangkauan tumbuh eksponensial, lapis tumbuh linear.",
        "Dibanding RNN, ConvNet bisa diparalelkan penuh saat training — semua titik dihitung sekaligus — dan gradiennya tidak harus menempuh 365 langkah berurutan. Dibanding transformer, ia jauh lebih hemat untuk deret panjang karena biayanya linear terhadap panjang, bukan kuadratik. Kelemahannya: receptive field-nya tetap — bila dependensimu lebih jauh dari receptive field, model buta, tidak peduli seberapa dalam ia dilatih.",
      ],
      tasks: [],
      formula: String.raw`\text{RF} = 1 + (k - 1)\sum_{i} d_i`,
      formulaNote: "RF = receptive field, jumlah langkah ke belakang yang bisa dilihat model. k = ukuran kernel, d_i = dilasi lapis ke-i. Contoh: k=3, dilasi 1, 2, 4, 8, maka RF = 1 + 2 x 15 = 31 langkah.",
      reference: "Konvolusi forecasting wajib kausal. WaveNet: dilasi berlipat, jangkauan eksponensial, lapis linear.",
    },
    {
      id: "transformer-horizon",
      eyebrow: "Langkah 5 · Teori",
      title: "Transformer untuk deret waktu dan pajak horizon",
      prose: [
        "Transformer melihat seluruh jendela sekaligus lewat attention — tidak ada ingatan yang meluruh, tidak ada receptive field yang tetap. Harganya adalah kuadratik: jendela 90 hari berarti 8.100 pasang attention, jendela 365 hari berarti 133.225 pasang. Untuk deret waktu, harga ini sering tidak sepadan: dependensi terpenting biasanya lokal dan musiman — tetangga dekat dan musim lalu — bukan sembarang titik jauh yang dipilih attention.",
        "Penelitian beberapa tahun terakhir menunjukkan hasil yang mengejutkan banyak praktisi: model linear sederhana di atas fitur lag sering mengalahkan transformer besar pada benchmark forecasting — karena deret waktu didominasi tren dan musiman yang teratur, bukan dependensi jauh yang rumit. Pelajarannya bukan transformer itu buruk, melainkan baseline-nya harus jujur: kalahkan dulu naive, seasonal naive, dan model linear sebelum mengklaim arsitekturmu menang. Aturan yang sama dengan MLE15 dan MLE29.",
        "Pajak kedua adalah horizon. Prediksi rekursif memakai output langkah ke-1 sebagai input langkah ke-2, dan seterusnya — error menumpuk dan forecast cenderung mendatar menuju rata-rata, seperti yang kamu lihat di lab: tiga langkah rekursif menghasilkan 134,4, lalu 134,8, lalu 135,7 — nyaris datar, padahal deretnya naik. Prediksi direct melatih satu model per horizon dan menghindari penumpukan, dengan harga melatih banyak model. Untuk horizon 30 hari, direct hampir selalu lebih jujur daripada rekursif.",
      ],
      tasks: [],
      note: {
        title: "Kapan transformer menang",
        body: "Bila deretmu punya dependensi jauh yang TIDAK teratur — misalnya lonjakan yang dipicu kejadian 200 hari lalu dengan pola yang tidak musiman — attention bisa menemukannya sementara ConvNet dengan receptive field tetap tidak. Uji dengan ablation: potong jendela menjadi setengah; bila skor runtuh, dependensi jauh itu nyata.",
      },
      reference: "Transformer = jendela penuh, harga kuadratik. Rekursif = error menumpuk, forecast mendatar. Direct = jujur, mahal.",
    },
    {
      id: "lab-konvolusi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: konvolusi kausal, receptive field, dan prediksi rekursif",
      prose: [
        "Sekarang hitung dengan tangan modelnya. Deret volume paket harian delapan hari: 100, 110, 105, 120, 118, 130, 128, 140. Kernel kausal berbobot 0,5 untuk hari ini, 0,3 untuk kemarin, dan 0,2 untuk dua hari lalu. Output di hari ke-3 adalah 0,5 kali 105 ditambah 0,3 kali 110 ditambah 0,2 kali 100, yaitu 105,5. Lanjutkan sampai hari ke-8 dan kamu mendapat 105,5; 113,5; 116,0; 124,4; 126,6; 134,4.",
        "Bandingkan dengan aktual 105, 120, 118, 130, 128, 140: errornya 0,5; 6,5; 2,0; 5,6; 1,4; 5,6 — MAE 3,60. Model ini selalu tertinggal di titik yang melonjak, karena sepertiga bobotnya adalah masa lalu. Itulah karakter konvolusi kausal: ia menghaluskan, dan penghalusan selalu terlambat di tanjakan.",
        "Receptive field tumpukan WaveNet dengan kernel 3 dan dilasi 1, 2, 4, 8 adalah 1 ditambah 2 dikali 15, yaitu 31 langkah. Lalu prediksi rekursif tiga langkah dari ujung deret: langkah pertama 134,4, langkah kedua memakai 134,4 sebagai input dan menghasilkan 134,8, langkah ketiga 135,7. Tiga angka yang nyaris datar — pajak rekursif yang dijelaskan di Langkah 5, kini kamu melihatnya dihitung, bukan diceritakan.",
        "Setelah lolos, coba eksperimen: ganti kernel menjadi 0,7; 0,2; 0,1 dan lihat MAE membaik di tanjakan tetapi memburuk di noise — trade-off bias dan varians dalam satu baris bobot.",
      ],
      tasks: [
        { id: "t1", text: "Hitung output konvolusi kausal untuk hari ke-3 sampai ke-8 dengan kernel 0,5; 0,3; 0,2" },
        { id: "t2", text: "Hitung MAE konvolusi terhadap aktual dan receptive field tumpukan dilasi 1, 2, 4, 8" },
        { id: "t3", text: "Hitung prediksi rekursif tiga langkah dari ujung deret" },
      ],
      expected: "rf=31",
      hints: [
        "Output hari ke-4: 0,5 kali 120 ditambah 0,3 kali 105 ditambah 0,2 kali 110 = 113,5.",
        "MAE = (0,5 + 6,5 + 2,0 + 5,6 + 1,4 + 5,6) / 6 = 3,60.",
        "Rekursif langkah ke-2: 0,5 kali 134,4 ditambah 0,3 kali 140 ditambah 0,2 kali 128 = 134,8.",
      ],
      code: {
        starter: `data = [100, 110, 105, 120, 118, 130, 128, 140]\nkernel = [0.5, 0.3, 0.2]\n\n# TULIS KODEMU: konvolusi kausal hari ke-3 sampai ke-8, MAE, receptive field\n# tumpukan dilasi 1, 2, 4, 8 dengan kernel 3, lalu prediksi rekursif 3 langkah.\n\nconv = []\nmae_conv = 0.0\nrf = 0\nrekursif = []\n\nprint("conv=" + ", ".join(f"{v:.1f}" for v in conv))\nprint(f"mae={mae_conv:.2f}")\nprint(f"rf={rf}")\nprint("rekursif=" + ", ".join(f"{v:.1f}" for v in rekursif))`,
        lockLines: 2,
        solution: `data = [100, 110, 105, 120, 118, 130, 128, 140]\nkernel = [0.5, 0.3, 0.2]\n\nconv = []\nfor t in range(2, 8):\n    conv.append(kernel[0] * data[t] + kernel[1] * data[t - 1] + kernel[2] * data[t - 2])\naktual = data[2:8]\nmae_conv = round(sum(abs(a - p) for a, p in zip(aktual, conv)) / 6, 2)\nrf = 1 + (3 - 1) * (1 + 2 + 4 + 8)\n\nriwayat = data[:]\nrekursif = []\nfor s in range(3):\n    nilai = kernel[0] * riwayat[-1] + kernel[1] * riwayat[-2] + kernel[2] * riwayat[-3]\n    rekursif.append(round(nilai, 1))\n    riwayat.append(nilai)\n\nprint("conv=" + ", ".join(f"{v:.1f}" for v in conv))\nprint(f"mae={mae_conv:.2f}")\nprint(f"rf={rf}")\nprint("rekursif=" + ", ".join(f"{v:.1f}" for v in rekursif))`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "conv=105\\.5, 113\\.5, 116\\.0, 124\\.4, 126\\.6, 134\\.4\\nmae=3\\.60\\nrf=31\\nrekursif=134\\.4, 134\\.8, 135\\.7", label: "Output konvolusi, MAE, RF, dan prediksi rekursif sesuai hitungan", msg: "Conv: 105,5; 113,5; 116,0; 124,4; 126,6; 134,4. MAE 3,60. RF 31. Rekursif: 134,4; 134,8; 135,7." },
          { kind: "equal", task: "t2", name: "mae_conv", value: 3.6, tol: 0.01, label: "`mae_conv` = 3.60", msg: "Error: 0,5; 6,5; 2,0; 5,6; 1,4; 5,6 — jumlah 21,6 dibagi 6 = 3,60." },
          { kind: "equal", task: "t2", name: "rf", value: 31, tol: 0.01, label: "`rf` = 31", msg: "RF = 1 + 2 x (1 + 2 + 4 + 8) = 31 langkah." },
          { kind: "uses", task: "t1", token: "conv", label: "Konvolusi kausal dihitung", msg: "Output hari t memakai data t, t minus 1, dan t minus 2 — tidak ada data masa depan." },
        ],
      },
      reference: "Conv 105,5; 113,5; 116,0; 124,4; 126,6; 134,4. MAE 3,60. RF 31. Rekursif 134,4; 134,8; 135,7 — nyaris datar.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: meramal 90 hari volume paket harian",
      prose: [
        "KirimCepat kini butuh forecast 90 hari ke depan dari data harian dua tahun. Tiga arsitektur diajukan: RNN, WaveNet, dan transformer dengan jendela 128 hari. Keputusanmu harus memakai dua angka: receptive field dan horizon.",
        "WaveNet dengan kernel 3 dan dilasi 1, 2, 4, 8, 16, 32 punya receptive field 1 ditambah 2 dikali 63, yaitu 127 hari — cukup untuk melihat satu kuartal penuh plus satu bulan, dengan hanya 6 lapis. Transformer jendela 128 menghitung 16.384 pasang attention per head — mahal, tetapi melihat seluruh jendela tanpa batas receptive field. RNN tidak perlu dipilih: 730 langkah harian membuat training sekuensialnya lambat dan ingatannya meluruh jauh sebelum mencapai musim lalu.",
        "Horizon 90 hari memutuskan strategi prediksi: rekursif 90 langkah akan mendatar seperti di lab — error menumpuk tiap langkah. Maka pilih direct: satu model per horizon kunci, misalnya hari ke-7, ke-30, dan ke-90, lalu interpolasi di antaranya. Keputusan akhir: WaveNet direct untuk horizon kunci, dengan transformer jendela 128 sebagai challenger yang hanya dipakai bila ia mengalahkan WaveNet pada validasi walk-forward — bukan karena namanya lebih modern.",
        "Jebakan terakhir: jangan validasi dengan split acak. Walk-forward dengan jendela train yang membesar, seperti MLE29, adalah satu-satunya wasit yang berlaku untuk soal ini.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "WaveNet 6 lapis, dilasi 1 sampai 32, receptive field 127 hari — cukup untuk dependensi kuartalan. Transformer jendela 128 = 16.384 pasang attention per head. Horizon 90 hari memakai direct, bukan rekursif. RNN ditolak karena 730 langkah sekuensial.",
      },
      reference: "RF 127 menutup 90 hari. Direct untuk horizon panjang. Validasi tetap walk-forward.",
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
        "RNN cocok untuk deret pendek di bawah 100 langkah; ingatannya meluruh dan trainingnya sekuensial.",
        "Konvolusi forecasting wajib kausal; WaveNet memakai dilasi berlipat — RF 31 untuk dilasi 1, 2, 4, 8 dengan kernel 3.",
        "Transformer melihat seluruh jendela sekaligus dengan harga kuadratik: jendela 128 berarti 16.384 pasang attention.",
        "Prediksi rekursif menumpuk error dan mendatar; horizon panjang memakai direct.",
        "Lab: conv MAE 3,60; RF 31; rekursif 134,4; 134,8; 135,7.",
      ],
      next: { label: "DLE29 — Speech & Audio: dari Gelombang ke Kata", href: "/v2/learn/dle29-speech-audio" },
      quiz: [
        {
          q: "Kenapa padding simetris — yang biasa di CNN citra — dilarang pada konvolusi untuk forecasting?",
          options: [
            { text: "Karena padding simetris membuat training lebih lambat", why: "Salah: kecepatan bukan masalahnya. Masalahnya adalah informasi yang bocor." },
            { text: "Karena ia mengintip masa depan — output hari t memakai data setelah t", why: "Tepat: itulah leakage. Konvolusi forecasting wajib kausal: padding hanya di sisi kiri.", correct: true },
            { text: "Karena padding simetris tidak bisa dipakai pada data 1D", why: "Salah: secara teknis bisa dipakai. Larangannya konseptual, bukan teknis — ia merusak kejujuran evaluasi." },
            { text: "Karena padding simetris mengubah receptive field menjadi nol", why: "Salah: receptive field tetap terhitung. Yang rusak adalah validitas temporal, bukan ukuran jangkauan." },
          ],
        },
        {
          q: "Tumpukan WaveNet kernel 3 dengan dilasi 1, 2, 4, 8 punya receptive field 31. Bila ditambah dilasi 16 dan 32, receptive field menjadi?",
          options: [
            { text: "47", why: "Salah: 47 adalah 31 ditambah 16 — itu penjumlahan yang keliru. Rumusnya 1 ditambah 2 dikali jumlah seluruh dilasi." },
            { text: "63", why: "Salah: 63 adalah jumlah seluruh dilasi (1+2+4+8+16+32). Receptive field memakai rumus 1 + 2 x 63." },
            { text: "127", why: "Tepat: 1 + 2 x 63 = 127 langkah dengan 6 lapis — jangkauan tumbuh eksponensial, lapis tumbuh linear.", correct: true },
            { text: "255", why: "Salah: 255 didapat bila kernelnya 5 atau dilasinya dilipatgandakan sekali lagi. Dengan kernel 3, jawabannya 127." },
          ],
        },
        {
          q: "Prediksi rekursif tiga langkah di lab menghasilkan 134,4; 134,8; 135,7 — nyaris datar padahal deretnya naik. Apa penyebabnya?",
          options: [
            { text: "Kernel konvolusinya salah dipilih", why: "Salah: kernel yang sama menghasilkan MAE 3,60 pada satu langkah — ia bekerja. Yang mendatar adalah mekanisme rekursifnya." },
            { text: "Tiap langkah memakai prediksinya sendiri sebagai input, sehingga error menumpuk dan forecast tertarik ke rata-rata", why: "Tepat: itulah pajak rekursif. Horizon panjang memakai direct: satu model per horizon.", correct: true },
            { text: "Deretnya sebenarnya datar dan kenaikan di data adalah noise", why: "Salah: deret naik dari 100 ke 140 dalam delapan hari — trennya nyata. Yang gagal menangkap tren adalah prediksi rekursif, bukan datanya." },
            { text: "Receptive field 31 terlalu kecil untuk deret delapan hari", why: "Salah: receptive field 31 justru lebih besar dari deretnya. Masalahnya bukan jangkauan ke belakang, melainkan penumpukan error ke depan." },
          ],
        },
        {
          q: "Transformer dengan jendela 90 hari menghitung 8.100 pasang attention. Kenapa banyak praktisi tetap memilih model linear atau ConvNet untuk forecasting?",
          options: [
            { text: "Karena transformer tidak bisa dipakai pada data angka", why: "Salah: transformer bisa dipakai pada angka. Pertanyaannya adalah apakah harganya sepadan." },
            { text: "Karena dependensi deret waktu biasanya lokal dan musiman — model sederhana sering menang, dan baseline wajib dikalahkan dulu", why: "Tepat: tren dan musiman yang teratur tidak butuh attention kuadratik. Klaim kemenangan wajib melewati baseline naive dan linear.", correct: true },
            { text: "Karena attention tidak bisa menangkap musiman", why: "Salah: attention bisa menangkap musiman. Masalahnya adalah biaya kuadratik untuk manfaat yang sering kecil." },
            { text: "Karena transformer hanya bekerja pada teks", why: "Salah: transformer adalah arsitektur umum. Ia dipakai pada citra, audio, dan deret waktu — hanya saja tidak selalu menang." },
          ],
        },
        {
          q: "Untuk forecast 90 hari volume paket harian, kenapa RNN ditolak dalam mini-case?",
          options: [
            { text: "Karena RNN tidak bisa meramal lebih dari 7 hari", why: "Salah: RNN bisa meramal horizon berapa pun secara rekursif. Penolakannya karena training dan ingatan, bukan batas horizon." },
            { text: "Karena 730 langkah harian membuat training sekuensial lambat dan ingatan meluruh sebelum mencapai musim lalu", why: "Tepat: itulah dua kelemahan RNN pada deret panjang — sekuensial dan vanishing gradient.", correct: true },
            { text: "Karena RNN butuh data teks, bukan angka", why: "Salah: RNN bekerja pada angka maupun teks. DLE4 sendiri memakai RNN untuk urutan umum." },
            { text: "Karena RNN tidak punya receptive field", why: "Salah: RNN punya ingatan, bukan receptive field tetap — justru itu masalahnya: ingatannya meluruh tanpa batas yang jelas." },
          ],
        },
      ],
    },
  ],
};
