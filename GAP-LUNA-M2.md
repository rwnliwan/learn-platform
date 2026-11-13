# Gap Analysis Luna — Modul M2 "Supervised / credit scoring" (Learn v2)

**Tanggal:** 12 November 2026, ~15:20–15:35 WITA
**Analis:** Luna (`gpt-6-luna`) via Kelontong AI — 1 panggilan, streaming, tanpa fallback.
**Scope:** 5 lesson TS (`mlf-m21` s.d. `mlf-m25`) + 5 notebook guided-task + SPEC-MLF-M1.md (§M2).
**Laporan mentah model:** `/tmp/gap_m2_luna_raw.txt`

## Catatan verifikasi (oleh agen gap, independen dari model)

Setiap temuan di bawah ini **diverifikasi ulang ke file TS penuh dengan grep** sebelum masuk laporan ini, mengikuti aturan M1/L0 (temuan "TIPIS" wajib dicek ke TS; "HILANG" lebih dapat dipercaya). Hasilnya:

- **15 gap Luna, 0 yang dibuang.** Tidak satu pun temuan Luna yang mengulang 20 temuan review DeepSeek M2 (F1–F20) — dicek satu per satu. Dua kedekatan yang BUKAN duplikat: G7 vs F9 (F9 = istilah PDO yang salah; G7 = konstruksi scorecard standar yang belum diajarkan — beda); G10 vs tabel review (review memverifikasi angka selisih baku 0,028 sebagai benar; G10 = desain/rumus sampling yang belum diajarkan — beda).
- **4 label dikoreksi setelah verifikasi:** G3, G9, G11, G15 (lihat catatan per gap). G6 dan G10 dipertajam dari HILANG menjadi TIPIS-sebagian (definisi/angka sudah ada, metode/contoh kerja yang hilang).
- **Bagian "Cakupan kuis" terverifikasi:** daftar 6 soal per lesson cocok persis dengan TS (dicek dengan membaca kelima file). Daftar konsep belum teruji akurat (spot-check per lesson cocok).

**Jumlah gap: 15** — must-add 4 (G1, G2, G4, G5), should-add 6 (G3, G6, G7, G8, G10, G11), nice-to-have 5 (G9, G12, G13, G14, G15).

---

## MUST-ADD

### G1. Validasi temporal, out-of-time test, dan leakage prevention — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `out-of-time|out of time|temporal` di 5 TS M2 = **0 kemunculan**. Notebook M2.1 memakai stratified random split (`random_state=42`); M2.2 menyarankan "hitung IV pada data latih saja, lalu verifikasi pada data validasi" (tanpa menunjukkan split/out-of-time); M2.3 memakai `CalibratedClassifierCV(cv=3)` tanpa membedakan random CV vs validasi temporal; M2.4 mengajarkan dimensi waktu (vintage) tapi tidak menjembatani kembali ke cara melatih/mengevaluasi PD.

**Catatan verifikasi — sebagian TIPIS:** kata "leakage" SUDAH muncul (M2.1:68 sebagai alarm tanda koefisien salah arah; M2.2:69, 365, 412, 457 seputar band IV "curigai"), dan prinsip fit-pada-latih DIDEMONSTRASIKAN di Lab 1 M2.1 (standardisasi memakai mean/sd populasi data latih). Yang HILANG adalah: (a) validasi out-of-time sebagai metode, (b) aturan eksplisit "jangan hitung WoE/IV/mean/sd/threshold dari seluruh data sebelum split".

**Isi yang disarankan:** tambahkan di M2.1 setelah Langkah 11, atau sebagai jembatan M2.1→M2.2: split train (bulan historis awal) / validation (periode setelah train) / out-of-time test (periode paling akhir); jelaskan random stratified split dapat mencampur pola waktu dan memberi estimasi terlalu optimistis; contoh UCI — fitur observasi September (`PAY_0`) memprediksi default Oktober; jangan membuat fitur dari info Oktober/sesudahnya; jangan hitung WoE, IV, mean, sd, atau threshold dari seluruh dataset sebelum split. Figure SVG: diagram timeline `fitur observasi → cutoff → label masa depan` dengan area train/validation/OOT. Lab: bandingkan random split vs pseudo-temporal split (bulan observasi) dan jelaskan perubahan ROC-AUC/kalibrasi. Kuis: "Mengapa WoE yang dihitung dari seluruh data sebelum split merupakan leakage?"

### G2. Pemodelan LGD dan EAD sebagai model regresi belum benar-benar diajarkan — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `CCF|credit conversion|recovery rate|zero-inflation|censoring` di 5 TS M2 = **0 kemunculan**. M2.1 Langkah 3 menyatakan "LGD dan EAD adalah regresi" dan menyebut "regresi linear, tree regressor, atau model khusus recovery" tanpa target/data/evaluasi/latihan; M2.1 Langkah 9 (peta) hanya mengulang kalimat yang sama; M2.3 memakai LGD 45% sebagai asumsi [ilustrasi] dan EAD didekati `LIMIT_BAL` — tidak ada model LGD/EAD yang dilatih.

