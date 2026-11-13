# MLF-M7.2: Sumber Bias dan Audit — Dari Mana Ketimpangan Itu Berasal

## Masalah: Satu Model, Dua Cerita

M7.1 sudah mengukur ketimpangannya: model yang sama, GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 — menyetujui laki-laki 26,1% dan perempuan 30,1%; menyetujui Pascasarjana 35,3%, Universitas 25,2%, SMA 20,9%, dan Lainnya 58,5%. Satu angka global — approval keseluruhan 28,5% — menyembunyikan keempat cerita itu. Lesson ini tidak mengulang pengukurannya. Lesson ini bertanya: DARI MANA ketimpangan itu berasal — dan bagaimana kamu membedakan ketimpangan yang nyata dari angka yang hanya tampak timpang?

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Approval berarti probabilitas default prediksi DI BAWAH threshold. ROC-AUC test GBM 0,7823, PR-AUC 0,5597. Grup diperiksa dengan definisi yang sama seperti M7.1: SEX (laki-laki n = 2.402, perempuan n = 3.598); EDUCATION (Pascasarjana n = 2.130, Universitas n = 2.774, SMA n = 1.014, Lainnya n = 82 — gabungan kode 0/4/5/6); MARRIAGE (Menikah n = 2.767, Lajang n = 3.158, Lainnya n = 75 — gabungan kode 0/3); AGE band (di bawah 30 tahun n = 1.912; 30–39 n = 2.198; 40–49 n = 1.341; 50–59 n = 473; 60+ n = 76). Semua angka audit di lesson ini dihitung pada test 6.000 yang sama.

**Nilai:** audit tanpa diagnosis sumber adalah vonis tanpa penyebab — kamu tahu ADA ketimpangan, tapi tidak tahu APA yang harus diperbaiki. Lima sumber bias di lesson ini adalah lima tempat berbeda untuk mencari penyebabnya: di pengukuran, di komposisi data, di label, di sampling, dan di agregasi.

**Baik/buruk:** angka global 28,5% itu bagus sebagai ringkasan bisnis — dan buruk sebagai bukti keadilan. Ia tidak berbohong, tapi ia menyembunyikan: selisih SEX 3,93 poin persen, selisih EDUCATION 37,63 poin persen (dari SMA 20,9% sampai Lainnya 58,5%), selisih AGE 13,38 poin persen (dari 60+ 19,7% sampai 30–39 tahun 33,1%).

**Mitigasi:** sebelum membaca satu pun angka grup, tulis dulu definisi grupmu (kode apa masuk grup mana, termasuk kode «lainnya» yang jarang) dan ambang keputusanmu (AIR di bawah 0,80 = flag, sebelum melihat angka).

**Miskonsepsi: menghapus kolom SEX membuat model adil.** Yang benar: model di lesson ini MEMAKAI SEX, EDUCATION, MARRIAGE, dan AGE sebagai fitur prediksi — koefisien LR: SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547; SHAP GBM SEX 0,0314 [notebook] — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357. Atribut sensitif memengaruhi keputusan lewat DUA jalur: langsung (kolomnya sendiri, bobot kecil) dan lewat proxy (limit, pola bayar, tagihan yang berkorelasi dengannya). Menghapus kolom sensitif dari fitur MENURUNKAN disparitas — AIR SEX 0,8694 → 0,9211 (M7.4) — tetapi TIDAK menuntaskannya: probe GBM masih memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261, dan AIR tetap di bawah 1,0. Buktinya ada di angka per grup, bukan di daftar fitur.

---

## 1. Taksonomi Lima Sumber Bias

Bias bukan satu hal — ia lima kegagalan yang berbeda, di lima tempat berbeda dalam pipeline. **Measurement bias:** fitur atau label DIUKUR berbeda antar grup. **Representation bias:** satu grup TERLALU SEDIKIT di data latih. **Label bias:** label yang dipakai melatih model MENCERMINKAN keputusan manusia masa lalu yang bias. **Selection bias (sampling bias):** data yang kamu punya BUKAN populasi yang akan kamu layani — yang masuk dataset sudah melewati saringan. **Aggregation bias:** satu metrik global MENYEMBUNYIKAN ketimpangan antar grup (paradoks Simpson).

Cara membedakannya adalah dengan bertanya DI MANA buktinya. Measurement bias dibuktikan dari DISTRIBUSI FITUR antar grup. Representation bias dibuktikan dari n PER GRUP di train. Label bias dibuktikan dari BASE RATE dan SEJARAH labelnya — dan sering kali TIDAK bisa dibuktikan dari data saja. Selection bias dibuktikan dari PERBANDINGAN POPULASI. Aggregation bias dibuktikan dari STRATIFIKASI.

