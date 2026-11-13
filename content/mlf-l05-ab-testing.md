# L0.5: A/B Testing — dari Hipotesis ke Keputusan

## Masalah: Approval Naik 12 Persen ke 14,5 Persen — Nyata atau Kebetulan?

Tim kredit meluncurkan skor baru. Setelah 1.000 penawaran di kelompok lama (A) dan 1.000 di kelompok baru (B), approval rate naik dari 12,0 persen menjadi 14,5 persen — selisih 2,5 poin. Lalu seseorang bertanya: "Dengan 1.000 penawaran per kelompok, seberapa yakin kita bahwa selisih 2,5 poin ini bukan kebetulan?"

---

## 1. Hipotesis dan p-value

A/B testing dimulai sebelum data dikumpulkan: H0 (tidak ada beda) dan H1 (ada beda). P-value menjawab: bila H0 benar, seberapa aneh data yang saya lihat?

**Nilai:** A: 120 dari 1.000 (12,0 persen); B: 145 dari 1.000 (14,5 persen); selisih 0,0250 (2,5 poin) [lab]. Proporsi gabungan (pooled) 0,1325; standard error 0,015162; z sama dengan 1,6489; p-value dua sisi 0,0992. Dengan alpha 0,05 yang didaftarkan sebelum eksperimen: 0,0992 lebih besar dari 0,05 — gagal tolak H0. Hasilnya tidak signifikan.

**Gambar:** kurva H0 — z hitung 1,65 jatuh SEBELUM batas kritis 1,96 (daerah "gagal tolak"). Area di luar ±1,65 adalah p-value 0,0992.

**Baik/buruk:** p-value baik bila dibaca sebagai apa adanya — peluang data se-ekstrem ini bila H0 benar. P-value buruk bila dibaca sebagai "peluang H0 benar" atau "peluang efeknya nyata" — keduanya bukan artinya.

**Mitigasi:** daftarkan alpha SEBELUM melihat data. Jangan ubah alpha sesudah melihat p-value. Jangan menulis "p = 0,0992 berarti tidak ada efek" — yang benar adalah "tidak cukup bukti untuk menyatakan ada efek".

Satu hal yang membuat p-value di atas bermakna: randomisasi. Eksperimen ini mengacak 2.000 penawaran ke A (1.000) dan B (1.000) — tiap penawaran punya peluang 50 persen masuk A atau B. Unit eksperimennya adalah satu penawaran — bukan satu nasabah (bila satu nasabah mengajukan berkali-kali, penawarannya berkorelasi dan unit yang benar adalah nasabah, bukan penawaran). Sebelum membaca hasil, jalankan checklist pra-analisis: (1) randomisasi benar — penugasan memang acak, bukan berdasarkan urutan datang atau cabang; (2) keseimbangan kovariat — A dan B mirip dalam income, keterlambatan, dan wilayah; (3) tidak ada kebocoran antar-kelompok — satu nasabah tidak boleh muncul di A dan B sekaligus; (4) cek SRM (sample ratio mismatch) — perbandingan jumlah yang masuk A vs B harus sesuai rasio yang dirancang (di sini 1.000 vs 1.000). Bila salah satu gagal, p-value sesudahnya tidak bisa dipercaya — desain yang rusak tidak bisa diperbaiki oleh statistik.

$$z = \frac{\hat{p}_B - \hat{p}_A}{\sqrt{\bar{p}(1-\bar{p})\left(\frac{1}{n_A} + \frac{1}{n_B}\right)}}$$

---

## 2. Signifikansi dan Interval Kepercayaan

Signifikansi menjawab "apakah efeknya nyata?" CI menjawab "sebesar apa efeknya?" — dan pertanyaan kedua sering lebih penting untuk keputusan bisnis.

