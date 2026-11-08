import type { V2Lesson } from "../lib/types";

export const fr29: V2Lesson = {
  slug: "fr29-benford-law",
  track: "Fraud & AML Analytics",
  module: "Deteksi Analitik",
  title: "FR29 — Benford's Law: Digit Pertama yang Berkhianat",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua ratus angka yang terlalu rapi untuk jadi kebetulan",
      prose: [
        "Seorang analis fraud menerima 200 angka klaim biaya dari satu divisi. Sekilas semuanya wajar — Rp1,2 juta, Rp4,7 juta, Rp9,8 juta. Tetapi saat ia menghitung digit pertamanya, sesuatu terasa aneh: digit 9 muncul 24 kali — 12,0 persen dari semua angka — padahal hukum Benford berkata digit 9 seharusnya hanya muncul 4,58 persen. Digit 1 hanya muncul 48 kali (24,0 persen), padahal seharusnya sekitar 30,10 persen. Seseorang mengarang angka — dan ia suka angka 9.",
        "Hukum Benford adalah salah satu alat deteksi paling murah dalam fraud analytics: ia tidak butuh model, tidak butuh label, dan tidak butuh data pembanding. Ia hanya butuh satu fakta matematika — bahwa dalam data alami, digit pertama tidak terdistribusi merata — dan satu perhitungan: seberapa jauh distribusi datamu menyimpang dari yang diharapkan. Lesson ini mengajarkan hukum itu, cara menghitung penyimpangannya (MAD), dan kapan ia boleh dipakai serta kapan tidak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Benford tidak pernah disebut di track FR (pencarian menghasilkan nol). Di FSA Lab, M28 membahas Benford dari sudut forensik laporan keuangan — lesson ini TIDAK menduplikasi M28. Yang dibangun di sini hanyalah sudut deteksi data untuk analis fraud: distribusi digit pertama pada data transaksi dan klaim, perhitungan MAD, dan ambang eskalasi.",
      },
      reference: "200 angka: digit 9 muncul 24 kali (12,0 persen) vs harapan 4,58 persen; digit 1 muncul 48 kali (24,0 persen) vs harapan 30,10 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menguji sekumpulan angka dengan hukum Benford dan memutuskan apakah ia layak diinvestigasi.",
        "(1) Menjelaskan kenapa digit pertama data alami mengikuti Benford;",
        "(2) Menghitung distribusi digit pertama yang diharapkan;",
        "(3) Menghitung Mean Absolute Deviation (MAD) antara observasi dan harapan;",
        "(4) Membaca ambang MAD: konformitas, non-konformitas, dan penyimpangan besar;",
        "(5) Menyebutkan tiga kondisi ketika Benford TIDAK boleh dipakai.",
      ],
      tasks: [],
    },
    {
      id: "hukum",
      eyebrow: "Langkah 3 · Teori",
      title: "Hukumnya: digit 1 muncul 30 persen, digit 9 hanya 4,6 persen",
      prose: [
        "Hukum Benford berkata: dalam banyak kumpulan data alami — nilai transaksi, populasi kota, angka laporan keuangan — digit pertama mengikuti pola tetap. Digit 1 muncul sekitar 30,10 persen, digit 2 sekitar 17,61 persen, digit 3 sekitar 12,49 persen, digit 4 sekitar 9,69 persen, digit 5 sekitar 7,92 persen, digit 6 sekitar 6,69 persen, digit 7 sekitar 5,80 persen, digit 8 sekitar 5,12 persen, dan digit 9 hanya sekitar 4,58 persen. Manusia yang mengarang angka tidak tahu pola ini — mereka mengarang secara merata, atau dengan digit favorit.",
        "Kenapa pola ini muncul? Karena banyak data tumbuh secara multiplikatif — dari 100 ke 1.000, angka itu menghabiskan lebih banyak waktu dengan digit pertama 1 daripada digit 9. Intuisi sederhananya: untuk naik dari 1.000 ke 2.000 butuh kenaikan 100 persen; untuk naik dari 9.000 ke 10.000 hanya butuh 11 persen. Angka 'tinggal' lebih lama di digit kecil.",
        "Dalam data cerita pembuka (200 angka), harapan Benford untuk digit 9 adalah 4,58 persen dari 200 — sekitar 9 angka. Observasinya 24 angka — kelebihan 15 angka. Untuk digit 1, harapannya sekitar 60 angka, observasinya 48 — kekurangan 12 angka. Pola ini — digit 9 membengkak, digit 1 menyusut — adalah tanda tangan klasik angka karangan: pengarang suka angka besar dan menghindari angka 1 yang terasa 'terlalu kecil'.",
      ],
      tasks: [],
      note: {
        title: "Benford hanya untuk digit pertama",
        body: "Lesson ini memakai digit pertama saja — uji yang paling standar dan paling kuat. Ada uji digit kedua dan dua digit pertama, tetapi keduanya butuh sampel lebih besar dan interpretasi yang lebih hati-hati. Kuasai digit pertama dulu; perluasan hanya bila sampelmu di atas 1.000 angka.",
      },
      reference: "Harapan Benford: 1: 30,10 persen; 2: 17,61; 3: 12,49; 4: 9,69; 5: 7,92; 6: 6,69; 7: 5,80; 8: 5,12; 9: 4,58.",
    },
    {
      id: "mad",
      eyebrow: "Langkah 4 · Teori",
      title: "MAD: satu angka untuk seluruh penyimpangan",
      prose: [
        "Mean Absolute Deviation (MAD) merangkum seluruh distribusi menjadi satu angka: rata-rata selisih absolut antara persentase observasi dan persentase harapan, di sembilan digit. Untuk data cerita pembuka: selisihnya adalah 6,10; 2,61; 1,49; 0,69; 0,08; 0,81; 1,20; 1,38; dan 7,42 poin persen. Jumlahnya 21,78; dibagi 9 sama dengan MAD 2,42 persen.",
        "Ambang yang dipakai praktisi (Nigrini): MAD 0 sampai 0,6 persen berarti konformitas dekat — data cocok dengan Benford. MAD 0,6 sampai 1,2 persen berarti konformitas dapat diterima. MAD 1,2 sampai 1,5 persen berarti konformitas marjinal — pantau. MAD di atas 1,5 persen berarti non-konformitas — eskalasi ke investigasi. MAD 2,42 persen pada data cerita pembuka jauh di atas 1,5 persen: non-konformitas yang jelas, dengan digit 9 sebagai kontributor terbesar (7,42 poin).",
        "Tiga kondisi ketika Benford TIDAK boleh dipakai. Pertama, data dengan batas yang ditentukan manusia — harga yang dipatok Rp9.900, atau ambang persetujuan Rp10 juta yang membuat angka menumpuk di bawahnya. Kedua, data yang bukan rentang lebar — nomor invoice berurutan, atau kode yang ditetapkan. Ketiga, sampel terlalu kecil — di bawah 100 angka, noise statistik menenggelamkan sinyal. Uji Benford pada 30 angka adalah ramalan, bukan analisis.",
      ],
      tasks: [],
      note: {
        title: "MAD bukan uji statistik formal",
        body: "MAD adalah ukuran deskriptif, bukan uji hipotesis — ia tidak memberi nilai p. Kelebihannya adalah interpretasinya yang stabil di berbagai ukuran sampel, sementara uji chi-square menjadi terlalu sensitif pada sampel besar. Pakai MAD untuk triase, dan serahkan pembuktian ke investigasi (FR27).",
      },
      reference: "MAD 2,42 persen — di atas ambang non-konformitas 1,5 persen. Digit 9 menyumbang 7,42 poin.",
    },
    {
      id: "lab-benford",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung MAD distribusi digit pertama",
      prose: [
        "Lab ini menghitung MAD dari distribusi digit pertama 200 angka klaim. Hitung dulu di kepala. Selisih absolut per digit: 6,10; 2,61; 1,49; 0,69; 0,08; 0,81; 1,20; 1,38; 7,42. Jumlahnya 21,78. MAD sama dengan 21,78 dibagi 9 sama dengan 2,42 persen. Kelebihan digit 9: 24 dikurangi 9,16 sama dengan 14,84 — sekitar 15 angka.",
        "Tugas lab: isi tiga variabel — mad_pct, kelebihan_d9, dan verdict ('NON-KONFORM' bila MAD di atas 1,5, 'KONFORM' bila tidak) — lalu cetak ketiganya. Tiga output ini adalah memo triase Benford: satu angka penyimpangan, satu digit yang paling menyimpang, dan satu keputusan.",
        "Setelah lolos, coba eksperimen: ubah jumlah digit 9 dari 24 menjadi 10 dan lihat MAD jatuh ke sekitar 1,0 persen — lalu tanyakan: apakah data itu tiba-tiba bersih? Jawabannya: belum tentu — MAD yang baik tidak membuktikan data bersih, ia hanya berkata tidak ada sinyal Benford. Ketidakhadiran sinyal bukan bukti ketidakhadiran fraud.",
      ],
      tasks: [
        { id: "t1", text: "Hitung MAD dalam persen (rata-rata selisih absolut)" },
        { id: "t2", text: "Hitung kelebihan jumlah digit 9 dibanding harapan" },
        { id: "t3", text: "Tentukan verdict dari ambang MAD 1,5 persen" },
      ],
      expected: "mad_pct=2.42\nkelebihan_d9=14.84\nverdict=NON-KONFORM",
      hints: [
        "Selisih = nilai absolut (observasi dikurangi harapan) per digit.",
        "MAD = jumlah selisih dibagi 9.",
        "Harapan digit 9 = 4,58 persen dari 200 angka.",
      ],
      code: {
        starter: "# Distribusi digit pertama 200 angka klaim (persen). JANGAN UBAH.\nharapan = [30.10, 17.61, 12.49, 9.69, 7.92, 6.69, 5.80, 5.12, 4.58]\nobservasi = [24.0, 15.0, 11.0, 9.0, 8.0, 7.5, 7.0, 6.5, 12.0]\njumlah_d9 = 24\ntotal = 200\n\n# TULIS KODEMU: MAD, kelebihan digit 9, verdict\nmad_pct = \nkelebihan_d9 = \nverdict = \nprint(f\"mad_pct={round(mad_pct, 2)}\")\nprint(f\"kelebihan_d9={round(kelebihan_d9, 2)}\")\nprint(f\"verdict={verdict}\")",
        lockLines: 6,
        solution: "# Distribusi digit pertama 200 angka klaim (persen). JANGAN UBAH.\nharapan = [30.10, 17.61, 12.49, 9.69, 7.92, 6.69, 5.80, 5.12, 4.58]\nobservasi = [24.0, 15.0, 11.0, 9.0, 8.0, 7.5, 7.0, 6.5, 12.0]\njumlah_d9 = 24\ntotal = 200\n\n# TULIS KODEMU: MAD, kelebihan digit 9, verdict\nselisih = [abs(o - h) for o, h in zip(observasi, harapan)]\nmad_pct = sum(selisih) / len(selisih)\nkelebihan_d9 = jumlah_d9 - harapan[8] / 100 * total\nverdict = \"NON-KONFORM\" if mad_pct > 1.5 else \"KONFORM\"\nprint(f\"mad_pct={round(mad_pct, 2)}\")\nprint(f\"kelebihan_d9={round(kelebihan_d9, 2)}\")\nprint(f\"verdict={verdict}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "mad_pct=2.42", label: "MAD 2,42 persen", msg: "Jumlah selisih 21,78 / 9 = 2,42. Di atas ambang 1,5 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "kelebihan_d9=14.84", label: "Kelebihan digit 9: 14,84 angka", msg: "24 - (4,58 persen dari 200 = 9,16) = 14,84. Digit 9 adalah kontributor terbesar." },
          { kind: "stdout_matches", task: "t3", pattern: "verdict=NON-KONFORM", label: "Verdict NON-KONFORM", msg: "MAD 2,42 di atas 1,5 = non-konformitas. Eskalasi ke investigasi." },
        ],
      },
      reference: "MAD 2,42 persen; kelebihan digit 9: 14,84 angka; verdict NON-KONFORM.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: divisi yang suka angka 9",
      prose: [
        "Investigasi menemukan polanya: staf divisi itu mengarang klaim biaya dengan angka yang 'terlihat wajar' — Rp9,8 juta, Rp9,4 juta, Rp9,1 juta — karena angka 9 terasa besar tetapi masih di bawah ambang persetujuan Rp10 juta. Mereka tidak tahu bahwa justru pilihan itu yang mengkhianati mereka: digit 9 yang seharusnya 4,58 persen muncul 12,0 persen.",
        "Total kerugian yang terungkap: Rp187 juta dari 24 klaim yang digit pertamanya 9 dan tidak punya dokumen pendukung. Bukan kasus terbesar tahun itu — tetapi kasus termurah yang pernah diungkap: biaya deteksinya hanya satu perhitungan MAD atas data yang sudah ada. Tidak ada model yang dilatih, tidak ada label yang dikumpulkan, tidak ada vendor yang dibayar.",
        "Sejak itu, uji Benford berjalan otomatis tiap bulan atas semua klaim biaya, dengan MAD di atas 1,5 persen memicu review manual. Tiga bulan pertama, dua divisi lain memicu ambang — satu ternyata pola harga yang dipatok (Benford tidak berlaku), satu lagi ternyata klaim ganda. Pelajaran yang dicatat: Benford adalah alarm asap, bukan pemadam — ia berkata 'lihat ke sini', dan manusia yang memutuskan apakah ada api.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat kasus ini berhasil. Pertama, sampel cukup besar (200 angka) sehingga sinyalnya nyata. Kedua, MAD dipakai dengan ambang yang sudah disepakati (1,5 persen), bukan ditebak setelah melihat hasil. Ketiga, temuan Benford diikuti investigasi dokumen — bukan vonis langsung dari angka.",
      },
      reference: "Rp187 juta dari 24 klaim digit 9 tanpa dokumen. Uji Benford kini otomatis bulanan.",
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
        "Harapan Benford: digit 1 sekitar 30,10 persen; digit 9 hanya 4,58 persen.",
        "Lab: MAD 2,42 persen; kelebihan digit 9: 14,84 angka; verdict NON-KONFORM.",
        "Ambang MAD: 0–0,6 konformitas dekat; 1,2–1,5 marjinal; di atas 1,5 non-konformitas.",
        "Benford TIDAK berlaku: harga yang dipatok, nomor berurutan, sampel di bawah 100.",
        "MAD yang baik tidak membuktikan data bersih — hanya tidak ada sinyal Benford.",
      ],
      next: { label: "FR30 — Synthetic Data & GAN: Data Palsu yang Berguna", href: "/v2/learn/fr30-synthetic-data-gan" },
      quiz: [
        {
          q: "200 angka klaim: selisih absolut observasi vs harapan per digit berjumlah 21,78 poin. Berapa MAD-nya dan apa verdictnya?",
          options: [
            { text: "MAD 2,42 persen — NON-KONFORM", why: "Tepat: 21,78 / 9 = 2,42, di atas ambang 1,5 persen.", correct: true },
            { text: "MAD 21,78 persen — NON-KONFORM", why: "Salah: 21,78 adalah JUMLAH selisih, bukan rata-ratanya. MAD membagi dengan 9." },
            { text: "MAD 2,42 persen — KONFORM", why: "Salah: 2,42 di atas ambang non-konformitas 1,5 persen." },
            { text: "MAD 0,24 persen — konformitas dekat", why: "Salah: 0,24 adalah hasil bila membagi 21,78 dengan 90, bukan 9." },
          ],
        },
        {
          q: "Digit 9 muncul 24 kali dari 200 angka. Berapa kelebihannya dibanding harapan Benford?",
          options: [
            { text: "Sekitar 15 angka — harapan 9,16, observasi 24", why: "Tepat: 4,58 persen dari 200 = 9,16; 24 - 9,16 = 14,84.", correct: true },
            { text: "24 angka — semua kemunculan digit 9 adalah kelebihan", why: "Salah: digit 9 memang diharapkan muncul sekitar 9 kali. Kelebihan adalah selisihnya." },
            { text: "Sekitar 5 angka", why: "Salah: 5 adalah hasil bila harapan dihitung dari 100 angka, bukan 200." },
            { text: "Tidak ada kelebihan — 12 persen masih wajar", why: "Salah: 12,0 persen hampir tiga kali harapan 4,58 persen." },
          ],
        },
        {
          q: "Kapan uji Benford TIDAK boleh dipakai?",
          options: [
            { text: "Data klaim biaya 200 angka dari satu divisi", why: "Salah: ini justru kasus ideal — sampel cukup, rentang lebar, tanpa patokan harga." },
            { text: "Harga yang dipatok Rp9.900 dan nomor invoice berurutan", why: "Tepat: harga yang dipatok dan nomor berurutan bukan data alami — Benford tidak berlaku.", correct: true },
            { text: "Data transaksi 5.000 baris selama setahun", why: "Salah: sampel besar dengan rentang lebar adalah kondisi terbaik untuk Benford." },
            { text: "Angka laporan keuangan emiten publik", why: "Salah: angka laporan keuangan adalah aplikasi klasik Benford." },
          ],
        },
        {
          q: "MAD sebuah dataset 0,4 persen. Apa bacaan yang benar?",
          options: [
            { text: "Data terbukti bersih dari fraud", why: "Salah: MAD yang baik hanya berkata tidak ada sinyal Benford — bukan bukti tidak ada fraud." },
            { text: "Konformitas dekat — tidak ada sinyal Benford, lanjutkan pemantauan biasa", why: "Tepat: 0,4 persen di bawah 0,6 persen berarti konformitas dekat.", correct: true },
            { text: "Non-konformitas — eskalasi segera", why: "Salah: ambang non-konformitas adalah 1,5 persen, bukan 0,4." },
            { text: "Sampel terlalu kecil untuk disimpulkan", why: "Salah: MAD tidak berkata apa-apa tentang ukuran sampel; kecilnya sampel adalah masalah terpisah." },
          ],
        },
        {
          q: "Kenapa manusia yang mengarang angka cenderung ketahuan oleh Benford?",
          options: [
            { text: "Karena mereka selalu memakai angka bulat", why: "Salah: angka bulat adalah sinyal lain. Benford menangkap distribusi digit pertama, bukan kebulatan." },
            { text: "Karena mereka mengarang secara merata atau dengan digit favorit, sementara data alami mengikuti pola Benford", why: "Tepat: pengarang tidak tahu digit 1 harus 30 persen dan digit 9 hanya 4,6 persen.", correct: true },
            { text: "Karena mereka tidak bisa berhitung", why: "Salah: ini bukan soal kemampuan berhitung — ini soal distribusi yang tidak mereka ketahui." },
            { text: "Karena Benford mendeteksi semua jenis fraud", why: "Salah: Benford hanya mendeteksi angka karangan pada data yang memenuhi syaratnya — bukan semua fraud." },
          ],
        },
      ],
    },
  ],
};
