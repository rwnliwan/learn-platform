# MLF-M4.4: Greeks & Dekomposisi Risiko — Dari Mana Datangnya Risiko?

## Masalah: Satu Call, Tiga Saham, dan Pertanyaan «Dari Mana Risikonya?»

Kamu memegang dua hal sekaligus. Pertama, satu call option pada indeks S&P 500 (^GSPC) — hak membeli indeks di harga 7.619,38 tiga bulan lagi. Kedua, portofolio saham Indonesia: BBCA, KLBF, UNVR, bobot sama. S&P naik 1 persen dan portofoliomu bergerak entah ke mana. Dua pertanyaan muncul — keduanya tentang risiko, tapi dari arah yang berbeda.

Pertanyaan pertama: call-mu naik berapa? Ia naik karena harga indeksnya naik (delta), naiknya itu sendiri berubah karena delta ikut bergerak (gamma), ia bisa naik atau turun karena volatilitas berubah (vega), dan setiap hari yang berlalu menggerogotinya sedikit (theta). Pertanyaan kedua: dari ketiga saham di portofoliomu, mana yang paling menyumbang risiko? Jawabannya bukan «yang bobotnya terbesar» — bobotnya sama semua. Jawabannya ada di volatilitas dan korelasi — dan angka yang menjawabnya bernama component VaR: UNVR menyumbang 40,98 persen dari VaR portofolio meski bobotnya sama dengan yang lain [notebook].

---

## 1. Black-Scholes: Harga Call ATM dan Lima Asumsi yang Wajib Ditulis

Harga call Eropa dari lima input: S, K, T, r, σ. d1 dan d2 mengubah kelima input itu menjadi probabilitas (risk-neutral): N(d1) adalah delta, N(d2) adalah probabilitas opsi berakhir in-the-money. Harga call = S × N(d1) − K × e^(−rT) × N(d2).

**Nilai [notebook]:** call ATM pada ^GSPC — S = 7.619,38, K = 7.619,38 (ATM), T = 0,25 tahun (3 bulan), r = 0,05, σ = 0,2243 (vol realized 20 hari, tahunan). Harga call 388,03 — sekitar 5,09 persen dari harga indeks.

**Lima asumsi eksplisit yang wajib ditulis.** Pertama, ^GSPC sendiri tidak bisa ditransaksikan — ia indeks, bukan aset; proxy yang bisa ditransaksikan adalah opsi indeks SPX (dan ETF seperti SPY untuk sahamnya). Kedua, r = 5 persen adalah ASUMSI — bukan suku bunga yang dikutip dari pasar pada 11 November 2026. Ketiga, σ = 0,2243 adalah realized vol 20 hari — volatilitas MASA LALU sebagai proksi masa depan — bukan implied vol dari harga opsi di pasar. Keempat, tanpa dividen — dividen indeks diabaikan, padahal S&P 500 membayar dividen. Kelima, call Eropa — hanya bisa dieksekusi saat jatuh tempo, bukan kapan saja (Amerika). Ubah satu asumsi, berubah harganya.

**Baik/buruk:** Black-Scholes bagus sebagai BAHASA — lima input, satu harga, lima turunan (Greeks) yang masing-masing bisa di-hedge. Buruk bila dibaca sebagai hukum alam: volatilitas tidak konstan (M4.3: ia bergerombol), return tidak normal (ekor gemuk), suku bunga tidak tetap.

**Mitigasi:** setiap kali melaporkan harga opsi, laporkan kelima inputnya berdampingan — S, K, T, r, σ — plus sumber σ-nya (di sini: realized 20 hari). σ adalah input yang PALING menentukan harga dan PALING tidak bisa diamati langsung.

$$C = S\, N(d_1) - K e^{-rT} N(d_2), \quad d_1 = \frac{\ln(S/K) + (r + \tfrac{1}{2}\sigma^2)T}{\sigma\sqrt{T}}, \quad d_2 = d_1 - \sigma\sqrt{T}$$

(N(·) = fungsi distribusi normal standar. Asumsi: tanpa dividen, call Eropa, ^GSPC tidak bisa ditransaksikan langsung — proxy: opsi indeks SPX.)

---

## 2. Delta & Gamma

Delta adalah turunan harga opsi terhadap harga saham — dan rasio hedge. Delta call ATM 0,5665 [notebook]: call naik $0,57 untuk tiap $1 kenaikan indeks; delta juga probabilitas (risk-neutral) opsi berakhir in-the-money, 56,65 persen.

