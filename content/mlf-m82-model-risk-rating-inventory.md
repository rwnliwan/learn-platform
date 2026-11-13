# MLF-M8.2: Model Risk Rating & Inventory — Tidak Semua Model Sama Berbahayanya

## Masalah: Dua Model, Dua Nasib

Di meja risk manager ada dua model. Model pertama adalah scorecard kredit flagship: GBM terkalibrasi Platt/sigmoid, threshold 0,10, memutuskan 6.000 pengajuan di test — menyetujui 1.710 nasabah (28,5%) dengan bad rate 6,67% [notebook]. Di balik 1.710 persetujuan itu ada LIMIT_BAL yang disetujui sebesar NT$424.180.000 dan expected loss NT$11.989.453 [notebook]. Model kedua adalah model churn marketing: memprediksi pelanggan mana yang mungkin berhenti langganan, supaya tim marketing mengirim promo. Model kedua tidak memutuskan satu rupiah pun kredit — keputusan terburuknya adalah promo yang dikirim ke orang yang salah.

Apakah kedua model itu pantas mendapat pengawasan yang sama? Tidak — dan lesson ini tentang cara menjawab «seberapa besar pengawasan» dengan angka, bukan dengan firasat: INVENTORY (daftar semua model) dan TIERING (rating risiko tiap model — Tier 1, 2, atau 3 — yang menentukan seberapa dalam validasinya, seberapa sering ditinjau, dan siapa yang menandatangani).

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05. Angka materiality [notebook, m8_tiering]: total LIMIT_BAL test NT$1.007.777.680; approved LIMIT_BAL NT$424.180.000 (42,09% dari total); expected loss approved NT$11.989.453; expected loss seluruh test NT$78.675.378; realised loss approved NT$11.695.500; margin approved NT$19.909.500; laba bersih approved NT$8.214.000; total cost pada threshold 0,10 NT$33.046.500 [M6.4].

Satu peringatan skala yang WAJIB dipegang sepanjang lesson: test 6.000 adalah sampel stratified 1/5 dari data 30.000 baris — BUKAN buku live. Untuk menskala ke buku penuh, kalikan angka test dengan (ukuran buku / 6.000). Angka-angka lesson ini adalah angka SAMPEL, bukan angka buku live.

---

## 1. Dua Model, Dua Nasib: Satu Memutuskan Limit Miliaran, Satu Membuat Laporan Internal

**Nilai:** rating risiko adalah cara bank menjawab pertanyaan «model mana yang boleh salah, dan model mana yang tidak boleh?» dengan tertib. Tanpa rating, semua model diperlakukan sama — yang berbahaya kurang diawasi, yang sepele diawasi berlebihan, dan waktu validasi habis untuk model yang salah.

**Baik/buruk:** scorecard flagship dengan ROC-AUC GBM mentah 0,7823 (model keputusan terkalibrasi: 0,7816) itu bagus sebagai MODEL — ranking-nya kuat. Buruk bila angka itu dibaca sebagai «model ini aman»: ROC-AUC tidak berkata apa-apa tentang berapa uang yang dipertaruhkan. Model dengan ROC-AUC yang sama bisa Tier 1 atau Tier 3 — yang membedakan adalah dampak keputusannya, bukan akurasinya.

**Mitigasi:** sebelum model apa pun naik ke produksi, tulis dulu dua baris: (1) berapa uang yang diputuskan model ini, dan (2) tier berapa ia. Dua baris itu — bukan ROC-AUC — yang menentukan seberapa dalam validasi yang ia butuhkan.

---

## 2. Inventory: Daftar Semua Model — Tanpa Daftar, Tidak Ada Governance

Inventory adalah daftar LENGKAP semua model yang dipakai organisasi — hidup, bayangan (shadow-mode: model yang berjalan berdampingan dengan model live tanpa mengambil keputusan — keputusannya dicatat, tidak dijalankan), maupun pensiun. Satu baris per model, dengan kolom minimum: nama dan ID model; PEMILIK (satu nama orang, bukan tim); versi; TUJUAN dan keputusan yang diambilnya; data input; output; TIER; tanggal validasi terakhir; tanggal review berikutnya; status (live / shadow / retired).

Tanpa inventory, yang terjadi adalah MODEL TAK TERDAFTAR: model yang dipakai seseorang tanpa ada yang tahu — spreadsheet scoring buatan analis yang dipakai cabang untuk menyetujui kredit kecil; notebook churn yang tiba-tiba dipakai marketing untuk menentukan siapa yang dapat diskon besar; model lama yang «sudah pensiun» tapi querynya masih jalan di produksi. Model-model ini tidak punya pemilik, tidak punya tier, tidak pernah divalidasi — dan ketika salah satunya merugikan, tidak ada yang bisa menjawab «model apa yang memutuskan ini?».