**Catatan verifikasi:** keterbatasan ini SEBAGIAN struktural — dataset UCI tidak punya recovery/cash collection untuk mengestimasi LGD historis, jadi model LGD tidak bisa dilatih di notebook. Gap ini tetap valid sebagai pengajaran KONSEP + metode (bukan sebagai lab data UCI).

**Isi yang disarankan:** tambahkan di M2.3 setelah Langkah 3. **LGD:** hanya teramati untuk akun yang default; target recovery rate atau LGD; masalah zero/one-inflation dan censoring; contoh: exposure Rp10 juta, recovery Rp5,5 juta → LGD 45%. **EAD:** bedakan limit, current balance, dan exposure saat default; untuk revolving credit gunakan credit conversion factor/CCF; contoh: limit Rp10 juta, saldo Rp6 juta, exposure saat default Rp8 juta → CCF atas undrawn portion = 50%. **Evaluasi regresi:** MAE/RMSE untuk EAD; weighted error berbasis exposure; calibration bucket untuk LGD/EAD. Tegaskan: pada UCI, LGD 45% dan `LIMIT_BAL` adalah **ilustrasi/proxy**, bukan estimasi produksi. Figure SVG: alur `approved → default → recovery → LGD` dan `limit → utilization → EAD`. Lab: hitung LGD recovery dan EAD/CCF dari tabel sintetis 10 akun. Kuis: pilih target yang tersedia untuk LGD, EAD, dan PD; hitung dampak kesalahan LGD/EAD terhadap EL.

### G3. Penanganan missing value, kategori tidak valid, dan outlier kredit — HILANG di M2, substansi umum sudah di L0 (prasyarat)

**Bukti ketidakhadiran (terverifikasi):** grep `missing|Missing|outlier|Outlier|winsor|imputasi` di 5 TS M2 = hanya 1 kemunculan, dan itu soal bobot outlier di M2.5:117 (bukan preprocessing data). M2.1 guided task langsung memuat UCI dan melatih; M2.2 Langkah 3 membahas `EDUCATION = 0` hanya sebagai masalah binning/WoE; tidak ada pembahasan sistematis missing value, unknown/unseen category, arti nilai `PAY_0` negatif, outlier limit/bill/payment, winsorization/capping hanya pada train, atau beda "missing" vs "zero".

**KOREKSI LABEL (verifikasi):** Luna menaruh ini di MUST-ADD. Substansi umumnya (missing, outlier, cleaning) SUDAH diajarkan di L0 — L0.1 Data Cleaning, L0.2 Missing Data & Imputasi, L0.3 Distribusi & Outlier — dan L0 adalah prasyarat M1/M2. Jadi ini BUKAN gap modul M2 secara umum. Yang tersisa dan benar-benar hilang di M2: (a) semantik nilai `PAY_0` negatif (apa arti −2/−1 di dataset UCI), (b) aturan preprocessing sebagai bagian dari versi scorecard (dokumentasi aturan imputasi/capping per versi). **Diturnkan ke SHOULD-ADD.**

**Isi yang disarankan:** tambahkan di M2.1 antara Langkah 3 dan 4 (ringkas, sebagai jembatan dari L0, bukan mengulang L0): tabel data dictionary UCI — `PAY_0` bukan angka kontinu biasa; nilai negatif harus dipahami sesuai definisi dataset; `EDUCATION = 0` adalah kategori unknown/other. Praktik: imputasi hanya memakai train; kategori unknown dipertahankan sebagai bin tersendiri atau digabung dengan aturan eksplisit; outlier limit/payment ditangani sebelum scaling/binning; bandingkan model dengan dan tanpa clipping. Figure SVG: contoh distribusi `LIMIT_BAL` dan `PAY_AMT1` dengan tail/outlier. Lab: buat data kecil yang memiliki missing value dan kategori baru pada test; pilih strategi yang aman. Mitigasi: dokumentasikan aturan preprocessing sebagai bagian dari scorecard version.

### G4. Fairness audit scorecard dan dampaknya pada keputusan belum diajarkan — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `fairness|Fairness|disparate|approval rate per|per grup` di 5 TS M2 = hanya 2 kemunculan: (1) M2.5:355 — penyebutan companion notebook ("di sana fairness audit menunjukkan pola yang sama"); (2) M2.5:373 — distractor kuis ("Itu fairness/bias kelompok — terkait, tapi bukan definisi selection bias di sini"). Tidak ada audit yang diajarkan di langkah, lab, figure, mini-case, atau kuis mana pun. `SEX`, `AGE`, `MARRIAGE` memang dihitung IV-nya di M2.2 Langkah 4 (0,0092 / 0,0213 / 0,0072), tetapi tidak dibahas sebagai potensi proxy atau sumber disparate impact. M2.1 Langkah 6 hanya menyebut "SHAP, partial dependence, reason codes".