**Nilai [notebook]:** S naik 1 persen (7.619,38 → 7.695,57, naik $76,19) → call naik $44,49 (repricing Black-Scholes) — perkiraan delta saja $43,17 (0,5665 × 76,19 ≈ $43,16), selisih $1,32 adalah suku gamma (lihat bagian Atribusi P&L). Delta SETELAH kenaikan menjadi 0,6011 — naik 0,0346. Gamma 0,000460 per $1: tiap $1 kenaikan S menaikkan delta 0,000460 — dikali $76,19, delta naik ≈ 0,0350, cocok dengan 0,0346 yang teramati.

**Hedge:** 1 kontrak = 100 saham (konvensi) → hedge 1 kontrak call = short 0,5665 × 100 ≈ 57 saham (atau ekuivalen indeksnya). Setelah S +1 persen, hedge menjadi 0,6011 × 100 ≈ 60 saham per kontrak.

**Gambar:** bar delta sebelum vs sesudah S naik 1 persen — 0,5665 vs 0,6011. Delta bukan konstanta; gamma mengukur seberapa cepat ia bergerak.

**Baik/buruk:** delta bagus karena memberi SATU angka untuk hedge yang bisa dieksekusi hari ini. Buruk bila hedge-nya dibiarkan: begitu S bergerak, delta berubah (gamma), dan hedge yang tadinya netral menjadi tidak netral. Gamma besar berarti delta berubah cepat — hedge cepat kedaluwarsa dan rebalancing mahal.

**Mitigasi:** tentukan ambang rebalancing SEBELUM berdagang — misal «rebalance bila delta bergerak lebih dari 0,05» — dan hitung biayanya sebagai bagian dari strategi, bukan sebagai kejutan. Delta hedging melindungi dari gerakan KECIL S; terhadap lompatan besar, pakai stress test (M4.5).

---

## 3. Vega, Theta, Rho

**Nilai [notebook]:** vega per +1pp vol 14,9867; theta per hari −2,3801; rho per +1pp suku bunga 9,8214. Sensitivitas harga call: S +1 persen → +$43,17 (efek delta saja; efek S TOTAL +$44,49 — lihat Atribusi P&L); vol +1pp → +$14,99; 1 hari berlalu → −$2,38; suku bunga +1pp → +$9,82.

**Gambar:** bar keempat sensitivitas dalam satu sumbu — bar S adalah efek S TOTAL (+$44,49 = delta 43,17 + gamma 1,34), bukan perkiraan delta saja. Hierarki: gerakan harga mendominasi (44,49 total), volatilitas kedua (14,99), suku bunga ketiga (9,82), waktu menggerogoti pelan tapi PASTI (−2,38 per hari — estimasi linear 90 hari × $2,38 ≈ $214, lebih dari separuh harga call 388,03; tapi itu MEREMEHKAN: theta mempercepat saat mendekati expiry, dan bila S tetap = K sampai expiry, call menjadi 0 — peluruhan kumulatifnya penuh 388,03, bukan $214).

**Baik/buruk:** vega bagus dibaca sebagai POSISI terhadap volatilitas — opsi panjang (long call) berarti long vega: UNTUNG bila volatilitas naik, RUGI bila turun. Membeli call ATM di tengah badai (vol tinggi) berarti membayar mahal untuk vega yang mungkin sudah di puncak. Theta bagus karena jujur: biaya sewa waktu — pemegang opsi membayar $2,38 per hari. Buruk bila theta dibaca sebagai «kerugian yang pasti»: theta adalah biaya bila SEMUA input lain diam — gerakan S bisa menutupnya berkali-kali lipat. Rho kecil pada T = 0,25 tahun; baru dominan pada opsi jangka panjang.

**Mitigasi:** bila kamu long call, tanyakan tiga hal setiap pagi — «apakah S bergerak ke arahku? (delta)», «apakah vol naik atau turun? (vega)», «berapa hari lagi yang saya bayar? (theta)». Bila short call, ketiganya berbalik: kamu DIBAYAR theta $2,38 per hari, tapi kamu short vega.

---

## 4. Atribusi P&L: Menjumlahkan Kelima Greek Menjadi Satu Perubahan Harga

Sejauh ini tiap Greek dibaca sendirian: delta bila S bergerak, vega bila vol bergerak, theta bila waktu berlalu, rho bila suku bunga bergerak. Di pasar nyata, semuanya bergerak BERSAMAAN — dan harga call berubah oleh gabungan kelimanya. Atribusi P&L menjumlahkan kelima efek itu menjadi satu perubahan harga — dan mengukur berapa yang TIDAK tertangkap oleh penjumlahan itu.

