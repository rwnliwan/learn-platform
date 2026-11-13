# MLF-M6.5: AutoML & Selection Bias — Pemenang yang Menyanjung Dirinya Sendiri

## Masalah: Delapan Belas Kandidat, Satu Pemenang — dan Pemenang Itu Menyanjung Dirinya Sendiri

Kamu sudah menghabiskan modul M6 untuk mencari model terbaik: grid search 18 konfigurasi GBM (M6.1), validasi silang dan nested CV (M6.2), regularisasi (M6.3), kalibrasi dan threshold (M6.4). Di ujung semua itu ada satu pertanyaan yang belum dijawab dengan jujur: bila kamu memilih pemenang dari 18 kandidat berdasarkan skor validasi, seberapa besar skor itu melebih-lebihkan kemampuan sang pemenang?

Angka acuan: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate 0,2212, split stratified 80/20 (train 24.000, test 6.000, seed 42), 31 fitur [notebook]. Baseline flagship: LR ROC-AUC 0,7426 / PR-AUC 0,5049; GBM default ROC-AUC 0,7823 / PR-AUC 0,5597; GBM train ROC-AUC 0,8469 vs test 0,7823 — gap 0,0646.

---

## 1. Delapan Belas Kandidat, Satu Pemenang

**Nilai:** lesson ini mengajarkan satu keterampilan yang membedakan analis yang bisa dipercaya dari analis yang hanya bisa menang di leaderboard: membedakan «skor tertinggi» dari «menang signifikan», dan «pemenang validasi» dari «pemenang yang jujur».

**Baik/buruk:** memilih dari 18 kandidat itu bagus — ia memakai data, bukan firasat. Buruk bila skor pemenangnya dibaca sebagai estimasi yang tak-bias: skor validasi TERBAIK dari 18 kandidat secara sistematis melebih-lebihkan skor test-nya, karena kandidat yang terpilih adalah kandidat yang kebetulan diuntungkan noise validasi.

**Mitigasi:** laporkan tiga angka sekaligus: skor validasi pemenang, skor test-nya, dan selisihnya (optimisme) — lalu putuskan pemenang dengan protokol yang adil, bukan dengan satu leaderboard.

---

## 2. AutoML: Apa yang Diotomasi, Apa yang Tidak

AutoML mengotomasi PENCARIAN — mencoba banyak kombinasi, menilai tiap kombinasi dengan validasi silang, dan mengembalikan yang terbaik. Yang TIDAK diotomasi adalah PERUMUSAN: masalah bisnis apa yang diselesaikan, metrik apa yang benar, data mana yang boleh dipakai tanpa leakage, dan apakah «terbaik» itu bermakna atau hanya noise.

**Nilai [notebook]:** grid search GBM mencoba 18 konfigurasi (3-fold CV, 54 fit) dan menemukan yang terbaik: max_iter 100, max_depth 5, learning_rate 0,05, skor CV 0,7865. Random search dengan 27 konfigurasi (81 fit) menemukan yang terbaik di antara 27 konfigurasi random search, 0,7866 — hanya 0,0001 di atas grid. Pencarian yang lebih luas tidak otomatis memberi model yang lebih baik; begitu kandidat-kandidatnya sudah berdekatan, tambahan pencarian hanya mengaduk noise.

**Baik/buruk:** AutoML bagus karena pencarian menjadi sistematis dan bisa direplikasi. Buruk bila dipakai sebagai kotak hitam: «AutoML yang memilih, jadi pasti benar» adalah penyerahan keputusan, bukan keputusan.

**Mitigasi:** pegang sendiri tiga hal: (1) metrik utama yang ditetapkan SEBELUM pencarian (di sini ROC-AUC); (2) protokol evaluasi yang tidak bocor (nested CV, test terkunci); (3) uji signifikansi sebelum mengklaim satu model mengalahkan model lain.

---

## 3. Winner's Curse

Winner's curse: bila kamu memilih yang TERBAIK dari banyak kandidat berdasarkan skor yang berisik, skor kandidat terpilih itu melebih-lebihkan kemampuan sebenarnya.