**Nilai:** selisih 0,0250 dengan 95% CI (−0,0047, 0,0547) [lab] — intervalnya mencakup 0, konsisten dengan p sama dengan 0,0992. Efek sebenarnya bisa 5,47 poin (bagus sekali), bisa 0 (tidak ada), bisa −0,47 poin (sedikit merugikan). CI di sini memakai SE pooled yang sama dengan uji-z; konvensi umum memakai SE unpooled — bedanya di sini tidak terlihat setelah pembulatan.

**Gambar:** garis bilangan dari −0,47 poin sampai 5,47 poin dengan titik 2,5 poin di tengah — interval yang lebar, mencakup 0.

**Baik/buruk:** CI yang sempit dan tidak mencakup 0 baik — efeknya nyata DAN besarnya diketahui. CI yang lebar dan mencakup 0 buruk untuk keputusan — ia tidak membuktikan "tidak ada efek", ia membuktikan "kita belum tahu".

**Mitigasi:** selalu laporkan CI bersama p-value. Bila CI mencakup 0 tapi batas atasnya besar (5,47 poin di sini), tambah sampel. Bila CI sempit dan mencakup 0 (misal −0,001 sampai 0,002), barulah efeknya praktis nol.

---

## 3. Power dan Ukuran Sampel

Power adalah peluang eksperimenmu mendeteksi efek bila efek itu memang ada. Hitung ukuran sampel SEBELUM eksperimen — bukan sesudah kecewa.

**Nilai:** dengan n sama dengan 1.000 per kelompok dan efek sebenarnya 2,5 poin, power-nya 0,378 (38 persen) [lab]. Band power: di bawah 80 persen lemah; 80 persen ke atas memadai. Rinciannya: 50 sampai di bawah 80 persen lemah; di bawah 50 persen sangat lemah — eksperimen ini sangat lemah. Ukuran sampel untuk power 80 persen: 2.884 per kelompok [lab]. Dengan z dibulatkan (1,96 dan 0,84) hasilnya 2.884; dengan kuantil eksak 2.887 — bedanya tidak material.

**Gambar:** dua batang power — n sama dengan 1.000 memberi 38 persen, n sama dengan 2.884 memberi 80 persen (garis target 80 persen).

**Baik/buruk:** power 80 persen ke atas baik — itu standar sebelum eksperimen. Power 38 persen buruk bila disadari sesudahnya. Power buruk bila dihitung sesudah melihat hasil (post-hoc power) — itu hanya transformasi p-value.

**Mitigasi:** hitung ukuran sampel SEBELUM eksperimen — dari efek terkecil yang penting secara bisnis (2,5 poin), alpha (0,05), dan power target (80 persen). Bila sampel tidak terjangkau, ubah desainnya.

$$n = \frac{2\bar{p}(1-\bar{p})(z_{1-\alpha/2} + z_{1-\beta})^2}{\delta^2}$$

---

## 4. Peeking dan Multiple Testing

Alpha 0,05 berarti peluang satu uji menghasilkan false positive adalah 5 persen — bila H0 benar. Bila menguji berkali-kali, peluangnya bukan lagi 5 persen.

**Nilai:** simulasi A/A [lab] — kedua kelompok sama-sama 12 persen (tidak ada efek), 2.000 simulasi, seed 7. Satu cek di akhir: false positive 0,049 (sesuai alpha 0,05). Mengintip 5 kali (n kumulatif 200, 400, 600, 800, 1.000 per kelompok) dan berhenti begitu ada yang signifikan: false positive 0,145 — hampir tiga kali lipat alpha. Untuk 5 uji yang BERBEDA dan independen tanpa koreksi: family-wise error 1 dikurangi 0,95 pangkat 5 sama dengan 0,2262 (22,6 persen) — lebih besar dari 0,145, karena intipan-intipan peeking memakai data yang sama (berkorelasi), sedangkan 5 uji independen tidak. Koreksi Bonferroni untuk 5 uji: alpha per uji sama dengan 0,05 dibagi 5 sama dengan 0,01.

**Gambar:** satu cek (0,049) vs peeking 5 kali (0,145) vs 5 uji tanpa koreksi (0,226).

