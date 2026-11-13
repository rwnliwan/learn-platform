# MLF-M9.3: Backtesting & Walk-Forward — Apakah VaR-mu Jujur?

## Masalah: VaR yang Tidak Pernah Di-backtest adalah Klaim, Bukan Ukuran

Seorang risk manager mempresentasikan VaR95 portofolionya: 2,86% per hari [M4.2]. Angka itu rapi, dihitung dari 480 hari data, dan terlihat meyakinkan. Lalu seseorang di ruangan bertanya satu kalimat: «Berapa kali VaR itu tertembus dalam 230 hari terakhir — dan apakah tembusannya datang sendiri-sendiri, atau bergerombol?» Ruangan itu hening. VaR yang tidak pernah di-backtest adalah klaim, bukan ukuran.

Lesson ini adalah pemeriksaannya. Portofolio yang sama seperti M4.2 dan M5 — equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480 (2024-11-04 → 2026-11-11; return pertama 2024-11-04; harga pertama 2024-11-01), simpangan baku harian 0,0196 — dan VaR historisnya diuji secara out-of-sample (OOS): VaR dihitung dari jendela masa lalu, diuji pada hari yang belum pernah dilihat jendela itu. Bedakan SIMPLE vs LOG return secara eksplisit: seluruh lesson ini memakai SIMPLE returns; LOG returns hanya dipakai di simulasi Monte Carlo M9.1, bukan di sini. Exceedance didefinisikan satu arah: return hari itu < −VaR.

Ada satu jebakan yang harus dikenali sebelum menghitung — jebakan yang sudah kamu kenal dari M4.3: menguji VaR pada sampel yang sama dengan sampel yang membangunnya. VaR95 full-sample diuji pada 480 hari yang sama: exceedance 24 dari 480, LR Kupiec = 0, p = 1 — lolos SEMPURNA, karena ambangnya dibangun dari data itu sendiri. Itu bukan bukti VaR-nya bagus; itu bukti ujinya tidak menguji apa-apa.

---

## 1. VaR yang Tidak Pernah Di-backtest adalah Klaim, Bukan Ukuran

**Nilai:** backtest bagus karena ia mengubah VaR dari JANJI menjadi CATATAN: «dalam 230 hari OOS, VaR95 tertembus 15 kali (diharapkan 11,5)». Tanpa backtest, VaR adalah angka yang tidak bisa disalahkan — dan angka yang tidak bisa disalahkan adalah angka yang tidak bisa dipercaya.

**Baik/buruk:** VaR95 historis full-sample 0,0286 [M4.2] itu bagus sebagai TITIK AWAL — ia dihitung dari data nyata dan konsisten dengan VaR parametrik 0,0328. Buruk bila dibaca sebagai «model ini sudah benar»: tanpa backtest OOS, kamu tidak tahu apakah 0,0286 itu batas yang jujur atau batas yang kebetulan — dan tanpa uji independence, kamu tidak tahu apakah 15 tembusannya datang tersebar atau bergerombol tepat saat modal paling dibutuhkan.

**Mitigasi:** jangan pernah menerima — atau menolak — sebuah VaR dari angkanya saja. Tanyakan dua hal sebelum memutuskan: berapa kali ia tertembus di data yang belum dilihatnya (coverage)? Dan apakah tembusannya datang sendiri-sendiri atau bergerombol (independence)?

---

## 2. Aturan Backtest yang Jujur: OOS, Exceedance, dan Uji Kupiec (POF)

**Aturan pertama — pisahkan yang membangun dan yang menguji:** VaR untuk hari t dihitung HANYA dari hari-hari sebelum t — jendela rolling 250 hari, atau expanding window yang membesar dari 250 hari awal. Hari t sendiri tidak pernah masuk ke jendela yang mengujinya.

**Aturan kedua — definisikan exceedance sebelum menghitung:** exceedance = return hari itu < −VaR. Return −3,00% terhadap VaR95 2,86% adalah exceedance; return −2,86% persis sama dengan batas BUKAN exceedance. Untuk VaR95, peluang exceedance yang dijanjikan adalah 1 − 0,95 = 0,05 — 5 dari 100 hari.

**Uji Kupiec POF (1995):** H0: peluang exceedance = 1 − α (untuk VaR95: 0,05). LR membandingkan likelihood data bila peluang exceedance-nya BENAR 0,05 versus likelihood bila peluangnya adalah frekuensi TERAMATI (x/n). Kupiec menguji UNCONDITIONAL COVERAGE SAJA — apakah JUMLAH exceedance-nya sesuai — bukan apakah exceedance-nya tersebar acak sepanjang waktu. Itu tugas uji independence (langkah 4).

