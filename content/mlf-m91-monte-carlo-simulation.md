# MLF-M9.1: Monte Carlo Simulation — Menghitung Risiko dari Dunia yang Belum Terjadi

## Masalah: VaR 0,0286 dari 480 Hari — dan 480 Hari Itu Sampel Kecil

Komite risiko memegang satu angka: VaR95 historis portofolio 0,0286 — pada 95% hari, kerugian harian tidak melebihi 2,86% (Rp2.860.000 pada portofolio Rp100.000.000). Angka itu dihitung dari 480 hari perdagangan, 2024-11-04 sampai 2026-11-11 [M4]. Terdengar kokoh — sampai kamu bertanya: 480 hari itu berapa banyak «hari buruk» yang sempat terlihat? Kuantil 5% dari 480 hari hanya bersandar pada 24 hari terburuk (5% × 480 = 24). Seluruh penilaian ekormu — dan ES95 historis 0,0445 (Rp4.450.000), rata-rata kerugian pada 24 hari terburuk itu — berdiri di atas 24 observasi.

Monte Carlo (MC) menjawab kekurangan itu: bila sejarah terlalu pendek, SIMULASIKAN sejarah yang lain. Ambil distribusi return harian yang diestimasi dari 480 hari itu, lalu undi 100.000 «hari» baru dari distribusi tersebut — hari-hari yang tidak pernah terjadi, tapi COCOK dengan sifat statistik hari-hari yang pernah terjadi. VaR95 MC 1-hari (N=100.000) adalah 0,0329 (Rp3.290.000) [m9_canonical.json] — sedikit di atas VaR95 historis 0,0286 dan hampir sama dengan VaR95 parametrik 0,0328 [M4.2].

Angka acuan: risiko pasar = portofolio EQUAL-WEIGHT BBCA/KLBF/UNVR dengan SIMPLE daily returns (n=480, 2024-11-04→2026-11-11) — seri yang sama dengan M4.2 VaR dan M5. Simulasi GBM memakai LOG returns portofolio itu: μ_log −0,000752, σ_log 0,0198; μ_simple −0,000558, σ_simple 0,0196 [m9_canonical.json]. Konversi log→simple = expm1. Seed 42 di semua simulasi. Semua angka MC di lesson ini berasal dari m9_canonical.json, dihitung dari data, bukan karangan.

---

## 1. VaR 0,0286 dari 480 Hari — dan 480 Hari Itu Sampel Kecil

**Nilai:** Monte Carlo bagus karena ia mengubah pertanyaan «apa yang PERNAH terjadi?» menjadi «apa yang BISA terjadi, bila sifat statistik kemarin bertahan?». VaR historis hanya tahu 24 hari terburuk yang sempat terjadi; MC tahu 5.000 hari terburuk dari 100.000 hari simulasi (5% × 100.000) — ekornya diukur, bukan ditebak dari 24 titik.

**Baik/buruk:** MC bagus bila dibaca sebagai DISTRIBUSI yang dihasilkan asumsi yang eksplisit — kamu bisa menunjuk asumsi mana yang bertanggung jawab atas angka mana. Buruk bila dibaca sebagai «ramalan»: 100.000 hari simulasi tidak mengandung satu pun informasi baru tentang pasar — semuanya berasal dari μ_log dan σ_log yang diestimasi dari 480 hari yang sama. MC tidak menambah DATA; ia menambah ARITMETIKA.

**Mitigasi:** setiap angka MC tuliskan BERSAMA asumsi dan N-nya: «VaR95 MC 0,0329 (N=100.000, log-return ~ Normal(μ_log −0,000752, σ_log 0,0198), seed 42)». Tanpa baris itu, 0,0329 terlihat seperti fakta pasar — padahal ia fakta tentang MODEL.

---

## 2. GBM: Modelnya — Satu Persamaan, Tiga Asumsi, Dua Batas

GBM (Geometric Brownian Motion): dS/S = μ dt + σ dW. Bentuk diskret yang dipakai simulasi: log-return satu hari ~ Normal(μ_log, σ_log²), μ_log −0,000752, σ_log 0,0198 [m9_canonical.json]. μ_log dan σ_log adalah mean dan simpangan baku EMPIRIS log-return portofolio — karena yang diestimasi langsung adalah mean log-return, tidak ada koreksi Itô yang perlu ditambahkan di simulasi diskret ini. Return SIMPLE diperoleh dengan expm1: r_simple = exp(r_log) − 1.

Tiga asumsi: (1) log-return berdistribusi NORMAL; (2) log-return INDEPENDEN antar hari (iid); (3) volatilitas KONSTAN. Ketiganya gagal deskriptif di data ini: distribusi SIMPLE return portofolio miring ke kiri (skew −0,5091) dan berekor tebal (excess kurtosis 6,0216) [m9_canonical.json] — normal tidak punya kemiringan dan tidak punya ekor tebal. Volatilitas BERGEROMBOL: autokorelasi lag-1 dari squared return adalah 0,1043 [M4.3] — satu angka ini menyangkal DUA asumsi sekaligus: iid (bila return iid, squared return pun tak berkorelasi) dan volatilitas konstan. Model yang menangkap ini adalah EWMA dan GARCH [M4.3], bukan GBM dengan σ konstan.

