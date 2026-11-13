# MLF-M9.5: Historical Simulation & Bootstrap — Tiga Cara Menjawab «Berapa VaR?»

## Masalah: Tiga Cara Menjawab «Berapa VaR?» — dan Ketiganya Memberi Angka Berbeda

Komite risiko bertanya satu hal: «Berapa VaR95 portofolio kita besok?» Kamu punya data yang sama untuk semua orang — 480 hari SIMPLE daily returns portofolio equal-weight BBCA/KLBF/UNVR (4 November 2024 – 11 November 2026), mean harian −0,0006, sd harian 0,0196 — dan tiga cara menjawab yang sah. Historical simulation menjawab 0,0286. Metode parametrik (normal) menjawab 0,0328. Bootstrap tidak memberi jawaban keempat; ia memberi pita: CI95 [0,0229; 0,0322] di sekitar 0,0286. Tiga jawaban, satu data, selisih terbesar 0,0044 — sekitar 15% dari nilai terkecilnya. Mana yang «benar»?

Jawabannya: tidak ada yang «benar» tanpa menyebut asumsinya. Historical simulation (HS) percaya pada data apa adanya — tanpa mengasumsikan bentuk distribusi — tapi buta terhadap apa yang belum pernah terjadi. Parametrik percaya pada kurva normal — rapi dan stabil — tapi ekornya terlalu tipis untuk data yang ekornya tebal. Bootstrap tidak memberi jawaban keempat; ia memberi tahu seberapa GOYAH jawaban pertama — interval kepercayaan (CI) yang mengukur ketidakpastian SAMPLING, bukan ketidakpastian model.

Angka acuan: portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns (bukan log return), n=480 hari; hari terburuk −0,1398 pada 2026-10-16 [M9.2]; skew −0,5091 dan excess kurtosis 6,0216 (ekor tebal, miring ke kiri). Semua angka VaR/ES/CI di lesson ini berasal dari qa-learn/m9_canonical.json (HS windows + bootstrap B=10.000, seed 42), dihitung dari data, bukan karangan. Angka rujukan modul lain dikutip dengan modulnya: parametrik dari [M4.2], autokorelasi kuadrat dari [M4.3], Monte Carlo dari [M9.1], bootstrap CI kredit dari [M8.1].

---

## 1. Tiga Cara Menjawab «Berapa VaR?» — dan Ketiganya Memberi Angka Berbeda

**Nilai:** lesson ini mengubah pertanyaan «berapa VaR?» dari soal hitung-menghitung menjadi soal KEJUJURAN ASUMSI. VaR95 0,0286 tanpa menyebut metode dan jendela adalah angka yang tidak bisa diaudit — ia bisa 0,0283 (jendela 120 hari), 0,0311 (jendela 250 hari), atau 0,0328 (parametrik) — dan ketiganya dihitung dari data yang sama.

**Baik/buruk:** tiga jawaban yang berbeda itu BAGUS sebagai pelajaran — ia menunjukkan bahwa «VaR» bukan satu bilangan di alam, melainkan keluaran dari satu METODE atas satu DATA. Buruk bila dibaca sebagai «jadi semuanya terserah»: tidak terserah — tiap metode punya asumsi yang bisa diperiksa, dan data ini (kurtosis 6,02, skew −0,51, autokorelasi kuadrat lag-1 0,1043 [M4.3]) memberi tahu metode mana yang asumsinya paling jujur.

**Mitigasi:** setiap kali kamu melaporkan VaR, tulis tiga hal dalam satu kalimat — ANGKA, METODE, dan JENDELA (atau asumsi). «VaR95 0,0286» tanpa ketiganya adalah klaim yang tidak bisa diperiksa; «VaR95 HS (480 hari) 0,0286» adalah klaim yang bisa diaudit — dan bisa dibantah dengan data.

---

## 2. Historical Simulation: Kuantil Empiris — Tanpa Mengasumsikan Bentuk Apa Pun

Historical simulation (HS) adalah cara paling jujur — dan paling naif — menjawab «berapa VaR?»: urutkan 480 return harian dari yang terburuk ke yang terbaik, lalu baca kuantilnya. VaR95 adalah MINUS kuantil 5%: kerugian yang hanya dilampaui 5% hari. ES95 (Expected Shortfall) adalah MINUS rata-rata kerugian pada hari-hari yang LEBIH BURUK dari VaR95 — rata-rata ekornya. Definisi eksaknya: HS VaR = kuantil empiris dari return historis. Bukan «VaR dari data masa lalu yang pasti terulang» — masa lalu tidak berjanji terulang; HS hanya berkata «inilah yang TERJADI pada 480 hari itu, dan kuantilnya adalah ini».

**Nilai [m9_canonical.json]:** VaR95 0,0286, ES95 0,0445, VaR99 0,0479, ES99 0,0775. Dalam rupiah per Rp100 juta (portofolio IDX): VaR95 Rp2.856.323, ES95 Rp4.451.285, VaR99 Rp4.792.081, ES99 Rp7.750.165. ES95 (0,0445) jauh lebih besar dari VaR95 (0,0286) — selisih 0,0159: begitu kerugian melewati VaR, rata-rata kerugiannya 56% lebih besar. ES95 dihitung dari 24 hari terburuk (5% dari 480), sedangkan ES99 hanya dari sekitar 5 hari (1% dari 480) — jauh lebih goyah. Laporkan n ekor bersama ES.

Satu hal yang wajib eksplisit: SIMPLE vs LOG return. Semua angka HS lesson ini memakai SIMPLE daily returns — konvensi yang sama dengan M4.2 VaR dan M5. Simulasi GBM di M9 memakai LOG returns — deret yang berbeda (mean log −0,0008 vs mean simple −0,0006). Jangan campur. «Rp» di sini hanya untuk portofolio IDX ini — metrik kredit UCI memakai NT$, bukan Rp.

**Nilai:** HS bagus karena ia TIDAK MENGASUMSIKAN bentuk distribusi — ia tidak perlu percaya normal, tidak perlu percaya apa pun kecuali data. Itulah sebabnya HS menangkap ekor tebal (kurtosis 6,02) secara otomatis: hari terburuk −0,1398 pada 2026-10-16 [M9.2] ADA di dalam datanya, dan ia ikut menarik ES95 ke atas.