**Contoh hitung — rolling 250-hari VaR95 OOS (hari 251–480, n=230):** exceedance teramati x = 15, diharapkan n × 0,05 = 230 × 0,05 = 11,5. Frekuensi teramati x/n = 15/230 = 0,0652 (6,52%) versus janji 0,05 (5%). LR = −2·ln[(0,95^215)·(0,05^15)] + 2·ln[(0,9348^215)·(0,0652^15)] = 1,0275. Di bawah H0, LR menyebar χ² dengan 1 derajat bebas; nilai kritis 5% adalah 3,841. Karena 1,0275 < 3,841, H0 TIDAK DITOLAK — p-value = 0,3108. Bacalah p-value itu dengan tepat: p = 0,3108 berarti «bila VaR ini jujur, hasil 15 dari 230 — atau yang lebih ekstrem — akan muncul 31,08% dari waktu». Itu BUKAN «peluang model benar 31%», dan BUKAN «model terbukti benar». p-value besar = «tidak ada bukti menolak», bukan «model benar».

**Nilai:** Kupiec bagus karena ia mengubah pertanyaan «apakah VaR-mu jujur?» dari perasaan menjadi ANGKA yang bisa diaudit: x, n, LR, p — empat angka, satu keputusan.

**Baik/buruk:** Kupiec bagus sebagai uji COVERAGE — ia menangkap VaR yang terlalu optimistis (x jauh di atas yang diharapkan) maupun terlalu konservatif (x jauh di bawah yang diharapkan). Buruk bila dibaca sebagai uji LENGKAP: Kupiec buta terhadap URUTAN — 15 exceedance yang tersebar merata dan 15 exceedance yang datang dalam tiga minggu berturut-turut memberi LR yang SAMA.

**Mitigasi:** setiap kali kamu melaporkan Kupiec, laporkan keempat angkanya bersama-sama — «n=230, x=15, diharapkan 11,5, LR=1,0275, p=0,3108» — dan tulis kalimat penutupnya dengan tepat: «tidak ada bukti menolak H0 pada 5%», bukan «VaR terbukti benar». Dan jangan pernah berhenti di Kupiec: lanjutkan ke uji independence.

---

## 3. Hasil Kita: Empat Varian OOS — Jendela dan Skema Memengaruhi Vonis

**Nilai [m9_canonical.json, m9_backtest_wf]:** Rolling 250-hari VaR95 (hari 251–480, n=230): exceedance 15, diharapkan 11,5, laju 15/230 = 6,52% vs janji 5%, LR = 1,0275, p = 0,3108 — tidak menolak H0. Rolling 120-hari VaR95 (hari 121–480, n=360): exceedance 20, diharapkan 18,0, laju 20/360 = 5,56%, LR = 0,2261, p = 0,6344 — tidak menolak H0. Rolling 250-hari VaR99 (n=230): exceedance 4, diharapkan 2,3, laju 4/230 = 1,74% vs janji 1%, LR = 1,0398, p = 0,3079 — tidak menolak H0. Expanding-window VaR95 (mulai 250 hari, n=230): exceedance 16, diharapkan 11,5, laju 16/230 = 6,96%, LR = 1,6611, p = 0,1975 — tidak menolak H0. Empat varian, empat p-value di atas 0,19 — tidak satu pun yang menolak H0 pada 5%.

**Baik/buruk:** jendela MEMENGARUHI hasil: rolling 120-hari (jendela pendek, VaR lebih responsif) memberi laju 5,56%, PALING DEKAT dengan janji 5% — sementara rolling 250-hari memberi 6,52% dan expanding 6,96%. TINGKAT keyakinan memengaruhi kuasa uji: VaR99 hanya punya 2,3 exceedance yang diharapkan dari 230 hari — 4 exceedance (hampir dua kali lipat janji) tetap memberi p = 0,3079. «Tidak menolak» pada VaR99 jauh lebih lemah buktinya daripada «tidak menolak» pada VaR95. Dan keempat varian menguji hal yang SAMA (coverage) — keempatnya «lolos» — tetapi cerita «VaR kita jujur» SALAH bila berhenti di sini, karena Kupiec tidak melihat URUTAN exceedance (langkah 4).