**Nilai:** GBM bagus karena ia SATU-SATUNYA model di lesson ini yang asumsi-nya bisa ditulis dalam satu baris — dan karena itu satu-satunya yang kesalahannya bisa dilacak ke asumsi tertentu. Bila VaR MC meleset, kamu tahu persis ke mana harus menunjuk: normalitas, independensi, atau volatilitas konstan.

**Baik/buruk:** GBM bagus sebagai TITIK AWAL — ia memberi distribusi lengkap (bukan hanya satu kuantil) dari dua angka (μ_log, σ_log). Buruk bila dipakai sebagai TITIK AKHIR: σ konstan berarti model ini TIDAK TAHU bahwa pasar punya periode tenang dan periode panik — ia memberi jawaban yang sama untuk keduanya, yaitu jawaban rata-rata.

**Mitigasi:** sebelum menjalankan satu simulasi pun, tulis tiga asumsi GBM dan satu baris bukti untuk tiap asumsi (normal? iid? vol konstan?). Bila satu asumsi gagal — dan di data ini ketiganya gagal — tulis itu di samping hasil simulasi, bukan di lampiran.

---

## 3. Satu Hari, Satu Simulasi: Tiga Angka VaR, Tiga Asumsi

Definisi eksak: VaR95 adalah KUANTIL 95% dari distribusi KERUGIAN — kerugian yang hanya terlampaui pada 5% hari. Bukan «kerugian maksimum», bukan «kerugian terburuk yang pernah terjadi», dan bukan rata-rata kerugian. ES95 adalah rata-rata kerugian BEYOND VaR — rata-rata kerugian pada 5% hari terburuk saja.

Tiga estimator VaR95 1-hari: historis [M4.2] 0,0286 / ES95 0,0445 — kuantil empiris dari 480 hari, tanpa asumsi distribusi, tapi hanya bersandar pada 24 hari terburuk. Parametrik [M4.2] 0,0328 / ES95 0,0410 — rumus normal dari μ_simple −0,000558 dan σ_simple 0,0196: VaR95 = −(μ_simple − 1,645 × σ_simple) = 0,000558 + 0,032240 = 0,0328 [turunan]. MC joint-normal M4 [M4.2] 0,0336 / ES95 0,0424 — mensimulasikan ketiga saham bersama dengan korelasinya, lalu equal-weight. MC univariat lesson ini (normal pada LOG-return portofolio, seed 42): N=1.000 → 0,0335 / 0,0413; N=10.000 → 0,0332 / 0,0411; N=100.000 → 0,0329 / 0,0407 [m9_canonical.json].

MC univariat dan parametrik HAMPIR SAMA (0,0329 vs 0,0328) — keduanya memakai asumsi normal yang sama, yang satu lewat undian, yang satu lewat rumus; selisih 0,0001 adalah MC error. MC joint-normal M4 sedikit lebih tinggi (0,0336 vs 0,0329) — selisih 0,0007 itu adalah ukuran seberapa besar «aproksimasi» itu: MC univariat mengaproksimasi log-return portofolio sebagai normal, sementara MC joint M4 mensimulasikan tiga saham. Yang BERBEDA adalah historis: VaR95 0,0286 — 0,0043 di bawah parametrik dan MC univariat — sementara ES95 historis 0,0445 — 0,0035–0,0038 DI ATAS parametrik dan MC univariat. MC joint M4 berdiri sedikit lebih jauh: VaR-nya 0,0050 di atas historis, ES-nya 0,0021 di bawah historis. «Bahu» 5%-nya lebih tipis dari normal, ekor ekstremnya lebih tebal (skew −0,5091, excess kurtosis 6,0216).

**Nilai:** tiga estimator bagus karena mereka SALING MENJAGA — tidak satu pun yang boleh dibaca sendirian. Bila ketiganya berdekatan, kepercayaanmu naik; bila mereka berjauhan — seperti di sini, 0,0286 vs 0,0329 — jarak itu SENDIRI adalah informasi.

**Baik/buruk:** perbandingan tiga estimator bagus bila tiap angka ditulis bersama asumsinya. Buruk bila satu angka dikutip tanpa label: «VaR95 adalah 0,0329» tanpa menyebut MC, N, dan asumsi adalah kalimat yang tidak bisa diperiksa.

**Mitigasi:** di laporan risiko, tulis ketiganya dalam satu baris — hist 0,0286 / param 0,0328 / MC 0,0329 — beserta ES masing-masing (0,0445 / 0,0410 / 0,0407).

---

## 4. Hukum 1/√N: Menambah Simulasi Mengecilkan Error — dengan Kecepatan yang Melambat

Standard error (SE) menyusut dengan 1/√N — melipatgandakan N sepuluh kali hanya membagi SE dengan √10 ≈ 3,16. SE mean return harian (σ_simple 0,0196), SE = σ/√N: N=100 → 0,001962; N=1.000 → 0,000620; N=10.000 → 0,000196; N=100.000 → 0,000062 [m9_canonical.json].

