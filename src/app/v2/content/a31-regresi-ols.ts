import type { V2Lesson } from "../lib/types";

export const a31: V2Lesson = {
  slug: "a31-regresi-ols",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.1 Regresi Linear OLS: Garis Lurus Paling Jujur",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-lgd-negatif",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model R kuadrat 0,92 yang meramalkan kerugian negatif",
      prose: [
        "Tim risiko sebuah bank bangga: model mereka memprediksi LGD (loss given default) hanya dari satu variabel, DPD (days past due). R kuadrat = 0,92, hampir sempurna. Model langsung dipakai menentukan cadangan kerugian.",
        "Sebulan kemudian, analis junior memasukkan DPD = 5 hari untuk segmen baru. Output: LGD = minus Rp2,1 juta. Kerugian negatif — nasabah gagal bayar justru memberi bank untung? Tentu absurd. Tidak ada yang salah dengan matematikanya: model dilatih di rentang DPD 30 sampai 180 hari, lalu dipakai di DPD 5 hari. Itu ekstrapolasi. Dan hubungan aslinya melengkung, bukan lurus.",
        "R kuadrat 0,92 hanya mengukur kecocokan di dalam sampel, bukan kebenaran di luar sampel. Lesson ini tentang kapan garis lurus bisa dipercaya — dan kapan ia berbohong dengan percaya diri.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ekstrapolasi di model cadangan (CKPN) berarti cadangan salah hitung. Model hanya berhak bicara di rentang data tempat ia dilatih — di luar itu, hubungan bisa melengkung, jenuh, atau berubah rezim.",
      },
      reference: "R kuadrat tinggi bukan izin ekstrapolasi.",
    },
    {
      id: "anatomi-persamaan",
      eyebrow: "Langkah 2 · Model regresi linear",
      title: "Anatomi satu persamaan",
      prose: [
        "Regresi linear memodelkan target y sebagai garis lurus plus noise. Intersep adalah nilai y saat semua x = 0 — sering tidak bermakna secara bisnis, tapi dibutuhkan matematikanya. Setiap koefisien adalah efek marjinal: rata-rata y berubah sebesar koefisien itu tiap x naik 1 satuan, dengan variabel lain dianggap tetap (ceteris paribus).",
        "Contoh terestimasi: LGD = 5,2 + 2,77 x DPD (dalam ribu Rp). Slope 2,77 berarti tiap tambahan 1 hari keterlambatan, LGD naik rata-rata Rp2.770. Prediksi untuk DPD = 30: 5,2 + 2,77 x 30 = Rp88,3 ribu. Angka 2,77 adalah harga satu hari keterlambatan menurut data — bukan menurut teori.",
        "Regresi itu linear dalam parameter, bukan dalam variabel. Kamu boleh memasukkan x kuadrat, log(x), atau interaksi x1*x2 sebagai variabel baru — modelnya tetap regresi linear.",
      ],
      formula: String.raw`y_i = \beta_0 + \beta_1 x_i + \varepsilon_i`,
      formulaNote: "y target, beta0 intersep, beta1 efek marjinal x, epsilon error yang tidak dijelaskan model.",
      tasks: [
        { id: "t1", text: "Hitung `pred` = 5,2 + 2,77 x 30" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "pred=88.3",
      note: {
        title: "Sering salah",
        body: "Membaca koefisien sebagai efek kausal. DPD naik 1 hari lalu LGD naik Rp2.770 tidak berarti menunda pembayaran menyebabkan kerugian naik — keduanya bisa disebabkan faktor ketiga. Untuk klaim sebab-akibat butuh desain kausal, bukan regresi observasional.",
      },
      hints: [
        "Prediksi = intersep + slope dikali x.",
        "Kalikan dulu, baru tambahkan intersep.",
        "pred = 5.2 + 2.77 * 30",
      ],
      code: {
        starter: `# Model terestimasi: LGD = 5,2 + 2,77 x DPD (ribu Rp)\nbeta0, beta1 = 5.2, 2.77\n\n# TULIS KODEMU: prediksi LGD untuk DPD = 30\npred = \n\nprint(f"pred={pred}")`,
        lockLines: 2,
        solution: `# Model terestimasi: LGD = 5,2 + 2,77 x DPD (ribu Rp)\nbeta0, beta1 = 5.2, 2.77\n\n# TULIS KODEMU: prediksi LGD untuk DPD = 30\npred = beta0 + beta1 * 30\n\nprint(f"pred={pred}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pred", value: 88.3, tol: 0.05, label: "`pred` seharusnya 88.3", msg: "5,2 + 2,77 x 30 = 88,3. Cek urutan operasi perkaliannya." },
          { kind: "stdout_matches", task: "t2", pattern: "pred=88\\.3", label: "`print` menampilkan prediksi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Koefisien = asosiasi terkontrol (ceteris paribus), bukan bukti kausal.",
    },
    {
      id: "ols-normal-equations",
      eyebrow: "Langkah 3 · OLS",
      title: "OLS: meminimalkan jumlah kuadrat residual",
      prose: [
        "OLS memilih koefisien yang meminimalkan jumlah kuadrat residual (selisih y dan prediksi). Kuadrat dipakai agar error positif dan negatif tidak saling menghapus, dan error besar dihukum lebih dari proporsional. Solusinya punya rumus tertutup: untuk satu x, slope = Cov(x,y)/Var(x) dan intersep = rata-rata y dikurangi slope kali rata-rata x.",
        "Hukuman kuadratik membuat OLS sangat sensitif terhadap outlier: error 10 dihukum 100, error 1 dihukum 1. Satu titik jauh bisa menyeret seluruh garis — OLS rela mengorbankan kecocokan di 99 titik demi mendekati 1 titik ekstrem.",
        "Teorema Gauss-Markov memberi OLS medali BLUE (best linear unbiased estimator) — tetapi hanya jika lima asumsi terpenuhi. Tanpa itu, medali dicabut.",
      ],
      formula: String.raw`\hat{\beta}_1 = \frac{\mathrm{Cov}(x,y)}{\mathrm{Var}(x)}, \qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}`,
      formulaNote: "beta-hat_1 = slope OLS: kovariansi x dan y dibagi variansi x — seberapa jauh y bergerak per satu unit x; beta-hat_0 = intersep: prediksi y saat x = 0; x-bar dan y-bar = rata-rata sampel x dan y.",
      tasks: [
        { id: "t1", text: "Hitung `b1` (slope) dari data `dpd` dan `lgd`" },
        { id: "t2", text: "Hitung `b0` (intersep) dan `r2`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "beta0=12.34 beta1=2.71 r2=0.9992",
      note: {
        title: "Sering salah",
        body: "Mengira OLS mencari garis yang melewati sebanyak mungkin titik. Yang diminimalkan adalah total kuadrat jarak vertikal — bukan jumlah titik yang dilewati.",
      },
      hints: [
        "Ikuti rumus di formula: sxy/sxx untuk slope.",
        "mx dan my sudah dihitung. b1 = sxy/sxx.",
        "b0 = my - b1*mx",
      ],
      code: {
        starter: `# Estimasi LGD (ribu Rp) dari DPD (hari) — pure Python\ndpd = [2, 5, 8, 12, 15, 18, 22, 25, 30, 35, 40, 45]\nlgd = [18, 26, 33, 45, 52, 60, 74, 80, 95, 108, 120, 133]\nn = len(dpd)\n\nmx = sum(dpd)/n; my = sum(lgd)/n\nsxy = sum((x-mx)*(y-my) for x, y in zip(dpd, lgd))\nsxx = sum((x-mx)**2 for x in dpd)\n\n# TULIS KODEMU: normal equations\nb1 = \nb0 = \n\npred = [b0 + b1*x for x in dpd]\nssr = sum((y-p)**2 for y, p in zip(lgd, pred))\nsst = sum((y-my)**2 for y in lgd)\nr2 = 1 - ssr/sst\n\nprint(f"beta0={b0:.2f} beta1={b1:.2f} r2={r2:.4f}")`,
        lockLines: 9,
        solution: `# Estimasi LGD (ribu Rp) dari DPD (hari) — pure Python\ndpd = [2, 5, 8, 12, 15, 18, 22, 25, 30, 35, 40, 45]\nlgd = [18, 26, 33, 45, 52, 60, 74, 80, 95, 108, 120, 133]\nn = len(dpd)\n\nmx = sum(dpd)/n; my = sum(lgd)/n\nsxy = sum((x-mx)*(y-my) for x, y in zip(dpd, lgd))\nsxx = sum((x-mx)**2 for x in dpd)\n\n# TULIS KODEMU: normal equations\nb1 = sxy/sxx\nb0 = my - b1*mx\n\npred = [b0 + b1*x for x in dpd]\nssr = sum((y-p)**2 for y, p in zip(lgd, pred))\nsst = sum((y-my)**2 for y in lgd)\nr2 = 1 - ssr/sst\n\nprint(f"beta0={b0:.2f} beta1={b1:.2f} r2={r2:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "b1", value: 2.7079, tol: 0.002, label: "`b1` sekitar 2.71", msg: "Slope = sxy/sxx. Cek pembilang dan penyebutnya." },
          { kind: "equal", task: "t2", name: "b0", value: 12.3397, tol: 0.02, label: "`b0` sekitar 12.34", msg: "Intersep = my - b1*mx. Pastikan memakai b1 yang benar." },
          { kind: "equal", task: "t2", name: "r2", value: 0.9992, tol: 0.002, label: "`r2` sekitar 0.9992", msg: "R kuadrat = 1 - ssr/sst. Data ini memang hampir linear sempurna." },
          { kind: "stdout_matches", task: "t3", pattern: "beta0=12\\.34\\s+beta1=2\\.71\\s+r2=0\\.9992", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: ubah satu lgd jadi outlier (misal 133 -> 300), jalankan ulang, lihat slope ikut lari.",
    },
    {
      id: "lab-detektif-residual",
      eyebrow: "Langkah 4 · Lab: residual",
      title: "Tangkap pelanggaran asumsi dari pola residual",
      prose: [
        "Data berikut punya R kuadrat 0,85 — terlihat bagus. Tapi hubungan aslinya melengkung: default rate meledak di rasio utang tinggi. Model linear memaksa garis lurus ke hubungan yang bengkok.",
        "Cara menangkapnya: hitung residual (y dikurangi prediksi), lalu bandingkan rata-rata residual di tengah dengan di ujung. Residual sehat tersebar acak — rata-rata tengah dan ujung sama-sama mendekati nol. Residual sakit berpola U: negatif di tengah, positif di ujung.",
      ],
      tasks: [
        { id: "t1", text: "Hitung list `resid` (y dikurangi prediksi)" },
        { id: "t2", text: "Hitung `mid` (rata-rata 3 residual tengah) dan `ujung` (rata-rata 6 residual tepi)" },
        { id: "t3", text: "Cetak `mid` dan `ujung` dengan `print`" },
      ],
      expected: "mid=-9.33 ujung=4.67",
      note: {
        title: "Sering salah",
        body: "Percaya R kuadrat tanpa melihat residual. R kuadrat 0,85 di sini menutupi asumsi linearitas yang rusak. Aturan emas: selalu plot residual sebelum percaya model.",
      },
      hints: [
        "Residual = selisih tiap y dengan prediksinya.",
        "Tengah = indeks 3,4,5. Tepi = indeks 0,1,2,6,7,8.",
        "resid = [y-p for y, p in zip(dr, pred)]",
      ],
      code: {
        starter: `# default rate vs rasio utang (hubungan sebenarnya melengkung)\nrasio = [10, 20, 30, 40, 50, 60, 70, 80, 90]\ndr    = [2, 3, 5, 8, 14, 22, 35, 52, 75]  # persen default\nn = len(rasio)\nmx = sum(rasio)/n; my = sum(dr)/n\nsxy = sum((x-mx)*(y-my) for x, y in zip(rasio, dr))\nsxx = sum((x-mx)**2 for x in rasio)\nb1 = sxy/sxx; b0 = my - b1*mx\npred = [b0 + b1*x for x in rasio]\n\n# TULIS KODEMU: residual, lalu rata-rata tengah vs tepi\nresid = \nmid = \nujung = \n\nprint(f"mid={mid:.2f} ujung={ujung:.2f}")`,
        lockLines: 10,
        solution: `# default rate vs rasio utang (hubungan sebenarnya melengkung)\nrasio = [10, 20, 30, 40, 50, 60, 70, 80, 90]\ndr    = [2, 3, 5, 8, 14, 22, 35, 52, 75]  # persen default\nn = len(rasio)\nmx = sum(rasio)/n; my = sum(dr)/n\nsxy = sum((x-mx)*(y-my) for x, y in zip(rasio, dr))\nsxx = sum((x-mx)**2 for x in rasio)\nb1 = sxy/sxx; b0 = my - b1*mx\npred = [b0 + b1*x for x in rasio]\n\n# TULIS KODEMU: residual, lalu rata-rata tengah vs tepi\nresid = [y-p for y, p in zip(dr, pred)]\nmid = sum(resid[3:6])/3\nujung = (sum(resid[:3]) + sum(resid[6:]))/6\n\nprint(f"mid={mid:.2f} ujung={ujung:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "mid", value: -9.33, tol: 0.05, label: "`mid` sekitar -9.33", msg: "Rata-rata residual indeks 3,4,5. Cek slicing list-nya." },
          { kind: "equal", task: "t2", name: "ujung", value: 4.67, tol: 0.05, label: "`ujung` sekitar 4.67", msg: "Rata-rata residual indeks 0,1,2,6,7,8. Tengah negatif + tepi positif = pola U." },
          { kind: "stdout_matches", task: "t3", pattern: "mid=-9\\.33\\s+ujung=4\\.67", label: "`print` menampilkan pola U", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Acak = sehat, pola = sakit. Lengkung -> transformasi; corong -> robust SE; gelombang -> time series.",
    },
    {
      id: "inferensi-tanpa-tertipu",
      eyebrow: "Langkah 5 · R kuadrat, t-stat, p-value",
      title: "Membaca hasil tanpa tertipu",
      prose: [
        "R kuadrat adalah proporsi variansi y yang dijelaskan model di dalam sampel. Adjusted R kuadrat menghukum penambahan variabel tak berguna — selalu pakai ini saat membandingkan model dengan jumlah prediktor berbeda, karena R kuadrat biasa naik otomatis tiap tambah variabel, bahkan variabel acak.",
        "Untuk tiap koefisien: t-stat = estimasi dibagi standard error, dan p-value menjawab apakah data seperti ini jarang terjadi jika koefisien benar-benar nol. Confidence interval 95 persen memberi rentang nilai koefisien yang masih masuk akal menurut data.",
        "Dua jebakan: p-value kecil berarti efeknya bukan nol — bukan berarti efeknya besar. Dengan 500 ribu observasi, efek Rp100 pun bisa sangat signifikan tapi tidak material bagi bisnis. Selalu baca besar koefisien dan intervalnya, bukan cuma bintangnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "R kuadrat tinggi berarti model bagus dan bisa dipakai prediksi. R kuadrat hanya mengukur kecocokan di dalam sampel latih. Model yang menghafal noise bisa R kuadrat 0,99 tapi hancur di data baru — butuh validasi out-of-sample.",
      },
      reference: "Signifikansi statistik bukan signifikansi bisnis. p-value bukan besar efek bukan kausalitas.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 5. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Model LGD = 5,2 + 2,77 x DPD (dilatih di DPD 2-45 hari) dipakai memprediksi nasabah DPD 200 hari. Masalah utama?",
          options: [
            { text: "R kuadrat pasti turun", why: "Salah. R kuadrat dihitung di data latih; masalahnya bukan angka itu." },
            { text: "Ekstrapolasi — model tidak punya bukti hubungan tetap linear di luar rentang data", why: "Benar. OLS hanya berhak bicara di rentang x tempat ia dilatih.", correct: true },
            { text: "Intersep harus nol", why: "Salah. Intersep bukan inti masalah di sini." },
            { text: "Tidak ada masalah, OLS selalu valid", why: "Salah. OLS valid di dalam asumsi dan rentangnya saja." },
          ],
        },
        {
          q: "Koefisien = 0,03 dengan p < 0,001 pada n = 500.000. Interpretasi yang jujur?",
          options: [
            { text: "Efeknya sangat penting karena sangat signifikan", why: "Salah. Sampel raksasa membuat efek mungil pun signifikan." },
            { text: "Signifikan secara statistik, tapi 0,03 harus dinilai dari sisi bisnis — signifikansi bukan materialitas", why: "Benar. Baca besar koefisien dan intervalnya; bintang bukan nilai.", correct: true },
            { text: "p kecil berarti R kuadrat pasti tinggi", why: "Salah. Keduanya mengukur hal berbeda." },
            { text: "Koefisien pasti kausal", why: "Salah. Regresi observasional memberi asosiasi terkontrol, bukan kausalitas." },
          ],
        },
      ],
      reference: "Ekstrapolasi = bicara tanpa bukti. Signifikansi = bukan nol, bukan besar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan OLS, kapan minggir",
      prose: [
        "Satu, hubungan linear dan asumsi terpenuhi: pakai OLS biasa — ia BLUE, sederhana, interpretable. Dua, residual corong (heteroskedastisitas): koefisien tetap tak bias, tapi hitung ulang SE dengan robust SE atau pertimbangkan transformasi log. Tiga, hubungan melengkung: tambah suku kuadrat atau transformasi log — tetap regresi linear karena linear dalam parameter.",
        "Empat, outlier berpengaruh besar: pakai regresi robust (Huber) atau investigasi dulu — jangan asal hapus, outlier bisa jadi sinyal fraud. Lima, prediktor saling berkorelasi kuat (VIF di atas 10): buang satu variabel, gabungkan jadi indeks, atau pakai regularisasi.",
        "Aturan 10 detik: plot dulu, percaya kemudian. Residual acak berarti sehat; berpola berarti ada yang salah, dan bentuk polanya adalah petunjuk obatnya. Koefisien adalah asosiasi terkontrol, bukan bukti kausal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Langsung membaca R kuadrat sebelum melihat scatterplot dan residual plot. Model hanya boleh dipercaya setelah diagnostiknya sehat. Diagnostik = empat cek cepat: (1) residual vs fitted tersebar acak tanpa pola; (2) tidak ada titik berpengaruh ekstrem (Cook's distance); (3) galat mendekati normal bila kamu butuh interval/uji (QQ-plot); (4) prediktor tidak saling berkorelasi kuat (VIF di bawah 10).",
      },
      reference: "Lengkung -> transformasi. Corong -> robust SE. Outlier -> robust/investigasi. Kolinear -> seleksi/regularisasi.",
    },
    {
      id: "mini-case-lgd",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Estimasi LGD untuk cadangan bank",
      prose: [
        "Kamu analis risiko. Regulator meminta estimasi LGD portofolio KPR macet untuk cadangan. Kamu meregresikan LGD (juta Rp) ke DPD dan LTV: LGD = -12,4 + 1,9 x DPD + 0,62 x LTV, R kuadrat 0,71, n = 2.400. Koefisien DPD: 1,9 (SE 0,15, p < 0,001), interval 95 persen [1,61; 2,19]. Koefisien LTV: 0,62 (SE 0,40, p = 0,12), interval [-0,16; 1,40].",
        "Tiap tambah 1 hari DPD, LGD naik rata-rata Rp1,9 juta dengan LTV dianggap tetap — valid di rentang DPD data latih. Intervalnya cukup presisi, bukan sekadar signifikan. LTV dengan p = 0,12 bukan berarti tidak berpengaruh: intervalnya mencakup efek positif sampai Rp1,4 juta per poin LTV, dan itu material. Kemungkinan ada multikolinearitas yang menggembungkan SE — jangan buang variabel hanya karena p di atas 0,05.",
        "Intersep -12,4 adalah ekstrapolasi ke titik (DPD=0, LTV=0) yang tidak ada di data — nasabah default dengan DPD 0 hari tidak masuk akal. Tidak perlu diperbaiki; cukup jangan dipakai untuk prediksi di titik itu. Jika prediksi butuh non-negatif, pertimbangkan model log(LGD).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Membuang LTV karena tidak signifikan bisa menghilangkan sinyal risiko yang material. Keputusan buang variabel harus memakai interval dan pertimbangan bisnis, bukan ambang p-value semata.",
      },
      reference: "p > 0,05 bukan bukti efek nol. Intersep di luar rentang data bukan untuk dipakai.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "OLS meminimalkan jumlah kuadrat residual; sensitif outlier karena hukuman kuadratik.",
        "BLUE hanya jika asumsi Gauss-Markov terpenuhi: linearitas, eksogenitas, homoskedastisitas, tanpa autokorelasi, tanpa multikolinearitas sempurna.",
        "Residual acak = sehat. Pola lengkung, corong, atau gelombang = sakit, dan bentuknya menunjuk obatnya.",
        "R kuadrat = kecocokan dalam sampel, bukan izin ekstrapolasi. p-value bukan besar efek, bukan kausalitas.",
        "Jangan pakai OLS untuk hubungan non-linear tanpa transformasi, prediksi jauh di luar rentang data, atau klaim sebab-akibat dari data observasional.",
      ],
      next: { label: "A3.10 — Volatilitas", href: "/learn/a310-volatilitas" },
      quiz: [
        {
          q: "Manakah pernyataan yang tepat tentang estimator OLS?",
          options: [
            { text: "OLS meminimalkan jumlah residual (bukan kuadratnya)", why: "Salah. Yang diminimalkan adalah jumlah kuadrat residual." },
            { text: "OLS adalah BLUE hanya jika asumsi Gauss-Markov terpenuhi", why: "Benar. Status BLUE bersyarat; omitted variable yang berkorelasi dengan x menimbulkan bias.", correct: true },
            { text: "OLS selalu tak bias walau ada omitted variable", why: "Salah. Omitted variable yang berkorelasi dengan x membuat koefisien bias." },
            { text: "OLS kebal outlier karena memakai kuadrat", why: "Salah. Hukuman kuadratik justru membuat OLS sensitif terhadap outlier." },
          ],
        },
        {
          q: "Residual plot menunjukkan pola corong (melebar ke kanan). Diagnosis dan langkah tepat?",
          options: [
            { text: "Linearitas rusak — tambah x kuadrat", why: "Salah. Pola lengkung yang butuh suku kuadrat; corong adalah masalah sebaran." },
            { text: "Heteroskedastisitas — koefisien tetap tak bias, pakai robust SE atau pertimbangkan transformasi log", why: "Benar. Yang rusak hanya standard error dan p-value, bukan koefisiennya.", correct: true },
            { text: "Autokorelasi — pakai model ARIMA", why: "Salah. Itu untuk residual yang bergerombol menurut waktu." },
            { text: "Tidak ada masalah, abaikan saja", why: "Salah. SE dan p-value klasik tidak bisa dipercaya di bawah heteroskedastisitas." },
          ],
        },
        {
          q: "Dua prediktor (pendapatan dan pengeluaran) berkorelasi 0,95. Gejala yang muncul?",
          options: [
            { text: "R kuadrat pasti rendah", why: "Salah. R kuadrat bisa tetap tinggi." },
            { text: "Koefisien tidak stabil, SE membengkak, tanda bisa aneh — multikolinearitas", why: "Benar. Model kesulitan membagi jasa antar variabel yang bergerak bersama.", correct: true },
            { text: "Residual pasti berpola", why: "Salah. Multikolinearitas tidak selalu menimbulkan pola residual." },
            { text: "OLS tidak bisa dihitung sama sekali", why: "Salah. Itu hanya terjadi pada kolinearitas sempurna." },
          ],
        },
        {
          q: "Kapan adjusted R kuadrat lebih tepat dipakai daripada R kuadrat biasa?",
          options: [
            { text: "Selalu — adjusted tidak pernah lebih kecil", why: "Salah. Adjusted bisa lebih kecil; itu gunanya menghukum." },
            { text: "Saat membandingkan model dengan jumlah prediktor berbeda, karena R kuadrat biasa naik otomatis tiap tambah variabel", why: "Benar. R kuadrat biasa tidak pernah turun saat tambah variabel, bahkan variabel acak.", correct: true },
            { text: "Hanya untuk regresi sederhana", why: "Salah. Justru untuk banyak prediktor ia penting." },
            { text: "Saat n sangat kecil", why: "Salah. Alasannya adalah perbandingan jumlah prediktor, bukan ukuran sampel." },
          ],
        },
      ],
      note: {
        title: "Intuisi: OLS itu cermin yang jujur tapi rabun jauh",
        body: "Lima heuristik. Satu: koefisien adalah asosiasi terkontrol, bukan bukti kausal — frasa “dengan variabel lain dianggap tetap” adalah klaim tentang dunia, bukan teorema matematika; jangan menjualnya sebagai kausalitas. Dua: R kuadrat tinggi plus residual berpola sama dengan model yang salah dengan percaya diri — plot residual dulu, baca R kuadrat kemudian. Tiga: ekstrapolasi adalah bunuh diri statistik — garis lurus tidak tahu kapan harus berhenti, dan ia dengan senang hati meramalkan LGD negatif di luar rentang data. Empat: bedakan outlier biasa dari outlier berpengaruh — satu titik dengan leverage tinggi bisa menyeret seluruh garis; Cook's distance adalah detektornya. Lima: hukuman kuadratik membuat OLS pendendam pada error besar — bila datamu berekor tebal atau terkontaminasi, pertimbangkan regresi robust sebelum percaya pada garisnya. Aturan tutup: plot dulu, percaya kemudian — selalu. Enam: waspadai multikolinearitas — dua prediktor yang hampir kembar membuat koefisiennya liar dan intervalnya melebar; VIF di atas 10 berarti mereka berebut menjelaskan hal yang sama.",
      },
    },
  ],
};
