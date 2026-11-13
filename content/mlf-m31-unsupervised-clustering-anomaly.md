# MLF-M3.1: Unsupervised — Clustering & Anomaly Detection

## Masalah: Bank Tanpa Label Fraud — Hanya Pola Pembayaran

Bank punya 30.000 nasabah dengan riwayat pembayaran enam bulan — status bayar, tagihan, jumlah yang dibayar. Yang tidak ada: label «fraud» atau «bukan fraud». Tim fraud hanya sanggup memeriksa 1.500 nasabah per bulan (5 persen). Pertanyaannya bukan «siapa yang fraud?» — itu tidak bisa dijawab tanpa label. Pertanyaannya: «1.500 nasabah mana yang paling layak diperiksa manusia lebih dulu?» dan «apakah 30.000 nasabah ini terdiri dari beberapa kelompok dengan perilaku berbeda?»

Tanpa satu pun label, KMeans menemukan satu kelompok (cluster 0, n = 3.183) dengan default rate 0,6318 — hampir tiga kali base rate 0,2212 [notebook]. Isolation Forest, dengan jatah flag 5 persen, menandai 1.500 nasabah yang default rate-nya 0,4367 [notebook]. Dua alat tanpa label, dua sinyal yang langsung bisa dipakai: satu segmen untuk diawasi, satu antrean untuk diperiksa. Keduanya dipakai untuk MEMPRIORITASKAN, bukan untuk MEMUTUSKAN — keputusan akhir tetap di tangan manusia.

---

## 1. Apa Itu Unsupervised

Supervised belajar dari pasangan (X, y): fitur dan jawaban. Unsupervised hanya punya X — fitur tanpa jawaban. Model mencari struktur di dalam X itu sendiri: kelompok yang mirip, dan titik yang tidak mirip siapa pun.

**Nilai:** 8 fitur dipakai untuk clustering [notebook]: enam status bayar PAY_0, PAY_2, PAY_3, PAY_4, PAY_5, PAY_6 (dataset UCI memang tidak punya kolom PAY_1 — penomoran aslinya melompat dari PAY_0 ke PAY_2), plus UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL) dan PAY_RATIO (PAY_AMT1 dibagi BILL_AMT1, tagihan ≤ 0 dipatok ke 1). Semua fitur distandardisasi dulu — tanpa standardisasi, BILL_AMT1 (dalam NT$, sampai ratusan ribu) menenggelamkan PAY_0 (nilai −2 sampai 8).

**Baik/buruk:** bagus bila label tidak ada atau tidak bisa dipercaya — fraud yang belum ketahuan akan salah berlabel «bukan fraud» di data supervised. Buruk bila dipakai untuk pertanyaan yang butuh label: «berapa probabilitas nasabah ini default?» tetap dijawab supervised (M2.1).

**Mitigasi:** tentukan pertanyaan dulu. Butuh segmen → clustering. Butuh antrean pemeriksaan → anomaly detection. Butuh probabilitas → supervised. Bila label akhirnya tersedia (hasil pemeriksaan manusia), pakai label itu untuk MENGEVALUASI hasil unsupervised — seperti default rate sebagai proxy di lesson ini.

---

## 2. KMeans

Dua langkah diulang sampai stabil. Assign: tiap nasabah ke cluster yang centroid-nya paling dekat (jarak Euclidean pada fitur terstandardisasi). Update: tiap centroid digeser ke rata-rata anggota cluster-nya.

**Nilai [notebook]:** k = 4, seed 42, silhouette 0,3969. Cluster 0 (n = 3.183; 10,61%) default 0,6318, mean PAY_0 1,66, mean UTILIZATION 0,619 — klaster risiko tinggi. Cluster 1 (n = 9.837; 32,79%) default 0,1630, mean PAY_0 −0,82, mean UTILIZATION 0,059 — pembayar lunas. Cluster 2 (n = 16.971; 56,57%) default 0,1781, mean PAY_0 0,14, mean UTILIZATION 0,599 — mayoritas revolving. Cluster 3 (n = 9; 0,03%) default 0,0000, mean PAY_0 −0,67, mean UTILIZATION −0,139 — BUKAN segmen, melainkan artefak saldo negatif (kredit); cek ukuran cluster sebelum percaya.

**Gambar:** diagram assign → update centroid — titik berwarna mengelompok di sekitar dua centroid; centroid adalah rata-rata anggota, bukan nasabah nyata.

