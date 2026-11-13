# Gap Analysis Luna — L0 "Data Foundations" (Track Machine Learning Finance)

- **Analis:** Luna via Kelontong AI (`gpt-6-luna`, streaming, max-tokens 8000) — kursi digging/gap analysis
- **Tanggal:** 12 Nov 2026
- **Materi yang dianalisis:** spec `SPEC-MLF-M1.md` (§2 outline L0, §3.5 format, §4 QA) + 5 lesson ringkas `content/mlf-l01-data-cleaning.md`, `mlf-l02-missing-data-imputasi.md`, `mlf-l03-distribusi-outlier.md`, `mlf-l04-data-wrangling.md`, `mlf-l05-ab-testing.md`
- **Panggilan:** satu panggilan, selesai utuh (tidak terpotong, tidak perlu continuation, tidak perlu fallback). Output mentah: `/tmp/luna_gap_l0_raw.md`
- **Metode:** cakupan vs outline spec §2, kesiapan menuju M1, koneksi L0 → M1 / notebook credit scoring / Track A, cakupan kuis, cek overlap L0/M2–M9/track lain
- **Tidak ada file lesson yang diedit.**

## Caveat penting (catatan agen — baca dulu)

Luna bekerja dari **versi ringkas `.md`**, bukan file TS penuh. Karena itu setiap gap di bawah ini sudah diverifikasi agen ke TS penuh sebelum ditulis di laporan ini. Hasil verifikasi:

- **Satu klaim Luna TERBUKTI artefak ringkasan: G1 (quiz tidak ada).** `.md` memang tidak memuat soal kuis, tetapi TS penuh punya **6 soal checkpoint per lesson** (30 soal total, masing-masing dengan `why`). Yang hilang bukan kuisnya, melainkan **cakupan kuis** — konsep aplikasi tertentu tidak pernah diuji (lihat G1 dan bagian "Cek cakupan kuis"). G1 dipertahankan dalam daftar dengan flag artefak, mengikuti pola G26 di laporan M1.
- **Empat label HILANG dikoreksi menjadi TIPIS** setelah dicek ke TS: G9 (konsekuensi ketidakpastian imputasi sudah dinyatakan satu kalimat lewat penyusutan varians + CI yang menyempit), G10 (caveat MNAR tidak bisa dideteksi dari data teramati sudah ada + diuji di kuis Q6; yang hilang hanya pembedaan "bukti mendukung MAR" vs "bukti pasti MAR"), G12 (biaya interpretasi transformasi sudah dinyatakan satu kalimat — koefisien log = efek persen; yang hilang hanya decision box "apakah modelku butuh transformasi?"), G18 (konsep "efek terkecil yang penting secara bisnis" sudah ada di L0.5 §3–§4 dan mini-case sudah mempraktikkan satu keputusan go/no-go; yang hilang hanya tabel kerangka 4 sel).
- **Satu label HILANG dikoreksi menjadi TIPIS: G14.** Peringatan fan-out (kunci duplikat menggandakan baris) sudah ada di prose L0.4 §2 + diuji kuis Q6; yang hilang adalah kerangka kardinalitas (one-to-one / one-to-many / many-to-one, deklarasi expected relationship, agregasi kembali ke grain).
- Semua gap lain **terverifikasi HILANG/TIPIS sesuai label Luna** (bukti TS dicatat di tiap gap).

**Hitungan temuan:** 6 must-add, 10 should-add, 2 nice-to-have — total 18 (1 di antaranya artefak ringkasan, lihat G1). **Gap yang perlu diisi: 17** (5 must-add, 10 should-add, 2 nice-to-have).

---

## Ringkasan eksekutif

L0 memenuhi kerangka yang dijanjikan spec §2: cleaning dengan band keputusan, imputasi dengan mekanisme MCAR/MAR/MNAR, diagnosis distribusi dengan figure per diagnosis, wrangling (reshape/join/encoding), dan A/B testing dengan p-value, CI, power, peeking, dan multiple testing. Hampir semua angka lolos hitung ulang (review DeepSeek, 25 temuan sudah diperbaiki).

Namun ada gap besar sebelum pembelajar masuk M1:

1. **Preprocessing leakage belum diajarkan sama sekali** — L0 mengajarkan imputasi, encoding, dan transformasi tanpa pernah menyatakan bahwa parameter-parameter itu harus di-fit pada train saja. Ini prasyarat langsung M1 (G4).
2. **A/B testing diajarkan tanpa desain eksperimen** — tidak ada random assignment, unit eksperimen, atau sample-ratio mismatch; p-value dan power dihitung untuk kelompok yang keberadaannya diasumsikan (G5, G6).
3. **Aturan keputusan disajikan sebagai angka mutlak, bukan heuristik** — band 5%/30%, 2%/10%, dan power tidak pernah dikualifikasi dengan ukuran sampel, jumlah absolut, atau biaya kesalahan (G3).
4. **Konsep grain/unit analisis tidak pernah bernama** — reshape dan join diajarkan prosedural, tetapi pembelajar tidak diberi konsep "satu baris mewakili apa" yang mencegah denominator salah saat modelling (G15).
5. **Koneksi L0 → M1 tidak ada** — selain label modul "prasyarat M1" dan dua boundary box, tidak ada peta yang menunjukkan di mana tiap fondasi dipakai di M1–M9 (G16).
6. **Cakupan kuis tidak merata** — 30 soal ada, tetapi keputusan aplikasi (leakage, grain, randomisasi, interpretasi CI, keputusan bisnis mini-case) tidak pernah diuji (G1 + "Cek cakupan kuis").

