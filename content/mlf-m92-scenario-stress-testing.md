# MLF-M9.2: Scenario & Stress Testing — Berapa Rugi Bila Sejarah Terburuk Terulang?

## Masalah: 8 April 2025 — Portofolio −7,43% dalam Sehari

Selasa, 8 April 2025. Guncangan tarif mengguncang pasar — dan portofolio kita, equal-weight BBCA/KLBF/UNVR, jatuh −7,43% dalam SATU hari. Dengan modal Rp100.000.000, itu Rp7.432.406 yang hilang sebelum makan siang. Bukan dari model yang salah, bukan dari data yang bocor — dari pasar yang bergerak seperti yang kadang-kadang memang dilakukan pasar. Pertanyaan lesson ini bukan «kenapa jatuh?» — melainkan «berapa rugi bila hari seperti itu terulang — dan berapa rugi bila yang datang lebih buruk dari itu?»

Konvensi lesson ini, ditulis eksplisit agar tidak ada angka yang tertukar: portofolio equal-weight BBCA/KLBF/UNVR atas SIMPLE daily returns (n=480, 2024-11-04 sampai 2026-11-11), deret yang sama dengan M4.2 VaR dan M5. Uang: Rp100.000.000 sebagai basis skenario — «Rp» hanya untuk portofolio IDX ini. Semua return di lesson ini adalah SIMPLE return, kecuali bila dinyatakan lain — dan bila satu angka punya versi simple dan versi log, keduanya ditulis berdampingan dengan labelnya.

**Perhatian tanggal:** guncangan tarif itu 2025-04-08, bukan 2026-04-08. Tanggal 8 April 2026 adalah hari yang BERBEDA — portofolio hari itu justru +3,39%. Jangan tertukar: satu digit tahun yang salah mengubah «hari terburuk kedua» menjadi «hari yang bagus». Selalu tulis tahunnya.

---

## 1. 8 April 2025: Hari Ketika Portofolio −7,43% dalam Sehari

**Nilai:** skenario dan stress test bagus karena ia mengubah ketakutan yang samar («bagaimana kalau pasar jatuh?») menjadi ANGKA yang bisa didiskusikan («bila 8 April terulang, rugi Rp7.432.406; bila posisi 2×, Rp14.864.812»). VaR95 0,0328 [M4.2] memberitahumu kerugian di hari yang buruk-dalam-batas-normal; stress test memberitahumu kerugian di hari yang TIDAK normal — dan hari tidak normal itulah yang menghabiskan modal.

**Baik/buruk:** kerugian −7,43% dalam sehari itu buruk sebagai HASIL — tapi bagus sebagai PELAJARAN, karena ia terukur: kamu tahu persis saham mana yang jatuh berapa (BBCA −8,53%, KLBF −7,05%, UNVR −6,72% — semuanya SIMPLE return), dan kamu tahu GSPC hari itu hanya −1,57%. Buruk bila hari seperti itu hanya diingat sebagai «hari yang sial» tanpa pernah dihitung ulang sebagai skenario: pasar akan mengulanginya dalam bentuk lain, dan kamu akan terkejut untuk kedua kalinya.

**Mitigasi:** sebelum lesson ini selesai, kamu akan bisa menjawab tiga pertanyaan tanpa membuka spreadsheet: berapa rugi bila 8 April 2025 terulang (Rp7.432.406)? Berapa rugi di hari terburuk portofolio (Rp13.983.464, 2026-10-16)? Dan berapa besar guncangan yang membuat VaR95 menyentuh 5% (σ* = 0,0301, yaitu 1,53× σ saat ini)? Tiga angka itu adalah isi lesson ini.

---

## 2. Skenario Historis: Replay 8 April 2025, per Saham, dalam Rupiah

Skenario historis adalah replay: ambil SATU hari yang benar-benar terjadi, dan tanyakan «berapa rugi bila hari itu terulang dengan posisi saya hari ini?» Pada 2025-04-08, SIMPLE daily returns-nya: BBCA −0,0853, KLBF −0,0705, UNVR −0,0672, GSPC −0,0157, PORT −0,0743 [m9_canonical.json]. Dengan modal Rp100.000.000, kerugiannya: BBCA Rp8.529.401, KLBF Rp7.048.462, UNVR Rp6.719.357, GSPC Rp1.570.052, PORT Rp7.432.406. Kerugian portofolio Rp7.432.406 adalah rata-rata dari ketiga saham IDX (equal-weight) — rata-rata eksak ketiga kerugian per saham adalah Rp7.432.406,67, selisih Rp1 dari nilai kanonis karena kerugian per saham dibulatkan ke rupiah terdekat; nilai kanonis Rp7.432.406 sendiri dihitung dari return tak-terbulatkan −0,07432406 — dan GSPC, yang hanya −1,57% hari itu, menunjukkan bahwa guncangan ini berpusat di IDX, bukan di AS.

**Simple vs log — dua angka untuk hari yang sama.** M4.5 menyebut hari ini sebagai «BBCA log return −0,0892» — sekitar −8,9% (M4.5 menulis «sekitar −8,5%», itu persentase SIMPLE return-nya, −0,0853 — jangan tertukar). Di lesson ini BBCA ditulis −0,0853 — itu SIMPLE return. Bedanya: log return = ln(1 + simple return); untuk return negatif, log return lebih negatif daripada simple return (ln(1 − 0,0853) = −0,0892). Jangan pernah membandingkan −0,0892 [M4.5, log] dengan −0,0853 [lesson ini, simple] seolah satu lebih besar dari yang lain — keduanya adalah hari yang sama, diukur dengan penggaris yang berbeda. Di lesson ini, setiap pemakaian return dilabeli simple atau log.