Realised MC mean error (satu undian per N): N=100 → −0,000149; N=1.000 → −0,000813; N=10.000 → −0,000118; N=100.000 → −0,000015 [m9_canonical.json]. Pada N=1.000, error yang terealisasi (−0,000813) LEBIH BESAR dari SE-nya (0,000620) — sekitar 1,3 SE — dan itu NORMAL: SE adalah ukuran TIPIKAL error, bukan batas maksimumnya. Pada N=100, error yang terealisasi (−0,000149) jauh LEBIH KECIL dari SE-nya (0,001962) — dan itu KEBERUNTUNGAN, bukan bukti N=100 sudah cukup.

Hukum yang sama berlaku untuk VaR: 20 batch independen, masing-masing N=10.000, memberi VaR95 dengan mean 0,0326 (sd antar-batch 0,0004; SE 0,00009) dan range [0,0319; 0,0333] [m9_canonical.json]. SE di sini = sd/√n = 0,0004/√20 ≈ 0,00009. VaR95 antar-batch berayun 0,0014 dari ujung ke ujung (0,0333 − 0,0319), sementara selisih VaR95 MC N=10.000 (0,0332) vs N=100.000 (0,0329) hanya 0,0003 — di dalam ayunan antar-batch itu.

**Nilai:** hukum 1/√N bagus karena ia memberi HARGA pada ketelitian: tiap digit tambahan pada VaR punya biaya komputasi yang bisa dihitung.

**Baik/buruk:** SE bagus bila ditulis bersama n-nya — «SE = 0,000196 (N=10.000)» — dan buruk bila ditulis sebagai «±» tanpa penjelasan. Buruk bila realised error satu undian dipakai sebagai bukti N sudah cukup: satu undian yang beruntung bukan bukti.

**Mitigasi:** sebelum menambah N, hitung dulu SE yang kamu punya dan SE yang kamu BUTUHKAN. Bila SE-mu sudah 0,0002 dan keputusanmu hanya berubah bila VaR bergerak 0,002, menambah N sepuluh kali lipat adalah pemborosan.

---

## 5. Jalan 10 Hari: Satu Path GBM, dan Mengapa √10 Berbohong

Satu path GBM 10 hari adalah 10 undian log-return independen yang dijumlahkan, lalu dikonversi ke simple dengan expm1. Dengan N=100.000 path (seed 42), distribusi return terminal 10-hari: mean −0,0053 (sd 0,0619), median −0,0074, VaR95 10-hari (p5, sebagai kerugian) 0,1038, VaR99 10-hari (p1) 0,1408, P(rugi > 10%) 0,0572, dan P(rugi > 0,0903) 0,0795 [m9_canonical.json]. Pada portofolio Rp100.000.000: kerugian 10-hari melebihi Rp10.380.000 pada 5% jendela 10-hari, dan melebihi Rp10.000.000 pada 5,72% jendela.

Konsistensi dengan aritmetika 1-hari: mean terminal −0,0053 melawan 10 × μ_simple = 10 × (−0,000558) = −0,00558 [turunan] — cocok. Simpangan baku terminal 0,0619 melawan σ_simple × √10 = 0,0196 × 3,1623 = 0,0620 [turunan] — cocok. Median −0,0074 BERADA DI BAWAH mean −0,0053 — distribusi terminal miring ke KANAN (lognormal).

Aturan praktis industri: VaR 10-hari ≈ VaR 1-hari × √10. Diterapkan pada VaR95 historis 1-hari 0,0286: 0,0286 × √10 ≈ 0,0903 [M4.2] — nilai kanonis dihitung dari kuantil historis yang belum dibulatkan, jadi 0,0286 × √10 = 0,0904 dari angka bulatnya. MC 10-hari berkata 0,1038 — LEBIH BESAR 0,0135. Bila kamu memakai 0,0903 sebagai VaR95 10-harimu, peluang kerugian aktual melampaui 0,0903 adalah 0,0795 — bukan 0,05. Uraian selisih 0,0135: bagian TERBESAR berasal dari titik awalnya — VaR historis 1-hari (0,0286) berada 0,0043 di bawah VaR parametrik/MC 1-hari (0,0328/0,0329), dan selisih itu ikut membesar √10 kali menjadi ≈ 0,0136 [turunan]. Di atas itu, √10 mengasumsikan DRIFT NOL — padahal drift log −0,000752/hari terakumulasi LINEAR selama 10 hari (10 × 0,000752 = 0,0075 dalam log), dan drift negatif itu menambah kerugian sekitar 0,0075 dalam log [turunan]. Sementara itu kemiringan lognormal bekerja ke arah SEBALIKNYA: distribusi terminal yang miring ke kanan menekan kuantil kerugian sedikit ke bawah dibanding normal — jadi MC melampaui √10-hist DESPITE kemiringan lognormal, bukan karena kemiringan itu. Dekomposisi lengkapnya: titik awal 0,0136 + drift +0,0075 − kemiringan lognormal ≈0,0076 ⇒ net ≈0,0135 [turunan]. Pembanding: √10 dari VaR parametrik 1-hari (0,0328 × √10 = 0,1037 [turunan]) dan √10 dari VaR MC 1-hari (0,0329 × √10 = 0,1040 [turunan]) keduanya hampir sama dengan MC 10-hari 0,1038.