**Nilai:** inventory bagus karena ia mengubah governance dari «kami rasa semua model sudah diawasi» menjadi «ini daftarnya — 12 model, 3 Tier 1, 5 Tier 2, 4 Tier 3 — dan ini tanggal review masing-masing».

**Baik/buruk:** inventory bagus bila ia HIDUP — diperbarui setiap kali model baru naik, model lama pensiun, atau penggunaan model berubah. Buruk bila ia dibuat sekali untuk audit lalu dibiarkan membusuk. Buruk juga bila pemiliknya ditulis sebagai tim («Tim Data») — pemilik yang tidak bernama adalah pemilik yang tidak bisa dimintai pertanggungjawaban.

**Mitigasi:** satu orang ditunjuk sebagai penjaga inventory; setiap deployment baru WAJIB mendaftarkan modelnya sebelum live (tanpa baris inventory, tidak ada deployment); setiap kuartal, inventory dicocokkan dengan log produksi — model yang jalan tapi tidak terdaftar dicatat sebagai temuan.

---

## 2a. Risiko Agregat: Satu Komponen Bersama Bisa Menjatuhkan Tiga Model Sekaligus

Inventory mencatat model satu per satu — tapi risiko tidak selalu tinggal di dalam satu model. Tiga kolom baru: **shared_dependency** (komponen apa yang dipakai bersama, siapa pemiliknya), **downstream_models** (model apa yang memakai output model ini), **aggregate_exposure** (jumlah exposure semua model yang bergantung pada komponen itu), dan **concentration_flag**.

Tiga komponen bersama di sistem kita: **feature pipeline [M6.2]** (delapan fitur turunan flagship + churn + fraud), **kalibrasi Platt [M6.4]** (satu fungsi kalibrasi untuk threshold, EL, dan EL rate), **snapshot UCI 30.000** (melatih flagship, mengukur fairness [M7], memvalidasi [M8.1]). Bila feature pipeline rusak diam-diam, yang dipertaruhkan bukan hanya flagship (approved limit NT$424.180.000, EL NT$11.989.453) — tapi juga seluruh alert triase fraud [ilustrasi] dan keputusan promo churn [ilustrasi]. Angka agregat di luar flagship adalah [ilustrasi]: yang diajarkan adalah CARA menjumlahkannya, bukan jumlahnya.

**Concentration_flag ditegakkan bila:** (a) ≥2 model Tier 1 bergantung pada satu komponen yang sama; (b) aggregate exposure melewati band materiality tertinggi; (c) single point of failure TANPA fallback (G7, M8.4). Bila flag ditegakkan, komponen bersama itu diperlakukan sebagai komponen Tier 1-kritis — tier-nya setidaknya setinggi dependen tertingginya. Munculnya shared dependency baru adalah pemicu re-tiering event-driven.

---

## 3. Tier 1, 2, 3: Rating Risiko dan Konsekuensinya

Tiering adalah RATING RISIKO tiap model — Tier 1 (risiko tertinggi), Tier 2 (menengah), Tier 3 (terendah). Tier BUKAN nilai kualitas model: Tier 1 tidak berarti «model terbaik», dan Tier 3 tidak berarti «model jelek». Tier berarti «seberapa besar pengawasan yang model ini butuhkan».

Konsekuensi tiap tier [kebijakan lesson ini]: Tier 1 — validasi independen PENUH sebelum live dan review tahunan; sign-off oleh Chief Risk Officer (CRO); monitoring harian/mingguan — PSI skor dan approval rate tanpa label (bisa harian), bad rate dan ECE setelah label matang (jendela 1 bulan [M7.5]); model card lengkap (M8.3); champion-challenger wajib sebelum model baru menggantikan yang lama (M8.1). Tier 2 — validasi independen dengan cakupan yang lebih ringan dan review tiap 2 tahun; sign-off oleh Head of Risk; monitoring mingguan/bulanan. Tier 3 — self-assessment terdokumentasi oleh pemilik model dan review tiap 3 tahun atau saat ada perubahan; sign-off oleh pemilik model; monitoring bulanan/kuartalan.

**Nilai:** tiering bagus karena ia MEMPRIORITASKAN sumber daya yang langka. Validasi independen yang mendalam itu mahal — tanpa tiering, validator menghabiskan minggu yang sama untuk model laporan internal dan untuk scorecard kredit.

**Baik/buruk:** tiering bagus bila tier-nya DITULIS dengan alasan (skor dan angka — langkah 7) sehingga orang lain bisa mengauditnya. Buruk bila tier ditetapkan dari perasaan («model ini kelihatannya penting») — karena perasaan tidak bisa diaudit. Buruk juga bila semua model diberi Tier 1 «supaya aman»: bila semua Tier 1, tidak ada prioritas.

**Mitigasi:** tetapkan tier dari SKOR (langkah 7) dengan bobot dan ambang yang ditulis dulu; simpan skor + alasan di inventory; dan tinjau tier setiap tahun (langkah 8).