**5 hari terburuk portofolio** (SIMPLE return, n=480): 2026-10-16 −0,1398 (Rp13.983.464); 2025-04-08 −0,0743 (Rp7.432.406); 2025-02-28 −0,0728 (Rp7.284.287); 2026-04-24 −0,0522 (Rp5.217.623); 2026-10-19 −0,0483 (Rp4.833.042). Dua hal yang harus dibaca dari daftar ini. Pertama: hari TERBURUK portofolio bukan guncangan tarif — 2026-10-16 jatuh −13,98%, hampir DUA KALI guncangan tarif (−7,43%). Siapa pun yang hanya menyiapkan diri untuk «mengulang 8 April» akan kekurangan modal hampir dua kali lipat pada 16 Oktober 2026. Kedua: 2026-10-19 (−4,83%) hanya tiga hari setelah hari terburuk — kerugian datang BERUNTUN, bukan sekali lalu selesai (lihat juga maxDD PORT −0,4363 [M4.5]: dari puncak ke lembah, portofolio pernah kehilangan 43,63%).

**Catatan pembulatan.** Return yang ditampilkan di lesson ini dibulatkan ke 4 desimal (−0,0743), tetapi kerugian Rp kanonis dihitung dari return yang TIDAK dibulatkan: −0,0743 × Rp100.000.000 = Rp7.430.000, sedangkan nilai kanonisnya Rp7.432.406 — selisih Rp2.406 (0,03%). Selisih itu adalah artefak pembulatan, bukan kesalahan hitung: return sebenarnya hari itu −0,07432406. Bila kamu menghitung dari angka yang ditampilkan, kamu mendapat Rp7.430.000; bila kamu menghitung dari data, kamu mendapat Rp7.432.406 — dan yang kanonis adalah yang dari data.

**Apa yang dipelajari:** pada hari-hari terburuk, saham-saham jatuh BERSAMAAN. BBCA, KLBF, dan UNVR semuanya negatif besar pada 8 April 2025 — dan M4.5 mengukur itu: korelasi antar-saham pada rezim volatilitas tinggi 0,3752, lebih tinggi daripada pada rezim volatilitas rendah 0,2775 [M4.5]. Korelasi NAIK saat stress — diversifikasi yang kamu andalkan di hari normal melemah tepat di hari kamu paling membutuhkannya. Skenario historis yang baik tidak hanya mengulang return-nya — ia mengulang KORELASI-nya.

**Nilai:** skenario historis bagus karena ia TIDAK BISA DITUDUH mengada-ada — hari itu benar-benar terjadi, dengan angka yang bisa diperiksa siapa pun di data. Ia adalah skenario yang paling mudah dipertahankan di depan komite: «ini bukan imajinasi saya — ini 8 April 2025».

**Baik/buruk:** replay historis bagus bila dipakai sebagai TITIK AWAL («inilah yang pernah terjadi — sekarang bagaimana bila lebih buruk?») dan buruk bila dipakai sebagai BATAS («yang terburuk yang pernah terjadi adalah −13,98%, jadi siapkan modal untuk itu saja»). Sejarah adalah sampel, bukan batas: n=480 hari mengandung satu −13,98%, tetapi tidak ada yang menjamin −20% tidak akan datang.

**Mitigasi:** untuk setiap skenario historis yang kamu pakai, tulis tiga baris — tanggalnya, return per sahamnya (dengan konvensi simple/log), dan kerugiannya dalam rupiah pada posisi SAAT INI. Bila posisimu hari ini berbeda dari posisi saat sejarah itu terjadi, replay mentah-mentah adalah jawaban yang salah untuk pertanyaan yang benar.

**GSPC hari terburuk:** pada tanggal yang sama-sama hari bursa IDX, GSPC hari terburuknya 2026-11-05 −0,0436 — dan portofolio hari itu justru +0,0449. IDX dan AS tidak selalu searah (beta BBCA vs GSPC hanya 0,1209 [m9_canonical]).

---

## 3. Skenario Hipotetis: Vol Dikali 1,5 / 2,0, dan Korelasi Menuju 1

Skenario HIPOTETIS mengubah SATU parameter dan bertanya «bagaimana bila?» — dan yang diubah di sini adalah dua parameter yang paling menentukan VaR: volatilitas (σ) dan korelasi (ρ). Basisnya adalah VaR parametrik 95% [M4.2]: VaR95 = 0,0328, dari σ harian 0,0196 dan mean harian −0,0006 (SIMPLE return, n=480).

$$\mathrm{VaR}_{95} = -(\mu + \sigma\,\Phi^{-1}(0{,}05)) = z_{0{,}95}\,\sigma - \mu, \qquad z_{0{,}95} = 1{,}6449$$

VaR95 = 1,6449 × 0,0196 − (−0,0006) = 0,0328.

**Satu faktor bergerak — volatilitas.** Bila σ dikali 1,5 (menjadi 0,0294), VaR95 naik menjadi 0,0490. Bila σ dikali 2,0 (menjadi 0,0392), VaR95 naik menjadi 0,0651. VaR95 hampir berlipat ganda saat σ berlipat ganda — karena dalam rumus parametrik, VaR95 hampir sebanding dengan σ (mean −0,0006 hanya menggesernya sedikit). Dan σ ×1,5 memberi VaR95 0,0490 — MASIH di bawah 0,05. Kenapa stress vol masuk akal? Karena vol TIDAK KONSTAN — M4.3 (EWMA/GARCH) mengajarkan bahwa volatilitas bergerombol: hari yang volatil diikuti hari yang volatil. Mengalikan σ dengan 1,5 bukan mengada-ada — ia adalah cara sederhana untuk bertanya «bagaimana bila kita memasuki rezim volatilitas tinggi?»

**Satu faktor bergerak — korelasi.** Bila korelasi antar-saham menuju 1 (semua saham bergerak sempurna searah), σ portofolio naik dari 0,0196 menjadi 0,0267 — yaitu rata-rata dari simpangan baku per saham (BBCA 0,0217; KLBF 0,0268; UNVR 0,0316; rata-ratanya (0,0217 + 0,0268 + 0,0316) / 3 = 0,0267) — dan VaR95 naik menjadi 0,0445. Korelasi →1 TIDAK membuat σ portofolio menjadi sebesar saham yang paling volatil (0,0316) — ia membuatnya menjadi RATA-RATA simpangan baku ketiganya. Dan bandingkan dengan stress vol: korelasi →1 (VaR95 0,0445) lebih ringan daripada σ ×1,5 (VaR95 0,0490) — karena σ ×1,5 menaikkan volatilitas SETIAP saham, sementara korelasi →1 hanya menghapus manfaat diversifikasi.