**Baik/buruk:** taksonomi ini bagus karena tiap sumber punya UJI yang berbeda. Buruk bila dibaca sebagai «pilih satu sumber dan salahkan ia»: ketimpangan hampir selalu campuran — SMA di data ini adalah contohnya: base rate-nya tertinggi, limitnya terendah, FPR-nya tertinggi, dan ECE-nya terburuk di antara grup besar.

**Mitigasi:** untuk setiap ketimpangan, tulis hipotesis sumbernya DENGAN uji yang akan membuktikan atau membantahnya.

---

## 2. Measurement Bias: Ketika Penggarisnya Sendiri yang Bengkok

Measurement bias terjadi bila fitur atau label DIUKUR berbeda antar grup — bukan karena grupnya berbeda, melainkan karena ALAT UKURNYA berbeda. Limit kartu (LIMIT_BAL) bukan «kemampuan bayar» yang netral — ia hasil keputusan manusia masa lalu tentang berapa limit yang «pantas» untuk orang seperti nasabah itu.

**Nilai [notebook] — distribusi fitur per SEX di test 6.000:** LIMIT_BAL rata-rata laki-laki NT$164.482 vs perempuan NT$170.286 — perempuan rata-rata punya limit LEBIH BESAR 3,5%. PAY_MEAN laki-laki −0,1053 vs perempuan −0,2278 — perempuan rata-rata membayar LEBIH TEPAT WAKTU. UTILIZATION laki-laki 0,4661 vs perempuan 0,3987. PAY_DELAY_COUNT laki-laki 0,8805 vs perempuan 0,7932. Keempat fitur menunjuk arah yang SAMA: pada fitur-fitur yang dipakai model, perempuan rata-rata tampak LEBIH RENDAH RISIKO — dan base rate-nya memang lebih rendah (laki-laki 0,2336 vs perempuan 0,2129 di test; 0,2417 vs 0,2078 di data penuh 30.000).

$$\text{calibration gap}(g) = \bar{\hat{p}}_g - \bar{y}_g$$

Selisih kalibrasi per grup: rata-rata probabilitas prediksi di grup g dikurangi tingkat default aktual grup itu. SMA −0,0114 (meremehkan sedikit); Lainnya EDUCATION +0,0455 dan Lainnya MARRIAGE +0,0656 (melebih-lebihkan — tapi keduanya n kecil).

**Baik/buruk:** perbedaan fitur antar grup itu bagus sebagai PENJELASAN PARSIAL — sebagian kesenjangan approval bergerak seiring perbedaan risiko yang terukur. Buruk bila dibaca sebagai «jadi tidak ada bias»: perbedaan risiko yang terukur dan bias pengukuran bisa HIDUP BERSAMAAN.

**Mitigasi:** untuk tiap fitur penting, bandingkan distribusinya antar grup SEBELUM melatih. Bila satu fitur berbeda tajam antar grup, tanyakan: apakah fitur ini MENGUKUR risiko, atau MENGUKUR sejarah keputusan tentang grup itu?

---

**Checklist kualitas data per grup [notebook, data penuh 30.000 baris]:** (1) Nilai hilang: 0 di mana-mana — 0 NaN di semua 19 fitur utama, overall maupun per SEX/EDUCATION. (2) Kategori invalid: EDUCATION kode 0/5/6 = 345 baris (1,15%) — dan 73,72% dari grup «Lainnya» EDUCATION adalah kode-kode ini; MARRIAGE kode 0 = 54 baris (0,18%), terkonsentrasi di SMA (44 dari 54). (3) Pelanggaran range: BILL_AMT negatif = 1.930 baris (6,43%) — plausibel sebagai kredit/kelebihan bayar, bukan error; PAY_AMT negatif = 0; LIMIT_BAL ≤ 0 = 0; AGE di luar 21–79 = 0. (4) Duplikat: 0 baris penuh termasuk ID; 35 baris (0,12%) duplikat di luar ID.

**Baik/buruk:** checklist ini bagus karena ia membedakan «data kotor» dari «data yang tampak kotor»: BILL_AMT negatif tampak seperti error tapi plausibel. Buruk bila dibaca sebagai «0 missing berarti data bersih»: 345 baris kode invalid tidak muncul sebagai missing — ia muncul sebagai grup «Lainnya» yang tampak sah. **Mitigasi:** jalankan checklist ini per grup sebelum audit apa pun. Fitur yang perlu investigasi: EDUCATION dan MARRIAGE.

---