---

## Daftar gap

### MUST-ADD — menghambat pemahaman M1 / membuat pembelajar salah menerapkan teknik bila tidak diisi

#### G1. Cakupan kuis: konsep aplikasi belum diuji — ⚠️ TER-FLAG ARTEFAK RINGKASAN
- **Lesson/section:** Semua lesson — checkpoint quiz
- **Klaim Luna:** Tidak ada checkpoint quiz sama sekali pada lima `.md`, padahal outline mensyaratkan minimal lima soal per lesson.
- **Hasil cek agen ke TS penuh:** Klaim ini **tidak berlaku untuk lesson web** — tiap lesson punya **6 soal checkpoint dengan `why`** di TS (`mlf-l01` baris 445–505; `mlf-l02` 357–417; `mlf-l03` 541–601; `mlf-l04` 326–387; `mlf-l05` 337–398). Yang hilang di `.md` hanyalah soalnya saat diringkas. **Tidak ada aksi "tambah 5 soal per lesson"** — kuis sudah memenuhi jumlah.
- **Yang BENAR-BENAR hilang (substansi yang dipertahankan):** cakupan kuis — konsep aplikasi berikut diajarkan tetapi tidak pernah diuji: keputusan band (10% → "unknown", band penyusutan varians 5%/10%), duplikat dekat, ambiguitas format tanggal, mitigasi log-then-mean, indikator missing / multiple imputation, winsorize vs hapus, band kurtosis / QQ-r / z-score, pilihan Box-Cox, checklist analysis-ready, wide-vs-long untuk modelling, dummy trap / drop-first, keputusan bisnis mini-case L0.5 (jangan luncurkan / jangan buang / perpanjang eksperimen), Bonferroni sebagai keputusan. Detail per lesson di bagian "Cek cakupan kuis".
- **Tambahan konkret:** Tambah 1–2 soal aplikasi per lesson dari daftar di "Cek cakupan kuis" (skenario + keputusan, bukan hafalan definisi). Bila perlu, ganti satu soal hafalan yang sudah ada.

#### G2. Missingness per kolom, per baris, dan pola gabungan — L0.1 §1, L0.2 §3–4, L0.4 §4 — HILANG
- **Yang hilang:** Prosedur eksplisit untuk membedakan **missingness per kolom**, **missingness per baris**, dan **pola gabungan antar-kolom**.
- **Verifikasi agen:** Formula missing rate L0.1 berbasis baris (per-baris, sudah diperbaiki DeepSeek F4). L0.2 §3 memecah missing rate menurut kelompok (late ≥2 vs <2: 62,5% vs 8,3%) — itu pemecahan menurut variabel, bukan prosedur per-kolom. Tidak ada hitungan missing rate per kolom, tidak ada missingness matrix/heatmap, tidak ada pembahasan "beberapa kolom kosong pada nasabah yang sama".
- **Mengapa penting:** Formula L0.1 berguna untuk keputusan tingkat record, tetapi keputusan membuang atau mengimputasi biasanya dibuat per variabel. Pemula dapat salah menyimpulkan bahwa missing rate global 15% berarti setiap kolom memiliki missing rate 15%, atau gagal melihat bahwa beberapa kolom kosong pada nasabah yang sama.
- **Tambahan konkret:** Prose + lab: (1) hitung missing rate per kolom; (2) hitung missing rate per baris; (3) buat missingness matrix/heatmap sederhana; (4) bandingkan pola missing berdasarkan kelompok yang teramati; (5) dokumentasikan keputusan pada level kolom dan baris. Gunakan angka yang sudah ada: file 20 pengajuan, income kosong 3 baris; angka tambahan bila diperlukan diberi label ilustrasi yang harus dihitung saat fill.