**Baik/buruk:** HS bagus bila datamu banyak dan mewakili — 480 hari dengan satu crash di dalamnya adalah data yang jujur. Buruk bila datamu sedikit atau bila rezimnya berganti: HS mengasumsikan 480 hari kemarin mewakili besok — asumsi stasioneritas yang tidak pernah ditulis, tapi selalu ada. Dan buruk dalam satu hal yang mendasar: ekor DI LUAR sampel tidak terlihat. Hari terburuk yang pernah terjadi adalah −0,1398 — tapi HS tidak bisa berkata apa-apa tentang hari −0,20 yang belum pernah terjadi.

**Mitigasi:** pakai HS sebagai jawaban PERTAMA — yang paling sedikit asumsi — lalu tanyakan dua hal: «apakah 480 hari ini mewakili besok?» dan «seberapa goyah kuantil ini?». HS tanpa CI adalah angka yang berpura-pura pasti; HS dengan CI adalah angka yang jujur tentang ketidakpastiannya.

---

## 3. Jendela HS: 120 vs 250 vs 480 — Jawabanmu Bergerak Mengikuti Jendelamu

**Nilai [m9_canonical.json]:** jendela 120 hari (20 Mei 2026 – 11 November 2026) → VaR95 0,0283, ES95 0,0557, VaR99 0,0472, ES99 0,0941. Jendela 250 hari (28 Oktober 2025 – 11 November 2026) → VaR95 0,0311, ES95 0,0467, VaR99 0,0464, ES99 0,0801. Jendela 480 hari (4 November 2024 – 11 November 2026) → VaR95 0,0286, ES95 0,0445, VaR99 0,0479, ES99 0,0775.

VaR95 bergerak 0,0283 → 0,0311 → 0,0286: rentang 0,0028, sekitar 10% dari nilainya — hanya karena jendelanya diganti. ES95 jendela 120 hari 0,0557 JAUH lebih besar dari ES95 jendela 480 hari 0,0445 — selisih 0,0112, atau 25% lebih besar. Penyebabnya satu hari: 2026-10-16, −0,1398 [M9.2] — hari terburuk dalam 480 hari — ADA di dalam jendela 120 hari, dan pada 120 hari ia adalah 1 dari 6 hari ekor (5% dari 120), bukan 1 dari 24. Satu hari yang sama, bobot empat kali lebih besar. ES99 jendela 120 hari 0,0941 bahkan lebih ekstrem: 1% dari 120 hari berarti ES99 dirata-rata dari sekitar satu-dua observasi terburuk (≈1,2 hari).

**Nilai:** perbandingan tiga jendela ini membuat trade-off-nya TERLIHAT dengan angka, bukan dengan slogan. Jendela pendek (120 hari) RESPONSIF: ia menangkap crash Oktober 2026 dengan bobot penuh. Jendela panjang (480 hari) STABIL: satu hari buruk tenggelam dalam 479 hari lain.

**Baik/buruk:** jendela pendek bagus bila rezim BARU saja dimulai dan kamu ingin VaR yang cepat meresponsnya — dan buruk karena ia BERISIK: ES99 dari sekitar satu-dua observasi terburuk (≈1,2 hari) bukanlah estimasi, melainkan satu-dua observasi yang menyamar sebagai estimasi. Jendela panjang bagus bila kamu ingin estimasi yang stabil dan ekor yang dihitung dari banyak hari (24 hari untuk ES95) — dan buruk karena ia LAMBAT: bila rezim berganti hari ini, VaR 480-hari baru «menyadari»-nya setelah hari-hari baru menumpuk. Jendela 250 hari adalah kompromi yang umum — tetapi «umum» bukan argumen: 250 adalah pilihan [kebijakan lesson ini] bila kamu memakainya sebagai default, bukan hukum alam.

**Mitigasi:** laporkan VaR HS selalu BERSAMA jendelanya — «VaR95 HS (480 hari) 0,0286» — dan, bila keputusannya penting, laporkan dua jendela (pendek dan panjang) berdampingan. Bila keduanya jauh berbeda (di sini ES95 0,0557 vs 0,0445), selisih itu SENDIRI adalah informasi: ia berkata «ada satu peristiwa besar di jendela pendek yang jendela panjang encerkan» — dan komite berhak tahu peristiwa apa itu (2026-10-16, −0,1398).

---

## 4. Parametrik: Kurva Normal yang Rapi — dan Ekor yang Ia Tipiskan

Metode parametrik menjawab «berapa VaR?» dengan rumus: asumsikan return berdistribusi NORMAL dengan mean dan sd dari data. **Nilai [M4.2]** — mean harian −0,0006, sd harian 0,0196: VaR95 0,0328, ES95 0,0410, VaR99 0,0462, ES99 0,0528. Dalam rupiah per Rp100 juta: VaR95 Rp3.280.000, ES95 Rp4.100.000.

Bandingkan dengan HS 480 hari: VaR95 parametrik 0,0328 LEBIH BESAR dari HS 0,0286 (selisih 0,0042 — param 14,7% lebih besar), tetapi ES95 parametrik 0,0410 LEBIH KECIL dari HS 0,0445 (selisih −0,0035). Inilah pelajaran kunci lesson ini. Intuisi yang salah berkata: «distribusi ini ekornya tebal (kurtosis 6,02), jadi VaR historis PASTI lebih besar dari VaR normal». Data ini MENYANGKAL intuisi itu: VaR95 hist (0,0286) LEBIH KECIL dari param (0,0328). Yang gemuk bukan kuantil 5%-nya — kuantil 5% empiris justru lebih kecil dari kuantil 5% normal. Yang gemuk adalah BEYOND-VaR — ekor DI BALIK VaR: ES95 hist (0,0445) LEBIH BESAR dari param (0,0410), dan ES99 hist (0,0775) JAUH lebih besar dari param (0,0528) — selisih 0,0247, atau 47% lebih besar. Satu hari −0,1398 berjarak 7,1 sd dari mean — di bawah normal, peristiwa 7 sd praktis mustahil. Skew −0,5091 menambah arahnya: ekor kirinya (kerugian) lebih panjang dari ekor kanannya.