**Catatan verifikasi:** fairness mendalam adalah M7, tetapi audit dasar per grup adalah USP notebook credit scoring (tercantum di spec M2) dan lesson sendiri merujuknya — jadi audit dasar di M2.2/M2.5 masih dalam scope M2, bukan duplikasi M7.

**Isi yang disarankan:** tambahkan di M2.2 setelah Langkah 6 atau M2.5 sebelum Langkah 9. Audit per grup: approval rate; bad rate approved; false-positive/false-negative rate; mean score/PD; calibration by group. Contoh UCI: bandingkan metrik `SEX = 1` dan `SEX = 2`; jangan menyimpulkan fairness hanya karena IV `SEX = 0,0092`. Jelaskan trade-off: menghapus `SEX` belum tentu menghapus bias jika ada proxy seperti `AGE`, `LIMIT_BAL`, atau payment behavior; perbedaan base rate dapat membuat parity metrik tidak simultan. Figure SVG: dua reliability diagram atau approval-rate chart per grup. Lab: hitung approval rate, bad rate, dan recall per grup pada threshold 0,10. Mitigasi: review fitur proxy, threshold/policy review, reason-code review, dan dokumentasikan justifikasi bisnis/regulator. Kuis: "Mengapa IV rendah untuk SEX tidak membuktikan model fair?"

### G5. Reason codes dan counterfactual belum benar-benar diajarkan — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `reason code|reason-code|counterfactual` di 5 TS M2 = hanya penyebutan: M2.1:175 ("SHAP, partial dependence, reason codes (ketiganya ada di notebook credit scoring)"), M2.1:436 (peta keputusan), M2.2:393 (companion notebook). `counterfactual` = **0 kemunculan** di seluruh TS M2. M2.2 Langkah 2 memberi contoh alasan scorecard secara naratif ("Anda kehilangan 41 poin karena telat 2 bulan...") tetapi tidak mengajarkan cara memilih alasan dominan atau membedakan alasan faktual dengan saran perbaikan; M2.2 Langkah 5 memberi poin per bin tetapi tidak mengubah kontribusi poin menjadi reason-code ranking; M2.5 Langkah 10 menyebut reject sampling tetapi tidak memberi counterfactual untuk pelamar yang ditolak.

**Catatan verifikasi:** reason codes + counterfactual adalah USP notebook credit scoring (spec M2) — ketiadaan metode pengajarannya di lesson adalah gap nyata, bukan sekadar penyebutan yang kurang.

**Isi yang disarankan:** tambahkan di M2.2 setelah Langkah 5. Reason code: tampilkan 2–4 kontribusi poin terendah; contoh pelamar B: `PAY_0 = 2` → −41 poin, limit ≤50 ribu → −10, age ≤25 → −5. Counterfactual: "Jika PAY_0 berubah dari 2 ke 0, skor naik 54 poin"; "Jika limit berubah ke 200–300 ribu, skor naik 18 poin"; bedakan perubahan yang realistis dan yang tidak dapat diubah. Figure SVG: waterfall chart kontribusi scorecard dari 500 ke skor akhir. Lab: buat reason-code top-3 dan satu counterfactual valid untuk A/B/C. Kuis: bedakan "fitur paling berpengaruh secara global" dari "alasan penolakan individu".

---

## SHOULD-ADD

### G6. Definisi default dan hubungan PD 1 bulan, 12 bulan, lifetime belum cukup operasional — TIPIS (definisi ada, contoh kerja tidak ada)

**Bukti ketidakhadiran (terverifikasi):** definisi horizon SUDAH ada — M2.1:54 ("PD 12 bulan dipakai Stage 1 IFRS 9, PD lifetime dipakai Stage 2"), M2.3:35 (PD 1 bulan × LGD/EAD 1 bulan), M2.4:192 (tiga stage + horizon), M2.4:195 (PD lifetime = peluang default selama sisa umur pinjaman; ilustrasi 0,85), M2.4:200 (formulaNote + catatan proksi). Yang TIDAK ada: contoh kerja bagaimana satu kohort menghasilkan PD 1 bulan, 12 bulan, dan lifetime yang berbeda — tidak ada tabel horizon, kurva survival/akumulasi default, atau perhitungan yang menunjukkan PD lifetime bukan sekadar perkalian PD 1 bulan.

**KOREKSI LABEL (verifikasi):** Luna menulis "belum cukup operasional" seolah definisi pun hilang. Definisi sudah lengkap; yang hilang hanya contoh kerja operasional. Tetap SHOULD-ADD dengan label yang diperbaiki.

