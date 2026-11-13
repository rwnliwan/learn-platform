# MLF-M5.2: Constrained Optimization — Lagrange & KKT

## Masalah: Manajer Dana yang Tidak Boleh Short

Seorang manajer dana pensiun kecil punya mandat tertulis: tidak boleh short (w ≥ 0), seluruh dana harus terinvestasi (Σw = 1), dan tidak ada satu saham pun boleh melebihi 40 persen portofolio. Dari M5.1 ia tahu cara meminimalkan varians tanpa kendala — gradient descent menuruni bukit sampai ke lembah. Sekarang bukit itu dipagari: sebagian lembah berada di luar pagar, dan «solusi terbaik» mungkin justru menempel di pagar itu.

Kendala bukan hiasan: regulator melarang short untuk dana pensiun; klien membatasi bobot satu saham karena takut konsentrasi; meja trading membatasi turnover karena biaya; komite investasi membatasi sektor karena mandat. Setiap kendala adalah janji yang harus ditepati — dan setiap janji mengubah bentuk masalahnya.

Di data lesson ini [notebook], portofolio GMV tak-terkendala adalah [0,5518; 0,2698; 0,1785] (closed-form) — semua bobot positif, jadi kendala w ≥ 0 TIDAK mengikat di sini. Tapi bila GMV tak-terkendala meminta short pada satu aset, manajer dana itu TIDAK BOLEH memakainya; ia harus mencari yang terbaik di dalam pagar, dan jawabannya akan berbeda.

**Angka acuan [notebook]:** BBCA.JK + KLBF.JK + UNVR.JK, simple return, 480 hari, 2024-11-04 sampai 2026-11-11 (window unduh 2024-11-01 sampai 2026-11-12; file pin data/m4_prices.csv), rf = 0,05. Return tahunan: BBCA −0,2445, KLBF −0,2570, UNVR 0,0796. Volatilitas tahunan: BBCA 0,3449, KLBF 0,4251, UNVR 0,5014. Korelasi: BBCA-KLBF 0,3488, BBCA-UNVR 0,2774, KLBF-UNVR 0,2897. Konvensi ini SAMA dengan M5.1 — bedanya dengan M4.4: M4.4 memakai LOG return untuk VaR, M5 memakai SIMPLE return untuk mean/variance.

---

## 1. Lagrange Multiplier: Kendala Kesetaraan Σw = 1

Masalah GMV: minimkan varians portofolio w'Σw, dengan kendala 1'w = 1. Tanpa kendala, jawabannya trivial dan tidak berguna: w = 0 (varians nol — dengan memegang tunai semua). Kendala Σw = 1 itulah yang membuat masalahnya menarik.

Lagrange: masukkan kendala ke dalam fungsi tujuan dengan «harga» λ. Lagrangian: L(w, λ) = w'Σw − λ(1'w − 1). Syarat orde pertama (FOC): 2Σw = λ1 — gradien varians harus SEJAJAR dengan vektor satu: marginal variance per aset harus SAMA di semua aset, dan nilai samanya adalah λ.

**Nilai [notebook]:** kalikan FOC dari kiri dengan w' — 2w'Σw = λ, karena w'1 = 1. Jadi λ = 2σ²_p — multiplier-nya adalah DUA KALI varians portofolio optimum. Untuk GMV 2 aset, σ²_p = 0,09566 (tak-dibulatkan) sehingga λ = 2 × 0,09566 ≈ 0,1913. Itulah «harga» kendala Σw = 1: melonggarkan kendala sedikit (total bobot 1,01 alih-alih 1,00) akan menaikkan varians sekitar λ × 0,01 — sekitar 0,0019.

**Baik/buruk:** multiplier bagus karena ia memberi HARGA pada kendala — bukan sekadar «solusi ini optimal», melainkan «kendala ini berharga sekian». Buruk bila λ dibaca sebagai angka mistis: λ bukan parameter yang kamu pilih — ia muncul dari masalahnya.

**Mitigasi:** selalu laporkan λ berdampingan dengan w* — bila seseorang bertanya «berapa biaya mandat Σw = 1?», jawabannya ada di λ, bukan di w*. Dan bila λ = 0, kendalanya tidak mengikat.

$$\mathcal{L}(w, \lambda) = w'\Sigma w - \lambda(\mathbf{1}'w - 1) \quad \Rightarrow \quad 2\Sigma w = \lambda \mathbf{1}, \quad \lambda = 2\sigma_p^2$$

---

## 2. Worked Example: GMV 2 Aset (BBCA + KLBF)

Dua aset, satu derajat kebebasan (w_KLBF = 1 − w_BBCA). Kovarians tahunan [notebook]: σ²_BBCA = 0,1190, σ²_KLBF = 0,1807, σ_BBCA,KLBF = 0,0511.

