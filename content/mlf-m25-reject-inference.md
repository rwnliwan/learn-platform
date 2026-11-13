# MLF-M2.5: Reject Inference — Model yang Tidak Pernah Melihat Penolakan

## Masalah: 6.588 Pelamar Ditolak — dan Model Tidak Tahu Apa-apa tentang Mereka

Bank menerima 30.000 pengajuan, menyetujui 23.412, menolak 6.588. Dari yang disetujui, 14,95% default. Dari yang ditolak — bank tidak tahu, karena mereka tidak pernah diberi pinjaman. Model dilatih pada 23.412 yang disetujui — dan hanya pada mereka. Bila bank melonggarkan kebijakan, berapa risiko yang ditolak? Itulah reject inference.

---

## 1. Selection Bias

Data latih bukan sampel acak dari populasi yang diprediksi — melainkan sampel yang sudah diseleksi oleh keputusan approval itu sendiri.

**Nilai:** simulasi approval [notebook], aturan sintetis [ilustrasi] (PAY_0 ≤ 1 DAN LIMIT_BAL ≥ 50.000): approval rate 0,7804 (23.412 disetujui, 6.588 ditolak). Default aktual: disetujui 0,1495; ditolak 0,4759; semua 0,2212. Model-A (latih pada yang disetujui): mean PD disetujui 0,1495 (aktual 0,1495 — tepat); ditolak 0,2337 (aktual 0,4759 — gap 0,2422); semua 0,1680 (aktual 0,2212 — gap 0,0532 = 1.596 default yang «hilang» dari perhitungan).

**Gambar:** bar aktual vs model-A — pada yang disetujui sama tinggi (0,1495); pada yang ditolak aktual dua kali prediksi (0,4759 vs 0,2337).

**Baik/buruk:** model-A bagus pada populasi yang sama dengan latihnya. Buruk bila dipakai menilai pelamar di luar kriteria approval.

**Mitigasi:** ranking aman (ROC-AUC model-A 0,7124 vs oracle 0,7139 — selisih 0,0015); yang rusak KALIBRASI-nya. Jangan pakai model di luar populasi latih tanpa diagnosis — bandingkan distribusi fitur dulu.

---

## 2. Obat 1: Extrapolation

Terapkan saja model-A ke yang ditolak dan baca prediksinya.

**Nilai:** mean PD pada yang ditolak tetap 0,2337 [notebook] — mendiagnosis gap 0,2422 dengan baik, tapi tidak memperbaikinya. ROC-AUC 0,7124.

**Baik/buruk:** bagus sebagai langkah pertama (murah, menunjukkan besar biasnya). Buruk bila dipakai sebagai estimasi risiko tanpa koreksi.

**Mitigasi:** pakai untuk mendiagnosis dan membandingkan skenario; laporkan angkanya sebagai batas bawah, bukan estimasi.

---

## 3. Obat 2: Reweighting

Latih ulang dengan bobot 1/P(approve) — nasabah yang «hampir ditolak» diberi bobot besar karena paling mirip dengan yang ditolak.

**Nilai:** bobot 1/P(approve), clip 0,05 [notebook] — mean PD pada yang ditolak naik 0,2337 → 0,2804. Gap menyusut 0,2422 → 0,1955 — terpotong seperlima, bukan hilang. ROC-AUC 0,7154.

**Baik/buruk:** paling membantu di antara tiga obat. Buruk bila P(approve) dimodelkan buruk — bobot yang salah lebih berbahaya daripada tanpa bobot. Bobot jinak di simulasi ini: min 1,00 / median 1,02 / maks 4,27 — clip 0,05 tidak aktif (tidak ada P(approve) di bawah 0,234); clip relevan bila ada P(approve) sangat kecil.

**Mitigasi:** estimasi P(approve) dengan model terpisah, validasi, clip bobot, laporkan distribusi bobot. Reweighting hanya mengoreksi seleksi TERAMATI — bila approval bergantung pada hal yang tidak ada di data, tidak ada bobot yang bisa mengoreksinya.

---

## 4. Obat 3: Fuzzy Augmentation

Tiap yang ditolak diduplikasi dua kali — label default (bobot 0,5 × p) dan label lancar (bobot 0,5 × (1 − p)), p = PD prediksi model-A. Lalu latih ulang.

**Nilai:** hasil SAMA PERSIS dengan model-A [notebook] — mean PD pada yang ditolak 0,2337, ROC-AUC 0,7124; koefisien beda maksimal 0,000875. Label lunaknya berasal dari model-A itu sendiri — model baru hanya menggemakan model lama.

**Gambar:** mean PD pada yang ditolak — aktual 0,4759 (target); model-A 0,2337; reweighting 0,2804; fuzzy 0,2337; oracle 0,3938. Bahkan oracle (latih semua data termasuk outcome yang ditolak) masih di bawah aktual 0,4759.

**Baik/buruk:** bagus sebagai pengingat bahwa «data tambahan» dari model sendiri bukanlah data. Buruk bila dipakai sebagai solusi — rasa aman palsu.

**Mitigasi:** yang memperbaiki sungguh-sungguh hanyalah data baru: approve sebagian kecil yang ditolak secara acak dan amati outcome-nya (reject sampling), atau beli data biro kredit. Informasi tentang yang tidak teramati tidak bisa didapat gratis.

---

## Lab 1: Ukur Bias Model-A

Approval 0,7804; gap ditolak 0,2422; gap semua 0,0532; default yang «hilang» 1.596 nasabah [lab].

## Lab 2: Reweighting Horvitz–Thompson (12 Pelamar Sintetis)