---

## 4. Risiko Inheren vs Residual: Kontrol Menurunkan yang Kedua, Bukan yang Pertama

RISIKO INHEREN adalah risiko model SEBELUM kontrol apa pun: seberapa besar dampaknya bila model ini salah, dilihat dari materiality (berapa uang yang diputuskan) dan kompleksitas (seberapa sulit model ini dipahami dan diawasi). RISIKO RESIDUAL adalah risiko yang TERSISA setelah kontrol dipasang: validasi independen, monitoring [M7.5], threshold yang diturunkan dari biaya [M6.4], champion-challenger (M8.1), dan limit/otorisasi manusia.

Aturan yang paling penting di lesson ini: TIER DITETAPKAN DARI RISIKO INHEREN, bukan residual. Scorecard flagship kita tetap Tier 1 walau sudah dipasangi monitoring harian, kalibrasi Platt, dan champion-challenger — karena bila SEMUA kontrol itu gagal sekaligus, yang dipertaruhkan tetap NT$424.180.000 limit dan NT$11.989.453 expected loss. Tier hanya turun bila materiality atau kompleksitasnya sendiri yang turun — misalnya limit yang diputuskan mengecil, atau model diganti dengan yang lebih sederhana.

**Nilai:** pemisahan ini bagus karena ia mencegah logika berbahaya «model ini sudah dimonitor ketat, jadi tier-nya boleh turun». Monitoring ketat DIPASANG karena tier-nya tinggi — monitoring bukan alasan untuk menurunkan tier.

**Baik/buruk:** membedakan inheren dan residual itu bagus karena ia memberi DUA pertanyaan yang berbeda untuk dua keputusan yang berbeda — «seberapa berbahaya model ini?» (inheren → tier) dan «apakah kontrol kita cukup?» (residual → apakah validasi/monitoring perlu diperkuat). Buruk bila keduanya dicampur: «risiko model ini rendah karena sudah divalidasi» mencampur tier dengan kontrol — validasi adalah KONTROL, bukan pengurang tier.

**Mitigasi:** di inventory, tulis tier dari inheren — dan di kolom terpisah, tulis penilaian kontrol (kuat/cukup/lemah) beserta buktinya (tanggal validasi terakhir, PSI skor terakhir [M7.5], temuan yang masih terbuka).

---

## 5. Materiality: Berapa Besar Dampaknya Bila Model Ini Salah

Untuk scorecard kredit, ukurannya adalah LIMIT yang diputuskan dan EXPECTED LOSS yang melekat padanya. Angka flagship [notebook, m8_tiering]: total LIMIT_BAL test NT$1.007.777.680; model MENYETUJUI NT$424.180.000 (42,09% dari total limit — 1.710 dari 6.000 nasabah, 28,5% [notebook]); expected loss atas yang disetujui NT$11.989.453. Expected loss dihitung dari probabilitas TERKALIBRASI — Σ p_cal × LGD × LIMIT_BAL atas nasabah yang disetujui, LGD 0,45, EAD = LIMIT_BAL.

$$\\mathrm{EL}_{\\text{approved}} = \\sum_{i \\in \\text{approved}} p_{\\text{cal},i} \\times \\mathrm{LGD} \\times \\mathrm{LIMIT\\_BAL}_i, \\qquad \\mathrm{LGD} = 0{,}45, \\quad \\mathrm{EAD} = \\mathrm{LIMIT\\_BAL}$$

Bacalah angka-angka itu sebagai TIGA lapis. Lapis pertama — EXPOSURE: NT$424.180.000 limit disetujui; rata-rata NT$248.058 per nasabah yang disetujui (dari rata-rata limit test NT$167.963). Lapis kedua — EXPECTED LOSS: NT$11.989.453, atau 2,83% dari limit yang disetujui (EL rate approved 0,0283), atau rata-rata NT$7.011 per nasabah yang disetujui. Lapis ketiga — PERBANDINGAN: EL seluruh test (bila SEMUA disetujui) adalah NT$78.675.378; EL approved hanya 15,24% dari jumlah itu — artinya model, dengan threshold 0,10 [M6.4], MENAHAN NT$66.685.925 expected loss (EL atas yang ditolak) dari buku. Angka itu adalah EL BRUTO yang dihindari secara counterfactual — BUKAN nilai bersih model: nilai bersihnya vs threshold 0,50 adalah NT$27.208.456, dan margin nasabah baik yang ditolak belum dikurangkan dari angka ini.