**Nilai:** parametrik bagus karena ia STABIL dan LENGKAP: dua angka (mean, sd) menentukan seluruh kurva — VaR berapa pun horizonnya, ES berapa pun alphanya, tanpa butuh 480 hari data. Ia juga memberi jawaban untuk ekor yang belum pernah terjadi: normal bisa berkata tentang hari −0,20, HS tidak bisa.

**Baik/buruk:** normal bagus bila datamu memang mendekati normal — dan cukup bila yang kamu butuhkan hanya VaR95 untuk horizon pendek, karena di kuantil 5% selisihnya hanya 0,0042. Buruk — dan menipu — bila yang kamu butuhkan adalah ES, terutama ES99: param 0,0528 vs hist 0,0775 adalah selisih 0,0247 yang TIDAK bisa diabaikan, karena ES-lah yang mengukur «seberapa buruk bila VaR terlampaui». Normal menipu tepat di tempat yang paling penting: di ujung ekor, saat kerugian sudah melampaui VaR.

**Mitigasi:** pakai parametrik sebagai PEMBANDING, bukan sebagai jawaban tunggal — dan selalu sandingkan VaR-nya dengan ES-nya. Bila VaR param > VaR hist TAPI ES param < ES hist (seperti di sini), tuliskan kalimat ini di laporanmu: «kuantil 5% empiris lebih kecil dari normal, tetapi ekor di balik VaR lebih gemuk dari normal». Kalimat itu — bukan «distribusi lebih gemuk» yang generik — adalah kesimpulan yang benar dari data ini.

---

## 5. Bootstrap iid: Bukan Jawaban Keempat — Melainkan Pita di Sekitar Jawaban Pertama

Bootstrap: ambil 480 hari itu, tarik-ulang 480 hari DENGAN pengembalian — itu satu «sejarah alternatif» — hitung VaR95-nya; ulangi B=10.000 kali (seed 42); lalu baca sebaran 10.000 VaR95 itu. Definisi eksaknya: bootstrap CI = ketidakpastian SAMPLING — seberapa goyah statistikmu bila sampelnya ditarik ulang dari data yang sama. Ia BUKAN ketidakpastian model: ia tidak berkata apa-apa tentang apakah HS, parametrik, atau Monte Carlo yang benar — ia berkata «ANDAIKAN HS yang dipakai, seberapa goyah 0,0286 itu?».

**Nilai [m9_canonical.json] — bootstrap iid, B=10.000, seed 42:** VaR95: mean bootstrap 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]. ES95: mean 0,0440, sd 0,0057, CI95 [0,0346; 0,0569]. Mean bootstrap VaR95 (0,0284) hampir sama dengan VaR95 HS (0,0286) — selisih 0,0002: HS tidak bias secara berarti di sini. CI VaR95 selebar 0,0093 — VaR95 «0,0286» itu sebenarnya «antara 0,0229 dan 0,0322». CI ES95 selebar 0,0223 — 2,4 kali lebih lebar dari CI VaR95: ES dihitung dari 24 hari ekor, jadi ia jauh lebih goyah daripada VaR yang dihitung dari seluruh 480 hari. Batas ATAS CI VaR95 (0,0322) hampir menyentuh VaR95 parametrik (0,0328) — tetapi TIDAK mencapainya: 0,0328 berada DI LUAR CI [0,0229; 0,0322].

Jangan pernah menulis VaR95 sebagai «0,0284 ± 0,0022» — itu menyajikan sd bootstrap (0,0022) sebagai ketidakpastian MEAN, kesalahan yang sama dengan yang diperbaiki di M6.2/M6.5. Yang benar: «VaR95 HS 0,0286, CI95 bootstrap [0,0229; 0,0322]» — intervalnya yang dilaporkan, bukan «mean ± sd».

**Nilai:** bootstrap iid bagus karena ia MURAH dan JUJUR — tidak butuh asumsi distribusi (seperti HS) dan tidak butuh data baru: 10.000 sejarah alternatif dari 480 hari yang sama.

**Baik/buruk:** bootstrap iid bagus bila observasi hariannya (hampir) saling bebas — asumsi «iid» di namanya. Buruk bila returnnya ber-autokorelasi: menarik hari secara acak MEMUTUSKAN urutan waktu — dan CI yang dihasilkan TERLALU SEMPIT. Di data ini autokorelasi kuadrat lag-1 adalah 0,1043 [M4.3] — volatilitas bergerombol — jadi CI iid ini adalah batas BAWAH kelebaran yang benar, bukan jawaban akhirnya.

**Mitigasi:** laporkan VaR HS selalu BERSAMA CI bootstrap-nya — «VaR95 HS 0,0286, CI95 [0,0229; 0,0322]» — dan tulis metode bootstrap-nya (iid atau block, B, seed) di sampingnya. CI tanpa metode sama tidak bergunanya dengan VaR tanpa metode.

---

## 6. Block Bootstrap: Menjaga Urutan Waktu — dan CI yang Melebar Karenanya

Obat untuk autokorelasi: MOVING-BLOCK bootstrap — alih-alih menarik satu hari, tarik BLOK 10 hari berturut-turut (48 blok untuk 480 hari), sehingga gerombol volatilitas di dalam blok tetap utuh; blok ditarik ulang DENGAN pengembalian — satu blok boleh muncul dua kali, blok lain boleh hilang — jadi bukan sekadar urutan antar-blok yang diacak. Panjang blok 10 di sini adalah pilihan [kebijakan lesson ini] — bukan hukum alam.

**Nilai [m9_canonical.json] — block bootstrap, blok 10, B=10.000, seed 42:** VaR95: mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0340]. ES95: mean 0,0440, sd 0,0062, CI95 [0,0333; 0,0572]. Mean-nya hampir sama dengan iid (VaR95 0,0285 vs 0,0284; ES95 0,0440 vs 0,0440) — dependensi waktu tidak menggeser TITIK estimasinya. Yang berubah adalah LEBARNYA: sd VaR95 naik dari 0,0022 menjadi 0,0029 — naik 0,0007, atau +32%. CI VaR95 melebar dari 0,0093 menjadi 0,0117 — 26% lebih lebar. Perhatikan batas atas CI block (0,0340): ia MELINTASI VaR95 parametrik 0,0328 — interval block MENCANGKUP 0,0328, sementara interval iid [0,0229; 0,0322] tidak mencapainya. Begitu dependensi waktu diakui, perbedaan HS vs param tidak lagi «di luar noise» — ia berada di dalam pita.

