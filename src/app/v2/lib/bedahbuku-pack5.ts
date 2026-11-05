import type { ChapterPack } from "./bedahbuku";

export const PACK5: ChapterPack = {
  slug: "bab-5",
  bab: 5,
  judul: `Evaluating Risk`,
  catatan: `bab "cuci piring" — prosedur pengujian model risiko yang teoritis-bermotivasi dan relevan bagi praktisi. Dua prinsip: metrik harus sedekat mungkin dengan aplikasi, dan tidak ada model terbaik tunggal — prioritaskan sesuai use-case. Tiga keluarga metrik: kovarians, presisi, dan tugas sekunder.`,
  ideBesar: `tidak ada satu angka pun yang bisa memahkotai "model risiko terbaik" — jadi bab ini membangun tiga keluarga pengujian yang masing-masing menjawab pertanyaan praktis berbeda. Keluarga pertama menguji matriks kovarians lewat robust loss functions (QLIKE & MSE, dengan sifat rank robustness: ranking dua model tetap sama walau volatilitas sejati tak teramati dan hanya di-proxy) plus empat ekstensi multivariat (production strategies, average-case, worst-case, leading-alpha MVO, QDIST). Keluarga kedua menguji matriks presisi — invers kovarians yang dipakai langsung di optimasi mean-variance — lewat portofolio minimum-variance (teorema Engle & Colacito: model yang lebih akurat → varians terealisasi lebih rendah) dan uji jarak Mahalanobis yang portfolio-independent (MALV). Keluarga ketiga menguji kelayakan produksi: turnover model (via Factor-Mimicking Portfolios) dan akurasi beta. Dan sebagai penutup, bab ini membongkar metrik paling populer — $R^2$ — sebagai tidak memadai untuk seleksi model risiko: ia rentan data mining dan buta terhadap rotational invariance.`,
  diagram: `TIGA KELUARGA METRIK (5.1 / 5.2 / 5.3)
A. KOVARIANS — seberapa akurat prakiraan volatilitas?
   QLIKE(σ̂,r) = (1/T)Σ(r_t²/σ̂_t² − log(r_t²/σ̂_t²) − 1)   ← skewed
   MSE(σ̂,r)   = (1/T)Σ(r_t²/σ̂_t² − 1)²                  ← simetris
   rank robustness (Hansen–Lunde): ranking model konsisten walau pakai proxy
   multivariat: production strategies · average-case (5.1) · worst-case (5.2)
                leading-alpha MVO (5.3) · QDIST = Σ(rᵀΩ̂⁻¹r + log|Ω̂| + n log 2π)

B. PRESISI — seberapa bagus Ω̂⁻¹ untuk optimasi?
   min wᵀΩ̂_r w s.t. μᵀw = 1 → w(Ω̂_r) = (μᵀΩ̂_r⁻¹μ)⁻¹Ω̂_r⁻¹μ
   Engle & Colacito: vol terealisasi w(Ω̂_r) ≥ vol w(Ω_r); sama iff Ω_r ∝ Ω̂_r
   Mahalanobis: d(r,Ω_r) = rᵀΩ_r⁻¹r ; ν_t = (1/n_t)r_tᵀΩ̂⁻¹r_t ; MALV = var(ν_1..ν_T)
   MALV rendah → presisi bagus (∼2/n = sempurna kecuali konstanta multiplikatif)

C. ANCILLARY — layak produksi?
   FMP: P_t = Ω_{ϵ,t}⁻¹B_t(B_tᵀΩ_{ϵ,t}⁻¹B_t)⁻¹ ; turnover² = (1/T)Σ‖P_t−P_{t−1}‖_F
   beta: β_t(w) = Ω_{r,t}w/(wᵀΩ_{r,t}w) [model] vs β̂_t(w) = Ω̂_{r,t}w/(wᵀΩ̂_{r,t}w) [empiris]
   BETAERR(w) = Σ_t‖β_t − β̂_t‖²

D. YANG DITOLAK: R²
   R² = 1 − (residual SS)/(total SS) — TERTUKAR di ringkasan Gemini, versi buku di atas
   dua model (asli vs rotasi acak per periode): R² IDENTIK, kovarians kedua SALAH
   → R² buta rotational invariance + rentan data mining → heuristik ahli: % periode |t|>2,
     realized Sharpe tiap return faktor`,
  konsep: [
    {
      nama: `Dua prinsip evaluasi`,
      definisi: `(1) metrik sedekat mungkin dengan aplikasi: akurasi prakiraan volatilitas dan volatilitas terealisasi portofolio teroptimasi, diukur dalam setting realistis; (2) tidak ada ukuran tunggal → tidak ada model terbaik tunggal — prioritaskan sesuai use-case.`,
      relasi: `seluruh bab adalah elaborasi dua prinsip ini; kutipan pembuka: "Everybody wants to save the Earth; nobody wants to help Mom do the dishes" (P. J. O'Rourke).`,
    },
    {
      nama: `Robust loss function`,
      definisi: `fungsi kerugian dengan rank robustness: model 1 lebih baik dari model 2 menurut proxy volatilitas empiris iff ia juga lebih baik menurut volatilitas sejati yang tak teramati (Hansen & Lunde 2006a; Patton & Sheppard 2009; Patton 2011).`,
      relasi: `QLIKE & MSE lolos karakterisasi ini — keduanya dipakai menggantikan statistik Bias.`,
    },
    {
      nama: `QLIKE`,
      definisi: `(kecuali konstanta) negatif log-likelihood distribusi normal; skewed: rugi lebih besar saat varians terealisasi lebih kecil dari varians estimasi (Gambar 5.1).`,
      relasi: `menghukum over-prediction lebih keras — masuk akal untuk manajer risiko yang takut meremehkan risiko? (hati-hati: justru over-estimasi yang dihukum — baca Deep Dive 2.1).`,
    },
    {
      nama: `MSE`,
      definisi: `rata-rata kuadrat deviasi rasio $r_t^2/\\hat{\\sigma}_t^2$ dari 1; simetris sebagai fungsi rasio (kontras dengan QLIKE).`,
      relasi: `pasangan QLIKE — keduanya univariat, bukan untuk matriks kovarians langsung.`,
    },
    {
      nama: `QDIST`,
      definisi: `$\\sum_t (r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t + \\log|\\hat{\\Omega}_{r,t}| + n\\log(2\\pi))$: likelihood distribusi multivariat — jembatan ke pengujian kovarians penuh.`,
      relasi: `versi multivariat dari logika QLIKE.`,
    },
    {
      nama: `Portofolio minimum-variance`,
      definisi: `$\\min_w w^T\\hat{\\Omega}_r w$ s.t. $\\mu^Tw = 1$; solusi $w(\\hat{\\Omega}_r) = (\\mu^T\\hat{\\Omega}_r^{-1}\\mu)^{-1}\\hat{\\Omega}_r^{-1}\\mu$.`,
      relasi: `menguji presisi secara tidak langsung — model kovarians yang lebih akurat menghasilkan varians terealisasi lebih rendah (Teorema 5.1/Engle & Colacito).`,
    },
    {
      nama: `Mahalanobis distance & MALV`,
      definisi: `$d(r,\\Omega_r) := r^T\\Omega_r^{-1}r$ (tanpa akar!); $\\nu_t = \\frac{1}{n_t}r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t$; $\\text{MALV} = \\text{var}(\\nu_1,\\dots,\\nu_T)$.`,
      relasi: `satu-satunya uji yang portfolio-independent dan hanya melibatkan matriks presisi; MALV ~ $2/n$ = presisi sempurna kecuali konstanta multiplikatif (konstanta diurus uji volatilitas).`,
    },
    {
      nama: `Factor-Mimicking Portfolio (FMP)`,
      definisi: `portofolio yang return-nya aproksimasi terbaik return faktor sejati; bobotnya kolom-kolom $P_t = \\Omega_{\\epsilon,t}^{-1}B_t(B_t^T\\Omega_{\\epsilon,t}^{-1}B_t)^{-1}$.`,
      relasi: `fondasi ukuran turnover model — turnover bukan sifat intrinsik model, melainkan sifat strategi trading produksi.`,
    },
    {
      nama: `Model turnover`,
      definisi: `$\\text{turnover}^2 = \\frac{1}{T}\\sum_t \\|P_t - P_{t-1}\\|_F$ (atau versi biaya transaksi $\\text{turnover}_{TC}$ bila target eksposur $b$ dan fungsi biaya $TC$ diketahui).`,
      relasi: `tiga driver perubahan: alpha turnover (Bab 11), fungsi market impact, dan model faktor (subjek bab ini).`,
    },
    {
      nama: `Beta accuracy (BETAERR)`,
      definisi: `$\\text{BETAERR}(w) = \\sum_t \\|\\beta_t - \\hat{\\beta}_t\\|^2$: beta prediksi model vs beta terealisasi empiris (EWMA).`,
      relasi: `ukuran ancillary untuk akurasi prediksi beta terhadap portofolio acuan/tematik.`,
    },
    {
      nama: `R² cross-sectional`,
      definisi: `1 minus rasio weighted residual sum of squares terhadap total sum of squares.`,
      relasi: `metrik populer yang DITOLAK bab ini untuk seleksi model risiko — contoh rotasi acak membuktikan ia identik untuk dua model yang satu kovariansnya salah total.`,
    },
  ],
  deepDive: [
    {
      judul: `QLIKE & MSE — dua fungsi kerugian yang robust`,
      ringkas: `Dua fungsi kerugian yang rankingnya tetap sah walau volatilitas sejati tak pernah terlihat — QLIKE menghukum over-estimasi lebih keras.`,
      definisi: `Untuk prakiraan volatilitas $\\hat{\\sigma}_t$ dan return $r_t$ ($r_t^2$ = proxy varians teramati): $\\text{QLIKE}(\\hat{\\sigma}, r) := \\frac{1}{T}\\sum_{t=1}^T \\left(\\frac{r_t^2}{\\hat{\\sigma}_t^2} - \\log\\frac{r_t^2}{\\hat{\\sigma}_t^2} - 1\\right)$ dan $\\text{MSE}(\\hat{\\sigma}, r) := \\frac{1}{T}\\sum_{t=1}^T \\left(\\frac{r_t^2}{\\hat{\\sigma}_t^2} - 1\\right)^2$. Keduanya non-negatif dan nol iff $\\hat{\\sigma} = \\tilde{\\sigma}$ (proxy empiris, mis. realized volatility). Patton & Sheppard (2009) dan Patton (2011) mengkarakterisasi penuh fungsi-fungsi ini dan menunjukkan keduanya robust dalam arti Hansen–Lunde: ranking dua prakiraan menurut proxy takbias $\\tilde{\\sigma}_t$ sama dengan ranking menurut volatilitas sejati $\\sigma_t$ yang tak teramati.`,
      kenapa: `Volatilitas sejati tidak pernah teramati — kita hanya punya proxy (realized volatility). Tanpa rank robustness, "model A menang" bisa jadi artefak proxy, bukan keunggulan sejati. QLIKE & MSE menyelesaikan ini, dan keduanya kini menggantikan statistik Bias.`,
      contoh: `Ilustrasi (rasio $x := r_t^2/\\hat{\\sigma}_t^2$): bila $x = 1$ (prakiraan tepat): QLIKE $= 1 - \\log 1 - 1 = 0$, MSE $= 0$. Bila $x = 0{,}5$ (realisasi separuh prakiraan → over-estimasi 2×): QLIKE $= 0{,}5 - \\log 0{,}5 - 1 \\approx 0{,}193$; MSE $= 0{,}25$. Bila $x = 2$ (under-estimasi 2×): QLIKE $= 2 - \\log 2 - 1 \\approx 0{,}307$; MSE $= 1$. Perhatikan: QLIKE menghukum $x < 1$ (realisasi < estimasi) lebih berat daripada MSE pada deviasi yang sama — itulah skewness di Gambar 5.1 ("higher losses when the realized variance is smaller than the estimated variance").`,
      jebakan: `Empat jebakan dalam memakai QLIKE/MSE — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `QLIKE skewed, BUKAN simetris`, isi: `Jangan samakan perilakunya dengan MSE; pilihan loss function adalah pilihan asimetri hukuman.`, nada: "jebakan" },
        { judul: `Keduanya univariat`, isi: `Untuk matriks kovarians butuh ekstensi (Deep Dive 2.2), bukan plug-and-play.`, nada: "jebakan" },
        { judul: `Rank robustness $\\neq$ proxy tidak penting`, isi: `Proxy harus takbias (realized volatility); proxy bias tetap merusak ranking.`, nada: "jebakan" },
        { judul: `Syarat proxy $r_t^2$`, isi: `$r_t^2$ sebagai proxy varians hanya sah bila $E[r_t^2] \\gg E[r_t]^2$ (lihat Bab 2) — drift besar merusak proxy.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Empat jalan ke multivariat — dari satu aset ke portofolio nyata`,
      ringkas: `Empat cara membawa QLIKE/MSE ke dunia multivariat — tak ada yang dominan, semuanya kompromi antara biaya komputasi dan relevansi.`,
      definisi: `Empat ekstensi multivariat — dirinci satu per satu di bawah.`,
      kenapa: `Tidak ada jalan multivariat yang dominan — "none of the options above dominates the others". Pilihannya adalah trade-off komputasi vs relevansi: average/worst-case mahal; leading-alpha murah tapi bergantung pada realisasi alpha.`,
      contoh: `Prosedur 5.2 (worst-case): iterasi $w \\sim N(0, I_n)$, akumulasi $L_{tot} += L[(r_s^Tw)^2, w^T\\hat{\\Omega}_s w]$, berhenti bila kontribusi iterasi $< \\epsilon_{tol}$ — mencari portofolio acak yang paling "mempermalukan" model.`,
      jebakan: `Empat jebakan dalam pengujian multivariat — dirinci di kartu bernomor di bawah.`,
      poin: [
        { judul: `Production strategies`, isi: `Bila strategi sudah berjalan, uji performa tersimulasinya di bawah model faktor berbeda — QLIKE/MSE dicek bersama metrik manajer portofolio (Sharpe, PnL); syarat: kovarians harus menjadi input seluruh proses produksi.` },
        { judul: `Average-case analysis (Prosedur 5.1)`, isi: `Rata-ratakan loss atas distribusi portofolio — komputasi sangat menuntut dan hasilnya bergantung pada asumsi distribusi portofolio.` },
        { judul: `Worst-case analysis (Prosedur 5.2)`, isi: `Cari arah $w$ yang memaksimalkan loss — objektifnya tidak konveks, tidak tractable saat aset banyak.` },
        { judul: `Leading-alpha MVO (Prosedur 5.3)`, isi: `Bangun portofolio dari realized leading returns — menguji prediktivitas untuk portofolio yang "relevan" (prakiraan volatilitas hanya penting bila ada alpha dulu: "If we don't [have alpha], then we have other problems"). Plus QDIST $= \\sum_t (r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t + \\log|\\hat{\\Omega}_{r,t}| + n\\log(2\\pi))$ sebagai likelihood multivariat.` },
        { judul: `Jangan generate-A/tes-B`, isi: `Jangan uji portofolio generate-A di model-B — asimetri ini menodai seluruh pengujian (aturan keras 5.1.2).`, nada: "jebakan" },
        { judul: `Average-case bisa dibalik`, isi: `Average-case bergantung asumsi distribusi portofolio — hasilnya bisa dibalik dengan mengubah asumsi.`, nada: "jebakan" },
        { judul: `Worst-case tak konveks`, isi: `Worst-case tidak konveks — tidak ada jaminan solusi global saat $n$ besar.`, nada: "jebakan" },
        { judul: `QDIST mahal`, isi: `QDIST butuh determinan & invers tiap $t$ — mahal; ada catatan komputasi di appendix (5.4).`, nada: "jebakan" },
      ],
    },
    {
      judul: `Portofolio minimum-variance — uji presisi lewat dapur optimasi`,
      ringkas: `Presisi yang buruk ketahuan dari portofolio "minimum-variance" yang ternyata tidak minimum — kecuali matriksnya proporsional dengan yang sejati.`,
      definisi: `Masalah (5.3): $\\min_w w^T\\hat{\\Omega}_r w$ s.t. $\\mu^Tw = 1$, dengan $\\hat{\\Omega}_r$ matriks kovarians kandidat dan $\\mu \\in \\mathbb{R}^n$ vektor kendala. Solusi: $w(\\hat{\\Omega}_r) = (\\mu^T\\hat{\\Omega}_r^{-1}\\mu)^{-1}\\hat{\\Omega}_r^{-1}\\mu$. Teorema 5.1 (Engle & Colacito, 2006): volatilitas terealisasi portofolio $w(\\hat{\\Omega}_r)$ lebih besar daripada volatilitas $w(\\Omega_r)$ (yang dibangun dari kovarians sejati), dan keduanya identik iff $\\Omega_r \\propto \\hat{\\Omega}_r$.`,
      kenapa: `Ini menguji matriks presisi secara tidak langsung tapi relevan: presisi yang buruk → portofolio "minimum-variance" yang varians terealisasinya tidak minimum. Perhatikan "iff proporsional" — skala absolut tidak penting di sini (skala diurus uji volatilitas); yang penting bentuk matriksnya.`,
      contoh: `Ilustrasi ($2 \\times 2$): $\\hat{\\Omega}_r = [[0{,}04, 0{,}01],[0{,}01, 0{,}09]]$, $\\mu = [1, 1]^T$ (kendala jumlah bobot = 1). $\\hat{\\Omega}_r^{-1}\\mu \\propto [2{,}29, 0{,}86]^T$ → $w \\approx [0{,}727, 0{,}273]^T$ (aset bervarians kecil dibobot lebih besar — intuisi minimum-variance). Teorema: bila $\\hat{\\Omega}_r$ salah bentuk, $w(\\hat{\\Omega}_r)$ terealisasi lebih bergejolak daripada $w(\\Omega_r)$.`,
      jebakan: `Empat jebakan dalam membaca uji ini — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `Vektor kendala = $\\mu$, bukan $b$`, isi: `Koreksi notasi: ringkasan Gemini menulis $b$ — teks bab memakai $\\mu$.`, nada: "jebakan" },
        { judul: `"iff proporsional" = buta skala`, isi: `Model yang 2× terlalu besar di semua arah tetap lolos uji ini; itu fitur (skala = urusan uji volatilitas), bukan bug.`, nada: "jebakan" },
        { judul: `Uji ini portfolio-dependent`, isi: `Uji ini bergantung pada $\\mu$ — pasangannya yang independen adalah Mahalanobis (Deep Dive 2.4).`, nada: "jebakan" },
        { judul: `Realisasi vs ex-ante`, isi: `Realisasi dihitung dengan $\\Omega_r$ sejati: $\\text{var}(w(\\hat{\\Omega}_r), \\Omega_r)$ — jangan campur dengan varians ex-ante $w^T\\hat{\\Omega}_r w$.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Mahalanobis & MALV — satu-satunya uji yang independen dari portofolio`,
      ringkas: `Jarak Mahalanobis yang dirata-ratakan per aset lalu divarianskan lintas waktu — presisi yang bagus membuat deretnya datar.`,
      definisi: `Untuk vektor acak zero-mean $r$ dan kovarians $\\Omega_r$: $d(r, \\Omega_r) := r^T\\Omega_r^{-1}r$ (tanpa akar kuadrat — definisi buku!). Di bawah return Gaussian dan kovarians sejati, $d^2$ berdistribusi chi-squared dengan $n$ derajat bebas. Uji: $\\nu_t := \\frac{1}{n_t}r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t$ (jarak Mahalanobis kuadrat yang dinormalisasi jumlah aset $n_t$), $\\text{MALV} := \\text{var}(\\nu_1, \\dots, \\nu_T)$. Semakin rendah MALV, semakin baik presisi. Bila variansnya sangat rendah (orde $2/n$), invers kovarians — kecuali konstanta multiplikatif — memprediksi sempurna.`,
      kenapa: `Inilah uji presisi yang portfolio-independent: tidak bergantung pada pilihan $\\mu$ atau strategi apa pun. Komplementer dengan Deep Dive 2.3: minimum-variance menguji presisi "di dapur optimasi", MALV mengujinya "di laboratorium".`,
      contoh: `Ilustrasi: $n = 100$ aset, $\\nu_t$ idealnya ≈ 1 tiap periode (karena $E[r^T\\Omega^{-1}r] = n$ bila model benar). Bila $\\text{var}(\\nu_t) \\approx 2/n = 0{,}02$, presisi "sempurna kecuali konstanta multiplikatif" — konstanta skala diserahkan ke uji volatilitas.`,
      jebakan: `Empat jebakan dalam membaca uji ini — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `Definisi buku tanpa akar`, isi: `Jebakan Gemini yang tertangkap: ringkasan menulis $d = \\sqrt{r^T\\Omega_r^{-1}r}$ — teks bab: $d := r^T\\Omega_r^{-1}r$.`, nada: "jebakan" },
        { judul: `Quirk chi-squared di teks`, isi: `Buku menulis "$d^2$ berdistribusi chi-squared $n$ df" — quirk teks (secara standar $d$ sendiri yang $\\chi^2_n$ di bawah Gaussian); yang esensial: normalisasi $1/n_t$ membuat $\\nu_t$ berorde 1.`, nada: "jebakan" },
        { judul: `MALV ~ $2/n \\neq$ MALV = 0`, isi: `MALV ~ $2/n$ = sempurna kecuali konstanta multiplikatif — jangan menuntut MALV = 0.`, nada: "jebakan" },
        { judul: `Butuh invers tiap $t$`, isi: `Uji ini butuh invers tiap $t$ — mahal untuk $n$ besar, sama seperti QDIST.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Ancillary: turnover & akurasi beta — layak produksi?`,
      ringkas: `Model yang akurat tapi tidak stabil akan bangkrut oleh biaya transaksi — turnover dan akurasi beta mengujinya sebelum produksi.`,
      definisi: `(1) Model turnover: bukan sifat intrinsik model, melainkan sifat strategi trading produksi. Untuk target eksposur faktor $b_i$ (konstan, abaikan biaya transaksi), optimal untuk trading FMP — bobotnya kolom-kolom $P_t := \\Omega_{\\epsilon,t}^{-1}B_t(B_t^T\\Omega_{\\epsilon,t}^{-1}B_t)^{-1}$, $w_t := P_t b$. $\\text{turnover}^2 := \\frac{1}{T}\\sum_{t=1}^T \\|P_t - P_{t-1}\\|_F$ (norma Frobenius); bila target eksposur $b$ dan fungsi biaya $TC: \\mathbb{R}^n \\to \\mathbb{R}_+$ diketahui: $\\text{turnover}_{TC} := \\frac{1}{T}\\sum_t TC[(P_t - P_{t-1})b]$. (2) Beta accuracy: $\\beta_t(w) = \\Omega_{r,t}w/(w^T\\Omega_{r,t}w)$ (beta prediksi model), $\\hat{\\beta}_t(w) = \\hat{\\Omega}_{r,t}w/(w^T\\hat{\\Omega}_{r,t}w)$ (beta terealisasi dari kovarians empiris berbobot eksponensial), $\\text{BETAERR}(w) = \\sum_t \\|\\beta_t - \\hat{\\beta}_t\\|^2$.`,
      kenapa: `Model dengan kovarians "akurat" tapi bobot FMP-nya jungkir-balik tiap hari akan dimakan biaya transaksi — turnover mengukur stabilitas. Beta accuracy menguji apakah beta yang dijanjikan model terhadap portofolio acuan/tematik benar-benar terwujud.`,
      contoh: `Tiga driver perubahan bobot: (i) alpha turnover — prakiraan excess return harian (dimodelkan di Bab 11); (ii) fungsi market impact (paling stabil, variasinya diabaikan); (iii) model faktor — subjek subbab ini.`,
      jebakan: `Empat jebakan dalam membaca ukuran ancillary — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `Arah topi beta`, isi: `$\\beta_t$ = prediksi model (tanpa topi), $\\hat{\\beta}_t$ = realisasi empiris (bertopi) — jangan tertukar arahnya; BETAERR menghukum selisih keduanya.`, nada: "jebakan" },
        { judul: `$P_t$ memakai presisi idiosinkratis`, isi: `$P_t$ memakai $\\Omega_{\\epsilon,t}^{-1}$ — presisi idiosinkratis, bukan kovarians total; ini juga rumus FMP Bab 9.`, nada: "jebakan" },
        { judul: `Turnover kuadratik vs $TC$`, isi: `Turnover kuadratik sederhana vs versi $TC$ — yang kedua lebih akurat tapi kehilangan generalitas (butuh $b$ dan $TC$ strategi spesifik).`, nada: "jebakan" },
        { judul: `Bandingkan secara adil`, isi: `"Turnover bukan sifat intrinsik model" — membandingkan turnover dua model hanya adil untuk strategi/target eksposur yang sama.`, nada: "jebakan" },
      ],
    },
    {
      judul: `$R^2$ — metrik populer yang ditolak bab ini`,
      ringkas: `$R^2$ yang cantik bisa menutupi kovarians yang salah total — jangan pernah pakai ia untuk memilih model risiko.`,
      definisi: `$R^2$ = 1 minus rasio weighted residual sum of squares terhadap total sum of squares dari regresi cross-sectional terbobot: $$R^2 = 1 - \\frac{\\sum_{t=1}^T \\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}(r_t - B_t\\hat{f}_t)\\|^2}{\\sum_{t=1}^T \\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}r_t\\|^2}$$ ($\\hat{\\Omega}_{\\epsilon,t}$ = proxy kovarians idiosinkratis, Bab 6; $\\hat{f}_t$ = return faktor hasil regresi.)`,
      kenapa: `Bukti kehancurannya konstruktif: ambil model sejati, lalu buat model kedua = model yang dirotasi dengan rotasi acak berbeda tiap periode ($C_t$). Koefisien determinasi keduanya identik — $R^2$ tak berubah di bawah rotasi — sehingga AIC/BIC pun identik. Namun matriks kovarians faktor model kedua salah total (off-diagonal → 0 karena independensi antar periode). Jadi: $R^2$ tinggi $\\not\\Rightarrow$ kovarians benar. Dua cacat fatal: (1) rentan data mining (karakteristik bisa diutak-atik sampai $R^2$ cantik); (2) buta rotational invariance.`,
      contoh: `Model rotasi-acak: $R^2(\\tilde{B}_t) = R^2(B)$ — "the coefficient of determination is unchanged" — tetapi $[\\tilde{\\Omega}_f]_{i,j} \\to 0$ untuk $i \\ne j$: kovariansnya hancur sementara $R^2$-nya sempurna.`,
      jebakan: `Empat jebakan seputar $R^2$ — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `Rumus benar: residual di pembilang`, isi: `Jebakan Gemini yang tertangkap: ringkasan menulis $R^2 = 1 - \\frac{\\sum\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}r_t\\|^2}{\\sum\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}(r_t - B_t\\hat{f}_t)\\|^2}$ — pembilang & penyebut terbalik; yang benar: pembilang = residual $(r_t - B_t\\hat{f}_t)$, penyebut = total $r_t$ (persis teks §5.3.3).`, nada: "jebakan" },
        { judul: `$R^2$ tetap berguna sebagai ringkasan`, isi: `$R^2$ tetap berguna sebagai ringkasan goodness-of-fit regresi — yang ditolak adalah pemakaiannya untuk seleksi model risiko.`, nada: "jebakan" },
        { judul: `Heuristik pengganti`, isi: `Heuristik yang dipakai ahli sebagai ganti: persentase periode di mana return faktor memenuhi kriteria signifikansi ($|t| > 2$), dan realized Sharpe Ratio tiap return faktor.`, nada: "jebakan" },
        { judul: `Rekomendasi bab`, isi: `Untuk performa model risiko pakai uji-uji bab ini; untuk performa risk-adjusted pakai Bab 8.`, nada: "jebakan" },
      ],
    },
  ],
  cheatsheet: `Cheatsheet Bab

