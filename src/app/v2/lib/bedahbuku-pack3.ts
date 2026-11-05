import type { ChapterPack } from "./bedahbuku";

export const PACK3: ChapterPack = {
  slug: "bab-3",
  bab: 3,
  judul: `Interlude: What Is Performance?`,
  catatan: `interlude pendek (±12,3 ribu karakter teks) — menetapkan empat metrik kinerja yang dipakai di semua bab berikutnya. Bab 4 akan memakai *idiosyncratic returns* (disinggung di sini); Bab 8–13 memakai Sharpe Ratio dan capacity lagi.`,
  ideBesar: `sebelum masuk ke factor models (Bab 4 dan seterusnya), bab ini menyepakati "bahasa penilaian" seorang quant: **empat metrik** — *expected return*, *volatility*, *Sharpe/information ratio*, *capacity* — dan menunjukkan bagaimana mereka saling terkait. Expected return dan volatility digabung menjadi Sharpe Ratio; dari Sharpe Ratio diturunkan batas peluang rugi yang berlaku untuk distribusi return **apa pun** (ketidaksamaan Cantelli); capacity menutup lingkaran dengan menunjukkan kenapa strategi yang terlihat bagus di atas kertas bisa tidak layak secara ekonomi.`,
  diagram: `   Expected Return                 Volatility
   = PnL / AuM                     (ukuran risiko; bisa diestimasi
    "stationary & intensive"        karena tail index return saham
        │                           berada di 2–5 — Cont 2001)
        ▼                                ▼
              ┌──────────────────────┐
              │     SHARPE RATIO     │
              │  = expected return / │
              │      volatility      │
              └──────────────────────┘
        ┌───────────┬───────────────────────┬────────────────┐
        ▼           ▼                       ▼                ▼
  ≈ t-statistic  Batas Cantelli        Dimensi [time]⁻¹ᐟ²  Information Ratio
  (signifikansi  P(ξ<−Lσ) ≤            ×√21 bulanan        (versi SR untuk
   mean)         1/(1+(L+SR)²)         ×√251 tahunan (AS)    idiosyncratic
                 utk DISTRIBUSI                         returns — Bab 4)
                 APA PUN

              ┌──────────────────────┐
              │       CAPACITY       │
              │  max E[PnL] dengan   │
              │  syarat SR ≥ ambang  │
              │  yang bisa diterima  │
              └──────────────────────┘
        ▲ SR hampir selalu TURUN saat volatilitas naik
          → tidak bisa asal memperbesar skala

   Diskresioner: SATISFICE  ·  Kuantitatif: OPTIMIZE
   (metrik bisa jadi objective ATAU constraint — perannya bisa ditukar)`,
  konsep: [
    {
      nama: `Satisfice vs optimize`,
      definisi: `manajer diskresioner mencari hasil yang *cukup baik* (memenuhi kriteria minimum); manajer kuantitatif memformulasikan semuanya sebagai masalah optimasi.`,
      relasi: `bab mengakui garisnya tidak setajam itu — manajer diskresioner pun mengoptimasi secara naluriah (analogi hiu macan dan burung warbler). Perbedaan sebenarnya: quant menuliskan objektifnya secara eksplisit.`,
    },
    {
      nama: `Objective ↔ constraint`,
      definisi: `empat metrik bisa masuk sebagai *tujuan* optimasi atau sebagai *batasan*; peran keduanya bisa ditukar.`,
      relasi: `"maksimalkan return dengan batas volatilitas" dan "minimalkan volatilitas dengan target return" adalah dua wajah dari masalah yang sama.`,
    },
    {
      nama: `Expected return = PnL / AuM`,
      definisi: `profit dinormalisasi terhadap modal.`,
      relasi: `dipilihnya return (bukan nominal uang) karena **stationary** (distribusinya kurang-lebih sama antar periode investasi) dan **intensive** (tidak bergantung pada besar modal) → bisa dibandingkan antar periode dan antar dana.`,
    },
    {
      nama: `Volatility`,
      definisi: `ukuran dispersi return yang dipakai sebagai proksi risiko.`,
      relasi: `pemakaiannya dibenarkan secara empiris (Cont, 2001: *tail index* return saham di antara 2 dan 5 → hanya momen keempat yang dijamin terhingga → volatilitas bisa diestimasi, tetapi skewness/kurtosis belum tentu) dan secara teori lewat optimasi utilitas satu periode (Huang & Litzenberger, 1988): aproksimasi Taylor orde-2 dari fungsi utilitas, atau bentuk utilitas spesifik (eksponensial / power dengan γ∈(0,1) / log), atau return berdistribusi normal. Rasio b/a dalam aproksimasi itu = derajat *risk aversion*.`,
    },
    {
      nama: `Sharpe Ratio (SR)`,
      definisi: `expected return dibagi volatilitas: return per unit risiko.`,
      relasi: `dengan asumsi return iid, SR sama dengan t-statistic dari mean distribusi return. Kelemahannya: (1) aneh saat expected return negatif, (2) mewarisi keterbatasan volatilitas sebagai ukuran risiko. Kelebihannya: intuitif dan punya banyak hasil teoretis (interval kepercayaan, batas Cantelli, hubungan dengan regresi cross-sectional).`,
    },
    {
      nama: `Information Ratio (IR)`,
      definisi: `didefinisikan analog dengan SR tetapi memakai *idiosyncratic returns* (komponen return intrinsik yang tidak digerakkan faktor bersama; diperkenalkan di Bab 4).`,
      relasi: `IR mengukur return per unit risiko yang spesifik pada strategi, bukan risiko pasar bersama.`,
    },
    {
      nama: `Cantelli inequality`,
      definisi: `untuk variabel acak $\\xi$ dengan mean $\\mu$ dan simpangan baku $\\sigma$: $P(\\xi < \\mu - \\lambda) \\leq \\frac{\\sigma^2}{\\sigma^2 + \\lambda^2}$.`,
      relasi: `diterapkan ke return tahunan dengan SR tahunan menghasilkan $P(\\xi < -L\\sigma) \\leq \\frac{1}{1 + (L + SR)^2}$ — batas peluang rugi yang berlaku untuk **distribusi apa pun** dengan SR tersebut.`,
    },
    {
      nama: `Dimensi & penskalaan waktu`,
      definisi: `return berdimensi $[time]^{-1}$, varians $[time]^{-1}$ (linear terhadap waktu bila return tidak ber-autokorelasi), volatilitas $[time]^{-1/2}$, SR $[time]^{-1/2}$.`,
      relasi: `SR harian → bulanan dikali $\\sqrt{21}$ (21 hari bursa/bulan); SR harian → tahunan (AS) dikali $\\sqrt{251}$ (251 hari bursa/tahun per 2024 — tergantung negara, kelas aset, dan tahun).`,
    },
    {
      nama: `Estimator SR & standard error`,
      definisi: `dari $T$ observasi: $\\hat{\\mu} = \\frac{1}{T}\\sum_t r_t$, $\\hat{\\sigma} = \\sqrt{\\frac{1}{T}\\sum_t (r_t - \\hat{\\mu})^2}$, $\\hat{SR} = \\hat{\\mu}/\\hat{\\sigma}$. Untuk excess return iid bervarians terhingga: $SE(\\hat{SR}) = \\sqrt{\\frac{1 + SR^2/2}{T}}$. Bila $\\sigma$ diketahui: $SE = 1/\\sqrt{T}$. Bila return ber-autokorelasi $\\mathrm{cor}(r_s, r_t) = \\rho^{|t-s|}$ dengan $|\\rho|$ kecil: estimator disesuaikan $\\approx (\\hat{\\mu}/\\hat{\\sigma})(1 - \\rho)$.`,
    },
    {
      nama: `Capacity`,
      definisi: `"PnL ekspektasi tertinggi yang bisa dihasilkan strategi dalam suatu horizon".`,
      relasi: `definisi operasionalnya — PnL maksimum dengan syarat SR di atas ambang yang bisa diterima (atau return atas modal minimum). Penting karena SR hampir selalu *menurun* terhadap volatilitas: di skala cukup besar SR menjadi nol dan strategi tidak lagi menguntungkan.`,
    },
  ],
  deepDive: [
    {
      judul: `Satisfice vs optimize — perbedaan yang menentukan seluruh buku`,
      ringkas: `Kalimat pembuka yang menentukan seluruh buku: manajer diskresioner puas dengan hasil yang cukup baik, manajer kuantitatif menulis semuanya sebagai optimasi eksplisit.`,
      definisi: `*Satisfice* = puas dengan hasil yang memenuhi kriteria minimum yang ditetapkan. *Optimize* = memaksimalkan (atau meminimalkan) suatu fungsi objektif secara eksplisit. Kalimat pembuka bab menempatkan manajer diskresioner di kubu pertama dan manajer kuantitatif di kubu kedua — dengan catatan "mungkin tidak sepenuhnya adil" terhadap manajer diskresioner, karena mereka pun mengoptimasi secara naluriah (seperti hiu macan mengoptimasi asupan makanan atau burung warbler meminimalkan jarak migrasi).`,
      kenapa: `Seluruh buku ini adalah mesin optimasi: bab-bab berikutnya menulis masalah investasi sebagai "maksimalkan X dengan batasan Y". Kalau kamu tidak internalisasi perbedaan ini, rumus-rumus berikutnya terasa seperti daftar resep tanpa tahu kenapa ditulis begitu. Poin kuncinya: metrik bisa masuk sebagai *objective* maupun *constraint*, dan peran keduanya bisa ditukar — itu sebabnya satu masalah bisa ditulis dalam banyak bentuk yang ekuivalen.`,
      contoh: `"Maksimalkan expected return dengan syarat volatilitas $\\leq 10\\%$" adalah masalah yang sama (secara struktur) dengan "minimalkan volatilitas dengan syarat expected return $\\geq 8\\%$". Metrik yang sama — expected return dan volatilitas — berganti peran dari tujuan menjadi batasan.`,
      jebakan: `(1) Mengira "optimize" = "hasil terbaik yang mungkin secara absolut" — padahal hasil optimasi hanya sebaik fungsi objektif yang dipilih; pilih objektif yang salah, dapat optimum yang salah. (2) Mengira diskresioner = tidak memakai metrik — bab justru menekankan mereka mengoptimasi juga, hanya tanpa formalisasi.`,
    },
    {
      judul: `Kenapa return, bukan uang: stationary & intensive`,
      ringkas: `Kenapa industri berbicara dalam persen bukan rupiah: return bersifat stationary dan intensive — dengan satu catatan kaki besar bernama capacity.`,
      definisi: `*Stationary* = memiliki (kurang-lebih) distribusi yang sama di berbagai periode investasi. *Intensive* (lawan dari *extensive*) = tidak bergantung pada jumlah yang diinvestasikan. Karena dua sifat inilah expected return didefinisikan sebagai **PnL / AuM** — profit dinormalisasi terhadap modal.`,
      kenapa: `Inilah fondasi kenapa seluruh industri keuangan berbicara dalam persen, bukan rupiah. Tanpa normalisasi, kamu tidak bisa membandingkan kinerja tahun 2024 dengan 2025, apalagi membandingkan dana Rp 5 miliar dengan dana Rp 500 juta. "Stationary" menangani perbandingan antar-waktu; "intensive" menangani perbandingan antar-skala.`,
      contoh: `Dana A: PnL Rp 500 juta dari AuM Rp 5 miliar → return $10\\%$. Dana B: PnL Rp 100 juta dari AuM Rp 500 juta → return $20\\%$. Dalam nominal uang, A "lebih besar"; dalam bahasa yang benar, B berkinerja dua kali lebih baik. Itulah gunanya intensive: menghilangkan ilusi skala.`,
      jebakan: `Mengira sifat *intensive* berlaku mutlak — padahal Bab 3.4 (capacity) justru menunjukkan batasnya: pada skala yang cukup besar, return *turun* seiring volatilitas naik. Jadi "intensive" adalah aproksimasi yang valid di skala kecil-menengah; di skala besar, capacity-lah yang mengatur. Membaca 3.1 tanpa 3.4 memberi gambaran setengah.`,
    },
    {
      judul: `Sharpe Ratio — intuitif, tapi punya dua cacat bawaan`,
      ringkas: `Metrik paling populer sekaligus paling disalahpahami: intuitif sebagai return per unit risiko, tetapi peringkatnya terbalik saat expected return negatif.`,
      definisi: `$SR = \\text{expected return} / \\text{volatilitas}$ — return yang diukur dalam satuan "risiko" selama suatu periode. Bila return *independently and identically distributed* (iid), SR sama dengan t-statistic dari mean distribusi return: ia sekaligus mengukur signifikansi statistik dari mean.`,
      kenapa: `SR adalah metrik yang paling sering dipakai (dan disalahpahami) di industri. Bab ini jujur soal dua cacatnya: (1) **tidak masuk akal sebagai pemeringkat saat expected return negatif** — portofolio dengan expected return $-5\\%$ dan volatilitas $5\\%$ punya $SR = -1$, *lebih rendah* dari portofolio yang sama-sama $-5\\%$ tetapi volatilitasnya $10\\%$ ($SR = -0{,}5$). Artinya pecundang yang lebih berisiko justru "terlihat lebih baik" menurut SR. (2) **mewarisi keterbatasan volatilitas** sebagai ukuran risiko — kamu bisa mengganti penyebutnya dengan ukuran risiko favoritmu (daftarnya nyaris tak berujung), tetapi saat itu ia bukan lagi "Sharpe Ratio".`,
      contoh: `Dua strategi sama-sama diprediksi rugi $5\\%$ setahun. Strategi X volatilitasnya $5\\%$ ($SR = -1{,}0$); strategi Y volatilitasnya $10\\%$ ($SR = -0{,}5$). Peringkat SR berkata Y > X — padahal Y adalah versi yang lebih buruk dari taruhan yang sama. Inilah yang dimaksud bab: "tidak intuitif, bahkan salah".`,
      jebakan: `(1) Memakai SR untuk membandingkan strategi yang expected return-nya negatif — hasilnya menyesatkan secara sistematis. (2) Mengira SR tinggi = strategi bagus — SR hanya mengukur return *per unit volatilitas*, tanpa mengatakan apa-apa soal kapasitas (berapa PnL yang benar-benar bisa dihasilkan) — lihat 2.6.`,
    },
    {
      judul: `Dimensi Sharpe Ratio & penskalaan $\\sqrt{T}$`,
      ringkas: `Sharpe Ratio berdimensi [time]⁻¹ᐟ² — lupa satuan waktunya dan kamu membandingkan apel dengan jeruk.`,
      definisi: `SR berdimensi **[time]⁻¹ᐟ²**. Alurnya: return harian $r$ = PnL harian atas modal → return tahunan $= rT$ ($T$ hari bursa), jadi return berdimensi $[time]^{-1}$. Varians bersifat linear terhadap waktu bila return tidak ber-autokorelasi (varians tahunan = jumlah $T$ varians harian) → varians berdimensi $[time]^{-1}$, volatilitas $[time]^{-1/2}$. Maka $SR = \\text{return}/\\text{volatilitas} = [time]^{-1} / [time]^{-1/2} = [time]^{-1/2}$.`,
      kenapa: `Tanpa dimensi yang jelas, kamu akan membandingkan SR harian dengan SR tahunan seolah satu satuan — kesalahan yang sangat umum ("SR 2,0!" — per periode apa?). Aturan konversinya: SR harian → bulanan dikali **$\\sqrt{21}$**; SR harian → tahunan (AS) dikali **$\\sqrt{251}$**. Logikanya: $\\mu_\\text{tahunan} = T \\cdot \\mu_\\text{harian}$, $\\sigma_\\text{tahunan} = \\sqrt{T} \\cdot \\sigma_\\text{harian}$, sehingga $SR_\\text{tahunan} = \\frac{T \\cdot \\mu_h}{\\sqrt{T} \\cdot \\sigma_h} = \\sqrt{T} \\cdot SR_\\text{harian}$.`,
      contoh: `Strategi dengan $SR_\\text{harian} = 0{,}08 \\to SR_\\text{bulanan} \\approx 0{,}08 \\times \\sqrt{21} \\approx 0{,}08 \\times 4{,}58 \\approx$ **$0{,}37$**; $SR_\\text{tahunan}$ (AS) $\\approx 0{,}08 \\times \\sqrt{251} \\approx 0{,}08 \\times 15{,}84 \\approx$ **$1{,}27$**. Angka $1{,}27$ inilah yang biasa dilaporkan sebagai "Sharpe tahunan".`,
      jebakan: `(1) Faktor $\\sqrt{T}$ hanya sah bila return **tidak ber-autokorelasi** — dengan autokorelasi $\\rho$, estimator SR harus dikoreksi $\\approx (\\hat{\\mu}/\\hat{\\sigma})(1 - \\rho)$; autokorelasi positif membuat SR naif terlihat lebih bagus dari seharusnya. (2) Angka 251 itu spesifik: AS, tahun 2024 — tergantung negara, kelas aset, dan tahun. Jangan menghafal 251 sebagai konstanta universal.`,
    },
    {
      judul: `Batas Cantelli — jaminan tanpa asumsi distribusi`,
      ringkas: `Satu-satunya jaminan peluang rugi yang tidak butuh asumsi distribusi apa pun: batas atas yang jujur di dunia berekor gemuk.`,
      definisi: `Ketidaksamaan Cantelli: untuk variabel acak $\\xi$ dengan mean $\\mu$ dan simpangan baku $\\sigma$, $P(\\xi < \\mu - \\lambda) \\leq \\frac{\\sigma^2}{\\sigma^2 + \\lambda^2}$. Diterapkan ke return tahunan $\\xi$ dengan SR tahunan, dan rugi dinyatakan sebagai kelipatan simpangan baku ($-L\\sigma$), menjadi: **$P(\\xi < -L\\sigma) \\leq \\frac{1}{1 + (L + SR)^2}$**. Ini berlaku untuk **distribusi return apa pun** yang memiliki SR tersebut.`,
      kenapa: `Di dunia berekor gemuk (ingat Cont 2001: *tail index* 2–5), asumsi normal adalah kemewahan yang tidak kamu miliki. Cantelli memberimu satu-satunya jaminan peluang rugi yang tidak butuh asumsi distribusi — hanya mean dan varians. Derivasinya singkat: dari $SR = \\mu/\\sigma$ diperoleh $\\mu = SR \\cdot \\sigma$; substitusikan $\\lambda = L\\sigma$ ke bentuk kedua ketidaksamaan ($P(\\xi < -\\lambda) \\leq \\frac{\\sigma^2}{\\sigma^2 + (\\lambda + \\mu)^2}$) dan sederhanakan — suku $\\sigma^2$ tercoret, tersisa $\\frac{1}{1 + (L + SR)^2}$.`,
      contoh: `$SR_\\text{tahunan} = 3$, volatilitas tahunan 50 juta dolar AS. Peluang rugi 100 juta dolar AS ($= 2$ simpangan baku, $L = 2$): $P \\leq \\frac{1}{1 + (2 + 3)^2} = \\frac{1}{26} \\approx$ **$3{,}9\\%$**. Bandingkan dengan asumsi return normal: $P(Z < -5) \\approx$ **$2{,}9 \\times 10^{-7}$**. Batas Cantelli lebih dari **seratus ribu kali lipat** lebih besar — itulah harga kejujuran di dunia berekor gemuk.`,
      jebakan: `(1) Memperlakukan batas atas sebagai estimasi peluang aktual — Cantelli memberi *ceiling*, bukan ramalan; peluang sebenarnya bisa jauh lebih kecil. (2) **Koreksi penting:** ringkasan Gemini sempat menulis rumusnya sebagai $\\frac{1}{1 + (L \\cdot SR)^2}$ — yang benar menurut teks bab adalah **$\\frac{1}{1 + (L + SR)^2}$**. Dengan $L = 2$, $SR = 3$: rumus yang salah memberi $\\frac{1}{37} \\approx 2{,}7\\%$, rumus yang benar memberi $\\frac{1}{26} \\approx 3{,}9\\%$ (sesuai contoh di bab).`,
    },
    {
      judul: `Capacity — kenapa Sharpe bagus belum tentu berguna`,
      ringkas: `Sharpe 2,0 pada volatilitas mungil bisa jadi tidak layak secara ekonomi — capacity menentukan seberapa besar strategi boleh dijalankan sebelum ia mati.`,
      definisi: `*Capacity* = PnL ekspektasi tertinggi yang bisa dihasilkan suatu strategi dalam horizon tertentu — secara operasional: **PnL maksimum dengan syarat SR berada di atas ambang yang bisa diterima** (atau, alternatifnya, dengan syarat return atas modal minimum).`,
      kenapa: `Ini obat dari jebakan "$SR = 2{,}0$, ayo tambah modal!". Godaannya logis: $E[PnL] = SR \\times \\text{volatilitas dolar}$ — jadi kenapa tidak jalankan strategi di volatilitas tak terbatas? Jawaban bab: **SR hampir selalu fungsi yang menurun terhadap volatilitas**. Pada volatilitas cukup besar SR menjadi nol, dan melewati ambang itu strategi tidak menguntungkan. Jadi ada titik di mana menambah skala justru membunuh strategi — dan titik PnL maksimum sebelum ambang itulah capacity.`,
      contoh: `Strategi dijalankan pada volatilitas 10 juta dolar AS dengan $SR = 1{,}2$ → $E[PnL] = \\text{12 juta dolar AS}$. Skala dinaikkan ke volatilitas 50 juta dolar AS, tetapi SR merosot ke $0{,}3$ → $E[PnL] = \\text{15 juta dolar AS}$. Dinaikkan lagi, SR menyentuh $0$ → strategi mati. Capacity-nya ada di suatu tempat di antara 12–15 juta dolar AS itu, tergantung ambang SR yang kamu tetapkan.`,
      jebakan: `(1) Menilai strategi hanya dari SR pada volatilitas rendah — SR yang indah dengan PnL yang mungil adalah strategi yang **tidak layak secara ekonomi**; dana kelolaan butuh dolar, bukan rasio. (2) Mengira capacity = "volatilitas maksimum" — bukan; capacity diukur dalam **PnL**, dengan SR sebagai syaratnya.

---`,
    },
  ],
  cheatsheet: `Cheatsheet Bab

> Satu halaman ringkas — cetak dan tempel. Semua definisi & rumus dari Bab 3 (sudah diverifikasi ke teks bab).

**Empat metrik kinerja:** expected return · volatility · Sharpe/Information Ratio · capacity

**Rumus & hubungan penting**
- **Expected Return** $= \\frac{PnL}{AuM}$ — stationary (distribusi $\\approx$ sama antar periode) & intensive (independen dari skala modal)
- **Sharpe Ratio** $= \\frac{E[r]}{\\sigma(r)}$ · **Information Ratio** = versi SR untuk *idiosyncratic returns* (komponen return intrinsik, bukan faktor bersama — detail di Bab 4)
- **Estimator SR:** $\\hat{SR} = \\hat{\\mu}/\\hat{\\sigma}$, dengan $\\hat{\\mu} = \\frac{1}{T}\\sum_t r_t$ dan $\\hat{\\sigma} = \\sqrt{\\frac{1}{T}\\sum_t (r_t - \\hat{\\mu})^2}$
- **Standard error:** $SE(\\hat{SR}) = \\sqrt{\\frac{1 + SR^2/2}{T}}$ — untuk excess return iid bervarians terhingga; bila $\\sigma$ diketahui: $SE = 1/\\sqrt{T}$
- **Autokorelasi:** $\\mathrm{cor}(r_s, r_t) = \\rho^{|t-s|}$, $|\\rho|$ kecil → estimator disesuaikan $\\approx (\\hat{\\mu}/\\hat{\\sigma})(1 - \\rho)$
- **Dimensi:** return $[time]^{-1}$ · varians $[time]^{-1}$ · volatilitas $[time]^{-1/2}$ · **SR $[time]^{-1/2}$**
- **Konversi SR:** harian → bulanan $\\times$**$\\sqrt{21}$** · harian → tahunan (AS) $\\times$**$\\sqrt{251}$** (251 hari bursa AS per 2024; tergantung negara/aset/tahun)
- **Cantelli:** $P(\\xi < -L\\sigma) \\leq$ **$\\frac{1}{1 + (L + SR)^2}$** — berlaku untuk distribusi APA PUN · contoh: $SR = 3$, $L = 2$ → $\\leq \\frac{1}{26} \\approx 3{,}9\\%$ (vs $2{,}9 \\times 10^{-7}$ bila normal)
- **Capacity:** max $E[PnL]$ dengan syarat $SR \\geq$ ambang layak (atau return atas modal $\\geq$ minimum) — karena SR hampir selalu *menurun* terhadap volatilitas
- **Excess return** (dipakai umum): return strategi − risk-free (mis. yield Treasury 3 bulan) = return sekuritas yang dibiayai sendiri (pinjam 1 dolar AS di risk-free, beli 1 dolar AS sekuritas)

**Cacat SR (hafalkan):** peringkat terbalik saat expected return negatif ($-5\\%/\\sigma 5\\% \\to SR = -1 < -5\\%/\\sigma 10\\% \\to SR = -0{,}5$) · mewarisi keterbatasan volatilitas sebagai ukuran risiko
**Kelebihan SR (hafalkan):** intuitif (return per unit risiko) · teori kaya (interval kepercayaan, Cantelli, regresi cross-sectional)

---`,
  prediksi: [
    {
      id: "P1",
      pertanyaan: `Kalau kamu diminta menilai seorang manajer portofolio, metrik apa saja yang akan kamu pakai? (Coba sebutkan sebelum membaca — lalu bandingkan dengan jawaban bab.)`,
      kunci: `Bab ini menetapkan **empat metrik**: expected return, volatility, Sharpe Ratio (dan Information Ratio), capacity. Kalau jawabanmu hanya "return dan risiko", kamu melewatkan dua hal: SR menggabungkan keduanya menjadi return per unit risiko, dan capacity menentukan apakah strategi itu layak secara ekonomi pada skala nyata.`,
    },
    {
      id: "P2",
      pertanyaan: `Menurutmu, kenapa praktisi kuantitatif memakai *return* (persentase) dan bukan nominal uang (rupiah/dolar) untuk mengukur kinerja? Kondisi apa yang membuat perbandingan antar-periode dan antar-dana menjadi sah?`,
      kunci: `Karena return bersifat **stationary** (distribusinya kurang-lebih sama antar periode investasi) dan **intensive** (tidak bergantung pada besar modal) — normalisasi PnL/AuM inilah yang membuat perbandingan antar-periode dan antar-dana menjadi bermakna. (Catatan lanjutan: sifat intensive ini hanya aproksimasi — di skala besar, capacity menunjukkan return justru menurun.)`,
    },
    {
      id: "P3",
      pertanyaan: `Sebuah strategi diiklankan dengan "Sharpe Ratio 2,0". Sebelum kamu memutuskan alokasi modal, satu pertanyaan kritis apa yang harus kamu ajukan soal angka itu — dan kenapa jawabannya bisa membuat strategi tersebut tidak layak secara ekonomi?`,
      kunci: `Tanyakan: **"Pada volatilitas/skala berapa SR itu diukur, dan bagaimana SR berubah saat skala dinaikkan?"** Karena SR hampir selalu *menurun* terhadap volatilitas — strategi dengan $SR = 2{,}0$ pada volatilitas kecil bisa runtuh ke $SR \\approx 0$ saat diperbesar. Yang menentukan kelayakan ekonomi bukan SR-nya, melainkan **capacity**: PnL maksimum yang bisa dihasilkan dengan SR di atas ambang yang bisa diterima.`,
    },
  ],
  kuis: [
    {
      pertanyaan: `Menurut Bab 3, *expected return* suatu strategi didefinisikan sebagai …`,
      opsi: [
        `A. PnL dibagi Assets under Management (AuM)`,
        `B. PnL dikurangi AuM`,
        `C. AuM dibagi PnL`,
        `D. rata-rata harga aset dikali volume perdagangan`,
      ],
      benar: 0,
      penjelasan: `definisi 3.1: expected return = PnL/AuM; normalisasi inilah yang membuatnya stationary & intensive.`,
    },
    {
      pertanyaan: `Return dipakai (bukan nominal uang) karena normalisasi itu bersifat …`,
      opsi: [
        `A. stationary dan intensive — distribusinya kurang-lebih sama antar periode dan independen dari besar modal`,
        `B. stationary dan extensive — tumbuh sebanding dengan modal`,
        `C. non-stationary dan intensive — berubah tiap periode tetapi independen dari modal`,
        `D. identik dengan PnL nominal, hanya beda satuan`,
      ],
      benar: 0,
      penjelasan: `stationary: distribusi kurang-lebih sama antar periode; intensive: independen dari besar modal → bisa dibandingkan antar periode dan antar dana.`,
    },
    {
      pertanyaan: `Dua kelemahan Sharpe Ratio menurut bab ini adalah …`,
      opsi: [
        `A. sulit dihitung dan tidak punya interval kepercayaan`,
        `B. memberi peringkat terbalik saat expected return negatif, dan mewarisi keterbatasan volatilitas sebagai ukuran risiko`,
        `C. hanya berlaku untuk return harian dan tidak bisa diannualisasi`,
        `D. mensyaratkan distribusi normal dan tidak punya batas Cantelli`,
      ],
      benar: 1,
      penjelasan: `contoh $-5\\%/\\sigma 5\\%$ ($SR = -1$) vs $-5\\%/\\sigma 10\\%$ ($SR = -0{,}5$): pecundang yang lebih berisiko berperingkat lebih tinggi; plus SR mewarisi keterbatasan volatilitas sebagai ukuran risiko.`,
    },
    {
      pertanyaan: `Strategi dengan SR tahunan 3 dan volatilitas tahunan 50 juta dolar AS. Menurut ketidaksamaan Cantelli, batas atas peluang rugi 100 juta dolar AS (2 simpangan baku) adalah …`,
      opsi: [
        `A. $3{,}9\\%$ — karena $\\frac{1}{1 + (2 + 3)^2} = \\frac{1}{26}$,`,
        `B. $2{,}7\\%$ — karena $\\frac{1}{1 + (2 \\times 3)^2} = \\frac{1}{37}$,`,
        `C. $2{,}9 \\times 10^{-7}$ — sama seperti di bawah asumsi normal`,
        `D. $25\\%$ — karena $(2/3)^2 \\approx 0{,}44$`,
      ],
      benar: 0,
      penjelasan: `rumus yang benar dari teks bab: $\\frac{1}{1 + (L + SR)^2} = \\frac{1}{26} \\approx 3{,}9\\%$. Pilihan B memakai rumus yang salah $(L \\times SR)^2 \\to \\frac{1}{37} \\approx 2{,}7\\%$ — itu kesalahan yang sempat ada di ringkasan Gemini. Pilihan C adalah nilai di bawah asumsi normal, bukan batas Cantelli (yang berlaku untuk distribusi apa pun).`,
    },
    {
      pertanyaan: `SR harian suatu strategi ekuitas AS adalah 0,1. SR tahunannya kira-kira …`,
      opsi: [
        `A. $1{,}58$ ($0{,}1 \\times \\sqrt{251}$),`,
        `B. $0{,}46$ ($0{,}1 \\times \\sqrt{21}$),`,
        `C. 25,1 (0,1 × 251)`,
        `D. $0{,}0063$ ($0{,}1 / \\sqrt{251}$),`,
      ],
      benar: 0,
      penjelasan: `$0{,}1 \\times \\sqrt{251} \\approx 0{,}1 \\times 15{,}84 \\approx 1{,}58$. Pilihan B adalah konversi ke bulanan ($\\times\\sqrt{21}$).`,
    },
    {
      pertanyaan: `Dari T = 252 observasi return harian, diestimasi SŔ = 1,5. Standard error estimator tersebut kira-kira …`,
      opsi: [
        `A. $0{,}09$ — sehingga interval kepercayaan $95\\% \\approx 1{,}5 \\pm 0{,}18$,`,
        `B. 0,004 — sehingga estimasinya praktis pasti`,
        `C. $0{,}63$ — sehingga estimasinya tidak informatif`,
        `D. 1,50 — sama besar dengan estimasinya`,
      ],
      benar: 0,
      penjelasan: `$SE = \\sqrt{\\frac{1 + 1{,}5^2/2}{252}} = \\sqrt{\\frac{2{,}125}{252}} \\approx 0{,}092$; $1{,}96 \\times 0{,}092 \\approx 0{,}18$. Pilihan B keliru menaruh $T$ di luar akar dengan cara yang salah; C mendekati $1/\\sqrt{T}$ tanpa koreksi SR.`,
    },
    {
      pertanyaan: `*Capacity* suatu strategi menurut Bab 3 adalah …`,
      opsi: [
        `A. PnL ekspektasi maksimum yang bisa dicapai dengan syarat Sharpe Ratio di atas ambang yang bisa diterima`,
        `B. volatilitas maksimum yang bisa dijalankan sebelum margin habis`,
        `C. Sharpe Ratio tertinggi yang pernah dicatat strategi itu`,
        `D. modal maksimum yang bisa dihimpun manajer dari investor`,
      ],
      benar: 0,
      penjelasan: `definisi 3.4: PnL maksimum dengan syarat SR di atas ambang layak. Penting karena SR hampir selalu menurun terhadap volatilitas — strategi SR bagus di skala kecil bisa mati di skala besar.`,
    },
    {
      pertanyaan: `Kalimat pembuka bab membedakan manajer diskresioner dan kuantitatif sebagai …`,
      opsi: [
        `A. diskresioner *satisfice*, kuantitatif *optimize*`,
        `B. diskresioner *optimize*, kuantitatif *satisfice*`,
        `C. keduanya *satisfice* — bedanya hanya pada data yang dipakai`,
        `D. keduanya tidak memakai metrik kinerja sama sekali`,
      ],
      benar: 0,
      penjelasan: `kalimat pembuka bab; dengan catatan bab mengakui ini "tidak sepenuhnya adil" — manajer diskresioner pun mengoptimasi secara naluriah (analogi hiu macan & burung warbler).`,
    },
  ],
  fsrs: [
    { depan: `Definisi expected return menurut Bab 3.`, belakang: `Rasio $\\frac{PnL}{AuM}$ — Profit and Loss terhadap Assets under Management.` },
    { depan: `Apa arti "stationary" dan "intensive" pada return.`, belakang: `Stationary = distribusinya kurang-lebih sama antar periode investasi; intensive = independen dari besar modal yang diinvestasikan.` },
    { depan: `Alasan empiris pemakaian volatilitas (Cont, 2001).`, belakang: `Tail index return saham di antara 2 dan 5 → hanya momen keempat yang dijamin terhingga → volatilitas bisa diestimasi, tetapi skewness/kurtosis belum tentu.` },
    { depan: `Tiga set asumsi yang membenarkan volatilitas lewat optimasi utilitas (Huang & Litzenberger, 1988).`, belakang: `(1) utilitas diaproksimasi Taylor orde-2 + return bervarians terhingga; (2) bentuk utilitas spesifik (eksponensial / power γ∈(0,1) / log); (3) utilitas sembarang + return berdistribusi normal.` },
    { depan: `Definisi Sharpe Ratio dan Information Ratio.`, belakang: `$SR = \\text{expected return} / \\text{volatilitas}$ (return per unit risiko); IR = analog SR tetapi memakai idiosyncratic returns (komponen intrinsik, bukan faktor bersama).` },
    { depan: `Dua kelemahan Sharpe Ratio menurut bab ini.`, belakang: `(1) peringkat terbalik saat expected return negatif ($-5\\%/\\sigma 5\\% \\to SR = -1 < -5\\%/\\sigma 10\\% \\to SR = -0{,}5$); (2) mewarisi keterbatasan volatilitas sebagai ukuran risiko.` },
    { depan: `Ketidaksamaan Cantelli untuk batas rugi.`, belakang: `$P(\\xi < -L\\sigma) \\leq \\frac{1}{1 + (L + SR)^2}$ — berlaku untuk distribusi return APA PUN dengan SR tersebut.` },
    { depan: `Dimensi Sharpe Ratio dan faktor konversi waktunya.`, belakang: `SR berdimensi $[time]^{-1/2}$; harian → bulanan $\\times\\sqrt{21}$; harian → tahunan (AS) $\\times\\sqrt{251}$.` },
    { depan: `Standard error estimator Sharpe Ratio.`, belakang: `$SE(\\hat{SR}) = \\sqrt{\\frac{1 + SR^2/2}{T}}$ untuk excess return iid bervarians terhingga; bila $\\sigma$ diketahui: $SE = 1/\\sqrt{T}$; dengan autokorelasi $\\rho$ kecil: $\\approx (\\hat{\\mu}/\\hat{\\sigma})(1 - \\rho)$.` },
    { depan: `Definisi capacity dan kenapa ia penting.`, belakang: `PnL ekspektasi maksimum dengan syarat SR di atas ambang yang bisa diterima; penting karena SR hampir selalu menurun terhadap volatilitas — strategi SR bagus di skala kecil bisa tidak layak secara ekonomi.` },
  ],
  feynman: [
    {
      poin: `Satisfice vs optimize dan pertukaran peran objective/constraint`,
      penajaman: `kalau ditanya "apa beda manajer diskresioner dan quant menurut bab ini, dan kenapa bab bilang pembedanya tidak sepenuhnya adil?", harus bisa jawab: diskresioner mencari hasil yang cukup baik, quant memformulasikan optimasi eksplisit — tetapi diskresioner pun mengoptimasi secara naluriah (hiu macan, burung warbler).`,
    },
    {
      poin: `Kenapa return = PnL/AuM: stationary & intensive`,
      penajaman: `kalau ditanya "kenapa tidak pakai nominal rupiah saja?", harus bisa jawab soal perbandingan antar-periode (stationary) dan antar-dana (intensive) — plus batasnya: di skala besar, capacity menunjukkan return justru menurun.`,
    },
    {
      poin: `Dua cacat Sharpe Ratio`,
      penajaman: `kalau ditanya "kenapa SR bisa bilang pecundang yang lebih berisiko itu 'lebih baik'?", harus bisa hitung contoh $-5\\%/\\sigma 5\\%$ ($SR = -1$) vs $-5\\%/\\sigma 10\\%$ ($SR = -0{,}5$).`,
    },
    {
      poin: `Dimensi SR $[time]^{-1/2}$ dan penskalaan $\\sqrt{T}$`,
      penajaman: `kalau ditanya "kenapa $SR_\\text{harian} = 0{,}08$ menjadi $SR_\\text{tahunan} = 1{,}27$?", harus bisa turunkan dari $\\mu_\\text{tahunan} = T \\cdot \\mu_\\text{harian}$ dan $\\sigma_\\text{tahunan} = \\sqrt{T} \\cdot \\sigma_\\text{harian}$ — dan sebutkan asumsi yang dipakai (return tidak ber-autokorelasi).`,
    },
    {
      poin: `Koreksi autokorelasi pada estimator SR`,
      penajaman: `kalau ditanya "apa efek autokorelasi positif terhadap SR naif?", harus bisa jawab: SR naif terlihat lebih bagus dari seharusnya; koreksinya $\\approx (\\hat{\\mu}/\\hat{\\sigma})(1 - \\rho)$.`,
    },
    {
      poin: `Standard error estimator SR`,
      penajaman: `kalau ditanya "dengan 252 observasi dan $\\hat{SR} = 1{,}5$, seberapa yakin kamu?", harus bisa hitung $SE \\approx 0{,}09$ dan interval $95\\% \\approx 1{,}5 \\pm 0{,}18$.`,
    },
    {
      poin: `Batas Cantelli: rumus, contoh, dan maknanya`,
      penajaman: `kalau ditanya "$SR = 3$, $\\sigma$ = 50 juta dolar AS — berapa batas peluang rugi 100 juta dolar AS?", harus bisa jawab $\\frac{1}{1 + (2+3)^2} = \\frac{1}{26} \\approx 3{,}9\\%$, berlaku untuk distribusi apa pun, dan bandingkan dengan $2{,}9 \\times 10^{-7}$ di dunia normal.`,
    },
    {
      poin: `Kenapa rumus Cantelli memakai (L + SR)² bukan (L × SR)²`,
      penajaman: `kalau ditanya "dari mana bentuk itu berasal?", harus bisa turunkan: $\\mu = SR \\cdot \\sigma$ disubstitusikan ke $P(\\xi < -\\lambda) \\leq \\frac{\\sigma^2}{\\sigma^2 + (\\lambda + \\mu)^2}$ dengan $\\lambda = L\\sigma$.`,
    },
    {
      poin: `Capacity dan jebakan "SR = E[PnL]/volatilitas dolar"`,
      penajaman: `kalau ditanya "kenapa tidak jalankan strategi di volatilitas tak terbatas?", harus bisa jawab: SR hampir selalu menurun terhadap volatilitas; melewati ambang tertentu $SR = 0$ dan strategi mati — capacity adalah PnL maksimum sebelum itu.`,
    },
    {
      poin: `Empat metrik dan kapan masing-masing dipakai`,
      penajaman: `kalau ditanya "kapan keempat metrik ini muncul lagi di buku?", harus bisa jawab: SR/IR dipakai di seluruh bab pemodelan dan portofolio (Bab 4, 8–13); capacity menentukan kelayakan ekonomi strategi di dunia nyata.`,
    },
  ],
  rumus: [
    {
      id: `bab3-cantelli`,
      judul: `Batas Cantelli — peluang rugi tanpa asumsi distribusi`,
      latex: `P(\\xi < -L\\sigma) \\leq \\frac{1}{1+(L+SR)^2}`,
      variabel: [
        { simbol: `\\xi`, arti: `return tahunan strategi (variabel acak)` },
        { simbol: `L`, arti: `kerugian dinyatakan sebagai kelipatan simpangan baku (rugi −Lσ)` },
        { simbol: `SR`, arti: `Sharpe Ratio tahunan strategi` },
        { simbol: `\\sigma`, arti: `volatilitas — simpangan baku return tahunan` },
      ],
      langkah: [
        `Contoh bab: $SR = 3$ (tahunan), kerugian $L = 2$ simpangan baku.`,
        `$L + SR = 2 + 3 = 5$`,
        `$5^2 = 25$ → $1 + 25 = 26$`,
        `$P(\\xi < -2\\sigma) \\leq \\frac{1}{26} \\approx 3{,}9\\%$`,
      ],
      hasil: `**$P(\\xi < -2\\sigma) \\leq 3{,}9\\%$** — berlaku untuk **distribusi return apa pun** dengan $SR = 3$ (bandingkan $2{,}9 \\times 10^{-7}$ bila return normal — batas Cantelli >100.000× lebih besar).`,
      jebakan: `Jangan tulis $(L \\cdot SR)^2$ — rumus $\\frac{1}{1+(L \\cdot SR)^2} = \\frac{1}{37} \\approx 2{,}7\\%$ adalah kesalahan yang pernah dibuat ringkasan Gemini; yang benar menurut teks bab adalah $(L+SR)^2$.`,
    },
    {
      id: `bab3-sharpe`,
      judul: `Sharpe Ratio — return per unit risiko`,
      latex: `SR = \\frac{E[r]}{\\sigma(r)}`,
      variabel: [
        { simbol: `E[r]`, arti: `expected return strategi (PnL/AuM)` },
        { simbol: `\\sigma(r)`, arti: `volatilitas — simpangan baku return` },
        { simbol: `SR`, arti: `Sharpe Ratio: return per unit risiko` },
      ],
      langkah: [
        `Strategi A: $E[r] = 12\\%$ per tahun, $\\sigma(r) = 10\\%$ per tahun.`,
        `$SR = \\frac{12\\%}{10\\%} = 1{,}2$`,
        `Strategi B dengan $E[r]$ sama tetapi $\\sigma(r) = 20\\%$ → $SR = 0{,}6$ — separuhnya.`,
      ],
      hasil: `**$SR = 1{,}2$** — strategi A menghasilkan 1,2 unit return per 1 unit risiko (tahunan, karena inputnya tahunan).`,
      jebakan: `SR menyesatkan bila $E[r]$ negatif (pecundang yang lebih berisiko berperingkat lebih tinggi: $-5\\%/\\sigma 5\\% \\to SR = -1 < -5\\%/\\sigma 10\\% \\to SR = -0{,}5$); dan angka SR tanpa satuan waktu tidak berarti — $SR$ harian $0{,}08$ = $SR$ tahunan $\\approx 1{,}27$.`,
    },
    {
      id: `bab3-skala-sr`,
      judul: `Penskalaan waktu Sharpe Ratio — faktor √T`,
      latex: `SR_{\\text{tahunan}} = \\sqrt{T} \\cdot SR_{\\text{harian}}`,
      variabel: [
        { simbol: `SR_{\\text{harian}}`, arti: `Sharpe Ratio diukur dari return harian` },
        { simbol: `T`, arti: `jumlah hari bursa dalam setahun (AS: 251 per 2024)` },
        { simbol: `SR_{\\text{tahunan}}`, arti: `Sharpe Ratio tahunan (annualized)` },
      ],
      langkah: [
        `$\\mu_{\\text{tahunan}} = T \\cdot \\mu_{\\text{harian}}$; $\\sigma_{\\text{tahunan}} = \\sqrt{T} \\cdot \\sigma_{\\text{harian}}$`,
        `$SR_{\\text{tahunan}} = \\frac{T \\cdot \\mu_h}{\\sqrt{T} \\cdot \\sigma_h} = \\sqrt{T} \\cdot SR_{\\text{harian}}$`,
        `Contoh: $SR_{\\text{harian}} = 0{,}08$ → $0{,}08 \\times \\sqrt{251} \\approx 0{,}08 \\times 15{,}84 \\approx 1{,}27$`,
      ],
      hasil: `**$SR_{\\text{tahunan}} \\approx 1{,}27$** — angka inilah yang biasa dilaporkan sebagai “Sharpe tahunan”.`,
      jebakan: `Faktor $\\sqrt{T}$ hanya sah bila return tidak ber-autokorelasi — dengan autokorelasi $\\rho$, koreksi $\\approx (\\hat{\\mu}/\\hat{\\sigma})(1-\\rho)$; dan 251 spesifik AS/2024, bukan konstanta universal.`,
    },
  ],
  // Tata letak v2 (2026-10-17): jarak antar-simpul dilebarkan agar label garis
  // tidak bertabrakan dengan simpul; edge sr→cantelli dan cap→eret dirutekan
  // via titik bantu (lurus = menembus simpul ir / cantelli). Addendum LAPORAN_POLES_G1.md.
  peta: {
    nodes: [
      { id: `satisfice`, label: `Satisfice vs Optimize`, x: 150, y: 80, konsepId: 0 },
      { id: `objcon`, label: `Objective ⇄ Constraint`, x: 450, y: 80, konsepId: 1 },
      { id: `eret`, label: `Expected Return`, x: 750, y: 80, konsepId: 2 },
      { id: `vol`, label: `Volatility`, x: 1050, y: 80, konsepId: 3 },
      { id: `sr`, label: `Sharpe Ratio`, x: 300, y: 300, konsepId: 4 },
      { id: `ir`, label: `Information Ratio`, x: 620, y: 300, konsepId: 5 },
      { id: `cantelli`, label: `Batas Cantelli`, x: 940, y: 300, konsepId: 6 },
      { id: `dimensi`, label: `Dimensi & √T`, x: 300, y: 520, konsepId: 7 },
      { id: `est`, label: `Estimator SR`, x: 620, y: 520, konsepId: 8 },
      { id: `cap`, label: `Capacity`, x: 940, y: 520, konsepId: 9 },
    ],
    edges: [
      { from: `satisfice`, to: `objcon`, label: `diformalkan sebagai` },
      { from: `objcon`, to: `sr`, label: `bisa jadi target/batas` },
      { from: `eret`, to: `sr`, label: `pembilang` },
      { from: `vol`, to: `sr`, label: `penyebut` },
      { from: `sr`, to: `ir`, label: `analog: idiosyncratic` },
      { from: `sr`, to: `cantelli`, label: `menurunkan batas`, via: [{ x: 740, y: 460 }] },
      { from: `sr`, to: `dimensi`, label: `[time]⁻¹ᐟ²` },
      { from: `dimensi`, to: `est`, label: `koreksi skala √T` },
      { from: `sr`, to: `cap`, label: `menurun thd vol` },
      { from: `cap`, to: `eret`, label: `max E[PnL]`, via: [{ x: 1140, y: 300 }] },
    ],
  },
};