**Nilai:** block bootstrap bagus karena ia mengakui data apa adanya — dependensi waktu adalah FAKTA data ini (0,1043 [M4.3]), bukan gangguan yang bisa diabaikan. CI yang melebar 26% bukanlah «hasil yang lebih buruk» — ia adalah hasil yang lebih JUJUR: CI iid yang sempit adalah kepastian yang palsu.

**Baik/buruk:** block bootstrap bagus bila datamu ber-autokorelasi — return saham, dengan volatilitas yang bergerombol, hampir selalu begitu — dan buruk bila dipakai tanpa berpikir: panjang blok adalah pilihan, dan pilihan itu memengaruhi jawaban. Buruk juga bila blok dianggap «obat mujarab»: block bootstrap menjaga dependensi JARAK PENDEK (di dalam 10 hari), tetapi ia tidak menjaga pergeseran REZIM — crash Oktober 2026 yang muncul sebagai satu blok utuh tetap bisa hilang seluruhnya dari satu ulangan, atau muncul dua kali.

**Mitigasi:** bila datamu punya autokorelasi kuadrat yang nyata (di sini 0,1043 [M4.3]), laporkan CI BLOCK sebagai CI utamamu — dan CI iid sebagai pembanding yang menunjukkan «seberapa besar dependensi itu menggelembungkan ketidakpastian». Tulis panjang blokmu («blok 10 [kebijakan lesson ini]») agar pembaca bisa mereplikasi dan menantangnya.

---

## 7. Tabel Tiga Arah: HS vs Parametrik vs Bootstrap — Kapan Pakai yang Mana

HS (480 hari): VaR95 0,0286, ES95 0,0445 — tanpa asumsi distribusi; butuh banyak data; buta terhadap ekor di luar sampel. Parametrik (normal): VaR95 0,0328, ES95 0,0410 — stabil, lengkap, bisa ekstrapolasi ke ekor yang belum terjadi; menipiskan ekor bila kurtosis tinggi (di sini ES99-nya 0,0528 vs HS 0,0775). Monte Carlo [M9.1] (N=100.000, lognormal pada log returns): VaR95 0,0329, ES95 0,0407 — pembanding keempat, hampir sama dengan parametrik (selisih 0,0001) karena ia memakai asumsi yang sekeluarga (normal pada log returns). Bootstrap: bukan jawaban — pita: VaR95 iid CI95 [0,0229; 0,0322], block CI95 [0,0223; 0,0340]; ES95 iid CI95 [0,0346; 0,0569], block [0,0333; 0,0572].

Aturan pakainya — tiga pertanyaan sebelum memilih. Satu: SEBERAPA BANYAK datamu? Bila n kecil (di bawah ~250 hari), kuantil empirisnya goyah — parametrik atau Monte Carlo lebih stabil, dengan catatan ekornya. Bila n besar (480 hari di sini), HS menjadi jawaban pertama yang sah. Dua: SEBERAPA TEBAL ekormu? Bila excess kurtosis mendekati 0 dan skew mendekati 0, normal cukup. Bila kurtosis 6,02 seperti di sini, HS wajib ada di meja — dan ES-nya wajib dilaporkan, karena di situlah normal menipu. Tiga: APA YANG DITANYAKAN? Bila yang ditanya «berapa VaR besok?» — jawab dengan HS + CI block. Bila yang ditanya «berapa VaR skenario yang belum pernah terjadi?» — HS tidak bisa menjawab; parametrik atau Monte Carlo yang menjawab, dengan catatan asumsinya. Dan bila yang ditanya «seberapa yakin kamu?» — hanya bootstrap yang menjawab.

**Nilai:** tabel tiga arah ini mengubah perdebatan «metode mana yang benar» menjadi keputusan yang bisa diaudit: tiap metode dicantumkan bersama ASUMSINYA dan KONDISI PAKAINYA.

**Baik/buruk:** memakai SATU metode saja itu buruk bila metodenya tidak cocok dengan datamu — parametrik saja di data berkurtosis 6,02 berarti ES99 yang salah 0,0247; HS saja di n=120 berarti ES99 dari sekitar satu-dua observasi terburuk (≈1,2 hari). Memakai ketiganya dan MELAPORKAN ketiganya itu bagus — bukan karena «lebih banyak lebih baik», melainkan karena selisih antar-metode adalah INFORMASI: selisih HS vs param (VaR95 0,0042, ES95 −0,0035) berkata «ekor di balik VaR lebih gemuk dari normal».

**Mitigasi:** di laporan risiko, buat tabel ini menjadi BAGIAN TETAP: satu baris per metode (HS + jendela, parametrik, Monte Carlo [M9.1]), satu kolom VaR95, satu kolom ES95, satu kolom asumsi — dan satu baris bootstrap CI di bawahnya. Bila satu metode memberi angka yang jauh dari yang lain, jangan sembunyikan selisihnya: selisih itu adalah temuan.

---

## 8. Bootstrap untuk Metrik Lain: Drift Negatif yang Ternyata Tidak Signifikan

Bootstrap bukan alat khusus VaR — ia alat umum untuk «statistik apa pun + pita». Mean daily return: point estimate −0,0006. Bootstrap iid (B=10.000, seed 42): CI95 mean return adalah [−0,0024; +0,0012] — interval yang MENCANGKUP 0. Artinya: drift negatif −0,0006 TIDAK SIGNIFIKAN — data ini tidak cukup bukti untuk mengklaim mean return-nya berbeda dari nol. Perhatikan bahasanya: «tidak signifikan» — bukan «mean-nya nol». CI yang mencakup 0 berarti «tidak terbukti berbeda dari nol», bukan «terbukti sama dengan nol».