**Mitigasi:** laporkan SELALU lebih dari satu varian (jendela dan skema yang berbeda), laporkan n dan expected di samping x dan p, dan tulis kuasa ujinya: «VaR99: diharapkan 2,3 exceedance — uji ini hampir tidak punya kuasa». Bila satu varian menolak H0 sementara yang lain lolos, jangan pilih yang lolos — selidiki kenapa mereka berbeda.

---

## 4. Independence: Exceedance Bergerombol? Uji Christoffersen

**Nilai [m9_canonical.json, christoffersen_roll250_var95] — rolling-250 VaR95 OOS, 229 transisi antar-hari:** n00 = 203 (hari tenang sesudah hari tenang), n01 = 11 (exceedance sesudah hari tenang), n10 = 11 (hari tenang sesudah exceedance), n11 = 4 (exceedance sesudah exceedance). Peluang exceedance unconditional π = 15/229 = 0,0655. Peluang exceedance sesudah hari TIDAK exceedance π01 = 11/214 = 0,0514. Peluang exceedance sesudah hari exceedance π11 = 4/15 = 0,2667. Dua perbandingan dengan pembanding yang BENAR, jangan tertukar: π11/π01 = 0,2667/0,0514 = 5,19 — dibulatkan 5,2× — artinya sesudah satu hari exceedance, peluang exceedance keesokan harinya adalah 5,2 KALI peluang sesudah hari tenang. Pembanding yang BERBEDA: π11/π = 0,2667/0,0655 = 4,07 — dibulatkan 4,1× — artinya peluang exceedance sesudah exceedance adalah 4,1 KALI peluang rata-rata hari mana pun. 5,2× membandingkan dengan «sesudah hari tenang»; 4,1× membandingkan dengan «rata-rata».

**Statistik ujinya:** LR_ind = 6,6456, p = 0,0099 — SIGNIFIKAN pada 5% (nilai kritis χ²₁ 3,841) dan pada 1% (6,635 — tipis, 6,6456 hanya 0,0106 di atasnya). Independensi DITOLAK: exceedance BERGEROMBOL. Uji gabungan (conditional coverage) LR_cc = LR_POF + LR_ind = 1,0275 + 6,6456 = 7,6731, p = 0,0216 (χ²₂, nilai kritis 5% 5,991) — juga menolak. Kupiec lolos (1,0275) + independence gagal (6,6456) = gabungan gagal (7,6731).

**Gerombolnya (figure 1):** TIGA hari beruntun (hari OOS 40, 41, 42: 2026-01-26, 27, 28) dan dua pasangan (95–96 dan 212–213). Empat transisi exceedance→exceedance (n11 = 4): 40→41, 41→42, 95→96, 212→213. Hari 212 (2026-10-16) adalah hari terburuk portofolio: return −13,98% — kerugian Rp13.983.464 pada Rp100jt [M9.2 skenario] — diikuti keesokan harinya oleh exceedance lagi (−4,83%). Mengapa ini terjadi? Volatilitas bergerombol: return kuadrat lag-1 berkorelasi 0,1043 [M4.3] — dan VaR historis rolling 250-hari bergerak LAMBAT, sehingga setelah satu exceedance, ambangnya belum naik cukup cepat untuk menangkap hari buruk berikutnya.

**Baik/buruk:** hasil ini bagus sebagai DIAGNOSIS — ia memberi tahu PERSIS apa yang rusak (bukan coverage-nya, melainkan independence-nya) dan PERSIS seberapa besar (π11 5,2× π01). Buruk bila dibaca sebagai «VaR-nya sama sekali tidak berguna»: VaR95 ini tetap mengukur BESARNYA kerugian harian dengan cukup benar (coverage lolos) — yang gagal adalah asumsi bahwa exceedance datang sendiri-sendiri.

**Mitigasi:** JANGAN PERNAH melaporkan Kupiec tanpa Christoffersen — keduanya adalah pasangan yang tidak terpisahkan (coverage + independence = conditional coverage). Dan bila independence gagal, tulis penyebab yang paling mungkin beserta perbaikan yang diusulkan — bukan hanya vonisnya.

---

## 5. Walk-Forward vs Single Split: Satu Split Tidak Cukup