> Satu halaman ringkas — cetak dan tempel. Semua definisi & hubungan dari Bab 5.

### Prinsip
- Metrik ≈ aplikasi (akurasi prakiraan vol; vol terealisasi portofolio teroptimasi, setting realistis) · Tidak ada model terbaik tunggal — prioritaskan use-case

### QLIKE & MSE (univariat)
- $\\text{QLIKE} = \\frac{1}{T}\\sum(\\frac{r_t^2}{\\hat{\\sigma}_t^2} - \\log\\frac{r_t^2}{\\hat{\\sigma}_t^2} - 1)$ — skewed, hukum over-estimasi lebih keras
- $\\text{MSE} = \\frac{1}{T}\\sum(\\frac{r_t^2}{\\hat{\\sigma}_t^2} - 1)^2$ — simetris dalam rasio
- Rank robustness (Hansen–Lunde; Patton & Sheppard 2009; Patton 2011) · menggantikan statistik Bias

### Multivariat
- Production strategies (uji simulasinya; jangan generate-A/tes-B) · Average-case (5.1; mahal; tergantung asumsi) · Worst-case (5.2; tak konveks) · Leading-alpha MVO (5.3; "volatility prediction matters only if we have alpha")
- $\\text{QDIST} = \\sum_t (r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t + \\log|\\hat{\\Omega}_{r,t}| + n\\log(2\\pi))$