## 3. Tabel Audit Lengkap: Empat Atribut, Satu Tabel, Semua dengan n

Audit lengkap notebook credit scoring pada test 6.000, GBM terkalibrasi (Platt/sigmoid), threshold 0,10 [notebook]:

- **SEX** — laki-laki n = 2.402, approval 26,1%, AIR 0,8693, FPR 0,6817, FNR 0,0749, bad rate di antara yang disetujui 6,69%; perempuan n = 3.598, approval 30,1%, AIR 1,0000, FPR 0,6434, FNR 0,0940, bad rate 6,65%.
- **EDUCATION** — Pascasarjana n = 2.130, approval 35,3%, AIR 0,6032, FPR 0,5867, FNR 0,0963, bad rate 5,19%; Universitas n = 2.774, approval 25,2%, AIR 0,4298, FPR 0,6950, FNR 0,0793, bad rate 7,45%; SMA n = 1.014, approval 20,9%, AIR 0,3572, FPR 0,7463, FNR 0,0805, bad rate 9,91%; Lainnya n = 82, approval 58,5%, AIR 1,0000, FPR 0,4026, FNR 0,4000, bad rate 4,17%.
- **MARRIAGE** — Menikah n = 2.767, approval 28,0%, AIR 0,9606, FPR 0,6570, FNR 0,0823, bad rate 7,10%; Lajang n = 3.158, approval 29,2%, AIR 1,0000, FPR 0,6559, FNR 0,0881, bad rate 6,19%; Lainnya n = 75, approval 18,7%, AIR 0,6403, FPR 0,8095, FNR 0,1667, bad rate 14,29%.
- **AGE band** — di bawah 30 tahun n = 1.912, approval 26,6%, AIR 0,8037, FPR 0,6808, FNR 0,0820, bad rate 6,88%; 30–39 n = 2.198, approval 33,1%, AIR 1,0000, FPR 0,6057, FNR 0,0883, bad rate 5,49%; 40–49 n = 1.341, approval 27,0%, AIR 0,8149, FPR 0,6783, FNR 0,0994, bad rate 8,56%; 50–59 n = 473, approval 20,3%, AIR 0,6129, FPR 0,7535, FNR 0,0625, bad rate 7,29%; 60+ n = 76, approval 19,7%, AIR 0,5960, FPR 0,7358, FNR 0,0435, bad rate 6,67%.

$$\mathrm{AIR}(g) = \frac{\text{approval rate}(g)}{\max_h \text{approval rate}(h)}, \qquad \text{flag bila } \mathrm{AIR} < 0{,}80$$

**Gambar:** approval rate per grup (SEX + EDUCATION) dengan n-nya; garis putus-putus approval keseluruhan 28,5%. Bar tertinggi (Lainnya 58,5%) adalah bar dengan n TERKECIL (82 orang); tiga bar EDUCATION yang besar tersusun rapi SMA 20,9% → Universitas 25,2% → Pascasarjana 35,3%.

**Baik/buruk:** SEX lolos AIR (0,8693) tapi FPR-nya 0,6817 vs 0,6434. EDUCATION gagal AIR (0,3572) DAN gagal FPR (SMA 0,7463 vs Pascasarjana 0,5867). MARRIAGE hampir lolos semua — kecuali Lainnya (n = 75). AGE gagal AIR (0,5960) tapi TPR-nya rapat (0,9006 sampai 0,9565).

**Mitigasi:** setiap angka grup WAJIB ditemani n grupnya, dan setiap AIR WAJIB ditemani nama grup pembandingnya. Grup dengan n di bawah 100 dilaporkan dengan label «n kecil» dan TIDAK dipakai untuk vonis: Lainnya EDUCATION (n = 82), Lainnya MARRIAGE (n = 75), dan 60+ (n = 76).

---

## 4. Representation Bias: Grup yang Hampir Tidak Pernah Dilihat Model

**Nilai [notebook]:** EDUCATION Lainnya hanya 386 dari 24.000 baris train (1,6%), MARRIAGE Lainnya hanya 302 (1,3%), AGE 60+ hanya 263 (1,1%). Bandingkan: Universitas 11.256 (46,9%), Pascasarjana 8.455 (35,2%), 30–39 tahun 9.040 (37,7%), di bawah 30 tahun 7.706 (32,1%).

Konsekuensinya di test: EDUCATION Lainnya n = 82, approval 58,5% — tertinggi di EDUCATION — dengan interval Wilson 95% [47,7%; 68,6%], lebar 20,85 poin persen. MARRIAGE Lainnya n = 75, approval 18,7% — TERENDAH di MARRIAGE — interval [11,5%; 28,9%]. 60+ n = 76, approval 19,7%, interval [12,3%; 30,0%]. Ketiga grup kecil ini menempati posisi EKSTREM di tabelnya masing-masing — dan ketiganya adalah grup yang angkanya paling tidak bisa dipercaya.

