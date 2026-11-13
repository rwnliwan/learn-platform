# MLF-M8.4: Deployment — Shadow, Canary & Champion-Challenger — Jangan Biarkan Model Baru Menyakitimu di Hari Pertama

## Masalah: Model Baru yang «Hampir Sama Bagusnya» — dan Kerugian Satu Bulan Penuh

Tim modeling datang dengan kabar gembira: mereka melatih model baru yang lebih sederhana, lebih cepat, dan jauh lebih mudah dijelaskan ke bisnis — regresi logistik (LR). ROC-AUC-nya 0,7426, «cuma» 0,039 di bawah champion GBM terkalibrasi (0,7816). «Hampir sama,» kata mereka. Jumat sore, model baru itu di-deploy 100% — big-bang, tanpa shadow, tanpa canary. Sebulan kemudian, laporan laba datang: profit dari keputusan kredit jatuh dari +NT$8.214.000 menjadi +NT$1.823.000. Selisih NT$6.391.000 — hilang dalam satu bulan, tanpa satu pun alarm yang menyala, karena tidak ada yang memasang alarm.

Angka-angka di atas bukan karangan: itu hasil perbandingan champion (GBM terkalibrasi Platt) vs challenger (LR proba MENTAH — tidak terkalibrasi) pada test 6.000 yang sama, threshold operasional 0,10 yang sama [notebook, kanonis M8]. Challenger itu kalah di SEMUA metrik keputusan — approval lebih rendah (20,25% vs 28,50%), bad rate lebih tinggi (9,14% vs 6,67%), profit jauh lebih rendah — dan keputusan kedua model berbeda pada 19,42% nasabah (1.165 dari 6.000).

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; champion GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05; challenger LR (Pipeline StandardScaler + LogisticRegression) dinilai pada proba MENTAH-nya pada threshold 0,10 yang sama. Satu peringatan jujur di depan: 0,10 LR BUKAN 0,10 champion. LR tidak terkalibrasi (Brier 0,1427 vs champion 0,1345), jadi threshold angka yang sama berarti hal yang berbeda pada kedua model — selisih profitnya sebagian artefak kalibrasi, bukan murni skill ranking.

---

## 1. Model Baru yang «Hampir Sama Bagusnya» — dan Kerugian Satu Bulan Penuh

**Nilai:** deployment yang aman bukan tentang seberapa bagus model barumu di test — melainkan tentang seberapa kecil kerugianmu bila ternyata ia buruk di live. Shadow memberi tahu harga switch SEBELUM kamu membayarnya; canary membatasi kerugianmu pada 1% traffic bila kamu salah; champion-challenger memaksa model baru membuktikan dirinya melawan champion di data yang sama, bukan melawan kenangan test lamanya.

**Baik/buruk:** LR sebagai challenger itu «baik» sebagai ide — model sederhana yang mudah dijelaskan memang layak diuji. Buruk bila «mudah dijelaskan» dibaca sebagai «aman di-deploy»: kesederhanaan bukan bukti kualitas keputusan. ROC-AUC 0,7426 vs 0,7816 terdengar seperti selisih kecil — tapi di keputusan uang, selisih itu bernilai NT$6.391.000 per 6.000 nasabah.

**Mitigasi:** JANGAN PERNAH deploy model keputusan uang 100% di hari pertama. Urutannya selalu: shadow dulu → canary → champion-challenger. Lesson ini memberi angka untuk tiap tahapnya.

---

## 2. Big-Bang vs Bertahap — Kapan Masing-Masing Masuk Akal

Ada dua pola deployment. **Big-bang:** model baru menggantikan model lama 100% sekaligus, di hari pertama. **Bertahap:** model baru masuk sedikit demi sedikit — shadow dulu (0% traffic bertindak), lalu canary (1% → 5% → 25% → 100%), dengan gate di tiap tahap. Perbedaannya bukan kecepatan — melainkan seberapa besar kerugianmu bila kamu salah.

**Big-bang masuk akal HANYA bila tiga syarat terpenuhi sekaligus:** (1) blast radius-nya kecil — keputusan tidak bernilai uang besar dan mudah dibatalkan; (2) reversible dalam hitungan menit — rollback sudah diuji, bukan sekadar direncanakan; (3) tidak ada yang dipertaruhkan bila modelnya salah. Bila satu syarat saja tidak terpenuhi, big-bang bukan «berani» — ia ceroboh. Model kredit tidak memenuhi satu pun.

**Baik/buruk:** bertahap bagus karena ia mengubah deployment dari satu taruhan besar menjadi serangkaian taruhan kecil yang masing-masing bisa dibatalkan. Buruk bila bertahapnya tanpa gate — canary tanpa kriteria lanjut/stop hanyalah big-bang yang ditunda.

**Mitigasi:** untuk SETIAP deployment model keputusan uang, tulis dulu: pola apa (bertahap), ramp-nya apa (1% → 5% → 25% → 100% [kebijakan lesson ini]), gate tiap ramp, dan siapa yang berhak menekan tombol rollback. Bila salah satu belum ditulis, deployment belum disetujui.

---

## 2a. Deployment Readiness: Dua Belas Item yang Diperiksa SEBELUM Satu Keputusan Pun Diambil

Shadow dan canary adalah pengaman untuk model yang SUDAH SIAP di-deploy — tapi «siap» itu sendiri harus diperiksa dulu. **Checklist 12 item** (semuanya harus lolos SEBELUM shadow dibuka): (1) input/output contract; (2) schema compatibility — fitur live = fitur latih; (3) feature freshness — tiap fitur tersedia tepat waktu; (4) fallback behavior — model gagal/slow → champion/manual, bukan error ke nasabah; (5) latency/capacity test — p95 di bawah SLA [kebijakan organisasi] pada traffic puncak; (6) logging — decision ID, model version, threshold, skor, fitur input (cukup untuk replay); (7) access control — deploy dan rollback oleh orang berbeda; (8) alert missing/late features — fitur hilang/telat → alert, bukan nilai default diam-diam; (9) model card lengkap (M8.3) — gerbang; (10) approval komite ditandatangani (M8.5); (11) deployment_id ditetapkan + bundle konfigurasi dibekukan (G13, M8.3); (12) rollback drill sudah dilakukan kuartal ini (G10).