√10 BENAR bila: return tidak berkorelasi (level) antar hari, drift nol (atau bisa diabaikan terhadap σ√t), dan kuantil yang diskalakan memang berskala √t (benar untuk normal). Di data ini syarat pertama HAMPIR terpenuhi — hanya untuk korelasi LEVEL: iid penuh TIDAK terpenuhi, karena squared return berkorelasi (autokorelasi lag-1 0,1043 [M4.3]) — drift negatif −0,000752/hari melanggar syarat kedua secara eksplisit, dan titik awal historis melanggar syarat ketiga.

**Nilai:** simulasi 10-hari bagus karena ia memberi DISTRIBUSI LENGKAP, bukan satu angka yang diskalakan: dari distribusi yang sama kamu membaca VaR95 (0,1038), VaR99 (0,1408), dan peluang kejadian apa pun — P(rugi > 10%) 0,0572 — tanpa rumus tambahan.

**Baik/buruk:** jalan 10-hari bagus bila tiap path-nya independen dan horizon-nya eksplisit — «10 hari perdagangan, N=100.000 path». Buruk bila 10 hari dibaca sebagai «10 hari kalender», atau bila terminal distribution dibaca sebagai «ramalan 10 hari ke depan».

**Mitigasi:** jangan pernah melaporkan VaR multi-hari hasil penskalaan √10 tanpa menulis asumsi penskalaannya — dan tanpa membandingkannya sekali saja dengan simulasi jalurnya.

---

## 6. Konvergensi: Kapan Berhenti Menambah N

Kriteria berhenti menambah N [kebijakan lesson ini]: berhenti bila simpangan baku antar-batch VaR95 ≤ 0,0005 — yaitu kurang dari seperempat simpangan baku bootstrap VaR95 (0,0022; lihat bawah). Terapkan: pada N=10.000, sd antar-batch VaR95 adalah 0,0004 [m9_canonical.json] — SUDAH di bawah 0,0005. Kriteria terpenuhi pada N=10.000. N=100.000 dipakai untuk angka laporan (VaR95 0,0329) — ia melewati titik berhenti sebagai cadangan ketelitian, bukan karena keputusan memerlukannya.

Kenapa seperempat? Karena sumber ketidakpastian yang LEBIH BESAR adalah datanya sendiri — 480 hari itu. Bootstrap VaR95 historis (M9.5, B=10.000, dirujuk — bukan dihitung ulang di sini): IID bootstrap memberi mean 0,0284 (sd 0,0022) dengan CI95 [0,0229; 0,0322]; moving-block bootstrap (blok 10) memberi mean 0,0285 (sd 0,0029) dengan CI95 [0,0223; 0,0340] [m9_canonical.json]. Bandingkan: sd MC antar-batch 0,0004 melawan sd bootstrap 0,0022 — ketidakpastian SAMPLING DATA sekitar 5,5× ketidakpastian SIMULASI (0,0022/0,0004 = 5,5 [turunan]).

Pemeriksaan konsistensi: VaR95 MC 0,0329 berada DI DALAM CI95 block-bootstrap [0,0223; 0,0340] — konsisten dengan ketidakpastian sampling data. Ia berada sedikit DI ATAS batas atas CI95 iid [0,0229; 0,0322] — dan itu WAJAR: bootstrap iid mengacak hari satu per satu dan memutus dependensi jangka pendek, sehingga CI-nya terlalu sempit; block bootstrap (blok 10) yang menghormati autokorelasi squared return 0,1043 [M4.3] memberi CI yang lebih lebar — dan lebih jujur.

**Nilai:** kriteria berhenti bagus karena ia mengubah «tambah N sampai bosan» menjadi keputusan yang bisa diaudit: ambang 0,0005 ditulis dulu, sd antar-batch diukur, dan keputusannya mengikuti.

**Baik/buruk:** kriteria ini bagus bila ambangnya DITURUNKAN dari ketidakpastian data (seperempat dari 0,0022) — dan buruk bila ambangnya ditebak tanpa pembanding. Buruk juga bila kriteria berhenti dibaca sebagai «N=10.000 selalu cukup»: ambang ini benar untuk VaR95 portofolio ini; untuk VaR99 atau ES99, N yang dibutuhkan lebih besar.

**Mitigasi:** di setiap laporan MC, tulis satu baris konvergensi: «sd antar-batch VaR95 0,0004 (N=10.000, 20 batch) ≤ ambang 0,0005 [kebijakan lesson ini]; ketidakpastian sampling data (bootstrap sd 0,0022) ≈ 5,5× lebih besar».

---

## 7. Jebakan: MC yang «Terlalu Bagus» — Input Salah, Output Salah, Presisi Palsu

Jebakan paling berbahaya bukan MC yang error-nya besar — itu terlihat. Yang berbahaya adalah MC yang error-nya KECIL dan input-nya SALAH: VaR95 0,0329 dengan empat desimal yang rapi, sd antar-batch 0,0004 yang meyakinkan — semuanya dihitung dengan benar dari σ_log yang salah. Contohnya: σ diestimasi dari PERIODE TENANG saja, lalu dipakai untuk mensimulasikan «risiko» — VaR yang keluar terlalu kecil, dengan presisi yang membuat siapa pun percaya. MC tidak tahu σ-mu salah; ia hanya tahu cara mengundi dari distribusi yang kamu beri.