### Presisi
- $\\min_w w^T\\hat{\\Omega}_r w$ s.t. $\\mu^Tw = 1$ → $w(\\hat{\\Omega}_r) = (\\mu^T\\hat{\\Omega}_r^{-1}\\mu)^{-1}\\hat{\\Omega}_r^{-1}\\mu$ (kendala = $\\mu$, bukan $b$)
- Engle & Colacito: $\\text{vol}(w(\\hat{\\Omega}_r)) \\ge \\text{vol}(w(\\Omega_r))$; sama iff $\\Omega_r \\propto \\hat{\\Omega}_r$
- Mahalanobis: $d(r,\\Omega_r) = r^T\\Omega_r^{-1}r$ (**tanpa akar**) · $\\nu_t = \\frac{1}{n_t}r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t$ · $\\text{MALV} = \\text{var}(\\nu_t)$; MALV ~ $2/n$ = sempurna kecuali konstanta

### Ancillary
- FMP: $P_t = \\Omega_{\\epsilon,t}^{-1}B_t(B_t^T\\Omega_{\\epsilon,t}^{-1}B_t)^{-1}$, $w_t = P_t b$ · $\\text{turnover}^2 = \\frac{1}{T}\\sum\\|P_t - P_{t-1}\\|_F$ · $\\text{turnover}_{TC} = \\frac{1}{T}\\sum TC[(P_t - P_{t-1})b]$
- $\\beta_t(w) = \\Omega_{r,t}w/(w^T\\Omega_{r,t}w)$ [model] · $\\hat{\\beta}_t(w) = \\hat{\\Omega}_{r,t}w/(w^T\\hat{\\Omega}_{r,t}w)$ [empiris EWMA] · $\\text{BETAERR} = \\sum_t\\|\\beta_t - \\hat{\\beta}_t\\|^2$