**Bukti pertama [M4.1] — walk-forward 8 folds pada prediksi arah return:** Random Forest 0,5250, Logistic Regression 0,5688, decision tree 0,5188, GBM 0,5062, naive (tebak mayoritas) 0,5625. Bandingkan dengan random cross-validation pada data yang sama: RF 0,5326, LR 0,6000. Random CV MELEBIHI walk-forward (LR 0,6000 acak vs 0,5688 walk-forward; RF 0,5326 vs 0,5250) — karena random CV mengacak waktu. Dan dalam walk-forward, model NAIVE (0,5625) mengalahkan RF (0,5250), tree (0,5188), dan GBM (0,5062) — hanya LR (0,5688) yang sedikit di atasnya. Random CV menyembunyikan fakta memalukan ini; walk-forward menampakkannya.

**Bukti kedua [M6.2] — nested CV vs single split pada credit scoring GBM:** nested CV 0,7858 (sd antar-fold 0,0068) vs single-split test 0,7823. Selisihnya kecil (0,0035) — nested CV memberi estimasi yang TIDAK BERGANTUNG pada satu split, dengan ukuran penyebaran antar-fold (sd 0,0068) yang bisa dibaca. Tulis sebagai «0,7858 (sd antar-fold 0,0068)» — sd antar-fold adalah penyebaran antar-fold, BUKAN ketidakpastian mean; jangan pernah menulisnya sebagai «mean ± sd». Dan walk-forward BBCA di modul yang sama: mean ROC-AUC 0,5516 — jauh di bawah 0,7858, karena BBCA adalah prediksi deret waktu, bukan klasifikasi snapshot.

**Bukti ketiga [M7.5] — pseudo-time chunks pada monitoring credit scoring:** ROC-AUC per chunk 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006. Rentang (spread) 0,8138 − 0,7428 = 0,0710 — performa berayun 7,10 poin persen antar-periode. Dan roc_drop 0,0388 = 0,7816 − 0,7428 — chunk terburuk 3,88 poin persen DI BAWAH baseline test 0,7816. Satu split test (0,7816) tidak memberi tahu kamu bahwa ada periode di mana modelmu hanya 0,7428.

**Catatan batas:** validation halves M8.1 (half A vs B) adalah split ACAK, BUKAN walk-forward — halves mengukur noise sampling, bukan stabilitas waktu. Jangan klaim halves membuktikan stabilitas waktu; itu pelajaran M8.1 langkah desain validasi.

**Nilai:** walk-forward bagus karena ia menguji model SEPANJANG WAKTU, bukan pada satu titik waktu. Model deret waktu yang hanya diuji pada satu split adalah model yang diuji pada satu rezim — dan rezim berubah.

**Baik/buruk:** walk-forward bagus bila fold-nya MENGHORMATI WAKTU (latih masa lalu, uji masa depan) dan bila hasilnya dilaporkan PER FOLD, bukan hanya rata-ratanya. Buruk bila fold-nya tumpang tindih tanpa disadari, atau bila «walk-forward» dipakai sebagai label untuk random CV yang diacak.

**Mitigasi:** untuk data berurutan waktu, JANGAN PERNAH memakai random split sebagai bukti utama. Pakai walk-forward (atau pseudo-time chunks) — dan laporkan skor per fold beserta spread-nya (di sini 0,0710), bukan hanya rata-rata.

---

## 6. Basel Traffic-Light: 3 Exceedance 99% → GREEN — dan Apa Artinya

**Nilai [m9_canonical.json, basel_99_last250]:** dalam 250 hari terakhir, VaR99 (ambang dari 230 hari sebelumnya) tertembus 3 kali → GREEN. Aturannya, sebagai fakta regulasi (framework backtesting Basel 1996): GREEN bila 0–4 exceedance (multiplier modal 3,00); YELLOW bila 5–9 exceedance (multiplier naik 3,40 pada 5 exceedance, sampai 3,85 pada 9 exceedance); RED bila 10 atau lebih exceedance (multiplier 4,00). Multiplier mengalikan VaR untuk menentukan modal minimum. Ambang-ambang ini adalah fakta regulasi Basel, bukan [kebijakan lesson ini].

**Baik/buruk:** traffic-light bagus sebagai ALARM REGULASI — sederhana, tidak bisa dinegosiasikan sesudah melihat angka, dan konsekuensinya nyata (modal). Buruk bila dibaca sebagai VALIDASI LENGKAP: ia tidak menguji independence (langkah 4), tidak menguji besaran kerugian saat exceedance (itu tugas Expected Shortfall, M4.2), dan tidak menguji apakah VaR-nya terlalu konservatif. GREEN Basel + independence gagal (langkah 4) adalah kombinasi yang mungkin — dan memang itulah kombinasi kita: GREEN di sini, independence DITOLAK di langkah 4. Dengan hanya 2,3 exceedance yang diharapkan pada VaR99, zona hijau 0–4 itu LEBAR: VaR99 bisa hampir dua kali lipat terlalu optimistis dan tetap GREEN.