**Baik/buruk:** representation bias ini bagus sebagai DIAGNOSIS — ia menjelaskan mengapa TPR Lainnya EDUCATION 0,6000 tidak boleh dibaca sebagai vonis: hanya 5 nasabah default di grup itu. Buruk bila dibaca sebagai «jadi ketimpangan EDUCATION bukan masalah»: tanpa Lainnya pun, AIR EDUCATION 0,5922 (SMA vs Pascasarjana, keduanya n ribuan) tetap flag.

**Mitigasi:** laporkan n TRAIN per grup di samping n test. Bila satu grup di bawah 2% train, tandai ia «kurang terwakili» SEBELUM membaca angkanya. Perbaikannya ada di data (kumpulkan lebih banyak contoh, oversampling), bukan di model.

**Jangan dicampur — dua jenis «kecil»:** Pascasarjana n = 2.130 adalah grup BESAR — AIR-nya 0,6032 bukan artefak n kecil. Yang kecil adalah PEMBANDINGNYA, Lainnya n = 82. Sebaliknya, Lainnya MARRIAGE (n = 75) dan 60+ (n = 76) adalah grup yang SENDIRI kecil — angkanya sendiri yang rapuh.

---

## 5. Label Bias: Ketika Labelnya Sendiri Mewarisi Keputusan Manusia

**Nilai [notebook] — base rate per grup di test 6.000:** SEX laki-laki 0,2336 vs perempuan 0,2129; EDUCATION Pascasarjana 0,1901, Universitas 0,2365, SMA 0,2574 (tertinggi di antara grup besar), Lainnya 0,0610 (n = 82); MARRIAGE Menikah 0,2414, Lajang 0,2049, Lainnya 0,1600; AGE di bawah 30 tahun 0,2233, 30–39 0,2061, 40–49 0,2327, 50–59 0,2368, 60+ 0,3026 (tertinggi). Pola base rate SEJALAN dengan pola approval: grup dengan base rate tertinggi (SMA 0,2574; 60+ 0,3026) adalah grup dengan approval terendah.

**Baik/buruk:** base rate yang sejalan dengan approval itu bagus sebagai BUKTI bahwa model tidak mengada-ada — ia merespons perbedaan risiko yang ada di label. Buruk bila dibaca sebagai «jadi labelnya benar»: base rate SMA 0,2574 vs Pascasarjana 0,1901 bisa berarti «nasabah SMA memang lebih berisiko» ATAU «nasabah SMA dulu diberi limit lebih kecil dan syarat lebih keras, sehingga lebih mudah tercatat default». Data ini tidak mencatat syarat pemberian kartu — jadi pertanyaan itu tidak bisa dijawab dari data ini.

**Mitigasi:** untuk tiap label, tanyakan: (1) SIAPA yang memberi label ini? (2) APA yang TIDAK tercatat? (3) APAKAH label ini akan sama bila prosesnya berbeda? Bila satu jawaban «tidak tahu», tulis «tidak tahu» di samping auditmu.

**Nuansa:** label «default payment next month» di dataset ini adalah PERILAKU yang teramati, bukan vonis manusia. Jadi label bias di sini lebih halus: ia hidup di SAMPING label — di siapa yang masuk dataset dan di fitur seperti limit yang sudah dipengaruhi keputusan manusia.

---

## 6. Selection Bias: Yang Tidak Ada di Data Tidak Bisa Diaudit

**Nilai [notebook]:** PSI (Population Stability Index) train vs test — SEX 0,0001; EDUCATION 0,0008; MARRIAGE 0,0002. Ketiganya jauh di bawah 0,1 (ambang «stabil»): komposisi train dan test NYARIS IDENTIK. PSI yang dihitung M2 (G9) sebesar 0,0104 — juga di bawah 0,1, stabil. Yang TIDAK bisa diperiksa dari data: apakah populasi dataset ini mewakili populasi yang akan dilayani — karena populasi yang tidak masuk dataset tidak meninggalkan jejak di dalam dataset.

$$\mathrm{PSI} = \sum_b (\text{actual}_b - \text{expected}_b) \times \ln\!\left(\frac{\text{actual}_b}{\text{expected}_b}\right), \qquad \mathrm{PSI} < 0{,}1 \text{ stabil}$$