Bandingkan EL dengan yang TERJADI (realised): realised loss approved NT$11.695.500 — EL NT$11.989.453 hanya NT$293.953 di atas realised (2,51% dari realised loss; bila dihitung dari EL, 2,45%). Margin approved NT$19.909.500 (5% dari exposure nasabah non-default: 0,05 × NT$398.190.000; realised loss NT$11.695.500 = 0,45 × NT$25.990.000) dikurangi realised loss menghasilkan laba bersih approved NT$8.214.000 [M6.4]; total cost pada threshold 0,10 adalah NT$33.046.500 [M6.4] — total cost ini adalah biaya portofolio (bukan pengurang margin di atas); laba bersih = margin − realised loss, bukan margin − total cost. Semua angka ini di test 6.000 — skala ke buku penuh 30.000 dengan mengalikan 5: approved limit menjadi NT$2.120.900.000 dan EL approved NT$59.947.265 (lab 1).

**Nilai:** materiality bagus karena ia mengubah debat abstrak («model ini penting») menjadi angka yang bisa dibandingkan antar-model — dan angka yang sama menjadi input skor tiering (langkah 7).

**Baik/buruk:** EL dari probabilitas terkalibrasi itu bagus karena ia jujur — probabilitas 0,10 sungguh berarti peluang default 10% (ECE test 0,0087 [M6.4]). Buruk bila EL dihitung dari probabilitas MENTAH yang mis-kalibrasi: EL-nya akan salah sebesar kesalahan kalibrasinya, dan tier yang ditetapkan dari EL itu ikut salah. Buruk juga bila materiality hanya dihitung SEKALI: limit naik, threshold berubah, populasi bergeser — semuanya menggerakkan EL.

**Mitigasi:** hitung materiality dari probabilitas TERKALIBRASI (bukan mentah), laporkan ketiganya — exposure, EL, dan EL sebagai pangsa dari EL seluruh populasi — dan hitung ulang tiap kali threshold, limit, atau populasi berubah secara material.

---

## 6. Matriks Exposure × Kompleksitas: Peta Tiering dalam Satu Gambar

Matriks 2D lesson ini memetakan dua sumbu: sumbu horizontal EXPOSURE/MATERIALITY (rendah → tinggi), sumbu vertikal KOMPLEKSITAS (rendah → tinggi). Sembilan sel dipetakan ke tiga tier [kebijakan lesson ini] dari JUMLAH LEVEL kedua sumbu (rendah=0, sedang=1, tinggi=2): Tier 1 bila jumlah level ≥ 3; Tier 2 bila jumlah level = 2; Tier 3 bila jumlah level ≤ 1. Jadi Tier 1 di sudut kanan-atas (tiga sel: exposure tinggi × kompleksitas sedang/tinggi, dan kompleksitas tinggi × exposure sedang); Tier 3 di sudut kiri-bawah (tiga sel: keduanya rendah, atau satu rendah + satu sedang); Tier 2 di antaranya (tiga sel diagonal, jumlah level = 2). Flagship duduk di sel (exposure TINGGI, kompleksitas SEDANG) — materiality M=3 dari approved limit NT$424,18 juta, kompleksitas C=2 karena GBM tunggal — dan sel itu Tier 1.

Kenapa dua sumbu? Exposure tinggi + kompleksitas RENDAH (aturan skor sederhana yang memutuskan limit miliaran) tetap berbahaya — dampak keputusannya besar dan kesalahannya berskala besar. Exposure rendah + kompleksitas TINGGI (deep learning untuk laporan internal) juga butuh pengawasan lebih dari Tier 3 — karena tidak ada yang bisa menjelaskan kenapa model itu memutuskan begitu, sehingga kesalahannya sulit dideteksi. (Matriks menempatkannya di Tier 2 — jumlah level 0 + 2 = 2 — tetapi skor yang mengikat berkata Tier 3: M=0, C=4, B=0 → 1,20; lihat mitigasi di bawah.)

**Nilai:** matriks bagus karena ia memaksa DUA pertanyaan sebelum memberi tier — «berapa besar dampaknya?» DAN «seberapa sulit model ini diawasi?» — dan karena ia membuat tier BISA DIPERDEBATKAN: dua orang yang tidak sepakat bisa menunjuk sel yang berbeda dan berdebat soal sumbu mana yang salah dinilai.

**Baik/buruk:** matriks 3×3 bagus karena ia SEDERHANA — sembilan sel cukup untuk memisahkan prioritas tanpa berpura-pura presisi. Buruk bila dibaca sebagai pengukuran yang persis: batas antara «sedang» dan «tinggi» adalah keputusan kebijakan (langkah 7), bukan konstanta alam.

**Mitigasi:** pakai matriks sebagai LANGKAH PERTAMA (di sel mana model ini jatuh?), lalu hitung SKOR (langkah 7) sebagai langkah kedua yang menuliskan alasannya dengan angka. Bila matriks dan skor tidak sepakat, SKOR YANG MENGIKAT: matriks adalah saringan kasar, skor adalah perhitungan yang mengikat. Contoh: deep learning untuk laporan internal — matriks berkata Tier 2 (jumlah level 2), skor berkata Tier 3 (1,20) — tier-nya Tier 3.

---

## 7. Skor Tiering: Bobot Ditulis Dulu, Tier Dihitung — Bukan Ditebak