**Skenario latihan [ilustrasi]:** 10 item lolos, 2 gagal — (3) PAY_AMT telat 2 jam (fitur turunan dihitung dari tagihan belum lengkap) dan (6) decision ID belum ditulis ke log (keputusan shadow tidak bisa di-replay). Vonis: deployment DIBLOKIR. Sepuluh yang lolos tidak menebus dua yang gagal — readiness adalah gerbang biner, seperti linkage (M8.3).

---

## 3. Shadow Mode — Challenger Memutuskan, tapi Tidak Bertindak

Shadow mode: challenger diberi nasabah yang sama dengan champion, ia menghitung skor dan keputusannya — tapi keputusannya hanya DICATAT, tidak ditindaklanjuti. Yang kamu dapatkan: perbandingan apel-dengan-apel atas nasabah yang sama, tanpa satu rupiah pun dipertaruhkan. Yang tidak kamu dapatkan: reaksi live — perilaku nasabah terhadap keputusan challenger tidak bisa diamati, karena keputusannya tidak pernah sampai ke nasabah.

$$D = \frac{n_{\text{beda}}}{n}, \qquad D = \frac{1.165}{6.000} = 0{,}1942$$

**Nilai [notebook] — disagreement rate:** keputusan champion dan challenger berbeda pada 1.165 dari 6.000 nasabah — 19,42%. Hampir satu dari lima nasabah akan menerima keputusan berbeda bila kamu switch.

**Baik/buruk:** disagreement 19,42% itu «buruk» sebagai kabar — switch ini bukan pergantian kecil — tapi «baik» sebagai informasi: shadow memberitahumu SEBELUM kamu membayar. Dua selnya menceritakan segalanya. **Sel pertama — challenger-only approvals** (challenger setuju, champion tolak), n = 335: bad rate 18,21% (61 default dari 335) — hampir tiga kali bad rate champion 6,67%. Bila switch bertindak atas sel ini, kerugian terealisasi NT$9.243.000 melawan margin NT$4.382.000 — net −NT$4.861.000. **Sel kedua — challenger-only rejections** (champion setuju, challenger tolak), n = 830: good rate 92,29% (766 lancar dari 830) — challenger menolak 766 nasabah BAIK yang champion setujui dengan benar. Margin yang hilang (gross) bila switch bertindak: NT$6.354.000 — sebelum menghitung kerugian yang dihindari atas 64 default di sel ini, jadi angka net-nya lebih kecil dari gross ini; rekonsiliasi penuh kedua sel terhadap selisih profit −NT$6.391.000 ada di notebook.

**Mitigasi:** JANGAN PERNAH switch tanpa membaca kedua sel shadow. Sel approvals challenger-only harus punya bad rate TIDAK LEBIH BURUK dari bad rate champion (di sini 18,21% vs 6,67% — gagal telak); sel rejections challenger-only harus mayoritas BURUK agar penolakan itu benar (di sini 92,29% BAIK — gagal telak). Challenger ini gagal di kedua sel sekaligus.

---

## 4. Canary — Naik 1% Dulu, dan Biarkan Angka yang Memutuskan

Canary adalah shadow yang diberi gigi: challenger benar-benar bertindak — tapi hanya pada sebagian kecil traffic. Ramp lesson ini [kebijakan lesson ini]: 1% → 5% → 25% → 100% dari traffic masuk. Di tiap ramp, gate memutuskan: LANJUT, TAHAN, STOP, atau ROLLBACK.

**Aturan per ramp [kebijakan lesson ini] — ditulis DULU, sebelum melihat angka:** LANJUT bila bad rate challenger ≤ 8% DAN PSI skor ≤ 0,10; TAHAN bila bad rate 8–10% DAN PSI skor ≤ 0,10 (zona abu-abu: kumpulkan data lagi di ramp yang sama, jangan naik) — dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk (PSI naik tanpa bukti kerugian: jangan naik, kumpulkan data lagi; bila TAHAN itu berulang, STOP); STOP bila bad rate > 10% ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut. Ambang 8% dipilih dari baseline champion: bad rate champion 6,67% [notebook] ditambah toleransi 1,33 poin persen. Ambang 8% (toleransi 1,33 pp) adalah ambang CANARY — lebih longgar dari ambang gate naik G2 (7,67%, toleransi 1,00 pp): canary hanya mengizinkan ramp berikutnya, gate naik memutuskan penggantian penuh — keputusan yang lebih besar memakai ambang yang lebih ketat. Ambang PSI meminjam band M7.5 [M7.5]: di bawah 0,1 stabil, di atas 0,25 geser besar.

**Gambar:** diagram canary ramp — 1% LANJUT (bad 7,69% [simulasi]), 5% TAHAN lalu STOP (bad 8,94% → 9,15% [simulasi]), 25% dan 100% TIDAK DICAPAI, lalu ROLLBACK ke champion.

**Nilai [simulasi] — canary atas challenger LR dengan parameter eksplisit (bukan observasi live).** Basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk — jadi 1% = 120, 5% = 600; ramp 5% diperpanjang mengakumulasi 5 periode pada 5% sampai terkumpul 3.000 nasabah (25% dari basis 12.000), bukan «5% dari test 6.000». Ramp 1% (n = 120, disetujui 26, default 2, PSI skor 0,02) → bad rate 7,69% → LANJUT. Ramp 5% (n = 600, disetujui 123, default 11, PSI skor 0,05) → bad rate 8,94% → TAHAN. Ramp 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI skor 0,06) → bad rate 9,15% → STOP — TAHAN kedua berturut-turut. Challenger TIDAK PERNAH mencapai 25% — canary menangkapnya di 5%.