**Isi yang disarankan:** tambahkan di M2.3 Langkah 2–3: tabel horizon — PD 1 bulan (default pada Oktober); PD 12 bulan (default dalam 12 bulan setelah observasi); PD lifetime (default sampai maturity). Mini-case kohort 1.000 akun dengan default bulan 1, 3, dan 8. Figure SVG: survival/default accumulation curve. Jelaskan bahwa PD lifetime bukan sekadar "mengalikan PD satu bulan". Kuis perhitungan sederhana dan pertanyaan konseptual tentang mismatch horizon.

### G7. Scorecard production practice: scaling, PDO, odds, dan mapping LR-to-scorecard belum konsisten secara metodologis — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `PDO|offset|base odds` di 5 TS M2 = hanya 2 kemunculan di M2.2: (1) :42 — kalimat kualifikasi hasil concept gate ("offset-nya sudah masuk ke skor dasar 500; ... bukan 20 × WoE mentah"); (2) :126 — "PDO implisit ≈ 13,9 poin per doubling odds". Tidak ada konstruksi scorecard dari koefisien LR, offset, base odds, dan PDO yang lazim di bank; tidak ada rumus standar `score = offset + factor × log(odds)`; tidak dijelaskan apakah odds berarti good/bad atau bad/good.

**Catatan verifikasi — BUKAN duplikat F9:** F9 (review DeepSeek) adalah kesalahan istilah "20 = points-to-double-odds" yang sudah diperbaiki menjadi "PDO implisit ≈ 13,9". G7 adalah hal lain: metode konstruksi scorecard standar yang belum diajarkan sama sekali.

**Isi yang disarankan:** tambahkan di M2.2 Langkah 5: rumus standar — score = offset + factor × log(odds); factor diturunkan dari PDO; jelaskan apakah odds berarti good/bad atau bad/good. Tunjukkan perbedaan: scorecard pedagogis `20 × WoE` vs scorecard yang benar-benar diturunkan dari koefisien LR. Figure SVG: hubungan odds, PD, dan score. Lab: ubah tiga PD menjadi skor dengan base score, base odds, dan PDO. Kuis: apa yang terjadi pada skor saat odds default naik dua kali lipat?

### G8. Confidence interval dan statistical uncertainty untuk band kecil belum diajarkan — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `confidence interval|Wilson|selang kepercayaan` di 5 TS M2 = **0 kemunculan**. M2.2 Langkah 6 menyebut band kecil "lebih berisik" tetapi tidak menghitung interval ketidakpastian; M2.4 Langkah 3 menyebut `n = 2` dan `n = 129` tidak stabil tetapi mitigasinya hanya peringatan; M2.4 Langkah 4 menetapkan ambang `n ≥ 100` tanpa menjelaskan bahwa ambang itu bukan pengganti interval statistik.

**Catatan verifikasi:** konsep CI sendiri sudah diajarkan di M1 (MLF2) — jadi yang hilang di sini BUKAN konsep CI, melainkan PENERAPANNYA pada estimasi band/vintage/roll-rate di M2.

**Isi yang disarankan:** tambahkan di M2.2 Langkah 6 dan jembatan ke M2.4: confidence interval binomial/Wilson untuk band skor, vintage, dan roll-rate. Contoh: default rate 1,0000 dari n=2 memiliki interval sangat lebar; default rate 0,6993 dari n=2.205 jauh lebih stabil. Figure SVG: bar default rate dengan error bars. Lab: hitung Wilson interval untuk band `<460` dan kohort `4+`. Kuis: pilih estimasi yang lebih dapat dipercaya berdasarkan rate dan n.

### G9. Monitoring scorecard dan population drift — HILANG di M2, tapi scope M7

**Bukti ketidakhadiran (terverifikasi):** grep `PSI` di 5 TS M2 = **0 kemunculan** (hit "PSI" pada grep kasar adalah false positive dari kata "Miskonsepsi"). Drift hanya disebut sekali: M2.4:360 ("selisihnya adalah drift yang harus diselidiki (pendalaman M7)"). M2.2 Langkah 4 menyebut verifikasi IV di validation; M2.3 Langkah 4 menyebut kalibrasi kedaluwarsa saat populasi berubah. Tidak ada PSI, perubahan base rate, drift bin, atau trigger recalibration yang diajarkan.

**KOREKSI LABEL (verifikasi):** Luna menaruh ini di SHOULD-ADD. Monitoring adalah modul M7 ("Fairness / explainability / monitoring") dan lesson M2.4 sendiri sudah mengarahkan ke sana. Yang layak di M2 hanyalah jembatan singkat (PSI sebagai indikator + contoh drift) — bukan pengajaran penuh. **Diturnkan ke NICE-TO-HAVE.**