Kebijakan skor lesson ini [kebijakan lesson ini — bobot dan ambang dipilih eksplisit di sini, bukan konstanta alam]: tiga komponen, masing-masing 0–4. M = MATERIALITY, dari approved LIMIT_BAL: di bawah NT$50 juta → 0; NT$50 juta ≤ limit < NT$150 juta → 1; NT$150 juta ≤ limit < NT$300 juta → 2; NT$300 juta ≤ limit < NT$600 juta → 3; limit ≥ NT$600 juta → 4. C = COMPLEXITY: 0 aturan bisnis/rule-based; 1 regresi logistik; 2 GBM tunggal; 3 ensemble/stacked; 4 deep learning atau data tidak terstruktur. B = BREADTH (berapa banyak keputusan): 0 laporan internal sesekali; 1 di bawah 100 keputusan/bulan; 2 sebanyak 100–1.000/bulan; 3 sebanyak 1.000–10.000/bulan; 4 di atas 10.000/bulan. Skor = 0,50×M + 0,30×C + 0,20×B. Tier: skor ≥ 2,5 → Tier 1; 1,5 ≤ skor < 2,5 → Tier 2; skor < 1,5 → Tier 3.

$$\\text{Skor} = 0{,}50 \\times M + 0{,}30 \\times C + 0{,}20 \\times B, \\qquad \\begin{array}{ll} \\text{Skor} \\ge 2{,}5 & \\text{Tier 1} \\\\ 1{,}5 \\le \\text{Skor} < 2{,}5 & \\text{Tier 2} \\\\ \\text{Skor} < 1{,}5 & \\text{Tier 3} \\end{array}$$

Flagship: M=3 (approved limit NT$424,18 juta jatuh di band NT$300–600 juta [notebook]); C=2 (GBM tunggal); B=3 [ilustrasi — 6.000 aplikasi per periode di test, dipakai sebagai laju keputusan per periode]. Skor = 0,50×3 + 0,30×2 + 0,20×3 = 1,50 + 0,60 + 0,60 = 2,70 → Tier 1. Catatan sensitivitas [ilustrasi]: M dan B dihitung dari skala sampel (approved limit NT$424,18 juta; 6.000 aplikasi per periode) — bila keduanya dihitung dari buku penuh (total limit test NT$2.120.900.000; laju keputusan diskalakan), M=4 dan B=4 → skor 3,40 — tetap Tier 1; tier flagship tidak bergantung pada pilihan skala ini. Materiality mendapat bobot TERBESAR (0,50) — karena uang yang dipertaruhkan adalah penentu utama risiko.

**Nilai:** skor bagus karena ia membuat tier DAPAT DIAUDIT. Bila seseorang tidak setuju flagship Tier 1, ia harus menunjukkan komponen mana yang salah — «M seharusnya 2, bukan 3» — dan perdebatan itu bisa diselesaikan dengan angka.

**Baik/buruk:** skor tertimbang bagus karena ia memaksa ketiga sumbu dinilai. Buruk bila skor dibaca sebagai presisi palsu: 2,70 vs 2,49 terlihat berbeda jauh (Tier 1 vs Tier 2) padahal selisihnya 0,21 — satu komponen yang dinilai satu tingkat berbeda. Di dekat ambang, skor adalah sinyal untuk BERDISKUSI, bukan vonis otomatis.

**Mitigasi:** tulis bobot dan ambang di kebijakan, simpan tiap komponen (M, C, B) di inventory bersama tier-nya, dan tetapkan aturan: skor dalam 0,1 dari ambang → peninjauan manual oleh risk manager.

---

## 8. Re-Tiering: Kapan Rating Berubah — dan Siapa yang Memutuskan

RE-TIERING terjadi karena DUA pemicu. Pertama, TERJADWAL: tiap tahun, bersamaan dengan review tahunan Tier 1 (atau tiap 2–3 tahun untuk Tier 2/3). Kedua, EVENT-DRIVEN: (1) PENGGUNAAN BARU — model yang tadinya untuk laporan internal kini dipakai untuk keputusan kredit; (2) EXPOSURE MELEWATI BAND — approved limit naik dari band NT$150–300 juta ke NT$300–600 juta, sehingga M naik satu tingkat; (3) TEMUAN VALIDASI MATERIAL; (4) DRIFT BESAR yang bertahan — PSI skor di atas 0,25 [kebijakan lesson ini] atau kalibrasi yang rusak (ECE di atas 0,02 [kebijakan lesson ini]); sebagai perbandingan, PSI skor chunk 1 vs chunk 5 di M7.5 hanya 0,0161 — jauh di bawah ambang ini. PSI tanpa label bisa dibaca harian; ECE dan bad rate butuh label matang (jendela 1 bulan [M7.5]); (5) INSIDEN KERUGIAN; (6) PERUBAHAN REGULASI.