**Bedakan: SATU faktor bergerak vs SEMUA bergerak.** Stress di atas masing-masing menggerakkan SATU faktor (σ saja, atau ρ saja) sambil menahan yang lain. Itu berguna untuk memahami «faktor mana yang paling berbahaya» — jawabannya di sini: σ. Tapi krisis yang sesungguhnya menggerakkan SEMUANYA SEKALIGUS: vol naik DAN korelasi naik (korelasi high-vol 0,3752 vs low-vol 0,2775 [M4.5] adalah buktinya). Skenario satu-faktor memberi batas bawah kerugian krisis; skenario semua-bergerak memberi gambaran yang lebih jujur tentang hari yang benar-benar buruk (σ per saham ×1,5 DAN korelasi 1 memberi σ_port 0,0401 dan VaR95 0,0666 [turunan]: 1,6449 × 0,0401 + 0,0006 = 0,0666).

**Nilai:** skenario hipotetis bagus karena ia menjawab pertanyaan yang TIDAK BISA dijawab sejarah: «bagaimana bila vol naik 50%?» tidak pernah terjadi persis seperti itu — tetapi pertanyaan itu tetap layak dijawab, karena vol naik 50% adalah hal yang pernah terjadi dalam bentuk lain (M4.3: volatilitas bergerombol).

**Baik/buruk:** stress satu-faktor bagus bila dipakai untuk MEMERINGKAT risiko («σ lebih berbahaya daripada ρ di portofolio ini») dan buruk bila dipakai sebagai PERKIRAAN kerugian krisis — karena krisis menggerakkan semua faktor sekaligus. Buruk juga bila pengalinya dipilih karena hasilnya «nyaman» (lihat jebakan, langkah 12): σ ×1,2 bukanlah stress — ia adalah pengali yang dipilih agar angkanya terlihat baik.

**Mitigasi:** setiap skenario hipotetis tuliskan BERSAMA asumsi yang ditahannya: «σ ×1,5, korelasi TETAP pada korelasi SIMPLE-return saat ini (BBCA–KLBF 0,3488; BBCA–UNVR 0,2774; KLBF–UNVR 0,2897 [M5])». Dan bila menyebut korelasi, sebutkan konvensinya: korelasi SIMPLE-return M5 (0,3488/0,2774/0,2897) berbeda dari korelasi LOG-return M4 (0,361/0,285/0,3001) — keduanya benar, untuk konvensi yang berbeda, seperti simple vs log pada langkah 2.

---

## 4. Reverse Stress: Berapa Besar Guncangan yang Membuat VaR95 = 5%?

Langkah 3 bertanya «bila σ naik sekian, berapa VaR-nya?» — pertanyaan MAJU. Reverse stress membaliknya: «VaR berapa yang TIDAK BOLEH terjadi — dan sebesar apa guncangan yang menyebabkannya?» Pertanyaan terbalik ini adalah pertanyaan yang diajukan regulator dan komite risiko, karena ia dimulai dari BATAS yang tidak boleh dilanggar, bukan dari skenario yang kebetulan terpikir.

Batasnya di lesson ini: VaR95 = 0,05 — kerugian 5% dalam sehari pada Rp100.000.000 adalah Rp5.000.000 [kebijakan lesson ini: ambang 5% dipilih sebagai batas kerugian harian yang memicu eskalasi ke komite, bukan konstanta alam]. Pertanyaannya: berapa σ* yang membuat VaR95 parametrik tepat 0,05? Jawabannya [m9_canonical.json]: σ* = 0,0301 — yaitu 1,53× σ saat ini (0,0196; rasio 1,5323 dihitung dari σ eksak 0,0196172). Volatilitas harian harus naik 53% dari level saat ini sebelum VaR95 menyentuh 5%.

$$\sigma^* = \frac{0{,}05 + \mu}{z_{0{,}95}} = \frac{0{,}05 - 0{,}000558}{1{,}6449} = 0{,}0301 = 1{,}53 \times \sigma$$

Rasio kanonis 1,5323 [m9_canonical.json] dihitung dari σ eksak 0,0196172 (σ tampil 0,0196) — ditulis 1,53×. Solver di lab 2 menemukan σ* yang sama dengan biseksi (0,0300–0,0301, dalam toleransi 0,0005 — selisihnya berasal dari pembulatan μ ke −0,0006).

**Perhatikan betapa DEKATNYA σ* dengan stress langkah 3.** σ ×1,5 memberi VaR95 0,0490 — hanya 0,0010 di bawah target 0,05. Pengali 1,5 «hampir» menyentuh batas; pengali 1,53 menyentuhnya. Selisih antara «hampir» dan «menyentuh» itu hanya 0,03× σ — sekitar 0,0006 dalam σ harian. Pelajarannya: bila stress test-mu memberi 0,0490 dan batasmu 0,05, jangan menulis «aman» — tulislah «aman dengan margin 0,0010, yaitu kurang dari 0,03× σ». Margin yang lebih kecil daripada noise pengukuran σ itu sendiri bukanlah margin.

**Reverse stress juga bisa dibalik ke arah lain.** Arah pertama (yang dihitung di sini): «σ berapa yang membuat VaR95 = 5%?» — jawabannya 0,0301. Arah kedua: «return harian berapa yang membuat kerugian Rp10.000.000?» — jawabannya −0,10, yaitu return yang LEBIH RINGAN daripada hari terburuk portofolio (−0,1398): hari terburuk sudah melewati batas Rp10.000.000, dengan kerugian Rp13.983.464. Membalik pertanyaan dengan benar berarti memeriksa arah ketidaksamaannya: −0,1398 < −0,10, jadi hari terburuk SUDAH melampaui batas Rp10.000.000.