**Isi yang disarankan (terbatas, di M2.4 Langkah 9):** monitoring yang masih spesifik credit scoring: base-rate drift; distribution/WoE drift per bin; PSI sebagai indikator; perubahan approval rate dan bad rate; calibration drift. Contoh: proporsi `PAY_0 = 2` naik dari 4,9% menjadi 8%; mean PD naik 0,2217 menjadi 0,29; kapan threshold dan scorecard perlu dikaji ulang. Figure SVG: distribusi train versus current population per bin. Lab: hitung PSI sederhana dari dua tabel proporsi. Kuis: bedakan performance drift, population drift, dan calibration drift.

### G10. Desain reject sampling dan estimasi ketidakpastian — TIPIS (angka ada, metode tidak ada)

**Bukti ketidakhadiran (terverifikasi):** M2.5 Langkah 10 (minicase, :340) mengusulkan menyetujui 5% dari 6.588 penolakan (329 nasabah) dan menyebut "selisih baku sekitar 0,028" — TETAPI tidak menunjukkan rumus standard error, stratified sampling, randomization, atau durasi observasi yang diperlukan. M2.5 Lab 2 hanya memakai contoh 12 akun dengan strata High/Low.

**KOREKSI LABEL (verifikasi):** angka SE 0,028 sudah ada di lesson (dan terverifikasi benar oleh review DeepSeek: √(0,4759·0,5241/329) = 0,0275). Yang hilang adalah METODE-nya: rumus SE, sampling per risk band, dan durasi observasi. Bukan HILANG penuh.

**Isi yang disarankan:** tambahkan di M2.5 Langkah 9–10: desain reject sampling — acak dalam score band/risk band; jangan hanya mengambil penolakan dengan skor tertinggi; dokumentasikan override dan policy. Rumus interval default-rate: standard error kira-kira `sqrt(p(1-p)/n)`; dengan p≈0,476 dan n=329, SE sekitar 0,0275. Figure SVG: sampling frame rejected population → random sample per band → observed outcome. Mini-case: band skor `<460`, `460–499`, `500+`; alokasikan sampel secara proporsional. Kuis: mengapa mengambil hanya rejected dengan skor terbaik tidak mengidentifikasi risiko seluruh rejected population?

### G11. Decision tree dan GBM: probabilitas daun, class imbalance, dan metrik threshold-independent vs threshold-dependent — TIPIS

**Bukti ketidakhadiran (terverifikasi):** grep `PR-AUC|precision-recall|balanced accuracy` di M2.1 = **0 kemunculan**. M2.1 Langkah 5 memberi default rate daun dan ROC-AUC; M2.1 Langkah 6 hanya membandingkan ROC-AUC. Tidak ada precision-recall curve, PR-AUC, balanced accuracy, atau pembahasan pengaruh base rate 0,2212 pada perbandingan model.

**KOREKSI LABEL (verifikasi):** precision/recall SUDAH diajarkan di M2.3 (confusion matrix threshold 0,10: precision 0,2828, recall 0,9141, F1 0,4319) dan PR-AUC SUDAH diajarkan di M1 (MLF3: PR-AUC 0,5597 vs base rate 0,2212). Yang hilang hanyalah: (a) perbandingan PR-curve antar model (LR/tree/GBM) di M2.1, (b) balanced accuracy, (c) pembahasan class imbalance dalam konteks perbandingan model M2.1.

**Isi yang disarankan:** tambahkan di M2.1 Langkah 5–6: bedakan ROC-AUC sebagai ranking, PR-AUC/precision-recall pada default minority class, dan metrik threshold-dependent. Contoh dari stump: daun kanan default rate 0,6955, tetapi 30% bukan default; keputusan optimal tetap bergantung biaya. Figure SVG: ROC curve versus precision-recall curve. Lab: hitung precision, recall, specificity, dan balanced accuracy pada threshold 0,10 dan 0,50. Kuis: kapan ROC-AUC dapat tampak baik sementara precision tetap rendah?

---

## NICE-TO-HAVE

### G12. Champion–challenger comparison antara scorecard dan GBM — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `champion|Champion` di 5 TS M2 = hanya 1 kemunculan — M2.5:132, dan itu sebagai sinonim reject sampling ("reject sampling / champion-challenger"), BUKAN sebagai perbandingan model. M2.1 Langkah 6 membandingkan LR dan GBM berdasarkan ROC-AUC saja; M2.2 Langkah 2 menyarankan scorecard sebagai lapisan keputusan dan GBM sebagai pembanding; belum ada mini-case yang membandingkan approval, EL, calibration, reason codes, dan fairness untuk keputusan yang sama.

**Isi yang disarankan:** tambahkan di M2.3 Langkah 9 atau M2.5 Langkah 9: tabel LR/scorecard versus GBM — ROC-AUC; calibration gap; approval rate; bad rate; EL; reason-code availability. Lab: pilih model yang digunakan bank berdasarkan biaya dan interpretability, bukan ROC-AUC saja. Figure SVG: radar/table comparison.

### G13. Pricing, limit assignment, dan risk-based treatment belum dibedakan dari approve/reject — HILANG