**Nilai [notebook]:** konfigurasi CV-terbaik (max_iter 100, max_depth 5, learning_rate 0,05) punya skor CV 0,7865 — tapi skor test-nya 0,7823. Optimisme = 0,7865 − 0,7823 = 0,0042. Rata-rata optimisme (CV − test) di KE-18 konfigurasi juga 0,0042 — setiap konfigurasi, tanpa kecuali, punya skor CV di atas skor test-nya. Optimisme terkecil 0,0014 — dua konfigurasi max_depth tanpa batas dengan learning_rate 0,10 (max_iter 100 dan 200; yang max_iter 50 memberi 0,0015), terbesar 0,0066 (max_iter 50, max_depth 3, learning_rate 0,05). Satu koreksi atribusi: 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua 18 kandidat (rata-rata optimisme juga 0,0042) — karena itu ia bukan estimasi eksklusif winner's curse. Bukti curse yang sebenarnya adalah ketidakstabilan peringkat: K15 (peringkat-15 CV) menyamai skor test tertinggi, dan empat konfigurasi seri di test 0,7823.

$$\mathrm{optimisme} = \mathrm{skor_{CV}} - \mathrm{skor_{test}}, \qquad \mathbb{E}[\max_k \hat{S}_k] \geq \max_k \mathbb{E}[\hat{S}_k]$$

**Gambar:** skor CV vs test, 6 dari 18 konfigurasi — K1 (CV 0,7865 / test 0,7823), K2 (0,7864 / 0,7816), K4 (0,7862 / 0,7802), K9 (0,7853 / 0,7814), K15 (0,7838 / 0,7823), K18 (0,7827 / 0,7761). Batang CV selalu lebih tinggi — optimisme sistematis, rata-rata 0,0042. Peringkat berubah: K15 (peringkat-15 CV) menyamai skor test tertinggi 0,7823; empat konfigurasi berbagi skor test itu.

**Baik/buruk:** optimisme 0,0042 di sini KECIL — jauh lebih kecil dari selisih LR vs GBM (0,0397) dan dari simpangan baku antar-fold nested CV (0,0068). Buruk bila angka kecil ini dibaca sebagai «winner's curse tidak penting»: ia kecil DI SINI karena gain tuning-nya kecil (seluruh grid hanya merentang 0,7827–0,7865 di CV).

**Mitigasi:** laporkan optimisme bersama skornya — «CV 0,7865, test 0,7823, optimisme 0,0042» — bukan skor CV saja.

---

## 4. Mengapa Validasi Menyanjung Pemenang

Skor CV yang kamu amati untuk konfigurasi k adalah skor sejati + noise, Ŝ_k = S_k + ε_k. Bila kamu memilih k dengan Ŝ_k terbesar, kamu juga, secara sistematis, memilih ε_k yang positif.

**Nilai [notebook]:** seluruh 18 konfigurasi punya skor CV dalam rentang sempit 0,7827–0,7865 — lebar rentang hanya 0,0038, LEBIH KECIL dari optimisme rata-rata 0,0042 dan dari simpangan baku antar-fold nested CV 0,0068. Perbedaan antar konfigurasi di grid ini sebagian besar ADALAH noise.

**Kapan winner's curse BESAR?** (1) BANYAK kandidat — makin banyak yang dipilih, makin besar peluang salah satunya mendapat noise positif yang ekstrem; (2) VALIDASI KECIL — makin kecil lipatan validasi, makin besar noise tiap skor; (3) SELISIH ANTAR KANDIDAT KECIL — bila kandidat-kandidatnya memang hampir setara, rankingnya ditentukan noise, bukan kemampuan.

**Baik/buruk:** seleksi atas skor validasi bagus sebagai CARA MEMILIH — ia tetap memilih konfigurasi yang masuk akal. Buruk sebagai CARA MELAPORKAN — skor yang dilaporkan adalah skor yang sudah «dipilih karena tinggi».

**Mitigasi:** (1) laporkan optimisme; (2) ulangi seleksi di lipatan berbeda dan lihat apakah pemenangnya stabil — di nested CV, konfigurasi terbaik BERGANTI di tiap outer fold; (3) nested CV: seleksi di dalam, evaluasi di luar.

---

## 5. McNemar: LR vs GBM