**Baik/buruk:** canary bagus karena ia membatasi kerugian sambil tetap memberi data LIVE. Buruk bila dibaca tanpa n dan tanpa cohort matang: ramp 1% dengan n = 120 hanya punya 26 nasabah disetujui — bad rate 7,69% di sana adalah 2 default dari 26, satu default lagi saja sudah mengubahnya menjadi 11,54%. LANJUT di ramp 1% bukan vonis «challenger bagus» — melainkan «belum ada bukti ia buruk». Dan buruk bila bad rate per ramp dihitung pada cohort yang labelnya belum matang [M7.5]: label default butuh jendela observasi 1 bulan.

**Mitigasi:** di tiap ramp, laporkan metrik TANPA label (PSI skor, approval rate, distribusi skor — tersedia segera) TERPISAH dari metrik berlabel (bad rate, ROC-AUC — hanya cohort matang) [M7.5]. Jangan pernah menaikkan ramp berdasarkan bad rate yang labelnya belum matang.

---

## 4a. Desain Eksperimen Canary: Traffic Persen Bukan Sampel — dan Ambang Tidak Digeser

Empat hal yang membuat canary menjadi eksperimen. **Satu — traffic % bukan effective sample size:** ramp 1% dari 12.000 = 120 nasabah, tapi bad rate dihitung atas yang DISETUJUI: 26. Sampel efektif R1 = 26 — satu default lagi saja mengubah 7,69% menjadi 11,54%. Aturan [kebijakan lesson ini]: STOP atas bad rate butuh n_approved ≥ 100 — di R1 STOP bahkan tidak eligible. Laporkan n, n_approved, DAN n_default per ramp. **Dua — assignment stabil:** hash(customer_id + garam) % 100 — nasabah yang sama selalu masuk arm yang sama; garam diganti tiap eksperimen; assignment SEBELUM scoring. Random per-request = kontaminasi. **Tiga — cohort sebanding:** jendela waktu dan campuran traffic SAMA; baca balance table (approval baseline, PSI antar-arm ≈ 0) SEBELUM membaca bad rate. **Empat — stopping rule tanpa menggeser ambang:** ambang LANJUT/TAHAN/STOP + minimum sampel ditulis dan ditandatangani SEBELUM ramp dibuka; mengubahnya sesudah melihat hasil adalah menggeser tiang gawang sesudah bola ditendang.

---

## 5. Champion vs Challenger — Kalah di Laba, Kalah di Sel, dan Keputusannya Memang Berbeda

Champion-challenger adalah uji tandingnya: challenger harus mengalahkan champion — model yang sedang live — pada data yang sama, threshold yang sama, dan metrik yang sama.

**Nilai [notebook] — champion GBM terkalibrasi (Platt):** ROC-AUC 0,7816, PR-AUC 0,5558, Brier 0,1345, approval 28,50% (n = 1.710), bad rate 6,67%, profit +NT$8.214.000, cost NT$33.046.500. **Challenger LR proba MENTAH:** ROC-AUC 0,7426, PR-AUC 0,5049, Brier 0,1427, approval 20,25% (n = 1.215), bad rate 9,14%, profit +NT$1.823.000, cost NT$39.437.500. Selisihnya: approval −8,25 poin persen, bad rate +2,47 poin persen, profit −NT$6.391.000, cost +NT$6.391.000. Challenger menyetujui lebih SEDIKIT nasabah DAN lebih BURUK — bukan trade-off, melainkan kalah di kedua arah sekaligus. Threshold 0,10 champion memang cost-optimal [M6.4]: cost NT$33.046.500 vs threshold 0,50 yang cost-nya NT$60.254.956, approve-all NT$82.155.456 (realised loss seluruh test [m8_approve_all_realised_loss] — BUKAN expected loss NT$78.675.378 di M8.2), reject-all NT$41.260.500.

**Gambar:** champion vs challenger — approval 28,50% vs 20,25%; bad rate 6,67% vs 9,14%; profit NT$8.214.000 vs NT$1.823.000.

$$\chi^2 = \frac{(|b - c| - 1)^2}{b + c} = \frac{(|830 - 335| - 1)^2}{830 + 335} = 209{,}473, \qquad p < 0{,}0001$$

**McNemar** menguji apakah KEPUTUSAN kedua model berbeda lebih dari yang bisa dijelaskan kebetulan: b = 830 (champion setuju, challenger tolak), c = 335 (challenger setuju, champion tolak). χ² dengan koreksi kontinuitas = 209,473, p < 0,0001. Keputusan kedua model BERBEDA secara signifikan. McNemar TIDAK mengatakan siapa yang lebih baik — yang mengatakan siapa lebih baik adalah profit dan bad rate. Dan satu peringatan penulisan: nilai p di sini dibulatkan 4 desimal menjadi 0,0000 — tulis p < 0,0001, JANGAN tulis «p = 0».