MC error (langkah 4–6) adalah error UNDIAN: ia menyusut dengan 1/√N dan bisa diukur dengan batch. Model error adalah error ASUMSI: normalitas yang gagal (skew −0,5091, excess kurtosis 6,0216), iid dan volatilitas konstan yang gagal (autokorelasi squared return 0,1043 [M4.3] menyangkal keduanya), σ yang diestimasi dari periode yang tidak mewakili. Model error TIDAK menyusut dengan N. Satu-satunya yang menangkap model error adalah VALIDASI — conceptual soundness [M8.1]: periksa inputnya (dari mana μ/σ berasal? periode apa?), periksa asumsinya (normal? iid? vol konstan?), dan BANDINGKAN dengan estimator yang asumsinya berbeda (historis 0,0286 vs param 0,0328 vs MC 0,0329).

Seberapa sensitif VaR terhadap σ yang salah? Dari rumus parametrik, VaR95 ≈ −μ_simple + 1,645 × σ_simple — hampir LINEAR dalam σ: bila σ yang dipakai 10% terlalu kecil, VaR95 ikut ≈ 10% terlalu kecil [ilustrasi]. Pada VaR95 0,0329, itu berarti 0,0033 terlalu rendah — LEBIH BESAR dari seluruh MC error antar-batch (range 0,0014) dan dari selisih MC vs param (0,0001).

**Nilai:** jebakan ini bagus untuk diajarkan karena ia membalik intuisi «lebih banyak simulasi = lebih benar»: lebih banyak simulasi = lebih PRESISI, dan presisi atas input yang salah adalah cara tercepat untuk meyakinkan komite tentang angka yang salah.

**Baik/buruk:** MC bagus bila laporanmu menulis DARI MANA μ/σ berasal (480 hari, 2024-11-04→2026-11-11) dan APA YANG TERJADI bila σ salah 10%. Buruk bila laporanmu hanya menulis «VaR95 MC 0,0329 (N=100.000)» — N besar tanpa sumber input adalah angka yang tidak bisa diperiksa.

**Mitigasi:** tiga baris wajib di setiap laporan MC — (1) sumber input: seri apa, periode apa, n berapa; (2) perbandingan tiga estimator (hist/param/MC); (3) satu uji sensitivitas: «bila σ 10% lebih besar, VaR menjadi …».

---

## 8. Mini-Case: Putuskan — VaR MC, Historis, atau Parametrik yang Dilaporkan ke Komite?

Fakta di meja: portofolio equal-weight BBCA/KLBF/UNVR, Rp100.000.000, n=480 hari (2024-11-04→2026-11-11); VaR95 1-hari: historis 0,0286 (Rp2.860.000), parametrik 0,0328 (Rp3.280.000), MC univariat N=100.000 0,0329 (Rp3.290.000); ES95: historis 0,0445 (Rp4.450.000), parametrik 0,0410 (Rp4.100.000), MC 0,0407 (Rp4.070.000); MC joint-normal M4 0,0336/0,0424 [M4.2]; MC error antar-batch (20 batch, N=10.000): mean 0,0326 (sd 0,0004; SE 0,00009), range [0,0319; 0,0333]; bootstrap VaR95 (M9.5): CI95 iid [0,0229; 0,0322], block-10 [0,0223; 0,0340]; VaR95 10-hari MC 0,1038 (Rp10.380.000) vs √10-hist 0,0903 (Rp9.030.000).

Jawaban yang SALAH ada tiga. «MC 0,0329, karena N=100.000 paling besar» — salah: N besar mengecilkan MC error, bukan model error. «Historis 0,0286, karena tanpa asumsi» — salah: kuantil 5%-nya hanya bersandar pada 24 hari, dan CI95 bootstrap-nya selebar [0,0223; 0,0340] (block-10). «Parametrik 0,0328, karena ada rumusnya» — salah: rumus itu menyembunyikan asumsi normal di balik keanggunannya.

Jawaban yang BENAR: laporkan KETIGANYA — beserta ES, beserta alasan tiap angka berbeda. «VaR95 1-hari: historis 0,0286 (tanpa asumsi distribusi; n=480, 24 hari terburuk), parametrik 0,0328 (normal; μ_simple −0,000558, σ_simple 0,0196), MC 0,0329 (normal pada log-return; N=100.000, seed 42). Ketiganya mengestimasi besaran yang sama; rentang tiga estimator utama [0,0286; 0,0329] adalah ukuran ketidaksepakatan antar-asumsi (bila MC joint M4 ikut, rentangnya [0,0286; 0,0336]), dan bootstrap CI95 block-10 [0,0223; 0,0340] adalah ukuran ketidakpastian sampling datanya. MC error antar-batch pada N=10.000: mean 0,0326 (sd 0,0004; SE 0,00009). ES95: historis 0,0445 — LEBIH BESAR dari parametrik/MC (0,0410/0,0407) — ekor ekstrem historis lebih tebal dari normal, jadi untuk batas kerugian ekstrem, angka historis-lah yang lebih waspada.» Dan untuk horizon 10 hari: laporkan MC 0,1038 sebagai angka utama, dengan √10-hist 0,0903 sebagai pembanding yang SUDAH TERBUKTI meremehkan (P(melampaui 0,0903) = 0,0795, bukan 0,05).

