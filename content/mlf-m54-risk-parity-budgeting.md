# MLF-M5.4: Risk Parity & Risk Budgeting — Membagi Risiko, Bukan Modal

## Masalah: Membagi Modal Sama Rata — Lalu Kaget Melihat Risikonya

Seorang pengelola dana membagi Rp100 juta sama rata ke tiga saham — BBCA, KLBF, UNVR — Rp33,3 juta tiap saham (equal-weight). Di kepalanya, risikonya terbagi rata juga: sepertiga-sepertiga-sepertiga. Salah: risiko tidak mengikuti modal — risiko mengikuti VOLATILITAS dan KORELASI. UNVR punya vol tahunan 0,5014, jauh di atas BBCA 0,3449.

Hasilnya [notebook]: pada portofolio equal-weight, risk contribution share BBCA hanya 0,2499, KLBF 0,3364, dan UNVR 0,4137. UNVR — dengan modal yang sama persis — menyumbang 41,37 persen dari seluruh risiko portofolio, sementara BBCA hanya 24,99 persen. Equal-weight: return −0,1406, vol 0,3114, Sharpe −0,6122. «Adil» di modal ternyata timpang di risiko.

Catatan basis: semua angka vol/Sharpe/risk parity di lesson ini memakai SIMPLE return (480 hari, 2024-11-04 s.d. 2026-11-11, dari 481 harga 2024-11-01 s.d. 2026-11-11, rf = 0,05) — berbeda basis dengan VaR95 parametrik M4.4 (0,0324) yang memakai LOG return; keduanya dilabeli, jangan dicampur.

---

## 1. Marginal & Risk Contribution

Marginal contribution (MC): turunan volatilitas portofolio terhadap bobot aset i — MC_i = (Σw)_i / σ_p. Risk contribution (RC): RC_i = w_i · MC_i = w_i (Σw)_i / σ_p. Teorema Euler: Σ_i RC_i = σ_p — volatilitas portofolio terpecah habis menjadi kontribusi tiap aset, tanpa sisa.

**Nilai [notebook] — equal-weight, σ_p = 0,3114:** marginal contribution BBCA 0,2334, KLBF 0,3143, UNVR 0,3865. Risk contribution: BBCA 0,0778, KLBF 0,1048, UNVR 0,1288 — jumlahnya 0,3114 = σ_p (Euler menutup). Share: 0,2499 / 0,3364 / 0,4137.

**Baik/buruk:** dekomposisi RC bagus karena mengubah vol — satu angka yang kabur — menjadi alamat: aset mana menyumbang berapa. Buruk bila dibaca sebagai «risiko aset itu sendiri»: RC UNVR 0,1288 bukan vol UNVR (0,5014) — ia adalah kontribusi UNVR SETELAH diversifikasi dan korelasi. RC adalah milik portofolio, bukan milik aset.

**Mitigasi:** laporkan RC shares (RC_i / σ_p) berdampingan dengan bobot, setiap kali kamu melaporkan portofolio.

$$RC_i = \frac{w_i (\Sigma w)_i}{\sigma_p} \quad \text{dan} \quad \sum_i RC_i = \sigma_p$$

---

## 2. Equal Risk Contribution

Risk parity = equal risk contribution (ERC): tiap aset menyumbang tepat 1/n dari total risiko. Dengan 3 aset: RC shares [0,3333; 0,3333; 0,3333]. Kondisinya: RC_1 = RC_2 = … = RC_n = σ_p / n.

**Nilai:** bobotnya TIDAK sama — justru bobot menyesuaikan sampai RC-nya sama. Aset bervol rendah diberi bobot LEBIH BESAR: BBCA (vol terendah 0,3449) mendapat bobot TERBESAR (0,398), UNVR (vol tertinggi 0,5014) mendapat bobot TERKECIL (0,2808). Korelasi (0,3488 / 0,2774 / 0,2897) menggeser bobot dari rumus kasar 1/vol, sehingga bobot pastinya hanya bisa dicari lewat optimasi.

**Baik/buruk:** ERC bagus bila kamu tidak percaya pada perkiraan return — ia tidak memakai μ sama sekali, hanya kovarians. Buruk bila return memang bisa diperkirakan: ERC mengabaikan informasi return sepenuhnya.

**Mitigasi:** jangan pakai ERC sebagai pengganti pandangan return — pakai sebagai jangkar; risk budgeting (bagian 5) membiarkanmu menargetkan RC yang tidak sama.

$$RC_1 = RC_2 = \dots = RC_n = \frac{\sigma_p}{n}$$

---

## 3. Risk Parity dari Data Pin