**Baik/buruk:** hasil ini «buruk» untuk challenger — ia kalah di semua metrik keputusan — tapi «baik» sebagai proses: champion-challenger menangkap kekalahan itu di test, bukan di live. Dan satu kejujuran yang wajib ditulis: selisih profit ini SEBAGIAN artefak kalibrasi, bukan murni skill ranking. LR dinilai pada proba MENTAH-nya pada threshold 0,10 yang sama — 0,10 LR bukan 0,10 champion (LR tidak terkalibrasi; Brier 0,1427 vs 0,1345). Protokol yang benar: kalibrasi challenger DULU, baru bandingkan pada threshold yang sama. Bukti bahwa artefaknya hanya sebagian: bila LR dikalibrasi Platt [M6.4], ambang 0,10-nya menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] — tetap jauh dari 1.710 champion; dan ekonominya tetap kalah jauh: LR terkalibrasi profit +NT$1.886.500 (bad rate 9,09%) vs champion +NT$8.214.000 (bad rate 6,67%) — kalibrasi hanya menambah NT$63.500 di atas LR mentah (+NT$1.823.000), masih NT$6.327.500 di bawah champion. Jadi kalibrasi bukan penjelasan utama kekalahan ini; ranking LR memang lebih lemah (ROC-AUC 0,7426 vs 0,7816). Ranking invarian ≠ approval invarian: kalibrasi adalah transformasi monoton atas skor yang sama — ranking-nya tidak berubah — tapi ambang 0,10-nya berubah arti, sehingga dua model dengan ranking yang mirip tetap bisa menyetujui nasabah yang sangat berbeda pada threshold angka yang sama. Kata «mentah» di lesson ini HANYA dipakai untuk model yang tidak terkalibrasi.

**Mitigasi:** sebelum challenger boleh masuk canary, ia harus (1) terkalibrasi dengan metode yang sama seperti champion (Platt/sigmoid, cv=3) bila ia akan dinilai pada threshold probabilitas; (2) dibandingkan pada threshold yang sama DAN pada metrik keputusan (profit, bad rate), bukan hanya ROC-AUC; (3) diuji McNemar atas keputusannya.

---

## 6. Kriteria Naik — Tujuh Gate Kuantitatif Sebelum 100%

«Naik produksi» bukan perasaan — ia tujuh gate kuantitatif yang semuanya harus lolos, ditulis DULU sebelum canary dimulai [kebijakan lesson ini]. Challenger naik ke 100% HANYA bila lolos ketujuh gate pada ramp 25% dengan cohort yang matang. Satu gate gagal = tidak naik.

**Nilai — tujuh gate [kebijakan lesson ini]:** G1 PROFIT — profit per nasabah challenger ≥ champion pada traffic yang sama (ramp 25%, cohort matang). G2 BAD RATE — bad rate challenger ≤ 7,67% (champion 6,67% + toleransi 1 poin persen). G3 KALIBRASI — challenger WAJIB terkalibrasi sebelum dinilai; ECE ≤ 0,02 pada proba yang dipakai memutuskan; 0,10 mentah tidak boleh dibandingkan dengan 0,10 terkalibrasi. G4 DISAGREEMENT — laporkan disagreement rate; bila di atas 25%, investigasi sel shadow sebelum naik. Kriteria isi sel shadow (langkah 3): gate GAGAL ISI bila bad rate sel challenger-only approvals melebihi bad rate champion, atau bila mayoritas sel challenger-only rejections adalah nasabah baik. Di sini 19,42% — di bawah ambang, tapi selnya buruk (335 approvals bad rate 18,21% > 6,67%; 830 rejections 92,29% baik), jadi gate ini lolos angka dan gagal isi. G5 MONITORING — tidak ada alert KRITIS M7.5 [M7.5] pada ramp mana pun (PSI skor > 0,25; bad rate > 10% dua periode; ROC-AUC turun > 0,02 dua periode; PR-AUC turun > 0,03 dua periode). ECE di atas 0,02 adalah WASPADA, bukan pemicu KRITIS (langkah 7). G6 FAIRNESS — AIR per grup tidak di bawah 0,80 [M7.1]. G7 DUA PERIODE — semua gate lolos dalam 2 periode berturut-turut (aturan M7.5 [M7.5]).

**Terapkan pada LR — vonis per gate [notebook]:** G1 GAGAL (profit +NT$1.823.000 vs +NT$8.214.000 — selisih −NT$6.391.000). G2 GAGAL (bad rate 9,14% > 7,67%). G3 GAGAL (LR dinilai mentah — Brier 0,1427 vs 0,1345). G4 GAGAL ISI (disagreement 19,42% di bawah 25%, tapi sel shadow-nya buruk di kedua arah). G5/G6 BELUM DIUJI (canary berhenti di 5% [simulasi] sebelum ramp 25%). G7 GAGAL (tidak ada dua periode lolos). 0 dari 7 gate lolos. Itu bukan «hampir naik» — itu tidak naik.

**Baik/buruk:** tujuh gate ini bagus karena mereka memaksa jawaban «ya/tidak» atas angka. Buruk bila gate-nya ditulis SESUDAH melihat angka: gate yang dipilih karena challenger kebetulan lolos bukanlah gate — itu pembenaran.

**Mitigasi:** simpan lembar gate ini bersama model card (M8): satu baris per gate, angka challenger vs ambang, lolos/gagal, tanggal, dan penyetuju. Bila satu gate gagal, tulis juga TINDAK LANJUTNYA.

---

## 6a. Decision Matrix: Superiority, Non-Inferiority, Equivalence, atau Reject

Empat keputusan dari tujuh gate. **Superiority:** challenger menang di SEMUA gate dengan margin → naik. **Non-inferiority:** challenger tidak lebih buruk dalam margin → naik HANYA bila ada manfaat lain (lebih sederhana/cepat/mudah dijelaskan). **Equivalence:** challenger ≈ champion dalam margin → naik hanya bila ada manfaat operasional yang jelas; bila tidak, tetap champion. **Reject:** gagal satu hard gate → stop/rollback. Margin [kebijakan lesson ini]: ROC-AUC 0,01; profit NT$500.000; bad rate 1,00 pp.