**Baik/buruk:** bagus bila cluster kira-kira bulat dan hasilnya harus dijelaskan («cluster 0 = telat + limit besar»). Buruk bila data penuh outlier — centroid ditarik outlier, dan satu titik ekstrem bisa «mencuri» satu cluster.

**Mitigasi:** standardisasi fitur sebelum clustering; jalankan beberapa seed dan periksa stabilitas; laporkan ukuran tiap cluster berdampingan dengan profilnya.

$$J = \sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2$$

(Rumus ringkas untuk intuisi — fungsi objektif KMeans/inertia yang diminimalkan lewat assign–update.)

---

## 3. Isolation Forest

Alih-alih mempelajari «normal», algoritma mencoba MENGISOLASI tiap titik: pilih satu fitur acak, satu nilai split acak, belah — ulangi sampai titik itu sendirian. Titik normal butuh banyak belahan; titik aneh terisolasi dalam sedikit belahan.

**Nilai [notebook]:** contamination 0,05, seed 42 — flagged 1.500 nasabah (5,00%), default rate ter-flag 0,4367 vs tidak ter-flag 0,2099. Dari 6.636 default, 655 berada di kelompok flagged (9,87%); 5.981 default (90,13%) TIDAK ter-flag.

**Gambar:** bar flagged 0,4367 vs tidak ter-flag 0,2099, garis base rate 0,2212 — flagged dua kali lebih berisiko, tapi 90,13% default lolos: ini antrean pemeriksaan, bukan jaring pengaman.

**Baik/buruk:** bagus bila yang dicari «tidak biasa» dan antrean harus terisi dengan kapasitas tetap (contamination = kapasitas tim). Buruk bila «tidak biasa» disamakan dengan «jahat» — nasabah kaya berpola unik atau bersaldo negatif semuanya «tidak biasa», dan semuanya bukan fraud.

**Mitigasi:** tetapkan contamination dari KAPASITAS pemeriksaan (0,05 = 1.500/bulan); laporkan tangkapan (655; 9,87%) DAN yang lolos (5.981; 90,13%) berdampingan. Skor anomali BUKAN probabilitas terkalibrasi — skor 0,9 bukan «peluang fraud 90 persen».

$$s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$

(Rumus pedagogis: E(h(x)) = rata-rata panjang path isolasi; skor mendekati 1 = anomali, sekitar 0,5 = normal. Bukan probabilitas terkalibrasi.)

**Peringatan jujur:** anomaly ≠ fraud. Flagged hanya berarti «perilaku tidak biasa» yang layak diperiksa manusia. Label UCI adalah default bulan berikutnya (Oktober 2005, horizon 1 bulan) — BUKAN fraud. Default adalah proxy untuk evaluasi, bukan label fraud.

---

## 4. Evaluasi Tanpa Label

Tiga lensa, dipakai bersama: (1) silhouette, (2) stabilitas antar seed/periode, (3) membaca cluster lewat label proxy — dengan caveat jujur.

**Nilai:** silhouette KMeans k = 4 adalah 0,3969 [notebook]. Panduan bacaan (Kaufman–Rousseeuw, heuristik): di atas 0,70 struktur kuat; (0,50; 0,70] wajar; [0,26; 0,50] lemah; di bawah 0,26 tidak ada struktur. Maka 0,3969 = struktur LEMAH — cluster terbentuk tapi tumpang tindih masih besar. Bukan kegagalan: data perilaku pembayaran memang tidak terpisah rapi. Profil cluster lewat proxy default rate [notebook]: cluster 0 0,6318 (n = 3.183), cluster 1 0,1630 (n = 9.837), cluster 2 0,1781 (n = 16.971), cluster 3 0,0000 (n = 9).

**Catatan verifikasi:** silhouette terhitung ulang di notebook adalah 0,3969 vs 0,3969 kanonis (selisih 0,0056). Semua angka lain cocok persis sampai 4 desimal. Bacaan band-nya sama (struktur lemah).

**Gambar:** bar default rate per cluster + garis base rate 0,2212 — hanya cluster 0 yang jauh di atas base rate; cluster 3 terlalu kecil untuk dibaca sebagai segmen.