Pola yang sama sudah kamu lihat di kredit — dan lesson ini hanya merujuknya, bukan menghitung ulang: di [M8.1], bootstrap CI dipakai untuk bad rate (6,67% CI95 [5,47%; 7,85%]), ECE (0,0087 CI95 [0,0077; 0,0214] — batas atasnya MELINTASI ambang lolos 0,02), dan profit (+NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]). Polanya identik: satu angka titik, satu interval, satu pertanyaan «apakah interval ini mencakup nilai yang penting?» — 0 untuk mean return, 0,02 untuk ECE, 0 untuk selisih antar-half.

**Nilai:** langkah ini menunjukkan bootstrap sebagai KEBIASAAN, bukan sebagai trik VaR: tiap kali kamu melaporkan satu angka — mean return, bad rate, ECE, profit — tanyakan «berapa pitanya?» dan «apakah pita itu mencakup nilai yang akan mengubah keputusanku?».

**Baik/buruk:** CI mean return ini bagus sebagai CONTOH KEJUJURAN — ia menunjukkan bahwa 480 hari pun belum cukup untuk membuktikan drift sekecil 0,06% per hari (sd harian 0,0196 adalah ≈33 kali lebih besar dari mean-nya — dengan μ terbulat 0,0006; dengan μ eksak ≈35 kali). Buruk bila dibaca sebagai «jadi mean return tidak penting»: mean return TIDAK penting untuk VaR 1-hari, tetapi ia penting untuk horizon panjang — dan CI-nya berkata «kamu belum tahu tandanya».

**Mitigasi:** untuk setiap statistik yang masuk keputusan, laporkan CI-nya dan SEBUTKAN nilai pembanding yang dicakup atau tidak dicakup interval itu: «CI mean return [−0,0024; +0,0012] mencakup 0 — drift tidak signifikan». Satu kalimat itu mencegah satu kesalahan besar: mengira noise adalah sinyal.

---

## 9. Jebakan: CI Sempit yang Palsu — dan Blok yang Bukan Obat Mujarab

Jebakan pertama: bootstrap iid pada data ber-autokorelasi memberi CI yang TERLALU SEMPIT — dan CI yang terlalu sempit adalah kepastian yang palsu. CI95 VaR95 iid [0,0229; 0,0322], lebar 0,0093; CI95 block-10 [0,0223; 0,0340], lebar 0,0117. Bila kamu melaporkan CI iid, VaR95 parametrik 0,0328 jatuh DI LUAR intervalmu — kamu menyimpulkan «HS dan param berbeda secara nyata». Bila kamu melaporkan CI block, 0,0328 jatuh DI DALAM intervalmu — kesimpulanmu berubah menjadi «perbedaannya masih di dalam noise». Satu pilihan (iid vs block) membalik kesimpulan — dan pilihan yang benar ditentukan data: autokorelasi kuadrat lag-1 0,1043 [M4.3].

Jebakan kedua: mengira block bootstrap adalah OBAT MUJARAB. Bukan. Block bootstrap menjaga dependensi jarak pendek (di dalam 10 hari) — tetapi panjang bloknya adalah PILIHAN: 10 di sini [kebijakan lesson ini], bukan hukum alam. Dan tidak ada panjang blok yang menjaga PERGESERAN REZIM: bila Oktober 2026 adalah rezim baru, tidak ada resampling dari 480 hari kemarin yang bisa menciptakan rezim yang belum ada di data.

**Nilai:** langkah ini menunjukkan bahwa «metode yang benar» pun punya syarat pakai — bootstrap iid benar untuk data iid, block benar untuk data ber-autokorelasi jarak pendek, dan keduanya salah untuk data yang rezimnya bergeser.

**Baik/buruk:** CI iid yang sempit itu buruk BUKAN karena angkanya kecil — 0,0093 adalah angka yang sah untuk data iid — melainkan karena ia dipakai pada data yang TIDAK iid. Kesalahan yang sama, dalam bentuk lain: memakai VaR HS jendela 120 hari (ES99 dari sekitar satu-dua observasi terburuk (≈1,2 hari)) sebagai «estimasi» — angka yang sah secara aritmetika, salah secara pemakaian.

**Mitigasi:** sebelum bootstrap apa pun, periksa autokorelasinya — di sini kuadrat lag-1 0,1043 [M4.3] — dan pilih iid atau block BERDASARKAN angka itu, bukan berdasarkan kebiasaan. Tulis pilihanmu («block-10 [kebijakan lesson ini]») dan laporkan CI iid sebagai pembanding, agar pembaca melihat harga kejujuranmu: sd naik +32% (0,0022 → 0,0029) dan lebar CI melebar +26% (0,0093 → 0,0117) — lebar CI persentil tidak harus naik sebanding sd karena bentuk sebarannya ikut berubah.

---

## Lab 1: Sensitivitas Jendela HS + Tabel Tiga Arah

Hitung sendiri sensitivitas jendela dan tabel tiga arah dari angka kanonis [m9_canonical.json]. Jendela HS: 120 hari → VaR95 0,0283, ES95 0,0557; 250 hari → VaR95 0,0311, ES95 0,0467; 480 hari → VaR95 0,0286, ES95 0,0445. Parametrik [M4.2]: VaR95 0,0328, ES95 0,0410. Monte Carlo [M9.1] (N=100.000): VaR95 0,0329, ES95 0,0407.

Hasil [lab]: var95_w120=0.0283; var95_w480=0.0286; var95_range=0.0028; es95_gap_w120_w480=0.0112; hs_param_var95_gap=0.0042; hs_param_es95_gap=-0.0035; es95_hist_gt_param=True. Dua baris terakhir bertanda BERLAWANAN — dan itu memang yang benar: kuantil 5% empiris lebih kecil dari normal, tetapi ekor di balik VaR lebih gemuk dari normal.

---

## Lab 2: iid vs Block Bootstrap CI untuk VaR95

Bootstrap yang sesungguhnya — di browser, dengan numpy saja — atas 480 SIMPLE daily returns portofolio yang sama. B kanonis adalah 10.000 [m9_canonical.json]; lab memakai B=2.000 agar ringan di browser — CI-nya sedikit lebih berisik, dan karena B lab ≠ B kanonis, lab ini TIDAK menilai nilai eksak CI — ia menilai PERBANDINGAN: lebar CI block harus LEBIH BESAR dari lebar CI iid. Seed 42 (sama dengan kanonis).