#### G3. Threshold band adalah heuristik, bukan hukum universal — L0.1 §1 dan L0.2 §3–4 — HILANG
- **Yang hilang:** Penjelasan bahwa **threshold 5%, 30%, 2%, dan 10% adalah heuristik**, bukan hukum universal, serta bagaimana mempertimbangkan ukuran sampel, biaya kesalahan, dan representativeness.
- **Verifikasi agen:** Grep TS: kata "heuristik" **0 kemunculan** di kelima lesson L0. Band disajikan sebagai aturan keputusan ("di bawah 5% — hapus; 5–30% — imputasi") tanpa satu kalimat pun yang mengualifikasi.
- **Mengapa penting:** Pembelajar dapat menerapkan band secara mekanis — misalnya selalu menghapus missing di bawah 5% atau selalu membuat kategori `unknown` pada 10% — padahal dampaknya bergantung pada ukuran data, populasi yang terdampak, dan apakah missing terkait target atau proses bisnis.
- **Tambahan konkret:** Tabel "threshold sebagai starting point, bukan keputusan otomatis" yang membandingkan: persentase; jumlah observasi absolut; mekanisme MCAR/MAR/MNAR; dampak bisnis/model; keputusan akhir dan alasannya. Tambah satu soal keputusan borderline yang memaksa pembelajar tidak hanya memakai persentase.

#### G4. Data leakage saat imputasi dan transformasi — L0.2 §3–4 dan L0.4 §4 — HILANG
- **Yang hilang:** **Data leakage saat imputasi dan transformasi**, terutama perbedaan antara fit pada training set dan apply pada validation/test/production.
- **Verifikasi agen:** Grep TS: "leakage", "sebelum split", "train" — **0 kemunculan** di kelima lesson L0. L0 mengajarkan imputasi (mean/median/mode/model), encoding, dan transformasi log tanpa pernah menyatakan bahwa parameter-parameter itu harus dihitung dari train saja.
- **Mengapa penting:** Ini prasyarat langsung M1. Jika mean/median, parameter log, kategori langka, atau model imputasi dihitung dari seluruh dataset sebelum split, informasi dari validation/test masuk ke training. Model dapat tampak lebih baik daripada performa sebenarnya. (M1 G3 mengajarkan leakage dari sisi evaluasi; aturan sisi preprocessing-nya tidak ada di mana pun.)
- **Tambahan konkret:** Figure pipeline: `raw data → split train/validation/test → fit cleaning/imputation/transform pada train → apply ke validation/test`. Lab kecil: (1) hitung median income hanya dari train; (2) gunakan median train untuk validation/test; (3) bandingkan dengan praktik salah yang menghitung median dari seluruh data; (4) minta pembelajar menjelaskan mengapa praktik kedua leakage. Hubungkan dengan M1 pada bagian "preprocessing sebelum modelling".

#### G5. Random assignment, unit eksperimen, dan validitas desain A/B — L0.5 §1–3 — HILANG
- **Yang hilang:** Mekanisme dasar A/B test: **random assignment, control/treatment, unit of randomization, independence, dan sample-ratio mismatch**.
- **Verifikasi agen:** Grep L0.5 TS: "random" / "acak" (di luar seed simulasi dan "goyangan acak") — **0 kemunculan**. Lesson mengasumsikan kelompok A (1.000 penawaran) dan B (1.000 penawaran) sudah ada, tanpa satu kalimat pun tentang bagaimana nasabah sampai ke A atau B.
- **Mengapa penting:** Perhitungan p-value dan power tidak menyelamatkan eksperimen yang tidak random. Jika nasabah dengan risiko tinggi lebih sering masuk B, selisih approval dapat berasal dari komposisi kelompok, bukan skor baru. Ini adalah prasyarat utama untuk menafsirkan hasil A/B.
- **Tambahan konkret:** Figure randomisasi populasi menjadi A dan B; prose tentang satu unit eksperimen — nasabah, aplikasi, atau transaksi; checklist pre-analysis: randomization, balance covariates, leakage antar-kelompok, dan sample-ratio mismatch; lab dengan pembagian A/B yang tidak seimbang untuk mengidentifikasi masalah desain. Gunakan contoh yang sudah ada: 1.000 penawaran per kelompok.

#### G6. Asumsi dan pemilihan uji untuk outcome selain binary approval rate — L0.5 §1–4 — HILANG
- **Yang hilang:** Asumsi dan pemilihan uji untuk outcome selain **binary approval rate**.
- **Verifikasi agen:** L0.5 hanya mengajarkan uji dua proporsi (z-test, p 0,0992) untuk approval rate. Tidak ada pemetaan ke outcome kontinu, count, time-to-event, atau observasi berulang.
- **Mengapa penting:** L0.5 mengajarkan uji dua proporsi, tetapi M1 dan proyek finance dapat menghasilkan outcome kontinu, count, time-to-event, atau repeated observations. Pemula dapat memakai uji proporsi untuk semua metric atau memperlakukan banyak transaksi dari nasabah yang sama sebagai observasi independen.
- **Tambahan konkret:** Peta singkat — bukan teori formal penuh — yang memetakan: binary outcome → comparison of proportions; continuous outcome → comparison of means/robust alternative; count/rate → count-rate method; repeated user-level observations → aggregate atau gunakan unit analisis yang tepat. Tekankan bahwa unit inferensi harus konsisten dengan unit randomisasi (lihat G5). Detail teori formal dapat dirujuk ke Track A.
- **Catatan prioritas (agen):** M1 sendiri tidak memakai A/B testing secara substantif (lihat GAP-LUNA-M1.md, "A/B testing: tidak muncul substantif di M1") — jadi "must" di sini adalah tentang toolkit analis, bukan kesiapan M1. Bila fill harus dipangkas, gap ini boleh turun ke SHOULD-ADD tanpa menghambat M1.