Contoh dari angka lesson: flagship hari ini M=3 (approved limit NT$424,18 juta). Bila buku tumbuh dan approved limit melewati NT$600 juta, M menjadi 4 — skor naik dari 2,70 ke 3,20, tetap Tier 1 (tapi validasi tahunannya harus lebih dalam). Bila threshold dinaikkan sehingga approved limit jatuh ke band NT$150–300 juta, M menjadi 2 — skor turun ke 2,20 → Tier 2. Tier TURUN di sini karena MATERIALITY-nya sendiri yang turun — bukan karena kontrol. Model Tier 3 yang tiba-tiba dipakai untuk keputusan kredit NAIK tier-nya seketika — penggunaan baru adalah pemicu re-tiering yang paling sering terlewat.

**Nilai:** re-tiering bagus karena ia menjaga tier tetap JUJUR terhadap dunia yang berubah. Model yang tier-nya tidak pernah ditinjau akan berakhir dengan tier yang salah di kedua arah.

**Baik/buruk:** re-tiering terjadwal bagus karena ia mencegah tier membusuk diam-diam. Buruk bila re-tiering hanya terjadwal dan tidak event-driven: model yang penggunaannya berubah di tengah tahun tidak boleh menunggu review tahunan untuk naik tier. Dan buruk bila re-tiering diputuskan oleh pemilik model sendiri tanpa peninjau independen — pemilik model punya insentif untuk MENURUNKAN tier modelnya.

**Mitigasi:** tulis enam pemicu event-driven di kebijakan; setiap perubahan penggunaan model WAJIB dilaporkan ke penjaga inventory dalam 5 hari kerja [kebijakan lesson ini]; dan catat setiap re-tiering — tanggal, pemicu, skor lama vs baru, dan siapa yang menyetujui — di inventory.

---

## 8a. Model Vendor: yang Membeli Tetap Pemilik — dan Perubahan Vendor adalah Re-Tiering

Model vendor TETAP butuh owner internal (satu nama orang — vendor tidak bisa menjadi owner), TETAP masuk inventory, dan TETAP punya tier — mengikuti keputusan yang ia beri makan: skor vendor yang dipakai sebagai fitur flagship adalah Tier 1.

**Intake checklist (10 item, sebelum satu keputusan pun):** (1) owner internal; (2) model/version identifier yang DIPIN (bukan «model terbaru»); (3) input-output contract (schema, definisi fitur, satuan, arti output); (4) validation evidence — bukti vendor DITAMBAH validasi internal atas data kita; (5) SLA (uptime, latency, waktu respons insiden); (6) incident notification — vendor WAJIB memberitahu perubahan/bug dalam jangka waktu tertulis [kebijakan organisasi]; (7) audit rights + akses log; (8) data residency; (9) fallback/exit plan; (10) re-tiering tiap perubahan versi vendor.

**Mini-case [ilustrasi]:** bank memakai «CreditScore-as-a-Service» sebagai fitur ke-32 flagship. Intake lengkap — kecuali versi tidak dipin dan incident notification tidak ada di kontrak. Enam bulan kemudian vendor mengganti definisi skor (dari «peluang default 12 bulan» menjadi «peluang default 6 bulan») tanpa pemberitahuan: distribusi fitur ke-32 bergeser diam-diam, threshold 0,10 menolak terlalu banyak nasabah bagus, dan tidak ada alert yang berbunyi (monitoring [M7.5] memantau skor akhir, bukan tiap fitur input). Yang menangkapnya adalah validation halves di revalidasi — enam bulan kemudian. Yang paling berbahaya dari model vendor bukan modelnya — melainkan PERUBAHAN modelnya yang tidak kamu ketahui.

---

## 9. Jebakan Tiering: Menilai Nama Model, Bukan Dampak Keputusannya

Jebakan pertama dan paling umum: tiering dari NAMA atau KOMPLEKSITAS model, bukan dari dampak keputusannya. «GBM itu kompleks, jadi Tier 1; regresi logistik itu sederhana, jadi Tier 3.» Salah di kedua arah. Regresi logistik sederhana yang memutuskan limit NT$ miliaran adalah Tier 1. GBM yang kompleks tapi hanya mengurutkan laporan internal adalah Tier 3. Yang dinilai adalah KEPUTUSAN, bukan ALGORITMA.

Jebakan kedua: tiering SEKALI lalu dilupakan. Jebakan ketiga: «semua model Tier 1 supaya aman» — bila semua Tier 1, tidak ada prioritas. Jebakan keempat: tiering TANPA inventory — memberi tier pada model yang diketahui sambil membiarkan model tak terdaftar tanpa tier sama sekali. Jebakan kelima: menyamakan tier dengan KUALITAS — «model Tier 3 itu model jelek» — lalu tim berebut menaikkan tier modelnya demi gengsi. Tier bukan rapor; tier adalah jadwal pengawasan.