Hasil [lab]: var95_iid_mean=0.0283; var95_blk_mean=0.0285; ci_iid=[0.0229; 0.0322] lebar_ci_iid=0.0093; ci_blk=[0.0229; 0.0340] lebar_ci_blk=0.0111; ci_block_lebih_lebar=True. Mean-nya hampir sama (0,0283 vs 0,0285) — dependensi waktu tidak menggeser titiknya. Pelebaran CI block datang terutama dari sisi kanan: ulangan block lebih sering menghasilkan VaR95 yang besar, karena satu blok berisi 10 hari bergejolak berturut-turut lebih sering «menarik» kuantil ke atas. Bandingkan dengan kanonis B=10.000: CI iid [0,0229; 0,0322] dan CI block [0,0223; 0,0340] — batas bawah kanonis block (0,0223) sedikit lebih rendah dari batas bawah lab (0,0229); itu noise B=2.000, bukan kesalahan.

---

## 12. Mini-case: Laporkan VaR95 dengan CI-nya ke Komite

Jawaban lesson ini: «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; parametrik 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk — dalam rupiah per Rp100 juta: VaR95 Rp2.856.323, ES95 Rp4.451.285.»

Tiap potong kalimat itu ada alasannya. «HS (480 hari)» — metodenya dan jendelanya, agar komite bisa mereplikasi dan menantang. «0,0286» — titiknya. «CI95 bootstrap block-10 [0,0223; 0,0340]» — pitanya, dari metode yang MENGAKUI dependensi waktu (autokorelasi kuadrat lag-1 0,1043 [M4.3]) — bukan CI iid [0,0229; 0,0322] yang lebih sempit tetapi palsu untuk data ini. «Parametrik 0,0328 sebagai pembanding» — metode kedua, agar komite melihat selisih antar-metode (0,0042) dan tahu bahwa selisih itu berada DI DALAM CI block. «ES95 0,0445 karena ekor gemuk» — angka yang sebenarnya menentukan cadangan kerugian bila VaR terlampaui: ES95 HS lebih besar dari param (0,0410), dan ES99 HS (0,0775) jauh lebih besar dari param (0,0528).

Yang TIDAK boleh ada di slide itu: «VaR95 0,0286» sendirian (tanpa metode dan jendela — tidak bisa diaudit); «VaR95 0,0284 ± 0,0022» (mean ± sd bootstrap — kesalahan M6.2/M6.5); «ekor gemuk, jadi VaR hist pasti lebih besar» (salah di data ini — VaR hist LEBIH KECIL dari param; yang gemuk adalah beyond-VaR); dan «CI95 [0,0229; 0,0322]» tanpa kata «iid» atau «block» (CI tanpa metode sama tidak bergunanya dengan VaR tanpa metode).

**Nilai:** mini-case ini melatih SATU kebiasaan yang membedakan analis risiko dari kalkulator: melaporkan ketidakpastian BERSAMA estimasi, dengan metode yang tertulis. Komite tidak menghukum analis yang CI-nya lebar — ia menghukum analis yang CI-nya sempit karena metodenya salah.

**Baik/buruk:** jawaban satu kalimat itu bagus bila tiap potongnya bisa ditelusur ke angka kanonis (0,0286; [0,0223; 0,0340]; 0,0328; 0,0445 — semuanya dari m9_canonical.json dan [M4.2]). Buruk bila satu potongnya hilang: tanpa CI, komite mengira 0,0286 itu pasti; tanpa pembanding param, komite tidak tahu ada metode kedua yang berkata 0,0328; tanpa ES, komite mengira «melewati VaR» berarti «rugi 0,0286» — padahal rata-rata kerugiannya bila VaR terlampaui adalah 0,0445.

**Mitigasi:** jadikan kalimat ini TEMPLATE laporan VaR-mu — «VaR95 [metode] ([jendela]) [angka], CI95 bootstrap [blok] [interval]; [metode pembanding] [angka] sebagai pembanding; ES95 [angka] karena [alasan ekor]» — dan isi kurungnya dari data setiap kali, bukan dari ingatan.

---

## 13. Memilih Panjang Blok: 5, 10, atau 20 — CI Melebar dengan Blok

Lesson ini memakai block bootstrap dengan panjang blok 10 [kebijakan lesson ini] — tapi MENGAPA 10? Hitungan baru [notebook], B=10.000, seed 42, stream segar per panjang: blok 5 → VaR95 mean 0,0284, sd 0,0027, CI95 [0,0229; 0,0335], lebar 0,0106 (96 blok per draw, 476 blok distinct); blok 10 → mean 0,0286, sd 0,0028, CI95 [0,0223; 0,0340], lebar 0,0117 (48 blok, 471 distinct); blok 20 → mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0353], lebar 0,0130 (24 blok, 461 distinct).

**Nilai:** lebar CI naik +10,4% (5→10) dan +11,1% (10→20) — total +22,6% dari blok 5 ke blok 20 [turunan]. Pelebarannya terutama dari sisi ATAS CI (0,0335 → 0,0340 → 0,0353; sisi bawah stabil 0,0229 → 0,0223 → 0,0223) — dependensi hidup di ekor kanan. Blok 10 di sini adalah hitungan ulang: sd 0,0028 vs kanonis 0,0029, CI sama persis [0,0223; 0,0340] — selisih 0,0001 adalah noise MC antar-stream [notebook].

**Baik/buruk:** blok bagus bila panjangnya dipilih karena STRUKTUR datamu (autokorelasi kuadrat lag-1 0,1043 [M4.3] menuntut blok yang cukup panjang untuk gerombol beberapa hari). Buruk bila dipilih karena HASILNYA (CI paling sempit) — itu scenario shopping versi bootstrap. Block bootstrap TIDAK menjaga pergeseran rezim.

**Mitigasi:** laporkan SELALU tiga panjang blok beserta lebar CI-nya. Alternatif yang cukup disebut namanya: circular bootstrap dan stationary bootstrap.

---

## 14. Pipeline M8→M9: Satu Pola, Dua Dunia

Champion tervalidasi [M8.1] → Exposure + keputusan [M8.2] → Distribusi kerugian [M8.2] → VaR / ES [M9.1 · M9.5] → Limit & monitoring [M8.5 · M9.3].

