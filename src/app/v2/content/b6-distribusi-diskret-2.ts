import type { V2Lesson } from "../lib/types";

export const b6_2: V2Lesson = {
  slug: "b6-distribusi-diskret-2",
  track: "Probabilitas",
  module: "Distribusi",
  title: "B6.2 Distribusi Diskret 2: Poisson, Geometrik & Negatif Binomial",
  estMinutes: 55,
  steps: [
    {
      id: "poisson",
      eyebrow: "Langkah 1 · Poisson",
      title: "Berapa klaim bulan depan?",
      prose: [
        "Aktuaris ditanya: \u201CBerapa klaim mobil bulan depan?\u201D Ia tidak bisa pakai Binomial \u2014 n-nya tidak jelas (berapa \u201Cpercobaan\u201D dalam sebulan?). Yang ia tahu: rata-rata 4 klaim/bulan. Distribusi Poisson menjawab dengan satu parameter: \u03BB = rata-rata per periode.",
        "P(X=k) = \u03BB^k e^(\u2212\u03BB)/k!. Untuk \u03BB=4: P(tepat 6 klaim) = 4^6\u00B7e^(−4)/720 \u2248 10,4%. P(tidak ada klaim) = e^(−4) \u2248 1,8% \u2014 bulan tanpa klaim itu langka!",
        "Asal-usulnya: limit Binomial saat n\u2192\u221E, p\u21920 dengan np=\u03BB tetap. Ciri khasnya: E[X] = Var(X) = \u03BB \u2014 mean = varians! Poisson memetakan seluruh distribusi hanya dari satu angka, dan itu juga sumber kebohongan terbesarnya: jika data tidak Poisson, peta itu salah total.",
      ],
      formula: String.raw`P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}, \quad k = 0,1,2,\ldots \qquad E[X] = \mathrm{Var}(X) = \lambda`,
      formulaNote: "λ (lambda) = rata-rata kejadian per periode — satu-satunya parameter; k = 0,1,2,… jumlah kejadian yang ditanya; e^(−λ) = peluang nol kejadian; λ^k/k! = bobot relatif k kejadian. E[X] = Var(X) = λ: mean sama dengan varians — sidik jari Poisson. Contoh angka: λ = 4 klaim/bulan → P(X=0) = e^(−4) ≈ 0,0183 = 1,83% — angka ini artinya dari 100 bulan, sekitar 2 bulan tanpa klaim sama sekali; P(X=4) = 4^4·e^(−4)/24 ≈ 19,5%, nilai paling mungkin. Jika varians sampel jauh di atas mean (misal mean 4, varians 11), sidik jarinya tidak cocok — itu overdispersi, dan Poisson sedang berbohong.",
      tasks: [
        { id: "t1", text: "Hitung `p6` = P(tepat 6 klaim), \u03BB=4" },
        { id: "t2", text: "Hitung `p0` = P(tidak ada klaim), cetak keduanya 4 desimal" },
      ],
      expected: "p6=0.1042  p0=0.0183",
      note: {
        title: "Sering salah",
        body: "\u201CPoisson = Binomial dengan n besar, jadi selalu bisa saling ganti.\u201D Hanya jika p kecil juga (aturan praktis: n \u2265 100, p \u2264 0,05). Binomial(1000; 0,4) punya varians 240, Poisson(400) punya varians 400 \u2014 beda jauh!",
      },
      hints: [
        "import math; p6 = 4**6 * math.exp(-4) / math.factorial(6).",
        "p0 = math.exp(-4).",
        "print(f\"p6={p6:.4f}  p0={p0:.4f}\")",
      ],
      code: {
        starter: `import math\nlam = 4\n\n# TULIS KODEMU: P(tepat 6 klaim) dan P(0 klaim)\np6 = \np0 = \n\nprint(f"p6={p6:.4f}  p0={p0:.4f}")`,
        lockLines: 2,
        solution: `import math\nlam = 4\n\n# TULIS KODEMU: P(tepat 6 klaim) dan P(0 klaim)\np6 = lam**6 * math.exp(-lam) / math.factorial(6)\np0 = math.exp(-lam)\n\nprint(f"p6={p6:.4f}  p0={p0:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p6", value: 0.1042, tol: 0.001, label: "`p6` seharusnya \u2248 0,104", msg: "4^6\u00B7e^(−4)/720 \u2248 0,1042." },
          { kind: "equal", task: "t2", name: "p0", value: 0.0183, tol: 0.001, label: "`p0` seharusnya \u2248 0,018", msg: "e^(−4) \u2248 0,0183." },
          { kind: "stdout_matches", task: "t2", pattern: "p6=0\\.1042\\s+p0=0\\.0183", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Poisson: kejadian per periode. mean = varians = \u03BB.",
    },
    {
      id: "overdispersi",
      eyebrow: "Langkah 2 · Cek asumsi",
      title: "Kapasitas 7 vs rata-rata 4",
      prose: [
        "Rata-rata 4 klaim/bulan, tim bisa menangani 7 klaim/bulan \u2014 terdengar aman. Tapi P(kewalahan) = P(X>7) = 1 \u2212 P(X\u22647) \u2248 5,1% \u2014 sekitar 1 bulan kewalahan per 20 bulan. Poisson mengubah \u201Crata-rata\u201D menjadi \u201Cfrekuensi kejadian buruk\u201D.",
        "Sebelum pakai Poisson, cek rasionya: hitung mean dan varians sampel. Rasio \u2248 1 \u2192 Poisson cocok. Rasio >> 1 \u2192 overdispersi (heterogenitas) \u2192 pakai Negatif Binomial. Rasio << 1 \u2192 underdispersi (jarang).",
        "Data klaim nyata sering overdispersi karena tiap nasabah punya \u03BB berbeda \u2014 Negatif Binomial adalah \u201CPoisson yang jujur tentang heterogenitas\u201D (campuran Poisson-Gamma). Satu parameter = satu asumsi yang wajib dicek.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_kewalahan` = P(X>7) untuk Poisson(\u03BB=4)" },
        { id: "t2", text: "Cetak `p_kewalahan` sebagai persen 1 desimal" },
      ],
      expected: "p_kewalahan=5.1%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kapasitas berbasis rata-rata gagal 5% waktu. Staffing by distribution, not by mean \u2014 dipakai di call center, RS, dan tim fraud.",
      },
      hints: [
        "P(X\u22647) = jumlah pmf k=0..7; p_kewalahan = 1 - itu.",
        "Gunakan loop dengan math.factorial.",
        "print(f\"p_kewalahan={p_kewalahan:.1%}\")",
      ],
      code: {
        starter: `import math\nlam = 4\n\ndef pmf(k):\n    return lam**k * math.exp(-lam) / math.factorial(k)\n\n# TULIS KODEMU: P(klaim > 7)\np_kewalahan = \n\nprint(f"p_kewalahan={p_kewalahan:.1%}")`,
        lockLines: 5,
        solution: `import math\nlam = 4\n\ndef pmf(k):\n    return lam**k * math.exp(-lam) / math.factorial(k)\n\n# TULIS KODEMU: P(klaim > 7)\np_kewalahan = 1 - sum(pmf(k) for k in range(8))\n\nprint(f"p_kewalahan={p_kewalahan:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_kewalahan", value: 0.0511, tol: 0.002, label: "`p_kewalahan` seharusnya \u2248 5,1%", msg: "1 \u2212 \u03A3(k=0..7) pmf \u2248 0,0511." },
          { kind: "stdout_matches", task: "t2", pattern: "p_kewalahan=5\\.1%", label: "`print` menampilkan persen", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tes cepat Poisson: rasio varians/mean \u2248 1.",
    },
    {
      id: "geometrik",
      eyebrow: "Langkah 3 · Geometrik",
      title: "Berapa telepon sampai deal pertama?",
      prose: [
        "Tiap telepon deal dengan peluang 10% (independen). Ini bukan soal \u201Cjumlah dalam n tetap\u201D, melainkan waktu tunggu: wilayah Geometrik. P(X=k) = (1\u2212p)^(k\u22121)\u00B7p. E[X] = 1/p = 10 telepon.",
        "Tapi baca angkanya: P(deal pertama datang setelah telepon ke-10) = 0,9^10 \u2248 34,9%! Ekspektasi 10, tapi 35% butuh lebih dari 10. Distribusi waktu-tunggu selalu miring kanan \u2014 median cuma ~7. \u201CRata-rata 10x percobaan\u201D bukan berarti menunggu 10x itu tipikal.",
        "Sifat memoryless: P(X>m+n | X>m) = P(X>n). Sudah gagal 9x tidak mengubah peluang sukses di percobaan ke-10 \u2014 koin tidak punya ingatan. Hanya berlaku untuk Geometrik (diskret) dan Eksponensial (kontinu, B7.1).",
      ],
      formula: String.raw`P(X=k) = (1-p)^{k-1}\,p \qquad E[X] = \frac{1}{p} \qquad P(X>m+n \mid X>m) = P(X>n)`,
      formulaNote: "p = peluang sukses per percobaan; (1−p)^(k−1) = k−1 gagal dulu berurutan; × p = sukses akhirnya datang di percobaan ke-k. E[X] = 1/p: rata-rata tunggu berbanding terbalik dengan p. Sifat memoryless P(X>m+n|X>m) = P(X>n): koin tidak punya ingatan. Contoh angka: p = 10% per telepon → E[X] = 10 — angka ini artinya rata-rata butuh 10 telepon untuk satu deal; P(X>10) = 0,9^10 ≈ 0,349 — artinya peluang butuh lebih dari 10 telepon adalah 34,9%, dan setelah 10 gagal pun peluang butuh 10 lagi TETAP 34,9%. Sepuluh kegagalan tidak membuat sukses lebih dekat — itulah yang dirasakan tetapi salah.",
      tasks: [
        { id: "t1", text: "Hitung `p_lewat10` = P(deal pertama setelah telepon ke-10)" },
        { id: "t2", text: "Hitung `e_tunggu` = ekspektasi jumlah telepon, cetak keduanya" },
      ],
      expected: "p_lewat10=0.3487  e_tunggu=10.0",
      note: {
        title: "Sering salah",
        body: "\u201CSudah 9 gagal, pasti segera deal\u201D (gambler's fallacy). Memoryless: telepon ke-10 punya peluang deal tetap 10% \u2014 sama seperti telepon pertama. \u201CSudah lama menunggu\u201D tidak menaikkan peluang, kecuali p-nya sendiri berubah (learning!).",
      },
      hints: [
        "p_lewat10 = 0.9**10.",
        "e_tunggu = 1/0.1.",
        "print(f\"p_lewat10={p_lewat10:.4f}  e_tunggu={e_tunggu}\")",
      ],
      code: {
        starter: `p = 0.1  # peluang deal per telepon\n\n# TULIS KODEMU: P(X > 10) dan ekspektasi waktu tunggu\np_lewat10 = \ne_tunggu = \n\nprint(f"p_lewat10={p_lewat10:.4f}  e_tunggu={e_tunggu}")`,
        lockLines: 1,
        solution: `p = 0.1  # peluang deal per telepon\n\n# TULIS KODEMU: P(X > 10) dan ekspektasi waktu tunggu\ne_tunggu = 1 / p\np_lewat10 = (1 - p) ** 10\n\nprint(f"p_lewat10={p_lewat10:.4f}  e_tunggu={e_tunggu}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_lewat10", value: 0.3487, tol: 0.001, label: "`p_lewat10` seharusnya \u2248 0,349", msg: "0,9^10 \u2248 0,3487." },
          { kind: "equal", task: "t2", name: "e_tunggu", value: 10.0, tol: 1e-9, label: "`e_tunggu` seharusnya 10", msg: "1/0,1 = 10." },
          { kind: "stdout_matches", task: "t2", pattern: "p_lewat10=0\\.3487\\s+e_tunggu=10\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "\u201CSampai\u201D \u2192 Geometrik/NB. \u201CDari n\u201D \u2192 Binomial.",
    },
    {
      id: "lab-memoryless",
      eyebrow: "Langkah 4 · Lab memoryless",
      title: "Koin tak punya ingatan \u2014 buktikan",
      prose: [
        "Simulasikan 5.000 waktu-tunggu Geometrik(p=0,1): tiap simulasi, lempar sampai sukses pertama, catat di percobaan ke berapa. Lalu bandingkan P(X>5) dengan P(X>15 | X>10) \u2014 keduanya harus \u2248 0,9^5 \u2248 0,59.",
        "SAMA! Sudah gagal 10x tidak mengubah peluang 5 percobaan berikutnya. Inilah memoryless dalam angka, bukan sekadar slogan.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` waktu tunggu Geometrik(p=0,1)" },
        { id: "t2", text: "Hitung `p5` = P(X>5) dan `p_cond` = P(X>15 | X>10)" },
        { id: "t3", text: "Cetak keduanya dengan 3 desimal" },
      ],
      expected: "p5\u22480.590  p_cond\u22480.590",
      note: {
        title: "Sering salah",
        body: "Sunk cost fallacy: \u201Csudah keluar modal 10x gagal, masa berhenti sekarang?\u201D Peluang ke depan tetap sama \u2014 keputusan lanjut/berhenti harus dari ekspektasi ke depan, bukan dari biaya yang sudah keluar.",
      },
      hints: [
        "k=1; while random.random() >= p: k += 1.",
        "p_cond = (X>15)/(X>10).",
        "print(f\"p5={p5:.3f}  p_cond={p_cond:.3f}\")",
      ],
      code: {
        starter: `import random\nrandom.seed(17)\np, N = 0.1, 5000\nxs = []\nfor _ in range(N):\n    k = 1\n    while random.random() >= p:\n        k += 1\n    xs.append(k)\n\n# TULIS KODEMU: P(X>5) dan P(X>15 | X>10)\np5 = \np_cond = \n\nprint(f"p5={p5:.3f}  p_cond={p_cond:.3f}")`,
        lockLines: 8,
        solution: `import random\nrandom.seed(17)\np, N = 0.1, 5000\nxs = []\nfor _ in range(N):\n    k = 1\n    while random.random() >= p:\n        k += 1\n    xs.append(k)\n\n# TULIS KODEMU: P(X>5) dan P(X>15 | X>10)\np5 = sum(1 for x in xs if x > 5) / N\np_cond = sum(1 for x in xs if x > 15) / sum(1 for x in xs if x > 10)\n\nprint(f"p5={p5:.3f}  p_cond={p_cond:.3f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "p5", value: 0.5905, tol: 0.03, label: "`p5` mendekati 0,59", msg: "Teori: 0,9^5 \u2248 0,5905." },
          { kind: "equal", task: "t2", name: "p_cond", value: 0.5905, tol: 0.06, label: "`p_cond` mendekati 0,59", msg: "Memoryless: harus sama dengan P(X>5)." },
          { kind: "stdout_matches", task: "t3", pattern: "p5=0\\.\\d+\\s+p_cond=0\\.\\d+", label: "`print` menampilkan keduanya", msg: "Cetak dengan format p5=...  p_cond=... ." },
        ],
      },
      reference: "Memoryless: masa lalu tak relevan untuk peluang ke depan.",
    },
    {
      id: "negatif-binomial",
      eyebrow: "Langkah 5 · Negatif Binomial",
      title: "Sampai sukses ke-r",
      prose: [
        "Negatif Binomial(r,p): banyak percobaan sampai sukses ke-r. P(X=k) = C(k\u22121,r\u22121)\u00B7p^r\u00B7(1\u2212p)^(k\u2212r), E[X] = r/p. Contoh: \u201Cberapa nasabah dihubungi sampai 3 setuju\u201D (p=20%) \u2192 E = 3/0,2 = 15 nasabah.",
        "Peran keduanya: model count overdispersi. NB adalah campuran Poisson-Gamma \u2014 ia mengakui tiap nasabah punya \u03BB berbeda. Inilah alasan NB ada di semua software statistik untuk data klaim, pembelian, dan kunjungan.",
        "Peta keputusan: \u201Cberapa sukses dari n tetap\u201D \u2192 Binomial. \u201Cberapa kejadian per periode\u201D \u2192 Poisson. \u201Cberapa percobaan sampai 1 sukses\u201D \u2192 Geometrik. \u201CSampai r sukses\u201D / count overdispersi \u2192 Negatif Binomial.",
      ],
      formula: String.raw`P(X=k) = \binom{k-1}{r-1}\, p^r\, (1-p)^{k-r} \qquad E[X] = \frac{r}{p}`,
      formulaNote: "r = banyak sukses yang ditunggu (target); k = total percobaan sampai sukses ke-r tercapai (k ≥ r); C(k−1,r−1) = cara menempatkan r−1 sukses di k−1 percobaan pertama — percobaan ke-k PASTI sukses, jadi tidak dipilih; p^r = r sukses; (1−p)^(k−r) = sisanya gagal. E[X] = r/p: r kali tunggu Geometrik. Contoh angka: r = 3 setuju, p = 10% → E[X] = 30 — angka ini artinya rata-rata hubungi 30 nasabah untuk mendapat 3 yang setuju; P(X=30) = C(29,2)×0,1³×0,9^27 ≈ 406×0,001×0,058 ≈ 2,35%. Jika yang ditanya jumlah sukses dalam n tetap, itu Binomial — jika yang ditanya berapa percobaan sampai r sukses, ini rumahnya.",
      tasks: [
        { id: "t1", text: "Hitung `e_nb` = ekspektasi percobaan sampai 3 sukses (p=0,2)" },
        { id: "t2", text: "Cetak `e_nb`" },
      ],
      expected: "e_nb=15.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Data klaim dengan varians >> mean lalu dipaksa Poisson = ekor diremehkan = cadangan kurang. Cek rasio varians/mean dulu; kalau overdispersi, pakai Negatif Binomial.",
      },
      hints: [
        "E[X] = r / p.",
        "r=3, p=0.2 \u2192 15.",
        "print(f\"e_nb={e_nb}\")",
      ],
      code: {
        starter: `r, p = 3, 0.2  # sampai 3 nasabah setuju\n\n# TULIS KODEMU: ekspektasi jumlah percobaan\ne_nb = \n\nprint(f"e_nb={e_nb}")`,
        lockLines: 1,
        solution: `r, p = 3, 0.2  # sampai 3 nasabah setuju\n\n# TULIS KODEMU: ekspektasi jumlah percobaan\ne_nb = r / p\n\nprint(f"e_nb={e_nb}")`,
        checks: [
          { kind: "equal", task: "t1", name: "e_nb", value: 15.0, tol: 1e-9, label: "`e_nb` seharusnya 15", msg: "3/0,2 = 15." },
          { kind: "stdout_matches", task: "t2", pattern: "e_nb=15\\.0", label: "`print` menampilkan e_nb", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "NB: sampai r sukses; juga untuk count overdispersi.",
    },
    {
      id: "minicase-fraud-staff",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Berapa investigator agar kewalahan < 5%?",
      prose: [
        "Tim fraud menerima rata-rata \u03BB = 6 alert/jam (Poisson). Tiap investigator menangani 1 alert/jam. Saat ini 8 investigator/shift. P(kewalahan) = P(alert > 8) = 1 \u2212 P(X\u22648) \u2248 15,3% \u2014 cukup sering kewalahan!",
        "Cari k terkecil dengan P(X>k) < 5%: k=9 \u2192 8,4%, k=10 \u2192 4,3%. Jadi butuh 10 investigator per jam (bukan 6!). Pelajaran: kapasitas berbasis rata-rata (6) gagal 15% waktu; kapasitas berbasis distribusi (10) gagal <5%.",
        "Inilah staffing by distribution, not by mean \u2014 dipakai di call center (Erlang), RS, dan tim fraud.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p8` = P(kewalahan) dengan 8 investigator" },
        { id: "t2", text: "Hitung `p10` = P(kewalahan) dengan 10 investigator, cetak keduanya" },
      ],
      expected: "p8=15.3%  p10=4.3%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Staffing dari rata-rata = under-capacity 15% waktu. Di fraud, jam kewalahan = alert menumpuk = fraud lolos. Kapasitas harus dari kuantil distribusi, bukan mean.",
      },
      hints: [
        "P(X>k) = 1 - sum pmf(j) untuk j=0..k.",
        "Gunakan fungsi pmf dari langkah 2 dengan lam=6.",
        "print(f\"p8={p8:.1%}  p10={p10:.1%}\")",
      ],
      code: {
        starter: `import math\nlam = 6\n\ndef pmf(k):\n    return lam**k * math.exp(-lam) / math.factorial(k)\n\ndef p_kewalahan(k):\n    return 1 - sum(pmf(j) for j in range(k+1))\n\n# TULIS KODEMU: P(kewalahan) untuk 8 dan 10 investigator\np8 = \np10 = \n\nprint(f"p8={p8:.1%}  p10={p10:.1%}")`,
        lockLines: 8,
        solution: `import math\nlam = 6\n\ndef pmf(k):\n    return lam**k * math.exp(-lam) / math.factorial(k)\n\ndef p_kewalahan(k):\n    return 1 - sum(pmf(j) for j in range(k+1))\n\n# TULIS KODEMU: P(kewalahan) untuk 8 dan 10 investigator\np8 = p_kewalahan(8)\np10 = p_kewalahan(10)\n\nprint(f"p8={p8:.1%}  p10={p10:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p8", value: 0.1528, tol: 0.002, label: "`p8` seharusnya \u2248 15,3%", msg: "1 \u2212 P(X\u22648) \u2248 0,1528." },
          { kind: "equal", task: "t2", name: "p10", value: 0.0426, tol: 0.002, label: "`p10` seharusnya \u2248 4,3%", msg: "1 \u2212 P(X\u226410) \u2248 0,0426 < 5%." },
          { kind: "stdout_matches", task: "t2", pattern: "p8=15\\.3%\\s+p10=4\\.3%", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kapasitas dari kuantil distribusi, bukan dari mean.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B7.1.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: menghitung kejadian vs menunggu kejadian — kenali duniamu",
        body: "Dua pertanyaan yang terlihat mirip hidup di dunia berbeda. Berapa klaim bulan depan? — itu dunia menghitung: jendela waktu tetap, kejadian dihitung, Poisson berkuasa. Berapa lama sampai klaim berikutnya? — itu dunia menunggu: kejadian ditunggu, waktu yang diukur, Geometrik yang menjawab. Salah memilih dunia berarti memakai rumus yang menjawab pertanyaan lain. Ciri dunia menunggu: memoryless. Koin tidak punya ingatan — 10 gagal beruntun tidak membuat sukses berikutnya lebih mungkin. Setiap kali insting berkata sudah saatnya berhasil, ingat: peluang bersyaratnya sama persis seperti di awal. Praktisi memakai ini untuk SLA dan antrean: jika kejadian datang dengan laju λ per jam, rata-rata tunggunya 1/λ dan peluang menunggu lebih dari t jam meluruh cepat — tidak ada drama, tidak ada ingatan. Jebakan yang terasa: memakai Poisson saat varians jauh melebihi mean. Poisson memaksa varians sama dengan mean; data klaim nyata hampir selalu lebih liar — itu overdispersi, dan solusinya adalah distribusi yang memberi ruang bagi varians, bukan memaksa data masuk ke kotak Poisson. Kenali dulu: kamu menghitung, atau kamu menunggu?",
      },
      summary: [
        "Poisson(\u03BB): kejadian per periode; mean = varians = \u03BB.",
        "Geometrik(p): tunggu sukses pertama; E=1/p; memoryless.",
        "Negatif Binomial: tunggu sukses ke-r; juga untuk count overdispersi.",
        "\u201CDari n\u201D \u2192 Binomial; \u201Cper periode\u201D \u2192 Poisson; \u201Csampai\u201D \u2192 Geometrik/NB.",
        "Jangan pakai rata-rata untuk kapasitas \u2014 pakai distribusi.",
      ],
      next: { label: "B7.1 \u2014 Distribusi Kontinu 1", href: "/v2/learn/b7-distribusi-kontinu-1" },
      quiz: [
        {
          q: "Poisson(\u03BB=4): yang benar\u2026",
          options: [
            { text: "E=4, Var=16", why: "Salah: Var Poisson = \u03BB, bukan \u03BB\u00B2." },
            { text: "E=4, Var=4", why: "Benar: ciri Poisson \u2014 mean = varians = \u03BB.", correct: true },
            { text: "E=2, Var=4", why: "Salah: E Poisson = \u03BB = 4." },
          ],
        },
        {
          q: "Data klaim: mean=4, varians=11. Kesimpulan?",
          options: [
            { text: "Poisson cocok", why: "Salah: varians 11 >> mean 4." },
            { text: "Overdispersi \u2014 pertimbangkan Negatif Binomial", why: "Benar: varians >> mean = overdispersi (heterogenitas). Poisson murni akan meremehkan ekor.", correct: true },
            { text: "Pakai Binomial", why: "Salah: ini count per periode, bukan dari n tetap." },
          ],
        },
        {
          q: "Geometrik(0,1): sudah gagal 9x. Peluang sukses di percobaan ke-10?",
          options: [
            { text: "Lebih dari 10%", why: "Salah: gambler's fallacy \u2014 koin tak punya ingatan." },
            { text: "Tetap 10% (memoryless)", why: "Benar: memoryless. Sunk cost fallacy adalah mengira peluang naik.", correct: true },
            { text: "Kurang dari 10%", why: "Salah: tidak ada mekanisme yang menurunkan peluang." },
          ],
        },
        {
          q: "\u201CBerapa nasabah dihubungi sampai 3 setuju\u201D (p=20%) \u2192 distribusi?",
          options: [
            { text: "Binomial", why: "Salah: n tidak tetap \u2014 ini waktu tunggu." },
            { text: "Poisson", why: "Salah: bukan kejadian per periode." },
            { text: "Negatif Binomial (r=3)", why: "Benar: \u201Csampai r sukses\u201D = Negatif Binomial. E = r/p = 15 nasabah.", correct: true },
          ],
        },
        {
          q: "Aproksimasi Poisson untuk Binomial butuh\u2026",
          options: [
            { text: "n besar saja", why: "Salah: n besar tanpa p kecil tidak cukup." },
            { text: "p kecil saja", why: "Salah: p kecil tanpa n besar tidak cukup." },
            { text: "n besar DAN p kecil (np moderat)", why: "Benar: keduanya. n=1000, p=0,4 \u2192 varians beda jauh (240 vs 400) \u2014 aproksimasi gagal.", correct: true },
          ],
        },
      ],
    },
  ],
};