**Baik/buruk:** PSI yang kecil itu bagus sebagai BUKTI TIDAK ADA DRIFT antara train dan test. Buruk bila dibaca sebagai «jadi datanya representatif»: PSI tidak pernah bisa membuktikan itu, karena ia hanya membandingkan dua bagian dari data yang sama.

**Mitigasi:** tulis «siapa yang TIDAK ada di sini» sebelum melatih — di sini: pengaju yang ditolak, non-nasabah, dan nasabah bank lain / tahun lain. Nyatakan batas itu di samping setiap angka audit. Bila memungkinkan, lakukan reject inference (M2.5).

---

## 7. Aggregation Bias: Satu Angka Global, Lima Cerita Berbeda

**Nilai [notebook] — selisih approval perempuan dikurangi laki-laki (F−M) per AGE band:** global +3,93 poin persen. Per band: di bawah 30 tahun +8,06 (perempuan 29,44% dari n = 1.243 vs laki-laki 21,38% dari n = 669); 30–39 tahun +3,27 (34,47% vs 31,20%); 40–49 tahun +0,81 (27,33% vs 26,52%); 50–59 tahun +0,07 (20,33% vs 20,26%); 60+ tahun +0,56 (20,00% vs 19,44%). Di dalam EDUCATION: Pascasarjana +2,26 (36,26% vs 34,00%), Universitas +4,00 (26,70% vs 22,70%), SMA +7,75 (24,05% vs 16,30%), Lainnya +9,40 (61,40% vs 52,00%).

**Gambar:** lima bar selisih F−M per AGE band; garis putus-putus selisih global +3,93. Ketimpangan SEX terkonsentrasi di nasabah muda (+8,06 pada di bawah 30 tahun) dan praktis hilang pada 50–59 tahun (+0,07).

$$\bar{r} = \sum_s w_s\, \bar{r}_s, \qquad w_s = \frac{n_s}{N}$$

Rata-rata global = rata-rata TERTIMBANG dari rata-rata per strata. Bila komposisi strata berbeda antar grup, rata-rata global bisa membalik arah tiap stratanya — itulah paradoks Simpson.

**Baik/buruk:** stratifikasi ini bagus karena menunjukkan DI MANA ketimpangan itu tinggal — di nasabah muda. Buruk bila dibaca sebagai «jadi tidak ada masalah global»: +3,93 global tetap nyata (uji-z: p = 0,001). Di data ini TIDAK terjadi pembalikan tanda (semua band F−M positif).

**Contoh pembalikan sejati [ilustrasi] — bukan dari data UCI:** Cabang A (kota besar): perempuan disetujui 60 dari 100 (60%), laki-laki 7 dari 10 (70%) — laki-laki lebih tinggi di cabang A. Cabang B (kota kecil): perempuan 1 dari 10 (10%), laki-laki 20 dari 100 (20%) — laki-laki lebih tinggi juga di cabang B. Global: perempuan 61 dari 110 (55,5%), laki-laki 27 dari 110 (24,5%) — perempuan lebih tinggi secara global. Laki-laki menang di TIAP cabang, perempuan menang secara GLOBAL.

**Mitigasi:** JANGAN PERNAH melaporkan selisih antar grup tanpa stratifikasi minimal satu variabel yang relevan. Bila selisih global dan selisih per strata berbeda jauh, laporkan KEDUANYA dan selidiki komposisinya.

---

## 8. Audit Irisan: Ketika Dua Atribut Bertemu, Ketimpangan Bisa Jauh Lebih Parah

Stratifikasi memotong data SATU atribut pada satu waktu. Audit irisan memotong DUA atribut sekaligus: SEX × EDUCATION, SEX × AGE. AIR SEX global 0,8693 dan AIR EDUCATION SMA 0,3572 masing-masing sudah flag — tapi tidak satu pun memberitahumu bahwa laki-laki SMA approval-nya hanya 16,30%.

**SEX × EDUCATION [notebook, test 6.000]:** Laki-laki × Pascasarjana AIR 0,5537 (n = 900); × Universitas 0,3697 (n = 1.066); × SMA 0,2655 (n = 411, base rate 0,2701, FPR 0,7933, Wilson [0,1305; 0,2018]) — sel TERPARAH, n cukup besar untuk divonis; × Lainnya 0,8469 (n = 25, JANGAN VONIS). Perempuan × Pascasarjana 0,5906 (n = 1.230); × Universitas 0,4349 (n = 1.708); × SMA 0,3917 (n = 603); × Lainnya 1,0000 (n = 57, terlalu kecil untuk vonis — TPR 0,0 karena hanya 2 defaulter).