**Baik/buruk:** satu cek di akhir dengan alpha yang didaftarkan baik. Peeking buruk — mengubah 5 persen menjadi 14,5 persen. Menguji 5 metrik dan melaporkan yang signifikan saja buruk — 22,6 persen peluang salah satu "signifikan" padahal tidak ada efek.

**Mitigasi:** daftarkan satu cek di akhir dan patuhi. Bila harus mengintip, pakai metode sequential (alpha spending). Bila menguji banyak metrik, koreksi Bonferroni atau Holm. Laporkan SEMUA uji yang dilakukan.

---

## Lab

**Lab 1 — Uji z dua proporsi dan CI.** Empat tugas, termasuk cek SRM [ilustrasi] pada penugasan 1.060 vs 940. Hasil: p_A 0,1200, p_B 0,1450, selisih 0,0250, SE 0,0152, z 1,6489, p-value 0,0992, CI bawah −0,0047, CI atas 0,0547, kesimpulan tidak signifikan pada alpha 0,05, SRM z 2,68, SRM p 0,0073 — randomisasi bermasalah.

**Lab 2 — Power, ukuran sampel, dan Bonferroni.** Hasil: power 0,378, n per grup untuk power 80 persen 2.884, FWER 5 uji 0,226, alpha Bonferroni 5 uji 0,010.

---

## Peta Keputusan

- Sebelum: daftarkan hipotesis, alpha (0,05), metrik utama (satu), dan ukuran sampel dari power 80 persen; acak penugasannya dan rencanakan cek SRM serta keseimbangan kovariat.
- Selama: jangan intip. Satu cek di akhir. Bila harus intip, pakai alpha spending.
- Sesudah: baca ketiganya — estimasi efek (2,5 poin), CI (−0,0047, 0,0547), p-value (0,0992). Bila CI mencakup 0 dan batas atasnya besar, tambah sampel.
- Banyak uji: laporkan SEMUA uji. Koreksi Bonferroni bila melaporkan banyak metrik.
- Peta pemilihan uji — outcome-nya apa? Biner (disetujui/tidak): perbandingan proporsi (uji-z dua proporsi, lesson ini). Kontinu (income, tagihan): perbandingan mean — atau alternatif robust (median, Mann-Whitney) bila distribusinya miring (L0.3). Count/rate (jumlah klaim per bulan): metode count-rate — bukan uji proporsi, karena penyebutnya waktu, bukan orang. Observasi berulang level user (satu nasabah banyak transaksi): agregasi ke level user, atau pakai unit yang tepat — jangan perlakukan 10 transaksi satu nasabah sebagai 10 observasi independen. Dan aturan yang mengikat semuanya: unit inferensi harus sama dengan unit randomisasi — bila yang diacak adalah penawaran, yang diuji adalah penawaran; bila yang diacak adalah nasabah, yang diuji adalah nasabah. Teori formal tiap uji adalah materi Track A — di sini cukup peta pemilihannya.

Peta L0 → M1–M9 — tiap lesson L0 adalah fondasi satu bagian pipeline ML. Cleaning (L0.1) → input validation, data preparation, reproducibility: tanpa audit cleaning, tidak ada yang bisa direproduksi. Missing/imputasi (L0.2) → preprocessing dan sensitivity analysis: pilihan imputasi diuji di M6, indikator missing diaudit di M7. Distribusi/outlier (L0.3) → feature diagnosis dan pilihan transform/robust-summary: fitur yang tidak dipahami bentuknya tidak bisa dimodelkan dengan benar. Wrangling (L0.4) → feature table, agregasi, join, time structure: satu baris per nasabah adalah grain yang dipakai seluruh modul M2–M9. A/B testing (L0.5) → evaluasi eksperimental perubahan kebijakan/model: tiap perubahan model di M6–M8 yang memengaruhi keputusan bisnis diuji seperti eksperimen di lesson ini. Motivasi: M2 memakai fondasi ini untuk credit scoring (PD/LGD/EAD, scorecard, reject inference); M3 untuk fraud (unsupervised, network analysis, alert triage); M4 untuk market risk (VaR, GARCH, regime); M5–M6 untuk optimasi dan tuning; M7 untuk fairness dan monitoring; M8 untuk model risk dan deployment; M9 untuk simulasi dan validasi. L0 tidak mengajarkan materi modul-modul itu — ia memastikan kamu tidak membangunnya di atas data yang belum diperiksa.