**Baik/buruk:** silhouette bagus untuk membandingkan pilihan k pada data yang sama; buruk bila dijadikan satu-satunya alasan memilih k. Proxy default rate bagus untuk memberi NAMA pada cluster — buruk bila nama itu dianggap kebenaran tentang nasabahnya.

**Mitigasi:** laporkan silhouette (0,3969) + ukuran tiap cluster + profil tiap cluster berdampingan. Cluster n = 9 tidak diberi nama segmen — diberi catatan «artefak, periksa satu per satu».

$$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$

(a(i) = jarak rata-rata ke anggota cluster sendiri; b(i) = jarak rata-rata ke cluster tetangga terdekat.)

---

## 5. Validasi Temporal untuk Unsupervised

Aturan G1 dari M2, diterjemahkan ke unsupervised: scaler, KMeans, dan Isolation Forest di-fit HANYA pada periode train — lalu diterapkan ke periode berikut dengan predict. Yang tidak boleh: men-standardisasi atau men-cluster SELURUH data dulu, baru membaginya menjadi train dan test. Itu leakage.

**Nilai [notebook]:** bagi stratified 24.000 train / 6.000 test (seed 42), fit hanya di train. Cluster risiko tertinggi stabil: train 0,6299 vs test 0,6352 (selisih 0,0053). Cluster mungil: n = 8 di train, n = 1 di test — artefak yang tidak lolos validasi. Isolation Forest: train flagged 1.187 (default 0,4558), test flagged 309 (default 0,4401).

**Fakta struktural (jujur):** UCI satu snapshot (fitur April–September 2005, label Oktober 2005, horizon 1 bulan) — split out-of-time sungguhan TIDAK mungkin. Yang diajarkan adalah prinsip + aturan fit-di-train-terapkan-ke-berikutnya, dengan train/test sebagai demonstrasi.

---

## 6. Semi-Supervised

Tim fraud punya 200 hasil review manusia (150 train / 50 validasi) dan 9.800 transaksi tanpa label — plus audit independen 1.000 transaksi (166 fraud) yang tidak pernah dipakai melatih. Semua angka di sini dari data sintetis [ilustrasi] (seed 42).

**Nilai [ilustrasi]:** baseline LR 150 label — precision 0,6216, recall 0,1386, F1 0,2266, PR-AUC 0,4509; recall validasi-50 hanya 1 dari 10. Pseudo-labeling (ambang ≥0,95/≤0,05): 0 pseudo-fraud, 212 pseudo-legit (99,06 persen benar, 2 salah) — retrain: precision 0,5775, recall 0,2470, F1 0,3460, PR-AUC 0,4500. Label propagation di graf akun-device (component terbesar 1.990 dari 2.000 akun): precision 0,1143, recall 0,0241, F1 0,0398, PR-AUC 0,1755 — di bawah base rate audit 0,166. Retrain 200 label + pseudo-label: PR-AUC 0,4354 — tidak lebih baik dari pseudo-labeling saja.

**Gambar:** bar PR-AUC di audit — baseline 0,4509; pseudo-labeling 0,4500; label propagation 0,1755; retrain 0,4354; garis base rate 0,166. Baseline, pseudo-labeling, dan retrain nyaris sama; label propagation nyaris setara acak.

**Baik/buruk:** pseudo-labeling bagus bila model sudah cukup yakin di sebagian data (sisi «lancar» yakin, recall naik 0,1386 → 0,2470) — buruk bila dibaca sebagai «belajar dari data baru», karena ia hanya memakai ulang keyakinan model sendiri (PR-AUC tidak bergerak). Label propagation bagus bila tetangga benar-benar berbagi label — buruk di sini karena fraud-nya feature-driven, bukan graph-clustered (skor ring 0,2522 vs non-ring 0,1936, tapi recall@0,5 di subset ring 0 dari 13).

**Mitigasi:** nilai selalu dengan label independen; kalibrasi ambang pseudo-label (≥0,95 menghasilkan 0 pseudo-fraud — sinyal model tidak yakin); bila label akhirnya cukup, pindah ke supervised penuh — semi-supervised adalah jembatan, bukan tujuan.

---

## Lab 1: KMeans dari Nol

12 titik 2D, centroid awal eksplisit (1,0; 1,0) dan (9,0; 9,0), 2 iterasi assign–update. Centroid akhir 0: (1,5833; 1,5000); centroid akhir 1: (8,5833; 8,5000); assignment [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1] [lab]. Iterasi 2 tidak mengubah apa-apa — konvergen dalam 1 iterasi karena kelompok terpisah jelas. Di data nyata (silhouette 0,3969) konvergensi tidak secepat ini.

