import type { V2Lesson } from "../lib/types";

export const mlfM95: V2Lesson = {
  slug: "mlf-m95-historical-simulation-bootstrap",
  track: "Machine Learning Finance",
  module: "Simulation, Backtesting & Validation",
  title: "MLF-M9.5 — Historical Simulation & Bootstrap: Tiga Cara Menjawab «Berapa VaR?»",
  estMinutes: 100,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Tiga cara menjawab «berapa VaR?» — dan ketiganya memberi angka berbeda",
      prose: [
        "Komite risiko bertanya satu hal: «Berapa VaR95 portofolio kita besok?» Kamu punya data yang sama untuk semua orang — 480 hari SIMPLE daily returns portofolio equal-weight BBCA/KLBF/UNVR (4 November 2024 – 11 November 2026), mean harian −0,0006, sd harian 0,0196 — dan tiga cara menjawab yang sah. Historical simulation menjawab 0,0286. Metode parametrik (normal) menjawab 0,0328. Bootstrap tidak memberi jawaban keempat; ia memberi pita: CI95 [0,0229; 0,0322] di sekitar 0,0286. Tiga jawaban, satu data, selisih terbesar 0,0044 — sekitar 15% dari nilai terkecilnya. Mana yang «benar»?",
        "Jawaban lesson ini: tidak ada yang «benar» tanpa menyebut asumsinya. Historical simulation (HS) percaya pada data apa adanya — tanpa mengasumsikan bentuk distribusi — tapi buta terhadap apa yang belum pernah terjadi. Parametrik percaya pada kurva normal — rapi dan stabil — tapi ekornya terlalu tipis untuk data yang ekornya tebal. Bootstrap tidak memberi jawaban keempat; ia memberi tahu seberapa GOYAH jawaban pertama — interval kepercayaan (CI) yang mengukur ketidakpastian SAMPLING, bukan ketidakpastian model. Lesson terakhir track ini mengajarkan ketiganya sekaligus, di atas angka kanonis yang sama yang sudah kamu kenal sejak M4.2 — dan ditutup dengan satu laporan ke komite yang memuat angka, interval, dan metode sekaligus.",
        "Konteks angka lesson ini: portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns (bukan log return — bedanya eksplisit di langkah 2), n=480 hari; hari terburuk −0,1398 pada 2026-10-16 [M9.2]; skew −0,5091 dan excess kurtosis 6,0216 (ekor tebal, miring ke kiri). Semua angka VaR/ES/CI di lesson ini berasal dari qa-learn/m9_canonical.json (HS windows + bootstrap B=10.000, seed 42), dihitung dari data, bukan karangan. Angka rujukan modul lain dikutip dengan modulnya: parametrik dari [M4.2], autokorelasi kuadrat dari [M4.3], Monte Carlo dari [M9.1], bootstrap CI kredit dari [M8.1].",
        "Peta lesson: cerita tiga jawaban → historical simulation: definisi dan kekuatannya → jendela HS: 120 vs 250 vs 480 hari → parametrik: kapan normal menipu → bootstrap iid: CI sebagai pita → block bootstrap: dependensi waktu melebarkan CI → tabel tiga arah: kapan pakai yang mana → bootstrap untuk metrik lain: drift yang tidak signifikan → jebakan: CI sempit yang palsu → 2 lab → mini-case: laporan ke komite → checkpoint dan penutup track.",
        "Nilai: lesson ini bagus karena ia mengubah pertanyaan «berapa VaR?» dari soal hitung-menghitung menjadi soal KEJUJURAN ASUMSI. VaR95 0,0286 tanpa menyebut metode dan jendela adalah angka yang tidak bisa diaudit — ia bisa 0,0283 (jendela 120 hari), 0,0311 (jendela 250 hari), atau 0,0328 (parametrik) — dan ketiganya dihitung dari data yang sama. Pelajar yang selesai lesson ini tidak lagi menjawab «VaR-nya 0,0286» — ia menjawab «VaR95 HS 0,0286, CI95 bootstrap [0,0229; 0,0322]; param 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk».",
        "Baik atau buruk: tiga jawaban yang berbeda itu BAGUS sebagai pelajaran — ia menunjukkan bahwa «VaR» bukan satu bilangan di alam, melainkan keluaran dari satu METODE atas satu DATA. Buruk bila dibaca sebagai «jadi semuanya terserah»: tidak terserah — tiap metode punya asumsi yang bisa diperiksa, dan data ini (kurtosis 6,02, skew −0,51, autokorelasi kuadrat lag-1 0,1043 [M4.3]) memberi tahu metode mana yang asumsinya paling jujur. Lesson ini memberi ceklis untuk memilihnya.",
        "Mitigasi: setiap kali kamu melaporkan VaR, tulis tiga hal dalam satu kalimat — ANGKA, METODE, dan JENDELA (atau asumsi). «VaR95 0,0286» tanpa ketiganya adalah klaim yang tidak bisa diperiksa; «VaR95 HS (480 hari) 0,0286» adalah klaim yang bisa diaudit — dan bisa dibantah dengan data.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «VaR» adalah satu bilangan",
        type: "pitfall",
        body: "Yang benar: VaR95 portofolio ini adalah 0,0286 (HS 480 hari), 0,0328 (parametrik), 0,0329 (Monte Carlo [M9.1]) — tiga bilangan dari tiga metode atas data yang sama. Menyebut «VaR-nya 0,0286» tanpa metode sama dengan menyebut «suhunya 30» tanpa satuan: angkanya ada, maknanya tidak.",
      },
    },
    {
      id: "hs-definisi",
      eyebrow: "Langkah 2 · Historical simulation",
      title: "Historical simulation: kuantil empiris — tanpa mengasumsikan bentuk apa pun",
      prose: [
        "Historical simulation (HS) adalah cara paling jujur — dan paling naif — menjawab «berapa VaR?»: urutkan 480 return harian dari yang terburuk ke yang terbaik, lalu baca kuantilnya. VaR95 adalah MINUS kuantil 5%: kerugian yang hanya dilampaui 5% hari. ES95 (Expected Shortfall) adalah MINUS rata-rata kerugian pada hari-hari yang LEBIH BURUK dari VaR95 — rata-rata ekornya. Definisi eksaknya: HS VaR = kuantil empiris dari return historis. Bukan «VaR dari data masa lalu yang pasti terulang» — masa lalu tidak berjanji terulang; HS hanya berkata «inilah yang TERJADI pada 480 hari itu, dan kuantilnya adalah ini».",
        "Nilai [m9_canonical.json] — portofolio SIMPLE returns, n=480. VaR95 0,0286, ES95 0,0445, VaR99 0,0479, ES99 0,0775. Dalam rupiah per Rp100 juta (portofolio IDX — «Rp» hanya dipakai untuk portofolio ini): VaR95 Rp2.860.000, ES95 Rp4.450.000, VaR99 Rp4.790.000, ES99 Rp7.750.000. Perhatikan dua hal. Pertama, ES95 (0,0445) jauh lebih besar dari VaR95 (0,0286) — selisih 0,0159: begitu kerugian melewati VaR, rata-rata kerugiannya 56% lebih besar (0,0445/0,0286 ≈ 1,56). Kedua, ES95 dihitung dari 24 hari terburuk (5% dari 480) — cukup banyak untuk dirata-rata dengan wajar — sedangkan ES99 hanya dari sekitar 5 hari (1% dari 480) — jauh lebih goyah. Laporkan n ekor bersama ES: «ES95 0,0445 (24 hari)» dan «ES99 0,0775 (sekitar 5 hari)».",
        "Satu hal yang wajib eksplisit: SIMPLE vs LOG return. Semua angka HS lesson ini memakai SIMPLE daily returns (pct_change harga, portofolio = rata-rata tiga saham) — konvensi yang sama dengan M4.2 VaR dan M5. Simulasi GBM di M9 memakai LOG returns — dan itu deret yang berbeda (mean log −0,0008 vs mean simple −0,0006). Jangan campur: VaR dari simple return tidak sama dengan VaR dari log return, dan «Rp» di sini hanya untuk portofolio IDX ini — metrik kredit UCI memakai NT$, bukan Rp.",
        "Nilai: HS bagus karena ia TIDAK MENGASUMSIKAN bentuk distribusi — ia tidak perlu percaya normal, tidak perlu percaya apa pun kecuali data. Itulah sebabnya HS menangkap ekor tebal (kurtosis 6,02) secara otomatis: hari terburuk −0,1398 pada 2026-10-16 [M9.2] ADA di dalam datanya, dan ia ikut menarik ES95 ke atas. Metode yang tidak mengasumsikan apa pun tidak bisa «salah asumsi».",
        "Baik atau buruk: HS bagus bila datamu banyak dan mewakili — 480 hari dengan satu crash di dalamnya adalah data yang jujur. Buruk bila datamu sedikit (langkah 3: jendela 120 hari) atau bila rezimnya berganti: HS mengasumsikan 480 hari kemarin mewakili besok — asumsi stasioneritas yang tidak pernah ditulis, tapi selalu ada. Dan buruk dalam satu hal yang mendasar: ekor DI LUAR sampel tidak terlihat. Hari terburuk yang pernah terjadi adalah −0,1398 — tapi HS tidak bisa berkata apa-apa tentang hari −0,20 yang belum pernah terjadi; kuantil empirisnya berhenti di data.",
        "Mitigasi: pakai HS sebagai jawaban PERTAMA — yang paling sedikit asumsi — lalu tanyakan dua hal: «apakah 480 hari ini mewakili besok?» (langkah 3) dan «seberapa goyah kuantil ini?» (langkah 5–6). HS tanpa CI adalah angka yang berpura-pura pasti; HS dengan CI adalah angka yang jujur tentang ketidkpastiannya.",
      ],
      formula: String.raw`\mathrm{VaR}_{\alpha} = -\, Q_{1-\alpha}(r), \qquad \mathrm{ES}_{\alpha} = -\,\mathbb{E}\bigl[r \,\big|\, r \le Q_{1-\alpha}(r)\bigr]`,
      formulaNote: "VaR95 = minus kuantil 5% return historis (Q = kuantil empiris, interpolasi linear cara numpy); ES95 = minus rata-rata return pada hari-hari yang kurang dari atau sama dengan kuantil itu. Pada n=480: VaR95 0,0286 (kuantil 5%), ES95 0,0445 (rata-rata 24 hari terburuk). ES99 0,0775 hanya dari sekitar 5 hari — laporkan n ekor bersama ES.",
      tasks: [],
      note: {
        title: "Miskonsepsi: HS berarti «masa lalu akan terulang»",
        type: "pitfall",
        body: "Yang benar: HS VaR = kuantil empiris — ringkasan dari APA YANG TERJADI pada 480 hari itu. Ia tidak menjanjikan masa lalu terulang; ia mengasumsikan 480 hari itu MEWAKILI besok (stasioneritas). Bila rezim berganti (langkah 3), kuantil kemarin bukan lagi kuantil besok — dan HS tidak memberi peringatan apa pun saat itu terjadi.",
      },
    },
    {
      id: "hs-jendela",
      eyebrow: "Langkah 3 · Jendela HS",
      title: "Jendela HS: 120 vs 250 vs 480 — jawabanmu bergerak mengikuti jendelamu",
      prose: [
        "HS punya satu pilihan yang tidak bisa dihindari: BERAPA hari ke belakang yang dipakai? Jendela adalah pilihan — 120, 250, atau 480 hari terakhir (semuanya berakhir 11 November 2026) — dan pilihan itu mengubah jawaban. Nilai [m9_canonical.json]: jendela 120 hari (20 Mei 2026 – 11 November 2026) → VaR95 0,0283, ES95 0,0557, VaR99 0,0472, ES99 0,0941. Jendela 250 hari (28 Oktober 2025 – 11 November 2026) → VaR95 0,0311, ES95 0,0467, VaR99 0,0464, ES99 0,0801. Jendela 480 hari (4 November 2024 – 11 November 2026) → VaR95 0,0286, ES95 0,0445, VaR99 0,0479, ES99 0,0775.",
        "Bacalah pergerakannya. VaR95 bergerak 0,0283 → 0,0311 → 0,0286: rentang 0,0028 (0,0311 − 0,0283), sekitar 10% dari nilainya (0,0028/0,0286 ≈ 9,8%) — hanya karena jendelanya diganti. VaR99 hampir tidak bergerak (0,0472 / 0,0464 / 0,0479 — rentang 0,0015), tapi ES-lah yang bercerita: ES95 jendela 120 hari 0,0557 JAUH lebih besar dari ES95 jendela 480 hari 0,0445 — selisih 0,0112, atau 25% lebih besar (0,0557/0,0445 ≈ 1,25). Penyebabnya satu hari: 2026-10-16, −0,1398 [M9.2] — hari terburuk dalam 480 hari — ADA di dalam jendela 120 hari, dan pada 120 hari ia adalah 1 dari 6 hari ekor (5% dari 120), bukan 1 dari 24. Satu hari yang sama, bobot empat kali lebih besar. ES99 jendela 120 hari 0,0941 bahkan lebih ekstrem: 1% dari 120 hari berarti ES99 dirata-rata dari sekitar satu-dua observasi terburuk (≈1,2 hari) — satu-dua observasi yang menentukan seluruh angka.",
        "Nilai: perbandingan tiga jendela ini bagus karena ia membuat trade-off-nya TERLIHAT dengan angka, bukan dengan slogan. Jendela pendek (120 hari) RESPONSIF: ia menangkap crash Oktober 2026 dengan bobot penuh — VaR/ES-nya langsung naik. Jendela panjang (480 hari) STABIL: satu hari buruk tenggelam dalam 479 hari lain — VaR95-nya hanya bergerak 0,0028 antar-jendela. Tidak ada jendela yang «benar» — ada jendela yang cocok dengan pertanyaanmu.",
        "Baik atau buruk: jendela pendek bagus bila rezim BARU saja dimulai dan kamu ingin VaR yang cepat meresponsnya — dan buruk karena ia BERISIK: ES99 dari sekitar satu-dua observasi terburuk (≈1,2 hari) bukanlah estimasi, melainkan satu-dua observasi yang menyamar sebagai estimasi. Jendela panjang bagus bila kamu ingin estimasi yang stabil dan ekor yang dihitung dari banyak hari (24 hari untuk ES95) — dan buruk karena ia LAMBAT: bila rezim berganti hari ini, VaR 480-hari baru «menyadari»-nya setelah hari-hari baru menumpuk. Jendela 250 hari adalah kompromi yang umum — tetapi «umum» bukan argumen: 250 adalah pilihan [kebijakan lesson ini] bila kamu memakainya sebagai default, bukan hukum alam.",
        "Mitigasi: laporkan VaR HS selalu BERSAMA jendelanya — «VaR95 HS (480 hari) 0,0286» — dan, bila keputusannya penting, laporkan dua jendela (pendek dan panjang) berdampingan. Bila keduanya jauh berbeda (di sini ES95 0,0557 vs 0,0445), selisih itu SENDIRI adalah informasi: ia berkata «ada satu peristiwa besar di jendela pendek yang jendela panjang encerkan» — dan komite berhak tahu peristiwa apa itu (2026-10-16, −0,1398).",
      ],
      tasks: [],
      note: {
        title: "Jebakan: memilih jendela sesudah melihat angkanya",
        type: "pitfall",
        body: "Yang benar: jendela dipilih DULU — dari pertanyaanmu («seberapa cepat VaR harus merespons rezim baru?») — bukan sesudah melihat VaR mana yang paling nyaman. Memilih 120 hari karena VaR-nya lebih kecil (0,0283 vs 0,0311) adalah memilih jawaban, bukan memilih metode. Tulis jendelamu sebelum menghitung.",
      },
    },
    {
      id: "parametrik",
      eyebrow: "Langkah 4 · Parametrik",
      title: "Parametrik: kurva normal yang rapi — dan ekor yang ia tipiskan",
      prose: [
        "Metode parametrik menjawab «berapa VaR?» dengan rumus, bukan dengan mengurutkan data: asumsikan return berdistribusi NORMAL dengan mean dan sd dari data, lalu VaR95 = −(mean + sd × z₀,₀₅) dan ES95 = −(mean − sd × φ(z₀,₀₅)/0,05). Nilai [M4.2] — mean harian −0,0006, sd harian 0,0196: VaR95 0,0328, ES95 0,0410, VaR99 0,0462, ES99 0,0528. Dalam rupiah per Rp100 juta: VaR95 Rp3.280.000, ES95 Rp4.100.000. Bandingkan dengan HS 480 hari (langkah 2): VaR95 parametrik 0,0328 LEBIH BESAR dari HS 0,0286 (selisih 0,0042 — param 14,7% lebih besar), tetapi ES95 parametrik 0,0410 LEBIH KECIL dari HS 0,0445 (selisih −0,0035).",
        "Di sinilah pelajaran kunci lesson ini — bacalah dengan saksama, karena intuisi yang salah di sini adalah kesalahan yang paling umum. Intuisi yang salah berkata: «distribusi ini ekornya tebal (kurtosis 6,02), jadi VaR historis PASTI lebih besar dari VaR normal». Data ini MENYANGKAL intuisi itu: VaR95 hist (0,0286) LEBIH KECIL dari param (0,0328). Yang gemuk bukan kuantil 5%-nya — kuantil 5% empiris justru lebih kecil dari kuantil 5% normal. Yang gemuk adalah BEYOND-VaR — ekor DI BALIK VaR: ES95 hist (0,0445) LEBIH BESAR dari param (0,0410), dan ES99 hist (0,0775) JAUH lebih besar dari param (0,0528) — selisih 0,0247, atau 47% lebih besar. Kurva normal menebak bentuk ekor dari sd-nya; data ini punya ekor yang «menjorok ke dalam» di sekitar kuantil 5% tetapi «menjulur jauh» di ujungnya — satu hari −0,1398 yang berjarak 7 sd dari mean (−0,1398/0,0196 ≈ 7,1 sd; di bawah normal, peristiwa 7 sd praktis mustahil). Skew −0,5091 menambah arahnya: ekor kirinya (kerugian) lebih panjang dari ekor kanannya.",
        "Nilai: parametrik bagus karena ia STABIL dan LENGKAP: dua angka (mean, sd) menentukan seluruh kurva — VaR berapa pun horizonnya, ES berapa pun alphanya, tanpa butuh 480 hari data. Ia juga memberi jawaban untuk ekor yang belum pernah terjadi: normal bisa berkata tentang hari −0,20, HS tidak bisa. Dan pada data ini ia memberi peringatan yang berguna: VaR95-nya 0,0328 — lebih konservatif dari HS 0,0286 — sebagai pembanding yang jujur.",
        "Baik atau buruk: normal bagus bila datamu memang mendekati normal — dan cukup bila yang kamu butuhkan hanya VaR95 untuk horizon pendek, karena di kuantil 5% selisihnya hanya 0,0042. Buruk — dan menipu — bila yang kamu butuhkan adalah ES, terutama ES99: param 0,0528 vs hist 0,0775 adalah selisih 0,0247 yang TIDAK bisa diabaikan, karena ES-lah yang mengukur «seberapa buruk bila VaR terlampaui». Normal menipu tepat di tempat yang paling penting: di ujung ekor, saat kerugian sudah melampaui VaR. Aturan praktisnya: makin jauh ke ekor (99% vs 95%) dan makin tebal kurtosisnya (6,02 di sini), makin besar kebohongan normal.",
        "Mitigasi: pakai parametrik sebagai PEMBANDING, bukan sebagai jawaban tunggal — dan selalu sandingkan VaR-nya dengan ES-nya. Bila VaR param > VaR hist TAPI ES param < ES hist (seperti di sini), tuliskan kalimat ini di laporanmu: «kuantil 5% empiris lebih kecil dari normal, tetapi ekor di balik VaR lebih gemuk dari normal». Kalimat itu — bukan «distribusi lebih gemuk» yang generik — adalah kesimpulan yang benar dari data ini. Bila datamu punya kurtosis tinggi, jangan pernah laporkan VaR parametrik tanpa ES historis di sampingnya.",
      ],
      formula: String.raw`\mathrm{VaR}_{\alpha} = -(\mu + \sigma\, z_{1-\alpha}), \qquad \mathrm{ES}_{\alpha} = -\left(\mu - \sigma\, \frac{\phi(z_{1-\alpha})}{1-\alpha}\right)`,
      formulaNote: "Rumus normal: z₀,₀₅ = −1,6449 dan φ(z) = densitas normal standar. Dengan μ = −0,0006 dan σ = 0,0196 [M4.2]: VaR95 = −(−0,0006 + 0,0196 × (−1,6449)) = 0,0328; ES95 = 0,0410. Rumus ini mengasumsikan return normal — asumsi yang dilanggar data ini (excess kurtosis 6,0216, skew −0,5091).",
      tasks: [],
      note: {
        title: "Miskonsepsi: «ekor gemuk → VaR hist pasti lebih besar»",
        type: "pitfall",
        body: "Yang benar: di data ini VaR95 hist 0,0286 LEBIH KECIL dari VaR95 param 0,0328 — klaim «ekor gemuk → VaR hist pasti lebih besar» SALAH di data ini. Yang gemuk adalah BEYOND-VaR: ES95 hist 0,0445 > param 0,0410, dan ES99 hist 0,0775 jauh di atas param 0,0528. Ekor tebal tidak menjamin kuantil 5%-nya lebih besar — ia menjamin ujung ekornya lebih jauh.",
      },
    },
    {
      id: "bootstrap-iid",
      eyebrow: "Langkah 5 · Bootstrap iid",
      title: "Bootstrap iid: bukan jawaban keempat — melainkan pita di sekitar jawaban pertama",
      prose: [
        "HS memberimu satu angka: VaR95 0,0286. Tapi 480 hari itu SATU sampel dari sejarah yang mungkin — seandainya 480 hari yang lain yang terjadi, kuantil 5%-nya akan sedikit berbeda. Seberapa berbeda? Itulah yang dijawab BOOTSTRAP: ambil 480 hari itu, tarik-ulang 480 hari DENGAN pengembalian (satu hari boleh muncul dua kali, hari lain boleh hilang) — itu satu «sejarah alternatif» — hitung VaR95-nya; ulangi B=10.000 kali (seed 42); lalu baca sebaran 10.000 VaR95 itu. Definisi eksaknya: bootstrap CI = ketidakpastian SAMPLING — seberapa goyah statistikmu bila sampelnya ditarik ulang dari data yang sama. Ia BUKAN ketidakpastian model: ia tidak berkata apa-apa tentang apakah HS, parametrik, atau Monte Carlo yang benar — ia berkata «ANDAIKAN HS yang dipakai, seberapa goyah 0,0286 itu?».",
        "Nilai [m9_canonical.json] — bootstrap iid, B=10.000, seed 42, resampling 480 hari. VaR95: mean bootstrap 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]. ES95: mean 0,0440, sd 0,0057, CI95 [0,0346; 0,0569]. Bacalah tiga hal dari angka-angka itu. Pertama, mean bootstrap VaR95 (0,0284) hampir sama dengan VaR95 HS (0,0286) — selisih 0,0002: HS tidak bias secara berarti di sini. Kedua, CI VaR95 selebar 0,0093 (0,0322 − 0,0229) — VaR95 «0,0286» itu sebenarnya «antara 0,0229 dan 0,0322». Ketiga, CI ES95 selebar 0,0223 (0,0569 − 0,0346) — 2,4 kali lebih lebar dari CI VaR95 (0,0223/0,0093 ≈ 2,40): ES dihitung dari 24 hari ekor, jadi ia jauh lebih goyah daripada VaR yang dihitung dari seluruh 480 hari. Dan perhatikan: batas ATAS CI VaR95 (0,0322) hampir menyentuh VaR95 parametrik (0,0328) — tetapi TIDAK mencapainya: 0,0328 berada DI LUAR CI [0,0229; 0,0322]. VaR95 parametrik 0,0328 melebihi batas atas CI iid 0,0322 (kelebihan 0,0006) — perbedaan metode itu bukan sekadar noise sampling.",
        "Perhatikan juga apa yang TIDAK dikatakan CI ini. CI [0,0229; 0,0322] tidak berarti «VaR besok pasti di antara 0,0229 dan 0,0322» — ia berarti «bila sejarah 480 hari ditarik ulang, VaR95 HS-nya jatuh di interval itu 95% dari waktu». VaR besok bisa di luar interval itu bila rezim berganti — CI mengukur goyahnya ESTIMASI, bukan goyahnya MASA DEPAN. Dan jangan pernah menulis VaR95 sebagai «0,0284 ± 0,0022» — itu menyajikan sd bootstrap (0,0022) sebagai ketidakpastian MEAN, kesalahan yang sama dengan yang diperbaiki di M6.2/M6.5. Yang benar: «VaR95 HS 0,0286, CI95 bootstrap [0,0229; 0,0322]» — intervalnya yang dilaporkan, bukan «mean ± sd».",
        "Nilai: bootstrap iid bagus karena ia MURAH dan JUJUR — tidak butuh asumsi distribusi (seperti HS) dan tidak butuh data baru: 10.000 sejarah alternatif dari 480 hari yang sama. Ia mengubah «0,0286» dari vonis menjadi estimasi dengan pita — dan pita itu bisa diaudit siapa pun yang punya datanya.",
        "Baik atau buruk: bootstrap iid bagus bila observasi hariannya (hampir) saling bebas — asumsi «iid» di namanya. Buruk bila returnnya ber-autokorelasi: menarik hari secara acak MEMUTUSKAN urutan waktu — hari crash 2026-10-16 bisa muncul bersebelahan dengan hari tenang, atau hilang sama sekali — dan CI yang dihasilkan TERLALU SEMPIT (langkah 6). Di data ini autokorelasi kuadrat lag-1 adalah 0,1043 [M4.3] — volatilitas bergerombol — jadi CI iid ini adalah batas BAWAH kelebaran yang benar, bukan jawaban akhirnya.",
        "Mitigasi: laporkan VaR HS selalu BERSAMA CI bootstrap-nya — «VaR95 HS 0,0286, CI95 [0,0229; 0,0322]» — dan tulis metode bootstrap-nya (iid atau block, B, seed) di sampingnya. CI tanpa metode sama tidak bergunanya dengan VaR tanpa metode: pembaca harus bisa mereplikasi pitanya.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «mean ± sd» sebagai ketidakpastian",
        type: "pitfall",
        body: "Yang benar: sd bootstrap VaR95 (0,0022) adalah simpangan baku SEBARAN bootstrap — bukan galat baku mean, dan bukan setengah lebar CI. Menulis «VaR95 0,0284 ± 0,0022» menyajikan sd sebagai ketidakpastian mean — kesalahan yang sama dengan «0,7858 ± 0,0068» di M6.2/M6.5. Yang benar: laporkan intervalnya — «VaR95 HS 0,0286, CI95 bootstrap [0,0229; 0,0322]».",
      },
    },
    {
      id: "block-bootstrap",
      eyebrow: "Langkah 6 · Block bootstrap",
      title: "Block bootstrap: menjaga urutan waktu — dan CI yang melebar karenanya",
      prose: [
        "Bootstrap iid memutus urutan waktu — dan return nyata punya urutan: volatilitas bergerombol (hari bergejolak diikuti hari bergejolak). Ukurannya ada di [M4.3]: autokorelasi return KUADRAT lag-1 adalah 0,1043 — korelasi antara «seberapa besar pergerakan kemarin» dan «seberapa besar pergerakan hari ini». Obatnya: MOVING-BLOCK bootstrap — alih-alih menarik satu hari, tarik BLOK 10 hari berturut-turut (48 blok untuk 480 hari), sehingga gerombol volatilitas di dalam blok tetap utuh; blok ditarik ulang DENGAN pengembalian — satu blok boleh muncul dua kali, blok lain boleh hilang — jadi bukan sekadar urutan antar-blok yang diacak. Panjang blok 10 di sini adalah pilihan [kebijakan lesson ini] — bukan hukum alam: blok yang terlalu pendek hampir sama dengan iid, blok yang terlalu panjang membuat terlalu sedikit blok yang berbeda.",
        "Nilai [m9_canonical.json] — block bootstrap, blok 10, B=10.000, seed 42. VaR95: mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0340]. ES95: mean 0,0440, sd 0,0062, CI95 [0,0333; 0,0572]. Bandingkan dengan iid (langkah 5): mean-nya hampir sama (VaR95 0,0285 vs 0,0284; ES95 0,0440 vs 0,0440) — dependensi waktu tidak menggeser TITIK estimasinya. Yang berubah adalah LEBARNYA: sd VaR95 naik dari 0,0022 menjadi 0,0029 — naik 0,0007, atau +32% (0,0007/0,0022 ≈ 31,8%). CI VaR95 melebar dari 0,0093 menjadi 0,0117 (0,0340 − 0,0223) — 26% lebih lebar. CI ES95 melebar dari 0,0223 menjadi 0,0239. Perhatikan batas atas CI block (0,0340): ia MELINTASI VaR95 parametrik 0,0328 — interval block MENCANGKUP 0,0328, sementara interval iid [0,0229; 0,0322] tidak mencapainya. Begitu dependensi waktu diakui, perbedaan HS vs param tidak lagi «di luar noise» — ia berada di dalam pita. Itulah harga kejujuran: CI yang benar lebih lebar, dan kesimpulan yang tadinya tajam menjadi lebih hati-hati.",
        "Nilai: block bootstrap bagus karena ia mengakui data apa adanya — dependensi waktu adalah FAKTA data ini (0,1043 [M4.3]), bukan gangguan yang bisa diabaikan. CI yang melebar 26% bukanlah «hasil yang lebih buruk» — ia adalah hasil yang lebih JUJUR: CI iid yang sempit adalah kepastian yang palsu.",
        "Baik atau buruk: block bootstrap bagus bila datamu ber-autokorelasi — return saham, dengan volatilitas yang bergerombol, hampir selalu begitu — dan buruk bila dipakai tanpa berpikir: panjang blok adalah pilihan, dan pilihan itu memengaruhi jawaban (blok 5 vs blok 10 vs blok 20 memberi lebar CI yang berbeda — angka-angka itu tidak dihitung di lesson ini, dan jangan mengarangnya). Buruk juga bila blok dianggap «obat mujarab»: block bootstrap menjaga dependensi JARAK PENDEK (di dalam 10 hari), tetapi ia tidak menjaga pergeseran REZIM — crash Oktober 2026 yang muncul sebagai satu blok utuh tetap bisa hilang seluruhnya dari satu ulangan, atau muncul dua kali. Dependensi jangka panjang dan perubahan rezim tetap di luar jangkauannya.",
        "Mitigasi: bila datamu punya autokorelasi kuadrat yang nyata (di sini 0,1043 [M4.3]), laporkan CI BLOCK sebagai CI utamamu — dan CI iid sebagai pembanding yang menunjukkan «seberapa besar dependensi itu menggelembungkan ketidakpastian». Tulis panjang blokmu («blok 10 [kebijakan lesson ini]») agar pembaca bisa mereplikasi dan menantangnya. Dan bila seseorang mengklaim CI sempit dari bootstrap iid atas data ber-autokorelasi, tanyakan: «di mana bloknya?»",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Distribusi bootstrap VaR95: iid mean 0,0284 CI95 0,0229 sampai 0,0322; block-10 mean 0,0285 CI95 0,0223 sampai 0,0340; distribusi block lebih lebar">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Distribusi bootstrap VaR95 — iid vs block-10 (B=10.000)</text>
<line x1="50" y1="40" x2="50" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="50" y1="200" x2="450" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4.000</text>
<text x="44" y="123" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2.000</text>
<text x="44" y="203" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="50" y1="120" x2="450" y2="120" stroke="var(--chart-text)" stroke-width="0.5" opacity="0.3"/>
<line x1="50" y1="40" x2="450" y2="40" stroke="var(--chart-text)" stroke-width="0.5" opacity="0.3"/>
<rect x="90" y="199.0" width="18" height="1.0" fill="var(--c1)"/>
<rect x="130" y="184.9" width="18" height="15.1" fill="var(--c1)"/>
<rect x="170" y="142.6" width="18" height="57.4" fill="var(--c1)"/>
<rect x="210" y="115.7" width="18" height="84.3" fill="var(--c1)"/>
<rect x="250" y="45.4" width="18" height="154.6" fill="var(--c1)"/>
<rect x="290" y="127.9" width="18" height="72.1" fill="var(--c1)"/>
<rect x="330" y="187.0" width="18" height="13.0" fill="var(--c1)"/>
<rect x="370" y="198.1" width="18" height="1.9" fill="var(--c1)"/>
<rect x="410" y="199.6" width="18" height="0.4" fill="var(--c1)"/>
<rect x="109" y="197.2" width="18" height="2.8" fill="var(--c4)"/>
<rect x="149" y="172.8" width="18" height="27.2" fill="var(--c4)"/>
<rect x="189" y="140.7" width="18" height="59.3" fill="var(--c4)"/>
<rect x="229" y="130.6" width="18" height="69.4" fill="var(--c4)"/>
<rect x="269" y="66.6" width="18" height="133.4" fill="var(--c4)"/>
<rect x="309" y="123.7" width="18" height="76.3" fill="var(--c4)"/>
<rect x="349" y="179.5" width="18" height="20.5" fill="var(--c4)"/>
<rect x="389" y="192.0" width="18" height="8.0" fill="var(--c4)"/>
<rect x="429" y="198.1" width="18" height="1.9" fill="var(--c4)"/>
<line x1="148" y1="40" x2="148" y2="200" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/>
<line x1="334" y1="40" x2="334" y2="200" stroke="var(--c1)" stroke-width="1.5" stroke-dasharray="4 3"/>
<line x1="136" y1="40" x2="136" y2="200" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4 3"/>
<line x1="370" y1="40" x2="370" y2="200" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="50" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,018</text>
<text x="130" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,022</text>
<text x="210" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,026</text>
<text x="290" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,030</text>
<text x="370" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,034</text>
<text x="450" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,038</text>
<text x="240" y="230" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Garis putus-putus = batas CI95 (iid: 0,0229–0,0322; block: 0,0223–0,0340). Block lebih lebar.</text>
<text x="240" y="244" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Histogram dari 10.000 ulangan (B=10.000, seed 42); segelintir ulangan di atas 0,038 tidak digambar.</text>
</svg>`,
        alt: "Distribusi bootstrap VaR95: iid mean 0,0284 CI95 0,0229 sampai 0,0322; block-10 mean 0,0285 CI95 0,0223 sampai 0,0340; distribusi block lebih lebar.",
        caption: "Cara membaca: dua histogram dari 10.000 ulangan bootstrap yang sama (B=10.000, seed 42). Batang pertama = iid, batang kedua = block-10. Puncaknya hampir sama (mean 0,0284 vs 0,0285), tetapi block menyebar lebih lebar: ekornya lebih gemuk di kedua sisi, dan garis CI95-nya (putus-putus) lebih renggang — 0,0223–0,0340 vs 0,0229–0,0322. Autokorelasi kuadrat lag-1 0,1043 [M4.3] adalah alasan lebarnya bertambah: dependensi waktu membuat «sejarah alternatif» lebih beragam. Bin 0,002; segelintir ulangan di atas 0,038 tidak digambar.",
      },
      tasks: [],
    },
    {
      id: "tiga-arah",
      eyebrow: "Langkah 7 · Tabel tiga arah",
      title: "Tabel tiga arah: HS vs parametrik vs bootstrap — kapan pakai yang mana",
      prose: [
        "Sekarang susun ketiganya dalam satu tabel — karena «mana yang dipakai» adalah keputusan, bukan rumus. HS (480 hari): VaR95 0,0286, ES95 0,0445 — tanpa asumsi distribusi; butuh banyak data; buta terhadap ekor di luar sampel. Parametrik (normal): VaR95 0,0328, ES95 0,0410 — stabil, lengkap, bisa ekstrapolasi ke ekor yang belum terjadi; menipiskan ekor bila kurtosis tinggi (di sini ES99-nya 0,0528 vs HS 0,0775). Monte Carlo [M9.1] (N=100.000, lognormal pada log returns): VaR95 0,0329, ES95 0,0407 — pembanding keempat, hampir sama dengan parametrik (selisih 0,0001) karena ia memakai asumsi yang sekeluarga (normal pada log returns). Bootstrap: bukan jawaban — pita: VaR95 iid CI95 [0,0229; 0,0322], block CI95 [0,0223; 0,0340]; ES95 iid CI95 [0,0346; 0,0569], block [0,0333; 0,0572].",
        "Aturan pakainya — tiga pertanyaan sebelum memilih. Satu: SEBERAPA BANYAK datamu? Bila n kecil (di bawah ~250 hari), kuantil empirisnya goyah — parametrik atau Monte Carlo lebih stabil, dengan catatan ekornya. Bila n besar (480 hari di sini), HS menjadi jawaban pertama yang sah. Dua: SEBERAPA TEBAL ekormu? Bila excess kurtosis mendekati 0 dan skew mendekati 0, normal cukup — parametrik boleh menjadi jawaban utama. Bila kurtosis 6,02 seperti di sini, HS wajib ada di meja — dan ES-nya (bukan hanya VaR-nya) wajib dilaporkan, karena di situlah normal menipu. Tiga: APA YANG DITANYAKAN? Bila yang ditanya «berapa VaR besok?» — jawab dengan HS + CI block. Bila yang ditanya «berapa VaR skenario yang belum pernah terjadi?» — HS tidak bisa menjawab; parametrik atau Monte Carlo yang menjawab, dengan catatan asumsinya. Dan bila yang ditanya «seberapa yakin kamu?» — hanya bootstrap yang menjawab.",
        "Nilai: tabel tiga arah ini bagus karena ia mengubah perdebatan «metode mana yang benar» menjadi keputusan yang bisa diaudit: tiap metode dicantumkan bersama ASUMSINYA dan KONDISI PAKAINYA. Komite yang melihat tabel ini tidak perlu percaya padamu — ia bisa memeriksa sendiri apakah datanya (n=480, kurtosis 6,02) cocok dengan metode yang kamu pilih.",
        "Baik atau buruk: memakai SATU metode saja itu buruk bila metodenya tidak cocok dengan datamu — parametrik saja di data berkurtosis 6,02 berarti ES99 yang salah 0,0247; HS saja di n=120 berarti ES99 dari sekitar satu-dua observasi terburuk (≈1,2 hari). Memakai ketiganya dan MELAPORKAN ketiganya itu bagus — bukan karena «lebih banyak lebih baik», melainkan karena selisih antar-metode adalah INFORMASI: selisih HS vs param (VaR95 0,0042, ES95 −0,0035) berkata «ekor di balik VaR lebih gemuk dari normal» — kesimpulan yang tidak bisa didapat dari satu metode saja.",
        "Mitigasi: di laporan risiko, buat tabel ini menjadi BAGIAN TETAP: satu baris per metode (HS + jendela, parametrik, Monte Carlo [M9.1]), satu kolom VaR95, satu kolom ES95, satu kolom asumsi — dan satu baris bootstrap CI di bawahnya. Bila satu metode memberi angka yang jauh dari yang lain, jangan sembunyikan selisihnya: selisih itu adalah temuan, dan komite berhak menanyakannya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Tiga jawaban VaR95: HS 480 hari 0,0286; parametrik 0,0328; bootstrap mean 0,0284; pita CI95 bootstrap iid 0,0229 sampai 0,0322">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tiga jawaban VaR95 — satu data, tiga metode</text>
<rect x="131" y="44" width="226" height="132" fill="var(--c4)" opacity="0.18"/>
<text x="244" y="38" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pita = CI95 bootstrap iid [0,0229; 0,0322]</text>
<text x="60" y="50" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">HS (480 hari)</text>
<rect x="60" y="56" width="209.6" height="28" fill="var(--c1)"/>
<text x="276" y="74" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">0,0286</text>
<text x="60" y="96" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Parametrik (normal)</text>
<rect x="60" y="102" width="312" height="28" fill="var(--c2)"/>
<text x="378" y="120" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">0,0328</text>
<text x="60" y="142" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Bootstrap iid (mean)</text>
<rect x="60" y="148" width="204.8" height="28" fill="var(--c4)"/>
<text x="271" y="166" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">0,0284</text>
<line x1="60" y1="186" x2="60" y2="192" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="157.5" y1="186" x2="157.5" y2="192" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="255" y1="186" x2="255" y2="192" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="352.5" y1="186" x2="352.5" y2="192" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="450" y1="186" x2="450" y2="192" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="60" y1="186" x2="450" y2="186" stroke="var(--chart-text)" stroke-width="1"/>
<text x="60" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,020</text>
<text x="157.5" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,024</text>
<text x="255" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,028</text>
<text x="352.5" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,032</text>
<text x="450" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,036</text>
<text x="240" y="226" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Monte Carlo [M9.1] 0,0329 tidak digambar — hampir sama dengan parametrik (selisih 0,0001).</text>
<text x="240" y="240" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Ingat ES-nya: HS 0,0445 &gt; param 0,0410 — ekor di balik VaR lebih gemuk dari normal.</text>
</svg>`,
        alt: "Tiga jawaban VaR95: HS 480 hari 0,0286; parametrik 0,0328; bootstrap mean 0,0284; pita CI95 bootstrap iid 0,0229 sampai 0,0322.",
        caption: "Cara membaca: tiga batang VaR95 dari data yang sama (SIMPLE returns, n=480). Pita di belakangnya = CI95 bootstrap iid [0,0229; 0,0322] — pita di sekitar jawaban HS. Parametrik (0,0328) keluar dari pita iid, tetapi masuk ke dalam pita block [0,0223; 0,0340] (langkah 6). Monte Carlo [M9.1] 0,0329 hampir sama dengan parametrik. Angka-angka ini saja belum bercerita lengkap: ES95 HS 0,0445 LEBIH BESAR dari param 0,0410 — kuantil 5%-nya lebih kecil, ekor di baliknya lebih gemuk.",
      },
      tasks: [],
    },
    {
      id: "bootstrap-metrik-lain",
      eyebrow: "Langkah 8 · Bootstrap untuk metrik lain",
      title: "Bootstrap untuk metrik lain: drift negatif yang ternyata tidak signifikan",
      prose: [
        "Bootstrap bukan alat khusus VaR — ia alat umum untuk «statistik apa pun + pita». Ambil statistik yang paling sederhana: MEAN daily return. Point estimate-nya −0,0006 — portofolio ini rata-rata TURUN 0,06% per hari selama 480 hari. Apakah itu bukti portofolionya «cenderung turun»? Bootstrap iid (B=10.000, seed 42) menjawab: CI95 mean return adalah [−0,0024; +0,0012] — interval yang MENCANGKUP 0. Artinya: drift negatif −0,0006 TIDAK SIGNIFIKAN — data ini tidak cukup bukti untuk mengklaim mean return-nya berbeda dari nol. Rata-rata negatif itu bisa jadi noise dari 480 hari yang kebetulan berisi crash Oktober 2026. Perhatikan bahasanya: «tidak signifikan» — bukan «mean-nya nol». CI yang mencakup 0 berarti «tidak terbukti berbeda dari nol», bukan «terbukti sama dengan nol» — bedanya adalah beda antara «tidak ada bukti» dan «bukti tidak ada».",
        "Pola yang sama sudah kamu lihat di kredit — dan lesson ini hanya merujuknya, bukan menghitung ulang: di [M8.1], bootstrap CI dipakai untuk bad rate (6,67% CI95 [5,47%; 7,85%]), ECE (0,0087 CI95 [0,0077; 0,0214] — batas atasnya MELINTASI ambang lolos 0,02), dan profit (+NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]). Polanya identik: satu angka titik, satu interval, satu pertanyaan «apakah interval ini mencakup nilai yang penting?» — 0 untuk mean return, 0,02 untuk ECE, 0 untuk selisih antar-half. Bootstrap adalah alat yang sama di kedua dunia (market risk dan credit risk) — yang berubah hanya statistiknya.",
        "Nilai: langkah ini bagus karena ia menunjukkan bootstrap sebagai KEBIASAAN, bukan sebagai trik VaR: tiap kali kamu melaporkan satu angka — mean return, bad rate, ECE, profit — tanyakan «berapa pitanya?» dan «apakah pita itu mencakup nilai yang akan mengubah keputusanku?». Mean return −0,0006 tanpa CI adalah klaim «portofolio cenderung turun»; dengan CI [−0,0024; +0,0012] ia menjadi klaim «tidak terbukti turun» — keputusan yang berlawanan dari angka yang sama.",
        "Baik atau buruk: CI mean return ini bagus sebagai CONTOH KEJUJURAN — ia menunjukkan bahwa 480 hari pun belum cukup untuk membuktikan drift sekecil 0,06% per hari (sd harian 0,0196 adalah ≈33 kali lebih besar dari mean-nya — dengan μ terbulat 0,0006; dengan μ eksak ≈35 kali — 0,0196/0,0006 ≈ 32,7; 0,0196172/0,000558 ≈ 35,2 [m9_canonical.json]). Buruk bila dibaca sebagai «jadi mean return tidak penting»: mean return TIDAK penting untuk VaR 1-hari (ia hanya menggeser VaR sebesar 0,0006), tetapi ia penting untuk horizon panjang — dan CI-nya berkata «kamu belum tahu tandanya». Ketidaktahuan itu harus ditulis, bukan disembunyikan di balik angka −0,0006.",
        "Mitigasi: untuk setiap statistik yang masuk keputusan, laporkan CI-nya dan SEBUTKAN nilai pembanding yang dicakup atau tidak dicakup interval itu: «CI mean return [−0,0024; +0,0012] mencakup 0 — drift tidak signifikan». Satu kalimat itu mencegah satu kesalahan besar: mengira noise adalah sinyal.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: CI yang mencakup 0 berarti «nilainya nol»",
        type: "pitfall",
        body: "Yang benar: CI mean return [−0,0024; +0,0012] mencakup 0 — artinya drift −0,0006 TIDAK TERBUKTI berbeda dari nol, bukan terbukti nol. «Tidak ada bukti» ≠ «bukti tidak ada». Bila 480 hari lagi datang dan CI-nya menyempit di sekitar −0,0006 tanpa mencakup 0, kesimpulannya berubah — dan itulah gunanya melaporkan CI, bukan hanya titiknya.",
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 9 · Jebakan",
      title: "Jebakan: CI sempit yang palsu — dan blok yang bukan obat mujarab",
      prose: [
        "Jebakan pertama lesson ini adalah yang paling mahal: bootstrap iid pada data ber-autokorelasi memberi CI yang TERLALU SEMPIT — dan CI yang terlalu sempit adalah kepastian yang palsu. Angkanya ada di langkah 5–6: CI95 VaR95 iid [0,0229; 0,0322], lebar 0,0093; CI95 block-10 [0,0223; 0,0340], lebar 0,0117. Bila kamu melaporkan CI iid, kamu berkata «VaR95 ada di antara 0,0229 dan 0,0322» — dan VaR95 parametrik 0,0328 jatuh DI LUAR intervalmu, sehingga kamu menyimpulkan «HS dan param berbeda secara nyata». Bila kamu melaporkan CI block, 0,0328 jatuh DI DALAM intervalmu — dan kesimpulanmu berubah menjadi «perbedaannya masih di dalam noise». Satu pilihan (iid vs block) membalik kesimpulan — dan pilihan yang benar ditentukan data: autokorelasi kuadrat lag-1 0,1043 [M4.3] berkata datanya ber-autokorelasi, jadi CI iid adalah jawaban yang salah untuk data ini.",
        "Jebakan kedua: mengira block bootstrap adalah OBAT MUJARAB. Bukan. Block bootstrap menjaga dependensi jarak pendek (di dalam 10 hari) — tetapi panjang bloknya adalah PILIHAN: 10 di sini [kebijakan lesson ini], bukan hukum alam. Blok 5 hampir sama dengan iid; blok 20 menjaga dependensi lebih panjang tetapi menyisakan terlalu sedikit blok berbeda (480/20 = 24 blok) sehingga «sejarah alternatif»-nya menjadi monoton. Dan tidak ada panjang blok yang menjaga PERGESERAN REZIM: bila Oktober 2026 adalah rezim baru, tidak ada resampling dari 480 hari kemarin yang bisa menciptakan rezim yang belum ada di data. Block bootstrap memperbaiki CI untuk dunia yang stasioner — ia tidak memperbaiki apa pun untuk dunia yang bergeser.",
        "Nilai: langkah ini bagus karena ia menunjukkan bahwa «metode yang benar» pun punya syarat pakai — bootstrap iid benar untuk data iid, block benar untuk data ber-autokorelasi jarak pendek, dan keduanya salah untuk data yang rezimnya bergeser. Validator yang baik tidak bertanya «bootstrap atau tidak?» — ia bertanya «bootstrap APA, dengan blok BERAPA, untuk data yang ASUMSINYA apa?».",
        "Baik atau buruk: CI iid yang sempit itu buruk BUKAN karena angkanya kecil — 0,0093 adalah angka yang sah untuk data iid — melainkan karena ia dipakai pada data yang TIDAK iid. Kesalahan yang sama, dalam bentuk lain: memakai VaR HS jendela 120 hari (ES99 dari sekitar satu-dua observasi terburuk (≈1,2 hari)) sebagai «estimasi» — angka yang sah secara aritmetika, salah secara pemakaian. Keduanya adalah kesalahan yang sama: metode yang benar, dipakai di luar syaratnya.",
        "Mitigasi: sebelum bootstrap apa pun, periksa autokorelasinya — di sini kuadrat lag-1 0,1043 [M4.3] — dan pilih iid atau block BERDASARKAN angka itu, bukan berdasarkan kebiasaan. Tulis pilihanmu («block-10 [kebijakan lesson ini]») dan laporkan CI iid sebagai pembanding, agar pembaca melihat harga kejujuranmu: sd naik +32% (0,0022 → 0,0029) dan lebar CI melebar +26% (0,0093 → 0,0117) — lebar CI persentil tidak harus naik sebanding sd karena bentuk sebarannya ikut berubah. Bila seseorang memamerkan CI yang sangat sempit, tanyakan dua hal: «iid atau block?» dan «berapa autokorelasinya?».",
      ],
      tasks: [],
      note: {
        title: "Jebakan: CI sempit = CI yang bagus",
        type: "risk",
        body: "Yang benar: CI yang sempit belum tentu CI yang bagus — CI iid [0,0229; 0,0322] lebih sempit dari CI block [0,0223; 0,0340], tetapi ia sempit karena MEMUTUSKAN dependensi waktu (autokorelasi kuadrat lag-1 0,1043 [M4.3]), bukan karena datanya lebih informatif. CI yang benar lebih lebar — dan kesimpulan yang tadinya tajam (param di luar CI) menjadi hati-hati (param di dalam CI block). Pilih CI berdasarkan data, bukan berdasarkan sempitnya.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 10 · Lab 1",
      title: "Lab: sensitivitas jendela HS + tabel tiga arah",
      prose: [
        "Sekarang hitung sendiri sensitivitas jendela dan tabel tiga arah dari angka kanonis [m9_canonical.json]. Jendela HS (SIMPLE returns, 480 hari terakhir berakhir 2026-11-11): 120 hari → VaR95 0,0283, ES95 0,0557, VaR99 0,0472, ES99 0,0941; 250 hari → VaR95 0,0311, ES95 0,0467, VaR99 0,0464, ES99 0,0801; 480 hari → VaR95 0,0286, ES95 0,0445, VaR99 0,0479, ES99 0,0775. Parametrik [M4.2]: VaR95 0,0328, ES95 0,0410, VaR99 0,0462, ES99 0,0528. Monte Carlo [M9.1] (N=100.000): VaR95 0,0329, ES95 0,0407.",
        "Hasil yang diharapkan [lab]: var95_w120=0.0283; var95_w480=0.0286; var95_range=0.0028; es95_gap_w120_w480=0.0112; hs_param_var95_gap=0.0042; hs_param_es95_gap=-0.0035; es95_hist_gt_param=True. Bacalah dua baris terakhir dengan saksama: hs_param_var95_gap POSITIF (0,0042 — param lebih besar dari HS) tetapi hs_param_es95_gap NEGATIF (−0,0035 — param lebih KECIL dari HS). Tanda yang berlawanan itulah pelajaran kunci lesson ini: kuantil 5% empiris lebih kecil dari normal, tetapi ekor di balik VaR lebih gemuk dari normal. Bila lab-mu memberi kedua gap bertanda sama, kamu salah membaca tabel — periksa lagi.",
        "Setelah lab jalan, bandingkan dengan langkah 3 dan 7: var95_range 0,0028 adalah harga dari pilihan jendela — sekitar 10% dari nilai VaR95-nya. Dan es95_gap_w120_w480 0,0112 adalah harga dari satu hari: 2026-10-16 (−0,1398 [M9.2]) yang bobotnya empat kali lebih besar di jendela 120 hari. Satu hari, 0,0112 — itulah kenapa jendela pendek responsif DAN berisik.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi var95_w120 dan var95_w480 dari tabel WINDOWS" },
        { id: "t2", text: "Lengkapi var95_range (maks − min antar-jendela) dan es95_gap_w120_w480" },
        { id: "t3", text: "Lengkapi hs_param_var95_gap, hs_param_es95_gap, dan es95_hist_gt_param" },
      ],
      expected: "var95_w120=0.0283\nvar95_w480=0.0286\nvar95_range=0.0028\nes95_gap_w120_w480=0.0112\nhs_param_var95_gap=0.0042\nhs_param_es95_gap=-0.0035\nes95_hist_gt_param=True",
      hints: [
        "var95_w120 = WINDOWS[120][\"var95\"] = 0,0283; var95_w480 = WINDOWS[480][\"var95\"] = 0,0286 — ambil dari tabel, jangan dikarang.",
        "var95_range = max(0,0283; 0,0311; 0,0286) − min(0,0283; 0,0311; 0,0286) = 0,0311 − 0,0283 = 0,0028; es95_gap = 0,0557 − 0,0445 = 0,0112.",
        "hs_param_var95_gap = 0,0328 − 0,0286 = +0,0042; hs_param_es95_gap = 0,0410 − 0,0445 = −0,0035 — tandanya BERLAWANAN, dan itu memang yang benar. es95_hist_gt_param = 0,0445 > 0,0410 → True.",
      ],
      code: {
        starter: `# Lab 1 — sensitivitas jendela HS + tabel tiga arah [m9_canonical.json]
# Portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480.
# Jendela = 120/250/480 hari TERAKHIR (berakhir 2026-11-11).
WINDOWS = {120: {"var95": 0.0283, "es95": 0.0557, "var99": 0.0472, "es99": 0.0941},
           250: {"var95": 0.0311, "es95": 0.0467, "var99": 0.0464, "es99": 0.0801},
           480: {"var95": 0.0286, "es95": 0.0445, "var99": 0.0479, "es99": 0.0775}}
PARAM = {"var95": 0.0328, "es95": 0.0410, "var99": 0.0462, "es99": 0.0528}
MC_VAR95 = 0.0329  # [M9.1] Monte Carlo N=100.000
MC_ES95 = 0.0407  # [M9.1] Monte Carlo N=100.000

var95_w120 = 0.0  # TODO: WINDOWS[120]["var95"]
var95_w480 = 0.0  # TODO: WINDOWS[480]["var95"]
var95_range = 0.0  # TODO: max VaR95 antar-jendela - min VaR95 antar-jendela
es95_gap_w120_w480 = 0.0  # TODO: WINDOWS[120]["es95"] - WINDOWS[480]["es95"]
hs_param_var95_gap = 0.0  # TODO: PARAM["var95"] - WINDOWS[480]["var95"]
hs_param_es95_gap = 0.0  # TODO: PARAM["es95"] - WINDOWS[480]["es95"]
es95_hist_gt_param = None  # TODO: True bila ES95 HS (480) > ES95 param
print(f"var95_w120={var95_w120:.4f}")
print(f"var95_w480={var95_w480:.4f}")
print(f"var95_range={var95_range:.4f}")
print(f"es95_gap_w120_w480={es95_gap_w120_w480:.4f}")
print(f"hs_param_var95_gap={hs_param_var95_gap:.4f}")
print(f"hs_param_es95_gap={hs_param_es95_gap:.4f}")
print(f"es95_hist_gt_param={es95_hist_gt_param}")`,
        lockLines: 10,
        solution: `# Lab 1 — sensitivitas jendela HS + tabel tiga arah [m9_canonical.json]
# Portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480.
# Jendela = 120/250/480 hari TERAKHIR (berakhir 2026-11-11).
WINDOWS = {120: {"var95": 0.0283, "es95": 0.0557, "var99": 0.0472, "es99": 0.0941},
           250: {"var95": 0.0311, "es95": 0.0467, "var99": 0.0464, "es99": 0.0801},
           480: {"var95": 0.0286, "es95": 0.0445, "var99": 0.0479, "es99": 0.0775}}
PARAM = {"var95": 0.0328, "es95": 0.0410, "var99": 0.0462, "es99": 0.0528}
MC_VAR95 = 0.0329  # [M9.1] Monte Carlo N=100.000
MC_ES95 = 0.0407  # [M9.1] Monte Carlo N=100.000

var95_w120 = WINDOWS[120]["var95"]
var95_w480 = WINDOWS[480]["var95"]
var95_range = max(w["var95"] for w in WINDOWS.values()) - min(w["var95"] for w in WINDOWS.values())
es95_gap_w120_w480 = WINDOWS[120]["es95"] - WINDOWS[480]["es95"]
hs_param_var95_gap = PARAM["var95"] - WINDOWS[480]["var95"]
hs_param_es95_gap = PARAM["es95"] - WINDOWS[480]["es95"]
es95_hist_gt_param = WINDOWS[480]["es95"] > PARAM["es95"]
print(f"var95_w120={var95_w120:.4f}")
print(f"var95_w480={var95_w480:.4f}")
print(f"var95_range={var95_range:.4f}")
print(f"es95_gap_w120_w480={es95_gap_w120_w480:.4f}")
print(f"hs_param_var95_gap={hs_param_var95_gap:.4f}")
print(f"hs_param_es95_gap={hs_param_es95_gap:.4f}")
print(f"es95_hist_gt_param={es95_hist_gt_param}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95_w120", value: 0.0283, tol: 0.001, label: "`var95_w120` seharusnya 0.0283", msg: "VaR95 HS jendela 120 hari = 0,0283 [m9_canonical.json]." },
          { kind: "equal", task: "t1", name: "var95_w480", value: 0.0286, tol: 0.001, label: "`var95_w480` seharusnya 0.0286", msg: "VaR95 HS jendela 480 hari = 0,0286 [m9_canonical.json]." },
          { kind: "equal", task: "t2", name: "var95_range", value: 0.0028, tol: 0.0002, label: "`var95_range` seharusnya 0.0028", msg: "VaR95 bergerak 0,0311 − 0,0283 = 0,0028 antar-jendela — sekitar 10% dari nilainya." },
          { kind: "equal", task: "t2", name: "es95_gap_w120_w480", value: 0.0112, tol: 0.0002, label: "`es95_gap_w120_w480` seharusnya 0.0112", msg: "ES95 jendela 120 hari 0,0557 vs 480 hari 0,0445 — selisih 0,0112 karena hari 2026-10-16 (−0,1398) berbobot empat kali lebih besar di jendela pendek." },
          { kind: "equal", task: "t3", name: "hs_param_es95_gap", value: -0.0035, tol: 0.0002, label: "`hs_param_es95_gap` seharusnya -0.0035", msg: "ES95 param 0,0410 − ES95 HS 0,0445 = −0,0035: ekor di balik VaR lebih gemuk dari normal — tandanya BERLAWANAN dengan gap VaR95 (+0,0042), dan itu memang yang benar." },
          { kind: "stdout_matches", task: "t3", pattern: "es95_hist_gt_param=True", label: "Output menampilkan es95_hist_gt_param=True", msg: "ES95 HS 0,0445 > ES95 param 0,0410 — ekor di balik VaR lebih gemuk dari normal." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 11 · Lab 2",
      title: "Lab: iid vs block bootstrap CI untuk VaR95",
      prose: [
        "Lab kedua menjalankan bootstrap yang sesungguhnya — di browser, dengan numpy saja — atas 480 SIMPLE daily returns portofolio yang sama (2024-11-04 s.d. 2026-11-11). B kanonis adalah 10.000 [m9_canonical.json]; lab memakai B=2.000 agar ringan di browser — CI-nya sedikit lebih berisik (lebar CI iid lab 0,0093 sama dengan kanonis di sini, tetapi itu kebetulan yang baik, bukan jaminan), dan karena B lab ≠ B kanonis, lab ini TIDAK menilai nilai eksak CI — ia menilai PERBANDINGAN: lebar CI block harus LEBIH BESAR dari lebar CI iid. Seed 42 (sama dengan kanonis) agar hasilnya dapat direplikasi.",
        "Hasil yang diharapkan [lab]: var95_iid_mean=0.0283; var95_blk_mean=0.0285; ci_iid=[0.0229; 0.0322] lebar_ci_iid=0.0093; ci_blk=[0.0229; 0.0340] lebar_ci_blk=0.0111; ci_block_lebih_lebar=True. Perhatikan dua hal. Pertama, mean-nya hampir sama (0,0283 vs 0,0285) — dependensi waktu tidak menggeser titiknya. Kedua, batas ATAS CI block (0,0340) lebih jauh dari batas atas CI iid (0,0322) — pelebaran CI block datang terutama dari sisi kanan: ulangan block lebih sering menghasilkan VaR95 yang besar, karena satu blok berisi 10 hari bergejolak berturut-turut (crash Oktober 2026 sebagai satu blok utuh) lebih sering «menarik» kuantil ke atas. Bandingkan dengan kanonis B=10.000: CI iid [0,0229; 0,0322] dan CI block [0,0223; 0,0340] — batas bawah kanonis block (0,0223) sedikit lebih rendah dari batas bawah lab (0,0229); itu noise B=2.000, bukan kesalahan — dan justru itulah alasan lab ini menilai perbandingan lebar, bukan nilai eksak.",
        "Setelah lab jalan, tanyakan pada dirimu: bila autokorelasi kuadratnya 0 (data iid murni), apa yang terjadi pada perbandingan ini? Lebar CI block dan iid akan hampir sama — karena tidak ada dependensi yang bisa dipertahankan blok. Selisih lebar [lab] (0,0111 vs 0,0093) adalah UKURAN dependensinya: makin besar selisihnya, makin kuat dependensi waktunya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi idx_iid: tarik acak 480 hari dengan pengembalian, B=2.000 ulangan" },
        { id: "t2", text: "Lengkapi starts: tarik acak blok 10 hari berturut-turut, 48 blok per ulangan" },
        { id: "t3", text: "Bandingkan lebar CI: ci_block_lebih_lebar harus True — bila False, periksa starts-mu" },
      ],
      expected: "var95_iid_mean=0.0283\nvar95_blk_mean=0.0285\nci_iid=[0.0229; 0.0322] lebar_ci_iid=0.0093\nci_blk=[0.0229; 0.0340] lebar_ci_blk=0.0111\nci_block_lebih_lebar=True",
      hints: [
        "idx_iid = rng.integers(0, N, size=(B, N)) — tiap baris satu ulangan: 480 indeks acak dari 480 hari, boleh berulang (dengan pengembalian).",
        "starts = rng.integers(0, N - BLOCK + 1, size=(B, N // BLOCK)) — tiap ulangan 48 blok; satu blok = 10 hari BERTURUT-TURUT dari rets[s:s+10], jadi gerombol volatilitas tetap utuh.",
        "lebar_ci = batas atas − batas bawah: iid 0,0322 − 0,0229 = 0,0093; block 0,0340 − 0,0229 = 0,0111 [lab]. Block lebih lebar karena autokorelasi kuadrat lag-1 0,1043 [M4.3] — bila hasilmu terbalik, starts-mu mungkin masih nol (placeholder).",
      ],
      code: {
        starter: `# Lab 2 — iid vs block bootstrap CI untuk VaR95 (B=2.000)
# Data: 480 SIMPLE daily returns portofolio equal-weight BBCA/KLBF/UNVR
# (2024-11-04 s.d. 2026-11-11) — deret yang sama dengan m9_canonical.json.
# B kanonis 10.000; lab memakai B=2.000 agar ringan di browser — CI-nya
# sedikit lebih berisik, tapi perbandingan lebar CI (block > iid) tetap
# terlihat. Seed 42 (sama dengan kanonis) agar hasilnya dapat direplikasi.
import numpy as np

RETS_CSV = "-0.0118,-0.0099,-0.0084,-0.0168,-0.0048,-0.0111,0.0174,-0.0046,-0.0183,0.0097,-0.0067,-0.0076,0.0144,-0.0212,0.0151,0.0401,-0.0180,0.0061,-0.0024,-0.0121,0.0165,0.0073,0.0072,-0.0154,0.0181,0.0230,-0.0068,-0.0259,-0.0125,-0.0075,-0.0277,0.0004,-0.0252,-0.0160,0.0254,0.0158,0.0022,0.0051,-0.0060,-0.0163,-0.0229,0.0041,-0.0089,-0.0020,-0.0039,0.0025,-0.0109,0.0159,0.0026,0.0034,-0.0181,-0.0001,-0.0005,0.0022,-0.0223,-0.0109,0.0150,-0.0309,0.0045,-0.0125,0.0067,-0.0128,0.0261,-0.0381,0.0004,0.0055,0.0109,0.0060,0.0040,-0.0452,-0.0109,-0.0121,-0.0120,-0.0478,0.0198,-0.0222,-0.0728,0.0602,-0.0085,0.0088,0.0234,0.0186,-0.0285,-0.0033,-0.0006,0.0311,-0.0085,0.0141,-0.0270,0.0059,0.0079,-0.0026,-0.0139,0.0119,0.0081,0.0163,-0.0743,0.0152,0.0622,0.0187,0.0347,-0.0125,0.0103,-0.0136,0.0054,0.0111,0.0407,0.0029,0.0552,-0.0040,0.0011,0.0385,0.0012,0.0228,0.0179,-0.0039,-0.0009,0.0032,0.0180,0.0111,-0.0081,-0.0039,-0.0010,0.0243,-0.0109,-0.0000,0.0082,0.0002,-0.0154,-0.0007,-0.0117,0.0073,-0.0059,0.0013,-0.0113,0.0037,-0.0181,-0.0066,0.0153,-0.0181,-0.0167,-0.0222,-0.0221,0.0405,0.0057,-0.0023,0.0009,0.0045,-0.0032,0.0365,-0.0181,-0.0010,-0.0134,0.0011,0.0171,0.0198,-0.0112,-0.0065,-0.0075,0.0021,-0.0166,0.0087,-0.0076,0.0090,0.0095,-0.0159,0.0019,-0.0005,-0.0075,0.0229,0.0127,-0.0064,0.0136,-0.0217,0.0022,-0.0040,0.0107,0.0198,0.0067,0.0111,-0.0290,0.0028,0.0050,0.0052,-0.0252,-0.0116,-0.0086,-0.0045,-0.0051,-0.0340,-0.0141,-0.0043,0.0067,0.0001,-0.0229,-0.0183,0.0271,0.0176,-0.0072,0.0018,0.0100,-0.0041,-0.0196,0.0111,-0.0032,0.0210,-0.0187,-0.0089,0.0208,-0.0191,0.0003,-0.0143,0.0019,0.0034,0.0003,-0.0052,-0.0042,0.0266,-0.0092,-0.0122,-0.0216,0.0160,0.0618,-0.0051,0.0510,0.0261,-0.0185,0.0371,0.0491,0.0403,-0.0157,0.0239,-0.0080,-0.0075,0.0100,-0.0042,0.0278,-0.0321,-0.0026,-0.0025,-0.0081,0.0068,-0.0075,-0.0083,0.0139,-0.0293,0.0264,-0.0048,-0.0087,0.0090,0.0131,0.0000,-0.0119,-0.0088,0.0090,-0.0152,0.0245,0.0012,-0.0126,-0.0024,-0.0073,0.0079,-0.0254,0.0061,0.0346,0.0023,-0.0050,0.0088,0.0032,0.0037,-0.0199,-0.0026,0.0055,-0.0047,0.0005,0.0025,-0.0002,-0.0023,-0.0029,0.0017,0.0032,0.0048,-0.0057,-0.0204,-0.0115,-0.0134,-0.0140,0.0033,-0.0057,-0.0257,-0.0332,-0.0443,-0.0164,0.0393,0.0257,0.0018,0.0103,0.0187,0.0097,-0.0121,0.0004,-0.0084,-0.0012,-0.0117,-0.0023,-0.0105,-0.0024,0.0307,-0.0124,0.0191,-0.0160,0.0121,-0.0403,-0.0276,-0.0391,0.0286,-0.0120,-0.0317,0.0180,0.0023,-0.0147,-0.0164,-0.0070,0.0324,-0.0013,-0.0037,-0.0307,-0.0098,0.0079,0.0225,0.0039,-0.0098,-0.0052,0.0339,-0.0229,0.0150,-0.0096,0.0089,-0.0091,-0.0125,-0.0093,-0.0141,-0.0006,-0.0090,-0.0289,-0.0522,-0.0158,-0.0025,0.0150,-0.0192,0.0083,0.0141,0.0394,0.0344,-0.0016,-0.0150,-0.0060,-0.0118,-0.0054,-0.0143,0.0070,-0.0178,-0.0041,0.0164,-0.0149,-0.0353,-0.0123,-0.0369,0.0018,-0.0424,-0.0281,0.0470,0.0313,0.0271,0.0187,0.0431,-0.0100,-0.0122,0.0117,-0.0105,0.0250,-0.0026,0.0221,0.0116,-0.0100,-0.0209,-0.0025,0.0004,0.0242,-0.0014,0.0064,-0.0145,-0.0092,0.0016,-0.0069,-0.0040,-0.0124,0.0155,0.0349,0.0112,-0.0131,-0.0090,-0.0187,-0.0013,-0.0020,-0.0060,0.0007,0.0108,0.0157,-0.0042,0.0305,0.0315,-0.0166,0.0041,-0.0058,-0.0077,0.0055,-0.0044,0.0074,0.0021,-0.0120,0.0348,-0.0107,-0.0037,-0.0091,0.0017,0.0009,-0.0050,-0.0064,-0.0068,0.0180,-0.0107,-0.0024,0.0014,-0.0160,-0.0113,-0.0191,0.0072,0.0118,-0.0093,0.0120,-0.0070,-0.0144,-0.0013,0.0097,-0.0148,0.0034,-0.0071,-0.0017,-0.0048,-0.0077,-0.0014,0.0145,0.0024,-0.0038,0.0040,0.0102,-0.0161,0.0086,0.0140,-0.0036,-0.1398,-0.0483,0.0592,0.0036,0.0166,-0.0132,0.0026,-0.0166,0.0396,-0.0314,0.0073,-0.0034,-0.0153,0.0133,0.0449,0.0164,0.0036,0.0062,0.0094"
rets = np.array([float(x) for x in RETS_CSV.split(",")])
N = len(rets)
B = 2000
BLOCK = 10
rng = np.random.default_rng(42)


def var95_of(draws):
    # VaR95 tiap ulangan = -kuantil 5% (definisi HS, langkah 2)
    return np.array([-np.quantile(d, 0.05) for d in draws])


def ci95(a):
    return float(np.quantile(a, 0.025)), float(np.quantile(a, 0.975))

idx_iid = np.zeros((B, N), dtype=int)  # TODO: rng.integers(0, N, size=(B, N))
draws_iid = rets[idx_iid]
var95_iid = var95_of(draws_iid)
ci_iid = ci95(var95_iid)
starts = np.zeros((B, N // BLOCK), dtype=int)  # TODO: rng.integers(0, N - BLOCK + 1, size=(B, N // BLOCK))
blocks = np.stack([rets[s:s + BLOCK] for s in starts.reshape(-1)]).reshape(B, -1, BLOCK)
draws_blk = blocks.reshape(B, -1)[:, :N]
var95_blk = var95_of(draws_blk)
ci_blk = ci95(var95_blk)
var95_iid_mean = float(var95_iid.mean())
var95_blk_mean = float(var95_blk.mean())
lebar_ci_iid = ci_iid[1] - ci_iid[0]
lebar_ci_blk = ci_blk[1] - ci_blk[0]
ci_block_lebih_lebar = lebar_ci_blk > lebar_ci_iid
print(f"var95_iid_mean={var95_iid_mean:.4f}")
print(f"var95_blk_mean={var95_blk_mean:.4f}")
print(f"ci_iid=[{ci_iid[0]:.4f}; {ci_iid[1]:.4f}] lebar_ci_iid={lebar_ci_iid:.4f}")
print(f"ci_blk=[{ci_blk[0]:.4f}; {ci_blk[1]:.4f}] lebar_ci_blk={lebar_ci_blk:.4f}")
print(f"ci_block_lebih_lebar={ci_block_lebih_lebar}")`,
        lockLines: 24,
        solution: `# Lab 2 — iid vs block bootstrap CI untuk VaR95 (B=2.000)
# Data: 480 SIMPLE daily returns portofolio equal-weight BBCA/KLBF/UNVR
# (2024-11-04 s.d. 2026-11-11) — deret yang sama dengan m9_canonical.json.
# B kanonis 10.000; lab memakai B=2.000 agar ringan di browser — CI-nya
# sedikit lebih berisik, tapi perbandingan lebar CI (block > iid) tetap
# terlihat. Seed 42 (sama dengan kanonis) agar hasilnya dapat direplikasi.
import numpy as np

RETS_CSV = "-0.0118,-0.0099,-0.0084,-0.0168,-0.0048,-0.0111,0.0174,-0.0046,-0.0183,0.0097,-0.0067,-0.0076,0.0144,-0.0212,0.0151,0.0401,-0.0180,0.0061,-0.0024,-0.0121,0.0165,0.0073,0.0072,-0.0154,0.0181,0.0230,-0.0068,-0.0259,-0.0125,-0.0075,-0.0277,0.0004,-0.0252,-0.0160,0.0254,0.0158,0.0022,0.0051,-0.0060,-0.0163,-0.0229,0.0041,-0.0089,-0.0020,-0.0039,0.0025,-0.0109,0.0159,0.0026,0.0034,-0.0181,-0.0001,-0.0005,0.0022,-0.0223,-0.0109,0.0150,-0.0309,0.0045,-0.0125,0.0067,-0.0128,0.0261,-0.0381,0.0004,0.0055,0.0109,0.0060,0.0040,-0.0452,-0.0109,-0.0121,-0.0120,-0.0478,0.0198,-0.0222,-0.0728,0.0602,-0.0085,0.0088,0.0234,0.0186,-0.0285,-0.0033,-0.0006,0.0311,-0.0085,0.0141,-0.0270,0.0059,0.0079,-0.0026,-0.0139,0.0119,0.0081,0.0163,-0.0743,0.0152,0.0622,0.0187,0.0347,-0.0125,0.0103,-0.0136,0.0054,0.0111,0.0407,0.0029,0.0552,-0.0040,0.0011,0.0385,0.0012,0.0228,0.0179,-0.0039,-0.0009,0.0032,0.0180,0.0111,-0.0081,-0.0039,-0.0010,0.0243,-0.0109,-0.0000,0.0082,0.0002,-0.0154,-0.0007,-0.0117,0.0073,-0.0059,0.0013,-0.0113,0.0037,-0.0181,-0.0066,0.0153,-0.0181,-0.0167,-0.0222,-0.0221,0.0405,0.0057,-0.0023,0.0009,0.0045,-0.0032,0.0365,-0.0181,-0.0010,-0.0134,0.0011,0.0171,0.0198,-0.0112,-0.0065,-0.0075,0.0021,-0.0166,0.0087,-0.0076,0.0090,0.0095,-0.0159,0.0019,-0.0005,-0.0075,0.0229,0.0127,-0.0064,0.0136,-0.0217,0.0022,-0.0040,0.0107,0.0198,0.0067,0.0111,-0.0290,0.0028,0.0050,0.0052,-0.0252,-0.0116,-0.0086,-0.0045,-0.0051,-0.0340,-0.0141,-0.0043,0.0067,0.0001,-0.0229,-0.0183,0.0271,0.0176,-0.0072,0.0018,0.0100,-0.0041,-0.0196,0.0111,-0.0032,0.0210,-0.0187,-0.0089,0.0208,-0.0191,0.0003,-0.0143,0.0019,0.0034,0.0003,-0.0052,-0.0042,0.0266,-0.0092,-0.0122,-0.0216,0.0160,0.0618,-0.0051,0.0510,0.0261,-0.0185,0.0371,0.0491,0.0403,-0.0157,0.0239,-0.0080,-0.0075,0.0100,-0.0042,0.0278,-0.0321,-0.0026,-0.0025,-0.0081,0.0068,-0.0075,-0.0083,0.0139,-0.0293,0.0264,-0.0048,-0.0087,0.0090,0.0131,0.0000,-0.0119,-0.0088,0.0090,-0.0152,0.0245,0.0012,-0.0126,-0.0024,-0.0073,0.0079,-0.0254,0.0061,0.0346,0.0023,-0.0050,0.0088,0.0032,0.0037,-0.0199,-0.0026,0.0055,-0.0047,0.0005,0.0025,-0.0002,-0.0023,-0.0029,0.0017,0.0032,0.0048,-0.0057,-0.0204,-0.0115,-0.0134,-0.0140,0.0033,-0.0057,-0.0257,-0.0332,-0.0443,-0.0164,0.0393,0.0257,0.0018,0.0103,0.0187,0.0097,-0.0121,0.0004,-0.0084,-0.0012,-0.0117,-0.0023,-0.0105,-0.0024,0.0307,-0.0124,0.0191,-0.0160,0.0121,-0.0403,-0.0276,-0.0391,0.0286,-0.0120,-0.0317,0.0180,0.0023,-0.0147,-0.0164,-0.0070,0.0324,-0.0013,-0.0037,-0.0307,-0.0098,0.0079,0.0225,0.0039,-0.0098,-0.0052,0.0339,-0.0229,0.0150,-0.0096,0.0089,-0.0091,-0.0125,-0.0093,-0.0141,-0.0006,-0.0090,-0.0289,-0.0522,-0.0158,-0.0025,0.0150,-0.0192,0.0083,0.0141,0.0394,0.0344,-0.0016,-0.0150,-0.0060,-0.0118,-0.0054,-0.0143,0.0070,-0.0178,-0.0041,0.0164,-0.0149,-0.0353,-0.0123,-0.0369,0.0018,-0.0424,-0.0281,0.0470,0.0313,0.0271,0.0187,0.0431,-0.0100,-0.0122,0.0117,-0.0105,0.0250,-0.0026,0.0221,0.0116,-0.0100,-0.0209,-0.0025,0.0004,0.0242,-0.0014,0.0064,-0.0145,-0.0092,0.0016,-0.0069,-0.0040,-0.0124,0.0155,0.0349,0.0112,-0.0131,-0.0090,-0.0187,-0.0013,-0.0020,-0.0060,0.0007,0.0108,0.0157,-0.0042,0.0305,0.0315,-0.0166,0.0041,-0.0058,-0.0077,0.0055,-0.0044,0.0074,0.0021,-0.0120,0.0348,-0.0107,-0.0037,-0.0091,0.0017,0.0009,-0.0050,-0.0064,-0.0068,0.0180,-0.0107,-0.0024,0.0014,-0.0160,-0.0113,-0.0191,0.0072,0.0118,-0.0093,0.0120,-0.0070,-0.0144,-0.0013,0.0097,-0.0148,0.0034,-0.0071,-0.0017,-0.0048,-0.0077,-0.0014,0.0145,0.0024,-0.0038,0.0040,0.0102,-0.0161,0.0086,0.0140,-0.0036,-0.1398,-0.0483,0.0592,0.0036,0.0166,-0.0132,0.0026,-0.0166,0.0396,-0.0314,0.0073,-0.0034,-0.0153,0.0133,0.0449,0.0164,0.0036,0.0062,0.0094"
rets = np.array([float(x) for x in RETS_CSV.split(",")])
N = len(rets)
B = 2000
BLOCK = 10
rng = np.random.default_rng(42)


def var95_of(draws):
    # VaR95 tiap ulangan = -kuantil 5% (definisi HS, langkah 2)
    return np.array([-np.quantile(d, 0.05) for d in draws])


def ci95(a):
    return float(np.quantile(a, 0.025)), float(np.quantile(a, 0.975))

idx_iid = rng.integers(0, N, size=(B, N))
draws_iid = rets[idx_iid]
var95_iid = var95_of(draws_iid)
ci_iid = ci95(var95_iid)
starts = rng.integers(0, N - BLOCK + 1, size=(B, N // BLOCK))
blocks = np.stack([rets[s:s + BLOCK] for s in starts.reshape(-1)]).reshape(B, -1, BLOCK)
draws_blk = blocks.reshape(B, -1)[:, :N]
var95_blk = var95_of(draws_blk)
ci_blk = ci95(var95_blk)
var95_iid_mean = float(var95_iid.mean())
var95_blk_mean = float(var95_blk.mean())
lebar_ci_iid = ci_iid[1] - ci_iid[0]
lebar_ci_blk = ci_blk[1] - ci_blk[0]
ci_block_lebih_lebar = lebar_ci_blk > lebar_ci_iid
print(f"var95_iid_mean={var95_iid_mean:.4f}")
print(f"var95_blk_mean={var95_blk_mean:.4f}")
print(f"ci_iid=[{ci_iid[0]:.4f}; {ci_iid[1]:.4f}] lebar_ci_iid={lebar_ci_iid:.4f}")
print(f"ci_blk=[{ci_blk[0]:.4f}; {ci_blk[1]:.4f}] lebar_ci_blk={lebar_ci_blk:.4f}")
print(f"ci_block_lebih_lebar={ci_block_lebih_lebar}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95_iid_mean", value: 0.0283, tol: 0.002, label: "`var95_iid_mean` seharusnya sekitar 0.0283", msg: "Mean bootstrap iid VaR95 ≈ 0,0283 (deret lab dibulatkan 4 desimal; kanonis B=10.000: 0,0284) — hampir sama dengan VaR95 HS 0,0286." },
          { kind: "equal", task: "t2", name: "var95_blk_mean", value: 0.0285, tol: 0.002, label: "`var95_blk_mean` seharusnya sekitar 0.0285", msg: "Mean bootstrap block VaR95 ≈ 0,0285 (kanonis B=10.000: 0,0285) — dependensi waktu tidak menggeser titiknya." },
          { kind: "equal", task: "t3", name: "lebar_ci_iid", value: 0.0093, tol: 0.0015, label: "`lebar_ci_iid` seharusnya sekitar 0.0093", msg: "Lebar CI95 iid ≈ 0,0093 (0,0322 − 0,0229) — ini batas BAWAH kelebaran yang benar, karena iid memutus dependensi waktu." },
          { kind: "equal", task: "t3", name: "lebar_ci_blk", value: 0.0111, tol: 0.0015, label: "`lebar_ci_blk` seharusnya sekitar 0.0111", msg: "Lebar CI95 block ≈ 0,0111 (0,0340 − 0,0229) — lebih lebar dari iid karena blok menjaga gerombol volatilitas." },
          { kind: "stdout_matches", task: "t3", pattern: "ci_block_lebih_lebar=True", label: "Output menampilkan ci_block_lebih_lebar=True", msg: "Lebar CI block > lebar CI iid — dependensi waktu (autokorelasi kuadrat lag-1 0,1043 [M4.3]) menggelembungkan ketidakpastian. Bila False, periksa starts-mu: placeholder nol membuat semua blok sama." },
        ],
      },
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 12 · Mini-case",
      title: "Mini-case: laporkan VaR95 dengan CI-nya ke komite",
      prose: [
        "Situasinya: besok pagi kamu berdiri di depan komite risiko. Di layar hanya ada satu slide kosong dan satu pertanyaan: «Berapa VaR95 portofolio kita?» Jawaban yang benar bukan satu angka — ia satu kalimat yang memuat angka, interval, dan metode. Jawaban lesson ini: «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; parametrik 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk — dalam rupiah per Rp100 juta: VaR95 Rp2.860.000, ES95 Rp4.450.000.»",
        "Uraikan kenapa tiap potong kalimat itu ada. «HS (480 hari)» — metodenya dan jendelanya, agar komite bisa mereplikasi dan menantang (langkah 2–3). «0,0286» — titiknya. «CI95 bootstrap block-10 [0,0223; 0,0340]» — pitanya, dari metode yang MENGAKUI dependensi waktu (autokorelasi kuadrat lag-1 0,1043 [M4.3]) — bukan CI iid [0,0229; 0,0322] yang lebih sempit tetapi palsu untuk data ini (langkah 6, 9). «Parametrik 0,0328 sebagai pembanding» — metode kedua, agar komite melihat selisih antar-metode (0,0042) dan tahu bahwa selisih itu berada DI DALAM CI block — perbedaannya masih di dalam noise bila dependensi diakui (langkah 7). «ES95 0,0445 karena ekor gemuk» — angka yang sebenarnya menentukan cadangan kerugian bila VaR terlampaui: ES95 HS lebih besar dari param (0,0410) — dan ES99 HS (0,0775) jauh lebih besar dari param (0,0528) — jadi cadangan harus mengikuti ES historis, bukan ES normal (langkah 4). Dan rupiahnya — Rp2.860.000 dan Rp4.450.000 per Rp100 juta — karena komite memutuskan uang, bukan fraksi.",
        "Yang TIDAK boleh ada di slide itu: «VaR95 0,0286» sendirian (tanpa metode dan jendela — tidak bisa diaudit); «VaR95 0,0284 ± 0,0022» (mean ± sd bootstrap — kesalahan M6.2/M6.5); «ekor gemuk, jadi VaR hist pasti lebih besar» (salah di data ini — VaR hist LEBIH KECIL dari param; yang gemuk adalah beyond-VaR); dan «CI95 [0,0229; 0,0322]» tanpa kata «iid» atau «block» (CI tanpa metode sama tidak bergunanya dengan VaR tanpa metode). Bila komite bertanya «kenapa CI-nya selebar itu (0,0117)?», jawabanmu: «karena autokorelasi kuadrat 0,1043 membuat 480 hari tidak se-informatif 480 hari yang saling bebas — lebar CI VaR95 0,0117 adalah harga dependensi itu. Lebar CI ES95 yang 0,0239 itu soal lain: ia datang dari hanya 24 hari ekor yang dirata-rata. Pita ini adalah harga kejujuran atas data yang kita punya; CI yang lebih sempit hanya bisa didapat dengan mengabaikan dependensi itu».",
        "Nilai: mini-case ini bagus karena ia melatih SATU kebiasaan yang membedakan analis risiko dari kalkulator: melaporkan ketidakpastian BERSAMA estimasi, dengan metode yang tertulis. Komite tidak menghukum analis yang CI-nya lebar — ia menghukum analis yang CI-nya sempit karena metodenya salah.",
        "Baik atau buruk: jawaban satu kalimat itu bagus bila tiap potongnya bisa ditelusur ke angka kanonis (0,0286; [0,0223; 0,0340]; 0,0328; 0,0445 — semuanya dari m9_canonical.json dan [M4.2]). Buruk bila satu potongnya hilang: tanpa CI, komite mengira 0,0286 itu pasti; tanpa pembanding param, komite tidak tahu ada metode kedua yang berkata 0,0328; tanpa ES, komite mengira «melewati VaR» berarti «rugi 0,0286» — padahal rata-rata kerugiannya bila VaR terlampaui adalah 0,0445.",
        "Mitigasi: jadikan kalimat ini TEMPLATE laporan VaR-mu — «VaR95 [metode] ([jendela]) [angka], CI95 bootstrap [blok] [interval]; [metode pembanding] [angka] sebagai pembanding; ES95 [angka] karena [alasan ekor]» — dan isi kurungnya dari data setiap kali, bukan dari ingatan.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: menjawab komite dengan satu angka",
        type: "risk",
        body: "Yang benar: «VaR95 0,0286» sendirian adalah jawaban yang tidak bisa diaudit — ia bisa 0,0283 (jendela 120), 0,0311 (jendela 250), atau 0,0328 (parametrik) dari data yang sama. Jawaban yang benar memuat angka + interval + metode: «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; param 0,0328 sebagai pembanding; ES95 0,0445».",
      },
    },
    {
      id: "memilih-panjang-blok",
      eyebrow: "Langkah 13 · Memilih panjang blok",
      title: "Memilih panjang blok: 5, 10, atau 20 — CI melebar dengan blok",
      prose: [
        "Lesson ini memakai block bootstrap dengan panjang blok 10 [kebijakan lesson ini] — dan langkah 6 sudah menunjukkan CI-nya melebar (sd +32% vs iid). Tapi MENGAPA 10? Panjang blok adalah pilihan, bukan hukum — dan pilihan itu menggerakkan jawaban. Hitungan baru [notebook], B=10.000, seed 42, stream segar per panjang: blok 5 → VaR95 mean 0,0284, sd 0,0027, CI95 [0,0229; 0,0335], lebar 0,0106 (96 blok per draw, 476 blok distinct); blok 10 → mean 0,0286, sd 0,0028, CI95 [0,0223; 0,0340], lebar 0,0117 (48 blok, 471 distinct); blok 20 → mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0353], lebar 0,0130 (24 blok, 461 distinct).",
        "Bacalah monotonnya: lebar CI naik +10,4% (5→10) dan +11,1% (10→20) — total +22,6% dari blok 5 ke blok 20 [turunan]. Pelebarannya terutama dari sisi ATAS CI (0,0335 → 0,0340 → 0,0353; sisi bawah stabil 0,0229 → 0,0223 → 0,0223) — blok yang lebih panjang mempertahankan dependensi yang lebih panjang, dan dependensi itu hidup di ekor kanan (kerugian besar yang bergerombol). Trade-off-nya: blok lebih panjang menjaga dependensi lebih baik, tetapi menawarkan blok distinct lebih sedikit (476 → 471 → 461) — tiap draw makin mirip satu sama lain. Blok 5 nyaris iid (terlalu pendek untuk autokorelasi kuadrat lag-1 0,1043 [M4.3]); blok 20 menjaga dependensi tetapi dengan 24 blok per draw, variasi antar-draw makin didominasi susunan blok yang itu-itu juga.",
        "Nilai: diagnosis panjang blok bagus karena ia mengubah «blok 10» dari angka magis menjadi pilihan yang bisa diaudit: tiap panjang memberi CI yang berbeda, dan perbedaannya punya arah (melebar dengan blok) serta alasan (dependensi di ekor). Tanpa diagnosis ini, «blok 10» terlihat seperti konstanta alam — padahal ia keputusan.",
        "Baik atau buruk: blok bagus bila panjangnya dipilih karena STRUKTUR datamu — autokorelasi kuadrat lag-1 0,1043 [M4.3] menuntut blok yang cukup panjang untuk mencakup gerombol beberapa hari, tetapi tidak sepanjang itu sehingga blok distinct-nya habis. Buruk bila panjang blok dipilih karena HASILNYA (CI yang paling sempit, atau yang mencakup angka favoritmu) — itu scenario shopping versi bootstrap. Dan ingat batasnya (langkah 9): block bootstrap TIDAK menjaga pergeseran rezim — ia mengacak blok dari rezim yang sama; bila rezim berganti, tidak ada panjang blok yang menyelamatkanmu.",
        "Mitigasi: laporkan SELALU tiga panjang blok (5/10/20 di sini) beserta lebar CI-nya — bila verdictmu berubah antar panjang, verdictmu tidak kokoh. Bila satu panjang harus dipilih untuk laporan, pilih 10 [kebijakan lesson ini] dan tulis alasannya: cukup panjang untuk gerombol beberapa hari, cukup pendek untuk 471 blok distinct. Alternatif yang cukup disebut namanya: circular bootstrap (blok membungkus ujung ke awal) dan stationary bootstrap (panjang blok acak geometrik) — keduanya menjaga dependensi dengan cara berbeda, dan tidak diajarkan penuh di sini.",
      ],
      tasks: [],
      formula: String.raw`\mathrm{lebar\ CI}_{95}(L) = q_{0,975}\left(\widehat{\mathrm{VaR}}_{95}^{(L)}\right) - q_{0,025}\left(\widehat{\mathrm{VaR}}_{95}^{(L)}\right), \qquad L \in \{5, 10, 20\}`,
      formulaNote: "L = panjang blok (hari); tiap draw block bootstrap mengambil 480/L blok dengan pengembalian dari 480−L+1 blok distinct yang tersedia. Hasil [notebook], B=10.000, seed 42: L=5 → lebar 0,0106 (96 blok/draw, 476 distinct); L=10 → 0,0117 (48 blok, 471 distinct); L=20 → 0,0130 (24 blok, 461 distinct). Blok 10 di sini adalah hitungan ulang: sd 0,0028 vs kanonis 0,0029, CI sama persis [0,0223; 0,0340] — selisih 0,0001 adalah noise MC antar-stream [notebook]. Lebar naik +22,6% dari L=5 ke L=20 [turunan].",
      note: {
        title: "Jangan pilih panjang blok dari hasil",
        type: "risk",
        body: "Memilih L=5 karena CI-nya paling sempit (0,0106) adalah kesalahan yang sama dengan memilih generator dari backtest yang sama (M9.1 langkah 13): panjang blok dipilih agar jawabannya nyaman. Putuskan panjang blok dari STRUKTUR data (berapa lama gerombol bertahan — autokorelasi kuadrat lag-1 0,1043 [M4.3] menyarankan gerombol beberapa hari) SEBELUM melihat CI-nya — atau laporkan ketiganya dan akui verdictmu bergantung pada pilihan itu.",
      },
    },
    {
      id: "pipeline-m8-m9",
      eyebrow: "Langkah 14 · Figure 1",
      title: "Figure 1: pipeline M8→M9 — satu pola, dua dunia",
      prose: [
        "M9 mengajarkan VaR, ES, dan backtest seolah-olah angkanya jatuh dari langit — padahal tiap angka punya silsilah. Polanya sama di kedua dunia: (1) champion tervalidasi, (2) exposure, (3) distribusi kerugian, (4) VaR/ES, (5) limit & monitoring. Contoh kredit (M8) mengisi tiga mata rantai pertama: champion GBM terkalibrasi ROC-AUC 0,7816 [M8.1]; threshold 0,10 → approved NT$424.180.000 dari total LIMIT NT$1.007.777.680 (42,09% [M8.2]); EAD = LIMIT_BAL → EL approved NT$11.989.453, EL semua test NT$78.675.378 [M8.2]. Contoh pasar (M9) mengisi dua mata rantai terakhir: distribusi return 480 hari → VaR95 HS 0,0286, ES95 0,0445, param 0,0328, MC 0,0329; limit dari VaR/ES, dimonitor backtest (M9.3) + drift (M7.5), revalidasi ≤12 bulan [M8.5].",
        "Dua dunia, satu pipeline — dan satu peringatan: JANGAN baca figure ini sebagai «VaR95 0,0286 dihitung dari EL NT$11.989.453». Itu salah — VaR pasar dihitung dari return saham, EL kredit dari default nasabah. Yang SAMA adalah polanya: model tervalidasi → exposure → distribusi kerugian → VaR/ES → limit. Bila satu mata rantai putus — mis. threshold berubah tanpa revalidasi — angka di ujungnya adalah angka yatim, di dunia mana pun ia tinggal.",
        "Nilai: pipeline bagus karena ia membuat tiap angka M9 bisa dilacak ke hulu — «VaR95 0,0286» bukan angka, melainkan ujung dari rantai keputusan. Buruk bila rantai itu dibaca mundur: VaR tidak memvalidasi champion; champion yang tervalidasi memvalidasi VaR. Mitigasi: tiap laporan VaR WAJIB menyebut empat mata rantai — champion apa, threshold berapa, EAD dari mana, limit apa — dan tanggal revalidasi terakhir.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 320" role="img" aria-label="Pipeline M8 ke M9: champion tervalidasi, exposure dan keputusan, distribusi kerugian, VaR dan ES, limit dan monitoring">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Pipeline M8→M9 — satu pola, dua dunia</text>
<rect x="70" y="30" width="340" height="36" rx="6" fill="var(--c1)" opacity="0.15" stroke="var(--c1)"/>
<text x="240" y="45" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">1 · Champion tervalidasi [M8.1]</text>
<text x="240" y="60" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">GBM terkalibrasi · ROC-AUC 0,7816 · ECE 0,0087</text>
<line x1="240" y1="66" x2="240" y2="78" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,82 235,74 245,74" fill="var(--chart-text)"/>
<rect x="70" y="82" width="340" height="36" rx="6" fill="var(--c2)" opacity="0.15" stroke="var(--c2)"/>
<text x="240" y="97" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">2 · Exposure + keputusan [M8.2]</text>
<text x="240" y="112" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">threshold 0,10 → approved NT$424.180.000 (42,09%)</text>
<line x1="240" y1="118" x2="240" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,134 235,126 245,126" fill="var(--chart-text)"/>
<rect x="70" y="134" width="340" height="36" rx="6" fill="var(--c3)" opacity="0.15" stroke="var(--c3)"/>
<text x="240" y="149" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">3 · Distribusi kerugian [M8.2]</text>
<text x="240" y="164" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">EAD = LIMIT_BAL · EL approved NT$11.989.453</text>
<line x1="240" y1="170" x2="240" y2="182" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,186 235,178 245,178" fill="var(--chart-text)"/>
<rect x="70" y="186" width="340" height="36" rx="6" fill="var(--c4)" opacity="0.15" stroke="var(--c4)"/>
<text x="240" y="201" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">4 · VaR / ES [M9.1 · M9.5]</text>
<text x="240" y="216" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">HS 0,0286 · ES95 0,0445 · param 0,0328 · MC 0,0329</text>
<line x1="240" y1="222" x2="240" y2="234" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,238 235,230 245,230" fill="var(--chart-text)"/>
<rect x="70" y="238" width="340" height="36" rx="6" fill="var(--c5)" opacity="0.15" stroke="var(--c5)"/>
<text x="240" y="253" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">5 · Limit &amp; monitoring [M8.5 · M9.3]</text>
<text x="240" y="268" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">backtest + drift · revalidasi ≤ 12 bulan</text>
<text x="240" y="298" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Dua dunia, satu pipeline — kotak 1–3 contoh kredit (NT$), kotak 4–5 contoh pasar (return).</text>
</svg>`,
        alt: "Pipeline M8 ke M9: champion tervalidasi, exposure dan keputusan, distribusi kerugian, VaR dan ES, limit dan monitoring.",
        caption: "Cara membaca: dua dunia, satu pipeline. Kotak 1–3 memakai contoh kredit M8 (angka NT$); kotak 4–5 memakai contoh pasar M9 (angka return). JANGAN dibaca sebagai satu perhitungan berantai — VaR95 pasar 0,0286 TIDAK dihitung dari EL kredit NT$11.989.453; yang sama adalah POLANYA: model tervalidasi → exposure → distribusi kerugian → VaR/ES → limit.",
      },
      tasks: [],
    },
    {
      id: "kerangka-horizon",
      eyebrow: "Langkah 15 · Kerangka horizon",
      title: "Kerangka horizon: empat jendela yang sering tertukar",
      prose: [
        "Empat jendela, satu kata «jendela» — dan lesson ini memakai keempatnya tanpa pernah membedakannya. Horizon: seberapa jauh ke depan risiko diukur (1 hari di seluruh M9; 10 hari di M9.1 langkah 8). Estimation window: berapa banyak sejarah yang dipakai MENGESTIMASI (250 hari untuk rolling VaR M9.3; 480 hari untuk HS full-sample). Backtest window: berapa banyak sejarah OOS yang dipakai MENGUJI (230 hari untuk rolling-250). HS window: berapa hari ke belakang HS mengambil (120/250/480 hari di langkah 3). Keempatnya bisa berbeda — dan bila kamu menjawab «jendela 250 hari» tanpa menyebut jendela YANG MANA, jawabanmu belum berarti apa-apa.",
        "Tabel desainnya (figure): horizon 1 hari → estimation 480 hari, backtest rolling-250 (OOS 230 hari), HS 480 hari, unit daily return (n=480). Horizon 10 hari → estimation 480 hari (via MC paths M9.1 — BUKAN skala √10 mentah, yang meremehkan ekor 10-hari: 0,0903 vs MC 0,1038); backtest 10-hari: hanya 48 jendela non-overlapping dari 480 hari [turunan] — Kupiec atas 48 jendela hampir tidak punya kuasa (diharapkan 2,4 exceedance [turunan]); HS 10-hari butuh return 10-hari, bukan return harian. Horizon 1 bulan → backtest: sekitar 22 jendela bulanan non-overlapping [turunan] — terlalu sedikit untuk Kupiec (diharapkan 1,1 exceedance pada 95% — satu exceedance mengubah vonis) [turunan].",
        "Unit observasi adalah pilihan kelima yang tersembunyi: seluruh M9 memakai return HARIAN (n=480). Ganti ke return MINGGUAN dan n=96 [turunan] — kuantil 5% dari 96 observasi adalah 5 hari terburuk; VaR95 mingguan dari 96 minggu jauh lebih goyah daripada VaR95 harian dari 480 hari. Dan «250 hari» Basel (M9.3 langkah 10) adalah hari PERDAGANGAN, bukan kalender — 250 hari perdagangan ≈ 1 tahun bursa.",
        "Nilai: kerangka ini bagus karena ia memaksa tiap angka VaR membawa EMPAT label — horizon, estimation window, backtest window, HS window — plus unit observasi. «VaR95 0,0286» tanpa label adalah angka yatim; «VaR95 1-hari, HS 480 hari, backtest rolling-250 OOS 230 hari, daily» adalah angka yang bisa diaudit.",
        "Baik atau buruk: desain bagus bila keempat jendela DIPUTUSKAN sebelum melihat hasil — horizon dari kebutuhan bisnis (berapa lama memegang posisi?), estimation window dari trade-off bias-vs-varians (jendela panjang stabil, jendela pendek adaptif), backtest window dari kuasa uji (230 hari OOS memberi 11,5 exceedance yang diharapkan — cukup untuk Kupiec; 48 jendela 10-hari tidak). Buruk bila jendela dipilih karena hasilnya (scenario shopping M9.2 langkah 12) — «jendela 120 hari memberi VaR yang lebih kecil» adalah alasan memilih yang terbalik.",
        "Mitigasi: di setiap laporan, tulis satu baris desain — «Horizon 1 hari · estimation 480 hari · backtest rolling-250 (OOS 230) · HS 480 hari · unit daily» — dan bila horizon ≠ 1 hari, tulis JUGA berapa jendela non-overlapping yang tersisa untuk backtest. Bila angkanya < 100 [kebijakan lesson ini], katakan terus terang: backtest-mu hampir tidak punya kuasa.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Kerangka horizon: horizon 1 hari, 10 hari, dan 1 bulan dengan estimation window, backtest window, dan HS window masing-masing">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kerangka horizon — empat jendela, satu baris desain</text>
<text x="60" y="44" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Horizon</text>
<text x="140" y="44" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Estimation</text>
<text x="250" y="44" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Backtest</text>
<text x="375" y="44" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">HS window</text>
<line x1="60" y1="50" x2="450" y2="50" stroke="var(--chart-text)" stroke-width="1"/>
<text x="60" y="74" font-size="11" fill="var(--text)" font-family="var(--font-ui)">1 hari</text>
<text x="140" y="74" font-size="11" fill="var(--text)" font-family="var(--font-ui)">480 hari</text>
<text x="250" y="74" font-size="11" fill="var(--text)" font-family="var(--font-ui)">rolling-250 · OOS 230</text>
<text x="375" y="74" font-size="11" fill="var(--text)" font-family="var(--font-ui)">480 hari</text>
<line x1="60" y1="82" x2="450" y2="82" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="60" y="106" font-size="11" fill="var(--text)" font-family="var(--font-ui)">10 hari</text>
<text x="140" y="106" font-size="11" fill="var(--text)" font-family="var(--font-ui)">480 hari (MC)</text>
<text x="250" y="106" font-size="11" fill="var(--text)" font-family="var(--font-ui)">48 jendela</text>
<text x="375" y="106" font-size="11" fill="var(--text)" font-family="var(--font-ui)">return 10-hari</text>
<line x1="60" y1="114" x2="450" y2="114" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="60" y="138" font-size="11" fill="var(--text)" font-family="var(--font-ui)">1 bulan</text>
<text x="140" y="138" font-size="11" fill="var(--text)" font-family="var(--font-ui)">480 hari</text>
<text x="250" y="138" font-size="11" fill="var(--text)" font-family="var(--font-ui)">≈22 jendela</text>
<text x="375" y="138" font-size="11" fill="var(--text)" font-family="var(--font-ui)">—</text>
<line x1="60" y1="146" x2="450" y2="146" stroke="var(--chart-text)" stroke-width="1"/>
<text x="240" y="172" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Satu baris desain: horizon 1 hari · estimation 480 hari · backtest rolling-250 (OOS 230) · HS 480 hari · unit daily.</text>
<text x="240" y="190" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Horizon ≠ estimation ≠ backtest ≠ HS — jawab «jendela 250 hari» tanpa menyebut yang mana = belum menjawab.</text>
<text x="240" y="208" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">«250 hari» Basel adalah hari perdagangan, bukan kalender.</text>
</svg>`,
        alt: "Kerangka horizon: horizon 1 hari, 10 hari, dan 1 bulan dengan estimation window, backtest window, dan HS window masing-masing.",
        caption: "Cara membaca: tiap baris adalah satu DESAIN lengkap — horizon, estimation window, backtest window, HS window. Baris 1 hari adalah desain lesson ini (estimation 480 hari, backtest rolling-250 OOS 230 hari, HS 480 hari, unit daily return n=480). Baris 10 hari dan 1 bulan menunjukkan yang berubah bila horizon memanjang: estimation tetap 480 hari (via MC paths M9.1), tetapi backtest menyusut menjadi 48 jendela (10 hari) dan sekitar 22 jendela (1 bulan) [turunan] — terlalu sedikit untuk Kupiec.",
      },
      tasks: [],
    },
    {
      id: "artefak-keputusan",
      eyebrow: "Langkah 16 · Artefak keputusan",
      title: "Artefak keputusan lintas-metode: satu halaman, delapan baris",
      prose: [
        "M8.3 sudah punya template model card — 17 kolom wajib, termasuk intended users, decision context, affected population, approved use, prohibited use, human review required, dan out-of-scope trigger. Template itu menjawab «model ini APA». Yang belum ada adalah artefak yang menjawab «dengan angka-angka ini, KEPUTUSAN apa» — satu halaman yang mempertemukan HS, parametrik, MC, bootstrap, dan backtest dalam satu verdict. Template di bawah ini adalah artefak itu — dan ia SENGAJA tidak menduplikasi field model card: identitas model (nama, versi, pemilik, tanggal) tetap tinggal di M8.3; yang ada di sini hanyalah baris keputusan lintas-metode.",
        "Satu halaman, delapan baris [kebijakan lesson ini]: (1) Keputusan — apa yang diputuskan (mis. «limit harian Rp2.860.000»); (2) Metode — HS 480 hari + parametrik + MC [M9.1] + bootstrap block-10; (3) Angka — VaR95 HS 0,0286, CI95 block [0,0223; 0,0340], ES95 0,0445, param 0,0328 sebagai pembanding; (4) Validasi — Kupiec p = 0,3108 (lolos), severity 1,1163 (gagal kedalaman, M9.3 langkah 13), independence p = 0,0099 (gagal); (5) Batas — asumsi yang gagal (normal, iid, vol konstan — M9.1 langkah 6), rezim (pasca-crash Oktober 2026); (6) Verdict — SATU kata: LOLOS / LOLOS-BERSYARAT / TIDAK LOLOS, dengan alasan satu kalimat; (7) Tindak lanjut — pemilik, tanggal revalidasi (≤12 bulan [M8.5]), kondisi pemicu review ulang; (8) Tanda tangan — siapa yang menanggung keputusan ini.",
        "Nilai: artefak bagus karena ia memaksa verdict TERTULIS — «TIDAK LOLOS sebagai model» (M9.3 mini-case) menjadi satu baris yang bisa ditandatangani, bukan kesan yang bisa dinegosiasikan belakangan. Buruk bila artefak ini diisi dengan angka tanpa label jendela — «VaR95 0,0286» tanpa horizon dan jendela adalah angka yatim (langkah 15). Mitigasi: JANGAN pernah menerbitkan artefak dengan baris (6) kosong — verdict yang tidak ditulis adalah keputusan yang tidak diambil.",
      ],
      tasks: [],
      note: {
        title: "Artefak ini bukan model card kedua",
        type: "pitfall",
        body: "Yang benar: field identitas model (nama, versi, pemilik, tanggal, intended users, prohibited use) SUDAH ada di template model card M8.3 (17 kolom wajib) — jangan salin ke sini. Artefak ini hanya berisi KEPUTUSAN atas angka-angka lintas-metode. Bila suatu hari model card dan artefak keputusan bertentangan (mis. model card berkata «approved use: limit harian», artefak berkata «TIDAK LOLOS»), yang menang adalah artefak TERBARU — dan ketidaksesuaian itu sendiri adalah temuan yang harus dicatat di issue register (M8.1 langkah G3).",
      },
    },
    {
      id: "operating-loop",
      eyebrow: "Langkah 17 · Figure 2",
      title: "Figure 2: operating loop — Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur",
      prose: [
        "Sembilan belas langkah M9 — dan «Penutup track» di checkpoint masih berupa daftar modul. Daftar bukan sintesis. Sintesisnya adalah LOOP: Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur lagi. Ukur: HS/param/MC (M9.1, M9.5) + generator (M9.1 langkah 13) + propagasi (M9.4 langkah 13). Uji: Kupiec + severity + independence (M9.3) — tiga uji, bukan satu. Putuskan: limit, threshold, generator — ditulis di artefak keputusan (langkah 16). Pantau: drift PSI (M7.5), backtest berjalan, severity berjalan. Revalidasi: ≤12 bulan [M8.5] — atau lebih cepat bila pemicu berbunyi. Dan loop-nya kembali ke Ukur — BUKAN ke Putuskan.",
        "Perhatikan arah panah terakhir: bila backtest gagal (Kupiec lolos tapi independence gagal, M9.3 mini-case; severity 1,1163), jalan keluarnya adalah kembali ke UKUR dengan jendela/generator baru — bukan kembali ke PUTUSKAN dengan ambang yang dilonggarkan. Melonggarkan ambang agar model «lolos» adalah scenario shopping (M9.2 langkah 12) dengan baju baru. Loop yang sehat memperbaiki PENGUKURAN; loop yang sakit memperbaiki AMBANG.",
        "Nilai: operating loop bagus karena ia mengubah track ini dari «sembilan lesson yang sudah dibaca» menjadi «satu kebiasaan yang berjalan»: tiap angka risiko yang kamu laporkan besok masuk ke loop yang sama — ukur, uji, putuskan, pantau, revalidasi. Buruk bila loop ini dibaca sebagai garis lurus dengan ujung — «sudah revalidasi, selesai» — karena revalidasi bukan ujung; ia adalah pintu kembali ke Ukur. Mitigasi: tempel loop ini di dinding (atau di template artefak keputusan langkah 16): tiap verdict WAJIB menyebut di mana ia berada di loop — dan kapan ia kembali ke Ukur.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 320" role="img" aria-label="Operating loop: Ukur, Uji, Putuskan, Pantau, Revalidasi, kembali ke Ukur">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Operating loop — Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur</text>
<rect x="70" y="30" width="340" height="36" rx="6" fill="var(--c1)" opacity="0.15" stroke="var(--c1)"/>
<text x="240" y="45" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">UKUR</text>
<text x="240" y="60" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">HS · param · MC · generator · propagasi</text>
<line x1="240" y1="66" x2="240" y2="78" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,82 235,74 245,74" fill="var(--chart-text)"/>
<rect x="70" y="82" width="340" height="36" rx="6" fill="var(--c2)" opacity="0.15" stroke="var(--c2)"/>
<text x="240" y="97" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">UJI</text>
<text x="240" y="112" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Kupiec + severity + independence (M9.3)</text>
<line x1="240" y1="118" x2="240" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,134 235,126 245,126" fill="var(--chart-text)"/>
<rect x="70" y="134" width="340" height="36" rx="6" fill="var(--c3)" opacity="0.15" stroke="var(--c3)"/>
<text x="240" y="149" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">PUTUSKAN</text>
<text x="240" y="164" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">limit · threshold · generator — artefak keputusan</text>
<line x1="240" y1="170" x2="240" y2="182" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,186 235,178 245,178" fill="var(--chart-text)"/>
<rect x="70" y="186" width="340" height="36" rx="6" fill="var(--c4)" opacity="0.15" stroke="var(--c4)"/>
<text x="240" y="201" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">PANTAU</text>
<text x="240" y="216" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">drift PSI (M7.5) · backtest berjalan</text>
<line x1="240" y1="222" x2="240" y2="234" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="240,238 235,230 245,230" fill="var(--chart-text)"/>
<rect x="70" y="238" width="340" height="36" rx="6" fill="var(--c5)" opacity="0.15" stroke="var(--c5)"/>
<text x="240" y="253" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">REVALIDASI ≤ 12 bulan [M8.5]</text>
<text x="240" y="268" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">atau lebih cepat bila pemicu berbunyi</text>
<polyline points="410,256 448,256 448,48 414,48" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="410,48 418,43 418,53" fill="var(--chart-text)"/>
<text x="448" y="150" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" transform="rotate(-90 448 150)">kembali ke UKUR</text>
<text x="240" y="298" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Bila Uji gagal → kembali ke UKUR (jendela/generator baru) — JANGAN ke Putuskan.</text>
</svg>`,
        alt: "Operating loop: Ukur, Uji, Putuskan, Pantau, Revalidasi, kembali ke Ukur.",
        caption: "Cara membaca: loop searah dari atas. Bila Uji gagal, kembali ke UKUR dengan jendela/generator baru — JANGAN kembali ke PUTUSKAN dengan ambang yang dilonggarkan (itu scenario shopping, M9.2 langkah 12). Revalidasi ≤12 bulan [M8.5] adalah pintu kembali, bukan garis finis.",
      },
      tasks: [],
    },
    {
      id: "setelah-track",
      eyebrow: "Langkah 18 · Setelah track",
      title: "Setelah track: empat jalur, satu artefak",
      prose: [
        "Tidak ada M10 — dan itu disengaja. Yang ada adalah empat jalur setelah track ini, masing-masing dengan gap yang jelas dan artefak yang jelas. Jalur 1 — Market risk quant: dari VaR/ES produksi ke FHS dan EVT (Extreme Value Theory) — merujuk M9.1 langkah 13 untuk FHS; EVT mengajar ekor di luar sampel dengan distribusi Pareto tergeneralisasi, yang tidak diajarkan di track ini. Jalur 2 — Model validation: dari backtest VaR ke uji ES formal (Acerbi–Szekely, dirujuk M9.3 langkah 13) dan standar SR 11-7 — validasi sebagai profesi, bukan sebagai langkah. Jalur 3 — Credit risk: dari M2 dan M8 ke IRB dan IFRS 9 staging penuh — champion-challenger sebagai sistem, bukan sebagai lab. Jalur 4 — Fraud/AML analytics: dari M3 dan Siskamling ke sistem triase produksi — alert triage, false positive, dan monitoring drift (M7.5) sebagai pekerjaan harian.",
        "Matriksnya — gap → skill → artefak: «ekor di luar sampel» → FHS/EVT → laporan VaR dengan EVT; «uji ES formal» → Acerbi–Szekely → backtest ES; «drift di produksi» → PSI live → dashboard monitoring (M7.5); «stress regulasi» → skenario makro → laporan stress ala ICAAP; «threshold bisnis» → profit/LGD/margin → artefak keputusan (langkah 16). Pilih SATU jalur dan SATU artefak — bukan empat jalur sekaligus. Track ini memberimu peta; langkah berikutnya adalah memilih jalan dan berjalan.",
        "Dan satu nasihat penutup yang bukan angka: kebiasaan yang track ini ajarkan — laporkan metode, jendela, dan pitanya; uji jumlah DAN kedalaman; jangan pilih dari hasil — berlaku di luar VaR. Ia berlaku untuk tiap angka yang suatu hari akan kamu pertanggungjawabkan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 19 · Checkpoint",
      title: "Checkpoint: satu angka tidak pernah cukup — laporkan metode, jendela, dan pitanya",
      prose: [
        "Rangkuman: tiga cara menjawab «berapa VaR95?» atas 480 hari SIMPLE daily returns portofolio equal-weight BBCA/KLBF/UNVR (4 November 2024 – 11 November 2026; mean −0,0006, sd 0,0196; hari terburuk −0,1398 pada 2026-10-16 [M9.2]; skew −0,5091, excess kurtosis 6,0216): HS (480 hari) 0,0286, parametrik [M4.2] 0,0328, Monte Carlo [M9.1] 0,0329 (N=100.000), bootstrap mean 0,0284. Historical simulation = kuantil empiris, tanpa asumsi distribusi: VaR95 0,0286, ES95 0,0445 (24 hari terburuk), VaR99 0,0479, ES99 0,0775 (sekitar 5 hari); dalam rupiah per Rp100 juta: VaR95 Rp2.860.000, ES95 Rp4.450.000. Jendela HS mengubah jawaban: 120 hari (20 Mei 2026 – 11 November 2026) → VaR95 0,0283, ES95 0,0557, VaR99 0,0472, ES99 0,0941; 250 hari → 0,0311 / 0,0467 / 0,0464 / 0,0801; 480 hari → 0,0286 / 0,0445 / 0,0479 / 0,0775 — VaR95 bergerak 0,0028 (sekitar 10% dari nilainya) hanya karena jendela; ES95 jendela 120 hari 25% lebih besar dari jendela 480 hari karena hari −0,1398 berbobot empat kali lebih besar di 120 hari. Parametrik [M4.2]: VaR95 0,0328, ES95 0,0410, VaR99 0,0462, ES99 0,0528 — VaR95 hist LEBIH KECIL dari param (selisih 0,0042), tetapi ES95 hist LEBIH BESAR dari param (selisih −0,0035) dan ES99 hist (0,0775) jauh di atas param (0,0528): kuantil 5% empiris lebih kecil dari normal, tetapi ekor DI BALIK VaR lebih gemuk dari normal — jangan klaim «ekor gemuk → VaR hist pasti lebih besar», itu salah di data ini. Bootstrap iid (B=10.000, seed 42): VaR95 mean 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]; ES95 mean 0,0440, sd 0,0057, CI95 [0,0346; 0,0569] — CI mengukur ketidakpastian SAMPLING, bukan ketidakpastian model; laporkan intervalnya, bukan «mean ± sd». Block bootstrap (blok 10 [kebijakan lesson ini], B=10.000, seed 42): VaR95 mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0340]; ES95 mean 0,0440, sd 0,0062, CI95 [0,0333; 0,0572] — sd naik +32% (0,0022 → 0,0029) karena autokorelasi kuadrat lag-1 0,1043 [M4.3]; CI block MENCANGKUP VaR95 param 0,0328, CI iid tidak. Tabel tiga arah: HS untuk n besar tanpa asumsi; parametrik untuk stabilitas dan ekor yang belum terjadi; Monte Carlo [M9.1] sebagai pembanding; bootstrap untuk pitanya. Bootstrap untuk metrik lain: mean daily return −0,0006, CI95 (iid) [−0,0024; +0,0012] — mencakup 0, drift negatif TIDAK signifikan; pola yang sama dengan [M8.1] (bad rate 6,67% CI95 [5,47%; 7,85%]; ECE 0,0087 CI95 [0,0077; 0,0214] — batas atasnya melintasi 0,02; profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]). Jebakan: bootstrap iid pada data ber-autokorelasi = CI terlalu sempit (0,0093 vs 0,0117); block bukan obat mujarab — panjang blok adalah pilihan [kebijakan lesson ini], dan ia tidak menjaga pergeseran rezim. Lab: sensitivitas jendela (var95_range 0,0028; es95_gap_w120_w480 0,0112; hs_param_es95_gap −0,0035; es95_hist_gt_param True) dan bootstrap B=2.000 (lebar CI block 0,0111 > lebar CI iid 0,0093). Langkah baru (fill M9): memilih panjang blok 5/10/20 (langkah 13) — lebar CI 0,0106/0,0117/0,0130 [notebook]; pipeline M8→M9 (langkah 14, figure) — satu pola, dua dunia; kerangka horizon (langkah 15) — horizon ≠ estimation ≠ backtest ≠ HS window; artefak keputusan (langkah 16) — delapan baris, cross-ref model card M8.3; operating loop (langkah 17, figure) — Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur; roadmap pasca-track (langkah 18) — empat jalur, satu artefak. Mini-case: «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; param 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk».",
        "Guided task di Colab — notebook mlf-m95-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data harga: HS 480 hari + parametrik, jendela 120/250/480, bootstrap iid B=10.000, block bootstrap blok 10 + CI mean return, dan laporan komite satu kalimat. Tautan Colab: https://colab.research.google.com/drive/1fzGlXJu5s7zscGzwZPeZiSwidBLupv4T",
        "Penutup track: kamu sudah menempuh seluruh track Machine Learning Finance — dari fondasi data (L0: cleaning, missing data, distribusi, wrangling, A/B testing), fondasi pemodelan (M1), supervised dan credit scoring (M2), unsupervised dan fraud (M3), random forest dan ensembles untuk market risk (M4), optimasi dan konstruksi portofolio (M5), tuning dan seleksi model (M6), fairness, explainability, dan monitoring (M7), model risk dan deployment (M8), sampai simulasi, backtesting, dan validasi (M9) — dan lesson ini adalah ujungnya: menjawab «berapa VaR?» dengan jujur tentang metode, jendela, dan pitanya. Yang tersisa bukan modul berikutnya — tidak ada M10 — melainkan kebiasaan: tiap kali seseorang membawakanmu satu angka risiko, tanyakan tiga hal — metode apa, jendela (atau asumsi) apa, dan berapa pitanya. Bila satu jawabannya kosong, angka itu belum menjadi keputusan. Dan bila suatu hari datamu berubah — rezim berganti, crash baru datang, 480 hari menjadi 1.000 — hitung ulang ketiganya, karena jawaban yang jujur kemarin belum tentu jujur besok. Loop-nya (langkah 17) dan petanya (langkah 18) ada di atas — tempel loop itu di dinding, pilih satu jalur dari peta itu.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tiga metode memberi tiga VaR95 atas data yang sama: HS (480 hari) 0,0286, parametrik 0,0328, Monte Carlo [M9.1] 0,0329. Apa kesimpulan yang benar?",
          options: [
            { text: "Salah satu pasti salah hitung — VaR adalah satu bilangan, jadi dua dari tiga jawaban itu keliru", why: "Salah: ketiganya dihitung dengan benar dari data yang sama — VaR bukan satu bilangan di alam, melainkan keluaran dari satu METODE atas satu DATA. Selisihnya adalah informasi tentang asumsi, bukan bukti kesalahan hitung." },
            { text: "Ketiganya sah — perbedaannya berasal dari metode dan asumsinya: HS tanpa asumsi distribusi, parametrik dan Monte Carlo mengasumsikan normal(itas); yang «benar» tergantung pada asumsi mana yang paling jujur untuk datamu", why: "Benar: HS 0,0286 percaya pada data apa adanya; parametrik 0,0328 dan Monte Carlo 0,0329 percaya pada kurva normal (selisih keduanya hanya 0,0001 karena asumsinya sekeluarga). Pilih berdasarkan data — di sini kurtosis 6,02 membuat HS wajib ada di meja.", correct: true },
            { text: "Yang benar adalah yang paling besar (0,0329) — dalam risiko, selalu ambil angka yang paling konservatif", why: "Salah: «paling besar = paling benar» bukan argumen — angka terbesar bisa berasal dari asumsi yang salah untuk datamu. Konservatif tanpa alasan adalah pemborosan modal; yang benar adalah metode yang asumsinya diperiksa, bukan yang angkanya paling besar." },
            { text: "Yang benar adalah HS 0,0286 — karena HS tidak mengasumsikan apa pun, ia selalu benar", why: "Salah: HS memang tidak mengasumsikan bentuk distribusi, tetapi ia mengasumsikan 480 hari kemarin mewakili besok (stasioneritas) — dan ia buta terhadap ekor di luar sampel. «Tidak mengasumsikan distribusi» bukan «tidak mengasumsikan apa pun»." },
          ],
        },
        {
          q: "VaR95 bergerak 0,0283 (120 hari) → 0,0311 (250 hari) → 0,0286 (480 hari). ES95 jendela 120 hari 0,0557 vs 480 hari 0,0445. Apa yang menjelaskan ES95 jendela pendek yang jauh lebih besar?",
          options: [
            { text: "Jendela 120 hari memakai rumus yang berbeda — ES dihitung dengan normal, bukan empiris", why: "Salah: rumusnya sama di semua jendela (rata-rata return di bawah kuantil 5%). Yang berbeda adalah DATANYA — dan satu hari di dalamnya." },
            { text: "Hari terburuk −0,1398 pada 2026-10-16 [M9.2] ada di dalam jendela 120 hari, dan di sana ia adalah 1 dari 6 hari ekor (5% dari 120) — bobot empat kali lebih besar daripada di jendela 480 hari (1 dari 24)", why: "Benar: ES95 jendela 120 hari 0,0557 adalah 25% lebih besar dari 0,0445 (0,0557/0,0445 ≈ 1,25) — dan penyebabnya adalah satu hari yang sama dengan bobot empat kali lebih besar. Jendela pendek responsif DAN berisik.", correct: true },
            { text: "Jendela 120 hari mencakup lebih banyak crash — ada empat crash di 120 hari terakhir", why: "Salah: hanya ada SATU hari −0,1398 (2026-10-16) — dan justru satu hari itulah yang menggerakkan ES95. Tidak ada empat crash; ada satu crash dengan bobot besar." },
            { text: "ES95 jendela 120 hari salah hitung — ES tidak mungkin lebih besar dari VaR99 (0,0472)", why: "Salah: ES95 (rata-rata 6 hari terburuk) BOLEH lebih besar dari VaR99 (kuantil 1%) — ES95 0,0557 > VaR99 0,0472 adalah wajar: rata-rata ekor 5% mencakup hari −0,1398, sementara kuantil 1% hanya menandai batasnya." },
          ],
        },
        {
          q: "Data ini punya excess kurtosis 6,0216 (ekor tebal). Seorang rekan berkata: «ekor gemuk, jadi VaR95 historis pasti lebih besar dari VaR95 parametrik». Apa jawabanmu?",
          options: [
            { text: "Benar — ekor tebal selalu menaikkan kuantil empiris di atas kuantil normal", why: "Salah: di data ini VaR95 hist 0,0286 LEBIH KECIL dari param 0,0328. Klaim «pasti lebih besar» disangkal oleh data ini — ekor tebal tidak menjamin kuantil 5%-nya lebih besar." },
            { text: "Salah di data ini: VaR95 hist 0,0286 < param 0,0328 — yang gemuk adalah BEYOND-VaR: ES95 hist 0,0445 > param 0,0410 dan ES99 hist 0,0775 jauh di atas param 0,0528", why: "Benar: kuantil 5% empiris justru lebih kecil dari normal; yang gemuk adalah ekor DI BALIK VaR. Satu hari −0,1398 (7,1 sd dari mean) menarik rata-rata ekor ke atas tanpa menaikkan kuantil 5%-nya.", correct: true },
            { text: "Tidak bisa diputuskan — kurtosis 6,02 terlalu kecil untuk memengaruhi VaR95", why: "Salah: kurtosis 6,02 sudah sangat tebal (normal = 0) — dan ia MEMENGARUHI angka: ES99 hist 0,0775 vs param 0,0528 adalah selisih 0,0247. Yang salah adalah arah klaimnya pada VaR95, bukan besar kurtosisnya." },
            { text: "Benar untuk VaR99, salah untuk VaR95 — jadi klaimnya setengah benar", why: "Salah: klaimnya tentang VaR95 («pasti lebih besar») — dan VaR95 hist 0,0286 < param 0,0328 membantahnya langsung. VaR99 hist 0,0479 memang > param 0,0462, tetapi itu tidak menyelamatkan klaim tentang VaR95." },
          ],
        },
        {
          q: "Bootstrap iid VaR95: mean 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]. Bagaimana cara melaporkan angka ini dengan benar?",
          options: [
            { text: "«VaR95 0,0284 ± 0,0022» — mean bootstrap plus-minus sd-nya", why: "Salah: sd bootstrap (0,0022) adalah simpangan baku sebaran bootstrap — bukan galat baku mean dan bukan setengah lebar CI. Ini kesalahan yang sama dengan «0,7858 ± 0,0068» di M6.2/M6.5." },
            { text: "«VaR95 HS 0,0286, CI95 bootstrap [0,0229; 0,0322]» — titik HS beserta intervalnya; sd 0,0022 hanya menjelaskan sebaran bootstrap, bukan dilaporkan sebagai «±»", why: "Benar: laporkan intervalnya — lebar 0,0093 (0,0322 − 0,0229) — beserta metodenya (iid, B=10.000, seed 42). Titik yang dilaporkan adalah VaR95 HS (0,0286); mean bootstrap (0,0284) hanya menunjukkan HS tidak bias secara berarti.", correct: true },
            { text: "«VaR95 0,0286, dan VaR besok pasti di antara 0,0229 dan 0,0322»", why: "Salah: CI mengukur goyahnya ESTIMASI bila sejarah ditarik ulang — bukan goyahnya MASA DEPAN. VaR besok bisa di luar interval bila rezim berganti." },
            { text: "«VaR95 0,0286 — CI tidak perlu dilaporkan karena mean bootstrap 0,0284 hampir sama»", why: "Salah: mean yang hampir sama justru menunjukkan CI-lah informasinya: «0,0286» tanpa pita berpura-pura pasti, sementara CI [0,0229; 0,0322] berkata estimasi ini goyah 0,0093 lebarnya." },
          ],
        },
        {
          q: "Block bootstrap (blok 10) memberi VaR95 sd 0,0029 vs iid 0,0022 — naik 0,0007 (+32%) — dan CI [0,0223; 0,0340] vs iid [0,0229; 0,0322]. Apa penyebab pelebaran ini?",
          options: [
            { text: "Block bootstrap memakai B yang lebih kecil, jadi estimasinya lebih berisik", why: "Salah: B-nya sama — 10.000 ulangan untuk keduanya (seed 42). Yang berbeda adalah CARA menariknya: blok menjaga urutan waktu, iid memutusnya." },
            { text: "Autokorelasi kuadrat lag-1 0,1043 [M4.3] — volatilitas bergerombol — membuat «sejarah alternatif» lebih beragam bila blok dipertahankan; iid yang memutus urutan waktu memberi CI yang terlalu sempit", why: "Benar: sd naik 0,0007/0,0022 ≈ 31,8% (≈ +32%) dan CI melebar dari 0,0093 menjadi 0,0117. Lebar CI tidak harus naik sebanding sd: CI ini persentil (kuantil 2,5%/97,5% sebaran bootstrap), bukan mean ± 1,96·sd — bentuk sebarannya ikut berubah (iid: 2,5×sd di bawah / 1,7×sd di atas mean; block: 2,1×/1,9×) [turunan], jadi +32% sd memberi +26% lebar. CI iid adalah batas bawah kelebaran yang benar untuk data ini, bukan jawaban akhirnya.", correct: true },
            { text: "Block bootstrap menghitung VaR dari data yang berbeda — 480 hari yang lain", why: "Salah: datanya sama — 480 hari yang sama. Yang berbeda hanya resampling-nya: blok 10 hari berturut-turut vs satu hari acak. Mean-nya hampir sama (0,0285 vs 0,0284) justru membuktikan datanya sama." },
            { text: "Pelebaran itu noise — dengan B=10.000, sd 0,0029 vs 0,0022 tidak berbeda secara berarti", why: "Salah: pelebaran 32% adalah sistematis, bukan noise — ia muncul karena dependensi waktu yang nyata (0,1043 [M4.3]) dan konsisten di ES95 juga (sd 0,0057 → 0,0062). Mengabaikannya berarti melaporkan kepastian yang palsu." },
          ],
        },
        {
          q: "VaR95 parametrik 0,0328 jatuh DI LUAR CI95 iid [0,0229; 0,0322] tetapi DI DALAM CI95 block [0,0223; 0,0340]. Apa artinya?",
          options: [
            { text: "Parametrik terbukti salah — ia di luar CI iid, jadi metode normal ditolak", why: "Salah: CI iid adalah CI yang terlalu sempit untuk data ber-autokorelasi — «di luar CI iid» bukan vonis atas parametrik, melainkan gejala CI-nya yang palsu. CI block yang jujur mencakup 0,0328." },
            { text: "Tidak ada artinya — CI hanya mengukur sampling, jadi perbandingan metode tidak boleh memakai CI", why: "Salah: justru itulah gunanya CI — ia berkata apakah selisih antar-metode (0,0042) lebih besar dari noise sampling atau tidak. CI iid berkata «lebih besar», CI block berkata «masih di dalam noise» — dan CI block-lah yang benar untuk data ini." },
            { text: "Begitu dependensi waktu diakui (CI block), perbedaan HS vs param tidak lagi «di luar noise» — kesimpulan yang tadinya tajam menjadi lebih hati-hati; itulah harga kejujuran CI yang benar", why: "Benar: batas atas CI block 0,0340 melintasi 0,0328 (interval block MENCANGKUP param), sementara batas atas CI iid 0,0322 tidak mencapainya. Satu pilihan (iid vs block) membalik kesimpulan — dan data (0,1043 [M4.3]) menentukan pilihan yang benar.", correct: true },
            { text: "Parametrik terbukti benar — ia di dalam CI block, jadi normal adalah asumsi yang tepat", why: "Salah: «di dalam CI» bukan «terbukti benar» — CI block mencakup 0,0328 hanya berarti selisihnya masih di dalam noise sampling. ES99 hist 0,0775 vs param 0,0528 tetap menunjukkan normal menipiskan ujung ekor." },
          ],
        },
        {
          q: "Mean daily return −0,0006 dengan CI95 bootstrap (iid) [−0,0024; +0,0012]. Apa kesimpulan yang benar?",
          options: [
            { text: "Portofolio cenderung turun — mean-nya negatif, jadi drift-nya negatif", why: "Salah: CI-nya mencakup 0 — drift negatif TIDAK TERBUKTI berbeda dari nol. Rata-rata negatif itu bisa jadi noise dari 480 hari yang kebetulan berisi crash Oktober 2026." },
            { text: "Drift negatif tidak signifikan — CI mencakup 0, jadi data tidak cukup bukti untuk mengklaim mean return berbeda dari nol (bukan berarti mean-nya terbukti nol)", why: "Benar: «tidak ada bukti» ≠ «bukti tidak ada». Dan wajar: sd harian 0,0196 adalah ≈33 kali lebih besar dari mean-nya — dengan μ terbulat 0,0006; dengan μ eksak ≈35 kali (0,0196/0,0006 ≈ 32,7; 0,0196172/0,000558 ≈ 35,2 [m9_canonical.json]) — 480 hari belum cukup untuk membuktikan drift sekecil itu.", correct: true },
            { text: "Mean return-nya nol — CI mencakup 0, jadi titik −0,0006 harus dibuang dan diganti 0", why: "Salah: CI yang mencakup 0 tidak membuktikan nilainya nol — ia hanya tidak membuktikan berbeda dari nol. Titik −0,0006 tetap estimasi terbaikmu; yang berubah adalah keyakinanmu padanya." },
            { text: "Mean return tidak penting — ia hanya menggeser VaR sebesar 0,0006, jadi abaikan saja", why: "Salah: mean memang hampir tidak penting untuk VaR 1-hari, tetapi ia penting untuk horizon panjang — dan CI-nya berkata «kamu belum tahu tandanya». Ketidaktahuan itu harus ditulis, bukan disembunyikan." },
          ],
        },
        {
          q: "Lab 2 (B=2.000): lebar CI block 0,0111 [lab] > lebar CI iid 0,0093. Mengapa lab ini menilai PERBANDINGAN lebar, bukan nilai eksak CI-nya?",
          options: [
            { text: "Karena nilai eksak CI tidak penting — yang penting hanya blok lebih lebar", why: "Salah: nilai eksak CI penting (kanonis B=10.000: iid [0,0229; 0,0322], block [0,0223; 0,0340]) — tetapi lab memakai B=2.000 agar ringan di browser, jadi CI lab sedikit lebih berisik dari kanonis. Perbandingan lebarlah yang stabil terhadap B." },
            { text: "Karena B lab (2.000) ≠ B kanonis (10.000), CI lab sedikit lebih berisik — tetapi perbandingan lebar (block > iid) tetap terlihat dan stabil; nilai eksak dicek terhadap kanonis di notebook, bukan di lab", why: "Benar: batas bawah CI block lab (0,0229) sedikit berbeda dari kanonis (0,0223) — itu noise B=2.000, bukan kesalahan. Yang dinilai lab adalah perbandingan yang robust: 0,0111 > 0,0093.", correct: true },
            { text: "Karena Pyodide tidak bisa menghitung kuantil dengan tepat — hasilnya selalu kira-kira", why: "Salah: Pyodide + numpy menghitung kuantil dengan cara yang sama (interpolasi linear) — hasilnya deterministik dengan seed 42. Alasannya adalah B, bukan Pyodide." },
            { text: "Karena CI block dan iid dihitung dari data yang berbeda di lab", why: "Salah: keduanya dihitung dari 480 return yang sama di lab — yang berbeda hanya cara resampling-nya (blok vs satu hari). Datanya sama; metodenya yang dibandingkan." },
          ],
        },
        {
          q: "Mini-case: kamu melaporkan ke komite. Kalimat mana yang benar?",
          options: [
            { text: "«VaR95 0,0286» — satu angka, jelas dan tidak membingungkan komite", why: "Salah: satu angka tanpa metode dan jendela tidak bisa diaudit — ia bisa 0,0283 (120 hari), 0,0311 (250 hari), atau 0,0328 (parametrik) dari data yang sama." },
            { text: "«VaR95 0,0284 ± 0,0022» — mean bootstrap beserta ketidakpastiannya", why: "Salah: «± sd» menyajikan sd bootstrap sebagai ketidakpastian mean — kesalahan M6.2/M6.5. Yang benar adalah interval, bukan «mean ± sd»." },
            { text: "«VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; param 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk»", why: "Benar: angka + interval + metode + pembanding + ES — tiap potongnya tertelusur ke kanonis (0,0286; [0,0223; 0,0340]; 0,0328 [M4.2]; 0,0445) dan CI-nya memakai block karena data ber-autokorelasi (0,1043 [M4.3]).", correct: true },
            { text: "«VaR95 0,0286 — ekor gemuk, jadi VaR hist pasti lebih besar dari param»", why: "Salah dua kali: VaR hist 0,0286 LEBIH KECIL dari param 0,0328 (bukan lebih besar), dan kalimat itu tidak menyebut CI maupun ES — komite tidak tahu seberapa goyah angkanya dan seberapa buruk bila VaR terlampaui." },
          ],
        },
        {
          q: "Block bootstrap VaR95 (B=10.000, seed 42) [notebook]: blok 5 → CI95 [0,0229; 0,0335], lebar 0,0106; blok 10 → [0,0223; 0,0340], lebar 0,0117; blok 20 → [0,0223; 0,0353], lebar 0,0130. Apa yang benar tentang panjang blok?",
          options: [
            { text: "Lebar CI melebar monoton dengan panjang blok (+22,6% dari 5 ke 20 [turunan]) — terutama dari sisi atas (0,0335 → 0,0340 → 0,0353); blok lebih panjang menjaga dependensi lebih baik tetapi menawarkan blok distinct lebih sedikit (476 → 471 → 461), dan panjang blok dipilih dari struktur data, BUKAN dari hasil CI-nya", why: "Benar: trade-off-nya dua arah — dependensi vs variasi antar-draw. Blok 10 [kebijakan lesson ini] adalah kompromi (cukup panjang untuk gerombol beberapa hari, 471 blok distinct), dan hitungan ulang blok 10 (sd 0,0028 vs kanonis 0,0029) mereproduksi kanonis dalam noise MC.", correct: true },
            { text: "Pilih blok 5 — CI-nya paling sempit, jadi paling presisi", why: "Salah: CI sempit dari blok yang terlalu pendek adalah CI yang PALSU — blok 5 nyaris iid dan tidak menjaga autokorelasi kuadrat lag-1 0,1043 [M4.3]; sempit bukan presisi bila dependensinya diabaikan.", correct: false },
            { text: "Pilih blok 20 — makin panjang makin benar", why: "Salah: blok 20 hanya punya 24 blok per draw dan 461 blok distinct — tiap draw makin mirip satu sama lain; dan tidak ada panjang blok yang menjaga pergeseran rezim (langkah 9). Lebih panjang bukan lebih benar — ia pilihan dengan trade-off.", correct: false },
            { text: "Blok 10 hitungan ulang (sd 0,0028) membuktikan kanonis (sd 0,0029) salah", why: "Salah: selisih 0,0001 adalah noise MC antar-stream (stream segar per panjang [notebook]) — CI-nya sama persis [0,0223; 0,0340]. Hitungan ulang MEREPRODUKSI kanonis, bukan membantahnya.", correct: false },
          ],
        },
        {
          q: "Pipeline M8→M9: champion GBM terkalibrasi (ROC-AUC 0,7816 [M8.1]) + threshold 0,10 → approved NT$424.180.000 dari total LIMIT NT$1.007.777.680 (42,09% [M8.2]); EAD = LIMIT_BAL → EL approved NT$11.989.453 [M8.2]. Di dunia pasar, distribusi return 480 hari → VaR95 HS 0,0286, ES95 0,0445. Apa hubungan yang benar antara kedua dunia itu?",
          options: [
            { text: "Satu POLA, dua perhitungan: M8 mengisi mata rantai 1–3 (champion → exposure → distribusi kerugian kredit), M9 mengisi mata rantai 4–5 (VaR/ES → limit) dengan contoh pasar — VaR95 0,0286 TIDAK dihitung dari EL NT$11.989.453; yang sama adalah workflow-nya", why: "Benar: pipeline adalah pola kerja, bukan satu perhitungan berantai. Bila threshold berubah tanpa revalidasi, angka di ujungnya adalah angka yatim — di dunia mana pun ia tinggal.", correct: true },
            { text: "VaR95 0,0286 dihitung dari EL approved NT$11.989.453 — rantai M8→M9 adalah satu perhitungan berantai", why: "Salah: VaR pasar dihitung dari return saham (480 hari), EL kredit dari default nasabah — dua distribusi yang berbeda. Yang sama adalah POLANYA, bukan angkanya.", correct: false },
            { text: "M9 memvalidasi M8 — VaR95 0,0286 membuktikan champion ROC-AUC 0,7816 sudah benar", why: "Salah arah: VaR dihitung DARI distribusi kerugian yang dihasilkan champion — ia tidak bisa memvalidasi pembuatnya; validasi champion adalah tugas M8.1 (halves, ECE 0,0087), bukan M9.", correct: false },
            { text: "Pipeline berarti limit pasar bisa langsung diambil dari EL kredit NT$78.675.378", why: "Salah: EL semua test NT$78.675.378 [M8.2] adalah kerugian kredit yang diharapkan — limit pasar diambil dari VaR/ES pasar (0,0286/0,0445), bukan dari EL kredit; mencampur keduanya adalah kesalahan unit yang sama dengan mencampur Rp dan NT$.", correct: false },
          ],
        },
        {
          q: "VaR95 1-hari HS 480 hari = 0,0286; backtest-nya rolling-250 (OOS 230 hari, 15 exceedance, Kupiec p = 0,3108). Sekarang komite meminta VaR95 10-hari. Apa yang berubah pada desain jendelanya?",
          options: [
            { text: "Horizon menjadi 10 hari, tetapi estimation window tetap 480 hari (via MC paths M9.1, bukan skala √10 mentah — 0,0903 meremehkan ekor vs MC 0,1038); backtest 10-hari hanya punya 48 jendela non-overlapping [turunan] — Kupiec hampir tidak punya kuasa; HS 10-hari butuh return 10-hari", why: "Benar: horizon ≠ estimation window ≠ backtest window — mengganti horizon tidak otomatis mengganti ketiganya, dan backtest 10-hari dari 480 hari hampir tidak punya kuasa (48 jendela, diharapkan 2,4 exceedance [turunan]).", correct: true },
            { text: "Semua jendela diganti ke 10 hari — estimation 10 hari, backtest 10 hari, HS 10 hari", why: "Salah: estimation window 10 hari hanya punya 10 observasi — kuantil 5% dari 10 observasi tidak terdefinisi dengan baik; horizon 10 hari TIDAK berarti semua jendela menjadi 10 hari.", correct: false },
            { text: "Skala saja VaR 1-hari dengan √10 menjadi 0,0903 — selesai, tidak ada yang berubah", why: "Salah: √10-hist 0,0903 meremehkan ekor 10-hari (MC 0,1038) — terutama karena titik awal historis 0,0286 di bawah parametrik/MC dan drift negatif terakumulasi (M9.1 langkah 8); dan backtest 10-hari tetap butuh jendela 10-hari.", correct: false },
            { text: "Ganti unit observasi ke return mingguan (n=96) supaya horizon 10 hari «lebih pas»", why: "Salah: mengganti unit observasi dari harian (n=480) ke mingguan (n=96 [turunan]) MEMPERKECIL sampel — kuantil 5% dari 96 observasi hanya 5 hari terburuk; horizon dan unit observasi adalah pilihan yang berbeda.", correct: false },
          ],
        },
        {
          q: "Template artefak keputusan lintas-metode (M9.5 langkah 16) punya delapan baris [kebijakan lesson ini], termasuk verdict satu kata (LOLOS / LOLOS-BERSYARAT / TIDAK LOLOS). Template model card M8.3 sudah punya 17 kolom wajib. Apa hubungan yang benar antara keduanya?",
          options: [
            { text: "Artefak keputusan TIDAK menduplikasi model card: identitas model (nama, versi, pemilik, intended users, prohibited use) tetap di M8.3; artefak ini hanya berisi keputusan atas angka lintas-metode (VaR95 + CI + ES95 + validasi + verdict + tindak lanjut)", why: "Benar: dua artefak, dua pertanyaan — model card menjawab «model ini APA», artefak keputusan menjawab «dengan angka-angka ini, KEPUTUSAN apa». Menduplikasi field yang sama berarti dua sumber kebenaran yang akan berbeda.", correct: true },
            { text: "Salin semua 17 kolom model card ke artefak keputusan supaya satu halaman memuat semuanya", why: "Salah: menduplikasi field berarti dua sumber kebenaran — begitu satu berubah dan satunya tidak, keduanya bertentangan dan tidak ada yang tahu mana yang benar. Cross-ref, jangan duplikasi.", correct: false },
            { text: "Artefak keputusan menggantikan model card — M8.3 tidak perlu lagi", why: "Salah: model card mendokumentasikan MODEL (asumsi, data, batas); artefak keputusan mendokumentasikan KEPUTUSAN pada satu tanggal atas angka-angka tertentu. Keduanya dibutuhkan — dan bila bertentangan, yang terbaru menang dan ketidaksesuaiannya dicatat di issue register (M8.1 langkah G3).", correct: false },
            { text: "Verdict boleh dikosongkan bila angkanya «masih diperdebatkan»", why: "Salah: verdict yang tidak ditulis adalah keputusan yang tidak diambil — bila angkanya diperdebatkan, verdict-nya adalah «TIDAK LOLOS» atau «LOLOS-BERSYARAT» dengan alasan satu kalimat, bukan kosong.", correct: false },
          ],
        },
        {
          q: "Operating loop M9 (langkah 17): Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur lagi. Backtest gagal: Kupiec lolos (p = 0,3108) tetapi independence gagal (p = 0,0099) dan severity 1,1163 (M9.3). Apa langkah yang benar?",
          options: [
            { text: "Kembali ke UKUR dengan jendela/generator baru (jendela lebih pendek, pembobotan eksponensial, atau generator kondisional) — lalu Uji lagi; JANGAN kembali ke Putuskan dengan ambang yang dilonggarkan", why: "Benar: loop yang sehat memperbaiki PENGUKURAN; melonggarkan ambang agar model «lolos» adalah scenario shopping (M9.2 langkah 12) dengan baju baru.", correct: true },
            { text: "Longgarkan ambang Kupiec (mis. terima p = 0,0099 sebagai «cukup lolos») supaya verdict menjadi LOLOS", why: "Salah: itu scenario shopping — ambang diubah karena hasilnya tidak nyaman, bukan karena datanya berubah. Verdict yang benar adalah TIDAK LOLOS (M9.3 mini-case), lalu kembali ke Ukur.", correct: false },
            { text: "Loop berhenti di Revalidasi — model sudah direvalidasi, selesai", why: "Salah: revalidasi adalah pintu kembali ke Ukur, bukan garis finis — data baru (480 hari menjadi 1.000) berarti Ukur lagi dari awal.", correct: false },
            { text: "Langsung ke Pantau — drift PSI akan menangkap masalahnya nanti", why: "Salah: Pantau mengawasi model yang SUDAH diputuskan; model yang gagal Uji tidak boleh diputuskan — ia kembali ke Ukur. Melewatkan Uji berarti memantau model yang sudah diketahui gagal.", correct: false },
          ],
        },
      ],
      summary: [
        "Tiga jawaban VaR95 atas data yang sama (SIMPLE returns, n=480): HS (480 hari) 0,0286, parametrik [M4.2] 0,0328, Monte Carlo [M9.1] 0,0329 (N=100.000), bootstrap mean 0,0284 — VaR bukan satu bilangan, melainkan keluaran dari satu metode atas satu data.",
        "Historical simulation = kuantil empiris, tanpa asumsi distribusi: VaR95 0,0286, ES95 0,0445 (24 hari terburuk), VaR99 0,0479, ES99 0,0775 (sekitar 5 hari); Rp per Rp100 juta: VaR95 Rp2.860.000, ES95 Rp4.450.000.",
        "Jendela HS mengubah jawaban: 120 hari → VaR95 0,0283, ES95 0,0557; 250 hari → 0,0311 / 0,0467; 480 hari → 0,0286 / 0,0445 — VaR95 bergerak 0,0028 (sekitar 10%); ES95 jendela 120 hari 25% lebih besar karena hari −0,1398 (2026-10-16 [M9.2]) berbobot empat kali lebih besar.",
        "Parametrik [M4.2]: VaR95 0,0328, ES95 0,0410, VaR99 0,0462, ES99 0,0528 — VaR95 hist LEBIH KECIL dari param, tetapi ES95 hist LEBIH BESAR dari param dan ES99 hist (0,0775) jauh di atas param (0,0528): kuantil 5% empiris lebih kecil dari normal, ekor DI BALIK VaR lebih gemuk dari normal.",
        "Bootstrap iid (B=10.000, seed 42): VaR95 mean 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]; ES95 mean 0,0440, sd 0,0057, CI95 [0,0346; 0,0569] — CI mengukur ketidakpastian SAMPLING; laporkan intervalnya, bukan «mean ± sd».",
        "Block bootstrap (blok 10 [kebijakan lesson ini], B=10.000, seed 42): VaR95 mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0340]; ES95 mean 0,0440, sd 0,0062, CI95 [0,0333; 0,0572] — sd naik +32% karena autokorelasi kuadrat lag-1 0,1043 [M4.3]; CI block MENCANGKUP VaR95 param 0,0328, CI iid tidak.",
        "Tabel tiga arah: HS untuk n besar tanpa asumsi; parametrik untuk stabilitas dan ekor yang belum terjadi; Monte Carlo [M9.1] sebagai pembanding; bootstrap untuk pitanya — selisih antar-metode adalah informasi, bukan gangguan.",
        "Bootstrap untuk metrik lain: mean daily return −0,0006, CI95 (iid) [−0,0024; +0,0012] — mencakup 0, drift negatif TIDAK signifikan; pola yang sama dengan [M8.1] (bad rate, ECE, profit beserta CI-nya).",
        "Jebakan: bootstrap iid pada data ber-autokorelasi = CI terlalu sempit (0,0093 vs 0,0117); block bukan obat mujarab — panjang blok adalah pilihan [kebijakan lesson ini] dan ia tidak menjaga pergeseran rezim.",
        "Lab: sensitivitas jendela (var95_range 0,0028; es95_gap_w120_w480 0,0112; hs_param_es95_gap −0,0035; es95_hist_gt_param True) dan bootstrap B=2.000 (lebar CI block 0,0111 [lab] > lebar CI iid 0,0093).",
        "Mini-case: «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; param 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk».",
        "Memilih panjang blok (langkah 13) [notebook]: blok 5/10/20 → lebar CI 0,0106/0,0117/0,0130 (+22,6% dari 5 ke 20 [turunan]); blok 10 hitungan ulang mereproduksi kanonis (sd 0,0028 vs 0,0029).",
        "Pipeline M8→M9 (langkah 14, figure): satu pola, dua dunia — champion [M8.1] → exposure [M8.2] → distribusi kerugian → VaR/ES → limit; VaR95 0,0286 TIDAK dihitung dari EL NT$11.989.453.",
        "Kerangka horizon (langkah 15): horizon ≠ estimation window ≠ backtest window ≠ HS window — 10-hari hanya punya 48 jendela non-overlapping [turunan]; 1 bulan sekitar 22 [turunan].",
        "Artefak keputusan (langkah 16) [kebijakan lesson ini]: delapan baris lintas-metode, verdict satu kata — cross-ref model card M8.3, JANGAN duplikasi field.",
        "Operating loop (langkah 17, figure): Ukur → Uji → Putuskan → Pantau → Revalidasi → Ukur — bila Uji gagal, kembali ke Ukur, bukan ke Putuskan.",
        "Roadmap pasca-track (langkah 18): empat jalur (market risk quant, model validation, credit risk, fraud/AML) + matriks gap→skill→artefak; pilih SATU jalur dan SATU artefak.",
      ],
    },
  ],
};