**Nilai [notebook]:** optimasi ERC (SLSQP, long-only, bobot jumlah 1) menghasilkan bobot [0,398; 0,3212; 0,2808], RC shares [0,3333; 0,3333; 0,3333] — persis sepertiga tiap aset — return −0,1575, vol 0,3037, Sharpe −0,6833 (rf = 0,05). Return-nya negatif: risk parity tidak menjanjikan return positif; ia menjanjikan KESEIMBANGAN risiko.

**Gambar:** bar bobot vs RC share tiap aset — bar bobot bertingkat (0,398 → 0,3212 → 0,2808), bar RC rata di garis 1/3.

**Baik/buruk:** risk parity bagus sebagai portofolio «tanpa pandangan» — tidak ada satu aset yang bisa menghancurkan portofolio sendirian. Buruk bila dibaca sebagai «aman»: vol 0,3037 masih tinggi — menyeimbangkan risiko TIDAK SAMA dengan menghilangkan risiko.

**Mitigasi:** bila vol 0,3037 terlalu tinggi, jawabannya adalah mencampur aset BEBAS RISIKO (kas), bukan «mencari ERC yang lebih aman» — tidak ada.

---

## 4. Empat Portofolio Berdampingan

**Nilai [notebook]:**

- **GMV** — bobot [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966, Sharpe −0,81, RC [0,5526; 0,27; 0,1774]. Vol TERENDAH — tapi BBCA menyumbang 55,26% risiko.
- **Risk parity** — bobot [0,398; 0,3212; 0,2808], return −0,1575, vol 0,3037, Sharpe −0,6833, RC [0,3333; 0,3333; 0,3333]. Vol hanya 0,0071 di atas GMV dan 0,0077 di bawah equal-weight.
- **Equal-weight** — bobot [1/3; 1/3; 1/3], return −0,1406, vol 0,3114, Sharpe −0,6122, RC [0,2499; 0,3364; 0,4137]. Return tertinggi di antara ketiganya yang terdiversifikasi — tapi RC-nya justru timpang (UNVR 41,37%; GMV lebih timpang, 55,26% di BBCA).
- **Max-Sharpe** — bobot [0; 0; 1], return 0,0796, vol 0,5014, Sharpe 0,059, RC [0; 0; 1]. Satu-satunya yang return-nya positif — karena menaruh SEMUA modal di UNVR. Itu taruhan satu saham yang dibungkus rumus optimasi.

**Gambar:** bar volatilitas keempatnya — risk parity (0,3037) duduk di antara GMV (0,2966) dan equal-weight (0,3114), jauh di bawah max-Sharpe (0,5014).

**Baik/buruk:** tidak ada yang «menang» mutlak; GMV menang di vol, max-Sharpe menang di return/Sharpe, risk parity menang di keseimbangan, equal-weight menang di kesederhanaan.

**Mitigasi:** laporkan SELALU keempat kolom — return, vol, Sharpe, DAN RC shares — saat membandingkan portofolio. Tanpa kolom RC, GMV dan max-Sharpe menyembunyikan konsentrasi risikonya.

---

## 5. Risk Budgeting

ERC menyamakan jatah risiko. Risk budgeting menggeneralisasi: kamu MENENTUKAN jatahnya. Contoh [ilustrasi] — target RC [0,5; 0,3; 0,2] pada kovarians data pin: bobot hasil optimasi [0,5157; 0,2910; 0,1932], RC shares persis [0,5; 0,3; 0,2], return −0,1855, vol 0,2970, Sharpe −0,7931.

**Nilai:** target RC BUKAN bobot — target BBCA 0,5 menghasilkan bobot 0,5157, digeser korelasi (BBCA–KLBF 0,3488, BBCA–UNVR 0,2774). ERC adalah kasus khusus risk budgeting (target 1/n). GMV dan max-Sharpe pun bisa DIBACA sebagai risk budgeting — target RC-nya tidak dipilih, melainkan HASIL: GMV «menargetkan» [0,5526; 0,27; 0,1774], max-Sharpe «menargetkan» [0; 0; 1].

**Baik/buruk:** risk budgeting bagus karena memisahkan dua keputusan — «berapa risiko tiap aset?» (kebijakan) dan «bobot berapa yang mewujudkannya?» (optimasi). Buruk bila targetnya ditetapkan tanpa alasan: target yang dipilih «karena terasa bagus» sama arbitrernya dengan bobot yang dipilih «karena terasa bagus».

**Mitigasi:** tulis target RC beserta ALASANNYA dan tinjau berkala — kovarians berubah, bobot yang mewujudkan target yang sama ikut berubah.

---

## 6. Jembatan M4.4: Component VaR

Risk budgeting tidak terikat pada vol — ia bekerja pada ukuran risiko APA PUN yang bisa dipecah dengan Euler, termasuk component VaR dari M4.4.

**Nilai [notebook, M4.4]:** portofolio equal-weight, VaR95 parametrik 0,0324 — component VaR BBCA 0,0082, KLBF 0,0109, UNVR 0,0133 (jumlah 0,0324, Euler menutup); shares 0,2532 / 0,3370 / 0,4098 (dari komponen tak-dibulatkan); marginal VaR 0,0246 / 0,0328 / 0,0398. UNVR penyumbang terbesar (40,98%) meski bobot sama — dua ukuran risiko (vol dan VaR) sepakat tentang siapa penyumbang terbesarnya.

**LABELI BASISNYA:** VaR95 0,0324 dihitung dari LOG return (VaR = 1,6449 × vol harian log return), sedangkan semua vol/Sharpe/RC di lesson ini dari SIMPLE return tahunan. 0,0324 adalah VaR HARIAN, 0,3037 adalah vol TAHUNAN — membandingkan keduanya langsung adalah membandingkan apel harian dengan jeruk tahunan. Setelah disamakan skalanya (vol harian ≈ 0,0191–0,0197), keduanya bercerita sama.

**Baik/buruk:** component VaR bagus karena berbicara dalam bahasa manajemen risiko — «berapa yang dipertaruhkan tiap aset pada hari buruk». Buruk bila dibaca sebagai «risiko total»: VaR95 diam tentang hari-hari di luar 5 persen itu (tugas Expected Shortfall, M4.2).

**Mitigasi:** jalankan budgeting pada DUA ukuran risiko — vol (hari biasa) dan VaR/ES (hari buruk) — dengan basisnya masing-masing.

---

## 7. Kapan Risk Parity Menang — dan Kapan Kalah Telak

**Pertama, LEVERAGE.** Risk parity klasik sering memakai leverage untuk menaikkan return aset bervol rendah — leverage melipatgandakan kerugian dan menimbulkan risiko pendanaan. Lesson ini memakai risk parity TANPA leverage (bobot jumlah 1), return −0,1575 apa adanya.

**Kedua, BULL MARKET TERKONSENTRASI.** UNVR satu-satunya saham yang naik (+0,0796): max-Sharpe +0,0796 vs risk parity −0,1575 vs equal-weight −0,1406. Portofolio yang menyeimbangkan risiko PASTI tertinggal dari yang terkonsentrasi di aset yang melesat.

**Ketiga, KONSENTRASI RISIKO TERSEMBUNYI.** RC seimbang mengukur risiko lewat kovarians HISTORIS (korelasi 0,28–0,35). Di hari krisis (M4.5: 16 Oktober 2026), korelasi melonjak mendekati 1 dan ketiganya jatuh bersamaan. Risk parity menyeimbangkan risiko idiosinkratik; ia tidak melindungi dari risiko sistematis.

**Nilai [notebook]:** urutan return — max-Sharpe +0,0796, equal-weight −0,1406, risk parity −0,1575, GMV −0,1903 — adalah urutan «seberapa banyak UNVR yang dipegang» (100%, 33%, 28%, 18%).

**Jebakan: «risiko sama» ≠ «return sama».** Risk parity return −0,1575 LEBIH RENDAH dari equal-weight −0,1406 meski risikonya lebih seimbang. RC yang sama tidak menjamin return yang sama — return ditentukan μ dan bobot, RC ditentukan Σ dan bobot.

**Mitigasi:** pakai risk parity sebagai inti (core), bukan keseluruhan; tentukan total risiko lewat alokasi ke kas, bukan leverage; uji dengan stress korelasi (M4.5) sebelum percaya pada RC shares yang seimbang.

---

## Lab 1: Optimasi ERC dengan SLSQP

Matriks kovarians tahunan + return tahunan (SIMPLE return, data pin) [notebook]. Lengkapi `risk_contrib` (RC_i = w_i · (Σw)_i — TAK-TERNORMALISASI, tanpa /σ_p; share = RC/vol²) dan `erc_objective` (jumlah kuadrat selisih tiap RC dari rata-rata RC), lalu SLSQP mencari bobotnya — long-only, bobot jumlah 1.

Hasil [lab]: bobot [0,3981; 0,3212; 0,2808], RC shares [0,3333; 0,3333; 0,3333], return −0,1575, vol 0,3037, Sharpe −0,6833. Perhatikan `options={"ftol": 1e-12, "maxiter": 1000}` — toleransi default SLSQP terlalu longgar: tanpa ftol ketat, optimizer berhenti di [0,4006; 0,3224; 0,2770] dengan RC shares [0,3370; 0,3358; 0,3273] — dekat tapi TIDAK sama dengan 1/3. Selalu PERIKSA RC shares hasil optimasi, jangan percaya bobotnya saja.

## Lab 2: Tabel Perbandingan 4 Portofolio + RC

Bobot keempat portofolio sudah ditulis eksplisit (kanonis [notebook]) — lengkapi RC shares di `stats()`.

Hasil [lab]: GMV ret=−0,1903 vol=0,2966 Sharpe=−0,8100 RC=[0,5526; 0,2700; 0,1774]; Risk parity ret=−0,1575 vol=0,3037 Sharpe=−0,6832 RC=[0,3333; 0,3334; 0,3334]; Equal-weight ret=−0,1406 vol=0,3114 Sharpe=−0,6122 RC=[0,2499; 0,3364; 0,4137]; Max-Sharpe ret=0,0796 vol=0,5014 Sharpe=0,0590 RC=[0,0000; 0,0000; 1,0000]. Sharpe risk parity tercetak −0,6832 (kanonis presisi penuh −0,6833) karena bobot dan MU di lab dibulatkan ke 4 desimal — selisih 0,0001 adalah harga pembulatan literal. Risk parity tidak menang di kolom mana pun — dan justru itu poinnya: ia satu-satunya baris yang TIDAK kalah telak di kolom mana pun.

## Guided Task di Colab

Notebook: colab/mlf-m54-guided-task.ipynb — harga BBCA/KLBF/UNVR (2024-11-01 s.d. 2026-11-11) + SIMPLE return 480 hari + kovarians tahunan + marginal & RC equal-weight (MC 0,2334 / 0,3143 / 0,3865; RC shares 0,2499 / 0,3364 / 0,4137) + optimasi ERC SLSQP (bobot [0,398; 0,3212; 0,2808], RC 1/3, return −0,1575, vol 0,3037, Sharpe −0,6833) + tabel 4 portofolio + risk budgeting target [0,5; 0,3; 0,2] [ilustrasi] (bobot [0,5157; 0,2910; 0,1932]) + jembatan M4.4 component VaR (VaR95 0,0324; component 0,0082 / 0,0109 / 0,0133; shares 0,2532 / 0,3370 / 0,4098), lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/14clsBe3zFiIRGt5ukTqUpRfgC9sLt7dL.

## Rangkuman

- Alokasi modal ≠ alokasi risiko: equal-weight [notebook] RC shares [0,2499; 0,3364; 0,4137] — UNVR 41,37% risiko dengan bobot 1/3.
- Risk contribution RC_i = w_i (Σw)_i / σ_p; teorema Euler: Σ RC_i = σ_p. Equal-weight: MC 0,2334 / 0,3143 / 0,3865, RC 0,0778 / 0,1048 / 0,1288 (jumlah 0,3114 = σ_p).
- Equal risk contribution: RC shares [1/3; 1/3; 1/3] — bobot TIDAK sama rata, bobotlah yang menyesuaikan sampai RC-nya sama.
- Risk parity dari data pin [notebook]: bobot [0,398; 0,3212; 0,2808], RC shares persis 1/3 tiap aset, return −0,1575, vol 0,3037, Sharpe −0,6833.
- Empat portofolio [notebook]: GMV vol 0,2966 tapi RC BBCA 0,5526; risk parity vol 0,3037 di tengah; equal-weight vol 0,3114 RC UNVR 0,4137; max-Sharpe [0; 0; 1] return +0,0796 vol 0,5014 RC [0; 0; 1].
- Risk budgeting [ilustrasi]: target RC [0,5; 0,3; 0,2] → bobot [0,5157; 0,2910; 0,1932] — target RC bukan bobot.
- Jembatan M4.4 [notebook]: component VaR (LOG return) VaR95 0,0324 — BBCA 0,0082 / KLBF 0,0109 / UNVR 0,0133, shares 0,2532 / 0,3370 / 0,4098; basis LOG vs SIMPLE jangan dicampur.
- Risk parity kalah saat leverage dipakai, saat bull market terkonsentrasi (max-Sharpe +0,0796 vs RP −0,1575), dan saat korelasi melonjak di krisis; «risiko sama» ≠ «return sama».
- Lab: optimasi ERC dengan SLSQP — bobot [0,3981; 0,3212; 0,2808], RC 1/3 semua (ftol 1e-12 wajib — default berhenti di [0,4006; 0,3224; 0,2770]); tabel 4 portofolio — GMV RC BBCA 0,5526, RP 1/3 semua, EW UNVR 0,4137, max-Sharpe RC [0; 0; 1].
