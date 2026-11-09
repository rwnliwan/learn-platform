import type { V2Lesson } from "../lib/types";

export const d11: V2Lesson = {
  slug: "d11-scipy-statsmodels",
  track: "Python",
  module: "Statistik",
  title: "D11 Statistik Inferensial: Uji Hipotesis & Regresi",
  estMinutes: 55,
  steps: [
    {
      id: "deskriptif-inferensial",
      eyebrow: "Langkah 1 · Mental model",
      title: "Cerita pembuka: 'gaji berbeda' atau kebetulan?",
      prose: [
        "Rata-rata gaji Jakarta 10jt, Bandung 8jt — beda 2jt. Tapi kalau variansinya besar, beda itu bisa murni noise dari sampel kecil. Tanpa statistik inferensial, kamu akan 'menemukan' insight yang tidak ada.",
        "Deskriptif (mean, median) menjawab 'apa yang terjadi di data ini'; inferensial (p-value, interval) menjawab 'bisa digeneralisasi ke populasi?'. Aturan bukti yang dipakai di pelajaran ini: |t| > 2 ~ p < 0.05 ~ 'signifikan secara konvensional'. Selalu sebut asumsi: normalitas, n cukup.",
      ],
      tasks: [],
      reference: "Uji t = beda 2 grup; ANOVA = 3+ grup; chi-square = kategorikal; Shapiro = normalitas.",
    },
    {
      id: "uji-t",
      eyebrow: "Langkah 2 · Uji t",
      title: "Beda mean gaji Jakarta vs Bandung",
      prose: [
        "`scipy.stats.ttest_ind(a, b)` memberi statistik t dan p-value. Di sini t=4.74, p=0.000010 (< 0.05): beda 2jt signifikan, bukan kebetulan. Tapi signifikansi tidak sama dengan penting secara bisnis — di sinilah effect size masuk.",
        "Cohen's d = selisih mean / std gabungan: 1.06 (efek besar; <0.2 kecil, 0.5 sedang, 0.8 besar). p-value menjawab 'apakah beda?', d menjawab 'seberapa besar bedanya?'. Lapor keduanya.",
      ],
      requires: ["scipy", "numpy"],
      tasks: [
        { id: "t1", text: "Jalankan `ttest_ind` (equal_var=False), dapatkan `t` dan `p`" },
        { id: "t2", text: "Hitung `d` (Cohen's d) dan `signif` = (p < 0.05)" },
      ],
      expected: "t=4.74  p=0.000010  d=1.06  signif=True",
      note: {
        title: "Sering salah",
        body: "Melaporkan p-value tanpa effect size. Dengan n besar, beda 1 rupiah bisa 'signifikan'. p menjawab apakah, d menjawab seberapa besar — bisnis peduli yang kedua.",
      },
      hints: [
        "t, p = ttest_ind(gaji_a, gaji_b, equal_var=False).",
        "sd_pool = np.sqrt(((n1-1)*va + (n2-1)*vb) / (n1+n2-2)).",
        "d = (gaji_a.mean() - gaji_b.mean()) / sd_pool",
      ],
      code: {
        starter: `import numpy as np\nfrom scipy.stats import ttest_ind\n\nrng = np.random.default_rng(42)\ngaji_a = rng.normal(10_000_000, 2_500_000, 40)\ngaji_b = rng.normal(8_000_000, 2_500_000, 40)\n\n# TULIS KODEMU\nt, p = \nn1, n2 = len(gaji_a), len(gaji_b)\nva, vb = gaji_a.var(ddof=1), gaji_b.var(ddof=1)\nsd_pool = \nd = \nsignif = \n\nprint(f"t={t:.2f}  p={p:.6f}  d={d:.2f}  signif={signif}")`,
        lockLines: 6,
        solution: `import numpy as np\nfrom scipy.stats import ttest_ind\n\nrng = np.random.default_rng(42)\ngaji_a = rng.normal(10_000_000, 2_500_000, 40)\ngaji_b = rng.normal(8_000_000, 2_500_000, 40)\n\n# TULIS KODEMU\nt, p = ttest_ind(gaji_a, gaji_b, equal_var=False)\nn1, n2 = len(gaji_a), len(gaji_b)\nva, vb = gaji_a.var(ddof=1), gaji_b.var(ddof=1)\nsd_pool = np.sqrt(((n1 - 1) * va + (n2 - 1) * vb) / (n1 + n2 - 2))\nd = (gaji_a.mean() - gaji_b.mean()) / sd_pool\nsignif = p < 0.05\n\nprint(f"t={t:.2f}  p={p:.6f}  d={d:.2f}  signif={signif}")`,
        checks: [
          { kind: "equal", task: "t1", name: "t", value: 4.735, tol: 0.01, label: "`t` sekitar 4.74", msg: "t = 4.735 dari ttest_ind." },
          { kind: "equal", task: "t1", name: "p", value: 0.0000098, tol: 0.000005, label: "`p` sekitar 0.000010", msg: "Sangat kecil — signifikan." },
          { kind: "equal", task: "t2", name: "d", value: 1.059, tol: 0.02, label: "`d` sekitar 1.06", msg: "Efek besar (d > 0,8)." },
          { kind: "equal", task: "t2", name: "signif", value: true, label: "`signif` = True", msg: "p < 0.05." },
          { kind: "stdout_matches", task: "t2", pattern: "t=4\\.74\\s+p=0\\.000010\\s+d=1\\.06\\s+signif=True", label: "`print` menampilkan semuanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "t, p = ttest_ind(a, b, equal_var=False). d = selisih / std gabungan.",
    },
    {
      id: "shapiro",
      eyebrow: "Langkah 3 · Asumsi",
      title: "Uji t sah jika normal",
      prose: [
        "Uji t mengasumsikan data mendekati normal. `scipy.stats.shapiro(x)` mengujinya: p > 0.05 berarti tidak ada bukti kuat penyimpangan dari normal — asumsi aman. Di sini p=0.911: sangat aman.",
        "Jika asumsi gagal (skew berat, outlier): pakai alternatif nonparametrik `mannwhitneyu` — membandingkan ranking, bukan mean. Jangan memaksa uji t pada data yang jelas tidak normal.",
      ],
      requires: ["scipy", "numpy"],
      tasks: [
        { id: "t1", text: "Jalankan `shapiro(gaji_a)`, dapatkan `w` dan `p_shap`" },
        { id: "t2", text: "Tentukan `normal` = (p_shap > 0.05)" },
      ],
      expected: "p_shap=0.911  normal=True",
      note: {
        title: "Sering salah",
        body: "Memakai p-value tanpa cek asumsi. p=0.0001 dari uji t pada data sangat skew adalah angka yang meyakinkan tapi tidak sah. Cek asumsi dulu — 2 baris, menyelamatkan kredibilitas.",
      },
      hints: [
        "w, p_shap = shapiro(gaji_a).",
        "normal = p_shap > 0.05",
        "Gaji hasil normal(10jt, 2.5jt) — p akan jauh di atas 0.05.",
      ],
      code: {
        starter: `import numpy as np\nfrom scipy.stats import shapiro\n\nrng = np.random.default_rng(42)\ngaji_a = rng.normal(10_000_000, 2_500_000, 40)\n\n# TULIS KODEMU\nw, p_shap = \nnormal = \n\nprint(f"p_shap={p_shap:.3f}  normal={normal}")`,
        lockLines: 4,
        solution: `import numpy as np\nfrom scipy.stats import shapiro\n\nrng = np.random.default_rng(42)\ngaji_a = rng.normal(10_000_000, 2_500_000, 40)\n\n# TULIS KODEMU\nw, p_shap = shapiro(gaji_a)\nnormal = p_shap > 0.05\n\nprint(f"p_shap={p_shap:.3f}  normal={normal}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_shap", value: 0.911, tol: 0.05, label: "`p_shap` sekitar 0.911", msg: "Data normal — p jauh di atas 0.05." },
          { kind: "equal", task: "t2", name: "normal", value: true, label: "`normal` = True", msg: "Asumsi uji t terpenuhi." },
          { kind: "stdout_matches", task: "t2", pattern: "p_shap=0\\.911\\s+normal=True", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "w, p = shapiro(x); p > 0.05 -> asumsi normal aman.",
    },
    {
      id: "chi-square",
      eyebrow: "Langkah 4 · Chi-square",
      title: "Kota mempengaruhi macet?",
      prose: [
        "Chi-square of independence menguji: dua variabel kategorikal berhubungan? `chi2_contingency(tabel)` dengan tabel 3 kota x 2 status (n 10× lipat dari contoh kecil): chi2=16.00, p=0.000335, dof=2. p < 0.05 — ada bukti signifikan kota memengaruhi kemacetan (dengan n lebih besar, power naik dan efek yang sama kini terdeteksi).",
        "Syarat: expected count >= 5 di tiap sel — dengan tabel ×10, expected count menjadi 25; 15; 12,5; 7,5; 12,5; 7,5 — semuanya ≥ 5, syarat terpenuhi. Sampel kecil = power rendah. ANOVA adalah analog kontinu untuk 3+ grup — satu F-test menggantikan banyak uji t berpasangan (post-hoc Tukey sesudahnya jika signifikan).",
      ],
      requires: ["scipy", "numpy"],
      tasks: [
        { id: "t1", text: "Jalankan `chi2_contingency(tabel)`, dapatkan `chi2`, `p_chi`, `dof`" },
        { id: "t2", text: "Tentukan `signif_chi` = (p_chi < 0.05)" },
      ],
      expected: "chi2=16.00  p=0.000  dof=2  signif_chi=True",
      note: {
        title: "Sering salah",
        body: "Membaca 'tidak signifikan' sebagai 'tidak ada efek'. Yang benar: tidak cukup bukti untuk klaim ada efek — bisa jadi efek kecil yang butuh n lebih besar. Power rendah bukan bukti nol.",
      },
      hints: [
        "chi2, p_chi, dof, exp = chi2_contingency(tabel).",
        "Baris = kota (Jakarta, Bandung, Surabaya), kolom = [macet, lancar].",
        "signif_chi = p_chi < 0.05",
      ],
      code: {
        starter: `import numpy as np\nfrom scipy.stats import chi2_contingency\n\n# baris = kota, kolom = [macet, lancar]\ntabel = np.array([[20, 20], [10, 10], [20, 0]])\n\n# TULIS KODEMU\nchi2, p_chi, dof, exp = \nsignif_chi = \n\nprint(f"chi2={chi2:.2f}  p={p_chi:.3f}  dof={dof}  signif_chi={signif_chi}")`,
        lockLines: 4,
        solution: `import numpy as np\nfrom scipy.stats import chi2_contingency\n\n# baris = kota, kolom = [macet, lancar]\ntabel = np.array([[20, 20], [10, 10], [20, 0]])\n\n# TULIS KODEMU\nchi2, p_chi, dof, exp = chi2_contingency(tabel)\nsignif_chi = p_chi < 0.05\n\nprint(f"chi2={chi2:.2f}  p={p_chi:.3f}  dof={dof}  signif_chi={signif_chi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "chi2", value: 16.0, tol: 0.05, label: "`chi2` sekitar 16.00", msg: "Dari tabel 3x2 (n ×10)." },
          { kind: "equal", task: "t1", name: "dof", value: 2, tol: 1e-9, label: "`dof` = 2", msg: "(3-1) x (2-1) = 2." },
          { kind: "equal", task: "t2", name: "signif_chi", value: true, label: "`signif_chi` = True", msg: "p=0.000335 < 0.05 — signifikan." },
          { kind: "stdout_matches", task: "t2", pattern: "chi2=16\\.00\\s+p=0\\.000\\s+dof=2\\s+signif_chi=True", label: "`print` menampilkan semuanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "chi2, p, dof, exp = chi2_contingency(tabel). Expected count >= 5.",
    },
    {
      id: "ols",
      eyebrow: "Langkah 5 · Regresi OLS",
      title: "Gaji memprediksi DPD?",
      prose: [
        "`statsmodels.formula.api.ols('dpd ~ gaji', data=df).fit()` memberi model lengkap: koefisien, R-squared, p-value tiap koefisien. Slope −1,858e-06: tiap Rp 1 juta gaji naik, DPD turun ~1.86 hari. Intercept 28.19. R²=0.19 — gaji menjelaskan 19% variasi DPD.",
        "statsmodels untuk inferensi (apa efeknya? seberapa yakin?), sklearn untuk prediksi (seberapa akurat?). Asumsi OLS: linearitas, residual acak, homoskedastis, residual ~ normal. Jika residual berpola — model salah spesifikasi.",
      ],
      requires: ["statsmodels", "numpy", "pandas"],
      tasks: [
        { id: "t1", text: "Fit OLS dpd ~ gaji, ambil `slope` dan `intercept`" },
        { id: "t2", text: "Ambil `r2`, tentukan `slope_neg` = (slope < 0)" },
      ],
      expected: "slope=-1.858e-06  r2=0.19  slope_neg=True",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "R²=0.19 berarti 81% variasi tidak dijelaskan gaji — model satu variabel jarang cukup untuk keputusan kredit. Regresi bivariat adalah eksplorasi, bukan scorecard. Keputusan butuh multivariat + validasi.",
      },
      hints: [
        "import statsmodels.api as sm; X = sm.add_constant(df['gaji']).",
        "model = sm.OLS(df['dpd'], X).fit().",
        "slope = model.params['gaji']; r2 = model.rsquared",
      ],
      code: {
        starter: `import numpy as np, pandas as pd\nimport statsmodels.api as sm\n\nrng = np.random.default_rng(11)\nn = 150\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n) + (gaji < 7_000_000).astype(int) * rng.poisson(20, n)\ndf = pd.DataFrame({"gaji": gaji, "dpd": dpd})\n\n# TULIS KODEMU\nX = \nmodel = \nslope = \nintercept = \nr2 = \nslope_neg = \n\nprint(f"slope={slope:.3e}  intercept={intercept:.2f}  r2={r2:.2f}  slope_neg={slope_neg}")`,
        lockLines: 8,
        solution: `import numpy as np, pandas as pd\nimport statsmodels.api as sm\n\nrng = np.random.default_rng(11)\nn = 150\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n) + (gaji < 7_000_000).astype(int) * rng.poisson(20, n)\ndf = pd.DataFrame({"gaji": gaji, "dpd": dpd})\n\n# TULIS KODEMU\nX = sm.add_constant(df["gaji"])\nmodel = sm.OLS(df["dpd"], X).fit()\nslope = model.params["gaji"]\nintercept = model.params["const"]\nr2 = model.rsquared\nslope_neg = slope < 0\n\nprint(f"slope={slope:.3e}  intercept={intercept:.2f}  r2={r2:.2f}  slope_neg={slope_neg}")`,
        checks: [
          { kind: "equal", task: "t1", name: "slope", value: -1.858e-06, tol: 1e-08, label: "`slope` sekitar −1,858e-06", msg: "Negatif: gaji naik, DPD turun." },
          { kind: "equal", task: "t2", name: "r2", value: 0.19, tol: 0.02, label: "`r2` sekitar 0.19", msg: "Gaji menjelaskan 19% variasi DPD." },
          { kind: "equal", task: "t2", name: "slope_neg", value: true, label: "`slope_neg` = True", msg: "Slope negatif — hubungan terbalik." },
          { kind: "stdout_matches", task: "t2", pattern: "slope=-1\\.858e-06\\s+intercept=28\\.19\\s+r2=0\\.19\\s+slope_neg=True", label: "`print` menampilkan semuanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "statsmodels = inferensi (efek + keyakinan); sklearn = prediksi (akurasi).",
    },
    {
      id: "advanced-peta-uji",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: peta pemilihan uji hipotesis & multiple testing",
      prose: [
        "Dua penguasaan yang memisahkan pemakai rumus uji dari praktisi statistik. Pertama, PETA PEMILIHAN UJI — uji yang benar ditentukan oleh PERTANYAAN dan JENIS DATA, bukan oleh yang paling dihafal. Membandingkan rata-rata 2 grup independen: t-test (independen); 2 grup BERPASANGAN (sebelum-sesudah nasabah yang sama): paired t-test — memakai t-test independen di sini membuang power. Lebih dari 2 grup: ANOVA (lalu post-hoc, bukan 15 t-test berpasangan). Data tidak normal atau n kecil: Mann-Whitney / Kruskal-Wallis (non-parametrik: membandingkan ranking, bukan mean). Membandingkan PROPORSI (default rate 2 segmen): z-test proporsi atau chi-square; HUBUNGAN dua kategorikal: chi-square independensi; korelasi: Pearson untuk linear, Spearman untuk monotonik. Sebelum SEMUA uji parametrik, checklist asumsi: independensi observasi, normalitas RESIDUAL (bukan data mentah — kesalahan klasik), homogenitas varians. Bila asumsi dilanggar: transformasi, uji non-parametrik, atau bootstrap — bukan 'tetap jalan, semoga tidak ketahuan'.",
        "Kedua, MULTIPLE TESTING — dosa statistik yang paling sering dilakukan tanpa sadar. Menjalankan 20 uji pada alpha 0,05 berarti EKSPEKTASI 1 false positive — bukan kemungkinan, melainkan harapan matematis. Di EDA, ini terjadi diam-diam: menguji 40 segmen, menemukan 2 yang 'signifikan', lalu bertindak seolah menemukan sesuatu. Perbaikannya berlapis: BONFERRONI (alpha/m — ketat, untuk sedikit uji konfirmatori), BENJAMINI-HOCHBERG / FDR (mengontrol proporsi temuan palsu — untuk screening eksploratori banyak hipotesis), dan yang paling penting secara disiplin: bedakan KONFIRMATORI (satu hipotesis, ditetapkan SEBELUM melihat data, alpha penuh) dari EKSPLORATORI (banyak hipotesis, dikontrol FDR, dilabeli 'pembangkit hipotesis, butuh konfirmasi'). p-hacking tidak butuh niat jahat — cukup EDA yang antusias tanpa koreksi.",
        "Aturan keputusan senior dalam satu kalimat: satu pertanyaan utama = satu uji konfirmatori yang direncanakan; sisanya eksploratori dengan koreksi — dan p-value selalu dilaporkan bersama EFFECT SIZE + confidence interval, karena 'signifikan' tanpa 'seberapa besar' adalah setengah informasi. Selisih NPL 0,02pp dengan p < 0,001 (n raksasa) adalah signifikan secara statistik dan tidak relevan secara bisnis — dan analis yang melaporkannya tanpa effect size sedang menyesatkan dengan jujur.",
      ],
      tasks: [],
      reference: "Pilih uji dari pertanyaan + jenis data; cek asumsi (residual!) dulu. Banyak uji = koreksi (Bonferroni/FDR); konfirmatori vs eksploratori; p-value + effect size + CI.",
    },
    {
      id: "minicase-segmen-ajaib",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: segmen ajaib yang tidak ada",
      prose: [
        "Skenario (angka konkret): analis menguji perbedaan NPL di 40 segmen cabang (alpha 0,05 per uji). Dua segmen 'signifikan': p = 0,03 dan p = 0,04 — cabang X dan Y dinyatakan bermasalah. Intervensi diluncurkan: audit khusus + pengetatan penyaluran, biaya Rp 600 juta. Enam bulan kemudian tidak ada perbaikan — karena tidak ada yang perlu diperbaiki. Dengan 40 uji pada alpha 0,05, ekspektasi false positive = 40 x 0,05 = 2 — TEPAT dua 'temuan' yang dilaporkan. Ambang Bonferroni yang benar: 0,05/40 = 0,00125 — tidak satu pun yang lolos.",
        "Pertanyaan analisis: (1) Mengapa 2 temuan signifikan justru yang diharapkan? (2) Apa yang seharusnya dilakukan sebelum intervensi Rp 600 juta? (3) Bagaimana desain analisis yang benar untuk 40 segmen?",
        "Pembahasan: (1) Di bawah hipotesis nol (tidak ada perbedaan nyata), tiap uji punya peluang 5% false positive; 40 uji independen menghasilkan ~2 false positive secara ekspektasi — 'temuan' itu adalah noise yang dipanen, bukan sinyal yang ditemukan. (2) Koreksi multiple testing SEBELUM bertindak: Bonferroni (ketat) atau FDR Benjamini-Hochberg (untuk screening) — lalu replikasi di data periode BERBEDA sebelum intervensi mahal. (3) Tetapkan SATU hipotesis primer konfirmatori (mis. 'NPL cabang X > rata-rata nasional') sebelum melihat data; 39 lainnya eksploratori dengan FDR dan dilabeli hipotesis-untuk-dikonfirmasi — bukan dasar intervensi.",
        "Kaitan ke karier: Rp 600 juta dibakar bukan karena statistiknya salah, melainkan karena tidak ada yang bertanya 'berapa banyak uji yang kita jalankan untuk mendapat 2 nilai p ini'. Pertanyaan itu gratis; intervensi itu tidak.",
      ],
      tasks: [],
      reference: "Banyak uji = ekspektasi false positive. Koreksi dulu (Bonferroni/FDR), replikasi, baru intervensi.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: p-value mengukur kejutan, bukan kebenaran",
      prose: [
        "Heuristik penutup: statistik inferensia adalah alat meragukan klaim — termasuk klaimmu sendiri.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: p-value mengukur kejutan, bukan kebenaran",
        body: "Heuristik pertama: p < 0,05 berarti 'data ini mengejutkan bila tidak ada efek' — BUKAN 'efek ini benar' dan BUKAN 'efek ini besar'. Selalu pasangkan dengan effect size dan confidence interval; signifikansi tanpa besaran adalah setengah informasi yang menyesatkan. Heuristik kedua: asumsi dulu, uji kemudian — t-test pada data tak independen atau residual tak normal menghasilkan p-value yang presisi dan salah; 5 menit cek asumsi menghemat 5 bulan mempertahankan kesimpulan yang rapuh. Heuristik ketiga: hitung berapa uji yang kamu jalankan — setiap uji tambahan adalah tiket lotre false positive; koreksi (Bonferroni untuk sedikit, FDR untuk banyak) bukan birokrasi, melainkan kejujuran. Heuristik keempat: bedakan konfirmatori dari eksploratori — hipotesis yang lahir SETELAH melihat data tidak boleh diuji pada data yang sama tanpa koreksi dan label 'butuh konfirmasi independen'. Heuristik kelima, yang paling senior: tanyakan 'bagaimana jika saya salah' SEBELUM 'apakah saya benar' — desain analisis yang baik membuat kesalahan mahal menjadi sulit, bukan membuat kebenaran menjadi mudah diklaim.",
      },
      reference: "p-value = kejutan, bukan kebenaran. Asumsi dulu; koreksi uji ganda; konfirmatori vs eksploratori; selalu + effect size & CI.",
    },
    {
          id: "gap-r9-confidence-interval",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P6-G3)",
          title: "Confidence interval: dari p-value ke rentang",
          prose: [
            "Langkah 2 melaporkan t, p, dan Cohen's d — tetapi belum confidence interval (CI). p-value menjawab “apakah beda?”, CI menjawab “seberapa besar bedanya, dengan ketidakpastian berapa?”. CI 95% untuk selisih mean: selisih ± t_kritis × SE. Bila CI tidak memuat 0, kesimpulannya sama dengan p < 0,05 — tetapi CI memberi LEBIH: lebarnya menunjukkan presisi, dan batasnya menunjukkan efek terkecil yang masih konsisten dengan data.",
            "Di scipy: `scipy.stats.t.interval(0.95, df, loc=selisih, scale=SE)` memberi CI selisih mean; di statsmodels: `model.conf_int()` memberi CI tiap koefisien (langkah 5, OLS). Keduanya harus dibaca bersama p-value — p-value tanpa CI adalah klaim tanpa ukuran ketidakpastian.",
            "Contoh angka (uji-t lesson ini): selisih mean Rp2,0 jt, SE = 0,422, t_kritis ≈ 2,0 → margin = 2,0 × 0,422 = 0,844 → CI 95% = (2,0 − 0,844; 2,0 + 0,844) = (1,16; 2,84) juta. Artinya: beda gaji antar-grup diestimasi Rp2,0 jt, dan data masih konsisten dengan beda sekecil Rp1,16 jt atau sebesar Rp2,84 jt — tetapi TIDAK konsisten dengan 0 (itulah mengapa p < 0,05).",
          ],
          formula: String.raw`CI_{95\%} = \text{selisih} \pm t_{kritis} \times SE`,
          formulaNote: "CI 95% selisih mean = selisih ± t_kritis × SE. scipy: t.interval(0.95, df, loc, scale). statsmodels: model.conf_int(). Contoh angka: selisih 2,0, SE 0,422, t_kritis 2,0 → CI (1,16; 2,84) — tidak memuat 0, konsisten dengan p < 0,05.",
          tasks: [
            { id: "t1", text: "Hitung `lo` dan `hi` CI 95% (selisih 2,0, SE 0,422, t_kritis 2,0)" },
            { id: "t2", text: "Cetak CI-nya" },
          ],
          expected: "CI=(1.16, 2.84)",
          hints: [
            "margin = t_kritis × SE.",
            "lo = selisih − margin; hi = selisih + margin.",
          ],
          code: {
            starter: `selisih, se, t_kritis = 2.0, 0.422, 2.0\n\n# TULIS KODEMU: CI 95% selisih mean\nlo = \nhi = \n\nprint(f"CI=({lo:.2f}, {hi:.2f})")`,
            lockLines: 3,
            solution: `selisih, se, t_kritis = 2.0, 0.422, 2.0\n\n# TULIS KODEMU: CI 95% selisih mean\nlo = selisih - t_kritis * se\nhi = selisih + t_kritis * se\n\nprint(f"CI=({lo:.2f}, {hi:.2f})")`,
            checks: [
              { kind: "equal", task: "t1", name: "lo", value: 1.16, tol: 0.01, label: "`lo` seharusnya 1,16", msg: "2,0 − 2,0×0,422 = 1,16." },
              { kind: "equal", task: "t1", name: "hi", value: 2.84, tol: 0.01, label: "`hi` seharusnya 2,84", msg: "2,0 + 2,0×0,422 = 2,84." },
              { kind: "stdout_matches", task: "t2", pattern: "CI=\\(1.16, 2.84\\)", label: "`print` menampilkan CI", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "CI 95% selisih mean adalah (1,16; 2,84) juta. Pernyataan yang benar?",
              options: [
                { text: "Beda diestimasi 2,0 jt; data konsisten dengan beda 1,16–2,84 jt, tidak dengan 0", why: "Benar: CI yang tidak memuat 0 sejalan dengan p < 0,05 — dan memberi rentang efeknya.", correct: true },
                { text: "95% peluang beda sebenarnya ada di (1,16; 2,84)", why: "Salah: CI frequentist bukan pernyataan peluang tentang parameter — ia rentang yang prosedurnya mencakup parameter 95% dari waktu." },
                { text: "Beda sebenarnya PASTI 2,0 jt", why: "Salah: 2,0 adalah estimasi titik; CI menunjukkan ketidakpastiannya." },
              ],
            },
          ],
          reference: "CI = selisih ± t_kritis × SE; t.interval / conf_int(); CI tanpa 0 ≈ p < 0,05.",
        },
    {
          id: "gap-r9-multiple-testing",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P6-G4)",
          title: "Multiple testing: Bonferroni & FDR",
          prose: [
            "Lesson ini menguji SATU hipotesis per langkah — tetapi analis nyata menguji puluhan sekaligus (tiap segmen, tiap KRI, tiap fitur). Masalahnya: tiap uji punya peluang 5% false positive — dengan 20 uji, peluang SETIDAKNYA satu false positive adalah 1 − 0,95²⁰ ≈ 64%. Tanpa koreksi, “temuan signifikan” dari 20 uji hampir pasti mengandung palsu.",
            "Bonferroni (paling ketat): bagi α dengan jumlah uji — α_bonf = 0,05/5 = 0,01 untuk 5 uji; hanya p ≤ 0,01 yang signifikan. FDR Benjamini–Hochberg (lebih bertenaga): urutkan p menaik, bandingkan p_(k) dengan (k/m)×α, tolak semua sampai k terbesar yang memenuhi. Di statsmodels: `statsmodels.stats.multitest.multipletests(pvals, method='bonferroni'/'fdr_bh')`.",
            "Contoh angka (5 p-value): [0,01; 0,04; 0,03; 0,20; 0,005]. Bonferroni (α=0,01): yang lolos hanya 0,01 dan 0,005 → 2 temuan. FDR: urutkan [0,005; 0,01; 0,03; 0,04; 0,20], bandingkan dengan [0,01; 0,02; 0,03; 0,04; 0,05] — 0,005≤0,01 ✓, 0,01≤0,02 ✓, 0,03≤0,03 ✓, 0,04≤0,04 ✓, 0,20≤0,05 ✗ → tolak 4 pertama. FDR menemukan 4, Bonferroni 2 — harga ketegasan Bonferroni adalah power yang hilang; harga power FDR adalah membiarkan ~5% temuan yang ditolak adalah false (itulah arti “false discovery rate”).",
          ],
          formula: String.raw`\text{Bonferroni: } \alpha/m \qquad \text{FDR: tolak } p_{(k)} \leq \frac{k}{m}\alpha`,
          formulaNote: "Multiple testing: 20 uji × α=5% → ~64% peluang ≥1 false positive. Bonferroni: α/m. FDR (BH): bandingkan p terurut dengan (k/m)×α. Contoh angka: p [0,01; 0,04; 0,03; 0,20; 0,005] → Bonferroni 2, FDR 4.",
          tasks: [
            { id: "t1", text: "Hitung `bonf` (p ≤ 0,05/5) dan `fdr` (Benjamini–Hochberg, α=0,05)" },
            { id: "t2", text: "Cetak keduanya" },
          ],
          expected: "bonf=2 fdr=4",
          hints: [
            "bonf = jumlah p ≤ 0,01.",
            "Urutkan p; bandingkan p ke-(k) dengan (k/5)×0,05; fdr = k terbesar yang lolos.",
          ],
          code: {
            starter: `pvals = [0.01, 0.04, 0.03, 0.20, 0.005]\nalpha = 0.05\n\n# TULIS KODEMU: Bonferroni + FDR (Benjamini-Hochberg)\nbonf = \nfdr = \n\nprint(f"bonf={bonf} fdr={fdr}")`,
            lockLines: 4,
            solution: `pvals = [0.01, 0.04, 0.03, 0.20, 0.005]\nalpha = 0.05\n\n# TULIS KODEMU: Bonferroni + FDR (Benjamini-Hochberg)\nbonf = sum(1 for p in pvals if p <= alpha / len(pvals))\nurut = sorted(pvals)\nfdr = 0\nfor k, p in enumerate(urut, start=1):\n    if p <= k / len(urut) * alpha:\n        fdr = k\n\nprint(f"bonf={bonf} fdr={fdr}")`,
            checks: [
              { kind: "equal", task: "t1", name: "bonf", value: 2, label: "`bonf` seharusnya 2", msg: "Hanya 0,01 dan 0,005 ≤ 0,01." },
              { kind: "equal", task: "t1", name: "fdr", value: 4, label: "`fdr` seharusnya 4", msg: "BH menolak 4 pertama (0,005; 0,01; 0,03; 0,04)." },
              { kind: "stdout_matches", task: "t2", pattern: "bonf=2\\s+fdr=4", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Kamu menguji 20 segmen sekaligus, satu “signifikan” di p=0,04 tanpa koreksi. Apa yang harus dilakukan?",
              options: [
                { text: "Koreksi multiple testing (Bonferroni/FDR) — p=0,04 tidak lolos Bonferroni 0,0025", why: "Benar: dengan 20 uji, p=0,04 sangat mungkin false positive.", correct: true },
                { text: "Laporkan sebagai temuan — p < 0,05 sudah cukup", why: "Salah: 20 uji × 5% = ~64% peluang ≥1 false positive." },
                { text: "Uji ulang segmen itu saja sampai p < 0,01", why: "Salah: menguji ulang sampai signifikan adalah p-hacking." },
              ],
            },
          ],
          reference: "Bonferroni α/m (ketat); FDR BH (k/m)×α (bertenaga). multipletests() di statsmodels.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "p-value 0.03 artinya...",
          options: [
            { text: "H0 benar dengan prob 3%", why: "Bukan probabilitas H0 benar." },
            { text: "Jika H0 benar, hasil seekstrem ini terjadi 3% dari waktu", why: "Definisi tepat p-value.", correct: true },
            { text: "Efeknya besar", why: "p tidak mengukur besar efek." },
            { text: "Pasti signifikan praktis", why: "Signifikan statistik bukan signifikan praktis." },
          ],
        },
        {
          q: "n besar, p=0.001, beda 0.1%...",
          options: [
            { text: "Langsung action", why: "Efek kecil mungkin tidak worth it." },
            { text: "Cek effect size dulu", why: "Signifikan tanpa besar efek = tidak penting.", correct: true },
            { text: "Abaikan p-value", why: "p tetap informatif, tapi tidak cukup." },
            { text: "Tambah n lagi", why: "n sudah besar; masalahnya bukan power." },
          ],
        },
        {
          q: "Data sangat skew, alternatif uji t...",
          options: [
            { text: "Uji t tetap", why: "Asumsi normal dilanggar." },
            { text: "Mann-Whitney U (nonparametrik)", why: "Ranking, bukan mean — tahan skew.", correct: true },
            { text: "Chi-square", why: "Chi-square untuk kategorikal." },
            { text: "Regresi", why: "Regresi juga punya asumsi." },
          ],
        },
        {
          q: "R² = 0.19 artinya...",
          options: [
            { text: "Korelasi 0.19", why: "R² bukan korelasi (itu r)." },
            { text: "19% variasi target dijelaskan model", why: "Interpretasi tepat R².", correct: true },
            { text: "Model 19% akurat", why: "R² bukan akurasi klasifikasi." },
            { text: "Model buruk", why: "Rendah untuk prediksi, tapi bisa cukup untuk inferensi." },
          ],
        },
      ],
      summary: [
        "Inferensial menjawab 'bisa digeneralisasi?': p-value + effect size.",
        "Lapor keduanya: signifikan (p) dan besarnya (d/R²).",
        "Cek asumsi: shapiro untuk normalitas; mannwhitneyu jika gagal.",
        "statsmodels = inferensi; sklearn = prediksi.",
        "'Tidak signifikan' = bukti kurang, bukan bukti nol.",
      ],
      next: { label: "D12 — scikit-learn", href: "/v2/learn/d12-sklearn" },
    },
  ],
};