$$w_1^* = \frac{\sigma_2^2 - \sigma_{12}}{\sigma_1^2 + \sigma_2^2 - 2\sigma_{12}} = \frac{0,1807 - 0,0511}{0,1190 + 0,1807 - 2 \times 0,0511} = 0,6565$$

**Nilai [turunan/derived]:** w_BBCA = 0,6565, w_KLBF = 0,3435. Portofolio GMV 2 aset: return −0,2488, volatilitas 0,3093, Sharpe −0,9661. Volatilitas 0,3093 LEBIH RENDAH dari volatilitas aset terendah sekalipun (BBCA 0,3449) — itulah diversifikasi bekerja. Tapi return-nya −0,2488: tenang saja tidak cukup bila kedua asetnya sama-sama jatuh.

**Verifikasi KKT:** hitung 2Σw pada w* = [0,6565; 0,3435] — dengan angka tak-dibulatkan, (Σw*)_BBCA = 0,09566 dan (Σw*)_KLBF = 0,09566 — KEDUA komponen 2Σw* sama, 0,19132 ≈ 0,1913, persis seperti yang dituntut FOC 2Σw = λ1. Dan λ = 2σ²_p = 2 × 0,09566 ≈ 0,1913 — konsisten. (Jangan kalikan angka yang sudah dibulatkan: 2 × 0,0957 = 0,1914 — selisih 0,0001 itu murni artefak pembulatan, bukan kesalahan rumus.)

**Baik/buruk:** rumus tertutup bagus karena instan, eksak, dan bisa diverifikasi dengan satu perkalian matriks. Buruk bila dipakai buta: rumus ini hanya berlaku untuk DUA aset dan SATU kendala kesetaraan.

**Mitigasi:** setiap kali kamu mendapat «solusi optimal» dari mana pun, verifikasi FOC-nya: hitung 2Σw dan periksa apakah semua komponennya sama.

---

## 3. KKT untuk Ketidaksamaan w ≥ 0

Tambah kendala w ≥ 0 (tidak boleh short). Ketidaksamaan bisa AKTIF (w_i = 0, kendala mengikat) atau TIDAK AKTIF (w_i > 0, kendala longgar). KKT adalah perluasan Lagrange untuk kasus ini — empat syarat untuk GMV long-only:

1. **Stationarity** — 2Σw − λ1 − μ = 0, alias 2Σw = λ1 + μ.
2. **Primal feasibility** — 1'w = 1 dan w ≥ 0.
3. **Dual feasibility** — μ ≥ 0.
4. **Complementary slackness** — μ_i · w_i = 0 untuk tiap aset i.

Syarat keempat adalah kuncinya: untuk tiap aset, PALING TIDAK SATU dari μ_i dan w_i harus nol. Bila aset dipegang (w_i > 0), multiplier-nya nol (μ_i = 0) — kendala tidak mengikat. Bila aset TIDAK dipegang (w_i = 0), multiplier-nya boleh positif (μ_i > 0) — dan FOC menjadi 2(Σw)_i = λ + μ_i > λ: marginal variance aset itu LEBIH TINGGI dari λ, itulah sebabnya kamu tidak memegangnya.

**Nilai [notebook]:** GMV long-only adalah [0,5523; 0,2699; 0,1777] — SAMA PERSIS dengan GMV tak-terkendala SLSQP. Ketiga bobot positif, jadi ketiga kendala w ≥ 0 TIDAK AKTIF: active set-nya KOSONG, semua μ_i = 0, dan KKT runtuh kembali ke Lagrange biasa. Bandingkan dengan max-Sharpe long-only: [0; 0; 1] — active set-nya {BBCA, KLBF}, karena kedua bobot itu tepat di batas nol.

**Baik/buruk:** KKT bagus karena ia memberi DAFTAR PERIKSA universal — untuk masalah konveks (dan GMV adalah konveks), KKT adalah syarat CUKUP: bila terpenuhi, solusi itu PASTI optimum global. Buruk bila diterapkan buta pada masalah non-konveks: max-Sharpe adalah rasio (non-konveks) — KKT di sana tidak menjamin apa-apa.

**Mitigasi:** sebelum percaya pada solusi solver, tanyakan: (1) apakah masalahnya konveks? (2) apakah KKT terpenuhi — terutama complementary slackness?

$$2\Sigma w = \lambda \mathbf{1} + \mu, \quad \mu \geq 0, \quad \mu_i \cdot w_i = 0 \;\; \forall i$$

---

## 4. GMV 3 Aset: Closed-Form vs SLSQP