Rumusnya adalah ekspansi Taylor orde-1 ditambah suku gamma: ΔV ≈ Δ·ΔS + ½Γ(ΔS)² + Vega·Δσ + Θ·Δt + ρ·Δr. Tiap Greek adalah turunan parsial pada SATU titik. Menjumlahkannya adalah PERKIRAAN perubahan harga, bukan perubahan sebenarnya. Perubahan sebenarnya hanya didapat dengan repricing Black-Scholes — hitung ulang harga call dengan input yang baru. Selisih keduanya bernama residu: residu = perubahan sebenarnya − jumlah Taylor. Residu menampung semua yang tidak ditangkap Taylor: cross-Greek (vanna, volga, speed) plus suku orde tinggi lainnya.

**Nilai — atribusi S +1% saja [notebook]:** S naik 1 persen (ΔS = $76,19). Perkiraan delta saja: 0,5665 × 76,19 ≈ $43,17. Suku gamma: ½ × 0,000460 × 76,19² ≈ $1,34. Delta + gamma ≈ $44,50 (angka tak-bulat; jumlah suku yang dibulatkan 43,17 + 1,34 = 44,51 — selisih 1 sen adalah pembulatan). Perubahan SEBENARNYA (repricing Black-Scholes): $44,49 — residu −$0,01. Koreksi penting: $43,17 adalah perkiraan delta SAJA, bukan perubahan sebenarnya — call sebenarnya naik $44,49, dan selisih $1,32 dari perkiraan delta adalah suku gamma (dikurangi residu $0,01). Hedge delta-only meremehkan kenaikan harga sebesar $1,32 pada gerakan 1 persen — kecil, tapi bukan nol, dan ia tumbuh bersama ukuran gerakan.

**Nilai — skenario gabungan [ilustrasi]:** S naik 1 persen, vol naik 1 poin persen, 1 hari berlalu, suku bunga naik 1 poin persen. Rinciannya: delta $43,17 + gamma $1,34 + vega $14,99 + theta −$2,38 + rho $9,82 = $66,93. Perubahan SEBENARNYA (repricing): $67,23 — residu +$0,30. Pada gerakan kecil, Taylor bekerja sangat baik: residu $0,30 dari perubahan $67,23 — kurang dari setengah persen.

**Nilai — skenario BESAR [ilustrasi]:** S naik 5 persen, vol naik 3 poin persen, 5 hari berlalu, suku bunga naik 1 poin persen. Rinciannya: delta $215,83 + gamma $33,41 + vega $44,96 + theta −$11,90 + rho $9,82 = $292,12. Perubahan SEBENARNYA (repricing): $286,82 — residu −$5,30. Taylor kini MELEBIHI perubahan sebenarnya sebesar $5,30 — hampir 2 persen dari perubahan. Pelajarannya: residu kecil saat gerakan kecil (+$0,30 dari $67,23), membesar saat gerakan besar (−$5,30 dari $286,82). Taylor orde-1 + gamma akurat di dekat titik hitung, dan memburuk jauh darinya — karena gamma sendiri berubah sepanjang jalan (speed), dan vol yang bergerak mengubah delta serta vega (vanna, volga).

**Baik/buruk:** atribusi Taylor bagus karena ia memberi NAMA pada tiap dolar perubahan harga — dan residu yang kecil adalah bukti bahwa modelmu masih memegang pasar. Buruk bila dibaca sebagai harga yang sebenarnya: hedge delta-only meremehkan $1,32 pada gerakan 1 persen — kecil — tapi pada gerakan 5 persen residunya −$5,30, dan hedge yang dibangun dari Taylor saja makin meleset seiring gerakan membesar. Residu bukan «kesalahan Greeks» — ia adalah informasi bahwa gerakan sudah cukup besar sehingga aproksimasi linear + gamma tidak lagi cukup.

**Mitigasi:** untuk skenario KECIL (gerakan sekitar 1 persen, 1 hari), Taylor + gamma cukup — residu di bawah $0,50 adalah wajar. Untuk skenario BESAR (gerakan 5 persen atau lebih, beberapa hari, vol bergerak beberapa poin), JANGAN percaya Taylor — reprice penuh dengan Black-Scholes dan laporkan residunya berdampingan. Untuk hedging, rebalance gamma daripada berharap delta-only cukup — dan ingat: cross-Greek (vanna, volga, speed) tidak pernah tertangkap Taylor orde-1 + gamma; bila vol dan harga bergerak bersamaan secara besar, hanya repricing penuh yang jujur.