**SEX × AGE [notebook]:** Laki-laki × 30–39 AIR 0,9051 (n = 907) — satu-satunya sel laki-laki yang mendekati adil; × 60+ 0,5640 (n = 36, flag); Perempuan × 30–39 1,0000 (n = 1.291). AIR global SEX 0,8693 MENYEMBUNYIKAN irisan yang jauh lebih parah — selisih −0,6038 (EDUCATION) dan −0,3053 (AGE).

**Baik/buruk:** audit irisan bagus karena menemukan ketimpangan yang tidak terlihat dari marginal mana pun. Buruk bila dibaca sebagai «semakin banyak irisan semakin baik»: tiap irisan membelah n menjadi potongan yang makin kecil — 18 sel, 4 di antaranya n < 100. **Mitigasi:** tambahkan audit irisan ke workflow sebagai langkah 3b. Peringatan multiple comparisons: 18 sel pada ambang 5% berarti ~1 flag palsu diharapkan secara kebetulan — flag yang berdiri sendiri diselidiki; flag yang membentuk POLA ditindaklanjuti.

---

## 9. Workflow Audit End-to-End

Lima langkah, berurutan dan tidak boleh dilompati. **Langkah 1 — DEFINISIKAN GRUP:** atribut yang diperiksa, pemetaan kodenya (termasuk kode «lainnya»), dan n minimum untuk vonis (n di bawah 100 = «n kecil»; untuk TPR, nasabah default di bawah 30 = «tidak dipakai untuk vonis»). **Langkah 2 — UKUR:** approval rate, AIR, FPR, FNR (atau TPR), PPV, ECE, Brier, dan bad rate per grup — SEMUA dengan n — pada data yang SAMA. **Langkah 3 — SELIDIKI SUMBER:** jalankan taksonomi sebagai daftar periksa; tulis hipotesis sumbernya DENGAN uji yang membantahnya. **Langkah 4 — PUTUSKAN AMBANG:** ambang ditetapkan SEBELUM melihat angka; flag pada grup BESAR (SMA, n = 1.014) berarti «selidiki dan rencanakan mitigasi» (M7.4); flag pada grup KECIL (Lainnya, n = 82) berarti «kumpulkan data dulu, jangan mitigasi dari noise». **Langkah 5 — DOKUMENTASIKAN:** model dan thresholdnya, definisi grup dan n-nya, tabel metriknya, hipotesis sumbernya, ambang keputusannya, dan apa yang TIDAK diketahui.

**Baik/buruk:** workflow ini bagus karena memaksa urutan yang benar — definisi dulu, ukur kemudian, selidiki, baru putuskan. Buruk bila dibaca sebagai birokrasi: lima langkah ini bisa dikerjakan dalam satu notebook (notebook guided task lesson ini melakukannya dalam 6 check).

**Mitigasi:** salin lima langkah ini menjadi template dan pakai template yang SAMA untuk setiap model, agar audit antar model bisa dibandingkan.

---

## 10. Noise vs Sinyal: Kapan Selisih Adalah Noise

**Nilai [notebook] — interval Wilson 95% untuk approval rate:** EDUCATION Lainnya (n = 82, 48 disetujui): [47,7%; 68,6%], lebar 20,85 poin persen. Pascasarjana (n = 2.130): [33,3%; 37,4%], lebar 4,06 poin persen. Perempuan (n = 3.598): [28,6%; 31,6%], lebar 2,99 poin persen. Bila Lainnya punya n = 2.000 dengan rate yang sama (58,5%), intervalnya menyempit menjadi [56,4%; 60,7%], lebar 4,31 poin persen — hampir LIMA KALI lebih sempit.

**Uji-z dua proporsi untuk SEX:** selisih approval laki-laki dikurangi perempuan −3,93 poin persen, standard error 1,19 poin persen, z = −3,30, p = 0,001 — selisih SEX adalah SINYAL. Intervalnya pun tidak bersinggungan (laki-laki [24,4%; 27,9%], perempuan [28,6%; 31,6%]).

**n penyebut untuk TPR:** Lainnya EDUCATION hanya punya 5 nasabah default (TP 3, FN 2) — SATU nasabah pindah kelompok mengubah TPR-nya 20 poin persen (dari 0,6000 menjadi 0,8000). Aturan M7.1: grup dengan nasabah default di bawah 30 orang TIDAK dipakai untuk vonis equal opportunity — di data ini, Lainnya (5) dan 60+ (23) masuk kategori itu.

**Gambar:** lima interval Wilson — tiga garis panjang (Lainnya EDUCATION, 60+, Lainnya MARRIAGE) adalah tiga grup kecil (n = 82, 76, 75); dua garis pendek (Perempuan, Pascasarjana) adalah estimasi yang bisa dipercaya. Titik paling ekstrem (Lainnya 58,5%) juga yang garisnya paling panjang — noise yang menyamar sebagai temuan.