### $R^2$ (ditolak untuk seleksi model risiko)
- $R^2 = 1 - \\frac{\\sum\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}(r_t - B_t\\hat{f}_t)\\|^2}{\\sum\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}r_t\\|^2}$ (residual di pembilang!)
- Buta rotational invariance (rotasi acak: $R^2$ sama, kovarians hancur) · rentan data mining · ganti: % periode $|t|>2$, realized Sharpe return faktor
---`,
  prediksi: [
    {
      id: "P1",
      pertanyaan: `Volatilitas sejati tidak pernah bisa diamati — kita hanya punya proxy seperti realized volatility. Menurutmu, bagaimana kita bisa yakin bahwa "model A lebih baik dari model B" bukan sekadar artefak dari proxy yang kita pilih?`,
      kunci: `Dengan robust loss functions (QLIKE/MSE) yang punya rank robustness (Hansen–Lunde): ranking dua model menurut proxy takbias sama dengan ranking menurut volatilitas sejati yang tak teramati. Tanpa sifat ini, kemenangan bisa jadi artefak proxy.`,
    },
    {
      id: "P2",
      pertanyaan: `Dua model kovarians diuji lewat portofolio minimum-variance. Model X menghasilkan varians terealisasi lebih rendah dari model Y. Apakah itu berarti matriks kovarians X "lebih benar" dalam semua arti? Jelaskan batasannya.`,
      kunci: `Tidak dalam semua arti. Teorema Engle & Colacito: varians terealisasi $w(\\hat{\\Omega}_r)$ ≥ varians $w(\\Omega_r)$, sama iff $\\Omega_r \\propto \\hat{\\Omega}_r$ — uji ini buta terhadap skala absolut (model yang 2× terlalu besar di semua arah tetap lolos) dan bergantung pada pilihan kendala $\\mu$ (portfolio-dependent). Untuk skala pakai uji volatilitas; untuk uji independen-portofolio pakai MALV.`,
    },
    {
      id: "P3",
      pertanyaan: `Sebuah model faktor membanggakan $R^2$ cross-sectional 95%. Menurut logika bab ini, mengapa angka itu TIDAK cukup untuk menyimpulkan model risikonya bagus? Beri satu skenario konkret yang membuat $R^2$ tinggi tetapi kovarians salah.`,
      kunci: `Karena $R^2$ buta terhadap rotational invariance: model yang dirotasi acak berbeda tiap periode punya $R^2$ identik dengan model sejati (bukti konstruktif di §5.3.3), tetapi matriks kovarians faktornya salah total (off-diagonal → 0). $R^2$ juga rentan data mining. Heuristik ahli: % periode dengan $|t| > 2$ dan realized Sharpe tiap return faktor.`,
    },
  ],
  kuis: [
    {
      pertanyaan: `Rank robustness (Hansen & Lunde) artinya …`,
      opsi: [
        `A. loss function tidak pernah bernilai negatif`,
        `B. ranking dua prakiraan volatilitas menurut proxy takbias sama dengan ranking menurut volatilitas sejati`,
        `C. model dengan $R^2$ tertinggi selalu menang`,
        `D. QLIKE selalu lebih baik dari MSE`,
      ],
      benar: 1,
      penjelasan: `definisi rank robustness; A salah (non-negatif ≠ definisi); C salah (bab ini justru menolak $R^2$ untuk seleksi model).`,
    },
    {
      pertanyaan: `QLIKE disebut skewed karena …`,
      opsi: [
        `A. ia simetris seperti MSE`,
        `B. ruginya lebih besar saat varians terealisasi lebih kecil dari varians estimasi (menghukum over-estimasi lebih keras)`,
        `C. ia hanya bisa dipakai untuk return multivariat`,
        `D. ia tidak pernah mencapai nol`,
      ],
      benar: 1,
      penjelasan: `Gambar 5.1: "higher losses when the realized variance is smaller than the estimated variance".`,
    },
    {
      pertanyaan: `Dalam pengujian multivariat, aturan keras yang TIDAK boleh dilanggar adalah …`,
      opsi: [
        `A. selalu memakai $R^2$ sebagai metrik utama`,
        `B. portofolio yang digenerate dengan model A lalu dites pada model B — asimetri ini menodai pengujian`,
        `C. memakai average-case analysis untuk semua kasus`,
        `D. mengabaikan Sharpe Ratio dan PnL`,
      ],
      benar: 1,
      penjelasan: `aturan keras §5.1.2: kovarians harus menjadi input seluruh proses produksi; generate-A/tes-B = cacat asimetri.`,
    },
    {
      pertanyaan: `Solusi masalah $\\min_w w^T\\hat{\\Omega}_r w$ s.t. $\\mu^Tw = 1$ adalah …`,
      opsi: [
        `A. $w = (\\mu^T\\hat{\\Omega}_r^{-1}\\mu)^{-1}\\hat{\\Omega}_r^{-1}\\mu$`,
        `B. $w = \\hat{\\Omega}_r\\mu / \\|\\hat{\\Omega}_r\\mu\\|$`,
        `C. $w = \\mu / \\|\\mu\\|$`,
        `D. $w = (b^T\\hat{\\Omega}_r^{-1}b)^{-1}\\hat{\\Omega}_r^{-1}b$ dengan $b$ vektor eksposur`,
      ],
      benar: 0,
      penjelasan: `solusi (5.3) persis; D memakai $b$ (notasi Gemini yang keliru — buku memakai $\\mu$).`,
    },
    {
      pertanyaan: `Teorema Engle & Colacito (2006) menyatakan …`,
      opsi: [
        `A. volatilitas terealisasi $w(\\hat{\\Omega}_r)$ ≥ volatilitas $w(\\Omega_r)$, sama iff $\\Omega_r \\propto \\hat{\\Omega}_r$`,
        `B. $\\hat{\\Omega}_r$ harus sama persis dengan $\\Omega_r$ agar berguna`,
        `C. portofolio minimum-variance selalu mengalahkan pasar`,
        `D. presisi tidak penting untuk optimasi`,
      ],
      benar: 0,
      penjelasan: `Teorema 5.1 persis, termasuk "iff proporsional" (buta skala absolut — fitur, bukan bug).`,
    },
    {
      pertanyaan: `Definisi jarak Mahalanobis menurut buku ini adalah …`,
      opsi: [
        `A. $d(r,\\Omega_r) = \\sqrt{r^T\\Omega_r^{-1}r}$`,
        `B. $d(r,\\Omega_r) = r^T\\Omega_r^{-1}r$ (tanpa akar kuadrat)`,
        `C. $d(r,\\Omega_r) = \\|r\\|^2 / \\text{tr}(\\Omega_r)$`,
        `D. $d(r,\\Omega_r) = \\det(\\Omega_r)$`,
      ],
      benar: 1,
      penjelasan: `definisi buku tanpa akar (jebakan Gemini yang tertangkap: ringkasan menulis versi berakar, opsi A).`,
    },
    {
      pertanyaan: `MALV yang rendah menunjukkan …`,
      opsi: [
        `A. turnover model yang tinggi`,
        `B. matriks presisi yang baik; nilai ~$2/n$ berarti prediksi sempurna kecuali konstanta multiplikatif`,
        `C. $R^2$ yang tinggi`,
        `D. beta yang tidak akurat`,
      ],
      benar: 1,
      penjelasan: `interpretasi MALV; ambang $2/n$ dari teks bab.`,
    },
    {
      pertanyaan: `Rumus $R^2$ yang BENAR menurut teks bab (§5.3.3) adalah …`,
      opsi: [
        `A. $R^2 = 1 - \\frac{\\sum_t\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}r_t\\|^2}{\\sum_t\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}(r_t - B_t\\hat{f}_t)\\|^2}$`,
        `B. $R^2 = 1 - \\frac{\\sum_t\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}(r_t - B_t\\hat{f}_t)\\|^2}{\\sum_t\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}r_t\\|^2}$`,
        `C. $R^2 = \\frac{\\sum_t\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}(r_t - B_t\\hat{f}_t)\\|^2}{\\sum_t\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}r_t\\|^2}$`,
        `D. $R^2$ tidak didefinisikan di bab ini`,
      ],
      benar: 1,
      penjelasan: `versi teks §5.3.3: residual $(r_t - B_t\\hat{f}_t)$ di pembilang, total $r_t$ di penyebut. Jebakan Gemini yang tertangkap: ringkasan menukar pembilang–penyebut (opsi A).`,
    },
  ],
  fsrs: [
    { depan: `Dua prinsip evaluasi model faktor (Bab 5).`, belakang: `(1) Metrik sedekat mungkin dengan aplikasi — akurasi prakiraan volatilitas & volatilitas terealisasi portofolio teroptimasi, setting realistis. (2) Tidak ada ukuran tunggal → tidak ada model terbaik tunggal; prioritaskan use-case.` },
    { depan: `Tulis rumus QLIKE dan MSE + sifat yang membedakan keduanya.`, belakang: `QLIKE $= \\frac{1}{T}\\sum(r_t^2/\\hat{\\sigma}_t^2 - \\log(r_t^2/\\hat{\\sigma}_t^2) - 1)$ (skewed, hukum over-estimasi lebih keras); MSE $= \\frac{1}{T}\\sum(r_t^2/\\hat{\\sigma}_t^2 - 1)^2$ (simetris dalam rasio).` },
    { depan: `Apa itu rank robustness dan kenapa penting?`, belakang: `Ranking dua model menurut proxy takbias = ranking menurut volatilitas sejati (Hansen–Lunde); tanpa ini kemenangan bisa jadi artefak proxy.` },
    { depan: `Solusi portofolio minimum-variance + Teorema Engle & Colacito.`, belakang: `$w(\\hat{\\Omega}_r) = (\\mu^T\\hat{\\Omega}_r^{-1}\\mu)^{-1}\\hat{\\Omega}_r^{-1}\\mu$; vol terealisasi $w(\\hat{\\Omega}_r) \\ge$ vol $w(\\Omega_r)$, sama iff $\\Omega_r \\propto \\hat{\\Omega}_r$.` },
    { depan: `Definisi Mahalanobis (buku), $\\nu_t$, dan MALV.`, belakang: `$d(r,\\Omega_r) = r^T\\Omega_r^{-1}r$ (tanpa akar!); $\\nu_t = \\frac{1}{n_t}r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t$; MALV $= \\text{var}(\\nu_1,\\dots,\\nu_T)$ — rendah = presisi bagus; ~$2/n$ = sempurna kecuali konstanta.` },
    { depan: `Rumus bobot FMP dan dua ukuran turnover.`, belakang: `$P_t = \\Omega_{\\epsilon,t}^{-1}B_t(B_t^T\\Omega_{\\epsilon,t}^{-1}B_t)^{-1}$; turnover$^2 = \\frac{1}{T}\\sum\\|P_t - P_{t-1}\\|_F$; turnover$_{TC} = \\frac{1}{T}\\sum TC[(P_t - P_{t-1})b]$.` },
    { depan: `Rumus BETAERR + bedakan $\\beta_t$ vs $\\hat{\\beta}_t$.`, belakang: `BETAERR$(w) = \\sum_t\\|\\beta_t - \\hat{\\beta}_t\\|^2$; $\\beta_t$ = beta prediksi model (tanpa topi), $\\hat{\\beta}_t$ = beta terealisasi empiris EWMA (bertopi).` },
    { depan: `Rumus $R^2$ yang benar (§5.3.3) + dua cacat fatalnya.`, belakang: `$R^2 = 1 - \\frac{\\sum\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}(r_t - B_t\\hat{f}_t)\\|^2}{\\sum\\|\\hat{\\Omega}_{\\epsilon,t}^{-1/2}r_t\\|^2}$ (residual di pembilang!); cacat: rentan data mining + buta rotational invariance.` },
    { depan: `Bukti konstruktif mengapa $R^2$ gagal seleksi model risiko.`, belakang: `Model rotasi-acak per periode punya $R^2$ identik dengan model sejati tetapi kovarians faktornya salah total (off-diagonal → 0); AIC/BIC pun identik.` },
    { depan: `Dua heuristik ahli pengganti $R^2$.`, belakang: `(1) % periode return faktor signifikan ($|t| > 2$); (2) realized Sharpe Ratio tiap return faktor.` },
  ],
  feynman: [
    {
      poin: `Rank robustness + QLIKE vs MSE`,
      penajaman: `kalau ditanya "kenapa ranking menurut proxy bisa dipercaya dan apa beda QLIKE vs MSE?", harus bisa jawab: Hansen–Lunde menjamin ranking konsisten; QLIKE skewed menghukum over-estimasi lebih keras, MSE simetris.`,
    },
    {
      poin: `Empat jalan multivariat + aturan generate-A/tes-B`,
      penajaman: `kalau ditanya "kenapa portofolio generate model A tidak boleh dites di model B?", harus bisa jawab: asimetri menodai pengujian — kovarians harus jadi input seluruh proses produksi.`,
    },
    {
      poin: `Minimum-variance + Engle & Colacito`,
      penajaman: `kalau ditanya "model 2× terlalu besar di semua arah lolos uji ini?", harus bisa jawab: ya — uji ini buta skala (iff proporsional); skala diurus uji volatilitas.`,
    },
    {
      poin: `Mahalanobis tanpa akar + MALV`,
      penajaman: `kalau ditanya "apa definisi $d$ di buku dan kapan presisi disebut sempurna?", harus bisa jawab: $d = r^T\\Omega_r^{-1}r$ tanpa akar; MALV ~ $2/n$ = sempurna kecuali konstanta multiplikatif.`,
    },
    {
      poin: `Turnover: FMP + dua ukuran`,
      penajaman: `kalau ditanya "kenapa turnover bukan sifat intrinsik model?", harus bisa jawab: ia sifat strategi produksi — bandingkan hanya untuk target eksposur yang sama.`,
    },
    {
      poin: `BETAERR: arah topi`,
      penajaman: `kalau ditanya "mana yang prediksi model, $\\beta_t$ atau $\\hat{\\beta}_t$?", harus bisa jawab: $\\beta_t$ tanpa topi = prediksi model; $\\hat{\\beta}_t$ bertopi = realisasi empiris.`,
    },
    {
      poin: `$R^2$: rumus benar + bukti rotasi-acak`,
      penajaman: `kalau ditanya "tulis rumus $R^2$ yang benar dan jelaskan kenapa ia gagal", harus bisa jawab: residual di pembilang; rotasi acak per periode → $R^2$ identik tapi kovarians hancur.`,
    },
    {
      poin: `Heuristik pengganti $R^2$`,
      penajaman: `kalau ditanya "ahli memakai apa sebagai ganti $R^2$?", harus bisa jawab: % periode $|t|>2$ dan realized Sharpe tiap return faktor; seleksi risiko → uji bab ini, risk-adjusted → Bab 8.`,
    },
  ],
  rumus: [
    {
      id: `bab5-qlike-mse`,
      judul: `QLIKE & MSE — dua fungsi kerugian robust`,
      latex: `\\text{QLIKE}(\\hat{\\sigma}, r) := \\frac{1}{T}\\sum_{t=1}^T \\left(\\frac{r_t^2}{\\hat{\\sigma}_t^2} - \\log\\frac{r_t^2}{\\hat{\\sigma}_t^2} - 1\\right), \\qquad \\text{MSE}(\\hat{\\sigma}, r) := \\frac{1}{T}\\sum_{t=1}^T \\left(\\frac{r_t^2}{\\hat{\\sigma}_t^2} - 1\\right)^2`,
      variabel: [
        { simbol: `T`, arti: `jumlah periode sampel` },
        { simbol: `r_t`, arti: `return aset periode $t$ ($r_t^2$ = proxy varians teramati)` },
        { simbol: `\\hat{\\sigma}_t^2`, arti: `prakiraan varians periode $t$` },
      ],
      langkah: [
        `Ilustrasi (rasio $x := r_t^2/\\hat{\\sigma}_t^2$): bila $x = 1$ (prakiraan tepat) → QLIKE $= 1 - \\log 1 - 1 = 0$, MSE $= 0$`,
        `Bila $x = 0{,}5$ (over-estimasi 2×): QLIKE $= 0{,}5 - \\log 0{,}5 - 1 \\approx 0{,}193$; MSE $= (0{,}5-1)^2 = 0{,}25$`,
        `Bila $x = 2$ (under-estimasi 2×): QLIKE $= 2 - \\log 2 - 1 \\approx 0{,}307$; MSE $= 1$`,
      ],
      hasil: `**QLIKE menghukum $x < 1$ (over-estimasi) lebih berat daripada MSE** — itulah skewness di Gambar 5.1.`,
      jebakan: `QLIKE skewed BUKAN simetris — pilihan loss function adalah pilihan asimetri hukuman. Dan keduanya univariat: untuk matriks kovarians butuh ekstensi multivariat.`,
    },
    {
      id: `bab5-minvar`,
      judul: `Portofolio minimum-variance + Teorema Engle & Colacito`,
      latex: `\\min_w w^T\\hat{\\Omega}_r w \\quad \\text{s.t.} \\quad \\mu^Tw = 1 \\;\\;\\Longrightarrow\\;\\; w(\\hat{\\Omega}_r) = (\\mu^T\\hat{\\Omega}_r^{-1}\\mu)^{-1}\\,\\hat{\\Omega}_r^{-1}\\mu`,
      variabel: [
        { simbol: `w`, arti: `vektor bobot portofolio` },
        { simbol: `\\hat{\\Omega}_r`, arti: `matriks kovarians kandidat (estimasi)` },
        { simbol: `\\Omega_r`, arti: `matriks kovarians sejati` },
        { simbol: `\\mu`, arti: `vektor kendala linier (buku memakai $\\mu$, bukan $b$)` },
      ],
      langkah: [
        `Ilustrasi ($2 \\times 2$): $\\hat{\\Omega}_r = [[0{,}04, 0{,}01],[0{,}01, 0{,}09]]$, $\\mu = [1, 1]^T$`,
        `$\\hat{\\Omega}_r^{-1}\\mu \\propto [2{,}29, 0{,}86]^T$ → normalisasi dengan $\\mu^Tw = 1$`,
        `$w \\approx [0{,}727, 0{,}273]^T$ — aset bervarians kecil dibobot lebih besar`,
      ],
      hasil: `**Teorema 5.1 (Engle & Colacito, 2006):** $\\text{vol}_\\text{realisasi}(w(\\hat{\\Omega}_r)) \\ge \\text{vol}_\\text{realisasi}(w(\\Omega_r))$, dengan kesamaan iff $\\Omega_r \\propto \\hat{\\Omega}_r$.`,
      jebakan: `"iff proporsional" — model yang 2× terlalu besar di semua arah tetap lolos uji ini; itu fitur (skala = urusan uji volatilitas), bukan bug. Vektor kendala = $\\mu$, bukan $b$ (koreksi notasi Gemini).`,
    },
    {
      id: `bab5-malv`,
      judul: `Mahalanobis & MALV — uji presisi independen portofolio`,
      latex: `d(r, \\Omega_r) := r^T\\Omega_r^{-1}r, \\qquad \\nu_t := \\frac{1}{n_t}\\,r_t^T\\hat{\\Omega}_{r,t}^{-1}r_t, \\qquad \\text{MALV} := \\text{var}(\\nu_1, \\dots, \\nu_T)`,
      variabel: [
        { simbol: `d(r,\\Omega_r)`, arti: `jarak Mahalanobis (versi buku: tanpa akar)` },
        { simbol: `n_t`, arti: `jumlah aset (derajat bebas) periode $t$` },
        { simbol: `\\nu_t`, arti: `skor Mahalanobis ternormalisasi periode $t$` },
        { simbol: `\\text{MALV}`, arti: `varians sampel deret $\\nu_t$ — semakin kecil semakin baik` },
      ],
      langkah: [
        `Ilustrasi: $n = 100$ aset; bila model benar, $E[r^T\\Omega^{-1}r] = n$ sehingga $\\nu_t \\approx 1$ tiap periode`,
        `Hitung $\\text{var}(\\nu_1, \\dots, \\nu_T)$ lintas waktu`,
        `Bila $\\text{var}(\\nu_t) \\approx 2/n = 0{,}02$ → presisi "sempurna kecuali konstanta multiplikatif"`,
      ],
      hasil: `**MALV ~ $2/n$ = presisi sempurna kecuali konstanta multiplikatif** — konstanta skala diserahkan ke uji volatilitas.`,
      jebakan: `Definisi buku tanpa akar kuadrat (jebakan Gemini: ringkasan menulis versi berakar). Jangan menuntut MALV = 0.`,
    },
  ],
  // Tata letak: pitch 300×240; presisi→mahal dibuat vertikal (adjacency)
  // agar tidak menembus simpul. Pola addendum LAPORAN_POLES_G1.md.
  peta: {
    nodes: [
      { id: `prinsip`, label: `Dua prinsip`, x: 150, y: 80, konsepId: 0 },
      { id: `qlike`, label: `QLIKE & MSE`, x: 450, y: 80, konsepId: 2 },
      { id: `qdist`, label: `QDIST`, x: 750, y: 80, konsepId: 4 },
      { id: `presisi`, label: `Min-variance (Ω⁻¹)`, x: 1050, y: 80, konsepId: 5 },
      { id: `fmp`, label: `FMP`, x: 150, y: 320, konsepId: 7 },
      { id: `turnover`, label: `Turnover & beta`, x: 450, y: 320, konsepId: 8 },
      { id: `r2`, label: `R² ditolak`, x: 750, y: 320, konsepId: 10 },
      { id: `mahal`, label: `Mahalanobis/MALV`, x: 1050, y: 320, konsepId: 6 },
    ],
    edges: [
      { from: `prinsip`, to: `qlike`, label: `uji kovarians` },
      { from: `qlike`, to: `qdist`, label: `versi multivariat` },
      { from: `prinsip`, to: `presisi`, label: `uji Ω̂⁻¹` },
      { from: `presisi`, to: `mahal`, label: `vs independen` },
      { from: `prinsip`, to: `fmp`, label: `layak produksi` },
      { from: `fmp`, to: `turnover`, label: `→ stabilitas` },
      { from: `prinsip`, to: `r2`, label: `yang ditolak` },
    ],
  },
};
