# Review DeepSeek M6 — Tuning & model selection (terverifikasi Chief)

**Sumber:** `review_deepseek_m6m6{1..5}.txt` (5 file, model deepseek-v4.1-flash, selesai 09:35 WITA 13 Nov 2026).
**Verifikasi Chief:** SETIAP temuan dihitung ulang dari `qa-learn/m6_canonical.json` + grep kutipan di file TS lesson. **40/40 BENAR, 0 noise.**
**Vonis per lesson:** M6.1 APPROVE-WITH-FIXES · M6.2 APPROVE-WITH-FIXES · M6.3 APPROVE-WITH-FIXES · **M6.4 REVISE** · M6.5 APPROVE-WITH-FIXES.
**Total: 5 must / 14 should / 21 nit = 40 temuan.**

Angka kunci yang dihitung ulang DeepSeek semuanya cocok (grid 18 konfigurasi, CV 0,7865/0,7840, nested 0,7858, McNemar χ² 13,1601 p≈0,0003, gap 0,0646, threshold 0,10). Yang salah adalah label/provenance, perbandingan lintas-protokol, superlatif, dan dua penjelasan kausal — bukan angka kanonisnya.

## M6.1 Hyperparameter tuning — APPROVE-WITH-FIXES (5S + 5N = 10)

| # | Temuan (terverifikasi Chief) | Perbaikan |
|---|---|---|
| S1 | Klaim distribusi random search berlabel `[notebook]` tidak tertelusur: "log-uniform 0,03–0,20" — kanonik hanya punya `m61_random_best` (lr 0,0425), top3, n_configs 27, n_fits 81, seed 42; tidak ada field distribusi | Relabel `[ilustrasi]` ATAU tambah field kanonik `random_lr_dist` dulu |
| S2 | "seed 43" untuk shrinking tidak ada di kanonik; `m61_shrinking_random_search` tanpa field seed; `meta.seed` = 42 | Hapus "(seed 43)" atau tambah ke kanonik bila memang 43 |
| S3 | Perbandingan 0,7840 (5-fold, M6.2) vs 0,7865 (3-fold, 54 fit) disajikan tanpa caveat di 4 tempat (langkah 1, 8, checkpoint, kuis Q6); caveat hanya di langkah 6 | Pindah caveat ke langkah 1 + ringkas di checkpoint/Q6: "bandingkan sebagai orde besaran, bukan selisih eksak" |
| S4 | "max_depth tanpa batas mengisi 6 terbawah" SALAH peringkat: keenam konfig null = peringkat **12–17** (0,7837–0,7845); peringkat 18 = (50, 3, 0,05) 0,7827 | "keenam konfig max_depth tanpa batas menempati peringkat 12–17 dari 18 — tidak satu pun masuk 11 besar"; samakan kuis Q1 |
| S5 | "SAMA PERSIS" tidak berlaku untuk PR-AUC: tertala 0,5598 vs default 0,5597 (+0,0001); ROC-AUC + Brier memang identik | "ROC-AUC dan Brier sama persis (0,7823; 0,1342); PR-AUC naik 0,0001 (0,5597 → 0,5598)" |
| N1 | "CV terbaik" ambigu: grid 0,7865 vs shrinking 0,7869 | "CV **grid** terbaik" (atau sebut konfigurasi (100, 5, 0,05)) |
| N2 | "hampir 0,02" sebenarnya 0,0223 (0,7665 − 0,7442) | "sekitar 0,022 di bawah fold terbaik" |
| N3 | "batangnya tampak hampir sama tinggi" salah geometri: batang C=0,01 = **119,7 px**, C=1 = **142,6 px** (selisih 22,9 px ≈ 19%, terverifikasi dari rect heights di file) | "perbedaannya terlihat (≈23 px pada skala ini) tetapi tetap di bawah noise antar-fold 0,0083" |
| N4 | "Grid search adalah cara paling jujur dan paling mahal" — "paling mahal" hanya benar pada budget sama (random 81 fits > grid 54 fits); "paling jujur" menyamakan reproducibility dengan kejujuran | "paling mudah diaudit (lengkap dan deterministik)" + "mahal bila dimensinya banyak" |
| N5 | sd antar-fold 0,0083 = ddof=0 (ddof=1 → 0,00926); siswa pakai `pandas.std()` default akan dapat 0,0093 | Tambah "(sd populasi atas 5 fold)" sekali di langkah 5 |

## M6.2 Cross-validation & nested CV — APPROVE-WITH-FIXES (2M + 3S + 2N = 7)

