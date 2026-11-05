import type { ChapterPack } from "./bedahbuku";

export const PACK4: ChapterPack = {
  slug: "bab-4",
  bab: 4,
  judul: `Linear Models of Returns`,
  catatan: `bab fondasi teoritis seluruh buku — satu persamaan linier (4.1) yang menjadi mesin atribusi, manajemen risiko, konstruksi portofolio, dan riset alpha di bab-bab berikutnya. Bab ini hampir tanpa angka empiris (murni teori), jadi contoh numerik bertanda **ilustrasi** bila tidak berasal dari buku.`,
  ideBesar: `return $n$ aset bisa ditulis sebagai kombinasi linier dari $m$ faktor risiko bersama ($m \\ll n$) ditambah komponen idiosinkratis yang spesifik per aset — satu persamaan, $r_t = \\alpha + Bf_t + \\epsilon_t$, yang mengubah masalah "dependensi antar ribuan aset" menjadi masalah "beberapa sumber ketidakpastian + diagonal/sparse noise". Dari persamaan ini mengalir semuanya: dekomposisi kovarians $\\Omega_r = B\\Omega_f B^T + \\Omega_\\epsilon$, pemisahan alpha menjadi spanned vs orthogonal (dengan batas bawah Sharpe Ratio yang tumbuh seiring $n$), tiga cara membaca model yang sama (grafis, superposisi, produk), tiga transformasi yang sah (rotasi, proyeksi, push-out), dan empat aplikasi praktis (atribusi PnL, dekomposisi varians/MCR, konstruksi portofolio, riset alpha).`,
  diagram: `PERSAMAAN MODEL FAKTOR (4.1)
r_t = α + Bf_t + ϵ_t            ← satu persamaan, seluruh bab
  r_t ∈ Rⁿ: return n aset minus risk-free   α ∈ Rⁿ: vektor alpha
  B ∈ Rⁿˣᵐ: loadings (sensitivitas)         f_t ∈ Rᵐ: return faktor (m ≪ n)
  ϵ_t ∈ Rⁿ: idiosinkratis; E[ϵ_t]=0; Ω_ϵ diagonal/sparse

DEKOMPOSISI KOVARIANS (4.2)
Ω_r = BΩ_f Bᵀ + Ω_ϵ            ← sistematis + idiosinkratis
  var(wᵀr) = bᵀΩ_f b + wᵀΩ_ϵ w   (b = Bᵀw: eksposur faktor portofolio)

ALPHA: DUA WAJAH
α = Bλ + α⊥ ;  Bᵀα⊥ = 0
  α spanned (Bλ): tak terbedakan dari return ekspektasi faktor → diserap ke μ_f
  α orthogonal (α⊥): diversifikasi murni → SR ≥ ‖α⊥‖/‖Ω_ϵ‖ ≥ nμ/‖Ω_ϵ‖  (4.3)

TIGA INTERPRETASI (model yang sama, tiga lensa)
① graphical model: faktor (lingkaran) → return aset (kotak) via loadings (panah)
② superposition: E[r−α|f] = Σⱼ [B]·,ⱼ fⱼ — cross-section hidup di subruang kolom B
③ single-asset product: return ekspektasi satu aset = inner product loadings × return faktor

TIGA TRANSFORMASI (4.4)
rotasi: B̃ = BC⁻¹, f̃ = Cf — prediksi & risiko TAK berubah (rotational indeterminacy)
proyeksi: g = Hf, H = (AᵀA)⁻¹AᵀB — pangkas faktor, model lebih sederhana
push-out: ϵ = Ag + η — tambah faktor saat residual masih terstruktur

EMPAT APLIKASI (4.5)
atribusi PnL: b_tᵀf_t + w_tᵀ(α⊥+ϵ_t) · dekomposisi varians & MCR
konstruksi portofolio: butuh Ω_r dan inversnya (precision matrix)
riset alpha: pisahkan eksposur faktor vs true alpha`,
  konsep: [
    {
      nama: `Model faktor linier`,
      definisi: `$r_t = \\alpha + Bf_t + \\epsilon_t$: return aset = alpha + kombinasi linier return faktor + komponen idiosinkratis.`,
      relasi: `satu-satunya primitif yang dibutuhkan bab-bab berikutnya; $r_t$ adalah return minus risk-free (lihat Bab 2).`,
    },
    {
      nama: `Komponen sistematis`,
      definisi: `$Bf_t$ — bagian return yang digerakkan sumber risiko bersama yang memengaruhi (hampir) semua aset.`,
      relasi: `inilah yang "menjelaskan" dependensi antar-aset — tanpa faktor, tiap aset harus dimodelkan independen (tidak memadai).`,
    },
    {
      nama: `Komponen idiosinkratis`,
      definisi: `$\\epsilon_t$ — return spesifik aset; diasumsikan (i) independen dari $f_s$ untuk semua $s$, (ii) $E[\\epsilon_t]=0$, (iii) $\\Omega_\\epsilon$ diagonal (strict) atau sparse (approximate).`,
      relasi: `dua tafsir — positif ("return spesifik yang tak berkorelasi") dan negatif ("sisa setelah sumber risiko umum dibuang").`,
    },
    {
      nama: `Loadings`,
      definisi: `matriks $B$ berukuran $n \\times m$; $[B]_{i,j}$ = sensitivitas aset $i$ terhadap faktor $j$.`,
      relasi: `"gudang data" yang menerjemahkan return faktor menjadi return aset; kolom-kolomnya merentang subruang tempat komponen faktor dari cross-section hidup.`,
    },
    {
      nama: `Alpha spanned`,
      definisi: `proyeksi $\\alpha$ pada subruang kolom $B$ ($\\alpha = B\\lambda + \\alpha_\\perp$); secara matematis tak terbedakan dari return ekspektasi faktor, sehingga diserap ke $\\mu_f := E[f_t]$ (buku menetapkan $\\lambda = 0$ selanjutnya).`,
      relasi: `"alpha" ini datang dengan risiko faktor yang tidak terdiversifikasi oleh $n$ besar.`,
    },
    {
      nama: `Alpha orthogonal`,
      definisi: `$\\alpha_\\perp$ — komplemen ortogonal, $B^T\\alpha_\\perp = 0$; diversifikasi murni.`,
      relasi: `portofolio $w = \\alpha_\\perp/\\|\\alpha_\\perp\\|$ punya batas bawah SR yang tumbuh seiring $n$ — hasil paling mengejutkan bab ini.`,
    },
    {
      nama: `Rotational indeterminacy`,
      definisi: `untuk matriks invertible $C$ ($m \\times m$), $r = \\alpha + \\tilde{B}\\tilde{f} + \\epsilon$ dengan $\\tilde{B} = BC^{-1}$, $\\tilde{f} = Cf$ menghasilkan return yang sama.`,
      relasi: `model faktor tidak teridentifikasi unik — representasi bisa dipilih demi interpretasi (identity covariance, orthonormal loadings, z-scored loadings) tanpa mengubah prediksi/risiko.`,
    },
    {
      nama: `Proyeksi model`,
      definisi: `$g = Hf$ dengan $H := (A^TA)^{-1}A^TB$ ($A$: loadings model sederhana, $p < m$ faktor); meminimalkan $\\|Bf - Ag\\|_2$; $\\Omega_g = H\\Omega_f H^T$.`,
      relasi: `aplikasi utama = mengatribusikan risiko/performa maksimum ke model nested yang lebih sederhana.`,
    },
    {
      nama: `Push-out`,
      definisi: `memperbesar model: $\\epsilon = Ag + \\eta$ bila residual masih terstruktur (model lama dibangun di rezim yang tidak representatif).`,
      relasi: `kebalikan proyeksi — menambah, bukan memangkas, faktor.`,
    },
    {
      nama: `Atribusi PnL`,
      definisi: `$\\text{PnL}_t = b_t^T f_t + w_t^T(\\alpha_\\perp + \\epsilon_t)$: PnL faktor + PnL idiosinkratis.`,
      relasi: `titik berangkat atribusi kinerja (faktor: style/industri/negara).`,
    },
    {
      nama: `Dekomposisi varians & MCR`,
      definisi: `$\\text{var}(w^Tr) = b^T\\Omega_f b + w^T\\Omega_\\epsilon w$; $p_i = \\beta_i$ (fraksi varians grup = beta PnL grup terhadap total); MCR mengukur sensitivitas vol portofolio terhadap penambahan 1 juta dolar vol grup.`,
      relasi: `fondasi monitoring risiko strategi.`,
    },
    {
      nama: `Tiga tipe model faktor`,
      definisi: `characteristic (input: $r_t$ dan $B_t$ karakteristik teramati → Bab 6), statistical (hanya $r_t$ primitif; $B, f, \\epsilon$ semua diestimasi → Bab 7), macroeconomic (primitif: $r_t$ dan $f_t$ variabel makro).`,
      relasi: `arti simbol-simbolnya bergantung pada tipe yang dipakai.`,
    },
  ],
  deepDive: [
    {
      judul: `Persamaan model faktor — satu baris yang menggerakkan seluruh buku`,
      ringkas: `Satu persamaan linier memampatkan dependensi ribuan aset menjadi segelintir faktor bersama plus noise per-aset.`,
      definisi: `Persamaan (4.1): $r_t = \\alpha + Bf_t + \\epsilon_t$, dengan $t \\in \\mathbb{N}$ periode diskrit. $r_t$ vektor return $n$ aset minus risk-free; $\\alpha$ vektor alpha berdimensi $n$; $B$ matriks loadings $n \\times m$ ($m$ jauh lebih kecil dari $n$ — model regional tipikal: sampai 10{.}000 aset, sampai 100 faktor); $f_t$ vektor return $m$ faktor; $\\epsilon_t$ vektor idiosinkratis dengan $E[\\epsilon_t] = 0$ dan $\\Omega_\\epsilon$ diagonal/sparse, independen dari $f_s$ untuk semua $s$.`,
      kenapa: `Tanpa faktor, dependensi antar-aset tak tertangani — memodelkan tiap aset sebagai proses independen "tidak memadai". Persamaan ini memampatkan dependensi ribuan aset menjadi $m$ sumber ketidakpastian yang pervasive (memengaruhi semua aset dengan cara tertentu) plus noise per-aset. Seluruh buku — atribusi, risiko, optimasi, riset alpha — adalah manipulasi aljabar atas persamaan ini.`,
      contoh: `Ilustrasi ($n=2$ aset, $m=1$ faktor; buku tidak memberi angka): misal $B = [0{,}8\\;\\; 1{,}2]^T$, $f_t = 0{,}03$, $\\alpha = [0{,}001\\;\\; 0{,}002]^T$, $\\epsilon_t = [0{,}005\\;\\; -0{,}004]^T$. Maka $r_t = [0{,}001 + 0{,}8(0{,}03) + 0{,}005\\;;\\; 0{,}002 + 1{,}2(0{,}03) - 0{,}004]^T = [0{,}030\\;;\\; 0{,}034]^T$. Baris ke-$i$: $r_{i,t} = \\alpha_i + \\sum_j [B]_{i,j}[f_t]_j + [\\epsilon_t]_i$ — return tiap aset = alpha + jumlah terbobot return faktor + noise spesifik.`,
      jebakan: `Empat jebakan dalam membaca persamaan ini — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `$m \\ll n$ itu esensi`, isi: `Bila $m \\approx n$, model tidak memampatkan apa-apa — esensinya adalah kompresi dependensi.`, nada: "jebakan" },
        { judul: `Independen total hanya untuk strict`, isi: `$\\epsilon_t$ independen dari faktor, tapi antar-$\\epsilon$ boleh berkorelasi lemah (model approximate, $\\Omega_\\epsilon$ sparse).`, nada: "jebakan" },
        { judul: `$r_t$ sudah minus risk-free`, isi: `Jangan kurangkan $r_f$ dua kali saat memakai persamaan ini.`, nada: "jebakan" },
        { judul: `Asumsi menopang (4.2)`, isi: `"Identically distributed atau slowly varying + $f_t \\perp \\epsilon_t$" menopang seluruh dekomposisi kovarians di bawah — bila dilanggar, (4.2) runtuh.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Dekomposisi kovarians — jantung pemodelan volatilitas`,
      ringkas: `Kovarians ribuan aset terbelah menjadi dua potong kecil: risiko faktor bersama dan risiko spesifik yang (hampir) diagonal.`,
      definisi: `Persamaan (4.2): $\\Omega_r = B\\Omega_f B^T + \\Omega_\\epsilon$, dengan $\\Omega_f := \\text{var}(f_t) \\in \\mathbb{R}^{m \\times m}$ dan $\\Omega_\\epsilon := \\text{var}(\\epsilon_t) \\in \\mathbb{R}^{n \\times n}$. Kovarians total = komponen sistematis + komponen idiosinkratis. "Dekomposisi ini adalah inti pemodelan volatilitas dengan return linier dan subjek Bab 6 dan 7."`,
      kenapa: `Inilah alasan model faktor "pas seperti sarung tangan" dengan optimasi mean-variance: matriks $n \\times n$ yang mustahil diestimasi langsung diganti dua matriks jauh lebih kecil ($m \\times m$ dan diagonal $n \\times n$). Konsekuensi portofolio langsung: $\\text{var}(w^Tr) = b^T\\Omega_f b + w^T\\Omega_\\epsilon w$ dengan $b := B^Tw$ (eksposur faktor portofolio) — varians portofolio terbelah rapi menjadi varians faktor + varians idiosinkratis.`,
      contoh: `Ilustrasi ($2 \\times 2$; $m=1$): $B=[1\\;\\;0{,}5]^T$, $\\Omega_f=[0{,}04]$, $\\Omega_\\epsilon=\\text{diag}(0{,}01, 0{,}02)$. Maka $B\\Omega_f B^T = 0{,}04 \\cdot [[1, 0{,}5],[0{,}5, 0{,}25]] = [[0{,}04, 0{,}02],[0{,}02, 0{,}01]]$; tambah $\\Omega_\\epsilon$ → $\\Omega_r = [[0{,}05, 0{,}02],[0{,}02, 0{,}03]]$. Kovarians antar-aset ($0{,}02$) seluruhnya datang dari faktor bersama — tanpa faktor, off-diagonalnya nol.`,
      jebakan: `Empat jebakan dalam membaca dekomposisi ini — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `$\\Omega_r$ tak bergantung $\\alpha$`, isi: `Intersep menggeser mean, bukan kovarians (FAQ 4.1).`, nada: "jebakan" },
        { judul: `Suku silang hilang karena asumsi`, isi: `$\\text{cov}(Bf_t, \\epsilon_t)$ nol karena $f_t \\perp \\epsilon_t$ — independensi ini asumsi, bukan teorema.`, nada: "jebakan" },
        { judul: `Diagonal $\\neq$ nol korelasi`, isi: `$\\Omega_\\epsilon$ diagonal $\\neq$ "tidak ada korelasi idiosinkratis sama sekali" — model approximate membolehkan sparse off-diagonal (Bab 6 mengisinya via thresholding).`, nada: "jebakan" },
        { judul: `Pakai eksposur, bukan bobot mentah`, isi: `Rumus portofolio memakai $b = B^Tw$ — eksposur, bukan bobot mentah; tertukar keduanya merusak dekomposisi.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Alpha spanned vs alpha orthogonal — alpha yang satu berharga, yang satu menipu`,
      ringkas: `Alpha yang tegak lurus faktor adalah diversifikasi murni — batas bawah Sharpe-nya meledak seiring jumlah aset, yang justru membuktikan ia langka di dunia nyata.`,
      definisi: `Tulis $\\alpha = B\\lambda + \\alpha_\\perp$ dengan $B^T\\alpha_\\perp = 0$ (proyeksi ke subruang kolom $B$ + komplemen ortogonal). Maka $r_t = \\alpha_\\perp + B(\\lambda + f_t) + \\epsilon_t$. Bagian $B\\lambda$ (alpha spanned) tak terbedakan secara matematis dari return ekspektasi faktor — buku menyerapnya: tetapkan $\\lambda = 0$, $\\mu_f := E[f_t]$. Sisanya, alpha orthogonal ($\\alpha_\\perp$), adalah return ekspektasi di luar jangkauan faktor.`,
      kenapa: `Inilah hasil teoretis paling tajam bab ini: alpha orthogonal murni terdiversifikasi. Ambil portofolio $w = \\alpha_\\perp / \\|\\alpha_\\perp\\|$ ("for a little prestige"); maka $E[w^Tr_t] = \\|\\alpha_\\perp\\|$ dan $\\text{var}(w^Tr_t) = \\alpha_\\perp^T\\Omega_\\epsilon\\alpha_\\perp / \\|\\alpha_\\perp\\|^2 \\le \\|\\Omega_\\epsilon\\|$ (norma operator = batas atas varians; untuk matriks diagonal = elemen diagonal terbesar). Dengan asumsi (i) varians idiosinkratis terbesar terbatas seragam terhadap $n$, dan (ii) rata-rata nilai absolut koordinat $\\alpha_\\perp$ terbatas di bawah oleh $\\mu > 0$, diperoleh batas bawah Sharpe Ratio (4.3). Bila batas-batas ini seragam untuk $n$ membesar → deretan Sharpe Ratio menuju tak hingga — "sangat tidak mungkin dalam kehidupan nyata", sehingga setidaknya satu asumsi pasti salah; karena model faktor dan varians hingga umumnya bertahan, kesimpulannya: return ekspektasi orthogonal idiosinkratis meluruh seiring $n$. Alpha yang tersisa di dunia nyata kebanyakan spanned — dan ia datang dengan risiko faktor yang tidak terdiversifikasi oleh $n$ besar (lihat Bab 5).`,
      contoh: `Ilustrasi simbolik (buku tanpa angka): misal $\\|\\Omega_\\epsilon\\| = 0{,}04$ (varians idiosinkratis maksimum 4%) dan $\\mu = 0{,}002$. Untuk $n = 1{.}000$: $\\text{SR} \\ge 1000 \\times 0{,}002 / 0{,}04 = 50$. Angka raksasa ini justru poinnya — ia reductio ad absurdum: SR tak hingga tidak ada di dunia nyata, jadi asumsi "$\\mu$ tetap positif saat $n \\to \\infty$" pasti runtuh. Kesimpulan buku: "alpha orthogonal sangat berharga: bila Anda punya ekspektasi alpha positif di level aset, Sharpe Ratio Anda naik seiring laju $n$"; tetapi "ada excess return, namun kemungkinan besar berasal dari alpha spanned".`,
      jebakan: `Empat jebakan dalam membaca batas (4.3) — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `SR di sini = mean / varians`, isi: `SR di sini = $E/\\text{var}$ (mean dibagi varians, bukan volatilitas) — ikuti definisi buku di penurunan ini, jangan tertukar dengan SR biasa.`, nada: "jebakan" },
        { judul: `Yang esensial: tumbuh seiring $n$`, isi: `Pertidaksamaan terakhir memakai versi buku (norma-1 vs norma Euclidean) — yang esensial: SR tumbuh seiring $n$, "laju tipikal saat Anda bisa mendiversifikasi risiko tanpa mengorbankan return".`, nada: "jebakan" },
        { judul: `$B^T\\alpha_\\perp = 0$ adalah konstruksi`, isi: `Ia proyeksi, bukan asumsi ekonomi.`, nada: "jebakan" },
        { judul: `Bukan resep SR tak hingga`, isi: `Jangan baca (4.3) sebagai "resep SR tak hingga" — baca sebagai bukti bahwa alpha orthogonal murni tidak bertahan di pasar besar.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Tiga interpretasi — satu model, tiga cara berpikir`,
      ringkas: `Model yang sama bisa dibaca sebagai jaringan, sebagai tumpukan vektor di ruang berdimensi rendah, atau sebagai perkalian titik untuk atribusi.`,
      definisi: `Tiga lensa untuk tiga pekerjaan — ketiganya identitas matematika yang sama:`,
      kenapa: `Tiga lensa untuk tiga pekerjaan: grafis untuk menjelaskan dependensi ke orang lain; superposisi untuk memahami mengapa cross-section berdimensi rendah (dan mengapa proyeksi/PCA bekerja); produk untuk atribusi — PnL portofolio = $b_t^T f_t + \\dots$ tak lain inner product eksposur × return faktor.`,
      contoh: `Model regional tipikal: sampai 10{.}000 aset, sampai 100 faktor — graf dengan 100 lingkaran, 10{.}000 kotak, dan panah-panah $B$ di antaranya. Superposisi: vektor return ekspektasi 10{.}000-dimensi seluruhnya tinggal di subruang 100-dimensi.`,
      jebakan: `(1) Ketiganya identitas matematika yang sama — bukan tiga model berbeda; jangan memilih "interpretasi favorit" seolah yang lain salah. (2) Superposisi bicara soal return ekspektasi bersyarat $E[r-\\alpha\\mid f]$, bukan realisasi $r_t$ (yang masih memuat $\\epsilon_t$). (3) Grafis $\\neq$ kausalitas — panah loadings adalah dependensi statistik, bukan klaim "faktor menyebabkan return".`,
      poin: [
        { judul: `Graphical model`, isi: `$E[r_i - \\alpha_i \\mid f] = \\sum_j [B]_{i,j}f_j$ — sedikit faktor (lingkaran) menentukan return ekspektasi banyak aset (kotak) lewat panah loadings; bila $B$ sparse, grafnya sparse.` },
        { judul: `Superposition of effects`, isi: `$E[r - \\alpha \\mid f] = \\sum_j [B]_{\\cdot,j} f_j$ — vektor return ekspektasi cross-section adalah superposisi sejumlah kecil vektor kolom loadings, terbobot return faktor; komponen faktor hidup di subruang kolom $B$ yang berdimensi rendah.` },
        { judul: `Single-asset / portfolio product`, isi: `Return ekspektasi satu aset = inner product antara loadings aset itu dan return faktor — fondasi atribusi kinerja portofolio.` },
      ],
    },
    {
      judul: `Transformasi: rotasi, proyeksi, push-out — operasi yang sah atas model`,
      ringkas: `Model boleh diputar tanpa mengubah isinya, dipangkas agar sederhana, atau diperluas saat residual memberontak — tiga operasi, tiga kebutuhan berbeda.`,
      definisi: `Tiga operasi sah atas model — dirinci satu per satu di bawah.`,
      kenapa: `Rotasi menjelaskan mengapa dua vendor bisa punya "model berbeda" dengan prediksi identik — pilih representasi yang paling mudah diinterpretasi/dikomunikasikan. Proyeksi adalah cara menyederhanakan model tanpa membuangnya. Push-out adalah cara memperluas model saat pasar berubah rezim.`,
      contoh: `Z-scoring loadings: setelah transformasi, loadings bermean nol dan varians satu (karena zero-mean, juga norma kuadrat satu) — pertanyaan "seberapa terekspos portofolio rata-rata terhadap faktor ini dalam basis standar?" langsung terjawab.`,
      jebakan: `Empat jebakan dalam memakai transformasi — dirinci di kartu bernomor di bawah.`,
      poin: [
        { judul: `Rotasi`, isi: `Untuk $C$ invertible $m \\times m$: $\\tilde{B} = BC^{-1}$, $\\tilde{f} = Cf$ (kovarians faktor bertransformasi $\\tilde{\\Omega}_f = C\\Omega_f C^T$) — return model identik: rotational indeterminacy. Contoh: identity covariance, orthonormal loadings, z-scored loadings.` },
        { judul: `Proyeksi`, isi: `$g = Hf$, $H := (A^TA)^{-1}A^TB$ ($A$: loadings model sederhana, $p < m$), meminimalkan $\\|Bf - Ag\\|_2$; $\\Omega_g = H\\Omega_f H^T$; aplikasi utama: mengatribusikan risiko/performa maksimum ke model nested.` },
        { judul: `Push-out`, isi: `$\\epsilon = Ag + \\eta$ — bila residual model lama masih terstruktur (dibangun di data historis yang tidak representatif terhadap rezim kini), angkat loadings ke matriks baru yang ruang kolomnya memuat ruang kolom lama.` },
        { judul: `Rotasi tak mengubah isi model`, isi: `Rotasi tidak mengubah prediksi return maupun risiko total — yang berubah hanya representasi; dekomposisi risiko per faktor bisa berubah (FAQ 4.4), jadi dokumentasikan rotasi yang dipakai.`, nada: "jebakan" },
        { judul: `$H^2 = H$ tak terdefinisi`, isi: `$H$ berukuran $p \\times m$ — jangan tulis $H^2 = H$; "idempoten" di buku adalah analogi geometri, bukan persamaan matriks.`, nada: "jebakan" },
        { judul: `Push-out bukan overfitting`, isi: `Push-out menambah faktor karena residual terstruktur — menambah faktor tanpa alasan = overfitting berkedok penyempurnaan.`, nada: "jebakan" },
        { judul: `Intuisi bobot WLS`, isi: `WLS memakai bobot $\\Omega_\\epsilon^{-1}$: aset bervarians idiosinkratis besar otomatis dibobot lebih kecil — intuisi yang terpakai lagi di Bab 6 ($\\hat{f}_t = (B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}B_t^T\\Omega_\\epsilon^{-1}r_t$).`, nada: "jebakan" },
      ],
    },
    {
      judul: `Aplikasi: atribusi PnL, dekomposisi varians, MCR — dari teori ke meja trading`,
      ringkas: `PnL diatribusikan ke faktor vs idiosinkratis, varians dipecah per grup, dan MCR memberi tahu grup mana yang layak diperbesar.`,
      definisi: `Tiga aplikasi kuantitatif bab ini — dirinci satu per satu di bawah (plus konstruksi portofolio & riset alpha).`,
      kenapa: `Inilah "uangnya": atribusi menjawab "dari mana PnL berasal" (faktor gaya? industri? negara? atau idiosinkratis?); dekomposisi varians menjawab "dari mana risiko berasal"; MCR + sensitivitas SR menjawab "grup mana yang pantas ditambah/dikurangi". Konstruksi portofolio (aplikasi ke-3) membutuhkan $\\Omega_r$ dan inversnya (precision matrix) sebagai input optimasi mean-variance; riset alpha (ke-4) memakai model untuk memisahkan eksposur faktor dari true alpha.`,
      contoh: `Percentage of idiosyncratic variance: bila varians idiosinkratis dolar = 30 dan varians total = 100, statistiknya 30% — 70% sisanya risiko faktor. Partisi faktor bisa sangat rinci (tiap faktor singleton) atau kasar (style/industri/negara).`,
      jebakan: `Empat jebakan dalam memakai aplikasi — dirinci di kartu bernomor di bawah.`,
      poin: [
        { judul: `Atribusi PnL`, isi: `$\\text{PnL} = \\sum_t \\sum_j (\\text{kontribusi faktor } j) =$ PnL faktor + PnL idiosinkratis, dengan $\\text{PnL}_t = b_t^T f_t + w_t^T(\\alpha_\\perp + \\epsilon_t)$ dan $b_t = B^Tw_t$ eksposur faktor.` },
        { judul: `Dekomposisi varians`, isi: `$\\text{var}(w^Tr) = b^T\\Omega_f b + w^T\\Omega_\\epsilon w$ — dua kegunaan: estimasi vol ex-ante portofolio kapan pun (informasi vital manajer risiko), dan dekomposisi varians faktor vs idiosinkratis.` },
        { judul: `MCR & sensitivitas SR`, isi: `$m_i := \\left.\\frac{\\partial}{\\partial(x_i v_i)}\\text{vol}(\\text{PnL})\\right|_{x=e} = \\rho_i$; fraksi varians grup $p_i = \\beta_i$ ($\\sum_i p_i = 1$); sensitivitas Sharpe: $\\frac{\\partial}{\\partial(v_i x_i)}\\frac{E(\\text{PnL})}{\\text{vol}(\\text{PnL})} = \\frac{\\text{SR}_{\\text{TOT}}}{v_{\\text{TOT}}}\\left(\\frac{\\text{SR}_i}{\\text{SR}_{\\text{TOT}}} - m_i\\right)$ — kontribusi grup ke SR total positif bila $\\text{SR}_i$ melampaui ambang $m_i \\cdot \\text{SR}_{\\text{TOT}}$.` },
        { judul: `Pakai eksposur, bukan bobot mentah`, isi: `$b_t^T f_t$ memakai $b_t = B^Tw_t$ — eksposur adalah karakteristik terbobot holding (karakteristik dan bobot bisa negatif); jangan pakai bobot mentah.`, nada: "jebakan" },
        { judul: `MCR = turunan terhadap skala vol`, isi: `MCR adalah turunan terhadap $(x_i v_i)$ — skala vol, bukan terhadap bobot $x_i$ saja; salah variabel = salah interpretasi "marginal".`, nada: "jebakan" },
        { judul: `Ambang SR bisa menolak SR positif`, isi: `Ambang keputusan SR memakai $m_i \\cdot \\text{SR}_{\\text{TOT}}$ — grup dengan SR di bawah ambang merusak SR total meski SR-nya positif.`, nada: "jebakan" },
        { judul: `Precision matrix diuji di Bab 5`, isi: `Precision matrix $\\Omega_r^{-1}$ krusial untuk optimasi — akurasinya diuji tersendiri di Bab 5 (bukan sekadar "kovarians yang bagus").`, nada: "jebakan" },
      ],
    },
  ],
  cheatsheet: `Cheatsheet Bab

> Satu halaman ringkas — cetak dan tempel. Semua definisi & hubungan dari Bab 4.

### Model faktor (4.1)
- $r_t = \\alpha + Bf_t + \\epsilon_t$ · $r_t \\in \\mathbb{R}^n$ return minus risk-free · $\\alpha \\in \\mathbb{R}^n$ alpha · $B \\in \\mathbb{R}^{n \\times m}$ loadings ($[B]_{i,j}$ sensitivitas aset $i$ ke faktor $j$) · $f_t \\in \\mathbb{R}^m$ return faktor ($m \\ll n$) · $\\epsilon_t$: $E[\\epsilon_t]=0$, $\\Omega_\\epsilon$ diagonal (strict)/sparse (approximate), $\\perp f_s\\ \\forall s$
- Sistematis $= Bf_t$ · idiosinkratis $= \\epsilon_t$ · asumsi: $(f_t, \\epsilon_t)$ iid atau slowly varying

### Kovarians (4.2)
- $\\Omega_r = B\\Omega_f B^T + \\Omega_\\epsilon$ (tak bergantung $\\alpha$; suku silang nol karena independensi)
- Portofolio: $\\text{var}(w^Tr) = b^T\\Omega_f b + w^T\\Omega_\\epsilon w$, $b := B^Tw$

### Alpha (4.3)
- $\\alpha = B\\lambda + \\alpha_\\perp$, $B^T\\alpha_\\perp = 0$ · spanned diserap ke $\\mu_f := E[f_t]$ ($\\lambda = 0$)
- $w = \\alpha_\\perp/\\|\\alpha_\\perp\\|$: $E[w^Tr_t] = \\|\\alpha_\\perp\\|$, $\\text{var} \\le \\|\\Omega_\\epsilon\\|$
- $\\text{SR} \\ge \\|\\alpha_\\perp\\|/\\|\\Omega_\\epsilon\\| \\ge n\\mu/\\|\\Omega_\\epsilon\\|$ · SR tumbuh seiring laju $n$ → alpha orthogonal murni langka di dunia nyata

### Interpretasi
- Grafis: $E[r_i - \\alpha_i \\mid f] = \\sum_j [B]_{i,j}f_j$ · Superposisi: $E[r-\\alpha\\mid f] = \\sum_j [B]_{\\cdot,j}f_j$ (cross-section di subruang kolom $B$) · Produk: return ekspektasi = inner product loadings × return faktor

### Transformasi
- Rotasi: $\\tilde{B} = BC^{-1}$, $\\tilde{f} = Cf$, $\\tilde{\\Omega}_f = C\\Omega_f C^T$ — prediksi & risiko total tak berubah
- Proyeksi: $g = Hf$, $H = (A^TA)^{-1}A^TB$, $\\Omega_g = H\\Omega_f H^T$ — pangkas ke $p < m$ faktor
- Push-out: $\\epsilon = Ag + \\eta$ — tambah faktor saat residual terstruktur

### Aplikasi
- Atribusi: $\\text{PnL}_t = b_t^T f_t + w_t^T(\\alpha_\\perp + \\epsilon_t)$
- MCR: $m_i = \\left.\\frac{\\partial\\,\\text{vol}}{\\partial(x_i v_i)}\\right|_{x=e} = \\rho_i$ · $p_i = \\beta_i$ (fraksi varians grup) · sensitivitas SR $= \\frac{\\text{SR}_{\\text{TOT}}}{v_{\\text{TOT}}}\\left(\\frac{\\text{SR}_i}{\\text{SR}_{\\text{TOT}}} - m_i\\right)$
- Konstruksi portofolio butuh $\\Omega_r$ dan $\\Omega_r^{-1}$ (precision matrix)

### Angka jangkar
- Model regional tipikal: sampai 10{.}000 aset, sampai 100 faktor
---`,
  prediksi: [
    {
      id: "P1",
      pertanyaan: `Persamaan model faktor memisahkan return menjadi $Bf_t$ (sistematis) dan $\\epsilon_t$ (idiosinkratis). Menurutmu, komponen mana yang risikonya bisa "dihilangkan" dengan menambah jumlah aset, dan kenapa?`,
      kunci: `Komponen idiosinkratis ($\\epsilon_t$): karena $\\Omega_\\epsilon$ (hampir) diagonal, risiko spesifik tiap aset saling meniadakan saat diagregasi — variansnya menyusut seiring $n$. Risiko sistematis ($Bf_t$) tidak: ia pervasif, mengguncang semua aset sekaligus (inilah "alpha spanned datang dengan risiko yang tidak terdiversifikasi oleh $n$ besar").`,
    },
    {
      id: "P2",
      pertanyaan: `Dua vendor model risiko mengklaim modelnya "berbeda" — loadings dan return faktornya tidak sama — tetapi prediksi return dan risikonya identik. Mungkinkah itu? Jelaskan mekanismenya.`,
      kunci: `Mungkin — rotational indeterminacy: untuk matriks invertible $C$, $\\tilde{B} = BC^{-1}$ dan $\\tilde{f} = Cf$ menghasilkan model dengan return dan risiko total yang identik. Yang berbeda hanya representasinya (mis. orthonormal loadings vs z-scored loadings).`,
    },
    {
      id: "P3",
      pertanyaan: `Seorang manajer portofolio menemukan strategi dengan Sharpe Ratio sangat tinggi yang returnnya tidak berkorelasi dengan faktor apa pun (murni alpha orthogonal). Menurut logika bab ini, apa yang "seharusnya" terjadi pada alpha semacam itu saat banyak investor mengetahuinya dan semesta aset membesar?`,
      kunci: `Ia seharusnya meluruh: batas (4.3) menunjukkan SR alpha orthogonal tumbuh seiring $n$, yang "sangat tidak mungkin dalam kehidupan nyata" — jadi setidaknya satu asumsi pasti salah, dan yang paling mungkin runtuh adalah $\\mu > 0$ (rata-rata alpha orthogonal per aset menuju nol). Alpha murni yang diketahui banyak orang akan terarbitrase habis.`,
    },
  ],
  kuis: [
    {
      pertanyaan: `Dalam persamaan $r_t = \\alpha + Bf_t + \\epsilon_t$, pernyataan yang BENAR adalah …`,
      opsi: [
        `A. $m$ (jumlah faktor) biasanya jauh lebih besar dari $n$ (jumlah aset)`,
        `B. $\\epsilon_t$ diasumsikan independen dari $f_s$ untuk semua $s$, dengan $E[\\epsilon_t] = 0$`,
        `C. $r_t$ adalah return kotor sebelum dikurangi risk-free rate`,
        `D. $[B]_{i,j}$ adalah return faktor $j$ pada periode $i$`,
      ],
      benar: 1,
      penjelasan: `$m \\ll n$ (A terbalik); $r_t$ sudah minus risk-free (C salah); $[B]_{i,j}$ = sensitivitas/loading, bukan return faktor (D salah).`,
    },
    {
      pertanyaan: `Dekomposisi $\\Omega_r = B\\Omega_f B^T + \\Omega_\\epsilon$ berlaku karena …`,
      opsi: [
        `A. $\\alpha$ berkorelasi sempurna dengan $Bf_t$`,
        `B. $Bf_t$ dan $\\epsilon_t$ independen sehingga suku silang kovariansnya nol (dan $\\Omega_r$ tak bergantung $\\alpha$)`,
        `C. $\\Omega_\\epsilon$ selalu matriks identitas`,
        `D. $m$ sama dengan $n$`,
      ],
      benar: 1,
      penjelasan: `independensi $Bf_t \\perp \\epsilon_t$ mematikan suku silang; $\\alpha$ hanya menggeser mean (FAQ 4.1). C salah: $\\Omega_\\epsilon$ diagonal/sparse, bukan identitas.`,
    },
    {
      pertanyaan: `Alpha spanned ($B\\lambda$) …`,
      opsi: [
        `A. adalah diversifikasi murni yang meningkatkan Sharpe Ratio seiring $n$`,
        `B. tak terbedakan secara matematis dari return ekspektasi faktor, sehingga diserap ke $\\mu_f := E[f_t]$`,
        `C. memenuhi $B^T\\alpha_\\perp = 0$`,
        `D. selalu bernilai nol di semua model`,
      ],
      benar: 1,
      penjelasan: `definisi alpha spanned; A menjelaskan alpha orthogonal; C adalah definisi $\\alpha_\\perp$, bukan spanned.`,
    },
    {
      pertanyaan: `Batas bawah Sharpe Ratio untuk strategi alpha orthogonal adalah …`,
      opsi: [
        `A. $\\text{SR} \\ge \\|\\alpha_\\perp\\| / \\|\\Omega_\\epsilon\\| \\ge n\\mu / \\|\\Omega_\\epsilon\\|$ — tumbuh seiring laju $n$`,
        `B. $\\text{SR} \\ge \\sqrt{n}\\,\\mu / \\|\\Omega_\\epsilon\\|$ — tumbuh seiring akar $n$`,
        `C. $\\text{SR} \\le \\|\\alpha_\\perp\\| / \\|\\Omega_\\epsilon\\|$ — batas atas, bukan batas bawah`,
        `D. $\\text{SR} = \\|\\alpha_\\perp\\|$ — tidak melibatkan risiko idiosinkratis`,
      ],
      benar: 0,
      penjelasan: `persis persamaan (4.3) teks bab: $\\text{SR} \\ge \\|\\alpha_\\perp\\|/\\|\\Omega_\\epsilon\\| \\ge n\\mu/\\|\\Omega_\\epsilon\\|$, "meningkat pada laju $n$". **Jebakan Gemini yang tertangkap:** ringkasan menulis $\\sqrt{n}\\,\\mu$ (opsi B) — teks bab jelas $n\\mu$ dan merangkumnya sebagai "increases at the rate $n$".`,
    },
    {
      pertanyaan: `Rotational indeterminacy artinya …`,
      opsi: [
        `A. model faktor tidak bisa diestimasi sama sekali`,
        `B. $\\tilde{B} = BC^{-1}$, $\\tilde{f} = Cf$ menghasilkan prediksi return dan risiko total yang identik`,
        `C. rotasi mengubah total varians portofolio`,
        `D. hanya berlaku untuk model dengan $m = 1$`,
      ],
      benar: 1,
      penjelasan: `definisi rotasi: representasi berubah, prediksi & risiko total tetap.`,
    },
    {
      pertanyaan: `Proyeksi model ($g = Hf$, $H = (A^TA)^{-1}A^TB$) digunakan terutama untuk …`,
      opsi: [
        `A. menambah jumlah faktor saat residual terstruktur`,
        `B. mengatribusikan risiko/performa maksimum ke model nested yang lebih sederhana ($p < m$ faktor)`,
        `C. menghitung Sharpe Ratio portofolio`,
        `D. mengestimasi $\\Omega_\\epsilon$ yang diagonal`,
      ],
      benar: 1,
      penjelasan: `aplikasi utama proyeksi (FAQ 4.3): atribusi maksimum ke model nested yang lebih sederhana. A adalah push-out.`,
    },
    {
      pertanyaan: `Dalam atribusi PnL, $b_t^T f_t$ adalah …`,
      opsi: [
        `A. PnL idiosinkratis portofolio`,
        `B. PnL yang disumbangkan komponen faktor risiko, dengan $b_t = B^Tw_t$ eksposur faktor`,
        `C. total varians portofolio`,
        `D. alpha orthogonal yang belum terealisasi`,
      ],
      benar: 1,
      penjelasan: `PnL faktor; PnL idiosinkratis adalah $w_t^T(\\alpha_\\perp + \\epsilon_t)$.`,
    },
    {
      pertanyaan: `Estimator WLS $\\hat{\\beta} = (X^T\\Omega_\\epsilon^{-1}X)^{-1}X^T\\Omega_\\epsilon^{-1}y$ membobot observasi dengan $\\Omega_\\epsilon^{-1}$ karena …`,
      opsi: [
        `A. aset bervarians idiosinkratis besar harus dibobot lebih kecil (data berisik dipercaya lebih sedikit)`,
        `B. semua aset harus dibobot sama tanpa kecuali`,
        `C. $\\Omega_\\epsilon$ tidak pernah diketahui sehingga bobotnya arbitrer`,
        `D. WLS identik dengan OLS dalam segala kondisi`,
      ],
      benar: 0,
      penjelasan: `intuisi WLS: varians besar → informasi kecil → bobot kecil. Diperoleh via pemutihan $\\Omega_\\epsilon^{-1/2}$ + OLS; di Bab 6 dipakai untuk mengekstrak $\\hat{f}_t$.`,
    },
  ],
  fsrs: [
    { depan: `Tulis persamaan (4.1) model faktor dan arti tiap simbol.`, belakang: `$r_t = \\alpha + Bf_t + \\epsilon_t$; $r_t$ return $n$ aset minus risk-free; $\\alpha$ vektor alpha; $B$ loadings $n \\times m$; $f_t$ return $m$ faktor ($m \\ll n$); $\\epsilon_t$ idiosinkratis, $E[\\epsilon_t]=0$, $\\Omega_\\epsilon$ diagonal/sparse, independen dari faktor.` },
    { depan: `Tulis dekomposisi kovarians (4.2) dan dua asumsi yang membuatnya berlaku.`, belakang: `$\\Omega_r = B\\Omega_f B^T + \\Omega_\\epsilon$; berlaku karena (1) $f_t \\perp \\epsilon_t$ (suku silang nol), (2) $\\Omega_r$ tak bergantung $\\alpha$.` },
    { depan: `Dekomposisi alpha menjadi spanned vs orthogonal + syarat ortogonalitas.`, belakang: `$\\alpha = B\\lambda + \\alpha_\\perp$, $B^T\\alpha_\\perp = 0$; spanned ($B\\lambda$) diserap ke $\\mu_f = E[f_t]$; orthogonal = diversifikasi murni.` },
    { depan: `Batas bawah Sharpe Ratio alpha orthogonal (4.3).`, belakang: `$w = \\alpha_\\perp/\\|\\alpha_\\perp\\|$; $\\text{SR} \\ge \\|\\alpha_\\perp\\|/\\|\\Omega_\\epsilon\\| \\ge n\\mu/\\|\\Omega_\\epsilon\\|$ — tumbuh seiring laju $n$ (bukan akar $n$!).` },
    { depan: `Tiga interpretasi model faktor.`, belakang: `(1) graphical model — faktor → return via loadings; (2) superposition — $E[r-\\alpha\\mid f] = \\sum_j [B]_{\\cdot,j}f_j$, cross-section di subruang kolom $B$; (3) single-asset product — return ekspektasi = inner product loadings × return faktor.` },
    { depan: `Tiga transformasi model faktor + rumusnya.`, belakang: `Rotasi $\\tilde{B} = BC^{-1}$, $\\tilde{f} = Cf$ (prediksi tak berubah); proyeksi $g = Hf$, $H = (A^TA)^{-1}A^TB$ (pangkas faktor); push-out $\\epsilon = Ag + \\eta$ (tambah faktor saat residual terstruktur).` },
    { depan: `Rumus atribusi PnL dan arti tiap suku.`, belakang: `$\\text{PnL}_t = b_t^T f_t + w_t^T(\\alpha_\\perp + \\epsilon_t)$; $b_t = B^Tw_t$ eksposur faktor; suku pertama = PnL faktor, kedua = PnL idiosinkratis.` },
    { depan: `Dekomposisi varians portofolio + statistik "percentage of idiosyncratic variance".`, belakang: `$\\text{var}(w^Tr) = b^T\\Omega_f b + w^T\\Omega_\\epsilon w$; statistik = 100 × (varians idiosinkratis dolar)/(varians total).` },
    { depan: `Definisi MCR dan kapan kontribusi grup ke SR total positif.`, belakang: `$m_i$ = perubahan vol portofolio per 1 juta dolar vol grup $i$; kontribusi positif bila $\\text{SR}_i > m_i \\cdot \\text{SR}_{\\text{TOT}}$.` },
    { depan: `Rumus WLS (appendix 4.16) dan intuisinya.`, belakang: `$\\hat{\\beta} = (X^T\\Omega_\\epsilon^{-1}X)^{-1}X^T\\Omega_\\epsilon^{-1}y$; bobot $\\Omega_\\epsilon^{-1}$ = percaya lebih sedikit pada data berisik (diperoleh via pemutihan + OLS).` },
  ],
  feynman: [
    {
      poin: `Persamaan (4.1) + legenda lima simbol`,
      penajaman: `kalau ditanya "kenapa $m \\ll n$ itu esensi dan apa isi $[B]_{i,j}$?", harus bisa jawab: tanpa $m \\ll n$ tidak ada kompresi dependensi; $[B]_{i,j}$ = sensitivitas aset $i$ terhadap faktor $j$.`,
    },
    {
      poin: `Dekomposisi (4.2) + mengapa suku silang hilang`,
      penajaman: `kalau ditanya "kenapa $\\Omega_r$ tak bergantung $\\alpha$?", harus bisa jawab: $\\alpha$ hanya menggeser mean; suku silang nol karena $f_t \\perp \\epsilon_t$ (asumsi, bukan teorema).`,
    },
    {
      poin: `Alpha spanned vs orthogonal + batas (4.3)`,
      penajaman: `kalau ditanya "SR tumbuh seiring apa dan apa kesimpulan reductio-nya?", harus bisa jawab: tumbuh seiring laju $n$ (bukan akar $n$); karena SR tak hingga mustahil, alpha orthogonal murni pasti meluruh — alpha dunia nyata kebanyakan spanned.`,
    },
    {
      poin: `Tiga interpretasi tanpa mencampurnya`,
      penajaman: `kalau ditanya "superposisi bicara soal ekspektasi atau realisasi?", harus bisa jawab: $E[r-\\alpha\\mid f]$ — realisasi masih memuat $\\epsilon_t$.`,
    },
    {
      poin: `Rotasi vs proyeksi vs push-out`,
      penajaman: `kalau ditanya "kapan menambah faktor dan kapan memangkas?", harus bisa jawab: push-out saat residual terstruktur (rezim berubah); proyeksi untuk model nested yang lebih sederhana; rotasi tidak mengubah isi model sama sekali.`,
    },
    {
      poin: `Atribusi PnL + dekomposisi varians + MCR`,
      penajaman: `kalau ditanya "grup dengan SR positif tapi di bawah $m_i \\cdot \\text{SR}_{\\text{TOT}}$ diapakan?", harus bisa jawab: dikurangi — ia merusak SR total.`,
    },
    {
      poin: `Tiga tipe model faktor`,
      penajaman: `kalau ditanya "apa primitif tiap tipe?", harus bisa jawab: characteristic ($r_t$, $B_t$), statistical (hanya $r_t$), macroeconomic ($r_t$, $f_t$).`,
    },
    {
      poin: `WLS dan intuisi bobotnya`,
      penajaman: `kalau ditanya "kenapa bobotnya $\\Omega_\\epsilon^{-1}$?", harus bisa jawab: varians besar = informasi kecil = bobot kecil; hasil pemutihan + OLS.`,
    },
  ],
  rumus: [
    {
      id: `bab4-model`,
      judul: `Persamaan model faktor (4.1) + legenda variabel`,
      latex: `r_t = \\alpha + Bf_t + \\epsilon_t`,
      variabel: [
        { simbol: `r_t \\in \\mathbb{R}^n`, arti: `return $n$ aset minus risk-free rate pada periode $t$` },
        { simbol: `\\alpha \\in \\mathbb{R}^n`, arti: `vektor alpha (intersep return ekspektasi)` },
        { simbol: `B \\in \\mathbb{R}^{n \\times m}`, arti: `matriks loadings; $[B]_{i,j}$ = loading aset $i$ terhadap faktor $j$` },
        { simbol: `f_t \\in \\mathbb{R}^m`, arti: `return $m$ faktor — sumber ketidakpastian pervasif di pasar ($m \\ll n$)` },
        { simbol: `\\epsilon_t \\in \\mathbb{R}^n`, arti: `return idiosinkratis; $E[\\epsilon_t]=0$; $\\Omega_\\epsilon := \\text{var}(\\epsilon_t)$ diagonal/sparse; independen dari $f_s\\ \\forall s$` },
      ],
      langkah: [
        `Ilustrasi ($n=2$, $m=1$; buku tanpa angka): $B = [0{,}8\\;\\; 1{,}2]^T$, $f_t = 0{,}03$, $\\alpha = [0{,}001\\;\\; 0{,}002]^T$, $\\epsilon_t = [0{,}005\\;\\; -0{,}004]^T$`,
        `$r_t = [0{,}001 + 0{,}8(0{,}03) + 0{,}005\\;;\\; 0{,}002 + 1{,}2(0{,}03) - 0{,}004]^T$`,
        `$= [0{,}001 + 0{,}024 + 0{,}005\\;;\\; 0{,}002 + 0{,}036 - 0{,}004]^T$`,
      ],
      hasil: `**$r_t = [0{,}030\\;;\\; 0{,}034]^T$** — tiap baris: $r_{i,t} = \\alpha_i + \\sum_j [B]_{i,j}[f_t]_j + [\\epsilon_t]_i$.`,
      jebakan: `$m \\ll n$ itu esensi, bukan detail — bila $m \\approx n$, model tidak memampatkan apa-apa. Dan $r_t$ sudah minus risk-free: jangan kurangkan $r_f$ dua kali.`,
    },
    {
      id: `bab4-kovarians`,
      judul: `Dekomposisi kovarians (4.2)`,
      latex: `\\Omega_r = B\\Omega_f B^T + \\Omega_\\epsilon`,
      variabel: [
        { simbol: `\\Omega_r \\in \\mathbb{R}^{n \\times n}`, arti: `matriks kovarians total return aset` },
        { simbol: `B\\Omega_f B^T`, arti: `komponen kovarians sistematis (faktor)` },
        { simbol: `\\Omega_f \\in \\mathbb{R}^{m \\times m}`, arti: `kovarians return faktor` },
        { simbol: `\\Omega_\\epsilon \\in \\mathbb{R}^{n \\times n}`, arti: `kovarians idiosinkratis — diagonal (strict) atau sparse (approximate)` },
      ],
      langkah: [
        `Ilustrasi ($2 \\times 2$; $m=1$): $B=[1\\;\\;0{,}5]^T$, $\\Omega_f=[0{,}04]$, $\\Omega_\\epsilon=\\text{diag}(0{,}01, 0{,}02)$`,
        `$B\\Omega_f B^T = 0{,}04 \\cdot [[1, 0{,}5],[0{,}5, 0{,}25]] = [[0{,}04, 0{,}02],[0{,}02, 0{,}01]]$`,
        `Tambah $\\Omega_\\epsilon$: $\\Omega_r = [[0{,}04+0{,}01,\\; 0{,}02],[0{,}02,\\; 0{,}01+0{,}02]]$`,
      ],
      hasil: `**$\\Omega_r = [[0{,}05, 0{,}02],[0{,}02, 0{,}03]]$** — kovarians antar-aset ($0{,}02$) seluruhnya datang dari faktor bersama.`,
      jebakan: `$\\Omega_r$ tidak bergantung pada $\\alpha$ — intersep menggeser mean, bukan kovarians. Suku silang hilang karena $f_t \\perp \\epsilon_t$ (asumsi, bukan teorema).`,
    },
    {
      id: `bab4-srbound`,
      judul: `Batas bawah Sharpe Ratio alpha orthogonal (4.3)`,
      latex: `\\text{SR} \\ge \\frac{\\|\\alpha_\\perp\\|}{\\|\\Omega_\\epsilon\\|} \\ge \\frac{n\\mu}{\\|\\Omega_\\epsilon\\|}`,
      variabel: [
        { simbol: `w = \\alpha_\\perp/\\|\\alpha_\\perp\\|`, arti: `portofolio proporsional terhadap vektor alpha orthogonal` },
        { simbol: `\\|\\alpha_\\perp\\|`, arti: `norma Euclidean vektor alpha orthogonal (= return ekspektasi portofolio $w$)` },
        { simbol: `\\|\\Omega_\\epsilon\\|`, arti: `norma operator kovarians idiosinkratis (batas atas varians idiosinkratis; untuk matriks diagonal = elemen diagonal terbesar)` },
        { simbol: `n`, arti: `jumlah aset di semesta investasi` },
        { simbol: `\\mu > 0`, arti: `$\\frac{1}{n}\\sum_i \\|[\\alpha_\\perp\\]_i\\| =: \\mu$ — rata-rata nilai absolut alpha orthogonal per aset` },
      ],
      langkah: [
        `Ilustrasi simbolik (buku tanpa angka): $\\|\\Omega_\\epsilon\\| = 0{,}04$, $\\mu = 0{,}002$, $n = 1{.}000$`,
        `$\\text{SR} \\ge n\\mu / \\|\\Omega_\\epsilon\\| = 1000 \\times 0{,}002 / 0{,}04$`,
        `$= 2 / 0{,}04 = 50$`,
      ],
      hasil: `**$\\text{SR} \\ge 50$** — angka raksasa ini justru poinnya: ia reductio ad absurdum. SR tak hingga tidak ada di dunia nyata, jadi asumsi "$\\mu$ tetap positif saat $n \\to \\infty$" pasti runtuh.`,
      jebakan: `SR di sini = $E/\\text{var}$ (mean dibagi varians, bukan volatilitas) — ikuti definisi buku. Dan laju pertumbuhannya $n$, BUKAN $\\sqrt{n}$ (jebakan Gemini yang tertangkap di ringkasan).`,
    },
  ],
  // Tata letak v2: baris-1 diberi celah di x=750 agar edge eq→idio dan
  // B→sys tidak menembus simpul; push-out digantung di bawah proyeksi
  // ("kebalikannya" — pack: push-out = kebalikan proyeksi).
  // Edge eq→rot dirutekan via kanan kovarians. Pola addendum LAPORAN_POLES_G1.md.
  peta: {
    nodes: [
      { id: `eq`, label: `Persamaan (4.1)`, x: 150, y: 80, konsepId: 0 },
      { id: `sys`, label: `Sistematis Bf`, x: 450, y: 80, konsepId: 1 },
      { id: `B`, label: `Loadings B`, x: 1050, y: 80, konsepId: 3 },
      { id: `tipe`, label: `Tiga tipe model`, x: 1350, y: 80, konsepId: 11 },
      { id: `cov`, label: `Dekomposisi kovarians`, x: 150, y: 320, konsepId: 10 },
      { id: `aspan`, label: `Alpha spanned`, x: 450, y: 320, konsepId: 4 },
      { id: `aort`, label: `Alpha orthogonal`, x: 750, y: 320, konsepId: 5 },
      { id: `idio`, label: `Idiosinkratis ε`, x: 1050, y: 320, konsepId: 2 },
      { id: `rot`, label: `Rotasi`, x: 150, y: 560, konsepId: 6 },
      { id: `proj`, label: `Proyeksi`, x: 450, y: 560, konsepId: 7 },
      { id: `push`, label: `Push-out`, x: 750, y: 560, konsepId: 8 },
      { id: `app`, label: `Aplikasi praktis`, x: 1050, y: 560, konsepId: 9 },
    ],
    edges: [
      { from: `eq`, to: `sys`, label: `komponen Bf_t` },
      { from: `eq`, to: `idio`, label: `komponen ε_t` },
      { from: `B`, to: `sys`, label: `menimbang faktor` },
      { from: `eq`, to: `cov`, label: `turun ke Ω_r` },
      { from: `eq`, to: `aspan`, label: `α jadi Bλ` },
      { from: `eq`, to: `aort`, label: `α jadi α⊥` },
      { from: `eq`, to: `tipe`, label: `arti simbol berganti` },
      { from: `eq`, to: `rot`, label: `diputar`, via: [{ x: 975, y: 450 }] },
      { from: `eq`, to: `proj`, label: `dipangkas` },
      { from: `proj`, to: `push`, label: `kebalikannya` },
      { from: `cov`, to: `app`, label: `atribusi & risiko` },
      { from: `aort`, to: `app`, label: `SR naik seiring n` },
    ],
  },
};