**Baik/buruk:** interval yang lebar tidak membuktikan «tidak ada ketimpangan» — ia membuktikan «tidak tahu». Yang membuktikan ketimpangan EDUCATION adalah grup BESAR-nya: SMA vs Pascasarjana (AIR robust 0,5922) — interval SMA [18,5%; 23,5%] dan Pascasarjana [33,3%; 37,4%] TIDAK bersinggungan sama sekali.

**Mitigasi — aturan tiga lapis:** (1) n grup di bawah 100: laporkan, beri label «n kecil», jangan jadikan vonis. (2) Untuk TPR/FNR: hitung JUMLAH nasabah default per grup; di bawah 30 default, jangan vonis equal opportunity. (3) Untuk selisih antar grup besar: laporkan intervalnya DAN uji statistiknya.

---

## 11. Ketidakpastian Bootstrap: «Tidak Signifikan» Bukan Berarti «Tidak Ada Gap»

Bootstrap: ulangi pengukuran 1.000 kali pada sampel ulang dari test 6.000 yang sama, dan lihat seberapa lebar sebaran hasilmu. CI 95% bukan «jawaban yang benar» — ia RENTANG nilai yang masih cocok dengan datamu.

**Nilai [notebook, 1.000 ulangan, seed 42; semua gap F−M]:** selisih approval +3,93 pp, CI [1,78; 6,22] (nyata); AIR SEX 0,8693, CI [0,7978; 0,9391] (nyata — tidak mencakup 1); gap TPR −0,0191, CI [−0,0498; 0,0110] (mencakup 0 — tidak bisa divonis); gap FPR −0,0383, CI [−0,0653; −0,0123] (nyata); gap ECE +0,0012, CI [−0,0155; 0,0118] (mencakup 0); gap Brier −0,0143, CI [−0,0257; −0,0036] (nyata); gap PPV −0,0168, CI [−0,0446; 0,0101] (mencakup 0). Empat dari tujuh gap nyata; tiga tidak bisa divonis — dan ketiganya tetap DILAPORKAN dengan CI-nya.

**Baik/buruk:** bootstrap CI bagus karena mengubah «sinyal vs noise» dari vonis biner menjadi RENTANG. Buruk bila dibaca sebagai «CI mencakup 0 berarti tidak ada gap»: CI TPR mencakup 0 DAN mencakup −0,0498. **Mitigasi:** laporkan SETIAP gap dengan CI-nya — titik + interval, bukan titik saja. Satu kalimat yang wajib dihafal: «tidak signifikan ≠ tidak ada gap».

---

## 12. Lab 1 (ringkas): AIR dan Interval Wilson

Dari approval rate kanonis [notebook] — EDUCATION: Pascasarjana 0,3531, Universitas 0,2516, SMA 0,2091, Lainnya 0,5854 (n = 82; 48 dari 82 disetujui). Hasil [lab]: air_pasca=0.6032; air_edu=0.3572; ci_lo=0.4773; ci_hi=0.6858; ci_width=0.2085. AIR Pascasarjana 0,6032 memakai Lainnya (n = 82) sebagai pembanding — dan interval Lainnya selebar 0,2085 berarti pembanding itu sendiri goyah antara 47,7% dan 68,6%.

---

## 13. Lab 2 (ringkas): Stratifikasi Simpson dan AIR per Threshold

Selisih F−M per AGE band [notebook]: di bawah 30 tahun 0,0806; 30–39 tahun 0,0327; 40–49 tahun 0,0081; 50–59 tahun 0,0007; 60+ tahun 0,0056; global 0,0393. AIR SEX per threshold: 0,05 menjadi 0,9186; 0,10 menjadi 0,8693; 0,20 menjadi 0,9431; 0,50 menjadi 0,9898. Hasil [lab]: max_gap_band=below30; max_gap=0.0806; min_gap=0.0007; concentration=0.0413; air_range=0.1205. AIR 0,9898 di 0,50 bukan keadilan — itu threshold yang menyetujui hampir semua orang, dan labanya −NT$18.994.456 (M6.4).

---

## 14. Lab 3: Audit Irisan — group_key dan Gap yang Disembunyikan Angka Global