**Nilai:** reverse stress bagus karena ia mengubah stress test dari «tebak skenario» menjadi «cari batas»: kamu tidak lagi memilih-milih skenario yang hasilnya nyaman — kamu menghitung skenario yang TEPAT menyentuh batas yang tidak boleh dilanggar, lalu bertanya apakah skenario itu masuk akal.

**Baik/buruk:** reverse stress bagus bila batasnya (di sini VaR95 = 0,05) ditulis DULU dari kebijakan — dan buruk bila batasnya dipilih sesudah melihat σ*. Buruk juga bila σ* dibaca sebagai PREDIKSI («vol akan naik 53%») — σ* bukan ramalan; ia adalah jawaban atas «bagaimana bila», sama seperti semua stress test.

**Mitigasi:** setiap reverse stress tuliskan dalam SATU kalimat yang lengkap: «VaR95 menyentuh 0,05 bila σ harian naik menjadi 0,0301 (1,53× σ saat ini 0,0196 — rasio 1,5323 dari σ eksak 0,0196172) — dan σ ×1,5 (0,0294) memberi VaR95 0,0490, hanya 0,0010 di bawah batas».

**Jangan baca «hampir menyentuh batas» sebagai «aman»:** σ ×1,5 memberi VaR95 0,0490 — hanya 0,0010 di bawah batas 0,05. Margin 0,0010 itu lebih kecil daripada ketidakpastian pengukuran σ harian itu sendiri. «Aman dengan margin 0,0010» adalah «tidak aman» yang ditulis dengan sopan. Tulis marginnya bersama verdictnya, selalu.

---

## 5. Stress M4.5: Saat Korelasi 0,95, Diversifikasi Menguap

Langkah ini tidak menghitung apa pun yang baru — ia MERUJUK stress yang sudah dihitung di M4.5, dan menjelaskan maknanya. Di M4.5, korelasi antar-saham dinaikkan menjadi 0,95 (dari korelasi LOG-return saat itu) dan VaR95 naik dari 0,0324 menjadi 0,0431. Perhatikan basisnya: 0,0324 adalah VaR95 parametrik atas LOG return [M4.5] — berbeda dari basis lesson ini, VaR95 0,0328 atas SIMPLE return [M4.2]. Keduanya benar untuk konvensinya masing-masing; jangan membandingkan 0,0431 [M4.5, log] dengan 0,0445 [langkah 3, simple, korelasi →1] seolah selisihnya hanya soal penggaris — keduanya berbeda dalam DUA hal sekaligus: 0,0431 adalah korelasi 0,95 atas LOG return, sedangkan 0,0445 adalah korelasi 1,0 atas SIMPLE return. Dekomposisinya [M4, kanonik]: 0,0431 (ρ=0,95, log) → 0,0438 (ρ=1,0, log — stress_var95_100) → 0,0445 (ρ=1,0, simple). Jadi 0,0431 → 0,0438 adalah efek menaikkan ρ dari 0,95 ke 1,0, dan 0,0438 → 0,0445 adalah efek mengganti konvensi log→simple — dan ketiganya bercerita sama: korelasi naik, VaR naik sekitar sepertiga.

Angka kedua dari M4.5 yang harus dibaca bersama VaR-nya: diversification ratio jatuh dari 1,353 menjadi 1,0169 saat korelasi 0,95. Diversification ratio mengukur «berapa kali lipat manfaat diversifikasi yang kamu dapatkan» — 1,353 berarti portofolio 35,3% lebih baik daripada rata-rata saham penyusunnya; 1,0169 berarti hanya 1,69% lebih baik — hampir TIDAK ADA manfaat diversifikasi yang tersisa. Itulah kalimat yang harus diingat dari langkah ini: diversifikasi menguap tepat saat kamu paling membutuhkannya. Bukan karena diversifikasi «tidak bekerja» — melainkan karena diversifikasi bekerja melalui korelasi yang RENDAH, dan korelasi naik saat stress (korelasi high-vol 0,3752 vs low-vol 0,2775 [M4.5]).

Angka ketiga dari M4.5: maxDD PORT −0,4363, GSPC −0,1890. Maximum drawdown mengukur kerugian dari puncak ke lembah — dan −43,63% untuk portofolio berarti seseorang yang masuk di puncak dan keluar di lembah kehilangan hampir separuh modalnya, walau hari terburuknya «hanya» −13,98%. GSPC, dengan maxDD −18,90%, jatuh kurang dari separuh portofolio IDX — pasar AS dan IDX tidak jatuh sama dalamnya, seperti halnya mereka tidak selalu jatuh di hari yang sama. Drawdown mengajarkan apa yang tidak diajarkan satu hari terburuk: kerugian BERUNTUN lebih berbahaya daripada kerugian sehari.

**Nilai:** rujukan M4.5 bagus karena ia memberi stress test-mu SEJARAH: angka 0,0431 dan 1,0169 bukan dihitung untuk lesson ini — ia dihitung di modul lain, dari data yang sama, dan bercerita sama. Dua modul yang independen mencapai kesimpulan yang sama adalah bukti yang lebih kuat daripada satu modul yang menghitung dua kali.

**Baik/buruk:** merujuk M4.5 bagus bila basisnya ditulis (log vs simple, 0,0324 vs 0,0328) — dan buruk bila angka M4.5 dikutip tanpa basisnya, karena pembaca akan membandingkannya dengan angka lesson ini dan menyimpulkan ada yang «salah» di salah satu modul. Tidak ada yang salah: penggarisnya yang berbeda.

**Mitigasi:** setiap kali kamu merujuk angka dari modul lain, tulis tiga hal — modulnya ([M4.5]), konvensinya (log return), dan basisnya (VaR95 0,0324). Tiga hal itu memakan satu baris — dan menyelamatkan satu jam debat yang tidak perlu.

---

## 6. Batas Stress Test: «Severe but Plausible» — dan Stress BUKAN Prediksi

