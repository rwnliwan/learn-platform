import type { ChapterPack } from "./bedahbuku";

export const PACK2: ChapterPack = {
  slug: "bab-2",
  bab: 2,
  judul: `Univariate Returns`,
  catatan: `bab "workhorse" fondasi volatilitas — penulis menutup pengantarnya dengan *"These models will be your friends for life"* (GARCH & EWMA). Alurnya: definisi return → fakta empiris return saham → tiga jalur estimasi volatilitas (model generatif, data frekuensi tinggi, state-space).`,
  ideBesar: `return satu aset adalah bata penyusun portofolio — mustahil memahami perilaku portofolio tanpa memahami bata-batanya. Bab ini menjawab tiga hal berurutan: return itu apa (dan versi mana yang dipakai di buku ini), seperti apa sifat statistik return saham di data nyata, dan bagaimana mengestimasi volatilitasnya yang berubah-ubah terhadap waktu lewat tiga jalur: (A) memodelkan volatilitas sebagai *state* dinamis — GARCH; (B) mengukurnya langsung dari data frekuensi tinggi — *realized volatility*; (C) menyaringnya dari observasi yang berisik — EWMA, yang ternyata identik dengan GARCH tanpa offset dan mendapat justifikasi model lewat *state-space* & *Kalman filter*.`,
  diagram: `DEFINISI RETURN (2.1.1–2.1.3)
r_i(1) := (P_i(1) − P_i(0)) / P_i(0)     ← simple return
        + D_i(1) di pembilang             ← dividend-adjusted return
r(1:T) = Π(1+r(t)) − 1                    ← compounded return
r̃(t) := log(1+r(t))                       ← log return: ADITIF antar periode
Excess return: r_i − r_f  (r_f ≈ SOFR)    ← dipakai di SELURUH buku

HARGA DIAMATI TAK SEMPURNA (2.1.4 — Roll model)
m_{t+1} = m_t + σ_ε ε_{t+1}        (harga "sebenarnya": random walk)
p_{t+1} = m_{t+1} + σ_η η_{t+1}    (harga teramati = sebenarnya + derau)
→ E(Δp_{t+1} Δp_t) = −σ_η²         (bid-ask bounce → autokorelasi lag-1 NEGATIF)
→ harga harian lebih baik diestimasi dengan EWMA harga, bukan harga terakhir

STYLIZED FACTS (2.1.5 — log return saham harian)
① tanpa autokorelasi  ② heavy tails (tail index α ≃ 4)
③ volatility clustering / Taylor effect  ④ aggregational Gaussianity
   (leverage effect SENGAJA tidak didaftar — Catatan 7)

TIGA JALUR ESTIMASI VOLATILITAS
A. Model generatif (CHM) — GARCH(1,1)        B. Pengukuran langsung — Realized Volatility
   r_t = h_t ε_t                                σ̂² = Σ_{j=1}^{n} r²(j)
   h_t² = α_0 + α_1 r_{t−1}² + β_1 h_{t−1}²     E = σ² + α²/n  (bias ∝ 1/n)
   vol = state dinamis; residual ≈ Gaussian;    var = 2σ⁴/n → KONSISTEN
   unconditional tetap heavy-tailed             (butuh data frekuensi tinggi)

C. State-space — EWMA & Kalman
   EWMA: σ̂_t² = (1−K) r_t² + K σ̂_{t−1}²      ← ≡ GARCH bila α_0=0, α_1=1−K, β_1=K
   Muth: x̂_{t+1|t} = (1−K) x̂_{t|t−1} + K y_t ; K = σ̂²/(σ̂²+τ_η²) ; κ := τ_η/τ_ε`,
  konsep: [
    {
      nama: `Simple return & dividend-adjusted return`,
      definisi: `$r_i(1) := \\frac{P_i(1)-P_i(0)}{P_i(0)}$; versi dividen menambahkan $D_i(1)$ di pembilang.`,
      relasi: `return mentah inilah yang dipakai untuk PnL portofolio ($w^T r$); aset diasumsikan infinitely divisible dengan dolar sebagai numeraire.`,
    },
    {
      nama: `Compounded return`,
      definisi: `$r(1:T) = \\prod_{t=1}^{T}(1+r(t)) - 1$: nilai satu unit numeraire setelah $T$ periode.`,
      relasi: `versi net tidak aditif — di sinilah log return masuk.`,
    },
    {
      nama: `Log return`,
      definisi: `$\\tilde{r}(t) := \\log(1+r(t))$; log dari compounded return = jumlah log return per periode; bila independen, variansnya ikut terjumlah.`,
      relasi: `$\\tilde{r} \\simeq r$ hanya untuk return kecil — aproksimasinya **optimistis** (Latihan 2.1), memadai untuk harian/saham, buruk untuk tahunan atau return sangat volatil.`,
    },
    {
      nama: `Excess return`,
      definisi: `$r_i - r_f$; di AS $r_f = \\text{SOFR}$.`,
      relasi: `dipakai di seluruh buku — kas diperlakukan sebagai sekuritas khusus bervolatilitas negligible; kita meminjam/memminjamkan sebesar NMV portofolio sehingga aset bebas risiko tereliminasi dari model.`,
    },
    {
      nama: `Volatilitas & varians`,
      definisi: `volatilitas = standar deviasi return; varians = kuadratnya; bila $E[r^2] \\gg E[r]^2$, $\\sigma^2 \\simeq E[r^2]$.`,
      relasi: `jembatan ke estimasi — varians bisa diestimasi dari momen kedua.`,
    },
    {
      nama: `Bid-ask spread bounce (Roll model)`,
      definisi: `harga transaksi meloncat antara bid dan ask karena kerandoman sisi order; spread = kelipatan tick size (AS: 0,01 dolar untuk saham di atas 1 dolar).`,
      relasi: `satu-satunya sumber error pengukuran yang "terlihat" — model Roll memformalkan: harga teramati = harga sebenarnya + derau, dengan akibat teruji $E(\\Delta p_{t+1} \\Delta p_t) = -\\sigma_\\eta^2$.`,
    },
    {
      nama: `Stylized facts`,
      definisi: `empat pola empiris return saham yang universal dan relevan untuk manajemen risiko (rinci di 2.1).`,
      relasi: `vonis atas model difusi geometris sederhana ($\\frac{dP}{P} = \\mu dt + \\sigma dW$) yang memprediksi log return Gaussian-independen — data menolaknya.`,
    },
    {
      nama: `GARCH(1,1)`,
      definisi: `model *conditional heteroskedastic* terpopuler: volatilitas dijadikan state dinamis yang berevolusi dari return kuadrat kemarin dan varians kemarin.`,
      relasi: `menjelaskan heavy tails dengan residual yang (kondisional) Gaussian; kasus khusus dari *random recursive equations*.`,
    },
    {
      nama: `Realized volatility (RV)`,
      definisi: `estimator varians uncentered dari return frekuensi tinggi.`,
      relasi: `jalur "tanpa model generatif" — mengukur, bukan memodelkan; konsisten bila volatilitas berubah lambat.`,
    },
    {
      nama: `EWMA`,
      definisi: `rata-rata bergerak berbobot eksponensial; rekursif, murah, praktis.`,
      relasi: `identik dengan GARCH(1,1) saat $\\alpha_0 = 0$ — menjelaskan dominasinya di industri (RiskMetrics, Barra, Axioma) meski jurnal akademik dingin.`,
    },
    {
      nama: `State-space & Kalman filter (Muth 1960)`,
      definisi: `state tak teramati + observasi berisik; estimator optimalnya rekursif dan berbentuk EWMA.`,
      relasi: `justifikasi model untuk EWMA; ekstensi mean-reversion membuat K lebih kecil; Harvey–Shephard (⋆) memperbaiki positivitas via log-varians.`,
    },
  ],
  deepDive: [
    {
      judul: `Stylized facts — empat vonis atas model Gaussian`,
      ringkas: `Empat pola statistik yang satu per satu menolak model Gaussian sederhana.`,
      definisi: `Empat pola statistik return saham yang muncul di mana-mana (Cont 2001; Taylor 2007; Zivot 2009) — dirinci satu per satu di bawah.`,
      kenapa: `Model difusi geometris sederhana memprediksi log return yang Gaussian dan independen — keempat fakta ini menolaknya satu per satu. Untuk manajemen risiko, ini berarti: model Gaussian meremehkan peluang kejadian ekstrem dan buta terhadap pengelompokan gejolak. Fakta bahwa $\\alpha \\simeq 4$ juga penting secara teknis: momen keempat hingga, sehingga volatilitas *bisa* diestimasi via CLT (estimasi $E[r_t^2]$ butuh hingga $E[r_t^4]$).`,
      contoh: `Kurtosis sampel (Gaussian $= 3$): SPY $\\approx$ **11,4**, NRG $\\approx$ **14,3**, WAT $\\approx$ **29,8** — semuanya jauh di atas 3. Dengan $\\alpha \\simeq 4$, quantile power-tail tumbuh seperti $\\left(\\frac{1}{\\delta}\\right)^{1/\\alpha}$, sedangkan quantile Gaussian hanya seperti $\\log(1/\\delta)$: ekor gemuk membuat peristiwa "$6$-sigma" jauh lebih mungkin daripada yang dikira model normal.`,
      jebakan: `Empat jebakan dalam menafsirkan keempat fakta ini — dirinci di bawah.`,
      poin: [
        { judul: `Absence of autocorrelations`, isi: `Autokorelasi lag return harian kecil, kecuali di skala waktu di mana *microstructure* relevan (intraday).` },
        { judul: `Heavy tails`, isi: `Distribusi *unconditional* berekor gemuk: $P(r > x) = C \\cdot x^{-\\alpha}$ dengan **$\\alpha \\simeq 4$**.` },
        { judul: `Volatility clustering / Taylor effect`, isi: `$|r(t)|$ dan $r^2(t)$ ber-autokorelasi positif kuat, dengan autokorelasi $|r|$ yang **terbesar** — inilah yang disebut **Taylor effect**.` },
        { judul: `Aggregational Gaussianity`, isi: `Di horizon lebih panjang (mingguan/bulanan), distribusi log return mendekati Gaussian.` },
        { judul: `Nol autokorelasi ≠ independen`, isi: `Autokorelasi nol **bukan** berarti independen — nol korelasi linier tidak menutup dependensi non-linier (buktinya: |r| dan r² justru ber-autokorelasi kuat).`, nada: "jebakan" },
        { judul: `Taylor effect = ACF(|r|) terbesar`, isi: `Taylor effect = $\\mathrm{ACF}(|r|)$ **terbesar**, bukan sekadar "volatilitas mengelompok".`, nada: "jebakan" },
        { judul: `Leverage effect sengaja dikecualikan`, isi: `**Leverage effect sengaja TIDAK masuk daftar** (Catatan 7) — penulis menilai efeknya tak cukup kuat di data terbaru.`, nada: "jebakan" },
        { judul: `Heavy-tailed = distribusi unconditional`, isi: `Yang heavy-tailed adalah distribusi *unconditional*; distribusi *conditional*-nya bisa lebih ringan — dan justru di situlah GARCH bekerja.`, nada: "jebakan" },
      ],
    },
    {
      judul: `GARCH(1,1) — volatilitas dijadikan state yang hidup`,
      ringkas: `Volatilitas dijadikan state yang hidup — berevolusi dari shock kemarin dan ingatannya sendiri — sehingga ekor gemuk muncul dari residual yang Gaussian.`,
      definisi: `Tiga persamaan: $r_t = h_t \\cdot \\varepsilon_t$; **$h_t^2 = \\alpha_0 + \\alpha_1 r_{t-1}^2 + \\beta_1 h_{t-1}^2$**; $\\varepsilon_t \\sim N(0,1)$, dengan $\\alpha_0, \\alpha_1, \\beta_1 \\geq 0$. Insight fundamentalnya: *parameter* model dijadikan bagian dari *state* proses stokastik — volatilitas h_t berevolusi sendiri, bukan konstanta.`,
      kenapa: `Model ini menjelaskan dua fakta sekaligus dengan residual yang Gaussian: return kuadrat yang besar "menyetrum" volatilitas naik (suku $\\alpha_1 \\cdot r_{t-1}^2$), lalu suku $\\beta_1$ meredamnya kembali menuju level ekuilibrium $h^2$ — lahirlah *volatility clustering* dan ekor gemuk *unconditional* dari inovasi yang *conditional*-nya normal. Bentuk rekursifnya (2.11): $h_t^2 = h^2 + \\alpha_1 \\sum_{i \\geq 1} \\beta_1^{i-1} r_{t-i}^2$ — tak lain EWMA dari return kuadrat (lihat 2.4).`,
      contoh: `Dua sisi contoh: hitung cepat mekanisme shock, lalu seberapa jauh model ini menangkap fakta empiris — dirinci di bawah.`,
      jebakan: `Tiga kesalahpahaman klasik tentang GARCH — diluruskan satu per satu di bawah.`,
      poin: [
        { judul: `Hitung cepat: shock mendorong volatilitas`, isi: `Ambil $\\alpha_0 = 0{,}02$, $\\alpha_1 = 0{,}05$, $\\beta_1 = 0{,}90$. Kemarin $r^2 = 4$ dan $h^2 = 1$. Maka $h^2$ hari ini $= 0{,}02 + 0{,}05 \\times 4 + 0{,}90 \\times 1 =$ **$1{,}12$** — shock mendorong volatilitas naik. Varians jangka panjang $= \\frac{0{,}02}{1-0{,}05-0{,}90} =$ **$0{,}40$**, dan $h^2$ akan meluruh geometris (laju $\\beta_1$) kembali ke sana. Inilah "tidak bisa naik tanpa reda".` },
        { judul: `Seberapa jauh ia menangkap fakta?`, isi: `Residual $\\varepsilon_t$ lebih dekat ke Gaussian di semua kasus (jarak Kolmogorov–Smirnov menyusut; SPY $0{,}098 \\to 0{,}040$ dan XLK $0{,}091 \\to 0{,}043$ — perbaikan terbesar justru di dua indeks), dan *tail index* residual naik (SPY: kiri $4{,}1 \\to 5{,}9$, kanan $4{,}2 \\to 8{,}5$). Tapi ada batasnya: untuk kurtosis yang diamati, autokorelasi yang diprediksi model **terlalu tinggi** (Teräsvirta 2009a), dan GARCH yang diagregasi tetaplah GARCH — bukan Gaussian. Kesimpulan penulis: *"some but not all"*.` },
        { judul: `Arah penjelasan: residual Gaussian`, isi: `Arah penjelasannya: GARCH menjelaskan heavy tails **dengan** residual Gaussian — klaim "GARCH mengasumsikan return Gaussian" itu salah paham total.`, nada: "jebakan" },
        { judul: `Syarat stasioner α₁ + β₁ < 1`, isi: `$\\alpha_1 + \\beta_1 \\geq 1$ → varians *unconditional* tak hingga (tak stasioner); parameter non-negatif itu syarat, bukan hiasan.`, nada: "jebakan" },
        { judul: `Skewness unconditional tetap nol`, isi: `Skewness *unconditional* model ini tetap nol (simetris) — ia tidak menangkap skew negatif empiris (mis. WAT $-2{,}0$).`, nada: "jebakan" },
      ],
    },
    {
      judul: `Realized volatility — ukur, jangan (selalu) modelkan`,
      ringkas: `Alih-alih memodelkan volatilitas, ukur langsung dari data frekuensi tinggi: biasnya menyusut seiring n, tetapi data tiap detik pun tak menolong estimasi expected return.`,
      definisi: `$\\hat{\\sigma}^2 = \\sum_{j=1}^{n} r^2(j)$: estimator varians *uncentered* yang menjumlahkan kuadrat return interval frekuensi tinggi dalam satu periode (mis. return 5-menit untuk estimasi varians harian).`,
      kenapa: `*Insight 2.1* bab ini: estimator ini punya bias kecil ($E[\\hat{\\sigma}^2] = \\sigma^2 + \\alpha^2/n$) dan varians $2\\sigma^4/n$ — **konsisten**, error menyusut seiring $n$ bertambah. Artinya: bila butuh volatilitas skala harian tapi punya data menitan, tak perlu membangun model generatif seperti CHM — cukup ukur, asalkan volatilitas sejati berubah lambat.`,
      contoh: `Volatilitas harian $\\sigma = 2\\% \\to \\sigma^2 = 0{,}0004$. Dengan $n = 78$ return 5-menit: $\\mathrm{var}(\\hat{\\sigma}^2) \\approx 2\\sigma^4/n \\approx 4{,}1 \\times 10^{-9} \\to$ standar deviasi $\\approx 6{,}4 \\times 10^{-5}$, yaitu $\\sim 16\\%$ dari $\\sigma^2$. Naikkan n (data lebih granular) → error menyusut. Kontrasnya dengan drift: $\\hat{\\alpha} = p(1) - p(0)$ dengan $\\mathrm{var}(\\hat{\\alpha}) = \\sigma^2$ — **independen dari $n$**. Punya data tiap detik pun tak membuat estimasi *expected return* lebih baik ("otherwise all statistics undergraduates would be rich").`,
      jebakan: `Tiga batas praktis estimator realized volatility — dirinci di bawah.`,
      poin: [
        { judul: `n besar bukan gratis`, isi: `n besar bukan gratis: *microstructure noise* (bid-ask), *thin trading* (saham yang jarang transaksi tak cocok di interval 1-menit), volatilitas intraday tak konstan, beda open-to-close vs close-to-open, dan menit-menit awal hari yang liar.`, nada: "jebakan" },
        { judul: `RV 5-menit bukan raja universal`, isi: `RV 5-menit "vanilla" memang kompetitif lintas aset (Liu et al. 2015), tapi bukan raja universal — ada kondisi di mana *subsampled* 1-menit, *realized kernel*, atau *truncated RV* menang.`, nada: "jebakan" },
        { judul: `Rasio α/σ = Sharpe Ratio`, isi: `Di seluruh penurunan dipakai $|\\alpha| \\ll \\sigma$; rasio $\\alpha/\\sigma$ disebut *Sharpe Ratio* (dari log returns) — ia muncul lagi di bab-bab berikutnya.`, nada: "jebakan" },
      ],
    },
    {
      judul: `EWMA ≡ GARCH — "cara kasar" yang ternyata kasus khusus`,
      ringkas: `Rata-rata bergerak eksponensial yang diremehkan jurnal akademik ternyata kasus khusus GARCH — dan itulah rahasia dominasinya di industri.`,
      definisi: `$\\hat{\\sigma}_t^2 = (1-K) r_t^2 + K \\hat{\\sigma}_{t-1}^2$: rata-rata bergerak dengan bobot yang meluruh eksponensial ke masa lalu. Rekursif (hemat memori & komputasi); $K$ kecil = lupa lebih cepat. *Half-life*: $K^\\tau = 1/2$, yaitu **$\\tau = -\\log 2 / \\log K$**.`,
      kenapa: `*Insight 2.2*: GARCH(1,1) tanpa offset — tepatnya saat **$\\alpha_0 = 0$, $\\alpha_1 = 1-K$, $\\beta_1 = K$** — **identik** dengan EWMA. Jadi EWMA bukan "pendekatan kasar untuk orang malas", melainkan kasus khusus dari model yang sama. Ini menjelaskan paradoks sosiologis bab ini: jurnal akademik dingin terhadap EWMA, tapi praktisi dan vendor model komersial (RiskMetrics, Barra, Axioma) justru memakainya — dengan *half-life* yang sama untuk semua aset.`,
      contoh: `$K = 0{,}94 \\to \\tau = -\\log(2)/\\log(0{,}94) \\approx$ **$11{,}2$ hari**: observasi 11 hari lalu bobotnya tinggal separuh. Ini setara dengan GARCH(1,1) berparameter ($\\alpha_0 = 0$; $\\alpha_1 = 0{,}06$; $\\beta_1 = 0{,}94$).`,
      jebakan: `Tiga jebakan seputar identitas EWMA ≡ GARCH — dirinci di bawah.`,
      poin: [
        { judul: `EWMA murni tanpa jangkar jangka panjang`, isi: `Identitas mensyaratkan $\\alpha_0 = 0$ — artinya EWMA murni **tanpa jangkar jangka panjang** (tanpa *mean reversion*); jangan mengklaim EWMA "kembali ke rata-rata".`, nada: "jebakan" },
        { judul: `Half-life seragam = simplifikasi`, isi: `*Half-life* seragam antar-aset di model komersial adalah simplifikasi (kemudahan komunikasi ke klien), bukan hasil optimasi.`, nada: "jebakan" },
        { judul: `Arah K: mendekati 1 = ingatan panjang`, isi: `Jangan tertukar arah $K$: $K$ mendekati 1 = ingatan panjang; $K$ kecil = masa lalu cepat dilupakan.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Roll model — harga yang kamu lihat itu berisik`,
      ringkas: `Harga yang kamu lihat di layar itu berisik: bid-ask bounce menciptakan autokorelasi negatif semu yang bukan sinyal trading.`,
      definisi: `Harga "sebenarnya" $m_t$ bergerak sebagai *random walk* ($m_{t+1} = m_t + \\sigma_\\varepsilon \\cdot \\varepsilon_{t+1}$), sedangkan yang teramati $p_{t+1} = m_{t+1} + \\sigma_\\eta \\cdot \\eta_{t+1}$ — tercemar derau pengukuran (terutama *bid-ask bounce*: harga transaksi meloncat antara bid dan ask karena kerandoman sisi order). Akibat yang langsung bisa diuji: **$E(\\Delta p_{t+1} \\cdot \\Delta p_t) = -\\sigma_\\eta^2$** — perbedaan harga berurutan berkorelasi **negatif**, murni artefak pengukuran.`,
      kenapa: `Dua pelajaran praktis: (1) harga penutupan harian lebih baik diestimasi dengan **EWMA dari harga-harga interval** (mis. 5-menit) daripada "harga terakhir" — estimatornya $\\hat{m}_{t+1|t} = (1-K) \\hat{m}_{t|t-1} + K p_t$, dengan $K$ besar bila data akurat ($\\sigma_\\eta/\\sigma_\\varepsilon$ kecil); (2) autokorelasi negatif di data tick **bukan** sinyal *mean-reversion* yang bisa ditradingkan — itu pantulan bid-ask.`,
      contoh: `Misal derau pengukuran $\\sigma_\\eta = 0{,}1\\% \\to$ kovarians lag-1 $= -(0{,}001)^2 = -10^{-6}$: kecil tapi negatif sistematis. Cek wajib bab ini: **$(1-K)^T \\ll 1$**. Dengan $K = 0{,}1$ dan $T = 78$ interval: $0{,}9^{78} \\approx 2{,}7 \\times 10^{-4} \\ll 1$ ✓. Kalau cek ini diabaikan, estimasi dua periode memakai harga yang sama → korelasi semu antar-estimasi return.`,
      jebakan: `Tiga jebakan dalam menafsirkan derau pengukuran harga — dirinci di bawah.`,
      poin: [
        { judul: `Autokorelasi di luar lag-1 = bahaya`, isi: `Autokorelasi non-nol **di luar lag-1** justru sinyal bahaya: model tak memadai, ada dependensi jangka panjang di $m_t$.`, nada: "jebakan" },
        { judul: `EWMA harga ≠ EWMA varians`, isi: `Jangan campuradukkan EWMA **harga** (bagian ini, untuk mengestimasi m_t) dengan EWMA **varians** (bagian 2.6, untuk mengestimasi $\\sigma^2_t$) — objeknya beda.`, nada: "jebakan" },
        { judul: `Bounce spread: mekanis, bukan informasi`, isi: `Spread adalah kelipatan *tick size*; bounce-nya mekanis, bukan informasi.`, nada: "jebakan" },
      ],
    },
    {
      judul: `State-space & Kalman — justifikasi model untuk EWMA`,
      ringkas: `Justifikasi model bagi EWMA: filter Kalman untuk state yang tak teramati, dengan satu rasio κ yang menentukan seberapa percaya kamu pada data baru.`,
      definisi: `Model Muth (1960), contoh *state-space* paling sederhana: state tak teramati $x_t$ berevolusi ($x_{t+1} = x_t + \\tau_\\varepsilon \\cdot \\varepsilon_{t+1}$); observasi $y_{t+1} = x_{t+1} + \\tau_\\eta \\cdot \\eta_{t+1}$ adalah pengukuran berisik atasnya. Estimator optimalnya rekursif dan berbentuk EWMA: **$\\hat{x}_{t+1|t} = (1-K) \\hat{x}_{t|t-1} + K y_t$**, dengan **Kalman gain $K = \\frac{\\hat{\\sigma}^2}{\\hat{\\sigma}^2 + \\tau_\\eta^2}$** dan rasio derau-pengukuran-terhadap-inovasi **$\\kappa := \\tau_\\eta/\\tau_\\varepsilon$**. Untuk estimasi volatilitas: state = varians instan, observasi $y_t = r_t^2$.`,
      kenapa: `Inilah jawaban atas "bisakah EWMA dimotivasi oleh model?" — ya: EWMA *adalah* filter Kalman untuk model ini. Kerangka ini juga fleksibel: tambah suku *mean-reversion* $x_{t+1} = x_t - \\lambda(x_t - \\mu) + \\tau_\\varepsilon \\cdot \\varepsilon_{t+1}$ dan estimatornya tetap berbentuk EWMA — hanya dengan $K$ yang **lebih kecil**.`,
      contoh: `Untuk $\\kappa \\gg 1$, $K \\simeq 1/(\\kappa+1)$. Ambil $\\kappa = 2$ (derau pengukuran 2× inovasi): $K \\simeq 1/3 \\to \\hat{x} = \\frac{2}{3} \\cdot \\text{riwayat} + \\frac{1}{3} \\cdot \\text{data baru}$ — data berisik, jadi percaya histori. Sebaliknya $\\kappa \\simeq 0 \\to K \\simeq 1$ — percaya data baru, lupakan masa lalu agresif. Dengan *mean reversion*, K turun: volatilitas yang lebih "jinak" membuat data lama lebih informatif.`,
      jebakan: `Empat jebakan dalam membaca model Muth dan filter Kalman — dirinci di bawah.

---`,
      poin: [
        { judul: `κ = τ_η/τ_ε — jangan terbalik`, isi: `$\\kappa := \\tau_\\eta/\\tau_\\varepsilon$ — **jangan terbalik** (ringkasan mentah sempat menuliskannya terbalik; teks bab yang benar).`, nada: "jebakan" },
        { judul: `Varians negatif & sebaran ∝ √T`, isi: `Model Muth membolehkan varians **negatif** dan sebarannya melebar $\\propto \\sqrt{T}$ — tidak realistis, tapi filter Kalman tetap bekerja baik selama ekornya tidak terlalu gemuk.`, nada: "jebakan" },
        { judul: `Mean reversion → K lebih kecil`, isi: `Arah $K$ pada *mean reversion* kontra-intuitif: $K$ **lebih kecil** → masa lalu di-*discount* **lebih sedikit**.`, nada: "jebakan" },
        { judul: `Harvey–Shephard: modelkan log-varians`, isi: `Model Harvey–Shephard (⋆) memperbaiki positivitas dengan memodelkan **log**-varians — volatilitas dijamin positif dan berdistribusi log-normal.`, nada: "jebakan" },
      ],
    },
  ],
  cheatsheet: `Cheatsheet Bab

> Satu halaman ringkas — cetak dan tempel. Semua definisi & hubungan dari Bab 2.

**Definisi return**
- $r_i(1) := \\frac{P_i(1) - P_i(0)}{P_i(0)}$ · dividend-adjusted: tambah $D_i(1)$ di pembilang
- Compounded: $r(1:T) = \\prod_{t=1}^{T}(1+r(t)) - 1$ · Log: $\\tilde{r}(t) := \\log(1+r(t))$; aditif: $\\log(1+r(1:T)) = \\sum_t \\tilde{r}(t)$; $\\tilde{r} \\simeq r$ untuk return kecil (**aproksimasi optimistis!**)
- Excess return: $r_i - r_f$ (SOFR) · PnL portofolio $= w^T r$ · Volatilitas = std dev return; varians = kuadratnya; $\\sigma^2 \\simeq E[r^2]$ bila $E[r^2] \\gg E[r]^2$

**Stylized facts (log return harian):** tanpa autokorelasi · heavy tails — $P(r > x) = C \\cdot x^{-\\alpha}$, $\\alpha \\simeq 4$ · volatility clustering — $\\mathrm{ACF}(|r|)$ terbesar ("Taylor effect") · aggregational Gaussianity · (leverage effect TIDAK masuk daftar)

**GARCH(1,1)**
- $r_t = h_t \\cdot \\varepsilon_t$, $\\varepsilon_t \\sim N(0,1)$; **$h_t^2 = \\alpha_0 + \\alpha_1 r_{t-1}^2 + \\beta_1 h_{t-1}^2$**; $\\alpha_0, \\alpha_1, \\beta_1 \\geq 0$
- Varians jangka panjang (stasioner, $\\alpha_1 + \\beta_1 < 1$): **$h^2 = \\frac{\\alpha_0}{1 - \\alpha_1 - \\beta_1}$**
- Bentuk EWMA: $h_t^2 = h^2 + \\alpha_1 \\sum_{i \\geq 1} \\beta_1^{i-1} r_{t-i}^2$
- Kurtosis $> 3$ bila $\\alpha_1 > 0$ (leptokurtik); skewness $= 0$; ekor Pareto: $P(r_t > x) \\sim x^{-\\alpha}$

**Realized Volatility**
- **$\\hat{\\sigma}^2 = \\sum_{j=1}^{n} r^2(j)$** (uncentered) · $E[\\hat{\\sigma}^2] = \\sigma^2 + \\alpha^2/n$ · $\\mathrm{var}(\\hat{\\sigma}^2) = 2\\sigma^4/n + 4(\\alpha/n)^2\\sigma^2 \\to$ **konsisten**
- Drift: $\\hat{\\alpha} = p(1) - p(0)$, $\\mathrm{var}(\\hat{\\alpha}) = \\sigma^2$ — **tidak membaik** dengan $n$
- Praktik: RV 5-menit vanilla kompetitif (Liu et al. 2015); waspada microstructure & thin trading

**EWMA**
- **$\\hat{\\sigma}_t^2 = (1-K) r_t^2 + K \\hat{\\sigma}_{t-1}^2$** $= (1-K) \\sum_{i \\geq 1} K^{i-1} r_{t-i}^2$
- Half-life: $K^\\tau = 1/2 \\to$ **$\\tau = -\\log 2 / \\log K$** ($K = 0{,}94 \\to \\tau \\approx 11{,}2$ hari)
- ≡ GARCH(1,1) bila **$\\alpha_0 = 0$, $\\alpha_1 = 1-K$, $\\beta_1 = K$**

**Kalman (Muth)**
- $x_{t+1} = x_t + \\tau_\\varepsilon \\cdot \\varepsilon_{t+1}$ ; $y_{t+1} = x_{t+1} + \\tau_\\eta \\cdot \\eta_{t+1}$
- **$\\hat{x}_{t+1|t} = (1-K) \\hat{x}_{t|t-1} + K y_t$** ; **$K = \\frac{\\hat{\\sigma}^2}{\\hat{\\sigma}^2 + \\tau_\\eta^2}$** ; **$\\kappa := \\tau_\\eta/\\tau_\\varepsilon$**
- $\\kappa \\gg 1 \\to K \\simeq 1/(\\kappa+1)$ (percaya riwayat); $\\kappa \\simeq 0 \\to K \\simeq 1$ (percaya data baru)
- Roll: $\\hat{m}_{t+1|t} = (1-K) \\hat{m}_{t|t-1} + K p_t$ ; $E(\\Delta p_{t+1} \\cdot \\Delta p_t) = -\\sigma_\\eta^2$ ; cek $(1-K)^T \\ll 1$

**Angka jangkar:** tail index $\\alpha \\simeq 4$ · KS-distance SPY $0{,}098 \\to 0{,}040$ sesudah GARCH · kurtosis SPY $\\approx 11{,}4$ / NRG $\\approx 14{,}3$ / WAT $\\approx 29{,}8$ · cut-off estimasi tail $\\pm 2{,}5\\%$
---`,
  prediksi: [
    {
      id: "P1",
      pertanyaan: `Bab ini hanya membahas SATU aset, padahal tujuan akhirnya adalah portofolio berisi banyak aset. Menurutmu, kenapa return univariat harus dikuasai dulu sebelum bicara portofolio?`,
      kunci: `Karena return aset tunggal adalah bata penyusun portofolio — perilaku portofolio (terutama volatilitasnya) tak bisa dipahami tanpa paham sifat bata-batanya. Bonusnya: model univariat (GARCH, EWMA) dipakai lagi sebagai komponen model multivariat di bab-bab berikutnya.`,
    },
    {
      id: "P2",
      pertanyaan: `Data menunjukkan autokorelasi return harian praktis nol. Apakah itu berarti return besok tidak bisa diprediksi sama sekali? Jelaskan alasanmu.`,
      kunci: `Tidak. Nol autokorelasi $\\neq$ independen — bab menegaskan return tetap *predictable* (meski "not so trivially"), dan nol korelasi linier tidak menutup dependensi non-linier: justru $|r|$ dan $r^2$ ber-autokorelasi kuat (volatility clustering).`,
    },
    {
      id: "P3",
      pertanyaan: `Kamu punya data harga tiap menit untuk mengestimasi volatilitas harian. Apakah estimasimu otomatis jauh lebih akurat daripada memakai data harian? Sebutkan minimal dua hal yang bisa merusaknya.`,
      kunci: `Tidak otomatis. Perusak dari bab ini (dua dari empat cukup): (1) **microstructure noise** — bid-ask bounce & error pengukuran membuat return frekuensi tinggi berisik; (2) **thin trading** — saham yang jarang transaksi tak cocok diestimasi per menit; (3) volatilitas tak konstan sepanjang hari; (4) beda open-to-close vs close-to-open (return overnight digerakkan fundamental).`,
    },
  ],
  kuis: [
    {
      pertanyaan: `Dari daftar *stylized facts* Bab 2, yang SENGAJA tidak dimasukkan penulis adalah …`,
      opsi: [
        `A. absence of autocorrelations`,
        `B. heavy tails`,
        `C. leverage effect`,
        `D. aggregational Gaussianity`,
      ],
      benar: 2,
      penjelasan: `leverage effect dikecualikan dengan sadar (Catatan 7): penulis menilai efeknya tak cukup kuat di data terbaru (Ratliff-Crain et al. 2023).`,
    },
    {
      pertanyaan: `"Taylor effect" dalam bab ini maksudnya …`,
      opsi: [
        `A. return besar cenderung diikuti return besar (volatility clustering saja)`,
        `B. autokorelasi $|r(t)|$ paling besar dibanding $r^2(t)$`,
        `C. distribusi log return mendekati Gaussian di horizon panjang`,
        `D. ekor distribusi mengikuti power law`,
      ],
      benar: 1,
      penjelasan: `definisi tepat Taylor effect: $\\mathrm{ACF}(|r|)$ terbesar, merujuk Taylor (1986) & Granger–Ding (1995). Opsi A hanya volatility clustering secara umum.`,
    },
    {
      pertanyaan: `Agar GARCH(1,1) stasioner dengan varians *unconditional* yang hingga, syaratnya …`,
      opsi: [
        `A. $\\alpha_1 + \\beta_1 < 1$ (dengan $\\alpha_0, \\alpha_1, \\beta_1 \\geq 0$),`,
        `B. α_0 = 0`,
        `C. $\\alpha_1 > \\beta_1$`,
        `D. $\\alpha_0 + \\alpha_1 + \\beta_1 = 1$`,
      ],
      benar: 0,
      penjelasan: `varians jangka panjang $h^2 = \\frac{\\alpha_0}{1-\\alpha_1-\\beta_1}$ hanya hingga bila $\\alpha_1+\\beta_1 < 1$; parameter non-negatif adalah syarat model.`,
    },
    {
      pertanyaan: `GARCH(1,1) identik dengan EWMA tepat ketika …`,
      opsi: [
        `A. $\\alpha_0 = 1$, $\\alpha_1 = K$, $\\beta_1 = 1-K$`,
        `B. $\\alpha_0 = 0$, $\\alpha_1 = 1-K$, $\\beta_1 = K$,`,
        `C. $\\alpha_1 = \\beta_1 = K$`,
        `D. $K = \\alpha_0 + \\alpha_1 + \\beta_1$`,
      ],
      benar: 1,
      penjelasan: `Insight 2.2: tanpa offset ($\\alpha_0 = 0$) dan bobot ($1-K$, $K$), GARCH(1,1) persis EWMA.`,
    },
    {
      pertanyaan: `Untuk estimator RV $\\hat{\\sigma}^2 = \\sum_j r^2(j)$, pernyataan yang BENAR adalah …`,
      opsi: [
        `A. biasnya tetap walau n → ∞`,
        `B. $\\mathrm{bias} = \\alpha^2/n \\to 0$ sehingga estimatornya konsisten`,
        `C. drift (expected return) bisa diestimasi akurat dengan n besar`,
        `D. RV selalu lebih baik daripada GARCH`,
      ],
      benar: 1,
      penjelasan: `$\\mathrm{bias} \\propto 1/n$ (Insight 2.1). C salah: $\\mathrm{var}(\\hat{\\alpha}) = \\sigma^2$ independen dari $n$. D salah: keunggulan tergantung asumsi (vol berubah lambat, microstructure terkendali).`,
    },
    {
      pertanyaan: `Model Roll memprediksi …`,
      opsi: [
        `A. $E(\\Delta p_{t+1} \\cdot \\Delta p_t) = -\\sigma_\\eta^2$ — autokovarians lag-1 negatif akibat bid-ask bounce`,
        `B. autokorelasi positif di semua lag`,
        `C. harga teramati sama dengan harga sebenarnya`,
        `D. bid-ask spread selalu nol dalam praktik`,
      ],
      benar: 0,
      penjelasan: `akibat teruji model Roll: pantulan bid-ask membuat perbedaan harga berurutan berkorelasi negatif; ini artefak pengukuran, bukan sinyal trading.`,
    },
    {
      pertanyaan: `EWMA dengan K = 0,94 memiliki *half-life* sekitar …`,
      opsi: [
        `A. 2 hari`,
        `B. 11 hari`,
        `C. 30 hari`,
        `D. 94 hari`,
      ],
      benar: 1,
      penjelasan: `$\\tau = -\\log 2 / \\log 0{,}94 \\approx 11{,}2$ hari.`,
    },
    {
      pertanyaan: `Dalam model Muth, $\\kappa := \\tau_\\eta/\\tau_\\varepsilon$. Bila $\\kappa \\gg 1$ maka …`,
      opsi: [
        `A. $K \\simeq 1$ — estimator percaya penuh pada data baru`,
        `B. $K \\simeq 1/(\\kappa+1)$ kecil — estimator lebih percaya pada riwayat`,
        `C. K = 0 — observasi diabaikan total`,
        `D. model tidak terdefinisi`,
      ],
      benar: 1,
      penjelasan: `$\\kappa$ besar = derau pengukuran dominan → $K$ kecil → bobot lebih ke estimasi lama (percaya riwayat).`,
    },
  ],
  fsrs: [
    { depan: `Definisi simple return dan dividend-adjusted return.`, belakang: `$r_i(1) := \\frac{P_i(1)-P_i(0)}{P_i(0)}$; versi dividen menambahkan $D_i(1)$ di pembilang.` },
    { depan: `Definisi log return dan dua keunggulannya.`, belakang: `$\\tilde{r}(t) := \\log(1+r(t))$; aditif antar periode ($\\log(1+r(1:T)) = \\sum_t \\tilde{r}(t)$) dan varians ikut terjumlah bila independen; $\\tilde{r} \\simeq r$ untuk return kecil (aproksimasi optimistis).` },
    { depan: `Apa itu excess return dan kenapa dipakai di seluruh buku?`, belakang: `$r_i - r_f$ ($r_f \\approx \\text{SOFR}$); mengeliminasi aset bebas risiko dari portofolio; kas = sekuritas khusus bervolatilitas negligible.` },
    { depan: `Empat stylized facts return saham harian.`, belakang: `Tanpa autokorelasi; heavy tails (tail index $\\alpha \\simeq 4$); volatility clustering (ACF $|r|$ & $r^2$ positif kuat); aggregational Gaussianity.` },
    { depan: `Apa itu "Taylor effect"?`, belakang: `Autokorelasi $|r(t)|$ paling besar dibanding $r^2(t)$ (Taylor 1986; Granger & Ding 1995).` },
    { depan: `Tulis tiga persamaan GARCH(1,1).`, belakang: `$r_t = h_t \\cdot \\varepsilon_t$; $h_t^2 = \\alpha_0 + \\alpha_1 r_{t-1}^2 + \\beta_1 h_{t-1}^2$; $\\varepsilon_t \\sim N(0,1)$; $\\alpha_0, \\alpha_1, \\beta_1 \\geq 0$.` },
    { depan: `Varians jangka panjang GARCH(1,1) dan syaratnya.`, belakang: `$h^2 = \\frac{\\alpha_0}{1-\\alpha_1-\\beta_1}$, syarat stasioner $\\alpha_1+\\beta_1 < 1$.` },
    { depan: `Rumus RV dan sifat biasnya (Insight 2.1).`, belakang: `$\\hat{\\sigma}^2 = \\sum_j r^2(j)$; $E[\\hat{\\sigma}^2] = \\sigma^2 + \\alpha^2/n \\to \\mathrm{bias} \\propto 1/n$, konsisten; $\\mathrm{var} = 2\\sigma^4/n + 4(\\alpha/n)^2\\sigma^2$.` },
    { depan: `Kapan GARCH(1,1) identik dengan EWMA? + rumus half-life.`, belakang: `$\\alpha_0 = 0$, $\\alpha_1 = 1-K$, $\\beta_1 = K$; $\\tau = -\\log 2 / \\log K$.` },
    { depan: `Model Roll: dua persamaan + akibat yang bisa diuji.`, belakang: `$m_{t+1} = m_t + \\sigma_\\varepsilon \\cdot \\varepsilon_{t+1}$; $p_{t+1} = m_{t+1} + \\sigma_\\eta \\cdot \\eta_{t+1}$; $E(\\Delta p_{t+1} \\cdot \\Delta p_t) = -\\sigma_\\eta^2$.` },
  ],
  feynman: [
    {
      poin: `Empat definisi return + kapan memakai log vs net`,
      penajaman: `kalau ditanya "kenapa aproksimasi $\\tilde{r} \\simeq r$ disebut optimistis dan kapan ia gagal?", harus bisa jawab: hanya akurat untuk return kecil (harian/saham); buruk untuk horizon tahunan atau return sangat volatil.`,
    },
    {
      poin: `Excess return & SOFR`,
      penajaman: `kalau ditanya "kenapa kas diperlakukan sebagai sekuritas khusus?", harus bisa jawab: volatilitasnya negligible untuk pemodelan; kita pinjam/memminjamkan sebesar NMV sehingga aset bebas risiko tereliminasi.`,
    },
    {
      poin: `Empat stylized facts + contoh angka`,
      penajaman: `kalau ditanya "kurtosis SPY berapa dan apa arti $\\alpha \\simeq 4$?", harus bisa jawab: $\\approx 11{,}4$ (2001–2017); ekor power-law membuat peluang ekstrem turun jauh lebih lambat dari Gaussian; momen ke-4 yang hingga membuat volatilitas bisa diestimasi.`,
    },
    {
      poin: `Mekanisme GARCH: shock → vol naik → mean-revert`,
      penajaman: `kalau ditanya "dengan $\\alpha_0 = 0{,}02$, $\\alpha_1 = 0{,}05$, $\\beta_1 = 0{,}90$, $r^2 = 4$, $h^2 = 1$: berapa $h^2$ besok dan ke mana ia kembali?", harus bisa jawab: $1{,}12$, lalu meluruh geometris ke $0{,}40$.`,
    },
    {
      poin: `Arah penjelasan GARCH: conditional Gaussian → unconditional heavy-tailed`,
      penajaman: `kalau ditanya "apakah GARCH mengasumsikan return Gaussian?", harus bisa jawab: TIDAK — justru menjelaskan ekor gemuk dengan residual Gaussian; buktinya jarak KS menyusut (SPY $0{,}098 \\to 0{,}040$) dan tail index residual naik.`,
    },
    {
      poin: `RV: bias ∝ 1/n, tapi drift tak tertolong`,
      penajaman: `kalau ditanya "kenapa data 1-detik tak membuat estimasi expected return lebih baik?", harus bisa jawab: $\\mathrm{var}(\\hat{\\alpha}) = \\sigma^2$ independen dari $n$; yang membaik hanya estimasi varians — dengan syarat microstructure terkendali.`,
    },
    {
      poin: `EWMA ≡ GARCH & half-life`,
      penajaman: `kalau ditanya "$K = 0{,}94$ artinya apa dan setara GARCH yang mana?", harus bisa jawab: half-life $\\approx 11{,}2$ hari; setara $\\mathrm{GARCH}(0; 0{,}06; 0{,}94)$ — tanpa jangkar jangka panjang.`,
    },
    {
      poin: `Roll model & uji $\\sigma_\\eta^2$`,
      penajaman: `kalau ditanya "autokorelasi negatif di data tick = sinyal trading?", harus bisa jawab: bukan — itu bid-ask bounce; harga harian lebih baik diestimasi via EWMA dengan cek $(1-K)^T \\ll 1$.`,
    },
    {
      poin: `Muth/Kalman: $\\kappa$, $K$, dan arah kepercayaan`,
      penajaman: `kalau ditanya "$\\kappa = 2$ vs $\\kappa \\simeq 0$, mana yang lebih percaya data baru?", harus bisa jawab: $\\kappa := \\tau_\\eta/\\tau_\\varepsilon$; $\\kappa = 2 \\to K \\approx 1/3$ (percaya riwayat); $\\kappa \\simeq 0 \\to K \\simeq 1$ (percaya data baru); mean reversion membuat $K$ lebih kecil.`,
    },
    {
      poin: `Batas GARCH: tahu kapan model gagal`,
      penajaman: `kalau ditanya "apa dua kelemahan empiris GARCH(1,1)?", harus bisa jawab: autokorelasi yang diprediksi terlalu tinggi untuk kurtosis yang diamati; hasil agregasinya tetap GARCH bukan Gaussian (memori jangka panjang kepanjangan).`,
    },
  ],
  rumus: [
    {
      id: `bab2-logreturn`,
      judul: `Log return — versi aditif dari return`,
      latex: `\\tilde{r}(t) = \\log(1+r(t))`,
      variabel: [
        { simbol: `\\tilde{r}(t)`, arti: `log return periode t` },
        { simbol: `r(t)`, arti: `simple (net) return periode t` },
      ],
      langkah: [
        `Periode 1: $r = 10\\% \\to \\tilde{r} = \\log(1{,}10) \\approx 9{,}53\\%$`,
        `Periode 2: $r = -5\\% \\to \\tilde{r} = \\log(0{,}95) \\approx -5{,}13\\%$`,
        `Jumlah: $9{,}53\\% + (-5{,}13\\%) = 4{,}40\\% = \\log(1{,}10 \\times 0{,}95) = \\log(1{,}045)$`,
      ],
      hasil: `**$\\tilde{r}(1) + \\tilde{r}(2) \\approx 4{,}40\\%$** — log return aditif antar periode (net return tidak: $1{,}10 \\times 0{,}95 - 1 = 4{,}50\\%$).`,
      jebakan: `$\\tilde{r} \\simeq r$ hanya untuk return kecil — aproksimasinya optimistis; buruk untuk horizon tahunan atau return sangat volatil (Latihan 2.1).`,
    },
    {
      id: `bab2-garch`,
      judul: `GARCH(1,1) — volatilitas sebagai state dinamis`,
      latex: `h_t^2 = \\alpha_0 + \\alpha_1 r_{t-1}^2 + \\beta_1 h_{t-1}^2`,
      variabel: [
        { simbol: `h_t^2`, arti: `varians kondisional hari t` },
        { simbol: `r_{t-1}^2`, arti: `return kuadrat kemarin (shock)` },
        { simbol: `\\alpha_0`, arti: `konstanta — jangkar varians jangka panjang` },
        { simbol: `\\alpha_1`, arti: `bobot shock kemarin` },
        { simbol: `\\beta_1`, arti: `bobot memori (varians kemarin)` },
      ],
      langkah: [
        `$\\alpha_0 = 0{,}02$, $\\alpha_1 = 0{,}05$, $\\beta_1 = 0{,}90$; kemarin $r^2 = 4$, $h^2 = 1$`,
        `$h^2_{\\text{hari ini}} = 0{,}02 + 0{,}05 \\times 4 + 0{,}90 \\times 1$`,
        `$= 0{,}02 + 0{,}20 + 0{,}90 = 1{,}12$`,
      ],
      hasil: `**$h^2 = 1{,}12$** — shock mendorong volatilitas naik dari 1,00; ia meluruh geometris (laju $\\beta_1$) kembali ke $\\frac{0{,}02}{1-0{,}05-0{,}90} = 0{,}40$.`,
      jebakan: `Arah penjelasan: GARCH menjelaskan ekor gemuk *dengan* residual Gaussian — bukan ‘mengasumsikan return Gaussian’. Dan $\\alpha_1 + \\beta_1 \\geq 1$ → varians tak hingga (tak stasioner).`,
    },
    {
      id: `bab2-halflife`,
      judul: `Half-life EWMA — seberapa cepat masa lalu dilupakan`,
      latex: `\\tau = -\\frac{\\log 2}{\\log K}`,
      variabel: [
        { simbol: `\\tau`, arti: `half-life: periode hingga bobot observasi tinggal separuh` },
        { simbol: `K`, arti: `parameter EWMA (0 < K < 1); K→1 = ingatan panjang` },
      ],
      langkah: [
        `Ambil $K = 0{,}94$ (RiskMetrics)`,
        `$\\log(0{,}94) \\approx -0{,}0619$; $-\\log 2 \\approx -0{,}6931$`,
        `$\\tau = \\frac{-0{,}6931}{-0{,}0619} \\approx 11{,}2$ hari`,
      ],
      hasil: `**$\\tau \\approx 11{,}2$ hari** — observasi 11 hari lalu bobotnya tinggal separuh; setara GARCH $(\\alpha_0{=}0; \\alpha_1{=}0{,}06; \\beta_1{=}0{,}94)$.`,
      jebakan: `Identitas EWMA ≡ GARCH mensyaratkan $\\alpha_0 = 0$ (tanpa jangkar jangka panjang). Jangan tertukar arah $K$: $K$ kecil = masa lalu cepat dilupakan.`,
    },
    {
      id: `bab2-kappa`,
      judul: `κ — rasio derau pengukuran terhadap inovasi (Muth)`,
      latex: `\\kappa = \\frac{\\tau_\\eta}{\\tau_\\varepsilon}`,
      variabel: [
        { simbol: `\\kappa`, arti: `rasio derau-pengukuran-terhadap-inovasi` },
        { simbol: `\\tau_\\eta`, arti: `simpangan baku derau pengukuran (measurement noise)` },
        { simbol: `\\tau_\\varepsilon`, arti: `simpangan baku inovasi state` },
      ],
      langkah: [
        `Ambil $\\kappa = 2$ (derau pengukuran 2× inovasi)`,
        `Untuk $\\kappa \\gg 1$: $K \\simeq \\frac{1}{\\kappa+1} = \\frac{1}{3}$`,
        `$\\hat{x} = \\frac{2}{3} \\cdot \\text{riwayat} + \\frac{1}{3} \\cdot \\text{data baru}$`,
      ],
      hasil: `**$K \\approx 1/3$** — data berisik, estimator lebih percaya riwayat; sebaliknya $\\kappa \\simeq 0 \\to K \\simeq 1$ (percaya data baru).`,
      jebakan: `$\\kappa := \\tau_\\eta/\\tau_\\varepsilon$ — jangan terbalik (η di pembilang, ε di penyebut); ringkasan mentah sempat menuliskannya terbalik, teks bab yang benar.`,
    },
  ],
  // Tata letak v2 (2026-10-17): jarak antar-simpul dilebarkan ±60% agar label
  // garis tidak bertabrakan dengan simpul; edge simple→excess dirutekan via
  // titik atas (lurus = menembus simpul comp & logret). Addendum LAPORAN_POLES_G1.md.
  peta: {
    nodes: [
      { id: `simple`, label: `Simple return`, x: 150, y: 80, konsepId: 0 },
      { id: `comp`, label: `Compounded`, x: 450, y: 80, konsepId: 1 },
      { id: `logret`, label: `Log return`, x: 750, y: 80, konsepId: 2 },
      { id: `excess`, label: `Excess return`, x: 1050, y: 80, konsepId: 3 },
      { id: `vol`, label: `Volatilitas`, x: 1350, y: 80, konsepId: 4 },
      { id: `roll`, label: `Roll model`, x: 150, y: 310, konsepId: 5 },
      { id: `stylized`, label: `Stylized facts`, x: 450, y: 310, konsepId: 6 },
      { id: `garch`, label: `GARCH(1,1)`, x: 750, y: 310, konsepId: 7 },
      { id: `rv`, label: `Realized vol`, x: 1050, y: 310, konsepId: 8 },
      { id: `ewma`, label: `EWMA`, x: 450, y: 540, konsepId: 9 },
      { id: `kalman`, label: `Kalman / Muth`, x: 750, y: 540, konsepId: 10 },
    ],
    edges: [
      { from: `simple`, to: `comp`, label: `Π(1+r)−1` },
      { from: `comp`, to: `logret`, label: `log: aditif` },
      { from: `simple`, to: `excess`, label: `− r_f`, via: [{ x: 600, y: -80 }] },
      { from: `logret`, to: `stylized`, label: `fakta empiris` },
      { from: `stylized`, to: `garch`, label: `dimodelkan` },
      { from: `vol`, to: `garch`, label: `jadi state dinamis` },
      { from: `vol`, to: `rv`, label: `diukur langsung` },
      { from: `vol`, to: `ewma`, label: `dirata-ratakan` },
      { from: `garch`, to: `ewma`, label: `≡ bila α₀=0` },
      { from: `ewma`, to: `kalman`, label: `dijustifikasi` },
      { from: `roll`, to: `ewma`, label: `harga via EWMA` },
    ],
  },
};