---

### SHOULD-ADD — memperkuat fondasi

#### G7. Aturan kerja entity resolution dan deduplikasi dekat — L0.1 §2, §4; L0.4 §2–3 — TIPIS
- **Yang hilang:** Aturan kerja untuk **entity resolution dan deduplikasi dekat**.
- **Verifikasi agen:** TS sudah membedakan duplikat persis vs dekat, dan memberi aturan satu kalimat: pakai kunci identitas (KTP yang sama + tanggal pengajuan berbeda = dua pengajuan yang sah), bila tidak ada kunci identitas bandingkan semua kolom dan tanyakan ke pemilik data (L0.1 TS:104). Istilah "candidate key" / "business key" tidak ada; tidak ada prosedur kerja untuk pasangan ambigu (nama sama tanggal berbeda; nama beda ejaan tapi ID sama; ID sama di periode berbeda).
- **Mengapa penting:** Lesson sudah membedakan duplikat persis dan duplikat dekat, tetapi belum mengajarkan cara menentukan apakah dua record adalah orang/nasabah yang sama, kapan menggabungkan, dan kapan mempertahankan keduanya. Ini sering muncul pada data aplikasi dan pembayaran.
- **Tambahan konkret:** Prose + lab dengan pasangan seperti: nama sama, tanggal berbeda; nama berbeda ejaan tetapi ID sama; ID sama muncul dua kali pada periode berbeda. Minta pembelajar menentukan candidate key, business key, dan kapan perlu eskalasi ke pemilik data. Jangan menambahkan angka baru; gunakan contoh file 20 pengajuan atau label ilustrasi.

#### G8. Penanganan format lokal, satuan, dan ambiguitas parsing secara operasional — L0.1 §3; L0.4 §4 — TIPIS
- **Yang hilang:** Penanganan **format lokal, satuan, dan ambiguitas parsing** secara operasional.
- **Verifikasi agen:** TS mengajarkan parsing "1.700.000" (dua tafsir, berbeda sejuta kali lipat) dan ambiguitas tanggal "12/03/2025" (12 Maret vs 3 Desember) + mitigasi "tulis formatnya di code, hitung yang gagal diparsing" (L0.1 TS:117–120). Yang tidak ada: tabel operasional "raw value → interpretasi → validasi" untuk persen vs desimal, mata uang berbeda, dan tanda negatif; ambiguitas tanggal juga tidak pernah diuji di kuis.
- **Mengapa penting:** Contoh `"1.700.000"` sudah mengajarkan parsing income, tetapi belum cukup membahas perbedaan pemisah ribuan/desimal, mata uang, tanggal, persen versus proporsi, dan tanda negatif. Kesalahan ini dapat menghasilkan data tampak valid tetapi nilainya salah.
- **Tambahan konkret:** Tabel "raw value → interpretasi → validasi" untuk: `"1.700.000"`; tanggal ambigu `"12/03/2025"`; persen versus desimal; nominal dengan mata uang berbeda. Tambah rule: jangan menebak format; cek metadata, rentang, dan sampel hasil parsing.

#### G9. Ketidakpastian imputasi — L0.2 §2–4 — TIPIS (dikoreksi dari HILANG)
- **Yang hilang:** Penjelasan tentang **ketidakpastian imputasi** dan kapan single imputation terlalu optimistis.
- **Verifikasi agen:** Konsekuensinya SUDAH dinyatakan satu kalimat di §4: "interval kepercayaan yang dihitung dari data yang sudah diimputasi tampak lebih sempit dari yang seharusnya" — dan multiple imputation disebut sebagai mitigasi ("teknik penuhnya di M6", TS:140). Yang tidak ada: framing konseptualnya — bahwa satu nilai pengisi diperlakukan seolah-olah diketahui dengan pasti — dan diagram yang membedakannya dari multiple imputation.
- **Mengapa penting:** Lesson sudah mengajarkan penyusutan varians, tetapi belum menjelaskan bahwa satu nilai pengisi memperlakukan nilai imputasi seolah-olah diketahui dengan pasti. Ini dapat membuat standard error dan confidence interval terlalu kecil, terutama ketika missing cukup banyak atau MAR/MNAR.
- **Tambahan konkret:** Diagram konseptual: observed values; single imputation sebagai titik tetap; multiple imputation sebagai beberapa dataset yang mencerminkan ketidakpastian. Tidak perlu mengajarkan algoritme multiple imputation secara penuh; cukup beri keputusan kapan perlu merujuk M6.