Stress test punya dua batas yang harus ditulis sebelum ia dipakai. **Batas pertama:** skenario yang TIDAK PERNAH TERJADI bukan berarti TIDAK MUNGKIN. Portofolio ini belum pernah jatuh −20% dalam sehari (n=480 hari, terburuk −13,98%) — tetapi «belum pernah» adalah pernyataan tentang sampel, bukan tentang masa depan. Skenario −20% dalam sehari bukanlah ramalan; ia adalah pertanyaan «bagaimana bila?» yang layak dijawab justru KARENA ia belum terjadi. Siapa pun yang menolak skenario dengan alasan «itu tidak pernah terjadi» sedang memakai sejarah sebagai tameng — dan sejarah tidak pernah berjanji untuk mengulang dirinya dalam batas yang sama.

**Batas kedua:** skenario harus «severe but plausible» [kebijakan lesson ini] — berat TETAPI masuk akal. «Severe» berarti skenario itu cukup buruk untuk menguji batasmu: σ ×1,5, korelasi →1, replay −13,98% — semuanya severe. «Plausible» berarti skenario itu masih bisa dibayangkan terjadi tanpa melanggar cara pasar bekerja: σ ×2,0 masih plausible (vol rezim tinggi vs rendah di data ini 0,4131 vs 0,2777 — ≈1,5× [M4.5]; pelipatan ganda penuh pernah terjadi di krisis pasar lain [ilustrasi]); σ ×10 bukanlah stress test — ia adalah fantasi, dan fantasi tidak menghasilkan keputusan. Garis antara severe dan fantasi tidak ada rumusnya; ia diputuskan komite dan DITULIS — di lesson ini, pengali σ sampai 2,0 dan korelasi sampai 1 adalah batas «severe but plausible» [kebijakan lesson ini].

**Dan batas yang paling sering dilanggar: stress test BUKAN prediksi.** VaR95 0,0651 pada σ ×2,0 TIDAK berarti «kerugian besok adalah 6,51%». Ia berarti «BILA σ berlipat ganda, kerugian di persentil 95 adalah 6,51%». Perbedaan antara «akan» dan «bila» adalah perbedaan antara ramalan dan pertanyaan — dan seluruh lesson ini adalah pertanyaan. Siapa pun yang memakai angka stress sebagai ramalan («model memprediksi rugi 6,51%») sedang menyalahgunakan alatnya, sama seperti memakai VaR sebagai «kerugian maksimum» (M4.2: VaR95 adalah ambang yang dilampaui 5% hari, bukan batas kerugian).

**Nilai:** batas «severe but plausible» bagus karena ia membuat stress test JUJUR di kedua arah: cukup berat untuk tidak menenangkan diri secara palsu, cukup masuk akal untuk tidak melumpuhkan keputusan. Stress test yang terlalu ringan adalah penenang; yang terlalu berat adalah alasan untuk tidak melakukan apa pun.

**Baik/buruk:** «severe but plausible» bagus bila batasnya DITULIS («pengali σ sampai 2,0; korelasi sampai 1») — dan buruk bila batasnya hanya dirasakan («kayaknya ini sudah cukup berat»). Perasaan tidak bisa diaudit; pengali yang ditulis bisa.

**Mitigasi:** di laporan stress test-mu, tulis satu baris untuk tiap skenario: «skenario X: severe karena …, plausible karena …». Bila satu dari dua kolom itu kosong, skenario itu belum siap dipakai — entah terlalu ringan, entah fantasi.

**Miskonsepsi:** «skenario itu tidak pernah terjadi, jadi tidak perlu disiapkan» — yang benar: «belum pernah terjadi dalam 480 hari» berarti peluangnya kecil — bukan nol. 2026-10-16 (−13,98%) juga «belum pernah terjadi» sampai ia terjadi, dan ia hampir dua kali guncangan tarif yang sudah disiapkan. Stress test ada justru untuk hari yang belum pernah terjadi.

---

## 7. Mini-Case: «Berapa Rugi bila 8 April Terulang dengan Posisi 2×?»

Komite risiko memanggilmu. Pertanyaannya satu kalimat: «Berapa rugi kita bila 8 April 2025 terulang — dengan posisi 2× lipat?» Jawabannya: Rp14.864.812. Aritmetikanya: kerugian 8 April pada modal Rp100.000.000 adalah Rp7.432.406 (langkah 2); posisi 2× berarti modal Rp200.000.000, jadi kerugiannya 2 × Rp7.432.406 = Rp14.864.812. Tulis aritmetikanya bersama jawabannya — komite yang hanya mendengar «14,8 juta» tanpa «2 × 7.432.406» tidak bisa memeriksa jawabanmu, dan jawaban yang tidak bisa diperiksa adalah klaim, bukan perhitungan.

Tapi jawaban yang benar TIDAK BERHENTI di Rp14.864.812 — karena skala linear hanya berlaku bila posisi 2× tidak mengubah apa pun selain ukuran. Tiga batasnya, dan ketiganya harus disebutkan di depan komite. **Pertama: LIKUIDITAS** — menjual posisi 2× lipat di hari yang jatuh −7,43% tidak semudah menjual posisi 1×; pasar yang jatuh adalah pasar yang pembelinya menghilang, dan harga yang kamu dapatkan bisa lebih buruk daripada harga penutupan yang dipakai replay. **Kedua: BIAYA** — posisi 2× berarti biaya transaksi 2×, dan bila posisi 2× itu memakai leverage (pinjaman), ada bunga dan margin call yang tidak ada dalam replay Rp7.432.406. **Ketiga: KORELASI** — replay mengasumsikan korelasi hari itu terulang persis; bila posisi 2× itu menambah saham yang sama, korelasinya sama — tetapi bila ia menambah saham BARU, korelasi portofolio berubah dan replay 8 April bukan lagi replay yang benar.

Dan satu batas yang paling sering dilupakan: replay 8 April mengasumsikan kamu MEMEGANG posisi yang sama seperti pada 8 April 2025. Bila komposisi portofoliomu hari ini berbeda — misalnya UNVR sudah dijual dan diganti saham lain — maka «8 April terulang» tidak lagi berarti −7,43%. Skenario historis yang diulang mentah-mentah tanpa menyesuaikan posisi saat ini adalah jawaban atas pertanyaan yang salah (langkah 12). Komite yang baik menanyakan «posisi SAAT INI» sebelum menanyakan «berapa rugi» — dan jawaban Rp14.864.812 di atas mengasumsikan posisi saat ini adalah equal-weight BBCA/KLBF/UNVR yang sama, hanya 2× lipat.