Rumus tertutup Lagrange untuk tiga aset (atau berapa pun): w* = Σ⁻¹1 / (1'Σ⁻¹1).

**Nilai [notebook]:** closed-form memberi [0,5518; 0,2698; 0,1785]. SLSQP memberi [0,5523; 0,2699; 0,1777]. Selisih maksimumnya 0,0007 dari bobot tak-bulat (0,0008 bila dihitung dari bobot yang dibulatkan ke 4 desimal — lihat lab 2) — ≈0,15% dari bobot terbesar (0,55), atau 0,08% dari total dana. Closed-form memberi return −0,1900, SLSQP −0,1903 (selisih 0,0003); volatilitas keduanya 0,2966. Ketika rumus analitik dan solver numerik yang bekerja dengan cara sama sekali berbeda tiba di tempat yang sama (sampai 4 desimal), itu adalah bukti kuat bahwa masalahnya well-posed: solusinya ada, tunggal, dan stabil.

**Gambar:** frontier long-only [notebook] — 8 titik dari GMV (return −0,1903, vol 0,2966) sampai 100% UNVR (return 0,0796, vol 0,5014). GMV ada di ujung kiri bawah — titik paling tenang di seluruh frontier. Tiap titiknya adalah satu masalah Lagrange dengan satu kendala tambahan (w'μ = target).

**Baik/buruk:** kesepakatan closed-form vs SLSQP bagus sebagai ALAT DIAGNOSIS — bila keduanya berbeda jauh, salah satu (atau masalahnya) bermasalah. Buruk bila kesepakatan dibaca sebagai «solver selalu benar»: di langkah 6, SLSQP «berhasil» sambil mengembalikan sampah.

**Mitigasi:** untuk setiap optimasi portofolio, hitung JUGA closed-form-nya bila ada (GMV selalu punya) dan bandingkan. Selisih di atas ~0,001 adalah bendera merah.

---

## 5. Validasi Numerik: Periksa Σ Sebelum Membaliknya

Rumus tertutup GMV (langkah 4) punya satu syarat tersembunyi: Σ⁻¹ harus ADA — dan ada dengan AMAN. Matriks kovarians secara teori selalu positive semi-definite (PSD): x'Σx ≥ 0 untuk semua x. Tapi «secara teori» dan «di angka» adalah dua hal berbeda: Σ yang diestimasi dari 480 hari bisa hampir singular — satu eigenvalue mendekati nol — dan inversnya meledak. Sebelum membalik Σ, periksa DULU kesehatannya.

**Nilai [notebook]:** eigenvalue Σ tahunan adalah [0,088937; 0,151142; 0,310986] — ketiganya POSITIF, jadi Σ lesson ini definit positif (lebih kuat dari PSD: x'Σx > 0 untuk semua x ≠ 0). Condition number-nya κ = λmaks/λmin = 0,3110/0,0889 = 3,5 — kecil; inversnya aman. Determinannya det(Σ) = 0,004180 — jauh dari nol. Dan dekomposisi Cholesky Σ = LL' BERHASIL — tes PSD yang paling praktis di kode (bila Cholesky gagal, Σ-mu tidak PSD). Kesimpulan: Σ lesson ini SEHAT — GMV closed-form berdiri di atas fondasi yang kokoh, bukan di atas pasir.

**Gambar:** tiga eigenvalue (0,0889; 0,1511; 0,3110), semuanya jauh di atas garis ambang waspada λ = 0,05 — tidak ada yang mendekati nol. Bandingkan dengan demo hampir-singular [ilustrasi]: dua aset dengan vol 0,3449 dan 0,4251 (vol BBCA dan KLBF). Saat korelasinya 0,90, condition number-nya 19,9; saat 0,99, cond-nya 207,9 dan eigenvalue terkecilnya menyusut ke 0,001434; saat 0,999, cond-nya 2.087,8 dengan eigenvalue terkecil 0,000143; saat korelasi tepat 1,0, Σ menjadi SINGULAR — determinan 0, satu eigenvalue tepat 0, invers TIDAK ADA. Polanya jelas: saat korelasi → 1, satu eigenvalue → 0, dan invers meledak — bobot GMV menjadi tidak stabil.

**Sensitivitas invers:** ubah SATU entri Σ [notebook] — Σ[0,1] (kovarians BBCA-KLBF) ditambah 0,001 — dan GMV bergeser dengan jarak L1 0,0042. Di Σ yang sehat ini, pergeserannya kecil (0,42% dari total dana) — itulah arti cond 3,5. Di Σ yang hampir singular (cond 2.087,8), gangguan yang sama bisa menggeser bobot berkali-kali lipat lebih besar. Condition number adalah PENGALI kesalahan: kesalahan relatif di input dikali cond ≈ kesalahan relatif di invers.

**Baik/buruk:** validasi numerik bagus karena ia MURAH — empat baris kode (eigenvalue, cond, det, Cholesky) sebelum optimasi — dan ia menangkap kelas kegagalan yang tidak terlihat dari angka bobotnya. Buruk bila dilewati: Σ yang hampir singular tidak memberi peringatan — SLSQP tetap mengembalikan bobot, closed-form tetap menghitung, dan keduanya tampak normal sampai kamu membandingkan dua estimasi yang sedikit berbeda dan bobotnya melompat.

**Mitigasi:** checklist sebelum membalik Σ — (1) semua eigenvalue > 0: bila ada yang ≤ 0, Σ-mu bukan definit positif (cek bug estimasi atau data duplikat); (2) condition number: di bawah 100 aman, 100–1000 waspada, di atas 1000 jangan percaya inversnya — pertimbangkan shrinkage (M5.5) atau buang aset yang hampir duplikat; (3) determinan ≠ 0: det yang mendekati nol adalah bau singularitas; (4) Cholesky berhasil: bila `np.linalg.cholesky` gagal, berhenti dan perbaiki Σ dulu. Empat cek ini adalah «sabuk pengaman» tiap optimasi — jalankan sebelum solver, bukan sesudah.

$$\kappa(\Sigma) = \frac{\lambda_{\max}}{\lambda_{\min}} = \frac{0,3110}{0,0889} = 3,5, \quad \det(\Sigma) = 0,004180, \quad \lambda = [0,0889;\; 0,1511;\; 0,3110]$$

---

## 6. Max-Sharpe Tak-Terkendala Meledak — Masalah yang Tidak Punya Solusi

Maksimalkan Sharpe ratio S(w) = (w'μ − rf) / √(w'Σw), dengan SATU-SATUNYA kendala Σw = 1 — shorting BOLEH, leverage TIDAK DIBATASI. Masalah ini TIDAK PUNYA solusi berhingga.

Kenapa? Sharpe ratio TIDAK homogen dalam skala bobot bila rf ≠ 0 — mengalikan seluruh w dengan konstanta TIDAK mempertahankan Sharpe, karena rf-nya tetap: S([0; 0; 1]) = 0,0590, tapi S(2·[0; 0; 1]) = 0,1089. Yang homogen adalah versi excess return, (w'(μ − rf·1))/σ — tapi itu bukan Sharpe yang kita hitung. Kendala Σw = 1 hanya mematok skala, bukan leverage: kamu boleh short BBCA −3.154 dan KLBF −3.786, lalu long UNVR 6.941 — jumlahnya tetap 1. Ambil arah zero-cost terbaik d (jumlahnya 0), lalu campur dengan portofolio mana pun yang jumlahnya 1: w(λ) = [0; 0; 1] + λ·d. Makin besar λ, makin besar leverage — dan Sharpe-nya NAIK TERUS mendekati supremum 0,6718 dari bawah, tanpa pernah sampai (di leverage besar, suku rf menjadi kecil relatif terhadap return, sehingga Sharpe mendekati (d'μ)/√(d'Σd) = 0,32985/0,49101 = 0,6718).

**Nilai [notebook]:** arah zero-cost terbaik adalah d = [−0,5406; −0,4594; 1,0] dengan Sharpe 0,6718 — itu SUPREMUM-nya, batas yang tidak pernah dicapai portofolio berhingga mana pun. Sepanjang ray w(λ): λ = 0 → 0,0590 (100% UNVR); λ = 1 → 0,3818; λ = 2 → 0,4869; λ = 5 → 0,5845; λ = 10 → 0,6256; λ = 50 → 0,6621; λ = 100 → 0,6669; λ = 1000 → 0,6713 — merangkak mendekati 0,6718 dari bawah, selamanya.

SLSQP, dijalankan dari equal-weight, «berhenti» di w = [−3154,7; −3786,1; 6941,9] dengan Sharpe 0,6697 dan melaporkan success = True [notebook]. Itu BUKAN portofolio optimal — itu ARTEFAK titik berhenti: solver berhenti karena toleransinya tercapai, bukan karena ia menemukan optimum. Dari titik awal yang berbeda, ia berhenti di tempat yang berbeda pula: dari [0; 0; 1] di [−11003,8; −12512,6; 23517,4] (Sharpe 0,6703); dari [0,6; 0,3; 0,1] di [−3415,7; −3360,3; 6777,0] (Sharpe 0,6714); dari [1; 0; 0] di [−4554,6; −9498,6; 14054,2] (Sharpe 0,6595) [notebook]. «Solusi» yang bergantung pada titik awal bukanlah solusi.

**Gambar:** Sharpe vs leverage λ — kurva naik cepat lalu mendatar mendekati garis putus-putus supremum 0,6718 (skala log untuk λ ≥ 1; λ = 0 diletakkan di tepi kiri); titik SLSQP (0,6697) tidak diplot — ia berada di λ ≈ 6941, jauh di luar sumbu-x grafik.

**Lengkapnya:** DENGAN aset bebas risiko (tanpa kendala Σw = 1), Sharpe maksimum teoritis adalah 1,0517 [notebook] — dari rumus √(μ−rf)'Σ⁻¹(μ−rf). Arah tangency-nya Σ⁻¹(μ−rf·1) = [−2,2448; −1,3644; 0,8814], yang jumlahnya −2,7279 — NET SHORT. Bila arah itu dipaksa dinormalisasi ke jumlah 1 (dibagi −2,7279), arahnya TERBALIK dan Sharpe-nya menjadi −1,0517 [notebook].

**Baik/buruk:** ill-posedness bagus sebagai PELAJARAN — tidak semua masalah optimasi yang bisa ditulis punya jawaban, dan solver tidak akan memberi tahumu bila masalahmu tidak punya jawaban. Buruk bila tidak dikenali: satu angka «Sharpe 0,6697» di slide bisa mengunci keputusan alokasi yang mustahil dieksekusi.

**Mitigasi:** sebelum memaksimalkan rasio apa pun, tanyakan: apakah fungsinya punya maksimum berhingga di feasible set ini? Bila tidak — tambahkan kendala yang membuatnya well-posed (langkah 7), atau ubah tujuannya (maksimalkan return dengan batas volatilitas, atau minimalkan varians dengan target return — keduanya konveks dan well-posed).

---

## 7. Long-Only: Satu Kendala yang Mengubah Ill-Posed menjadi Corner Solution

Tambahkan SATU kendala ke masalah max-Sharpe yang meledak tadi: w ≥ 0. Seketika masalahnya berubah total — dari ill-posed menjadi well-posed, dan jawabannya adalah corner solution: [0; 0; 1] — 100 persen UNVR [notebook].

**Nilai [notebook]:** excess return (return minus rf = 0,05): BBCA −0,2945; KLBF −0,3070; UNVR +0,0296. UNVR adalah SATU-SATUNYA aset dengan excess return positif. Setiap rupiah yang digeser dari UNVR ke BBCA atau KLBF menurunkan pembilang Sharpe sambil menambah penyebut (volatilitas) karena korelasinya positif (0,2774 dan 0,2897). Sharpe maksimum long-only adalah Sharpe UNVR sendiri, 0,0590, dengan return 0,0796 dan vol 0,5014.

Dalam bahasa KKT: active set-nya {BBCA, KLBF} — kedua bobot tepat di batas nol — dan μ_BBCA, μ_KLBF > 0, sementara μ_UNVR = 0.

Bandingkan dengan GMV long-only [notebook] — [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966 — yang SAMA dengan GMV tak-terkendala. Dua masalah, dua nasib kendala yang sama: untuk GMV, long-only tidak mengikat sama sekali (active set kosong); untuk max-Sharpe, long-only mengikat total (dua dari tiga aset di batas).

**Baik/buruk:** corner solution bagus karena ia JUJUR — ia berkata «di data ini, dengan kendala ini, jawaban terbaik adalah satu aset». Buruk bila dibaca sebagai «diversifikasi tidak berguna»: corner ini adalah artefak data (dua dari tiga aset punya excess return negatif yang besar) + kendala.

**Mitigasi:** bila solusimu adalah corner, tanyakan: apakah ini sinyal ekonomi yang nyata, atau artefak estimasi μ yang berisik? Mean return adalah input yang paling berisik di optimasi portofolio — corner yang didorong oleh μ yang diestimasi dari 480 hari berhak dicurigai sebelum dieksekusi.

---

## 8. Kendala Praktis Lain: Batas Bobot, Turnover, dan Sector

Tiga keluarga kendala praktis yang paling sering muncul: (1) batas bobot — misal w_i ≤ 0,40 untuk mencegah konsentrasi (GMV kita [notebook] melanggarnya: w_BBCA = 0,5523 > 0,40 — jadi batas ini MENGIKAT dan mengubah jawaban); (2) batas turnover — |w − w_0| ≤ δ, karena tiap perubahan adalah biaya transaksi; (3) batas sector — misal total bobot perbankan ≤ 0,60.

Semua kendala ini LINEAR — dan itu kabar baik: masalah GMV dengan kendala linear tetap konveks (quadratic program) dan KKT tetap menjadi bukti optimum global. Rumus tertutup tidak lagi berlaku — tidak ada rumus satu baris untuk GMV dengan batas bobot — tapi solver menanganinya dengan cara yang sama.

**Nilai [notebook]:** batas w_UNVR ≤ 0,50 [ilustrasi] memotong ujung atas frontier: return maksimum long-only jatuh dari 0,0796 (100% UNVR) menjadi −0,0825 — portofolio [0,5; 0; 0,5] (BBCA + UNVR masing-masing setengah). Satu kendala, satu angka: «harga»-nya adalah 0,1621 poin return tahunan.

**Baik/buruk:** kendala praktis bagus bila ia mencerminkan aturan yang nyata dan harganya dihitung terbuka. Buruk bila kendala menumpuk tanpa audit: tiap batas baru menyusutkan frontier, dan tumpukan batas yang tidak pernah diuji bisa diam-diam memaksa portofolio ke sudut yang buruk.

**Mitigasi:** audit kendala secara berkala — hapus satu kendala, hitung ulang optimum, dan lihat berapa harganya. Kendala yang harganya nol (tidak mengikat) bisa tetap sebagai pengaman; kendala yang harganya besar harus dibela dengan alasan bisnis, bukan kebiasaan.

---

## 9. Kendala Realistis: Harga Tiap Aturan

Langkah 8 menyebut tiga keluarga kendala praktis — batas bobot, turnover, sector — tapi belum menghitung HARGA satu pun. Sekarang hitung: tiap kendala di bawah diterapkan pada GMV 3 aset yang sama (vol bebas 0,2966), dan «harga»-nya adalah kenaikan vol dalam basis poin (bp). Satu tabel, empat harga — dan satu pelajaran: kendala hanya berharga bila ia MENGIKAT.

**Nilai:** cap bobot BBCA ≤ 0,40 [ilustrasi] — GMV bebas menaruh 0,5523 di BBCA, di atas cap, jadi cap ini mengikat. GMV baru w = [0,4000; 0,3646; 0,2354], vol 0,3026 — naik 60bp dari 0,2966. Kardinalitas ≤ 2 aset (pegang paling banyak 2 dari 3): pasangan terbaik adalah BBCA+KLBF, w = [0,6563; 0,3437; 0], vol 0,3093 — naik 127bp, kendala TERMAHAL di tabel ini. Dua pasangan lain lebih mahal lagi: BBCA+UNVR vol 0,3172, KLBF+UNVR vol 0,3672. Minimum holding 0,10 (aset yang dipegang minimal 10%): TIDAK mengikat — GMV bebas sudah menaruh ≥ 0,10 di tiap aset (bobot terkecil 0,1777) — vol tetap 0,2966, harga 0bp. Budget turnover L1 ≤ 0,10 dari equal-weight: w = [0,3833; 0,3333; 0,2833], vol 0,3048 — naik 82bp.

**Cara hitung:** bagaimana kardinalitas dan minimum holding dihitung? Bukan «solver ajaib» — enumerasi + SLSQP. Untuk kardinalitas ≤ 2 dengan 3 aset, ada 2³ = 8 subset (termasuk himpunan kosong dan singleton); untuk tiap subset yang tak-kosong, jalankan SLSQP GMV yang dibatasi pada aset di subset itu, lalu ambil vol terkecil — itulah BBCA+KLBF (0,3093). Minimum holding dihitung dengan cara yang sama: tiap subset diuji dengan batas bawah 0,10 pada aset yang dipegang — dan subset terbaik tetap ketiganya (0,2966), karena GMV bebas sudah memenuhi batasnya. Enumerasi bekerja untuk 3 aset; untuk 30 aset, 2³⁰ subset tidak mungkin — di sanalah mixed-integer programming (MIP) masuk, dan itu di luar lesson ini.

**Baik/buruk:** tabel harga bagus karena ia mengubah debat kendala dari opini menjadi angka — komite bisa menimbang «apakah larangan pegang 3 aset sepadan dengan +127bp vol?». Buruk bila harga dibaca tanpa konteks: +127bp di vol 0,2966 adalah ~4,3% relatif — kecil di satu tahun yang volatil, besar bila dijumlahkan tiap tahun selama satu dekade.

**Mitigasi:** sebelum mengusulkan kendala baru, hitung harganya dulu (tabel seperti di atas) dan tanyakan apakah ia mengikat: bila tidak mengikat, ia gratis — pertahankan sebagai pengaman tanpa debat; bila mengikat, bela dengan alasan bisnis, bukan kebiasaan. Dan ingat: kendala yang tidak mengikat HARI INI bisa mengikat BESOK bila estimasi bergeser — audit ulang tiap rebalancing.

$$\text{harga} = \sigma_{\text{terkendala}} - \sigma_{\text{bebas}}: \quad \text{cap } 0,40 \to +60\,\text{bp}; \quad \text{kardinalitas } \leq 2 \to +127\,\text{bp}; \quad \text{min holding } 0,10 \to +0\,\text{bp}; \quad \text{turnover } L_1 \leq 0,10 \to +82\,\text{bp}$$

---

## 10. SLSQP: Bukan Black Box

SLSQP (Sequential Least Squares Programming) adalah solver yang dipakai notebook M5 [notebook]. Di tiap iterasi, SLSQP melakukan TIGA hal: (1) hampiri fungsi tujuan dengan model KUADRATIK di sekitar titik saat ini (ekspansi Taylor orde dua); (2) LINEARKAN kendala di sekitar titik itu (kendala linear seperti Σw = 1 dan w ≥ 0 sudah linear — tidak berubah); (3) selesaikan masalah QUADRATIC PROGRAM (QP) kecil itu, lalu melangkah ke titik baru, dan ulangi.

Kenapa ini bekerja untuk GMV? Karena tujuan GMV (w'Σw) SUDAH kuadratik dan kendalanya linear — hampiran kuadratiknya EXACT. SLSQP menyelesaikan GMV dalam satu-dua iterasi, dan jawabannya cocok dengan closed-form sampai 0,0008. Untuk max-Sharpe, tujuannya adalah RASIO — hampiran kuadratiknya tidak pernah exact, gradiennya tidak pernah nol di arah zero-cost, dan solver berjalan menjauhi titik awal sampai toleransi menghentikannya — itulah [−3154,7; −3786,1; 6941,9].

**Nilai:** dua angka yang perlu diperiksa dari solver apa pun — (1) `success` (apakah kriteria berhenti terpenuhi) dan (2) APA yang berhenti: gradien? langkah? fungsi? SLSQP berhenti bila perubahan fungsi atau langkah di bawah toleransi (ftol/xtol, default 1e-6) — di masalah ill-posed, «perubahan kecil» terjadi di leverage ribuan, BUKAN karena optimum ditemukan.

**Baik/buruk:** SLSQP bagus karena ia generalis — satu solver untuk tujuan dan kendala apa pun yang cukup mulus. Buruk bila dipakai sebagai orakel: ia tidak tahu apakah masalahmu punya solusi; ia hanya berjalan sampai lelah.

**Mitigasi:** tiga kebiasaan sebelum memakai hasil solver — (1) jalankan dari DUA titik awal yang berbeda dan bandingkan (bila berbeda jauh, curigai ill-posed); (2) bandingkan dengan closed-form bila ada; (3) verifikasi KKT pada jawabannya.

---

## Lab 1: Lagrange 2 Aset — Hitung Tangan, Cek Numerik

Dua aset sintetis [ilustrasi]: varians 0,04 dan 0,09, kovarians 0,01. Hasilnya [lab]: w1 = 0,7273, w2 = 0,2727, var portofolio = 0,0318, λ = 0,0636, gradien = [0,0636; 0,0636] — kedua komponen sama, verifikasi KKT lolos. Bandingkan dengan angka kanonis (w_BBCA = 0,6565, λ = 0,1913): angkanya berbeda karena datanya berbeda, tapi POLANYA sama — λ selalu 2 × var_p, dan gradien selalu sama di semua aset yang dipegang.

## Lab 2: SLSQP GMV vs Closed-Form dari Data Pin

Matriks kovarians dan mean HARIAN BBCA, KLBF, UNVR (simple return, 480 hari, 2024-11-04 s.d. 2026-11-11) tertanam di kode — dikali 252 menjadi tahunan. Hasilnya [lab]: closed-form [0,5518; 0,2698; 0,1785], SLSQP [0,5523; 0,2699; 0,1777], selisih maks 0,0007. Return closed-form −0,1900 vs SLSQP −0,1903 (selisih 0,0003 — murni akibat bobot yang bergeser 0,0007), volatilitas keduanya 0,2966 [notebook].

## Mini-case: Batas 40 Persen di Meja Komite

Komite investasi dana pensiun itu mengusulkan batas w_i ≤ 0,40 untuk semua saham. GMV long-only saat ini [notebook] adalah [0,5523; 0,2699; 0,1777] — w_BBCA = 0,5523 MELANGGAR batas itu. Keputusan yang jujur: batas ini MENGIKAT — GMV baru akan berbeda (BBCA dipaksa turun ke 0,40, sisanya dialihkan ke KLBF/UNVR), dan varians minimumnya akan NAIK dari 0,2966². Yang TIDAK boleh dilakukan: menerapkan batas diam-diam lalu melaporkan «GMV» tanpa menyebut bahwa itu bukan lagi GMV — melainkan GMV-dengan-batas-40-persen, lengkap dengan harganya (selisih varians). Hitung harganya dulu, baru putuskan — itulah yang diajarkan λ.

## Jebakan Pamungkas: Kendala yang Terlalu Ketat

Tiap kendala menyusutkan frontier. Batas w_UNVR ≤ 0,50 [ilustrasi] memotong ujung atas frontier long-only: return maksimum jatuh dari 0,0796 menjadi −0,0825 (portofolio [0,5; 0; 0,5]) [notebook]. Tumpuk batas tanpa audit — batas bobot + batas turnover + batas sector — dan frontier bisa menyusut sampai hanya menyisakan portofolio yang buruk; tumpuk sampai kontradiktif (misal w_BBCA ≥ 0,60 dan w_BBCA ≤ 0,40 bersamaan) dan feasible set menjadi KOSONG — solver gagal tanpa solusi sama sekali.

## Guided Task di Colab

Notebook: colab/mlf-m52-guided-task.ipynb — GMV 2 aset (0,6565/0,3435, λ = 0,1913, verifikasi KKT) + GMV 3 aset closed-form vs SLSQP + ray max-Sharpe w(λ) dengan Sharpe mendekati supremum 0,6718 + titik berhenti SLSQP dari tiga titik awal yang berbeda + max-Sharpe long-only (corner 100% UNVR) + harga batas w_UNVR ≤ 0,50, lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/1vdPVnP8Wh4tKx5Egg4ZHseGyE9KzEflV

## Rangkuman

- Kendala mengubah masalah: Lagrange mengubah kendala kesetaraan Σw = 1 menjadi «harga» λ — untuk GMV, λ = 2σ²_p (GMV 2 aset: λ = 0,1913).
- KKT memperluas Lagrange ke ketidaksamaan w ≥ 0: complementary slackness μ_i·w_i = 0 + active set — aset yang dipegang → μ_i = 0; aset di batas → μ_i boleh > 0.
- GMV 2 aset (BBCA + KLBF) [turunan/derived]: w = [0,6565; 0,3435], return −0,2488, vol 0,3093, Sharpe −0,9661; verifikasi KKT: 2Σw = [0,1913; 0,1913].
- GMV 3 aset [notebook]: closed-form [0,5518; 0,2698; 0,1785] vs SLSQP [0,5523; 0,2699; 0,1777] — selisih maks 0,0007 (0,0008 dari bobot 4 desimal); return closed-form −0,1900 vs SLSQP −0,1903, vol 0,2966: well-posed.
- Max-Sharpe tak-terkendala adalah ILL-POSED [notebook]: SLSQP berhenti di [−3154,7; −3786,1; 6941,9] (Sharpe 0,6697) — artefak titik berhenti, BUKAN solusi; supremum 0,6718 (arah zero-cost [−0,5406; −0,4594; 1,0]) tak pernah dicapai; titik awal berbeda → titik berhenti berbeda.
- Max Sharpe teoritis (dengan aset bebas risiko) = 1,0517; arah tangency [−2,2448; −1,3644; 0,8814] jumlah −2,7279 (net short) — dinormalisasi ke jumlah 1, Sharpe-nya −1,0517.
- Max-Sharpe long-only [notebook]: corner [0; 0; 1] (100% UNVR), return 0,0796, vol 0,5014, Sharpe 0,0590 — UNVR satu-satunya aset dengan excess return positif (+0,0296).
- GMV long-only = GMV tak-terkendala ([0,5523; 0,2699; 0,1777]) — kendala w ≥ 0 tidak mengikat di sana; kendala yang sama bisa gratis di satu masalah dan menentukan di masalah lain.
- Validasi numerik [notebook]: eigenvalue Σ tahunan [0,088937; 0,151142; 0,310986] — semua > 0, Σ definit positif; condition number 3,5, det(Σ) = 0,004180, Cholesky berhasil — Σ sehat, invers aman; demo [ilustrasi]: korelasi 0,99 → cond 207,9; korelasi 1,0 → singular.
- Harga kendala vs GMV bebas (vol 0,2966): cap BBCA ≤ 0,40 [ilustrasi] → vol 0,3026 (+60bp); kardinalitas ≤ 2 → vol 0,3093 (+127bp, termahal); minimum holding 0,10 → vol 0,2966 (+0bp, tidak mengikat); budget turnover L1 ≤ 0,10 → vol 0,3048 (+82bp).
- SLSQP: hampiri tujuan secara kuadratik + linearkan kendala + selesaikan QP kecil, berulang-ulang — generalis yang baik, orakel yang buruk; selalu verifikasi KKT dan jalankan dari dua titik awal.
- Jebakan: kendala terlalu ketat menyusutkan frontier — batas w_UNVR ≤ 0,50 [ilustrasi] memotong return maksimum dari 0,0796 menjadi −0,0825; kendala kontradiktif membuat feasible set kosong.
- Lab: Lagrange 2 aset [ilustrasi] — w1 = 0,7273, λ = 0,0636, gradien [0,0636; 0,0636]; SLSQP GMV vs closed-form — selisih maks 0,0007, return −0,1903, vol 0,2966.