| # | Temuan (terverifikasi Chief) | Perbaikan |
|---|---|---|
| M1 | "Lima fold, empat konfigurasi berbeda" SALAH: `best_params_per_fold` = 5 konfigurasi semua unik (50/5/0.1; 200/3/0.05; 100/5/0.05; 100/3/0.1; 50/5/0.05) — kontradiksi internal dengan ringkasan lesson sendiri | "lima konfigurasi berbeda" |
| M2 | Kondisi "bias leakage membesar bila selisih antar-konfigurasi BESAR" **salah arah + muncul di kuis Q7 sebagai jawaban benar**. Winner's curse justru berbahaya saat kandidat hampir setara + noise test besar. Kanonik: rentang CV sempit 0,7827–0,7865 (lebar 0,0038); `leakage_bias_formula = 0.0` | Ganti kondisi ketiga jadi "selisih antar-konfigurasi kecil / semua kandidat setara" atau "noise test besar dibanding selisih sinyal". Perbaiki opsi kuis Q7. Lunakkan juga klaim "data besar membuat noise kecil dibanding selisih antar-konfigurasi" (selisih hanya 0,0038) |
| S1 | "nested CV berharga 55× lipat" aritmetik benar (275/5) tapi pembanding menyesatkan: vs grid search CV3 54 fit = **≈5,09×**; vs grid CV5 90 fit = **≈3,06×** | Tulis eksplisit pembandingnya ("55× dibanding satu CV 5-fold satu konfigurasi" ATAU "≈5× dibanding grid search CV3") |
| S2 | 480 simple returns vs 460 observasi belum dijelaskan: `n_simple_returns_bbca` = 480, `n` = 460; base rate 0,4196 × 460 ≈ 193 (bulat) vs × 480 ≈ 201,4 | Sebut "480 simple return → 460 observasi setelah warm-up 20 baris untuk vol20/ma20"; base rate dihitung pada 460 |
| S3 | Angka "8 konfigurasi / 125 kali latih / toleransi 0,005" tidak tertelusur ke kanonik (hanya 18 konfigurasi, 54 fit, 275 fit); 5×(8×3+1)=125 aritmetik benar tapi bukan angka kanonis | Tambah field kanonik untuk subset notebook ATAU labeli "implementation detail notebook, bukan angka kanonis" |
| N1 | "sekitar sepertiga sd" meleset: 0,0018/0,0068 = **0,2647** ≈ seperempat | "sekitar seperempat sd" atau "≈0,26 sd" |
| N2 | sd proporsi 0,0054 memakai pendekatan binomial; dengan finite-population correction ≈ **0,0048** | Sebut 0,0054 sebagai aproksimasi binomial ATAU pakai 0,0048 (sudah berlabel [ilustrasi], bukan must) |

## M6.3 Regularization & early stopping — APPROVE-WITH-FIXES (2S + 5N = 7)

| # | Temuan (terverifikasi Chief) | Perbaikan |
|---|---|---|
| S1 | Penjelasan kausal selisih 0,0026 (ES 0,7823 vs tanpa-ES 0,7797) tidak logis: memilih puncak dari TEST hanya bisa MENGINFLASI angka tanpa-ES, bukan menurunkannya — bertentangan dengan langkah 6. Selisih juga di bawah noise antar-fold 0,0059 | Ganti dengan: "Selisih 0,0026 ini tidak kami klaim sebagai keunggulan mekanisme early stopping: kedua kurva berasal dari fit terpisah dan selisihnya di bawah SD antar-fold 0,0059. Pemilihan puncak dari TEST membuat angka tanpa-ES cenderung OPTIMISTIS, jadi kerugian sebenarnya di 400 pohon bisa lebih besar dari 0,0159." |
| S2 | Klaim "grid M6.1 memakai default (aktif), sehingga max_iter 100 dan 200 juga berhenti sendiri" tidak tercatat di kanonik (`m61_gbm_grid_all` tanpa field early_stopping). Pasangan identik (0,7862 vs 0,7862; 0,7851 vs 0,7851) konsisten tapi bukan bukti; pasangan (100,5,0.05)=0,7865 vs (200,5,0.05)=0,7864 malah tidak persis sama | Lunakkan jadi "[inferensi]" ATAU hapus klaim definitifnya |
| N1 | "23 asli + 8 hasil feature engineering" tidak tertelusur: kanonik hanya `n_features = 31` | Labeli "[notebook, rincian fitur]" ATAU cukup "31 fitur" |
| N2 | "Model yang menebak base rate punya train dan test yang sama-sama buruk" — tanpa metrik: penebak "selalu tidak default" justru berakurasi ±0,7788 | "ROC-AUC 0,5 dan PR-AUC ≈ 0,2212 (tanpa daya pisah), meski akurasi ±0,78" |
| N3 | Sumbu-x gambar langkah 7–8 memakai titik berjarak seragam untuk 10/25/50/100/200/400 tanpa keterangan skala; "skala log" hanya ada di gambar langkah 3 (2 kemunculan, keduanya di sana) | Tambah "skala log" pada label sumbu-x kedua gambar |
| N4 | "Keduanya sudah dekat dengan batas sinyal yang tersedia" tanpa angka pendukung | Lampirkan pembanding (mis. 0,7823 vs nested 0,7858) ATAU tandai sebagai penilaian penulis |
| N5 | "Di sklearn, C = 1/λ" perlu catatan faktor ½ (objektif: ½‖w‖² + C·Σloss) | Tambah "(hingga faktor ½ pada suku L2)" |