**Mitigasi:** laporkan zona Basel BERSAMA uji Kupiec dan Christoffersen — ketiganya, selalu. «GREEN Basel» tanpa independence adalah laporan yang belum selesai. Dan bila zona kuning tercapai (5–9), jangan tunggu merah: selidiki SEBELUM multiplier naik lebih jauh.

---

## 7. Jebakan: Backtest yang «Dilatih» pada Hasil Backtest

**Nilai:** jebakan paling berbahaya di lesson ini terlihat seperti ketekunan: mencoba BANYAK jendela, BANYAK skema, BANYAK tingkat keyakinan — dan hanya melaporkan yang lolos. Itulah OVERFITTING KE BACKTEST: backtest yang seharusnya menguji model, malah menjadi data latih kedua. Bentuknya adalah MULTIPLE TESTING: mencoba 20 jendela dan melaporkan satu yang p-value-nya terbesar; menggeser ambang VaR sedikit demi sedikit sampai exceedance-nya «pas» 11,5; memilih jendela 120-hari KARENA p-nya 0,6344 — paling besar dari keempatnya — lalu menulis «VaR kami lolos dengan p = 0,63». Dengan 20 percobaan pada taraf 5%, peluang SATU di antaranya «lolos secara kebetulan» mendekati 64% (1 − 0,95^20).

**Jebakan kedua:** MENGUBAH MODEL sampai backtest-nya lolos. VaR historis gagal independence (langkah 4)? Ganti ke VaR parametrik. Masih gagal? Tambah filter volatilitas. Setiap perubahan yang diputuskan DARI hasil backtest menghabiskan kejujuran backtest itu.

**Baik/buruk:** mencoba banyak varian bagus bila tujuannya SENSITIVITAS («apakah vonisnya berubah bila jendelanya berubah?» — langkah 3 menjawab: tidak, keempatnya lolos) — dan buruk bila tujuannya PEMILIHAN («varian mana yang angkanya paling bagus?»). Bedanya bukan pada jumlah varian yang dicoba, melainkan pada APA YANG DILAPORKAN: semua, atau hanya yang lolos.

**Mitigasi:** sebelum backtest, tulis protokolnya — jendela apa, skema apa, ambang apa — dan kunci (jangan diubah sesudah melihat hasil). Laporkan SEMUA varian yang dicoba, lolos maupun tidak. Bila kamu mengubah model karena backtest gagal, backtest berikutnya WAJIB memakai data yang belum pernah dipakai untuk memutuskan perubahan itu.

---

## 8. Mini-Case: Model VaR Baru — Lolos Kupiec, Gagal Independence. Putuskan.

**Fakta di meja — semuanya dari angka kanonis:** model VaR baru (rolling 250-hari VaR95, portofolio SIMPLE returns n=480). Kupiec: n=230, exceedance 15, diharapkan 11,5, LR = 1,0275, p = 0,3108 — TIDAK menolak H0. Christoffersen: n00=203, n01=11, n10=11, n11=4; π01 = 0,0514; π11 = 0,2667 (5,2× π01; 4,1× π unconditional 0,0655); LR_ind = 6,6456, p = 0,0099 — independensi DITOLAK. Gabungan LR_cc = 7,6731, p = 0,0216 — ditolak. Basel: 3 exceedance 99% dalam 250 hari terakhir → GREEN. Walk-forward [M4.1]: model ini diuji sepanjang waktu, bukan satu split.

**Nilai:** TIDAK LOLOS sebagai model — bukan karena VaR-nya salah mengukur besar kerugian (coverage lolos), melainkan karena VaR-nya salah tentang KAPAN kerugian itu datang. Conditional coverage (LR_cc) mensyaratkan KEDUANYA: jumlah yang benar DAN waktu yang benar. Model yang exceedance-nya bergerombol (π11 5,2× π01) adalah model yang kerugiannya datang bertubi-tubi — tiga hari beruntun 40–42, pasangan 95–96 dan 212–213 — tepat saat modal paling dibutuhkan.