McNemar — sudah diajarkan di MLF-M4 — hanya memakai pasangan DISCORDANT, yaitu nasabah di mana kedua model TIDAK SEPAKAT dan satu benar satu salah. Pasangan di mana keduanya benar atau keduanya salah tidak memberi informasi tentang siapa yang lebih baik, dan tidak masuk rumus.

**Nilai [notebook]:** test 6.000 baris, threshold 0,5 — b = 132 (LR benar, GBM salah), c = 199 (LR salah, GBM benar). Total pasangan discordant: 331. χ² = (|132 − 199| − 1)² / 331 = 66² / 331 = 13,1601. Nilai p (metode chi2, df = 1) = 0,0003 — uji binomial eksak memberi p = 0,0003 juga. Karena 0,0003 < 0,05: GBM menang SIGNIFIKAN atas LR. Arahnya: c > b — GBM benar di 199 nasabah yang LR-nya salah, LR hanya benar di 132 yang GBM-nya salah. Selisih bersih 67 nasabah dari 6.000.

$$\chi^2 = \frac{(|b - c| - 1)^2}{b + c}, \qquad \text{tolak } H_0 \text{ bila } \chi^2 > 3{,}8415$$

**Gambar:** dua tabel McNemar berdampingan. Kiri (LR vs GBM): b = 132, c = 199, χ² = 13,1601, p = 0,0003 — SIGNIFIKAN. Kanan (GBM vs tertala): b = 36, c = 30, χ² = 0,3788, p = 0,5383 — TIDAK signifikan. Sel a dan d (keduanya benar / keduanya salah) tidak masuk rumus.

**Baik/buruk:** McNemar bagus karena memakai struktur PASANGAN — variasi antar-nasabah saling meniadakan. Buruk bila dipakai di luar syaratnya: ia membandingkan prediksi KLASIFIKASI (benar/salah pada satu threshold, di sini 0,5), bukan skor ROC-AUC — dan ia menguji «apakah berbeda», bukan «seberapa besar bedanya».

**Mitigasi:** laporkan selalu b dan c-nya, bukan hanya p-value — «b = 132, c = 199» memberi tahu BESARNYA keunggulan (67 nasabah bersih). Tetapkan threshold SEBELUM menguji.

---

## 6. McNemar: GBM vs GBM-Tertala — «Menang» yang Tidak Signifikan

**Nilai [notebook]:** GBM tertala ROC-AUC test 0,7823 vs GBM default 0,7823 — SAMA PERSIS; PR-AUC 0,5598 vs 0,5597 (selisih 0,0001). McNemar (threshold 0,5): b = 36 (default benar, tertala salah), c = 30 (default salah, tertala benar). Total pasangan discordant hanya 66. χ² = (|36 − 30| − 1)² / 66 = 25 / 66 = 0,3788. Nilai p (metode chi2) = 0,5383 — binomial eksak 0,5386. Karena 0,5383 jauh di atas 0,05: perbedaan TIDAK SIGNIFIKAN. Ini bukan bukti tuning «tidak berpengaruh sama sekali» — ini ketiadaan bukti bahwa ia berpengaruh.

**Baik/buruk:** hasil «tidak signifikan» ini bagus sebagai KOREKSI — mencegah klaim kemenangan tuning yang tidak ada. Buruk bila dibaca sebagai «modelnya identik»: p = 0,5383 tidak membuktikan kesetaraan.

**Mitigasi:** bila dua model hampir selalu sepakat (discordant kecil), laporkan «tidak terbukti berbeda» dan pilih berdasarkan kriteria lain: kesederhanaan, kecepatan, stabilitas, atau biaya.

---

## 7. Signifikan vs Penting

SIGNIFIKAN (apakah perbedaan ini nyata?) dan PENTING (apakah perbedaan ini cukup besar untuk mengubah keputusan?) harus selalu dibedakan. LR vs GBM: signifikan (p = 0,0003) DAN penting (selisih ROC-AUC 0,0397). GBM vs tertala: tidak signifikan (p = 0,5383) dan tidak penting (selisih 0,0018 di nested CV). Kombinasi ketiga yang paling berbahaya: signifikan tapi TIDAK penting — muncul begitu sampelmu besar.