$$\Delta V \approx \Delta\, \Delta S + \tfrac{1}{2}\Gamma (\Delta S)^2 + \text{Vega}\, \Delta\sigma + \Theta\, \Delta t + \rho\, \Delta r$$

(Tiap Greek adalah turunan parsial pada satu titik. Jumlah Taylor adalah PERKIRAAN; harga sebenarnya = repricing Black-Scholes dengan input baru. Residu = sebenarnya − Taylor.)

---

## 5. Marginal VaR & Component VaR

Marginal VaR aset i = turunan VaR portofolio terhadap bobot aset i. Component VaR = bobot × marginal VaR. Teorema Euler: jumlah component VaR SEMUA aset = VaR portofolio.

**Nilai [notebook]:** VaR95 parametrik portofolio (log return) 0,0324. BBCA: marginal 0,0246, component 0,0082, share 0,2532. KLBF: marginal 0,0328, component 0,0109, share 0,3370. UNVR: marginal 0,0398, component 0,0133, share 0,4098. Penjumlahan Euler: 0,0082 + 0,0109 + 0,0133 = 0,0324 — menutup persis. Catatan: VaR95 parametrik log-return ini (0,0324) sedikit berbeda dari VaR95 parametrik simple-return di M4.2 (0,0328) — basis return-nya berbeda (log vs simple).

**Gambar:** bar share component VaR — BBCA 0,2532, KLBF 0,3370, UNVR 0,4098. UNVR lebih dari 40 persen risiko portofolio meski bobotnya sama.

**Baik/buruk:** component VaR bagus karena memberi peta risiko yang bisa ditindaklanjuti — «UNVR menyumbang 41 persen». Buruk bila dibaca sebagai vonis atas UNVR: share besar bisa berarti sahamnya memang paling volatil, atau paling tidak terdiversifikasi — dua diagnosis yang obatnya berbeda. Dekomposisi ini memakai VaR parametrik normal dan korelasi linear — tidak menangkap risiko ekor bersama saat krisis.

**Mitigasi:** laporkan SELALU tiga kolom berdampingan — marginal, component, share — plus penjumlahan Euler sebagai checks. Bila share sebuah aset jauh di atas bobotnya (UNVR: 0,4098 vs 0,3333), tandai untuk ditinjau — bukan untuk langsung dijual. Keputusan jual/beli memakai marginal VaR, bukan component VaR.

$$\text{ComponentVaR}_i = w_i \cdot \frac{\partial \text{VaR}}{\partial w_i}, \qquad \sum_i \text{ComponentVaR}_i = \text{VaR}$$

(Marginal VaR parametrik: z95 × (Σw)_i / σ_portofolio; jumlah component = VaR portofolio 0,0324.)

---

## 6. Beta vs ^GSPC

**Nilai [notebook]:** beta vs ^GSPC — BBCA 0,1272, KLBF 0,1943, UNVR 0,0248. Korelasi dengan ^GSPC — BBCA 0,0570, KLBF 0,0706, UNVR 0,0076. Semua sangat rendah: saham IDX hampir tidak bergerak bersama S&P 500. UNVR praktis tidak berhubungan sama sekali (korelasi 0,0076). Bandingkan korelasi antar saham IDX sendiri: BBCA–KLBF 0,3610, BBCA–UNVR 0,2850, KLBF–UNVR 0,3001.

**Baik/buruk:** beta rendah bagus untuk diversifikasi global — menambahkan saham IDX ke portofolio S&P hampir tidak menambah risiko pasar S&P-nya. Buruk bila dipakai sebagai lindung nilai yang salah alamat: meng-hedge portofolio IDX dengan short S&P futures hampir tidak melindungi apa-apa — beta 0,13 berarti hedge ratio kecil dan risiko spesifik IDX tetap dominan. Buruk bila beta dibaca sebagai «saham ini aman»: UNVR punya beta terendah (0,0248) DAN volatilitas tahunan tertinggi (0,4981). Beta mengukur risiko SISTEMATIS terhadap S&P; volatilitas mengukur risiko TOTAL.