## M6.4 Calibration & threshold — REVISE (2M + 2S + 4N = 8)

| # | Temuan (terverifikasi Chief) | Perbaikan |
|---|---|---|
| M1 | "penyimpangan TERBESAR" salah: bin [0,5–0,6) gap **0,0481**, bin [0,8–0,9) gap **0,0485** (lebih besar) — dan kalimat berikutnya di paragraf yang sama menulis "0,0485 — besar" | "penyimpangan terbesar KEDUA (setelah bin [0,8–0,9) sebesar 0,0485)" ATAU "penyimpangan terbesar di antara bin ber-n ≥ 100" |
| M2 | Model keputusan dilabeli "GBM terkalibrasi (Platt/sigmoid)" padahal lesson menyimpulkan pakai **GBM MENTAH** dan angka Brier yang dikutip (0,1342) adalah milik mentah; Platt = 0,1345 (ECE 0,0087 vs 0,0073). Label "GBM terkalibrasi" muncul **10×** di file (prose, judul figure, caption, komentar lab2) — kontradiksi langsung dengan `m64_calibration_best_by_brier = "gbm_raw"` | Ganti semua → "GBM mentah (varian dengan Brier/ECE terbaik)". Bila notebook memang menjalankan tabel threshold di atas probabilitas Platt, sebut eksplisit + ganti Brier 0,1342 → 0,1345 di prose itu. Pilih satu, jangan campur |
| S1 | Cerita pembuka "dari 100 nasabah lain yang juga mendapat skor sekitar 0,8, hanya 52 yang benar-benar default" tanpa label [ilustrasi] DAN bertentangan dengan kanonis: bin [0,7–0,8) aktual 0,7481, bin [0,8–0,9) aktual 0,8788 — model ini justru dekat diagonal di skor tinggi | Tambah tag **[ilustrasi]** + klausa: "angka ini ilustrasi model yang mis-kalibrasi; GBM di lesson ini justru terkalibrasi baik di bin skor tinggi (0,7481 vs 0,7441) — lihat langkah 5" |
| S2 | Alasan "terlalu berisiko" memakai basis keliru (base rate): kelompok tambahan 3.573 nasabah, default 729 → bad rate marginal **729/3.573 = 20,40%**, hanya ~1,7pp di bawah base rate 22,12%. Yang benar: 20,40% jauh di atas ambang impas p\* = 10% | "bad rate kelompok tambahan 729/3.573 = **20,4%** — dua kali lipat ambang impas 10% — jadi terlalu berisiko untuk margin 5%" |
| N1 | "7 bin lainnya menyumbang 0,0040 sisanya" — rekonstruksi dari mean 4-desimal ≈ 0,0039 (ECE penuh 0,00724 vs kanonik 0,0073, selisih pembulatan) | "≈0,0039–0,0040 (selisih pembulatan)" |
| N2 | "Urutannya tetap" vs ROC-AUC berubah 0,7823 → **0,7816**: peta monoton murni tidak mengubah ROC-AUC; perubahan 0,0007 karena `CalibratedClassifierCV(cv=3)` merata-ratakan 3 model kalibrasi | Tambah "perubahan 0,0007 berasal dari rata-rata 3 fold kalibrasi, bukan dari pergeseran ranking" |
| N3 | Parameter `cv=3` untuk `CalibratedClassifierCV` tidak tertelusur: `m64_calibration` hanya berisi 5 varian, tanpa field `calibration_cv` | Tambah field ke kanonik (`m64_calibration.cv = 3`) ATAU turunkan tag `[notebook]` |
| N4 | "LGD 20% **atau** margin 15%" tetapi perhitungan mengubah keduanya: (0,15/(0,15+0,20) = 0,43) | "atau" → "**dan**" |

## M6.5 AutoML & selection bias — APPROVE-WITH-FIXES (1M + 2S + 5N = 8)