**Nilai:** masing-masing jebakan punya TANDA yang bisa dikenali: tier yang sama untuk semua model, tier yang tidak pernah berubah dalam tiga tahun, tier yang mengikuti nama algoritma, model yang jalan tanpa baris inventory, dan tim yang membanggakan tier-nya.

**Baik/buruk:** daftar jebakan bagus sebagai CHECKLIST audit — lima pertanyaan, lima jawaban ya/tidak. Buruk bila daftar ini dibaca lalu dilupakan: jebakan tiering bukan diteorikan, melainkan DIAUDIT — tiap tahun, ambil inventory, dan tanyakan kelima pertanyaan itu pada tiap baris.

**Mitigasi:** jadikan kelima jebakan ini pertanyaan audit tahunan; dan satu aturan keras — tier model apa pun yang ditetapkan HANYA dari nama algoritmanya (tanpa skor M/C/B langkah 7) dianggap TIDAK SAH sampai dihitung ulang.

---

## 10. Mini-Case: Beri Tier pada Tiga Model — dan Bela dengan Angka

Tiga model [ilustrasi — angka di bawah ini BUKAN angka kanonis, melainkan skenario yang ditulis untuk latihan; yang kanonis hanyalah flagship], beri tier pada masing-masing dengan skor langkah 7 (bobot 0,50/0,30/0,20; ambang 2,5 dan 1,5) dan bela jawabanmu.

Model A — SCORECARD KREDIT flagship (angka kanonis): GBM terkalibrasi, threshold 0,10, approved limit NT$424.180.000, EL approved NT$11.989.453, 6.000 aplikasi per periode [notebook]. M=3, C=2, B=3 [ilustrasi untuk B]. Skor = 2,70 → Tier 1. Pembelaan: yang dipertaruhkan NT$424,18 juta limit dan NT$11,99 juta EL — validasi independen penuh + review tahunan + sign-off CRO adalah harga yang wajar.

Model B — MODEL CHURN MARKETING [ilustrasi]: regresi logistik yang memprediksi pelanggan berhenti langganan; keputusannya mengirim promo/diskon kecil; M=1, C=1, B=2. Skor = 1,20 → Tier 3. Pembelaan: keputusan terburuknya adalah promo yang salah sasaran — kerugiannya biaya promo, bukan kredit macet. Perhatikan: model B BUKAN Tier 3 «karena regresi logistik» — ia Tier 3 karena DAMPAK keputusannya kecil.

Model C — MODEL DETEKSI FRAUD [ilustrasi]: ensemble yang memutuskan apakah transaksi diblokir; M=3, C=3, B=4. Skor = 3,20 → Tier 1. Pembelaan: skor TERTINGGI dari ketiganya — kesalahan di sini dua arah (fraud lolos = kerugian; nasabah sah diblokir = kehilangan nasabah) dan terjadi puluhan ribu kali per bulan, sehingga kesalahan kecil pun berskala besar.

**Nilai:** mini-case bagus karena ia memaksa satu kebiasaan — SETIAP tier harus bisa dibela dengan skor dan angka. «Tier 1 karena penting» bukan pembelaan; «Tier 1 karena skor 2,70 (M=3 dari approved limit NT$424,18 juta, C=2, B=3)» adalah pembelaan.

**Baik/buruk:** mini-case bagus sebagai latihan karena ketiga modelnya sengaja dibuat BERBEDA di semua sumbu. Buruk bila hasilnya dihafal («churn selalu Tier 3»): di bank lain, model churn yang menentukan diskon besar untuk nasabah prioritas bisa Tier 2 — yang dihafal haruslah CARA menghitungnya, bukan hasilnya.

**Mitigasi:** untuk setiap model di inventory-mu, tulis satu kalimat pembelaan tier-nya dengan format yang sama — «Tier X karena skor Y (M=…, C=…, B=…)». Bila kalimat itu tidak bisa ditulis, tier-nya belum sah.

---

## Lab 1: Hitung Materiality Flagship — Approved Limit, EL, dan Skala Buku Penuh

Angka kanonis [notebook, m8_tiering]: total LIMIT_BAL test NT$1.007.777.680; approved LIMIT_BAL NT$424.180.000; EL approved NT$11.989.453; EL seluruh test NT$78.675.378; LGD 0,45. Hitung: pangsa approved limit; EL rate approved; pangsa EL approved dari EL seluruh test; EL approved bila diskala ke buku penuh 30.000 (×5); dan EL per nasabah dari rumus Σ p_cal × LGD × LIMIT_BAL atas 4 nasabah yang disetujui [ilustrasi].

Hasil [lab]: approved_share=0.4209; el_rate_approved=0.0283; el_share=0.1524; el_full_book=59947265; el_sample=9225. Approved limit 42,09% dari total; EL rate 2,83%; EL approved hanya 15,24% dari EL seluruh test — model menahan 84,76% EL dengan menolak 57,91% limit. EL empat nasabah [ilustrasi]: 900 + 4.500 + 1.800 + 2.025 = 9.225.

