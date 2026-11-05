import type { ChapterPack } from "./bedahbuku";

export const PACK6: ChapterPack = {
  slug: "bab-6",
  bab: 6,
  judul: `Fundamental Factor Models`,
  catatan: `bab "cara membuat" model faktor karakteristik — dari data mentah vendor sampai matriks kovarians yang siap produksi. Praktisi industri (MSCI Barra, Axioma) menyempurnakannya sejak pertengahan 1970-an; akarnya di Arbitrage Pricing Theory (Ross, 1976) dan model tiga faktor Fama–French (1993).`,
  ideBesar: `model faktor fundamental menjawab pertanyaan Bab 4 yang belum terjawab — "dari mana $B_t$, $f_t$, $\\epsilon_t$ berasal?" Jawabannya: karakteristik perusahaan yang teramati (ukuran, valuasi, industri, negara) menjadi loadings $B_t$; return faktor $f_t$ dan residual $\\epsilon_t$ diekstrak tiap periode lewat regresi cross-sectional weighted least squares dengan bobot $\\Omega_\\epsilon^{-1}$; lalu kovarians deret-waktunya diestimasi dengan tiga koreksi wajib: (1) estimasi return faktor menggelembungkan varians — koreksi bias $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$ + shrinkage Ledoit–Wolf; (2) autokorelasi — Newey–West; (3) shock volatilitas mendadak — STVU. Di sekeliling mesin ini ada pekerjaan "seni gelap": memilih estimation universe yang likuid, winsorizing return ekstrem (dengan peringatan keras), menangani loadings yang rank-deficient, dan mengisi off-diagonal idiosinkratis via correlation thresholding — plus dua topik lanjutan: currency rebasing dan faktor gaya (style) seperti liquidity/Amihud.`,
  diagram: `ENAM LANGKAH ESTIMASI (6.1.2)
data ingestion → estimation universe → winsorization → loadings generation
→ cross-sectional regression → time-series covariance estimation
  kriteria universe: tradeability · data quality (price discovery) · relevance
  winsorize: robust z-score d_{i,t}, threshold 5–10 (trial-and-error)

MESIN INTI
(6.1)  r_t = B_t f_t + ϵ_t                        ← regresi cross-sectional
WLS    f̂_t = (B_tᵀΩ_ϵ⁻¹B_t)⁻¹B_tᵀΩ_ϵ⁻¹r_t        ← bobot = presisi idiosinkratis
(6.5)  var(f̂_t) = Ω_f + (BᵀΩ_ϵ⁻¹B)⁻¹              ← estimasi MENGGEMBUNGKAN varians
(6.6)  Ω̂_f = var(f̂_t) − (BᵀΩ_ϵ⁻¹B)⁻¹             ← koreksi bias
shrink Ω_{f,shrink}(ρ) = (1−ρ)Ω̂_f + ρ·(tr Ω̂_f/m)·I_m   ← Ledoit–Wolf

TIGA KOREKSI DERET-WAKTU
autokorelasi → Newey–West: Ω̂_f = C_0 + Σ(1−l/(1+l_max))(C_l + C_lᵀ)
vol shock → STVU: state laten x_t, half-life 10–20 hari (model harian)
heteroskedastisitas → WLS (sudah di mesin inti)

PEKERJAAN SENI GELAP
rank-deficient B (country + semua industri) → buang redundansi / ridge / side constraints
off-diagonal idio → thresholding: thres_λ(ρ) = ρ·1_{|ρ|>λ}, λ = K·log n/T
  contoh: BRK.A vs BRK.B; saham-A/B/H China → lebih baik tambah faktor "share class"
winsorization: FMP pakai data winsorized, return sejati tidak → LAPORKAN semua kasus

LANJUTAN
currency rebasing: r_l + g − r^f_USD = r_e + r^{cf}   (ganti numeraire)
style factors: liquidity → ILLIQ_{t,i} = (1/T)Σ|r|/VOLD  (Amihud)`,
  konsep: [
    {
      nama: `Fundamental/characteristic factor model`,
      definisi: `model faktor yang memakai karakteristik perusahaan teramati (rasio keuangan, industri, negara) sebagai loadings untuk mengestimasi risiko & return faktor.`,
      relasi: `tipe paling umum di industri (Barra, Axioma — disempurnakan sejak pertengahan 1970-an); berakar di APT Ross (1976) & Fama–French 3-faktor (1993).`,
    },
    {
      nama: `Estimation universe`,
      definisi: `himpunan aset acuan untuk estimasi parameter; kriteria: tradeability (cukup likuid — FMP mencakup semuanya), data quality (harga ter-discover, dekat nilai fundamental), relevance (overlap dengan semesta investasi strategi — "lebih ke seni").`,
      relasi: `universe kecil + periode pendek bila tak ingin memodelkan microstructure eksplisit.`,
    },
    {
      nama: `Enam langkah estimasi`,
      definisi: `data ingestion (cek tipe/integritas vendor, outlier, missing data) → universe selection → winsorization → loadings generation (transformasi karakteristik mentah) → cross-sectional regression (output: $\\hat{f}_t$, $\\hat{\\epsilon}_t$) → time-series estimation ($\\hat{\\Omega}_{f,t}$, $\\hat{\\Omega}_{\\epsilon,t}$).`,
      relasi: `pipa produksi model risiko komersial, ujung-ke-ujung.`,
    },
    {
      nama: `WLS cross-sectional regression`,
      definisi: `tiap periode $t$: regresi return aset $r_t$ pada loadings $B_t$ dengan bobot $W = \\Omega_\\epsilon^{-1}$.`,
      relasi: `estimator BLUE di bawah heteroskedastisitas; varians estimatornya $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$ menjadi koreksi bias kovarians faktor.`,
    },
    {
      nama: `Bias kovarians faktor + shrinkage`,
      definisi: `$\\text{var}(\\hat{f}_t) = \\Omega_f + (B^T\\Omega_\\epsilon^{-1}B)^{-1}$: kovarians empiris return faktor terinflasi oleh error estimasi → koreksi (6.6) lalu shrinkage Ledoit–Wolf ke target $\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}I_m$.`,
      relasi: `lensa alternatif = FMP (Insight 6.2): return FMP $= f_i + \\epsilon^Tw_i$, kovariansnya persis (6.5) — jadi shrink kovarians empiris untuk takbias.`,
    },
    {
      nama: `Winsorization`,
      definisi: `batasi return ekstrem via robust z-score $d_{i,t} = \\frac{|\\log(1+r_{i,t})|}{\\text{median}(|\\log(1+r_{i,t-1})|,\\dots,|\\log(1+r_{i,t-T})|)}$, winsorize bila $> d_{\\max}$ (5–10, trial-and-error per asset class/region).`,
      relasi: `peringatan keras — FMP memakai data winsorized sementara return portofolio sejati tidak; laporkan semua kasus di backtest/produksi dan periksa satu per satu.`,
    },
    {
      nama: `Rank-deficient loadings`,
      definisi: `redundansi linier (mis. faktor country/universe + seluruh faktor industri → $Bv = 0$).`,
      relasi: `solusi = buang redundansi, ridge/ridgeless regression, atau side constraints (mis. jumlah return industri terbobot kapitalisasi pasar = 0).`,
    },
    {
      nama: `Newey–West`,
      definisi: `koreksi autokorelasi: $\\hat{\\Omega}_f = C_0 + \\sum_{l=1}^{l_{\\max}}(1 - \\frac{l}{1+l_{\\max}})(C_l + C_l^T)$; konsisten asimtotik saat $T \\to \\infty$.`,
      relasi: `asinkronisitas (pasar tutup beda waktu) menginduksi autokorelasi silang — agregasi return 2–5 hari sebagai alternatif parsial (vol idio ≈ skala $\\sqrt{\\text{window}}$).`,
    },
    {
      nama: `STVU`,
      definisi: `short-term volatility updating: return faktor dimodulasi state laten $x_t$ ($f_t = e^{x_t/2}V_tC_t^{1/2}\\eta_t$); half-life 10–20 hari untuk model harian.`,
      relasi: `EWMA biasa bereaksi terlalu lambat terhadap regime shift vol — investor meremehkan risiko sistemik tepat saat paling butuh akurasi.`,
    },
    {
      nama: `Off-diagonal clustering / correlation thresholding`,
      definisi: `$\\text{thres}_\\lambda(\\rho_{i,j}) = \\rho_{i,j}\\mathbf{1}_{\\{|\\rho_{i,j}|>\\lambda\\}}$, $\\lambda = K\\frac{\\log n}{T}$ (Cai et al., 2016); klaster harus stabil & interpretable; matriks korelasi hasil threshold harus simetris positif-definit & well-conditioned.`,
      relasi: `dependensi segelintir aset (BRK.A/BRK.B; saham A/B/H China) bukan "faktor" (faktor harus pervasive) — sering lebih tepat tambah faktor baru (mis. "share class").`,
    },
    {
      nama: `Currency rebasing`,
      definisi: `ganti numeraire: $r_l + g_{\\text{EURUSD}} - r^f_{\\text{USD}} = r_e + r^{cf}_{\\text{EURUSD}}$, dengan $r_e := r_l - r^f_{\\text{EUR}}$ (local excess return) dan $r^{cf} = g + r^f_{\\text{EUR}} - r^f_{\\text{USD}}$ (currency return yang disesuaikan selisih risk-free).`,
      relasi: `return = local excess return + adjusted currency return; dipakai untuk model multi-negara & struktur faktor mata uang.`,
    },
    {
      nama: `Amihud illiquidity (style factor)`,
      definisi: `$\\text{ILLIQ}_{t,i} := \\frac{1}{T}\\sum_{s=0}^{T-1} \\frac{|r_{i,t-s}|}{\\text{VOLD}_{i,t-s}}$: return absolut harian dibagi volume dolar (same-day).`,
      relasi: `saham ilikuid mengungguli yang likuid (Amihud & Mendelson 1986; Amihud 2002) — kompensasi risiko, terutama saat liquidity spirals; satu dari banyak style factor (size/Banz 1981, value, momentum, crowding/short interest…).`,
    },
  ],
  deepDive: [
    {
      judul: `Enam langkah + estimation universe — pipa produksi model risiko`,
      ringkas: `Enam langkah dari data vendor mentah menjadi matriks kovarians siap produksi — dengan universe yang likuid sebagai fondasi yang tidak bisa ditawar.`,
      definisi: `Enam langkah estimasi model karakteristik (§6.1.2) — dirinci satu per satu di bawah.`,
      kenapa: `Inilah cetak biru model komersial (Barra/Axioma). Dua keputusan awal menentukan segalanya: universe yang mencakup aset tak-likuid meracuni FMP (tak bisa ditradingkan), dan data mentah yang "hampir apa saja" membutuhkan human expertise terbesar justru pada ekstraksi structured data dari unstructured data.`,
      contoh: `Saham Russell 2000 berkapitalisasi kecil bervolume sangat rendah: "apa artinya harga akhir interval 10 menit adalah 6{,}93 dolar?" — mungkin tak ada transaksi (return nol), mungkin hanya segelintir trade di bid/ask. Aturan heuristik: makin pendek interval, makin sulit masalahnya; likuiditas (proksi: volume) menentukan price discovery; tanpa microstructure eksplisit, periode lebih pendek → universe model lebih kecil.`,
      jebakan: `Empat jebakan dalam membangun pipa estimasi — dirinci di kartu bernomor di bawah.`,
      poin: [
        { judul: `Data ingestion`, isi: `Terima data vendor, cek tipe/integritas ("terjadi dengan probabilitas positif"), kestabilan himpunan sekuritas, fraksi missing data, identifikasi & laporkan outlier.` },
        { judul: `Estimation universe selection`, isi: `Kriteria: tradeability (likuid — FMP mencakup semua anggotanya), data quality (price discovery: harga dekat nilai fundamental ekonomi), relevance (overlap dengan semesta investasi strategi).` },
        { judul: `Winsorization`, isi: `Identifikasi outlier return universe & winsorize (lihat Deep Dive 2.4).` },
        { judul: `Loadings generation`, isi: `Transformasi & kombinasi karakteristik mentah menjadi $B_t$ ("dark art": data terstruktur vs tak-terstruktur — transkrip earnings, filing 10-K, web scraping, transaksi kartu kredit, data lokasi).` },
        { judul: `Cross-sectional regression`, isi: `Tiap $t$: regresi $r_t$ pada $B_t$, output $\\hat{f}_t$ dan $\\hat{\\epsilon}_t$ (lihat Deep Dive 2.2).` },
        { judul: `Time-series estimation`, isi: `Dari deret waktu langkah 5, estimasi $\\hat{\\Omega}_{f,t}$ dan $\\hat{\\Omega}_{\\epsilon,t}$ (lihat Deep Dive 2.3).` },
        { judul: `"Data quality" = price discovery`, isi: `"Data quality" $\\neq$ "data lengkap" — yang diminta price discovery (harga bisa dieksploitasi manajer portofolio dalam ukuran non-negligible).`, nada: "jebakan" },
        { judul: `Relevance diakui sebagai "art"`, isi: `Relevance diakui buku sebagai "art" tanpa treatment rigor — jangan klaim ada formula optimal pemilihan universe.`, nada: "jebakan" },
        { judul: `Dark art itu sah`, isi: `Karakteristik mentah "bisa berarti hampir apa saja" — loadings generation adalah dark art yang sah, bukan kegagalan metodologi.`, nada: "jebakan" },
        { judul: `Cek integritas tiap periode`, isi: `Korupsi data terjadi "dengan probabilitas positif" — cek integritas tiap periode, bukan sekali di awal.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Regresi cross-sectional WLS — mesin ekstraksi return faktor`,
      ringkas: `Tiap periode, return faktor diekstrak dari cross-section via WLS — dan error ekstraksinya kembali menghantui di langkah kovarians.`,
      definisi: `Model (6.1): $r_t = B_t f_t + \\epsilon_t$ untuk $t = 1,\\dots,T$. Tiap periode, regresi cross-sectional $r_t$ pada $B_t$ memakai weighted least squares dengan bobot $W = \\Omega_\\epsilon^{-1}$ (menangani heteroskedastisitas): $\\hat{f}_t = (B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}B_t^T\\Omega_\\epsilon^{-1}r_t$, dengan kovarians estimator $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$ (dari (4.16)–(4.17) Bab 4).`,
      kenapa: `Inilah "mesin inti" bab ini: $B_t$ diketahui (karakteristik), $f_t$ dan $\\epsilon_t$ diekstrak dari data. Bobot $\\Omega_\\epsilon^{-1}$ memberi suara lebih kecil pada aset berisik — dan varians estimator inilah yang menjadi koreksi bias di Deep Dive 2.3. Return FMP $w_i$ pun berbentuk $\\hat{f}_i = f_i + \\epsilon^Tw_i$: return faktor hasil estimasi = return sejati + noise portofolio peniru.`,
      contoh: `Ilustrasi ($n=3$, $m=1$; $\\Omega_\\epsilon = I$ sehingga WLS = OLS): $B_t = [1, 0{,}5, -0{,}5]^T$, $r_t = [0{,}04, 0{,}01, -0{,}02]^T$. $\\hat{f}_t = \\frac{1(0{,}04) + 0{,}5(0{,}01) + (-0{,}5)(-0{,}02)}{1^2 + 0{,}5^2 + (-0{,}5)^2} = \\frac{0{,}055}{1{,}5} \\approx 0{,}0367$. Residual: $\\hat{\\epsilon}_t = r_t - B_t\\hat{f}_t \\approx [0{,}0033, -0{,}0083, -0{,}0017]^T$. Satu regresi per periode, $T$ kali — deret $\\hat{f}_t$ menjadi input estimasi kovarians.`,
      jebakan: `Empat jebakan dalam membaca regresi WLS — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `WLS $\\neq$ OLS kecuali $\\Omega_\\epsilon \\propto I$`, isi: `Heteroskedastisitas adalah alasan WLS ada; OLS di sini tidak efisien.`, nada: "jebakan" },
        { judul: `$\\hat{f}_t$ adalah estimator`, isi: `$\\hat{f}_t$ bukan return faktor sejati — selisihnya ($\\epsilon^Tw_i$) menggelembungkan kovarians (lihat Deep Dive 2.3).`, nada: "jebakan" },
        { judul: `Waspada look-ahead bias`, isi: `$B_t$ harus tersedia di awal interval $[t-1, t]$ (karakteristik known) — memakai karakteristik akhir periode = look-ahead bias.`, nada: "jebakan" },
        { judul: `Rank-deficient $\\Rightarrow$ invers tak ada`, isi: `Bila $B_t$ rank-deficient (country + semua industri), $(B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}$ tidak ada — butuh penanganan Deep Dive 2.6.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Koreksi bias + shrinkage — estimasi yang menggelembungkan dirinya sendiri`,
      ringkas: `Return faktor hasil estimasi membawa noise yang menggelembungkan kovarians — kurangkan varians errornya, lalu shrink ke target agar stabil.`,
      definisi: `Karena $\\hat{f}_t$ adalah hasil estimasi WLS (4.16), kovariansnya adalah $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$ — akibatnya kovarians empiris return faktor bias ke atas (6.5): $\\text{var}(\\hat{f}_t) = \\Omega_f + (B^T\\Omega_\\epsilon^{-1}B)^{-1}$. Koreksi (6.6): $\\hat{\\Omega}_f = \\text{var}(\\hat{f}_t) - (B^T\\Omega_\\epsilon^{-1}B)^{-1}$. Lalu aplikasikan Ledoit–Wolf shrinkage (Ledoit & Wolf 2003a,b, 2004) — sederhana, mudah di-tune, performanya baik: $\\Omega_{f,\\text{shrink}}(\\rho) = (1-\\rho)\\hat{\\Omega}_f + \\rho\\,\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}\\,I_m$, yang digabung dengan (6.6). Lensa alternatif (Insight 6.2): via FMP — kovarians return FMP $= \\text{cov}(f_i,f_j) + [(B^T\\Omega_\\epsilon^{-1}B)^{-1}]_{i,j}$ persis (6.5), jadi shrink matriks empiris untuk mendapatkan estimator takbias.`,
      kenapa: `Tanpa koreksi, model melebih-lebihkan risiko faktor — dan karena jumlah faktor "sering tidak jauh lebih kecil dari jumlah observasi", shrinkage memperbaiki kualitas estimasi. Ini salah satu dari sedikit tempat buku memberi resep siap pakai yang konkret.`,
      contoh: `Ilustrasi ($m=2$): $\\text{var}(\\hat{f}_t) = [[0{,}050, 0{,}010],[0{,}010, 0{,}030]]$, $(B^T\\Omega_\\epsilon^{-1}B)^{-1} = [[0{,}008, 0{,}001],[0{,}001, 0{,}006]]$. Koreksi (6.6): $\\hat{\\Omega}_f = [[0{,}042, 0{,}009],[0{,}009, 0{,}024]]$. Shrinkage $\\rho = 0{,}2$: target $= \\frac{0{,}042+0{,}024}{2}I_2 = 0{,}033\\,I_2$; $\\Omega_{\\text{shrink}} = 0{,}8\\hat{\\Omega}_f + 0{,}2(0{,}033)I_2 = [[0{,}0402, 0{,}0072],[0{,}0072, 0{,}0258]]$ — varians menyusut ke rata-rata, korelasi melemah.`,
      jebakan: `Empat jebakan dalam koreksi bias — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `Target LW: $\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}$, bukan kebalikannya`, isi: `Jebakan Gemini yang tertangkap: ringkasan menulis target $\\rho\\,\\frac{m}{\\text{tr}\\,\\hat{\\Omega}_f}I_m$ — terbalik; teks bab: $\\rho\\,\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}I_m$ (varians rata-rata, bukan kebalikannya).`, nada: "jebakan" },
        { judul: `Koreksi bisa merusak positivitas`, isi: `Koreksi bisa menghasilkan matriks tak positif-definit bila koreksi > empiris — di sinilah shrinkage menyelamatkan.`, nada: "jebakan" },
        { judul: `Shrinkage mengoreksi bias estimasi`, isi: `"Shrinkage" di sini mengoreksi bias estimasi, bukan sekadar regularisasi umum.`, nada: "jebakan" },
        { judul: `Lensa FMP`, isi: `$\\hat{f}_i = f_i + \\epsilon^Tw_i$ — return faktor terestimasi = sejati + noise mimicking portfolio; kovarians noise-nya persis suku koreksi.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Winsorization — seni memotong ekor dengan peringatan keras`,
      ringkas: `Potong ekor return dengan z-score yang robust — tapi ingat: yang dipotong mengubah makna return faktor, jadi laporkan setiap kasusnya.`,
      definisi: `Deteksi outlier di level sekuritas via robust z-score: $d_{i,t} = \\frac{|\\log(1+r_{i,t})|}{\\text{median}(|\\log(1+r_{i,t-1})|,\\dots,|\\log(1+r_{i,t-T})|)}$; winsorize return yang melebihi threshold $d_{\\max}$ (tergantung asset class/region, ditetapkan trial-and-error antara 5 dan 10). Dua rekomendasi kualitatif: (1) pastikan investment universe hanya berisi aset likuid & tradeable; (2) laporkan semua instans winsorized di backtest maupun produksi, dan periksa satu per satu — tidak ada metode yang ideal dan sepenuhnya terjustifikasi.`,
      kenapa: `Peringatan keras bab ini: return faktor = return FMP-nya, dan winsorizing di regresi cross-sectional berarti FMP efektif memakai data winsorized — sedangkan return portofolio sejati dihitung dari return historis (tak diwinsorize). Ini merusak evaluasi return faktor maupun residual idiosinkratis bila tak dilaporkan.`,
      contoh: `Ilustrasi: $r_{i,t} = 0{,}25$ (lonjakan 25%), median $|\\log(1+r)|$ 60 hari lampau $= 0{,}008$. $d_{i,t} = |\\log(1{,}25)|/0{,}008 \\approx 0{,}223/0{,}008 \\approx 27{,}9 > 10$ → return diwinsorize (dipotong ke batas). Tanpa winsorize, satu observasi ini mendistorsi $\\hat{f}_t$ dan $\\hat{\\epsilon}_t$ periode itu.`,
      jebakan: `Empat jebakan dalam winsorization — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `Median membuatnya robust`, isi: `Median di penyebut membuatnya robust — memakai mean/std akan membuat outlier menutupi dirinya sendiri.`, nada: "jebakan" },
        { judul: `$\\log(1+r)$, bukan $r$ mentah`, isi: `$\\log(1+r)$ bukan $r$ mentah — agar perlakuan simetris untuk return positif/negatif besar.`, nada: "jebakan" },
        { judul: `Winsorize $\\neq$ buang data`, isi: `Winsorize ≠ buang data — nilainya dipotong ke batas, sampel tetap ada.`, nada: "jebakan" },
        { judul: `Peringatan utama: makna berubah`, isi: `Winsorizing mengubah arti ekonomi return faktor (FMP winsorized vs portofolio sejati) — dokumentasi & inspeksi satu per satu wajib, bukan opsional.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Amihud ILLIQ — mengukur harga ilikuiditas`,
      ringkas: `Rasio return absolut terhadap volume dolar mengukur ilikuiditas — dan pasar membayar premi untuk menanggungnya, sampai liquidity spiral datang.`,
      definisi: `Saham yang lebih ilikuid dalam periode terakhir mengungguli saham yang lebih likuid (Amihud & Mendelson 1986; Amihud 2002). Karakteristik ilikuiditasnya — ukuran Amihud: $\\text{ILLIQ}_{t,i} := \\frac{1}{T}\\sum_{s=0}^{T-1} \\frac{|r_{i,t-s}|}{\\text{VOLD}_{i,t-s}}$, dengan $r_{i,t}$ return harian dan $\\text{VOLD}_{i,t}$ volume dolar di hari yang sama. Interpretasi: excess return sebagai kompensasi risiko yang ditanggung investor, terutama saat liquidity spirals — interval pendek di mana partisipan terpaksa melikuidasi buku karena kerugian yang menyebar lewat likuidasi mereka sendiri (Mitchell et al. 2007; Brunnermeier & Pedersen 2009).`,
      kenapa: `Contoh konkret style factor: karakteristik yang bisa dihitung dari data pasar murni (return + volume) tetapi memprediksi return — dan ilustrasi mengapa daftar faktor tak pernah selesai (penulis menutup dengan skeptisisme sehat: banyak anomali mungkin tidak ada, tidak tradeable, atau terarbitrase pasca-publikasi — McLean & Pontiff 2016; "p-hacking" — Simmons et al. 2013).`,
      contoh: `Ilustrasi ($T=2$): hari 1: $|r|=0{,}02$, VOLD $= 50$ juta dolar → $4 \\times 10^{-10}$; hari 2: $|r|=0{,}03$, VOLD $= 10$ juta dolar → $3 \\times 10^{-9}$. $\\text{ILLIQ} = (4 \\times 10^{-10} + 3 \\times 10^{-9})/2 = 1{,}7 \\times 10^{-9}$ per dolar. Makin besar ILLIQ → makin ilikuid → (menurut anomali) expected return makin tinggi sebagai kompensasi.`,
      jebakan: `Empat jebakan dalam membaca Amihud — dirinci di kartu bernomor di atas.`,
      poin: [
        { judul: `Return & volume harus same-day`, isi: `Return dan volume harus same-day — memasangkan return hari $t$ dengan volume hari lain merusak makna "dampak harga per dolar".`, nada: "jebakan" },
        { judul: `ILLIQ besar = kompensasi, bukan kualitas`, isi: `ILLIQ besar = ilikuid = return ekspektasi lebih tinggi (kompensasi), bukan "saham bagus" — jangan baca sebagai sinyal kualitas.`, nada: "jebakan" },
        { judul: `Anomali $\\neq$ kebal kritik`, isi: `Penulis mengingatkan banyak faktor "dijelaskan" faktor lain ("Factor X is explained by factors Y and Z"), literatur portofolio akademik menyederhanakan (mengabaikan turnover, borrow cost, transaction cost), dan implementasi menentukan ("my top twenty signals were the vast majority of my PnL producers… It's the details that matter").`, nada: "jebakan" },
        { judul: `Crowding berkerabat dengan likuiditas`, isi: `Crowding (short interest, Active Manager Holdings) adalah risiko likuidasi paksa yang berkerabat — posisi crowded + likuidasi satu pemegang = adverse price change untuk semua.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Tiga penyesuaian lanjutan — autokorelasi, korelasi idiosinkratis, mata uang`,
      ringkas: `Autokorelasi dikoreksi Newey–West, shock vol ditangkap STVU, korelasi idiosinkratis di-threshold dengan hati-hati, dan mata uang di-rebase — barulah model layak produksi.`,
      definisi: `Lima penyesuaian lanjutan — dirinci satu per satu di bawah.`,
      kenapa: `Inilah pembeda model mainan vs model produksi: autokorelasi, shock vol, korelasi idiosinkratis terstruktur, dan multi-mata uang adalah "kenyataan kotor" yang harus ditangani eksplisit — masing-masing dengan resep yang sudah teruji.`,
      contoh: `Model harian yang sangat responsif: $\\tau = 126$ hari trading untuk EWMA, tetapi shock bisa terjadi dalam 10 hari trading — EWMA biasa "tidak pernah" mengejar; STVU dengan half-life 10–20 hari menutup celah ini. BRK.A vs BRK.B: likuiditas beda, return sangat berkorelasi — masukkan keduanya hanya bila strategi mengeksploitasi mispricing temporer; bila hanya investasi fundamental, pilih yang paling likuid.`,
      jebakan: `Lima jebakan dalam penyesuaian lanjutan — dirinci di kartu bernomor di bawah.`,
      poin: [
        { judul: `Newey–West`, isi: `Untuk autokorelasi return faktor (asinkronisitas pasar menginduksi autokorelasi silang): $\\hat{\\Omega}_f = C_0 + \\sum_{l=1}^{l_{\\max}}(1 - \\frac{l}{1+l_{\\max}})(C_l + C_l^T)$, konsisten asimtotik ($T \\to \\infty$); alternatif parsial: agregasi return 2–5 hari (vol idio ≈ skala $\\sqrt{\\text{window agregasi}}$).` },
        { judul: `STVU`, isi: `$f_t = e^{x_t/2}V_tC_t^{1/2}\\eta_t$, $\\eta_t \\sim N(0,I_m)$, $x_{t+1} = \\phi x_t + \\sigma\\gamma_t$ — half-life 10–20 hari untuk model harian agar shock vol tertangkap cepat.` },
        { judul: `Correlation thresholding`, isi: `Matriks kovarians idiosinkratis sampel tidak sparse & tidak positif-definit ($T < n$); kenolkan semua non-diagonal = shrinkage radikal yang tak terjustifikasi — inspeksi visual dulu (sering ada pola = faktor yang belum dimodelkan); lalu $\\text{thres}_\\lambda(\\rho_{i,j}) = \\rho_{i,j}\\mathbf{1}_{\\{|\\rho_{i,j}|>\\lambda\\}}$, $\\lambda = K\\frac{\\log n}{T}$ (Cai et al., 2016). Contoh empiris buku: korelasi residual Axioma US AXUS4SH 2010, konstituen kontinu Russell 3000, threshold $|\\rho| = 0{,}55$.` },
        { judul: `Currency rebasing`, isi: `$r_l + g_{\\text{EURUSD}} - r^f_{\\text{USD}} = r_e + r^{cf}_{\\text{EURUSD}}$, $r_e := r_l - r^f_{\\text{EUR}}$, $r^{cf} = g + r^f_{\\text{EUR}} - r^f_{\\text{USD}}$ — return = local excess return + adjusted currency return; dipakai untuk ganti numeraire (mis. USD → GBP) dan struktur faktor mata uang.` },
        { judul: `Linking models`, isi: `Multi-negara/kelas aset: integrated, separate-with-rotation/shrinkage, atau multistage global-local (§6.4.5 juga: block shrinkage untuk model idiosinkratis).` },
        { judul: `Threshold $\\lambda$ yang benar`, isi: `Jebakan Gemini yang tertangkap: ringkasan menulis $\\lambda = K\\sqrt{T\\log n}$ — teks bab: $\\lambda = K\\,\\frac{\\log n}{T}$ (Cai et al., 2016); bukan akar, bukan $T$ di pembilang.`, nada: "jebakan" },
        { judul: `Dependensi segelintir aset $\\neq$ faktor`, isi: `Faktor harus pervasive; yang terdeteksi di korelasi idiosinkratis adalah kandidat faktor baru atau pasangan khusus.`, nada: "jebakan" },
        { judul: `Rank-deficient $B$: tiga solusi`, isi: `Country + semua industri → $Bv = 0$: solusi = buang redundansi, ridge/ridgeless, atau side constraints (mis. return industri terbobot cap = 0).`, nada: "jebakan" },
        { judul: `Agregasi mengurangi observasi`, isi: `Agregasi 2–5 hari mengurangi observasi — ada trade-off jumlah sampel vs sinkronisitas.`, nada: "jebakan" },
        { judul: `Hasil threshold harus SPD`, isi: `Klaster harus stabil & interpretable; matriks korelasi hasil threshold harus simetris positif-definit & well-conditioned.`, nada: "jebakan" },
      ],
    },
  ],
  cheatsheet: `Cheatsheet Bab

> Satu halaman ringkas — cetak dan tempel. Semua definisi & hubungan dari Bab 6.

### Pipa estimasi (6.1.2)
- Data ingestion (cek tipe/integritas vendor — "terjadi dengan probabilitas positif"; stabilitas sekuritas; missing data; outlier) → estimation universe (tradeability · price discovery · relevance) → winsorization → loadings generation (dark art) → cross-sectional regression → time-series estimation ($\\hat{\\Omega}_{f,t}$, $\\hat{\\Omega}_{\\epsilon,t}$)

### Mesin inti
- (6.1) $r_t = B_t f_t + \\epsilon_t$
- WLS: $\\hat{f}_t = (B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}B_t^T\\Omega_\\epsilon^{-1}r_t$ · $\\text{var}(\\hat{f}_t) = (B^T\\Omega_\\epsilon^{-1}B)^{-1}$
- Bias: (6.5) $\\text{var}(\\hat{f}_t) = \\Omega_f + (B^T\\Omega_\\epsilon^{-1}B)^{-1}$ → (6.6) $\\hat{\\Omega}_f = \\text{var}(\\hat{f}_t) - (B^T\\Omega_\\epsilon^{-1}B)^{-1}$
- Ledoit–Wolf: $\\Omega_{f,\\text{shrink}}(\\rho) = (1-\\rho)\\hat{\\Omega}_f + \\rho\\,\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}I_m$ (target = varians rata-rata, BUKAN kebalikannya)
- Lensa FMP: $\\hat{f}_i = f_i + \\epsilon^Tw_i$

### Winsorization
- $d_{i,t} = \\frac{|\\log(1+r_{i,t})|}{\\text{median}(|\\log(1+r_{i,t-1})|,\\dots,|\\log(1+r_{i,t-T})|)}$ · winsorize bila $> d_{\\max} \\in [5, 10]$
- Peringatan: FMP winsorized vs return sejati tidak → laporkan & periksa semua kasus satu per satu

### Deret-waktu
- Newey–West: $\\hat{\\Omega}_f = C_0 + \\sum_{l=1}^{l_{\\max}}(1 - \\frac{l}{1+l_{\\max}})(C_l + C_l^T)$ · alternatif: agregasi 2–5 hari (vol idio $\\sim \\sqrt{\\text{window}}$)
- STVU: $f_t = e^{x_t/2}V_tC_t^{1/2}\\eta_t$, $x_{t+1} = \\phi x_t + \\sigma\\gamma_t$ · half-life 10–20 hari (model harian); EWMA responsif: $\\tau = 126$ hari trading, shock bisa 10 hari

### Idiosinkratis
- Thresholding: $\\text{thres}_\\lambda(\\rho_{i,j}) = \\rho_{i,j}\\mathbf{1}_{\\{|\\rho_{i,j}|>\\lambda\\}}$, $\\lambda = K\\frac{\\log n}{T}$ (Cai et al. 2016) — BUKAN $K\\sqrt{T\\log n}$
- Klaster: stabil & interpretable; hasil harus SPD & well-conditioned · contoh: Russell 3000, threshold $|\\rho| = 0{,}55$
- Rank-deficient $B$: buang redundansi / ridge / side constraints ($\\sum$ return industri cap-weighted $= 0$)

### Mata uang & style
- Rebasing: $r_l + g - r^f_{\\text{USD}} = r_e + r^{cf}$ · $r_e := r_l - r^f_{\\text{EUR}}$, $r^{cf} = g + r^f_{\\text{EUR}} - r^f_{\\text{USD}}$
- Amihud: $\\text{ILLIQ}_{t,i} = \\frac{1}{T}\\sum_{s=0}^{T-1}\\frac{|r_{i,t-s}|}{\\text{VOLD}_{i,t-s}}$ (same-day)

### Angka jangkar
- Threshold winsorize 5–10 · STVU half-life 10–20 hari · $\\tau = 126$ hari (EWMA responsif) · threshold korelasi contoh 0{,}55 · agregasi 2–5 hari
---`,
  prediksi: [
    {
      id: "P1",
      pertanyaan: `Return faktor $\\hat{f}_t$ diperoleh dari regresi cross-sectional tiap periode. Menurutmu, apakah kovarians empiris dari $\\hat{f}_t$ sama dengan kovarians "sejati" return faktor? Apa yang bisa membuatnya bias, dan ke arah mana?`,
      kunci: `Tidak sama — bias ke atas (terinflasi): $\\text{var}(\\hat{f}_t) = \\Omega_f + (B^T\\Omega_\\epsilon^{-1}B)^{-1}$ (6.5). $\\hat{f}_t$ adalah estimator WLS, dan varians error estimasinya menempel pada kovarians empiris. Koreksi: kurangkan $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$ (6.6), lalu Ledoit–Wolf shrinkage.`,
    },
    {
      id: "P2",
      pertanyaan: `Kamu menemukan dua saham (mis. dua kelas saham emiten yang sama) yang residual idiosinkratisnya berkorelasi 0{,}9. Model faktormu mengasumsikan $\\Omega_\\epsilon$ diagonal. Apa dua respons yang masuk akal menurut bab ini, dan kapan memilih masing-masing?`,
      kunci: `(1) Tambah faktor baru yang menangkap dependensi itu (mis. faktor "share class") — bila dependensinya interpretable & stabil; (2) correlation thresholding pada matriks korelasi idiosinkratis — bila hanya segelintir pasangan dan tak layak jadi faktor (faktor harus pervasive). Keputusan praktis buku untuk BRK.A/BRK.B: masukkan keduanya hanya bila strategi mengeksploitasi mispricing temporer; bila investasi fundamental, pilih yang paling likuid.`,
    },
    {
      id: "P3",
      pertanyaan: `Sebuah return harian 25% lolos ke regresi cross-sectional tanpa winsorization. Menurut bab ini, apa dua masalah yang ditimbulkannya — satu untuk estimasi, satu untuk evaluasi?`,
      kunci: `Estimasi: satu observasi ekstrem mendistorsi $\\hat{f}_t$ dan $\\hat{\\epsilon}_t$ periode itu (regresi sensitif outlier). Evaluasi: return faktor = return FMP-nya — winsorizing di regresi berarti FMP memakai data winsorized sementara return portofolio sejati tidak, sehingga evaluasi return faktor & residual menjadi bias bila tak dilaporkan (wajib laporkan & periksa satu per satu).`,
    },
  ],
  kuis: [
    {
      pertanyaan: `Enam langkah estimasi model karakteristik yang BENAR urutannya adalah …`,
      opsi: [
        `A. loadings generation → data ingestion → universe selection → winsorization → regresi → time-series`,
        `B. data ingestion → universe selection → winsorization → loadings generation → cross-sectional regression → time-series estimation`,
        `C. time-series estimation → regresi → winsorization → ingestion → universe → loadings`,
        `D. universe selection → regresi → ingestion → loadings → winsorization → time-series`,
      ],
      benar: 1,
      penjelasan: `urutan persis §6.1.2: ingestion → universe → winsorization → loadings → regresi → time-series.`,
    },
    {
      pertanyaan: `Tiga kriteria estimation universe menurut buku adalah …`,
      opsi: [
        `A. tradeability, data quality (price discovery), relevance terhadap strategi`,
        `B. kapitalisasi besar, dividen tinggi, likuiditas rendah`,
        `C. data lengkap, harga murah, volatilitas tinggi`,
        `D. jumlah aset tetap, tanpa missing data, tanpa outlier`,
      ],
      benar: 0,
      penjelasan: `tiga kriteria persis: tradeability, data quality (price discovery), relevance. B/C/D mengarang.`,
    },
    {
      pertanyaan: `Estimator WLS return faktor adalah …`,
      opsi: [
        `A. $\\hat{f}_t = (B_t^TB_t)^{-1}B_t^Tr_t$ (OLS biasa)`,
        `B. $\\hat{f}_t = (B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}B_t^T\\Omega_\\epsilon^{-1}r_t$`,
        `C. $\\hat{f}_t = \\Omega_\\epsilon B_t(B_t^T\\Omega_\\epsilon B_t)^{-1}r_t$`,
        `D. $\\hat{f}_t = B_t^T r_t / \\|B_t\\|^2$`,
      ],
      benar: 1,
      penjelasan: `estimator WLS persis; A adalah OLS (hanya sah bila $\\Omega_\\epsilon \\propto I$); C menukar posisi $\\Omega_\\epsilon$.`,
    },
    {
      pertanyaan: `Kovarians empiris $\\text{var}(\\hat{f}_t)$ bersifat … dan dikoreksi dengan …`,
      opsi: [
        `A. bias ke bawah; ditambah $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$`,
        `B. takbias; tidak perlu koreksi`,
        `C. bias ke atas (terinflasi) sebesar $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$; koreksi (6.6): $\\hat{\\Omega}_f = \\text{var}(\\hat{f}_t) - (B^T\\Omega_\\epsilon^{-1}B)^{-1}$, lalu Ledoit–Wolf shrinkage`,
        `D. bias ke atas; dikoreksi dengan winsorization`,
      ],
      benar: 2,
      penjelasan: `(6.5) terinflasi + (6.6) koreksi + Ledoit–Wolf; D salah alamat (winsorization bukan koreksi bias kovarians).`,
    },
    {
      pertanyaan: `Target shrinkage Ledoit–Wolf yang BENAR menurut teks bab adalah …`,
      opsi: [
        `A. $\\rho\\,\\frac{m}{\\text{tr}\\,\\hat{\\Omega}_f}I_m$`,
        `B. $\\rho\\,\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}I_m$`,
        `C. $\\rho\\,\\hat{\\Omega}_f$`,
        `D. $(1-\\rho)I_m$`,
      ],
      benar: 1,
      penjelasan: `persis teks bab. Jebakan Gemini yang tertangkap: ringkasan menulis versi terbalik $\\rho\\,\\frac{m}{\\text{tr}\\,\\hat{\\Omega}_f}I_m$ (opsi A).`,
    },
    {
      pertanyaan: `Robust z-score untuk winsorization memakai median (bukan mean/std) karena …`,
      opsi: [
        `A. median lebih mudah dihitung`,
        `B. mean/std akan tercemar outlier itu sendiri sehingga outlier menutupi dirinya (median robust)`,
        `C. buku melarang penggunaan mean`,
        `D. median selalu lebih besar dari mean`,
      ],
      benar: 1,
      penjelasan: `median robust terhadap outlier itu sendiri; $|\\log(1+r)|$ dipakai agar simetris.`,
    },
    {
      pertanyaan: `Threshold optimal correlation thresholding menurut buku (Cai et al., 2016) adalah …`,
      opsi: [
        `A. $\\lambda = K\\sqrt{T\\log n}$`,
        `B. $\\lambda = K\\,\\frac{\\log n}{T}$`,
        `C. $\\lambda = 0{,}55$ untuk semua kasus`,
        `D. $\\lambda = K\\,\\frac{n}{T}$`,
      ],
      benar: 1,
      penjelasan: `persis teks: $\\lambda = K\\log n/T$. Jebakan Gemini yang tertangkap: ringkasan menulis $K\\sqrt{T\\log n}$ (opsi A). C salah: 0{,}55 hanya contoh empiris Russell 3000 di buku, bukan konstanta universal.`,
    },
    {
      pertanyaan: `Ukuran Amihud $\\text{ILLIQ}_{t,i}$ didefinisikan sebagai …`,
      opsi: [
        `A. rata-rata return absolut dibagi volume dolar di hari yang sama: $\\frac{1}{T}\\sum_{s=0}^{T-1}\\frac{|r_{i,t-s}|}{\\text{VOLD}_{i,t-s}}$`,
        `B. total volume dibagi total return absolut`,
        `C. return hari $t$ dibagi volume hari $t-1$`,
        `D. volatilitas dibagi bid-ask spread`,
      ],
      benar: 0,
      penjelasan: `definisi Amihud persis (same-day pairing return & volume).`,
    },
  ],
  fsrs: [
    { depan: `Enam langkah estimasi model faktor karakteristik.`, belakang: `Data ingestion → estimation universe selection → winsorization → loadings generation → cross-sectional regression → time-series covariance estimation.` },
    { depan: `Tiga kriteria estimation universe.`, belakang: `Tradeability (likuid, FMP mencakup semua); data quality/price discovery (harga dekat nilai fundamental); relevance (overlap semesta strategi — "art").` },
    { depan: `Rumus estimator WLS return faktor + variansnya.`, belakang: `$\\hat{f}_t = (B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}B_t^T\\Omega_\\epsilon^{-1}r_t$; var $= (B^T\\Omega_\\epsilon^{-1}B)^{-1}$.` },
    { depan: `Koreksi bias kovarians faktor (6.5)–(6.6) + shrinkage Ledoit–Wolf.`, belakang: `var($\\hat{f}_t$) $= \\Omega_f + (B^T\\Omega_\\epsilon^{-1}B)^{-1}$ (terinflasi); $\\hat{\\Omega}_f = $ var $-$ koreksi; shrink: $(1-\\rho)\\hat{\\Omega}_f + \\rho\\,\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}I_m$ (target = varians rata-rata!).` },
    { depan: `Rumus robust z-score + threshold winsorization.`, belakang: `$d_{i,t} = |\\log(1+r_{i,t})| / \\text{median}(|\\log(1+r_{i,t-1})|,\\dots)$; winsorize bila $> d_{\\max} \\in [5,10]$; laporkan & periksa semua kasus satu per satu.` },
    { depan: `Rumus Newey–West + kapan dipakai.`, belakang: `$\\hat{\\Omega}_f = C_0 + \\sum_{l=1}^{l_{\\max}}(1 - \\frac{l}{1+l_{\\max}})(C_l + C_l^T)$; koreksi autokorelasi return faktor (mis. akibat asinkronisitas pasar).` },
    { depan: `Rumus correlation thresholding + threshold optimal.`, belakang: `thres$_\\lambda(\\rho_{i,j}) = \\rho_{i,j}\\mathbf{1}_{\\{|\\rho_{i,j}|>\\lambda\\}}$; $\\lambda = K\\frac{\\log n}{T}$ (Cai et al. 2016); hasil harus SPD & well-conditioned.` },
    { depan: `Rumus currency rebasing + artinya.`, belakang: `$r_l + g - r^f_{\\text{USD}} = r_e + r^{cf}$; return = local excess return ($r_l - r^f_{\\text{EUR}}$) + adjusted currency return ($g + r^f_{\\text{EUR}} - r^f_{\\text{USD}}$).` },
    { depan: `Rumus Amihud ILLIQ + interpretasi ekonominya.`, belakang: `ILLIQ$_{t,i} = \\frac{1}{T}\\sum \\frac{|r_{i,t-s}|}{\\text{VOLD}_{i,t-s}}$ (same-day); ILLIQ besar = ilikuid = expected return lebih tinggi sebagai kompensasi risiko (liquidity spirals).` },
    { depan: `Tiga solusi loadings rank-deficient + contoh penyebab.`, belakang: `Penyebab: redundansi linier (country + semua industri → $Bv=0$). Solusi: buang redundansi; ridge/ridgeless regression; side constraints (return industri cap-weighted = 0).` },
  ],
  feynman: [
    {
      poin: `Enam langkah + tiga kriteria universe`,
      penajaman: `kalau ditanya "kenapa universe harus likuid dan apa itu price discovery?", harus bisa jawab: FMP mencakup semua anggota universe (tak likuid = tak bisa ditradingkan); price discovery = harga bisa dieksploitasi dalam ukuran non-negligible.`,
    },
    {
      poin: `WLS: kenapa bobot $\\Omega_\\epsilon^{-1}$`,
      penajaman: `kalau ditanya "apa yang terjadi bila pakai OLS padahal heteroskedastis?", harus bisa jawab: tidak efisien; bobot kecil untuk aset berisik; varians estimatornya menjadi koreksi bias berikutnya.`,
    },
    {
      poin: `Bias kovarians + shrinkage (arah yang benar)`,
      penajaman: `kalau ditanya "target shrinkagenya apa dan kenapa bukan kebalikannya?", harus bisa jawab: $\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}I_m$ = varians rata-rata × identitas (bukan $m/\\text{tr}$); mengoreksi inflasi $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$.`,
    },
    {
      poin: `Winsorization: rumus + peringatan FMP`,
      penajaman: `kalau ditanya "kenapa winsorizing merusak evaluasi return faktor?", harus bisa jawab: FMP pakai data winsorized, return sejati tidak — wajib laporkan & periksa satu per satu.`,
    },
    {
      poin: `Newey–West vs agregasi`,
      penajaman: `kalau ditanya "kapan agregasi 2–5 hari dipilih?", harus bisa jawab: untuk asinkronisitas; trade-off: observasi berkurang, vol idio ≈ skala akar window.`,
    },
    {
      poin: `Thresholding: rumus + kapan tambah faktor`,
      penajaman: `kalau ditanya "korelasi residual 0{,}9 antar dua kelas saham — threshold atau faktor baru?", harus bisa jawab: $\\lambda = K\\log n/T$ untuk threshold; faktor baru ("share class") bila pola stabil & interpretable — faktor harus pervasive.`,
    },
    {
      poin: `Currency rebasing`,
      penajaman: `kalau ditanya "return total = apa + apa?", harus bisa jawab: local excess return + adjusted currency return (selisih risk-free sudah dikoreksi).`,
    },
    {
      poin: `Amihud + skeptisisme faktor`,
      penajaman: `kalau ditanya "ILLIQ besar artinya apa dan apa catatan penulis tentang anomali?", harus bisa jawab: ilikuid → kompensasi return lebih tinggi; banyak anomali mungkin tidak ada/tidak tradeable/terarbitrase (McLean–Pontiff 2016), waspadai p-hacking.`,
    },
    {
      poin: `Rank-deficiency: deteksi + solusi`,
      penajaman: `kalau ditanya "country + semua industri di $B$ bermasalah kenapa?", harus bisa jawab: $Bv = 0$ (redundansi linier) → $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$ tak ada; solusi: buang redundansi/ridge/side constraints.`,
    },
    {
      poin: `STVU: kapan EWMA gagal`,
      penajaman: `kalau ditanya "kenapa half-life 10–20 hari?", harus bisa jawab: EWMA $\\tau = 126$ hari terlalu lambat untuk shock 10 hari — investor meremehkan risiko sistemik tepat saat paling butuh akurasi.`,
    },
  ],
  rumus: [
    {
      id: `bab6-wls`,
      judul: `Estimator WLS return faktor (6.1)`,
      latex: `\\hat{f}_t = (B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}\\,B_t^T\\Omega_\\epsilon^{-1}r_t, \\qquad \\text{var}(\\hat{f}_t \\mid B_t) = (B_t^T\\Omega_\\epsilon^{-1}B_t)^{-1}`,
      variabel: [
        { simbol: `r_t \\in \\mathbb{R}^n`, arti: `vektor return $n$ aset periode $t$` },
        { simbol: `B_t \\in \\mathbb{R}^{n \\times m}`, arti: `matriks loadings (karakteristik terstandardisasi) periode $t$` },
        { simbol: `\\hat{f}_t \\in \\mathbb{R}^m`, arti: `estimator return $m$ faktor periode $t$` },
        { simbol: `\\Omega_\\epsilon`, arti: `kovarians idiosinkratis positif-definit (bobot $W = \\Omega_\\epsilon^{-1}$)` },
      ],
      langkah: [
        `Ilustrasi ($n=3$, $m=1$; $\\Omega_\\epsilon = I$ sehingga WLS = OLS): $B_t = [1, 0{,}5, -0{,}5]^T$, $r_t = [0{,}04, 0{,}01, -0{,}02]^T$`,
        `$\\hat{f}_t = \\frac{1(0{,}04) + 0{,}5(0{,}01) + (-0{,}5)(-0{,}02)}{1^2 + 0{,}5^2 + (-0{,}5)^2} = \\frac{0{,}055}{1{,}5}$`,
        `Residual: $\\hat{\\epsilon}_t = r_t - B_t\\hat{f}_t \\approx [0{,}0033, -0{,}0083, -0{,}0017]^T$`,
      ],
      hasil: `**$\\hat{f}_t \\approx 0{,}0367$** — satu regresi per periode, $T$ kali; deret $\\hat{f}_t$ menjadi input estimasi kovarians.`,
      jebakan: `WLS ≠ OLS kecuali $\\Omega_\\epsilon \\propto I$ — heteroskedastisitas adalah alasan WLS ada. Dan $\\hat{f}_t$ adalah estimator, bukan return faktor sejati: selisihnya menggelembungkan kovarians (Blok Rumus berikutnya).`,
    },
    {
      id: `bab6-bias-shrink`,
      judul: `Koreksi bias (6.5)–(6.6) + Ledoit–Wolf shrinkage`,
      latex: `\\text{var}(\\hat{f}_t) = \\Omega_f + (B^T\\Omega_\\epsilon^{-1}B)^{-1} \\quad\\text{(6.5: estimasi terinflasi)} \\\\ \\hat{\\Omega}_f = \\text{var}(\\hat{f}_t) - (B^T\\Omega_\\epsilon^{-1}B)^{-1} \\quad\\text{(6.6: koreksi bias)} \\\\ \\Omega_{f,\\text{shrink}}(\\rho) = (1-\\rho)\\,\\hat{\\Omega}_f + \\rho\\,\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}\\,I_m \\quad\\text{(Ledoit--Wolf)}`,
      variabel: [
        { simbol: `\\text{var}(\\hat{f}_t)`, arti: `kovarians empiris return faktor hasil estimasi` },
        { simbol: `\\Omega_f`, arti: `kovarians faktor sejati (populasi)` },
        { simbol: `(B^T\\Omega_\\epsilon^{-1}B)^{-1}`, arti: `varians error estimasi faktor (sumber inflasi)` },
        { simbol: `\\rho \\in (0,1)`, arti: `parameter tuning shrinkage` },
        { simbol: `\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}I_m`, arti: `target terstruktur: varians rata-rata × identitas` },
      ],
      langkah: [
        `Ilustrasi ($m=2$): $\\text{var}(\\hat{f}_t) = [[0{,}050, 0{,}010],[0{,}010, 0{,}030]]$, $(B^T\\Omega_\\epsilon^{-1}B)^{-1} = [[0{,}008, 0{,}001],[0{,}001, 0{,}006]]$`,
        `Koreksi (6.6): $\\hat{\\Omega}_f = [[0{,}042, 0{,}009],[0{,}009, 0{,}024]]$`,
        `Shrinkage $\\rho = 0{,}2$: target $= \\frac{0{,}042+0{,}024}{2}I_2 = 0{,}033\\,I_2$ → $\\Omega_{\\text{shrink}} = 0{,}8\\hat{\\Omega}_f + 0{,}2(0{,}033)I_2$`,
      ],
      hasil: `**$\\Omega_{\\text{shrink}} = [[0{,}0402, 0{,}0072],[0{,}0072, 0{,}0258]]$** — varians menyusut ke rata-rata, korelasi melemah.`,
      jebakan: `Target LW = varians rata-rata $\\frac{\\text{tr}\\,\\hat{\\Omega}_f}{m}$ — BUKAN kebalikannya (jebakan Gemini yang tertangkap). Koreksi bisa menghasilkan matriks tak positif-definit bila koreksi > empiris — di sinilah shrinkage menyelamatkan.`,
    },
    {
      id: `bab6-winsor`,
      judul: `Robust z-score winsorization`,
      latex: `d_{i,t} = \\frac{|\\log(1+r_{i,t})|}{\\text{median}\\big(|\\log(1+r_{i,t-1})|,\\ \\dots,\\ |\\log(1+r_{i,t-T})|\\big)}, \\qquad \\text{winsorize jika } d_{i,t} > d_{\\max}`,
      variabel: [
        { simbol: `r_{i,t}`, arti: `return sekuritas $i$ hari $t$ (dipakai $\\log(1+r)$ agar simetris)` },
        { simbol: `\\text{penyebut}`, arti: `median $|\\log(1+r)|$ atas $T$ hari lampau — robust terhadap outlier itu sendiri` },
        { simbol: `d_{\\max}`, arti: `threshold 5–10 (trial-and-error per asset class/region)` },
      ],
      langkah: [
        `Ilustrasi: $r_{i,t} = 0{,}25$ (lonjakan 25%), median $|\\log(1+r)|$ 60 hari lampau $= 0{,}008$`,
        `$d_{i,t} = |\\log(1{,}25)|/0{,}008 \\approx 0{,}223/0{,}008$`,
        `$\\approx 27{,}9 > 10$ → diwinsorize (dipotong ke batas)`,
      ],
      hasil: `**$d_{i,t} \\approx 27{,}9$ — diwinsorize.** Tanpa ini, satu observasi mendistorsi $\\hat{f}_t$ dan $\\hat{\\epsilon}_t$ periode itu.`,
      jebakan: `Peringatan utama: winsorizing mengubah arti ekonomi return faktor (FMP winsorized vs portofolio sejati) — dokumentasi & inspeksi satu per satu wajib, bukan opsional.`,
    },
    {
      id: `bab6-amihud`,
      judul: `Amihud illiquidity measure`,
      latex: `\\text{ILLIQ}_{t,i} := \\frac{1}{T}\\sum_{s=0}^{T-1} \\frac{|r_{i,t-s}|}{\\text{VOLD}_{i,t-s}}`,
      variabel: [
        { simbol: `|r_{i,t-s}|`, arti: `return absolut harian saham $i$` },
        { simbol: `\\text{VOLD}_{i,t-s}`, arti: `volume transaksi harian saham $i$ dalam nilai dolar (hari yang sama)` },
        { simbol: `T`, arti: `jumlah hari observasi` },
      ],
      langkah: [
        `Ilustrasi ($T=2$): hari 1: $|r|=0{,}02$, VOLD $= 50$ juta dolar → $4 \\times 10^{-10}$`,
        `Hari 2: $|r|=0{,}03$, VOLD $= 10$ juta dolar → $3 \\times 10^{-9}$`,
        `$\\text{ILLIQ} = (4 \\times 10^{-10} + 3 \\times 10^{-9})/2$`,
      ],
      hasil: `**$\\text{ILLIQ} = 1{,}7 \\times 10^{-9}$ per dolar** — makin besar ILLIQ → makin ilikuid → expected return makin tinggi sebagai kompensasi.`,
      jebakan: `Return dan volume harus same-day. ILLIQ besar = kompensasi risiko, bukan sinyal kualitas. Dan anomali ≠ kebal kritik: waspadai p-hacking (Simmons et al. 2013).`,
    },
  ],
  // Tata letak: pitch 300×240; edge langkah→rebasing dirutekan via atas
  // (lurus = menembus simpul winsor). Pola addendum LAPORAN_POLES_G1.md.
  peta: {
    nodes: [
      { id: `langkah`, label: `Enam langkah`, x: 150, y: 80, konsepId: 2 },
      { id: `wls`, label: `Regresi WLS`, x: 450, y: 80, konsepId: 3 },
      { id: `bias`, label: `Koreksi bias + LW`, x: 750, y: 80, konsepId: 4 },
      { id: `newey`, label: `Newey–West`, x: 1050, y: 80, konsepId: 7 },
      { id: `universe`, label: `Universe likuid`, x: 150, y: 320, konsepId: 1 },
      { id: `winsor`, label: `Winsorization`, x: 450, y: 320, konsepId: 5 },
      { id: `stvu`, label: `STVU`, x: 750, y: 320, konsepId: 8 },
      { id: `threshold`, label: `Thresholding`, x: 1050, y: 320, konsepId: 9 },
      { id: `rankdef`, label: `Rank-deficient B`, x: 150, y: 560, konsepId: 6 },
      { id: `amihud`, label: `Amihud ILLIQ`, x: 450, y: 560, konsepId: 11 },
      { id: `rebasing`, label: `Currency rebasing`, x: 750, y: 560, konsepId: 10 },
    ],
    edges: [
      { from: `langkah`, to: `wls`, label: `mesin inti` },
      { from: `wls`, to: `bias`, label: `terinflasi` },
      { from: `bias`, to: `newey`, label: `koreksi autokor` },
      { from: `newey`, to: `stvu`, label: `shock vol` },
      { from: `langkah`, to: `universe`, label: `fondasi likuid` },
      { from: `langkah`, to: `winsor`, label: `potong ekor` },
      { from: `wls`, to: `rankdef`, label: `B bisa singular` },
      { from: `bias`, to: `threshold`, label: `korelasi idio` },
      { from: `langkah`, to: `amihud`, label: `style factor` },
      { from: `langkah`, to: `rebasing`, label: `ganti numeraire`, via: [{ x: 600, y: 140 }] },
    ],
  },
};