Kenapa MC disebut «yang asumsi-nya paling transparan» — dan kenapa itu BUKAN berarti «yang benar»? Karena asumsi MC ditulis di depan (normal pada log-return, μ_log/σ_log dari data, seed 42) dan bisa DIGANTI satu per satu untuk melihat perubahan hasilnya. Transparansi berarti KESALAHANNYA BISA DILACAK — bukan berarti kesalahannya tidak ada.

**Nilai:** mini-case ini bagus karena jawabannya TIDAK ADA di angka mana pun secara sendirian — ia ada di PERBANDINGAN tiga angka dengan asumsinya.

**Baik/buruk:** keputusan «laporkan ketiganya» bagus bila tiap angka datang dengan asumsi, N, dan ES-nya — dan buruk bila «ketiganya» hanya berarti tiga angka tanpa penjelasan, karena komite akan memilih yang terkecil (0,0286) dan pulang dengan rasa aman yang salah. Satu kalimat rekomendasi: «untuk batas 1-hari, pakai 0,0329 (MC) sebagai angka kerja — ia di tengah rentang atas dan asumsi-nya paling mudah diuji — dengan catatan ES historis 0,0445 untuk skenario ekstrem.»

**Mitigasi:** setiap kali komite bertanya «VaR kita berapa?», jawab dengan TABEL tiga baris (estimator, asumsi, VaR, ES) plus satu baris ketidakpastian (bootstrap CI). Bila tabelmu hanya punya satu baris, laporanmu belum siap.

---

## Lab 1: Sweep N — VaR95 + SE, dari 1.000 sampai 100.000

Simulasi 1-hari: log-return ~ Normal(μ_log −0,000752, σ_log 0,0198), konversi ke simple dengan expm1, seed 42 (generator baru per N agar deterministik). Untuk tiap N ∈ {1.000, 10.000, 100.000}, hitung VaR95, ES95, dan SE mean (σ_simple/√N, σ_simple 0,0196).

Hasil [lab]: var95_N1000=0.0335; var95_N10000=0.0332; var95_N100000=0.0329; es95_N100000=0.0407; se_mean_N10000=0.000196; se_menyusut=True. SE mean pada N=100.000 (0,000062) adalah sepersepuluh SE pada N=1.000 (0,000620) — N naik 100×, SE turun √100 = 10×. VaR95 bergerak 0,0335 → 0,0332 → 0,0329 (0,0006 dari ujung ke ujung), di dalam ayunan antar-batch [0,0319; 0,0333]. Catatan: keluaran di mesinmu bisa berbeda ≈0,0001 dari angka kanonis karena urutan pemakaian stream RNG — itu MC error antar-stream, dan checks memakai tol 0,002 untuk itu.

---

## Lab 2: GBM 10 Hari — Path, VaR95 10-Hari, dan Peluang Rugi > 10%

Lab memakai N=10.000 path (bukan 100.000) agar ringan di browser — checks memakai toleransi LONGGAR (0,01) terhadap angka kanonis N=100.000: VaR95 10-hari 0,1038, P(rugi > 10%) 0,0572, P(rugi > 0,0903) 0,0795 [m9_canonical.json]. Bila hasil lab-mu berbeda 0,002–0,005 dari kanonis, itu BUKAN kesalahanmu — itu MC error pada N=10.000 path. Bedakan dengan notebook: checks lab memakai tol 0,01 (N=10.000 path), sementara notebook memakai tol 0,002 (N=100.000 path) — toleransi yang berbeda untuk N yang berbeda, bukan dua standar yang bertentangan.

Hasil [lab]: p5_10d=0.1038; p1_10d=0.1408; p_loss_gt_10=0.0572; p_loss_gt_0903=0.0795; p5_lebih_besar_dari_sqrt10=True. p5_10d (0,1038) LEBIH BESAR dari skala √10-hist (0,0903) — dan p_loss_gt_0903 (0,0795) membuktikannya dari sisi peluang: bila kamu memakai 0,0903 sebagai VaR95 10-harimu, kerugian melampauinya 7,95% jendela, bukan 5%.

---

## Figure 1: Distribusi MC 1-Hari — dan di Mana Ketiga VaR Berdiri

Kurva densitas return SIMPLE 1-hari MC (N=100.000, log-return ~ Normal(μ_log −0,000752, σ_log 0,0198), seed 42) beserta tiga garis vertikal: VaR95 historis 0,0286 [M4.2] dan VaR95 parametrik 0,0328 / MC 0,0329 yang hampir berhimpit. Daerah yang diarsir di kiri garis MC adalah 5% hari terburuk — wilayah yang rata-ratanya adalah ES95 MC 0,0407.

**Nilai:** «VaR» bukan lagi angka di tabel, melainkan GARIS di atas kurva — dan «ES» bukan lagi rumus, melainkan RATA-RATA daerah yang diarsir. Siapa pun yang melihatnya langsung paham kenapa VaR tanpa ES menyesatkan.