| # | Temuan (terverifikasi Chief) | Perbaikan |
|---|---|---|
| M1 | Atribusi "optimisme terkecil 0,0014 (tiga konfigurasi max_depth tanpa batas, lr 0,10)" salah: minimum 0,0014 dimiliki **DUA** konfigurasi (it100 & it200); it50 = **0,0015** | "Optimisme terkecil 0,0014 — dua konfigurasi max_depth tanpa batas dengan learning_rate 0,10 (max_iter 100 dan 200; yang max_iter 50 memberi 0,0015)" |
| S1 | 0,0042 dilabeli "besar winner's curse" padahal identik dengan rata-rata optimisme semua kandidat: Σ = 0,0756; 0,0756/18 = **0,0042** = optimisme pemenang. Jika seleksi menambah bias, optimisme pemenang harus melebihi rata-rata — selisihnya 0,0000. Maka 0,0042 = gap protokol CV-vs-holdout, bukan besaran curse seleksi. Kontradiksi internal dengan kalimat lesson sendiri ("rata-rata optimisme juga 0,0042") | Pertahankan deskriptif "skor CV pemenang 0,7865 melebih-lebihkan skor test-nya 0,7823 sebesar 0,0042", ganti atribusi jadi "0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua 18 kandidat; karena itu ia bukan estimasi eksklusif winner's curse"; tunjuk bukti curse pada ketidakstabilan peringkat (K15 peringkat-15 CV menyamai test tertinggi; seri 4 arah) |
| S2 | Klaim "tanpa scipy, p-value dari χ² tidak bisa dihitung dengan rumus sederhana" tidak benar untuk df=1: p = `erfc(√(χ²/2))` = erfc(2,56516) ≈ **0,000287 → 0,0003**, tersedia di `math` stdlib | "Lab ini sengaja tidak menghitung p-value agar fokus pada perbandingan χ² dengan nilai kritis 3,8415; untuk df=1 p-value sebenarnya punya bentuk tertutup (erfc) ≈ 0,0003" |
| N1 | "terbaik 0,7866" ambigu: kanonik juga memuat shrinking best 0,7869 | "terbaik di antara 27 konfigurasi random search" |
| N2 | Caption "skor CV 3-fold di train" menyesatkan: CV dihitung pada lipatan held-out di dalam train | "skor CV 3-fold (evaluasi pada lipatan held-out di dalam train)" |
| N3 | "menyamai skor test tertinggi 0,7823 — sama dengan sang juara CV" ambigu: yang dimaksud skor **test** K15 = skor test juara CV | "…sama dengan skor test sang juara CV (0,7823), meski skor CV-nya 0,7838" |
| N4 | "satu-satunya estimasi di lesson ini yang tidak tercemar seleksi" kontradiktif: lesson sendiri menyatakan GBM default 5-fold CV "sudah tak-bias karena tidak ada seleksi" | "satu-satunya estimasi untuk model yang DI-TUNING yang tidak tercemar seleksi" |
| N5 | sd 0,0068 = ddof=0 (ddof=1 → 0,00760); `statistics.stdev` memberi 0,0076 | Tambah "(sd populasi, ddof=0)" bila ingin reproducible |

## Catatan Chief

- **Tidak ada temuan noise.** Semua 40 terverifikasi ke kanonis/data/file TS. Pola kesalahan yang berulang dari M4/M5: superlatif tanpa kualifikasi (M6.1 N4, M6.4 M1), perbandingan lintas-protokol tanpa caveat (M6.1 S3), label `[notebook]` untuk angka yang tidak ada di kanonik (M6.1 S1/S2, M6.2 S3, M6.4 N3), dan atribusi kausal yang tidak didukung angka (M6.3 S1, M6.5 S1).
- **Dua temuan bersifat konseptual, bukan sekadar kata-kata** — M6.2 M2 (arah pemicu leakage terbalik + masuk kuis sebagai jawaban benar) dan M6.5 S1 (atribusi winner's curse salah; angka 0,0042 benar tapi maknanya bukan curse). Keduanya wajib masuk concept gate sebagai kelas baru di ronde fix.
- **M6.4 REVISE** karena M2 (10× label model yang salah + kontradiksi internal dengan kesimpulan lesson sendiri) — bukan karena angka salah hitung.
- Untuk ronde fix: perbaiki TS + `.md` (notebook TIDAK diubah, sesuai pola M5 — kecuali bila ada angka notebook yang dikutip salah; tidak ada di ronde ini). QA update di ronde yang sama: fixture must-not baru + concept gate kelas baru (leakage: pemicu = kandidat setara + noise besar, bukan selisih besar; winner's curse: optimisme pemenang vs rata-rata; superlatif "TERBESAR" wajib kualifikasi n; label model kalibrasi vs mentah harus konsisten dengan Brier yang dikutip).

---
*Disusun Chief (induk), 13 Nov 2026 ~10:20 WITA. Semua angka di atas dihitung ulang dari `qa-learn/m6_canonical.json` + grep file TS; bukan ringkasan laporan reviewer semata.*