**Challenger LR:** ROC −0,039 (hampir 4× margin), profit −NT$6.391.000 (hampir 13× margin), bad rate +2,47 pp (lebih dari 2× margin) → REJECT — konsisten dengan mini-case. **Hard constraints** (tidak bisa ditukar): fairness AIR ≥ 0,80 [kebijakan M7.5]; ECE ≤ 0,02 [kebijakan lesson ini]. **Trade-off dalam margin** dieskalasikan ke komite (M8.5) — deployer tidak memutuskan sendiri; pelanggaran hard constraint tidak pernah dieskalasikan: itu REJECT.

---

## 7. Monitoring Gates — Metrik Go/No-Go di Tiap Ramp (Tanpa Mengajar Ulang M7.5)

Lesson ini tidak mengajar ulang monitoring — ia MEMAKAI monitoring M7.5 sebagai gate [M7.5]. Di tiap ramp canary, dashboard yang sama dibaca (PSI skor, ROC-AUC/PR-AUC, approval rate, bad rate, skor rata-rata, ECE) dengan ambang yang sama — tetapi baseline PER MODEL: champion [M6.4/M7.4] ROC-AUC 0,7816, PR-AUC 0,5558, approval 28,5%, bad rate 6,67%; challenger (LR mentah) ROC-AUC 0,7426, PR-AUC 0,5049, approval 20,25%, bad rate 9,14%. Setiap metrik dibaca terhadap baseline modelnya sendiri — dan SELISIH champion−challenger (gap ROC-AUC 0,0390, gap bad rate 2,47 pp, gap approval 8,25 pp, gap profit NT$6.391.000) adalah metrik tersendiri: gap yang melebar di live berarti challenger makin tertinggal, walau masing-masing masih di dalam ambangnya. Ambangnya: PSI skor di atas 0,1 = WASPADA, di atas 0,25 = KRITIS; ROC-AUC turun lebih dari 0,02 dari baseline modelnya (champion 0,7816; challenger 0,7426) = WASPADA, 2 periode = KRITIS; PR-AUC turun lebih dari 0,03 = WASPADA, 2 periode = KRITIS; bad rate di atas 10% = WASPADA, 2 periode = KRITIS; ECE di atas 0,02 = WASPADA (tetap WASPADA walau bertahan dua periode — ia tidak naik menjadi KRITIS; yang naik menjadi KRITIS setelah dua periode adalah ROC-AUC, PR-AUC, dan bad rate); approval bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU. Yang baru di lesson ini hanyalah CARA MEMBACANYA: per ramp, dan per model — champion dan challenger dibaca berdampingan, pada traffic yang sama.

**Nilai — dua kolom yang tidak boleh dicampur [M7.5]:** kolom TANPA LABEL (PSI skor, approval rate, distribusi skor) tersedia SEGERA begitu skor keluar — ini alarm pertamamu di tiap ramp. Kolom BERLABEL (bad rate, ROC-AUC, PR-AUC, ECE, fairness) hanya untuk COHORT MATANG — label default baru tersedia setelah jendela observasi 1 bulan lewat.

**Baik/buruk:** membaca champion dan challenger berdampingan itu bagus karena ia mengontrol populasi: bila PSI skor challenger 0,06 sementara PSI skor champion pada traffic yang sama 0,02, selisihnya adalah milik challenger — bukan milik dunia. Buruk bila metrik per ramp dibaca tanpa n: bad rate 7,69% pada 26 nasabah disetujui (ramp 1% [simulasi]) dan bad rate 9,15% pada 612 nasabah disetujui (ramp 5% diperpanjang [simulasi]) adalah dua angka dengan bobot bukti yang sangat berbeda.

**Mitigasi:** dashboard canary punya LIMA baris per ramp per model — (1) PSI skor vs train; (2) ROC-AUC/PR-AUC vs baseline PER MODEL — champion 0,7816/0,5558, challenger 0,7426/0,5049 (cohort matang saja); (3) approval + bad rate vs baseline PER MODEL — champion 28,5%/6,67%, challenger 20,25%/9,14% (bad rate cohort matang saja); (4) skor rata-rata (mean calibrated proba [notebook]) + ECE vs 0,2217/0,0087; (5) PSI 5 fitur kunci mingguan — ditambah SATU baris yang tidak ada di M7.5: disagreement rate challenger-vs-champion pada traffic ramp itu. Dibaca SETIAP PAGI oleh analis selama canary berjalan, MINGGUAN oleh risk manager.

---

## 8. Rollback — Kembali ke Champion Sebelum Kerugian Membesar

Rollback adalah kemampuan untuk kembali ke champion — lengkap, cepat, dan tanpa perdebatan — saat challenger terbukti merugikan. Rollback yang baik punya tiga sifat: CEPAT (menit, bukan minggu), LENGKAP (routing, threshold, DAN konfigurasi kembali ke versi champion), dan TANPA IZIN TAMBAHAN (orang yang bertugas sudah diberi wewenang SEBELUM insiden).

**Nilai — kriteria rollback [kebijakan lesson ini]:** rollback SEGERA (tanpa menunggu 2 periode) bila SATU dari ini terjadi — bad rate challenger di atas 12% pada cohort matang; PSI skor challenger di atas 0,25 (geser besar [M7.5]); approval rate challenger anjlok lebih dari 10 poin persen dari ekspektasinya dalam satu periode; atau insiden operasional (skor tidak keluar, fitur hilang, pipeline error). Rollback TERENCANA bila challenger gagal gate dalam 2 periode berturut-turut, atau STOP dua kali di canary. Prosedurnya lima langkah, berurutan: (1) BEKUKAN ramp — traffic challenger ke 0% SEKARANG; (2) KEMBALIKAN routing 100% ke champion DENGAN threshold 0,10 tunggal (v1) — ini rollback version dari template tata kelola M7.4 [M7.4]: bila deployment memakai threshold per grup (0,1058/0,0965 [M7.4]), rollback mengembalikan threshold TUNGGAL 0,10, bukan threshold per grup yang terakhir; (3) BEKUKAN challenger di shadow — ia boleh memutuskan lagi, tapi tidak bertindak, sampai tinjauan selesai; (4) CATAT insiden — tanggal, metrik pemicu, nomor gate yang gagal, siapa yang menekan tombol; (5) TINJAU sebelum challenger boleh masuk shadow lagi.