**Nilai [notebook]:** GBM tertala 0,7858 (sd antar-fold 0,0068) vs GBM default 0,7840 (sd antar-fold 0,0059): selisih 0,0018, sementara simpangan baku antar-fold 0,0068 — selisih itu hanya sekitar seperempat dari satu simpangan baku (0,0018 / 0,0068 ≈ 0,26).

$$\Delta = 0{,}7858 - 0{,}7840 = 0{,}0018 \ll \mathrm{sd} = 0{,}0068, \qquad \frac{\Delta}{\mathrm{sd}} \approx 0{,}26$$

**Baik/buruk:** p-value bagus sebagai PENJAGA GERBANG — mencegah klaim kemenangan dari noise. Buruk bila menjadi SATU-SATUNYA kriteria: dengan test besar, selisih yang tidak berarti apa-apa secara bisnis pun akan signifikan.

**Mitigasi:** laporkan selalu PASANGAN ini — (1) ukuran efek dengan satuannya («selisih ROC-AUC 0,0018, sekitar 0,26× sd antar-fold 0,0068») dan (2) uji signifikansinya («McNemar p = 0,5383»).

---

## 8. Protokol Perbandingan yang Adil

Tiga aturan: (1) SELEKSI DI DALAM, EVALUASI DI LUAR (nested CV); (2) TEST TERKUNCI — dibuka SEKALI, di akhir, untuk keputusan final; (3) SATU METRIK UTAMA, ditetapkan sebelum pencarian (di sini ROC-AUC).

**Nilai [notebook]:** LR tertala (nested CV) 0,7560 (sd antar-fold 0,0056) (outer fold: 0,7635; 0,7476; 0,7600; 0,7523; 0,7568); GBM default (5-fold CV biasa, tanpa tuning sudah tak-bias) 0,7840 (sd antar-fold 0,0059) (fold: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808); GBM tertala (nested CV) 0,7858 (sd antar-fold 0,0068) (outer fold: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799). Konfigurasi terbaik BERGANTI di tiap outer fold (fold 1: max_iter 50, max_depth 5, learning_rate 0,10; fold 2: max_iter 200, max_depth 3, learning_rate 0,05) — «konfigurasi terbaik» adalah artefak lipatan, bukan sifat model.

$$\bar{S}_{\mathrm{nested}} = \frac{1}{5} \sum_{f=1}^{5} S_f, \qquad S_f = \text{skor outer fold } f \text{ (seleksi hanya di inner fold)}$$

**Baik/buruk:** nested CV bagus karena satu-satunya estimasi untuk model yang DI-TUNING yang tidak tercemar seleksi — 0,7858 adalah angka yang boleh dilaporkan. Buruk karena MAHAL: 5 outer fold × 18 konfigurasi × 3 inner fold = 270 fit GBM — dan tetap punya sd 0,0068: ia jujur, bukan presisi.

**Mitigasi:** bila nested CV terlalu mahal, pakai SATU split train/validasi/test yang dipisah sejak awal — tuning hanya di validasi, test hanya dibuka sekali di akhir. Yang tidak boleh: memilih di test, lalu melaporkan skor test itu sebagai performa.

---

## 9. Single vs Ensemble: Kapan Kompleksitas Tambahan Layak Dibayar

Di M4.1 kamu sudah belajar random forest, bagging, boosting, stacking — di sini kita tidak mengulang materinya, hanya menempatkan ensemble sebagai OPSI seleksi. Sampai langkah 8, semua kandidat adalah single model: satu LR, satu GBM. Pertanyaan «bagaimana kalau beberapa model digabung?» harus dijawab dengan protokol yang sama: nested CV, test terkunci, satu metrik utama, uji McNemar vs pesaing terdekat.

**Nilai:** tiga kandidat kanonis di frontier Pareto (nested CV ROC-AUC vs kompleksitas): LR tertala 0,7560 (murah), GBM default 0,7840, GBM tertala 0,7858 — tidak ada yang mendominasi yang lain. Posisi ensemble BELUM DIUKUR [ilustrasi]: tidak ada angka ensemble di file kanonis. Perbandingan dilakukan pada enam dimensi, semuanya kualitatif: ROC-AUC/PR-AUC, calibration (GBM mentah saja sudah ECE 0,0073 — jangan asumsikan ensemble lebih baik), cost, latency, explainability, operational complexity.

