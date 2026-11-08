import type { V2Lesson } from "../lib/types";

export const fr28: V2Lesson = {
  slug: "fr28-financial-statement-fraud",
  track: "Fraud & AML Analytics",
  module: "Deteksi Analitik",
  title: "FR28 — Financial Statement Fraud: Sinyal Analitik dari Angka",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Revenue naik 38 persen, piutang naik 72 persen",
      prose: [
        "Sebuah emiten melaporkan revenue naik dari Rp1.000 miliar menjadi Rp1.380 miliar — naik 38,0 persen, jauh di atas industri yang tumbuh 9 persen. Pasar bersorak. Tetapi seorang analis fraud melihat angka kedua: piutang naik dari Rp200 miliar menjadi Rp344 miliar — naik 72,0 persen. Revenue tumbuh, tetapi sebagian besar belum tertagih — piutang menumpuk. Dan angka ketiga: kas dari operasi turun dari Rp120 miliar menjadi Rp85 miliar — turun 29,2 persen — sementara laba naik. Tiga hubungan putus sekaligus: revenue naik tanpa kas, piutang tumbuh jauh lebih cepat dari revenue, dan pertumbuhan jauh di atas industri. Days sales in receivables (DSO) naik dari 73,0 hari menjadi 91,0 hari: perusahaan butuh 18,0 hari lebih lama untuk menagih setiap rupiah penjualan.",
        "Enam bulan kemudian, restatement terbit: Rp210 miliar revenue ternyata diakui terlalu dini — barang belum dikirim, tetapi pendapatannya sudah dicatat. Analis itu tidak membaca pikiran manajemen; ia membaca hubungan antar angka. Lesson ini mengajarkan sudut analitik dan deteksi data atas financial statement fraud — bukan audit forensiknya, melainkan sinyal-sinyal kuantitatif yang bisa dihitung dari laporan keuangan publik sebelum restatement datang.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Financial statement fraud tidak pernah dibahas di track FR (pencarian frasa itu menghasilkan nol). Di FSA Lab, M25 membahas Altman Z-score dan M2 membahas Beneish M-score dari sudut forensik — lesson ini TIDAK menduplikasi keduanya. Yang dibangun di sini hanyalah sudut analitik dan deteksi data untuk analis fraud: hubungan revenue-piutang, DSO, dan pola pertumbuhan yang tidak konsisten, dihitung dari data.",
      },
      reference: "Revenue +38,0 persen, piutang +72,0 persen, DSO 73,0 → 91,0 hari (+18,0 hari), kas operasi Rp120 → Rp85 miliar (−29,2 persen). Restatement Rp210 miliar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menghitung sinyal kuantitatif kecurangan laporan keuangan dari data publik.",
        "(1) Menjelaskan tiga skema financial statement fraud yang paling umum;",
        "(2) Menghitung DSO dan membaca perubahannya sebagai sinyal;",
        "(3) Membandingkan pertumbuhan revenue dengan pertumbuhan piutang, kas, dan industri;",
        "(4) Membedakan pertumbuhan yang sehat dari pertumbuhan yang dipoles;",
        "(5) Menyusun skor sinyal gabungan dan ambang eskalasi ke investigasi.",
      ],
      tasks: [],
    },
    {
      id: "tiga-skema",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga skema: revenue dini, biaya disembunyikan, aset digelembungkan",
      prose: [
        "Skema pertama: pengakuan revenue terlalu dini atau fiktif — barang belum dikirim tetapi revenue dicatat, atau penjualan ke pihak yang tidak akan pernah membayar. Jejak datanya: revenue naik lebih cepat dari piutang yang tertagih, dan arus kas operasi tidak mengikuti laba. Dalam cerita pembuka, revenue naik 38,0 persen sementara kas dari operasi turun dari Rp120 miliar menjadi Rp85 miliar (−29,2 persen) — laba tanpa kas adalah tanda bahaya pertama. Tetapi ingat kualifikasinya: piutang yang naik BUKAN bukti 'uangnya tidak masuk' — piutang naik bisa berarti penjualan kredit yang sah dengan termin lebih panjang, atau perusahaan masuk ke segmen pelanggan baru. Yang mencurigakan adalah kombinasinya — piutang +72 persen vs revenue +38 persen, DSO +18 hari, DAN kas turun 29 persen — bukan satu angka sendirian.",
        "Skema kedua: biaya dan kewajiban disembunyikan — utang dipindah ke entitas di luar neraca, beban ditunda ke periode berikut. Jejak datanya: margin naik tanpa alasan operasional, atau kewajiban tumbuh jauh lebih lambat dari aset. Skema ketiga: aset digelembungkan — persediaan yang tidak ada, piutang yang tidak akan tertagih. Jejak datanya: perputaran aset jatuh sementara asetnya membengkak.",
        "Ketiga skema punya satu kesamaan: mereka memutus hubungan yang seharusnya bergerak bersama. Revenue dan kas, piutang dan penagihan, aset dan perputarannya — pasangan-pasangan ini punya korelasi yang stabil di perusahaan sehat. Fraud adalah pemutusan hubungan itu, dan analis fraud adalah orang yang memeriksa hubungan, bukan angka tunggal.",
      ],
      tasks: [],
      note: {
        title: "Sinyal bukan vonis",
        body: "DSO yang naik 18 hari bukan bukti fraud — ia bisa berarti perusahaan masuk ke segmen pelanggan baru dengan termin lebih panjang, atau industri sedang sulit. Sinyal hanya berkata 'periksa ini'. Vonis butuh bukti dokumen dan wawancara — lihat FR27. Analis yang menuduh dari satu rasio adalah analis yang akan segera kehilangan kredibilitasnya.",
      },
      reference: "Tiga skema: revenue dini, biaya disembunyikan, aset digelembungkan — semuanya memutus hubungan antar angka.",
    },
    {
      id: "dso",
      eyebrow: "Langkah 4 · Teori",
      title: "DSO dan tiga perbandingan yang tidak bisa berbohong",
      prose: [
        "Days sales in receivables mengukur berapa hari rata-rata penjualan menunggu ditagih: piutang dibagi revenue dikali 365. Tahun lalu: 200 dibagi 1.000 dikali 365 sama dengan 73,0 hari. Tahun ini: 344 dibagi 1.380 dikali 365 sama dengan 91,0 hari — naik 18,0 hari. Rasio piutang terhadap revenue juga naik: dari 20,0 persen menjadi 24,9 persen. Setiap rupiah penjualan tahun ini meninggalkan 24,9 sen sebagai piutang, naik dari 20,0 sen.",
        "Tiga perbandingan yang menyertai DSO — dan ketiganya harus INDEPENDEN, bukan hitungan ganda atas fenomena yang sama. Pertama, revenue vs industri: perusahaan tumbuh 38,0 persen sementara industri 9 persen — pertumbuhan yang jauh di atas pasar butuh penjelasan operasional yang sama jauhnya. Kedua, revenue vs kas operasi: laba naik tetapi kas turun dari Rp120 miliar menjadi Rp85 miliar (−29,2 persen) berarti laba itu belum berbentuk uang. Ketiga, piutang vs revenue: piutang yang tumbuh 72,0 persen sementara revenue tumbuh 38,0 persen berarti penjualan baru sebagian besar belum dibayar — apakah karena termin lebih panjang atau karena tidak akan dibayar, hanya investigasi yang bisa menjawab. Perhatian: DSO dan perbandingan ketiga ini adalah SATU sinyal yang sama — DSO hanyalah (piutang/revenue) × 365 — jadi jangan menghitung keduanya sebagai dua poin skor. Skor di bawah memakai DSO sebagai satu-satunya wakil dari sinyal penagihan.",
        "Skor sinyal gabungan dibuat dari tiga sumbu yang independen: satu poin bila DSO naik lebih dari 10 hari (penagihan memanjang), satu poin bila revenue tumbuh dua kali industri (pertumbuhan vs pasar), satu poin bila kas operasi bergerak berlawanan dengan laba (laba vs kas). Skor 0 berarti pantau biasa; skor 1 berarti tanyakan ke manajemen; skor 2 berarti eskalasi ke tim investigasi; skor 3 berarti bekukan keputusan kredit dan investasi sampai jelas. Perusahaan di cerita pembuka mencetak 3 dari 3 — enam bulan sebelum restatement. Skor ini adalah alat triase, bukan ukuran probabilitas fraud: tiga poin tidak berarti 'pasti fraud', dan bobot tiap sumbu belum tentu sama — perusahaan dengan model bisnis berbeda bisa memberi bobot berbeda.",
      ],
      tasks: [],
      note: {
        title: "DSO sektoral berbeda-beda — bandingkan dengan pembanding yang jujur",
        body: "DSO 91 hari adalah bahaya di ritel yang biasanya menagih dalam 30 hari, tetapi normal di proyek infrastruktur dengan termin 90 hari. Selalu bandingkan DSO dengan DSO perusahaan itu sendiri tahun lalu dan dengan median industrinya — bukan dengan angka absolut universal. Pembanding yang jujur butuh normalisasi lintas industri: samakan definisi (piutang usaha saja, tanpa piutang lain-lain), samakan periode (tahunan vs kuartalan), dan pakai median + rentang antarkuartil peer, bukan satu perusahaan pembanding yang dipilih karena cocok dengan kesimpulanmu. DSO median industri di cerita ini 68 hari — emiten di 91 hari berada 23 hari di atas median — tetapi bila peer-nya adalah perusahaan infrastruktur dengan termin 90 hari, 91 hari itu biasa saja. Pembanding yang salah lebih berbahaya daripada tidak ada pembanding.",
      },
      reference: "DSO 73,0 → 91,0 hari; piutang/revenue 20,0 persen → 24,9 persen; skor sinyal 3 dari 3 (tiga sumbu independen — DSO dan piutang/revenue adalah satu sinyal).",
    },
    {
      id: "lab-fsf",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung DSO dan sinyal piutang",
      prose: [
        "Lab ini menghitung DSO dua tahun dan perubahan rasio piutang terhadap revenue. Hitung dulu di kepala. DSO tahun lalu: 200 dibagi 1.000 dikali 365 sama dengan 73,0 hari. DSO tahun ini: 344 dibagi 1.380 dikali 365 sama dengan 91,0 hari (pembulatan satu desimal). Kenaikan DSO: 91,0 dikurangi 73,0 sama dengan 18,0 hari.",
        "Tugas lab: isi tiga variabel — dso_lalu, dso_kini, delta_dso — lalu cetak ketiganya. Tiga angka ini adalah baris pertama memo eskalasi: berapa lama penagihan memanjang, dan apakah ia melewati ambang 10 hari yang memicu skor sinyal.",
        "Setelah lolos, coba eksperimen: ubah piutang tahun ini menjadi 280 dan lihat DSO turun menjadi 74,1 hari — lalu tanyakan: apakah revenue 38 persen itu tiba-tiba terlihat sehat? Jawabannya: ya, dan itulah kenapa satu rasio tidak pernah cukup — selalu baca DSO bersama kas operasi dan pertumbuhan industri.",
      ],
      tasks: [
        { id: "t1", text: "Hitung DSO tahun lalu dalam hari" },
        { id: "t2", text: "Hitung DSO tahun ini dalam hari" },
        { id: "t3", text: "Hitung kenaikan DSO dalam hari" },
      ],
      expected: "dso_lalu=73.0\ndso_kini=91.0\ndelta_dso=18.0",
      hints: [
        "DSO = piutang dibagi revenue dikali 365.",
        "Bulatkan ke 1 desimal.",
        "Delta = DSO kini dikurangi DSO lalu.",
      ],
      code: {
        starter: "# Emiten: revenue dan piutang dua tahun (Rp miliar). JANGAN UBAH.\nrev_lalu, piutang_lalu = 1000, 200\nrev_kini, piutang_kini = 1380, 344\n\n# TULIS KODEMU: DSO lalu, DSO kini, kenaikan DSO\ndso_lalu = \ndso_kini = \ndelta_dso = \nprint(f\"dso_lalu={round(dso_lalu, 1)}\")\nprint(f\"dso_kini={round(dso_kini, 1)}\")\nprint(f\"delta_dso={round(delta_dso, 1)}\")",
        lockLines: 5,
        solution: "# Emiten: revenue dan piutang dua tahun (Rp miliar). JANGAN UBAH.\nrev_lalu, piutang_lalu = 1000, 200\nrev_kini, piutang_kini = 1380, 344\n\n# TULIS KODEMU: DSO lalu, DSO kini, kenaikan DSO\ndso_lalu = piutang_lalu / rev_lalu * 365\ndso_kini = piutang_kini / rev_kini * 365\ndelta_dso = dso_kini - dso_lalu\nprint(f\"dso_lalu={round(dso_lalu, 1)}\")\nprint(f\"dso_kini={round(dso_kini, 1)}\")\nprint(f\"delta_dso={round(delta_dso, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "dso_lalu=73.0", label: "DSO lalu 73,0 hari", msg: "200 / 1.000 x 365 = 73,0. Ini baseline perusahaan itu sendiri." },
          { kind: "stdout_matches", task: "t2", pattern: "dso_kini=91.0", label: "DSO kini 91,0 hari", msg: "344 / 1.380 x 365 = 90,99, dibulatkan 91,0. Penagihan memanjang." },
          { kind: "stdout_matches", task: "t3", pattern: "delta_dso=18.0", label: "Kenaikan 18,0 hari", msg: "91,0 - 73,0 = 18,0. Di atas ambang 10 hari — satu poin skor sinyal." },
        ],
      },
      reference: "DSO 73,0 → 91,0 hari; kenaikan 18,0 hari; piutang/revenue 20,0 persen → 24,9 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: memo eskalasi yang menyelamatkan Rp210 miliar",
      prose: [
        "Analis itu menulis memo satu halaman: DSO naik 18,0 hari, revenue tumbuh 38,0 persen melawan industri 9 persen, kas operasi turun dari Rp120 miliar menjadi Rp85 miliar sementara laba naik — skor sinyal 3 dari 3. Rekomendasinya: bekukan tambahan limit kredit dan tunda keputusan investasi sampai manajemen menjelaskan. Komite mengikutinya dengan berat hati — emiten itu sedang naik daun dan semua orang ingin ikut.",
        "Enam bulan kemudian restatement terbit: Rp210 miliar revenue diakui terlalu dini. Perusahaan yang mengikuti memo itu menghindari eksposur baru; yang tidak, mencatat kerugian. Memo itu tidak menuduh fraud — ia hanya berkata 'tiga hubungan putus sekaligus, periksa sebelum menambah uang'. Itulah pekerjaan analis fraud: bukan menjadi hakim, melainkan menjadi alarm yang berbunyi sebelum kebakaran.",
        "Satu catatan penting dari memo itu: analis menyertakan pembanding yang jujur — DSO median industri 68 hari dan penjelasan manajemen tahun lalu tentang termin baru. Memo yang hanya membawa angka tanpa pembanding adalah memo yang mudah diabaikan; memo yang membawa pembanding adalah memo yang harus dijawab.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat memo ini bekerja. Pertama, tiga sinyal independen yang semuanya menunjuk arah yang sama — bukan satu rasio. Kedua, skor dan ambang yang sudah disepakati sebelumnya, sehingga eskalasi bukan keputusan emosional. Ketiga, rekomendasi yang proporsional: bekukan tambahan, bukan tuduh fraud.",
      },
      reference: "Skor 3 dari 3 → bekukan tambahan limit. Restatement Rp210 miliar enam bulan kemudian.",
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
        "Tiga skema: revenue dini, biaya disembunyikan, aset digelembungkan.",
        "Lab: DSO 73,0 → 91,0 hari; kenaikan 18,0 hari; piutang/revenue 20,0 persen → 24,9 persen.",
        "Fraud memutus hubungan antar angka: revenue-kas, piutang-penagihan, aset-perputaran.",
        "Skor sinyal: DSO naik lebih dari 10 hari, revenue dua kali industri, kas berlawanan dengan laba.",
        "Sinyal bukan vonis — vonis butuh bukti dokumen dan wawancara (FR27).",
      ],
      next: { label: "FR29 — Benford's Law: Digit Pertama yang Berkhianat", href: "/v2/learn/fr29-benford-law" },
      quiz: [
        {
          q: "Revenue Rp1.000 → Rp1.380 miliar; piutang Rp200 → Rp344 miliar. Berapa DSO kini dan kenaikannya?",
          options: [
            { text: "DSO 91,0 hari, naik 18,0 hari", why: "Tepat: 344/1.380 x 365 = 91,0; 91,0 - 73,0 = 18,0.", correct: true },
            { text: "DSO 73,0 hari, naik 0 hari", why: "Salah: 73,0 adalah DSO tahun lalu, bukan tahun ini." },
            { text: "DSO 125,3 hari, naik 52,3 hari", why: "Salah: itu hasil bila memakai piutang dibagi revenue tanpa dikali 365 dengan benar — cek rumus DSO." },
            { text: "DSO 91,0 hari, naik 91,0 hari", why: "Salah: kenaikan adalah selisih (91,0 - 73,0), bukan nilai DSO kini itu sendiri." },
          ],
        },
        {
          q: "Revenue naik 38 persen tetapi kas operasi turun. Apa bacaan analitik yang benar?",
          options: [
            { text: "Perusahaan sangat sehat — laba naik", why: "Salah: laba tanpa kas adalah tanda bahaya pertama. Laba yang tidak berbentuk uang harus dipertanyakan." },
            { text: "Sinyal bahaya: laba dan kas bergerak berlawanan — periksa pengakuan revenue", why: "Tepat: hubungan revenue-kas yang putus adalah jejak skema revenue dini.", correct: true },
            { text: "Tidak ada arti — kas operasi memang fluktuatif", why: "Salah: fluktuasi biasa tidak membuat kas bergerak berlawanan arah dengan laba yang naik 38 persen." },
            { text: "Bukti fraud — laporkan ke regulator segera", why: "Salah: sinyal bukan vonis. Eskalasi ke investigasi, bukan tuduhan ke regulator." },
          ],
        },
        {
          q: "DSO sebuah emiten naik dari 60 menjadi 78 hari. Menurut skor sinyal lesson ini, apa artinya?",
          options: [
            { text: "Satu poin sinyal — kenaikan 18 hari melewati ambang 10 hari", why: "Tepat: ambang DSO adalah kenaikan lebih dari 10 hari.", correct: true },
            { text: "Bukan sinyal — DSO di bawah 90 hari selalu aman", why: "Salah: tidak ada ambang absolut 90 hari; yang dinilai adalah PERUBAHAN terhadap baseline perusahaan." },
            { text: "Bukti fraud — eskalasi langsung ke pengadilan", why: "Salah: DSO yang naik adalah sinyal untuk diperiksa, bukan bukti untuk pengadilan." },
            { text: "Tidak ada arti tanpa tahu revenue", why: "Salah: DSO sudah mengandung revenue dalam rumusnya (piutang/revenue x 365)." },
          ],
        },
        {
          q: "Emiten A tumbuh 38 persen, industri 9 persen. Apa yang harus dilakukan analis?",
          options: [
            { text: "Langsung beli — pertumbuhan di atas pasar adalah keunggulan", why: "Salah: pertumbuhan jauh di atas pasar butuh penjelasan operasional yang sama jauhnya." },
            { text: "Minta penjelasan operasional dan periksa apakah kas dan piutang mengikuti", why: "Tepat: pertumbuhan tanpa kas dan dengan piutang yang membengkak adalah pola yang harus dijelaskan.", correct: true },
            { text: "Abaikan — pertumbuhan adalah urusan analis ekuitas, bukan analis fraud", why: "Salah: pertumbuhan yang tidak konsisten adalah sinyal fraud paling klasik. Itu urusan analis fraud." },
            { text: "Bandingkan dengan emiten lain yang tumbuh 40 persen", why: "Salah: membandingkan dengan outlier lain tidak menjawab apakah pertumbuhan ini nyata." },
          ],
        },
        {
          q: "Skor sinyal sebuah perusahaan 3 dari 3. Apa rekomendasi yang proporsional?",
          options: [
            { text: "Tuduh manajemen melakukan fraud di laporan publik", why: "Salah: sinyal bukan vonis. Tuduhan tanpa bukti menghancurkan kredibilitas analis." },
            { text: "Bekukan tambahan eksposur dan eskalasi ke investigasi sampai jelas", why: "Tepat: skor 3 berarti bekukan keputusan dan investigasi — proporsional, bukan tuduhan.", correct: true },
            { text: "Tidak melakukan apa-apa — skor hanyalah angka", why: "Salah: skor 3 dari 3 berarti tiga hubungan putus sekaligus. Mengabaikannya adalah kelalaian." },
            { text: "Jual semua posisi dan sebarkan memo ke media", why: "Salah: itu reaksi berlebihan yang tidak proporsional dan berpotensi melanggar aturan." },
          ],
        },
      ],
    },
  ],
};