**Bukti ketidakhadiran (terverifikasi):** grep `pricing|risk-based|policy matrix` di 5 TS M2 = hanya 1 kemunculan — M2.4:208, kata "pricing" dalam daftar ("threshold, pricing, limit") tanpa pengajaran. M2.1 Langkah 10 hanya memakai limit Rp10 juta dan keputusan tolak/setuju; M2.3 Langkah 5 menyebut approval rate, bad rate, EL, dan profit; M2.4 Langkah 9 menyebut limit lebih kecil sebagai syarat secara singkat. Belum ada policy matrix antara approve/review/reject dan limit/terms.

**Isi yang disarankan:** tambahkan di M2.3 Langkah 5–6: policy matrix — PD < 0,05 → approve, limit penuh; 0,05–0,10 → approve, limit 50%; 0,10–0,20 → manual review; >0,20 → reject. Hitung EL dan profit per policy. Jelaskan bahwa threshold tidak selalu menghasilkan keputusan biner; bisa menjadi treatment policy. Figure SVG: PD band → decision → limit/treatment. Mini-case tiga pelamar dengan PD berbeda dan EAD berbeda.

### G14. Data UCI limitation dan generalisasi ke praktik bank perlu dirangkum eksplisit — HILANG

**Bukti ketidakhadiran (terverifikasi):** keterbatasan disebut tersebar di lesson (dicek dengan membaca kelima file): M2.3 Langkah 3 (EAD diproksikan `LIMIT_BAL`); M2.4 Langkah 3 (tidak ada origination date); M2.4 Langkah 5 (PD satu bulan dipakai sebagai proksi); M2.5 Langkah 1 (approval rule sintetis). Belum ada satu checklist "apa yang tidak boleh diklaim dari UCI".

**Isi yang disarankan:** tambahkan di M2.5 Langkah 12 atau halaman penutup M2. Checklist batasan: bukan data origination/vintage sejati; tidak memiliki recovery cash flow untuk LGD; tidak memiliki utilization-at-default untuk EAD; label hanya horizon satu bulan; approval rule reject inference adalah sintetis; hasil tidak otomatis mewakili bank, negara, produk, atau periode lain. Format: prose + figure "UCI evidence → production limitation" + kuis interpretasi.

### G15. Regulasi/praktik dokumentasi scorecard belum ditutup dengan artefak model — HILANG di M2, tapi scope M8

**Bukti ketidakhadiran (terverifikasi):** grep `model card|dokumentasi model|artefak model` di 5 TS M2 = **0 kemunculan**. M2.2 Langkah 5 menyebut "scorecard v1, data Sep 2005"; M2.3 Langkah 6 menyebut biaya harus disepakati bisnis; M2.5 Langkah 9 menyebut laporkan ketidakpastian. Belum ada contoh model card/scorecard card yang merangkum scope, populasi, horizon, exclusions, limitations, dan approval policy.

**KOREKSI LABEL (verifikasi):** Luna menaruh ini di NICE-TO-HAVE — sudah tepat. Catatan tambahan: dokumentasi model adalah modul M8 ("Model risk & deployment": validasi model SR 11-7, dokumentasi model, deployment & governance). Yang layak di M2 hanyalah template satu halaman sebagai penutup modul, bukan pengajaran dokumentasi penuh.

**Isi yang disarankan:** tambahkan di M2.5 Langkah 11–12. Artefak satu halaman: tujuan model; definisi default; population dan exclusions; feature list/binning; train/validation/OOT; ROC-AUC, calibration, PSI; threshold dan biaya; fairness audit; reject inference assumptions; reason-code policy; tanggal/version dan owner. Format: template markdown/prose + mini-case pengisian dari angka UCI.

---

# CAKUPAN KUIS

Konsep aplikasi yang **sudah diajarkan tetapi belum diuji secara memadai** oleh enam soal kuis pada masing-masing lesson. "Belum diuji" berarti konsepnya muncul di prose/lab/mini-case, tetapi enam soal yang ada tidak meminta penerapan atau diagnosisnya. Daftar soal per lesson di bawah ini **terverifikasi cocok persis dengan TS**.

## M2.1 — Logistic Regression, Tree, dan GBM

**Enam soal yang ada (terverifikasi):** (1) Output logistic regression sebelum threshold. (2) Mengubah koefisien `PAY_DELAY_COUNT = 0,756` menjadi OR 2,13. (3) Default rate daun kanan stump = 0,6955. (4) Alasan bank tetap memakai LR meski GBM lebih tinggi ROC-AUC. (5) PD versus LGD sebagai klasifikasi/regresi. (6) Perhitungan EL dari PD, LGD, dan EAD.