**Nilai:** mini-case ini bagus karena jawabannya ADA di satu perkalian — 2 × 7.432.406 — dan kesulitannya BUKAN di perkalian itu, melainkan di tiga batas yang menyertainya. Itulah pekerjaan risiko: aritmetikanya mudah, syarat berlakunya yang sulit.

**Baik/buruk:** jawaban Rp14.864.812 bagus bila disertai tiga batasnya (likuiditas, biaya/leverage, komposisi posisi) — dan buruk bila disampaikan sebagai angka tunggal tanpa syarat, karena komite akan membawanya sebagai «kerugian maksimum bila 8 April terulang», padahal ia adalah «kerugian BILA 8 April terulang persis, posisi sama, tanpa gesekan». «Bila» yang hilang adalah «bila» yang paling mahal.

**Mitigasi:** setiap kali kamu menjawab «berapa rugi bila X terulang?», jawab dalam DUA kalimat: kalimat pertama angkanya («Rp14.864.812 = 2 × Rp7.432.406»), kalimat kedua syaratnya («berlaku bila posisi sama dengan 8 April 2025, hanya 2× lipat, tanpa memperhitungkan likuiditas dan biaya leverage»). Bila kalimat keduamu kosong, jawaban pertamamu belum siap disampaikan.

**Jebakan:** skala linear yang dibaca sebagai kebenaran, bukan asumsi — 2 × Rp7.432.406 = Rp14.864.812 adalah skala LINEAR. Asumsi itu runtuh bila posisi 2× mengubah likuiditas, biaya, atau komposisi. Skala linear adalah titik awal perhitungan, bukan kesimpulan — tulis batasnya bersama angkanya.

---

## Lab 1: Replay Skenario — Hitung Kerugian Rupiahnya, Jangan Tebak

Hitung sendiri replay 8 April 2025 dan 5 hari terburuk dari angka kanonis [m9_canonical.json]. Return SIMPLE yang ditampilkan (BBCA −0,0853; KLBF −0,0705; UNVR −0,0672; GSPC −0,0157; PORT −0,0743) dibulatkan ke 4 desimal — sedangkan kerugian Rp kanonis dihitung dari return yang TIDAK dibulatkan. Lab ini menghitung KEDUANYA, supaya kamu melihat selisih pembulatannya dengan mata sendiri: Rp2.406 pada portofolio.

Hasil [lab]: loss_8apr_port_rounded=7430000; loss_8apr_port=7432406; rounding_diff=2406; worst_day=-0.1398; worst_day_date=2026-10-16; worst_day_loss=13983464; loss_2x=14864812. Bacalah baris ketiga dengan saksama: rounding_diff 2406 BUKAN kesalahan — ia adalah selisih antara menghitung dari return yang ditampilkan (−0,0743 × Rp100.000.000 = Rp7.430.000) dan menghitung dari data (Rp7.432.406). Dan baris terakhir adalah jawaban mini-case langkah 7: 2 × Rp7.432.406 = Rp14.864.812 — dari nilai KANONIS, bukan dari nilai yang dibulatkan (2 × Rp7.430.000 = Rp14.860.000 adalah jawaban yang salah Rp4.812).

## Lab 2: Reverse Stress Solver — Cari σ* untuk Target VaR95 0,05

Lab kedua memecahkan pertanyaan terbalik langkah 4 dengan mesin: berapa σ* yang membuat VaR95 parametrik tepat 0,05? Rumusnya [M4.2]: VaR95(σ) = Z95 × σ − MU_DAY, dengan Z95 = 1,6449 dan MU_DAY = −0,0006 [m9_canonical.json]. Solver-nya adalah biseksi: mulai dari selang [0,01; 0,10] — VaR95 di 0,01 adalah 0,0170 (di bawah target), di 0,10 adalah 0,1651 (di atas target) — lalu bagi dua selang itu 60 kali sampai σ* terjepit.

Hasil [lab]: var95_base=0.0328; var95_x15=0.0490; var95_x2=0.0651; sigma_star=0.0300; sigma_star_ratio=1.5323; var95_at_star=0.0500. Perhatikan baris keempat: sigma_star tercetak 0,0300, sedangkan nilai kanonisnya 0,0301 [m9_canonical.json] — selisih 0,0001 berasal dari pembulatan μ ke −0,0006 di lab ini (kanonis memakai μ yang tidak dibulatkan); keduanya dalam toleransi 0,0005, dan rasio sigma_star_ratio 1,5323 sama persis dengan kanonis. Itulah gunanya toleransi: ia mengakui pembulatan tanpa menyembunyikannya.

---

## Figure 1: 5 Hari Terburuk — Satu Batang yang Dua Kali Lipat dari yang Lain

Satu batang menjulang sendiri di kiri — 2026-10-16, −13,98%, Rp13.983.464 — hampir dua kali batang kedua, 2025-04-08 (guncangan tarif), −7,43%, Rp7.432.406. Tiga batang berikutnya: 2025-02-28 −7,28% (Rp7.284.287), 2026-04-24 −5,22% (Rp5.217.623), 2026-10-19 −4,83% (Rp4.833.042). Semua nilai adalah SIMPLE return portofolio (n=480) dan kerugian pada modal Rp100.000.000 — angka yang SAMA dengan prose langkah 2 dan lab 1.

**Nilai:** figure ini bagus karena ia membuat satu fakta menjadi TIDAK TERLEWATKAN: hari terburuk bukan guncangan tarif. Dalam tabel, −0,1398 dan −0,0743 terlihat seperti «dua angka negatif»; dalam figure, batang pertama dua kali batang kedua — dan mata tidak bisa mengabaikannya.