**Baik/buruk + mitigasi:** ensemble hanya layak bila peningkatannya cukup besar DAN stabil untuk membayar kompleksitas tambahannya. Ensemble yang menaikkan ROC-AUC 0,0002 [ilustrasi] sambil menggandakan biaya adalah kemunduran yang dibungkus kemajuan — selisih itu berada di dalam noise (sd antar-fold 0,0068).

---

## 10. Worked Example: Putuskan Pemenang yang Jujur

**Langkah A — ranking yang adil.** Skor nested CV: LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068). Pemenang ranking: GBM tertala, 0,7858. LR tertinggal 0,0298 — konsisten dengan McNemar LR vs GBM (p = 0,0003): LR kalah secara meyakinkan.

**Langkah B — apakah kemenangan atas GBM default nyata?** Selisih 0,7858 − 0,7840 = 0,0018 vs sd 0,0068 (rasio 0,26×). McNemar p = 0,5383, tidak signifikan. Kemenangan tuning atas default TIDAK TERBUKTI.

**Langkah C — putuskan dengan jujur.** Pemenang yang jujur (nested CV): GBM tertala, 0,7858 (sd antar-fold 0,0068) — kalimat lengkapnya: «GBM tertala adalah pemenang ranking dalam protokol yang adil, TETAPI keunggulannya atas GBM default (0,0018) berada di dalam noise (sd 0,0068) dan tidak signifikan (McNemar p = 0,5383); bila kesederhanaan, kecepatan, atau biaya dihitung, GBM default adalah pilihan yang sama sahnya.» Jangan laporkan 0,7865 (skor CV pemenang) sebagai performa — laporkan 0,7858 (nested CV) atau 0,7823 (test tunggal), dengan menjelaskan yang mana.

**Mitigasi:** tulis keputusan model dalam TIGA BARIS: (1) ranking + skor protokol adil; (2) uji signifikansi vs pesaing terdekat; (3) ukuran efek vs noise. Bila baris (2) dan (3) berkata «tidak terbukti», tuliskan itu.

---

## 11. Finalisasi Model: dari Pemenang Ranking menjadi Artefak yang Bisa Di-Deploy

Setelah protokol adil memilih prosedur dan worked example memutuskan pemenang, finalisasi memisahkan «pemenang ranking» dari «model yang boleh di-deploy»: (1) REFIT FINAL — latih ulang konfigurasi terpilih (max_iter 100, max_depth 5, learning_rate 0,05) pada SELURUH train 24.000 baris, karena model nested CV adalah lima model lipatan yang berbeda, bukan satu artefak; (2) ARTEFAK + RECORD — simpan model beserta selection record / model card (dataset version, seed, folds, search space, primary metric, konfigurasi terpilih, calibration method, threshold, skor final); (3) ATURAN PROMOSI — tetapkan sebelum deploy; keunggulan tertala atas default (0,0018) tidak signifikan (p = 0,5383) dan tidak penting, jadi promosinya tidak boleh beralasan «lebih baik».

**Tiga angka, tiga arti:** skor CV 0,7865 = skor PEMILIHAN (bias ke atas); skor nested 0,7858 = ESTIMASI JUJUR prosedur tuning — inilah yang boleh dilaporkan sebagai «performa model»; skor test 0,7823 = SATU PENGUKURAN di test 6.000 baris (test sudah dipakai untuk analisis McNemar). **Lab:** isi selection record GBM tertala — skor CV 0,7865, nested 0,7858, test 0,7823, optimisme 0,0042; skor yang boleh dilaporkan: 0,7858 (nested).

---

## 12. Jebakan: Leaderboard-Chasing, Test Peeking, AutoML Kotak Hitam