**Konsep aplikasi yang belum diuji:**
- Interpretasi sigmoid: `z = 0`, `z = 2`, `z = -2`; area sigmoid yang curam versus datar.
- Pengaruh standardisasi terhadap perbandingan koefisien.
- Deteksi separation pada Lab 1: mengapa OR income `0,0405` dan late `77,8599` tidak dapat dipercaya sebagai estimasi produksi.
- Decision tree: mengapa daun kanan dengan default rate `0,6955` bukan vonis 100%; perbedaan feature importance dan causal effect.
- Overfitting: interpretasi gap GBM train/test `0,8469 − 0,7823 = 0,0646`.
- Keterbatasan akurasi pada test set kecil `n=3`.
- Pertanyaan threshold: bagaimana keputusan pelamar berubah antara threshold `0,50` dan `0,10`.
- ROC-AUC sebagai ranking, bukan kalibrasi.
- Lab decision stump: dua split sempurna pada 12 nasabah tetapi stump UCI hanya ROC-AUC `0,6443`.
- Feature engineering: arti bisnis `PAY_DELAY_COUNT`, `PAY_MAX`, dan `UTILIZATION`.

**Kuis yang disarankan untuk menutup gap:**
- "Mengapa OR late 77,8599 dari 12 nasabah tidak boleh dibandingkan langsung dengan OR 2,13 dari 30.000 nasabah?"
- "GBM memiliki gap train-test 0,0646. Diagnosis paling tepat apa?"
- "Jika PD P1 = 0,1741, apa keputusan pada threshold 0,50 versus 0,10?"
- "Mengapa accuracy 1,0000 pada tiga pelamar bukan bukti model produksi?"

## M2.2 — Scorecard, WoE, dan IV

**Enam soal yang ada (terverifikasi):** (1) Arti WoE positif. (2) Tindakan untuk IV PAY_0 `0,8761`. (3) Poin PAY_0 = 2. (4) Skor pelamar A = 524. (5) Penanganan EDUCATION = 0 dengan default nol. (6) Interpretasi IV SEX = `0,0092`.

**Konsep aplikasi yang belum diuji:**
- Menghitung WoE dari counts, bukan hanya membaca tandanya.
- Menghitung kontribusi IV per bin.
- Menentukan bin kecil dari `n`, termasuk bin `4+` PAY_0 dengan `n=141`.
- Trade-off monotonisasi: PAY_0 `3` memiliki −48 poin, sedangkan `4+` −36 poin.
- Korelasi tinggi PAY_0 dan PAY_DELAY_COUNT dan risiko double-counting.
- Perbedaan IV tinggi karena sinyal sah versus leakage.
- Validasi monotonitas pada validation/OOT, bukan hanya data train.
- Mengubah poin tiga fitur menjadi alasan penolakan.
- Memahami bahwa `20 × WoE` adalah konvensi pedagogis, bukan formula universal scorecard.
- Interpretasi korelasi skor-default `−0,4204` versus ROC-AUC LR `0,7426`.
- Dampak menambahkan fitur keempat pada band skor.

**Kuis yang disarankan:**
- "Bin PAY_0 = 2 memiliki kontribusi IV 0,5012. Apa proporsinya terhadap IV total 0,8761?"
- "Mengapa PAY_0 dan PAY_DELAY_COUNT tidak otomatis dimasukkan keduanya meski IV masing-masing >0,8?"
- "Apa risiko memaksa poin bin 4+ agar monoton terhadap bin 3?"
- "Pelamar B kehilangan −41, −10, dan −5 poin. Buat tiga reason codes-nya."
- "Mengapa band skor yang monoton di train tetapi tidak monoton di validation adalah red flag?"

## M2.3 — PD, LGD, EAD, Kalibrasi, dan Threshold

**Enam soal yang ada (terverifikasi):** (1) Perhitungan EL `Rp18.000.000`. (2) Arti perubahan Brier `0,1342 → 0,1345`. (3) Recall dari TP `1.213` dan FN `114`. (4) Dampak threshold `0,10 → 0,20` terhadap profit. (5) Interpretasi desil 10: PD `0,6967` versus aktual `0,7000`. (6) Dampak stress Severe `+194,2%`.

**Konsep aplikasi yang belum diuji:**
- Perbedaan ranking dan calibration secara numerik.
- Mean PD `0,2217` versus default rate aktual `0,2212`.
- Interpretasi precision `0,2828`, F1 `0,4319`, dan akurasi `0,4682` secara bersama-sama.
- Membaca seluruh confusion matrix: TP, FP, TN, FN; biaya FN versus FP.
- Perhitungan EL portofolio sebagai jumlah EL individual dengan EAD yang berbeda.
- Mengapa A dan B memiliki EL sama meski PD berbeda.
- Asumsi LGD 45% dan EAD=`LIMIT_BAL` sebagai proxy.
- Menentukan threshold dari biaya, bukan dari `0,5`.
- Approval rate versus bad rate versus expected loss versus realized profit.
- Perbedaan EL ekonomi dan ECL akuntansi yang akan dipakai M2.4.
- Keterbatasan Brier sebagai satu angka gabungan.
- Dampak recalibration terhadap policy threshold.