#### G10. MAR sebagai asumsi, bukan kesimpulan dari satu perbedaan — L0.2 §3 — TIPIS (dikoreksi dari HILANG)
- **Yang hilang:** Cara membedakan **MAR dari sekadar perbedaan deskriptif**, serta batas observabilitas MNAR.
- **Verifikasi agen:** Caveat MNAR SUDAH ada: "MNAR buruk dan tidak bisa dideteksi dari data yang teramati" + diuji kuis Q6 ("Kenapa MNAR tidak bisa dicek dari data yang teramati?"). Yang tidak ada: pembedaan bahwa perbedaan missing rate antar kelompok (62,5% vs 8,3%) adalah **bukti yang mendukung MAR, bukan bukti pasti MAR** — MAR adalah asumsi tentang mekanisme conditional missingness. Lab 2 justru menyimpulkan kategoris "kesimpulan MAR" dari perbedaan itu.
- **Mengapa penting:** Contoh dua kelompok menunjukkan perbedaan missing rate, tetapi pembelajar dapat menganggap satu perbedaan otomatis membuktikan MAR. MAR adalah asumsi tentang mekanisme conditional missingness, sedangkan pola data teramati hanya memberi bukti pendukung.
- **Tambahan konkret:** Prose: perbedaan missing rate menurut variabel teramati adalah diagnosis awal; tidak ada tes dari data teramati yang dapat membuktikan MNAR tidak terjadi; gunakan domain knowledge, proses bisnis, dan sensitivity analysis. Tambah kuis berbasis skenario yang meminta membedakan "bukti mendukung MAR" dari "bukti pasti MAR". Perbaiki kesimpulan Lab 2 dari "MAR" menjadi "konsisten dengan MAR".

#### G11. Shapiro–Wilk sebagai prosedur yang bisa dipakai — L0.3 §1 — TIPIS
- **Yang hilang:** **Shapiro–Wilk** disebut, tetapi tidak diajarkan sebagai prosedur yang bisa digunakan: input, output, interpretasi, dan keterbatasannya.
- **Verifikasi agen:** TS menyebut Shapiro-Wilk 8 kali — semuanya sebagai peringatan: p = 0,03 [ilustrasi] pada n = 30.000 menolak normal "tapi pada n sebesar itu, penyimpangan kecil pun menghasilkan p kecil. Selalu cek BESAR penyimpangannya (skewness, QQ), bukan hanya p-value-nya" (TS:50) + tip "cek QQ dulu, p-value belakangan" + kuis Q6. Tidak ada mini-lab yang menjalankan uji itu, tidak ada langkah "input → output → interpretasi". Outline spec §2 secara eksplisit menjanjikan Shapiro-Wilk sebagai salah satu alat cek normal — janji itu baru terpenuhi setengah.
- **Mengapa penting:** Outline secara eksplisit menjanjikan pemeriksaan normalitas dengan QQ plot, Shapiro–Wilk, skewness, dan kurtosis. Saat ini hanya ada satu kalimat ilustratif tentang p-value Shapiro–Wilk, tanpa langkah kerja atau output yang harus dilaporkan.
- **Tambahan konkret:** Mini-lab: (1) jalankan Shapiro–Wilk pada dataset kecil; (2) baca statistik dan p-value; (3) bandingkan dengan QQ plot dan skewness; (4) jelaskan mengapa pada n besar p-value dapat sangat sensitif. Pertahankan penekanan bahwa uji formal bukan satu-satunya dasar keputusan. Teori uji formal dapat dirujuk ke Track A.

#### G12. Kapan TIDAK melakukan transformasi — L0.3 §2–4 — TIPIS (dikoreksi dari HILANG)
- **Yang hilang:** Aturan kapan **tidak melakukan transformasi** dan konsekuensi interpretasi setelah transformasi secara lebih lengkap.
- **Verifikasi agen:** Biaya interpretasi SUDAH dinyatakan satu kalimat: "log mengubah interpretasi — koefisien model pada data log adalah efek persen, bukan efek rupiah" (§2). Ide "metode robust / tree-based tidak butuh normal" muncul hanya sebagai mitigasi outlier (§4: "pakai model robust (median, tree-based)"), bukan sebagai keputusan transformasi. Yang tidak ada: decision box "apakah model/metodeku membutuhkan asumsi distribusi?" dan pertanyaan "transformasi pada predictor saja atau juga target?".
- **Mengapa penting:** Lesson memberi prosedur log dan reflect + log, tetapi pembelajar dapat menganggap "lebih normal" selalu lebih baik. Transformasi dapat menyulitkan interpretasi, tidak cocok untuk semua model, dan tidak selalu dibutuhkan oleh model tree-based atau metode robust.
- **Tambahan konkret:** Decision box: apakah model/metode membutuhkan asumsi distribusi? apakah nilai memiliki nol/negatif? apakah interpretasi pada skala asli penting? apakah robust method cukup? apakah transformasi dilakukan hanya pada predictor atau juga target? Sertakan contoh dari lesson: BILL_AMT negatif sampai −165.580 dan efek log yang dibaca sebagai efek persen.