**Mitigasi:** pilih benchmark yang relevan sebelum menghitung beta. Untuk portofolio IDX, benchmark yang benar adalah IHSG — bukan S&P 500. Beta vs S&P di sini adalah CONTOH perhitungan dan bukti segmentasi pasar (IDX vs AS), bukan alat hedge.

---

## 7. Keputusan Marginal: «Tambah atau Kurangi Posisi?»

Component VaR berkata «siapa penyumbang terbesar hari ini». Marginal VaR berkata «apa yang terjadi bila saya UBAH posisinya».

**Nilai [notebook]:** marginal VaR — UNVR 0,0398 > KLBF 0,0328 > BBCA 0,0246. Naikkan bobot UNVR 1 poin persen, VaR naik sekitar 0,0398 × 0,01 = 0,000398. Bila punya Rp10 juta tambahan dan hanya peduli VaR, alokasikan ke BBCA — ia menambah VaR paling sedikit per rupiah. Bila harus MEMOTONG risiko, jual UNVR — tiap rupiahnya mengurangi VaR paling banyak.

**Baik/buruk:** marginal VaR bagus untuk keputusan KECIL (tambah/kurangi sedikit) — di situlah aproksimasi linear turunan akurat. Buruk untuk keputusan BESAR: menjual seluruh posisi UNVR tidak mengurangi VaR sebesar component-nya — bobot dan korelasi portofolio berubah, turunan di titik lama tidak lagi berlaku.

**Mitigasi:** pakai marginal VaR untuk «tambah/kurangi sedikit?», component VaR untuk «siapa penyumbang terbesar saat ini?», dan hitung ulang keduanya SETELAH perubahan besar. Untuk perubahan besar di tengah krisis, pakai stress test (M4.5), bukan turunan.

**Jembatan ke M5 (optimasi portofolio):** dua angka di lesson ini adalah BAHAN BAKU optimasi, bukan optimasi itu sendiri. Marginal VaR adalah GRADIEN — turunan VaR terhadap bobot — dan dalam optimasi portofolio (M5), gradien inilah yang menjadi turunan fungsi tujuan atau kendala: optimizer bergerak melawan gradien untuk menurunkan VaR, atau memakai gradien sebagai harga bayangan (shadow price) dari kendala risiko. Component VaR adalah ALOKASI risiko saat ini, dan di M5 ia menjadi dasar risk budgeting: menetapkan target alokasi risiko (misal tiap aset menyumbang risiko yang sama — risk parity — atau sebanding dengan return yang diharapkan) lalu mencari bobot yang mewujudkannya. Singkatnya: marginal VaR berkata «ke arah mana VaR bergerak bila bobot berubah», component VaR berkata «di mana risiko berada sekarang» — dan M5 memakai keduanya untuk MEMILIH bobot.

**Yang lesson ini TIDAK lakukan:** lesson ini tidak mengoptimasi apa pun. Tidak ada bobot optimal yang dihitung, tidak ada portofolio «terbaik» yang diklaim — hanya gradien dan alokasi pada bobot SAAT INI (sepertiga-sepertiga-sepertiga). Optimasi — memilih bobot baru dari gradien ini, dengan kendala return dan batas bobot, lalu memvalidasi hasilnya out-of-sample — adalah materi M5.

---

## Lab 1: Black-Scholes dari Nol

Call ATM mainan: S = K = 100, T = 0,25, r = 0,05, σ = 0,20. d1 = 0,1750, d2 = 0,0750, call = 4,6150, delta = 0,5695 [lab]. Delta mainan (0,5695) sangat dekat dengan delta nyata (0,5665) karena keduanya ATM dengan T = 0,25 dan r = 0,05; yang berbeda hanya σ (0,20 vs 0,2243) dan skala harga. Harga call mainan 4,6150 = 4,62 persen dari S — vs 388,03 / 7.619,38 = 5,09 persen di data nyata: lebih tinggi karena σ nyata lebih tinggi.

## Lab 2: Component VaR dari Nol

Portofolio 2 aset mainan: bobot 50/50, vol harian A 0,02 dan B 0,03, korelasi 0,40, mean 0. Volatilitas portofolio 0,0211, VaR95 0,0347, marginal A 0,0250 dan B 0,0444, component A 0,0125 dan B 0,0222 — jumlah component 0,0347 = VaR portofolio [lab]. Aset B menyumbang 64,04 persen risiko dengan bobot yang sama — karena volatilitasnya lebih tinggi DAN korelasinya positif. Marginal VaR B (0,0444) LEBIH BESAR dari VaR portofolio (0,0347) — bukan kesalahan: marginal adalah turunan, yang harus sama dengan VaR adalah JUMLAH component.