**Baik/buruk:** figure bagus bila angkanya SAMA dengan prose — garis historis di 0,0286, garis param/MC di 0,0328/0,0329, daerah arsir 5% dengan ES 0,0407. Buruk bila kurvanya digambar dari «kira-kira normal» tanpa μ/σ yang sama dengan lesson.

**Mitigasi:** setiap kali kamu menggambar distribusi, tulis μ/σ dan N di caption — dan periksa satu angka dengan mata: apakah garis VaR-mu berdiri di tempat yang prose-mu katakan?

---

## Figure 2: Konvergensi VaR95 vs N — Pita yang Menyempit, Garis yang Tidak Bergerak

VaR95 MC 1-hari pada N=1.000 (0,0335), N=10.000 (0,0332), N=100.000 (0,0329), masing-masing dengan pita ±1 sd antar-batch. Sumbu-x logaritmik; dua garis acuan horizontal: VaR95 historis 0,0286 dan VaR95 parametrik 0,0328 [M4.2]. Pita pada N=10.000 adalah ±0,0004 — sd antar-batch yang DIUKUR dari 20 batch independen [m9_canonical.json]; pita pada N=1.000 (±0,0013) dan N=100.000 (±0,0001) adalah [turunan] dari sd itu dengan hukum 1/√N (0,0004 × √10 ≈ 0,0013; 0,0004 / √10 ≈ 0,0001).

Titik-titiknya bergerak SEDIKIT (0,0335 → 0,0332 → 0,0329 — total 0,0006), sementara pitanya menyempit DRASTIS (±0,0013 → ±0,0004 → ±0,0001). Yang konvergen bukan TITIKNYA — melainkan KETIDAKPASTIAN di sekitarnya. Garis historis 0,0286 berdiri jauh di bawah ketiganya — jarak itu BUKAN MC error (pita ±0,0004 tidak pernah menyentuhnya), melainkan perbedaan ASUMSI.

**Nilai:** figure ini memisahkan DUA hal yang sering dicampur: konvergensi (pita menyempit) dan kebenaran (titik mendekati garis yang benar).

**Baik/buruk:** figure bagus bila pita yang DIUKUR (N=10.000, ±0,0004) dibedakan dari pita yang DITURUNKAN (N=1.000 dan N=100.000, [turunan] dari hukum 1/√N) — dan caption menuliskan pembedaan itu.

**Mitigasi:** setiap kali kamu menggambar pita ketidakpastian, tulis di caption: mana yang diukur langsung, mana yang diturunkan dari hukum, dan berapa n pengukurannya (di sini: 20 batch).

---

## 13. Memilih Generator: GBM, EWMA, GARCH, atau FHS — Tujuh VaR, Satu Data

Tujuh generator, satu data (480 hari) — dan tujuh VaR95 1-hari yang berbeda [notebook]: GBM normal (MC univariat N=100.000) 0,0329; parametrik 0,0328; HS 0,0286; EWMA-kondisional 0,0467; GARCH-kondisional 0,0310; FHS-GARCH 0,0270; FHS-EWMA 0,0435. Rentang ketujuhnya 0,0197 — sekitar 73% dari nilai terkecilnya [turunan].

**Nilai:** EWMA (λ=0,94) memberi σ terakhir 0,0280 — sekitar 43% di atas σ tak-bersyarat 0,0196 [turunan] — karena bobotnya meluruh dengan half-life ≈11 hari [turunan] dan crash Oktober 2026 masih «diingat». GARCH(1,1) MLE manual atas LOG returns [notebook]: ω=0,00012, α=0,1094, β=0,5833, persistensi 0,6927, volatilitas jangka panjang 0,0197, σ ramalan 0,0184 → VaR95 0,0310. FHS mengundi residu terstandar GARCH (skew −1,2390, excess kurtosis 10,8991 [notebook]) lalu mengalikannya dengan σ ramalan saat ini: FHS-GARCH 0,0270 (ES95 0,0429), FHS-EWMA 0,0435 (ES95 0,0593).

**Baik/buruk:** FHS-GARCH (0,0270) mendekati HS (0,0286) — selisih 0,0016 [turunan] — karena keduanya memakai BENTUK empiris; FHS-EWMA (0,0435) mendekati EWMA-parametrik (0,0467) — selisih 0,0032 [turunan] — karena keduanya memakai σ saat ini yang tinggi. Yang menggerakkan VaR antar-generator BUKAN bentuk residunya — melainkan σ KONDISIONAL saat ini, dan σ itu tergantung pada panjang ingatan modelmu (≈11 hari vs ≈2 hari).

**Mitigasi — aturan keras:** JANGAN pilih generator dari hasil backtest yang sama dengan yang dipakai memvalidasinya (jebakan «backtest yang dilatih», M9.3 langkah 7). PUTUSKAN dari pemeriksaan asumsi SEBELUM melihat backtest; atau bagi jendela OOS jadi dua — pilih di paruh pertama, validasi di paruh kedua.

---

## Lab 3: Bandingkan Generator — VaR95 Tiap Generator dari σ-nya