#### G13. Outlier global vs dalam kelompok vs influential observation — L0.3 §4 — HILANG
- **Yang hilang:** Pembedaan antara **outlier global, outlier dalam kelompok, dan influential observation**.
- **Verifikasi agen:** L0.3 §4 hanya mengajarkan IQR dan z-score global (15 transaksi, pagar 5,0/285,0). Tidak ada boxplot per kelompok, tidak ada konsep influence. Mini-case PAY_0 memang memecah menurut nilai PAY, tetapi tidak dibingkai sebagai deteksi outlier per kelompok.
- **Mengapa penting:** IQR dan z-score global dapat melewatkan nilai yang normal secara global tetapi ekstrem dalam segmen tertentu — misalnya nasabah dengan tipe produk berbeda. Sebaliknya, titik ekstrem tidak selalu memiliki pengaruh besar terhadap model.
- **Tambahan konkret:** Prose singkat + figure dua panel: boxplot global; boxplot per kelompok produk/risk segment. Tambah langkah kerja: deteksi → segmentasi → validasi bisnis → analisis pengaruh. Detail influence diagnostics dapat dirujuk ke materi model/Track A bila tersedia.

#### G14. Cardinality validation untuk join — L0.4 §2 — TIPIS (dikoreksi dari HILANG)
- **Yang hilang:** **Cardinality validation** untuk join secara eksplisit: one-to-one, one-to-many, many-to-one, dan larangan many-to-many yang tidak disengaja.
- **Verifikasi agen:** Peringatan fan-out SUDAH ada: "Satu id yang muncul dua kali di tabel B akan menggandakan baris A-nya (fan-out, bukan cartesian product)" + diuji kuis Q6. Yang tidak ada: kosakata kardinalitas, deklarasi expected relationship sebelum join, dan langkah agregasi kembali ke grain "satu baris per nasabah" setelah join one-to-many.
- **Mengapa penting:** Lesson sudah menyebut fan-out, tetapi belum memberi rule operasional. Join aplikasi dengan riwayat pembayaran biasanya one-to-many secara alami; jika tujuan akhirnya satu baris per nasabah, hasil harus diagregasi kembali. Kesalahan cardinality dapat menggandakan outcome dan membiasakan model.
- **Tambahan konkret:** Lab: deklarasikan expected relationship; cek keunikan key; lakukan join; hitung perubahan baris; agregasikan riwayat ke level nasabah bila diperlukan. Tambah kuis yang meminta memilih apakah hasil join masih berada pada grain "satu baris per nasabah".

#### G15. Grain / unit analisis dari raw data ke feature table — L0.4 §4 — HILANG
- **Yang hilang:** Konsep **grain/data level** dan konsistensi unit analisis dari raw data ke feature table.
- **Verifikasi agen:** Kata "grain" **0 kemunculan** di kelima lesson L0. Ide terkait ada secara implisit — L0.4 §1: "satu baris per nasabah" (wide) vs "satu baris per nasabah-bulan" (long); §4 checklist menanyakan "jumlah baris cocok dengan hitungan reshape dan join?" — tetapi tidak pernah ada konsep bernama "grain", tidak ada figure alur level, tidak ada pertanyaan "satu baris mewakili apa?" sebagai aturan kerja.
- **Mengapa penting:** Ini menghubungkan reshape, join, feature engineering, dan modelling. Tanpa konsep grain, pembelajar dapat mencampur baris nasabah, transaksi, dan bulan, lalu menghitung rata-rata atau target dengan denominator yang salah.
- **Tambahan konkret:** Figure: `transaction-level → customer-month → customer-level feature table`. Untuk setiap tahap, tuliskan: satu baris mewakili apa; key-nya apa; operasi agregasinya apa; apakah target sudah boleh digunakan. Gunakan contoh PAY_MEAN, PAY_DELAY_COUNT, dan BILL_MEAN dari cell 13.

#### G16. Peta eksplisit L0 → M1–M9 — Semua lesson, bagian "Koneksi ke modul berikutnya" — HILANG
- **Yang hilang:** Peta eksplisit **L0 → M1–M9** dan penjelasan di mana setiap fondasi dipakai.
- **Verifikasi agen:** Grep TS: rujukan ke M1–M9 di luar label modul "prasyarat M1" dan dua boundary box (L0.2 vs MLF2, L0.3 vs Track A/MLF2) — hanya penyebutan "teknik penuhnya di M2 dan M6" (imputasi model, TS L0.2:107) dan "teknik penuhnya di M6" (multiple imputation). Tidak ada peta koneksi, tidak ada satu paragraf pun yang menjelaskan di mana cleaning/imputasi/distribusi/wrangling/A-B testing dipakai di M1.
- **Mengapa penting:** Saat ini koneksi paling jelas hanya ke notebook credit scoring. Pembelajar belum melihat bahwa: cleaning dan imputasi memengaruhi feature preparation; distribusi/outlier memengaruhi pembacaan data dan residual/feature; wrangling membentuk modelling table; A/B testing membantu evaluasi perubahan proses/model, bukan hanya approval rate.
- **Tambahan konkret:** Satu halaman peta ringkas:

| Fondasi L0 | Pemakaian lanjutan |
|---|---|
| Cleaning | input validation, data preparation, reproducibility |
| Missing/imputation | preprocessing dan sensitivity analysis |
| Distribution/outlier | diagnosis feature dan pemilihan transformasi/robust summary |
| Wrangling | feature table, aggregation, join, time structure |
| A/B testing | evaluasi perubahan kebijakan atau model secara eksperimental |

Untuk M2–M9, cukup satu paragraf motivasi dan rujukan; jangan mengulang materi yang berada di modul tersebut.

---

### NICE-TO-HAVE

#### G17. Peta workflow L0 → notebook credit scoring — Semua lesson, mini-case dan guided task — TIPIS
- **Yang hilang:** Koneksi langkah demi langkah antara lima lesson dan **notebook credit scoring**.
- **Verifikasi agen:** Koneksi tersebar sudah ada per lesson: L0.1 mini-case audit cell 10 (0 kosong, 0 duplikat, EDUCATION 345, MARRIAGE 54, PAY negatif); L0.3 mini-case cell 8–9 (PAY_0, korelasi 0,325/−0,154); L0.4 mini-case cell 13 (PAY_MEAN, PAY_DELAY_COUNT, UTILIZATION). Yang tidak ada: satu figure "notebook map" yang menyatukannya menjadi workflow utuh + latihan memberi label lesson L0 pada tiap cell.
- **Mengapa penting:** Beberapa koneksi sudah disebut secara terpisah — misalnya 0 duplikat, PAY_0, dan fitur cell 13 — tetapi belum menjadi workflow utuh. Pembelajar belum diminta mengidentifikasi urutan: audit → cleaning → missing strategy → distribution check → wrangling/feature creation → evaluasi eksperimen.
- **Tambahan konkret:** Satu figure "notebook map" yang menunjuk: Cell 8–9: diagnosis distribusi dan hubungan target; Cell 10: audit cleaning; Cell 13: feature wrangling; bagian modelling: preprocessing dan evaluasi. Minta pembelajar memberi label lesson L0 yang relevan pada setiap cell.

#### G18. Practical significance dan kerangka keputusan go/no-go — L0.5 §2–4 — TIPIS (dikoreksi dari HILANG)
- **Yang hilang:** Kriteria **practical significance**, guardrail bisnis, dan keputusan go/no-go yang tidak hanya berdasarkan statistical significance.
- **Verifikasi agen:** Elemen-elemennya SUDAH ada tersebar: konsep "efek terkecil yang penting secara bisnis" (L0.5 TS:104, TS:135 — 2,5 poin penting karena bernilai Rp125 juta per 10.000 penawaran) dan mini-case yang mempraktikkan satu keputusan go/no-go (jangan luncurkan dari point estimate; jangan buang skornya; perpanjang eksperimen sampai n = 2.884). Yang tidak ada: tabel kerangka 4 sel sebagai aturan kerja yang bisa dipakai ulang.
- **Mengapa penting:** Mini-case sudah menerjemahkan efek ke rupiah, tetapi belum menyediakan kerangka keputusan yang mencakup biaya implementasi, risiko downside, minimum detectable/business effect, dan batas toleransi kerugian.
- **Tambahan konkret:** Decision table: statistically significant + practically meaningful; statistically significant tetapi terlalu kecil secara bisnis; tidak signifikan tetapi CI masih mencakup upside besar; CI mencakup downside material. Gunakan angka yang sudah ada pada mini-case: selisih 2,5 poin, CI −0,0047 sampai 0,0547, dan rentang −Rp23.500.000 sampai Rp273.500.000.

---

## Cek cakupan kuis

Kuis ADA (6 soal per lesson di TS, 30 total). Yang kurang adalah **cakupan aplikasi** — berikut lubang yang terverifikasi dari daftar soal TS:

- **L0.1** — Tidak diuji: keputusan duplikat dekat (KTP sama + tanggal berbeda = dua pengajuan sah); definisi missing rate per baris; ambiguitas format tanggal ("12/03/2025"); keputusan band 10% → jadikan "unknown" (Q2 hanya menguji kasus 1,15% → biarkan).
- **L0.2** — Tidak diuji: mitigasi log-then-mean (disebut di §1, tidak pernah diuji); MCAR (Q3 hanya menguji deteksi MAR); keputusan band penyusutan varians 5%/10% (Q2 menanyakan angka 20%-nya, bukan aksi bandnya); pilihan indikator missing / multiple imputation.
- **L0.3** — Tidak diuji: winsorize vs hapus; band kurtosis (|excess| < 1); pembacaan band korelasi QQ; band z-score; pilihan Box-Cox.
- **L0.4** — Tidak diuji: checklist analysis-ready (5 item); wide-vs-long untuk modelling; dummy trap / drop-first; ketidakcocokan tipe kunci ("001" string vs 1 integer).
- **L0.5** — Tidak diuji: keputusan bisnis mini-case (jangan luncurkan / jangan buang / perpanjang eksperimen); Bonferroni sebagai keputusan (Q6 menanyakan angka FWER 0,2262, bukan alpha 0,01 sebagai aksi).