---

## Lab 2: Skor Tiering Tiga Model — Flagship, Churn, Fraud

Skor tiering [kebijakan lesson ini]: skor = 0,50×M + 0,30×C + 0,20×B; tier: skor ≥ 2,5 → Tier 1; 1,5 ≤ skor < 2,5 → Tier 2; skor < 1,5 → Tier 3. Flagship: M=3, C=2, B=3 [ilustrasi untuk B]. Churn [ilustrasi]: M=1, C=1, B=2. Fraud [ilustrasi]: M=3, C=3, B=4.

Hasil [lab]: score_flagship=2.70; tier_flagship=1; score_churn=1.20; tier_churn=3; score_fraud=3.20; tier_fraud=1. Flagship 2,70 hanya 0,20 di atas ambang Tier 1 (2,5) — bila satu komponen dinilai satu tingkat lebih rendah (misal B=2 bukan 3), skornya 2,50 — TEPAT di ambang. Di dekat ambang, skor adalah sinyal untuk berdiskusi, bukan vonis otomatis.

---

## Guided Task di Colab

Guided task di Colab — notebook mlf-m82-guided-task.ipynb mereplikasi flagship GBM + kalibrasi Platt, menghitung materiality (total/approved LIMIT_BAL + EL dari probabilitas terkalibrasi), membangun inventory tiga model, dan menetapkan tier dari skor — dengan checks. Tautan Colab: https://colab.research.google.com/drive/18iBbofPJ62zrDXOXC6wpaYAj6qtbAXw6

## Rangkuman

- Inventory adalah daftar lengkap semua model (nama, pemilik, versi, tujuan, data, tier, tanggal validasi terakhir, tanggal review berikutnya, status) — tanpa inventory, model tak terdaftar lolos tanpa pengawasan.
- Tiering adalah rating risiko: Tier 1 validasi independen penuh + review tahunan + sign-off CRO; Tier 2 validasi lebih ringan + review tiap 2 tahun + sign-off Head of Risk; Tier 3 self-assessment + review 3-tahunan + sign-off pemilik [kebijakan lesson ini].
- Tier ditetapkan dari RISIKO INHEREN — kontrol (validasi, monitoring [M7.5], champion-challenger M8.1) menurunkan risiko RESIDUAL, bukan tier; tier turun hanya bila skor tieringnya turun, yaitu bila materiality/kompleksitas/breadth-nya sendiri turun.
- Materiality flagship [notebook]: total limit NT$1.007.777.680; approved limit NT$424.180.000 (42,09%, 1.710 dari 6.000 nasabah, 28,5%); EL approved NT$11.989.453 (Σ p_cal × LGD 0,45 × LIMIT_BAL; EL rate 0,0283); EL seluruh test NT$78.675.378; realised loss approved NT$11.695.500; laba bersih approved NT$8.214.000; total cost pada threshold 0,10 NT$33.046.500 [M6.4].
- Matriks exposure × kompleksitas: Tier 1 bila jumlah level (kompleksitas + exposure) ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2 — flagship (M=3, C=2) di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2.
- Skor tiering [kebijakan lesson ini]: 0,50×M + 0,30×C + 0,20×B; ≥ 2,5 Tier 1; 1,5–2,5 Tier 2; < 1,5 Tier 3. Flagship 2,70 → Tier 1; churn [ilustrasi] 1,20 → Tier 3; fraud [ilustrasi] 3,20 → Tier 1. Skor dalam 0,1 dari ambang → peninjauan manual.
- Re-tiering: terjadwal tahunan + event-driven (penggunaan baru, exposure melewati band, temuan validasi, drift besar PSI skor di atas 0,25 [kebijakan M7.5], insiden, regulasi). «Sudah lama aman» bukan pemicu turun.
- Jebakan: tiering dari nama/kompleksitas bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas.
- Risiko agregat: shared dependency + downstream + aggregate exposure + concentration_flag — satu bug di pipeline menjatuhkan flagship + fraud + churn; komponen bersama = Tier 1-kritis.
- Model vendor: owner internal + inventory + tier tetap wajib; intake 10 item; perubahan versi vendor = pemicu re-tiering; perubahan tanpa pemberitahuan = risiko yang tidak bisa divalidasi.
- Skala: test 6.000 adalah sampel stratified 1/5 dari data 30.000 — BUKAN buku live; skala ke buku penuh dengan ×(ukuran buku / 6.000): approved limit buku penuh 30.000 = NT$2.120.900.000, EL approved NT$59.947.265.
- Lab: approved_share=0.4209, el_rate_approved=0.0283, el_share=0.1524, el_full_book=59947265, el_sample=9225; skor tiering flagship 2,70 → Tier 1, churn 1,20 → Tier 3, fraud 3,20 → Tier 1.