**Baik/buruk:** keputusan «tidak lolos» ini bagus bila syarat perbaikannya SPESIFIK (jendela lebih pendek? pembobotan eksponensial? ES sebagai pelengkap [M4.2]?) dan backtest ulangnya memakai data segar — dan buruk bila ia menjadi penolakan permanen tanpa jalan kembali. Model yang coverage-nya lolos adalah model yang SETENGAH benar — ia layak diperbaiki, bukan dibuang.

**Mitigasi:** tulis verdictmu dalam SATU KALIMAT: «[LOLOS/TIDAK LOLOS] karena [Kupiec p=… DAN/ATAU Christoffersen p=…], dengan syarat [syarat + pemilik + tanggal]». Bila kalimatmu hanya menyebut satu dari dua uji itu, verdictmu belum siap.

---

## 9. Lab 1: Rolling VaR Backtest + Kupiec — Replikasi 15/230

**Nilai:** hitung sendiri backtest rolling-250 VaR95 dari 480 SIMPLE daily returns (numpy + math saja; p-value χ²₁ tanpa scipy: p = erfc(√(LR/2))). Hasil yang diharapkan [lab]: n_oos=230; n_exceed=15; expected=11,5; lr_kupiec=1,0275; p_value=0,3108; lolos=True.

**Baik/buruk:** lolos=True — Kupiec TIDAK menolak H0 pada taraf 5%. Tapi ingat langkah 4: lolos di sini BUKAN vonis akhir model — lab 2 akan menunjukkan kenapa. Dan perhatikan sensitivitasnya: bila exceedance-nya 20 (bukan 15), LR ≈ 5,47, p ≈ 0,019 — H0 DITOLAK. Lima exceedance tambahan mengubah vonis — itulah kenapa n=230 adalah sampel yang kecil untuk menguji VaR.

**Mitigasi:** bandingkan dengan langkah 2: LR = 1,0275 jauh di bawah nilai kritis χ²₁ 3,841 — dan p = 0,3108 berarti hasil 15 dari 230 akan muncul 31,08% dari waktu bila VaR ini jujur.

---

## 10. Lab 2: Christoffersen + Basel Zone — Exceedance Bergerombol?

**Nilai:** dari flag exceedance yang sama dengan lab 1 (230 hari OOS): n00=203; n01=11; n10=11; n11=4; pi=0,0655; pi01=0,0514; pi11=0,2667; lr_ind=6,6456; p_ind=0,0099; lr_cc=7,6731; p_cc=0,0216; zone=GREEN. Bacalah dua baris terakhir BERSAMA-SAMA: zone GREEN (Basel) DAN p_ind 0,0099 (independence DITOLAK) — lampu hijau regulasi tidak memadamkan vonis independence. p-value χ²₂ dihitung tanpa scipy sebagai exp(−LR_cc/2) — rumus eksak untuk 2 derajat bebas.

**Baik/buruk:** π11 = 0,2667 adalah 5,2× π01 = 0,0514 (pembanding «sesudah hari tenang») dan 4,1× π = 0,0655 (pembanding «rata-rata») — tulis keduanya dengan pembandingnya, jangan pernah menulis rasionya tanpa pembanding. Dan perhatikan: bila n11 = 0 (tidak satu pun exceedance berurutan), π11 = 0, LR_ind ≈ 1,53, p ≈ 0,216 — independence lolos. Empat transisi itulah yang membalik vonis.

**Mitigasi:** JANGAN PERNAH melaporkan Kupiec tanpa Christoffersen — lab 1 tanpa lab 2 adalah laporan yang belum selesai.

---

## 11. Figure 1: Timeline Exceedance — 15 Titik, 4 Transisi Berurutan

**Nilai:** 230 hari out-of-sample (hari 1 = hari ke-251 dari 480 hari data), tiap garis merah adalah satu exceedance rolling-250 VaR95. Hitung sendiri dari gambarnya: 15 garis merah — sama dengan 15 exceedance langkah 3. Tiga di antaranya beruntun tanpa jeda (hari OOS 40, 41, 42: 2026-01-26, 27, 28), dua pasangan berdekatan (95–96 dan 212–213), sisanya sendiri-sendiri (63, 65, 68, 77, 116, 118, 120, 221). Empat transisi exceedance→exceedance (n11 = 4): 40→41, 41→42, 95→96, 212→213.

**Baik/buruk:** paruh pertama OOS (hari 1–120) berisi 12 dari 15 exceedance — termasuk run tiga hari 40–42 — sementara paruh kedua (hari 121–230) hanya berisi 3 (212, 213, 221). Exceedance tidak hanya bergerombol antar-hari; ia juga bergerombol antar-periode. Hari 212 (2026-10-16) adalah hari terburuk portofolio: return −13,98% — kerugian Rp13.983.464 pada Rp100jt [M9.2 skenario] — diikuti keesokan harinya oleh exceedance lagi (−4,83%).