Contoh kredit (M8): champion GBM terkalibrasi ROC-AUC 0,7816 [M8.1]; threshold 0,10 → approved NT$424.180.000 dari total LIMIT NT$1.007.777.680 (42,09% [M8.2]); EAD = LIMIT_BAL → EL approved NT$11.989.453, EL semua test NT$78.675.378 [M8.2]. Contoh pasar (M9): distribusi return 480 hari → VaR95 HS 0,0286, ES95 0,0445, param 0,0328, MC 0,0329; limit dari VaR/ES, dimonitor backtest (M9.3) + drift (M7.5), revalidasi ≤12 bulan [M8.5].

**Peringatan:** JANGAN baca figure ini sebagai «VaR95 0,0286 dihitung dari EL NT$11.989.453» — itu salah. Yang SAMA adalah polanya: model tervalidasi → exposure → distribusi kerugian → VaR/ES → limit. VaR tidak memvalidasi champion; champion yang tervalidasi memvalidasi VaR.

---

## 15. Kerangka Horizon: Empat Jendela yang Sering Tertukar

| Horizon | Estimation window | Backtest window | HS window |
|---|---|---|---|
| 1 hari | 480 hari | rolling-250 · OOS 230 | 480 hari |
| 10 hari | 480 hari (MC) | 48 jendela | return 10-hari |
| 1 bulan | 480 hari | ≈22 jendela | — |

**Nilai:** horizon 10 hari → estimation tetap 480 hari (via MC paths M9.1, BUKAN skala √10 mentah: 0,0903 vs MC 0,1038); backtest 10-hari hanya 48 jendela non-overlapping [turunan] — Kupiec hampir tidak punya kuasa (diharapkan 2,4 exceedance [turunan]); horizon 1 bulan → sekitar 22 jendela [turunan] (diharapkan 1,1 exceedance [turunan]).

**Baik/buruk:** unit observasi adalah pilihan kelima yang tersembunyi — seluruh M9 memakai return HARIAN (n=480); return MINGGUAN memberi n=96 [turunan]. «250 hari» Basel adalah hari PERDAGANGAN, bukan kalender.

**Mitigasi:** di setiap laporan, tulis satu baris desain — «Horizon 1 hari · estimation 480 hari · backtest rolling-250 (OOS 230) · HS 480 hari · unit daily» — dan bila horizon ≠ 1 hari, tulis JUGA berapa jendela non-overlapping yang tersisa. Bila angkanya < 100 [kebijakan lesson ini], katakan terus terang: backtest-mu hampir tidak punya kuasa.

---

## 16. Artefak Keputusan Lintas-Metode: Satu Halaman, Delapan Baris

M8.3 sudah punya template model card (17 kolom wajib) — template itu menjawab «model ini APA». Artefak ini menjawab «dengan angka-angka ini, KEPUTUSAN apa» — dan SENGAJA tidak menduplikasi field model card.

Delapan baris [kebijakan lesson ini]: (1) Keputusan; (2) Metode (HS 480 hari + parametrik + MC [M9.1] + bootstrap block-10); (3) Angka (VaR95 HS 0,0286, CI95 block [0,0223; 0,0340], ES95 0,0445, param 0,0328 sebagai pembanding); (4) Validasi (Kupiec p = 0,3108 lolos, severity 1,1163 gagal kedalaman, independence p = 0,0099 gagal); (5) Batas (asumsi yang gagal, rezim pasca-crash Oktober 2026); (6) Verdict — SATU kata: LOLOS / LOLOS-BERSYARAT / TIDAK LOLOS; (7) Tindak lanjut (pemilik, revalidasi ≤12 bulan [M8.5], pemicu review ulang); (8) Tanda tangan.

**Mitigasi:** JANGAN pernah menerbitkan artefak dengan baris (6) kosong — verdict yang tidak ditulis adalah keputusan yang tidak diambil. Bila model card dan artefak bertentangan, yang terbaru menang dan ketidaksesuaiannya dicatat di issue register (M8.1 langkah G3).

---

## 17. Operating Loop: Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur

Ukur (HS/param/MC + generator + propagasi) → Uji (Kupiec + severity + independence, M9.3) → Putuskan (limit, threshold, generator — artefak keputusan langkah 16) → Pantau (drift PSI [M7.5], backtest berjalan) → Revalidasi (≤12 bulan [M8.5]) → Ukur lagi.

**Nilai:** bila backtest gagal, kembali ke UKUR dengan jendela/generator baru — BUKAN ke Putuskan dengan ambang yang dilonggarkan. Melonggarkan ambang agar model «lolos» adalah scenario shopping (M9.2 langkah 12) dengan baju baru. Loop yang sehat memperbaiki PENGUKURAN; loop yang sakit memperbaiki AMBANG. Revalidasi adalah pintu kembali, bukan garis finis.

---

## 18. Setelah Track: Empat Jalur, Satu Artefak

Tidak ada M10 — dan itu disengaja. Empat jalur: (1) Market risk quant — FHS dan EVT (merujuk M9.1 langkah 13 untuk FHS); (2) Model validation — uji ES formal Acerbi–Szekely (dirujuk M9.3 langkah 13) dan standar SR 11-7; (3) Credit risk — IRB dan IFRS 9 staging penuh (M2, M8); (4) Fraud/AML analytics — sistem triase produksi (M3, Siskamling, M7.5). Dua topik yang sengaja TIDAK ada di keempat jalur itu: forecasting deret waktu (ARIMA, Prophet, LSTM) dan NLP keuangan (sentimen berita, parsing laporan) — keduanya adalah track tersendiri, bukan modul yang tertunda (lihat MLF1 langkah 9).

Matriks gap→skill→artefak: «ekor di luar sampel» → FHS/EVT → laporan VaR dengan EVT; «uji ES formal» → Acerbi–Szekely → backtest ES; «drift di produksi» → PSI live → dashboard monitoring (M7.5); «stress regulasi» → skenario makro → laporan stress ala ICAAP; «threshold bisnis» → profit/LGD/margin → artefak keputusan (langkah 16); «meramal harga besok» → forecasting deret waktu (ARIMA/Prophet/LSTM) → track forecasting tersendiri; «membaca teks keuangan» → NLP (sentimen berita, parsing laporan) → track NLP tersendiri. Pilih SATU jalur dan SATU artefak.

