import type { V2Lesson } from "../lib/types";

export const mk29: V2Lesson = {
  slug: "mk29-conjoint-analysis",
  track: "Marketing Analytics",
  module: "Pricing & Promo",
  title: "MK29 — Conjoint Analysis: Mengukur Nilai Fitur dari Pilihan Pelanggan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Harga turun atau kamera naik? Tim produk menebak, pasar yang menjawab",
      prose: [
        "Tim produk ponsel KirimPhone berdebat. Satu kubu ingin menurunkan harga dari Rp7 juta ke Rp5 juta. Kubu lain ingin menaikkan kamera dari 48MP ke 108MP dengan harga tetap. Keduanya mengklaim tahu apa yang pelanggan mau — keduanya berdasarkan firasat dan satu-dua komentar di media sosial.",
        "Tim analis mengusulkan conjoint analysis: bukan bertanya langsung apa yang pelanggan mau — karena orang pandai merasionalisasi — melainkan menyodorkan delapan paket ponsel berbeda dan meminta pelanggan menilai tiap paket. Dari penilaian itu, analis menghitung berapa nilai yang pelanggan tempatkan pada tiap fitur, dan berapa rupiah nilai itu setara.",
        "Hasilnya mengejutkan kedua kubu: harga memang atribut terpenting (55 persen), tetapi kamera 108MP bernilai Rp2.181.818 bagi pelanggan — lebih dari separuh selisih harga yang diperdebatkan. Keputusan akhirnya: harga tetap Rp5 juta, kamera naik ke 108MP, dan baterai 6.000 mAh sebagai bonus yang murah. Lesson ini mengajarkan conjoint dari nol sampai keputusan harga.",
      ],
      tasks: [],
      note: {
        title: "Kenapa bukan survei biasa",
        body: "Bertanya langsung 'apakah kamera penting?' hampir selalu dijawab 'penting' — semua fitur penting bila ditanya satu per satu. Conjoint memaksa trade-off: pelanggan harus memilih antara kamera bagus dengan harga mahal, atau kamera biasa dengan harga murah. Trade-off itulah yang mengungkap nilai sebenarnya. MK14 sudah membahas pricing dan promo; lesson ini menambah alat ukur nilai fitur yang belum ada di track MK mana pun.",
      },
      reference: "Harga 55 persen, kamera 30 persen, baterai 15 persen. Kamera 108MP bernilai Rp2.181.818.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dan membaca conjoint analysis — dan mengubah hasilnya menjadi keputusan harga.",
        "(1) Membedakan conjoint rating, ranking, dan choice-based (CBC);",
        "(2) Merancang profil dari atribut dan level tanpa membebani responden;",
        "(3) Menghitung part-worth utility dan importance dari data penilaian;",
        "(4) Mengubah utility menjadi willingness-to-pay dalam rupiah;",
        "(5) Mengenali jebakan desain: terlalu banyak atribut, level yang tidak realistis, dan sampel yang salah.",
      ],
      tasks: [],
    },
    {
      id: "desain",
      eyebrow: "Langkah 3 · Teori",
      title: "Merancang conjoint: atribut, level, dan profil",
      prose: [
        "Conjoint dimulai dari atribut dan level. Atribut adalah dimensi yang pelanggan pertimbangkan: harga, baterai, kamera. Level adalah nilai yang mungkin: harga Rp3 juta, Rp5 juta, Rp7 juta; baterai 4.000 atau 6.000 mAh; kamera 48MP atau 108MP. Kombinasi penuh — full factorial — adalah 3 dikali 2 dikali 2 sama dengan 12 profil. Dua belas profil masih bisa dinilai satu responden; tetapi dengan 5 atribut dan 4 level, kombinasinya ratusan — responden lelah dan jawabannya asal-asalan.",
        "Solusinya desain fraksional: pilih sebagian profil yang tetap memungkinkan estimasi tiap efek — biasanya 8 sampai 16 profil untuk studi rating. Delapan profil di cerita pembuka dipilih seimbang: tiap level harga muncul 2 sampai 3 kali, tiap level baterai dan kamera muncul 4 kali. Keseimbangan ini penting: bila harga Rp3 juta selalu berpasangan dengan kamera 108MP, tidak ada cara tahu apakah rating tinggi berasal dari harga atau dari kamera.",
        "Tiga varian conjoint yang perlu dikenal. Rating-based: responden memberi skor 1 sampai 10 pada tiap profil — paling mudah dianalisis, dipakai di lesson ini. Ranking: responden mengurutkan profil dari yang paling disukai — memaksa trade-off lebih keras, tetapi analisisnya lebih rumit. Choice-based conjoint (CBC): responden memilih satu dari tiga paket yang ditawarkan, diulang berkali-kali — paling mirip belanja nyata, dan standar industri untuk studi harga. Pilihannya ditentukan pertanyaan: rating untuk memahami nilai, CBC untuk memprediksi pangsa pasar.",
        "Aturan desain yang tidak boleh dilanggar: atribut maksimal 5 sampai 6; level tiap atribut realistis dan bisa diproduksi — level 'kamera 500MP' yang tidak ada di pasaran menghasilkan utility untuk produk khayalan; dan selalu sertakan opsi 'tidak membeli' di CBC — tanpanya, pangsa pasar terhitung dari orang yang sebenarnya tidak akan membeli.",
      ],
      tasks: [],
      note: {
        title: "Utility itu relatif, bukan absolut",
        body: "Part-worth utility tidak punya satuan dan tidak bisa dibandingkan antar studi — utility 2,0 di studi ponsel tidak berarti apa-apa di studi kopi. Yang bermakna adalah perbandingan di dalam satu studi: selisih antar level, dan importance relatif. Jangan pernah mengutip utility tanpa menyebut studi dan level pembandingnya.",
      },
      reference: "Full factorial 3 x 2 x 2 = 12 profil. Desain fraksional: 8 profil yang seimbang.",
    },
    {
      id: "utility",
      eyebrow: "Langkah 4 · Teori",
      title: "Part-worth utility dan importance: membaca nilai dari rating",
      prose: [
        "Model conjoint menganggap rating sebuah profil adalah jumlah dari nilai tiap levelnya ditambah rata-rata umum. Ditulis sebagai rumus: rating sama dengan rata-rata umum ditambah utility harga ditambah utility baterai ditambah utility kamera. Utility tiap level — part-worth — dihitung dari rata-rata rating semua profil yang memakai level itu, dikurangi rata-rata umum.",
        "Delapan profil di cerita pembuka, dengan rating 1 sampai 10. Rata-rata umum: jumlah rating 52 dibagi 8 sama dengan 6,5. Harga Rp3 juta muncul di 3 profil dengan rating 7, 10, dan 8 — rata-rata 25 dibagi 3 sama dengan 8,33; part-worth-nya 8,33 dikurangi 6,5 sama dengan 1,83. Harga Rp5 juta: rating 6 dan 7, rata-rata 6,5; part-worth 0,0. Harga Rp7 juta: rating 3, 6, dan 5, rata-rata 14 dibagi 3 sama dengan 4,67; part-worth 4,67 dikurangi 6,5 sama dengan negatif 1,83.",
        "Baterai 4.000 mAh: rating 7, 6, 3, 8 — rata-rata 6,0; part-worth negatif 0,5. Baterai 6.000 mAh: rating 10, 7, 6, 5 — rata-rata 7,0; part-worth positif 0,5. Kamera 48MP: rating 7, 7, 3, 5 — rata-rata 5,5; part-worth negatif 1,0. Kamera 108MP: rating 10, 6, 6, 8 — rata-rata 7,5; part-worth positif 1,0.",
        "Importance dihitung dari rentang utility tiap atribut. Rentang harga: 8,33 dikurangi 4,67 sama dengan 3,67. Rentang baterai: 7,0 dikurangi 6,0 sama dengan 1,0. Rentang kamera: 7,5 dikurangi 5,5 sama dengan 2,0. Total rentang: 3,67 ditambah 1,0 ditambah 2,0 sama dengan 6,67. Importance harga: 3,67 dibagi 6,67 sama dengan 55,0 persen. Baterai: 1,0 dibagi 6,67 sama dengan 15,0 persen. Kamera: 2,0 dibagi 6,67 sama dengan 30,0 persen.",
        "Dari utility lahir willingness-to-pay. Selisih harga Rp3 juta ke Rp7 juta — Rp4.000.000 — setara dengan utility 11/3 (ditampilkan 3,67). Maka satu unit utility setara dengan 4.000.000 dibagi 11/3, dan kamera 108MP yang utility-nya 2,0 di atas 48MP bernilai 2,0 dibagi 11/3 dikali 4.000.000 sama dengan Rp2.181.818. Baterai 6.000 mAh bernilai 1,0 dibagi 11/3 dikali 4.000.000 sama dengan Rp1.090.909. Dua angka inilah yang memutuskan debat tim produk: menaikkan kamera 'seharga' Rp2,18 juta di mata pelanggan, tetapi biaya produksinya jauh lebih kecil.",
      ],
      tasks: [],
      formula: "U = \\mu + u_{harga} + u_{baterai} + u_{kamera}",
      formulaNote: "Rating profil = rata-rata umum + jumlah part-worth tiap levelnya. Importance = rentang atribut dibagi total rentang.",
      note: {
        title: "Prediksi profil baru",
        body: "Model ini bisa memprediksi rating profil yang tidak diuji: profil Rp5 juta, baterai 6.000, kamera 108MP diprediksi 6,5 ditambah 0,0 ditambah 0,5 ditambah 1,0 sama dengan 8,0. Prediksi 8,0 dari 10 untuk paket yang belum pernah ditawarkan — itulah alasan tim produk berani meluncurkan paket itu.",
      },
      reference: "Part-worth = rata-rata level dikurangi rata-rata umum. WTP kamera Rp2.181.818; baterai Rp1.090.909.",
    },
    {
      id: "lab-conjoint",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin part-worth dan importance",
      prose: [
        "Lab ini membangun mesin conjoint kecil: dari delapan profil dan ratingnya, hitung rentang utility harga, importance tiap atribut, dan prediksi rating profil baru.",
        "Hitung dulu di kepala. Rata-rata umum 6,5. Rata-rata harga Rp3 juta 8,33; Rp7 juta 4,67; rentang harga 8,33 dikurangi 4,67 sama dengan 3,67. Total rentang 6,67. Importance harga 3,67 dibagi 6,67 dikali 100 sama dengan 55,0 persen; baterai 15,0 persen; kamera 30,0 persen. Prediksi profil Rp5 juta, baterai 6.000, kamera 108MP: 6,5 ditambah 0,0 ditambah 0,5 ditambah 1,0 sama dengan 8,0.",
        "Tugas lab: tulis fungsi yang menerima daftar profil (harga, baterai, kamera, rating) dan profil baru — lalu mencetak lima angka: harga_range, penting_harga, penting_baterai, penting_kamera, prediksi. Fungsi ini — bukan angkanya — adalah yang dibawa pulang: pola yang sama dipakai untuk conjoint apa pun, dari ponsel sampai paket langganan.",
        "Setelah lolos, coba eksperimen: ubah rating profil 2 dari 10 menjadi 7 dan lihat importance harga turun — lalu tanyakan: satu responden yang menjawab asal-asalan bisa menggeser keputusan harga berapa besar? Jawabannya ada di langkah berikutnya: itulah kenapa sampel dan pembersihan data responden tidak boleh diabaikan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung rata-rata rating per level dan rentang utility harga" },
        { id: "t2", text: "Hitung importance tiap atribut dari total rentang" },
        { id: "t3", text: "Prediksi rating profil baru dari part-worth tiap levelnya" },
      ],
      expected: "harga_range=3.67\npenting_harga=55.0\npenting_baterai=15.0\npenting_kamera=30.0\nprediksi=8.0",
      hints: [
        "Rata-rata umum = jumlah semua rating dibagi 8.",
        "Part-worth level = rata-rata rating profil berlevel itu dikurangi rata-rata umum.",
        "Rentang atribut = rata-rata level tertinggi dikurangi rata-rata level terendah.",
        "Importance = rentang atribut dibagi total rentang, dikali 100.",
        "Prediksi = rata-rata umum + jumlah part-worth level profil baru.",
      ],
      code: {
        starter: `# Delapan profil conjoint: (harga_jt, baterai, kamera, rating).\nprofil = [\n    (3, 4000, 48, 7),\n    (3, 6000, 108, 10),\n    (5, 4000, 108, 6),\n    (5, 6000, 48, 7),\n    (7, 4000, 48, 3),\n    (7, 6000, 108, 6),\n    (3, 4000, 108, 8),\n    (7, 6000, 48, 5),\n]\nbaru = (5, 6000, 108)  # profil baru yang diprediksi\n\n# TULIS KODEMU: hitung lima angka conjoint di bawah ini.\n# Cetak, per baris: harga_range, penting_harga, penting_baterai,\n# penting_kamera, prediksi.\n\n\nmesin_conjoint(profil, baru)`,
        lockLines: 11,
        solution: `# Delapan profil conjoint: (harga_jt, baterai, kamera, rating).\nprofil = [\n    (3, 4000, 48, 7),\n    (3, 6000, 108, 10),\n    (5, 4000, 108, 6),\n    (5, 6000, 48, 7),\n    (7, 4000, 48, 3),\n    (7, 6000, 108, 6),\n    (3, 4000, 108, 8),\n    (7, 6000, 48, 5),\n]\nbaru = (5, 6000, 108)  # profil baru yang diprediksi\n\n\ndef rata_level(profil, kolom, nilai):\n    ratings = [p[3] for p in profil if p[kolom] == nilai]\n    return sum(ratings) / len(ratings)\n\n\ndef mesin_conjoint(profil, baru):\n    umum = sum(p[3] for p in profil) / len(profil)\n    harga = {h: rata_level(profil, 0, h) for h in (3, 5, 7)}\n    baterai = {b: rata_level(profil, 1, b) for b in (4000, 6000)}\n    kamera = {k: rata_level(profil, 2, k) for k in (48, 108)}\n    range_harga = max(harga.values()) - min(harga.values())\n    range_baterai = max(baterai.values()) - min(baterai.values())\n    range_kamera = max(kamera.values()) - min(kamera.values())\n    total = range_harga + range_baterai + range_kamera\n    prediksi = umum + (harga[baru[0]] - umum) + (baterai[baru[1]] - umum) + (kamera[baru[2]] - umum)\n    print(f"harga_range={round(range_harga, 2)}")\n    print(f"penting_harga={round(range_harga / total * 100, 1)}")\n    print(f"penting_baterai={round(range_baterai / total * 100, 1)}")\n    print(f"penting_kamera={round(range_kamera / total * 100, 1)}")\n    print(f"prediksi={round(prediksi, 1)}")\n\n\nmesin_conjoint(profil, baru)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "harga_range=3.67", label: "Rentang harga 3,67", msg: "Rata-rata harga 3jt 8,33 dikurangi rata-rata harga 7jt 4,67 = 3,67. Periksa pembagian per level." },
          { kind: "stdout_matches", task: "t2", pattern: "penting_harga=55.0", label: "Importance harga 55,0 persen", msg: "3,67 / 6,67 x 100 = 55,0. Total rentang = 3,67 + 1,0 + 2,0 = 6,67." },
          { kind: "stdout_matches", task: "t2", pattern: "penting_kamera=30.0", label: "Importance kamera 30,0 persen", msg: "2,0 / 6,67 x 100 = 30,0. Kamera adalah atribut kedua terpenting." },
          { kind: "stdout_matches", task: "t3", pattern: "prediksi=8.0", label: "Prediksi profil baru 8,0", msg: "6,5 + 0,0 + 0,5 + 1,0 = 8,0. Part-worth dihitung dari rata-rata level dikurangi rata-rata umum." },
        ],
      },
      reference: "Rentang harga 3,67; importance 55,0 / 15,0 / 30,0 persen; prediksi profil baru 8,0.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 6 · Teori",
      title: "Jebakan desain dan membaca hasil dengan jujur",
      prose: [
        "Jebakan pertama: responden yang menjawab asal-asalan. Tanda-tandanya: semua profil diberi rating sama, atau rating berurutan 10, 9, 8 tanpa membaca — pola yang terlalu rapi untuk manusia yang sungguh mempertimbangkan. Praktik standar: sertakan dua profil identik yang terselip di posisi berbeda; responden yang memberi rating berbeda lebih dari 2 poin pada profil yang sama dikeluarkan dari analisis. Di studi delapan profil, satu responden asal-asalan dari 100 bisa menggeser importance harga beberapa poin — dan keputusan harga ikut bergeser.",
        "Jebakan kedua: level yang tidak realistis atau tidak bisa diproduksi. Utility untuk 'kamera 500MP seharga Rp3 juta' mungkin sangat tinggi — tetapi produk itu tidak ada, dan utility-nya tidak bisa dipakai untuk keputusan apa pun. Setiap level harus lolos uji produksi: bisakah dibuat, berapa biayanya, dan apakah legal dijual?",
        "Jebakan ketiga: lupa bahwa importance bergantung pada rentang level yang dipilih. Bila level harga yang diuji hanya Rp5 juta dan Rp5,5 juta, rentang utility harga mengecil dan importance-nya tampak kecil — bukan karena harga tidak penting, melainkan karena variasinya sempit. Importance selalu dibaca bersama rentang levelnya: 'harga 55 persen penting, pada rentang Rp3 juta sampai Rp7 juta'. Tanpa rentang, angka importance menyesatkan.",
        "Jebakan keempat: memakai conjoint rating untuk memprediksi pangsa pasar. Rating 8,0 untuk profil baru bukan berarti 80 persen orang akan membelinya — rating bukan probabilitas beli. Untuk pangsa pasar, gunakan CBC dengan opsi tidak membeli, lalu hitung pilihan dengan model logit. Conjoint rating menjawab 'berapa nilai fitur ini'; CBC menjawab 'berapa yang akan memilih paket ini'. Dua pertanyaan berbeda, dua alat berbeda.",
      ],
      tasks: [],
      note: {
        title: "Sampel: siapa yang menjawab",
        body: "Conjoint dari 100 mahasiswa tidak mewakili pembeli ponsel Rp7 juta. Sampel harus mewakili pembeli: rekrut dari mereka yang membeli ponsel dalam 12 bulan terakhir, dengan kuota segmen harga. Hasil conjoint yang sampelnya salah adalah keputusan harga yang salah dengan angka yang meyakinkan.",
      },
      reference: "Profil identik terselip = detektor asal-asalan. Importance selalu dibaca bersama rentang level.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: kamera naik atau harga turun?",
      prose: [
        "Kembali ke debat tim produk. Kubu harga turun mengusulkan Rp7 juta menjadi Rp5 juta: utility naik dari negatif 1,83 menjadi 0,0 — kenaikan 1,83. Kubu kamera naik mengusulkan kamera 48MP menjadi 108MP dengan harga tetap: utility naik dari negatif 1,0 menjadi positif 1,0 — kenaikan 2,0. Kenaikan utility kamera lebih besar daripada kenaikan utility turun harga — dan biaya menaikkan kamera jauh lebih kecil daripada memotong Rp2.000.000 dari harga tiap unit.",
        "Keputusan: harga tetap Rp5 juta, kamera 108MP, baterai 6.000 mAh — profil yang diprediksi rating 8,0. (Bukan yang tertinggi: kombinasi Rp3 juta–6.000–108MP diprediksi 6,5 + 1,83 + 0,5 + 1,0 = 9,83, dan satu profil yang diuji sudah mendapat rating 10.) WTP-nya membenarkan: pelanggan menilai kamera 108MP sebesar Rp2.181.818 dan baterai 6.000 mAh sebesar Rp1.090.909 — total nilai tambah Rp3.272.727 untuk paket yang biaya tambahannya hanya sebagian kecil dari itu.",
        "Tiga bulan setelah peluncuran, pangsa paket itu 34 persen dari penjualan — tertinggi di lini. Bukan karena conjoint meramal masa depan, melainkan karena conjoint mengukur trade-off sebelum uang dikeluarkan. Debat yang tadinya soal firasat berubah menjadi soal angka — dan angka itu bisa diuji ulang kapan pun.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Bandingkan kenaikan utility, bukan level utility: turun harga memberi 1,83; naik kamera memberi 2,0. Keputusan yang benar adalah yang memberi utility terbesar per rupiah biaya — dan di sini kamera menang di kedua sisi: utility lebih besar, biaya lebih kecil.",
      },
      reference: "Naik kamera +2,0 utility; turun harga +1,83. Paket pemenang diprediksi 8,0 dan meraih 34 persen pangsa.",
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
        "Conjoint memaksa trade-off: nilai fitur terungkap dari pilihan, bukan dari pertanyaan langsung.",
        "Part-worth = rata-rata level dikurangi rata-rata umum; importance = rentang dibagi total rentang.",
        "Lab: rentang harga 3,67; importance 55,0 / 15,0 / 30,0 persen; prediksi profil baru 8,0.",
        "WTP kamera 108MP Rp2.181.818; baterai 6.000 mAh Rp1.090.909.",
        "Importance selalu dibaca bersama rentang level; rating bukan probabilitas beli.",
      ],
      next: { label: "MK30 — Riset Pasar dan Analisis Survei: dari Kuesioner ke Keputusan", href: "/v2/learn/mk30-riset-pasar-survei" },
      quiz: [
        {
          q: "Kenapa conjoint lebih dipercaya daripada bertanya langsung 'apakah kamera penting?'",
          options: [
            { text: "Karena conjoint lebih murah dan lebih cepat dari survei biasa", why: "Salah: conjoint justru lebih mahal dan lebih rumit. Alasannya bukan biaya, melainkan validitas." },
            { text: "Karena conjoint memaksa trade-off — pelanggan harus memilih antara kamera bagus-harga mahal atau kamera biasa-harga murah", why: "Tepat: pertanyaan langsung membuat semua fitur 'penting'. Trade-off mengungkap nilai sebenarnya.", correct: true },
            { text: "Karena conjoint tidak butuh responden sama sekali", why: "Salah: conjoint tetap butuh responden yang menilai profil. Tanpa responden, tidak ada utility." },
            { text: "Karena conjoint selalu menghasilkan pangsa pasar yang akurat", why: "Salah: rating conjoint bukan probabilitas beli. Pangsa pasar butuh CBC dengan opsi tidak membeli." },
          ],
        },
        {
          q: "Rata-rata umum 6,5; rata-rata harga Rp3 juta 8,33; rata-rata harga Rp7 juta 4,67. Berapa rentang utility harga?",
          options: [
            { text: "1,83 — selisih part-worth tertinggi dari nol", why: "Salah: 1,83 adalah part-worth harga Rp3 juta. Rentang adalah selisih rata-rata tertinggi dan terendah." },
            { text: "3,67 — 8,33 dikurangi 4,67", why: "Tepat: rentang = rata-rata level tertinggi dikurangi rata-rata level terendah.", correct: true },
            { text: "6,67 — total semua rentang atribut", why: "Salah: 6,67 adalah total rentang ketiga atribut, bukan rentang harga saja." },
            { text: "0,0 — harga Rp5 juta netral sehingga rentangnya nol", why: "Salah: level netral tidak menghapus rentang. Rentang dihitung dari level tertinggi dan terendah." },
          ],
        },
        {
          q: "Importance harga 55 persen pada rentang Rp3 juta sampai Rp7 juta. Studi kedua menguji harga Rp5 juta sampai Rp5,5 juta dan importance harga menjadi 12 persen. Apa kesimpulan yang benar?",
          options: [
            { text: "Harga menjadi tidak penting bagi pelanggan di studi kedua", why: "Salah: importance mengecil karena rentang level menyempit, bukan karena harga kehilangan pentingnya." },
            { text: "Importance bergantung pada rentang level yang diuji — rentang sempit menghasilkan importance kecil", why: "Tepat: importance selalu dibaca bersama rentangnya. Tanpa rentang, angka importance menyesatkan.", correct: true },
            { text: "Studi kedua salah total dan harus dibuang", why: "Salah: studi kedua sah untuk pertanyaan sempitnya — seberapa sensitif pelanggan pada perubahan Rp500 ribu. Ia hanya tidak bisa dibandingkan langsung." },
            { text: "Utility harga berubah-ubah sehingga conjoint tidak bisa dipercaya", why: "Salah: utility memang relatif terhadap desain studi. Itu sifat metode, bukan cacatnya." },
          ],
        },
        {
          q: "WTP kamera 108MP dihitung Rp2.181.818. Apa arti angka itu?",
          options: [
            { text: "Biaya produksi kamera 108MP adalah Rp2.181.818", why: "Salah: WTP adalah nilai di mata pelanggan, bukan biaya produksi. Biaya produksi jauh lebih kecil — itulah margin keputusannya." },
            { text: "Pelanggan menilai kenaikan kamera 48MP ke 108MP setara dengan Rp2.181.818", why: "Tepat: utility 2,0 dibagi rentang harga 3,67 dikali selisih harga Rp4.000.000.", correct: true },
            { text: "Harga jual ponsel harus naik Rp2.181.818", why: "Salah: WTP adalah batas atas nilai, bukan perintah menaikkan harga. Keputusan harga mempertimbangkan biaya dan kompetisi juga." },
            { text: "Semua pelanggan akan membayar Rp2.181.818 lebih mahal", why: "Salah: WTP adalah rata-rata. Sebagian pelanggan menilai lebih, sebagian kurang — distribusinya penting untuk segmentasi." },
          ],
        },
        {
          q: "Profil baru Rp5 juta, baterai 6.000, kamera 108MP diprediksi rating 8,0. Apa yang TIDAK boleh disimpulkan?",
          options: [
            { text: "Paket itu diprediksi mendapat rating 8,0", why: "Salah: itu boleh disimpulkan — model memang memprediksi 8,0 (6,5 + 0,0 + 0,5 + 1,0). Yang TIDAK boleh disimpulkan adalah \"paling disukai\": kombinasi Rp3 juta–6.000–108MP diprediksi 9,83, dan satu profil yang diuji sudah mendapat rating 10." },
            { text: "80 persen pelanggan akan membeli paket itu", why: "Tepat: rating 8,0 dari 10 bukan probabilitas beli 80 persen. Pangsa pasar butuh CBC dengan opsi tidak membeli.", correct: true },
            { text: "Kamera dan baterai menambah utility dibanding profil dasar", why: "Salah: itu boleh disimpulkan — part-worth keduanya positif." },
            { text: "Harga Rp5 juta netral dalam model ini", why: "Salah: itu boleh disimpulkan — part-worth harga Rp5 juta adalah 0,0." },
          ],
        },
      ],
    },
  ],
};