Band High (6 orang, semua disetujui, 1 default); band Low (6 orang, 2 disetujui/1 default, 4 ditolak/2 default). P(approve|High) = 1,0 → bobot 1; P(approve|Low) = 0,3333 → bobot 3. Naive 0,2500; reweighted 0,3333 = aktual 0,3333 [lab]. Di contoh kecil ini approval di dalam band bersifat acak sehingga reweighting tepat — di data UCI sesungguhnya hanya parsial (0,2804 vs target 0,4759).

## Mini-case: Bank Ingin Melonggarkan Kebijakan

Tiga jawaban salah: model-A mentah (meremehkan 0,2422), fuzzy («sudah memakai data yang ditolak» — padahal menggemakan), oracle (0,3938 — dan outcome yang ditolak memang tidak ada di produksi). Jawaban benar: reject sampling — setujui 5% dari 6.588 secara acak (329 nasabah), amati 12 bulan; selisih baku sekitar 0,028. Sambil menunggu, pakai reweighting (0,2804) sebagai estimasi sementara dengan catatan itu batas bawah.

**Desain sampling yang benar:** acak DALAM score band/risk band (stratified) — jangan hanya mengambil penolakan dengan skor tertinggi; dokumentasikan override dan policy; amati outcome 12 bulan. SE = √(p(1−p)/n): dengan p ≈ 0,476 dan n = 329, SE ≈ 0,0275. Alokasi per band [notebook]: di bawah 460: n = 2.205 (33,5%), default 0,6993 → 110 nasabah (SE 0,0437); 460–499: n = 2.793 (42,4%), default 0,4436 → 139 (SE 0,0421); 500+: n = 1.590 (24,1%), default 0,2226 (semuanya 500–519; tidak ada rejected ≥ 520) → 80 (SE 0,0465). SE per band lebih besar dari SE keseluruhan — harga dari stratifikasi.

## Peta Keputusan

- Model dipakai menilai kelompok yang berbeda? Audit fairness dulu (M2.2): approval SEX = 2 adalah 0,3007 vs SEX = 1 adalah 0,2614 (AIR 1,1502), bad rate approved hampir sama (0,0665 vs 0,0669); IV SEX yang rendah (0,0092) tidak membuktikan model fair.
- Memilih model yang dipakai bank — champion–challenger (lengkap di M2.3) [notebook]: scorecard ROC-AUC 0,7248 vs LR 0,7426 vs GBM 0,7823; kalibrasi desil terburuk scorecard 0,1406 vs GBM terkalibrasi 0,0181. Scorecard ≥ 500: approval 0,7232, bad rate 0,1415, EL NT$46.382.448, profit −NT$9.140.169 (RUGI — jangan pakai ambang 500). Scorecard ≥ 520: approval 0,1972, bad rate 0,1057, EL NT$16.121.864, profit NT$2.179.202. GBM threshold 0,10: approval 0,2850, bad rate 0,0667, EL NT$11.989.453. Skor test: mean 504,0, min 437, maks 532. Scorecard butuh threshold-nya sendiri, bukan 500.
- Artefak penutup modul — scorecard card satu halaman (dokumentasi penuh adalah M8): tujuan; definisi default (90+ hari tunggakan bulan berikutnya, horizon 1 bulan); populasi (30.000 nasabah kartu kredit Taiwan, Sep 2005); fitur & binning (PAY_0 7 bin, LIMIT_BAL 6 bin, AGE 5 bin); performa (ROC-AUC 0,7248, korelasi skor-default −0,4204, band skor monoton 0,6993 → 0,0892); threshold (approve ≥ 520); fairness audit (AIR 1,1502; FPR 0,6434 vs 0,6817; FNR 0,0940 vs 0,0749); asumsi & batasan (label 1 bulan; LGD 45% [ilustrasi]; EAD = LIMIT_BAL [proxy]; approval rule sintetis); versi & owner. Mini-case pengisian: bila atasan bertanya «di mana buktinya scorecard ini adil?» — jawab dengan AIR 1,1502 dan bad rate approved 0,0665 vs 0,0669, bukan «IV SEX rendah».

## Guided Task di Colab

Notebook: colab/mlf-m25-guided-task.ipynb — aturan approval sintetis pada UCI 30.000 nasabah, model-A, gap kalibrasi, ketiga obat, perbandingan dengan oracle (termasuk verifikasi koefisien fuzzy nyaris identik dengan model-A). Tautan Colab: Buka di Colab: https://colab.research.google.com/drive/1iExwvjnz_V5zmVO4A_FjhY-qkVxLId68. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Selection bias: model hanya melihat yang disetujui — meremehkan yang ditolak 0,2422.
- Ranking aman (ROC-AUC 0,7124 vs oracle 0,7139); kalibrasi yang rusak.
- Extrapolation mendiagnosis; reweighting paling membantu (0,2804); fuzzy menggemakan (0,2337).
- Bahkan oracle (0,3938) masih di bawah aktual 0,4759.
- Yang memperbaiki sungguh-sungguh: data baru — reject sampling atau data biro kredit.
- Alokasi sampling per band: 110 / 139 / 80 — SE per band 0,0437 / 0,0421 / 0,0465.
- Scorecard butuh threshold-nya sendiri: ≥ 500 rugi NT$9.140.169; ≥ 520 untung NT$2.179.202.
- Checklist batasan UCI: bukan origination/vintage sejati; tanpa recovery cash flow (LGD tidak bisa dilatih); tanpa utilization-at-default (EAD tidak bisa dilatih); label 1 bulan; approval rule sintetis; hasil tidak otomatis mewakili bank/negara/produk/periode lain.