---

## Guided Task di Colab

Notebook: colab/mlf-m95-guided-task.ipynb — HS 480 hari + parametrik, jendela 120/250/480, bootstrap iid B=10.000, block bootstrap blok 10 + CI mean return, dan laporan komite satu kalimat. Tautan Colab: https://colab.research.google.com/drive/1fzGlXJu5s7zscGzwZPeZiSwidBLupv4T

## Rangkuman

- Tiga jawaban VaR95 atas data yang sama (SIMPLE returns, n=480): HS (480 hari) 0,0286, parametrik [M4.2] 0,0328, Monte Carlo [M9.1] 0,0329 (N=100.000), bootstrap mean 0,0284 — VaR bukan satu bilangan, melainkan keluaran dari satu metode atas satu data.
- Historical simulation = kuantil empiris, tanpa asumsi distribusi: VaR95 0,0286, ES95 0,0445 (24 hari terburuk), VaR99 0,0479, ES99 0,0775 (sekitar 5 hari); Rp per Rp100 juta: VaR95 Rp2.856.323, ES95 Rp4.451.285.
- Jendela HS mengubah jawaban: 120 hari → VaR95 0,0283, ES95 0,0557; 250 hari → 0,0311 / 0,0467; 480 hari → 0,0286 / 0,0445 — VaR95 bergerak 0,0028 (sekitar 10%); ES95 jendela 120 hari 25% lebih besar karena hari −0,1398 (2026-10-16 [M9.2]) berbobot empat kali lebih besar.
- Parametrik [M4.2]: VaR95 0,0328, ES95 0,0410, VaR99 0,0462, ES99 0,0528 — VaR95 hist LEBIH KECIL dari param, tetapi ES95 hist LEBIH BESAR dari param dan ES99 hist (0,0775) jauh di atas param (0,0528): kuantil 5% empiris lebih kecil dari normal, ekor DI BALIK VaR lebih gemuk dari normal.
- Bootstrap iid (B=10.000, seed 42): VaR95 mean 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]; ES95 mean 0,0440, sd 0,0057, CI95 [0,0346; 0,0569] — CI mengukur ketidakpastian SAMPLING; laporkan intervalnya, bukan «mean ± sd».
- Block bootstrap (blok 10 [kebijakan lesson ini], B=10.000, seed 42): VaR95 mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0340]; ES95 mean 0,0440, sd 0,0062, CI95 [0,0333; 0,0572] — sd naik +32% karena autokorelasi kuadrat lag-1 0,1043 [M4.3]; CI block MENCANGKUP VaR95 param 0,0328, CI iid tidak.
- Tabel tiga arah: HS untuk n besar tanpa asumsi; parametrik untuk stabilitas dan ekor yang belum terjadi; Monte Carlo [M9.1] sebagai pembanding; bootstrap untuk pitanya — selisih antar-metode adalah informasi, bukan gangguan.
- Bootstrap untuk metrik lain: mean daily return −0,0006, CI95 (iid) [−0,0024; +0,0012] — mencakup 0, drift negatif TIDAK signifikan; pola yang sama dengan [M8.1] (bad rate, ECE, profit beserta CI-nya).
- Jebakan: bootstrap iid pada data ber-autokorelasi = CI terlalu sempit (0,0093 vs 0,0117); block bukan obat mujarab — panjang blok adalah pilihan [kebijakan lesson ini] dan ia tidak menjaga pergeseran rezim.
- Lab: sensitivitas jendela (var95_range 0,0028; es95_gap_w120_w480 0,0112; hs_param_es95_gap −0,0035; es95_hist_gt_param True) dan bootstrap B=2.000 (lebar CI block 0,0111 [lab] > lebar CI iid 0,0093).
- Mini-case: «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; param 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk».
- Memilih panjang blok (langkah 13) [notebook]: blok 5/10/20 → lebar CI 0,0106/0,0117/0,0130 (+22,6% dari 5 ke 20 [turunan]); blok 10 hitungan ulang mereproduksi kanonis (sd 0,0028 vs 0,0029).
- Pipeline M8→M9 (langkah 14, figure): satu pola, dua dunia — champion [M8.1] → exposure [M8.2] → distribusi kerugian → VaR/ES → limit; VaR95 0,0286 TIDAK dihitung dari EL NT$11.989.453.
- Kerangka horizon (langkah 15): horizon ≠ estimation window ≠ backtest window ≠ HS window — 10-hari hanya punya 48 jendela non-overlapping [turunan]; 1 bulan sekitar 22 [turunan].
- Artefak keputusan (langkah 16) [kebijakan lesson ini]: delapan baris lintas-metode, verdict satu kata — cross-ref model card M8.3, JANGAN duplikasi field.
- Operating loop (langkah 17, figure): Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur — bila Uji gagal, kembali ke Ukur, bukan ke Putuskan.
- Roadmap pasca-track (langkah 18): empat jalur (market risk quant, model validation, credit risk, fraud/AML) + matriks gap→skill→artefak; pilih SATU jalur dan SATU artefak.

Kamu sudah menempuh seluruh track Machine Learning Finance — dari fondasi data (L0), fondasi pemodelan (M1), supervised dan credit scoring (M2), unsupervised dan fraud (M3), random forest dan ensembles untuk market risk (M4), optimasi dan konstruksi portofolio (M5), tuning dan seleksi model (M6), fairness, explainability, dan monitoring (M7), model risk dan deployment (M8), sampai simulasi, backtesting, dan validasi (M9) — dan lesson ini adalah ujungnya: menjawab «berapa VaR?» dengan jujur tentang metode, jendela, dan pitanya. Yang tersisa bukan modul berikutnya — tidak ada M10 — melainkan kebiasaan: tiap kali seseorang membawakanmu satu angka risiko, tanyakan tiga hal — metode apa, jendela (atau asumsi) apa, dan berapa pitanya. Bila satu jawabannya kosong, angka itu belum menjadi keputusan. Loop-nya (langkah 17) dan petanya (langkah 18) ada di atas — tempel loop itu di dinding, pilih satu jalur dari peta itu.

Ini lesson terakhir Modul M9 — dan akhir track Machine Learning Finance.
