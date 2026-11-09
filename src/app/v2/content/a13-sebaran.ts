import type { V2Lesson } from "../lib/types";

export const a13: V2Lesson = {
  slug: "a13-sebaran",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.3 Ukuran Sebaran: Mean Sama, Nasib Beda",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-dua-cabang",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "NPL sama-sama 3%, satu cabang kolaps",
      prose: [
        "Tahun 2023, dua cabang Bank Maju Jaya sama-sama melaporkan NPL rata-rata 3% selama lima tahun. Direksi memberi keduanya rapor sehat dan modal cadangan yang sama. Cabang Harmoni: 2,8 – 3,1 – 2,9 – 3,2 – 3,0 persen. Stabil. Cabang Glodok: 0,5 – 0,8 – 1,2 – 2,0 – 10,5 persen. Rata-ratanya juga 3%.",
        "Tahun 2024, satu debitur korporasi Glodok gagal bayar Rp 40 miliar. Cadangan yang disiapkan untuk rata-rata 3% jebol dalam sebulan. Angka rata-ratanya benar — tapi tanpa sebaran, angka itu dusta. Hari ini kamu bedah tujuh cara mengukur sebaran, dan kapan masing-masing berbohong.",
      ],
      tasks: [
        { id: "t1", text: "Hitung rata-rata NPL `rata_h` (Harmoni) dan `rata_g` (Glodok)" },
        { id: "t2", text: "Hitung `range_h` dan `range_g` kedua cabang" },
      ],
      expected: "rata_h=3.0  rata_g=3.0  range_h=0.4  range_g=10.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dua portofolio dengan expected loss sama tapi volatilitas beda → modal yang dibutuhkan beda jauh. Cadangan untuk Glodok harus menutupi lonjakan 10,5%, bukan rata-rata 3%.",
      },
      hints: [
        "Rata-rata = sum(data) / len(data).",
        "Range = max(data) − min(data).",
        "range_g = max(glodok) - min(glodok)",
      ],
      code: {
        starter: `harmoni = [2.8, 3.1, 2.9, 3.2, 3.0]\nglodok  = [0.5, 0.8, 1.2, 2.0, 10.5]\n\n# TULIS KODEMU\nrata_h = \nrata_g = \nrange_h = \nrange_g = \n\nprint(f"rata_h={rata_h:.1f}  rata_g={rata_g:.1f}  range_h={range_h:.1f}  range_g={range_g:.1f}")`,
        lockLines: 2,
        solution: `harmoni = [2.8, 3.1, 2.9, 3.2, 3.0]\nglodok  = [0.5, 0.8, 1.2, 2.0, 10.5]\n\n# TULIS KODEMU\nrata_h = sum(harmoni)/len(harmoni)\nrata_g = sum(glodok)/len(glodok)\nrange_h = max(harmoni)-min(harmoni)\nrange_g = max(glodok)-min(glodok)\n\nprint(f"rata_h={rata_h:.1f}  rata_g={rata_g:.1f}  range_h={range_h:.1f}  range_g={range_g:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata_h", value: 3.0, tol: 1e-9, label: "`rata_h` seharusnya 3.0", msg: "Harmoni: 15,0/5 = 3,0." },
          { kind: "equal", task: "t1", name: "rata_g", value: 3.0, tol: 1e-9, label: "`rata_g` seharusnya 3.0", msg: "Glodok: 15,0/5 = 3,0 — sama persis dengan Harmoni." },
          { kind: "equal", task: "t2", name: "range_h", value: 0.4, tol: 1e-9, label: "`range_h` seharusnya 0.4", msg: "3,2 − 2,8 = 0,4." },
          { kind: "equal", task: "t2", name: "range_g", value: 10.0, tol: 1e-9, label: "`range_g` seharusnya 10.0", msg: "10,5 − 0,5 = 10,0 — 25 kali range Harmoni." },
          { kind: "stdout_matches", task: "t2", pattern: "range_h=0\\.4\\s+range_g=10\\.0", label: "`print` menampilkan keempat angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "sum(list), len(list), max(list), min(list).",
    },
    {
      id: "range-variansi",
      eyebrow: "Langkah 2 · Range dan variansi",
      title: "Range: intip ujung. Variansi: akuntan bisu",
      prose: [
        "Range = nilai terbesar − nilai terkecil. Data DPD (hari): 40, 73, 75, 77, 100 → range 60. Tapi range hanya memakai 2 titik; tiga data di tengah tidak memengaruhi hasil sama sekali. Range 60 bisa berarti data tersebar merata — atau 9 data menumpuk di satu titik plus 1 outlier. Range tidak bisa membedakan keduanya.",
        "Variansi = rata-rata kuadrat jarak tiap data dari rata-rata. Data 8, 10, 12 (juta Rp), mean 10: simpangan −2, 0, 2 → kuadrat 4, 0, 4 → jumlahkan lalu bagi (n−1): 4. Itulah variansi sampel. Koreksi (n−1) disebut koreksi Bessel: simpangan yang dihitung dari data sendiri terlihat lebih kecil dari sebenarnya, jadi pembaginya dikurangi satu agar tidak bias.",
      ],
      formula: String.raw`s^2 = \frac{\sum_{i=1}^{n}(x_i - \bar{x})^2}{n-1}`,
      formulaNote: "s^2 = variansi sampel; x_i = data ke-i; x-bar = rata-rata; n-1 = derajat bebas (koreksi Bessel agar tak bias).",
      tasks: [
        { id: "t1", text: "Hitung `range_dpd` dari data DPD" },
        { id: "t2", text: "Hitung variansi sampel `var_s` dari `gaji` (bagi dengan n−1)" },
      ],
      expected: "range_dpd=60  var_s=4.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Range besar = data bervariasi merata. Salah: range 60 bisa murni ulah satu titik ekstrem. Jangan jadikan range satu-satunya ukuran — pakai SD atau IQR untuk memastikan variasinya merata.",
      },
      hints: [
        "Range = max(data) − min(data).",
        "Variansi sampel: sum((x-mean)**2 for x in data)/(len(data)-1).",
        "Hitung mean dulu, lalu simpangannya.",
      ],
      code: {
        starter: `dpd  = [40, 73, 75, 77, 100]\ngaji = [8, 10, 12]  # juta Rp\n\n# TULIS KODEMU\nrange_dpd = \nmean = sum(gaji)/len(gaji)\nvar_s = \n\nprint(f"range_dpd={range_dpd}  var_s={var_s}")`,
        lockLines: 2,
        solution: `dpd  = [40, 73, 75, 77, 100]\ngaji = [8, 10, 12]  # juta Rp\n\n# TULIS KODEMU\nrange_dpd = max(dpd)-min(dpd)\nmean = sum(gaji)/len(gaji)\nvar_s = sum((x-mean)**2 for x in gaji)/(len(gaji)-1)\n\nprint(f"range_dpd={range_dpd}  var_s={var_s}")`,
        checks: [
          { kind: "equal", task: "t1", name: "range_dpd", value: 60, tol: 1e-9, label: "`range_dpd` seharusnya 60", msg: "100 − 40 = 60 hari." },
          { kind: "equal", task: "t2", name: "var_s", value: 4.0, tol: 1e-9, label: "`var_s` seharusnya 4.0", msg: "(4+0+4)/(3−1) = 4. Jangan lupa koreksi Bessel (n−1)." },
          { kind: "stdout_matches", task: "t2", pattern: "range_dpd=60\\s+var_s=4(\\.0)?", label: "`print` menampilkan keduanya", msg: "Format: range_dpd=...  var_s=... ." },
        ],
      },
      reference: "Variansi sampel: sum((x-mean)**2)/(n-1). Satuan kuadrat — jangan tampilkan mentah ke manajemen.",
    },
    {
      id: "sd-aturan-empiris",
      eyebrow: "Langkah 3 · Standar deviasi",
      title: "SD: penerjemah variansi ke bahasa manusia",
      prose: [
        "SD = akar variansi — mengembalikan sebaran ke satuan asli. Variansi sampel tadi = 4 (juta Rp)² → SD = Rp 2 juta. Interpretasi bisnis yang tepat: akar rata-rata KUADRAT simpangan ≈ Rp 2 juta — bukan rata-rata simpangan absolutnya (mean absolute deviation data ini hanya (2+0+2)/3 ≈ Rp 1,33 juta). SD dan rata-rata simpangan absolut adalah dua ukuran berbeda; jangan baca SD sebagai \"rata-rata selisih\" mentah.",
        "Untuk data yang mendekati normal berlaku aturan empiris: ±1 SD ≈ 68% data, ±2 SD ≈ 95%, ±3 SD ≈ 99,7%. Tapi hati-hati: SD kecil bukan berarti risiko rendah — semua debitur DPD 89 hari memberi SD kecil, padahal semuanya hampir macet. Selalu baca SD bersama mean-nya.",
      ],
      formula: String.raw`s = \sqrt{\frac{\sum_{i=1}^{n}(x_i - \bar{x})^2}{n-1}}`,
      formulaNote: "s = simpangan baku sampel = akar variansi; mengembalikan sebaran ke satuan asli data — penerjemah variansi ke bahasa manusia.",
      tasks: [
        { id: "t1", text: "Hitung SD `sd` dari `gaji` (akar variansi sampel)" },
        { id: "t2", text: "Hitung batas `low` dan `high` = mean ± 2×SD" },
      ],
      expected: "sd=2.0  low=6.0  high=14.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "SD kecil = risiko rendah. Salah: SD kecil hanya berarti data menumpuk rapat — bisa menumpuk di tempat yang buruk. SD menjawab seberapa menyebar, bukan seberapa baik.",
      },
      hints: [
        "SD = variansi ** 0.5, atau pakai statistics.stdev.",
        "Batas bawah = mean − 2×sd; batas atas = mean + 2×sd.",
        "low = mean - 2*sd",
      ],
      code: {
        starter: `import statistics as st\n\ngaji = [8, 10, 12]  # juta Rp\n\n# TULIS KODEMU\nsd = \nmean = st.mean(gaji)\nlow = \nhigh = \n\nprint(f"sd={sd}  low={low}  high={high}")`,
        lockLines: 3,
        solution: `import statistics as st\n\ngaji = [8, 10, 12]  # juta Rp\n\n# TULIS KODEMU\nsd = st.stdev(gaji)\nmean = st.mean(gaji)\nlow = mean - 2*sd\nhigh = mean + 2*sd\n\nprint(f"sd={sd}  low={low}  high={high}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd", value: 2.0, tol: 1e-9, label: "`sd` seharusnya 2.0", msg: "Akar dari variansi sampel 4 = 2." },
          { kind: "equal", task: "t2", name: "low", value: 6.0, tol: 1e-9, label: "`low` seharusnya 6.0", msg: "10 − 2×2 = 6." },
          { kind: "equal", task: "t2", name: "high", value: 14.0, tol: 1e-9, label: "`high` seharusnya 14.0", msg: "10 + 2×2 = 14." },
          { kind: "stdout_matches", task: "t2", pattern: "sd=2(\\.0)?\\s+low=6(\\.0)?\\s+high=14(\\.0)?", label: "`print` menampilkan ketiganya", msg: "Format: sd=...  low=...  high=... ." },
        ],
      },
      reference: "st.stdev(list). Aturan empiris 68–95–99,7 hanya untuk data mendekati normal.",
    },
    {
      id: "iqr",
      eyebrow: "Langkah 4 · IQR",
      title: "IQR: penjaga tengah yang kebal outlier",
      prose: [
        "IQR = Q3 − Q1: lebar 50% data di tengah. 25% terbawah dan 25% teratas — tempat outlier bersembunyi — diabaikan total. Data 1, 3, 5, 7, 9, 11, 13, 100: Q1 = median separuh bawah (1,3,5,7) = 4; Q3 = median separuh atas (9,11,13,100) = 12; IQR = 8.",
        "Outlier 100 tidak menggerakkan IQR sama sekali — bandingkan dengan SD data ini (≈ 32) yang hancur oleh satu angka. Diagnostik senior: bandingkan SD vs IQR/1,35 — tetapi ingat, perbandingan IQR/1,35 ≈ SD HANYA berlaku untuk data yang mendekati normal (untuk normal, IQR = 1,349σ). Di luar normalitas, selisihnya belum tentu berarti outlier. Kalau SD jauh lebih besar dari IQR/1,35 pada data yang diduga normal, ada outlier atau skew yang sedang disembunyikan SD."
      ],
      formula: String.raw`\text{IQR} = Q_3 - Q_1`,
      formulaNote: "IQR = rentang interkuartil; Q1 = kuartil bawah (persentil 25); Q3 = kuartil atas (persentil 75); lebar 50 persen data di tengah — kebal outlier.",
      tasks: [
        { id: "t1", text: "Hitung `q1` = median separuh bawah" },
        { id: "t2", text: "Hitung `q3` = median separuh atas" },
        { id: "t3", text: "Hitung `iqr` = q3 − q1" },
      ],
      expected: "q1=4.0  q3=12.0  iqr=8.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Kalau SD sudah dihitung, IQR tidak perlu. Justru selisih SD vs IQR adalah diagnostik — dengan syarat data mendekati normal, karena IQR/1,35 ≈ SD hanya untuk distribusi normal: SD ≈ IQR/1,35 berarti data relatif bersih; SD jauh lebih besar berarti ada outlier yang sedang ditutupi SD."
      },
      hints: [
        "Modul statistics sudah diimpor sebagai st.",
        "Separuh bawah = 4 angka pertama, separuh atas = 4 angka terakhir.",
        "iqr = q3 - q1",
      ],
      code: {
        starter: `import statistics as st\n\nd = [1, 3, 5, 7, 9, 11, 13, 100]\nbawah, atas = d[:4], d[4:]\n\n# TULIS KODEMU\nq1 = \nq3 = \niqr = \n\nprint(f"q1={q1}  q3={q3}  iqr={iqr}")`,
        lockLines: 4,
        solution: `import statistics as st\n\nd = [1, 3, 5, 7, 9, 11, 13, 100]\nbawah, atas = d[:4], d[4:]\n\n# TULIS KODEMU\nq1 = st.median(bawah)\nq3 = st.median(atas)\niqr = q3 - q1\n\nprint(f"q1={q1}  q3={q3}  iqr={iqr}")`,
        checks: [
          { kind: "equal", task: "t1", name: "q1", value: 4.0, tol: 1e-9, label: "`q1` seharusnya 4.0", msg: "Median dari (1,3,5,7) = (3+5)/2 = 4." },
          { kind: "equal", task: "t2", name: "q3", value: 12.0, tol: 1e-9, label: "`q3` seharusnya 12.0", msg: "Median dari (9,11,13,100) = (11+13)/2 = 12." },
          { kind: "equal", task: "t3", name: "iqr", value: 8.0, tol: 1e-9, label: "`iqr` seharusnya 8.0", msg: "12 − 4 = 8. Outlier 100 tidak ikut campur." },
          { kind: "stdout_matches", task: "t3", pattern: "q1=4(\\.0)?\\s+q3=12(\\.0)?\\s+iqr=8(\\.0)?", label: "`print` menampilkan ketiganya", msg: "Format: q1=...  q3=...  iqr=... ." },
        ],
      },
      reference: "IQR = Q3 − Q1. Pasangan median+IQR = ringkasan robust untuk data kotor.",
    },
    {
      id: "mad",
      eyebrow: "Langkah 5 · MAD",
      title: "MAD: median dipakai dua kali",
      prose: [
        "MAD = median dari jarak absolut tiap data ke median: penyimpangan tipikal dari nilai tipikal. Data 1, 3, 5, 7, 100, median 5: jarak absolutnya 4, 2, 0, 2, 95 → median jarak-jarak itu = 2.",
        "Jarak raksasa 95 tenggelam tanpa jejak — SD data ini ≈ 42, 21x lipat lebih panik dari MAD. Breakdown point MAD 50%: separuh datamu boleh rusak total dan dia tetap waras. Inilah praktik deteksi outlier yang umum di sistem fraud: flag transaksi jika |x − median| > 3 × MAD — dengan catatan, untuk data normal MAD ≈ 0,6745σ sehingga 3 × MAD ≈ 2,02σ, BUKAN setara 3-sigma; ambang ini lebih ketat dari 3-sigma. Bila ingin setara 3-sigma, pakai ≈ 4,45 × MAD (3/0,6745)."
      ],
      formula: String.raw`\text{MAD} = \text{median}(|x_i - \text{median}(x)|)`,
      formulaNote: "MAD = median absolute deviation; median(x) = median data; |x_i - median(x)| = jarak absolut tiap data ke median; median dari jarak-jarak itu = penyimpangan tipikal.",
      tasks: [
        { id: "t1", text: "Hitung `med` = median data" },
        { id: "t2", text: "Hitung `mad` = median jarak absolut ke median" },
      ],
      expected: "med=5  mad=2",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk aturan deteksi fraud otomatis, pakai MAD bukan SD: threshold berbasis SD ikut membesar saat ada fraud besar, sehingga fraud justru lolos. |x − median| > 3×MAD adalah aturan robust — tetapi jangan sebut \"ala 3-sigma\": 3×MAD ≈ 2,02σ untuk data normal, lebih ketat dari 3-sigma (setara 3-sigma ≈ 4,45×MAD)."
      },
      hints: [
        "med = st.median(d).",
        "Jarak absolut: [abs(x-med) for x in d].",
        "mad = st.median(jarak itu)",
      ],
      code: {
        starter: `import statistics as st\n\nd = [1, 3, 5, 7, 100]\n\n# TULIS KODEMU\nmed = \njarak = \nmad = \n\nprint(f"med={med}  mad={mad}")`,
        lockLines: 3,
        solution: `import statistics as st\n\nd = [1, 3, 5, 7, 100]\n\n# TULIS KODEMU\nmed = st.median(d)\njarak = [abs(x-med) for x in d]\nmad = st.median(jarak)\n\nprint(f"med={med}  mad={mad}")`,
        checks: [
          { kind: "equal", task: "t1", name: "med", value: 5, tol: 1e-9, label: "`med` seharusnya 5", msg: "Nilai tengah dari [1,3,5,7,100] = 5." },
          { kind: "equal", task: "t2", name: "mad", value: 2, tol: 1e-9, label: "`mad` seharusnya 2", msg: "Jarak: [4,2,0,2,95] → median dari [0,2,2,4,95] = 2." },
          { kind: "stdout_matches", task: "t2", pattern: "med=5\\s+mad=2", label: "`print` menampilkan keduanya", msg: "Format: med=...  mad=... ." },
        ],
      },
      reference: "MAD = median(|x − median|). Kebal karena median dipakai dua kali.",
    },
    {
      id: "cv-semidev",
      eyebrow: "Langkah 6 · CV dan semi-deviation",
      title: "CV membandingkan skala beda; semi-dev hanya peduli sisi buruk",
      prose: [
        "CV = SD/mean × 100%: volatilitas per unit nilai. Saham A: mean Rp 10.000, SD Rp 1.000 → CV 10%. Saham B: mean Rp 100.000, SD Rp 5.000 → CV 5%. SD B lima kali A, tapi relatif terhadap harganya A dua kali lebih volatil. Syaratnya: mean tidak boleh nol atau negatif.",
        "Semi-deviation seperti SD tapi hanya menghitung simpangan di bawah target — volatilitas ke atas bukan risiko. Return 5 tahun 12%, 15%, −4%, 10%, 6%, target 8%: yang dihitung hanya −4% dan 6% → simpangan kuadrat 144 dan 4 → semidev = √(148/5) ≈ 5,44%. Tahun-tahun bagus tidak mengurangi risiko — benar secara intuisi: tidak ada investor yang mengeluh portofolionya naik terlalu konsisten.",
      ],
      formula: String.raw`\text{CV} = \frac{s}{\bar{x}} \times 100\% \qquad \text{Semidev} = \sqrt{\frac{\sum_{x_i < T}(x_i - T)^2}{n}}`,
      formulaNote: "CV = coefficient of variation: SD relatif terhadap mean, dalam persen — untuk membandingkan volatilitas aset beda skala; Semidev = simpangan hanya untuk x_i di bawah target T — volatilitas ke atas bukan risiko.",
      tasks: [
        { id: "t1", text: "Hitung `cv_a` dan `cv_b` (persen) kedua saham" },
        { id: "t2", text: "Hitung `semidev` return reksadana vs target 8 (2 desimal)" },
      ],
      expected: "cv_a=10.0  cv_b=5.0  semidev=5.44",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "SD lebih besar = lebih berisiko, titik. Salah: SD absolut tanpa konteks skala menyesatkan. Portofolio Rp 10 M dengan SD Rp 100 jt (CV 1%) jauh lebih tenang dari portofolio Rp 500 jt dengan SD Rp 50 jt (CV 10%). Risiko yang dibandingkan harus relatif.",
      },
      hints: [
        "cv = sd/mean*100.",
        "Untuk semidev: saring return < 8 dulu.",
        "semidev = (sum((r-8)**2 for r in bawah)/len(rets))**0.5",
      ],
      code: {
        starter: `rets = [12, 15, -4, 10, 6]  # persen\ntarget = 8\n\n# TULIS KODEMU\ncv_a = \ncv_b = \nbawah = \nsemidev = \n\nprint(f"cv_a={cv_a}  cv_b={cv_b}  semidev={semidev:.2f}")`,
        lockLines: 2,
        solution: `rets = [12, 15, -4, 10, 6]  # persen\ntarget = 8\n\n# TULIS KODEMU\ncv_a = 1000/10000*100\ncv_b = 5000/100000*100\nbawah = [r for r in rets if r < target]\nsemidev = (sum((r-target)**2 for r in bawah)/len(rets))**0.5\n\nprint(f"cv_a={cv_a}  cv_b={cv_b}  semidev={semidev:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cv_a", value: 10.0, tol: 1e-9, label: "`cv_a` seharusnya 10.0", msg: "1000/10000 × 100% = 10%." },
          { kind: "equal", task: "t1", name: "cv_b", value: 5.0, tol: 1e-9, label: "`cv_b` seharusnya 5.0", msg: "5000/100000 × 100% = 5%." },
          { kind: "equal", task: "t2", name: "semidev", value: 5.44, tol: 0.01, label: "`semidev` seharusnya 5.44", msg: "√((144+4)/5) = √29,6 ≈ 5,44. Bagi dengan total 5 tahun, bukan 2." },
          { kind: "stdout_matches", task: "t2", pattern: "cv_a=10(\\.0)?\\s+cv_b=5(\\.0)?\\s+semidev=5\\.44", label: "`print` menampilkan ketiganya", msg: "Format: cv_a=...  cv_b=...  semidev=... ." },
        ],
      },
      reference: "CV = sd/mean×100%. Semidev: saring x < target, kuadratkan, rata-ratakan, akarkan.",
    },
    {
      id: "minicase-portofolio",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Dua portofolio, expected loss sama, modal beda jauh",
      prose: [
        "Kamu analis risiko. Dua portofolio KUR, masing-masing 2.000 debitur. Kerugian tahunan (% outstanding) 5 tahun terakhir. Portofolio P (ritel mikro): 1,8 – 2,1 – 2,0 – 1,9 – 2,2 → mean 2,0%. Portofolio Q (korporasi kecil): 0,5 – 0,8 – 1,2 – 2,5 – 5,0 → mean 2,0%.",
        "Direktur bertanya: expected loss sama, jadi modal cadangannya sama, kan? Hitung SD keduanya: P ≈ 0,158% (SD sampel), Q ≈ 1,842% — rasio 1,842/0,158 ≈ 11,66, dibulatkan 12x — SD Q ~12x SD P dengan mean yang identik. Jawabanmu: tidak, modalnya tidak sama. Tahun buruk Q (5%) menghabiskan 2,5 tahun expected loss sekaligus. Dan \"modal beda jauh\" di judul bisa dihitung: bila modal ≈ 3 × SD kerugian tahunan (ilustrasi, bukan rumus regulasi), P butuh ≈ 0,47% dari outstanding vs Q ≈ 5,5% — lebih dari 11x lipat.",
        "Peta keputusan 10 detik: data bersih & simetris → SD. Ada outlier/miring → IQR (+ median). Data sangat kotor/deteksi anomali → MAD. Beda skala → CV. Hanya peduli sisi buruk → semi-deviation. Dan selalu laporkan pemusatan + sebaran berpasangan: mean+SD, atau median+IQR.",
      ],
      tasks: [
        { id: "t1", text: "Hitung SD `sd_p` dan `sd_q` (persen, 2 desimal)" },
        { id: "t2", text: "Hitung `lipat` = sd_q / sd_p, dibulatkan ke bilangan bulat" },
      ],
      expected: "sd_p=0.16  sd_q=1.84  lipat=12",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di slide direksi untuk Q, jangan tampilkan SD saja — tampilkan median 1,2% + IQR + skenario stres (tahun terburuk 5%). SD Q masih merapikan cerita karena datanya miring kanan: 3 dari 5 tahun Q sebenarnya di bawah 1,5%.",
      },
      hints: [
        "Gunakan statistics.stdev untuk SD sampel.",
        "Cetak 2 desimal dengan f\"{sd:.2f}\".",
        "lipat = round(sd_q/sd_p)",
      ],
      code: {
        starter: `import statistics as st\n\np = [1.8, 2.1, 2.0, 1.9, 2.2]  # ritel mikro\nq = [0.5, 0.8, 1.2, 2.5, 5.0]  # korporasi kecil\n\n# TULIS KODEMU\nsd_p = \nsd_q = \nlipat = \n\nprint(f"sd_p={sd_p:.2f}  sd_q={sd_q:.2f}  lipat={lipat}")`,
        lockLines: 5,
        solution: `import statistics as st\n\np = [1.8, 2.1, 2.0, 1.9, 2.2]  # ritel mikro\nq = [0.5, 0.8, 1.2, 2.5, 5.0]  # korporasi kecil\n\n# TULIS KODEMU\nsd_p = st.stdev(p)\nsd_q = st.stdev(q)\nlipat = round(sd_q/sd_p)\n\nprint(f"sd_p={sd_p:.2f}  sd_q={sd_q:.2f}  lipat={lipat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_p", value: 0.158, tol: 0.005, label: "`sd_p` sekitar 0.16", msg: "SD sampel dari P ≈ 0,16%. Pakai statistics.stdev (pembagi n−1)." },
          { kind: "equal", task: "t1", name: "sd_q", value: 1.842, tol: 0.01, label: "`sd_q` sekitar 1.84", msg: "SD sampel dari Q ≈ 1,84%." },
          { kind: "equal", task: "t2", name: "lipat", value: 12, tol: 0.6, label: "`lipat` seharusnya 12", msg: "1,842 / 0,158 ≈ 11,66 → dibulatkan 12." },
          { kind: "stdout_matches", task: "t2", pattern: "sd_p=0\\.16\\s+sd_q=1\\.84\\s+lipat=12", label: "`print` menampilkan ketiganya", msg: "Format: sd_p=0.16  sd_q=1.84  lipat=12." },
        ],
      },
      reference: "st.stdev(list). Modal cadangan mengikuti sebaran, bukan hanya mean.",
    },
        {
          id: "gap-r7-mad-nol-a13",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P1-G3)",
          title: "MAD nol: saat penggaris besi patah",
          prose: [
            "MAD dipuji di langkah 5 sebagai penggaris besi anti-masking — dan memang begitu, sampai ia patah di satu titik: ketika MAD-nya sendiri NOL. Modified z-score membagi dengan MAD; bila MAD = 0, skornya tak terdefinisi (pembagian dengan nol), bukan 'sangat besar'. Kapan ini terjadi? Saat lebih dari separuh data bernilai SAMA. Contoh: delapan transaksi harian (Rp ribu): 100, 100, 100, 100, 100, 100, 120, 500. Mediannya 100; selisih absolutnya [0, 0, 0, 0, 0, 0, 20, 400]; median selisih itu = 0. Jadi MAD = 0 — dan 0,6745 × 400 / 0 tidak punya jawaban.",
            "Ini bukan kasus pinggiran: data transaksi, sensor, dan skor yang dibulatkan PENUH dengan nilai berulang — lebih dari separuh transaksi bisa bernilai sama persis (mis. nominal promo yang sama, skor 0 untuk mayoritas). Analis yang tidak menyiapkan fallback akan melihat error — atau lebih buruk, kode yang diam-diam mengganti MAD = 0 dengan bilangan kecil (epsilon) sehingga skornya meledak menjadi jutaan dan SEMUA nilai beda tampak seperti outlier raksasa. Epsilon adalah jalan pintas yang memalsukan skala.",
            "Fallback yang jujur: bila MAD = 0, jangan paksa modified z-score — ganti penggaris. Aturan Tukey (IQR) tetap bekerja di data ini: paruh bawah [100, 100, 100, 100] → Q1 = 100; paruh atas [100, 100, 120, 500] → Q3 = 110; IQR = 10; pagar atas = 110 + 1,5 × 10 = 125. Hasilnya: 500 outlier, 120 aman di dalam pagar. Pesannya simetris dengan lesson ini: tidak ada satu penggaris yang kebal di semua kondisi — MAD kebal terhadap masking, tetapi rapuh saat data terlalu 'rata'. Cek MAD = 0 SEBELUM membagi; bila nol, laporkan 'modified z-score tak terdefinisi' dan pakai IQR. (Catatan: MAD = 0 bukan berarti 'tidak ada sebaran' — data ini jelas menyebar (120, 500); yang nol adalah sebaran di TENGAHNYA.)",
          ],
          formula: String.raw`\text{MAD} = 0 \Rightarrow M_i = 0{,}6745 \times \frac{x_i - \text{median}}{0} = \text{tak terdefinisi} \Rightarrow \text{pakai pagar Tukey}`,
          formulaNote: "Data [100×6, 120, 500]: median 100, MAD 0, Q1 100, Q3 110, IQR 10, pagar atas 125 → 500 outlier, 120 aman.",
          tasks: [
            { id: "t1", text: "Hitung `median` dan `mad` dari `d` — buktikan MAD = 0" },
            { id: "t2", text: "Hitung fallback Tukey: `q1`, `q3`, `pagar_atas`, dan `outlier_500` (True/False)" },
          ],
          expected: "median=100.0 mad=0.0 q1=100.0 q3=110.0 pagar_atas=125.0 outlier_500=True",
          hints: [
            "MAD = median dari |x − median|; lebih dari separuh selisih = 0.",
            "Q1 = median paruh bawah (4 data pertama setelah diurutkan); Q3 = median paruh atas.",
            "Pagar atas = Q3 + 1,5 × IQR; 500 > pagar → outlier.",
          ],
          code: {
            starter: `import statistics as st\n\nd = [100, 100, 100, 100, 100, 100, 120, 500]  # Rp ribu, transaksi harian\n\n# TULIS KODEMU: median + MAD (buktikan MAD = 0), lalu fallback Tukey\nmedian =\nmad =\nq1 =\nq3 =\npagar_atas =\noutlier_500 =\n\nprint(f"median={median} mad={mad} q1={q1} q3={q3} pagar_atas={pagar_atas} outlier_500={outlier_500}")`,
            lockLines: 5,
            solution: `import statistics as st\n\nd = [100, 100, 100, 100, 100, 100, 120, 500]  # Rp ribu, transaksi harian\n\n# TULIS KODEMU: median + MAD (buktikan MAD = 0), lalu fallback Tukey\nmedian = float(st.median(d))\nmad = float(st.median([abs(x - median) for x in d]))\nds = sorted(d)\nq1 = float(st.median(ds[:4]))\nq3 = float(st.median(ds[4:]))\npagar_atas = q3 + 1.5 * (q3 - q1)\noutlier_500 = 500 > pagar_atas\n\nprint(f"median={median} mad={mad} q1={q1} q3={q3} pagar_atas={pagar_atas} outlier_500={outlier_500}")`,
            checks: [
              { kind: "equal", task: "t1", name: "median", value: 100.0, tol: 1e-9, label: "`median` = 100", msg: "Median 8 data = rata-rata data ke-4 dan ke-5 = 100." },
              { kind: "equal", task: "t1", name: "mad", value: 0.0, tol: 1e-9, label: "`mad` = 0", msg: "Selisih absolut [0×6, 20, 400] → median 0." },
              { kind: "equal", task: "t2", name: "q1", value: 100.0, tol: 1e-9, label: "`q1` = 100", msg: "Median paruh bawah [100, 100, 100, 100] = 100." },
              { kind: "equal", task: "t2", name: "q3", value: 110.0, tol: 1e-9, label: "`q3` = 110", msg: "Median paruh atas [100, 100, 120, 500] = 110." },
              { kind: "equal", task: "t2", name: "pagar_atas", value: 125.0, tol: 1e-9, label: "`pagar_atas` = 125", msg: "110 + 1,5 × (110−100) = 125." },
              { kind: "stdout_matches", task: "t2", pattern: "outlier_500=True", label: "500 dinyatakan outlier", msg: "500 > 125 → outlier menurut pagar Tukey; 120 < 125 → aman." },
            ],
          },
          quiz: [
            {
              q: "Data mayoritas bernilai sama sehingga MAD = 0. Tindakan yang benar untuk modified z-score?",
              options: [
                { text: "Nyatakan tak terdefinisi dan pakai fallback (mis. pagar Tukey)", why: "Tepat: pembagian dengan nol tidak punya jawaban; IQR tetap bekerja di data ini (pagar atas 125).", correct: true },
                { text: "Ganti MAD = 0 dengan 0,0001 agar skor bisa dihitung", why: "Salah: epsilon memalsukan skala — skor meledak jutaan dan semua nilai beda tampak seperti outlier raksasa." },
                { text: "Anggap semua nilai sebagai outlier", why: "Salah: hanya 500 yang di luar pagar Tukey; 120 aman di dalam (125)." },
                { text: "Buang nilai yang sama sampai MAD tidak nol lagi", why: "Salah: membuang mayoritas data demi menyelamatkan rumus adalah manipulasi data." },
              ],
            },
          ],
          reference: "MAD = 0 (lebih dari separuh data sama) → modified z-score TAK TERDEFINISI; jangan pakai epsilon — fallback ke pagar Tukey (IQR).",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Range cepat tapi rapuh — hanya memakai 2 titik; jangan jadikan satu-satunya ukuran.",
        "Variansi fondasi teori, satuannya kuadrat; untuk komunikasi selalu konversi ke SD.",
        "SD default untuk data bersih & simetris; ikut panik saat ada outlier.",
        "IQR (+ median) dan MAD robust untuk data kotor; MAD standar deteksi anomali.",
        "CV untuk bandingkan volatilitas beda skala; semi-deviation untuk downside risk.",
      ],
      next: { label: "A1.4 — Skewness & Kurtosis", href: "/v2/learn/a14-skewness-kurtosis" },
      quiz: [
        {
          q: "Dua reksadana: A (mean 10%, SD 2%), B (mean 10%, SD 8%). Mana lebih berisiko?",
          options: [
            { text: "Sama, mean-nya sama", why: "Mean sama tidak berarti nasib sama — B punya SD 4x lipat." },
            { text: "B, karena sebarannya lebih lebar", why: "Hasil B jauh lebih tidak pasti. Mean tanpa SD = setengah cerita.", correct: true },
            { text: "A, karena lebih stabil", why: "A justru lebih stabil — itu membuatnya kurang berisiko, bukan lebih." },
            { text: "Tidak bisa ditentukan", why: "Bisa: SD-nya sudah memberi jawabannya." },
          ],
        },
        {
          q: "Data gaji ada outlier (gaji direktur). Ukuran sebaran apa yang paling tepat?",
          options: [
            { text: "Standar deviasi", why: "SD ikut panik saat ada outlier — dia dibangun dari kuadrat." },
            { text: "IQR atau MAD", why: "Keduanya robust: outlier hampir tidak menggerakkannya (robust, bukan imun — breakdown point IQR/MAD 50%, bukan tak hingga).", correct: true },
            { text: "Range", why: "Range justru paling rapuh: hanya memakai 2 titik ujung." },
            { text: "Variansi", why: "Satuannya kuadrat (Rp²) — tidak bermakna bisnis dan ikut panik." },
          ],
        },
        {
          q: "Saham X: harga Rp 50.000, SD Rp 5.000. Saham Y: harga Rp 500.000, SD Rp 25.000. Mana yang relatif lebih volatil?",
          options: [
            { text: "Y — SD-nya 5x lebih besar", why: "SD absolut tanpa konteks skala menyesatkan." },
            { text: "X — CV 10% vs Y 5%", why: "Relatif terhadap harga, X dua kali lebih volatil.", correct: true },
            { text: "Sama — keduanya naik", why: "Arah naik tidak menentukan volatilitas relatif." },
          ],
        },
        {
          q: "Mengapa laporan risiko menampilkan SD, bukan variansi, ke manajemen?",
          options: [
            { text: "SD lebih akurat dari variansi", why: "SD adalah akar variansi — informasinya sama, kemasannya beda." },
            { text: "Variansi satuannya kuadrat (Rp²) — tidak bermakna bisnis; SD kembali ke satuan asli", why: "Rp 2 juta langsung bermakna; variansi 4 juta Rp² tidak.", correct: true },
            { text: "Regulator melarang variansi", why: "Tidak ada larangan — ini soal komunikasi." },
            { text: "SD lebih mudah dihitung", why: "SD dihitung dari variansi — justru satu langkah lebih panjang." },
          ],
        },
        {
          q: "Dua reksadana SD sama (6%), tapi M sering anjlok dalam, N sering melonjak. Ukuran apa yang membedakan keduanya?",
          options: [
            { text: "Range — karena menangkap ekstrem", why: "Range menangkap ekstrem tapi rapuh dan tidak membedakan arah." },
            { text: "Semi-deviation — M punya downside risk lebih besar meski SD sama", why: "SD menghukum naik dan turun sama rata; investor hanya tersakiti sisi bawah.", correct: true },
            { text: "CV — karena skalanya beda", why: "Skalanya sama; CV tidak menjawab soal ini." },
            { text: "Tidak ada — SD sama berarti risiko sama", why: "Risiko untuk investor = sisi bawah, bukan total volatilitas." },
          ],
        },
      ],
      note: {
        title: "Intuisi: mean tanpa sebaran adalah janji tanpa jaminan",
        body: "Enam heuristik. Satu: mean tanpa sebaran adalah janji tanpa jaminan — dua cabang sama-sama NPL 3 persen bisa berarti satu stabil dan satu kolaps; yang membedakan hanyalah sebarannya. Dua: SD kecil bukan berarti risiko rendah — semua debitur DPD 89 hari memberi SD kecil dengan risiko raksasa; sebaran mengukur keragaman, bukan keamanan. Tiga: bandingkan SD dengan IQR dibagi 1,35 — untuk data yang mendekati normal — selisih besar berarti outlier bersembunyi di data; diagnostik 10 detik analis senior. Empat: untuk membandingkan aset beda skala pakai CV, untuk mengukur risiko pakai semi-deviasi — volatilitas ke atas bukan risiko, hanya sisi buruk yang dihitung. Lima: aturan empiris 68-95-99,7 hanya berlaku untuk yang mendekati normal — jangan dipaksakan ke return saham berekor tebal; di sana ekorlah yang menentukan, bukan aturan. Enam: pilih ukuran sebaran sesuai pertanyaan — untuk ketahanan pakai IQR atau MAD, untuk kompatibilitas model pakai SD, untuk perbandingan lintas skala pakai CV; tidak ada satu ukuran untuk semua.",
      },
    },
  ],
};
