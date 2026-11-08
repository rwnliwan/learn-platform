import type { V2Lesson } from "../lib/types";

export const b3: V2Lesson = {
  slug: "b3-peluang-bersyarat",
  track: "Probabilitas",
  module: "Fondasi Peluang",
  title: "B3. Peluang Bersyarat: Informasi Mengubah Peluang",
  estMinutes: 55,
  steps: [
    {
      id: "dunia-menyusut",
      eyebrow: "Langkah 1 · Definisi",
      title: "\u201CTelat 30 hari\u201D mengubah segalanya",
      prose: [
        "Bank punya 10.000 nasabah. Secara umum, peluang gagal bayar 5% \u2014 terdengar kecil. Tapi pagi ini sistem menandai satu nasabah: telat bayar 30 hari. Tiba-tiba peluang gagal bayarnya bukan 5% lagi, melainkan 35%.",
        "Apa yang berubah? Bukan nasabahnya \u2014 informasi kita yang bertambah. P(gagal | telat 30 hari) menjawab: di dunia di mana kita tahu dia telat 30 hari, berapa peluang dia gagal? Dunia (ruang sampel) menyusut dari \u201Csemua nasabah\u201D menjadi \u201Cnasabah yang telat 30 hari\u201D \u2014 dan di dunia yang lebih kecil itu, proporsi gagal jauh lebih besar.",
        "Angkanya: dari 10.000 nasabah, 800 pernah telat 30+ hari, dan 280 di antaranya akhirnya gagal. Jadi P(gagal|telat) = 280/800 = 35%. Peluang bukan sifat benda, melainkan sifat pengetahuan tentang benda itu: dua analis dengan informasi berbeda boleh memegang dua angka berbeda untuk nasabah yang sama \u2014 dan keduanya benar.",
      ],
      formula: String.raw`P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0`,
      formulaNote: "Baca P(A|B) sebagai \u201Cdi antara kejadian B, berapa proporsi yang juga A?\u201D. Kata \u201Cgiven\u201D / \u201Cjika diketahui\u201D / \u201Cdi antara yang\u201D adalah sinyal soal bersyarat.",
      tasks: [
        { id: "t1", text: "Tentukan `dunia` = banyak nasabah yang telat 30+ hari" },
        { id: "t2", text: "Hitung `p = gagal / dunia`, cetak dengan `print`" },
      ],
      expected: "p=0.35",
      note: {
        title: "Sering salah",
        body: "Membagi dengan 10.000 (semua nasabah) sehingga dapat 2,8%. Penyebut peluang bersyarat adalah dunia yang menyusut \u2014 800 nasabah telat \u2014 bukan populasi penuh.",
      },
      hints: [
        "Dunia baru = 280 (gagal & telat) + 520 (tidak gagal tapi telat) = 800.",
        "p = 280 / 800.",
        "print(f\"p={p:.2f}\")",
      ],
      code: {
        starter: `gagal_dan_telat = 280\ntelat_tapi_lancar = 520\n\n# TULIS KODEMU: P(gagal | telat 30+ hari)\ndunia = \np = \n\nprint(f"p={p:.2f}")`,
        lockLines: 2,
        solution: `gagal_dan_telat = 280\ntelat_tapi_lancar = 520\n\n# TULIS KODEMU: P(gagal | telat 30+ hari)\ndunia = gagal_dan_telat + telat_tapi_lancar\np = gagal_dan_telat / dunia\n\nprint(f"p={p:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dunia", value: 800, tol: 1e-9, label: "`dunia` seharusnya 800", msg: "Dunia yang menyusut = semua yang telat 30+ hari: 280 + 520." },
          { kind: "equal", task: "t2", name: "p", value: 0.35, tol: 1e-9, label: "`p` seharusnya 0,35", msg: "280/800 = 0,35. Bandingkan dengan P(gagal) umum = 5%." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.35", label: "`print` menampilkan p", msg: "Cetak dengan format p=... ." },
        ],
      },
      reference: "P(A|B) = P(A\u2229B)/P(B). Penyebut = ukuran dunia baru.",
    },
    {
      id: "perkalian-umum",
      eyebrow: "Langkah 2 · Aturan perkalian umum",
      title: "\u201CDan\u201D tanpa asumsi independen",
      prose: [
        "Ini versi jujur dari aturan perkalian B1: P(A dan B) = P(A) \u00D7 P(B|A), tanpa butuh asumsi independen. Contoh: P(2 kartu As berurutan tanpa pengembalian) = 4/52 \u00D7 3/51 \u2014 suku kedua adalah P(As kedua | As pertama).",
        "\u201CTanpa pengembalian\u201D berarti dunia menyusut tiap pengambilan. Aturan perkalian umum menangani dependensi ini secara eksak: peluang gabungan = peluang langkah pertama \u00D7 peluang langkah kedua given langkah pertama terjadi.",
        "Gambar pohon peluang: tiap cabang = syarat, tiap ranting = peluang bersyarat. Peluang satu jalur = kali sepanjang jalur. Pohon mengubah soal berurutan yang membingungkan menjadi perkalian mekanis.",
      ],
      formula: String.raw`P(A \cap B) = P(A) \times P(B \mid A)`,
      formulaNote: "P(A ∩ B) = peluang A dan B terjadi bersamaan; P(A) = peluang A terjadi lebih dulu; P(B|A) = peluang B setelah diketahui A sudah terjadi — bukan P(B) yang polos. Rumus ini versi jujur dari aturan perkalian: tidak butuh asumsi independen karena ketergantungan sudah dikemas di dalam P(B|A). Contoh angka: dua kartu As berurutan tanpa pengembalian = 4/52 × 3/51 = 12/2652 ≈ 0,0045 = 0,45% — angka ini artinya dari 10.000 percobaan, sekitar 45 kali keduanya As; suku kedua 3/51 (bukan 4/52) mencerminkan dunia yang sudah menyusut — satu As hilang dari dek. Versi naif 4/52 × 4/52 = 0,59% salah karena mengembalikan kartu yang tidak dikembalikan.",
      tasks: [
        { id: "t1", text: "Hitung `p` = P(dua As berurutan tanpa pengembalian)" },
        { id: "t2", text: "Cetak `p` dengan 5 desimal" },
      ],
      expected: "p=0.00452",
      note: {
        title: "Sering salah",
        body: "Memakai (4/52)\u00B2 karena \u201Ckan dua kartu As\u201D. Tanpa pengembalian, kartu kedua diambil dari 51 kartu dengan 3 As tersisa \u2014 bukan 52 kartu lagi.",
      },
      hints: [
        "P(As pertama) = 4/52.",
        "P(As kedua | As pertama) = 3/51.",
        "p = (4/52) * (3/51)",
      ],
      code: {
        starter: `# Dua kartu diambil tanpa pengembalian\n\n# TULIS KODEMU: P(keduanya As)\np = \n\nprint(f"p={p:.5f}")`,
        lockLines: 1,
        solution: `# Dua kartu diambil tanpa pengembalian\n\n# TULIS KODEMU: P(keduanya As)\np = (4/52) * (3/51)\n\nprint(f"p={p:.5f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: (4 / 52) * (3 / 51), tol: 1e-9, label: "`p` seharusnya 4/52 \u00D7 3/51", msg: "(4/52) \u00D7 (3/51) \u2248 0,00452." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.00452", label: "`print` menampilkan p", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tanpa pengembalian \u2192 dunia menyusut \u2192 pakai perkalian umum.",
    },
    {
      id: "peluang-total",
      eyebrow: "Langkah 3 · Hukum peluang total",
      title: "Pecah per bucket, lalu rata-rata tertimbang",
      prose: [
        "Populasi terbagi ke bucket dengan peluang beda-beda (misal DPD: lancar / 1\u201330 / 31\u201360 / >60). Peluang keseluruhan = jumlah dari (bobot bucket \u00D7 peluang bersyarat di bucket itu). Ini rata-rata tertimbang dari peluang bersyarat \u2014 menghubungkan B3 ke weighted mean.",
        "Contoh portofolio: 80% lancar (PD 2%), 15% telat 1\u201330 (PD 10%), 5% telat >30 (PD 35%). PD portofolio = 0,8\u00D70,02 + 0,15\u00D70,10 + 0,05\u00D70,35 = 0,016 + 0,015 + 0,0175 = 4,85%.",
        "Perhatikan: PD portofolio 4,85% tidak sama dengan PD bucket mana pun. Bucket kecil (5%) tapi PD 35% menyumbang 1,75 poin \u2014 hampir sama dengan bucket lancar 80% (1,6 poin). Jangan kelola portofolio dengan satu angka rata-rata; kelola per bucket.",
      ],
      formula: String.raw`P(A) = \sum_i P(B_i)\,P(A \mid B_i)`,
      formulaNote: "B_i = partisi populasi: bucket yang saling lepas dan mencakup semuanya (misal DPD: lancar, 1–30, 31–60, >60 hari); P(B_i) = bobot bucket, proporsi populasi di bucket itu; P(A|B_i) = peluang kejadian di dalam bucket itu; Σ_i = jumlahkan kontribusi semua bucket. Rumus ini rata-rata tertimbang: peluang keseluruhan = jumlah dari (bobot bucket × peluang bersyarat di bucket itu). Angka ini artinya peluang default portofolio bukan satu angka ajaib, melainkan gabungan perilaku tiap segmen — bucket kecil berisi 2% populasi tetapi berpeluang default 40% menyumbang 0,8 poin, setara bucket besar berisiko rendah. Tanpa partisi, satu angka rata-rata menyembunyikan dari mana risiko sebenarnya berasal.",
      tasks: [
        { id: "t1", text: "Hitung `p_roll` = P(gagal | mulai telat 1\u201330) via pohon" },
        { id: "t2", text: "Cetak `p_roll` sebagai persen" },
      ],
      expected: "p_roll=25.00%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pohon roll-rate adalah alat harian collection analytics: tiap cabang = syarat, tiap daun = peluang gagal. Tanpa pohon, analis menebak-nebak jalur mana yang paling berbahaya.",
      },
      hints: [
        "Cabang: 60% kembali lancar (P gagal 0), 30% roll ke 31-60 (P gagal 0,5), 10% langsung gagal.",
        "p_roll = 0.60*0 + 0.30*0.50 + 0.10*1.",
        "print(f\"p_roll={p_roll:.2%}\")",
      ],
      code: {
        starter: `# Pohon mulai dari "telat 1-30"\n# 60% -> lancar | 30% -> roll ke 31-60 (P gagal 0.50) | 10% -> langsung gagal\n\n# TULIS KODEMU: hukum peluang total sepanjang cabang\np_roll = \n\nprint(f"p_roll={p_roll:.2%}")`,
        lockLines: 2,
        solution: `# Pohon mulai dari "telat 1-30"\n# 60% -> lancar | 30% -> roll ke 31-60 (P gagal 0.50) | 10% -> langsung gagal\n\n# TULIS KODEMU: hukum peluang total sepanjang cabang\np_roll = 0.60*0 + 0.30*0.50 + 0.10*1\n\nprint(f"p_roll={p_roll:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_roll", value: 0.25, tol: 1e-9, label: "`p_roll` seharusnya 0,25", msg: "0,60\u00D70 + 0,30\u00D70,50 + 0,10\u00D71 = 0,25." },
          { kind: "stdout_matches", task: "t2", pattern: "p_roll=25\\.00%", label: "`print` menampilkan persen", msg: "Format persen: p_roll=25.00%." },
        ],
      },
      reference: "Kali sepanjang jalur pohon, jumlahkan jalur yang relevan.",
    },
    {
      id: "lab-dadu",
      eyebrow: "Langkah 4 · Lab dadu",
      title: "Syarat memangkas dunia dari 36 jadi 10",
      prose: [
        "Lempar dua dadu. P(jumlah = 12) = 1/36 \u2248 2,78%. Tapi diberi tahu jumlahnya > 8 \u2014 dunia menyusut ke {9, 10, 11, 12} dengan 4+3+2+1 = 10 outcome. P(jumlah = 12 | jumlah > 8) = 1/10 = 10%. Syarat yang sama menaikkan peluang 3,6x lipat.",
        "Simulasi memverifikasinya: hitung frekuensi jumlah 12 secara umum vs di antara lemparan yang jumlahnya > 8. Gunakan 8.000 iterasi \u2014 cukup untuk melihat pola tanpa membebani browser.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=8000` lemparan dua dadu" },
        { id: "t2", text: "Hitung `p_umum` dan `p_given` (jumlah 12 | jumlah > 8)" },
        { id: "t3", text: "Cetak keduanya dengan 4 desimal" },
      ],
      expected: "umum=0.0270  given=0.0964",
      note: {
        title: "Sering salah",
        body: "Penyebut untuk P(12 | jumlah > 8) tetap 36. Penyebutnya dunia yang menyusut \u2014 hanya lemparan dengan jumlah > 8 \u2014 sehingga peluangnya 1/10, bukan 1/36.",
      },
      hints: [
        "d = random.randint(1,6) + random.randint(1,6).",
        "p_given = (jumlah 12 dan >8) / (jumlah >8).",
        "Cetak: print(f\"umum={p_umum:.4f}  given={p_given:.4f}\")",
      ],
      code: {
        starter: `import random\nrandom.seed(21)\nN = 8000\ncnt12 = cnt_gt8 = cnt12_gt8 = 0\n\n# TULIS KODEMU: lengkapi loop lemparan dadu\nfor _ in range(N):\n    d = \n    if d == 12: cnt12 += 1\n    if d > 8:\n        cnt_gt8 += 1\n        if d == 12: cnt12_gt8 += 1\n\np_umum = cnt12 / N\np_given = cnt12_gt8 / cnt_gt8\nprint(f"umum={p_umum:.4f}  given={p_given:.4f}")`,
        lockLines: 3,
        solution: `import random\nrandom.seed(21)\nN = 8000\ncnt12 = cnt_gt8 = cnt12_gt8 = 0\n\n# TULIS KODEMU: lengkapi loop lemparan dadu\nfor _ in range(N):\n    d = random.randint(1,6) + random.randint(1,6)\n    if d == 12: cnt12 += 1\n    if d > 8:\n        cnt_gt8 += 1\n        if d == 12: cnt12_gt8 += 1\n\np_umum = cnt12 / N\np_given = cnt12_gt8 / cnt_gt8\nprint(f"umum={p_umum:.4f}  given={p_given:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "p_umum", value: 1 / 36, tol: 0.02, label: "`p_umum` mendekati 1/36", msg: "Dengan seed 21, frekuensi harus dekat 0,0278." },
          { kind: "equal", task: "t2", name: "p_given", value: 0.10, tol: 0.05, label: "`p_given` mendekati 0,10", msg: "Dengan seed 21, frekuensi bersyarat harus dekat 0,10." },
          { kind: "stdout_matches", task: "t3", pattern: "umum=0\\.0270\\s+given=0\\.0964", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Syarat memangkas dunia 36 hasil \u2192 10 hasil. Peluang naik 3,6x.",
    },
    {
      id: "arah-terbalik",
      eyebrow: "Langkah 5 · Jangan tertukar arah",
      title: "P(A|B) vs P(B|A): prediksi vs diagnosis",
      prose: [
        "Kesalahan paling mahal di analitik: menukar arah bersyarat. P(gagal | telat 30 hari) = 35% adalah prediksi \u2014 given sinyal, berapa risiko? P(telat 30 hari | gagal) = 70% adalah diagnosis \u2014 given gagal, seberapa umum sinyalnya? Beda total.",
        "Memakai 70% (diagnostik) sebagai \u201Cpeluang gagal\u201D untuk nasabah telat akan membuatmu overestimasi 2x lipat. Selalu tanya dulu: given-nya apa? Tulis dengan kata-kata (\u201Cgiven telat, berapa gagal\u201D) sebelum menyentuh angka.",
        "Membalik arah \u2014 dari P(B|A) ke P(A|B) \u2014 butuh base rate P(A), dan itu topik B4 (Bayes). Tidak bisa dibalik tanpa itu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Analis risiko hidup dari beda arah ini: prediksi (given sinyal \u2192 risiko) untuk keputusan koleksi, diagnosis (given gagal \u2192 seberapa umum sinyal) untuk evaluasi model.",
      },
      quiz: [
        {
          q: "P(gagal | telat 30 hari) = 35%, P(telat 30 hari | gagal) = 70%. Mana untuk memprediksi risiko nasabah yang telat?",
          options: [
            { text: "P(telat | gagal) = 70%", why: "Salah: itu arah diagnostik \u2014 given gagal, seberapa umum sinyal telat." },
            { text: "P(gagal | telat) = 35%", why: "Benar: given-nya adalah \u201Ctelat\u201D (informasi yang kita punya) \u2192 P(gagal|telat).", correct: true },
            { text: "Keduanya sama", why: "Salah: 35% vs 70% \u2014 beda jauh dari data yang sama." },
          ],
        },
        {
          q: "Kapan P(A|B) > P(A)?",
          options: [
            { text: "Tidak pernah", why: "Salah: contoh cerita pembuka \u2014 35% > 5%." },
            { text: "Selalu", why: "Salah: syarat juga bisa menurunkan peluang." },
            { text: "Jika B berkorelasi positif dengan A", why: "Benar: syarat yang \u201Ckabar buruk\u201D menggeser peluang naik. Jika independen, P(A|B) = P(A).", correct: true },
            { text: "Jika A dan B independen", why: "Salah: jika independen, informasi B tidak mengubah apa-apa." },
          ],
        },
      ],
      reference: "Prediksi: P(risiko|sinyal). Diagnosis: P(sinyal|risiko).",
    },
    {
      id: "minicase-collection",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Prioritas collection: 200 telepon untuk 1.000 akun",
      prose: [
        "Tim collection punya 1.000 akun telat, kapasitas 200 telepon intensif minggu ini. Data historis: telat 1\u201330 (700 akun, P(gagal|bucket) = 8%), telat 31\u201360 (200 akun, 25%), telat 61\u201390 (100 akun, 55%).",
        "Ekspektasi gagal bayar total = 700\u00D70,08 + 200\u00D70,25 + 100\u00D70,55 = 56 + 50 + 55 = 161 akun. Itu hukum peluang total dalam aksi \u2014 ekspektasi = jumlah \u00D7 peluang per bucket.",
        "Strategi: telepon 100 akun bucket 61\u201390 dulu, lalu 100 dari bucket 31\u201360. Alasannya risk-based prioritization \u2014 alokasikan kapasitas ke peluang bersyarat terbesar, bukan ke bucket terbesar. Menelpon 200 akun acak hanya \u201Cmenyelamatkan\u201D ~32 (16%), strategi bucket menyelamatkan ~68.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ekspektasi` gagal bayar total dari 3 bucket" },
        { id: "t2", text: "Cetak `ekspektasi` sebagai bilangan bulat" },
      ],
      expected: "ekspektasi=161",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan kapasitas selalu risk-based: peluang bersyarat per bucket menentukan prioritas, bukan ukuran bucket. Bucket kecil dengan PD tinggi menyelamatkan lebih banyak per telepon.",
      },
      hints: [
        "ekspektasi = 700*0.08 + 200*0.25 + 100*0.55.",
        "Bulatkan ke int dengan int(...).",
        "print(f\"ekspektasi={int(ekspektasi)}\")",
      ],
      code: {
        starter: `# bucket: (jumlah akun, P(gagal|bucket))\nbuckets = [(700, 0.08), (200, 0.25), (100, 0.55)]\n\n# TULIS KODEMU: ekspektasi gagal bayar total\naks = [n * p for n, p in buckets]\nekspektasi = \n\nprint(f"ekspektasi={int(ekspektasi)}")`,
        lockLines: 2,
        solution: `# bucket: (jumlah akun, P(gagal|bucket))\nbuckets = [(700, 0.08), (200, 0.25), (100, 0.55)]\n\n# TULIS KODEMU: ekspektasi gagal bayar total\naks = [n * p for n, p in buckets]\nekspektasi = sum(aks)\n\nprint(f"ekspektasi={int(ekspektasi)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ekspektasi", value: 161, tol: 1e-9, label: "`ekspektasi` seharusnya 161", msg: "700\u00D70,08 + 200\u00D70,25 + 100\u00D70,55 = 56 + 50 + 55 = 161." },
          { kind: "stdout_matches", task: "t2", pattern: "ekspektasi=161", label: "`print` menampilkan ekspektasi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Ekspektasi per bucket = jumlah \u00D7 P(gagal|bucket). Jumlahkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B4.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: arah panah menentukan nasib keputusan",
        body: "P(A|B) dan P(B|A) terlihat seperti saudara kembar, tetapi menjawab pertanyaan yang berlawanan arah. P(fraud|alarm) adalah diagnosis: alarm sudah berbunyi, seberapa yakin kita? P(alarm|fraud) adalah kualitas sensor: jika memang fraud, seberapa sering alarm menangkapnya? Tim collection yang mengejar nasabah dengan P(bayar|ditelepon) tertinggi sedang menjawab pertanyaan yang salah — yang mereka butuhkan adalah peluang bayar setelah diprioritaskan, dikalikan biaya teleponnya. Aturan praktisnya: tulis kondisinya secara eksplisit setiap kali. Peluang tanpa diketahui-apa adalah kalimat yang belum selesai. Jebakan yang paling terasa: base rate yang diabaikan. Alarm dengan akurasi 99% tetap lebih sering salah daripada benar jika yang dicari hanya terjadi 1 dari 10.000 — karena 99% dari 9.999 orang sehat menghasilkan jauh lebih banyak alarm palsu daripada 1 orang sakit yang tertangkap. Setiap kali sebuah angka terasa meyakinkan, tanyakan: dari populasi apa angka ini dihitung? Arah panah yang benar mengubah angka yang sama dari menyesatkan menjadi berguna. Latihan termudah: setiap kali membaca peluang di berita, tanyakan dalam hati — diketahui apa?",
      },
      summary: [
        "P(A|B) = proporsi A di dalam dunia B \u2014 informasi memangkas ruang sampel.",
        "Jangan tertukar P(A|B) vs P(B|A) \u2014 prediksi vs diagnosis.",
        "Perkalian umum: P(A\u2229B) = P(A)P(B|A) \u2014 rantai pohon, tanpa asumsi independen.",
        "Hukum peluang total: pecah per bucket, lalu rata-rata tertimbang.",
        "Jangan pakai peluang umum untuk keputusan individual \u2014 selalu cari peluang bersyarat yang relevan.",
      ],
      next: { label: "B4 \u2014 Teorema Bayes", href: "/v2/learn/b4-bayes" },
      quiz: [
        {
          q: "P(gagal | telat 30 hari) = 35% artinya\u2026",
          options: [
            { text: "35% nasabah telat 30 hari", why: "Salah: itu membalik arah \u2014 35% adalah peluang gagal given telat, bukan peluang telat." },
            { text: "Di antara nasabah telat 30 hari, 35% gagal", why: "Benar: \u201Cdi antara yang telat\u201D \u2014 dunia menyusut ke bucket telat.", correct: true },
            { text: "35% nasabah gagal", why: "Salah: P(gagal) umum hanya 5%." },
            { text: "Telat 30 hari menyebabkan 65% gagal", why: "Salah: 35% bukan 65%, dan korelasi bukan kausalitas." },
          ],
        },
        {
          q: "Dua kartu As berurutan tanpa pengembalian: 4/52 \u00D7 3/51. Suku 3/51 adalah\u2026",
          options: [
            { text: "P(As pertama)", why: "Salah: P(As pertama) = 4/52." },
            { text: "P(As kedua | As pertama)", why: "Benar: setelah satu As keluar, tersisa 3 As dari 51 kartu \u2014 peluang bersyarat.", correct: true },
            { text: "P(As pertama | As kedua)", why: "Salah: arahnya terbalik." },
            { text: "P(keduanya As)", why: "Salah: itu hasil akhirnya, bukan suku keduanya." },
          ],
        },
        {
          q: "Hukum peluang total P(A) = \u03A3 P(Bi)P(A|Bi) pada dasarnya adalah\u2026",
          options: [
            { text: "Rata-rata tertimbang", why: "Benar: bobot P(Bi) \u00D7 peluang bersyarat \u2014 sama seperti weighted mean.", correct: true },
            { text: "Aturan komplemen", why: "Salah: komplemen adalah 1 \u2212 P(A)." },
            { text: "Permutasi", why: "Salah: tidak ada hubungannya dengan susunan." },
            { text: "Independensi", why: "Salah: hukum ini justru untuk kejadian yang tidak independen." },
          ],
        },
        {
          q: "60% transaksi via mobile (P(fraud|mobile) = 0,8%), 40% via web (P(fraud|web) = 0,3%). P(fraud) keseluruhan?",
          options: [
            { text: "0,8%", why: "Salah: itu hanya angka mobile, bukan keseluruhan." },
            { text: "0,55%", why: "Salah: rata-rata biasa mengabaikan bobot 60/40." },
            { text: "0,6%", why: "Benar: 0,008\u00D70,6 + 0,003\u00D70,4 = 0,0048 + 0,0012 = 0,006.", correct: true },
            { text: "1,1%", why: "Salah: menjumlah peluang bersyarat tanpa bobot." },
          ],
        },
        {
          q: "Peluang bersyarat selalu lebih kecil dari peluang umum?",
          options: [
            { text: "Ya, dunia menyusut", why: "Salah: \u201Cdiberi info\u201D \u2260 \u201Cpeluang menyusut\u201D \u2014 contoh 35% > 5%." },
            { text: "Tidak \u2014 bisa lebih besar atau lebih kecil", why: "Benar: tergantung apakah syaratnya berkorelasi positif atau negatif dengan kejadian.", correct: true },
            { text: "Ya, karena penyebutnya lebih kecil", why: "Salah: pembilangnya juga ikut menyusut." },
          ],
        },
      ],
    },
  ],
};