Approval rate SEX × EDUCATION [notebook]: tertinggi Perempuan × Lainnya 0,6140 (n = 57). Laki-laki × SMA: 0,1630 (n = 411). AIR global SEX: 0,8693. Hitung AIR Laki-laki × SMA (0,1630 / 0,6140 = 0,2655), gap yang disembunyikan angka global (0,8693 − 0,2655 = 0,6038), dan sel kecil (n < 100) di antara Laki-laki × Lainnya (25), Perempuan × Lainnya (57), Laki-laki × 60+ (36), Perempuan × 60+ (40) — semuanya, 4 sel.

---

## 15. Lab 4 (ringkas): Checklist Kualitas Data — Tandai Fitur yang Perlu Investigasi

Kode invalid EDUCATION (0/5/6): 345 dari 30.000 baris = 1,15%. BILL_AMT negatif: 1.930 dari 30.000 = 6,43%. Fitur yang perlu investigasi: EDUCATION — kode invalid-nya mencampur grup «Lainnya» (73,72% dari grup itu).

---

## 16. Rangkuman

- Lima sumber bias: measurement, representation, label, selection, aggregation.
- Tabel audit lengkap [notebook] (test 6.000, GBM terkalibrasi, threshold 0,10): SEX laki-laki 26,1% (n = 2.402, AIR 0,8693, FPR 0,6817, FNR 0,0749) vs perempuan 30,1% (n = 3.598); EDUCATION Pascasarjana 35,3% (n = 2.130, AIR 0,6032) vs SMA 20,9% (n = 1.014, AIR 0,3572, FPR 0,7463) vs Lainnya 58,5% (n = 82); MARRIAGE Lainnya 18,7% (n = 75, AIR 0,6403); AGE 60+ 19,7% (n = 76, AIR 0,5960, ECE 0,1208).
- Measurement: perempuan tampak lebih rendah risiko pada keempat fitur — menjelaskan SEBAGIAN kesenjangan sebagai risiko terukur, bukan membuktikan tidak ada bias.
- Representation: Lainnya EDUCATION 386 dari 24.000 train (1,6%), MARRIAGE Lainnya 302 (1,3%), 60+ 263 (1,1%).
- Label: base rate SMA 0,2574 vs Pascasarjana 0,1901 sejalan dengan approval — konsisten dengan risiko terukur DAN dengan bias label; data saja tidak bisa membedakan.
- Selection: PSI train vs test 0,0001–0,0008 dan PSI M2 (G9) 0,0104 — stabil; tapi PSI tidak bisa membuktikan representativitas.
- Aggregation: selisih SEX global +3,93 pp terkonsentrasi di bawah 30 tahun (+8,06 pp) dan hilang di 50–59 tahun (+0,07 pp).
- Workflow audit: definisikan grup → ukur (semua metrik + n) → selidiki sumber → putuskan ambang SEBELUM melihat angka → dokumentasikan.
- Noise vs sinyal: selisih SEX adalah sinyal (z = −3,30, p = 0,001). TPR Lainnya 0,6000 dari 5 nasabah default adalah noise (satu orang = 20 poin persen).
- Audit irisan [notebook]: AIR global SEX 0,8693 menyembunyikan Laki-laki × SMA 0,2655 (selisih −0,6038); sel n < 100 dilaporkan, tidak divonis; 18 sel → ~1 flag palsu diharapkan (multiple comparisons).
- Ketidakpastian bootstrap [notebook, 1.000 ulangan]: approval +3,93 pp CI [1,78; 6,22] (nyata); AIR 0,8693 CI [0,7978; 0,9391] (nyata); TPR/PPV/ECE mencakup 0 — «tidak signifikan ≠ tidak ada gap».
- Kualitas data [notebook, 30.000 baris]: nilai hilang 0; EDUCATION invalid 345 baris (1,15%), 73,72% grup Lainnya; MARRIAGE kode 0 54 baris (0,18%, di SMA); BILL_AMT negatif 1.930 (6,43%, plausibel); duplikat di luar ID 35 (0,12%).
- Lab: AIR Pascasarjana 0,6032; AIR EDUCATION 0,3572; Wilson Lainnya [0,4773; 0,6858] lebar 0,2085; gap Simpson terbesar di bawah 30 tahun 0,0806; AIR SEX bergerak 0,1205 antar threshold.
- Koreksi: n = 82 adalah n grup Lainnya (pembanding), BUKAN n Pascasarjana (n = 2.130) — flag-nya benar, atribusi n-nya dikoreksi mengikuti M7.1.

Guided task di Colab — notebook mlf-m72-guided-task.ipynb mereplikasi semua angka audit lesson ini dari data UCI. Tautan Colab: https://colab.research.google.com/drive/1R4e28RIBr-3PsN4gj_9o6-Yz7FO4vE1X

Lanjut: MLF-M7.3 — Explainability (SHAP/LIME).