**Kuis yang disarankan:**
- "Dari TP=1.213, FP=3.077, TN=1.596, FN=114, berapa precision dan specificity?"
- "Mengapa accuracy 0,4682 dapat tetap konsisten dengan kebijakan yang menguntungkan?"
- "Jika LGD naik dari 45% menjadi 60%, komponen mana dari policy table yang pasti berubah?"
- "Mengapa mean PD yang dekat dengan base rate belum membuktikan kalibrasi tiap desil?"
- "Apa yang terjadi pada EL jika EAD B naik dari Rp50 juta menjadi Rp100 juta?"

## M2.4 — Vintage, Roll-Rate, dan IFRS 9

**Enam soal yang ada (terverifikasi):** (1) Default rate kohort current = `0,1867`. (2) Persistensi bucket 2 = `0,5805`. (3) Alasan baris bucket 1 tidak boleh dibaca. (4) ECL Stage 2 per nasabah = `NT$34.035`. (5) Alasan Stage 3 memakai PD = 1. (6) Total ECL = `NT$457.366.208`.

**Konsep aplikasi yang belum diuji:**
- Caveat vintage UCI tidak memiliki tanggal origination.
- Perbedaan kohort current `n=26.921` versus kohort 4+ `n=129`.
- Membaca sel roll-rate lain: bucket 2 ke current `0,2534`; bucket 2 ke bucket 3 `0,0633`; bucket 3 ke 4+ `0,2572`.
- Menjumlahkan roll-rate menuju kondisi memburuk, misalnya `2 → 3 atau 4+`.
- Menafsirkan roll-rate Agustus: current `0,0388`; bucket 2 `0,4744`.
- Menghubungkan roll-rate ke intervensi collection.
- Definisi stage: Stage 1: PAY_0 ≤ 1; Stage 2: PAY_0 = 2 atau 3; Stage 3: PAY_0 ≥ 4.
- Perbedaan PD 12 bulan versus PD lifetime.
- Dampak mengubah threshold Stage 2 dari `PAY_0 ≥ 2` menjadi `PAY_0 ≥ 1`.
- Perbedaan ECL dan EL dalam horizon/populasi yang sama.
- Ketidakpastian rate untuk baris kecil.

**Kuis yang disarankan:**
- "Mengapa kohort 4+ dengan default rate 0,7132 belum tentu lebih kuat buktinya daripada current 0,1867?"
- "Berapa peluang bucket 2 memburuk ke bucket 3 atau 4+?"
- "Mengapa roll-rate 1,0000 dari bucket 1 tidak dapat dipakai untuk menetapkan kebijakan?"
- "Apa perubahan konseptual saat Stage 2 memakai PD lifetime, bukan PD satu bulan?"
- "Mengapa total ECL dan EL tidak boleh dibandingkan tanpa menyamakan populasi dan horizon?"

## M2.5 — Reject Inference

**Enam soal yang ada (terverifikasi):** (1) Definisi selection bias. (2) Gap model-A pada rejected = `0,2422`. (3) ROC-AUC model-A versus oracle. (4) Arti perbaikan reweighting menjadi `0,2804`. (5) Mengapa fuzzy augmentation tidak memperbaiki bias. (6) Metode paling dapat dipercaya: random reject sampling.

**Konsep aplikasi yang belum diuji:**
- Perhitungan approval rate `0,7804` dan jumlah rejected `6.588`.
- Perbedaan default rate approved `0,1495`, rejected `0,4759`, dan semua `0,2212`.
- Mengubah gap semua `0,0532` menjadi sekitar `1.596` default yang terlewat.
- Perbedaan ranking versus calibration pada rejected.
- Makna oracle `0,3938` yang masih di bawah aktual `0,4759`.
- Bobot Horvitz–Thompson: `P(approve|Low)=0,3333`; bobot `3,0`; naive `0,2500` versus reweighted `0,3333`.
- Risiko propensity score sangat kecil dan bobot ekstrem.
- Mengapa clipping bobot diperlukan.
- Mengapa reweighting hanya menangani selection yang teramati.
- Desain random reject sampling yang representatif per band.
- Standard error dan durasi observasi outcome.
- Perbedaan extrapolation sebagai diagnosis versus metode koreksi.

**Kuis yang disarankan:**
- "Dengan 6.588 rejected dan default rate aktual 0,4759, berapa kira-kira default aktualnya?"
- "Mengapa model-A dapat memiliki ROC-AUC hampir sama dengan oracle tetapi mean PD jauh lebih rendah?"
- "Jika `P(approve)=0,05`, berapa bobot inverse-probability dan apa risikonya?"
- "Mengapa random sampling rejected harus dilakukan per risk band, bukan hanya mengambil rejected dengan skor tertinggi?"
- "Apa arti oracle yang masih underpredict: masalah data, masalah seleksi, atau keterbatasan model linear?"