**Baik/buruk:** rollback SEGERA pada ambang keras bagus karena ia memotong kerugian sebelum dua periode mengonfirmasinya. Buruk bila ambang rollback terlalu longgar sehingga rollback tidak pernah terjadi: challenger yang merugikan pelan-pelan (bad rate 9,15% terus-menerus [simulasi]) tidak pernah menyentuh 12% — dan justru itulah gunanya rollback TERENCANA atas dua periode gagal gate.

**Mitigasi:** LATIH rollback sebelum kamu membutuhkannya — sekali per kuartal, tim melakukan rollback drill: dari challenger 25% kembali ke champion 100% + threshold 0,10 tunggal, ukur waktunya (target [kebijakan lesson ini]: di bawah 30 menit dari keputusan ke traffic kembali), dan catat apa yang macet. Rollback yang belum pernah dilatih adalah harapan, bukan kemampuan. Dan satu catatan: rollback mengembalikan MODEL dan THRESHOLD — bukan data. Nasabah yang sudah dirugikan challenger tidak «di-rollback»; kerugiannya dicatat sebagai biaya deployment.

---

## 9. Jebakan — Challenger Menang di Test tapi Kalah di Live

Ada enam cara challenger yang «menang di test» kalah di live. **Pertama, SELECTION (winner's curse [M6.5]):** challenger dipilih justru karena ia menang pada satu split, satu metrik, satu threshold yang kebetulan menguntungkannya. **Kedua, KALIBRASI:** threshold 0,10 yang diturunkan dari probabilitas terkalibrasi kehilangan maknanya bila probabilitasnya tidak terkalibrasi — atau bila kalibrasi bergeser di live (ECE 0,0087 di test bisa menjadi 0,1003 seperti simulasi S2 M7.5 [m75_drift_simulations.S2_pay_plus1.ece_10bin]). **Ketiga, POPULASI:** test adalah populasi kemarin; live adalah populasi hari ini. **Keempat, METRIK YANG SALAH:** menang di ROC-AUC tidak berarti menang di profit — ROC-AUC tidak mengenal LGD 0,45, margin 0,05, atau limit nasabah. **Kelima, «SEDERHANA = AMAN»:** LR mudah dijelaskan, cepat, stabil — dan tetap kalah NT$6.391.000. **Keenam, PEMAKAIAN ULANG TEST (test reuse [M8.1]):** test 6.000 yang sama sudah dipakai memilih empat kali — threshold 0,10 [M6.4], pemenang model [M6.5], verdict validasi [M8.1], dan challenger ini [M8.4]. Sebelum menyatakan challenger menang, bandingkan ia pada split validasi yang segar atau nested CV [M6.2], dan catat pemakaian ulang test itu di laporan.

**Nilai:** tiap jebakan di atas punya penangkal yang sudah diajarkan di lesson ini — selection dilawan dengan protokol fair [M6.5] + champion-challenger di data yang sama; kalibrasi dilawan dengan gate G3 (kalibrasi dulu, ECE ≤ 0,02); populasi dilawan dengan shadow live + PSI [M7.5]; metrik yang salah dilawan dengan metrik keputusan (profit, bad rate); «sederhana = aman» dilawan dengan tujuh gate; pemakaian ulang test dilawan dengan split validasi yang segar atau nested CV [M6.2] + catatan pemakaian test [M8.1]. Di M6.5, McNemar yang sama dipakai untuk membandingkan kebenaran prediksi LR vs GBM pada threshold 0,50 — di sini ia dipakai atas KEPUTUSAN pada threshold 0,10; angka M6.5 tidak dipakai di lesson ini karena threshold-nya berbeda.

**Baik/buruk:** daftar jebakan ini bagus karena ia mengubah «challenger kalah di live» dari misteri menjadi diagnosis. Buruk bila dibaca sebagai «jadi jangan pernah ganti model»: champion hari ini adalah challenger kemarin yang lolos tujuh gate.

**Mitigasi:** sebelum challenger masuk canary, jalankan CHECKLIST ANTI-JEBAKAN: (1) apakah ia menang di protokol fair, bukan satu split yang dipilih? [M6.5] (2) apakah ia terkalibrasi, dan ECE-nya diukur di data yang belum dilihat? (3) apakah shadow-nya dihitung pada test DAN direncanakan pada live? (4) apakah metrik kemenangannya metrik keputusan (profit/bad rate), bukan hanya ROC-AUC? (5) apakah ada yang mengklaim ia aman «karena sederhana» — dan bila ya, minta angka gate-nya. Satu «tidak» = challenger belum siap canary.

---

## 10. Mini-Case — Putuskan dari Angka: Challenger Naik atau Tidak?

Fakta [notebook]: champion GBM terkalibrasi — approval 28,50%, bad rate 6,67%, profit +NT$8.214.000. Challenger LR mentah — approval 20,25%, bad rate 9,14%, profit +NT$1.823.000. Disagreement 19,42% (1.165 dari 6.000); McNemar b = 830, c = 335, χ² = 209,473, p < 0,0001. Shadow: 335 approvals challenger-only bad rate 18,21% (net −NT$4.861.000 bila bertindak); 830 rejections challenger-only good rate 92,29% (margin forgone gross NT$6.354.000). Canary [simulasi]: berhenti di 5% (TAHAN, lalu STOP). Gate naik: G1 profit, G2 bad rate ≤ 7,67%, G3 kalibrasi ECE ≤ 0,02, G4 disagreement, G5 monitoring, G6 fairness, G7 dua periode.

**Jawaban: TIDAK — challenger tidak naik. Buktinya empat lapis. Pertama, PROFIT:** challenger kalah NT$6.391.000 pada 6.000 nasabah yang sama — G1 gagal, dan selisihnya bukan noise (McNemar p < 0,0001 memastikan keputusannya memang berbeda sistematis, dan arah perbedaannya merugikan — b = 830 vs c = 335). **Kedua, SHADOW CELLS:** switch akan menyetujui 335 nasabah dengan bad rate 18,21% (net −NT$4.861.000) dan menolak 766 nasabah baik (margin forgone gross NT$6.354.000) — harga switch sudah diketahui SEBELUM dibayar, dan harganya mahal di kedua arah. **Ketiga, GATE:** G1 gagal, G2 gagal (9,14% > 7,67%), G3 gagal (LR mentah, belum dikalibrasi), G4 gagal isi, G7 gagal (tidak ada dua periode lolos) — 0 dari 7 gate lolos, 2 belum diuji. **Keempat, CANARY [simulasi]:** challenger bahkan tidak mencapai 25% — ia STOP di 5%.

**Nilai:** keputusan «TIDAK» di sini bukan penolakan terhadap LR sebagai model — melainkan penolakan terhadap LR SEBAGAI PENGGANTI champion PADA THRESHOLD 0,10 MENTAH. Tindak lanjut yang benar: (1) kalibrasi LR (Platt/sigmoid) lalu bandingkan ulang pada 0,10 — bukti [m8_lr_calibrated_thr010] menunjukkan kalibrasi saja tidak menutup kesenjangan (1.166 vs 1.710 disetujui; profit +NT$1.886.500 vs +NT$8.214.000), tapi perbandingan yang benar menuntutnya; (2) bila LR terkalibrasi tetap kalah, buang challenger ini dan cari challenger lain; (3) simpan lembar gate + sel shadow sebagai catatan keputusan.

**Baik/buruk:** vonis «TIDAK» ini bagus karena ia murah — ia dibayar dengan shadow dan canary 5%, bukan dengan satu bulan profit. Buruk bila vonis ini dibaca sebagai «LR tidak berguna»: LR tetap berguna sebagai baseline yang mudah dijelaskan dan sebagai pembanding — yang ia tidak boleh adalah menggantikan champion di sini, sekarang, dengan bukti ini.

**Mitigasi:** setiap kali kamu memutuskan «TIDAK» atas challenger, tulis SATU PARAGRAF vonis: angka yang menggagalkannya, gate yang gagal, dan syarat untuk mencoba lagi. Vonis yang ditulis adalah vonis yang tidak perlu diulang.

---

## Lab 1: Disagreement Rate + McNemar dari Angka Kanonis

Hitung dua angka inti champion-challenger — dari hitungan kanonis test 6.000 [notebook]: b = 830 (champion setuju, challenger tolak), c = 335 (challenger setuju, champion tolak). Disagreement rate = (b + c) / 6.000. χ² McNemar dengan koreksi kontinuitas Yates = (|b − c| − 1)² / (b + c). Signifikan bila χ² melewati nilai kritis df=1 pada p = 0,0001, yaitu 15,1367.

Hasil [lab]: n_disagree=1165; disagreement_rate=0.1942; chi2=209.4730; significant=True. χ² 209,473 adalah hampir 14 kali (13,84×) nilai kritis 15,1367 — bukan «sedikit signifikan», melainkan berbeda jauh melampaui keraguan. Dan ingat: signifikan di sini berarti KEPUTUSANNYA berbeda — bukan berarti challenger lebih buruk. Yang membuktikan challenger lebih buruk adalah profit dan bad rate.

## Lab 2: Keputusan Canary — Lanjut, Tahan, Stop, atau Rollback?

Aturan per ramp [kebijakan lesson ini]: LANJUT bila bad rate ≤ 0,08 DAN PSI skor ≤ 0,10; TAHAN bila bad rate ≤ 0,10 DAN PSI skor ≤ 0,10 (zona abu-abu), dan TAHAN juga bila PSI skor 0,10–0,25 tanpa bad rate buruk; STOP bila bad rate > 0,10 ATAU PSI skor > 0,25 ATAU dua TAHAN berturut-turut; ROLLBACK bila keputusan akhirnya STOP. Data per ramp [simulasi] — basis traffic canary [simulasi]: 1 periode = 12.000 aplikasi masuk (1% = 120; 5% = 600); R2-ext = 5 periode @ 600 = 3.000. R1 1% (n = 120, disetujui 26, default 2, PSI 0,02); R2 5% (n = 600, disetujui 123, default 11, PSI 0,05); R2-ext 5% diperpanjang (n = 3.000, disetujui 612, default 56, PSI 0,06).

Hasil [lab]: bad_R1=0.0769; decision_R1=LANJUT; bad_R2=0.0894; decision_R2=TAHAN; bad_R2ext=0.0915; decision_R2ext=STOP; final=ROLLBACK. R1 LANJUT bukan karena challenger «bagus» — melainkan karena n = 120 terlalu kecil untuk membuktikan ia buruk. R2 TAHAN karena 8,94% masuk zona abu-abu. R2-ext STOP karena ini TAHAN kedua berturut-turut — dua kali abu-abu adalah vonis, bukan kebetulan.

---

## Lab 3: Rollback Tabletop — Runbook di Bawah 30 Menit, atau Drill-nya Gagal

Runbook 10 bagian + menit [ilustrasi]: trigger 2, authority 2, commands/steps 3, configuration bundle 5, validation 5, queued decisions 3, replay/reconciliation 5, communication 2, incident ticket 1, post-mortem 1 — total 29 menit.

Hasil [lab]: total_time=29; n_sections=10; rollback_valid=True; total_time_scenario=32; rollback_valid_scenario=False. rollback_valid = total < 30 menit DAN bundle dipin DAN langkah validasi ada. Skenario: replay memakan 8 menit (bukan 5) → total 32 menit, melewati target — drill GAGAL; yang diperbaiki adalah langkah replay-nya, bukan targetnya.

---

## Guided Task di Colab

Guided task di Colab — notebook: colab/mlf-m84-guided-task.ipynb — flagship GBM terkalibrasi + challenger LR mentah, disagreement + McNemar, kedua sel shadow dengan harga switch-nya, dan simulasi canary dengan checks. Tautan Colab: https://colab.research.google.com/drive/13GwZQORed8Oo75BWuVXaCgScjUdS0PJ3

## Rangkuman

- Big-bang hanya bila blast radius kecil, reversible dalam hitungan menit, dan tidak ada uang yang dipertaruhkan — untuk keputusan kredit, pakai bertahap: shadow → canary 1% → 5% → 25% → 100% [kebijakan lesson ini] dengan gate di tiap ramp.
- Shadow [notebook]: disagreement 19,42% (1.165 dari 6.000); challenger-only approvals n = 335, bad rate 18,21% (net −NT$4.861.000 bila bertindak); challenger-only rejections n = 830, good rate 92,29% (margin forgone gross NT$6.354.000).
- Champion vs challenger [notebook]: approval 28,50% vs 20,25%, bad rate 6,67% vs 9,14%, profit +NT$8.214.000 vs +NT$1.823.000 (selisih −NT$6.391.000), cost NT$33.046.500 vs NT$39.437.500; ROC-AUC 0,7816 vs 0,7426, Brier 0,1345 vs 0,1427.
- McNemar atas keputusan: b = 830, c = 335, χ² = 209,473, p < 0,0001 — keputusan BERBEDA signifikan; McNemar menguji perbedaan, profit membuktikan siapa lebih baik. Tulis p < 0,0001, JANGAN «p = 0».
- Selisih profit SEBAGIAN artefak kalibrasi — LR dinilai mentah pada 0,10 yang sama (0,10 LR ≠ 0,10 champion); bukti artefaknya hanya sebagian: LR terkalibrasi Platt [M6.4] menyetujui 1.166 nasabah [m8_lr_calibrated_thr010] (profit +NT$1.886.500 vs +NT$8.214.000), tetap jauh dari 1.710 champion. Ranking invarian ≠ approval invarian; «mentah» hanya untuk model tak terkalibrasi.
- Tujuh gate naik [kebijakan lesson ini]: G1 profit, G2 bad rate ≤ 7,67%, G3 kalibrasi ECE ≤ 0,02, G4 disagreement, G5 monitoring M7.5, G6 fairness AIR ≥ 0,80, G7 dua periode — LR gagal G1, G2, G3, G4 (isi), G7; G5/G6 belum diuji; 0 dari 7 lolos.
- Canary [simulasi]: 1% LANJUT (bad 7,69%), 5% TAHAN (bad 8,94%), 5% diperpanjang STOP (bad 9,15%, TAHAN kedua) → ROLLBACK; 25% dan 100% tidak dicapai.
- Deployment readiness: 12 item — 2 gagal [ilustrasi] = deployment DIBLOKIR; readiness gerbang biner, bukan skor.
- Desain eksperimen canary: sampel efektif bad rate R1 = 26 yang disetujui (bukan 120 traffic); assignment hash(customer_id) stabil per nasabah; cohort sebanding (balance check dulu); STOP atas bad rate butuh n_approved ≥ 100 [kebijakan lesson ini]; ambang ditulis SEBELUM ramp dibuka.
- Decision matrix: superiority / non-inferiority / equivalence / reject — margin ROC-AUC 0,01, profit NT$500.000, bad rate 1,00 pp [kebijakan lesson ini]; hard constraint fairness AIR ≥ 0,80 dan ECE ≤ 0,02 tidak bisa ditukar profit; LR = REJECT.
- Rollback drill: runbook 10 bagian, total 29 menit < target 30 menit [kebijakan lesson ini]; skenario replay 8 menit → 32 menit = drill GAGAL.
- Monitoring gates meminjam M7.5 [M7.5]: PSI > 0,1 waspada / > 0,25 kritis, ROC-AUC turun > 0,02, PR-AUC turun > 0,03, bad rate > 10%, ECE > 0,02 (WASPADA, bukan KRITIS) — dibaca per ramp per model terhadap baseline modelnya sendiri (champion 0,7816/0,5558/28,5%/6,67%; challenger 0,7426/0,5049/20,25%/9,14%) plus gap champion−challenger sebagai metrik tersendiri; metrik tanpa label segera, metrik berlabel hanya cohort matang.
- Rollback [kebijakan lesson ini]: SEGERA bila bad rate > 12% / PSI > 0,25 / approval anjlok > 10 pp / insiden; TERENCANA bila 2 periode gagal gate; prosedur 5 langkah termasuk kembali ke threshold 0,10 tunggal (v1) [M7.4]; latih rollback tiap kuartal.
- Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah (ROC-AUC ≠ profit), «sederhana = aman», pemakaian ulang test [M8.1] — tiap jebakan punya penangkal di lesson ini.
- Mini-case: TIDAK NAIK — profit, shadow cells, tujuh gate, dan canary semuanya berkata sama. Tindak lanjut: kalibrasi LR lalu bandingkan ulang, atau buang challenger ini.
- Lab: disagreement 0,1942 + χ² 209,4730 signifikan (p < 0,0001); canary LANJUT → TAHAN → STOP → ROLLBACK; lab 3 rollback: total 29 menit < 30 menit [kebijakan lesson ini], skenario 32 menit = GAGAL.