**Mitigasi:** setiap kali kamu menggambar timeline exceedance, beri label tanggal pada gerombolnya — gerombol tanpa tanggal tidak bisa diselidiki («apa yang terjadi 26–28 Januari 2026?» adalah pertanyaan yang bisa dijawab; «ada gerombol di awal» bukan).

---

## 12. Figure 2: Rolling VaR95 vs Realized Returns — di Mana Batasnya Tertembus

**Nilai:** garis tebal adalah −VaR95 rolling 250-hari (ambang kerugian, sekitar −2,5% s.d. −3,1% — VaR95-nya sendiri 0,0253 s.d. 0,0311), garis tipis adalah realized return harian (SIMPLE returns) selama 230 hari OOS, dan titik merah adalah 15 exceedance — hari-hari ketika return jatuh DI BAWAH garis VaR. Titik yang menyentuh garis tetapi tidak melewatinya BUKAN exceedance.

**Baik/buruk:** garis VaR bergerak LAMBAT: ia nyaris datar di sekitar −2,8% selama 230 hari — karena jendela 250 hari hanya mengganti satu hari lama dengan satu hari baru tiap harinya. Kelambatan inilah yang membuat exceedance bergerombol (langkah 4). Exceedance terbesar ada di ujung kanan: hari 212 (2026-10-16), return −13,98%, jauh di bawah garis VaR — ≈ 4,9× lebih dalam daripada VaR-nya — dan Kupiec tidak peduli seberapa DALAM exceedance itu; ia hanya menghitung JUMLAH. Besaran kerugian saat exceedance adalah tugas Expected Shortfall [M4.2], bukan Kupiec. VaR95 bekerja pada 93,48% hari (215 dari 230) — dan gagal pada 6,52%-nya.

**Mitigasi:** setiap kali kamu menggambar VaR vs return, gambar garis VaR yang SAMA dengan yang dipakai backtest-mu (rolling, bukan full-sample), dan tandai exceedance dengan warna yang berbeda dari return biasa.

---

## 13. Backtest ES: Jumlah Lolos, Kedalaman Tidak — Severity Exceedance

Kupiec lolos (p = 0,3108) — 15 exceedance dari 230 hari OOS, diharapkan 11,5. Tapi Kupiec hanya menghitung JUMLAH tembusan, bukan KEDALAMANNYA. Lima belas exceedance rolling-250 VaR95 [turunan] — hari OOS 40, 41, 42, 63, 65, 68, 77, 95, 96, 116, 118, 120, 212, 213, 221 — kerugian rata-rata 0,0440 [turunan], terdalam 0,1398 (hari OOS 212, 2026-10-16) [turunan].

**Nilai:** prakiraan ES95 rolling pada hari-hari itu rata-rata 0,0394 [turunan] — rasio severity 1,1163 [turunan], sekitar 12% lebih dalam dari prakiraan [turunan]. Tujuh dari 15 (46,7% [turunan]) lebih buruk dari ES forecast hari itu; tiga dari 15 (20% [turunan]) lebih buruk dari ES95 full-sample 0,0445. Yang paling dalam (0,1398) adalah 3,18× rata-rata exceedance [turunan].

**Baik/buruk:** yang meremehkan bukan ES-nya, melainkan jendelanya — ES95 full-sample 0,0445 justru sedikit di atas rata-rata kerugian 0,0440; jendela 250-hari yang bergerak lambat ketinggalan saat volatilitas naik. Itu penyebab yang sama dengan kegagalan independence (langkah 8). Perbandingan ini deskriptif — 15 kejadian adalah sampel kecil; tanpa hari 212, rata-rata kerugian 14 exceedance lainnya adalah 0,0372 [turunan], di bawah prakiraan ES. Uji formal Acerbi–Szekely tidak diajarkan di sini (butuh angka di luar kanonik).

**Mitigasi:** laporkan severity BERSAMA Kupiec — jumlah vs diharapkan, rasio severity, kerugian terdalam. Rasio > 1,10 [kebijakan lesson ini] sementara Kupiec lolos = «lolos jumlah, gagal kedalaman».

---

## Rangkuman