Hitung VaR95 tiap generator dari σ-nya (rumus VaR parametrik: VaR95 = Z95 × σ − μ). Hasil [lab]: var95_ewma=0.0466; var95_garch=0.0310; spread=0.0196; fhs_ewma_lebih_besar=True; generator_dipilih_dari_backtest_yang_sama=False. Dari σ tampil 0,0280 lab memberi 0,0466 dan spread 0,0196 (kanonis 0,0467 dan 0,0197 dari σ tak-bulat 0,028038 — selisih 0,0001 murni pembulatan); checks memakai toleransi 0,0005.

---

## Guided Task di Colab

Notebook: colab/mlf-m91-guided-task.ipynb — return portofolio dari data/m4_prices.csv (n=480), MC 1-hari sweep N, 20 batch independen + hukum 1/√N, GBM 10-hari N=100.000 path, kriteria berhenti konvergensi [kebijakan lesson ini], dan laporan tiga estimator untuk komite. Tautan Colab: https://colab.research.google.com/drive/1Nt2MSyof-aEwUE0eQ2RVh96NwVWXk02s

## Rangkuman

- Konvensi: risiko pasar = portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns (n=480, 2024-11-04→2026-11-11); simulasi GBM memakai LOG returns (μ_log −0,000752, σ_log 0,0198; μ_simple −0,000558, σ_simple 0,0196); konversi log→simple = expm1; seed 42.
- GBM: dS/S = μdt + σdW; log-return 1-hari ~ Normal(μ_log, σ_log²) — tiga asumsi (normal, iid, vol konstan); ketiganya gagal deskriptif di data ini (skew −0,5091, excess kurtosis 6,0216 menyangkal normalitas; autokorelasi squared return lag-1 0,1043 [M4.3] menyangkal iid DAN vol konstan — lihat EWMA/GARCH [M4.3]).
- VaR = kuantil 95% distribusi KERUGIAN; ES = rata-rata kerugian BEYOND VaR. VaR95 1-hari: historis 0,0286 / parametrik 0,0328 / MC joint-normal M4 0,0336 / MC univariat N=1.000 0,0335, N=10.000 0,0332, N=100.000 0,0329; ES95: historis 0,0445 / parametrik 0,0410 / MC M4 0,0424 / MC univariat 0,0413 / 0,0411 / 0,0407.
- Hukum 1/√N: SE mean = σ/√N → 0,001962 / 0,000620 / 0,000196 / 0,000062 (N=100/1.000/10.000/100.000); realised MC mean error −0,000149 / −0,000813 / −0,000118 / −0,000015.
- 20 batch independen N=10.000: VaR95 mean 0,0326 (sd antar-batch 0,0004; SE 0,00009), range [0,0319; 0,0333].
- GBM 10 hari (N=100.000 path): terminal mean −0,0053 (sd 0,0619), median −0,0074, VaR95 10-hari 0,1038, VaR99 10-hari 0,1408, P(rugi > 10%) 0,0572, P(rugi > 0,0903) 0,0795; √10-hist 0,0903 meremehkan ekor 10-hari — terutama karena titik awal historis 0,0286 di bawah parametrik/MC 0,0328/0,0329, ditambah drift negatif yang terakumulasi linear; √10-param 0,1037 dan √10-MC 0,1040 hampir sama dengan MC 10-hari 0,1038.
- Konvergensi [kebijakan lesson ini]: berhenti bila sd antar-batch VaR95 ≤ 0,0005 (kurang dari seperempat bootstrap sd 0,0022) — terpenuhi pada N=10.000 (sd 0,0004); ketidakpastian sampling data (bootstrap VaR95 M9.5: iid CI95 [0,0229; 0,0322], block-10 CI95 [0,0223; 0,0340]) ≈ 5,5× ketidakpastian simulasi.
- Jebakan: N besar mengecilkan MC error, bukan model error — σ 10% terlalu kecil membuat VaR ≈ 10% terlalu kecil [ilustrasi]; validasi MC adalah conceptual soundness [M8.1] + perbandingan tiga estimator.
- Mini-case: laporkan KETIGANYA (hist/param/MC) beserta ES dan asumsinya — MC bukan «yang benar», ia yang asumsi-nya paling transparan; untuk batas 1-hari, angka kerja 0,0329 dengan catatan ES historis 0,0445 untuk skenario ekstrem.
- Lab: sweep N (var95_N100000 0,0329, se_menyusut True); GBM 10-hari N=10.000 path (p5_10d 0,1038, p_loss_gt_10 0,0572, p5 > √10-hist).
- Figure: distribusi MC 1-hari (tiga VaR + ES 0,0407) dan konvergensi VaR95 vs N (pita ±1 sd menyempit 13× sementara titik bergerak 0,0006).
- Memilih generator [notebook]: EWMA-kondisional 0,0467 (σ terakhir 0,0280), GARCH-kondisional 0,0310 (σ ramalan 0,0184), FHS-GARCH 0,0270, FHS-EWMA 0,0435 — rentang ketujuh generator 0,0197; EWMA mengingat Oktober (half-life ≈11 hari), GARCH sudah lupa (≈2 hari).
- Aturan keras: JANGAN pilih generator dari backtest yang sama (jebakan M9.3 langkah 7) — pilih dari pemeriksaan asumsi, atau bagi OOS jadi dua.
