import type { V2Lesson } from "../lib/types";

export const mk30: V2Lesson = {
  slug: "mk30-riset-pasar-survei",
  track: "Marketing Analytics",
  module: "Riset Pasar",
  title: "MK30 — Riset Pasar dan Analisis Survei: dari Kuesioner ke Keputusan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "NPS 34 yang hampir menyesatkan direksi",
      prose: [
        "Kedai kopi Senja mengundang 2.000 pelanggan untuk survei kepuasan. Yang menjawab 385 orang — response rate 19,25 persen. Hasilnya: NPS 34, kepuasan rata-rata 3,9 dari 5. Direksi hampir merayakan — sampai analis bertanya satu kalimat: siapa yang tidak menjawab?",
        "Jawabannya mengubah segalanya. Responden didominasi pelanggan muda yang datang tiap hari; pelanggan tua yang datang seminggu sekali hampir tidak menjawab. Setelah dibobot ke komposisi populasi yang sebenarnya, kepuasan rata-rata bukan 3,9 melainkan 3,78 — dan segmen tua yang memberi skor 3,6 adalah 70 persen pelanggan. NPS 34 tetap benar sebagai angka, tetapi keputusan 'semua baik-baik saja' ternyata salah: segmen terbesar justru paling tidak puas.",
        "Lesson ini mengajarkan riset pasar dan analisis survei sebagai disiplin: merancang kuesioner yang tidak menyesatkan, menghitung sampel yang cukup, dan menganalisis hasil dengan koreksi bias. Setelah lesson ini kamu bisa: (1) menulis pertanyaan survei yang bersih dari bias kata; (2) menghitung ukuran sampel dari margin of error; (3) membaca response rate dan nonresponse bias; (4) membobot hasil ke populasi; (5) menghitung dan menafsirkan NPS, CSAT, dan CES dengan jujur.",
      ],
      tasks: [],
      note: {
        title: "Survei sudah disinggung, belum pernah diajarkan",
        body: "Survei hanya muncul sepintas di track MK: survivorship bias pada rating di MK3, NPS terstruktur sebagai pelengkap di MK17, dan peringatan 'survei bukan kausalitas' di MK7. Tidak ada satu lesson pun yang mengajarkan merancang survei, menghitung sampel, dan mengoreksi bias nonresponse. Lesson ini menutup celah itu.",
      },
      reference: "385 dari 2.000 menjawab (19,25 persen). NPS 34; kepuasan tertimbang 3,78, bukan 3,9.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan survei yang hasilnya berani dibawa ke direksi.",
        "(1) Menulis pertanyaan survei yang netral, tunggal, dan terukur;",
        "(2) Menghitung ukuran sampel dari margin of error dan tingkat kepercayaan;",
        "(3) Menilai response rate dan mendeteksi nonresponse bias;",
        "(4) Membobot hasil survei ke komposisi populasi yang sebenarnya;",
        "(5) Menghitung NPS, CSAT, dan CES — dan tahu apa yang tidak boleh diklaim dari ketiganya.",
      ],
      tasks: [],
    },
    {
      id: "kuesioner",
      eyebrow: "Langkah 3 · Teori",
      title: "Menulis kuesioner: pertanyaan yang tidak menyesatkan",
      prose: [
        "Kualitas survei ditentukan sebelum satu responden pun menjawab — di kata-kata pertanyaannya. Tiga cacat klasik. Pertama, pertanyaan mengarahkan (leading): 'Seberapa puas Anda dengan layanan kami yang cepat dan ramah?' — kata 'cepat dan ramah' sudah menjawab untuk responden. Versi bersih: 'Seberapa puas Anda dengan layanan kami?' Kedua, pertanyaan ganda (double-barreled): 'Seberapa puas Anda dengan harga dan kualitas kopi kami?' — responden yang suka harga tetapi tidak suka kualitas tidak punya jawaban yang benar. Pecah menjadi dua pertanyaan.",
        "Ketiga, skala yang tidak seimbang atau tidak berlabel jelas. Skala Likert yang baik punya 5 titik dengan label di tiap titik — sangat tidak puas, tidak puas, netral, puas, sangat puas — dan satu titik tengah yang benar-benar netral. Skala tanpa titik tengah memaksa orang yang netral memilih sisi; skala dengan label hanya di ujung membuat tiap responden menafsirkan titik tengah dengan caranya sendiri. Urutan opsi jawaban juga penting: opsi pertama cenderung dipilih lebih sering — acak urutannya bila memungkinkan.",
        "Struktur kuesioner mengikuti psikologi responden: mulai dari pertanyaan mudah dan tidak mengancam, simpan pertanyaan sensitif (penghasilan, alasan berhenti) di akhir, dan kelompokkan pertanyaan per topik agar responden tidak melompat-lompat. Panjang yang sehat: 5 sampai 10 menit — survei 20 menit kehilangan responden di tengah jalan, dan yang bertahan bukan lagi sampel yang acak.",
        "Sebelum diluncurkan, kuesioner diuji coba ke 20 sampai 30 orang dari populasi target — pilot test. Tanyakan bukan hanya jawabannya, melainkan: pertanyaan mana yang membingungkan, berapa lama mengisinya, dan di mana mereka hampir berhenti. Pilot test yang menemukan satu pertanyaan ambigu menghemat satu survei yang hasilnya tidak bisa dipakai.",
      ],
      tasks: [],
      note: {
        title: "Survei bukan kausalitas",
        body: "MK7 sudah memperingatkan: bertanya 'kenapa VIP convert' menghasilkan rasionalisasi, bukan sebab. Survei mengukur sikap dan persepsi — apa yang orang katakan mereka rasakan dan lakukan. Untuk sebab-akibat, gunakan eksperimen (MK9) atau incrementality (MK10). Jangan pernah menulis 'survei membuktikan X menyebabkan Y'.",
      },
      reference: "Leading, double-barreled, skala tak seimbang: tiga cacat yang merusak survei sebelum dimulai.",
    },
    {
      id: "sampel-bias",
      eyebrow: "Langkah 4 · Teori",
      title: "Sampel, margin of error, dan nonresponse bias",
      prose: [
        "Ukuran sampel dihitung dari rumus: n sama dengan z kuadrat dikali p dikali satu dikurangi p, dibagi e kuadrat. Untuk tingkat kepercayaan 95 persen, z sama dengan 1,96. Untuk margin of error 5 persen, e sama dengan 0,05. Dengan p sama dengan 0,5 — nilai paling konservatif karena variansnya maksimum — n sama dengan 3,8416 dikali 0,25 dibagi 0,0025 sama dengan 384,16, dibulatkan ke atas menjadi 385 responden. Itulah asal angka 385 di cerita pembuka: bukan tebakan, melainkan hitungan.",
        "Dua hal yang sering disalahpahami. Pertama, ukuran sampel hampir tidak bergantung pada ukuran populasi — populasi 20.000 atau 2.000.000 butuh sampel yang hampir sama untuk margin of error yang sama. Yang menentukan adalah margin of error yang diinginkan: mengecilkan margin dari 5 persen ke 3 persen menaikkan sampel dari 385 menjadi 1.068 — hampir tiga kali lipat. (1,96² × 0,25 / 0,03² = 1.067,11 — dibulatkan ke atas dengan math.ceil menjadi 1.068, sesuai aturan lesson ini.) Kedua, margin of error hanya mengukur kesalahan sampling acak — ia tidak mengukur bias sama sekali.",
        "Bias terbesar survei modern adalah nonresponse: yang menjawab berbeda dari yang tidak. Response rate 19,25 persen di cerita pembuka berarti 80,75 persen tidak menjawab — dan bila yang tidak menjawab adalah pelanggan yang kecewa, hasil survei terlalu manis. Cara mendeteksinya: bandingkan profil responden dengan profil populasi — umur, frekuensi kunjungan, nilai belanja. Bila pelanggan tua 70 persen populasi tetapi hanya 50 persen responden, ada bias — dan obatnya adalah pembobotan.",
        "Pembobotan bekerja dengan memberi bobot tiap segmen sama dengan pangsa populasi dibagi pangsa sampel. Segmen muda: pangsa populasi 30 persen dibagi pangsa sampel 50 persen sama dengan bobot 0,6. Segmen tua: 70 persen dibagi 50 persen sama dengan bobot 1,4. Kepuasan tertimbang: 0,3 dikali 4,2 ditambah 0,7 dikali 3,6 sama dengan 1,26 ditambah 2,52 sama dengan 3,78. Bandingkan dengan rata-rata mentah 3,9 — selisih 0,12 poin adalah harga bias yang tidak dikoreksi.",
      ],
      tasks: [],
      formula: "n = \\frac{z^2 p (1-p)}{e^2}",
      formulaNote: "z = 1,96 untuk kepercayaan 95 persen; p = 0,5 paling konservatif; e = margin of error yang diinginkan.",
      note: {
        title: "Probability vs non-probability",
        body: "Sampel probability — tiap anggota populasi punya peluang diketahui untuk terpilih — memungkinkan margin of error dihitung secara sah. Sampel convenience — siapa saja yang kebetulan mengisi — tidak punya margin of error yang valid, berapa pun jumlahnya. Survei dengan 10.000 responden convenience tidak lebih sah dari survei 385 responden acak.",
      },
      reference: "n = 385 untuk margin 5 persen, kepercayaan 95 persen. Bobot = pangsa populasi dibagi pangsa sampel.",
    },
    {
      id: "lab-survei",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kalkulator survei — sampel, response rate, NPS, pembobotan",
      prose: [
        "Lab ini membangun kalkulator survei: ukuran sampel, response rate, NPS, dan kepuasan tertimbang.",
        "Hitung dulu di kepala. Ukuran sampel: 1,96 kuadrat sama dengan 3,8416; dikali 0,5 dikali 0,5 sama dengan 0,9604; dibagi 0,05 kuadrat (0,0025) sama dengan 384,16 — dibulatkan ke atas menjadi 385. Response rate: 385 dibagi 2.000 dikali 100 sama dengan 19,25 persen. NPS dari 1.000 responden — promoter 520, pasif 300, detraktor 180: promoter 52 persen dikurangi detraktor 18 persen sama dengan 34. Kepuasan tertimbang: 0,3 dikali 4,2 ditambah 0,7 dikali 3,6 sama dengan 3,78.",
        "Tugas lab: tulis fungsi yang menerima parameter survei dan mencetak empat angka: n, response_rate, nps, kepuasan_tertimbang. Keempat angka ini adalah ringkasan satu halaman yang dibawa analis ke direksi — dengan metodologi yang bisa dipertahankan bila ditanya.",
        "Setelah lolos, coba eksperimen: ubah margin of error menjadi 0,03 dan lihat n melonjak menjadi 1.068 — lalu tanyakan: apakah margin 3 persen sepadan dengan biaya hampir tiga kali lipat? Jawabannya ada di langkah berikutnya: tergantung keputusan apa yang akan diambil dari angka itu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ukuran sampel dari z, p, dan margin of error (bulatkan ke atas)" },
        { id: "t2", text: "Hitung response rate dan NPS dari data survei" },
        { id: "t3", text: "Hitung kepuasan tertimbang dari pangsa populasi dan skor tiap segmen" },
      ],
      expected: "n=385\nresponse_rate=19.25\nnps=34.0\nkepuasan_tertimbang=3.78",
      hints: [
        "n = z kuadrat dikali p dikali (1 dikurangi p), dibagi e kuadrat — bulatkan ke atas dengan math.ceil.",
        "Response rate = menjawab dibagi diundang, dikali 100.",
        "NPS = persen promoter dikurangi persen detraktor; pasif tidak masuk hitungan.",
        "Kepuasan tertimbang = jumlah pangsa populasi dikali skor tiap segmen.",
      ],
      code: {
        starter: `# Data survei Kedai Senja: parameter sampel, undangan, NPS, kepuasan per segmen.\nimport math\nz = 1.96\np = 0.5\ne = 0.05\ndiundang = 2000\nmenjawab = 385\npromoter = 520\npasif = 300\ndetraktor = 180\npangsa_muda = 0.3\nskor_muda = 4.2\npangsa_tua = 0.7\nskor_tua = 3.6\n\n# TULIS KODEMU: hitung empat angka survei di bawah ini.\n# Cetak, per baris: n, response_rate, nps, kepuasan_tertimbang.\n\n\nkalkulator_survei(z, p, e, diundang, menjawab, promoter, pasif, detraktor, pangsa_muda, skor_muda, pangsa_tua, skor_tua)`,
        lockLines: 14,
        solution: `# Data survei Kedai Senja: parameter sampel, undangan, NPS, kepuasan per segmen.\nimport math\nz = 1.96\np = 0.5\ne = 0.05\ndiundang = 2000\nmenjawab = 385\npromoter = 520\npasif = 300\ndetraktor = 180\npangsa_muda = 0.3\nskor_muda = 4.2\npangsa_tua = 0.7\nskor_tua = 3.6\n\n\ndef kalkulator_survei(z, p, e, diundang, menjawab, promoter, pasif, detraktor, pangsa_muda, skor_muda, pangsa_tua, skor_tua):\n    n = math.ceil(z * z * p * (1 - p) / (e * e))\n    response_rate = menjawab / diundang * 100\n    total = promoter + pasif + detraktor\n    nps = promoter / total * 100 - detraktor / total * 100\n    tertimbang = pangsa_muda * skor_muda + pangsa_tua * skor_tua\n    print(f"n={n}")\n    print(f"response_rate={response_rate}")\n    print(f"nps={nps}")\n    print(f"kepuasan_tertimbang={tertimbang}")\n\n\nkalkulator_survei(z, p, e, diundang, menjawab, promoter, pasif, detraktor, pangsa_muda, skor_muda, pangsa_tua, skor_tua)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "n=385", label: "Ukuran sampel 385", msg: "1,96^2 x 0,25 / 0,0025 = 384,16 — dibulatkan ke atas menjadi 385." },
          { kind: "stdout_matches", task: "t2", pattern: "response_rate=19.25", label: "Response rate 19,25 persen", msg: "385 / 2.000 x 100 = 19,25. Artinya 80,75 persen tidak menjawab." },
          { kind: "stdout_matches", task: "t2", pattern: "nps=34.0", label: "NPS 34", msg: "52 persen promoter dikurangi 18 persen detraktor = 34. Pasif tidak masuk hitungan." },
          { kind: "stdout_matches", task: "t3", pattern: "kepuasan_tertimbang=3.78", label: "Kepuasan tertimbang 3,78", msg: "0,3 x 4,2 + 0,7 x 3,6 = 3,78. Rata-rata mentah 3,9 terlalu manis." },
        ],
      },
      reference: "n = 385; response rate 19,25 persen; NPS 34; kepuasan tertimbang 3,78.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 6 · Teori",
      title: "NPS, CSAT, CES — dan apa yang tidak boleh diklaim",
      prose: [
        "Tiga metrik survei yang paling dipakai — dan paling disalahpahami. NPS (Net Promoter Score): dari pertanyaan 'seberapa mungkin Anda merekomendasikan kami, 0 sampai 10?', promoter adalah skor 9 sampai 10, pasif 7 sampai 8, detraktor 0 sampai 6. NPS sama dengan persen promoter dikurangi persen detraktor — rentangnya negatif 100 sampai positif 100. NPS 34 di cerita pembuka berarti promoter melebihi detraktor sebanyak 34 poin. Yang tidak boleh diklaim: NPS bukan probabilitas rekomendasi dan bukan pertumbuhan — ia korelasi, bukan sebab.",
        "CSAT (Customer Satisfaction): persen responden yang puas — biasanya skor 4 atau 5 dari 5. Sederhana, tetapi sensitif terhadap skala: CSAT dari skala 5 titik tidak bisa dibandingkan dengan CSAT dari skala 7 titik. CES (Customer Effort Score): seberapa mudah pelanggan menyelesaikan urusannya — 'seberapa mudah Anda menyelesaikan pesanan?' — dan terbukti memprediksi churn lebih baik daripada kepuasan umum, karena pelanggan yang harus berusaha keras adalah pelanggan yang pergi diam-diam.",
        "Aturan pelaporan yang jujur: selalu laporkan metrik bersama n, response rate, dan periode. 'NPS 34 (n 1.000, response rate 19,25 persen, Januari 2026)' adalah klaim yang bisa diuji. 'NPS 34' sendirian adalah slogan. Dan selalu laporkan distribusi, bukan hanya rata-rata: kepuasan rata-rata 3,78 bisa berarti 78 persen memberi 4 dan 22 persen memberi 3 — atau 39 persen memberi 5 dan 61 persen memberi 3 (0,39 × 5 + 0,61 × 3 = 3,78). Dua dunia yang sama sekali berbeda, dengan rata-rata yang sama. (Bukan 'semua memberi 4' — itu rata-ratanya 4,0 — dan bukan 'separuh 5, separuh 2' — itu 3,5.)",
        "Satu peringatan terakhir: survei mengukur apa yang orang katakan, bukan apa yang orang lakukan. Pelanggan yang memberi skor 5 di survei tetapi tidak pernah kembali adalah data — bukan kontradiksi. Gabungkan survei dengan data perilaku (MK3, MK6): bila skor naik tetapi retensi turun, percayalah pada perilaku, dan selidiki kenapa kata-kata dan perbuatan berbeda.",
      ],
      tasks: [],
      note: {
        title: "Survei exit: menangkap yang pergi",
        body: "MK3 sudah mengajarkan: rating 4,8 dari user yang tidak uninstall adalah survivorship bias — yang kecewa sudah pergi dan tidak memberi rating. Obatnya survei exit saat uninstall atau saat pelanggan berhenti: tanyakan kenapa mereka pergi, saat mereka pergi. Responden yang pergi adalah responden yang paling berharga — dan paling sulit didapat.",
      },
      reference: "NPS = persen promoter dikurangi persen detraktor. Laporkan selalu bersama n, response rate, dan periode.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: direksi hampir merayakan — apa yang analis katakan?",
      prose: [
        "Kembali ke cerita pembuka. Direksi melihat NPS 34 dan kepuasan 3,9 dan hampir menyetujui anggaran ekspansi 10 gerai baru. Analis meminta satu slide tambahan: profil responden versus populasi. Slide itu menunjukkan pelanggan tua — 70 persen populasi, skor 3,6 — hanya 50 persen responden. Setelah pembobotan, kepuasan 3,78, dan segmen terbesar adalah segmen yang paling tidak puas.",
        "Keputusan berubah: ekspansi ditunda satu kuartal; anggaran dialihkan ke perbaikan layanan untuk segmen tua — jam buka lebih pagi, menu dengan huruf lebih besar, dan pelatihan barista untuk pelanggan yang tidak terburu-buru. Survei ulang tiga bulan kemudian dengan kuota segmen yang dijaga: kepuasan segmen tua naik menjadi 3,9, kepuasan tertimbang 3,95, dan NPS 41. Ekspansi disetujui — dengan bukti, bukan dengan perayaan prematur.",
        "Pelajaran rapat itu: angka survei yang tidak disertai profil responden adalah angka yang belum selesai. Analis yang baik tidak hanya menghitung NPS — ia bertanya siapa yang tidak menjawab, dan berapa harga ketidaktahuan itu.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang menyelamatkan keputusan: (1) response rate dilaporkan, bukan disembunyikan; (2) profil responden dibandingkan dengan populasi — bias ketahuan; (3) pembobotan mengubah angka sebelum keputusan diambil, bukan sesudah. Survei yang baik mengubah keputusan; survei yang buruk mengesahkan keputusan yang sudah diambil.",
      },
      reference: "Kepuasan tertimbang 3,78 menunda ekspansi; setelah perbaikan, 3,95 dan NPS 41 — ekspansi disetujui dengan bukti.",
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
        "Pertanyaan survei: netral, tunggal, skala seimbang dengan titik tengah yang jelas.",
        "n = 385 untuk margin 5 persen, kepercayaan 95 persen; margin 3 persen butuh 1.068.",
        "Lab: n = 385; response rate 19,25 persen; NPS 34; kepuasan tertimbang 3,78.",
        "Bobot = pangsa populasi dibagi pangsa sampel; tanpa bobot, rata-rata mentah terlalu manis.",
        "NPS, CSAT, CES dilaporkan bersama n, response rate, dan periode — dan selalu bersama distribusi.",
      ],
      next: { label: "MK31 — Kualitas Data dan Rekonsiliasi Marketing: Saat Tiga Angka Tidak Cocok", href: "/v2/learn/mk31-kualitas-data-rekonsiliasi" },
      quiz: [
        {
          q: "Pertanyaan survei: 'Seberapa puas Anda dengan harga dan kualitas kopi kami?' Apa cacatnya?",
          options: [
            { text: "Tidak ada cacat — satu pertanyaan menghemat waktu responden", why: "Salah: responden yang suka harga tetapi tidak suka kualitas tidak punya jawaban benar. Itu double-barreled." },
            { text: "Double-barreled — dua hal ditanyakan sekaligus; pecah menjadi dua pertanyaan", why: "Tepat: harga dan kualitas adalah dua penilaian berbeda yang butuh dua pertanyaan.", correct: true },
            { text: "Leading — kata 'kopi kami' sudah mengarahkan jawaban", why: "Salah: menyebut produk sendiri bukan mengarahkan. Yang mengarahkan adalah kata sifat evaluatif seperti 'cepat dan ramah'." },
            { text: "Skalanya salah — pertanyaan ini butuh skala 10 titik", why: "Salah: masalahnya bukan jumlah titik skala, melainkan dua pertanyaan dalam satu kalimat." },
          ],
        },
        {
          q: "Ukuran sampel 385 untuk margin 5 persen. Berapa kira-kira sampel untuk margin 3 persen?",
          options: [
            { text: "Sekitar 231 — margin mengecil berarti sampel mengecil", why: "Salah: terbalik. Margin lebih kecil butuh sampel lebih besar, bukan lebih kecil." },
            { text: "1.068 — hampir tiga kali lipat", why: "Tepat: n berbanding terbalik dengan kuadrat margin — (5/3) kuadrat sama dengan 2,78 kali lipat.", correct: true },
            { text: "Tetap 385 — ukuran sampel tidak bergantung pada margin", why: "Salah: margin of error adalah penentu utama ukuran sampel. Populasi yang hampir tidak berpengaruh." },
            { text: "Sekitar 770 — dua kali lipat, sebanding dengan margin", why: "Salah: hubungannya kuadrat, bukan linear. Setengah margin butuh empat kali sampel." },
          ],
        },
        {
          q: "Response rate 19,25 persen; pelanggan tua 70 persen populasi tetapi 50 persen responden; skor mereka 3,6. Apa yang benar?",
          options: [
            { text: "Tidak ada masalah — 385 responden sudah cukup secara statistik", why: "Salah: cukup secara sampling tidak berarti bebas bias. Nonresponse bias tidak ditangkap margin of error." },
            { text: "Ada nonresponse bias — hasil mentah terlalu manis; bobot segmen tua 1,4 dan kepuasan tertimbang 3,78", why: "Tepat: 0,7 dibagi 0,5 sama dengan 1,4; tertimbang 3,78 di bawah mentah 3,9.", correct: true },
            { text: "Survei harus dibuang dan diulang dari nol", why: "Salah: bias yang terukur bisa dikoreksi dengan pembobotan. Dibuang hanya bila biasnya tidak bisa diukur." },
            { text: "Bobot segmen tua adalah 0,6 — mereka kurang terwakili sehingga bobotnya kecil", why: "Salah: terbalik. Segmen yang kurang terwakili mendapat bobot BESAR: 0,7 dibagi 0,5 sama dengan 1,4." },
          ],
        },
        {
          q: "NPS 34 dari 1.000 responden (promoter 520, pasif 300, detraktor 180). Apa yang TIDAK boleh diklaim?",
          options: [
            { text: "Promoter melebihi detraktor sebanyak 34 poin", why: "Salah: itu boleh diklaim — itulah definisi NPS." },
            { text: "NPS 34 membuktikan perusahaan akan tumbuh 34 persen", why: "Tepat: NPS adalah korelasi, bukan sebab — dan bukan angka pertumbuhan. Klaim itu melampaui apa yang diukur.", correct: true },
            { text: "52 persen responden adalah promoter", why: "Salah: itu boleh diklaim — 520 dari 1.000 sama dengan 52 persen." },
            { text: "Detraktor adalah 18 persen responden", why: "Salah: itu boleh diklaim — 180 dari 1.000 sama dengan 18 persen." },
          ],
        },
        {
          q: "Kepuasan rata-rata 3,78 tetapi retensi pelanggan turun. Apa sikap analis yang benar?",
          options: [
            { text: "Percaya survei — retensi pasti turun karena faktor lain yang tidak terkait", why: "Salah: mengabaikan data perilaku demi data sikap adalah kesalahan. Keduanya harus dijelaskan bersama." },
            { text: "Percaya perilaku, selidiki kenapa kata-kata dan perbuatan berbeda", why: "Tepat: survei mengukur apa yang orang katakan; retensi mengukur apa yang orang lakukan. Bila keduanya bertentangan, perbuatan yang dipercaya.", correct: true },
            { text: "Rata-rata 3,78 pasti salah hitung — hitung ulang sampai cocok dengan retensi", why: "Salah: memaksa angka cocok dengan harapan adalah fabrikasi. Selisih adalah temuan, bukan kesalahan hitung." },
            { text: "Buang data retensi karena survei lebih baru", why: "Salah: kebaruan tidak menentukan kebenaran. Data perilaku adalah sumber kebenaran untuk perilaku." },
          ],
        },
      ],
    },
  ],
};