## Lab 2: Anomaly Scoring lewat Jarak ke Centroid

10 titik: 8 berkumpul di sekitar (0, 0)–(1, 1), 2 jauh — (5,0; 5,0) dan (6,0; 0,5). Jarak ke centroid semua titik, ubah ke z-score (simpangan baku populasi). Titik 8: jarak 5,4753, z = 2,2431; titik 9: jarak 4,5727, z = 1,6678 [lab]. Flagged: [8, 9]. Kelemahan metode ini: outlier ikut menarik mean jarak ke atas, sehingga z-score mereka «terlihat» lebih kecil — alasan Isolation Forest memakai isolasi acak, bukan jarak ke pusat.

## Mini-case: 1.500 Pemeriksaan, Siapa Diperiksa Dulu?

Kapasitas 1.500/bulan. Daftar flagged (1.500 nasabah): ekspektasi default 1.500 × 0,4367 = 655 [notebook]. Daftar acak: 1.500 × 0,2212 = 332. Flagged menangkap hampir dua kali lipat. Tapi lubangnya: 5.981 default (90,13%) TIDAK ter-flag [notebook]. Cluster 0 (3.183 nasabah) lebih besar dari kapasitas — ia segmen pengawasan, bukan antrean: limit baru ditahan, transaksi besar diminta verifikasi. Cluster 3 (n = 9) diperiksa satu per satu. Keputusan: isi 1.500 slot dari skor anomali tertinggi; awasi cluster 0; laporkan tiap bulan tangkapan (655) DAN yang lolos (5.981). Flagged = «periksa dulu», bukan «blokir».

## Guided Task di Colab

Notebook: colab/mlf-m31-guided-task.ipynb — KMeans k = 4 (silhouette 0,3969) + Isolation Forest (1.500 ter-flag) di data UCI 30.000 nasabah dengan sklearn, lengkap dengan checks (7 checks lolos, 0 error). Tautan Colab: https://colab.research.google.com/drive/1MlbD7ManBIfjU5Y-SVIr_yJRft7bHq7K

## Rangkuman

- Unsupervised belajar dari pola tanpa label: KMeans mengelompokkan yang mirip, Isolation Forest menandai yang aneh.
- KMeans k = 4, seed 42: silhouette 0,3969 (struktur lemah); cluster 0 risiko tinggi 0,6318 (n = 3.183), cluster 1 pembayar lunas 0,1630, cluster 2 mayoritas revolving 0,1781, cluster 3 artefak n = 9.
- Isolation Forest contamination 0,05: 1.500 ter-flag, default 0,4367 vs 0,2099 — menangkap 655 dari 6.636 default (9,87%); 5.981 (90,13%) lolos.
- Anomaly ≠ fraud; skor anomali bukan probabilitas terkalibrasi; default adalah proxy (horizon 1 bulan), bukan label fraud.
- Evaluasi tanpa label: silhouette + stabilitas + baca cluster lewat proxy; cluster n = 9 tidak diberi nama segmen.
- Validasi temporal: fit scaler + KMeans + Isolation Forest di train saja, terapkan ke periode berikut — UCI satu snapshot, OOT sungguhan tidak mungkin.
- Lab: KMeans dari nol konvergen dalam 1 iterasi (centroid 1,5833/1,5000 dan 8,5833/8,5000); anomaly scoring menandai titik 8 dan 9 (z 2,2431 dan 1,6678).
- Semi-supervised [ilustrasi]: baseline 150 label PR-AUC 0,4509; pseudo-labeling (212 pseudo-legit, 99,06 persen benar) menaikkan recall 0,1386 → 0,2470 tapi PR-AUC nyaris tidak bergerak (0,4500); label propagation PR-AUC 0,1755 — nyaris acak, karena fraud di sini feature-driven, bukan graph-clustered.
- Aturan semi-supervised: nilai selalu dengan label independen (audit 1.000 tidak pernah dipakai melatih); kalibrasi ambang pseudo-label (≥0,95 menghasilkan 0 pseudo-fraud); pseudo-label tidak menambah informasi baru — ia memakai ulang keyakinan model sendiri.