---

## Mini-case: Keputusan Bisnis Rp125 Juta

Selisih 2,5 poin, tidak signifikan (p sama dengan 0,0992), CI (−0,0047, 0,0547). Terjemahan ke rupiah [ilustrasi]: lift 2,5 poin dikali 10.000 penawaran sama dengan 250 pinjaman tambahan; dikali margin Rp500.000 sama dengan Rp125.000.000. Tapi CI-nya dalam pinjaman adalah (−47, 547) — dalam rupiah (−Rp23.500.000, Rp273.500.000). Efek sebenarnya bisa Rp273,5 juta keuntungan, bisa Rp23,5 juta kerugian. Keputusan yang benar: JANGAN luncurkan berdasarkan point estimate — intervalnya mencakup kerugian. Dan JANGAN buang skor baru itu — batas atas Rp273,5 juta terlalu besar untuk diabaikan. Perpanjang eksperimen sampai n sama dengan 2.884 per kelompok, lalu putuskan dengan CI yang sudah menyempit.

Tabel keputusan 4 sel — signifikansi × makna bisnis: (1) signifikan + bermakna bisnis → luncurkan; (2) signifikan tapi terlalu kecil → jangan luncurkan — contoh [ilustrasi]: selisih 0,3 poin dengan CI (0,001, 0,005) — signifikan (CI tidak mencakup 0), tapi hanya 30 pinjaman tambahan dari 10.000 penawaran × Rp500.000 = Rp15 juta — lebih kecil dari biaya peluncuran; (3) tidak signifikan tapi CI mencakup upside besar → perpanjang eksperimen — mini-case ini: CI −0,0047 sampai 0,0547 berarti −47 sampai 547 pinjaman, yaitu −Rp23,5 juta sampai Rp273,5 juta — batas atasnya terlalu besar untuk dibuang; (4) CI mencakup downside material → jangan luncurkan, atau perpanjang dengan guardrail — contoh [ilustrasi]: selisih −0,5 poin dengan CI (−0,030, 0,020) — downside-nya −0,030 × 10.000 × Rp500.000 = −Rp150 juta. Yang menentukan bukan p-value-nya — melainkan CI dalam rupiah dan biaya keputusannya.

---

## Guided Task di Colab

Simulasi A/A sendiri: 2.000 simulasi, seed 7 — sekali-cek vs peeking 5 kali — dan perencanaan eksperimen berikutnya (n untuk power 80 persen, rencana pendaftaran).

Peta notebook: Cell 8–9 memakai L0.3 (diagnosis distribusi dan hubungan dengan target — default rate per kelompok PAY_0, korelasi 0,325 dan −0,154); Cell 10 memakai L0.1 (audit cleaning — 0 kosong, 0 duplikat, EDUCATION 345, MARRIAGE 54) dengan L0.2 untuk missing-nya (di sini 0, jadi tidak ada imputasi); Cell 13 memakai L0.4 (feature wrangling — PAY_MEAN, PAY_DELAY_COUNT, UTILIZATION, BILL_MEAN); modelling memakai preprocessing dari L0.2 + L0.4 dan evaluasi dari M1 — dengan fondasi statistik dari L0.5 (p-value, CI, power) di belakangnya. Tugas: label tiap cell notebook dengan lesson L0-nya.

Buka di Colab: https://colab.research.google.com/drive/1ASxxN8guueV1o3vHb6KHQhuM5QXLK4wD