- VaR yang tidak pernah di-backtest adalah klaim, bukan ukuran. Jebakan in-sample [M4.3]: VaR95 full-sample diuji pada sampel yang sama → exceedance 24 dari 480, LR Kupiec = 0, p = 1; VaR99 in-sample: exceedance 5 vs diharapkan 4,8 (by construction).
- Kupiec POF menguji unconditional coverage SAJA (bukan independence): LR = −2·ln[(1−p)^(n−x)·p^x] + 2·ln[(1−x/n)^(n−x)·(x/n)^x] ~ χ²₁; p-value besar = «tidak ada bukti menolak», BUKAN «model benar». Exceedance = return hari itu < −VaR (SIMPLE returns).
- Empat varian OOS [m9_canonical.json]: rolling-250 VaR95 — exceedance 15/230, diharapkan 11,5, LR = 1,0275, p = 0,3108; rolling-120 VaR95 — 20/360, diharapkan 18,0, LR = 0,2261, p = 0,6344; rolling-250 VaR99 — 4/230, diharapkan 2,3, LR = 1,0398, p = 0,3079; expanding VaR95 — 16/230, diharapkan 11,5, LR = 1,6611, p = 0,1975. Tidak satu pun menolak H0.
- Christoffersen independence (rolling-250 VaR95, 229 transisi): n00=203, n01=11, n10=11, n11=4; π = 0,0655; π01 = 0,0514; π11 = 0,2667 — π11 adalah 5,2× π01 dan 4,1× π (jangan tertukar pembandingnya); LR_ind = 6,6456, p = 0,0099 — independensi DITOLAK; LR_cc = 7,6731, p = 0,0216 — conditional coverage DITOLAK walau Kupiec lolos. Gerombol: 40–42, 95–96, 212–213; hari 212 (2026-10-16) return −13,98%.
- Walk-forward vs single split: 8 folds — RF 0,5250 / LR 0,5688 / tree 0,5188 / GBM 0,5062 / naive 0,5625, vs random CV RF 0,5326 / LR 0,6000 [M4.1]; nested CV GBM 0,7858 [M6.2] (sd antar-fold 0,0068) vs single-split test 0,7823 [M6.2]; BBCA walk-forward mean ROC-AUC 0,5516 [M6.2]; chunks 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006, roc_spread 0,0710, roc_drop 0,0388 [M7.5]. Halves [M8.1] adalah split acak, BUKAN walk-forward.
- Basel traffic-light (fakta regulasi): 3 exceedance 99% dalam 250 hari terakhir → GREEN (0–4 GREEN multiplier 3,00; 5–9 YELLOW multiplier 3,40–3,85; ≥10 RED multiplier 4,00). GREEN adalah syarat minimum regulasi, bukan vonis «model valid».
- Jebakan: backtest yang «dilatih» — mencoba banyak jendela/skema dan hanya melaporkan yang lolos (multiple testing); laporkan SEMUA varian yang dicoba.
- Mini-case: TIDAK LOLOS sebagai model — Kupiec lolos (p = 0,3108) tapi independence gagal (p = 0,0099); coverage tanpa independence berarti kerugian datang bergerombol tepat saat modal paling dibutuhkan.
- Lab: rolling VaR backtest + Kupiec (n_oos=230, n_exceed=15, lr_kupiec=1,0275, p_value=0,3108, lolos=True); Christoffersen + Basel (n11=4, pi11=0,2667, lr_ind=6,6456, p_cc=0,0216, zone=GREEN).
- Backtest ES / severity (langkah 13) [turunan]: 15 exceedance, kerugian rata-rata 0,0440 vs prakiraan ES95 rolling 0,0394 — rasio severity 1,1163 (sekitar 12% lebih dalam); 7/15 lebih buruk dari ES forecast hari itu, 3/15 lebih buruk dari ES95 full-sample 0,0445; terdalam 0,1398 (hari OOS 212).
- Verdict: jumlah lolos (Kupiec p = 0,3108), kedalaman tidak — laporkan severity BERSAMA Kupiec; rasio > 1,10 [kebijakan lesson ini] = «lolos jumlah, gagal kedalaman».

## Notebook

Guided task di Colab — notebook mlf-m93-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data harga: rolling VaR backtest + Kupiec (empat varian OOS), jebakan in-sample, Christoffersen independence, zona Basel, dan bukti walk-forward [M4.1/M6.2/M7.5], ditutup verdict mini-case.

Tautan Colab: https://colab.research.google.com/drive/1Am2BJgns7_KkO9S-tesSMG5f50j9_SDS