Tiga prinsip saat mengisi (dari Luna, disetujui agen):

1. **Konsep aplikasi belum diuji:** threshold keputusan, leakage, grain join, randomization, unit eksperimen, dan interpretasi CI.
2. **Hafalan perlu dihindari:** jangan hanya menanyakan definisi MCAR/MAR atau rumus IQR; berikan tabel/plot/skenario dan minta keputusan.
3. **Jawaban harus dapat diturunkan dari lesson:** bila soal meminta metode yang belum diajarkan — misalnya detail algoritme multiple imputation atau teori sequential testing — soal harus dibatasi pada pengenalan konsep dan diarahkan ke modul lanjutan.

---

## Koneksi yang masih perlu diperjelas

### L0 → M1

Gap paling kritis adalah preprocessing leakage (G4), grain/cardinality (G14–G15), dan randomization/metric design bila M1 menggunakan evaluasi eksperimen (G5–G6). Tambahkan cross-reference konkret pada titik workflow M1, bukan hanya daftar modul.

### L0 → notebook credit scoring

Koneksi yang tersedia sudah cukup sebagai contoh, tetapi belum berbentuk peta workflow. G17 mengusulkan pemetaan cell audit, diagnosis PAY_0, feature engineering cell 13, dan tahap modelling.

### L0 → Track A

Jangan mengulang teori distribusi atau uji formal. Yang perlu ditambahkan hanya: kapan memakai QQ plot, skewness, kurtosis, atau Shapiro–Wilk; bagaimana membaca output; kapan merujuk Track A untuk teori formal. Ini terutama tercakup pada G11 dan G12.

---

## Cek overlap / duplikasi

Materi berikut **sengaja tidak diajukan** sebagai gap:

- Teori distribusi formal, teori uji formal, dan derivasi statistik mendalam — sudah berada di Track A.
- Mean/median/CI sebagai alat baca hasil model di MLF2 — L0 hanya perlu mengajarkan mekanisme data dan keputusan preprocessing.
- Kalibrasi, scorecard, WoE, IV, vintage, roll-rate, IFRS 9, dan reject inference — scope M2.
- Clustering/fraud, VaR/GARCH, tuning, fairness/SHAP/monitoring, validasi model, Monte Carlo, backtesting, dan bootstrap — berada di M3–M9.
- Penambahan materi Indonesia/OJK/SLIK/P2P secara luas — tidak diwajibkan; contoh finance global yang sudah ada cukup.
- Perbaikan angka, rumus, label, urutan, atau kontradiksi yang termasuk 25 temuan DeepSeek — tidak dihitung sebagai gap.
- Penambahan figure untuk diagnosis normal, right-skew, left-skew, dan outlier — semuanya sudah memiliki figure masing-masing dalam lesson (aturan figure L0.3 terpenuhi). Gap yang tersisa adalah penggunaan figure tersebut dalam prosedur/keputusan, bukan kekurangan figure dasar.

---

## Ringkasan jumlah gap

| Prioritas | Jumlah (klaim Luna) | Jumlah (setelah verifikasi) |
|---|---:|---:|
| MUST-ADD | 6 | 5 (G1 artefak — substansinya jadi bagian "Cek cakupan kuis") |
| SHOULD-ADD | 10 | 10 |
| NICE-TO-HAVE | 2 | 2 |
| **Total** | **18** | **17 gap untuk diisi** |

---

## Top 5 must-add (terurut, setelah verifikasi)

1. **G4 — Data leakage saat imputasi/transformasi** — fit pada train, apply ke test; figure pipeline + lab median-train vs median-seluruh-data.
2. **G5 — Random assignment, unit eksperimen, dan validitas desain A/B** — tanpa ini p-value dan power L0.5 tidak punya fondasi.
3. **G2 — Missingness per kolom, per baris, dan pola gabungan** — keputusan imputasi dibuat per variabel, bukan dari satu angka global.
4. **G3 — Threshold band sebagai heuristik** — band 5%/30% dan 2%/10% tidak pernah dikualifikasi; pembelajar akan memakainya mekanis.
5. **G6 — Peta pemilihan uji untuk outcome non-binary** — dengan catatan agen: M1 tidak memakai A/B testing secara substantif, jadi bila fill dipangkas, gap ini boleh turun ke SHOULD-ADD.