## Mini-case: Hedge Call-mu, Potong Risiko Portofoliomu

10 kontrak call ATM ^GSPC (1 kontrak = 100 saham), portofolio Rp100 juta. Hedge call: delta 0,5665 → short ≈ 57 saham ekuivalen indeks per kontrak, 567 total (senilai ≈ $4,32 juta). S naik 1 persen → call naik 10 × $44,49 = $444,90 — perkiraan delta saja 10 × $43,17 = $431,70, selisih $13,20 adalah suku gamma — delta menjadi 0,6011 → hedge menjadi ≈ 60 saham per kontrak (≈ 601 total). Theta: 10 × $2,3801 = $23,80 per hari. Potong VaR: target −0,00324 (10 persen dari 0,0324) → jual UNVR ≈ Rp8,14 juta (0,00324 / 0,0398 × Rp100 juta) vs BBCA ≈ Rp13,17 juta — UNVR paling efisien per rupiah. Hitung ulang VaR dan dekomposisinya setelah eksekusi.

## Guided Task di Colab

Notebook: colab/mlf-m44-guided-task.ipynb — Black-Scholes call ATM ^GSPC (harga 388,03; delta 0,5665; gamma 0,000460; vega 14,9867; theta −2,3801; rho 9,8214) + efek S +1 persen (call +$44,49 sebenarnya — perkiraan delta $43,17; delta 0,6011) + dekomposisi risiko (VaR95 0,0324; component 0,0082 / 0,0109 / 0,0133; share 0,2532 / 0,3370 / 0,4098) + beta vs ^GSPC (0,1272 / 0,1943 / 0,0248), lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/18ZdXvnwXRGDwaVGKulhLwA7-Wh18Xlo2

## Rangkuman

- Call ATM ^GSPC (S = K = 7.619,38, T = 0,25, r = 0,05, σ = 0,2243 realized 20 hari): harga 388,03; delta 0,5665; gamma 0,000460; vega 14,9867 per +1pp; theta −2,3801 per hari; rho 9,8214 per +1pp.
- Delta = hedge: 0,5665 × 100 ≈ 57 saham per kontrak (1 kontrak = 100 saham). S +1 persen → call +$44,49 (perkiraan delta $43,17), delta menjadi 0,6011 — gamma bekerja, hedge butuh rebalancing.
- Atribusi P&L (Taylor + gamma): S +1% saja — delta $43,17 + gamma $1,34 ≈ $44,50 vs sebenarnya $44,49 (residu −$0,01); skenario gabungan [ilustrasi] sebenarnya $67,23 vs Taylor $66,93 (residu +$0,30); skenario BESAR [ilustrasi] sebenarnya $286,82 vs Taylor $292,12 (residu −$5,30) — Taylor akurat di dekat titik hitung, memburuk jauh darinya; skenario besar wajib repricing penuh.
- Opsi panjang = long vega (untung bila vol naik); theta adalah biaya waktu $2,38 per hari; rho kecil pada T = 0,25 tahun.
- Dekomposisi risiko (VaR95 parametrik log-return 0,0324): BBCA marginal 0,0246 / component 0,0082 / share 0,2532; KLBF 0,0328 / 0,0109 / 0,3370; UNVR 0,0398 / 0,0133 / 0,4098 — jumlah component 0,0324 menutup (Euler).
- UNVR penyumbang risiko terbesar meski bobot sama — karena vol tahunannya tertinggi (0,4981). Marginal VaR untuk keputusan tambah/kurangi posisi; component VaR untuk peta kontribusi saat ini.
- Beta vs ^GSPC sangat rendah (BBCA 0,1272, KLBF 0,1943, UNVR 0,0248; korelasi 0,0570 / 0,0706 / 0,0076) — saham IDX hampir tidak bergerak bersama S&P; beta rendah bukan berarti aman (UNVR: beta terendah, vol tertinggi).
- Asumsi BS yang wajib ditulis: ^GSPC tidak bisa ditransaksikan (proxy SPX); r = 5 persen asumsi; σ realized 20 hari, bukan implied; tanpa dividen; call Eropa.
- Lab: Black-Scholes mainan (d1 = 0,1750, d2 = 0,0750, call = 4,6150, delta = 0,5695); component VaR 2-aset (VaR95 0,0347, component 0,0125 + 0,0222 menutup).