1. **Leaderboard-chasing.** Mengoptimasi leaderboard itu sendiri: menambah kandidat sampai satu «menang», menyetel seed sampai skor naik. Tanda bahaya: skor validasi naik terus sementara skor test tidak bergerak. Di data ini, random search 27 konfigurasi hanya menaikkan CV terbaik dari 0,7865 ke 0,7866 (+0,0001). Mitigasi: tetapkan JUMLAH kandidat dan metrik sebelum mulai, berhenti bila gerakannya di bawah sd.
2. **Test peeking.** Test set 6.000 baris sudah dipakai berkali-kali untuk analisis — sah SEBAGAI ANALISIS, tapi begitu satu keputusan didasarkan pada skor test, test itu kehilangan status tak-biasnya. Konfigurasi terbaik-menurut-test adalah (max_iter 100, max_depth 5, learning_rate 0,05) dengan 0,7823 — sama dengan juara CV, tapi itu kebetulan yang beruntung. Mitigasi: test dibuka sekali di akhir; bila sudah diintip, katakan itu di laporan.
3. **AutoML sebagai kotak hitam.** AutoML yang mengembalikan «model terbaik + skor 0,7865» tanpa jejak (konfigurasi apa? metrik apa? berapa kandidat? berapa kali test diintip?) adalah laporan yang tidak bisa diaudit. Mitigasi: simpan JEJAK seleksi — daftar kandidat, skor tiap kandidat, protokol evaluasi, uji signifikansi.

**Leaderboard-chasing lintas sesi.** Tiga sesi kanonis — grid 18 (terbaik CV 0,7865), random 27 (0,7866), shrinking 9 seed 43 (0,7869) — berarti 54 percobaan, bukan 18. Laporan yang hanya menampilkan run terbaik (0,7869) menyembunyikan jumlah percobaan, dan test yang sama dipakai berulang kali untuk menilai tiap sesi ikut terintip berulang kali. Penawarnya: experiment registry — setiap run dicatat (seed, search space, metrik, keputusan), TERMASUK yang gagal. Konsep «effective number of attempts» kualitatif [ilustrasi].

---

## Lab: Audit Experiment Registry Lintas Sesi

Registry merangkai tiga sesi kanonis [notebook] — grid 18 (0,7865), random 27 (0,7866), shrinking 9 seed 43 (0,7869) — ditambah satu sesi gagal [ilustrasi]. Hitung total konfigurasi yang dicoba, run gagal yang tetap tercatat, dan putuskan validitas laporan yang hanya menampilkan run terbaik.

Hasil [lab]: total 54 percobaan; 1 run gagal tercatat; skor terbaik yang dilaporkan 0,7869; laporan valid: False — hanya run terbaik dari 54 percobaan yang dilaporkan, dan test yang sama dipakai berulang kali untuk menilai tiap sesi.

## Lab 1: Uji McNemar Manual — LR vs GBM

b = 132, c = 199, threshold 0,5, test 6.000 baris [notebook]. χ² = (|b − c| − 1)² / (b + c). Nilai kritis χ² (df = 1, α = 0,05) = 3,8415.

Hasil [lab]: χ² = 13,1601; 13,1601 > 3,8415 → signifikan — GBM menang signifikan atas LR, konsisten dengan p-value kanonis (metode chi2) 0,0003. p-value TIDAK dihitung di lab — bukan karena tidak bisa (untuk df=1, p-value punya bentuk tertutup p = erfc(√(χ²/2)) ≈ 0,0003, tersedia di modul math stdlib) — melainkan agar fokus pada perbandingan χ² dengan nilai kritis 3,8415; p-value 0,0003 dikutip dari file kanonis sebagai cek silang.

## Lab 2: Winner's Curse dari 18 Konfigurasi Kanonis

Semua 18 konfigurasi GBM [notebook] — skor CV (3-fold) vs skor test tiap konfigurasi. Hitung optimisme tiap konfigurasi (CV − test), rata-ratanya, dan «pemenang yang jujur» menurut skor test.

Hasil [lab]: optimisme konfigurasi CV-terbaik (K1) = 0,0042; optimisme rata-rata 18 konfigurasi = 0,0042; pemenang jujur (skor test tertinggi) = K1 = 0,7823 — dan empat konfigurasi seri di skor test tertinggi itu (K1, K15, K16, K17). Sang juara CV KEBETULAN juga berbagi skor test tertinggi — tapi skor CV-nya tetap melebih-lebihkan sebesar 0,0042, dan «pemenang tunggal» ternyata seri empat arah.