**Baik/buruk:** bar chart ini bagus bila dibaca bersama tanggalnya — 2026-10-19 hanya tiga hari setelah 2026-10-16, jadi dua dari lima batang terburuk terjadi dalam satu minggu yang sama. Buruk bila dibaca sebagai «lima kejadian yang independen» — kerugian beruntun adalah satu episode, bukan lima kecelakaan yang terpisah.

**Mitigasi:** bila kamu membuat figure sejenis untuk portofoliomu sendiri, selalu sertakan DUA label per batang — return dan rupiah — karena komite memutuskan dalam rupiah, bukan dalam desimal.

## Figure 2: VaR95 vs Pengali σ — Garis yang Hampir Menyentuh Target

Dari kiri ke kanan: pada σ ×1,0 (saat ini, σ = 0,0196), VaR95 = 0,0328. Pada σ ×1,5, VaR95 = 0,0490 — titiknya hanya 0,0010 di bawah garis target 0,05. Pada σ ×2,0, VaR95 = 0,0651 — jauh di atas target. Garis vertikal putus-putus menandai σ* = 1,53× — pengali yang TEPAT mencapai target 0,05 (σ* = 0,0301). Semua nilai adalah VaR95 parametrik [M4.2] atas SIMPLE return.

**Nilai:** figure ini bagus karena ia membuat margin 0,0010 menjadi TERLIHAT: jarak vertikal antara titik σ ×1,5 dan garis target hampir tidak ada — mata melihat «hampir menyentuh» lebih cepat daripada angka 0,0490 vs 0,05 dibaca sebagai «aman».

**Baik/buruk:** garis lurus antara tiga titik ini bagus sebagai ILUSTRASI — VaR95 parametrik memang hampir linear dalam σ (mean −0,0006 hanya menggesernya sedikit). Buruk bila dibaca sebagai «VaR95 SELALU linear dalam σ» — linearitas ini milik rumus parametrik normal; VaR historis atau VaR dari distribusi ber-ekor-tebal tidak linear seperti ini.

**Mitigasi:** bila kamu menggambar figure sejenis, selalu gambar GARIS TARGET-nya — tanpa garis 0,05, tiga titik itu hanya «naik»; dengan garis itu, tiga titik itu bercerita «hampir menyentuh, lalu melampaui».

---

## 12. Jebakan: Scenario Shopping — dan Replay Mentah-Mentah

**Jebakan pertama: SCENARIO SHOPPING** — memilih skenario karena hasilnya «nyaman». Bentuknya bermacam-macam, semuanya sopan: «kita pakai σ ×1,2 saja, karena ×1,5 terlalu pesimistis»; «kita replay 2025-04-08 saja, 2026-10-16 itu outlier»; «kita pakai VaR95 historis 0,0286 saja, bukan parametrik 0,0328 — kan lebih kecil». Setiap kalimat itu memilih SKENARIO agar angkanya terlihat baik — dan setiap kali itu terjadi, stress test berhenti menjadi alat ukur dan menjadi alat pembenaran. Ciri-cirinya: skenario dipilih SESUDAH hasilnya dilihat, dan alasannya adalah «hasilnya», bukan «masuk akalnya».

**Jebakan kedua: REPLAY MENTAH-MENTAH** — mengulang skenario historis tanpa menyesuaikan posisi saat ini. «8 April terulang» berarti −7,43% HANYA bila posisimu hari ini sama dengan posisi pada 8 April 2025: equal-weight BBCA/KLBF/UNVR. Bila UNVR sudah dijual, bila bobot sudah berubah, bila ada saham keempat — maka −7,43% adalah jawaban untuk portofolio yang sudah tidak ada. Replay yang benar mengulang RETURN PER SAHAM hari itu (BBCA −0,0853; KLBF −0,0705; UNVR −0,0672) dan menerapkannya pada BOBOT SAAT INI — bukan mengulang return portofolionya (−0,0743) begitu saja.

**Nilai:** kedua jebakan ini bagus untuk dikenali karena keduanya TIDAK TERLIHAT di angka — stress test yang di-shopping tetap menghasilkan angka yang benar secara aritmetika, dan replay mentah tetap menghasilkan Rp yang benar untuk portofolio yang salah. Yang salah bukan hitungannya — melainkan PILIHANNYA.

**Baik/buruk:** skenario yang dipilih sebelum melihat hasilnya bagus — ia adalah keputusan; skenario yang dipilih sesudah melihat hasilnya buruk — ia adalah pembenaran. Replay yang disesuaikan dengan posisi saat ini bagus; replay yang diulang mentah-mentah buruk — ia menjawab pertanyaan tentang portofolio kemarin.

**Mitigasi:** dua ceklis sebelum stress test dipakai. Satu — TULIS SKENARIO DULU: daftar skenario (historis + hipotetis + reverse) ditulis dan disetujui SEBELUM satu angka pun dihitung; skenario yang ditambahkan sesudah melihat hasil ditandai «tambahan pasca-hasil» dan tidak boleh menggantikan skenario yang sudah disetujui. Dua — TERAPKAN PADA POSISI SAAT INI: tiap replay historis ditulis bersama bobot saat ini («return per saham 8 April 2025 × bobot hari ini»).

**Miskonsepsi:** «stress test yang hasilnya kecil berarti risikonya kecil» — yang benar: stress test yang hasilnya kecil bisa berarti risikonya kecil — ATAU skenarionya yang dipilih agar kecil. Bedakan keduanya dengan satu pertanyaan: «apakah skenario ini dipilih sebelum atau sesudah hasilnya dilihat?» Bila sesudah — itu scenario shopping, bukan pengukuran risiko.

---

## 13. Mesin P&L Skenario: dari Return ke Rupiah — Biaya, Leverage, Margin Call

Mini-case lesson ini berkata skala linear hanya berlaku «tanpa gesekan likuiditas/biaya». Langkah ini menghitung gesekannya. Posisi 2×: modal sendiri Rp100.000.000 + pinjaman Rp100.000.000 = posisi Rp200.000.000 [ilustrasi]. Bila 8 April terulang, kerugian pasar Rp14.864.812 [kanonis].

