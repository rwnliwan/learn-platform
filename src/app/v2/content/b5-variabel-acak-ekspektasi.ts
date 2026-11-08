import type { V2Lesson } from "../lib/types";

export const b5: V2Lesson = {
  slug: "b5-variabel-acak-ekspektasi",
  track: "Probabilitas",
  module: "Variabel Acak",
  title: "B5. Variabel Acak & Ekspektasi: Rata-rata yang Menipu",
  estMinutes: 55,
  steps: [
    {
      id: "asuransi-rv",
      eyebrow: "Langkah 1 · Variabel acak",
      title: "Asuransi yang \u201Cpasti untung\u201D?",
      prose: [
        "Perusahaan asuransi menjual 1.000 polis. Tiap polis: premi Rp1 juta, klaim Rp100 juta dengan peluang 0,5%. Ekspektasi klaim per polis = 0,005 \u00D7 100 jt = Rp500 ribu. Premi 1 jt > 500 rb \u2014 \u201Cpasti untung Rp500 ribu per polis!\u201D kata direksi.",
        "Tapi tahun itu klaim datang 12x (bukan 5x) \u2014 perusahaan rugi. Tahun lain cuma 1x \u2014 untung besar. Ekspektasi bukan janji tahunan; ia rata-rata dari banyak tahun. Dan ada yang lebih dalam: varians menentukan apakah perusahaan selamat sampai \u201Cjangka panjang\u201D itu tiba.",
        "Variabel acak X adalah fungsi yang memetakan tiap hasil ruang sampel ke bilangan real \u2014 nilai numerik dari kejadian acak. Diskret: nilai terhitung (jumlah klaim) dengan pmf p(x) = P(X=x). Kontinu: nilai di interval (return saham) dengan pdf f(x) \u2014 peluang = luas di bawah kurva. Notasi: X kapital = belum diketahui, x kecil = nilai teramati.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `e_klaim` = ekspektasi klaim per polis (rupiah)" },
        { id: "t2", text: "Hitung `e_untung` = ekspektasi untung per polis, cetak keduanya" },
      ],
      expected: "e_klaim=500000  e_untung=500000",
      note: {
        title: "Sering salah",
        body: "\u201CEkspektasi = nilai yang paling mungkin terjadi.\u201D Klaim aktual: 0 atau 100 jt \u2014 tidak pernah 500 rb. Ekspektasi = pusat gravitasi distribusi, bukan prediksi kejadian tunggal.",
      },
      hints: [
        "E[klaim] = 0.005 * 100_000_000.",
        "E[untung] = premi - E[klaim].",
        "print(f\"e_klaim={int(e_klaim)}  e_untung={int(e_untung)}\")",
      ],
      code: {
        starter: `premi, klaim, p = 1_000_000, 100_000_000, 0.005\n\n# TULIS KODEMU: ekspektasi klaim dan untung per polis\ne_klaim = \ne_untung = \n\nprint(f"e_klaim={int(e_klaim)}  e_untung={int(e_untung)}")`,
        lockLines: 1,
        solution: `premi, klaim, p = 1_000_000, 100_000_000, 0.005\n\n# TULIS KODEMU: ekspektasi klaim dan untung per polis\ne_klaim = p * klaim\ne_untung = premi - e_klaim\n\nprint(f"e_klaim={int(e_klaim)}  e_untung={int(e_untung)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "e_klaim", value: 500000, tol: 1e-9, label: "`e_klaim` seharusnya 500.000", msg: "0,005 \u00D7 100.000.000 = 500.000." },
          { kind: "equal", task: "t2", name: "e_untung", value: 500000, tol: 1e-9, label: "`e_untung` seharusnya 500.000", msg: "1.000.000 \u2212 500.000 = 500.000." },
          { kind: "stdout_matches", task: "t2", pattern: "e_klaim=500000\\s+e_untung=500000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "E[X] = \u03A3 x\u00B7P(X=x). Pusat gravitasi, bukan prediksi.",
    },
    {
      id: "ekspektasi-linearitas",
      eyebrow: "Langkah 2 · Ekspektasi",
      title: "Rata-rata tertimbang peluang + linearitas",
      prose: [
        "Ekspektasi = jumlah dari (nilai \u00D7 peluangnya) \u2014 persis weighted mean dengan peluang sebagai bobot. Contoh dadu: E[X] = 1/6 + 2/6 + \u2026 + 6/6 = 21/6 = 3,5. Perhatikan: 3,5 tidak pernah muncul di dadu!",
        "Sifat super ekspektasi: linearitas \u2014 E[aX + bY + c] = aE[X] + bE[Y] + c, berlaku SELALU, bahkan jika X,Y tidak independen, bahkan jika berkorelasi. Inilah mengapa EL portofolio = \u03A3 EL tiap kredit. Tidak ada sifat sekuat ini untuk varians.",
        "Contoh: dua dadu independen, E[X+Y] = 3,5 + 3,5 = 7 \u2014 tanpa linearitas kamu harus menjumlah 36 outcome satu per satu.",
      ],
      formula: String.raw`E[X] = \sum_x x \cdot P(X=x) \qquad E[aX+bY+c] = aE[X] + bE[Y] + c`,
      formulaNote: "E[X] = ekspektasi (rata-rata jangka panjang) X; Σ_x = jumlahkan ke semua nilai yang mungkin; x·P(X=x) = kontribusi tiap nilai, bobotnya adalah peluangnya — persis weighted mean. a, b, c = konstanta; linearitas E[aX+bY+c] = aE[X]+bE[Y]+c berlaku bahkan jika X dan Y bergantungan — makan siang gratis yang langka. Contoh angka: dadu E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3,5 — angka ini artinya rata-rata 3,5 dalam jangka panjang, BUKAN nilai yang akan muncul (dadu tidak punya muka 3,5). Praktisnya: ekspektasi total kerugian 1.000 kredit @PD 5% × Rp100 juta = 1.000 × 0,05 × 100 juta = Rp5 miliar, dihitung per kredit lalu dijumlah — tanpa perlu tahu korelasinya.",
      tasks: [
        { id: "t1", text: "Hitung `e_dadu` = ekspektasi satu dadu adil" },
        { id: "t2", text: "Hitung `e_jumlah` = E[X+Y] dua dadu via linearitas, cetak keduanya" },
      ],
      expected: "e_dadu=3.5  e_jumlah=7.0",
      note: {
        title: "Sering salah",
        body: "Menjawab \u201Clemparan berikutnya = 3,5\u201D. Ekspektasi = rata-rata dari sangat banyak pengulangan (dibuktikan B11/LLN) \u2014 3,5 bahkan tidak pernah muncul sebagai hasil dadu.",
      },
      hints: [
        "e_dadu = sum(x/6 for x in range(1,7)).",
        "Linearitas: e_jumlah = e_dadu + e_dadu.",
        "print(f\"e_dadu={e_dadu}  e_jumlah={e_jumlah}\")",
      ],
      code: {
        starter: `# TULIS KODEMU: ekspektasi dadu, lalu E[jumlah dua dadu] via linearitas\ne_dadu = \ne_jumlah = \n\nprint(f"e_dadu={e_dadu}  e_jumlah={e_jumlah}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: ekspektasi dadu, lalu E[jumlah dua dadu] via linearitas\ne_dadu = sum(x / 6 for x in range(1, 7))\ne_jumlah = e_dadu + e_dadu\n\nprint(f"e_dadu={e_dadu}  e_jumlah={e_jumlah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "e_dadu", value: 3.5, tol: 1e-9, label: "`e_dadu` seharusnya 3,5", msg: "21/6 = 3,5." },
          { kind: "equal", task: "t2", name: "e_jumlah", value: 7.0, tol: 1e-9, label: "`e_jumlah` seharusnya 7,0", msg: "Linearitas: 3,5 + 3,5 = 7." },
          { kind: "stdout_matches", task: "t2", pattern: "e_dadu=3\\.5\\s+e_jumlah=7\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Linearitas selalu berlaku \u2014 bahkan jika berkorelasi.",
    },
    {
      id: "varians",
      eyebrow: "Langkah 3 · Varians",
      title: "Seberapa liar di sekitar ekspektasi",
      prose: [
        "Varians = E[(X \u2212 E[X])\u00B2] = E[X\u00B2] \u2212 (E[X])\u00B2. Rumus cepat yang kedua terbukti satu baris dari linearitas. Akarnya, \u03C3, mengembalikan ke satuan asli. Contoh dadu: E[X\u00B2] = 91/6, Var = 91/6 \u2212 3,5\u00B2 = 35/12 \u2248 2,92, \u03C3 \u2248 1,71.",
        "Varians tidak selinier ekspektasi: Var(aX+b) = a\u00B2Var(X), dan Var(X+Y) = Var(X) + Var(Y) + 2Cov(X,Y). Independen \u2192 kovarians 0 \u2192 varians jumlah = jumlah varians. Tapi jika berkorelasi positif, varians meledak \u2014 inilah matematika di balik \u201Cdiversifikasi gagal saat krisis\u201D.",
        "Dua dadu independen: Var(X+Y) = 35/12 + 35/12 = 35/6 \u2248 5,83. Tapi jika X=Y (satu dadu dipakai dua kali \u2014 korelasi sempurna): Var(2X) = 4\u00D735/12 = 35/3 \u2248 11,67 \u2014 dua kali lipat. Inilah harga korelasi.",
      ],
      formula: String.raw`\mathrm{Var}(X) = E[X^2] - (E[X])^2 \qquad \mathrm{Var}(X+Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) + 2\,\mathrm{Cov}(X,Y)`,
      formulaNote: "Var(X) = varians, sebaran kuadrat di sekitar ekspektasi; E[X²] = rata-rata dari kuadrat nilai; (E[X])² = kuadrat dari rata-rata — urutan operasinya beda dan hasilnya beda; σ = √Var mengembalikan ke satuan asli. Rumus cepat Var = E[X²] − (E[X])² terbukti satu baris dari linearitas. Suku 2·Cov(X,Y) mengoreksi ketergantungan: positif jika bergerak searah. Contoh angka dadu: E[X²] = (1+4+9+16+25+36)/6 = 91/6 ≈ 15,167; (E[X])² = 12,25; Var = 2,917; σ ≈ 1,71 — angka ini artinya hasil lemparan tipikal menyimpang sekitar ±1,7 dari 3,5. Tanpa akar, 2,917 satuannya kuadrat-muka-dadu yang tidak bisa dibayangkan.",
      tasks: [
        { id: "t1", text: "Hitung `var_dadu` dadu adil via rumus cepat" },
        { id: "t2", text: "Hitung `var_2dadu` (independen) dan `var_korel` (korelasi sempurna)" },
        { id: "t3", text: "Cetak ketiganya dengan 2 desimal" },
      ],
      expected: "var_dadu=2.92  var_2dadu=5.83  var_korel=11.67",
      note: {
        title: "Sering salah",
        body: "\u201CVarians jumlah selalu = jumlah varians.\u201D Hanya jika tidak berkorelasi! Rumus lengkap punya suku 2Cov(X,Y). Mengabaikannya = mengabaikan risiko korelasi \u2014 dosa klasik pra-2008.",
      },
      hints: [
        "E[X\u00B2] dadu = sum(x*x/6 for x in range(1,7)).",
        "var_2dadu = var_dadu + var_dadu; var_korel = 4 * var_dadu.",
        "print(f\"var_dadu={var_dadu:.2f}  var_2dadu={var_2dadu:.2f}  var_korel={var_korel:.2f}\")",
      ],
      code: {
        starter: `# TULIS KODEMU: varians dadu, dua dadu independen, dan korelasi sempurna\ne_x2 = \nvar_dadu = \nvar_2dadu = \nvar_korel = \n\nprint(f"var_dadu={var_dadu:.2f}  var_2dadu={var_2dadu:.2f}  var_korel={var_korel:.2f}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: varians dadu, dua dadu independen, dan korelasi sempurna\ne_x2 = sum(x*x / 6 for x in range(1, 7))\nvar_dadu = e_x2 - 3.5**2\nvar_2dadu = var_dadu + var_dadu\nvar_korel = 4 * var_dadu\n\nprint(f"var_dadu={var_dadu:.2f}  var_2dadu={var_2dadu:.2f}  var_korel={var_korel:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_dadu", value: 35 / 12, tol: 1e-9, label: "`var_dadu` seharusnya 35/12", msg: "91/6 \u2212 3,5\u00B2 = 35/12 \u2248 2,92." },
          { kind: "equal", task: "t2", name: "var_2dadu", value: 35 / 6, tol: 1e-9, label: "`var_2dadu` seharusnya 35/6", msg: "Independen: jumlahkan saja \u2248 5,83." },
          { kind: "equal", task: "t2", name: "var_korel", value: 35 / 3, tol: 1e-9, label: "`var_korel` seharusnya 35/3", msg: "Korelasi sempurna: 4 \u00D7 35/12 \u2248 11,67." },
          { kind: "stdout_matches", task: "t3", pattern: "var_dadu=2\\.92\\s+var_2dadu=5\\.83\\s+var_korel=11\\.67", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Var jumlah = jumlah varians + 2\u00D7kovarians. Jangan lupakan suku terakhir.",
    },
    {
      id: "jensen",
      eyebrow: "Langkah 4 · Ketaksamaan Jensen",
      title: "Jangan colok rata-rata ke fungsi melengkung",
      prose: [
        "Untuk fungsi cembung (melengkung ke atas, misal x\u00B2 atau e^x): E[f(X)] \u2265 f(E[X]). Contoh: X = 0 (p=1/2) atau 100 (p=1/2). E[X] = 50. Tapi E[X\u00B2] = 5000 sedangkan (E[X])\u00B2 = 2500 \u2014 dua kali lipat!",
        "Mengapa penting untuk risiko? Kerugian adalah fungsi cembung dari kejadian buruk \u2014 Jensen bilang ekspektasi kerugian \u2265 kerugian dari ekspektasi kejadian. Model yang hanya memakai \u201Cskenario rata-rata\u201D sistematis meremehkan risiko. Inilah argumen matematis untuk stress testing dan distribusi penuh, bukan point forecast.",
        "Tes cepat Jensen: jika fungsinya melengkung, jangan pernah \u201Cmasukkan rata-rata ke fungsi\u201D. Hitung ekspektasi dari distribusinya. Aturan ini juga menjelaskan mengapa opsi (payoff cembung) berharga mahal saat volatilitas tinggi.",
      ],
      formula: String.raw`E[f(X)] \geq f(E[X]) \quad \text{(f cembung)}`,
      formulaNote: "f = fungsi; cembung = melengkung ke atas seperti x² atau eˣ (cekung = kebalikannya, tanda pertidaksamaan berbalik). E[f(X)] = rata-rata dari fungsi yang diterapkan ke tiap nilai; f(E[X]) = fungsi yang diterapkan ke rata-rata — urutannya menentukan. Untuk f cembung, menerapkan fungsi dulu lalu merata-rata SELALU ≥ merata-rata dulu lalu menerapkan fungsi, karena lengkungan ke atas memberi bobot lebih ke nilai ekstrem. Contoh angka: X = 0 atau 100 masing-masing 50%: E[X²] = 5.000 sedangkan (E[X])² = 2.500 — angka ini artinya mencolok rata-rata (50) ke fungsi kuadrat meremehkan jawaban benar separuhnya. Inilah mengapa spreadsheet yang memasukkan rata-rata input ke model melengkung menghasilkan angka yang salah secara sistematis.",
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` nilai X (0 atau 100, masing-masing 50%)" },
        { id: "t2", text: "Hitung `e_x2` = rata-rata X\u00B2 dan `fx_e` = (rata-rata X)\u00B2" },
        { id: "t3", text: "Cetak keduanya sebagai bilangan bulat" },
      ],
      expected: "e_x2=5000  fx_e=2500",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dosa yang diulang tiap krisis: mengganti distribusi dengan rata-ratanya. Jika loss cembung terhadap guncangan, \u201Cguncangan rata-rata\u201D memberi jawaban NOL untuk risiko yang nyata.",
      },
      hints: [
        "xs = [0 if random.random() < 0.5 else 100 for _ in range(N)].",
        "e_x2 = sum(x*x for x in xs)/N; fx_e = (sum(xs)/N)**2.",
        "print(f\"e_x2={int(e_x2)}  fx_e={int(fx_e)}\")",
      ],
      code: {
        starter: `import random\nrandom.seed(8)\nN = 5000\n\n# TULIS KODEMU: buktikan Jensen via simulasi\nxs = \ne_x2 = \nfx_e = \n\nprint(f"e_x2={int(e_x2)}  fx_e={int(fx_e)}")`,
        lockLines: 2,
        solution: `import random\nrandom.seed(8)\nN = 5000\n\n# TULIS KODEMU: buktikan Jensen via simulasi\nxs = [0 if random.random() < 0.5 else 100 for _ in range(N)]\ne_x2 = sum(x*x for x in xs) / N\nfx_e = (sum(xs) / N) ** 2\n\nprint(f"e_x2={int(e_x2)}  fx_e={int(fx_e)}")`,
        checks: [
          { kind: "equal", task: "t2", name: "e_x2", value: 5000, tol: 300, label: "`e_x2` mendekati 5000", msg: "Rata-rata X\u00B2 harus dekat 5000 (teori: tepat 5000)." },
          { kind: "equal", task: "t2", name: "fx_e", value: 2500, tol: 300, label: "`fx_e` mendekati 2500", msg: "(Rata-rata X)\u00B2 harus dekat 2500." },
          { kind: "stdout_matches", task: "t3", pattern: "e_x2=\\d+\\s+fx_e=\\d+", label: "`print` menampilkan keduanya", msg: "Cetak dengan format e_x2=...  fx_e=... ." },
        ],
      },
      reference: "E[f(X)] \u2212 f(E[X]) = Var(X) untuk f(x)=x\u00B2. Selisihnya persis varians.",
    },
    {
      id: "minicase-premi",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Pricing premi yang adil (dan selamat)",
      prose: [
        "Asuransi mikro: 5.000 nasabah, klaim Rp20 juta dengan peluang 1%/tahun, biaya operasional Rp50 ribu/polis. Premi minimum agar ekspektasi impas: E[klaim] = 0,01 \u00D7 20 jt = Rp200 ribu \u2192 premi = 200 rb + 50 rb = Rp250 ribu.",
        "Mengapa premi aktual harus lebih tinggi? Karena satu tahun buruk bisa membunuh perusahaan sebelum \u201Cjangka panjang\u201D tiba. Premi aktual = 250 rb + risk loading (buffer modal) + margin. Risk loading dihitung dari varians/ekor distribusi klaim \u2014 bukan dari ekspektasi.",
        "SD klaim per polis = \u221A(0,01\u00D70,99)\u00D720 jt \u2248 Rp1,99 jt \u2014 10x ekspektasinya! Untuk 5.000 polis independen, SD total = \u221A5000 \u00D7 1,99 jt \u2248 Rp141 jt vs ekspektasi total Rp1 M. Rasio inilah yang menentukan buffer modal. Makin banyak polis, rasio SD/mean makin kecil \u2014 akar dari hukum bilangan besar (B11).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `premi_impas` per polis (rupiah)" },
        { id: "t2", text: "Hitung `sd_total_jt` = SD total klaim 5.000 polis (juta rupiah)" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "premi_impas=250000  sd_total_jt=141",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "\u201CEkspektasi untung 500 rb\u201D tanpa varians = setengah cerita \u2014 seperti mean tanpa SD. Modal disiapkan dari varians klaim, bukan dari ekspektasi.",
      },
      hints: [
        "premi_impas = 0.01*20_000_000 + 50_000.",
        "SD per polis = (0.01*0.99)**0.5 * 20 jt; SD total = SD * 5000**0.5.",
        "Bagi 1e6 untuk juta rupiah, bulatkan int.",
      ],
      code: {
        starter: `import math\nn, p, klaim, biaya = 5000, 0.01, 20_000_000, 50_000\n\n# TULIS KODEMU: premi impas dan SD total\npremi_impas = \nsd_total_jt = \n\nprint(f"premi_impas={int(premi_impas)}  sd_total_jt={int(sd_total_jt)}")`,
        lockLines: 1,
        solution: `import math\nn, p, klaim, biaya = 5000, 0.01, 20_000_000, 50_000\n\n# TULIS KODEMU: premi impas dan SD total\npremi_impas = p * klaim + biaya\nsd_total_jt = math.sqrt(p*(1-p)) * klaim * math.sqrt(n) / 1e6\n\nprint(f"premi_impas={int(premi_impas)}  sd_total_jt={int(sd_total_jt)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "premi_impas", value: 250000, tol: 1e-9, label: "`premi_impas` seharusnya 250.000", msg: "0,01 \u00D7 20 jt + 50 rb = 250 rb." },
          { kind: "equal", task: "t2", name: "sd_total_jt", value: 140.7, tol: 1, label: "`sd_total_jt` seharusnya \u2248 141", msg: "\u221A(0,01\u00D70,99)\u00D720 jt\u00D7\u221A5000/1e6 \u2248 140,7." },
          { kind: "stdout_matches", task: "t3", pattern: "premi_impas=250000\\s+sd_total_jt=14", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Impas ekspektasi \u2260 aman. Buffer modal dari varians.",
    },
    {
      id: "linearitas-jensen-quiz",
      eyebrow: "Langkah 6 · Cek cepat",
      title: "Linearitas dan Jensen dalam dua soal",
      prose: [
        "Dua pertanyaan untuk mengunci dua sifat terpenting lesson ini sebelum checkpoint.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Linearitas E[X+Y] = E[X]+E[Y] berlaku\u2026",
          options: [
            { text: "Hanya jika independen", why: "Salah: linearitas tidak butuh independensi sama sekali." },
            { text: "Hanya jika identik", why: "Salah: X dan Y boleh beda distribusi." },
            { text: "Selalu, bahkan jika berkorelasi", why: "Benar: selalu. Ini sifat terkuat ekspektasi \u2014 dan alasan EL portofolio bisa dijumlah.", correct: true },
          ],
        },
        {
          q: "X = 0/100 masing-masing 50%. E[X\u00B2] vs (E[X])\u00B2:",
          options: [
            { text: "Sama = 2500", why: "Salah: itu baru benar jika X konstan (varians nol)." },
            { text: "E[X\u00B2]=5000 > 2500 \u2014 Jensen", why: "Benar: 5000 > 2500. Fungsi x\u00B2 cembung \u2192 E[f(X)] > f(E[X]). Selisihnya = Var(X).", correct: true },
            { text: "E[X\u00B2]=2500 < 5000", why: "Salah: arah ketaksamaannya terbalik." },
          ],
        },
      ],
      note: {
        title: "Intuisi: ekspektasi boleh dijumlah, tapi jangan dicolok ke fungsi yang melengkung",
        body: "Linearitas ekspektasi adalah makan siang gratis yang langka di statistika: E[aX+bY+c] = aE[X]+bE[Y]+c berlaku bahkan ketika X dan Y saling bergantungan. Praktisi memakainya untuk memecah masalah besar menjadi potongan kecil — ekspektasi total kerugian portofolio adalah jumlah ekspektasi tiap kredit, tanpa perlu tahu korelasinya. Tetapi gratisnya berhenti di fungsi nonlinear. Jensen berkata E[f(X)] tidak sama dengan f(E[X]) untuk fungsi melengkung, dan selisihnya bukan soal pembulatan — untuk X bernilai 0 atau 100, E[X²] = 5000 sedangkan (E[X])² = 2500, separuhnya hilang. Jebakan spreadsheet paling klasik: memasukkan rata-rata input ke model yang melengkung, lalu mengira outputnya adalah rata-rata output. Harga opsi, risiko ekor, utilitas — semuanya melengkung. Aturan praktisnya: jika fungsinya lurus, colok rata-ratanya; jika melengkung, pakai distribusinya — skenario, simulasi, atau integral. Setiap kali kamu tergoda menulis f(rata-rata), berhentilah dan tanyakan: melengkung ke mana fungsi ini? Jawabannya menentukan apakah angkamu jujur atau menipu. Ingat juga arahnya: untuk fungsi cekung seperti log atau akar, pertidaksamaannya berbalik — E[f(X)] ≤ f(E[X]).",
      },

      reference: "Linearitas selalu. Jensen untuk fungsi melengkung.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B6.",
      ],
      tasks: [],
      summary: [
        "Variabel acak: angka dari kejadian acak; diskret (pmf) vs kontinu (pdf).",
        "Ekspektasi = rata-rata tertimbang peluang = rata-rata jangka panjang; linearitas selalu berlaku.",
        "Varians = E[(X\u2212E[X])\u00B2]; varians jumlah memuat kovarians \u2014 jangan lupakan.",
        "Jensen: fungsi cembung \u2192 E[f(X)] \u2265 f(E[X]) \u2014 jangan colok rata-rata ke fungsi melengkung.",
        "Jangan tafsirkan ekspektasi sebagai prediksi kejadian tunggal.",
      ],
      next: { label: "B6.1 \u2014 Distribusi Diskret 1", href: "/v2/learn/b6-distribusi-diskret-1" },
      quiz: [
        {
          q: "E[X] = 3,5 untuk dadu. Artinya\u2026",
          options: [
            { text: "Lemparan berikutnya 3,5", why: "Salah: 3,5 tidak pernah muncul sebagai hasil dadu." },
            { text: "Rata-rata dari sangat banyak lemparan \u2192 3,5", why: "Benar: ekspektasi = rata-rata jangka panjang (LLN, B11).", correct: true },
            { text: "3,5 paling sering muncul", why: "Salah: itu definisi modus, bukan ekspektasi." },
            { text: "Setengah lemparan di atas 3,5", why: "Salah: itu definisi median." },
          ],
        },
        {
          q: "Var(X+Y) = Var(X)+Var(Y) + 2Cov(X,Y). Jika Cov positif besar\u2026",
          options: [
            { text: "Varians total lebih kecil", why: "Salah: suku kovarians positif menambah, bukan mengurangi." },
            { text: "Varians total lebih besar \u2014 diversifikasi gagal", why: "Benar: korelasi positif menggembungkan varians \u2014 matematika di balik \u201Csemua jatuh bareng saat krisis\u201D.", correct: true },
            { text: "Tidak ada efek", why: "Salah: justru itu efek utamanya." },
            { text: "Ekspektasi berubah", why: "Salah: ekspektasi tidak terpengaruh kovarians." },
          ],
        },
        {
          q: "Mengapa model \u201Cskenario rata-rata\u201D meremehkan risiko jika loss cembung?",
          options: [
            { text: "Karena rata-rata selalu salah", why: "Salah: rata-ratanya bisa tepat \u2014 masalahnya fungsinya melengkung." },
            { text: "Jensen: E[loss] > loss(E[kejadian])", why: "Benar: ekspektasi dari fungsi cembung lebih besar dari fungsi di titik rata-rata.", correct: true },
            { text: "Karena varians nol", why: "Salah: varians justru tidak nol \u2014 itu masalahnya." },
          ],
        },
        {
          q: "Huruf kapital X vs kecil x: yang benar\u2026",
          options: [
            { text: "Sama saja", why: "Salah: konvensi ini mencegah kebingungan di rumus-rumus." },
            { text: "X = variabel acak, x = nilai teramati", why: "Benar: P(X=x) = peluang variabel acak X bernilai x.", correct: true },
            { text: "X = konstanta", why: "Salah: kebalikannya." },
          ],
        },
        {
          q: "Premi impas ekspektasi Rp250 ribu untuk asuransi mikro. Mengapa premi aktual harus lebih tinggi?",
          options: [
            { text: "Agar untung lebih besar saja", why: "Salah: alasannya risiko, bukan keserakahan." },
            { text: "Satu tahun buruk bisa membunuh perusahaan sebelum jangka panjang tiba \u2014 butuh buffer dari varians", why: "Benar: risk loading dihitung dari varians/ekor distribusi klaim, bukan dari ekspektasi.", correct: true },
            { text: "Karena ekspektasinya salah hitung", why: "Salah: ekspektasinya benar \u2014 tapi ekspektasi bukan janji tahunan." },
          ],
        },
      ],
    },
  ],
};