## Guided Task di Colab

Notebook: colab/mlf-m65-guided-task.ipynb — flagship LR/GBM, grid 18 konfigurasi (CV vs test), kedua uji McNemar (manual + cek silang scipy), dan nested CV untuk ketiga kandidat protokol adil. Tautan Colab: https://colab.research.google.com/drive/1iOHEx9XKctH-1Wd_tmkDi7Wx8gX75cWs

## Rangkuman

- AutoML mengotomasi pencarian (grid 18 konfigurasi GBM, 54 fit; random search 27 konfigurasi, terbaik di antara 27 konfigurasi itu 0,7866 — hanya 0,0001 di atas grid), bukan perumusan.
- Winner's curse [notebook]: juara CV (max_iter 100, max_depth 5, learning_rate 0,05) skor CV 0,7865 → test 0,7823, optimisme 0,0042; rata-rata optimisme 18 konfigurasi juga 0,0042 — 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua 18 kandidat, bukan estimasi eksklusif curse; bukti curse adalah ketidakstabilan peringkat (K15 menyamai skor test tertinggi; seri 4 arah). Curse kecil di sini karena gain tuning kecil; besar bila kandidat banyak, validasi kecil, selisih antar kandidat tipis.
- Penyebabnya seleksi atas noise (Ŝ = S + ε): peringkat berubah (K15 peringkat-15 CV menyamai skor test tertinggi) dan empat konfigurasi seri di test 0,7823.
- McNemar (threshold 0,5, test 6.000) [notebook]: LR vs GBM b = 132, c = 199, χ² = 13,1601, p (metode chi2) = 0,0003 → GBM menang SIGNIFIKAN; GBM vs tertala b = 36, c = 30, χ² = 0,3788, p = 0,5383 → TIDAK signifikan, kemenangan tuning TIDAK TERBUKTI.
- Signifikan ≠ penting: selisih nested-CV tertala vs default 0,0018 hanya ~0,26× sd antar-fold 0,0068.
- Protokol adil: nested CV — LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068); konfigurasi terbaik berganti tiap outer fold; test terkunci; satu metrik utama (ROC-AUC).
- Pemenang jujur: GBM tertala, 0,7858 (sd antar-fold 0,0068) — dengan catatan keunggulannya atas default tidak signifikan dan tidak penting; GBM default sama sahnya bila kesederhanaan dihitung. Jangan laporkan 0,7865 sebagai performa.
- Jebakan: leaderboard-chasing, test peeking (test yang diintip bukan lagi test tak-bias), AutoML kotak hitam tanpa jejak seleksi.
- Lab: McNemar manual χ² = 13,1601, signifikan (p kanonis 0,0003); winner's curse 18 konfigurasi — optimisme rata-rata 0,0042, pemenang test K1 = 0,7823, seri 4 arah.
- Single vs ensemble (M4.1 sudah mengajarkan ensembles — di sini hanya opsi seleksi, tanpa angka baru): tiga kandidat kanonis di frontier Pareto — LR tertala 0,7560, GBM default 0,7840, GBM tertala 0,7858; posisi ensemble belum diukur [ilustrasi]; ensemble hanya layak bila peningkatan cukup besar dan stabil untuk membayar kompleksitas tambahannya.
- Finalisasi model: refit konfigurasi terpilih (max_iter 100, max_depth 5, learning_rate 0,05) di train penuh; selection record (dataset version, seed 42, folds, search space, primary metric, konfigurasi terpilih, calibration method, threshold 0,50, skor final); yang boleh dilaporkan sebagai performa adalah skor nested 0,7858 — CV 0,7865 adalah skor pemilihan (bias ke atas), test 0,7823 satu pengukuran.
- Experiment tracking lintas sesi: registry mencatat setiap run termasuk yang gagal; tiga sesi kanonis = 54 percobaan (18+27+9); laporan yang hanya menampilkan run terbaik (0,7869) TIDAK VALID — jumlah percobaan disembunyikan dan test ikut terintip berulang kali; «effective number of attempts» kualitatif [ilustrasi].