**Nilai:** biaya transaksi 0,10% = Rp200.000 [ilustrasi] (1,35% dari kerugian pasar [turunan]); bunga 12%/tahun 1 hari = Rp32.877 [ilustrasi] (0,22% [turunan]); total tanpa forced sale Rp15.097.689 [turunan] (1,57% di atas kerugian pasar [turunan]). Haircut forced sale 1% = Rp2.000.000 [ilustrasi] (13,45% [turunan]); total dengan forced sale Rp17.097.689 [turunan] — 15,02% di atas kerugian pasar [turunan].

**Baik/buruk:** leverage mengubah arti kerugian yang sama — Rp14.864.812 adalah 14,86% dari modal sendiri [turunan], bukan 7,43% dari posisi. Ekuitas sesudah rugi pasar Rp85.135.188 [turunan], rasio 45,99% [turunan]. Margin call 25% [ilustrasi] tiba saat posisi menyusut ke Rp133.333.333 [turunan] — kerugian Rp66.666.667, −33,33% dari posisi, −66,67% dari modal sendiri [turunan]; ekuitas tersisa Rp33.333.333 [turunan].

**Mitigasi:** untuk SETIAP skenario, tulis empat baris — (1) kerugian pasar, (2) biaya, (3) kerugian bila forced sale, (4) ekuitas sesudahnya dan jarak ke margin call. Yang tidak dihitung mesin ini: slippage, bunga yang menumpuk berhari-hari, dan margin call berantai.

---

## Guided Task di Colab

Notebook: colab/mlf-m92-guided-task.ipynb — replay 8 April 2025 per saham + kerugian Rp, 5 hari terburuk + GSPC hari terburuk, stress vol ×1,5/×2 dan korelasi →1, reverse stress solver (σ* = 0,0301), rujukan stress M4.5, dan mini-case posisi 2× (Rp14.864.812). Tautan Colab: https://colab.research.google.com/drive/1aVwqLBk5ZvnDzSzl00_asejXp2W6QTFW

## Rangkuman

- Konvensi lesson ini: portofolio equal-weight BBCA/KLBF/UNVR atas SIMPLE daily returns (n=480); modal Rp100.000.000; «Rp» hanya untuk portofolio IDX; setiap return dilabeli simple atau log.
- Skenario historis 2025-04-08 (guncangan tarif — BUKAN 2026-04-08, yang justru +3,39%): BBCA −0,0853 (Rp8.529.401), KLBF −0,0705 (Rp7.048.462), UNVR −0,0672 (Rp6.719.357), GSPC −0,0157 (Rp1.570.052), PORT −0,0743 (Rp7.432.406). M4.5 menyebut hari yang sama sebagai BBCA LOG return −0,0892.
- 5 hari terburuk portofolio: 2026-10-16 −0,1398 (Rp13.983.464 — TERBURUK, hampir 2× guncangan tarif); 2025-04-08 −0,0743; 2025-02-28 −0,0728 (Rp7.284.287); 2026-04-24 −0,0522 (Rp5.217.623); 2026-10-19 −0,0483 (Rp4.833.042).
- GSPC hari terburuk (tanggal yang sama-sama hari bursa IDX): 2026-11-05 −0,0436, portofolio hari itu +0,0449 — IDX dan AS tidak selalu searah (beta BBCA vs GSPC 0,1209 [m9_canonical]).
- Skenario hipotetis (VaR95 parametrik basis 0,0328; σ 0,0196; μ −0,0006): σ ×1,5 → VaR95 0,0490; σ ×2,0 → VaR95 0,0651; korelasi →1 → σ_port 0,0267 → VaR95 0,0445. Korelasi SIMPLE-return [M5]: 0,3488/0,2774/0,2897 — bedakan dari korelasi LOG-return M4 (0,361/0,285/0,3001).
- Reverse stress: σ* = 0,0301 untuk VaR95 = 0,05 — yaitu 1,53× σ saat ini (rasio kanonis 1,5323); σ ×1,5 memberi 0,0490, hanya 0,0010 di bawah target — «hampir menyentuh» bukanlah «aman».
- Stress M4.5 (rujukan, basis LOG return — basisnya 0,0324): korelasi 0,95 → VaR95 0,0324 → 0,0431; diversification ratio 1,353 → 1,0169; korelasi high-vol 0,3752 vs low-vol 0,2775; maxDD PORT −0,4363, GSPC −0,1890.
- Batas: skenario yang tidak pernah terjadi ≠ tidak mungkin; skenario harus «severe but plausible» [kebijakan lesson ini] — pengali σ sampai 2,0, korelasi sampai 1; stress BUKAN prediksi — ia jawaban atas «bagaimana bila».
- Mini-case: posisi 2× bila 8 April terulang = 2 × Rp7.432.406 = Rp14.864.812 — skala linear hanya berlaku tanpa gesekan likuiditas/biaya dan dengan posisi yang sama.
- Lab 1: replay + 5 hari terburuk + selisih pembulatan Rp2.406 + loss_2x Rp14.864.812. Lab 2: reverse stress solver — σ* ≈ 0,0301 (solver memberi 0,0300 karena μ dibulatkan; dalam toleransi 0,0005), rasio 1,5323.
- Jebakan: scenario shopping (memilih skenario karena hasilnya nyaman) dan replay mentah-mentah tanpa menyesuaikan posisi saat ini — tulis skenario dulu, terapkan pada bobot saat ini.
- Mesin P&L (langkah 13) [ilustrasi]: posisi 2× bila 8 April terulang — pasar Rp14.864.812 [kanonis] + transaksi Rp200.000 + bunga Rp32.877 = Rp15.097.689 [turunan]; + haircut forced sale Rp2.000.000 = Rp17.097.689 [turunan] (15,02% di atas kerugian pasar).
- Leverage: kerugian pasar 14,86% dari modal sendiri [turunan]; margin call 25% tiba pada kerugian Rp66.666.667 — −66,67% modal sendiri, ekuitas tersisa Rp33.333.333 [turunan].
